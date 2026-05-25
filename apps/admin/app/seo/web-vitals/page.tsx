/**
 * /seo/web-vitals — Core Web Vitals per URL group, mobile PHONE form factor.
 *
 * Layout: a snapshot grid of all tracked URLs at the top (LCP/INP/CLS pill
 * verdicts), then a detailed timeseries section per URL with one chart per
 * metric. The threshold reference lines on each chart make it obvious at a
 * glance whether the page is in "good", "needs improvement", or "poor" territory.
 *
 * Why mobile only: ~all our traffic is mobile and the INP incident that
 * triggered this whole dashboard was the mobile signal. Desktop is collected
 * by `sync-crux` (ALL_FORM_FACTORS bucket) so we can add a toggle later
 * without re-running the backfill.
 */

import 'server-only';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { getCwvSeries, getLatestCwvSnapshots, getLatestDataDate } from '@canvas/seo/queries';
import { URL_GROUPS, ORIGIN } from '@canvas/seo/url-groups';
import { DataAsOf, EmptyState } from '@/features/admin/seo/components';
import { CwvChart } from '@/features/admin/seo/charts';
import {
  cwvVerdict,
  VERDICT_CLASSES,
  formatMs,
  formatCls,
  shortenUrl,
} from '@/features/admin/seo/format';

export const metadata = { title: 'SEO · Web Vitals | Canvas Admin' };
export const dynamic = 'force-dynamic';

const SERIES_DAYS = 180;

export default async function WebVitalsPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo/web-vitals');

  await connectToDatabase();
  const [snapshots, latestDate] = await Promise.all([
    getLatestCwvSnapshots(),
    getLatestDataDate(),
  ]);

  // Fetch the per-URL timeseries in parallel.
  const phoneSeries = await Promise.all(
    URL_GROUPS.map(async url => ({
      url,
      series: await getCwvSeries(url, 'PHONE', SERIES_DAYS),
    })),
  );

  const phoneSnapshots = snapshots.filter(s => s.formFactor === 'PHONE');

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Web Vitals</h1>
          <p className="mt-1 text-sm text-white/50">
            Field data from the Chrome UX Report — mobile (PHONE form factor). Threshold lines: green = &ldquo;good&rdquo;, amber = &ldquo;poor&rdquo;.
          </p>
        </div>
        <DataAsOf date={latestDate} />
      </header>

      {phoneSnapshots.length === 0 ? (
        <EmptyState
          title="No CrUX data yet"
          hint="Run npx tsx scripts/seo/backfill-crux.ts to seed 25 weeks of history, or wait for the next cron run."
        />
      ) : (
        <>
          <SnapshotGrid snapshots={phoneSnapshots} />
          <TimeSeriesSection seriesByUrl={phoneSeries} />
        </>
      )}
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function SnapshotGrid({
  snapshots,
}: {
  snapshots: Array<{
    urlPattern: string;
    lcp_p75: number | null;
    inp_p75: number | null;
    cls_p75: number | null;
  }>;
}) {
  // Sort so the worst INP comes first — operators glance and immediately see
  // which page needs attention (matches the incident-driven framing).
  const sorted = [...snapshots].sort((a, b) => (b.inp_p75 ?? 0) - (a.inp_p75 ?? 0));
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        Current snapshot · sorted by INP (worst first)
      </h2>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">URL</th>
              <th className="px-4 py-2.5 text-right font-medium">LCP p75</th>
              <th className="px-4 py-2.5 text-right font-medium">INP p75</th>
              <th className="px-4 py-2.5 text-right font-medium">CLS p75</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map(s => (
              <tr key={s.urlPattern} className="hover:bg-white/[0.02]">
                <td className="px-4 py-2.5">
                  <a
                    href={s.urlPattern}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-white/85 hover:text-orange-300"
                  >
                    {s.urlPattern === ORIGIN ? '(origin)' : shortenUrl(s.urlPattern)}
                    <ExternalLink size={10} className="opacity-40" />
                  </a>
                </td>
                <MetricCell value={s.lcp_p75} metric="lcp" format={formatMs} />
                <MetricCell value={s.inp_p75} metric="inp" format={formatMs} />
                <MetricCell value={s.cls_p75} metric="cls" format={formatCls} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetricCell({
  value,
  metric,
  format,
}: {
  value: number | null;
  metric: 'lcp' | 'inp' | 'cls';
  format: (v: number | null) => string;
}) {
  const verdict = cwvVerdict(metric, value);
  if (!verdict) {
    return <td className="px-4 py-2.5 text-right text-xs text-white/30">—</td>;
  }
  const c = VERDICT_CLASSES[verdict];
  return (
    <td className="px-4 py-2.5 text-right">
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums ${c.text} ${c.bg} ${c.border}`}>
        {format(value)}
      </span>
    </td>
  );
}

function TimeSeriesSection({
  seriesByUrl,
}: {
  seriesByUrl: Array<{
    url: string;
    series: Array<{ date: Date; lcp_p75: number | null; inp_p75: number | null; cls_p75: number | null }>;
  }>;
}) {
  // Only show URLs that have at least one data point — keeps the page short
  // for tracked URLs that don't get enough Chrome traffic for CrUX.
  const withData = seriesByUrl.filter(s => s.series.length > 0);
  if (withData.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        Trend · last {SERIES_DAYS} days (mobile)
      </h2>
      <div className="space-y-6">
        {withData.map(({ url, series }) => {
          const lcpData = series.map(p => ({ date: p.date.toISOString().slice(0, 10), value: p.lcp_p75 }));
          const inpData = series.map(p => ({ date: p.date.toISOString().slice(0, 10), value: p.inp_p75 }));
          const clsData = series.map(p => ({ date: p.date.toISOString().slice(0, 10), value: p.cls_p75 }));
          return (
            <div key={url} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-sm text-white/85 hover:text-orange-300"
                >
                  {url === ORIGIN ? '(origin)' : shortenUrl(url)}
                  <ExternalLink size={10} className="opacity-40" />
                </a>
                <span className="text-[11px] text-white/40">{series.length} data points</span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ChartPanel label="LCP (ms)"><CwvChart metric="lcp" data={lcpData} /></ChartPanel>
                <ChartPanel label="INP (ms)"><CwvChart metric="inp" data={inpData} /></ChartPanel>
                <ChartPanel label="CLS"><CwvChart metric="cls" data={clsData} /></ChartPanel>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChartPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">{label}</div>
      {children}
    </div>
  );
}
