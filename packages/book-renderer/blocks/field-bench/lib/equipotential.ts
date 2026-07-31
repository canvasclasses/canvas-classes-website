/*
 * field-bench/lib/equipotential.ts — contours of the scalar potential.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * Marching squares over a sampled V-grid, then a Newton refinement of every
 * vertex ONTO the exact level along ∇V.
 *
 * The refinement is not polish. The single claim this whole view exists to
 * make is "field lines cross equipotentials at exactly 90°, everywhere". A raw
 * marching-squares vertex sits on a linear interpolation of the cell edge, off
 * the true isoline by O(h²) — enough that a measured E·t̂ would come out at a
 * few percent and a sharp student measuring on screen would catch us being
 * approximately right while claiming exactness. Three Newton steps put every
 * vertex on the level set to ~1e-12 of its value, and the verifier then
 * measures |Ê·t̂| on the refined contour and holds it under 2e-2 (it typically
 * lands near 1e-3, limited by the chord tangent, not by the vertex).
 *
 * There are no contours for a magnetic scene, ever: `potentialAt` returns NaN
 * there and this file returns an empty list rather than drawing curves of a
 * quantity that does not exist.
 */

import type { Equipotential, FieldScene, Vec2 } from '../types';
import type { Bounds } from '../../mechanics-bench/lib/svg';
import { potentialAt, fieldVector } from './field';

export interface ContourOptions {
  bounds: Bounds;
  /** Grid cells per axis. 120 is plenty for a reader; the verifier uses more. */
  nx: number;
  ny: number;
  /** Drop contour fragments shorter than this many vertices. */
  minPoints?: number;
}

/** One marching-squares segment before stitching. */
interface Seg { a: Vec2; b: Vec2 }

const lerp = (p: Vec2, q: Vec2, t: number): Vec2 => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

/**
 * Level values that spread the contours evenly over the scene.
 *
 * QUANTILES, not equal steps. A point charge's V ranges over five decades
 * between the charge and the frame edge; equally spaced levels would put every
 * contour in a tiny halo around the charge and leave the rest of the frame
 * bare. Equal-quantile levels give roughly equal AREA between neighbouring
 * contours, which is what "evenly spread" means to the eye.
 *
 * V = 0 is force-included whenever the potential changes sign, because on a
 * dipole that contour is the perpendicular bisector — the most quotable
 * equipotential in the chapter, and it would otherwise be missed.
 */
export function suggestLevels(scene: FieldScene, opts: ContourOptions, count = 7): number[] {
  const vals: number[] = [];
  const { bounds, nx, ny } = opts;
  const stepX = (bounds.maxX - bounds.minX) / nx;
  const stepY = (bounds.maxY - bounds.minY) / ny;
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const v = potentialAt(scene, { x: bounds.minX + i * stepX, y: bounds.minY + j * stepY });
      if (Number.isFinite(v)) vals.push(v);
    }
  }
  if (!vals.length) return [];
  vals.sort((a, b) => a - b);

  const levels: number[] = [];
  const signChange = vals[0] < 0 && vals[vals.length - 1] > 0;
  for (let k = 1; k <= count; k++) {
    const q = k / (count + 1);
    const v = vals[Math.min(vals.length - 1, Math.floor(q * vals.length))];
    if (Number.isFinite(v)) levels.push(v);
  }
  if (signChange) levels.push(0);

  // Dedupe on a relative tolerance — quantiles of a flat region collapse.
  const span = Math.abs(vals[vals.length - 1] - vals[0]) || 1;
  const out: number[] = [];
  for (const v of levels.sort((a, b) => a - b)) {
    if (!out.length || Math.abs(v - out[out.length - 1]) > span * 1e-4) out.push(v);
  }
  return out;
}

/** Push a point onto the exact isolevel by Newton steps along ∇V.
 *  ∇V = −E, so the field we already have IS the gradient — no second sampler. */
export function refineOntoLevel(scene: FieldScene, p: Vec2, level: number, iters = 3): Vec2 {
  let q = p;
  for (let i = 0; i < iters; i++) {
    const v = potentialAt(scene, q);
    if (!Number.isFinite(v)) return q;
    const e = fieldVector(scene, q);
    const g2 = e.x * e.x + e.y * e.y;          // |∇V|²
    if (g2 === 0 || !Number.isFinite(g2)) return q;
    // ∇V = −E  ⇒  q ← q − (V − level)·∇V/|∇V|²  =  q + (V − level)·E/|E|²
    const k = (v - level) / g2;
    q = { x: q.x + k * e.x, y: q.y + k * e.y };
  }
  return q;
}

/** Contours of `levels`, each as one or more polylines. */
export function buildEquipotentials(
  scene: FieldScene,
  levels: number[],
  opts: ContourOptions,
): Equipotential[] {
  if (scene.kind === 'magnetic') return [];
  const { bounds, nx, ny } = opts;
  const stepX = (bounds.maxX - bounds.minX) / nx;
  const stepY = (bounds.maxY - bounds.minY) / ny;

  // Sample once, reuse for every level.
  const V = new Float64Array((nx + 1) * (ny + 1));
  const at = (i: number, j: number): Vec2 => ({ x: bounds.minX + i * stepX, y: bounds.minY + j * stepY });
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) V[j * (nx + 1) + i] = potentialAt(scene, at(i, j));
  }

  return levels.map((level) => ({
    value: level,
    loops: stitch(marchingSquares(V, nx, ny, at, level), stepX, stepY, opts.minPoints ?? 4)
      .map((loop) => loop.map((p) => refineOntoLevel(scene, p, level))),
  })).filter((e) => e.loops.length > 0);
}

