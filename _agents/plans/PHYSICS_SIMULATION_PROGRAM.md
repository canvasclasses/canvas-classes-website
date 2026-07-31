# Physics Simulation Program — the Interactive Physics Engine Layer

**Status:** 🟡 Plan drafted 2026-07-29, awaiting founder approval of the build order.

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Scope:** every interactive simulation across Class 11 + Class 12 Physics (Live Books + hubs), built as a small number of reusable **engines** rather than a large number of one-off sims.
- **Governing docs:** [`SIMULATION_DESIGN_WORKFLOW.md`](../workflows/SIMULATION_DESIGN_WORKFLOW.md) (colour/typography/chrome — wins on any conflict), [`BOOK_PAGE_WORKFLOW.md`](../workflows/BOOK_PAGE_WORKFLOW.md) §4E, [`PHYSICS_LIVEBOOK_PLAN.md`](PHYSICS_LIVEBOOK_PLAN.md) (the book this feeds).
- **Next action:** founder picks the Phase-1 build order (§8), then E1 `mechanics-bench` starts.
- **Blocked on:** founder approval only. No external dependency — `planck@1.5.0` and `jsxgraph@1.12.2` are already in `packages/book-renderer/package.json`.

---

## 1. Where physics stands today (check-in)

| Thing | State |
|---|---|
| **Class 11 Physics Live Book** (`class11-physics`) | Ch.0 "Mathematics in Physics" **built end-to-end, 35 pages**, 0/35 published. Ch.1 "Units and Dimensions" has a 19-page plan ([`PHYSICS_CH1_UNITS_AND_DIMENSIONS_PLAN.md`](PHYSICS_CH1_UNITS_AND_DIMENSIONS_PLAN.md)), not built. Ch.2 onward: not planned. |
| **Class 12 Physics Live Book** | Does not exist yet. |
| **Simulation inventory** | 123 sim files in `packages/book-renderer/blocks/simulations/`. Physics ones are almost all **Class 9 level**: `PulleySystemSim` (540 LOC — fixed/movable/compound MA demo), `CircularMotionSim` (331 LOC — a ball with two arrows), `InclinedPlaneSim`, `ForceBalanceSim`, `FrictionExplorerSim`, `NewtonsSecondLawSim`, `MechanicalAdvantageSim`, `MarbleInRingSim`. |
| **Nothing exists for** | Projectile motion. Optics of any kind. Circuits / resistance networks. Fields. Rotation. Fluids. |
| **The two flagship engines that DO work** | **Vector Lab** (`blocks/simulations/vector-lab/`, 3 684 LOC, 13 phases, planck.js-backed) and **`vector_board`** (697 + 856 LOC, 9 archetypes) + **`math_graph`** (JSXGraph, 14 archetypes). |

**The strategic read.** The existing physics sims are exactly what you said you *don't* want: animated textbook figures. But the `vector_board` / `math_graph` pattern is exactly what you *do* want, and it already works. This plan applies that pattern to the rest of physics.

---

## 2. The design law — what separates a simulation from a moving diagram

Every sim in this program must pass all five. If it fails any one, it is a diagram and does not get built.

1. **The student is the author, not the audience.** They set the scene (angle, masses, how many pulleys, which lens) before anything happens. If the only interaction is a slider on a scene we chose, it fails.
2. **It grades reasoning, not just outcome.** The sim must be able to say *"you drew a forward force on this block — name the object pushing it"*, not just "wrong". Every wrong answer maps to a **named misconception**, and the feedback attacks that specific misconception.
3. **It shows the invisible middle step.** The thing textbooks skip. For pulleys that is the **constraint equation** and where it comes from. For FBDs it is **the system boundary**. For circuits it is the **topological redraw**. For circular motion it is the **frame change**. This is where the actual learning is.
4. **It composes into a system.** The ball that leaves the vertical circle becomes a projectile — handed to the projectile engine, same physics, no reset. A lens plus an aperture plus a sensor becomes a camera; add a second lens and it is a telescope. Concepts must be shown *connecting*, which is only possible if the engines are shared.
5. **It is guided, never auto-playing.** Per the `vector_board` convention already established: the panel states what is about to happen and why, the student clicks, one thing appears. Nothing is on screen before it has been explained; no number is revealed before the student has been shown where it comes from.

