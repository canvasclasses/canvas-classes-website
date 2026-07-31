/*
 * field-bench/lib/field.ts — the sampler. Superposition, and nothing else.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * Superposition is implemented as a literal sum over sources with no
 * short-circuit and no special cases, because the exact claim the sim makes to
 * a student — "two equal charges give EXACTLY zero at the midpoint, and that is
 * not an approximation" — is only true if the code really is a plain sum. The
 * verifier asserts that midpoint zero to 1e-30 N/C.
 *
 * `sampleField` implements the frozen `FieldSample` contract and dispatches on
 * `scene.kind`. Note the null: for a magnetic scene `potential` is null, not 0.
 * There is no scalar magnetic potential; returning 0 would look like a number a
 * student could reason about, and it would be a lie. See types.ts.
 */

import type { FieldSample, FieldScene, FieldSource, Vec2 } from '../types';
import {
  electricOf, gravityOf, magneticOf,
  isElectricKind, isGravityKind, isMagneticKind,
} from './sources';

const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });

export interface ScalarField {
  field: Vec2;
  potential: number;
}

/** Electric field and electric potential from every electric source present.
 *  Works on a mixed E+B scene — the magnetic sources simply contribute 0 here. */
export function sampleE(sources: FieldSource[], at: Vec2): ScalarField {
  let field: Vec2 = { x: 0, y: 0 };
  let potential = 0;
  for (const s of sources) {
    if (!isElectricKind(s.kind)) continue;
    const c = electricOf(s, at);
    field = add(field, c.field);
    potential += c.potential;
  }
  return { field, potential };
}

/** Gravitational field (m/s²) and potential (J/kg). */
export function sampleG(sources: FieldSource[], at: Vec2): ScalarField {
  let field: Vec2 = { x: 0, y: 0 };
  let potential = 0;
  for (const s of sources) {
    if (!isGravityKind(s.kind)) continue;
    const c = gravityOf(s, at);
    field = add(field, c.field);
    potential += c.potential;
  }
  return { field, potential };
}

/** B_z in tesla, positive OUT of the page. In-plane B is identically zero for
 *  every source this engine models — see the sources.ts header for why that is
 *  physics rather than convenience. */
export function sampleBz(sources: FieldSource[], at: Vec2): number {
  let bz = 0;
  for (const s of sources) bz += magneticOf(s, at);
  return bz;
}

/** True when the scene carries a live magnetic source — the flag that decides
 *  whether a trajectory needs the full Lorentz force or just qE/m. */
export const hasMagnetic = (sources: FieldSource[]): boolean =>
  sources.some((s) => isMagneticKind(s.kind) && s.strength !== 0);

/**
 * The frozen contract sampler.
 *
 * electric      → E (V/m) and V (volts)
 * gravitational → g (m/s²) and the potential per unit mass (J/kg)
 * magnetic      → field (0,0) because in-plane B is zero; `magnitude` is |B_z|,
 *                 which IS what a heat map and a readout must show; potential
 *                 null, always.
 */
export function sampleField(scene: FieldScene, at: Vec2): FieldSample {
  if (scene.kind === 'magnetic') {
    const bz = sampleBz(scene.sources, at);
    return { at, field: { x: 0, y: 0 }, magnitude: Math.abs(bz), potential: null };
  }
  const s = scene.kind === 'gravitational' ? sampleG(scene.sources, at) : sampleE(scene.sources, at);
  return { at, field: s.field, magnitude: Math.hypot(s.field.x, s.field.y), potential: s.potential };
}

/** Just the vector, for the hot loops (line tracing, grids). */
export function fieldVector(scene: FieldScene, at: Vec2): Vec2 {
  if (scene.kind === 'magnetic') return { x: 0, y: 0 };
  return (scene.kind === 'gravitational' ? sampleG(scene.sources, at) : sampleE(scene.sources, at)).field;
}

/** Just the scalar potential; NaN for a magnetic scene so a contourer cannot
 *  silently draw meaningless "equipotentials" of a magnetic field. */
export function potentialAt(scene: FieldScene, at: Vec2): number {
  if (scene.kind === 'magnetic') return NaN;
  return (scene.kind === 'gravitational' ? sampleG(scene.sources, at) : sampleE(scene.sources, at)).potential;
}

/** Unit vector along the field, or null where the field vanishes (a null point
 *  is a real feature — two like charges have one at their midpoint — so it gets
 *  a null rather than an arbitrary direction). */
export function fieldDirection(scene: FieldScene, at: Vec2): Vec2 | null {
  const f = fieldVector(scene, at);
  const m = Math.hypot(f.x, f.y);
  if (!Number.isFinite(m) || m === 0) return null;
  return { x: f.x / m, y: f.y / m };
}
