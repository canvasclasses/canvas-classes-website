/*
 * mechanics-bench/archetypes.rotation.ts — Unit 4: rotation.
 * ─────────────────────────────────────────────────────────────────────────────
 * Sibling of `archetypes.energy.ts`; same contract, same rules. The shared
 * Phase-2 kit lives at `energy/kit/phase2.ts` — see its header for why it sits
 * under `energy/` rather than beside the frozen E1 `lib/`.
 *
 * Every `buildScene` is PURE and returns a `Phase2Spec`, so
 * `scripts/verify-mechanics-phase2.mjs` builds each rung at both ends of every
 * slider with a plain node run, and `scripts/audit-sim-archetypes.mjs` scores
 * it with no special case.
 *
 * ⚠ EVERY RUNG IS `mode: 'solve'` — a placeholder. See the same note in
 * `archetypes.energy.ts`: the block's `mode` union is frozen and Phase 2 does
 * not own it, so a `'rotation'` mode is what actually wires these to a page.
 *
 * ── THE LADDER ───────────────────────────────────────────────────────────────
 *  MoI Racer     shape decides (flagship) → load the dice → the energy split
 *  Torque Bench  balance is torques, not masses → and the angle you dropped
 *  Rolling       the contact point is at rest → the whole rim, top does 2v
 *  Chair         L holds, KE does not (flagship) → so where did it come from
 */

import type {
  Phase2Archetype, Phase2ArchetypeMap, MoiSpec, TorqueSpec, RollingSpec, ChairSpec,
} from './energy/kit/phase2';
import { num, bool, r4 } from './energy/kit/phase2';
import type { RollShape } from './rotation/lib/inertia';

const G = 9.8;

const ALL_SHAPES: RollShape[] = ['sphere', 'disc', 'hollow-sphere', 'hoop'];

// ═══ 1. MOMENT-OF-INERTIA RACER ══════════════════════════════════════════════

