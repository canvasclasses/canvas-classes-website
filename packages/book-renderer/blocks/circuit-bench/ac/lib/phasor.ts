/*
 * circuit-bench/ac/lib/phasor.ts — AC steady state. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable; every claim below is re-derived in
 * `scripts/verify-emi-ac.mjs`.
 *
 * ── WHY THIS IS NOT THE E3 SOLVER ───────────────────────────────────────────
 * `circuit-bench/lib/solve.ts` is a DC modified-nodal-analysis solver: an
 * inductor is a wire and a capacitor is a gap, which is exactly right for the
 * steady state it models and useless at 50 Hz. AC needs complex impedance, and
 * the honest thing is a separate, small, exact module rather than a "frequency
 * mode" bolted onto a real-valued matrix. Nothing here touches the frozen
 * engine; the series-LCR loop this file models needs no matrix at all, because
 * one loop has one current.
 *
 * ── THE ONE CLAIM THE WHOLE AC BENCH RESTS ON ───────────────────────────────
 * A phasor and a waveform are THE SAME INFORMATION. Not analogous, not related
 * — the same numbers, drawn twice. A phasor of length V₀ standing at angle ωt
 * has vertical projection
 *
 *      V₀ sin(ωt)
 *
 * which IS v(t). So `phasorProjection` and `instantaneous` must agree to the
 * last bit of a double, for every t, every frequency and every phase. That is
 * the check (`1e-12`) that makes the side-by-side drawing an argument rather
 * than a decoration: if the two ever disagreed, the sim would be showing two
 * different things and claiming they were one.
 *
 * ── SIGN CONVENTION ─────────────────────────────────────────────────────────
 * φ is the angle by which the VOLTAGE LEADS THE CURRENT.
 *
 *      φ > 0   inductive — voltage ahead, current lagging  ("ELI")
 *      φ < 0   capacitive — current ahead                  ("ICE")
 *      φ = 0   resistive, or at resonance
 *
 * so v(t) = V₀ sin(ωt) and i(t) = I₀ sin(ωt − φ). Everything else follows;
 * nothing is special-cased per element kind.
 *
 * ── UNITS ───────────────────────────────────────────────────────────────────
 * SI: ohms, henry, farad, hertz, volts, amps, watts. Amplitudes are PEAK
 * values; RMS is peak/√2 and is derived, never stored, so the two can never
 * drift. `fmtRms` is the only place a student sees one turn into the other.
 */

// ── Complex, only as much as is needed ───────────────────────────────────────

export interface Complex { re: number; im: number }

export const cx = (re: number, im: number): Complex => ({ re, im });
export const cAbs = (z: Complex): number => Math.hypot(z.re, z.im);
/** Radians, in (−π, π]. */
export const cArg = (z: Complex): number => Math.atan2(z.im, z.re);
export const cAdd = (a: Complex, b: Complex): Complex => cx(a.re + b.re, a.im + b.im);
export const cMul = (a: Complex, b: Complex): Complex =>
  cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export function cDiv(a: Complex, b: Complex): Complex {
  const d = b.re * b.re + b.im * b.im;
  if (d === 0) return cx(Number.NaN, Number.NaN);
  return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
}

export const RAD = 180 / Math.PI;
export const DEG = Math.PI / 180;

// ── Reactance ────────────────────────────────────────────────────────────────

/** X_L = 2πfL, ohms. Rises with frequency: a coil is a bigger obstacle the
 *  faster you shake it, because ε = −L dI/dt and dI/dt rises with f. */
export const reactanceL = (f: number, L: number): number => 2 * Math.PI * f * L;

/**
 * X_C = 1/(2πfC), ohms. FALLS with frequency, and is infinite at DC — which is
 * the same statement as "a capacitor blocks DC", arrived at from the formula
 * rather than asserted beside it.
 */
export function reactanceC(f: number, C: number): number {
  const d = 2 * Math.PI * f * C;
  return d > 0 ? 1 / d : Number.POSITIVE_INFINITY;
}

// ── The series circuit ───────────────────────────────────────────────────────

/** Which elements are in the loop. All four combinations are one code path. */
export interface AcCircuit {
  /** Ω. Zero means "no resistor" — legal, and it makes the pure-reactance case. */
  R: number;
  /** H. Zero means no inductor. */
  L: number;
  /** F. Zero means no capacitor (NOT an open circuit — it means it is absent). */
  C: number;
  /** Peak source voltage, V. */
  V0: number;
  /** Hz. */
  f: number;
}

export interface AcState {
  f: number;
  omega: number;
  /** Ω — 0 when there is no inductor. */
  XL: number;
  /** Ω — 0 when there is no capacitor (absent, not open). */
  XC: number;
  /** Ω — the reactive part X_L − X_C, signed. This is the number resonance kills. */
  X: number;
  /** Ω — |Z| = √(R² + X²). */
  Z: number;
  /** Degrees, voltage ahead of current. */
  phaseDeg: number;
  /** cos φ, and it is exactly R/Z. */
  powerFactor: number;
  /** A, peak. */
  I0: number;
  /** V, RMS. */
  Vrms: number;
  /** A, RMS. */
  Irms: number;
  /** W — the average over a whole cycle, V_rms I_rms cos φ. */
  avgPower: number;
  /** V·A — what the meters multiply to, ignoring phase. */
  apparentPower: number;
  /** V, peak, across each element. These SUM as phasors, never as numbers,
   *  which is why V_L + V_C can exceed the source and nothing is wrong. */
  VR: number;
  VL: number;
  VC: number;
  /** True when there is a capacitor and the frequency is zero, i.e. DC. */
  blockedByCapacitor: boolean;
}

