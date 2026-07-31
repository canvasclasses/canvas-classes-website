/*
 * mechanics-bench/lib/svg.ts — pure geometry for the render layer.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies — these are string/number functions
 * the FBD Studio and Pulley Lab renderers import, so the two agree pixel for
 * pixel and neither reinvents an arrowhead.
 *
 * ⚠ THE Y-FLIP. Physics y is UP; SVG y is DOWN. `worldToScreen` is the ONLY
 * place a POSITION is flipped. `arcPath` and `labelOffset` take physics ANGLES
 * and emit screen-space geometry, so they negate the sine — that is the same
 * convention applied to a direction rather than a point, and there is no
 * translation involved. Nothing else in the engine may touch the sign of y.
 */

import type { Vec2 } from '../types';
import { deg2rad, norm360 } from './linalg';

export interface View {
  /** World coordinates at the centre of the viewport (m). */
  cx: number;
  cy: number;
  /** Pixels per metre. */
  scale: number;
  /** Viewport size in pixels. */
  w: number;
  h: number;
}

/** World metres → screen pixels. The single y-flip in the whole engine. */
export function worldToScreen(p: Vec2, view: View): { x: number; y: number } {
  return {
    x: view.w / 2 + (p.x - view.cx) * view.scale,
    y: view.h / 2 - (p.y - view.cy) * view.scale,
  };
}

/** Screen pixels → world metres. The inverse; same single flip. */
export function screenToWorld(p: { x: number; y: number }, view: View): Vec2 {
  return {
    x: view.cx + (p.x - view.w / 2) / view.scale,
    y: view.cy - (p.y - view.h / 2) / view.scale,
  };
}

/**
 * A force arrow as two path strings: the shaft and a filled triangular head.
 * Both endpoints are already in SCREEN space.
 *
 * The shaft stops just short of the tip so a thick stroke does not poke through
 * the head — a detail that reads as sloppy at every zoom level otherwise.
 */
export function arrowPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  headLen = 10,
): { shaft: string; head: string } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);

  if (len < 1e-6) {
    return { shaft: `M ${from.x} ${from.y}`, head: '' };
  }

  const ux = dx / len;
  const uy = dy / len;
  // Never let the head eat more than 60% of a short arrow.
  const hl = Math.min(headLen, len * 0.6);
  const hw = hl * 0.5;

  const baseX = to.x - ux * hl;
  const baseY = to.y - uy * hl;
  // Perpendicular in screen space.
  const px = -uy;
  const py = ux;

  const shaftEndX = to.x - ux * hl * 0.85;
  const shaftEndY = to.y - uy * hl * 0.85;

  return {
    shaft: `M ${r(from.x)} ${r(from.y)} L ${r(shaftEndX)} ${r(shaftEndY)}`,
    head:
      `M ${r(to.x)} ${r(to.y)} `
      + `L ${r(baseX + px * hw)} ${r(baseY + py * hw)} `
      + `L ${r(baseX - px * hw)} ${r(baseY - py * hw)} Z`,
  };
}

/**
 * An arc for an angle marker — the incline's θ, the swept angle between two
 * force directions. `centre` and `r` are SCREEN pixels; the two angles are
 * PHYSICS degrees (CCW from +x).
 *
 * Because screen y is flipped, sweeping CCW in physics is CW on screen, so the
 * sweep-flag is 0 when toDeg > fromDeg.
 */
export function arcPath(
  centre: { x: number; y: number },
  radius: number,
  fromDeg: number,
  toDeg: number,
): string {
  const p = (deg: number) => ({
    x: centre.x + radius * Math.cos(deg2rad(deg)),
    y: centre.y - radius * Math.sin(deg2rad(deg)),
  });
  const a = p(fromDeg);
  const b = p(toDeg);
  const delta = toDeg - fromDeg;
  const largeArc = Math.abs(delta) > 180 ? 1 : 0;
  const sweep = delta > 0 ? 0 : 1;
  return `M ${r(a.x)} ${r(a.y)} A ${r(radius)} ${r(radius)} 0 ${largeArc} ${sweep} ${r(b.x)} ${r(b.y)}`;
}

/**
 * Where to put a label so it sits `dist` pixels out along a physics direction.
 * Returns a SCREEN-space offset (dy grows downward), ready to drop straight
 * into a `<text>` dx/dy or a transform.
 */
