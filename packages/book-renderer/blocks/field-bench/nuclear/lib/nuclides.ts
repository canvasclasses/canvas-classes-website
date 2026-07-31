/*
 * nuclear/lib/nuclides.ts — the mass table. THE academic accuracy gate.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── WHY MASS EXCESS AND NOT ATOMIC MASS ─────────────────────────────────────
 * Every nuclide below is stored as its **mass excess** Δ = (M − A)·c² in MeV,
 * which is what AME2020 and every nuclear data table actually tabulate, rather
 * than as an atomic mass in u. Three reasons, all of them load-bearing:
 *
 *  1. CATASTROPHIC CANCELLATION. A fission Q value is a difference of ~236 u
 *     numbers that comes out at 0.186 u. Held as atomic masses in double
 *     precision that difference throws away 6 of the 16 significant digits
 *     before any physics happens. Held as mass excesses the subtraction is
 *     between numbers of order 10–80 MeV and the answer keeps every digit.
 *  2. MASS NUMBERS CANCEL EXACTLY. In any reaction that conserves A — which is
 *     every reaction in this file — ΣA is identical on both sides, so
 *     Q = ΣΔ(in) − ΣΔ(out) is EXACT with no rounding at all.
 *  3. IT IS THE TABULATED QUANTITY. Copying the number a table prints, rather
 *     than a number derived from it, removes one transcription step where a
 *     digit can go wrong.
 *
 * Atomic mass in u is still available via `atomicMassU()` — derived, not stored.
 *
 * ── SOURCE ──────────────────────────────────────────────────────────────────
 * Mass excesses: **AME2020** (Wang, Huang, Kondev, Audi, Naimi, *The AME2020
 * atomic mass evaluation*, Chinese Physics C 45 030003), quoted to 4 decimal
 * places — well past anything a student reads, and past the precision of every
 * Q value this bench displays.
 *
 * Half-lives: **NUBASE2020** (Kondev et al., Chinese Physics C 45 030001).
 * Where a widely-taught value differs from the current evaluation the comment
 * says so rather than silently picking one (¹⁴C is the notable case: 5700 y
 * today, 5730 y in older textbooks).
 *
 * ⚠ ANTI-HALLUCINATION. Every Δ below is cross-checked in
 * `scripts/verify-modern-physics.mjs` against an INDEPENDENTLY known quantity —
 * a literature Q value or a literature BE/A — so a mistyped digit cannot pass.
 * The checks are listed at the top of that script. Do not add a nuclide here
 * without adding a cross-check there; an unchecked mass is a wrong number
 * waiting to be believed.
 */

import { MEV_PER_U, ELECTRON_MASS_MEV, SECONDS_PER_YEAR, SECONDS_PER_DAY } from './constants';

export type DecayMode = 'alpha' | 'beta-minus' | 'beta-plus' | 'gamma' | 'stable';

export interface Nuclide {
  /** `U-235`, `He-4` — the id used by archetypes and by book blocks. */
  id: string;
  /** Element symbol. */
  symbol: string;
  /** Proton number. */
  Z: number;
  /** Nucleon number. */
  A: number;
  /** Mass excess Δ = (M − A)c², MeV. AME2020. */
  excess: number;
  /** Half-life in SECONDS. Absent for a nuclide treated as stable here. */
  halfLife?: number;
  /** How it decays, when it does. */
  decay?: DecayMode;
  /** True for the nuclides drawn on the BE/A curve — see `bindingCurve()`. */
  onCurve?: boolean;
  /** A one-line reason the nuclide is in the table, for the readout. */
  note?: string;
}

const y = (v: number) => v * SECONDS_PER_YEAR;
const d = (v: number) => v * SECONDS_PER_DAY;
const h = (v: number) => v * 3600;
const min = (v: number) => v * 60;

/** Neutron number. */
export const neutronsOf = (n: Nuclide): number => n.A - n.Z;

/**
 * The table.
 *
 * `onCurve` marks the most-bound representative at that mass number — the chain
 * a textbook draws when it plots "binding energy per nucleon against mass
 * number". Everything else is here because a reaction or a decay needs it.
 */
