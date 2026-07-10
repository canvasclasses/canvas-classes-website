'use client';

import { useEffect, useState } from 'react';
import {
  BITSAT_ACCENT,
  DISPLAY_FONT,
  MONO_FONT,
  PANEL_BG,
  PANEL_BORDER,
  SectionLabel,
  StatCard,
} from './ui';

interface HistogramBucket {
  label: string;
  from: number;
  to: number;
  count: number;
}
interface ScoreAnalytics {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  p90: number;
  p95: number;
  maxScore: number;
  bucketSize: number;
  histogram: HistogramBucket[];
}
interface BranchAllotmentCount {
  branch: string;
  count: number;
}
interface SessionStats {
  bothCount: number;
  improvedInS2: number;
  avgUplift: number;
  avgS1: number;
  avgS2: number;
}
interface Bundle {
  analytics: ScoreAnalytics;
  branches: BranchAllotmentCount[];
  sessions: SessionStats | null;
}

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: Bundle };

const YOU_COLOR = '#38bdf8';

// % of candidates scoring at or below `score`, estimated from the histogram.
function shareBelow(histogram: HistogramBucket[], total: number, score: number) {
  if (total <= 0) return { pct: 0, count: 0 };
  let below = 0;
  for (const b of histogram) {
    if (score > b.to) {
      below += b.count;
      continue;
    }
    if (score >= b.from && score <= b.to) {
      const span = b.to - b.from + 1;
      below += b.count * ((score - b.from + 1) / span);
      break;
    }
    break;
  }
  return { pct: Math.max(0, Math.min(100, (below / total) * 100)), count: Math.round(below) };
}

const clampPct = (n: number) => Math.min(100, Math.max(0, n));

export default function BitsatScoreAnalytics() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v2/bitsat/score-stats')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.success && json.analytics) {
          setState({
            status: 'ready',
            data: {
              analytics: json.analytics,
              branches: Array.isArray(json.branches) ? json.branches : [],
              sessions: json.sessions ?? null,
            },
          });
        } else setState({ status: 'error' });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-6 text-center">
        <SectionLabel>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
            Live · candidate scores
          </span>
        </SectionLabel>
        <h2 className="mt-2" style={{ fontFamily: DISPLAY_FONT, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Where this year&apos;s scores landed
        </h2>
      </div>

      {state.status === 'loading' && <LoadingSkeleton />}
      {state.status === 'error' && (
        <Empty message="Score analytics are temporarily unavailable. Please try again in a bit." />
      )}
      {state.status === 'ready' && state.data.analytics.count === 0 && (
        <Empty message="No candidate scores have come in yet. This fills up as students submit their scorecards." />
      )}
      {state.status === 'ready' && state.data.analytics.count > 0 && <Ready bundle={state.data} />}
    </div>
  );
}

