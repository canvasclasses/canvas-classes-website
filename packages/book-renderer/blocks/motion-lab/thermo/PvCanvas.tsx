'use client';

/*
 * motion-lab/thermo/PvCanvas.tsx — the pressure–volume plane.
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared by the PV Workbench and the Heat Engine Bench so the two draw the same
 * plane the same way. A student who meets an isotherm on one and a Carnot loop
 * on the other must be looking at the same picture, or the transfer that makes
 * the second bench cheap to learn does not happen.
 *
 * ── THE SHADING IS THE ARITHMETIC ───────────────────────────────────────────
 * `areaUnder()` closes the drawn polyline down to the V-axis and fills it. The
 * work in the ledger comes from `workAlongPath()` over THE SAME point array by
 * the trapezoid rule. They are not two computations that agree — they are one
 * computation, drawn and printed. Drag the process and both move together
 * because there is nothing to keep in sync.
 *
 * For a closed cycle, the filled region is the polygon itself and the ledger's
 * net work is the trapezoid sum round it, which IS the shoelace area. "Net work
 * = the area you enclosed" is therefore an identity here, not an assertion.
 *
 * Zero `<text>` elements (§4E). Axis ranges are printed in the legend row under
 * the canvas, where they cannot collide with a curve.
 */

import * as React from 'react';
import type { Leg } from './lib/pv';
import { polyline, areaUnder, px, py, type Plot } from '../waves/lib/plot';
import { pvPlotOf } from './lib/pvview';
import { PlotFrame } from '../waves/svgparts';
import { ACCENT, ACCENT_2, accentTint } from '../waves/ui';

export interface PvSeries {
  /** The sampled path. */
  points: { V: number; P: number }[];
  color: string;
  dashed?: boolean;
  /** Shade the region down to the V-axis — the work done on this leg. */
  shade?: boolean;
  /** Draw a dot at the start and the end. */
  endpoints?: boolean;
  width?: number;
  opacity?: number;
}

export interface PvCanvasProps {
  w: number;
  h: number;
  series: PvSeries[];
  /** A closed loop to fill — the enclosed area IS the net work. */
  loop?: { points: { V: number; P: number }[]; color: string } | null;
  /** State markers: the numbered corners a student can point at. */
  markers?: { V: number; P: number; color: string; ring?: boolean }[];
  /** The draggable endpoint, if this bench offers one. */
  handle?: { V: number; P: number } | null;
  handleHint?: boolean;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  onPointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (e: React.PointerEvent<SVGSVGElement>) => void;
  /** Reported back so the caller can hit-test a drag in data space. */
  onPlot?: (plot: Plot) => void;
}

/** Fit the plane to everything that will be drawn. The camera itself lives in
 *  `lib/pvview.ts` (pure) so the verifier can measure the canvas fill without
 *  rendering — see that file for why the axes are fitted independently and why
 *  the pressure axis always starts at zero. */
export function pvPlot(w: number, h: number, series: PvSeries[], loop?: { points: { V: number; P: number }[] } | null): Plot {
  const groups = series.map((s) => s.points);
  if (loop) groups.push(loop.points);
  return pvPlotOf(w, h, groups);
}

export default function PvCanvas(p: PvCanvasProps) {
  const plot = pvPlot(p.w, p.h, p.series, p.loop);
  p.onPlot?.(plot);
  const asPts = (pts: { V: number; P: number }[]) => pts.map((q) => ({ x: q.V, y: q.P }));

  return (
    <svg ref={p.svgRef} viewBox={`0 0 ${p.w} ${p.h}`} width="100%" height="100%"
      style={{ display: 'block', touchAction: 'none' }}
      onPointerDown={p.onPointerDown} onPointerMove={p.onPointerMove}
      onPointerUp={p.onPointerUp} onPointerCancel={p.onPointerUp}>
      <PlotFrame plot={plot} xTicks={6} yTicks={5} zeroLine={false} />

      {/* work under each leg — the same points the ledger integrates */}
      {p.series.filter((s) => s.shade).map((s, i) => (
        <path key={`sh${i}`} d={areaUnder(plot, asPts(s.points), 0)}
          fill={accentTint(s.color, 0.18)} stroke="none" />
      ))}

      {/* a closed cycle's enclosed region */}
      {p.loop && (
        <path d={`${polyline(plot, asPts(p.loop.points))}Z`}
          fill={accentTint(p.loop.color, 0.22)} stroke="none" />
      )}

      {/* the paths themselves */}
      {p.series.map((s, i) => (
        <path key={`ln${i}`} d={polyline(plot, asPts(s.points))} fill="none"
          stroke={s.color} strokeWidth={s.width ?? 2.4}
          strokeDasharray={s.dashed ? '7 5' : undefined} opacity={s.opacity ?? 1} />
      ))}

      {/* endpoints of each leg, so the corners of a cycle are pointable */}
      {p.series.filter((s) => s.endpoints).map((s, i) => {
        const a = s.points[0];
        const b = s.points[s.points.length - 1];
        return (
          <g key={`ep${i}`} style={{ pointerEvents: 'none' }}>
            <circle cx={px(plot, a.V)} cy={py(plot, a.P)} r={4} fill={s.color} />
            <circle cx={px(plot, b.V)} cy={py(plot, b.P)} r={4} fill={s.color} />
          </g>
        );
      })}

      {(p.markers ?? []).map((m, i) => (
        <circle key={`mk${i}`} cx={px(plot, m.V)} cy={py(plot, m.P)} r={m.ring ? 7 : 5}
          fill={m.ring ? 'none' : m.color} stroke={m.color} strokeWidth={2} />
      ))}

      {p.handle && (
        <g>
          {p.handleHint && (
            <circle cx={px(plot, p.handle.V)} cy={py(plot, p.handle.P)} r={16}
              fill="none" stroke={ACCENT} strokeWidth={2} opacity={0.5}>
              <animate attributeName="r" values="12;21;12" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.12;0.6" dur="1.6s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={px(plot, p.handle.V)} cy={py(plot, p.handle.P)} r={8}
            fill={accentTint(ACCENT, 0.9)} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5}
            style={{ cursor: 'grab' }} />
        </g>
      )}
    </svg>
  );
}

/** Turn a list of legs into drawable series. Kept here so both benches colour
 *  expansion and compression the same way — expansion in the primary accent
 *  (work coming OUT), compression in the secondary (work going IN). */
export function legsToSeries(legs: Leg[], shade: boolean): PvSeries[] {
  return legs.map((l) => {
    const expanding = l.to.V > l.from.V;
    return {
      points: l.points,
      color: expanding ? ACCENT : ACCENT_2,
      dashed: l.kind === 'adiabatic',
      shade,
      endpoints: true,
    };
  });
}
