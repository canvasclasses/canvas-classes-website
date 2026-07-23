'use client';

/*
 * _shared/components.tsx
 * ----------------------
 * Shared CHROME components for simulators — the parts that must look identical
 * across every sim (wrapper, header, section labels, tabs, step bar, nav
 * buttons, sliders, expert tip). Compose these instead of hand-rolling the
 * chrome, and typography / spacing / weight can't drift: you don't write the
 * header, so you can't get its font size wrong.
 *
 * Colour flexes through an `accent` prop (defaults to the token ACCENT violet);
 * everything structural is baked in from _shared/tokens. The bespoke part of a
 * sim — its canvas/visualization and its logic — stays bespoke and lives in the
 * sim file. This library only owns the frame around it.
 *
 * This file lives under _shared/, so the design-gate validator does NOT lint it
 * (it IS the sanctioned home for the tokens). The one font-black-at-small-size
 * exception the workflow allows (the StepBar pill label) lives here and ONLY
 * here, so no individual sim ever reproduces it.
 */

import * as React from 'react';
import {
  SIM_BG, ACCENT, TEXT, TYPE, BORDER, accentTint,
} from './tokens';

// ── SimShell — the outer wrapper ─────────────────────────────────────────────
export function SimShell({ children, className = '', style }:
  { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`p-4 md:p-6 not-prose ${className}`}
      style={{
        background: SIM_BG, color: TEXT.primary, borderRadius: 16,
        minHeight: '60vh', fontFamily: 'system-ui, sans-serif', ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── SimHeader — title (with accent word) + subtitle + optional badge ──────────
export function SimHeader({ title, accentWord, subtitle, badge, accent = ACCENT }:
  { title: string; accentWord?: string; subtitle?: string;
    badge?: React.ReactNode; accent?: string }) {
  return (
    <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
      <div>
        <h2 className={TYPE.title}>
          {title}{accentWord ? ' ' : ''}
          {accentWord && <span style={{ color: accent }}>{accentWord}</span>}
        </h2>
        {subtitle && (
          <p className={`${TYPE.subtitle} mt-0.5`} style={{ color: TEXT.muted }}>
            {subtitle}
          </p>
        )}
      </div>
      {badge != null && (
        <div className={`${TYPE.badge} pt-1`} style={{ color: TEXT.ghost }}>
          {badge}
        </div>
      )}
    </div>
  );
}

// ── SectionLabel — the uppercase tracking-widest mini-heading ─────────────────
export function SectionLabel({ children, accent, className = '' }:
  { children: React.ReactNode; accent?: string; className?: string }) {
  return (
    <div className={`${TYPE.sectionLabel} ${className}`}
      style={{ color: accent ?? TEXT.secondary }}>
      {children}
    </div>
  );
}

// ── SimTabs — underline tab selector ─────────────────────────────────────────
export interface TabDef { key: string; label: string; sub?: string }
export function SimTabs({ tabs, active, onChange, accent = ACCENT }:
  { tabs: TabDef[]; active: string; onChange: (k: string) => void; accent?: string }) {
  return (
    <div className="flex mb-5 flex-wrap" style={{ borderBottom: `1px solid ${BORDER.divider}` }}>
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            className="px-4 py-3 text-left transition-all"
            style={{ background: 'none', outline: 'none', marginBottom: -1,
              borderBottom: `2px solid ${on ? accent : BORDER.divider}`, opacity: on ? 1 : 0.55 }}>
            <div className="text-sm font-bold" style={{ color: on ? accent : TEXT.secondary }}>
              {t.label}
            </div>
            {t.sub && <div className="text-xs" style={{ color: TEXT.muted }}>{t.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

// ── StepBar — phase-navigation pills ─────────────────────────────────────────
// The pill label is the ONE sanctioned font-black-at-small-size use in the
// whole sim system (workflow §2). It's encapsulated here so no sim reproduces
// it. `done` steps are clickable; future steps are inert.
export interface StepDef { id: string; label: string }
export function StepBar({ steps, currentId, onGo, accent = ACCENT }:
  { steps: StepDef[]; currentId: string; onGo?: (id: string) => void; accent?: string }) {
  const currentIndex = steps.findIndex((s) => s.id === currentId);
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {steps.map((s, i) => {
        const active = s.id === currentId, done = i < currentIndex;
        return (
          <button key={s.id} onClick={() => done && onGo?.(s.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
            style={{
              background: active ? accentTint(accent, 0.15) : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? accentTint(accent, 0.45) : done ? 'rgba(52,211,153,0.25)' : BORDER.card}`,
              color: active ? accent : done ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
              cursor: done ? 'pointer' : 'default',
            }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: active ? accentTint(accent, 0.9) : done ? '#059669' : 'rgba(255,255,255,0.06)', color: active ? '#0d1117' : 'white' }}>
              {done ? '✓' : i + 1}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── NavButtons — Back / Next ─────────────────────────────────────────────────
export function NavButtons({ onBack, onNext, nextLabel = 'Next →', backLabel = '← Back',
  showBack = true, showNext = true, accent = ACCENT }:
  { onBack?: () => void; onNext?: () => void; nextLabel?: string; backLabel?: string;
    showBack?: boolean; showNext?: boolean; accent?: string }) {
  return (
    <div className="flex justify-between items-center pt-2">
      {showBack ? (
        <button onClick={onBack} className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: TEXT.secondary }}>
          {backLabel}
        </button>
      ) : <span />}
      {showNext && (
        <button onClick={onNext} className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ background: accentTint(accent, 0.18), border: `1px solid ${accentTint(accent, 0.4)}`, color: accent }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}

// ── SimSlider — labeled range input with a tabular-nums value readout ─────────
export function SimSlider({ label, value, min, max, step, onChange, unit = '', accent = ACCENT, disabled, format }:
  { label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; unit?: string; accent?: string; disabled?: boolean;
    format?: (v: number) => string }) {
  return (
    <div className="flex items-center gap-3" style={{ opacity: disabled ? 0.4 : 1 }}>
      <div style={{ minWidth: 88, fontSize: 12, fontWeight: 600, color: accent }}>{label}</div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} disabled={disabled}
        className="flex-1" style={{ accentColor: accent, cursor: disabled ? 'not-allowed' : 'pointer' }} />
      <div className="tabular-nums" style={{ minWidth: 70, textAlign: 'right', fontSize: 13, fontWeight: 700, color: accent }}>
        {format ? format(value) : value}
        {unit && <span style={{ color: TEXT.ghost, fontWeight: 500 }}> {unit}</span>}
      </div>
    </div>
  );
}

// ── ExpertTip — the calm closing note (toned-down per 2026-07-23) ────────────
export function ExpertTip({ children, accent = ACCENT }:
  { children: React.ReactNode; accent?: string }) {
  return (
    <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
      <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: accent }}>Expert Tip</div>
      <p className={TYPE.expertTip} style={{ color: TEXT.primary }}>{children}</p>
    </div>
  );
}
