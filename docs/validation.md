# v0.1 validation · 2026-11-16

## Property helper source publication · 2026-11-26

Reviewed the previously untracked property research CLI, instructions, examples and tests. Its reusable source is retained, with fictional fixtures. Existing database, raw snapshot and research report were relocated to private storage after SHA-256 copy verification. A read-only SQLite integrity check passed and confirmed the stored raw snapshot matched its source JSON. The historical research claims were not reverified during this file-management task.

Added a subprocess test that exercises import, latest, history and model commands from another working directory, and included the helper tests in the package test command and GitHub Actions. On macOS / Node.js v24.14.1, all 45 executable tests, metadata/link/manifest checks, full Ruby YAML parsing and whitespace checks passed. Node's SQLite module emits its experimental-feature warning. Targeted ignore rules cover the helper's runtime data, database and report directories. Installed skill content and release hashes are unaffected by this standalone source addition.

## Export and writing regression fixes · 2026-11-26 · v0.1.6

English export now checks the shared 40,000,000-byte archive limit and 32,000,000-character per-audio base64 limit before creating output files. Synthetic PCM regressions verify rejection leaves source state and output unchanged, and individually selected lessons still restore with their original content and audio metadata. Speech tests use mocks.

Writing checks now share fenced-code exclusion, preserve HTTP endpoint descriptions and endpoint-titled reference lines, reject invalid references after a closing fence, and require screenshot evidence outside code examples. Explicit update planning explains missing receipts and the reviewed source-migration route. The existing protections and local-edit preservation remain covered by runtime tests.

On macOS / Node.js v24.14.1, all 41 executable tests, repository metadata/link/manifest checks, full Ruby YAML parsing and `git diff --check` passed. The suite and changed plugin packages advance to 0.1.6. The behavioral corpus has 69 prepared cases, including one new unmanaged-migration case that has not been model-run or human-scored. Source self-review and deterministic regression tests were performed. The Skill Creator Python validator could not start because PyYAML is unavailable; Ruby parsed all skill frontmatter separately. TypeScript compiler checking and plugin-host delivery were not exercised in this patch.

## PR communication review and v0.1.5 release · 2026-11-26

Reviewed the PR communication guidance, synthetic examples, link/summary validator and regression tests. URL-as-label links preserve matching destinations, requested endpoint bodies remain expanded, and labelled examples can follow the review paragraph. The public source uses fictional examples. Personal templates remain in the private profile. Advanced the release to 0.1.5 because the updater requires a newer version for changed skill hashes.

Node.js v24.14.1 metadata/link/manifest checks, Ruby YAML parsing, all 37 executable tests and diff whitespace checks passed. The expanded product PR summary also passed the updated checker. The corpus contains 68 prepared behavioral cases. The two added scenarios have not been run or scored with a model. No TypeScript compiler check was configured or run.

## Review fixes and v0.1.4 release · 2026-11-25

Corrected the Work Messages design-reference example and added a test that checks its source directly. Compact PR validation now requires an unheaded review/validation paragraph and image syntax in a Screenshots section. Inline code is preserved and prose absolute file references are checked. The installer restores the previous managed files when saving the replacement's receipt fails. A mocked filesystem rename failure verifies unchanged baseline files and receipts followed by a successful managed-only retry. The release manifest advances to 0.1.4 so changed skills qualify as updates for 0.1.3 installations. Plugin packages retain their versions because their content did not change.

Node.js v24.14.1 metadata/link/manifest checks, Ruby YAML parsing, all 35 runtime tests and whitespace checks passed. The 66 prepared behavioral scenarios remain unscored. The checker validates document structure, while factual evidence and screenshot authenticity still require review. Installation recovery covers reported write failures and does not guarantee recovery from abrupt process termination.


## Copyable references and compact summaries · 2026-11-25

Added a dependency-free formatter and validator for supplied message files. Resource references use a category, descriptive title and original URL in parentheses. Optional hyperlinks retain the visible original URL. The compact PR checker verifies Ticket, Background and What changed heading order, optional Screenshots, content and change bullets. Six executable tests cover formatting, hidden destinations, exact URL matching, code/image handling, PR structure and real CLI exit codes. PR Comms and Work Messages read an optional private writing profile. The global preference is maintained outside the public repository. Model evaluation and host-wide interception remain separate from deterministic file checks. Node.js 24 metadata/link/manifest checks, full Ruby YAML parsing, all 31 helper tests and whitespace checks passed. The corrected local PR-summary and Slack drafts passed the real CLI checks after HTML screenshot embeds were handled. Installed Polish, PR Comms and Work Messages were updated with managed backups and match source. These results describe the initial local-validation stage before the subsequent publication fixes.


## PR title-link correction · 2026-11-25

PR Comms now applies the latest format correction before older examples. Review requests use the verified PR title as a clickable label for rich-text chat, or the title and full visible URL for plain-text copying. One prepared case covers a newer title-link correction overriding an older title-free example. Model scoring remains pending.


