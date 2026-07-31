'use client';

/*
 * field-bench/ui.tsx — the panels, the legend, the cards.
 * ─────────────────────────────────────────────────────────────────────────────
 * Presentational only. Everything here exists because of the LABEL OVERLAP RULE
 * (SIMULATION_DESIGN_WORKFLOW §4E): the canvas carries at most ONE text
 * element, so every name, number and unit lives in a colour-keyed legend or a
 * readout row beside it. That is not a compromise — a value in a fixed row is
 * far easier to read than one chasing a moving dot, and it can never collide
 * with a field line.
 *
 * ── Colour ──────────────────────────────────────────────────────────────────
 * ONE primary accent, violet ACCENT — the FIELD (lines, vectors, chrome).
 * ONE secondary, amber — the POTENTIAL and the surfaces you draw on top of it
 * (equipotentials, the Gauss surface, the ⊗/⊙ glyphs of B). That is a genuine
 * second axis: vector field versus the scalar/geometric layer laid over it.
 *
 * POS / NEG are the sanctioned real-world-identity exception (workflow §2) —
 * red for positive charge and blue for negative is the identity pair every
 * textbook, every teacher and every exam diagram uses, and recolouring it to
 * fit a palette would cost a student more than it gains. Marked sim-lint-ok at
 * the definition and at each use.
 */

import * as React from 'react';
import InlineMarkdown from '../InlineMarkdown';
import type { FieldIssue } from './types';
import { ACCENT, ACCENTS, TEXT, OK, BAD, BORDER, TYPE, accentTint } from '../simulations/_shared';

/** Secondary accent: the potential / surface layer. */
export const ACCENT_B = ACCENTS.amber;

/** Charge identity pair. Not decoration — these two colours ARE the sign of the
 *  charge, and they are the only non-accent hues on the canvas. */
export const POS = '#fca5a5'; // sim-lint-ok — real-world identity: positive charge
export const NEG = '#7dd3fc'; // sim-lint-ok — real-world identity: negative charge

export const chargeColour = (q: number): string => (q >= 0 ? POS : NEG); // sim-lint-ok — identity pair

// ── Small shared bits ────────────────────────────────────────────────────────

export function Card({ children, tone = 'plain' }:
  { children: React.ReactNode; tone?: 'plain' | 'ok' | 'bad' | 'accent' | 'second' }) {
  const bg =
    tone === 'ok' ? 'rgba(110,231,183,0.07)'
    : tone === 'bad' ? 'rgba(252,165,165,0.07)'
    : tone === 'accent' ? accentTint(ACCENT, 0.08)
    : tone === 'second' ? accentTint(ACCENT_B, 0.08)
    : 'rgba(255,255,255,0.02)';
  const bd =
    tone === 'ok' ? 'rgba(110,231,183,0.32)'
    : tone === 'bad' ? 'rgba(252,165,165,0.32)'
    : tone === 'accent' ? accentTint(ACCENT, 0.3)
    : tone === 'second' ? accentTint(ACCENT_B, 0.3)
    : BORDER.card;
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: bg, borderColor: bd }}>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'ok' | 'bad' | 'info'; children: React.ReactNode }) {
  const c = tone === 'ok' ? OK : tone === 'bad' ? BAD : ACCENT; // sim-lint-ok — OK/BAD are the pass/fail pair
  return (
    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: accentTint(c, 0.14), color: c, border: `1px solid ${accentTint(c, 0.4)}` }}>
      {children}
    </span>
  );
}

/** The §4f inline underline toggle — never a pill box, never a checkbox.
 *  Padded to a 36 px band: these read as text links but ARE controls. */
export function Toggle({ on, label, onClick, accent = ACCENT, disabled }:
  { on: boolean; label: string; onClick: () => void; accent?: string; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={on}
      className="text-xs font-semibold transition-colors"
      style={{
        color: disabled ? TEXT.muted : on ? accent : TEXT.ghost,
        borderBottom: `1px solid ${on ? accentTint(accent, 0.55) : 'rgba(255,255,255,0.1)'}`,
        background: 'none', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: 36, paddingTop: 6, paddingBottom: 4,
      }}>
      {on ? `✓ ${label}` : label}
    </button>
  );
}

