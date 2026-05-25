import 'server-only';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================
// Pure presentational components shared across the SEO dashboard pages.
// All server components — no client interactivity here. The one client
// component lives in SyncNowButton.tsx; chart components that need recharts
// live in ./charts.tsx (also client).
// ============================================

/**
 * Big-number KPI tile with an inline delta vs prior period.
 * Used 4-up on the overview page.
 */
export function KpiCard({
  label,
  value,
  delta,
  deltaInvert = false,   // true for "position" (lower is better, so a drop is good)
  hint,
}: {
  label: string;
  value: string;
  delta: number | null;          // -1..+inf; null = no prior data
  deltaInvert?: boolean;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <div className="text-3xl font-semibold tabular-nums text-white">
          {value}
        </div>
        <DeltaPill value={delta} invert={deltaInvert} />
      </div>
      {hint && <p className="mt-2 text-[11px] text-white/40">{hint}</p>}
    </div>
  );
}

/**
 * Small delta indicator. `value` is the relative change (e.g. 0.12 = +12%).
 * `invert=true` flips the green/red mapping — useful for "position" where
 * a smaller number is better.
 */
export function DeltaPill({
  value,
  invert = false,
  compact = false,
}: {
  value: number | null;
  invert?: boolean;
  compact?: boolean;
}) {
  if (value == null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-white/30">
        <Minus size={11} /> {compact ? '' : 'no prior'}
      </span>
    );
  }
  const pct = value * 100;
  // After "improvement" mapping, positive = good (green), negative = bad (red).
  const improvement = invert ? -value : value;
  const Icon = improvement > 0.005 ? TrendingUp : improvement < -0.005 ? TrendingDown : Minus;
  const cls = improvement > 0.005
    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    : improvement < -0.005
      ? 'text-red-300 bg-red-500/10 border-red-500/20'
      : 'text-white/40 bg-white/5 border-white/10';
  const sign = pct > 0 ? '+' : '';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums ${cls}`}>
      <Icon size={11} />
      {sign}{pct.toFixed(Math.abs(pct) < 10 ? 1 : 0)}%
    </span>
  );
}

/** Empty-state for pages that have no data to show yet. */
export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-10 text-center">
      <h3 className="text-sm font-semibold text-white/80">{title}</h3>
      <p className="mt-2 text-xs text-white/50">{hint}</p>
    </div>
  );
}

/**
 * "Data as of YYYY-MM-DD" subtitle pill. Helps an operator catch a stale
 * dashboard at a glance.
 */
export function DataAsOf({ date }: { date: Date | null }) {
  if (!date) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-300">
        No data yet — run a sync
      </span>
    );
  }
  const ageDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  const color = ageDays > 5
    ? 'border-red-500/30 bg-red-500/10 text-red-300'
    : ageDays > 3
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${color}`}>
      Data as of {date.toISOString().slice(0, 10)}
    </span>
  );
}
