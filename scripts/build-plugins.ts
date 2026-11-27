import { isMain } from '../runtime/paths.ts';
import { mkdir, cp, rename, rm, lstat } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { skills, repoRoot } from './catalog.ts';
import { materializeSkill } from './artifacts.ts';
export const pluginNames = ['skilldock-english', 'skilldock-updates'] as const;
export async function buildPlugin(name: string, output: string) {
  if(!pluginNames.includes(name as any))throw new Error('Unknown plugin');
  await mkdir(output, { recursive:true });
  const root=join(repoRoot,'plugins',name);
  await cp(join(root,'plugin.json'),join(output,'plugin.json'),{errorOnExist:true,force:false});
  await cp(join(root,'.claude-plugin'),join(output,'.claude-plugin'),{recursive:true,errorOnExist:true,force:false});
  if(name==='skilldock-updates')await cp(join(root,'hooks'),join(output,'hooks'),{recursive:true,errorOnExist:true,force:false});
  const skill=skills.find(s=>s.name===(name==='skilldock-updates'?'skilldock-update':'skilldock-english'))!;
  await materializeSkill(skill,join(output,'skills',skill.name));
  await cp(join(repoRoot,'LICENSE'),join(output,'LICENSE'),{errorOnExist:true,force:false});
}
export async function buildPackages(output: string) {
  output=resolve(output);
  try { await lstat(output); throw new Error('Output already exists; choose a new directory'); } catch(e) {if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  await mkdir(dirname(output),{recursive:true});
  const staging=output+'.stage-'+randomUUID();
  try {
    for(const host of ['codex','claude']) {
      for(const name of pluginNames)await buildPlugin(name,join(staging,host,'plugins',name));
      const marketplace=host==='codex'?'.agents/plugins/marketplace.json':'.claude-plugin/marketplace.json';
      await mkdir(dirname(join(staging,host,marketplace)),{recursive:true});
      await cp(join(repoRoot,marketplace),join(staging,host,marketplace));
    }
    await rename(staging,output);
  } finally {await rm(staging,{recursive:true,force:true});}
  return { output, platforms:['codex','claude'], plugins:[...pluginNames] };
}
if (await isMain(import.meta.url)) {
  try {
    if(process.argv.length!==4 || process.argv[2]!=='--out')throw new Error('Use --out <new-directory>');
    console.log(JSON.stringify(await buildPackages(process.argv[3]),null,2));
  } catch(e) {console.error((e as Error).message);process.exitCode=1;}
}
