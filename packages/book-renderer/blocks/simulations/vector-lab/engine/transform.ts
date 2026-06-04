// transform.ts — pure CSS-pixel ⇄ physics-metre mapping for the canvas-rendered
// dynamic modules. Physics is in MKS (metres, kg, seconds, y UP) to match planck
// and the textbook; the canvas draws in CSS pixels (y DOWN). This is the single
// place that flips y, mirroring viewport.ts for the SVG side.

export interface XY {
  x: number;
  y: number;
}

export interface ViewTransform {
  /** CSS pixel size of the canvas. */
  w: number;
  h: number;
  /** Pixels per physics metre. */
  pxPerM: number;
  /** World origin, in CSS pixels. */
  ox: number;
  oy: number;
  toPx: (m: XY) => XY;
  toM: (px: XY) => XY;
}

export interface TransformOpts {
  /** How many metres span the canvas width. Sets the scale. */
  metersWide: number;
  /** World origin as a fraction of width/height (0,0 = top-left, 1,1 = bottom-right). */
  originXFrac?: number;
  originYFrac?: number;
}

export function makeTransform(w: number, h: number, opts: TransformOpts): ViewTransform {
  const pxPerM = w / opts.metersWide;
  const ox = w * (opts.originXFrac ?? 0.5);
  const oy = h * (opts.originYFrac ?? 0.5);
  return {
    w,
    h,
    pxPerM,
    ox,
    oy,
    toPx: (m) => ({ x: ox + m.x * pxPerM, y: oy - m.y * pxPerM }),
    toM: (px) => ({ x: (px.x - ox) / pxPerM, y: (oy - px.y) / pxPerM }),
  };
}
