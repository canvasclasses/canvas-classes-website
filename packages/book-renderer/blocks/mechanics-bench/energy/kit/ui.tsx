'use client';

/*
 * energy/kit/ui.tsx — the Phase-2 benches' shared parts.
 * ─────────────────────────────────────────────────────────────────────────────
 * The BIG chrome (shell, header, step bar, tabs, sliders, nav, expert tip) is
 * composed from `_shared` and is never re-implemented here. The measurement and
 * camera layer is imported from `../../fbd/canvas` (see `./stage`). What lives
 * in this file is only what neither of those owns:
 *
 *   • usePointerDrag   — POINTER events (never mouse events), with capture, so
 *     every drag works identically on a phone and a fast drag that leaves the
 *     element cannot break mid-gesture. Gated on NOTHING — in particular not on
 *     an animation clock, which is the Ch.0 defect this convention exists for.
 *   • Legend           — the colour-keyed table that replaces on-canvas labels.
 *     §4E made structural: names and values live here, so no two can collide.
 *   • Stack            — the KE/PE/heat ledger bar. The flagship visual, shared
 *     by five benches so "the total does not move" is one implementation.
 *   • PredictGate      — commit-before-you-look, with PER-OPTION feedback. The
 *     Phase-1 audit found three distinct misconceptions receiving byte-identical
 *     feedback; an array of responses is the fix, and it is required.
 *   • MisconceptionCard— renders the archetype's declared `targets`. A `targets`
 *     field that nothing renders is exactly the dead-code the audit found 22 of.
 *   • Ledger           — a signed-terms table that adds up in front of you.
 */

import * as React from 'react';
import { TYPE } from '../../../simulations/_shared';
import {
  TEXT, BORDER, OK, BAD, PRIMARY, CARD_STYLE, accentTint, ACCOUNT, STACK_ORDER, sig,
} from './theme';
import type { Account } from './theme';
import { MISCONCEPTION } from './phase2';
import type { Phase2Misconception, Phase2Predict } from './phase2';

// ── Pointer drags ────────────────────────────────────────────────────────────

/** Client px → SVG user-space px, honouring the viewBox transform. */
export function clientToSvg(svg: SVGSVGElement, cx: number, cy: number): { x: number; y: number } {
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const inv = m.inverse();
  if (typeof DOMPoint !== 'undefined') {
    const p = new DOMPoint(cx, cy).matrixTransform(inv);
    return { x: p.x, y: p.y };
  }
  const p = svg.createSVGPoint();
  p.x = cx; p.y = cy;
  const q = p.matrixTransform(inv);
  return { x: q.x, y: q.y };
}

/**
 * Returns an `onPointerDown` for any SVG element.
 *
 * Handlers are read through a ref on every move, so a caller need not memoise
 * them and a re-render mid-drag can never leave the gesture pointing at a stale
 * closure. Nothing about this is conditional on playback state: a drag that only
 * works while the sim is paused (or only while it is running) reads as a broken
 * sim, and that exact defect shipped once already.
 */
export function usePointerDrag(handlers: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  onStart?: (svgPt: { x: number; y: number }) => void;
  onMove: (svgPt: { x: number; y: number }) => void;
  onEnd?: () => void;
}) {
  const ref = React.useRef(handlers);
  ref.current = handlers;

  return React.useCallback((e: React.PointerEvent) => {
    const svg = ref.current.svgRef.current;
    if (!svg) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget as unknown as HTMLElement;
    try { el.setPointerCapture(e.pointerId); } catch { /* capture is best-effort */ }

    ref.current.onStart?.(clientToSvg(svg, e.clientX, e.clientY));

    const move = (ev: PointerEvent) => {
      const s = ref.current.svgRef.current;
      if (!s) return;
      ev.preventDefault();
      ref.current.onMove(clientToSvg(s, ev.clientX, ev.clientY));
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      ref.current.onEnd?.();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }, []);
}

// ── Surfaces ─────────────────────────────────────────────────────────────────

export function Card({ children, tone = 'plain', className = '' }: {
  children: React.ReactNode; tone?: 'plain' | 'ok' | 'bad' | 'accent'; className?: string;
}) {
  const style: React.CSSProperties = { ...CARD_STYLE };
  if (tone === 'ok') { style.background = accentTint(OK, 0.08); style.border = `1px solid ${accentTint(OK, 0.34)}`; }
  if (tone === 'bad') { style.background = accentTint(BAD, 0.07); style.border = `1px solid ${accentTint(BAD, 0.3)}`; }
  if (tone === 'accent') { style.background = accentTint(PRIMARY, 0.08); style.border = `1px solid ${accentTint(PRIMARY, 0.3)}`; }
  return <div className={`px-3 py-2.5 ${className}`} style={style}>{children}</div>;
}

export function Pill({ tone = 'info', children }: {
  tone?: 'ok' | 'bad' | 'info' | 'ghost'; children: React.ReactNode;
}) {
  const c = tone === 'ok' ? OK : tone === 'bad' ? BAD : tone === 'info' ? PRIMARY : TEXT.ghost;
  return (
    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ background: accentTint(c, 0.13), color: c, border: `1px solid ${accentTint(c, 0.36)}` }}>
      {children}
    </span>
  );
}

