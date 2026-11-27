import { homedir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dataHome, legacyHome, discovery, absolute, hasSkillDock, type Host } from './_shared/paths.ts';
import { readJSON } from './protocol.ts';
import { check, verifyCheckout } from './engine.ts';
import { hookOutput } from './adapters.ts';
export async function context(args: string[], env: NodeJS.ProcessEnv = process.env, home=homedir()) {
  const values=[...args];
  function option(flag:string) {const i=values.indexOf(flag); if(i<0)return undefined; if(!values[i+1]||values[i+1].startsWith('--'))throw new Error(flag+' needs a value');const v=values.splice(i,2)[1];if(values.includes(flag))throw new Error('Duplicate '+flag);return v;}
  const explicitHost=option('--host'), dest=option('--dest');
  if(explicitHost && !['codex','claude'].includes(explicitHost))throw new Error('Unknown host');
  const host=(explicitHost||'codex') as Host;
  const data=join(dataHome(env,home),'extension-data/skilldock-updates');
  const config=await readJSON(join(data,'config.json'),{});
  if(!config || Array.isArray(config)||typeof config!=='object')throw new Error('Invalid update configuration');
  const configured=dest||config.destinations?.[host]||(host==='codex'?config.destination:undefined);
  let destination=configured?absolute(configured,'destination'):host==='claude'?discovery(host,env,home):join(legacyHome(env,home),'skills');
  if(!configured && explicitHost==='codex') {
    const native=discovery(host,env,home), old=await hasSkillDock(destination), current=await hasSkillDock(native);
    if(old && current && native!==destination)throw new Error('Ambiguous Codex discovery paths; configure a destination');
    if(!old)destination=native;
  }
  return { host, data, destination, args:values };
}
export async function runCLI() {
  const hookMode=process.argv[2]==='hook';
  try {
    const [command='check', ...args]=process.argv.slice(2);
    const resolved=await context(args);
    if(command==='verify-checkout' && resolved.args.length===1) {
      const cache=await readJSON(join(resolved.data,'check.json'),null);
      if(!cache || cache.unavailable)throw new Error('No checked release available');
      console.log(JSON.stringify(await verifyCheckout(resolved.args[0],cache))); return;
    }
    if(!['check','hook'].includes(command)||resolved.args.some(a=>a!=='--force'))throw new Error('Use check [--force], hook or verify-checkout <path>; optional --host codex|claude --dest <absolute-path>');
    let session: string|undefined;
    if(command==='hook') {
      let input='';for await(const chunk of process.stdin){input+=chunk;if(input.length>100_000)return;}
      const value=JSON.parse(input||'{}');
      if(typeof value.session_id==='string'&&value.session_id.length<500)session=value.session_id;
      if(!session)return;
    }
    const candidate=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
    const metadata=resolved.host==='claude'?'.claude-plugin/plugin.json':'plugin.json';
    const plugin=await readJSON(join(candidate,metadata),null);
    const result=await check({ ...resolved, session, force:resolved.args.includes('--force'), pluginRoot:plugin?.name==='skilldock-updates'?candidate:undefined });
    if(command==='check')console.log(JSON.stringify(result,null,2));
    else if(result.status==='ok'&&result.notify)console.log(JSON.stringify(hookOutput(resolved.host,result)));
  } catch(e) { if(!hookMode){console.error((e as Error).message);process.exitCode=1;} }
}
