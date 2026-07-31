# Class 11 Math Live Book — Chapter Plan: **Trigonometric Functions** (NCERT Ch.3)

> **Status: BUILD-READY / building now — 2026-07-24.** RAW-STRUCTURE first pass (Track A — the
> `math_graph` `unit-circle` archetype is the chapter's flagship). Spine: NCERT Class 11 Mathematics
> **Chapter 3 — Trigonometric Functions** (source PDF: `…/Math Books/NCERT Class 11 Maths/
> Ch3 - Trigonometric Functions.pdf`, read in full, Rule 0 satisfied — every NCERT example/exercise
> below was quoted/verified directly from the source, not from training memory).
> Book: `class11-mathematics`. Chapter number **3**, slug `trigonometric-functions`. All pages
> `published:false`, chapter `is_published:false`, per CLAUDE.md §0.6 / the founder-review gate that
> governed Ch.0 and Ch.2.

---

## 0. Important source finding (read before building)

The **current, rationalized NCERT edition** ("Reprint 2026-27") of Ch.3 **does NOT contain a
"3.5 Trigonometric Equations" section.** The chapter runs: 3.1 Introduction → 3.2 Angles (degree +
radian) → 3.3 Trigonometric Functions (unit-circle def, signs, domain/range, graphs) → 3.4
Trigonometric Functions of Sum and Difference of Two Angles (through triple-angle and
sum-to-product/product-to-sum) → Miscellaneous Examples/Exercise → Summary → Historical Note. There
is no Exercise 3.4; the last numbered exercise is **3.3** (25 "prove that" items), followed only by
the Miscellaneous Exercise. General solutions of trigonometric equations were moved out of this
chapter in the syllabus rationalization.

**Judgment call (flagging for founder review):** the task brief explicitly asked for a page on
general solutions (`sinθ=sinα ⟹ θ=nπ+(-1)ⁿα`, etc.) as core JEE/competitive content, and this is
extremely standard, well-established mathematics (not something requiring image-verification — it is
not attributed to NCERT anywhere in this build). **Page 8 below is therefore added as clearly-marked
enrichment beyond the current NCERT chapter body**, using the author's own worked numbers (not NCERT
examples), because (a) it is foundational for JEE Main/Advanced, (b) every competitive-exam resource
in this repo's source folders treats it as inseparable from this chapter, and (c) skipping it would
leave the chapter unable to support JEE-style practice later. All `worked_example` blocks on that page
use `variant:'solved_example'`, never `'ncert_intext'`, and the page text says explicitly that this
extends beyond the current textbook body. **Founder: confirm this call** — the alternative is to defer
the whole topic to a later "Trigonometric Equations" mini-chapter.

---

## 1. Final page list (11 pages, 0–10)

| # | Slug | Title | Scope | `math_graph` |
|---|---|---|---|---|
| 0 | `trigonometric-functions-opener` | Trigonometric Functions | Hook (Ferris wheel / clock / sound wave — periodicity in daily life), roadmap bullets | — |
| 1 | `measuring-angles-degree-radian` | Measuring Angles — Degree & Radian | §3.2: degree measure, radian measure, `l = rθ`, conversion; NCERT Examples 1–5; degree↔radian table | `unit-circle` (**first exposure, ungated** — arc length = angle in radians, sin/cos values shown but *named next page*) |
| 2 | `unit-circle-sin-cos` | The Unit Circle — Defining sin and cos | §3.3 core def (cos x = a, sin x = b), sin²+cos²=1, quadrantal angle values, negative-angle identities sin(−x)=−sinx / cos(−x)=cosx | `unit-circle` (**predict gate, earned**: does cos θ turn negative before or at θ=90°?) + 1 static spec `math_graph` (circle + two labelled points illustrating the negative-angle mirror) |
| 3 | `domain-range-six-functions` | Domain, Range & the Six Functions | cosec/sec/tan/cot as reciprocals + their excluded points; `1+tan²=sec²`, `1+cot²=cosec²`; domain/range of all six; NCERT Examples 6–7 (given one ratio + quadrant, find the other five) | — (pure algebra page; reuses the sin²+cos²=1 idea from page 2) |
| 4 | `signs-quadrants-cast` | Signs & Quadrants — the CAST Rule | §3.3.1 sign table by quadrant, §3.3.2 increasing/decreasing behaviour table, the CAST mnemonic, NCERT Examples 8–9 (periodicity: sin(31π/3), cos(−1710°)) | `unit-circle` (**predict, earned**: in Q3, are sin θ and cos θ both negative?) |
| 5 | `graphs-of-sin-cos-tan` | Graphs of sin, cos and tan | §3.3 graphs (Fig 3.8–3.13): period 2π (sin/cos) vs π (tan/cot), amplitude, domain gaps/asymptotes of tan/cot/sec/cosec | 2 spec `math_graph` (sin+cos family figure; tan alone with asymptote annotations) |
| 6 | `sum-difference-double-angle` | Trig Functions of Sum & Difference of Two Angles | §3.4 addition formulas (cos(x∓y), sin(x±y), tan(x±y), cot(x±y)); double angle sin2x/cos2x(3 forms)/tan2x; triple angle sin3x/cos3x/tan3x; NCERT Examples 10–15 | 1 small spec `math_graph` (point on y=cos x marking the just-computed cos75° value — ties algebra back to the curve) |
| 7 | `sum-to-product-formulas` | Sum-to-Product & Product-to-Sum | NCERT Identities 20–21 (cosx±cosy, sinx±siny as products; and the reverse); Examples 16–17 | — |
| 8 | `trigonometric-equations` | Solving Trigonometric Equations *(enrichment — see §0)* | General solutions: sinθ=sinα, cosθ=cosα, tanθ=tanα; own worked examples solving sinθ=1/2, cosθ=−1/2, tanθ=√3 | `unit-circle` (**predict, earned**: for sinθ=0.5 there are two θ in one revolution — find both; ties into the `(-1)ⁿ` pattern) |
| 9 | `trigonometric-functions-recap` | Recap | Retrieval-first: one-paragraph chapter arc, formula-card recap table, swap-traps table, 2 reasoning checks, 8-Q integrative quiz — mirrors ch2 page9 pattern exactly | — |
| 10 | `trigonometric-functions-practice-ncert` | Practice — NCERT Exercises | `practice_bank`: **all 52** NCERT Ch.3 exercise questions (Ex 3.1 ×7, Ex 3.2 ×10, Ex 3.3 ×25, Miscellaneous ×10), regrouped into 6 revision themes, each with a full worked solution in the book's plain teacher voice | — |

