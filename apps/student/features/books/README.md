# features/books

Chapter-level digital book reader for class 9-12 chemistry + ncert/cbse SEO
landing pages.

## Routes

| Route | Purpose |
|---|---|
| `/books/[bookSlug]/[pageSlug]` | Canonical book reader |
| `/live-books` | Live-books coming-soon |
| `/class-9/[bookSlug]/[pageSlug]` | Class-9 specific path (301 redirects feed here) |
| `/class-10/`, `/class-11/`, `/class-12/` | Grade landing + subpages |
| `/cbse-class-10/`, `/cbse-class-11/`, `/cbse-class-12/` | CBSE-tagged SEO landing pages |
| `/ncert-solutions/` | NCERT solutions hub |
| `/download-ncert-books/` | NCERT PDF download hub |

The admin book editor lives in `apps/admin/features/admin/books-editor/` and is
mounted at `admin.canvasclasses.in/books`. Its write APIs are under
`apps/admin/app/api/v2/books/*`.

Reader-side public APIs (bookmarks, progress, stats, user-state) live at
`apps/student/app/api/v2/books/*`.

## Layout

```
features/books/
├── components/
│   ├── BookTableOfContents.tsx
│   ├── bookDesign.tsx              ← design tokens (book-specific)
│   ├── GradeLandingPage.tsx        ← grade hub UI
│   ├── LiveBooksComingSoon.tsx
│   └── reader/                     ← student book reader (BookReader, FreeGate)
├── data/
│   ├── blockData.ts                ← static block-type configuration
│   ├── ncertBooksData.ts           ← NCERT book metadata
│   ├── ncertData.ts                ← NCERT mapping data
│   └── ncertMapping.ts             ← chapter <-> NCERT mapping
├── hooks/
│   ├── useBookBookmarks.ts
│   ├── useBookProgress.ts
│   ├── useBookStats.ts
│   └── useBookUserState.ts
├── lib/
│   └── bookPageSeo.ts              ← SEO/metadata builder for book pages
├── index.ts
└── README.md
```

## What's elsewhere

- **Reader-side block renderer** lives in `@canvas/book-renderer` (also reused
  by the admin editor's split-view preview pane).
- **`MoleculeViewer`** is in `@canvas/ui/MoleculeViewer` (shared with the
  organic-wizard simulator).
- **Book / BookPage Mongoose models** live in `@canvas/data/models/`.
- **Block utility helpers** (`flattenBlocks`, `computeReadingTime`, etc.) live
  in `@canvas/data/books/utils`.
- **`AtomicModels` simulator** still lives at
  `apps/student/app/physical-chemistry-hub/AtomicModels.tsx` because it depends
  on app-local UI bits. `BookReader` injects it into the renderer via
  `ExtraSimulatorsProvider` from `@canvas/book-renderer/simulators-context` so
  any book page referencing `simulation_id: 'atomic-models'` still resolves.