---

## 3. Architecture — five engines, and every exercise is DATA

The mistake to avoid is 40 bespoke `.tsx` files. The proven pattern in this repo (`math_graph`, `vector_board`) is:

> **The engine ships once as code. Every individual exercise on every page is a block of JSON.** Extending what the engine *can* do = code. Building an exercise = data, authorable by faculty in the admin books-editor with no developer.

That is the whole architecture. Five engines cover all of Class 11 + 12 physics.

| # | Engine | Block type | Core | Powers |
|---|---|---|---|---|
| **E1** | **`mechanics-bench`** | `mechanics_bench` | Rigid bodies + contacts + string/rod constraints + an **FBD grader** + a linear solver for ΣF=ma with constraint equations | FBD Studio, Pulley Lab, inclines, connected bodies, friction, wedges, non-inertial frames, rotation (Phase 3), collisions |
| **E2** | **`motion-lab`** | `motion_lab` | 2-D kinematics integrator + synchronized trajectory / component / graph strips + frame transforms | Projectile, circular motion, relative motion, 1-D kinematics graphs, SHM, orbits |
| **E3** | **`circuit-bench`** | `circuit_bench` | Netlist + nodal analysis (DC → RC → AC phasors) + **topological auto-redraw** | Series/parallel, resistance networks, Wheatstone, meters, capacitors, EMI, AC |
| **E4** | **`optics-bench`** | `optics_bench` | Real ray tracer (not paraxial-only) over a bench of surfaces | Mirrors, lenses, refraction, TIR, **camera / eye / microscope / telescope / binoculars**, wave optics overlay |
| **E5** | **`field-bench`** | `field_bench` | Scalar/vector field sampler + test-charge tracer + flux surfaces | Electrostatics, Gauss, potential, magnetism, gravitation, EM waves |

Each engine gets its own `archetypes.ts` — a library of pure, side-effect-free construction functions, exactly like `blocks/vector-board/archetypes.ts`. Pure means the physics is verifiable by a plain node script with no React, which is how we keep academic accuracy honest.

**Wiring cost per new block type is fixed and known (5 points):** `packages/data/types/books.ts` (interface **and the `BlockType` union — the one that gets missed**), `packages/data/books/schemas.ts` (Zod **and its union**), `BlockRenderer.tsx` dispatch, the renderer file itself, and the admin editor (`AddBlockMenu.tsx` + `BlockCard.tsx` + a `*Editor.tsx`).

### Cross-engine handoff (design law #4)

Engines share one coordinate/unit convention (SI, x right, y up, angles CCW from +x — inherited from `vector-lab/lib/vectorMath.ts`) and one **state handoff envelope** `{ bodies, velocities, forces, t }`. That makes these possible, and they are the moments students remember:

- Vertical circle → string goes slack → **the same ball continues in `motion-lab` as a projectile**.
- Block slides off the incline in `mechanics-bench` → becomes a projectile.
- Charge released in `field-bench` → its trajectory is integrated by `motion-lab`.
- Light through a lens in `optics-bench` → the ray diagram *is* a `field-bench` wavefront when you toggle to wave view.

---

## 4. The full physics catalogue

Ranked by teaching value. **Flagship** = built to the depth of Vector Lab. **Standard** = an archetype of an existing engine, mostly data.

### Unit 1 — Kinematics (Ch.2, 3)

| Sim | Engine | Tier | The invisible step it exposes |
|---|---|---|---|
| **Projectile Playground** | E2 | 🚩 Flagship | x and y are two *independent* 1-D movies playing side by side |
| Motion Graph Studio (x-t / v-t / a-t triple-linked, drag one, others rebuild) | E2 | Standard | Slope ↔ area duality; the sign of *a* vs direction of *v* |
| Relative Motion Deck (river-crossing, rain-man, two-train) | E2 | Standard | Velocity is frame-dependent; the "subtract the frame" move |
| Monkey & Hunter | E2 | Standard | Both fall at the same rate → aim directly at it |

