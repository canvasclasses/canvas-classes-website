# features/college-predictor

JEE college admission predictor. Takes percentile/rank + category/quota and
returns likely-eligible colleges from the cutoff dataset.

## Routes

| Route | Page file |
|---|---|
| `/college-predictor` | `app/college-predictor/page.tsx` — main predictor UI |
| `/college-predictor/[slug]` | SEO landing pages (e.g. `nit-jee-mains-2024`) driven by `data/landingConfig.ts` |
| `/college-predictor/college/[slug]` | Per-college deep-dive page |

API: `app/api/v2/college-predictor/*` reads from this feature's `lib/`.

## Layout

```
features/college-predictor/
├── components/
│   ├── PredictorClient.tsx     ← interactive form
│   ├── TopColleges.tsx         ← top-tier college list
│   ├── TopCollegeCard.tsx
│   └── CutoffTrendChart.tsx    ← per-college trend visualization
├── data/
│   ├── topCollegesData.ts      ← TOP_COLLEGES catalog
│   ├── topCollegesImages.ts    ← image URL map
│   └── landingConfig.ts        ← LANDING_CONFIGS for SEO routes
├── lib/
│   ├── predictor.ts            ← main matching logic
│   ├── deepDive.ts             ← per-college aggregations
│   ├── percentileToRank.ts     ← NTA percentile -> AIR conversion
│   └── regions.ts              ← state/zone groupings
├── index.ts
└── README.md
```
