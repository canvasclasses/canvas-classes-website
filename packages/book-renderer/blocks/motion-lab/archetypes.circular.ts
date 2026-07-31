/*
 * motion-lab/archetypes.circular.ts — the Circular Motion Arena construction
 * library. PURE (no React, no DOM).
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every exercise on every page is a `motion_lab`
 * block naming one of these ids plus params. Extending what the arena CAN do is
 * code; building an exercise is DATA, authorable by faculty in the books-editor.
 * Same contract as vector-board/archetypes.ts and math-graph/archetypes.ts.
 *
 * Every archetype declares:
 *   • `params`   — the knobs, so the admin editor can render inputs with no
 *                  developer involvement;
 *   • `defaultSteps` — the GUIDED script. The panel states what is about to
 *                  happen and why, the student clicks, ONE thing appears. Never
 *                  an auto-playing animation (design law #5);
 *   • `targets`  — the named misconception it exists to attack. An archetype
 *                  that attacks nothing is a moving diagram, and should not
 *                  have been built (design law #2).
 *
 * The four codes this file goes after, from motion-lab/types.ts:
 *   radial_departure                        — "it flies straight out when cut"
 *   centrifugal_in_ground                   — an outward force in the ground frame
 *   speed_constant_in_ucm_means_no_accel    — "steady speed ⇒ no acceleration"
 *   frame_confusion                         — which frame am I even in?
 *   velocity_zero_at_apex                   — "it stops at the top of the loop"
 */

import type { MotionArchetype, CircularSpec } from './types';
import { conicalPendulum } from './lib/circular';

// ── Which face of the arena an archetype opens on ────────────────────────────
// MotionArchetype is a frozen contract, so the view lives beside it rather than
// inside it. `arena` is the main circle (frame toggle + vectors); the rest are
// the four dedicated faces plus the real-instrument tab.

export type ArenaView =
  | 'arena'
  | 'cut'
  | 'vertical'
  | 'banked'
  | 'nonuniform'
  | 'instruments';

export const ARENA_VIEWS: { key: ArenaView; label: string; sub: string }[] = [
  { key: 'arena', label: 'Which Frame?', sub: 'ground vs rotating' },
  { key: 'cut', label: 'Cut the String', sub: 'where does it go?' },
  { key: 'vertical', label: 'Vertical Circle', sub: 'tension vs angle' },
  { key: 'banked', label: 'Banked Road', sub: 'the safe speed band' },
  { key: 'nonuniform', label: 'Speeding Up', sub: 'two accelerations' },
  { key: 'instruments', label: 'Real Machines', sub: 'the same equation' },
];

const num = (
  key: string,
  label: string,
  def: number,
  min: number,
  max: number,
  step: number,
  unit?: string
) => ({ key, label, kind: 'number' as const, default: def, min, max, step, unit });

// ── The library ──────────────────────────────────────────────────────────────

