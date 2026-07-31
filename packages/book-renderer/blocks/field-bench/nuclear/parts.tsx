'use client';

/*
 * nuclear/parts.tsx — the chart primitives the four nuclear views share.
 * ─────────────────────────────────────────────────────────────────────────────
 * Presentational only. Every one of these exists because of the LABEL OVERLAP
 * RULE (SIMULATION_DESIGN_WORKFLOW §4E): the canvas carries AT MOST ONE `<text>`
 * element, so axis numbers, nuclide names, energies and units live in HTML strips
 * and colour-keyed legends beside the drawing. On a curve with 38 points and two
 * reaction arrows there is no arrangement of on-canvas labels that does not
 * collide, and a number in a fixed row is easier to read than one perched on a
 * moving marker anyway.
 *
 * ── Colour ──────────────────────────────────────────────────────────────────
 * ONE primary, violet `ACCENT` — STRUCTURE: the curve, the nuclide markers, the
 * grid, the chrome. ONE secondary, amber `ACCENT_B` — ENERGY: the reaction
 * arrows, the products, the peak line, the activity trace. That is a genuine
 * second axis (what a nucleus IS versus what it is DOING), not decoration, and
 * it is the same pairing `field-bench/ui.tsx` already established for
 * field-versus-potential. Both are imported; no hex is written here.
 */

import * as React from 'react';
import type { FieldMisconception } from '../types';
import { issueFor } from '../lib/misconceptions';
import { ACCENT, TEXT, BORDER, accentTint } from '../../simulations/_shared';
import { ACCENT_B } from '../ui';
import { plotBox, type PlotBox } from './lib/view';

export { ACCENT_B };

/** Grid and axis strokes. Translucent white, so they sit under the data at every
 *  reading-mode background without being a third colour. */
export const AXIS_STROKE = 'rgba(255,255,255,0.20)';
export const GRID_STROKE = 'rgba(255,255,255,0.07)';

/**
 * A measured canvas.
 *
 * ⚠ THE VIEWBOX IS THE MEASURED CSS PIXEL BOX. One viewBox unit = one
 * device-independent pixel, so nothing can letterbox and a stroke width of 2
 * means 2 px to the eye at every container width. A hardcoded viewBox with the
 * default `preserveAspectRatio` is what put a projectile drawing into 8.8% of a
 * phone canvas.
 */
