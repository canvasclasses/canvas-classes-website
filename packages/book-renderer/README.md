# @canvas/book-renderer

Reader-side renderer for the Live Books platform. Renders a paginated book page
(text, LaTeX, images, simulators, interactive blocks) given a content tree.
Consumed by both the student book reader and the admin books editor's split-pane
preview, so the two surfaces stay pixel-identical.

## Why this exists

Pre-ADR-007, the renderer lived inside the student app at
`apps/student/features/books/components/renderer/`. When the books editor moved
to the admin app, the editor's preview pane needed the same renderer the
student reader uses — so the renderer was extracted here.

Two callers consume this package, never anything else:

- `apps/student/features/books/components/reader/BookReader.tsx`
- `apps/admin/features/admin/books-editor/BookWorkspace.tsx` (preview pane)

## Layout

| Slot | What lives here |
|---|---|
| `PageRenderer.tsx` | Renders one whole book page. Wraps `BlockRenderer`. |
| `BlockRenderer.tsx` | Dispatches each content block to the right block renderer. Text/Heading/Section are always bundled; everything else is `React.lazy`. |
| `blocks/` | 22 block-type renderers: Animation, AudioNote, Callout, ClassifyExercise, ComparisonCard, CuriosityPrompt, Heading, Image, InlineQuiz, InteractiveImage, Latex, Molecule2D, Molecule3D, PracticeLink, ReasoningPrompt, Section, Simulation, Table, Text, Timeline, Video, WorkedExample. |
| `blocks/simulations/` | Simulation components consumed by `SimulationBlockRenderer`. |
| `simulators-context.tsx` | `ExtraSimulatorsProvider` — lets an app inject route-local simulators into the renderer at runtime. Used today by the student app to register `atomic-models` (which lives at `apps/student/app/physical-chemistry-hub/AtomicModels.tsx`) without book-renderer having to know about app-route-local code. |
| `index.ts` | Barrel — re-exports `PageRenderer`, `BlockRenderer`, and the simulators context for `from '@canvas/book-renderer'`. |

## Public surface

**Subpath imports are the primary pattern** — same as the other `@canvas/*` packages:

```ts
import PageRenderer from '@canvas/book-renderer/PageRenderer';
import BlockRenderer from '@canvas/book-renderer/BlockRenderer';
import { ExtraSimulatorsProvider } from '@canvas/book-renderer/simulators-context';
```

The `exports` field in `package.json` enumerates exactly these three subpaths
(plus the barrel `.`) — same shape as `@canvas/ui`. Block renderers under
`blocks/` and simulators under `blocks/simulations/` are intentionally NOT
exported: they are internal to `BlockRenderer.tsx`'s lazy-load dispatch table,
not callable from outside the package.

The barrel `index.ts` mirrors the same names for the rare
`from '@canvas/book-renderer'` import.

## Dependencies

Every runtime library the renderer imports is declared here directly (no
hoisting from consumer apps — see [ADR-009](../../_agents/adr/009-package-shape-and-build-config.md)):

| Dep | Used by | Notes |
|---|---|---|
| `katex` + `rehype-katex` + `remark-math` | `LatexBlockRenderer`, math inside text blocks | KaTeX server-render + Markdown integration |
| `remark-gfm`, `remark-breaks`, `rehype-raw` | Markdown blocks | GFM tables, single-newline breaks, raw HTML pass-through |
| `lottie-react` | `AnimationBlockRenderer` | Dynamically imported inside `useEffect`. **Must stay declared here** — admin app's Vercel build can't resolve via hoisted student app deps. |
| `@canvas/data` | Block + book type definitions | |
| `@canvas/ui` | `MathRenderer`, `MoleculeViewer` | |

Peer-installed by the consuming app: `react`, `react-dom`, `react-markdown`,
`lucide-react`, `next` — these versions are pinned by the apps, not this
package.

## Build-config requirements

Any app that imports this package must:

1. List `'@canvas/book-renderer'` in `next.config.ts` `transpilePackages`.
2. Add `@source "../../../packages/book-renderer";` to its `app/globals.css`
   (Tailwind v4 doesn't scan outside the app folder by default — classes used
   inside this package get silently dropped from the bundle without this).

Both requirements are satisfied today by `apps/student/` and `apps/admin/`.
See [ADR-009](../../_agents/adr/009-package-shape-and-build-config.md) for the
full set of build-config conventions and the outages that motivated them.

## Package boundaries

- Imports `@canvas/data/*` (block + book types).
- Imports `@canvas/ui/*` (`MathRenderer`, `MoleculeViewer`).
- Imports third-party renderers (`react-markdown`, `katex`, `lottie-react`).
- Never imports `apps/*`.
- Never uses the `@/` alias.
- Provides the `ExtraSimulatorsContext` seam for app-route-local simulators
  rather than reaching across the boundary itself.
