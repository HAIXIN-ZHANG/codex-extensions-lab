import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { check, plan } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/updates.ts';
import { repository, validateManifest, hashTree, readReceipts, atomicJSON } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';
import { install } from '../scripts/install-skills.ts';
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'skilldock-updates-'));
  const dest = join(root, 'skills'), data = join(root, 'data');
  await install(dest, ['skilldock-polish']);
  const manifest = validateManifest({ schema: 1, repository, updaterHash: 'c'.repeat(64), version: '9.0.0', skills: [{ name: 'skilldock-polish', path: 'skills/skilldock-polish', hash: 'a'.repeat(64) }] });
  let calls = 0;
  const fetcher = async () => { calls++; return { manifest, commit: 'b'.repeat(40) }; };
  return { root, dest, data, manifest, fetcher, calls: () => calls };
}
test('release validation rejects foreign sources, traversal and duplicate entries', () => {
  const m = { schema: 1, repository, updaterHash: 'c'.repeat(64), version: '0.1.3', skills: [{ name: 'skilldock-polish', path: 'skills/skilldock-polish', hash: 'a'.repeat(64) }] };
  assert.ok(validateManifest(m));
  assert.throws(() => validateManifest({ ...m, repository: 'other/repo' }));
  assert.throws(() => validateManifest({ ...m, skills: [{ ...m.skills[0], path: '../private' }] }));
  assert.throws(() => validateManifest({ ...m, skills: [...m.skills, ...m.skills] }));
});
test('checks cache for 24h, deduplicate per session and do not install', async () => {
  const f = await fixture(), before = await hashTree(join(f.dest, 'skilldock-polish'));
  const base = { destination: f.dest, data: f.data, fetcher: f.fetcher, now: 1000 };
  assert.equal((await check({ ...base, session: 'one' })).notify, true);
  assert.equal((await check({ ...base, session: 'one' })).notify, false);
  assert.equal((await check({ ...base, session: 'two' })).notify, true);
  assert.equal(f.calls(), 1);
  await check({ ...base, now: 1000 + 86_400_000 }); assert.equal(f.calls(), 2);
  await check({ ...base, force: true, now: 1000 + 86_400_001 }); assert.equal(f.calls(), 3);
  assert.equal(await hashTree(join(f.dest, 'skilldock-polish')), before);
});
test('failed and concurrent checks stay bounded and are not reported current', async () => {
  const f = await fixture(); let calls = 0;
  const opts = { destination: f.dest, data: f.data, now: 1000, fetcher: async () => { calls++; throw new Error('offline'); } };
  assert.equal((await check(opts)).status, 'unavailable');
  assert.equal((await check(opts)).status, 'unavailable'); assert.equal(calls, 1);
  await mkdir(join(f.data, '.check-lock'));
  assert.equal((await check(opts)).status, 'busy');
});
test('local edits, missing receipts and older releases are never eligible', async () => {
  const f = await fixture();
  assert.equal((await plan(f.dest, f.manifest))[0].status, 'update');
  f.manifest.version = '0.0.1'; assert.equal((await plan(f.dest, f.manifest))[0].status, 'not-newer');
  await writeFile(join(f.dest, 'skilldock-polish/SKILL.md'), 'local edit');
  assert.equal((await plan(f.dest, f.manifest))[0].status, 'local-changes');
  await atomicJSON(f.dest + '.skilldock-state/receipts.json', {});
  assert.equal((await plan(f.dest, f.manifest))[0].status, 'unmanaged');
});
test('installer rejects edits after preview and preserves baseline history', async () => {
  const f = await fixture();
  const original = await readFile(join(f.dest, 'skilldock-polish/SKILL.md'));
  await install(f.dest, ['skilldock-polish'], true, true, false, true);
  await writeFile(join(f.dest, 'skilldock-polish/SKILL.md'), 'changed after preview');
  await assert.rejects(install(f.dest, ['skilldock-polish'], true, false, false, true), /Refusing/);
  assert.equal(await readFile(join(f.dest, 'skilldock-polish/SKILL.md'), 'utf8'), 'changed after preview');
  await writeFile(join(f.dest, 'skilldock-polish/SKILL.md'), original);
  const receipts = await readReceipts(f.dest), old = receipts['skilldock-polish'];
  old.version = '0.0.1'; await atomicJSON(f.dest + '.skilldock-state/receipts.json', receipts);
  await install(f.dest, ['skilldock-polish'], true, false, false, true);
  const after = await readReceipts(f.dest);
  assert.deepEqual(after['skilldock-polish'].history, [{ hash: old.hash, version: '0.0.1' }]);
  await install(f.dest, ['skilldock-polish'], true, false, false, true);
  assert.equal((await readReceipts(f.dest))['skilldock-polish'].history.length, 1);
});
test('same-version local installs cannot disguise a downgrade or unmanaged update', async () => {
  const f = await fixture(), receipts = await readReceipts(f.dest);
  receipts['skilldock-polish'].version = '99.0.0';
  await atomicJSON(f.dest + '.skilldock-state/receipts.json', receipts);
  await assert.rejects(install(f.dest, ['skilldock-polish'], true, false, false, true), /Refusing/);
  await atomicJSON(f.dest + '.skilldock-state/receipts.json', {});
  await assert.rejects(install(f.dest, ['skilldock-polish'], true, false, false, true), /Refusing/);
});
test('corrupt receipts are preserved and symlinked skill contents are rejected', async () => {
  const f = await fixture(), file = f.dest + '.skilldock-state/receipts.json';
  await writeFile(file, '{broken');
  await assert.rejects(install(f.dest, ['skilldock-polish'], true));
  assert.equal(await readFile(file, 'utf8'), '{broken');
  const dir = join(f.root, 'unsafe'); await mkdir(dir); await symlink(file, join(dir, 'state'));
  await assert.rejects(hashTree(dir), /Unsupported/);
});
test('the real hook CLI emits context once and handles malformed input quietly', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const f = await fixture();
  const home = join(f.root, 'home'), data = join(home, 'extension-data/skilldock-updates');
  await atomicJSON(join(data, 'config.json'), { destination: f.dest });
  await check({ destination: f.dest, data, fetcher: f.fetcher });
  const script = fileURLToPath(new URL('../plugins/skilldock-updates/skills/skilldock-update/scripts/updates.ts', import.meta.url));
  const run = (input: string) => spawnSync(process.execPath, [script, 'hook'], { input, encoding: 'utf8', env: { ...process.env, SKILLDOCK_HOME: '', CODEX_HOME: home } });
  const first = run(JSON.stringify({ session_id: 'real-session' }));
  assert.equal(first.status, 0);
  assert.match(JSON.parse(first.stdout).hookSpecificOutput.additionalContext, /skilldock-polish/);
  assert.equal(run(JSON.stringify({ session_id: 'real-session' })).stdout, '');
  assert.equal(run('{broken').stdout, '');
  assert.equal(run('{broken').status, 0);
});
test('README-only commit changes do not repeat an existing session notice', async () => {
  const f = await fixture(), opts = { destination: f.dest, data: f.data, fetcher: f.fetcher, session: 'same', now: 1000 };
  assert.equal((await check(opts)).notify, true);
  const next = await check({ ...opts, force: true, fetcher: async () => ({ manifest: f.manifest, commit: 'd'.repeat(40) }) });
  assert.equal(next.notify, false);
});
test('the optional plugin is reviewed separately from standalone skill installs', async () => {
  const f = await fixture(), pluginRoot = join(f.root, 'plugin');
  await mkdir(pluginRoot); await writeFile(join(pluginRoot, 'plugin.json'), JSON.stringify({ name: 'skilldock-updates', version: '0.1.3' }));
  const result = await check({ destination: f.dest, data: f.data, fetcher: f.fetcher, pluginRoot, session: 'plugin-review' });
  assert.equal(result.entries?.find(e => e.name === 'skilldock-updates')?.status, 'plugin-review');
  assert.equal(result.notify, true);
});
test('release verification pins commit and hashes without executing checkout code', async () => {
  const { execFileSync } = await import('node:child_process');
  const { verifyCheckout } = await import('../plugins/skilldock-updates/skills/skilldock-update/scripts/updates.ts');
  const root = await mkdtemp(join(tmpdir(), 'skilldock-release-'));
  const skill = join(root, 'skills/skilldock-polish'), plugin = join(root, 'plugins/skilldock-updates');
  await mkdir(skill, { recursive: true }); await mkdir(plugin, { recursive: true }); await mkdir(join(root, 'updates'));
  await writeFile(join(skill, 'SKILL.md'), 'release content'); await writeFile(join(plugin, 'plugin.json'), '{}');
  const manifest = validateManifest({ schema: 1, repository, version: '0.1.3', updaterHash: await hashTree(plugin), skills: [{ name: 'skilldock-polish', path: 'skills/skilldock-polish', hash: await hashTree(skill) }] });
  await writeFile(join(root, 'updates/manifest.json'), JSON.stringify(manifest));
  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init'); git('add', '.'); git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'fixture');
  const release = { commit: git('rev-parse', 'HEAD'), manifest };
  assert.equal((await verifyCheckout(root, release)).status, 'verified');
  await assert.rejects(verifyCheckout(root, { ...release, commit: 'a'.repeat(40) }), /commit/);
  await mkdir(join(root, 'scripts'));
  await writeFile(join(root, 'scripts/install-skills.ts'), 'unreviewed installer');
  await assert.rejects(verifyCheckout(root, release), /working tree/);
});

