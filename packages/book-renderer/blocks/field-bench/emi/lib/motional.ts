/*
 * field-bench/emi/lib/motional.ts — the rod on rails. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * A conducting rod of length ℓ slides at speed v along two rails, closed by a
 * resistance R, all inside a uniform field B out of the page. Then
 *
 *      emf = B ℓ v          I = B ℓ v / R          F_mag = I ℓ B = B²ℓ²v / R
 *
 * and the number that matters more than any of them:
 *
 *      P_mech  =  F_mag · v  =  B²ℓ²v² / R  =  I² R  =  P_elec
 *
 * ── WHY THIS ARCHETYPE EXISTS AT ALL ────────────────────────────────────────
 * Students accept ε = Bℓv as a formula and still believe EMI produces energy
 * out of nowhere — because nothing in the chapter ever shows the two powers
 * side by side. This file computes them by two genuinely different routes:
 * `mechanicalPower` from a FORCE and a SPEED, `electricalPower` from a CURRENT
 * and a RESISTANCE. They agree to the last bit the doubles can hold, and the
 * verifier asserts that to 1e-9 across a sweep rather than at one lucky point.
 *
 * Push the rod harder and the resistor gets hotter by exactly the amount of
 * extra work. Let go and it stops. That is the whole of energy conservation in
 * EMI, in one gesture.
 *
 * ── WHAT IS AND IS NOT INCLUDED ─────────────────────────────────────────────
 * The rails and the rod are ideal conductors; every ohm in the circuit is R.
 * There is no self-inductance (so the current follows the speed with no lag)
 * and no friction. Both are stated in the UI, because a student who later meets
 * `L di/dt` should not think this model was hiding it.
 *
 * The DECELERATION case is closed-form and exact rather than integrated:
 * released at v₀ with no other force, m dv/dt = −B²ℓ²v/R gives
 *
 *      v(t) = v₀ e^{−t/τ}        τ = mR / (B²ℓ²)
 *
 * an exponential with the same shape as an LR circuit's current — a coincidence
 * worth pointing at, since both are "opposition proportional to the thing
 * itself".
 *
 * The FALLING case (a rod dropped down vertical rails) reaches
 *
 *      v_terminal = m g R / (B²ℓ²)
 *
 * which is the moment the magnetic force balances the weight — the same "the
 * FBD balances" reading as terminal velocity in a fluid.
 */

export interface RodSpec {
  /** m — the rail separation, i.e. the length of rod actually in the circuit. */
  length: number;
  /** T, out of the page. */
  B: number;
  /** Ω — the whole circuit. */
  resistance: number;
  /** kg — only needed for the dynamics helpers. */
  mass?: number;
}

export interface RodState {
  v: number;
  /** V — B ℓ v. */
  emf: number;
  /** A. */
  current: number;
  /** N — the magnetic force on the rod, magnitude. Always opposes the motion. */
  magneticForce: number;
  /** N — what you must pull with to hold this speed steady (equal in size). */
  appliedForce: number;
  /** W — appliedForce · v. */
  mechanicalPower: number;
  /** W — I²R, from the current. */
  electricalPower: number;
}

/** emf = B ℓ v. The one line the whole chapter is built on. */
export const motionalEmf = (rod: RodSpec, v: number): number => rod.B * rod.length * v;

/**
 * The complete steady-speed picture.
 *
 * `mechanicalPower` and `electricalPower` are deliberately computed from
 * different quantities — see the header. If they ever disagree, the model is
 * wrong, and that is a check worth being able to run.
 */
export function rodState(rod: RodSpec, v: number): RodState {
  const R = Math.max(rod.resistance, 1e-9);
  const emf = motionalEmf(rod, v);
  const current = emf / R;
  const magneticForce = Math.abs(current) * rod.length * rod.B;
  return {
    v,
    emf,
    current,
    magneticForce,
    appliedForce: magneticForce,
    mechanicalPower: magneticForce * Math.abs(v),
    electricalPower: current * current * R,
  };
}

/** τ = mR/(B²ℓ²) — the time constant of a rod left to coast to a stop. */
export function coastTimeConstant(rod: RodSpec): number {
  const m = rod.mass ?? 0;
  const d = rod.B * rod.B * rod.length * rod.length;
  return d > 0 ? (m * Math.max(rod.resistance, 1e-9)) / d : Number.POSITIVE_INFINITY;
}

/** v(t) = v₀ e^{−t/τ} for a rod released with no applied force. */
export function coastVelocity(rod: RodSpec, v0: number, t: number): number {
  const tau = coastTimeConstant(rod);
  if (!Number.isFinite(tau)) return v0;
  return v0 * Math.exp(-t / tau);
}

/**
 * Total charge that flows while the rod coasts to rest, ∫I dt.
 *
 * q = ∫ Bℓv/R dt = Bℓ/R · ∫v dt = Bℓ v₀ τ / R = m v₀ / (Bℓ) — the initial
 * MOMENTUM divided by Bℓ. Independent of R, which is the surprise: a bigger
 * resistance means less current for longer, and exactly the same charge.
 */
export function coastCharge(rod: RodSpec, v0: number): number {
  const m = rod.mass ?? 0;
  const d = rod.B * rod.length;
  return d !== 0 ? (m * v0) / d : Number.POSITIVE_INFINITY;
}

/** v_terminal = m g R / (B²ℓ²) — where the magnetic force equals the weight. */
export function terminalVelocity(rod: RodSpec, g = 9.8): number {
  const m = rod.mass ?? 0;
  const d = rod.B * rod.B * rod.length * rod.length;
  return d > 0 ? (m * g * Math.max(rod.resistance, 1e-9)) / d : Number.POSITIVE_INFINITY;
}

/**
 * v(t) for a rod dropped from rest down vertical rails:
 *      v(t) = v_t (1 − e^{−t/τ}),  τ = m R / (B²ℓ²)
 * the same τ as coasting, and the same shape as an LR current growing.
 */
export function fallVelocity(rod: RodSpec, t: number, g = 9.8): number {
  const tau = coastTimeConstant(rod);
  if (!Number.isFinite(tau)) return g * t;
  return terminalVelocity(rod, g) * (1 - Math.exp(-t / tau));
}