/**
 * A bordered, tappable button.
 *
 * `minHeight: 44` is not decoration — a browser audit measured every control in
 * every sim and the phone floor is 44 CSS px. `touchAction: manipulation` stops
 * the 300 ms double-tap-zoom delay that makes a correct button feel dead.
 */
export function ActionButton({ onClick, active, disabled, accent = PRIMARY, children, title, full }: {
  onClick?: () => void; active?: boolean; disabled?: boolean; accent?: string;
  children: React.ReactNode; title?: string; full?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`rounded-lg px-3 py-2 text-left text-[12px] font-semibold transition-all ${full ? 'w-full' : ''}`}
      style={{
        background: active ? accentTint(accent, 0.2) : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? accentTint(accent, 0.5) : BORDER.card}`,
        color: disabled ? TEXT.muted : active ? accent : TEXT.secondary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        minHeight: 44,
        touchAction: 'manipulation',
      }}>
      {children}
    </button>
  );
}

// ── The legend — where every name and number lives ───────────────────────────

export interface LegendRow {
  id: string;
  color: string;
  name: string;
  detail?: string;
  value?: string;
  dashed?: boolean;
  muted?: boolean;
  flagged?: boolean;
}

export function Legend({ title, rows, selectedId, onSelect, empty }: {
  title: string;
  rows: LegendRow[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  empty?: string;
}) {
  return (
    <Card>
      <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>{title}</div>
      {rows.length === 0 && (
        <p className="text-[12px] leading-snug" style={{ color: TEXT.muted }}>{empty ?? 'Nothing here yet.'}</p>
      )}
      <div className="flex flex-col">
        {rows.map((r) => {
          const on = selectedId === r.id;
          return (
            <button key={r.id} type="button" onClick={() => onSelect?.(r.id)}
              className="flex items-center gap-2.5 rounded-md px-1.5 py-[7px] text-left transition-all"
              style={{
                background: on ? accentTint(r.color, 0.12) : 'transparent',
                cursor: onSelect ? 'pointer' : 'default',
                // Never below ~0.9: TEXT.muted is already the AA floor and an
                // opacity on top of it puts the row under the contrast minimum.
                opacity: r.muted ? 0.9 : 1,
                touchAction: 'manipulation',
              }}>
              <span className="shrink-0 rounded-full" style={{
                width: 22, height: 4,
                background: r.dashed
                  ? `repeating-linear-gradient(90deg, ${r.color} 0 5px, transparent 5px 9px)`
                  : r.color,
                opacity: r.muted ? 0.5 : 1,
              }} />
              <span className="min-w-0 flex-1">
                <span className="text-[12px] font-semibold"
                  style={{ color: r.flagged ? BAD : r.muted ? TEXT.muted : TEXT.primary }}>
                  {r.name}
                </span>
                {r.detail && (
                  <span className="ml-1.5 text-[11px]" style={{ color: TEXT.ghost }}>{r.detail}</span>
                )}
              </span>
              {r.value && (
                <span className="tabular-nums text-[12px] font-semibold shrink-0" style={{ color: r.color }}>
                  {r.value}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── The energy stack — the flagship visual ───────────────────────────────────

export interface StackValues {
  ke?: number;
  rot?: number;
  pe?: number;
  heat?: number;
}

/**
 * The stacked ledger bar.
 *
 * ⚠ THE SCALE IS PINNED TO A FIXED TOTAL, NOT NORMALISED TO THE CURRENT SUM.
 * A bar that rescales itself every frame would show a flat ceiling no matter
 * what the physics did — which is the exact claim the bench exists to prove, so
 * proving it by construction would be worthless. `scaleTotal` is set ONCE from
 * the initial energy and never touched again, so if the physics ever failed to
 * conserve, the top of the stack would visibly move.
 *
 * Rendered as HTML rather than SVG: it is a bar chart, not a diagram, and the
 * numbers belong in the rows beside it where they cannot overlap anything.
 */
export function Stack({ values, scaleTotal, height = 190, showTotal = true, label }: {
  values: StackValues;
  scaleTotal: number;
  height?: number;
  showTotal?: boolean;
  label?: string;
}) {
  const present = STACK_ORDER.filter((k) => values[k] !== undefined);
  const sum = present.reduce((a, k) => a + Math.max(0, values[k] ?? 0), 0);
  const denom = Math.max(scaleTotal, 1e-9);

  return (
    <div className="flex items-end gap-3">
      <div className="relative shrink-0" style={{ width: 62, height }}>
        {/* The ceiling: where the total SHOULD sit if energy is conserved. */}
        {showTotal && (
          <div className="absolute left-0 right-0" style={{
            bottom: `${Math.min(100, (denom / denom) * 100)}%`,
            borderTop: `2px dashed ${accentTint(TEXT.primary, 0.55)}`,
          }} />
        )}
        <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse overflow-hidden"
          style={{ borderRadius: 8, border: `1px solid ${BORDER.card}`, height: '100%' }}>
          {present.map((k) => {
            const v = Math.max(0, values[k] ?? 0);
            return (
              <div key={k} style={{
                height: `${Math.min(100, (v / denom) * 100)}%`,
                background: accentTint(ACCOUNT[k].color, 0.75),
                borderTop: v > 0 ? `1px solid ${ACCOUNT[k].color}` : 'none',
                transition: 'height 90ms linear',
              }} />
            );
          })}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        {label && (
          <div className={`${TYPE.badge} mb-1`} style={{ color: TEXT.ghost }}>{label}</div>
        )}
        {present.map((k) => (
          <div key={k} className="flex items-center gap-2 py-[3px]">
            <span className="shrink-0 rounded-sm" style={{
              width: 12, height: 12, background: accentTint(ACCOUNT[k].color, 0.75),
              border: `1px solid ${ACCOUNT[k].color}`,
            }} />
            <span className="flex-1 text-[12px] font-semibold" style={{ color: TEXT.primary }}>
              {ACCOUNT[k].label}
            </span>
            <span className="tabular-nums text-[12px] font-semibold" style={{ color: ACCOUNT[k].color }}>
              {sig(values[k] ?? 0)}
            </span>
          </div>
        ))}
        {showTotal && (
          <div className="mt-1 flex items-center gap-2 pt-1.5"
            style={{ borderTop: `1px solid ${BORDER.divider}` }}>
            <span className="shrink-0" style={{
              width: 12, height: 0,
              borderTop: `2px dashed ${accentTint(TEXT.primary, 0.55)}`,
            }} />
            <span className="flex-1 text-[12px] font-bold" style={{ color: TEXT.primary }}>Total</span>
            <span className="tabular-nums text-[12px] font-bold" style={{ color: TEXT.primary }}>
              {sig(sum)} J
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── The predict gate ─────────────────────────────────────────────────────────

/**
 * Commit before you look.
 *
 * Two rules the Phase-1 audit made non-negotiable:
 *  1. EVERY option gets its own response, including the right one — a shared
 *     paragraph for three different wrong beliefs is scoring, not diagnosis.
 *  2. Nothing downstream renders until a choice is made. The gate returning
 *     `answered` is what the bench uses to decide whether to draw the reveal;
 *     an ungated reveal is how a sim hands over its answer for free.
 */
export function PredictGate({ predict, choice, onChoose }: {
  predict: Phase2Predict;
  choice: number | null;
  onChoose: (i: number) => void;
}) {
  const answered = choice !== null;
  const right = choice === predict.answer_index;
  return (
    <Card tone={answered ? (right ? 'ok' : 'bad') : 'accent'}>
      <div className={`${TYPE.badge} mb-1.5`} style={{ color: answered ? (right ? OK : BAD) : PRIMARY }}>
        {answered ? (right ? 'You had it' : 'Worth a second look') : 'Predict first'}
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: TEXT.primary }}>{predict.prompt}</p>
      <div className="mt-2 flex flex-col gap-1.5">
        {predict.options.map((o, i) => {
          const picked = choice === i;
          const isAnswer = i === predict.answer_index;
          const tint = !answered ? PRIMARY : isAnswer ? OK : picked ? BAD : TEXT.ghost;
          return (
            <button key={o} type="button" onClick={() => !answered && onChoose(i)}
              disabled={answered}
              className="rounded-lg px-3 py-2 text-left text-[12px] font-semibold transition-all"
              style={{
                background: picked || (answered && isAnswer) ? accentTint(tint, 0.16) : 'rgba(255,255,255,0.04)',
                border: `1px solid ${picked || (answered && isAnswer) ? accentTint(tint, 0.5) : BORDER.card}`,
                color: answered && !picked && !isAnswer ? TEXT.muted : tint,
                cursor: answered ? 'default' : 'pointer',
                minHeight: 44,
                touchAction: 'manipulation',
              }}>
              {o}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-2.5">
          <p className="text-[12.5px] leading-relaxed" style={{ color: TEXT.primary }}>
            {predict.per_option[choice]}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: TEXT.secondary }}>
            {predict.reveal}
          </p>
        </div>
      )}
    </Card>
  );
}

// ── The misconception card ───────────────────────────────────────────────────

/**
 * The archetype's declared `targets`, rendered.
 *
 * `when` is the evidence gate. The card must never appear as a PREAMBLE — being
 * told the misconception before you have had a chance to hold it is the fastest
 * way to make a sim feel like a lecture, and Phase 1 shipped two cards that did
 * exactly that. Callers pass the condition that means "the student has now SEEN
 * the thing this card is about".
 */
export function MisconceptionCard({ code, when }: { code: Phase2Misconception; when: boolean }) {
  if (!when) return null;
  const copy = MISCONCEPTION[code];
  if (!copy) return null;
  return (
    <div className="rounded-xl px-3 py-2.5"
      style={{ background: accentTint(PRIMARY, 0.07), border: `1px solid ${accentTint(PRIMARY, 0.28)}` }}>
      <div className={`${TYPE.badge} mb-1`} style={{ color: PRIMARY }}>
        {code.replace(/_/g, ' ')}
      </div>
      <p className="text-[13px] font-semibold leading-snug" style={{ color: TEXT.primary }}>
        {copy.heading}
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: TEXT.secondary }}>
        {copy.body}
      </p>
    </div>
  );
}

// ── The guided panel ─────────────────────────────────────────────────────────

/** States what is about to happen BEFORE it happens, then one click reveals one
 *  thing. Nothing on any Phase-2 canvas moves without a click. */
export function GuidePanel({ say, cta, onAdvance, done }: {
  say: string; cta?: string; onAdvance?: () => void; done?: boolean;
}) {
  return (
    <Card tone={done ? 'ok' : 'accent'}>
      <p className="text-[13px] leading-relaxed" style={{ color: TEXT.primary }}>{say}</p>
      {cta && onAdvance && !done && (
        <button type="button" onClick={onAdvance}
          className="mt-2.5 w-full rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-wider transition-all"
          style={{
            background: accentTint(PRIMARY, 0.2),
            border: `1px solid ${accentTint(PRIMARY, 0.45)}`,
            color: PRIMARY,
            minHeight: 44,
            touchAction: 'manipulation',
          }}>
          {cta} →
        </button>
      )}
    </Card>
  );
}

// ── The signed-terms ledger ──────────────────────────────────────────────────

export interface LedgerTerm {
  id: string;
  label: string;
  detail?: string;
  value: number;
  unit?: string;
  color?: string;
}

/**
 * A table of signed terms with a rule and a sum underneath.
 *
 * Used for torque balance, for momentum before/after, and for the work account
 * on the chair. It prints the TERMS, not just the verdict: "balanced" is a light
 * that tells a student nothing, whereas +11.76 and −11.76 adding to zero is the
 * physics itself.
 */
export function TermLedger({ title, terms, sumLabel = 'Total', unit = '', tol = 1e-6, note }: {
  title: string;
  terms: LedgerTerm[];
  sumLabel?: string;
  unit?: string;
  tol?: number;
  note?: string;
}) {
  const sum = terms.reduce((a, t) => a + t.value, 0);
  const zero = Math.abs(sum) <= tol;
  return (
    <Card>
      <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>{title}</div>
      {terms.map((t) => (
        <div key={t.id} className="flex items-center gap-2 py-[3px]">
          {t.color && (
            <span className="shrink-0 rounded-full" style={{ width: 16, height: 4, background: t.color }} />
          )}
          <span className="min-w-0 flex-1">
            <span className="text-[12px] font-semibold" style={{ color: TEXT.primary }}>{t.label}</span>
            {t.detail && <span className="ml-1.5 text-[11px]" style={{ color: TEXT.ghost }}>{t.detail}</span>}
          </span>
          <span className="tabular-nums text-[12px] font-semibold shrink-0"
            style={{ color: t.color ?? TEXT.secondary }}>
            {t.value >= 0 ? '+' : '−'}{sig(Math.abs(t.value))}{t.unit ?? unit}
          </span>
        </div>
      ))}
      <div className="mt-1.5 flex items-center gap-2 pt-1.5" style={{ borderTop: `1px solid ${BORDER.divider}` }}>
        <span className="flex-1 text-[12px] font-bold" style={{ color: TEXT.primary }}>{sumLabel}</span>
        <span className="tabular-nums text-[12px] font-bold" style={{ color: zero ? OK : TEXT.primary }}>
          {sum >= 0 ? '+' : '−'}{sig(Math.abs(sum))}{unit}
        </span>
      </div>
      {note && <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>{note}</p>}
    </Card>
  );
}

/** A two-row before/after comparison — momentum and KE across a collision, L and
 *  KE across a spin change. The point is always which row moved. */
export function BeforeAfter({ title, rows }: {
  title: string;
  rows: { id: string; label: string; before: number; after: number; unit: string; note?: string }[];
}) {
  return (
    <Card>
      <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>{title}</div>
      <div className="grid gap-x-2 gap-y-1" style={{ gridTemplateColumns: '1fr auto auto auto' }}>
        <span />
        <span className={TYPE.badge} style={{ color: TEXT.ghost, textAlign: 'right' }}>before</span>
        <span className={TYPE.badge} style={{ color: TEXT.ghost, textAlign: 'right' }}>after</span>
        <span className={TYPE.badge} style={{ color: TEXT.ghost, textAlign: 'right' }}>Δ</span>
        {rows.map((r) => {
          const d = r.after - r.before;
          const held = Math.abs(d) <= Math.max(1e-9, Math.abs(r.before) * 1e-9);
          return (
            <React.Fragment key={r.id}>
              <span className="text-[12px] font-semibold" style={{ color: TEXT.primary }}>
                {r.label}
                {r.note && <span className="ml-1.5 text-[11px]" style={{ color: TEXT.ghost }}>{r.note}</span>}
              </span>
              <span className="tabular-nums text-right text-[12px]" style={{ color: TEXT.secondary }}>
                {sig(r.before)}
              </span>
              <span className="tabular-nums text-right text-[12px]" style={{ color: TEXT.secondary }}>
                {sig(r.after)}
              </span>
              <span className="tabular-nums text-right text-[12px] font-bold"
                style={{ color: held ? OK : BAD }}>
                {held ? '0' : `${d > 0 ? '+' : '−'}${sig(Math.abs(d))}`}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}

/** One short read-only fact, for the panel column. */
export function Readout({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-[3px]">
      <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>{label}</span>
      <span className="tabular-nums text-[12.5px] font-semibold"
        style={{ color: tone ?? TEXT.primary }}>{value}</span>
    </div>
  );
}

export { sig };
export type { Account };
