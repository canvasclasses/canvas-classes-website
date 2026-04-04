'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flag, Check, ChevronDown, ChevronUp, RefreshCw, AlertTriangle } from 'lucide-react';

function getAdminHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '',
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuestionFlag {
  type: string;
  note?: string;
  flagged_by?: string;
  source?: 'admin' | 'student';
  flagged_at: string;
  resolved: boolean;
  resolved_at?: string;
}

interface FlaggedQuestion {
  _id: string;
  display_id: string;
  question_text: { markdown: string };
  metadata: { chapter_id: string; subject: string };
  flags: QuestionFlag[];
}

const FLAG_TYPE_LABELS: Record<string, string> = {
  wrong_answer:    'Answer seems incorrect',
  wrong_question:  'Question text has an error',
  latex_rendering: 'Math / formula not rendering',
  image_missing:   'Diagram or image missing',
  option_error:    'Error in one of the options',
  solution_error:  'Solution is wrong or incomplete',
  latex_error:     'LaTeX error',
  table_error:     'Table formatting issue',
  mismatch:        'Question/answer mismatch',
  solution_incorrect: 'Solution is incorrect',
  other:           'Other',
};

const FLAG_TYPE_COLOR: Record<string, string> = {
  wrong_answer:       '#f87171',
  wrong_question:     '#fb923c',
  latex_rendering:    '#facc15',
  image_missing:      '#60a5fa',
  option_error:       '#c084fc',
  solution_error:     '#f87171',
  latex_error:        '#facc15',
  mismatch:           '#fb923c',
  solution_incorrect: '#f87171',
  other:              '#94a3b8',
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function FlagsDashboard() {
  const [questions, setQuestions] = useState<FlaggedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterResolved, setFilterResolved] = useState<'unresolved' | 'resolved' | 'all'>('unresolved');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [resolving, setResolving] = useState<Record<string, boolean>>({});

  const loadFlagged = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Always scope to student source only — admin/internal flags are excluded
      const res = await fetch('/api/v2/questions/flagged?all=true&source=student', { headers: getAdminHeaders() });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      if (data.success) {
        // Further narrow: keep only student flags on each question,
        // but stamp each flag with its original DB array index for PATCH calls.
        const filtered = (data.questions ?? []).map((q: FlaggedQuestion) => ({
          ...q,
          flags: q.flags
            .map((f, idx) => ({ ...f, originalIdx: idx }))
            .filter(f => f.source === 'student'),
        })).filter((q: FlaggedQuestion) => q.flags.length > 0);
        setQuestions(filtered);
      } else {
        setError(data.error ?? 'Failed to load');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFlagged(); }, [loadFlagged]);

  // Filter + sort
  const visible = questions
    .map(q => ({
      ...q,
      unresolvedCount: q.flags.filter(f => !f.resolved).length,
    }))
    .filter(q => {
      if (filterResolved === 'unresolved') return q.unresolvedCount > 0;
      if (filterResolved === 'resolved') return q.flags.every(f => f.resolved);
      return true;
    })
    .sort((a, b) => b.unresolvedCount - a.unresolvedCount);

  // flagIdx is the original DB array index (stored as originalIdx on each flag)
  const resolveFlag = async (questionId: string, flagIdx: number) => {
    const key = `${questionId}-${flagIdx}`;
    setResolving(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`/api/v2/questions/${questionId}/flag/${flagIdx}/resolve`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        setQuestions(prev => prev.map(q => {
          if (q._id !== questionId) return q;
          const newFlags = q.flags.map(f => {
            const fWithIdx = f as QuestionFlag & { originalIdx?: number };
            return fWithIdx.originalIdx === flagIdx
              ? { ...f, resolved: true, resolved_at: new Date().toISOString() }
              : f;
          });
          return { ...q, flags: newFlags };
        }));
      }
    } catch { /* silent */ }
    setResolving(prev => ({ ...prev, [key]: false }));
  };

  const totalUnresolved = questions.reduce((n, q) => n + q.flags.filter(f => !f.resolved).length, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/50 shrink-0">
        <Flag size={14} className="text-red-400 shrink-0" />
        <span className="text-sm font-semibold text-gray-200">Student Reports</span>
        {totalUnresolved > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            {totalUnresolved} open
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto bg-gray-800/60 rounded-lg p-0.5">
          {(['unresolved', 'resolved', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterResolved(f)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition capitalize ${
                filterResolved === f
                  ? 'bg-gray-700 text-gray-100 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={loadFlagged}
          disabled={loading}
          className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 text-gray-400 hover:text-gray-200 transition disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            Loading reports…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-600/30 text-red-400 text-sm">
            <AlertTriangle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <Flag size={32} className="opacity-20" />
            <div className="text-sm">
              {filterResolved === 'unresolved' ? 'No open reports — all clear!' : 'No reports match this filter.'}
            </div>
          </div>
        )}

        {!loading && !error && visible.map(q => {
          const isExpanded = expanded[q._id] ?? false;
          const snippet = q.question_text.markdown.replace(/!\[[^\]]*\]\([^)]+\)/g, '[img]').slice(0, 120);
          type FlagWithIdx = FlaggedQuestion['flags'][0] & { unresolvedCount?: number };
          const qWithUnresolved = q as FlaggedQuestion & { unresolvedCount: number };

          return (
            <div
              key={q._id}
              className="rounded-xl border border-gray-700/50 bg-gray-900/40 overflow-hidden"
            >
              {/* Question row */}
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [q._id]: !isExpanded }))}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-800/30 transition"
              >
                {/* Flag count badge */}
                <div className={`shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  qWithUnresolved.unresolvedCount > 0
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-700/40 text-gray-500 border border-gray-700/40'
                }`}>
                  {q.flags.length}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-purple-400 font-mono">{q.display_id}</span>
                    <span className="text-[10px] text-gray-500">{q.metadata.subject} · {q.metadata.chapter_id}</span>
                    {qWithUnresolved.unresolvedCount > 0 && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                        {qWithUnresolved.unresolvedCount} unresolved
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono truncate">{snippet}{snippet.length >= 120 ? '…' : ''}</div>
                  {/* Flag type pills */}
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {q.flags.filter(f => !f.resolved).map((f, i) => (
                      <span
                        key={i}
                        style={{ color: FLAG_TYPE_COLOR[f.type] ?? '#94a3b8', borderColor: (FLAG_TYPE_COLOR[f.type] ?? '#94a3b8') + '40', background: (FLAG_TYPE_COLOR[f.type] ?? '#94a3b8') + '12' }}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border"
                      >
                        {FLAG_TYPE_LABELS[f.type] ?? f.type}
                      </span>
                    ))}
                  </div>
                </div>

                {isExpanded ? <ChevronUp size={14} className="text-gray-500 shrink-0 mt-1" /> : <ChevronDown size={14} className="text-gray-500 shrink-0 mt-1" />}
              </button>

              {/* Expanded flag details */}
              {isExpanded && (
                <div className="border-t border-gray-700/40 divide-y divide-gray-700/30">
                  {q.flags.map((f, i) => {
                    // i is the local index within the already-filtered student flags array.
                    // The PATCH endpoint needs the index in the original DB flags array,
                    // which we store as originalIdx on each flag during load (see loadFlagged).
                    const fWithIdx = f as QuestionFlag & { originalIdx?: number };
                    const dbIdx = fWithIdx.originalIdx ?? i;
                    return (
                    <div key={i} className={`px-3 py-2.5 flex items-start gap-3 ${f.resolved ? 'opacity-40' : ''}`}>
                      <div
                        style={{ color: FLAG_TYPE_COLOR[f.type] ?? '#94a3b8', background: (FLAG_TYPE_COLOR[f.type] ?? '#94a3b8') + '15', borderColor: (FLAG_TYPE_COLOR[f.type] ?? '#94a3b8') + '40' }}
                        className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 whitespace-nowrap"
                      >
                        {FLAG_TYPE_LABELS[f.type] ?? f.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        {f.note && (
                          <div className="text-xs text-gray-300 mb-0.5 italic">"{f.note}"</div>
                        )}
                        <div className="text-[10px] text-gray-500">
                          {f.flagged_by ? `User: ${f.flagged_by.slice(0, 8)}…` : 'Anonymous'}
                          {' · '}
                          {new Date(f.flagged_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {f.resolved && f.resolved_at && (
                            <span className="ml-2 text-emerald-400">✓ Resolved {new Date(f.resolved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          )}
                        </div>
                      </div>
                      {!f.resolved && (
                        <button
                          onClick={() => resolveFlag(q._id, dbIdx)}
                          disabled={resolving[`${q._id}-${dbIdx}`]}
                          className="shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30 transition disabled:opacity-40"
                        >
                          <Check size={10} /> Resolve
                        </button>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