### Unit 2 — Laws of Motion (Ch.4) — **the heart of this program**

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| **FBD Studio** | E1 | 🚩🚩 Flagship of flagships | The **system boundary**: what becomes internal when you cut |
| **Pulley Lab** | E1 | 🚩 Flagship | The **constraint equation** and where it comes from |
| Friction Bench (static→kinetic transition, tipping vs sliding) | E1 | Standard | Static friction is a *range*, not a value |
| Non-Inertial Frame Room (lift, accelerating car, rotating drum) | E1 | Standard | Pseudo-force appears *only* when you change frames |
| Circular Motion Arena | E2 + E1 | 🚩 Flagship | Centripetal is a *requirement*, not a new force |

### Unit 3 — Work, Energy, Power (Ch.5)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Energy Ledger (a live stacked bar of KE/PE/heat as a body moves any track the student draws) | E1 | 🚩 Flagship | Friction doesn't "lose" energy — watch the heat bar grow by exactly the shortfall |
| Roller-Coaster Designer (draw the track, find where it fails) | E1 | Standard | Loop-top needs $v^2 \ge gr$; ties straight into Circular Arena |
| Collision Studio (1-D + 2-D, restitution slider, CoM frame toggle) | E1 | 🚩 Flagship | In the **CoM frame** every collision is symmetric — the trick that makes 2-D collisions easy |
| Spring Bench (work = area under F-x) | E1 | Standard | Non-constant force → integrate, not multiply |

### Unit 4 — Rotation (Ch.6)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Torque & Balance Bench (drag masses on a beam, add pivots) | E1 | Standard | Torque = force × *perpendicular* distance |
| Moment-of-Inertia Racer (race hoop/disc/sphere/hollow down an incline) | E1 | 🚩 Flagship | Mass distribution, not mass, decides who wins |
| Rolling vs Sliding (contact-point velocity vector rendered live) | E1 | Standard | At the contact point of pure rolling, $v = 0$ |
| Angular Momentum Chair (pull arms in, watch $\omega$ jump) | E1 | Standard | $L$ conserved, $KE$ is *not* — where did the extra energy come from? |

### Unit 5 — Gravitation (Ch.7)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Orbit Sandbox (drag a launch velocity → circle/ellipse/escape/crash) | E5 + E2 | 🚩 Flagship | An orbit is just a projectile that keeps missing |
| g-Explorer (dig into the Earth / rise above it, live $g(r)$ plot) | E5 | Standard | $g$ *rises* then falls — the inside-the-shell result |
| Kepler Sweeper (equal areas in equal times, drawn live) | E2 | Standard | Areal velocity = angular momentum in disguise |

### Unit 6 — Properties of Matter, Fluids (Ch.8, 9)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Stress-Strain Rig (pull a wire to failure, live curve) | E1 | Standard | Elastic limit ≠ breaking point |
| Fluid Bench (pipe with draggable cross-sections, Bernoulli ledger) | E2 | 🚩 Flagship | Pressure drops where speed rises — the counter-intuitive one |
| Float / Sink Lab (drag an object into fluids, live buoyancy vs weight) | E1 | Standard | Buoyancy depends on *displaced volume*, not object mass |
| Viscosity & Terminal Velocity | E1 | Standard | Terminal velocity = the moment the FBD balances |

### Unit 7 — Thermal & Kinetic Theory, Thermodynamics (Ch.10–12)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| PV-Diagram Workbench (drag a process on the PV plane; work = shaded area computed live; cycle → net work) | E2 | 🚩 Flagship | Work is **path-dependent**; internal energy is not |
| Molecular Chamber (existing `MaxwellBoltzmannSim` upgraded — piston, heat, live distribution) | E2 | Standard | Temperature *is* mean KE |
| Heat Engine Bench (assemble Carnot / Otto / fridge from strokes) | E2 | Standard | Why efficiency can't reach 1 |
| Calorimetry Mixer | — | Standard | Latent heat is the flat part of the curve |

