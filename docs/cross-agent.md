# SkillDock v0.2.0: Codex and Claude Code

Scope: local Codex and Claude Code installation and packaging, using one editable skill catalog. No MCP server, cloud service, account migration or automatic private-data migration is included. Platform-native discovery, authorization, hook delivery and model behavior still need testing in each actual client.

## Compatibility matrix

| Capability | Codex | Claude Code | Evidence / limit |
| --- | --- | --- | --- |
| Shared SKILL.md and references | Same canonical sources | Same canonical sources | Metadata and file checks; model behavior not inferred |
| Standalone installation | Native `.agents/skills`, with legacy `.codex/skills` compatibility | `.claude/skills` (or CLAUDE_CONFIG_DIR/skills) | Isolated installation and CLI tests |
| Native plugin metadata | Portable root manifest and OpenAI marketplace | `.claude-plugin/plugin.json` and marketplace | Maintained subset checks plus Claude 2.1.193 strict native validation; actual client loading remains unverified |
| Package-contained helpers | Generated bundle | Same generated bundle | Helpers execute outside this checkout in tests |
| Update hook | Explicit Codex command and output adapter | Explicit Claude command and output adapter | Both command entrypoints tested with controlled releases; actual host delivery unverified |
| Private preferences / learning state | Optional SKILLDOCK_HOME | Same optional SKILLDOCK_HOME | Resolver and no-write tests; existing data untouched |
| Existing archives, receipts and backups | Preserved | Reused per installation / selected data root | Rollback, legacy receipt, import conflict and revision tests |
| Audio | Existing macOS local voice helper | Same helper on macOS | Mocked tests only for this release; other OS synthesis unsupported |
| Browser / GitHub / Slack tools | Host supplies authorized access | Host supplies authorized access | No connector or credential transfer |

The audit and approved incremental plan are in [the design review](reviews/2026-11-27-cross-agent-plan.md). Official documentation pointers and dates are recorded there.

## Install skills

Node.js 24+ is required by the installer and helpers. No runtime packages are installed.

```sh
# Legacy command and output shape remain supported.
node scripts/install-skills.ts --dry-run

# Explicit host targets. Remove --dry-run only when installation is wanted.
node scripts/install-skills.ts --target codex --dry-run
node scripts/install-skills.ts --target claude --dry-run
node scripts/install-skills.ts --target all --dry-run
node scripts/install-skills.ts skilldock-job-search --target claude --dest /absolute/custom/skills --dry-run
node scripts/install-skills.ts --target all --codex-dest /absolute/codex/skills --claude-dest /absolute/claude/skills --dry-run
```

Without `--target`, the default remains `CODEX_HOME/skills` or `~/.codex/skills`. Explicit Codex resolution uses an existing legacy SkillDock installation when present, otherwise `~/.agents/skills`. If both contain SkillDock installations, select a destination explicitly after inspecting duplicates. Explicit Claude resolution uses `~/.claude/skills`, respecting `CLAUDE_CONFIG_DIR`. `--dest` is deliberately rejected with `--target all`; each host needs its own destination. Equal, nested or symlink-aliased targets are rejected.

All-target installation locks the destinations and preflights every target before writing skills. It is not a cross-target transaction. If a later target fails, the error names completed targets; the failing skill is restored when its receipt write fails. Recheck before a protected retry. Existing `--update`, `--managed-only`, `--migrate-legacy`, backups and receipt history remain available. Legacy name migration concerns only public skill discovery folders, never personal data.

Do not install a standalone skill and a plugin that supplies the same skill in the same host. This includes English and Update. Claude plugin commands are namespaced, so duplicate content can still load under a second command. Codex may expose duplicate names. Check explicit discovery roots, including registered plugin `skills/` directories:

```sh
node scripts/doctor.ts /absolute/user/skills /absolute/plugin/skills
```

The doctor only inspects supplied directories; it is not a scanner of every host cache or account-managed skill. Neither installer nor doctor deletes or resolves duplicates automatically.

## Native plugins and self-contained packages

Existing source roots remain `plugins/skilldock-english` and `plugins/skilldock-updates`. The portable Codex and native Claude manifests are included together, but hook definitions are separate. There is intentionally no default `hooks/hooks.json` alongside explicitly declared hook files: Claude merges default and declared hooks, which would otherwise trigger duplicate checks.

```sh
node scripts/build-plugins.ts --out /absolute/new/skilldock-packages
```

Output contains `codex/` and `claude/`, each with a native marketplace and both plugin packages. They are generated from the same catalog and manifests, not separate edited skill copies. A package includes only its skills, required code, hook configuration, manifests and license. Public learning notes remain a separately selected repository resource. The output directory must be new; existing output is not overwritten.

