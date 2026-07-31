// Named, pedagogically-loaded graph constructions — the "standout, not generic"
// layer. The shelved 2026-06 grapher shipped 3 toy graphs on a white board; this
// is a curated library of interactives wired to the math-averse pedagogy
// (predict-first, concreteness fading, linked representations — see
// MATH_LIVEBOOK_PLAN.md §3). Each builder gets the live JXG namespace + a
// dark-themed board + author params, and draws with function-coordinate points
// so everything tracks its slider live (no JessieCode-scope dependency).
//
// Adding an archetype is a CODE ship (engineers). Faculty then pick it by key in
// the admin builder and tune it via params — no code. That split is the whole
// governance model (§2A).
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BOARD, TEXT, accentHex } from './theme';

type Params = Record<string, number | string | boolean>;

// Metadata for one live control. The underlying JSXGraph slider is created
// INVISIBLE (2026-07-24 redesign — see mkSlider below) and driven entirely by
// a real HTML <input type="range"> the renderer builds from this metadata, in
// a sidebar OUTSIDE the graph canvas. This is what fixed two founder-reported
// issues at once: sliders no longer float loose over the grid, and a JSXGraph
// "panel" element behind them (the previous approach) was itself draggable —
// a plain CSS div never can be.
export interface LiveSliderMeta {
  name: string;
  min: number;
  max: number;
  color: string;
  jxg: any;        // underlying JXG.Slider — renderer calls .setValue()/.Value()
  step?: number;    // e.g. 1 for an integer slider (power-family's n)
}

// What a slider-driven archetype hands back to the renderer:
//   • sliders  — the controls, rendered as HTML range inputs in the sidebar
//   • equation — a live formatter turning the current slider values into the
//     GOVERNING EQUATION string (e.g. "y = 0.84x + 2"), shown prominently under
//     the sliders. This is the drag→symbol link — the heart of the interactive
//     (founder feedback 2026-07-24: the equation was missing on some pages).
export interface ArchetypeResult {
  sliders?: LiveSliderMeta[];
  equation?: (vals: Record<string, number>) => string;
  // The STANDARD/general form of the equation, e.g. "y = {m}x + {c}", shown
  // pinned to the bottom of the graph. Slider names go in {braces} so the
  // renderer can colour each letter to match its slider — the student sees
  // that the blue "c" in the formula IS the blue slider they're dragging.
  // Without this the live equation alone ("y = x" at m=1, c=0) hides the
  // structure the student is supposed to be learning (founder, 2026-07-24).
  generalForm?: string;
  // Draws a FROZEN copy of the current main curve in a given `color` and
  // returns the JXG element (renderer manages the ring buffer + removal).
  // Powers "compare" (keep-this-curve family building) and the match-the-graph
  // GOAL curve. `goal: true` styles it as the dashed amber target. The curve's
  // identity (its equation) is carried in the HTML legend, NOT drawn on the
  // canvas (founder 2026-07-24: on-curve labels overlapped the lines).
  snapshot?: (opts?: { goal?: boolean; color?: string }) => { curve: any } | null;

  // Live "worked calculation" for one x — broken into the substitution and the
  // result so the calculation panel can show the FLOW (x → substitute → y),
  // e.g. { sub: '0.6·(2) + 0', y: 1.2 }. null if not expressible (abstract base).
  calc?: (vals: Record<string, number>, x: number) => { sub: string; y: number } | null;

  // Live, colour-coded key/value readouts (e.g. "sin θ = 0.90"), rendered as a
  // small boxed HTML panel matching the corner-legend's visual language — NEVER
  // raw canvas text. Founder 2026-07-24: unit-circle used to draw its sin/cos
  // readout straight onto the JSXGraph canvas via board.create('text', ...) —
  // small, unboxed, inconsistent with every other live value in the engine
  // (the equation card, the corner legend), which all render as bordered HTML
  // cards. This is the one shared mechanism for that pattern going forward.
  readouts?: (vals: Record<string, number>) => { label: string; value: string; color: string }[];
}
// Glider-driven archetypes (no sliders) may return nothing.
export type ArchetypeBuilder = (JXG: any, board: any, params: Params) => ArchetypeResult | void;

// Shared styling for a frozen curve copy (ghost trail or challenge goal).
function drawFrozen(board: any, fn: (x: number) => number, color: string, opts?: { goal?: boolean; color?: string }) {
  const goal = !!opts?.goal;
  const stroke = goal ? AMBER : (opts?.color ?? color);
  const curve = board.create('functiongraph', [fn], {
    strokeColor: stroke,
    strokeWidth: goal ? 2.5 : 2,
    dash: goal ? 3 : 0,
    strokeOpacity: goal ? 0.95 : 0.85,
    highlight: false, fixed: true, layer: 6,
  } as any);
  return { curve };
}

// ── Equation-string formatting for the live governing-equation display ──────
const nf = (n: number) => { const r = Math.round(n * 100) / 100; return Object.is(r, -0) ? '0' : String(r); };
// additive tail: 2 → " + 2", -3 → " − 3", 0 → "" (omitted)
const addTerm = (n: number) => { const r = Math.round(n * 100) / 100; if (r === 0) return ''; return r > 0 ? ` + ${nf(r)}` : ` − ${nf(-r)}`; };
// "(x − h)" rendered nicely: 0 → "x", 2 → "x − 2", -2 → "x + 2"
const xShift = (h: number) => { const r = Math.round(h * 100) / 100; if (r === 0) return 'x'; return r > 0 ? `x − ${nf(r)}` : `x + ${nf(-r)}`; };

const VIOLET = accentHex('violet');
const SKY = accentHex('sky');
const AMBER = accentHex('amber');
const EMERALD = accentHex('emerald');
const PINK = accentHex('pink');

