/*
 * motion-lab/waves/lib/plot.ts — the axis-independent plot transform.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Node-verifiable, and `scripts/verify-motion-phase2.mjs`
 * uses it to MEASURE how much of every canvas the drawing fills — the same
 * discipline `verify-fbd-fill.mjs` applies to the mechanics boards.
 *
 * ── WHY THIS EXISTS ALONGSIDE `mechanics-bench/lib/svg`'s `fitView` ─────────
 * `fitView`/`stableFit` force ONE scale on both axes, and they are right to:
 * a stretched y makes a 30° incline look like 60°. Every SPATIAL canvas in
 * Phase 2 uses them — the spring and pendulum bench, the reference circle, the
 * pipe, the tank — because in all of those, x and y are both metres and the
 * shape has to be honest.
 *
 * But a PV diagram's axes are pascals and cubic metres; a response curve's are
 * rad/s and metres; a wave's are metres and metres but at wildly different
 * magnitudes (a 4 m wavelength against a 0.03 m amplitude). Forcing equal scale
 * there does not preserve a shape, it destroys one — the curve degenerates to a
 * flat line filling 2% of the box. So graphs get their own transform, with each
 * axis fitted independently and the SAME 60–75% fill target enforced by the
 * verifier.
 *
 * ── WHERE THIS FILE LIVES ───────────────────────────────────────────────────
 * Shared by `waves/` and `thermo/`. Its natural home would be `motion-lab/lib/`,
 * which is the frozen E2 engine surface and is not ours to extend — so it sits
 * with the first consumer and `thermo/` imports it across.
 */

export interface Plot {
  /** Canvas box in CSS pixels — also the SVG viewBox, so 1 unit = 1 pixel. */
  w: number;
  h: number;
  /** Inner drawing area after padding. */
  pad: { l: number; r: number; t: number; b: number };
  xMin: number; xMax: number;
  yMin: number; yMax: number;
}

export interface Pad { l: number; r: number; t: number; b: number }

export const PLOT_PAD: Pad = { l: 34, r: 18, t: 18, b: 30 };

/**
 * Build a plot transform over an explicit data window.
 *
 * `padFrac` grows the y window symmetrically so a curve never touches the
 * frame. It is a FRACTION of the span rather than a fixed number of units,
 * because these plots span anything from 0.03 m to 3×10⁵ Pa.
 */
export function makePlot(
  w: number, h: number,
  window: { xMin: number; xMax: number; yMin: number; yMax: number },
  pad: Pad = PLOT_PAD,
  padFrac = 0.06
): Plot {
  const spanY = Math.max(window.yMax - window.yMin, 1e-12);
  const spanX = Math.max(window.xMax - window.xMin, 1e-12);
  return {
    w: Math.max(w, 40),
    h: Math.max(h, 40),
    pad,
    xMin: window.xMin - spanX * padFrac * 0.25,
    xMax: window.xMax + spanX * padFrac * 0.25,
    yMin: window.yMin - spanY * padFrac,
    yMax: window.yMax + spanY * padFrac,
  };
}

/** Data x → pixel x. */
export const px = (p: Plot, x: number): number =>
  p.pad.l + ((x - p.xMin) / Math.max(p.xMax - p.xMin, 1e-12)) * inner(p).w;

/** Data y → pixel y. The one y-flip in this module. */
export const py = (p: Plot, y: number): number =>
  p.h - p.pad.b - ((y - p.yMin) / Math.max(p.yMax - p.yMin, 1e-12)) * inner(p).h;

/** Pixel x → data x. Needed for drag-a-point-on-the-plot interactions. */
export const ux = (p: Plot, sxv: number): number =>
  p.xMin + ((sxv - p.pad.l) / Math.max(inner(p).w, 1e-9)) * (p.xMax - p.xMin);

export const uy = (p: Plot, syv: number): number =>
  p.yMin + ((p.h - p.pad.b - syv) / Math.max(inner(p).h, 1e-9)) * (p.yMax - p.yMin);

