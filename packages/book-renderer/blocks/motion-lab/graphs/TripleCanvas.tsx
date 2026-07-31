'use client';

/*
 * motion-lab/graphs/TripleCanvas.tsx — three graphs, ONE svg, ONE clock.
 * ─────────────────────────────────────────────────────────────────────────────
 *      ┌──────────────────────────────────────┐
 *      │ x–t        ╱                         │
 *      ├──────────────────────────────────────┤   ← one cursor line runs
 *      │ v–t   ▨▨▨▨▨│▨▨▨   (signed area)      │     UNBROKEN through all
 *      ├──────────────────────────────────────┤     three panels
 *      │ a–t   ▄▄▄▄▄│▄▄▄▄  (staircase)        │
 *      └──────────────────────────────────────┘
 *      └──────── one shared time axis ─────────┘
 *
 * ── WHY ONE SVG ─────────────────────────────────────────────────────────────
 * `projectile/Field.tsx` states the argument and it applies with more force
 * here: three SVGs in a column would drift out of alignment on resize, and the
 * claim of this simulation is that the three panels are ONE dataset. The visible
 * proof of that claim is a single cursor line crossing all three at exactly the
 * same instant — in pixels, not approximately. One SVG, one `sxT`, one sampler
 * (`sampleAt` over the one `Sample[]`), so it is structurally impossible for the
 * three dots to disagree.
 *
 * ── LABEL RULE (SIMULATION_DESIGN_WORKFLOW §4E) ─────────────────────────────
 * The one-text-element rule cannot hold on a graph: an axis without numbers is
 * not a graph, it is a shape. So this canvas carries tick labels, and it makes
 * them collision-free BY CONSTRUCTION rather than by measuring anything:
 *   • ONE shared time axis, drawn once, with the tick COUNT capped so labels sit
 *     at least 52 px apart (`timeTicks` in lib/plot.ts).
 *   • EXACTLY TWO y labels per panel — the window top and bottom — pinned in the
 *     left gutter, so they are ≥ 74 px apart vertically and never enter the plot
 *     area or the time-axis row.
 * Every OTHER number — the live values at the cursor, the areas, the slopes, the
 * distance ledger — is in the colour-keyed legend below the canvas, where it
 * belongs.
 *
 * ── COLOUR ──────────────────────────────────────────────────────────────────
 * ONE primary accent (violet) for the motion itself on all three panels, and ONE
 * secondary (sky) reserved for a single genuine second axis: BACKWARD travel,
 * i.e. the part of the v–t area that lies below zero and therefore subtracts.
 * Reference and target curves are white at low opacity, never a third hue.
 * The a–t bars deliberately do NOT use the two-colour split — a positive
 * acceleration is not "forward motion", and colouring it as though it were
 * would draw the very misconception this module attacks.
 */

import * as React from 'react';
import { ACCENT, ACCENT_2, TEXT, accentTint } from '../../simulations/_shared';
import type { Stack, Panel, PanelKey } from './lib/plot';
import { sxT, syP, timeTicks, panelYLabels, innerW } from './lib/plot';
import type { Sample, VtModel } from './lib/kinematics';
import { areaPieces, segCount, segAccel, sampleAt, vAt, xAt } from './lib/kinematics';
import type { Handle } from './lib/handles';
import { slopeToPixels, markerPoints } from './lib/handles';
import type { DriverAxis } from './types';

export interface RevealMap { x: boolean; v: boolean; a: boolean }