function num(params: Params, key: string, fallback: number): number {
  const v = params[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function str(params: Params, key: string, fallback: string): string {
  const v = params[key];
  return typeof v === 'string' && v ? v : fallback;
}

// Creates a JXG slider that is never drawn on the canvas — position is a fixed
// dummy segment since it's only ever moved programmatically (via .setValue()
// from the HTML sidebar), never dragged in place. `.Value()` inside a
// functiongraph closure still works exactly as before; only the on-canvas
// visual is gone.
function mkSlider(board: any, name: string, min: number, max: number, start?: number, extraAttrs?: Record<string, any>) {
  const s = typeof start === 'number' ? start : (min + max) / 2;
  return board.create(
    'slider',
    [[0, 0], [1, 0], [min, s, max]],
    {
      name,
      visible: false,
      label: { visible: false },
      point1: { visible: false },
      point2: { visible: false },
      baseline: { visible: false },
      highline: { visible: false },
      ...(extraAttrs ?? {}),
    } as any,
  );
}

interface SliderDef {
  name: string; min: number; max: number; color: string; start?: number; extra?: Record<string, any>;
}

// Creates a set of invisible sliders and returns both a name→object map (for
// the archetype's own .Value() calls, unchanged) and the LiveSliderMeta[] the
// archetype should return so the renderer can build the HTML sidebar.
function mkSliderStack(board: any, defs: SliderDef[]): { sliders: Record<string, any>; meta: LiveSliderMeta[] } {
  const sliders: Record<string, any> = {};
  const meta: LiveSliderMeta[] = [];
  for (const d of defs) {
    const jxg = mkSlider(board, d.name, d.min, d.max, d.start, d.extra);
    sliders[d.name] = jxg;
    meta.push({ name: d.name, min: d.min, max: d.max, color: d.color, jxg, step: d.extra?.snapWidth });
  }
  return { sliders, meta };
}

const BASE_FUNCS: Record<string, (x: number) => number> = {
  square: (x) => x * x,
  abs: (x) => Math.abs(x),
  sqrt: (x) => Math.sqrt(Math.max(0, x)),
  sin: (x) => Math.sin(x),
  cube: (x) => x * x * x,
  recip: (x) => (x === 0 ? NaN : 1 / x),
  exp: (x) => Math.exp(x),
};

// Demo functions for the modulus-transform archetypes (Transforming Graphs chapter,
// 2026-07-25). Each is chosen to have a clear below-axis dip (parabola) or negative
// lobes (sine) so |f(x)|, f(|x|) and |y|=f(x) each show something dramatic. The
// label triple gives the live governing equation for each transform state.
const TFORM_DEMOS: Record<string, {
  f: (x: number) => number;
  base: string;   // f(x)
  absF: string;   // |f(x)|
  fAbs: string;   // f(|x|)
}> = {
  parabola: { f: (x) => x * x - 2 * x - 3, base: 'x² − 2x − 3', absF: '|x² − 2x − 3|', fAbs: '|x|² − 2|x| − 3' },
  sine:     { f: (x) => 2 * Math.sin(x),   base: '2 sin x',      absF: '|2 sin x|',      fAbs: '2 sin|x|' },
};
const tformDemo = (params: Params) => TFORM_DEMOS[str(params, 'demo', 'parabola')] ?? TFORM_DEMOS.parabola;

/**
 * Per-archetype default bounds (2026-07-27 — fixes a recurring defect: an
 * archetype block with no `spec.bounds` falls back to the engine's flat
 * `-6..6` default in MathGraphBoard.tsx, regardless of what the archetype
 * actually draws. For a unit-radius construction like `unit-circle`, that
 * strands a tiny circle in a mostly-empty ±6 board — first caught and patched
 * PER-PAGE on the Math book (2026-07-24, 4 instances), then reintroduced on
 * the Physics book because the fix lived on the page, not the archetype.
 * Fixing it HERE means every future page using these archetypes without an
 * explicit `spec.bounds` gets a sensible view automatically — the whole point
 * of an archetype existing as a reusable construction.
 *
 * `spec.bounds` (when an author sets it) always wins over this table; this is
 * only the fallback for archetype-mode blocks that don't set one.
 */
export interface ArchetypeBounds {
  xmin: number; xmax: number; ymin: number; ymax: number;
  /**
   * Opt out of equal-unit-scale. MathGraphBoard defaults archetype-mode boards
   * to `keepAspectRatio: true` (a circle must look round), but a few
   * archetypes plot quantities whose natural ranges differ by orders of
   * magnitude — 200 trials against a probability of 0.5, or 12 sequence terms
   * against values up to 30. Forcing those square makes the data a flat line.
   */
  keepSquare?: boolean;
}

/** Bounds may depend on the params that decide what gets drawn (r, shape, …). */
export type ArchetypeBoundsSpec = ArchetypeBounds | ((params: Params) => ArchetypeBounds);

/**
 * Content is a disc of radius `r` centred on the origin — the circle-theorem
 * family. Leaves 0.35r at the sides and 0.6r above the rim, which is where the
 * live-readout panel (top-right, up to 55% wide) and the equation panel
 * (top-left) float. Gives ~74% of the width to the actual construction against
 * the 50% the generic ±6 box managed at r = 3.
 */
const radial = (r: number): ArchetypeBounds => ({
  xmin: -1.35 * r, xmax: 1.35 * r, ymin: -1.3 * r, ymax: 1.6 * r,
});

/**
 * Fit an explicit content box, padding the sides and leaving extra room at the
 * top for the overlay panels, then equalise the two spans about their centres
 * so `keepAspectRatio` has nothing left to silently stretch.
 */
const fit = (x0: number, x1: number, y0: number, y1: number): ArchetypeBounds => {
  const w = Math.max(x1 - x0, 0.001);
  const h = Math.max(y1 - y0, 0.001);
  let xmin = x0 - 0.12 * w, xmax = x1 + 0.12 * w;
  let ymin = y0 - 0.12 * h, ymax = y1 + 0.34 * h;
  const span = Math.max(xmax - xmin, ymax - ymin);
  const cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
  xmin = cx - span / 2; xmax = cx + span / 2;
  ymin = cy - span / 2; ymax = cy + span / 2;
  return { xmin, xmax, ymin, ymax };
};

/**
 * Per-archetype default bounds (2026-07-27, completed for all 35 on 2026-07-29).
 *
 * THE RECURRING DEFECT THIS FIXES: an archetype block with no `spec.bounds`
 * falls back to the engine's flat `-6..6` box in MathGraphBoard.tsx regardless
 * of what the archetype actually draws. For a unit-radius construction that
 * strands a tiny circle in a mostly-empty board — caught and patched PER-PAGE
 * on the Math book (2026-07-24, 4 instances), then reintroduced on the Physics
 * book because the fix lived on the page, not the archetype. It was fixed here
 * for `unit-circle` on 2026-07-27; the founder then asked for all the rest
 * ("work through them and perfect them", 2026-07-29).
 *
 * Two of these were not merely wasteful but genuinely CLIPPED at ±6 — the
 * circle-area strip is ~19 units wide and the Gauss staircase reaches y = 13.
 *
 * `spec.bounds` always wins over this table; it is only the archetype-mode
 * fallback. Entries may be a function of `params`, so overriding `r` (or the
 * shape / base / demo) still yields a correct view instead of re-breaking.
 */
export const ARCHETYPE_DEFAULT_BOUNDS: Record<string, ArchetypeBoundsSpec> = {
  // ── Trigonometry ──────────────────────────────────────────────────────────
  // Radius-1 circle + its sin/cos legs.
  'unit-circle': radial(1),

  // ── Function-graph family ─────────────────────────────────────────────────
  // Sliders reach h,k = ±4, so the curve genuinely needs the wide box; ±6 was
  // already right. Kept explicit so nobody "optimises" it later.
  transformations: { xmin: -7, xmax: 7, ymin: -7, ymax: 7 },
  'shift-explorer': { xmin: -7, xmax: 7, ymin: -7, ymax: 7 },
  'stretch-explorer': { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
  'power-family': { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
  'line-explorer': { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
  // y = aˣ is positive everywhere, so half the default box was dead space.
  // a tops out at 4, and 4^2 = 16 already leaves the view — x ±3.5 is the
  // honest interesting range.
  'exp-base-explorer': fit(-3.5, 3.5, 0, 6),
  // |x| — the whole graph is above the axis. ±4 not ±5: at ±5 the equalised span
  // came out at 12.4, marginally WIDER than the generic box it replaces.
  'piecewise-highlight': fit(-4, 4, 0, 4),
  // Base 'cube': x³ passes ±6 by x = ±1.8, so a ±6 box showed a near-vertical
  // line. Tighter box, plus non-square so the cubic's shape is legible.
  'even-odd-mirror': (p) => (str(p, 'base', 'cube') === 'cube'
    ? { xmin: -3, xmax: 3, ymin: -8, ymax: 8, keepSquare: false }
    : fit(-4, 4, -4, 4)),
  // Tangent/area boards: the default 'square' base lives above the axis.
  'tangent-explorer': (p) => (str(p, 'base', 'square') === 'square'
    ? fit(-4, 4, 0, 8) : { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }),
  'area-under-curve': (p) => (str(p, 'base', 'square') === 'square'
    ? fit(-4, 4, 0, 6) : { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }),
  // Step function reads the board box and draws to fit it, so it only needs a
  // sensible window — a tighter one makes each unit step much clearer.
  'step-explorer': fit(-4, 4, -4, 4),
  // sin/cos against y = m·x, m ≤ 1. The wave is ±1 while the line reaches ±8,
  // so this cannot be square without flattening the wave to nothing.
  'intersection-counter': { xmin: -11, xmax: 11, ymin: -2.6, ymax: 2.6, keepSquare: false },
  // Modulus fold/mirror demos. The parabola x²−2x−3 has its vertex at (1,−4)
  // and roots at −1 and 3; the sine demo is 2·sin x.
  'modulus-abs-f': (p) => (str(p, 'demo', 'parabola') === 'sine'
    ? { xmin: -7, xmax: 7, ymin: -3.2, ymax: 3.2, keepSquare: false }
    : fit(-4, 6, -4.5, 5)),
  'modulus-inner-abs': (p) => (str(p, 'demo', 'parabola') === 'sine'
    ? { xmin: -7, xmax: 7, ymin: -3.2, ymax: 3.2, keepSquare: false }
    : fit(-6, 6, -4.5, 5)),
  'modulus-abs-y': (p) => (str(p, 'demo', 'parabola') === 'sine'
    ? { xmin: -7, xmax: 7, ymin: -3.2, ymax: 3.2, keepSquare: false }
    : fit(-4, 6, -5, 5)),

  // ── Coordinate geometry (draggable points) ────────────────────────────────
  // Bounds cover the seed points plus room to drag them well past their start.
  // NOTE: no extra manual pad here — `fit` already adds 12% at the sides/bottom
  // and 34% at the top. Adding a fixed ±1..±2 on top of that double-padded these
  // boards down to 43–51% of the width, i.e. straight back into the waste this
  // whole exercise was about. Content now gets ~81%.
  // The origin is forced into view for every coordinate-geometry board: these
  // pages are about READING coordinates, so the axes have to be on screen. A
  // tight fit to just P and Q pushed the origin outside the box on the live
  // Class 9 distance-formula page, which would have hidden both axes.
  'distance-explorer': (p) => fit(
    Math.min(0, num(p, 'x1', 1), num(p, 'x2', 6)), Math.max(0, num(p, 'x1', 1), num(p, 'x2', 6)),
    Math.min(0, num(p, 'y1', 1), num(p, 'y2', 5)), Math.max(0, num(p, 'y1', 1), num(p, 'y2', 5))),
  'midpoint-explorer': (p) => fit(
    Math.min(0, num(p, 'x1', -2), num(p, 'x2', 4)), Math.max(0, num(p, 'x1', -2), num(p, 'x2', 4)),
    Math.min(0, num(p, 'y1', 1), num(p, 'y2', 5)), Math.max(0, num(p, 'y1', 1), num(p, 'y2', 5))),
  'collinearity-checker': (p) => fit(
    Math.min(0, num(p, 'x1', -3), num(p, 'x2', 1), num(p, 'x3', 5)), Math.max(0, num(p, 'x1', -3), num(p, 'x2', 1), num(p, 'x3', 5)),
    Math.min(0, num(p, 'y1', -2), num(p, 'y2', 1), num(p, 'y3', 4)), Math.max(0, num(p, 'y1', -2), num(p, 'y2', 1), num(p, 'y3', 4))),
  // The circumCIRCLE reaches beyond the triangle's own bounding box, so this one
  // keeps a small pad — enough for a typical circumradius, not the old ±2.
  'circumcircle-explorer': (p) => fit(
    Math.min(num(p, 'x1', -2), num(p, 'x2', 2), num(p, 'x3', 3)) - 0.7, Math.max(num(p, 'x1', -2), num(p, 'x2', 2), num(p, 'x3', 3)) + 0.7,
    Math.min(num(p, 'y1', -1), num(p, 'y2', 2), num(p, 'y3', -2)) - 0.7, Math.max(num(p, 'y1', -1), num(p, 'y2', 2), num(p, 'y3', -2)) + 0.7),
  // P and its mirror image are symmetric about an axis, so the content box is
  // already centred on the origin — `fit` is the wrong tool here: its 34% top
  // pad plus span-equalising blew a (3,4) point out to a span of 14.6, WIDER
  // than the ±6 box it was meant to improve on. A symmetric radial box is both
  // tighter and correctly centred.
  'reflection': (p) => radial(Math.max(Math.abs(num(p, 'x', 3)), Math.abs(num(p, 'y', 4)))),
  'circle-locus-explorer': { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5 },

  // ── Circle theorems (r defaults to 3) ─────────────────────────────────────
  'inscribed-angle-explorer': (p) => radial(num(p, 'r', 3)),
  'chord-distance-explorer': (p) => radial(num(p, 'r', 3)),
  'circle-anatomy-explorer': (p) => radial(num(p, 'r', 3)),
  'chord-perpendicular-bisector': (p) => radial(num(p, 'r', 3)),
  'circle-symmetry-explorer': (p) => radial(num(p, 'r', 3)),
  'sector-explorer': (p) => radial(num(p, 'r', 3)),
  // With constrainD:false the 4th vertex starts at 1.4r, outside the circle.
  'cyclic-quad-explorer': (p) => radial(num(p, 'r', 3) * (p.constrainD === false || p.constrainD === 'false' ? 1.55 : 1)),
  // Circle shape is a disc of radius r; the parabola/cubic shapes are curves
  // that need the wide window instead.
  'vlt-sweep': (p) => (str(p, 'shape', 'circle') === 'circle'
    ? radial(num(p, 'r', 3)) : { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }),

  // ── Constructions and proofs ──────────────────────────────────────────────
  // WAS CLIPPED at ±6: the circle sits at y = 1.7r and the rearranged strip is
  // 2πr ≈ 18.8 units wide, so a third of the proof was off-screen.
  'circle-area-slice-rearrange': (p) => {
    const r = num(p, 'r', 3);
    return fit(-Math.PI * r, Math.PI * r, -r, r * 2.7);
  },
  // WAS CLIPPED at ±6: the Gauss rectangle is n × (n+1), and n reaches 12.
  'sum-pairing-proof': (p) => {
    const n = Math.max(2, Math.min(12, num(p, 'n', 5)));
    const top = Math.max(n, 6) + 1;
    return fit(0, Math.max(n, 6), 0, top);
  },
  // Spiral of Theodorus — 16 unit legs wind out to about √17 ≈ 4.1.
  'surd-spiral-construction': fit(-4.4, 2.2, -1.6, 4.4),
  'parallelogram-to-rectangle': (p) => fit(0, num(p, 'b', 5) + num(p, 's', 2), 0, num(p, 'h', 3)),
  'triangle-pair-to-parallelogram': (p) => fit(0, num(p, 'b', 5) + num(p, 'c', 1.5), 0, num(p, 'h', 3)),

  // ── Data plots — genuinely non-square ─────────────────────────────────────
  // 200 trials against a probability in [0,1]. Square aspect made this a flat
  // line pinned to the axis; it is the worst mismatch in the whole set.
  'trial-convergence': (p) => ({
    xmin: -12, xmax: 212, ymin: -0.12, ymax: Math.max(1.08, num(p, 'p', 0.5) + 0.55), keepSquare: false,
  }),
  // n terms (x ≤ 12) against values whose size depends entirely on the seed —
  // non-square, because 6 terms against values up to 11 cannot be shown square.
  // Framed from the SEEDED a and d/r, NOT from the sliders' extremes: sizing for
  // a_max = 30 when the page opens on a = 1, d = 2 (the live Class 9 pattern
  // page) squashed the actual points into the bottom sliver of the board.
  'sequence-pattern': (p) => {
    const kind = str(p, 'kind', 'ap');
    const terms = Math.max(3, Math.min(12, num(p, 'terms', 8)));
    const a = num(p, 'a', kind === 'gp' ? 2 : 10);
    const step = kind === 'gp' ? num(p, 'r', 2) : num(p, 'd', 0);
    const last = kind === 'gp' ? a * Math.pow(step, terms - 1) : a + (terms - 1) * step;
    const lo = Math.min(0, a, last);
    const hi = Math.max(a, last, 1);
    const padY = Math.max(1, (hi - lo) * 0.2);
    return { xmin: -0.6, xmax: terms + 0.9, ymin: lo - padY, ymax: hi + padY * 1.6, keepSquare: false };
  },
};

/** Resolve an archetype's default bounds, honouring params-aware entries. */
export function resolveArchetypeBounds(archetype: string | undefined, params: Params): ArchetypeBounds | undefined {
  if (!archetype) return undefined;
  const entry = ARCHETYPE_DEFAULT_BOUNDS[archetype];
  if (!entry) return undefined;
  return typeof entry === 'function' ? entry(params ?? {}) : entry;
}

export const ARCHETYPES: Record<string, ArchetypeBuilder> = {
  // TRANSFORMATIONS — the workhorse of the Functions chapter. Sliders a,b,h,k
  // reshape a base function y = a·f(b·(x−h)) + k against a ghost of the original,
  // so students SEE each parameter's role. params.base ∈ BASE_FUNCS keys.
  transformations: (_JXG, board, params) => {
    const baseKey = str(params, 'base', 'square');
    const f = BASE_FUNCS[baseKey] ?? BASE_FUNCS.square;
    const { sliders, meta } = mkSliderStack(board, [
      { min: -3, max: 3, name: 'a', color: VIOLET, start: 1 },
      { min: -3, max: 3, name: 'b', color: SKY, start: 1 },
      { min: -4, max: 4, name: 'h', color: AMBER, start: 0 },
      { min: -4, max: 4, name: 'k', color: EMERALD, start: 0 },
    ]);
    const { a, b, h, k } = sliders;
    // ghost original
    board.create('functiongraph', [f], {
      strokeColor: TEXT.ghost, strokeWidth: 1.5, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    // transformed
    board.create('functiongraph', [
      (x: number) => a.Value() * f(b.Value() * (x - h.Value())) + k.Value(),
    ], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'y = {a}·f({b}(x − {h})) + {k}',
      equation: (v) => {
        const inner = v.b === 1 ? xShift(v.h) : (v.h === 0 ? `${nf(v.b)}x` : `${nf(v.b)}(${xShift(v.h)})`);
        const fp = v.a === 1 ? `f(${inner})` : v.a === -1 ? `−f(${inner})` : `${nf(v.a)}·f(${inner})`;
        return `y = ${fp}${addTerm(v.k)}`;
      },
      snapshot: (opts) => {
        const av = a.Value(), bv = b.Value(), hv = h.Value(), kv = k.Value();
        return drawFrozen(board, (x: number) => av * f(bv * (x - hv)) + kv, VIOLET, opts);
      },
    };
  },

  // UNIT CIRCLE — anchor for trigonometry. A point rotates; its height is sin θ,
  // its shadow is cos θ. Makes periodicity/sign visible before the ratios.
  'unit-circle': (_JXG, board, _params) => {
    board.create('circle', [[0, 0], 1], {
      strokeColor: '#ffffff33', strokeWidth: 1.5, fillColor: 'none', highlightStrokeColor: '#ffffff33',
    } as any);
    const uc = mkSliderStack(board, [
      { min: 0, max: 6.283, name: 'θ', color: SKY },
    ]);
    const t = uc.sliders['θ'];
    const P = board.create('point', [() => Math.cos(t.Value()), () => Math.sin(t.Value())], {
      name: 'P', size: 4, fillColor: VIOLET, strokeColor: VIOLET,
      label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [[0, 0], P], { strokeColor: VIOLET, strokeWidth: 2 } as any);
    // sin (vertical) & cos (horizontal) legs
    board.create('segment', [P, [() => Math.cos(t.Value()), 0]], {
      strokeColor: AMBER, strokeWidth: 2, dash: 0,
    } as any);
    board.create('segment', [[0, 0], [() => Math.cos(t.Value()), 0]], {
      strokeColor: EMERALD, strokeWidth: 2,
    } as any);
    return {
      sliders: uc.meta,
      generalForm: 'P = (cos {θ}, sin {θ})',
      equation: (v) => `P = (cos ${nf(v['θ'])}, sin ${nf(v['θ'])})`,
      readouts: (v) => [
        { label: 'sin θ', value: nf(Math.sin(v['θ'])), color: AMBER },
        { label: 'cos θ', value: nf(Math.cos(v['θ'])), color: EMERALD },
      ],
    };
  },

  // TANGENT EXPLORER — drag P along a curve; the tangent follows. Concrete entry
  // to the derivative-as-slope idea (Limits & Derivatives). params.expr optional.
  'tangent-explorer': (_JXG, board, params) => {
    const which = str(params, 'base', 'square');
    const f = BASE_FUNCS[which] ?? BASE_FUNCS.square;
    const curve = board.create('functiongraph', [f], {
      strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY,
    } as any);
    const p = board.create('glider', [1, f(1), curve], {
      name: 'P', size: 5, fillColor: VIOLET, strokeColor: VIOLET,
      label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('tangent', [p], { strokeColor: AMBER, strokeWidth: 2, dash: 0 } as any);
  },

  // AREA UNDER CURVE — drag the interval ends; the shaded area updates. Concrete
  // entry to the definite integral. params.base optional.
  'area-under-curve': (_JXG, board, params) => {
    const which = str(params, 'base', 'square');
    const f = which === 'square' ? (x: number) => 0.3 * x * x + 1 : (BASE_FUNCS[which] ?? BASE_FUNCS.square);
    const curve = board.create('functiongraph', [f], {
      strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY,
    } as any);
    board.create('integral', [[-2, 2], curve], {
      fillColor: AMBER, fillOpacity: 0.28,
      curveLeft: { color: AMBER, size: 4 }, curveRight: { color: AMBER, size: 4 },
    } as any);
  },

  // REFLECTION — a draggable point and its mirror image. Coordinate geometry /
  // even–odd function symmetry. params.axis ∈ 'x' | 'y' | 'origin'.
  // Rewritten 2026-07-24: the previous version used JXG's 'reflection'
  // transform against `board.defaultAxes.x/y`, but MathGraphBoard disables
  // JSXGraph's automatic axes (`axis: false`, drawn manually instead — see
  // step-explorer's own comment on this exact gotcha) so `board.defaultAxes`
  // is never populated — the mirror point silently failed to render (caught
  // by the archetype try/catch, logged, nothing drawn). Fixed by computing
  // the mirrored coordinates directly as a dependent point, which also lets
  // this support the third rule (reflection in the ORIGIN) the built-in JXG
  // transform has no direct equivalent for.
  reflection: (_JXG, board, params) => {
    const axis = str(params, 'axis', 'y'); // 'x' | 'y' | 'origin'
    const x0 = num(params, 'x', 3), y0 = num(params, 'y', 4);
    const a = board.create('point', [x0, y0], {
      name: 'P', size: 4, fillColor: VIOLET, strokeColor: VIOLET,
      label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const mirrorX = () => (axis === 'x' ? a.X() : -a.X());
    const mirrorY = () => (axis === 'y' ? a.Y() : -a.Y());
    const refl = board.create('point', [mirrorX, mirrorY], {
      name: "P'", size: 4, fillColor: SKY, strokeColor: SKY, fixed: true,
      label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [a, refl], { strokeColor: '#ffffff33', dash: 2 } as any);
    const rule = axis === 'x' ? '(x, y) → (x, −y)' : axis === 'origin' ? '(x, y) → (−x, −y)' : '(x, y) → (−x, y)';
    return {
      generalForm: rule,
      readouts: () => [
        { label: 'P', value: `(${nf(a.X())}, ${nf(a.Y())})`, color: VIOLET },
        { label: "P'", value: `(${nf(refl.X())}, ${nf(refl.Y())})`, color: SKY },
      ],
    };
  },

  // SEQUENCE PATTERN — plots the terms of an arithmetic (or geometric) sequence
  // as discrete points, sliders for the first term and common difference/ratio.
  // Growing-pattern entry to Sequences & Series. params.kind ∈ 'ap' | 'gp'.
  // Ranges widened + made overridable 2026-07-24 (Class 9 Ch.8 audit): the
  // original -3..5 / -3..3 / 0.2..2.5 ranges were sized for toy examples and
  // couldn't reach real textbook numbers (a bounce-height GP with a=24, an AP
  // with d=4). params.a / params.d / params.r seed the START value (so a page
  // can open exactly on its own worked example); params.a_min/a_max/step_min/
  // step_max widen the DRAG range further still, for pages that want it.
  'sequence-pattern': (_JXG, board, params) => {
    const kind = str(params, 'kind', 'ap');
    const nMax = Math.max(3, Math.min(12, num(params, 'terms', 8)));
    const dName = kind === 'gp' ? 'r' : 'd';
    const aMin = num(params, 'a_min', -10);
    const aMax = num(params, 'a_max', 30);
    const stepDefaultMin = kind === 'gp' ? 0.2 : -6;
    const stepDefaultMax = kind === 'gp' ? 4 : 6;
    const stepMin = num(params, 'step_min', stepDefaultMin);
    const stepMax = num(params, 'step_max', stepDefaultMax);
    const { sliders: seqSliders, meta: seqMeta } = mkSliderStack(board, [
      { min: aMin, max: aMax, name: 'a', color: VIOLET, start: num(params, 'a', (aMin + aMax) / 2) },
      { min: stepMin, max: stepMax, name: dName, color: SKY, start: num(params, dName, (stepMin + stepMax) / 2) },
    ]);
    const first = seqSliders['a'];
    const d = seqSliders[dName];
    for (let n = 1; n <= nMax; n++) {
      board.create('point', [
        n,
        () => (kind === 'gp' ? first.Value() * Math.pow(d.Value(), n - 1) : first.Value() + (n - 1) * d.Value()),
      ], {
        name: '', size: 3.5, fillColor: AMBER, strokeColor: AMBER, fixed: true, showInfobox: true,
      } as any);
    }
    return {
      sliders: seqMeta,
      generalForm: kind === 'gp' ? 'aₙ = {a}·{r}^(n−1)' : 'aₙ = {a} + (n−1)·{d}',
      equation: (v) => kind === 'gp'
        ? `aₙ = ${nf(v.a)} · ${nf(v.r)}^(n−1)`
        : `aₙ = ${nf(v.a)} + (n−1)·${nf(v.d)}`,
    };
  },

  // LINE EXPLORER — y = m·x + c with sliders. The canonical Straight-Lines linked
  // interactive (pair with a table in spec mode for full multi-representation).
  'line-explorer': (_JXG, board, _params) => {
    const { sliders, meta } = mkSliderStack(board, [
      { min: -4, max: 4, name: 'm', color: VIOLET, start: 1 },
      { min: -5, max: 5, name: 'c', color: SKY, start: 0 },
    ]);
    const { m, c } = sliders;
    board.create('functiongraph', [(x: number) => m.Value() * x + c.Value()], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    board.create('point', [0, () => c.Value()], {
      name: 'y-intercept', size: 3.5, fillColor: AMBER, strokeColor: AMBER, fixed: true,
      label: { strokeColor: TEXT.secondary, fontSize: 11 },
    } as any);
    return {
      sliders: meta,
      generalForm: 'y = {m}x + {c}',
      equation: (v) => {
        const mt = v.m === 0 ? '' : v.m === 1 ? 'x' : v.m === -1 ? '−x' : `${nf(v.m)}x`;
        return mt === '' ? `y = ${nf(v.c)}` : `y = ${mt}${addTerm(v.c)}`;
      },
      calc: (v, x) => ({ sub: `${nf(v.m)}·(${x})${addTerm(v.c)}`, y: v.m * x + v.c }),
      snapshot: (opts) => {
        const mv = m.Value(), cv = c.Value();
        return drawFrozen(board, (x: number) => mv * x + cv, VIOLET, opts);
      },
    };
  },

  // ── New archetypes for the Relations & Functions chapter (2026-07-23) ──────
  // All create their OWN invisible x-axis line for gliders (board.defaultAxes is
  // not populated because MathGraphBoard draws axes manually), and use invisible
  // helper points for any dynamic segment (robust across JSXGraph versions).

  // STEP EXPLORER — greatest-integer [x] (floor) or ceiling ⌈x⌉. Drag x along the
  // axis; read the step value; y=x ghost shows "floor lies on/below y=x". The
  // NCERT greatest-integer function, near-impossible to teach from a static image.
  // params.kind ∈ 'floor' | 'ceil'.
  'step-explorer': (_JXG, board, params) => {
    const kind = str(params, 'kind', 'floor');
    const step = kind === 'ceil' ? Math.ceil : Math.floor;
    const label = kind === 'ceil' ? '⌈x⌉' : '[x]';
    board.create('functiongraph', [(x: number) => x], {
      strokeColor: TEXT.ghost, strokeWidth: 1.25, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    const bb = board.getBoundingBox(); // [xmin, ymax, xmax, ymin]
    const lo = Math.floor(bb[0]) - 1;
    const hi = Math.ceil(bb[2]) + 1;
    for (let k = lo; k <= hi; k++) {
      const x0 = kind === 'ceil' ? k - 1 : k;
      const x1 = kind === 'ceil' ? k : k + 1;
      board.create('segment', [[x0, k], [x1, k]], { strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY } as any);
      const closedX = kind === 'ceil' ? x1 : x0;
      const openX = kind === 'ceil' ? x0 : x1;
      board.create('point', [closedX, k], { name: '', size: 2.5, fillColor: SKY, strokeColor: SKY, fixed: true } as any);
      board.create('point', [openX, k], { name: '', size: 2.5, fillColor: BOARD.canvas, strokeColor: SKY, fixed: true } as any);
    }
    const xAxis = board.create('line', [[0, 0], [1, 0]], { visible: false, fixed: true } as any);
    const P = board.create('glider', [1.4, 0, xAxis], {
      name: 'x', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    const onCurve = board.create('point', [() => P.X(), () => step(P.X())], {
      name: '', size: 4, fillColor: AMBER, strokeColor: AMBER, fixed: true,
    } as any);
    const foot = board.create('point', [() => P.X(), 0], { visible: false } as any);
    board.create('segment', [foot, onCurve], { strokeColor: '#ffffff33', dash: 1 } as any);
    board.create('text', [() => bb[0] + 0.4, () => bb[3] + 0.7,
      () => `${label} = ${step(P.X())}    (x = ${P.X().toFixed(2)})`], {
      strokeColor: TEXT.secondary, fontSize: 14,
    } as any);
  },

  // VLT SWEEP — the Vertical-Line Test. Drag a vertical line across a shape; a
  // live counter shows how many times it crosses, with the verdict. On a circle
  // it crosses twice (NOT a function); on a parabola once (a function).
  // params.shape ∈ 'parabola' | 'circle' | 'cubic', params.r (circle radius).
  'vlt-sweep': (_JXG, board, params) => {
    const shape = str(params, 'shape', 'circle');
    const r = num(params, 'r', 3);
    let crossings: (a: number) => number;
    if (shape === 'circle') {
      board.create('circle', [[0, 0], r], {
        strokeColor: SKY, strokeWidth: 2.5, fillColor: 'none', highlightStrokeColor: SKY,
      } as any);
      crossings = (a) => (Math.abs(a) < r ? 2 : Math.abs(a) === r ? 1 : 0);
    } else {
      const f = shape === 'cubic' ? (x: number) => 0.25 * x * x * x : (x: number) => 0.4 * x * x - 2;
      board.create('functiongraph', [f], { strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY } as any);
      crossings = () => 1;
    }
    const xAxis = board.create('line', [[0, 0], [1, 0]], { visible: false, fixed: true } as any);
    const P = board.create('glider', [1.2, 0, xAxis], { name: '', size: 4, fillColor: VIOLET, strokeColor: VIOLET } as any);
    const top = board.create('point', [() => P.X(), 1], { visible: false } as any);
    board.create('line', [P, top], { strokeColor: AMBER, strokeWidth: 2, dash: 2, straightFirst: true, straightLast: true } as any);
    if (shape === 'circle') {
      board.create('point', [() => P.X(), () => (Math.abs(P.X()) < r ? Math.sqrt(r * r - P.X() * P.X()) : NaN)],
        { name: '', size: 3, fillColor: EMERALD, strokeColor: EMERALD, fixed: true } as any);
      board.create('point', [() => P.X(), () => (Math.abs(P.X()) < r ? -Math.sqrt(r * r - P.X() * P.X()) : NaN)],
        { name: '', size: 3, fillColor: EMERALD, strokeColor: EMERALD, fixed: true } as any);
    }
    const bb = board.getBoundingBox();
    board.create('text', [() => bb[0] + 0.4, () => bb[1] - 0.6, () => {
      const c = crossings(P.X());
      return `crossings: ${c}   →   ${c > 1 ? 'NOT a function' : 'a function'}`;
    }], { strokeColor: TEXT.secondary, fontSize: 14 } as any);
  },

  // EVEN / ODD MIRROR — drag a point P=(a,f(a)) along the curve; the point at −a
  // is highlighted, and a live verdict says even (f(−a)=f(a), y-axis mirror), odd
  // (f(−a)=−f(a), origin symmetry), or neither. params.base ∈ BASE_FUNCS keys.
  'even-odd-mirror': (_JXG, board, params) => {
    const baseKey = str(params, 'base', 'cube');
    const f = BASE_FUNCS[baseKey] ?? BASE_FUNCS.cube;
    const curve = board.create('functiongraph', [f], { strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY } as any);
    const P = board.create('glider', [1.3, f(1.3), curve], {
      name: '(a, f(a))', size: 5, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    const Q = board.create('point', [() => -P.X(), () => f(-P.X())], {
      name: '(−a, f(−a))', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    board.create('segment', [P, Q], { strokeColor: '#ffffff33', dash: 2 } as any);
    const bb = board.getBoundingBox();
    board.create('text', [() => bb[0] + 0.4, () => bb[3] + 0.8, () => {
      const a = P.X(); const fa = f(a); const fna = f(-a);
      let verdict = 'neither';
      if (Math.abs(fna - fa) < 1e-6) verdict = 'EVEN — mirror about y-axis';
      else if (Math.abs(fna + fa) < 1e-6) verdict = 'ODD — 180° about origin';
      return `f(a)=${fa.toFixed(2)},  f(−a)=${fna.toFixed(2)}   →   ${verdict}`;
    }], { strokeColor: TEXT.secondary, fontSize: 13 } as any);
  },

  // PIECEWISE HIGHLIGHT — |x| as two coloured rays (y=−x for x<0, y=x for x≥0).
  // Drag x; the point on the curve + a readout show which branch is active.
  'piecewise-highlight': (_JXG, board, _params) => {
    board.create('functiongraph', [(x: number) => -x, -20, 0], { strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY } as any);
    board.create('functiongraph', [(x: number) => x, 0, 20], { strokeColor: AMBER, strokeWidth: 2.5, highlightStrokeColor: AMBER } as any);
    const xAxis = board.create('line', [[0, 0], [1, 0]], { visible: false, fixed: true } as any);
    const P = board.create('glider', [1.5, 0, xAxis], { name: 'x', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 12 } } as any);
    const onCurve = board.create('point', [() => P.X(), () => Math.abs(P.X())], { name: '', size: 4, fillColor: VIOLET, strokeColor: VIOLET, fixed: true } as any);
    const foot = board.create('point', [() => P.X(), 0], { visible: false } as any);
    board.create('segment', [foot, onCurve], { strokeColor: '#ffffff33', dash: 1 } as any);
    const bb = board.getBoundingBox();
    board.create('text', [() => bb[0] + 0.4, () => bb[1] - 0.6,
      () => (P.X() < 0 ? 'active branch:  y = −x   (x < 0)' : 'active branch:  y = x   (x ≥ 0)')], {
      strokeColor: TEXT.secondary, fontSize: 14,
    } as any);
  },

  // SHIFT EXPLORER — isolates SLIDING only: y = f(x − h) + k with just two sliders
  // (h = left/right, k = up/down) against a ghost of the original. For the "Meet
  // the Graphs" chapter, where one transformation at a time is the whole point.
  // params.base ∈ BASE_FUNCS keys.
  'shift-explorer': (_JXG, board, params) => {
    const baseKey = str(params, 'base', 'square');
    const f = BASE_FUNCS[baseKey] ?? BASE_FUNCS.square;
    const { sliders, meta } = mkSliderStack(board, [
      { min: -4, max: 4, name: 'h', color: AMBER, start: 0 },
      { min: -4, max: 4, name: 'k', color: EMERALD, start: 0 },
    ]);
    const { h, k } = sliders;
    board.create('functiongraph', [f], {
      strokeColor: TEXT.ghost, strokeWidth: 1.5, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    board.create('functiongraph', [(x: number) => f(x - h.Value()) + k.Value()], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'y = f(x − {h}) + {k}',
      equation: (v) => `y = f(${xShift(v.h)})${addTerm(v.k)}`,
      snapshot: (opts) => {
        const hv = h.Value(), kv = k.Value();
        return drawFrozen(board, (x: number) => f(x - hv) + kv, VIOLET, opts);
      },
    };
  },

  // STRETCH EXPLORER — isolates STRETCHING & FLIPPING: y = a·f(b·x) with just two
  // sliders (a = vertical stretch/flip, b = horizontal squeeze/flip) against the
  // ghost original. params.base ∈ BASE_FUNCS keys.
  'stretch-explorer': (_JXG, board, params) => {
    const baseKey = str(params, 'base', 'square');
    const f = BASE_FUNCS[baseKey] ?? BASE_FUNCS.square;
    const { sliders, meta } = mkSliderStack(board, [
      { min: -3, max: 3, name: 'a', color: VIOLET, start: 1 },
      { min: -3, max: 3, name: 'b', color: SKY, start: 1 },
    ]);
    const { a, b: bb2 } = sliders;
    board.create('functiongraph', [f], {
      strokeColor: TEXT.ghost, strokeWidth: 1.5, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    board.create('functiongraph', [(x: number) => a.Value() * f(bb2.Value() * x)], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'y = {a}·f({b}x)',
      equation: (v) => {
        const inner = v.b === 1 ? 'x' : v.b === -1 ? '−x' : `${nf(v.b)}x`;
        const fp = v.a === 1 ? `f(${inner})` : v.a === -1 ? `−f(${inner})` : `${nf(v.a)}·f(${inner})`;
        return `y = ${fp}`;
      },
      snapshot: (opts) => {
        const av = a.Value(), bv = bb2.Value();
        return drawFrozen(board, (x: number) => av * f(bv * x), VIOLET, opts);
      },
    };
  },

  // POWER FAMILY — y = a·xⁿ. A coefficient slider `a` (taller / flatter / flip)
  // AND an integer power slider `n`, so a student sees BOTH how the power
  // reshapes the family and how the coefficient scales it (founder 2026-07-24:
  // "you're only letting me change the power, not the coefficient — I want to
  // see 2x² vs x²"). Marks (1, a). Shows even/odd of the power.
  'power-family': (_JXG, board, _params) => {
    const pf = mkSliderStack(board, [
      { min: -3, max: 3, name: 'a', color: VIOLET, start: 1 },
      { min: 1, max: 5, name: 'n', color: SKY, start: 2, extra: { snapWidth: 1 } },
    ]);
    const a = pf.sliders['a'];
    const n = pf.sliders['n'];
    board.create('functiongraph', [(x: number) => a.Value() * Math.pow(x, Math.round(n.Value()))], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    const coef = (av: number) => (av === 1 ? '' : av === -1 ? '−' : `${nf(av)}·`);
    return {
      sliders: pf.meta,
      generalForm: 'y = {a}·x^{n}',
      equation: (v) => {
        const p = Math.round(v.n);
        return `y = ${coef(v.a)}x^${p}   (${p % 2 === 0 ? 'even' : 'odd'})`;
      },
      calc: (v, x) => {
        const p = Math.round(v.n);
        return { sub: `${coef(v.a)}(${x})^${p}`, y: v.a * Math.pow(x, p) };
      },
      snapshot: (opts) => {
        const av = a.Value(), p = Math.round(n.Value());
        return drawFrozen(board, (x: number) => av * Math.pow(x, p), VIOLET, opts);
      },
    };
  },

  // ── New archetypes for the Coordinate Geometry chapter (Class 9, 2026-07-24) ──
  // These are POINT-driven, not slider-driven: no mkSliderStack, live feedback
  // comes from `readouts` reading the draggable points' .X()/.Y() directly in
  // a closure, not from the `vals` argument (which stays empty — zero sliders).
  // MathGraphBoard.tsx was widened (2026-07-24) to still fire the live-update
  // listener for a zero-slider archetype whenever it returns readouts/equation/
  // calc, so these refresh correctly on every drag.

  // DISTANCE EXPLORER — two draggable points; live dashed horizontal/vertical
  // legs + the hypotenuse, with a live Δx/Δy/d readout. The visual PROOF of the
  // distance formula (Baudhāyana–Pythagoras), not just its statement.
  // params.x1,y1,x2,y2 — starting coordinates for the two points.
  'distance-explorer': (_JXG, board, params) => {
    const A = board.create('point', [num(params, 'x1', 1), num(params, 'y1', 1)], {
      name: 'P', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const D = board.create('point', [num(params, 'x2', 6), num(params, 'y2', 5)], {
      name: 'Q', size: 4, fillColor: SKY, strokeColor: SKY, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const corner = board.create('point', [() => D.X(), () => A.Y()], { visible: true, name: '', size: 2, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost } as any);
    board.create('segment', [A, corner], { strokeColor: AMBER, strokeWidth: 2, dash: 2, highlightStrokeColor: AMBER } as any);
    board.create('segment', [corner, D], { strokeColor: EMERALD, strokeWidth: 2, dash: 2, highlightStrokeColor: EMERALD } as any);
    board.create('segment', [A, D], { strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET } as any);
    return {
      generalForm: 'd = √((x₂ − x₁)² + (y₂ − y₁)²)',
      readouts: () => {
        const dx = D.X() - A.X(), dy = D.Y() - A.Y();
        return [
          { label: 'Δx', value: nf(Math.abs(dx)), color: AMBER },
          { label: 'Δy', value: nf(Math.abs(dy)), color: EMERALD },
          { label: 'd (PQ)', value: nf(Math.sqrt(dx * dx + dy * dy)), color: VIOLET },
        ];
      },
    };
  },

  // MIDPOINT EXPLORER — two draggable points; the midpoint is auto-plotted and
  // tracks live. Discovering "average the coordinates" by dragging, before the
  // formula is stated.
  'midpoint-explorer': (_JXG, board, params) => {
    const P = board.create('point', [num(params, 'x1', -2), num(params, 'y1', 1)], {
      name: 'P', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const Q = board.create('point', [num(params, 'x2', 4), num(params, 'y2', 5)], {
      name: 'Q', size: 4, fillColor: SKY, strokeColor: SKY, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [P, Q], { strokeColor: '#ffffff33', dash: 2 } as any);
    const M = board.create('point', [() => (P.X() + Q.X()) / 2, () => (P.Y() + Q.Y()) / 2], {
      name: 'M', size: 4.5, fillColor: AMBER, strokeColor: AMBER, fixed: true, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    return {
      generalForm: 'M = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
      readouts: () => [
        { label: 'Mx', value: nf((P.X() + Q.X()) / 2), color: AMBER },
        { label: 'My', value: nf((P.Y() + Q.Y()) / 2), color: AMBER },
      ],
    };
  },

  // CIRCLE LOCUS EXPLORER — fixed centre, a radius slider, and a draggable
  // point; live distance-from-centre readout with an on/inside/outside
  // verdict. The circle-as-locus idea made tactile. params.h,k = centre.
  'circle-locus-explorer': (_JXG, board, params) => {
    const h = num(params, 'h', 0), k = num(params, 'k', 0);
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'r', min: 0.5, max: 5, color: AMBER, start: num(params, 'r', 3) },
    ]);
    const r = sliders['r'];
    board.create('point', [h, k], {
      name: 'C', size: 3.5, fillColor: AMBER, strokeColor: AMBER, fixed: true, label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    board.create('circle', [[h, k], () => r.Value()], {
      strokeColor: SKY, strokeWidth: 2.5, fillColor: 'none', highlightStrokeColor: SKY,
    } as any);
    const P = board.create('point', [h + 2, k + 2], {
      name: 'P', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [[h, k], P], { strokeColor: '#ffffff33', dash: 2 } as any);
    return {
      sliders: meta,
      generalForm: `(x − ${nf(h)})² + (y − ${nf(k)})² = {r}²`,
      equation: (v) => `(x − ${nf(h)})² + (y − ${nf(k)})² = ${nf(v.r)}²`,
      readouts: (v) => {
        const dx = P.X() - h, dy = P.Y() - k;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rv = v.r ?? r.Value();
        const verdict = Math.abs(dist - rv) < 0.05 ? 'ON the circle' : dist < rv ? 'INSIDE' : 'OUTSIDE';
        return [
          { label: 'dist(P, C)', value: nf(dist), color: VIOLET },
          { label: 'verdict', value: verdict, color: Math.abs(dist - rv) < 0.05 ? AMBER : dist < rv ? EMERALD : PINK },
        ];
      },
    };
  },

  // COLLINEARITY CHECKER — three draggable points, live pairwise distances,
  // and the distance-sum test verdict (largest pair-distance = sum of the
  // other two ⇔ collinear). Auto-checkable geometry a static page can't offer.
  'collinearity-checker': (_JXG, board, params) => {
    const A = board.create('point', [num(params, 'x1', -3), num(params, 'y1', -2)], {
      name: 'A', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const B = board.create('point', [num(params, 'x2', 1), num(params, 'y2', 1)], {
      name: 'B', size: 4, fillColor: SKY, strokeColor: SKY, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const C = board.create('point', [num(params, 'x3', 5), num(params, 'y3', 4)], {
      name: 'C', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [A, B], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [B, C], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [C, A], { strokeColor: '#ffffff33', strokeWidth: 1.5, dash: 2 } as any);
    const dist = (P: any, Q: any) => Math.sqrt((P.X() - Q.X()) ** 2 + (P.Y() - Q.Y()) ** 2);
    return {
      generalForm: 'Collinear ⇔ largest distance = sum of the other two',
      readouts: () => {
        const ab = dist(A, B), bc = dist(B, C), ca = dist(C, A);
        const sorted = [ab, bc, ca].slice().sort((p, q) => p - q);
        const collinear = Math.abs(sorted[2] - (sorted[0] + sorted[1])) < 0.05;
        return [
          { label: 'AB', value: nf(ab), color: VIOLET },
          { label: 'BC', value: nf(bc), color: SKY },
          { label: 'CA', value: nf(ca), color: AMBER },
          { label: 'verdict', value: collinear ? 'COLLINEAR' : 'a triangle', color: collinear ? EMERALD : PINK },
        ];
      },
    };
  },

  // ── New archetypes for the Circles / Mensuration / Sequences chapters
  // (Class 9, 2026-07-24). The circle-theorem one is deliberately AXIS-FREE —
  // NCERT circle theorems are drawn without a coordinate grid — achieved by
  // the CALLING PAGE passing spec:{showAxes:false, showGrid:false} alongside
  // the archetype (archetype and spec are independent fields; MathGraphBoard
  // reads spec.showAxes/showGrid regardless of which mode drew the shapes —
  // already proven by circle-locus-explorer). None of these use JSXGraph's
  // 'angle' glyph element (untested anywhere in this file); live angle values
  // are computed by hand and shown through the `readouts` panel instead —
  // same boxed-HTML mechanism every other live number in the engine uses.

  // INSCRIBED ANGLE EXPLORER — central angle = 2 × inscribed angle. Drag P
  // around the circle; the two live angle readouts stay locked at a 2:1 ratio
  // no matter where P sits (uses the arc NOT containing P for the central
  // angle, so it's robust to P landing on either side of chord AB).
  // params.dual:true adds a second point Q, so students also see "angles in
  // the same segment are equal" (the page-9 corollary) with the same board.
  'inscribed-angle-explorer': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    const dual = params.dual === true || params.dual === 'true';
    const circle = board.create('circle', [[0, 0], R], {
      strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY,
    } as any);
    const O = board.create('point', [0, 0], {
      name: 'O', size: 3, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost,
      label: { strokeColor: TEXT.secondary, fontSize: 11 },
    } as any);
    const A = board.create('glider', [R * Math.cos(2.6), R * Math.sin(2.6), circle], {
      name: 'A', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const B = board.create('glider', [R * Math.cos(-0.6), R * Math.sin(-0.6), circle], {
      name: 'B', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const P = board.create('glider', [R * Math.cos(1.2), R * Math.sin(1.2), circle], {
      name: 'P', size: 4.5, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [O, A], { strokeColor: AMBER, strokeWidth: 2 } as any);
    board.create('segment', [O, B], { strokeColor: AMBER, strokeWidth: 2 } as any);
    board.create('segment', [P, A], { strokeColor: VIOLET, strokeWidth: 2 } as any);
    board.create('segment', [P, B], { strokeColor: VIOLET, strokeWidth: 2 } as any);
    let Q: any = null;
    if (dual) {
      Q = board.create('glider', [R * Math.cos(2.0), R * Math.sin(2.0), circle], {
        name: 'Q', size: 4.5, fillColor: EMERALD, strokeColor: EMERALD, label: { strokeColor: TEXT.primary, fontSize: 13 },
      } as any);
      board.create('segment', [Q, A], { strokeColor: EMERALD, strokeWidth: 2 } as any);
      board.create('segment', [Q, B], { strokeColor: EMERALD, strokeWidth: 2 } as any);
    }
    const vertexAngle = (vertex: any, p1: any, p2: any) => {
      const a1 = Math.atan2(p1.Y() - vertex.Y(), p1.X() - vertex.X());
      const a2 = Math.atan2(p2.Y() - vertex.Y(), p2.X() - vertex.X());
      let d = Math.abs(a1 - a2) * 180 / Math.PI;
      if (d > 180) d = 360 - d;
      return d;
    };
    const centralFarArc = () => {
      const norm = (deg: number) => ((deg % 360) + 360) % 360;
      const aA = norm(Math.atan2(A.Y(), A.X()) * 180 / Math.PI);
      const aB = norm(Math.atan2(B.Y(), B.X()) * 180 / Math.PI);
      const aP = norm(Math.atan2(P.Y(), P.X()) * 180 / Math.PI);
      const arcABccw = norm(aB - aA);
      const pOnCcwArc = norm(aP - aA) < arcABccw;
      return pOnCcwArc ? 360 - arcABccw : arcABccw;
    };
    return {
      generalForm: dual ? '∠APB = ∠AQB (same segment)' : '∠AOB = 2 × ∠APB',
      readouts: () => {
        const central = centralFarArc();
        const rows = [
          { label: '∠AOB (central)', value: nf(central) + '°', color: AMBER },
          { label: '∠APB (inscribed)', value: nf(vertexAngle(P, A, B)) + '°', color: VIOLET },
        ];
        if (dual && Q) rows.push({ label: '∠AQB (inscribed)', value: nf(vertexAngle(Q, A, B)) + '°', color: EMERALD });
        return rows;
      },
    };
  },

  // CIRCLE AREA — SLICE & REARRANGE — a wedge-count slider (n) simultaneously
  // slices a circle into n equal wedges AND lays out n alternating-up/down
  // triangles in a strip below it; as n grows the strip visibly flattens
  // toward a rectangle of base πr and height r — the classic πr² proof.
  // Every wedge/triangle is pre-created up to a fixed maximum and shown only
  // when its index < the current n (JSXGraph elements can't be created mid-
  // drag; toggling `visible` as a function of the slider is the standard
  // workaround already used by this file's step-explorer/vlt-sweep).
  'circle-area-slice-rearrange': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    const NMAX = 24;
    const circumference = 2 * Math.PI * R;
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'n', min: 4, max: NMAX, color: AMBER, start: num(params, 'n', 8), extra: { snapWidth: 1 } },
    ]);
    const n = sliders['n'];
    const cx = 0, cy = R * 1.7;
    board.create('circle', [[cx, cy], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    for (let i = 0; i < NMAX; i++) {
      const idx = i;
      const vis = () => idx < Math.round(n.Value());
      const rim = board.create('point', [
        () => cx + R * Math.cos(idx * 2 * Math.PI / n.Value()),
        () => cy + R * Math.sin(idx * 2 * Math.PI / n.Value()),
      ], { visible: false } as any);
      board.create('segment', [[cx, cy], rim], { visible: vis, strokeColor: '#ffffff33', strokeWidth: 1 } as any);
    }
    for (let i = 0; i < NMAX; i++) {
      const idx = i;
      const vis = () => idx < Math.round(n.Value());
      const base = () => circumference / n.Value();
      const x0 = () => (idx * circumference) / n.Value() - circumference / 2;
      const apexSign = idx % 2 === 0 ? 1 : -1;
      const pA = board.create('point', [() => x0(), 0], { visible: false } as any);
      const pB = board.create('point', [() => x0() + base(), 0], { visible: false } as any);
      const pC = board.create('point', [() => x0() + base() / 2, () => apexSign * R], { visible: false } as any);
      board.create('segment', [pA, pB], { visible: vis, strokeColor: AMBER, strokeWidth: 1.5 } as any);
      board.create('segment', [pB, pC], { visible: vis, strokeColor: AMBER, strokeWidth: 1.5 } as any);
      board.create('segment', [pC, pA], { visible: vis, strokeColor: AMBER, strokeWidth: 1.5 } as any);
    }
    return {
      sliders: meta,
      generalForm: 'more wedges ⇒ strip → rectangle: base = πr, height = r',
      readouts: (v) => {
        const nn = Math.round(v.n);
        return [
          { label: 'wedges (n)', value: String(nn), color: AMBER },
          { label: 'strip base ≈ πr', value: nf(circumference / 2), color: VIOLET },
          { label: 'strip height = r', value: nf(R), color: EMERALD },
          { label: 'area = πr²', value: nf(Math.PI * R * R), color: SKY },
        ];
      },
    };
  },

  // SUM-PAIRING PROOF — the Gauss staircase-to-rectangle construction. An
  // ascending staircase of unit-width bars (heights 1..n) sits below its own
  // mirrored, descending copy stacked on top — together they tile an exact
  // n × (n+1) rectangle, so 2·Sₙ = n(n+1). A term-count slider (n) reveals
  // one more bar-pair at a time, same visible-toggle technique as above.
  'sum-pairing-proof': (_JXG, board, params) => {
    const NMAX = 12;
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'n', min: 2, max: NMAX, color: AMBER, start: num(params, 'n', 5), extra: { snapWidth: 1 } },
    ]);
    const nSlider = sliders['n'];
    for (let i = 0; i < NMAX; i++) {
      const idx = i;
      const vis = () => idx < Math.round(nSlider.Value());
      // ascending bar i: (i,0)-(i+1,0)-(i+1,i+1)-(i,i+1)
      const a1 = board.create('point', [idx, 0], { visible: false } as any);
      const a2 = board.create('point', [idx + 1, 0], { visible: false } as any);
      const a3 = board.create('point', [idx + 1, idx + 1], { visible: false } as any);
      const a4 = board.create('point', [idx, idx + 1], { visible: false } as any);
      board.create('segment', [a1, a2], { visible: vis, strokeColor: VIOLET, strokeWidth: 1.5 } as any);
      board.create('segment', [a2, a3], { visible: vis, strokeColor: VIOLET, strokeWidth: 1.5 } as any);
      board.create('segment', [a3, a4], { visible: vis, strokeColor: VIOLET, strokeWidth: 1.5 } as any);
      board.create('segment', [a4, a1], { visible: vis, strokeColor: VIOLET, strokeWidth: 1.5 } as any);
      // mirrored descending bar, stacked on top: (i,i+1)-(i+1,i+1)-(i+1,n+1)-(i,n+1)
      const b3 = board.create('point', [() => idx + 1, () => Math.round(nSlider.Value()) + 1], { visible: false } as any);
      const b4 = board.create('point', [() => idx, () => Math.round(nSlider.Value()) + 1], { visible: false } as any);
      board.create('segment', [a4, a3], { visible: vis, strokeColor: SKY, strokeWidth: 1.5 } as any);
      board.create('segment', [a3, b3], { visible: vis, strokeColor: SKY, strokeWidth: 1.5 } as any);
      board.create('segment', [b3, b4], { visible: vis, strokeColor: SKY, strokeWidth: 1.5 } as any);
      board.create('segment', [b4, a4], { visible: vis, strokeColor: SKY, strokeWidth: 1.5 } as any);
    }
    const r1 = board.create('point', [0, 0], { visible: false } as any);
    const r2 = board.create('point', [() => Math.round(nSlider.Value()), 0], { visible: false } as any);
    const r3 = board.create('point', [() => Math.round(nSlider.Value()), () => Math.round(nSlider.Value()) + 1], { visible: false } as any);
    const r4 = board.create('point', [0, () => Math.round(nSlider.Value()) + 1], { visible: false } as any);
    board.create('segment', [r1, r2], { strokeColor: '#ffffff44', strokeWidth: 1, dash: 2 } as any);
    board.create('segment', [r2, r3], { strokeColor: '#ffffff44', strokeWidth: 1, dash: 2 } as any);
    board.create('segment', [r3, r4], { strokeColor: '#ffffff44', strokeWidth: 1, dash: 2 } as any);
    board.create('segment', [r4, r1], { strokeColor: '#ffffff44', strokeWidth: 1, dash: 2 } as any);
    return {
      sliders: meta,
      generalForm: '2·Sₙ = n·(n+1)  ⇒  Sₙ = n(n+1)/2',
      equation: (v) => { const nn = Math.round(v.n); return `S${nn} = 1+2+…+${nn} = ${nn * (nn + 1) / 2}`; },
      readouts: (v) => {
        const nn = Math.round(v.n);
        return [
          { label: 'n', value: String(nn), color: AMBER },
          { label: 'rectangle', value: `${nn} × ${nn + 1}`, color: SKY },
          { label: 'Sₙ = n(n+1)/2', value: String(nn * (nn + 1) / 2), color: VIOLET },
        ];
      },
    };
  },

  // ── Tier-2 archetypes (Class 9 audit, 2026-07-24) — remaining Circles
  // family, Number Systems, Mensuration, and Probability. Same conventions
  // as the Tier-1 batch above: axis-free circle theorems via the calling
  // page's spec.showAxes/showGrid, no JXG 'angle'/'polygon'/'sector' element
  // types (unproven in this file), live numbers via `readouts` only.

  // CIRCUMCIRCLE EXPLORER — drag a triangle's 3 vertices; the two perpendicular
  // bisectors and their intersection (circumcentre O) draw live, with the
  // circle through all three vertices (JSXGraph's native 3-point circle
  // constructor, so the drawn circle stays correct even at extreme drags).
  'circumcircle-explorer': (_JXG, board, params) => {
    const A = board.create('point', [num(params, 'x1', -2), num(params, 'y1', -1)], {
      name: 'A', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const B = board.create('point', [num(params, 'x2', 2), num(params, 'y2', 2)], {
      name: 'B', size: 4, fillColor: SKY, strokeColor: SKY, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const C = board.create('point', [num(params, 'x3', 3), num(params, 'y3', -2)], {
      name: 'C', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    board.create('segment', [A, B], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [B, C], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [C, A], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('circle', [A, B, C], { strokeColor: EMERALD, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: EMERALD } as any);
    const circumcenter = (): [number, number] => {
      const ax = A.X(), ay = A.Y(), bx = B.X(), by = B.Y(), cx = C.X(), cy = C.Y();
      const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
      if (Math.abs(d) < 1e-9) return [ax, ay];
      const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
      const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
      return [ux, uy];
    };
    const O = board.create('point', [() => circumcenter()[0], () => circumcenter()[1]], {
      name: 'O', size: 3.5, fixed: true, fillColor: EMERALD, strokeColor: EMERALD, label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    const midAB = board.create('point', [() => (A.X() + B.X()) / 2, () => (A.Y() + B.Y()) / 2], { visible: false } as any);
    const midBC = board.create('point', [() => (B.X() + C.X()) / 2, () => (B.Y() + C.Y()) / 2], { visible: false } as any);
    board.create('segment', [midAB, O], { strokeColor: EMERALD, strokeWidth: 1.5, dash: 2 } as any);
    board.create('segment', [midBC, O], { strokeColor: EMERALD, strokeWidth: 1.5, dash: 2 } as any);
    return {
      generalForm: 'OA = OB = OC — the perpendicular bisectors meet at one point',
      readouts: () => {
        const [ox, oy] = circumcenter();
        const d = (P: any) => Math.sqrt((P.X() - ox) ** 2 + (P.Y() - oy) ** 2);
        return [
          { label: 'OA', value: nf(d(A)), color: VIOLET },
          { label: 'OB', value: nf(d(B)), color: SKY },
          { label: 'OC', value: nf(d(C)), color: AMBER },
        ];
      },
    };
  },

  // CHORD DISTANCE EXPLORER — two independently draggable chords; live
  // length, perpendicular-distance-from-centre, AND central angle for each —
  // covers the equal-length ⇔ equal-distance relationship (page 6/7) AND the
  // equal-chords ⇔ equal-central-angle relationship (page 4) with one board,
  // since both are "drag two chords, compare two live numbers" exercises.
  'chord-distance-explorer': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    const circle = board.create('circle', [[0, 0], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    const O = board.create('point', [0, 0], { name: 'O', size: 3, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost, label: { strokeColor: TEXT.secondary, fontSize: 11 } } as any);
    const P1 = board.create('glider', [R * Math.cos(0.6), R * Math.sin(0.6), circle], { name: 'P', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const P2 = board.create('glider', [R * Math.cos(2.4), R * Math.sin(2.4), circle], { name: 'Q', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const Q1 = board.create('glider', [R * Math.cos(-1.0), R * Math.sin(-1.0), circle], { name: 'R', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const Q2 = board.create('glider', [R * Math.cos(-2.4), R * Math.sin(-2.4), circle], { name: 'S', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    board.create('segment', [P1, P2], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    board.create('segment', [Q1, Q2], { strokeColor: AMBER, strokeWidth: 2.5 } as any);
    const perpFoot = (a: any, b: any, o: any): [number, number] => {
      const abx = b.X() - a.X(), aby = b.Y() - a.Y();
      const len2 = abx * abx + aby * aby;
      const t = len2 > 1e-9 ? ((o.X() - a.X()) * abx + (o.Y() - a.Y()) * aby) / len2 : 0;
      return [a.X() + t * abx, a.Y() + t * aby];
    };
    const foot1 = board.create('point', [() => perpFoot(P1, P2, O)[0], () => perpFoot(P1, P2, O)[1]], { visible: false } as any);
    const foot2 = board.create('point', [() => perpFoot(Q1, Q2, O)[0], () => perpFoot(Q1, Q2, O)[1]], { visible: false } as any);
    board.create('segment', [O, foot1], { strokeColor: VIOLET, strokeWidth: 1.5, dash: 2 } as any);
    board.create('segment', [O, foot2], { strokeColor: AMBER, strokeWidth: 1.5, dash: 2 } as any);
    const dist = (a: any, b: any) => Math.sqrt((a.X() - b.X()) ** 2 + (a.Y() - b.Y()) ** 2);
    const centralAngle = (a: any, b: any) => {
      const a1 = Math.atan2(a.Y() - O.Y(), a.X() - O.X());
      const a2 = Math.atan2(b.Y() - O.Y(), b.X() - O.X());
      let d = Math.abs(a1 - a2) * 180 / Math.PI;
      if (d > 180) d = 360 - d;
      return d;
    };
    return {
      generalForm: 'equal chords ⇔ equidistant from the centre ⇔ equal central angle',
      readouts: () => [
        { label: 'PQ length', value: nf(dist(P1, P2)), color: VIOLET },
        { label: 'PQ dist from O', value: nf(dist(O, foot1)), color: VIOLET },
        { label: '∠POQ', value: nf(centralAngle(P1, P2)) + '°', color: VIOLET },
        { label: 'RS length', value: nf(dist(Q1, Q2)), color: AMBER },
        { label: 'RS dist from O', value: nf(dist(O, foot2)), color: AMBER },
        { label: '∠ROS', value: nf(centralAngle(Q1, Q2)) + '°', color: AMBER },
      ],
    };
  },

  // CYCLIC QUAD EXPLORER — 4 points forming a quadrilateral; live interior
  // angles + opposite-angle-sum verdict. params.constrainD:false frees the
  // 4th vertex from the circle (the converse: drag it off and the 180° sums
  // break; drag it back and they're restored) — same archetype serves both
  // Theorem 11 (constrainD default true) and its converse (Theorem 12).
  'cyclic-quad-explorer': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    const constrainD = params.constrainD !== false && params.constrainD !== 'false';
    const circle = board.create('circle', [[0, 0], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    const mk = (ang: number, color: string, name: string) => board.create('glider', [R * Math.cos(ang), R * Math.sin(ang), circle], {
      name, size: 4, fillColor: color, strokeColor: color, label: { strokeColor: TEXT.primary, fontSize: 13 },
    } as any);
    const A = mk(2.4, VIOLET, 'A');
    const B = mk(0.8, SKY, 'B');
    const C = mk(-1.0, AMBER, 'C');
    const D = constrainD
      ? mk(-2.6, EMERALD, 'D')
      : board.create('point', [R * Math.cos(-2.6) * 1.4, R * Math.sin(-2.6) * 1.4], {
          name: 'D', size: 4, fillColor: EMERALD, strokeColor: EMERALD, label: { strokeColor: TEXT.primary, fontSize: 13 },
        } as any);
    board.create('segment', [A, B], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [B, C], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [C, D], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    board.create('segment', [D, A], { strokeColor: '#ffffff55', strokeWidth: 2 } as any);
    const vertexAngle = (vertex: any, p1: any, p2: any) => {
      const a1 = Math.atan2(p1.Y() - vertex.Y(), p1.X() - vertex.X());
      const a2 = Math.atan2(p2.Y() - vertex.Y(), p2.X() - vertex.X());
      let d = Math.abs(a1 - a2) * 180 / Math.PI;
      if (d > 180) d = 360 - d;
      return d;
    };
    return {
      generalForm: constrainD ? '∠A + ∠C = 180°,  ∠B + ∠D = 180°' : 'drag D off the circle — the sums break',
      readouts: () => {
        const aA = vertexAngle(A, D, B), aB = vertexAngle(B, A, C), aC = vertexAngle(C, B, D), aD = vertexAngle(D, C, A);
        const okAC = aA + aC > 178 && aA + aC < 182;
        const okBD = aB + aD > 178 && aB + aD < 182;
        return [
          { label: '∠A + ∠C', value: nf(aA + aC) + '°', color: okAC ? EMERALD : PINK },
          { label: '∠B + ∠D', value: nf(aB + aD) + '°', color: okBD ? EMERALD : PINK },
        ];
      },
    };
  },

  // CIRCLE ANATOMY EXPLORER — drag P around the circle; live radius/chord
  // readout, with a "is it a diameter?" verdict when P lands opposite the
  // fixed reference point A. Vocabulary made tactile instead of a static
  // labelled picture. (Page 1 — parts of a circle.)
  'circle-anatomy-explorer': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    const circle = board.create('circle', [[0, 0], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    const O = board.create('point', [0, 0], { name: 'O', size: 3, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost, label: { strokeColor: TEXT.secondary, fontSize: 11 } } as any);
    const A = board.create('glider', [R, 0, circle], { name: 'A', size: 4, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const P = board.create('glider', [R * Math.cos(1.8), R * Math.sin(1.8), circle], { name: 'P', size: 4.5, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    board.create('segment', [O, P], { strokeColor: EMERALD, strokeWidth: 2 } as any);
    board.create('segment', [A, P], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    const dist = (a: any, b: any) => Math.sqrt((a.X() - b.X()) ** 2 + (a.Y() - b.Y()) ** 2);
    return {
      generalForm: 'radius = r,  chord ≤ diameter = 2r',
      readouts: () => {
        const chord = dist(A, P);
        const isDiameter = Math.abs(chord - 2 * R) < 0.05;
        return [
          { label: 'radius OP', value: nf(R), color: EMERALD },
          { label: 'chord AP', value: nf(chord), color: VIOLET },
          { label: 'is a diameter?', value: isDiameter ? 'YES' : 'no', color: isDiameter ? AMBER : TEXT.secondary },
        ];
      },
    };
  },

  // CHORD PERPENDICULAR BISECTOR — drag a chord's endpoints; the perpendicular
  // from the centre always lands exactly at the midpoint, with live AM/MB/OM
  // readouts and the chord = 2√(r²−d²) formula evaluated live. (Page 5.)
  'chord-perpendicular-bisector': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    const circle = board.create('circle', [[0, 0], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    const O = board.create('point', [0, 0], { name: 'O', size: 3, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost, label: { strokeColor: TEXT.secondary, fontSize: 11 } } as any);
    const P = board.create('glider', [R * Math.cos(0.7), R * Math.sin(0.7), circle], { name: 'A', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const Q = board.create('glider', [R * Math.cos(2.6), R * Math.sin(2.6), circle], { name: 'B', size: 4, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    board.create('segment', [P, Q], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    const footFn = (): [number, number] => {
      const abx = Q.X() - P.X(), aby = Q.Y() - P.Y();
      const len2 = abx * abx + aby * aby;
      const t = len2 > 1e-9 ? ((O.X() - P.X()) * abx + (O.Y() - P.Y()) * aby) / len2 : 0.5;
      return [P.X() + t * abx, P.Y() + t * aby];
    };
    const M = board.create('point', [() => footFn()[0], () => footFn()[1]], {
      name: 'M', size: 3.5, fixed: true, fillColor: AMBER, strokeColor: AMBER, label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    board.create('segment', [O, M], { strokeColor: AMBER, strokeWidth: 2, dash: 2 } as any);
    const dist = (a: any, b: any) => Math.sqrt((a.X() - b.X()) ** 2 + (a.Y() - b.Y()) ** 2);
    return {
      generalForm: 'M is the midpoint of AB  (chord = 2√(r² − d²))',
      readouts: () => {
        const OM = dist(O, M);
        return [
          { label: 'AM', value: nf(dist(P, M)), color: VIOLET },
          { label: 'MB', value: nf(dist(Q, M)), color: VIOLET },
          { label: 'OM (d)', value: nf(OM), color: AMBER },
          { label: 'chord = 2√(r²−d²)', value: nf(2 * Math.sqrt(Math.max(0, R * R - OM * OM))), color: SKY },
        ];
      },
    };
  },

  // CIRCLE SYMMETRY EXPLORER — a rotation-angle slider sweeps a diameter
  // through every position; the segment is always a line of symmetry, no
  // matter the angle. Lower priority — a demonstration, not a checkable
  // exercise. (Page 2.)
  'circle-symmetry-explorer': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    board.create('circle', [[0, 0], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'θ', min: 0, max: 360, color: VIOLET, start: num(params, 'theta', 0) },
    ]);
    const t = sliders['θ'];
    const rad = () => t.Value() * Math.PI / 180;
    const P1 = board.create('point', [() => R * Math.cos(rad()), () => R * Math.sin(rad())], { name: '', size: 3.5, fixed: true, fillColor: AMBER, strokeColor: AMBER } as any);
    const P2 = board.create('point', [() => -R * Math.cos(rad()), () => -R * Math.sin(rad())], { name: '', size: 3.5, fixed: true, fillColor: AMBER, strokeColor: AMBER } as any);
    board.create('segment', [P1, P2], { strokeColor: VIOLET, strokeWidth: 1.5, dash: 2 } as any);
    return {
      sliders: meta,
      generalForm: 'every diameter is a line of symmetry',
      equation: (v) => `diameter at θ = ${nf(v['θ'])}° — the circle looks identical`,
    };
  },

  // SURD SPIRAL CONSTRUCTION — the Spiral of Theodorus. A deterministic
  // right-triangle spiral (each new unit leg perpendicular to the previous
  // hypotenuse) is precomputed once; a term-count slider reveals it one
  // triangle at a time, so OPₙ = √n is watched appearing rather than stated.
  // (Class 9 Ch.3, page 9 — the chapter's one genuinely 2-D construction.)
  'surd-spiral-construction': (_JXG, board, params) => {
    const NMAX = 16;
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'n', min: 2, max: NMAX, color: AMBER, start: num(params, 'n', 6), extra: { snapWidth: 1 } },
    ]);
    const nSlider = sliders['n'];
    const pts: [number, number][] = [[0, 0], [1, 0]];
    for (let k = 1; k <= NMAX; k++) {
      const [px, py] = pts[k];
      const phi = Math.atan2(py, px);
      pts.push([px + Math.cos(phi + Math.PI / 2), py + Math.sin(phi + Math.PI / 2)]);
    }
    board.create('point', [0, 0], { name: 'O', size: 3, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost, label: { strokeColor: TEXT.secondary, fontSize: 11 } } as any);
    for (let k = 1; k <= NMAX; k++) {
      const idx = k;
      const vis = () => idx <= Math.round(nSlider.Value());
      const [x1, y1] = pts[idx];
      const [x2, y2] = pts[idx + 1];
      board.create('segment', [[0, 0], [x1, y1]], { visible: vis, strokeColor: '#ffffff33', strokeWidth: 1, dash: 2 } as any);
      board.create('segment', [[x1, y1], [x2, y2]], { visible: vis, strokeColor: idx % 2 === 0 ? VIOLET : SKY, strokeWidth: 2 } as any);
      board.create('segment', [[0, 0], [x2, y2]], { visible: vis, strokeColor: AMBER, strokeWidth: 1.5 } as any);
    }
    return {
      sliders: meta,
      generalForm: 'each new leg has length 1 ⇒ OPₙ = √n',
      equation: (v) => { const nn = Math.round(v.n); return `OP${nn + 1} = √${nn + 1} ≈ ${nf(Math.sqrt(nn + 1))}`; },
      readouts: (v) => {
        const nn = Math.round(v.n);
        const [x, y] = pts[nn + 1];
        return [
          { label: 'triangles drawn', value: String(nn), color: AMBER },
          { label: `OP${nn + 1} = √${nn + 1}`, value: nf(Math.sqrt(x * x + y * y)), color: VIOLET },
        ];
      },
    };
  },

  // PARALLELOGRAM → RECTANGLE — cut-and-slide proof. A fixed trapezoid stays
  // put; a slider t slides the cut end-triangle from its parallelogram
  // position (t=0, completing the original slanted shape) to its rectangle
  // position (t=1, completing a true rectangle) — same base × height area
  // throughout. (Class 9 Ch.6, page 6.)
  'parallelogram-to-rectangle': (_JXG, board, params) => {
    const b = num(params, 'b', 5), h = num(params, 'h', 3), s = num(params, 's', 2);
    const { sliders, meta } = mkSliderStack(board, [{ name: 't', min: 0, max: 1, color: AMBER, start: 0 }]);
    const t = sliders['t'];
    const F = board.create('point', [s, 0], { visible: false } as any);
    const Bp = board.create('point', [b, 0], { visible: false } as any);
    const Cp = board.create('point', [b + s, h], { visible: false } as any);
    const Dp = board.create('point', [s, h], { visible: false } as any);
    board.create('segment', [F, Bp], { strokeColor: SKY, strokeWidth: 2 } as any);
    board.create('segment', [Bp, Cp], { strokeColor: SKY, strokeWidth: 2 } as any);
    board.create('segment', [Cp, Dp], { strokeColor: SKY, strokeWidth: 2 } as any);
    board.create('segment', [Dp, F], { strokeColor: SKY, strokeWidth: 2, dash: 2 } as any);
    const m1 = board.create('point', [() => t.Value() * b, 0], { visible: false } as any);
    const m2 = board.create('point', [() => s + t.Value() * b, h], { visible: false } as any);
    const m3 = board.create('point', [() => s + t.Value() * b, 0], { visible: false } as any);
    board.create('segment', [m1, m2], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    board.create('segment', [m2, m3], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    board.create('segment', [m3, m1], { strokeColor: VIOLET, strokeWidth: 2.5, dash: 2 } as any);
    return {
      sliders: meta,
      generalForm: 'cut + slide the end triangle ⇒ same area, base × height',
      equation: (v) => v.t < 0.5 ? 'parallelogram (base × height, slanted)' : 'rectangle (base × height)',
      readouts: () => [
        { label: 'base', value: nf(b), color: SKY },
        { label: 'height', value: nf(h), color: SKY },
        { label: 'area = base × height', value: nf(b * h), color: AMBER },
      ],
    };
  },

  // TRIANGLE PAIR → PARALLELOGRAM — a slider reveals a second, congruent
  // triangle sliding into place beside the original (sharing edge BC),
  // completing a parallelogram of exactly double the triangle's area — the
  // proof that triangle area = ½ base × height. (Class 9 Ch.6, page 7.)
  'triangle-pair-to-parallelogram': (_JXG, board, params) => {
    const b = num(params, 'b', 5), h = num(params, 'h', 3), c = num(params, 'c', 1.5);
    const { sliders, meta } = mkSliderStack(board, [{ name: 't', min: 0, max: 1, color: AMBER, start: 0 }]);
    const t = sliders['t'];
    const A = board.create('point', [0, 0], { name: 'A', size: 4, fixed: true, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const B = board.create('point', [b, 0], { name: 'B', size: 4, fixed: true, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    const C = board.create('point', [c, h], { name: 'C', size: 4, fixed: true, fillColor: VIOLET, strokeColor: VIOLET, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    board.create('segment', [A, B], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    board.create('segment', [B, C], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    board.create('segment', [C, A], { strokeColor: VIOLET, strokeWidth: 2.5 } as any);
    const Ap = board.create('point', [
      () => A.X() + t.Value() * ((b + c) - A.X()),
      () => A.Y() + t.Value() * (h - A.Y()),
    ], { name: "A'", size: 4, fixed: true, fillColor: SKY, strokeColor: SKY, label: { strokeColor: TEXT.primary, fontSize: 13 } } as any);
    board.create('segment', [B, Ap], { strokeColor: SKY, strokeWidth: 2.5 } as any);
    board.create('segment', [C, Ap], { strokeColor: SKY, strokeWidth: 2.5 } as any);
    return {
      sliders: meta,
      generalForm: 'two congruent triangles ⇒ a parallelogram of double the area',
      readouts: () => [
        { label: 'triangle area', value: nf(0.5 * b * h), color: VIOLET },
        { label: 'parallelogram area', value: nf(b * h), color: SKY },
      ],
    };
  },

  // SECTOR EXPLORER — an angle slider sweeps a sector's second radius around
  // the circle; live arc-length and sector-area readouts extend the existing
  // unit-circle mechanics to mensuration. (Class 9 Ch.6, page 12.)
  'sector-explorer': (_JXG, board, params) => {
    const R = num(params, 'r', 3);
    board.create('circle', [[0, 0], R], { strokeColor: SKY, strokeWidth: 2, fillColor: 'none', highlightStrokeColor: SKY } as any);
    const { sliders, meta } = mkSliderStack(board, [{ name: 'θ', min: 0, max: 360, color: AMBER, start: num(params, 'theta', 90) }]);
    const t = sliders['θ'];
    const O = board.create('point', [0, 0], { name: 'O', size: 3, fixed: true, fillColor: TEXT.ghost, strokeColor: TEXT.ghost, label: { strokeColor: TEXT.secondary, fontSize: 11 } } as any);
    const P1 = board.create('point', [R, 0], { name: '', size: 3.5, fixed: true, fillColor: AMBER, strokeColor: AMBER } as any);
    const P2 = board.create('point', [() => R * Math.cos(t.Value() * Math.PI / 180), () => R * Math.sin(t.Value() * Math.PI / 180)], { name: '', size: 3.5, fixed: true, fillColor: AMBER, strokeColor: AMBER } as any);
    board.create('segment', [O, P1], { strokeColor: AMBER, strokeWidth: 2 } as any);
    board.create('segment', [O, P2], { strokeColor: AMBER, strokeWidth: 2 } as any);
    return {
      sliders: meta,
      generalForm: 'arc length = (θ/360)·2πr,  sector area = (θ/360)·πr²',
      equation: (v) => `θ = ${nf(v['θ'])}°`,
      readouts: (v) => {
        const th = v['θ'];
        return [
          { label: 'arc length', value: nf((th / 360) * 2 * Math.PI * R), color: VIOLET },
          { label: 'sector area', value: nf((th / 360) * Math.PI * R * R), color: EMERALD },
        ];
      },
    };
  },

  // TRIAL CONVERGENCE — relative frequency of heads vs. trial count, watched
  // converging toward the theoretical probability. A fixed pseudo-random
  // sequence (generated once at mount, so dragging the slider replays the
  // SAME run rather than reshuffling every frame) is precomputed; a trials
  // slider reveals the running relative-frequency curve up to that point,
  // against a dashed reference line at the true probability. (Class 9 Ch.7,
  // page 6 — the one genuinely coordinate-plane page in the chapter.)
  'trial-convergence': (_JXG, board, params) => {
    const p = num(params, 'p', 0.5);
    const NMAX = 200;
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'trials', min: 5, max: NMAX, color: VIOLET, start: num(params, 'trials', 10), extra: { snapWidth: 1 } },
    ]);
    const trialsSlider = sliders['trials'];
    const outcomes: number[] = [];
    for (let i = 0; i < NMAX; i++) outcomes.push(Math.random() < p ? 1 : 0);
    const cumFreq: number[] = [];
    let running = 0;
    for (let i = 0; i < NMAX; i++) { running += outcomes[i]; cumFreq.push(running / (i + 1)); }
    board.create('segment', [[1, p], [NMAX, p]], { strokeColor: AMBER, strokeWidth: 1.5, dash: 2 } as any);
    for (let i = 0; i < NMAX - 1; i++) {
      const idx = i;
      const vis = () => idx + 2 <= Math.round(trialsSlider.Value());
      board.create('segment', [[idx + 1, cumFreq[idx]], [idx + 2, cumFreq[idx + 1]]], { visible: vis, strokeColor: VIOLET, strokeWidth: 2 } as any);
    }
    return {
      sliders: meta,
      generalForm: 'relative frequency → theoretical probability as trials grow',
      readouts: (v) => {
        const nn = Math.max(1, Math.round(v.trials));
        return [
          { label: 'trials', value: String(nn), color: VIOLET },
          { label: 'heads so far', value: String(Math.round(cumFreq[nn - 1] * nn)), color: SKY },
          { label: 'relative frequency', value: nf(cumFreq[nn - 1]), color: EMERALD },
          { label: 'theoretical p', value: nf(p), color: AMBER },
        ];
      },
    };
  },

  // ── Transforming Graphs chapter (2026-07-25) — the "Play with Graphs" modulus
  //    toolkit. Each is a FOLD/MIRROR animation driven by one t-slider (0 → 1),
  //    against a dashed ghost of the original f, so the student watches the
  //    operation happen instead of reading a finished figure. params.demo picks
  //    the base function (TFORM_DEMOS). ──────────────────────────────────────

  // |f(x)| — fold the below-axis part UP. At t=1 every dip below the x-axis has
  // flipped up; new sharp corners appear at the old x-intercepts.
  'modulus-abs-f': (_JXG, board, params) => {
    const d = tformDemo(params);
    const { sliders, meta } = mkSliderStack(board, [
      { name: 't', min: 0, max: 1, color: AMBER, start: 0, extra: { snapWidth: 0.01 } },
    ]);
    const t = sliders['t'];
    board.create('functiongraph', [d.f], {
      strokeColor: TEXT.ghost, strokeWidth: 1.5, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    board.create('functiongraph', [(x: number) => { const y = d.f(x); return y >= 0 ? y : y * (1 - 2 * t.Value()); }], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'fold the dip up:  y = |f(x)|',
      equation: (v) => v.t >= 0.99 ? `y = ${d.absF}` : v.t <= 0.01 ? `y = ${d.base}` : 'folding the dip upward…',
    };
  },

  // f(|x|) — keep the RIGHT half, mirror it onto the left (the original left half
  // is discarded). At t=1 the graph is symmetric about the y-axis (even).
  'modulus-inner-abs': (_JXG, board, params) => {
    const d = tformDemo(params);
    const { sliders, meta } = mkSliderStack(board, [
      { name: 't', min: 0, max: 1, color: AMBER, start: 0, extra: { snapWidth: 0.01 } },
    ]);
    const t = sliders['t'];
    board.create('functiongraph', [d.f], {
      strokeColor: TEXT.ghost, strokeWidth: 1.5, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    board.create('functiongraph', [(x: number) => (x >= 0 ? d.f(x) : d.f((1 - 2 * t.Value()) * x))], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'mirror the right half:  y = f(|x|)',
      equation: (v) => v.t >= 0.99 ? `y = ${d.fAbs}` : v.t <= 0.01 ? `y = ${d.base}` : 'mirroring the right half leftward…',
    };
  },

  // |y| = f(x) — DELETE where f < 0, and reflect the surviving f ≥ 0 part DOWN as
  // well as up. The result is symmetric about the x-axis (a relation, not a
  // function). The dashed ghost keeps showing the deleted dip so "delete" reads.
  'modulus-abs-y': (_JXG, board, params) => {
    const d = tformDemo(params);
    const { sliders, meta } = mkSliderStack(board, [
      { name: 't', min: 0, max: 1, color: AMBER, start: 0, extra: { snapWidth: 0.01 } },
    ]);
    const t = sliders['t'];
    board.create('functiongraph', [d.f], {
      strokeColor: TEXT.ghost, strokeWidth: 1.5, dash: 2, highlightStrokeColor: TEXT.ghost,
    } as any);
    // upper half — f where f ≥ 0, a gap (NaN) where f < 0 so the deleted region shows
    board.create('functiongraph', [(x: number) => { const y = d.f(x); return y >= 0 ? y : NaN; }], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    // lower half — swings from coincident with the upper (t=0) down to its mirror (t=1)
    board.create('functiongraph', [(x: number) => { const y = d.f(x); return y >= 0 ? y * (1 - 2 * t.Value()) : NaN; }], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'reflect the kept part down:  |y| = f(x)',
      equation: (v) => v.t >= 0.99 ? `|y| = ${d.base}` : v.t <= 0.01 ? `y = ${d.base}  (where it’s ≥ 0)` : 'reflecting downward…',
    };
  },

  // INTERSECTION COUNTER — "solve an equation by counting graph crossings." A fixed
  // wave (sin/cos) and a movable line y = m·x; a live readout counts real solutions
  // as the student drags the slope. The exercise a paper book cannot set (e.g.
  // sin x = x/10 → 7 solutions). params.curve ∈ {sin, cos}.
  'intersection-counter': (_JXG, board, params) => {
    const which = str(params, 'curve', 'sin');
    const cf = which === 'cos' ? Math.cos : Math.sin;
    const cLabel = which === 'cos' ? 'cos x' : 'sin x';
    board.create('functiongraph', [(x: number) => cf(x)], {
      strokeColor: SKY, strokeWidth: 2.5, highlightStrokeColor: SKY,
    } as any);
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'm', min: -1, max: 1, color: VIOLET, start: 0.1, extra: { snapWidth: 0.01 } },
    ]);
    const m = sliders['m'];
    board.create('functiongraph', [(x: number) => m.Value() * x], {
      strokeColor: VIOLET, strokeWidth: 2.5, highlightStrokeColor: VIOLET,
    } as any);
    const countRoots = (mv: number) => {
      let c = 0; let prev = cf(-15) - mv * -15;
      for (let x = -15 + 0.02; x <= 15; x += 0.02) {
        const cur = cf(x) - mv * x;
        if (prev === 0 || (prev < 0) !== (cur < 0)) c++;
        prev = cur;
      }
      return c;
    };
    return {
      sliders: meta,
      generalForm: `slide the line — where do  ${cLabel}  and  {m}x  cross?`,
      equation: (v) => `${cLabel} = ${nf(v.m)}x`,
      readouts: (v) => [{ label: 'solutions', value: String(countRoots(v.m)), color: AMBER }],
    };
  },

  // EXP BASE EXPLORER — y = aˣ with a base slider. MUST be an archetype, not a spec
  // 'a^x': JessieCode does NOT coerce a spec slider to its numeric value under the
  // '^' operator or pow()/log() function calls (only under + and * arithmetic), so a
  // declarative 'a^x' with a slider renders NaN everywhere except x=0 (NaN^0 = 1) —
  // a real founder-invisible bug caught in the 2026-07-25 visual QA. Using a.Value()
  // in a JS closure is the reliable path (same pattern as every other archetype).
  'exp-base-explorer': (_JXG, board, params) => {
    const { sliders, meta } = mkSliderStack(board, [
      { name: 'a', min: 0.2, max: 4, color: VIOLET, start: num(params, 'start', 2), extra: { snapWidth: 0.1 } },
    ]);
    const a = sliders['a'];
    board.create('point', [0, 1], {
      name: '(0, 1)', size: 3, fillColor: AMBER, strokeColor: AMBER, fixed: true,
      label: { strokeColor: TEXT.primary, fontSize: 12 },
    } as any);
    board.create('functiongraph', [(x: number) => Math.pow(a.Value(), x)], {
      strokeColor: VIOLET, strokeWidth: 2.75, highlightStrokeColor: VIOLET,
    } as any);
    return {
      sliders: meta,
      generalForm: 'y = {a}^x',
      equation: (v) => `y = ${nf(v.a)}^x`,
      calc: (v, x) => ({ sub: `${nf(v.a)}^{${x}}`, y: Math.pow(v.a, x) }),
    };
  },
};

// Author-facing catalogue for the admin builder's archetype picker + param hints.
export interface ArchetypeMeta {
  key: string;
  label: string;
  blurb: string;
  params?: { name: string; type: 'select' | 'number'; options?: string[]; default: string | number; hint?: string }[];
}
export const ARCHETYPE_CATALOG: ArchetypeMeta[] = [
  {
    key: 'transformations', label: 'Function transformations',
    blurb: 'a·f(b(x−h))+k with sliders vs a ghost of the original — the Functions workhorse.',
    params: [{ name: 'base', type: 'select', options: Object.keys(BASE_FUNCS), default: 'square', hint: 'base function f' }],
  },
  { key: 'unit-circle', label: 'Dynamic unit circle', blurb: 'Rotate θ; height = sin, shadow = cos. Trigonometry anchor.' },
  {
    key: 'tangent-explorer', label: 'Tangent explorer',
    blurb: 'Drag P on the curve; the tangent follows. Derivative-as-slope.',
    params: [{ name: 'base', type: 'select', options: Object.keys(BASE_FUNCS), default: 'square', hint: 'curve' }],
  },
  {
    key: 'area-under-curve', label: 'Area under a curve',
    blurb: 'Drag the interval; shaded area updates. Definite-integral intuition.',
    params: [{ name: 'base', type: 'select', options: Object.keys(BASE_FUNCS), default: 'square', hint: 'curve' }],
  },
  {
    key: 'reflection', label: 'Reflection',
    blurb: 'A draggable point and its mirror image. Symmetry / even–odd functions / coordinate geometry.',
    params: [
      { name: 'axis', type: 'select', options: ['x', 'y', 'origin'], default: 'y', hint: 'mirror axis' },
      { name: 'x', type: 'number', default: 3, hint: 'starting x' },
      { name: 'y', type: 'number', default: 4, hint: 'starting y' },
    ],
  },
  {
    key: 'sequence-pattern', label: 'Sequence pattern',
    blurb: 'Terms of an AP/GP as growing points, sliders for a and d/r. Seed a/d/r to open on your own worked example.',
    params: [
      { name: 'kind', type: 'select', options: ['ap', 'gp'], default: 'ap', hint: 'arithmetic or geometric' },
      { name: 'terms', type: 'number', default: 8, hint: 'how many terms (3–12)' },
      { name: 'a', type: 'number', default: 1, hint: 'starting value of the first term' },
      { name: 'd', type: 'number', default: 2, hint: 'starting common difference (AP mode)' },
      { name: 'r', type: 'number', default: 2, hint: 'starting common ratio (GP mode)' },
    ],
  },
  { key: 'line-explorer', label: 'Line explorer (y = mx + c)', blurb: 'Slope & intercept sliders. Straight-Lines anchor.' },
  {
    key: 'step-explorer', label: 'Step function [x] / ⌈x⌉',
    blurb: 'Drag x; read the greatest-integer (floor) or ceiling value, with the y=x ghost.',
    params: [{ name: 'kind', type: 'select', options: ['floor', 'ceil'], default: 'floor', hint: 'floor [x] or ceiling ⌈x⌉' }],
  },
  {
    key: 'vlt-sweep', label: 'Vertical-line test',
    blurb: 'Drag a vertical line across a shape; live crossings counter + function verdict.',
    params: [
      { name: 'shape', type: 'select', options: ['circle', 'parabola', 'cubic'], default: 'circle', hint: 'shape to test' },
      { name: 'r', type: 'number', default: 3, hint: 'circle radius' },
    ],
  },
  {
    key: 'even-odd-mirror', label: 'Even / odd symmetry',
    blurb: 'Drag P on the curve; the point at −x is shown with a live even/odd/neither verdict.',
    params: [{ name: 'base', type: 'select', options: Object.keys(BASE_FUNCS), default: 'cube', hint: 'function to test' }],
  },
  {
    key: 'piecewise-highlight', label: 'Absolute value |x| (piecewise)',
    blurb: 'Two coloured branches; drag x to see which branch (y=−x or y=x) is active.',
  },
  {
    key: 'power-family', label: 'Power family a·xⁿ',
    blurb: 'Coefficient slider a AND integer power n → y = a·xⁿ. See 2x² vs x², and how the power reshapes the family.',
  },
  {
    key: 'shift-explorer', label: 'Shifting (slide) only',
    blurb: 'Two sliders, h and k, slide a base shape left/right and up/down — one idea at a time.',
    params: [{ name: 'base', type: 'select', options: Object.keys(BASE_FUNCS), default: 'square', hint: 'base shape f' }],
  },
  {
    key: 'stretch-explorer', label: 'Stretching & flipping only',
    blurb: 'Two sliders, a and b, stretch/flip a base shape vertically and horizontally.',
    params: [{ name: 'base', type: 'select', options: Object.keys(BASE_FUNCS), default: 'square', hint: 'base shape f' }],
  },
  {
    key: 'distance-explorer', label: 'Distance between two points',
    blurb: 'Drag P and Q; live dashed legs + hypotenuse with a Δx/Δy/d readout. The visual proof of the distance formula.',
    params: [
      { name: 'x1', type: 'number', default: 1, hint: 'P start x' }, { name: 'y1', type: 'number', default: 1, hint: 'P start y' },
      { name: 'x2', type: 'number', default: 6, hint: 'Q start x' }, { name: 'y2', type: 'number', default: 5, hint: 'Q start y' },
    ],
  },
  {
    key: 'midpoint-explorer', label: 'Midpoint of a segment',
    blurb: 'Drag P and Q; the midpoint M tracks live. Discover "average the coordinates" by hand.',
    params: [
      { name: 'x1', type: 'number', default: -2, hint: 'P start x' }, { name: 'y1', type: 'number', default: 1, hint: 'P start y' },
      { name: 'x2', type: 'number', default: 4, hint: 'Q start x' }, { name: 'y2', type: 'number', default: 5, hint: 'Q start y' },
    ],
  },
  {
    key: 'circle-locus-explorer', label: 'Circle as a locus',
    blurb: 'Fixed centre, a radius slider, a draggable point — live distance + on/inside/outside verdict.',
    params: [
      { name: 'h', type: 'number', default: 0, hint: 'centre x' }, { name: 'k', type: 'number', default: 0, hint: 'centre y' },
      { name: 'r', type: 'number', default: 3, hint: 'starting radius' },
    ],
  },
  {
    key: 'collinearity-checker', label: 'Are three points collinear?',
    blurb: 'Drag A, B, C; live pairwise distances + the distance-sum collinearity test, self-graded.',
    params: [
      { name: 'x1', type: 'number', default: -3, hint: 'A x' }, { name: 'y1', type: 'number', default: -2, hint: 'A y' },
      { name: 'x2', type: 'number', default: 1, hint: 'B x' }, { name: 'y2', type: 'number', default: 1, hint: 'B y' },
      { name: 'x3', type: 'number', default: 5, hint: 'C x' }, { name: 'y3', type: 'number', default: 4, hint: 'C y' },
    ],
  },
  {
    key: 'inscribed-angle-explorer', label: 'Inscribed angle theorem',
    blurb: 'Drag P around the circle; live central-vs-inscribed angle readout stays locked at 2:1. Set dual:true for "angles in the same segment."',
    params: [
      { name: 'r', type: 'number', default: 3, hint: 'circle radius' },
      { name: 'dual', type: 'select', options: ['false', 'true'], default: 'false', hint: 'add a second point Q (same-segment corollary)' },
    ],
  },
  {
    key: 'circle-area-slice-rearrange', label: 'Circle area — slice & rearrange',
    blurb: 'A wedge-count slider slices a circle AND lays the wedges into a strip that flattens toward a πr × r rectangle as n grows.',
    params: [
      { name: 'r', type: 'number', default: 3, hint: 'circle radius' },
      { name: 'n', type: 'number', default: 8, hint: 'starting wedge count (4-24)' },
    ],
  },
  {
    key: 'sum-pairing-proof', label: 'Gauss staircase (sum of first n naturals)',
    blurb: 'An ascending bar-staircase + its mirrored descending copy tile an n×(n+1) rectangle — the 2·Sₙ = n(n+1) proof.',
    params: [{ name: 'n', type: 'number', default: 5, hint: 'starting term count (2-12)' }],
  },
  {
    key: 'circumcircle-explorer', label: 'Circumcircle through 3 points',
    blurb: 'Drag a triangle\'s vertices; both perpendicular bisectors + the circle through all three draw live.',
    params: [
      { name: 'x1', type: 'number', default: -2, hint: 'A x' }, { name: 'y1', type: 'number', default: -1, hint: 'A y' },
      { name: 'x2', type: 'number', default: 2, hint: 'B x' }, { name: 'y2', type: 'number', default: 2, hint: 'B y' },
      { name: 'x3', type: 'number', default: 3, hint: 'C x' }, { name: 'y3', type: 'number', default: -2, hint: 'C y' },
    ],
  },
  {
    key: 'chord-distance-explorer', label: 'Chord length vs. distance/angle from centre',
    blurb: 'Two draggable chords; live length + perpendicular-distance-from-centre + central angle for each — covers equal-chords-equal-angle AND equal-chords-equidistant.',
    params: [{ name: 'r', type: 'number', default: 3, hint: 'circle radius' }],
  },
  {
    key: 'cyclic-quad-explorer', label: 'Cyclic quadrilateral — opposite angles',
    blurb: 'Live interior angles + opposite-angle-sum verdict. Set constrainD:false to demo the converse (drag D off the circle).',
    params: [
      { name: 'r', type: 'number', default: 3, hint: 'circle radius' },
      { name: 'constrainD', type: 'select', options: ['true', 'false'], default: 'true', hint: 'keep D on the circle, or free it (converse)' },
    ],
  },
  {
    key: 'circle-anatomy-explorer', label: 'Parts of a circle',
    blurb: 'Drag P around the circle; live radius/chord readout, "is it a diameter?" verdict when P is opposite A.',
    params: [{ name: 'r', type: 'number', default: 3, hint: 'circle radius' }],
  },
  {
    key: 'chord-perpendicular-bisector', label: 'Perpendicular from centre bisects the chord',
    blurb: 'Drag a chord; the foot of the perpendicular from the centre always lands at the midpoint.',
    params: [{ name: 'r', type: 'number', default: 3, hint: 'circle radius' }],
  },
  {
    key: 'circle-symmetry-explorer', label: 'Circle symmetry',
    blurb: 'A rotation slider sweeps a diameter through every angle — always a line of symmetry.',
    params: [{ name: 'r', type: 'number', default: 3, hint: 'circle radius' }],
  },
  {
    key: 'surd-spiral-construction', label: 'Spiral of Theodorus (√n construction)',
    blurb: 'A term-count slider reveals a right-triangle spiral one triangle at a time — OPₙ = √n appears, not just stated.',
    params: [{ name: 'n', type: 'number', default: 6, hint: 'starting number of triangles (2-16)' }],
  },
  {
    key: 'parallelogram-to-rectangle', label: 'Parallelogram → rectangle (cut & slide)',
    blurb: 'A slider slides the cut end-triangle from the parallelogram position to the rectangle position — same area throughout.',
    params: [
      { name: 'b', type: 'number', default: 5, hint: 'base' }, { name: 'h', type: 'number', default: 3, hint: 'height' },
      { name: 's', type: 'number', default: 2, hint: 'slant offset' },
    ],
  },
  {
    key: 'triangle-pair-to-parallelogram', label: 'Triangle pair → parallelogram',
    blurb: 'A slider reveals a congruent second triangle sliding into place, completing a parallelogram of double the area.',
    params: [
      { name: 'b', type: 'number', default: 5, hint: 'base' }, { name: 'h', type: 'number', default: 3, hint: 'height' },
      { name: 'c', type: 'number', default: 1.5, hint: 'apex x-offset' },
    ],
  },
  {
    key: 'sector-explorer', label: 'Sector area & arc length',
    blurb: 'An angle slider sweeps the sector; live arc-length and sector-area readouts.',
    params: [{ name: 'r', type: 'number', default: 3, hint: 'circle radius' }],
  },
  {
    key: 'trial-convergence', label: 'Relative frequency → probability',
    blurb: 'A trials slider reveals the running relative-frequency curve converging toward the theoretical probability.',
    params: [
      { name: 'p', type: 'number', default: 0.5, hint: 'true probability (0-1)' },
      { name: 'trials', type: 'number', default: 10, hint: 'starting trial count' },
    ],
  },
  {
    key: 'modulus-abs-f', label: 'Modulus |f(x)| — fold the dip up',
    blurb: 'Drag t from 0→1; the below-axis part of f folds up. New sharp corners appear at the old roots.',
    params: [{ name: 'demo', type: 'select', options: Object.keys(TFORM_DEMOS), default: 'parabola', hint: 'base function f' }],
  },
  {
    key: 'modulus-inner-abs', label: 'Modulus f(|x|) — mirror the right half',
    blurb: 'Drag t from 0→1; the right half is mirrored onto the left (the original left half is discarded). Result is even.',
    params: [{ name: 'demo', type: 'select', options: Object.keys(TFORM_DEMOS), default: 'parabola', hint: 'base function f' }],
  },
  {
    key: 'modulus-abs-y', label: 'Modulus |y| = f(x) — reflect down',
    blurb: 'Drag t from 0→1; the f≥0 part is reflected below the axis too (a relation). Where f<0 is deleted.',
    params: [{ name: 'demo', type: 'select', options: Object.keys(TFORM_DEMOS), default: 'parabola', hint: 'base function f' }],
  },
  {
    key: 'intersection-counter', label: 'Count solutions (drag the line)',
    blurb: 'A fixed wave and a movable line y = m·x; a live readout counts real solutions. Solve sin x = m·x by eye.',
    params: [{ name: 'curve', type: 'select', options: ['sin', 'cos'], default: 'sin', hint: 'the fixed wave' }],
  },
  {
    key: 'exp-base-explorer', label: 'Exponential y = aˣ (base slider)',
    blurb: 'A base slider a reshapes y = aˣ; pins to (0,1), flips to decay below a = 1. Use this, not a spec a^x (which mis-renders).',
    params: [{ name: 'start', type: 'number', default: 2, hint: 'starting base a' }],
  },
];
