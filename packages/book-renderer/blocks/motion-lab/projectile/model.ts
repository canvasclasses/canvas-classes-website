/*
 * motion-lab/projectile/model.ts — config resolution, scene building, viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Everything the Playground draws is computed here from
 * plain numbers, so the component below is layout and interaction only — and so
 * the physics stays checkable by `scripts/verify-motion-lab.mjs`.
 *
 * Two rules encoded in this file are worth stating out loud:
 *
 * 1. ONE TRAJECTORY, MANY VIEWS. The trajectory dot, the horizontal strip, the
 *    vertical strip, the graphs and every readout are all derived from a single
 *    integrated path sampled at a single simulated time. Nothing here owns a
 *    clock. That is what makes "these are the same motion" true rather than
 *    merely asserted.
 * 2. ALGEBRA STATES THE ANSWER, THE INTEGRATOR DRAWS THE PATH. With drag off,
 *    `exact` carries the closed-form range / apex / time of flight and those are
 *    what the readout panel shows. With drag on there is no closed form, the
 *    numbers come from the path, and the panel says "measured".
 */

import type { MotionBenchBlock } from '@canvas/data/types/books';
import type {
  MotionArchetype, MotionState, StripSpec, Trajectory, AccelFn, StripAxis,
} from '../types';
import { integrate, gravityAccel, withDrag, DEFAULT_DT } from '../lib/integrate';
import * as P from '../lib/projectile';

// ── Resolved controls ────────────────────────────────────────────────────────

export interface Controls {
  speed: number;
  angle: number;
  height: number;
  g: number;
  mass: number;
  dragOn: boolean;
  dragK: number;
  dragQuadratic: boolean;
  incline: number;
  frameVx: number;
  targetX: number;
  targetY: number;
  monkeyX: number;
  monkeyY: number;
}

export interface Flags {
  strips: boolean;
  showIdeal: boolean;
  rangeCurve: boolean;
  pair: boolean;
  sweep: boolean;
  axisRotate: boolean;
  massCompare: boolean;
  dropRace: boolean;
  envelope: boolean;
  components: boolean;
  vectors: boolean;
  grid: boolean;
  trail: boolean;
  readout: boolean;
  hasTarget: boolean;
}

export type ProjectileScenario = 'projectile' | 'projectile-incline' | 'monkey-hunter' | 'relative';

export interface Setup {
  scenario: ProjectileScenario;
  controls: Controls;
  flags: Flags;
  strips: StripSpec[];
  steps: { say: string; cta: string }[];
  guided: boolean;
  frames: ('ground' | 'translating' | 'accelerating' | 'rotating')[];
  title: string;
  subtitle: string;
}

// ── Param plumbing ───────────────────────────────────────────────────────────

type Bag = Record<string, number | string | boolean> | undefined;

const num = (bag: Bag, key: string, fallback: number): number =>
  bag && typeof bag[key] === 'number' && Number.isFinite(bag[key] as number) ? (bag[key] as number) : fallback;
const bool = (bag: Bag, key: string, fallback: boolean): boolean =>
  bag && typeof bag[key] === 'boolean' ? (bag[key] as boolean) : fallback;
const str = (bag: Bag, key: string, fallback: string): string =>
  bag && typeof bag[key] === 'string' ? (bag[key] as string) : fallback;

/** An archetype's `params` defaults, flattened into the same shape as `block.params`. */
function archDefaults(arch?: MotionArchetype): Record<string, number | string | boolean> {
  const out: Record<string, number | string | boolean> = {};
  for (const p of arch?.params ?? []) out[p.key] = p.default;
  return out;
}

const ACCENT_BY_AXIS: Record<StripAxis, StripSpec['accent']> = {
  x: 'violet', vx: 'violet', ax: 'violet',
  y: 'sky', vy: 'sky', ay: 'sky',
  speed: 'violet',
};

/**
 * The two strips shown by default. NOT a hidden tab — the split screen is the
 * point of the module, so it is what a bare `motion_lab` block renders.
 */
const DEFAULT_STRIPS: StripSpec[] = [
  { axis: 'x', label: 'Horizontal — steady, forever', mode: 'line', unit: 'm', accent: 'violet' },
  { axis: 'y', label: 'Vertical — an ordinary throw', mode: 'line', unit: 'm', accent: 'sky' },
];

