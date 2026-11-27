import { isMain } from '../runtime/paths.ts';
import { readFile, mkdir, writeFile, lstat, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { skills, repoRoot } from './catalog.ts';
import { materializeSkill } from './artifacts.ts';
import { hashTree } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';
export async function prepareEvals(output:string, hosts=['codex','claude']) {
  if(!hosts.length||hosts.some(h=>!['codex','claude'].includes(h))||new Set(hosts).size!==hosts.length)throw new Error('Invalid evaluation hosts');
  output=resolve(output);
  try{await lstat(output);throw new Error('Evaluation output already exists');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  const cases=JSON.parse(await readFile(join(repoRoot,'evals/cases.json'),'utf8'));
  const version=JSON.parse(await readFile(join(repoRoot,'package.json'),'utf8')).version;
  const baseCommit=execFileSync('git',['-C',repoRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const workingTreeDirty=!!execFileSync('git',['-C',repoRoot,'status','--porcelain'],{encoding:'utf8'}).trim();
  await mkdir(output,{recursive:true});
  try {
    for(const host of hosts) {
      const hashes:Record<string,string>={};
      for(const skill of skills){const path=join(output,host,'skills',skill.name);await materializeSkill(skill,path);hashes[skill.name]=await hashTree(path);}
      const prepared=cases.map((c:any)=>({...c,invocation:host==='codex'?'$'+c.skill:'/'+c.skill,status:'not-run',expectationResults:c.expect.map(()=>null),outputFile:null,toolTraceFile:null}));
      await writeFile(join(output,host,'cases.json'),JSON.stringify({host,version,baseCommit,workingTreeDirty,clientVersion:null,model:null,skillHashes:hashes,cases:prepared},null,2)+'\n');
    }
  } catch(e){await rm(output,{recursive:true,force:true});throw e;}
  return {output,hosts,caseCount:cases.length,status:'not-run'};
}
if (await isMain(import.meta.url)) {
  const args=process.argv.slice(2);if(args.length!==2||args[0]!=='--out')throw new Error('Use --out <new-directory>');
  console.log(JSON.stringify(await prepareEvals(args[1]),null,2));
}
