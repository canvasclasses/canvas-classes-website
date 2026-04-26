# College Predictor — Data Pipeline

This folder owns the data ingestion for `/college-predictor`. JoSAA itself is an
ASPX site that fights live scraping, so the pipeline is a deliberate two-step:

1. **Snapshot** JoSAA's cutoff data into a normalized CSV (once per year, after
   Round 6 is published — typically late July).
2. **Ingest** the CSV via `ingest_josaa_csv.js`, which upserts into the
   `college_cutoffs` collection.

Colleges must be seeded first (`seed_colleges.js`) — the ingester skips rows for
institutes it can't match to a `colleges` document.

---

## Step 1 — Seed colleges

```bash
node scripts/college-predictor/seed_colleges.js           # dry run
node scripts/college-predictor/seed_colleges.js --apply   # upsert
```

The initial commit seeds ~10 top NITs/IIITs to prove the pipeline. Full list
(31 NITs + 26 IIITs + 38 GFTIs) is added in subsequent batches — edit the
`COLLEGES` array and re-run.

The `_id` slug in `seed_colleges.js` **must** match the output of the ingester's
`slugify(institute_name)`. If you add a new college, verify the slug matches
what JoSAA publishes as the institute name.

---

## Step 2 — Snapshot JoSAA data into CSV

JoSAA publishes round-wise opening/closing ranks at:
- Current year: `https://josaa.nic.in/Report/Root/ReportCRRCurrentYear.aspx`
- Archives: `https://josaa.nic.in/reports/orcr/` (yearly)

Because the site is an ASP.NET form with ViewState tokens, there are three
acceptable ways to produce the CSV:

1. **Manual export** — filter institute + year + round in the UI and copy the
   HTML table into a spreadsheet. Slow but bulletproof.
2. **Community datasets** — some open GitHub repos maintain scraped JoSAA CSVs;
   verify the dataset's rounds/categories match JoSAA official PDFs before use.
3. **Automated ViewState scraper** — not included here yet; if built, it must
   live alongside this script and produce the same CSV format below.

### CSV format (required header, case-insensitive)

```
Institute,Academic_Program_Name,Quota,Seat_Type,Gender,Opening_Rank,Closing_Rank,Year,Round
```

Example row:

```
National Institute of Technology Tiruchirappalli,Computer Science and Engineering (4 Years Bachelor of Technology),OS,OPEN,Gender-Neutral,1234,2567,2024,6
```

Value vocabularies (must match exactly):

- `Quota`: `AI` · `HS` · `OS` · `GO` · `JK` · `LA`
- `Seat_Type`: `OPEN` · `OBC-NCL` · `SC` · `ST` · `EWS` · `OPEN (PwD)` · `OBC-NCL (PwD)` · `SC (PwD)` · `ST (PwD)` · `EWS (PwD)`
- `Gender`: `Gender-Neutral` · `Female-only (including Supernumerary)`
- `Round`: 1–6 (JoSAA's final round)

---

## Step 3 — Ingest

```bash
node scripts/college-predictor/ingest_josaa_csv.js data/josaa_2024.csv           # dry run
node scripts/college-predictor/ingest_josaa_csv.js data/josaa_2024.csv --apply   # write to DB
```

The ingester:
- Parses and validates every row
- Skips rows for unmatched institutes (reports them at the end)
- Computes `is_final_round` per year (= max round seen in the CSV for that year)
- Upserts on `(college_id, branch_short_name, year, round, category, gender, quota)`

Dry run always runs first. Verify the counts and sample documents before using
`--apply`.

---

## Post-ingest sanity checks

After `--apply`:

1. Spot-check against JoSAA official PDFs — pick 5 random `(college, branch, category)`
   combinations and confirm the closing ranks match.
2. Confirm `is_final_round: true` count per year matches the number of distinct
   `(college, branch, category, gender, quota)` combinations published in the
   final round.
3. Run the predictor page (once built) against a known rank — results should
   feel sensible (e.g. CRL 500 → top NIT CSE in Safe bucket).

If any of these fail, don't ship. Wrong cutoff data destroys trust faster than
a missing feature.

---

## Yearly calibration refresh — `percentileToRank.ts`

The percentile→rank conversion in `lib/collegePredictor/percentileToRank.ts`
depends on two NTA-published numbers that change every year:

1. **Total unique candidates across both sessions** → `TOTAL_CANDIDATES_BY_YEAR`
2. **Per-category appearance counts (Session 1)** → `CATEGORY_CANDIDATE_SHARE_BY_YEAR`

NTA's release pattern is stable: Session 1 results in mid-February, Session 2
in late April. The Session 1 press release contains the per-category appearance
breakdown; the Session 2 release contains the unique-across-sessions total.

### When to refresh

| Date | Action |
|---|---|
| **Mid-Feb** (after Session 1 results) | Add this year's per-category shares to `CATEGORY_CANDIDATE_SHARE_BY_YEAR` |
| **Late April** (after Session 2 results) | Update this year's `TOTAL_CANDIDATES_BY_YEAR` and bump `LATEST_SHARE_YEAR` |

### How to refresh

1. Pull the NTA Session 1 press release PDF from `jeemain.nta.nic.in` or read
   the press coverage (PW Live, Careers360, Shiksha all publish the table).
2. Compute share = `appeared[category] / total_appeared` for OBC-NCL, SC, ST, EWS.
   OPEN stays at 1.00 (CRL pool is everyone).
3. Add a new entry to `CATEGORY_CANDIDATE_SHARE_BY_YEAR[YYYY]` mirroring the
   2026 entry's structure.
4. After Session 2: update `TOTAL_CANDIDATES_BY_YEAR[YYYY]` with the unique
   total and bump `LATEST_SHARE_YEAR`.
5. Re-run `npx tsx scripts/college-predictor/validate_predictor.ts` — IN-9
   should still pass and the rank conversions in the percentile sweep should
   shift slightly to reflect the new pool sizes.

### Validation harness

`validate_predictor.ts` is the source of truth for whether the predictor's
behavior matches its contract. Run it after any change to the predictor or
calibration tables. 10 invariants are tracked (IN-1 through IN-10);
`PREDICTOR_VALIDATION_REPORT.md` is regenerated on every run.
