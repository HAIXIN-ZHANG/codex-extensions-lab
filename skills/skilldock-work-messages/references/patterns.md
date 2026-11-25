# Workplace message patterns

Read only the relevant pattern. These are flexible shapes with fictional examples, not mandatory headings, fixed wording or records of actual conversations. Adapt to the supplied audience, evidence and language. Omit absent optional details; ask only for facts essential to the message.

## 1. Progress or stand-up update

State what changed, what remains and any dependency. Include a target only when supplied; distinguish it from a commitment. Completion of coding alone does not mean testing or rollout is complete.

> The upload changes are implemented and the focused tests pass. Integration testing is still pending while the QA endpoint is unavailable. I'll continue with the error-state checks in the meantime.

## 2. Blocker and request for help

Explain the observable failure, practical impact, useful checks already performed and the specific help needed. Preserve uncertainty about the cause. Do not paste credentials, full logs or customer records.

> CSV validation returns 403 in QA, so I can't test the review step yet. The request reaches the gateway, but I haven't confirmed where it is being rejected. Could someone help check the QA permissions?

## 3. Follow-up or reminder

Refer to the previous ask and give a clear next action. Mention timing or impact only when real. Keep the tone neutral rather than implying negligence or adding urgency. A useful timing question is better than an invented deadline.

> Following up on the API field question above. Could you confirm which value the frontend should use? That will let me finish the validation mapping.

## 4. QA invitation or fix ready for retest

Give the actual environment/link, the flows to try, any required access/gate and where to report issues when known. Include material exclusions. Invite testing rather than claiming full validation. Do not call a local-only fix available in QA.

> The upload changes are available in QA for smoke testing. Please try a valid file, an invalid file and the retry flow. The import step is still blocked by the API issue, so it isn't part of this round. Please add any findings to the linked task.

Use the real link if supplied; the example does not authorize inventing one. For retesting, mention the specific issue fixed and what needs checking again.

## 5. Requirement or design clarification

State the ambiguous scenario, the current understanding and a concrete question. Include a proposed option only when it helps the recipient decide, clearly labelled as a proposal. Keep confirmed product decisions when an older design differs.

> The validation mockup shows one destination error. For a file containing several destinations, should we list one bullet per destination under the summary?
>
> CSV upload validation mockup
> https://design.example.com/upload#validation

## 6. Feedback, disagreement or review-comment reply

Acknowledge the point without automatically conceding. State the response, evidence and next action. Distinguish a planned change from one already made. For a technical disagreement, explain the concrete tradeoff and offer a focused alternative.

Planned:

> That makes sense. I'll move the shared validation into the helper and keep the component focused on presentation.

Completed, only when verified:

> Updated the helper and added coverage for the empty-response case. The focused tests pass.

Disagreement:

> I'm concerned that retrying automatically could submit the import twice when the first response is lost. Could we keep the unknown-outcome state and ask the user to check the result first?

## 7. Meeting follow-up and decision confirmation

Separate agreed decisions, proposals/open questions and actions. Keep owners/dates only when assigned or confirmed. If the notes are tentative, request confirmation instead of announcing agreement. Do not turn the summary into a full meeting transcript.

> My understanding is that we'll keep the current upload limit and use one bullet per validation issue. The retry behaviour is still open. Could you confirm whether that's the agreed scope before I update the task?

## 8. Handoff, availability or changed scope

Give the current state, relevant links, the next actionable step and material caveats. Mention availability only as provided. A proposed handoff is a request, not an assignment accepted by the recipient. If scope or timing changes, say what changed and its practical effect without making a new commitment.

> The UI changes are ready for integration testing. The remaining step is to check the expired-session case once the QA API is available. Could you take that check while I'm away tomorrow? The test notes are in the linked task.

## 9. Release request or rollout update

Distinguish requesting approval, scheduling, starting, completing and validating a rollout. Include the verified version/environment, change scope, material caveat and action needed. Use repository/team release procedures where applicable. Do not claim a release succeeded merely because deployment started.

> Version 2.4.1 has been deployed to QA. The upload spacing fix is included; production rollout is still pending. Could you smoke-test the dialog before we request the production release?