### Unit 8 — Oscillations & Waves (Ch.13, 14)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| SHM Bench (spring/pendulum + the **circle-of-reference projection** side by side) | E2 | 🚩 Flagship | SHM is the *shadow* of uniform circular motion |
| Wave Studio (superposition, beats, standing waves, string harmonics) | E2 | 🚩 Flagship | A standing wave is two travelling waves, made visible by splitting them apart |
| Doppler Bench (drag source and observer independently) | E2 | Standard | Source-moving ≠ observer-moving (different formulas, same effect) |
| Resonance Rig (drive frequency sweep, amplitude response curve) | E2 | Standard | Damping decides the peak height |

### Unit 9 — Electrostatics & Capacitance (Ch.1, 2 of Class 12)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Field Sculptor (place charges, live field lines + equipotentials + a draggable test charge that actually moves) | E5 | 🚩 Flagship | Field lines are perpendicular to equipotentials — always, everywhere |
| Gauss Surface Lab (draw a closed surface anywhere, flux computed live) | E5 | 🚩 Flagship | Flux depends **only** on enclosed charge — drag the surface, watch it not change |
| Capacitor Workbench (plates, dielectric slide-in, live Q/V/E/U ledger) | E5 + E3 | Standard | What stays constant: battery-connected vs isolated |

### Unit 10 — Current Electricity (Ch.3) — **your explicit ask**

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| **Circuit Bench + Topological Redraw** | E3 | 🚩🚩 Flagship | The messy circuit **morphs** into its canonical series/parallel form, node by node |
| Meter Lab (ammeter/voltmeter with real resistance → measurement error) | E3 | Standard | The meter changes the circuit it measures |
| Wheatstone & Potentiometer Bench | E3 | Standard | Balance = zero current, which is why it beats a voltmeter |
| Drift Velocity Chamber (electrons crawl, signal races) | E3 | Standard | Drift is mm/s; the *field* propagates at ~c |

### Unit 11 — Magnetism & EMI (Ch.4–6)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Magnetic Force Playground (charge in **B**, in **E**, in both — cyclotron, velocity selector) | E5 + E2 | 🚩 Flagship | $q\vec v \times \vec B$ does zero work — speed never changes, only direction |
| Flux Machine (drag a loop through a field; flux, EMI, induced-current direction live) | E5 + E3 | 🚩 Flagship | Lenz's law as *opposition to change*, seen as a retarding force you can feel in the drag |
| Transformer / AC Bench (phasor diagram beside the waveform) | E3 | Standard | Phase lag is a rotation, not an accident |
| Solenoid & Toroid Builder | E5 | Standard | Superposition of loops → uniform interior |

### Unit 12 — Optics (Ch.9, 10) — **your explicit ask**

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| **Optical Bench** (drag mirrors/lenses/objects, real ray tracing, live image) | E4 | 🚩 Flagship | Sign convention as a *consequence* of geometry, not a rule to memorise |
| **Instrument Assembler** | E4 | 🚩🚩 Flagship | **Camera / eye / microscope / telescope / binoculars are all the same three primitives rearranged** |
| Refraction & TIR Bench (drag the incidence angle past critical; optical fibre) | E4 | Standard | Why the fibre bends light around corners |
| YDSE / Diffraction Bench (slit width, separation, λ — live fringe pattern) | E4 | 🚩 Flagship | Path difference is the *only* variable that matters |
| Polarisation Bench (two/three polarisers, Malus law live) | E4 | Standard | The third polariser that *increases* transmission |

### Unit 13 — Modern Physics (Ch.11–14)

| Sim | Engine | Tier | The invisible step |
|---|---|---|---|
| Photoelectric Bench (intensity vs frequency, stopping potential, live I-V) | E5 | 🚩 Flagship | Intensity changes current; frequency changes *energy*. The two knobs do different things |
| Existing `bohr-spectra`, `de-broglie-wavelength`, `heisenberg-uncertainty` | — | ✅ Built | Already at flagship depth (Chemistry Ch.2) — reuse in Physics Ch.12 |
| Nuclear Bench (binding energy per nucleon curve, fission/fusion on the same axis) | — | Standard | Both release energy because both move *toward* the peak |
| Semiconductor Bench (doping, junction, biasing, live band diagram) | E3 | Standard | The depletion region as a self-built barrier |