/**
 * Resolve a block against its archetype into flat numbers.
 * Priority: block.projectile field → block.params → archetype default → hard default.
 */
export function resolveSetup(block: MotionBenchBlock, arch?: MotionArchetype): Setup {
  const defaults = archDefaults(arch);
  const p = { ...defaults, ...(block.params ?? {}) };
  const proj = block.projectile;

  const dragSpec = proj?.drag;
  const dragModel = str(p, 'drag_model', dragSpec?.quadratic === false ? 'linear' : 'quadratic');

  const controls: Controls = {
    speed: proj?.speed ?? num(p, 'speed', 20),
    angle: proj?.angle ?? num(p, 'angle', 45),
    height: proj?.height ?? num(p, 'height', 0),
    g: proj?.g ?? num(p, 'g', 9.8),
    mass: num(p, 'mass', 1),
    dragOn: !!dragSpec || bool(p, 'drag', false),
    dragK: dragSpec?.k ?? num(p, 'drag_k', 0.06),
    dragQuadratic: dragModel !== 'linear',
    incline: proj?.incline ?? num(p, 'incline', 0),
    frameVx: num(p, 'frame_vx', proj?.speed ?? num(p, 'speed', 20)),
    targetX: proj?.target?.x ?? num(p, 'target_x', 28),
    targetY: proj?.target?.y ?? num(p, 'target_y', 0),
    monkeyX: num(p, 'monkey_x', 30),
    monkeyY: num(p, 'monkey_y', 14),
  };

  const show = block.show ?? {};
  const flags: Flags = {
    strips: bool(p, 'show_strips', true),
    showIdeal: bool(p, 'show_ideal', false),
    rangeCurve: bool(p, 'range_curve', false),
    pair: bool(p, 'pair', false),
    sweep: bool(p, 'sweep', false),
    axisRotate: bool(p, 'axis_rotate', block.scenario === 'projectile-incline'),
    massCompare: bool(p, 'mass_compare', false),
    dropRace: bool(p, 'drop_race', false),
    envelope: show.envelope ?? bool(p, 'envelope', false),
    components: show.components ?? bool(p, 'components', true),
    vectors: show.vectors ?? bool(p, 'vectors', true),
    grid: show.grid ?? true,
    trail: show.trail ?? true,
    readout: show.readout ?? true,
    // A `target_x` param IS the target — requiring a separate `target: true`
    // alongside it was a trap that silently produced a target-practice scene
    // with no target in it.
    hasTarget: !!proj?.target || bool(p, 'target', typeof p['target_x'] === 'number'),
  };

  const scenario: ProjectileScenario =
    block.scenario === 'projectile-incline' || block.scenario === 'monkey-hunter' || block.scenario === 'relative'
      ? block.scenario
      : 'projectile';

  const strips = (block.strips?.length
    ? block.strips.map((s) => ({ ...s, accent: ACCENT_BY_AXIS[s.axis] }))
    : DEFAULT_STRIPS) as StripSpec[];

  const steps = block.steps ?? arch?.defaultSteps ?? [];

  return {
    scenario,
    controls,
    flags,
    strips,
    steps,
    guided: !!block.guided && steps.length > 0,
    frames: block.frames ?? [],
    title: block.title ?? arch?.title ?? 'Projectile',
    subtitle: arch?.summary ?? block.caption ?? '',
  };
}

/**
 * A stable content key for the resolved controls. Used to re-seed the live
 * sliders when the AUTHORED values change — never the block's object identity,
 * because the admin books-editor recreates the block on every keystroke and an
 * identity-keyed effect would reset a student's shot mid-drag.
 */
export const controlsKey = (c: Controls): string =>
  [c.speed, c.angle, c.height, c.g, c.mass, c.dragOn, c.dragK, c.dragQuadratic,
   c.incline, c.frameVx, c.targetX, c.targetY, c.monkeyX, c.monkeyY].join('|');

// ── Scene building ───────────────────────────────────────────────────────────

