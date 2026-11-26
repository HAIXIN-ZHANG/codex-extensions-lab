---
name: skilldock-pr-comms
description: Draft or rewrite pull request summaries and Slack messages requesting PR review, grounded in the actual change and the user's writing examples. Use for PR communication, not for performing code review or general prose polishing.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# PR communication

Read the optional private `extension-profiles/writing.md` under `CODEX_HOME` (default `~/.codex`) for persistent output preferences. Apply the current request first, then repository requirements and the private profile. Preserve unknown facts as unknown.

Write concise, paste-ready PR descriptions and Slack review requests that help a reviewer understand the problem, the resulting behavior and the ask. Produce only the requested deliverable; when both are requested, keep them separate.

## Establish the shape and facts

- Follow the current request and applicable repository PR template or contribution rules. For optional writing choices, prefer a user-selected example, then recent user-authored examples from the same context. An assistant's earlier draft, especially one the user rejected, is not evidence of the user's preferred format.
- Use supplied material first. For an implementation summary, inspect the actual branch diff against its intended base and available validation results; for a prose-only rewrite, stay within the supplied facts. When a PR link is supplied, read its current title/body and relevant changes through available authorized tools. Distinguish a PR's reported checks from checks independently verified in this task.
- If style examples are needed, inspect a few relevant recent examples through existing authorized sources. Do not search unrelated conversations or copy private originals into reusable/public artifacts. If unavailable, use the lightweight fallback below without claiming it is the user's established style. Ask only for facts needed to avoid a material error.
- Keep the language of the supplied draft or requested team context. A Chinese instruction does not require translating an English PR or Slack draft into Chinese. Preserve ticket IDs, links and technical terms exactly.

## Plain wording and visible links

Use simple, direct workplace language. Preserve the user's wording when it already explains the change clearly; do not rewrite it just to sound more polished. Prefer concrete verbs such as "reduce spacing" or "show errors" over vague claims about improving the experience. Keep the requested facts, uncertainty and tone.

Use a resource reference line with a category, descriptive title and copyable original URL, for example `PR: APP-123 Fix upload errors (https://github.com/example/app/pull/42)`. Prefer plain text. For a descriptive hyperlink, also show the same original URL in parentheses beside it unless the selected format says otherwise. Use this for PRs, tasks, documentation, code, CI and other references. Preserve exact destinations and use only supplied or verified titles. A current explicit format request takes precedence over older examples and the default reference format. Preserve URL-as-label links such as `PR: [https://github.com/example/app/pull/42](https://github.com/example/app/pull/42)` when selected by the user or private profile; the visible URL must match the destination. Keep actual code snippets and screenshot embeds intact.

When this repository is available and command access is permitted, check a saved draft with `node scripts/message-links.ts check-links message.md`. The checker fails malformed reference lines and hidden hyperlink destinations. It checks supplied files, while the host controls chat output.

## PR summary

Lead with the concrete problem and resulting behavior. Describe the final scope for a reviewer who has not read the chat. A small fix often needs one short paragraph and a few change bullets; use the repository's headings when required. Do not turn every PR into a long engineering report.

Preserve a selected PR-summary example's section names, order and level of detail, just as you would preserve a selected Slack example. Keep PR descriptions separate from review messages: do not carry the greeting, review ask or final "PR:" line into the PR body.

For a concise summary with no different format specified, start with **Ticket**, **Background**, **What changed**, and **Screenshots** only when actual images are included. Keep Background to a short explanation of the problem and What changed to the few changes reviewers need. A short validation/review paragraph can follow the change bullets instead of adding a separate heading for every check, risk or next step. Retain a dedicated Validation section or other material when required by the repository or selected example. Omit empty sections, repeated context and long process reports. These are fallback choices, not a claim that every user or PR uses the same template. See [synthetic examples](references/examples.md). When the private profile selects the compact format, use exactly `## Ticket`, `## Background`, `## What changed`, then optional `## Screenshots`. Put validation and review evidence in one short paragraph after the change bullets. Supporting spec links and labelled examples can follow that paragraph when needed for review. Run `node scripts/message-links.ts check-pr summary.md` when the repository helper is available. A repository-required template takes precedence.

