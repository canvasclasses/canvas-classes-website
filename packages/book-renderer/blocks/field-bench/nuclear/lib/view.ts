/*
 * nuclear/lib/view.ts — plot geometry, PURE, so canvas fill is measurable.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. `scripts/verify-modern-physics.mjs` calls these with the same
 * arguments the components pass, so "the curve fills 60–75% of its box at a
 * desktop AND a phone width" is a measurement rather than a hope. A chart that
 * letterboxes into 9% of its own area is invisible to tsc, to eslint and to the
 * physics checks — it was measured on Projectile Playground and cost a rebuild.
 *
 * ── WHY THIS IS NOT `fitView` FOR THE CURVE VIEWS ───────────────────────────
 * `mechanics-bench/lib/svg.ts fitView` frames WORLD content at ONE scale on both
 * axes, which is a correctness constraint when the axes share a unit (a metre up
 * must be a metre across, or a 30° incline looks like 60°). A binding-energy plot
 * has mass number on x and MeV on y: there is no shared unit, equal scaling is
 * meaningless, and forcing it would squash 9.5 MeV of range into 4% of a box
 * 245 units wide.
 *
 * ⚠ AND THERE IS A TRAP IN fitView AT THESE SCALES. It quantises scale onto a
 * 1% ladder (`Math.round(scale*100)/100`), so any fit needing a scale below 0.005
 * returns EXACTLY ZERO — a blank canvas with no error. It already happened at
 * planetary scale. A nuclear length is 10⁻¹⁵ m, so anything drawn in metres here
 * would hit it head on. Nothing in this file works in metres: the curve is
 * (A, MeV), the chart is (N, Z), the decay grid is a count. All dimensionless,
 * all O(1)–O(100), all safe. `fitView` IS used for the N–Z chart, where the axes
 * genuinely do share a unit (one nucleon), and it is passed an explicit
 * maxScale/minScale for exactly this reason.
 */

export interface PlotRect {
  /** Pixel box of the drawable area, inside the padding. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlotBox {
  /** The whole canvas, in pixels — equal to the viewBox, one unit = one CSS px. */
  width: number;
  height: number;
  rect: PlotRect;
}

/**
 * Padding, in pixels, scaled to the canvas.
 *
 * A fixed 56 px gutter is 9% of a desktop canvas and 17% of a phone one — the
 * exact mistake the projectile audit measured. Fractions of the smaller
 * dimension, clamped, keep the drawable fraction roughly constant across widths.
 */
export function plotPadding(width: number, height: number): { l: number; r: number; t: number; b: number } {
  const s = Math.min(width, height);
  const l = Math.round(Math.max(10, Math.min(26, s * 0.055)));
  return {
    l,
    r: Math.round(Math.max(8, Math.min(18, s * 0.035))),
    t: Math.round(Math.max(8, Math.min(18, s * 0.035))),
    b: Math.round(Math.max(10, Math.min(22, s * 0.05))),
  };
}

export function plotBox(width: number, height: number): PlotBox {
  const p = plotPadding(width, height);
  return {
    width,
    height,
    rect: {
      x: p.l,
      y: p.t,
      w: Math.max(1, width - p.l - p.r),
      h: Math.max(1, height - p.t - p.b),
    },
  };
}

/** Linear axis mapper. Returns a function from data value to pixel. */
export function axis(min: number, max: number, from: number, to: number): (v: number) => number {
  const span = max - min || 1;
  return (v: number) => from + ((v - min) / span) * (to - from);
}

/** What fraction of the canvas the drawable area covers, per axis. Linear,
 *  because that is what the eye reads — an area figure makes a wide flat plot
 *  look broken when it is correct. */
export function plotFill(box: PlotBox): { fx: number; fy: number } {
  return { fx: box.rect.w / box.width, fy: box.rect.h / box.height };
}

// ── The binding-energy curve's own axis limits ────────────────────────────────

export interface CurveLimits {
  aMin: number;
  aMax: number;
  eMin: number;
  eMax: number;
}

/**
 * Axis limits for a set of curve points.
 *
 * The y-axis starts at ZERO on purpose. A truncated y-axis would make the sag
 * from iron to uranium look like a cliff and the rise from hydrogen look modest,
 * inverting the visual weight of the two things the curve is for. The cost is
 * that the interesting band occupies the top third; that is paid back by the
 * shape being honest, and the readouts beside it carry the precision.
 */
export function curveLimits(points: { A: number; perNucleon: number }[]): CurveLimits {
  const aMax = points.reduce((m, p) => Math.max(m, p.A), 0);
  const eMax = points.reduce((m, p) => Math.max(m, p.perNucleon), 0);
  return {
    aMin: 0,
    aMax: Math.ceil((aMax + 8) / 10) * 10,
    eMin: 0,
    eMax: Math.ceil(eMax + 0.7),
  };
}

/** Ticks a student can read: round numbers, five or six of them, never 37 or
 *  8.317. Returned as data so the HTML tick strip and the SVG grid lines can
 *  never disagree about where they are. */
export function ticks(min: number, max: number, count = 5): number[] {
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
    out.push(Number(v.toFixed(6)));
  }
  return out;
}

// ── The decay grid ───────────────────────────────────────────────────────────

export interface DecayGrid {
  cols: number;
  rows: number;
  cell: number;
  dot: number;
  /** Pixel box the grid actually occupies. */
  used: { w: number; h: number };
}

/**
 * Lay `n` nuclei out as a grid inside a pixel box.
 *
 * Aspect-matched: the column count is chosen so the grid's own aspect ratio is
 * as close as possible to the box it must live in, which is what stops 400 dots
 * from being a thin strip in a tall frame. `dot` is capped so a small population
 * does not render as saucers.
 */
export function decayGrid(n: number, width: number, height: number): DecayGrid {
  const aspect = width / Math.max(height, 1);
  let cols = Math.max(1, Math.round(Math.sqrt(n * aspect)));
  cols = Math.min(cols, n);
  const rows = Math.ceil(n / cols);
  const cell = Math.min(width / cols, height / rows);
  return {
    cols,
    rows,
    cell,
    dot: Math.max(1.4, Math.min(cell * 0.34, 7)),
    used: { w: cols * cell, h: rows * cell },
  };
}

/** Fraction of the box the dot grid covers, per axis. */
export function decayGridFill(g: DecayGrid, width: number, height: number): { fx: number; fy: number } {
  return { fx: g.used.w / Math.max(width, 1), fy: g.used.h / Math.max(height, 1) };
}

// ── An arrow along the curve ─────────────────────────────────────────────────

export interface CurveArrow {
  x1: number; y1: number; x2: number; y2: number;
  /** Arrow-head polygon points, ready for an SVG `points` attribute. */
  head: string;
}

/**
 * The fission / fusion arrow: from where the nucleons were on the curve to
 * where they ended up. Head size in PIXELS, scaled to the canvas — a head in
 * data units would vanish on a phone and swamp a desktop.
 */
export function curveArrow(
  x1: number, y1: number, x2: number, y2: number, canvasMin: number,
): CurveArrow {
  const size = Math.max(5, Math.min(11, canvasMin * 0.022));
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  const px = -uy * size * 0.55;
  const py = ux * size * 0.55;
  return {
    x1, y1, x2: bx, y2: by,
    head: `${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`,
  };
}
