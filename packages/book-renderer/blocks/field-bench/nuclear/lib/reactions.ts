/*
 * nuclear/lib/reactions.ts — Q values, and the two rules that decide products.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── THE TWO RULES ───────────────────────────────────────────────────────────
 * Every reaction and every decay in the chapter is decided by exactly two
 * conservation laws, and `conservation()` below checks BOTH on every reaction
 * this file ships. Nothing is displayed that does not pass.
 *
 *      Σ A  is the same on both sides      (nucleon number)
 *      Σ Q  is the same on both sides      (electric charge, counting the
 *                                           electron / positron as ∓1)
 *
 * Get those two right and the product of an alpha, beta-minus, beta-plus or
 * gamma emission is forced — there is nothing left to remember.
 *
 * ── THE Q VALUE ─────────────────────────────────────────────────────────────
 *      Q = (Σ mass in − Σ mass out)·c²
 * computed from mass EXCESSES, where the A's cancel exactly (see nuclides.ts).
 * Q > 0 releases energy; Q < 0 requires it. The sign is never taken as read.
 *
 * ── WHERE THE ELECTRONS GO ──────────────────────────────────────────────────
 * The one bookkeeping trap in the topic, handled explicitly per mode:
 *
 *   ALPHA        Parent(Z) → Daughter(Z−2) + ⁴He. Atomic masses carry Z, Z−2
 *                and 2 electrons — they balance, so Q = Δ(P) − Δ(D) − Δ(⁴He).
 *   BETA MINUS   Parent(Z) → Daughter(Z+1) + e⁻ + ν̄. The daughter ATOM already
 *                includes the emitted electron, so Q = Δ(P) − Δ(D). NO extra
 *                electron mass. Adding one is the commonest slip.
 *   BETA PLUS    Parent(Z) → Daughter(Z−1) + e⁺ + ν. Now the daughter atom has
 *                one electron TOO MANY and a positron has been created, so
 *                Q = Δ(P) − Δ(D) − 2m_ec². **Two** electron masses, 1.022 MeV,
 *                which is why beta-plus has a threshold and beta-minus does not.
 *   GAMMA        Nothing changes but the energy level. ΔZ = ΔA = 0.
 */

import { AVOGADRO, ELECTRON_MASS_MEV, mevToJoules, mevToU } from './constants';
import { type Nuclide, nuclide, pretty } from './nuclides';
import { binding, perNucleon } from './binding';

// ── Species ──────────────────────────────────────────────────────────────────

/**
 * One participant. `count` lets `3n` be one term rather than three, which is how
 * the equation is written on a board.
 */
export interface Term {
  id: string;
  count: number;
}

export const t = (id: string, count = 1): Term => ({ id, count });

/** Leptons are not in the nuclide table — they have A = 0 and are handled here.
 *  Charge in units of e; mass in MeV. The neutrino's mass is < 1 eV, i.e. six
 *  orders of magnitude below the last digit of any Q value here, so it is taken
 *  as zero and the comment says so rather than the code hiding it. */
const LEPTONS: Record<string, { charge: number; massMev: number; label: string }> = {
  'e-': { charge: -1, massMev: ELECTRON_MASS_MEV, label: 'β⁻ (electron)' },
  'e+': { charge: +1, massMev: ELECTRON_MASS_MEV, label: 'β⁺ (positron)' },
  nu: { charge: 0, massMev: 0, label: 'ν (neutrino)' },
  nubar: { charge: 0, massMev: 0, label: 'ν̄ (antineutrino)' },
  gamma: { charge: 0, massMev: 0, label: 'γ (photon)' },
};

const isLepton = (id: string): boolean => id in LEPTONS;

/** Nucleon number of a term — zero for every lepton and for the photon. */
export function nucleonsOf(term: Term): number {
  if (isLepton(term.id)) return 0;
  return nuclide(term.id).A * term.count;
}

/** Charge of a term in units of e. */
export function chargeOf(term: Term): number {
  if (isLepton(term.id)) return LEPTONS[term.id].charge * term.count;
  return nuclide(term.id).Z * term.count;
}

export function labelOfTerm(term: Term): string {
  const base = isLepton(term.id) ? LEPTONS[term.id].label : pretty(nuclide(term.id));
  return term.count > 1 ? `${term.count}${base}` : base;
}

// ── Reactions ────────────────────────────────────────────────────────────────

export type ReactionKind = 'fission' | 'fusion' | 'alpha' | 'beta-minus' | 'beta-plus' | 'gamma';

