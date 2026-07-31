/*
 * mechanics-bench/lib/linalg.ts — dense linear solver for the E1 engine.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies. Verifiable by a plain node script.
 *
 * Every mechanics problem in this program reduces to one linear system: the
 * ΣF = ma equations (one per body per solved axis) stacked with the string
 * constraint equations, solved simultaneously for the accelerations and the
 * unknown tensions/normals. Solving them TOGETHER is what lets Pulley Lab
 * handle an arbitrary pulley graph instead of a lookup table of known cases.
 *
 * Gaussian elimination with partial pivoting. These systems are tiny (a hard
 * JEE pulley problem is under 12 unknowns), so clarity beats sophistication —
 * but the singular/ill-conditioned detection is load-bearing: an
 * under-determined scene must be REPORTED, never silently given a made-up
 * answer. See PHYSICS_SIMULATION_PROGRAM.md §9 ("no academic claim ships
 * unverified").
 */

/** Rows of coefficients. `A[i][j]` multiplies unknown j in equation i. */
export type Matrix = number[][];
export type Vector = number[];

export interface LinearSystem {
  /** n×n coefficient matrix. */
  A: Matrix;
  /** length-n right-hand side. */
  b: Vector;
  /** Human names for the unknowns, in column order — 'a_m1', 'T_s1', 'N_c1'. */
  names: string[];
}

export interface LinearSolution {
  /** unknown name → value. Empty when `singular`. */
  values: Record<string, number>;
  /** Raw solution vector, column order. */
  x: Vector;
  singular: boolean;
  /** Set when singular — which pivot failed, in human terms. */
  reason?: string;
  /** Rough condition indicator: smallest |pivot| encountered. */
  minPivot: number;
}

const EPS = 1e-9;

/**
 * Solve A x = b by Gaussian elimination with partial pivoting.
 *
 * Returns `singular: true` rather than throwing or returning garbage when the
 * system is under-determined — an over-constrained or contradictory scene is a
 * real authoring mistake we need to surface in the editor, not hide.
 */
export function solveLinear(sys: LinearSystem): LinearSolution {
  const n = sys.b.length;
  const names = sys.names;

  if (sys.A.length !== n || names.length !== n) {
    return {
      values: {}, x: [], singular: true, minPivot: 0,
      reason: `malformed system: A is ${sys.A.length}×${sys.A[0]?.length ?? 0}, b is ${n}, names is ${names.length}`,
    };
  }

  // Work on copies — callers reuse their matrices across frames.
  const M: Matrix = sys.A.map((row, i) => {
    if (row.length !== n) throw new Error(`row ${i} has ${row.length} columns, expected ${n}`);
    return [...row];
  });
  const rhs: Vector = [...sys.b];

  let minPivot = Infinity;

  for (let col = 0; col < n; col++) {
    // Partial pivot: the largest-magnitude candidate in this column.
    let pivotRow = col;
    let best = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      const v = Math.abs(M[r][col]);
      if (v > best) { best = v; pivotRow = r; }
    }

    if (best < EPS) {
      return {
        values: {}, x: [], singular: true, minPivot: 0,
        reason: `no pivot for "${names[col]}" — the system is under-determined. `
          + `Usually this means a body has no equation (check its dofDeg) or a `
          + `string constraint duplicates one already present.`,
      };
    }
    minPivot = Math.min(minPivot, best);

    if (pivotRow !== col) {
      [M[col], M[pivotRow]] = [M[pivotRow], M[col]];
      [rhs[col], rhs[pivotRow]] = [rhs[pivotRow], rhs[col]];
    }

    const p = M[col][col];
    for (let r = col + 1; r < n; r++) {
      const factor = M[r][col] / p;
      if (factor === 0) continue;
      for (let c = col; c < n; c++) M[r][c] -= factor * M[col][c];
      rhs[r] -= factor * rhs[col];
    }
  }

  // Back-substitution.
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let sum = rhs[r];
    for (let c = r + 1; c < n; c++) sum -= M[r][c] * x[c];
    x[r] = sum / M[r][r];
  }

  const values: Record<string, number> = {};
  names.forEach((nm, i) => { values[nm] = x[i]; });

  return { values, x, singular: false, minPivot };
}

