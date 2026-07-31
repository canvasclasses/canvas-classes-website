/*
 * field-bench/lib/view.ts — framing the scene.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Wraps `../../mechanics-bench/lib/svg` rather than
 * reimplementing the camera: `fitView` already enforces ONE scale on both axes,
 * and a stretched axis here would make a circular Gauss surface draw as an
 * ellipse while the readout insisted it was a circle.
 *
 * ⚠ TWO BOXES, TWO JOBS.
 *   `contentBounds` — the tight box around everything that exists.
 *   `frameBounds`   — content plus a uniform margin. THIS is what the camera
 *                     fits, and it is computed ONCE per archetype rather than
 *                     per frame.
 *
 * The second rule is a UX correctness constraint, not an optimisation. If the
 * camera re-fitted the live content, dragging a charge toward the edge would
 * zoom the whole world out from under the student's finger mid-gesture — the
 * exact bug `stableFit` was added to mechanics-bench to stop. Freezing the
 * frame per archetype means a drag moves the charge and nothing else.
 *
 * ⚠ minScale/maxScale AND quantise MUST BE OVERRIDDEN. `fitView`'s defaults are
 * tuned for a lab bench a few metres across (minScale 2 px/m, scale quantised
 * to 0.01). The gravitation archetypes are 10⁷ m across, where the correct
 * scale is ~4e-5 px/m: the default floor would blow the Earth up to 10⁷ px wide
 * and `Math.round(scale*100)/100` would quantise the scale to exactly ZERO.
 * Both are disabled here; the frame margin does the job the clamps were for.
 */

import type { FieldScene, Vec2 } from '../types';
import type { Bounds, View } from '../../mechanics-bench/lib/svg';
import { boundsOf, fitView, padBounds, unionBounds, worldToScreen } from '../../mechanics-bench/lib/svg';

export type { Bounds, View };

/**
 * Viewport fraction left as breathing room, and the frame margin as a fraction
 * of the content's longest side.
 *
 * Together they set how much of the board the physics occupies:
 *   linear fill on the binding axis = (1 − 2·FIT_PAD) / (1 + 2·FRAME_MARGIN)
 *                                   = 0.84 / 1.12 = 75%
 * which is the top of the 60–75% band the brief asks for, with the margin
 * carrying arrowheads and the outermost equipotential.
 */
export const FIT_PAD = 0.08;
export const FRAME_MARGIN = 0.06;

const FIT_OPTS = { padFrac: FIT_PAD, minScale: 1e-12, maxScale: 1e12, quantise: false };

/** Tight box around every source, surface, test charge and supplied path. */
export function contentBounds(scene: FieldScene, extra: Vec2[] = []): Bounds {
  const pts: Vec2[] = [...extra];

  for (const s of scene.sources) {
    const r = s.radius ?? 0;
    if (r > 0) {
      pts.push({ x: s.pos.x - r, y: s.pos.y - r }, { x: s.pos.x + r, y: s.pos.y + r });
    } else {
      pts.push(s.pos);
    }
  }
  for (const t of scene.testCharges ?? []) pts.push(t.pos);
  for (const g of scene.surfaces ?? []) {
    if (g.shape === 'circle') {
      const r = g.radius ?? 0;
      pts.push({ x: g.centre.x - r, y: g.centre.y - r }, { x: g.centre.x + r, y: g.centre.y + r });
    } else {
      const w = (g.size?.w ?? 0) / 2;
      const h = (g.size?.h ?? 0) / 2;
      pts.push({ x: g.centre.x - w, y: g.centre.y - h }, { x: g.centre.x + w, y: g.centre.y + h });
    }
  }

  const b = boundsOf(pts) ?? { minX: -0.5, minY: -0.5, maxX: 0.5, maxY: 0.5 };
  return degenerateFix(b);
}

/** A box with a zero-width axis cannot be fitted — give it the other axis's
 *  span, or 1 unit when the whole scene is a single point. */
function degenerateFix(b: Bounds): Bounds {
  let { minX, minY, maxX, maxY } = b;
  const w = maxX - minX;
  const h = maxY - minY;
  const fallback = Math.max(w, h) || 1;
  if (w <= fallback * 1e-9) {
    const c = (minX + maxX) / 2;
    minX = c - fallback / 2;
    maxX = c + fallback / 2;
  }
  if (h <= fallback * 1e-9) {
    const c = (minY + maxY) / 2;
    minY = c - fallback / 2;
    maxY = c + fallback / 2;
  }
  return { minX, minY, maxX, maxY };
}

/** Content plus a uniform margin — the box the camera actually fits. */
export function frameBounds(scene: FieldScene, extra: Vec2[] = []): Bounds {
  const c = contentBounds(scene, extra);
  const m = Math.max(c.maxX - c.minX, c.maxY - c.minY) * FRAME_MARGIN;
  return padBounds(c, m);
}

/** The camera for a `w × h` board. */
export function fitScene(frame: Bounds, w: number, h: number): View {
  return fitView(frame, Math.max(w, 1), Math.max(h, 1), FIT_OPTS);
}

/**
 * Linear fill of the CONTENT (not the frame) on each axis, as a fraction of the
 * board. `verify-field-bench.mjs` asserts the binding axis lands in the 60–75%
 * band for every archetype at a desktop board and a phone board — the same
 * measured-not-eyeballed check `verify-fbd-fill.mjs` runs for E1.
 */
export function contentFill(content: Bounds, frame: Bounds, w: number, h: number): { fx: number; fy: number } {
  const view = fitScene(frame, w, h);
  const a = worldToScreen({ x: content.minX, y: content.maxY }, view);
  const b = worldToScreen({ x: content.maxX, y: content.minY }, view);
  return { fx: Math.abs(b.x - a.x) / w, fy: Math.abs(b.y - a.y) / h };
}

/** Union helper re-exported so callers do not reach past this module. */
export { unionBounds };
