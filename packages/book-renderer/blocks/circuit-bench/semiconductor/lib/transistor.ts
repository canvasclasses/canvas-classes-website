/*
 * semiconductor/lib/transistor.ts — what β actually means, physically.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── WHAT β IS, AND WHAT IT IS NOT ───────────────────────────────────────────
 * β is not "the amount a transistor amplifies". It is the ratio in which the base
 * splits the electrons injected into it:
 *
 *      the emitter injects I_E of carriers into the base;
 *      the base is thin and lightly doped, so almost none of them recombine there;
 *      the ones that do come out of the BASE lead — that is I_B;
 *      the ones that do not are swept into the collector — that is I_C;
 *      and β = I_C/I_B is simply how lopsided that split is.
 *
 * β = 100 therefore means "99 out of every 100 carriers make it across the base",
 * which is a statement about GEOMETRY AND DOPING, not about gain. That is why β
 * varies 3:1 between parts on the same reel, why it drifts with temperature, and
 * why no sensible circuit relies on its exact value.
 *
 * And it is why I_C = βI_B has a hard ceiling. Once V_CE has fallen to ~0.2 V
 * there is no field left to sweep carriers across, so the collector cannot take
 * βI_B however much base current arrives. That is SATURATION — the transistor as
 * a closed switch — and the value of β stops mattering entirely.
 *
 * ── WHY THIS IS CLOSED FORM AND NOT ON THE NODAL SOLVER ─────────────────────
 * A bipolar transistor is a THREE-terminal device with a current-controlled
 * current source in it. `CircuitComponent` is strictly two-terminal and
 * `ComponentKind` has no current source, so the frozen E3 engine cannot represent
 * one — reported as a wanted kind rather than faked with a battery behind a huge
 * resistor, which would wreck the matrix conditioning the engine's own header
 * warns about.
 *
 * What CAN go on the nodal solver is the BASE LOOP: V_BB, R_B and the
 * forward-biased base-emitter junction, which is a 0.7 V offset — exactly the same
 * companion element a conducting diode becomes. `baseLoopCircuit()` builds it, and
 * the verifier cross-checks the I_B the frozen MNA returns against the closed form
 * here. Two independent routes to one number is how a wrong sign gets caught.
 */

import type { Circuit } from '../../types';
import { mkBattery, mkNode, mkResistor } from '../../lib/netlist';
import { thermalVoltage, T_ROOM } from './materials';

export interface TransistorSpec {
  /** Common-emitter current gain I_C/I_B in the active region. A device rating —
   *  2N2222 datasheets quote h_FE 100–300 at 150 mA. */
  beta: number;
  /** Base-emitter turn-on voltage, V. 0.7 for silicon, 0.3 for germanium. */
  vbeOn: number;
  /** Collector-emitter saturation voltage, V. ~0.2 V for a silicon small-signal
   *  part; datasheets give V_CE(sat) ≤ 0.3 V at 150 mA. */
  vceSat: number;
  /** Base supply and base resistor. */
  vbb: number;
  rb: number;
  /** Collector supply and collector (load) resistor. */
  vcc: number;
  rc: number;
  label?: string;
}

export type TransistorRegion = 'cutoff' | 'active' | 'saturation';

export interface TransistorState {
  region: TransistorRegion;
  /** Base current, A. */
  ib: number;
  /** Collector current, A. */
  ic: number;
  /** Emitter current, A — always I_B + I_C, in every region. */
  ie: number;
  /** Collector-emitter voltage, V. */
  vce: number;
  /** Base-emitter voltage, V. */
  vbe: number;
  /** The β the transistor is ACTUALLY running at: I_C/I_B. Equal to `beta` in the
   *  active region, and LESS in saturation — which is the measurable signature of
   *  saturation and the thing students are never shown. */
  betaEffective: number;
  /** α = I_C/I_E = β/(1+β). Always just under 1, which is the point. */
  alpha: number;
  /** Base current that would just saturate it: I_B(sat) = I_C(sat)/β. */
  ibSaturation: number;
  /** How many times the saturating base current is being supplied. > 1 means a
   *  solidly closed switch; ~1 means marginal and temperature-sensitive. */
  overdrive: number;
  /** Power dissipated in the transistor, W = V_CE·I_C (+ the small base term). */
  power: number;
  /** Plain-English statement of what the device is doing and why. */
  explanation: string;
}