## Concise PR-summary format · 2026-11-25

PR Comms now explicitly preserves the selected summary example's headings, order and brevity independently of the Slack review format. The concise fallback uses Ticket, Background and What changed, a short validation paragraph and Screenshots only with actual images. Repository-required sections remain mandatory. Added one fictional prepared scenario covering the summary structure, evidence limits and separation from Slack formatting; the corpus now contains 64 unscored scenarios. Metadata/link/manifest checks, full Ruby YAML parsing, all 25 helper tests and whitespace checks passed. The managed installer backed up and updated local PR Comms; its files match source byte-for-byte. At the initial local-validation stage, no independent model scoring or cloud write had been performed.

## Preserve selected message layouts · 2026-11-25

Refined PR Comms and Work Messages so a selected example controls paragraph structure, mention placement and link labels. A short review ask, change summary and final "PR:" with the complete visible URL can stand on their own; a separate full title is optional when the surrounding text identifies the destination. Explicit title-plus-link and hyperlink requests remain supported. Public examples are fictional, and two new prepared cases cover a selected review layout and a contextual task label. The corpus contains 63 unscored scenarios. Metadata/link/manifest checks, Ruby YAML parsing, all 25 helper tests and whitespace checks passed for this revision. Both installed skills were updated with backups and match source byte-for-byte. These checks do not establish independent model quality or client discovery. The earlier Python-validator limitation remains unchanged. At that initial local-validation stage, this follow-up had not been committed or pushed.

## Plain writing and visible message links · 2026-11-25

Updated PR Comms and Work Messages to use a descriptive title plus a complete visible URL by default, with explicit per-task formats taking precedence. Both skills favour simple wording and preserve clear user phrasing. Synthetic references and the message guide follow the same rule; three new prepared cases cover readable links, plain status wording and an explicit alternative link format. The corpus now contains 61 prepared scenarios; it has not been independently model-run or human-scored.

On macOS / Node.js v24.14.1, repository metadata/link/manifest checks, full Ruby YAML parsing, all 25 helper tests and diff whitespace checks passed. Both local installed copies matched their source before this change. The managed installer updated only these two skills with backups, and the final installed files match source byte-for-byte. Skill Creator's Python validator could not run because PyYAML is unavailable; no dependencies were installed. A current, authorised PR was read to prepare an in-chat writing example from the installed skill; no private source content or draft was copied into public fixtures. This is a manual usage example, not an independent behavioural evaluation. At that initial local-validation stage, no commit, push or external message/PR update had been performed.

## Workplace publication review · 2026-11-25

Reviewed the eight work-oriented workflows and corrected the optional-link wording plus incomplete evaluation fixtures. The [source review](reviews/2026-11-25-workplace-writing-review.md) records the scope and findings. On macOS / Node.js v24.14.1, metadata/link/manifest checks, full Ruby YAML parsing, all 25 helper tests and diff whitespace checks passed. Both new writing skills also installed byte-for-byte into an isolated temporary directory, produced receipts and remained unchanged under the migration preview. User discovery folders were not modified. A focused scan of the 18 pending files found no matches for the selected credential, internal-link, mention-ID or local-home-path patterns. This scan covers the pending source only. The 58 behavioral scenarios remain unscored. The optional Python validator still requires unavailable PyYAML.

## Supporting evidence in messages · 2026-11-25

Work Messages and PR Comms now use relevant available references or verified observations for questions and code discussions. Three prepared scenarios cover specific sources, unavailable references and precise PR review evidence. Repository checks and 25 helper tests passed. The corpus contains 58 prepared scenarios, with model evaluation still pending.

## Workplace message source check · 2026-11-25

Added Work Messages with nine conditional patterns and a message-writing scenario index. The scope covers drafting from notes or task facts, while existing prose editing stays with Polish and PR descriptions/review requests stay with PR Comms. Examples are fictional. Eight new prepared cases exercise status/environment distinctions, uncertain causes, neutral follow-ups, QA availability, planned versus completed review replies, tentative decisions, editing-only scope and rollout stages.

On macOS / Node.js v24.14.1, `node scripts/check.ts`, `ruby scripts/check-yaml.rb`, `node --test tests/*.test.ts` (25 passing) and `git diff --check` passed. The generated manifest includes both new writing skills; the corpus contains 55 prepared cases. These checks validate metadata, links, YAML, fixtures and existing helper behaviour, not message-writing quality. The eight new cases have not been model-run or human-scored. Skill Creator `quick_validate.py` could not start because Python lacks PyYAML; no dependency was installed. No skill was installed, no remote content was changed and no message was sent.

## PR communication source check · 2026-11-25

Added the standalone PR communication skill, UI metadata, synthetic examples and six behavioral scenarios. The workflow uses repository requirements and selected writing examples, distinguishes reported evidence from verified checks, preserves screenshot context/provenance, and separates drafting from authorized publishing. No private messages, company links or real mention IDs are included in the skill or new fixtures.

