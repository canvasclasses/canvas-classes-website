'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CWV_THRESHOLDS } from './format';

// ============================================
// Chart wrappers. recharts under the hood; clients of this file just pass
// data arrays. Keeping them as client components is required because
// recharts uses React refs to measure the DOM.
// ============================================

// ───────────────────────────────────────────
// Sparkline — for the overview KPI cards. Inline, no axes.
// ───────────────────────────────────────────

export function ClicksSparkline({ data }: { data: Array<{ date: string; clicks: number }> }) {
  if (data.length < 2) return null;
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#fb923c"
            strokeWidth={1.5}
            fill="url(#clicksGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ───────────────────────────────────────────
// Daily totals chart — overview page, the bigger one.
// ───────────────────────────────────────────

export function DailyTotalsChart({
  data,
}: {
  data: Array<{ date: string; clicks: number; impressions: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="clicksAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="imprsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#ffffff50"
            tick={{ fontSize: 11 }}
            tickFormatter={d => d.slice(5)}            // MM-DD
            minTickGap={32}
          />
          <YAxis yAxisId="left" stroke="#fb923c80" tick={{ fontSize: 11 }} width={40} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#0ea5e980"
            tick={{ fontSize: 11 }}
            width={50}
            tickFormatter={n => n >= 1000 ? (n / 1000).toFixed(0) + 'k' : String(n)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            itemStyle={{ color: '#fff' }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="impressions"
            name="Impressions"
            stroke="#0ea5e9"
            strokeWidth={1.5}
            fill="url(#imprsGrad)"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="clicks"
            name="Clicks"
            stroke="#fb923c"
            strokeWidth={2}
            fill="url(#clicksAreaGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ───────────────────────────────────────────
// Core Web Vitals timeseries with threshold reference lines.
// One chart per metric; the threshold bands are what make the chart
// actionable at a glance (green = under "good", amber = "needs improvement",
// red = "poor").
// ───────────────────────────────────────────

export function CwvChart({
  metric,
  data,
}: {
  metric: 'lcp' | 'inp' | 'cls';
  data: Array<{ date: string; value: number | null }>;
}) {
  const t = CWV_THRESHOLDS[metric];
  // Filter null points so the line doesn't break weirdly — recharts handles
  // gaps fine but the threshold lines render cleaner with continuous data.
  const points = data.filter(p => p.value != null);
  if (points.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-white/30">
        Not enough data yet — run the backfill or wait for the daily cron.
      </div>
    );
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <LineChart data={points} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#ffffff50"
            tick={{ fontSize: 10 }}
            tickFormatter={d => d.slice(5)}
            minTickGap={28}
          />
          <YAxis
            stroke="#ffffff50"
            tick={{ fontSize: 10 }}
            width={45}
            domain={['dataMin', 'dataMax']}
            tickFormatter={n => metric === 'cls' ? Number(n).toFixed(2) : String(Math.round(Number(n)))}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#fff' }} />
          <ReferenceLine y={t.good} stroke="#10b981" strokeDasharray="4 2" label={{ value: 'good', fill: '#10b981', fontSize: 9, position: 'insideTopRight' }} />
          <ReferenceLine y={t.ni}   stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'poor →', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#fb923c"
            strokeWidth={2}
            dot={{ r: 2.5, fill: '#fb923c' }}
            activeDot={{ r: 4 }}
            name={metric.toUpperCase()}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#0B0F15',
  border: '1px solid #ffffff20',
  borderRadius: 8,
  fontSize: 12,
} as const;