export const NUCLIDES: Nuclide[] = [
  // ── the free nucleons ──────────────────────────────────────────────────────
  { id: 'n', symbol: 'n', Z: 0, A: 1, excess: 8.07131806, halfLife: min(10.19), decay: 'beta-minus',
    note: 'A free neutron is not stable — it beta-decays with a 10.2 minute half-life.' },
  { id: 'H-1', symbol: 'H', Z: 1, A: 1, excess: 7.28897061,
    note: 'One proton. Nothing to bind, so binding energy is exactly zero.' },

  // ── the light end: the curve is climbing steeply ──────────────────────────
  { id: 'H-2', symbol: 'H', Z: 1, A: 2, excess: 13.13572176, onCurve: true,
    note: 'Deuterium. The most loosely bound nucleus there is — 2.22 MeV per nucleon of two.' },
  { id: 'H-3', symbol: 'H', Z: 1, A: 3, excess: 14.94980600, halfLife: y(12.32), decay: 'beta-minus',
    note: 'Tritium. Half of the D–T fusion fuel, and radioactive, which is why it has to be bred.' },
  { id: 'He-3', symbol: 'He', Z: 2, A: 3, excess: 14.93121547, onCurve: true,
    note: 'Two protons and one neutron — and less bound than tritium, its mirror.' },
  { id: 'He-4', symbol: 'He', Z: 2, A: 4, excess: 2.42491561, onCurve: true,
    note: 'The alpha particle. Doubly magic: 7.07 MeV per nucleon, far above its neighbours.' },
  { id: 'Li-6', symbol: 'Li', Z: 3, A: 6, excess: 14.0868, onCurve: true },
  { id: 'Li-7', symbol: 'Li', Z: 3, A: 7, excess: 14.9070, onCurve: true },
  { id: 'Be-9', symbol: 'Be', Z: 4, A: 9, excess: 11.3484, onCurve: true },
  { id: 'B-11', symbol: 'B', Z: 5, A: 11, excess: 8.6680, onCurve: true },
  { id: 'C-12', symbol: 'C', Z: 6, A: 12, excess: 0.0000, onCurve: true,
    note: 'Zero by definition — the atomic mass unit IS one twelfth of a carbon-12 atom.' },
  { id: 'C-13', symbol: 'C', Z: 6, A: 13, excess: 3.1250, onCurve: true },
  { id: 'C-14', symbol: 'C', Z: 6, A: 14, excess: 3.0198, halfLife: y(5700), decay: 'beta-minus',
    note: 'Radiocarbon. NUBASE2020 gives 5700 ± 30 y; older textbooks say 5730 y.' },
  { id: 'N-14', symbol: 'N', Z: 7, A: 14, excess: 2.8634, onCurve: true },
  { id: 'N-15', symbol: 'N', Z: 7, A: 15, excess: 0.1014, onCurve: true },
  { id: 'O-16', symbol: 'O', Z: 8, A: 16, excess: -4.7370, onCurve: true,
    note: 'Doubly magic again, and it shows: a local spike on the curve.' },
  { id: 'Ne-20', symbol: 'Ne', Z: 10, A: 20, excess: -7.0419, onCurve: true },
  { id: 'Ne-22', symbol: 'Ne', Z: 10, A: 22, excess: -8.0246 },
  { id: 'Na-22', symbol: 'Na', Z: 11, A: 22, excess: -5.1815, halfLife: y(2.6018), decay: 'beta-plus',
    note: 'A positron emitter — the textbook beta-plus case, and a PET-scanner tracer.' },
  { id: 'Na-23', symbol: 'Na', Z: 11, A: 23, excess: -9.5299, onCurve: true },
  { id: 'Mg-24', symbol: 'Mg', Z: 12, A: 24, excess: -13.9336, onCurve: true },
  { id: 'Al-27', symbol: 'Al', Z: 13, A: 27, excess: -17.1968, onCurve: true },
  { id: 'Si-28', symbol: 'Si', Z: 14, A: 28, excess: -21.4927, onCurve: true },
  { id: 'P-31', symbol: 'P', Z: 15, A: 31, excess: -24.4409, onCurve: true },
  { id: 'S-32', symbol: 'S', Z: 16, A: 32, excess: -26.0157, onCurve: true },
  { id: 'Ca-40', symbol: 'Ca', Z: 20, A: 40, excess: -34.8464, onCurve: true },

  // ── the peak region ───────────────────────────────────────────────────────
  { id: 'Fe-56', symbol: 'Fe', Z: 26, A: 56, excess: -60.6054, onCurve: true,
    note: 'The peak every textbook marks: 8.790 MeV per nucleon. Nothing is more bound by much.' },
  { id: 'Fe-58', symbol: 'Fe', Z: 26, A: 58, excess: -62.1534, onCurve: true },
  { id: 'Ni-62', symbol: 'Ni', Z: 28, A: 62, excess: -66.7458, onCurve: true,
    note: 'The true maximum — 8.795 MeV per nucleon, 0.05% above iron-56.' },
  { id: 'Ni-60', symbol: 'Ni', Z: 28, A: 60, excess: -64.4720 },
  { id: 'Co-60', symbol: 'Co', Z: 27, A: 60, excess: -61.6448, halfLife: y(5.2711), decay: 'beta-minus',
    note: 'The radiotherapy source. Beta-decays to nickel-60, which then emits the 1.33 MeV gamma.' },
  { id: 'Cu-63', symbol: 'Cu', Z: 29, A: 63, excess: -65.5795, onCurve: true },
  { id: 'Zr-90', symbol: 'Zr', Z: 40, A: 90, excess: -88.7674, onCurve: true },

  // ── fission fragments and fallout ─────────────────────────────────────────
  { id: 'Kr-92', symbol: 'Kr', Z: 36, A: 92, excess: -68.7690,
    note: 'A fission fragment. 8.515 MeV per nucleon — UP the curve from uranium.' },
  { id: 'Sr-90', symbol: 'Sr', Z: 38, A: 90, excess: -85.9420, halfLife: y(28.91), decay: 'beta-minus',
    note: 'Fallout that behaves like calcium, so it goes into bone. 28.9 year half-life.' },
  { id: 'Y-90', symbol: 'Y', Z: 39, A: 90, excess: -86.4880, halfLife: h(64.05), decay: 'beta-minus' },
  { id: 'Ba-141', symbol: 'Ba', Z: 56, A: 141, excess: -79.7317,
    note: 'The other fragment in the standard uranium-235 fission channel.' },
  { id: 'Ag-107', symbol: 'Ag', Z: 47, A: 107, excess: -88.4020, onCurve: true },
  { id: 'Sn-120', symbol: 'Sn', Z: 50, A: 120, excess: -91.1054, onCurve: true },
  { id: 'I-131', symbol: 'I', Z: 53, A: 131, excess: -87.4441, halfLife: d(8.0252), decay: 'beta-minus',
    note: 'Concentrates in the thyroid — which is what makes it both a hazard and a treatment.' },
  { id: 'Xe-131', symbol: 'Xe', Z: 54, A: 131, excess: -88.4136 },
  { id: 'Cs-133', symbol: 'Cs', Z: 55, A: 133, excess: -88.0708, onCurve: true },
  { id: 'Cs-137', symbol: 'Cs', Z: 55, A: 137, excess: -86.5458, halfLife: y(30.08), decay: 'beta-minus',
    note: 'The 30 year fission product. Chernobyl and Fukushima contamination is mostly this.' },
  { id: 'Ba-137', symbol: 'Ba', Z: 56, A: 137, excess: -87.7214 },
  { id: 'La-139', symbol: 'La', Z: 57, A: 139, excess: -87.2314, onCurve: true },
  { id: 'Nd-144', symbol: 'Nd', Z: 60, A: 144, excess: -83.7527, onCurve: true },
  { id: 'Sm-150', symbol: 'Sm', Z: 62, A: 150, excess: -77.0573, onCurve: true },

  // ── the heavy end: the curve is sagging back down ─────────────────────────
  { id: 'Au-197', symbol: 'Au', Z: 79, A: 197, excess: -31.1400, onCurve: true },
  { id: 'Pb-208', symbol: 'Pb', Z: 82, A: 208, excess: -21.7485, onCurve: true,
    note: 'The heaviest stable nucleus, and doubly magic. Every decay chain ends near here.' },
  { id: 'Bi-209', symbol: 'Bi', Z: 83, A: 209, excess: -18.2585, onCurve: true },
  { id: 'Po-218', symbol: 'Po', Z: 84, A: 218, excess: 8.3585, halfLife: min(3.071), decay: 'alpha' },
  { id: 'Rn-222', symbol: 'Rn', Z: 86, A: 222, excess: 16.3744, halfLife: d(3.8215), decay: 'alpha',
    note: 'Radon. A gas, which is why it is the largest natural radiation dose most people get.' },
  { id: 'Ra-226', symbol: 'Ra', Z: 88, A: 226, excess: 23.6689, halfLife: y(1600), decay: 'alpha',
    note: 'The Curies’ radium. 1600 year half-life, alpha to radon.' },
  { id: 'Th-231', symbol: 'Th', Z: 90, A: 231, excess: 33.8130, halfLife: h(25.52), decay: 'beta-minus' },
  { id: 'Th-232', symbol: 'Th', Z: 90, A: 232, excess: 35.4477, halfLife: y(1.405e10), decay: 'alpha',
    onCurve: true, note: 'India’s fuel of choice — three times as abundant as uranium here.' },
  { id: 'Th-234', symbol: 'Th', Z: 90, A: 234, excess: 40.6122, halfLife: d(24.10), decay: 'beta-minus' },
  { id: 'U-235', symbol: 'U', Z: 92, A: 235, excess: 40.9204, halfLife: y(7.04e8), decay: 'alpha',
    onCurve: true, note: 'The fissile one — 0.72% of natural uranium. 7.591 MeV per nucleon.' },
  { id: 'U-238', symbol: 'U', Z: 92, A: 238, excess: 47.3089, halfLife: y(4.468e9), decay: 'alpha',
    onCurve: true, note: '99.3% of natural uranium, and its half-life is the age of the Earth.' },
  { id: 'Pu-239', symbol: 'Pu', Z: 94, A: 239, excess: 48.5899, halfLife: y(2.411e4), decay: 'alpha',
    onCurve: true, note: 'Bred from uranium-238 in a reactor, and fissile like uranium-235.' },
];

