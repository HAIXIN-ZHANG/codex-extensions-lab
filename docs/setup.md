# Setup and portability

The collection is named SkillDock. Use the [current names and migration table](naming.md); old unprefixed invocation names are retired only when you explicitly migrate their installed folders.

Clone this repository to work on the extensions:

```sh
git clone https://github.com/HAIXIN-ZHANG/codex-extensions-lab.git
cd codex-extensions-lab
```

The repository's VS Code workspace settings allow the Chinese full-width colon in Markdown, where it is intentional punctuation. Unicode highlighting for other ambiguous or invisible characters remains enabled according to the editor's existing settings. This does not change global editor preferences or source-code punctuation.

With Node.js 24+, preview installation with `node scripts/install-skills.ts --dry-run`, then install the ten task skills plus the standalone Update skill with `node scripts/install-skills.ts`. Add one or more names for a subset. It defaults to `CODEX_HOME/skills` (default `~/.codex/skills`); use `--dest /absolute/path/to/skills` if your client uses a different discovery path. It refuses differing existing folders unless you pass `--update`; updates back up old folders under `<destination>.backups` outside the discovery directory before replacement. Inspect backups before removing them. Updates never touch private profiles or history. Run the same command after pulling source changes to update installed copies.

Alternatively, ask the host's skill installer to install a skill from this repository and its path. English is at `plugins/skilldock-english/skills/skilldock-english`, Update at `plugins/skilldock-updates/skills/skilldock-update`, and the other task skills at `skills/<name>`. Without Node, copy only the desired whole skill folder to a supported discovery path, preserving any existing version; the Update checker and English helpers still require Node.js 24+. Start a new chat or restart the client if necessary and invoke it by name. Installation does not make the current chat know the updated skill instructions until it reloads them.

For an update preview, use `node scripts/install-skills.ts --update --dry-run`. Concurrent mutating installers are rejected with a sibling `<destination>.install-lock`; if a process dies leaving this directory, first verify that no installer is active before manual recovery. Staging and backups are outside the skill discovery directory. This protects cooperating local installs, not synchronized multi-device updates.

For the v0.1.2 naming migration, add `--migrate-legacy`: preview with `node scripts/install-skills.ts --update --migrate-legacy --dry-run`, then run without `--dry-run`. Existing legacy folders move to backups after new skills install; their private configuration/data paths remain unchanged. This flag is opt-in so normal installations do not retire similarly named local skills unexpectedly.

Job Search accepts an optional compensation preference (desired range/minimum, currency and pay basis) from the current request or private profile. Current/previous salary is not required. Public source and examples contain generic fields only; apply sensitive thresholds locally and avoid repeating them in ordinary results or external searches. One-run inputs do not become saved defaults automatically.

These skills may read optional personal preferences from `~/.codex/extension-profiles/job-opportunity-search.md` or `~/.codex/extension-profiles/property-opportunity-search.md`. Those files are not supplied by this public repository. Create and maintain them locally if useful; current instructions from the user take precedence. They may contain sensitive personal data: keep them out of public repositories. To use preferences on a different computer, transfer them securely or provide them again. The repository does not transfer account permissions, external-service connections, credentials, or local dependencies.

The product discovery, experience brief and technical design skills share an optional `extension-profiles/product-workflow.md` under `CODEX_HOME` (default `~/.codex`). Start from [the public profile template](examples/product-workflow-profile.md), keep the filled version private, and scope preferences explicitly. See [the workflow guide](product-workflow.md) for precedence, per-task updates and handoffs. Installing/updating public skills does not overwrite private preferences; transfer that file separately when changing computers or Codex home directories.

See [the English plugin guide](../plugins/skilldock-english/README.md) for its plugin packaging, helper prerequisites and actual cross-device limits. The independent skill installer is the locally exercised path; plugin-host loading must be verified in the target client.

## Update notifications

For automatic session-start notices, use the optional updater plugin and review its hook in the actual host. Use either the plugin-provided Update skill or its standalone copy. See [update setup and publishing](updates.md) for baseline registration, custom destinations, consent, backups and release checks. The updater does not publish this repository or activate a schedule.

PR communication is a standalone writing workflow at `skills/skilldock-pr-comms`. To install only this skill after reviewing source, run `node scripts/install-skills.ts skilldock-pr-comms --dry-run`, then omit `--dry-run`. It uses supplied or authorized project evidence and relevant writing examples; it does not provide GitHub/Slack access or send messages merely by drafting.

Work Messages drafts from notes or task context; Polish edits existing prose; PR Comms handles PR descriptions and review requests. See [message-writing scenarios](message-writing.md). Work Messages can be previewed separately with `node scripts/install-skills.ts skilldock-work-messages --dry-run`; omit `--dry-run` only when installation is requested.

## Life and workplace use

The same English skill supports everyday study and workplace rehearsal. For example, request a five-minute design-review practice or an explanation of tentative wording in a status update. A short rehearsal does not require a saved plan. Keep company material in an authorized private workspace/archive; public learning records are for suitable public content only. Product Discovery also supports existing-product improvements and internal tools, while project guidance owns company-specific conventions.

## Accounts and devices

Local skill files and private profiles are filesystem resources, not account-synced data. On the same computer and operating-system user, switching the AI login normally does not require recopying files if the same local discovery paths and configuration remain in use. Account/workspace policies and external connector authorization can still differ. This repository has not tested a sign-out/sign-in transition across accounts.

The development environment currently discovers installed skills under `~/.codex/skills`. Current [official documentation](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) describes user skills under `~/.agents/skills` and repository skills under `.agents/skills`; use the locations supported by the actual client when installing on another machine. Do not install duplicate copies in multiple discovery paths merely to match both conventions.

A different computer, operating-system user, isolated environment or cloud execution host needs its own skill installation and any required permissions. Transfer private profiles and helper archives separately and securely. Explicitly published learning notes under [learning records](../plugins/skilldock-english/learning-records/README.md) can be obtained by pulling the repository; they are independent of private helper history. No automatic installation, cloud sync or external-service reauthorization is provided by the current repository.
