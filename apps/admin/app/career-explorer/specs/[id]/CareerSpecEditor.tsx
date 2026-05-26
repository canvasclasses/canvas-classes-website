'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

// JSON editor for a single CareerSpec. Mirrors the pattern in CareerEditorClient
// (for the older CareerPath taxonomy) — sufficient for V1 with a small editorial
// team. A structured multi-section form is the V2 ergonomic upgrade.
//
// The API whitelist-filters fields on PATCH so a typo'd or extra field can't
// corrupt the document. Mongoose validation surfaces in `error.fields` for
// clear field-level error messaging.

type SpecDoc = { _id: string } & Record<string, unknown>;

interface FieldError {
  path: string;
  message: string;
}

export default function CareerSpecEditor({ initial }: { initial: SpecDoc }) {
  const router = useRouter();
  const [draft, setDraft] = useState<string>(() => JSON.stringify(stripMeta(initial), null, 2));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  async function save() {
    setSaving(true);
    setStatus('idle');
    setError(null);
    setFieldErrors([]);
    try {
      const parsed = JSON.parse(draft);
      const res = await fetch(`/api/v2/career-explorer/specs/${initial._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (Array.isArray(body.fields)) setFieldErrors(body.fields);
        throw new Error(body.error || `Save failed (${res.status})`);
      }
      const body = await res.json();
      // Refresh the editor with the saved server state — picks up server-side
      // changes like the bumped version and the auto-stamped published_at.
      setDraft(JSON.stringify(stripMeta(body.item), null, 2));
      setStatus('ok');
      router.refresh();
    } catch (e) {
      setStatus('err');
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    } finally {
      setSaving(false);
    }
  }

  async function softDelete() {
    if (!window.confirm('Archive this career spec? It will be hidden from the public guide but recoverable.')) return;
    setDeleting(true);
    setStatus('idle');
    setError(null);
    try {
      const res = await fetch(`/api/v2/career-explorer/specs/${initial._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Delete failed');
      }
      router.push('/career-explorer/specs');
      router.refresh();
    } catch (e) {
      setStatus('err');
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-white/60">
          Edit fields as JSON. The API whitelists allowed keys; extras are silently dropped.
          The schema requires non-empty <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px]">cons</code> and <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px]">moat_skills</code> — that&apos;s the editorial-honesty enforcement.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={softDelete}
            disabled={deleting || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-60"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Archive
          </button>
          <button
            onClick={save}
            disabled={saving || deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        className="mt-3 h-[70vh] w-full rounded-xl border border-white/10 bg-[#0B0F15] p-4 font-mono text-xs leading-relaxed text-white/90 focus:border-orange-400/60 focus:outline-none"
      />

      <div className="mt-3 min-h-[24px] text-sm">
        {status === 'ok' && (
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Saved.
          </span>
        )}
        {status === 'err' && (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertCircle className="h-4 w-4" /> {error}
          </span>
        )}
      </div>

      {fieldErrors.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-red-300">Field errors</div>
          <ul className="mt-2 space-y-1 text-sm">
            {fieldErrors.map((f, i) => (
              <li key={i} className="text-red-200">
                <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px]">{f.path}</code>{' '}
                <span className="text-red-100">{f.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Strip server-only / immutable fields from the editor so admins can't
// accidentally overwrite them. The PATCH whitelist enforces this server-side,
// but hiding them client-side keeps the JSON readable.
function stripMeta(obj: SpecDoc): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...obj };
  delete copy._id;
  delete copy.created_at;
  delete copy.created_by;
  delete copy.updated_at;
  delete copy.updated_by;
  delete copy.deleted_at;
  delete copy.deleted_by;
  delete copy.version;
  delete copy.__v;
  return copy;
}
