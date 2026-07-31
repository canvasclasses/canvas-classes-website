/*
 * motion-lab/lib/integrate.ts — the E2 integrator.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no dependencies — so `scripts/verify-motion-lab.mjs`
 * can check the physics with a plain node run (PHYSICS_SIMULATION_PROGRAM.md §9:
 * "no academic claim ships unverified").
 *
 * Classical RK4 on the second-order system
 *
 *      dr/dt = v ,      dv/dt = a(state)
 *
 * with a FIXED step. RK4 is exact for polynomial solutions up to degree 4, so
 * the no-drag projectile (a quadratic in t) is reproduced to floating-point
 * precision — which is why the verifier can demand agreement with the closed
 * form to 1e-6 over a whole flight rather than to some hand-waved tolerance.
 *
 * IMPORTANT USAGE RULE (from the build brief): when there is NO drag, every
 * number shown to a student comes from `lib/projectile.ts` (closed form), never
 * from this file. An integrator's rounding must never be what a student reads
 * as "the answer". The integrator draws the path; algebra states the result.
 *
 * Convention, shared by all five engines: x right, y UP, SI units, angles in
 * degrees CCW from +x.
 */

import type {
  MotionState,
  AccelFn,
  DragModel,
  IntegratorOptions,
  Trajectory,
  TrajectoryEvent,
  Vec2,
} from '../types';

// ── Tiny local vector helpers ────────────────────────────────────────────────
// Deliberately module-private: nothing outside needs them, and every engine
// having its own two-line `add` is cheaper than a shared micro-module.

const v_add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
const v_scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });
const finite = (s: MotionState): boolean =>
  Number.isFinite(s.pos.x) && Number.isFinite(s.pos.y) &&
  Number.isFinite(s.vel.x) && Number.isFinite(s.vel.y);

/** The default fixed step. 1/240 s — four sub-steps per 60 Hz frame. */
export const DEFAULT_DT = 1 / 240;

/** Hard cap so an archetype whose `stop` never fires cannot hang the tab. */
const DEFAULT_MAX_STEPS = 20000;

/** Bisection depth used to land exactly on an event instead of on a step edge. */
const REFINE_ITERS = 48;

// ── One RK4 step ─────────────────────────────────────────────────────────────

/**
 * Advance one state by `dt` using classical RK4.
 *
 * The four velocity samples integrate the position and the four acceleration
 * samples integrate the velocity, so a velocity-dependent acceleration (drag)
 * is handled correctly rather than being frozen at the start of the step —
 * which is exactly where a naive Euler/Verlet version of this sim would drift
 * and quietly make the drag lesson wrong.
 */
export function step(s: MotionState, a: AccelFn, dt: number): MotionState {
  const a1 = a(s);

  const s2: MotionState = {
    t: s.t + dt / 2,
    pos: v_add(s.pos, v_scale(s.vel, dt / 2)),
    vel: v_add(s.vel, v_scale(a1, dt / 2)),
  };
  const a2 = a(s2);

  const s3: MotionState = {
    t: s.t + dt / 2,
    pos: v_add(s.pos, v_scale(s2.vel, dt / 2)),
    vel: v_add(s.vel, v_scale(a2, dt / 2)),
  };
  const a3 = a(s3);

  const s4: MotionState = {
    t: s.t + dt,
    pos: v_add(s.pos, v_scale(s3.vel, dt)),
    vel: v_add(s.vel, v_scale(a3, dt)),
  };
  const a4 = a(s4);

  const k = dt / 6;
  return {
    t: s.t + dt,
    pos: {
      x: s.pos.x + k * (s.vel.x + 2 * s2.vel.x + 2 * s3.vel.x + s4.vel.x),
      y: s.pos.y + k * (s.vel.y + 2 * s2.vel.y + 2 * s3.vel.y + s4.vel.y),
    },
    vel: {
      x: s.vel.x + k * (a1.x + 2 * a2.x + 2 * a3.x + a4.x),
      y: s.vel.y + k * (a1.y + 2 * a2.y + 2 * a3.y + a4.y),
    },
  };
}

/**
 * Smallest sub-step h in (0, dt] at which `hit` first becomes true, found by
 * bisection on genuine RK4 sub-steps (not by interpolating between the two
 * bracketing points). That matters: a linear interpolation of the landing point
 * would put the ground contact a few centimetres off, and the "measured range"
 * readout in drag mode would then disagree with the drawn curve.
 */
function refine(from: MotionState, a: AccelFn, dt: number, hit: (s: MotionState) => boolean): MotionState {
  let lo = 0;
  let hi = dt;
  for (let i = 0; i < REFINE_ITERS; i++) {
    const mid = (lo + hi) / 2;
    if (hit(step(from, a, mid))) hi = mid;
    else lo = mid;
  }
  return step(from, a, hi);
}

// ── Full integration ─────────────────────────────────────────────────────────

/**
 * Integrate from `s0` until `opts.stop` fires or `opts.maxSteps` is exhausted.
 *
 * `opts.stop` is NOT tested against `s0` — a ground-contact predicate is
 * trivially true at the launch instant when the launch height is zero, and
 * testing it up front would return an empty flight.
 *
 * Events recorded: `apex` (the vy zero-crossing, refined), `max-speed`, and —
 * when the stop predicate fires — `landing` plus `range` at the same state, so
 * a renderer can label the two independently.
 */
