'use client';

// Shared visual primitives for the Claude Design lower sections
// (input-section.jsx + results-section.jsx from the handoff bundle).
//
// Kept in one file because they're tightly co-evolved with the design's
// inline-style approach. Splitting them would create a 12-import-line header
// in every consumer. When a primitive grows past ~80 lines or starts being
// imported outside this design module, move it out.

import { useEffect, useRef, useState } from 'react';

export const ACCENT = '#f59e0b';

// ── Minimal stroke icon set, shared across feature cards + form ──────────────
export const Icons = {
  target: (c: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  list: (c: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
      <path d="M3 6h14M3 12h14M3 18h10" strokeLinecap="round" />
      <circle cx="20" cy="6" r="1.3" fill={c} stroke="none" />
      <circle cx="20" cy="12" r="1.3" fill={c} stroke="none" />
    </svg>
  ),
  share: (c: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.2 11 L15.8 7" strokeLinecap="round" />
      <path d="M8.2 13 L15.8 17" strokeLinecap="round" />
    </svg>
  ),
  refresh: (c: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
      <path d="M20 11a8 8 0 0 0-13.6-4.4L4 9" strokeLinecap="round" />
      <path d="M4 13a8 8 0 0 0 13.6 4.4L20 15" strokeLinecap="round" />
      <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  caret: (c?: string) => (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={c || 'currentColor'} strokeWidth="1.6">
      <path d="M3 4.5 L6 7.5 L9 4.5" strokeLinecap="round" />
    </svg>
  ),
  bolt: (c: string) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill={c}>
      <path d="M7.5 1 L3 8 L6 8 L5.5 13 L10 6 L7 6 Z" />
    </svg>
  ),
  warn: (c: string) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.6">
      <path d="M8 2 L14.5 13 H1.5 Z" strokeLinejoin="round" />
      <path d="M8 6.5 V9.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.6" fill={c} stroke="none" />
    </svg>
  ),
  arrow: (c?: string) => (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c || 'currentColor'} strokeWidth="1.6">
      <path d="M2 7 H11 M8 4 L11 7 L8 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── Section head — eyebrow pill + 2-line title + sub ─────────────────────────
export function SectionHead({
  eyebrow,
  titlePlain,
  titleAccent,
  sub,
}: {
  eyebrow: string;
  titlePlain: string;
  titleAccent: string;
  sub: string;
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: '#9a9aa6',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          marginBottom: 16,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT }} />
        {eyebrow}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 'clamp(34px, 4vw, 56px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.02,
          color: '#f5f5f7',
        }}
      >
        {titlePlain}
        <br />
        <span
          style={{
            backgroundImage: `linear-gradient(90deg, ${ACCENT} 0%, #fbbf24 50%, ${ACCENT} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
          }}
        >
          {titleAccent}
        </span>
      </h2>
      <p
        style={{
          margin: '16px auto 0',
          maxWidth: 620,
          color: '#9a9aa6',
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        {sub}
      </p>
    </div>
  );
}

// ── Trust row — accuracy pill + beta warning ─────────────────────────────────
export function TrustRow() {
  return (
    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
      <a
        href="/college-predictor/validation"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          borderRadius: 999,
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(52,211,153,0.3)',
          color: '#34d399',
          fontSize: 13,
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#34d399',
            boxShadow: '0 0 10px #34d399',
          }}
        />
        <span style={{ color: '#a7f3d0', fontWeight: 700 }}>90.5% Safe-bucket accuracy</span>
        <span style={{ color: '#34d39988' }}>·</span>
        <span>backtested on 3 years</span>
        <span style={{ marginLeft: 4 }}>{Icons.arrow('#34d399')}</span>
      </a>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          borderRadius: 999,
          background: 'rgba(250,204,21,0.06)',
          border: '1px solid rgba(250,204,21,0.3)',
          color: '#facc15',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {Icons.warn('#facc15')}
        <span style={{ color: '#fde68a', fontWeight: 700 }}>Public beta</span>
        <span style={{ color: '#facc1588' }}>·</span>
        <span>cross-check with official JoSAA before finalising</span>
      </div>
    </div>
  );
}

// ── Feature card — numbered + iconned ─────────────────────────────────────────
export interface Feature {
  n: string;
  icon: keyof typeof Icons;
  color: string;
  title: string;
  desc: string;
}

export function FeatureCard({ f }: { f: Feature }) {
  const icon = Icons[f.icon] as (c: string) => React.ReactElement;
  return (
    <div
      style={{
        position: 'relative',
        padding: '22px 22px 24px',
        borderRadius: 18,
        background: 'linear-gradient(180deg, rgba(20,22,34,0.65), rgba(12,13,22,0.6))',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        transition: 'transform 0.25s, border-color 0.25s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* top accent line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${f.color}88, transparent)`,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: '#5e5e6a',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          {f.n}
        </span>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${f.color}14`,
            border: `1px solid ${f.color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon(f.color)}
        </div>
      </div>
      <div
        style={{
          color: '#f5f5f7',
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: '-0.015em',
          marginBottom: 8,
        }}
      >
        {f.title}
      </div>
      <div style={{ color: '#9a9aa6', fontSize: 13.5, lineHeight: 1.55 }}>{f.desc}</div>
    </div>
  );
}

