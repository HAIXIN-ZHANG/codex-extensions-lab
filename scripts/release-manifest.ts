import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { materializeSkill } from './artifacts.ts';
import { buildPlugin, pluginNames } from './build-plugins.ts';
import { join, relative } from 'node:path';
import { skills, repoRoot } from './catalog.ts';
import { repository, hashTree, validateManifest } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';
const version = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8')).version;
const temp=await mkdtemp(join(tmpdir(),'skilldock-release-'));
try {
const entries=[];
for(const skill of skills) {
  const path=join(temp,skill.name);await materializeSkill(skill,path);const artifact=await hashTree(path);
  entries.push({name:skill.name,path:relative(repoRoot,skill.path).split('\\').join('/'),hash:await hashTree(skill.path),artifacts:{codex:artifact,claude:artifact}});
}
const plugins: Record<string,unknown>={};
for(const name of pluginNames) {
 const path=join(temp,'plugins',name);await buildPlugin(name,path);const hash=await hashTree(path);
 plugins[name]={version,hash:await hashTree(join(repoRoot,'plugins',name)),artifacts:{codex:hash,claude:hash}};
}
const manifest = validateManifest({ schema: 1, repository, version, updaterHash: await hashTree(join(repoRoot, 'plugins/skilldock-updates')), skills: entries, plugins });
const content = JSON.stringify(manifest, null, 2) + '\n';
const output = join(repoRoot, 'updates/manifest.json');
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== content) throw new Error('Release manifest is stale; run node scripts/release-manifest.ts');
} else await writeFile(output, content);
console.log('Release manifest ' + version + ': ' + (process.argv.includes('--check') ? 'verified' : 'generated'));

} finally { await rm(temp,{recursive:true,force:true}); }
