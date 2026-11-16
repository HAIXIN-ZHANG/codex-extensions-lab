# Architecture

## Responsibility map

```text
User request + task-specific overrides
                 |
         Host AI selects a skill
                 |
     +-----------+--------------------------+
     |                                      |
 Markdown workflows                  English learning skill
 Polish / Prompt rewrite             grammar / scenarios / resources
 Jobs / Property                     private progress and lesson history
 Product / UX / Technical                    |
     |                               TypeScript local helpers
 host-authorized browsing            store.ts / audio.ts / learning.ts
 and existing connectors                    |
                                     Private state + generated WAV
                                            |
                                  Manual JSON / Markdown / HTML export
```

The host supplies the language model, web access and account permissions. Skills do not implement those services. English is a plugin package around one independently installable skill and its local scripts; it currently has no MCP service, backend or mobile app.

## Code and data boundaries

| Location | Purpose | Public? |
| --- | --- | --- |
| `skills/<name>` | Seven standalone workflows | Yes |
| `plugins/skilldock-english/skills/skilldock-english` | Single canonical English skill and helpers | Yes |
| `.agents/plugins/marketplace.json` | Local plugin discovery catalog | Yes |
| `scripts/catalog.ts` | Canonical installation catalog | Yes |
| `scripts/install-skills.ts` | Preview/install/update with backups | Yes |
| `evals/cases.json` | Synthetic behavioral regression prompts | Yes |
| `CODEX_HOME/extension-profiles` | Personal defaults | No |
| `CODEX_HOME/extension-data` | Learning and research records | No |
| Configured existing application tracker | Job applications source of truth | No |

`CODEX_HOME` defaults to `~/.codex`; English data can use `ENGLISH_LEARNING_HOME`. The installed skill discovery path is separately selected by `--dest`. Choosing another skill folder does not automatically relocate personal data.

## Helper boundaries

- `store.ts` validates state, locks local writes, checks expected revision, retains document history and performs atomic replacement. It rejects conflicting imports rather than resolving by timestamps. A substantive Markdown revision resets default reading status; an explicit status may reflect known user feedback.
- `audio.ts` uses an installed macOS Australian voice, validates nonempty PCM WAV, checks content identity and caches voice/rate variants. It does not download engines or call a paid provider.
- `learning.ts` exposes commands and readable/portable export. Selected exports load media only for selected lessons. JSON archives include those lessons' histories; Markdown/HTML expose current text. HTML escapes lesson content and embeds generated audio, without executing imported markup.
- `install-skills.ts` uses a sibling install lock and backs up differing folders outside the discovery tree. Replacement is recoverable per skill, not a transaction across all eight skills. Staged files live outside the discovery directory to avoid transient duplicate skills.

## Portability and evolution

Manual export/import works without sharing model accounts. It does not automatically merge divergent chapter updates, relay phone changes to a computer, or synchronize live folders. A future remote access layer should reuse the data rules and add explicit identity, authorization and conflict semantics; plugin packaging alone cannot provide that.

No TypeScript compiler, package dependency resolver or backend has been added. CI runs existing checks on Node.js 24 and parses metadata using Ruby's bundled YAML support. Hosted CI success is a separate fact from local validation.
