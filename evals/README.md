# Behavioral regression scenarios

`cases.json` contains synthetic prompts and observable expectations for all eight skills. This is a reusable evaluation corpus, not proof that the skills work and not an automatic model benchmark.

For an actual run:

1. Record the repository/installed-skill revision, client/model and which skill was actually loaded. Use a temporary workspace and synthetic profiles; never publish private originals.
2. Submit the input with only the provided scenario context and the relevant skill. Disable external mutations; use controlled source fixtures when research behavior is under test. A live browsing test requires its own permitted scope and dated sources.
3. Save the unedited output and relevant tool trace privately. Assess each expectation with concrete evidence. Style may have multiple correct answers; do not grade a fixed sentence or infer tool use from a claim.
4. Mark pass, fail or not-testable for each expectation. For consequential cases, compare a no-skill baseline or use another reviewer when available and authorized. Static metadata checks are a separate result.

Keep a result record with case ID, date, revision, model/client, output/tool evidence, expectation outcomes and limitations. Only count an empirical pass after the run. Do not label review by the author as independent validation, or generate external calls merely by reading this evaluation guide.

When real failures occur, sanitize a minimal case, fix the narrow rule responsible and rerun affected cases. No fixed scoring metric, automatic model calls or paid benchmark service is installed.
