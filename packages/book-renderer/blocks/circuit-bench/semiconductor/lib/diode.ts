/*
 * semiconductor/lib/diode.ts — the diode, in the two models a student needs.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── TWO MODELS, AND BOTH ARE HONEST ABOUT WHICH THEY ARE ────────────────────
 *
 * 1. THE SHOCKLEY EQUATION — for the CHARACTERISTIC CURVE the student reads.
 *
 *        I = I_S ( e^(V / n V_T) − 1 )
 *
 *    It is the real thing: a smooth curve with no knee in it anywhere, which is
 *    the lesson. "The knee at 0.7 V" is not a feature of the equation — it is
 *    what an exponential looks like on a linear axis. Plot the same curve with a
 *    log current axis and it is a straight line, rising one decade per
 *    2.303·n·V_T = 59.5 mV at 300 K, and the knee vanishes. Both views ship.
 *
 * 2. THE PIECEWISE-LINEAR MODEL — for SOLVING CIRCUITS.
 *
 *        off        : no current at all
 *        forward on : V = V_knee (+ I·r_bulk if a bulk resistance is given)
 *        breakdown  : V = −V_Z   (Zener only)
 *
 *    This is the model every exam question uses, and — the part that matters
 *    here — it is LINEAR in each state, so the frozen E3 nodal solver can do the
 *    work. See `solveDiode.ts`. Nothing in this program has a second solver.
 *
 * ── WHERE I_S COMES FROM, SAID PLAINLY ──────────────────────────────────────
 * I_S is not looked up. It is CALIBRATED so the Shockley curve passes through
 * the taught operating point — 1 mA at the cut-in voltage of that material:
 *
 *        I_S = I_ref · e^(−V_knee / n V_T)
 *
 * With n = 1 and I_ref = 1 mA that gives 1.73×10⁻¹⁵ A for silicon (V_knee =
 * 0.7 V) and 9.11×10⁻⁹ A for germanium (0.3 V). Those are the right ORDERS of
 * magnitude — silicon leaks femtoamps to picoamps, germanium nanoamps, and the
 * fact that germanium leaks vastly more in reverse is exactly why silicon won.
 * The ~10⁶ RATIO between them overstates the real 10³–10⁴ because n = 1 is
 * idealised; the direction is a real result, the ratio is not a claim, and the UI
 * says so. Nothing else in this file depends on I_S being a measured quantity.
 */

import { material, thermalVoltage, T_ROOM, type Material } from './materials';

/** The reference forward current the knee voltage is defined AT. 1 mA is the
 *  operating point textbooks quote V_F at. */
export const I_REF = 1e-3;

export interface DiodeSpec {
  id: string;
  /** Node ids: anode (p-side) and cathode (n-side). Current is positive
   *  anode → cathode, matching the E3 convention (netlist.ts). */
  anode: string;
  cathode: string;
  material: Material;
  /** Forward cut-in voltage, V. A device rating. */
  knee: number;
  /** Ideality factor. 1 for the ideal junction; real diodes run 1.0–2.0. */
  ideality: number;
  /** Bulk series resistance, Ω. Zero gives the exact constant-drop model the
   *  frozen MNA can solve with no conductance at all — see solveDiode.ts. */
  bulk: number;
  /** Reverse breakdown voltage, V, positive. `Infinity` for a diode not being
   *  used as a Zener. */
  breakdown: number;
  /** Slope resistance in breakdown, Ω. A real Zener is a few ohms. */
  zenerResistance: number;
  label?: string;
}

export interface DiodeOptions {
  material?: string;
  knee?: number;
  ideality?: number;
  bulk?: number;
  breakdown?: number;
  zenerResistance?: number;
  label?: string;
}

export function diode(id: string, anode: string, cathode: string, o: DiodeOptions = {}): DiodeSpec {
  const m = material(o.material ?? 'Si');
  return {
    id,
    anode,
    cathode,
    material: m,
    knee: o.knee ?? m.kneeVolts,
    ideality: o.ideality ?? 1,
    bulk: o.bulk ?? 0,
    breakdown: o.breakdown ?? Number.POSITIVE_INFINITY,
    zenerResistance: o.zenerResistance ?? 5,
    ...(o.label ? { label: o.label } : {}),
  };
}

/** Reverse saturation current, A — calibrated to the taught knee. See header. */
export function saturationCurrent(d: DiodeSpec, temperatureK = T_ROOM): number {
  const vt = thermalVoltage(temperatureK) * d.ideality;
  return I_REF * Math.exp(-d.knee / vt);
}

/**
 * The Shockley current at a bias voltage, A.
 *
 * Includes the Zener branch when a breakdown voltage is set, because a
 * characteristic curve that stops at the axis teaches that reverse bias is
 * simply "off" — and the whole point of a Zener is that it is not.
 *
 * ⚠ The exponent is clamped at 80 (e⁸⁰ ≈ 6×10³⁴). Past that the current is
 * hundreds of amps, i.e. far outside anything the model is valid for, and the
 * unclamped `exp` overflows to Infinity and poisons every plot scale downstream.
 * Clamping is stated rather than silent.
 */
