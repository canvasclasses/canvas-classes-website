'use client';

/**
 * Closing-rank trend chart — pure SVG, no chart library dependency.
 *
 * Shows one line per selected branch across the available years. Users toggle
 * branches via chips above the chart. Up to 6 branches at once to keep the
 * canvas readable; extras collapse behind "Show more".
 *
 * Design system: dark theme only — matches the simulator design workflow.
 * Colours picked from a fixed palette so the legend lines line up with the
 * stroke colours exactly.
 */
import { useMemo, useState } from 'react';
import type { BranchSummary } from '@/lib/collegePredictor/deepDive';

const PALETTE = [
  '#f97316', // orange-500  (primary accent)
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#fbbf24', // amber-400
  '#22d3ee', // cyan-400
  '#fb7185', // rose-400
];

// Lower rank = more competitive. In ranking charts, Indian coaching sites
// conventionally plot rank on a y-axis where smaller = higher up. We follow
// that convention (y=0 at top = rank 1 area) so "cutoff rising" = line going
// down on screen, matching how counselors narrate trends.
// Sizing notes:
// - PAD_L is generous (72) so 5–6 digit rank numbers ("16,458", "105,321")
//   never collide with the plot area. Previously the rotated y-axis title
//   overlapped tick labels — we moved the title to a caption above the chart
//   and freed the gutter entirely for numbers.
// - Tick / year fonts bumped up for legibility on phones.
const CHART_W = 760;
const CHART_H = 340;
const PAD_L = 72;
const PAD_R = 24;
const PAD_T = 20;
const PAD_B = 40;

interface Props {
  branches: BranchSummary[];
  years: number[];
}

