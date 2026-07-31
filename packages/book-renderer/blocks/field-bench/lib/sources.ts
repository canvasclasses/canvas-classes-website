/*
 * field-bench/lib/sources.ts — what each source kind actually does to space.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. SI units. x right, y UP — the convention shared by
 * all five engines.
 *
 * ── THE TWO WORLDS, AND WHY BOTH ARE HONEST ─────────────────────────────────
 * A 2-D canvas can hold two different exact physical pictures, and this engine
 * uses BOTH, never a blend:
 *
 *   • A 3-D point object seen in a plane — `point-charge`, `point-mass`,
 *     `dipole`. Field ∝ 1/r², potential ∝ 1/r. This is the Coulomb/Newton
 *     picture a student is taught first, and it is exact.
 *
 *   • A 2-D cross-section of something infinitely long in z — `line-charge`
 *     (a wire seen end-on), `ring-charge` (a cylindrical shell seen end-on),
 *     `sheet-charge` (a plane seen edge-on), `current-wire` (a wire lying IN
 *     the plane). Field ∝ 1/r for the line, uniform for the sheet. This is the
 *     picture in which a CLOSED CURVE on the page is a real closed surface (a
 *     cylinder of unit length), so ∮E·n̂ dl = λ_enc/ε₀ holds EXACTLY.
 *
 * Gauss's law in this engine lives in the second world, and only there. That is
 * not a shortcut: the flux of a 1/r² field through a circle genuinely does
 * depend on the radius, because a circle is not a closed surface around a point
 * charge. Rather than fudge it, the Gauss archetypes are built from line and
 * ring charges and the UI says "per metre of length" out loud. See
 * `flux.ts` → `fluxModelWarnings`, which names any source that breaks the rule
 * instead of quietly producing a wrong number.
 *
 * ── MAGNETISM IS OUT OF THE PAGE, ALWAYS ────────────────────────────────────
 * Every magnetic source here produces B perpendicular to the page. That is
 * forced by the physics, not by convenience: F = qv×B with v in the plane and
 * B in the plane has a z-component, so the particle would leave the page and
 * the 2-D trajectory would be a lie. Out-of-page B keeps planar motion exactly
 * planar. `FieldSample.field` therefore carries (0,0) for magnetic scenes and
 * `magnitude` carries |B_z| — the canvas draws ⊗/⊙ glyphs, not arrows.
 */

import type { Vec2 } from '../types';
import type { FieldSource, SourceKind } from '../types';
import { EPS0, K_E, MU0, G_NEWTON, R_MIN } from './constants';

const DEG = Math.PI / 180;

/** Unit vector at a physics angle (degrees CCW from +x). */
export function dirOf(angleDeg = 0): Vec2 {
  const a = angleDeg * DEG;
  return { x: Math.cos(a), y: Math.sin(a) };
}

/** Left normal of a direction — dir(angle + 90°). */
export function normalOf(angleDeg = 0): Vec2 {
  const a = angleDeg * DEG;
  return { x: -Math.sin(a), y: Math.cos(a) };
}

const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;

/** Reference radius for the logarithmic potential of a line/ring charge, m.
 *  A log potential has no zero at infinity, so SOME radius must be called zero;
 *  1 m is stated here and in the UI rather than left implicit. */
export const LOG_POTENTIAL_REF = 1;

// ── What is modelled ─────────────────────────────────────────────────────────

/**
 * Kinds this engine computes exactly. Anything outside the list contributes
 * NOTHING rather than an invented approximation — a wrong field drawn
 * confidently is worse than a missing one, and `unsupportedSources` lets the UI
 * say which source it is refusing to fake.
 */
export const SUPPORTED_KINDS: readonly SourceKind[] = [
  'point-charge', 'dipole', 'line-charge', 'sheet-charge', 'ring-charge',
  'point-mass', 'current-wire', 'uniform-E', 'uniform-B',
];

/** Kinds not yet modelled: `current-loop`, `solenoid`, `bar-magnet`. */
export function unsupportedSources(sources: FieldSource[]): FieldSource[] {
  return sources.filter((s) => !SUPPORTED_KINDS.includes(s.kind));
}

export const isElectricKind = (k: SourceKind): boolean =>
  k === 'point-charge' || k === 'dipole' || k === 'line-charge'
  || k === 'sheet-charge' || k === 'ring-charge' || k === 'uniform-E';

export const isMagneticKind = (k: SourceKind): boolean =>
  k === 'uniform-B' || k === 'current-wire' || k === 'current-loop'
  || k === 'solenoid' || k === 'bar-magnet';

export const isGravityKind = (k: SourceKind): boolean => k === 'point-mass';

// ── One source's electric contribution ───────────────────────────────────────

export interface Contribution {
  field: Vec2;
  /** V, or J/kg for gravity. Always finite — see `R_MIN`. */
  potential: number;
}

const ZERO: Contribution = { field: { x: 0, y: 0 }, potential: 0 };

/**
 * E and V at `at` from ONE electric source. Non-electric kinds return zero, so
 * a mixed scene (velocity selector: uniform-E + uniform-B) can be summed by a
 * single pass without the caller filtering first.
 */
