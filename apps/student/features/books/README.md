# features/books

Chapter-level digital book reader for class 9-12 chemistry + ncert/cbse SEO
landing pages + admin book editor.

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

Admin editor routes (`app/crucible/admin/*` book sections) consume this
feature's `components/editor/*`.

API: `app/api/v2/books/*` for the reader; `app/api/v2/admin/books/*` for the
editor. Both use this feature's lib + data.

## Layout

```
features/books/
├── components/
│   ├── BookTableOfContents.tsx
│   ├── bookDesign.tsx              ← design tokens (book-specific)
│   ├── GradeLandingPage.tsx        ← grade hub UI
│   ├── LiveBooksComingSoon.tsx
│   ├── editor/                     ← admin book editor (8 files: BookSidebar, BookWorkspace, blocks/, etc.)
│   ├── reader/                     ← student book reader (BookReader, FreeGate)
│   └── renderer/                   ← block renderer (PageRenderer, BlockRenderer, blocks/, blocks/simulations/)
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
│   ├── bookPageSeo.ts              ← SEO/metadata builder for book pages
│   └── utils.ts                    ← reading-time, content-type computation
├── index.ts
└── README.md
```

## What's elsewhere

- Book/BookPage Mongoose models live in `@canvas/data/models/`.
- `app/api/v2/books/*` route handlers stay at the Next.js route level.
- Cross-app components like `MathRenderer` are in `@canvas/ui`.

## Cross-feature dependencies

Outbound edges (books importing from other features). Single-consumer edges —
if a second non-{simulations} consumer of `MoleculeViewer` appears, promote it
to `apps/student/components/` or `@canvas/ui/`.

| File | Imports from | Symbol |
|---|---|---|
| `components/renderer/blocks/Molecule2DBlockRenderer.tsx` | `@/features/simulations/components/organic-wizard/MoleculeViewer` | `MoleculeViewer` (default) |
| `components/editor/blocks/Molecule2DEditor.tsx` | `@/features/simulations/components/organic-wizard/MoleculeViewer` | `MoleculeViewer` (default) |
