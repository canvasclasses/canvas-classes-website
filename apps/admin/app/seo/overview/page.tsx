/**
 * /seo/overview — raw KPI tiles + 30-day chart. Demoted from the /seo
 * landing in PR 4; the new /seo is the Insights view. This stays as a
 * drill-down for "show me the raw numbers."
 */

import 'server-only';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import {
  getDailyTotals,
  getWindowComparison,
  getLatestDataDate,
} from '@canvas/seo/queries';
import { KpiCard, DataAsOf, EmptyState } from '@/features/admin/seo/components';
import { DailyTotalsChart } from '@/features/admin/seo/charts';
import { formatNumber, formatCtr, formatPosition } from '@/features/admin/seo/format';

export const metadata = { title: 'SEO Overview | Canvas Admin' };
export const dynamic = 'force-dynamic';

function deltaPct(current: number | undefined, prior: number | undefined): number | null {
  if (current == null || prior == null || prior === 0) return null;
  return (current - prior) / prior;
}

export default async function SeoOverviewPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo/overview');

  await connectToDatabase();
  const [{ current, prior }, daily, latestDate] = await Promise.all([
    getWindowComparison(7),       // last 7 days vs prior 7 days
    getDailyTotals(30),
    getLatestDataDate(),
  ]);

  if (!current || daily.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-2 flex items-baseline justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <DataAsOf date={latestDate} />
        </header>
        <EmptyState
          title="No data yet"
          hint="Run the backfill (npx tsx scripts/seo/backfill-gsc.ts) or wait for the next 02:00 UTC cron."
        />
      </main>
    );
  }

  const chartData = daily.map(d => ({
    date: d.date.toISOString().slice(0, 10),
    clicks: d.clicks,
    impressions: d.impressions,
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-white/50">Last 7 days vs the 7 days before that.</p>
        </div>
        <DataAsOf date={latestDate} />
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Clicks"
          value={formatNumber(current.clicks)}
          delta={deltaPct(current.clicks, prior?.clicks)}
        />
        <KpiCard
          label="Impressions"
          value={formatNumber(current.impressions)}
          delta={deltaPct(current.impressions, prior?.impressions)}
        />
        <KpiCard
          label="CTR"
          value={formatCtr(current.ctr)}
          delta={deltaPct(current.ctr, prior?.ctr)}
          hint="Clicks ÷ impressions"
        />
        <KpiCard
          label="Avg position"
          value={formatPosition(current.position)}
          delta={deltaPct(current.position, prior?.position)}
          deltaInvert                     /* lower position = better rank */
          hint="Lower is better"
        />
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-white/80">Daily clicks + impressions · last 30 days</h2>
          <span className="text-[11px] text-white/40">Clicks left axis · Impressions right axis</span>
        </div>
        <DailyTotalsChart data={chartData} />
      </section>
    </main>
  );
}
