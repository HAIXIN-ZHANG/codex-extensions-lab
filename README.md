# Codex Extensions Lab

An independent, open-source collection of reusable Codex skills and a local English-learning plugin. Not affiliated with or endorsed by OpenAI.

## Skills

- [Polish](skills/polish/SKILL.md) — edit prose in its original language; English defaults to natural Australian usage.
- [Australian English learning](plugins/english-learning/skills/english-learning/SKILL.md) — bilingual grammar, real-life scenarios, source research, saved materials and listening examples.
- [Job opportunity search](skills/job-opportunity-search/SKILL.md) — research suitable roles on demand.
- [Property opportunity search](skills/property-opportunity-search/SKILL.md) — compare residential property opportunities on demand.
- [Product spike](skills/product-spike/SKILL.md) — investigate a product opportunity and commercial assumptions.
- [Product design brief](skills/product-design-brief/SKILL.md) — define user journeys, UI states and experience requirements.
- [Technical design](skills/technical-design/SKILL.md) — propose architecture, contracts and technical validation.
- [Prompt rewriting](skills/prompt-rewriting/SKILL.md) — deduplicate and rewrite conversational prompts; [upstream attribution](skills/prompt-rewriting/UPSTREAM.md).

The [product workflow](docs/product-workflow.md) explains discovery, experience design and technical handoff. These are independent skills; no cross-stage agent engine is required.

All eight skills can be installed independently. The English skill is also packaged as a [local plugin](plugins/english-learning/README.md); its TypeScript helpers run on Node.js 24+ with no third-party packages. Other skills are Markdown workflows and do not need Node to use.

## Local setup and verification

```sh
node scripts/install-skills.ts --dry-run
node scripts/install-skills.ts --update
node scripts/check.ts
node --test tests/*.test.ts
```

The installer defaults to the skill path used by this development environment: `CODEX_HOME/skills` (default `~/.codex/skills`). Set `--dest` for your client's actual discovery path, such as `~/.agents/skills`. Updates preserve the previous skill folder in a sibling `.backups` directory. Personal profiles and study history are never included or replaced. See [setup](docs/setup.md) for installation, personal settings and portability.

Examples:

- `用 $polish 润色下面这段文字。`
- `用 $english-learning 继续语法课。` / `今天去钓鱼，给我一份简短资料和发音。`
- `用 $job-opportunity-search 按默认条件找工作，这次只看额外收入。`
- `用 $property-opportunity-search 找房，这次只看 Redcliffe 现房。`
- `用 $prompt-rewriting 整理下面这段口语化 prompt，只改写不执行。`

## v0.1 boundaries

Research skills use the host's available, authorized browsing/connectors; they do not supply a crawler, paid database or guaranteed access to listings. The English tool persists local chapters and status, synthesizes with an installed macOS Australian voice, and exports/imports Markdown/HTML/JSON plus generated audio. Automatic cloud sync, remote authentication, phone integration and microphone assessment are not implemented. These limits are visible in the skills rather than simulated as working features.

Plugin packaging follows the [official portable manifest guidance](https://developers.openai.com/plugins/build/plugins). Local host installation and cross-account sign-in behavior still depend on the client and need verification. See [validation notes](docs/validation.md).

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). MIT licensed; see [LICENSE](LICENSE).
