/*
 * mechanics-bench/archetypes.fbd.ts — the FBD Studio construction library.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every FBD exercise on every page is a
 * `mechanics_bench` block naming one of these plus params. Same contract as
 * `vector-board/archetypes.ts`.
 *
 * Every `buildScene` is PURE — no React, no DOM, no randomness — so a plain node
 * script can construct any of these and hand it straight to `lib/scene` +
 * `lib/dynamics` to check the physics. No academic claim in this program ships
 * unverified (PHYSICS_SIMULATION_PROGRAM.md §9).
 *
 * CONVENTIONS (inherited from mechanics-bench/types.ts)
 *   • x right, y UP, metres, degrees CCW from +x, SI throughout.
 *   • A wedge's right angle is at its base-LEFT vertex and the hypotenuse
 *     descends to the RIGHT, so a block on it slides toward +x: its down-slope
 *     DOF is (360 − θ) and the normal on it is (90 − θ).
 *   • `dofDeg` is the single translational axis the solver reports along.
 *
 * THE LADDER (§5.1) — each rung is one archetype, and each targets a NAMED
 * misconception from the §5.1 table rather than a topic:
 *
 *   single-body-ground     missing_normal, ghost_motion_force
 *   body-on-incline        normal_not_perpendicular, normal_equals_mg_on_incline
 *   incline-with-friction  friction_wrong_sense, friction_exceeds_max
 *   applied-at-angle       "N = mg always" (a magnitude error, not an omission)
 *   two-stacked-blocks     third_law_pair_same_body
 *   two-blocks-in-contact  third_law_pair_same_body + the cut-tool payoff
 *   string-over-pulley     missing_tension, tension_wrong_direction
 *   block-on-movable-wedge missing_normal on the OTHER body
 *   lift-accelerating      pseudo_in_inertial_frame ⟷ missing_pseudo_in_noninertial
 *   rotating-drum          ghost_centrifugal ⟷ missing_pseudo_in_noninertial
 */

import type { Scene, Body, Contact, MechanicsArchetype, ReferenceFrame } from './types';
import { WORLD } from './types';

type Params = Record<string, number | string | boolean> | undefined;

const DEG = Math.PI / 180;
const G = 9.8;

const num = (p: Params, k: string, d: number): number =>
  typeof p?.[k] === 'number' ? (p[k] as number) : d;
const str = (p: Params, k: string, d: string): string =>
  typeof p?.[k] === 'string' ? (p[k] as string) : d;
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// ── Construction helpers ─────────────────────────────────────────────────────

const block = (id: string, mass: number, x: number, y: number, w = 0.6, h = 0.4, extra: Partial<Body> = {}): Body =>
  ({ id, shape: 'block', mass, pos: { x, y }, size: { w, h }, dofDeg: 0, label: id, ...extra });

const onGround = (id: string, bodyId: string, mu = 0.4, sliding: -1 | 0 | 1 = 0): Contact =>
  ({ id, bodyA: bodyId, bodyB: WORLD.ground, normalDeg: 90, mu_s: mu, mu_k: r3(mu * 0.75), slidingSign: sliding });

/**
 * The ground contact under a BOLTED-DOWN body (a fixed wedge, a lift floor).
 *
 * It is deliberately frictionless. The contact exists so the student can draw
 * that body's own free-body diagram and find the normal there — but a rough
 * contact under a body that cannot move introduces a static-friction unknown
 * with no equation to pin it down, and `solveScene` then correctly reports the
 * whole scene as under-determined. Verified against lib/dynamics: a fixed wedge
 * with μ = 0.6 under it makes a plain frictionless incline singular, and the
 * block's acceleration comes back 0 instead of g sin θ. μ = 0 keeps the normal
 * (and the lesson) and keeps every scene solvable.
 */
const boltedToGround = (id: string, bodyId: string): Contact =>
  ({ id, bodyA: bodyId, bodyB: WORLD.ground, normalDeg: 90, mu_s: 0, mu_k: 0, slidingSign: 0 });

