/*
 * nuclear/lib/binding.ts — mass defect, E = Δmc², and THE CURVE.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ───────────────────────────────────────
 * A nucleus weighs LESS than the parts it is made of. The missing mass is the
 * binding energy, and E = Δmc² converts one to the other. Every number on the
 * Nuclear Bench comes out of that single sentence:
 *
 *      Δm = Z·m(¹H) + N·m(n) − M(atom)          (atomic masses; electrons cancel)
 *      BE = Δm·c²
 *      BE/A = binding energy per nucleon        ← the y-axis of the curve
 *
 * ⚠ WHY ATOMIC MASSES AND NOT NUCLEAR ONES. Using m(¹H) — the neutral HYDROGEN
 * ATOM, not the bare proton — puts exactly Z electrons on each side, so they
 * cancel and the electron mass never has to be tracked. Using the proton mass
 * against an ATOMIC nuclide mass instead is the classic factor-of-Z·0.511 MeV
 * error, and in uranium it is 47 MeV — a 2.6% error in a number the student is
 * about to compare against a fission Q value of 173 MeV. So this file works in
 * mass excesses, where the same cancellation happens automatically:
 *
 *      BE = Z·Δ(¹H) + N·Δ(n) − Δ(nuclide)
 *
 * with mass numbers cancelling exactly (Z·1 + N·1 = A), so the result is a
 * difference of numbers of order tens of MeV and loses nothing to rounding.
 *
 * ── THE PEAK, HONESTLY ──────────────────────────────────────────────────────
 * Iron-56 at 8.790 MeV/nucleon is the peak every textbook marks. The true
 * maximum of the whole nuclide chart is NICKEL-62 at 8.795 — higher by 0.05%.
 * Both are in the table and both are reported, because the fission/fusion
 * argument does not depend on which of them wins and pretending iron is the
 * absolute maximum would be a small lie told for tidiness.
 */

import { MEV_PER_U, mevToJoules } from './constants';
import {
  type Nuclide, CURVE_NUCLIDES, neutronsOf, nuclide,
} from './nuclides';

/** Mass excess of the neutral hydrogen atom and of the free neutron — the two
 *  building blocks every binding energy is measured against. */
const H1 = nuclide('H-1');
const NEUTRON = nuclide('n');

export interface BindingResult {
  nuclide: Nuclide;
  Z: number;
  N: number;
  A: number;
  /** Mass of Z hydrogen atoms + N neutrons, u. */
  partsU: number;
  /** Actual atomic mass, u. */
  actualU: number;
  /** partsU − actualU, u. Positive for every bound nucleus. */
  massDefectU: number;
  /** Δm·c², MeV. */
  bindingMev: number;
  /** The same energy in joules — so the student sees that 28 MeV is 4.5×10⁻¹² J
   *  and stops treating MeV as a different KIND of quantity. */
  bindingJoules: number;
  /** BE/A, MeV per nucleon. THE y-axis. */
  perNucleon: number;
}

/**
 * Mass defect and binding energy of one nuclide.
 *
 * Hydrogen-1 has nothing to bind, so its binding energy is exactly zero and its
 * BE/A is reported as 0 rather than as 0/1 — the free neutron likewise. Both are
 * genuinely zero here, not a divide-by-zero being papered over.
 */
export function binding(n: Nuclide | string): BindingResult {
  const nuc = typeof n === 'string' ? nuclide(n) : n;
  const Z = nuc.Z;
  const N = neutronsOf(nuc);

  // In mass-excess arithmetic the mass numbers cancel exactly, so this IS the
  // binding energy with no rounding: BE = Z·Δ(H) + N·Δ(n) − Δ(nuclide).
  const bindingMev = Z * H1.excess + N * NEUTRON.excess - nuc.excess;

  const partsU = Z * (1 + H1.excess / MEV_PER_U) + N * (1 + NEUTRON.excess / MEV_PER_U);
  const actualU = nuc.A + nuc.excess / MEV_PER_U;

  return {
    nuclide: nuc,
    Z,
    N,
    A: nuc.A,
    partsU,
    actualU,
    massDefectU: bindingMev / MEV_PER_U,
    bindingMev,
    bindingJoules: mevToJoules(bindingMev),
    perNucleon: nuc.A > 0 ? bindingMev / nuc.A : 0,
  };
}

