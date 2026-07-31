/*
 * circuit-bench/ac/lib/transient.ts — LR, LC and LCR in time. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * ── CLOSED FORM, NOT INTEGRATED, AND WHY THAT MATTERS ───────────────────────
 * Every result here is the exact solution of the differential equation, not a
 * stepped approximation. That is a pedagogical requirement, not a performance
 * one: the exercise asks the student to find that the current reaches 63.2% of
 * its final value at exactly t = τ, and an RK4 walk would land at 63.19% or
 * 63.21% depending on the step size. A sim whose headline number wobbles when
 * you change a slider that should not affect it teaches the student to distrust
 * it — correctly.
 *
 * ── THE FOUR RESULTS ────────────────────────────────────────────────────────
 *
 * LR growth (switch closed onto a battery), NCERT XII ch. 6:
 *      I(t) = (ε/R)(1 − e^{−t/τ}),        τ = L/R
 *      V_L  = ε e^{−t/τ},   V_R = ε(1 − e^{−t/τ}),   and V_L + V_R = ε always
 *   At t = 0 the current is ZERO and the WHOLE supply sits across a component
 *   with no resistance — the fact that breaks "V = IR is all there is".
 *   At t = τ,  1 − e⁻¹ = 0.6321205588285577.
 *
 * LR decay (battery removed, loop closed):
 *      I(t) = I₀ e^{−t/τ}
 *
 * LC oscillation (charged capacitor across an inductor, R = 0):
 *      q(t) = Q₀ cos ω₀t,   i(t) = −Q₀ω₀ sin ω₀t,   ω₀ = 1/√(LC)
 *      U_C = q²/2C,  U_L = ½Li²,  U_C + U_L = Q₀²/2C — CONSTANT, exactly.
 *   The energy identity is not asserted: cos² + sin² = 1 does it, and the
 *   verifier holds the total to 1e-9 over many cycles.
 *
 * LCR series, source-free, released from a charged capacitor at rest:
 *      α = R/2L,  ω_d = √(ω₀² − α²)
 *      under-damped (R < 2√(L/C)):
 *          q = Q₀ e^{−αt}[cos ω_d t + (α/ω_d) sin ω_d t]
 *          i = dq/dt = −Q₀ (ω₀²/ω_d) e^{−αt} sin ω_d t
 *      critically damped (R = 2√(L/C)):  q = Q₀ e^{−αt}(1 + αt)
 *      over-damped:   the same expression with ω_d imaginary, i.e. hyperbolic
 *
 * All three branches satisfy q(0) = Q₀ and i(0) = 0, which is the physical
 * initial condition (a charged capacitor and no current yet), and the verifier
 * checks that at the boundary the under-damped and critical forms agree.
 */

// ── LR ───────────────────────────────────────────────────────────────────────

export interface LRSpec {
  /** V — the source EMF. */ emf: number;
  /** Ω. */ R: number;
  /** H. */ L: number;
}

/** τ = L/R, seconds. Bigger L or smaller R means a slower circuit. */
export const timeConstantLR = (s: LRSpec): number =>
  (s.R > 0 ? s.L / s.R : Number.POSITIVE_INFINITY);

/** The final, steady current ε/R — where the inductor has stopped mattering. */
export const finalCurrentLR = (s: LRSpec): number => (s.R > 0 ? s.emf / s.R : Number.POSITIVE_INFINITY);

export interface LRSample {
  t: number;
  current: number;
  /** V — across the resistor, I R. */
  vR: number;
  /** V — across the inductor, ε − I R. Equals ε at t = 0. */
  vL: number;
  /** A/s. */
  dIdt: number;
  /** Fraction of the final current reached. 0.632… at t = τ. */
  fraction: number;
  /** J — energy stored in the field so far. */
  energy: number;
}

