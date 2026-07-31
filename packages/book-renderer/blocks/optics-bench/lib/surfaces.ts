/*
 * optics-bench/lib/surfaces.ts — a bench of ELEMENTS becomes a list of SURFACES.
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the module that makes the tracer real rather than paraxial. Nothing
 * downstream knows what a "lens" is: it only knows about planes and spheres
 * that refract, reflect, absorb or stop. Every interesting behaviour therefore
 * has to fall OUT of the geometry rather than be written in:
 *
 *   • a ray beyond the clear aperture hits the MOUNT and stops. Not a special
 *     case — the mount is a surface.
 *   • a ray inside glass meeting a wall past the critical angle turns around.
 *     Not a special case — `refract()` has one branch and it is Snell's law
 *     failing to have a solution.
 *   • marginal rays on a wide lens cross the axis short of the paraxial focus.
 *     Not a special case — they are refracted by two SPHERES, and spheres do
 *     not focus perfectly. That is spherical aberration, and it is why the
 *     drawing may disagree with the formula panel.
 *
 * Pure. No React, no DOM.
 *
 * SIGN CONVENTION IN FORCE: NCERT Cartesian throughout — light travels +x,
 * distances from the pole, +y up. Conversions from the authoring fields happen
 * in `convention.ts` and are imported, never re-derived here.
 */

import type { OpticalElement, Bench, ElementKind, Vec2 } from '../types';
import {
  add, cross, dot, mul, perp, rotateAbout, sub, unit, EPS,
} from './vec';
import {
  cartesianFocal, lensRadii, lensThickness, mirrorRadius, N_AIR,
} from './convention';

/** What happens to a ray that lands INSIDE a surface's clear extent. */
export type SurfaceAction = 'refract' | 'reflect' | 'ideal-lens' | 'absorb' | 'aperture';

/** What the drawing layer should paint. Purely presentational — the tracer
 *  ignores it, but it means the renderer never has to guess. */
export type SurfaceRole = 'lens' | 'mirror' | 'stop' | 'screen' | 'glass' | 'retina' | 'inert';

export interface PlaneGeom {
  kind: 'plane';
  /** A point on the plane — also the centre of the clear extent. */
  point: Vec2;
  /** Unit normal. For a refracting surface this points AWAY FROM THE GLASS. */
  normal: Vec2;
}

export interface SphereGeom {
  kind: 'sphere';
  /** Centre of curvature. Cartesian: sits at vertex + R along the element axis. */
  centre: Vec2;
  radius: number;
  /** Unit vector from the centre of curvature toward the vertex. A hit counts
   *  only if it is on this side of the sphere — i.e. on the cap, not the far
   *  hemisphere. */
  vertexDir: Vec2;
  /** +1 when the outward (away-from-glass) normal is the radially OUTWARD one,
   *  −1 when it is the radially inward one. See `convention.ts`. */
  outwardSign: 1 | -1;
  /** The vertex itself, for drawing and for extent bookkeeping. */
  vertex: Vec2;
}

export interface Surface {
  id: string;
  elementId: string;
  elementKind: ElementKind;
  geom: PlaneGeom | SphereGeom;
  action: SurfaceAction;
  /**
   * What happens OUTSIDE the clear extent.
   *   'block' — there is a holder there; the ray stops ('missed-element').
   *   'pass'  — the surface simply isn't there; keep looking for the next one.
   * A lens in a bench holder blocks. The wall of a glass block does not.
   */
  mount: 'block' | 'pass';
  /** Half-height of the clear opening, measured perpendicular to the element
   *  axis from `centre`. */
  half: number;
  /** Centre of the clear opening. Offset it and you have covered half the lens
   *  with your hand — which is exactly how the `half-lens-covered` archetype is
   *  built, with no special code anywhere. */
  centre: Vec2;
  /** Refractive index on the side the outward normal points TOWARD. */
  nOutside?: number;
  /** Refractive index on the side the outward normal points AWAY from — the
   *  glass, for every element in this engine. */
  nInside?: number;
  /** Cartesian focal length, for 'ideal-lens' only. */
  f?: number;
  role: SurfaceRole;
}