export function Canvas({ box, label, children }: {
  box: PlotBox; label: string; children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${box.width} ${box.height}`}
      width="100%"
      height={box.height}
      role="img"
      aria-label={label}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {children}
    </svg>
  );
}

/** The one place a canvas box is made. Callers compute it ONCE and hand the same
 *  object to `Canvas` and to `TickStrip`, so the tick under grid line 60 is at
 *  the same pixel as grid line 60 by construction rather than by coincidence. */
export const boxFor = (width: number, height: number): PlotBox =>
  plotBox(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));

/** The two axis lines plus horizontal grid rules at the given y pixels. */
export function Axes({ box, gridY, gridX }: { box: PlotBox; gridY?: number[]; gridX?: number[] }) {
  const { x, y, w, h } = box.rect;
  return (
    <g>
      {(gridY ?? []).map((py, i) => (
        <line key={`gy${i}`} x1={x} y1={py} x2={x + w} y2={py} stroke={GRID_STROKE} strokeWidth={1} />
      ))}
      {(gridX ?? []).map((px, i) => (
        <line key={`gx${i}`} x1={px} y1={y} x2={px} y2={y + h} stroke={GRID_STROKE} strokeWidth={1} />
      ))}
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={AXIS_STROKE} strokeWidth={1.2} />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={AXIS_STROKE} strokeWidth={1.2} />
    </g>
  );
}

/**
 * The x-axis numbers, in HTML under the canvas.
 *
 * Padded to match the plot rect exactly, so tick 60 sits under the grid line at
 * 60. The alignment is computed from the same `plotBox` the SVG used — it is not
 * eyeballed, and it cannot drift when the padding formula changes.
 */
export function TickStrip({ box, ticks, format, unit }: {
  box: PlotBox; ticks: number[]; format?: (v: number) => string; unit?: string;
}) {
  const { x, w } = box.rect;
  return (
    <div style={{ position: 'relative', height: 16, marginTop: 2 }}>
      {ticks.map((t, i) => (
        <span
          key={i}
          className="text-[10px] font-medium tabular-nums"
          style={{
            position: 'absolute',
            left: x + ((t - ticks[0]) / ((ticks[ticks.length - 1] - ticks[0]) || 1)) * w,
            transform: 'translateX(-50%)',
            color: TEXT.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {format ? format(t) : t}
        </span>
      ))}
      {unit && (
        <span className="text-[10px] font-medium" style={{ position: 'absolute', right: 0, color: TEXT.muted }}>
          {unit}
        </span>
      )}
    </div>
  );
}

/** A nuclide pill — the name, in the notation a textbook uses, with an optional
 *  value. Used everywhere a marker on the canvas needs a name it is not allowed
 *  to print. */
export function Chip({ label, value, colour = ACCENT, dim, onClick, title }: {
  label: string; value?: string; colour?: string; dim?: boolean;
  onClick?: () => void; title?: string;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick, title } : { title })}
      className="flex items-center gap-1.5 rounded-lg px-2 text-left transition-all"
      style={{
        background: dim ? 'rgba(255,255,255,0.03)' : accentTint(colour, 0.16),
        border: `1px solid ${dim ? BORDER.card : accentTint(colour, 0.42)}`,
        minHeight: onClick ? 40 : 28,
        paddingTop: onClick ? 8 : 4,
        paddingBottom: onClick ? 8 : 4,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <span className="text-[13px] font-semibold" style={{ color: dim ? TEXT.secondary : colour }}>{label}</span>
      {value != null && (
        <span className="text-[12px] font-semibold tabular-nums" style={{ color: TEXT.secondary }}>{value}</span>
      )}
    </Tag>
  );
}

/**
 * One row of an arithmetic balance — "2 × hydrogen atom … 2.01565 u".
 *
 * `rule` draws the horizontal line above a total, which is how the sum is
 * written by hand. There is no `÷` anywhere in the nuclear bench, so no `Frac`
 * is needed; the one division (BE ÷ A) is presented as its own labelled row.
 */
export function BalanceRow({ label, value, tone = 'plain', rule }: {
  label: React.ReactNode; value: string; tone?: 'plain' | 'accent' | 'second' | 'total'; rule?: boolean;
}) {
  const colour = tone === 'accent' ? ACCENT : tone === 'second' ? ACCENT_B : tone === 'total' ? TEXT.primary : TEXT.secondary;
  return (
    <div
      className="flex items-baseline justify-between gap-3"
      style={{
        paddingTop: rule ? 6 : 3,
        paddingBottom: 3,
        borderTop: rule ? `1px solid ${accentTint(ACCENT_B, 0.45)}` : undefined,
      }}
    >
      <span className="text-[12px]" style={{ color: tone === 'total' ? TEXT.primary : TEXT.secondary }}>{label}</span>
      <span
        className="tabular-nums"
        style={{ color: colour, fontSize: tone === 'total' ? 15 : 13, fontWeight: tone === 'total' ? 800 : 600 }}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * The named-misconception card.
 *
 * ⚠ IT TAKES A CODE, NOT COPY. The six nuclear codes are members of
 * `FieldMisconception` and their copy lives in `field-bench/lib/misconceptions.ts`
 * behind an exhaustive `Record`, so a code cannot exist without a message. This
 * component resolves the code through `issueFor()` and renders nothing at all for
 * an unknown one — passing copy in directly is what let two versions of the same
 * sentence drift apart in an earlier draft.
 *
 * It differs from `field-bench/ui.tsx MisconceptionCard` in one way only: it leads
 * with the `belief` line, quoting the wrong idea back in the student's own words
 * before correcting it. That field is optional on `FieldIssue` (the Phase-1 codes
 * predate it), so this degrades to the same two paragraphs when it is absent.
 *
 * Rendered only after the sim has SHOWN the contradicting evidence. Never as a
 * preamble: a punchline delivered first is a fact to memorise.
 */
export function AttackCard({ code }: { code?: FieldMisconception }) {
  const issue = issueFor(code);
  if (!issue) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2.5"
      style={{ background: accentTint(ACCENT, 0.08), borderColor: accentTint(ACCENT, 0.3) }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT_B }}>
        {issue.belief ? 'The belief this breaks' : 'Watch out'}
      </div>
      {issue.belief && (
        <p className="mt-1 text-[13px] italic leading-snug" style={{ color: TEXT.secondary }}>
          &ldquo;{issue.belief}&rdquo;
        </p>
      )}
      <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>{issue.message}</p>
      {issue.hint && (
        <p className="mt-1.5 text-sm leading-snug" style={{ color: TEXT.secondary }}>{issue.hint}</p>
      )}
    </div>
  );
}

/** A marker on a chart: a filled dot with a ring, sized in pixels. */
export function Marker({ cx, cy, r, colour, ring = true, dim }: {
  cx: number; cy: number; r: number; colour: string; ring?: boolean; dim?: boolean;
}) {
  return (
    <g opacity={dim ? 0.42 : 1}>
      {ring && <circle cx={cx} cy={cy} r={r * 1.9} fill="none" stroke={colour} strokeWidth={1.2} opacity={0.45} />}
      <circle cx={cx} cy={cy} r={r} fill={colour} />
    </g>
  );
}

/** The arrow that shows a reaction moving along the curve. */
export function Arrow({ x1, y1, x2, y2, head, colour, width = 2.4 }: {
  x1: number; y1: number; x2: number; y2: number; head: string; colour: string; width?: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colour} strokeWidth={width} strokeLinecap="round" />
      <polygon points={head} fill={colour} />
    </g>
  );
}
