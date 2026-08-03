# Class 11 Physics — Chapter 3: "Motion in Two Dimensions" — build plan

**Status:** 🟢 Built, all 18 pages (2026-07-30). `published: false` pending founder review. Built without an explicit answer to §7 — proceeded under the plan's own recommendations on all three open decisions (sim-free per (b), inclined plane kept as a full competitive page, circular boundary stops at `a_c = v²/r`); see the `_book_ch3.js` header for the standing rationale.

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Chapter title:** **"Motion in Two Dimensions"** — byte-identical to the Crucible taxonomy chapter `ph11_kinematics2d` (§18). NCERT's own title is "Motion in a Plane"; the Crucible title wins, as it did for Ch.1 and Ch.2.
- **Book:** `class11-physics` · `chapter_number: 3` (sorts after Ch.2 "Motion in One Dimension")
- **Crucible tags this chapter must cover:** `tag_k2d_1` Vectors (Addition, Resolution, Dot & Cross) · `tag_k2d_2` Projectile Motion · `tag_k2d_3` Relative Motion in 2D · `tag_k2d_4` Circular Motion (Uniform & Non-uniform) · `tag_k2d_5` River-Boat & Rain Problems
- **Final numbers:** 18 pages (p0–p17) · **375 practice items** · **513 action-gated (100%)** · **175 MCQs at 43/47/45/40** across A/B/C/D · **0 length-tells** · **0 untagged questions** · **0 exposition runs over the 120-word cap** · every content page (p1–p14) meets the 4-step-solver / 5-quiz-question floor.
- **Sources read end-to-end for this plan:**
  1. **NCERT Class 11 Physics Ch.3 "Motion in a Plane"** — rationalised 2026-27 reprint. §3.1 Introduction · 3.2 Scalars and vectors (3.2.1 position & displacement, 3.2.2 equality) · 3.3 Multiplication by real numbers · 3.4 Addition/subtraction, graphical · 3.5 Resolution · 3.6 Vector addition, analytical · 3.7 Motion in a plane · 3.8 Motion in a plane with constant acceleration · 3.9 Projectile motion · 3.10 Uniform circular motion. **Structural spine.**
  2. **"Mechanics Vol. 1"** — ch.6 §6.8 (motion in 2-D and 3-D) and §6.10 (relative motion: minimum-distance, river-boat, aircraft-wind, rain), **ch.7 "Projectile Motion" in full** (§7.1–7.6, incl. projection along an inclined plane), and **ch.10 §10.1–10.2 "Kinematics of Circular Motion"**. **Problem layer + the JEE-only extensions.**
  3. **"Concepts of Physics" Pt.1 ch.3** §3.7 Motion in a plane, §3.8 Projectile motion, §3.9 Change of frame, plus its worked examples and short-answer probes. **Pedagogy layer.**
  - Per the standing no-third-party-attribution rule, sources 2 and 3 are **never** named in student-facing text or any practice-item source badge.
- **House rules inherited (non-negotiable):** [`PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md`](PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md) §4A (a)–(g) and §6, plus the Ch.2 founder decisions carried forward: **recap prerequisites rather than re-teaching them**, and a **per-page floor of 4 step-solvers, 5 inline-quiz questions and a 7-item closing strip**.
- **Next action:** founder reviews → approve/redirect → build in three waves per §8.
- **Blocked on:** founder approval, in particular decision 1 in §7 (whether the two already-built simulations may be used here).

---

## 1. The structural decision that shapes everything: NO vector teaching, and no recap either

**Six of NCERT Ch.3's ten sections (§3.2–3.6, roughly half the chapter) are pure vector algebra** — scalars vs vectors, equality, multiplication by a scalar, graphical addition and subtraction, resolution, and the analytical component method.

**We already teach all of that, in more depth, in Ch.0 "Mathematics in Physics" Unit C** — 12 pages covering types and angle-between, the triangle law, the parallelogram law with the direction formula, the polygon law and equilibrium, resolution, the analytical î ĵ method, and dot and cross products, with six `vector_board` archetypes driving them.

> **FOUNDER DECISION (2026-07-29):** *"We don't have to recap the vectors because we have just covered them in previous chapters, and during the problem-solving, the revision of vectors will be covered. Start Chapter 3 with real topics, and wherever vectors are going to be used, they will be covered in the detailed explanation or worked examples of the kinematics questions."*

So this chapter has **no vector section and no vector recap strip.** It opens on p1 with the actual physics — the independence of the two axes — and vector technique is revised **in situ**, at the moment it is needed, inside the step-by-step solutions.

**What "in situ" means concretely, so no page author guesses:**

- Any `step_solver` whose first move is a resolution **makes that resolution its own gated step**, with the trig shown, rather than opening on an already-resolved `u cos θ`. The revision is the step.
- Any step that subtracts two vectors (relative velocity, change in velocity) **draws the triangle and names the rule being used** — "tip-to-tail, reversing the second vector" — rather than assuming the student remembers which way round it goes.
- The `\hat{i}` / `\hat{j}` form is used from p2 onward without ceremony, but the **first** time a component is extracted on each page, the extraction is shown in full.
- Where a result depends on a vector identity the student may have forgotten (`a \cdot b = 0 \Rightarrow` perpendicular, used on p8), the identity is stated in the step that uses it, in one line.

