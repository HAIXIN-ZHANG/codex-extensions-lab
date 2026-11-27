# v0.2.0 cross-agent audit and implementation plan

Reviewed 2026-11-27 against source v0.1.5 (c203067). This plan was approved before implementation. No personal data migration, host installation, MCP server or cloud service is included.

## Source audit

The catalog contains eleven canonical skills: nine under `skills/`, English and Update under their existing plugin roots. Keep those paths and the legacy installer API. The installer already has destination locks, backups, receipts, managed-baseline refusal and rollback on receipt-write failure. The learning store preserves revisions/history and refuses divergent imports. Reuse those invariants. Existing CI exercises Node 24 helpers and Ruby YAML parsing; 68 prepared model scenarios are not measured compatibility results.

| Surface | Existing Codex-oriented behavior | v0.2 implementation boundary |
| --- | --- | --- |
| Skills | Shared Markdown plus optional OpenAI UI metadata | Same canonical source, standard frontmatter, host-specific invocation documented separately |
| Discovery | Legacy CODEX_HOME/skills | Preserve legacy command; explicit Codex/Claude/all targets and custom paths |
| Plugins | Portable root manifests, OpenAI marketplace, update hook | Generate contained Codex and Claude plugin packages/marketplaces from canonical skill roots |
| Updates | Shared comparison mixed with Codex CLI/session output | Pure comparison/cache engine, explicit host adapter, destination-scoped notifications |
| Data | CODEX_HOME and ENGLISH_LEARNING_HOME | Opt-in SKILLDOCK_HOME; preserve old defaults and explicit English override |
| Checks | Repository-level writing helper | Include canonical helper and transitive runtime dependencies in installed artifacts |
| Releases | Source hashes and one updater hash | Retain schema-1 source fields; add artifact and platform package metadata |

## Official documentation checked

- Agent Skills specification: https://agentskills.io/specification — shared name/description/metadata and supporting files.
- Agent Plugins 1.0.0: https://agent-plugins.org/specification — root manifest and package containment.
- Codex skills: https://learn.chatgpt.com/docs/build-skills — current native `.agents/skills` discovery; existing local `.codex/skills` behavior remains a legacy compatibility route.
- OpenAI plugin packaging: https://developers.openai.com/plugins/build/plugins — portable manifests, client extensions, marketplaces and hook trust.
- Claude skills: https://code.claude.com/docs/en/skills — `.claude/skills`, plugin namespacing, shared Agent Skills format.
- Claude plugin manifests: https://code.claude.com/docs/en/plugins/manifest-reference — `.claude-plugin/plugin.json`, contained component paths.
- Claude hooks: https://code.claude.com/docs/en/hooks — host environment, SessionStart input/output and async semantics must be verified independently.

## Risks and decisions

Do not duplicate editable skill sources or assume a native skill directory implies native plugin support. Generated packages may contain copies but never reference the author's checkout. Keep source hashes separate from generated artifact hashes. Old receipts remain readable and retain their history. Select destinations deterministically and reject ambiguous duplicate discovery or overlapping all-target paths. Preflight every target before writing, then report partial completion rather than claiming a cross-target transaction. Preserve receipt/file rollback per skill. New data roots are opt-in, authoritative and never implicitly merged with old roots. Hook installation/trust and model behavior remain runtime verification tasks.

## Incremental plan

1. Add shared path and artifact functions; retain canonical roots and public installer API.
2. Add explicit target resolution, all-target preflight and self-contained installed artifacts.
3. Separate update engine, host adapters and legacy CLI entry; keep old release fields readable.
4. Generate native plugin manifests, hook configuration and marketplaces from one catalog/version.
5. Update shared instructions and document safe data adoption; no migration is executed.
6. Extend fixture tests, CI/package checks and cross-agent evaluation preparation; review the final diff.

## Implementation review outcome

The implementation follows the stages above. Source plugins retain canonical roots and carry generated path-runtime snapshots so existing direct plugin installation remains contained; generated snapshots are checked against one editable runtime source. Source hashes remain in schema 1, with optional platform artifact/plugin fields. Generated package variants currently have equal payload hashes where their contents are identical, but the release contract supports host-specific artifacts.

Independent review reproduced two issues during implementation: a realpath-based entry guard broke imports from stdin, and discovery predicates disagreed about prefixed notes files. Both were corrected in shared runtime helpers and tested. Re-review found no remaining concrete blocker in the reviewed core. Claude Code 2.1.193 strict native validation passed for both generated plugins and its marketplace. Local tests use Node 26.5.0, not the historical Node 24 runtime; CI is configured for Node 24 on Linux/macOS. Actual discovery, hook trust/delivery, model behavior and published upgrade verification remain separate manual tasks. No personal migration or host configuration change was performed.
