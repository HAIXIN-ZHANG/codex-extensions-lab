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
 Polish / Prompt rewrite             grammar / life and work scenarios / resources
 PR comms / Work messages             private progress and lesson history
 Jobs / Property                            |
 Product / UX / Technical                    |
     |                               TypeScript local helpers
 host-authorized browsing            store.ts / audio.ts / learning.ts
 and existing connectors                    |
                                     Private state + generated WAV
                                            |
                                  Manual JSON / Markdown / HTML export
```

Workplace guidance is implemented as Markdown instructions and conditional references, including English rehearsal and AI-system technical design. It adds no runtime service or storage format.

The host supplies the language model, web access and account permissions. Skills do not implement those services. English is a plugin package around one independently installable skill and its local scripts; it currently has no MCP service, backend or mobile app.

## Code and data boundaries

| Location | Purpose | Public? |
| --- | --- | --- |
| `skills/<name>` | Nine standalone task workflows | Yes |
| `plugins/skilldock-english/skills/skilldock-english` | Single canonical English skill and helpers | Yes |
| `.agents/plugins/marketplace.json` | Local plugin discovery catalog | Yes |
| `scripts/catalog.ts` | Canonical installation catalog | Yes |
| `scripts/install-skills.ts` | Preview/install/update with backups and installation receipts | Yes |
| `plugins/skilldock-updates` | Canonical Update skill and optional session-start checker plugin | Yes |
| `updates/manifest.json` | Published per-skill content hashes and suite version | Yes |
| `<destination>.skilldock-state` | Installation baselines and receipt history | No |
| `evals/cases.json` | Synthetic behavioral regression prompts | Yes |
| `plugins/skilldock-english/learning-records/plans/<plan-id>` | Explicitly published, curated Markdown learning materials and progress, separated by selected plan | Yes |
| `CODEX_HOME/extension-profiles` | Personal defaults | No |
| `CODEX_HOME/extension-data` | Learning and research records | No |
| Configured existing application tracker | Job applications source of truth | No |

`CODEX_HOME` defaults to `~/.codex`; English data can use `ENGLISH_LEARNING_HOME`. The installed skill discovery path is separately selected by `--dest`. Choosing another skill folder does not automatically relocate personal data.

## Helper boundaries

- `store.ts` validates state, locks local writes, checks expected revision, retains document history and performs atomic replacement. It rejects conflicting imports rather than resolving by timestamps. A substantive Markdown revision resets default reading status; an explicit status may reflect known user feedback.
- `audio.ts` uses an installed macOS Australian voice, validates nonempty PCM WAV, checks content identity and caches voice/rate variants. It does not download engines or call a paid provider.
- `learning.ts` exposes commands and readable/portable export. Selected exports load media only for selected lessons. JSON archives include those lessons' histories; Markdown/HTML expose current text. HTML escapes lesson content and embeds generated audio, without executing imported markup.
- `install-skills.ts` uses a sibling install lock and backs up differing folders outside the discovery tree. Replacement is recoverable per skill, not a transaction across the selected skills. Staged files live outside the discovery directory to avoid transient duplicate skills.

## Portability and evolution

Manual export/import works without sharing model accounts. Public English plugin `learning-records/` Markdown is a separate, opt-in path for sharing curated notes through Git; it is not the helper archive and is not imported or synchronized automatically. Pull a current base, inspect concurrent edits and resolve conflicts explicitly before publishing. Neither approach automatically relays phone changes or synchronizes live folders. A future remote access layer should reuse the data rules and add explicit identity, authorization and conflict semantics; plugin packaging alone cannot provide that.

No TypeScript compiler, package dependency resolver or backend has been added. CI runs existing checks on Node.js 24 and parses metadata using Ruby's bundled YAML support. Hosted CI success is a separate fact from local validation.

## Published update checks

The optional update plugin performs bounded, cached public GitHub checks; its hook never installs skills. The Update workflow offers review, then uses a pinned checkout and receipt-protected installation after consent. Receipt writes share the installer lock; the check cache has its own lock. Task skills remain independently usable. See [update design and release procedure](updates.md).

The local `scripts/message-links.ts` formatter and validator use only Node built-ins. They check reference lines and the selected compact PR format in supplied artifacts. Global chat-output interception is supplied by the host and is not configured here. Writing preferences live outside the public source under `extension-profiles/writing.md`.

If a skill replacement succeeds but its receipt cannot be saved, the installer restores the previous managed directory before returning the failure. A protected retry can then validate the same baseline. This recovery handles reported write failures, while process termination still requires inspecting backups and receipts.

## v0.2.0 cross-agent boundary

The canonical catalog and existing skill roots are unchanged. `scripts/targets.ts` selects discovery destinations; `scripts/artifacts.ts` generates contained installations with canonical helpers; `scripts/build-plugins.ts` generates both native marketplaces/packages. `runtime/paths.ts` defines opt-in shared data resolution. Committed generated snapshots keep source plugins self-contained and are checked by `scripts/sync-runtime.ts`.

The updater's `engine.ts` owns release/cache/planning, `cli.ts` selects host paths and arguments, and `adapters.ts` formats notices. `updates.ts` preserves the old entrypoint. Each host has an explicitly selected hook file, avoiding a default hook plus declared-hook duplicate. Source and artifact hashes are distinct; schema-1 source fields remain readable. See [cross-agent architecture and limits](cross-agent.md). No MCP layer, personal migration or new service is introduced.
