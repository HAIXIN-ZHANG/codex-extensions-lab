import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { load, save, progress, bundle, importBundle, hash, validateWav, attachAudio } from '../plugins/skilldock-english/skills/skilldock-english/scripts/store.ts';
import { run } from '../plugins/skilldock-english/skills/skilldock-english/scripts/learning.ts';
import { speak } from '../plugins/skilldock-english/skills/skilldock-english/scripts/audio.ts';

const root = () => mkdtemp(join(tmpdir(), 'english-learning-test-'));
const lesson = (expectedRevision = 0) => ({ expectedRevision, id: 'test-lesson', kind: 'scenario', title: 'Fishing / 钓鱼', markdown: 'reel：鱼轮\n<script>alert(1)</script>', speechText: 'Could you recommend a fishing rod?', vocabulary: ['reel'], sources: [] });

function mockWav(dataBytes: number, sample = 1000) {
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write('RIFF'); wav.writeUInt32LE(36 + dataBytes, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(22050, 24); wav.writeUInt32LE(44100, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(dataBytes, 40); wav.writeInt16LE(sample, 44);
  return wav;
}
test('save, resume, revise and status preserve history; generated is not read', async () => {
  const home = await root();
  await save(home, lesson());
  let s = await load(home);
  assert.equal(s.documents['test-lesson'].status, 'generated');
  await progress(home, { expectedRevision: 1, id: 'test-lesson', status: 'read' });
  await save(home, { ...lesson(2), markdown: 'Updated' });
  s = await load(home);
  assert.equal(s.documents['test-lesson'].status, 'generated');
  assert.equal(s.documents['test-lesson'].history[1].status, 'read');
  assert.equal(s.documents['test-lesson'].history.length, 2);
  assert.equal(s.documents['test-lesson'].history[0].markdown, lesson().markdown);
  await assert.rejects(progress(home, { expectedRevision: 3, id: 'test-lesson', status: 'mastered' }));
  assert.equal((await load(home)).revision, 3);
});
test('concurrent writers and stale revisions never silently clobber lessons', async () => {
  const home = await root();
  const results = await Promise.allSettled([save(home, lesson()), save(home, { ...lesson(), id: 'another' })]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(Object.keys((await load(home)).documents).length, 1);
  await assert.rejects(save(home, lesson()), /Revision conflict/);
});
test('corrupt state and malicious IDs are rejected without replacing history', async () => {
  const home = await root();
  await assert.rejects(save(home, { ...lesson(), id: '../escape' }));
  await writeFile(join(home, 'state.json'), 'not JSON');
  await assert.rejects(save(home, lesson()));
  assert.equal(await readFile(join(home, 'state.json'), 'utf8'), 'not JSON');
});
test('manual export/import round-trips; diverging lessons fail atomically', async () => {
  const home = await root(); const other = await root(); const output = await root();
  await save(home, lesson());
  const saved = await run('export', { output: join(output, 'study') }, home) as { files: string[] };
  assert.equal(saved.files.length, 3);
  const html = await readFile(join(output, 'study.html'), 'utf8');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  await assert.rejects(run('export', { output: join(output, 'study') }, home), /exists/);
  await run('import', { file: join(output, 'study.json'), expectedRevision: 0 }, other);
  assert.deepEqual((await load(other)).documents, (await load(home)).documents);
  await save(home, { ...lesson(1), markdown: 'different' });
  const b = await bundle(home);
  b.state.documents['another'] = { ...b.state.documents['test-lesson'], id: 'another', revision: 1, history: [] };
  await assert.rejects(importBundle(other, { expectedRevision: 1, bundle: b }), /Import conflict/);
  assert.equal((await load(other)).revision, 1);
  assert.ok(!(await load(other)).documents['another']);
});
test('speech WAV is cached, invalidated on text changes and exported with checksums', async () => {
  const home = await root(); const other = await root();
  await save(home, lesson());
  let calls = 0;
  const wav = mockWav(56);
  const runner = async (command: string, args: string[]) => {
    calls++;
    if (args[1] === '?') return { stdout: 'Karen               en_AU    # Hello' };
    if (command.endsWith('afconvert')) await writeFile(args[1], wav);
    return { stdout: '' };
  };
  const audio = await speak(home, { id: 'test-lesson', expectedRevision: 1 }, runner, 'darwin');
  assert.ok(!audio.cached); assert.equal(audio.revision, 2);
  const cached = await speak(home, { id: 'test-lesson', expectedRevision: 2 }, runner, 'darwin');
  assert.ok(cached.cached); assert.equal(calls, 4);
  const b = await bundle(home);
  assert.equal(b.audio[hash(wav) + '.wav'], wav.toString('base64'));
  await importBundle(other, { expectedRevision: 0, bundle: b });
  assert.deepEqual(await readFile(join(other, 'audio', hash(wav) + '.wav')), wav);
  await save(home, { ...lesson(2), speechText: 'New words' });
  assert.equal((await load(home)).documents['test-lesson'].audio.length, 0);
  assert.equal((await load(home)).documents['test-lesson'].history.length, 2);
});
test('unsupported audio, invalid archive paths and live locks fail explicitly', async () => {
  const home = await root();
  await assert.rejects(speak(home, {}, undefined, 'linux'), /macOS/);
  const b = { format: 'english-learning-v1', state: { schemaVersion: 1, revision: 0, documents: {} }, audio: { '../bad': 'abc' } };
  await assert.rejects(importBundle(home, { expectedRevision: 0, bundle: b }), /filename/);
  await mkdir(join(home, '.write-lock'));
  await assert.rejects(save(home, lesson()), /busy/);
  assert.ok(!(await readdir(home)).includes('state.json'));
});

test('selected exports carry only chosen lessons and reject missing IDs', async () => {
  const home = await root(); const output = await root();
  await save(home, lesson());
  await save(home, { ...lesson(1), id: 'another' });
  await run('export', { output: join(output, 'one'), ids: ['another'] }, home);
  const exported = JSON.parse(await readFile(join(output, 'one.json'), 'utf8'));
  assert.deepEqual(Object.keys(exported.state.documents), ['another']);
  await assert.rejects(run('export', { output: join(output, 'bad'), ids: ['missing'] }, home), /Invalid export ids/);
  assert.ok(!(await readdir(output)).includes('bad.json'));
});

test('WAV wrappers without real samples must not be reported as speech', () => {
  const empty = Buffer.alloc(80); empty.write('RIFF'); empty.write('WAVE', 8);
  assert.throws(() => validateWav(empty), /empty|silent/);
});

test('exporting one lesson does not read another lesson\'s missing audio', async () => {
  const home = await root(); const output = await root();
  await save(home, lesson());
  await save(home, { ...lesson(1), id: 'another' });
  const state = await load(home);
  state.documents['another'].audio.push({ filename: 'a'.repeat(64) + '.wav', voice: 'Karen', rate: 175, textHash: hash(state.documents['another'].speechText) });
  await writeFile(join(home, 'state.json'), JSON.stringify(state));
  await run('export', { output: join(output, 'selected'), ids: ['test-lesson'] }, home);
  const exported = JSON.parse(await readFile(join(output, 'selected.json'), 'utf8'));
  assert.deepEqual(Object.keys(exported.state.documents), ['test-lesson']);
  assert.deepEqual(exported.audio, {});
});

test('oversized combined exports leave no files and selected lessons still round-trip', async (t) => {
  const home = await root(); const output = await root(); const other = await root();
  t.after(() => Promise.all([home, output, other].map(folder => rm(folder, { recursive: true, force: true }))));
  await mkdir(join(home, 'audio'));
  for (const i of [0, 1]) {
    const id = 'lesson-' + i;
    await save(home, { ...lesson(i * 2), id });
    const wav = mockWav(15_100_000, 1000 + i);
    const filename = hash(wav) + '.wav';
    await writeFile(join(home, 'audio', filename), wav);
    await attachAudio(home, { id, expectedRevision: i * 2 + 1 }, { filename, voice: 'fixture', rate: 175, textHash: hash(lesson().speechText) });
  }
  const before = await readFile(join(home, 'state.json'), 'utf8');
  await assert.rejects(run('export', { output: join(output, 'combined') }, home), /exceeds 40 MB.*ids/);
  assert.deepEqual(await readdir(output), []);
  assert.equal(await readFile(join(home, 'state.json'), 'utf8'), before);
  for (const i of [0, 1]) {
    const prefix = join(output, 'selected-' + i);
    await run('export', { output: prefix, ids: ['lesson-' + i] }, home);
    await run('import', { file: prefix + '.json', expectedRevision: i }, other);
  }
  assert.deepEqual((await load(other)).documents, (await load(home)).documents);
});

test('exports reject single audio above the import limit before writing files', async (t) => {
  const home = await root(); const output = await root();
  t.after(() => Promise.all([home, output].map(folder => rm(folder, { recursive: true, force: true }))));
  await save(home, lesson());
  await mkdir(join(home, 'audio'));
  const wav = mockWav(24_000_000);
  const filename = hash(wav) + '.wav';
  await writeFile(join(home, 'audio', filename), wav);
  await attachAudio(home, { id: 'test-lesson', expectedRevision: 1 }, { filename, voice: 'fixture', rate: 175, textHash: hash(lesson().speechText) });
  await assert.rejects(run('export', { output: join(output, 'oversized') }, home), /Audio exceeds.*shorten/);
  assert.deepEqual(await readdir(output), []);
});
