/*
 * field-bench/lib/gravity.ts — g inside the Earth, and orbits.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * The `g_constant_inside_earth` misconception is the target: students picture g
 * as a property of "being underground" and expect it to grow as you dig toward
 * the centre, or to stay at 9.8. Both are wrong, and the truth is stranger than
 * either — g RISES as you climb from the centre to the surface, peaks EXACTLY
 * at the surface, and falls away as 1/r² above it.
 *
 * The reason is the shell theorem: at radius r inside a uniform sphere, every
 * shell OUTSIDE r pulls you in all directions at once and cancels exactly. Only
 * the mass at smaller radius counts, and that mass ∝ r³, so
 *
 *        g(r) = GM(r)/r² = G(Mr³/R³)/r² = (GM/R³)·r        (r < R)
 *        g(r) = GM/r²                                       (r ≥ R)
 *
 * Both branches meet at GM/R² — the graph has a corner at the surface, and
 * that corner is the whole picture.
 */

import { G_NEWTON, EARTH_MASS, EARTH_RADIUS } from './constants';

/** g at radius r from the centre of a uniform sphere of mass M and radius R. */
export function gAtRadius(r: number, M = EARTH_MASS, R = EARTH_RADIUS): number {
  const rr = Math.max(r, 0);
  if (R > 0 && rr < R) return (G_NEWTON * M * rr) / (R * R * R);
  return rr > 0 ? (G_NEWTON * M) / (rr * rr) : 0;
}

/** Gravitational potential per unit mass, J/kg. Continuous at the surface. */
export function potentialAtRadius(r: number, M = EARTH_MASS, R = EARTH_RADIUS): number {
  const rr = Math.max(r, 0);
  if (R > 0 && rr < R) return (-G_NEWTON * M * (3 * R * R - rr * rr)) / (2 * R * R * R);
  return rr > 0 ? (-G_NEWTON * M) / rr : -Infinity;
}

/** Surface value — 9.82 m/s² for the Earth constants used here. */
export const surfaceG = (M = EARTH_MASS, R = EARTH_RADIUS): number => (G_NEWTON * M) / (R * R);

export interface GPoint { r: number; g: number }

/** The g(r) curve from the centre out to `rMax`, for the live plot. */
export function gProfile(rMax: number, n = 240, M = EARTH_MASS, R = EARTH_RADIUS): GPoint[] {
  const out: GPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const r = (rMax * i) / n;
    out.push({ r, g: gAtRadius(r, M, R) });
  }
  return out;
}

// ── Orbits — design law #4, the projectile that keeps missing ───────────────

/** Circular-orbit speed at radius r. */
export const orbitSpeed = (r: number, M = EARTH_MASS): number => Math.sqrt((G_NEWTON * M) / r);

/** Escape speed at radius r — exactly √2 times the circular speed, which is
 *  why "just a bit faster" turns a circle into an ellipse and not a getaway. */
export const escapeSpeed = (r: number, M = EARTH_MASS): number => Math.sqrt((2 * G_NEWTON * M) / r);

export type OrbitShape = 'circle' | 'ellipse' | 'parabola' | 'hyperbola';

/**
 * Classify a launch by its specific orbital energy ε = v²/2 − GM/r.
 *
 *   ε < 0 → bound: an ellipse (a circle when the speed is exactly circular and
 *           the launch is sideways)
 *   ε = 0 → parabola, the escape boundary
 *   ε > 0 → hyperbola, gone for good
 *
 * `tol` is a fractional tolerance on the energy, so "circle" and "parabola" are
 * reported for launches near enough that a student's slider can actually land
 * on them.
 */
export function orbitShape(r: number, speed: number, M = EARTH_MASS, tol = 1e-3): OrbitShape {
  const vEsc = escapeSpeed(r, M);
  const vCirc = orbitSpeed(r, M);
  if (Math.abs(speed - vEsc) <= tol * vEsc) return 'parabola';
  if (speed > vEsc) return 'hyperbola';
  if (Math.abs(speed - vCirc) <= tol * vCirc) return 'circle';
  return 'ellipse';
}

/** Specific orbital energy, J/kg. Negative = bound. */
export const specificEnergy = (r: number, speed: number, M = EARTH_MASS): number =>
  (speed * speed) / 2 - (G_NEWTON * M) / r;
