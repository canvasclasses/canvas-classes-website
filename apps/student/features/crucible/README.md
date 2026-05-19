# features/crucible

The student-facing Crucible — JEE/NEET chemistry practice platform that
serves `/the-crucible/*`.

The admin side of Crucible — question editor, mock-tests admin, taxonomy
admin, blog admin, career-explorer admin, flashcards admin — lives in a
separate app at [`apps/admin/`](../../../admin/) and deploys to
`admin.canvasclasses.in`. It moved out in Phase 5 (commits c6ad600
through 96994fa on the `code-refactor` branch).

## Routes

| Route | Surface |
|---|---|
| `/the-crucible` | Student practice landing |
| `/the-crucible/[chapterId]` | Chapter-level practice |
| `/the-crucible/q/[slug]` | Single-question detail page |
| `/the-crucible/dashboard` | Student dashboard |

## API routes that stay in `apps/student/app/api/v2/*`

Public/student-facing data layer:

- `user/*` — progress, stats, recommendations, session-response, etc.
- `test-results/route.ts`
- `flashcards/*` — public flashcard reads + student progress
- `questions/route.ts` + `questions/[id]/route.ts` + `questions/[id]/flag/route.ts` + `questions/[id]/stats/route.ts`
- `questions/chemical-bonding-batch/route.ts`
- `books/{progress,user-state,bookmarks,stats,assets/upload}/route.ts` — student-attribution reads/writes
- `chapters/route.ts`, `taxonomy/load/route.ts`, `validate/latex/route.ts`
- `college-predictor/*` (public)
- `notes-quicktest/[chapterId]/route.ts`
- `career-explorer/{careers,careers/[slug],questions}/route.ts` — public GET halves only; admin write methods live in `apps/admin/`
- `career-explorer/profiles/*` — all student-attribution
- `mock-tests/route.ts` + `mock-tests/[id]/route.ts` — public GET halves only; admin write methods live in `apps/admin/`
- `export/ppt/route.ts`, `assets/[id]/route.ts`

API routes that MOVED to `apps/admin/`: ai/*, taxonomy/save, books/* admin
methods, career-explorer admin write methods, mock-tests admin write
methods, questions admin sub-routes (reclassify, flag/[flagIdx], flagged),
admin/* namespace (permissions, roles, revalidate), debug/*, blog/*.

## Layout

```
features/crucible/
├── components/
│   ├── BrowseView.tsx, TestView.tsx, CrucibleWizard.tsx, ...   ← student
│   ├── guided-practice/   ← AdaptiveSession, AdaptiveQuestionCard, etc.
│   └── dashboard/         ← DashboardClient, StatsCard, RecentTests, ChapterBreakdown
├── lib/
│   ├── adaptiveEngine.ts, chapterCounts.ts, ncertTopicOrder.ts
│   └── dashboard/calculateAnalytics.ts
├── server-actions/
│   ├── the-crucible.ts    ← student-facing server actions
│   └── progress.ts        ← user-progress server actions (admin variants
│                            extracted to apps/admin/lib/serverActions/)
├── types.ts                ← Crucible legacy/internal types
├── index.ts                ← cross-feature exports (CrucibleBrand,
│                              CrucibleQuestionCarousel, formatExamLabel)
└── README.md
```

## Two Question types

The project has TWO `Question` interfaces:
- `features/crucible/types.ts` — the camelCase/simplified shape used by older
  client components (Crucible carousel, ChapterPracticePage).
- `features/crucible/components/types.ts` — the V2 schema shape (`display_id`,
  `question_text.markdown`, `metadata.*`) used by Browse, TestView,
  QuestionDetail.

`server-actions/the-crucible.ts` returns the V2 shape (imports from
`../components/types`). Pre-existing parallel-shape situation; consolidation
is a follow-up task.

## Cross-feature consumer

`features/notes/components/CrucibleHeroRail.tsx` imports `CrucibleBrand` and
`CrucibleQuestionCarousel` from this feature. That's the only cross-feature
consumer — acceptable. If a third feature consumes Crucible components, the
shared bits get promoted to `apps/student/components/` or `@canvas/ui`.