export interface Hit {
  surface: Surface;
  t: number;
  point: Vec2;
  /** Unit normal AT THE HIT, oriented away from the glass (not yet flipped to
   *  face the ray — `trace.ts` does that, because only it knows the ray). */
  outward: Vec2;
  /** true when the hit lies inside the clear extent. */
  inExtent: boolean;
}

// ── Element → surfaces ───────────────────────────────────────────────────────

const DEFAULT_APERTURE = 3;
const DEFAULT_SLAB_LEN = 4;

/**
 * NOTE ON `radius` FOR FLAT ELEMENTS. A slab has no curvature, so its `radius`
 * field is otherwise dead. The engine repurposes it as the slab's LENGTH along
 * the axis (cm). That is documented here, in `types.ts` usage, and in every
 * archetype that builds one — an optical fibre is just a very long, very thin
 * slab, and modelling it that way is what makes its TIR real rather than drawn.
 */
export function slabLength(el: OpticalElement): number {
  return el.radius && el.radius > 0 ? el.radius : DEFAULT_SLAB_LEN;
}

/**
 * Half-width of a prism's base, from its half-height `a` and apex angle `A`.
 *
 * The apex sits at +a and the base at −a, so the apex-to-base HEIGHT is 2a, and
 * the half-base is (2a)·tan(A/2) — not a·tan(A/2). Getting that factor of two
 * wrong silently builds a 32° prism when the author asked for 60°, and every
 * deviation the sim then reports is right for a prism that is not on screen.
 * (It did, and the traced minimum deviation came out 16.96° against the 37.18°
 * the formula panel was printing. The trace was correct; the polygon was not.)
 */
export function prismHalfBase(halfHeight: number, apexDeg: number): number {
  return 2 * halfHeight * Math.tan((apexDeg * Math.PI) / 360);
}

/**
 * Where light first meets an element. For a lens or a stop that is just its x;
 * for a body with length — a glass block, a fibre, a prism — it is the leading
 * face. Aiming a beam at the CENTRE of a 60 cm fibre launches it through the
 * side wall instead of the end, which is a different experiment.
 */
export function entryX(el: OpticalElement): number {
  if (el.kind === 'slab') return el.x - slabLength(el) / 2;
  if (el.kind === 'prism') return el.x - prismHalfBase(el.aperture ?? DEFAULT_APERTURE, el.apexDeg ?? 60);
  return el.x;
}

export function buildSurfaces(bench: Bench): Surface[] {
  const nMed = bench.nMedium ?? N_AIR;
  const out: Surface[] = [];
  for (const el of bench.elements) out.push(...surfacesOf(el, nMed));
  return out;
}

