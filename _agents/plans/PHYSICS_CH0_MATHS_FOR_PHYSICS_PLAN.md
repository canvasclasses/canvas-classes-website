# Physics Class 11 — Chapter 0: "Mathematics in Physics"

**Status:** 🟢 **BUILT AND CONSOLIDATED — 20 pages (2026-07-29).** Built end to end to the founder's own three-unit framework (**1 Basic Maths → 2 Differentiation & Integration → 3 Vectors**), then consolidated 35 → 20 on the founder's cap: *"35 pages are too much for a student who has just started physics… let's keep it up to 20 pages max."* Consolidation was **merge-only — no teaching content was cut**; 15 pages were folded into survivors and soft-deleted, each contributing a level-2 heading carrying its old title so the material stays navigable and still feeds the "On this page" rail. Verified block-by-block: every text, callout, worked example, board, step-solver and question from all 15 absorbed pages is present in its survivor; only the placeholder hero image and the one-line "Next: …" pointer were dropped per absorbed page. Scope rule throughout: **depth-limited, coverage-broad** — no first-principles limits, no ε-δ, no integration by parts, no proofs of the trig formulas.

**Structure as shipped (20 pages, `published: false`):**

| # | Page | Unit |
|---|---|---|
| 0 | Mathematics in Physics *(chapter opener — never merged into: `BookReader` filters openers out of the lesson flow)* | A |
| 1 | Why Physics Leans on Maths *(+ powers of ten)* | A |
| 2 | Algebra for Physics *(rearranging · simultaneous · quadratics)* | A |
| 3 | Reading Graphs *(lines/parabola/conics · trig/log/exp)* | A |
| 4 | Transforming a Graph | A |
| 5 | Angles and Trigonometric Ratios *(radians · arc length · six ratios · 37°/53° · CAST · reduction)* | A |
| 6 | Trigonometric Identities and Small Angles | A |
| 7 | **Unit A — Practice Arena** | A |
| 8 | What Differentiation Really Means *(Δ vs d · secant→tangent · standard derivatives)* | B |
| 9 | The Rules of Differentiation *(sum · product · quotient · chain)* | B |
| 10 | Using the Derivative *(six rates of change · maxima & minima)* | B |
| 11 | Integration — Reversing Differentiation *(+ substitution)* | B |
| 12 | Definite Integration and Area | B |
| 13 | **Unit B — Practice Arena** | B |
| 14 | Scalars, Vectors and the Angle Between Them *(+ anatomy · types · tail-to-tail rule)* | C |
| 15 | Adding Vectors *(triangle + parallelogram laws)* | C |
| 16 | Subtraction, the Polygon Law and Equilibrium | C |
| 17 | Resolution and the Analytical Method *(î ĵ)* | C |
| 18 | Multiplying Vectors — Dot and Cross | C |
| 19 | **Unit C — Practice Arena** | C |

**Interactivity (unchanged by the consolidation):** 10 `math_graph` boards (line-explorer, power-family, exp-base, shift, stretch, sector, tangent ×2, area-under-curve) · 20 `vector_board` boards across 6 archetypes, 3 of them guided · 8 `step_solver`s · 3 `practice_bank` arenas (4 sections × 5 items each = 60 drill items) · 93 inline-quiz questions + 60 practice-bank items, answer positions balanced by the pre-insert tally on every unit.

**Question sources:** Resonance *Mathematical Tools* (primary; solved examples + the 3-tier exercise architecture) · HC Verma Ch.2 (pedagogy + vector problem types) · the founder's 17 attached sample items, all placed · Unit A algebra/graph items **authored fresh** on the founder's instruction, because neither source drills quadratics, simultaneous equations or graph transformations. **No third-party attribution is ever shown student-side** — every bank item uses the neutral `mcq` source.

**Not in this chapter (founder decision):** errors of measurement and significant figures → **Ch.1 Units and Dimensions**. Crucible's `ph11_math_phy` bank is currently 44% error-analysis (43 of 98) and will need re-tagging when that bank is worked on; it has **zero** integration and one differentiation question, so Unit B has no PYQ handoff yet.

