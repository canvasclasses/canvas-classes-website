/*
 * field-bench/emi/lib/eddy.ts — eddy-current braking, and why slots help. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * ── THE MODEL, STATED OUT LOUD ──────────────────────────────────────────────
 * A solid plate entering a field region has no wires in it, so there is no
 * single loop to point at. The honest way to model it in 2-D is as a stack of
 * INDEPENDENT eddy loops, and then to be explicit about the two geometric
 * assumptions that turn that picture into a number:
 *
 *   1. The eddy loops that matter are roughly SQUARE, of side `a` — the largest
 *      loop the metal allows. A slot cut along the direction of motion caps `a`
 *      at the strip height, which is the entire mechanism by which slotting
 *      works. With `s` slots, a = h/s.
 *
 *   2. The current in one loop spreads over about a QUARTER of the loop's own
 *      size, so that loop's resistance is
 *          R_loop = ρ · (perimeter) / (thickness · path width)
 *                 ≈ ρ · 4a / (t · a/4) = 16 ρ / t
 *      — INDEPENDENT of a. That independence is the non-obvious part and it is
 *      what makes the scaling come out right.
 *
 * With those two, for a plate whose leading edge is crossing the field boundary
 * at speed v:
 *
 *      one loop:  emf ≈ B a v        P_loop = (B a v)² t / (16 ρ)
 *      how many:  s = h / a
 *      total:     P = s · P_loop = B² v² t h a / (16 ρ) = B² v² t h² / (16 ρ s)
 *
 *      F = P / v = B² v t h² / (16 ρ s)
 *
 * ── WHAT IS EXACT AND WHAT IS NOT — READ BEFORE QUOTING A NUMBER ────────────
 * The SCALING is the physics and it is right: braking power goes as B², as v²,
 * as the plate thickness, and as 1/(number of slots). Double the slots and the
 * braking halves. That is the claim the exercise makes and the claim the
 * verifier checks.
 *
 * The factor 16 is a shape factor from assumption 2, not a measured constant.
 * A real slotted disc brake needs a finite-element solve. So the UI prints the
 * force with an explicit "lumped model" note and the sim never invites a
 * student to memorise the absolute value. Naming the assumption is the only way
 * to have a live eddy-brake at all without inventing precision.
 *
 * ── WHY A SOLID PLATE IS NOT "s = 1" BY LUCK ────────────────────────────────
 * For an unslotted plate the largest loop is limited by the plate itself, so
 * a = h and s = 1 falls out of the same formula rather than being a special
 * case. `slotCount = 1` is therefore the solid plate, exactly.
 */

/** Resistivity, Ω·m. Copper and aluminium are the two a student will meet. */
export const RESISTIVITY = {
  copper: 1.68e-8,
  aluminium: 2.65e-8,
  /** Not a brake material — included because a plate that barely brakes makes
   *  the point that CONDUCTIVITY is doing the work, not "being metal". */
  stainless: 6.9e-7,
} as const;

export type PlateMaterial = keyof typeof RESISTIVITY;

export interface PlateSpec {
  /** m — extent along y, across the direction of motion. Slots divide THIS. */
  height: number;
  /** m — extent along x, the direction of motion. */
  width: number;
  /** m. */ thickness: number;
  /** Ω·m. */ resistivity: number;
  /** kg — only needed for the dynamics helpers. */
  mass?: number;
  /** 1 = a solid plate. */
  slots: number;
}

/** The shape factor of assumption 2 in the header. Named so it can never be
 *  mistaken for a physical constant. */
export const LOOP_SHAPE_FACTOR = 16;

/** m — the side of the largest eddy loop the metal allows. */
export const eddyLoopSize = (plate: PlateSpec): number =>
  plate.height / Math.max(1, plate.slots);

/** Ω — one eddy loop's resistance. Independent of the loop size; see the header. */
export const eddyLoopResistance = (plate: PlateSpec): number =>
  (LOOP_SHAPE_FACTOR * plate.resistivity) / Math.max(plate.thickness, 1e-9);

export interface EddyState {
  v: number;
  /** m — side of one eddy loop. */
  loopSize: number;
  /** How many independent loops the slots leave. */
  loopCount: number;
  /** V — emf round ONE loop. */
  loopEmf: number;
  /** A — current in ONE loop. */
  loopCurrent: number;
  /** W — total dissipated in the plate. */
  power: number;
  /** N — retarding force, magnitude. */
  force: number;
}

/**
 * The braking picture at one speed.
 *
 * `power` is computed as (loops × per-loop dissipation) and `force` as power/v,
 * so a zero speed gives zero force without a divide-by-zero: at v = 0 there is
 * no emf, no current, and the force is exactly zero.
 */
export function eddyState(plate: PlateSpec, B: number, v: number): EddyState {
  const a = eddyLoopSize(plate);
  const R = eddyLoopResistance(plate);
  const count = Math.max(1, plate.slots);
  const loopEmf = B * a * Math.abs(v);
  const loopCurrent = loopEmf / R;
  const power = count * loopCurrent * loopCurrent * R;
  return {
    v,
    loopSize: a,
    loopCount: count,
    loopEmf,
    loopCurrent,
    power,
    force: Math.abs(v) > 0 ? power / Math.abs(v) : 0,
  };
}

/** N·s/m — the drag COEFFICIENT b in F = b·v, which is what makes the
 *  1/slots scaling checkable without picking a speed. */
export function dragCoefficient(plate: PlateSpec, B: number): number {
  const a = eddyLoopSize(plate);
  const R = eddyLoopResistance(plate);
  const count = Math.max(1, plate.slots);
  // F = count · (B a v)²/R / v = count · B² a² v / R
  return (count * B * B * a * a) / R;
}

/** v_terminal = mg/b for a plate falling into a field region. */
export function plateTerminalVelocity(plate: PlateSpec, B: number, g = 9.8): number {
  const b = dragCoefficient(plate, B);
  const m = plate.mass ?? 0;
  return b > 0 ? (m * g) / b : Number.POSITIVE_INFINITY;
}

/**
 * v(t) for a plate released at v₀ with only the eddy drag acting:
 *      m dv/dt = −b v   ⇒   v = v₀ e^{−bt/m}
 * The same exponential as the rod, and as an LR circuit. Three different
 * systems, one shape, because all three oppose in proportion to the thing.
 */
export function plateCoastVelocity(plate: PlateSpec, B: number, v0: number, t: number): number {
  const b = dragCoefficient(plate, B);
  const m = plate.mass ?? 0;
  if (m <= 0 || b <= 0) return v0;
  return v0 * Math.exp((-b * t) / m);
}
