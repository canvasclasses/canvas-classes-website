# Class 9 Mathematics — `math_graph` Tool Scope Report

> **✅ EXECUTED 2026-07-24 (later same day).** Every item in the prioritized build list below was built and committed — all 15 proposed archetypes (14 new + `sequence-pattern` widened), all Tier-1 and Tier-2 content wiring across Ch.2, 3, 5, 6, 7, 8. Ch.4 was correctly left untouched (confirmed not graph territory, matching this doc's own recommendation). Full build detail: `LIVE_BOOKS_STATE.md` 2026-07-24 (later) and `_agents/PROJECTS.md`'s Class 9 Math Live Book row. **This document is kept as-is below as the historical planning record** — the analysis and priority ordering are what actually got built, in that order. One correction made mid-build, noted here for the record: the "Prioritized build list" below (Tier 2, item 6) dropped Ch.5 page 4's archetype need when consolidating from the per-chapter detail table — caught during implementation and fixed by extending `chord-distance-explorer` to also compute central angles, covering page 4 alongside its originally-planned pages 6/7.

> **Purpose:** a chapter-by-chapter audit of every built Class 9 Math chapter (2–8; Ch.1 Coordinate Geometry is already fully converted — see `LIVE_BOOKS_STATE.md` 2026-07-24) against the current `math_graph` toolkit, so future build sessions know exactly what's already covered, what's a cheap swap, and what needs real engine work — instead of re-discovering this chapter by chapter.
>
> **Method:** read-only. Every finding below traces to the chapter's actual page content in Mongo (`book_pages`, `class9-mathematics`) plus a direct read of the engine (`packages/book-renderer/blocks/math-graph/archetypes.ts`, `packages/data/types/books.ts`). No content or code was changed producing this report.
>
> **Tool state at time of writing:** 18 archetypes (11 from the Class 11 build + `distance-explorer`, `midpoint-explorer`, `circle-locus-explorer`, `collinearity-checker`, and an extended `reflection` from the Ch.1 pass), plus spec mode (`functions`, `sliders`, `points`, `segments`, `regions`, `annotations`, `table`). Spec mode has **no circle/arc primitive** and **no per-axis suppression** (showAxes is all-or-nothing) — both matter below.

---

## Executive summary

Seven chapters, wildly different fit:

| Chapter | Graph-shaped? | Existing coverage | Biggest opportunity |
|---|---|---|---|
| Ch.2 Linear Polynomials (26pp) | **Very** | `line-explorer` exists but is used **nowhere** in the chapter | Wire it onto the slope-intercept spine — zero new engine work |
| Ch.3 Number Systems (15pp) | Mostly not (1-D number line) | `brahmagupta-zero-line` sim already sets the right precedent | One real 2-D construction needs a new archetype (√n spiral) |
| Ch.4 Algebraic Identities (13pp) | **No** | Correctly all static (area-tiles, 3-D cube) | Nothing to build — the 2026-06 decision holds up |
| Ch.5 Circles (13pp) | **Yes, but a different family** | Zero coverage — needs axis-free circle-theorem archetypes | A whole new archetype family (8 proposed) |
| Ch.6 Perimeter & Area (14pp) | Mostly not (shape/formula diagrams) | Zero coverage | 4 "shape morphs on a plane" archetypes, one iconic |
| Ch.7 Probability (11pp) | **No** (frequency/set/tree content) | Zero coverage | One convergence-plot archetype; rest needs non-graph tools |
| Ch.8 Sequences (12pp) | **Most graph-native** | `sequence-pattern` conceptually fits 2 of 5 images | Needs wider slider ranges + a new partial-sum archetype |

**The honest picture:** only Ch.2, Ch.5, and (to a lesser extent) Ch.8 are chapters where `math_graph` is the dominant tool. Ch.3, Ch.4, Ch.6, Ch.7 are each mostly *not* graph territory — their diagrams are area-tiles, number lines, Venn/tree diagrams, or shape-and-formula illustrations, and forcing those into `math_graph` would be a worse fit than what's already planned (static images) or a different tool entirely (simulations, a Venn/tree component). That's a real finding, not a gap in the audit — see each chapter's summary for why.

---

## Prioritized build list (all chapters, ranked by leverage)

**Tier 1 — build first (cheapest, highest reuse, or fills a total-zero gap):**

1. **Ch.2 — wire up `line-explorer` + spec-mode family figures** on the slope-intercept spine (pages 12, 15, 16, 17) and add missing diagrams on pages 4, 9, 11, 23, 24. Zero new engine code — this is pure content authoring on an archetype that's shipped and proven since Chapter 1. Also swap pages 7 and 23's tile-sequence images for the existing `sequence-pattern` archetype (already a fit, just unused).
2. **Ch.8 — widen `sequence-pattern`'s slider ranges** (`a`: currently −3..5, needs to reach ~24 for the bounce-height example; `d`: currently −3..3, needs ~4; `r`: currently 0.2..2.5, needs ~3). Small param/range change, unlocks pages 5 and 10 as genuine drop-ins instead of "conceptually similar but wrong scale."
3. **Ch.5 — build `inscribed-angle-explorer`** (drag a point around an arc; live central-angle vs inscribed-angle readout, extends to "angles in the same segment"). Single highest-value circle-theorem archetype — covers pages 8 and 9, and is the most-requested interactive in any circle-theorem curriculum.
4. **Ch.6 — build the circle-area slice-and-rearrange interactive** (page 11): slider controls wedge count, wedges peel and reassemble into a strip approaching a rectangle, live area readout. The chapter's single most iconic proof.
5. **Ch.8 — build `sum-pairing-proof`** (the Gauss staircase-to-rectangle construction, page 7): zero existing archetype touches partial sums (Sₙ) at all — `sequence-pattern` only ever plots individual terms.

**Tier 2 — solid follow-ups once Tier 1 lands:**

6. **Ch.5 — the rest of the circle-theorem family**: `circumcircle-explorer` (p.3), `chord-distance-explorer` (covers both p.6 and p.7 via a param), `cyclic-quad-explorer` (covers both p.10 and p.11 via a param). `circle-anatomy-explorer` (p.1) and `chord-perpendicular-bisector` (p.5) round it out. `circle-symmetry-explorer` (p.2) is lowest priority in this family — more demonstration than checkable exercise.
7. **Ch.3 — build `surd-spiral-construction`** (Spiral of Theodorus) for page 9's √n-on-the-number-line construction. The one genuinely 2-D, archetype-worthy piece of an otherwise 1-D chapter.
8. **Ch.6 — the remaining shape-morph archetypes**: `parallelogram-to-rectangle` (p.6), `triangle-pair-to-parallelogram` (p.7, likely shares code with #6 via a `mode` param), `sector-explorer` (p.12, cheap — extends existing `unit-circle` mechanics).
9. **Ch.7 — build a trial-convergence archetype** and move it from its current position as page 6's static hero image into a real content-body interactive (relative frequency vs. trial count, converging to the theoretical probability with a dashed target line).

**Tier 3 — different tool, not math_graph (bigger investment, only pursue if these chapters get prioritized):**

10. **Ch.3 — generalize the existing `brahmagupta-zero-line` simulation** into a reusable "rational number line" sim (params: subdivisions, draggable marker, zoom/midpoint mode) for pages 5 and 6. This is a `simulation` block, not `math_graph` — the engine has no per-axis suppression, so a true number line can't render cleanly inside a `math_graph` board.
11. **Ch.7 — a Venn/set-diagram component** (page 8: sample space + event as a subset, click outcomes to build E ⊂ S) and **a tree-diagram component** (page 9: branch-by-branch reveal, live leaf-probability = product of edge probabilities). Neither is a coordinate-plane object; both are new block types this platform doesn't have yet. Only worth it if Probability becomes a near-term priority — it's a bigger lift than any single archetype above.

**Not recommended / confirmed correct as-is:**

- **Ch.4** — all 4 image pages (area-tiles ×3, exploded 3-D cube ×1) should stay static. This re-confirms a 2026-06 decision even against the grown toolkit (segments, draggable points) — none of those primitives fix a topologically different problem (adjacent labelled regions / 3-D volumes vs. a 2-D coordinate plane). One tiny optional enrichment: page 10's "removable hole" aside (a rational function with a hole at x=4) is genuine graph content with zero visual today, but it's a footnote, not a core teaching point — low priority.
- **Ch.6** — pages 1, 2, 4, 8, 10 (basic shape/formula diagrams, a compass-construction proof) should stay static; no primitive gap is worth closing for a one-off use.

---

## Open items for a founder decision (not build items — need a call)

- **Ch.5, page 3**: already has a legacy `simulation` block (`circle-and-locus-explorer`, carried over from the Ch.1-era build) sitting on the page, but it teaches inside/outside/collinearity — not this page's actual content (circumcircle through 3 points via perpendicular bisectors). Once `circumcircle-explorer` exists, worth deciding whether to replace it.
- **Ch.2, pages 9 vs 11**: both teach the identical growth/decay pair (`C(d)=100+60d` vs `h(t)=3−0.5t`, and `P(t)=750+50t` vs `b(x)=600−15x`) with no diagram on either — building one interactive and cross-referencing it from the other page is probably enough; building both is likely redundant.

---

## Per-chapter detail

### Chapter 2 — Introduction to Linear Polynomials (26 pages, 11 published)

Zero `math_graph` blocks exist anywhere in the chapter today, despite being saturated with `y = ax + b` content that `line-explorer` was built for. All 8 non-hero image placeholders have `src: EMPTY` (never generated — free swaps).

| Page | Topic | Verdict |
|---|---|---|
| 1 `why-we-use-letters` | Sealed boxes of pens/pencils | Not graph territory (product/narrative image) |
| 2 `building-expressions-from-real-problems` | Rectangular garden, area/perimeter | Not graph territory (area diagram) |
| 5 `polynomials-to-equations` | Input-output machine metaphor | Not graph territory as drawn — but the underlying $y=2x+3$ has zero coordinate-plane visual anywhere on the page |
| 7 `linear-patterns-discovering-the-constant-step` | L-staircase tiles (1,3,5,7) | **Already covered** — `sequence-pattern(kind:'ap', a:1, d:2)` draws this exactly |
| 12 `meet-y-equals-ax-plus-b` | Annotated $y=ax+b$ | **Already covered** — `line-explorer`'s live equation display already does this |
| 15 `drawing-the-line` | $y=2x+1$ through two points | **Ready now** — spec mode: 2 points + 1 function |
| 16 `slope-the-geometric-meaning-of-a` | 3 lines through origin, negative slopes | **Ready now** — spec-mode family figure |
| 17 `y-intercept-and-parallel-lines` | 3 parallel lines, same slope | **Ready now** — spec-mode family figure |

**No-diagram gaps worth filling:** page 4 (`linear-polynomials-in-the-wild`, the formal definition — zero visual), page 9 & 11 (growth-vs-decay pairs, see founder-decision note above), page 23 (`the-hexagon-matchstick-pattern`, AP 6,11,16… — direct `sequence-pattern` fit), page 24 (`two-linear-polynomials-together`, a family of lines through a common point — spec-mode family figure).

**If only one thing:** retrofit `line-explorer` onto page 12 and the three family-figure pages (15/16/17) — the chapter's conceptual spine, and every later page assumes the student has already *seen* slope and intercept move.

---

### Chapter 3 — Number Systems (15 pages, draft)

Confirmed via code: `MathGraphSpec.showAxes` has no per-axis option (`MathGraphBoard.tsx` line 163 gates both axes on one boolean), so a true number line can't render cleanly inside `math_graph` — this chapter's own existing precedent (`brahmagupta-zero-line`, a `simulation` block on page 3) already routes 1-D content to the right tool.

| Page | Topic | Verdict |
|---|---|---|
| 1 `the-need-to-count` | Ishango bone artifact photo | Not graph territory |
| 5 `rationals-on-the-number-line` | Placing 3/4, 9/4 by subdividing a unit interval | Different tool — generalize the existing number-line sim |
| 6 `density-of-rational-numbers` | Zoom/midpoint on [1, 3/2] | Different tool — same sim, extended mode |
| 7 `irrational-numbers` | Unit right triangle, hypotenuse = √2 | **Ready now** — spec mode (2 segments + labels), genuinely 2-D and static |
| 9 `constructing-surds-on-the-line` | √2 construction: right triangle + compass arc onto the number line | **New archetype needed** — `surd-spiral-construction` (Spiral of Theodorus), the chapter's one real 2-D geometric construction |
| 14 `the-real-number-line` | Nested-set diagram ℝ⊃ℚ⊃ℤ⊃ℕ | Not graph territory (Venn/containment, not coordinates) |

**No-diagram gap:** page 10 (`the-story-of-pi-and-madhava`) presents Mādhava's series with no visual — a partial-sums-converging-to-π plot would need a `series-convergence` archetype (related to, but distinct from, Ch.8's partial-sum gap). Lower priority — nice-to-have, not a currently-broken placeholder.

**If only one thing:** `surd-spiral-construction` for page 9 — the chapter's only authentically 2-D content, and the visual/pedagogical anchor of its page.

---

### Chapter 4 — Exploring Algebraic Identities (13 pages, draft)

Only 4 of 13 pages have a non-hero image; all four are area-tile or 3-D volume decompositions — a fundamentally different visual grammar from a coordinate plane. **This chapter needs no math_graph work.**

| Page | Topic | Verdict |
|---|---|---|
| 2 `visualising-the-square-of-a-sum` | $(a+b)^2$ area-tile diagram | Correctly not graph territory |
| 5 `the-three-term-square` | $(a+b+c)^2$ 3×3 tile grid | Correctly not graph territory |
| 6 `factorising-with-algebra-tiles` | $x^2+7x+12$ as literal algebra tiles | Correctly not graph territory (the textbook example of the wrong-tool case) |
| 8 `the-cube-of-a-binomial` | $(a+b)^3$ exploded 3-D cube | Not graph territory — this is 3-D, `math_graph` is flat |

One tiny optional enrichment: page 10's "removable hole" aside describes a rational function with a graph discontinuity, purely in text, with no visual anywhere — genuine graph content, but a footnote not a core teaching point. Low priority; would need an open-circle marker primitive that spec mode doesn't have yet either.

**This re-confirms the original 2026-06 build decision** even against the grown toolkit (segments, draggable points) — those primitives don't close a topological gap (tiles/volumes vs. coordinates).

---

### Chapter 5 — Circles (13 pages, draft)

Every one of the 11 non-hero images needs a **brand-new, axis-free "circle theorem" archetype family** — none of the 18 existing archetypes fit, because NCERT's Class 9 Circles is classical Euclidean construction (chords, arcs, inscribed angles, cyclic quadrilaterals), conventionally drawn *without* axes. Confirmed from the code, not assumed: `spec.showAxes`/`showGrid` can be turned off independent of archetype mode (already proven by `circle-locus-explorer`/`vlt-sweep`), and JSXGraph's `angle` primitive (live angle-glyph readouts) is fully supported but unused by any current archetype.

| Page | Topic | Proposed archetype |
|---|---|---|
| 1 `what-is-a-circle` | Parts of a circle | `circle-anatomy-explorer` |
| 2 `the-symmetry-of-a-circle` | Rotational/reflection symmetry | `circle-symmetry-explorer` (lowest priority — demonstration, not checkable) |
| 3 `how-many-circles-through-points` | Circumcircle through 3 points | `circumcircle-explorer` |
| 4 `equal-chords-and-central-angles` | Equal chords ⇔ equal central angles | `equal-chords-central-angle` |
| 5 `perpendicular-from-centre-bisects-chord` | Perpendicular bisects the chord | `chord-perpendicular-bisector` |
| 6 `equal-chords-are-equidistant` | Equal chords ⇔ equidistant from centre | `chord-distance-explorer` |
| 7 `which-chord-is-farther` | Longer chord ⇒ closer to centre | Same `chord-distance-explorer`, generalized param |
| 8 `angle-at-the-centre` | Central angle = 2 × inscribed angle | `inscribed-angle-explorer` — **build first** |
| 9 `angles-in-the-same-segment` | Angles in same segment are equal | Same `inscribed-angle-explorer`, extended to multi-point |
| 10 `cyclic-quadrilaterals` | Opposite angles sum to 180° | `cyclic-quad-explorer` |
| 11 `when-is-a-quadrilateral-cyclic` | Converse of the above | Same `cyclic-quad-explorer` |
| 12 `circles-theorem-toolkit` | Recap table | N/A — table block already serves it |

8 new archetypes cover all 11 pages (several share one build via a param). **Build `inscribed-angle-explorer` first** — highest reuse, most iconic theorem.

---

### Chapter 6 — Perimeter and Area (14 pages, draft)

Mostly classic mensuration (shape diagrams, formula cards) — correctly not graph-shaped for most pages. Checked specifically for the "area of a triangle given vertex coordinates" bridge to Chapter 1: **it does not appear anywhere in this chapter's current content.**

| Page | Topic | Verdict |
|---|---|---|
| 1, 2 | Perimeter basics, circumference | Not graph territory — labeled shape diagrams |
| 3 `length-of-an-arc` | Arc length | Optional/low-priority `arc-length-explorer` |
| 4 `perimeter-puzzles-and-paradoxes` | Angle-chasing proof diagrams | Not graph territory — one-off, spec mode has no arc primitive |
| 5 `area-of-a-rectangle` | Unit-square counting | Borderline — real version needs a `rectangle-area-explorer` (live square-counting); cheap version is spec mode without the "counting" payoff |
| 6 `area-of-a-parallelogram` | Cut-and-slide to a rectangle | **New archetype** — `parallelogram-to-rectangle` |
| 7 `area-of-a-triangle` | Congruent-triangle-pair to parallelogram | **New archetype** — `triangle-pair-to-parallelogram` (likely shares code with #6) |
| 8 `herons-formula` | Labeled scalene triangle | Ready now (spec mode) but low value — a formula card, not really benefiting from interactivity |
| 9 `brahmagupta-and-heron` | Cyclic quadrilateral | No diagram currently — `cyclic-quadrilateral-explorer` if one's ever added |
| 10 `squaring-a-rectangle` | Baudhāyana's compass construction | Not graph territory — needs compass arcs, neither spec mode nor any archetype has this primitive |
| 11 `area-of-a-circle` | Slice-and-rearrange πr² proof | **New archetype, highest value** — `circle-area-slice-rearrange` |
| 12 `area-of-a-sector` | Sector area | **New archetype** — `sector-explorer`, cheap (extends `unit-circle`) |
| 13 | Toolkit table | N/A |

**If only one thing:** the circle-area slice-and-rearrange interactive (page 11) — the chapter's most iconic proof.

---

### Chapter 7 — Probability (11 pages, draft)

Class 9 NCERT Probability (experimental/empirical, not combinatorial) is overwhelmingly not coordinate-plane content — frequency counting, set membership, branching outcomes. Zero `math_graph` or `simulation` blocks exist in this chapter today. Only 3 of 11 pages have any non-hero image.

| Page | Topic | Verdict |
|---|---|---|
| 3 `the-probability-scale` | 0–1 number line with event markers | Marginal — a full 2-D board is the wrong shape for a single number line; not worth a one-off archetype |
| 6 `experimental-vs-theoretical` | Relative-frequency-vs-trials convergence toward 0.5 | **Genuine math_graph territory** — currently misplaced as the page's static hero image rather than a content diagram. Build a `trial-convergence` archetype and move it into the page body. |
| 8 `sample-spaces-and-events` | Venn/set diagram (S, E ⊂ S) | Not graph territory — needs a dedicated Venn/set component (new block type) |
| 9 `tree-diagrams` | Branching tree for multi-step experiments | Not graph territory — needs a dedicated tree-diagram component (new block type) |

**If only one thing:** the trial-convergence archetype for page 6 — the one page in the chapter that's actually graph-shaped.

---

### Chapter 8 — Sequences and Progressions (12 pages, draft)

The most graph-native chapter of the seven — `sequence-pattern` conceptually fits 2 of 5 non-hero images, the highest hit rate of any chapter reviewed. But neither is a true drop-in yet: both textbook examples exceed the archetype's current slider ranges.

| Page | Topic | Verdict |
|---|---|---|
| 1 `what-is-a-sequence` | Triangular numbers (quadratic growth) | `sequence-pattern` needs extending — `kind:'ap'\|'gp'` can't express quadratic growth at all |
| 5 `visualising-an-ap` | AP 1,5,9,13,17 (d=4) as a line of points | **Already covered conceptually**, but d=4 exceeds the archetype's current d-max of 3 |
| 7 `sum-of-first-n-natural-numbers` | Gauss staircase-to-rectangle proof | **New archetype needed** — `sum-pairing-proof`; zero existing coverage for partial sums (Sₙ) anywhere in the tool |
| 9 `fun-with-fractals` | Sierpiński triangle self-similarity | Not graph territory — 2-D fractal geometry, not a sequence plot |
| 10 `visualising-a-gp` | GP 24,18,13.5… (a=24, r=0.75) exponential decay | **Already covered conceptually**, but a=24 exceeds the archetype's current a-max of 5 |

Pages 4, 5, 8 already carry separate legacy `simulation` blocks (`linear-pattern-explorer`, `tile-pattern-explorer`, `growth-decay-visualizer`) — pre-existing interactivity independent of this report.

**If only one thing:** widen `sequence-pattern`'s slider ranges (small, high-leverage) — it unlocks two pages instantly — then build `sum-pairing-proof` for the Gauss proof, since Sₙ has zero coverage anywhere in the tool today.
