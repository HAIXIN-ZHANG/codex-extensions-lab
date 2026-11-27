import { isMain } from '../runtime/paths.ts';
import { mkdir, readFile, cp, rename, lstat, rmdir, rm, mkdtemp } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { materializeSkill } from './artifacts.ts';
import { resolveTargets, validateTargets, type Target } from './targets.ts';
import { randomUUID } from 'node:crypto';
import { skills, repoRoot } from './catalog.ts';
import { hashTree, readReceipts, atomicJSON, newer } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';

async function exists(path: string) {
  try { await lstat(path); return true; } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return false; throw e; }
}
async function installUnlocked(destination: string, names: string[], update: boolean, dryRun: boolean, migrateLegacy: boolean, managedOnly: boolean) {
  const receipts = await readReceipts(destination);
  const version = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8')).version;
  const selected = names.length ? skills.filter(s => names.includes(s.name)) : skills;
  if (names.some(n => !skills.some(s => s.name === n))) throw new Error('Unknown skill name');
  const preparedRoot = await mkdtemp(join(tmpdir(), 'skilldock-install-'));
  try {
  const prepared = new Map<string, string>();
  const sourceHashes = new Map<string, string>();
  for (const skill of selected) {
    const path = join(preparedRoot, skill.name);
    await materializeSkill(skill, path);
    prepared.set(skill.name, path);
    sourceHashes.set(skill.name, await hashTree(skill.path));
  }
  const tasks: { name: string; source: string; target: string; action: string; legacyTarget?: string }[] = [];
  // Preflight every target before mutating any skill.
  if (await exists(destination) && (await lstat(destination)).isSymbolicLink()) throw new Error('Destination must not be a symlink');
  for (const skill of selected) {
    const target = join(destination, skill.name);
    const has = await exists(target);
    if (has && (await lstat(target)).isSymbolicLink()) throw new Error(`Refusing symlinked skill ${skill.name}`);
    const equal = has && await hashTree(target) === await hashTree(prepared.get(skill.name)!);
    if (managedOnly && (!has || !receipts[skill.name] || await hashTree(target) !== receipts[skill.name].hash || newer(receipts[skill.name].version, version))) throw new Error(`Refusing unmanaged, locally changed or older-version update: ${skill.name}`);
    if (has && !equal && !update) throw new Error(`${skill.name} already differs; inspect it and use --update to back it up before replacing`);
    const legacyTarget = join(destination, skill.legacyName);
    const migrate = migrateLegacy && legacyTarget !== target && await exists(legacyTarget);
    if (migrate && (await lstat(legacyTarget)).isSymbolicLink()) throw new Error(`Refusing symlinked legacy skill ${skill.legacyName}`);
    tasks.push({ name: skill.name, source: skill.path, target, action: equal ? 'unchanged' : has ? 'update-with-backup' : 'install', ...(migrate ? { legacyTarget } : {}) });
  }
  if (dryRun) return tasks;
  await mkdir(destination, { recursive: true, mode: 0o700 });
  async function record(task: typeof tasks[number]) {
    const hash = await hashTree(task.target), previous = receipts[task.name];
    if (previous?.hash === hash && previous.version === version && previous.sourceHash === sourceHashes.get(task.name)) return;
    receipts[task.name] = { hash, version, sourceHash: sourceHashes.get(task.name), history: previous ? [...previous.history, { hash: previous.hash, version: previous.version }] : [] };
    await atomicJSON(destination + '.skilldock-state/receipts.json', receipts);
  }
  for (const task of tasks) {
    if (task.action === 'unchanged') { await record(task); continue; }
    const staged = `${destination}.stage-${task.name}-${randomUUID()}`;
    let backup: string | undefined;
    try {
      await cp(prepared.get(task.name)!, staged, { recursive: true, errorOnExist: true, force: false });
      if (task.action === 'update-with-backup') {
        const backups = destination + '.backups';
        await mkdir(backups, { recursive: true, mode: 0o700 });
        backup = join(backups, `${task.name}-${Date.now()}-${randomUUID()}`);
        await rename(task.target, backup);
      }
      try { await rename(staged, task.target); }
      catch (e) { if (backup) await rename(backup, task.target); throw e; }
      try { await record(task); }
      catch (e) {
        // Restore files to the baseline still described by the receipt.
        await rename(task.target, staged);
        if (backup) await rename(backup, task.target);
        throw e;
      }
    } finally {
      // This UUID path was created by this invocation, never a user directory.
      await rm(staged, { recursive: true, force: true });
    }
  }
  // Retire old discovery entries only after every selected new skill is installed.
  // Originals are recoverable; private profile/data keys are deliberately stable.
  for (const task of tasks) if (task.legacyTarget) {
    const backups = destination + '.backups';
    await mkdir(backups, { recursive: true, mode: 0o700 });
    const legacyName = skills.find(s => s.name === task.name)!.legacyName;
    await rename(task.legacyTarget, join(backups, `${legacyName}-renamed-${Date.now()}-${randomUUID()}`));
  }
  return tasks;
  } finally { await rm(preparedRoot, { recursive: true, force: true }); }
}
export async function install(destination: string, names: string[], update = false, dryRun = false, migrateLegacy = false, managedOnly = false) {
  destination = resolve(destination);
  if (dryRun) return installUnlocked(destination, names, update, true, migrateLegacy, managedOnly);
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
  const lock = destination + '.install-lock';
  try { await mkdir(lock); } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EEXIST') throw new Error('Skill installer is busy; wait for the other update to finish');
    throw e;
  }
  try { return await installUnlocked(destination, names, update, false, migrateLegacy, managedOnly); }
  finally { await rmdir(lock); }
}
export async function installTargets(targets: Target[], names: string[], update = false, dryRun = false, migrateLegacy = false, managedOnly = false) {
  await validateTargets(targets);
  if (dryRun) {
    const result=[]; for (const t of targets) result.push({ ...t, tasks: await installUnlocked(t.destination,names,update,true,migrateLegacy,managedOnly) }); return result;
  }
  const locks: string[] = [], completed: string[] = [];
  try {
    for (const t of [...targets].sort((a,b)=>a.destination.localeCompare(b.destination))) {
      await mkdir(dirname(t.destination), { recursive: true, mode: 0o700 });
      const lock=t.destination+'.install-lock';
      try { await mkdir(lock); } catch(e) { if((e as NodeJS.ErrnoException).code==='EEXIST') throw new Error('Skill installer is busy'); throw e; }
      locks.push(lock);
    }
    for (const t of targets) await installUnlocked(t.destination,names,update,true,migrateLegacy,managedOnly);
    const result=[];
    for (const t of targets) { result.push({ ...t, tasks: await installUnlocked(t.destination,names,update,false,migrateLegacy,managedOnly) }); completed.push(t.host); }
    return result;
  } catch(e) { throw new Error(`${(e as Error).message}; completed targets: ${completed.join(', ') || 'none'}`, { cause: e }); }
  finally { for(const lock of locks.reverse()) await rmdir(lock); }
}
if (await isMain(import.meta.url)) {
  try {
    const args=process.argv.slice(2);
    function option(flag: string) { const i=args.indexOf(flag); if(i<0)return undefined; if(!args[i+1] || args[i+1].startsWith('--'))throw new Error(flag+' needs a value'); const value=args.splice(i,2)[1]; if(args.includes(flag))throw new Error('Duplicate '+flag); return value; }
    const target=option('--target'), dest=option('--dest'), codexDest=option('--codex-dest'), claudeDest=option('--claude-dest');
    if(args.some(a=>a.startsWith('--') && !['--update','--dry-run','--migrate-legacy','--managed-only'].includes(a)))throw new Error('Unknown option');
    const targets=await resolveTargets({target,dest,codexDest,claudeDest});
    const names=args.filter(a=>!a.startsWith('--'));
    const result=target ? await installTargets(targets,names,args.includes('--update'),args.includes('--dry-run'),args.includes('--migrate-legacy'),args.includes('--managed-only')) : await install(targets[0].destination,names,args.includes('--update'),args.includes('--dry-run'),args.includes('--migrate-legacy'),args.includes('--managed-only'));
    console.log(JSON.stringify(result,null,2));
  } catch(e) { console.error((e as Error).message); process.exitCode=1; }
}