export default function CutoffTrendChart({ branches, years }: Props) {
  // Default selection: top 4 most competitive branches.
  const defaultSelected = useMemo(
    () => branches.slice(0, Math.min(4, branches.length)).map((b) => b.branch_short_name),
    [branches],
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));
  const [showAll, setShowAll] = useState(false);

  if (branches.length === 0 || years.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-[#0B0F15] border border-white/5 text-sm text-zinc-500">
        No trend data available for this filter yet.
      </div>
    );
  }

  // Rank-range across selected branches (for y-axis scaling).
  const selectedBranches = branches.filter((b) => selected.has(b.branch_short_name));
  const allRanks = selectedBranches.flatMap((b) => b.trend.map((p) => p.closing_rank));
  const minRank = Math.min(...allRanks);
  const maxRank = Math.max(...allRanks);
  // 10% top padding so the highest (= lowest-rank number) point isn't on the frame.
  const paddedMin = Math.max(1, Math.floor(minRank - (maxRank - minRank) * 0.1));
  const paddedMax = Math.ceil(maxRank + (maxRank - minRank) * 0.1);

  const xScale = (year: number) => {
    if (years.length === 1) return PAD_L + (CHART_W - PAD_L - PAD_R) / 2;
    const t = (year - years[0]) / (years[years.length - 1] - years[0]);
    return PAD_L + t * (CHART_W - PAD_L - PAD_R);
  };
  const yScale = (rank: number) => {
    // Inverted — low rank (more competitive) at top.
    const t = (rank - paddedMin) / (paddedMax - paddedMin || 1);
    return PAD_T + t * (CHART_H - PAD_T - PAD_B);
  };

  // Y-axis ticks: 5 evenly spaced, rounded to nice numbers.
  const tickCount = 5;
  const yTicks: number[] = [];
  for (let i = 0; i < tickCount; i++) {
    const v = paddedMin + (i / (tickCount - 1)) * (paddedMax - paddedMin);
    yTicks.push(Math.round(v));
  }

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const visibleChips = showAll ? branches : branches.slice(0, 12);

  return (
    <div>
      {/* Branch toggle chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {visibleChips.map((b, idx) => {
          const active = selected.has(b.branch_short_name);
          const color = PALETTE[idx % PALETTE.length];
          return (
            <button
              key={b.branch_short_name}
              type="button"
              onClick={() => toggle(b.branch_short_name)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                active
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/3 border-white/10 text-zinc-500 hover:text-zinc-300'
              }`}
              style={active ? { boxShadow: `inset 0 0 0 1px ${color}55` } : undefined}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ backgroundColor: active ? color : '#52525b' }}
              />
              {b.branch_short_name}
            </button>
          );
        })}
        {branches.length > 12 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/3 text-zinc-400 hover:text-white transition-colors"
          >
            {showAll ? 'Show fewer' : `+ ${branches.length - 12} more`}
          </button>
        )}
      </div>

      {/* Caption — replaces the old rotated y-axis label, which was colliding
          with the tick numbers on narrow viewports. Putting it in the header
          is more readable and frees the left gutter for large rank values. */}
      <div className="flex items-baseline justify-between mb-2 px-1">
        <span className="text-xs font-medium text-zinc-300">
          Closing rank by year
        </span>
        <span className="text-[11px] text-zinc-500">
          Lower rank = more competitive
        </span>
      </div>

      {/* SVG chart */}
      <div className="rounded-xl bg-[#0B0F15] border border-white/5 p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          role="img"
          aria-label="Closing rank trend by year"
          className="w-full h-auto min-w-[560px]"
        >
          {/* Gridlines */}
          {yTicks.map((t) => (
            <g key={`grid-${t}`}>
              <line
                x1={PAD_L}
                x2={CHART_W - PAD_R}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="#ffffff10"
                strokeWidth={1}
              />
              <text
                x={PAD_L - 10}
                y={yScale(t) + 4}
                textAnchor="end"
                fontSize={12}
                fill="#a1a1aa"
                className="tabular-nums"
              >
                {t.toLocaleString('en-IN')}
              </text>
            </g>
          ))}

          {/* X-axis year labels */}
          {years.map((y) => (
            <g key={`x-${y}`}>
              <line
                x1={xScale(y)}
                x2={xScale(y)}
                y1={CHART_H - PAD_B}
                y2={CHART_H - PAD_B + 4}
                stroke="#ffffff22"
                strokeWidth={1}
              />
              <text
                x={xScale(y)}
                y={CHART_H - PAD_B + 22}
                textAnchor="middle"
                fontSize={13}
                fill="#d4d4d8"
                className="tabular-nums"
              >
                {y}
              </text>
            </g>
          ))}

          {/* Baseline */}
          <line
            x1={PAD_L}
            x2={CHART_W - PAD_R}
            y1={CHART_H - PAD_B}
            y2={CHART_H - PAD_B}
            stroke="#ffffff22"
            strokeWidth={1}
          />

          {/* One polyline per selected branch */}
          {selectedBranches.map((b) => {
            const color = PALETTE[branches.findIndex((x) => x.branch_short_name === b.branch_short_name) % PALETTE.length];
            const points = b.trend
              .filter((p) => years.includes(p.year))
              .map((p) => `${xScale(p.year)},${yScale(p.closing_rank)}`)
              .join(' ');
            return (
              <g key={b.branch_short_name}>
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {b.trend.map((p) => (
                  <circle
                    key={`${b.branch_short_name}-${p.year}`}
                    cx={xScale(p.year)}
                    cy={yScale(p.closing_rank)}
                    r={3.5}
                    fill="#050505"
                    stroke={color}
                    strokeWidth={2}
                  >
                    <title>{`${b.branch_short_name} · ${p.year} · Closing rank ${p.closing_rank.toLocaleString('en-IN')}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}

        </svg>
      </div>

      <div className="mt-3 text-xs text-zinc-500 leading-relaxed">
        Y-axis inverted so rank 1 sits at the top. A line sloping{' '}
        <span className="text-zinc-300 font-medium">upward</span> means the closing rank is falling — the branch is
        becoming <span className="text-zinc-300 font-medium">harder</span> to get into.
      </div>
    </div>
  );
}
