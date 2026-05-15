# features/career-explorer

RIASEC-flavoured career discovery questionnaire that scores student responses
into matched career paths.

## Routes

| Route | Page file |
|---|---|
| `/career-explorer` | `app/career-explorer/page.tsx` → `LandingClient` |
| `/career-explorer/browse` | `app/career-explorer/browse/page.tsx` → `BrowseClient` |
| `/career-explorer/careers/[slug]` | `app/career-explorer/careers/[slug]/page.tsx` (inline) |
| `/career-explorer/questionnaire/[profileId]` | `QuestionnaireClient` |
| `/career-explorer/results/[profileId]` | `ResultsClient` |
| `/career-explorer/vision/[profileId]` | `VisionClient` |

API routes are at `app/api/v2/career-explorer/*` and consume this feature's
`lib/scoring`, `lib/applyResponse`, `lib/facets`.

## Layout

```
features/career-explorer/
├── components/
│   ├── LandingClient.tsx
│   ├── BrowseClient.tsx
│   ├── QuestionnaireClient.tsx
│   ├── ResultsClient.tsx
│   └── VisionClient.tsx
├── lib/
│   ├── scoring.ts          ← match-score computation
│   ├── applyResponse.ts    ← update profile from a single response
│   ├── facets.ts           ← RIASEC dimensions + weights
│   ├── seedCareers.ts      ← static career catalog seed
│   ├── seedCareerTags.ts   ← tag taxonomy seed
│   └── seedQuestions.ts    ← questionnaire questions seed
├── types.ts                ← shared types (Browse, Profile shapes)
├── index.ts
└── README.md
```