function Ready({ bundle }: { bundle: Bundle }) {
  const { analytics: a, branches, sessions } = bundle;
  const [raw, setRaw] = useState('');
  const yourNum = parseInt(raw, 10);
  const youValid = !Number.isNaN(yourNum) && yourNum >= 0 && yourNum <= a.maxScore;
  const you = youValid ? shareBelow(a.histogram, a.count, yourNum) : null;

  const peak = Math.max(...a.histogram.map((b) => b.count), 1);
  const meanPct = clampPct((a.mean / a.maxScore) * 100);
  const youPct = youValid ? clampPct((yourNum / a.maxScore) * 100) : null;

  return (
    <>
      {/* KPIs */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Scores in" value={a.count.toLocaleString('en-IN')} />
        <StatCard label="Average" value={a.mean} accent sub={`out of ${a.maxScore}`} />
        <StatCard label="Median" value={a.median} sub={`out of ${a.maxScore}`} />
        <StatCard label="90th pct" value={a.p90} sub="top 10% above" />
        <StatCard label="95th pct" value={a.p95} sub="top 5% above" />
        <StatCard label="Highest" value={a.max} accent sub={`out of ${a.maxScore}`} />
      </div>

      <p className="mb-6 text-center text-[13px] text-zinc-400">
        The middle 50% of candidates scored between{' '}
        <b className="tabular-nums text-zinc-200">{a.p25}</b> and{' '}
        <b className="tabular-nums text-zinc-200">{a.p75}</b>
        <span className="text-zinc-600"> · full range {a.min}–{a.max}</span>
      </p>

      {/* Two-up: distribution + cumulative curve */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Score distribution" sub={`per ${a.bucketSize}-mark band`}>
          <div className="relative mt-6 h-[210px]">
            <Marker pct={meanPct} color={BITSAT_ACCENT} label={`avg ${a.mean}`} align="top" />
            {youPct != null && <Marker pct={youPct} color={YOU_COLOR} label={`you ${yourNum}`} align="bottom" />}
            <div className="flex h-[180px] items-end gap-[3px]">
              {a.histogram.map((b) => {
                const h = b.count === 0 ? 1 : Math.max(3, (b.count / peak) * 100);
                const share = a.count > 0 ? Math.round((b.count / a.count) * 100) : 0;
                const inYou = youValid && yourNum >= b.from && yourNum <= b.to;
                return (
                  <div
                    key={b.label}
                    className="group relative flex-1"
                    style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}
                    title={`${b.label}: ${b.count.toLocaleString('en-IN')} (${share}%)`}
                  >
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${h}%`,
                        background:
                          b.count === 0
                            ? 'rgba(255,255,255,0.05)'
                            : inYou
                              ? `linear-gradient(180deg, ${YOU_COLOR}, #0369a1)`
                              : `linear-gradient(180deg, ${BITSAT_ACCENT}, #b45309)`,
                        opacity: b.count === 0 ? 1 : 0.92,
                      }}
                    />
                    {b.count > 0 && (
                      <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] tabular-nums text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {b.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <AxisTicks histogram={a.histogram} />
          </div>
        </Panel>

        <Panel title="Cumulative percentile" sub="% scoring at or below a score">
          <CumulativeCurve histogram={a.histogram} count={a.count} maxScore={a.maxScore} you={youValid ? yourNum : null} />
        </Panel>
      </div>

      {/* Where do you stand? */}
      <div
        className="mt-4 flex flex-col items-center gap-4 rounded-2xl p-5 text-center sm:flex-row sm:justify-center sm:gap-8 sm:p-6"
        style={{ background: PANEL_BG, border: PANEL_BORDER }}
      >
        <div className="sm:text-left">
          <SectionLabel>Where do you stand?</SectionLabel>
          <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
            <input
              type="text"
              inputMode="numeric"
              value={raw}
              onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
              placeholder="Your score"
              className="w-32 cursor-text rounded-lg bg-black/40 px-3 py-2 text-center tabular-nums text-white outline-none placeholder:text-zinc-600 focus:border-orange-500/50 sm:text-left"
              style={{ border: '1px solid rgba(255,255,255,0.1)', fontFamily: DISPLAY_FONT, fontSize: 22, fontWeight: 700 }}
              aria-label="Your BITSAT score"
            />
            <span style={{ fontFamily: MONO_FONT }} className="text-sm text-zinc-500">
              / {a.maxScore}
            </span>
          </div>
        </div>
        <div className="min-h-[44px] sm:flex-1 sm:text-left">
          {raw === '' ? (
            <p className="text-[13px] text-zinc-500">
              Enter your BITSAT score to see your percentile and where it lands on both charts above.
            </p>
          ) : !youValid ? (
            <p className="text-[13px] text-rose-300/80">Enter a score between 0 and {a.maxScore}.</p>
          ) : (
            <p className="text-[15px] leading-relaxed text-zinc-200">
              You&apos;d score higher than{' '}
              <b style={{ color: YOU_COLOR }} className="tabular-nums">
                ~{Math.round(you!.pct)}%
              </b>{' '}
              of candidates
              <span className="text-zinc-500">
                {' '}
                — ahead of about {you!.count.toLocaleString('en-IN')} of {a.count.toLocaleString('en-IN')}.
              </span>
              {yourNum >= a.p90 && <span className="text-emerald-400"> That&apos;s top-10% territory.</span>}
            </p>
          )}
        </div>
      </div>

      {/* Branch allotment + session uplift */}
      {(branches.length > 0 || sessions) && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {branches.length > 0 && <BranchBreakdown branches={branches} />}
          {sessions && <SessionUplift s={sessions} maxScore={a.maxScore} />}
        </div>
      )}

      <p className="mx-auto mt-5 max-w-xl text-center text-xs text-zinc-500">
        Scores are self-reported by candidates and sourced from a third-party aggregator. Percentiles are
        estimated from the distribution — treat as indicative, not official.
      </p>
    </>
  );
}

// ── Cumulative percentile (CDF) curve ────────────────────────────────────────
function CumulativeCurve({
  histogram,
  count,
  maxScore,
  you,
}: {
  histogram: HistogramBucket[];
  count: number;
  maxScore: number;
  you: number | null;
}) {
  const W = 1000;
  const H = 240;
  const padT = 8;
  const padB = 8;
  const innerH = H - padT - padB;
  const xOf = (s: number) => (s / maxScore) * W;
  const yOf = (frac: number) => padT + (1 - frac) * innerH;

  let cum = 0;
  const pts = [{ x: xOf(0), y: yOf(0) }];
  for (const b of histogram) {
    cum += b.count;
    const frac = count > 0 ? cum / count : 0;
    pts.push({ x: xOf(Math.min(maxScore, b.to + 1)), y: yOf(frac) });
  }
  const line = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const area = `${line} L ${xOf(maxScore)} ${yOf(0)} L ${xOf(0)} ${yOf(0)} Z`;
  const youFrac = you != null ? shareBelow(histogram, count, you).pct / 100 : null;
  const gradId = 'cumGrad';

  return (
    <div className="relative mt-6">
      <div className="relative h-[190px] w-full">
        {/* y labels */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col justify-between py-[6px] text-[9px] text-zinc-600" style={{ fontFamily: MONO_FONT }}>
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height="190" className="overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BITSAT_ACCENT} stopOpacity="0.28" />
              <stop offset="100%" stopColor={BITSAT_ACCENT} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* gridlines at 25/50/75% */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={0}
              x2={W}
              y1={yOf(f)}
              y2={yOf(f)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill={`url(#${gradId})`} />
          <path d={line} fill="none" stroke={BITSAT_ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {youFrac != null && you != null && (
            <>
              <line
                x1={xOf(you)}
                x2={xOf(you)}
                y1={padT}
                y2={H - padB}
                stroke={YOU_COLOR}
                strokeWidth="1.5"
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={xOf(you)} cy={yOf(youFrac)} r="4" fill={YOU_COLOR} vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>
      </div>
      {/* x ticks */}
      <div className="mt-1 flex justify-between pl-7 text-[9.5px] text-zinc-600" style={{ fontFamily: MONO_FONT }}>
        <span>0</span>
        <span>{Math.round(maxScore / 2)}</span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
}

// ── Branch allotment breakdown ───────────────────────────────────────────────
function BranchBreakdown({ branches }: { branches: BranchAllotmentCount[] }) {
  const total = branches.reduce((s, b) => s + b.count, 0);
  const peak = Math.max(...branches.map((b) => b.count), 1);
  return (
    <Panel title="Most common allotments" sub="where reported candidates were placed">
      <div className="mt-4 space-y-2">
        {branches.map((b) => {
          const share = total > 0 ? Math.round((b.count / total) * 100) : 0;
          return (
            <div key={b.branch} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate text-right text-[12px] text-zinc-300" title={b.branch}>
                {b.branch}
              </div>
              <div className="h-5 flex-1 overflow-hidden rounded bg-white/5">
                <div
                  className="h-full rounded"
                  style={{ width: `${(b.count / peak) * 100}%`, background: `linear-gradient(90deg, ${BITSAT_ACCENT}, #b45309)` }}
                />
              </div>
              <div className="w-16 shrink-0 text-[11px] tabular-nums text-zinc-400">
                {b.count.toLocaleString('en-IN')} <span className="text-zinc-600">({share}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ── Session 1 vs Session 2 uplift ────────────────────────────────────────────
function SessionUplift({ s, maxScore }: { s: SessionStats; maxScore: number }) {
  const improvedPct = s.bothCount > 0 ? Math.round((s.improvedInS2 / s.bothCount) * 100) : 0;
  const bar = (label: string, val: number, color: string) => (
    <div className="flex items-center gap-3">
      <div className="w-7 shrink-0 text-[12px] font-semibold text-zinc-400">{label}</div>
      <div className="h-6 flex-1 overflow-hidden rounded bg-white/5">
        <div className="h-full rounded" style={{ width: `${(val / maxScore) * 100}%`, background: color }} />
      </div>
      <div className="w-10 shrink-0 text-right text-[13px] font-semibold tabular-nums text-zinc-200">{val}</div>
    </div>
  );
  return (
    <Panel title="Session 1 → Session 2" sub="for candidates who attempted both">
      <div className="mt-4 space-y-2.5">
        {bar('S1', s.avgS1, 'linear-gradient(90deg, #64748b, #475569)')}
        {bar('S2', s.avgS2, `linear-gradient(90deg, ${BITSAT_ACCENT}, #b45309)`)}
      </div>
      <p className="mt-4 text-center text-[12.5px] text-zinc-400">
        <b className="text-zinc-200 tabular-nums">{improvedPct}%</b> of the{' '}
        <span className="tabular-nums">{s.bothCount.toLocaleString('en-IN')}</span> who took both improved in S2
        {s.avgUplift > 0 && (
          <>
            {' '}
            — by <b className="text-emerald-400 tabular-nums">+{s.avgUplift}</b> on average
          </>
        )}
        .
      </p>
    </Panel>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────────
function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: PANEL_BG, border: PANEL_BORDER }}>
      <div className="text-center">
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: 16, fontWeight: 600 }}>{title}</div>
        {sub && (
          <div style={{ fontFamily: MONO_FONT }} className="mt-0.5 text-[11px] text-zinc-500">
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Marker({ pct, color, label, align }: { pct: number; color: string; label: string; align: 'top' | 'bottom' }) {
  return (
    <div className="pointer-events-none absolute bottom-7 top-0 z-10 border-l border-dashed" style={{ left: `${pct}%`, borderColor: color }}>
      <span
        className="absolute -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold"
        style={{
          background: color,
          color: '#0a0a0f',
          fontFamily: MONO_FONT,
          left: pct > 85 ? '-4px' : '50%',
          top: align === 'top' ? '-2px' : undefined,
          bottom: align === 'bottom' ? '34px' : undefined,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function AxisTicks({ histogram }: { histogram: HistogramBucket[] }) {
  return (
    <div className="mt-2 flex gap-[3px]">
      {histogram.map((b, i) => (
        <div key={b.label} className="flex-1 text-center">
          {i % 3 === 0 && (
            <span style={{ fontFamily: MONO_FONT }} className="text-[9.5px] tabular-nums text-zinc-600">
              {b.from}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[92px] animate-pulse rounded-2xl border border-white/5 bg-[#0B0F15]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-[290px] animate-pulse rounded-2xl border border-white/5 bg-[#0B0F15]" />
        <div className="h-[290px] animate-pulse rounded-2xl border border-white/5 bg-[#0B0F15]" />
      </div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
      style={{ background: PANEL_BG, border: PANEL_BORDER }}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b6b76" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 19V11M10 19V7M16 19v-5M22 19H2" />
        </svg>
      </div>
      <div className="max-w-sm text-sm text-zinc-400">{message}</div>
    </div>
  );
}
