# @canvas/ui

Cross-app visual components shared between `apps/student` (today) and
`apps/admin` (Phase 5). Starts deliberately small — only components verified
to be used by both apps live here. Feature-local components stay in their
app's `components/` folder.

## Layout

| File | What lives here |
|---|---|
| `MathRenderer.tsx` | KaTeX + DOMPurify LaTeX renderer (12 importers across student questions + admin question editor) |

That's it for now. The package will grow as Phase 5 reveals additional shared
primitives.

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