- Explain behavior and purpose together. Include implementation details only when they help reviewers assess the change or a real tradeoff.
- Link relevant work items and the most useful supporting evidence when available, such as a precise spec section, design node, code or diff location, CI run, or reproduction. Use a short verified test result or observation if it provides the context directly. Omit unavailable references and evidence. Preserve confirmed decisions when an older design reference disagrees.
- Keep validation concise and exact: what ran, the result, and material gaps. Include required local-review results and waivers when the repository requires them. Attribute reported evidence and avoid claiming checks passed, issues are unrelated, or the branch is rebased without evidence.
- Remove chat chronology, abandoned approaches, self-praise, tool narration and repeated boilerplate. Rewrite the title/body around the final diff when scope changes. Do not say review is complete merely because a summary was written.

### Endpoint and payload examples

When the user asks for body or payload examples, include concrete JSON alongside the relevant behavior. Name each relevant endpoint with its HTTP method and path. Label API request bodies, API response bodies and emitted analytics payloads explicitly. Ground examples in the current implementation, schema or fixtures and mark synthetic values as examples. Identify omitted enrichment when showing a payload fragment.

Explain what the PR implements before describing any proposed tracking. For a proposal with unresolved event names or fields, state the open decision and show only supported API examples or a clearly labelled behavioral scenario. Avoid presenting an API request body as telemetry emitted by the PR. Mention a reviewer or team only when explaining a concrete review decision.

Keep requested examples visible by default. Use short bold labels and fenced JSON below the review paragraph. Use collapsible sections only when requested or required by the repository. Keep examples sufficient to show the relevant fields and differences between stages. Use plain, concrete prose and avoid repeating the same scope or caveat in every paragraph. See the multi-stage example in [synthetic examples](references/examples.md).

### Screenshots, when requested or available

Use genuine UI evidence with enough surrounding page to establish context: the relevant page header/navigation and the full affected dialog or region, with useful margins. Avoid tiny component-only crops, large empty canvases and full-desktop captures that expose unrelated material. Protect private account/customer data without losing the behavior being demonstrated.

Use one clearly labelled **Before** and one **After** image for each state that needs comparison. Prefer matching data, state, viewport, zoom and framing. If they differ, label the source and material differences, such as an issue attachment versus a local test fixture. Never imply a controlled comparison when it is not one. Screenshots show appearance; they do not establish functional validation. Follow any repository-specific evidence/upload workflow when actually capturing or uploading is in scope.

## Slack review request

Use a natural greeting, a direct review ask, a short explanation of the change and a clearly labelled PR link when available. One or two sentences usually suffice for a small patch; a broader change can use two or three behavior-level bullets. Mention details/screenshots in the PR only when they are present. Preserve the selected example's greeting, paragraph order, closing placement and link labels. If the user places "Thanks!" immediately after the opening request, keep it there. Adapt only the recipient, topic, relevant facts and supplied links. Store explicitly requested personal templates in the private writing profile. When a user calls a Slack review example a "PR summary", use the example's review-message structure for that artifact while retaining the repository template for the GitHub PR body.

- Mention reviewers or groups only when supplied or verified as appropriate for this PR. Do not invent Slack IDs, CCs, urgency, deadlines or reviewer availability. Render mentions/link syntax for the actual delivery surface.
- Add a review focus when it matters, such as error handling or a compatibility change. An available link to the relevant diff, spec or failing check can help reviewers get straight to that point. Keep the message short.
- Preserve draft/open/ready status and material blockers accurately. A draft PR can invite early feedback, but do not present it as ready to merge. Do not ask for production approval when the task is PR review.

## Output and scope

Return the requested text ready to paste, without a preamble, a writing explanation or multiple variants unless requested. Put a material missing-fact note outside the draft instead of embedding fabricated placeholders in publishable prose.

Drafting does not authorize sending Slack messages, updating GitHub, uploading files, pushing code or rebasing. If the user already explicitly authorized a relevant write, carry it out through the applicable workflow without asking again; inspect the current destination and preserve unrelated content. This skill supplies writing guidance, not a code-review or shipping procedure.