On macOS / Node.js v24.14.1, `node scripts/check.ts`, `ruby scripts/check-yaml.rb`, `node --test tests/*.test.ts` (25 passing) and `git diff --check` passed. The generated release manifest includes the new skill. The corpus now contains 47 prepared scenarios; the six new cases have not been run or scored with a model. The Skill Creator `quick_validate.py` check could not start because both available Python interpreters lack PyYAML; no dependency was installed. Repository metadata/link and full Ruby YAML checks passed separately. Source changes were not installed, committed, pushed or published, and no Slack message was sent.

## Pre-publication review · 2026-11-23

Reviewed the complete pending v0.1.3 source, tests, release metadata and public documentation. Added reproductions and fixed two issues: an untracked installer in a temporary checkout could escape the original content verification, and a failed daily check could discard session notification history. Verification now requires a fully clean checkout, including ignored files, and failed checks preserve prior notification state. Remote lookup now uses GitHub's lightweight branch-ref endpoint instead of downloading a full commit diff. The English plugin version was advanced to match its changed package. All 25 executable tests, metadata/link and release-manifest checks, Ruby YAML parsing and diff whitespace checks passed on macOS / Node.js v24.14.1. A focused scan of the 38 changed/new files found no credential, real-salary-assignment or local-home-path pattern matches; this is not an exhaustive historical privacy audit. The corpus contains 41 unscored behavioral cases. Hosted CI and actual trusted session-start delivery are separate from these local results.

## Update notices · 2026-11-23

Privacy follow-up: Job Search now accepts optional desired compensation without requesting salary history, keeps real personal criteria out of public source/fixtures and external queries, and applies sensitive thresholds locally. Three synthetic scenarios use sentinel tokens rather than real personal data; the corpus now contains 41 prepared cases, not empirical model passes. A focused current-tree review of Job Search and related examples/docs found no actual owner salary; Git history and external copies were not audited. All 23 executable tests and repository checks passed again. The revised Job Search was installed with managed-baseline protection and a backup, then compared unchanged against source. No private compensation profile was edited.

Implemented the v0.1.3 release manifest, installation receipts/history, `--managed-only` preflight, cached update checker, consent-based Update skill and optional session-start plugin. On macOS / Node.js v24.14.1, repository metadata/links, generated-manifest consistency, Ruby YAML parsing, all 23 executable tests and diff whitespace checks passed. Controlled tests exercise 24-hour caching, per-session deduplication, offline/busy behavior, actual hook CLI JSON output, local/unmanaged/downgrade refusal, changes after preview, receipt history, corrupt-state preservation, pinned-checkout hash verification and separate plugin review. Tests use temporary folders and local Git fixtures; they make no remote publication or paid API calls. There are 38 prepared behavioral scenarios; no model scoring was performed.

Registered the existing eight standalone task-skill baselines without changing their contents. Installed `skilldock-updates@codex-extensions-lab` v0.1.3 from this local repository; the host plugin list reports installed/enabled and the cached plugin hash matches final source. The updater skill is supplied only by the plugin in this installation, avoiding a second standalone copy. A manually invoked installed checker returned `unavailable`; a successful remote release check was not established and this release manifest is not published. Hook trust and actual session-start execution have not been verified. No trust records, schedules or GitHub content were changed. Cross-device release-to-notification behavior remains untested.

## Work-context source review · 2026-11-23

Follow-up implementation: workplace English routing, short rehearsals and confidentiality guidance; internal-tool/existing-product Discovery; conditional AI UX and technical-design guidance; and AI Job Search evidence rules are now in source. The corpus contains thirty-six prepared cases, including ten further workplace cases. Final checks on the same macOS / Node.js v24.14.1 environment passed: metadata/links, full Ruby YAML parsing, twelve helper tests and diff whitespace checks. These checks do not score model behavior; no live research, paid API, audio or empirical teaching test was run. Installed copies were compared to their prior source before updating; all matched that baseline. Five changed skills were installed with backups via `--update`, and the subsequent preview reported all eight unchanged against current source. Private profiles and study records were not replaced. No plugin-host reload or discovery verification was performed. The paragraph below records the earlier review-only stage.

Reviewed all eight skill entrypoints and UI metadata plus the relevant workflow and English references. Implemented conditional Full Stack / AI Engineering / AI-focused FDE classification guidance in Job Search; workplace changes to the other skills remain [proposals](reviews/2026-11-23-work-context-review.md). On macOS with Node.js v24.14.1, `node scripts/check.ts`, full Ruby YAML parsing, all twelve helper tests and `git diff --check` passed. The corpus now contains twenty-six prepared scenarios, including two new AI-role classification cases; no model run or human scoring was performed. No live opportunity search, audio check or installed-copy update was performed for this change. The approved career-direction defaults were saved separately in a private profile, outside this repository.

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
