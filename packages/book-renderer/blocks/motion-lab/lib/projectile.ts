/*
 * motion-lab/lib/projectile.ts — closed-form projectile results.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * WHY THIS FILE EXISTS ALONGSIDE AN INTEGRATOR. The integrator draws the path;
 * this file states the answer. Every number a student READS in the no-drag case
 * comes from here, because an integrator's accumulated rounding must never be
 * what a student copies into their notebook — and because these are the exact
 * expressions the algebra panel shows them deriving. When drag is switched on
 * there IS no closed form, and the readouts switch to measured values and say
 * so on screen.
 *
 * CONVENTION. Launch from (0, h0) at `speed` u, `angleDeg` θ measured from the
 * HORIZONTAL (not from any incline — see `rangeOnIncline` for the conversion),
 * gravity g downward. x is measured from the launch point; y is measured from
 * the GROUND, so a launch at h0 = 2 m has y = 2 at t = 0.
 *
 * ── Source of the formulas ───────────────────────────────────────────────────
 * The first three are NCERT Class 11 Physics, Ch. 4 "Motion in a Plane"
 * (rationalised edition), §4.10 "Projectile motion":
 *     time of flight   T  = 2u sinθ / g              (level ground, h0 = 0)
 *     maximum height   H  = u² sin²θ / (2g)
 *     horizontal range R  = u² sin2θ / g
 * The h0 > 0 generalisations and the incline result are the standard JEE
 * extensions, DERIVED in the comments on each function rather than quoted, and
 * each one is cross-checked numerically against a brute-force sweep in
 * `scripts/verify-motion-lab.mjs`. Nothing here is asserted from memory alone.
 */

import { deg2rad, rad2deg, round } from '../../mechanics-bench/lib/linalg';
import type { MotionState } from '../types';

export { round };

/** Horizontal and vertical launch components — the two 1-D movies, as numbers. */
export function components(speed: number, angleDeg: number): { ux: number; uy: number } {
  const r = deg2rad(angleDeg);
  return { ux: speed * Math.cos(r), uy: speed * Math.sin(r) };
}

/** The launch state, ready to hand to `integrate`. */
export function launchState(speed: number, angleDeg: number, h0: number): MotionState {
  const { ux, uy } = components(speed, angleDeg);
  return { t: 0, pos: { x: 0, y: h0 }, vel: { x: ux, y: uy } };
}

/**
 * The highest point of the flight.
 *
 * vy = uy − g t is zero at t = uy/g; substituting into y = h0 + uy t − ½g t²
 * gives y = h0 + uy²/2g, and x = ux t.
 *
 * A downward launch (uy ≤ 0) never rises, so its highest point IS the launch
 * point — returned as t = 0 rather than as a negative time, which would put a
 * marker behind the launcher.
 */
export function apex(speed: number, angleDeg: number, h0: number, g: number): { t: number; x: number; y: number } {
  const { ux, uy } = components(speed, angleDeg);
  if (!(g > 0) || uy <= 0) return { t: 0, x: 0, y: h0 };
  const t = uy / g;
  return { t, x: ux * t, y: h0 + (uy * uy) / (2 * g) };
}

/**
 * Time from launch until the body returns to y = 0.
 *
 * h0 + uy t − ½ g t² = 0  ⟹  t = [ uy + √(uy² + 2 g h0) ] / g   (positive root)
 *
 * With h0 = 0 this collapses to the NCERT T = 2u sinθ / g.
 */
export function timeOfFlight(speed: number, angleDeg: number, h0: number, g: number): number {
  const { uy } = components(speed, angleDeg);
  if (!(g > 0)) return Infinity;
  const disc = uy * uy + 2 * g * h0;
  if (disc < 0) return 0;
  const t = (uy + Math.sqrt(disc)) / g;
  return t > 0 ? t : 0;
}

/**
 * Horizontal distance from the launch point to the landing point, R = ux · T.
 *
 * With h0 = 0 this is the NCERT R = u² sin2θ / g. With h0 > 0 it is larger, and
 * — the part students never expect — it is no longer maximised at 45°.
 * See `optimumAngle`.
 */
export function range(speed: number, angleDeg: number, h0: number, g: number): number {
  const { ux } = components(speed, angleDeg);
  return ux * timeOfFlight(speed, angleDeg, h0, g);
}

/**
 * The launch angle that maximises the range from a height h0, in degrees.
 *
 *      θ_opt = arctan( u / √(u² + 2 g h0) )
 *
 * DERIVATION (so this is checkable, not quoted): with
 *   R(θ) = (u cosθ / g)·( u sinθ + √(u² sin²θ + 2 g h0) ),
 * setting dR/dθ = 0 and simplifying gives sinθ = u / √(2u² + 2 g h0), which is
 * the same angle as the arctan form above. At h0 = 0 both give exactly 45°;
 * every h0 > 0 gives strictly less than 45°.
 *
 * WHY IT MATTERS. This is the shot-put fact, not an abstraction: a thrower
 * releases from about 2.1 m at about 13.5 m/s, and this returns ≈ 42°. Elite
 * throwers really do release near 37–42° — the remainder of the gap from 45°
 * that this formula doesn't explain is air drag plus the biomechanical fact
 * that a human cannot produce the same release speed at every angle.
 */
