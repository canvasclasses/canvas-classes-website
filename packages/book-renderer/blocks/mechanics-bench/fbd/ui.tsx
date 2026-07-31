'use client';

/*
 * fbd/ui.tsx — FBD Studio's small shared parts.
 * ─────────────────────────────────────────────────────────────────────────────
 * The BIG chrome (shell, header, step bar, tabs, sliders, nav, expert tip) is
 * composed from `_shared` and is never re-implemented here. What lives in this
 * file is the handful of pieces `_shared` does not own:
 *
 *   • usePointerDrag  — POINTER events (never mouse events), so every drag in
 *     this simulator works identically on a phone. Uses setPointerCapture so a
 *     fast drag that leaves the element does not silently break mid-gesture.
 *   • Legend          — the colour-keyed table that replaces on-canvas labels.
 *     This is the §4E LABEL OVERLAP RULE made structural: names and values live
 *     here, so no two of them can ever collide on the SVG.
 *   • Diagnostic      — a graded issue rendered as a QUESTION, never a "wrong".
 */

import React, { useCallback, useRef } from 'react';
import { TEXT, BORDER, accentTint, OK, BAD, TYPE } from '../../simulations/_shared';
import { CARD_STYLE, PRIMARY } from './theme';

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
 * Returns an `onPointerDown` you can hand to any SVG element.
 *
 * The handlers are read through a ref on every move, so a caller does not have
 * to memoise them — and, more importantly, a re-render mid-drag can never leave
 * the gesture pointing at a stale closure. (The Ch.0 browser pass found a drag
 * that had been gated on an animation clock; drags here are gated on nothing.)
 */
export function usePointerDrag(handlers: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  onStart?: (svgPt: { x: number; y: number }) => void;
  onMove: (svgPt: { x: number; y: number }) => void;
  onEnd?: () => void;
}) {
  const ref = useRef(handlers);
  ref.current = handlers;

  return useCallback((e: React.PointerEvent) => {
    const svg = ref.current.svgRef.current;
    if (!svg) return;
    e.preventDefault();
    e.stopPropagation();
    // Typed as HTMLElement purely for the DOM event map — SVG elements carry
    // the same pointer events, and `Element` alone does not declare them.
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

/** A bordered, tappable button. Used for the palette, agent picker and actions. */
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
        opacity: disabled ? 0.5 : 1,
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
  /** Name: 'Weight', 'Normal', or a body's label. */
  name: string;
  /** The agent, or a shape descriptor: 'from the Earth'. */
  detail?: string;
  /** Symbol or magnitude — only shown once the student has EARNED the number. */
  value?: string;
  dashed?: boolean;
  muted?: boolean;
  flagged?: boolean;
}

/**
 * The colour-keyed legend. Every arrow on the canvas has exactly one row here;
 * that is the whole contract that lets the canvas carry zero text.
 * Rows are selectable — selecting one halos its arrow (or its body) on canvas.
 */
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
              className="flex items-center gap-2.5 rounded-md px-1.5 py-[5px] text-left transition-all"
              style={{
                background: on ? accentTint(r.color, 0.12) : 'transparent',
                cursor: onSelect ? 'pointer' : 'default',
                opacity: r.muted ? 0.45 : 1,
                touchAction: 'manipulation',
              }}>
              <span className="shrink-0 rounded-full" style={{
                width: 22, height: 4,
                background: r.dashed
                  ? `repeating-linear-gradient(90deg, ${r.color} 0 5px, transparent 5px 9px)`
                  : r.color,
              }} />
              <span className="min-w-0 flex-1">
                <span className="text-[12px] font-semibold" style={{ color: r.flagged ? BAD : TEXT.primary }}>
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

// ── Diagnostics ──────────────────────────────────────────────────────────────

/**
 * One graded issue. The engine's `GradeIssue.message` already NAMES the
 * misconception and asks a question — this component's only job is to present
 * it as a thing to think about rather than a verdict, and to let the student
 * jump to the arrow it is about. A bare "wrong" is never rendered anywhere in
 * this simulator.
 */
export function Diagnostic({ code, message, hint, tone, onLocate, located }: {
  code: string; message: string; hint?: string;
  tone: 'error' | 'warning'; onLocate?: () => void; located?: boolean;
}) {
  const [showHint, setShowHint] = React.useState(false);
  const c = tone === 'error' ? BAD : PRIMARY;
  return (
    <div className="rounded-xl px-3 py-2.5"
      style={{
        background: accentTint(c, located ? 0.14 : 0.07),
        border: `1px solid ${accentTint(c, located ? 0.5 : 0.28)}`,
      }}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className={TYPE.badge} style={{ color: c }}>{code.replace(/_/g, ' ')}</span>
        {onLocate && (
          <button type="button" onClick={onLocate}
            className="text-[11px] font-semibold"
            style={{ color: TEXT.ghost, background: 'none', touchAction: 'manipulation' }}>
            {located ? 'showing' : 'show me'}
          </button>
        )}
      </div>
      <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>{message}</p>
      {hint && !showHint && (
        <button type="button" onClick={() => setShowHint(true)}
          className="mt-1.5 text-[11px] font-semibold"
          style={{ color: TEXT.ghost, background: 'none', touchAction: 'manipulation' }}>
          Give me a nudge →
        </button>
      )}
      {hint && showHint && (
        <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>{hint}</p>
      )}
    </div>
  );
}

/** A calm instruction panel. States what is about to happen BEFORE it happens. */
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
            touchAction: 'manipulation',
          }}>
          {cta} →
        </button>
      )}
    </Card>
  );
}