export function labelOffset(angleDeg: number, dist: number): { dx: number; dy: number } {
  const a = deg2rad(norm360(angleDeg));
  return { dx: r(Math.cos(a) * dist), dy: r(-Math.sin(a) * dist) };
}

/** Path coordinates rounded to 2 dp — shorter strings, no visible difference. */
function r(v: number): number {
  return Math.round(v * 100) / 100;
}

// ── View fitting ─────────────────────────────────────────────────────────────
// Added 2026-07-29 after a browser QA pass measured the FBD isolation canvas
// drawing its content into 7.7% of the available area (28.5% × 27.1% linear).
// A physics diagram that occupies a twelfth of its own canvas reads as broken
// no matter how correct the physics behind it is, so fitting is not cosmetic.

/** An axis-aligned world-space box. */
export interface Bounds {
  minX: number; minY: number; maxX: number; maxY: number;
}

/** Bounds of a point cloud. Returns null for an empty list — callers decide
 *  whether that is an empty scene or an authoring bug. */
export function boundsOf(points: Vec2[]): Bounds | null {
  if (!points.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return Number.isFinite(minX) ? { minX, minY, maxX, maxY } : null;
}

/** Grow a box by `m` metres on every side — room for arrowheads and labels. */
export function padBounds(b: Bounds, m: number): Bounds {
  return { minX: b.minX - m, minY: b.minY - m, maxX: b.maxX + m, maxY: b.maxY + m };
}

/** Union of two boxes; either may be null. */
export function unionBounds(a: Bounds | null, b: Bounds | null): Bounds | null {
  if (!a) return b;
  if (!b) return a;
  return {
    minX: Math.min(a.minX, b.minX), minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX), maxY: Math.max(a.maxY, b.maxY),
  };
}

export interface FitOptions {
  /** Fraction of the viewport left as breathing room. Default 0.10. */
  padFrac?: number;
  /** Never zoom in past this many px/m — stops a lone point filling the screen. */
  maxScale?: number;
  /** Never zoom out past this. */
  minScale?: number;
  /** Round the scale so a slider nudge doesn't jitter the whole diagram. */
  quantise?: boolean;
}

/**
 * Frame `content` inside a `w × h` pixel viewport.
 *
 * Uses the SAME scale on both axes — a stretched axis would make a 30° incline
 * look like 60° and silently contradict the readout beside it. That is a
 * correctness constraint, not a style choice.
 */
export function fitView(
  content: Bounds,
  w: number,
  h: number,
  opts: FitOptions = {}
): View {
  const { padFrac = 0.10, maxScale = 400, minScale = 2, quantise = true } = opts;
  const cw = Math.max(content.maxX - content.minX, 1e-6);
  const ch = Math.max(content.maxY - content.minY, 1e-6);
  const usableW = Math.max(w * (1 - 2 * padFrac), 1);
  const usableH = Math.max(h * (1 - 2 * padFrac), 1);
  let scale = Math.min(usableW / cw, usableH / ch);
  if (!Number.isFinite(scale) || scale <= 0) scale = minScale;
  scale = Math.min(maxScale, Math.max(minScale, scale));
  // Quantise to a 1% ladder: a slider drag then rescales in visible steps
  // instead of shimmering every frame.
  if (quantise) scale = Math.round(scale * 100) / 100;
  return {
    cx: (content.minX + content.maxX) / 2,
    cy: (content.minY + content.maxY) / 2,
    scale,
    w,
    h,
  };
}

/**
 * Fit, but never shrink below `floor` of the previous scale nor grow above
 * `ceil` of it. Re-fitting mid-drag is what made an earlier sim zoom out from
 * under the user's finger — hysteresis keeps the camera still while a handle is
 * being dragged and lets it settle afterwards.
 */
export function stableFit(
  content: Bounds,
  w: number,
  h: number,
  previous: View | null,
  opts: FitOptions & { floor?: number; ceil?: number } = {}
): View {
  const next = fitView(content, w, h, opts);
  if (!previous || previous.w !== w || previous.h !== h) return next;
  const { floor = 0.85, ceil = 1.18 } = opts;
  const ratio = next.scale / previous.scale;
  if (ratio > floor && ratio < ceil) {
    // Close enough — keep the old scale, just re-centre.
    return { ...previous, cx: next.cx, cy: next.cy, w, h };
  }
  return next;
}