/** A fixed wedge of incline θ whose base-left corner sits at (x0, 0). */
function wedge(id: string, thetaDeg: number, base: number, x0: number, mass = 8, fixed = true): Body {
  const h = r3(base * Math.tan(thetaDeg * DEG));
  return {
    id, shape: 'wedge', mass, fixed, angleDeg: thetaDeg,
    pos: { x: r3(x0 + base / 3), y: r3(h / 3) }, size: { w: base, h },
    dofDeg: 180, label: id,
  };
}

/** Seat a block of height `hb` at fraction `u` down a wedge's hypotenuse. */
function seat(id: string, mass: number, wd: Body, u: number, w = 0.55, hb = 0.36): Body {
  const theta = wd.angleDeg ?? 30;
  const bw = wd.size?.w ?? 2.2;
  const bh = wd.size?.h ?? 1;
  const baseX = wd.pos.x - bw / 3, baseY = wd.pos.y - bh / 3;
  const apex = { x: baseX, y: baseY + bh };
  const toe = { x: baseX + bw, y: baseY };
  const px = apex.x + u * (toe.x - apex.x);
  const py = apex.y + u * (toe.y - apex.y);
  return {
    id, shape: 'block', mass,
    pos: { x: r3(px + Math.sin(theta * DEG) * (hb / 2)), y: r3(py + Math.cos(theta * DEG) * (hb / 2)) },
    size: { w, h: hb }, angleDeg: -theta, dofDeg: r3((360 - theta) % 360), label: id,
  };
}

const onWedge = (id: string, bodyId: string, wedgeId: string, thetaDeg: number, mu: number): Contact => ({
  id, bodyA: bodyId, bodyB: wedgeId, normalDeg: r3(90 - thetaDeg),
  mu_s: mu, mu_k: r3(mu * 0.75),
  // Sliding when the slope beats static friction — the solver may override, but
  // the archetype states its own intent so kinetic friction has a known sense.
  slidingSign: Math.tan(thetaDeg * DEG) > mu ? 1 : 0,
});

const inertial: ReferenceFrame = { kind: 'inertial' };

// ── The ten rungs ────────────────────────────────────────────────────────────

const singleBodyGround: MechanicsArchetype = {
  id: 'single-body-ground',
  title: 'One block on the ground',
  summary: 'The first FBD. Two forces, and the one everybody invents.',
  mode: 'fbd',
  // The invented third arrow — "the force of motion". With μ = 0 and the push
  // at its default of 0 the truth set is exactly weight + normal, so any extra
  // horizontal arrow has no agent to name and grade.ts (c) fires.
  targets: 'ghost_motion_force',
  defaultBody: 'm1',
  params: [
    { key: 'mass', label: 'Mass', kind: 'number', default: 4, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'push', label: 'Push', kind: 'number', default: 0, min: 0, max: 100, step: 1, unit: 'N' },
    // μ defaults to ZERO on rung one, and that is a teaching decision, not a
    // physics one. `trueForcesFor` emits a friction force whenever μ ≠ 0,
    // regardless of whether anything is trying to slide — so with the old 0.4
    // default, a block sitting still on level ground with nothing pushing it
    // was marked as MISSING a friction force, and the only way past the grader
    // was to draw one. That taught "always draw friction on a rough surface,
    // even when it is zero", and it flatly contradicted this archetype's own
    // guide text ("nothing else is in contact with it, so nothing else can act
    // on it"). The slider is still here: roughness becomes real the moment the
    // student adds a push, which is exactly when friction becomes real too.
    { key: 'mu_s', label: 'Roughness μs', kind: 'number', default: 0, min: 0, max: 1.2, step: 0.05 },
  ],
  buildScene(p) {
    const mass = num(p, 'mass', 4);
    const push = num(p, 'push', 0);
    const mu = num(p, 'mu_s', 0);
    const sliding: -1 | 0 | 1 = push > mu * mass * G ? 1 : 0;
    return {
      bodies: [block('m1', mass, 1.2, 0.2)],
      contacts: [onGround('c1', 'm1', mu, sliding)],
      strings: [],
      applied: push > 0
        ? [{ id: 'F1', body: 'm1', from: WORLD.hand, mag: push, angleDeg: 0, label: 'push' }]
        : [],
      g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'Start with the simplest thing there is: a block, resting on the ground. Before you draw anything — how many objects are actually touching it?', cta: 'One: the ground' },
    { say: 'So there are exactly two things that can act on it. The Earth, which pulls on every gram of it from far away, and the ground, which pushes on it where they meet. Nothing else is in contact with it, so nothing else can act on it.', cta: 'Then why do I want a third arrow?' },
    { say: 'Turn the push up until the block starts moving, and watch what you want to add: a forward arrow, the “force of motion”. Name the object applying it. You cannot, because there is nothing there — and a force with no object behind it is not a force. A moving body keeps moving on its own. A force is what CHANGES that.', cta: 'Draw the diagram' },
  ],
};