const BY_ID = new Map(NUCLIDES.map((n) => [n.id, n]));

/** Lookup. Throws on an unknown id rather than returning a silent undefined —
 *  an archetype naming a nuclide that is not in the table is an authoring bug
 *  and must fail loudly at build time, not draw an empty chart. */
export function nuclide(id: string): Nuclide {
  const n = BY_ID.get(id);
  if (!n) {
    throw new Error(
      `nuclear: unknown nuclide "${id}". Add it to NUCLIDES in nuclear/lib/nuclides.ts `
      + 'WITH a cross-check in scripts/verify-modern-physics.mjs — an unchecked mass excess '
      + 'is a wrong number waiting to be believed.',
    );
  }
  return n;
}

export const hasNuclide = (id: string): boolean => BY_ID.has(id);

/**
 * Atomic mass in u. **Derived** from the tabulated mass excess:
 *
 *      M = A + Δ/(931.494… MeV/u)
 *
 * Available because a student is asked to read a mass in u, never because any
 * calculation here needs it — every Q value goes through the excesses.
 */
export const atomicMassU = (n: Nuclide): number => n.A + n.excess / MEV_PER_U;

/** Rest energy of the neutral ATOM, MeV. Electrons included, which is exactly
 *  why they cancel in an alpha or beta-minus Q value. */
