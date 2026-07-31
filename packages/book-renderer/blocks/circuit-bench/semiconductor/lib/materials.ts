/*
 * semiconductor/lib/materials.ts — the material data. THE accuracy gate.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM — `scripts/verify-modern-physics.mjs` runs it in plain
 * node. Every number below is quoted WITH its source, per
 * SIMULATION_DESIGN_WORKFLOW §7 (anti-hallucination gate). Where a widely-taught
 * value differs from the current measurement, BOTH are recorded and the comment
 * says which is used and why — silently picking one is how a sim quietly
 * contradicts the book beside it.
 *
 * ── SOURCES ─────────────────────────────────────────────────────────────────
 * [Sze]   S. M. Sze & K. K. Ng, *Physics of Semiconductor Devices*, 3rd ed.,
 *         Appendix G — properties of Si, Ge and GaAs at 300 K.
 * [NCERT] NCERT Physics Class 12, Part 2, Ch. 14 "Semiconductor Electronics".
 * [SI]    CODATA 2018 / SI 2019 for k, q. Both exact by definition since 2019.
 *
 * ── WHAT IS A CONSTANT AND WHAT IS A DEVICE RATING ──────────────────────────
 * Band gap, intrinsic carrier density, permittivity and atom density are
 * PHYSICAL CONSTANTS of the material and are cited. Cut-in voltage, Zener
 * voltage and current gain β are DEVICE properties that vary between parts on
 * the same reel; they are ratings, they are labelled as ratings, and they are
 * exposed as archetype parameters rather than presented as facts about silicon.
 */

/** Boltzmann constant, J/K. Exact by definition (SI 2019). */
export const BOLTZMANN = 1.380649e-23;

/** Elementary charge, C. Exact by definition (SI 2019). */
export const Q_ELECTRON = 1.602176634e-19;

/** Permittivity of free space, F/m (CODATA 2018). */
export const EPS0 = 8.8541878128e-12;

/** Room temperature, K — the temperature every number below is quoted at. */
export const T_ROOM = 300;

/**
 * Thermal voltage V_T = kT/q, volts.
 *
 * **Derived, never quoted as 26 mV.** At 300 K it comes out 25.852 mV. The
 * rounded "26 mV" is fine in a hand calculation and wrong in a model: the
 * Shockley exponent is V/V_T, so a 0.6% error in V_T is a 16% error in the
 * current at 0.7 V. The verifier checks the derived value.
 */
export const thermalVoltage = (temperatureK = T_ROOM): number =>
  (BOLTZMANN * temperatureK) / Q_ELECTRON;

/** V_T at 300 K = 0.025852 V. */
export const V_T = thermalVoltage(T_ROOM);

export type MaterialName = 'Si' | 'Ge' | 'GaAs';

export interface Material {
  name: MaterialName;
  label: string;
  /** Band gap at 300 K, eV. [Sze] */
  bandGapEv: number;
  /**
   * Intrinsic carrier concentration at 300 K, per m³.
   *
   * ⚠ TWO VALUES ARE IN CIRCULATION FOR SILICON. The long-standing textbook
   * value is 1.5×10¹⁶ m⁻³ (1.5×10¹⁰ cm⁻³) and [NCERT] uses it; [Sze] 3rd ed.
   * gives 9.65×10¹⁵ m⁻³ from later measurements. The textbook value is used
   * here so the bench agrees with the book open beside it, and the discrepancy
   * is recorded in `niModern` rather than hidden.
   */
  intrinsicPerM3: number;
  /** The later measured value, per m³, for the honesty note. */
  niModernPerM3?: number;
  /** Atom density, per m³. [Sze] */
  atomsPerM3: number;
  /** Relative permittivity. [Sze] */
  epsRelative: number;
  /**
   * Forward cut-in ("knee") voltage, V — a DEVICE rating, not a constant.
   *
   * [NCERT] quotes ~0.7 V for silicon and ~0.2 V for germanium. Datasheets for
   * germanium point-contact diodes (e.g. 1N34A) give V_F ≈ 0.3 V at 1 mA, which
   * is the reference point this model is calibrated at, so 0.3 is used and the
   * NCERT figure is noted. For silicon the two agree.
   */
  kneeVolts: number;
  /** Electron and hole mobilities, m²/(V·s). [Sze] — used for the conductivity
   *  readout, which is what makes "doping changes conductivity by a factor of a
   *  million" a computed statement rather than an assertion. */
  muElectron: number;
  muHole: number;
}

export const MATERIALS: Record<MaterialName, Material> = {
  Si: {
    name: 'Si',
    label: 'Silicon',
    bandGapEv: 1.12,
    intrinsicPerM3: 1.5e16,
    niModernPerM3: 9.65e15,
    atomsPerM3: 5.0e28,
    epsRelative: 11.9,
    kneeVolts: 0.7,
    muElectron: 0.1350,
    muHole: 0.0480,
  },
  Ge: {
    name: 'Ge',
    label: 'Germanium',
    bandGapEv: 0.66,
    intrinsicPerM3: 2.4e19,
    atomsPerM3: 4.42e28,
    epsRelative: 16.0,
    kneeVolts: 0.3,
    muElectron: 0.3900,
    muHole: 0.1900,
  },
  GaAs: {
    name: 'GaAs',
    label: 'Gallium arsenide',
    bandGapEv: 1.42,
    intrinsicPerM3: 2.1e12,
    atomsPerM3: 4.42e28,
    epsRelative: 12.9,
    kneeVolts: 1.2,
    muElectron: 0.8500,
    muHole: 0.0400,
  },
};

