/*
 * mechanics-bench/archetypes.energy.ts — Units 3 & 5: energy, collisions, orbits.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every energy / collision / spring / orbit
 * exercise on every page is a block naming one of these plus params. Same
 * contract as `archetypes.fbd.ts`, extended by `energy/kit/phase2.ts` with the
 * three things the Phase-1 pedagogy audit found missing everywhere: a NAMED
 * misconception per rung, PER-OPTION predict feedback, and a family tag.
 *
 * Every `buildScene` is PURE — no React, no DOM, no randomness — so
 * `scripts/verify-mechanics-phase2.mjs` constructs each one at both ends of
 * every slider and checks the physics with a plain node run. It returns a
 * `Phase2Spec`, not an E1 `Scene`; the name is kept so the standing auditor
 * (`scripts/audit-sim-archetypes.mjs`) scores these with no special case. See
 * the ⚠ in `energy/kit/phase2.ts`.
 *
 * ⚠ EVERY RUNG IS `mode: 'solve'`, AND THAT IS A PLACEHOLDER.
 * `MechanicsBenchBlock.mode` is the frozen union `'fbd' | 'pulley' | 'solve'`
 * and `MechanicsBench.tsx` routes all three to FBD Studio or Pulley Lab. Phase 2
 * owns neither file, so these archetypes are reachable through
 * `EnergyBench` / `RotationBench` directly but NOT yet through the block
 * renderer. Two new modes — `'energy'` and `'rotation'` — are what wires them
 * up; see the build report.
 *
 * CONVENTIONS (inherited from mechanics-bench/types.ts): x right, y UP, metres,
 * degrees CCW from +x, SI throughout.
 *
 * ── THE LADDERS ──────────────────────────────────────────────────────────────
 *  Energy Ledger   path → friction (flagship) → where it stops
 *  Roller Coaster  the loop-top condition → mass and friction
 *  Collisions      equal-mass elastic (flagship) → e → sticky → CoM → 2-D
 *  Spring          the area under F–x → a band where ½kx² fails
 *  Orbit           Newton's cannon (flagship) → escape → faster is HIGHER
 */

import type {
  Phase2Archetype, Phase2ArchetypeMap, LedgerSpec, CoasterSpec2,
  CollisionSpec, SpringSpec, OrbitSpec,
} from './energy/kit/phase2';
import { num, bool, r4 } from './energy/kit/phase2';
import type { TrackPoint } from './energy/lib/track';
import { EARTH } from './energy/lib/orbit';

const G = 9.8;

/** A drop of `drop` metres over `ramp` of horizontal run, then `flat` of level
 *  ground. The shape a student meets first, and the one every textbook draws. */
function rampTrack(drop: number, ramp: number, flat: number): TrackPoint[] {
  return [
    { x: 0, y: r4(drop) },
    { x: r4(ramp), y: 0 },
    { x: r4(ramp + flat), y: 0 },
  ];
}

// ═══ 1. ENERGY LEDGER ════════════════════════════════════════════════════════

const ledgerPath: Phase2Archetype = {
  id: 'energy-ledger-path',
  title: 'Two tracks, one answer',
  summary: 'A steep drop and a gentle one, ending at the same speed.',
  family: 'energy',
  mode: 'solve',
  targets: 'speed_depends_on_path',
  params: [
    { key: 'drop', label: 'Drop height', kind: 'number', default: 3, min: 0.5, max: 6, step: 0.1, unit: 'm' },
    { key: 'run', label: 'Total run', kind: 'number', default: 6, min: 2, max: 12, step: 0.5, unit: 'm' },
    { key: 'mass', label: 'Mass', kind: 'number', default: 2, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'v0', label: 'Push-off speed', kind: 'number', default: 0, min: 0, max: 8, step: 0.5, unit: 'm/s' },
  ],
  predict: {
    prompt: 'Same start height, same finish height — one track plunges then flattens, the other slopes gently all the way. Which block is going faster at the finish line?',
    options: [
      'The one down the steep track — it fell harder',
      'The one down the gentle track — it had longer to build up',
      'Exactly the same speed, but the steep one gets there first',
      'The same speed and the same time — the tracks are the same length',
    ],
    answer_index: 2,
    per_option: [
      'It feels right because the steep track LOOKS more violent. But “fell harder” is about acceleration, not about final speed — and both blocks fell the same 3 m. Watch the KE bars finish at exactly the same height.',
      'Longer contact with gravity is real, but so is a smaller pull along the track. The two cancel exactly: what gravity gives you is mgΔh, and Δh is the same either way.',
      'Exactly. Gravity is a bank that only asks how far you dropped, never which staircase you took. The steep track wins on TIME, which is a different race — and the reason the two get confused is that textbooks draw only one track.',
      'Same speed, yes — but not the same time, and not the same length. The steep track is shorter and the block spends less of the journey slow, so it arrives first.',
    ],
    reveal: 'Change in height sets the speed. Shape sets the timing. This is the whole reason energy methods are worth learning: you can answer “how fast” without ever touching the shape of the path.',
  },
  defaultSteps: [
    { say: 'Two blocks, two tracks, same start and same finish. Before anything moves, drag the middle control point of the near track wherever you like — this is your track, not a textbook’s.', cta: 'Shape the track' },
    { say: 'Now commit. Which block crosses the line faster? There is a real answer and most people get it wrong for a very reasonable reason.', cta: 'Lock in my prediction' },
    { say: 'Release both. Watch the KE bars, not the blocks — the bars are what the question was actually about.', cta: 'Release them' },
  ],
  buildScene(p): LedgerSpec {
    const drop = num(p, 'drop', 3);
    const run = num(p, 'run', 6);
    return {
      bench: 'ledger',
      track: rampTrack(drop, r4(run * 0.35), r4(run * 0.65)),
      compareTrack: [{ x: 0, y: r4(drop) }, { x: r4(run), y: 0 }],
      mass: num(p, 'mass', 2),
      mu: 0,
      v0: num(p, 'v0', 0),
      g: G,
      editable: true,
    };
  },
};

