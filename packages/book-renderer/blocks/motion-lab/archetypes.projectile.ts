/*
 * motion-lab/archetypes.projectile.ts — the projectile rung ladder.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE DATA. No React, no DOM, no physics — every entry is a description of a
 * scene plus the narration that reveals it. The engine ships once as code; each
 * exercise on each page is a `motion_lab` block that names one of these ids and
 * overrides whatever it likes. Extending what the engine CAN do is code;
 * building a new exercise is data, authorable in the admin books-editor with no
 * developer. (PHYSICS_SIMULATION_PROGRAM.md §3.)
 *
 * Every archetype declares `targets` — the named misconception it is built to
 * attack — because design law #2 says a sim must grade reasoning, not outcome,
 * and a sim that attacks nothing in particular is a moving diagram.
 *
 * `params` is metadata FOR THE ADMIN EDITOR: label, kind, default, range. The
 * renderer resolves a value as
 *      block.projectile.<field>  →  block.params[key]  →  this default.
 * `defaultSteps` is the guided script: each step SAYS what is about to happen,
 * the student clicks, and exactly one thing appears. Never auto-play.
 */

import type { MotionArchetype } from './types';

type Param = NonNullable<MotionArchetype['params']>[number];

// ── Shared parameter definitions ─────────────────────────────────────────────
// Repeated verbatim across archetypes would drift; these builders keep every
// speed slider in the library on the same range and unit.

const pSpeed = (d = 20): Param =>
  ({ key: 'speed', label: 'Launch speed', kind: 'number', default: d, min: 2, max: 60, step: 0.5, unit: 'm/s' });
const pAngle = (d = 45): Param =>
  ({ key: 'angle', label: 'Launch angle', kind: 'number', default: d, min: 0, max: 90, step: 1, unit: '°' });
const pHeight = (d = 0): Param =>
  ({ key: 'height', label: 'Launch height', kind: 'number', default: d, min: 0, max: 40, step: 0.1, unit: 'm' });
const pG = (d = 9.8): Param =>
  ({ key: 'g', label: 'Gravity', kind: 'number', default: d, min: 1.6, max: 25, step: 0.1, unit: 'm/s²' });
const pIncline = (d = 20): Param =>
  ({ key: 'incline', label: 'Incline angle', kind: 'number', default: d, min: -40, max: 40, step: 1, unit: '°' });
const pMass = (d = 1): Param =>
  ({ key: 'mass', label: 'Mass', kind: 'number', default: d, min: 0.05, max: 20, step: 0.05, unit: 'kg' });

/**
 * Quadratic drag coefficient k in F = k·|v|·v, units kg/m.
 *
 * NOT a made-up number. k = ½ρC_dA, so for a cricket ball (radius 0.036 m →
 * A = 4.07×10⁻³ m², C_d ≈ 0.4 for a smooth sphere in this speed range, air
 * ρ = 1.2 kg/m³): k = ½ × 1.2 × 0.4 × 4.07×10⁻³ ≈ 1.0×10⁻³ kg/m. With the
 * ball's 0.16 kg that gives a drag acceleration of about 5.6 m/s² at 30 m/s,
 * and the sim then reports a carry of about 66 m against 94 m in vacuum —
 * which is the right order for a real outfield throw. The slider range is set
 * around that value rather than around a number that merely looks tidy.
 */
const pDragK = (d = 0.004): Param =>
  ({ key: 'drag_k', label: 'Air-drag coefficient', kind: 'number', default: d, min: 0, max: 0.02, step: 0.0005, unit: 'kg/m' });
const pDragModel: Param =
  { key: 'drag_model', label: 'Drag model', kind: 'select', default: 'quadratic', options: ['linear', 'quadratic'] };
const pFrameVx = (d = 12): Param =>
  ({ key: 'frame_vx', label: 'Cart speed', kind: 'number', default: d, min: -30, max: 30, step: 0.5, unit: 'm/s' });
const flag = (key: string, label: string, d = true): Param =>
  ({ key, label, kind: 'boolean', default: d });

// ── The ladder ───────────────────────────────────────────────────────────────