/** Ground/slope height at a horizontal distance x. */
export const surfaceY = (c: Controls, x: number): number =>
  c.incline === 0 ? 0 : c.height + x * Math.tan((c.incline * Math.PI) / 180);

function accelOf(c: Controls, dragOn: boolean): AccelFn {
  const base = gravityAccel(c.g);
  if (!dragOn || c.dragK <= 0) return base;
  return withDrag(base, { k: c.dragK, quadratic: c.dragQuadratic }, c.mass);
}

function stopOf(c: Controls, scenario: ProjectileScenario) {
  if (scenario === 'projectile-incline') {
    const tanB = Math.tan((c.incline * Math.PI) / 180);
    return (s: MotionState) => s.t > 1e-9 && s.pos.y <= c.height + s.pos.x * tanB;
  }
  return (s: MotionState) => s.t > 1e-9 && s.pos.y <= 0;
}

function fly(c: Controls, scenario: ProjectileScenario, angle: number, dragOn: boolean, mass = c.mass, dt = DEFAULT_DT): Trajectory {
  const accel = dragOn && c.dragK > 0
    ? withDrag(gravityAccel(c.g), { k: c.dragK, quadratic: c.dragQuadratic }, mass)
    : gravityAccel(c.g);
  return integrate(P.launchState(c.speed, angle, c.height), accel, { dt, stop: stopOf(c, scenario), maxSteps: 6000 });
}

export interface Exact {
  /** True when these came from the closed form (drag off) rather than the path. */
  closedForm: boolean;
  range: number;
  apexT: number;
  apexX: number;
  apexY: number;
  flightTime: number;
  optimum: number;
  ux: number;
  uy: number;
}

export interface Scene {
  live: Trajectory;
  /** The no-drag reference, drawn pale behind the real one. */
  ideal: Trajectory | null;
  /** The complementary-angle partner (level ground only). */
  partner: Trajectory | null;
  /** A 10× heavier ball — identical in vacuum, ahead of the light one in air. */
  heavy: Trajectory | null;
  /** A ball simply dropped from the same height at the same instant. */
  dropped: Trajectory | null;
  /** The monkey's free fall from its branch. */
  monkey: Trajectory | null;
  exact: Exact;
  /** Where the flight ends, in world coordinates. */
  landing: MotionState;
  duration: number;
}

export function buildScene(c: Controls, scenario: ProjectileScenario, flags: Flags): Scene {
  const live = fly(c, scenario, c.angle, c.dragOn);
  const last = live.points[live.points.length - 1];
  const landing = live.stoppedAt ?? last;

  // The vacuum ghost only exists when there IS air to contrast with — with drag
  // off the live path already is the ideal one, and a second identical curve
  // behind it would just look like a rendering bug.
  const ideal = c.dragOn && c.dragK > 0 ? fly(c, scenario, c.angle, false) : null;
  const partner = flags.pair && c.height === 0 && scenario === 'projectile'
    ? fly(c, scenario, P.complementaryAngle(c.angle), c.dragOn)
    : null;
  const heavy = flags.massCompare ? fly(c, scenario, c.angle, c.dragOn, c.mass * 10) : null;

  const dropped = flags.dropRace
    ? integrate({ t: 0, pos: { x: 0, y: c.height }, vel: { x: 0, y: 0 } }, accelOf(c, c.dragOn),
        { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0, maxSteps: 6000 })
    : null;

  const monkey = scenario === 'monkey-hunter'
    ? integrate({ t: 0, pos: { x: c.monkeyX, y: c.monkeyY }, vel: { x: 0, y: 0 } }, gravityAccel(c.g),
        { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0, maxSteps: 6000 })
    : null;

  const { ux, uy } = P.components(c.speed, c.angle);
  const closedForm = !c.dragOn || c.dragK <= 0;
  const a = P.apex(c.speed, c.angle, c.height, c.g);

  const exact: Exact = closedForm
    ? {
        closedForm: true,
        range: scenario === 'projectile-incline'
          ? P.rangeOnIncline(c.speed, c.angle, c.incline, c.g)
          : P.range(c.speed, c.angle, c.height, c.g),
        apexT: a.t, apexX: a.x, apexY: a.y,
        flightTime: scenario === 'projectile-incline'
          ? P.timeOfFlightOnIncline(c.speed, c.angle, c.incline, c.g)
          : P.timeOfFlight(c.speed, c.angle, c.height, c.g),
        optimum: scenario === 'projectile-incline'
          ? P.optimumAngleOnIncline(c.incline)
          : P.optimumAngle(c.speed, c.height, c.g),
        ux, uy,
      }
    : (() => {
        const ap = live.events.find((e) => e.kind === 'apex')?.at;
        return {
          closedForm: false,
          range: scenario === 'projectile-incline'
            ? Math.hypot(landing.pos.x, landing.pos.y - c.height)
            : landing.pos.x,
          apexT: ap?.t ?? 0, apexX: ap?.pos.x ?? 0, apexY: ap?.pos.y ?? c.height,
          flightTime: landing.t,
          optimum: P.optimumAngle(c.speed, c.height, c.g),
          ux, uy,
        };
      })();

  return { live, ideal, partner, heavy, dropped, monkey, exact, landing, duration: landing.t };
}