export const material = (name: string): Material => MATERIALS[name as MaterialName] ?? MATERIALS.Si;

export const MATERIAL_NAMES: MaterialName[] = ['Si', 'Ge', 'GaAs'];

/** Absolute permittivity of the material, F/m. */
export const permittivity = (m: Material): number => m.epsRelative * EPS0;

// ── Doping ───────────────────────────────────────────────────────────────────

export type DopingType = 'intrinsic' | 'n-type' | 'p-type';

export interface CarrierState {
  type: DopingType;
  material: Material;
  /** Dopant concentration, per m³. Zero for intrinsic. */
  dopantPerM3: number;
  /** Electron concentration, per m³. */
  electrons: number;
  /** Hole concentration, per m³. */
  holes: number;
  /** Majority and minority counts, so the UI never has to work out which is which. */
  majority: number;
  minority: number;
  majorityCarrier: 'electrons' | 'holes' | 'both equally';
  /** Dopant atoms per host atom — the "one in a few million" fact. */
  dopantFraction: number;
  /** Conductivity σ = q(nμₑ + pμₕ), S/m. */
  conductivity: number;
  /** Resistivity 1/σ, Ω·m. */
  resistivity: number;
}

/**
 * Carrier concentrations for a doped sample.
 *
 * ── THE LAW OF MASS ACTION IS THE POINT ─────────────────────────────────────
 *      n · p = nᵢ²      always, at a given temperature, doped or not.
 *
 * So doping does not "add carriers" — it trades one kind for the other. Put
 * 10²² donors/m³ into silicon and the electron count rises by a factor of a
 * million while the hole count FALLS by the same factor, and the product is
 * unchanged. That is the single most commonly missed idea in the topic and it is
 * why `holes` is computed from nᵢ²/n rather than left at nᵢ.
 *
 * The exact solution of n − p = N_D with np = nᵢ² is used, not the n ≈ N_D
 * approximation, so the intrinsic limit (N_D → 0) comes out at exactly nᵢ
 * instead of dividing by zero.
 *
 * ⚠ AND IT IS SOLVED FOR THE MAJORITY CARRIER FIRST, NOT THE ELECTRON.
 * The quadratic root
 *
 *      n = (net + √(net² + 4nᵢ²)) / 2      where net = N_D − N_A
 *
 * is algebraically exact, and in double precision it CATASTROPHICALLY CANCELS on
 * the p-type side. At N_A = 10²⁵ m⁻³ the two terms are −10²⁵ and +10²⁵ agreeing
 * to fourteen digits, so the subtraction returns 0, the hole count comes back as
 * Infinity, and n·p arrives as NaN. That is exactly what the verifier caught: a
 * silent NaN at heavy p-doping, which would have blanked a chart with no error.
 *
 * The fix is the standard one: evaluate whichever root does NOT cancel — the
 * MAJORITY carrier — and get the minority from n·p = nᵢ². Same mathematics,
 * fifteen digits instead of none.
 */
export function carriers(m: Material, type: DopingType, dopantPerM3: number): CarrierState {
  const ni = m.intrinsicPerM3;
  const nd = type === 'n-type' ? Math.max(0, dopantPerM3) : 0;
  const na = type === 'p-type' ? Math.max(0, dopantPerM3) : 0;
  const net = nd - na;
  const root = Math.sqrt(net * net + 4 * ni * ni);

  let electrons: number;
  let holes: number;
  if (net > 0) {
    // n-type: this root adds two positives — no cancellation.
    electrons = (net + root) / 2;
    holes = (ni * ni) / electrons;
  } else if (net < 0) {
    // p-type: solve for the HOLES (the majority) the same way, then n = nᵢ²/p.
    holes = (-net + root) / 2;
    electrons = (ni * ni) / holes;
  } else {
    electrons = ni;
    holes = ni;
  }

  const majorityCarrier: CarrierState['majorityCarrier'] =
    type === 'n-type' ? 'electrons' : type === 'p-type' ? 'holes' : 'both equally';
  const conductivity = Q_ELECTRON * (electrons * m.muElectron + holes * m.muHole);

  return {
    type,
    material: m,
    dopantPerM3: type === 'intrinsic' ? 0 : Math.max(0, dopantPerM3),
    electrons,
    holes,
    majority: Math.max(electrons, holes),
    minority: Math.min(electrons, holes),
    majorityCarrier,
    dopantFraction: type === 'intrinsic' ? 0 : Math.max(0, dopantPerM3) / m.atomsPerM3,
    conductivity,
    resistivity: conductivity > 0 ? 1 / conductivity : Number.POSITIVE_INFINITY,
  };
}

/** Common dopants, so the UI can name what was actually added. Group 15 donates
 *  an electron (pentavalent → n-type); group 13 accepts one (trivalent →
 *  p-type). [NCERT] Ch. 14.3. */
export const DONORS = ['phosphorus', 'arsenic', 'antimony'];
export const ACCEPTORS = ['boron', 'aluminium', 'indium', 'gallium'];

/**
 * Fermi level position relative to the MID-GAP intrinsic level, eV.
 *
 *      E_F − E_i = kT · ln(n / nᵢ)
 *
 * positive on the n-side (E_F moves up toward the conduction band) and negative
 * on the p-side. Summing the two sides gives kT·ln(N_A N_D/nᵢ²), which is
 * exactly q·V_bi — so the band diagram and the built-in potential come from ONE
 * expression and cannot disagree. That consistency is checked in the verifier.
 */
export const fermiOffsetEv = (m: Material, electrons: number, temperatureK = T_ROOM): number =>
  thermalVoltage(temperatureK) * Math.log(electrons / m.intrinsicPerM3);
