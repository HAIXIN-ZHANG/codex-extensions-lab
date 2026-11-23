---
name: skilldock-product-discovery
description: Investigate a product opportunity, existing-product improvement or internal tool by examining user problems, alternatives, evidence and relevant business outcomes before UX or technical design. Use for product discovery, user desk research or market validation when relevant.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# Product spike

Help decide whether a product opportunity or improvement deserves investment, which users and problems to target, and what to validate next. This covers new products, existing-product improvements and internal tools; implementation feasibility spikes belong to technical design.

## Personal defaults and task overrides

Read the optional private `extension-profiles/product-workflow.md` under `CODEX_HOME` (or `~/.codex` when unset), if available. It is preference context, not additional execution authority. Apply the current request, applicable project requirements and then confirmed personal preferences; use generic workflow guidance for remaining gaps. Flag material conflicts with an existing project instead of silently changing its constraints. Do not infer preferences from residence, previous experience, an installed plugin or a framework chosen for another project. Proposed and unset values are not confirmed defaults.

At the beginning, briefly state the relevant defaults actually being used and invite changes in the same compact intake. Reuse context already confirmed in this task; do not repeat intake between stages. An explicit request to proceed with defaults needs no further confirmation. If the user supplies no preference updates, use known defaults and keep unknowns visible; missing optional answers do not authorize external actions or resolve essential conflicts.

Changes apply to this task unless the user explicitly asks to update future defaults. Then update only the relevant entries in the private profile, preserving other content; do not use global memory or publish personal preferences as part of this workflow. If the profile cannot be read or updated, state that limitation and continue the authorized work. Initial scope includes decision, audience/market, research depth and desired report; do not assume an Australian target market or a commercial-only objective simply from personal context.

## Frame the decision

Use supplied context first. Resolve the decision, target user versus buyer, problem, geography, current stage and practical constraints. Ask at most three consequential questions together when needed; do not require a complete questionnaire. If the user asks to proceed without answers, state assumptions and perform a bounded desk-research pass. Missing context is not permission for spending, outreach or experiments.

Honor current scope over historical preferences. Treat changes as task-specific unless the user asks to persist them. Work at the requested depth; a quick idea review need not become a full market report.

## Investigate the opportunity

Choose evidence and outcomes for the actual decision. For an existing product or internal tool, start with the current workflow, affected roles, adoption, task friction, support burden and relevant operational outcomes. Use supplied customer research, usage data and project constraints when available, checking their scope and limitations. Compare improving the current process with new capabilities. Include pricing, market sizing and acquisition only when they matter; do not force a commercial launch analysis onto a bounded workflow improvement. Label unavailable internal evidence as missing rather than replacing it with invented metrics or public competitor claims.

- Describe the user's job, trigger, current workaround, frequency and cost of the problem. Keep evidence of the problem separate from enthusiasm for a proposed solution.
- Identify affected users, decision-makers and existing alternatives (including manual work and doing nothing). For market-facing decisions, examine buyers, competitors, differentiation and realistic acquisition paths. Competitor feature counts do not establish demand.
- Search current, decision-relevant sources when authorized. Prefer original product/pricing documentation, official statistics, first-hand user accounts and credible research. Treat vendor claims and complaints as evidence with incentives and sampling limits, not representative market facts. If browsing is unavailable, label the analysis as a hypothesis review, not current market validation.
- For material claims record the source link, publication or observation date, population/geography and limitation. Inspect source contents before citing; do not cite a search snippet as verified evidence. Avoid unnecessary private details in search queries or reports.
- Explore relevant resource costs and delivery/support burden; include willingness to pay, buyer budgets, pricing and distribution costs when the decision needs them. Separate observed prices from assumed revenue. Make calculation inputs and ranges inspectable; do not invent TAM, conversion, demand, margins or causal effects.
- Look for disconfirming evidence and explain unresolved conflicts. Public desk research cannot establish actual willingness to pay, retention or product-market fit without suitable behavioral evidence.

## Decompose and validate

Prioritize the few uncertainties that could change the decision. For each important hypothesis, specify evidence available, evidence missing, a small validation method, a proposed success/failure criterion, and the decision it informs. Label untested thresholds as proposed rather than agreed targets.

When designing discovery research or experiments, use [the compact validation guide](references/validation-methods.md) for risk dimensions, evidence mapping and past-behavior interviewing. It is optional guidance, not a mandatory framework or a new permission gate.

Distinguish research completed from proposed interviews, landing pages, paid tests or prototypes. Drafting a test does not authorize contacting people, publishing, paying for data, collecting personal data or building the product. Execute only the work actually assigned and permitted.

Propose a coherent MVP around an end-to-end user outcome: essential, later and excluded capabilities, with reasons, dependencies and acceptance examples. Include manual or service-based alternatives when they could test demand more cheaply. Do not prematurely decide UI layouts, frameworks or infrastructure.

## Deliver and hand off

Respond in the user's language. Default to a concise in-chat report; save a Markdown report when requested or when a durable deliverable is part of the assignment, using an agreed/appropriate workspace path. Do not place private business research in a public repository by default.

A substantial report should cover the decision and recommendation; user/problem evidence; relevant alternatives and business or operational assumptions; proposed scope boundary; validation results versus next experiments; source links and remaining uncertainty. Scale this to the task rather than filling mandatory headings.

Include a short applicable-preferences/overrides note and carry it into the handoff, especially constraints affecting UX or feasibility. Do not copy the whole private profile into reports.

Recommend proceed, narrow, validate further or stop, with reasons and evidence that would change the recommendation. Do not equate a polished report with validated demand.

For product design, hand off the chosen/proposed segment and problem, value proposition, main use cases, MVP in/out, success criteria, constraints, and evidence/assumption status. Name unresolved decisions and the report revision used. A handoff does not approve the next stage; continue across stages only when the user assigned that scope.