**Total interactives:** 5 `math_graph` blocks using the `unit-circle` archetype (pages 1, 2, 4, 8 — 4
distinct uses across the chapter, each with a different framing/predict — plus one static spec-mode
circle-and-points figure on page 2) + 3 spec-mode `math_graph` blocks (pages 5 ×2, 6 ×1) = **8
`math_graph` blocks total.**

---

## 2. Why `unit-circle` is reused four times (not a repetition bug)

Per `MATH_BOOK_PAGE_WORKFLOW.md` §4, the hard-won rule is: first exposure is ungated exploration,
later exposures earn a predict gate. The unit-circle archetype is this chapter's flagship precisely
because **four different ideas all live on the same picture**:

1. **Page 1** — the *arc-length* meaning of a radian (ungated: "watch the point sweep; the distance it
   travels on this circle of radius 1 IS its angle in radians"). The archetype's built-in `sin θ =` /
   `cos θ =` readouts are deliberately left unexplained here ("hold that thought — that's the very
   next page"), a curiosity-generating device consistent with Ch.0's concreteness-first pattern.
2. **Page 2** — the *definitional* meaning (height = sin, shadow = cos), now named, with an earned
   predict about the sign flip at 90°.
3. **Page 4** — the *sign* meaning (CAST), an earned predict about Q3.
4. **Page 8** — the *equation-solving* meaning (two points on the circle share a height — the origin
   of the `(-1)ⁿ` term in the general solution), an earned predict.

This is the multi-representation "same picture, growing meaning" arc the parent plan (`MATH_LIVEBOOK_PLAN.md`
§4, Track A) names as the chapter's specific promise: *"a rotating point, height=sin, shadow=cos →
makes periodicity/sign-changes visible → fade to ratios."*

**Tool limitation found:** the `unit-circle` archetype's θ slider is hard-coded `min:0, max:6.283`
(archetypes.ts) — it cannot go negative. So the negative-angle identities (page 2) are shown via a
**second, static spec-mode graph** (two fixed labelled points on a circle approximated by
`sqrt(1-x^2)` / `-sqrt(1-x^2)` halves) rather than by dragging θ negative on the archetype.

## 3. Expression-engine finding (spec mode)

Spec-mode `functions[].expr` strings are parsed by **JSXGraph's JessieCode** engine
(`board.jc.snippet(...)`), not mathjs as the original architecture plan assumed — confirmed by reading
`MathGraphBoard.tsx` and `node_modules/jsxgraph/src/parser/jessiecode.js`. JessieCode resolves any bare
identifier that exists on the native `Math` object (or on `JXG.Math`) as a callable, so **`sin(x)`,
`cos(x)`, `tan(x)`, `sqrt(x)`, `abs(x)`, `exp(x)`, `pow(x,n)`, and `cot(x)`** (JXG.Math has `cot`) all
work directly in spec-mode `expr` strings. **`sec(x)` and `csc(x)` are NOT registered anywhere** (no
`Math.sec`, no `JXG.Math.sec`) — so this build writes them as `1/cos(x)` and `1/sin(x)` wherever a
reciprocal graph is needed (none were needed in this pass; noted for the refinement pass if cosec/sec
graphs are added later). The `BASE_FUNCS` table used by `transformations`/`shift-explorer`/
`stretch-explorer` archetypes only registers `sin`, not `cos`/`tan` — irrelevant here since this
chapter's sin/cos/tan graphs (page 5) are built in spec mode directly, not via those archetypes.

---

## 4. Scope boundaries

**In (NCERT Ch.3 core, full coverage):**
- Degree and radian measure, conversion, arc length `l=rθ` (all of §3.2, Ex 3.1 — 7 Qs)
- Unit-circle definition of sin/cos, the four other ratios as reciprocals/quotients, `sin²+cos²=1`
  and its two derived Pythagorean identities, domain/range of all six functions, quadrantal values,
  negative-angle identities, signs by quadrant (CAST), increasing/decreasing behaviour, periodicity
  (Ex 3.2 — 10 Qs)
- Graphs of all six functions (period, amplitude, asymptotes)
- Sum/difference formulas, double-angle, triple-angle, sum-to-product/product-to-sum, and their
  worked examples (Ex 3.3 — 25 Qs, all "prove that" identity drills)
- Miscellaneous Examples 18–22 and Miscellaneous Exercise (10 Qs, including half-angle
  sin(x/2)/cos(x/2)/tan(x/2) from one ratio + quadrant)

**Enrichment beyond the current NCERT body (flagged, §0):**
- Page 8, general solutions of trigonometric equations — own worked numbers, not NCERT-attributed.

**Deferred to a later refinement pass (explicitly out of scope for this raw-structure pass):**
- Extra simulations beyond the unit-circle archetype (e.g. a dedicated "graph-matching" challenge
  block using `challenge:{targets,...}` for the sin/cos graphs — the `challenge` feature requires an
  archetype exposing `snapshot()`, which the sin/cos/tan spec-mode graphs on page 5 do not have; adding
  a `challenge`-capable trig archetype is a follow-up code ship, not this pass).
- A richer worked-example ladder (fully-worked → faded → solo) for the sum-to-product proofs — this
  pass gives every exercise item a complete solution but does not yet fade any of them.
- `Inverse Trigonometric Functions` — a separate, later NCERT chapter (Class 12), not touched here.
- Height-and-distance application problems — not part of this NCERT chapter (they belong to the
  applied "Introduction to Trigonometry" continuum from Class 10, already covered elsewhere).

---

## 5. NCERT source inventory (for the practice bank, page 10)

Quoted/verified directly from the source PDF (Rule 0 — every prompt below was read from the image,
not generated from training knowledge):

| Exercise | Count | Nature |
|---|---|---|
| Ex 3.1 | 7 | Degree↔radian conversion, arc length, pendulum, wheel revolutions, chord-to-arc |
| Ex 3.2 | 10 | Q1–5: given one ratio + quadrant, find the other five. Q6–10: evaluate trig functions of "large"/negative angles via periodicity (sin765°, cosec(−1410°), tan(19π/3), sin(−11π/3), cot(−15π/4)) |
| Ex 3.3 | 25 | Q1–5: evaluate/exact-value (incl. sin75°, tan15°). Q6–25: "prove that" identities via sum-difference, multiple-angle and sum-to-product manipulation |
| Miscellaneous | 10 | Q1–7: prove identities combining sum-to-product + addition formulas. Q8–10: find sin(x/2), cos(x/2), tan(x/2) from one ratio + quadrant |
| **Total** | **52** | |

Regrouped into 6 revision themes for the practice bank (not textbook running order, matching the Ch.2
practice-bank precedent):
1. Angle conversion & arc length (Ex 3.1, 7)
2. Given one ratio, find the other five (Ex 3.2 Q1–5, 5)
3. Evaluate via periodicity / large angles (Ex 3.2 Q6–10, 5)
4. Evaluate & prove — addition and multiple-angle formulas (Ex 3.3 Q1–11, 11)
5. Prove — sum-to-product transformations (Ex 3.3 Q12–25, 14)
6. Miscellaneous — bringing it together (Misc Q1–10, 10)

---

## 6. Build sequencing

1. Copy `_book.js` → `_book_ch3.js` with `CH = {number:3, title:'Trigonometric Functions',
   slug:'trigonometric-functions', description: ...}` (§0.6-safe: additive, does not touch chapters
   0/2's scaffold or data).
2. `build_ch3_pages_0_4.js` — pages 0–4.
3. `build_ch3_pages_5_8.js` — pages 5–8.
4. `build_ch3_recap_practice.js` — pages 9–10 (recap + the 52-question practice bank).
5. Run each, then `npx tsx scripts/math11-book/_validate.mts` until `✅ ALL VALID`.
6. `node scripts/livebooks-state.js` to refresh `_agents/state/LIVE_BOOKS_STATE.md`.

### Sources
- NCERT Class 11 Mathematics, **Ch.3 Trigonometric Functions** — spine (full chapter read from PDF).
- `_agents/workflows/MATH_BOOK_PAGE_WORKFLOW.md` — page rhythm, gating rule, `math_graph` toolkit.
- `_agents/plans/MATH_LIVEBOOK_PLAN.md` §3/§4 — math-averse pedagogy, Track A framing for this chapter.
- `packages/book-renderer/blocks/math-graph/archetypes.ts` + `MathGraphBoard.tsx` — archetype/engine
  capabilities and limits (θ-slider range, JessieCode function support).
- `scripts/math11-book/build_ch0_meet_graphs.js`, `build_ch2_pages_0_4.js`, `build_ch2_pages_5_9.js`,
  `build_ch2_practice.js` — structural templates followed exactly.