export const atomicRestEnergyMev = (n: Nuclide): number => n.A * MEV_PER_U + n.excess;

/** Mass of the bare NUCLEUS, u — atom minus its Z electrons. Electron binding
 *  energy (a few eV to ~100 keV in uranium) is neglected and that omission is
 *  smaller than the last digit of any number displayed. */
export const nuclearMassU = (n: Nuclide): number =>
  atomicMassU(n) - (n.Z * ELECTRON_MASS_MEV) / MEV_PER_U;

/** `²³⁵U`-style display name, in the notation a textbook uses. */
export function pretty(n: Nuclide): string {
  if (n.id === 'n') return 'n';
  return `${supers(n.A)}${n.symbol}`;
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const supers = (v: number): string =>
  String(v).split('').map((c) => SUP[Number(c)] ?? c).join('');

/** Half-life in the largest unit that keeps the number readable. Never
 *  `4.468e+9` — the design gate bans exponent notation outright. */
export function prettyHalfLife(seconds?: number): string {
  if (seconds == null) return 'stable';
  const yr = seconds / SECONDS_PER_YEAR;
  if (yr >= 1e9) return `${trim(yr / 1e9)} billion years`;
  if (yr >= 1e6) return `${trim(yr / 1e6)} million years`;
  if (yr >= 1e3) return `${trim(yr / 1e3)} thousand years`;
  if (yr >= 1) return `${trim(yr)} years`;
  const dd = seconds / SECONDS_PER_DAY;
  if (dd >= 1) return `${trim(dd)} days`;
  const hh = seconds / 3600;
  if (hh >= 1) return `${trim(hh)} hours`;
  const mm = seconds / 60;
  if (mm >= 1) return `${trim(mm)} minutes`;
  return `${trim(seconds)} seconds`;
}

const trim = (v: number): string => {
  const s = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
};

/** Every nuclide with a half-life — the pickable set for the Decay Lab. */
export const RADIOACTIVE: Nuclide[] = NUCLIDES.filter((n) => n.halfLife != null);

/** The nuclides drawn on the BE/A curve, in mass order. */
export const CURVE_NUCLIDES: Nuclide[] = NUCLIDES
  .filter((n) => n.onCurve)
  .slice()
  .sort((a, b) => a.A - b.A);
