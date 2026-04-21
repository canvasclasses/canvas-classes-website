'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import {
  DIMENSION_LABELS,
  DIMENSION_ORDER,
} from '@/lib/careerExplorer/seedQuestions';

type Dimension = keyof typeof DIMENSION_LABELS;

interface Option {
  id: string;
  label: string;
  contributes?: Record<string, number>;
  value?: string | number | boolean;
}
interface Question {
  _id: string;
  dimension: Dimension;
  sub_facet?: string;
  order: number;
  prompt: string;
  help_text?: string;
  format: 'force_choice' | 'likert5' | 'rank' | 'single_select' | 'slider';
  mode: 'contribution' | 'constraint';
  constraint_key?: string;
  options: Option[];
}

export default function QuestionnaireClient({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v2/career-explorer/questions');
        const data = await res.json();
        if (cancelled) return;
        const items: Question[] = data.items ?? [];
        // Order by dimension order then by question order
        const dimIdx = new Map(DIMENSION_ORDER.map((d, i) => [d, i]));
        items.sort((a, b) => {
          const da = dimIdx.get(a.dimension) ?? 99;
          const db = dimIdx.get(b.dimension) ?? 99;
          if (da !== db) return da - db;
          return a.order - b.order;
        });
        setQuestions(items);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const total = questions.length;
  const current = questions[idx];
  const progress = total ? Math.round(((idx) / total) * 100) : 0;

  const dimensionCount = useMemo(() => {
    if (!current) return null;
    const sameDim = questions.filter((q) => q.dimension === current.dimension);
    const within = sameDim.findIndex((q) => q._id === current._id) + 1;
    return { within, total: sameDim.length };
  }, [questions, current]);

  const chooseOption = async (opt: Option) => {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current._id]: opt.id }));
    setSaveState('saving');
    try {
      const res = await fetch(`/api/v2/career-explorer/profiles/${profileId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: current._id,
          option_id: opt.id,
          value: opt.value,
          progress_pct: total ? Math.round(((idx + 1) / total) * 100) : 0,
        }),
      });
      if (!res.ok) throw new Error('save failed');
      setSaveState('saved');
      // Auto-advance after a short beat so the user feels responsiveness.
      setTimeout(() => {
        setIdx((i) => Math.min(i + 1, total - 1));
        setSaveState('idle');
      }, 180);
    } catch {
      setSaveState('error');
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v2/career-explorer/profiles/${profileId}/submit`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('submit failed');
      router.push(`/career-explorer/results/${profileId}`);
    } catch {
      setSubmitting(false);
      setSaveState('error');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
      </main>
    );
  }

  if (!current) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-white/60">No questions available.</div>
      </main>
    );
  }

  const onLast = idx === total - 1;
  const allAnswered = questions.every((q) => answers[q._id]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Progress bar */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#050505]/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-3">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div>{DIMENSION_LABELS[current.dimension]}{dimensionCount ? ` · ${dimensionCount.within}/${dimensionCount.total}` : ''}</div>
            <div>{idx + 1} / {total}</div>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-xs uppercase tracking-widest text-orange-300">Part · {DIMENSION_LABELS[current.dimension]}</div>
        <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">{current.prompt}</h2>
        {current.help_text && <p className="mt-2 text-sm text-white/60">{current.help_text}</p>}

        <div className="mt-8 space-y-3">
          {current.options.map((opt) => {
            const selected = answers[current._id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => chooseOption(opt)}
                className={`w-full rounded-xl border px-5 py-4 text-left transition ${
                  selected
                    ? 'border-orange-400 bg-orange-500/10 text-white'
                    : 'border-white/10 bg-[#0B0F15] text-white/85 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full ${selected ? 'bg-orange-400' : 'bg-white/20'}`} />
                  <span>{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setIdx((i) => Math.max(i - 1, 0))}
            disabled={idx === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="text-xs text-white/40">
            {saveState === 'saving' && <span>Saving…</span>}
            {saveState === 'saved' && <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
            {saveState === 'error' && <span className="text-red-400">Couldn\'t save — try again.</span>}
          </div>
          {onLast ? (
            <button
              onClick={submit}
              disabled={!allAnswered || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 font-bold text-black transition hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Matching…</>) : (<>See my matches <ArrowRight className="h-4 w-4" /></>)}
            </button>
          ) : (
            <button
              onClick={() => setIdx((i) => Math.min(i + 1, total - 1))}
              disabled={!answers[current._id]}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-40"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