const ledgerFriction: Phase2Archetype = {
  id: 'energy-ledger-friction',
  title: 'The third bar',
  summary: 'FLAGSHIP. Friction does not lose energy — watch where it goes.',
  family: 'energy',
  mode: 'solve',
  targets: 'friction_destroys_energy',
  params: [
    { key: 'drop', label: 'Drop height', kind: 'number', default: 2.5, min: 0.5, max: 6, step: 0.1, unit: 'm' },
    { key: 'run', label: 'Total run', kind: 'number', default: 7, min: 2, max: 14, step: 0.5, unit: 'm' },
    { key: 'mass', label: 'Mass', kind: 'number', default: 3, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'mu', label: 'Friction μ', kind: 'number', default: 0.22, min: 0, max: 0.8, step: 0.01 },
    { key: 'v0', label: 'Push-off speed', kind: 'number', default: 0, min: 0, max: 8, step: 0.5, unit: 'm/s' },
  ],
  predict: {
    prompt: 'You are about to switch friction on. The block will clearly be slower at the bottom. What happens to the TOTAL of the three bars?',
    options: [
      'It drops — some energy is lost to friction',
      'It stays exactly level; a third bar grows by exactly what KE lost',
      'It stays level, but only because heat is not really energy',
      'It rises — friction adds heat on top of what was there',
    ],
    answer_index: 1,
    per_option: [
      'This is the sentence in every notebook, and it is the one to unlearn. Nothing left the system. Run it and watch the total bar: it does not move by a millijoule while KE collapses and heat climbs to meet it.',
      'Exactly — and “exactly” is the word that matters. The heat bar grows by μmgΔx, and that is precisely the KE that went missing. Not approximately, not mostly.',
      'Heat is measured in joules just like the other two, and it is real energy sitting in a warmed track. Slide down a rope and your hands can tell you how real. What makes it feel like a loss is that you cannot get it back as motion.',
      'Nothing is added — the drop supplied every joule at the start. Friction only decides how the same total gets shared out between motion and warmth.',
    ],
    reveal: 'Write it as an equation and it is just bookkeeping: KE + PE + heat = constant. The reason “energy is lost to friction” survives is that heat is invisible. Making it a bar you can watch is the whole point of this bench.',
  },
  defaultSteps: [
    { say: 'Start smooth. Drag the track into whatever shape you like, then release the block and watch two bars trade: PE falls, KE rises, the total holds level.', cta: 'Release it, smooth' },
    { say: 'Now the interesting bit. Turn friction up — but predict first, because this is where almost everyone says something they would not defend if asked twice.', cta: 'Commit, then add friction' },
    { say: 'Release it again. Do not watch the block. Watch the top of the stack: it should be a perfectly flat ceiling while everything below it moves.', cta: 'Release with friction' },
    { say: 'One last check. The heat bar should read exactly μmgΔx — friction charges you by the HORIZONTAL distance, not the distance along the slope, because N = mg cos θ and cos θ turns the slope length back into its shadow on the ground.', cta: 'Show me the number' },
  ],
  buildScene(p): LedgerSpec {
    const drop = num(p, 'drop', 2.5);
    const run = num(p, 'run', 7);
    return {
      bench: 'ledger',
      track: rampTrack(drop, r4(run * 0.4), r4(run * 0.6)),
      mass: num(p, 'mass', 3),
      mu: num(p, 'mu', 0.22),
      v0: num(p, 'v0', 0),
      g: G,
      editable: true,
    };
  },
};

const ledgerStops: Phase2Archetype = {
  id: 'energy-ledger-stops',
  title: 'How far before it stops?',
  summary: 'Heat is a quantity you can solve for — so it can answer a question.',
  family: 'energy',
  mode: 'solve',
  targets: 'heat_is_not_energy',
  params: [
    { key: 'run', label: 'Length of the flat', kind: 'number', default: 8, min: 2, max: 16, step: 0.5, unit: 'm' },
    { key: 'mass', label: 'Mass', kind: 'number', default: 2, min: 0.5, max: 20, step: 0.5, unit: 'kg' },
    { key: 'mu', label: 'Friction μ', kind: 'number', default: 0.3, min: 0.02, max: 0.9, step: 0.01 },
    { key: 'v0', label: 'Launch speed', kind: 'number', default: 6, min: 1, max: 12, step: 0.5, unit: 'm/s' },
  ],
  predict: {
    prompt: 'A 2 kg block is shoved along level ground at 6 m/s; μ = 0.3. Double the MASS and shove it at the same 6 m/s. How far does it slide now?',
    options: [
      'Half as far — it is heavier, so friction stops it sooner',
      'Twice as far — it has twice the energy',
      'Exactly the same distance',
      'It depends on the surface, so there is no single answer',
    ],
    answer_index: 2,
    per_option: [
      'Friction IS twice as big — but so is the kinetic energy you have to burn off. ½mv² and μmgd both carry the m, and it cancels: d = v²/2μg has no mass in it.',
      'Twice the energy, yes, and twice the friction force eating it. The two scale together exactly, so the distance does not budge.',
      'Right, and it is worth seeing why on the bars rather than in the algebra: doubling m doubles the KE bar AND doubles the rate the heat bar fills, so they meet in exactly the same place.',
      'The surface matters — μ is in the answer. But for a GIVEN surface the mass genuinely drops out, which is the surprising half.',
    ],
    reveal: 'Set ½mv² = μmgd and cancel: d = v²/2μg. This is the same cancellation that makes skid marks a speedometer — a crash investigator measures d and μ and reads off the speed, without ever knowing the car’s mass.',
  },
  defaultSteps: [
    { say: 'Flat ground, one shove, friction on. Everything the block has is kinetic energy, and there is only one place for it to go.', cta: 'Shove it' },
    { say: 'It stops when the heat bar has eaten the whole KE bar. So the stopping distance is the solution of ½mv² = μmgd — an equation you can now watch balance.', cta: 'Commit a prediction' },
    { say: 'Change the mass and run it again. Then change μ. One of those moves the answer and one does not.', cta: 'Test both' },
  ],
  buildScene(p): LedgerSpec {
    const run = num(p, 'run', 8);
    return {
      bench: 'ledger',
      track: [{ x: 0, y: 0 }, { x: r4(run), y: 0 }],
      mass: num(p, 'mass', 2),
      mu: num(p, 'mu', 0.3),
      v0: num(p, 'v0', 6),
      g: G,
      editable: true,
    };
  },
};

// ═══ 2. ROLLER-COASTER DESIGNER ══════════════════════════════════════════════

