/*
 * optics-bench/lib/image.ts — where a bundle of rays says the image is.
 * ─────────────────────────────────────────────────────────────────────────────
 * The formula panel gets its numbers from `formula.ts`. THIS module gets them
 * from the rays themselves, by least-squares intersection of the emergent
 * bundle. Two consequences, both wanted:
 *
 *   • REAL vs VIRTUAL is decided by arithmetic, not by a rule. If the crossing
 *     point lies FORWARD along every emergent ray, light really goes there and
 *     the image is real. If it lies BEHIND every ray, no light goes there at
 *     all and the image is a back-extension — a construction line, which the
 *     renderer must dash. Students who think a virtual image "isn't there" are
 *     half right and the dashing is what makes the other half visible.
 *   • ABERRATION is whatever is left over. If the bundle does not meet at a
 *     point, the residual is reported instead of being averaged away, and the
 *     readout says the formula's single answer is an approximation here.
 *
 * Pure. No React, no DOM.
 */

import type { Vec2, ImageResult } from '../types';
import { cross, dot, sub, unit } from './vec';
import { NEAR_POINT_CM } from './convention';

export interface BundleLine {
  /** A point the emergent ray passes through. */
  p: Vec2;
  /** Unit direction of travel. */
  d: Vec2;
}

export interface BundleFit {
  /** Least-squares crossing point, or null when the rays are parallel. */
  point: Vec2 | null;
  /** RMS perpendicular miss distance, cm. 0 for a perfect point image. */
  rms: number;
  /** true when the emergent rays are (within tolerance) parallel: the image is
   *  at infinity, which is the NORMAL state for a telescope or a relaxed eye. */
  parallel: boolean;
  /** How many rays have the crossing point ahead of them. */
  forward: number;
  total: number;
  /** Mean direction — the "chief ray" direction, used for angular magnification. */
  meanDir: Vec2;
  /** Largest angular spread within the bundle, radians. */
  spread: number;
}

/** Rays whose directions differ by less than this are treated as parallel. */
export const PARALLEL_RAD = 2e-4;

/**
 * Least-squares crossing point of a set of lines.
 *
 * Minimises Σ |(I − dᵢdᵢᵀ)(x − pᵢ)|². In 2-D, (I − ddᵀ) = [[dy², −dxdy],
 * [−dxdy, dx²]], so the normal equations are a 2×2 solve and there is no
 * iteration and no tuning constant anywhere in it.
 */
export function fitBundle(lines: BundleLine[]): BundleFit {
  const n = lines.length;
  const empty: BundleFit = {
    point: null, rms: 0, parallel: true, forward: 0, total: n,
    meanDir: { x: 1, y: 0 }, spread: 0,
  };
  if (n === 0) return empty;

  let mx = 0, my = 0;
  for (const l of lines) { mx += l.d.x; my += l.d.y; }
  const meanDir = unit({ x: mx, y: my });

  let spread = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      spread = Math.max(spread, Math.abs(cross(lines[i].d, lines[j].d)));
    }
  }
  if (n === 1 || spread < PARALLEL_RAD) {
    return { ...empty, meanDir, spread, parallel: true };
  }

  let a = 0, b = 0, c = 0, e = 0, f = 0;
  for (const l of lines) {
    const { x: dx, y: dy } = l.d;
    const p11 = dy * dy, p12 = -dx * dy, p22 = dx * dx;
    a += p11; b += p12; c += p22;
    e += p11 * l.p.x + p12 * l.p.y;
    f += p12 * l.p.x + p22 * l.p.y;
  }
  const det = a * c - b * b;
  if (Math.abs(det) < 1e-12) return { ...empty, meanDir, spread, parallel: true };

  const point: Vec2 = { x: (e * c - b * f) / det, y: (a * f - b * e) / det };

  let sum = 0, forward = 0;
  for (const l of lines) {
    const r = sub(point, l.p);
    const along = dot(r, l.d);
    if (along > 0) forward++;
    const perpMiss = Math.abs(cross(r, l.d)); // |r| sin θ, d is unit
    sum += perpMiss * perpMiss;
  }
  return { point, rms: Math.sqrt(sum / n), parallel: false, forward, total: n, meanDir, spread };
}

export interface ImageOptions {
  /** Fractional residual above which the bundle is called aberrated. */
  aberrationFrac?: number;
  /** cm. Floor for the same test, so a tiny image is not called aberrated for
   *  a residual smaller than the line width it will be drawn with. */
  aberrationFloor?: number;
  /**
   * true when the OBJECT sat on the axis, so the `tip` bundle is the invisible
   * probe rather than a real object tip. The image of an axial point is an
   * axial point, so its height must be reported as 0 — only the magnification
   * comes from the probe.
   */
  axialObject?: boolean;
  /**
   * cm. An "image" further away than this is reported as being at infinity.
   *
   * Not a fudge — a floating-point one. A telescope in normal adjustment emits a
   * bundle that is parallel to about a part in 10⁵, and that residual fits a
   * crossing point nineteen metres behind the bench. Reporting that as a virtual
   * image is technically defensible and practically useless: it puts a number on
   * screen that changes wildly with the last digit of the glass path, and it
   * draws construction lines off to the horizon.
   */
  farLimit?: number;
}

