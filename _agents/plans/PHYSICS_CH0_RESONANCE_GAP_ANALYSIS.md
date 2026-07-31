# Resonance "Mathematical Tools" module — gap analysis against our Ch.0

**Date:** 2026-07-27 · **Source:** *Mathematical Tools*, Resonance Class-XI (Canvas Classes edition), 82 pp — read in full: §1–5 theory, all 76 numbered Solved Examples, Miscellaneous Problems, Exercise #1/#2/#3 and the Answers section.
**Founder framing:** *"the exact format and flow followed for JEE coaching … basic differentiation and integration are also covered in this chapter only, we need all that information before we actually begin studying mechanics."*

This is the third source studied for Ch.0, after NCERT (spine) and HC Verma (pedagogy). Where they disagree, **this one wins on scope and sequencing**, because it is the actual coaching contract: everything mechanics needs, taught before mechanics starts.

---

## 1. The headline finding — our page budget is inverted

Page counts inside the module's 40 pages of theory:

| Unit | Resonance | Our Ch.0 plan |
|---|---|---|
| Function | 2 | **0 — we have no Function page at all** |
| Trigonometry | 5 | 2 |
| **Differentiation** | **15** | 1 ("calculus preview") |
| **Integration** | **7** | 1 (folded into the same preview) |
| Vectors | 12 | 7 |
| **Calculus total** | **22 pp — the largest unit by far** | **2** |

**Calculus is ~1.8× the size of vectors in the coaching module. In our plan it is less than a third of vectors.** That is the single biggest correction this source demands.

And the exercise weighting: **~42 of 82 pages (51%) are exercises + answers.** Half the module is practice — which independently confirms the HC Verma ratio finding, from a completely different source.

## 2. The exercise architecture — this *is* the "format and flow"

Three graded tiers, and the grading is itself the pedagogy:

**Exercise #1 — drill, organised by sub-skill.** Lettered sections, one skill each, nothing mixed:
- *Part I Function & Differentiation:* **A** Function · **B** Elementary functions · **C** Product rule · **D** Quotient rule · **E** Chain rule · **F** Implicit functions · **G** Rate measurement · **H** Maxima & minima · **I** Miscellaneous
- *Part II Integration:* **A** Elementary · **B** Substitution · **C** Definite · **D** Area
- *Part III Vector:* **A** Definition & angle between · **B** Addition · **C** Resolution · **D** Products

**Exercise #2 — mixed and harder.** Continuous numbering, no section headings. *"I don't want to bias your ideas beforehand by telling you which section this belongs to"* is HC Verma's phrasing of the same idea. Subjective → objective → multi-correct (`*`).

**Exercise #3 — exam question *formats*:** Match the Column · Comprehension (one passage → 3 questions) · Assertion/Reason (Statement-1 / Statement-2, fixed 4 options) · True/False · Fill in the Blanks.

> **Recommendation A — adopt all three tiers.** Tier 1 and 2 need **zero new code**: `practice_bank` already has titled `sections` and `mcq`/`numerical` items, which maps exactly onto the lettered-section structure. Tier 3 is the gap — see §6.

## 3. Content we are missing entirely

### Function (we have no page — and calculus is unteachable without it)
Domain, range, the function machine, `f(x)` vs `f`, evaluating `f(0)`, `f(x+2)`, **`f(f(2))`**. Four solved examples. Must come **before** trigonometry, because "y is a function of x" is the sentence every later definition leans on.

### Trigonometry — ours is roughly a third of theirs
- **Six** functions, not three — cosec, sec, cot are used constantly in differentiation.
- **Standard-values table including 37° and 53°** (sin 37° = 3/5, cos 37° = 4/5). Both this source and HC Verma use them everywhere; we use none.
- **The CAST rule** and the two reduction rules — `nπ ± θ` keeps the function, `(2n+1)π/2 ± θ` switches to the co-function, sign by CAST. This is how you evaluate sin 120°, cos 210°, tan 210° without a calculator.
- **Compound-angle and double-angle formulas**, plus **sine rule and cosine rule** for triangles.
- Positive vs negative angles / standard position.

