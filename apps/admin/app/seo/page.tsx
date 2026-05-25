/**
 * /seo — Insights landing.
 *
 * Action-first layout: health strip at the top, then 3 columns of cards
 * (quick wins, issues, trending). Each card explains WHAT to do and WHY
 * — no raw numbers without context. Drill-downs to the existing raw-data
 * pages (queries / pages / web-vitals / overview / sync) for deeper digging.
 *
 * The same digest powers /api/v2/seo/digest (for AI consumers) and the
 * morning briefing — so this page is just one of three renderings of one
 * shared analysis pipeline.
 */

import 'server-only';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Lightbulb, Target, AlertTriangle, TrendingUp, Newspaper } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { analyzeSeo } from '@canvas/seo/insights';
import { HealthStrip } from '@/features/admin/seo/HealthStrip';
import { InsightCard } from '@/features/admin/seo/InsightCard';
import { DataAsOf, EmptyState } from '@/features/admin/seo/components';

export const metadata = { title: 'SEO Insights | Canvas Admin' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InsightsPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo');
  await connectToDatabase();
  const digest = await analyzeSeo();

  const noData = !digest.dataAsOf ||
    (digest.quickWins.length === 0 && digest.issues.length === 0 && digest.trending.length === 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Lightbulb size={24} className="text-orange-400" /> Insights
          </h1>
          <p className="mt-1 text-sm text-white/50">
            What to fix this week, ranked by impact. For a plain-English briefing, see{' '}
            <Link href="/seo/briefings" className="text-orange-300 hover:text-orange-200">
              today&apos;s briefing
            </Link>.
          </p>
        </div>
        <DataAsOf date={digest.dataAsOf} />
      </header>

      <HealthStrip health={digest.health} />

      {noData ? (
        <EmptyState
          title="Not enough data yet"
          hint="Insights need at least a week of synced data. Wait for a few cron runs (02:00 UTC daily) and check back."
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Column
            title="Quick wins"
            Icon={Target}
            accent="text-emerald-300"
            hint="Highest-impact, lowest-effort changes"
            emptyText="No quick wins flagged — your CTRs match the position math. Nice."
            insights={digest.quickWins}
          />
          <Column
            title="Issues"
            Icon={AlertTriangle}
            accent="text-red-300"
            hint="Regressions and problems to investigate"
            emptyText="No issues flagged this week. Trends are holding steady."
            insights={digest.issues}
          />
          <Column
            title="Trending"
            Icon={TrendingUp}
            accent="text-sky-300"
            hint="This week's biggest movers"
            emptyText="No notable movers — week looks routine."
            insights={digest.trending}
          />
        </div>
      )}

      <footer className="mt-12 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/50">
        <span>
          Insights regenerate on every page load. AI agents can pull the same data from{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5">GET /api/v2/seo/digest</code>.
        </span>
        <Link
          href="/seo/briefings"
          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 font-semibold text-orange-300 hover:bg-orange-500/20"
        >
          <Newspaper size={12} /> Morning briefings
        </Link>
      </footer>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function Column({
  title, Icon, accent, hint, emptyText, insights,
}: {
  title: string;
  Icon: React.ElementType;
  accent: string;
  hint: string;
  emptyText: string;
  insights: Array<Parameters<typeof InsightCard>[0]['insight']>;
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className={`flex items-center gap-2 text-sm font-semibold ${accent}`}>
          <Icon size={14} /> {title} <span className="text-white/30 tabular-nums">({insights.length})</span>
        </h2>
        <p className="mt-0.5 text-[11px] text-white/40">{hint}</p>
      </div>
      {insights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-white/40">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      )}
    </section>
  );
}
