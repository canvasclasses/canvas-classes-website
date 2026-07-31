'use client';

/*
 * field-bench/emi/ui.tsx — the EMI bench's shared parts.
 * ─────────────────────────────────────────────────────────────────────────────
 * Presentational only.
 *
 * ── WHAT IS REUSED AND WHY ──────────────────────────────────────────────────
 * Everything generic — Card, Pill, Toggle, ActionButton, Choice, Slider, Legend,
 * Readout, GuidedPanel, PredictGate, NumericPanel, ModelNote — is re-exported
 * from `../ui` rather than reimplemented. They are the same engine's chrome, so a
 * second copy would be two things to keep in step for no gain, and the touch
 * targets and contrast tiers are already right there.
 *
 * `EmiCard` below is the one exception, and it is now a small one: it is the same
 * card typed on `{ message, hint? }` rather than on `FieldIssue`. The seven EMI
 * codes ARE in `FieldMisconception` now and their copy is in the engine's own
 * `lib/misconceptions.ts`, so `../ui`'s card would work — this one stays only
 * because it also renders a plain `{ message, hint }` object without a code,
 * which the eddy and inductance panels use for their model notes.
 *
 * ── COLOUR: TWO, AND THEY MEAN SOMETHING ────────────────────────────────────
 * PRIMARY   violet `ACCENT`  — the CAUSE: the field, the flux, the geometry.
 * SECONDARY amber  `ACCENT_B` — the EFFECT: the induced EMF, the induced current,
 *                               the force it produces.
 * That is a genuine second axis (workflow §3): every EMI exercise is about a
 * cause on one side of Faraday's law and an effect on the other, and colouring
 * them alike would hide the only distinction that matters.
 *
 * ── THE LABEL RULE ──────────────────────────────────────────────────────────
 * The canvases in this folder render ZERO `<text>` elements. Not "at most one" —
 * none. Every name, number and unit is in a colour-keyed legend or a readout row
 * beneath, which is easier to read than a value chasing a moving loop and cannot
 * collide with a field glyph.
 */

import * as React from 'react';
import { ACCENT, ACCENTS, BORDER, TEXT, TYPE, accentTint } from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';

export {
  Card, Pill, Toggle, ActionButton, Choice, Slider, Legend, Readout,
  GuidedPanel, PredictGate, NumericPanel, ModelNote, ACCENT_B,
} from '../ui';
export type { LegendRow, ReadoutRow } from '../ui';

/** Secondary accent, restated locally so this file's own SVG helpers do not
 *  have to import through `../ui` for a colour. */
export const A_EFFECT = ACCENTS.amber;
export const A_CAUSE = ACCENT;

// ── The misconception card, typed on the shape it needs ──────────────────────

export function EmiCard({ issue }: { issue: { message: string; hint?: string } }) {
  return (
    <div className="rounded-xl border px-3 py-2.5"
      style={{ background: accentTint(A_CAUSE, 0.08), borderColor: accentTint(A_CAUSE, 0.3) }}>
      <div className={TYPE.sectionLabel} style={{ color: A_EFFECT }}>Watch out</div>
      <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{issue.message}</InlineMarkdown>
      </p>
      {issue.hint && (
        <div className="mt-1 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{issue.hint}</InlineMarkdown>
        </div>
      )}
    </div>
  );
}

// ── The field region ─────────────────────────────────────────────────────────

/**
 * A band of uniform field out of the page, drawn as the ⊙ glyph grid every
 * textbook uses — never as arrows, because an out-of-page vector has no
 * in-plane direction to draw and an arrow would be a lie about the geometry.
 *
 * Glyph SPACING is fixed in screen pixels and glyph OPACITY tracks the field
 * strength, so turning B up makes the field visibly stronger without the grid
 * reflowing (a reflowing grid reads as the region changing size, which it is not).
 */
