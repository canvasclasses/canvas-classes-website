# Class 11 Physics — Chapter 2: "Motion in One Dimension" — build plan

**Status:** 🟢 **ALL 18 PAGES BUILT (Waves 1–3 complete), 2026-07-29.** Every page Zod-clean and `published:false`, awaiting founder review.

**Chapter result:** 18 pages · **388 practice items** · 483 action-gated · **0 passive `worked_example` (100% gated)** · 197 MCQs at **53/50/44/50** · **12 length-tells (6%)** · **0 untagged questions**. Title byte-identical to Crucible `ph11_kinematics1d`, taxonomy link set (§18). For comparison: Ch.1 shipped 268 items; Ch.0 launched at ~39 items and 13% gated.

**Figures: DONE.** All 13 technical figures hand-authored as SVG, uploaded to R2 and wired to their blocks (`scripts/physics11-book/svg/figures_ch2.js` + `publish_ch2_figures.js`). Transparent backgrounds so they hold across all three reader themes; white text at the four mandated tiers only; two accents; no boxes. **Browser-verified against a programmatic audit that caught 7 real defects** — 4 text/text overlaps, 3 text-on-curve collisions, and an off-canvas marker — now 0 of each. The audit is kept as a reusable tool at `scripts/physics11-book/svg/audit.html` with run instructions in its footer; its text/stroke pass walks real path geometry via `getPointAtLength`, which is the only way to distinguish "label beside a curve" from "label on top of a curve". Only the **p0 hero remains empty**, deliberately — that is atmospheric art and belongs to the AI generation pipeline.

**Open, in priority order:**
1. **Step-solver floor** — 5 of 14 content pages now meet the founder's floor of 4 (p1, p2, p3, p9, p12). The other 9 sit at 3. Each needs one more solver; p3 was the worst at 2 and is now at 4.
2. **8 exposition runs still over the ~120-word cap** (down from 11), on p1, p4, p5 ×2, p6, p7 and p8 ×2. The worst is now 179 words, down from 269.

**What the gap-closing pass established, and it is worth reading before continuing it.** The naive move — insert practice immediately before the step-solver that ends a long run — *does not work*, because the prose is all still upstream of the insertion. The run has to be split **mid-prose**. Doing that on p2, p11 and one p8 run removed them outright; doing the naive thing on p5 and p7 left them exactly where they were. Every remaining run needs a mid-prose anchor, not an end-of-run one.

---

## 1. What each source actually contains

### 1.1 NCERT (the spine) — and the two holes the rationalisation left