const coasterCritical: Phase2Archetype = {
  id: 'coaster-loop-critical',
  title: 'Design the loop',
  summary: 'Drop the release height until it fails — and find 2½ radii.',
  family: 'energy',
  mode: 'solve',
  targets: 'loop_top_only_needs_to_arrive',
  params: [
    { key: 'loopR', label: 'Loop radius', kind: 'number', default: 2, min: 0.5, max: 5, step: 0.1, unit: 'm' },
    { key: 'releaseH', label: 'Release height', kind: 'number', default: 5.4, min: 0.5, max: 16, step: 0.1, unit: 'm' },
    { key: 'runIn', label: 'Run-in length', kind: 'number', default: 3, min: 0, max: 12, step: 0.5, unit: 'm' },
    { key: 'mass', label: 'Car mass', kind: 'number', default: 400, min: 50, max: 2000, step: 10, unit: 'kg' },
  ],
  predict: {
    prompt: 'The loop is 2 m in radius, so its top is 4 m up. From what height must the car be released to get round — with no friction?',
    options: [
      'Anything above 4 m — it just has to reach the top',
      'Exactly 4 m — arriving with v = 0 is enough',
      '5 m — two and a half radii',
      '8 m — twice the loop height, to be safe',
    ],
    answer_index: 2,
    per_option: [
      '“Just reach the top” is the trap this whole rung exists for. At 4.1 m the car does arrive at the top — as a falling object, having left the rails somewhere on the way up. Drag the release height to 4.1 and watch where the track lets go.',
      'At exactly 4 m it arrives with v = 0, and a car sitting still at the top of a loop is a car with nothing holding it in a circle. Gravity alone would need v² = gr, and zero is not that.',
      'Exactly: 2.5r. Energy gives v²_top = 2g(h − 2r); the loop demands v²_top ≥ gr; put them together and the 2r + r/2 falls out. The extra half-radius is what buys the speed the circle needs.',
      'Safe, but not the physics. Doubling it wastes a lot of hill — and more importantly it hides the condition, which is a statement about SPEED at the top, not about height.',
    ],
    reveal: 'This is the Circular Arena’s critical-speed result arriving from the energy side. There, v² = gr came out of “the track can only push, so at the top N = 0 is the limit”. Here the same number comes out of a hill. Two routes, one answer — which is the argument for engines that share physics instead of each owning a copy.',
  },
  defaultSteps: [
    { say: 'You are designing the loop. Drag the release-height handle and the loop radius to whatever you like — the verdict panel will tell you what your design does, not what a textbook’s does.', cta: 'Set the design' },
    { say: 'Now find the edge. Lower the release height a little at a time until the verdict flips, and note where it flips.', cta: 'Commit a prediction first' },
    { say: 'Watch the normal-force plot as you do it. N is largest at the bottom and smallest at the top, and the design fails at the exact instant the smallest one reaches zero.', cta: 'Show the N plot' },
    { say: 'Last piece: turn on the run-in friction. The 2.5r rule was written for a smooth world; friction charges you μmgd on the way in, so the hill has to be taller by exactly μd.', cta: 'Add friction' },
  ],
  buildScene(p): CoasterSpec2 {
    return {
      bench: 'coaster',
      releaseH: num(p, 'releaseH', 5.4),
      loopR: num(p, 'loopR', 2),
      runIn: num(p, 'runIn', 3),
      mu: 0,
      mass: num(p, 'mass', 400),
      g: G,
    };
  },
};

const coasterMass: Phase2Archetype = {
  id: 'coaster-mass-and-friction',
  title: 'Does a full train need a bigger hill?',
  summary: 'Mass cancels out of the design and straight into the rails.',
  family: 'energy',
  mode: 'solve',
  targets: 'mass_changes_the_loop',
  params: [
    { key: 'loopR', label: 'Loop radius', kind: 'number', default: 2.5, min: 0.5, max: 5, step: 0.1, unit: 'm' },
    { key: 'releaseH', label: 'Release height', kind: 'number', default: 7, min: 0.5, max: 16, step: 0.1, unit: 'm' },
    { key: 'runIn', label: 'Run-in length', kind: 'number', default: 6, min: 0, max: 12, step: 0.5, unit: 'm' },
    { key: 'mu', label: 'Run-in friction μ', kind: 'number', default: 0.08, min: 0, max: 0.4, step: 0.01 },
    { key: 'mass', label: 'Car mass', kind: 'number', default: 600, min: 50, max: 2000, step: 10, unit: 'kg' },
  ],
  predict: {
    prompt: 'Your loop works with an empty car. Now fill it with passengers — triple the mass. What has to change?',
    options: [
      'The release height must go up — more mass, more to lift',
      'Nothing about the height; but the rails now take three times the force',
      'The release height can come DOWN — heavier things roll better',
      'The loop radius must shrink to compensate',
    ],
    answer_index: 1,
    per_option: [
      'Every term in the energy equation carries an m, so it divides straight out: h ≥ 2.5r + μd has no mass in it at all. Slide the mass across the whole range and watch the verdict refuse to change.',
      'Right — and this is why the question is worth asking. The PHYSICS of “does it get round” is mass-free, but the ENGINEERING is not: N at the bottom is 6mg at critical, so a full train loads the rails three times as hard. Same design, different steel.',
      'Nothing rolls better for being heavy here — there is no “better”, because the mass is not in the condition at all. That intuition comes from air resistance, which this model does not include.',
      'The radius is yours to choose, but it does not need to compensate for anything: mass never entered the condition, so there is nothing to compensate for.',
    ],
    reveal: 'Two different questions hide inside “will it work”. Whether it gets round is kinematics and is mass-free. Whether the track survives is dynamics and scales straight with mass — which is why the N readout is on this bench and not on the last one.',
  },
  defaultSteps: [
    { say: 'Same designer, one new control: the car’s mass. Before you touch it, decide what you expect the verdict to do.', cta: 'Commit a prediction' },
    { say: 'Now sweep the mass from an empty car to a full train and watch two numbers: the verdict, and the force on the rails at the bottom of the loop.', cta: 'Sweep the mass' },
    { say: 'Add the run-in friction. NOW mass still cancels — μmgd and mgh both carry it — but the required height climbs by μd, and that part is real.', cta: 'Add friction' },
  ],
  buildScene(p): CoasterSpec2 {
    return {
      bench: 'coaster',
      releaseH: num(p, 'releaseH', 7),
      loopR: num(p, 'loopR', 2.5),
      runIn: num(p, 'runIn', 6),
      mu: num(p, 'mu', 0.08),
      mass: num(p, 'mass', 600),
      g: G,
    };
  },
};