**Consequence: this chapter is ~5–6 pages shorter than NCERT's section count suggests, and every one of those pages goes to projectiles, circular motion and relative motion instead.** It also means the chapter is genuinely front-loaded with physics — a student opens it and the first thing they meet is a ball rolling off a table, not a definition.

## 2. What each source adds, and the two holes

### 2.1 NCERT (the spine) — and what it dropped

| § | Content | Notes |
|---|---|---|
| 3.1 | Why vectors are needed: in one dimension `+` and `−` were enough; in two they are not | The chapter's own framing, and a clean callback to Ch.2 p1 |
| 3.2–3.6 | Vectors: position & displacement vectors, equality, scalar multiplication, graphical addition/subtraction, resolution, analytical addition | **Recapped, not re-taught** (§1) |
| 3.7 | Motion in a plane — `r`, `v = dr/dt`, `a = dv/dt` in component form; average vs instantaneous | The real start of the chapter |
| 3.8 | Motion in a plane with **constant acceleration** — the vector equations, and the key statement that they split into two independent one-dimensional problems | This is the chapter's central idea |
| 3.9 | **Projectile motion** — the parabolic path, time of flight, maximum height, horizontal range, equation of trajectory | |
| 3.10 | **Uniform circular motion** — angular speed, `v = ωr`, centripetal acceleration `a_c = v²/R = ω²R` | Kinematics only; no forces |
| — | Summary · Points to ponder · Exercises | All usable verbatim |

**Holes:**

- **G1 — no relative velocity in two dimensions.** The rationalised edition has no §3.11; relative motion in a plane is simply absent. Yet **two of the five Crucible tags for this chapter** (`tag_k2d_3` Relative Motion in 2D and `tag_k2d_5` River-Boat & Rain) depend on it, and it is one of the densest JEE topics in kinematics. **Restored on p13–p14 from sources 2 and 3.**
- **G2 — no non-uniform circular motion.** NCERT §3.10 treats only the uniform case, so tangential acceleration and angular acceleration never appear. `tag_k2d_4` explicitly says "Uniform & Non-uniform". **Restored on p12 from source 2 §10.2**, tagged `tier: 'competitive'`.

### 2.2 Source 2 — the JEE layer

| # | Addition | Lands on |
|---|---|---|
| A1 | **Two solving methods, named and contrasted** — Method 1: treat it as one vector problem, `v = u + at`, `s = ut + ½at²`. Method 2: pick two perpendicular directions and run **six scalar equations**, three per axis. Method 2 is the workhorse; Method 1 is the elegant shortcut for "find the velocity after 2 s" style items | p3 |
| A2 | **Complementary angles give equal range** — `R_θ = R_(90°−θ)`, so 30° and 60° land in the same place with different times and heights | p5 |
| A3 | **`R_max = u²/g` at 45°, and `R_max = 4H_max`** — a compact, heavily-examined pair | p5 |
| A4 | **Two times at the same height**, with `t₁ + t₂ = T` — the quadratic in `t` has two roots and their sum is the time of flight | p8 |
| A5 | **Velocity perpendicular to the initial velocity** at `t = u cosec θ / g`, derived two ways (dot product, and the angle between `u` and `g`) | p8 |
| A6 | **Projectile along an inclined plane**, up and down: `T = 2u sin(α−β)/(g cos β)`, `R = u²[sin(2α−β) − sin β]/(g cos²β)`, maximum at `α = π/4 + β/2` — and the elegant observation that replacing `β` by `−β` swaps the up-plane and down-plane results | p9, `tier: competitive` |
| A7 | **Circular-motion kinematics in full** — `ω = dθ/dt`, `α = dω/dt`, `v = rω`, `a_t = rα`, `a_r = v²/r = rω²`, net `a = √(a_t² + a_r²)` with `tan θ = a_r/a_t`; the **three types** (uniform, accelerated, retarded) and what the angle between `v` and `a` is in each | p10–p12 |
| A8 | **The angular equations of motion** — `ω = ω₀ + αt`, `ω² = ω₀² + 2αθ`, `θ = ω₀t + ½αt²`, valid only for constant `α`, exactly parallel to Ch.2's SUVAT | p12 |
| A9 | **The four relative-motion families** — minimum distance / collision / overtaking, river-boat, aircraft-wind, rain | p13–p14 |
| A10 | **River-boat, the two standard conditions** — shortest *time* needs `θ = 0` (steer straight across, `t_min = ω/v_br`, and you drift); **zero drift** needs `sin θ = v_r/v_br` upstream, which is **impossible if `v_r ≥ v_br`** | p14 |

### 2.3 Source 3 — the pedagogy layer

