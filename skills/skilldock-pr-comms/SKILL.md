---
name: skilldock-pr-comms
description: Draft or rewrite pull request summaries and Slack messages requesting PR review, grounded in the actual change and the user's writing examples. Use for PR communication, not for performing code review or general prose polishing.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# PR communication

Write concise, paste-ready PR descriptions and Slack review requests that help a reviewer understand the problem, the resulting behavior and the ask. Produce only the requested deliverable; when both are requested, keep them separate.

## Establish the shape and facts

- Follow the current request and applicable repository PR template or contribution rules. For optional writing choices, prefer a user-selected example, then recent user-authored examples from the same context. An assistant's earlier draft, especially one the user rejected, is not evidence of the user's preferred format.
- Use supplied material first. For an implementation summary, inspect the actual branch diff against its intended base and available validation results; for a prose-only rewrite, stay within the supplied facts. When a PR link is supplied, read its current title/body and relevant changes through available authorized tools. Distinguish a PR's reported checks from checks independently verified in this task.
- If style examples are needed, inspect a few relevant recent examples through existing authorized sources. Do not search unrelated conversations or copy private originals into reusable/public artifacts. If unavailable, use the lightweight fallback below without claiming it is the user's established style. Ask only for facts needed to avoid a material error.
- Keep the language of the supplied draft or requested team context. A Chinese instruction does not require translating an English PR or Slack draft into Chinese. Preserve ticket IDs, links and technical terms exactly.

## Plain wording and visible links

Use simple, direct workplace language. Preserve the user's wording when it already explains the change clearly; do not rewrite it just to sound more polished. Prefer concrete verbs such as "reduce spacing" or "show errors" over vague claims about improving the experience. Keep the requested facts, uncertainty and tone.

For Slack or Teams review requests, default to a descriptive PR title followed by its complete, visible URL, on the same line or the next. Use the verified PR title when available; a generic label such as "PR #42", a bare URL, or a title-only hyperlink does not supply both. This keeps the destination understandable when previews or hyperlink formatting are unavailable. Follow an explicit user-selected format instead when provided. Do not invent a title; if unavailable, use an accurate description supported by the supplied change.

## PR summary

Lead with the concrete problem and resulting behavior. Describe the final scope for a reviewer who has not read the chat. A small fix often needs one short paragraph and a few change bullets; use the repository's headings when required. Do not turn every PR into a long engineering report.

When no format is specified, a useful starting point is **Ticket**, **Background**, **What changed**, and, only when relevant, **Screenshots**. Omit empty or redundant sections. These are fallback headings, not an assertion that the user always uses them. See [synthetic examples](references/examples.md) when a starting draft helps.

- Explain behavior and purpose together. Include implementation details only when they help reviewers assess the change or a real tradeoff.
- Link relevant work items and the most useful supporting evidence when available, such as a precise spec section, design node, code or diff location, CI run, or reproduction. Use a short verified test result or observation if it provides the context directly. Omit unavailable references and evidence. Preserve confirmed decisions when an older design reference disagrees.
- Keep validation concise and exact: what ran, the result, and material gaps. Include required local-review results and waivers when the repository requires them. Attribute reported evidence and avoid claiming checks passed, issues are unrelated, or the branch is rebased without evidence.
- Remove chat chronology, abandoned approaches, self-praise, tool narration and repeated boilerplate. Rewrite the title/body around the final diff when scope changes. Do not say review is complete merely because a summary was written.

### Screenshots, when requested or available

Use genuine UI evidence with enough surrounding page to establish context: the relevant page header/navigation and the full affected dialog or region, with useful margins. Avoid tiny component-only crops, large empty canvases and full-desktop captures that expose unrelated material. Protect private account/customer data without losing the behavior being demonstrated.

Use one clearly labelled **Before** and one **After** image for each state that needs comparison. Prefer matching data, state, viewport, zoom and framing. If they differ, label the source and material differences, such as an issue attachment versus a local test fixture. Never imply a controlled comparison when it is not one. Screenshots show appearance; they do not establish functional validation. Follow any repository-specific evidence/upload workflow when actually capturing or uploading is in scope.

## Slack review request

Use a natural greeting, a direct review ask, a short explanation of the change and the PR title plus visible URL when available. One or two sentences usually suffice for a small patch; a broader change can use two or three behavior-level bullets. Mention details/screenshots in the PR only when they are present. Use a friendly close such as "Thanks!" when it fits the examples.

- Mention reviewers or groups only when supplied or verified as appropriate for this PR. Do not invent Slack IDs, CCs, urgency, deadlines or reviewer availability. Render mentions/link syntax for the actual delivery surface.
- Add a review focus when it matters, such as error handling or a compatibility change. An available link to the relevant diff, spec or failing check can help reviewers get straight to that point. Keep the message short.
- Preserve draft/open/ready status and material blockers accurately. A draft PR can invite early feedback, but do not present it as ready to merge. Do not ask for production approval when the task is PR review.

## Output and scope

Return the requested text ready to paste, without a preamble, a writing explanation or multiple variants unless requested. Put a material missing-fact note outside the draft instead of embedding fabricated placeholders in publishable prose.

Drafting does not authorize sending Slack messages, updating GitHub, uploading files, pushing code or rebasing. If the user already explicitly authorized a relevant write, carry it out through the applicable workflow without asking again; inspect the current destination and preserve unrelated content. This skill supplies writing guidance, not a code-review or shipping procedure.