export interface Reaction {
  id: string;
  kind: ReactionKind;
  inputs: Term[];
  outputs: Term[];
  /** One line naming what the reaction is FOR, not what it is. */
  headline: string;
  /**
   * Energy released by a de-excitation, MeV — used ONLY by gamma emission,
   * where the transition energy is a measured level property and not a
   * difference of ground-state masses. Quoted with its source.
   */
  gammaMev?: number;
}

export interface Conservation {
  nucleonsIn: number;
  nucleonsOut: number;
  chargeIn: number;
  chargeOut: number;
  ok: boolean;
  /** What is wrong, in words, when it is not ok. Empty when it is. */
  problems: string[];
}

/** Both rules, checked. Called on every reaction before it is displayed. */
export function conservation(r: Reaction): Conservation {
  const nucleonsIn = r.inputs.reduce((s, x) => s + nucleonsOf(x), 0);
  const nucleonsOut = r.outputs.reduce((s, x) => s + nucleonsOf(x), 0);
  const chargeIn = r.inputs.reduce((s, x) => s + chargeOf(x), 0);
  const chargeOut = r.outputs.reduce((s, x) => s + chargeOf(x), 0);
  const problems: string[] = [];
  if (nucleonsIn !== nucleonsOut) {
    problems.push(`Nucleon number does not balance: ${nucleonsIn} in, ${nucleonsOut} out.`);
  }
  if (chargeIn !== chargeOut) {
    problems.push(`Charge does not balance: ${chargeIn}e in, ${chargeOut}e out.`);
  }
  return { nucleonsIn, nucleonsOut, chargeIn, chargeOut, ok: problems.length === 0, problems };
}

/**
 * Sum of mass excesses on one side, MeV, plus any lepton rest masses that do
 * NOT cancel against the atomic-mass bookkeeping.
 *
 * Nuclide terms contribute their tabulated Δ. Leptons contribute nothing here —
 * beta bookkeeping is handled by `qValue` per mode, because whether an electron
 * mass cancels depends on which direction Z moved, and burying that in a sum
 * would hide the one thing worth understanding.
 */
const excessSum = (terms: Term[]): number =>
  terms.reduce((s, x) => (isLepton(x.id) ? s : s + nuclide(x.id).excess * x.count), 0);

export interface QResult {
  /** MeV. Positive = energy released. */
  mev: number;
  /** The same energy in joules. */
  joules: number;
  /** Mass converted, u. */
  massDefectU: number;
  releases: boolean;
  /** How the bookkeeping was done, printed beside the number so it is not a
   *  black box. */
  method: string;
}

/**
 * Q value. Positive means energy comes OUT.
 *
 * The mode decides whether electron masses cancel — see the file header. This
 * function is the only place in the bench where that decision is made.
 */
export function qValue(r: Reaction): QResult {
  if (r.kind === 'gamma') {
    const mev = r.gammaMev ?? 0;
    return {
      mev,
      joules: mevToJoules(mev),
      massDefectU: 0,
      releases: mev > 0,
      method:
        'A gamma is a de-excitation: the nucleus keeps every proton and every neutron and simply '
        + 'drops to a lower level, so this energy is a measured level spacing, not a difference of masses.',
    };
  }

  const raw = excessSum(r.inputs) - excessSum(r.outputs);

  // β⁺ is the only mode where the atomic-mass bookkeeping leaves a real
  // 2·m_e c² behind: the daughter ATOM carries one electron too many AND a
  // positron has been created out of the energy budget.
  const leptonPenalty = r.kind === 'beta-plus' ? 2 * ELECTRON_MASS_MEV : 0;
  const mev = raw - leptonPenalty;

  const method =
    r.kind === 'beta-minus'
      ? 'Q = Δ(parent) − Δ(daughter). The daughter atom already includes the electron that flew out, '
        + 'so no extra electron mass is subtracted — and that is why β⁻ has no threshold.'
      : r.kind === 'beta-plus'
        ? 'Q = Δ(parent) − Δ(daughter) − 2mₑc². TWO electron masses (1.022 MeV): the daughter atom is '
          + 'left with a spare electron and a positron had to be made. Below 1.022 MeV β⁺ simply cannot happen.'
        : 'Q = Σ Δ(in) − Σ Δ(out). Atomic masses carry equal numbers of electrons on both sides, so they cancel.';

  return {
    mev,
    joules: mevToJoules(mev),
    massDefectU: mevToU(mev),
    releases: mev > 0,
    method,
  };
}

