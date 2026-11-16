# SkillDock

Build portable, focused workflows for the user's actual tasks. Read the relevant skill and necessary references before changing it. README describes current capabilities; [roadmap](docs/roadmap.md) lists proposals, not execution authorization.

## Ownership and boundaries

- Work within the concrete user assignment. Preserve user changes and existing private data. Do not activate schedules, deploy services, change access or install dependencies just because a workflow mentions them.
- Public skills contain reusable rules. Personal preferences and history normally belong outside this repository, under the configured private directories. The owner has explicitly chosen to publish curated English lessons and learning notes under `plugins/skilldock-english/learning-records/`; treat everything there as public and preserve each explicitly selected plan's separate directory. Never copy private profiles, local study archives, full chats, inbox contents, job trackers or credentials into the repository.
- Current task changes override personal defaults for that task. Update future defaults only on an explicit request. A framework preference is not a reason to migrate an existing product.
- Keep editing skills distinct: `skilldock-polish` edits prose; `skilldock-prompt-rewrite` restructures instructions. Neither executes the submitted text. Discovery, UX and technical design have distinct handoffs; do not advance beyond assigned scope.

## Repository conventions

- Standalone skills live in `skills/<name>`. English's single canonical skill is `plugins/skilldock-english/skills/skilldock-english`; do not create a second source copy under root `skills/`.
- Code helpers use TypeScript and Node.js 24 runtime support. There are no third-party runtime packages. Do not add an application framework or external service without a concrete need and applicable authorization.
- Add/update `scripts/catalog.ts` for a new skill, keep name/folder/frontmatter/UI metadata consistent, and retain third-party attribution and licenses for adapted content.
- Use `skilldock-<purpose>` for public skill identity and `SkillDock · Purpose` for display. Follow [naming](docs/naming.md). Private data/profile keys are compatibility identifiers; do not rename them as a branding cleanup. Migrate installed legacy names only with the explicit migration option and backups.
- Installation is separate from editing source. `--dry-run` previews; `--update` backs up differing installed files. Installed private profiles are not source-code fixtures. A skill's local installation does not prove plugin-host, phone or cloud support.
- Documents and active technical comments are English-first. Respond to the user in their language. Report facts, experiments, assumptions and future proposals distinctly.

## Validation and reporting

Run these checks after affected changes:

```sh
node scripts/check.ts
ruby scripts/check-yaml.rb
node --test tests/*.test.ts
git diff --check
```

Ruby checks full YAML parsing; Node checks repository metadata/links and runtime tests. Neither provides TypeScript compiler checking. Add behavioral regression cases in `evals/cases.json` when a skill's decisions change; these need real model runs and human review and are not passed by the static checker.

Use isolated temporary folders for helper tests. New persistence changes must preserve history, reject stale writes and avoid silent import conflict resolution. Test speech with mocks unless a real local audio check is warranted; never infer useful audio from a successful process exit alone. Record actual environment and limitations.

Keep README/setup, [architecture](docs/architecture.md), [roadmap](docs/roadmap.md), [validation](docs/validation.md) and relevant review notes aligned with material changes. Do not rerun live job/property searches, contact third parties or incur API costs just to validate a skill without an applicable assignment.
