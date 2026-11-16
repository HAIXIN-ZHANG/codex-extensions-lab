# v0.1 validation · 2026-11-16

## Repository maintenance check · 2026-11-17

On macOS with Node.js v24.14.1, metadata/link checks, full Ruby YAML parsing, all twelve helper tests and `git diff --check` passed. The behavioral corpus contains twenty-two prepared cases; none has been scored as a model benchmark. The previously modified and untracked working files matched all 58 remote files byte-for-byte. Local `main` and its index were advanced to that verified remote tree without changing file contents or rewriting remote history.

The reported full-width-colon warning is an editor Unicode-confusability highlight. Workspace settings allow that character in Markdown only. No editor UI validation or TypeScript compiler check was performed. Historical validation results below describe their original revisions.

## Earlier validation

Named public Markdown plans: the record layout and skill selection guidance were added after the initial run. Repository checks validate links and metadata, not identity enforcement or real multi-device synchronization. Behavioral scenarios are prepared for model runs; no model or cross-device run has been performed for plan selection.

Naming update: v0.1.2 uses the [SkillDock namespace](naming.md). The helper suite now has twelve tests, including opt-in name migration with old edits preserved in backups. Private storage keys and the study archive format remain compatible. Historical source names below describe their original reviewed revisions.

This records the initial v0.1 run. The [v0.1.1 review](reviews/2026-11-16-v01-review.md) adds three reproduced corrections and eleven passing helper tests, full Ruby YAML parsing, and sixteen prepared behavioral cases. The behavioral cases have not been run/scored as a model benchmark. Hosted CI status is separate from local results.

## Exercised

- All eight skill identities/descriptions/UI metadata, relative documentation links and the local plugin identity pass `node scripts/check.ts`.
- `node --test tests/*.test.ts` covers learning save/resume/revision history, generated versus read, stale and concurrent writes, corrupt-state preservation, invalid IDs, portable export/import, atomic conflict refusal, escaping active HTML, audio cache invalidation, archive audio checksums, unsupported systems, live locks, and installer overwrite refusal/backup behavior.
- Nine executable tests pass, including selected export privacy boundaries and rejection of WAV wrappers without real samples.
- A real macOS Karen (`en_AU`) synthesis and WAV conversion succeeded with normal host execution permission, followed by Markdown/HTML/JSON export. Sandboxed synthesis initially produced an empty track despite successful exit; the helper now rejects empty/silent audio, and the verified host run produced nonzero audio samples. Audio naturalness and playback on each user client still need listening verification.
- Installed copies are compared with repository sources after installation. Existing private profiles are retained. Original schedule tasks remain paused.

## Limits

The checks use Node.js 24's runtime TypeScript support and built-in test runner; there is no TypeScript compiler/type-checking dependency or full upstream JSON/YAML schema validator. Skill behavior still needs real usage feedback. We did not run live job/property searches, perform customer research or claim teaching effectiveness from static checks. Source links in the resource guide are starting points; availability is checked when a lesson uses them.

No paid API calls, microphone collection, cloud deployment, cross-device automatic sync or sign-out/sign-in account migration was tested. Plugin marketplace/package format is provided for compatible clients; successful local installation does not prove mobile or cloud support. Manual exports/imports, not automatic sync, are the implemented portability mechanism.
