/*
 * semiconductor/lib/view.ts — plot geometry, PURE, so canvas fill is measurable.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. `scripts/verify-modern-physics.mjs` calls these with the same
 * arguments the components pass, so "the plot fills 60–75% of its box at a desktop
 * AND a phone width" is a measurement, not a hope. A chart letterboxed into 9% of
 * its own area is invisible to tsc, to eslint and to the physics checks.
 *
 * ⚠ WHY NOT `mechanics-bench/lib/svg.ts fitView` HERE. `fitView` frames WORLD
 * content at one scale on both axes, which is a correctness constraint when the
 * axes share a unit. None of these plots has that property — volts against amps,
 * volts against phase, electronvolts against nanometres — and forcing equal
 * scaling on unrelated units is meaningless. Worse, `fitView` quantises scale onto
 * a 1% ladder, so any fit needing a scale below 0.005 returns EXACTLY ZERO and
 * draws nothing with no error. A depletion width is ~4×10⁻⁷ m: in metres that trap
 * is unavoidable, which is why the junction view works in NANOMETRES and every
 * axis in this file is O(1)–O(100).
 */

export interface PlotRect { x: number; y: number; w: number; h: number }

export interface PlotBox {
  /** The whole canvas, in pixels — equal to the viewBox, one unit = one CSS px. */
  width: number;
  height: number;
  rect: PlotRect;
}

/**
 * Padding in pixels, as a fraction of the smaller dimension.
 *
 * A fixed gutter is 9% of a desktop canvas and 17% of a phone one — the exact
 * mistake the Projectile Playground audit measured. Fractions, clamped, keep the
 * drawable share roughly constant across widths.
 */
export function plotPadding(width: number, height: number): { l: number; r: number; t: number; b: number } {
  const s = Math.min(width, height);
  return {
    l: Math.round(Math.max(10, Math.min(26, s * 0.055))),
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

/** Linear axis mapper: data value → pixel. */
export function axis(min: number, max: number, from: number, to: number): (v: number) => number {
  const span = max - min || 1;
  return (v: number) => from + ((v - min) / span) * (to - from);
}

/** Drawable share of the canvas, per axis. Linear — an area figure makes a wide
 *  flat plot look broken when it is correct. */
export function plotFill(box: PlotBox): { fx: number; fy: number } {
  return { fx: box.rect.w / box.width, fy: box.rect.h / box.height };
}

/** Round ticks a student can read — never 37 or 8.317. Returned as data so the
 *  HTML tick strip and the SVG grid lines cannot disagree about where they are. */
export function ticks(min: number, max: number, count = 5): number[] {
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(raw) || 1)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
    out.push(Number(v.toFixed(6)));
  }
  return out.length >= 2 ? out : [min, max];
}

/**
 * A symmetric-log mapper for the diode I–V curve.
 *
 * The forward branch spans fifteen decades and the reverse branch is negative, so
 * neither a linear axis nor a plain log axis can show the whole characteristic. A
 * symmetric log — linear within ±`linear` of zero, logarithmic outside it — shows
 * the reverse leakage, the exponential rise AND the sign change on one axis, which
 * is the only way "the knee is an artefact of the linear axis" can be demonstrated
 * rather than asserted.
 */
export function symlog(linear: number, decades: number): (v: number) => number {
  const scale = decades + 1;
  return (v: number) => {
    const a = Math.abs(v);
    if (a <= linear) return v / linear / scale;
    const d = 1 + Math.log10(a / linear);
    return Math.sign(v) * Math.min(d, scale) / scale;
  };
}

// ── The junction view works in NANOMETRES ─────────────────────────────────────

/** Metres → nanometres. Every junction length is presented in nm: a depletion
 *  width of 4.3×10⁻⁷ m reads as 427 nm, which is a number, and it keeps the axis
 *  well clear of the quantisation trap described in the header. */
export const toNm = (metres: number): number => metres * 1e9;

/**
 * Axis limits for the band diagram, in nanometres.
 *
 * The x-range is symmetric-ish about the junction plane and always includes some
 * neutral bulk on each side, because "the bands are FLAT out here" is half the
 * lesson and cropping to the depletion region would remove it.
 */
export function junctionLimits(intoPnm: number, intoNnm: number): { xMin: number; xMax: number } {
  // ⚠ 0.55 MUST MATCH `junction.ts bandProfile`'s padding. When they disagreed
  // (1.6 there, 0.55 here) the ends of both band edges were drawn outside the plot
  // rect. The verifier asserts the two ranges are identical.
  const pad = Math.max(intoPnm + intoNnm, 1e-9) * 0.55;
  return { xMin: -(intoPnm + pad), xMax: intoNnm + pad };
}

// ── Waveform plots ───────────────────────────────────────────────────────────

/** A path string from sampled points, given the two axis mappers. */
export function polyline<T>(
  points: T[], px: (p: T) => number, py: (p: T) => number,
): string {
  return points
    .map((p, i) => `${i ? 'L' : 'M'}${px(p).toFixed(1)},${py(p).toFixed(1)}`)
    .join(' ');
}
