import { mkdir, readFile, writeFile, rename, unlink, rmdir, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export type Status = 'generated' | 'read' | 'review';
export type Source = { title: string; url: string; checkedAt: string };
export type Audio = { filename: string; voice: string; rate: number; textHash: string };
export type Snapshot = {
  id: string; kind: 'grammar' | 'scenario' | 'plan' | 'note'; title: string;
  markdown: string; speechText: string; vocabulary: string[]; sources: Source[];
  status: Status; grammarUnit: string; revision: number; updatedAt: string;
};
export type Document = Snapshot & { history: Snapshot[]; audio: Audio[] };
export type State = { schemaVersion: 1; revision: number; documents: Record<string, Document> };
export type Bundle = { format: 'english-learning-v1'; state: State; audio: Record<string, string> };
export const hash = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
export function validateWav(bytes: Buffer) {
  requireValue(bytes.length > 44 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE', 'Invalid WAV header');
  let data: Buffer | undefined;
  let pcm16 = false;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const length = bytes.readUInt32LE(offset + 4);
    requireValue(offset + 8 + length <= bytes.length, 'Truncated WAV chunk');
    const tag = bytes.toString('ascii', offset, offset + 4);
    if (tag === 'fmt ' && length >= 16) pcm16 = bytes.readUInt16LE(offset + 8) === 1 && bytes.readUInt16LE(offset + 22) === 16;
    if (tag === 'data') data = bytes.subarray(offset + 8, offset + 8 + length);
    offset += 8 + length + (length % 2);
  }
  requireValue(pcm16 && data && data.length >= 2 && data.some(sample => sample !== 0), 'Speech engine produced empty or silent audio; no listening sample was created');
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export function requireValue(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
export function text(v: unknown, label: string, max = 100_000): string {
  requireValue(typeof v === 'string' && v.length <= max, `Invalid ${label}`); return v;
}
function id(v: unknown): string {
  requireValue(typeof v === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(v) && !['constructor', 'prototype'].includes(v), 'Invalid document id'); return v;
}
function strings(v: unknown): string[] {
  requireValue(Array.isArray(v) && v.length <= 200, 'Invalid vocabulary');
  return v.map(x => text(x, 'vocabulary entry', 500));
}
function sources(v: unknown): Source[] {
  requireValue(Array.isArray(v) && v.length <= 50, 'Invalid sources');
  return v.map(s => {
    requireValue(object(s), 'Invalid source');
    const url = text(s.url, 'source URL', 4000);
    requireValue(/^https?:\/\//.test(url) && ['http:', 'https:'].includes(new URL(url).protocol), 'Source URL must be HTTP(S)');
    const checkedAt = text(s.checkedAt, 'source date', 40);
    requireValue(Number.isFinite(Date.parse(checkedAt)), 'Invalid source date');
    return { title: text(s.title, 'source title', 500), url, checkedAt };
  });
}
function status(v: unknown): Status {
  requireValue(['generated', 'read', 'review'].includes(v as string), 'Invalid status (generated/read/review only)');
  return v as Status;
}
function snapshot(v: unknown): Snapshot {
  requireValue(object(v), 'Invalid document');
  requireValue(['grammar', 'scenario', 'plan', 'note'].includes(v.kind as string), 'Invalid kind');
  requireValue(Number.isSafeInteger(v.revision) && Number(v.revision) > 0, 'Invalid document revision');
  requireValue(Number.isFinite(Date.parse(String(v.updatedAt))), 'Invalid update date');
  return {
    id: id(v.id), kind: v.kind as Snapshot['kind'], title: text(v.title, 'title', 500),
    markdown: text(v.markdown, 'markdown'), speechText: text(v.speechText, 'speech text', 12000),
    vocabulary: strings(v.vocabulary), sources: sources(v.sources), status: status(v.status),
    grammarUnit: text(v.grammarUnit, 'grammar unit', 80), revision: Number(v.revision), updatedAt: String(v.updatedAt),
  };
}
export function validateState(v: unknown): State {
  requireValue(object(v) && v.schemaVersion === 1 && Number.isSafeInteger(v.revision) && Number(v.revision) >= 0, 'Invalid state version/revision');
  requireValue(object(v.documents) && Object.keys(v.documents).length <= 10000, 'Invalid documents');
  const documents: Record<string, Document> = {};
  for (const [key, value] of Object.entries(v.documents)) {
    const s = snapshot(value);
    requireValue(key === s.id && object(value) && Array.isArray(value.history) && Array.isArray(value.audio), 'Invalid document history/audio');
    const history = value.history.map(snapshot);
    requireValue(history.every((h, i) => h.id === key && h.revision === i + 1) && history.length === s.revision - 1, 'Non-contiguous document history');
    const audio = value.audio.map(a => {
      requireValue(object(a) && typeof a.filename === 'string' && /^[a-f0-9]{64}\.wav$/.test(a.filename), 'Invalid audio filename');
      requireValue(typeof a.textHash === 'string' && a.textHash === hash(s.speechText), 'Stale audio reference');
      requireValue(Number.isInteger(a.rate) && Number(a.rate) >= 80 && Number(a.rate) <= 240, 'Invalid audio rate');
      return { filename: a.filename, voice: text(a.voice, 'voice', 100), rate: Number(a.rate), textHash: a.textHash };
    });
    documents[key] = { ...s, history, audio };
  }
  return { schemaVersion: 1, revision: Number(v.revision), documents };
}
export const empty = (): State => ({ schemaVersion: 1, revision: 0, documents: {} });
async function noSymlink(path: string) {
  try { requireValue(!(await lstat(path)).isSymbolicLink(), `Refusing symlink: ${path}`); }
  catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
}
export async function load(root: string): Promise<State> {
  await noSymlink(root); await noSymlink(join(root, 'state.json'));
  try { return validateState(JSON.parse(await readFile(join(root, 'state.json'), 'utf8'))); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return empty(); throw e; }
}
export async function atomic(path: string, data: string | Buffer) {
  const temp = `${path}.${randomUUID()}.tmp`;
  try { await writeFile(temp, data, { mode: 0o600, flag: 'wx' }); await rename(temp, path); }
  finally { await unlink(temp).catch(() => {}); }
}
export async function mutate(root: string, expected: unknown, update: (s: State) => Promise<void> | void): Promise<State> {
  requireValue(Number.isSafeInteger(expected) && Number(expected) >= 0, 'expectedRevision from status is required');
  await noSymlink(root); await mkdir(root, { recursive: true, mode: 0o700 });
  const lock = join(root, '.write-lock');
  try { await mkdir(lock); } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EEXIST') throw new Error('Learning archive is busy; retry after the writer finishes. Do not delete a live lock.');
    throw e;
  }
  try {
    const state = await load(root);
    requireValue(state.revision === expected, 'Revision conflict: reread status before updating');
    await update(state);
    state.revision++;
    const clean = validateState(state);
    const previous = await readFile(join(root, 'state.json')).catch((e) => {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return undefined; throw e;
    });
    if (previous) await atomic(join(root, 'state.previous.json'), previous);
    await atomic(join(root, 'state.json'), JSON.stringify(clean, null, 2) + '\n');
    return clean;
  } finally { await rmdir(lock); }
}
function evolve(previous: Document, values: Partial<Snapshot>): Document {
  const { history, audio, ...old } = previous;
  const next = { ...previous, ...values, revision: previous.revision + 1, updatedAt: new Date().toISOString(), history: [...history, old] };
  if (next.speechText !== previous.speechText) next.audio = [];
  return next;
}
export async function save(root: string, input: Record<string, unknown>) {
  const key = id(input.id);
  return mutate(root, input.expectedRevision, state => {
    const old = state.documents[key];
    const values = snapshot({ ...input, revision: old ? old.revision + 1 : 1, updatedAt: new Date().toISOString(),
      status: input.status ?? old?.status ?? 'generated', speechText: input.speechText ?? '',
      vocabulary: input.vocabulary ?? [], sources: input.sources ?? [], grammarUnit: input.grammarUnit ?? '' });
    state.documents[key] = old ? evolve(old, values) : { ...values, history: [], audio: [] };
  });
}
export async function progress(root: string, input: Record<string, unknown>) {
  return mutate(root, input.expectedRevision, state => {
    const old = state.documents[id(input.id)]; requireValue(old, 'Document not found');
    state.documents[old.id] = evolve(old, { status: status(input.status) });
  });
}
export async function attachAudio(root: string, input: Record<string, unknown>, audio: Audio) {
  return mutate(root, input.expectedRevision, state => {
    const doc = state.documents[id(input.id)]; requireValue(doc && hash(doc.speechText) === audio.textHash, 'Document changed during synthesis');
    const next = evolve(doc, {});
    next.audio = [...doc.audio.filter(a => !(a.rate === audio.rate && a.voice === audio.voice)), audio];
    state.documents[doc.id] = next;
  });
}
export function summary(s: State) {
  return { schemaVersion: s.schemaVersion, revision: s.revision, documents: Object.values(s.documents).map(d => ({
    id: d.id, kind: d.kind, title: d.title, status: d.status, grammarUnit: d.grammarUnit,
    revision: d.revision, updatedAt: d.updatedAt, audioCount: d.audio.length,
  })) };
}
export async function audioBytes(root: string, filename: string) {
  requireValue(/^[a-f0-9]{64}\.wav$/.test(filename), 'Invalid audio filename');
  await noSymlink(join(root, 'audio')); await noSymlink(join(root, 'audio', filename));
  const bytes = await readFile(join(root, 'audio', filename));
  requireValue(hash(bytes) + '.wav' === filename, 'Audio checksum mismatch'); validateWav(bytes); return bytes;
}
export async function bundle(root: string): Promise<Bundle> {
  const state = await load(root); const audio: Record<string, string> = {};
  for (const d of Object.values(state.documents)) for (const a of d.audio) audio[a.filename] = (await audioBytes(root, a.filename)).toString('base64');
  return { format: 'english-learning-v1', state, audio };
}
export async function importBundle(root: string, input: Record<string, unknown>) {
  const b = input.bundle;
  requireValue(object(b) && b.format === 'english-learning-v1' && object(b.audio), 'Invalid archive');
  const incoming = validateState(b.state);
  const files = new Map<string, Buffer>();
  for (const [filename, encoded] of Object.entries(b.audio)) {
    requireValue(/^[a-f0-9]{64}\.wav$/.test(filename), 'Invalid archive audio filename');
    const bytes = Buffer.from(text(encoded, 'audio base64', 32_000_000), 'base64');
    requireValue(hash(bytes) + '.wav' === filename, 'Invalid archive audio/checksum');
    validateWav(bytes);
    files.set(filename, bytes);
  }
  for (const d of Object.values(incoming.documents)) for (const a of d.audio) requireValue(files.has(a.filename), 'Archive missing audio');
  return mutate(root, input.expectedRevision, async state => {
    // Conflict checking precedes any writes. Never pick a winner by clock time.
    for (const [key, value] of Object.entries(incoming.documents)) {
      if (state.documents[key]) requireValue(JSON.stringify(state.documents[key]) === JSON.stringify(value), `Import conflict for ${key}; choose which version to retain or give the incoming lesson a new id`);
    }
    await noSymlink(join(root, 'audio')); await mkdir(join(root, 'audio'), { recursive: true, mode: 0o700 });
    for (const [filename, bytes] of files) await atomic(join(root, 'audio', filename), bytes);
    for (const [key, value] of Object.entries(incoming.documents)) state.documents[key] = value;
  });
}
