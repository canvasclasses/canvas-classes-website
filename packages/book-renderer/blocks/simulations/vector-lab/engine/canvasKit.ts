// canvasKit.ts — 2-D canvas drawing helpers for the dynamic modules. All the
// "in metres" variants take a ViewTransform so callers think in physics units
// and never touch pixels directly. Arrow lengths are therefore true to the
// vectors they represent (the design principle: arrows are never decorative).

import type { ViewTransform, XY } from './transform';

export function clear(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Match the simulator canvas viewport gradient from the design system.
  const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, '#1e204a');
  g.addColorStop(1, '#050614');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function gridM(ctx: CanvasRenderingContext2D, tf: ViewTransform, stepM: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  const stepPx = stepM * tf.pxPerM;
  for (let x = tf.ox % stepPx; x <= tf.w; x += stepPx) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, tf.h);
    ctx.stroke();
  }
  for (let y = tf.oy % stepPx; y <= tf.h; y += stepPx) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(tf.w, y);
    ctx.stroke();
  }
  ctx.restore();
}

export interface ArrowOpts {
  color: string;
  width?: number;
  dashed?: boolean;
  label?: string;
  labelColor?: string;
  italic?: boolean;
  alpha?: number;
}

/** Arrow between two CSS-pixel points. */
export function arrowPx(ctx: CanvasRenderingContext2D, a: XY, b: XY, o: ArrowOpts) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  ctx.save();
  ctx.globalAlpha = o.alpha ?? 1;
  ctx.strokeStyle = o.color;
  ctx.fillStyle = o.color;
  ctx.lineWidth = o.width ?? 3.5;
  ctx.lineCap = 'round';
  if (len < 0.5) {
    ctx.beginPath();
    ctx.arc(a.x, a.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(15, len * 0.42);
  const shaftX = b.x - ux * head * 0.9;
  const shaftY = b.y - uy * head * 0.9;
  ctx.setLineDash(o.dashed ? [8, 7] : []);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(shaftX, shaftY);
  ctx.stroke();
  ctx.setLineDash([]);
  const w = head * 0.55;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(shaftX - uy * w, shaftY + ux * w);
  ctx.lineTo(shaftX + uy * w, shaftY - ux * w);
  ctx.closePath();
  ctx.fill();
  if (o.label) {
    ctx.fillStyle = o.labelColor ?? o.color;
    ctx.font = `${o.italic ? 'italic ' : ''}800 15px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(o.label, b.x + ux * 6 - uy * 13, b.y + uy * 6 + ux * 13);
  }
  ctx.restore();
}

/** Arrow between two physics-metre points. */
export function arrowM(ctx: CanvasRenderingContext2D, tf: ViewTransform, from: XY, to: XY, o: ArrowOpts) {
  arrowPx(ctx, tf.toPx(from), tf.toPx(to), o);
}

export function dotM(ctx: CanvasRenderingContext2D, tf: ViewTransform, at: XY, color: string, r = 4) {
  const p = tf.toPx(at);
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function textM(
  ctx: CanvasRenderingContext2D,
  tf: ViewTransform,
  at: XY,
  text: string,
  color: string,
  opts: { size?: number; align?: CanvasTextAlign; dxPx?: number; dyPx?: number; weight?: number } = {}
) {
  const p = tf.toPx(at);
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${opts.weight ?? 600} ${opts.size ?? 12}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = opts.align ?? 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, p.x + (opts.dxPx ?? 0), p.y + (opts.dyPx ?? 0));
  ctx.restore();
}

/** Filled polygon from metre-space points (e.g. a settled load body). */
export function polyM(ctx: CanvasRenderingContext2D, tf: ViewTransform, pts: XY[], fill: string, stroke?: string) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.beginPath();
  const p0 = tf.toPx(pts[0]);
  ctx.moveTo(p0.x, p0.y);
  for (let i = 1; i < pts.length; i++) {
    const p = tf.toPx(pts[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

/** Polyline in metre-space (trajectory traces). */
export function pathM(ctx: CanvasRenderingContext2D, tf: ViewTransform, pts: XY[], color: string, width = 2, dashed = false) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [6, 6] : []);
  ctx.beginPath();
  const p0 = tf.toPx(pts[0]);
  ctx.moveTo(p0.x, p0.y);
  for (let i = 1; i < pts.length; i++) {
    const p = tf.toPx(pts[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();
}

export function lineM(ctx: CanvasRenderingContext2D, tf: ViewTransform, a: XY, b: XY, color: string, width = 2, dashed = false) {
  const pa = tf.toPx(a);
  const pb = tf.toPx(b);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [5, 5] : []);
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
  ctx.restore();
}
