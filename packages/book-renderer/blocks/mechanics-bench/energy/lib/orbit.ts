/*
 * energy/lib/orbit.ts — an orbit is a projectile that keeps missing.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── DESIGN LAW #4, ENACTED RATHER THAN CLAIMED ───────────────────────────────
 * This module does NOT contain an integrator. The trajectory of a cannonball
 * fired off Newton's mountain is produced by `motion-lab/lib/integrate` — the
 * SAME RK4 that draws every projectile in the Projectile Playground — with
 * nothing changed except the acceleration function. That is the literal content
 * of the lesson: an orbit is a projectile whose gravity happens to point at a
 * moving target, and if the code needed a second integrator the claim would be
 * false.
 *
 * The QA report (§7 item 8) flagged the cross-engine handoff CONTRACT as dead
 * code — declared and never exercised. This is the first place it is exercised.
 *
 * ── UNITS ────────────────────────────────────────────────────────────────────
 * Everything is SI, and everything is expressed through GM (the "standard
 * gravitational parameter") rather than through G and M separately, because GM
 * is the only combination that appears in any orbital result and splitting it
 * invites a student to think the two matter independently.
 */

import { integrate } from '../../../motion-lab/lib/integrate';
import type { AccelFn, MotionState, Trajectory, Vec2 } from '../../../motion-lab/types';

/** m³ kg⁻¹ s⁻² */
export const G_CONST = 6.674e-11;

/** Handy real bodies, so the sim is about the Earth rather than about "a mass". */
export const EARTH = {
  /** m³ s⁻² — GM, known far more precisely than G or M separately. */
  GM: 3.986e14,
  /** m */
  radius: 6.371e6,
} as const;

/** Circular-orbit speed at radius r: the speed at which falling exactly matches
 *  the curvature of the ground. v = √(GM/r). */
export const circularSpeed = (GM: number, r: number): number => Math.sqrt(GM / r);

/** Escape speed at radius r: v = √(2GM/r) = √2 × the circular speed. The √2 is
 *  the entire content of "escape velocity" and it is worth saying that way. */
export const escapeSpeed = (GM: number, r: number): number => Math.sqrt((2 * GM) / r);

/** Specific orbital energy ε = v²/2 − GM/r, J/kg. Negative = bound. */
export const specificEnergy = (GM: number, r: number, v: number): number =>
  (v * v) / 2 - GM / r;

/** Specific angular momentum for a launch at flight-path angle γ above the local
 *  horizontal: h = r·v·cos γ. */
export const specificAngularMomentum = (r: number, v: number, gammaDeg = 0): number =>
  r * v * Math.cos((gammaDeg * Math.PI) / 180);

/** Semi-major axis from the vis-viva relation, m. Infinite at escape speed,
 *  negative on a hyperbola — both are correct and the classifier reads them. */
export function semiMajorAxis(GM: number, r: number, v: number): number {
  const inv = 2 / r - (v * v) / GM;
  return Math.abs(inv) < 1e-18 ? Infinity : 1 / inv;
}

/** Orbital eccentricity from the energy/angular-momentum pair. */
export function eccentricity(GM: number, r: number, v: number, gammaDeg = 0): number {
  const eps = specificEnergy(GM, r, v);
  const h = specificAngularMomentum(r, v, gammaDeg);
  return Math.sqrt(Math.max(0, 1 + (2 * eps * h * h) / (GM * GM)));
}

export type OrbitKind = 'crash' | 'ellipse' | 'circle' | 'escape';

export interface OrbitVerdict {
  kind: OrbitKind;
  eccentricity: number;
  /** m — Infinity for a parabola, negative for a hyperbola. */
  semiMajor: number;
  /** m from the centre. Infinity when unbound. */
  apoapsis: number;
  periapsis: number;
  /** s. Infinity when unbound. */
  period: number;
  circularSpeed: number;
  escapeSpeed: number;
  /** True when the periapsis is inside the planet, i.e. the orbit intersects it. */
  hitsSurface: boolean;
}

