# Physics Simulation QA — UI fixes + pedagogy audit

**Date:** 2026-07-29
**Scope:** the four Phase-1 simulations (FBD Studio, Pulley Lab, Projectile Playground, Circular Arena) and all **46 archetypes**.
**Verdict in one line:** two of the four genuinely teach; one is a good engine with the teaching layer missing; one is a moving diagram with a beautiful skin.

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Governing docs:** [`PHYSICS_SIMULATION_PROGRAM.md`](PHYSICS_SIMULATION_PROGRAM.md) §2 (the five design laws — the rubric used here), [`SIMULATION_DESIGN_WORKFLOW.md`](../workflows/SIMULATION_DESIGN_WORKFLOW.md)
- **Next action:** founder reads §4 (the ranked weak list) and §7 (the ten fixes), and picks which of the ten get done before any of this goes on a page
- **Blocked on:** nothing. Every fix below is code we own.

---

## 1. What this report is, and how honest it is trying to be

The brief was: *does each of these genuinely add value and build concepts, or is it a fancy diagram?* The founder has said explicitly he does not want "fancy-looking simulations which are nothing more than simulated diagrams of the books". A report that says everything is fine would be worthless, so the bias here runs the other way: an archetype has to **earn** each of the five design laws, and the benefit of the doubt goes to the sceptic.

Method: every file in `fbd/`, `pulley/`, `projectile/`, `circular/` and the four archetype tables was read in full, plus `lib/grade.ts`, `lib/cut.ts`, `lib/constraints.ts`, `lib/dynamics.ts`, `lib/circular.ts`, `lib/integrate.ts`. Reachability claims (dead misconception codes, unreachable layers, canvas fill percentages) were **executed**, not eyeballed — the physics modules are pure TS and Node runs them directly, which is the same property `verify-motion-lab.mjs` relies on.

Two things this report is **not**: it is not a browser QA pass (agents are barred from starting a dev server, §5.2), and it is not a physics audit — `verify-motion-lab.mjs` (53/53) and `verify-mechanics-bench.mjs` (114/114) already cover that, and they are the reason this program has been unusually honest about its numbers.

---

## 2. Part 1 — the UI fixes made to Projectile Playground

Files changed: `blocks/motion-lab/projectile/Field.tsx`, `blocks/motion-lab/projectile/ProjectilePlayground.tsx`. Nothing else was touched. `tsc` clean, `lint:sims` 0 errors, `verify-motion-lab.mjs` still **53/53** — **no physics changed**.

### 2.1 The mobile failure was present, and it was worse than FBD's

FBD Studio's canvas measured 128×107 inside a 360 px-tall parent at a 375 px stage. Projectile had the same two causes and one extra multiplier:

1. `lg:grid-cols-[7fr_5fr]` is a **viewport** query. At a 375 px stage the canvas column is ~200 px; in the admin editor's split-pane preview the viewport is a laptop and the pane is ~380 px, so the two-column layout survives where it should not.
2. The SVG carried a hardcoded `viewBox="0 0 780 430"` with default `preserveAspectRatio`. Rendered into a 200 px-wide box **430 px tall**, it letterboxed to 200×110 — 74% of the canvas was empty before a single line was drawn.
3. `GUTTER` and `BAND` were fixed at 56 px of viewBox each. That is 12% of a desktop canvas and 33% of a phone canvas.

**Measured, across all 14 archetypes** (content bounding box vs canvas box; script re-run before and after):

| Context | Before | After |
|---|---|---|
| Desktop, 760 px column | 73% × 47% linear, **34% area** | 76% × 62% linear, **47% area** |
| Phone, 375 px stage | 73% × 12% linear, **8.8% area**, drawing 146 px wide | 74% × 45% linear, **34% area**, drawing **255 px wide** |
| Admin preview pane | 73% × 14% linear, **9.4% area**, drawing 158 px wide | 75% × 48% linear, **36% area**, drawing **276 px wide** |
| Worst single archetype | `range-vs-angle`, **16% area** | **34% area** |

On a phone the drawing is now **1.75× wider and covers 3.8× the area**. Nothing was stretched to get there.

### 2.2 What was actually done

