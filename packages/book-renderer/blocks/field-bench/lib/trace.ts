/*
 * field-bench/lib/trace.ts — a charge released into a field.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ⚠ THIS FILE OWNS NO INTEGRATOR. Every trajectory here is produced by
 * `integrate` from `../../motion-lab/lib/integrate` — E2's RK4, the same
 * function that flies a projectile and swings a ball on a string.
 *
 * That is a claim about physics, and the shared code is what makes it true
 * rather than rhetorical: a charge in a uniform E field IS a projectile. Same
 * ODE, same stepper, same event refinement. If E5 had its own integrator, the
 * two engines could quietly disagree about the same problem, and "it's the same
 * physics" would be a slogan sitting on top of two different implementations.
 *
 * What this file DOES own is the acceleration function — the one line where
 * electrostatics and magnetism differ from gravity:
 *
 *        a = (q/m)·[E(r) + v × B]        charge in a field
 *        a = g(r)                        mass in a field — q/m cancels, which
 *                                        is why everything falls the same way
 *
 * v × B with v in the page and B = B_z ẑ out of it gives (v_y B_z, −v_x B_z, 0):
 * in-plane, perpendicular to v, and therefore doing zero work. The verifier
 * holds |v| constant to 1e-9 over a whole cyclotron orbit to prove the code
 * really has that property and is not merely described as having it.
 */

import type { FieldScene, TestCharge, Vec2 } from '../types';
import type { Bounds } from '../../mechanics-bench/lib/svg';
import type { AccelFn, MotionState, Trajectory } from '../../motion-lab/types';
import { integrate } from '../../motion-lab/lib/integrate';
import { sampleE, sampleG, sampleBz } from './field';
import { R_MIN } from './constants';

export interface TraceOptions {
  dt: number;
  maxSteps?: number;
  /** Stop when the particle leaves this box. Omit to run to `maxSteps`. */
  bounds?: Bounds;
  /** Stop when the particle gets this close to a source (it has "hit" it). */
  captureRadius?: number;
}

/**
 * The Lorentz acceleration for a particle of charge `q` and mass `m`.
 *
 * For a gravitational scene the field itself IS the acceleration: `charge` is
 * the mass, q/m = 1, and the returned function ignores both. That is not a
 * special case bolted on — it is the equivalence principle, and writing it as
 * one branch of the same function is the cheapest possible way to show a
 * student that the two look identical from inside the integrator.
 */
export function chargeAccel(scene: FieldScene, q: number, m: number): AccelFn {
  const mass = m > 0 ? m : 1;

  if (scene.kind === 'gravitational') {
    return (s: MotionState): Vec2 => sampleG(scene.sources, s.pos).field;
  }

  const qm = q / mass;
  return (s: MotionState): Vec2 => {
    const e = sampleE(scene.sources, s.pos).field;
    const bz = sampleBz(scene.sources, s.pos);
    // v × B for v = (vx, vy, 0), B = (0, 0, bz).
    const fx = e.x + s.vel.y * bz;
    const fy = e.y - s.vel.x * bz;
    return { x: qm * fx, y: qm * fy };
  };
}

/** Integrate one test charge. Returns motion-lab's `Trajectory` unchanged so a
 *  renderer can use `sampleAt` / `duration` from E2 without a shim. */
export function traceCharge(scene: FieldScene, tc: TestCharge, opts: TraceOptions): Trajectory {
  const s0: MotionState = {
    t: 0,
    pos: tc.pos,
    vel: tc.vel ?? { x: 0, y: 0 },
  };

  const captures = scene.sources
    .filter((s) => s.kind === 'point-charge' || s.kind === 'point-mass' || s.kind === 'line-charge')
    .map((s) => s.pos);
  const cap = Math.max(opts.captureRadius ?? 0, R_MIN);
  const b = opts.bounds;

  const stop = (b || captures.length)
    ? (s: MotionState): boolean => {
        if (b && (s.pos.x < b.minX || s.pos.x > b.maxX || s.pos.y < b.minY || s.pos.y > b.maxY)) return true;
        for (const c of captures) if (Math.hypot(s.pos.x - c.x, s.pos.y - c.y) < cap) return true;
        return false;
      }
    : undefined;

  return integrate(s0, chargeAccel(scene, tc.charge, tc.mass), {
    dt: opts.dt,
    maxSteps: opts.maxSteps ?? 4000,
    ...(stop ? { stop } : {}),
  });
}

// ── Closed forms the readouts must use ───────────────────────────────────────
// An integrator's rounding must never be what a student reads as "the answer"
// (the rule motion-lab states in its own header). The path is drawn by RK4;
// these three algebraic results are what the numbers on screen come from, and
// the verifier checks the drawn path against them rather than the other way
// round.

/** r = mv/(|q|B) — the radius of a charge's circle in a uniform field. */
export const cyclotronRadius = (mass: number, speed: number, charge: number, bz: number): number =>
  (mass * speed) / Math.abs(charge * bz);

/** T = 2πm/(|q|B) — independent of speed. A faster particle draws a bigger
 *  circle in exactly the same time, which is what makes the cyclotron work. */
export const cyclotronPeriod = (mass: number, charge: number, bz: number): number =>
  (2 * Math.PI * mass) / Math.abs(charge * bz);

/** ω = qB/m, signed: positive charge in a +z field turns clockwise in the page. */
export const cyclotronOmega = (charge: number, bz: number, mass: number): number =>
  -(charge * bz) / mass;

/** v = E/B — the one speed a velocity selector lets through, whatever the
 *  charge and whatever the mass. Both cancel, and that is the point of it. */
export const selectorSpeed = (eField: number, bz: number): number => eField / bz;

/** Speed of a state, m/s. */
export const speedOf = (s: MotionState): number => Math.hypot(s.vel.x, s.vel.y);

/** Largest fractional change in speed anywhere along a path. Zero for pure
 *  magnetic deflection — the assertion behind `magnetic_force_does_work`. */
export function speedDrift(tr: Trajectory): number {
  if (!tr.points.length) return 0;
  const v0 = speedOf(tr.points[0]);
  if (v0 === 0) return 0;
  let worst = 0;
  for (const p of tr.points) worst = Math.max(worst, Math.abs(speedOf(p) - v0) / v0);
  return worst;
}

/** Work done along the path by the total force, per unit mass × mass = J.
 *  Computed as ΔKE, so a "zero work" claim is measured, not assumed. */
export const workDone = (tr: Trajectory, mass: number): number => {
  if (tr.points.length < 2) return 0;
  const a = tr.points[0];
  const b = tr.points[tr.points.length - 1];
  return 0.5 * mass * (speedOf(b) ** 2 - speedOf(a) ** 2);
};