/** LR growth: switch closed onto the battery at t = 0 with no current flowing. */
export function lrGrowth(s: LRSpec, t: number): LRSample {
  const tau = timeConstantLR(s);
  const Imax = finalCurrentLR(s);
  if (!Number.isFinite(tau) || !Number.isFinite(Imax)) {
    return { t, current: 0, vR: 0, vL: s.emf, dIdt: 0, fraction: 0, energy: 0 };
  }
  const e = Math.exp(-Math.max(t, 0) / tau);
  const current = Imax * (1 - e);
  return {
    t,
    current,
    vR: current * s.R,
    vL: s.emf * e,
    dIdt: (s.emf / s.L) * e,
    fraction: 1 - e,
    energy: 0.5 * s.L * current * current,
  };
}

/** LR decay: the battery is shorted out at t = 0 with I₀ already flowing. */
export function lrDecay(s: LRSpec, i0: number, t: number): LRSample {
  const tau = timeConstantLR(s);
  if (!Number.isFinite(tau)) return { t, current: i0, vR: i0 * s.R, vL: 0, dIdt: 0, fraction: 1, energy: 0.5 * s.L * i0 * i0 };
  const e = Math.exp(-Math.max(t, 0) / tau);
  const current = i0 * e;
  return {
    t,
    current,
    vR: current * s.R,
    // With no source, the inductor's EMF is what drives the current: it is
    // NEGATIVE of the resistor drop, which is the sign that tells the student
    // the coil has become the battery.
    vL: -current * s.R,
    dIdt: (-i0 / tau) * e,
    fraction: e,
    energy: 0.5 * s.L * current * current,
  };
}

// ── LC ───────────────────────────────────────────────────────────────────────

export interface LCSpec {
  /** H. */ L: number;
  /** F. */ C: number;
  /** C — the charge the capacitor starts with. */ q0: number;
}

/** ω₀ = 1/√(LC), rad/s. */
export const omegaLC = (s: LCSpec): number =>
  (s.L > 0 && s.C > 0 ? 1 / Math.sqrt(s.L * s.C) : Number.NaN);

/** f₀ = ω₀/2π, Hz. */
export const freqLC = (s: LCSpec): number => omegaLC(s) / (2 * Math.PI);

/** T = 2π√(LC), seconds. */
export const periodLC = (s: LCSpec): number => 2 * Math.PI * Math.sqrt(s.L * s.C);

export interface LCSample {
  t: number;
  /** C. */ charge: number;
  /** A — positive means the capacitor is discharging. */ current: number;
  /** V. */ voltage: number;
  /** J — in the electric field of the capacitor. */ energyC: number;
  /** J — in the magnetic field of the inductor. */ energyL: number;
  /** J — the sum, which must not move. */ energyTotal: number;
}

/**
 * The undamped oscillation.
 *
 * `current` is dq/dt with q falling, so it is reported POSITIVE while the
 * capacitor discharges — the direction a student draws first.
 */
export function lcSample(s: LCSpec, t: number): LCSample {
  const w = omegaLC(s);
  if (!Number.isFinite(w)) {
    return { t, charge: s.q0, current: 0, voltage: s.C > 0 ? s.q0 / s.C : 0, energyC: 0, energyL: 0, energyTotal: 0 };
  }
  const charge = s.q0 * Math.cos(w * t);
  const current = s.q0 * w * Math.sin(w * t);
  const energyC = (charge * charge) / (2 * s.C);
  const energyL = 0.5 * s.L * current * current;
  return {
    t, charge, current,
    voltage: charge / s.C,
    energyC, energyL,
    energyTotal: energyC + energyL,
  };
}

// ── LCR ──────────────────────────────────────────────────────────────────────

export interface LCRSpec extends LCSpec { R: number }

export type Damping = 'under' | 'critical' | 'over';

/** R_critical = 2√(L/C) — the resistance at which oscillation stops entirely. */
export const criticalResistance = (s: LCSpec): number =>
  (s.C > 0 && s.L > 0 ? 2 * Math.sqrt(s.L / s.C) : Number.NaN);

