import { readFile, readdir, lstat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { skills, repoRoot } from './catalog.ts';

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
const manifest = JSON.parse(await readFile(join(repoRoot, 'plugins/english-learning/plugin.json'), 'utf8'));
if (manifest.name !== 'english-learning' || manifest.version !== '0.1.0' || !manifest.$schema) throw new Error('Invalid plugin identity');
const marketplace = JSON.parse(await readFile(join(repoRoot, '.agents/plugins/marketplace.json'), 'utf8'));
if (marketplace.name !== 'codex-extensions-lab' || marketplace.plugins.length !== 1 || marketplace.plugins[0].name !== manifest.name || resolve(repoRoot, marketplace.plugins[0].source.path) !== join(repoRoot, 'plugins/english-learning')) throw new Error('Invalid marketplace path/identity');
console.log('Local links, plugin and marketplace identity: OK (not a full upstream schema validation)');
