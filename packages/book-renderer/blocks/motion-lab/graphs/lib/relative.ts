/*
 * motion-lab/graphs/lib/relative.ts — subtracting the frame.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Every closed form below is hand-derived in its own
 * comment and independently re-derived in `scripts/verify-graphs.mjs`.
 *
 * ── THE ONE MOVE STUDENTS CANNOT DO ─────────────────────────────────────────
 *      v_AB = v_A − v_B
 * and its consequence, v_AB = −v_BA. Everything in this file is that
 * subtraction wearing a different costume: a boat in a current, rain on a walk,
 * a train passing a train. The renderer draws it as a VECTOR CONSTRUCTION that
 * updates as the student drags, because the subtraction is geometric and the
 * formula is where it stops being obvious.
 *
 * The frame transforms themselves come from the frozen engine — `toFrame` and
 * `transformTrajectory` in `../../lib/frames.ts`. This file supplies the SCENE
 * closed forms (crossing time, drift, minimum-drift heading, umbrella tilt,
 * overtaking time) that the sim quotes as answers, since the engine's job is
 * kinematics and not "which way should I point the boat".
 */

import { toFrame, transformTrajectory } from '../../lib/frames';
import { integrate } from '../../lib/integrate';
import type { FrameSpec, MotionState, Trajectory, Vec2 } from '../../types';

export { toFrame, transformTrajectory };

const DEG = Math.PI / 180;
const EPS = 1e-12;

export const rad = (d: number): number => d * DEG;
export const deg = (r: number): number => r / DEG;

// ── The subtraction itself ───────────────────────────────────────────────────

/** v_AB = v_A − v_B. The whole chapter in one line. */
export const relativeVelocity = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });

export const negate = (v: Vec2): Vec2 => ({ x: -v.x, y: -v.y });
export const mag = (v: Vec2): number => Math.hypot(v.x, v.y);

/** Direction of a vector, degrees CCW from +x. Engine convention. */
export const dirDeg = (v: Vec2): number => deg(Math.atan2(v.y, v.x));

/**
 * The 1-D case, which is where the marks are lost.
 *
 * Same direction: v_AB = v_A − v_B, and the two SPEEDS subtract.
 * Opposite directions: one of the signs is already negative, so the same
 * subtraction makes the two speeds ADD. Students memorise "add if opposite,
 * subtract if same" as two rules; it is one rule and a sign.
 */
export function relative1D(vA: number, vB: number): { vAB: number; vBA: number; sameDirection: boolean } {
  return {
    vAB: vA - vB,
    vBA: vB - vA,
    sameDirection: vA * vB > 0,
  };
}

/**
 * How long train A takes to completely pass train B.
 *
 * The length that has to be covered is L_A + L_B — from "A's nose level with B's
 * tail" to "A's tail level with B's nose" — and the speed that covers it is the
 * RELATIVE speed, never either train's ground speed. Returns null when the
 * relative velocity is zero, because then it never passes and a number there
 * would be a lie.
 */
export function overtakeTime(vA: number, vB: number, lenA: number, lenB: number): number | null {
  const rel = Math.abs(vA - vB);
  if (rel < EPS) return null;
  return (lenA + lenB) / rel;
}

// ── River crossing ───────────────────────────────────────────────────────────

export interface RiverSpec {
  /** m — bank-to-bank, across the current. */
  width: number;
  /** m/s — downstream, along +x. */
  current: number;
  /** m/s — the boat's speed relative to the WATER. */
  boat: number;
  /** ° — heading measured from "straight across", positive = angled upstream. */
  headingDeg: number;
}

export interface RiverResult {
  /** The boat's velocity relative to the water, m/s. */
  vBoatWater: Vec2;
  /** The boat's velocity relative to the GROUND — the vector sum. */
  vBoatGround: Vec2;
  /** s — null when the across component is zero or backwards (it never lands). */
  crossTime: number | null;
  /** m — downstream displacement on arrival. Negative means it landed upstream. */
  drift: number | null;
  /** The two extremal strategies, so the sim can contrast them. */
  minTime: { headingDeg: number; time: number; drift: number };
  minDrift: {
    headingDeg: number;
    time: number;
    drift: number;
    /** True when the current wins and zero drift is impossible. */
    unavoidable: boolean;
  };
}

