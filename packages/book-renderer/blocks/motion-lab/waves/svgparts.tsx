'use client';

/*
 * motion-lab/waves/svgparts.tsx — canvas primitives shared by all nine benches.
 * ─────────────────────────────────────────────────────────────────────────────
 * Every mark drawn by a Phase-2 bench comes from here, for the reason
 * `mechanics-bench/lib/svg.ts` gives about arrowheads: two benches that each
 * roll their own look subtly different, and "subtly different" across a product
 * reads as sloppy long before anyone can say why.
 *
 * TWO RULES BAKED IN:
 *
 * 1. NO `<text>`. Not one element in this file emits text. Names, values, units
 *    and axis ranges live in the colour-keyed legend and the readout rows below
 *    the canvas (SIMULATION_DESIGN_WORKFLOW §4E) — which is also why arrows here
 *    are free to shrink to nothing or grow off-screen without ever colliding
 *    with a label.
 * 2. NO HARDCODED HUE. Colour arrives as a prop, and the callers only ever pass
 *    ACCENT / ACCENT_2 / a white at some opacity / the OK-BAD pair.
 */

import * as React from 'react';
import { px, py, ticks, type Plot } from './lib/plot';

// ── Arrows ───────────────────────────────────────────────────────────────────

/**
 * A vector, in SCREEN pixels. The head is capped at 30% of the shaft so a short
 * arrow stays an arrow rather than becoming a triangle, and an arrow under 2 px
 * renders as nothing at all instead of as a smear.
 */
export function Arrow({ x1, y1, x2, y2, color, width = 2.5, dashed, opacity = 1 }:
  { x1: number; y1: number; x2: number; y2: number; color: string;
    width?: number; dashed?: boolean; opacity?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!Number.isFinite(len) || len < 2) return null;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(11, Math.max(5, len * 0.3));
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const nx = -uy;
  const ny = ux;
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width}
        strokeLinecap="round" strokeDasharray={dashed ? '5 4' : undefined} />
      <polygon fill={color}
        points={`${x2},${y2} ${bx + nx * head * 0.46},${by + ny * head * 0.46} ${bx - nx * head * 0.46},${by - ny * head * 0.46}`} />
    </g>
  );
}

/** A double-headed measuring bar with end ticks — used for "λ/2 between nodes"
 *  and for the piston stroke. Still no text: the value goes in the legend. */
export function Span({ x1, y, x2, color, tick = 5 }:
  { x1: number; y: number; x2: number; color: string; tick?: number }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1.5} />
      <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} stroke={color} strokeWidth={1.5} />
      <line x1={x2} y1={y - tick} x2={x2} y2={y + tick} stroke={color} strokeWidth={1.5} />
    </g>
  );
}

// ── The grab handle ──────────────────────────────────────────────────────────

/**
 * A draggable point, with a breathing halo until it has been touched once.
 *
 * The halo is the affordance. The Phase-1 audit's third-most-common way for a
 * student to get stuck was "the most important interaction in the sim has
 * nothing on screen suggesting it exists" — a transparent button, a whole-SVG
 * drag target with no visible handle. This is the fix, and it costs one circle.
 */