/** `²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n` — the equation, written the way a board is. */
export function equation(r: Reaction): string {
  const side = (terms: Term[]) => terms.map(labelOfTerm).join(' + ');
  return `${side(r.inputs)} → ${side(r.outputs)}`;
}

// ── Where the reaction sits on the curve — the whole point ────────────────────

export interface CurveMove {
  /**
   * Reactant nuclides that carry the bulk of the nucleons, with their BE/A.
   *
   * ⚠ `count` IS LOAD-BEARING. `3n` is one term with a count of three, and an
   * earlier version dropped the count from this list — so summing `A` over it gave
   * 234 nucleons out of a 236-nucleon fission. The weighted means were right (they
   * multiply by the count), which is exactly why it was invisible: every energy
   * came out correct and only the nucleon tally was wrong. Multiply by `count`
   * whenever you total anything from this list.
   */
  from: { id: string; A: number; count: number; perNucleon: number }[];
  /** Product nuclides likewise. */
  to: { id: string; A: number; count: number; perNucleon: number }[];
  /** Weighted-mean BE/A before and after, MeV per nucleon. Weighted by nucleon
   *  count, because that is what "per nucleon" means. */
  beforePerNucleon: number;
  afterPerNucleon: number;
  /** afterPerNucleon − beforePerNucleon. Positive for every energy-releasing
   *  reaction, which is exactly the claim the shared axis is making. */
  gainPerNucleon: number;
  /** Did the nucleons move UP the curve, i.e. toward the peak? */
  towardPeak: boolean;
}

/** Free nucleons have no binding energy, so they contribute 0 to a weighted
 *  mean and their nucleons still count in the denominator. That is not a
 *  convention — an unbound neutron genuinely has zero binding energy. */
const weighted = (terms: Term[]): { total: number; nucleons: number; list: CurveMove['from'] } => {
  let total = 0;
  let nucleons = 0;
  const list: CurveMove['from'] = [];
  for (const term of terms) {
    if (isLepton(term.id)) continue;
    const n = nuclide(term.id);
    const bpn = n.A > 1 ? perNucleon(n) : 0;
    total += bpn * n.A * term.count;
    nucleons += n.A * term.count;
    list.push({ id: n.id, A: n.A, count: term.count, perNucleon: bpn });
  }
  return { total, nucleons, list };
};

/**
 * The one claim the shared axis makes: BOTH fission and fusion move nucleons
 * UP the binding-energy-per-nucleon curve, and the energy released is the area
 * they climbed.
 *
 * `gainPerNucleon × nucleons` reproduces the Q value to within the mass of the
 * leptons involved, which the verifier checks for both a fission and a fusion —
 * making "read the energy off the curve" a real measurement rather than a
 * slogan printed next to an unrelated number.
 */
export function curveMove(r: Reaction): CurveMove {
  const before = weighted(r.inputs);
  const after = weighted(r.outputs);
  const b = before.nucleons > 0 ? before.total / before.nucleons : 0;
  const a = after.nucleons > 0 ? after.total / after.nucleons : 0;
  return {
    from: before.list,
    to: after.list,
    beforePerNucleon: b,
    afterPerNucleon: a,
    gainPerNucleon: a - b,
    towardPeak: a > b,
  };
}

// ── The catalogue ────────────────────────────────────────────────────────────

/**
 * FISSION — the standard uranium-235 channel every Indian textbook prints.
 *
 * ⚠ ITS PROMPT Q IS 173.3 MeV, NOT 200. See `FISSION_TOTAL_MEV` below. Many
 * textbooks attach "about 200 MeV" to this exact equation; that is the TOTAL
 * energy per fission including the later beta decay of the fragments, and the
 * prompt Q of this channel computed from real masses is 15% lower. The bench
 * shows both numbers and says which is which, because a student who has done
 * the arithmetic and got 173 needs to be told they are right.
 */
export const FISSION_U235: Reaction = {
  id: 'fission-u235',
  kind: 'fission',
  inputs: [t('U-235'), t('n')],
  outputs: [t('Ba-141'), t('Kr-92'), t('n', 3)],
  headline:
    'One slow neutron splits uranium-235 into two middle-weight fragments and three more neutrons '
    + '— which is what makes a chain reaction possible.',
};

/** FUSION — deuterium + tritium, the reaction ITER and every star-power project
 *  is built around, because it has the largest cross-section at reachable
 *  temperatures. Q = 17.589 MeV. */
