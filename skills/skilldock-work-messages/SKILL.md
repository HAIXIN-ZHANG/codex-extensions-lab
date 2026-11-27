---
name: skilldock-work-messages
description: Draft workplace Slack or Teams messages and short emails from notes or task context, including progress updates, blockers, follow-ups, QA invitations, clarification, feedback replies and handoffs. Use for composing a message; supplied prose that only needs polishing and PR descriptions or PR review requests have separate workflows.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# Work messages

Read the optional private `extension-profiles/writing.md` under the selected data root (`SKILLDOCK_HOME` when set; otherwise legacy `CODEX_HOME` or `~/.codex`) for persistent output preferences. Apply the current request first, then repository requirements and the private profile. Preserve unknown facts as unknown.

Turn the user's facts and intent into a natural, concise message ready to send. Infer the audience, channel and purpose from context; do not require the user to choose a mode or fill in a template. Use only the relevant pattern from [message patterns](references/patterns.md) when it helps the current task.

## Choose the right boundary

- Compose from notes or context here. For an existing draft needing only wording improvements, use the available prose-polishing workflow or preserve that editing boundary yourself. Do not search for new project facts merely to polish supplied prose.
- PR descriptions and messages asking for PR review belong to the PR communication workflow when available. Replies to review comments can be drafted here from supplied findings and verified changes; drafting a reply does not perform a code review or fix the code.
- A short release/status message can be written from known facts. Follow applicable incident, security or release procedures when they govern the task; writing a message does not establish readiness or replace those procedures.
- Do not convert a message request into a Jira update, meeting booking, ticket assignment or research project. Read a linked thread or current task source when the user asks to base the message on it and authorized access is available. Ask only when a missing fact would materially change the ask, commitment or meaning.

## Keep the facts and the ask distinct

Lead with the update, question or action needed. Add enough context for the recipient to respond. A small request usually needs two or three sentences; use bullets when there are several separate actions or changes. Do not force headings or a greeting/sign-off onto a short thread reply.

For questions and PR or code discussions, include the most useful supporting link or evidence when available. Prefer a specific doc section, design node, ticket, thread, PR comment or code permalink the recipients can use. A verified observation, short error excerpt or reproduction can also support the ask. Place the reference where it explains the question. Omit unavailable references and evidence, and keep any material uncertainty explicit. A thread reply can refer to evidence already visible there without repeating the link.

- Separate what happened, what is suspected, what is proposed and what has been agreed. A possible cause is not a confirmed root cause; silence is not approval; an open question is not a decision.
- Preserve status, scope and environments: implemented, locally tested, available in QA, deployed to production and released to users are different claims. State relevant limitations rather than smoothing them away.
- Keep owners, dates, dependencies and commitments exactly as supplied or verified. Do not turn a target into a promise, assign work to someone, add a deadline, or imply a recipient has already agreed. If timing is unknown, omit it or state that it is unconfirmed when material.
- Make the request answerable: the question to resolve, action needed or feedback focus should be clear. A follow-up should refer to the existing request, link it when available, and explain any real impact without inventing urgency or blame.
- For a feedback reply, distinguish acknowledgement, intended action and completed action. Say "updated" or "resolved" only with evidence. If disagreeing, explain the concrete concern and propose a next step without attributing motives.

## Match voice and channel

Use the requested output language and any selected examples. Otherwise preserve the language of the supplied message or established recipient context; a Chinese instruction can ask for an English work message. Keep technical identifiers and links exact. For English without a contrary convention, use natural Australian spelling and plain workplace language.

Use simple, direct wording and preserve the user's own phrasing when it already works. Do not make a small update sound like a formal announcement or rewrite plain words just to sound more polished. Prefer direct, friendly wording over formal openings, inflated enthusiasm and repetitive thanks. Do not add apologies, urgency or excessive hedging unless the situation warrants them. Use verified/supplied recipient mentions only; do not invent Slack IDs, CCs or group membership. Keep confidential detail appropriate to the intended audience, using only necessary context rather than copying whole private threads or logs.

## Link display

Use a resource reference line with a category, descriptive title and copyable original URL, for example `PR: APP-123 Fix upload errors (https://github.com/example/app/pull/42)`. Prefer plain text. If the user requests a hyperlink, also show the same original URL in parentheses beside it. Use this for PRs, tasks, documentation, code, CI and other references. Preserve exact destinations and use only supplied or verified titles. A current explicit format request takes precedence over older examples. Keep actual code snippets and screenshot embeds intact.

When command access is permitted, use the installed `scripts/message-links.ts` relative to this skill folder to check a saved draft with `check-links message.md`. In a source checkout, use the canonical repository helper at `scripts/message-links.ts`; generated installations bundle it automatically. The checker fails malformed reference lines and hidden hyperlink destinations. It checks supplied files, while the host controls chat output.

## Deliver the message

Return the message itself, ready to paste. Provide one version unless alternatives were requested. Use channel-appropriate formatting; Slack/Teams posts should not look like formal email unless asked. Keep any material uncertainty about unavailable evidence outside the draft; do not invent links, test results or publishable placeholders.

Composing does not authorize sending or posting. If sending was explicitly authorized in this task, use the available service workflow and the specified destination, preserving existing authorization without asking again. Do not install integrations or change accounts to deliver a draft.