/**
 * Z = R + j(X_L − X_C).
 *
 * A capacitor with f = 0 gives X_C = ∞ and Z = ∞: no current, which is the
 * correct DC answer and the reason `blockedByCapacitor` exists rather than a
 * NaN escaping into a readout.
 */
export function impedance(c: AcCircuit): Complex {
  const XL = c.L > 0 ? reactanceL(c.f, c.L) : 0;
  const XC = c.C > 0 ? reactanceC(c.f, c.C) : 0;
  if (!Number.isFinite(XC)) return cx(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  return cx(c.R, XL - XC);
}

/** Everything the AC bench reads, from one circuit at one frequency. */
export function acState(c: AcCircuit): AcState {
  const omega = 2 * Math.PI * c.f;
  const XL = c.L > 0 ? reactanceL(c.f, c.L) : 0;
  const XCraw = c.C > 0 ? reactanceC(c.f, c.C) : 0;
  const blocked = !Number.isFinite(XCraw);

  if (blocked) {
    return {
      f: c.f, omega, XL, XC: Number.POSITIVE_INFINITY, X: Number.NEGATIVE_INFINITY,
      Z: Number.POSITIVE_INFINITY, phaseDeg: -90, powerFactor: 0,
      I0: 0, Vrms: c.V0 / Math.SQRT2, Irms: 0, avgPower: 0, apparentPower: 0,
      VR: 0, VL: 0, VC: c.V0, blockedByCapacitor: true,
    };
  }

  const X = XL - XCraw;
  const Z = Math.hypot(c.R, X);
  const phaseDeg = Math.atan2(X, c.R) * RAD;
  const I0 = Z > 0 ? c.V0 / Z : 0;
  const Irms = I0 / Math.SQRT2;
  const Vrms = c.V0 / Math.SQRT2;
  // cos φ from the geometry AND R/Z are the same number; using R/Z keeps it
  // exact at φ = ±90° where cos of a rounded angle would not be exactly 0.
  const powerFactor = Z > 0 ? c.R / Z : 0;

  return {
    f: c.f, omega, XL, XC: XCraw, X, Z, phaseDeg, powerFactor,
    I0, Vrms, Irms,
    avgPower: Vrms * Irms * powerFactor,
    apparentPower: Vrms * Irms,
    VR: I0 * c.R,
    VL: I0 * XL,
    VC: I0 * XCraw,
    blockedByCapacitor: false,
  };
}

// ── Resonance ────────────────────────────────────────────────────────────────

/** f₀ = 1/(2π√(LC)), Hz. Infinite (meaningless) if either is absent. */
export function resonanceFrequency(L: number, C: number): number {
  if (L <= 0 || C <= 0) return Number.NaN;
  return 1 / (2 * Math.PI * Math.sqrt(L * C));
}

/** ω₀ = 1/√(LC), rad/s. */
export function resonanceOmega(L: number, C: number): number {
  if (L <= 0 || C <= 0) return Number.NaN;
  return 1 / Math.sqrt(L * C);
}

/** Q = ω₀L/R = (1/R)√(L/C) — how sharp the resonance is. */
export function qualityFactor(R: number, L: number, C: number): number {
  if (R <= 0 || L <= 0 || C <= 0) return Number.NaN;
  return Math.sqrt(L / C) / R;
}

/** Bandwidth Δf = R/(2πL), Hz — the width between the half-power points. */
export function bandwidth(R: number, L: number): number {
  return L > 0 ? R / (2 * Math.PI * L) : Number.NaN;
}

// ── The waveform, and the phasor that IS the waveform ────────────────────────

/** v(t) = V₀ sin(ωt) and i(t) = I₀ sin(ωt − φ). Peak values in, volts/amps out. */
export function instantaneous(s: AcState, V0: number, t: number): { v: number; i: number; p: number } {
  const wt = s.omega * t;
  const v = V0 * Math.sin(wt);
  const i = s.I0 * Math.sin(wt - s.phaseDeg * DEG);
  return { v, i, p: v * i };
}

/**
 * A phasor as a plain 2-D vector: length `mag`, standing at `angleRad`.
 *
 * The whole point is the `y` component. `phasorAt(V0, ωt).y` is V₀ sin(ωt),
 * which is v(t) — so the rotating arrow and the trace beside it are one object
 * seen two ways, and the verifier holds them equal to 1e-12 across a sweep.
 */
export function phasorAt(mag: number, angleRad: number): { x: number; y: number } {
  return { x: mag * Math.cos(angleRad), y: mag * Math.sin(angleRad) };
}

/** The vertical projection — the value the waveform plots at this instant. */
export const phasorProjection = (mag: number, angleRad: number): number =>
  mag * Math.sin(angleRad);

/** The three element-voltage phasors and the source, at one instant. Drawn
 *  head-to-tail they close the triangle whose hypotenuse is the source. */
export interface PhasorSet {
  /** rad — where the CURRENT phasor stands right now. */
  currentAngle: number;
  /** rad — the source-voltage phasor, currentAngle + φ. */
  voltageAngle: number;
  current: { x: number; y: number };
  source: { x: number; y: number };
  /** V_R is in phase with I; V_L leads I by 90°; V_C lags I by 90°. */
  vR: { x: number; y: number };
  vL: { x: number; y: number };
  vC: { x: number; y: number };
}

export function phasorSet(s: AcState, V0: number, t: number): PhasorSet {
  const wt = s.omega * t;
  const iAng = wt - s.phaseDeg * DEG;
  return {
    currentAngle: iAng,
    voltageAngle: wt,
    current: phasorAt(s.I0, iAng),
    source: phasorAt(V0, wt),
    vR: phasorAt(s.VR, iAng),
    vL: phasorAt(s.VL, iAng + Math.PI / 2),
    vC: phasorAt(s.VC, iAng - Math.PI / 2),
  };
}

/**
 * √(V_R² + (V_L − V_C)²) — the phasor sum of the three element voltages.
 *
 * Must equal the source amplitude. Checking it is how a student finds out that
 * V_L and V_C can each be ten times the supply at resonance without anything
 * being violated: they are opposite, so they cancel in the SUM and not in the
 * individual readings.
 */
export const phasorVoltageSum = (s: AcState): number =>
  Math.hypot(s.VR, s.VL - s.VC);

// ── Average power, computed the hard way ─────────────────────────────────────

const GL_NODES = [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526];
const GL_WEIGHTS = [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538];

/**
 * The cycle-average of p(t) = v(t)i(t), by quadrature over one whole period.
 *
 * `acState.avgPower` gets the same number from V_rms I_rms cos φ. Computing it
 * BOTH ways is the point: "a pure inductor dissipates nothing on average" is a
 * claim about an integral, and a student who has watched p(t) swing positive
 * and negative deserves the integral, not the formula quoting itself.
 *
 * Composite 4-node Gauss–Legendre. The integrand is a product of two sinusoids,
 * i.e. a trig polynomial of degree 2, so this is exact to machine precision
 * rather than merely convergent — which is why the verifier can demand 1e-12
 * agreement instead of 1e-6.
 */
export function averagePowerNumeric(s: AcState, V0: number, subs = 64): number {
  if (s.omega <= 0) return 0;
  const T = (2 * Math.PI) / s.omega;
  const h = T / subs;
  let sum = 0;
  for (let k = 0; k < subs; k++) {
    const mid = k * h + h / 2;
    for (let j = 0; j < 4; j++) {
      const t = mid + (h / 2) * GL_NODES[j];
      sum += GL_WEIGHTS[j] * instantaneous(s, V0, t).p;
    }
  }
  return (sum * (h / 2)) / T;
}

/** The RMS of a sinusoid, computed as an integral rather than quoted as
 *  peak/√2 — so "root mean square" is a description of a procedure the sim
 *  actually carries out. */
export function rmsNumeric(amplitude: number, omega: number, subs = 64): number {
  if (omega <= 0) return 0;
  const T = (2 * Math.PI) / omega;
  const h = T / subs;
  let sum = 0;
  for (let k = 0; k < subs; k++) {
    const mid = k * h + h / 2;
    for (let j = 0; j < 4; j++) {
      const t = mid + (h / 2) * GL_NODES[j];
      const v = amplitude * Math.sin(omega * t);
      sum += GL_WEIGHTS[j] * v * v;
    }
  }
  return Math.sqrt((sum * (h / 2)) / T);
}

// ── Sweeps, for the plots ────────────────────────────────────────────────────

export interface SweepPoint {
  f: number;
  XL: number;
  XC: number;
  Z: number;
  Irms: number;
  phaseDeg: number;
  avgPower: number;
}

/**
 * X_L, X_C, |Z| and I_rms against frequency.
 *
 * Logarithmic in f, because X_C is a 1/f hyperbola: on a linear axis the
 * crossing with X_L is crammed into the left-hand edge and the resonance the
 * exercise is about is invisible.
 */
export function frequencySweep(c: AcCircuit, fMin: number, fMax: number, steps = 160): SweepPoint[] {
  const out: SweepPoint[] = [];
  const lo = Math.log10(Math.max(fMin, 1e-6));
  const hi = Math.log10(Math.max(fMax, fMin * 1.0001));
  for (let k = 0; k <= steps; k++) {
    const f = 10 ** (lo + ((hi - lo) * k) / steps);
    const s = acState({ ...c, f });
    out.push({
      f,
      XL: s.XL,
      XC: Number.isFinite(s.XC) ? s.XC : Number.NaN,
      Z: s.Z,
      Irms: s.Irms,
      phaseDeg: s.phaseDeg,
      avgPower: s.avgPower,
    });
  }
  return out;
}