### Differentiation — the whole unit is missing
- **Δ vs d** — the finite-difference table (`Δy` = 50 → 1 → 0.5) that makes "infinitely small" concrete before any limit is written.
- Slope of a line, sign by quadrant; average rate of change; **secant → tangent** as the limiting case.
- **13 numbered rules**, each boxed with worked examples: constant · power · constant multiple · sum · product · quotient · sin · cos · other trig · log & exp · **chain** · power chain · **radian vs degrees** (`d/dx sin(x°) = (π/180)cos x°` — a genuine exam trap).
- **Double differentiation** → and immediately `a = dv/dt = d²s/dt²`.
- **Differentiation as a rate of change, with six physics instances in one table:**
  `v = dx/dt` · `a = dv/dt` · `F = dp/dt` · `τ = dL/dt` · `P = dW/dt` · `I = dq/dt`.
  **This one table is the highest-value half-page in the module** — it shows a student that one idea unlocks six different chapters. Zero cost to us.
- **Maxima & minima** with the `d²y/dx²` test, applied to a particle's `x = 5t² − 9t + 3`, *including checking the limiting values* — a rigour step most books skip.
- **Related rates with an explicit 6-step strategy** (draw and name → write what you know → write what you want → find the relating equation → differentiate w.r.t. t → substitute). The balloon and police-cruiser problems. **A transferable procedure — a perfect `step_solver`.**

### Integration — also missing
- Framed as **the inverse operation** ("as subtraction is to addition"), then antiderivative and `+C`.
- **A formula table with two columns: the integral, and the reversed derivative formula beside it.** Integration is presented as visibly undoing differentiation.
- Rules: constant multiple, sum/difference, **substitution** (with the 3-step recipe and six worked examples).
- Definite integration and `[g(x)]ᵇₐ`.
- **Area under a curve** as the sum of `dA = f(x) dx` strips.
- **Example 48: solve `dv/dt = 9.8` with `v(0) = 0`.** This is an initial-value problem — i.e. *exactly how `v = u + at` is actually derived*. Without it, kinematics equations are magic.

### Vectors — we are closest here, but still short
- The definition uses **three conditions**: has direction, **is commutative**, **obeys the parallelogram law** — with the counterexample list (*time, pressure, surface tension, current have direction but are not vectors*). Stronger than our current single-condition fix.
- Invariance points: parallel translation does not change a vector; rotation does; **translating or rotating the frame does not change the vector, though its components change**.
- **Direction cosines** in 3-D, `cos²α + cos²β + cos²γ = 1`.
- Dot product: ~10 listed properties, projection/component form `A·B̂`, self-dot `A = √(A·A)`.
- Cross product: right-hand-thumb rule, the **determinant form**, area of the parallelogram, `î×ĵ = k̂` cycle.
- Resolution along **two arbitrary non-perpendicular directions** (`A = λa + μb`), not just rectangular.

## 4. Their worked-example style — worth copying

76 examples, numbered **continuously across the whole module**, so a student can say "I'm stuck on Example 51". Most are 3–6 lines. Three habits worth stealing:

1. **Right vs Wrong shown side by side.** Example 44 gives a correct integral and an incorrect one, and *checks both by differentiating*. Teaching the verification habit, not just the answer.
2. **A running margin commentary.** In substitution examples every line is annotated on the right — "Let u = 2θ, du = 2dθ" · "Integrate with respect to u" · "Replace u by 2θ". That is exactly our `step_solver` `say` field.
3. **Two methods, then compared.** Example 69 solves a displacement **(a) graphically and (b) by components**, then reconciles the −74° from the calculator against the 105° from the figure. Excellent — and it is precisely what our `vector_board` + a `step_solver` side by side can do better than paper.

## 5. Recommended Ch.0 restructure — 17 pages → ~26