/**
 * Solve the crossing.
 *
 * Geometry: +y is across (toward the far bank), +x is downstream. A heading θ
 * upstream of straight-across gives the boat, relative to the water,
 *
 *      v_bw = ( −v_b sin θ ,  v_b cos θ )
 *
 * and the ground velocity is that plus the current (v_c, 0):
 *
 *      v_bg = ( v_c − v_b sin θ ,  v_b cos θ )
 *
 * ── MINIMUM TIME. ───────────────────────────────────────────────────────────
 * The across component is v_b cos θ, largest at θ = 0. So the quickest crossing
 * is to point STRAIGHT AT the far bank and accept the drift:
 *      t_min = w / v_b ,   drift = v_c · w / v_b
 * This is the one students get wrong: they angle upstream because it "fights
 * the current", which is right for landing opposite and wrong for arriving
 * soonest. Angling upstream steals from the only component that gets you across.
 *
 * ── MINIMUM DRIFT. ──────────────────────────────────────────────────────────
 * If v_b > v_c the drift can be made exactly zero by cancelling the current:
 *      v_b sin θ = v_c   →   θ = asin(v_c / v_b) ,
 *      t = w / (v_b cos θ) = w / √(v_b² − v_c²)
 * If v_b < v_c the current cannot be cancelled and the drift has a floor.
 * Minimising d(θ) = (w/v_b)(v_c sec θ − v_b tan θ):
 *      d′ = (w sec θ / v_b)(v_c tan θ − v_b sec θ) = 0  →  v_c sin θ = v_b
 *      →  sin θ = v_b / v_c ,  cos θ = √(v_c² − v_b²)/v_c
 *      →  d_min = (w/v_b)(v_c² − v_b²)/√(v_c² − v_b²) = (w/v_b)·√(v_c² − v_b²)
 * which is the standard result, and note that it is the boat speed in the
 * DENOMINATOR — a faster boat drifts less, as it must.
 */
export function solveRiver(spec: RiverSpec): RiverResult {
  const { width: w, current: c, boat: b } = spec;
  const th = rad(spec.headingDeg);

  const vBoatWater: Vec2 = { x: -b * Math.sin(th), y: b * Math.cos(th) };
  const vBoatGround: Vec2 = { x: c + vBoatWater.x, y: vBoatWater.y };

  const across = vBoatGround.y;
  const crossTime = across > EPS ? w / across : null;
  const drift = crossTime === null ? null : vBoatGround.x * crossTime;

  // Minimum time — straight across.
  const tMin = b > EPS ? w / b : Infinity;
  const minTime = { headingDeg: 0, time: tMin, drift: c * tMin };

  // Minimum drift.
  let minDrift: RiverResult['minDrift'];
  if (b > c + EPS) {
    const thZero = Math.asin(clamp01(c / b));
    const t = w / (b * Math.cos(thZero));
    minDrift = { headingDeg: deg(thZero), time: t, drift: 0, unavoidable: false };
  } else if (c > EPS && b > EPS) {
    const thBest = Math.asin(clamp01(b / c));
    const t = w / (b * Math.cos(thBest));
    minDrift = {
      headingDeg: deg(thBest),
      time: t,
      drift: (w / b) * Math.sqrt(Math.max(0, c * c - b * b)),
      unavoidable: true,
    };
  } else {
    minDrift = { headingDeg: 0, time: tMin, drift: 0, unavoidable: false };
  }

  return { vBoatWater, vBoatGround, crossTime, drift, minTime, minDrift };
}

const clamp01 = (v: number): number => Math.min(1, Math.max(-1, v));

/** The boat's ground path, integrated by the ENGINE so the drawn line and the
 *  closed-form drift cannot disagree. Zero acceleration, so RK4 is exact. */
