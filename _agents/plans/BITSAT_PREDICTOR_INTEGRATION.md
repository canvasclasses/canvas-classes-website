# BITSAT predictor — integration plan

Status: data layer + predictor logic complete (this PR scope). UI/API wiring is
the next phase — described here so you can review the surface before code changes.

## What's already in place (this PR)

| File | Purpose |
|---|---|
| [`scripts/college-predictor/bitsat/fetch_bitsat_cutoffs.js`](../../scripts/college-predictor/bitsat/fetch_bitsat_cutoffs.js) | Live scraper for `bitsadmission.com` — pulls all 9 academic years (2017-18 → 2025-26) in one HTTP request, canonicalizes campus + programme names, writes `data/bitsat_cutoffs.json` + `.csv` |
| [`scripts/college-predictor/bitsat/ingest_bitsat_cutoffs.js`](../../scripts/college-predictor/bitsat/ingest_bitsat_cutoffs.js) | Mongo upsert into `bitsat_cutoffs` |
| [`scripts/college-predictor/bitsat/data/bitsat_cutoffs.json`](../../scripts/college-predictor/bitsat/data/bitsat_cutoffs.json) | 352 rows × 9 years × 3 campuses × 18 programmes |
| [`scripts/college-predictor/bitsat/README.md`](../../scripts/college-predictor/bitsat/README.md) | Pipeline docs + cadence + post-ingest checks |
| [`packages/data/models/BitsatCutoff.ts`](../../packages/data/models/BitsatCutoff.ts) | Mongoose model (separate collection from JoSAA's `college_cutoffs`) |
| [`packages/data/bitsat/campuses.ts`](../../packages/data/bitsat/campuses.ts) | Static catalog for 3 campuses (no Mongo seed needed) |
| [`packages/data/bitsat/programmes.ts`](../../packages/data/bitsat/programmes.ts) | Canonical programme codes + demand-tier metadata |
| [`apps/student/features/college-predictor/bitsat/predictor.ts`](../../apps/student/features/college-predictor/bitsat/predictor.ts) | Pure score-based predictor engine — `predictBitsat({ score, regime, campuses, programmes })` |

Spot-check: 20/20 known cutoffs match the source HTML; smoke test predicts
CSE @ score 280 as `target` Hyderabad and `reach` Pilani — sensible.

---

## Why BITSAT is a parallel system (not an extension of JoSAA)

| | JoSAA | BITSAT |
|---|---|---|
| Predictor unit | Rank (lower = better) | Score (higher = better) |
| Category dimension | OPEN / OBC / SC / ST / EWS / *(PwD)* | None |
| Gender dimension | Gender-Neutral / Female-supernum. | None |
| Quota dimension | AI / HS / OS / GO / JK / LA | None |
| Score scale | Stable | **Changed in 2022** (450 → 390) |
| Rounds | 1..6 published | Only final close |

Wedging BITSAT rows into `college_cutoffs` would have meant every BITSAT row
carrying placeholder values for category/gender/quota — that corrupts the JoSAA
predictor's hot query path (compound indexes assume those dimensions are real).
Splitting at the storage layer keeps both predictors fast and correct.

---

## Step A — Plumb the API route (next change)

Mirror `apps/student/app/api/v2/college-predictor/predict/route.ts` for BITSAT.

```
apps/student/app/api/v2/college-predictor/bitsat/predict/route.ts
```

Surface:

```ts
POST /api/v2/college-predictor/bitsat/predict
Body: {
  score: number;              // 0..390 (modern) or 0..450 (legacy)
  regime?: 'modern' | 'legacy';  // default 'modern'
  campuses?: ('pilani' | 'goa' | 'hyderabad')[];
  programmes?: BitsatProgrammeCode[];        // optional pre-filter
  include_unlikely?: boolean;
  extended?: boolean;         // default false → top 10
}
Returns: {
  success: boolean,
  input_summary: { score, regime, max_score },
  counts: { safe, target, reach, unlikely },
  total_programmes,
  programmes: BitsatPredictorResult[]  // sorted: bucket → demand_tier → score
}
```

Notes:
- Reuse `createRateLimiter` + `getClientIp` from the JoSAA route.
- No category/gender/home-state inputs (BITSAT has no such dimensions).
- The grouping/sorting layer is simpler than JoSAA — there's no "per-college
  with branches" structure. Each programme×campus is one card.

## Step B — Tab the UI

The existing `/college-predictor` page is JEE-Main-only today. Two viable UX
shapes:

**Option 1 — Tab inside the same page** (recommended)

```
┌──────────────────────────────────────────────────────────────┐
│  JEE Main Predictor  |  BITSAT Predictor                     │ ← tab strip
├──────────────────────────────────────────────────────────────┤
│  (form below changes based on active tab)                    │
└──────────────────────────────────────────────────────────────┘
```

Reasons:
- Search-engine continuity — `/college-predictor` already ranks; don't dilute.
- Shared hero + "Browse colleges" + JSON-LD payload stay reused.
- One URL to share with parents; tab persisted in URL param `?tool=bitsat`.

**Option 2 — Separate route `/college-predictor/bitsat`**

Cleaner if SEO favors a distinct landing; but doubles the maintenance and the
hero / FAQ JSON-LD has to be duplicated. Defer this.

## Step C — Build `BitsatPredictorClient` (new component)

Parallel to `PredictorClient.tsx` but with a different form shape:

| Field | Type | Notes |
|---|---|---|
| BITSAT score | number, 0..390 (or 0..450 if legacy) | Single input, no percentile mode |
| Regime | radio: `modern (2022+)` / `legacy (≤2021)` | Default modern; legacy is a research toggle |
| Preferred campuses | multiselect chips (Pilani / Goa / Hyderabad) | All on by default |
| Preferred programmes | optional multiselect or free-text | Filters the result list |

The result list is **flat per (campus × programme)**, not nested-by-college
like the JoSAA UI — there are only 3 campuses, so the per-college accordion
adds nothing. Each card shows:

- Programme name + short_name + degree_type badge
- Campus tag (Pilani / Goa / Hyderabad)
- Bucket badge (Safe / Target / Reach)
- Probability %
- Projected closing score + 4-year sparkline (reuse `CutoffSparkline` from
  `PredictorClient.tsx`; pass score values instead of ranks)
- Confidence tag (high / medium / low)

## Step D — Cross-link the two predictors

In each predictor's "What this is" footer card, add a hand-off line:

> "Also writing BITSAT? Switch to the BITSAT predictor →" (and vice versa).

The JoSAA results that surface BITS rows under "Top colleges" (currently
`TOP_COLLEGES.find(c => c.shortName === 'BITS Pilani')`) should add a CTA
linking to the BITSAT predictor tab.

## Step E — SEO surface

Update `/college-predictor/page.tsx`:

- Add BITSAT-flavored keywords to the existing `metadata.keywords` (`BITSAT
  college predictor`, `BITS Pilani cutoff`, `BITSAT score predictor`).
- Extend the FAQ JSON-LD with two BITSAT questions (`How does the BITSAT
  predictor work?`, `Which years of BITSAT data do you cover?`).
- The `breadcrumbJsonLd` and `collegeListJsonLd` stay as-is (single tool URL).

## Step F — Validate before ship

1. Run scraper + ingest in dry-run; confirm 352 rows.
2. Run with `--apply` against production Mongo.
3. Spot-check: score 290 modern, all campuses, no programme filter.
   Expected top results: Goa/Hyd CSE = target, Pilani CSE = reach.
4. Spot-check legacy regime: score 350, Pilani — should surface 2017–2021
   data only.
5. Confirm in production that hitting `/college-predictor` with a BITSAT
   score parameter doesn't break the JoSAA form.

---

## Optional follow-ups (NOT in this scope)

- Iteration-wise data: the source only publishes final cutoffs. Third-party
  sites have partial Iter-1 data for 2024. Skip until BITS exposes more.
- BITSAT mock-score → predicted-real-score conversion: requires its own
  calibration table; out of scope.
- "Compare BITSAT vs JEE Main outcomes" widget: only useful once we have a
  way to map between the two scales, which isn't trivial.
