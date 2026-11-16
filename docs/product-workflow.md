# Product discovery, experience design and technical design

Three independently usable skills support the path from an idea to an implementation-ready proposal. They do not automatically advance or approve one another.

## Personal workflow defaults

All three skills can read the same optional private profile: `extension-profiles/product-workflow.md` under `CODEX_HOME`, falling back to `~/.codex`. See [the profile template](examples/product-workflow-profile.md). Public skills contain reusable process rules; private profiles contain confirmed personal preferences and their scope.

Apply current task instructions, applicable project requirements/design systems, confirmed personal preferences, then generic fallbacks. A material conflict with an existing project requires discussion, not an automatic migration. Experience with a technology and an installed tool's defaults do not prove preference. Distinguish confirmed, proposed and unset choices. Missing preferences are not mandatory questions or permission grants.

At task start, state the few relevant defaults actually used and invite updates once; ask at most three consequential questions together. Reuse prior answers during handoff. If the user requests execution with defaults and provides no optional updates, proceed with the known defaults rather than blocking. Explicit conflicts and missing authorization still require resolution. Temporary overrides stay in the current task; update the private profile only on an explicit request to change future defaults.

The default handoff is a lightweight report, experience brief and technical spec as appropriate, not a compulsory document suite. Each should preserve the relevant baseline, overrides, evidence/assumption status and open decisions. No fixed design aesthetic, frontend framework, database or cloud provider is bundled as a universal user preference.

| Stage | Main decision | Skill / complementary capability | Typical deliverable |
| --- | --- | --- | --- |
| Product discovery | Who needs this, why, and is it worth validating/building? | `skilldock-product-discovery` | Evidence-backed opportunity and validation report |
| Product experience | How should users complete the task? | `skilldock-ux-brief`; optional Product Design plugin for visual work | UX/UI brief, flows, states, acceptance scenarios, optional design references |
| Engineering | How should it work and how can it be delivered reliably? | `skilldock-tech-design` | Tech spec, contracts, feasibility findings, delivery slices |

## Scope and handoff

Discovery focuses on users, problems, alternatives, market and commercial assumptions. Online research is not proof of customer demand. Distinguish proposed tests from tests actually run.

Experience design turns the chosen or proposed opportunity into an interaction model. Existing visual design tools complement this workflow; a written brief alone is not a tested UI.

Technical design covers architecture and implementation feasibility. A commercial product spike and a technical spike answer different questions. Product ambiguities return to the earlier stage rather than becoming accidental engineering decisions.

Pass the latest relevant artifact and revision, scope, evidence/assumption status, acceptance criteria and open decisions between stages. A user can assign one stage or the complete sequence. Preserve explicitly authorized cross-stage work; otherwise do not infer permission to build, publish, contact users or incur costs from a handoff.

## Example invocations

- `Use $skilldock-product-discovery to investigate this idea's target users, existing alternatives and commercial assumptions. Start with desk research.`
- `Use $skilldock-ux-brief with this discovery report to define the main flows, MVP boundary and UI states.`
- `Use $skilldock-tech-design with this brief and our existing codebase to propose architecture, contracts and an implementation plan. Do not code yet.`

Missing earlier-stage documents do not block a self-contained request. Questions should be limited to consequential gaps; assumptions must remain visible. Reports use the user's language and appropriate depth. Personal or confidential research belongs in an appropriate private workspace, not automatically in this public repository.
