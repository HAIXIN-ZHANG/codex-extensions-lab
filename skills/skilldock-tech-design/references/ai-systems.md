# Designing AI capabilities

Read when model behavior or agent actions materially affect the requested design. Apply only relevant points and use current provider documentation for changeable contracts. This is design guidance, not approval to call APIs, upload internal data or run paid evaluations.

- Define the user outcome, acceptable failures and when a deterministic or manual approach would suffice. Explain the model's responsibility and what the surrounding software must enforce.
- Propose representative evaluation tasks and observable success criteria, including difficult and negative cases. Separate measured baseline results from proposed thresholds; a demo or a model's own confidence is not evidence of quality.
- Specify input, retrieval and output boundaries, data access, retention and provider exposure. Treat retrieved documents and model output as untrusted content. Do not put secrets or confidential examples in public fixtures.
- For tools and agents, define allowed actions, user/tenant authorization, validation and approval requirements for consequential actions. Keep permission enforcement outside model prose; account for duplicate execution, retries and auditability.
- Design for provider errors, timeouts, rate limits, invalid output and unsupported answers. Define recovery, fallback or handoff to a person according to the task. Streaming or a timeout should not conceal an unknown outcome from a state-changing tool.
- Identify evaluation/monitoring signals, safe logging, latency and cost assumptions, and model/prompt versioning. Keep customer content out of logs unless permitted. Plan regression checks and rollback when behavior changes.
- Tie human review to a concrete action and the information needed to approve it. Distinguish a draft, recommendation and executed operation in both contracts and user-facing states.

Do not prescribe RAG, a vector database, fine-tuning or an agent framework without a requirement that justifies it. Record unresolved product behavior as a question rather than silently deciding it in implementation.
