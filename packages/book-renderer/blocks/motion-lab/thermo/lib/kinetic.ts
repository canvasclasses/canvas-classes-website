/*
 * motion-lab/thermo/lib/kinetic.ts — kinetic theory and the speed distribution.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no dependencies. Checked by
 * `scripts/verify-motion-phase2.mjs`.
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ───────────────────────────────────────
 * Temperature IS mean translational kinetic energy. Not "a measure of", not
 * "related to" — the two are the same physical quantity in different units:
 *
 *      ⟨½mv²⟩ = (3/2)k_B T                (for any gas, any mass, any pressure)
 *
 * A student who has internalised that stops asking "does a heavier gas at the
 * same temperature move faster?" — the ENERGIES are equal, so the heavier
 * molecules must move SLOWER, by exactly √(m₂/m₁).
 *
 * The verifier checks this by numerically integrating ½mv² against the
 * Maxwell–Boltzmann distribution and comparing with (3/2)k_BT, rather than by
 * quoting the identity back at itself.
 */

/** J/K — CODATA (exact by SI definition since 2019). */
export const K_B = 1.380649e-23;
/** mol⁻¹ */
export const N_A = 6.02214076e23;
/** J·mol⁻¹·K⁻¹ */
export const R_GAS = K_B * N_A;

/** Molecular mass in kg from a molar mass in g/mol. */
export const molecularMass = (molarMassGPerMol: number): number =>
  molarMassGPerMol / 1000 / N_A;

// ── The distribution ─────────────────────────────────────────────────────────

/**
 * The Maxwell–Boltzmann speed distribution, f(v), units s/m (a probability
 * DENSITY — ∫f dv = 1, and f itself is not a probability).
 *
 *      f(v) = 4π (m / 2πk_BT)^{3/2} v² exp(−mv² / 2k_BT)
 *
 * The v² prefactor is why the curve starts at zero: there is exactly one way to
 * be at rest and a whole sphere's worth of ways to be moving at 400 m/s. The
 * exponential is why it eventually falls: those fast states cost energy. The
 * peak is the fight between the two, which is the only thing worth remembering
 * about the shape.
 */
export function maxwellBoltzmann(v: number, m: number, T: number): number {
  if (v < 0) return 0;
  const a = m / (2 * Math.PI * K_B * T);
  return 4 * Math.PI * Math.pow(a, 1.5) * v * v * Math.exp((-m * v * v) / (2 * K_B * T));
}

/** Most probable speed — the PEAK of the curve. √(2k_BT/m). */
export const vMostProbable = (m: number, T: number): number => Math.sqrt((2 * K_B * T) / m);

/** Mean speed. √(8k_BT/πm). Sits to the RIGHT of the peak, because the tail is
 *  long on one side only. */
export const vMean = (m: number, T: number): number => Math.sqrt((8 * K_B * T) / (Math.PI * m));

/** Root-mean-square speed. √(3k_BT/m). Right of the mean again, because
 *  squaring weights the fast molecules more heavily. This is the one that
 *  appears in the pressure derivation — never the mean. */
export const vRms = (m: number, T: number): number => Math.sqrt((3 * K_B * T) / m);

/** The fixed ordering v_p : v̄ : v_rms = √2 : √(8/π) : √3 ≈ 1 : 1.128 : 1.225.
 *  Independent of gas and of temperature — a free sanity check on any answer. */
export const speedRatios = (): { vp: number; vbar: number; vrms: number } => ({
  vp: Math.SQRT2,
  vbar: Math.sqrt(8 / Math.PI),
  vrms: Math.sqrt(3),
});

/** ⟨½mv²⟩ = (3/2)k_BT, joules per molecule. Mass-free — that is the point. */
export const meanKineticEnergy = (T: number): number => 1.5 * K_B * T;

/** The inverse: the temperature a given mean KE corresponds to. */
export const temperatureFromMeanKE = (ke: number): number => ke / (1.5 * K_B);

/** Internal energy of n moles with f degrees of freedom: U = (f/2)nRT. */
export const internalEnergy = (n: number, f: number, T: number): number => (f / 2) * n * R_GAS * T;

// ── Sampling for the renderer, and for the verifier ──────────────────────────

export interface SpeedBin {
  /** Left edge of the bin, m/s. */
  from: number;
  to: number;
  /** Bin centre. */
  v: number;
  /** f(v) at the centre, s/m. */
  density: number;
  /** Fraction of molecules in this bin (density × width). */
  fraction: number;
}

/**
 * The distribution as histogram bins, which is how it is drawn and how the
 * verifier integrates it. Midpoint rule: exact enough that ∫f dv = 1 to better
 * than 1e-6 for the bin counts used here, and it is the same arithmetic the
 * bars represent — so the drawn area really is the quoted fraction.
 */
