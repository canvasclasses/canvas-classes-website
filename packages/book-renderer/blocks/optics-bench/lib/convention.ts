/*
 * optics-bench/lib/convention.ts — THE SIGN CONVENTION, in one place.
 * ─────────────────────────────────────────────────────────────────────────────
 * A flipped sign is the single most common student error in optics, so it is
 * also the single most likely engine bug. Every conversion between "what the
 * author typed" and "what the formula needs" happens HERE and nowhere else, and
 * every formula in `formula.ts` names the convention it is written in.
 *
 * ── THE CONVENTION (NCERT Cartesian) ─────────────────────────────────────────
 *   • Light travels in the +x direction. Always. The engine never mirrors the
 *     bench to "make the numbers nicer".
 *   • Distances are measured FROM THE POLE / OPTICAL CENTRE of the element
 *     being used, +x to the right, −x to the left.
 *   • Heights are measured from the axis, +y up.
 *   • So an object placed to the LEFT of a lens has u < 0. Always. If you ever
 *     see a positive u for a real object in this engine, something is wrong.
 *
 * ── THE ONE PLACE TWO CONVENTIONS MEET: MIRRORS ──────────────────────────────
 * `OpticalElement.focalLength` is the AUTHORING field, and the frozen contract
 * defines it as CONVERGING-POSITIVE:
 *
 *      "Positive = converging lens / concave mirror, per the Cartesian rule."
 *
 * That is how every Indian textbook *speaks*: "a concave mirror of focal length
 * 10 cm". It is NOT how the mirror formula *computes*: with light travelling
 * +x, a concave mirror's focus lies on the incoming side, so its Cartesian
 * focal length is −10 cm.
 *
 * `cartesianFocal()` is the ONLY bridge between the two:
 *
 *      lens   : f_cartesian = +focalLength      (no flip — a converging lens
 *                                                really does focus downstream)
 *      mirror : f_cartesian = −focalLength      (a concave mirror focuses back
 *                                                upstream, so its f is negative)
 *
 * This is not a fudge — it IS the sign convention, made executable. The bench
 * UI shows both numbers side by side for exactly that reason: "you typed
 * f = 10 cm concave; in the Cartesian convention that is f = −10 cm, because
 * the focus is on the same side as the incoming light."
 *
 * Pure. No React, no DOM.
 */

import type { OpticalElement, ElementKind } from '../types';

/** cm. The near point of a normal eye — the reference distance for every
 *  angular magnification in the syllabus (D = 25 cm). */
export const NEAR_POINT_CM = 25;

/** Refractive index of the default surrounding medium (air). */
export const N_AIR = 1.0003;

/** cm. Anything past this counts as "at infinity" for imaging purposes. */
export const FAR_CM = 1e7;

/** Elements that bend light and therefore form images. */
const POWERED: ElementKind[] = ['thin-lens', 'thick-lens', 'mirror-spherical', 'mirror-plane', 'eye'];

export const isPowered = (k: ElementKind): boolean => POWERED.includes(k);
export const isLens = (k: ElementKind): boolean => k === 'thin-lens' || k === 'thick-lens';
export const isMirror = (k: ElementKind): boolean => k === 'mirror-spherical' || k === 'mirror-plane';

/**
 * The Cartesian (signed) focal length of an element, in cm.
 *
 * IN FORCE: NCERT Cartesian, light travels +x, distances from the pole.
 *   • lens   → +focalLength (converging lens f > 0, focus downstream)
 *   • mirror → −focalLength (concave mirror f < 0, focus upstream)
 *
 * Returns null for an element that has no focal length (a stop, a slab).
 */
export function cartesianFocal(el: OpticalElement): number | null {
  if (el.kind === 'mirror-plane') return Infinity; // a flat mirror never converges
  if (el.focalLength === undefined || el.focalLength === null) {
    // A spherical mirror may be authored by radius alone: f_cartesian = R/2.
    if (el.kind === 'mirror-spherical' && el.radius !== undefined) return el.radius / 2;
    return null;
  }
  if (isMirror(el.kind)) return -el.focalLength;
  return el.focalLength;
}

/**
 * The Cartesian radius of curvature of a mirror, in cm. Centre of curvature
 * sits at x = pole + R, so a concave mirror facing the incoming light has
 * R < 0 (its centre is upstream).
 *
 * IN FORCE: Cartesian. f_cartesian = R / 2 for a mirror.
 */
export function mirrorRadius(el: OpticalElement): number {
  if (el.radius !== undefined) return el.radius;
  const f = cartesianFocal(el);
  if (f === null || !Number.isFinite(f)) return Infinity;
  return 2 * f;
}

