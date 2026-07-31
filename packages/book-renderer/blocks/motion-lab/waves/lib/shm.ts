/*
 * motion-lab/waves/lib/shm.ts — simple harmonic motion, exactly.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no dependencies beyond the FROZEN E2 integrator — so
 * `scripts/verify-motion-phase2.mjs` checks every claim on this page with a
 * plain node run (PHYSICS_SIMULATION_PROGRAM.md §9: "no academic claim ships
 * unverified").
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ───────────────────────────────────────
 * SHM is not "a thing that wobbles". It is the SHADOW of uniform circular
 * motion. A point runs round a circle of radius A at a steady ω; drop a
 * perpendicular onto the diameter; the foot of that perpendicular is doing
 * simple harmonic motion, exactly, with x = A cos(ωt + φ). Every SHM formula a
 * student memorises — why v is largest at the centre, why a ∝ −x, why the
 * period does not depend on amplitude — falls straight out of that picture.
 *
 * So `circleProjection` is not a decoration in this module: it is the SAME
 * function `shmState` uses. They cannot disagree, and the verifier checks that
 * they agree to 1e-12 rather than to some hand-waved tolerance.
 *
 * ── NO SECOND INTEGRATOR ────────────────────────────────────────────────────
 * The large-angle pendulum and the driven oscillator are genuinely non-linear /
 * time-dependent and have to be integrated. They reuse `step`/`integrate` from
 * `../../lib/integrate.ts` by carrying the 1-D state in the x component of the
 * 2-D state (θ in `pos.x`, θ̇ in `vel.x`). That is a deliberate re-use of the
 * frozen RK4 rather than a private copy of it — the engine's own bisection
 * refinement is what lets a quarter-period be located to machine precision.
 *
 * Convention: SI, angles in radians INSIDE the maths and degrees only at the
 * authoring surface, ω in rad/s, t in s.
 */

import type { MotionState, AccelFn } from '../../types';
import { integrate, step, DEFAULT_DT } from '../../lib/integrate';

export const TAU = Math.PI * 2;

// ── Springs ──────────────────────────────────────────────────────────────────

/** ω = √(k/m), rad/s. */
export const springOmega = (m: number, k: number): number =>
  Math.sqrt(Math.max(k, 0) / Math.max(m, 1e-9));

/**
 * T = 2π√(m/k), seconds.
 *
 * Amplitude does NOT appear. That absence is the whole lesson of the spring
 * rung: a bigger pull means a longer journey AND a proportionally bigger
 * restoring force, and the two cancel exactly. Students expect a big swing to
 * take longer; it does not.
 */
export const springPeriod = (m: number, k: number): number =>
  TAU * Math.sqrt(Math.max(m, 1e-9) / Math.max(k, 1e-9));

// ── Pendulums ────────────────────────────────────────────────────────────────

/**
 * The small-angle answer, T₀ = 2π√(l/g).
 *
 * "Small angle" is doing real work here and is where the marks are lost: the
 * derivation replaces sin θ with θ, which is a different equation, not a
 * rounding. `pendulumPeriodExact` below is what actually happens.
 */
export const pendulumPeriodSmall = (l: number, g: number): number =>
  TAU * Math.sqrt(Math.max(l, 1e-9) / Math.max(g, 1e-9));

/** Arithmetic–geometric mean. Converges quadratically; 12 iterations is far
 *  past double precision for any argument used here. */
export function agm(a0: number, b0: number): number {
  let a = a0;
  let b = b0;
  for (let i = 0; i < 12; i++) {
    const na = (a + b) / 2;
    b = Math.sqrt(a * b);
    a = na;
  }
  return (a + b) / 2;
}

/**
 * The EXACT period of a simple pendulum released from rest at θ₀.
 *
 *      T = T₀ · (2/π) K(sin(θ₀/2))            (K = complete elliptic 1st kind)
 *        = T₀ / AGM(1, cos(θ₀/2))             (Gauss's AGM identity)
 *
 * Closed form, no integration, so the sim can quote it live while the student
 * drags the release angle. At θ₀ = 60° it is 7.3% longer than 2π√(l/g) —
 * comfortably measurable on screen against a stopwatch, and the reason a
 * grandfather clock's bob swings through only a few degrees.
 */
export function pendulumPeriodExact(l: number, g: number, theta0Rad: number): number {
  const a = Math.abs(theta0Rad);
  if (a < 1e-12) return pendulumPeriodSmall(l, g);
  if (a >= Math.PI) return Infinity; // released at the top: it never comes back
  return pendulumPeriodSmall(l, g) / agm(1, Math.cos(a / 2));
}

