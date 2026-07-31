/*
 * nuclear/lib/constants.ts — the nuclear constants, DERIVED not quoted.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM — so `scripts/verify-modern-physics.mjs` runs it in
 * plain node (PHYSICS_SIMULATION_PROGRAM.md §9: no academic claim ships
 * unverified).
 *
 * ⚠ MEV_PER_U IS DERIVED FROM u, c AND e. It is NOT quoted as 931.5.
 *
 * The whole Nuclear Bench rests on one identity: a mass defect in atomic mass
 * units and an energy in MeV are the SAME NUMBER wearing different clothes. The
 * bench shows Δm, then E = Δmc² in MeV, then the same E in joules, and claims
 * all three agree. If the conversion factor were an independently rounded
 * literal, those three readouts would disagree in the fourth digit and the sim
 * would undermine its own lesson with our arithmetic. So:
 *
 *      MEV_PER_U = u·c² / (e × 10⁶)
 *
 * comes out at 931.49410242 MeV/u from CODATA 2018 primitives, and the
 * verifier checks that it does. Same discipline as `field-bench/lib/constants.ts`
 * deriving k from ε₀.
 *
 * `ELEMENTARY_CHARGE` is imported rather than re-declared — there is one
 * elementary charge in this program and E5 already owns it.
 */

import { ELEMENTARY_CHARGE } from '../../lib/constants';

export { ELEMENTARY_CHARGE };

/** Speed of light in vacuum, m/s. Exact by definition of the metre (SI 2019). */
export const C_LIGHT = 299792458;

/** Unified atomic mass constant, kg. CODATA 2018: 1.66053906660(50)×10⁻²⁷ kg. */
export const ATOMIC_MASS_UNIT = 1.66053906660e-27;

/** Joules per electronvolt — the elementary charge, numerically. */
export const EV_IN_JOULES = ELEMENTARY_CHARGE;
export const MEV_IN_JOULES = ELEMENTARY_CHARGE * 1e6;

/**
 * Energy equivalent of one atomic mass unit, MeV. **Derived** — see the header.
 * Comes out 931.49410242 MeV/u, the CODATA value, without ever being typed.
 */
export const MEV_PER_U = (ATOMIC_MASS_UNIT * C_LIGHT * C_LIGHT) / MEV_IN_JOULES;

/** Electron rest energy, MeV. CODATA 2018 m_e c² = 0.51099895000 MeV. Needed
 *  for β⁺ bookkeeping, where two electron masses appear in the Q value and
 *  forgetting them is the single commonest slip in the topic. */
export const ELECTRON_MASS_MEV = 0.51099895000;

/** Proton and neutron rest energies, MeV (CODATA 2018). Used only for the
 *  p-p chain cross-check, where nuclear rather than atomic masses are the
 *  natural bookkeeping. */
export const PROTON_MASS_MEV = 938.27208816;
export const NEUTRON_MASS_MEV = 939.56542052;

/** ln 2 — appears in every half-life relation, so it is named once. */
export const LN2 = Math.LN2;

/** Seconds per year (Julian year, 365.25 d) — the unit half-lives are tabulated
 *  in. Stated explicitly because "a year" is 365 d in some tables and 365.25 in
 *  others, a 0.07% difference that would otherwise be invisible. */
export const SECONDS_PER_YEAR = 365.25 * 24 * 3600;
export const SECONDS_PER_DAY = 24 * 3600;

/** Avogadro constant, /mol (CODATA 2018, exact since 2019). Turns a sample mass
 *  into a population, which is what makes an activity in becquerels real rather
 *  than symbolic. */
export const AVOGADRO = 6.02214076e23;

/** Becquerel → curie. 1 Ci = 3.7×10¹⁰ Bq exactly, by definition. */
export const BQ_PER_CURIE = 3.7e10;

/** MeV → joules, and back. Named so no archetype carries a stray 1.602e-13. */
export const mevToJoules = (mev: number): number => mev * MEV_IN_JOULES;
export const joulesToMev = (j: number): number => j / MEV_IN_JOULES;

/** A mass defect in u → the energy it is worth, MeV. E = Δmc², once. */
export const uToMev = (deltaU: number): number => deltaU * MEV_PER_U;
export const mevToU = (mev: number): number => mev / MEV_PER_U;
