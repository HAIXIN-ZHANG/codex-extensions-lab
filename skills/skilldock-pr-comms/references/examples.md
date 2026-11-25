# Synthetic PR and Slack examples

These examples use fictional facts and links. They illustrate brevity and structure; they are not a transcript or a fixed personal template. Match the actual repository, evidence and requested language.

## Small UI fix: PR description

Assume the work items, implementation and checks below are verified. Images would be added only if actual image URLs were available.

```markdown
## Ticket

[APP-123](https://issues.example.com/browse/APP-123) · [APP-124](https://issues.example.com/browse/APP-124)

## Background

The CSV upload dialog has too much space around the body, and each validation issue repeats the information icon.

## What changed

- Reduce the body spacing to 16px and align the title and close button.
- Keep the information icon on the summary and show each validation issue as a bullet point.

Local review found no blocking issues. The updated [validation dialog tests](https://github.com/example/web-app/blob/0123456789abcdef0123456789abcdef01234567/src/upload-dialog.test.tsx#L24-L46) and changed-file lint passed. Full type checking was not run.
```

If screenshots are attached, add labelled Before/After images beneath this text. If the before image comes from an issue and the after image uses a local fixture, state that difference in their captions. Never fabricate asset links.

## Same fix: Slack review request

Assume the PR is open for review and the description contains the stated screenshots. Resolve actual recipients from the task; the example intentionally has no mention IDs.

```text
Hi team, could someone help review this CSV upload dialog fix? Thanks!
It tightens the dialog spacing and shows validation issues as bullet points. Details and screenshots are in the PR description:
https://github.com/example/web-app/pull/42
```

## Broader change: Slack review request

Assume the following behavior is verified and the user has requested review of the import flow.

```text
Hi team, could I get a review on this import flow? Thanks!
• Connect the review step to the import API.
• Prevent duplicate submissions and refresh the list after success.
• Show correctable errors and unknown outcomes without automatic retries.

https://github.com/example/web-app/pull/43
```

Avoid expanding these requests into a release announcement, an exhaustive test log or a second copy of the PR body. For an early-feedback draft, say so in the ask.
