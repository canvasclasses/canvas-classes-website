/**
 * /seo/pages — Top landing pages over the last 28 days with delta vs prior
 * 28 days. Mostly mirrors the queries page but shortens URLs (canvasclasses.in
 * prefix is implicit) and the click-out links to the page itself in a new tab.
 */

import 'server-only';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { getTopPages, getLatestDataDate } from '@canvas/seo/queries';
import { DataAsOf, DeltaPill, EmptyState } from '@/features/admin/seo/components';
import { formatNumber, formatCtr, formatPosition, shortenUrl } from '@/features/admin/seo/format';

export const metadata = { title: 'SEO · Top Pages | Canvas Admin' };
export const dynamic = 'force-dynamic';

const WINDOW_DAYS = 28;
const LIMIT = 100;

export default async function TopPagesPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo/pages');

  await connectToDatabase();
  const [rows, latestDate] = await Promise.all([
    getTopPages(WINDOW_DAYS, LIMIT),
    getLatestDataDate(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Top pages</h1>
          <p className="mt-1 text-sm text-white/50">
            Top {LIMIT} pages by clicks over the last {WINDOW_DAYS} days. Deltas are vs the prior {WINDOW_DAYS}-day window.
          </p>
        </div>
        <DataAsOf date={latestDate} />
      </header>

      {rows.length === 0 ? (
        <EmptyState title="No page data yet" hint="Run the backfill or wait for the next cron run." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Page</th>
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
                      href={r.key}
                      target="_blank"
                      rel="noreferrer"
                      title={r.key}
                      className="inline-flex items-center gap-1 font-mono text-xs text-white/85 hover:text-orange-300"
                    >
                      {shortenUrl(r.key)}
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/90">{formatNumber(r.clicks)}</td>
                  <td className="px-4 py-2.5 text-right"><DeltaPill value={r.clicksDeltaPct} compact /></td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{formatNumber(r.impressions)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{formatCtr(r.ctr)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{formatPosition(r.position)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <DeltaPill value={r.positionDelta == null ? null : r.positionDelta / 10} invert compact />
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
