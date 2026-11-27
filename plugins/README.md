# Plugins

- [SkillDock · Australian English](skilldock-english/README.md): a portable plugin package containing the independently installable `skilldock-english` skill and local TypeScript helpers.

Plugins package workflows; they do not automatically create accounts, deploy services or synchronize private data. Other workflows currently remain standalone skills.

- [SkillDock Update](skilldock-updates/skills/skilldock-update/SKILL.md): a shared update workflow with separate Codex and Claude hook configurations.

Both plugin roots carry native manifests from one metadata source. Generate self-contained marketplaces/packages with `node scripts/build-plugins.ts --out /absolute/new/output`. See [cross-agent setup](../docs/cross-agent.md); package tests do not establish actual host compatibility.