export function optimumAngle(speed: number, h0: number, g: number): number {
  if (!(g > 0) || speed <= 0) return 45;
  if (h0 <= 0) return 45;
  return rad2deg(Math.atan2(speed, Math.sqrt(speed * speed + 2 * g * h0)));
}

/**
 * The "parabola of safety": the boundary of every point reachable from the
 * origin at speed u, sampled left-to-right.
 *
 *      y = u²/(2g) − g x² / (2u²)
 *
 * DERIVATION. A point (x, y) is reachable iff the quadratic in tanθ obtained by
 * eliminating t from the trajectory equation has a real root; its discriminant
 * vanishes exactly on the curve above. Two sanity checks that make it
 * memorable: at x = 0 it gives u²/2g, the height of a straight-up throw; it
 * meets the ground at x = u²/g, the 45° maximum range. Every launch angle's
 * parabola is tangent to it and none crosses it.
 *
 * Returned over the FULL symmetric span x ∈ [−u²/g, u²/g] — a renderer that
 * only fires to the right simply clips the left half.
 */
export function safetyEnvelope(speed: number, g: number, samples = 96): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  if (!(g > 0) || speed <= 0) return out;
  const xMax = (speed * speed) / g;
  const n = Math.max(2, Math.floor(samples));
  for (let i = 0; i <= n; i++) {
    const x = -xMax + (2 * xMax * i) / n;
    out.push({ x, y: (speed * speed) / (2 * g) - (g * x * x) / (2 * speed * speed) });
  }
  return out;
}

/**
 * Distance travelled ALONG an incline of angle β before landing back on it.
 *
 *      R = 2u² sin(θ − β) cos θ / ( g cos²β )
 *
 * DERIVATION (this is the rotated-axis method the sim is built to teach). Take
 * x′ up-slope and y′ perpendicular to the slope. Then a_x′ = −g sinβ,
 * a_y′ = −g cosβ, and the launch splits as u_x′ = u cos(θ − β),
 * u_y′ = u sin(θ − β). Landing is y′ = 0 again, so
 *      T = 2u sin(θ − β) / (g cosβ),
 * and R = u_x′T − ½ g sinβ T², which simplifies to the boxed result. Note that
 * in the rotated axes it is a one-line problem: the perpendicular motion is an
 * ordinary "up and back down", exactly like level ground.
 *
 * `angleDeg` is measured from the HORIZONTAL, consistent with the rest of this
 * file, so the angle from the slope is α = θ − β. Setting β = 0 recovers
 * u² sin2θ / g. A downhill slope is a negative `inclineDeg`, and its range is
 * correspondingly larger.
 */
export function rangeOnIncline(speed: number, angleDeg: number, inclineDeg: number, g: number): number {
  if (!(g > 0)) return 0;
  const th = deg2rad(angleDeg);
  const be = deg2rad(inclineDeg);
  const cb = Math.cos(be);
  if (Math.abs(cb) < 1e-9) return 0;
  return (2 * speed * speed * Math.sin(th - be) * Math.cos(th)) / (g * cb * cb);
}

// ── Derived helpers used by the renderer (still pure) ────────────────────────

/** Time of flight measured along an incline — the T from the derivation above. */
export function timeOfFlightOnIncline(speed: number, angleDeg: number, inclineDeg: number, g: number): number {
  if (!(g > 0)) return 0;
  const cb = Math.cos(deg2rad(inclineDeg));
  if (Math.abs(cb) < 1e-9) return 0;
  const t = (2 * speed * Math.sin(deg2rad(angleDeg - inclineDeg))) / (g * cb);
  return t > 0 ? t : 0;
}

/**
 * The launch angle (from the horizontal) that maximises the range up an
 * incline: θ_opt = β/2 + 45°. It follows from writing the range as
 * ∝ sin(2θ − β) − sinβ, which peaks when 2θ − β = 90°. Down-slope (β < 0) it
 * correctly gives an angle below 45°.
 */
export const optimumAngleOnIncline = (inclineDeg: number): number => inclineDeg / 2 + 45;

/**
 * The complementary partner of a launch angle on LEVEL ground: θ and 90° − θ
 * give the same range because sin2θ = sin(180° − 2θ). One arrives fast and
 * flat, the other slow and high — same landing point, very different flight.
 * (This identity only holds for h0 = 0; the sim says so where it uses it.)
 */
export const complementaryAngle = (angleDeg: number): number => 90 - angleDeg;

/** Exact position at time t, no drag — used to draw the ideal ghost curve. */
export function positionAt(speed: number, angleDeg: number, h0: number, g: number, t: number): { x: number; y: number } {
  const { ux, uy } = components(speed, angleDeg);
  return { x: ux * t, y: h0 + uy * t - 0.5 * g * t * t };
}

/** Exact velocity at time t, no drag. vx NEVER changes — that is the lesson. */
export function velocityAt(speed: number, angleDeg: number, g: number, t: number): { x: number; y: number } {
  const { ux, uy } = components(speed, angleDeg);
  return { x: ux, y: uy - g * t };
}

/** Range as a function of angle, sampled — the R(θ) curve the sidebar plots. */
export function rangeCurve(
  speed: number, h0: number, g: number, samples = 90
): { angle: number; range: number }[] {
  const n = Math.max(2, Math.floor(samples));
  const out: { angle: number; range: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const angle = (90 * i) / n;
    out.push({ angle, range: range(speed, angle, h0, g) });
  }
  return out;
}
