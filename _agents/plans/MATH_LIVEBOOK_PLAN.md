# Class 11 Math Live Book — Architecture & Pedagogy Plan

> **Status:** DRAFT / proposal — 2026-07-23. Awaiting founder sign-off on the two gating decisions (§9).
>
> **BUILD STATUS (2026-07-23): the grapher TOOL is built (Phases 0–2), ahead of any chapter content, per founder direction.** Shipped this session, all programs typecheck clean + isolated admin production build passes:
> - New first-class **`math_graph`** block — type (`packages/data/types/books.ts`), Zod schema (`packages/data/books/schemas.ts`), both discriminated-union arrays, `BlockRenderer` wiring.
> - **Dark-themed JSXGraph engine** — `packages/book-renderer/blocks/math-graph/` (`MathGraphBoard.tsx` engine, `theme.ts` tokens, `archetypes.ts` library) + `MathGraphRenderer.tsx` (predict-first gate). Imports **bare `jsxgraph` 1.13.1** (its `exports` map blocks every `distrib/*` deep path; bare specifier is the only one webpack resolves, and it now ships its own types — no shim). CSS intentionally not imported (navigation disabled, sliders self-styled).
> - **Linked graph + table + live-equation panel** (drag a slider → curve, table, equation update together) — the hallmark multi-representation interactive.
> - **Archetype library** (the "not generic" investment): `transformations`, `unit-circle`, `tangent-explorer`, `area-under-curve`, `reflection`, `sequence-pattern`, `line-explorer`.
> - **Admin graph-builder** — `MathGraphEditor.tsx` (template picker + params, or declarative form: bounds/functions/sliders/points/regions/linked-table + predict gate), wired into `BlockCard` + a new "Math" group in `AddBlockMenu`. Faculty author graphs as DATA (the §2A governance goal).
>
> **Remaining before it's fully "done":** (1) **founder visual/interaction pass in local dev** — JSXGraph attribute theming (grid/axis/tick colours, slider styling) could not be eyeballed this session (no dev server per CLAUDE.md §5.2); (2) 3D `view3d` archetypes (deferred — not needed until the 3D-Geometry chapter); (3) a `/math-hub` standalone playground (optional); (4) a `validate-math-graphs` guard script; (5) optional next.config alias to the prebuilt `jsxgraphcore` to shrink the bundle. None block chapter 1.
> **Owner:** founder + agents. **Detail doc for** the "Class 11 Math Live Book" cockpit row.
> This plan is grounded in three parallel research passes (2026-07-23): a full map of the existing
> Live Books rendering/simulation architecture, a licensing+capability comparison of interactive
> graphing engines, and an evidence synthesis on teaching math to math-averse learners. Sources are
> cited inline where they change a decision.

---

## 0. The core bet (read this first)

Math is not Chemistry or Biology, and the Live Book for it must be built differently in **two** ways:

1. **Technically** — a math book lives or dies on its graphs and figures. Hard-coding hundreds of
   static images is slow to make, impossible to keep visually consistent, and — most importantly —
   **dead**. The whole point of a Live Book is that the student *moves* the math and watches it
   respond. So the centrepiece is a **declarative, JSON-authored interactive graph/geometry engine**
   built once and reused across the whole book, not per-figure artwork.

2. **Pedagogically** — the audience is tier-2/3 town students who *fear* math. The research is
   unambiguous that the fix is not "more explanation" but a specific instructional shape: kill the
   clock, make mistakes cheap, **predict before you reveal**, fade worked examples, interleave
   practice, and — the signature move for math specifically — show every idea as **linked graph +
   table + equation the student drives with their own hands**. This changes the *block vocabulary*
   of the book, not just its art.

The single unifying artifact that satisfies both is the **linked multi-representation graph block**:
drag a slider or a point, and the curve, the table, and the equation all move together — with a
required student prediction in between so the linking isn't passive. Everything below builds toward
making that cheap to author at textbook scale.

---

## 1. The central technical decision: which graphing engine

### Recommendation: **JSXGraph** (MIT/LGPL, self-hosted) behind a thin in-house declarative block. Do NOT embed Desmos or GeoGebra.