- **Two ResizeObservers, no CSS breakpoints.** `useMeasuredWidth` (local to the Playground) measures the wrapper and the canvas box independently. Below a **measured** 640 px the grid becomes one column via inline `gridTemplateColumns`. The Tailwind `lg:` pair is left in place purely as the pre-measurement/SSR fallback for the one frame before the observer reports. Width only is observed — this component *sets* the height, so observing height would feed its own output back into its input.
- **The viewBox is now the measured CSS pixel box.** One viewBox unit = one device-independent pixel. No letterboxing is possible, and `fontSize={12}` on the canvas clock now means 12 px to the eye instead of 9.8 px on a 640 px render — which was silently under the §2 minimum-readable floor.
- **The canvas height is chosen from the flight's own aspect ratio.** Equal scale on both axes is non-negotiable (a stretched y makes a 30° launch look like 60° and contradicts the readout beside it), so a 5:1 trajectory can never fill a 1.8:1 box. The fix is to give the box the shape of the flight: `h = clamp(availW / contentAspect + padding, 200, block.height ?? clamp(0.68·w, 300, 560))`. An authored `height` is honoured as the **ceiling**, not as a fixed value.
- **Hysteresis, so it does not twitch.** Height re-commits only when it moves more than 10% and never while the aim handle is grabbed — the same freeze the camera scale already had, for the same reason (a live re-fit driven by the thing being dragged pulls the handle out from under the finger).
- **The strips compress rather than disappear.** `stripSize(w) = clamp(0.072·w, 26, 56)`. The left-gutter + bottom-band + centre-trajectory arrangement is the entire pedagogical claim of this sim, so dropping it at a breakpoint would leave a phone user looking at an ordinary parabola with nothing to compare it against. It survives at 375 px, at 26 px per strip.
- **Marks scale with the canvas** via `uiScale(w,h) = clamp(min(w,h)/430, 0.72, 1.2)` — ball, companion balls, target ring, cart, launcher, equal-time stamps, strip dots and ticks. The floor is deliberately generous: on a phone the marks *should* be proportionally larger, because the finger has not shrunk with the screen. The 40 CSS-px grab radius was already correct and is untouched.
- **Arrows: screen px, sized to the canvas.** `arrowPx = clamp(0.16·min(w,h), 30, 74)`, then `vecPxPerUnit = arrowPx / launchSpeed`. This was already screen-px-normalised (which is why projectile did **not** have the "vectors explode or vanish across the slider range" defect the founder reported elsewhere — at 2 m/s and at 60 m/s the launch arrow is the same length, and every other arrow is honestly proportional to it). The change is that it now tracks the canvas instead of being a hardcoded 62.
- **Bug found and fixed while measuring: the aim handle could float with no arrow under it.** There was no dedicated launch-velocity arrow — the shaft under the handle was the *live velocity* arrow, which leaves the launch point the instant the flight starts and **vanishes entirely when the student turns "v and a arrows" off**. The sidebar meanwhile says "Drag the handle at the tip of the launch arrow". Design law #1 says grabbing that vector is the primary gesture, so it is now drawn unconditionally, faint white, under the handle.
- **The guided panel moves above the canvas when stacked.** While the guided ladder runs, `▶ Fire` is disabled and the *only* thing that enables it is the CTA inside the guided panel. In two columns that is obvious. Stacked, the panel would have sat below the canvas, the legend, the strip labels and the transport row — so the first thing a phone student meets is a dead Fire button with its revival off-screen. Dead ends get read as "the sim is broken". Same argument for the predict gate: "commit before you look" only works if the question is above the thing you must not look at yet.

### 2.3 Confirmed *not* broken in projectile

No text overlaps (the canvas still renders exactly one `<text>`, the clock riding the ball). No clipped canvases. Drag is not gated on the animation clock. Pointer events with capture throughout. No memo keyed on block identity — `setupKey` is content-hashed, which is correct, and this is the one of the four sims that got that right without prompting.

---

## 3. Per-sim verdict

### 3.1 FBD Studio — **the only one where the student is genuinely the author**

**What genuinely teaches.**

- **Compose is real.** `sceneEdit.ts` rebuilds the scene graph on every mutation. Add a block, a sphere, a wedge; seat a body on the slope; hang it from a string; push it; and **drag the hypotenuse** — `setWedgeAngle` re-seats every body, rewrites the contact normal, and re-derives the DOF continuously. A student can build a scene the archetype library does not contain. Across all 46 archetypes this is the single clearest satisfaction of design law #1.
- **The grader is real.** 20 misconception codes with per-code copy that names the wrong belief and attacks it. Direction is a continuous drag graded to 8°, magnitude to 5% — a student can be wrong by 12° and get told so specifically. That is not multiple choice.
- **The cut tool is real, on multi-body scenes.** Free enclosure (centre-in-rect), honest partitioning (weight can never be internal because its agent is `world:earth`), and **step-by-step pair cancellation** — press once per pair and both members fade together with a tie-line between them. This is the best-designed thirty seconds in the entire program.

**What is decoration or broken.**

