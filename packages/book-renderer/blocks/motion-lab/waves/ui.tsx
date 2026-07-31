'use client';

/*
 * motion-lab/waves/ui.tsx — the shared Phase-2 bench frame.
 * ─────────────────────────────────────────────────────────────────────────────
 * Nine benches across `waves/` and `thermo/` share this file. That is deliberate
 * and it is the single highest-leverage decision in the Phase-2 build: the
 * Phase-1 QA report's list of "where a student actually gets stuck" is almost
 * entirely LAYOUT and AFFORDANCE failures, and every one of them is fixed once
 * here instead of nine times badly.
 *
 * What the frame owns, and why each is not left to the individual bench:
 *
 * • RESPONSIVENESS IS MEASURED. One ResizeObserver on the wrapper decides one
 *   column or two; another measures the canvas box so the SVG viewBox is the
 *   CSS pixel box and nothing is ever letterboxed. No `lg:` anywhere — these
 *   render inside the admin editor's ~380 px preview pane where the VIEWPORT is
 *   a laptop, and a viewport query keeps two columns and squeezes the canvas to
 *   a stamp.
 *
 * • AN UNMEASURED WIDTH COUNTS AS NARROW. `useStageWidth` returns 0 before the
 *   first observation and the circular module reads that as "keep the desktop
 *   layout". On a phone that shipped as a real bug — a two-column layout for the
 *   frames before the observer reports, on exactly the devices least able to
 *   afford it. Here 0 means NARROW.
 *
 * • THE GUIDED PANEL AND THE PREDICT GATE MOVE ABOVE THE CANVAS WHEN STACKED.
 *   While the guided ladder runs, the primary action is disabled and the only
 *   thing that re-enables it is the CTA inside the guided panel. Stacked, that
 *   panel would sit below the canvas, the legend and the controls — so a phone
 *   student's first experience is a dead button with its cure off-screen. And
 *   "predict before you look" only works if the question is ABOVE the thing you
 *   must not look at yet.
 *
 * • THE CANVAS BOX TAKES THE SHAPE OF ITS CONTENT. Equal-scale drawings cannot
 *   be stretched to fill a box, so the box is given the content's aspect ratio
 *   instead, with a 10% dead band so a slider nudge does not re-height the page
 *   and a freeze while a handle is held so the camera never moves under a finger.
 *
 * • ONE `<text>` PER CANVAS, AT MOST. Every name, number and unit lives in the
 *   colour-keyed legend or a readout row below — SIMULATION_DESIGN_WORKFLOW §4E.
 *   The frame provides both, so no bench has an excuse to print on its canvas.
 *
 * Colour: ONE primary accent + ONE secondary, both from `_shared/tokens`, never
 * a literal. OK/BAD appear only as the right/wrong pair.
 */

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import InlineMarkdown from '../../InlineMarkdown';
import type { PredictSpec } from './types';
import {
  SimShell, SimHeader, SectionLabel, SimSlider, ExpertTip,
  ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, TYPE, SIM_CANVAS_BG, accentTint,
} from '../../simulations/_shared';

// Re-exported so a bench imports its whole UI surface from one place.
export { ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, TYPE, accentTint, SimSlider, SectionLabel };

/** Below this MEASURED container width everything stacks into one column. */
export const NARROW_AT = 640;

/** 0 = "not measured yet" and MUST count as narrow. See the header. */
export const isNarrow = (w: number): boolean => w < NARROW_AT;

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
export const f1 = (n: number): string => (Number.isFinite(n) ? n.toFixed(1) : '—');
export const f2 = (n: number): string => (Number.isFinite(n) ? n.toFixed(2) : '—');
export const f3 = (n: number): string => (Number.isFinite(n) ? n.toFixed(3) : '—');
/** Integer with thin spaces every three digits — readable without a monospace. */
export const fInt = (n: number): string =>
  Number.isFinite(n) ? Math.round(n).toLocaleString('en-IN') : '—';

// ── Measurement ──────────────────────────────────────────────────────────────