**Browser QA (2026-07-29), 3 defects found and fixed:** (1) **two "your turn" exercises printed the answer they asked for** — the board readout showed `|R| 10.0 N` directly above "what is the magnitude of the resultant?"; p27's board now hides readout+formula and p30's numeric moved onto its own readout-free board. (2) **`PracticeBankRenderer` hardcoded all four source badges**, advertising "NCERT Exemplar / NCERT / CBSE PYQ" on banks made entirely of plain MCQs — now derived from the items actually present (shared renderer; fixes every book). (3) the `identify` explanation said "the first/second/third diagram" while the UI labels them A/B/C. Verified working by driving them: guided 4-step parallelogram build (|R| 9.5, α 27.0° — correct), equilibrium target with live gap feedback, identify grading, numeric grading, step_solver gated checks, practice-bank grading, sector arc = π, ∫ = 5.6, A·B = 0 / |A×B| = 30 at 90°.

**Remaining:** hero images are `src: ""` with prompts written · founder review, then publish.

**Source studies (read all three before authoring any remaining page):** NCERT = structural spine · [`PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md`](PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md) = pedagogy + problem layer · [`PHYSICS_CH0_RESONANCE_GAP_ANALYSIS.md`](PHYSICS_CH0_RESONANCE_GAP_ANALYSIS.md) = **scope + sequencing (the JEE-coaching contract; demands 11 new calculus pages and a 3-tier exercise architecture)**.
**HC Verma rework:** Ch.2 of *Concepts of Physics* has been mined for both problems and pedagogy — see [`PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md`](PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md). Wave 1 (p6 correctness fix + p8 discovery-first rebuild, 3 `step_solver`s) is live; §8 there is the remaining build order and §4A is the new page-writing rhythm every remaining page must follow.

**Parent plan:** [`PHYSICS_LIVEBOOK_PLAN.md`](PHYSICS_LIVEBOOK_PLAN.md)
**Book:** `class11-physics` (to be created) · `chapter_number: 0` so it sorts before Units and Measurement.
**Founder direction (2026-07-27):** build the maths simulations, but **vectors carry the chapter** — students must practise addition and subtraction laws, *see them in action*, and work through **a good number of interactive problem-solving exercises**.

---

## 1. What already exists (audited, not assumed)

| Asset | Where | Verdict |
|---|---|---|
| **`math_graph` block** — JSXGraph engine, **37 archetypes**, config-carried-as-DATA, predict-gate, `challenge` (auto-checkable match), `identify` (gradable "which curve?" MCQ), admin builder | `packages/book-renderer/blocks/math-graph/` | **Reuse as-is, zero code.** `line-explorer`, `tangent-explorer`, `area-under-curve`, `unit-circle`, `power-family`, `shift-explorer` cover every non-vector maths page below. |
| **`vectorMath.ts`** — pure, side-effect-free 2D/3D vector algebra incl. `parallelogramMagnitude()` and `resultantAngleFromA()` written to match NCERT's own derivation | `…/simulations/vector-lab/lib/vectorMath.ts` (142 LOC) | **Import directly.** Already the exact formulas Ch.0 teaches. |
| **`DraggableHead`** — pointer/touch/pen drag handle with magnitude clamp, angle-snap, grid-snap | `…/vector-lab/components/DraggableHead.tsx` (124 LOC) | **Import directly.** The PhET-validated "grab the tip" interaction. |
| **SVG primitives** — `VectorArrow`, `Grid`, `Axes`, `AngleArc`, `Dot` | `…/vector-lab/components/svg.tsx` (161 LOC) | **Import directly.** |
| **UI primitives** — `Slider`, `Toggle`, `StepBar`, `ExpertTip`, `MistakeCallout`, `Rule`, `ResetButton`, `PhaseLayout` (canvas+sidebar) | `…/vector-lab/components/{primitives,ScenarioStage}.tsx` | **Import directly.** |
| **Vector Lab (whole course)** — 12 modules, own header, own navigator, `minHeight: 80vh`, planck.js dynamics | `…/simulations/vector-lab/VectorLabSim.tsx`, live at `/mechanics-hub/vectors` | **Keep, but do NOT embed mid-page.** See §2. |

