# Message-writing scenarios

Use the task boundary rather than creating a separate skill for every message type. These workflows draft text; posting, editing remote services and installation require their own user authorization.

| Request | Workflow | What the message should make clear |
| --- | --- | --- |
| Draft a progress/stand-up update | Work Messages | Current state, next step and material dependency |
| Explain a blocker or ask for help | Work Messages | Observed failure, impact and specific help needed |
| Follow up or remind someone | Work Messages | Original ask, requested response and real timing/impact |
| Invite QA or request a retest | Work Messages | Available environment, flows, access and exclusions |
| Clarify a requirement, API contract or design | Work Messages | Ambiguous scenario, current understanding and question |
| Reply to feedback or a review comment | Work Messages | Acknowledgement, evidence and planned versus completed action |
| Summarise meeting outcomes or confirm decisions | Work Messages | Agreed facts, open questions and confirmed actions |
| Hand off work or explain availability/scope changes | Work Messages | State, next step, caveat and requested ownership |
| Draft a release request or rollout update | Work Messages | Exact environment/version, verified stage and action needed |
| Write a PR description/summary | PR Comms | Problem, resulting behaviour, evidence and relevant links |
| Ask for PR review in Slack | PR Comms | Direct ask, brief change scope and actual PR link |
| Improve an existing message/email without changing facts | Polish | Preserve voice, language, certainty and commitments |

For questions and PR or code discussions, include relevant supporting links or evidence when available. Point to the exact source a recipient needs, such as a document section, design node, code line, PR comment or test result. A short verified error or observation can supply the context directly. Omit unavailable references and evidence.

Use plain workplace wording and labelled references with a descriptive title and a copyable original URL. The default is `PR: APP-123 Fix errors (https://github.com/example/app/pull/42)`. A hyperlink also needs its original URL displayed beside it. The private `extension-profiles/writing.md` profile supplies persistent preferences. These apply across task types through the user's global instructions.

The dependency-free `scripts/message-links.ts` helper formats JSON references with `format references.json`, validates saved messages with `check-links message.md`, and checks the selected compact PR structure with `check-pr summary.md`. Failures produce a nonzero exit code. Run with Node.js 24+. Fenced and inline code and image embeds are preserved. Prose file references need the same labelled format. The compact PR checker requires one unheaded paragraph after the change bullets and image syntax in any Screenshots section. It checks structure, so the writer must still verify the evidence and image source. The helper validates the given artifact. The host has no configured interception of every chat response.

For PR summaries, preserve the selected summary example's headings, order and brevity separately from the Slack format. The concise fallback is Ticket, Background and What changed, a short validation paragraph, and Screenshots only when images are present. Repository-required sections still apply.

## Invocation examples

- `用 $skilldock-work-messages 根据这些要点写英文 Slack 进度同步，说明 API 仍然 blocked，不要承诺上线日期。`
- `用 $skilldock-work-messages 写一条礼貌的 follow-up，问一下上面的设计问题有没有结论。`
- `用 $skilldock-work-messages 根据这个 QA 链接和测试范围，写一条 smoke test 邀请。`
- `用 $skilldock-work-messages 回复这条 review comment：我同意建议，但代码还没改，不要写成已经完成。`
- `用 $skilldock-pr-comms 根据当前 diff 写 PR summary 和 review request。`
- `用 $skilldock-polish 润色下面这段消息，保持原意。`

The relevant entrypoints are [Work Messages](../skills/skilldock-work-messages/SKILL.md), [PR Comms](../skills/skilldock-pr-comms/SKILL.md) and [Polish](../skills/skilldock-polish/SKILL.md). Work Messages has [nine conditional patterns](../skills/skilldock-work-messages/references/patterns.md); they are flexible starting points rather than required forms. Current requests, selected examples and repository/team requirements take precedence over fallback structure.

Draft from the facts supplied or scoped, authorized sources. Do not infer agreement from silence, availability from implementation, successful testing from deployment, or urgency from a follow-up request. Incident/security/release workflows remain responsible for their operational requirements; a message draft is not an operational action or readiness assessment.
