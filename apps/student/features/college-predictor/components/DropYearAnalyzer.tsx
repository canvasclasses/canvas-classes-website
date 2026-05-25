'use client';

import { useEffect, useState } from 'react';

// Drop-year scenario-planning modal, redesigned from the Claude Design
// handoff bundle (`drop-year-modal.jsx`).
//
// Visual structure:
//   - Eyebrow chip "● SCENARIO PLANNING" (purple)
//   - Big title + plain-English subtitle that explicitly says we can't
//     predict YOUR improvement
//   - Distribution strip — your current score/rank with 5 percentile
//     markers along a gradient track
//   - 5 colour-coded scenario cards in a row (or stacked on mobile)
//   - Cost callout — yellow-bordered "Before you decide…" panel
//   - Methodology disclosure
//   - Footer actions
//
// Labels are simpler than the original ("plateau" → "About the same",
// "Top decile" → "Best case") because the tier-2/3 parents who are the
// decision-makers don't think in statistical jargon.

type Tone = 'rose' | 'amber' | 'sky' | 'emerald' | 'purple';

interface Scenario {
  id: string;
  label: string;
  frequency: string;
  percentile: number;
  rank_multiplier?: number;
  score_delta?: number;
  narrative: string;
  tone: Tone;
}

interface ScenarioOutcome {
  scenario: Scenario;
  target_rank?: number;
  target_score?: number;
  counts: { safe: number; target: number; reach: number };
  top_unlocks: Array<{ title: string; subtitle: string; nirf?: number; probability_pct: number }>;
}

