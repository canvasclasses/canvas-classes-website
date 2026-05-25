'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// Companion to BitsatPredictorClient. Lives below the main results and asks:
// "What does a different score buy you?" Designed to motivate continued prep
// by showing the marginal value of every 10 BITSAT points — the kind of
// concrete feedback a tier-2 student rarely sees in JEE prep guides.
//
// The data shape is the response of /api/v2/college-predictor/bitsat/predict-range.

type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';

interface ScorePoint {
  score: number;
  delta: number;
  counts: Record<Bucket, number>;
  newly_safe: { campus_name: string; programme_code: string; programme_name: string }[];
  newly_in_play: { campus_name: string; programme_code: string; programme_name: string }[];
}

interface RangeResponse {
  success: boolean;
  base_score?: number;
  regime?: 'modern' | 'legacy';
  max_score?: number;
  points?: ScorePoint[];
}

interface Props {
  baseScore: number;
  regime: 'modern' | 'legacy';
  campuses?: string[];
  programmes?: string[];
}

const BUCKET_COLOR: Record<Bucket, string> = {
  safe:     'bg-emerald-500',
  target:   'bg-orange-500',
  reach:    'bg-sky-500',
  unlikely: 'bg-zinc-700',
};

export default function BitsatImpactExplorer({ baseScore, regime, campuses, programmes }: Props) {
  const [data, setData] = useState<RangeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const lastReqRef = useRef<string>('');

  // Reload whenever the input changes. Stable key prevents StrictMode dup-fetch.
  useEffect(() => {
    const key = JSON.stringify({ baseScore, regime, campuses, programmes });
    if (key === lastReqRef.current) return;
    lastReqRef.current = key;
    setLoading(true);
    setData(null);
    fetch('/api/v2/college-predictor/bitsat/predict-range', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_score: baseScore,
        regime,
        campuses,
        programmes,
      }),
    })
      .then((r) => r.json())
      .then((j: RangeResponse) => {
        setData(j);
        // Default the active marker to the base-score point.
        const baseIdx = j.points?.findIndex((p) => p.delta === 0) ?? 0;
        setActiveIdx(baseIdx);
      })
      .catch(() => setData({ success: false }))
      .finally(() => setLoading(false));
  }, [baseScore, regime, campuses, programmes]);

  const points = data?.success ? data.points ?? [] : [];
  const maxScore = data?.max_score ?? 390;
  const activePoint = activeIdx !== null ? points[activeIdx] : undefined;
  const basePoint = points.find((p) => p.delta === 0);

  // Y-axis scale: the largest bar height across all points.
  const maxStack = useMemo(() => {
    let m = 0;
    for (const p of points) {
      const total = p.counts.safe + p.counts.target + p.counts.reach;
      if (total > m) m = total;
    }
    return m || 1;
  }, [points]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-[#0B0F15] border border-white/5 p-6 md:p-8 animate-pulse h-64" />
    );
  }
  if (!data?.success || points.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[#0B0F15] border border-white/5 p-6 md:p-8">
      <div className="mb-4">
        <h3 className="text-base md:text-lg font-semibold text-white">
          What does a different score buy you?
        </h3>
        <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
          Each bar is what the predictor would have said at that score. Lower bars at lower scores =
          a tighter prep window with less margin; higher bars to the right = where Pilani's apex
          programmes start opening up.
        </p>
      </div>

      {/* Stacked bar chart — bars in a fixed-height row, labels below in
          a separate row so longer "YOU" badges don't push into the legend. */}
      <div className="select-none mb-3">
        {/* Top row: total-count labels above each bar */}
        <div
          className="grid gap-1 md:gap-2 mb-1"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        >
          {points.map((p, i) => {
            const total = p.counts.safe + p.counts.target + p.counts.reach;
            const active = activeIdx === i;
            return (
              <div
                key={`top-${p.score}`}
                className={`text-[10px] tabular-nums text-center ${active ? 'text-white font-semibold' : 'text-zinc-500'}`}
              >
                {total}
              </div>
            );
          })}
        </div>

        {/* Bars row */}
        <div
          className="grid items-end gap-1 md:gap-2"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`, height: '160px' }}
        >
          {points.map((p, i) => {
            const safeH = (p.counts.safe / maxStack) * 150;
            const tgtH  = (p.counts.target / maxStack) * 150;
            const rchH  = (p.counts.reach / maxStack) * 150;
            const active = activeIdx === i;
            return (
              <button
                key={`bar-${p.score}`}
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                className="flex flex-col items-stretch justify-end gap-[2px] h-full group focus:outline-none"
                aria-label={`Score ${p.score}: ${p.counts.safe} Safe, ${p.counts.target} Target, ${p.counts.reach} Reach`}
              >
                <div
                  className={`${BUCKET_COLOR.reach} ${active ? 'opacity-100' : 'opacity-60'} group-hover:opacity-100 transition-opacity rounded-t-sm`}
                  style={{ height: `${rchH}px` }}
                />
                <div
                  className={`${BUCKET_COLOR.target} ${active ? 'opacity-100' : 'opacity-60'} group-hover:opacity-100 transition-opacity`}
                  style={{ height: `${tgtH}px` }}
                />
                <div
                  className={`${BUCKET_COLOR.safe} ${active ? 'opacity-100' : 'opacity-60'} group-hover:opacity-100 transition-opacity rounded-b-sm`}
                  style={{ height: `${safeH}px` }}
                />
              </button>
            );
          })}
        </div>

        {/* X-axis labels row (score numbers + "you" marker for the base score) */}
        <div
          className="grid gap-1 md:gap-2 mt-1.5"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        >
          {points.map((p, i) => {
            const active = activeIdx === i;
            const isBase = p.delta === 0;
            return (
              <div
                key={`label-${p.score}`}
                className={`text-[10px] tabular-nums text-center ${
                  isBase ? 'text-orange-400 font-bold' : active ? 'text-zinc-300' : 'text-zinc-500'
                } transition-colors`}
              >
                {p.score}
                {isBase && (
                  <div className="text-[8px] uppercase tracking-wider text-orange-400/80 leading-tight">
                    you
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend — own row, below the labels */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 mb-5 pt-2 border-t border-white/5">
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-sm ${BUCKET_COLOR.safe}`} /> Safe
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-sm ${BUCKET_COLOR.target}`} /> Target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-sm ${BUCKET_COLOR.reach}`} /> Reach
        </span>
        <span className="ml-auto text-zinc-600">BITSAT score · max {maxScore}</span>
      </div>

      {/* Active-point detail */}
      {activePoint && basePoint && (
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
          {activePoint.delta === 0 ? (
            <div className="text-xs text-zinc-300">
              At your score <span className="font-semibold text-white">{activePoint.score}</span>:{' '}
              <span className="text-emerald-400 font-medium">{activePoint.counts.safe} Safe</span>
              {' · '}
              <span className="text-orange-400 font-medium">{activePoint.counts.target} Target</span>
              {' · '}
              <span className="text-sky-400 font-medium">{activePoint.counts.reach} Reach</span>
              .
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-zinc-300">
                If you'd scored{' '}
                <span className="font-semibold text-white">
                  {activePoint.delta > 0 ? '+' : ''}{activePoint.delta} marks
                </span>{' '}
                ({activePoint.score} / {maxScore}):
                {' '}
                <span className="text-emerald-400 font-medium">{activePoint.counts.safe} Safe</span>
                {' · '}
                <span className="text-orange-400 font-medium">{activePoint.counts.target} Target</span>
                {' · '}
                <span className="text-sky-400 font-medium">{activePoint.counts.reach} Reach</span>
                {' '}
                <span className="text-zinc-500">
                  ({activePoint.delta > 0 ? '+' : ''}{activePoint.counts.safe - basePoint.counts.safe} Safe vs your current score)
                </span>
              </div>

              {activePoint.delta > 0 && activePoint.newly_safe.length > 0 && (
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  <span className="text-emerald-400 font-medium">Unlocks:</span>{' '}
                  {activePoint.newly_safe
                    .slice(0, 6)
                    .map((n) => `${n.campus_name} ${cleanCode(n.programme_code)}`)
                    .join(', ')}
                  {activePoint.newly_safe.length > 6 && (
                    <span className="text-zinc-500"> · +{activePoint.newly_safe.length - 6} more</span>
                  )}
                </div>
              )}

              {activePoint.delta < 0 && activePoint.counts.safe < basePoint.counts.safe && (
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  <span className="text-rose-400 font-medium">You'd lose:</span>{' '}
                  <span className="text-zinc-300">
                    {basePoint.counts.safe - activePoint.counts.safe} Safe colleges
                  </span>
                  <span className="text-zinc-500"> — a reminder of what your current score has already earned you.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-[10px] text-zinc-500 leading-relaxed">
        Hover or tap each bar to see what that score would unlock. Bar heights show the total
        Safe + Target + Reach count at each score level.
      </p>
    </div>
  );
}

// Drop the "BE-" / "MSC-" / "BPHARM" prefix for compact display in the
// "unlocks" line — readers know the campus name; the code adds context.
function cleanCode(code: string): string {
  return code.replace(/^(BE|MSC)-/, '');
}