export const CIRCULAR_ARCHETYPES: Record<string, MotionArchetype> = {
  // 1 ────────────────────────────────────────────────────────────────────────
  'uniform-basics': {
    id: 'uniform-basics',
    title: 'Uniform circular motion',
    summary:
      'Steady speed on a circle. The speed number never moves — and the acceleration is never zero.',
    scenario: 'circular',
    targets: 'speed_constant_in_ucm_means_no_accel',
    params: [
      num('radius', 'Radius r', 2, 0.5, 6, 0.1, 'm'),
      num('mass', 'Mass m', 1, 0.1, 10, 0.1, 'kg'),
      num('speed', 'Speed v', 6, 0.5, 20, 0.5, 'm/s'),
    ],
    defaultSteps: [
      { say: 'A ball on a string, whirled on a smooth table. Watch the speed readout — it does not change. Steady speed. Ready?', cta: 'Start it turning' },
      { say: 'Now the velocity arrow. It points along the tangent, and it is turning. Same length, new direction, every instant.', cta: 'Show velocity' },
      { say: 'Direction is part of velocity. A turning velocity is a CHANGING velocity — so there is an acceleration, even at steady speed. Here it is.', cta: 'Show acceleration' },
      { say: 'It points at the centre. Always. Its size is v²/r. This is centripetal acceleration — and the only thing "centripetal" means is "pointing at the centre".', cta: 'Show the numbers' },
    ],
  },

  // 2 ────────────────────────────────────────────────────────────────────────
  'velocity-is-tangential': {
    id: 'velocity-is-tangential',
    title: 'Velocity is tangential',
    summary:
      'Drag the ball anywhere round the circle and watch the velocity arrow stay perpendicular to the string.',
    scenario: 'circular',
    targets: 'radial_departure',
    params: [
      num('radius', 'Radius r', 2, 0.5, 6, 0.1, 'm'),
      num('mass', 'Mass m', 1, 0.1, 10, 0.1, 'kg'),
      num('speed', 'Speed v', 5, 0.5, 20, 0.5, 'm/s'),
    ],
    defaultSteps: [
      { say: 'Here is the string, drawn from the centre to the ball. Hold that picture.', cta: 'Show the string' },
      { say: 'Now the velocity. Notice the angle it makes with the string: 90°, exactly, at every position you drag the ball to.', cta: 'Show velocity' },
      { say: 'Drag the ball around the circle yourself. The angle stays 90°. That is what "tangential" means — and it is what decides where the ball goes if the string ever breaks.', cta: 'Let me drag it' },
    ],
  },

  // 3 ────────────────────────────────────────────────────────────────────────
  'cut-the-string': {
    id: 'cut-the-string',
    title: 'Cut the string',
    summary:
      'Predict first, then cut. The ball leaves along the tangent — not outward — and the projectile engine takes it from there.',
    scenario: 'circular',
    targets: 'radial_departure',
    params: [
      num('radius', 'Radius r', 2, 0.5, 6, 0.1, 'm'),
      num('mass', 'Mass m', 0.5, 0.1, 10, 0.1, 'kg'),
      num('speed', 'Speed v', 7, 1, 20, 0.5, 'm/s'),
      { key: 'plane', label: 'Plane', kind: 'select' as const, default: 'horizontal', options: ['horizontal', 'vertical'] },
    ],
    defaultSteps: [
      { say: 'A ball on a string, going round. In a moment you are going to cut the string. Before you do, commit to an answer — that is the whole exercise.', cta: 'I am ready to predict' },
      { say: 'Now cut it. Watch the very first instant, before gravity has had time to do anything.', cta: 'Cut the string' },
      { say: 'It left along the TANGENT — straight on in the direction it was already moving. Nothing ever pushed it outward, so nothing could send it outward.', cta: 'Show what happened' },
    ],
  },

  // 4 ────────────────────────────────────────────────────────────────────────
  'frame-toggle': {
    id: 'frame-toggle',
    title: 'Which frame are you in?',
    summary:
      'The same ball, two frames. In the ground frame there is no outward force. Switch to the rotating frame and centrifugal force appears — because you asked for it.',
    scenario: 'circular',
    targets: 'centrifugal_in_ground',
    params: [
      num('radius', 'Radius r', 2.5, 0.5, 6, 0.1, 'm'),
      num('mass', 'Mass m', 2, 0.1, 10, 0.1, 'kg'),
      num('speed', 'Speed v', 6, 0.5, 20, 0.5, 'm/s'),
    ],
    defaultSteps: [
      { say: 'You are standing on the ground watching a ball go round. This is the GROUND frame — an inertial frame, where Newton\'s laws work as written.', cta: 'Show the ball' },
      { say: 'Draw every force acting on it. There is exactly one horizontal force: the string, pulling INWARD. Count the arrows — there is no outward one, and there never was.', cta: 'Show the forces' },
      { say: 'Now sit ON the ball and turn with it. In this frame the ball is not moving at all — yet the string is still pulling inward. Newton alone cannot explain a body at rest with a net force on it.', cta: 'Ride the ball' },
      { say: 'So we ADD a fictitious outward force to make the books balance. That is centrifugal force: the price of using a rotating frame. It exists in this frame and nowhere else.', cta: 'Show centrifugal' },
    ],
  },

  // 5 ────────────────────────────────────────────────────────────────────────
  'vertical-circle': {
    id: 'vertical-circle',
    title: 'Vertical circle — tension all the way round',
    summary:
      'Live tension-vs-angle plot as the ball goes round. Maximum at the bottom, minimum at the top, and the reason is one cos θ.',
    scenario: 'vertical-circle',
    targets: 'velocity_zero_at_apex',
    params: [
      num('radius', 'Radius r', 1.5, 0.3, 4, 0.1, 'm'),
      num('mass', 'Mass m', 0.5, 0.1, 5, 0.1, 'kg'),
      num('speed', 'Speed at the bottom', 9, 1, 20, 0.2, 'm/s'),
    ],
    defaultSteps: [
      { say: 'A ball on a string, swung in a VERTICAL circle. Gravity now matters, and it will matter differently at every angle.', cta: 'Start the swing' },
      { say: 'Watch the speed as it climbs. It falls — gravity is doing negative work on the way up. A vertical circle is never uniform circular motion.', cta: 'Watch the speed' },
      { say: 'At the top it is at its slowest — but look, it is not zero. It cannot be zero, or the ball would drop out of the circle.', cta: 'Go to the top' },
      { say: 'Now the tension. Bottom: the string fights gravity AND turns the ball, so T = mv²/r + mg. Top: gravity is already pulling toward the centre and helps, so T = mv²/r − mg.', cta: 'Plot the tension' },
    ],
  },

  // 6 ────────────────────────────────────────────────────────────────────────
  'critical-speed': {
    id: 'critical-speed',
    title: 'Find the critical speed yourself',
    summary:
      'Slow it down until the string goes slack at the top. Read off v_min — before anyone derives √(gr) for you.',
    scenario: 'vertical-circle',
    targets: 'velocity_zero_at_apex',
    params: [
      num('radius', 'Radius r', 2, 0.3, 4, 0.1, 'm'),
      num('mass', 'Mass m', 0.5, 0.1, 5, 0.1, 'kg'),
      num('speed', 'Speed at the bottom', 11, 1, 20, 0.1, 'm/s'),
    ],
    defaultSteps: [
      { say: 'Same vertical circle. This time you have the speed slider, and one job: find the slowest swing that still makes it round.', cta: 'Give me the slider' },
      { say: 'Slow it down a little at a time and watch the tension at the TOP of the plot. Stop the moment it touches zero.', cta: 'Watch the top' },
      { say: 'Zero tension means the string has stopped pulling. Gravity alone is now turning the ball — mg = mv²/r. Read the speed at the top off the panel and square it against g × r.', cta: 'Compare the numbers' },
      { say: 'That is v_min = √(gr) at the top. You measured it before anyone derived it. Now slow it further and watch the string go slack and the ball fall out of the circle.', cta: 'Break it' },
    ],
  },

  // 7 ────────────────────────────────────────────────────────────────────────
  'banked-road': {
    id: 'banked-road',
    title: 'The banked highway curve',
    summary:
      'Drag the bank angle and the friction. The sim shades the band of speeds that survive the curve — and both ends of it are real.',
    scenario: 'banked-road',
    targets: 'centrifugal_in_ground',
    params: [
      num('radius', 'Curve radius r', 60, 15, 300, 5, 'm'),
      num('mass', 'Car mass m', 1200, 500, 3000, 50, 'kg'),
      // 16 m/s ≈ 58 km/h sits comfortably INSIDE the default band (0–19.1 m/s),
      // so the exercise starts safe and the student has to break it themselves.
      num('speed', 'Speed v', 16, 2, 45, 0.5, 'm/s'),
      num('bank', 'Bank angle', 15, 0, 45, 1, '°'),
      num('mu', 'Friction μ', 0.3, 0, 1.2, 0.05),
    ],
    defaultSteps: [
      { say: 'A highway curve of radius 60 m. To go round it, something must push the car toward the centre of the curve. On a flat road that something is friction alone.', cta: 'Show the flat road' },
      { say: 'Friction has a ceiling: μN. Push past it and the car slides. On a wet road μ collapses — which is exactly when curves kill people.', cta: 'Show the ceiling' },
      { say: 'So engineers TILT the road. Now the normal force itself leans inward and helps turn the car. Drag the bank angle and watch the inward push grow.', cta: 'Bank the road' },
      { say: 'That gives a BAND, not a single speed: too slow and you slide down the bank, too fast and you slide up it. The shaded strip is the band. Now change μ and watch it widen.', cta: 'Show the safe band' },
    ],
  },

  // 8 ────────────────────────────────────────────────────────────────────────
  'conical-pendulum': {
    id: 'conical-pendulum',
    title: 'Conical pendulum',
    summary:
      'A bob swung so the string sweeps a cone. The vertical component holds it up, the horizontal component turns it — and the mass cancels.',
    scenario: 'circular',
    targets: 'centrifugal_in_ground',
    params: [
      num('length', 'String length L', 1, 0.2, 3, 0.05, 'm'),
      num('cone', 'Cone half-angle', 30, 5, 80, 1, '°'),
      num('mass', 'Bob mass m', 0.4, 0.05, 3, 0.05, 'kg'),
    ],
    defaultSteps: [
      { say: 'A bob on a string, swung so the string traces a cone. The bob runs a horizontal circle while the string leans.', cta: 'Start the cone' },
      { say: 'Split the tension into two. The vertical part carries the weight: T cos θ = mg. Nothing left over — the bob does not rise or fall.', cta: 'Split the tension' },
      { say: 'The horizontal part is the whole centripetal force: T sin θ = mv²/r. There is no third force. Nothing pulls outward.', cta: 'Show the horizontal part' },
      { say: 'Divide one by the other and the mass cancels: tan θ = v²/(rg). A heavy bob and a light bob swing at exactly the same angle for the same speed.', cta: 'Show the result' },
    ],
  },

  // 9 ────────────────────────────────────────────────────────────────────────
  'rotor-drum': {
    id: 'rotor-drum',
    title: 'Rotor — the well of death',
    summary:
      'The floor drops away and the rider stays pinned. Find what actually holds them up — it is not the wall pushing outward.',
    scenario: 'circular',
    targets: 'centrifugal_in_ground',
    params: [
      num('radius', 'Drum radius r', 3, 1, 8, 0.1, 'm'),
      num('mass', 'Rider mass m', 60, 30, 120, 5, 'kg'),
      num('speed', 'Wall speed v', 9, 2, 25, 0.5, 'm/s'),
      num('mu', 'Friction μ', 0.4, 0.05, 1, 0.05),
    ],
    defaultSteps: [
      { say: 'A rider stands against the inside wall of a spinning drum. Then the floor drops away — and the rider does not.', cta: 'Drop the floor' },
      { say: 'The wall can only PUSH, and it pushes inward. That normal force is the centripetal force: N = mv²/r. It is horizontal — it cannot hold anyone up.', cta: 'Show the wall force' },
      { say: 'What holds the rider up is FRICTION, acting straight up the wall, and it must equal mg. Friction is capped at μN, so a faster spin means a bigger N and a bigger friction budget.', cta: 'Show friction' },
      { say: 'μ mv²/r ≥ mg gives v ≥ √(gr/μ). The mass cancels — the ride is exactly as safe for a heavy rider as for a light one. Now slow it below that and watch.', cta: 'Find the limit' },
    ],
  },

  // 10 ───────────────────────────────────────────────────────────────────────
  'bridge-crest': {
    id: 'bridge-crest',
    title: 'Over the bridge crest',
    summary:
      'Steady speed over a hump, yet the seat pushes less than your weight. Speed it up until the wheels leave the road.',
    scenario: 'circular',
    targets: 'speed_constant_in_ucm_means_no_accel',
    params: [
      num('radius', 'Crest radius r', 25, 8, 80, 1, 'm'),
      num('mass', 'Car mass m', 1200, 500, 3000, 50, 'kg'),
      num('speed', 'Speed at the crest', 12, 2, 35, 0.5, 'm/s'),
    ],
    defaultSteps: [
      { say: 'A car crosses a humped bridge at STEADY speed. The speedometer never moves. Most students stop thinking there.', cta: 'Drive it over' },
      { say: 'But the path curves — so the velocity is changing direction, so there is an acceleration, pointing down toward the centre of the curve.', cta: 'Show the acceleration' },
      { say: 'Two forces act: weight mg down, and the road pushing up N. Their difference has to supply mv²/r downward, so N = mg − mv²/r. The road pushes LESS than your weight. That is the floaty feeling.', cta: 'Show the forces' },
      { say: 'Now raise the speed. When v² reaches gr, N hits zero — the road is not touching the car at all. One notch faster and it is a projectile.', cta: 'Take off' },
    ],
  },

  // 11 ───────────────────────────────────────────────────────────────────────
  'non-uniform': {
    id: 'non-uniform',
    title: 'Non-uniform circular motion',
    summary:
      'A car speeding up round a bend. Two accelerations at right angles — one turns it, one speeds it up — and they add as vectors.',
    scenario: 'circular',
    targets: 'speed_constant_in_ucm_means_no_accel',
    params: [
      num('radius', 'Radius r', 3, 1, 8, 0.1, 'm'),
      num('mass', 'Mass m', 1, 0.1, 10, 0.1, 'kg'),
      num('speed', 'Starting speed v₀', 4, 0.5, 15, 0.5, 'm/s'),
      num('alpha', 'Tangential accel', 2, -4, 6, 0.2, 'm/s²'),
    ],
    defaultSteps: [
      { say: 'Same circle, but now the engine is on: the car is speeding up as it goes round the bend.', cta: 'Start accelerating' },
      { say: 'The radial acceleration is still there, still v²/r, still pointing at the centre. But v is growing — so this arrow grows too.', cta: 'Show radial' },
      { say: 'And there is a second acceleration, along the tangent, that is doing the speeding up. It is perpendicular to the first one.', cta: 'Show tangential' },
      { say: 'Add them as vectors: a = √(a_r² + a_t²), tilted away from the centre. The total acceleration no longer points at the centre — only in UNIFORM circular motion does it.', cta: 'Add them up' },
    ],
  },

  // 12 ───────────────────────────────────────────────────────────────────────
  'spin-dryer': {
    id: 'spin-dryer',
    title: 'Spin dryer',
    summary:
      'Why the water leaves and the clothes stay: the drum wall supplies a centripetal force to the cloth, and there is nothing to supply one to the water.',
    scenario: 'circular',
    targets: 'radial_departure',
    params: [
      num('radius', 'Drum radius r', 0.25, 0.1, 0.5, 0.01, 'm'),
      num('rpm', 'Spin speed', 1200, 200, 1600, 50, 'rpm'),
      num('mass', 'Water drop mass', 0.0002, 0.0001, 0.001, 0.0001, 'kg'),
    ],
    defaultSteps: [
      { say: 'A washing machine drum at 1200 rpm. Everyone says the water is "flung outward". Nothing flings it.', cta: 'Spin it up' },
      { say: 'The cloth is held by the drum wall, which pushes inward on it and makes it turn. That is its centripetal force.', cta: 'Hold the cloth' },
      { say: 'The water sits at a hole in the drum. Nothing is there to push it inward — so it stops turning and carries straight on along the tangent, through the hole.', cta: 'Release the water' },
      { say: 'It did not get pushed out. It stopped being pulled in. Same idea as cutting the string, running 20 times a second in your kitchen.', cta: 'Show the numbers' },
    ],
  },

  // 13 ───────────────────────────────────────────────────────────────────────
  centrifuge: {
    id: 'centrifuge',
    title: 'Laboratory centrifuge',
    summary:
      'ω²r expressed in multiples of g. A benchtop centrifuge reaches thousands of g without leaving the table.',
    scenario: 'circular',
    targets: 'centrifugal_in_ground',
    params: [
      num('radius', 'Rotor radius r', 0.1, 0.02, 0.3, 0.01, 'm'),
      num('rpm', 'Rotor speed', 12000, 1000, 20000, 500, 'rpm'),
      num('mass', 'Sample mass', 0.002, 0.0005, 0.01, 0.0005, 'kg'),
    ],
    defaultSteps: [
      { say: 'A blood sample in a centrifuge rotor, 10 cm from the axis, spinning at 12 000 rpm.', cta: 'Spin the rotor' },
      { say: 'Its centripetal acceleration is ω²r. Convert the rpm to rad/s first — that step is where most of the marks are lost.', cta: 'Compute ω²r' },
      { say: 'Divide by g and you get the "relative centrifugal field" printed on every lab centrifuge. Thousands of g, on a bench.', cta: 'Show it in g' },
      { say: 'Heavier particles need a larger inward force to keep turning with the tube, and the liquid cannot supply it — so they lag, and end up at the bottom. That is what separates the sample.', cta: 'Separate it' },
    ],
  },
};

