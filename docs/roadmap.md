# Roadmap

This is a proposed direction, not permission to implement, deploy, spend money or create schedules. Prioritize recurring user friction over adding a large catalog. No dates or delivery commitments are implied.

## Current foundation

Ten independent task skills, including PR communication and workplace message drafting, plus an Update workflow and optional cached session-start update plugin; private defaults and one-run overrides; on-demand research; local English chapters/history/audio/manual exports; separately published English Markdown learning records shared via Git; install/update backups; source attribution and runtime regression tests. See [validation](validation.md) for what was actually exercised and [architecture](architecture.md) for current boundaries.

## Next: confidence and daily usability

1. Run the [behavioral scenarios](../evals/README.md) with actual clients, preserving model/version, loaded skill revision, outputs and human assessment. Compare with no-skill baselines for representative tasks. Do not infer quality from longer prompts or passing metadata checks.
2. Add more examples from sanitized real feedback, especially mixed-language Polish, trailing notes, per-run geographic overrides and research claims without sources. Keep private originals out of the public corpus.
3. Improve reading/export presentation and offer explicit archive recovery/backup inspection. Confirm desktop discovery and audio playback in the user's actual clients before expanding compatibility claims.
4. If TypeScript helpers grow, add an approved dev-only compiler/type-checking setup and pinned dependency metadata. Runtime tests do not replace static types.

## Learning: useful extensions

- Evaluate the implemented workplace English scenarios, short rehearsals and teaching-versus-editing routing with actual learners. See the [work-context review](reviews/2026-11-23-work-context-review.md); instruction changes alone do not prove teaching quality.

- Structured vocabulary entries with meanings, collocations, example/source/audio references and optional review feedback. Current vocabulary is only a list of strings, so it is not yet a complete flashcard system.
- Export to Anki's documented text/media interface before considering a custom flashcard app. See [comparison](research/2026-11-16-ecosystem-review.md). Prototype and test actual Anki import before claiming support.
- If users want in-product spaced review, evaluate `ts-fsrs` rather than writing a new scheduler. It needs explicit recall ratings and review events; generated/read status is not sufficient evidence.
- A speech-provider interface for other operating systems or higher-quality voices. Compare verified en-AU output, latency, cost and privacy. Do not assume a provider label guarantees an authentic or appropriate accent.

## Later: connected and multi-device use

Define the user's required computer/phone/AI clients first. Then evaluate a remote MCP/API layer with independent learner identity, private storage, authentication and backups. Prototype one complete cross-device flow before selecting a cloud architecture. Sequential and diverging edits need lineage-aware merge/reconciliation; the current conservative conflict refusal is intentionally not background sync.

Hosted components and API audio are opt-in integrations with applicable costs and authorization, not prerequisites for local skills. No microphone recording or pronunciation assessment is planned without a new user requirement.

## Research and product workflows

- Run the prepared work-context evaluation cases for internal-tool Discovery, writing, AI-assisted UX and technical design. The instruction changes and synthetic cases are implemented; empirical validation remains open. See the [review of all eight skills](reviews/2026-11-23-work-context-review.md).

- Optional imported job data adapters only when they improve verified coverage; keep employer verification, eligibility and deduplication as the final filter.
- Evaluate official property-data access only after checking actual access, coverage, costs and the user's need. Avoid building a site-specific scraper merely to expand the codebase.
- Add small, evidence-linked discovery/interview/experiment templates when useful; reuse mature PM sources and existing visual-design plugins instead of importing entire agent frameworks.
- Offer project-specific profile overlays only if repeated use shows the need. Existing project requirements and current instructions continue to outrank personal defaults.

## Update confidence

Exercise a published-release-to-trusted-hook flow on each actual client. Local fixture tests cover update planning and installation protections, but do not prove hook trust, desktop delivery or cross-device rollout. Snooze settings and signed release manifests remain optional future work, not implemented promises.
