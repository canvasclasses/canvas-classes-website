'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Sparkles, EyeOff, Filter } from 'lucide-react';

interface Source {
  _id: string;
  url: string;
  source_name: string;
  title: string;
  summary: string;
  categories: string[];
  fetched_at: string;
  published_at?: string | null;
  relevance_score: number;
  relevance_reason?: string;
  status: 'new' | 'reviewed' | 'drafted' | 'ignored';
  used_in_post?: string;
}

interface Props {
  onDraftFromSource: (s: Source) => void;
}

export default function SourcesPanel({ onDraftFromSource }: Props) {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'new' | 'all'>('new');

  const load = useCallback(async () => {
    setLoading(true);
    const qs = filter === 'new' ? '?status=new&limit=100' : '?limit=100';
    const res = await fetch(`/api/blog/sources${qs}`);
    const j = await res.json();
    if (j.success) setSources(j.data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: Source['status']) => {
    await fetch('/api/blog/sources', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <div className="flex gap-1">
            {(['new', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize transition ${
                  filter === f
                    ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Gathered by the daily RSS cron. Click a card to draft a blog from it.
        </p>
      </div>

      {loading && <p className="text-sm text-gray-500 text-center py-8">Loading…</p>}

      {!loading && sources.length === 0 && (
        <div className="bg-[#0B0F15] border border-white/5 rounded-xl p-10 text-center">
          <p className="text-sm text-gray-400">No RSS items here yet.</p>
          <p className="text-xs text-gray-600 mt-2">
            The daily cron (runs at 8 AM) will populate this list. For now, add ideas manually in the Ideas tab.
          </p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {sources.map(s => (
          <div key={s._id} className="bg-[#151E32] border border-white/5 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {s.source_name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    s.relevance_score >= 0.75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    s.relevance_score >= 0.5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-white/5 text-gray-400 border border-white/10'
                  }`}>
                    {(s.relevance_score * 100).toFixed(0)}% relevant
                  </span>
                  {s.categories.slice(0, 2).map(c => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{c}</span>
                  ))}
                </div>
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">{s.title}</h3>
                {s.summary && <p className="text-xs text-gray-400 mt-2 line-clamp-3">{s.summary}</p>}
                {s.relevance_reason && (
                  <p className="text-[11px] text-gray-500 mt-2 italic">“{s.relevance_reason}”</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 hover:text-orange-400 flex items-center gap-1"
              >
                <ExternalLink size={11} /> Source
              </a>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { onDraftFromSource(s); setStatus(s._id, 'drafted'); }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30 hover:bg-orange-500/20"
                >
                  <Sparkles size={11} /> Draft
                </button>
                <button
                  onClick={() => setStatus(s._id, 'ignored')}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                >
                  <EyeOff size={11} /> Ignore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