/** Which face of the arena each archetype opens on. */
export const CIRCULAR_VIEW: Record<string, ArenaView> = {
  'uniform-basics': 'arena',
  'velocity-is-tangential': 'arena',
  'cut-the-string': 'cut',
  'frame-toggle': 'arena',
  'vertical-circle': 'vertical',
  'critical-speed': 'vertical',
  'banked-road': 'banked',
  'conical-pendulum': 'instruments',
  'rotor-drum': 'instruments',
  'bridge-crest': 'instruments',
  'non-uniform': 'nonuniform',
  'spin-dryer': 'instruments',
  centrifuge: 'instruments',
};

/** Which instrument card the instruments view opens on, per archetype. */
export const CIRCULAR_INSTRUMENT: Record<string, string> = {
  'conical-pendulum': 'conical',
  'rotor-drum': 'rotor',
  'bridge-crest': 'crest',
  'spin-dryer': 'dryer',
  centrifuge: 'centrifuge',
};

// ── Params → CircularSpec ────────────────────────────────────────────────────

const pick = (
  params: Record<string, number | string | boolean> | undefined,
  key: string,
  fallback: number
): number => {
  const v = params?.[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
};

const paramDefault = (arch: MotionArchetype | undefined, key: string, fallback: number): number => {
  const p = arch?.params?.find((q) => q.key === key);
  return typeof p?.default === 'number' ? p.default : fallback;
};

/**
 * Build the engine spec for an archetype from author params. PURE, so a node
 * script can assert that e.g. `critical-speed` really does start above √(5gr)
 * and can be dragged below it.
 *
 * `speed` is authored (m/s) because that is what a physics author thinks in;
 * the engine wants ω, so the conversion happens here in exactly one place.
 * A `rpm` param wins over `speed` for the machines that are quoted in rpm.
 */
export function circularSpecOf(
  archetypeId: string | undefined,
  params?: Record<string, number | string | boolean>
): CircularSpec {
  const arch = archetypeId ? CIRCULAR_ARCHETYPES[archetypeId] : undefined;
  const d = (k: string, f: number) => pick(params, k, paramDefault(arch, k, f));

  // The conical pendulum is authored as a length and a cone angle, not as a
  // radius and a speed — so derive its circle rather than falling through to the
  // generic defaults and reporting a radius the exercise never uses.
  if (archetypeId === 'conical-pendulum') {
    const cp = conicalPendulum(Math.max(0.05, d('length', 1)), d('cone', 30));
    return {
      radius: Math.max(0.001, cp.radius),
      mass: Math.max(0.0001, d('mass', 0.4)),
      omega: cp.omega,
      plane: 'horizontal',
      agent: 'string',
    };
  }

  const radius = Math.max(0.01, d('radius', 2));
  const mass = Math.max(0.0001, d('mass', 1));

  // rpm-quoted machines: ω = 2π × rpm / 60.
  const hasRpm = arch?.params?.some((p) => p.key === 'rpm') || params?.rpm !== undefined;
  const speed = d('speed', 6);
  const omega = hasRpm ? (2 * Math.PI * d('rpm', 1200)) / 60 : speed / radius;

  const planeParam = params?.plane ?? arch?.params?.find((p) => p.key === 'plane')?.default;
  const isVertical =
    planeParam === 'vertical' ||
    arch?.scenario === 'vertical-circle' ||
    archetypeId === 'bridge-crest';

  const spec: CircularSpec = {
    radius,
    mass,
    omega,
    plane: isVertical ? 'vertical' : 'horizontal',
    agent:
      archetypeId === 'bridge-crest'
        ? 'track-outside'
        : archetypeId === 'banked-road' || archetypeId === 'rotor-drum'
          ? 'friction'
          : 'string',
  };

  if (archetypeId === 'banked-road') {
    spec.bankDeg = d('bank', 15);
    spec.mu_s = d('mu', 0.3);
  } else if (archetypeId === 'rotor-drum') {
    spec.mu_s = d('mu', 0.4);
  }

  const alpha = params?.alpha;
  if (archetypeId === 'non-uniform' || typeof alpha === 'number') {
    spec.alphaTangential = d('alpha', 2);
  }

  return spec;
}

/** Default archetype when a `motion_lab` block names a circular scenario but no id. */
export const DEFAULT_CIRCULAR_ARCHETYPE: Record<string, string> = {
  circular: 'uniform-basics',
  'vertical-circle': 'vertical-circle',
  'banked-road': 'banked-road',
};