/** Standard marching squares with the centre-value saddle test. */
function marchingSquares(
  V: Float64Array, nx: number, ny: number, at: (i: number, j: number) => Vec2, level: number,
): Seg[] {
  const segs: Seg[] = [];
  const g = (i: number, j: number) => V[j * (nx + 1) + i];

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const v00 = g(i, j), v10 = g(i + 1, j), v11 = g(i + 1, j + 1), v01 = g(i, j + 1);
      if (!Number.isFinite(v00 + v10 + v11 + v01)) continue;

      const p00 = at(i, j), p10 = at(i + 1, j), p11 = at(i + 1, j + 1), p01 = at(i, j + 1);
      const code = (v00 > level ? 1 : 0) | (v10 > level ? 2 : 0) | (v11 > level ? 4 : 0) | (v01 > level ? 8 : 0);
      if (code === 0 || code === 15) continue;

      const t = (a: number, b: number) => (level - a) / (b - a);
      const bottom = () => lerp(p00, p10, t(v00, v10));
      const right = () => lerp(p10, p11, t(v10, v11));
      const top = () => lerp(p01, p11, t(v01, v11));
      const left = () => lerp(p00, p01, t(v00, v01));

      switch (code) {
        case 1: case 14: segs.push({ a: left(), b: bottom() }); break;
        case 2: case 13: segs.push({ a: bottom(), b: right() }); break;
        case 3: case 12: segs.push({ a: left(), b: right() }); break;
        case 4: case 11: segs.push({ a: right(), b: top() }); break;
        case 6: case 9: segs.push({ a: bottom(), b: top() }); break;
        case 7: case 8: segs.push({ a: left(), b: top() }); break;
        // Saddles: the cell centre decides which pair of corners is connected.
        case 5: case 10: {
          const centre = (v00 + v10 + v11 + v01) / 4;
          const flip = code === 5 ? centre > level : centre <= level;
          if (flip) {
            segs.push({ a: left(), b: top() });
            segs.push({ a: bottom(), b: right() });
          } else {
            segs.push({ a: left(), b: bottom() });
            segs.push({ a: right(), b: top() });
          }
          break;
        }
      }
    }
  }
  return segs;
}

/**
 * Join segments end-to-end into polylines.
 *
 * ⚠ UNDIRECTED, AND WALKED FROM BOTH ENDS. Marching squares does NOT emit its
 * segments with a consistent global winding — whether a cell writes `left →
 * bottom` or `bottom → left` depends on which of the sixteen cases it hit. A
 * first version of this function followed only a→b chains and produced, for a
 * single point charge whose equipotentials are perfect circles, 73 disconnected
 * fragments averaging FIVE vertices each. The physics was right, the perpendic-
 * ularity check still passed on every fragment, and the rings rendered as a
 * broken dotted mess. Nothing in tsc, eslint or the physics verifier can see
 * that; only counting the pieces can.
 *
 * So: build an undirected incidence map on quantised endpoints, seed on any
 * unused segment, then extend from the tail AND from the head until neither
 * end can grow. Every segment is consumed exactly once, so the walk terminates.
 *
 * The quantisation is safe because two cells sharing an edge interpolate the
 * crossing from the SAME two corner values and therefore produce bit-identical
 * coordinates — the hash is joining points that are equal, not merely close.
 */
function stitch(segs: Seg[], stepX: number, stepY: number, minPoints: number): Vec2[][] {
  const q = Math.min(stepX, stepY) * 1e-3;
  const key = (p: Vec2) => `${Math.round(p.x / q)}:${Math.round(p.y / q)}`;

  const incident = new Map<string, number[]>();
  const add = (k: string, i: number) => {
    const list = incident.get(k);
    if (list) list.push(i); else incident.set(k, [i]);
  };
  segs.forEach((s, i) => { add(key(s.a), i); add(key(s.b), i); });

  const used = new Array<boolean>(segs.length).fill(false);
  const otherEnd = (i: number, k: string): Vec2 => (key(segs[i].a) === k ? segs[i].b : segs[i].a);
  const nextFrom = (k: string): number | undefined => incident.get(k)?.find((j) => !used[j]);

  const loops: Vec2[][] = [];

  for (let seed = 0; seed < segs.length; seed++) {
    if (used[seed]) continue;
    used[seed] = true;
    const pts: Vec2[] = [segs[seed].a, segs[seed].b];

    for (;;) {
      const k = key(pts[pts.length - 1]);
      const j = nextFrom(k);
      if (j === undefined) break;
      used[j] = true;
      pts.push(otherEnd(j, k));
    }
    for (;;) {
      const k = key(pts[0]);
      const j = nextFrom(k);
      if (j === undefined) break;
      used[j] = true;
      pts.unshift(otherEnd(j, k));
    }

    if (pts.length >= minPoints) loops.push(pts);
  }

  return loops;
}
