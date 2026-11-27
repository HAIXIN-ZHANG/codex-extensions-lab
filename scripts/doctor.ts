import { isMain } from '../runtime/paths.ts';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
export async function duplicateSkills(roots: string[]) {
  const found=new Map<string,string[]>();
  for(const root of roots) {
    let entries;try{entries=await readdir(root,{withFileTypes:true});}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')continue;throw e;}
    for(const entry of entries) {
      if(!entry.isDirectory()&&!entry.isSymbolicLink())continue;
      const file=join(root,entry.name,'SKILL.md');
      let text;try{text=await readFile(file,'utf8');}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')continue;throw e;}
      const name=text.match(/^name: (.+)$/m)?.[1];if(!name)continue;
      found.set(name,[...found.get(name)??[],file]);
    }
  }
  return [...found].filter(([,paths])=>paths.length>1).map(([name,paths])=>({name,paths}));
}
if (await isMain(import.meta.url)) {
  const roots=process.argv.slice(2);if(!roots.length)throw new Error('Pass explicit skill discovery directories, including plugin skills/ directories');
  const duplicates=await duplicateSkills(roots.map(p=>resolve(p)));console.log(JSON.stringify({duplicates},null,2));if(duplicates.length)process.exitCode=1;
}