| # | Addition | Lands on |
|---|---|---|
| B1 | **The single sentence this chapter is built on:** *"The problem of motion in a plane is thus broken up into two independent problems of straight line motion, one along the X-axis and the other along the Y-axis."* Everything else is a consequence | p1, the through-line |
| B2 | **Projectile taught as two motions bolted together** — "the vertical motion is identical to a particle projected vertically upward with speed `u sin θ`; the horizontal motion is identical to a particle moving horizontally with uniform velocity `u cos θ`". Two problems already solved in Ch.2, running side by side | p4 |
| B3 | **The frame derivation done properly** — `r_{P,S} = r_{P,S'} + r_{S',S}`, differentiated to `v_{P,S} = v_{P,S'} + v_{S',S}`, then `a_{P,S} = a_{P,S'}` when the frames move at constant relative velocity. The 1-D version was Ch.2 p13; this is the general case | p13 |
| B4 | **The muzzle-velocity and swimmer framings** — "when we say the muzzle velocity of a bullet is 60 m/s we mean its velocity with respect to the gun"; "a swimmer can swim at 5 km/h means with respect to the water" | p13, p14 |
| B5 | **The food-packet probe** — *"A food packet is dropped from a plane at 100 m. What is its path as seen from the plane? As seen from the ground? If someone asks 'what is the actual path', what will you answer?"* — no printed answer, deliberately | p13 `reasoning_prompt` |
| B6 | **"At which point on its path does a projectile have the smallest speed?"** and **"In projectile motion the velocity is perpendicular to the acceleration — always / never / once / twice?"** | p8 |
| B7 | **The three-particles-chasing-each-other problem** (each moving towards the next round an equilateral triangle, meeting at the centroid after `2d/3v`) — solved by resolving along the line of approach. A genuinely beautiful relative-motion item | p13 `tier: competitive` |

## 3. Source conflicts resolved before authoring

