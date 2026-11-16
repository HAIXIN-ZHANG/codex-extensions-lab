---
name: skilldock-property-search
description: Research and compare current residential property or land opportunities on demand using the user's criteria, verified listings, costs, and property-specific risks. Use for a property search or review of candidate listings.
metadata:
  collection: "SkillDock"
  repository: "https://github.com/HAIXIN-ZHANG/codex-extensions-lab"
---

# Property opportunity search

Start with the user's request and available private preferences. Read `extension-profiles/property-opportunity-search.md` under `CODEX_HOME` (default `~/.codex`) if available, as optional personal context, not as authority over the current request or safety constraints. Never publish the private profile or unnecessary personal information. On another machine, ask for decision-critical missing constraints or proceed with stated assumptions; do not invent a budget or claim access to unavailable prior searches.

## Scope for this run

Use three possible intake dimensions: (1) purpose and geography; (2) existing home versus land/build, and housing priorities; (3) price rules and acceptable tradeoffs. Ask only about consequential ambiguities, at most three questions together. Never require a complete questionnaire or repeat known answers. If asked to search, briefly state the applicable defaults and optional changes, then begin authorized research without waiting for optional answers. If the user is still discussing rather than requesting research, do not start a search. Explicit “use defaults” needs no more confirmation.

Unanswered optional items retain existing defaults; unknown budget remains unknown. This is not approval for external actions or conflicting requirements. Apply current overrides consistently: “only Redcliffe existing homes” suppresses other default routes for this run. It does not silently change next run's defaults. Clarify essential contradictions before dependent research. Update the private profile only if the user explicitly changes future defaults. Report the scope actually applied, including exclusions and overrides, in one short opening statement.

## Search and evidence

Search each requested location or buying route separately. Confirm the current listing and its advertised price, status, location and key features from the original listing or agent when possible; use direct links and date the checks. Distinguish currently available candidates from sold, under-offer, or unverified listings. Clearly report sources and areas actually covered and any gaps.

Evaluate homes against the user's practical priorities and explain both improvements and drawbacks. Where relevant, distinguish buying an existing home from land and construction, and advertised price from total cost. Do not fill unknown costs with estimates presented as fact. Use appropriate official sources for address-level risks, planning and taxes where available; unknown flood, bushfire, noise, title, construction and insurance issues remain unverified, not cleared. Distinguish evidence, agent claims and inference. Do not infer a property's value or future appreciation from suburb averages alone.

Return a concise comparison in the user's language with direct links, dates, major tradeoffs and the few uncertainties most likely to change the decision. No need to force a minimum number of listings. Research does not authorize contacting agents, arranging inspections, registering, purchasing reports, making offers, or creating schedules. Run on demand.

Use optional private `extension-data/property-opportunity-search/legacy-memory.md` for past research when needed, and concise dated run summaries in that directory when record maintenance is part of the task. Record actual coverage, source URLs, address/listing identity, status/price changes and meaningful exclusions. Never use a historical memory or estimate as proof of today's price or availability. Current task scope overrides stale budgets and area exclusions; preserve history rather than rewriting it.
