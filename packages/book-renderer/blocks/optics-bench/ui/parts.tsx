'use client';

/*
 * optics-bench/ui/parts.tsx — the small shared pieces.
 * ─────────────────────────────────────────────────────────────────────────────
 * Chrome comes from `_shared/components` (SimShell, SimHeader, SimTabs,
 * SimSlider, StepBar, NavButtons, ExpertTip). These are the bench-specific
 * pieces that sit inside it — cards, the legend that carries every label the
 * canvas is not allowed to draw, readouts, the guided panel, and the
 * misconception probe.
 *
 * Two rules this file exists to hold:
 *   • ONE <text> per canvas. Everything else is named HERE, in a legend keyed by
 *     the same glyph the canvas draws. That is why `Legend` takes a `glyph`.
 *   • Nothing dims TEXT.ghost or TEXT.muted further with an opacity. They are
 *     already at the AA floor; a 0.6 on top of them is 2.5:1 text.
 */

import * as React from 'react';
import {
  ACCENT, BORDER, OK, BAD, TEXT, TYPE, accentTint,
} from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';
import { GLASS, LIGHT } from './theme';

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, accent, className = '' }:
  { children: React.ReactNode; accent?: string; className?: string }) {
  return (
    <div
      className={`rounded-xl p-3 ${className}`}
      style={{
        background: accent ? accentTint(accent, 0.07) : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? accentTint(accent, 0.22) : BORDER.card}`,
      }}
    >
      {children}
    </div>
  );
}

// ── Pill ─────────────────────────────────────────────────────────────────────

export function Pill({ tone, children }:
  { tone: 'ok' | 'no' | 'info' | 'warn'; children: React.ReactNode }) {
  // OK / BAD are the sanctioned non-accent pair — they carry right-vs-wrong
  // meaning, not decoration.
  const colour = tone === 'ok' ? OK          // sim-lint-ok — pass/fail semantic pair
    : tone === 'no' ? BAD                    // sim-lint-ok — pass/fail semantic pair
      : tone === 'warn' ? LIGHT : GLASS;
  return (
    <span
      className="inline-block rounded-md px-2 py-[3px] text-[10px] font-semibold uppercase tracking-widest"
      style={{ background: accentTint(colour, 0.14), border: `1px solid ${accentTint(colour, 0.35)}`, color: colour }}
    >
      {children}
    </span>
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────

export function ActionButton({ onClick, children, accent = ACCENT, disabled, tone = 'solid' }:
  { onClick?: () => void; children: React.ReactNode; accent?: string;
    disabled?: boolean; tone?: 'solid' | 'ghost' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      // 44px is the finger target. The label sits mid-height; the whole band is
      // pressable, which is the difference between "fiddly" and "broken" on a
      // phone.
      style={{
        minHeight: 44,
        touchAction: 'manipulation',
        background: tone === 'solid' ? accentTint(accent, 0.18) : 'rgba(255,255,255,0.04)',
        border: `1px solid ${tone === 'solid' ? accentTint(accent, 0.42) : 'rgba(255,255,255,0.12)'}`,
        color: disabled ? TEXT.muted : tone === 'solid' ? accent : TEXT.secondary,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      className="rounded-lg px-4 text-sm font-bold transition-all"
    >
      {children}
    </button>
  );
}

// ── Legend — every label the canvas is not allowed to draw ───────────────────

export type LegendGlyph = 'ray' | 'dashed' | 'lens' | 'mirror' | 'stop' | 'screen' | 'glass' | 'arrow';

export interface LegendItem {
  name: string;
  colour: string;
  glyph: LegendGlyph;
  value?: string;
  note?: string;
}

function Glyph({ kind, colour }: { kind: LegendGlyph; colour: string }) {
  const box = { width: 22, height: 14 };
  switch (kind) {
    case 'dashed':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <line x1="1" y1="7" x2="21" y2="7" stroke={colour} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );
    case 'lens':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <path d="M11 1 Q16 7 11 13 Q6 7 11 1 Z" fill={accentTint(colour, 0.2)} stroke={colour} strokeWidth="1.4" />
        </svg>
      );
    case 'mirror':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <path d="M14 1 Q8 7 14 13" fill="none" stroke={colour} strokeWidth="1.8" />
          <path d="M15 2 L18 1 M15 6 L18 5 M15 10 L18 9" stroke={colour} strokeWidth="1" opacity="0.7" />
        </svg>
      );
    case 'stop':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <rect x="9" y="0" width="4" height="4.5" fill={colour} />
          <rect x="9" y="9.5" width="4" height="4.5" fill={colour} />
        </svg>
      );
    case 'screen':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <rect x="9" y="1" width="4" height="12" fill={accentTint(colour, 0.3)} stroke={colour} strokeWidth="1.2" />
        </svg>
      );
    case 'glass':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <rect x="4" y="2" width="14" height="10" fill={accentTint(colour, 0.2)} stroke={colour} strokeWidth="1.3" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <line x1="11" y1="13" x2="11" y2="3" stroke={colour} strokeWidth="1.8" />
          <path d="M11 0.5 L14 5 L8 5 Z" fill={colour} />
        </svg>
      );
    default:
      return (
        <svg {...box} viewBox="0 0 22 14" aria-hidden style={{ flexShrink: 0 }}>
          <line x1="1" y1="7" x2="21" y2="7" stroke={colour} strokeWidth="2.2" />
        </svg>
      );
  }
}

export function Legend({ items }: { items: LegendItem[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map((it) => (
        <div key={it.name} className="flex items-center gap-2">
          <Glyph kind={it.glyph} colour={it.colour} />
          <span className="text-xs" style={{ color: TEXT.secondary }}>{it.name}</span>
          {it.value !== undefined && (
            <span className="text-xs font-semibold tabular-nums" style={{ color: it.colour }}>{it.value}</span>
          )}
          {it.note && <span className="text-[11px]" style={{ color: TEXT.muted }}>{it.note}</span>}
        </div>
      ))}
    </div>
  );
}

// ── Readouts ─────────────────────────────────────────────────────────────────

export interface Row { label: string; value: string; colour?: string; strong?: boolean; note?: string }

export function Readouts({ rows, title }: { rows: Row[]; title?: string }) {
  if (!rows.length) return null;
  return (
    <Card>
      {title && (
        <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>{title}</div>
      )}
      {rows.map((r) => (
        <div key={r.label} className="py-[3px]">
          <div className="flex items-baseline justify-between gap-3">
            <span className={TYPE.sectionLabel} style={{ color: TEXT.muted }}>{r.label}</span>
            <span
              className="tabular-nums"
              style={{ color: r.colour ?? TEXT.primary, fontSize: r.strong ? 16 : 13, fontWeight: r.strong ? 800 : 600 }}
            >
              {r.value}
            </span>
          </div>
          {r.note && <div className="text-[11px] leading-snug mt-0.5" style={{ color: TEXT.muted }}>{r.note}</div>}
        </div>
      ))}
    </Card>
  );
}

export const cm = (v: number | null | undefined, dp = 2): string =>
  v === null || v === undefined || !Number.isFinite(v) ? '∞' : `${v > 0 ? '+' : ''}${v.toFixed(dp)} cm`;

export const sig = (v: number | null | undefined, dp = 2): string =>
  v === null || v === undefined || !Number.isFinite(v) ? '—' : v.toFixed(dp);

// ── Guided panel ─────────────────────────────────────────────────────────────

/**
 * The say/cta beat. Guided, never auto-playing: the panel states what is about
 * to happen and why, the student presses, and ONE thing appears. Nothing is on
 * screen before it has been explained.
 */
export function GuidedPanel({ step, total, say, cta, onNext, onBack, accent = LIGHT, done }:
  { step: number; total: number; say: string; cta: string;
    onNext: () => void; onBack?: () => void; accent?: string; done?: boolean }) {
  return (
    <Card accent={accent}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={TYPE.badge} style={{ color: accent }}>
          Step {Math.min(step + 1, total)} of {total}
        </span>
      </div>
      <div className="text-sm leading-snug mb-3" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{say}</InlineMarkdown>
      </div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {onBack && step > 0
          ? <ActionButton tone="ghost" onClick={onBack}>← Back</ActionButton>
          : <span />}
        <ActionButton accent={accent} onClick={onNext} disabled={done}>
          {done ? 'Complete' : cta}
        </ActionButton>
      </div>
    </Card>
  );
}

// ── Misconception probe ──────────────────────────────────────────────────────

export interface ProbeSpec {
  prompt: string;
  options: string[];
  answerIndex: number;
  perOption: string[];
  reveal: string;
}

/**
 * The question that makes a declared `targets` code REAL.
 *
 * Locked until the student commits — a prediction they can revise after seeing
 * the answer is not a prediction. Each wrong option gets its OWN reply naming
 * the specific belief behind it, rather than one paragraph shared by three
 * different errors.
 */
export function ProbeGate({ spec, picked, onPick, accent = LIGHT }:
  { spec: ProbeSpec; picked: number | null; onPick: (i: number) => void; accent?: string }) {
  const answered = picked !== null;
  const correct = picked === spec.answerIndex;
  return (
    <Card accent={answered ? (correct ? OK : BAD) : accent}>
      <div className={`${TYPE.badge} mb-1.5`} style={{ color: answered ? (correct ? OK : BAD) : accent }}>
        {answered ? (correct ? 'That is it' : 'Not quite') : 'Commit first'}
      </div>
      <div className="text-sm leading-snug mb-2.5" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{spec.prompt}</InlineMarkdown>
      </div>
      <div className="flex flex-col gap-1.5">
        {spec.options.map((opt, i) => {
          const chosen = picked === i;
          const isAnswer = i === spec.answerIndex;
          const tone = !answered ? null : isAnswer ? OK : chosen ? BAD : null;  // sim-lint-ok — pass/fail pair
          return (
            <button
              key={opt}
              type="button"
              onClick={() => !answered && onPick(i)}
              disabled={answered}
              style={{
                minHeight: 44,
                touchAction: 'manipulation',
                textAlign: 'left',
                background: tone ? accentTint(tone, 0.12) : 'rgba(255,255,255,0.035)',
                border: `1px solid ${tone ? accentTint(tone, 0.4) : BORDER.card}`,
                color: tone ?? TEXT.secondary,
                cursor: answered ? 'default' : 'pointer',
              }}
              className="rounded-lg px-3 py-2 text-sm leading-snug transition-all"
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 space-y-2">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
            <InlineMarkdown>{spec.perOption[picked] ?? ''}</InlineMarkdown>
          </p>
          <p className="text-sm leading-snug pt-2" style={{ color: TEXT.secondary, borderTop: `1px solid ${BORDER.hairline}` }}>
            <InlineMarkdown>{spec.reveal}</InlineMarkdown>
          </p>
        </div>
      )}
    </Card>
  );
}

// ── Misconception card — fired by something the student DID ──────────────────

export function MisconceptionCard({ heading, body, accent = LIGHT }:
  { heading: string; body: string; accent?: string }) {
  return (
    <Card accent={accent}>
      <div className={`${TYPE.badge} mb-1`} style={{ color: accent }}>{heading}</div>
      <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{body}</InlineMarkdown>
      </p>
    </Card>
  );
}

// ── Warnings the trace produced ──────────────────────────────────────────────

export function TraceNotes({ notes }: { notes: string[] }) {
  if (!notes.length) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {notes.map((n) => (
        <p key={n} className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>{n}</p>
      ))}
    </div>
  );
}