/**
 * The fan of trajectories used by the envelope / range-vs-angle sweep.
 * Coarser dt on purpose — 17 paths at 1/240 s is 40 000 points for a picture
 * whose whole job is to be a silhouette.
 */
export function buildFan(c: Controls, scenario: ProjectileScenario, from = 5, to = 85, stepDeg = 5): Trajectory[] {
  const out: Trajectory[] = [];
  for (let a = from; a <= to + 1e-9; a += stepDeg) out.push(fly(c, scenario, a, c.dragOn, c.mass, 1 / 90));
  return out;
}

// ── Viewport ─────────────────────────────────────────────────────────────────

export interface View {
  w: number;
  h: number;
  scale: number;
  /** Screen pixel of world x = 0. */
  ox: number;
  /** Screen pixel of world y = 0. */
  oy: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const sx = (v: View, x: number): number => v.ox + x * v.scale;
export const sy = (v: View, y: number): number => v.oy - y * v.scale;

/**
 * Build a viewport with EQUAL x and y scale.
 *
 * Equal aspect is non-negotiable here: a stretched y axis makes a 30° launch
 * look like a 60° one, which would quietly contradict the very readout printed
 * next to it. Instead of stretching, the view keeps the scale honest and simply
 * shows more empty sky — the scale is chosen from whichever axis is tighter and
 * the bounds are then grown to fill the box.
 */
export function makeView(
  w: number, h: number,
  world: { xMin: number; xMax: number; yMin: number; yMax: number },
  pad = { l: 30, r: 16, t: 16, b: 30 }
): View {
  const availW = Math.max(20, w - pad.l - pad.r);
  const availH = Math.max(20, h - pad.t - pad.b);
  const spanX = Math.max(1e-3, world.xMax - world.xMin);
  const spanY = Math.max(1e-3, world.yMax - world.yMin);
  const scale = Math.max(0.5, Math.min(availW / spanX, availH / spanY));

  // Grow the visible window to fill the box at the chosen scale.
  const xMax = world.xMin + availW / scale;
  const yMax = world.yMin + availH / scale;

  return {
    w, h, scale,
    ox: pad.l - world.xMin * scale,
    oy: h - pad.b + world.yMin * scale,
    xMin: world.xMin, xMax, yMin: world.yMin, yMax,
  };
}

/**
 * Bounds over every point the scene will actually draw, computed in DISPLAY
 * space (after the frame transform and any axis rotation) rather than in world
 * space. Doing it on the display points is what keeps the cart-frame view and
 * the rotated-axis view framed correctly without a special case for each.
 */
export function boundsOfPoints(groups: { x: number; y: number }[][]) {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const g of groups) {
    for (const p of g) {
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.y > yMax) yMax = p.y;
    }
  }
  if (!Number.isFinite(xMin)) { xMin = 0; xMax = 10; yMin = 0; yMax = 6; }
  const spanX = Math.max(xMax - xMin, 4);
  const spanY = Math.max(yMax - yMin, 3);
  return {
    xMin: xMin - 0.06 * spanX,
    xMax: xMax + 0.08 * spanX,
    yMin: Math.min(0, yMin) - 0.04 * spanY,
    yMax: yMax + 0.14 * spanY,
  };
}
