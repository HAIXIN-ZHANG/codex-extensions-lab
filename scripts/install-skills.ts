import { mkdir, readdir, readFile, cp, rename, lstat, rmdir, rm } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { skills } from './catalog.ts';

async function exists(path: string) {
  try { await lstat(path); return true; } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return false; throw e; }
}
async function files(path: string, prefix = ''): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Refusing symlink in skill: ${entry.name}`);
    const key = prefix + entry.name;
    if (entry.isDirectory()) Object.assign(result, await files(join(path, entry.name), key + '/'));
    else result[key] = (await readFile(join(path, entry.name))).toString('base64');
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}
async function installUnlocked(destination: string, names: string[], update: boolean, dryRun: boolean) {
  const selected = names.length ? skills.filter(s => names.includes(s.name)) : skills;
  if (names.some(n => !skills.some(s => s.name === n))) throw new Error('Unknown skill name');
  const tasks: { name: string; source: string; target: string; action: string }[] = [];
  // Preflight every target before mutating any skill.
  if (await exists(destination) && (await lstat(destination)).isSymbolicLink()) throw new Error('Destination must not be a symlink');
  for (const skill of selected) {
    const target = join(destination, skill.name);
    const has = await exists(target);
    if (has && (await lstat(target)).isSymbolicLink()) throw new Error(`Refusing symlinked skill ${skill.name}`);
    const equal = has && JSON.stringify(await files(target)) === JSON.stringify(await files(skill.path));
    if (has && !equal && !update) throw new Error(`${skill.name} already differs; inspect it and use --update to back it up before replacing`);
    tasks.push({ name: skill.name, source: skill.path, target, action: equal ? 'unchanged' : has ? 'update-with-backup' : 'install' });
  }
  if (dryRun) return tasks;
  await mkdir(destination, { recursive: true, mode: 0o700 });
  for (const task of tasks) {
    if (task.action === 'unchanged') continue;
    const staged = `${destination}.stage-${task.name}-${randomUUID()}`;
    let backup: string | undefined;
    try {
      await cp(task.source, staged, { recursive: true, errorOnExist: true, force: false });
      if (task.action === 'update-with-backup') {
        const backups = destination + '.backups';
        await mkdir(backups, { recursive: true, mode: 0o700 });
        backup = join(backups, `${task.name}-${Date.now()}-${randomUUID()}`);
        await rename(task.target, backup);
      }
      try { await rename(staged, task.target); }
      catch (e) { if (backup) await rename(backup, task.target); throw e; }
    } finally {
      // This UUID path was created by this invocation, never a user directory.
      await rm(staged, { recursive: true, force: true });
    }
  }
  return tasks;
}
export async function install(destination: string, names: string[], update = false, dryRun = false) {
  destination = resolve(destination);
  if (dryRun) return installUnlocked(destination, names, update, true);
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
  const lock = destination + '.install-lock';
  try { await mkdir(lock); } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EEXIST') throw new Error('Skill installer is busy; wait for the other update to finish');
    throw e;
  }
  try { return await installUnlocked(destination, names, update, false); }
  finally { await rmdir(lock); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const destIndex = args.indexOf('--dest');
    if (destIndex >= 0 && (!args[destIndex + 1] || args[destIndex + 1].startsWith('--'))) throw new Error('--dest needs a path');
    const destination = resolve(destIndex >= 0 ? args.splice(destIndex, 2)[1] : join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills'));
    if (args.some(a => a.startsWith('--') && !['--update', '--dry-run'].includes(a))) throw new Error('Unknown option');
    const result = await install(destination, args.filter(a => !a.startsWith('--')), args.includes('--update'), args.includes('--dry-run'));
    console.log(JSON.stringify(result, null, 2));
  } catch (e) { console.error((e as Error).message); process.exitCode = 1; }
}
