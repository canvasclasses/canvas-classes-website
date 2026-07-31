'use client';

/*
 * circuit-bench/ac/ui.tsx — the AC bench's chrome and small SVG parts.
 * ─────────────────────────────────────────────────────────────────────────────
 * Presentational only.
 *
 * ── WHY THIS IS NOT IMPORTED FROM field-bench/ui.tsx ────────────────────────
 * That file has the same shapes, and importing it would couple E3 to E5 for a
 * handful of buttons. The engines are deliberately independent — a change to the
 * field bench's chrome must not be able to move the circuit bench's — and its
 * misconception card is typed on `FieldIssue`, which a circuit code is not.
 * When a third engine wants these, they belong in `simulations/_shared`; that is
 * the right consolidation and it is a promotion, not a copy, so it is deferred
 * rather than done here from one caller.
 *
 * ── COLOUR: TWO, AND THEY ARE THE TWO AXES OF AC ────────────────────────────
 * PRIMARY   violet `A_V`  — VOLTAGE: the supply, the phasor, the wave.
 * SECONDARY sky    `A_I`  — CURRENT: its phasor, its wave, and what it dissipates.
 * Voltage against current is not a decorative pair; the entire subject is the
 * ANGLE between those two, and colouring them alike would hide the only thing
 * that distinguishes AC from DC. Same choice the frozen `CircuitBench` makes.
 *
 * ── THE LABEL RULE ──────────────────────────────────────────────────────────
 * The canvases in this folder render ZERO `<text>` elements. Every name, number
 * and unit is in a colour-keyed legend or a readout row beneath.
 */

import * as React from 'react';
import InlineMarkdown from '../../InlineMarkdown';
import {
  ACCENT, ACCENT_2, BAD, BORDER, OK, TEXT, TYPE, accentTint,
} from '../../simulations/_shared';

export const A_V = ACCENT;      // violet — voltage
export const A_I = ACCENT_2;    // sky — current

// ── Cards, pills, buttons ────────────────────────────────────────────────────

export function Card({ children, tone = 'plain' }:
  { children: React.ReactNode; tone?: 'plain' | 'ok' | 'bad' | 'voltage' | 'current' }) {
  const bg =
    tone === 'ok' ? 'rgba(110,231,183,0.07)'      // sim-lint-ok — OK/BAD pass-fail pair
      : tone === 'bad' ? 'rgba(252,165,165,0.07)' // sim-lint-ok — OK/BAD pass-fail pair
        : tone === 'voltage' ? accentTint(A_V, 0.08)
          : tone === 'current' ? accentTint(A_I, 0.08)
            : 'rgba(255,255,255,0.02)';
  const bd =
    tone === 'ok' ? 'rgba(110,231,183,0.32)'      // sim-lint-ok
      : tone === 'bad' ? 'rgba(252,165,165,0.32)' // sim-lint-ok
        : tone === 'voltage' ? accentTint(A_V, 0.3)
          : tone === 'current' ? accentTint(A_I, 0.3)
            : BORDER.card;
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: bg, borderColor: bd }}>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'ok' | 'bad' | 'info'; children: React.ReactNode }) {
  const c = tone === 'ok' ? OK : tone === 'bad' ? BAD : A_V; // sim-lint-ok — OK/BAD pass-fail pair
  return (
    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: accentTint(c, 0.14), color: c, border: `1px solid ${accentTint(c, 0.4)}` }}>
      {children}
    </span>
  );
}

export function ActionButton({ children, onClick, accent = A_V, disabled, wide }:
  { children: React.ReactNode; onClick: () => void; accent?: string; disabled?: boolean; wide?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`rounded-lg px-3 text-[12px] font-semibold uppercase tracking-wider transition-all ${wide ? 'w-full' : ''}`}
      style={{
        background: disabled ? 'rgba(255,255,255,0.04)' : accentTint(accent, 0.18),
        border: `1px solid ${disabled ? BORDER.card : accentTint(accent, 0.45)}`,
        color: disabled ? TEXT.muted : accent,
        cursor: disabled ? 'default' : 'pointer',
        minHeight: 44,
      }}>
      {children}
    </button>
  );
}

/** The §4f inline underline toggle, padded to a 40 px band. */
export function Toggle({ on, label, onClick, accent = A_V }:
  { on: boolean; label: string; onClick: () => void; accent?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className="text-xs font-semibold transition-colors"
      style={{
        color: on ? accent : TEXT.ghost,
        borderBottom: `1px solid ${on ? accentTint(accent, 0.55) : 'rgba(255,255,255,0.1)'}`,
        background: 'none', outline: 'none', minHeight: 40, paddingTop: 8, paddingBottom: 4,
      }}>
      {on ? `✓ ${label}` : label}
    </button>
  );
}