test('an offline interval does not forget an already notified session', async () => {
  const f = await fixture();
  const opts = { destination: f.dest, data: f.data, fetcher: f.fetcher, session: 'long-session' };
  assert.equal((await check({ ...opts, now: 1000 })).notify, true);
  assert.equal((await check({ ...opts, now: 1000 + 86_400_000, fetcher: async () => { throw new Error('offline'); } })).status, 'unavailable');
  assert.equal((await check({ ...opts, now: 1000 + 2 * 86_400_000 })).notify, false);
});
test('remote checks use a lightweight branch ref and pin the manifest to its commit', async () => {
  const { fetchRelease } = await import('../plugins/skilldock-updates/skills/skilldock-update/scripts/updates.ts');
  const f = await fixture(), calls: string[] = [];
  const fetcher = (async (url: string | URL | Request, options?: RequestInit) => {
    const value = String(url); calls.push(value);
    assert.equal(options?.redirect, 'error');
    if (value === `https://api.github.com/repos/${repository}/git/ref/heads/main`) return new Response(JSON.stringify({ object: { type: 'commit', sha: 'b'.repeat(40) } }));
    assert.equal(value, `https://raw.githubusercontent.com/${repository}/${'b'.repeat(40)}/updates/manifest.json`);
    return new Response(JSON.stringify(f.manifest));
  }) as typeof fetch;
  const release = await fetchRelease(fetcher);
  assert.equal(release.commit, 'b'.repeat(40)); assert.equal(calls.length, 2);
  await assert.rejects(fetchRelease((async () => new Response('not found', { status: 404 })) as typeof fetch), /HTTP 404/);
});
