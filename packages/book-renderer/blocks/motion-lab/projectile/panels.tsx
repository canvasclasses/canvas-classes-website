'use client';

/*
 * motion-lab/projectile/panels.tsx — the sidebar and the legend.
 * ─────────────────────────────────────────────────────────────────────────────
 * Presentational only. Every panel here exists because of the LABEL OVERLAP
 * RULE (SIMULATION_DESIGN_WORKFLOW §4E / BOOK_PAGE_WORKFLOW): the canvas carries
 * at most ONE text element, so every name, every number and every unit has to
 * live in a colour-keyed legend or a readout row below it. That is not a
 * compromise — a value in a fixed row is far easier to read than a value
 * chasing a moving dot, and it can never collide with an arrow.
 *
 * Colour: ONE primary accent (violet, everything HORIZONTAL) plus ONE secondary
 * (sky, everything VERTICAL). That is a genuine second axis, not decoration,
 * and it means a student can tell at a glance which of the two 1-D movies any
 * mark on the screen belongs to. OK/BAD are used only for right-vs-wrong.
 */

import * as React from 'react';
import InlineMarkdown from '../../InlineMarkdown';
import { ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, TYPE, accentTint } from '../../simulations/_shared';

// ── Small shared bits ────────────────────────────────────────────────────────

export function Card({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'ok' | 'bad' | 'accent' }) {
  const bg =
    tone === 'ok' ? 'rgba(110,231,183,0.07)'
    : tone === 'bad' ? 'rgba(252,165,165,0.07)'
    : tone === 'accent' ? accentTint(ACCENT, 0.08)
    : 'rgba(255,255,255,0.02)';
  const bd =
    tone === 'ok' ? 'rgba(110,231,183,0.32)'
    : tone === 'bad' ? 'rgba(252,165,165,0.32)'
    : tone === 'accent' ? accentTint(ACCENT, 0.3)
    : BORDER.card;
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: bg, borderColor: bd }}>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'ok' | 'bad' | 'info'; children: React.ReactNode }) {
  const c = tone === 'ok' ? OK : tone === 'bad' ? BAD : ACCENT;   // sim-lint-ok — OK/BAD are the pass/fail pair
  return (
    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: accentTint(c, 0.14), color: c, border: `1px solid ${accentTint(c, 0.4)}` }}>
      {children}
    </span>
  );
}

/** The §4f inline underline toggle — never a pill box, never a checkbox. */
export function Toggle({ on, label, onClick, accent = ACCENT, disabled }:
  { on: boolean; label: string; onClick: () => void; accent?: string; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      aria-pressed={on}
      className="text-xs font-semibold transition-colors"
      style={{
        color: disabled ? TEXT.muted : on ? accent : TEXT.ghost,
        borderBottom: `1px solid ${on ? accentTint(accent, 0.55) : 'rgba(255,255,255,0.1)'}`,
        background: 'none', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        // These read as inline text links but ARE controls — they measured
        // 71×19px, well under a finger. Pad vertically to a 36px band without
        // changing the type size or the underline's position relative to it.
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
      }}>
      {children}
    </button>
  );
}

// ── Legend — every name and number the canvas is not allowed to print ────────

export interface LegendRow {
  /** Swatch colour. Dashed swatches read as "reference / not the live one". */
  color: string;
  dashed?: boolean;
  label: string;
  value?: string;
  strong?: boolean;
}

