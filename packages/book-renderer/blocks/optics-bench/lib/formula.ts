/*
 * optics-bench/lib/formula.ts — the paraxial formulas, for READOUTS only.
 * ─────────────────────────────────────────────────────────────────────────────
 * These are the numbers a student writes in an exam. They are NOT what draws
 * the picture — the picture comes from `trace.ts`, ray by ray. Keeping the two
 * apart is deliberate: where they disagree (a wide lens, a big mirror) the
 * disagreement IS spherical aberration, and the sim shows it rather than hiding
 * it behind a formula that was only ever true near the axis.
 *
 * EVERY formula below states the convention it is written in. Pure — no React,
 * no DOM.
 */

import { NEAR_POINT_CM } from './convention';

// ── Thin lens ────────────────────────────────────────────────────────────────

export interface ImageNumbers {
  /** Cartesian image distance from the pole, cm. null ⇒ image at infinity. */
  v: number | null;
  /** Transverse magnification m = h'/h. Negative ⇒ inverted. */
  m: number | null;
  real: boolean;
  inverted: boolean;
}

/**
 * Thin lens.  IN FORCE: NCERT Cartesian, light travels +x, distances from the
 * optical centre.
 *
 *      1/v − 1/u = 1/f          m = v/u
 *
 * Worked check used by the verifier: f = +10, u = −30
 *      1/v = 1/10 + 1/(−30) = (3 − 1)/30 = 2/30  →  v = +15
 *      m   = 15 / (−30) = −0.5                    →  real, inverted, half size
 *
 * And the other side of the focus: f = +10, u = −5
 *      1/v = 1/10 − 1/5 = −1/10                   →  v = −10
 *      m   = (−10)/(−5) = +2                      →  virtual, erect, twice size
 */
export function thinLensImage(u: number, f: number): ImageNumbers {
  if (!Number.isFinite(f) || f === 0) return { v: null, m: null, real: false, inverted: false };
  const invV = 1 / f + 1 / u;
  if (Math.abs(invV) < 1e-12) return { v: null, m: null, real: false, inverted: false };
  const v = 1 / invV;
  const m = v / u;
  // With light travelling +x, a lens image at v > 0 is downstream: real.
  return { v, m, real: v > 0, inverted: m < 0 };
}

/**
 * Spherical mirror.  IN FORCE: NCERT Cartesian, light travels +x, distances
 * from the pole. NOTE the sign of f differs from the authoring field — see
 * `convention.ts`. A concave mirror is f_cartesian < 0.
 *
 *      1/v + 1/u = 1/f          f = R/2          m = −v/u
 *
 * Worked check used by the verifier: f = −10 (a 10 cm concave mirror), u = −30
 *      1/v = 1/(−10) − 1/(−30) = −1/10 + 1/30 = −2/30  →  v = −15
 *      m   = −(−15)/(−30) = −0.5                        →  real, inverted
 * v < 0 means the image sits in FRONT of the mirror, where the light actually
 * went — which is what "real" means for a mirror.
 */
export function mirrorImage(u: number, f: number): ImageNumbers {
  if (f === 0) return { v: null, m: null, real: false, inverted: false };
  if (!Number.isFinite(f)) {
    // Plane mirror: v = −u, m = +1. Always virtual, always erect, always
    // laterally the same size — the one case with no arithmetic at all.
    return { v: -u, m: 1, real: false, inverted: false };
  }
  const invV = 1 / f - 1 / u;
  if (Math.abs(invV) < 1e-12) return { v: null, m: null, real: false, inverted: false };
  const v = 1 / invV;
  const m = -v / u;
  return { v, m, real: v < 0, inverted: m < 0 };
}

/**
 * Lens maker's formula.  IN FORCE: Cartesian; R_i is measured from the vertex
 * of surface i, centre of curvature at x = vertex + R.
 *
 *      1/f = (n_lens/n_medium − 1) (1/R₁ − 1/R₂)
 *
 * The n_medium term is the whole content of the "does a lens still work under
 * water" question: put n_medium = 1.33 and an f = 10 cm crown lens becomes
 * roughly f = 39 cm — same glass, same curvature, four times weaker.
 */
export function lensMakerFocal(n: number, R1: number, R2: number, nMedium = 1): number {
  const rel = n / nMedium - 1;
  const c1 = Number.isFinite(R1) && R1 !== 0 ? 1 / R1 : 0;
  const c2 = Number.isFinite(R2) && R2 !== 0 ? 1 / R2 : 0;
  const invF = rel * (c1 - c2);
  return Math.abs(invF) < 1e-12 ? Infinity : 1 / invF;
}