- **The student cannot choose which body to isolate.** At all. `bodyId` comes only from `task.body ?? archetype.defaultBody`. `DrawStage` has no body-selection prop. Meanwhile `string-over-pulley`'s guide says *"Draw the block's diagram, then try the hanging mass"*; `two-stacked-blocks` says the partner force *"belongs on a different diagram"*; the `third_law_pair_same_body` diagnostic ends *"Move this one onto the wedge"*. **All three instruct an action the UI cannot perform.** *Which body do I isolate* is arguably the most important decision in free-body analysis and it is made for the student every single time.
- **Nine snap points, a second drag handle, and a paragraph of design rationale for `applicationPoint` — which `grade.ts` never reads.** Grep it: zero hits. Attach the normal to the top-left vertex and the weight to the right edge and you are graded 100% correct.
- **Four codes are unreachable.** `ghost_centrifugal` matches a regex against `label` + `claimedFrom`; `toStudentForces` never sets `label` and `claimedFrom` is always an id like `world:ground`. It cannot fire. `force_agent_unnamed` has a nine-line doc comment justifying why it must be its own code, and `grade.ts:291` emits `extra_force` in its place — so a student with a *correct* arrow and a mis-picked agent sees a panel headed **"extra force"**. `missing_spring` is structurally impossible (`MechanicsSceneSpec` has no springs field), which makes the Spring palette button a pure trap in 100% of configurations. The `unknown` force kind has a whole matching path and no palette entry.
- **The defaults *are* the misconceptions**, which manufactures false positives. `place('normal')` drops the arrow at 90° with magnitude = mg. On any incline, tapping Normal and pressing Check yields `normal_not_perpendicular` **and** `normal_equals_mg_on_incline` from a student who has expressed no belief — they just have not dragged yet. Conversely weight is placed correctly at 270° with the agent pre-filled, so `weight_not_vertical` requires deliberately breaking a right answer. **The sim draws the force students get right, for them, and pre-draws the wrong version of the one they get wrong.**
- **The teaching text and the grader contradict each other on rung one.** `single-body-ground` defaults to `mu_s: 0.4, push: 0`. `trueForcesFor` emits a friction TrueForce whenever μ ≠ 0 regardless of whether it is zero, so a block at rest on level ground with nothing pushing it triggers *"This contact is rough (μ = 0.40), so friction acts along the surface and you have left it out. Which way does it point, and why?"* — a question with no answer, because the correct physics is *there is no friction force*. The same archetype's guide says *"nothing else is in contact with it, so nothing else can act on it."* The only way forward teaches: **always draw friction when a surface is rough, even when it is zero.**
- **Two compose gestures put the ground truth into a state that is not physics.** Neither `setWedgeAngle` nor `setFriction` recomputes `Contact.slidingSign`, and `solveScene` only ever promotes static→kinetic, never back. Drag `incline-with-friction` from 35° down to 10° and the engine reports a block accelerating *up* a 10° slope — and marks the student who correctly says "it's stuck, friction is static" as `friction_wrong_sense`.
- **The view rescales under the finger during the incline drag** — `geomKey` includes every quantity `setWedgeAngle` changes per frame, so `fitView` re-fits mid-gesture. `SceneView.tsx` explicitly claims this class of bug is designed out.
- **Solve is a stage the student barely participates in.** Two buttons and a number box. The ΣF lines are assembled from `solvedForcesFor(scene, body.id)` — the *engine's* answer. **The diagram the student just fought the grader to get right does not appear in, feed, or constrain the algebra.** Once accepted, it is discarded. The link between "the diagram I drew" and "the equation I write" is asserted in prose and not enacted in code. And `termFor` only ever emits `cos`, so on a 30° slope the weight prints as `m₁g cos 60°` where every textbook, teacher and set of notes writes `mg sin 30°`.
- **A mutual exclusion that kills the whole design.** `editable = !block.scene && !block.numeric && ...`. Supplying `numeric` — the only way Solve can ever say "Correct" — turns Compose read-only. So the tool has two modes: *author your own scene and never get a graded answer*, or *get a graded answer on a scene you cannot touch*. **Design law #1 and the solve check cannot both be on.**

### 3.2 Pulley Lab — **a genuinely good engine with the teaching layer missing**

**What genuinely teaches.** The segment↔term colour binding is real, not cosmetic. `SegSwatch` renders mini-lines with byte-identical stroke width, dash array and opacity to what the canvas paints on the rope, and — this is the part that matters — `segCount` comes from the deriver's own per-segment contribution list, **not** from rounding the coefficient. So a coefficient of 2 draws two mini-lines *because two segments were walked*, and when the two disagree the ledger surfaces the mismatch rather than reconciling it. The live measurement table is measured, not asserted: drag a block, and `measureSegments` re-walks the moved geometry so the "total length unchanged" row is a computed sum. **This is a real answer to a real gap** — students genuinely cannot write constraint equations, and this is the only place in the program that attacks it.

**What is decoration or missing.**