/** How much longer the real swing is than the textbook one, as a fraction. */
export const pendulumPeriodError = (theta0Rad: number): number =>
  pendulumPeriodExact(1, 1, theta0Rad) / pendulumPeriodSmall(1, 1) - 1;

/**
 * The same period, MEASURED by integrating θ̈ = −(g/l) sin θ from rest.
 *
 * Exists so the sim's animation and the sim's quoted number are provably the
 * same physics — the QA report's standing complaint is sims that assert a
 * result the picture does not actually produce. The engine's `stop` predicate
 * is bisection-refined, so the quarter period lands on the real zero crossing
 * rather than on a step edge.
 */
export function pendulumPeriodMeasured(l: number, g: number, theta0Rad: number, dt = DEFAULT_DT): number {
  if (Math.abs(theta0Rad) < 1e-12) return pendulumPeriodSmall(l, g);
  const a = pendulumAccel(l, g);
  const s0: MotionState = { t: 0, pos: { x: theta0Rad, y: 0 }, vel: { x: 0, y: 0 } };
  const sign = theta0Rad > 0 ? 1 : -1;
  const tr = integrate(s0, a, {
    dt,
    stop: (s) => s.t > 1e-9 && sign * s.pos.x <= 0,
    maxSteps: 200000,
  });
  return tr.stoppedAt ? 4 * tr.stoppedAt.t : NaN;
}

/** θ̈ = −(g/l) sin θ, packed into the frozen 2-D integrator's x channel. */
export function pendulumAccel(l: number, g: number): AccelFn {
  const w2 = Math.max(g, 0) / Math.max(l, 1e-9);
  return (s: MotionState) => ({ x: -w2 * Math.sin(s.pos.x), y: 0 });
}

/**
 * One period of the exact pendulum, sampled for drawing.
 * `theta[i]` is the true angle — never the small-angle cosine — so the
 * side-by-side "textbook vs reality" overlay is honest.
 */
export function pendulumTrack(
  l: number, g: number, theta0Rad: number, tMax: number, samples = 240
): { t: number; theta: number; omega: number }[] {
  const a = pendulumAccel(l, g);
  const dt = tMax / Math.max(1, samples);
  const out: { t: number; theta: number; omega: number }[] = [];
  let s: MotionState = { t: 0, pos: { x: theta0Rad, y: 0 }, vel: { x: 0, y: 0 } };
  out.push({ t: 0, theta: theta0Rad, omega: 0 });
  for (let i = 0; i < samples; i++) {
    // Four RK4 sub-steps per sample keeps the drawn curve exact enough that it
    // overlays the closed-form small-angle curve without visible drift.
    for (let k = 0; k < 4; k++) s = step(s, a, dt / 4);
    out.push({ t: s.t, theta: s.pos.x, omega: s.vel.x });
  }
  return out;
}

// ── The state of an oscillator, and its circle of reference ──────────────────

export interface ShmState {
  /** Displacement from equilibrium, m. */
  x: number;
  /** m/s. */
  v: number;
  /** m/s². Always −ω²x — that IS the definition of SHM. */
  a: number;
  /** Phase angle ωt + φ, rad. The angle of the reference point on its circle. */
  phase: number;
}

/**
 * x = A cos(ωt + φ), and its two derivatives.
 *
 * Written from the cosine (not the sine) because the reference circle starts at
 * angle φ measured from +x, so at t = 0 with φ = 0 the oscillator sits at its
 * maximum displacement — which is where a student releases a pulled spring.
 */
export function shmState(A: number, omega: number, t: number, phase0 = 0): ShmState {
  const ph = omega * t + phase0;
  return {
    x: A * Math.cos(ph),
    v: -A * omega * Math.sin(ph),
    a: -A * omega * omega * Math.cos(ph),
    phase: ph,
  };
}

export interface CirclePoint {
  /** Angle of the reference point, rad CCW from +x. */
  angle: number;
  /** Where the reference point sits on the circle of radius A. */
  px: number;
  py: number;
  /** The SHADOW: the projection onto the x-axis. This is the oscillator. */
  shadow: number;
}

/**
 * The circle of reference at time t.
 *
 * `shadow` is `A cos(ωt + φ)` — literally the same expression `shmState` uses
 * for `x`. The verifier asserts they are equal to 1e-12 across a whole period,
 * because the entire pedagogical claim of the flagship bench is that these two
 * are ONE motion seen two ways, not two motions drawn to look alike.
 */
export function circleProjection(A: number, omega: number, t: number, phase0 = 0): CirclePoint {
  const angle = omega * t + phase0;
  return { angle, px: A * Math.cos(angle), py: A * Math.sin(angle), shadow: A * Math.cos(angle) };
}

// ── Energy ───────────────────────────────────────────────────────────────────