/**
 * Thick-lens focal length, measured from the principal planes.
 *
 *      1/f = (n−1)[ 1/R₁ − 1/R₂ + (n−1) d / (n R₁ R₂) ]
 *
 * Used by the verifier so the "trace agrees with the formula" check compares
 * against the RIGHT number for a lens of finite thickness rather than against a
 * thin-lens idealisation the traced glass was never going to match.
 */
export function thickLensFocal(n: number, R1: number, R2: number, d: number): number {
  const invF = (n - 1) * (1 / R1 - 1 / R2 + ((n - 1) * d) / (n * R1 * R2));
  return Math.abs(invF) < 1e-12 ? Infinity : 1 / invF;
}

/** Power in dioptres from a focal length in cm. P = 100/f(cm). */
export const dioptres = (fCm: number): number => (Number.isFinite(fCm) && fCm !== 0 ? 100 / fCm : 0);

/**
 * Two thin lenses separated by d, as one equivalent lens.
 *      1/F = 1/f₁ + 1/f₂ − d/(f₁ f₂)
 * IN FORCE: Cartesian, both f signed.
 */
export function combinedFocal(f1: number, f2: number, d: number): number {
  const invF = 1 / f1 + 1 / f2 - d / (f1 * f2);
  return Math.abs(invF) < 1e-12 ? Infinity : 1 / invF;
}

// ── Refraction at a plane boundary ───────────────────────────────────────────

/**
 * Critical angle, degrees.  θ_c = asin(n₂/n₁), defined only when n₁ > n₂ —
 * light must be trying to leave the DENSER medium. Returns null otherwise,
 * which is the engine's way of saying the `tir_without_denser_medium`
 * misconception is a category error, not a near miss.
 *
 * Verifier check: n₁ = 1.5, n₂ = 1  →  asin(1/1.5) = 41.8103°.
 */
export function criticalAngleDeg(n1: number, n2: number): number | null {
  if (n1 <= n2) return null;
  return (Math.asin(n2 / n1) * 180) / Math.PI;
}

/**
 * Lateral shift of a ray through a parallel-sided slab of thickness t.
 *      shift = t · sin(i − r) / cos r          with  sin i = n sin r
 * The emergent ray is PARALLEL to the incident one — displaced, never bent.
 * That "parallel but moved sideways" is the whole result, and it is also what
 * the trace produces without being told to.
 */
export function slabLateralShift(incidenceDeg: number, n: number, t: number): number {
  const i = (incidenceDeg * Math.PI) / 180;
  const sinR = Math.sin(i) / n;
  if (Math.abs(sinR) > 1) return 0;
  const r = Math.asin(sinR);
  return (t * Math.sin(i - r)) / Math.cos(r);
}

/** Apparent depth of an object seen through a denser medium: d/n. The coin in
 *  the beaker, and why a river looks shallower than it is. */
export const apparentDepth = (realDepth: number, n: number): number => realDepth / n;

// ── Prism ────────────────────────────────────────────────────────────────────

/**
 * Prism deviation for a given angle of incidence.
 *      r₁ = asin(sin i₁ / n),  r₂ = A − r₁,  sin i₂ = n sin r₂
 *      δ  = i₁ + i₂ − A
 * Returns null when r₂ exceeds the critical angle — the ray TIRs at the second
 * face and never emerges, which is a real and visible outcome on the bench.
 */
export function prismDeviationDeg(i1Deg: number, A: number, n: number): number | null {
  const i1 = (i1Deg * Math.PI) / 180;
  const Ar = (A * Math.PI) / 180;
  const r1 = Math.asin(Math.min(1, Math.sin(i1) / n));
  const r2 = Ar - r1;
  const s2 = n * Math.sin(r2);
  if (Math.abs(s2) > 1) return null; // TIR at the exit face
  const i2 = Math.asin(s2);
  return ((i1 + i2 - Ar) * 180) / Math.PI;
}

/**
 * Minimum deviation.  At δ_min the ray runs parallel to the base, i₁ = i₂ and
 * r₁ = r₂ = A/2, so
 *      n = sin((A + δ_min)/2) / sin(A/2)
 * Verifier check: A = 60°, n = 1.5 → sin((60+δ)/2) = 0.75 → δ_min = 37.18°.
 */