Runtime path logic has one canonical source at `runtime/paths.ts`. Two generated snapshots are committed inside the existing skill roots so direct plugin/source installation remains self-contained. `node scripts/sync-runtime.ts --check` checks these copies and generated native manifests. The artifact bundler includes the canonical writing checker in the three writing skills and contains relative TypeScript dependencies inside the installed skill. Editable rules remain canonical; generated code is never edited independently.

Codex local plugin commands remain:

```sh
codex plugin marketplace add /absolute/path/to/codex-extensions-lab
codex plugin add skilldock-updates@codex-extensions-lab
```

Claude setup uses its native marketplace (the repository or generated `claude/` marketplace root):

```text
/plugin marketplace add /absolute/path/to/codex-extensions-lab
/plugin install skilldock-updates@codex-extensions-lab
```

For development validation, use `claude plugin validate /absolute/plugin/root` when the CLI is available. The installed Claude Code 2.1.193 CLI was used for read-only validation of generated English/Updates packages and the native marketplace. This validates packaging, not actual discovery, hook execution or model behavior. Confirm both clients' skill listing and exact invocation before use: Codex uses `$skill-name`; Claude standalone skills use `/skill-name`, and plugin skills use the actual plugin namespace, such as `/skilldock-english:skilldock-english`.

## Updates and release integrity

The update engine contains release retrieval, planning, cache, hash validation and baseline checks. The CLI selects host/data/destination; the adapter formats host-facing notices. Legacy `updates.ts` is retained as a wrapper. New hook commands pass `--host codex` or `--host claude` explicitly.

```sh
node /absolute/skilldock-update/scripts/updates.ts check --host claude
node /absolute/skilldock-update/scripts/updates.ts check --host codex --dest /absolute/custom/skills
```

The selected data root's `extension-data/skilldock-updates/config.json` can contain:

```json
{
  "destinations": {
    "codex": "/absolute/codex/skills",
    "claude": "/absolute/claude/skills"
  }
}
```

Legacy `destination` remains Codex-only; it is not applied to Claude. Network results may share the daily cache, but notification keys include host and destination. Checks never install skills. Each destination has its own receipts and backups. The legacy no-host CLI retains the old Codex path semantics.

The schema-1 manifest retains source `hash` fields and `updaterHash` for old readers. New `artifacts.codex` / `artifacts.claude` fields describe generated installed skills. Plugin entries include their actual version and source/artifact hashes. New checkers compare installed artifacts, not source hashes. Before a v0.1-to-v0.2 update, review and refresh the updater itself so subsequent checks understand generated artifacts; old source-only readers cannot fully classify new artifact installs. A pinned clean checkout and consent remain mandatory. Version 0.2.0 is shared by suite and platform manifests; static checks reject drift.

## Private data and a future migration

No migration command runs during install, build, checks or normal startup. Path rules are host-independent:

1. English's explicit `ENGLISH_LEARNING_HOME` override remains highest priority for its archive.
2. If `SKILLDOCK_HOME` is set, use that absolute root for `extension-profiles/` and `extension-data/`.
3. Otherwise retain `CODEX_HOME`, or `~/.codex` when unset.

An explicit new root is authoritative: do not fall back to or merge old profiles when a shared file is absent. Do not treat an empty new learning archive as proof that no legacy archive exists. Two clients may use `SKILLDOCK_HOME=/absolute/private/skilldock`, or point it at the existing legacy root to share without moving files. Setting a variable in one terminal does not configure every desktop process; configure each client explicitly and verify its resolved path.

A future migration requires a separate explicit assignment: stop active writers, inspect source/destination, make a private backup/export, preview intended copies, reject conflicts, copy without deleting the source, verify history/audio/profile contents and checksums, then opt each client into the selected root. Never merge archives by timestamps, silently replace profiles or import a private archive into public learning records. Reverting the selected root is a configuration change, not automatic data reconciliation. Existing import/export tools preserve history and reject conflicting IDs.

## Verification still required in real clients

- Confirm native discovery and exactly one loaded copy of every selected skill.
- Confirm plugin marketplace registration, platform manifest validation and namespace handling.
- Review the actual hook and grant trust through the client's UI when required; never edit trust records to bypass review.
- Confirm actual SessionStart output delivery and behavior after resume/clear; async semantics and process lifetimes differ.
- Rehearse update review, refusal, successful install and retry from a published release, with private fixture data.
- Run selected behavioral cases independently on each client/model, including salary privacy, editing boundaries, English plan selection and protected updates.

Automated package/CLI tests and prepared cases are evidence of their tested invariants, not proof of model quality, actual client discovery, Windows support, cloud support or cross-device sync.
