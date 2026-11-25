# Workplace skill source review · 2026-11-25

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
