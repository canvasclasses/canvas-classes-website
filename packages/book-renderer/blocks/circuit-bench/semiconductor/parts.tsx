'use client';

/*
 * semiconductor/parts.tsx — the chrome and the chart primitives.
 * ─────────────────────────────────────────────────────────────────────────────
 * Presentational only.
 *
 * ── Colour: ONE primary, ONE secondary, both light-tier ─────────────────────
 * Primary violet `ACCENT` — the DEVICE: bands, the crystal, the circuit, chrome.
 * Secondary sky `ACCENT_2` — WHAT IS HAPPENING NOW: the applied bias, the output
 * waveform, the conducting diode, the collector current. That is a genuine second
 * axis (structure versus signal) and it is the same pairing `CircuitBench.tsx`
 * already uses for circuit-versus-current. No hex is written in this directory.
 *
 * `OK` / `BAD` appear only as the pass/fail pair on a prediction, marked
 * `sim-lint-ok` at each use.
 *
 * ── Label overlap (SIMULATION_DESIGN_WORKFLOW §4E) ──────────────────────────
 * Every canvas here renders ZERO `<text>` elements. Axis numbers go in an HTML
 * tick strip whose padding is computed from the SAME `plotBox` the SVG used, so
 * a tick can never drift from its grid line; names and values go in a
 * colour-keyed legend or a readout row. On a band diagram with four traces, two
 * region boundaries and a Fermi level there is no arrangement of on-canvas text
 * that does not collide.
 *
 * ── Sliders and touch ───────────────────────────────────────────────────────
 * `SimSlider` from `_shared` is used rather than a local range input: it already
 * carries the 44 px touch band and `touchAction: 'none'`, and re-rolling it is
 * how that fix gets lost.
 */

import * as React from 'react';
import type { CircuitMisconception } from '../types';
import { CIRCUIT_ISSUES } from '../lib/misconceptions';
import {
  ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, accentTint,
} from '../../simulations/_shared';
import { plotBox, type PlotBox } from './lib/view';

export const A1 = ACCENT;     // the device
export const A2 = ACCENT_2;   // what is happening now

export const AXIS_STROKE = 'rgba(255,255,255,0.20)';
export const GRID_STROKE = 'rgba(255,255,255,0.07)';

/** The one place a canvas box is made. Callers hand the same object to `Canvas`
 *  and to `TickStrip`, so the alignment is by construction. */
export const boxFor = (width: number, height: number): PlotBox =>
  plotBox(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));

/**
 * ⚠ THE VIEWBOX IS THE MEASURED CSS PIXEL BOX. One unit = one device-independent
 * pixel, so nothing letterboxes and `strokeWidth={2}` is 2 px to the eye at every
 * container width. A hardcoded viewBox with the default `preserveAspectRatio` is
 * what put a projectile drawing into 8.8% of a phone canvas.
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

export function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-2xl p-2"
      style={{
        background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', // sim-lint-ok — the workflow §4i canvas gradient, not an accent
        border: `1px solid ${accentTint(A1, 0.18)}`,
      }}
    >
      {children}
    </div>
  );
}

export function Axes({ box, gridY, gridX, zeroY }: {
  box: PlotBox; gridY?: number[]; gridX?: number[]; zeroY?: number;
}) {
  const { x, y, w, h } = box.rect;
  return (
    <g>
      {(gridY ?? []).map((py, i) => (
        <line key={`gy${i}`} x1={x} y1={py} x2={x + w} y2={py} stroke={GRID_STROKE} strokeWidth={1} />
      ))}
      {(gridX ?? []).map((px, i) => (
        <line key={`gx${i}`} x1={px} y1={y} x2={px} y2={y + h} stroke={GRID_STROKE} strokeWidth={1} />
      ))}
      <line
        x1={x} y1={zeroY ?? y + h} x2={x + w} y2={zeroY ?? y + h}
        stroke={AXIS_STROKE} strokeWidth={1.2}
      />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={AXIS_STROKE} strokeWidth={1.2} />
    </g>
  );
}

/** The x-axis numbers, in HTML, aligned from the same `plotBox` the SVG used. */
export function TickStrip({ box, ticks, format, unit }: {
  box: PlotBox; ticks: number[]; format?: (v: number) => string; unit?: string;
}) {
  const { x, w } = box.rect;
  const span = (ticks[ticks.length - 1] - ticks[0]) || 1;
  return (
    <div style={{ position: 'relative', height: 16, marginTop: 2 }}>
      {ticks.map((t, i) => (
        <span
          key={i}
          className="text-[10px] font-medium tabular-nums"
          style={{
            position: 'absolute',
            left: x + ((t - ticks[0]) / span) * w,
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

// ── Cards, readouts, legends ─────────────────────────────────────────────────

export function Card({ children, tone = 'plain' }: {
  children: React.ReactNode; tone?: 'plain' | 'ok' | 'bad' | 'accent' | 'second';
}) {
  const bg = tone === 'ok' ? 'rgba(110,231,183,0.07)'     // sim-lint-ok — OK/BAD pair
    : tone === 'bad' ? 'rgba(252,165,165,0.07)'           // sim-lint-ok — OK/BAD pair
      : tone === 'accent' ? accentTint(A1, 0.08)
        : tone === 'second' ? accentTint(A2, 0.08)
          : 'rgba(255,255,255,0.02)';
  const bd = tone === 'ok' ? 'rgba(110,231,183,0.32)'     // sim-lint-ok
    : tone === 'bad' ? 'rgba(252,165,165,0.32)'           // sim-lint-ok
      : tone === 'accent' ? accentTint(A1, 0.3)
        : tone === 'second' ? accentTint(A2, 0.3)
          : BORDER.card;
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: bg, borderColor: bd }}>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'ok' | 'bad' | 'info'; children: React.ReactNode }) {
  const c = tone === 'ok' ? OK : tone === 'bad' ? BAD : A1; // sim-lint-ok — OK/BAD pair
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: accentTint(c, 0.14), color: c, border: `1px solid ${accentTint(c, 0.4)}` }}
    >
      {children}
    </span>
  );
}

export interface ReadoutRow { label: string; value: string; color?: string; strong?: boolean }

export function Readout({ rows, footnote, tone }: {
  rows: ReadoutRow[]; footnote?: string; tone?: 'plain' | 'accent' | 'second';
}) {
  return (
    <Card tone={tone ?? 'plain'}>
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline justify-between gap-3 py-[3px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEXT.ghost }}>
            {r.label}
          </span>
          <span
            className="tabular-nums"
            style={{
              color: r.color ?? TEXT.primary,
              fontSize: r.strong ? 16 : 13,
              fontWeight: r.strong ? 800 : 600,
              textAlign: 'right',
            }}
          >
            {r.value}
          </span>
        </div>
      ))}
      {footnote && (
        <p
          className="mt-1.5 pt-1.5 text-[10px] font-medium leading-snug"
          style={{ color: TEXT.muted, borderTop: `1px solid ${BORDER.hairline}` }}
        >
          {footnote}
        </p>
      )}
    </Card>
  );
}