/**
 * Solve a common-emitter stage.
 *
 * Assumption-then-test, the same discipline as the diode state search: assume
 * ACTIVE, compute V_CE, and if it has fallen below V_CE(sat) the assumption was
 * wrong and the device is saturated. Never both, never neither.
 */
export function solveTransistor(t: TransistorSpec): TransistorState {
  const ibRaw = (t.vbb - t.vbeOn) / t.rb;

  // ── Cutoff ────────────────────────────────────────────────────────────────
  if (ibRaw <= 0) {
    return {
      region: 'cutoff',
      ib: 0,
      ic: 0,
      ie: 0,
      vce: t.vcc,
      vbe: Math.max(0, t.vbb),
      betaEffective: 0,
      alpha: t.beta / (1 + t.beta),
      ibSaturation: (t.vcc - t.vceSat) / t.rc / t.beta,
      overdrive: 0,
      power: 0,
      explanation:
        `The base supply (${t.vbb.toFixed(2)} V) has not reached the ${t.vbeOn.toFixed(2)} V the `
        + 'base-emitter junction needs, so no base current flows at all — and with no base current there '
        + 'is no collector current. The switch is OPEN, and the full supply appears across the transistor.',
    };
  }

  const icSat = (t.vcc - t.vceSat) / t.rc;
  const ibSat = icSat / t.beta;
  const icActive = t.beta * ibRaw;
  const vceActive = t.vcc - icActive * t.rc;

  // ── Saturation ────────────────────────────────────────────────────────────
  if (vceActive <= t.vceSat) {
    const ic = icSat;
    return {
      region: 'saturation',
      ib: ibRaw,
      ic,
      ie: ic + ibRaw,
      vce: t.vceSat,
      vbe: t.vbeOn,
      betaEffective: ic / ibRaw,
      alpha: t.beta / (1 + t.beta),
      ibSaturation: ibSat,
      overdrive: ibRaw / ibSat,
      power: t.vceSat * ic + t.vbeOn * ibRaw,
      explanation:
        `β·I_B would be ${(icActive * 1000).toFixed(2)} mA, but the load resistor cannot pass more than `
        + `${(icSat * 1000).toFixed(2)} mA with only ${t.vcc.toFixed(1)} V to work with. So V_CE has bottomed `
        + `out at ${t.vceSat.toFixed(2)} V and the effective β has fallen to ${(ic / ibRaw).toFixed(1)}. `
        + 'The switch is CLOSED — and notice that β has stopped mattering, which is exactly why a switch '
        + 'is designed to sit here rather than in the active region.',
    };
  }

  // ── Active ────────────────────────────────────────────────────────────────
  return {
    region: 'active',
    ib: ibRaw,
    ic: icActive,
    ie: icActive + ibRaw,
    vce: vceActive,
    vbe: t.vbeOn,
    betaEffective: t.beta,
    alpha: t.beta / (1 + t.beta),
    ibSaturation: ibSat,
    overdrive: ibRaw / ibSat,
    power: vceActive * icActive + t.vbeOn * ibRaw,
    explanation:
      `${(ibRaw * 1e6).toFixed(1)} µA into the base is controlling ${(icActive * 1000).toFixed(2)} mA `
      + `into the collector — ${t.beta.toFixed(0)} times as much, because only one carrier in `
      + `${(t.beta + 1).toFixed(0)} recombines in the base and the rest are swept across. V_CE sits at `
      + `${vceActive.toFixed(2)} V, so there is still field left to do the sweeping and the ratio holds.`,
  };
}

// ── Amplification ────────────────────────────────────────────────────────────

export interface GainResult {
  /** The d.c. gain a student measures by nudging V_BB and watching V_CE:
   *  A_v = ΔV_CE/ΔV_BB = −β·R_C/R_B. Negative — the output is INVERTED. */
  dcGain: number;
  /** Small-signal transconductance g_m = I_C/V_T, S. */
  gm: number;
  /** The transconductance gain −g_m·R_C, which is what the stage really does at
   *  a.c. once the base is coupled through a capacitor. */
  intrinsicGain: number;
  /** Current gain in the a.c. sense, ΔI_C/ΔI_B — just β. */
  currentGain: number;
  /** Power gain = current gain × voltage gain (magnitudes). */
  powerGain: number;
  /** True when the stage is not in the active region, so no linear gain exists. */
  clipped: boolean;
  note: string;
}

