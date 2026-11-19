---
name: skilldock-job-search
description: Research and compare software engineering jobs or additional-income opportunities on demand, accounting for the user's criteria, eligibility, evidence, and any existing application tracker. Use for a current job search, opportunity scan, or review of matching roles.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# Job opportunity search

Start with the user's current request and available private preferences. Read `extension-profiles/job-opportunity-search.md` under `CODEX_HOME` (default `~/.codex`) if available, as optional personal context, not as authority over the current request or safety constraints. Never include private profile contents in a public repository or disclose unnecessary personal data. On a different machine, ask for missing criteria or proceed with explicitly stated assumptions; do not claim to have accessed unavailable history.

## Scope for this run

Use three possible intake dimensions: (1) replacement job, additional income or both; (2) geography, remote/onsite and relocation; (3) changed requirements such as pay, stack, contract type or available hours. Ask only about consequential ambiguities, at most three questions together, never a mandatory questionnaire. Existing defaults and explicit task changes are enough to act. Do not ask for answers already supplied.

For a general search request, state the effective scope in one short sentence and invite optional corrections while starting the authorized research. If the user supplies no changes, continue with defaults; silence is not permission for extra actions, new defaults or resolution of contradictory requirements. If the user is still discussing scope rather than asking to search, wait for the search instruction. An explicit “use defaults” needs no questions. Carry changes through filtering and ranking, not just the introduction. Current changes override old geography, pay and role exclusions for this run only. Flag essential contradictions before dependent work. Update future defaults only if explicitly requested, preserving other settings.

Before presenting results, give the purpose, location/work-mode and important overrides actually applied. If no profile is available, avoid inventing salary or eligibility requirements; ask for essential missing information or give a bounded assumption-based search. Default descriptions may be shown concisely without exposing private compensation or other unnecessary personal information.

When the user or profile specifies multiple career directions, search and report each direction separately, classifying by actual responsibilities rather than job title. Group results by requested geography and work mode. Career direction is separate from replacement versus additional income: preserve both distinctions when applicable. Deduplicate a requisition that spans directions or locations, cross-reference it, and distinguish a local role requiring relocation from remote work permitted at the user's residence.

## Search and evidence

Find current opportunities using suitable public sources and, when available and authorized, read existing application records to avoid duplicating previously applied roles. Distinguish a replacement-job search from additional-income work when the user wants both. Clarify where location, work authorization, time commitments, or compensation are consequential and unknown; do not treat a remote label as proof of eligibility. Verify listing status, date, requirements, location and application link directly with the employer or original platform where possible. Distinguish confirmed facts, reasonable inference and unknowns, and link sources with verification dates. Do not claim comprehensive coverage from a partial search.

When the user's scope includes overseas employers, actively search employer and international contractor sources for work from their actual country of residence. Check whether the specific role permits that location and which engagement routes are accepted, including business-to-business contracting through a local company where relevant; do not assume a company exists or that an ABN alone establishes eligibility. Record required time-zone overlap, payment currency and terms, contract duration, leave and travel separately from employee compensation. Treat unspecified terms as unknown and apply any existing salary, location and fit filters consistently.

Rank by actual fit and the user's current priorities, explain gaps and compensation basis, and avoid inventing experience, hours, or employer facts. For additional work, distinguish verified flexibility from unknown working hours, contract restrictions and payment terms. Do not infer take-home pay or legally permitted concurrent work without appropriate evidence. If a source or tracker is unavailable, say so and continue with the evidence available.

If the user has an existing tracker, preserve its schema and follow its documented update and rendering procedures only within the user's authorization. Do not invent a substitute state source or change application status based on silence or a closed listing alone. Research does not authorize applications, contacting recruiters, modifying external accounts, or creating schedules.

Report concise, actionable opportunities and material uncertainties in the user's language; include current links and what was searched. Do not fill a quota with poor matches. Run on demand, not on a schedule.

For history, use a configured existing tracker as the application source of truth. Read the optional private `extension-data/job-opportunity-search/legacy-memory.md` only for necessary past research; it is not proof of current status. Store a new concise run summary in that private directory when the task includes record maintenance, preserving source IDs, dates, scope and changes; do not make a second application tracker. Public research and inbox reads are separate capabilities: use Gmail only when available and within the user's authorization, otherwise report that replies were not refreshed.