| § | Content | Notes |
|---|---|---|
| 2.1 | Introduction — motion is change of position with time; **point-object approximation**; kinematics = describing motion without its causes | 1 column |
| 2.2 | **Instantaneous velocity and speed** — `v = lim Δx/Δt = dx/dt`; the limiting-value **Table 2.1** on `x = 0.08 t³` (Δt = 2.0 → 0.01 s, ratio → 3.84); velocity = slope of the tangent (Fig 2.1); instantaneous speed = \|instantaneous velocity\|, unlike the averages | Example 2.1 |
| 2.3 | **Acceleration** — Galileo's question (rate of change with *distance* or with *time*?) and why distance failed for free fall; `a = dv/dt` = slope of the v–t curve; x–t curvature for +/−/0 acceleration (Fig 2.2); the four v–t cases (Fig 2.3); **area under v–t = displacement** (Fig 2.4); the note that real graphs have no sharp kinks because velocity and acceleration are continuous | |
| 2.4 | **Kinematic equations for uniformly accelerated motion** — the trapezium derivation (Fig 2.5) giving `v = v₀ + at`, `x = v₀t + ½at²`, `v² = v₀² + 2ax`, plus the `x₀ ≠ 0` forms | Ex 2.2 (calculus derivation), 2.3 (ball from a 25 m building, **two methods**), 2.4 (free fall), 2.5 (**Galileo's odd numbers** 1:3:5:7, Table 2.2), 2.6 (**stopping distance** `d = v₀²/2a` + real car data), 2.7 (**reaction time** from a dropped ruler, 21.0 cm → 0.2 s) |
| 2.5 | **Relative velocity** — **listed in the chapter contents box, but its body is absent from this reprint** (see G2 below) | — |
| — | Summary (6 points) · **Points to Ponder (6)** · **Exercises 2.1–2.18** | Points to Ponder 2–4 are the sign-convention gold; all 18 exercises usable verbatim |

**What the rationalised edition removed** (present in the pre-2022 book, still fully examined):

- **G1 — the whole "Position, path length and displacement" and "Average velocity and average speed" section.** The chapter now opens at *instantaneous* velocity with no prior definition of displacement or average speed. Yet Summary point 1 still asserts "average speed ≥ \|average velocity\|", Exercises 2.9 and 2.10 are *entirely* about the distinction, and the Crucible tag `tag_k1d_1` is "Distance, Displacement & Speed". **Restored on p1–p2 from sources 2 and 3.**
- **G2 — §2.5 Relative velocity has a contents entry but no body text in our copy.** Exercise 2.14 (police van firing at a thief's car) needs it and `tag_k1d_6` exists. **Restored on p13 from source 2 §6.10 and source 3 §3.9.** *Flagged in §7 — confirm against a second NCERT copy before any page cites NCERT for this section.*

### 1.2 Source 2 (Mechanics Vol. 1 ch.6) — what it adds

| # | Addition | Exam weight | Lands on |
|---|---|---|---|
| A1 | **The graph taxonomy** — Table 6.2 (*s–t*: slope = v, area meaningless; *v–t*: slope = a, area = s; *a–t*: area = Δv), then all three graphs drawn side-by-side for the **four canonical motions** (uniform · uniformly accelerated · uniformly retarded · retarded-then-reversed) | Very high — this is the chapter's hardest skill | p4, p7, p8 |
| A2 | **Distance ≠ displacement in SUVAT.** The `s` in `s = ut + ½at²` is displacement. When `u` and `a` oppose, find `t₀ = \|u/a\|` first; for `t > t₀`, `d = \|u²/2a\| + ½\|a(t − t₀)²\|` | High | p10 |
| A3 | **Average-speed families** — first-half-*distance* → `2v₁v₂/(v₁+v₂)`; first-half-*time* → `(v₁+v₂)/2`; and the three-leg variant | High — the single most reused trap | p2 |
| A4 | **Non-uniform acceleration toolkit** — differentiate down (`s→v→a`), integrate up (`a→v→s`), and **`a = v·dv/ds`** for when `a` depends on position | High (JEE); NCERT explicitly restricts itself to constant `a` | p14 |
| A5 | **Free-fall standard results, derived then licensed as shortcuts** — `h = u²/2g`, `t_up = t_down = u/g`, flight `2u/g`, `v = √(2gh)`; the three cases figure (`u = 0` / `u ∥ a` / `u ↑↓ a`) | Very high | p11 |
| A6 | **Reverse/constraint problems** — "accelerates at α, then decelerates at β, total time `t`: find `v_max` and total distance" (`v_max = αβt/(α+β)`) | Very high — a JEE staple with no NCERT equivalent | p7, p17 |
| A7 | **Overtaking / minimum-distance by relative motion** — "assume B at rest, give A the relative `u` and `a`, and a two-body problem collapses to one body" | Very high | p13 |
| A8 | **Impossible graphs** — a v–t or s–t graph can never be vertical (infinite acceleration / infinite velocity), and never double-valued | Medium-high; a recurring MCQ | p4, p7 |
| A9 | **The rejected root has a meaning** — the `t = −2 s` solution for a ball thrown from a tower is where it *would have been* launched from the ground | Medium — excellent for trust | p10 |

**Problem pool:** ~29 in-section examples (1-D subset) + 8 Introductory Exercises with ~30 items + the chapter exercise bank.

### 1.3 Source 3 (Concepts of Physics ch.3) — what it adds

| # | Addition | Lands on |
|---|---|---|
| B1 | **Frame of reference taught as a story, not a definition** — the book on the table is at rest from the room and moving from the moon; the robber on the train tells the passengers "don't move" and they obey *in his frame* while hurtling along the track | p1 (the hook) |
| B2 | **The doubtful-digit move applied to motion** — average speed is introduced through the **cricket run-rate** (runs per over, some overs expensive, some economical) before any symbol appears | p2 |
| B3 | **The chord-fails-so-shrink-it derivation of instantaneous speed** (Fig 3.4) — the limit as the *repair of an inadequacy the student has just felt* (house rule §4A(d)) | p3 |
| B4 | **The `sₙ` dimensional trap** — `sₙ = u + (a/2)(2n−1)` "is often used… **However, as you can verify, different terms in this equation have different dimensions and hence the equation is dimensionally incorrect.**" The correct form keeps the hidden `(1 s)` factors. Also: it gives **displacement** in the nth second, not necessarily distance | p10 (and a callback to Ch.1) |
| B5 | **14 "Questions for Short Answer" with no printed answers** — deliberately, to force discussion. E.g. *"A food packet is dropped from a plane at 100 m. What is its path as seen from the plane? As seen from the ground? If someone asks 'what is the actual path', what will you answer?"*; *"If a particle is accelerating, it is either speeding up or speeding down. Do you agree?"*; *"Two particles A and B start from rest for equal time; A has acceleration `a` for the first half of the time and `2a` for the second, B has `2a` then `a` — which covers more distance?"* | `reasoning_prompt`s across p1, p3, p6, p11, p13 |
| B6 | **Objective II multi-correct items** — genuinely hard discrimination, e.g. *"the velocity of a particle is zero at t = 0: (a) the acceleration must be zero (b) may be zero (c) if acceleration is zero from 0 to 10 s the speed is also zero in this interval (d) …"* | p17 drill |
| B7 | **`a_{P,S} = a_{P,S'}` when two frames move at constant relative velocity** (eq. 3.29) — therefore **two bodies in free fall see each other move at constant velocity**, one of the most examined consequences in the chapter | p13 |

---

## 2. Source conflicts found while reading — resolved here, before authoring

Recorded so no page author re-litigates them and nothing wrong reaches a student.

| # | Conflict | Resolution |
|---|---|---|
| **C1** | Source 2 prints `sₜ = u + at − a/2` as a fourth "equation of motion", flat. Source 3 explicitly says the printed form **is dimensionally incorrect** — it adds a velocity to an acceleration — and is only consistent once the implicit `1 s` factors are restored. | **Source 3 wins.** Taught on p10 *as* the dimensional lesson, with a direct callback to Ch.1's homogeneity principle. It is one of the best trust-building moments available in the chapter — we hand a student a formula their coaching class uses and show them why it is written sloppily. |
| **C2** | `g`: NCERT uses **9.8 m/s²**; source 2 uses **10 m/s²** throughout "for objective problems". | Teach `g = 9.8 m/s²`. Use 10 only where a problem states it, and **always print which value the problem is using**. Never mix inside one solution. |
| **C3** | "Deceleration" / "retardation": source 3 says *"deceleration is equivalent to negative acceleration"*. NCERT Points to Ponder #3 says the **sign of acceleration does not tell you whether the particle is speeding up or slowing down** — that depends on the axis you chose. | **NCERT wins, and it is the chapter's central misconception.** Rule taught on p6: *v and a same sign → speeding up; opposite sign → slowing down.* "Deceleration" describes the motion, not the sign. Source 3's sentence is true only under the implicit convention that motion is along +x. |
| **C4** | Source 2 says the `s` in `v² = u² + 2as` "is really the displacement, not the distance". NCERT never says it, and NCERT's own free-fall worked example quietly relies on it. | **Source 2 wins** — state it explicitly on p9 and drill it on p10 (A2). This is the single most common wrong answer in the chapter. |
| **C5** | NCERT's contents box lists **§2.5 Relative velocity**; the body of our reprint does not contain it (G2). | Teach relative motion in 1-D on p13 from sources 2 and 3. **Do not cite "NCERT §2.5" on that page** unless the founder confirms it exists in another copy. NCERT Exercise 2.14 *is* cited — it is printed in our copy. |
| **C6** | Source 2 folds river-boat, aircraft-wind and rain problems into the same "Relative Motion" section as the 1-D material. | **Out of scope for this chapter** — they are 2-D and the taxonomy assigns them to `tag_k2d_5` (Motion in Two Dimensions). A one-line "Note on Scope" callout on p13 says so, so a student who has seen them in coaching is not confused by their absence. |

**Rule 0 applies throughout:** every question, table row and numeric value is transcribed from the source PDF, never generated from memory. Anything not cleanly readable is marked `NEEDS_REVIEW`, not reconstructed.

---

## 3. Design principles specific to this chapter

1. **The through-line, stated on p1 and paid off on p15:** *position, velocity and acceleration are the same story told three times — each one is the slope of the one before it, and the area under the one after. Everything else in this chapter is a consequence of that sentence.*
2. **Graphs are the spine, not an appendix.** Both reference books put graphs late (source 2 at §6.9, after everything). That ordering is why students can compute `v = u + at` and still cannot read an x–t plot. **Here, graph-reading arrives on p4 — immediately after instantaneous velocity — and is then used continuously.** This is the single biggest structural departure from all three sources, and it is deliberate. With no interactive available (founder decision 4), the graph pages carry their load through **numbered static figures + a high density of translation drills** instead — which is why they get three pages (p4, p7, p8) rather than two.
3. **Recap the junior-class vocabulary; do not re-teach it** (founder decision 2). Position, path length, distance and displacement are Class 9–10 material. On p1 they appear as a compact refresher table plus a sorting exercise and a short drill — enough to make sure the words are solid before signs and graphs depend on them, and no more. **What is genuinely new on p1 is the frame and the sign convention**, and that gets the teaching time.
4. **Sign convention is a declaration, not a convention.** p1 makes the student *choose* an origin and a positive direction before any number appears; every later page reads its signs against that choice. This pre-empts C3.
5. **Every JEE-only addition is bracketed** with the "Note on Scope" callout and `tier: 'competitive'` where a board-only student can safely skip: A2, A4, A6, the `sₙ` formula, and the whole of p14.
6. **`step_solver` is the default teaching vehicle**; `worked_example` is reference-only. Target ≥ 56 `step_solver` blocks, ≤ 4 `worked_example` (see the §7 note on wording).
7. **Every page must stand alone without an interactive** (founder decision 4). A page whose explanation only works if something moves is a page that will read as broken until the mechanics engines ship — so no page is written that way.
8. **Exposition caps at ~120 words between practice items**, and the rule arrives as a conclusion (house rules §4A(a), §6).
9. **Nothing asserted that can be derived in three lines** (§4A(c)) — the three equations get both the trapezium derivation *and* the integration derivation, each as gated steps.
10. **Be honest about what doesn't matter** (§4A(g)) — e.g. "when the motion never reverses, distance and displacement are the same number, so you can skip the `t₀` check entirely."

---

## 4. Page-by-page design (18 pages, p0–p17)

Legend: `SS` = `step_solver` · `YSI` = end-of-page "You solve it" strip (a one-section `practice_bank`) · `IQ` = `inline_quiz` · `RP` = `reasoning_prompt` · `CE` = `classify_exercise` · `GE` = `group_elements` · `FIG` = numbered static figure (`image` + `figure_key` + `{fig:}` reference, §16).

**No simulation blocks anywhere in this chapter** (founder decision 4). The visual load is carried by numbered static figures; the *teaching* load is carried by step-solvers and drills. §5 records where a sim would slot in later, for when the mechanics engines ship.

| # | Page | Opens with (the situation) | The rule that falls out | Source | Visuals | Practice |
|---|---|---|---|---|---|---|
| 0 | Chapter opener | auto per §15.1 | — | — | — | — |
| 1 | **Where Are You? The Answer Depends on Who's Asking** | A book lies still on your table. From the moon it is racing through space. Which is true? Then the robber on the train who tells the passengers "don't move" — and they obey. | **New material:** motion is a *relationship*, not a property; to describe it you must first pick a **frame** — an origin and a positive direction, both your free choice — and once declared, a sign *is* a direction. Point-object approximation and when it is fair. **Recap strip (founder decision 2):** position · path length/distance · displacement, as one compact table + the `\|displacement\| ≤ distance` rule, equal only when the motion never reverses. No re-teaching — this is a refresher that makes the words safe before signs and graphs lean on them. | NCERT §2.1; src 3 §3.1 (B1), §3.2 Ex 3.1; src 2 §6.2, §6.4 · restores G1 | 2 FIG (frame picture; the semicircular-walk recap figure) | 4 SS · CE · IQ ×5 · RP ×1 · YSI ×7 |
| 2 | **Average Speed and Average Velocity — What Exams Actually Ask** | A man walks 2.5 km to the market at 5 km/h, finds it shut, and walks home at 7.5 km/h. His average velocity for the trip is exactly zero. He is not going to enjoy being told that. | Average speed = path/time; average velocity = displacement/time; **average speed ≥ \|average velocity\|**, and *why* the definitions are worth keeping separate. Introduced through the cricket **run-rate** picture (B2). Then the trap that actually gets examined (A3): first-half-**distance** → `2v₁v₂/(v₁+v₂)`; first-half-**time** → `(v₁+v₂)/2`. Two different means; knowing which is which is the whole question. Closes with the three-leg variant. | NCERT Ex 2.9, 2.10; src 3 §3.3–3.4 + Ex 3.4, Obj-I Q4, Q5; src 2 §6.5 Ex 6.10–6.12 | 1 FIG (the two-mean comparison) | 5 SS · IQ ×5 · YSI ×7 |
| 3 | **Instantaneous Velocity — Shrinking the Interval** | `x = 0.08 t³`. Between t = 3 s and 5 s the average velocity is 3.92 m/s. Between 3.5 and 4.5 it is 3.86. Between 3.995 and 4.005 it is 3.8400. Something is converging. | The chord's slope is not the rate *at* an instant, because the curve is steeper at one end than the other — so shrink the interval until the chord becomes the **tangent**. `v = lim Δx/Δt = dx/dt` = **slope of the tangent to the x–t graph**. Instantaneous speed = \|instantaneous velocity\| exactly, unlike the averages — and *why* (NCERT asks this and does not answer it; we do). | NCERT §2.2 + Table 2.1 + Fig 2.1 + Ex 2.1; src 3 §3.3 Fig 3.4 (B3); src 2 §6.4 | 2 FIG (chord→tangent sequence; NCERT Table 2.1 rendered as a convergence table) | 4 SS · IQ ×5 · RP ×1 · YSI ×7 |
| 4 | **Reading an x–t Graph** | Two children, A and B, walk home from the same school. One line is steeper. One starts later. They cross once. Answer five questions using only the picture — no formula is available to you. | Slope = velocity · sign of slope = direction · steeper = faster · horizontal = at rest · a crossing = same place at the same time. **An x–t graph is not a picture of the journey** — a hill on it does not mean the object went up a hill. No x–t or v–t graph may ever be vertical or double-valued, and the reason is physical, not cosmetic (A8). | NCERT Ex 2.2 + Fig 2.9, Ex 2.13, 2.17; src 2 §6.9 Ex 6.21, 6.22 + Fig 6.25; src 3 Obj-I Q2, Obj-II Q9 (Fig 3-Q5), Ex 3-E4/E9 | 4 FIG (two-children plot; the road-vs-graph contrast pair; the impossible graphs) | 5 SS · IQ ×6 · YSI ×8 |
| 5 | **Acceleration — the Rate of a Rate** | Galileo first guessed that velocity changes at a steady rate **per metre fallen**. He was wrong — and how he found out is exactly why we define acceleration per *second*. | `a = dv/dt` = slope of the v–t graph; average acceleration = `Δv/Δt`. Acceleration can come from a change in speed, a change in direction, or both. What the **curvature** of an x–t graph tells you. Velocity and acceleration are continuous, so real graphs have no sharp corners — NCERT's own aside, and it explains a lot of otherwise-arbitrary MCQ answers. | NCERT §2.3 + Figs 2.2, 2.3; src 2 §6.4; src 3 §3.5 | 2 FIG (x–t curvature triptych; the four v–t cases) | 4 SS · IQ ×5 · YSI ×7 |
| 6 | **Speeding Up or Slowing Down — the Sign Trap** | Throw a ball straight up. At the very top its velocity is zero. Is its acceleration zero too? On the way up it slows; on the way down it speeds up — and the acceleration was **the same** the whole time. | **The sign of `a` alone tells you nothing.** `v` and `a` same sign → speeding up. Opposite → slowing down. That rule survives any axis choice; "deceleration" describes the motion, not the sign (C3). Zero velocity ≠ zero acceleration. Delivered as a 2×2 sign table the student fills in themselves, then flips the axis and checks that the *physics* did not change. | NCERT Points to Ponder 2, 3, 4 + Ex 2.7; src 3 Short-Answer 5, 8 + Obj-II Q5, Q6 | 2 FIG (the 2×2 sign quadrant; the thrown ball annotated at three instants) | 5 SS · RP ×2 · IQ ×6 · YSI ×8 |
| 7 | **Slope Down, Area Up** | A car holds 12 m/s for 5 s. The rectangle under its v–t line has "area" 60. Sixty of *what*? Look at the units on the two axes and the answer is forced. | The full translation rule, earned rather than printed: **slope going down** (x→v→a), **area going up** (a→v→x) — src 2's Table 6.2. Area under v–t = displacement (rectangle → trapezium), proved by NCERT's own dimensional argument, a direct callback to Ch.1. **Area below the axis is negative** — which is precisely how distance and displacement come apart on a graph (the ±5 m/s triangle over 40 s: distance 100 m, displacement 0). Area under a–t = change in velocity. | NCERT §2.3 end + Figs 2.4, 2.5; src 2 §6.9 Table 6.2 + Ex 6.23; src 3 §3.3 Ex 3.3 + Fig 3.5, Ex 3-E10 | 3 FIG (rectangle→trapezium; the signed-area triangle; the slope/area direction map) | 5 SS · IQ ×6 · YSI ×8 |
| 8 | **The Four Motions, Drawn Three Ways** | Here is *only* an a–t graph: +2 m/s² for 2 s, then 0 for 2 s, then −4 m/s² for 2 s, from rest. Draw the v–t graph. You have not been given a single equation. | The canonical gallery — uniform · uniformly accelerated · uniformly retarded · retarded-then-reversed (the thrown ball) — each with x–t, v–t and a–t side by side and the tell-tale feature of each named. Then translation drilled in both directions until it is automatic. This page exists because graph-to-graph translation is the chapter's hardest skill and, without an interactive, it needs volume. | src 2 §6.9 Figs 6.18/6.22/6.23/6.24 + Ex 6.24, 6.26; src 3 Ex 3-E2, 3-E7; NCERT Ex 2.15, 2.18 | 5 FIG (the four motions × three graphs; the staircase a–t worked case) | 6 SS · GE · IQ ×6 · YSI ×8 |
| 9 | **The Three Equations — Derived, Not Handed Over** | You already know two things: `a = dv/dt` and `v = dx/dt`. That is genuinely all you need. Everything below is bookkeeping. | `v = u + at`, `x = ut + ½at²`, `v² = u² + 2ax` — derived **twice**: geometrically off the v–t trapezium, and by integration. Valid **only for constant `a`**. `v̄ = (u+v)/2` for constant `a` only. And the `s` is **displacement**, never distance (C4). | NCERT §2.4 + Fig 2.5 + Ex 2.2; src 2 §6.6–6.7; src 3 §3.6 eqs 3.12–3.14 | 2 FIG (the trapezium; the equation-selection map) | 6 SS · IQ ×5 · YSI ×8 |
| 10 | **Using the Equations Without Getting Burned** | A ball is thrown *upward* at 10 m/s from the top of a 40 m tower. When does it hit the ground? Most students split this into "up" then "down". One equation does the whole thing. | (i) Declare the axis first. (ii) `s` is measured from the **starting point**. (iii) One equation beats splitting the flight — and the rejected root `t = −2 s` has a real meaning (A9). (iv) When `u` and `a` oppose, **distance ≠ displacement**: find `t₀ = \|u/a\|`, then `d = \|u²/2a\| + ½\|a(t−t₀)²\|` (A2). (v) **Displacement in the nth second** — and why the formula as usually printed is dimensionally broken (C1/B4), a callback to Ch.1. Galileo's odd numbers 1:3:5:7. | src 2 §6.6 Ex 6.13, 6.15 + Fig 6.13; src 3 §3.6 Ex 3.6 (B4); NCERT Ex 2.3, 2.5 + Table 2.2 | 3 FIG (the tower with signs marked; the negative-root diagram; the odd-numbers strip) | 6 SS · RP ×1 · IQ ×6 · YSI ×8 · `tier: competitive` partial |
| 11 | **Free Fall — One Acceleration, Three Situations** | Drop a ball. Throw one down. Throw one up. Three different journeys — and the acceleration is identical in all three, in magnitude *and* direction, at every instant including the top. | Free fall = constant `a = −g` (9.8 m/s²; 10 only when a problem says so — C2, and always state which). The three cases are one equation with different signs on `u`. Standard results **derived, then licensed as shortcuts**: `h = u²/2g`, `t_up = t_down = u/g`, flight `2u/g`, `v = √(2gh)`. Heavier does not fall faster. | NCERT §2.4 Ex 2.3, 2.4, 2.5 + Figs 2.6, 2.7; src 2 §6.6 Extra Points + Ex 6.13, 6.14; src 3 §3.6 Ex 3.7, Obj-I Q7 | 3 FIG (the three-cases figure; the thrown ball's a–t/v–t/x–t triptych with the apex annotated `v = 0`, `a ≠ 0`) | 6 SS · RP ×1 · IQ ×6 · YSI ×8 |
| 12 | **Stopping Distance and Reaction Time** | Double your speed on the highway and your braking distance does not double — it **quadruples**. Here is the same car's real test data: 10, 20, 34, 50 m at 11, 15, 20, 25 m/s. | `d = v₀²/2a` — stopping distance goes as the **square** of speed, which is why school-zone limits sit where they do. Then reaction time: drop a ruler through a friend's fingers, measure the fall, `t = √(2d/g)` — 21.0 cm ⇒ ≈ 0.2 s. Total stopping distance = reaction distance + braking distance, and only one of those two terms is linear in speed. | NCERT Ex 2.6, 2.7 + Fig 2.8; NCERT Ex 2.5 (126 km/h → 200 m) | 2 FIG (`real_world` card with the braking-data table; the ruler experiment) | 4 SS · IQ ×5 · YSI ×7 |
| 13 | **Relative Velocity in One Dimension** | Your height is 167 cm; your friend's is 162. Relative to them you are 5 cm tall. You just subtracted — and that is the *entire* idea, whatever the quantity. | `v_AB = v_A − v_B`, `v_AB = −v_BA`, `a_AB = a_A − a_B`. **If two bodies share the same acceleration their relative acceleration is zero** — so two objects in free fall see each other move at constant velocity (B7). The 1-D families: **overtaking/catching** (freeze B, hand A the relative `u` and `a`, and a two-body problem becomes one body) and **minimum separation**. Note on Scope: river-boat and rain problems are 2-D and belong to the next chapter (C6). | src 2 §6.10 (1-D part) + Ex 6.27, 6.29; src 3 §3.9 eqs 3.26–3.29 + Short-Answer 9; NCERT Ex 2.14 | 3 FIG (the two-frame contrast pair; the overtaking setup before/after freezing B) | 6 SS · RP ×1 · IQ ×5 · YSI ×8 |
| 14 | **When the Three Equations Die** | `x = 20 + t³ − 12t`. Find the velocity at t = 0. Reach for `v = u + at` and you get a wrong answer, because `a` is not constant here. | Back to the definitions: **differentiate to go down** (x→v→a), **integrate to go up** (a→v→x, with limits), and **`a = v·dv/dx`** when acceleration depends on position rather than time. NCERT restricts itself to constant `a` on purpose; this is where that restriction is lifted, and where Ch.0's calculus finally earns its place. | src 2 §6.7 Ex 6.16, 6.17 + IE 6.6; src 3 §3.6; NCERT §2.4 calculus box | 1 FIG (the differentiate-down / integrate-up ladder) | 5 SS · IQ ×5 · YSI ×7 · **`tier: competitive`** |
| 15 | **Recap** | — | Retrieval only — `mind_map` + one formula table + 2 reasoning self-checks + a 10-question integrative quiz. **Zero summary paragraphs** (Dunlosky et al. 2013), matching the Ch.1 / Class-12 Bio pattern. | — | `mind_map` | 10-Q quiz |
| 16 | **Practice — NCERT Exercises** | — | All **18 NCERT exercises 2.1–2.18 verbatim** (Rule 0), regrouped into 4 themes, each a tap-to-reveal worked solution in teacher voice. | NCERT Exercises 2.1–2.18 | as needed | 18 items |
| 17 | **Practice — JEE & NEET Drill** | — | ~60-item bank in 6 sections mapped one-to-one onto the six `tag_k1d_*` topics. | Reworded from sources 2 & 3 (**no source badge**) + genuine PYQs (**labelled by exam + year only**) | as needed | ~60 items |

**Page count: 18 (p0–p17).** The drafted p1 + p2 collapsed into one page under founder decision 2 (recap, don't re-teach); the freed page went to graphs, splitting the old "three graphs move together" into **p7 (the slope/area rule)** and **p8 (the four-motion gallery + translation drills)** — which is where the loss of the interactive hurts most and where extra drill volume repays best.

---

## 5. Interactives — DEFERRED, and the slots reserved for them

**Founder decision 4 (2026-07-29): no simulations in this chapter.** The mechanics simulation engines are being designed as their own programme; once they ship we will decide where they drop in. So this chapter is authored to teach **completely without an interactive** — that is design principle 7, and it is binding, not aspirational. Nothing here may read as "see the sim above".

### 5.1 What carries the load instead

| Job the sim would have done | What does it now |
|---|---|
| Chord → tangent convergence (p3) | NCERT's Table 2.1 rendered as a convergence table the student completes row by row, plus a two-panel figure of the chord shrinking onto the tangent |
| "The graph is not the path" (p4) | A deliberate **contrast pair**: the same journey drawn once as a road with a moving marker and once as its x–t plot, side by side, with three "which is which" checks |
| Sign quadrant (p6) | A 2×2 table **the student fills in themselves** before the rule is stated, then an axis-flip exercise showing the signs invert while the physics does not |
| Graph-to-graph translation (p7, p8) | The four-motion gallery drawn three ways + `group_elements` matching + a high volume of "given this, draw that" step-solvers — this is why p8 exists as its own page |
| Relative-frame toggle (p13) | A before/after figure pair — the same scene from the ground and with B frozen — plus step-solvers that make the student *perform* the subtraction that freezes B |

### 5.2 Sim slots reserved (for when the mechanics engines land)

Recorded so the later insertion is a placement decision, not a re-authoring job. **No page depends on any of these.**

| Slot | Page | What it would add that the static treatment cannot |
|---|---|---|
| **Motion Graph Studio — Read/Tangent** | p3, p4 | The road and the graph moving *simultaneously*, which is the only decisive cure for "the graph is the path" |
| **Motion Graph Studio — Sign quadrant** | p6 | Flipping the axis live and watching both signs invert while the ball's motion is visibly unchanged |
| **Motion Graph Studio — Link** | p7, p8 | Dragging the v–t handles and watching x–t and a–t regenerate — the a→v→x direction that no static figure can show |
| **Motion Lab `relative`, 1-D preset** | p13 | The ground/ride-along frame toggle: two bodies collapsing to one in front of the student |

**Useful for whoever builds the programme:** the E2 engine already **declares both scenarios this chapter would want.** `packages/data/books/schemas.ts` has `'graphs'` and `'relative'` in the `motion_lab` enum, and `motion-lab/MotionLab.tsx` already routes `case 'graphs'` to a named placeholder reading *"The triple-linked x–t / v–t / a–t workbench is not built yet. This block is authored and will render as soon as the graphs scenario ships — nothing needs re-authoring."* So the slots above need **no schema change, no new block type and no admin-editor wiring** — only the components. (Note: `case 'relative'` currently routes to `ProjectilePlayground`, the 2-D view; a 1-D preset needs a branch or a param.)

### 5.3 REUSE — zero new code

| Need | Existing asset |
|---|---|
| Distance-vs-displacement sorting (p1) | `classify_exercise` (generalised in Ch.1 to take custom verdict labels) |
| Graph-to-graph matching (p8) | `group_elements` |
| Every worked derivation and solved example | `step_solver` with `check` gating + `now_you_try` |
| End-of-page "You solve it" strip | one-section `practice_bank` |
| Chapter recap | `mind_map` |
| Stopping-distance card (p12) | `real_world` enrichment card (§17.4) |
| Every figure | `image` + `generation_prompt` (dark background per the standing rule) + `figure_key` / `{fig:}` references (§16) |

### 5.4 SKIP

- A separate "SUVAT calculator" or equation-picker sim, even later. Choosing the right kinematic equation is a symbolic-selection skill; a `step_solver` whose first gated step is *"which quantity are you neither given nor asked for?"* teaches it better than a canvas would, and costs nothing.
- **`math_graph`** (the JSXGraph block used on Ch.0 p4/p10) would technically cover the tangent and area pages at zero build cost, and it is not a mechanics sim. It is **left out** rather than assumed, because the founder's instruction was to keep interactives out of this chapter until the engine programme lands. Trivially addable later if wanted — flag it and it goes on p3 and p7.

---

## 6. Problem-type coverage, practice budget, and hygiene

### 6.1 The families this chapter must carry

Definition-restatement is not enough (gap analysis §4). All ten of these appear:

1. **Read-the-graph → extract a number** — average velocity over 0–10 s, instantaneous velocity at t = 2, 5, 8, 12 s off a piecewise x–t plot.
2. **Graph-to-graph translation** — given a–t, draw v–t; given v–t, draw x–t.
3. **Reverse / constraint** — "accelerates at α, decelerates at β, total time `t`; find `v_max` and total distance" (A6); "a ball is at 80 m twice, 6 s apart — find `u`".
4. **Two-body meeting / overtaking** — when and where do A and B collide, from graphs and from relative motion.
5. **Distance-vs-displacement under reversal** — the `t₀` check (A2).
6. **Free-fall multi-part** — ball from a tower, ball thrown up vs down from the same height at the same speed (which lands faster? at what speed?).
7. **Conceptual probes with no printed answer** — B5's 14 short-answer questions and NCERT Ex 2.7's true/false set become `reasoning_prompt`s.
8. **Average-speed mean traps** — harmonic vs arithmetic (A3).
9. **Non-uniform acceleration calculus** — differentiate/integrate/`v dv/dx`.
10. **Multi-correct discrimination** — B6's Objective II items, JEE-Advanced-shaped.

### 6.2 Practice budget — raised ~50% over Ch.1 per founder decision 3

The instruction is that a student should be able to grasp each topic from that page's solved examples and questions alone. So the floor is **per page**, not per chapter: every content page (p1–p14) carries **at least 4 step-solvers, 5 inline quizzes and a 7-item closing strip**, and the graph and equation pages carry more.

| Vehicle | Count | Action required before an answer? |
|---|---|---|
| `step_solver` blocks | **~73** (14 content pages, 4–6 each) | ✅ |
| — their gated `check` steps | ~220 (≈3 per block) | ✅ |
| — their `now_you_try` tails | ~73 | ✅ |
| `inline_quiz` | **~76** (5–6 per content page) | ✅ |
| End-of-page `YSI` strips | **~106** (14 pages × 7–8) | ✅ |
| `reasoning_prompt` | ~7 | ✅ (no auto-answer) |
| `classify_exercise` / `group_elements` | 2 | ✅ |
| Recap quiz (p15) | 10 | ✅ |
| NCERT exercises (p16) | 18 | tap-to-reveal |
| JEE/NEET bank (p17) | ~60 | ✅ |
| `worked_example` (reference only) | ≤4 | ❌ |

**≈ 430 student-facing items (≈ 630 counting individual gated steps), ~97% action-gated** — against Ch.1's 240 items at ~95%. The uplift is deliberate on two counts: the founder's instruction, and the fact that no interactive is available to carry the graph pages (§5).

**Figure budget:** ~35 numbered static figures, since the visual load that a simulation would have carried now falls on them. Every one gets a `figure_key`, a caption, and at least one `{fig:}` reference from the body text (§16) — a figure nothing points at is decoration, and this chapter cannot afford decoration.

### 6.3 Hygiene gates before any insert

Each of these has burned us before:

- **Tally `correct_index` frequency across the whole chapter before insertion** — target an even A/B/C/D spread. Ch.1 shipped its MCQ factories with hash-rotation baked in so the defect cannot recur; **reuse those factories**, do not re-roll them.
- Zero length-tells — the correct option must never be the longest.
- Every quiz question carries a `difficulty_level`.
- **Distractors are real misconceptions**, drawn from this chapter's specific list: the x–t-graph-is-the-path error · `v = 0 ⟹ a = 0` at the apex · "negative acceleration means slowing down" · `(v₁+v₂)/2` used for half-*distance* · the `s` in `v² = u² + 2as` read as distance · heavier-falls-faster · area below the v–t axis counted as positive · "relative" meaning addition · treating `sₙ` as dimensionally clean · applying SUVAT when `a` is not constant.
- No `null` in any block field (the Zod `.optional()` trap).
- **No third-party book badge anywhere.** `source: 'jee_neet'` only on genuine PYQs, labelled by exam + year. NCERT/Exemplar/CBSE labelling only where the item truly is NCERT's.
- Chapter title byte-identical to `ph11_kinematics1d` → **"Motion in One Dimension"** (§18), and the taxonomy link set at build time.

---

## 7. Decisions — RESOLVED 2026-07-29

Settled by the founder; see the block in the status header. Summary: **18 pages** · **position/distance/displacement is a recap, not a taught topic** · **practice volume per page raised ~50%** · **no simulations — slots reserved only**.

Two items carried forward, neither blocking:

1. **"Worked examples" wording.** The founder asked for solved examples on every page. These are delivered as `step_solver` — the student clicks through each line and is gated at every load-bearing step — because the inherited house rule demotes tap-to-reveal `worked_example` to reference-only, and that rule exists precisely because reading a solution is not learning one. **If a block of genuinely non-interactive solved examples is also wanted, say so and the ≤4 cap on `worked_example` is lifted.**
2. **NCERT §2.5 "Relative velocity" is listed in the chapter contents box but its body is missing from our PDF copy** (G2/C5). p13 is planned from the other two sources and **will not cite NCERT for that section**. NCERT Exercise 2.14 *is* printed in our copy and is cited normally. **Worth a check against another NCERT copy** — if the section does exist, p13 gains NCERT's own worked treatment. This does not hold up the build.

---

## 8. Build sequence

No simulation wave — the chapter is pure authoring.

**Wave 1 — the description spine (p0–p8).** Frame & recap → averages → instantaneous velocity → reading x–t → acceleration → the sign trap → slope-down/area-up → the four-motion gallery. This is the half of the chapter that depends most on figures, so the figure prompts are written and queued for generation in this wave, not later.

**Wave 2 — the equations and their applications (p9–p14).** The three equations → using them safely → free fall → stopping distance → relative motion in 1-D → non-uniform acceleration.

**Wave 3 — close-out (p15–p17) + self-review.** Recap, the 18 NCERT exercises verbatim, the ~60-item drill bank. Then the page-by-page, feature-by-feature self-review the founder asked for on Ch.1: **where are more questions needed**, is any page leaning on a figure that has not been generated yet, and does every page still teach completely with no interactive present.

Every wave: all writes through `scripts/lib/book-writer.js` (versioned, content-loss-guarded, soft-delete only) per §0.6; every page `_validate.mts`-clean; MCQ factories reused from Ch.1 so the answer-position hash-rotation carries over; `published:false` pending founder review; `LIVE_BOOKS_STATE.md` + `PROJECTS.md` refreshed at wave end.