export const FUSION_DT: Reaction = {
  id: 'fusion-dt',
  kind: 'fusion',
  inputs: [t('H-2'), t('H-3')],
  outputs: [t('He-4'), t('n')],
  headline:
    'Deuterium and tritium make helium and a spare neutron. 17.6 MeV from five nucleons — '
    + 'per nucleon, four times what fission gives.',
};

/** FUSION — the two deuterium-deuterium branches, which occur at roughly equal
 *  rates and are why "just fuse deuterium" is not one reaction. */
export const FUSION_DD_NEUTRON: Reaction = {
  id: 'fusion-dd-n',
  kind: 'fusion',
  inputs: [t('H-2'), t('H-2')],
  outputs: [t('He-3'), t('n')],
  headline: 'Two deuterons, branch one: helium-3 and a neutron. 3.27 MeV.',
};

export const FUSION_DD_PROTON: Reaction = {
  id: 'fusion-dd-p',
  kind: 'fusion',
  inputs: [t('H-2'), t('H-2')],
  outputs: [t('H-3'), t('H-1')],
  headline: 'The same two deuterons, branch two: tritium and a proton. 4.03 MeV.',
};

// ── Decays ───────────────────────────────────────────────────────────────────

export const ALPHA_U238: Reaction = {
  id: 'alpha-u238',
  kind: 'alpha',
  inputs: [t('U-238')],
  outputs: [t('Th-234'), t('He-4')],
  headline: 'Alpha: two protons and two neutrons leave together. Z drops by 2, A drops by 4.',
};

export const ALPHA_RA226: Reaction = {
  id: 'alpha-ra226',
  kind: 'alpha',
  inputs: [t('Ra-226')],
  outputs: [t('Rn-222'), t('He-4')],
  headline: 'Radium to radon — a solid decaying into a gas, which is why radon gets into houses.',
};

export const ALPHA_RN222: Reaction = {
  id: 'alpha-rn222',
  kind: 'alpha',
  inputs: [t('Rn-222')],
  outputs: [t('Po-218'), t('He-4')],
  headline: 'Radon to polonium, in under four days.',
};

export const ALPHA_PU239: Reaction = {
  id: 'alpha-pu239',
  kind: 'alpha',
  inputs: [t('Pu-239')],
  outputs: [t('U-235'), t('He-4')],
  headline: 'Plutonium decays back to the uranium-235 it was bred from.',
};

export const BETA_C14: Reaction = {
  id: 'beta-c14',
  kind: 'beta-minus',
  inputs: [t('C-14')],
  outputs: [t('N-14'), t('e-'), t('nubar')],
  headline:
    'Beta-minus: a NEUTRON inside the nucleus turns into a proton. Z rises by 1, A does not move '
    + '— and this one is how carbon dating works.',
};

export const BETA_CS137: Reaction = {
  id: 'beta-cs137',
  kind: 'beta-minus',
  inputs: [t('Cs-137')],
  outputs: [t('Ba-137'), t('e-'), t('nubar')],
  headline: 'The 30-year fission product that dominates long-term fallout.',
};

export const BETA_SR90: Reaction = {
  id: 'beta-sr90',
  kind: 'beta-minus',
  inputs: [t('Sr-90')],
  outputs: [t('Y-90'), t('e-'), t('nubar')],
  headline: 'Strontium-90 — chemically like calcium, so it ends up in bone.',
};

export const BETA_NEUTRON: Reaction = {
  id: 'beta-neutron',
  kind: 'beta-minus',
  inputs: [t('n')],
  outputs: [t('H-1'), t('e-'), t('nubar')],
  headline:
    'A FREE neutron does this in about ten minutes. Beta-minus is not something the nucleus does '
    + 'to a neutron — it is what a neutron does on its own unless binding stops it.',
};

export const BETA_PLUS_NA22: Reaction = {
  id: 'beta-plus-na22',
  kind: 'beta-plus',
  inputs: [t('Na-22')],
  outputs: [t('Ne-22'), t('e+'), t('nu')],
  headline:
    'Beta-plus: a PROTON turns into a neutron. Z drops by 1, A does not move — and it costs '
    + '1.022 MeV before any energy is left over, which is why it is rarer than beta-minus.',
};

/**
 * GAMMA — cobalt-60 beta-decays to an EXCITED nickel-60, which then drops to the
 * ground state emitting 1.3325 MeV. Z and A are unchanged; only the energy level
 * moves.
 *
 * Source for the transition energy: NUBASE2020 / ENSDF Ni-60 level scheme —
 * the 2505.75 keV level cascades via 1332.5 keV. This is a measured level
 * spacing, NOT a ground-state mass difference, which is why it is carried as
 * `gammaMev` rather than derived.
 */