export interface ShmEnergy {
  /** ½mv², J. */
  kinetic: number;
  /** ½kx², J. */
  potential: number;
  /** ½kA² — constant, and that constancy is the whole point. */
  total: number;
}

/**
 * The energy ledger of a spring oscillator.
 *
 * `total` is computed from the CURRENT x and v, not from A, so the "it is
 * constant" claim is a measurement rather than a definition. The verifier walks
 * a full cycle and demands it hold to 1e-9 against the independently-computed
 * ½kA².
 */
export function shmEnergy(m: number, k: number, x: number, v: number): ShmEnergy {
  const kinetic = 0.5 * m * v * v;
  const potential = 0.5 * k * x * x;
  return { kinetic, potential, total: kinetic + potential };
}

/** ½kA² — the energy you put in when you pull it out to A and let go. */
export const shmTotalEnergy = (k: number, A: number): number => 0.5 * k * A * A;

/** Speed at displacement x: v = ω√(A² − x²). Maximum at x = 0, zero at x = ±A. */
export const speedAt = (A: number, omega: number, x: number): number =>
  omega * Math.sqrt(Math.max(0, A * A - x * x));

// ── Damping ──────────────────────────────────────────────────────────────────

/** Amplitude of a lightly damped oscillator: A₀e^{−γt}. */
export const dampedAmplitude = (A0: number, gamma: number, t: number): number =>
  A0 * Math.exp(-gamma * t);

/** ω_d = √(ω₀² − γ²) — damping makes the swing slightly SLOWER, not faster. */
export const dampedOmega = (omega0: number, gamma: number): number =>
  omega0 > gamma ? Math.sqrt(omega0 * omega0 - gamma * gamma) : 0;

// ── Driven oscillator — the resonance rig ────────────────────────────────────

export interface DriveSpec {
  /** Natural angular frequency √(k/m), rad/s. */
  omega0: number;
  /** Damping constant γ = b/2m, 1/s. */
  gamma: number;
  /** Drive force amplitude per unit mass, F₀/m, m/s². */
  drive: number;
}

/**
 * Steady-state amplitude of a driven damped oscillator.
 *
 *      A(ω) = (F₀/m) / √((ω₀² − ω²)² + (2γω)²)
 *
 * The number a student needs from this is not the formula, it is the SHAPE:
 * a tall narrow spike when γ is small, a low broad hump when γ is large, and
 * the same area under both. Damping decides the height of the peak — nothing
 * else in the expression can.
 */
export function drivenAmplitude(d: DriveSpec, omegaDrive: number): number {
  const dw = d.omega0 * d.omega0 - omegaDrive * omegaDrive;
  const damp = 2 * d.gamma * omegaDrive;
  const denom = Math.sqrt(dw * dw + damp * damp);
  return denom > 1e-12 ? d.drive / denom : Infinity;
}

/** Phase lag of the response behind the drive, rad in [0, π]. */
export function drivenPhaseLag(d: DriveSpec, omegaDrive: number): number {
  const dw = d.omega0 * d.omega0 - omegaDrive * omegaDrive;
  const damp = 2 * d.gamma * omegaDrive;
  return Math.atan2(damp, dw);
}

/**
 * Where the amplitude peaks: ω_res = √(ω₀² − 2γ²).
 *
 * NOT at ω₀ — a detail every textbook glosses and every good question tests.
 * Heavy enough damping (γ ≥ ω₀/√2) removes the peak entirely: the response just
 * falls away from its zero-frequency value and there is no resonance at all.
 */
export function resonantOmega(d: DriveSpec): number {
  const inside = d.omega0 * d.omega0 - 2 * d.gamma * d.gamma;
  return inside > 0 ? Math.sqrt(inside) : 0;
}

/** The response curve, sampled for drawing. */
export function responseCurve(
  d: DriveSpec, omegaMax: number, samples = 200
): { omega: number; amplitude: number }[] {
  const out: { omega: number; amplitude: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const w = (omegaMax * i) / samples;
    out.push({ omega: w, amplitude: drivenAmplitude(d, w) });
  }
  return out;
}

/**
 * The live transient: ẍ = −ω₀²x − 2γẋ + F₀/m · cos(ω_d t), integrated with the
 * frozen RK4. Explicitly time-dependent, which `AccelFn` supports because
 * `MotionState` carries `t` — no private clock anywhere.
 */
export function drivenAccel(d: DriveSpec, omegaDrive: number): AccelFn {
  return (s: MotionState) => ({
    x: -d.omega0 * d.omega0 * s.pos.x - 2 * d.gamma * s.vel.x + d.drive * Math.cos(omegaDrive * s.t),
    y: 0,
  });
}