export function integrate(s0: MotionState, a: AccelFn, opts: IntegratorOptions): Trajectory {
  const dt = opts.dt > 0 ? opts.dt : DEFAULT_DT;
  const maxSteps = Math.max(1, opts.maxSteps ?? DEFAULT_MAX_STEPS);
  const stop = opts.stop;

  const points: MotionState[] = [s0];
  const events: TrajectoryEvent[] = [];
  let cur = s0;
  let stoppedAt: MotionState | undefined;

  for (let i = 0; i < maxSteps; i++) {
    const next = step(cur, a, dt);
    if (!finite(next)) break;

    // Apex — the LAST instant vy ≥ 0. Refined so "jump to apex" lands on the
    // real turning point, not up to dt early.
    if (cur.vel.y >= 0 && next.vel.y < 0) {
      events.push({
        kind: 'apex',
        at: refine(cur, a, dt, (s) => s.vel.y <= 0),
        label: 'apex',
      });
    }

    if (stop && stop(next)) {
      const landed = refine(cur, a, dt, stop);
      points.push(landed);
      stoppedAt = landed;
      events.push({ kind: 'landing', at: landed, label: 'landing' });
      events.push({ kind: 'range', at: landed, label: 'range' });
      break;
    }

    points.push(next);
    cur = next;
  }

  // Max speed — with drag on, this is the launch instant; without drag it is
  // the landing instant whenever the launch height is above the landing height.
  let fastest = points[0];
  let best = Math.hypot(fastest.vel.x, fastest.vel.y);
  for (const p of points) {
    const sp = Math.hypot(p.vel.x, p.vel.y);
    if (sp > best) { best = sp; fastest = p; }
  }
  events.push({ kind: 'max-speed', at: fastest });

  return stoppedAt ? { points, stoppedAt, events } : { points, events };
}

// ── Acceleration builders ────────────────────────────────────────────────────

/** Uniform gravity, magnitude `g`, pointing in −y. */
export function gravityAccel(g: number): AccelFn {
  const a: Vec2 = { x: 0, y: -g };
  return () => a;
}

/**
 * Wrap an acceleration with air resistance.
 *
 *   linear     F = −k·v            → a_drag = −(k/m)·v
 *   quadratic  F = −k·|v|·v        → a_drag = −(k/m)·|v|·v
 *
 * Dividing by the mass is the whole reason the heavier ball wins in air and
 * ties in vacuum — the `heavier_falls_faster` misconception is repaired by this
 * one division, so it must stay explicit rather than being folded into `k`.
 */
export function withDrag(base: AccelFn, drag: DragModel, mass: number): AccelFn {
  const m = mass > 0 ? mass : 1;
  return (s: MotionState): Vec2 => {
    const b = base(s);
    const speed = Math.hypot(s.vel.x, s.vel.y);
    const coeff = (drag.quadratic ? drag.k * speed : drag.k) / m;
    return { x: b.x - coeff * s.vel.x, y: b.y - coeff * s.vel.y };
  };
}

// ── Sampling ─────────────────────────────────────────────────────────────────

/**
 * The state at simulated time `t`, linearly interpolated between stored points.
 *
 * NOT part of the frozen contract, but it is the mechanism that makes the
 * split-screen honest: the trajectory dot, the x-strip dot, the y-strip dot and
 * every readout all call this with the SAME `t`, so the three views cannot
 * drift apart. Anything that owned its own clock would eventually disagree, and
 * the whole point of the lesson is that they are one motion.
 */
export function sampleAt(tr: Trajectory, t: number): MotionState {
  const pts = tr.points;
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (!first) return { t, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } };
  if (t <= first.t) return first;
  if (t >= last.t) return last;

  // Uniform steps except for the final refined one, so an index guess lands
  // within a step or two and a short linear scan finishes the job.
  const dt = pts.length > 1 ? pts[1].t - pts[0].t : 1;
  let i = Math.min(pts.length - 2, Math.max(0, Math.floor((t - first.t) / (dt || 1))));
  while (i > 0 && pts[i].t > t) i--;
  while (i < pts.length - 2 && pts[i + 1].t < t) i++;

  const a = pts[i];
  const b = pts[i + 1];
  const span = b.t - a.t;
  const f = span > 0 ? (t - a.t) / span : 0;
  return {
    t,
    pos: { x: a.pos.x + (b.pos.x - a.pos.x) * f, y: a.pos.y + (b.pos.y - a.pos.y) * f },
    vel: { x: a.vel.x + (b.vel.x - a.vel.x) * f, y: a.vel.y + (b.vel.y - a.vel.y) * f },
  };
}

/** Total duration of an integrated path, seconds. */
export const duration = (tr: Trajectory): number =>
  tr.points.length ? tr.points[tr.points.length - 1].t - tr.points[0].t : 0;

/**
 * Mechanical energy per unit mass, J/kg: ½v² + g·y.
 * Used by the verifier to prove the no-drag integration is conservative, and by
 * the drag archetype to show exactly how much energy the air took.
 */
export const specificEnergy = (s: MotionState, g: number): number =>
  0.5 * (s.vel.x * s.vel.x + s.vel.y * s.vel.y) + g * s.pos.y;
