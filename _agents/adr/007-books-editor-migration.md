# ADR-007: Live Books editor moves to apps/admin via a shared renderer package

**Status:** Accepted
**Date:** 2026-05-20
**Tags:** admin, books, monorepo, package-extraction

## Context

After the Phase 5 admin split (ADR-002), six operator dashboards lived on
`admin.canvasclasses.in`, but the Live Books editor (~4,345 LOC across 27
files at `apps/student/features/books/components/editor/`) was left
behind in the student app and **not mounted by any route** — the admin
home rendered a "migration pending" placeholder for `/books`.

Two characteristics shaped the migration:

1. The editor's outbound surface is small. Its only non-`@canvas/*`
   external dependency is `MoleculeViewer`, used by `Molecule2DEditor`
   for in-form structure previews. `MoleculeViewer` itself depends on
   `openchemlib`.
2. The editor's split-view preview pane reuses the **same renderer** the
   student reader uses (`features/books/components/renderer/`, 85 files
   including 56 simulation components). The reader-side `BookReader`
   cannot give up the renderer, so the renderer can't simply move to
   admin — it has to be **shared**.

A third wrinkle: one of the simulator IDs (`atomic-models`) was wired in
the renderer registry as `import('@/app/physical-chemistry-hub/AtomicModels')`
— a 555-line app-route-local component pulling in app-local UI helpers
(`@/components/ui/glowing-effect`). Cross-app `@/` aliases don't resolve
from a `packages/*` location, and moving `AtomicModels` into the package
would deepen the package's surface for a single sim.

## Decision

We extracted the **renderer** into a new `@canvas/book-renderer` package
and moved the **editor** into `apps/admin/features/admin/books-editor/`.
The orphan simulator (`atomic-models`) is resolved via a
context-injection pattern so it stays in the student app where it
belongs.

### Concretely

1. **`MoleculeViewer.tsx`** → `@canvas/ui/MoleculeViewer.tsx`
   - `openchemlib` declared as a dependency of `@canvas/ui`.
   - Three callers (`Molecule2DEditor`, `Molecule2DBlockRenderer`,
     `ConversionGame`, `ArenaPreview`) updated to import from
     `@canvas/ui/MoleculeViewer`.

2. **Renderer tree** (`PageRenderer`, `BlockRenderer`, 20 block
   renderers, 56 simulators, `_shared` utils) → `packages/book-renderer/`.
   - Package exposes `PageRenderer`, `BlockRenderer`, and
     `ExtraSimulatorsProvider`.
   - Both apps consume via `@canvas/book-renderer/PageRenderer`.
   - Internal package `styled-jsx.d.ts` declaration so the package's
     standalone `tsc --noEmit` doesn't false-flag scoped styles.

3. **`atomic-models` simulator** stays at
   `apps/student/app/physical-chemistry-hub/AtomicModels.tsx`. The
   renderer's `SimulationBlockRenderer` reads an
   `ExtraSimulatorsContext`, and the student-side `BookReader` wraps
   `<PageRenderer />` in `<ExtraSimulatorsProvider value={{ 'atomic-models': AtomicModels }}>`.
   Admin's preview pane doesn't wrap, so `atomic-models` resolves to the
   in-package "Simulator not found" fallback inside the editor preview
   — an acceptable degradation since the operator can verify on the
   student site.

4. **Editor tree** → `apps/admin/features/admin/books-editor/`. Mounted
   at `apps/admin/app/books/page.tsx` (a thin Suspense wrapper over
   `BookWorkspace`).

5. **`/api/v2/books/assets/upload`** route moved from
   `apps/student/app/api/v2/` → `apps/admin/app/api/v2/`. Auth import
   switched from `@/lib/bookAuth` → `@/lib/adminAuth` to match other
   admin routes.

6. The admin home (`apps/admin/app/page.tsx`) lost the `disabled` prop
   on the Books card; its copy now describes the live editor.

## Consequences

### Positive

- **Admin home is complete.** All seven content panels (Crucible,
  Flashcards, Books, Blog, Taxonomy, Career Explorer, plus the OCH dev
  tool) are now live.
- **Zero student-side regression risk in the data path.** All write
  APIs already lived in `apps/admin/app/api/v2/books/**` before this
  migration; the only API still on the student app was the upload
  route, now also moved.
- **Single source of truth for the renderer.** The split-pane preview
  in the editor renders pixel-identically to the student reader because
  it imports the same components.
- **Package-boundary clean.** The admin app does not import from
  `apps/student/`. The cross-cutting renderer + MoleculeViewer + book
  utils all sit in `packages/*`.

### Negative / cost

- **openchemlib ships to admin too** (~1.6 MB). Acceptable — admin is
  an operator-only console and the bundle is fine.
- **`atomic-models` doesn't render in the admin preview pane.** It
  shows the generic "Simulator not found" placeholder. The operator can
  visually verify the page on the student site instead. If this ever
  becomes a hot path, promoting `AtomicModels` to `@canvas/ui` (or its
  own package) is the next step.
- **One more package to maintain.** `@canvas/book-renderer` joins the
  existing five (core, data, persona, services, ui).

### Risks watched

- **Bundle drift.** Renderer block files include scoped `<style jsx>`
  blocks. Verified the package's standalone `tsc --noEmit` passes; both
  app builds pick up styled-jsx types via the Next plugin.
- **Hinglish localStorage key sharing.** The renderer's preview reads
  `localStorage.canvas_hinglish_mode`. Admin now lives on a different
  origin (`admin.canvasclasses.in`), so admin and student have
  independent storage. This is the correct behavior — admin preview
  defaults to EN unless the operator toggles HI; the toggle no longer
  bleeds into the student site by coincidence of shared origin.

## Out of scope

- **`Molecule3DBlockRenderer`** remains a textual placeholder ("3D
  interactive view"). No three.js / 3Dmol.js integration is part of
  this migration. The Molecule3DEditor was already a form-only stub.
- **Promoting more student-app simulators** (PhysChemHub's
  `AtomicModels`, `GasLaws`) into the shared package. Deferred — only
  do this if/when a second simulator needs to be shared with the editor.
- **Removing the legacy `PageRenderer` re-export** from
  `apps/student/features/books/index.ts`. Kept as a forward bridge for
  any existing barrel caller; can be deleted in a future cleanup.
