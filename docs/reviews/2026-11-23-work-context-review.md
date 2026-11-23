# Work-context skill review · 2026-11-23

Scope: source review of all eight skill entrypoints and UI metadata, the English curriculum/resources/tools references, the discovery validation guide, and shared workflow/setup/architecture documentation. This is an instruction review, not a scored model evaluation, live opportunity search, helper implementation audit or verification of installed copies. Public recommendations below use generic examples only.

## Implemented: Job Search

[Job Search](../../skills/skilldock-job-search/SKILL.md) already separates requested directions, geography and engagement type. It previously left career-direction interpretation unspecified. The new conditional guidance distinguishes Full Stack from substantive AI systems work, covers AI-focused FDE delivery, separates direction fit from candidate experience, and avoids imposing frontend or model-training requirements on every AI role. It does not establish universal market definitions or impose these directions on every user. Two synthetic evaluation cases cover these distinctions; they have not been run as model tests.

## Original review and proposed follow-up

| Skill | Observed source behavior | Recommendation |
| --- | --- | --- |
| [English](../../plugins/skilldock-english/skills/skilldock-english/SKILL.md) | Description and path selection emphasize everyday/life scenarios. Role-play, grammar feedback and short questions already work at the instruction level. UI metadata also advertises life English. | Highest priority: expose workplace learning explicitly in the description, scenario path and UI metadata. Support stand-ups, clarification, technical tradeoffs, reviews, demos, stakeholder updates and respectful disagreement. Use one realistic conversational turn at a time when practising. Keep direct message editing in Polish; when teaching is requested, explain register, uncertainty and alternatives. A short pre-meeting rehearsal should not trigger a full 20–30 minute lesson. |
| [Job Search](../../skills/skilldock-job-search/SKILL.md) | Multiple directions were supported without criteria for AI depth. | Implemented above. Next validation should use controlled listings to check classification and ranking; no need for a paid adapter or live search for this review. |
| [Polish](../../skills/skilldock-polish/SKILL.md) | Already preserves commitments, uncertainty, technical literals and channel; explicitly covers Slack, Jira and PR references. | Keep the main rules. Add workplace regression examples for tentative dates, review feedback, disagreement and blockers. Drafting from scratch and language tutoring remain separate requests. |
| [Prompt Rewrite](../../skills/skilldock-prompt-rewrite/SKILL.md) | Already preserves task boundaries, quotations, constraints and language while avoiding execution. | Keep the main rules. Add a work example where an investigation prompt must preserve read-only scope, supplied evidence and unresolved decisions; avoid bundling an engineering process into every rewrite. |
| [Product Discovery](../../skills/skilldock-product-discovery/SKILL.md) | Opening calls the skill commercial discovery and its default substantial report emphasizes market/commercial assumptions. Another paragraph correctly says not to assume a commercial-only objective. | Reconcile the framing for existing-product improvements and internal tools. Evaluate task friction, adoption, support burden or operational outcomes when relevant; only assess pricing, TAM or acquisition when the actual decision needs them. Existing customer evidence and company constraints may matter more than public competitors. |
| [UX Brief](../../skills/skilldock-ux-brief/SKILL.md) | Already respects existing design systems and covers permissions, errors, recovery and self-contained small requests. | Mostly ready for work use. Add an existing-feature example covering roles, partial failure and interrupted work; carry actual product constraints rather than redesigning the whole app. For AI experiences, specify user-visible uncertainty, review and recovery only when relevant. |
| [Technical Design](../../skills/skilldock-tech-design/SKILL.md) | Already inspects existing code, preserves project constraints and covers contracts, integrity, rollout and validation. | Mostly ready for work use. Consider a conditional AI-system design reference for evaluation evidence, tool permissions, sensitive data, model/provider failure and human review. Avoid imposing AI infrastructure on ordinary systems. Company templates and project rules should continue to own organization-specific requirements. |
| [Property Search](../../skills/skilldock-property-search/SKILL.md) | Purpose is explicitly residential search; already separates evidence, risks, defaults and per-run overrides. | Keep as a personal workflow. Working on a work computer is not a reason to convert it to commercial property or mix it with workplace defaults. |

These are recommendations, except the explicitly implemented Job Search change. They do not claim that every missing example is a demonstrated behavioral failure.

## Workplace English acceptance examples (now represented in the corpus)

Before changing English, prepare scenarios that distinguish these outcomes:

- “I have a design review in ten minutes; practise explaining a tradeoff.” Start a short rehearsal from supplied context, rather than demanding a lesson plan or generating a long grammar chapter.
- “Polish this Slack update; just give me the message.” Use editing behavior without a quiz or teaching commentary.
- “Explain why this sounds too certain and help me practise a softer version.” Teach the meaning/register difference and let the learner attempt a reply without altering technical facts.
- “Use this internal incident in an English lesson.” Use only the necessary supplied context, anonymize reusable examples, and keep confidential text out of public learning records. Existing public-plan selection and authorization do not establish permission to publish company information.

Useful grammar can use workplace situations (tense for status updates, modals for uncertainty, conditionals for tradeoffs) while keeping the existing grammar spine. Do not infer proficiency from job title or a single answer. Public curated lessons, private helper archives and one-off practice should remain separate; no new storage schema or cloud service is needed for these instruction improvements.

## Sequencing and limits

Recommended next work: workplace English routing and examples, then Discovery framing, then focused work-context evaluation cases for the already suitable skills. Review current client behavior before adding orchestration or more dependencies. Keep organization-specific conventions in the target project's guidance and private work materials in an appropriate private workspace. Source changes and installation remain separate actions.

## Implementation follow-up · 2026-11-23

The subsequent assignment authorized the proposed source updates. English now exposes life and workplace learning in its entrypoint, UI metadata and plugin description, routes workplace practice through a focused reference, supports short rehearsals without mandatory plan lookup, and protects confidential material from public records and searches. Discovery now explicitly supports existing-product improvements and internal tools, with user and operational evidence instead of mandatory market analysis. UX Brief adds conditional AI review and recovery behavior. Technical Design links a conditional AI-systems guide covering evaluations, permissions, sensitive data and execution failures. Job Search additionally requires concrete AI-responsibility evidence and honest reporting of sparse coverage.

Polish and Prompt Rewrite retain their suitable core rules and gain workplace regression examples. Property Search remains unchanged in scope. Ten additional synthetic cases cover the new behavior and the retained editing boundaries. The original table records the review that led to these changes; its future-tense wording is historical, not the current implementation status. Empirical model evaluation remains future work. Installation and checks are reported in the current validation entry.