**Why not the obvious two.** Desmos API and GeoGebra are the most polished math engines and would be
the instinctive pick — but both are **commercial-license landmines** for a for-profit platform that
charges students:

- **Desmos API** — the free API key is licensed for *personal / non-commercial / individual-class*
  use only; a paid ed-tech product requires a **separate written (paid) partnership agreement**, and
  the free path loads `calculator.js` from Desmos's CDN at runtime (a third-party phone-home we
  otherwise avoid). Terms: desmos.com/terms.
- **GeoGebra** — the *source* is EUPL, but the **embeddable apps** you'd actually ship are under
  GeoGebra's **non-commercial** terms, and their own license page names "educational materials sold
  for fees" and "non-academic ebooks/textbooks" as commercial use requiring a License & Collaboration
  Agreement. geogebra.org/license.

Treat both as **"do not integrate without a founder-approved commercial license."** Recorded here so
nobody wires them in later.

### Prior art: we built this once and shelved it — recover, don't restart

A JSXGraph math grapher already existed and was **deliberately removed on 2026-06-19** (commit
`4104373`, "remove incomplete interactive-graph feature") because the founder judged it generic and
immature. It was ~736 lines across the full stack and is **fully recoverable** from the parent commit
(`git show 4104373^:<path>`):

- `interactive_graph` Live Books block — type + Zod schema + `packages/book-renderer/blocks/InteractiveGraphRenderer.tsx` + `interactiveGraphRegistry.ts`
- admin `books-editor/blocks/InteractiveGraphEditor.tsx` (form: axes + functions + draggable sliders)
- standalone `apps/admin/app/graph-editor/` + `GraphEditorClient.tsx`
- `jsxgraph` dep + `next.config` aliases

**The `jsxgraph` folder still in `node_modules` is an orphan** — the dependency was dropped from
`package.json` but never pruned; nothing references it. Re-add it intentionally in Phase 0.

**Preserved rationale (independently re-confirmed by 2026-07-23 research):** JSXGraph (MIT) chosen over
GeoGebra (paid commercial) and Desmos (hosted, own terms); use a **square board + `keepAspectRatio`**
for symmetric axes; JSXGraph ships uncompiled, so **alias to its prebuilt core** to keep the bundle sane.

