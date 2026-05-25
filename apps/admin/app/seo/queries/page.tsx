/**
 * /seo/queries — Top search queries over the last 28 days with deltas vs
 * the prior 28-day window. Sorted by clicks descending; capped at 100 rows.
 * Click any query to deep-link to GSC's filter view (opens new tab).
 */

import 'server-only';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { getTopQueries, getLatestDataDate } from '@canvas/seo/queries';
import { DataAsOf, DeltaPill, EmptyState } from '@/features/admin/seo/components';
import { formatNumber, formatCtr, formatPosition, shortenQuery } from '@/features/admin/seo/format';

export const metadata = { title: 'SEO · Top Queries | Canvas Admin' };
export const dynamic = 'force-dynamic';

const WINDOW_DAYS = 28;
const LIMIT = 100;

export default async function TopQueriesPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo/queries');

  await connectToDatabase();
  const [rows, latestDate] = await Promise.all([
    getTopQueries(WINDOW_DAYS, LIMIT),
    getLatestDataDate(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Top queries</h1>
          <p className="mt-1 text-sm text-white/50">
            Top {LIMIT} by clicks over the last {WINDOW_DAYS} days. Deltas are vs the prior {WINDOW_DAYS}-day window.
          </p>
        </div>
        <DataAsOf date={latestDate} />
      </header>

      {rows.length === 0 ? (
        <EmptyState
          title="No query data yet"
          hint="Run the backfill or wait for the next cron run."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Query</th>
                <th className="px-4 py-2.5 text-right font-medium">Clicks</th>
                <th className="px-4 py-2.5 text-right font-medium">Δ Clicks</th>
                <th className="px-4 py-2.5 text-right font-medium">Impressions</th>
                <th className="px-4 py-2.5 text-right font-medium">CTR</th>
                <th className="px-4 py-2.5 text-right font-medium">Position</th>
                <th className="px-4 py-2.5 text-right font-medium">Δ Pos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map(r => (
                <tr key={r.key} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5">
                    <a
                      href={`https://search.google.com/search-console/performance/search-analytics?resource_id=${encodeURIComponent(process.env.GSC_SITE_URL ?? '')}&query=!${encodeURIComponent(r.key)}`}
                      target="_blank"
                      rel="noreferrer"
                      title={r.key}
                      className="inline-flex items-center gap-1 text-white/85 hover:text-orange-300"
                    >
                      {shortenQuery(r.key)}
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/90">{formatNumber(r.clicks)}</td>
                  <td className="px-4 py-2.5 text-right"><DeltaPill value={r.clicksDeltaPct} compact /></td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{formatNumber(r.impressions)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{formatCtr(r.ctr)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{formatPosition(r.position)}</td>
                  <td className="px-4 py-2.5 text-right">
                    {/* Position delta is absolute (number of positions), so we
                        derive a "fake relative" for the pill — anything ≥ 0.5
                        positions is visually meaningful. */}
                    <DeltaPill
                      value={r.positionDelta == null ? null : r.positionDelta / 10}
                      invert
                      compact
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
