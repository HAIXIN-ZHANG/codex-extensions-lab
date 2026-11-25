# Synthetic PR and Slack examples

These examples use fictional facts and links. They illustrate brevity and structure; they are not a transcript or a fixed personal template. Match the actual repository, evidence and requested language.

## Small UI fix: PR description

Assume the work items, implementation and checks below are verified. This concise shape uses Ticket, Background and What changed, with validation kept in one short paragraph. Preserve a selected example's own headings instead when supplied. Add Screenshots only when actual images are included; do not add a Slack greeting, review ask or PR link footer to the PR body.

```markdown
## Ticket

Jira: APP-123 Upload spacing (https://issues.example.com/browse/APP-123)
Jira: APP-124 Validation format (https://issues.example.com/browse/APP-124)

## Background

The CSV upload dialog has too much space around the body, and each validation issue repeats the information icon.

## What changed

- Reduce the body spacing to 16px and align the title and close button.
- Keep the information icon on the summary and show each validation issue as a bullet point.

Local review found no blocking issues. The focused validation dialog tests and changed-file lint passed. Full type checking was not run.
```

If screenshots are attached, add labelled Before/After images beneath this text. If the before image comes from an issue and the after image uses a local fixture, state that difference in their captions. Never fabricate asset links.

## Same fix: Slack review request

Assume the PR is open for review and its description contains the stated screenshots. Resolve actual recipients from the task; the example intentionally has no mention IDs. The verified title is APP-123 Fix CSV upload dialog spacing. Keep the title and original URL visible on the same labelled reference line.

```text
Hi team, could someone please review this small PR? Thanks.

It reduces the dialog spacing and shows validation errors as bullet points. Before/after screenshots are in the PR.

PR: APP-123 Fix CSV upload dialog spacing (https://github.com/example/web-app/pull/42)
```

## Broader change: Slack review request

Assume the following behavior and PR title are verified and the user has requested review of the import flow.

```text
Hi team, could I get a review on this import flow? Thanks!
• Connect the review step to the import API.
• Prevent duplicate submissions and refresh the list after success.
• Show correctable errors and unknown outcomes without automatic retries.

PR: APP-125 Connect the CSV import flow (https://github.com/example/web-app/pull/43)
```

Avoid expanding these requests into a release announcement, an exhaustive test log or a second copy of the PR body. For an early-feedback draft, say so in the ask.