const moiRace: Phase2Archetype = {
  id: 'moi-race-shapes',
  title: 'The race down the ramp',
  summary: 'FLAGSHIP. Four bodies, one slope, and an order you cannot change.',
  family: 'rotation',
  mode: 'solve',
  targets: 'heavier_rolls_faster',
  params: [
    { key: 'theta', label: 'Ramp angle', kind: 'number', default: 20, min: 5, max: 45, step: 1, unit: '°' },
    { key: 'distance', label: 'Course length', kind: 'number', default: 2, min: 0.5, max: 6, step: 0.1, unit: 'm' },
    { key: 'mSphere', label: 'Sphere mass', kind: 'number', default: 1, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
    { key: 'mDisc', label: 'Disc mass', kind: 'number', default: 1, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
    { key: 'mShell', label: 'Hollow-sphere mass', kind: 'number', default: 1, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
    { key: 'mHoop', label: 'Hoop mass', kind: 'number', default: 1, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
    { key: 'slider', label: 'Race a frictionless slider too', kind: 'boolean', default: false },
  ],
  predict: {
    prompt: 'A solid sphere, a solid disc, a hollow sphere and a hoop are released together from the top of a ramp. Which reaches the bottom first?',
    options: [
      'The heaviest one',
      'The one with the biggest radius',
      'The solid sphere, whatever the masses and sizes are',
      'They all arrive together — gravity is the same for all of them',
    ],
    answer_index: 2,
    per_option: [
      'Set the masses yourself before you run it — make the sphere ten times the hoop, or the other way round. Every term in mg sin θ − f = ma and in f·r = Iα carries an m, so it divides out and the mass never reaches the answer.',
      'r divides out too. It appears once in the torque f·r and twice inside I = k·m·r², and the rolling condition α = a/r cancels the difference exactly. A marble ties with a cannonball.',
      'Right — and it is the sphere for one reason only: its mass sits closest to its axis, so k = I/mr² is the smallest of the four at 2/5. a = g sin θ/(1 + k), so the smallest k wins.',
      'They would if they were sliding. Rolling means each one has to spend some of the drop on spinning, and they do not all spend the same share — which is exactly what k measures.',
    ],
    reveal: 'a = g sin θ/(1 + k), with k = 2/5, 1/2, 2/3, 1 for sphere, disc, hollow sphere, hoop. Nothing else survives the algebra: not the mass, not the radius, not the material. Where the mass sits relative to the axis is the whole race.',
  },
  defaultSteps: [
    { say: 'Four bodies at the top of a ramp. Set the ramp angle and the course length, then load the dice however you like — give the sphere ten times the hoop’s mass if you want to.', cta: 'Load the dice' },
    { say: 'Commit to a finishing order before anything is released. Almost everyone picks by mass or by size the first time.', cta: 'Lock in my prediction' },
    { say: 'Release them. Watch the order, then go back and change the masses to try to break it.', cta: 'Release' },
    { say: 'When you have failed to break it: the reason is that mass and radius both divide out of a = g sin θ/(1 + k). The only survivor is k, which is a number about SHAPE.', cta: 'Show me the algebra' },
  ],
  buildScene(p): MoiSpec {
    return {
      bench: 'moi',
      shapes: ALL_SHAPES,
      thetaDeg: num(p, 'theta', 20),
      distance: num(p, 'distance', 2),
      masses: {
        sphere: num(p, 'mSphere', 1),
        disc: num(p, 'mDisc', 1),
        'hollow-sphere': num(p, 'mShell', 1),
        hoop: num(p, 'mHoop', 1),
      },
      radii: { sphere: 0.12, disc: 0.12, 'hollow-sphere': 0.12, hoop: 0.12 },
      withSlider: bool(p, 'slider', false),
      g: G,
    };
  },
};

const moiLoadedDice: Phase2Archetype = {
  id: 'moi-race-loaded-dice',
  title: 'Try to rig it',
  summary: 'Give the hoop any radius you like. It still loses.',
  family: 'rotation',
  mode: 'solve',
  targets: 'bigger_radius_rolls_faster',
  params: [
    { key: 'theta', label: 'Ramp angle', kind: 'number', default: 25, min: 5, max: 45, step: 1, unit: '°' },
    { key: 'distance', label: 'Course length', kind: 'number', default: 2.5, min: 0.5, max: 6, step: 0.1, unit: 'm' },
    { key: 'rSphere', label: 'Sphere radius', kind: 'number', default: 0.06, min: 0.03, max: 0.3, step: 0.01, unit: 'm' },
    { key: 'rHoop', label: 'Hoop radius', kind: 'number', default: 0.24, min: 0.03, max: 0.3, step: 0.01, unit: 'm' },
    { key: 'mSphere', label: 'Sphere mass', kind: 'number', default: 4, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
    { key: 'mHoop', label: 'Hoop mass', kind: 'number', default: 0.4, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
  ],
  predict: {
    prompt: 'A small heavy sphere (6 cm, 4 kg) races a big light hoop (24 cm, 0.4 kg). The hoop has four times the radius and a tenth of the mass. Who wins?',
    options: [
      'The hoop — a bigger wheel covers ground faster',
      'The hoop — it is far lighter',
      'The sphere, by exactly the same margin as if they were identical',
      'Too close to call without the numbers',
    ],
    answer_index: 2,
    per_option: [
      'Bigger wheels cover more ground per TURN, but they also turn more slowly for the same speed — the two cancel exactly. Drag the hoop’s radius across its whole range and watch its finishing time refuse to move.',
      'Lighter means less to accelerate AND less gravity pulling it down. Same cancellation, same non-effect.',
      'Right, and “exactly the same margin” is the part worth noticing. a_sphere/a_hoop = (1 + 1)/(1 + 2/5) = 1.4286, whatever you set the masses and radii to.',
      'It would be too close to call if mass and radius mattered. They do not, so it is decided before the race — which is the whole point.',
    ],
    reveal: 'Two identical-looking cans, one full of soup and one of set custard, race very differently — the liquid does not have to spin with the can, so its effective k is smaller and it wins. That is this experiment done in a kitchen.',
  },
  defaultSteps: [
    { say: 'Two bodies this time, and you get to rig the match: set each one’s mass and radius to whatever you think will make the hoop win.', cta: 'Rig the match' },
    { say: 'Commit to your rigged result before releasing them.', cta: 'Lock in my prediction' },
    { say: 'Release. Then try the other extreme — tiny hoop, huge sphere — and watch the finishing times not move at all.', cta: 'Release' },
    { say: 'Both sliders are live and neither is in the answer. That is what “mass and radius cancel” looks like when you are allowed to test it instead of being told it.', cta: 'Show the k table' },
  ],
  buildScene(p): MoiSpec {
    return {
      bench: 'moi',
      shapes: ['sphere', 'hoop'],
      thetaDeg: num(p, 'theta', 25),
      distance: num(p, 'distance', 2.5),
      masses: { sphere: num(p, 'mSphere', 4), hoop: num(p, 'mHoop', 0.4) },
      radii: { sphere: num(p, 'rSphere', 0.06), hoop: num(p, 'rHoop', 0.24) },
      withSlider: false,
      g: G,
    };
  },
};

const moiEnergySplit: Phase2Archetype = {
  id: 'moi-energy-split',
  title: 'Where the drop went',
  summary: 'A hoop spends half its energy on spinning. A sphere spends 2/7.',
  family: 'rotation',
  mode: 'solve',
  targets: 'rolling_energy_all_translational',
  params: [
    { key: 'theta', label: 'Ramp angle', kind: 'number', default: 30, min: 5, max: 45, step: 1, unit: '°' },
    { key: 'distance', label: 'Course length', kind: 'number', default: 2, min: 0.5, max: 6, step: 0.1, unit: 'm' },
    { key: 'mass', label: 'Mass (all four)', kind: 'number', default: 1, min: 0.1, max: 10, step: 0.1, unit: 'kg' },
    { key: 'slider', label: 'Race a frictionless slider too', kind: 'boolean', default: true },
  ],
  predict: {
    prompt: 'A block slides down a smooth ramp and a hoop rolls down the same ramp. Both drop 1 m. What is the hoop’s speed at the bottom, as a fraction of the block’s?',
    options: [
      'The same — they both dropped 1 m',
      'About 71% of it — 1/√2',
      'Half of it',
      'Faster — the hoop has rotation as well as motion',
    ],
    answer_index: 1,
    per_option: [
      'Both gained the same mgh — but the hoop had to buy two things with it. The energy bar splits in two and only half of it is speed.',
      'Right: mgh = ½mv²(1 + k), so v = √(2gh/(1+k)). For a hoop k = 1, so v is 1/√2 = 0.707 of the slider’s. Every joule the hoop spent on spinning is a joule it did not spend on going.',
      'Half would be right if the ENERGY split gave half the speed — but energy goes as v², so half the energy is 1/√2 of the speed, not half.',
      'Having rotation as well is precisely the problem: the same mgh now has to pay for two things instead of one, so there is less left for speed.',
    ],
    reveal: 'This is the MoI race seen from the energy side, and it is the same k. Turn the slider on and race it against the four: it wins every time, because it is the only one with nothing to pay for.',
  },
  defaultSteps: [
    { say: 'Same ramp, but now the bars matter more than the finish line. Every body starts with the same mgh — the question is how it gets spent.', cta: 'Set up the ramp' },
    { say: 'Add a frictionless slider to the race. Predict how its finishing speed compares with the hoop’s.', cta: 'Lock in my prediction' },
    { say: 'Release. Read each body’s energy bar: the lower part is going somewhere, the upper part is going round.', cta: 'Release' },
    { say: 'The two shares are 1/(1+k) and k/(1+k) — the same k that set the acceleration. One number, two consequences, which is why the sim shows both on one screen.', cta: 'Show the shares' },
  ],
  buildScene(p): MoiSpec {
    const m = num(p, 'mass', 1);
    return {
      bench: 'moi',
      shapes: ALL_SHAPES,
      thetaDeg: num(p, 'theta', 30),
      distance: num(p, 'distance', 2),
      masses: { sphere: m, disc: m, 'hollow-sphere': m, hoop: m },
      radii: { sphere: 0.12, disc: 0.12, 'hollow-sphere': 0.12, hoop: 0.12 },
      withSlider: bool(p, 'slider', true),
      g: G,
    };
  },
};

// ═══ 2. TORQUE & BALANCE BENCH ═══════════════════════════════════════════════

const torqueBeam: Phase2Archetype = {
  id: 'torque-balance-beam',
  title: 'The see-saw that is not a scale',
  summary: 'Balance compares products, not weights. Drag the masses and find out.',
  family: 'rotation',
  mode: 'solve',
  targets: 'balance_means_equal_masses',
  params: [
    { key: 'beam', label: 'Beam length', kind: 'number', default: 2, min: 0.8, max: 4, step: 0.1, unit: 'm' },
    { key: 'pivot', label: 'Pivot position', kind: 'number', default: 1, min: 0.1, max: 3.9, step: 0.05, unit: 'm' },
    { key: 'm1', label: 'Left mass', kind: 'number', default: 3, min: 0.2, max: 20, step: 0.1, unit: 'kg' },
    { key: 'x1', label: 'Left position', kind: 'number', default: 0.6, min: 0, max: 4, step: 0.05, unit: 'm' },
    { key: 'm2', label: 'Right mass', kind: 'number', default: 2, min: 0.2, max: 20, step: 0.1, unit: 'kg' },
    { key: 'x2', label: 'Right position', kind: 'number', default: 1.6, min: 0, max: 4, step: 0.05, unit: 'm' },
    { key: 'beamMass', label: 'Beam’s own mass', kind: 'number', default: 0, min: 0, max: 10, step: 0.1, unit: 'kg' },
  ],
  predict: {
    prompt: 'A 3 kg mass hangs 40 cm to the left of the pivot. Where must a 2 kg mass hang on the right to balance it?',
    options: [
      '40 cm — the same distance',
      '60 cm — further out, because it is lighter',
      '27 cm — closer in, because 2 kg is less',
      'It cannot balance; the masses are different',
    ],
    answer_index: 1,
    per_option: [
      'Same distance would balance only if the masses were the same. 3 × 0.4 = 1.2 on the left; 2 × 0.4 = 0.8 on the right — the left wins and the beam tips.',
      'Right: 3 × 0.4 = 2 × 0.6, both 1.2 kg m. Lighter has to sit further out, which is why a child can lift a parent on a see-saw by moving to the very end.',
      'Backwards. Closer in gives the smaller mass an even smaller torque, so the beam tips harder the way it already was.',
      'Unequal masses balance all the time — a steelyard balance weighs a sack of grain against a single small counterweight by sliding it out along the arm.',
    ],
    reveal: 'The condition is Στ = 0, not Σm = 0. That is why the sim prints SIGNED torque terms that add to zero rather than a “balanced” light: the terms are the thing to learn, and the light is only their consequence.',
  },
  defaultSteps: [
    { say: 'A beam on a pivot, with two hanging masses. Drag either mass along the beam, and drag the pivot itself — nothing here is fixed for you.', cta: 'Arrange the beam' },
    { say: 'Set the left mass and its position, then predict where the right one has to hang.', cta: 'Lock in my prediction' },
    { say: 'Drag it there and watch the two torque terms in the ledger. Balance is those two numbers cancelling, and you can see them approach each other.', cta: 'Find the balance point' },
    { say: 'Now move the PIVOT instead, and leave the masses alone. There is a second balance point, and it is the weighted mean of the positions.', cta: 'Move the pivot' },
    { say: 'Last: give the beam its own mass. A real plank is not weightless, and it hangs at the beam’s centre — a third term that changes everything if the pivot is off-centre.', cta: 'Weigh the beam' },
  ],
  buildScene(p): TorqueSpec {
    const beam = num(p, 'beam', 2);
    const clamp = (v: number) => Math.min(Math.max(v, 0), beam);
    return {
      bench: 'torque',
      beamLength: beam,
      pivotX: r4(clamp(num(p, 'pivot', 1))),
      loads: [
        { id: 'L', x: r4(clamp(num(p, 'x1', 0.6))), mass: num(p, 'm1', 3), label: 'Left mass' },
        { id: 'R', x: r4(clamp(num(p, 'x2', 1.6))), mass: num(p, 'm2', 2), label: 'Right mass' },
      ],
      beamMass: num(p, 'beamMass', 0),
      g: G,
    };
  },
};

const torqueAngled: Phase2Archetype = {
  id: 'torque-angled-pull',
  title: 'The word everybody drops',
  summary: 'Force × PERPENDICULAR distance. Swing the pull and watch half of it vanish.',
  family: 'rotation',
  mode: 'solve',
  targets: 'torque_ignores_the_angle',
  params: [
    { key: 'beam', label: 'Beam length', kind: 'number', default: 2, min: 0.8, max: 4, step: 0.1, unit: 'm' },
    { key: 'pivot', label: 'Pivot position', kind: 'number', default: 1, min: 0.1, max: 3.9, step: 0.05, unit: 'm' },
    { key: 'force', label: 'Pull', kind: 'number', default: 20, min: 1, max: 80, step: 1, unit: 'N' },
    { key: 'angle', label: 'Pull direction', kind: 'number', default: 30, min: 0, max: 180, step: 1, unit: '°' },
    { key: 'xF', label: 'Where it is applied', kind: 'number', default: 1.5, min: 0, max: 4, step: 0.05, unit: 'm' },
    { key: 'm1', label: 'Counterweight', kind: 'number', default: 1, min: 0.2, max: 20, step: 0.1, unit: 'kg' },
    { key: 'x1', label: 'Counterweight position', kind: 'number', default: 0.2, min: 0, max: 4, step: 0.05, unit: 'm' },
  ],
  predict: {
    prompt: 'A 20 N pull acts 0.5 m from the pivot, straight up: that is 10 N m of torque. Now swing the same pull round to 30° from the beam, same force, same 0.5 m. What is the torque?',
    options: [
      'Still 10 N m — the force and the distance have not changed',
      '5 N m — half',
      '8.7 N m — 20 × 0.5 × cos 30°',
      'Zero — an angled pull cannot turn anything',
    ],
    answer_index: 1,
    per_option: [
      'Both those numbers are unchanged, and the torque still halves. What changed is the only distance that counts: the PERPENDICULAR one, from the pivot to the line of the force. Drag the angle and watch that dashed line shrink.',
      'Right. τ = F·r·sin φ = 20 × 0.5 × sin 30° = 5 N m. The perpendicular distance dropped from 0.5 m to 0.25 m, and it is drawn on the beam so you can measure it.',
      'cos is the component ALONG the beam — the part that pulls the beam through the pivot and turns nothing. sin is the part that acts across it, and that is the part that turns.',
      'An angled pull turns things perfectly well, just less efficiently. Only a pull exactly ALONG the beam does nothing at all — swing the angle to 0° and see.',
    ],
    reveal: 'Two equivalent readings, and it is worth being able to switch between them: either take the perpendicular COMPONENT of the force at the full distance, or take the full force at the perpendicular DISTANCE. Both give F·r·sin φ, and different problems make one of them much easier.',
  },
  defaultSteps: [
    { say: 'One counterweight and one pull. Drag the pull’s arrowhead round — you are setting both its size and its direction.', cta: 'Aim the pull' },
    { say: 'Start it perpendicular to the beam and note the torque. Then predict what happens at 30°.', cta: 'Lock in my prediction' },
    { say: 'Swing it to 30°. Watch the dashed perpendicular line from the pivot to the force’s line of action — that is the distance in the formula.', cta: 'Swing it' },
    { say: 'Now swing it all the way to 0°, straight along the beam. Full force, full distance, zero turning effect.', cta: 'Swing it flat' },
  ],
  buildScene(p): TorqueSpec {
    const beam = num(p, 'beam', 2);
    const clamp = (v: number) => Math.min(Math.max(v, 0), beam);
    return {
      bench: 'torque',
      beamLength: beam,
      pivotX: r4(clamp(num(p, 'pivot', 1))),
      loads: [
        { id: 'C', x: r4(clamp(num(p, 'x1', 0.2))), mass: num(p, 'm1', 1), label: 'Counterweight' },
        {
          id: 'F', x: r4(clamp(num(p, 'xF', 1.5))),
          forceN: num(p, 'force', 20), angleDeg: num(p, 'angle', 30), label: 'Pull',
        },
      ],
      beamMass: 0,
      g: G,
    };
  },
};

// ═══ 3. ROLLING vs SLIDING ═══════════════════════════════════════════════════

const rollingContact: Phase2Archetype = {
  id: 'rolling-contact-point',
  title: 'The part of the tyre standing still',
  summary: 'At the contact point of pure rolling, the velocity is exactly zero.',
  family: 'rotation',
  mode: 'solve',
  targets: 'contact_point_moves_with_the_wheel',
  params: [
    { key: 'v', label: 'Road speed', kind: 'number', default: 3, min: 0.5, max: 10, step: 0.1, unit: 'm/s' },
    { key: 'radius', label: 'Wheel radius', kind: 'number', default: 0.4, min: 0.1, max: 1, step: 0.05, unit: 'm' },
    { key: 'slip', label: 'Slip (0 = rolling)', kind: 'number', default: 0, min: -1, max: 1, step: 0.05 },
    { key: 'cycloid', label: 'Trace a point on the rim', kind: 'boolean', default: false },
  ],
  predict: {
    prompt: 'A car drives past you at 3 m/s. Its tyres are rolling without slipping. How fast is the bit of rubber actually touching the road moving, relative to the road?',
    options: [
      '3 m/s — the same as the car',
      '0 — it is momentarily at rest',
      '1.5 m/s — half the car’s speed',
      '6 m/s — twice, like the top of the wheel',
    ],
    answer_index: 1,
    per_option: [
      'The CENTRE of the wheel does 3 m/s. The contact point is being carried forward at 3 by the wheel and swung backwards at 3 by the spin, and the two cancel exactly.',
      'Right, and it is not an approximation. That is what “rolling without slipping” means, and it is why a rolling tyre leaves no skid mark and squeals only when it stops being true.',
      'There is no averaging here. The rim point’s velocity runs from 0 at the bottom to 2v at the top, and the bottom really is 0.',
      '2v is the TOP of the wheel. The bottom is the other extreme of the same range, and the two are as far apart as it is possible to be.',
    ],
    reveal: 'Which is why the contact patch is the only sharp part of a photograph of a moving wheel, and why the spokes near the road look still while the ones at the top are a blur. You have seen this evidence a thousand times.',
  },
  defaultSteps: [
    { say: 'A wheel and a road. Set the speed and the wheel size — nothing is moving yet, and the velocity arrows are not drawn yet either.', cta: 'Set the wheel up' },
    { say: 'Before any arrow appears: how fast is the rubber touching the road moving? Commit.', cta: 'Lock in my prediction' },
    { say: 'Now draw the arrows, one point at a time, round the whole rim. Watch what happens to the one at the bottom.', cta: 'Draw the rim arrows' },
    { say: 'Then break it. Slide the slip control away from zero — a locked wheel skidding, or a wheel spinning out — and watch the bottom arrow grow. Everything you know about tyres is in that one arrow.', cta: 'Break the rolling' },
  ],
  buildScene(p): RollingSpec {
    return {
      bench: 'rolling',
      v: num(p, 'v', 3),
      radius: num(p, 'radius', 0.4),
      slip: num(p, 'slip', 0),
      showCycloid: bool(p, 'cycloid', false),
    };
  },
};

const rollingRim: Phase2Archetype = {
  id: 'rolling-rim-speeds',
  title: 'Every speed at once',
  summary: 'The top does 2v, the centre does v, the bottom does nothing.',
  family: 'rotation',
  mode: 'solve',
  targets: 'top_of_the_wheel_moves_at_v',
  params: [
    { key: 'v', label: 'Road speed', kind: 'number', default: 4, min: 0.5, max: 10, step: 0.1, unit: 'm/s' },
    { key: 'radius', label: 'Wheel radius', kind: 'number', default: 0.35, min: 0.1, max: 1, step: 0.05, unit: 'm' },
    { key: 'slip', label: 'Slip (0 = rolling)', kind: 'number', default: 0, min: -1, max: 1, step: 0.05 },
    { key: 'cycloid', label: 'Trace a point on the rim', kind: 'boolean', default: true },
  ],
  predict: {
    prompt: 'The same car at 4 m/s. How fast is the TOP of the tyre moving relative to the road?',
    options: [
      '4 m/s — every part of a rigid wheel moves together',
      '8 m/s — twice the car’s speed',
      '2 m/s — half, because it is furthest from the road',
      'It depends on the wheel radius',
    ],
    answer_index: 1,
    per_option: [
      'A rigid body moving in a straight line has every point at the same speed. A rolling wheel is turning as well, so the spin adds at the top and subtracts at the bottom.',
      'Right: carried forward at v by the wheel, swung forward at another v by the spin. The top of every wheel on the road is doing twice the speed limit.',
      'It is furthest from the road, which makes the spin help rather than hinder — so more, not less.',
      'The radius sets how fast the wheel turns for a given road speed, and those two effects cancel exactly. A lorry wheel and a bicycle wheel at the same road speed both have tops doing 2v.',
    ],
    reveal: 'Turn on the trace: the path a rim point actually follows is a cycloid, with a sharp cusp every time it touches the road. A curve has a corner there precisely because the point stopped, turned round and set off again.',
  },
  defaultSteps: [
    { say: 'The same wheel, but now every point on the rim gets an arrow. Set the speed first.', cta: 'Set the speed' },
    { say: 'Commit to the speed of the TOP of the tyre before the arrows appear.', cta: 'Lock in my prediction' },
    { say: 'Draw them. The arrows form a fan that is longest at the top and vanishes at the bottom — and the centre sits exactly halfway between the two.', cta: 'Draw the arrows' },
    { say: 'Now trace the path of one marked point as the wheel rolls. The cusps are the instants it was the contact point.', cta: 'Trace the cycloid' },
  ],
  buildScene(p): RollingSpec {
    return {
      bench: 'rolling',
      v: num(p, 'v', 4),
      radius: num(p, 'radius', 0.35),
      slip: num(p, 'slip', 0),
      showCycloid: bool(p, 'cycloid', true),
    };
  },
};

// ═══ 4. ANGULAR MOMENTUM CHAIR ═══════════════════════════════════════════════

const chairPullIn: Phase2Archetype = {
  id: 'chair-pull-in',
  title: 'Pull your arms in',
  summary: 'FLAGSHIP. L is conserved. Kinetic energy is not — and it goes UP.',
  family: 'rotation',
  mode: 'solve',
  targets: 'l_conserved_means_ke_conserved',
  params: [
    { key: 'core', label: 'Person + chair I', kind: 'number', default: 2, min: 0.5, max: 8, step: 0.1, unit: 'kg m²' },
    { key: 'weight', label: 'Mass in each hand', kind: 'number', default: 3, min: 0.5, max: 10, step: 0.5, unit: 'kg' },
    { key: 'arm', label: 'Arms out', kind: 'number', default: 0.7, min: 0.3, max: 1, step: 0.01, unit: 'm' },
    { key: 'pulled', label: 'Arms in', kind: 'number', default: 0.28, min: 0.05, max: 0.9, step: 0.01, unit: 'm' },
    { key: 'omega', label: 'Starting spin', kind: 'number', default: 4, min: 0.5, max: 12, step: 0.5, unit: 'rad/s' },
  ],
  predict: {
    prompt: 'Spinning on a chair with weights out, you pull them in until your moment of inertia HALVES. Your spin rate doubles. What happens to your kinetic energy?',
    options: [
      'It halves — half the inertia',
      'It stays the same — energy is conserved',
      'It doubles',
      'It quadruples — ω is squared in ½Iω²',
    ],
    answer_index: 2,
    per_option: [
      'I halved, but ω doubled and KE goes as ω². ½ × (I/2) × (2ω)² = ½ × 2Iω²/2 — the two effects do not cancel, they leave a factor of 2.',
      'Energy IS conserved overall — but not the kinetic energy of the spin on its own, because you are putting work in. Something outside the spinning system supplied it: your arms.',
      'Right, and it is worth writing it as KE = L²/2I. With L pinned, halving I can only double the energy. Reducing I ALWAYS raises the kinetic energy, which is why pulling in feels like effort.',
      'Quadrupling would be right if I had stayed the same. It halved, which takes back one of the two factors: 4 × ½ = 2.',
    ],
    reveal: 'Two accounts, two rules. L = Iω is conserved because no external torque acts. KE = L²/2I is not conserved because I is not constant — and the difference is exactly the work your arms did dragging the weights inward against the pull needed to keep them circling.',
  },
  defaultSteps: [
    { say: 'A person on a spinning chair with a weight in each hand. Set the masses, the arm length and the starting spin — this is your setup.', cta: 'Set the chair up' },
    { say: 'You are about to pull the weights in far enough to halve the moment of inertia. Everyone predicts the spin correctly. Predict the ENERGY.', cta: 'Lock in my prediction' },
    { say: 'Pull them in. Read the two ledger rows: L, then KE. One of them did not move and the other did.', cta: 'Pull them in' },
    { say: 'Now do it in reverse: let the arms back out. The spin drops and the energy comes back out — you can feel this as the weights pulling your arms straight.', cta: 'Let them out' },
  ],
  buildScene(p): ChairSpec {
    return {
      bench: 'chair',
      coreInertia: num(p, 'core', 2),
      weightMass: num(p, 'weight', 3),
      armLength: num(p, 'arm', 0.7),
      omega0: num(p, 'omega', 4),
      pulledArm: num(p, 'pulled', 0.28),
    };
  },
};

const chairWhereFrom: Phase2Archetype = {
  id: 'chair-where-from',
  title: 'So where did it come from?',
  summary: 'The joules the spin gained are exactly the joules your arms supplied.',
  family: 'rotation',
  mode: 'solve',
  targets: 'spinning_faster_is_free',
  params: [
    { key: 'core', label: 'Person + chair I', kind: 'number', default: 2.5, min: 0.5, max: 8, step: 0.1, unit: 'kg m²' },
    { key: 'weight', label: 'Mass in each hand', kind: 'number', default: 4, min: 0.5, max: 10, step: 0.5, unit: 'kg' },
    { key: 'arm', label: 'Arms out', kind: 'number', default: 0.8, min: 0.3, max: 1, step: 0.01, unit: 'm' },
    { key: 'pulled', label: 'Arms in', kind: 'number', default: 0.2, min: 0.05, max: 0.9, step: 0.01, unit: 'm' },
    { key: 'omega', label: 'Starting spin', kind: 'number', default: 3, min: 0.5, max: 12, step: 0.5, unit: 'rad/s' },
  ],
  predict: {
    prompt: 'The kinetic energy of the spin went up. Energy is never created. Where did the extra joules come from?',
    options: [
      'From the angular momentum — it converted into energy',
      'From your arms: pulling the weights inward is work',
      'From the chair’s bearings',
      'Nowhere — rotational KE does not have to be conserved, so nothing is needed',
    ],
    answer_index: 1,
    per_option: [
      'Angular momentum and energy are different quantities in different units — kg m²/s against kg m²/s². One cannot turn into the other any more than a length can turn into a mass.',
      'Right. The weights are travelling in circles, so something must pull them inward; dragging them to a smaller radius means that inward pull acts over a distance, and force × distance is work. The sim prints that number, and it equals the KE increase to the last joule.',
      'The bearings only take energy OUT. A perfect chair would still show exactly this effect, which tells you the bearings are not the source.',
      'Not being conserved does not mean “appears from nowhere”. It means something outside the account put it in, and the whole point of this rung is to find out what.',
    ],
    reveal: 'The reverse tells the same story more convincingly: let the arms back out and the sim reports NEGATIVE work — the system gives the energy back to you, and you can feel it as the weights pulling your arms straight. A source that also takes returns is a source.',
  },
  defaultSteps: [
    { say: 'Same chair, one extra readout: the work. Set the arm positions so the inertia change is a big one.', cta: 'Set up a big pull' },
    { say: 'The kinetic energy is about to go up. Predict where the extra joules come from before you look.', cta: 'Lock in my prediction' },
    { say: 'Pull in, and compare two numbers: the rise in kinetic energy, and the work the ledger says you did. They are the same number.', cta: 'Pull in and compare' },
    { say: 'Now let the arms out. The work goes negative by exactly the same amount — energy returned, not destroyed. That symmetry is what makes the answer believable.', cta: 'Let them out' },
  ],
  buildScene(p): ChairSpec {
    return {
      bench: 'chair',
      coreInertia: num(p, 'core', 2.5),
      weightMass: num(p, 'weight', 4),
      armLength: num(p, 'arm', 0.8),
      omega0: num(p, 'omega', 3),
      pulledArm: num(p, 'pulled', 0.2),
    };
  },
};

// ── The library ──────────────────────────────────────────────────────────────

export const ROTATION_ARCHETYPE_ORDER = [
  'moi-race-shapes',
  'moi-race-loaded-dice',
  'moi-energy-split',
  'torque-balance-beam',
  'torque-angled-pull',
  'rolling-contact-point',
  'rolling-rim-speeds',
  'chair-pull-in',
  'chair-where-from',
] as const;

export const ROTATION_ARCHETYPES: Phase2ArchetypeMap = {
  'moi-race-shapes': moiRace,
  'moi-race-loaded-dice': moiLoadedDice,
  'moi-energy-split': moiEnergySplit,
  'torque-balance-beam': torqueBeam,
  'torque-angled-pull': torqueAngled,
  'rolling-contact-point': rollingContact,
  'rolling-rim-speeds': rollingRim,
  'chair-pull-in': chairPullIn,
  'chair-where-from': chairWhereFrom,
};