export const PROJECTILE_ARCHETYPES: Record<string, MotionArchetype> = {
  /* 1 ─────────────────────────────────────────────────────────────────────── */
  'basic-launch': {
    id: 'basic-launch',
    title: 'Launch and land',
    summary:
      'Set the speed and the angle yourself, then fire. The trajectory plays in the middle while its two 1-D shadows — horizontal and vertical — play beside it in lockstep.',
    scenario: 'projectile',
    targets: 'coupled_components',
    params: [pSpeed(20), pAngle(45), pHeight(0), pG(9.8), flag('show_strips', 'Show the two 1-D movies', true)],
    defaultSteps: [
      { say: 'Nothing is in the air yet. The launcher sits on the ground and the two empty tracks beside the field are where the horizontal and vertical shadows of the flight will play.', cta: 'Set the launch' },
      { say: 'This arrow is the launch velocity — 20 m/s at 45°. Watch it split into a horizontal part and a vertical part. Those two numbers are the whole problem.', cta: 'Split it' },
      { say: 'The horizontal part never changes. Nothing pushes the ball sideways once it leaves, so the side track will tick along at a perfectly steady rate.', cta: 'Add the vertical part' },
      { say: 'The vertical part is an ordinary up-and-down throw: it slows, stops, and comes back. Gravity only ever touches this one.', cta: 'Fire' },
    ],
  },

  /* 2 ─────────────────────────────────────────────────────────────────────── */
  'independence-of-components': {
    id: 'independence-of-components',
    title: 'Dropped and fired — who lands first?',
    summary:
      'One ball is dropped. At the same instant a second is fired horizontally from the same height. Predict which one hits the ground first, then watch the two vertical shadows stay exactly level the whole way down.',
    scenario: 'projectile',
    targets: 'coupled_components',
    params: [
      pSpeed(14), { ...pAngle(0), label: 'Launch angle (fired ball)' }, pHeight(12), pG(9.8),
      flag('drop_race', 'Race a dropped ball', true),
    ],
    defaultSteps: [
      { say: 'Two identical balls, both 12 m up. The left one will simply be released. The right one will be fired straight forward, hard.', cta: 'Show the fired ball’s velocity' },
      { say: 'The fired ball has a big sideways velocity and zero vertical velocity — exactly like the dropped one, which has zero of both. Vertically, they start the same.', cta: 'Release both' },
      { say: 'Keep your eyes on the vertical track. The two markers never separate. Sideways motion does not slow a fall down, and it does not speed one up either.', cta: 'Show the landing times' },
    ],
  },

  /* 3 ─────────────────────────────────────────────────────────────────────── */
  'apex-anatomy': {
    id: 'apex-anatomy',
    title: 'What is really happening at the top',
    summary:
      'Freeze the flight at its highest point and read the two velocity components off the screen. One of them is zero. The other one is the same as it was at launch — and that is the one everybody forgets.',
    scenario: 'projectile',
    targets: 'velocity_zero_at_apex',
    params: [pSpeed(22), pAngle(60), pHeight(0), pG(9.8), flag('components', 'Draw the component arrows', true)],
    defaultSteps: [
      { say: 'Fire it steeply, then stop it at the very top. Before you look at the numbers, decide: at the highest point, is the ball momentarily at rest?', cta: 'Jump to the top' },
      { say: 'The vertical component really is zero — that is what “highest point” means. But look at the horizontal arrow. It has not shrunk by a single m/s since launch.', cta: 'Compare with the launch' },
      { say: 'So at the top the ball is still moving at 11 m/s, dead level. If it were truly at rest it would drop straight down from there — and no thrown ball has ever done that.', cta: 'Let it finish' },
    ],
  },

  /* 4 ─────────────────────────────────────────────────────────────────────── */
  'apex-gravity': {
    id: 'apex-gravity',
    title: 'Does gravity switch off at the top?',
    summary:
      'The acceleration arrow is drawn at every instant of the flight, including the highest point. It never changes length and never changes direction. Not at the top, not anywhere.',
    scenario: 'projectile',
    targets: 'accel_zero_at_apex',
    params: [pSpeed(18), pAngle(70), pHeight(0), pG(9.8), flag('vectors', 'Draw v and a arrows', true)],
    defaultSteps: [
      { say: 'Two arrows will follow the ball: velocity, and acceleration. Predict what the acceleration arrow does as the ball reaches the top.', cta: 'Show the arrows' },
      { say: 'Step through the flight slowly and watch the second arrow. Same length, same direction, straight down, the entire time — 9.8 m/s² from the first instant to the last.', cta: 'Stop at the top' },
      { say: 'Zero velocity and zero acceleration are different things. At the top the vertical velocity is zero for one instant, which is exactly why the ball does not stay there.', cta: 'Finish the flight' },
    ],
  },

  /* 5 ─────────────────────────────────────────────────────────────────────── */
  'range-vs-angle': {
    id: 'range-vs-angle',
    title: 'Which angle throws the furthest?',
    summary:
      'Sweep the launch angle at a fixed speed and watch the range curve build itself. From the ground the peak really is at 45° — and the curve is flat enough near the top that 40° and 50° barely lose anything.',
    scenario: 'projectile',
    targets: 'range_always_max_at_45',
    params: [pSpeed(20), pAngle(30), pHeight(0), pG(9.8), flag('range_curve', 'Plot range vs angle', true), flag('sweep', 'Offer the angle sweep', true)],
    defaultSteps: [
      { say: 'Same launch speed every time — only the angle changes. Before sweeping, write down the angle you think wins.', cta: 'Sweep the angle' },
      { say: 'Every angle from 5° to 85° has now been fired at the same 20 m/s. The R-against-θ curve on the right is the summary of all of them.', cta: 'Mark the maximum' },
      { say: 'The peak sits at 45° — but notice how flat the curve is near the top. Losing 5° off the best angle costs under 2% of the range. Fine control of angle matters far less than speed.', cta: 'Done' },
    ],
  },

  /* 6 ─────────────────────────────────────────────────────────────────────── */
  'same-range-pair': {
    id: 'same-range-pair',
    title: 'Two very different throws, one landing spot',
    summary:
      'Fire at 30° and at 60° with the same speed. Both land in exactly the same place. One arrives fast and flat after 2.0 s; the other loops up and takes 3.5 s. Same range, completely different flight.',
    scenario: 'projectile',
    targets: 'range_always_max_at_45',
    params: [pSpeed(20), pAngle(30), pHeight(0), pG(9.8), flag('pair', 'Also fire the complementary angle', true)],
    defaultSteps: [
      { say: 'The first throw goes at 30°. Note where it lands.', cta: 'Fire the 30° throw' },
      { say: 'Now the same speed at 60° — its complement, because 30 + 60 = 90. Predict: does it land short, long, or in the same place?', cta: 'Fire the 60° throw' },
      { say: 'The same spot, because sin 60° and sin 120° are equal. What differs is the time in the air and how steeply it arrives — which is why a fielder chooses the flat one and a lobbed shot chooses the high one.', cta: 'Compare the flight times' },
    ],
  },

  /* 7 ─────────────────────────────────────────────────────────────────────── */
  'launch-from-height': {
    id: 'launch-from-height',
    title: 'Throwing from a height — 45° stops being the answer',
    summary:
      'Move the launcher up onto a cliff and sweep the angle again. The best angle slides below 45°, and it keeps sliding as the launch height grows. This is why a shot-putter releases at about 42°.',
    scenario: 'projectile',
    targets: 'range_always_max_at_45',
    params: [pSpeed(20), pAngle(45), pHeight(6), pG(9.8), flag('range_curve', 'Plot range vs angle', true), flag('sweep', 'Offer the angle sweep', true)],
    defaultSteps: [
      { say: 'Same 20 m/s, but the launcher is now 6 m up. The ball no longer has to come back to the height it started from.', cta: 'Sweep the angle again' },
      { say: 'The peak of the curve has moved. From 6 m the best angle is nearer 38° than 45° — extra height buys you hang time for free, so it pays to spend more of your speed going forwards.', cta: 'Show the exact optimum' },
      { say: 'A shot-putter releases from about 2.1 m at about 13.5 m/s. Put those numbers in and the formula answers 42°, which is what coaches actually teach. Air drag pushes it lower still.', cta: 'Done' },
    ],
  },

  /* 8 ─────────────────────────────────────────────────────────────────────── */
  'incline-launch': {
    id: 'incline-launch',
    title: 'Projectile on a slope — tilt the axes, not the problem',
    summary:
      'Fire up a hillside. In ordinary x-y axes it is an ugly simultaneous equation. Rotate the axes so x runs along the slope and it becomes the same up-and-down problem you already solved — with g split into two pieces.',
    scenario: 'projectile-incline',
    targets: 'coupled_components',
    params: [pSpeed(20), pAngle(50), pIncline(20), pG(9.8), flag('axis_rotate', 'Offer the axis-rotation toggle', true)],
    defaultSteps: [
      { say: 'A 20° slope, and a throw at 50° from the horizontal. Landing is wherever the path meets the hillside — which is not where it meets the ground.', cta: 'Fire it' },
      { say: 'In horizontal-vertical axes you would have to solve “when does y equal x tan 20°”. That is a quadratic in disguise and it is where most people lose the marks.', cta: 'Rotate the axes' },
      { say: 'Now x runs along the slope. Gravity splits into g cos 20° pulling into the hill and g sin 20° dragging back down it. The perpendicular motion is an ordinary up-and-back-down — landing is simply when it returns to zero.', cta: 'Read the one-line answer' },
    ],
  },

  /* 9 ─────────────────────────────────────────────────────────────────────── */
  'monkey-hunter': {
    id: 'monkey-hunter',
    title: 'Monkey and hunter',
    summary:
      'A monkey lets go of its branch at the exact instant the dart is fired. Choose where to aim — above it, straight at it, or below — and find out why the answer is the one that feels wrong.',
    scenario: 'monkey-hunter',
    targets: 'coupled_components',
    params: [
      pSpeed(24), { ...pAngle(38), label: 'Starting aim (deliberately too high)' }, pHeight(0), pG(9.8),
      { key: 'monkey_x', label: 'Monkey distance', kind: 'number', default: 30, min: 8, max: 60, step: 1, unit: 'm' },
      { key: 'monkey_y', label: 'Monkey height', kind: 'number', default: 14, min: 2, max: 30, step: 0.5, unit: 'm' },
    ],
    defaultSteps: [
      { say: 'The monkey is 30 m away and 14 m up, and it will release the branch the moment it hears the shot. Aim wherever you think is right — most people aim above it, to allow for the drop.', cta: 'Take the shot' },
      { say: 'Here is the dotted line the dart would have followed if gravity did not exist. In that world, aiming straight at the monkey is obviously right.', cta: 'Turn gravity back on' },
      { say: 'Gravity pulls the dart below that line by exactly ½gt² — and it pulls the monkey below its branch by exactly ½gt² too. The same number, at the same time. Aim straight at it and they cannot miss each other.', cta: 'Try another speed' },
    ],
  },

  /* 10 ────────────────────────────────────────────────────────────────────── */
  'with-drag': {
    id: 'with-drag',
    title: 'Real air, not vacuum',
    summary:
      'Switch the air on. The neat symmetric parabola leans over — it climbs gently and drops steeply — the range shortens, and the best launch angle drops below 45° for a second, independent reason.',
    scenario: 'projectile',
    targets: 'range_always_max_at_45',
    // A cricket ball thrown in from the boundary — 0.16 kg, k ≈ 1×10⁻³ kg/m
    // (see pDragK). `drag` starts FALSE on purpose: the guided script shows the
    // vacuum case first and then switches the air on. Faculty can flip it.
    params: [pSpeed(30), pAngle(45), pHeight(1.8), pG(9.8), pMass(0.16), flag('drag', 'Start with air on', false),
      pDragK(0.001), pDragModel, flag('show_ideal', 'Ghost the vacuum path', true)],
    defaultSteps: [
      { say: 'First the textbook version: no air. Perfectly symmetric — it comes down at the same angle and the same speed it went up at.', cta: 'Switch the air on' },
      { say: 'Now the same shot through air. The pale curve behind is the vacuum path. The real one falls short, and it is no longer symmetric: the way down is steeper than the way up.', cta: 'Why is it lopsided?' },
      { say: 'Drag always points against the velocity, and the ball is fastest early on — so it loses most of its speed in the first half. By the second half it is slow, nearly falling straight down.', cta: 'Find the best angle now' },
    ],
  },

  /* 11 ────────────────────────────────────────────────────────────────────── */
  'vacuum-vs-air': {
    id: 'vacuum-vs-air',
    title: 'Does the heavier one fall faster?',
    summary:
      'Fire a light ball and a heavy ball with the same speed and angle. In vacuum the two curves lie exactly on top of each other. Switch the air on and they separate — and now the heavy one really does win.',
    scenario: 'projectile',
    targets: 'heavier_falls_faster',
    params: [pSpeed(26), pAngle(40), pHeight(0), pG(9.8), pMass(1), flag('drag', 'Start with air on', false),
      pDragK(0.006), pDragModel, flag('mass_compare', 'Race a 10× heavier ball', true)],
    defaultSteps: [
      { say: 'A 1 kg ball and a 10 kg ball, identical launch. With no air, predict whether you will see one curve or two.', cta: 'Fire both — no air' },
      { say: 'One curve. There are two balls on it, exactly on top of each other, the whole flight. Mass cancels out of a = g, so it cannot appear in the answer.', cta: 'Switch the air on' },
      { say: 'Two curves now. Drag gives an acceleration of k·v divided by m, so the same air force barely troubles the heavy ball and badly slows the light one. Heavier wins in air — and only because of air.', cta: 'Done' },
    ],
  },

  /* 12 ────────────────────────────────────────────────────────────────────── */
  'safety-envelope': {
    id: 'safety-envelope',
    title: 'The parabola of safety',
    summary:
      'Fix the speed and fire at every angle at once. The reachable region has a sharp edge, and that edge is itself a parabola — stand outside it and no shot at this speed can ever reach you.',
    scenario: 'projectile',
    targets: 'range_always_max_at_45',
    params: [pSpeed(20), pAngle(45), pHeight(0), pG(9.8), flag('envelope', 'Draw the bounding parabola', true), flag('sweep', 'Offer the angle sweep', true)],
    defaultSteps: [
      { say: 'One speed, 20 m/s, and every angle from 5° to 85°. Before firing them all, sketch in your head the shape of the region they can cover.', cta: 'Fire the whole fan' },
      { say: 'Look at the outer edge of the fan. Every single parabola touches it once and none of them crosses it.', cta: 'Draw that edge' },
      { say: 'The edge is y = u²/2g − gx²/2u². It reaches u²/2g straight up — the height of a vertical throw — and meets the ground at u²/g, the 45° range. Those are the only two numbers in it.', cta: 'Done' },
    ],
  },

  /* 13 ────────────────────────────────────────────────────────────────────── */
  'target-practice': {
    id: 'target-practice',
    title: 'Hit the target',
    summary:
      'A ring is placed on the field and the path is hidden until you fire. Adjust the speed and angle, take your shot, and find the second angle that also works.',
    scenario: 'projectile',
    targets: 'range_always_max_at_45',
    params: [
      pSpeed(18), pAngle(35), pHeight(0), pG(9.8),
      { key: 'target_x', label: 'Target distance', kind: 'number', default: 28, min: 5, max: 80, step: 0.5, unit: 'm' },
      { key: 'target_y', label: 'Target height', kind: 'number', default: 0, min: 0, max: 30, step: 0.5, unit: 'm' },
    ],
    defaultSteps: [
      { say: 'The ring is 28 m away, on the ground. The flight path stays hidden until you commit — no tracing the curve with your eye first.', cta: 'Take your first shot' },
      { say: 'Adjust and try again. A useful habit: change one thing at a time. If it fell short, was it the speed or the angle?', cta: 'Keep going' },
      { say: 'Once you have hit it, hunt for the OTHER angle that also hits it. On level ground there are almost always two — a flat fast one and a high slow one.', cta: 'Done' },
    ],
  },

  /* 14 ────────────────────────────────────────────────────────────────────── */
  'cart-frame': {
    id: 'cart-frame',
    title: 'Dropped from a moving trolley',
    summary:
      'A ball is released from a trolley rolling at a steady speed. To you on the platform it curves away in a parabola. To someone riding the trolley it falls straight down past their feet. Both are right.',
    scenario: 'relative',
    targets: 'frame_confusion',
    params: [
      { ...pSpeed(12), label: 'Trolley speed' }, { ...pAngle(0), label: 'Release angle' }, pHeight(20), pG(9.8), pFrameVx(12),
    ],
    defaultSteps: [
      { say: 'The trolley rolls right at a steady 12 m/s. At the moment it passes the mark, the ball is released — not thrown, just let go.', cta: 'Release it' },
      { say: 'From the platform the ball moves forward as it falls, because it kept the trolley’s 12 m/s. It lands ahead of the release point — and right back in the trolley.', cta: 'Ride the trolley' },
      { say: 'Same recording, watched from the trolley. Now the ball drops straight down. Nothing about the physics changed; only who is watching. Notice the vertical track is identical in both views.', cta: 'Switch back and forth' },
    ],
  },
};

/** Stable ordering for pickers and for the admin editor's archetype list. */
export const PROJECTILE_ARCHETYPE_IDS: string[] = Object.keys(PROJECTILE_ARCHETYPES);

/** Look-up that tolerates an unknown id (an authoring typo must not crash a page). */
export const projectileArchetype = (id?: string): MotionArchetype | undefined =>
  id ? PROJECTILE_ARCHETYPES[id] : undefined;
