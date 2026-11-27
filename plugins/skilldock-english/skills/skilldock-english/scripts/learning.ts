import { isMain } from './_shared/paths.ts';
import { readFile, writeFile, unlink, mkdir, stat } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { load, save, progress, summary, bundle, importBundle, requireValue, text } from './store.ts';
import { speak } from './audio.ts';
import { learningHome } from './_shared/paths.ts';

export function dataRoot() {
  return learningHome();
}
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
async function exportFiles(root: string, output: unknown, ids: unknown) {
  const prefix = resolve(text(output, 'output prefix', 4000));
  requireValue(prefix !== root && !prefix.startsWith(root + '/'), 'Export outside the live data directory');
  const archive = await bundle(root, ids);
  const docs = Object.values(archive.state.documents);
  const markdown = docs.map(d => `# ${d.title}\n\n${d.markdown}`).join('\n\n---\n\n');
  const html = `<!doctype html><html lang="en-AU"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src data:; style-src 'unsafe-inline'"><title>English learning materials</title><style>body{max-width:850px;margin:40px auto;padding:0 20px;font:18px/1.65 system-ui;color:#202124;background:#fafafa}pre{white-space:pre-wrap;font:inherit}article{margin-bottom:60px}audio{width:100%}</style><body><h1>English learning materials</h1><p>Private export · synthesized audio · manually transferred snapshot</p>${docs.map(d => `<article><h2>${escape(d.title)}</h2><pre>${escape(d.markdown)}</pre>${d.audio.map(a => `<p>${escape(a.voice)} · ${a.rate} words/minute</p><audio controls preload="none" src="data:audio/wav;base64,${archive.audio[a.filename]}"></audio>`).join('')}</article>`).join('')}</body></html>`;
  const files = [[prefix + '.json', JSON.stringify(archive, null, 2) + '\n'], [prefix + '.md', markdown + '\n'], [prefix + '.html', html]];
  for (const [path] of files) {
    try { await stat(path); throw new Error(`Export exists: ${path}; choose another prefix`); }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
  }
  await mkdir(dirname(prefix), { recursive: true, mode: 0o700 });
  const created: string[] = [];
  try {
    for (const [path, content] of files) { await writeFile(path, content, { flag: 'wx', mode: 0o600 }); created.push(path); }
  } catch (e) { for (const path of created) await unlink(path); throw e; }
  return { files: created, revision: archive.state.revision, documentCount: docs.length };
}
export async function run(command: string, input: Record<string, unknown> = {}, root = dataRoot()) {
  switch (command) {
    case 'status': return { root, ...summary(await load(root)) };
    case 'read': {
      const state = await load(root);
      const doc = typeof input.id === 'string' && Object.hasOwn(state.documents, input.id) ? state.documents[input.id] : undefined;
      requireValue(doc, 'Document not found'); return doc;
    }
    case 'save': return summary(await save(root, input));
    case 'progress': return summary(await progress(root, input));
    case 'speak': return speak(root, input);
    case 'export': return exportFiles(root, input.output, input.ids);
    case 'import': {
      const filename = resolve(text(input.file, 'archive path', 4000));
      requireValue((await stat(filename)).size <= 40_000_000, 'Archive exceeds 40 MB');
      return summary(await importBundle(root, { expectedRevision: input.expectedRevision, bundle: JSON.parse(await readFile(filename, 'utf8')) }));
    }
    default: throw new Error('Commands: status, read, save, progress, speak, export, import. Supply JSON on stdin except for status.');
  }
}
if (await isMain(import.meta.url)) {
  try {
    const command = process.argv[2] || 'status';
    let payload = '';
    if (command !== 'status') for await (const chunk of process.stdin) {
      payload += chunk; requireValue(payload.length <= 1_000_000, 'Request exceeds 1 MB');
    }
    const input = payload.trim() ? JSON.parse(payload) : {};
    requireValue(input && typeof input === 'object' && !Array.isArray(input), 'Expected a JSON object');
    process.stdout.write(JSON.stringify(await run(command, input), null, 2) + '\n');
  } catch (e) { process.stderr.write((e as Error).message + '\n'); process.exitCode = 1; }
}