export function FieldGlyphs({ x0, x1, y0, y1, strength, maxStrength, into }:
  { x0: number; x1: number; y0: number; y1: number;
    strength: number; maxStrength: number; into?: boolean }) {
  const step = 26;
  const cols = Math.max(1, Math.floor((x1 - x0) / step));
  const rows = Math.max(1, Math.floor((y1 - y0) / step));
  const dx = (x1 - x0) / cols;
  const dy = (y1 - y0) / rows;
  const alpha = 0.25 + 0.55 * Math.min(1, Math.abs(strength) / Math.max(maxStrength, 1e-9));
  const glyphs: React.ReactNode[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = x0 + dx * (i + 0.5);
      const cy = y0 + dy * (j + 0.5);
      glyphs.push(
        <g key={`${i}-${j}`} opacity={alpha}>
          <circle cx={cx} cy={cy} r={5} fill="none" stroke={A_EFFECT} strokeWidth={1.2} />
          {into ? (
            <>
              <line x1={cx - 3.2} y1={cy - 3.2} x2={cx + 3.2} y2={cy + 3.2} stroke={A_EFFECT} strokeWidth={1.2} />
              <line x1={cx - 3.2} y1={cy + 3.2} x2={cx + 3.2} y2={cy - 3.2} stroke={A_EFFECT} strokeWidth={1.2} />
            </>
          ) : (
            <circle cx={cx} cy={cy} r={1.7} fill={A_EFFECT} />
          )}
        </g>,
      );
    }
  }
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={4}
        fill={accentTint(A_EFFECT, 0.05)} stroke={accentTint(A_EFFECT, 0.28)} strokeWidth={1.2} />
      {glyphs}
    </g>
  );
}

// ── Arrows ───────────────────────────────────────────────────────────────────

/** A straight arrow in screen space. Head length is capped at 55% of the shaft
 *  so a short arrow is still a recognisable arrow rather than a triangle. */
export function Arrow({ x1, y1, x2, y2, colour, width = 2.4, opacity = 1 }:
  { x1: number; y1: number; x2: number; y2: number; colour: string; width?: number; opacity?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return null;
  const ux = dx / len;
  const uy = dy / len;
  const hl = Math.min(9 + width * 1.6, len * 0.55);
  const hw = hl * 0.5;
  const bx = x2 - ux * hl;
  const by = y2 - uy * hl;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2 - ux * hl * 0.85} y2={y2 - uy * hl * 0.85}
        stroke={colour} strokeWidth={width} strokeLinecap="round" />
      <path d={`M ${x2} ${y2} L ${bx - uy * hw} ${by + ux * hw} L ${bx + uy * hw} ${by - ux * hw} Z`}
        fill={colour} />
    </g>
  );
}

/**
 * A circulation arrow drawn ON a rectangle's perimeter, so the induced current's
 * direction is read off the loop itself rather than from a caption.
 *
 * `ccw` is in SCREEN terms already — the caller does the y-flip, because it owns
 * the camera and this component owns nothing but the drawing.
 */
export function LoopCurrentArrows({ x, y, w, h, ccw, colour, strength }:
  { x: number; y: number; w: number; h: number; ccw: boolean; colour: string; strength: number }) {
  const width = 1.6 + 3.4 * Math.min(1, strength);
  const mx = x + w / 2;
  const my = y + h / 2;
  const arm = Math.min(w, h) * 0.24 + 8;
  // Midpoint of each side, with the tangent direction for the chosen sense.
  const sides = ccw
    ? [
      { cx: x + w, cy: my, dx: 0, dy: -1 },   // right side, upward on screen
      { cx: mx, cy: y, dx: -1, dy: 0 },       // top, leftward
      { cx: x, cy: my, dx: 0, dy: 1 },        // left, downward
      { cx: mx, cy: y + h, dx: 1, dy: 0 },    // bottom, rightward
    ]
    : [
      { cx: x + w, cy: my, dx: 0, dy: 1 },
      { cx: mx, cy: y + h, dx: -1, dy: 0 },
      { cx: x, cy: my, dx: 0, dy: -1 },
      { cx: mx, cy: y, dx: 1, dy: 0 },
    ];
  return (
    <g>
      {sides.map((s, i) => (
        <Arrow key={i} colour={colour} width={width}
          x1={s.cx - s.dx * arm} y1={s.cy - s.dy * arm}
          x2={s.cx + s.dx * arm} y2={s.cy + s.dy * arm} />
      ))}
    </g>
  );
}

