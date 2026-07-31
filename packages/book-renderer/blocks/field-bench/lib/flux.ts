/*
 * field-bench/lib/flux.ts — Gauss's law, computed rather than asserted.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * `flux` is a REAL line integral ∮E·n̂ dl around the student's curve. It is not
 * derived from the enclosed charge and then dressed up as a measurement. That
 * distinction is the entire lab: `predictedFlux` = q_enc/ε₀ comes from the
 * theorem, `flux` comes from the field, and the student drags the surface
 * around watching two INDEPENDENTLY computed numbers stay glued together. If we
 * computed one from the other there would be nothing to learn — the agreement
 * would be a tautology we had typed in ourselves.
 *
 * ── Quadrature ──────────────────────────────────────────────────────────────
 * Composite 4-node Gauss–Legendre on every edge. A midpoint rule would be
 * spectrally accurate on a circle (periodic) but only O(h²) on a rectangle's
 * straight sides, and the headline claim is that the CIRCLE and the RECTANGLE
 * give the same answer. If the rectangle carried 1e-7 of quadrature error while
 * the circle carried 1e-15, "flux does not depend on the shape" would fail in
 * the 8th digit for a reason that has nothing to do with physics. One rule,
 * both shapes, error below 1e-12 for every archetype.
 *
 * ── The 2-D reduction ───────────────────────────────────────────────────────
 * A closed CURVE on the page is the cross-section of a cylinder of unit length.
 * That makes Gauss exact for sources that are translationally invariant in z
 * (line and ring charges) and meaningless for a 3-D point charge — see the
 * sources.ts header. `fluxModelWarnings` names any source that breaks the rule
 * instead of letting the two readouts silently disagree.
 */

import type { FieldScene, FieldSource, FluxResult, GaussSurface, Vec2 } from '../types';
import { EPS0, G_NEWTON } from './constants';
import { sampleE, sampleG } from './field';

/** Kinds with a well-defined 2-D flux — i.e. a delta of charge per unit length
 *  in the plane. These, and only these, are counted into `enclosed`. */
const FLUX_KINDS = new Set(['line-charge', 'ring-charge']);

/** Kinds that contribute a field but no NET flux through any closed curve
 *  (a uniform field: as much goes in as comes out). Not a warning. */
const NEUTRAL_KINDS = new Set(['uniform-E', 'uniform-B']);

export interface FluxOptions {
  /** Quadrature sub-intervals around the whole curve. Default 512 (×4 nodes). */
  samples?: number;
  /** A source within this fraction of the surface's size counts as ON the
   *  boundary, where the answer is genuinely ill-defined. Default 1%. */
  boundaryFrac?: number;
}

// ── Geometry ─────────────────────────────────────────────────────────────────

/** Characteristic size, m — the radius, or half the shorter rectangle side. */
export function surfaceScale(s: GaussSurface): number {
  if (s.shape === 'circle') return Math.max(s.radius ?? 0, 1e-9);
  const w = s.size?.w ?? 0;
  const h = s.size?.h ?? 0;
  return Math.max(Math.min(w, h) / 2, 1e-9);
}

/** Signed distance from the boundary: negative inside, positive outside.
 *  For the rectangle this is the exact distance outside and the (negative)
 *  distance to the nearest wall inside, which is all the boundary test needs. */
export function signedDistance(s: GaussSurface, p: Vec2): number {
  if (s.shape === 'circle') return Math.hypot(p.x - s.centre.x, p.y - s.centre.y) - (s.radius ?? 0);
  const hw = (s.size?.w ?? 0) / 2;
  const hh = (s.size?.h ?? 0) / 2;
  const dx = Math.abs(p.x - s.centre.x) - hw;
  const dy = Math.abs(p.y - s.centre.y) - hh;
  if (dx <= 0 && dy <= 0) return Math.max(dx, dy);
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
}

export const isInside = (s: GaussSurface, p: Vec2): boolean => signedDistance(s, p) < 0;

/** The closed curve as a polyline, for drawing. */
export function surfaceOutline(s: GaussSurface, steps = 96): Vec2[] {
  if (s.shape === 'circle') {
    const r = s.radius ?? 0;
    const out: Vec2[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = (2 * Math.PI * i) / steps;
      out.push({ x: s.centre.x + r * Math.cos(a), y: s.centre.y + r * Math.sin(a) });
    }
    return out;
  }
  const hw = (s.size?.w ?? 0) / 2;
  const hh = (s.size?.h ?? 0) / 2;
  const { x, y } = s.centre;
  return [
    { x: x - hw, y: y - hh }, { x: x + hw, y: y - hh },
    { x: x + hw, y: y + hh }, { x: x - hw, y: y + hh },
    { x: x - hw, y: y - hh },
  ];
}

// ── Quadrature ───────────────────────────────────────────────────────────────

const GL_NODES = [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526];
const GL_WEIGHTS = [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538];

/** ∫ f(t) dt over [t0, t1] by composite 4-node Gauss–Legendre. */
function quad(f: (t: number) => number, t0: number, t1: number, subs: number): number {
  const h = (t1 - t0) / subs;
  let sum = 0;
  for (let i = 0; i < subs; i++) {
    const a = t0 + i * h;
    const mid = a + h / 2;
    for (let k = 0; k < 4; k++) sum += GL_WEIGHTS[k] * f(mid + (h / 2) * GL_NODES[k]);
  }
  return sum * (h / 2);
}

