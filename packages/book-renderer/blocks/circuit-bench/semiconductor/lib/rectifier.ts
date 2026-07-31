/*
 * semiconductor/lib/rectifier.ts — input and output, side by side.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── WHAT MAKES THIS A SIMULATION AND NOT A DRAWING ──────────────────────────
 * The output waveform is not a shape this file knows. It is the input sinusoid
 * sampled at 240 phases, with the frozen E3 nodal solver run at EVERY phase and
 * the diode states re-decided from scratch each time (`solveDiode.ts`). So the
 * missing negative half of a half-wave output is a CONSEQUENCE of the diode being
 * found inconsistent in the forward state at those phases — not a `Math.max(0, …)`
 * dressed up as physics. Change the diode's knee, or its direction, and the
 * waveform follows because the solve does.
 *
 * The averages are then integrated numerically FROM THAT SOLVED WAVEFORM, and the
 * verifier checks the integral against the closed forms every textbook quotes:
 *
 *      half wave (ideal)   V_avg = V_p/π  = 0.3183 V_p ,  V_rms = V_p/2
 *      full wave (ideal)   V_avg = 2V_p/π = 0.6366 V_p ,  V_rms = V_p/√2
 *      ripple factor r = √((V_rms/V_avg)² − 1)  →  1.211 half wave, 0.482 full
 *
 * If the numerical integration of the MNA-solved output ever stops matching those,
 * something in the chain is wrong. That is the point of doing it the long way.
 *
 * ── THE SMOOTHING CAPACITOR IS COMPUTED, NOT SWEPT ──────────────────────────
 * The quasi-static sweep is valid only because these circuits have no reactance
 * (`solveDiode.ts` header). A smoothing capacitor breaks that: the frozen DC
 * solver treats a capacitor as an open circuit and would silently return the
 * UNSMOOTHED waveform, which is the worst kind of wrong — plausible. So ripple
 * with a capacitor is derived analytically here, labelled as an approximation,
 * and never mixed into the swept arrays.
 */

import type { Circuit } from '../../types';
import { solveDiodeCircuit, withSourceEmf } from './solveDiode';
import type { DiodeSpec, DiodeState } from './diode';

export interface RectifierSpec {
  circuit: Circuit;
  diodes: DiodeSpec[];
  /**
   * Component ids of the a.c. source(s) swept together.
   *
   * ⚠ PLURAL, AND IT MATTERS. A centre-tapped transformer is modelled as TWO
   * source halves about the centre tap; both are halves of ONE winding, so both
   * must carry the same instantaneous EMF. Driving only one makes the circuit
   * behave as half-wave while still looking like a full-wave schematic — a defect
   * that shipped in the first draft of this file and was caught only by asserting
   * the average against 2V_p/π.
   */
  sourceIds: string[];
  /** Peak input voltage, V. */
  peak: number;
  /** Supply frequency, Hz — 50 in India. Only used for ripple timing. */
  frequency: number;
  /** The two nodes the output is measured across. */
  outputNodes: [string, string];
  /** Load resistance, Ω — needed for the ripple estimate. */
  loadOhms: number;
  /**
   * Which circuit this is. Carried for LABELLING only — nothing in the sweep
   * branches on it. How many diodes conduct in series, whether the negative half
   * appears, and the ripple frequency are all MEASURED from the solve, so a
   * mislabelled topology cannot make a wrong waveform look right.
   */
  topology?: 'half-wave' | 'centre-tap' | 'bridge';
  /** Phase samples per cycle. Forced even — see `sweepRectifier`. */
  samples?: number;
}

export interface RectifierPoint {
  /** Phase in radians, 0 … 2π. */
  phase: number;
  /** Instantaneous input EMF, V. */
  vIn: number;
  /** Output p.d. across the load, V — from the solve. */
  vOut: number;
  /** Load current, A. */
  iOut: number;
  /**
   * Which diodes are carrying a current that MATTERS at this instant — more than
   * `TRICKLE_FRACTION` of the peak load current.
   *
   * ⚠ WHY THERE IS A THRESHOLD AT ALL. The bridge carries a 10 MΩ reference
   * resistor (see `archetypes.semiconductor.ts`), and in the dead band where the
   * input is above one diode drop but below two, a SINGLE diode genuinely conducts
   * about 30 nA round that resistor. That is real physics, not an artefact — but
   * reporting it as "D1 is conducting" alongside a 10 mA half cycle would teach
   * that three diodes take part, and would contradict the whole diagonal-pair
   * lesson. So the tiny one is separated out as `trickle`, and both are reported.
   */
  conducting: string[];
  /** Forward-biased but carrying less than 0.5% of the peak load current. */
  trickle: string[];
}

