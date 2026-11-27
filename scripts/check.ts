import { readFile, readdir, lstat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { skills, repoRoot } from './catalog.ts';
import { validatePlugin } from './validate-packages.ts';

for (const skill of skills) {
  const file = join(skill.path, 'SKILL.md');
  const content = await readFile(file, 'utf8');
  const header = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!header) throw new Error(`Missing frontmatter: ${skill.name}`);
  const name = header[1].match(/^name: (.+)$/m)?.[1];
  const description = header[1].match(/^description: (.+)$/m)?.[1];
  if (name !== skill.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length >= 64 || !description) throw new Error(`Invalid metadata: ${skill.name}`);
  const ui = await readFile(join(skill.path, 'agents/openai.yaml'), 'utf8');
  const short = ui.match(/short_description: "(.+)"/)?.[1];
  if (!short || short.length < 25 || short.length > 64 || !ui.includes('$' + name)) throw new Error(`Invalid UI metadata: ${name}`);
  if (!name.startsWith('skilldock-') || !ui.includes('display_name: "SkillDock · ') || !header[1].includes('collection: "SkillDock"')) throw new Error(`Invalid SkillDock namespace: ${name}`);
  if (/\bTODO\b|\[INSERT/.test(content)) throw new Error(`Unfinished scaffold: ${name}`);
  console.log(`${name}: metadata OK`);
}
async function checkLinks(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.agents'].includes(entry.name) || entry.isSymbolicLink()) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await checkLinks(path);
    else if (entry.name.endsWith('.md')) {
      const text = await readFile(path, 'utf8');
      for (const match of text.matchAll(/\]\(([^\s)]+)\)/g)) {
        const link = match[1];
        if (/^[a-z]+:|^#|^\//i.test(link)) continue;
        const target = resolve(dirname(path), decodeURIComponent(link.split('#')[0]));
        await lstat(target).catch(() => { throw new Error(`Broken local link in ${path}: ${link}`); });
      }
    }
  }
}
await checkLinks(repoRoot);
const manifest = JSON.parse(await readFile(join(repoRoot, 'plugins/skilldock-english/plugin.json'), 'utf8'));
if (manifest.name !== 'skilldock-english' || !/^\d+\.\d+\.\d+$/.test(manifest.version) || !manifest.$schema) throw new Error('Invalid plugin identity');
const marketplace = JSON.parse(await readFile(join(repoRoot, '.agents/plugins/marketplace.json'), 'utf8'));
if (marketplace.name !== 'codex-extensions-lab' || marketplace.plugins.length !== 2) throw new Error('Invalid marketplace identity');
for (const name of ['skilldock-english', 'skilldock-updates']) {
  const entry = marketplace.plugins.find((p: any) => p.name === name);
  if (!entry || resolve(repoRoot, entry.source.path) !== join(repoRoot, 'plugins', name)) throw new Error('Invalid marketplace path');
  const plugin = JSON.parse(await readFile(join(repoRoot, 'plugins', name, 'plugin.json'), 'utf8'));
  if (plugin.name !== name || !/^\d+\.\d+\.\d+$/.test(plugin.version)) throw new Error('Invalid plugin identity');
  const version = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8')).version;
  if (plugin.version !== version) throw new Error('Plugin version differs from suite version');
  await validatePlugin(join(repoRoot, 'plugins', name));
}
const hook = JSON.parse(await readFile(join(repoRoot, 'plugins/skilldock-updates/hooks/codex.json'), 'utf8'));
if (!hook.hooks.SessionStart[0].hooks[0].command.includes('/scripts/updates.ts')) throw new Error('Invalid updater hook');
console.log('Local links, plugin and marketplace identity: OK (not a full upstream schema validation)');
execFileSync(process.execPath, [join(repoRoot, 'scripts/sync-runtime.ts'), '--check'], { stdio: 'inherit' });
execFileSync(process.execPath, [join(repoRoot, 'scripts/release-manifest.ts'), '--check'], { stdio: 'inherit' });
const cases = JSON.parse(await readFile(join(repoRoot, 'evals/cases.json'), 'utf8'));
const ids = new Set<string>();
if (!Array.isArray(cases)) throw new Error('Invalid behavioral corpus');
for (const c of cases) {
  if (typeof c.id !== 'string' || ids.has(c.id) || !skills.some(s => s.name === c.skill) || typeof c.input !== 'string' || !Array.isArray(c.expect) || !c.expect.length || c.expect.some((x: unknown) => typeof x !== 'string')) throw new Error('Invalid behavioral case');
  ids.add(c.id);
}
for (const skill of skills) if (!cases.some(c => c.skill === skill.name)) throw new Error(`No behavioral scenario: ${skill.name}`);
console.log(`${ids.size} behavioral scenarios validated as data only; no model runs performed`);