export function ActionButton({ children, onClick, accent = ACCENT, disabled, wide }:
  { children: React.ReactNode; onClick: () => void; accent?: string; disabled?: boolean; wide?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-wider transition-all ${wide ? 'w-full' : ''}`}
      style={{
        background: disabled ? 'rgba(255,255,255,0.04)' : accentTint(accent, 0.18),
        border: `1px solid ${disabled ? BORDER.card : accentTint(accent, 0.45)}`,
        color: disabled ? TEXT.muted : accent,
        cursor: disabled ? 'default' : 'pointer',
        minHeight: 40,
      }}>
      {children}
    </button>
  );
}

/** A segmented picker — used for the surface shape and the metal. */
export function Choice({ options, value, onChange, accent = ACCENT }:
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
 * A labelled slider.
 *
 * TOUCH TARGET: a bare range input renders ~16 px tall, less than half the
 * ~44 px a finger needs. The track stays visually thin; the ELEMENT is padded
 * to 44. `touchAction: none` stops a drag along the slider from scrolling the
 * page instead, which is what makes a thin slider feel broken on a phone.
 */
export function Slider({ label, value, min, max, step, onChange, unit = '', accent = ACCENT, format }:
  { label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; unit?: string; accent?: string; format?: (v: number) => string }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ minWidth: 92, fontSize: 12, fontWeight: 600, color: accent }}>{label}</div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} aria-label={label}
        className="flex-1"
        style={{ accentColor: accent, cursor: 'pointer', minHeight: 44, touchAction: 'none' }} />
      <div className="tabular-nums" style={{ minWidth: 78, textAlign: 'right', fontSize: 13, fontWeight: 700, color: accent }}>
        {format ? format(value) : value}
        {unit && <span style={{ color: TEXT.ghost, fontWeight: 500 }}> {unit}</span>}
      </div>
    </div>
  );
}

// ── Legend — every name the canvas is not allowed to print ───────────────────

export interface LegendRow {
  color: string;
  dashed?: boolean;
  /** A filled dot rather than a line — for charges and particles. */
  dot?: boolean;
  label: string;
  value?: string;
}

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

// ── Readout ─────────────────────────────────────────────────────────────────

export interface ReadoutRow { label: string; value: string; color?: string; strong?: boolean }

export function Readout({ rows, footnote, tone }:
  { rows: ReadoutRow[]; footnote?: string; tone?: 'plain' | 'ok' | 'accent' | 'second' }) {
  return (
    <Card tone={tone ?? 'plain'}>
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline justify-between gap-3 py-[3px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEXT.ghost }}>{r.label}</span>
          <span className="tabular-nums"
            style={{ color: r.color ?? TEXT.primary, fontSize: r.strong ? 16 : 13, fontWeight: r.strong ? 800 : 600 }}>
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

// ── Guided script ───────────────────────────────────────────────────────────

/**
 * The statement comes BEFORE the drawing (design law #5). One click, one new
 * thing on screen. Nothing here auto-plays.
 */
export function GuidedPanel({ steps, index, done, onAdvance }:
  { steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void }) {
  const step = steps[Math.min(index, steps.length - 1)];
  return (
    <div className="rounded-xl border px-3 py-3"
      style={{
        background: done ? 'rgba(110,231,183,0.06)' : accentTint(ACCENT, 0.07),
        borderColor: done ? 'rgba(110,231,183,0.28)' : accentTint(ACCENT, 0.28),
      }}>
      <div className="mb-2 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: i < index ? OK : i === index ? ACCENT : 'rgba(255,255,255,0.09)' }} />
        ))}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>
        <InlineMarkdown>
          {done
            ? 'That is the whole build-up. Everything is on now — change anything and every number follows.'
            : step.say}
        </InlineMarkdown>
      </div>
      {!done && (
        <div className="mt-3">
          <ActionButton wide onClick={onAdvance}>{`${step.cta} →`}</ActionButton>
        </div>
      )}
    </div>
  );
}

// ── Misconception card ──────────────────────────────────────────────────────

/**
 * Fired when the sim has just SHOWN the thing that contradicts the belief —
 * never as a preamble. Naming the wrong idea out loud is the point: design law
 * #2 says feedback attacks a specific misconception, not "wrong".
 */
export function MisconceptionCard({ issue }: { issue: FieldIssue }) {
  return (
    <Card tone="accent">
      <div className={TYPE.sectionLabel} style={{ color: ACCENT_B }}>Watch out</div>
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

// ── Predict gate ────────────────────────────────────────────────────────────

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
            : right ? 'rgba(110,231,183,0.5)'
            : picked ? 'rgba(252,165,165,0.5)' : BORDER.card;
          return (
            <button key={i} type="button" disabled={choice !== null} onClick={() => onChoose(i)}
              className="rounded-lg border px-2.5 text-left text-[13px] transition-all"
              style={{
                background: picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: shade, color: TEXT.secondary,
                cursor: choice === null ? 'pointer' : 'default',
                minHeight: 40, paddingTop: 8, paddingBottom: 8,
              }}>
              {o}
            </button>
          );
        })}
      </div>
      {choice !== null && reveal && (
        <div className="mt-2 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{reveal}</InlineMarkdown>
        </div>
      )}
    </Card>
  );
}

// ── Numeric answer ──────────────────────────────────────────────────────────

export function NumericPanel({ prompt, answer, tolerance, unit, reveal }:
  { prompt: string; answer: number; tolerance?: number; unit?: string; reveal: string }) {
  const [entry, setEntry] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const val = parseFloat(entry);
  const ok = checked && Number.isFinite(val) && Math.abs(val - answer) <= (tolerance ?? Math.abs(answer) * 0.05);

  return (
    <Card>
      <div className="mb-2 text-sm" style={{ color: TEXT.primary }}><InlineMarkdown>{prompt}</InlineMarkdown></div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" inputMode="decimal" value={entry} placeholder="answer"
          onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
          className="w-24 rounded-lg border px-2.5 text-sm tabular-nums outline-none"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: BORDER.card, color: TEXT.primary, minHeight: 40 }} />
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

/** A plain, calm note — used for the "per metre of length" and model caveats
 *  that must be said out loud rather than buried in a code comment. */
export function ModelNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
      <InlineMarkdown>{String(children)}</InlineMarkdown>
    </p>
  );
}
