# Class 11 Physics Live Book — Plan

**Status:** 🟡 Planned, not yet built (2026-07-27). Awaiting founder review before Chapter 0 build starts.

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Source PDFs:** `~/iCloud Drive (Archive)/Documents/chemistry/ncert books/class 11 & 12/Class 11 Physics NCERT/` — the **rationalised (2022+) NCERT edition**, 14 chapters across two parts (Part I: Ch.1–8, Part II: Ch.9–14 not yet in this folder — only Ch.9-14 PDFs + Part-1 present; confirm Part II PDFs before starting Ch.9+). **This edition has NO standalone "Physical World" chapter** (rationalised out) — Ch.1 is Units and Measurement.
- **Structural spine:** NCERT chapter order and topic flow, language simplified to NCERT's own register (never more sophisticated). JEE-only additions (not in NCERT) are clearly bracketed as enrichment, same convention as the Math book's "Note on Scope" callouts.
- **Reused engines (zero new build cost):** `math_graph` (JSXGraph, 14 archetypes — see [`MATH_LIVEBOOK_PLAN.md`](MATH_LIVEBOOK_PLAN.md)) and **Vector Lab** (`packages/book-renderer/blocks/simulations/vector-lab/`, flagship JEE-depth vector simulator with graphical-add/resolution/dot-cross phases + planck.js-powered river-crossing/equilibrium/net-force modules — see the mechanics-hub-vector-lab memory). Both ship today; this book's first two chapters need **no new simulation engine work**, only content authoring + light contextual re-skinning (axis labels, worked numbers).
- **Voice:** NCERT-register English, actively de-sophisticated for a Class-10-pass Hindi-medium-background reader (§5.V / §12 teacher-voice rules apply). Every technical term first-use is tappable via the existing `glossary` field (§15.9) — this is the "hover explanation" mechanism the founder asked for; it already exists platform-wide, no new feature needed.
- **Next action:** founder reviews this plan → approve/redirect → build Chapter 0 first (it has no NCERT page-count precedent to anchor against, so needs a go-ahead on scope), then Chapter 1.
- **Blocked on:** founder approval of scope (especially the two open decisions flagged in §3 and §5 below).

---

## 1. Why a prerequisite chapter, and why now