interface Response {
  success: boolean;
  error?: string;
  exam?: 'jee_main' | 'bitsat';
  current_rank?: number;
  current_score?: number;
  max_score?: number;
  outcomes?: ScenarioOutcome[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  exam: 'jee_main' | 'bitsat';
  inputs: Record<string, unknown>;
}

const TONE: Record<Tone, { fg: string; rgb: string }> = {
  rose:    { fg: '#fb7185', rgb: '251,113,133' },
  amber:   { fg: '#fbbf24', rgb: '251,191,36' },
  sky:     { fg: '#7dd3fc', rgb: '125,211,252' },
  emerald: { fg: '#34d399', rgb: '52,211,153' },
  purple:  { fg: '#c4b5fd', rgb: '196,181,253' },
};

export default function DropYearAnalyzer({ open, onClose, exam, inputs }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Response | null>(null);

  // Lock body scroll while open + ESC to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Fetch on open
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setData(null);
    fetch('/api/v2/college-predictor/drop-year', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam, ...inputs }),
    })
      .then((r) => r.json())
      .then((j: Response) => setData(j))
      .catch(() => setData({ success: false, error: 'Request failed' }))
      .finally(() => setLoading(false));
  }, [open, exam, inputs]);

  if (!open) return null;

  // Pull median delta for the CTA's "Replan with +X marks" text.
  const median = data?.outcomes?.find((o) => o.scenario.id === 'median');
  const ctaLabel = (() => {
    if (!median) return 'Got it';
    if (exam === 'bitsat' && median.scenario.score_delta !== undefined) {
      return `Replan with +${median.scenario.score_delta} marks`;
    }
    if (exam === 'jee_main' && median.scenario.rank_multiplier !== undefined && data?.current_rank) {
      const better = Math.round(data.current_rank * (1 - median.scenario.rank_multiplier));
      return `Replan with ${better.toLocaleString('en-IN')} better rank`;
    }
    return 'Got it';
  })();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(4,4,10,0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5vh 24px 5vh',
        overflowY: 'auto',
        animation: 'dropFadeIn 0.25s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1240,
          background: 'linear-gradient(180deg, rgba(20,22,34,0.95), rgba(10,11,18,0.95))',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '32px 36px 36px',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.05) inset, 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.02)',
          animation: 'dropScaleIn 0.3s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        {/* Eyebrow + title + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 20,
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 11px',
                borderRadius: 999,
                background: 'rgba(196,181,253,0.08)',
                border: '1px solid rgba(196,181,253,0.3)',
                color: '#ddd6fe',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.16em',
                marginBottom: 12,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c4b5fd' }} />
              SCENARIO PLANNING
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 'clamp(28px, 3.2vw, 42px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#f5f5f7',
              }}
            >
              Should you drop a year?
            </h2>
            <p
              style={{
                margin: '10px 0 0',
                maxWidth: 760,
                color: '#9a9aa6',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              We can&apos;t predict{' '}
              <em style={{ fontStyle: 'normal', color: '#e7e7ea', fontWeight: 600 }}>your</em>{' '}
              improvement — that depends on effort, prep and luck. Instead, here&apos;s what{' '}
              <em style={{ fontStyle: 'normal', color: '#e7e7ea', fontWeight: 600 }}>each kind</em>{' '}
              of repeater outcome would actually unlock. Pessimistic to optimistic, side-by-side.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              flex: '0 0 auto',
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#cfcfd6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2.5 2.5 L11.5 11.5 M11.5 2.5 L2.5 11.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Loading / error */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{ height: 320, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            ))}
          </div>
        )}
        {!loading && data && !data.success && (
          <div style={{ padding: 16, borderRadius: 14, background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.3)', color: '#fb7185', fontSize: 14 }}>
            {data.error ?? 'Something went wrong.'}
          </div>
        )}

        {!loading && data?.success && data.outcomes && (
          <>
            {/* Distribution strip */}
            <DistributionStrip data={data} />

            {/* 5 scenario cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[14px]">
              {data.outcomes.map((o) => (
                <ScenarioCard key={o.scenario.id} outcome={o} exam={exam} maxScore={data.max_score} />
              ))}
            </div>

            {/* Cost callout */}
            <CostCallout />

            {/* Methodology */}
            <div
              style={{
                marginTop: 24,
                padding: '18px 22px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  color: '#5e5e6a',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 8,
                }}
              >
                HOW WE BUILT THIS
              </div>
              <div style={{ color: '#7d7d88', fontSize: 12.5, lineHeight: 1.6 }}>
                Percentiles are calibrated from publicly-cited{' '}
                {exam === 'jee_main' ? 'JEE Main' : 'BITSAT'} repeater cohort data
                (Allen, Resonance, FIITJEE studies + NTA appearance shares). The numbers
                are aggregate — your personal outcome depends on effort and prep approach.
                Treat this as a sanity check on expectations, not a guarantee.
              </div>
            </div>

            {/* Footer actions */}
            <div
              style={{
                marginTop: 26,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              <div style={{ color: '#7d7d88', fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace" }}>
                sanity-check on expectations · not a personal prediction
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '11px 18px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e7e7ea',
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  I&apos;ve seen enough
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '11px 22px',
                    borderRadius: 12,
                    background: 'linear-gradient(180deg, #f59e0b, #f97316)',
                    border: 'none',
                    color: '#0a0a0f',
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    fontWeight: 700,
                    letterSpacing: '-0.005em',
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px -10px #f59e0b99, 0 1px 0 rgba(255,255,255,0.3) inset',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {ctaLabel}
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 7 H11 M8 4 L11 7 L8 10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes dropFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dropScaleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Distribution strip ──────────────────────────────────────────────────────
function DistributionStrip({ data }: { data: Response }) {
  if (!data.outcomes) return null;
  const exam = data.exam;
  const isJee = exam === 'jee_main';
  const current = (isJee ? data.current_rank : data.current_score) ?? 0;
  const max = data.max_score ?? 390;

  // Build the visible numeric range from all targets + current value, then
  // pad by 10 % on each side so dots don't hug the edges.
  const values = data.outcomes
    .map((o) => (isJee ? o.target_rank : o.target_score) ?? 0)
    .concat(current);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  const pad = (hi - lo) * 0.1;
  lo -= pad;
  hi += pad;
  const pos = (v: number) => ((v - lo) / (hi - lo)) * 100;

  // For JEE the worst (highest rank) is on the LEFT; for BITSAT the worst
  // (lowest score) is on the LEFT. So for JEE we invert the position.
  const posOriented = (v: number) => (isJee ? 100 - pos(v) : pos(v));

  return (
    <div
      style={{
        padding: '26px 28px 36px',
        borderRadius: 14,
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 26,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, marginBottom: 22, flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              color: '#5e5e6a',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 4,
            }}
          >
            {isJee ? 'YOUR CURRENT RANK' : 'YOUR CURRENT SCORE'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                color: '#f5f5f7',
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {current.toLocaleString('en-IN')}
            </span>
            <span style={{ color: '#5e5e6a', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
              {isJee ? 'CRL' : `/ ${max}`}
            </span>
          </div>
        </div>
        <span style={{ color: '#7d7d88', fontSize: 12.5, maxWidth: 360, textAlign: 'right', lineHeight: 1.5 }}>
          A repeat attempt could land anywhere along the distribution below — pessimistic on the left, optimistic on the right.
        </span>
      </div>

      <div style={{ position: 'relative', height: 56 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 26,
            height: 5,
            background:
              'linear-gradient(90deg, rgba(251,113,133,0.25) 0%, rgba(251,191,36,0.25) 25%, rgba(125,211,252,0.25) 50%, rgba(52,211,153,0.25) 75%, rgba(196,181,253,0.25) 100%)',
            borderRadius: 999,
          }}
        />
        {/* YOU marker */}
        <div
          style={{
            position: 'absolute',
            left: `${posOriented(current)}%`,
            top: 14,
            transform: 'translateX(-50%)',
            width: 2,
            height: 30,
            background: '#f59e0b',
            boxShadow: '0 0 12px #f59e0baa',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${posOriented(current)}%`,
            top: 0,
            transform: 'translateX(-50%)',
            color: '#f59e0b',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.2em',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          YOU
        </div>
        {/* Percentile markers */}
        {data.outcomes.map((o) => {
          const v = (isJee ? o.target_rank : o.target_score) ?? 0;
          const tone = TONE[o.scenario.tone];
          return (
            <div
              key={o.scenario.id}
              style={{ position: 'absolute', left: `${posOriented(v)}%`, top: 22, transform: 'translateX(-50%)' }}
            >
              <span
                style={{
                  display: 'block',
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: '#0a0a0f',
                  border: `2px solid ${tone.fg}`,
                  boxShadow: `0 0 8px ${tone.fg}66`,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: tone.fg,
                  fontSize: 10.5,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {v.toLocaleString('en-IN')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Scenario card ──────────────────────────────────────────────────────────
function ScenarioCard({
  outcome,
  exam,
  maxScore,
}: {
  outcome: ScenarioOutcome;
  exam: 'jee_main' | 'bitsat';
  maxScore?: number;
}) {
  const s = outcome.scenario;
  const tone = TONE[s.tone];
  const swatch = (a: number) => `rgba(${tone.rgb},${a})`;
  const value = exam === 'jee_main' ? outcome.target_rank : outcome.target_score;
  const isJee = exam === 'jee_main';

  // Delta label — plain English. JEE shows rank improvement %, BITSAT shows
  // score delta in marks.
  const deltaLabel = (() => {
    if (isJee && s.rank_multiplier !== undefined) {
      if (s.rank_multiplier === 1) return 'no change';
      if (s.rank_multiplier < 1) return `${Math.round((1 - s.rank_multiplier) * 100)}% better`;
      return `${Math.round((s.rank_multiplier - 1) * 100)}% worse`;
    }
    if (!isJee && s.score_delta !== undefined) {
      if (s.score_delta === 0) return 'no change';
      return s.score_delta > 0 ? `+${s.score_delta} marks` : `${s.score_delta} marks`;
    }
    return '';
  })();

  return (
    <div
      style={{
        position: 'relative',
        padding: '22px 22px 24px',
        borderRadius: 18,
        background: `linear-gradient(180deg, ${swatch(0.04)}, rgba(12,13,22,0.85))`,
        border: `1px solid ${swatch(0.3)}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 320,
        overflow: 'hidden',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 50px -28px ${swatch(0.45)}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${tone.fg}, transparent)`,
        }}
      />

      {/* Label + frequency */}
      <div
        style={{
          color: tone.fg,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.18em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 14,
          lineHeight: 1.3,
          textTransform: 'uppercase',
        }}
      >
        {s.label}
        <span style={{ opacity: 0.6 }}> · {s.frequency}</span>
      </div>

      {/* Score / Rank */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ color: tone.fg, fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>→</span>
        <span
          style={{
            color: '#f5f5f7',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {(value ?? 0).toLocaleString('en-IN')}
        </span>
        {!isJee && (
          <span style={{ color: '#5e5e6a', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
            / {maxScore ?? 390}
          </span>
        )}
        {isJee && (
          <span style={{ color: '#5e5e6a', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>CRL</span>
        )}
      </div>
      <div
        style={{
          color: tone.fg,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 14,
          opacity: 0.85,
        }}
      >
        {deltaLabel}
      </div>

      {/* Narrative */}
      <div style={{ color: '#9a9aa6', fontSize: 12.5, lineHeight: 1.55, marginBottom: 16, flex: 1 }}>
        {s.narrative}
      </div>

      {/* Safe / Target / Reach counts */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          marginBottom: 14,
          paddingBottom: 14,
          borderBottom: '1px dashed rgba(255,255,255,0.07)',
        }}
      >
        <SmallStat n={outcome.counts.safe} label="Safe" color="#34d399" />
        <SmallStat n={outcome.counts.target} label="Target" color="#fb923c" />
        <SmallStat n={outcome.counts.reach} label="Reach" color="#7dd3fc" />
      </div>

      {/* Top unlocks */}
      <div>
        <div
          style={{
            color: '#5e5e6a',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 8,
          }}
        >
          TOP UNLOCKS
        </div>
        {outcome.top_unlocks.length === 0 ? (
          <div style={{ color: '#5e5e6a', fontSize: 11.5, fontStyle: 'italic' }}>
            No Safe matches at this outcome.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {outcome.top_unlocks.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ color: tone.fg, fontSize: 8.5, marginTop: 1 }}>●</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ color: '#e7e7ea', fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>
                    {u.title}
                  </div>
                  <div
                    style={{
                      color: '#7d7d88',
                      fontSize: 11,
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {u.subtitle}
                    {u.nirf !== undefined && <span style={{ opacity: 0.7 }}> · NIRF #{u.nirf}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SmallStat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span
        style={{
          color,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 18,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {n}
      </span>
      <span style={{ color: '#7d7d88', fontSize: 11.5 }}>{label}</span>
    </div>
  );
}

// ── Cost callout ────────────────────────────────────────────────────────────
function CostCallout() {
  const lines = [
    {
      strong: 'Coaching: ₹50 K – ₹2.5 L',
      rest:
        ' — varies 5× by institute; many strong students self-prep on < ₹20 K of books and tests.',
    },
    {
      strong: '1 year + 1 batch peer cohort',
      rest: ' of lost time. Your friends graduate before you start.',
    },
    {
      strong: 'Mental-health cost is real',
      rest:
        ' and rarely budgeted. Drop years can be isolating — plan support before you commit.',
    },
    {
      strong: 'Roughly 1 in 4 droppers don\'t improve',
      rest: ' — the bottom-25% scenarios above aren\'t edge cases.',
      danger: true,
    },
  ];
  return (
    <div
      style={{
        padding: '22px 26px',
        borderRadius: 16,
        background: 'rgba(250,204,21,0.04)',
        border: '1px solid rgba(250,204,21,0.25)',
        marginTop: 32,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#facc15" strokeWidth="1.6">
          <path d="M9 2 L16.5 15 H1.5 Z" strokeLinejoin="round" />
          <path d="M9 7 V10.5" strokeLinecap="round" />
          <circle cx="9" cy="12.5" r="0.7" fill="#facc15" stroke="none" />
        </svg>
        <span style={{ color: '#fde68a', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Before you decide — the cost side of the equation
        </span>
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {lines.map((l, i) => (
          <li
            key={i}
            style={{ display: 'flex', gap: 10, color: '#cfcfd6', fontSize: 13.5, lineHeight: 1.55 }}
          >
            <span style={{ color: l.danger ? '#fb7185' : '#facc15', marginTop: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: l.danger ? '#fb7185' : '#facc15',
                }}
              />
            </span>
            <span>
              <span style={{ color: l.danger ? '#fb7185' : '#fde68a', fontWeight: 700 }}>{l.strong}</span>
              <span>{l.rest}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