// ═══ 3. COLLISION STUDIO ═════════════════════════════════════════════════════

const collisionEqualElastic: Phase2Archetype = {
  id: 'collision-equal-elastic',
  title: 'The straight swap',
  summary: 'FLAGSHIP. Equal masses, elastic: the shooter stops dead.',
  family: 'energy',
  mode: 'solve',
  targets: 'equal_mass_elastic_both_move',
  params: [
    { key: 'm1', label: 'Shooter mass', kind: 'number', default: 1, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'm2', label: 'Target mass', kind: 'number', default: 1, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'u1', label: 'Shooter speed', kind: 'number', default: 5, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'u2', label: 'Target speed', kind: 'number', default: 0, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'e', label: 'Restitution e', kind: 'number', default: 1, min: 0, max: 1, step: 0.05 },
  ],
  predict: {
    prompt: 'One carrom striker hits an identical one, dead centre, and the collision is elastic. What do you see straight after?',
    options: [
      'Both slide forward at half the speed',
      'The striker stops dead; the other leaves at the full speed',
      'The striker bounces straight back; the other goes forward',
      'They stick and travel together',
    ],
    answer_index: 1,
    per_option: [
      'This keeps momentum (½ + ½ = 1) but it halves the kinetic energy — ½m(v/2)² twice is only half of ½mv². For an elastic hit BOTH books have to balance, and “share it” only balances one.',
      'Right, and it is the only answer that balances both books at once. Momentum needs v₁ + v₂ = u; energy needs v₁² + v₂² = u². The only solution with v₂ ≠ 0 is the swap.',
      'Bouncing back needs the target to be HEAVIER. Drag the target mass up and you will see exactly that appear — but with equal masses there is no backward solution.',
      'Sticking is the e = 0 answer, and it loses the most energy any collision can. Drag e down to 0 and watch this become true — then drag it back up.',
    ],
    reveal: 'Two conservation laws, two unknowns, one answer. Newton’s cradle is this result five times in a row, which is why the middle balls never move: each one is a shooter that stops dead.',
  },
  defaultSteps: [
    { say: 'Two pucks on an air table. Set the masses and the speeds yourself — drag the velocity arrows, or use the sliders. This is your collision.', cta: 'Set them up' },
    { say: 'Equal masses, target at rest, e = 1. Commit to what you will see BEFORE you let them touch.', cta: 'Lock in my prediction' },
    { say: 'Run it. Then read the two ledger rows: momentum before and after, kinetic energy before and after. Both have to hold, and only one arrangement does that.', cta: 'Run the collision' },
    { say: 'Now make the target heavier, then lighter, and watch the answer move continuously between “bounces back” and “barely slows down”. The swap is the exact middle of that family.', cta: 'Change the target mass' },
  ],
  buildScene(p): CollisionSpec {
    return {
      bench: 'collision', dim: 1,
      m1: num(p, 'm1', 1), m2: num(p, 'm2', 1),
      u1: num(p, 'u1', 5), u2: num(p, 'u2', 0),
      e: num(p, 'e', 1),
      r1: 0.22, r2: 0.22,
      comFrame: false,
    };
  },
};

const collisionRestitution: Phase2Archetype = {
  id: 'collision-restitution',
  title: 'Turn the energy down',
  summary: 'Momentum holds at every e. Kinetic energy only holds at e = 1.',
  family: 'energy',
  mode: 'solve',
  targets: 'ke_conserved_in_every_collision',
  params: [
    { key: 'm1', label: 'Body 1 mass', kind: 'number', default: 3, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'm2', label: 'Body 2 mass', kind: 'number', default: 5, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'u1', label: 'Body 1 speed', kind: 'number', default: 4, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'u2', label: 'Body 2 speed', kind: 'number', default: -2, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'e', label: 'Restitution e', kind: 'number', default: 0.6, min: 0, max: 1, step: 0.05 },
  ],
  predict: {
    prompt: 'You are about to drag e from 1 down to 0. Which of the two ledger rows moves?',
    options: [
      'Both — you are taking energy out, so momentum falls too',
      'Only the kinetic-energy row; momentum stays put at every value of e',
      'Only momentum; energy is always conserved',
      'Neither — e only changes the direction they go, not the totals',
    ],
    answer_index: 1,
    per_option: [
      'Momentum does not care what happens during the contact. It is conserved because the two forces on each other are a third-law pair, and that is true whether the pucks bounce, crumple or weld.',
      'Exactly. And the amount the KE row falls is not a mystery number: it is ½·μ_reduced·(1 − e²)·v_rel², which goes to zero at e = 1 and to the entire centre-of-mass kinetic energy at e = 0.',
      'Energy IS always conserved — but not always as KINETIC energy. What leaves this row goes into deformation, sound and heat, none of which are on the chart.',
      'e changes the totals in one book and not the other, which is the whole point of it existing as a separate number.',
    ],
    reveal: 'e is not a fudge factor. It is the ratio of separation speed to approach speed, measurable with a bouncing ball and a ruler — drop it from 1 m, measure the bounce height h, and e = √h.',
  },
  defaultSteps: [
    { say: 'Two bodies, unequal masses, closing head-on. Set the masses and the speeds — including making them both move, which is the case textbooks skip.', cta: 'Set them up' },
    { say: 'Before touching e, commit: which of the two ledger rows will move as you drag it?', cta: 'Lock in my prediction' },
    { say: 'Now drag e from 1 to 0 slowly and watch both rows at once. One of them is a flat line the whole way.', cta: 'Sweep e' },
  ],
  buildScene(p): CollisionSpec {
    return {
      bench: 'collision', dim: 1,
      m1: num(p, 'm1', 3), m2: num(p, 'm2', 5),
      u1: num(p, 'u1', 4), u2: num(p, 'u2', -2),
      e: num(p, 'e', 0.6),
      r1: 0.26, r2: 0.3,
      comFrame: false,
    };
  },
};

