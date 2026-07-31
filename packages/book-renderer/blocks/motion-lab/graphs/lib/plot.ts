/*
 * motion-lab/graphs/lib/plot.ts — the three-panel stack, in ONE coordinate system.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. `scripts/verify-graphs.mjs` runs every rule here.
 *
 * ── WHY ONE SVG AND ONE TRANSFORM FOR ALL THREE GRAPHS ──────────────────────
 * `projectile/Field.tsx` puts the trajectory and its two 1-D strips in one SVG
 * with one clock and one sampler, because three SVGs in a flex row drift out of
 * alignment the moment the container resizes and the whole claim of that sim is
 * that the side dot is EXACTLY level with the ball. The same argument applies
 * with more force here: the claim of this module is that the x–t, v–t and a–t
 * panels are one dataset, and the visible proof of that is a single vertical
 * time cursor running unbroken through all three. If the panels were three
 * SVGs, that cursor would be three lines that agree to within a rounding error
 * — approximately one motion, which is exactly not the point.
 *
 * So: ONE viewBox, ONE shared time axis (drawn once, at the bottom), ONE cursor
 * line spanning the full stack. `sxT` is shared by every panel; only `syP`
 * differs, and it differs by the panel's own band and range.
 *
 * ── THE PHONE PROBLEM, SOLVED DELIBERATELY ──────────────────────────────────
 * Three stacked graphs on a 375 px phone is a real layout problem and the two
 * easy answers are both wrong. Dropping a panel below a breakpoint destroys the
 * only thing the sim teaches. Squeezing three panels into a 200 px box leaves
 * each one 60 px tall — under a finger, and too short to read a slope from.
 *
 * The answer taken here has three parts:
 *   1. THE CANVAS GROWS TALLER, THE PANELS DO NOT SHRINK. A phone has vertical
 *      scroll and no horizontal scroll, so height is the cheap axis. Each panel
 *      keeps a hard 96 px floor and the stack is however tall that needs.
 *   2. HEIGHT IS REALLOCATED, NEVER REMOVED. The panel being dragged expands
 *      and the other two fall back to the floor — total height is unchanged, so
 *      nothing below the canvas jumps when the student switches panels, and all
 *      three stay on screen.
 *   3. THE TIME AXIS IS DRAWN ONCE. Three separate axes would cost ~90 px of a
 *      phone screen to say the same thing three times. One shared axis is both
 *      cheaper and truer — it is one clock.
 *
 * ── AXIS SCALES ─────────────────────────────────────────────────────────────
 * One scale per axis PAIR: every panel shares the time scale exactly, and each
 * panel has its own y scale because metres, m/s and m/s² are not comparable
 * quantities. That is the same rule `waves/lib/plot.ts` states — equal x/y scale
 * is right for a SPATIAL canvas and destroys a graph — and it is not the
 * forbidden "stretch one axis independently", which would mean giving two
 * panels different TIME scales.
 */

import { ticks as niceTicks } from './kinematics';

export type PanelKey = 'x' | 'v' | 'a';

export interface Panel {
  key: PanelKey;
  /** viewBox y of the panel's top edge. */
  top: number;
  /** viewBox px. Never below `PANEL_MIN`. */
  h: number;
  yMin: number;
  yMax: number;
}

export interface Pad { l: number; r: number; t: number; b: number }

export interface Stack {
  /** viewBox === the measured CSS pixel box, so 1 unit = 1 device-independent
   *  pixel and a `fontSize={11}` really is 11 px to the eye. */
  w: number;
  h: number;
  pad: Pad;
  gap: number;
  tMin: number;
  tMax: number;
  panels: Panel[];
  narrow: boolean;
  /** On-canvas tick-label size. Never below the §2 10 px readable floor. */
  fs: number;
}

/**
 * Hard floor per panel. Below about this a linear stretch of graph is not
 * readable as a slope and a 44 px handle would not fit inside it.
 */
export const PANEL_MIN = 96;

/** Below this MEASURED container width the layout is narrow. An UNMEASURED
 *  width (0) counts as narrow — treating it as desktop has shipped as a bug. */
export const NARROW_AT = 640;
export const isNarrow = (w: number): boolean => w < NARROW_AT;

/** Share of the drawing height the focused panel takes. The other two split the
 *  rest and are floored at `PANEL_MIN`, so the sum is exact by construction. */
const OTHERS_SHARE = 0.27;

