'use client';

/*
 * motion-lab/circular/CircularArena.tsx — the Circular Motion Arena.
 * ─────────────────────────────────────────────────────────────────────────────
 * Replaces CircularMotionSim (a ball with two arrows) with the five things that
 * make circular motion actually land, per PHYSICS_SIMULATION_PROGRAM.md §5.4:
 *
 *   1. THE FRAME TOGGLE, front and centre — the first thing on the first tab,
 *      not a setting. Ground frame: no outward force exists and none is drawn.
 *      Rotating frame: the banner appears, and only THEN is centrifugal drawn.
 *   2. CUT THE STRING — predict first (the button is locked until you commit),
 *      then the ball departs along the tangent and is handed to the projectile
 *      integrator mid-flight. No reset. It just keeps going.
 *   3. VERTICAL CIRCLE — live tension-vs-angle plot; slow it down until the
 *      string goes slack at the top and v_min = √(gr) gets FOUND, not told.
 *   4. BANKED ROAD — bank angle and μ, with the safe band shaded.
 *   5. NON-UNIFORM — radial and tangential acceleration drawn separately, and
 *      visibly summing to a total that no longer points at the centre.
 *
 * ── Four rules this file exists to hold ──────────────────────────────────────
 * • GUIDED, NEVER AUTO-PLAYING. Each stage is stated before it is drawn.
 * • THE DRAG IS NEVER GATED ON THE ANIMATION CLOCK. You can grab the ball and
 *   move it round whether it is running or paused. (A previous sim shipped with
 *   its drag silently dead because the handler checked a `playing` flag first.)
 * • NOTHING IS KEYED ON BLOCK IDENTITY. The admin books-editor recreates the
 *   block object on every keystroke; a reference-keyed memo re-seeds continuously.
 * • ONE TEXT ELEMENT PER CANVAS. Arrows are named in the legend below it (§4E).
 */

