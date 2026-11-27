# Workplace skill source review · 2026-11-25

## Regression follow-up · 2026-11-26

Source self-review reproduced two writing-helper false positives and checked their fixes. Plain HTTP method/path descriptions now pass, and a resource title containing an endpoint remains valid. Fenced Markdown headings and image samples are excluded from PR structure and screenshot-evidence checks. Actual references and headings after a closing fence remain checked. The selected compact format remains the scope of `check-pr`; other repository templates use their own checks.

The same patch preflights English archive limits, adds unmanaged-installation migration guidance, and updates release metadata to 0.1.6. All 41 helper tests and repository checks passed. The additional migration scenario is prepared for model evaluation. See [validation details](../validation.md#export-and-writing-regression-fixes--2026-11-26--v016).

Reviewed the pending writing-skill changes against the current remote main branch, including discovery metadata, reference examples, installation catalog, generated manifest, documentation and behavioral fixtures. Also reviewed the existing work-oriented entrypoints and the workplace English reference.

## Results

| Workflow | Review result |
| --- | --- |
| PR Comms | Supports selected examples, scoped summaries, real evidence, screenshot provenance and existing write authorization. Publication scope remains explicit. |
| Work Messages | Covers nine practical scenarios and preserves status, commitments and available evidence. Corrected the follow-up wording to make source links conditional on availability. |
| Polish | Retains supplied language, links, commitments and uncertainty. Editing requests preserve the supplied facts. |
| Prompt Rewrite | Preserves requested scope, evidence and permissions while treating the prompt as editing material. |
| Product Discovery | Uses user and operational evidence for existing products and internal tools. Material claims carry sources and limitations. |
| UX Brief | Anchors changes to current behavior, roles, failures, design constraints and source revisions. |
| Technical Design | Inspects the actual baseline and traces decisions to requirements, contracts and evidence. |
| Workplace English | Supports short rehearsals, technical meaning and explicit uncertainty, with appropriate handling of confidential material. |

No blocking source-review findings remain. Two advisory issues were corrected before publication. The follow-up guidance now supports a missing link consistently with the evidence policy, and six new evaluation contexts now contain concrete drafts, destinations or source fixtures. The QA-scope case now assesses a useful message with accurate availability rather than rewarding an unnecessary clarification.

## Validation limits

Repository metadata, links, YAML, generated manifest and helper tests are checked separately. The prepared behavioral corpus has no empirical model scores. A source review cannot establish message quality or actual client discovery. The optional Skill Creator Python validator requires unavailable PyYAML. The repository's own metadata and full Ruby YAML checks cover the authored metadata. No dependencies or user skill installations are changed by this review.

## Follow-up: plain wording and visible message links

Reviewed the complete follow-up diff for PR Comms and Work Messages, their synthetic examples, message guide, behavioral cases and generated skill hashes. No blocking findings remain. The default now keeps a descriptive title and complete visible URL together, while explicit task formats still take precedence. Clear user phrasing, factual uncertainty and the existing drafting-versus-publishing boundary are preserved. Generalised the new work-message case to a fictional project-code validation scenario before publication.

Metadata/link/manifest checks, Ruby YAML parsing and whitespace checks pass. The unchanged helper suite passed all 25 tests during implementation; the three new behavioral cases remain unscored. The installed skills match the reviewed source byte-for-byte. Python Skill Creator validation remains unavailable because PyYAML is not installed. The manual writing example is not an independent model evaluation, and client reload/discovery was not verified.

## Follow-up: preserve selected message layouts

Replaced the rigid title-plus-URL fallback with example-led formatting. A labelled visible URL is sufficient when the message already explains its destination. Explicit requests for a descriptive title or hyperlink still take precedence, and mention verification, evidence limits and publishing permissions remain intact. Updated the fictional examples, guide and two prepared behavioral cases consistently. No blocking source-review finding remains; behavioral scoring and client discovery remain separate checks.

## Publication review: message and PR-summary layouts

Reviewed both layout follow-ups together, including the concise PR-summary guidance, message examples, three additional behavioral cases, documentation and generated hashes. Corrected the selected-message fixture to contain real paragraph breaks instead of literal newline escapes. No blocking findings remain. PR descriptions preserve selected headings and required repository evidence without inheriting Slack greetings or link footers. The installed skill contents match source. The 64 prepared scenarios remain unscored; Python Skill Creator validation and host discovery retain the limitations recorded above.