/** BE/A in MeV per nucleon — the single number the curve plots. */
export const perNucleon = (n: Nuclide | string): number => binding(n).perNucleon;

// ── The curve ────────────────────────────────────────────────────────────────

export interface CurvePoint {
  id: string;
  label: string;
  /** Mass number — the x-axis. */
  A: number;
  /** BE/A in MeV — the y-axis. */
  perNucleon: number;
  Z: number;
  bindingMev: number;
  note?: string;
}

/**
 * The binding-energy-per-nucleon curve, in mass order.
 *
 * One representative per mass number (the most-bound nuclide there), which is
 * what a textbook plots. It rises very steeply below A ≈ 20, flattens into a
 * broad plateau around A ≈ 50–65, and sags slowly all the way to uranium. Those
 * three facts are the whole lesson and each one is asserted in the verifier.
 */
export function bindingCurve(): CurvePoint[] {
  return CURVE_NUCLIDES.map((n) => {
    const b = binding(n);
    return {
      id: n.id,
      label: n.id,
      A: n.A,
      perNucleon: b.perNucleon,
      Z: n.Z,
      bindingMev: b.bindingMev,
      ...(n.note ? { note: n.note } : {}),
    };
  });
}

/** The most-bound nuclide on the curve — NICKEL-62, the honest answer. */
export function curvePeak(curve = bindingCurve()): CurvePoint {
  return curve.reduce((best, p) => (p.perNucleon > best.perNucleon ? p : best), curve[0]);
}

/**
 * The peak a textbook marks. Iron-56, and it is not the same nuclide as
 * `curvePeak()` — see the file header. Kept as a named constant so the UI can
 * mark it AND tell the truth about nickel-62 in the same breath.
 */
export const TEXTBOOK_PEAK_ID = 'Fe-56';

/** Where on the curve a nuclide sits relative to the peak: `below` means it
 *  gains by fusing, `above` means it gains by splitting. That single word is
 *  the answer to "why do both fission and fusion release energy?". */
export type CurveSide = 'below-peak' | 'at-peak' | 'above-peak';

export function sideOfPeak(n: Nuclide | string, curve = bindingCurve()): CurveSide {
  const nuc = typeof n === 'string' ? nuclide(n) : n;
  const peak = curvePeak(curve);
  if (nuc.A === peak.A) return 'at-peak';
  return nuc.A < peak.A ? 'below-peak' : 'above-peak';
}

/**
 * The curve read at an arbitrary mass number, by straight-line interpolation
 * between the two neighbouring tabulated points.
 *
 * ⚠ THIS IS AN INTERPOLATION AND IT SAYS SO. It exists only so a hover readout
 * can follow the drawn line continuously; no Q value, no reaction energy and no
 * displayed physical result is ever computed from it. Every energy on this
 * bench comes from real tabulated masses (`reactions.ts`). Interpolating a
 * curve and then quoting the result as data is exactly the trap the brief warns
 * about, so the return type carries the warning with it.
 */
export interface InterpolatedReading {
  A: number;
  perNucleon: number;
  /** Always true. Present so a caller cannot forget what it is holding. */
  interpolated: true;
  between: [string, string];
}

export function readCurveAt(A: number, curve = bindingCurve()): InterpolatedReading | null {
  if (curve.length < 2) return null;
  if (A <= curve[0].A) {
    return { A, perNucleon: curve[0].perNucleon, interpolated: true, between: [curve[0].id, curve[0].id] };
  }
  const last = curve[curve.length - 1];
  if (A >= last.A) {
    return { A, perNucleon: last.perNucleon, interpolated: true, between: [last.id, last.id] };
  }
  for (let i = 0; i < curve.length - 1; i++) {
    const lo = curve[i];
    const hi = curve[i + 1];
    if (A >= lo.A && A <= hi.A) {
      const t = (A - lo.A) / (hi.A - lo.A);
      return {
        A,
        perNucleon: lo.perNucleon + t * (hi.perNucleon - lo.perNucleon),
        interpolated: true,
        between: [lo.id, hi.id],
      };
    }
  }
  return null;
}
