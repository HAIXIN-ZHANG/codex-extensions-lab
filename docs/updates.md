# SkillDock update notices

SkillDock provides an update workflow and an optional local Codex plugin. The ten task skills remain independently installable. A standalone `skilldock-update` supports explicit checks; the plugin contains the same canonical update skill plus a session-start hook. Choose one installation of the update skill to avoid duplicate discovery entries.

## What runs

The hook runs Node.js 24 code at session startup, resume or clear. It reads the installed skill receipts and checks the fixed public repository `HAIXIN-ZHANG/codex-extensions-lab`. A check resolves `main` to an immutable commit and reads `updates/manifest.json` from that commit. Successful and failed remote attempts are cached for 24 hours. Failed attempts preserve the prior per-session notification history for later recovery. Two HTTP requests have separate 2.5-second timeouts; the host hook has an eight-second timeout. Checks use no model API, paid service, background daemon or schedule.

The release manifest contains a suite version and content hashes for each skill, plus the updater plugin hash. Only installed skills with a known baseline, unchanged local files and a newer published version are eligible. Same-hash skills, README-only commits and public learning records do not produce skill update notices. A local edit, unknown baseline or non-newer release is reported separately by an explicit check. Hook errors remain quiet; they do not establish that the installation is current.

A session ID from the hook input deduplicates notices for a release; the cache retains the most recent 100 notified session IDs. The assistant also avoids repeating an offer already shown or declined in the current chat. Missing session IDs produce no hook notice. A force check bypasses the network cache but not installation protections. Snooze settings and indefinite notification history are not implemented.

## Local installation

Install the ten task skills and register their exact current contents using the source installer. An unchanged skill gets a baseline receipt without changing its folder. Before adopting an existing installation, inspect differences; do not bless unexplained local edits as a managed baseline.

```sh
node scripts/install-skills.ts skilldock-polish skilldock-pr-comms skilldock-work-messages skilldock-prompt-rewrite skilldock-job-search skilldock-property-search skilldock-product-discovery skilldock-ux-brief skilldock-tech-design skilldock-english --update --dry-run
# After reviewing the preview, repeat without --dry-run.
codex plugin marketplace add /absolute/path/to/codex-extensions-lab
codex plugin add skilldock-updates@codex-extensions-lab
```

If the marketplace is already registered, use that existing source instead of registering it twice. The plugin contains `skilldock-update`; do not also copy that skill into another discovery directory. If only on-demand checks are wanted, install `skilldock-update` with the source installer and omit the plugin.

The plugin's hook must be reviewed and trusted in the host. In Codex desktop, inspect Settings → Hooks and verify that SkillDock runs only `node "${PLUGIN_ROOT}/skills/skilldock-update/scripts/updates.ts" hook` at `SessionStart`. Trust is a user action; this repository never edits trust records. Installation is not execution proof. Restart once if the new hook does not appear, then verify with the actual client. A plugin-cache refresh is separate from updating standalone skill folders.

Default standalone discovery is `CODEX_HOME/skills` (`~/.codex/skills`). For a custom destination, explicitly configure `CODEX_HOME/extension-data/skilldock-updates/config.json` with `{"destination":"/absolute/skills/path"}`. This file is private and is not created by installing public source. Both command and hook modes use that configuration. The plugin cannot infer every client's discovery path.

## Existing installations without receipts

An explicit check reports `unmanaged` with migration guidance when a skill folder exists without an installation receipt. This status means its installed version and local-edit history are unknown. Checks leave those folders untouched.

To migrate, first review and verify the chosen release checkout as described by the Update skill. Compare each selected installed folder against its source and retain any local customizations that you need. Preview only the selected names with `node scripts/install-skills.ts <names> --dest <actual-destination> --update --dry-run`, then apply that command after authorizing the migration. Identical folders gain baseline receipts; differing folders are backed up before replacement. Subsequent checks can identify managed updates and local changes. This initial source-install path establishes a baseline; a failed protected update still requires resolving its cause before retrying.

## Consent and installation safety

Use `$skilldock-update` for a check. An eligible update notice names the affected skills and offers review; it does not install. Review changes at the pinned commit and apply only the approved skills from an isolated checkout. The update skill documents the exact procedure, including trusted-checker verification of the pinned commit, a fully clean checkout (including ignored files), content hashes and the installer's `--managed-only` flag.

Installation uses the existing exclusive lock. Receipts live at `<destination>.skilldock-state/receipts.json` outside discovery and record content hashes, suite version and prior receipts. `--managed-only` rechecks actual contents under the lock, refuses unmanaged or locally changed folders, and rejects downgrades. Differing versions are backed up under `<destination>.backups`. A failure can leave some skills updated; report that state and recheck before retrying. Do not retry by removing protections. Corrupt receipts are preserved and cause an error. Old manual `--update` remains an explicit backup-and-replace operation for reviewed source installs, not the automatic update path.

The checker uses a separate `.check-lock` and atomic cache writes. A stale lock from a crashed process is not deleted automatically; inspect active processes before recovery. Private profiles, trackers, learning archives and public Markdown learning plans are never update payloads.

The updater plugin itself is reported as `plugin-review` when a newer suite contains a changed plugin. This is a review request, not a managed standalone installation: refresh the reviewed plugin through the host marketplace mechanism with explicit scope and any renewed hook trust. Review plugin-cache changes separately from receipt-managed skills.

## Publishing a release

1. Make and validate source changes. Advance `package.json` to a newer stable three-part version for a published skill release. If updater plugin code or hooks change, also advance its `plugin.json` version.
2. Run `node scripts/release-manifest.ts`, which hashes skill directories and the updater package, excluding unrelated documentation and public learning records by construction.
3. Run repository checks, including `node scripts/release-manifest.ts --check`, and inspect the generated manifest and actual changes.
4. Commit and push source plus the manifest only with the user's publication authorization. The checker sees published `main`, not uncommitted source or changes only on another computer. A release must not be made by changing the manifest without matching source.

A missing remote manifest, unavailable network or GitHub rate limit yields an unavailable check, not a false update or an automatic auth/setup flow. Current tests use controlled local releases; real cross-device publication-to-reminder behavior still requires a published release and trusted host hook.
