'use client';

/*
 * field-bench/charts.tsx — the two small plots.
 * ─────────────────────────────────────────────────────────────────────────────
 * `GProfile`  — g against distance from the centre. The graph with the corner.
 * `IVCurve`   — photoelectric current against bias voltage.
 *
 * Both render ZERO <text> elements. Every axis end, every marked value and
 * every unit is printed as HTML underneath, colour-keyed to the marks — the
 * label-overlap rule, applied to plots as well as to the main stage. A number
 * in a fixed row beneath the plot is easier to read than one perched on a
 * curve, and it cannot be overrun when the curve moves.
 */

import type { GPoint } from './lib/gravity';
import type { IVPoint } from './lib/photoelectric';
import { ACCENT, TEXT, BORDER } from '../simulations/_shared';
import { ACCENT_B } from './ui';

const AXIS = 'rgba(255,255,255,0.18)';
const GRID = 'rgba(255,255,255,0.08)';

/**
 * g(r) from the centre outward, with the surface marked.
 *
 * The straight rise inside and the 1/r² fall outside meet at a corner AT the
 * surface. That corner is the entire lesson, so the surface line is drawn in
 * the secondary accent and never omitted for tidiness.
 */
export function GProfile({ points, surfaceR, probeR, probeG, maxG }:
  { points: GPoint[]; surfaceR: number; probeR: number; probeG: number; maxG: number }) {
  const W = 260;
  const H = 120;
  const PAD = 8;
  const rMax = points.length ? points[points.length - 1].r : 1;
  const gMax = Math.max(maxG, 1e-12) * 1.12;

  const px = (r: number) => PAD + (r / rMax) * (W - 2 * PAD);
  const py = (g: number) => H - PAD - (g / gMax) * (H - 2 * PAD);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${px(p.r).toFixed(1)},${py(p.g).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img"
      aria-label="Gravitational field strength against distance from the centre.">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={AXIS} strokeWidth={1} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={AXIS} strokeWidth={1} />
      <line x1={px(surfaceR)} y1={PAD} x2={px(surfaceR)} y2={H - PAD} stroke={ACCENT_B} strokeWidth={1.4} strokeDasharray="4 3" />
      <path d={d} fill="none" stroke={ACCENT} strokeWidth={2.2} />
      <line x1={px(probeR)} y1={py(probeG)} x2={px(probeR)} y2={H - PAD} stroke={GRID} strokeWidth={1} />
      <circle cx={px(probeR)} cy={py(probeG)} r={4.5} fill={ACCENT} />
    </svg>
  );
}

/**
 * The photoelectric I–V curve.
 *
 * Two curves are drawn together on purpose: the live one, and a faded
 * reference frozen at whatever the settings were when the student last pressed
 * "pin this curve". Comparing where the two meet the axis is how the lesson
 * lands — intensity moves the height, frequency moves the crossing.
 */
export function IVCurve({ live, pinned, stopping, saturation }:
  { live: IVPoint[]; pinned: IVPoint[] | null; stopping: number; saturation: number }) {
  const W = 300;
  const H = 150;
  const PAD = 10;
  const all = pinned ? [...live, ...pinned] : live;
  const vMin = Math.min(...all.map((p) => p.v), -0.2);
  const vMax = Math.max(...all.map((p) => p.v), 0.2);
  const iMax = Math.max(...all.map((p) => p.i), 1e-18) * 1.15;

  const px = (v: number) => PAD + ((v - vMin) / (vMax - vMin)) * (W - 2 * PAD);
  const py = (i: number) => H - PAD - (i / iMax) * (H - 2 * PAD);
  const path = (pts: IVPoint[]) =>
    pts.map((p, k) => `${k ? 'L' : 'M'}${px(p.v).toFixed(1)},${py(p.i).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img"
      aria-label="Photoelectric current against bias voltage.">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={AXIS} strokeWidth={1} />
      <line x1={px(0)} y1={PAD} x2={px(0)} y2={H - PAD} stroke={AXIS} strokeWidth={1} />
      {saturation > 0 && (
        <line x1={PAD} y1={py(saturation)} x2={W - PAD} y2={py(saturation)} stroke={GRID} strokeWidth={1} strokeDasharray="3 4" />
      )}
      {pinned && <path d={path(pinned)} fill="none" stroke={TEXT.ghost} strokeWidth={1.8} strokeDasharray="5 4" opacity={0.75} />}
      <path d={path(live)} fill="none" stroke={ACCENT} strokeWidth={2.4} />
      {stopping > 0 && (
        <>
          <line x1={px(-stopping)} y1={PAD} x2={px(-stopping)} y2={H - PAD} stroke={ACCENT_B} strokeWidth={1.6} strokeDasharray="4 3" />
          <circle cx={px(-stopping)} cy={py(0)} r={4.5} fill={ACCENT_B} />
        </>
      )}
    </svg>
  );
}

/** A colour-keyed caption row — the labels the plots are not allowed to draw. */
export function PlotKey({ items }: { items: { color: string; text: string }[] }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1"
      style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 6 }}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: TEXT.ghost }}>
          <span aria-hidden style={{ display: 'inline-block', width: 12, height: 0, borderTop: `2px solid ${it.color}` }} />
          {it.text}
        </span>
      ))}
    </div>
  );
}
