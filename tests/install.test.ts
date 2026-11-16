import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { install } from '../scripts/install-skills.ts';

test('installer previews, refuses overwrite, backs up and updates without touching profiles', async () => {
  const home = await mkdtemp(join(tmpdir(), 'skill-install-test-'));
  const dest = join(home, 'skills');
  await writeFile(join(home, 'private-profile.md'), 'my preferences');
  assert.equal((await install(dest, ['polish'], false, true))[0].action, 'install');
  assert.deepEqual((await readdir(home)), ['private-profile.md']);
  await install(dest, ['polish']);
  assert.equal((await install(dest, ['polish']))[0].action, 'unchanged');
  await writeFile(join(dest, 'polish', 'SKILL.md'), 'personal changes');
  await assert.rejects(install(dest, ['polish']), /already differs/);
  await install(dest, ['polish'], true);
  const backup = (await readdir(dest + '.backups'))[0];
  assert.equal(await readFile(join(dest + '.backups', backup, 'SKILL.md'), 'utf8'), 'personal changes');
  assert.equal(await readFile(join(home, 'private-profile.md'), 'utf8'), 'my preferences');
});

test('a second installer cannot replace files while an update is active', async () => {
  const home = await mkdtemp(join(tmpdir(), 'skill-install-busy-test-'));
  const dest = join(home, 'skills');
  await mkdir(dest + '.install-lock');
  await assert.rejects(install(dest, ['polish'], true), /installer.*busy/i);
  assert.ok(!(await readdir(home)).includes('skills'));
});