- **The derivation is not shown. The *result* is shown three times.** `L = Σ|rᵢ₊₁ − rᵢ| → dL/dt = 0 → d²L/dt² = 0` exists **only as a code comment** in `constraints.ts`. One click of "Derive the constraint" prints the finished equation, all terms at once, plus an English sentence, plus a measurement table. Three views of the answer, no intermediate line, no "segment 1 contributes −a₁". **The rung ladder's whole claim — *the constraint equation and where it comes from* — delivers only the first half.**
- **Zero misconception codes.** `lib/grade.ts` — the file whose header says "Every wrong answer maps to a NAMED misconception" — sits two directories away and is imported by exactly one file: `FbdStudio.tsx`. The complete list of things Pulley Lab can say to a wrong answer is: *"Not yet — check which body the question is asking about, and which way you called positive."* Answering `9.8` (used g), or 2× the right value (forgot the movable-pulley factor), or the *other* body's acceleration all produce that identical sentence.
- **The predict gate is off by default and broken when on.** It needs an author-set `predict_body`; and it compares two *different scenes with different default masses*, so "does m₁ accelerate faster now?" is answered by a comparison in which the mass also changed. Worse, if the predict body is absent from the new scene, `?? 0` makes the magnitude zero and the student is confidently told *"It got slower."* Separately, `MechanicsBenchBlock.predict` — a full MCQ with `answer_index` and `reveal` — is accepted by the schema and **never read** by `PulleyLab.tsx`.
- **The massive-sheave derivation is never rendered anywhere in the app.** `dynamics.ts` builds a genuinely good torque-ledger derivation string for the one rung whose entire point is "equal tension is an assumption". PulleyLab feeds the ledger `deriveConstraints(baseScene)`, which does not include it, and ignores `solve.constraints`, which does. The student gets a two-sentence paragraph. **T₁ ≠ T₂ is the single most valuable idea in the pulley ladder and it is not shown.**
- **Friction is disabled by the archetype data.** `slidingSign: mu > 0 ? 1 : 0` hard-codes the contact as *already kinetic* the moment the μ slider leaves zero, so `findSlippedContacts` skips it and the engine's best feature — the assumption-then-test fixed point, the thing that caught the `{mB: 2.742, mA: 0}` bug during the build — **never runs for these two archetypes.** Set μ = 0.8 with a light hanging mass and the sim reports the block accelerating backwards.
- **Acceleration arrows are not readable.** `len = min(58, 14 + |a|·7)`. Doubling the acceleration lengthens the arrow by 33%; everything above a ≈ 6.3 draws identically. Comparing arrows across bodies is actively misleading. (The Circular Arena's arrows are proportional. These should be too.)
- **"Written out"** looks like a derivation and is a printout of solver matrix rows in solver order — three-decimal coefficients, `N_` and `f_` unknowns the student was never introduced to, LaTeX like `\Sigma F_{\perp}\ (m₁,\ 0°)`. Impressive-looking, unreadable, in no pedagogical order.
- **The Real World tab is a static table with one multiplier slider.** The identical-joules column is a genuinely good argument and it is *told*, not discovered. Nothing carries the `n` the student just derived into it, and nothing carries its argument back.

**Credit where due:** Pulley Lab is the one sim that fully earns design law #5. There is no animation loop anywhere in `pulley/`; rope segments are anonymous before the ledger stage; `accelerations` is passed as literal `null` before the solve reveal so no arrow *can* render early. That is the convention done properly.

### 3.3 Projectile Playground — **the best "invisible middle step" in the program, and the thinnest grading**

**What genuinely teaches.** The split screen. The left gutter and the bottom band are not decoration: the vertical strip's dot is placed with the *same* `sy()` as the ball, so pixel-level agreement is guaranteed rather than approximated, and the eight equal-time stamps are **even along the bottom track and bunched at the top of the side track** — visible before anything moves. That single static contrast is a better statement of component independence than any textbook figure, and it is the default view, not a hidden tab. Design law #3, unambiguously earned. `monkey-hunter` and `cart-frame` earn it a second way: the "if gravity did not exist" aim line, and a frame change where the vertical track is visibly identical in both views.

**What is decoration or missing.**

- **Nothing is graded.** Seven misconception *cards* exist, context-gated so they fire after the evidence rather than as a preamble — that part is well built. But **five of the seven fire on a clock or a state, not on a student error.** There is no wrong answer to diagnose except the optional `block.predict` MCQ, `target-practice`'s miss distance and `monkey-hunter`'s hit/miss. Design law #2 is half-satisfied at best: the sim *names* misconceptions, it does not *detect* them.
- **Two of the fourteen misconception cards are dead code, and two fire before the evidence.** Verified by execution:
  - `same-range-pair` and `target-practice` both target `range_always_max_at_45`, whose guard is `if (!fanOn && height <= 0 && !dragOn) return null`. Neither archetype sets the `sweep` flag (so `fanOn` can never become true), both have `height: 0` and drag off. **The card can never appear on either.** `target-practice` therefore has no misconception attack at all — it is a scoring game.
  - `launch-from-height` (height 6) and `with-drag` (height 1.8) pass the guard at t = 0, so the card *"45° is only the answer from ground level"* is on screen **before the student has fired a single shot** — the exact preamble the file header says it must never be.
  - One-line fixes: add `flag('sweep', …, true)` to `same-range-pair` and `target-practice` (or retarget them), and add an `everFired` term to the `range_always_max_at_45` guard.
- **"The student is the author" is really "the student aims".** They drag the launch vector — genuinely, and it is the right primary gesture. But they cannot move the target, place the monkey, choose the incline sign, add a second projectile or pick the ground profile. Compared to FBD's Compose stage this is a knob, a good one.
- **Four archetypes are the same machinery.** `range-vs-angle`, `launch-from-height`, `safety-envelope` and (partly) `with-drag` are all the angle fan plus the R(θ) curve. `apex-anatomy` and `apex-gravity` are the same "stop it at the top" gesture with a different arrow highlighted. That is six of fourteen rungs on two ideas.
- **`incline-launch` prints the wrong words for its own rotated view.** The strip labels stay "Horizontal"/"Vertical" and the `coupled_components` card talks about "the horizontal dot ticks along at a steady rate" — which is false in rotated axes, where the along-slope motion is *decelerating* at g sin β. The readout was carefully rewritten for the rotation; the strip labels and the card were not.

### 3.4 Circular Arena — **one outstanding moment inside a large moving diagram**

**What genuinely teaches — two things, and they are both good.**

- **The tangential release.** `releaseState` returns position plus `tangent(θ)·v` and hands it straight to the *same* `integrate` + `gravityAccel` the Projectile Playground uses. The gravity choice is right (g in the side-on vertical view, 0 in the top-down horizontal one). The canvas then draws the real path **plus the extended tangent plus the radially-outward line most students predict**, named in the legend. Prediction captured first, wrong answer drawn beside the right one. **This is the best single moment in all four sims** and the only place design law #4 is actually visible to a student.
- **`TensionPlot`.** The shaded sub-zero region, the dashed zero line, and — the detail that makes it honest — the curve *stops* at `lostAt` rather than inventing values past the point the string went slack. Together with the live marker, this lets v_min = √(gr) be **found with the speed slider before anyone derives it**. It is the only visual in the Arena a student can reason *from* rather than be told by.

**What is decoration.**

- **It auto-plays, and its own file header says it never does.** `useState(true)` for `playing` plus `useAnimationFrame` gated on viewport entry: the ball is orbiting before the student has read guided step 0. Design law #5, broken at the top of the file that quotes it.
- **A second, worse uninitiated event:** the animation tick calls `doRelease('constraint failed')` by itself. On the vertical tab, dragging the speed below √(5gr) launches the ball into a projectile flight **with no button, no prediction and no warning** — bypassing the predict gate the flagship exercise is built around.
- **Thirteen `targets` misconception codes in the archetype data, wired to nothing.** `grep targets circular/*.tsx` returns nothing. The Projectile Playground consumes the same field through a `misconception()` renderer; the Arena does not. The machinery is in the data and absent from the UI.
- **Three distinct classic misconceptions, one shared explainer.** The default cut prediction offers "straight outward" / "along the tangent" / "curves backwards" / "stops then falls" — and all three wrong options receive **byte-identical** feedback. That is right/wrong scoring with a shared paragraph, not diagnosis. And `worked_reveal` renders on `checked` regardless of correctness, so one click of Check with junk in the box hands over the full worked solution.
- **The cut can be taken with no prediction at all.** On the `arena` tab, if the author supplied no `block.predict`, the Cut button renders fully unlocked. A student who never opens the "Cut the String" tab cuts it in one click and learns nothing.
- **On the flagship `cut-the-string` archetype, three layers are permanently unreachable.** `layersAt` gates the string-tension arrow, the weight arrow and the tension readout at `revealed >= 4`; `revealed` maxes at `steps.length`; that archetype has 3 steps. **The one exercise about what the string was doing never draws the string's force, forever, with no escape hatch.** Same for `velocity-is-tangential`.
- **No authoring whatsoever, and mass is not even a slider.** `circularSpecOf` reads mass from archetype params and `CircularArena` renders only its own four hardcoded sliders, so archetype `params` are never surfaced. The `cut-the-string` archetype declares a `plane` select — there is no UI for it, so the vertical version of the flagship exercise is author-only and unreachable by a student.
- **`InstrumentsView.tsx` — 422 lines, five hand-drawn machines, zero pedagogy.** No predictions, no checks, nothing gradeable. Each machine ends with a static paragraph that *tells the student the discovery they were meant to make* — the conical pendulum's says "Change the bob mass and watch ω and the period **not move**" and then explains why, before the student has moved anything. The hardcoded 0.0002 kg droplet and 2 g sample are numbers with no control behind them, present only to look specific. **This is the largest pedagogically inert surface in the program.**
- **`BankedRoadView` draws the friction arrow at `min(required, max)`.** In the unsafe state the picture shows friction comfortably present at its cap while the pill says the car slides off. **The deficit — the entire lesson of the safe band — is never drawn.** The legend then repeats the capped number as if it were the acting force.
- **All six tabs render for every archetype, and several print wrong copy.** A horizontal archetype on the "Vertical Circle" tab still asserts *"Slowest speed at the bottom that still completes the loop"* and *"It makes it round"*. A vertical archetype on the "Which Frame?" tab gets a tab named after a control that silently does not render. And `banked` / `instruments` short-circuit the whole canvas block, so the guided panel, the predict gate, the ExpertTip **and the authored `numeric` question** all vanish with no indication they exist elsewhere.

---

## 4. The ranked weak list — archetypes that are just a moving diagram

Scored against the five laws. `✓` earned, `◐` partial, `✗` failed. Ordered worst first.

| # | Archetype | Sim | L1 author | L2 grade | L3 middle step | L4 compose | L5 guided | The one change that would earn its place |
|---|---|---|---|---|---|---|---|---|
| 1 | `centrifuge` | Circ | ✗ | ✗ | ✗ | ✗ | ✗ | It is an rpm→g calculator with a rotor drawn round it. Make the student **predict the rcf before the reveal**, and make the exercise "you need 3000 g and your rotor is 8 cm — what rpm?" so ω²r is *inverted*, not evaluated. |
| 2 | `spin-dryer` | Circ | ✗ | ✗ | ✗ | ✗ | ✗ | The whole idea ("nothing flings it — it stopped being pulled in") is *told* in a paragraph. It is `cut-the-string` at 20 Hz: give it the real release path and the radial ghost line, and let the student predict which way the drop leaves the hole. |
| 3 | `conical-pendulum` | Circ | ✗ | ✗ | ✗ | ✗ | ✗ | The verdict text pre-announces the discovery ("watch the mass **not** matter"). Delete that sentence, add a mass slider, and gate the reveal on a predict: "double the bob mass — does the cone angle grow, shrink, or stay?" |
| 4 | `rotor-drum` | Circ | ✗ | ✗ | ✗ | ✗ | ✗ | The one interesting question — *what holds the rider up?* — is answered in step 2 before anything is manipulated. Make it a three-option prediction ("the wall pushing out / friction / centrifugal") and drop the floor **only after** they commit. |
| 5 | `fixed-pulley` | Pull | ✗ | ✗ | ✗ | ✗ | ✓ | The constraint `a₁ = −a₂` is not an insight. Its only job is to establish MA = 1, which the Real World tab already states. Either fold it into `atwood` as its zero-difference case, or make it the rung where "does the pulley reduce the force?" is predicted and disproved. |
| 6 | `pulley-with-mass` | Pull | ✗ | ✗ | ✗ | ✗ | ✓ | **The highest-value rung in the ladder, currently empty.** `dynamics.ts` builds the τ = Iα ledger that shows T₁ ≠ T₂ and `PulleyLab` never renders it. Feed the ledger `solve.constraints` and the whole point appears — this is a wiring fix, not new physics. |
| 7 | `pulley-on-accelerating-support` | Pull | ✗ | ✗ | ✗ | ✗ | ✓ | "Accelerations relative to what, exactly?" is the right question and there is no frame control to answer it with. Needs the same ground/lift toggle the FBD `lift-accelerating` rung also lacks — build it once, use it twice. |
| 8 | `uniform-basics` | Circ | ✗ | ✗ | ◐ | ✗ | ✗ | Its `targets` code (`speed_constant_in_ucm_means_no_accel`) is exactly the right misconception and is wired to nothing. Add a predict gate at step 2 — "steady speed: is the acceleration zero?" — and emit the card when they say yes. |
| 9 | `bridge-crest` | Circ | ✗ | ✗ | ◐ | ◐ | ✗ | The N = 0 → airborne moment is a genuine handoff to the projectile engine and it is only *described* in step 4. Wire the actual release, as `cut-the-string` already does. |
| 10 | `target-practice` | Proj | ◐ | ✗ | ◐ | ◐ | ✓ | A scoring game whose misconception card is **provably unreachable**. Turn the "now find the OTHER angle" hint into a *required second hit* and grade it, and enable the sweep flag so the card can fire. |
| 11 | `atwood` | Pull | ✗ | ✗ | ◐ | ✗ | ✓ | Currently "unequal masses, it runs". Make it the rung where the near-universal error `a = (m₁−m₂)g/m₁` is predicted and contradicted — the whole system accelerates, not just the heavy side. |
| 12 | `apex-gravity` | Proj | ◐ | ◐ | ◐ | ◐ | ✓ | Near-duplicate of `apex-anatomy` with one arrow swapped. Merge them into one rung with two questions, or make this one *the* place where a = g is checked **numerically** against the v-t slope. |
| 13 | `single-body-ground` | FBD | ✓ | ✗ | ✗ | ✗ | ✓ | Rung 1's grader contradicts rung 1's own guide text (see §3.1). Set `mu_s: 0` on this archetype and the whole thing repairs itself — `missing_friction` stops firing spuriously and `ghost_motion_force`, currently suppressed, becomes reachable exactly where it matters most. |
| 14 | `lift-accelerating` | FBD | ✓ | ✗ | ✗ | ✗ | ✓ | Called "THE punchline" and its instruction — *"switch the frame and draw it again"* — is impossible: `setFrame` exists in `sceneEdit.ts` and is called from nowhere. One button. |
| 15 | `rotating-drum` | FBD | ✓ | ✗ | ✗ | ✗ | ✓ | Its entire headline (centrifugal is an error here, required there) routes through `ghost_centrifugal`, which cannot fire because the regex tests fields that are never populated. Match on `kind === 'pseudo'` in an inertial frame instead — three lines. |

**The strongest, for contrast:** `two-blocks-in-contact` (FBD) is the only archetype that scores four of five — real authoring, a real grader, and the cut tool doing exactly what it was built for. `monkey-hunter`, `independence-of-components` and `cart-frame` (Projectile) and `cut-the-string` and `critical-speed` (Circular) are the others worth keeping unchanged.

---

## 5. Gaps in misconception coverage

Classic JEE/NEET errors that **no archetype currently attacks**, ordered by how much they cost students:

1. **"Tension is the same on both sides of a pulley."** The `pulley-with-mass` rung exists to break this and, as above, its derivation is never rendered and `Body.inertia` is carried in the contract but not solved. Today the sim *names equal tension as an assumption* and then never violates it. **The single biggest hole.**
2. **"Centripetal force is an extra force you add to the diagram."** Attacked by a picture (the frame toggle) and by nothing else. `ghost_centrifugal` is dead in FBD; Circular emits no codes at all. A student can draw an outward force, or add mv²/r as a fifth arrow, and no surface in the program will tell them off. This is the most persistent Class-11 misconception in existence and it is currently **unattacked by any grader**.
3. **"Static friction equals μN."** `friction_exceeds_max` exists but requires the `checkSizes` opt-in — and rung 1 actively teaches the opposite lesson (draw friction whenever the surface is rough). Static friction being a *range* is on the roadmap as Friction Bench; until then it is worse than uncovered, it is mis-covered.
4. **"In a lift your weight changes."** `lift-accelerating` is built for it and cannot switch frames.
5. **"Retardation means negative acceleration" / the sign of a vs the direction of v.** Belongs to Motion Graph Studio, not built. Currently no surface anywhere.
6. **The wedge constraint** (block on a wedge that can slide). `block-on-movable-wedge` exists in FBD but derives no constraint, and the Pulley ledger only walks ropes. The relationship between the block's and the wedge's accelerations — a JEE staple — is nowhere.
7. **"Banked road: friction always acts down the slope."** `BankedRoadView` never draws the friction deficit and never asks which way friction points. The v_min side of the band is where the sign flips, and the sim shows the same arrow either way.
8. **"On a rough incline the normal is mg cos θ, so friction is μmg cos θ, so it always slides."** Static-vs-kinetic on an incline is exactly what the `slidingSign` bug breaks.
9. **"Work done by tension / by the normal force is non-zero."** Out of scope until the Energy Ledger (Phase 2) — noted so it is not forgotten.
10. **"Two bodies connected by a string have the same acceleration magnitude, always."** True for a simple rope, false the moment a movable pulley appears — and `movable-pulley` shows the factor of 2 without ever asking the student to predict it wrong first.

**Covered well, and worth saying so:** heavier-falls-faster (`vacuum-vs-air`), horizontal velocity decays under gravity (`coupled_components`), v = 0 at the apex (`apex-anatomy`), 45° is always optimal (three projectile rungs), action–reaction drawn on one body (`third_law_pair_same_body`, narrowly), pseudo-force in an inertial frame, a ball leaving a circle radially (`cut-the-string`).

---

## 6. Where a student actually gets stuck

Ordered by how likely a real Class-11 student is to hit it in the first two minutes.

1. **Circular Arena: the ball is already spinning when the page loads.** Everything the guided script is about to reveal is pre-empted, and the student's first instinct — that this is a video — is confirmed.
2. **FBD Studio: the guide's CTA buttons look like navigation and do nothing.** `GuidePanel` renders a full-width uppercase accent button visually identical to the ones that *do* act ("Cancel pair 1 of 3 →", "Take it to the algebra →"). CTAs reading **"Draw the diagram →"**, **"Cut the system →"** just swap the paragraph above them. Every one of the ten FBD archetypes has two or three of these.
3. **Pulley Lab: the ledger term chips have zero affordance.** They are `<button>`s with a transparent border and transparent background. Hovering one dims every rope segment that is not its own — **the single most important interaction in the sim — and nothing on screen suggests it exists.**
4. **FBD Studio: a silent, unexplained dead end.** With `checkSizes` on, every drawable magnitude is boxed to [0.32 mg, 1.77 mg] by the drag clamps. A 15° incline needs friction at 0.259 mg — **undrawable**. The diagnostic repeats "you drew 9.1 N" forever with no hint that the drag has a floor.
5. **Circular Arena: `banked` and `instruments` short-circuit the entire canvas block**, so the guided panel, the predict gate, the ExpertTip and the authored numeric question all disappear when the student clicks those tabs, with nothing saying they exist elsewhere.
6. **Circular Arena: the whole SVG is the drag target.** Clicking the background teleports the ball. Nothing indicates the ball is the handle, and dragging silently sets `playing = false` — the only feedback is a button label flipping.
7. **Pulley Lab: moving any slider silently wipes the drag.** The measurement table snaps back to "—" with no explanation.
8. **Pulley Lab: the predict gate leaks its own answer.** It blocks the solve reveal but the constraint ledger renders one stage earlier — and the constraint largely answers "faster or slower".
9. **FBD Studio: the agent question has no escape.** `pending` replaces the palette entirely; the only exits are picking an agent or "Nothing — it is just moving", which is the honest answer the copy praises and is graded as an error.
10. **Projectile: fixed in this pass** — a phone student met a disabled ▶ Fire before the CTA that enables it. See §2.2.
11. **Everywhere: `StepBar` is back-only.** It fires `onGo` only for completed steps, so the chips look clickable going forward and are inert. Nothing says so.

---

## 7. Impressive-looking, teaches nothing — the honest list

1. **`InstrumentsView.tsx`** (Circular, 422 lines, five machines). The largest inert surface in the program. Sliders, hand-drawn SVG, hardcoded specific-looking numbers, and a paragraph per machine that gives away the discovery.
2. **`applicationPoint`** (FBD). Nine snap candidates, a dedicated second drag handle, rendered dots, and a doc comment arguing the choice is itself worth teaching — never read by the grader.
3. **`ghost_centrifugal` and `force_agent_unnamed`** (FBD). Two of the best-written diagnostics in the codebase, both unreachable; one of them displaced by the very code it was written to avoid.
4. **"Written out"** (Pulley). Looks like a derivation, is a dump of solver matrix rows in solver order with three-decimal coefficients and unknowns the student has never met.
5. **The Cut stage on any single-body archetype** (FBD). Full boundary-drag machinery, dimming, bold external arrows, a composite-mass card — and nothing cancels, nothing is learned, and the summary paragraph does not even render. The QA harness enables Cut on all ten archetypes including the two where it is degenerate.
6. **Pulley acceleration arrows.** An affine length map with a 14 px offset and a hard cap that makes a 2× acceleration look like 1.33× and saturates entirely above a ≈ 6.3. Worse than no arrow, because it invites a comparison it cannot support.
7. **`BankedRoadView`'s friction arrow.** Drawn at the cap in exactly the state where the lesson is that the cap has been exceeded.
8. **`releaseEnvelope` / `HandoffEnvelope`** (Circular). The documented cross-engine handoff contract — design law #4 made explicit — is dead code; nothing imports it. The actual handoff works, but through a direct `integrate` call, so the contract that was supposed to make the *next* three engines compose has never been exercised.
9. **The Real World tab** (Pulley). Five hardcoded machines, one multiplier slider, and the best argument in the file (work is unchanged) delivered as a printed sentence.
10. **The bank-angle arc** (Circular). Drawn, never labelled, never measured.

---

## 8. What this adds up to

Two of the five design laws are in decent shape across the program. **Law 3 (the invisible middle step) is genuinely delivered** in four places — the projectile split-screen, the pulley segment↔term binding, the FBD cut tool, and the circular tangential release — and each of those four is worth the whole build on its own. **Law 5 (guided, never auto-playing)** is honoured everywhere except Circular Arena, where it is broken twice.

The other three are where the "fancy diagram" charge lands:

- **Law 1 (the student authors the scene)** is real in exactly one sim, and that sim disables it whenever a graded answer is attached.
- **Law 2 (grades reasoning, names a misconception)** is real in exactly one sim, and four of its twenty codes cannot fire while several others fire from defaults rather than beliefs. In the other three sims the total number of named misconceptions a student can be shown is: **seven** (projectile, five of which are time-gated rather than error-gated), **zero** (pulley), **zero** (circular) — despite twenty-two `targets` codes sitting in the archetype data.
- **Law 4 (composes)** is visible to a student in exactly one place, and its declared contract is unused.

**The single highest-leverage fix is not new physics — it is wiring.** `lib/grade.ts` already exists, `targets` codes already exist on 27 archetypes, and `ProjectilePlayground.tsx` already contains the pattern for turning a `targets` code into an evidence-gated card. Pulley Lab and Circular Arena consume neither. Making those two read `targets` the way projectile does, and gating the reveals on a prediction, would move roughly twenty archetypes from "moving diagram" to "attacks a named misconception" without touching a single equation.

**Recommended order:**
1. Circular Arena: stop auto-playing; gate the auto-release; wire `targets` → misconception cards; per-option feedback on the cut prediction. *(Biggest gap between what it claims and what it does.)*
2. Pulley Lab: render `solve.constraints` so `pulley-with-mass` shows T₁ ≠ T₂; wire `grade.ts`; fix `slidingSign` so friction works. *(Best engine, thinnest teaching layer.)*
3. FBD Studio: let the student pick the isolated body; add the frame toggle; fix `single-body-ground`'s μ; make `ghost_centrifugal` reachable. *(Four small fixes unlock four archetypes that currently instruct impossible actions.)*
4. Projectile: fix the two dead cards and the two premature ones; retire or merge the four duplicated fan rungs.
5. Only then: browser QA on real devices, which is still the gate before any of this goes on a page.

---

## Changelog

- **2026-07-29** — Created. Projectile Playground UI fixes landed (measured-container responsiveness, aspect-matched canvas, compressing strips, size-aware marks, unconditional launch arrow, guided panel hoisted when stacked): canvas area fill 34% → 47% desktop and 8.8% → 34% on a phone, with the drawing 1.75× wider. `tsc` clean, `lint:sims` 0 errors, `verify-motion-lab.mjs` 53/53 — no physics changed. Full pedagogy audit of all 46 archetypes against the §2 design laws.
