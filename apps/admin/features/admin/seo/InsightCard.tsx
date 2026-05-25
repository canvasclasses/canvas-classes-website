import 'server-only';
import Link from 'next/link';
import { Target, AlertTriangle, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import type { Insight } from '@canvas/seo/insights';

// ============================================
// One-stop card for an Insight. The dashboard renders these inside the
// quick-wins / issues / trending columns. Severity drives the color stripe
// and icon; everything else is just text the rule produced.
// ============================================

export function InsightCard({ insight }: { insight: Insight }) {
  const style = SEVERITY_STYLE[insight.severity];
  const Icon = style.Icon;

  return (
    <div className={`relative overflow-hidden rounded-xl border ${style.border} bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors`}>
      {/* Accent stripe on the left */}
      <div className={`absolute inset-y-0 left-0 w-1 ${style.stripe}`} />

      <div className="ml-2 flex items-start gap-3">
        <div className={`shrink-0 rounded-lg p-1.5 ${style.iconBg}`}>
          <Icon size={14} className={style.iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-white">
            {insight.title}
          </h3>
          <p className="mt-1 text-xs text-white/60 leading-relaxed">
            {insight.evidence}
          </p>
          <p className="mt-2 text-xs text-white/85 leading-relaxed">
            <span className="font-medium text-orange-300/90">Recommendation: </span>
            {insight.recommendation}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            {insight.estimatedImpact ? (
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums ${style.impactBadge}`}>
                {insight.estimatedImpact}
              </span>
            ) : (
              <span />
            )}
            {insight.drillDownUrl && (
              <Link
                href={insight.drillDownUrl}
                className="inline-flex items-center gap-0.5 text-[11px] text-white/50 hover:text-orange-300"
              >
                Drill in <ChevronRight size={11} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SEVERITY_STYLE = {
  win: {
    Icon: Target,
    border: 'border-emerald-500/20',
    stripe: 'bg-emerald-500/60',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-300',
    impactBadge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  issue: {
    Icon: AlertTriangle,
    border: 'border-red-500/20',
    stripe: 'bg-red-500/60',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-300',
    impactBadge: 'border-red-500/30 bg-red-500/10 text-red-300',
  },
  trend: {
    Icon: TrendingUp,
    border: 'border-sky-500/20',
    stripe: 'bg-sky-500/60',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-300',
    impactBadge: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  },
  info: {
    Icon: TrendingDown,
    border: 'border-white/10',
    stripe: 'bg-white/30',
    iconBg: 'bg-white/5',
    iconColor: 'text-white/60',
    impactBadge: 'border-white/10 bg-white/5 text-white/60',
  },
} as const;