/** Minimum px between two time-axis labels. A four-character label at 11 px is
 *  under 28 px wide, so 52 px of spacing cannot collide — no text is measured;
 *  the tick COUNT is capped instead, which makes it correct by construction. */
const TICK_PITCH = 52;

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

export function padFor(narrow: boolean): Pad {
  // `l` holds the two y-axis labels per panel; `b` holds the ONE shared time
  // axis and its label row.
  return narrow
    ? { l: 36, r: 10, t: 10, b: 30 }
    : { l: 46, r: 14, t: 12, b: 32 };
}

const GAP = 10;

/**
 * How tall the canvas box should be, for a measured container width.
 *
 * NOT an aspect ratio, and that is the whole point. Every other canvas in this
 * engine takes the SHAPE of its content — but three stacked graphs need MORE
 * vertical room as the container gets narrower, not less, because the panels
 * cannot be allowed below their readable floor and the width no longer helps.
 * An aspect-driven sizer produces exactly the wrong answer on a phone: a 340 px
 * container would get a 240 px canvas and three 60 px panels.
 *
 * Quantised to 12 px steps so a slow container resize does not re-height the
 * page one pixel at a time and make every card below it twitch.
 */
export function stackHeight(w: number, panelCount = 3, maxH?: number): number {
  const narrow = isNarrow(w);
  const pad = padFor(narrow);
  const n = Math.max(1, panelCount);
  const base = narrow ? PANEL_MIN + 24 : clamp(Math.round((w * 0.185) / 4) * 4, 116, 168);
  const want = pad.t + base * n + GAP * (n - 1) + pad.b;
  const floor = pad.t + (PANEL_MIN + 8) * n + GAP * (n - 1) + pad.b;
  return Math.round(Math.max(floor, maxH != null ? Math.min(want, Math.max(floor, maxH)) : want));
}

export interface LayoutOpts {
  /** Which panel the student is currently editing; it gets the extra height. */
  focus?: PanelKey | null;
  /** Which panels to show, in order. Defaults to all three. */
  keys?: PanelKey[];
}

/**
 * Build the stack inside a box that has already been sized.
 *
 * `h` is passed in rather than computed here so there is exactly ONE decision
 * about how tall the canvas is (`stackHeight`, called by the frame that owns the
 * box) and the layout always fills precisely the box it was given. Two
 * independent height computations would leave a hairline of dead space that only
 * appears at some widths.
 *
 * `ranges` is keyed by panel so a caller cannot accidentally hand the v panel
 * the x window — a mistake that would draw a perfectly plausible graph of the
 * wrong quantity, which is the worst kind of wrong.
 */
export function layoutStack(
  w: number,
  h: number,
  tMin: number,
  tMax: number,
  ranges: Record<PanelKey, { min: number; max: number }>,
  opts: LayoutOpts = {}
): Stack {
  const narrow = isNarrow(w);
  const pad = padFor(narrow);
  const gap = GAP;
  const keys = opts.keys ?? (['x', 'v', 'a'] as PanelKey[]);
  const n = Math.max(1, keys.length);

  const available = Math.max(n * 40, h - pad.t - pad.b - gap * (n - 1));

  // Height allocation. The `Math.max(PANEL_MIN, …)` and `available − 2·others`
  // pair is what guarantees the three bands sum EXACTLY to `available` at every
  // width, focused or not — a per-panel clamp applied independently would leave
  // a one-pixel gap that shows as a hairline seam between panels.
  let heights: number[];
  const focusIdx = opts.focus ? keys.indexOf(opts.focus) : -1;
  if (focusIdx < 0 || n < 2) {
    heights = keys.map(() => available / n);
  } else {
    const others = Math.max(PANEL_MIN, Math.min(available / n, available * OTHERS_SHARE));
    const focused = available - others * (n - 1);
    heights = keys.map((_, i) => (i === focusIdx ? focused : others));
  }

  const panels: Panel[] = [];
  let top = pad.t;
  keys.forEach((key, i) => {
    const r = ranges[key];
    // A degenerate window would divide by zero in `syP`; widen it symmetrically
    // rather than letting the panel silently render as a flat line at the top.
    const span = r.max - r.min;
    const yMin = span > 1e-9 ? r.min : r.min - 1;
    const yMax = span > 1e-9 ? r.max : r.max + 1;
    panels.push({ key, top, h: heights[i], yMin, yMax });
    top += heights[i] + gap;
  });

  return {
    w: Math.max(w, 200),
    h: Math.round(h),
    pad,
    gap,
    tMin,
    tMax: tMax > tMin ? tMax : tMin + 1,
    panels,
    narrow,
    fs: narrow ? 10 : 11,
  };
}