export function electricOf(src: FieldSource, at: Vec2): Contribution {
  const d = sub(at, src.pos);
  const r = Math.max(Math.hypot(d.x, d.y), R_MIN);

  switch (src.kind) {
    // Coulomb. E = kq/r² radially outward for q > 0; V = kq/r.
    case 'point-charge': {
      const e = (K_E * src.strength) / (r * r);
      return { field: { x: (e * d.x) / r, y: (e * d.y) / r }, potential: (K_E * src.strength) / r };
    }

    // Ideal point dipole of moment p = strength (C·m) along angleDeg.
    // E = k[3(p̂·r̂)r̂ − p̂] p / r³ ,  V = k p (p̂·r̂) / r².
    // The `dipole` ARCHETYPE deliberately uses two real point charges instead —
    // a student can drag those apart, and "two charges" is the mental model the
    // NCERT chapter builds. This kind exists for the far-field idealisation.
    case 'dipole': {
      const p = dirOf(src.angleDeg);
      const rh = { x: d.x / r, y: d.y / r };
      const c = dot(p, rh);
      const k = (K_E * src.strength) / (r * r * r);
      return {
        field: { x: k * (3 * c * rh.x - p.x), y: k * (3 * c * rh.y - p.y) },
        potential: (K_E * src.strength * c) / (r * r),
      };
    }

    // Infinite line ⟂ to the page, linear density λ = strength (C/m).
    // E = λ/(2πε₀ r) = 2kλ/r ;  V = −2kλ ln(r/r₀).
    case 'line-charge': {
      const e = (2 * K_E * src.strength) / r;
      return {
        field: { x: (e * d.x) / r, y: (e * d.y) / r },
        potential: -2 * K_E * src.strength * Math.log(r / LOG_POTENTIAL_REF),
      };
    }

    // Uniformly charged cylindrical shell of radius R seen end-on, total linear
    // density λ = strength. Outside it is indistinguishable from a line; INSIDE
    // it is exactly zero — which is the whole conductor-cavity lesson, computed
    // rather than drawn.
    case 'ring-charge': {
      const R = Math.max(src.radius ?? 0, 0);
      if (r < R) {
        return { field: { x: 0, y: 0 }, potential: -2 * K_E * src.strength * Math.log(Math.max(R, R_MIN) / LOG_POTENTIAL_REF) };
      }
      const e = (2 * K_E * src.strength) / r;
      return {
        field: { x: (e * d.x) / r, y: (e * d.y) / r },
        potential: -2 * K_E * src.strength * Math.log(r / LOG_POTENTIAL_REF),
      };
    }

    // Infinite charged plane seen edge-on, surface density σ = strength (C/m²).
    // E = σ/(2ε₀) away from the sheet on both sides; V = −σ|s|/(2ε₀).
    case 'sheet-charge': {
      const n = normalOf(src.angleDeg);
      const s = dot(d, n);
      const e = src.strength / (2 * EPS0);
      const sign = s >= 0 ? 1 : -1;
      return { field: { x: e * sign * n.x, y: e * sign * n.y }, potential: -e * Math.abs(s) };
    }

    // A field that is the same everywhere. V is measured from `pos`.
    case 'uniform-E': {
      const u = dirOf(src.angleDeg);
      const f = { x: src.strength * u.x, y: src.strength * u.y };
      return { field: f, potential: -dot(f, d) };
    }

    default:
      return ZERO;
  }
}

/**
 * g and the gravitational potential (J/kg) at `at` from one mass.
 *
 * `radius` turns a point mass into a UNIFORM SPHERE of that radius, and that is
 * the whole `g-inside-earth` lesson: inside, only the mass at smaller r pulls
 * (the shell theorem), so g ∝ r and RISES outward until the surface.
 *
 *      r ≥ R:  g = GM/r²            V = −GM/r
 *      r < R:  g = GMr/R³           V = −GM(3R² − r²)/(2R³)
 */
export function gravityOf(src: FieldSource, at: Vec2): Contribution {
  if (src.kind !== 'point-mass') return ZERO;
  const d = sub(at, src.pos);
  const r = Math.max(Math.hypot(d.x, d.y), R_MIN);
  const M = src.strength;
  const R = src.radius ?? 0;

  let g: number;
  let V: number;
  if (R > 0 && r < R) {
    g = (G_NEWTON * M * r) / (R * R * R);
    V = (-G_NEWTON * M * (3 * R * R - r * r)) / (2 * R * R * R);
  } else {
    g = (G_NEWTON * M) / (r * r);
    V = (-G_NEWTON * M) / r;
  }
  // Attractive: g points BACK toward the mass, hence the minus.
  return { field: { x: (-g * d.x) / r, y: (-g * d.y) / r }, potential: V };
}

/**
 * B_z at `at` from one magnetic source, tesla, positive = OUT of the page.
 *
 * `current-wire` is a straight wire LYING IN the page along `angleDeg` carrying
 * `strength` amperes in that direction. At a field point in the same plane the
 * right-hand rule gives B purely along ±ẑ: B_z = μ₀I/(2πs) where s is the
 * SIGNED perpendicular offset along dir(angleDeg + 90°). The sign falls out of
 * the arithmetic — nothing is special-cased, so the "flip the current, flip the
 * field" demonstration cannot drift out of step with the formula.
 */
export function magneticOf(src: FieldSource, at: Vec2): number {
  switch (src.kind) {
    case 'uniform-B':
      return src.strength;
    case 'current-wire': {
      const n = normalOf(src.angleDeg);
      const s = dot(sub(at, src.pos), n);
      const safe = Math.abs(s) < R_MIN ? (s < 0 ? -R_MIN : R_MIN) : s;
      return (MU0 * src.strength) / (2 * Math.PI * safe);
    }
    default:
      return 0;
  }
}