export interface TripleCanvasProps {
  stack: Stack;
  samples: Sample[];
  model: VtModel;
  /** Pale dashed reference: the Match target, or the "before" curve. */
  ghost?: { samples: Sample[]; model: VtModel } | null;
  /** Which quantity the ghost belongs to, so it only draws on that panel. */
  ghostOn?: PanelKey;
  /** Match mode: half-width of the pass band drawn around the ghost. */
  tolerance?: number | null;
  cursorT: number;
  driver: DriverAxis | null;
  handles: Handle[];
  /** The handle currently under the finger, drawn larger. */
  grabbed: Handle | null;
  reveal: RevealMap;
  showArea: boolean;
  showTangent: boolean;
  /** Two draggable instants on the x–t panel: the average-velocity chord. */
  chord: { tA: number; tB: number } | null;
  /** Match mode: shade the stretch that failed. */
  errorWindow: { t0: number; t1: number } | null;
  /** Freehand mode paints; node mode grabs. Changes the cursor affordance only. */
  sketch: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
  /** Pulse the first handle until the student has touched one. */
  showGrabHint: boolean;
}

const PANEL_OF = (s: Stack, key: PanelKey): Panel | undefined => s.panels.find((p) => p.key === key);

const fmtTick = (v: number): string => {
  const a = Math.abs(v);
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(0);
  if (a === 0) return '0';
  return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
};

