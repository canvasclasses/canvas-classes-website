'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const BUCKETS = ['strong_fit', 'hidden_gem', 'stretch', 'excluded'] as const;

type ProfileDoc = Record<string, unknown> & {
  meta?: { email?: string; class_level?: string };
  status?: string;
  progress_pct?: number;
  constraints?: unknown;
  scores?: unknown;
};
type MatchRow = {
  _id: string;
  computed_score: number;
  computed_bucket: string;
  effective_bucket: string;
  admin_override?: { bucket?: string } | null;
  career?: { name?: string; family?: string } | null;
  career_id: string;
};

export default function ProfileDetailClient({ profile, matches }: { profile: ProfileDoc; matches: MatchRow[] }) {
  const [rows, setRows] = useState(matches);
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const override = async (matchId: string, bucket: string) => {
    setSaving(matchId);
    setErrors((e) => ({ ...e, [matchId]: '' }));
    try {
      const res = await fetch(`/api/v2/career-explorer/matches/${matchId}/override`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket }),
      });
      if (!res.ok) throw new Error('Save failed');
      setRows((r) => r.map((m) => m._id === matchId ? { ...m, admin_override: { bucket, by: 'you', at: new Date().toISOString() }, effective_bucket: bucket } : m));
    } catch (e) {
      setErrors((s) => ({ ...s, [matchId]: e instanceof Error ? e.message : 'Failed' }));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mt-8">
      <section className="rounded-xl border border-white/10 bg-[#0B0F15] p-5">
        <h2 className="text-lg font-semibold">Profile snapshot</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <KV label="Email" value={profile.meta?.email ?? '—'} />
          <KV label="Class level" value={profile.meta?.class_level ?? '—'} />
          <KV label="Status" value={profile.status} />
          <KV label="Progress" value={`${profile.progress_pct ?? 0}%`} />
          <KV label="Constraints" value={<pre className="whitespace-pre-wrap text-xs text-white/70">{JSON.stringify(profile.constraints, null, 2)}</pre>} />
          <KV label="Scores" value={<pre className="whitespace-pre-wrap text-xs text-white/70">{JSON.stringify(profile.scores, null, 2)}</pre>} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Matches</h2>
        <p className="mt-1 text-sm text-white/60">Override a bucket to hand-correct what the student sees on their results page.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/50">
              <tr>
                <th className="px-4 py-2">Career</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Computed</th>
                <th className="px-4 py-2">Effective</th>
                <th className="px-4 py-2">Override</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m._id} className="border-t border-white/5">
                  <td className="px-4 py-2">
                    <div className="font-medium">{m.career?.name ?? m.career_id}</div>
                    <div className="text-xs text-white/50">{m.career?.family}</div>
                  </td>
                  <td className="px-4 py-2">{m.computed_score}</td>
                  <td className="px-4 py-2 text-white/60">{m.computed_bucket}</td>
                  <td className="px-4 py-2">{m.effective_bucket}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {BUCKETS.map((b) => (
                        <button
                          key={b}
                          onClick={() => override(m._id, b)}
                          disabled={saving === m._id || m.effective_bucket === b}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 transition hover:bg-white/10 disabled:opacity-40"
                        >
                          {b}
                        </button>
                      ))}
                      {saving === m._id && <Loader2 className="h-4 w-4 animate-spin text-white/60" />}
                    </div>
                    {errors[m._id] && <div className="mt-1 text-xs text-red-400">{errors[m._id]}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