Every physics coaching program (Allen, FIITJEE, Resonance, Physics Wallah) opens Class 11 Physics with a **"Mathematical Tools"** unit before Units and Measurement — because NCERT Ch.1 onward assumes fluency in scientific notation, trigonometric ratios, graph-reading, and vector algebra that Class 10 board maths does not reliably deliver at problem-solving speed. Confirmed via a quick web check ([Physics Wallah — Basic Maths for Physics](https://www.pw.live/iit-jee/exams/basic-maths-for-physics-jee), [Physics Wallah — Mathematical Tools mind maps](https://www.pw.live/iit-jee/exams/physics-mathematical-tools-jee-mind-maps)) — the standard content is vectors, trigonometry, graphs/slope, differentiation, integration, and binomial approximation, i.e. exactly the founder's brief.

This becomes **Chapter 0: "Mathematics for Physics"** — sorts before Chapter 1 (`chapter_number: 0`), same pattern as the Math book's "Meet the Graphs."

## 2. Confirmed NCERT structure (read directly from the source PDFs)

| Ch | Title | Note |
|---|---|---|
| 1 | Units and Measurement | SI base units, sig figs, dimensions, dimensional analysis. No separate errors-in-measurement section — folded briefly into §1.3 (see §5 below, a real gap vs the pre-2022 edition). |
| 2 | Motion in a Straight Line | |
| 3 | Motion in a Plane | Vectors properly arrive here — Ch.0 pre-teaches the tool, Ch.3 is the first heavy application. |
| 4 | Laws of Motion | |
| 5 | Work, Energy and Power | |
| 6 | System of Particles and Rotational Motion | (old Ch.6+7 merged in rationalisation) |
| 7 | Gravitation | |
| 8 | Mechanical Properties of Solids | |
| 9 | Mechanical Properties of Fluids | |
| 10 | Thermal Properties of Matter | |
| 11 | Thermodynamics | |
| 12 | Kinetic Theory | |
| 13 | Oscillations | |
| 14 | Waves | |

This plan covers **Chapter 0 (Mathematics for Physics)** and **Chapter 1 (Units and Measurement)** in full page-by-page detail. Ch.2 onward follow once these two are approved and built.

---

## 3. Chapter 0 — "Mathematics for Physics" (prerequisite, ~11 pages)

Design principle: every page previews a specific downstream physics need, so nothing here feels abstract — each page opens with "you'll need this for..." framing.

| # | Page | Core content | Engine / reuse | Downstream hook |
|---|---|---|---|---|
| 0 | Chapter opener | Auto-generated per §15.1 — "the toolbox before the workshop" framing | — | — |
| 1 | Why Physics Leans on Maths | Motivational hook: physics = describing nature in numbers; a map of the 5 tools coming up | `curiosity_prompt` | orients the whole chapter |
| 2 | Powers of Ten & Scientific Notation | Writing very large/small numbers as `a × 10^b`; multiplying/dividing powers of ten; quick mental-math drills | `worked_example` + `inline_quiz` | Ch.1 sig figs & order-of-magnitude assume this cold |
| 3 | Algebra Refresher — Rearranging Formulas | Transposing an equation for a different variable (e.g. solve `s = ut + ½at²` for `u`); ratio & direct/inverse proportion reasoning ("if X doubles, what happens to Y") | `worked_example` | used constantly — Kepler's 3rd law, pendulum, Boyle's law, Ohm's law all read as proportionality statements |
| 4 | Reading Graphs — Slope & Area | Slope of a line = rate of change (teaser: velocity from an x-t graph); area under a curve = accumulated quantity (teaser: displacement from a v-t graph); recognise linear / parabola / inverse / sine shapes on sight | **`math_graph`**: `line-explorer`, `tangent-explorer`, `area-under-curve`, `transformations` archetypes, re-skinned with physics axis labels (t, x, v) | direct setup for Ch.2 Motion in a Straight Line, which derives velocity/acceleration from graphs in NCERT's own text |
| 5 | Trigonometry for Physics | Right-triangle ratios (sin/cos/tan), standard angles 0°/30°/45°/60°/90°, radians vs degrees | **`math_graph`**: `unit-circle` archetype (already built for the Math book's Ch.3) | the resolving-into-components skill needed one page later |
| 6 | Small-Angle Approximation | `sin θ ≈ tan θ ≈ θ` (θ in radians) for small θ, with a numeric table showing the error shrink as θ→0 | `math_graph` line/curve comparison (sin θ vs θ) or a simple `table` | Oscillations (Ch.13, pendulum), optics later |
| 7 | Vectors — What and Why | Scalar vs vector, notation, triangle law of addition | **Vector Lab** (`simulation` block, `vector-lab`, "Foundations" phase — graphical addition) | direct prerequisite for Ch.3 §3.2–3.4 and Ch.4 force resolution |
| 8 | Resolving a Vector into Components | Using trig (page 5) to split a vector into perpendicular components; unit vectors `i, j` | **Vector Lab** — "resolution" phase | Ch.3 §3.5–3.6 (resolution of vectors, analytical addition) |
| 9 | The Binomial Approximation | `(1+x)ⁿ ≈ 1 + nx` for small `x` — **the single most-used JEE-only shortcut not in NCERT at all**; a couple of worked mini-examples | `worked_example`; optionally a `math_graph` power-family comparison of `(1+x)^n` vs `1+nx` | Gravitation (Ch.7, g at height/depth), error propagation, oscillation period corrections |
| 10 | Rate of Change & Area — the Physics Payoff | Ties pages 4/6 together explicitly: `dx/dt` = velocity (slope of tangent), `∫v dt` = displacement (area) — concept only, no formal calculus proofs, matches NCERT's own informal treatment in Ch.2 | `math_graph` `tangent-explorer` + `area-under-curve` | closes the loop into Ch.2 |
| 11 | Chapter Practice & Mastery | Mixed `practice_bank`: sci-notation arithmetic, trig quick-fire, vector add/resolve numericals, binomial-approx numericals, slope/area `identify` MCQs | `practice_bank` + `math_graph.identify` | — |

**Open decision for the founder:** page 5 (trigonometry) can either (a) reuse the `unit-circle` archetype as-is with a physics framing, or (b) get a small new "right-triangle drag" archetype purpose-built for component resolution. Recommendation: start with (a) — it is zero new engine cost and the founder can request (b) later if the reuse feels like a stretch once drafted.

---

## 4. Chapter 1 — "Units and Measurement" (NCERT Ch.1, ~11–12 pages)

> **SUPERSEDED (2026-07-29) by [`PHYSICS_CH1_UNITS_AND_DIMENSIONS_PLAN.md`](PHYSICS_CH1_UNITS_AND_DIMENSIONS_PLAN.md)** — a full 19-page design built after reading the founder's second source (*Objective Physics* Vol.1 ch.1) end-to-end. Two things below are now wrong: the chapter is titled **"Units and Dimensions"** (Crucible-taxonomy alignment), and the §4 open decision's *"static diagrams first"* recommendation for vernier/screw gauge is **reversed** — 8 of the 20 PYQs in that source are instrument items, so the Measurement Lab sim is now the chapter's flagship build. The sketch below is kept only as the record of the pre-source design.

Follows the standard §4A Class-11 template + §15 experience standards (chapter opener, per-section objectives, mid-page checks, predict-first sims, closing bridge).

| # | Page | Core content | NCERT source | Notes |
|---|---|---|---|---|
| 0 | Chapter opener | Auto-generated | — | |
| 1 | Why We Need Standard Units | Measurement = comparison to an agreed reference; brief history of why local units (hand-spans, local weights) fail at scale | §1.1 | `curiosity_prompt` hook (e.g. old Indian units — hasta, yojana) |
| 2 | The Seven SI Base Units | Table of the 7 base quantities + symbols; radian & steradian as supplementary/dimensionless units | §1.2 | Simplify the 2019-redefinition wording (fixed Planck/Avogadro constants etc.) to one plain sentence per unit — NCERT itself flags "need not be memorised," so we don't over-teach the metrology |
| 3 | Derived Units & Everyday Non-SI Units | Newton, joule, pascal as combinations of base units; Table 1.2 (year, litre, atmosphere, light-year) | §1.2 | light-year → nice order-of-magnitude curiosity tie-in |
| 4 | Significant Figures — Counting the Digits That Matter | Rules for counting sig figs (non-zero always count, sandwiched zeros count, leading zeros don't, trailing zeros' ambiguity resolved by scientific notation) | §1.3 | `classify_exercise` or drag-sort "which zeros count" mini-game |
| 5 | Significant Figures — Doing Arithmetic Without Lying About Precision | Add/subtract by decimal places, multiply/divide by fewest sig figs, the round-half-to-even rule | §1.3.1–1.3.2, Examples 1.1–1.2 | worked examples straight from NCERT |
| 6 | Errors in Measurement | Systematic vs random error, absolute/relative/percentage error, propagation of error in sums/products (the rectangular-sheet `l × b` example, NCERT's own) | §1.3.3 (NCERT's compressed version) | **JEE addition:** expand NCERT's brief combination-of-errors treatment into full propagation rules for +, −, ×, ÷, and powers — a standard coaching add-on, still grounded in NCERT's own worked numbers |
| 7 | Reading Real Instruments — Vernier Callipers & Screw Gauge | Least count, main-scale + vernier-scale reading, zero error correction; screw gauge pitch & least count | **Not in this rationalised chapter at all** — pure JEE/board-practical addition | flagged as enrichment callout; see open decision below |
| 8 | Dimensions & Dimensional Formulae | The 7 base dimensions `[M L T A K mol cd]`; writing dimensional formulae for force, energy, pressure | §1.4–1.5 | |
| 9 | Dimensional Analysis — 3 Things It Lets You Do | Framed as 3 "superpowers": (a) check an equation's consistency, (b) convert between unit systems, (c) derive a relation (NCERT's own pendulum `T = k√(l/g)` example) + the 2 limitations (can't find dimensionless constants; fails on sums of unlike powers/trig-log-exp arguments) | §1.6, Examples 1.3–1.5 | |
| 10 | Order of Magnitude — Estimating Like a Physicist | Order-of-magnitude definition; a "guess the order of magnitude" quick quiz across everyday-to-cosmic scales | §1.4 (order of magnitude aside) | |
| 11 | Chapter Practice & Mastery | Full `practice_bank`: NCERT Ch.1 exercises (sourced verbatim from the PDF, Rule 0) + additional vernier/screw-gauge/error-propagation numericals tagged as non-NCERT enrichment | mixed | |

**Open decision for the founder:** page 7 (Vernier/screw gauge) — build a small interactive "drag the vernier scale, read the value" component, or ship static diagrams + worked reading examples first and upgrade later if it earns its keep? Recommendation: **static + worked examples first** (matches the "don't build a sim unless the existing library/page would be substantively weaker without one," §4E) — this topic is fundamentally about reading a fixed physical scale, which a labelled diagram + 2-3 worked readings teaches perfectly well; revisit only if the founder wants a gamified least-count drill later.

---

## 5. Cross-cutting rules for both chapters

- **Glossary/hover terms** (§15.9): tag every first-use of scalar, vector, resultant, dimension, dimensionless, significant figure, precision, accuracy, least count, order of magnitude, homogeneity (of an equation), systematic/random error, etc.
- **Tone**: NCERT's own register, simplified further per §5.V/§12 — short sentences, no literary vocabulary, re-explain rather than translate, active-recall cadence (§15.3).
- **Tier tagging** (§14): binomial approximation (Ch.0 p9), full error-propagation-for-powers (Ch.1 p6 extension), and vernier/screw-gauge (Ch.1 p7) are natural `tier: 'competitive'` candidates since a pure-CBSE-board student needs a lighter version — tag at authoring time.
- **Enrichment labelling**: any JEE-only addition not present in the rationalised NCERT (binomial approx, full error propagation, vernier/screw gauge) gets the same "Note on Scope" callout pattern already used in the Math book's Ch.4/5 — honest about what's NCERT vs. add-on, per the founder's standing preference.
- **No new simulation engine work required** for either chapter — `math_graph` and Vector Lab cover every interactive need identified above.

## 6. Sequencing after approval

1. Founder reviews/redirects this plan (this document).
2. Build Chapter 0 (Mathematics for Physics) — no NCERT page-count precedent, so page count/scope is the founder's call to lock first.
3. Build Chapter 1 (Units and Measurement) — anchored tightly to the confirmed NCERT structure above.
4. Refresh `_agents/state/LIVE_BOOKS_STATE.md` and this file's status header after each chapter build, per the standard Live Books ritual.
