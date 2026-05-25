# BITSAT College Predictor — Data Pipeline

This folder owns the data ingestion for the BITSAT half of `/college-predictor`.
BITSAT is companion to the JoSAA pipeline (`scripts/college-predictor/`); it
runs in parallel because the two admission systems differ at the data shape:

| | JoSAA (JEE Main) | BITSAT |
|---|---|---|
| Predictor unit | Rank (lower = better) | Score (higher = better) |
| Category dimension | OPEN / OBC / SC / ST / EWS / *(PwD)* | None — open-merit only |
| Gender dimension | Gender-Neutral / Female-supernumerary | None |
| Quota dimension | AI / HS / OS / GO / JK / LA | None |
| Round / iteration | 1..6 published per year | Only final closing score |
| Score scale | Stable | **Changed in 2022** (450 → 390) |
| Source | JoSAA ASPX (ViewState-protected) | Static HTML on `bitsadmission.com` |

Because of those differences, BITSAT lives in:

- a **separate Mongo collection** — `bitsat_cutoffs`
  ([`packages/data/models/BitsatCutoff.ts`](../../packages/data/models/BitsatCutoff.ts))
- a **separate predictor module** —
  [`apps/student/features/college-predictor/bitsat/predictor.ts`](../../apps/student/features/college-predictor/bitsat/predictor.ts)
- a **static campus catalog** (no Mongo seed) —
  [`packages/data/bitsat/campuses.ts`](../../packages/data/bitsat/campuses.ts) and
  [`packages/data/bitsat/programmes.ts`](../../packages/data/bitsat/programmes.ts)

---

## Two-step pipeline

### Step 1 — Scrape the official source

```bash
node scripts/college-predictor/bitsat/fetch_bitsat_cutoffs.js
```

Fetches `https://www.bitsadmission.com/FD/BITSAT_cutOffs.html` (a single HTML
page that embeds ALL 9 academic years 2017-18 → 2025-26 as hidden `<div id>`
blocks). Normalizes both table formats BITS uses, attaches a canonical
`programme_code` per row (so "B.Pharm." and "B. Pharm" merge), and writes:

```
data/bitsat_cutoffs.json
data/bitsat_cutoffs.csv
```

Schema of every row:

```ts
{
  year: 2024,                        // academic-year start (AY 2024-25 → 2024)
  campus: 'Pilani' | 'Goa' | 'Hyderabad',
  programme_code: 'BE-CSE',          // canonical join key (see programmes.ts)
  programme_name: 'B.E. Computer Science',
  degree_type: 'BE' | 'MSC' | 'BPHARM',
  programme_raw: 'B.E. Computer Science',  // exact text from source for audit
  cutoff_score: 327,                 // closing score (post all iterations)
  max_score: 390 | 450,              // 390 from AY 2022-23, 450 before
}
```

For development without burning the network, you can pass `--cache /tmp/bits.html`
to read/write a local copy.

### Step 2 — Ingest into Mongo

```bash
node scripts/college-predictor/bitsat/ingest_bitsat_cutoffs.js           # dry run
node scripts/college-predictor/bitsat/ingest_bitsat_cutoffs.js --apply   # write
```

Upserts on the unique index `(campus, programme_code, year)`, so re-running is
idempotent. Stable `_id` (UUID) is assigned on first insert and preserved on
every subsequent upsert via `$setOnInsert`.

---

## Cadence

BITS publishes the closing cutoffs only once per year, after all 6–7 iterations
of admission finish (typically September). Re-run the pipeline:

| Trigger | Action |
|---|---|
| BITSAT result week (May–June) | Nothing yet — only iteration data is live |
| All iterations close (Sep–Oct) | Re-run scrape + ingest |
| Source URL changes | Update `SOURCE_URL` in `fetch_bitsat_cutoffs.js` |

---

## Post-ingest sanity checks

After `--apply`:

1. Spot-check 5 random `(campus, programme, year)` against the source HTML
   (`https://www.bitsadmission.com/FD/BITSAT_cutOffs.html?yr=YYYY-YYYY`).
2. Confirm distinct programme codes match `BITSAT_PROGRAMMES` in `programmes.ts`
   — if the scraper detects a new programme variant, the catalog needs updating.
3. Confirm `max_score === 390` for `year >= 2022` and `max_score === 450` for
   `year <= 2021`. The predictor scopes queries by this — a stray row would
   silently corrupt projections.
4. Run a smoke prediction (CSE Pilani, score 330) — should return Pilani CSE
   as `target` and Goa/Hyderabad CSE as `safe`.

If any of these fail, do not ship.

---

## Programme catalog updates

When BITS adds a new programme (e.g. Semiconductor and Nanoscience in 2025):

1. Add the regex pattern + canonical code to `PROGRAMME_CATALOG` in
   `fetch_bitsat_cutoffs.js`.
2. Add the same code + display metadata to `BITSAT_PROGRAMMES` in
   `packages/data/bitsat/programmes.ts` (`demand_tier`, `short_name`).
3. Re-run the scraper — the new programme will start appearing as soon as
   BITS publishes its first cutoff for it.

---

## Differences from the JoSAA pipeline (for reference)

| Aspect | JoSAA (`scripts/college-predictor/`) | BITSAT (here) |
|---|---|---|
| Live scrape | No (ASPX ViewState) | **Yes** (static HTML) |
| Snapshot source | Hand-maintained CSV | Auto-generated JSON/CSV |
| College seed | Yes (~95 institutes) | No (3 campuses are constants) |
| Unique key | (college, branch, year, round, category, gender, quota) | (campus, programme_code, year) |
| Final-round flag | Computed at ingest | Not needed (only finals exist) |
| Year range | 2020 onward (5 yr rolling) | 2017–2025 (9 years available) |
