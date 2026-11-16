# Ecosystem and DraftWise review · 2026-11-16

This is a bounded source review, not a benchmark or an endorsement. Activity, repository scope and license information are signals of reusable engineering work, not proof of output quality. We inspected primary repository documentation/source rather than installing candidate packages or invoking paid services. Links and metadata may change after this date.

## Reuse decisions

| Source inspected | Useful capability | Decision for this repository |
| --- | --- | --- |
| [writing-skills / prompt-improving](https://github.com/msimchowitz/writing-skills/tree/main/for-agents/prompt-improving) | Faithful prompt editing, relevant clarification, result-only workflow | Already adapted as `prompt-rewriting`, with MIT terms and [provenance](../../skills/prompt-rewriting/UPSTREAM.md). Keep the adaptation: quoted-only intake and mandatory questions do not fit every use here. |
| [writing-skills / general-writing](https://github.com/msimchowitz/writing-skills/tree/main/for-agents/general-writing) | Voice-sensitive editing and identifying generic AI prose | Reference only. Its extra helper dependency and default change commentary do not match result-only Polish. No additional source vendored. |
| [Superpowers](https://github.com/obra/superpowers) | Design alternatives, task decomposition and reviewable execution plans | Reference only (MIT). Retain traceable handoffs and concrete acceptance checks. Do not adopt its global creative-work trigger, mandatory approval sequence or subagent dependencies. |
| [PM Skills](https://github.com/phuryn/pm-skills) | Focused discovery, assumptions, interviews and experiment workflows | Reference only (MIT). Add a compact optional validation reference to `product-spike`; do not install the whole marketplace or mechanically apply numeric scoring without evidence. Source snapshot: `9af7bfd0bc47fdad43c2eaa7a43cd13918e7aaef`. |
| [Anki text/media import](https://docs.ankiweb.net/manual/importing/text-files) | Interoperability with an established flashcard application, including audio references | Prioritize an export adapter in the roadmap rather than reproducing Anki. No Anki application source copied and no deck-import compatibility claimed yet. |
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | Existing TypeScript spaced-repetition implementation; [MIT license](https://github.com/open-spaced-repetition/ts-fsrs/blob/main/LICENSE) | Future candidate only. No dependency installed. Need real review events and feedback before using a scheduler. |
| [JobSpy](https://github.com/speedyapply/JobSpy) | Job-board aggregation with a structured output and optional MCP interface | Optional future discovery adapter (MIT), not a current dependency. Its output still needs live employer verification and location/work-eligibility checks; do not inherit scraping/proxy settings as authorization. No live scraping performed. |

The [Domain getting-started guide](https://help.domain.com.au/hc/en-us/article_attachments/360032042153) describes registration and scopes for API access. It is not evidence of this user's current entitlement, current pricing or complete listing coverage. No property API was connected.

All decisions above are independent adaptations of workflow ideas except the already attributed `prompt-rewriting` skill. Reference links are not bundled code. Reassess dependencies and licenses before future copying or integration, preserving required notices for any actual source reuse.

## DraftWise-AI: product lessons, not a service migration

The user's older repository is [HAIXIN-ZHANG/DraftWise-AI](https://github.com/HAIXIN-ZHANG/DraftWise-AI), inspected at `d38d0860f13dd75482f0140695afab0dfb536ae3`. We read README, `src/prompt.ts`, `src/polish-options.ts`, `src/embedded-note.ts`, `src/polish-request.ts` and `test/prompt.test.ts`. We did not run or modify the service.

It is a Shortcuts-facing writing API, rather than a chat skill. The useful product behaviors carried into Polish are optional natural/professional/concise styles, an explicit final writing note, literal preservation of work references/error text, conservative wording, and tidy grouping of dictated prose. Existing source-language and Australian-English rules remain in force; ambiguous mixed language remains conservative.

The current skill recognizes `note:`/`备注：` and ordinary explicit rewriting instructions; it is not a byte-for-byte port of DraftWise's regex parser. Natural-language behavior requires actual model evaluation. No DraftWise source was copied. Its inspected tree had no standalone license file, so public visibility is not treated as a redistribution grant.

Quality tiers, API-token checks, HTTP caching, rate limiting and EC2 deployment are service concerns. They were not transferred to the skill. In particular, “high quality” does not let a skill switch the model or silently incur API costs. The host controls those capabilities. This avoids keeping a second writing service alive merely to edit text, while leaving future explicit Shortcuts integration possible.

## Assessment

Keep this repository as a small set of personal-friendly, portable workflows. Reuse established storage/export interfaces and focused references where possible. Evidence-grounded defaults and regression cases are a better next investment than automatically importing large numbers of third-party skills with conflicting triggers or process rules.
