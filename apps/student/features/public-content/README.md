# features/public-content

SEO-driven content routes — JEE/NEET PYQs, lectures, quick recap, top-50
concepts, sample papers, etc. Most routes are static-data-driven listing pages
with feature-local data files.

## Routes (14 routes)

| Route | Data |
|---|---|
| `/2-minute-chemistry` | `data/twoMinData.ts` |
| `/assertion-reason` | `data/assertionReasonData.ts` |
| ~~`/bitsat-chemistry-revision`~~ | archived 2026-06 — see `app/_bitsat-2026-archive/` |
| `/chemistry-questions` | (inline) |
| `/detailed-lectures` | `data/lecturesData.ts` |
| `/download-ncert-books` | (uses `@/features/books/data/ncertBooksData`) |
| `/jee-main-pyqs/chemistry/[chapter]/[slug]` | `data/jee-main-pyqs/data.ts` + chapter JSONs |
| ~~`/jee-pyqs/[chapter]`~~ | removed 2026-05-25 — see The Crucible question bank |
| `/ncert-solutions` | (uses `@/features/books/data/ncertData`) |
| `/neet-crash-course` | `data/neetCrashCourseData.ts` |
| `/one-shot-lectures` | `data/quickRecapData.ts` |
| `/quick-recap` | `data/quickRecapData.ts` |
| `/quiz/chemistry/[slug]` | `data/quizzes/*` |
| `/top-50-concepts` | `data/top50Data.ts` |

## Layout

```
features/public-content/
├── components/
│   └── QuestionMarkdown.tsx   ← used by jee-main-pyqs single-question pages
├── data/
│   ├── assertionReasonData.ts
│   ├── lecturesData.ts
│   ├── neetCrashCourseData.ts
│   ├── quickRecapData.ts
│   ├── revisionData.ts
│   ├── samplePapersData.ts
│   ├── top50Data.ts
│   ├── twoMinData.ts
│   ├── jee-main-pyqs/
│   │   ├── data.ts
│   │   ├── types.ts
│   │   └── data/<chapter>.json
│   └── quizzes/
│       ├── index.ts
│       ├── types.ts
│       └── <quiz-slug>.data.ts
├── hooks/
│   ├── useAssertionProgress.ts
│   ├── useCardMetadata.ts        ← generic card metadata (also used by flashcards)
│   └── useCardProgress.ts        ← generic card progress (also used by flashcards)
└── README.md
```

## Inline route .tsx files

Per the same pattern as `features/simulations/`, route-local `.tsx` files
(`AssertionReasonClient.tsx`, `Top50CardsView.tsx`, etc.) stay inline at
`app/<route>/` to keep this phase tractable. Future cleanup can lift them.

## Cross-feature

`useCardMetadata` + `useCardProgress` are imported by `@/features/flashcards/` —
their generic name betrays that they aren't strictly public-content. If a third
non-public-content consumer emerges, promote them to `apps/student/hooks/`.