const collisionSticky: Phase2Archetype = {
  id: 'collision-perfectly-inelastic',
  title: 'When they stick',
  summary: 'The maximum possible energy loss — and momentum untouched.',
  family: 'energy',
  mode: 'solve',
  targets: 'momentum_lost_when_they_stick',
  params: [
    { key: 'm1', label: 'Body 1 mass', kind: 'number', default: 3, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'm2', label: 'Body 2 mass', kind: 'number', default: 5, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'u1', label: 'Body 1 speed', kind: 'number', default: 4, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'u2', label: 'Body 2 speed', kind: 'number', default: -2, min: -8, max: 8, step: 0.5, unit: 'm/s' },
  ],
  predict: {
    prompt: 'A 3 kg body at +4 m/s meets a 5 kg body at −2 m/s and they stick. What is the combined velocity?',
    options: [
      '+1 m/s — halfway between them',
      '+0.25 m/s — the centre-of-mass velocity',
      '−2 m/s — the heavier one wins',
      '0 — they cancel out',
    ],
    answer_index: 1,
    per_option: [
      'Halfway would be right if the masses were equal. They are not, so the heavier body pulls the answer toward itself: (3·4 + 5·(−2))/8 = 0.25, not 1.',
      'Right — and the reason it is the centre-of-mass velocity is not a coincidence. The CoM never accelerates without an external force, so whatever the two bodies do to each other, their CoM sails on. Sticking means they both end up ON it.',
      'The heavier one dominates but does not decide alone. 5 × 2 = 10 of backwards momentum against 3 × 4 = 12 of forwards momentum — forwards wins, narrowly.',
      'They would cancel only if the two momenta were equal and opposite. Here they are 12 and −10, so 2 kg m/s survives.',
    ],
    reveal: 'Sticking together is the maximum-loss case, and “maximum” has a precise meaning: after the collision there is no relative motion left, so the entire centre-of-mass kinetic energy — ½·μ_reduced·v_rel² — is gone. You cannot lose more than that without breaking momentum conservation.',
  },
  defaultSteps: [
    { say: 'Same two bodies, but now they will stick. Predict the combined velocity before you run it.', cta: 'Lock in my prediction' },
    { say: 'Run it, then check the momentum row: it has not moved. The KE row has fallen off a cliff. Two books, two rules.', cta: 'Run it' },
    { say: 'Now switch the view to the centre-of-mass frame. In that frame the answer is even simpler: both bodies come to a complete stop.', cta: 'Ride the CoM frame' },
  ],
  buildScene(p): CollisionSpec {
    return {
      bench: 'collision', dim: 1,
      m1: num(p, 'm1', 3), m2: num(p, 'm2', 5),
      u1: num(p, 'u1', 4), u2: num(p, 'u2', -2),
      e: 0,
      r1: 0.26, r2: 0.3,
      comFrame: false,
    };
  },
};

const collisionComFrame: Phase2Archetype = {
  id: 'collision-com-frame',
  title: 'Ride the centre of mass',
  summary: 'In the CoM frame every elastic collision is the same symmetric bounce.',
  family: 'energy',
  mode: 'solve',
  targets: 'com_frame_changes_the_physics',
  params: [
    { key: 'm1', label: 'Body 1 mass', kind: 'number', default: 2, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'm2', label: 'Body 2 mass', kind: 'number', default: 6, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'u1', label: 'Body 1 speed', kind: 'number', default: 6, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'u2', label: 'Body 2 speed', kind: 'number', default: 0, min: -8, max: 8, step: 0.5, unit: 'm/s' },
    { key: 'e', label: 'Restitution e', kind: 'number', default: 1, min: 0, max: 1, step: 0.05 },
    { key: 'com', label: 'Start in the CoM frame', kind: 'boolean', default: false },
  ],
  predict: {
    prompt: 'Watch the same elastic collision from a camera moving at the centre-of-mass velocity. What does it look like?',
    options: [
      'Messy — a moving camera makes it harder to read',
      'Both velocities simply reverse; nothing else changes',
      'Both bodies stop, then set off again',
      'The heavier one is unaffected and only the lighter one bounces',
    ],
    answer_index: 1,
    per_option: [
      'A moving camera USUALLY makes things harder. This one particular speed makes it easier, because it is the speed at which the total momentum reads zero — and zero is the simplest number to keep constant.',
      'Exactly. Total momentum is zero in this frame, so the two momenta are equal and opposite before AND after; elastic means the speeds are unchanged; the only arrangement left is a straight reversal of both.',
      'Stopping would destroy all the kinetic energy, which elastic collisions do not do. That is the e = 0 picture in this frame, and it is worth switching e to 0 to see it.',
      'In this frame the two are perfectly symmetric — equal and opposite momenta, both reversed. Neither is “unaffected”; the heavier one just moves more slowly, before and after.',
    ],
    reveal: 'This is the trick that makes 2-D collisions tractable. In the CoM frame the whole outcome is one angle: the pair comes in along a line and leaves along a rotated line, with both speeds untouched. Transform back to the ground and you get the messy-looking answer for free.',
  },
  defaultSteps: [
    { say: 'A light body running into a heavy one at rest, elastic. Watch it once from the ground.', cta: 'Run it in the ground frame' },
    { say: 'Now predict what the same event looks like from a camera moving at the centre-of-mass velocity — the speed at which the total momentum reads exactly zero.', cta: 'Lock in my prediction' },
    { say: 'Switch frames. The event has not changed; only the camera has. But one of the two views is dramatically easier to describe in words.', cta: 'Switch to the CoM frame' },
    { say: 'Last thing: drag e down while still in the CoM frame. The reversal shrinks smoothly until, at e = 0, both bodies simply stop. That is what “maximum energy loss” looks like from the right seat.', cta: 'Drag e down' },
  ],
  buildScene(p): CollisionSpec {
    return {
      bench: 'collision', dim: 1,
      m1: num(p, 'm1', 2), m2: num(p, 'm2', 6),
      u1: num(p, 'u1', 6), u2: num(p, 'u2', 0),
      e: num(p, 'e', 1),
      r1: 0.22, r2: 0.32,
      comFrame: bool(p, 'com', false),
    };
  },
};

