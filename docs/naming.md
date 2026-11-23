# SkillDock naming and inventory

The project display name is **SkillDock**. Skill identifiers use `skilldock-<purpose>`; UI names use `SkillDock · Purpose`. This is a collection namespace, not the maintainer's personal name or a claim of exclusive trademark ownership. The existing repository URL, checkout location and marketplace ID `codex-extensions-lab` remain stable so links and configured sources keep working.

## Implemented and independently installable

| Skill | UI name | Previous identifier |
| --- | --- | --- |
| `skilldock-polish` | SkillDock · Polish | `polish` |
| `skilldock-prompt-rewrite` | SkillDock · Prompt Rewrite | `prompt-rewriting` |
| `skilldock-english` | SkillDock · Australian English | `english-learning` |
| `skilldock-job-search` | SkillDock · Job Search | `job-opportunity-search` |
| `skilldock-property-search` | SkillDock · Property Search | `property-opportunity-search` |
| `skilldock-product-discovery` | SkillDock · Product Discovery | `product-spike` |
| `skilldock-ux-brief` | SkillDock · UX Brief | `product-design-brief` |
| `skilldock-tech-design` | SkillDock · Technical Design | `technical-design` |

English is also a plugin named `skilldock-english` under `plugins/skilldock-english`. It has one canonical nested skill, not a second root-level source. Other workflows are standalone skills.

## Proposed work skills, not implemented or installed

Six DevPad source prompts were privately extracted and analyzed on 2026-11-16. They suggest five new skills:

| Reserved name | Intended scope |
| --- | --- |
| `skilldock-dev-analyze` | Read-only analysis of a concrete engineering task |
| `skilldock-dev-execute` | Implement the assigned, confirmed scope |
| `skilldock-dev-review` | Local and remote PR review as separate modes |
| `skilldock-dev-verify` | Targeted verification without automatic fixes |
| `skilldock-dev-refocus` | Refocus and resume an already authorized task |

These names reserve a consistent future namespace only. There are eight working skills, not thirteen. The raw work prompts and private analysis have not been published in this repository. An implementation assignment and resolved workflow details are still required.

## Migration and compatibility

`scripts/catalog.ts` maps public identities to legacy names. `--migrate-legacy` is explicit: first install/update the selected new skills, then move matching legacy folders into `<destination>.backups`. Migration is previewable with `--dry-run`; it does not delete user edits or silently migrate unrelated skill names. Backups are recoverable and outside discovery. This is not an invocation alias: after migrating, use the new `$skilldock-...` names.

Profile keys such as `job-opportunity-search.md`, `property-opportunity-search.md`, `product-workflow.md` and `english-learning.md` stay unchanged. English's `extension-data/english-learning`, `ENGLISH_LEARNING_HOME` and `english-learning-v1` format also stay unchanged. A skill-name change should not reset history, preferences or previously exported files.

Historical review/research records may refer to old names at their reviewed revisions. Current source links point to the new locations. Upstream attribution retains the original external project/skill names; the SkillDock label does not claim authorship of third-party content.

The updater has one canonical skill at `plugins/skilldock-updates/skills/skilldock-update`, displayed as `SkillDock · Update`. It has no legacy name migration. Use either the standalone installed skill or the plugin-provided skill.