**Totals: ~48 simulations, of which ~19 flagship — delivered by 5 engines.**

---

## 5. Mechanics deep design — the four you named

### 5.1 FBD Studio (E1) — "build your own problem"

This is the one you described, and it is the highest-value build in the entire program.

**Compose.** A scene composer with a palette: bodies (block / sphere / rod / wedge), surfaces (ground / **wedge with a draggable angle** / wall / ceiling), connectors (string / spring / rigid rod / pulley), and properties per body (mass, μₛ, μₖ). The student builds the scene. *They* choose the geometry, so it's their problem, not ours.

**Draw.** The student picks one body — it lifts out of the scene into an isolation panel — and drags force arrows onto it from a labelled palette: Weight, Normal, Friction, Tension, Applied, Spring. Each arrow has a draggable direction and magnitude, and must be **attached to a point** on the body.

**Grade.** The engine derives ground truth from the scene graph, then diffs:

| Error class | What the student did | What the sim says |
|---|---|---|
| **Missing force** | No normal on an inclined block | "This block is touching the wedge. Every contact pushes. What's missing?" |
| **Ghost force** | Drew a forward "force of motion" | "Name the object applying this force. Nothing is in contact there — this force does not exist. Motion doesn't need a force to continue." |
| **Third-law pair on one body** | Drew both $N$ and its reaction on the block | "These two are an action–reaction pair. They act on **different bodies**. Move one to the wedge." |
| **Wrong direction** | Normal drawn vertical on an incline | "Normal is ⟂ to the *surface*, not to the ground. The surface is tilted 30°." |
| **Centrifugal in a ground frame** | Outward force on a body in a circle | "You're in the ground frame. Switch to the rotating frame first, or delete this." |
| **Friction sign** | Friction along the motion | "Friction opposes *relative sliding at the contact*. Which way is this surface sliding?" |
| **Over-large static friction** | $f > \mu_s N$ | "Static friction is a *range*, capped at $\mu_s N = $ 12 N. You drew 18 N." |

**The cut tool — the killer feature.** The student drags a dotted boundary around any subset of bodies. Forces crossing the boundary stay (external, drawn bold); forces entirely inside it grey out and vanish (internal, cancel in pairs). *This is the single idea that turns two-body problems from memorised cases into a method*, and no textbook can show it because it's an animation.

**Solve.** With a correct FBD, the student picks the axis orientation (along-incline vs horizontal-vertical) — and the algebra panel **rewrites itself live** to show why one choice is 3 lines and the other is 8. Then ΣF = ma per axis, solve for the unknown, answer-checked.

**Ladder (each rung = one archetype = data):** single body on ground → on an incline → with friction → applied force at an angle → two stacked blocks → two blocks in contact being pushed → string over a pulley → block on a wedge that itself can slide → lift/accelerating frame → the wedge constraint.

### 5.2 Pulley Lab (E1) — "keep adding complexity"

**Not hardcoded cases.** The system is a graph: pulleys (fixed / movable, massless or with moment of inertia $I$), strings (inextensible, with node endpoints), bodies (mass, hanging or on a surface with μ). From string-length invariance the engine **derives the constraint equations automatically** and then solves the resulting linear system for every acceleration and tension simultaneously.

**Show the derivation, not just the answer.** A ledger panel prints the derived constraint — e.g. $a_1 + a_2 = 2a_3$ — with **each string segment colour-matched to its term**. Drag a block down 1 cm and watch which segments lengthen, which shorten, and the total stay constant. Students cannot write constraint equations; this is why.

**Ladder:** single fixed pulley (MA = 1, direction only) → Atwood → block on table + hanging mass → incline + hanging mass → **movable pulley** (the $a_1 = 2a_2$ moment) → block-and-tackle (n segments) → pulley **with mass** ($T_1 \ne T_2$, the first time tension differs across a pulley) → double Atwood → pulley on an accelerating support.

**Predict-observe-explain gate** at each rung: "You added a movable pulley. Does the block accelerate faster, slower, or the same?" — answer locked in before the sim runs.

**Real-world tab:** lift counterweight, tower crane, gym cable stack, mountaineering haul system, well pulley — each with its actual MA and the trade-off (force ÷ n, distance × n, **work unchanged**).

