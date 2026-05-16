# features/crucible

The Crucible — JEE/NEET chemistry practice platform + admin question editor.
Spans both student-facing pages (`/the-crucible/*`) and admin pages (`/crucible/*`).

## Routes

| Route | Surface |
|---|---|
| `/the-crucible` | Student practice landing |
| `/the-crucible/[chapterId]` | Chapter-level practice |
| `/the-crucible/q/[slug]` | Single-question detail page |
| `/the-crucible/dashboard` | Student dashboard |
| `/crucible` | Admin landing |
| `/crucible/admin` | Main question admin |
| `/crucible/admin/blog` | Blog post admin |
| `/crucible/admin/books` | Book editor admin |
| `/crucible/admin/flashcards` | Flashcards admin |
| `/crucible/admin/career-explorer` | Career-explorer seed admin |
| `/crucible/admin/taxonomy` | Taxonomy editor admin |
| `/crucible/admin/preview` | Question preview |
| `/crucible/dashboard` | Admin user dashboard |

API routes (`app/api/v2/*`) for questions, taxonomy, mock-tests, test-results,
user/progress, etc. stay at the Next.js routing level and are unaffected by
this move.

## Layout

```
features/crucible/
├── components/
│   ├── BrowseView.tsx, TestView.tsx, CrucibleWizard.tsx, ...   ← student
│   ├── guided-practice/   ← AdaptiveSession, AdaptiveQuestionCard, etc.
│   ├── admin/             ← question admin UI (QuestionAdmin, AnalyticsDashboard,
│   │                        BulkImportModal, FlagModal, RoleManagement,
│   │                        QuestionPreviewPane, ExportDashboard, types,
│   │                        BlogAdminClient, EnhancedFlashcardAdmin, etc.)
│   ├── admin/blog/        ← BlogEditor, IdeaForm, SourcesPanel, BlogImageDrop
│   └── dashboard/         ← DashboardClient, StatsCard, RecentTests, ChapterBreakdown
├── lib/
│   ├── adaptiveEngine.ts, chapterCounts.ts, ncertTopicOrder.ts
│   └── dashboard/calculateAnalytics.ts
├── server-actions/
│   ├── the-crucible.ts    ← student-facing server actions
│   └── progress.ts        ← user-progress server actions
├── hooks/
│   └── admin/             ← usePermissions, useAdminKeyNav, useAdminFilters, etc.
├── types.ts                ← Crucible legacy/internal types
├── index.ts
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

## Cross-feature dependencies

Outbound edges (Crucible importing from other features). All are accepted
single-consumer edges — if a second non-{flashcards} consumer of these
helpers appears, promote them to `@canvas/data` or `apps/student/lib/`.

| File | Imports from | Symbols |
|---|---|---|
| `components/admin/EnhancedFlashcardAdmin.tsx` | `@/features/flashcards/lib/flashcardMarkdown` | `flashcardMarkdownComponents` |
| `components/admin/EnhancedFlashcardAdmin.tsx` | `@/features/flashcards/lib/flashcardTaxonomy` | `getCategoryNames`, `getFlashcardChaptersByCategory` |
| `components/admin/FlashcardImageScaleControls.tsx` | `@/features/flashcards/lib/flashcardMarkdown` | `findImages`, `setImageWidthInText` |

## Phase 5 prep

Admin code is namespaced under `features/crucible/components/admin/` +
`features/crucible/hooks/admin/`. When Phase 5 splits admin into its own
Vercel app (`apps/admin/`), these directories migrate as a unit.