export const GAMMA_NI60: Reaction = {
  id: 'gamma-ni60',
  kind: 'gamma',
  inputs: [t('Ni-60')],
  outputs: [t('Ni-60'), t('gamma')],
  headline:
    'Gamma: nothing about the nucleus changes except how much energy it is holding. '
    + 'Same Z, same A, same element — this is the one that is NOT a transmutation.',
  gammaMev: 1.3325,
};

export const REACTIONS: Reaction[] = [
  FISSION_U235, FUSION_DT, FUSION_DD_NEUTRON, FUSION_DD_PROTON,
  ALPHA_U238, ALPHA_RA226, ALPHA_RN222, ALPHA_PU239,
  BETA_C14, BETA_CS137, BETA_SR90, BETA_NEUTRON,
  BETA_PLUS_NA22, GAMMA_NI60,
];

export const reactionById = (id: string): Reaction | undefined =>
  REACTIONS.find((r) => r.id === id);

export const reactionsOfKind = (kind: ReactionKind): Reaction[] =>
  REACTIONS.filter((r) => r.kind === kind);

// ── Fission energy accounting, said out loud ─────────────────────────────────

export interface FissionAccount {
  label: string;
  mev: number;
  escapes: boolean;
}

/**
 * Where the ~200 MeV of a uranium-235 fission actually goes.
 *
 * ⚠ THE PROMPT Q OF ONE CHANNEL IS NOT THE TOTAL PER FISSION. `qValue(
 * FISSION_U235)` returns 173.3 MeV, which is the ground-state mass difference of
 * that channel. The famous "about 200 MeV" adds everything released afterwards,
 * as the neutron-rich fragments beta-decay their way down to stability.
 *
 * Source: Lamarsh & Baratta, *Introduction to Nuclear Engineering* (3rd ed.),
 * §3.7 "Energy released in fission". Published breakdowns differ by 1–3 MeV in
 * each row and by ~5 MeV in the total, so no row is quoted past 1 MeV and the
 * total is presented as "about 200 MeV", not as 204.6.
 */
export const FISSION_ACCOUNT: FissionAccount[] = [
  { label: 'kinetic energy of the two fragments', mev: 168, escapes: false },
  { label: 'prompt gamma rays', mev: 7, escapes: false },
  { label: 'kinetic energy of the prompt neutrons', mev: 5, escapes: false },
  { label: 'beta particles from fragment decay', mev: 8, escapes: false },
  { label: 'delayed gamma rays from fragment decay', mev: 7, escapes: false },
  { label: 'antineutrinos — these leave the planet', mev: 10, escapes: true },
];

/** Total per fission, MeV — the sum of the account above, ~205. */
export const FISSION_TOTAL_MEV = FISSION_ACCOUNT.reduce((s, x) => s + x.mev, 0);

/** What a reactor can actually turn into heat — everything except the
 *  antineutrinos, ~195 MeV. */
export const FISSION_RECOVERABLE_MEV = FISSION_ACCOUNT
  .filter((x) => !x.escapes)
  .reduce((s, x) => s + x.mev, 0);

/**
 * Energy released per kilogram of a fuel, joules — the number that makes the
 * comparison land. One kilogram of uranium-235 against one kilogram of coal.
 *
 * Coal: 1 kg of good bituminous coal releases about 30 MJ (its calorific value,
 * 24–33 MJ/kg depending on grade — quoted as a range in the UI, never as a
 * single decimal).
 */
export const COAL_JOULES_PER_KG = 30e6;

export function joulesPerKilogram(perEventMev: number, massNumber: number): number {
  // events per kg = N_A × (1000 g / A grams per mole)
  const eventsPerKg = (AVOGADRO * 1000) / massNumber;
  return eventsPerKg * mevToJoules(perEventMev);
}

// ── A small helper the reaction views need ───────────────────────────────────

/** BE/A of every nuclide in a reaction, keyed by id — so a view can colour the
 *  curve markers without recomputing binding energies per frame. */
export function perNucleonMap(r: Reaction): Record<string, number> {
  const out: Record<string, number> = {};
  for (const term of [...r.inputs, ...r.outputs]) {
    if (isLepton(term.id)) continue;
    const n: Nuclide = nuclide(term.id);
    out[n.id] = n.A > 1 ? binding(n).perNucleon : 0;
  }
  return out;
}
