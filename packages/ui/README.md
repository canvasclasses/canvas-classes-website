# @canvas/ui

Cross-app visual components shared between `apps/student` (today) and
`apps/admin` (Phase 5). Starts deliberately small — only components verified
to be used by both apps live here. Feature-local components stay in their
app's `components/` folder.

## Layout

| File | What lives here |
|---|---|
| `MathRenderer.tsx` | KaTeX + DOMPurify LaTeX renderer (12 importers across student questions + admin question editor) |
| `MoleculeViewer.tsx` | 2D molecule renderer (openchemlib) — organic-wizard + Live Books |
| `flashcardMarkdown.tsx` | Flashcard markdown component dictionary + image helpers |
| `AudioRecorder.tsx` | Mic-capture + R2-upload widget for question audio solutions (admin Crucible editor, mock-tests admin, organic-chemistry-hub admin) |
| `SVGDropZone.tsx` | Drag-drop image/SVG → R2 upload, inserts a markdown link (same three admin surfaces) |
| `VideoDropZone.tsx` | Drag-drop MP4/WebM → R2 upload for solution videos (admin Crucible editor, mock-tests admin) |

The three upload widgets are app-agnostic: they only use `react` +
`lucide-react` and POST to the same-origin `/api/v2/assets/upload` route, which
both apps host. They send the question id under the canonical `questionId` form
field (the upload service reads camelCase — see CLAUDE.md §4.5 / the assets
service). Don't reintroduce a `question_id` (snake_case) form field.

## What's intentionally NOT here

- **Tailwind theme / design tokens** — deferred to Phase 5. Today the tokens
  live in `apps/student/app/globals.css`. When the admin app is scaffolded
  in Phase 5, extract a shared `theme.css` then.
- **`WaveformAudioPlayer`, `WatermarkOverlay`, `ChemicalStructure`** — listed
  in the original Phase 3 plan but the audit showed `WaveformAudioPlayer` is
  student-only (2 importers in `app/the-crucible/`), and `WatermarkOverlay` +
  `ChemicalStructure` are dead code with zero importers. Don't speculatively
  promote student-only or unused code into a shared package.

## Public surface

Subpath imports are the primary pattern:

```tsx
import MathRenderer from '@canvas/ui/MathRenderer';
```

The barrel works too: `import { MathRenderer } from '@canvas/ui'`. Either
form is fine; subpath is preferred for greppability.

## Rules

- **No `@/` alias inside this package.** Components must be self-contained
  or import from `@canvas/data` / `@canvas/core` / `@canvas/persona`.
- **No imports from `apps/*`.** Packages must not know which app consumes them.
- **`react` + `react-dom` are peer deps.** Host app owns the version.
- Consumed as TS source — Next.js compiles via `transpilePackages: ['@canvas/ui']`.