export function minDeviationDeg(A: number, n: number): number {
  const Ar = (A * Math.PI) / 180;
  const s = n * Math.sin(Ar / 2);
  if (s > 1) return NaN; // no ray can traverse this prism
  return ((2 * Math.asin(s) - Ar) * 180) / Math.PI;
}

/** Incidence angle that produces minimum deviation: i₁ = (A + δ_min)/2. */
export const minDeviationIncidenceDeg = (A: number, n: number): number => (A + minDeviationDeg(A, n)) / 2;

/**
 * Cauchy dispersion: n(λ) = n_D + B (1/λ² − 1/λ_D²), λ in nm.
 * B ≈ 4200 nm² is a crown-glass fit (Abbe V ≈ 64): it makes n_F − n_C ≈ 0.008,
 * which is the textbook magnitude, so the violet ray really does deviate more
 * than the red one by the amount a real prism gives.
 */
export const CAUCHY_B_CROWN = 4200;
export const LAMBDA_D = 589.3;

export function indexAt(lambdaNm: number, nD: number, B = CAUCHY_B_CROWN): number {
  return nD + B * (1 / (lambdaNm * lambdaNm) - 1 / (LAMBDA_D * LAMBDA_D));
}

/** Angular dispersion between two wavelengths through a prism, degrees. */
export function angularDispersionDeg(A: number, nD: number, l1: number, l2: number, B = CAUCHY_B_CROWN): number {
  const d1 = minDeviationDeg(A, indexAt(l1, nD, B));
  const d2 = minDeviationDeg(A, indexAt(l2, nD, B));
  return d1 - d2;
}

// ── Instruments ──────────────────────────────────────────────────────────────

/**
 * Simple magnifier (a lens used as a magnifying glass).
 *   image at infinity (relaxed eye):  M = D/f
 *   image at the near point:          M = 1 + D/f
 * IN FORCE: D = 25 cm, f in cm, both positive for a converging lens.
 */
export const magnifierPower = (f: number, relaxed = true, D = NEAR_POINT_CM): number =>
  relaxed ? D / f : 1 + D / f;

/**
 * Compound microscope, normal adjustment (final image at infinity).
 *      M = m_objective × M_eyepiece = (v₀/u₀) × (D/f_e)
 * The product is the point. Two stages of ×5 is ×25, not ×10 — and the sim
 * shows it by drawing the intermediate image the second lens is looking at.
 */
export function microscopePower(mObjective: number, fEyepiece: number, D = NEAR_POINT_CM): number {
  return mObjective * (D / fEyepiece);
}

/**
 * Refracting telescope, normal adjustment.
 *      |M| = f_o / f_e,  tube length = f_o + f_e,  image inverted
 * Transverse magnification is meaningless here — the object is at infinity and
 * has no height. That confusion is the `telescope_magnifies_like_microscope`
 * misconception, and the readout panel names it.
 */
export const telescopePower = (fObjective: number, fEyepiece: number): number => fObjective / fEyepiece;
export const telescopeTubeLength = (fObjective: number, fEyepiece: number): number => fObjective + fEyepiece;

/**
 * Spectacle lens for a myopic eye whose far point is at `farPointCm` in front
 * of it: the lens must image infinity onto the far point, so f = −farPoint.
 * A far point of 50 cm needs f = −50 cm, i.e. −2.0 D.
 */
export const myopiaCorrection = (farPointCm: number): number => -Math.abs(farPointCm);

/**
 * Spectacle lens for a hypermetropic eye whose near point has receded to
 * `nearPointCm`: the lens must image an object at D onto the near point.
 *      1/f = 1/(−nearPoint) − 1/(−D)
 */
export function hypermetropiaCorrection(nearPointCm: number, D = NEAR_POINT_CM): number {
  const invF = 1 / -nearPointCm - 1 / -D;
  return Math.abs(invF) < 1e-12 ? Infinity : 1 / invF;
}

/** f-number N = f/aperture-diameter. Halving the diameter quarters the light. */
export const fNumber = (f: number, diameter: number): number => (diameter > 0 ? f / diameter : Infinity);

/** Relative brightness at the image, ∝ (1/N)². Doubling N loses two stops. */
export const relativeBrightness = (N: number): number => (N > 0 ? 1 / (N * N) : 0);
