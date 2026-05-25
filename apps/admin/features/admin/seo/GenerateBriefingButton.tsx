'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Sparkles } from 'lucide-react';

// "Generate today's briefing" — calls the manual briefing endpoint with
// force:true so it re-synthesizes even if today's row already exists.
export function GenerateBriefingButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/v2/seo/briefing', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? `HTTP ${res.status}`);
      setMsg(data.hasSynthesis
        ? `Generated · ${data.insightsCount} insights · existing synthesis kept`
        : `Generated · ${data.insightsCount} insights · synthesis pending Claude Code Desktop`);
      startTransition(() => router.refresh());
    } catch (err) {
      setMsg(`Failed: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={run}
        disabled={disabled || busy}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {busy ? 'Generating…' : 'Generate today\'s briefing'}
      </button>
      {msg && <p className="text-xs text-white/60">{msg}</p>}
    </div>
  );
}