### 5.3 Projectile Playground (E2)

- **Split-screen decomposition** — the trajectory in the middle, and *two independent 1-D movies* on the sides: horizontal (constant velocity) and vertical (free fall), playing in lockstep with the main view. This is the concept, and it is invisible in every textbook figure.
- **Frame toggle** — ground frame vs a moving-cart frame. Ball dropped from a moving trolley: a parabola in one, a straight line down in the other. Same event, two truths.
- **Projectile on an incline** (JEE staple) with an axis-rotation toggle so the student sees the rotated-axis method make it a 1-line problem.
- **Envelope of safety** — sweep the launch angle at fixed speed and the reachable region traces out its bounding parabola. A genuinely beautiful systems reveal.
- **Monkey & Hunter**, **relative projectile** (two objects launched at each other).
- **Real vs ideal** — an air-drag toggle showing the trajectory going asymmetric, and then the payoff: *why the optimum shot-put angle is ~42°, not 45°* (release height + drag). Sport, not abstraction.
- Target-challenge mode with scoring.

### 5.4 Circular Motion Arena (E2 + E1)

The current 331-line sim is a ball with two arrows. Replace it with:

- **Frame toggle**, front and centre. Ground frame: *no outward force exists*. Rotating frame: a "⚠ You are now in a non-inertial frame" banner appears and *then* centrifugal is drawn. This single interaction kills the most persistent misconception in Class 11.
- **Cut the string** — the ball departs **tangentially** with a trail, and is handed to the projectile engine mid-flight. Students overwhelmingly predict radially outward; letting them predict, then watching, is worth ten pages of text.
- **Vertical circle** — live tension-vs-angle plot; slow it down until the string goes slack at the top; find $v_{\min} = \sqrt{gr}$ empirically before it's ever derived.
- **Banked road** — drag the bank angle and μ; the sim solves $v_{\min}$ and $v_{\max}$ and shades the safe band. Framed on a real Indian highway curve.
- **Non-uniform circular motion** — tangential and radial acceleration drawn as separate arrows that sum to the total.
- **Instrument tab:** conical pendulum, rotor / well-of-death, car over a bridge crest ($N = 0$ → airborne), spin dryer, centrifuge.

---

## 6. Optics — the "how systems are built" arc you asked for

The **Instrument Assembler** deserves calling out because it is the clearest expression of your brief.

The student starts with a bare converging lens on an optical bench and an object. Then:

1. Add an **aperture** → brightness and depth-of-field change → it's a pinhole/aperture.
2. Put a **sensor at the focal plane** → **it's a camera.** Change the focal length → zoom. Move the sensor → focus.
3. Swap the sensor for a **retina and add a variable-focal-length lens** → **it's an eye.** Now make the eyeball too long → myopia → add a diverging lens → *the student has just invented spectacles.*
4. Add a **second lens** so the first lens's image is the second's object → **it's a compound microscope.** Magnification multiplies — shown as the ray bundle literally passing through.
5. Make the first lens long-focal and large → **it's a telescope.** The image is inverted.
6. Insert **two prisms** → the image erects *and* the light path folds so the tube shortens → **it's a binocular.** Now the student knows why binoculars are fat and short instead of long tubes.

Same three primitives — lens, aperture, screen — six instruments. That is "concepts connecting to build systems", made literal.

---

## 7. Current electricity — the redraw engine

Students can't do resistance networks because they can't *see* the topology through the drawing. `circuit-bench` fixes this directly:

- Drag resistors onto a canvas and wire them however you like — including deliberately ugly, exam-style layouts.
- Press **Redraw** and the circuit **animates** into canonical form: nodes are colour-coded by potential, wires at equal potential collapse together, and the tangle reorganises into clean series/parallel groups. Watching a Wheatstone bridge unfold into two parallel branches is a thirty-second fix for a topic students lose weeks to.
- **Node-potential heatmap**, current rendered as flow with **width ∝ magnitude**, so a 0-current branch visibly stops.
- **Fold/unfold ladder:** the sim can also *collapse* a group and show the equivalent resistance replacing it step by step — the reverse operation, which is how you actually solve them.
- Infinite ladder networks, symmetry/Wheatstone shortcuts, meter loading, potentiometer.