/**
 * Turn a fitted bundle (plus the on-axis bundle, which locates the axis point)
 * into the contract's `ImageResult`.
 *
 * `objectY` is the height of the object point the TIP bundle came from, so the
 * magnification is measured, not computed: m = y_image / y_object.
 */
export function imageFromFits(
  tip: BundleFit,
  base: BundleFit | null,
  objectY: number,
  opts: ImageOptions = {},
): ImageResult | null {
  const {
    aberrationFrac = 0.004, aberrationFloor = 0.01, axialObject = false, farLimit = 5000,
  } = opts;

  // One ray is not a bundle. A single-ray archetype — the slab, the critical
  // angle, one wavelength through a prism — is about a PATH, not an image, and
  // inventing one from a lone line would put a confident number on screen that
  // means nothing.
  if (tip.total < 2) return null;

  const tooFar = !!tip.point && (Math.abs(tip.point.x) > farLimit || Math.abs(tip.point.y) > farLimit);
  if (tip.parallel || !tip.point || tooFar) {
    // Rays leave parallel: the image is at infinity. Not a failure — it is what
    // a telescope in normal adjustment and a relaxed eye both do.
    return {
      x: null, y: null, magnification: null,
      real: false, inverted: false,
      angular: undefined, aberrated: false,
    };
  }

  // `v` is an AXIAL quantity, so it comes from the axial bundle whenever there
  // is one. Reading it off the tip bundle instead would fold field curvature
  // into a number the readout calls "image distance", which is exactly the kind
  // of quiet wrongness the formula panel would then be blamed for.
  const axial = base && !base.parallel && base.point ? base : tip;
  const anchor = base?.point ?? { x: tip.point.x, y: 0 };
  const height = tip.point.y - anchor.y;
  const m = Math.abs(objectY) > 1e-9 ? height / objectY : null;

  const scale = Math.max(Math.abs(axial.point!.x - anchor.x), Math.abs(axial.point!.x), 1);
  const worst = Math.max(tip.rms, axial.rms);
  const aberrated = worst > Math.max(aberrationFloor, aberrationFrac * scale);

  return {
    x: axial.point!.x,
    y: axialObject ? anchor.y : tip.point.y,
    magnification: m,
    // Real ⇔ every emergent ray actually reaches the crossing point.
    real: axial.forward === axial.total,
    inverted: m !== null ? m < 0 : false,
    aberrated,
  };
}

/**
 * APPARENT ANGULAR POSITION of an emergent bundle, radians.
 *
 * ── The sign rule, stated once, because it is the trap ───────────────────────
 * The eye sits downstream and looks BACK along the light. A bundle travelling
 * to the right with slope s' therefore appears to come from the direction −s'.
 * So the apparent angular position is −s', not +s'.
 *
 * Check it against the two cases everyone knows:
 *   • Magnifier, object height h > 0 at the focus of f > 0. Emergent slope is
 *     s' = −h/f, so the apparent angle is +h/f: ABOVE the axis, erect, and
 *     M = (h/f)/(h/D) = D/f. Correct.
 *   • Telescope, f_o = 100, f_e = 5. Apparent-out / apparent-in = −f_o/f_e =
 *     −20: magnitude 20, and the minus sign IS the inverted image every student
 *     is told about. Correct.
 */
export function apparentAngle(dir: Vec2): number {
  if (Math.abs(dir.x) < 1e-12) return dir.y > 0 ? -Math.PI / 2 : Math.PI / 2;
  const slope = dir.y / dir.x;
  return Math.atan(-slope * Math.sign(dir.x));
}

/**
 * Angular magnification.
 *
 *      M = tan(apparent angle through the instrument) / tan(angle unaided)
 *
 * "Unaided" means two different things, and which one applies is decided by the
 * object, not by a setting:
 *   • object at a finite distance → the eye would hold it at the near point,
 *     so tan α = h / D  with D = 25 cm;
 *   • object at infinity (a parallel beam) → the object already subtends an
 *     angle and that angle IS α.
 *
 * This is the number that matters for a telescope, where the object has no
 * height at all and transverse magnification is meaningless — the
 * `magnification_is_size_only` and `telescope_magnifies_like_microscope`
 * misconceptions in one function.
 */
export function angularMagnification(
  emergent: BundleFit,
  objectHeight: number,
  objectAngleRad: number | null,
  D = NEAR_POINT_CM,
): number | null {
  const out = Math.tan(apparentAngle(emergent.meanDir));
  if (objectAngleRad !== null) {
    const inTan = Math.tan(objectAngleRad);
    if (Math.abs(inTan) < 1e-12) return null;
    return out / inTan;
  }
  if (Math.abs(objectHeight) < 1e-12) return null;
  return out / (objectHeight / D);
}
