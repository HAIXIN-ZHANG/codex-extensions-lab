---
name: skilldock-ux-brief
description: Translate product discovery into a UX/UI brief, user journeys, feature boundaries, states and acceptance scenarios ready for design or technical handoff. Use to define a product experience before visual design or engineering; not to validate market demand or implement an app.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# Product design brief

Define how the proposed product helps people complete their tasks. Produce an actionable experience specification, and prepare a handoff to visual design or engineering. A brief is not a rendered, tested or approved UI.

## Personal defaults and task overrides

Read the optional private `extension-profiles/product-workflow.md` under `CODEX_HOME` (or `~/.codex` when unset), if available. It supplies preferences, not permission to perform additional work. Apply the current request, applicable project requirements/design system and then confirmed personal preferences; use generic workflow guidance for gaps. Flag material project conflicts rather than silently replacing a design system. Do not treat an installed design plugin's visual defaults as the user's own taste. Proposed and unset values are not confirmed preferences.

Briefly state the relevant defaults in use and invite updates during the compact intake: visual references/style, interaction/accessibility priorities and platform/component constraints as applicable. Reuse answers already established in this task. If asked to use defaults, proceed without another approval gate. With no optional updates, retain known defaults and surface unknowns; ask only when a consequential unresolved decision prevents useful work.

Treat changes as task-specific unless the user explicitly asks to change future defaults. Update only the relevant private profile entries if authorized, preserving other content; do not write global memory or publish private preference data. If unavailable, use supplied context and explain the limitation without claiming personalization. Distinguish workflow fallback recommendations from personal choices.

## Inputs and scope

Read the provided discovery report and existing product/design constraints when available. An upstream report is useful but not required. Resolve the user, primary task, MVP boundary and platform from available context; ask up to three important missing questions together or proceed with stated assumptions when the user permits. Do not silently turn an unvalidated business hypothesis into an approved product requirement.

Separate this request's overrides from durable defaults. Identify any existing design system, accessibility requirements and implementation constraints, without selecting a new stack by default.

## Shape the experience

- Describe the primary journey from entry through successful outcome, including the user's current alternative. Address the most important failure/recovery paths and where onboarding or help is genuinely needed.
- Organize capabilities around user outcomes rather than a long list of screens. Prioritize essential, later and excluded behavior; explain tradeoffs when changing discovery scope.
- Specify information architecture, navigation and necessary screens or surfaces. Describe meaningful UI states: loading, empty, success, validation/error, permissions, unavailable dependencies and unsaved/conflicting changes where relevant. Do not add states irrelevant to the flow.
- Define labels, content hierarchy, forms, feedback, keyboard/accessibility behavior and responsive priorities sufficiently for a designer or engineer to act. Keep implementation details out of user-facing copy unless they affect a user decision.
- Use concrete acceptance scenarios, such as a new user completing the primary task, recovering from an invalid input, or resuming interrupted work. Do not claim usability without an actual test.
- Propose lightweight usability checks tied to risky assumptions. Interviews, test recruitment and publication are proposed activities unless explicitly authorized.

## Visual design and deliverables

Respond in the user's language. Default to a concise brief with the user outcome, flows, screen/state requirements, MVP boundary, acceptance scenarios and open decisions. Save a durable Markdown brief only when requested or part of the assignment; use the source report's revision and preserve uncertainty.

Record the applied design preferences, any task-specific overrides and unresolved visual choices briefly in the brief; include only what the recipient needs. A component library preference is a constraint for discussion, not proof that a particular visual solution is usable.

For actual UI/UX exploration, visual concepts, prototypes or rendered-flow audits, an available Product Design plugin can complement this brief. Use its relevant current workflow when the user requests that work; do not assume it is installed or make it a dependency of this skill. Existing supplied designs and design systems take precedence. Do not generate production code or publish a prototype merely because the brief is ready.

For technical design, pass the current brief/design references, key flows, data and permission needs, functional acceptance scenarios, quality requirements, in/out boundary and unresolved decisions. Distinguish proposed, user-confirmed and actually tested behavior. Identify decisions that need to return to discovery. Handoff does not itself authorize the next stage.