---

## 8. Build order

**Phase 1 — E1 `mechanics-bench` + the four you named.** (This session onward.)
1. `mechanics-bench` core: scene graph, contact/constraint derivation, linear solver, `archetypes.ts`. Pure, node-testable.
2. **FBD Studio** on top of it — composer, isolation panel, grader with the misconception table, cut tool, solve mode.
3. **Pulley Lab** — constraint derivation ledger + the rung ladder.
4. `motion-lab` core + **Projectile Playground**.
5. **Circular Motion Arena**, including the handoff to projectile.
6. Block-type wiring (5 points) + admin editors so exercises become data.

**Phase 2 — the rest of mechanics.** Energy Ledger, Collision Studio, MoI Racer, Torque Bench, Orbit Sandbox. Mostly archetypes on E1/E2 — cheap once Phase 1 lands.

**Phase 3 — E3 `circuit-bench`** (your current-electricity ask) + E4 `optics-bench` and the Instrument Assembler (your optics ask). These two unlock all of Class 12's hardest chapters.

**Phase 4 — E5 `field-bench`**, waves/thermo archetypes, modern physics.

**Phase 5 — the payoff layer.** *Problem Forge*: the student composes a scene, and the sim **generates a written exam-style question from it**, they solve it symbolically, and it's checked. Plus Crucible integration — a wrong answer on a Newton's-laws question deep-links to the exact FBD Studio archetype that repairs the misconception.

---

## 9. Invariants and risks

- **Design workflow wins.** `SIMULATION_DESIGN_WORKFLOW.md` is canonical for colour, typography, and chrome. Compose `SimShell` / `SimHeader` / `StepBar` / `SimTabs` / `SimSlider` / `NavButtons` from `_shared`; never hand-roll. `npm run lint:sims` and the pre-push hook enforce the two-colour rule.
- **Label overlap is a recurring bug class** (workflow §4E). One text element on the canvas; everything else in a colour-keyed legend below. Run the programmatic DOM overlap check before declaring done.
- **Physics must be verifiable outside React.** All engine maths lives in pure `lib/*.ts` modules with node test scripts, exactly like `vectorMath.ts`. No academic claim ships unverified.
- **Browser QA finds what tsc cannot.** The Ch.0 build found 8 defects that types and Zod could not catch (drag gated on an animation clock; a `height:100%` SVG resized by its sidebar; a memo keyed on block identity, which the autosaving editor recreates). Every flagship gets a real browser pass.
- **The `BlockType` union is the wiring point that gets missed.** Check it explicitly.
- **Null trap:** never write `null` into a block field from a raw script — blocks are Mixed-stored but Zod-validated with `.optional()`, which rejects null.
- **Scope risk:** five engines is a large surface. Mitigated by the fact that engines 1 and 2 alone cover all of mechanics, which is where the pain is, and by the exercises-as-data model — the marginal cost of sim #30 is a JSON block, not a component.

---

## 10. Phase 1 build record (2026-07-29)

Built in one session by six parallel agents against contracts frozen up front. **~15 000 lines**, `tsc` clean across student + admin + book-renderer, `lint:sims` 0 errors.

| Piece | State |
|---|---|
| **E1 `mechanics-bench`** (29 files, 8 760 lines) | scene graph → ground-truth forces → constraint derivation → one simultaneous linear solve → FBD grading → cut tool. `verify-mechanics-bench.mjs` **114/114**. |
| **FBD Studio** | 5 stages (compose / draw / grade / cut / solve), **10 archetypes**, all 19 misconception codes reachable. |
| **Pulley Lab** | **9 rungs**, constraint ledger with segment↔term binding, real-world tab. |
| **E2 `motion-lab`** (19 files, 6 225 lines) | RK4 integrator + frame transforms + closed-form projectile. `verify-motion-lab.mjs` **53/53**. |
| **Projectile Playground** | **14 archetypes**, one-SVG synchronized strips, drag, envelope, monkey-and-hunter. |
| **Circular Arena** | **13 archetypes**, frame toggle, tangential-release handoff into the projectile integrator. `check-circular.ts` all pass. |
| **Wiring** | 2 renderers, `BlockRenderer` dispatch, export subpaths, `AddBlockMenu` + `BlockCard`, 2 admin editors that generate inputs from archetype `params` metadata. |