| # | Conflict | Resolution |
|---|---|---|
| **C1** | Source 2 states `R_max = u²/g` at `α = 45°` flatly. This is **only true when the launch and landing points are at the same height.** Fire from a cliff, or at a target above you, and the optimum angle is not 45°. | **State the condition every time.** The result is taught with its precondition attached, and p7 (projection from a height) exists partly to make the failure case concrete. Getting this wrong is a classic exam trap. |
| **C2** | `g` — source 2 uses 10 m/s² throughout for objective work; NCERT uses 9.8. Also the angle of projection is `α` in source 2 and `θ₀`/`θ` in NCERT. | Same rule as Ch.2: **teach `g = 9.8` m/s²**, use 10 only where a problem states it, and always print which. **Use `θ` for the angle of projection** throughout (NCERT's symbol), and `β` for an incline angle. Fix the symbol set once, in the scaffold, so no page drifts. |
| **C3** | Source 2 puts **centripetal force, the conical pendulum, banked roads, the "death well" and vertical circles** in the same chapter as circular kinematics (§10.3–10.5). | **All of it is out of scope here** — those are *dynamics*, and they belong to the Laws of Motion chapter, where forces exist. This chapter stops at `a_c = v²/r`. A "Note on Scope" callout on p11 says so explicitly, so a student who has seen banked roads in coaching is not confused by their absence. |
| **C4** | Sources 2 and 3 disagree on notation for relative velocity: `v_AB` ("velocity of A with respect to B") versus `v_{P,S}` ("velocity of P as measured from frame S"). | **Use `v_AB` and read it aloud as "velocity of A with respect to B"**, matching Ch.2 p13, which is already built. The frame-subscript notation appears once, in a note, because students will meet it. |
| **C5** | Source 2's §6.10 mixes 1-D and 2-D relative motion in one section; Ch.2 p13 has already taught the 1-D half. | **No repetition.** p13 opens by explicitly recalling the Ch.2 result and generalising the subtraction from signed numbers to vectors. The chapter gains a callback rather than a duplicate. |

**Rule 0 applies throughout:** every question, table row and numeric value is transcribed from the source PDF, never generated from memory.

---

## 4. Design principles specific to this chapter

1. **The through-line, stated on p1 and paid off on p16:** *a motion in a plane is two one-dimensional motions happening at the same time and ignoring each other.* Every result in the chapter — the parabola, the range formula, the river-boat conditions — is that sentence with arithmetic attached.
2. **Recap vectors, do not re-teach them** (§1). Ch.0 owns that material.
3. **Nothing in this chapter needs a force.** Circular motion stops at acceleration (C3). This keeps the chapter honest about being kinematics and leaves Laws of Motion something to do.
4. **Every JEE-only addition is bracketed** with a "Note on Scope" callout and `tier: 'competitive'`: the inclined-plane projectile (p9), non-uniform circular motion (p12), and the harder relative-motion families.
5. **`step_solver` is the default teaching vehicle**; `worked_example` reference-only. Per-page floor: **4 step-solvers, 5 inline-quiz questions, a 7-item closing strip** (the Ch.2 founder standard).
6. **Exposition caps at ~120 words between practice items** (house rules §4A(a), §6) — the metric Ch.2's Wave 1 missed on 10 runs, so this chapter is authored against it from the start rather than audited into it.
7. **Every page must teach completely without an interactive**, whatever §7 decision 1 concludes. A sim may enrich a page here; no page may depend on one.

---

## 5. Page-by-page design (18 pages, p0–p17)

Legend as Ch.2: `SS` `YSI` `IQ` `RP` `CE` `FIG`.

| # | Page | Opens with (the situation) | The rule that falls out | Source | Practice |
|---|---|---|---|---|---|
| 0 | Chapter opener | auto per §15.1 | — | — | — |
| 1 | **Two Motions at Once** | Roll a ball off the edge of a table. Sideways, it just keeps going at the speed you gave it. Downwards, it just falls. **Neither motion knows the other is happening.** Two coins, one flicked sideways and one simply dropped at the same instant, land together — and that is the whole chapter in one experiment a student can do on a desk. | A motion in a plane splits into **two independent one-dimensional motions**, and you already solved both of them in Ch.2. So the chapter's method is fixed before any formula appears: *resolve, solve each axis separately as a Ch.2 problem, recombine.* **No vector section** — the first resolution is done inside the first step-solver, where it is needed. | NCERT §3.1, §3.7; src 3 §3.7 (B1) | 4 SS · CE · IQ ×5 · RP ×1 · YSI ×7 |
| 2 | **Position, Velocity and Acceleration as Vectors** | A particle traces a curve. At one instant, which way is it going — and which way is it being pushed? | `r = xî + yĵ`, `v = dr/dt`, `a = dv/dt`, each splitting into components. **Velocity is always tangent to the path; acceleration can point anywhere.** The angle between them decides speeding up, slowing down, or turning — a direct generalisation of Ch.2 p6, and the first time "turning" becomes possible. | NCERT §3.7 + Ex; src 2 §6.4, §6.8 | 4 SS · IQ ×5 · YSI ×7 |
| 3 | **Constant Acceleration in a Plane — Two Ways to Solve It** | A particle at 2 m/s is hit by a constant 2 m/s² acceleration at 60° to its motion. Where is it after 2 s? | **Method 1:** one vector calculation, `v = u + at`, `s = ut + ½at²`. **Method 2:** pick two perpendicular axes and run **six scalar equations**, three per axis — and each triple is exactly Ch.2's SUVAT. Method 2 is the workhorse; Method 1 is the shortcut. Learn to choose. | NCERT §3.8; src 2 §6.8, §7.3 (A1) | 5 SS · IQ ×5 · YSI ×7 |
| 4 | **Projectile Motion — Setting It Up** | A ball thrown at an angle. Resolve it once, and two problems you already know fall out. | `u_x = u cos θ`, `u_y = u sin θ`, `a_x = 0`, `a_y = −g`. So **horizontally it is uniform motion; vertically it is free fall** — the two Ch.2 problems, running side by side and sharing only a clock (B2). Horizontal velocity never changes; that fact alone answers a surprising number of questions. | NCERT §3.9; src 2 §7.2–7.3; src 3 §3.8 | 5 SS · IQ ×5 · YSI ×7 |
| 5 | **Time of Flight, Height and Range** | You want the ball to land as far away as possible. What angle? | Derived, not handed over: `T = 2u sin θ / g`, `H = u² sin²θ / 2g`, `R = u² sin 2θ / g`. Then `R_max = u²/g` at 45° — **only when launch and landing are at the same height** (C1) — and `R_max = 4H_max`. Then **complementary angles give equal range** (A2): 30° and 60° land together, at different times and heights. | NCERT §3.9; src 2 §7.4 (A2, A3) | 5 SS · IQ ×6 · YSI ×8 |
| 6 | **The Equation of the Path** | Eliminate time from the two component equations and see what shape is left. | `y = x tan θ − gx²/(2u² cos²θ)` — **quadratic in `x`, which is *why* the path is a parabola** rather than a claim that it is. The compact `y = x(1 − x/R) tan θ` form, and how to read `u` and `θ` back out of a given trajectory equation (a standard exam item). | NCERT §3.9; src 2 §7.4 | 4 SS · IQ ×5 · YSI ×7 |
| 7 | **Thrown From a Height** | A projectile is fired horizontally at 98 m/s from a hill 490 m high. Where does it land, and how fast? | Horizontal projection as the `θ = 0` case; projection from a tower; landing at 45° means `v_y = v_x`. **And this is where the "45° is always best" rule visibly fails** (C1) — from a height, the optimum angle is less than 45°. | src 2 §7.3 Ex 7.3, 7.4; NCERT Ex | 5 SS · IQ ×5 · YSI ×8 |
| 8 | **Projectile Problems That Look Different** | Two instants, one height. A velocity at right angles to the launch. A target that is moving. | The recurring families: **two times at the same height with `t₁ + t₂ = T`** (A4); **velocity perpendicular to `u`** at `t = u cosec θ / g`, derived by dot product and by the angle between `u` and `g` (A5); the **monkey-and-hunter** result; "smallest speed on the path" and "how many times is `v ⊥ a`?" (B6). | src 2 §7.4 Ex 7.5–7.8 + IE 7.2; src 3 short-answer 6, 12 | 5 SS · RP ×2 · IQ ×6 · YSI ×8 |
| 9 | **Projectile on an Inclined Plane** | Fire a shell up a hillside. The ground is no longer flat, so "when does it land?" changes meaning. | Rotate the axes: `x` along the plane, `y` perpendicular to it, so `a_x = −g sin β` and `a_y = −g cos β`. Then `T = 2u sin(α−β)/(g cos β)` and `R = u²[sin(2α−β) − sin β]/(g cos²β)`, maximised at `α = π/4 + β/2`. **Replacing `β` by `−β` turns the up-plane result into the down-plane one** — one derivation, two answers. | src 2 §7.5 (A6) | 4 SS · IQ ×5 · YSI ×7 · **`tier: competitive`** |
| 10 | **Going Round in a Circle — the Angular Language** | A stone on a string, one revolution. Describing it in metres is awkward; describing it in *angle* is easy. | Angular position `θ`, angular velocity `ω = dθ/dt`, period `T`, frequency `f`; `ω = 2π/T = 2πf`; and the bridge to the linear world, **`v = rω`**, `s = rθ`. Radians earn their keep here — the formulas are only this clean in radians, which is the payoff for Ch.0's radian page. | NCERT §3.10; src 2 §10.2 | 4 SS · IQ ×5 · YSI ×7 |
| 11 | **Centripetal Acceleration** | A car goes round a roundabout at a steady 30 km/h. The speedometer never moves. Is it accelerating? | Yes — and this is the promise made on Ch.2 p6 finally paid off. **`a_c = v²/r = ω²r`, directed towards the centre**, derived rather than asserted. Speed constant, velocity changing, acceleration perpendicular to the motion at every instant. **Note on Scope: forces come later** (C3). | NCERT §3.10; src 2 §10.2 | 5 SS · RP ×1 · IQ ×6 · YSI ×8 |
| 12 | **When the Circle Speeds Up** | A fan switched on from rest. It is going round *and* getting faster. Two different accelerations at once. | **Tangential** `a_t = dv/dt = rα` changes the speed; **radial** `a_r = v²/r` changes the direction. They are perpendicular, so the net acceleration is `√(a_t² + a_r²)` at `tan φ = a_r/a_t`. The **three types** — uniform, accelerated, retarded — read off the angle between `v` and `a` (A7). Plus the **angular SUVAT** `ω = ω₀ + αt` etc., valid only for constant `α` (A8) — deliberately identical in shape to Ch.2 p9. | src 2 §10.2 + Ex 10.1–10.3, IE 10.1 (restores G2) | 5 SS · IQ ×6 · YSI ×8 · **`tier: competitive`** partial |
| 13 | **Relative Velocity in Two Dimensions** | You are on a train. A packet is dropped from a plane overhead. You and the pilot disagree completely about the shape of its path — and you are both right. | `v_AB = v_A − v_B` becomes a **vector** subtraction (C4), generalising Ch.2 p13 (C5). The frame derivation `v_{P,S} = v_{P,S'} + v_{S',S}` and `a_{P,S} = a_{P,S'}` for frames in constant relative motion (B3). Then the **minimum-distance / closest-approach** family: freeze one body, and a two-body problem becomes one. B5's food-packet probe closes the page. | src 2 §6.10 + Ex 6.29, 6.30; src 3 §3.9 (B3, B4, B5); NCERT §3.2 relative displacement | 5 SS · RP ×2 · IQ ×6 · YSI ×8 |
| 14 | **Crossing a River, and Walking in the Rain** | A swimmer who can do 4 km/h wants to cross a river flowing at 3 km/h. Should she aim straight across, or upstream? It depends on what she is trying to win. | **Shortest time:** steer straight across (`θ = 0`), `t_min = ω/v_br` — and accept the drift. **Zero drift:** steer upstream at `sin θ = v_r/v_br`, which takes longer and is **impossible when `v_r ≥ v_br`** (A10) — a limit worth understanding rather than memorising. Then the **rain–man** problem (tilt the umbrella into your own motion) and the **aircraft–wind** problem, which are the same subtraction wearing different clothes. | src 2 §6.10 river-boat + Ex 6.31, 6.32; src 3 §3.9 Ex 3.10, 3.11 + short-answer 14 | 5 SS · IQ ×6 · YSI ×8 |
| 15 | **Recap** | — | Retrieval only — `mind_map` + one formula table + 2 reasoning self-checks + a 10-question integrative quiz. **Zero summary paragraphs**, matching Ch.1 and Ch.2. | — | 10-Q quiz |
| 16 | **Practice — NCERT Exercises** | — | All NCERT Ch.3 exercises **verbatim** (Rule 0), regrouped into 4 themes, tap-to-reveal solutions in teacher voice. | NCERT Ch.3 Exercises | ~30 items |
| 17 | **Practice — JEE & NEET Drill** | — | ~60-item bank in 5 sections mapped one-to-one onto the five `tag_k2d_*` topics. | Reworded from sources 2 & 3 (**no source badge**) + genuine PYQs (**exam + year only**) | ~60 items |

**Page count: 18 (p0–p17)** — the same cap as Ch.2, reached only because vectors are recapped rather than re-taught (§1). Without that decision this chapter would be 23 pages.

---

## 6. Interactives, practice budget and hygiene

### 6.1 Interactives — and why this chapter's answer may differ from Ch.2's

Ch.2 was built with **no simulations**, on the founder's instruction that the mechanics engines are a separate programme. That instruction stands until the founder says otherwise.

**But there is a fact worth putting in front of the founder before this chapter is built:** the two engines this chapter would want **already exist**, from the 2026-07-29 parallel fan-out — `motion-lab/projectile/ProjectilePlayground.tsx` (scenarios `projectile`, `projectile-incline`, `monkey-hunter`, `relative`) and `motion-lab/circular/CircularArena.tsx` (scenarios `circular`, `vertical-circle`, `banked-road`), with their archetype barrels wired and the `motion_lab` block type already in the Zod schema and the admin editor.

So for Ch.3 the choice is not "build or don't build" — it is "**use what is already built, or wait**". They have not yet had a founder browser-QA pass, which is the real open item. See §7 decision 1.

**Reserved slots either way** (no page depends on one):

| Slot | Page | What it adds |
|---|---|---|
| `motion_lab` `projectile` | p4, p5 | The x-strip and y-strip playing beside the trajectory in lockstep — which *is* the independence idea, and is the one thing a printed figure cannot show |
| `motion_lab` `projectile-incline` | p9 | Rotating the axes and watching the same launch land differently |
| `motion_lab` `monkey-hunter` | p8 | The classic result, which is far more convincing when you can vary the drop timing and watch it still hit |
| `motion_lab` `circular` | p11, p12 | Speed constant while velocity rotates; the `a_t`/`a_r` decomposition drawn live |
| `motion_lab` `relative` | p13, p14 | The frame toggle — the dropped packet's path from the plane and from the ground, side by side |

**Reuse at zero cost regardless:** `classify_exercise` (scalar/vector recap on p1; "is this circular motion uniform?" on p12), `step_solver` everywhere, one-section `practice_bank` strips, `mind_map` for the recap, `real_world` cards (projectile in sport on p5; road banking teased on p11), and `image` + `figure_key`/`{fig:}` for ~35 numbered figures.

### 6.2 Practice budget

Per-page floor of **4 SS / 5 IQ / 7 YSI**, applied from page one rather than audited in afterwards.

| Vehicle | Count |
|---|---|
| `step_solver` blocks | ~65 (14 content pages, 4–5 each) |
| — gated `check` steps | ~195 |
| — `now_you_try` tails | ~65 |
| `inline_quiz` questions | ~75 |
| `YSI` strip items | ~105 |
| `reasoning_prompt` | ~8 |
| `classify_exercise` | 3 |
| Recap quiz | 10 |
| NCERT exercises | ~30 |
| JEE/NEET bank | ~60 |
| `worked_example` (reference only) | ≤4 |

**≈ 420 student-facing items (~610 counting gated steps), ~97% action-gated** — matching the Ch.2 standard.

### 6.3 Hygiene gates

Same as Ch.2, plus three lessons its Wave 1 paid for:

- **Reuse the Ch.2 MCQ factories verbatim** (`_book_ch2.js` → `_book_ch3.js`) so the answer-position hash-rotation carries over. Ch.2 landed at 22/19/15/18 with no hand-shuffling.
- **`reasoning_type` accepts only `logical` | `spatial` | `quantitative` | `analogical`.** `conceptual` is not a value; it failed Zod on four Ch.2 pages.
- **Never bulk-edit build scripts with JS `String.replace`** — `$'` in a replacement string is the special "everything after the match" pattern and silently duplicated the tail of a Ch.2 build script. Use an explicit `split`/`join`, or edit by hand.
- Run `_audit_ch3.js` (copy of `_audit_ch2.js`) **before** declaring a wave done: answer positions, length-tells (Ch.2 shipped 15 and fixed all 15), untagged questions, exposition runs over 120 words, and the per-page step-solver count.
- No `null` in any block field. No third-party book badge anywhere. Chapter title byte-identical to `ph11_kinematics2d`, taxonomy link set at build time (§18).

**Chapter-specific misconception list, for distractor design:** "the horizontal velocity decreases as the projectile rises" · "at the top of the path the velocity is zero" (true only for a vertical throw — in a projectile the horizontal component survives) · "45° always gives maximum range" (C1) · "the acceleration is zero at the top" · "range doubles when speed doubles" (it quadruples) · "in uniform circular motion there is no acceleration" · "centripetal acceleration is the force" · "the centrifugal force acts on the body in the ground frame" · "relative velocity means adding the speeds" · "a swimmer aiming straight across lands directly opposite".

---

## 7. Open decisions for the founder

The chapter was built without an explicit answer to any of these three — the founder said "continue building Chapter 3" and the build proceeded under the plan's own recommendation on each, all of which are reversible. Decision 2 was resolved before the build started.

1. **May this chapter use the two simulations that already exist?** `ProjectilePlayground` and `CircularArena` were built on 2026-07-29 and are wired end-to-end, but **still have not had a founder browser-QA pass**. **Built under recommendation (b): sim-free**, matching Ch.2. The reserved slots in §6.1 (p4/p5 projectile, p9 incline, p8 monkey-hunter, p11/p12 circular, p13/p14 relative) make adding them later a placement decision, not a rewrite.
2. ~~Confirm vectors are recapped, not re-taught.~~ **RESOLVED 2026-07-29 — stronger than recapping: no vector section and no recap strip at all.** The chapter opens on real physics, and vector technique is revised in situ inside the worked solutions. See the founder decision and the four "in situ" authoring rules in §1.
3. **Projectile on an inclined plane (p9) — keep as a full page, or fold into the JEE drill?** **Built under recommendation: kept as a full page**, every block marked `tier: 'competitive'` (a per-BLOCK field on `BaseBlockSchema`, applied via a `competitive()` mapper — there is no page-level tier field).
4. **Circular-motion boundary.** **Built under recommendation: kept the split.** p11 carries an explicit "Note on Scope" callout; p12 (non-uniform circular motion, restoring plan gap G2) is entirely `tier: 'competitive'`. Still needs founder confirmation, because it means a Crucible question tagged `tag_k2d_4` may need content from either this chapter or Laws of Motion.

---

## 8. Build sequence — COMPLETE

**Wave 1 — the plane and the parabola (p0–p9). ✅ Done 2026-07-30**, in three sub-passes: `build_ch3_plane.js` (p0–p3), `build_ch3_projectile.js` (p4–p6), `build_ch3_projectile2.js` (p7–p9).

**Wave 2 — circles and frames (p10–p14). ✅ Done 2026-07-30**, in two sub-passes: `build_ch3_circular.js` (p10–p12), `build_ch3_relative.js` (p13–p14). Plan gap G1 (NCERT has no relative-velocity section for this chapter — restored from the reference books, NCERT not cited for p13/p14's teaching) and G2 (non-uniform circular motion, restored on p12) both closed as designed.

**Wave 3 — close-out (p15–p17). ✅ Done 2026-07-30.** Recap (`mind_map` + formula table + 2 `reasoning_prompt` + 10-Q quiz), all 22 NCERT exercises verbatim in 4 themes (`build_ch3_practice.js`), and a 58-item JEE/NEET drill in 5 sections + 4 assertion–reason items mapped to the five `tag_k2d_*` tags.

**Final chapter metrics** (see header): 375 items, 513 gated (100%), 175 MCQs at 43/47/45/40, 0 length-tells, 0 exposition runs over cap. Every content page (p1–p14) meets the 4-solver/5-quiz floor from page one — no end-of-chapter gap-closing pass was needed, unlike Ch.2.

**One gap left open, on purpose (Rule 0):** plan §2.3 item B7, the "three particles chasing each other round a triangle" problem, was **not written** — it was not present in the extracted source text, and Rule 0 forbids reconstructing a problem from memory. Noted in `build_ch3_relative.js`'s header rather than fabricated.

### Figures and hero images — done 2026-07-30 (founder correction)

The first pass shipped the technical figures as **placeholder image blocks**, and gave the content pages **no page-opening image at all**. The founder caught both. Fixed:

### Second founder review pass, same day — a sequencing bug and a missing object

After the figures went live, the founder reviewed the actual rendered pages (not just the standalone rasters) and caught two more things:

1. **p1 "Two Motions at Once" — the coin itself was never drawn.** The figure showed both trajectories (a vertical drop and a curved flick) but no marker for the object doing either — the lines appeared to originate from nowhere, on an otherwise-empty desk edge. Fixed by adding an actual coin (a rim ring plus a filled disc, larger than the path-instant dots, so it reads as an object) sitting exactly at the release point. No new label was added alongside it — the near-flat first ~100 px of the flicked-coin curve leaves no vertical room for one without it landing on the curve itself, and the founder's ask was for the coin, not a caption.
2. **p2's `ch3-tangent-and-acceleration` figure — a real sequencing bug, not just a notation quibble.** The image sat at **array position 8**, and the step-solver that actually teaches "$ \mathbf{v}\cdot\mathbf{a} $" — what the dot product means and why its sign gives speeding-up/turning/slowing-down — was the *next* block, at position 9. So the figure showed unexplained notation (`v · a > 0` as the bold, primary label) before the page had taught it, which is exactly why the founder read it as "why are you multiplying velocity by acceleration — is this an error?" It was not an error, but it was genuinely mis-sequenced. Fixed two ways: (a) **moved the image block to after the step-solver** (now array position 10, right before the inline_quiz that tests the same rule), so it reinforces already-taught content instead of previewing unexplained content; (b) **swapped which label is visually primary** — "speeding up" / "turning, speed steady" / "slowing down" is now the bold emphasis-tier headline, and "v · a > 0" etc. is the smaller secondary line underneath, with a closing caption stating outright that "v · a" is the dot product. The physics was always correct (and matches the page's own step-solver callout verbatim); what changed is that a reader now meets the plain-English meaning before the shorthand, and meets the shorthand after it has been taught rather than before.

Both fixes verified directly in the DB (`p.blocks` array order re-queried after the rebuild, not just re-read from the build script) and re-rendered via the same no-dev-server `qlmanage` pipeline before republishing. Chapter metrics unchanged: 375 items, 513 gated, 0 length-tells, all 72 book pages Zod-valid.

**Lesson for Ch.4+:** a figure's `figure_key` placement in the page's own `blocks` array is part of its correctness, not just its content — check what block comes immediately before and after a hand-drawn figure, not only what the figure itself depicts. A figure that is accurate in isolation can still teach the wrong thing at the wrong moment.

### Third pass, same day — the fix was live on the origin and still invisible (cache bug, now fixed platform-wide for this pipeline)

After republishing the two corrected figures, the founder reported **still seeing the old versions** — the old `v · a` label ordering, no coin marker. A direct `curl` of the R2 origin (bypassing any client cache) proved the **new** content was already being served correctly; the mismatch was entirely downstream.

**Root cause:** `publish_ch3_figures.js` (copied from Ch.2) uploaded every figure to a path keyed only by `figure_key` — e.g. `ch3/ch3-two-coins.svg` — with `Cache-Control: public, max-age=31536000, immutable`. That header tells every cache in the chain (the founder's browser, Cloudflare in front of the `r2.dev` public domain) that the URL's bytes will **never** change, so once fetched once, a client never even attempts to revalidate — a later re-upload to the same URL is invisible to it, permanently, however many times it's re-fetched.

**Fix:** the storage path now includes a SHA-256 prefix of the rendered SVG content itself (`ch3-two-coins.0766da74d2.svg`). A content change produces a genuinely different URL, so "immutable" becomes actually true — a given hash's bytes really never change — and every cache is forced onto fresh bytes on the next load, with no purge and no asking anyone to hard-refresh. Verified directly: fetched both new hashed URLs fresh and confirmed the coin marker and the corrected label weights are present at the byte level, not just in the source script.

**This is a platform-wide risk, not a Ch.3-only bug.** Any `publish_*_figures.js` script using this pattern (Ch.2's included) will silently fail to propagate a post-publish figure fix the same way, for the same reason. **Ch.2 was not touched** — its figures are already reviewed and live, and changing their URLs now would need re-verifying all 13 for no benefit — but any chapter whose figures might still need a correction should adopt the content-hashed path before its first fix is needed, not after a founder reports one that "isn't showing up."

**1. All 8 technical figures are now hand-drawn SVG, live on R2, browser-legible.** `svg/figures_ch3.js` + `svg/publish_ch3_figures.js`, following the Ch.2 pipeline. Each figure was drawn from the **actual book figure, read as a rendered page image** — NCERT Fig 3.14/3.16/3.17/3.18/3.19/3.20 and "Mechanics Vol. 1" Fig 10.1. Reading the rendered NCERT page is what **confirmed arc PQ in Fig 3.20 is a quarter circle**, which is the assumption Exercise 3.9's answer rests on — it was an inference before.

**2. The placeholder `generation_prompt` was a real reader-facing bug**, not just untidiness: the renderer prints any prompt it finds verbatim, with a "Copy prompt" button, so `PLACEHOLDER — this figure is hand-authored SVG, see scripts/...` was showing on the page. **A hand-drawn figure must carry `figure_key` and NO `generation_prompt`.** Stripped from the build scripts too, so a re-run cannot reintroduce it.

**3. Every one of the 14 content pages now opens with a hero image** — a real-life *application* of that page's concept, as a flat-geometric vector illustration on a dark background (relief-drop aircraft, mountain hairpin, javelin thrower, fountain arcs, clifftop throw, firefighter's jet, ski jump, bicycle cassette, velodrome banking, ceiling fan spinning up, passing trains, river ferry). All 14 prompts live in one `HEROES` map in `_book_ch3.js` so they can be reviewed and revised together.

**4. Nine figure defects were caught by LOOKING at the rendered output**, none of which the lint gate or Zod could see: two labels running off the right edge, three label-on-label collisions, one label sitting on a curve, `v_x` rendering as a literal underscore (SVG has no LaTeX — subscripts need `<tspan>`), a table header overlapping its neighbour, and three on-curve angle labels piling up on top of each other.

**The one that needed a redesign, not a nudge:** the p7 figure originally marked all three landing points on the ground with their ranges. But the three ranges are 54.7 / 56.6 / 54.6 m — at any honest scale the landing points sit ~16 px apart and the labels pile up. A range-vs-angle plot fails the same way, because the curve is flat near its maximum, which is *why* 45° is only slightly worse. So the numbers moved into a small two-column table (tower vs level ground) where a 2 m difference is perfectly legible, and the figure's real point — **the winner switches columns** — became the headline. Inflating a 3% difference into a dramatic visual would have been a lie.

**Verification without a dev server.** §5.2 bars starting a preview without permission, so the figures were rasterised locally instead: inject a temporary dark backdrop, give the SVG explicit pixel dimensions, and render through `qlmanage` (WebKit). ImageMagick is useless here — this machine's build has no librsvg/ghostscript/freetype delegates, so it renders SVG text as nothing. Also note Ch.2's `height="auto"` is invalid SVG that browsers tolerate but every offline rasteriser turns into a zero-height image; Ch.3 omits `height` and lets the viewBox supply the ratio, which works in both.

**ORDER OF OPERATIONS, easy to get wrong:** the build scripts define `src: ''`, so **every re-run of a build script wipes the figure URLs** and `publish_ch3_figures.js` must be re-run after it. Build → publish, every time.

**One slug collision found and fixed, worth remembering for Ch.4+:** the `book_pages` unique index is on `{book_id, slug}` **only** — not `{book_id, chapter_number, slug}`. Ch.2 had already claimed the bare slugs `ncert-exercises` and `jee-neet-drill`; Ch.3 had to use `motion-in-two-dimensions-ncert-exercises` / `-jee-neet-drill` instead. **Every future chapter's recap/exercises/drill pages need a chapter-qualified slug from the start**, not just `ncert-exercises`.

Every wave: all writes through `scripts/lib/book-writer.js` (versioned, content-loss-guarded, soft-delete only) per §0.6; every page `_validate.mts`-clean; `_audit_ch3.js` run at every wave end (and upgraded mid-build to name length-tells by item id and report exposition-run block indices — both were needed to fix things efficiently rather than guessing); `published:false` pending founder review.

**Remaining before publish:**
1. **The 14 hero images need generating** — every content page has an authored prompt and `src: ''`, awaiting the ChatGPT-in-Chrome art pass. The chapter reads completely without them.
2. **Founder review** in the admin books-editor preview.
3. **A ruling on §7 items 1, 3 and 4** — all three currently stand on the plan's own recommendation, not a founder decision.
4. **No in-reader browser verification yet.** The 8 figures were verified as standalone rasters, which caught nine defects, but nothing has been checked *inside the reader page flow* at desktop and mobile widths on all three dark themes. Ch.2's equivalent pass is what found the label-on-curve class of bug, so this is worth doing before publish. It needs founder permission per §5.2.