const collision2d: Phase2Archetype = {
  id: 'collision-2d-carrom',
  title: 'The 90° rule',
  summary: 'Equal masses, elastic, off-centre — they always leave at a right angle.',
  family: 'energy',
  mode: 'solve',
  targets: 'com_frame_changes_the_physics',
  params: [
    { key: 'm1', label: 'Striker mass', kind: 'number', default: 1, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'm2', label: 'Target mass', kind: 'number', default: 1, min: 0.2, max: 10, step: 0.1, unit: 'kg' },
    { key: 'u1', label: 'Striker speed', kind: 'number', default: 6, min: 1, max: 10, step: 0.5, unit: 'm/s' },
    { key: 'b', label: 'Impact offset', kind: 'number', default: 0.18, min: 0, max: 0.44, step: 0.01, unit: 'm' },
    { key: 'e', label: 'Restitution e', kind: 'number', default: 1, min: 0, max: 1, step: 0.05 },
  ],
  predict: {
    prompt: 'A carrom striker clips an identical coin off-centre, elastically. What is the angle between the two paths afterwards?',
    options: [
      'It depends entirely on how off-centre the hit was',
      '90°, for every off-centre hit',
      '180° — they must separate along the same line',
      '45°, the same as the maximum-range angle',
    ],
    answer_index: 1,
    per_option: [
      'The two directions DO depend on the offset — but their SUM does not. Drag the offset across its whole range and watch the two arrows swing while the angle between them refuses to move.',
      'Right, and it comes out of the two conservation laws in one line. Momentum says p⃗ = p⃗₁ + p⃗₂; equal-mass elastic energy says p² = p₁² + p₂². Those two together are Pythagoras, and Pythagoras means a right angle.',
      '180° would mean they go in exactly opposite directions, which cannot conserve the forward momentum you started with.',
      '45° belongs to projectile range and has nothing to do with this. It is worth noticing how often a remembered number gets reached for before the physics.',
    ],
    reveal: 'Every carrom and pool player uses this without naming it. Make the masses unequal and the right angle breaks — try it — which tells you the 90° is a fact about EQUAL masses, not about collisions in general.',
  },
  defaultSteps: [
    { say: 'A striker heading for a stationary coin. Drag the aim line sideways to choose how off-centre the hit is — this is the one control that matters.', cta: 'Choose the offset' },
    { say: 'Commit to the angle between the two paths after the hit, for YOUR offset.', cta: 'Lock in my prediction' },
    { say: 'Fire. Then change the offset and fire again. And again. The two arrows swing all over the place and one number does not move at all.', cta: 'Fire' },
    { say: 'Now break it: make the target heavier. The right angle opens up or closes down, which is the proof that it was a statement about equal masses all along.', cta: 'Break the rule' },
  ],
  buildScene(p): CollisionSpec {
    return {
      bench: 'collision', dim: 2,
      m1: num(p, 'm1', 1), m2: num(p, 'm2', 1),
      u1: num(p, 'u1', 6), u2: 0, u2y: 0,
      e: num(p, 'e', 1),
      b: num(p, 'b', 0.18),
      r1: 0.22, r2: 0.22,
      comFrame: false,
    };
  },
};

// ═══ 4. SPRING BENCH ═════════════════════════════════════════════════════════

const springArea: Phase2Archetype = {
  id: 'spring-work-area',
  title: 'Work is the area',
  summary: 'A force that will not hold still cannot be multiplied.',
  family: 'energy',
  mode: 'solve',
  targets: 'work_is_force_times_distance_always',
  params: [
    { key: 'k', label: 'Spring constant k', kind: 'number', default: 200, min: 20, max: 800, step: 10, unit: 'N/m' },
    { key: 'xMax', label: 'Stretch limit', kind: 'number', default: 0.15, min: 0.04, max: 0.4, step: 0.01, unit: 'm' },
    { key: 'mass', label: 'Block mass', kind: 'number', default: 0.5, min: 0.1, max: 5, step: 0.1, unit: 'kg' },
    { key: 'v0', label: 'Block speed', kind: 'number', default: 3, min: 0.5, max: 8, step: 0.5, unit: 'm/s' },
  ],
  predict: {
    prompt: 'You stretch a spring by 10 cm. At full stretch it is pulling back with 20 N. How much work did you do?',
    options: [
      '2.0 J — force times distance',
      '1.0 J — half of that',
      '0.5 J',
      '200 J — k times x',
    ],
    answer_index: 1,
    per_option: [
      'This is F·d with the WRONG F. It charges every millimetre at the price of the very last one — but the first millimetre cost you nothing at all. Drag the handle out slowly and watch the force readout climb from zero.',
      'Right. The F–x graph is a triangle from (0,0) to (0.1, 20), and its area is ½ × 0.1 × 20 = 1.0 J. Half the naive answer, exactly, for every linear spring.',
      'Halving twice. The average force is 10 N, not 5 N — the force runs from 0 to 20, so its mean is 10.',
      'k × x IS the force at full stretch, 20 N — a force, not an energy. Watch the units: N/m × m gives newtons, and joules need one more metre.',
    ],
    reveal: 'The reason this is worth four minutes: it is the first time in the course where “force × distance” stops working, and the repair — take the area — is the same repair that later becomes an integral. Every strip on the shaded graph is a tiny F·d where F really is constant.',
  },
  defaultSteps: [
    { say: 'A spring and a handle. Drag the handle out and watch two things at once: the force readout, and the graph filling in underneath it.', cta: 'Stretch it' },
    { say: 'Stop at 10 cm and commit an answer for the work done, before looking at the shaded area.', cta: 'Lock in my prediction' },
    { say: 'Now the two answers side by side: the ghost rectangle is what F·x would give, the shaded triangle is the truth. The rectangle is exactly twice the triangle — and you can see why in one glance.', cta: 'Show both' },
    { say: 'Finally, launch the block into the spring. It stops when the shaded area equals its kinetic energy, which is one equation you can now read straight off the picture.', cta: 'Launch the block' },
  ],
  buildScene(p): SpringSpec {
    return {
      bench: 'spring',
      k: num(p, 'k', 200),
      beta: 0,
      xMax: num(p, 'xMax', 0.15),
      mass: num(p, 'mass', 0.5),
      v0: num(p, 'v0', 3),
    };
  },
};