export interface LegendRow { color: string; dashed?: boolean; dot?: boolean; label: string; value?: string }

export function Legend({ rows }: { rows: LegendRow[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          {r.dot ? (
            <span aria-hidden style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 5, background: r.color }} />
          ) : (
            <span aria-hidden style={{ display: 'inline-block', width: 16, height: 0, borderTop: `2px ${r.dashed ? 'dashed' : 'solid'} ${r.color}` }} />
          )}
          <span className="text-[11px] font-medium" style={{ color: TEXT.secondary }}>{r.label}</span>
          {r.value != null && (
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: r.color }}>{r.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Controls ─────────────────────────────────────────────────────────────────

export function ActionButton({ children, onClick, accent = A1, disabled, wide }: {
  children: React.ReactNode; onClick: () => void; accent?: string; disabled?: boolean; wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-wider transition-all ${wide ? 'w-full' : ''}`}
      style={{
        background: disabled ? 'rgba(255,255,255,0.04)' : accentTint(accent, 0.18),
        border: `1px solid ${disabled ? BORDER.card : accentTint(accent, 0.45)}`,
        color: disabled ? TEXT.muted : accent,
        cursor: disabled ? 'default' : 'pointer',
        minHeight: 40,
      }}
    >
      {children}
    </button>
  );
}

/** The §4f inline underline toggle. Padded to a 36 px band — these read as text
 *  links but ARE controls. */
export function Toggle({ on, label, onClick, accent = A1, disabled }: {
  on: boolean; label: string; onClick: () => void; accent?: string; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className="text-xs font-semibold transition-colors"
      style={{
        color: disabled ? TEXT.muted : on ? accent : TEXT.ghost,
        borderBottom: `1px solid ${on ? accentTint(accent, 0.55) : 'rgba(255,255,255,0.1)'}`,
        background: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: 36,
        paddingTop: 6,
        paddingBottom: 4,
      }}
    >
      {on ? `✓ ${label}` : label}
    </button>
  );
}

export function Choice({ options, value, onChange, accent = A1, labels }: {
  options: string[]; value: string; onChange: (v: string) => void; accent?: string;
  labels?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={on}
            className="rounded-lg px-2.5 text-[12px] font-semibold transition-all"
            style={{
              background: on ? accentTint(accent, 0.18) : 'rgba(255,255,255,0.03)',
              border: `1px solid ${on ? accentTint(accent, 0.45) : BORDER.card}`,
              color: on ? accent : TEXT.secondary,
              minHeight: 40,
              paddingTop: 6,
              paddingBottom: 6,
            }}
          >
            {labels?.[o] ?? o}
          </button>
        );
      })}
    </div>
  );
}

// ── Guided script ────────────────────────────────────────────────────────────

/** The statement comes BEFORE the drawing (design law #5). One click, one new
 *  thing on screen. Nothing here auto-plays. */
export function GuidedPanel({ steps, index, done, onAdvance }: {
  steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void;
}) {
  const step = steps[Math.min(index, steps.length - 1)];
  return (
    <div
      className="rounded-xl border px-3 py-3"
      style={{
        background: done ? 'rgba(110,231,183,0.06)' : accentTint(A1, 0.07), // sim-lint-ok — OK tint marks the finished state
        borderColor: done ? 'rgba(110,231,183,0.28)' : accentTint(A1, 0.28), // sim-lint-ok
      }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i < index ? OK : i === index ? A1 : 'rgba(255,255,255,0.09)' }} // sim-lint-ok
          />
        ))}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>
        {done
          ? 'That is the whole build-up. Everything is on now — change anything and every number follows.'
          : stripMarkdown(step.say)}
      </div>
      {!done && (
        <div className="mt-3">
          <ActionButton wide onClick={onAdvance}>{`${step.cta} →`}</ActionButton>
        </div>
      )}
    </div>
  );
}

/** The guided copy uses `**bold**` for the predict prompts. The circuit engine has
 *  no markdown renderer of its own and pulling one in from another engine for two
 *  asterisks is not worth the coupling, so the emphasis is stripped rather than
 *  shown as literal asterisks. */
const stripMarkdown = (s: string): string => s.replace(/\*\*/g, '');

// ── Predict gate ─────────────────────────────────────────────────────────────

export function PredictGate({ prompt, options, answerIndex, reveal, choice, onChoose }: {
  prompt: string; options: string[]; answerIndex?: number; reveal?: string;
  choice: number | null; onChoose: (i: number) => void;
}) {
  return (
    <Card tone={choice === null ? 'plain' : answerIndex === undefined ? 'plain' : choice === answerIndex ? 'ok' : 'bad'}>
      <div className="mb-2 flex items-center gap-2"><Pill tone="info">Predict first</Pill></div>
      <div className="text-sm" style={{ color: TEXT.primary }}>{stripMarkdown(prompt)}</div>
      <div className="mt-2 flex flex-col gap-1.5">
        {options.map((o, i) => {
          const picked = choice === i;
          const right = answerIndex !== undefined && i === answerIndex;
          const shade = choice === null ? BORDER.card
            : right ? 'rgba(110,231,183,0.5)'                  // sim-lint-ok — OK/BAD pair
              : picked ? 'rgba(252,165,165,0.5)' : BORDER.card; // sim-lint-ok
          return (
            <button
              key={i}
              type="button"
              disabled={choice !== null}
              onClick={() => onChoose(i)}
              className="rounded-lg border px-2.5 text-left text-[13px] transition-all"
              style={{
                background: picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: shade,
                color: TEXT.secondary,
                cursor: choice === null ? 'pointer' : 'default',
                minHeight: 40,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {choice !== null && reveal && (
        <div className="mt-2 text-sm leading-snug" style={{ color: TEXT.secondary }}>{stripMarkdown(reveal)}</div>
      )}
    </Card>
  );
}

// ── The named-misconception card ─────────────────────────────────────────────

/**
 * ⚠ IT TAKES A CODE, NOT COPY. Every archetype in this library declares a
 * `CircuitMisconception` — two reused from the resistor-network set, seven named
 * for this chapter — and all the copy lives in `circuit-bench/lib/misconceptions.ts`
 * behind an exhaustive `Record`, so a code cannot exist without a message. This
 * component resolves the code and renders nothing for an unknown one; passing copy
 * in directly is what let two versions of the same sentence drift apart in an
 * earlier draft.
 *
 * It leads with the `belief` line where one exists — quoting the wrong idea back in
 * the student's own words before correcting it. That field is optional on
 * `CircuitIssue` (the Phase-1 codes predate it), so this degrades to the same two
 * paragraphs when it is absent.
 *
 * Rendered only after the evidence is on screen. Never as a preamble.
 */
export function AttackCard({ code }: { code?: CircuitMisconception }) {
  if (!code) return null;
  const issue = CIRCUIT_ISSUES[code];
  if (!issue) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2.5"
      style={{ background: accentTint(A1, 0.08), borderColor: accentTint(A1, 0.3) }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
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

/** A calm caveat — the model notes that have to be said out loud rather than
 *  buried in a code comment. */
export function ModelNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>{children}</p>
  );
}

/** A device / node pill. */
export function Chip({ label, value, colour = A1, dim, onClick, title }: {
  label: string; value?: string; colour?: string; dim?: boolean; onClick?: () => void; title?: string;
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
