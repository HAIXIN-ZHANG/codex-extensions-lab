# Public English learning records

This folder contains intentionally published Markdown, separate from the installable skill and its private local archive. Everything here is public, including Git history. Do not copy private profiles, entire chats, credentials or material that another person has not agreed to publish.

## Selecting and creating plans

Each plan has a unique `Plan name` for people and a stable `Plan ID` in lower-case kebab-case. The ID must match its directory. A person may have several plans, and plans may belong to different people. Select a plan by its exact name or ID, not by person, newest modification, similar name or local archive. Read the selected `plan.md` and verify name, ID and directory. If a name resolves to more than one plan, the directory and ID disagree, or the plan cannot be accessed, stop before updating and ask. When no plan is selected or a name has no match, show the available names and IDs if accessible, ask whether one is intended, and create a new plan if none is right and its name and creation are confirmed. If the store cannot be read, explain that the list is unavailable rather than treating it as empty. An explicit selection remains active for the conversation until changed.

The available initial plan is [Jason's English Study Plan](plans/jason-english-foundations/plan.md), ID `jason-english-foundations`. To start another plan, choose a unique display name and ID with the learner and create a separate `plans/<plan-id>/plan.md`; never replace an existing plan. Check all plan metadata for duplicates before creation. Keep public learning preferences, materials and progress specific to that plan. Mark a lesson generated, read or needing review only on the evidence available; generating a lesson does not prove it was read or mastered. Do not claim the latest content is available on another device until it has actually been pulled there.

These rules guide the assistant; they are not enforced identity or access control. Any user with repository write access can modify these files. Prompt instructions are not a substitute for file permissions.

## Working across computers

Clone or pull the repository on each computer. Before editing, check the latest remote state and local changes; preserve history and resolve divergent edits explicitly. Commit and push authorized changes, then pull them on the other computer. Git does not sync automatically or resolve substantive conflicts by itself. No background service is required.

The standalone skill installer copies `skills/skilldock-english` only, not this sibling folder. To use these records from an installed skill, make the repository or selected record available in the current workspace and explicitly name the plan. The local `learning.ts` archive is separate: there is no automatic import, export or two-way synchronization between it and these Markdown files.
