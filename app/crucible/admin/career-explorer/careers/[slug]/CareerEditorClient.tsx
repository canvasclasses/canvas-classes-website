'use client';

import { useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Free-form JSON editor. Simple and sufficient for Phase 1 — the API
// whitelist-filters fields on PATCH so a bad payload can\'t corrupt schemas.

type CareerDoc = { _id: string } & Record<string, unknown>;

export default function CareerEditorClient({ initial }: { initial: CareerDoc }) {
  const [draft, setDraft] = useState<string>(() => JSON.stringify(stripMeta(initial), null, 2));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true); setStatus('idle'); setError(null);
    try {
      const parsed = JSON.parse(draft);
      const res = await fetch(`/api/v2/career-explorer/careers/${initial._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Save failed');
      }
      setStatus('ok');
    } catch (e) {
      setStatus('err'); setError(e instanceof Error ? e.message : 'Invalid JSON');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">Edit the taxonomy fields as JSON. Fields outside the whitelist are ignored.</div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </button>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        className="mt-3 h-[70vh] w-full rounded-xl border border-white/10 bg-[#0B0F15] p-4 font-mono text-xs text-white/90 focus:border-orange-400/60 focus:outline-none"
      />
      <div className="mt-3 h-6 text-sm">
        {status === 'ok' && <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Saved.</span>}
        {status === 'err' && <span className="inline-flex items-center gap-1 text-red-400"><AlertCircle className="h-4 w-4" /> {error}</span>}
      </div>
    </div>
  );
}

function stripMeta(obj: CareerDoc) {
  const copy: Record<string, unknown> = { ...obj };
  delete copy.created_at;
  delete copy.updated_at;
  delete copy.__v;
  return copy;
}
