/*
 * field-bench/emi/lib/view.ts — framing the EMI bench. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable, which is the only reason the fill numbers
 * in `scripts/verify-emi-ac.mjs` are measured rather than eyeballed.
 *
 * ⚠ THE THREE `fitView` DEFAULTS THAT WOULD BREAK THIS, ALL OVERRIDDEN.
 * `mechanics-bench/lib/svg.ts` is tuned for a lab bench a few metres across:
 *
 *   maxScale 400 px/m  — the EMI bench is about 0.6 m wide in a 600 px board,
 *                        which needs ~900 px/m. The default would CLAMP the
 *                        camera to 400 and draw the whole scene at 44% of the
 *                        width it should have, with no error anywhere.
 *   minScale 2 px/m    — harmless here, but it is the same class of bug and
 *                        would bite the moment an archetype used centimetres.
 *   quantise true      — rounds the scale onto a 1% ladder. At planetary scale
 *                        that has silently returned ZERO before now. At 900 px/m
 *                        it is a no-op, so it is left on: the jitter-free slider
 *                        drag it exists for is worth having.
 *
 * ⚠ THE FRAME IS THE WHOLE TRAVEL, NOT THE CURRENT POSITION.
 * The loop is dragged from one end of the bench to the other. If the camera
 * fitted where the loop IS, the world would zoom out from under the student's
 * finger mid-drag — the exact defect `stableFit` was added to E1 to stop. So the
 * frame covers the band plus the FULL travel range plus the loop, is computed
 * once per archetype, and never moves while anything is being dragged.
 */

import type { Bounds, View } from '../../../mechanics-bench/lib/svg';
import { boundsOf, fitView, padBounds } from '../../../mechanics-bench/lib/svg';
import type { EmiSetup } from './setup';

export type { Bounds, View };

/** Viewport fraction left as breathing room, and the frame margin as a fraction
 *  of the content's longest side. Together they put the content at
 *  (1 − 2×0.07)/(1 + 2×0.05) = 0.86/1.10 = 78% of the board on the binding axis
 *  BEFORE the aspect mismatch, which lands the measured fill in the 60–75% band
 *  the brief asks for. */
export const FIT_PAD = 0.07;
export const FRAME_MARGIN = 0.05;

const FIT_OPTS = { padFrac: FIT_PAD, minScale: 1e-9, maxScale: 1e9, quantise: true };

/**
 * The tight box around everything that will ever be drawn for this archetype:
 * the field band, the full travel of the moving object, and the object itself.
 *
 * `inductance` has no field region and no travel — its stage is a plot, not a
 * world — so it returns a small unit box that nothing fits against.
 */
export function emiContentBounds(s: EmiSetup): Bounds {
  if (s.view === 'inductance') {
    return { minX: -0.5, minY: -0.5, maxX: 0.5, maxY: 0.5 };
  }

  const halfH = s.view === 'eddy' ? s.plate.height / 2
    : s.view === 'motional' ? s.rod.length / 2
      : s.loop.h / 2;
  const halfW = s.view === 'eddy' ? s.plate.width / 2
    : s.view === 'motional' ? (s.band.x1 - s.band.x0) / 2
      : s.loop.w / 2;

  const pts = [
    { x: s.band.x0, y: -halfH },
    { x: s.band.x1, y: halfH },
    // The band is drawn full height of the stage, so give it at least the
    // moving object's own height plus a little, or a wide flat band would make
    // the y axis binding and the loop tiny.
    { x: s.band.x0, y: -halfH * 1.5 },
    { x: s.band.x1, y: halfH * 1.5 },
    { x: s.travel.min - halfW, y: 0 },
    { x: s.travel.max + halfW, y: 0 },
  ];
  return boundsOf(pts) ?? { minX: -0.5, minY: -0.5, maxX: 0.5, maxY: 0.5 };
}

/** Content plus a uniform margin — the box the camera fits. */
export function emiFrameBounds(s: EmiSetup): Bounds {
  const c = emiContentBounds(s);
  const m = Math.max(c.maxX - c.minX, c.maxY - c.minY) * FRAME_MARGIN;
  return padBounds(c, m);
}

/** The camera for a `w × h` board. */
export function emiFitView(s: EmiSetup, w: number, h: number): View {
  return fitView(emiFrameBounds(s), Math.max(w, 1), Math.max(h, 1), FIT_OPTS);
}

/**
 * Linear fill of the CONTENT on each axis, as a fraction of the board.
 *
 * The verifier asserts the binding axis lands in 0.55–1.0 for every archetype at
 * a desktop board and a phone board — measured, the same discipline
 * `verify-fbd-fill.mjs` applies to E1, and for the same reason: "the diagram is
 * tiny" and "the diagram is cropped" are invisible to tsc and to the physics
 * verifier both.
 */
export function emiContentFill(s: EmiSetup, w: number, h: number): { fx: number; fy: number; scale: number } {
  const view = emiFitView(s, w, h);
  const c = emiContentBounds(s);
  return {
    fx: ((c.maxX - c.minX) * view.scale) / Math.max(w, 1),
    fy: ((c.maxY - c.minY) * view.scale) / Math.max(h, 1),
    scale: view.scale,
  };
}