So roughly **790 LOC of tested vector code is already written** and is imported, not rewritten.

## 2. The one real build decision — `simulation` blocks cannot carry config

Verified in `packages/book-renderer/blocks/SimulationBlockRenderer.tsx:655` — the registry renders `<Sim />` with **zero props**. A `simulation` block can only name an id. Two consequences:

1. Dropping `vector-lab` on a book page injects the **entire 12-module course** — its own `<h1>Vector Lab</h1>`, its own course-progress bar, its own navigator, 80vh tall — into the middle of a lesson. It is a destination, not a teaching instrument.
2. **"A good number of interactive problem-solving exercises" is impossible** under that block type without registering one `simulation_id` per exercise — i.e. writing code for every question. That does not scale and hands nothing to faculty.

### The proposal: a new first-class `vector_board` block

Exactly the architecture the `math_graph` block already proved on this codebase, applied to vectors:

> **Engine ships once as code. Every individual vector exercise is authored as DATA** in the admin books-editor — no repo access, no deploy, gated by an RBAC physics grant. "Building an exercise = data; extending what exercises can do = code."

```ts
export interface VectorBoardBlock extends BaseBlock {
  type: 'vector_board';
  title?: string; caption?: string;
  archetype: string;                       // 'triangle-law' | 'parallelogram-law' | …
  params?: Record<string, number|string|boolean>;
  vectors?: VectorSpec[];                  // {label, mag, angle, color, draggable, locked}
  units?: string;                          // 'N' | 'm' | 'm s⁻¹' — physics context, not bare maths
  show?: { grid?, axes?, components?, angleArc?, readout?, formula? };
  animate?: boolean;                       // Play button — construct the sum step-by-step
  // ── the four gradable exercise layers ──
  predict?:  { prompt, options[], answer_index?, reveal? };
  target?:   { resultant_mag?, resultant_angle?, tolerance?, prompt, success };
  identify?: { prompt, correct_index, explanation };
  numeric?:  { prompt, answer, tolerance, unit, worked_reveal };
  height?: number;
}
```

**Wiring is the same 4 points `math_graph` uses** (all confirmed present): type in `packages/data/types/books.ts` · Zod in `packages/data/books/schemas.ts` (**both** union arrays) · `packages/book-renderer/BlockRenderer.tsx:114` neighbourhood · admin `BlockCard.tsx` + `AddBlockMenu.tsx`.

**Surgical note (§9):** the new engine **imports** from `…/simulations/vector-lab/lib|components/` — it does **not** move or refactor those files. Vector Lab keeps working untouched; one source of truth for the maths. Extraction into a shared `vector-core/` only if it later proves awkward.

**Cost estimate:** ~900–1200 LOC new (canvas + archetypes + 4 exercise layers), ~250 LOC renderer, ~300 LOC admin editor. Comparable to the `math_graph` build, which has since paid for itself across 68 math pages.

### 2.1 Archetype library (v1 — 9 constructions)

| Archetype | Teaches | The thing a paper textbook can't do |
|---|---|---|
| `scalar-vs-vector` | distance vs displacement | a dot **walks the actual path** while the displacement arrow stays put |
| `vector-anatomy` | magnitude, direction, notation | drag the tip → magnitude, angle **and** components move together |
| `triangle-law` ★ | tip-to-tail addition | **Play** → B slides from origin to A's tip, R draws itself |
| `parallelogram-law` ★ | `R = √(A²+B²+2AB cos θ)` | θ slider → the **formula re-substitutes live** beside the shape |
| `vector-subtraction` ★ | `A − B = A + (−B)` | toggle → B **flips through 180°**; side-by-side `A−B` vs `B−A` |
| `resolution` ★ | `Aₓ = A cos θ`, `A_y = A sin θ` | drag the arrow → both components stretch, live trig substitution |
| `analytical-addition` | i, j notation; summing components | a **linked component table** that totals to the resultant as you drag |
| `polygon-equilibrium` | polygon law; ΣF = 0 | the polygon **snaps shut** with a green flash when it balances |
| `dot-cross` | `A·B`, `A×B` *(tier: competitive)* | angle slider → dot goes through zero and turns negative, live |