/** A polyline through a (t, value) series, in one panel's space. */
function seriesPath(s: Stack, p: Panel, pts: { t: number; y: number }[], everyNth = 1): string {
  if (!pts.length) return '';
  let d = '';
  for (let i = 0; i < pts.length; i += everyNth) {
    d += `${i ? 'L' : 'M'}${sxT(s, pts[i].t).toFixed(1)},${syP(p, pts[i].y).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += `L${sxT(s, last.t).toFixed(1)},${syP(p, last.y).toFixed(1)}`;
  return d;
}

export default function TripleCanvas(q: TripleCanvasProps) {
  // A page can carry two graphs blocks. An SVG `clipPath` id is DOCUMENT-global,
  // so a hardcoded one would make the second block's accumulated-area clip use
  // the first block's rectangle — a wrong drawing with no error anywhere.
  const clipId = `triple-accum-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const s = q.stack;
  const px = PANEL_OF(s, 'x');
  const pv = PANEL_OF(s, 'v');
  const pa = PANEL_OF(s, 'a');
  const tTicks = timeTicks(s);
  const now = sampleAt(q.samples, q.cursorT);
  const cursorX = sxT(s, q.cursorT);
  const stackTop = s.pad.t;
  const stackBottom = s.h - s.pad.b;

  const xSeries = q.samples.map((p) => ({ t: p.t, y: p.x }));
  const vSeries = q.samples.map((p) => ({ t: p.t, y: p.v }));

  return (
    <svg
      ref={q.svgRef}
      viewBox={`0 0 ${s.w} ${s.h}`}
      width="100%"
      height="100%"
      style={{
        display: 'block',
        touchAction: 'none',
        cursor: q.driver ? (q.sketch ? 'crosshair' : 'grab') : 'default',
      }}
      onPointerDown={q.onPointerDown}
      onPointerMove={q.onPointerMove}
      onPointerUp={q.onPointerUp}
      onPointerCancel={q.onPointerUp}
    >
      {/* ── panel frames, grids and zero lines ─────────────────────────────── */}
      {s.panels.map((p) => {
        const live = q.driver === p.key;
        return (
          <g key={`frame-${p.key}`} style={{ pointerEvents: 'none' }}>
            <rect
              x={s.pad.l - 6} y={p.top} width={innerW(s) + 12} height={p.h} rx={8}
              fill={live ? accentTint(ACCENT, 0.05) : 'rgba(255,255,255,0.018)'}
              stroke={live ? accentTint(ACCENT, 0.3) : 'rgba(255,255,255,0.06)'}
              strokeWidth={1}
            />
            {tTicks.map((t) => (
              <line key={`g-${p.key}-${t}`} x1={sxT(s, t)} y1={p.top + 2} x2={sxT(s, t)} y2={p.top + p.h - 2}
                stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}
            {p.yMin < 0 && p.yMax > 0 && (
              <line x1={s.pad.l} y1={syP(p, 0)} x2={s.w - s.pad.r} y2={syP(p, 0)}
                stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
            )}
          </g>
        );
      })}

      {/* ── the failed stretch, in Match mode ──────────────────────────────── */}
      {q.errorWindow && s.panels.map((p) => (
        <rect key={`err-${p.key}`}
          x={sxT(s, q.errorWindow!.t0)} y={p.top}
          width={Math.max(2, sxT(s, q.errorWindow!.t1) - sxT(s, q.errorWindow!.t0))}
          height={p.h}
          fill="rgba(252,165,165,0.10)"   /* sim-lint-ok — BAD is the pass/fail pair */
          style={{ pointerEvents: 'none' }}
        />
      ))}

      {/* ══ v–t: the signed area, drawn BEFORE the curve so the line sits on top */}
      {pv && q.reveal.v && q.showArea && (
        <g style={{ pointerEvents: 'none' }}>
          {areaPieces(q.model).map((piece, i) => {
            const y0 = syP(pv, 0);
            const d =
              `M${sxT(s, piece.t0).toFixed(1)},${y0.toFixed(1)}` +
              `L${sxT(s, piece.t0).toFixed(1)},${syP(pv, piece.v0).toFixed(1)}` +
              `L${sxT(s, piece.t1).toFixed(1)},${syP(pv, piece.v1).toFixed(1)}` +
              `L${sxT(s, piece.t1).toFixed(1)},${y0.toFixed(1)}Z`;
            const forward = piece.sign > 0;
            return (
              <path key={`area-${i}`} d={d}
                fill={accentTint(forward ? ACCENT : ACCENT_2, forward ? 0.2 : 0.26)}
                stroke={accentTint(forward ? ACCENT : ACCENT_2, 0.35)}
                strokeWidth={0.75} />
            );
          })}
          {/* The part already accumulated at the cursor, brighter — so "area so
              far" is a visible quantity rather than a number in a box. */}
          <clipPath id={clipId}>
            <rect x={s.pad.l - 6} y={pv.top} width={Math.max(0, cursorX - s.pad.l + 6)} height={pv.h} />
          </clipPath>
          <g clipPath={`url(#${clipId})`}>
            {areaPieces(q.model).map((piece, i) => {
              const y0 = syP(pv, 0);
              const d =
                `M${sxT(s, piece.t0).toFixed(1)},${y0.toFixed(1)}` +
                `L${sxT(s, piece.t0).toFixed(1)},${syP(pv, piece.v0).toFixed(1)}` +
                `L${sxT(s, piece.t1).toFixed(1)},${syP(pv, piece.v1).toFixed(1)}` +
                `L${sxT(s, piece.t1).toFixed(1)},${y0.toFixed(1)}Z`;
              const forward = piece.sign > 0;
              return <path key={`accum-${i}`} d={d} fill={accentTint(forward ? ACCENT : ACCENT_2, 0.3)} />;
            })}
          </g>
        </g>
      )}

      {/* ══ a–t: the staircase. The bars ARE the area, so Δv is visible as the
             same rectangles — no separate shading needed. Colour does NOT split
             on sign here; see the header. ═════════════════════════════════════ */}
      {pa && q.reveal.a && (
        <g style={{ pointerEvents: 'none' }}>
          {Array.from({ length: segCount(q.model) }, (_, i) => {
            const a = segAccel(q.model, i);
            const y0 = syP(pa, 0);
            const y1 = syP(pa, a);
            const x0 = sxT(s, q.model.ts[i]);
            const x1 = sxT(s, q.model.ts[i + 1]);
            return (
              <g key={`bar-${i}`}>
                <rect x={x0} y={Math.min(y0, y1)} width={Math.max(1, x1 - x0)} height={Math.abs(y1 - y0)}
                  fill={accentTint(ACCENT, 0.16)} stroke="none" />
                <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      )}

      {/* ══ ghost / target curve, plus the band that defines "matched" ══════ */}
      {q.ghost && (() => {
        const key = q.ghostOn ?? 'v';
        const p = PANEL_OF(s, key);
        if (!p || !q.reveal[key]) return null;
        const pts = q.ghost.samples.map((r) => ({ t: r.t, y: key === 'x' ? r.x : key === 'v' ? r.v : r.a }));
        return (
          <g>
            {q.tolerance != null && q.tolerance > 0 && (
              <ToleranceBand s={s} p={p} target={q.ghost.samples} tol={q.tolerance} />
            )}
            <path d={seriesPath(s, p, pts, 2)} fill="none" stroke="rgba(255,255,255,0.55)"
              strokeWidth={2} strokeDasharray="7 5" style={{ pointerEvents: 'none' }} />
          </g>
        );
      })()}

      {/* ══ the three curves ════════════════════════════════════════════════ */}
      {px && q.reveal.x && (
        <path d={seriesPath(s, px, xSeries, 2)} fill="none" stroke={ACCENT} strokeWidth={2.5}
          strokeLinejoin="round" style={{ pointerEvents: 'none' }} />
      )}
      {pv && q.reveal.v && (
        <path d={seriesPath(s, pv, vSeries, 2)} fill="none" stroke={ACCENT} strokeWidth={2.5}
          strokeLinejoin="round" style={{ pointerEvents: 'none' }} />
      )}

      {/* ══ x–t: the chord (average velocity) and the tangent (velocity) ═════ */}
      {px && q.reveal.x && q.chord && (() => {
        const mk = markerPoints(s, q.model, q.chord.tA, q.chord.tB);
        if (!mk) return null;
        return (
          <g>
            <line x1={mk.a.cx} y1={mk.a.cy} x2={mk.b.cx} y2={mk.b.cy}
              stroke={ACCENT_2} strokeWidth={2.5} strokeDasharray="1 0" style={{ pointerEvents: 'none' }} />
            {[mk.a, mk.b].map((h, i) => (
              <circle key={`mk-${i}`} cx={h.cx} cy={h.cy} r={h.r} fill={accentTint(ACCENT_2, 0.9)}
                stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} style={{ cursor: 'grab' }} />
            ))}
          </g>
        );
      })()}

      {px && q.reveal.x && q.showTangent && (() => {
        const slopePx = slopeToPixels(s, px, vAt(q.model, q.cursorT));
        const half = Math.min(120, innerW(s) * 0.22);
        const y = syP(px, xAt(q.model, q.cursorT));
        return (
          <line
            x1={cursorX - half} y1={y - slopePx * half}
            x2={cursorX + half} y2={y + slopePx * half}
            stroke="rgba(255,255,255,0.8)" strokeWidth={2} style={{ pointerEvents: 'none' }}
          />
        );
      })()}

      {/* ══ THE ONE CURSOR — one line, all three panels, by construction ════ */}
      <line x1={cursorX} y1={stackTop} x2={cursorX} y2={stackBottom}
        stroke={accentTint(ACCENT, 0.55)} strokeWidth={1.5} strokeDasharray="4 4"
        style={{ pointerEvents: 'none' }} />

      {/* the sampled instant, once per panel, all from the SAME sample */}
      {px && q.reveal.x && (
        <circle cx={cursorX} cy={syP(px, now.x)} r={5.5} fill={ACCENT} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5}
          style={{ pointerEvents: 'none' }} />
      )}
      {pv && q.reveal.v && (
        <circle cx={cursorX} cy={syP(pv, now.v)} r={5.5}
          fill={now.v < 0 ? ACCENT_2 : ACCENT} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5}
          style={{ pointerEvents: 'none' }} />
      )}
      {pa && q.reveal.a && (
        <circle cx={cursorX} cy={syP(pa, now.a)} r={5.5} fill={ACCENT} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5}
          style={{ pointerEvents: 'none' }} />
      )}

      {/* ══ handles ═════════════════════════════════════════════════════════ */}
      {q.handles.map((h, i) => {
        if (!q.reveal[h.panel]) return null;
        const held = q.grabbed?.kind === h.kind && q.grabbed?.index === h.index;
        return (
          <g key={`h-${h.kind}-${h.index}`}>
            {h.stub && (
              <line x1={h.stub.x} y1={h.stub.y} x2={h.cx} y2={h.cy}
                stroke="rgba(255,255,255,0.8)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
            )}
            {q.showGrabHint && i === 0 && (
              <circle cx={h.cx} cy={h.cy} r={h.r * 1.9} fill="none" stroke={ACCENT} strokeWidth={2} opacity={0.5}>
                <animate attributeName="r" values={`${h.r * 1.5};${h.r * 2.5};${h.r * 1.5}`} dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.12;0.6" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={h.cx} cy={h.cy} r={held ? h.r * 1.35 : h.r}
              fill={accentTint(ACCENT, held ? 1 : 0.85)}
              stroke="rgba(255,255,255,0.92)" strokeWidth={1.5}
              style={{ cursor: 'grab' }} />
          </g>
        );
      })}

      {/* ══ the shared time axis, drawn ONCE ════════════════════════════════ */}
      <line x1={s.pad.l} y1={stackBottom + 6} x2={s.w - s.pad.r} y2={stackBottom + 6}
        stroke="rgba(255,255,255,0.32)" strokeWidth={1.5} style={{ pointerEvents: 'none' }} />
      {tTicks.map((t, i) => (
        <g key={`tt-${t}`} style={{ pointerEvents: 'none' }}>
          <line x1={sxT(s, t)} y1={stackBottom + 6} x2={sxT(s, t)} y2={stackBottom + 10}
            stroke="rgba(255,255,255,0.32)" strokeWidth={1} />
          <text
            x={sxT(s, t)} y={stackBottom + 21}
            textAnchor={i === 0 ? 'start' : i === tTicks.length - 1 ? 'end' : 'middle'}
            fill={TEXT.ghost} fontSize={s.fs} fontWeight={600} className="tabular-nums"
          >
            {fmtTick(t)}
          </text>
        </g>
      ))}

      {/* ══ two y labels per panel, pinned in the gutter ════════════════════ */}
      {s.panels.map((p) =>
        panelYLabels(p).map((l, i) => (
          <text key={`yl-${p.key}-${i}`}
            x={s.pad.l - 9} y={l.y} textAnchor="end"
            fill={TEXT.ghost} fontSize={s.fs} fontWeight={600} className="tabular-nums"
            style={{ pointerEvents: 'none' }}
          >
            {fmtTick(l.value)}
          </text>
        ))
      )}
    </svg>
  );
}

/**
 * The pass band around a Match target: the strip inside which the attempt counts
 * as matched.
 *
 * Drawn rather than merely stated, because "within 1.2 m/s" is a number a
 * student has no way to picture. With the band on screen the task becomes "get
 * your line inside the ribbon", which is the same instruction and is actionable.
 */
function ToleranceBand({ s, p, target, tol }: {
  s: Stack; p: Panel; target: Sample[]; tol: number;
}): React.ReactElement | null {
  if (target.length < 2) return null;
  const pick = (r: Sample) => (p.key === 'x' ? r.x : p.key === 'v' ? r.v : r.a);
  const up = target.map((r) => ({ t: r.t, y: pick(r) + tol }));
  const down = [...target].reverse().map((r) => ({ t: r.t, y: pick(r) - tol }));
  // Up the top edge, back along the bottom one, closed. The return leg's leading
  // `M` becomes an `L` so the two halves are ONE subpath — an `M` there would
  // start a second subpath and the fill rule would leave the ribbon hollow.
  const d = `${seriesPath(s, p, up, 2)}${seriesPath(s, p, down, 2).replace(/^M/, 'L')}Z`;
  return (
    <path
      d={d}
      fill="rgba(110,231,183,0.09)"   /* sim-lint-ok — OK is the pass/fail pair */
      stroke="none"
      style={{ pointerEvents: 'none' }}
    />
  );
}