export function surfacesOf(el: OpticalElement, nMedium: number): Surface[] {
  const yc = el.y ?? 0;
  const a = el.aperture ?? DEFAULT_APERTURE;
  const centre: Vec2 = { x: el.x, y: yc };
  const tilt = el.tiltDeg ?? 0;
  const axis = unit({ x: Math.cos((tilt * Math.PI) / 180), y: Math.sin((tilt * Math.PI) / 180) });

  switch (el.kind) {
    case 'thin-lens': {
      // ONE surface. The ideal-lens rule is exact for every incidence angle —
      // it is the Gaussian mapping, not a small-angle approximation — so the
      // only thing that "goes wrong" here is a ray missing the glass. That is
      // deliberate: `thin-lens` is the clean reference, `thick-lens` is the
      // honest one, and an archetype can offer both so the student sees the gap.
      const f = cartesianFocal(el) ?? 10;
      return [{
        id: `${el.id}:lens`, elementId: el.id, elementKind: el.kind,
        geom: { kind: 'plane', point: centre, normal: axis },
        action: 'ideal-lens', mount: 'block', half: a, centre, f, role: 'lens',
      }];
    }

    case 'thick-lens': {
      const n = el.n ?? 1.5;
      const { R1, R2 } = lensRadii(el, n);
      const d = lensThickness(R1, R2, a);
      const v1 = add(centre, mul(axis, -d / 2));
      const v2 = add(centre, mul(axis, +d / 2));
      return [
        // Front surface: glass lies downstream (+axis).
        sphereSurface(`${el.id}:s1`, el, v1, R1, axis, +1, a, nMedium, n, 'glass'),
        // The holder. Sits between the two vertices, so it can never tie with
        // either cap for the nearest-hit test.
        {
          id: `${el.id}:mount`, elementId: el.id, elementKind: el.kind,
          geom: { kind: 'plane', point: centre, normal: axis },
          action: 'aperture', mount: 'block', half: a, centre, role: 'inert',
        },
        // Back surface: glass lies upstream (−axis).
        sphereSurface(`${el.id}:s2`, el, v2, R2, axis, -1, a, nMedium, n, 'glass'),
      ];
    }

    case 'mirror-spherical': {
      const R = mirrorRadius(el);
      if (!Number.isFinite(R)) {
        return [planeMirror(el, centre, axis, a)];
      }
      return [
        {
          // The holder, at the pole. An off-aperture ray is stopped by it; the
          // axial ray ties with the cap and the tie-break in `trace.ts` gives
          // the cap priority, because an aperture that passes light is not an
          // event and must never consume a step.
          id: `${el.id}:mount`, elementId: el.id, elementKind: el.kind,
          geom: { kind: 'plane', point: centre, normal: axis },
          action: 'aperture', mount: 'block', half: a, centre, role: 'inert',
        },
        mirrorSphere(el, centre, R, axis, a),
      ];
    }

    case 'mirror-plane':
      return [planeMirror(el, centre, axis, a)];

    case 'aperture':
      return [{
        id: `${el.id}:stop`, elementId: el.id, elementKind: el.kind,
        geom: { kind: 'plane', point: centre, normal: axis },
        action: 'aperture', mount: 'block', half: a, centre, role: 'stop',
      }];

    case 'screen':
      // A screen absorbs what lands on it and does nothing at all to what
      // misses — a sensor is not a wall.
      return [{
        id: `${el.id}:screen`, elementId: el.id, elementKind: el.kind,
        geom: { kind: 'plane', point: centre, normal: axis },
        action: 'absorb', mount: 'pass', half: a, centre, role: 'screen',
      }];

    case 'slab': {
      const n = el.n ?? 1.5;
      const L = slabLength(el);
      const poly: Vec2[] = [
        { x: el.x - L / 2, y: yc - a },
        { x: el.x + L / 2, y: yc - a },
        { x: el.x + L / 2, y: yc + a },
        { x: el.x - L / 2, y: yc + a },
      ].map((p) => rotateAbout(p, centre, tilt));
      return polygonSurfaces(el, poly, nMedium, n);
    }

    case 'prism': {
      const n = el.n ?? 1.5;
      const A = el.apexDeg ?? 60;
      const halfBase = prismHalfBase(a, A);
      // Apex up, base down, wound CCW so `outwardNormal` points out of the glass.
      const poly: Vec2[] = [
        { x: el.x - halfBase, y: yc - a },
        { x: el.x + halfBase, y: yc - a },
        { x: el.x, y: yc + a },
      ].map((p) => rotateAbout(p, centre, tilt));
      return polygonSurfaces(el, poly, nMedium, n);
    }

    case 'eye': {
      // The eye is a PRIMITIVE, not a flag: a lens welded to a screen at a
      // fixed axial length. That weld is the entire difference between an eye
      // and a camera — a camera focuses by moving the film, an eye cannot, so
      // it has to change the lens instead. Structural recognition reads exactly
      // this and nothing else. `radius` carries the axial length in cm.
      const f = cartesianFocal(el) ?? 2.5;
      const axial = el.radius && el.radius > 0 ? el.radius : 2.5;
      const retina = add(centre, mul(axis, axial));
      return [
        {
          id: `${el.id}:lens`, elementId: el.id, elementKind: el.kind,
          geom: { kind: 'plane', point: centre, normal: axis },
          action: 'ideal-lens', mount: 'block', half: a, centre, f, role: 'lens',
        },
        {
          id: `${el.id}:retina`, elementId: el.id, elementKind: el.kind,
          geom: { kind: 'plane', point: retina, normal: axis },
          action: 'absorb', mount: 'pass', half: a * 1.35, centre: retina, role: 'retina',
        },
      ];
    }

    case 'grating':
      // Inert to the ray tracer. Diffraction is not a ray phenomenon, and
      // pretending otherwise is how a sim ends up teaching that light "bends
      // round" a slit by refraction. `wave.ts` handles it honestly instead.
      return [{
        id: `${el.id}:grating`, elementId: el.id, elementKind: el.kind,
        geom: { kind: 'plane', point: centre, normal: axis },
        action: 'aperture', mount: 'pass', half: a, centre, role: 'inert',
      }];

    default:
      return [];
  }
}

