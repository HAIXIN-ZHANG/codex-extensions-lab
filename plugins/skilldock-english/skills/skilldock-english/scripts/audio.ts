import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, unlink, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { load, hash, requireValue, atomic, attachAudio, audioBytes, validateWav } from './store.ts';

const exec = promisify(execFile);
type Runner = (file: string, args: string[]) => Promise<{ stdout: string }>;
export async function speak(root: string, input: Record<string, unknown>, runner: Runner = async (file, args) => {
  const result = await exec(file, args, { timeout: 120000, maxBuffer: 2_000_000 });
  return { stdout: String(result.stdout) };
}, platform = process.platform) {
  requireValue(platform === 'darwin', 'Local speech requires macOS and an installed en_AU voice. Use source audio or another authorized speech tool on this system.');
  const state = await load(root);
  requireValue(state.revision === input.expectedRevision, 'Revision conflict: reread status');
  const doc = typeof input.id === 'string' ? state.documents[input.id] : undefined;
  requireValue(doc && doc.speechText.trim(), 'Document needs English speechText before synthesis');
  const voice = typeof input.voice === 'string' ? input.voice : 'Karen';
  const rate = input.rate ?? 175;
  requireValue(Number.isInteger(rate) && Number(rate) >= 80 && Number(rate) <= 240, 'Rate must be 80–240 words/minute');
  const installed = await runner('/usr/bin/say', ['-v', '?']);
  requireValue(installed.stdout.split('\n').some(line => line.trim().startsWith(voice + ' ') && /\ben_AU\b/.test(line)), 'Requested Australian voice is not installed; no voice will be downloaded automatically');
  const cached = doc.audio.find(a => a.voice === voice && a.rate === rate && a.textHash === hash(doc.speechText));
  if (cached) {
    await audioBytes(root, cached.filename);
    return { path: join(root, 'audio', cached.filename), cached: true, revision: state.revision, synthesized: true, voice, rate };
  }
  const directory = join(root, 'audio');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  requireValue(!(await lstat(directory)).isSymbolicLink(), 'Refusing symlinked audio directory');
  const temp = join(directory, randomUUID());
  try {
    await atomic(temp + '.txt', doc.speechText);
    await runner('/usr/bin/say', ['-v', voice, '-r', String(rate), '-f', temp + '.txt', '-o', temp + '.aiff']);
    await runner('/usr/bin/afconvert', [temp + '.aiff', temp + '.wav', '-f', 'WAVE', '-d', 'LEI16']);
    const bytes = await readFile(temp + '.wav');
    validateWav(bytes);
    const filename = hash(bytes) + '.wav';
    await atomic(join(directory, filename), bytes);
    const next = await attachAudio(root, input, { filename, voice, rate: Number(rate), textHash: hash(doc.speechText) });
    return { path: join(directory, filename), cached: false, revision: next.revision, synthesized: true, voice, rate };
  } finally {
    for (const suffix of ['.txt', '.aiff', '.wav']) await unlink(temp + suffix).catch(() => {});
  }
}
