/*
 * field-bench/lib/photoelectric.ts — the two knobs that do different things.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * The whole bench exists to separate two things a student fuses together:
 *
 *   INTENSITY  → how MANY photons arrive → how much CURRENT flows.
 *   FREQUENCY  → how much ENERGY each photon carries → how fast the fastest
 *                electron leaves → the STOPPING POTENTIAL.
 *
 * Below the threshold frequency, turning the lamp up to a thousand suns emits
 * nothing at all. That is the single most counter-intuitive result in the
 * chapter and the verifier asserts it at five intensities across four decades.
 *
 * ── WHAT IS EXACT AND WHAT IS MODELLED ──────────────────────────────────────
 * Exact (Einstein's equation, no free parameters):
 *   • threshold  f₀ = φ/h
 *   • KE_max     = hf − φ, and zero below threshold
 *   • stopping potential V₀ = (hf − φ)/e — LINEAR in f with slope h/e
 *   • saturation current I_sat = e·η·P/(hf): every absorbed photon that works
 *     frees one electron, so the current follows the photon RATE, not the power
 *
 * Modelled (stated in the UI, not hidden):
 *   • the SHAPE of the retarding-side I–V curve. Real photoelectrons leave with
 *     a spread of energies from 0 to KE_max, and the exact spread depends on
 *     the metal's band structure. A uniform spread is assumed here, giving a
 *     straight retarding branch. What is NOT modelled is the number that
 *     matters: where the curve reaches zero is exactly −V₀ either way, which is
 *     the only value the student is ever asked to read off.
 */

import { PLANCK, ELEMENTARY_CHARGE, EV_IN_JOULES } from './constants';

/** V₀ = (h/e)·f − φ/e. The slope of the stopping-potential line is h/e for
 *  EVERY metal — the graph from which Millikan measured h. */
export const STOPPING_SLOPE = PLANCK / ELEMENTARY_CHARGE;

export interface PhotoelectricSetup {
  /** Work function of the emitter, electronvolts. */
  workFunctionEV: number;
  /** Frequency of the incident light, Hz. */
  frequencyHz: number;
  /** Irradiance, W/m². */
  intensityWm2: number;
  /** Illuminated area of the cathode, m². Default 1e-4 (a 1 cm² window). */
  areaM2?: number;
  /** Quantum efficiency — the fraction of absorbed photons that free an
   *  electron that actually reaches the anode. Default 0.05, a realistic
   *  order of magnitude for an alkali photocathode. */
  efficiency?: number;
}

export interface PhotoelectricResult {
  /** f₀ = φ/h, Hz. */
  thresholdHz: number;
  photonEnergyJ: number;
  photonEnergyEV: number;
  /** hf − φ, clamped at zero. Joules and electronvolts. */
  kMaxJ: number;
  kMaxEV: number;
  /** Volts. Zero below threshold — there is nothing to stop. */
  stoppingVoltage: number;
  /** Amperes at full accelerating voltage. */
  saturationCurrentA: number;
  /** Photons striking the cathode per second. */
  photonRate: number;
  emits: boolean;
}

export function photoelectric(setup: PhotoelectricSetup): PhotoelectricResult {
  const area = setup.areaM2 ?? 1e-4;
  const eff = setup.efficiency ?? 0.05;
  const phiJ = setup.workFunctionEV * EV_IN_JOULES;
  const f = Math.max(setup.frequencyHz, 0);

  const thresholdHz = phiJ / PLANCK;
  const photonEnergyJ = PLANCK * f;
  const kMaxJ = Math.max(0, photonEnergyJ - phiJ);
  const emits = photonEnergyJ > phiJ;

  const photonRate = photonEnergyJ > 0 ? (setup.intensityWm2 * area) / photonEnergyJ : 0;
  const saturationCurrentA = emits ? ELEMENTARY_CHARGE * eff * photonRate : 0;

  return {
    thresholdHz,
    photonEnergyJ,
    photonEnergyEV: photonEnergyJ / EV_IN_JOULES,
    kMaxJ,
    kMaxEV: kMaxJ / EV_IN_JOULES,
    stoppingVoltage: kMaxJ / ELEMENTARY_CHARGE,
    saturationCurrentA,
    photonRate,
    emits,
  };
}

/** V₀ for a frequency and work function, volts. Exact, option-free. */
export const stoppingPotential = (frequencyHz: number, workFunctionEV: number): number =>
  Math.max(0, (PLANCK * frequencyHz - workFunctionEV * EV_IN_JOULES) / ELEMENTARY_CHARGE);

export interface IVPoint { v: number; i: number }

/**
 * The I–V curve between `vMin` (retarding) and `vMax` (accelerating).
 *
 *   V ≥ 0         → I = I_sat (every emitted electron is collected)
 *   −V₀ < V < 0   → I = I_sat·(1 − |V|/V₀) under the uniform-spread assumption
 *   V ≤ −V₀       → I = 0, exactly, for every intensity
 *
 * Note where the curves for two intensities differ and where they do not: the
 * heights differ, the zero crossing does not. That is the graph the whole
 * lesson is built on, so it must come out of the model rather than be drawn on.
 */
export function ivCurve(setup: PhotoelectricSetup, vMin: number, vMax: number, n = 120): IVPoint[] {
  const r = photoelectric(setup);
  const out: IVPoint[] = [];
  for (let k = 0; k <= n; k++) {
    const v = vMin + ((vMax - vMin) * k) / n;
    out.push({ v, i: currentAt(r, v) });
  }
  return out;
}

/** Current at one bias voltage, amperes. */
export function currentAt(r: PhotoelectricResult, v: number): number {
  if (!r.emits) return 0;
  if (v >= 0) return r.saturationCurrentA;
  const v0 = r.stoppingVoltage;
  if (v0 <= 0 || -v >= v0) return 0;
  return r.saturationCurrentA * (1 - -v / v0);
}

/** Work functions used by the archetypes, eV. Standard textbook values. */
export const WORK_FUNCTIONS: { name: string; ev: number }[] = [
  { name: 'Caesium', ev: 2.14 },
  { name: 'Potassium', ev: 2.30 },
  { name: 'Sodium', ev: 2.75 },
  { name: 'Calcium', ev: 3.20 },
  { name: 'Zinc', ev: 4.31 },
  { name: 'Copper', ev: 4.65 },
];
