import { readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { skills, repoRoot } from './catalog.ts';
import { repository, hashTree, validateManifest } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';
const version = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8')).version;
const manifest = validateManifest({ schema: 1, repository, version, updaterHash: await hashTree(join(repoRoot, 'plugins/skilldock-updates')), skills: await Promise.all(skills.map(async s => ({ name: s.name, path: relative(repoRoot, s.path).split('\\').join('/'), hash: await hashTree(s.path) }))) });
const content = JSON.stringify(manifest, null, 2) + '\n';
const output = join(repoRoot, 'updates/manifest.json');
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== content) throw new Error('Release manifest is stale; run node scripts/release-manifest.ts');
} else await writeFile(output, content);
console.log('Release manifest ' + version + ': ' + (process.argv.includes('--check') ? 'verified' : 'generated'));