| # | Page | Status |
|---|---|---|
| 0 | Chapter opener | built |
| 1 | Why physics leans on maths | built |
| 2 | Powers of ten | built |
| 3 | Rearranging formulas & proportionality | built |
| **4** | **Function — the machine, domain, range** | **NEW** |
| 5 | Trigonometry I — six ratios, standard angles **incl. 37°/53°** | rebuild p4 |
| **6** | **Trigonometry II — CAST, angles beyond 90°, sine & cosine rule** | **NEW** |
| 7 | Small-angle shortcut | built |
| 8 | Scalars and vectors | built (HC Verma fix landed) |
| 9 | Anatomy of a vector | built |
| 10 | Triangle law | built (rebuilt discovery-first) |
| 11 | Parallelogram law | planned |
| 12 | Subtraction | built |
| 13 | Resolution + direction cosines | planned |
| 14 | Dot & cross products `tier: competitive` | planned |
| **15** | **Δ vs d — what "rate of change" means** | **NEW** |
| **16** | **Slope, secant → tangent, the derivative** | **NEW** |
| **17** | **The differentiation rules (power, sum, product, quotient)** | **NEW** |
| **18** | **The chain rule** | **NEW** |
| **19** | **Second derivative + the six physics rates** | **NEW** |
| **20** | **Maxima & minima + related rates (6-step strategy)** | **NEW** |
| **21** | **Integration as undoing — antiderivative, +C, the paired table** | **NEW** |
| **22** | **Substitution** | **NEW** |
| **23** | **Definite integrals & area under a curve** | **NEW** |
| **24** | **Initial-value problems — deriving `v = u + at`** | **NEW** |
| 25 | Binomial approximation | planned |
| **26–28** | **Practice 1 (by sub-skill) · Practice 2 (mixed) · Practice 3 (exam formats)** | **NEW** |

**11 new calculus pages.** That is the change this source is really asking for.

## 6. The only new code worth building

Tiers 1 and 2 need nothing. Tier 3 needs three question *formats* we cannot currently express. Cheapest route is **new item kinds on the existing `practice_bank`, not new block types**:

| Format | Today | Proposal |
|---|---|---|
| **Comprehension** (one passage → 3 linked Qs) | **No way to express a shared stem** | add an optional `stem` to `PracticeBankSection` — items under it render beneath the passage |
| **Assertion / Reason** | Possible as an `mcq`, but the 4 fixed options must be retyped every time | new item kind `assertion_reason` with `statement_1`, `statement_2`, `answer` — options templated by the renderer |
| **Match the Column** | `classify_exercise` is classify-into-buckets, not A–D ↔ p–s pairing | new item kind `match_columns` with `left[]`, `right[]`, `pairs[]` |

That is one schema change plus renderer work on one existing block — far cheaper than three new block types, and it keeps everything inside the practice UI students already know.

## 7. What I would *not* copy

- **The visual style.** Grey boxed rules, clip-art hammers and archers. Our design system is better; keep ours.
- **Answers-only at the back.** They give final answers with no worked solutions for the exercises. Our `numerical` items carry a full tap-to-reveal solution — strictly better, keep it.
- **Their vector diagrams.** Static. Our boards are the one place we clearly beat all three sources.
- **The `sec`/`cosec`/`cot` derivative rules as memorisation.** Keep them in a reference table, but do not drill them — JEE Physics needs `sin`, `cos`, `tan`, `xⁿ`, `eˣ`, `ln x` fluently and the rest rarely.

## 8. Recommended order of work

1. **The six-physics-rates table** — half a page, highest value-per-word in the whole study. Drop it into the differentiation unit the moment that page exists.
2. **Function page** — blocks everything in calculus; cheap.
3. **Trigonometry rebuild** (37°/53° + CAST) — unblocks every resolution problem and both other sources demand it.
4. **The 11 calculus pages**, in the order above, each following §4A of the HC Verma analysis (situation → practice → rule as conclusion) and each carrying `step_solver`s.
5. **Practice tiers 1 and 2** as `practice_bank`s (no code).
6. **The three new item kinds**, then Practice tier 3.