function planeMirror(el: OpticalElement, centre: Vec2, axis: Vec2, a: number): Surface {
  return {
    id: `${el.id}:mirror`, elementId: el.id, elementKind: el.kind,
    geom: { kind: 'plane', point: centre, normal: axis },
    action: 'reflect', mount: 'block', half: a, centre, role: 'mirror',
  };
}

function mirrorSphere(el: OpticalElement, vertex: Vec2, R: number, axis: Vec2, a: number): Surface {
  // Cartesian: centre of curvature at vertex + R along the axis. R < 0 for a
  // concave mirror facing the incoming light, so its centre is UPSTREAM — which
  // is exactly the geometric statement that its focal length is negative.
  const c = add(vertex, mul(axis, R));
  return {
    id: `${el.id}:cap`, elementId: el.id, elementKind: el.kind,
    geom: {
      kind: 'sphere', centre: c, radius: Math.abs(R),
      vertexDir: unit(sub(vertex, c)), outwardSign: 1, vertex,
    },
    action: 'reflect', mount: 'pass', half: a, centre: vertex, role: 'mirror',
  };
}

function sphereSurface(
  id: string, el: OpticalElement, vertex: Vec2, R: number, axis: Vec2,
  glassDirX: 1 | -1, a: number, nOutside: number, nInside: number, role: SurfaceRole,
): Surface {
  const c = add(vertex, mul(axis, R));
  // outwardSign = sign(R) · glassDir. Derivation and the four cases it has to
  // get right (biconvex front/back, meniscus back, biconcave) are in
  // `convention.ts`. Getting this backwards swaps n₁ and n₂ and silently turns
  // a converging lens into a diverging one.
  const s = (R >= 0 ? 1 : -1) * glassDirX;
  return {
    id, elementId: el.id, elementKind: el.kind,
    geom: {
      kind: 'sphere', centre: c, radius: Math.abs(R),
      vertexDir: unit(sub(vertex, c)), outwardSign: s === 1 ? 1 : -1, vertex,
    },
    action: 'refract', mount: 'pass', half: a, centre: vertex,
    nOutside, nInside, role,
  };
}

/** Convex polygon (wound CCW) → one refracting plane per edge. */
function polygonSurfaces(el: OpticalElement, poly: Vec2[], nOutside: number, nInside: number): Surface[] {
  const out: Surface[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const e = sub(q, p);
    const L = Math.hypot(e.x, e.y);
    if (L < EPS) continue;
    // CCW winding ⇒ the outward normal of edge p→q is (dy, −dx)/L.
    const normal: Vec2 = { x: e.y / L, y: -e.x / L };
    const mid: Vec2 = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    out.push({
      id: `${el.id}:f${i}`, elementId: el.id, elementKind: el.kind,
      geom: { kind: 'plane', point: mid, normal },
      action: 'refract', mount: 'pass', half: L / 2, centre: mid,
      nOutside, nInside, role: 'glass',
    });
  }
  return out;
}