/**
 * Measured width of an element in CSS pixels; 0 until the first observation.
 *
 * WIDTH ONLY. These components SET their own height, so observing height would
 * feed an element's output back into its input and oscillate. Width is a pure
 * input — nothing inside can change it.
 */
export function useMeasured<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const read = () => {
      const next = Math.round(el.getBoundingClientRect().width);
      setW((prev) => (prev === next ? prev : next));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/**
 * Choose the canvas height from the content's aspect ratio, with hysteresis.
 *
 * `frozen` is passed true while a drag handle is held. Without it, a bench whose
 * bounds come from the thing being dragged re-fits mid-gesture and pulls the
 * handle out from under the finger — the exact defect the Phase-1 browser sweep
 * found in the FBD incline drag.
 */
export function useBoxHeight(width: number, aspect: number, frozen: boolean, maxH = 520, minH = 210): number {
  const ref = useRef<{ w: number; h: number } | null>(null);
  const avail = Math.max(60, width - 40);
  const want = clamp(Math.round(avail / Math.max(aspect, 0.15) / 8) * 8 + 40, minH, maxH);
  if (!frozen) {
    const prev = ref.current;
    if (!prev || prev.w !== width || Math.abs(want - prev.h) > 0.1 * prev.h) {
      ref.current = { w: width, h: want };
    }
  }
  return ref.current?.h ?? want;
}

// ── Small chrome ─────────────────────────────────────────────────────────────

export function Card({ children, tone = 'plain' }:
  { children: React.ReactNode; tone?: 'plain' | 'ok' | 'bad' | 'accent' }) {
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

/**
 * The §4f inline underline toggle. Padded to a 36 px band: these read as text
 * links but ARE controls, and a 19 px tall control is under half a fingertip.
 */
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
        minHeight: 44,
      }}>
      {children}
    </button>
  );
}

/** A segmented picker. Used wherever a bench genuinely has 2–4 modes; never as
 *  decoration, because an inert tab that prints wrong copy for the current
 *  archetype was one of Phase 1's worst findings. */
