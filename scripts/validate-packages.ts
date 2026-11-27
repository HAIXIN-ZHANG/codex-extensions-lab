import { readFile, readdir, realpath } from 'node:fs/promises';
import { join, resolve, sep, dirname } from 'node:path';
export async function validatePlugin(root: string) {
  const base=await realpath(root);
  const portable=JSON.parse(await readFile(join(root,'plugin.json'),'utf8'));
  const native=JSON.parse(await readFile(join(root,'.claude-plugin/plugin.json'),'utf8'));
  if(portable.$schema!=='https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'||native.name!==portable.name||native.version!==portable.version)throw new Error('Invalid platform manifests');
  const names=new Set<string>();
  for(const entry of await readdir(join(root,'skills'),{withFileTypes:true})) {
    const content=await readFile(join(root,'skills',entry.name,'SKILL.md'),'utf8');
    const name=content.match(/^name: (.+)$/m)?.[1];
    if(name!==entry.name||names.has(name))throw new Error('Invalid or duplicate skill identity');names.add(name);
  }
  async function contained(path:string) {if(!(await realpath(path)).startsWith(base+sep))throw new Error('Package path escapes root');}
  async function walk(path:string) {
    for(const entry of await readdir(path,{withFileTypes:true})) {
      const file=join(path,entry.name);if(entry.isSymbolicLink())throw new Error('Symlink in generated package');
      if(entry.isDirectory())await walk(file);
      else if(entry.name.endsWith('.ts')) {
        const text=await readFile(file,'utf8');
        for(const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+\.ts)['"]/g))await contained(resolve(dirname(file),match[1]));
      }
    }
  }
  await walk(root);
  const paths=[portable.extensions?.['com.openai']?.hooks,native.hooks].filter(Boolean);
  if(paths.length && await readFile(join(root,'hooks/hooks.json'),'utf8').then(()=>true,e=>{if(e.code==='ENOENT')return false;throw e;}))throw new Error('Default hooks would duplicate platform-specific hooks');
  for(const path of paths) {
    if(typeof path!=='string'||!path.startsWith('./')||path.split('/').includes('..'))throw new Error('Invalid hook path');
    await contained(join(root,path));
    const hooks=JSON.parse(await readFile(join(root,path),'utf8'));
    const hook=hooks.hooks?.SessionStart?.[0]?.hooks?.[0];
    if(!hook||hook.type!=='command'||!hook.command.includes('/scripts/updates.ts')||!hook.command.includes('--host '))throw new Error('Invalid session adapter');
  }
  return {name:portable.name,skills:[...names]};
}
