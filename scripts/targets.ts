import { lstat, realpath } from 'node:fs/promises';
import { join, resolve, dirname, basename, sep } from 'node:path';
import { homedir } from 'node:os';
import { discovery, legacyHome, hasSkillDock, type Host } from '../runtime/paths.ts';
export type Target = { host: Host | 'legacy'; destination: string };
export async function validateTargets(targets: Target[]) {
  if (!targets.length) throw new Error('At least one target is required');
  const paths = await Promise.all(targets.map(t => canonical(resolve(t.destination))));
  for (let i=0; i<paths.length; i++) for (let j=0; j<i; j++) if (paths[i]===paths[j] || paths[i].startsWith(paths[j]+sep) || paths[j].startsWith(paths[i]+sep)) throw new Error('Target destinations must not overlap');
}
async function canonical(p: string): Promise<string> {
  try { return await realpath(p); } catch(e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; return join(await canonical(dirname(p)), basename(p)); }
}
export async function resolveTargets(options: { target?: string; dest?: string; codexDest?: string; claudeDest?: string; env?: NodeJS.ProcessEnv; home?: string }): Promise<Target[]> {
  const env = options.env ?? process.env, home = options.home ?? homedir();
  if (options.target && !['codex', 'claude', 'all'].includes(options.target)) throw new Error('Unknown target');
  if (options.target === 'all' && options.dest) throw new Error('--dest is ambiguous with --target all; use --codex-dest and --claude-dest');
  if (options.target !== 'all' && (options.codexDest || options.claudeDest)) throw new Error('Per-host destinations require --target all');
  const legacy = join(legacyHome(env, home), 'skills'), native = discovery('codex', env, home);
  async function codex() {
    const old = await hasSkillDock(legacy);
    const current = await hasSkillDock(native);
    if (old && current && resolve(legacy) !== resolve(native)) throw new Error('Ambiguous Codex installations in legacy and native discovery paths; select --dest explicitly');
    return old ? legacy : native;
  }
  let targets: Target[];
  if (!options.target) targets = [{ host: 'legacy', destination: resolve(options.dest || legacy) }];
  else if (options.target === 'all') targets = [{ host: 'codex', destination: resolve(options.codexDest || await codex()) }, { host: 'claude', destination: resolve(options.claudeDest || discovery('claude', env, home)) }];
  else targets = [{ host: options.target as Host, destination: resolve(options.dest || (options.target === 'codex' ? await codex() : discovery('claude', env, home))) }];
  await validateTargets(targets);
  return targets;
}