export function riverPath(spec: RiverSpec): Trajectory {
  const r = solveRiver(spec);
  const s0: MotionState = { t: 0, pos: { x: 0, y: 0 }, vel: r.vBoatGround };
  return integrate(s0, () => ({ x: 0, y: 0 }), {
    dt: 1 / 60,
    stop: (s) => s.t > 1e-9 && s.pos.y >= spec.width,
    maxSteps: 12000,
  });
}

/** The same crossing as the WATER sees it: a straight line at the heading, with
 *  no drift at all. Uses the engine's frame transform, not a second formula. */
export function riverPathInWaterFrame(spec: RiverSpec): Trajectory {
  const frame: FrameSpec = { kind: 'translating', vel: { x: spec.current, y: 0 } };
  return transformTrajectory(riverPath(spec), frame);
}

// ── Rain and the walking man ─────────────────────────────────────────────────

export interface RainResult {
  /** Rain's ground velocity — straight down unless the author adds wind. */
  vRain: Vec2;
  /** The walker's ground velocity. */
  vMan: Vec2;
  /** v_rain,man = v_rain − v_man. What the walker actually feels. */
  vRelative: Vec2;
  /** ° from vertical, positive = tilt FORWARD into the direction of travel. */
  umbrellaTiltDeg: number;
  /** m/s — how hard it feels. */
  apparentSpeed: number;
}

/**
 * The umbrella problem.
 *
 * Rain falls at (w_x, −v_r); you walk at (v_m, 0). What you feel is
 *
 *      v_rain,man = (w_x − v_m, −v_r)
 *
 * i.e. the rain acquires a BACKWARD horizontal component equal to your own
 * forward speed. So you tilt the umbrella FORWARD by
 *
 *      tan(tilt) = (v_m − w_x) / v_r
 *
 * measured from the vertical. With no wind and v_m = 5, v_r = 10 that is
 * atan(0.5) = 26.565°, forward. Stop walking and the tilt goes to zero — which
 * is the whole point: the slant is a property of YOUR MOTION, not of the rain.
 * Every student who has run through a shower has produced this result with their
 * body and never connected it to v_A − v_B.
 */
export function solveRain(rainSpeed: number, walkSpeed: number, windX = 0): RainResult {
  const vRain: Vec2 = { x: windX, y: -Math.abs(rainSpeed) };
  const vMan: Vec2 = { x: walkSpeed, y: 0 };
  const vRelative = relativeVelocity(vRain, vMan);
  // Tilt from vertical, positive forward (i.e. toward +x, the way you walk).
  const tilt = deg(Math.atan2(-vRelative.x, Math.abs(vRelative.y) || EPS));
  return {
    vRain,
    vMan,
    vRelative,
    umbrellaTiltDeg: tilt,
    apparentSpeed: mag(vRelative),
  };
}

// ── Two trains ───────────────────────────────────────────────────────────────

export interface TrainsResult {
  vAB: number;
  vBA: number;
  sameDirection: boolean;
  /** s — null when they never pass. */
  passTime: number | null;
  /** m — the gap that has to be covered: both lengths. */
  passLength: number;
  /** What a passenger on B measures A doing, as a full state, via the engine. */
  aSeenFromB: MotionState;
}

export function solveTrains(vA: number, vB: number, lenA: number, lenB: number): TrainsResult {
  const r = relative1D(vA, vB);
  // Routed through the engine's own frame transform rather than a second
  // subtraction, so "what B sees" is literally the engine's answer.
  const frame: FrameSpec = { kind: 'translating', vel: { x: vB, y: 0 } };
  const aSeenFromB = toFrame({ t: 0, pos: { x: 0, y: 0 }, vel: { x: vA, y: 0 } }, frame, 0);
  return {
    vAB: r.vAB,
    vBA: r.vBA,
    sameDirection: r.sameDirection,
    passTime: overtakeTime(vA, vB, lenA, lenB),
    passLength: lenA + lenB,
    aSeenFromB,
  };
}
