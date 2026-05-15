# features/flashcards

Chemistry flashcards study UI with SRS (spaced repetition system) backing.

## Routes

| Route | File |
|---|---|
| `/chemistry-flashcards` | `app/chemistry-flashcards/page.tsx` — chapter index |
| `/chemistry-flashcards/[chapter]` | `app/chemistry-flashcards/[chapter]/page.tsx` — study session |

## Layout

```
features/flashcards/
├── components/
│   ├── FlashcardsClient.tsx          ← chapter-index UI
│   ├── FlashcardsChapterClient.tsx   ← per-chapter study session
│   ├── StudyHeatmap.tsx              ← daily-streak heatmap
│   ├── SyncStatusBanner.tsx          ← offline/sync banner
│   └── RegisterServiceWorker.tsx     ← PWA service-worker registration
├── hooks/
│   ├── useFlashcardMeta.ts           ← per-card metadata
│   └── useFlashcardSettings.ts       ← user settings (cards/day, etc.)
├── lib/
│   ├── flashcardsData.ts             ← deck + card data accessors
│   ├── spacedRepetition.ts           ← SRS scheduling math + quality ratings
│   ├── flashcardTaxonomy.ts          ← chapter <-> deck mapping
│   └── flashcardMarkdown.tsx         ← alt-text/image-width helpers for markdown
├── index.ts
└── README.md
```

## Cross-feature dependencies

This feature imports from outside `features/flashcards/` for things that aren't
flashcard-specific:

- `@/app/hooks/useCardProgress` — generic card progress hook used by other quizzes too
- `@/app/hooks/useCardMetadata` — generic card metadata
- `@/app/utils/progressSync` — offline-safe progress write queue (used by salt-analysis too)
- `@/app/utils/supabase/client` — Supabase wiring
- `@canvas/data` — Flashcard + FlashcardProgress Mongoose models

The SRS math in `lib/spacedRepetition.ts` is **shared** with other features
(salt-analysis quiz, assertion-reason). Those importers reach in via
`@/features/flashcards/lib/spacedRepetition` — acceptable today; if a third
non-flashcard consumer emerges, promote SRS to a shared package or to
`apps/student/lib/`.