const springBand: Phase2Archetype = {
  id: 'spring-stiffening-band',
  title: 'When ½kx² stops working',
  summary: 'A rubber band stiffens. The formula breaks; the area does not.',
  family: 'energy',
  mode: 'solve',
  targets: 'spring_work_is_always_half_kx2',
  params: [
    { key: 'k', label: 'Initial stiffness k', kind: 'number', default: 200, min: 20, max: 800, step: 10, unit: 'N/m' },
    { key: 'beta', label: 'Stiffening β', kind: 'number', default: 5000, min: 0, max: 20000, step: 250, unit: 'N/m³' },
    { key: 'xMax', label: 'Stretch limit', kind: 'number', default: 0.2, min: 0.05, max: 0.4, step: 0.01, unit: 'm' },
    { key: 'mass', label: 'Block mass', kind: 'number', default: 0.5, min: 0.1, max: 5, step: 0.1, unit: 'kg' },
    { key: 'v0', label: 'Block speed', kind: 'number', default: 3, min: 0.5, max: 8, step: 0.5, unit: 'm/s' },
  ],
  predict: {
    prompt: 'This band gets stiffer as it stretches: F = 200x + 5000x³. Stretch it 20 cm. Does ½kx² = 4 J give the right work?',
    options: [
      'Yes — ½kx² is the spring work formula',
      'No, it is too small; the true work is 6 J',
      'No, it is too big; the true work is 2 J',
      'The formula does not apply at all, so there is no answer',
    ],
    answer_index: 1,
    per_option: [
      '½kx² is the area of a TRIANGLE, and this graph is not a triangle — it bends upward. The formula is a special case that quietly assumed a straight line.',
      'Right: 4 J from the straight part plus ¼βx⁴ = 2 J from the curve, 6 J altogether. And you can see the missing 2 J on the chart as the sliver between the straight line and the real curve.',
      'Too big would mean the band is SOFTER than a spring of the same k. It is stiffer — the βx³ term only ever adds force — so the true work has to be larger, not smaller.',
      'There is always an answer: the area under the curve. What has stopped applying is one particular shortcut for computing that area.',
    ],
    reveal: 'Two students remember different things from this chapter. One remembers “spring work is ½kx²” and is stuck the moment the graph bends. The other remembers “work is the area under F–x” and is never stuck again. The bench is built to make the second one cheaper to be.',
  },
  defaultSteps: [
    { say: 'Same bench, one new slider: β, how much the band stiffens as it stretches. Start with β = 0 — that is an ideal spring, and the graph is a straight line.', cta: 'Look at β = 0' },
    { say: 'Now turn β up. The line bends. Predict whether ½kx² is now too big, too small, or still right.', cta: 'Lock in my prediction' },
    { say: 'Compare three numbers: the shaded area, the ½kx² shortcut, and the naive F·x rectangle. Only one of them tracks the curve.', cta: 'Show all three' },
    { say: 'Then launch the block into it. A stiffening band stops the block sooner than an ideal spring of the same k — and the graph tells you that before the block does.', cta: 'Launch the block' },
  ],
  buildScene(p): SpringSpec {
    return {
      bench: 'spring',
      k: num(p, 'k', 200),
      beta: num(p, 'beta', 5000),
      xMax: num(p, 'xMax', 0.2),
      mass: num(p, 'mass', 0.5),
      v0: num(p, 'v0', 3),
    };
  },
};

// ═══ 5. ORBIT SANDBOX ════════════════════════════════════════════════════════

const orbitCannon: Phase2Archetype = {
  id: 'orbit-newtons-cannon',
  title: 'Newton’s cannon',
  summary: 'FLAGSHIP. An orbit is a projectile that keeps missing.',
  family: 'energy',
  mode: 'solve',
  targets: 'orbit_has_no_gravity',
  params: [
    { key: 'altitude', label: 'Launch altitude', kind: 'number', default: 600, min: 100, max: 4000, step: 50, unit: 'km' },
    { key: 'vFactor', label: 'Speed (× circular)', kind: 'number', default: 0.72, min: 0.2, max: 1.6, step: 0.01 },
  ],
  predict: {
    prompt: 'Astronauts on the space station float. Why?',
    options: [
      'There is no gravity that far out',
      'They are falling, and missing the Earth because they are moving sideways fast enough',
      'The station spins, and that cancels gravity',
      'They are beyond the atmosphere, and gravity needs air',
    ],
    answer_index: 1,
    per_option: [
      'At 400 km, g is still about 8.7 m/s² — roughly 90% of its value at your feet. If gravity had switched off, the station would have left in a straight line years ago.',
      'Exactly. Fire the cannon slowly and you get an ordinary cannonball’s arc. Fire it faster and the arc gets longer. Fire it fast enough and the ground curves away as fast as the ball falls, and the fall never ends. Nothing about the physics changed between those three shots.',
      'Spin gives the station a fixed orientation, not weightlessness. A station that did not spin at all would be exactly as weightless.',
      'Gravity has nothing to do with air. The Moon has no air and is very firmly held.',
    ],
    reveal: 'This is why the sim uses the SAME integrator as the Projectile Playground, with one line changed: gravity points at a moving target instead of straight down. If it needed a different engine, the claim would be false.',
  },
  defaultSteps: [
    { say: 'Newton’s own picture: a cannon on an impossibly tall mountain, fired horizontally. Start slow — you will get a perfectly ordinary cannonball arc.', cta: 'Fire it slowly' },
    { say: 'Now commit an answer to why astronauts float, before you turn the speed up.', cta: 'Lock in my prediction' },
    { say: 'Turn the speed up, shot by shot. Watch the impact point walk round the planet — and then not arrive at all.', cta: 'Fire faster' },
    { say: 'One last look: the acceleration arrow. It points at the Earth’s centre the entire way round, at every speed, on every shot. Nothing was ever switched off.', cta: 'Show the acceleration' },
  ],
  buildScene(p): OrbitSpec {
    return {
      bench: 'orbit',
      GM: EARTH.GM,
      R: EARTH.radius,
      r0: EARTH.radius + num(p, 'altitude', 600) * 1000,
      vFactor: num(p, 'vFactor', 0.72),
    };
  },
};

