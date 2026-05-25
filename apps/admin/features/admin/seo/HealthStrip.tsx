import 'server-only';
import { TrendingUp, TrendingDown, Minus, Gauge, Target, AlertTriangle } from 'lucide-react';
import type { Health } from '@canvas/seo/insights';

// Single-row health bar at the top of /seo. Tells the operator in 1 second:
// is traffic up/down/flat? Is CWV passing? How many wins/issues await?

export function HealthStrip({ health }: { health: Health }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <TrafficCell trend={health.trafficTrendPct} clicks7d={health.totalClicks7d} />
      <CwvCell rate={health.cwvPassRate} />
      <CountCell label="Quick wins" count={health.winCount} Icon={Target} color="emerald" />
      <CountCell label="Issues" count={health.issueCount} Icon={AlertTriangle} color="red" />
    </div>
  );
}

function TrafficCell({ trend, clicks7d }: { trend: number | null; clicks7d: number }) {
  const Icon = trend == null ? Minus : trend > 0.005 ? TrendingUp : trend < -0.005 ? TrendingDown : Minus;
  const color = trend == null
    ? 'text-white/40'
    : trend > 0.005
      ? 'text-emerald-300'
      : trend < -0.005
        ? 'text-red-300'
        : 'text-white/60';
  const pct = trend == null ? '—' : `${trend >= 0 ? '+' : ''}${(trend * 100).toFixed(0)}%`;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Traffic vs prior 7d
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <Icon size={18} className={color} />
        <span className={`text-2xl font-semibold tabular-nums ${color}`}>{pct}</span>
      </div>
      <p className="mt-1 text-[11px] text-white/40 tabular-nums">
        {clicks7d.toLocaleString()} clicks this week
      </p>
    </div>
  );
}

function CwvCell({ rate }: { rate: number | null }) {
  const pct = rate == null ? null : Math.round(rate * 100);
  const color = pct == null
    ? 'text-white/40'
    : pct >= 75
      ? 'text-emerald-300'
      : pct >= 50
        ? 'text-amber-300'
        : 'text-red-300';
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Core Web Vitals
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <Gauge size={18} className={color} />
        <span className={`text-2xl font-semibold tabular-nums ${color}`}>
          {pct == null ? '—' : `${pct}%`}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-white/40">pages pass all 3 metrics</p>
    </div>
  );
}

function CountCell({
  label, count, Icon, color,
}: { label: string; count: number; Icon: React.ElementType; color: 'emerald' | 'red' }) {
  const c = color === 'emerald'
    ? { text: 'text-emerald-300', bg: 'bg-emerald-500/10' }
    : { text: 'text-red-300',     bg: 'bg-red-500/10' };
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className={`rounded-lg ${c.bg} p-1`}>
          <Icon size={14} className={c.text} />
        </div>
        <span className={`text-2xl font-semibold tabular-nums ${c.text}`}>{count}</span>
      </div>
      <p className="mt-1 text-[11px] text-white/40">awaiting attention</p>
    </div>
  );
}