export function Handle({ x, y, color, r = 8, hint }:
  { x: number; y: number; color: string; r?: number; hint?: boolean }) {
  return (
    <g>
      {hint && (
        <circle cx={x} cy={y} r={r * 1.9} fill="none" stroke={color} strokeWidth={2} opacity={0.5}>
          <animate attributeName="r" values={`${r * 1.5};${r * 2.4};${r * 1.5}`} dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.12;0.6" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={r} fill={color} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5}
        style={{ cursor: 'grab' }} />
    </g>
  );
}

// ── A spring, and a rope ─────────────────────────────────────────────────────

/**
 * A zigzag spring between two screen points. The coil count is fixed, so a
 * stretched spring shows visibly wider coils — which is the picture of "the
 * further you pull, the harder it pulls", drawn rather than stated.
 */
export function Spring({ x1, y1, x2, y2, color, coils = 11, amp = 8, width = 2 }:
  { x1: number; y1: number; x2: number; y2: number; color: string;
    coils?: number; amp?: number; width?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!(len > 1)) return null;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const lead = Math.min(12, len * 0.12);
  const body = len - 2 * lead;
  const seg = body / (coils * 2);
  let d = `M${x1},${y1}L${x1 + ux * lead},${y1 + uy * lead}`;
  for (let i = 0; i < coils * 2; i++) {
    const t = lead + seg * (i + 0.5);
    const s = i % 2 === 0 ? 1 : -1;
    d += `L${(x1 + ux * t + nx * amp * s).toFixed(1)},${(y1 + uy * t + ny * amp * s).toFixed(1)}`;
  }
  d += `L${x1 + ux * (len - lead)},${y1 + uy * (len - lead)}L${x2},${y2}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" style={{ pointerEvents: 'none' }} />;
}

/** A hatched fixed surface — wall, ceiling, cylinder head. */
export function Hatch({ x, y, len, angleDeg, color, teeth = 9, size = 8 }:
  { x: number; y: number; len: number; angleDeg: number; color: string; teeth?: number; size?: number }) {
  const a = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;
  const marks: React.ReactElement[] = [];
  for (let i = 0; i <= teeth; i++) {
    const t = (len * i) / teeth;
    const bx = x + ux * t;
    const by = y + uy * t;
    marks.push(
      <line key={i} x1={bx} y1={by} x2={bx + (nx - ux) * size} y2={by + (ny - uy) * size}
        stroke={color} strokeWidth={1.2} />
    );
  }
  return (
    <g style={{ pointerEvents: 'none' }} opacity={0.75}>
      <line x1={x} y1={y} x2={x + ux * len} y2={y + uy * len} stroke={color} strokeWidth={2} />
      {marks}
    </g>
  );
}

// ── Plot chrome ──────────────────────────────────────────────────────────────

/**
 * Axes, gridlines and tick marks for a `Plot`. No numbers — the axis ranges are
 * printed in the legend row under the canvas, where they cannot collide with a
 * curve and are far easier to read than a value chasing a moving line.
 */
export function PlotFrame({ plot, xTicks = 6, yTicks = 5, zeroLine = true }:
  { plot: Plot; xTicks?: number; yTicks?: number; zeroLine?: boolean }) {
  const gx = ticks(plot.xMin, plot.xMax, xTicks);
  const gy = ticks(plot.yMin, plot.yMax, yTicks);
  const left = px(plot, plot.xMin);
  const right = px(plot, plot.xMax);
  const top = py(plot, plot.yMax);
  const bot = py(plot, plot.yMin);
  return (
    <g style={{ pointerEvents: 'none' }}>
      {gx.map((v) => (
        <line key={`gx${v}`} x1={px(plot, v)} y1={top} x2={px(plot, v)} y2={bot}
          stroke="rgba(255,255,255,0.055)" strokeWidth={1} />
      ))}
      {gy.map((v) => (
        <line key={`gy${v}`} x1={left} y1={py(plot, v)} x2={right} y2={py(plot, v)}
          stroke="rgba(255,255,255,0.055)" strokeWidth={1} />
      ))}
      <line x1={left} y1={bot} x2={right} y2={bot} stroke="rgba(255,255,255,0.32)" strokeWidth={1.5} />
      <line x1={left} y1={top} x2={left} y2={bot} stroke="rgba(255,255,255,0.32)" strokeWidth={1.5} />
      {zeroLine && plot.yMin < 0 && plot.yMax > 0 && (
        <line x1={left} y1={py(plot, 0)} x2={right} y2={py(plot, 0)}
          stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="4 4" />
      )}
    </g>
  );
}

/** A vertical marker on a plot — "you are here" on a swept curve. */
export function Marker({ plot, x, color, dashed = true }:
  { plot: Plot; x: number; color: string; dashed?: boolean }) {
  const sxv = px(plot, x);
  return (
    <line x1={sxv} y1={py(plot, plot.yMax)} x2={sxv} y2={py(plot, plot.yMin)}
      stroke={color} strokeWidth={1.5} strokeDasharray={dashed ? '5 4' : undefined}
      opacity={0.85} style={{ pointerEvents: 'none' }} />
  );
}

// ── Pointer helpers ──────────────────────────────────────────────────────────

/**
 * Client coordinates → viewBox coordinates, plus the viewBox-to-CSS-pixel
 * factor.
 *
 * `fit` is returned because a grab radius has to be expressed in CSS PIXELS. A
 * flat 30-viewBox-unit target shrinks to a 14 px tap area when the SVG renders
 * at 45% on a phone — unusable with a finger, and invisible to any type check.
 */
export function svgPoint(
  e: React.PointerEvent<SVGSVGElement>, viewW: number, viewH: number
): { x: number; y: number; fit: number } | null {
  const svg = e.currentTarget;
  const rect = svg.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const fit = Math.min(rect.width / viewW, rect.height / viewH);
  if (!(fit > 0)) return null;
  return {
    x: (e.clientX - rect.left - (rect.width - viewW * fit) / 2) / fit,
    y: (e.clientY - rect.top - (rect.height - viewH * fit) / 2) / fit,
    fit,
  };
}

/** An Apple-HIG-sized finger target, whatever the render scale. */
export const GRAB_CSS_PX = 40;