★ = the four load-bearing ones for the founder's "addition and subtraction laws" ask.

### 2.2 The four exercise layers — how "a good number of exercises" is achieved

Every layer is a **field on the block**, so one archetype yields many distinct exercises with zero new code:

1. **`target`** — *"Drag B until A + B points due east at 10 N."* Dashed goal arrow shown; auto-checks magnitude **and** angle within tolerance; success message on match. *Direct analogue of the proven `math_graph.challenge`.*
2. **`identify`** — renders 3–4 small static diagrams labelled A/B/C/D; *"Which one correctly shows P − Q?"* **This is the founder's own insight applied to vectors**: a hand-drawn vector in a rough book can't be graded, but picking the correct diagram can — and reversed-subtraction is *the* classic exam trap. *Direct analogue of the proven `math_graph.identify`.*
3. **`numeric`** — *"Read the diagram. What is |A + B|, to 1 d.p.?"* Student types a value; tolerance check; reveal shows the full substitution into the parallelogram formula.
4. **`predict`** — the predict-first gate (§15.4), same shape as `math_graph.predict`.

**9 archetypes × 4 layers, authored as data ⇒ dozens of graded exercises**, and physics faculty can add more forever without an engineer.

## 3. Page plan — 17 pages, **7 of them vectors (≈44%)**

| # | Page | Interactive | Notes |
|---|---|---|---|
| 0 | Chapter opener | — | §15.1, not quiz-gated |
| 1 | Why Physics Leans on Maths | `curiosity_prompt` | map of the 5 tools ahead |
| 2 | Powers of Ten & Scientific Notation | worked examples + quiz | Ch.1 sig-figs assumes this cold |
| 3 | Rearranging Formulas & Proportionality | worked examples | "if X doubles, what happens to Y" — the JEE reading skill |
| 4 | Trigonometry for Physics | `math_graph` **`unit-circle`** | must precede resolution |
| 5 | Small-Angle Approximation | `math_graph` + table | pendulum (Ch.13), optics |
| **6** | **Scalars vs Vectors — why direction changes everything** | `vector_board` **`scalar-vs-vector`** + `predict` | the walk-the-path animation |
| **7** | **Anatomy of a Vector** | `vector_board` **`vector-anatomy`** + 2 `numeric` | notation, magnitude, direction |
| **8** | **Adding Vectors — the Triangle Law** | `vector_board` **`triangle-law`** (animated) + `target` + `identify` | tip-to-tail; "closing the loop" misconception |
| **9** | **The Parallelogram Law — putting a number on it** | `vector_board` **`parallelogram-law`** + `numeric` ×2 | NCERT's own `R = √(A²+B²+2AB cos θ)`, live |
| **10** | **Subtracting Vectors** | `vector_board` **`vector-subtraction`** + `identify` ×2 | `A−B` vs `B−A` is the #1 exam trap |
| **11** | **Resolving a Vector into Components** | `vector_board` **`resolution`** + `target` | pays off page 4's trig |
| **12** | **Vector Practice Arena** | 8–10 `vector_board` exercises (`target`/`identify`/`numeric`) + `practice_bank` | **the founder's core ask lives here** |
| 13 | Reading Graphs — Slope & Area | `math_graph` `line-explorer`, `area-under-curve` | sets up Ch.2 kinematics |
| 14 | Rate of Change & Area — the Physics Payoff | `math_graph` `tangent-explorer` | `dx/dt` = velocity, `∫v dt` = displacement, concept-only |
| 15 | The Binomial Approximation | worked examples + `math_graph` | `(1+x)ⁿ ≈ 1+nx` — biggest JEE tool absent from NCERT |
| 16 | Chapter Practice & Mastery | `practice_bank` + mixed `identify` | balanced answer positions (pre-insert tally, per house rule) |

