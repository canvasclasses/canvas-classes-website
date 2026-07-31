# HC Verma Ch.2 "Physics and Mathematics" — gap analysis against our Ch.0

**Date:** 2026-07-27 · **Source:** *Concepts of Physics* Part 1, H C Verma — Chapter 2, book pp. 12–30 (read directly from the PDF, §2.1–2.14 + all 18 Worked Out Examples + Objective I/II + all 35 Exercises).
**Purpose:** founder direction — *"physics and math are mostly about application; focus on getting students to practise more and more rather than teaching through theory. Teach through step-by-step practice."*

---

## 1. The one number that matters

| | HC Verma Ch.2 | Our Ch.0 (10 pages built) |
|---|---|---|
| In-text worked examples | 13 | 10 |
| Worked-out examples (harder, post-theory) | 18 | 0 |
| Questions for short answer | 14 | 3 (`reasoning_prompt` / `curiosity_prompt`) |
| Objective I + II (MCQ) | 11 | 26 (quiz) |
| Exercises (solve-it-yourself, answers at the back) | 35 | 0 |
| **Total problems** | **91** | **~39** |
| **Items where the student must act before seeing an answer** | **~78 (86%)** | **~5 (13%)** |

The volume gap is 2.3×. **The ratio gap is 6.6×** — and that is the real finding. Our pages *explain* and then *check*. HC Verma explains for a paragraph, then makes you work, over and over. His own preface names the goal: *"analyse the situation, make a strategy to invoke correct principles and work it out."*

## 2. The biggest single fix — we already own the right block and never use it

`step_solver` exists in the codebase: the student clicks through **every** line, and a load-bearing step **gates on a micro-interaction** (pick the operation / MCQ / fill in the blank) before the result line appears — plus a "why" toggle per step and a faded **now-you-try**. Its doc comment cites VanLehn's step-based tutoring result (d ≈ 0.76, near human tutoring, vs ~0.3 for answer-only).

**Platform-wide usage today: 1 block, in the Class 9 Math pilot. Physics Ch.0 uses 0.** Our Ch.0 carries 10 `worked_example` blocks, which are tap-to-reveal — i.e. *read the answer*.

> **Recommendation 1 (highest value): make `step_solver` the default teaching vehicle in Ch.0, and demote `worked_example` to reference-only.** This is literally the founder's "teach through step-by-step practice", and it needs zero new code.

Concretely, HC Verma's Example 2.3 becomes:

| His version | Ours |
|---|---|
| "A force of 10.5 N acts at 37° to the vertical. Find the vertical component." → prints `F cos37° = 10.5 × 4/5 = 8.40 N` | Step 1 *check (mcq)*: "Is the vertical part the cos or the sin piece?" → reveal `F∥ = F cos θ` · Step 2 *check (fill_blank)*: "cos 37° = ?" → reveal `4/5` · Step 3: reveal `= 8.40 N` · **Now you try:** 12.5 N at 53° to the vertical |

## 3. Content HC Verma has that our pages do not

Ordered by exam value. None of this is optional-looking — it is all standard JEE/NEET material.

**Vectors**
1. **Direction of the resultant:** `tan α = b sinθ / (a + b cosθ)`. We teach |R| but never *where it points*. Half of every two-vector question asks for the angle.
2. **Two equal vectors at θ:** `R = 2A cos(θ/2)`, and the resultant **bisects** the angle (his Example 2.1). Compact, memorable, heavily examined.
3. **Zero vector** and its properties. We never mention it.
4. **Unit vector along a given vector** — "write the unit vector in the direction of `A = 5î + ĵ − 2k̂`" (Worked 7). We introduce î/ĵ but never ask for `Â = A/|A|`.
5. **`|a + b| = |a − b| ⟹ a ⊥ b`** (Worked 8). The classic prove-it item.
6. **Dot product from components** `a·b = aₓbₓ + a_yb_y + a_zb_z`, then **angle between two vectors from components** (Worked 9). We have neither.
7. **Cross product from components** (the î/ĵ/k̂ expansion) and the right-hand rule.
8. **The 37°/53° convention** (cos 37° = 4/5). He uses it constantly; we use 30/45/60 only. Every JEE paper assumes 37/53.

**Calculus** — our plan called this a "preview"; he treats it as a working toolkit and he is right.
9. `dy/dx` **as a rate measurer, read off a graph by drawing tangents** (Example 2.6 — three tangents on one curve, one of them negative).
10. The **derivative table** (xⁿ, sin, cos, tan, ln, eˣ) + the product/quotient/chain rules.
11. **Maxima and minima**: `dy/dx = 0`, second-derivative sign — applied straight to `h = ut − ½gt²` to get `t = u/g` (Example 2.8). That single example is worth a page.
12. **Integration as the area under a curve**, built from summing strips, plus the integration table, and `∫v dv = −∫ω²x dx` for SHM (Worked 16).

