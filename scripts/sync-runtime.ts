import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { repoRoot } from './catalog.ts';
export const runtimeCopies = ['plugins/skilldock-english/skills/skilldock-english/scripts/_shared/paths.ts', 'plugins/skilldock-updates/skills/skilldock-update/scripts/_shared/paths.ts'];
const content = '// Generated from runtime/paths.ts by scripts/sync-runtime.ts. Do not edit.\n' + await readFile(join(repoRoot,'runtime/paths.ts'),'utf8');
for(const path of runtimeCopies) {
  const file=join(repoRoot,path);
  if(process.argv.includes('--check')) { if(await readFile(file,'utf8')!==content)throw new Error('Stale bundled runtime: '+path); }
  else {await mkdir(join(file,'..'),{recursive:true});await writeFile(file,content);}
}
console.log('Bundled runtime: '+(process.argv.includes('--check')?'verified':'generated'));
// Client manifests are generated metadata, not independently edited skill sources.
for(const name of ['skilldock-english','skilldock-updates']) {
  const source=JSON.parse(await readFile(join(repoRoot,'plugins',name,'plugin.json'),'utf8'));
  const native: Record<string,unknown>={name:source.name,version:source.version,description:source.description,author:source.author};
  if(name==='skilldock-updates')native.hooks='./hooks/claude.json';
  const file=join(repoRoot,'plugins',name,'.claude-plugin/plugin.json');
  const value=JSON.stringify(native,null,2)+'\n';
  if(process.argv.includes('--check')) {if(await readFile(file,'utf8')!==value)throw new Error('Stale Claude metadata: '+name);}
  else {await mkdir(join(file,'..'),{recursive:true});await writeFile(file,value);}
}
const codexMarket=JSON.parse(await readFile(join(repoRoot,'.agents/plugins/marketplace.json'),'utf8'));
const suite=JSON.parse(await readFile(join(repoRoot,'package.json'),'utf8'));
const claudeMarket={name:codexMarket.name,owner:{name:'SkillDock maintainers'},plugins:await Promise.all(codexMarket.plugins.map(async(entry:any)=>({name:entry.name,source:entry.source.path,description:JSON.parse(await readFile(join(repoRoot,entry.source.path,'plugin.json'),'utf8')).description}))),metadata:{description:'Shared local workflows for Codex and Claude Code',version:suite.version}};
const marketFile=join(repoRoot,'.claude-plugin/marketplace.json'),marketContent=JSON.stringify(claudeMarket,null,2)+'\n';
if(process.argv.includes('--check')) {if(await readFile(marketFile,'utf8')!==marketContent)throw new Error('Stale generated Claude marketplace');}
else {await mkdir(join(marketFile,'..'),{recursive:true});await writeFile(marketFile,marketContent);}