export function Legend({ rows }: { rows: LegendRow[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <span aria-hidden style={{
            display: 'inline-block', width: 16, height: 0,
            borderTop: `${r.strong ? 3 : 2}px ${r.dashed ? 'dashed' : 'solid'} ${r.color}`,
          }} />
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

export function Readout({ rows, footnote }: { rows: ReadoutRow[]; footnote?: string }) {
  return (
    <Card>
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
 * thing on screen. A `Skip` on the same button swallows nothing — an impatient
 * tap during the reveal jumps to the end rather than being ignored, because a
 * disabled button reads as broken.
 */
export function GuidedPanel({ steps, index, done, onAdvance, busy }:
  { steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void; busy: boolean }) {
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
            ? 'That is the whole picture. Now change the launch and watch every number and both tracks follow.'
            : steps[index].say}
        </InlineMarkdown>
      </div>
      {!done && (
        <div className="mt-3">
          <ActionButton wide onClick={onAdvance}>{busy ? 'Skip →' : `${steps[index].cta} →`}</ActionButton>
        </div>
      )}
    </div>
  );
}

// ── Misconception card ──────────────────────────────────────────────────────

/**
 * Fired when the sim has just SHOWN the thing that contradicts the belief —
 * never as a preamble. Naming the wrong idea out loud is the point: design law
 * #2 says feedback must attack a specific misconception, not say "wrong".
 */
export function MisconceptionCard({ heading, body }: { heading: string; body: string }) {
  return (
    <Card tone="accent">
      <div className={TYPE.sectionLabel} style={{ color: ACCENT_2 }}>Watch out</div>
      <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>{heading}</p>
      <div className="mt-1 text-sm leading-snug" style={{ color: TEXT.secondary }}>
        <InlineMarkdown>{body}</InlineMarkdown>
      </div>
    </Card>
  );
}

// ── Predict gate ────────────────────────────────────────────────────────────

export function PredictGate({ prompt, options, answerIndex, reveal, choice, onChoose }:
  { prompt: string; options: string[]; answerIndex?: number; reveal?: string;
    choice: number | null; onChoose: (i: number) => void }) {
  return (
    <Card tone={choice === null ? 'plain' : answerIndex === undefined ? 'plain' : choice === answerIndex ? 'ok' : 'bad'}>
      <div className="mb-2 flex items-center gap-2">
        <Pill tone="info">Predict first</Pill>
      </div>
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
              className="rounded-lg border px-2.5 py-1.5 text-left text-[13px] transition-all"
              style={{
                background: picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: shade, color: TEXT.secondary,
                cursor: choice === null ? 'pointer' : 'default',
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
  const ok = checked && Number.isFinite(val) && Math.abs(val - answer) <= (tolerance ?? 0.05);

  return (
    <Card>
      <div className="mb-2 text-sm" style={{ color: TEXT.primary }}><InlineMarkdown>{prompt}</InlineMarkdown></div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" inputMode="decimal" value={entry} placeholder="answer"
          onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
          className="w-24 rounded-lg border px-2.5 py-1.5 text-sm tabular-nums outline-none"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: BORDER.card, color: TEXT.primary }} />
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

// ── Range-vs-angle mini plot ────────────────────────────────────────────────

/**
 * R(θ) for the current speed and launch height, with the current angle marked
 * and the true optimum marked. Zero SVG text — the two numbers under it carry
 * the labels.
 */
export function RangeCurve({ points, angle, optimum, unitLabel }:
  { points: { angle: number; range: number }[]; angle: number; optimum: number; unitLabel: string }) {
  const W = 240, H = 96, PAD = 6;
  const rMax = Math.max(...points.map((p) => p.range), 1);
  const px = (a: number) => PAD + (a / 90) * (W - 2 * PAD);
  const py = (r: number) => H - PAD - (r / rMax) * (H - 2 * PAD);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${px(p.angle).toFixed(1)},${py(p.range).toFixed(1)}`).join(' ');
  const cur = points.reduce((b, p) => (Math.abs(p.angle - angle) < Math.abs(b.angle - angle) ? p : b), points[0]);

  return (
    <Card>
      <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>Range against angle</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', marginTop: 6 }}>
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
        <line x1={px(45)} y1={PAD} x2={px(45)} y2={H - PAD} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="3 4" />
        <path d={d} fill="none" stroke={ACCENT} strokeWidth={2} />
        <line x1={px(optimum)} y1={PAD} x2={px(optimum)} y2={H - PAD} stroke={ACCENT_2} strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={px(cur.angle)} cy={py(cur.range)} r={4} fill={ACCENT} />
      </svg>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-[11px]" style={{ color: TEXT.ghost }}>
          now <b className="tabular-nums" style={{ color: ACCENT }}>{angle.toFixed(0)}°</b>
          {' → '}<b className="tabular-nums" style={{ color: ACCENT }}>{cur.range.toFixed(1)} {unitLabel}</b>
        </span>
        <span className="text-[11px]" style={{ color: TEXT.ghost }}>
          best <b className="tabular-nums" style={{ color: ACCENT_2 }}>{optimum.toFixed(1)}°</b>
        </span>
        <span className="text-[11px]" style={{ color: TEXT.muted }}>dotted grey line = 45°</span>
      </div>
    </Card>
  );
}