// ── Big numeric input with slider + quick-pick chips ─────────────────────────
export function NumberWithSlider({
  label,
  sublabel,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  ticks,
}: {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  ticks?: { value: number; label: string }[];
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const onSliderDown = (e: React.MouseEvent | React.TouchEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const update = (clientX: number) => {
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const v = Math.round((min + pct * (max - min)) / step) * step;
      onChange(v);
    };
    const initialX =
      'clientX' in e ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).touches?.[0]?.clientX ?? 0;
    update(initialX);
    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'clientX' in ev ? (ev as MouseEvent).clientX : (ev as TouchEvent).touches?.[0]?.clientX ?? 0;
      update(cx);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove as EventListener);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove as EventListener);
    window.addEventListener('touchend', onUp);
  };

  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <label
          style={{
            color: '#9a9aa6',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.16em',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </label>
        {sublabel && <span style={{ color: '#5e5e6a', fontSize: 11.5 }}>{sublabel}</span>}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '16px 20px',
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString('en-IN')}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/[^\d]/g, ''), 10);
            onChange(isNaN(n) ? 0 : Math.min(max, Math.max(min, n)));
          }}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f5f5f7',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
            padding: 0,
          }}
        />
        {suffix && (
          <span
            style={{
              color: '#5e5e6a',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.06em',
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      <div style={{ marginTop: 14, position: 'relative' }}>
        <div
          ref={sliderRef}
          onMouseDown={onSliderDown}
          onTouchStart={onSliderDown}
          style={{
            position: 'relative',
            height: 10,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 999,
            cursor: 'grab',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pct * 100}%`,
              background: `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
              borderRadius: 999,
              boxShadow: `0 0 14px ${ACCENT}44`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `calc(${pct * 100}% - 9px)`,
              top: -4,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fff',
              border: `2px solid ${ACCENT}`,
              boxShadow: `0 4px 12px ${ACCENT}88, 0 0 0 5px ${ACCENT}22`,
            }}
          />
        </div>
        {ticks && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {ticks.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => onChange(t.value)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 7,
                  border:
                    value === t.value
                      ? `1px solid ${ACCENT}80`
                      : '1px solid rgba(255,255,255,0.08)',
                  background: value === t.value ? `${ACCENT}15` : 'rgba(255,255,255,0.025)',
                  color: value === t.value ? ACCENT : '#9a9aa6',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Segmented selector — pill row of mutually-exclusive chips ────────────────
export function Seg<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <div
        style={{
          color: '#9a9aa6',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.16em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              style={{
                padding: '9px 14px',
                borderRadius: 10,
                border: active ? `1px solid ${ACCENT}80` : '1px solid rgba(255,255,255,0.08)',
                background: active ? `${ACCENT}15` : 'rgba(255,255,255,0.02)',
                color: active ? '#fff' : '#cfcfd6',
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Dropdown ────────────────────────────────────────────────────────────────
export function Dropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <div
        style={{
          color: '#9a9aa6',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.16em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '11px 36px 11px 14px',
          color: '#f5f5f7',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            appearance: 'none',
            background: 'transparent',
            border: 'none',
            color: '#f5f5f7',
            fontFamily: 'inherit',
            fontSize: 14,
            width: '100%',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ background: '#0a0a0f' }}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          {Icons.caret('#9a9aa6')}
        </span>
      </div>
    </div>
  );
}

// ── Canonical Safe / Target / Reach definitions ─────────────────────────────
// These are the same plain-English strings used by tooltips on bucket badges
// in result rows. Single source of truth so the page never disagrees with
// itself about what each bucket means.
export const BUCKET_DEFINITIONS: Record<'SAFE' | 'TARGET' | 'REACH', string> = {
  SAFE:
    'Past years closed comfortably in your favor. The cutoff would have to spike unusually for you to miss out.',
  TARGET:
    'Past cutoffs sit right around your input. The outcome swings with this year’s exam difficulty.',
  REACH:
    'Past cutoffs closed tighter than your input. Possible only if cutoffs loosen this year.',
};

// ── "What you'll get back" sidebar card ─────────────────────────────────────
// Now carries explicit definitions for each bucket — students kept asking
// "what does Safe actually mean?" so the sidebar earns its keep by defining
// them instead of just naming the chips.
export function ReturnsCard({ exam }: { exam: 'jee' | 'bitsat' }) {
  const dataLine =
    exam === 'jee'
      ? 'Compared against 5 years of JoSAA closing ranks across 31 NITs, 26 IIITs and 38 GFTIs. Quota-aware: HS / OS / AI matched to your home state.'
      : 'Score compared to 4 years of final BITSAT closing scores at Pilani, Goa and Hyderabad. BITS has no category quotas — every result is open-merit.';
  const buckets = [
    { key: 'SAFE',   color: '#34d399', def: BUCKET_DEFINITIONS.SAFE   },
    { key: 'TARGET', color: '#fbbf24', def: BUCKET_DEFINITIONS.TARGET },
    { key: 'REACH',  color: '#7dd3fc', def: BUCKET_DEFINITIONS.REACH  },
  ] as const;
  return (
    <div
      style={{
        padding: '26px',
        borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(20,22,34,0.4), rgba(12,13,22,0.5))',
        border: '1px solid rgba(255,255,255,0.05)',
        borderLeft: '1px dashed rgba(255,255,255,0.08)',
        height: '100%',
      }}
    >
      <div
        style={{
          color: '#9a9aa6',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.16em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 14,
        }}
      >
        OUTPUT
      </div>
      <h4
        style={{
          margin: '0 0 6px',
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '-0.015em',
          color: '#f5f5f7',
        }}
      >
        What each bucket means
      </h4>
      <p style={{ margin: '0 0 16px', color: '#7d7d88', fontSize: 12.5, lineHeight: 1.5 }}>
        Every programme bucketed by how comfortably your input clears the projected cutoff.
      </p>

      {/* Bucket definitions — one row per bucket */}
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {buckets.map((b) => (
          <li key={b.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span
              style={{
                flex: '0 0 auto',
                padding: '3px 9px',
                borderRadius: 6,
                background: `${b.color}14`,
                border: `1px solid ${b.color}44`,
                color: b.color,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.16em',
                marginTop: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {b.key}
            </span>
            <span style={{ color: '#cfcfd6', fontSize: 12.5, lineHeight: 1.5 }}>{b.def}</span>
          </li>
        ))}
      </ul>

      {/* Data-source line */}
      <p
        style={{
          margin: '18px 0 0',
          paddingTop: 16,
          borderTop: '1px dashed rgba(255,255,255,0.06)',
          color: '#7d7d88',
          fontSize: 12,
          lineHeight: 1.55,
        }}
      >
        {dataLine}
      </p>
    </div>
  );
}

// ── Confidence dots (3-step indicator) ──────────────────────────────────────
export function ConfidenceDots({ level }: { level: 'low' | 'medium' | 'high' }) {
  const n = { low: 1, medium: 2, high: 3 }[level] || 0;
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: i < n ? '#cfcfd6' : 'rgba(255,255,255,0.12)',
          }}
        />
      ))}
      <span style={{ color: '#7d7d88', fontSize: 11.5, fontWeight: 500, marginLeft: 4 }}>{level}</span>
    </span>
  );
}

// ── Mini sparkline — 5 points, last one projected (dashed orange) ───────────
export function Sparkline({
  data,
  width = 90,
  height = 28,
}: {
  data: number[];
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const pad = 2;
  const stepX = (width - 2 * pad) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * stepX, height - pad - ((v - min) / range) * (height - 2 * pad)] as [number, number]);
  const historicalPath = pts
    .slice(0, -1)
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(' ');
  const lastHist = pts[pts.length - 2];
  const lastProj = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <path
        d={historicalPath}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${lastHist[0]} ${lastHist[1]} L ${lastProj[0]} ${lastProj[1]}`}
        stroke={ACCENT}
        strokeWidth="1.4"
        strokeDasharray="2 2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={lastProj[0]} cy={lastProj[1]} r="1.8" fill={ACCENT} />
    </svg>
  );
}

// ── Audience pill toggle (Student / Parent) ─────────────────────────────────
export function AudienceToggle({
  value,
  onChange,
}: {
  value: 'student' | 'parent';
  onChange: (v: 'student' | 'parent') => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          color: '#5e5e6a',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.16em',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        SHOWING FOR
      </span>
      <div
        style={{
          display: 'inline-flex',
          padding: 4,
          gap: 2,
          borderRadius: 999,
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {([
          { id: 'student', label: 'Student', icon: '🎓' },
          { id: 'parent', label: 'Parent', icon: '👪' },
        ] as const).map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '6px 13px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: active ? `linear-gradient(180deg, ${ACCENT}, #f97316)` : 'transparent',
                color: active ? '#0a0a0f' : '#cfcfd6',
                fontSize: 12.5,
                fontWeight: active ? 700 : 500,
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: active ? `0 6px 14px -8px ${ACCENT}aa` : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 11, opacity: active ? 0.8 : 0.6 }}>{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Bucket palette — used by ResultRow + filter chips ────────────────────────
export const BUCKET_COLOR: Record<'SAFE' | 'TARGET' | 'REACH', { fg: string; bg: string; border: string }> = {
  SAFE: { fg: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(52,211,153,0.4)' },
  TARGET: { fg: '#fb923c', bg: 'rgba(245,158,11,0.08)', border: 'rgba(251,146,60,0.4)' },
  REACH: { fg: '#7dd3fc', bg: 'rgba(56,189,248,0.08)', border: 'rgba(125,211,252,0.4)' },
};

// ── Plain-English chance label for parent view ──────────────────────────────
export function chanceToWords(pct: number): string {
  if (pct >= 95) return 'Almost certain';
  if (pct >= 80) return 'Very likely';
  if (pct >= 60) return 'Likely';
  if (pct >= 35) return 'Possible';
  return 'Outside chance';
}

// Suppress unused-var warning for useEffect/useState imports we re-export
// indirectly through the primitives.
export const __keepImports = { useEffect, useState };