export function Choice({ options, value, onChange, accent = A_V }:
  { options: string[]; value: string; onChange: (v: string) => void; accent?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = o === value;
        return (
          <button key={o} type="button" onClick={() => onChange(o)} aria-pressed={on}
            className="rounded-lg px-2.5 text-[12px] font-semibold transition-all"
            style={{
              background: on ? accentTint(accent, 0.18) : 'rgba(255,255,255,0.03)',
              border: `1px solid ${on ? accentTint(accent, 0.45) : BORDER.card}`,
              color: on ? accent : TEXT.secondary,
              minHeight: 40, paddingTop: 6, paddingBottom: 6,
            }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A labelled slider. TOUCH TARGET: a bare range input renders ~16 px tall, less
 * than half the ~44 px a finger needs; the track stays thin and the ELEMENT is
 * padded to 44. `touchAction: none` stops a drag along it scrolling the page
 * instead, which is what makes a thin slider feel broken on a phone.
 */
export function Slider({ label, value, min, max, step, onChange, unit = '', accent = A_V, format }:
  { label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; unit?: string; accent?: string; format?: (v: number) => string }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ minWidth: 96, fontSize: 12, fontWeight: 600, color: accent }}>{label}</div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} aria-label={label}
        className="flex-1"
        style={{ accentColor: accent, cursor: 'pointer', minHeight: 44, touchAction: 'none' }} />
      <div className="tabular-nums"
        style={{ minWidth: 76, textAlign: 'right', fontSize: 13, fontWeight: 700, color: accent }}>
        {format ? format(value) : value}
        {unit && <span style={{ color: TEXT.ghost, fontWeight: 500 }}> {unit}</span>}
      </div>
    </div>
  );
}

// ── Legend and readout — everything the canvas may not print ──────────────────

export interface LegendRow { colour: string; label: string; dashed?: boolean; dot?: boolean }

export function Legend({ rows }: { rows: LegendRow[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          {r.dot ? (
            <span aria-hidden style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 5, background: r.colour }} />
          ) : (
            <span aria-hidden style={{ display: 'inline-block', width: 16, height: 0, borderTop: `2px ${r.dashed ? 'dashed' : 'solid'} ${r.colour}` }} />
          )}
          <span className="text-[11px] font-medium" style={{ color: TEXT.secondary }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

export interface ReadoutRow { label: string; value: string; colour?: string; strong?: boolean }

export function Readout({ rows, footnote, tone }:
  { rows: ReadoutRow[]; footnote?: string; tone?: 'plain' | 'ok' | 'voltage' | 'current' }) {
  return (
    <Card tone={tone ?? 'plain'}>
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline justify-between gap-3 py-[3px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEXT.ghost }}>
            {r.label}
          </span>
          <span className="tabular-nums"
            style={{ color: r.colour ?? TEXT.primary, fontSize: r.strong ? 16 : 13, fontWeight: r.strong ? 800 : 600 }}>
            {r.value}
          </span>
        </div>
      ))}
      {footnote && (
        <p className="mt-1.5 pt-1.5 text-[10px] font-medium leading-snug"
          style={{ color: TEXT.muted, borderTop: `1px solid ${BORDER.hairline}` }}>
          {footnote}
        </p>
      )}
    </Card>
  );
}

// ── Guided script, predict gate, misconception card, numeric ─────────────────

export function GuidedPanel({ steps, index, done, onAdvance }:
  { steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void }) {
  const step = steps[Math.min(index, steps.length - 1)];
  return (
    <div className="rounded-xl border px-3 py-3"
      style={{
        background: done ? 'rgba(110,231,183,0.06)' : accentTint(A_V, 0.07), // sim-lint-ok — OK tint on completion
        borderColor: done ? 'rgba(110,231,183,0.28)' : accentTint(A_V, 0.28), // sim-lint-ok
      }}>
      <div className="mb-2 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: i < index ? OK : i === index ? A_V : 'rgba(255,255,255,0.09)' }} />
        ))}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>
        <InlineMarkdown>
          {done
            ? 'That is the whole build-up. Everything is on now — change anything and every number follows.'
            : step.say}
        </InlineMarkdown>
      </div>
      {!done && <div className="mt-3"><ActionButton wide onClick={onAdvance}>{`${step.cta} →`}</ActionButton></div>}
    </div>
  );
}

