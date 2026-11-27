import test from 'node:test';
import assert from 'node:assert/strict';
import fs, { mkdtemp, mkdir, writeFile, readFile, readdir, symlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { learningHome, dataHome } from '../runtime/paths.ts';
import { resolveTargets } from '../scripts/targets.ts';
import { install, installTargets } from '../scripts/install-skills.ts';
import { buildPackages } from '../scripts/build-plugins.ts';
import { duplicateSkills } from '../scripts/doctor.ts';
import { hashTree, readReceipts, atomicJSON, validateManifest, repository } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/protocol.ts';
import { check, plan } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/engine.ts';
import { context } from '../plugins/skilldock-updates/skills/skilldock-update/scripts/cli.ts';
const temp=()=>mkdtemp(join(tmpdir(),'skilldock-cross-'));
test('shared data is opt-in and never creates or merges legacy data',async()=>{
 const home=await temp(), env={CODEX_HOME:join(home,'legacy')};
 assert.equal(dataHome(env,home),env.CODEX_HOME);
 assert.equal(learningHome(env,home),join(env.CODEX_HOME,'extension-data/english-learning'));
 assert.equal(dataHome({...env,SKILLDOCK_HOME:join(home,'shared')},home),join(home,'shared'));
 assert.equal(learningHome({...env,SKILLDOCK_HOME:join(home,'shared'),ENGLISH_LEARNING_HOME:join(home,'english')},home),join(home,'english'));
 assert.throws(()=>dataHome({SKILLDOCK_HOME:'relative'},home),/absolute/);
 assert.equal(dataHome({CODEX_HOME:'relative-legacy'},home),resolve('relative-legacy'));
 assert.equal(learningHome({ENGLISH_LEARNING_HOME:'relative-english'},home),resolve('relative-english'));
 assert.deepEqual(await readdir(home),[]);
});
test('native target resolution preserves legacy commands and existing installations',async()=>{
 const home=await temp(),env={CODEX_HOME:join(home,'old')};
 assert.equal((await resolveTargets({home,env}))[0].destination,join(home,'old/skills'));
 assert.equal((await resolveTargets({target:'codex',home,env}))[0].destination,join(home,'.agents/skills'));
 assert.equal((await resolveTargets({target:'claude',home,env}))[0].destination,join(home,'.claude/skills'));
 await install(join(home,'old/skills'),['skilldock-polish']);
 assert.equal((await resolveTargets({target:'codex',home,env}))[0].destination,join(home,'old/skills'));
 await install(join(home,'.agents/skills'),['skilldock-polish']);
 await assert.rejects(resolveTargets({target:'codex',home,env}),/Ambiguous/);
 await assert.rejects(resolveTargets({target:'all',dest:join(home,'same'),home,env}),/ambiguous/);
});
test('all-target dry-run is read-only and a second-target conflict stops all writes',async()=>{
 const root=await temp(),a=join(root,'codex'),b=join(root,'claude');
 const targets=await resolveTargets({target:'all',codexDest:a,claudeDest:b,home:root,env:{}});
 await installTargets(targets,['skilldock-polish'],false,true);
 assert.deepEqual(await readdir(root),[]);
 await mkdir(join(b,'skilldock-polish'),{recursive:true});await writeFile(join(b,'skilldock-polish/SKILL.md'),'local');
 await assert.rejects(installTargets(targets,['skilldock-polish']),/already differs/);
 await assert.rejects(fs.stat(a));
 assert.equal(await readFile(join(b,'skilldock-polish/SKILL.md'),'utf8'),'local');
});
test('all-target installs retain independent receipts and refuse aliases and nesting',async()=>{
 const root=await temp(),a=join(root,'a'),b=join(root,'b');
 const targets=[{host:'codex' as const,destination:a},{host:'claude' as const,destination:b}];
 await installTargets(targets,['skilldock-polish']);
 assert.equal((await readReceipts(a))['skilldock-polish'].hash,(await readReceipts(b))['skilldock-polish'].hash);
 assert.ok((await readReceipts(a))['skilldock-polish'].sourceHash);
 await symlink(a,join(root,'alias'));
 await assert.rejects(installTargets([{host:'codex',destination:a},{host:'claude',destination:join(root,'alias')}],[],true,true),/overlap/);
 await assert.rejects(installTargets([{host:'codex',destination:a},{host:'claude',destination:join(a,'child')}],[],true,true),/overlap/);
});
test('partial target failure rolls back that skill and reports completed targets',async(t)=>{
 const root=await temp(),a=join(root,'a'),b=join(root,'b'),name='skilldock-polish';
 const targets=[{host:'codex' as const,destination:a},{host:'claude' as const,destination:b}];
 await installTargets(targets,[name]);
 for(const dest of [a,b]) {await writeFile(join(dest,name,'SKILL.md'),'managed old');const r=await readReceipts(dest);r[name].hash=await hashTree(join(dest,name));await atomicJSON(dest+'.skilldock-state/receipts.json',r);}
 const rename=fs.rename;const mocked=t.mock.method(fs,'rename',async(from,to)=>{if(String(to)===b+'.skilldock-state/receipts.json')throw new Error('receipt blocked');return rename(from,to);});syncBuiltinESMExports();
 try{await assert.rejects(installTargets(targets,[name],true,false,false,true),/completed targets: codex/);}finally{mocked.mock.restore();syncBuiltinESMExports();}
 assert.equal(await readFile(join(b,name,'SKILL.md'),'utf8'),'managed old');
 assert.notEqual(await readFile(join(a,name,'SKILL.md'),'utf8'),'managed old');
 await installTargets(targets,[name],true,false,false,true);
});
test('generated plugins are self-contained and execute helpers away from the repository',async()=>{
 const root=await temp(),out=join(root,'packages');await buildPackages(out);
 await assert.rejects(buildPackages(out),/exists/);
 for(const host of ['codex','claude']) {
   for(const name of ['skilldock-english','skilldock-updates']) {
     const plugin=join(out,host,'plugins',name),m=JSON.parse(await readFile(join(plugin,'.claude-plugin/plugin.json'),'utf8'));
     assert.equal(m.name,name);assert.equal(m.version,JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8')).version);
     assert.deepEqual(await duplicateSkills([join(plugin,'skills')]),[]);
   }
   const plugin=join(out,host,'plugins/skilldock-english'),script=join(plugin,'skills/skilldock-english/scripts/learning.ts');
   const result=JSON.parse(execFileSync(process.execPath,[script,'status'],{cwd:root,env:{...process.env,SKILLDOCK_HOME:join(root,'private'),ENGLISH_LEARNING_HOME:''},encoding:'utf8'}));
   assert.equal(result.root,join(root,'private/extension-data/english-learning'));
   assert.ok(!await fs.stat(join(root,'private')).catch(()=>false));
 }
});
test('standalone writing artifacts include the canonical checker and detect plugin duplication',async()=>{
 const root=await temp(),dest=join(root,'skills');await install(dest,['skilldock-pr-comms']);
 const draft=join(root,'draft.md');await writeFile(draft,'PR: Example change (https://example.com/pr/1)\n');
 execFileSync(process.execPath,[join(dest,'skilldock-pr-comms/scripts/message-links.ts'),'check-links',draft],{cwd:root});
 const plugin=join(root,'plugin/skills');await mkdir(plugin,{recursive:true});await fs.cp(join(dest,'skilldock-pr-comms'),join(plugin,'skilldock-pr-comms'),{recursive:true});
 assert.equal((await duplicateSkills([dest,plugin]))[0].name,'skilldock-pr-comms');
});
test('shared update cache keeps host destinations and notifications independent',async()=>{
 const root=await temp(),a=join(root,'a'),b=join(root,'b');await install(a,['skilldock-polish']);await install(b,['skilldock-polish']);
 const manifest=validateManifest({schema:1,repository,version:'9.0.0',updaterHash:'a'.repeat(64),skills:[{name:'skilldock-polish',path:'skills/skilldock-polish',hash:'b'.repeat(64),artifacts:{codex:'c'.repeat(64),claude:'d'.repeat(64)}}]});
 let calls=0;const opts={data:join(root,'cache'),session:'same-id',fetcher:async()=>{calls++;return{commit:'e'.repeat(40),manifest};}};
 assert.equal((await check({...opts,host:'codex',destination:a})).notify,true);
 assert.equal((await check({...opts,host:'claude',destination:b})).notify,true);
 assert.equal((await check({...opts,host:'codex',destination:a})).notify,false);assert.equal(calls,1);
 const receipts=await readReceipts(b);manifest.skills[0].artifacts!.claude=receipts['skilldock-polish'].hash;
 assert.equal((await plan(b,manifest,'claude'))[0].status,'current');
 assert.equal((await plan(b,manifest,'codex'))[0].status,'update');
});
test('Claude update context never applies a legacy Codex-only destination',async()=>{
 const root=await temp(),env={CODEX_HOME:join(root,'old'),SKILLDOCK_HOME:join(root,'shared')};
 const data=join(env.SKILLDOCK_HOME,'extension-data/skilldock-updates');await mkdir(data,{recursive:true});await writeFile(join(data,'config.json'),JSON.stringify({destination:join(root,'codex-custom')}));
 assert.equal((await context(['--host','codex'],env,root)).destination,join(root,'codex-custom'));
 assert.equal((await context(['--host','claude'],env,root)).destination,join(root,'.claude/skills'));
});
test('both packaged hook adapters run in isolation without duplicate notices or cross-host writes',async()=>{
 const { validatePlugin }=await import('../scripts/validate-packages.ts');
 const root=await temp(),out=join(root,'packages');await buildPackages(out);
 const privateRoot=join(root,'shared'),data=join(privateRoot,'extension-data/skilldock-updates');
 const codex=join(root,'codex'),claude=join(root,'claude');
 await install(codex,['skilldock-polish']);await install(claude,['skilldock-polish']);
 await mkdir(data,{recursive:true});await writeFile(join(data,'config.json'),JSON.stringify({destinations:{codex,claude}}));
 const manifest=validateManifest({schema:1,repository,version:'9.0.0',updaterHash:'a'.repeat(64),skills:[{name:'skilldock-polish',path:'skills/skilldock-polish',hash:'b'.repeat(64)}]});
 await check({destination:codex,data,fetcher:async()=>({commit:'c'.repeat(40),manifest})});
 const beforeCodex=await hashTree(codex),beforeClaude=await hashTree(claude);
 for(const host of ['codex','claude']) {
   const plugin=join(out,host,'plugins/skilldock-updates');await validatePlugin(plugin);
   const hook=JSON.parse(await readFile(join(plugin,'hooks',host+'.json'),'utf8')).hooks.SessionStart[0].hooks[0];
   assert.ok(hook.command.includes(host==='claude'?'CLAUDE_PLUGIN_ROOT':'${PLUGIN_ROOT}'));
   const script=join(plugin,'skills/skilldock-update/scripts/updates.ts');
   const options={cwd:root,input:JSON.stringify({session_id:'shared-session'}),env:{...process.env,SKILLDOCK_HOME:privateRoot},encoding:'utf8' as const};
   const first=JSON.parse(execFileSync(process.execPath,[script,'hook','--host',host],options));
   assert.match(first.hookSpecificOutput.additionalContext,new RegExp('for '+host));
   assert.equal(execFileSync(process.execPath,[script,'hook','--host',host],options),'');
 }
 assert.equal(await hashTree(codex),beforeCodex);assert.equal(await hashTree(claude),beforeClaude);
});
test('all-target CLI preserves custom destination flags and dry-run output',async()=>{
 const {fileURLToPath}=await import('node:url');const root=await temp();
 const script=fileURLToPath(new URL('../scripts/install-skills.ts',import.meta.url));
 const output=JSON.parse(execFileSync(process.execPath,[script,'skilldock-job-search','--target','all','--codex-dest',join(root,'codex'),'--claude-dest',join(root,'claude'),'--dry-run'],{encoding:'utf8'}));
 assert.deepEqual(output.map((x:any)=>x.host),['codex','claude']);assert.deepEqual(await readdir(root),[]);
});
test('cross-agent evaluation preparation records unrun cases and preserves existing output',async()=>{
 const {prepareEvals}=await import('../scripts/prepare-evals.ts');const root=await temp(),out=join(root,'evals');
 const result=await prepareEvals(out);assert.equal(result.status,'not-run');
 const a=JSON.parse(await readFile(join(out,'codex/cases.json'),'utf8')),b=JSON.parse(await readFile(join(out,'claude/cases.json'),'utf8'));
 assert.equal(a.cases.length,b.cases.length);assert.ok(a.cases[0].invocation.startsWith('$'));assert.ok(b.cases[0].invocation.startsWith('/'));
 assert.equal(a.model,null);assert.ok(a.cases.every((c:any)=>c.status==='not-run'&&c.expectationResults.every((r:any)=>r===null)));
 await assert.rejects(prepareEvals(out),/exists/);
});
test('library imports from stdin do not execute CLIs or fail on the dash entrypoint',async()=>{
 const {fileURLToPath}=await import('node:url');const repo=fileURLToPath(new URL('../',import.meta.url));
 const modules=['scripts/install-skills.ts','scripts/build-plugins.ts','scripts/doctor.ts','scripts/message-links.ts','scripts/prepare-evals.ts','plugins/skilldock-english/skills/skilldock-english/scripts/learning.ts','plugins/skilldock-updates/skills/skilldock-update/scripts/updates.ts'];
 const source=modules.map(p=>`await import(${JSON.stringify(new URL(p,new URL('../',import.meta.url)).href)});`).join('\n')+'\nconsole.log("imported");';
 assert.equal(execFileSync(process.execPath,['--input-type=module','-'],{input:source,cwd:repo,encoding:'utf8'}).trim(),'imported');
});
test('installer and updater agree on actual discovery entries, ignoring prefixed notes files',async()=>{
 const root=await temp(),env={CODEX_HOME:join(root,'old')};
 await mkdir(join(env.CODEX_HOME,'skills'),{recursive:true});await writeFile(join(env.CODEX_HOME,'skills/skilldock-notes.txt'),'not a skill');
 await install(join(root,'.agents/skills'),['skilldock-polish']);
 const target=(await resolveTargets({target:'codex',env,home:root}))[0].destination;
 assert.equal((await context(['--host','codex'],env,root)).destination,target);
});
