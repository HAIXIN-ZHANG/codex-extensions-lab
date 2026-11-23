---
name: skilldock-tech-design
description: Produce a technical design or tech spec from product requirements and UX flows, including architecture, contracts, data, risks, validation and delivery slices. Use for engineering design or a bounded technical feasibility spike before implementation.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# Technical design

Translate product behavior into a proportionate, reviewable engineering design. Also support a focused feasibility spike when a technical unknown blocks the decision. Design alone does not authorize implementation.

## Personal defaults and task overrides

Read the optional private `extension-profiles/product-workflow.md` under `CODEX_HOME` (or `~/.codex` when unset), if available. Apply the current request, applicable project requirements and then confirmed personal preferences; generic workflow guidance fills gaps. Preferences do not grant execution permissions. If a preferred stack conflicts with the actual project, explain the conflict and discuss the relevant decision rather than silently migrating it. Framework experience or a stack selected for the extensions repository is not a universal new-project default. Proposed and unset choices are not confirmed defaults.

Briefly state the relevant baseline and invite updates within the normal intake: existing versus greenfield project, stack preferences and important infrastructure/quality constraints. Reuse context already established in the task. A request to use defaults does not require repeated confirmation. If optional answers are omitted, use confirmed defaults where applicable, label proposed choices, and proceed unless an essential conflict requires an answer.

Keep task-specific choices local to this assignment. Only when the user explicitly requests a future-default change, update the relevant private profile entries while preserving other content; do not update global memory or publish personal configuration. If the file cannot be accessed, explain that and use available context. Personal familiarity may inform tradeoffs but does not establish platform suitability.

## Establish the baseline

Read supplied requirements, experience brief and design references. When an existing codebase is in scope, inspect its actual stack, conventions, relevant implementation and working state without overwriting changes. Distinguish documented behavior from observed implementation. Do not require discovery or design documents for a self-contained technical question.

Resolve functional scope, expected usage, relevant quality constraints and existing infrastructure. Ask up to three consequential questions together if needed. Otherwise state assumptions and proceed. Keep current task overrides separate from enduring requirements; do not impose the skill repository's stack on the target product.

## Design the smallest suitable system

- Compare viable approaches and recommend one using the actual constraints. Include extending existing components or using a simpler/manual solution where appropriate; avoid default microservices or distributed systems.
- Explain component responsibilities, ownership boundaries and the primary data/control flows. Use a small diagram only if it improves understanding.
- Specify data ownership/schema, API or tool contracts and important error/retry behavior. Address authentication, authorization, sensitive data handling and external dependencies where the product needs them.
- For stateful systems, cover the applicable integrity, idempotency, concurrency, migration, recovery and backup concerns. For connected products, explain offline behavior and sync/conflict semantics when relevant. A list of technology names is not an architecture.
- Address relevant accessibility, performance, reliability, observability and maintainability requirements. Separate measured numbers, agreed targets and proposed targets. Verify volatile API, compatibility and pricing claims using current primary documentation when authorized; otherwise mark them unverified. Make cost assumptions explicit.
- Link technical decisions to product acceptance scenarios and maintain traceability to source revisions. Return product ambiguities to the product/design stage rather than inventing user-facing behavior in the implementation plan.

When AI behavior is material to the design, use [the AI systems guide](references/ai-systems.md) for relevant evaluation, tool permissions, failure handling and human-review decisions. Ordinary software designs do not need AI infrastructure or an AI checklist.

## Technical spikes

Bound each spike by a decision, uncertainty, method and stopping condition. Explain what evidence would confirm or reject the approach. Distinguish documentation checks, local experiments and untested assumptions.

Run a proof of concept only if the user has assigned implementation/experimentation and the needed permissions exist; otherwise propose it. Isolate permitted experiments from production and preserve other changes. Report environment, commands/results and limitations; a local demo does not establish production readiness. Do not deploy, incur charges or change external access through a design assignment.

## Deliver and hand off

Respond in the user's language. A substantial tech spec should cover requirements and exclusions, actual baseline, alternatives and decision, architecture/contracts/data, relevant quality and security concerns, risks/unknowns, validation, and staged delivery. Scale the document to the problem; a small change may only need a brief decision record. Save a Markdown spec when requested or included in the assignment, without exposing private system details in public output.

Include the applied baseline/overrides and explain material deviations from confirmed preferences. Carry only relevant preference decisions to implementation, not the entire private profile.

Split delivery into coherent, testable user outcomes with dependencies and acceptance checks; identify necessary migrations, rollout and rollback steps. Mark decisions as proposed, confirmed or experimentally verified. State what remains to be reviewed and what is ready for implementation, without self-approving a plan. Continue to coding only when it is within the user's assigned scope.
