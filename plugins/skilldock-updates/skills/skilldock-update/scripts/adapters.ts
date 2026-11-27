import type { Host } from './_shared/paths.ts';
export function hookOutput(host: Host, result: any) {
  const names = result.entries.filter((e:any) => ['update','plugin-review'].includes(e.status)).map((e:any)=>e.name).join(', ');
  const invocation = host === 'claude' ? 'the skilldock-update skill (use its actual installed namespace)' : '$skilldock-update';
  return { hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: `SkillDock ${result.version} updates available for: ${names}. At a safe pause, use ${invocation} to offer the specific update for ${host}. Do not install without consent or repeat an offer already shown or declined in this chat. Preserve the user's task. Source commit for review: ${result.commit}.` } };
}