**Measurement**
13. **Significant digits in calculations** + the **round-half-to-even** rule (Example 2.10 — `14.750 → 14.8` but `14.650 → 14.6`). Our plan parked this in Ch.1; his placement here is better because it applies to every numeric answer from day one.
14. **Errors: standard deviation** `σ = √(Σ(xᵢ − x̄)²/N)` with the 10-reading focal-length table (Example 2.13).

## 4. Problem *types* we have none of — this is the sharper gap than content

His problems are not "restate the definition". Five families we are missing entirely:

- **Read-the-figure, multi-vector resultant.** Worked 2, 3, 4, 5 all show a diagram of 3 vectors at marked angles → resolve each → sum components → magnitude and direction. **This is the actual exam skill** and we have zero of it. *Good news: it needs no new code — an `analytical-addition` board with non-draggable vectors + a `numeric` layer is exactly this.*
- **Reverse / constraint problems.** "The sum of the three vectors is zero — find |OB| and |OC|" (Worked 3). "The resultant of OA and OB is perpendicular to OA — find the angle" (Worked 6). These force reasoning backwards from a condition.
- **Real-world displacement.** The spy's car (2 km east, left turn, 500 m, right turn, 4 km) (Ex 7); the carrom queen (Ex 8); the mosquito flying to the opposite corner of a 3-D net (Ex 9 — genuinely 3-D). Concrete, memorable, and they make "displacement" real.
- **Elegant one-liners.** The regular hexagon whose six side-vectors sum to zero, used to *prove* `cos0 + cosπ/3 + … + cos5π/3 = 0` (Ex 12).
- **"Can you…?" conceptual probes.** "Can you add two vectors of unequal magnitudes and get zero? Three of equal magnitude?" "Can a vector have zero component along a line and still have nonzero magnitude?" 14 of these, no answers given — deliberately, to force discussion.

## 4A. His THEORY and PEDAGOGY — what to copy in how we explain

Founder direction (2026-07-27): *"not just the problem layer — use it for pedagogy and the theory part as well."* Re-read with that lens, seven habits stand out. These are the things that make his exposition better than ours, and all seven are free to adopt.

### (a) Discover the rule from a physical situation — never assert it
He does **not** open with "a vector is a quantity with magnitude and direction". He opens with a ball moving at 3 m/s **inside a tube** that is itself moving sideways at 4 m/s, draws where the ball is at `t = 0` and `t = 1 s`, and lets plain geometry give 5 m at 53°. **Only then**: *"The general rule for finding the resultant of two velocities may be stated as follows…"* The triangle rule arrives as the **conclusion of an observation**, not as a definition to be trusted.

> Our p8 does the opposite: it states the rule ("here is the whole rule…") and then illustrates it. **Invert this.** The guided board should open on the *situation*, and the rule should be the last step, not the first.

### (b) Define by BEHAVIOUR, not by attributes — and give the counterexample
His definition is: quantities with magnitude and direction **"and which can be added according to the triangle rule"** are vectors. Then immediately: *"Electric current in a wire has both magnitude and direction but there is no meaning of triangle rule there. Thus, electric current is not a vector quantity."*

> Our p6 uses the naive test — "does the direction matter?" — which **electric current passes**, so our definition is quietly wrong. Fix p6 to use the addition test, and add the current counterexample. It is the single sharpest paragraph in his chapter.

### (c) Derive the formula in three lines of geometry, then stop
The parallelogram result is not asserted. From his figure 2.5: `AD² = (AB + BE)² + (DE)² = (a + b cosθ)² + (b sinθ)² = a² + 2ab cosθ + b²`. Pythagoras, twice, done. Same for the direction: `tan α = DE/AE = b sinθ/(a + b cosθ)`.

> We assert `R = √(A² + B² + 2AB cosθ)` with no derivation at all. A student who has seen the three lines *owns* the formula; one who hasn't will misremember the sign. Put the derivation in a `step_solver` — it is exactly three gated steps.

### (d) Motivate a limit by showing the cruder idea failing
Calculus enters as `Δy/Δx = tanθ`, the slope of the chord `AB`. Then: *"However, this cannot be the precise definition of the rate. Because the rate also varies between the points A and B. The curve is steeper at B than at A."* → shrink `Δx` → the chord becomes the tangent. The limit is **the repair of an inadequacy the student has just felt**, not a ritual.

Same move for area: he sums rectangular strips, notes the little triangles poking out above each bar, and only then takes `N → ∞`.

### (e) Make the abstract concrete with a physical picture before the symbol
`dA/dL` for a square: grow the side from `L` to `L + ΔL`, and the area gains **two strips plus a tiny corner square** — `ΔA = 2L(ΔL) + (ΔL)²`. His figure 2.15 draws exactly that. Then "if `ΔL` is made smaller, `2L + ΔL` approaches `2L`". The derivative of `L²` being `2L` is now something you can *see*, not something you memorised.

He then proves `∫x dx = ½(b² − a²)` by summing an arithmetic progression of strip areas — the fundamental result established on **one concrete case** before any table is given.

