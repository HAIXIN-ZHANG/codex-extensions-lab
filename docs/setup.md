# Setup and portability

Clone this repository to work on the extensions:

```sh
git clone https://github.com/HAIXIN-ZHANG/codex-extensions-lab.git
cd codex-extensions-lab
```

With Node.js 24+, preview installation with `node scripts/install-skills.ts --dry-run`, then install all eight with `node scripts/install-skills.ts`. Add one or more names for a subset. It defaults to `CODEX_HOME/skills` (default `~/.codex/skills`); use `--dest /absolute/path/to/skills` if your client uses a different discovery path. It refuses differing existing folders unless you pass `--update`; updates back up old folders under `<destination>.backups` outside the discovery directory before replacement. Inspect backups before removing them. Updates never touch private profiles or history. Run the same command after pulling source changes to update installed copies.

Alternatively, ask the host's skill installer to install a skill from this repository and its path. The English path is `plugins/english-learning/skills/english-learning`; other paths are `skills/<name>`. Without Node, copy only the desired whole skill folder to a supported discovery path, preserving any existing version. Start a new chat or restart the client if necessary and invoke it by name. Installation does not make the current chat know the updated skill instructions until it reloads them.

These skills may read optional personal preferences from `~/.codex/extension-profiles/job-opportunity-search.md` or `~/.codex/extension-profiles/property-opportunity-search.md`. Those files are not supplied by this public repository. Create and maintain them locally if useful; current instructions from the user take precedence. They may contain sensitive personal data: keep them out of public repositories. To use preferences on a different computer, transfer them securely or provide them again. The repository does not transfer account permissions, external-service connections, credentials, or local dependencies.

The product discovery, experience brief and technical design skills share an optional `extension-profiles/product-workflow.md` under `CODEX_HOME` (default `~/.codex`). Start from [the public profile template](examples/product-workflow-profile.md), keep the filled version private, and scope preferences explicitly. See [the workflow guide](product-workflow.md) for precedence, per-task updates and handoffs. Installing/updating public skills does not overwrite private preferences; transfer that file separately when changing computers or Codex home directories.

See [the English plugin guide](../plugins/english-learning/README.md) for its plugin packaging, helper prerequisites and actual cross-device limits. The independent skill installer is the locally exercised path; plugin-host loading must be verified in the target client.

## Accounts and devices

Local skill files and private profiles are filesystem resources, not account-synced data. On the same computer and operating-system user, switching the AI login normally does not require recopying files if the same local discovery paths and configuration remain in use. Account/workspace policies and external connector authorization can still differ. This repository has not tested a sign-out/sign-in transition across accounts.

The development environment currently discovers installed skills under `~/.codex/skills`. Current [official documentation](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) describes user skills under `~/.agents/skills` and repository skills under `.agents/skills`; use the locations supported by the actual client when installing on another machine. Do not install duplicate copies in multiple discovery paths merely to match both conventions.

A different computer, operating-system user, isolated environment or cloud execution host needs its own skill installation and any required permissions. Transfer private profiles and history separately and securely; a public repository must not carry them. No automatic installation, cloud sync or external-service reauthorization is provided by the current repository.