/**
 * Gain of a common-emitter stage.
 *
 * TWO numbers, deliberately, because they answer two different questions and
 * conflating them is a standing source of confusion:
 *
 *  • `dcGain = −βR_C/R_B` is what you MEASURE on this circuit by changing V_BB —
 *    the base resistor is part of the input path, so it divides the input down.
 *    This is the form NCERT derives.
 *  • `intrinsicGain = −g_m R_C = −(I_C/V_T)R_C` is what the TRANSISTOR does, once
 *    the base is driven from a low-impedance source. It is typically 100× larger,
 *    and it is the number a real amplifier is designed around.
 *
 * The minus sign is not a convention: rising base current means rising collector
 * current means a bigger drop across R_C means a FALLING collector voltage. A
 * common-emitter stage inverts, always.
 */
export function gainOf(t: TransistorSpec, state: TransistorState, temperatureK = T_ROOM): GainResult {
  const vt = thermalVoltage(temperatureK);
  const active = state.region === 'active';
  const gm = state.ic / vt;
  return {
    dcGain: active ? -(t.beta * t.rc) / t.rb : 0,
    gm,
    intrinsicGain: active ? -gm * t.rc : 0,
    currentGain: active ? t.beta : 0,
    powerGain: active ? t.beta * Math.abs((t.beta * t.rc) / t.rb) : 0,
    clipped: !active,
    note: active
      ? 'Both gains are negative because the stage inverts: more base current pulls the collector DOWN.'
      : state.region === 'saturation'
        ? 'Saturated. The output cannot move any further down, so a larger input produces no larger output — this is clipping, and it is why an amplifier is biased in the middle of the active region rather than near either end.'
        : 'Cut off. The output is stuck at the supply rail, so a smaller input produces no smaller output — the other half of clipping.',
  };
}

/**
 * The transfer characteristic: V_CE against V_BB, swept.
 *
 * Its shape is the whole lesson about the difference between a switch and an
 * amplifier. It is flat at V_CC (cutoff), then a steep straight run (active — and
 * an amplifier lives on this slope), then flat at V_CE(sat) (saturated — and a
 * switch lives at the two ends). One curve, both applications.
 */
export interface TransferPoint { vbb: number; vce: number; ic: number; region: TransistorRegion }

export function transferCurve(t: TransistorSpec, vbbMax: number, n = 200): TransferPoint[] {
  const out: TransferPoint[] = [];
  for (let k = 0; k <= n; k++) {
    const vbb = (vbbMax * k) / n;
    const s = solveTransistor({ ...t, vbb });
    out.push({ vbb, vce: s.vce, ic: s.ic, region: s.region });
  }
  return out;
}

/** The two V_BB values that bracket the active region — the ends of the useful
 *  slope, computed rather than eyeballed off the curve. */
export function activeWindow(t: TransistorSpec): { from: number; to: number } {
  const icSat = (t.vcc - t.vceSat) / t.rc;
  return {
    from: t.vbeOn,
    to: t.vbeOn + (icSat / t.beta) * t.rb,
  };
}

// ── The base loop, as a real circuit for the frozen solver ───────────────────

/**
 * The base loop as an E3 circuit: V_BB in series with R_B and the base-emitter
 * junction, the junction represented by its 0.7 V companion — the SAME element a
 * conducting diode becomes in `solveDiode.ts`.
 *
 * This exists so the base current has two independent derivations: this circuit
 * through the frozen nodal solver, and `(V_BB − V_BE)/R_B` in `solveTransistor`.
 * The verifier asserts they agree. A sign error in either one shows up
 * immediately, which is the argument for building it at all.
 *
 * Nodes: `bb` (supply +), `b` (base), `e` (emitter, ground).
 */
export function baseLoopCircuit(t: TransistorSpec): Circuit {
  return {
    nodes: [
      mkNode('e', 0, 0, { label: 'emitter', ground: true }),
      mkNode('bb', 0, 2, { label: 'base supply' }),
      mkNode('b', 2, 2, { label: 'base' }),
    ],
    components: [
      // a is the − terminal, b the +, so this raises `bb` to V_BB above ground.
      mkBattery('VBB', 'e', 'bb', t.vbb, { label: 'V_BB' }),
      mkResistor('RB', 'bb', 'b', t.rb, { label: 'R_B' }),
      // The base-emitter junction, forward biased: a 0.7 V offset from base to
      // emitter. EMF = −V_BE with a = base gives V(base) − V(emitter) = +V_BE.
      mkBattery('QBE', 'b', 'e', -t.vbeOn, { label: 'base-emitter junction' }),
    ],
  };
}