export function Segmented<T extends string>({ value, options, onChange, accent = ACCENT }:
  { value: T; options: { key: T; label: string }[]; onChange: (k: T) => void; accent?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button key={o.key} type="button" onClick={() => onChange(o.key)}
            className="flex-1 rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition-all"
            style={{
              background: on ? accentTint(accent, 0.18) : 'rgba(255,255,255,0.02)',
              borderColor: on ? accentTint(accent, 0.45) : BORDER.card,
              color: on ? accent : TEXT.ghost, cursor: 'pointer', minHeight: 40, minWidth: 92,
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Legend and readout — everything the canvas is not allowed to print ───────

export interface LegendRow {
  color: string;
  dashed?: boolean;
  label: string;
  value?: string;
  strong?: boolean;
}

export function Legend({ rows }: { rows: LegendRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {rows.map((r, i) => (
        <div key={`${r.label}-${i}`} className="flex items-center gap-2">
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

export interface ReadoutRow { label: string; value: string; color?: string; strong?: boolean }

export function Readout({ rows, footnote, title }:
  { rows: ReadoutRow[]; footnote?: string; title?: string }) {
  return (
    <Card>
      {title && <div className={`${TYPE.sectionLabel} mb-1`} style={{ color: TEXT.secondary }}>{title}</div>}
      {rows.map((r, i) => (
        <div key={`${r.label}-${i}`} className="flex items-baseline justify-between gap-3 py-[3px]">
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

/**
 * A stacked bar whose segments trade while the total holds still.
 *
 * Used three times — SHM's kinetic/potential ledger, the first law's W/ΔU/Q
 * ledger, and Bernoulli's P/½ρv²/ρgh ledger — because in all three the ARGUMENT
 * is the same shape: several quantities exchange, and their sum is the invariant.
 * Seeing the top edge refuse to move while the pieces slide is the proof.
 */
export function LedgerBar({ segments, total, unit, note }: {
  segments: { label: string; value: number; color: string }[];
  total: number;
  unit: string;
  note?: string;
}) {
  const denom = Math.max(Math.abs(total), 1e-12);
  return (
    <Card>
      <div className="flex h-6 w-full overflow-hidden rounded-md"
        style={{ border: `1px solid ${BORDER.card}`, background: 'rgba(255,255,255,0.03)' }}>
        {segments.map((s) => (
          <div key={s.label}
            style={{
              width: `${clamp((Math.abs(s.value) / denom) * 100, 0, 100)}%`,
              background: accentTint(s.color, 0.55),
              borderRight: `1px solid ${accentTint(s.color, 0.8)}`,
              transition: 'width 90ms linear',
            }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <span key={s.label} className="text-[11px]" style={{ color: TEXT.secondary }}>
            <span aria-hidden style={{
              display: 'inline-block', width: 10, height: 10, borderRadius: 2,
              background: accentTint(s.color, 0.65), marginRight: 5, verticalAlign: -1,
            }} />
            {s.label} <b className="tabular-nums" style={{ color: s.color }}>{f2(s.value)}</b>
          </span>
        ))}
        <span className="text-[11px] font-semibold" style={{ color: TEXT.primary }}>
          total <b className="tabular-nums">{f2(total)} {unit}</b>
        </span>
      </div>
      {note && <p className="mt-1.5 text-[10px] leading-snug" style={{ color: TEXT.muted }}>{note}</p>}
    </Card>
  );
}

// ── Guided script ────────────────────────────────────────────────────────────

/**
 * The statement comes BEFORE the drawing (design law #5). One click, one new
 * thing on screen, and never an auto-playing reveal.
 *
 * The CTA is a real action — it advances the reveal ladder. Phase 1 shipped
 * guide CTAs that were visually identical to the buttons that acted and merely
 * swapped the paragraph above them; a student reads that as a broken control.
 */
export function GuidedPanel({ steps, index, done, onAdvance }:
  { steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void }) {
  if (!steps.length) return null;
  const i = clamp(index, 0, steps.length - 1);
  return (
    <div className="rounded-xl border px-3 py-3"
      style={{
        background: done ? 'rgba(110,231,183,0.06)' : accentTint(ACCENT, 0.07),
        borderColor: done ? 'rgba(110,231,183,0.28)' : accentTint(ACCENT, 0.28),
      }}>
      <div className="mb-2 flex items-center gap-1.5">
        {steps.map((s, k) => (
          <span key={s.cta} className="h-1.5 flex-1 rounded-full"
            style={{ background: k < index ? OK : k === index ? ACCENT : 'rgba(255,255,255,0.09)' }} />
        ))}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>
        <InlineMarkdown>
          {done
            ? 'That is the whole build-up. Now change the settings yourself — every number and every curve follows.'
            : steps[i].say}
        </InlineMarkdown>
      </div>
      {!done && (
        <div className="mt-3">
          <ActionButton wide onClick={onAdvance}>{`${steps[i].cta} →`}</ActionButton>
        </div>
      )}
    </div>
  );
}

// ── Predict gate, with ONE RESPONSE PER OPTION ───────────────────────────────

/**
 * The Phase-1 audit's sharpest finding about prediction: three distinct classic
 * wrong answers, all receiving byte-identical feedback. That is right/wrong
 * scoring wearing a diagnosis costume, and it teaches nothing about WHY the
 * student's reasoning went wrong.
 *
 * So this gate takes `responses[i]` and shows the one for the option actually
 * chosen — including for the correct one, which explains the mechanism rather
 * than saying "well done".
 */
export function PredictGate({ spec, choice, onChoose }:
  { spec: PredictSpec; choice: number | null; onChoose: (i: number) => void }) {
  const right = choice !== null && choice === spec.answerIndex;
  return (
    <Card tone={choice === null ? 'plain' : right ? 'ok' : 'bad'}>
      <div className="mb-2 flex items-center gap-2">
        <Pill tone="info">Predict first</Pill>
        {choice !== null && <Pill tone={right ? 'ok' : 'bad'}>{right ? 'Right' : 'Not quite'}</Pill>}
      </div>
      <div className="text-sm" style={{ color: TEXT.primary }}><InlineMarkdown>{spec.prompt}</InlineMarkdown></div>
      <div className="mt-2 flex flex-col gap-1.5">
        {spec.options.map((o, i) => {
          const picked = choice === i;
          const isAnswer = i === spec.answerIndex;
          const shade = choice === null ? BORDER.card
            : isAnswer ? 'rgba(110,231,183,0.5)'
            : picked ? 'rgba(252,165,165,0.5)' : BORDER.card;
          return (
            <button key={o} type="button" disabled={choice !== null} onClick={() => onChoose(i)}
              className="rounded-lg border px-2.5 py-2 text-left text-[13px] transition-all"
              style={{
                background: picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: shade, color: TEXT.secondary,
                cursor: choice === null ? 'pointer' : 'default', minHeight: 40,
              }}>
              {o}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <div className="mt-2 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{spec.responses[choice] ?? ''}</InlineMarkdown>
        </div>
      )}
    </Card>
  );
}

// ── Misconception card ───────────────────────────────────────────────────────

/**
 * Fires only once the bench has SHOWN the contradicting evidence. Both strings
 * come from the archetype's `attacks` record, so a code declared in the data is
 * a code a student can actually be shown — the thing Phase 1 got wrong 22 times.
 */
export function MisconceptionCard({ belief, attack }: { belief: string; attack: string }) {
  return (
    <Card tone="accent">
      <div className={TYPE.sectionLabel} style={{ color: ACCENT_2 }}>The idea to drop</div>
      <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>“{belief}”</p>
      <div className="mt-1.5 text-sm leading-snug" style={{ color: TEXT.secondary }}>
        <InlineMarkdown>{attack}</InlineMarkdown>
      </div>
    </Card>
  );
}

// ── Numeric answer ───────────────────────────────────────────────────────────

/** The worked reveal is shown only when the answer is RIGHT, or after a second
 *  attempt. Phase 1's version revealed on any Check, so one click with junk in
 *  the box handed over the whole solution. */
export function NumericPanel({ prompt, answer, tolerance, unit, reveal }:
  { prompt: string; answer: number; tolerance?: number; unit?: string; reveal: string }) {
  const [entry, setEntry] = useState('');
  const [tries, setTries] = useState(0);
  const [checked, setChecked] = useState(false);
  const val = parseFloat(entry);
  const ok = checked && Number.isFinite(val) && Math.abs(val - answer) <= (tolerance ?? Math.abs(answer) * 0.02);

  return (
    <Card>
      <div className="mb-2 text-sm" style={{ color: TEXT.primary }}><InlineMarkdown>{prompt}</InlineMarkdown></div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" inputMode="decimal" value={entry} placeholder="answer"
          onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
          aria-label="Your answer"
          className="w-24 rounded-lg border px-2.5 py-1.5 text-sm tabular-nums outline-none"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: BORDER.card, color: TEXT.primary, minHeight: 40 }} />
        {unit && <span className="text-xs font-semibold" style={{ color: TEXT.ghost }}>{unit}</span>}
        <ActionButton onClick={() => { setChecked(true); setTries((t) => t + 1); }} disabled={entry === ''}>Check</ActionButton>
        {checked && <Pill tone={ok ? 'ok' : 'bad'}>{ok ? 'Correct' : 'Not yet'}</Pill>}
      </div>
      {checked && !ok && tries < 2 && (
        <p className="mt-2 text-[13px]" style={{ color: TEXT.secondary }}>
          Have another go before the working appears — change one thing and re-read the ledger.
        </p>
      )}
      {checked && (ok || tries >= 2) && (
        <div className="mt-2 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{reveal}</InlineMarkdown>
        </div>
      )}
    </Card>
  );
}

// ── The frame ────────────────────────────────────────────────────────────────

export interface LabFrameProps {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  /** The guided ladder. `null` when the block turned guiding off. */
  guided: { steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void } | null;
  predict: { spec: PredictSpec; choice: number | null; onChoose: (i: number) => void } | null;
  /** Content width ÷ content height. The box takes this shape. */
  canvasAspect: number;
  maxCanvasHeight?: number;
  minCanvasHeight?: number;
  /** True while a drag handle is held — freezes the box so it cannot move
   *  under the finger. */
  frozen?: boolean;
  renderCanvas: (w: number, h: number) => React.ReactNode;
  legend: LegendRow[];
  /** Transport rows, strip labels, anything that belongs under the canvas. */
  belowCanvas?: React.ReactNode;
  /** Sliders and toggles. Always in the sidebar (or below, when stacked). */
  controls: React.ReactNode;
  panels?: React.ReactNode;
  misconception?: { belief: string; attack: string } | null;
  tip: string;
  caption?: string;
}

export function LabFrame(p: LabFrameProps) {
  const [wrapRef, wrapW] = useMeasured<HTMLDivElement>();
  const [canvasRef, canvasW] = useMeasured<HTMLDivElement>();
  const narrow = isNarrow(wrapW);
  const boxW = canvasW > 0 ? canvasW : 560;
  const H = useBoxHeight(boxW, p.canvasAspect, !!p.frozen, p.maxCanvasHeight ?? 520, p.minCanvasHeight ?? 210);

  const intro = (
    <>
      {p.guided && (
        <GuidedPanel steps={p.guided.steps} index={p.guided.index} done={p.guided.done} onAdvance={p.guided.onAdvance} />
      )}
      {p.predict && (
        <PredictGate spec={p.predict.spec} choice={p.predict.choice} onChoose={p.predict.onChoose} />
      )}
    </>
  );

  return (
    <SimShell>
      <SimHeader title={p.title} subtitle={p.subtitle} badge={p.badge} />

      {/*
        The Tailwind pair is the pre-measurement/SSR fallback only. Once wrapW is
        known the inline gridTemplateColumns wins and it is driven by the
        CONTAINER, so the admin editor's narrow preview pane stacks correctly
        even though the viewport behind it is a laptop. `minmax(0,…)` because a
        bare `7fr` lets a wide SVG refuse to shrink and push the sidebar off.
      */}
      <div
        ref={wrapRef}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_5fr] lg:items-start"
        style={wrapW > 0
          ? {
              gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(0,7fr) minmax(0,5fr)',
              alignItems: narrow ? 'stretch' : 'start',
            }
          : undefined}
      >
        {/* ══ canvas column ══════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {narrow && intro}
          <div ref={canvasRef} className="relative overflow-hidden rounded-2xl"
            style={{ height: H, background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}>
            {p.renderCanvas(boxW, H)}
          </div>
          <Legend rows={p.legend} />
          {p.belowCanvas}
        </div>

        {/* ══ sidebar ════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {!narrow && intro}
          {p.controls}
          {p.panels}
          {p.misconception && (
            <MisconceptionCard belief={p.misconception.belief} attack={p.misconception.attack} />
          )}
          <ExpertTip>{p.tip}</ExpertTip>
        </div>
      </div>

      {p.caption && (
        <p className={`mt-4 ${TYPE.body}`} style={{ color: TEXT.muted }}>{p.caption}</p>
      )}
    </SimShell>
  );
}

// ── A "this archetype is not on this bench" card ─────────────────────────────

/** Blocks are Mixed-stored, so a hand-edited page can name an unknown id. Name
 *  it rather than rendering nothing — a blank card reads as a broken reader. */
export function Unknown({ title, body }: { title: string; body: string }) {
  return (
    <SimShell>
      <SimHeader title={title} subtitle="motion lab · phase 2" />
      <Card><p className={TYPE.body} style={{ color: TEXT.secondary }}>{body}</p></Card>
    </SimShell>
  );
}