**Why the old one was "generic," and the fix:** it was a raw plotter ("type a function → axes +
sliders") — a commodity that doesn't teach. The standout version is NOT a better generic plotter; it is
a **library of pedagogically-loaded math archetypes** (dynamic unit circle, conic-focus explorer,
sequence-pattern builder, limit-zoomer, linked graph+table+equation panel with a built-in predict-first
gate). Engineering investment goes into opinionated *teaching* interactives, not a "plot anything" box.
Faculty **compose from archetypes**, they don't build graphs from raw primitives. (See §2A + §3.)

**Why JSXGraph wins.**

| Criterion | JSXGraph |
|---|---|
| License | **Dual MIT / LGPL** — unrestricted commercial embedding, no API key, no attribution burden |
| Hosting | **Fully self-hosted**, ~200 KB, zero runtime deps, no CDN phone-home (fits our edge-cache + no-external-crawler posture) |
| Coverage | 2D function/parametric/polar/implicit plotting, **sliders**, **draggable points/gliders**, full **dynamic-geometry constructions** (perpendiculars, bisectors, loci, transformations), **inequality regions**, tables, LaTeX labels via KaTeX/MathJax, **and 3D** via `view3d` (points/lines/planes/curves/surfaces/polyhedra) |
| Touch/mobile | Built pointer+touch-first (SVG/canvas) — works on phones, our majority surface |
| Theming | Every element takes explicit stroke/fill/highlight colors + CSS-controlled background → force our dark palette cleanly |
| Maturity | v1.12.x, active (Univ. Bayreuth), 3D overhaul landed 2025, good docs |

One engine covers ~95–100% of Class 11. Parse author-supplied equation **strings** (`"a*x^2 + b*x + c"`)
with **mathjs** (Apache-2.0) — never `eval`.

**Secondary engines (only if needed, do not adopt up front):**
- **Mafs** (MIT, React-idiomatic) — reserve for a handful of *hand-crafted animated* interactives
  where declarative JSON is too limiting. Adds a second engine to theme-match; use sparingly.
- **visx / Recharts** (already in the admin app) — only for genuine **statistics** charts
  (histograms, scatter) in the Statistics/Probability chapters, not the math-graph core.
- **MathBox** — no. Only revisit if a future chapter needs cinematic shaded 3D surfaces; Class 11
  3D geometry (points/lines/planes/direction cosines) does not.

---

## 2. How it plugs into the existing architecture

The codebase already has a clean, proven pattern for exactly this. Findings from the architecture map:

- Blocks are a discriminated union on `type`, defined in **4 wiring points**: TS type
  (`packages/data/types/books.ts`), Zod schema (`packages/data/books/schemas.ts`), renderer
  (`packages/book-renderer/BlockRenderer.tsx` + a `blocks/*Renderer.tsx`), and the admin editor
  (`AddBlockMenu` + `BlockCard` + a `*Editor.tsx`).
- Simulations render via a **zero-prop** component registry keyed by `simulation_id`
  (`SimulationBlockRenderer.tsx`). Great for fixed teaching sims, **bad for parametric reusable
  graphs** — a zero-prop component can't take per-block config, so every graph variant would be a
  separate hardcoded file.
- **VectorLab** is the reference for a heavier interactive that powers *both* a book block *and* a
  standalone hub route (`/mechanics-hub`), stays self-contained, and code-splits its engine.
- **No graphing library is installed today** — every existing math sim (the Class 9 coordinate-geometry
  set) is hand-rolled SVG. So JSXGraph is a net-new, but *first*, dependency.
- All content writes go through the **`scripts/lib/book-writer.js`** gateway (versioned, content-loss
  guarded, audited). A new block is just a normal `ContentBlock` — no gateway changes needed, but any
  asset ref should be named `src`/`url` so the loss-guard protects it.

### Decision: a NEW first-class block type `math_graph` (config-carrying), NOT a zero-prop sim.

Because we want **authorable, parametric graphs reused across hundreds of pages** — "plot
`y = a·x² + b·x + c` with sliders a, b, c and a linked table" — the config must live *in the block*.
That rules out the zero-prop sim registry. We add one first-class block type whose data is a graph
spec, rendered by one JSXGraph-backed component.

**The declarative spec (illustrative — final schema in Phase 1):**

```jsonc
{
  "type": "math_graph",
  "mode": "linked",                     // "plot" | "linked" | "geometry" | "graph3d"
  "bounds": { "x": [-5, 5], "y": [-3, 7] },
  "functions": [{ "expr": "a*x^2 + b*x + c", "color": "amber" }],
  "sliders":   [{ "name": "a", "min": -3, "max": 3, "value": 1, "step": 0.1 },
                { "name": "b", "min": -5, "max": 5, "value": 0 }],
  "points":    [{ "at": [1, 2], "draggable": true, "label": "P" }],
  "regions":   [{ "inequality": "y < a*x^2 + b*x + c" }],
  "table":     { "of": "f(x)", "at": [-2,-1,0,1,2] },   // the linked table column
  "predict":   { "prompt": "Before you drag a — will the parabola widen or narrow?",
                 "options": ["Widen", "Narrow"], "reveal_after": "..." }
}
```

- One renderer `packages/book-renderer/blocks/MathGraphRenderer.tsx`, `dynamic(import, { ssr:false })`
  (JSXGraph touches `window` at construction — SSR guard mandatory, same as every existing sim).
- Themed entirely from the dark reading-surface CSS variables + the sim token palette (light-tier
  violet/sky accents, `#0d1117` canvas, KaTeX labels, Geist Sans, `tabular-nums`).
- A parallel **standalone `/math-hub` route** (VectorLab pattern) can host the same engine as a free
  "graphing playground" for marketing/SEO and open exploration.

**Why one config-driven block beats embedding a calculator:** hundreds of graphs across a whole
textbook must look identical and be programmatically generatable/validatable (Zod, like every other
block). A JSON spec + single renderer guarantees that; an embedded third-party calculator gives us
their chrome and their theme.

---

## 2A. Authoring & governance — the "data, not code" principle (NON-NEGOTIABLE)

**Requirement (founder, 2026-07-23):** faculty must be able to design math Live Books *and* build
graphs entirely from the **admin dashboard**, with **zero codebase access** and **zero backend/code
changes**. Today the founder directs page-building and an agent edits code alongside it; that must NOT
be a dependency going forward. When math livebooks are handed to a math faculty member, they get an
account — never a git checkout.

This maps onto a distinction the platform already has. There are two authoring models:

- **Content-as-data** — text/image/callout/quiz blocks are JSON in `book_pages`, edited in the admin
  books-editor. **No code, no deploy, no repo access.**
- **Content-as-code** — simulations are React components in the repo; adding one means editing code +
  deploying.

The old graph tool half-straddled this. **The math graph tool must live entirely in the data model.**
Split the system into two hard layers:

| Layer | Who | Where | Changes how often | Repo access? |
|---|---|---|---|---|
| **Engine + archetype library** (JSXGraph renderer, the pedagogically-loaded graph templates, mathjs parsing, the Zod spec) | Engineers | codebase, normal release cycle | rarely (new archetype = a code ship) | yes |
| **Individual graphs + pages** (pick an archetype, set params via a form with live preview, write the predict prompt, save) | **Faculty** | **admin dashboard only** → JSON in the block via `book-writer.js` (versioned, loss-guarded, audited) | constantly | **no** |

**The line to hold forever:** *building a graph = producing data; extending what graphs can do =
shipping code.* A faculty member authors an entire chapter of interactive graphs without one code
change, because every archetype is config-driven and the config is stored data.

**What this requires us to build (beyond the engine):**
1. A **visual graph-builder** in the books-editor: archetype picker → per-archetype form (functions,
   sliders with min/max/step, draggable points, domain, labels, the `predict` gate) → **live preview
   in the same dark theme the student sees** → save. This is the successor to the removed
   `InteractiveGraphEditor`, but archetype-driven, not a raw plotter.
2. **RBAC handoff** — reuse the existing grant model (`{subject:'math', chapters:'all', level:'edit'}`).
   A math faculty grant unlocks math-livebook authoring + all graph tools from
   `admin.canvasclasses.in`, with no ability to touch code, deploy, or see the backend. The
   `book-writer.js` gateway already enforces versioning, content-loss protection, and audit on every
   save, so faculty edits are safe and reversible by construction.
3. **A validate step** (`validate-math-graphs`, mirror `validate-sims.mjs`) so faculty-authored specs
   can't produce off-palette or broken graphs — guardrails without gatekeeping.

**Design implication for §3 onward:** favour the **first-class `math_graph` block** (config in the
block, authored via form) over any zero-prop sim, because only the data-driven block can be authored
without code. Any interactive that *can't* be reduced to an archetype+config (a rare bespoke animation)
is the exception that still needs an engineer — keep those few and named, not the default.

## 3. The pedagogical framework — what makes THIS book different

The research (math-anxiety-as-working-memory-theft; concreteness fading; dynamically-linked
representations; productive failure; faded worked examples; interleaving; utility value) converges on
a **lesson skeleton** and a **block vocabulary** that differ from the Chem/Bio books. The ten
prioritized principles and how each becomes a concrete book feature:

| # | Principle (evidence) | How it shows up in the Math Live Book |
|---|---|---|
| 1 | **Kill the clock, make mistakes cheap** (Beilock/Ramirez; Boaler) | No countdown timers on any learning task. Ungraded, retryable quizzes with feedback. Optional "brain-dump your worries" box before the first assessment of a chapter; one-line arousal-reappraisal framings. |
| 2 | **Worked-example → faded → solo ladder** (Sweller; expertise-reversal) | Every problem type ships a 3-rung ladder: fully worked → partial with the last step(s) blank → solo. Extend the existing `worked_example` block with a `faded_steps` variant. Start over-scaffolded, fade *within* the section. |
| 3 | **Predict-first gate before every reveal** (Kapur productive failure; Dan Meyer) | Reuse the existing `SimulationPrediction` gate pattern, generalized: a `predict` field on `math_graph`, worked examples, and key formula reveals. Student commits a guess → *then* the formula/answer unlocks. |
| 4 | **Interleave & space** (Rohrer RCT d≈1.0; Dunlosky top-2 techniques) | Chapter practice banks mix problem *types* (force method-choice), and later chapters resurface earlier ones via short retrieval quizzes. Nearly free, large payoff — encode as a practice-bank authoring rule. |
| 5 | **Concreteness fading as the default lesson shape** (Fyfe/McNeil) | Each hard concept = concrete/animated → representational → abstract symbol, with the bridge shown. The symbol is always introduced as *shorthand for the picture just seen* (see §4 per-topic). |
| 6 | **One signature linked interactive per topic** (Ainsworth DeFT; Thompson–Carlson covariation) | The `math_graph` `"linked"` mode: drag slider/point → graph + table + equation move together, **with a required prediction between representations** so linking is active, not passive. This is the book's hallmark. |
| 7 | **Self-explanation on the load-bearing step** (self-explanation effect) | A tap-to-reveal "why did we do this step?" micro-prompt on the key line of each worked example. |
| 8 | **Enter through a real hook, then abstract away** (Hulleman utility value; Kaminski transfer caveat) | Wordless "notice / wonder" opener + a *student-written* "how does this connect to my life?" free-write (utility value is strongest self-generated). Then lift the concept off the story and re-show it in *varied* contexts so it isn't glued to one scenario. |
| 9 | **Low-floor / high-ceiling openers** (Boaler) | Every big idea opens with something everyone can start (a pattern, a picture, a guess) that extends to JEE depth. Anxious students get an early win; strong students aren't bored. |
| 10 | **Growth-mindset framing as seasoning, not structure** (Boaler; tempered by Sisk et al. 2018, d≈0.08) | "Mistakes are data," progress-over-speed microcopy — cheap and audience-appropriate, but lightly applied. Mechanisms #1–8 carry the learning, not mindset posters. |

**Reliability note for future us:** principles 1–7 rest on well-replicated cognitive science (RCTs /
meta-analyses). #8 is solid for motivation with a genuine transfer caveat. #9–10 are audience-appropriate
but rest on a contested effect size — include, don't over-invest.

### New / extended blocks this implies

- `math_graph` (new, first-class) — the engine block, modes plot/linked/geometry/graph3d.
- `worked_example` **extended** with a `faded` ladder + `self_explain` prompt on a step.
- A `predict` gate generalized beyond sims (reuse `SimulationPrediction` shape).
- Existing blocks reused as-is: `latex_block` (all formulas — never images), `inline_quiz`,
  `practice_bank`, `callout`, `reasoning_prompt`, `curiosity_prompt`, `you_solve_it`, hero images.

---

## 4. Per-chapter treatment (NCERT Class 11 skeleton, two tracks)

The NCERT syllabus is the **structural spine**; a chosen reference book supplies **pedagogy, examples,
and problem sets** (see §9 decision). Chapters split into two tracks that get different emphasis:

**Track A — graph-heavy (the `math_graph` engine is the star):**
- **Sets, Relations & Functions** — function as an input→output *machine* (concrete) → arrow diagram/table → f(x); covariational "drag input, watch output" as the anchor.
- **Trigonometric Functions** — a **dynamic unit circle**: rotating point, height = sin, shadow = cos → makes periodicity/sign-changes *visible* → fade to ratios.
- **Straight Lines** — slider-driven `y = mx + c`: change m/c, watch the line tilt/shift; linked equation+graph.
- **Conic Sections** — drag a focus, watch the ellipse/parabola/hyperbola deform; eccentricity slider.
- **Sequences & Series** — **growing visual patterns** (dots/blocks/staircases) → term-vs-value table → nth-term formula discovered as a shortcut.
- **Limits & Derivatives** — dynamic **zoom** + two-sided numeric table approaching a point, behind a predict-first gate (intuition misleads here).
- **Linear Inequalities** — shaded feasible regions (JSXGraph `inequality`).
- **Introduction to 3D Geometry** — JSXGraph `view3d`: points, distances, section formula in space.
- **Statistics** — histograms/box-plots (visx/Recharts acceptable here).
- **Probability** — **simulation** (run 1000 trials, watch relative frequency → theoretical), varied contexts (dice/disease/cricket) to fight transfer-fragility and the gambler's fallacy via predict-then-check.

**Track B — symbol-heavy (the pedagogy research is the star; graphs are supporting):**
- **Complex Numbers** — Argand-plane concreteness fade: "i is a 90° rotation" animation → plane → algebra (a `math_graph` geometry mode moment, then symbolic).
- **Permutations & Combinations** — enumerate concrete small cases → spot pattern → factorial formula; **interleave P vs C** so students learn to *choose*.
- **Binomial Theorem** — Pascal's-triangle visual → expansion; faded worked examples.
- **Principle of Mathematical Induction**, **Mathematical Reasoning** — worked-example ladders, self-explanation, retrieval; minimal graphing.

Track B is where "make math not feel like a wall of symbols" is won — heavy on principles 2, 3, 5, 7.

---

## 5. Authoring at scale (a whole textbook = hundreds of graphs)

- **Graphs are data, not art.** Authors (or a generation script) write a `math_graph` JSON spec,
  validated by Zod like every other block, and picked/edited in the admin books-editor. No image
  generation, no R2 upload, no per-figure artwork for anything the engine can draw. This is the
  single biggest time-saver versus the Chem/Bio image pipeline.
- **Hero banners only** still use the existing `scripts/livebook-images/` ChatGPT→cwebp→R2 pipeline
  (16:5 cinematic opener per page). Formulas remain `latex_block`. So the image pipeline shrinks to
  ~1 image/page instead of many.
- **Teacher voice** — reuse the FORMAT v2 teacher-voice system (no icon headings, blank-line steps,
  Shortcut/Watch-out labels, Hinglish-friendly plain English for tier-2/3 students). A math voice
  exemplar bank in `_agents/voice/` mirrors the existing chemistry set.
- **Content protection** — all writes via `book-writer.js`; NCERT structure + reference-book examples
  are founder-authored and irreplaceable, so soft-delete + version history apply from day one.

---

## 6. Phased roadmap

| Phase | Goal | Deliverable / exit criterion |
|---|---|---|
| **0 — Recover + spike (1–2 days)** | De-risk the engine on the OLD foundation | `git show 4104373^` to restore the removed grapher for study; re-add `jsxgraph` (prune the orphan) with the prebuilt-core alias. Stand up a `<MathGraph>` wrapper (SSR-guarded, dark-themed, square board + `keepAspectRatio`) rendering one slider-driven parabola with a **linked table** *and* one 3D point set. Proves license-free, self-hosted, on-brand, mobile-touch. |
| **1 — Engine + archetype library + block** | `math_graph` as a first-class, **faculty-authorable** block | Zod schema + TS type + `MathGraphRenderer` + mathjs parsing + 4 modes + token theming + `predict` gate. **Plus the archetype library** (unit circle, conic-focus, sequence-pattern, limit-zoomer, linked panel, line/region) — the "standout, not generic" investment. Validator (`validate-math-graphs`) + a spec/archetype gallery. |
| **2 — The admin graph-builder (the governance deliverable)** | Faculty build graphs with **no code** | Archetype-driven form in the books-editor (successor to the removed `InteractiveGraphEditor`): pick archetype → set params → **live dark-theme preview** → save JSON via `book-writer.js`. Confirm a **math-faculty RBAC grant** can author an entire page of graphs end-to-end from `admin.canvasclasses.in` with zero repo access. |
| **3 — Pilot chapter (one Track-A + one Track-B)** | Prove the pedagogy end-to-end | Build **Trigonometric Functions** (Track A, unit-circle hallmark) + **Permutations & Combinations** (Track B, no graphs) fully, in teacher voice, worked-example ladder, predict-first gates, interleaved practice. Founder review against a math content rubric. **Author the graphs through the §2 builder, not code — the real test of the governance model.** |
| **4 — Rubric + critic skill** | Make quality repeatable | `MATH_CONTENT_REVIEW_RUBRIC.md` + `/math-content-critic` skill (mirror the chem one): continuity/soul, concreteness-fade, graph-actually-teaches, quiz hygiene, interleaving checks. |
| **5 — Scale-out** | Remaining chapters | Track-A first (engine leverage highest), then Track-B. Each chapter: NCERT spine + reference-book examples, `published:false` pending review. |
| **6 — Hub route (optional)** | SEO + open exploration | `/math-hub` standalone graphing playground on the same engine. |

Phase 0 is the go/no-go: if JSXGraph can't hit the dark-theme + mobile + linked-table bar even with the
prior code as a head start, we revisit (Mafs for 2D + a minimal 3D fallback) before committing. **Phase 2
is the second gate — if faculty can't author a real graph without an engineer, the governance goal has
failed and the builder needs rework before scale-out.**

---

## 7. Risks & mitigations

- **JSXGraph bundle on mobile** — ~200 KB, code-split per page (only pages with a `math_graph` load
  it), same `dynamic(ssr:false)` discipline as sims. Verify on a low-end phone in Phase 0.
- **Equation-string safety** — parse with mathjs, never `eval`; whitelist allowed functions.
- **Authoring friction** — if hand-writing JSON specs is slow, build a tiny spec-generator helper /
  admin form and a gallery of copy-paste starter specs per graph archetype (parabola, line, unit
  circle, ellipse, exponential, region).
- **Consistency drift** — one renderer + token palette + a `validate-math-graphs` script (mirror
  `validate-sims.mjs`) so no graph invents its own colors.
- **Over-relying on mindset framing** (principle 10) — keep it as microcopy seasoning; audit that
  Phase-2 pages lead with mechanisms 1–8.
- **Scope of "linked" interactivity** — passive dynalinking doesn't teach (Ainsworth); enforce the
  "student prediction between representations" rule in the rubric so `linked` graphs always gate.

---

## 8. Why not just reuse the Chem/Bio Live Book approach

The Chem/Bio books lean on generated imagery + fixed zero-prop sims + narrative prose. For math that
would mean (a) hundreds of static graph images — slow, inconsistent, dead — and (b) prose that talks
*about* math instead of letting students *do* it, which is precisely what fails math-averse learners.
The math book therefore adds one new capability (the config-driven graph engine) and one new
instructional shape (predict-first, faded, linked-representation, interleaved), while reusing the
platform's plumbing (block system, book-writer gateway, reading-surface theme, teacher voice, image
pipeline for banners only).