**Optional page 11b — Dot & Cross Products** (`tier: 'competitive'`). Content already exists in Vector Lab's `08_DotCross.tsx`. NCERT introduces these in Ch.5/Ch.6, but coaching "Mathematical Tools" units include them and Work-Energy needs the dot product. **Recommendation: include it**, tagged competitive so a board-only student can skip.

## 4. Build order

1. **Engine** — `packages/book-renderer/blocks/vector-board/` (canvas + 4 load-bearing archetypes ★ + the 4 exercise layers), wired at the 4 points, `tsc` clean.
2. **Remaining 5 archetypes** + admin `VectorBoardEditor`.
3. **Pages 6–12** (the vector run) — the heart of the chapter.
4. **Pages 1–5, 13–16** — largely `math_graph` reuse, fast.
5. Refresh `LIVE_BOOKS_STATE.md` + `PROJECTS.md` + this doc's status header (§0.5 ritual).

## 5. Standing rules that apply

- **Glossary/hover terms** (§15.9) on every first use — scalar, vector, resultant, component, magnitude, equilibrium, unit vector…  This is the "hover explanation" mechanism; it exists platform-wide already.
- **Voice** — NCERT register, simplified further (§5.V/§12): short sentences, no literary vocabulary, written for a Class-10-pass Hindi-medium-background reader.
- **Predict-first** (§15.4) on simulations, **mid-page checks** (§15.3), **closing bridge** (§15.10) on every page.
- **MCQ answer-position tally before any insert** — the recurring house bug; Zod validity ≠ balanced options.
- **Enrichment labelling** — binomial approximation and dot/cross get an honest "Note on Scope" callout (not in NCERT Ch.1–3 as such).
- **No dev server** (§5.2) — founder does the visual/interaction pass.


---

## 7. Browser QA pass — 2026-07-27 (founder-requested)

Ran the isolated admin preview (port 3099, `.next-agent` dist — never touches the founder's own dev server), drove every board with real pointer events, and fixed what broke. Findings, in the order they were caught:

| # | Defect | Cause | Fix |
|---|---|---|---|
| 1 | Board completely dead to the pointer — "drag B round" was impossible | Drag handles were gated on `t >= 1`, and an animated board starts at `t = 0` | Handles render whenever the construction is complete (`built && !animating`) |
| 2 | Goal ring and panels flickered while dragging | Sidebar growing (success message appearing) stretched the grid row, which resized the `height:100%` SVG | Canvas has a **fixed pixel height**; grid is `lg:items-start`. Verified: ring radius and canvas size constant across 14 drag frames |
| 3 | Success strobed on/off at the tolerance edge | `matched` recomputed every pointer move | Success **latches** — and the latch moved from the drag handler into an effect on the rendered match, so landing on the goal in ONE motion also latches |
| 4 | Formula box crowded into one wrapped line | Single long LaTeX string | `formula` is now `string[]`, one line per row |
| 5 | `B` and `R` labels printed on top of each other | In the triangle law the resultant's tip **is** B's tip | New `labelAt: 'mid'`; identify diagrams detect coincident tips automatically |
| 6 | Four "which diagram?" options drawn at different scales | Each auto-fitted independently | One **shared frame** across all options — a comparison question must be comparable |
| 7 | Formula printed `(5.6 − −0.8)` | Naive subtraction formatting | `minusTerm()` helper; a sweep of 80 rendered formula lines now guards it |
| 8 | A 550 ms draw-in took ~2 s; taps during it were silently dropped | `specs` memo keyed on block **identity**, which the autosaving editor recreates constantly → continuous re-seed. Plus 60 fps re-render of KaTeX | Content-keyed `specsKey`; 30 fps frames; memoised formula panel; a click during the draw now **skips** instead of being ignored |

Also fixed in content, not code: the practice board now sets `lock_magnitude` so "swing B round" really only rotates it — previously a student could change |B| and the Think-It-Through question ("both are 6 N") stopped being true.