/**
 * The two surface radii of a real (thick) lens, Cartesian: the centre of
 * curvature of surface i sits at x = vertex_i + R_i.
 *
 * If the author gave a `radius`, the lens is equi-curved: R₁ = +R, R₂ = −R
 * (biconvex when R > 0, biconcave when R < 0). Otherwise the radii are derived
 * from the requested focal length through the thin-lens maker's formula
 *
 *      1/f = (n − 1) (1/R₁ − 1/R₂)      [IN FORCE: Cartesian]
 *
 * which for R₁ = −R₂ = R gives R = 2 (n − 1) f. So asking for a converging
 * f = 10 cm in n = 1.5 glass gives R = 10 cm, and the trace through those two
 * spheres reproduces f = 10 cm in the paraxial limit — that agreement is
 * asserted in `verify-optics-bench.mjs`, because it is the check that proves
 * the tracer and the formula are the same physics.
 */
export function lensRadii(el: OpticalElement, n: number): { R1: number; R2: number } {
  if (el.radius !== undefined && el.radius !== 0) {
    return { R1: el.radius, R2: -el.radius };
  }
  const f = cartesianFocal(el) ?? 10;
  const R = 2 * (n - 1) * f;
  return { R1: R, R2: -R };
}

/**
 * Axial thickness of a real lens, cm — the gap between its two vertices.
 *
 * Not cosmetic: it is what makes the two spherical surfaces sit at different x,
 * which is what makes the trace a real two-surface trace rather than a thin
 * lens wearing a thick coat.
 *
 * Convex faces bulge outward by their sagitta s = |R| − √(R² − a²), so a
 * biconvex lens is s₁ + s₂ thicker at the centre than at its rim. A concave
 * face does the opposite, and the lens is held at a thin `EDGE` centre.
 */
/**
 * Rim thickness, cm. SCALED to the aperture rather than fixed, for two
 * reasons that turn out to be the same reason:
 *   • a 6-mm-wide lens drawn 3.5 mm thick looks like a marble, and
 *   • a lens whose thickness is a large fraction of its diameter is not
 *     thin, so its principal planes separate and the traced image lands
 *     ~1.3% away from the thin-lens answer.
 * With the edge proportional, a narrow (paraxial) lens IS thin, and the trace
 * reproduces `1/v − 1/u = 1/f` to about 0.15% — which is the agreement
 * `verify-optics-bench.mjs` asserts, and the whole argument that the tracer
 * and the formula are the same physics.
 */
export const EDGE_FRAC = 0.12;
export const EDGE_MIN_CM = 0.04;
export const EDGE_MAX_CM = 0.4;

export function edgeThickness(aperture: number): number {
  return Math.max(EDGE_MIN_CM, Math.min(EDGE_MAX_CM, EDGE_FRAC * aperture));
}

export function lensThickness(R1: number, R2: number, aperture: number): number {
  const sag = (R: number) => {
    const r = Math.abs(R);
    if (!Number.isFinite(r) || r <= aperture) return 0;
    return r - Math.sqrt(r * r - aperture * aperture);
  };
  // Front face bulges upstream when R1 > 0; back face bulges downstream when
  // R2 < 0. Only outward bulges add axial thickness.
  const edge = edgeThickness(aperture);
  const t = (R1 > 0 ? sag(R1) : 0) + (R2 < 0 ? sag(R2) : 0);
  return Math.max(edge, t + edge);
}

/**
 * Object distance u, in cm, Cartesian, measured from the element's pole.
 * A real object upstream of the element always gives u < 0.
 */
export const objectDistance = (objectX: number, poleX: number): number => objectX - poleX;

/** Image position on the bench from a Cartesian image distance v. */
export const imageX = (v: number, poleX: number): number => poleX + v;

/** Human-readable statement of what a signed distance means, for the readout
 *  panel. Students lose marks on the sign long before they lose them on the
 *  arithmetic, so the sim always says it out loud. */
export function explainSign(quantity: 'u' | 'v' | 'f', value: number, kind: ElementKind): string {
  const side = value < 0 ? 'left of' : 'right of';
  const mirror = isMirror(kind);
  if (quantity === 'u') {
    return `u = ${fmtCm(value)} — negative because the object is ${side} the pole and light travels to the right.`;
  }
  if (quantity === 'v') {
    if (mirror) {
      return value < 0
        ? `v = ${fmtCm(value)} — negative, so the image is in FRONT of the mirror: real, and you could catch it on a card.`
        : `v = ${fmtCm(value)} — positive, so the image is BEHIND the mirror: virtual, no light actually goes there.`;
    }
    return value > 0
      ? `v = ${fmtCm(value)} — positive, so the image is on the far side: real, and a screen there would show it.`
      : `v = ${fmtCm(value)} — negative, so the image is back on the object's side: virtual, a construction, not light.`;
  }
  return mirror
    ? `f = ${fmtCm(value)} in the Cartesian convention — a concave mirror's focus is on the incoming side, so its f is negative.`
    : `f = ${fmtCm(value)} — positive for a converging lens, because it focuses light downstream.`;
}

export const fmtCm = (x: number, dp = 2): string =>
  `${x > 0 ? '+' : ''}${Number.isFinite(x) ? x.toFixed(dp) : '∞'} cm`;
