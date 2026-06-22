// Shared visual atoms for the /bitsat surfaces. Matches the site's predictor
// design language (Space Grotesk display + JetBrains Mono labels, amber accent
// on near-black, gradient card surfaces). Pure presentational — no hooks.

import type { ReactNode } from 'react';

export const BITSAT_ACCENT = '#f59e0b';
// Driven by next/font CSS variables defined on the /bitsat <main> (see
// app/bitsat/page.tsx), with literal-name + system fallbacks.
export const DISPLAY_FONT = "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif";
export const MONO_FONT = "var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace";

// Card surface used across cutoffs + analytics panels.
export const PANEL_BG =
  'linear-gradient(180deg, rgba(20,22,34,0.65), rgba(12,13,22,0.55))';
export const PANEL_BORDER = '1px solid rgba(255,255,255,0.06)';

/** Atmospheric hero backdrop — amber aurora + faint masked grid. CSS only. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-48 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', opacity: 0.16 }}
      />
      <div
        className="absolute -right-32 top-8 h-[380px] w-[440px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)', opacity: 0.1 }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 72%)',
        }}
      />
    </div>
  );
}

/** Mono uppercase chip with an accent dot. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 uppercase"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        color: '#9a9aa6',
        fontFamily: MONO_FONT,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.16em',
      }}
    >
      <span
        className="h-[5px] w-[5px] rounded-full"
        style={{ background: BITSAT_ACCENT, boxShadow: `0 0 8px ${BITSAT_ACCENT}` }}
      />
      {children}
    </span>
  );
}

/** Small mono section label (e.g. "ENGINEERING — B.E."). */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-center uppercase"
      style={{
        fontFamily: MONO_FONT,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.18em',
        color: '#6b6b76',
      }}
    >
      {children}
    </div>
  );
}

/** Headline KPI tile. */
export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl p-4 text-center sm:p-5" style={{ background: PANEL_BG, border: PANEL_BORDER }}>
      <div
        className="uppercase"
        style={{ fontFamily: MONO_FONT, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', color: '#6b6b76' }}
      >
        {label}
      </div>
      <div
        className="mt-2 tabular-nums"
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 30,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: accent ? BITSAT_ACCENT : '#f5f5f7',
        }}
      >
        {value}
      </div>
      {sub != null && <div className="mt-1.5 text-[12px] leading-snug text-zinc-500">{sub}</div>}
    </div>
  );
}

/** ▲/▼ year-over-year delta badge. */
export function TrendDelta({ delta }: { delta: number | null }) {
  if (delta == null) return <span className="text-zinc-700">·</span>;
  if (delta === 0) return <span className="text-[11px] tabular-nums text-zinc-500">±0</span>;
  const up = delta > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums"
      style={{ color: up ? '#34d399' : '#fb7185' }}
    >
      {up ? '▲' : '▼'}
      {Math.abs(delta)}
    </span>
  );
}

/** Plain multi-point sparkline (green if net-rising, rose if falling). */
export function MiniTrend({
  values,
  width = 58,
  height = 22,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  const pts = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (pts.length < 2) return <svg width={width} height={height} aria-hidden />;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = Math.max(1, max - min);
  const pad = 3;
  const stepX = (width - 2 * pad) / (pts.length - 1);
  const coords = pts.map(
    (v, i) => [pad + i * stepX, height - pad - ((v - min) / range) * (height - 2 * pad)] as [number, number],
  );
  const d = coords.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  const last = coords[coords.length - 1];
  const col = pts[pts.length - 1] >= pts[0] ? '#34d399' : '#fb7185';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden>
      <path d={d} fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={col} />
    </svg>
  );
}
