# features/notes

Handwritten chapter notes — image-based study material per chapter with a
Crucible practice-rail sidebar.

## Routes

| Route | Page file |
|---|---|
| `/handwritten-notes` | `app/handwritten-notes/page.tsx` — chapter index |
| `/handwritten-notes/[chapter]` | `app/handwritten-notes/[chapter]/page.tsx` — single chapter view with notes + crucible rail |

API: `app/api/handwritten-notes/[...path]/route.ts` proxies image fetches to R2.

## Layout

```
features/notes/
├── components/
│   ├── HandwrittenNotesClient.tsx  ← chapter-index UI
│   ├── ChapterHero.tsx
│   ├── ChapterNotesGrid.tsx        ← image grid
│   ├── ChapterReadingShell.tsx     ← reading-mode shell
│   ├── ChapterToolCard.tsx
│   ├── ChapterTopicTOC.tsx
│   ├── CrucibleHeroRail.tsx        ← side rail with Crucible questions
│   ├── NextChapterCard.tsx
│   ├── SideBySidePractice.tsx      ← split-screen notes + practice
│   └── ViewTracker.tsx             ← chapter-view counter (analytics)
├── data/
│   ├── chapterMetadata.ts          ← per-chapter metadata
│   ├── handwrittenNotesData.ts     ← DB-backed note metadata fetcher
│   ├── handwrittenNotes.data.ts    ← static chapter data
│   └── toolCardConfig.ts           ← side-tool config per chapter
├── lib/
│   └── chapterStats.server.ts      ← server-only chapter stats aggregation
├── index.ts
└── README.md
```

## Cross-feature dependencies

`CrucibleHeroRail` imports from `@/app/the-crucible/components/CrucibleBrand` and
`CrucibleQuestionCarousel`. Those will move to `features/crucible/` in Phase 4.11
and the imports will be updated then.
