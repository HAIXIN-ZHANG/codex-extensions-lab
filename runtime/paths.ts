import { homedir } from 'node:os';
import { join, resolve, isAbsolute } from 'node:path';
import { realpath, readdir, stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export type Host = 'codex' | 'claude';
export async function isMain(meta: string, arg = process.argv[1]) {
  if (!arg) return false;
  try { return meta === pathToFileURL(await realpath(resolve(arg))).href; }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return false; throw e; }
}
export async function hasSkillDock(directory: string) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return false; throw e; }
  for (const entry of entries) {
    if (!entry.name.startsWith('skilldock-') || (!entry.isDirectory() && !entry.isSymbolicLink())) continue;
    try { if ((await stat(join(directory, entry.name, 'SKILL.md'))).isFile()) return true; }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
  }
  return false;
}
export function absolute(value: string, label: string) {
  if (!isAbsolute(value)) throw new Error(label + ' must be absolute');
  return resolve(value);
}
export function legacyHome(env: NodeJS.ProcessEnv = process.env, home = homedir()) {
  return env.CODEX_HOME ? resolve(env.CODEX_HOME) : join(home, '.codex');
}
// Shared data is opt-in. Discovery locations never determine personal data paths.
export function dataHome(env: NodeJS.ProcessEnv = process.env, home = homedir()) {
  return env.SKILLDOCK_HOME ? absolute(env.SKILLDOCK_HOME, 'SKILLDOCK_HOME') : legacyHome(env, home);
}
export function learningHome(env: NodeJS.ProcessEnv = process.env, home = homedir()) {
  return env.ENGLISH_LEARNING_HOME ? resolve(env.ENGLISH_LEARNING_HOME) : join(dataHome(env, home), 'extension-data/english-learning');
}
export function discovery(host: Host, env: NodeJS.ProcessEnv = process.env, home = homedir()) {
  return host === 'claude' ? join(env.CLAUDE_CONFIG_DIR ? absolute(env.CLAUDE_CONFIG_DIR, 'CLAUDE_CONFIG_DIR') : join(home, '.claude'), 'skills') : join(home, '.agents/skills');
}