export function speedBins(m: number, T: number, vMax: number, bins = 240): SpeedBin[] {
  const w = vMax / bins;
  const out: SpeedBin[] = [];
  for (let i = 0; i < bins; i++) {
    const from = i * w;
    const v = from + w / 2;
    const density = maxwellBoltzmann(v, m, T);
    out.push({ from, to: from + w, v, density, fraction: density * w });
  }
  return out;
}

/** Σ fraction — should be 1. Reported rather than assumed so a bad vMax (a
 *  window that cuts off the tail) is visible instead of silent. */
export const totalFraction = (bins: SpeedBin[]): number =>
  bins.reduce((s, b) => s + b.fraction, 0);

/** ⟨½mv²⟩ computed FROM the histogram, J. The verifier compares this with
 *  (3/2)k_BT — that comparison is the whole "temperature is mean KE" claim. */
export const meanKEFromBins = (bins: SpeedBin[], m: number): number =>
  bins.reduce((s, b) => s + 0.5 * m * b.v * b.v * b.fraction, 0);

/** ⟨v²⟩ from the histogram, so v_rms can be recovered by measurement. */
export const meanSquareFromBins = (bins: SpeedBin[]): number =>
  bins.reduce((s, b) => s + b.v * b.v * b.fraction, 0);

/** Fraction of molecules faster than `v` — the quantity that governs
 *  evaporation, escape from the atmosphere, and reaction rates. */
export function fractionAbove(bins: SpeedBin[], v: number): number {
  let s = 0;
  for (const b of bins) if (b.v >= v) s += b.fraction;
  return s;
}

// ── A chamber of molecules, for the piston view ──────────────────────────────

export interface Molecule {
  x: number; y: number;
  vx: number; vy: number;
}

/**
 * Deterministically seeded starting positions and velocities whose SPEEDS are
 * drawn from the 2-D Maxwell distribution at temperature T.
 *
 * Deterministic on purpose: the same block renders the same chamber on every
 * mount, so a student who reloads does not lose their comparison, and the
 * verifier can assert on it.
 *
 * NOTE the honest limitation, stated because the sim states it too: the drawn
 * chamber is 2-D, where ⟨½mv²⟩ = k_BT (two degrees of freedom), while the
 * quoted physics is the real 3-D gas with (3/2)k_BT. The speeds here are
 * therefore scaled to LOOK right rather than to BE the 3-D distribution, and
 * every number the student reads comes from the 3-D functions above.
 */
export function seedChamber(count: number, T: number, m: number, boxW: number, boxH: number, seed = 1): Molecule[] {
  let s = seed >>> 0;
  const rnd = () => {
    // mulberry32 — small, deterministic, and good enough for scatter.
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const scale = vRms(m, T);
  const out: Molecule[] = [];
  for (let i = 0; i < count; i++) {
    // Box–Muller gives a Gaussian per component; the resulting speed is
    // Maxwellian by construction, which is the honest way to seed it.
    const u1 = Math.max(rnd(), 1e-9);
    const u2 = rnd();
    const g1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const g2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    out.push({
      x: rnd() * boxW,
      y: rnd() * boxH,
      vx: (g1 * scale) / Math.sqrt(3),
      vy: (g2 * scale) / Math.sqrt(3),
    });
  }
  return out;
}

/**
 * Advance the chamber by dt with elastic wall bounces.
 *
 * `pistonX` is the right wall. A wall that MOVES does work on the molecules it
 * hits — a molecule bouncing off an incoming piston leaves faster, which is
 * compression heating with no heat added anywhere. That reflection rule is one
 * line (`vx = 2·pistonV − vx`) and it is the entire mechanism behind the
 * adiabatic temperature rise the PV workbench plots.
 */
export function advanceChamber(
  mols: Molecule[], dt: number, boxH: number, pistonX: number, pistonV: number
): Molecule[] {
  return mols.map((mol) => {
    let { x, y, vx, vy } = mol;
    x += vx * dt;
    y += vy * dt;
    if (x < 0) { x = -x; vx = -vx; }
    if (x > pistonX) { x = 2 * pistonX - x; vx = 2 * pistonV - vx; }
    if (y < 0) { y = -y; vy = -vy; }
    if (y > boxH) { y = 2 * boxH - y; vy = -vy; }
    return { x, y, vx, vy };
  });
}

/** Mean ½m v² of a drawn chamber — so the on-screen molecules and the on-screen
 *  temperature are the same number, not two numbers that happen to agree. */
export const chamberMeanKE = (mols: Molecule[], m: number): number =>
  mols.reduce((s, o) => s + 0.5 * m * (o.vx * o.vx + o.vy * o.vy), 0) / Math.max(mols.length, 1);