import * as React from 'react';
import { useMemo, useReducer, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { CircularSpec, MotionState, FrameSpec, MotionMisconception } from '../types';
import { isInertial } from '../types';
import {
  readout, speedAt, releaseState, posAt, vMinAtTop, vMinAtBottom, wrapAngle, G_EARTH,
} from '../lib/circular';
import { integrate, gravityAccel } from '../lib/integrate';
import { toFrame } from '../lib/frames';
import {
  CIRCULAR_ARCHETYPES, CIRCULAR_VIEW, CIRCULAR_INSTRUMENT, ARENA_VIEWS,
  circularSpecOf, DEFAULT_CIRCULAR_ARCHETYPE, type ArenaView,
} from '../archetypes.circular';
import {
  SimShell, SimHeader, SimTabs, ExpertTip, TEXT, BORDER, accentTint, fmt, useAnimationFrame,
} from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';
import ArenaCanvas, { type ArenaLayers } from './ArenaCanvas';
import TensionPlot from './TensionPlot';
import BankedRoadView, { type BankedState } from './BankedRoadView';
import InstrumentsView, { type InstrumentId } from './InstrumentsView';
import {
  ActionButton, Card, FrameToggle, GuidedPanel, Legend, MisconceptionCard, NonInertialBanner,
  PredictGate, Pill, Readouts, Slider, MOTION, FORCE, GHOST, num,
  type PredictSpec, type Row,
} from './parts';
import { useStageWidth, STACK_WIDTH } from './useStageWidth';

// ── Layer ladder ─────────────────────────────────────────────────────────────
// `n` = how many guided stages have been revealed. Nothing is on screen before
// it has been explained; an unguided block passes n = Infinity.
//
// The thresholds are CLAMPED to the archetype's own step count, because `n`
// never exceeds it. Hardcoded absolutes made the top three layers permanently
// unreachable on every 3-step archetype — including `cut-the-string`, whose
// entire subject is what the string was doing, and which could therefore never
// draw the string's force, and `velocity-is-tangential`. Clamping means the
// LAST step always reveals the whole picture, whatever the ladder's length.
function layersAt(n: number, spec: CircularSpec, steps: number): ArenaLayers {
  const nonUniform = spec.plane === 'vertical' || !!spec.alphaTangential;
  const total = Math.max(1, steps);
  const at = (want: number) => n >= Math.min(want, total);
  return {
    landmarks: true,
    string: at(1),
    trail: at(1),
    velocity: at(2),
    centripetal: at(3),
    tangential: at(3) && nonUniform,
    total: at(4) && nonUniform,
    agent: at(4),
    weight: at(4) && spec.plane === 'vertical',
    centrifugal: at(3),
  };
}

const ORIGIN = { x: 0, y: 0 };

const CUT_PREDICT: PredictSpec = {
  prompt: 'A ball is being whirled on a string. The **instant** the string is cut, which way does it go?',
  options: [
    'Straight outward, away from the centre',
    'Straight on along the tangent — the direction it was already moving',
    'It curves backwards, the way it came',
    'It stops, then falls',
  ],
  answer_index: 1,
  // One paragraph for three different wrong beliefs is right/wrong scoring with
  // a shared explainer. Each of these names the specific thing the pick assumes
  // a force was doing.
  per_option: [
    'That answer needs something to be pushing the ball **outward** — and nothing ever was. The only force in the plane was the string, pulling **inward**. Removing a force cannot create a new one in the opposite direction.',
    'That is it — and notice what the reason is: no force in the plane at all, so the velocity it already had simply continues.',
    'Curving backwards needs a force pointing back along the path, actively turning it the other way. The instant the string is cut nothing is touching the ball, so nothing can bend its path either way.',
    'Stopping needs a force **against** the motion. Cutting the string removes an inward pull; it takes nothing away along the direction of travel, so the speed the ball had is the speed it keeps.',
  ],
  reveal:
    'Nothing ever pushed the ball outward. The string pulled it **inward**, which is the only thing that kept bending its path. Take that inward pull away and there is no force left in the plane at all — so Newton\'s first law takes over and it carries straight on, along the tangent, at the speed it already had.',
};

// ── Named misconceptions (design law #2) ─────────────────────────────────────
// Every circular archetype declares a `targets` code and, until now, not one was
// ever read: 13 codes sitting in the data and nothing in the UI. These are the
// four codes the circular library actually uses, each gated on the sim having
// already SHOWN the contradicting evidence — never fired as a preamble. Same
// contract and same voice as `ProjectilePlayground`'s `misconception()`.

interface MCtx {
  everReleased: boolean;
  rotating: boolean;
  /** The agent-force arrow is on screen. */
  forcesShown: boolean;
  /** The centripetal-acceleration arrow is on screen. */
  accelShown: boolean;
  /** The ball has actually been round past the top of a vertical circle. */
  sawTop: boolean;
  vertical: boolean;
  speed: number;
  vTop: number;
  centripetal: number;
  agentLabel: string;
  agentForce: number;
}

function misconception(
  code: MotionMisconception | undefined, x: MCtx,
): { heading: string; body: string } | null {
  if (!code) return null;
  switch (code) {
    case 'radial_departure':
      if (!x.everReleased) return null;
      return {
        heading: 'It did not fly outward. It carried straight on.',
        body: 'The faint dotted line running away from the centre is the path most students predict, and the ball is not on it. Nothing pushed the ball outward at any point — the string pulled **inward**, and removing an inward pull leaves no force in the plane at all.',
      };
    case 'centrifugal_in_ground':
      if (x.rotating) {
        return {
          heading: 'Centrifugal force has no agent.',
          body: 'Ask the question that settles every force: **which object is pushing?** For the string there is an answer. For this outward arrow there is none — it appeared the moment you chose a spinning frame and it will vanish the moment you step off. It is a correction term for the frame, not a force from anything.',
        };
      }
      if (!x.forcesShown) return null;
      return {
        heading: 'Count the arrows: not one of them points outward.',
        body: `In this, the ground frame, the only force acting sideways is **${x.agentLabel.toLowerCase()}** at ${fmt(Math.abs(x.agentForce), 2)} N, and it points at the centre. There is no outward force to draw. If you have been adding an outward mv²/r to free-body diagrams, that is the arrow to delete.`,
      };
    case 'speed_constant_in_ucm_means_no_accel':
      if (!x.accelShown) return null;
      return {
        heading: 'Steady speed, and the acceleration is not zero.',
        body: `The speed readout is sitting still at ${fmt(x.speed, 2)} m/s and the acceleration is ${fmt(x.centripetal, 2)} m/s². Velocity is a speed **and a direction**; the direction is changing every instant, so the velocity is changing, so there is an acceleration. "Constant speed" and "no acceleration" are not the same sentence.`,
      };
    case 'velocity_zero_at_apex':
      if (!x.sawTop || !x.vertical) return null;
      return {
        heading: 'At the top it is slowest — never zero.',
        body: `It went over the top doing **${fmt(x.vTop, 2)} m/s**. A ball that genuinely stopped up there would have nothing turning it and would drop straight out of the circle. That is precisely why there is a minimum speed at all.`,
      };
    default:
      return null;
  }
}

const agentName = (spec: CircularSpec): string => {
  if (spec.bankDeg !== undefined) return 'Centripetal force needed';
  switch (spec.agent) {
    case 'string': return 'String tension';
    case 'rod': return 'Rod force';
    case 'track-inside': return 'Track pushing inward';
    case 'track-outside': return 'Track pushing outward';
    case 'friction': return 'Friction needed';
    case 'gravity': return 'Gravity';
    default: return 'Agent force';
  }
};

export default function CircularArena({ block }: { block: MotionBenchBlock }) {
  // ── Resolve the exercise ───────────────────────────────────────────────────
  const archetypeId =
    block.archetype && CIRCULAR_ARCHETYPES[block.archetype]
      ? block.archetype
      : DEFAULT_CIRCULAR_ARCHETYPE[block.scenario] ?? 'uniform-basics';
  const arch = CIRCULAR_ARCHETYPES[archetypeId];

  // Keyed on CONTENT, never on the block object's identity — the autosaving
  // editor hands us a brand-new object on every keystroke.
  const paramsKey = JSON.stringify(block.params ?? {});
  const circularKey = JSON.stringify(block.circular ?? {});

  const baseSpec: CircularSpec = useMemo(() => {
    const s = circularSpecOf(archetypeId, block.params);
    const c = block.circular;
    if (c) {
      if (typeof c.radius === 'number') s.radius = Math.max(0.01, c.radius);
      if (typeof c.mass === 'number') s.mass = Math.max(0.0001, c.mass);
      if (typeof c.speed === 'number') s.omega = c.speed / s.radius;
      if (c.plane) s.plane = c.plane;
      if (c.agent) s.agent = c.agent;
      if (typeof c.bank === 'number') s.bankDeg = c.bank;
      if (typeof c.mu_s === 'number') s.mu_s = c.mu_s;
      if (typeof c.alpha === 'number') s.alphaTangential = c.alpha;
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, paramsKey, circularKey]);

  const g = G_EARTH;
  const height = block.height ?? 470;

  const initialView: ArenaView = CIRCULAR_VIEW[archetypeId] ?? 'arena';
  const [view, setView] = useState<ArenaView>(initialView);

  // ── Live, student-editable state ───────────────────────────────────────────
  // `speed` is the reference speed (bottom of a vertical circle, otherwise the
  // steady speed). It is the one knob the critical-speed exercise turns.
  const [speed, setSpeed] = useState(() => Math.abs(baseSpec.omega) * baseSpec.radius);
  const [radius, setRadius] = useState(baseSpec.radius);
  const [alpha, setAlpha] = useState(baseSpec.alphaTangential ?? 0);
  const [rate, setRate] = useState(1);
  // GUIDED, NEVER AUTO-PLAYING (design law #5). This started `true`, so with
  // `useAnimationFrame` firing on viewport entry the ball was already orbiting
  // before the student had read guided step 0 — every reveal pre-empted, and
  // the first impression "this is a video, not something I do". The guided
  // script's first CTA starts it; without a script, ▶ Play does.
  const [playing, setPlaying] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [step, setStep] = useState(block.guided === false ? 99 : 0);
  const [guess, setGuess] = useState<number | null>(null);
  const [entry, setEntry] = useState('');
  const [checked, setChecked] = useState(false);
  const [tries, setTries] = useState(0);
  const [banked, setBanked] = useState<BankedState>(() => ({
    radius: baseSpec.bankDeg !== undefined ? baseSpec.radius : 60,
    mass: baseSpec.bankDeg !== undefined ? baseSpec.mass : 1200,
    speed: baseSpec.bankDeg !== undefined ? Math.abs(baseSpec.omega) * baseSpec.radius : 20,
    bank: baseSpec.bankDeg ?? 15,
    mu: baseSpec.mu_s ?? 0.3,
  }));

  const spec: CircularSpec = useMemo(
    () => ({
      ...baseSpec,
      radius,
      omega: (speed / radius) * (baseSpec.omega < 0 ? -1 : 1),
      alphaTangential: view === 'nonuniform' || baseSpec.alphaTangential ? alpha : undefined,
    }),
    [baseSpec, radius, speed, alpha, view]
  );

  // ── Physics state lives in refs; ONE state bump per frame drives the render.
  // Keeping theta/trail/flight-index in React state instead would allocate a new
  // array 60 times a second and make the drag fight the animation for control.
  // Where the body starts: the BOTTOM of a loop (that is where the launch speed
  // is quoted), but the TOP for an outside track — a bridge crest at the bottom
  // of its own circle of curvature is not a thing.
  const startTheta = (sp: CircularSpec) =>
    sp.plane === 'vertical' && sp.agent !== 'track-outside' ? Math.PI : 0;
  const thetaRef = useRef(startTheta(baseSpec));
  const frameAngRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const flightIdxRef = useRef(0);
  // The constraint failing is a physical EVENT, announced and then handed back
  // to the student — never a release the sim performs on its own. `slackRef`
  // makes the announcement fire exactly once per failure.
  const slackRef = useRef(false);
  const [slackAt, setSlackAt] = useState<number | null>(null);
  /** Evidence for `velocity_zero_at_apex`: has the ball actually been over the
   *  top? A card that fires before the student has seen the top is a preamble. */
  const sawTopRef = useRef(false);
  const vTopRef = useRef(0);
  const [flight, setFlight] = useState<MotionState[] | null>(null);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  // The same element gates the animation loop (offscreen pause) and reports the
  // width the layout switch is driven off — measured, never a viewport query,
  // because this also renders in the admin editor's narrow split pane.
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const stacked = stageW > 0 && stageW < STACK_WIDTH;

  const steps = block.steps?.length ? block.steps : arch?.defaultSteps ?? [];
  const guided = block.guided !== false && steps.length > 0;
  const revealed = guided ? step : Infinity;
  const built = !guided || step >= steps.length;

  const flying = !!flight && flight.length > 0;
  const canvasView = view === 'arena' || view === 'cut' || view === 'vertical' || view === 'nonuniform';
  // A rotating frame is only offered where it teaches something: a HORIZONTAL
  // circle, where gravity is out of the drawing plane. Spinning the picture of a
  // vertical loop would also spin gravity, which is true for the observer but is
  // not the lesson and reads as a bug. An author can also switch the toggle off
  // per-block via `frames`.
  const framesAllowed = !block.frames || block.frames.includes('rotating');
  const showFrameToggle = canvasView && spec.plane === 'horizontal' && framesAllowed;

  const frameSpec: FrameSpec = rotating && showFrameToggle
    ? { kind: 'rotating', omega: spec.omega, centre: { x: 0, y: 0 } }
    : { kind: 'ground' };
  const inertial = isInertial(frameSpec);

  // ── Release: the handoff into the projectile integrator ────────────────────
  // A horizontal circle is seen from ABOVE, so gravity points into the page and
  // is balanced by the table — the ball runs dead straight. A vertical circle is
  // seen from the side, so the released ball is a projectile and falls. Two
  // different accelerations, one integrator.
  const groundY = -spec.radius * 1.85;

  const doRelease = React.useCallback((reason: string) => {
    if (flying) return;
    const s0 = releaseState(spec, thetaRef.current, { x: 0, y: 0 });
    const vertical = spec.plane === 'vertical';
    const far = spec.radius * 6;
    const traj = integrate(s0, gravityAccel(vertical ? g : 0), {
      dt: 1 / 240,
      stop: (s) => (vertical ? s.pos.y <= groundY : Math.hypot(s.pos.x, s.pos.y) > far),
      maxSteps: 5000,
    });
    flightIdxRef.current = 0;
    setFlight(traj.points.length > 1 ? traj.points : null);
    // Cutting while paused must still show the flight — otherwise the one
    // button the whole exercise is built around does nothing.
    setPlaying(true);
    void reason;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, flying, g, groundY]);

  const reset = () => {
    thetaRef.current = startTheta(spec);
    frameAngRef.current = 0;
    trailRef.current = [];
    flightIdxRef.current = 0;
    slackRef.current = false;
    sawTopRef.current = false;
    setSlackAt(null);
    setFlight(null);
    setPlaying(true);
    bump();
  };

  /** Anything that changes the motion invalidates a pending slack event and the
   *  evidence the misconception cards are gated on. */
  const rewind = () => {
    slackRef.current = false;
    sawTopRef.current = false;
    setSlackAt(null);
    setFlight(null);
    flightIdxRef.current = 0;
  };

  // ── The clock ──────────────────────────────────────────────────────────────
  // dt comes from the frame, never from an assumed frame rate.
  useAnimationFrame(
    (dt) => {
      const d = Math.min(dt, 0.05) * rate;
      if (flight && flight.length) {
        flightIdxRef.current = Math.min(flight.length - 1, flightIdxRef.current + Math.round(d * 240));
        // The frame keeps spinning after the ball is let go, which is what makes
        // the released path a genuine spiral in the rotating frame.
        frameAngRef.current += spec.omega * d;
        bump();
        return;
      }
      const v = speedAt(spec, thetaRef.current, g);
      const rd = readout(spec, thetaRef.current, g);
      if (rd.released && (spec.agent === 'string' || spec.agent === 'track-inside' || spec.agent === 'track-outside')) {
        // DO NOT RELEASE. This used to call doRelease() itself, so dragging the
        // speed below √(5gr) launched the ball into a projectile flight with no
        // button, no prediction and no warning — silently bypassing the
        // predict-first gate the flagship exercise is built on. Stop, name the
        // event the student caused, and let them let go of it.
        if (!slackRef.current) {
          slackRef.current = true;
          setSlackAt(thetaRef.current);
          setPlaying(false);
          bump();
        }
        return;
      }
      const dTheta = (v / spec.radius) * d;
      thetaRef.current = wrapAngle(thetaRef.current + dTheta);
      // Passing over the top is the evidence the "it stops at the top" card is
      // gated on, and the speed there is the number that refutes it.
      if (spec.plane === 'vertical' && (thetaRef.current < 0.35 || thetaRef.current > 2 * Math.PI - 0.35)) {
        sawTopRef.current = true;
        vTopRef.current = speedAt(spec, 0, g);
      }
      frameAngRef.current += spec.omega * d;
      trailRef.current = [...trailRef.current, posAt(spec, thetaRef.current, ORIGIN)].slice(-26);
      bump();
    },
    { target: wrapRef, enabled: playing && canvasView, maxDelta: 0.05 }
  );

  const theta = thetaRef.current;
  const rd = readout(spec, theta, g);
  // SVG rotate() is CLOCKWISE-positive because y points down, and the ball's
  // screen travel is clockwise exactly when omega is negative — so the group
  // rotation that cancels the ball's travel is simply the accumulated ω·t, with
  // no sign correction. Multiplying by a direction sign here (the obvious first
  // guess) parks the ball correctly for CCW and sends it round at DOUBLE speed
  // for CW.
  const frameRotDeg = rotating && showFrameToggle
    ? (frameAngRef.current * 180) / Math.PI
    : 0;

  // Velocity as seen from the chosen frame — in the rotating frame it should be
  // (very nearly) zero, which is the whole reason a fictitious force is needed.
  const inFrame = useMemo(() => {
    const s: MotionState = releaseState(spec, theta, { x: 0, y: 0 });
    return toFrame(s, frameSpec, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, theta, rotating]);
  const frameSpeed = Math.hypot(inFrame.vel.x, inFrame.vel.y);

  const layers = layersAt(revealed, spec, steps.length);
  const frameWord = rotating ? 'Rotating frame' : 'Ground frame';
  const status = flying
    ? spec.plane === 'vertical' ? 'In flight — projectile' : 'In flight — straight line'
    : rd.released ? 'Constraint failed'
      // The sim starts still now, so the one canvas text element has to say so —
      // a frozen ball with no word for it reads as a broken sim.
      : !playing ? `Paused · ${frameWord.toLowerCase()}`
        : frameWord;

  // ── Sidebar content ────────────────────────────────────────────────────────
  const period = rd.speed > 1e-6 ? (2 * Math.PI * spec.radius) / rd.speed : Infinity;

  const rows: Row[] = [
    { label: 'Speed', value: num(rd.speed, 'm/s'), color: MOTION, strong: true },
    { label: 'Angle from the top', value: `${fmt((theta * 180) / Math.PI, 0)}°` },
    { label: 'Centripetal accel v²/r', value: num(rd.centripetal, 'm/s²'), color: FORCE },
  ];
  if (layers.tangential && Math.abs(rd.tangential) > 1e-6) {
    rows.push({ label: 'Tangential accel', value: num(rd.tangential, 'm/s²'), color: FORCE });
    rows.push({ label: 'Total accel', value: num(rd.total, 'm/s²'), color: FORCE });
  }
  if (layers.agent) {
    rows.push({ label: agentName(spec), value: num(rd.agentForce, 'N'), color: FORCE });
  }
  rows.push({ label: 'Time for one turn', value: Number.isFinite(period) ? num(period, 's') : '—' });
  if (rotating) {
    rows.push({ label: 'Speed in THIS frame', value: num(frameSpeed, 'm/s'), color: FORCE });
  }
  if (rd.vMinTop !== undefined) {
    rows.push({ label: 'v needed at the top √(gr)', value: num(rd.vMinTop, 'm/s') });
    rows.push({ label: 'v needed at the bottom √(5gr)', value: num(vMinAtBottom(spec.radius, g), 'm/s') });
  }

  const legendItems = [
    layers.velocity && { color: MOTION, name: 'Velocity — along the tangent', value: num(rd.speed, 'm/s') },
    layers.centripetal && { color: FORCE, name: 'Centripetal acceleration — at the centre', value: num(rd.centripetal, 'm/s²') },
    layers.tangential && Math.abs(rd.tangential) > 1e-6 && { color: FORCE, name: 'Tangential acceleration', value: num(rd.tangential, 'm/s²'), dashed: true },
    layers.agent && { color: FORCE, name: agentName(spec), value: num(rd.agentForce, 'N') },
    layers.weight && { color: GHOST, name: 'Weight', value: num(spec.mass * g, 'N') },
    rotating && layers.centrifugal && { color: FORCE, name: 'Centrifugal — fictitious, this frame only', value: num(rd.centripetal * spec.mass, 'N'), dashed: true },
    flying && { color: GHOST, name: 'What most students predict (radially out)', dashed: true },
  ].filter(Boolean) as { color: string; name: string; value?: string; dashed?: boolean }[];

  // ── Exercises ──────────────────────────────────────────────────────────────
  const predict: PredictSpec | undefined =
    block.predict ?? (view === 'cut' ? CUT_PREDICT : undefined);
  const releaseAllowed =
    (block.allow_release ?? true) && (predict ? guess !== null : true) && !flying;
  // A constraint that has FAILED is a physical event, not the student choosing
  // to cut. `allow_release` governs the scissors; it must not be able to strand
  // a ball that the rope can no longer hold, with no way forward.
  const slackReleaseAllowed = (predict ? guess !== null : true) && !flying;
  // The archetype's declared misconception, fired only once the sim has shown
  // the evidence that contradicts it (design law #2).
  const card = misconception(arch?.targets, {
    everReleased: flying || flight !== null,
    rotating: rotating && showFrameToggle,
    forcesShown: layers.agent,
    accelShown: layers.centripetal,
    sawTop: sawTopRef.current,
    vertical: spec.plane === 'vertical',
    speed: rd.speed,
    vTop: vTopRef.current,
    centripetal: rd.centripetal,
    agentLabel: agentName(spec),
    agentForce: rd.agentForce,
  });

  const numeric = block.numeric;
  const entryVal = parseFloat(entry);
  const numericOk = numeric && checked && Number.isFinite(entryVal)
    ? Math.abs(entryVal - numeric.answer) <= (numeric.tolerance ?? 0.05)
    : false;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SimShell>
      <SimHeader
        title="Circular Motion"
        accentWord="Arena"
        subtitle={arch?.title ?? 'Centripetal force is a requirement, not a new force'}
        badge={block.caption ?? undefined}
        accent={MOTION}
      />

      <SimTabs
        tabs={ARENA_VIEWS.map((v) => ({ key: v.key, label: v.label, sub: v.sub }))}
        active={view}
        onChange={(k) => { setView(k as ArenaView); rewind(); }}
        accent={MOTION}
      />

      {block.title && (
        <p className="mb-3 text-base font-bold leading-snug text-white">
          <InlineMarkdown>{block.title}</InlineMarkdown>
        </p>
      )}

      {view === 'banked' && (
        <BankedRoadView state={banked} onChange={(p) => setBanked((s) => ({ ...s, ...p }))} g={g} />
      )}

      {view === 'instruments' && (
        <InstrumentsView
          initial={(CIRCULAR_INSTRUMENT[archetypeId] as InstrumentId | undefined) ?? 'conical'}
          g={g}
          mass={spec.mass}
        />
      )}

      {canvasView && (
        <div className="flex flex-col gap-4">
          {/* THE FRAME TOGGLE — first thing on the page, above the canvas, at
              full width. Choosing a frame IS the physics here. */}
          {showFrameToggle && (
            <>
              <FrameToggle rotating={rotating} onChange={setRotating} />
              {!inertial && <NonInertialBanner omega={spec.omega} />}
            </>
          )}

          <div
            ref={wrapRef}
            className={`grid grid-cols-1 gap-4 ${stacked ? '' : 'lg:grid-cols-[7fr_5fr] lg:items-start'}`}
          >
            {/* ── Canvas column ── */}
            <div className="flex flex-col gap-3">
              <ArenaCanvas
                spec={spec}
                theta={theta}
                g={g}
                rotating={!inertial}
                frameRotDeg={frameRotDeg}
                layers={layers}
                trail={trailRef.current}
                flight={flight}
                flightIndex={flightIdxRef.current}
                status={status}
                onScrub={(t) => {
                  // Never gated on `playing` — grab the ball whenever you like.
                  thetaRef.current = t;
                  trailRef.current = [];
                  setPlaying(false);
                  bump();
                }}
                height={height}
              />

              <Legend items={legendItems} />

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1" style={{ minWidth: 150 }}>
                  <ActionButton onClick={() => setPlaying((p) => !p)} tone="ghost">
                    {playing ? '❚❚ Pause' : '▶ Play'}
                  </ActionButton>
                </div>
                <div className="flex-1" style={{ minWidth: 150 }}>
                  <ActionButton onClick={reset} tone="ghost">↺ Reset</ActionButton>
                </div>
                {(view === 'cut' || view === 'arena') && (
                  <div className="flex-1" style={{ minWidth: 190 }}>
                    <ActionButton onClick={() => doRelease('student cut the string')} disabled={!releaseAllowed}>
                      ✂ Cut the string
                    </ActionButton>
                  </div>
                )}
              </div>

              {view === 'cut' && predict && guess === null && (
                <p className="text-[12px]" style={{ color: TEXT.muted }}>
                  The cut button unlocks once you have committed to an answer. Guessing after the
                  fact teaches nothing.
                </p>
              )}

              {/* The constraint has failed. Announced, never acted on: the sim
                  stops and hands the release back to the student, because
                  launching a projectile with no button and no prediction is
                  exactly the gate the flagship exercise is built on. */}
              {slackAt !== null && !flying && (
                <Card tone="warn">
                  <div className="mb-1.5">
                    <Pill tone="warn">
                      {spec.agent === 'string' ? 'The string has gone slack' : 'The track has let go'}
                    </Pill>
                  </div>
                  <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
                    You lowered the speed past what this circle needs, and at{' '}
                    {fmt((slackAt * 180) / Math.PI, 0)}° from the top the{' '}
                    {spec.agent === 'string' ? 'string' : 'track'} would have to{' '}
                    <b>pull outward</b> to keep the ball turning — and it cannot.{' '}
                    {spec.plane === 'vertical' && (
                      <>Below <b style={{ color: FORCE }}>{fmt(vMinAtBottom(spec.radius, g), 2)} m/s</b> at
                        the bottom the ball simply cannot get round.{' '}</>
                    )}
                    Nothing has been released yet. Before you let it go: where does it actually
                    go from here?
                  </p>
                  <div className="mt-2.5">
                    <ActionButton
                      onClick={() => { setSlackAt(null); doRelease('the constraint failed'); }}
                      disabled={!slackReleaseAllowed}
                    >
                      Let it go →
                    </ActionButton>
                  </div>
                  {!slackReleaseAllowed && predict && guess === null && (
                    <p className="mt-1.5 text-[12px]" style={{ color: TEXT.muted }}>
                      Commit to the prediction first.
                    </p>
                  )}
                </Card>
              )}

              {flying && (
                <Card tone="warn">
                  <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
                    {spec.plane === 'vertical'
                      ? 'The ball left along the TANGENT and is now a projectile — the very same integrator that runs Projectile Playground picked it up mid-flight, at the position and velocity it already had. Nothing reset.'
                      : 'Seen from above, with the table carrying the weight, there is now no force on the ball at all — so it runs dead straight along the TANGENT. The faint dotted line is the radial direction most students predict.'}
                  </p>
                </Card>
              )}

              {view === 'vertical' && <TensionPlot spec={spec} theta={theta} g={g} />}
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-3">
              {guided && (
                <GuidedPanel
                  steps={steps}
                  step={Math.min(step, steps.length)}
                  // The guided script is what starts the motion (design law #5).
                  onAdvance={() => { setStep((s) => s + 1); setPlaying(true); }}
                  doneMessage="That is the whole picture. Now drag the ball round the circle, change the sliders, and watch every number follow."
                />
              )}

              {predict && <PredictGate spec={predict} guess={guess} onGuess={setGuess} />}

              <Card>
                <div className="flex flex-col gap-2.5">
                  <Slider
                    label={spec.plane === 'vertical' ? 'Speed at bottom' : 'Speed'}
                    value={speed} min={0.5} max={25} step={0.1} unit="m/s"
                    onChange={(v) => { setSpeed(v); rewind(); }}
                  />
                  <Slider label="Radius" value={radius} min={0.3} max={6} step={0.1} unit="m"
                    onChange={(v) => { setRadius(v); rewind(); }} />
                  {view === 'nonuniform' && (
                    <Slider label="Tangential accel" value={alpha} min={-4} max={6} step={0.2} unit="m/s²"
                      onChange={setAlpha} accent={FORCE} />
                  )}
                  <Slider label="Playback" value={rate} min={0.1} max={1.5} step={0.05} unit="×"
                    onChange={setRate} accent={FORCE} />
                </div>
              </Card>

              {view === 'vertical' && (
                <Card tone={rd.released ? 'warn' : 'good'}>
                  <div className="mb-1.5">
                    <Pill tone={rd.released ? 'no' : 'ok'}>
                      {rd.released ? 'The string went slack' : 'It makes it round'}
                    </Pill>
                  </div>
                  <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                    Slowest speed at the <b>bottom</b> that still completes the loop:{' '}
                    <b style={{ color: FORCE }}>{fmt(vMinAtBottom(spec.radius, g), 2)} m/s</b>. At
                    that speed it arrives at the top doing{' '}
                    <b style={{ color: FORCE }}>{fmt(vMinAtTop(spec.radius, g), 2)} m/s</b>, with
                    exactly zero tension. Drag the speed slider onto it and watch the tension curve
                    just touch the zero line.
                  </p>
                </Card>
              )}

              <Readouts rows={rows} />

              {card && <MisconceptionCard heading={card.heading} body={card.body} />}

              {numeric && (
                <Card>
                  <p className="mb-2 text-sm" style={{ color: TEXT.primary }}>
                    <InlineMarkdown>{numeric.prompt}</InlineMarkdown>
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" inputMode="decimal" value={entry}
                      onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
                      placeholder="answer"
                      className="w-24 rounded-lg border px-2.5 py-1.5 text-sm tabular-nums outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: BORDER.card, color: TEXT.primary }}
                    />
                    {numeric.unit && (
                      <span className="text-xs font-semibold" style={{ color: TEXT.muted }}>{numeric.unit}</span>
                    )}
                    <button
                      onClick={() => { setChecked(true); setTries((n) => n + 1); }}
                      disabled={entry === ''}
                      className="rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                      style={{
                        background: entry === '' ? 'rgba(255,255,255,0.04)' : accentTint(MOTION, 0.18),
                        border: `1px solid ${entry === '' ? BORDER.card : accentTint(MOTION, 0.4)}`,
                        color: entry === '' ? TEXT.muted : MOTION,
                        cursor: entry === '' ? 'default' : 'pointer',
                      }}
                    >
                      Check
                    </button>
                    {checked && <Pill tone={numericOk ? 'ok' : 'no'}>{numericOk ? 'Correct' : 'Not yet'}</Pill>}
                  </div>
                  {/* The worked solution used to render on `checked` alone, so
                      one click with junk in the box handed it over. It now
                      arrives on a correct answer — or after three honest
                      attempts, because a dead end teaches nothing either. */}
                  {checked && (numericOk || tries >= 3) && (
                    <p className="mt-2 text-sm" style={{ color: TEXT.secondary }}>
                      <InlineMarkdown>{numeric.worked_reveal}</InlineMarkdown>
                    </p>
                  )}
                  {checked && !numericOk && tries < 3 && (
                    <p className="mt-2 text-[12px]" style={{ color: TEXT.muted }}>
                      Have another go — the working appears after three tries.
                    </p>
                  )}
                </Card>
              )}

              {built && (
                <ExpertTip accent={MOTION}>
                  {view === 'cut'
                    ? 'Nothing pushes a body outward. Take the inward pull away and it goes straight — that is Newton\'s first law, not a special rule for circles.'
                    : view === 'vertical'
                      ? 'At the top, gravity is already pointing at the centre. The string only has to supply what is left over — which is why the tension is smallest exactly where students expect it to be largest.'
                      : rotating
                        ? 'Centrifugal force has no agent. Ask "what object is pushing?" and there is no answer — because it is a bookkeeping term for a frame that is itself accelerating.'
                        : 'Centripetal is not a new kind of force. It is a JOB, and some real force — a string, friction, gravity, a wall — has to take the job.'}
                </ExpertTip>
              )}
            </div>
          </div>
        </div>
      )}

      {block.caption && view !== 'instruments' && (
        <p className="mt-4 text-[13px] leading-snug" style={{ color: TEXT.muted }}>
          <InlineMarkdown>{block.caption}</InlineMarkdown>
        </p>
      )}
    </SimShell>
  );
}
