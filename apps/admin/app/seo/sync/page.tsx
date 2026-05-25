/**
 * Sync log — first surface of the SEO dashboard.
 *
 * Lists the most recent cron + manual runs so an operator can confirm the
 * pipeline is healthy and that the data they're about to look at is fresh.
 * Full GSC/CrUX dashboards land in PR 3 at sibling routes under /seo/*.
 */

import 'server-only';
import { redirect } from 'next/navigation';
import { CheckCircle2, AlertTriangle, XCircle, Bot, Hand } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { GscSyncRun, type IGscSyncRun } from '@canvas/data/models/GscSyncRun';
import { SyncNowButton } from '@/features/admin/seo/SyncNowButton';

export const metadata = { title: 'SEO · Sync log | Canvas Admin' };
export const dynamic = 'force-dynamic';

// 30 docs — covers ~a month of daily cron runs + any manual syncs in between.
const RUN_LIMIT = 30;

interface RunRow {
  id: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: IGscSyncRun['status'];
  trigger: IGscSyncRun['trigger'];
  datesFetched: Date[];
  rowCounts: Record<string, number>;
  cruxFetched: number | null;
  error: string | null;
  durationMs: number | null;
}

export default async function SyncLogPage() {
  if (!(await requireAdmin())) redirect('/login?next=/seo/sync');

  await connectToDatabase();
  const docs = await GscSyncRun.find({})
    .sort({ startedAt: -1 })
    .limit(RUN_LIMIT)
    .lean();

  const runs: RunRow[] = docs.map(d => ({
    id: String(d._id),
    startedAt: d.startedAt,
    finishedAt: d.finishedAt,
    status: d.status,
    trigger: d.trigger,
    datesFetched: d.datesFetched ?? [],
    rowCounts: (d.rowCounts ?? {}) as Record<string, number>,
    cruxFetched: d.cruxFetched,
    error: d.error,
    durationMs: d.durationMs,
  }));

  const latest = runs[0];

  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Sync log</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Daily Search Console + Chrome UX Report ingest into Mongo.
              Cron fires at <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">02:00 UTC</code> (07:30 IST)
              and syncs D-3 (GSC&apos;s finalisation lag). Manual runs use the button on the right.
            </p>
          </div>
          <SyncNowButton />
        </header>

        <Freshness latest={latest} />

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Last {runs.length} runs
          </h2>
          {runs.length === 0 ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
              No sync runs yet. Click <strong>Sync now</strong> above to seed
              the data, or wait for the 02:00 UTC cron.
            </div>
          ) : (
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Started</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                    <th className="px-4 py-2.5 text-left font-medium">Trigger</th>
                    <th className="px-4 py-2.5 text-left font-medium">Date synced</th>
                    <th className="px-4 py-2.5 text-right font-medium">GSC rows</th>
                    <th className="px-4 py-2.5 text-right font-medium">CrUX rows</th>
                    <th className="px-4 py-2.5 text-right font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {runs.map(r => (
                    <RunRowComponent key={r.id} run={r} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers below are page-local (Freshness, status pills, etc.). They could be
// hoisted into features/admin/seo/components.tsx if a second page ever needs
// them — for now keeping them here avoids premature abstraction.
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────

function Freshness({ latest }: { latest: RunRow | undefined }) {
  if (!latest) return null;
  const completed = latest.finishedAt ?? latest.startedAt;
  const ageMs = Date.now() - completed.getTime();
  const ageHours = ageMs / 3_600_000;

  let band: { color: string; label: string };
  if (ageHours < 25) band = { color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', label: 'Fresh' };
  else if (ageHours < 48) band = { color: 'border-amber-500/30 bg-amber-500/10 text-amber-300', label: 'Stale' };
  else band = { color: 'border-red-500/30 bg-red-500/10 text-red-300', label: 'Very stale — investigate' };

  return (
    <div className={`mt-6 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${band.color}`}>
      <span className="font-semibold uppercase tracking-widest">{band.label}</span>
      <span className="text-white/60">
        — last successful run was {formatRelative(completed)} ({completed.toISOString().slice(0, 16).replace('T', ' ')} UTC)
      </span>
    </div>
  );
}

function RunRowComponent({ run }: { run: RunRow }) {
  const gscTotal = Object.values(run.rowCounts).reduce((a, b) => a + b, 0);
  return (
    <tr className="hover:bg-white/[0.02]">
      <td className="px-4 py-2.5 font-mono text-xs text-white/70 tabular-nums">
        {run.startedAt.toISOString().slice(0, 16).replace('T', ' ')}
      </td>
      <td className="px-4 py-2.5">
        <StatusPill status={run.status} />
      </td>
      <td className="px-4 py-2.5 text-xs">
        <TriggerPill trigger={run.trigger} />
      </td>
      <td className="px-4 py-2.5 font-mono text-xs text-white/60 tabular-nums">
        {run.datesFetched[0]?.toISOString().slice(0, 10) ?? '—'}
      </td>
      <td className="px-4 py-2.5 text-right tabular-nums text-white/80">
        {gscTotal > 0 ? gscTotal.toLocaleString() : <span className="text-white/30">—</span>}
      </td>
      <td className="px-4 py-2.5 text-right tabular-nums text-white/80">
        {run.cruxFetched ?? <span className="text-white/30">—</span>}
      </td>
      <td className="px-4 py-2.5 text-right tabular-nums text-white/60">
        {run.durationMs != null ? `${(run.durationMs / 1000).toFixed(1)}s` : <span className="text-white/30">…</span>}
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: IGscSyncRun['status'] }) {
  const map = {
    ok: { Icon: CheckCircle2, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'OK' },
    partial: { Icon: AlertTriangle, cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Partial' },
    error: { Icon: XCircle, cls: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Error' },
  }[status];
  const { Icon, cls, label } = map;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      <Icon size={11} /> {label}
    </span>
  );
}

function TriggerPill({ trigger }: { trigger: IGscSyncRun['trigger'] }) {
  const isCron = trigger === 'cron';
  const Icon = isCron ? Bot : Hand;
  return (
    <span className="inline-flex items-center gap-1 text-white/60">
      <Icon size={11} /> {isCron ? 'Cron' : 'Manual'}
    </span>
  );
}

function formatRelative(d: Date): string {
  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.round(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.round(sec / 3600)} h ago`;
  return `${Math.round(sec / 86400)} d ago`;
}