// ── Builder ──────────────────────────────────────────────────────────────────

/**
 * Accumulates equations by unknown NAME so callers never hand-index columns.
 * The dynamics assembler adds ΣF = ma rows and the constraint deriver adds
 * length-invariance rows; both just name their unknowns and the builder lines
 * the columns up.
 */
export class SystemBuilder {
  private cols: string[] = [];
  private rows: { coeffs: Map<string, number>; rhs: number; label?: string }[] = [];

  /** Register an unknown up front (order affects only column order). */
  unknown(name: string): this {
    if (!this.cols.includes(name)) this.cols.push(name);
    return this;
  }

  /**
   * Add one equation: Σ coeffs[name]·name = rhs.
   * `label` is carried for debugging/ledger output only.
   */
  equation(coeffs: Record<string, number>, rhs: number, label?: string): this {
    const m = new Map<string, number>();
    for (const [name, c] of Object.entries(coeffs)) {
      if (c === 0) continue;
      this.unknown(name);
      m.set(name, (m.get(name) ?? 0) + c);
    }
    this.rows.push({ coeffs: m, rhs, label });
    return this;
  }

  get equationCount(): number { return this.rows.length; }
  get unknownCount(): number { return this.cols.length; }
  get unknownNames(): string[] { return [...this.cols]; }
  get labels(): (string | undefined)[] { return this.rows.map(r => r.label); }

  build(): LinearSystem {
    const names = [...this.cols];
    const A: Matrix = this.rows.map(row =>
      names.map(nm => row.coeffs.get(nm) ?? 0)
    );
    const b: Vector = this.rows.map(r => r.rhs);
    return { A, b, names };
  }

  /**
   * Solve, reporting a shape mismatch in the terms an author can act on.
   * A pulley scene with more unknowns than equations is missing a constraint;
   * more equations than unknowns means a duplicated one.
   */
  solve(): LinearSolution {
    if (this.rows.length !== this.cols.length) {
      const diff = this.cols.length - this.rows.length;
      return {
        values: {}, x: [], singular: true, minPivot: 0,
        reason: diff > 0
          ? `${this.cols.length} unknowns but only ${this.rows.length} equations — `
            + `${diff} constraint${diff > 1 ? 's are' : ' is'} missing. `
            + `Unknowns: ${this.cols.join(', ')}.`
          : `${this.rows.length} equations for ${this.cols.length} unknowns — `
            + `${-diff} redundant. A string constraint is probably duplicated.`,
      };
    }
    return solveLinear(this.build());
  }
}

// ── Small helpers used across the engine ─────────────────────────────────────

export const deg2rad = (d: number): number => (d * Math.PI) / 180;
export const rad2deg = (r: number): number => (r * 180) / Math.PI;

/** Unit vector along a direction given in degrees CCW from +x. */
export function dir(angleDeg: number): { x: number; y: number } {
  const r = deg2rad(angleDeg);
  return { x: Math.cos(r), y: Math.sin(r) };
}

/** Component of a force of magnitude `mag` at `angleDeg`, along `axisDeg`. */
export function along(mag: number, angleDeg: number, axisDeg: number): number {
  return mag * Math.cos(deg2rad(angleDeg - axisDeg));
}

/** Normalise to [0, 360). */
export function norm360(d: number): number {
  const m = d % 360;
  return m < 0 ? m + 360 : m;
}

/** Smallest absolute difference between two directions, in degrees (0..180). */
export function angleDiff(a: number, b: number): number {
  const d = Math.abs(norm360(a) - norm360(b)) % 360;
  return d > 180 ? 360 - d : d;
}

/** Round to `p` decimals — keeps readouts stable and comparisons clean. */
export const round = (v: number, p = 3): number => {
  const f = 10 ** p;
  return Math.round(v * f) / f;
};
