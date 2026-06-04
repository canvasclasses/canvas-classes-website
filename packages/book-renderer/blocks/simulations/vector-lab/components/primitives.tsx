'use client';

// primitives.tsx — small shared UI atoms for the Vector Lab.
// Every pattern here is lifted from SIMULATION_DESIGN_WORKFLOW.md (§4) so the
// lab matches the rest of the interactive labs exactly.

import React from 'react';
import { C } from '../lib/theme';

// ── Frac (§2): stacked numerator / denominator. NEVER use the ÷ glyph. ────────
export function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.15,
        margin: '0 4px',
      }}
    >
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span
        style={{
          padding: '2px 6px 0 6px',
          borderTop: '1.5px solid currentColor',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {den}
      </span>
    </span>
  );
}

// ── StepBar (§4c): module navigation pills. ───────────────────────────────────
export interface Step {
  id: string;
  label: string;
}

export function StepBar({
  steps,
  currentIndex,
  onGo,
}: {
  steps: Step[];
  currentIndex: number;
  onGo: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {steps.map((s, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <button
            key={s.id}
            onClick={() => onGo(i)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
            style={{
              background: active
                ? 'rgba(129,140,248,0.15)'
                : done
                  ? 'rgba(52,211,153,0.08)'
                  : 'rgba(255,255,255,0.03)',
              border: `1px solid ${
                active
                  ? 'rgba(129,140,248,0.45)'
                  : done
                    ? 'rgba(52,211,153,0.25)'
                    : 'rgba(255,255,255,0.07)'
              }`,
              color: active ? C.indigoLight : done ? C.emeraldPale : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
              style={{
                background: active ? C.indigo : done ? '#059669' : 'rgba(255,255,255,0.06)',
                color: 'white',
              }}
            >
              {done ? '✓' : i + 1}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Back / Next nav (§4d). ─────────────────────────────────────────────────────
export function NavButtons({
  onBack,
  onNext,
  backLabel,
  nextLabel,
}: {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
}) {
  return (
    <div className="flex justify-between items-center pt-2">
      {onBack ? (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: C.text2,
          }}
        >
          ← {backLabel ?? 'Back'}
        </button>
      ) : (
        <span />
      )}
      {onNext ? (
        <button
          onClick={onNext}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(99,102,241,0.18)',
            border: '1px solid rgba(129,140,248,0.4)',
            color: C.indigoLight,
          }}
        >
          {nextLabel ?? 'Next'} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

// ── Labelled slider row. tabular-nums keeps the value column from jittering. ──
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  color,
  onChange,
  disabled,
}: {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  color?: string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5" style={{ opacity: disabled ? 0.5 : 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: color ?? C.text2 }}>
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color: C.text }}>
          {value}
          {unit ? <span style={{ color: C.muted }}> {unit}</span> : null}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: color ?? C.indigo, width: '100%' }}
      />
    </label>
  );
}

// ── Underline toggle (§4f). ────────────────────────────────────────────────────
export function Toggle({
  active,
  onToggle,
  activeLabel,
  inactiveLabel,
  color = C.amber,
}: {
  active: boolean;
  onToggle: () => void;
  activeLabel: string;
  inactiveLabel: string;
  color?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="self-start text-xs font-semibold transition-colors pb-0.5"
      style={{
        color: active ? color : C.muted,
        borderBottom: `1px solid ${active ? `${color}80` : 'rgba(255,255,255,0.1)'}`,
        background: 'none',
        outline: 'none',
      }}
    >
      {active ? `✓ ${activeLabel}` : inactiveLabel}
    </button>
  );
}

// ── Reset pill (§4h). ──────────────────────────────────────────────────────────
export function ResetButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all self-start"
      style={{
        background: 'rgba(99,102,241,0.10)',
        border: '1px solid rgba(129,140,248,0.3)',
        color: '#a5b4fc',
      }}
    >
      ↺ {label ?? 'Reset'}
    </button>
  );
}

// ── Expert Tip block (§4j) — every mechanism sidebar must end with one. ────────
export function ExpertTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: C.indigo }}>
        Expert Tip
      </h5>
      <p className="text-white text-base font-bold leading-tight italic">&ldquo;{children}&rdquo;</p>
    </div>
  );
}

// ── Concept rule block (§4e): plain text, never a bordered card. ──────────────
export function Rule({
  label,
  color = C.indigoLight,
  children,
}: {
  label: string;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color }}>
        {label}
      </p>
      <p className="text-white font-bold text-lg leading-snug">{children}</p>
    </div>
  );
}

// ── Misconception callout — the "ghost of the wrong answer" with a why. ───────
export function MistakeCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.25)' }}
    >
      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: C.red }}>
        Common Mistake
      </p>
      <p className="text-sm leading-snug" style={{ color: C.text2 }}>
        {children}
      </p>
    </div>
  );
}