/**
 * Which regime this circuit is in.
 *
 * The comparison is made on the DISCRIMINANT ω₀² − α² rather than on R against
 * R_crit, with a relative tolerance: at R exactly 2√(L/C) the two expressions
 * differ in the last bit of a double, and a bare `===` would send a genuinely
 * critical circuit down the under-damped branch where ω_d is 1e-9 and the
 * "oscillation" has a period of a decade.
 */
export function dampingOf(s: LCRSpec): Damping {
  const w0 = omegaLC(s);
  const a = s.R / (2 * s.L);
  const disc = w0 * w0 - a * a;
  const scale = w0 * w0;
  if (Math.abs(disc) <= scale * 1e-12) return 'critical';
  return disc > 0 ? 'under' : 'over';
}

export interface LCRSample extends LCSample {
  damping: Damping;
  /** rad/s — the damped angular frequency; 0 for critical and over-damped. */
  omegaD: number;
  /** 1/s — the decay rate R/2L. */
  alpha: number;
  /** J — how much has already been dissipated in R. */
  energyLost: number;
}

/**
 * The source-free LCR discharge, all three regimes, released from q₀ at rest.
 *
 * The three branches are the three real solutions of the same quadratic, and
 * each is written so that q(0) = q₀ and i(0) = 0 by construction rather than by
 * a fitted constant.
 */
export function lcrSample(s: LCRSpec, t: number): LCRSample {
  const w0 = omegaLC(s);
  const a = s.R / (2 * s.L);
  const regime = dampingOf(s);
  const tt = Math.max(t, 0);
  const decay = Math.exp(-a * tt);

  let charge: number;
  let current: number;
  let omegaD = 0;

  if (regime === 'under') {
    omegaD = Math.sqrt(w0 * w0 - a * a);
    charge = s.q0 * decay * (Math.cos(omegaD * tt) + (a / omegaD) * Math.sin(omegaD * tt));
    // i = −dq/dt reported positive while discharging; dq/dt simplifies to
    // −q₀ (ω₀²/ω_d) e^{−αt} sin ω_d t, so the discharge current is its negative.
    current = s.q0 * ((w0 * w0) / omegaD) * decay * Math.sin(omegaD * tt);
  } else if (regime === 'critical') {
    charge = s.q0 * decay * (1 + a * tt);
    // dq/dt = −q₀ α² t e^{−αt}
    current = s.q0 * a * a * tt * decay;
  } else {
    const b = Math.sqrt(a * a - w0 * w0);
    charge = s.q0 * decay * (Math.cosh(b * tt) + (a / b) * Math.sinh(b * tt));
    current = s.q0 * ((w0 * w0) / b) * decay * Math.sinh(b * tt);
  }

  const energyC = (charge * charge) / (2 * s.C);
  const energyL = 0.5 * s.L * current * current;
  const total0 = (s.q0 * s.q0) / (2 * s.C);
  return {
    t, charge, current,
    voltage: charge / s.C,
    energyC, energyL,
    energyTotal: energyC + energyL,
    damping: regime,
    omegaD,
    alpha: a,
    energyLost: total0 - (energyC + energyL),
  };
}

/** A trace of samples, for a plot. `n` points inclusive of both ends. */
export function lcrTrace(s: LCRSpec, tMax: number, n = 240): LCRSample[] {
  const out: LCRSample[] = [];
  for (let k = 0; k <= n; k++) out.push(lcrSample(s, (tMax * k) / n));
  return out;
}

export function lrTrace(s: LRSpec, tMax: number, n = 240): LRSample[] {
  const out: LRSample[] = [];
  for (let k = 0; k <= n; k++) out.push(lrGrowth(s, (tMax * k) / n));
  return out;
}

export function lcTrace(s: LCSpec, tMax: number, n = 240): LCSample[] {
  const out: LCSample[] = [];
  for (let k = 0; k <= n; k++) out.push(lcSample(s, (tMax * k) / n));
  return out;
}