// ── Plots ────────────────────────────────────────────────────────────────────

export interface Series { points: { x: number; y: number }[]; colour: string; dashed?: boolean }

/**
 * A two-series plot with ZERO text. Axes, a zero line, the curves and an
 * optional live marker; every label lives in the `PlotKey` beneath.
 *
 * Both series share ONE y scale unless `separateScales`, because the whole point
 * of putting flux and EMF on the same axes is to see that the EMF is the SLOPE
 * of the flux — and two independent scales would let a flat flux sit beside a
 * huge EMF and look like a contradiction.
 */
export function DualPlot({ series, xMin, xMax, yMin, yMax, marker, height = 132 }:
  { series: Series[]; xMin: number; xMax: number; yMin: number; yMax: number;
    marker?: number; height?: number }) {
  const W = 320;
  const H = height;
  const PAD = 9;
  const sx = (x: number) => PAD + ((x - xMin) / Math.max(xMax - xMin, 1e-12)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - yMin) / Math.max(yMax - yMin, 1e-12)) * (H - 2 * PAD);
  const path = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img"
      aria-label="Two quantities plotted against time; values are listed beneath the plot.">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      {yMin < 0 && yMax > 0 && (
        <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)}
          stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="4 4" />
      )}
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      {series.map((s, i) => (
        <path key={i} d={path(s.points)} fill="none" stroke={s.colour} strokeWidth={2.2}
          strokeDasharray={s.dashed ? '5 4' : undefined} />
      ))}
      {marker != null && marker >= xMin && marker <= xMax && (
        <line x1={sx(marker)} y1={PAD} x2={sx(marker)} y2={H - PAD}
          stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} />
      )}
      {marker != null && series.map((s, i) => {
        const p = nearest(s.points, marker);
        return p ? <circle key={`m${i}`} cx={sx(p.x)} cy={sy(p.y)} r={3.8} fill={s.colour} /> : null;
      })}
    </svg>
  );
}

function nearest(pts: { x: number; y: number }[], x: number) {
  if (!pts.length) return null;
  let best = pts[0];
  let bd = Math.abs(pts[0].x - x);
  for (const p of pts) {
    const d = Math.abs(p.x - x);
    if (d < bd) { bd = d; best = p; }
  }
  return best;
}

/** The colour-keyed caption a plot is not allowed to draw. */
export function PlotKey({ items }: { items: { colour: string; text: string; dashed?: boolean }[] }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1"
      style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 6 }}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: TEXT.ghost }}>
          <span aria-hidden style={{
            display: 'inline-block', width: 14, height: 0,
            borderTop: `2px ${it.dashed ? 'dashed' : 'solid'} ${it.colour}`,
          }} />
          {it.text}
        </span>
      ))}
    </div>
  );
}

/** Two stacked bars that trade places — the LC energy ledger. Widths are
 *  fractions of the total, so "the sum never moves" is visible as a bar that
 *  always reaches the same end. */
export function EnergyBars({ a, b, total, colourA, colourB }:
  { a: number; b: number; total: number; colourA: string; colourB: string }) {
  const t = Math.max(total, 1e-18);
  const fa = Math.max(0, Math.min(1, a / t));
  const fb = Math.max(0, Math.min(1, b / t));
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full"
      style={{ background: 'rgba(255,255,255,0.05)' }}>
      <div style={{ width: `${fa * 100}%`, background: colourA, transition: 'width 60ms linear' }} />
      <div style={{ width: `${fb * 100}%`, background: colourB, transition: 'width 60ms linear' }} />
    </div>
  );
}
