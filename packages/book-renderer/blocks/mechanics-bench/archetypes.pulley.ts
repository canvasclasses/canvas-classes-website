/*
 * archetypes.pulley.ts — the Pulley Lab construction library (E1).
 * ─────────────────────────────────────────────────────────────────────────────
 * Every entry is a PURE `buildScene`: params in, a `Scene` out. No React, no
 * DOM, no physics. Nothing here computes an acceleration, a tension or a
 * mechanical advantage — the engine derives the constraint equations from
 * string-length invariance (`lib/constraints`) and solves everything
 * simultaneously (`lib/dynamics`). If you find yourself writing `a = 2 * a2`
 * in this file, stop: that is the thing Pulley Lab exists to DERIVE.
 *
 * ── GEOMETRY IS LOAD-BEARING. READ THIS BEFORE MOVING ANY BODY. ─────────────
 * `deriveConstraints` treats a pulley as a REAL CIRCLE and takes each segment
 * along the common tangent, so every coefficient is a dot product with a TRUE
 * segment direction. That means the placements below are not cosmetic:
 *
 *   · a mass hanging off a sheave sits at  x = pulley.x ± radius,
 *     never at x = pulley.x — centre it and the Atwood constraint degrades to
 *     0.93a₁ + 0.93a₂ = 0;
 *   · two sheaves with a rope in the bight between them sit
 *     (r₁ + r₂) apart horizontally, which is what makes the internal tangent
 *     exactly vertical and the movable-pulley coefficient exactly 2 rather
 *     than 1.87;
 *   · a POINT node (an anchor, a block) has radius 0, so the separation it
 *     needs from a sheave is just that sheave's own radius.
 *
 * `scripts/verify-mechanics-bench.mjs` case 5 is the worked example. Whenever
 * you touch a scene here, re-run the pulley archetype check — a coefficient
 * drifting off an integer is invisible in the UI right up until a student
 * reads "1.87aₚ" and stops trusting the thing.
 *
 * CONVENTION (mechanics-bench/types.ts): physics coordinates — x right, y UP,
 * angles degrees CCW from +x, SI units. `dofDeg` is the single translational
 * axis a body is solved along, and the solver reports a SIGNED scalar along it.
 * A hanging mass uses 270, so positive means "moving down".
 *
 * THE LADDER. Nine rungs, each adding exactly one element, each teaching one
 * new shape of constraint. See PHYSICS_SIMULATION_PROGRAM.md §5.2.
 *
 *   1 fixed-pulley       a₁ + a₂ = 0        two segments, opposite senses
 *   2 atwood             a₁ + a₂ = 0        same constraint, unequal masses
 *   3 table-and-hanging  −a₁ + a₂ = 0       the two axes are no longer parallel
 *   4 incline-and-hanging −a₁ + a₂ = 0      the axis tilts; the constraint doesn't care
 *   5 movable-pulley     a₁ + 2aₚ = 0       TWO segments hold the sheave → coefficient 2
 *   6 block-and-tackle   a₁ + n·aₚ = 0      n falls → coefficient n
 *   7 pulley-with-mass                      names the massless-sheave assumption
 *   8 double-atwood      two coupled constraints; a pulley is another body's ceiling
 *   9 accelerating-support                  solved in the lift's frame, g → g + A
 *
 * ── WHAT EACH RUNG `targets`, AND WHY THE VOCABULARY HAD TO GROW FIRST ───────
 * Every rung now declares a `MisconceptionCode`. Getting there took two passes,
 * and the order of those passes is the point — worth keeping, because the next
 * engine to be added to this program will hit the same wall.
 *
 * PASS 1 (2026-07-30). `MechanicsArchetype.targets` gained its field and all
 * nine rungs were left BLANK on purpose. `MisconceptionCode` was FBD-shaped: it
 * named omitted arrows, invented arrows, wrong arrow geometry, wrong arrow
 * magnitudes. Nothing in it described a constraint error. `magnitude_wrong`
 * would technically have fitted the massive-sheave rung and would have been a
 * lie — it files "the student thinks tension is equal across any pulley" under
 * "drew an arrow the wrong size", which poisons the only thing these codes are
 * for: analytics on what students actually get wrong. The audit score sat at
 * 4/5 with nine honest blanks rather than 5/5 with nine wrong labels.
 *
 * PASS 2 (2026-07-30, same day). The six missing codes were added to
 * `MisconceptionCode` — exactly as `missing_applied`, `missing_spring` and
 * `force_agent_unnamed` were added when the FBD grader needed them — and the
 * blanks were filled from the list Pass 1 had written out. The mapping:
 *
 *   1 fixed-pulley       pulley_multiplies_force
 *   2 atwood             pulley_multiplies_force          (same belief, unbalanced)
 *   3 table-and-hanging  tilt_changes_the_constraint      (the 90° case)
 *   4 incline-and-hanging tilt_changes_the_constraint     (the general-θ case)
 *   5 movable-pulley     machine_gives_free_work
 *   6 block-and-tackle   machine_gives_free_work          (n falls, same ledger)
 *   7 pulley-with-mass   tension_equal_across_any_pulley
 *   8 double-atwood      movable_pulley_is_a_ceiling
 *   9 accelerating-support accelerations_same_in_every_frame
 *
 * Three codes are shared by two rungs each. That is deliberate and mirrors
 * `third_law_pair_same_body` in archetypes.fbd.ts: one belief, attacked twice
 * from different directions, is better than two codes splitting one belief.
 *
 * DECLARED IS NOT WIRED. Pulley Lab draws no free-body diagram and never calls
 * `gradeFbd`, so none of these codes reaches a student yet — its feedback
 * surfaces are the predict-then-reveal verdict badge, the constraint ledger's
 * mismatch list, the numeric check and the tension readout, all in `pulley/`.
 * Phase 1 of this program shipped 22 codes that were declared and never read by
 * any feedback path; a `targets` value is a promise the UI still has to keep.
 */