export function shockleyCurrent(d: DiodeSpec, v: number, temperatureK = T_ROOM): number {
  const vt = thermalVoltage(temperatureK) * d.ideality;
  const is = saturationCurrent(d, temperatureK);

  if (Number.isFinite(d.breakdown) && v <= -d.breakdown) {
    // Breakdown: a nearly vertical line at −V_Z, slope 1/r_z.
    return -(-v - d.breakdown) / Math.max(d.zenerResistance, 1e-6) - is;
  }
  const x = Math.min(80, v / vt);
  return is * (Math.exp(x) - 1);
}

/**
 * The bias voltage at a given forward current, V — the Shockley equation solved
 * for V. Exact, no iteration.
 *
 *      V = n V_T ln(I/I_S + 1)
 *
 * This is the function that makes "V(1 mA) = the knee voltage" true BY
 * CONSTRUCTION, and the verifier checks it comes back to 0.700 V for silicon.
 */
export function voltageAtCurrent(d: DiodeSpec, i: number, temperatureK = T_ROOM): number {
  const vt = thermalVoltage(temperatureK) * d.ideality;
  const is = saturationCurrent(d, temperatureK);
  return vt * Math.log(i / is + 1);
}

/** Volts per decade of current on the forward branch — 2.303·n·V_T, which is
 *  59.5 mV at 300 K for n = 1. A real, checkable claim about the exponential,
 *  independent of any calibration. */
export const voltsPerDecade = (d: DiodeSpec, temperatureK = T_ROOM): number =>
  Math.LN10 * thermalVoltage(temperatureK) * d.ideality;

export interface IVPoint { v: number; i: number }

/**
 * The characteristic curve.
 *
 * Sampled non-uniformly on purpose: the forward branch past the knee turns
 * through nearly a right angle in 100 mV, and a uniform sweep either misses the
 * corner or wastes 90% of its points on a flat line. Density is highest where
 * the curvature is.
 */
export function ivCurve(
  d: DiodeSpec, vMin: number, vMax: number, n = 240, temperatureK = T_ROOM,
): IVPoint[] {
  const out: IVPoint[] = [];
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    // Cubic easing toward vMax puts most samples in the forward corner.
    const v = vMin + (vMax - vMin) * (u * u * u * 0.55 + u * 0.45);
    out.push({ v, i: shockleyCurrent(d, v, temperatureK) });
  }
  return out.sort((a, b) => a.v - b.v);
}

// ── The piecewise-linear states ──────────────────────────────────────────────

export type DiodeState = 'off' | 'forward' | 'breakdown';

/** Which states this device is allowed to be in. A plain diode has two; a Zener
 *  has three. Enumerating fewer states is what makes the search cheap. */
export function allowedStates(d: DiodeSpec): DiodeState[] {
  return Number.isFinite(d.breakdown)
    ? ['off', 'forward', 'breakdown']
    : ['off', 'forward'];
}

/**
 * Is an assumed state consistent with the solved circuit?
 *
 * This is the test half of the assumption-then-test fixed point — the same
 * pattern `mechanics-bench` uses for static-versus-kinetic friction, and for the
 * same reason: the element's behaviour depends on the answer, so you assume,
 * solve, and check.
 *
 *   forward    the current must actually flow anode → cathode
 *   off        the p.d. must not have reached the knee, and (for a Zener) must
 *              not have reached breakdown either
 *   breakdown  the current must actually flow cathode → anode
 *
 * `vab` is V(anode) − V(cathode); `iab` is the current anode → cathode.
 */
export function stateIsConsistent(
  d: DiodeSpec, state: DiodeState, vab: number, iab: number,
): boolean {
  const TOL_I = 1e-9;
  const TOL_V = 1e-9;
  switch (state) {
    case 'forward':
      return iab >= -TOL_I;
    case 'breakdown':
      return iab <= TOL_I;
    case 'off':
      return vab <= d.knee + TOL_V
        && (!Number.isFinite(d.breakdown) || vab >= -d.breakdown - TOL_V);
    default:
      return false;
  }
}

/** Plain English for a readout — what the device is doing and why. */
export function explainState(d: DiodeSpec, state: DiodeState): string {
  const name = d.label ?? d.id;
  switch (state) {
    case 'forward':
      return `${name} is conducting: ${d.knee.toFixed(2)} V across it, and whatever current the rest of the circuit allows.`;
    case 'breakdown':
      return `${name} has broken down in reverse and is holding ${d.breakdown.toFixed(2)} V — which is the whole point of a Zener, and would destroy an ordinary diode.`;
    default:
      return `${name} is off. Not "a small current" — the p.d. across it has not reached ${d.knee.toFixed(2)} V, so nothing flows.`;
  }
}
