'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

// Small client island for the "Sync now" CTA on the sync-log page.
// The page itself is a server component — this only exists because we need
// useTransition + router.refresh() to reload the table after the sync
// succeeds without a full page navigation.
export function SyncNowButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function run() {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/v2/seo/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const rowTotal = Object.values(data.rowCounts as Record<string, number>)
        .reduce((a, b) => a + b, 0);
      setSuccess(`Synced ${data.date} — ${rowTotal} GSC rows + ${data.cruxFetched ?? 0} CrUX rows in ${Math.round(data.durationMs / 1000)}s`);
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={run}
        disabled={disabled || busy || isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
        {busy ? 'Syncing…' : 'Sync now'}
      </button>
      {success && <p className="text-xs text-emerald-400">{success}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
