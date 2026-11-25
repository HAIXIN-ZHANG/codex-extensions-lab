# SkillDock

An independent, open-source collection of reusable Codex skills and a local English-learning plugin. Every public skill uses the `skilldock-` namespace and a `SkillDock · Purpose` display name. Not affiliated with or endorsed by OpenAI. The GitHub repository URL remains `HAIXIN-ZHANG/codex-extensions-lab`.

## Skills

- [Work messages](skills/skilldock-work-messages/SKILL.md) — draft progress updates, blocker/help requests, follow-ups, QA invitations, clarifications, feedback replies and handoffs.
- [PR communication](skills/skilldock-pr-comms/SKILL.md) — write concise PR summaries and Slack review requests using actual changes and relevant writing examples.
- [Polish](skills/skilldock-polish/SKILL.md) — edit prose in its original language; English defaults to natural Australian usage.
- [Australian English learning](plugins/skilldock-english/skills/skilldock-english/SKILL.md) — bilingual grammar, life and workplace scenarios, short meeting rehearsals, source research, saved materials and listening examples.
- [Job opportunity search](skills/skilldock-job-search/SKILL.md) — research suitable roles on demand, distinguishing Full Stack, AI Engineering and AI-focused FDE responsibilities when requested, with international remote or company-contract eligibility checks.
- [Property opportunity search](skills/skilldock-property-search/SKILL.md) — compare residential property opportunities on demand.
- [Product spike](skills/skilldock-product-discovery/SKILL.md) — investigate new products, existing-product improvements or internal tools using relevant user and business evidence.
- [Product design brief](skills/skilldock-ux-brief/SKILL.md) — define user journeys, UI states and experience requirements.
- [Technical design](skills/skilldock-tech-design/SKILL.md) — propose architecture, contracts and technical validation.
- [Prompt rewriting](skills/skilldock-prompt-rewrite/SKILL.md) — deduplicate and rewrite conversational prompts; [upstream attribution](skills/skilldock-prompt-rewrite/UPSTREAM.md).

The [message-writing guide](docs/message-writing.md) maps everyday workplace requests to Work Messages, Polish and PR Comms.

The [product workflow](docs/product-workflow.md) explains discovery, experience design and technical handoff. These are independent skills; no cross-stage agent engine is required.

The ten task skills can be installed independently. An additional [Update workflow](plugins/skilldock-updates/skills/skilldock-update/SKILL.md) and optional [update-notice plugin](docs/updates.md) check published versions and offer approved, backed-up updates. The English skill is also packaged as a [local plugin](plugins/skilldock-english/README.md). English helpers and the update checker use Node.js 24+ with no third-party packages. The other task skills are Markdown workflows and do not need Node to use.

The owner has chosen to share selected English materials and learning notes in [learning records](plugins/skilldock-english/learning-records/README.md). These Markdown records are public and are transferred between computers using Git; they are separate from the private local helper archive.

## Local setup and verification

```sh
node scripts/install-skills.ts --dry-run
node scripts/install-skills.ts --update
node scripts/check.ts
ruby scripts/check-yaml.rb
node --test tests/*.test.ts
```

Use either the standalone Update skill or the updater plugin to avoid duplicate discovery. The default all-skills source install includes the standalone Update skill; use the named task-skill command in [update setup](docs/updates.md) when choosing the plugin instead.

The installer defaults to the skill path used by this development environment: `CODEX_HOME/skills` (default `~/.codex/skills`). Set `--dest` for your client's actual discovery path, such as `~/.agents/skills`. Updates preserve the previous skill folder in a sibling `.backups` directory. Personal profiles and study history are never included or replaced. See [setup](docs/setup.md) for installation, personal settings and portability.

To migrate the old unprefixed skill names, preview `node scripts/install-skills.ts --update --migrate-legacy --dry-run`, then omit `--dry-run`. Legacy folders move into backups after the new skills are installed, preventing duplicate discovery entries. See [names and complete inventory](docs/naming.md). Personal data paths and study archive formats keep their existing keys.

Examples:

- `用 $skilldock-polish 润色下面这段文字。`
- `用 $skilldock-work-messages 根据这些要点写英文 Slack 消息，请 QA 帮忙回归。`
- `用 $skilldock-pr-comms 根据当前 diff 写 PR summary 和 Slack review message，沿用我给的范例。`
- `用 $skilldock-english 继续语法课。` / `五分钟后有技术 review，陪我练习解释方案取舍，一次问一个问题。`
- `用 $skilldock-job-search 按默认条件找工作，这次只看额外收入。`
- `用 $skilldock-property-search 找房，这次只看 Redcliffe 现房。`
- `用 $skilldock-prompt-rewrite 整理下面这段口语化 prompt，只改写不执行。`

## v0.1 boundaries

Research skills use the host's available, authorized browsing/connectors; they do not supply a crawler, paid database or guaranteed access to listings. The English tool persists local chapters and status, synthesizes with an installed macOS Australian voice, and exports/imports Markdown/HTML/JSON plus generated audio. Automatic cloud sync, remote authentication, phone integration and microphone assessment are not implemented. These limits are visible in the skills rather than simulated as working features.

Plugin packaging follows the [official portable manifest guidance](https://developers.openai.com/plugins/build/plugins). Local host installation and cross-account sign-in behavior still depend on the client and need verification. See [validation notes](docs/validation.md).

## Maintenance and direction

- [Architecture and private data boundaries](docs/architecture.md)
- [Roadmap: proposed next capabilities](docs/roadmap.md)
- [Code review and corrections](docs/reviews/2026-11-16-v01-review.md)
- [Workplace writing review](docs/reviews/2026-11-25-workplace-writing-review.md) — PR and message writing plus the existing work-oriented workflows.
- [Work-context skill review](docs/reviews/2026-11-23-work-context-review.md) — Job Search clarification, workplace improvements and review findings across all eight task skills.
- [Third-party comparison and DraftWise lessons](docs/research/2026-11-16-ecosystem-review.md)
- [Behavioral evaluation scenarios](evals/README.md) — prepared cases, not yet measured model results
- [Agent entry instructions](AGENTS.md)

GitHub Actions runs metadata/link checks, full YAML parsing and helper tests on Node.js 24. It performs no paid model calls or live job/property research. Current patch: v0.1.3. The behavioral cases are maintained separately from executable helper tests; `node scripts/check.ts` reports their current count. Neither the source review nor those prepared cases prove teaching or writing quality.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). MIT licensed; see [LICENSE](LICENSE).
