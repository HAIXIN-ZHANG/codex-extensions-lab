# Perth property intelligence

A small, on-demand research foundation. It stores manually gathered, dated market and land observations in an append-only local SQLite database and provides a configurable replacement-cost calculator. It does not collect data from websites, start scheduled jobs, produce automatic investment recommendations, or verify source claims. Research should follow the property-search skill and retain source dates and the differences between advertised and sold prices.

Requires Node.js 24. No third-party packages are required. Its built-in SQLite module currently emits an experimental-feature warning. Keep the database, import files, reports containing private information and financial inputs outside this repository, for example under your configured private directory. Back up the database independently.

## Import observations

Prepare a JSON file like the following in your private directory. Every field shown is required. `observed_at` is UTC ISO 8601 with a `Z` suffix; `source_date` is the publication/statistical date (or a clearly identified observation date). Prices and areas are optional and must be non-negative finite numbers. Status is one of `available`, `reserved`, `under_offer`, `sold`, `withdrawn`, `unknown`. Supply `unknown` when the source does not establish status. Identifiers must represent the same lot or metric consistently across imports.

```json
{
  "observed_at": "2026-01-01T10:00:00Z",
  "observations": [
    {
      "kind": "lot",
      "key": "example-estate:stage-1:lot-1",
      "source_url": "https://example.org/land",
      "source_date": "2026-01-01",
      "status": "available",
      "price_aud": 500000,
      "area_sqm": 500,
      "notes": "Illustrative example only; not a real listing."
    }
  ]
}
```

```sh
node perth-property-intelligence/cli.ts import /path/to/private/research.sqlite /path/to/private/snapshot.json
node perth-property-intelligence/cli.ts latest /path/to/private/research.sqlite
node perth-property-intelligence/cli.ts history /path/to/private/research.sqlite 'example-estate:stage-1:lot-1'
```

The complete imported JSON is retained unchanged alongside structured observations in one transaction. Duplicate keys in a snapshot, identical snapshots, observations with a timestamp not later than the existing record for the same kind and key, and invalid records are rejected. Explicitly review conflicting corrections; do not silently change historical observations. A later observation that corrects an earlier source should say so in `notes`. Database triggers reject updates/deletions, but this is not a substitute for file backups or protection against file deletion or replacement. Source text or evidence should be retained separately when permitted by the source. No inference is made from a listing disappearing.

`kind` is `lot` or `market`. For market records the same format applies: use a meaningful key containing metric and period, `status: "unknown"`, and add `value`, `unit` and descriptive `notes` if needed. Units and periods are not standardized automatically; compare only like-for-like values. Optional `source_published_date`, `period`, `confidence`, `estate`, `suburb`, `stage`, `frontage_m`, `depth_m`, `title_status`, `estimated_title_date`, and other evidence fields are preserved in the raw observation. Import does not validate these extra fields against source material.

## Compare upgrade costs

Create a private JSON input and run `node perth-property-intelligence/cli.ts model /path/to/private/model.json`. Numbers are examples only:

```json
{
  "sale_gross": 1000000,
  "sale_costs": 25000,
  "mortgage_balance": 300000,
  "plans": [
    {"name": "existing", "purchase": 1500000, "transfer_tax": 60000, "transaction": 5000, "renovation": 40000},
    {"name": "land-build", "purchase": 750000, "transfer_tax": 30000, "build": 700000, "site_works": 50000, "landscaping": 40000, "holding": 50000, "contingency": 75000}
  ]
}
```

The model prints acquisition and other costs less net sale proceeds before mortgage (`upgrade_gap`), and cash required after repaying the existing mortgage (`cash_required_after_debt`). Enter every expense separately; add demolition, asbestos, temporary accommodation, interest, and other items as necessary. Inputs are illustrative, not tax estimates. It does not calculate loan approval, repayments, cash reserves, tax concessions or affordability. For price scenarios create separate input files, documenting assumptions. Avoid double-counting construction, holding and financing costs.

## Research cadence

Run on demand: quick updates check recent market and watched listings; weekly updates compare successive observations; monthly reviews reassess macroeconomic drivers, suburbs and comparable transactions. Before each update read the latest private report, inspect `latest`, then import only verified new observations. Keep unavailable data marked unknown. Store the research report and evidence privately. No automatic schedule or scraping has been configured.

Run `node --test perth-property-intelligence/tests/*.test.ts` for focused tests.