const orbitEscape: Phase2Archetype = {
  id: 'orbit-escape',
  title: 'Escape is a √2',
  summary: 'Not a wall, not a boundary — an energy account balancing.',
  family: 'energy',
  mode: 'solve',
  targets: 'escape_means_gravity_ends',
  params: [
    { key: 'altitude', label: 'Launch altitude', kind: 'number', default: 300, min: 100, max: 4000, step: 50, unit: 'km' },
    { key: 'vFactor', label: 'Speed (× circular)', kind: 'number', default: 1.42, min: 0.2, max: 1.8, step: 0.01 },
  ],
  predict: {
    prompt: 'Escape speed at some altitude is 11.0 km/s. What happens to a probe launched at 11.2 km/s?',
    options: [
      'It leaves gravity behind and coasts at 11.2 km/s forever',
      'It slows down forever, approaching a small non-zero speed, and never returns',
      'It flies out, stops, and falls back very slowly',
      'It orbits in a very large circle',
    ],
    answer_index: 1,
    per_option: [
      'Gravity is never left behind — it only becomes small. The probe keeps decelerating the whole way out; it just never decelerates all the way to zero.',
      'Right. ½v² − GM/r is a constant, and above escape speed that constant is positive — so as r → ∞ the speed settles at √(2·that constant) rather than reaching zero. Slowing forever, arriving somewhere, never coming back.',
      'That is what happens just BELOW escape speed. Drag the speed slider a hair under 1.41× and watch exactly this: a long climb, a turn, and a very slow return.',
      'A circle needs a very specific speed at each radius, and 11.2 km/s is far above the circular speed there. The path opens out instead of closing.',
    ],
    reveal: 'And the number itself: v_escape = √(2GM/r) = √2 × √(GM/r) = √2 × circular speed. Always. If you know the circular speed at an altitude, you know the escape speed — multiply by 1.414.',
  },
  defaultSteps: [
    { say: 'Same cannon, faster shots. Start it in a circle — set the speed to exactly 1.00× and watch it close.', cta: 'Fire the circle' },
    { say: 'Now walk the speed up: 1.1, 1.2, 1.3. The orbit stretches into longer and longer ellipses. Predict what happens at 1.41×.', cta: 'Lock in my prediction' },
    { say: 'Cross √2. The far end of the ellipse has run off to infinity — the path stopped being a closed curve and became an open one.', cta: 'Cross the line' },
    { say: 'Read the energy panel as you do it. Escape is not a speed limit; it is the point where the energy account crosses zero.', cta: 'Show the energy account' },
  ],
  buildScene(p): OrbitSpec {
    return {
      bench: 'orbit',
      GM: EARTH.GM,
      R: EARTH.radius,
      r0: EARTH.radius + num(p, 'altitude', 300) * 1000,
      vFactor: num(p, 'vFactor', 1.42),
    };
  },
};

const orbitFasterHigher: Phase2Archetype = {
  id: 'orbit-faster-is-higher',
  title: 'Fire faster, go higher',
  summary: 'The orbital-mechanics fact that catches everybody once.',
  family: 'energy',
  mode: 'solve',
  targets: 'faster_means_lower_orbit',
  params: [
    { key: 'altitude', label: 'Launch altitude', kind: 'number', default: 500, min: 100, max: 4000, step: 50, unit: 'km' },
    { key: 'vFactor', label: 'Speed (× circular)', kind: 'number', default: 1.15, min: 0.5, max: 1.39, step: 0.01 },
  ],
  predict: {
    prompt: 'You are in a circular orbit and you fire your engine forward for a moment. Where does the ship go?',
    options: [
      'Faster, hugging the same circle',
      'Faster and lower — speed pushes it toward the planet',
      'Onto an ellipse whose FAR side is higher; the launch point becomes the low point',
      'Straight out along a tangent, away from the planet',
    ],
    answer_index: 2,
    per_option: [
      'A circle at that radius demands one exact speed. Go above it and the path is no longer a circle — it has to be something else, and “something else” at the same radius means an ellipse.',
      'This is the intuition from a car on a bend — go faster and you are thrown outward, so surely faster means further out? Half right: it does go further out, and “lower” is exactly backwards.',
      'Right. A horizontal burn makes the burn point an apsis. Above circular speed it is the PERIAPSIS, so the ship climbs from there and comes back to the same place half an orbit later. Fire slower instead and the same point becomes the apoapsis.',
      'A tangent is what you get with no gravity. Gravity keeps bending the path, which is why it closes into an ellipse rather than running away.',
    ],
    reveal: 'And the sting in the tail: the higher orbit is a SLOWER one on average, with a longer period. So burning forward to catch something ahead of you in the same orbit puts you behind it. Chasing in orbit means slowing down.',
  },
  defaultSteps: [
    { say: 'Start in a clean circle — speed exactly 1.00×. Note where the ship is and how long a lap takes.', cta: 'Establish the circle' },
    { say: 'Now predict: you fire forward for a moment. Higher, lower, or the same?', cta: 'Lock in my prediction' },
    { say: 'Nudge the speed up. Watch which side of the new ellipse the launch point ends up on.', cta: 'Fire forward' },
    { say: 'Then nudge it BELOW 1.00× and watch the launch point swap ends. The launch point is always an apsis; the only question is which one.', cta: 'Fire backward' },
  ],
  buildScene(p): OrbitSpec {
    return {
      bench: 'orbit',
      GM: EARTH.GM,
      R: EARTH.radius,
      r0: EARTH.radius + num(p, 'altitude', 500) * 1000,
      vFactor: num(p, 'vFactor', 1.15),
    };
  },
};

// ── The library ──────────────────────────────────────────────────────────────

/** Ladder order — the order the admin picker lists them in, and the order a
 *  chapter should use them. */
export const ENERGY_ARCHETYPE_ORDER = [
  'energy-ledger-path',
  'energy-ledger-friction',
  'energy-ledger-stops',
  'coaster-loop-critical',
  'coaster-mass-and-friction',
  'collision-equal-elastic',
  'collision-restitution',
  'collision-perfectly-inelastic',
  'collision-com-frame',
  'collision-2d-carrom',
  'spring-work-area',
  'spring-stiffening-band',
  'orbit-newtons-cannon',
  'orbit-escape',
  'orbit-faster-is-higher',
] as const;

export const ENERGY_ARCHETYPES: Phase2ArchetypeMap = {
  'energy-ledger-path': ledgerPath,
  'energy-ledger-friction': ledgerFriction,
  'energy-ledger-stops': ledgerStops,
  'coaster-loop-critical': coasterCritical,
  'coaster-mass-and-friction': coasterMass,
  'collision-equal-elastic': collisionEqualElastic,
  'collision-restitution': collisionRestitution,
  'collision-perfectly-inelastic': collisionSticky,
  'collision-com-frame': collisionComFrame,
  'collision-2d-carrom': collision2d,
  'spring-work-area': springArea,
  'spring-stiffening-band': springBand,
  'orbit-newtons-cannon': orbitCannon,
  'orbit-escape': orbitEscape,
  'orbit-faster-is-higher': orbitFasterHigher,
};