export function PredictGate({ prompt, options, answerIndex, reveal, choice, onChoose }:
  { prompt: string; options: string[]; answerIndex?: number; reveal?: string;
    choice: number | null; onChoose: (i: number) => void }) {
  return (
    <Card tone={choice === null ? 'plain' : answerIndex === undefined ? 'plain' : choice === answerIndex ? 'ok' : 'bad'}>
      <div className="mb-2 flex items-center gap-2"><Pill tone="info">Predict first</Pill></div>
      <div className="text-sm" style={{ color: TEXT.primary }}><InlineMarkdown>{prompt}</InlineMarkdown></div>
      <div className="mt-2 flex flex-col gap-1.5">
        {options.map((o, i) => {
          const picked = choice === i;
          const right = answerIndex !== undefined && i === answerIndex;
          const shade = choice === null ? BORDER.card
            : right ? 'rgba(110,231,183,0.5)'          // sim-lint-ok — OK/BAD pair
              : picked ? 'rgba(252,165,165,0.5)' : BORDER.card; // sim-lint-ok
          return (
            <button key={i} type="button" disabled={choice !== null} onClick={() => onChoose(i)}
              className="rounded-lg border px-2.5 text-left text-[13px] transition-all"
              style={{
                background: picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: shade, color: TEXT.secondary,
                cursor: choice === null ? 'pointer' : 'default',
                minHeight: 44, paddingTop: 8, paddingBottom: 8,
              }}>
              {o}
            </button>
          );
        })}
      </div>
      {choice === null ? (
        <p className="mt-2 text-xs" style={{ color: TEXT.ghost }}>
          Commit before you look. A guess you cannot take back is worth ten you can.
        </p>
      ) : reveal ? (
        <div className="mt-2 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{reveal}</InlineMarkdown>
        </div>
      ) : null}
    </Card>
  );
}

/** The named-misconception card. Typed on `{ message, hint? }` rather than on
 *  `CircuitIssue` so the same component can render a code's copy from
 *  `lib/misconceptions.ts` and an ad-hoc note, without two near-identical cards. */
export function AcCard({ issue }: { issue: { message: string; hint?: string } }) {
  return (
    <Card tone="voltage">
      <div className={TYPE.sectionLabel} style={{ color: A_I }}>Watch out</div>
      <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{issue.message}</InlineMarkdown>
      </p>
      {issue.hint && (
        <div className="mt-1 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{issue.hint}</InlineMarkdown>
        </div>
      )}
    </Card>
  );
}

export function NumericPanel({ prompt, answer, tolerance, unit, reveal }:
  { prompt: string; answer: number; tolerance?: number; unit?: string; reveal: string }) {
  const [entry, setEntry] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const val = parseFloat(entry);
  const ok = checked && Number.isFinite(val)
    && Math.abs(val - answer) <= (tolerance ?? Math.abs(answer) * 0.05);
  return (
    <Card>
      <div className="mb-2 text-sm" style={{ color: TEXT.primary }}><InlineMarkdown>{prompt}</InlineMarkdown></div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" inputMode="decimal" value={entry} placeholder="answer"
          onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
          className="w-24 rounded-lg border px-2.5 text-sm tabular-nums outline-none"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: BORDER.card, color: TEXT.primary, minHeight: 44 }} />
        {unit && <span className="text-xs font-semibold" style={{ color: TEXT.ghost }}>{unit}</span>}
        <ActionButton onClick={() => setChecked(true)} disabled={entry === ''}>Check</ActionButton>
        {checked && <Pill tone={ok ? 'ok' : 'bad'}>{ok ? 'Correct' : 'Not yet'}</Pill>}
      </div>
      {checked && (
        <div className="mt-2 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{reveal}</InlineMarkdown>
        </div>
      )}
    </Card>
  );
}

/** A plain, calm note — for the model caveats that must be said out loud rather
 *  than buried in a code comment. */
export function ModelNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
      <InlineMarkdown>{String(children)}</InlineMarkdown>
    </p>
  );
}

// ── SVG parts ────────────────────────────────────────────────────────────────

/** A straight arrow in screen space, head capped at 55% of the shaft. */
export function Arrow({ x1, y1, x2, y2, colour, width = 2.4, dashed, opacity = 1 }:
  { x1: number; y1: number; x2: number; y2: number; colour: string;
    width?: number; dashed?: boolean; opacity?: number }) {
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
        stroke={colour} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? '6 4' : undefined} />
      <path d={`M ${x2} ${y2} L ${bx - uy * hw} ${by + ux * hw} L ${bx + uy * hw} ${by - ux * hw} Z`} fill={colour} />
    </g>
  );
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

/** Two stacked bars that trade places — the LC energy ledger. */
export function EnergyBars({ a, b, total, colourA, colourB }:
  { a: number; b: number; total: number; colourA: string; colourB: string }) {
  const t = Math.max(total, 1e-18);
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <div style={{ width: `${Math.max(0, Math.min(1, a / t)) * 100}%`, background: colourA, transition: 'width 60ms linear' }} />
      <div style={{ width: `${Math.max(0, Math.min(1, b / t)) * 100}%`, background: colourB, transition: 'width 60ms linear' }} />
    </div>
  );
}
