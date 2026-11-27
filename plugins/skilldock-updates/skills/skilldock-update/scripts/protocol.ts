import { createHash, randomUUID } from 'node:crypto';
import { lstat, readdir, readFile, mkdir, rename, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
export const repository = 'HAIXIN-ZHANG/codex-extensions-lab';
export type Entry = { name: string; path: string; hash: string; sourceHash?: string; artifacts?: { codex: string; claude: string } };
export type Manifest = { schema: 1; repository: string; version: string; updaterHash: string; plugins?: Record<string, { version: string; hash: string; artifacts: { codex: string; claude: string } }>; skills: Entry[] };
export type Receipt = { hash: string; version: string; sourceHash?: string; history: { hash: string; version: string }[] };
export type Receipts = Record<string, Receipt>;
export const validHash = (s: unknown): s is string => typeof s === 'string' && /^[a-f0-9]{64}$/.test(s);
export const validVersion = (s: unknown): s is string => typeof s === 'string' && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(s);
export function newer(a: string, b: string) {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
}
export async function hashTree(path: string): Promise<string> {
  if (!(await lstat(path)).isDirectory() || (await lstat(path)).isSymbolicLink()) throw new Error('Skill must be a real directory');
  const hash = createHash('sha256');
  async function walk(dir: string, prefix = '') {
    for (const item of (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const key = prefix + item.name, file = join(dir, item.name);
      if (item.isDirectory()) await walk(file, key + '/');
      else if (item.isFile()) { const bytes = await readFile(file); hash.update(JSON.stringify([key, bytes.length]) + '\n'); hash.update(bytes); }
      else throw new Error('Unsupported entry in skill: ' + key);
    }
  }
  await walk(path); return hash.digest('hex');
}
export async function readJSON(path: string, fallback: unknown): Promise<any> {
  try { if (!(await lstat(path)).isFile() || (await lstat(path)).isSymbolicLink()) throw new Error('Invalid state file'); return JSON.parse(await readFile(path, 'utf8')); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return fallback; throw e; }
}
export async function atomicJSON(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temp = path + '.' + randomUUID();
  await writeFile(temp, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  await rename(temp, path);
}
export async function readReceipts(destination: string): Promise<Receipts> {
  const value = await readJSON(destination + '.skilldock-state/receipts.json', {});
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Invalid installation receipts');
  for (const [name, r] of Object.entries(value) as [string, any][]) {
    if (!/^skilldock-[a-z0-9-]+$/.test(name) || !r || !validHash(r.hash) || !validVersion(r.version) || !Array.isArray(r.history) || r.history.some((h:any) => !h || !validHash(h.hash) || !validVersion(h.version))) throw new Error('Invalid installation receipt');
    if (r.sourceHash !== undefined && !validHash(r.sourceHash)) throw new Error('Invalid source receipt');
  }
  return value;
}
export function validateManifest(m: any): Manifest {
  if (!m || m.schema !== 1 || m.repository !== repository || !validVersion(m.version) || !validHash(m.updaterHash) || !Array.isArray(m.skills) || !m.skills.length || m.skills.length > 100) throw new Error('Invalid release manifest');
  const names = new Set();
  for (const e of m.skills) {
    if (!e || typeof e.name !== 'string' || !/^skilldock-[a-z0-9-]+$/.test(e.name) || names.has(e.name) || !validHash(e.hash) || ![ `skills/${e.name}`, `plugins/skilldock-english/skills/${e.name}`, `plugins/skilldock-updates/skills/${e.name}` ].includes(e.path)) throw new Error('Invalid manifest skill');
    if (e.sourceHash !== undefined && !validHash(e.sourceHash)) throw new Error('Invalid source hash');
    if (e.artifacts !== undefined && (!validHash(e.artifacts.codex) || !validHash(e.artifacts.claude))) throw new Error('Invalid artifact hashes');
    names.add(e.name);
  }
  if (m.plugins !== undefined) {
    if (!m.plugins || Array.isArray(m.plugins) || typeof m.plugins !== 'object') throw new Error('Invalid plugin releases');
    for (const [name,p] of Object.entries(m.plugins) as [string,any][]) if(!['skilldock-english','skilldock-updates'].includes(name)||!p||!validVersion(p.version)||!validHash(p.hash)||!validHash(p.artifacts?.codex)||!validHash(p.artifacts?.claude))throw new Error('Invalid plugin release');
  }
  return m;
}
