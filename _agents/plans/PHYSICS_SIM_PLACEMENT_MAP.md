# Physics Simulation Placement Map — which archetype goes on which page

**Status:** 🟢 Ready to execute. Written 2026-07-30 against the live page list.

**How to read this.** Every row is `page_number · page-slug → archetype-id`. The
archetype id is what a `mechanics_bench` / `motion_lab` / `circuit_bench` /
`field_bench` block stores, so a row is directly authorable — pick the block type,
paste the archetype id, done. Insertion point within the page is given where it
matters ("after the derivation", "before the worked example").

Page lists were read from `book_pages` on 2026-07-30. **Re-check slugs before a
bulk insert** — a chapter rebuild renumbers pages.

**Insert through the sanctioned gateway.** All writes go via
`scripts/lib/book-writer.js` (`savePage`), never raw `updateOne` — CLAUDE.md §0.6.
Adding a block is additive, so the content-loss guard should report 0 removals; if
it doesn't, stop.

---

## Class 11 · Ch.4 — Laws of Motion (17 pp) — **the big unlock**

The chapter that makes FBD Studio and Pulley Lab reachable. 23 archetypes, and
the page order matches the ladder they were designed as.

| # | page slug | block | archetype | why here |
|---|---|---|---|---|
| 1 | `newtons-first-and-third-law` | `mechanics_bench` fbd | `single-body-ground` | targets `ghost_motion_force` — "motion needs a force to continue" is exactly this page's misconception |
| 2 | `newtons-second-law-and-equilibrium` | `mechanics_bench` solve | `applied-at-angle` | resolve the pull, then ΣF = ma; the solve stage unlocks after a correct diagram |
| 3 | `free-body-diagrams` | `mechanics_bench` fbd | `body-on-incline` | **flagship placement.** The chapter's title page for the tool. `normal_not_perpendicular` |
| 4 | `connected-bodies` | `mechanics_bench` fbd, `allow_cut: true` | `two-blocks-in-contact` | **the cut tool's home page.** "One string, one acceleration" is the system-boundary idea |
| 4 | `connected-bodies` | `mechanics_bench` fbd | `string-over-pulley` | second block — lets the student isolate either body |
| 5 | `constraint-equations-fixed-pulley` | `mechanics_bench` pulley | `fixed-pulley` → `atwood` → `table-and-hanging` | the first three rungs, in order. `pulley_multiplies_force` |
| 6 | `constraint-equations-movable-pulleys-and-wedges` | `mechanics_bench` pulley | `movable-pulley` → `block-and-tackle` → `double-atwood` | where the coefficient 2 and the coefficient n are *derived* |
| 6 | `constraint-equations-movable-pulleys-and-wedges` | `mechanics_bench` fbd | `block-on-movable-wedge` | the wedge half of the page title |
| 7 | `friction-basics` | `mechanics_bench` fbd | `incline-with-friction` | static-vs-kinetic; `friction_wrong_sense` |
| 8 | `friction-pulling-pushing-and-stacked-blocks` | `mechanics_bench` fbd | `two-stacked-blocks` | `third_law_pair_same_body` — the page names stacked blocks |
| 9 | `friction-walls-wedges-and-minimum-force` | `mechanics_bench` solve | `applied-at-angle` | minimum-force is an optimisation over the pull angle; the algebra panel shows why |
| 10 | `pseudo-force-and-lift-problems` | `mechanics_bench` fbd | `lift-accelerating` | **the punchline.** Same scene, opposite correct answers in the two frames |
| 10 | `pseudo-force-and-lift-problems` | `mechanics_bench` pulley | `pulley-on-accelerating-support` | Atwood inside the lift; g → g + A |
| 11 | `pseudo-force-wedges-vehicles-and-pendulums` | `mechanics_bench` fbd | `rotating-drum` | `ghost_centrifugal` — outward force in a ground frame |
| 12 | `circular-dynamics-vertical-circle-and-conical-pendulum` | `motion_lab` | `vertical-circle` → `critical-speed` → `conical-pendulum` | all three named in the page title |
| 13 | `circular-dynamics-banking-of-roads` | `motion_lab` | `banked-road` | 1:1 |

**Enrichment (mark `tier: 'competitive'`):** `pulley-with-mass` on p6 — T₁ ≠ T₂
across a massive sheave is beyond NCERT but is a standard JEE trap, and the
engine solves the τ = Iα row properly.

**Not placed:** none. Every FBD and Pulley archetype has a home in this chapter.

---

## Class 11 · Ch.2 — Motion in One Dimension (18 pp)

