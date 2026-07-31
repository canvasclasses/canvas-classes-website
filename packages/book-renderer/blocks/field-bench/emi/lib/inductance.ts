/*
 * field-bench/emi/lib/inductance.ts — self and mutual inductance. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * ── THE ONE SENTENCE THIS FILE HAS TO MAKE UNDENIABLE ───────────────────────
 * An inductor opposes the CHANGE in current, not the current.
 *
 * Every wrong answer in this topic comes from the other belief. A student who
 * thinks an inductor "resists current" predicts that a big steady current means
 * a big back-EMF, and that a coil carrying nothing has nothing to say. Both are
 * backwards, and the way to break it is to let them drive the current
 * themselves and watch the back-EMF track the SLOPE:
 *
 *      ε_L = −L (dI/dt)
 *
 *      steady 5 A          → dI/dt = 0 → ε = 0          (biggest current, no EMF)
 *      ramping 0 → 1 A     → dI/dt ≠ 0 → ε ≠ 0          (tiny current, real EMF)
 *      ramping DOWN        → ε flips sign, and now it PUSHES current along
 *
 * That last one is why a switch arcs when you open an inductive circuit, which
 * is the real-world hook.
 *
 * ── THE GEOMETRY IS THE STANDARD SOLENOID RESULT, CITED ─────────────────────
 * For a long air-cored solenoid of N turns, cross-section A and length ℓ
 * (NCERT Physics XII, ch. 6, "Inductance"):
 *
 *      L = μ₀ N² A / ℓ
 *
 * and for a second coil of N₂ turns wound over the same core, with ALL the flux
 * linked (the ideal coupling a first course assumes):
 *
 *      M = μ₀ N₁ N₂ A / ℓ        and therefore   M = √(L₁ L₂)
 *
 * The second identity is not a separate fact — it drops out of the first two,
 * and the verifier checks that it does. Real coils have M = k√(L₁L₂) with
 * k < 1; `coupling` carries k so the model can be honest about that without
 * pretending to compute it.
 *
 * ── ENERGY ──────────────────────────────────────────────────────────────────
 * U = ½ L I². Stored, not dissipated — an ideal inductor gives every joule back
 * when the current falls, which is exactly why LC circuits oscillate forever and
 * why the AC bench finds zero average power in a pure inductor. Same fact,
 * three chapters.
 */

/** μ₀, exact by the pre-2019 SI definition and the value NCERT prints. */
export const MU0 = 4 * Math.PI * 1e-7;

export interface CoilSpec {
  turns: number;
  /** m² — cross-sectional area. */
  area: number;
  /** m — solenoid length. */
  length: number;
}

/** L = μ₀ N² A / ℓ, henry. */
export function selfInductance(coil: CoilSpec): number {
  return (MU0 * coil.turns * coil.turns * coil.area) / Math.max(coil.length, 1e-9);
}

/**
 * M = k μ₀ N₁ N₂ A / ℓ, henry — two coils on one core of length ℓ and area A.
 *
 * `coupling` is k, the fraction of the primary's flux the secondary actually
 * sees. k = 1 is the ideal transformer a first course assumes; a real air-cored
 * pair might be 0.3, and an iron-cored one 0.99.
 */
export function mutualInductance(
  primary: CoilSpec, secondaryTurns: number, coupling = 1,
): number {
  return (
    coupling * MU0 * primary.turns * secondaryTurns * primary.area
    / Math.max(primary.length, 1e-9)
  );
}

/** ε_L = −L dI/dt, volts. The whole file in one line. */
export const backEmf = (L: number, dIdt: number): number => -L * dIdt;

/** ε₂ = −M dI₁/dt, volts — the secondary's EMF from the primary's slope. */
export const mutualEmf = (M: number, dI1dt: number): number => -M * dI1dt;

/** U = ½ L I², joules. */
export const inductorEnergy = (L: number, I: number): number => 0.5 * L * I * I;

// ── A current the student drives ──────────────────────────────────────────────

/**
 * The current programme: a trapezoid the student shapes with three numbers.
 * Ramp up over `rampUp`, hold at `peak` for `hold`, ramp down over `rampDown`.
 *
 * A trapezoid rather than a sine because the LESSON needs a segment with a
 * CONSTANT non-zero current: on a sine there is no interval where dI/dt is zero,
 * so "big current, no EMF" can only be glimpsed at one instant. On the hold
 * segment it lasts as long as the student wants to stare at it.
 */
export interface RampSpec {
  peak: number;
  rampUp: number;
  hold: number;
  rampDown: number;
}

export type RampPhase = 'rising' | 'steady' | 'falling' | 'off';

export interface RampSample {
  t: number;
  current: number;
  /** A/s — the SLOPE, which is what the inductor actually reacts to. */
  dIdt: number;
  phase: RampPhase;
  /** V — the back-EMF at this instant. */
  emf: number;
  /** J — energy stored right now. */
  energy: number;
}

/** Total duration of the programme, seconds. */
export const rampDuration = (r: RampSpec): number => r.rampUp + r.hold + r.rampDown;

/**
 * The current and its slope at time t.
 *
 * The slope is the RIGHT-hand derivative at each corner, for the same reason
 * `dOverlapDx` takes a direction: at t = rampUp the slope genuinely jumps from
 * peak/rampUp to 0, and averaging the two sides would draw an EMF that never
 * existed. A real coil rounds those corners (its own L does it); the model says
 * so in the UI rather than smoothing them silently.
 */
export function rampSample(r: RampSpec, L: number, t: number): RampSample {
  const upEnd = r.rampUp;
  const holdEnd = upEnd + r.hold;
  const end = holdEnd + r.rampDown;

  let current: number;
  let dIdt: number;
  let phase: RampPhase;

  if (t < 0) {
    current = 0; dIdt = 0; phase = 'off';
  } else if (t < upEnd) {
    dIdt = r.rampUp > 0 ? r.peak / r.rampUp : 0;
    current = dIdt * t; phase = 'rising';
  } else if (t < holdEnd) {
    current = r.peak; dIdt = 0; phase = 'steady';
  } else if (t < end) {
    dIdt = r.rampDown > 0 ? -r.peak / r.rampDown : 0;
    current = r.peak + dIdt * (t - holdEnd); phase = 'falling';
  } else {
    current = 0; dIdt = 0; phase = 'off';
  }

  return { t, current, dIdt, phase, emf: backEmf(L, dIdt), energy: inductorEnergy(L, current) };
}

/** The three plateau values a readout compares: EMF while rising, while steady,
 *  and while falling. Returned together so the panel can put them in one row and
 *  the middle one can be zero in front of the student. */
export function rampEmfSummary(r: RampSpec, L: number): { rising: number; steady: number; falling: number } {
  return {
    rising: backEmf(L, r.rampUp > 0 ? r.peak / r.rampUp : 0),
    steady: 0,
    falling: backEmf(L, r.rampDown > 0 ? -r.peak / r.rampDown : 0),
  };
}