/**
 * Classify a horizontal launch of speed v at radius r above a body of parameter
 * GM and surface radius R.
 *
 * A horizontal launch means the launch point is an APSIS: below circular speed
 * it is the apoapsis (and the far side dips toward — often into — the planet);
 * above it, it is the periapsis. That single fact is what makes the "fire it
 * faster and faster" ladder legible, and it is why the classification can be
 * done in closed form rather than by watching the integration.
 */
export function classifyOrbit(GM: number, R: number, r: number, v: number): OrbitVerdict {
  const vc = circularSpeed(GM, r);
  const ve = escapeSpeed(GM, r);
  const a = semiMajorAxis(GM, r, v);
  const ecc = eccentricity(GM, r, v, 0);
  const bound = v < ve - 1e-9;
  const apo = bound ? a * (1 + ecc) : Infinity;
  const peri = bound ? a * (1 - ecc) : a * (1 - ecc);
  const hitsSurface = bound && peri <= R;

  const kind: OrbitKind =
    !bound ? 'escape'
      : hitsSurface ? 'crash'
        : Math.abs(v - vc) < 1e-6 * vc ? 'circle'
          : 'ellipse';

  return {
    kind,
    eccentricity: ecc,
    semiMajor: a,
    apoapsis: apo,
    periapsis: peri,
    period: bound ? 2 * Math.PI * Math.sqrt((a * a * a) / GM) : Infinity,
    circularSpeed: vc,
    escapeSpeed: ve,
    hitsSurface,
  };
}

/** Inverse-square gravity toward the origin — the ONLY thing that differs from
 *  the Projectile Playground's uniform `gravityAccel`. */
export function centralGravity(GM: number): AccelFn {
  return (s: MotionState): Vec2 => {
    const r2 = s.pos.x * s.pos.x + s.pos.y * s.pos.y;
    const r = Math.sqrt(r2);
    if (r < 1e-6) return { x: 0, y: 0 };
    const k = -GM / (r2 * r);
    return { x: k * s.pos.x, y: k * s.pos.y };
  };
}

export interface OrbitPathOptions {
  GM: number;
  /** Planet radius — the integration stops when the path reaches it. */
  R: number;
  /** Launch radius from the centre, m. */
  r0: number;
  /** Launch speed, m/s, horizontal (perpendicular to the radius). */
  v0: number;
  /** Integration step, s. */
  dt?: number;
  /** Stop after this many seconds of simulated time. */
  maxTime?: number;
}

/**
 * The path, integrated by motion-lab's RK4. Launch is at (0, r0) moving in +x,
 * so "horizontal" means tangential and the picture reads as Newton's cannon.
 *
 * The step defaults to period/2000 for a bound orbit, which keeps a circular
 * orbit's radius constant to better than a part in 10⁸ over a full revolution —
 * verified, not assumed.
 */
export function orbitPath(o: OrbitPathOptions): Trajectory {
  const verdict = classifyOrbit(o.GM, o.R, o.r0, o.v0);
  const period = Number.isFinite(verdict.period)
    ? verdict.period
    : (2 * Math.PI * o.r0) / Math.max(o.v0, 1);
  const dt = o.dt ?? period / 2000;
  const maxTime = o.maxTime ?? period * 1.05;
  const rMax = Math.max(o.r0 * 12, Number.isFinite(verdict.apoapsis) ? verdict.apoapsis * 1.2 : o.r0 * 12);

  const s0: MotionState = { t: 0, pos: { x: 0, y: o.r0 }, vel: { x: o.v0, y: 0 } };
  return integrate(s0, centralGravity(o.GM), {
    dt,
    maxSteps: Math.min(20000, Math.max(200, Math.ceil(maxTime / dt))),
    stop: (s) => {
      const r = Math.hypot(s.pos.x, s.pos.y);
      return r <= o.R || r >= rMax;
    },
  });
}

/** Smallest and largest radius actually reached along an integrated path — the
 *  measured apsides, for checking the closed form against the picture. */
export function radiusRange(tr: Trajectory): { min: number; max: number } {
  let min = Infinity;
  let max = 0;
  for (const p of tr.points) {
    const r = Math.hypot(p.pos.x, p.pos.y);
    if (r < min) min = r;
    if (r > max) max = r;
  }
  return { min, max };
}