| # | page slug | archetype (`motion_lab`, scenario `graphs`) |
|---|---|---|
| 3 | `instantaneous-velocity` | `tangent-vs-chord` |
| 4 | `reading-an-x-t-graph` | `slope-is-velocity`, then `two-flat-lines` |
| 5 | `acceleration-the-rate-of-a-rate` | `turning-point` |
| **6** | `speeding-up-or-slowing-down` | **`slowing-down-positive-a`, `retardation-both-signs`** — the page is literally titled "the Sign Trap" and these two archetypes exist for it |
| 7 | `slope-down-area-up` | `area-is-displacement`, `there-and-back` |
| 8 | `the-four-motions-drawn-three-ways` | `sketch-your-own`, `match-uniform`, `match-reversal` |
| 9 | `the-three-equations-derived` | `uniform-accel-equations` |
| 13 | `relative-velocity-in-one-dimension` | `frame-swap-1d`, `two-trains` |

Leaves `river-crossing` and `rain-and-man` for Ch.3 p14, where they belong.

---

## Class 11 · Ch.3 — Motion in Two Dimensions (18 pp)

| # | page slug | archetype (`motion_lab`) |
|---|---|---|
| 4 | `projectile-motion-setting-it-up` | `basic-launch`, `independence-of-components` |
| 5 | `time-of-flight-height-and-range` | `apex-anatomy`, `apex-gravity`, `range-vs-angle`, `same-range-pair` |
| 6 | `the-equation-of-the-path` | `safety-envelope` |
| 7 | `thrown-from-a-height` | `launch-from-height` — and the ~42° shot-put payoff |
| 8 | `projectile-problems-that-look-different` | `monkey-hunter`, `target-practice`, `cart-frame` |
| 8 | ″ (enrichment) | `with-drag`, `vacuum-vs-air` |
| 9 | `projectile-on-an-inclined-plane` | `incline-launch` |
| 10 | `going-round-in-a-circle` | `uniform-basics`, `velocity-is-tangential` |
| 11 | `centripetal-acceleration` | `cut-the-string`, `frame-toggle` |
| 12 | `when-the-circle-speeds-up` | `non-uniform` |
| 13 | `relative-velocity-in-two-dimensions` | `two-trains` |
| 14 | `crossing-a-river-and-walking-in-the-rain` | `river-crossing`, `rain-and-man` |

`rotor-drum`, `bridge-crest`, `spin-dryer`, `centrifuge` are the Circular Arena's
"real machines" tab — best as a single instruments block on p11 or p12 rather
than four separate placements.

---

## Class 12 · Ch.1 — Electrostatics (21 pp)

| # | page slug | archetype (`field_bench`, kind `electric`) |
|---|---|---|
| 4 | `superposition-more-than-two-charges` | `two-like-charges` |
| 6 | `the-electric-field` | `single-charge` — `field_needs_a_test_charge` |
| 7 | `electric-field-lines` | **`charge-with-sideways-velocity`** — the `field_lines_are_paths` killer |
| 9 | `charge-set-free-in-a-uniform-field` | `charge-released-from-rest` |
| 10–11 | `the-electric-dipole`, `the-field-of-a-dipole` | `dipole` |
| 13 | `electric-flux` | `gauss-sphere` |
| **14** | `gausss-law` | **`gauss-drag-me`** — drag the surface, watch the flux not change. The page this engine was built for |
| 15 | `gauss-in-action` | `gauss-off-centre` |
| 16–17 | `what-a-conductor-does-to-a-field`, `cavities-and-shielding` | `conductor-cavity` |

Also worth placing: `equipotentials` on Ch.2 p5 (below).

---

## Class 12 · Ch.3 — Current Electricity (18 pp)

| # | page slug | archetype (`circuit_bench`) |
|---|---|---|
| 3 | `ohms-law-and-resistance` | `wire-has-no-drop` |
| 6 | `what-a-cell-really-does` | `internal-resistance` |
| 7 | `resistors-in-series-and-parallel` | `series-vs-parallel`, `adding-parallel-lowers-R` |
| **8** | `reading-a-circuit-you-have-not-seen-before` | **`ugly-redraw`**, `symmetry-shortcut`, `infinite-ladder` — the page title *is* the redraw engine's purpose |
| 9 | `kirchhoffs-two-laws` | `wheatstone-unbalanced` (the network that will not reduce) |
| 11 | `power-and-the-heating-effect` | `bulb-brightness`, `current-not-used-up`, `short-circuit` |
| 12 | `the-wheatstone-bridge` | `wheatstone-balanced` |
| 13 | `the-meter-bridge` | `wheatstone-balanced` (params re-tuned to the slide-wire form) |
| 14 | `the-potentiometer` | `potentiometer` |
| 15 | `inside-a-meter` | `meter-loading` |

**Gap:** p2 `drift-velocity` has no sim. The Drift Velocity Chamber is in the
plan (§4 unit 10) and was never built.

---

## Class 12 · Ch.6 — Electromagnetic Induction (18 pp) — **complete coverage**

Every one of the 12 EMI archetypes has a page, in the book's own order.