/** Below this fraction of the peak load current, a forward diode is `trickle`
 *  rather than `conducting`. 0.5% — three orders of magnitude above the numerical
 *  noise floor and three below anything a student reads. */
export const TRICKLE_FRACTION = 0.005;

export interface RectifierResult {
  points: RectifierPoint[];
  peak: number;
  /** Peak of the OUTPUT — lower than the input peak by the conducting diodes'
   *  drops, which is the detail students lose marks on. */
  outputPeak: number;
  /** Mean of |v_out| over a full cycle, V — integrated from the solved waveform. */
  vAvg: number;
  /** Root-mean-square of v_out over a full cycle, V. */
  vRms: number;
  /** Ripple factor √((V_rms/V_avg)² − 1). Dimensionless. */
  rippleFactor: number;
  /** Fraction of the cycle during which any current flows. 0.5 for half wave,
   *  1.0 for full wave (minus the dead band the diode drop creates). */
  conductionFraction: number;
  /** How many diodes were in series on the conducting half, measured. */
  seriesDrops: number;
  /** Output ripple frequency, Hz — 50 for half wave, 100 for full wave on a 50 Hz
   *  supply. The single easiest way to tell the two apart on a scope. */
  rippleFrequency: number;
  /** True if any phase failed to find a consistent diode state. */
  anyUnsolved: boolean;
}

/**
 * Sweep one full cycle.
 *
 * `n` must be even so the phases land symmetrically about π and the trapezoid
 * rule below sees the same number of samples in each half — an odd count biases
 * V_avg for a half-wave rectifier in the third decimal, which is exactly where
 * the verifier is looking.
 */
export function sweepRectifier(spec: RectifierSpec, n = 240): RectifierResult {
  const samples = spec.samples ?? n;
  const count = samples % 2 === 0 ? samples : samples + 1;
  const points: RectifierPoint[] = [];
  let anyUnsolved = false;

  // Pass 1: solve every phase and keep the raw diode currents. The conducting /
  // trickle split needs the PEAK load current, which is not known until the sweep
  // is finished — so classification is a second pass rather than a guess.
  const raw: { phase: number; vIn: number; vOut: number; currents: Record<string, number>;
    forward: string[] }[] = [];

  for (let k = 0; k <= count; k++) {
    const phase = (2 * Math.PI * k) / count;
    const vIn = spec.peak * Math.sin(phase);
    const trial = withSourceEmf(spec.circuit, spec.sourceIds, vIn);
    const sol = solveDiodeCircuit(trial, spec.diodes);
    if (sol.unsolved) anyUnsolved = true;

    const vOut = (sol.solution.potentials[spec.outputNodes[0]] ?? 0)
      - (sol.solution.potentials[spec.outputNodes[1]] ?? 0);

    raw.push({
      phase,
      vIn,
      vOut,
      currents: { ...sol.currents },
      forward: spec.diodes
        .filter((d) => (sol.states[d.id] as DiodeState) === 'forward')
        .map((d) => d.id),
    });
  }

  const peakLoad = raw.reduce(
    (m, p) => Math.max(m, spec.loadOhms > 0 ? Math.abs(p.vOut / spec.loadOhms) : 0), 0,
  );
  const floor = Math.max(1e-12, peakLoad * TRICKLE_FRACTION);

  for (const p of raw) {
    const carrying = p.forward.filter((id) => Math.abs(p.currents[id] ?? 0) > floor);
    points.push({
      phase: p.phase,
      vIn: p.vIn,
      vOut: p.vOut,
      iOut: spec.loadOhms > 0 ? p.vOut / spec.loadOhms : 0,
      conducting: carrying,
      trickle: p.forward.filter((id) => !carrying.includes(id)),
    });
  }

  // Trapezoid rule over the closed cycle. The endpoints coincide (phase 0 and
  // 2π), so they are each given half weight — the standard treatment, and it is
  // what makes V_avg come out at V_p/π to five digits rather than four.
  const integrate = (f: (p: RectifierPoint) => number): number => {
    let sum = 0;
    for (let i = 0; i < points.length - 1; i++) sum += (f(points[i]) + f(points[i + 1])) / 2;
    return sum / (points.length - 1);
  };

  const vAvg = integrate((p) => Math.abs(p.vOut));
  const vRms = Math.sqrt(integrate((p) => p.vOut * p.vOut));
  const conducting = points.filter((p) => p.conducting.length > 0);
  const seriesDrops = conducting.length
    ? Math.max(...conducting.map((p) => p.conducting.length))
    : 0;

  return {
    points,
    peak: spec.peak,
    outputPeak: points.reduce((m, p) => Math.max(m, Math.abs(p.vOut)), 0),
    vAvg,
    vRms,
    rippleFactor: vAvg > 1e-12 ? Math.sqrt(Math.max(0, (vRms / vAvg) ** 2 - 1)) : Number.NaN,
    conductionFraction: conducting.length / points.length,
    seriesDrops,
    // Full-wave output repeats twice per input cycle. Measured from the solve:
    // if current flows in more than 60% of the cycle it is a full-wave circuit.
    rippleFrequency: conducting.length / points.length > 0.6
      ? spec.frequency * 2
      : spec.frequency,
    anyUnsolved,
  };
}

