# Math Live Book — Interactive Tools (Step-Through Solver + Concept-Games)

> **Status:** Pilot SHIPPED 2026-07-25 (unpublished). The `step_solver` block + the
> `balance-scale-equations` concept-game are live in the renderer and demonstrated on
> Class 9 Math Ch.2 (page `play-then-solve-linear-equations`). This doc is the design +
> evidence + roadmap for turning the Live Book from a *reading task* into *interactive,
> step-by-step problem-solving* for math-averse students.

## Why (the evidence)

Math-averse Class 9 students won't start a paragraph and won't sit through a long video —
there's no motivation to *begin*. The fix isn't more explanation; it's a specific shape:

| Pillar | Finding | In our tools |
|---|---|---|
| **Step-based tutoring** — VanLehn 2011 | Interacting at *every step* ≈ human tutoring (d≈0.76); answer-only tutoring only d≈0.3 | `step_solver` gates each step on a student action |
| **Segmentation** — Mayer | Learner-paced click-to-advance cuts load; best when material is hard + learner novice/anxious | Click-through one step at a time |
| **Generation effect** (~d 0.40) | Actively generating > passive reading ("doubles recall") | Every step is a choice/answer, not a read |
| **Game-based learning** — Tokac 2019 (33 studies) | d≈0.63 math achievement; gamified play lowers math anxiety | Concept-games as the low-floor entry |
| **Self-explanation · productive failure · concreteness fading · faded worked examples · kill-the-clock** | Well-replicated | "Why?" toggles · predict-before-reveal · balance→symbols · now-you-try · no timer, free mistakes |

Builds on the 10-principle synthesis in [`MATH_LIVEBOOK_PLAN.md`](MATH_LIVEBOOK_PLAN.md) §3.

## Tool 1 — `step_solver` block (the centerpiece)

A problem broken into ordered steps the student clicks through. A load-bearing step **gates**
on a micro-interaction (`pick_op` / `mcq` / `fill_blank`) — the student *produces* the move,
then the resulting line reveals. Solved lines settle into a dimmed solution trail; each step has
an optional tap-to-reveal **"Why?"** (self-explanation); it ends with a faded **"Now you try"**
(solo problem, reveal-on-tap answer + working). Calm reading-surface palette, **no timer**,
non-punitive feedback.

- **Type/schema:** `StepSolverBlock` in `packages/data/types/books.ts`; Zod in `packages/data/books/schemas.ts` (both union arrays).
- **Renderer:** `packages/book-renderer/blocks/StepSolverRenderer.tsx` — forks `guided_reveal`'s step machine + `InlineMarkdown` (KaTeX). Dispatched in `BlockRenderer.tsx`.
- **Authoring:** currently **script-authored** (data-driven block). Admin-UI editor + `BLOCK_LABELS`/`ICONS`/`AddBlockMenu`/`defaultBlock` wiring is DEFERRED (in the editor block-list it shows as a bare `(step_solver)` — cosmetic only; it renders fully in preview + reader).

## Tool 2 — Concept-games (must be DIRECT MANIPULATION, not buttons)

Low-floor games that teach one idea through play *before* symbols. **Founder rule (2026-07-25, after rejecting a first attempt): a concept-game must let the student *grab and move the actual objects* with their finger, with the math changing continuously as a consequence — not click a few operation buttons.** The first balance-scale attempt (three buttons: "take from both / left / right") was retired for exactly this: the student pressed "do this" and watched, instead of playing.

Shipped: **`algebra-tiles-solver`** (`packages/book-renderer/blocks/simulations/AlgebraTilesSolverSim.tsx`, a `simulation` registry key). A mat split by `=`; draggable **x-tiles** (violet), **+1** (green), **−1** (red). The student drags a −1 from a tray **onto** a +1 and the zero-pair **pops and vanishes**; the equation banner above **rewrites itself live** on every move (`2x+3=11 → … → 2x=8`); a fairness badge flips **BALANCED/NOT EQUAL** and coaches "do the same to both sides"; when the units are cleared fairly, the loose tiles fade and a reveal card shows **x = 4**. Pointer-drag (mouse+touch), CSS-only, `validate-sims.mjs`-clean. The operation IS the drag. **Governance caveat:** a sim is code-only (not faculty-data-authorable) — fine for a flagship game; revisit as a data-driven game block if faculty need to author many. Extends to the `(a+b)²` tile game for Ch.4.

## The pilot arc (reference implementation)

`class9-mathematics` Ch.2, page `play-then-solve-linear-equations` (after "From Polynomials to
Equations"): **hook → balance-scale game (free play) → step_solver (`2x+3=11`, a `pick_op` then a
`fill_blank` check, "Why?" toggles, now-you-try `3x+2=14`) → close.** Script:
`scripts/math9-book/build_linear_equations_pilot.js`. All Ch.2 pages Zod-valid; `published:false`.

## Roadmap (where these go next — the engine openings)

The Class 9 chapters the graph engine *can't* serve are exactly where these tools have most leverage:

1. **Algebraic Identities (Ch.4)** — zero interactivity today. An **area-tile manipulative** game ((a+b)² built by dragging a²/2ab/b² tiles) + a step_solver for expand/factor. Highest leverage.
2. **Number Systems (Ch.3)** — a **number-line** interactive (place/compare/zoom) — an engine gap.
3. **Probability (Ch.7)** — **Venn/set** + **tree-diagram** components (flagged as brand-new block types).
4. **Every calculation chapter** — step_solver becomes the default way to show *any* worked calculation (mensuration, coordinate distance, sequences), replacing the "reveal-the-whole-solution" `worked_example`.
5. **Faculty authoring** — wire the `step_solver` admin editor (the 4 editor points) so faculty author solvers as data; consider a data-driven concept-game block so games are data, not code.

## Build / QA notes (from the pilot)

- New block recipe = 4 mandatory points (types → schema **both arrays** → BlockRenderer → renderer file). The Zod top-level `ContentBlockSchema` and child `ChildContentBlockSchema` unions are ordered differently — add to **both** explicitly.
- Two bugs the visual QA caught (neither visible to tsc/Zod): the block **title** rendered raw `$…$` (fix: wrap in `InlineMarkdown`); the per-step `CheckCard` **leaked state between steps** (fix: `key={active.id}` so each step remounts fresh). Both fixed. Lesson: any per-item interactive rendered at a stable tree position needs a `key`, or state bleeds across items.
- QA surface = the isolated admin editor (`admin-isolated`, port 3099, `.next-agent`) deep-linked to `/books?book=<slug>&page=<slug>`; drive interactions by ref-clicking (refs go stale each React re-render — re-read between clicks).
