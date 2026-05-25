'use client';

import { useEffect, useRef, useState } from 'react';

// Companion to PredictorClient for JoSAA. Shows how Safe / Target / Reach
// counts shift as the user's rank changes by ±40 %. Mirror of the BITSAT
// score explorer, but rank-based — lower rank = better.

type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';

interface RankPoint {
  rank: number;
  pct_delta: number;
  abs_delta: number;
  counts: Record<Bucket, number>;
  newly_safe: { college_short_name: string; college_type: string; branch_name: string }[];
}

interface RangeResponse {
  success: boolean;
  base_rank?: number;
  points?: RankPoint[];
}

interface Props {
  baseRank: number;
  category: string;
  gender: string;
  homeState: string;
  year?: number;
  regions?: string[];
  collegeTypes?: string[];
}

const BUCKET_COLOR: Record<Bucket, string> = {
  safe:     'bg-emerald-500',
  target:   'bg-orange-500',
  reach:    'bg-sky-500',
  unlikely: 'bg-zinc-700',
};

function formatRank(r: number) {
  return r.toLocaleString('en-IN');
}

export default function RankImpactExplorer({
  baseRank,
  category,
  gender,
  homeState,
  year,
  regions,
  collegeTypes,
}: Props) {
  const [data, setData] = useState<RangeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const lastReqRef = useRef<string>('');

  useEffect(() => {
    const key = JSON.stringify({ baseRank, category, gender, homeState, year, regions, collegeTypes });
    if (key === lastReqRef.current) return;
    lastReqRef.current = key;
    setLoading(true);
    setData(null);
    fetch('/api/v2/college-predictor/predict-range', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rank: baseRank,
        category,
        gender,
        home_state: homeState,
        year,
        regions,
        college_types: collegeTypes,
      }),
    })
      .then((r) => r.json())
      .then((j: RangeResponse) => {
        setData(j);
        const baseIdx = j.points?.findIndex((p) => p.pct_delta === 0) ?? 0;
        setActiveIdx(baseIdx);
      })
      .catch(() => setData({ success: false }))
      .finally(() => setLoading(false));
  }, [baseRank, category, gender, homeState, year, regions, collegeTypes]);

  const points = data?.success ? data.points ?? [] : [];
  const activePoint = activeIdx !== null ? points[activeIdx] : undefined;
  const basePoint = points.find((p) => p.pct_delta === 0);

  const maxStack = points.reduce((m, p) => {
    const t = p.counts.safe + p.counts.target + p.counts.reach;
    return t > m ? t : m;
  }, 0) || 1;

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
          What does a different rank buy you?
        </h3>
        <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
          Each bar is what the predictor would have said at that rank. Bars get taller as the rank
          improves (= lower number) — that's where higher-NIRF NITs and IIITs start opening up.
          A small rank-improvement at the top of the table is worth far more than the same shift
          deep in the list.
        </p>
      </div>

      <div className="select-none mb-3">
        {/* Top labels — total Safe + Target + Reach at each rank */}
        <div
          className="grid gap-1 md:gap-2 mb-1"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        >
          {points.map((p, i) => {
            const total = p.counts.safe + p.counts.target + p.counts.reach;
            const active = activeIdx === i;
            return (
              <div
                key={`top-${p.rank}`}
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
                key={`bar-${p.rank}`}
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                className="flex flex-col items-stretch justify-end gap-[2px] h-full group focus:outline-none"
                aria-label={`Rank ${formatRank(p.rank)}: ${p.counts.safe} Safe, ${p.counts.target} Target, ${p.counts.reach} Reach`}
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

        {/* X-axis labels: rank + ±pct change, with YOU marker on the base point */}
        <div
          className="grid gap-1 md:gap-2 mt-1.5"
          style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        >
          {points.map((p, i) => {
            const active = activeIdx === i;
            const isBase = p.pct_delta === 0;
            return (
              <div
                key={`label-${p.rank}`}
                className={`text-[10px] tabular-nums text-center leading-tight ${
                  isBase ? 'text-orange-400 font-bold' : active ? 'text-zinc-300' : 'text-zinc-500'
                } transition-colors`}
              >
                {formatRank(p.rank)}
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

      {/* Legend */}
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
        <span className="ml-auto text-zinc-600">
          {category === 'OPEN' ? 'CRL' : `${category} category rank`} (lower = better)
        </span>
      </div>

      {/* Active-point detail */}
      {activePoint && basePoint && (
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
          {activePoint.pct_delta === 0 ? (
            <div className="text-xs text-zinc-300">
              At your rank <span className="font-semibold text-white">{formatRank(activePoint.rank)}</span>:{' '}
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
                If your rank were{' '}
                <span className="font-semibold text-white">
                  {formatRank(activePoint.rank)} ({activePoint.pct_delta > 0 ? '+' : ''}{activePoint.pct_delta} %)
                </span>:
                {' '}
                <span className="text-emerald-400 font-medium">{activePoint.counts.safe} Safe</span>
                {' · '}
                <span className="text-orange-400 font-medium">{activePoint.counts.target} Target</span>
                {' · '}
                <span className="text-sky-400 font-medium">{activePoint.counts.reach} Reach</span>
                {' '}
                <span className="text-zinc-500">
                  ({activePoint.counts.safe - basePoint.counts.safe >= 0 ? '+' : ''}
                  {activePoint.counts.safe - basePoint.counts.safe} Safe vs your current rank)
                </span>
              </div>

              {activePoint.pct_delta < 0 && activePoint.newly_safe.length > 0 && (
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  <span className="text-emerald-400 font-medium">Unlocks:</span>{' '}
                  {activePoint.newly_safe
                    .slice(0, 6)
                    .map((n) => `${n.college_short_name} ${n.branch_name}`)
                    .join(', ')}
                  {activePoint.newly_safe.length > 6 && (
                    <span className="text-zinc-500"> · +{activePoint.newly_safe.length - 6} more</span>
                  )}
                </div>
              )}

              {activePoint.pct_delta > 0 && activePoint.counts.safe < basePoint.counts.safe && (
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  <span className="text-rose-400 font-medium">You'd lose:</span>{' '}
                  <span className="text-zinc-300">
                    {basePoint.counts.safe - activePoint.counts.safe} Safe colleges
                  </span>
                  <span className="text-zinc-500"> — a reminder of what your current rank has already earned you.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-[10px] text-zinc-500 leading-relaxed">
        Hover or tap each bar to see what that rank would unlock.
      </p>
    </div>
  );
}