// ── The ideal closed forms, for comparison ───────────────────────────────────

export interface IdealRectifier {
  vAvg: number;
  vRms: number;
  rippleFactor: number;
  /** Peak inverse voltage the diode has to survive. A bridge diode sees V_p; a
   *  centre-tap diode sees 2V_p, which is the reason bridges won. */
  pivMultiplier: number;
}

/** V_p/π, V_p/2, r = 1.211. */
export const idealHalfWave = (peak: number): IdealRectifier => ({
  vAvg: peak / Math.PI,
  vRms: peak / 2,
  rippleFactor: Math.sqrt((Math.PI / 2) ** 2 - 1),
  pivMultiplier: 1,
});

/** 2V_p/π, V_p/√2, r = 0.482. */
export const idealFullWave = (peak: number): IdealRectifier => ({
  vAvg: (2 * peak) / Math.PI,
  vRms: peak / Math.SQRT2,
  rippleFactor: Math.sqrt((Math.PI / (2 * Math.SQRT2)) ** 2 - 1),
  pivMultiplier: 1,
});

/** Rectification efficiency — the fraction of the input power that arrives as
 *  d.c. For an ideal rectifier into a resistive load with no series resistance:
 *  40.6% half wave, 81.2% full wave. Derived from (V_avg/V_rms)², not quoted. */
export const rectificationEfficiency = (r: IdealRectifier): number =>
  (r.vAvg / r.vRms) ** 2;

// ── Smoothing, computed and clearly labelled ─────────────────────────────────

export interface SmoothingEstimate {
  /** Peak-to-peak ripple, V. */
  ripplePkPk: number;
  /** Approximate d.c. output, V. */
  vDc: number;
  /** Ripple factor after smoothing. */
  rippleFactor: number;
  /** Time constant RC, seconds, and the discharge time between peaks. */
  rc: number;
  dischargeTime: number;
  note: string;
}

/**
 * Ripple with a smoothing capacitor.
 *
 * ⚠ ANALYTIC, NOT SWEPT, AND IT SAYS SO. The standard estimate: the capacitor
 * charges to the output peak, then discharges nearly linearly into the load until
 * the next peak arrives, so
 *
 *      ΔV ≈ I_dc · t_discharge / C = V_dc / (f_ripple · R · C)
 *
 * valid while RC ≫ t_discharge, which is the whole design intent of a smoothing
 * capacitor. It is a first-order estimate and the returned `note` says as much;
 * the swept waveform arrays never contain it, because the DC solver cannot
 * represent a capacitor and mixing the two would be a lie about which parts were
 * simulated.
 */
export function smoothing(
  outputPeak: number, loadOhms: number, farads: number, rippleFrequency: number,
): SmoothingEstimate {
  const t = 1 / Math.max(rippleFrequency, 1e-9);
  const rc = loadOhms * farads;
  // Solve V_dc = V_p − V_dc·t/(2RC) for the mean, i.e. take the midpoint of the
  // ripple rather than the peak — the peak is what a beginner reads and it
  // overstates the d.c. by half the ripple.
  const vDc = outputPeak / (1 + t / (2 * rc));
  const ripple = (vDc * t) / rc;
  return {
    ripplePkPk: ripple,
    vDc,
    // For a roughly triangular ripple the r.m.s. of the a.c. part is ΔV/(2√3).
    rippleFactor: vDc > 0 ? ripple / (2 * Math.sqrt(3) * vDc) : Number.NaN,
    rc,
    dischargeTime: t,
    note:
      `First-order estimate, valid while RC (${(rc * 1000).toFixed(1)} ms) is much larger than the `
      + `${(t * 1000).toFixed(1)} ms between peaks. It is calculated, not simulated — the d.c. solver `
      + 'treats a capacitor as an open circuit, so the swept waveform above has no capacitor in it.',
  };
}