| # | page slug | archetype (`field_bench`, mode `emi`) |
|---|---|---|
| 2 | `emi-magnetic-flux` | `loop-tilt-flux` |
| **3** | `emi-faradays-law` | **`flux-not-flux-rate`** — ε = −dΦ/dt, not Φ |
| 4 | `emi-lenzs-law` | `lenz-both-ways` |
| 5 | `emi-reading-a-lenz-situation` | `flux-machine` (the flagship — the loop drags where the force is real) |
| 6 | `emi-motional-emf` | `motional-emf-rod` |
| 7 | `emi-motional-emf-geometries` | `rod-terminal-velocity` |
| 8 | `emi-the-energy-account` | `motional-power-balance` — mechanical power in == electrical power out |
| 9 | `emi-eddy-currents` | `eddy-brake-solid`, `eddy-slotted-plate` |
| 10 | `emi-self-inductance` | `self-inductance-ramp` |
| 11 | `emi-mutual-inductance` | `mutual-inductance-pair` |
| 13 | `emi-the-lr-circuit` | `lr-current-growth` (from the AC library — `circuit_bench`) |
| 15 | `emi-the-ac-generator` | `ac-generator-loop` |

---

## Class 12 · Ch.7 — Alternating Current (16 pp) — **complete coverage**

All 15 AC archetypes placed.

| # | page slug | archetype (`circuit_bench`) |
|---|---|---|
| 1 | `ac-lc-oscillations` | `lc-oscillation` |
| 3 | `ac-rms-and-peak-values` | `rms-not-average` |
| **4** | `ac-phasors` | **`phasor-is-the-waveform`** — the phasor IS the waveform, rotating |
| 5 | `ac-through-a-resistor` | `ac-resistor-only` |
| 6 | `ac-through-an-inductor` | `ac-inductor-only` |
| 7 | `ac-through-a-capacitor` | `ac-capacitor-only`, `capacitor-frequency-gate` |
| 8 | `ac-series-lr-and-cr` | `reactance-vs-frequency` |
| 9 | `ac-series-lcr-circuit` | `series-lcr-phasor` |
| 10 | `ac-resonance` | `lcr-resonance` |
| 11 | `ac-sharpness-of-resonance` | `lcr-damping` |
| 12 | `ac-power-and-power-factor` | `power-factor` |
| 13 | `ac-transformers` | `transformer-turns-ratio`, `transmission-at-high-voltage` |

---

## Class 12 · Ch.5 — Magnetic Effects of Current (18 pp) — **thin**

| # | page slug | archetype |
|---|---|---|
| 3 | `the-lorentz-force-and-the-velocity-selector` | `velocity-selector` |
| 4 | `circular-motion-in-a-magnetic-field` | `uniform-B-circular` |
| 6 | `the-cyclotron` | `cyclotron` |

**Everything else on this chapter is a gap** — pp 9–14 (Biot–Savart, straight
wire, loops and arcs, Ampère, solenoid/toroid, current loop as a dipole) have no
sim, because `current-wire`, `current-loop`, `solenoid` and `bar-magnet` exist in
`SourceKind` but are **excluded from `SUPPORTED_KINDS`** and `magneticOf` returns
0 for them. Building those three source models is the single highest-value gap in
the whole program: it would light up 6 pages here and most of Ch.4.

---

## Class 12 · Ch.2 — Capacitance (20 pp) — **one placement**

| # | page slug | archetype |
|---|---|---|
| 5 | `equipotential-surfaces` | `equipotentials` (`field_bench`) |

Everything else is a gap. The Capacitor Workbench (§4 unit 9 — plates, dielectric
slide-in, live Q/V/E/U ledger, and the battery-connected-vs-isolated distinction)
was planned and never built. pp 8–16 would take it directly.

## Class 12 · Ch.4 — Magnetic Properties of Matter (12 pp) — **no coverage**

Needs bar-magnet field modelling plus a hysteresis/domain sim. Nothing exists.

## Class 12 · Ch.8 — Electromagnetic Waves (12 pp) — **no coverage**

---

## Totals

| | |
|---|---|
| Placements specified | **~111** |
| Chapters with complete library coverage | Ch.4 LoM, C12 Ch.6 EMI, C12 Ch.7 AC |
| Chapters with strong coverage | C11 Ch.2, C11 Ch.3, C12 Ch.1, C12 Ch.3 |
| Built chapters with little or none | C12 Ch.2 Capacitance, Ch.4 Magnetic Properties, Ch.5 (partial), Ch.8 EM Waves |

## The three gaps worth building next, in order

1. **Magnetic source models** (`current-wire`, `current-loop`, `solenoid`,
   `bar-magnet` in `field-bench/lib/sources.ts`) — unlocks ~6 pages of C12 Ch.5
   and most of Ch.4. Types already exist; only the physics is missing.
2. **Capacitor Workbench** — unlocks ~9 pages of C12 Ch.2.
3. **Drift Velocity Chamber** — one page, but it is the page students find least
   intuitive in Current Electricity.

## Before any of this is inserted

**No simulation in this program has been runtime-verified.** Agents were barred
from starting a dev server, so the physics and the types are proven and the
interaction is not. Run the browser pass on `/sim-review` first — and note that
harness is a **live public route** that must be deleted or gated before release.
