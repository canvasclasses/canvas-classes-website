/*
 * motion-lab/thermo/lib/pvview.ts — the camera for the PV plane.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM — so `scripts/verify-motion-phase2.mjs` can measure
 * how much of the canvas a process or a cycle actually fills, at a desktop board
 * and a phone board, and fail the build if it is lost in whitespace.
 *
 * ── TWO DECISIONS WORTH STATING ─────────────────────────────────────────────
 *
 * 1. THE AXES ARE FITTED INDEPENDENTLY. `fitView` in mechanics-bench forces one
 *    scale on both axes, and it is right to for a spatial diagram — a stretched
 *    y makes a 30° incline look like 60°. But this plane's axes are cubic metres
 *    and pascals. One scale would put a 0.05 m³ span and a 125 000 Pa span on the
 *    same ruler and collapse the curve to a horizontal line filling a fraction of
 *    a percent of the box. Independent fitting is the correct choice here and the
 *    fill measurement is what proves it.
 *
 * 2. THE P AXIS STARTS AT ZERO, ALWAYS. "The area under the curve is the work"
 *    is only true if the baseline really is P = 0. A cropped pressure axis would
 *    make the shaded region wrong by a constant while looking better — the worst
 *    kind of chart error, because it is invisible and it corrupts the one number
 *    the exercise exists to teach.
 *
 * 3. THE V AXIS DOES **NOT** START AT ZERO. It carries no area-from-the-origin
 *    meaning: the shaded region is bounded on the left by V₁ and on the right by
 *    V₂, never by the axis. Pinning V at zero as well was measured by the fill
 *    check to leave an isotherm drawing into 58% × 52% of its board — 45% of the
 *    width spent on volumes the process never visits. Fitting V to the content
 *    takes it to ~83% with no change to a single number.
 */

import { boundsOf, type Plot } from '../../waves/lib/plot';

export interface PvPoint { V: number; P: number }

export const PV_PAD = { l: 26, r: 20, t: 16, b: 24 };

/** Fit the plane to every point that will be drawn. */
export function pvPlotOf(w: number, h: number, groups: PvPoint[][]): Plot {
  const b = boundsOf(groups.map((g) => g.map((q) => ({ x: q.V, y: q.P }))));
  const spanX = Math.max(b.xMax - b.xMin, 1e-12);
  return {
    w: Math.max(w, 40),
    h: Math.max(h, 40),
    pad: PV_PAD,
    xMin: Math.max(0, b.xMin - spanX * 0.1),
    xMax: b.xMax + spanX * 0.1,
    yMin: 0,
    yMax: b.yMax * 1.08,
  };
}