const bodyOnIncline: MechanicsArchetype = {
  id: 'body-on-incline',
  title: 'A block on a smooth incline',
  summary: 'Where “normal is vertical” and “N = mg” both go to die.',
  mode: 'fbd',
  // Both errors live here, but the geometry one is graded FIRST (grade.ts
  // checks direction before magnitude, and a failed direction skips the
  // magnitude branch), and it is the one that causes the other.
  targets: 'normal_not_perpendicular',
  defaultBody: 'm1',
  params: [
    { key: 'theta', label: 'Incline angle', kind: 'number', default: 30, min: 5, max: 60, step: 1, unit: '°' },
    { key: 'mass', label: 'Mass', kind: 'number', default: 3, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
  ],
  buildScene(p) {
    const theta = num(p, 'theta', 30);
    const wd = wedge('w1', theta, 2.4, 0.4);
    const m1 = seat('m1', num(p, 'mass', 3), wd, 0.4);
    return {
      bodies: [wd, m1],
      contacts: [onWedge('c1', 'm1', 'w1', theta, 0), boltedToGround('c2', 'w1')],
      strings: [], applied: [], g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'Same block, tilted world. Drag the slope to whatever angle you like — this is your incline, not a textbook’s.', cta: 'Set the angle' },
    { say: 'Start with weight, because it is the one thing that does not change. The Earth pulls straight down, at 270°, whatever the slope is doing. Tilting your axes does not tilt gravity — weight is what gets resolved, never redirected.', cta: 'And the normal?' },
    { say: 'Here is the trap. The normal is perpendicular to the SURFACE, not to the ground — so the moment the slope tilts, the normal tilts with it, and it stops being mg as well. Draw both and see which one you get wrong.', cta: 'Isolate the block' },
  ],
};

const inclineWithFriction: MechanicsArchetype = {
  id: 'incline-with-friction',
  title: 'A rough incline',
  summary: 'Friction has a direction you must reason out, and a size it cannot exceed.',
  mode: 'fbd',
  // At the defaults tan 35° = 0.70 > μₛ = 0.5, so the contact slides, kinetic
  // friction's sense is KNOWN, and a backwards arrow is a real error rather
  // than an undetermined static one. `friction_exceeds_max` is the second half
  // of this rung (beat 3) but only bites once a magnitude is entered.
  targets: 'friction_wrong_sense',
  defaultBody: 'm1',
  params: [
    { key: 'theta', label: 'Incline angle', kind: 'number', default: 35, min: 5, max: 60, step: 1, unit: '°' },
    { key: 'mass', label: 'Mass', kind: 'number', default: 4, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'mu_s', label: 'Roughness μs', kind: 'number', default: 0.5, min: 0, max: 1.2, step: 0.05 },
  ],
  buildScene(p) {
    const theta = num(p, 'theta', 35);
    const mu = num(p, 'mu_s', 0.5);
    const wd = wedge('w1', theta, 2.4, 0.4);
    const m1 = seat('m1', num(p, 'mass', 4), wd, 0.38);
    return {
      bodies: [wd, m1],
      contacts: [onWedge('c1', 'm1', 'w1', theta, mu), boltedToGround('c2', 'w1')],
      strings: [], applied: [], g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'Set the slope and the roughness. Then, before you draw: is this block sliding, or is it stuck?', cta: 'I have decided' },
    { say: 'Friction does not oppose motion. It opposes the sliding AT THE CONTACT. Work out which way the block would slide if the surface were suddenly ice, and point friction the other way.', cta: 'Now how big is it?' },
    { say: 'One thing left before you draw. Static friction is not a number you calculate first — it is a range. It quietly takes whatever value stops the sliding, up to a ceiling of μₛN, and never one newton more. Ask for more than the ceiling and the block simply goes.', cta: 'Draw it' },
  ],
};

const appliedAtAngle: MechanicsArchetype = {
  id: 'applied-at-angle',
  title: 'Pulled at an angle',
  summary: 'The normal force stops being mg the moment you pull upward.',
  mode: 'fbd',
  // "N = mg always" on a FLAT surface. Deliberately NOT
  // `normal_equals_mg_on_incline`: grade.ts gates that code on a surface tilt
  // > 1°, and this ground contact is level, so it can never fire here. What
  // does fire — right direction, wrong size — is `magnitude_wrong`. A more
  // precise code for this rung would be a genuine addition to the vocabulary.
  targets: 'magnitude_wrong',
  defaultBody: 'm1',
  params: [
    { key: 'mass', label: 'Mass', kind: 'number', default: 6, min: 0.5, max: 25, step: 0.5, unit: 'kg' },
    { key: 'force', label: 'Pull', kind: 'number', default: 30, min: 0, max: 120, step: 1, unit: 'N' },
    { key: 'phi', label: 'Pull angle', kind: 'number', default: 30, min: -60, max: 60, step: 5, unit: '°' },
    { key: 'mu_s', label: 'Roughness μs', kind: 'number', default: 0.35, min: 0, max: 1.2, step: 0.05 },
  ],
  buildScene(p) {
    const mass = num(p, 'mass', 6);
    const F = num(p, 'force', 30);
    const phi = num(p, 'phi', 30);
    const mu = num(p, 'mu_s', 0.35);
    // N = mg − F sinφ, so friction's cap moves with the pull angle. That coupling
    // is the entire lesson of this rung.
    const N = Math.max(0, mass * G - F * Math.sin(phi * DEG));
    const sliding: -1 | 0 | 1 = F * Math.cos(phi * DEG) > mu * N ? 1 : 0;
    return {
      bodies: [block('m1', mass, 1.3, 0.22, 0.7, 0.44)],
      contacts: [onGround('c1', 'm1', mu, sliding)],
      strings: [],
      applied: [{ id: 'F1', body: 'm1', from: WORLD.hand, mag: F, angleDeg: phi, label: 'pull' }],
      g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'A suitcase on wheels, pulled by a handle that is not horizontal. Set the pull and its angle.', cta: 'Set the pull' },
    { say: 'Before anything else, split that pull into two pieces: one along the floor, one straight up. The horizontal piece is the part that drags the case. The vertical piece does nothing to the dragging at all — but it is not doing nothing.', cta: 'What is it doing?' },
    { say: 'Watch what it does to the ground. Part of your pull is lifting the case, so the ground has less to hold up — the normal force is no longer mg, and the friction it can supply drops with it.', cta: 'Draw the diagram' },
  ],
};

const twoStackedBlocks: MechanicsArchetype = {
  id: 'two-stacked-blocks',
  title: 'One block on top of another',
  summary: 'The action–reaction pair students insist on drawing on one body.',
  mode: 'fbd',
  // The whole reason this rung exists. Isolating mA, an arrow drawn 180° from
  // the real normal (or friction) from mB matches grade.ts branch (a).
  targets: 'third_law_pair_same_body',
  defaultBody: 'mA',
  params: [
    { key: 'mA', label: 'Top mass', kind: 'number', default: 2, min: 0.5, max: 15, step: 0.5, unit: 'kg' },
    { key: 'mB', label: 'Bottom mass', kind: 'number', default: 5, min: 0.5, max: 25, step: 0.5, unit: 'kg' },
    { key: 'push', label: 'Push on the bottom', kind: 'number', default: 24, min: 0, max: 120, step: 1, unit: 'N' },
    { key: 'mu_ab', label: 'Roughness between them', kind: 'number', default: 0.5, min: 0, max: 1.2, step: 0.05 },
  ],
  buildScene(p) {
    const mA = num(p, 'mA', 2), mB = num(p, 'mB', 5);
    const push = num(p, 'push', 24);
    const muAB = num(p, 'mu_ab', 0.5);
    const B = block('mB', mB, 1.4, 0.25, 1.0, 0.5);
    const A = block('mA', mA, 1.4, 0.68, 0.62, 0.36);
    return {
      bodies: [B, A],
      contacts: [
        { id: 'cAB', bodyA: 'mA', bodyB: 'mB', normalDeg: 90, mu_s: muAB, mu_k: r3(muAB * 0.75), slidingSign: 0 },
        onGround('cBg', 'mB', 0.2, push > 0 ? 1 : 0),
      ],
      strings: [],
      applied: push > 0 ? [{ id: 'F1', body: 'mB', from: WORLD.hand, mag: push, angleDeg: 0, label: 'push' }] : [],
      g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'Two blocks, one on the other, and your hand pushes only the BOTTOM one. Yet the top one moves too. Something must be pushing it — what?', cta: 'Isolate the top block' },
    { say: 'Nothing touches the top block except the block underneath it. So everything that acts on it has to arrive through that one contact — the surface holds it up, and friction across that same surface is what drags it along. There is no hand on this block at all.', cta: 'So where does the partner go?' },
    { say: 'On the other body. The top block presses down on the bottom one exactly as hard as the bottom one holds it up — but that partner acts on the BOTTOM block, so it can never appear on this diagram. If both halves of a pair sat on one body they would cancel, and nothing would ever accelerate.', cta: 'Draw it' },
  ],
};

const twoBlocksInContact: MechanicsArchetype = {
  id: 'two-blocks-in-contact',
  title: 'Two blocks pushed together',
  summary: 'The classic contact-force pair — and the scene the cut tool was built for.',
  mode: 'fbd',
  // Same code as the stacked rung, horizontally instead of vertically — and
  // then the cut tool shows the pair cancelling, which is the payoff the
  // stacked rung cannot give. Sharing a code across two rungs is correct: they
  // attack one misconception from two directions.
  targets: 'third_law_pair_same_body',
  defaultBody: 'mA',
  params: [
    { key: 'mA', label: 'Front mass', kind: 'number', default: 2, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'mB', label: 'Back mass', kind: 'number', default: 3, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'push', label: 'Push', kind: 'number', default: 25, min: 0, max: 150, step: 1, unit: 'N' },
    { key: 'mu_s', label: 'Ground roughness μs', kind: 'number', default: 0, min: 0, max: 1.2, step: 0.05 },
  ],
  buildScene(p) {
    const mA = num(p, 'mA', 2), mB = num(p, 'mB', 3);
    const push = num(p, 'push', 25);
    const mu = num(p, 'mu_s', 0);
    const A = block('mA', mA, 1.0, 0.25, 0.7, 0.5);
    const B = block('mB', mB, 1.75, 0.25, 0.8, 0.5);
    return {
      bodies: [A, B],
      contacts: [
        // The normal on A from B points back along −x.
        { id: 'cAB', bodyA: 'mA', bodyB: 'mB', normalDeg: 180, mu_s: 0, mu_k: 0, slidingSign: 0 },
        onGround('cAg', 'mA', mu, push > 0 ? 1 : 0),
        onGround('cBg', 'mB', mu, push > 0 ? 1 : 0),
      ],
      strings: [],
      applied: [{ id: 'F1', body: 'mA', from: WORLD.hand, mag: push, angleDeg: 0, label: 'push' }],
      g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'You push the left block; both move together. Draw the diagram for the block you are pushing.', cta: 'Isolate it' },
    { say: 'Two things push it horizontally: your hand from behind, and the block in front pushing back. Both are real and both belong here. What does NOT belong is the forward push this block gives the one in front — that arrow lives on the front block’s diagram, never on this one.', cta: 'Now do both at once' },
    { say: 'Now the move that turns every connected-body problem into the same problem: draw a boundary around BOTH blocks and watch what the contact pair does.', cta: 'Cut the system' },
  ],
};

const stringOverPulley: MechanicsArchetype = {
  id: 'string-over-pulley',
  title: 'Table block, hanging mass',
  summary: 'Tension pulls, never pushes — and it is the same string on both sides.',
  mode: 'fbd',
  // `missing_tension` is the softer half of this rung; the sharp one is the
  // arrow drawn pushing the block away from the pulley, which grade.ts calls
  // out by name ("What would a string have to do to push something?").
  targets: 'tension_wrong_direction',
  defaultBody: 'm1',
  params: [
    { key: 'm1', label: 'Table mass', kind: 'number', default: 4, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'm2', label: 'Hanging mass', kind: 'number', default: 2, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'mu_s', label: 'Table roughness μs', kind: 'number', default: 0.2, min: 0, max: 1.2, step: 0.05 },
  ],
  buildScene(p) {
    const m1 = num(p, 'm1', 4), m2 = num(p, 'm2', 2);
    const mu = num(p, 'mu_s', 0.2);
    const table: Body = {
      id: 'table', shape: 'block', mass: 40, fixed: true,
      pos: { x: 1.2, y: 0.45 }, size: { w: 2.4, h: 0.9 }, label: 'table',
    };
    const b1 = block('m1', m1, 1.0, 1.12, 0.6, 0.44, { dofDeg: 0 });
    const pulley: Body = {
      id: 'p1', shape: 'pulley', mass: 0, fixed: true,
      pos: { x: 2.55, y: 1.05 }, radius: 0.15, label: 'pulley',
    };
    const b2 = block('m2', m2, 2.55, 0.45, 0.5, 0.4, { dofDeg: 270 });
    const sliding: -1 | 0 | 1 = m2 * G > mu * m1 * G ? 1 : 0;
    return {
      bodies: [table, b1, pulley, b2],
      contacts: [
        { id: 'c1', bodyA: 'm1', bodyB: 'table', normalDeg: 90, mu_s: mu, mu_k: r3(mu * 0.75), slidingSign: sliding },
      ],
      strings: [{ id: 's1', path: ['m1', 'p1', 'm2'], taut: true, massless: true, label: 'the string' }],
      applied: [], g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'A block on a table, tied over a pulley to a mass hanging in the air. The pulley is ideal — it changes the string’s direction and nothing else.', cta: 'Look at the block' },
    { say: 'The string is attached to the block, so it can only PULL — and it pulls along itself, toward the pulley. Ask yourself what a string would have to do in order to push something. It would have to be a rod.', cta: 'And the other end?' },
    { say: 'Same string, so the same tension, pulling the hanging mass UP while it pulls the block sideways. One string, one number, two directions — because tension always acts along the string, wherever the string happens to point. Draw the block first, then do the hanging mass.', cta: 'Draw it' },
  ],
};

const blockOnMovableWedge: MechanicsArchetype = {
  id: 'block-on-movable-wedge',
  title: 'A wedge that can slide too',
  summary: 'Draw the WEDGE’s diagram and the third-law partner finally has to land somewhere.',
  mode: 'fbd',
  // The omission on the OTHER body. `defaultBody` is the wedge, and
  // trueForcesFor emits the third-law reaction normal on a contact's bodyB
  // whenever bodyB is a real body — so leaving the block's push off the
  // wedge's diagram is a genuine `missing_normal`, not a hardcoded case.
  targets: 'missing_normal',
  defaultBody: 'w1',
  params: [
    { key: 'theta', label: 'Incline angle', kind: 'number', default: 30, min: 5, max: 60, step: 1, unit: '°' },
    { key: 'mass', label: 'Block mass', kind: 'number', default: 2, min: 0.5, max: 15, step: 0.5, unit: 'kg' },
    { key: 'wedgeMass', label: 'Wedge mass', kind: 'number', default: 6, min: 1, max: 40, step: 0.5, unit: 'kg' },
  ],
  buildScene(p) {
    const theta = num(p, 'theta', 30);
    const wd = wedge('w1', theta, 2.4, 0.4, num(p, 'wedgeMass', 6), false);
    const m1 = seat('m1', num(p, 'mass', 2), wd, 0.4);
    return {
      bodies: [wd, m1],
      contacts: [
        onWedge('c1', 'm1', 'w1', theta, 0),
        { id: 'c2', bodyA: 'w1', bodyB: WORLD.ground, normalDeg: 90, mu_s: 0, mu_k: 0, slidingSign: -1 },
      ],
      strings: [], applied: [], g: G, frame: inertial,
    };
  },
  defaultSteps: [
    { say: 'Same incline — except now the wedge itself is on a frictionless floor. Let the block go and the wedge recoils.', cta: 'Why does it recoil?' },
    { say: 'Because the block pushes on the wedge just as hard as the wedge pushes on the block. That partner force has been there all along; you have simply never had to draw it, because until now the wedge was bolted down.', cta: 'Isolate the wedge' },
    { say: 'So list what touches the wedge, the same way you listed it for the block: the Earth pulls it down, the floor pushes it up, and the block presses on its slope — perpendicular to that slope, not straight down. Leave that last one out and the wedge has no reason to move at all.', cta: 'Draw the wedge' },
  ],
};

const liftAccelerating: MechanicsArchetype = {
  id: 'lift-accelerating',
  title: 'Inside an accelerating lift',
  summary: 'THE punchline: the same scene, graded in two frames, has opposite right answers.',
  mode: 'fbd',
  // The `frame` param DEFAULTS to 'accelerating', so the default exercise is
  // the omission: in the lift's frame the pseudo-force is compulsory and
  // leaving it out is the error. Flip the param to 'inertial' and the same
  // scene grades the opposite way (`pseudo_in_inertial_frame`) — which is the
  // punchline, and why the pair of codes cannot both be declared here.
  targets: 'missing_pseudo_in_noninertial',
  defaultBody: 'p1',
  params: [
    { key: 'mass', label: 'Your mass', kind: 'number', default: 60, min: 20, max: 120, step: 1, unit: 'kg' },
    { key: 'accel', label: 'Lift acceleration', kind: 'number', default: 2, min: -6, max: 6, step: 0.5, unit: 'm s⁻²' },
    { key: 'frame', label: 'Draw the diagram in…', kind: 'select', default: 'accelerating',
      options: ['inertial', 'accelerating'] },
  ],
  buildScene(p) {
    const mass = num(p, 'mass', 60);
    const a = num(p, 'accel', 2);
    const kind = str(p, 'frame', 'accelerating');
    const floor: Body = {
      id: 'floor', shape: 'block', mass: 500, fixed: true,
      pos: { x: 1.2, y: 0.15 }, size: { w: 2.0, h: 0.3 }, label: 'lift floor',
    };
    const person = block('p1', mass, 1.2, 0.75, 0.5, 0.9, { dofDeg: 90 });
    const frame: ReferenceFrame = kind === 'inertial'
      ? { kind: 'inertial' }
      : { kind: 'accelerating', a: { x: 0, y: a } };
    return {
      bodies: [floor, person],
      // Frictionless on purpose: nobody slides sideways in a lift, and a
      // static-friction unknown here would make the scene under-determined and
      // add a fourth arrow that has nothing to do with the lesson.
      contacts: [{ id: 'c1', bodyA: 'p1', bodyB: 'floor', normalDeg: 90, mu_s: 0, mu_k: 0, slidingSign: 0 }],
      strings: [], applied: [], g: G, frame,
    };
  },
  defaultSteps: [
    { say: 'You are standing in a lift that is accelerating. Nothing about the lift has changed — only where YOU are standing to describe it.', cta: 'Set the frame' },
    { say: 'Ground frame: two forces, weight and the floor, and they do not balance — that imbalance is what accelerates you. Lift frame: you are not accelerating at all, so a third force must appear to make the sum zero. Same lift. Opposite correct diagrams.', cta: 'Draw the diagram' },
    { say: 'Now switch the frame and draw it again. If the same diagram passes both times, one of them was wrong.', cta: 'Switch and redraw' },
  ],
};

const rotatingDrum: MechanicsArchetype = {
  id: 'rotating-drum',
  title: 'The rotating drum',
  summary: 'Centrifugal force: a grading ERROR in the ground frame, REQUIRED in the drum’s.',
  mode: 'fbd',
  // The mirror image of the lift: here `frame` DEFAULTS to 'inertial', so the
  // default exercise is the invention, not the omission. grade.ts has a
  // dedicated branch for an outward arrow drawn in a ground frame, separate
  // from the generic pseudo-force one, because this is the specific wrong
  // answer almost every student gives.
  targets: 'ghost_centrifugal',
  defaultBody: 'p1',
  params: [
    { key: 'radius', label: 'Drum radius', kind: 'number', default: 1.5, min: 0.8, max: 3, step: 0.1, unit: 'm' },
    { key: 'omega', label: 'Spin rate', kind: 'number', default: 3, min: 0.5, max: 8, step: 0.1, unit: 'rad s⁻¹' },
    { key: 'mass', label: 'Rider mass', kind: 'number', default: 55, min: 20, max: 110, step: 1, unit: 'kg' },
    { key: 'mu_s', label: 'Wall roughness μs', kind: 'number', default: 0.6, min: 0.1, max: 1.2, step: 0.05 },
    { key: 'frame', label: 'Draw the diagram in…', kind: 'select', default: 'inertial',
      options: ['inertial', 'rotating'] },
  ],
  buildScene(p) {
    const R = num(p, 'radius', 1.5);
    const omega = num(p, 'omega', 3);
    const mass = num(p, 'mass', 55);
    const mu = num(p, 'mu_s', 0.6);
    const kind = str(p, 'frame', 'inertial');
    const centre = { x: r3(R + 0.4), y: r3(R + 0.3) };
    const drum: Body = {
      id: 'drum', shape: 'sphere', mass: 500, fixed: true,
      pos: centre, radius: R, label: 'drum wall',
    };
    // The rider stands against the inside of the wall on the +x side, so the
    // wall's normal on them points at 180° — straight at the axis. That is the
    // whole point: the ONLY inward force is the normal.
    const rider = block('p1', mass, r3(centre.x + R - 0.24), centre.y, 0.42, 0.95, { dofDeg: 180 });
    const frame: ReferenceFrame = kind === 'rotating'
      ? { kind: 'rotating', omega, centre }
      : { kind: 'inertial' };
    return {
      bodies: [drum, rider],
      contacts: [{ id: 'c1', bodyA: 'p1', bodyB: 'drum', normalDeg: 180, mu_s: mu, mu_k: r3(mu * 0.75), slidingSign: 0 }],
      strings: [], applied: [], g: G, frame,
    };
  },
  defaultSteps: [
    { say: 'A fairground drum spins, the floor drops away, and the riders stay pinned to the wall. Almost everyone draws an outward force holding them there.', cta: 'Why is that wrong?' },
    { say: 'Watch the frame badge — it says ground frame. From out here the rider is going in a circle, and going in a circle needs a force pointing INWARD, at the axis. The wall supplies exactly that. Nothing is standing outside the rider to push them outward, so no outward arrow belongs here. The wall is rough, and that friction is what holds them up now the floor has gone.', cta: 'Then why do they feel thrown out?' },
    { say: 'Switch to the drum’s own frame and find out. Riding round with the drum, the rider is not moving at all — so the forces on them must add to nothing, and the only way to get that is to put the outward term in. Same rider, same wall, opposite correct diagrams. That arrow was never right or wrong by itself; the frame decides.', cta: 'Draw the diagram' },
  ],
};

// ── The library ──────────────────────────────────────────────────────────────

export const FBD_ARCHETYPES: Record<string, MechanicsArchetype> = {
  'single-body-ground': singleBodyGround,
  'body-on-incline': bodyOnIncline,
  'incline-with-friction': inclineWithFriction,
  'applied-at-angle': appliedAtAngle,
  'two-stacked-blocks': twoStackedBlocks,
  'two-blocks-in-contact': twoBlocksInContact,
  'string-over-pulley': stringOverPulley,
  'block-on-movable-wedge': blockOnMovableWedge,
  'lift-accelerating': liftAccelerating,
  'rotating-drum': rotatingDrum,
};

/** Ordered for the admin picker — this is the teaching ladder, not an alphabet. */
export const FBD_ARCHETYPE_ORDER: string[] = [
  'single-body-ground',
  'body-on-incline',
  'incline-with-friction',
  'applied-at-angle',
  'two-stacked-blocks',
  'two-blocks-in-contact',
  'string-over-pulley',
  'block-on-movable-wedge',
  'lift-accelerating',
  'rotating-drum',
];

/** The default scene when a block names no archetype at all. */
export const FBD_FALLBACK = 'single-body-ground';

export function buildFbdScene(archetypeId: string | undefined, params: Params): Scene | null {
  const def = FBD_ARCHETYPES[archetypeId ?? FBD_FALLBACK];
  return def ? def.buildScene(params) : null;
}
