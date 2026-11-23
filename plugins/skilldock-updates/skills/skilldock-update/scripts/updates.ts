import { mkdir, rmdir, lstat, realpath } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join, resolve, dirname, sep } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { repository, validateManifest, hashTree, readJSON, atomicJSON, readReceipts, newer, type Manifest } from './protocol.ts';
const day = 86_400_000;
export async function verifyCheckout(checkout: string, release: { commit: string; manifest: Manifest }) {
  validateManifest(release.manifest);
  if (!/^[a-f0-9]{40}$/.test(release.commit)) throw new Error('Invalid release commit');
  const root = await realpath(checkout);
  const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (head !== release.commit) throw new Error('Checkout commit does not match reviewed release');
  const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all', '--ignored'], { encoding: 'utf8' }).trim();
  if (dirty) throw new Error('Checkout working tree must be clean, including untracked and ignored files');
  const manifest = validateManifest(await readJSON(join(root, 'updates/manifest.json'), null));
  if (JSON.stringify(manifest) !== JSON.stringify(release.manifest)) throw new Error('Checkout manifest does not match checked release');
  for (const entry of [...manifest.skills, { name: 'skilldock-updates', path: 'plugins/skilldock-updates', hash: manifest.updaterHash }]) {
    const path = join(root, entry.path);
    if (!(await realpath(path)).startsWith(root + sep) || await hashTree(path) !== entry.hash) throw new Error('Release content mismatch: ' + entry.name);
  }
  return { status: 'verified', commit: head, version: manifest.version };
}
export async function fetchRelease(fetcher: typeof fetch = fetch): Promise<{ commit: string; manifest: Manifest }> {
  async function json(url: string) {
    const response = await fetcher(url, { signal: AbortSignal.timeout(2500), redirect: 'error', headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error('Release check unavailable: HTTP ' + response.status);
    const text = await response.text();
    if (text.length > 150_000) throw new Error('Release response too large');
    return JSON.parse(text);
  }
  const ref = await json(`https://api.github.com/repos/${repository}/git/ref/heads/main`);
  const commit = ref.object?.sha;
  if (ref.object?.type !== 'commit' || !/^[a-f0-9]{40}$/.test(commit)) throw new Error('Invalid release commit');
  const manifest = validateManifest(await json(`https://raw.githubusercontent.com/${repository}/${commit}/updates/manifest.json`));
  return { commit, manifest };
}
export async function plan(destination: string, manifest: Manifest) {
  validateManifest(manifest);
  const receipts = await readReceipts(destination);
  const entries = [];
  for (const e of manifest.skills) {
    const target = join(destination, e.name);
    try { await lstat(target); } catch (err) { if ((err as NodeJS.ErrnoException).code === 'ENOENT') continue; throw err; }
    const hash = await hashTree(target), receipt = receipts[e.name];
    const status = !receipt ? 'unmanaged' : hash !== receipt.hash ? 'local-changes' : hash === e.hash ? 'current' : newer(manifest.version, receipt.version) ? 'update' : 'not-newer';
    entries.push({ name: e.name, status, installedVersion: receipt?.version ?? null, latestVersion: manifest.version });
  }
  return entries;
}
export async function check(options: { destination: string; data: string; session?: string; force?: boolean; now?: number; fetcher?: typeof fetchRelease; pluginRoot?: string }) {
  const { destination, data, session, force } = options, now = options.now ?? Date.now();
  await mkdir(data, { recursive: true, mode: 0o700 });
  const lock = join(data, '.check-lock');
  try { await mkdir(lock); } catch (e) { if ((e as NodeJS.ErrnoException).code === 'EEXIST') return { status: 'busy' }; throw e; }
  try {
    const cacheFile = join(data, 'check.json');
    let cache = await readJSON(cacheFile, {});
    if (!cache || typeof cache !== 'object' || Array.isArray(cache)) throw new Error('Invalid update cache');
    const fresh = Number.isFinite(cache.checkedAt) && now >= cache.checkedAt && now - cache.checkedAt < day;
    if (force || !fresh) {
      try {
        const release = await (options.fetcher ?? fetchRelease)();
        validateManifest(release.manifest);
        if (!/^[a-f0-9]{40}$/.test(release.commit)) throw new Error('Invalid release commit');
        cache = { checkedAt: now, ...release, notified: JSON.stringify(cache.manifest) === JSON.stringify(release.manifest) ? cache.notified ?? [] : [] };
      } catch {
        // Do not turn a failed check into a claim that installed skills are current.
        cache = { ...cache, checkedAt: now, unavailable: true };
      }
      await atomicJSON(cacheFile, cache);
    }
    if (cache.unavailable) return { status: 'unavailable' };
    validateManifest(cache.manifest);
    if (!/^[a-f0-9]{40}$/.test(cache.commit) || !Array.isArray(cache.notified) || cache.notified.some((s: unknown) => typeof s !== 'string')) throw new Error('Invalid update cache');
    const entries = await plan(destination, cache.manifest);
    if (options.pluginRoot) {
      const plugin = await readJSON(join(options.pluginRoot, 'plugin.json'), null);
      if (plugin?.name === 'skilldock-updates' && newer(cache.manifest.version, plugin.version) && await hashTree(options.pluginRoot) !== cache.manifest.updaterHash) entries.push({ name: 'skilldock-updates', status: 'plugin-review', installedVersion: plugin.version, latestVersion: cache.manifest.version });
    }
    const updates = entries.filter(e => ['update', 'plugin-review'].includes(e.status));
    const notify = !!session && !!updates.length && !cache.notified.includes(session);
    if (notify) {
      cache.notified = [...cache.notified, session].slice(-100);
      await atomicJSON(cacheFile, cache);
    }
    return { status: 'ok', commit: cache.commit, version: cache.manifest.version, entries, notify };
  } finally { await rmdir(lock); }
}
async function main() {
  const [command = 'check', ...args] = process.argv.slice(2);
  const home = process.env.CODEX_HOME || join(homedir(), '.codex');
  if (command === 'verify-checkout' && args.length === 1) {
    const cache = await readJSON(join(home, 'extension-data/skilldock-updates/check.json'), null);
    if (!cache || cache.unavailable) throw new Error('No checked release available');
    console.log(JSON.stringify(await verifyCheckout(args[0], cache))); return;
  }
  if (!['check', 'hook'].includes(command) || args.some(a => a !== '--force')) throw new Error('Use check [--force], hook or verify-checkout <path>');
  // A custom discovery destination is explicitly configured by the user.
  const config = await readJSON(join(home, 'extension-data/skilldock-updates/config.json'), {});
  const destination = resolve(config.destination || join(home, 'skills'));
  let session: string | undefined;
  if (command === 'hook') {
    let input = ''; for await (const chunk of process.stdin) { input += chunk; if (input.length > 100_000) return; }
    const value = JSON.parse(input || '{}');
    if (typeof value.session_id === 'string' && value.session_id.length < 500) session = value.session_id;
    if (!session) return;
  }
  const candidate = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
  const plugin = await readJSON(join(candidate, 'plugin.json'), null);
  const result = await check({ destination, data: join(home, 'extension-data/skilldock-updates'), session, force: args.includes('--force'), pluginRoot: plugin?.name === 'skilldock-updates' ? candidate : undefined });
  if (command === 'check') console.log(JSON.stringify(result, null, 2));
  else if (result.status === 'ok' && result.notify) console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: `SkillDock ${result.version} updates available for: ${result.entries!.filter(e=>['update', 'plugin-review'].includes(e.status)).map(e=>e.name).join(', ')}. At a safe pause, use $skilldock-update to offer the specific update. Do not install without consent or repeat an offer already shown or declined in this chat. Preserve the user's task. Source commit for review: ${result.commit}.` } }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(e => {
  if (process.argv[2] !== 'hook') { console.error((e as Error).message); process.exitCode = 1; }
});