**46 archetypes total** — every one authorable as a JSON block with no code change.

### What the verification layer actually caught

This is the argument for the "physics must be verifiable outside React" rule, and it should not be forgotten:

- A **bridge crest** evaluated from the wrong energy reference read 9 800 N instead of 4 800 N.
- At **exactly** critical speed, float error made tension −4×10⁻¹⁶ and the sim declared the string slack — contradicting the equation the student had just derived on screen.
- Treating a pulley as a **point rather than a circle** degraded the Atwood constraint to `0.93a₁ + 0.93a₂ = 0` and turned the movable-pulley factor of 2 into 1.87, which would have made the constraint ledger — the whole point of Pulley Lab — display nonsense.
- Two blocks **stacked and riding along by static friction** solved to `{mB: 2.742, mA: 0}` with `singular: false`. A wrong number delivered confidently. Fixed by deriving ride-along coupling and making `solveScene` an assumption-then-test fixed point.
- A `fixed: true` body with a rough ground contact injected phantom unknowns, turning a plain frictionless incline into `singular: true, a = 0`.
- The projectile agent's own hand-computed reference values were wrong twice (flight time 2.886751 → 2.886150); its verifier caught them.

**Four of these six were found by an agent building UI against an engine it did not write.** Parallel construction was not just faster — the independent consumer exercised paths the engine's author never hit.

### The misconception codes have no analytics sink yet (recorded 2026-07-30)

Several engines justify getting a `MisconceptionCode` exactly right by appeal to
"the analytics on what students actually get wrong" — `mechanics-bench/types.ts`,
`lib/grade.ts`, `archetypes.pulley.ts`, `motion-lab/waves/types.ts`. A check of
the tree confirms **that consumer does not exist**: `packages/core/analytics/`
has Mixpanel wired, but **no simulation emits any event, and no fired
misconception code reaches any sink.**

This does not make the accuracy discipline wrong — a mislabelled code still
puts the wrong sentence on a student's screen, which is reason enough, and it
was the right call for two agents to surface missing codes rather than
force-fit. But the *stated* rationale is currently aspirational, and it should
be read that way until a sink lands. Two honest options when it does:

1. emit `{ archetype, targets, fired_at_stage }` from the one place each engine
   renders a diagnostic card, or
2. drop the analytics justification from the comments and defend code accuracy
   purely on the copy it drives.

Either is fine. Silently leaving five files citing a consumer that was never
built is not.

### Known gaps

- **No browser QA.** Agents are barred from starting a dev server (§5.2), so nothing here is runtime-verified. The Ch.0 build found 8 defects that types and Zod could not catch. **This is the gate before any of it goes on a page.**
- `math_graph` and `vector_board` are in the admin Add-block menu but have no `defaultBlock()` case, so both throw when clicked. Pre-existing, task-chipped.
- `lib/svg.ts` has one consumer (FBD Studio); Pulley Lab uses bespoke local helpers.
- The `root-bg` lint rule fires on sim **sub**-components where it does not apply — 18 warnings, 0 errors. Worth teaching the rule about roots vs children.

## Changelog

- **2026-07-29** — Plan created. Grounded in an inventory pass of the 123 existing sims, the `vector_board` / `math_graph` engine-plus-archetypes precedent, and the Class-11 Physics Live Book state (Ch.0 built, Ch.1 planned).
- **2026-07-29 (later)** — **Phase 1 built** — E1 + E2 engines, all four named simulations, 46 archetypes, full block/admin wiring. See §10. Six parallel agents against frozen contracts; six real physics bugs caught by the node verification layer, four of them by an agent consuming an engine it did not write. Remaining before use: founder browser QA, and the massive-sheave torque equation (`Body.inertia` is carried in the contract but not yet solved, so `pulley-with-mass` currently names equal tension as an assumption rather than showing T₁ ≠ T₂).