---

## 9. Decisions needed from the founder (gating)

1. **Reference book** — which book supplies the pedagogy, examples, and problem sets on top of the
   NCERT structural spine? (Determines the example/problem source for every chapter. Needs a PDF/scan
   the way the physics ingestion runbook uses source images.)
2. **Engine sign-off** — confirm **JSXGraph (self-hosted, MIT)** as the approved dependency and that
   **Desmos/GeoGebra are off the table** unless we deliberately buy a commercial license.
3. **Pilot chapters** — approve the Phase-2 pilot pair (proposed: Trigonometric Functions + Permutations
   & Combinations) or pick a different pair.

Secondary (can default): whether to also ship the `/math-hub` standalone route (proposed: yes, later,
Phase 5).

---

## 10. Immediate next actions

1. Founder resolves §9.1 (reference book) and §9.2 (engine sign-off).
2. On sign-off: **Phase 0 spike** — JSXGraph `<MathGraph>` wrapper proving dark-theme + mobile-touch +
   slider→linked-table + one 3D scene.
3. Add the **"Class 11 Math Live Book"** row to `_agents/PROJECTS.md` and a status header here.

---

### Sources (decision-changing only)
- Graphing engines: JSXGraph MIT license (github.com/jsxgraph/jsxgraph), Desmos Terms (desmos.com/terms),
  GeoGebra license (geogebra.org/license), mathjs (Apache-2.0).
- Pedagogy: Ramirez/Beilock (math anxiety & working memory), Fyfe/McNeil 2014 (concreteness fading),
  Ainsworth 2006 DeFT + Thompson/Carlson 2017 (linked representations/covariation), Kapur 2014
  (productive failure), Sweller/Kalyuga (worked examples & expertise reversal), Rohrer et al. 2020
  (interleaving RCT), Dunlosky et al. 2013 (retrieval + spacing), Hulleman/Harackiewicz (utility value),
  Sisk et al. 2018 (growth-mindset meta-analysis caveat).