/** The polygon a slab or prism occupies — for drawing the glass body. */
export function elementPolygon(el: OpticalElement): Vec2[] | null {
  const yc = el.y ?? 0;
  const a = el.aperture ?? DEFAULT_APERTURE;
  const centre: Vec2 = { x: el.x, y: yc };
  const tilt = el.tiltDeg ?? 0;
  if (el.kind === 'slab') {
    const L = slabLength(el);
    return [
      { x: el.x - L / 2, y: yc - a }, { x: el.x + L / 2, y: yc - a },
      { x: el.x + L / 2, y: yc + a }, { x: el.x - L / 2, y: yc + a },
    ].map((p) => rotateAbout(p, centre, tilt));
  }
  if (el.kind === 'prism') {
    const hb = prismHalfBase(a, el.apexDeg ?? 60);
    return [
      { x: el.x - hb, y: yc - a }, { x: el.x + hb, y: yc - a }, { x: el.x, y: yc + a },
    ].map((p) => rotateAbout(p, centre, tilt));
  }
  return null;
}

// ── Intersection ─────────────────────────────────────────────────────────────

/** Distance along the surface from the centre of its clear opening. */
function extentOffset(s: Surface, hit: Vec2): number {
  if (s.geom.kind === 'plane') {
    const tangent = perp(s.geom.normal);
    return Math.abs(dot(sub(hit, s.centre), tangent));
  }
  // For a cap, "off axis" means perpendicular distance from the element axis,
  // which is the line through the centre of curvature along `vertexDir`.
  return Math.abs(cross(sub(hit, s.geom.centre), s.geom.vertexDir));
}

/** Outward (away-from-glass) unit normal at a point on the surface. */
export function outwardAt(s: Surface, p: Vec2): Vec2 {
  if (s.geom.kind === 'plane') return s.geom.normal;
  const radial = unit(sub(p, s.geom.centre));
  return s.geom.outwardSign === 1 ? radial : mul(radial, -1);
}

/**
 * Nearest intersection of the ray p + t·d with one surface, t > tMin.
 * Returns null when the ray never meets it (or only meets the far hemisphere,
 * or lands outside a `mount: 'pass'` opening — all three are "not there").
 */
export function intersect(s: Surface, p: Vec2, d: Vec2, tMin: number): Hit | null {
  if (s.geom.kind === 'plane') {
    const denom = dot(d, s.geom.normal);
    if (Math.abs(denom) < 1e-12) return null;
    const t = dot(sub(s.geom.point, p), s.geom.normal) / denom;
    if (t <= tMin) return null;
    const point = add(p, mul(d, t));
    const inExtent = extentOffset(s, point) <= s.half + 1e-9;
    if (!inExtent && s.mount === 'pass') return null;
    return { surface: s, t, point, outward: s.geom.normal, inExtent };
  }

  // Sphere: |p + t d − C|² = R².
  const oc = sub(p, s.geom.centre);
  const b = 2 * dot(oc, d);
  const c = dot(oc, oc) - s.geom.radius * s.geom.radius;
  const disc = b * b - 4 * c;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const roots = [(-b - sq) / 2, (-b + sq) / 2];

  for (const t of roots) {
    if (t <= tMin) continue;
    const point = add(p, mul(d, t));
    // Must be on the CAP, not the far hemisphere.
    if (dot(sub(point, s.geom.centre), s.geom.vertexDir) <= 0) continue;
    const inExtent = extentOffset(s, point) <= s.half + 1e-9;
    if (!inExtent && s.mount === 'pass') continue;
    return { surface: s, t, point, outward: outwardAt(s, point), inExtent };
  }
  return null;
}
