/*
 * rotation/lib/torque.ts — force × PERPENDICULAR distance.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE WORD STUDENTS DROP ───────────────────────────────────────────────────
 * "Torque is force times distance" is remembered; "perpendicular" is not. It
 * only costs marks when the force stops being vertical — so a beam bench with
 * hanging masses can never expose the error, because a hanging mass pulls
 * straight down and the perpendicular distance IS the distance along the beam.
 *
 * That is why this module treats an ANGLED PULL as a first-class load, not an
 * extra. τ = F·r·sin φ collapses to F·r only at φ = 90°, and a pull at 30° gives
 * exactly HALF the torque a student expects — a factor of two they can see on
 * the beam rather than be told about.
 *
 * ── SIGN CONVENTION ──────────────────────────────────────────────────────────
 * CCW positive, the same convention as every angle in this program. A weight
 * hung to the RIGHT of the pivot turns the beam clockwise, so its torque is
 * NEGATIVE. The sim never hides this behind "clockwise = anticlockwise"; the
 * ledger prints signed terms that add to zero.
 */

const DEG = Math.PI / 180;
const G_DEFAULT = 9.8;

export interface Load {
  id: string;
  /** Position along the beam, m, measured from the beam's left end. */
  x: number;
  /**
   * A hanging mass, kg. Its force is m·g straight DOWN — `angleDeg` is ignored
   * and reported as 270 so the legend and the maths cannot disagree.
   */
  mass?: number;
  /** An applied pull, N. Used when `mass` is absent. */
  forceN?: number;
  /** Direction of the pull, degrees CCW from +x. Only meaningful with forceN. */
  angleDeg?: number;
  label?: string;
}

export interface TorqueTerm {
  id: string;
  /** N */
  force: number;
  /** Direction of the force, degrees CCW from +x. */
  angleDeg: number;
  /** Signed lever arm along the beam, m: x − pivot. */
  lever: number;
  /** |lever·sin φ| — the distance that actually counts, m. */
  perpDistance: number;
  /** N m, CCW positive. */
  torque: number;
  /** true for a hanging mass (force fixed straight down). */
  hanging: boolean;
}

/** The force vector a load applies, N. */
export function forceOf(load: Load, g = G_DEFAULT): { mag: number; angleDeg: number } {
  if (typeof load.mass === 'number') return { mag: load.mass * g, angleDeg: 270 };
  return { mag: load.forceN ?? 0, angleDeg: load.angleDeg ?? 270 };
}

/**
 * One load's torque about a pivot on a horizontal beam.
 *
 *      r = (x − pivot, 0),  F = |F|(cos φ, sin φ)
 *      τ = r × F = r_x·F_y − r_y·F_x = (x − pivot)·|F|·sin φ
 *
 * The y-term vanishes because the beam is horizontal, which is exactly why the
 * perpendicular distance reduces to |x − pivot|·|sin φ|.
 */
export function torqueOf(load: Load, pivotX: number, g = G_DEFAULT): TorqueTerm {
  const { mag, angleDeg } = forceOf(load, g);
  const lever = load.x - pivotX;
  const s = Math.sin(angleDeg * DEG);
  return {
    id: load.id,
    force: mag,
    angleDeg,
    lever,
    perpDistance: Math.abs(lever * s),
    torque: lever * mag * s,
    hanging: typeof load.mass === 'number',
  };
}

export function torqueTerms(loads: Load[], pivotX: number, g = G_DEFAULT): TorqueTerm[] {
  return loads.map((l) => torqueOf(l, pivotX, g));
}

export function netTorque(loads: Load[], pivotX: number, g = G_DEFAULT): number {
  return torqueTerms(loads, pivotX, g).reduce((a, t) => a + t.torque, 0);
}

/** Balanced when the signed torques sum to (nearly) zero. */
export function isBalanced(loads: Load[], pivotX: number, g = G_DEFAULT, tol = 0.05): boolean {
  return Math.abs(netTorque(loads, pivotX, g)) <= tol;
}

/**
 * Where the pivot must sit for the beam to balance, m from the left end.
 *
 * Only defined when every load pulls straight down (Σ|F| ≠ 0): then
 * Σ(xᵢ − p)Fᵢ = 0 → p = ΣxᵢFᵢ / ΣFᵢ, the weighted mean position. With an angled
 * pull in the mix the sin φ factors weight the terms differently, and the same
 * formula still works with Fᵢ·sin φᵢ as the weight — which is the algebra saying
 * "perpendicular distance" one more time.
 */
export function balancePivotX(loads: Load[], g = G_DEFAULT): number | null {
  let num = 0;
  let den = 0;
  for (const l of loads) {
    const { mag, angleDeg } = forceOf(l, g);
    const w = mag * Math.sin(angleDeg * DEG);
    num += l.x * w;
    den += w;
  }
  return Math.abs(den) < 1e-9 ? null : num / den;
}

/**
 * The mass that would balance the beam if hung at `x`, kg. Negative means it
 * would have to push up, i.e. no hanging mass can fix it from there — a real
 * answer the sim reports rather than clamping.
 */
export function balancingMassAt(
  loads: Load[], pivotX: number, x: number, g = G_DEFAULT,
): number | null {
  const lever = x - pivotX;
  if (Math.abs(lever) < 1e-9) return null;      // on the pivot: no lever, no help
  // A hanging mass at x contributes lever·(mg)·sin 270° = −lever·m·g.
  return netTorque(loads, pivotX, g) / (lever * g);
}

/** The beam's own weight, as a load at its centre — off by default because a
 *  "light rod" is the standard first problem and adding an invisible term is
 *  how a first problem becomes unsolvable. */
export function beamWeightLoad(beamMass: number, length: number): Load {
  return { id: 'beam', x: length / 2, mass: beamMass, label: 'Beam' };
}