export const inner = (p: Plot): { w: number; h: number } => ({
  w: Math.max(p.w - p.pad.l - p.pad.r, 1),
  h: Math.max(p.h - p.pad.t - p.pad.b, 1),
});

/** An SVG path string through a data-space polyline. */
export function polyline(p: Plot, pts: { x: number; y: number }[], everyNth = 1): string {
  if (!pts.length) return '';
  let d = '';
  for (let i = 0; i < pts.length; i += everyNth) {
    d += `${i ? 'L' : 'M'}${px(p, pts[i].x).toFixed(1)},${py(p, pts[i].y).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += `L${px(p, last.x).toFixed(1)},${py(p, last.y).toFixed(1)}`;
  return d;
}

/** A closed, filled region between a polyline and a baseline y value. */
export function areaUnder(p: Plot, pts: { x: number; y: number }[], baseline: number): string {
  if (pts.length < 2) return '';
  const top = polyline(p, pts);
  const x0 = px(p, pts[0].x).toFixed(1);
  const x1 = px(p, pts[pts.length - 1].x).toFixed(1);
  const yb = py(p, baseline).toFixed(1);
  return `${top}L${x1},${yb}L${x0},${yb}Z`;
}

/** Bounds of a data-space point cloud, with sane fallbacks for an empty set. */
export function boundsOf(groups: { x: number; y: number }[][]): {
  xMin: number; xMax: number; yMin: number; yMax: number;
} {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const g of groups) {
    for (const q of g) {
      if (!Number.isFinite(q.x) || !Number.isFinite(q.y)) continue;
      if (q.x < xMin) xMin = q.x;
      if (q.x > xMax) xMax = q.x;
      if (q.y < yMin) yMin = q.y;
      if (q.y > yMax) yMax = q.y;
    }
  }
  if (!Number.isFinite(xMin)) return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
  if (xMax - xMin < 1e-12) { xMin -= 0.5; xMax += 0.5; }
  if (yMax - yMin < 1e-12) { yMin -= 0.5; yMax += 0.5; }
  return { xMin, xMax, yMin, yMax };
}

/**
 * LINEAR fill of the inner drawing area, per axis.
 *
 * Reported per axis rather than as an area figure, for the reason
 * `verify-fbd-fill.mjs` gives: an area number makes a legitimately tall, narrow
 * plot look broken. The Phase-2 target is 0.60–0.75 on the binding axis, and
 * anything over 1.0 is being cropped.
 */
export function fillOf(p: Plot, pts: { x: number; y: number }[]): { x: number; y: number } {
  if (!pts.length) return { x: 0, y: 0 };
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const q of pts) {
    const sxv = px(p, q.x);
    const syv = py(p, q.y);
    if (!Number.isFinite(sxv) || !Number.isFinite(syv)) continue;
    x0 = Math.min(x0, sxv); x1 = Math.max(x1, sxv);
    y0 = Math.min(y0, syv); y1 = Math.max(y1, syv);
  }
  const box = inner(p);
  return { x: (x1 - x0) / box.w, y: (y1 - y0) / box.h };
}

/** A "nice" tick step giving roughly `want` divisions — 1, 2 or 5 × a power
 *  of ten, so the gridlines land on numbers a student would choose. */
export function niceStep(span: number, want = 6): number {
  const raw = Math.abs(span) / Math.max(1, want);
  if (!(raw > 0)) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n >= 5 ? 5 : n >= 2 ? 2 : 1) * mag;
}

/** Tick positions across a window, on the nice ladder. */
export function ticks(min: number, max: number, want = 6): number[] {
  const s = niceStep(max - min, want);
  const out: number[] = [];
  for (let v = Math.ceil(min / s) * s; v <= max + 1e-9; v += s) out.push(Math.abs(v) < s / 1e6 ? 0 : v);
  return out;
}
