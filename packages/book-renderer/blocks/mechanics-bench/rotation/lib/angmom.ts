/*
 * rotation/lib/angmom.ts — L is conserved. KE is not. Where did it come from?
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE QUESTION THIS MODULE EXISTS TO PROVOKE ───────────────────────────────
 * Spin on a chair with weights at arm's length, pull them in, and you speed up.
 * Every student can predict that. Almost none can answer the follow-up:
 *
 *      If L = Iω is conserved and I halves, ω doubles.
 *      KE = ½Iω² then goes to ½·(I/2)·(2ω)² = 2 × ½Iω².
 *      The kinetic energy DOUBLED. Conservation of energy — where from?
 *
 * The answer is that pulling the weights inward is WORK. The weights are moving
 * in a circle, so something has to supply the centripetal force; pulling them to
 * a smaller radius means that force acts through a distance, and the person on
 * the chair does exactly the missing joules. Nothing was created.
 *
 * This is the cleanest example in Class 11 of "a conservation law is a statement
 * about ONE quantity" — and the most common place a student generalises one law
 * into a second one that does not hold.
 *
 * ── WHY KE ALWAYS RISES WHEN YOU PULL IN ─────────────────────────────────────
 * With L fixed, KE = L²/2I. Reducing I can only raise it. So the work is always
 * positive going in, and always negative (you get energy back, and can feel the
 * weights pulling your arms out) going the other way — which is the check that
 * makes the argument physical rather than algebraic.
 */

export interface ChairState {
  /** kg m² — the person plus the chair, unchanged by the arms. */
  coreInertia: number;
  /** kg, each. Two weights, one per hand. */
  weightMass: number;
  /** m — distance of each weight from the spin axis. */
  armLength: number;
  /** How many weights. 2 is the demonstration; 1 is allowed for a lopsided
   *  version, which is why this is a number rather than a hardcoded 2. */
  count?: number;
}

/** I = I_core + n·m·r². The weights are treated as point masses, which is what
 *  makes the r² dependence the only thing that moves. */
export function chairInertia(s: ChairState): number {
  return s.coreInertia + (s.count ?? 2) * s.weightMass * s.armLength * s.armLength;
}

export const angularMomentum = (I: number, omega: number): number => I * omega;

export const rotationalKE = (I: number, omega: number): number => 0.5 * I * omega * omega;

/** ω after a change of inertia, from L = Iω being conserved. */
export const spinAfter = (I0: number, omega0: number, I1: number): number =>
  (I0 * omega0) / I1;

/**
 * The work the person on the chair must do, J — exactly the change in kinetic
 * energy, because nothing else is putting energy in.
 *
 *      W = L²/2I₁ − L²/2I₀
 *
 * Positive pulling in, negative letting out.
 */
export function workToChangeInertia(I0: number, omega0: number, I1: number): number {
  const L = I0 * omega0;
  return (L * L) / (2 * I1) - (L * L) / (2 * I0);
}

export interface ChairTransition {
  I0: number;
  I1: number;
  omega0: number;
  omega1: number;
  /** kg m² s⁻¹ — identical before and after, and printed so a student can check. */
  L0: number;
  L1: number;
  ke0: number;
  ke1: number;
  /** ke1 / ke0. Equals I0/I1 exactly — the ratio the sim asks them to predict. */
  keRatio: number;
  /** ω1 / ω0, also I0/I1. */
  spinRatio: number;
  /** J the person supplied. */
  work: number;
  /** Revolutions per minute, for a readout a human can picture. */
  rpm0: number;
  rpm1: number;
}

/** Pull the arms from `armLength` to `newArmLength` and report both accounts. */
export function pullIn(state: ChairState, omega0: number, newArmLength: number): ChairTransition {
  const I0 = chairInertia(state);
  const I1 = chairInertia({ ...state, armLength: newArmLength });
  const omega1 = spinAfter(I0, omega0, I1);
  const ke0 = rotationalKE(I0, omega0);
  const ke1 = rotationalKE(I1, omega1);
  return {
    I0, I1, omega0, omega1,
    L0: angularMomentum(I0, omega0),
    L1: angularMomentum(I1, omega1),
    ke0, ke1,
    keRatio: ke0 > 0 ? ke1 / ke0 : 1,
    spinRatio: omega0 !== 0 ? omega1 / omega0 : 1,
    work: ke1 - ke0,
    rpm0: (omega0 * 60) / (2 * Math.PI),
    rpm1: (omega1 * 60) / (2 * Math.PI),
  };
}

/**
 * The arm length that produces a target inertia — used by the sim to place the
 * "halve I" handle exactly, so the headline claim (I halves ⇒ ω doubles ⇒ KE
 * doubles) is reachable by dragging rather than only by arithmetic.
 *
 * Returns null when the target is below the core inertia, which no arm position
 * can reach: the chair and the person are always there.
 */
export function armLengthForInertia(s: ChairState, targetI: number): number | null {
  const n = s.count ?? 2;
  const rest = targetI - s.coreInertia;
  if (rest < 0 || n * s.weightMass <= 0) return null;
  return Math.sqrt(rest / (n * s.weightMass));
}