### (f) Grow the definition out of the physical act
Significant figures do not start as a rule list. They start with a metre scale laid against an object whose end falls **between the 10.4 and 10.5 cm marks**; you mentally split the millimetre into ten and guess 10.46. *"The digits 1, 0 and 4 are certain but 6 is doubtful."* The idea of a **doubtful digit** is born from the act of measuring — the rules then just formalise something already felt.

Errors likewise begin with ten real focal-length readings in a table, mean, then σ computed column by column.

### (g) Be honest about what does not matter
- On the zero vector: *"it is convenient to have a vector of zero magnitude **although it has little significance in physics**."*
- On maxima/minima: *"Quite often it is known from the physical situation whether the quantity is a maximum or a minimum. **The test on d²y/dx² may then be omitted.**"*
- On the right-hand rule: *"The left handers should be more careful in using this rule as it must be practised with right hand only."*

> He tells students **when not to do work**. That builds trust and saves exam time. Our pages never do this. Add a "you can skip this step when…" note wherever it is honestly true.

### The rewritten page rhythm

Combining (a)–(g) with §6, every content page becomes:

```
situation  →  student works the geometry  →  the rule falls out  →  derivation (gated steps)
           →  step_solver example  →  step_solver example  →  "You solve it" strip  →  bridge
```

Exposition never runs more than ~120 words before the student has to do something. The **theory arrives as a conclusion**, roughly two-thirds of the way down the page — not as an announcement at the top.

## 5. What to change in the pages we have

| Page | Change |
|---|---|
| **p2 Powers of Ten** | Convert both `worked_example`s to `step_solver`. Add a 6-item drill bank. |
| **p3 Rearranging Formulas** | The 3 worked examples become `step_solver`s — rearranging *is* a step process, it is the perfect fit. Add the `V = 4/3 πR³ → dV/dR` rate item as a bridge to calculus. |
| **p4 Trigonometry** | **Add the 37°/53° row to the table** and a short "why 3-4-5 matters" note. Add a fill-in-the-blank drill on the five standard angles (speed matters more than derivation here). |
| **p6 Scalars and Vectors** | Add the spy-car and carrom-queen displacement problems as `step_solver`s. Add "can you get zero from two unequal vectors?" as a `reasoning_prompt`. |
| **p7 Anatomy of a Vector** | Add **unit vector** (`Â = A/|A|`, including a 3-D one) and the **zero vector**. Convert Example 1 to a `step_solver`. |
| **p8 Triangle Law** | Add `tan α = b sinθ/(a + b cosθ)` and the **R = 2A cos(θ/2)** result for equal vectors. Add a read-the-figure 3-vector board. |
| **p10 Subtraction** | Add `|a+b| = |a−b| ⟹ a ⊥ b`. Keep the ball/wall example — it already matches his style. |
| **New: p9 Parallelogram Law** | Build with the direction formula from the start, not just |R|. |
| **New: p11 Resolution** | Add the reverse problems (resultant ⊥ to A; sum = 0). |
| **New: p11b Dot & Cross** | Component forms + angle-between-from-components + right-hand rule. `tier: 'competitive'`. |
| **New: p13–14 Calculus** | Upgrade from "preview" to a working toolkit: tangent-slope-off-a-graph, derivative table, maxima/minima applied to projectile height, area-under-curve. |
| **New: p16 Chapter practice** | A large mixed bank. Target **≥60 items** so the chapter total lands near 90. |

## 6. The rhythm change (the thing that actually moves the needle)

Our current page shape is: hook → 2–3 paragraphs → diagram → worked example → quiz. His is:

> **half a page of concept → immediately a short numeric example → next concept → example → …** and then a wall of problems at the end.

**Recommendation 2: cap exposition at ~120 words between practice items.** Every concept gets a `step_solver` within one screen of being introduced. Long prose blocks get split, not trimmed.

**Recommendation 3: add an end-of-page "You solve it" strip** (3–5 items, answers revealed) to every content page, mirroring his Exercises. Right now practice only exists at chapter end.

## 7. What we do better — keep it

Worth stating so it does not get lost in a rewrite: his diagrams are static and his vector figures cannot be manipulated. Our guided `vector_board` (teach → click → one element draws) and the drag-to-match `target` and pick-the-diagram `identify` exercises do things his book physically cannot. Keep those as the *concept* layer; borrow his *problem* layer.

## 8. Recommended build order

1. Convert existing `worked_example` → `step_solver` across p2, p3, p6, p7 (highest ratio gain, no new content needed).
2. Add "You solve it" strips to p2–p10.
3. Add the missing vector results (direction formula, 2A cos(θ/2), unit vector, zero vector, perpendicularity test, component dot/cross).
4. Build p9, p11, p11b with the practice-first rhythm from the start.
5. Build the calculus pages as a toolkit, not a preview.
6. Build the ≥60-item chapter practice bank.
7. Add 37°/53° to p4 and use it throughout.