/** The field this scene's flux is about: E for electric, g for gravitational. */
function fluxField(scene: FieldScene, at: Vec2): Vec2 {
  if (scene.kind === 'gravitational') return sampleG(scene.sources, at).field;
  return sampleE(scene.sources, at).field;
}

// ── The integral ─────────────────────────────────────────────────────────────

/** ∮ E·n̂ dl around a closed surface, outward normal. */
export function fluxIntegral(scene: FieldScene, s: GaussSurface, samples = 512): number {
  const F = (at: Vec2, n: Vec2) => {
    const e = fluxField(scene, at);
    return e.x * n.x + e.y * n.y;
  };

  if (s.shape === 'circle') {
    const R = s.radius ?? 0;
    return quad((th) => {
      const n = { x: Math.cos(th), y: Math.sin(th) };
      return F({ x: s.centre.x + R * n.x, y: s.centre.y + R * n.y }, n) * R;
    }, 0, 2 * Math.PI, samples);
  }

  const hw = (s.size?.w ?? 0) / 2;
  const hh = (s.size?.h ?? 0) / 2;
  const { x: cx, y: cy } = s.centre;
  const per = Math.max(4, Math.round(samples / 4));

  const right = quad((t) => F({ x: cx + hw, y: cy + t }, { x: 1, y: 0 }), -hh, hh, per);
  const left = quad((t) => F({ x: cx - hw, y: cy + t }, { x: -1, y: 0 }), -hh, hh, per);
  const top = quad((t) => F({ x: cx + t, y: cy + hh }, { x: 0, y: 1 }), -hw, hw, per);
  const bottom = quad((t) => F({ x: cx + t, y: cy - hh }, { x: 0, y: -1 }), -hw, hw, per);
  return right + left + top + bottom;
}

/** Sources whose whole charge sits strictly inside, and those straddling. */
export function enclosedSources(
  s: GaussSurface, sources: FieldSource[], boundaryFrac = 0.01,
): { inside: FieldSource[]; onBoundary: FieldSource[] } {
  const tol = surfaceScale(s) * boundaryFrac;
  const inside: FieldSource[] = [];
  const onBoundary: FieldSource[] = [];

  for (const src of sources) {
    if (NEUTRAL_KINDS.has(src.kind)) continue;
    if (!FLUX_KINDS.has(src.kind)) continue;

    if (src.kind === 'ring-charge') {
      // A shell is enclosed only if ALL of it is. A surface that cuts through
      // the shell encloses an unknown fraction of its charge — that is not a
      // hard case to handle, it is a question with no single answer, and saying
      // so is more honest than integrating a guess.
      //
      // Sampled rather than solved analytically because of the case that
      // matters most: in `conductor-cavity` the Gauss circle sits INSIDE the
      // shell's hole, so every point of the shell is outside the surface even
      // though the shell's CENTRE is inside it. A centre-distance test would
      // call that "straddling" and refuse to answer the one question the
      // archetype is built to answer.
      const R = src.radius ?? 0;
      let lo = Infinity;
      let hi = -Infinity;
      for (let k = 0; k < 64; k++) {
        const a = (2 * Math.PI * k) / 64;
        const d = signedDistance(s, { x: src.pos.x + R * Math.cos(a), y: src.pos.y + R * Math.sin(a) });
        lo = Math.min(lo, d);
        hi = Math.max(hi, d);
      }
      if (hi < -tol) inside.push(src);
      else if (lo > tol) continue;
      else onBoundary.push(src);
      continue;
    }

    const d = signedDistance(s, src.pos);
    if (Math.abs(d) <= tol) onBoundary.push(src);
    else if (d < 0) inside.push(src);
  }

  return { inside, onBoundary };
}

/**
 * Sources present that make the 2-D flux picture invalid — a 3-D point charge
 * or an infinite sheet inside a plane cross-section. Rendered as a plain
 * sentence by the UI. Nothing is silently counted or silently dropped.
 */
export function fluxModelWarnings(scene: FieldScene): string[] {
  const out: string[] = [];
  const kinds = new Set(scene.sources.map((s) => s.kind));
  if (kinds.has('point-charge') || kinds.has('dipole')) {
    out.push(
      'This scene contains a point charge. A circle on the page is not a closed surface around a point — '
      + 'its flux really does depend on the radius. Gauss on this page works with long charges seen end-on.',
    );
  }
  if (kinds.has('sheet-charge')) {
    out.push('A charged sheet crosses the surface, so the charge enclosed is not a single fixed number.');
  }
  return out;
}

/**
 * The full result: the measured integral, the enclosed charge, the theorem's
 * prediction, and the sources sitting on the fence.
 *
 * `enclosed` is charge per unit length (C/m) so `predictedFlux` = q/ε₀ is
 * N·m²/C per metre — the unit stated in the frozen `FluxResult` and printed in
 * the UI, never quietly dropped.
 */
export function computeFlux(scene: FieldScene, s: GaussSurface, opts: FluxOptions = {}): FluxResult {
  const { inside, onBoundary } = enclosedSources(s, scene.sources, opts.boundaryFrac ?? 0.01);
  const enclosed = inside.reduce((sum, src) => sum + src.strength, 0);
  const predictedFlux = scene.kind === 'gravitational'
    ? -4 * Math.PI * G_NEWTON * enclosed
    : enclosed / EPS0;

  return {
    surfaceId: s.id,
    flux: fluxIntegral(scene, s, opts.samples ?? 512),
    enclosed,
    predictedFlux,
    onBoundary: onBoundary.map((src) => src.id),
  };
}
