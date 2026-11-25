import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { hashTree, readReceipts, atomicJSON } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';
import { mkdtemp, readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { install } from '../scripts/install-skills.ts';

test('installer previews, refuses overwrite, backs up and updates without touching profiles', async () => {
  const home = await mkdtemp(join(tmpdir(), 'skill-install-test-'));
  const dest = join(home, 'skills');
  await writeFile(join(home, 'private-profile.md'), 'my preferences');
  assert.equal((await install(dest, ['skilldock-polish'], false, true))[0].action, 'install');
  assert.deepEqual((await readdir(home)), ['private-profile.md']);
  await install(dest, ['skilldock-polish']);
  assert.equal((await install(dest, ['skilldock-polish']))[0].action, 'unchanged');
  await writeFile(join(dest, 'skilldock-polish', 'SKILL.md'), 'personal changes');
  await assert.rejects(install(dest, ['skilldock-polish']), /already differs/);
  await install(dest, ['skilldock-polish'], true);
  const backup = (await readdir(dest + '.backups'))[0];
  assert.equal(await readFile(join(dest + '.backups', backup, 'SKILL.md'), 'utf8'), 'personal changes');
  assert.equal(await readFile(join(home, 'private-profile.md'), 'utf8'), 'my preferences');
});

test('a second installer cannot replace files while an update is active', async () => {
  const home = await mkdtemp(join(tmpdir(), 'skill-install-busy-test-'));
  const dest = join(home, 'skills');
  await mkdir(dest + '.install-lock');
  await assert.rejects(install(dest, ['skilldock-polish'], true), /installer.*busy/i);
  assert.ok(!(await readdir(home)).includes('skills'));
});

test('renaming is opt-in, previews accurately and preserves legacy edits in backups', async () => {
  const home = await mkdtemp(join(tmpdir(), 'skill-rename-test-'));
  const dest = join(home, 'skills');
  await mkdir(join(dest, 'polish'), { recursive: true });
  await writeFile(join(dest, 'polish', 'SKILL.md'), 'custom old rules');
  await install(dest, ['skilldock-polish']);
  assert.ok((await readdir(dest)).includes('polish'));
  const plan = await install(dest, ['skilldock-polish'], true, true, true);
  assert.equal(plan[0].legacyTarget, join(dest, 'polish'));
  assert.ok((await readdir(dest)).includes('polish'));
  await install(dest, ['skilldock-polish'], true, false, true);
  assert.deepEqual(await readdir(dest), ['skilldock-polish']);
  const backup = (await readdir(dest + '.backups'))[0];
  assert.equal(await readFile(join(dest + '.backups', backup, 'SKILL.md'), 'utf8'), 'custom old rules');
  assert.ok(!(await install(dest, ['skilldock-polish'], true, true, true))[0].legacyTarget);
});


test('receipt write failure restores the managed baseline and permits a protected retry', async (t) => {
  const home = await mkdtemp(join(tmpdir(), 'skill-receipt-failure-'));
  const dest = join(home, 'skills');
  const name = 'skilldock-polish';
  await install(dest, [name]);
  await writeFile(join(dest, name, 'SKILL.md'), 'previous managed release');
  const receipts = await readReceipts(dest);
  receipts[name].hash = await hashTree(join(dest, name));
  await atomicJSON(dest + '.skilldock-state/receipts.json', receipts);
  const baseline = await readFile(dest + '.skilldock-state/receipts.json', 'utf8');
  const rename = fs.rename;
  const mocked = t.mock.method(fs, 'rename', async (from, to) => {
    if (String(to) === dest + '.skilldock-state/receipts.json') throw new Error('simulated receipt failure');
    return rename(from, to);
  });
  syncBuiltinESMExports();
  try {
    await assert.rejects(install(dest, [name], true, false, false, true), /simulated receipt failure/);
  } finally {
    mocked.mock.restore();
    syncBuiltinESMExports();
  }
  assert.equal(await readFile(join(dest, name, 'SKILL.md'), 'utf8'), 'previous managed release');
  assert.equal(await readFile(dest + '.skilldock-state/receipts.json', 'utf8'), baseline);
  await install(dest, [name], true, false, false, true);
  assert.equal((await readReceipts(dest))[name].hash, await hashTree(join(dest, name)));
});