// ── Transforms ───────────────────────────────────────────────────────────────

export const innerW = (s: Stack): number => Math.max(10, s.w - s.pad.l - s.pad.r);

/** Time → viewBox x. Shared by every panel: one clock, one axis. */
export const sxT = (s: Stack, t: number): number =>
  s.pad.l + ((t - s.tMin) / Math.max(1e-12, s.tMax - s.tMin)) * innerW(s);

/** viewBox x → time. */
export const utT = (s: Stack, x: number): number =>
  s.tMin + ((x - s.pad.l) / Math.max(1e-9, innerW(s))) * (s.tMax - s.tMin);

/** Value → viewBox y, inside a panel's own band. The one y-flip in this module. */
export const syP = (p: Panel, y: number): number =>
  p.top + p.h - ((y - p.yMin) / Math.max(1e-12, p.yMax - p.yMin)) * p.h;

/** viewBox y → value, inside a panel's band. Needed for every drag. */
export const uyP = (p: Panel, py: number): number =>
  p.yMin + ((p.top + p.h - py) / Math.max(1e-9, p.h)) * (p.yMax - p.yMin);

/** Which panel a pointer is over, or null in a gap / the axis row. */
export function panelAt(s: Stack, py: number): Panel | null {
  for (const p of s.panels) {
    if (py >= p.top && py <= p.top + p.h) return p;
  }
  return null;
}

/** The panel a drag belongs to, tolerant of a finger straying into the gap. */
export function nearestPanel(s: Stack, py: number): Panel {
  let best = s.panels[0];
  let bestD = Infinity;
  for (const p of s.panels) {
    const centre = p.top + p.h / 2;
    const d = Math.abs(py - centre);
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}

// ── Ticks ────────────────────────────────────────────────────────────────────

/** Shared time ticks, count-capped so labels cannot collide. */
export const timeTicks = (s: Stack): number[] =>
  niceTicks(s.tMin, s.tMax, Math.max(2, Math.floor(innerW(s) / TICK_PITCH)));

/**
 * The y labels for a panel: EXACTLY TWO, its window top and its window bottom.
 *
 * Two rather than a full tick ladder, and that is the whole collision proof.
 * They sit in the left gutter at the panel's own top and bottom edges, so they
 * are separated by at least `PANEL_MIN − 2·fontSize` ≈ 74 px vertically and can
 * never reach the time-axis row (which lives below `h − pad.b` and starts at
 * x ≥ pad.l). Every other number — the live value at the cursor, the areas, the
 * slopes — is in the colour-keyed legend below the canvas, per §4E.
 */
export function panelYLabels(p: Panel): { y: number; value: number }[] {
  return [
    { y: p.top + 9, value: p.yMax },
    { y: p.top + p.h - 3, value: p.yMin },
  ];
}

// ── Measurement, for the verifier ────────────────────────────────────────────

/**
 * How much of a panel a series actually covers, as a fraction per axis.
 *
 * "The graph is a flat line in the middle of an empty box" and "the graph is
 * clipped" are the same bug seen from two sides, and both are invisible to tsc.
 * `verify-fbd-fill.mjs` measures it for the mechanics boards and
 * `verify-motion-phase2.mjs` for the waves canvases; this is the same
 * discipline for the three panels.
 */
export function fillOf(
  s: Stack,
  p: Panel,
  series: { t: number; y: number }[]
): { fx: number; fy: number } {
  if (series.length < 2) return { fx: 0, fy: 0 };
  let tLo = Infinity, tHi = -Infinity, yLo = Infinity, yHi = -Infinity;
  for (const q of series) {
    if (!Number.isFinite(q.t) || !Number.isFinite(q.y)) continue;
    if (q.t < tLo) tLo = q.t;
    if (q.t > tHi) tHi = q.t;
    if (q.y < yLo) yLo = q.y;
    if (q.y > yHi) yHi = q.y;
  }
  if (!Number.isFinite(tLo)) return { fx: 0, fy: 0 };
  const wpx = Math.abs(sxT(s, tHi) - sxT(s, tLo));
  const hpx = Math.abs(syP(p, yHi) - syP(p, yLo));
  return { fx: wpx / innerW(s), fy: hpx / Math.max(1, p.h) };
}