import type { Body, Contact, MechanicsArchetype, Scene, StringLink } from './types';

// ── Scene-building primitives ────────────────────────────────────────────────

/** Standard sheave radius, metres. Also the horizontal offset every hanging
 *  mass needs from its sheave — see the geometry note above. */
const R = 0.28;
/**
 * Tackle sheaves are small, so several falls fit into one block without the
 * tangent offsets splaying the rope off vertical. At 1.5 cm the derived
 * coefficient lands within 0.005% of n (verified: n = 6 gives 5.99987), and the
 * canvas draws the wheel at a legible floor size regardless.
 */
const R_T = 0.015;
const BLOCK = { w: 0.3, h: 0.3 };
const CEIL_Y = 2.95;

function num(
  key: string, label: string, def: number,
  min: number, max: number, step: number, unit?: string,
) {
  return { key, label, kind: 'number' as const, default: def, min, max, step, unit };
}

/** Read a numeric param defensively — authored JSON is untrusted. */
function P(
  params: Record<string, number | string | boolean> | undefined,
  key: string, dflt: number,
): number {
  const raw = params?.[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : dflt;
}

const sheave = (
  id: string, x: number, y: number, label: string,
  extra: Partial<Body> = {},
): Body => ({
  id, shape: 'pulley', mass: 0, pos: { x, y }, radius: R, fixed: true, label, ...extra,
});

const hanging = (id: string, x: number, y: number, mass: number, label: string): Body => ({
  id, shape: 'block', mass, pos: { x, y }, size: { ...BLOCK }, dofDeg: 270, label,
});

const anchor = (id: string, x: number, y: number, label: string): Body => ({
  id, shape: 'block', mass: 0, pos: { x, y }, size: { w: 0.42, h: 0.06 },
  fixed: true, label,
});

const rope = (id: string, path: string[], label?: string): StringLink =>
  ({ id, path, taut: true, massless: true, label });

// ── 1 + 2. Fixed pulley / Atwood ─────────────────────────────────────────────
// One topology, two rungs. Rung 1 runs it balanced so the ONLY thing on show is
// the direction change (MA = 1 — you still pull the full weight). Rung 2 breaks
// the balance and the same constraint suddenly produces motion. Changing one
// number and watching everything move is a better lesson than a new diagram.
//
// Geometry: p1 at x = 0, so the two masses sit at x = ∓R. Both segments are
// then exactly vertical and the constraint comes out as a₁ + a₂ = 0 to machine
// precision.

function overheadPair(m1: number, m2: number, g = 9.8): Scene {
  return {
    g,
    bodies: [
      anchor('anc', 0, CEIL_Y, 'ceiling'),
      sheave('p1', 0, 2.6, 'fixed pulley'),
      hanging('m1', -R, 1.45, m1, 'm₁'),
      hanging('m2', R, 1.45, m2, 'm₂'),
    ],
    contacts: [],
    strings: [rope('s1', ['m1', 'p1', 'm2'], 'the rope')],
  };
}

const fixedPulley: MechanicsArchetype = {
  id: 'fixed-pulley',
  title: 'Fixed pulley',
  summary: 'One sheave bolted to the ceiling, equal masses. Direction changes; the force does not.',
  mode: 'pulley',
  // Run balanced precisely so the ONLY thing on show is the direction change.
  // MA = 1: you still pull the full weight. That is the belief being attacked.
  targets: 'pulley_multiplies_force',
  defaultBody: 'm1',
  params: [
    num('m1', 'Left mass', 2, 0.5, 10, 0.5, 'kg'),
    num('m2', 'Right mass', 2, 0.5, 10, 0.5, 'kg'),
  ],
  buildScene: (p) => overheadPair(P(p, 'm1', 2), P(p, 'm2', 2)),
  defaultSteps: [
    { say: 'One rope, one sheave bolted to the ceiling, a mass on each end. Nothing has been calculated yet.', cta: 'Show the rope segments' },
    { say: 'The rope has two segments. It cannot stretch, so whatever one segment gains, the other must lose. Drag a block and watch the two numbers move in opposite directions while the total sits still.', cta: 'Derive the constraint' },
    { say: 'That sentence, written as algebra, is the constraint equation. Now it can be stacked with ΣF = ma and solved.', cta: 'Solve the system' },
  ],
};

const atwood: MechanicsArchetype = {
  id: 'atwood',
  title: "Atwood's machine",
  summary: 'The same fixed pulley with unequal masses — the balance breaks and the system runs.',
  mode: 'pulley',
  // The same belief as rung 1, re-tested with the balance broken: the system now
  // moves, and a student who thinks the sheave multiplied something has to
  // explain why the answer is still just (m₁ − m₂)g / (m₁ + m₂).
  targets: 'pulley_multiplies_force',
  defaultBody: 'm1',
  params: [
    num('m1', 'Left mass', 3, 0.5, 10, 0.5, 'kg'),
    num('m2', 'Right mass', 2, 0.5, 10, 0.5, 'kg'),
  ],
  buildScene: (p) => overheadPair(P(p, 'm1', 3), P(p, 'm2', 2)),
  defaultSteps: [
    { say: 'Nothing has been added — one mass simply got heavier. The rope, the sheave and the constraint are exactly what they were.', cta: 'Show the rope segments' },
    { say: 'The constraint has not changed at all. Only the forces did. That is the whole reason the two are derived separately and solved together.', cta: 'Derive the constraint' },
    { say: 'Two ΣF = ma equations and one constraint. Three equations, three unknowns: a₁, a₂ and T.', cta: 'Solve the system' },
  ],
};

// ── 3. Block on a table + hanging mass ───────────────────────────────────────
// The first rung where the two bodies move along DIFFERENT axes. The constraint
// still reads "one segment shortens exactly as fast as the other lengthens" —
// it is about rope length, not about direction in space.
//
// Geometry: the block's centre sits at the pulley's TOP tangent height
// (y = p1.y + R) so the horizontal run is exactly horizontal, and the hanging
// mass sits at x = p1.x + R so its run is exactly vertical.

const tableAndHanging: MechanicsArchetype = {
  id: 'table-and-hanging',
  title: 'Block on a table + hanging mass',
  summary: 'One body slides horizontally, one falls vertically — and the same rope ties them together.',
  mode: 'pulley',
  // The 90° case of "the constraint depends on which way the bodies move". The
  // two axes are perpendicular here and the segments still trade length
  // one-for-one, because rope length is geometry and knows nothing of direction.
  targets: 'tilt_changes_the_constraint',
  defaultBody: 'm1',
  params: [
    num('m1', 'Block on the table', 4, 0.5, 12, 0.5, 'kg'),
    num('m2', 'Hanging mass', 2, 0.5, 12, 0.5, 'kg'),
    num('mu', 'Friction coefficient μ', 0, 0, 0.8, 0.05),
  ],
  buildScene: (p) => {
    const mu = P(p, 'mu', 0);
    const px = 0.35, py = 2.0;
    const contacts: Contact[] = [{
      id: 'c1', bodyA: 'm1', bodyB: 'table', normalDeg: 90,
      mu_s: mu, mu_k: mu, slidingSign: mu > 0 ? 1 : 0,
    }];
    return {
      g: 9.8,
      bodies: [
        {
          id: 'table', shape: 'block', mass: 0, fixed: true,
          pos: { x: -0.6, y: py + R - BLOCK.h / 2 - 0.03 },
          size: { w: 1.5, h: 0.06 }, label: 'table',
        },
        // dofDeg = 0 → positive means sliding toward the pulley, which SHORTENS
        // its segment. That is why its term comes out negative; the ledger says so.
        { ...hanging('m1', -0.95, py + R, P(p, 'm1', 4), 'm₁'), dofDeg: 0 },
        sheave('p1', px, py, 'edge pulley'),
        hanging('m2', px + R, 1.45, P(p, 'm2', 2), 'm₂'),
      ],
      contacts,
      strings: [rope('s1', ['m1', 'p1', 'm2'], 'the rope')],
    };
  },
  defaultSteps: [
    { say: 'The block slides sideways; the hanging mass falls straight down. Two different directions, one rope.', cta: 'Show the rope segments' },
    { say: 'Drag the hanging mass down. The vertical segment grows and the horizontal segment shrinks by exactly the same amount — even though the two bodies are moving at right angles to each other.', cta: 'Derive the constraint' },
    { say: 'The constraint is the Atwood one with a sign flipped, because the block moving toward the pulley shortens its side instead of lengthening it. Rope length does not know about direction.', cta: 'Solve the system' },
  ],
};

// ── 4. Incline + hanging mass ────────────────────────────────────────────────
// Geometry: the apex sheave sits so that its centre is R perpendicular BELOW
// the line the rope runs along (the rope passes over the top of the wheel), and
// the hanging mass sits at x = p1.x + R. Both segments then land exactly on
// their intended directions, so the coefficients stay at ±1 at any angle.

const inclineAndHanging: MechanicsArchetype = {
  id: 'incline-and-hanging',
  title: 'Incline + hanging mass',
  summary: 'Tilt the surface. The constraint is unmoved; only the force components change.',
  mode: 'pulley',
  // The general-θ case of the same belief, and the one the code is named for:
  // θ is a slider here, so the student can watch the coefficients stay at ±1
  // through every angle while ΣF = ma changes underneath them.
  targets: 'tilt_changes_the_constraint',
  defaultBody: 'm1',
  params: [
    num('theta', 'Incline angle', 30, 10, 60, 1, '°'),
    num('m1', 'Mass on the incline', 4, 0.5, 12, 0.5, 'kg'),
    num('m2', 'Hanging mass', 3, 0.5, 12, 0.5, 'kg'),
    num('mu', 'Friction coefficient μ', 0, 0, 0.8, 0.05),
  ],
  buildScene: (p) => {
    const theta = P(p, 'theta', 30);
    const mu = P(p, 'mu', 0);
    const rad = (theta * Math.PI) / 180;
    const u = { x: Math.cos(rad), y: Math.sin(rad) };
    const n = { x: -Math.sin(rad), y: Math.cos(rad) };

    const base = { x: -1.15, y: 1.2 };
    const run = 1.4;
    const rise = run * Math.tan(rad);
    const L = run / Math.cos(rad);
    const lift = BLOCK.h / 2;                       // rope height above the surface

    const at = (s: number, perp: number) => ({
      x: base.x + s * u.x + perp * n.x,
      y: base.y + s * u.y + perp * n.y,
    });

    const block = at(0.5 * L, lift);
    const p1 = at(L + 0.1, lift - R);               // centre R BELOW the rope line

    return {
      g: 9.8,
      bodies: [
        {
          id: 'wedge', shape: 'wedge', mass: 0, fixed: true,
          pos: { x: base.x + run / 2, y: base.y + rise / 2 },
          size: { w: run, h: rise }, angleDeg: theta, label: 'wedge',
        },
        // dofDeg = +θ → positive is UP the slope, the way the hanging mass pulls.
        { ...hanging('m1', block.x, block.y, P(p, 'm1', 4), 'm₁'), dofDeg: theta },
        sheave('p1', p1.x, p1.y, 'apex pulley'),
        hanging('m2', p1.x + R, p1.y - 0.8, P(p, 'm2', 3), 'm₂'),
      ],
      contacts: [{
        id: 'c1', bodyA: 'm1', bodyB: 'wedge', normalDeg: theta + 90,
        mu_s: mu, mu_k: mu, slidingSign: mu > 0 ? 1 : 0,
      }],
      strings: [rope('s1', ['m1', 'p1', 'm2'], 'the rope')],
    };
  },
  defaultSteps: [
    { say: 'The surface is tilted now. Before you look at any forces, ask what the rope thinks about it.', cta: 'Show the rope segments' },
    { say: 'Drag either body. The segments still trade length one-for-one — the tilt changed nothing about the rope.', cta: 'Derive the constraint' },
    { say: 'Same constraint as three rungs ago, at any angle you like. Every difference between these problems lives in ΣF = ma, not here.', cta: 'Solve the system' },
  ],
};

// ── 5. Movable pulley — the aₚ coefficient of 2 ──────────────────────────────
// The rope is tied to the ceiling, drops under a movable sheave that CARRIES
// the load, climbs back over a fixed sheave and comes down to the effort mass.
// TWO segments run to the movable sheave, so the deriver returns a coefficient
// of 2 on it. That "2" is not written anywhere in this file — it is counted off
// the graph, which is why the ledger can show where it came from.
//
// Geometry: the ceiling tie is a POINT, so it sits R to the left of the movable
// sheave; the fixed sheave is a CIRCLE, so it sits 2R to the right (r + r —
// the internal tangent of two equal circles is vertical at that separation).

const movablePulley: MechanicsArchetype = {
  id: 'movable-pulley',
  title: 'Movable pulley',
  summary: 'The load hangs on the sheave, not the rope end. Two segments hold it — so it moves at half the speed.',
  mode: 'pulley',
  // Halving the force is the half of this rung students remember. The other
  // half — the load moves half as far, so the joules are identical — is the one
  // they skip, and it is what turns "machines multiply force" into "machines
  // trade force against distance". Deliberately NOT movable_pulley_is_a_ceiling:
  // this sheave is visibly the thing being lifted, so nobody mistakes it for
  // fixed. That confusion belongs to rung 8, where the sheave looks structural.
  targets: 'machine_gives_free_work',
  defaultBody: 'pm',
  params: [
    num('load', 'Load on the movable pulley', 6, 0.5, 20, 0.5, 'kg'),
    num('effort', 'Effort mass', 4, 0.5, 20, 0.5, 'kg'),
  ],
  buildScene: (p) => {
    const x0 = -0.55;
    return {
      g: 9.8,
      bodies: [
        anchor('anc', x0 - R, CEIL_Y, 'ceiling tie'),
        // The movable sheave IS the load — one body, drawn with its load box.
        sheave('pm', x0, 1.15, 'P', {
          fixed: false, mass: P(p, 'load', 6), dofDeg: 270,
        }),
        sheave('pb', x0 + 2 * R, 2.6, 'fixed pulley'),
        hanging('m1', x0 + 3 * R, 1.75, P(p, 'effort', 4), 'm₁'),
      ],
      contacts: [],
      strings: [rope('s1', ['anc', 'pm', 'pb', 'm1'], 'the rope')],
    };
  },
  defaultSteps: [
    { say: 'One end of the rope is now tied to the ceiling instead of to a mass, and the load hangs on the sheave itself.', cta: 'Show the rope segments' },
    { say: 'Count the segments running to the movable sheave. Then drag it down one notch and watch how much rope has to appear on the other side to pay for it.', cta: 'Derive the constraint' },
    { say: 'Two segments hold the load, so the load moves half as far and half as fast as your hand. That is the 2 in the equation, and nobody put it there by hand.', cta: 'Solve the system' },
  ],
};

// ── 6. Block and tackle — n falls ────────────────────────────────────────────
// The generalisation of rung 5. The rope zig-zags between a fixed block and a
// movable block; `n` is how many segments end up carrying the load, and the
// deriver counts them off the path exactly as it counted 2 above.
//
// Path construction: each visit to `pm` in the path contributes two adjacent
// segments, except when `pm` is an endpoint (the rope is TIED to the movable
// block), which contributes one. So an even n starts at the ceiling anchor and
// an odd n starts tied to the movable block — which is how real tackles are
// rigged, and why odd and even tackles look different.
//
// A lead sheave takes the hauling part out sideways so the effort mass hangs
// clear of the blocks; it is fixed, so it contributes no term.

function tacklePath(n: number): string[] {
  const falls = Math.max(2, Math.min(6, Math.round(n)));
  const path: string[] = [];
  if (falls % 2 === 0) {
    path.push('anc');
    for (let i = 0; i < falls / 2; i++) path.push('pm', 'pf');
  } else {
    for (let i = 0; i < (falls + 1) / 2; i++) path.push('pm', 'pf');
  }
  path.push('plead', 'm1');
  return path;
}

const blockAndTackle: MechanicsArchetype = {
  id: 'block-and-tackle',
  title: 'Block and tackle',
  summary: 'Keep reeving the rope back and forth. Every extra fall adds one to the coefficient.',
  mode: 'pulley',
  // Same ledger as rung 5, now with n adjustable — which is what makes the
  // free-work belief testable rather than assertable. Every fall you add divides
  // the force and multiplies the rope you must haul by the same n.
  targets: 'machine_gives_free_work',
  defaultBody: 'pm',
  params: [
    num('n', 'Supporting falls', 4, 2, 6, 1),
    num('load', 'Load', 12, 0.5, 40, 0.5, 'kg'),
    num('effort', 'Effort mass', 4, 0.5, 20, 0.5, 'kg'),
  ],
  buildScene: (p) => {
    const n = Math.max(2, Math.min(6, Math.round(P(p, 'n', 4))));
    const x0 = -0.2;
    const small = { radius: R_T };
    return {
      g: 9.8,
      bodies: [
        anchor('anc', x0 - R_T, CEIL_Y, 'ceiling tie'),
        sheave('pf', x0, 2.6, 'fixed block', small),
        sheave('pm', x0, 1.3, 'P', {
          ...small, fixed: false, mass: P(p, 'load', 12), dofDeg: 270,
        }),
        sheave('plead', 0.75, 2.6, 'lead sheave', small),
        hanging('m1', 0.75 + R_T, 1.75, P(p, 'effort', 4), 'm₁'),
      ],
      contacts: [],
      strings: [rope('s1', tacklePath(n), 'the rope')],
    };
  },
  defaultSteps: [
    { say: 'Same two blocks as before — the rope simply runs between them more than once.', cta: 'Show the rope segments' },
    { say: 'Change the number of falls and watch one thing: the coefficient in the equation is always exactly the number of segments you can count holding the load.', cta: 'Derive the constraint' },
    { say: 'n falls means the effort side moves n times as far. Pull n metres of rope, lift the load one metre — and do the same joules of work either way.', cta: 'Solve the system' },
  ],
};

// ── 7. Pulley WITH mass — naming the assumption ──────────────────────────────
// "Tension is the same throughout" was never a law. It is what you get when the
// sheave is massless, because a massless sheave needs no net torque to spin up.
// Give it a moment of inertia and the two sides MUST differ.
//
// `lib/dynamics` solves this for real: a sheave with both `inertia > 0` and
// `radius > 0` splits its rope into runs with one tension each and gains the
// row (T_in − T_out)·r = Iα, with the no-slip condition α = L̈/r. At the values
// below that comes out a = 1.633 m/s², T₁ = 24.500 N, T₂ = 22.867 N — and
// (T₁ − T₂)·r = Iα exactly. A massless sheave keeps exactly one tension, so
// every earlier rung is untouched.

const pulleyWithMass: MechanicsArchetype = {
  id: 'pulley-with-mass',
  title: 'Pulley with mass',
  summary: 'Where "tension is the same on both sides" comes from — and what it costs when the sheave is heavy.',
  mode: 'pulley',
  // The rung the code was written for. "Tension is the same throughout" is not
  // a law; it is what a MASSLESS sheave buys you, because a massless sheave
  // needs no net torque to spin up. Set M > 0 and the two sides must differ.
  targets: 'tension_equal_across_any_pulley',
  defaultBody: 'm1',
  params: [
    num('m1', 'Left mass', 3, 0.5, 12, 0.5, 'kg'),
    num('m2', 'Right mass', 2, 0.5, 12, 0.5, 'kg'),
    num('M', 'Pulley mass', 2, 0, 12, 0.5, 'kg'),
  ],
  buildScene: (p) => {
    const M = P(p, 'M', 2);
    const scene = overheadPair(P(p, 'm1', 3), P(p, 'm2', 2));
    return {
      ...scene,
      bodies: scene.bodies.map((b) =>
        b.id === 'p1'
          // Uniform disc about its centre: I = ½MR² (standard-body result,
          // NCERT Class 11 table of moments of inertia).
          ? { ...b, mass: M, inertia: 0.5 * M * R * R, label: 'pulley (M)' }
          : b),
    };
  },
  defaultSteps: [
    { say: 'The masses have not moved. The sheave now has mass, and mass has to be spun up.', cta: 'Show the rope segments' },
    { say: 'The rope still cannot stretch, so the constraint is word-for-word what it was on rung 1. Nothing about mass appears in it — the constraint is geometry, not dynamics.', cta: 'Derive the constraint' },
    { say: 'Spinning a heavy sheave needs a net torque, and the only thing that can supply it is a difference between the two tensions. So "tension is the same throughout" was always shorthand for "the pulley is massless" — an assumption, not a law.', cta: 'Solve the system' },
  ],
};

// ── 8. Double Atwood ─────────────────────────────────────────────────────────
// A pulley hanging from another pulley's rope. Two coupled constraints — and
// the moment a student sees that a MOVING pulley is just another body with its
// own acceleration, this whole family stops being memorisable cases.
//
// Geometry: p2 is the END of the upper rope's path, so for that rope it is a
// POINT — it sits at p1.x + r₁ so the upper segment is exactly vertical. For
// the lower rope it is a circle in the middle of the path, so its two masses
// sit at p2.x ∓ r₂.

const doubleAtwood: MechanicsArchetype = {
  id: 'double-atwood',
  title: 'Double Atwood',
  summary: 'Hang a whole Atwood machine off one end of another. Two ropes, two coupled constraints.',
  mode: 'pulley',
  // p2 LOOKS like a ceiling for the lower rope, and treating it as one (aₚ = 0)
  // is the single most common way this problem is got wrong. It is a body with
  // its own acceleration, which is why the lower rope's two terms add to twice
  // the pulley term instead of to zero.
  targets: 'movable_pulley_is_a_ceiling',
  defaultBody: 'm1',
  params: [
    num('m1', 'Single mass', 6, 0.5, 20, 0.5, 'kg'),
    num('m2', 'Lower left mass', 3, 0.5, 20, 0.5, 'kg'),
    num('m3', 'Lower right mass', 2, 0.5, 20, 0.5, 'kg'),
  ],
  buildScene: (p) => {
    const r1 = 0.42;
    const p2x = r1;
    return {
      g: 9.8,
      bodies: [
        anchor('anc', 0, CEIL_Y, 'ceiling'),
        sheave('p1', 0, 2.45, 'fixed pulley', { radius: r1 }),
        hanging('m1', -r1, 1.3, P(p, 'm1', 6), 'm₁'),
        sheave('p2', p2x, 1.7, 'P', { fixed: false, mass: 0, dofDeg: 270 }),
        hanging('m2', p2x - R, 0.95, P(p, 'm2', 3), 'm₂'),
        hanging('m3', p2x + R, 0.95, P(p, 'm3', 2), 'm₃'),
      ],
      contacts: [],
      strings: [
        rope('s1', ['m1', 'p1', 'p2'], 'upper rope'),
        rope('s2', ['m2', 'p2', 'm3'], 'lower rope'),
      ],
    };
  },
  defaultSteps: [
    { say: 'The right-hand end of the upper rope no longer holds a mass. It holds a second pulley, and that pulley carries a whole Atwood machine of its own.', cta: 'Show the rope segments' },
    { say: 'Two ropes means two length-invariance statements. The lower one is written across a pulley that is itself accelerating — which is why its two terms add to twice the pulley term.', cta: 'Derive the constraints' },
    { say: 'Four unknown accelerations, two tensions, every equation solved at once. There is no case to memorise here; there is a graph and a rule.', cta: 'Solve the system' },
  ],
};

// ── 9. Pulley on an accelerating support ─────────────────────────────────────
// An Atwood machine bolted to the roof of a lift.
//
// Solved IN THE LIFT'S FRAME, where the pseudo-force on every body is −mA, so
// gravity behaves as g_eff = g + A (upward A makes everything feel heavier).
// For a vertical Atwood this substitution is exact, and it is how the problem
// is worked by hand. `frame` is deliberately NOT set on the scene: dynamics
// does not apply pseudo-forces yet, and if it later does, a scene carrying both
// g_eff AND a frame would double-count. The accelerations reported are relative
// to the pulley; adding A to each gives the ground frame.

const acceleratingSupport: MechanicsArchetype = {
  id: 'pulley-on-accelerating-support',
  title: 'Pulley on an accelerating support',
  summary: 'Bolt the whole machine to the ceiling of a lift. Accelerations relative to what, exactly?',
  mode: 'pulley',
  // Every acceleration this rung reports is relative to the PULLEY, not the
  // ground; adding A to each converts them. Reading them as ground-frame values
  // is the error, and it is a frame error rather than an arithmetic one.
  targets: 'accelerations_same_in_every_frame',
  defaultBody: 'm1',
  params: [
    num('m1', 'Left mass', 3, 0.5, 12, 0.5, 'kg'),
    num('m2', 'Right mass', 2, 0.5, 12, 0.5, 'kg'),
    num('A', 'Lift acceleration (up +)', 3, -8, 8, 0.5, 'm s⁻²'),
  ],
  buildScene: (p) =>
    overheadPair(P(p, 'm1', 3), P(p, 'm2', 2), 9.8 + P(p, 'A', 3)),
  defaultSteps: [
    { say: 'Nothing about the machine changed. The room it is bolted to is accelerating.', cta: 'Show the rope segments' },
    { say: 'Sitting in the lift, the rope still trades length one-for-one and the constraint is unchanged — but every acceleration in it is now measured relative to the pulley.', cta: 'Derive the constraint' },
    { say: 'Riding in the lift, gravity feels like g + A, so that is what the machine responds to. These accelerations are relative to the pulley; add the lift\'s own acceleration to each to get them relative to the ground. The constraint was never wrong — it was only ever a statement about the rope.', cta: 'Solve the system' },
  ],
};

// ── Exports ──────────────────────────────────────────────────────────────────

export const PULLEY_ARCHETYPES: Record<string, MechanicsArchetype> = {
  'fixed-pulley': fixedPulley,
  atwood,
  'table-and-hanging': tableAndHanging,
  'incline-and-hanging': inclineAndHanging,
  'movable-pulley': movablePulley,
  'block-and-tackle': blockAndTackle,
  'pulley-with-mass': pulleyWithMass,
  'double-atwood': doubleAtwood,
  'pulley-on-accelerating-support': acceleratingSupport,
};

/**
 * The ladder, in order, with the one thing each rung adds and the constraint it
 * teaches. `PulleyLab` drives the rung strip and the "add the next element"
 * button off this — the ordering is data, not a switch statement.
 */
export interface PulleyRung {
  id: string;
  /** Short label for the rung strip. */
  short: string;
  /** What the student just added, phrased for the predict prompt. */
  added: string;
  /** The constraint idea this rung exists to teach. */
  teaches: string;
}

export const PULLEY_LADDER: PulleyRung[] = [
  { id: 'fixed-pulley', short: 'Fixed', added: 'a fixed pulley', teaches: 'Two segments, one rope: whatever one gains the other loses.' },
  { id: 'atwood', short: 'Atwood', added: 'unequal masses', teaches: 'The constraint does not change when the forces do.' },
  { id: 'table-and-hanging', short: 'Table', added: 'a table', teaches: 'Rope length does not care that the two bodies move along different axes.' },
  { id: 'incline-and-hanging', short: 'Incline', added: 'an incline', teaches: 'Tilting the surface changes ΣF = ma, never the constraint.' },
  { id: 'movable-pulley', short: 'Movable', added: 'a movable pulley', teaches: 'Two segments hold the load → its term carries a coefficient of 2.' },
  { id: 'block-and-tackle', short: 'Tackle', added: 'more falls of rope', teaches: 'n segments holding the load → a coefficient of n.' },
  { id: 'pulley-with-mass', short: 'Massive', added: 'mass to the pulley', teaches: 'Equal tension across a sheave is an assumption, and this is the assumption.' },
  { id: 'double-atwood', short: 'Double', added: 'a second pulley on the rope', teaches: 'A moving pulley is just another body with its own acceleration.' },
  { id: 'pulley-on-accelerating-support', short: 'In a lift', added: 'an accelerating support', teaches: 'The constraint is relative to the pulley; the ground frame is a second step.' },
];

export const PULLEY_LADDER_IDS: string[] = PULLEY_LADDER.map((r) => r.id);
