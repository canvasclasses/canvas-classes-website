"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Check, Timer, X, MonitorPlay, Volume2, ChevronUp, ChevronDown, Pause, Play, Home } from 'lucide-react';
import { Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import { getTagName, getChapterCategory } from '@/lib/taxonomyLookup';
import { track } from '@/lib/analytics/mixpanel';
import TestSaveModal from './TestSaveModal';
import WaveformAudioPlayer from '@/components/WaveformAudioPlayer';

async function fetchOptionStats(questionId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/v2/questions/${questionId}/stats`);
    if (!res.ok) return {};
    const data = await res.json() as Record<string, unknown>;
    return (data.optionStats as Record<string, number> | undefined) || {};
  } catch { return {}; }
}

// Difficulty colour + label helpers — match BrowseView's DIFF_COLOR / DIFF_LABEL
// scale (L1-L2 Easy, L3 Medium, L4 Tough, L5 Advanced) so the two surfaces
// agree when displaying the same question.
const DIFF_COLOR = (d: number | string): string => {
  if (typeof d === 'number') {
    if (d <= 2) return '#34d399';
    if (d === 3) return '#fbbf24';
    if (d === 4) return '#f87171';
    return '#c084fc'; // L5 Advanced
  }
  return d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#f87171';
};
const DIFF_LABEL = (d: number | string): string => {
  if (typeof d === 'number') {
    if (d <= 2) return 'Easy';
    if (d === 3) return 'Medium';
    if (d === 4) return 'Tough';
    return 'Advanced';
  }
  return String(d);
};
const TYPE_LABEL: Record<string, string> = {
  SCQ: 'Single Correct',
  MCQ: 'Multiple Correct',
  NVT: 'Integer',
  AR: 'Assertion-Reason',
  MST: 'Multi-Statement',
  MTC: 'Match Columns',
};

// Chapter-category accent — mirrors BrowseView. Keep in sync.
const CAT_COLOR: Record<string, string> = {
  Physical: '#38bdf8',
  Organic: '#c084fc',
  Inorganic: '#34d399',
  Practical: '#fbbf24',
  Physics: '#38bdf8',
  Biology: '#34d399',
  Maths: '#a78bfa',
};
const catAccent = (cat?: string | null): string => CAT_COLOR[cat ?? ''] ?? '#fb923c';

const pad2 = (n: number): string => n.toString().padStart(2, '0');

// Returns true when all 4 options are short enough for a 2×2 grid.
const isShortOptions = (opts: Array<{ text?: string }>): boolean => {
  if (!opts || opts.length !== 4) return false;
  return opts.every(o => {
    const t = (o.text || '');
    if (t.includes('$') || t.includes('![')) return false;
    const plain = t.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    return plain.length <= 28;
  });
};

export default function TestView({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [nvtInputs, setNvtInputs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(Math.ceil(questions.length * 90));
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [reviewing, setReviewing] = useState(false);
  const [revIdx, setRevIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [revStats, setRevStats] = useState<Record<string, number>>({});
  // Finish-test confirmation modal (shown when user hits 'Finish Test' on last question)
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [testStartTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, number>>({});
  const [questionTimings, setQuestionTimings] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState<'5min' | '1min' | null>(null);
  // Refs to track values inside intervals without causing re-renders
  const isPausedRef = useRef(false);
  const submittedRef = useRef(false);
  const questionStartTimesRef = useRef<Record<string, number>>({});
  // Video and audio expansion state for review section
  const [videoExpanded, setVideoExpanded] = useState<Record<number, boolean>>({});
  const [audioExpanded, setAudioExpanded] = useState<Record<string, boolean>>({});

  const toggleStar = (id: string) => setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Sync refs so interval callbacks always see latest values without being in deps
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);

  // Initialize timer when questions first arrive (handles async question loading)
  useEffect(() => {
    if (questions.length > 0) {
      setSeconds(prev => prev === 0 ? Math.ceil(questions.length * 90) : prev);
    }
  }, [questions.length]);

  // Timer — runs once, reads latest state via refs, never restarts on tick
  useEffect(() => {
    if (questions.length === 0) return;

    const t = setInterval(() => {
      if (submittedRef.current || isPausedRef.current) return;
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(t);
          setSubmitted(true);
          submittedRef.current = true;
          setShowSaveModal(true);
          return 0;
        }
        // Trigger warnings at exact thresholds
        if (s === 301) setShowWarning('5min');
        if (s === 61) setShowWarning('1min');
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]); // Only restart if question set changes, never on tick

  // Track time spent per question — uses ref to avoid re-running on every startTime update
  useEffect(() => {
    if (submitted || reviewing) return;
    const currentQ = questions[idx];
    if (!currentQ) return;

    // Record start time via ref (no state update = no re-render = no loop)
    if (!questionStartTimesRef.current[currentQ.id]) {
      questionStartTimesRef.current[currentQ.id] = Date.now();
      setQuestionStartTimes(prev => ({ ...prev, [currentQ.id]: Date.now() }));
    }

    return () => {
      // On cleanup (question change), accumulate time spent
      const startTime = questionStartTimesRef.current[currentQ.id];
      if (startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setQuestionTimings(prev => ({
          ...prev,
          [currentQ.id]: (prev[currentQ.id] || 0) + timeSpent,
        }));
        // Reset so next visit starts fresh tracking
        delete questionStartTimesRef.current[currentQ.id];
      }
    };
  }, [idx, submitted, reviewing, questions]); // questionStartTimes intentionally excluded

  useEffect(() => {
    if (!reviewing) return;
    const rq = questions[revIdx];
    if (!rq) return;
    setRevStats({});
    fetchOptionStats(rq.id).then(setRevStats);
  }, [reviewing, revIdx, questions]);

  // Persist the test on submit. Was previously gated behind a "Save" button in
  // the post-submit modal — meaning a single tap on "Discard" silently nuked
  // the test results and per-question attempts. Now it runs unconditionally
  // the moment the test is submitted; the modal is purely a celebratory recap.
  // Resilient to partial failures: each upstream call goes through allSettled
  // so a slow test-session POST can't lose the per-question batch (or v.v.).
  const persistedRef = useRef(false);
  const persistTestNow = useCallback(async () => {
    if (persistedRef.current) return;       // idempotent — fire-once
    persistedRef.current = true;
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const chapterId = questions[0]?.metadata?.chapter_id;
      if (!chapterId) return;

      const auth = { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` };

      // Per-question batch attempts (concept_mastery + recent_attempts).
      const attempts = questions
        .filter(qq => !!(answers[qq.id] || (nvtInputs[qq.id] && nvtInputs[qq.id].trim())))
        .map(qq => ({
          question_id: qq.id,
          display_id: qq.display_id,
          chapter_id: qq.metadata.chapter_id,
          difficulty: qq.metadata.difficultyLevel,
          concept_tags: qq.metadata.tags?.map((t: { tag_id: string }) => t.tag_id) ?? [],
          // Persona unification — feeds StudentChapterProfile.microConcept
          // dimension via the batch route (audit #5).
          micro_concept: qq.metadata.microConcept ?? null,
          is_correct: isQuestionCorrect(qq),
          selected_option: qq.type === 'NVT' ? nvtInputs[qq.id] ?? null : (answers[qq.id] ?? null),
          source: 'test',
          // Tests are intentional, focused work — see CRUCIBLE_ARCHITECTURE.md
          // §3.2. HIGH confidence: drives mastery counters and the
          // recommendation engine.
          confidence: 'high' as const,
          time_spent_seconds: questionTimings[qq.id] || 0,
        }));

      // Composite test result document for the dashboard.
      const score = questions.filter(qq => isQuestionCorrect(qq)).length;
      const totalSeconds = Math.floor((Date.now() - testStartTime) / 1000);
      const testResultData = {
        chapter_id: chapterId,
        test_config: { count: questions.length, difficulty_mix: 'balanced', question_sort: 'random' },
        questions: questions.map(qq => {
          const hasAnswer = !!(answers[qq.id] || (nvtInputs[qq.id] && nvtInputs[qq.id].trim()));
          return {
            question_id: qq.id,
            display_id: qq.display_id,
            difficulty: qq.metadata.difficultyLevel,
            is_correct: hasAnswer ? isQuestionCorrect(qq) : false,
            selected_option: qq.type === 'NVT' ? nvtInputs[qq.id] : answers[qq.id],
            time_spent_seconds: questionTimings[qq.id] || 0,
            marked_for_review: marked[qq.id] || false,
          };
        }),
        score: { correct: score, total: questions.length, percentage: Math.round((score / questions.length) * 100) },
        timing: { started_at: new Date(testStartTime), completed_at: new Date(), total_seconds: totalSeconds },
        saved_to_progress: true,
      };

      // Fire all three calls in parallel. Each is resilient — a transient
      // failure on one does not block the others. `keepalive: true` lets the
      // requests complete even if the user navigates away mid-flush.
      await Promise.allSettled([
        attempts.length > 0
          ? fetch('/api/v2/user/progress/batch', { method: 'POST', headers: auth, body: JSON.stringify({ attempts }), keepalive: true })
          : Promise.resolve(),
        fetch('/api/v2/test-results', { method: 'POST', headers: auth, body: JSON.stringify(testResultData), keepalive: true }),
        fetch('/api/v2/user/test-session', { method: 'POST', headers: auth, body: JSON.stringify({ chapter_id: chapterId, question_ids: questions.map(q => q.id), config: { count: questions.length, mix: 'balanced' } }), keepalive: true }),
      ]);
    } catch (err) {
      // Persistence failed irrecoverably — clear the lock so a manual retry
      // (e.g. the modal CTA) can attempt again instead of silently no-op'ing.
      persistedRef.current = false;
      console.error('[TestView] Failed to save test:', err);
    }
    // isQuestionCorrect is intentionally omitted — it's a stable per-render
    // helper closed over the same `questions` reference and re-listing it
    // would defeat the useCallback identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, answers, nvtInputs, marked, questionTimings, testStartTime]);

  // Auto-persist the moment the test is marked submitted — covers all entry
  // points (manual submit, timer expiry, finish modal). The previous gated
  // approach (waiting for a Save modal click) lost data on Discard.
  useEffect(() => {
    if (submitted) persistTestNow();
  }, [submitted, persistTestNow]);

  // Modal CTA — data is already persisted; this just dismisses + reviews.
  const handleContinueToReview = () => {
    setShowSaveModal(false);
    setReviewing(true);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const q = questions[idx];

  // Chapter context — derived from the first question's chapter_id since
  // TestView's prop interface predates the per-chapter accent system.
  const chapterId = questions[0]?.metadata?.chapter_id ?? '';
  const chapterName = chapterId ? getTagName(chapterId) : 'Test';
  const chapterCategory = chapterId ? getChapterCategory(chapterId) : null;
  const accent = catAccent(chapterCategory);

  if (!questions || questions.length === 0 || !q) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0F1117', color: '#fff' }}>
        <header className="h-14 flex items-center justify-between px-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,11,18,0.95)' }}>
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <span className="text-[13px] font-medium text-white/70">Preparing test…</span>
          <span className="w-16" />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: accent, borderTopColor: 'transparent' }}
            />
            <div className="text-[13px] text-white/55">Loading questions…</div>
          </div>
        </div>
      </div>
    );
  }

  // Status colours for the question palette — aligned with BrowseView's
  // sidebar-dot conventions (emerald = correct/answered, amber = saved/marked,
  // accent = current). Skipped is implicit (visited but unanswered) — we don't
  // surface it as a separate state to keep the grid scannable.
  const palStatus = (i: number) => {
    const qq = questions[i];
    if (i === idx) return { bg: `${accent}26`, color: '#fff', border: accent, ring: true };
    if (marked[qq.id]) return { bg: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: 'rgba(251,191,36,0.55)', ring: false };
    if (answers[qq.id] || nvtInputs[qq.id]) return { bg: 'rgba(52,211,153,0.18)', color: '#34d399', border: 'rgba(52,211,153,0.55)', ring: false };
    return { bg: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: 'rgba(255,255,255,0.08)', ring: false };
  };

  const answeredCount = questions.filter(qq => answers[qq.id] || (nvtInputs[qq.id] && nvtInputs[qq.id].trim())).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const notVisitedCount = questions.length - answeredCount;

  // Helper: check if a question is answered correctly
  const isQuestionCorrect = (qq: Question): boolean => {
    if (qq.type === 'NVT') {
      const userInput = nvtInputs[qq.id]?.trim();
      // Require a non-empty answer; undefined===undefined must NOT count as correct
      if (!userInput) return false;
      return userInput === qq.answer?.integer_value?.toString();
    }
    if (qq.type === 'MCQ') {
      const userSel = Array.isArray(answers[qq.id]) ? (answers[qq.id] as string[]) : [];
      const correctIds = (qq.options || []).filter((o: { id: string; text: string; is_correct: boolean }) => o.is_correct).map((o: { id: string; text: string; is_correct: boolean }) => o.id);
      if (userSel.length !== correctIds.length) return false;
      return correctIds.every((id: string) => userSel.includes(id));
    }
    // SCQ
    return !!qq.options?.find((o: { id: string; text: string; is_correct: boolean }) => o.id === answers[qq.id] && o.is_correct);
  };

  const score = submitted ? questions.filter(qq => isQuestionCorrect(qq)).length : 0;

  if (submitted) {
    const wrong = questions.filter(qq => {
      if (!answers[qq.id] && !nvtInputs[qq.id]) return false;
      if (qq.type === 'NVT') return nvtInputs[qq.id]?.trim() !== qq.answer?.integer_value?.toString();
      return !isQuestionCorrect(qq);
    }).length;
    const skipped = questions.length - answeredCount;

    if (reviewing) {
      const rq = questions[revIdx];
      const userAns = answers[rq.id] || nvtInputs[rq.id];
      const isCorrect = isQuestionCorrect(rq);
      const userSelArr: string[] = rq.type === 'MCQ' ? (Array.isArray(answers[rq.id]) ? answers[rq.id] as string[] : []) : (typeof answers[rq.id] === 'string' ? [answers[rq.id] as string] : []);
      const rqDiffColor = DIFF_COLOR(rq.metadata.difficultyLevel);

      return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white" style={{ background: '#0F1117' }}>
          {/* Ambient accent wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(900px 500px at 85% -10%, ${accent}1A, transparent 60%),
                radial-gradient(700px 600px at -10% 100%, ${accent}10, transparent 65%)
              `,
            }}
          />
          <header className="relative z-10 h-14 flex items-center px-4 lg:px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,11,18,0.95)' }}>
            <div className="w-full max-w-[960px] mx-auto flex items-center justify-between gap-3">
              <button
                onClick={() => setReviewing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to results
              </button>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/55">
                  Review · {chapterName}
                </span>
                <span className="text-[11.5px] font-mono tabular-nums text-white/40 ml-1">{revIdx + 1}/{questions.length}</span>
              </div>
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
            </div>
          </header>

          <main className="relative z-0 flex-1 overflow-y-auto">
            <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
              {/* Question card metadata row + body — same shape as BrowseView */}
              <article
                className="relative rounded-2xl overflow-hidden mb-5"
                style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(0,0,0,0.15) 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
                  style={{ background: `linear-gradient(180deg, ${rqDiffColor}, ${rqDiffColor}33)` }}
                />
                <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.05] flex-wrap">
                  <span
                    className="font-mono text-[14px] font-bold tabular-nums tracking-tight select-none"
                    style={{ color: accent }}
                  >
                    {pad2(revIdx + 1)}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
                    style={{ color: rqDiffColor, background: `${rqDiffColor}1A`, border: `1px solid ${rqDiffColor}33` }}
                  >
                    {DIFF_LABEL(rq.metadata.difficultyLevel)}
                  </span>
                  <span className="text-[10.5px] text-white/40 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    {TYPE_LABEL[rq.type] ?? rq.type}
                  </span>
                  {userAns ? (
                    <span
                      className={`text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ml-auto ${isCorrect ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/15 text-red-300 border border-red-500/30'}`}
                    >
                      {isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  ) : (
                    <span className="text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30 ml-auto">
                      Skipped
                    </span>
                  )}
                </div>
                <div className="px-5 pt-5 pb-4">
                  <div className="text-white/95 text-[17px] leading-[1.55] tracking-[-0.005em]">
                    <MathRenderer markdown={rq.question_text.markdown} fontSize={isMobile ? 15 : 17} imageScale={rq.svg_scales?.question || 100} />
                  </div>
                </div>
              </article>
              {rq.options && rq.options.length > 0 && (() => {
                const useGrid = isShortOptions(rq.options);
                return (
                  <div className={useGrid ? 'grid grid-cols-2 gap-2.5 mb-5' : 'flex flex-col gap-2.5 mb-5'}>
                    {rq.options.map((opt: { id: string; text: string; is_correct: boolean }, i: number) => {
                      const sel = userSelArr.includes(opt.id);
                      const correct = opt.is_correct;
                      const pct = revStats[opt.id] ?? 0;
                      const letter = String.fromCharCode(65 + i);
                      let border = 'border-white/8';
                      let bg = 'bg-white/[0.02]';
                      let labelColor = 'text-white/30';
                      if (correct) { border = 'border-emerald-500/70'; bg = 'bg-emerald-500/10'; labelColor = 'text-emerald-400'; }
                      else if (sel) { border = 'border-red-500/70'; bg = 'bg-red-500/10'; labelColor = 'text-red-400'; }
                      return (
                        <div key={opt.id} className={`relative overflow-hidden rounded-xl border ${border} ${bg} px-4 py-3 flex items-start gap-3`}>
                          {pct > 0 && (
                            <div
                              className="absolute inset-y-0 left-0 pointer-events-none transition-all"
                              style={{ width: `${pct}%`, background: correct ? 'rgba(52,211,153,0.10)' : sel ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)' }}
                            />
                          )}
                          <div className={`relative shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold ${labelColor} bg-white/5 border border-white/8`}>
                            {correct ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : letter}
                          </div>
                          <div className="relative flex-1 min-w-0 text-[15px] text-white/90 pt-0.5">
                            <MathRenderer markdown={opt.text || ''} fontSize={isMobile ? 14 : 15} imageScale={rq.svg_scales?.options || 100} />
                          </div>
                          {pct > 0 && (
                            <span className="relative shrink-0 text-[11px] font-mono tabular-nums text-white/45 self-center">
                              {pct}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              {rq.type === 'NVT' && (
                <div className="mb-5 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[12px] text-white/55 mb-1">Your answer: <strong className={nvtInputs[rq.id] ? 'text-white' : 'text-amber-300'}>{nvtInputs[rq.id] || 'Not attempted'}</strong></div>
                  <div className="text-[12px] text-white/55">Correct answer: <strong className="text-emerald-300">{rq.answer?.integer_value ?? '—'}</strong></div>
                </div>
              )}
              {(rq.solution.text_markdown || rq.solution.video_url || (rq.solution.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0)) && (
                <div
                  className="rounded-2xl px-5 py-4 mb-5"
                  style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${accent}33` }}
                >
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3"
                    style={{ color: accent }}
                  >
                    Solution
                  </div>

                  {/* Media explanations — pinned just under the SOLUTION
                      header. Same prominent treatment as BrowseView so both
                      surfaces feel consistent and the buttons don't get lost
                      under long solution text. */}
                  {(rq.solution?.video_url || (rq.solution?.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0)) && (
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {rq.solution?.video_url && (
                        <button
                          onClick={() => setVideoExpanded(prev => ({ ...prev, [revIdx]: !prev[revIdx] }))}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                          style={videoExpanded[revIdx] ? {
                            background: 'rgba(59,130,246,0.10)',
                            color: '#93c5fd',
                            border: '1px solid rgba(59,130,246,0.30)',
                          } : {
                            background: 'rgba(59,130,246,0.18)',
                            color: '#bfdbfe',
                            border: '1px solid rgba(59,130,246,0.50)',
                            boxShadow: '0 0 20px -6px rgba(59,130,246,0.45)',
                          }}
                        >
                          <span
                            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                            style={{ background: videoExpanded[revIdx] ? 'rgba(59,130,246,0.20)' : 'rgba(59,130,246,0.40)' }}
                          >
                            <MonitorPlay className="w-3.5 h-3.5" />
                          </span>
                          <span>{videoExpanded[revIdx] ? 'Hide video' : 'Watch video explanation'}</span>
                          {videoExpanded[revIdx] ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                        </button>
                      )}
                      {rq.solution?.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0 && (
                        rq.solution.asset_ids.audio.map((url, idx) => (
                          url ? (
                            <button
                              key={idx}
                              onClick={() => setAudioExpanded(prev => ({ ...prev, [`${revIdx}-${idx}`]: !prev[`${revIdx}-${idx}`] }))}
                              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                              style={audioExpanded[`${revIdx}-${idx}`] ? {
                                background: 'rgba(168,85,247,0.10)',
                                color: '#d8b4fe',
                                border: '1px solid rgba(168,85,247,0.30)',
                              } : {
                                background: 'rgba(168,85,247,0.18)',
                                color: '#e9d5ff',
                                border: '1px solid rgba(168,85,247,0.50)',
                                boxShadow: '0 0 20px -6px rgba(168,85,247,0.45)',
                              }}
                            >
                              <span
                                className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                                style={{ background: audioExpanded[`${revIdx}-${idx}`] ? 'rgba(168,85,247,0.20)' : 'rgba(168,85,247,0.40)' }}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </span>
                              <span>
                                {audioExpanded[`${revIdx}-${idx}`]
                                  ? `Hide audio${rq.solution!.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}`
                                  : `Listen to audio note${rq.solution!.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}`}
                              </span>
                              {audioExpanded[`${revIdx}-${idx}`] ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                            </button>
                          ) : null
                        ))
                      )}
                    </div>
                  )}

                  {/* Collapsible Video Player - Square Aspect Ratio */}
                  {rq.solution?.video_url && videoExpanded[revIdx] && (
                    <div style={{ marginBottom: 16, transition: 'all 0.3s ease-in-out' }}>
                      {rq.solution.video_url.includes('youtube.com') || rq.solution.video_url.includes('youtu.be') ? (
                        <div style={{ position: 'relative', paddingBottom: '100%', height: 0, overflow: 'hidden', borderRadius: 8, background: '#000' }}>
                          <iframe
                            src={rq.solution.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                          <video 
                            controls 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onKeyDown={(e) => {
                              if (e.key === ' ') {
                                e.preventDefault();
                                const video = e.currentTarget;
                                video.paused ? video.play() : video.pause();
                              } else if (e.key === 'ArrowRight') {
                                e.preventDefault();
                                e.currentTarget.currentTime += 5;
                              } else if (e.key === 'ArrowLeft') {
                                e.preventDefault();
                                e.currentTarget.currentTime -= 5;
                              }
                            }}
                          >
                            <source src={rq.solution.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collapsible Audio Players */}
                  {rq.solution?.asset_ids?.audio && rq.solution.asset_ids.audio.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {rq.solution.asset_ids.audio.map((url, idx) => (
                        url && audioExpanded[`${revIdx}-${idx}`] ? (
                          <WaveformAudioPlayer key={idx} src={url} accent="#a855f7" />
                        ) : null
                      ))}
                    </div>
                  )}

                  {rq.solution.text_markdown && (
                    <div className="text-white/85 leading-relaxed">
                      <MathRenderer markdown={rq.solution.text_markdown} fontSize={isMobile ? 14 : 16} imageScale={rq.svg_scales?.solution || 100} />
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                {revIdx > 0 && (
                  <button
                    onClick={() => setRevIdx(i => i - 1)}
                    className="px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white/90 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                )}
                {revIdx < questions.length - 1 && (
                  <button
                    onClick={() => setRevIdx(i => i + 1)}
                    className="flex-1 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                      color: '#0A0B12',
                      boxShadow: `0 0 18px -4px ${accent}88`,
                    }}
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      );
    }

    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white p-6" style={{ background: '#0F1117' }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(900px 500px at 85% -10%, ${accent}1F, transparent 60%),
              radial-gradient(700px 600px at -10% 100%, ${accent}12, transparent 65%)
            `,
          }}
        />
        <div className="relative z-10 max-w-md w-full">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2 inline-flex items-center gap-1.5" style={{ color: accent }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
            {chapterName} · Test complete
          </div>
          <div className="text-[28px] font-bold tracking-tight mb-1">Test complete</div>
          <div className="text-[13px] text-white/55 mb-6">
            You scored <span className="font-mono tabular-nums text-white/90 font-semibold">{score}</span> out of <span className="font-mono tabular-nums text-white/90 font-semibold">{questions.length}</span>
            <span className="mx-1.5 text-white/20">·</span>
            <span className={pct >= 60 ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>{pct}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-center">
              <div className="font-mono text-[20px] font-bold text-emerald-300 tabular-nums leading-none">{score}</div>
              <div className="text-[10px] uppercase tracking-wide text-emerald-400/70 font-bold mt-1.5">Correct</div>
            </div>
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-center">
              <div className="font-mono text-[20px] font-bold text-red-300 tabular-nums leading-none">{wrong}</div>
              <div className="text-[10px] uppercase tracking-wide text-red-400/70 font-bold mt-1.5">Wrong</div>
            </div>
            <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-center">
              <div className="font-mono text-[20px] font-bold text-amber-300 tabular-nums leading-none">{skipped}</div>
              <div className="text-[10px] uppercase tracking-wide text-amber-400/70 font-bold mt-1.5">Skipped</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { setReviewing(true); setRevIdx(0); }}
              className="w-full py-3 rounded-xl text-[13.5px] font-bold transition-all"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                color: '#0A0B12',
                boxShadow: `0 0 22px -4px ${accent}AA`,
              }}
            >
              Review solutions
            </button>
            <button
              onClick={onBack}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white/90 transition-colors"
            >
              Back to chapter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const triggerSubmit = () => {
    if (confirm('Submit test? You cannot change answers after submission.')) {
      track('test_finish_clicked', {
        chapter_id: chapterId,
        question_count: questions.length,
        answered_count: answeredCount,
        seconds_remaining: seconds,
        // Whether the user submitted with skipped questions outstanding
        had_skipped: questions.length - answeredCount > 0,
      });
      setSubmitted(true);
      setShowSaveModal(true);
    }
  };

  const palettePanel = (
    <div className="px-4 py-5">
      {/* OVERVIEW chips — matches BrowseView's stat-chip style */}
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 mb-2.5">Overview</div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-2.5 text-center">
          <div className="font-mono text-[16px] font-bold text-emerald-300 tabular-nums leading-none">{answeredCount}</div>
          <div className="text-[9px] uppercase tracking-wide text-emerald-400/70 font-bold mt-1">Answered</div>
        </div>
        <div className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-2.5 text-center">
          <div className="font-mono text-[16px] font-bold text-amber-300 tabular-nums leading-none">{markedCount}</div>
          <div className="text-[9px] uppercase tracking-wide text-amber-400/70 font-bold mt-1">Marked</div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-2.5 text-center">
          <div className="font-mono text-[16px] font-bold text-white/70 tabular-nums leading-none">{notVisitedCount}</div>
          <div className="text-[9px] uppercase tracking-wide text-white/45 font-bold mt-1">Not visited</div>
        </div>
      </div>

      {/* QUESTION PALETTE — accent-coloured current, emerald answered, amber marked */}
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 mb-2.5">Question Palette</div>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((_, i) => {
          const s = palStatus(i);
          return (
            <button
              key={i}
              onClick={() => { setIdx(i); setShowPalette(false); }}
              className="aspect-square rounded-lg font-mono text-[12px] font-bold tabular-nums transition-all"
              style={{
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                boxShadow: s.ring ? `0 0 14px -4px ${accent}AA` : 'none',
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* SUBMIT TEST — refined danger style, single source of truth (header has no duplicate) */}
      <button
        onClick={triggerSubmit}
        className="w-full mt-5 py-3 rounded-xl text-[13px] font-bold tracking-tight transition-all"
        style={{
          background: 'rgba(239,68,68,0.12)',
          color: '#fca5a5',
          border: '1px solid rgba(239,68,68,0.45)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.22)';
          e.currentTarget.style.color = '#fecaca';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
          e.currentTarget.style.color = '#fca5a5';
        }}
      >
        Submit test
      </button>
      <div className="text-[10.5px] text-white/30 text-center mt-2">
        Once submitted, you can&rsquo;t edit responses.
      </div>
    </div>
  );

  const qDiffColor = DIFF_COLOR(q.metadata.difficultyLevel);
  const isCurrentMCQ = q.type === 'MCQ';
  const currentSelArr: string[] = isCurrentMCQ
    ? (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [])
    : (typeof answers[q.id] === 'string' ? [answers[q.id] as string] : []);

  const questionBody = (
    <div className={`max-w-[860px] mx-auto px-4 lg:px-8 ${isMobile ? 'pb-32 pt-4' : 'py-8'}`}>
      <article
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(0,0,0,0.15) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Difficulty stripe — same as BrowseView */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${qDiffColor}, ${qDiffColor}33)` }}
        />

        {/* Top metadata row */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.05] flex-wrap">
          <span
            className="font-mono text-[14px] font-bold tabular-nums tracking-tight select-none"
            style={{ color: accent }}
          >
            {pad2(idx + 1)}
          </span>
          <span className="text-[11px] text-white/35 font-mono">of {questions.length}</span>
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
            style={{ color: qDiffColor, background: `${qDiffColor}1A`, border: `1px solid ${qDiffColor}33` }}
          >
            {DIFF_LABEL(q.metadata.difficultyLevel)}
          </span>
          <span className="text-[10.5px] text-white/40 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
            {TYPE_LABEL[q.type] ?? q.type}
          </span>
          <div className="flex items-center gap-1 ml-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-emerald-300 bg-emerald-500/10">+4</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-red-300 bg-red-500/10">−1</span>
          </div>
          <button
            onClick={() => toggleStar(q.id)}
            title="Bookmark"
            className={`ml-auto w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              starred.has(q.id) ? 'bg-amber-400/15 text-amber-300' : 'text-white/35 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={starred.has(q.id) ? '#fbbf24' : 'none'} />
          </button>
        </div>

        {/* Question text */}
        <div className="px-5 pt-5 pb-4">
          <div className="text-white/95 text-[17px] leading-[1.55] tracking-[-0.005em]">
            <MathRenderer markdown={q.question_text.markdown} fontSize={isMobile ? 15 : 17} imageScale={q.svg_scales?.question || 100} />
          </div>
        </div>

        {/* MCQ helper hint */}
        {isCurrentMCQ && (
          <div className="mx-5 mb-3 px-3 py-1.5 rounded-md text-[11px] font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 inline-flex items-center w-fit">
            Multiple correct — select all that apply
          </div>
        )}

        {/* Options / NVT */}
        <div className="px-5 pb-4">
          {q.options && q.options.length > 0 && (() => {
            const useGrid = isShortOptions(q.options);
            return (
              <div className={useGrid ? 'grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2.5'}>
                {q.options.map((opt: { id: string; text: string; is_correct: boolean }, i: number) => {
                  const sel = currentSelArr.includes(opt.id);
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (isCurrentMCQ) {
                          const newArr = sel ? currentSelArr.filter(id => id !== opt.id) : [...currentSelArr, opt.id];
                          setAnswers(a => ({ ...a, [q.id]: newArr }));
                        } else {
                          setAnswers(a => ({ ...a, [q.id]: opt.id }));
                        }
                      }}
                      className="relative overflow-hidden flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition-all cursor-pointer"
                      style={sel ? {
                        borderColor: accent,
                        background: `${accent}14`,
                      } : {
                        borderColor: 'rgba(255,255,255,0.10)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <div
                        className="relative shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold border bg-white/5"
                        style={sel ? { color: accent, borderColor: `${accent}66` } : { color: 'rgba(255,255,255,0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
                      >
                        {letter}
                      </div>
                      <div className="relative flex-1 min-w-0 text-[15px] text-white/90 pt-0.5">
                        <MathRenderer markdown={opt.text || ''} fontSize={isMobile ? 14 : 15} imageScale={q.svg_scales?.options || 100} />
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })()}
          {q.type === 'NVT' && (
            <input
              type="text"
              inputMode="decimal"
              value={nvtInputs[q.id] || ''}
              onChange={e => setNvtInputs(n => ({ ...n, [q.id]: e.target.value }))}
              placeholder="Enter integer answer"
              className="w-full px-4 py-3 rounded-xl text-white text-[16px] outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${nvtInputs[q.id] ? accent : 'rgba(255,255,255,0.12)'}`,
              }}
            />
          )}
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-2 px-5 pb-5">
          <button
            onClick={() => {
              const n = { ...answers }; delete n[q.id]; setAnswers(n);
              const m = { ...nvtInputs }; delete m[q.id]; setNvtInputs(m);
            }}
            className="px-3.5 py-2 rounded-xl text-[12px] font-semibold border border-white/10 bg-transparent text-white/55 hover:text-white/85 hover:bg-white/[0.04] transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => { setMarked(m => ({ ...m, [q.id]: true })); if (idx < questions.length - 1) setIdx(i => i + 1); }}
            className="px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-colors"
            style={{
              background: 'rgba(251,191,36,0.10)',
              color: '#fcd34d',
              border: '1px solid rgba(251,191,36,0.30)',
            }}
          >
            Mark & Next
          </button>
          {idx < questions.length - 1 ? (
            <button
              onClick={() => setIdx(i => i + 1)}
              className="flex-1 min-w-[140px] px-5 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                color: '#0A0B12',
                boxShadow: `0 0 18px -4px ${accent}88`,
              }}
            >
              Save & Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setShowFinishModal(true)}
              className="flex-1 min-w-[140px] px-5 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 bg-emerald-500/15 border border-emerald-500/45 text-emerald-200 hover:bg-emerald-500/25"
            >
              Finish Test <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </button>
          )}
        </div>
      </article>
    </div>
  );

  // Timer urgency colour — pales as time runs low
  const timerColor = seconds < 60 ? '#f87171' : seconds < 300 ? '#fbbf24' : 'rgba(255,255,255,0.85)';
  const timerBg = seconds < 60 ? 'rgba(248,113,113,0.12)' : seconds < 300 ? 'rgba(251,191,36,0.10)' : 'rgba(255,255,255,0.04)';
  const timerBorder = seconds < 60 ? 'rgba(248,113,113,0.40)' : seconds < 300 ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.08)';

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white" style={{ background: '#0F1117' }}>
      {/* Ambient accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(900px 500px at 85% -10%, ${accent}1A, transparent 60%),
            radial-gradient(700px 600px at -10% 100%, ${accent}10, transparent 65%)
          `,
        }}
      />

      {/* HEADER — single Submit Test lives in the sidebar; header is just back + chapter chip + timer + (mobile palette) */}
      <header
        className="relative z-10 h-14 flex items-center justify-between gap-3 px-4 lg:px-5 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,11,18,0.95)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
          {!isMobile && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/55 truncate">
                {chapterCategory ? `${chapterCategory} · ` : ''}{chapterName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                {TYPE_LABEL[q.type] ?? q.type}
              </span>
            </div>
          )}
        </div>

        {/* Timer cluster — center on desktop, right on mobile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(p => !p)}
            title={isPaused ? 'Resume' : 'Pause'}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={isPaused ? {
              background: 'rgba(251,191,36,0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(251,191,36,0.40)',
            } : {
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[15px] font-bold tabular-nums"
            style={{ background: timerBg, color: timerColor, border: `1px solid ${timerBorder}` }}
          >
            <Timer className="w-3.5 h-3.5" />
            {fmt(seconds)}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isMobile && (
            <button
              onClick={() => setShowPalette(v => !v)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold border border-white/10 text-white/75"
              style={{ background: showPalette ? 'rgba(255,255,255,0.08)' : 'transparent' }}
            >
              {answeredCount}/{questions.length}
            </button>
          )}
        </div>
      </header>

      <div className="relative z-0 flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {questionBody}
        </main>
        {!isMobile && (
          <aside
            className="w-[320px] flex-shrink-0 border-l overflow-y-auto"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,11,18,0.45)' }}
          >
            {palettePanel}
          </aside>
        )}
        {isMobile && showPalette && (
          <>
            <div
              onClick={() => setShowPalette(false)}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <div
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto"
              style={{ background: '#13151E', borderTop: '1px solid rgba(255,255,255,0.10)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                <span className="text-[13px] font-bold text-white">Overview & Palette</span>
                <button onClick={() => setShowPalette(false)} className="w-7 h-7 rounded-md text-white/55 hover:text-white hover:bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {palettePanel}
            </div>
          </>
        )}
      </div>
      {/* Finish Test confirmation modal */}
      {showFinishModal && (() => {
        const skippedCount = questions.length - answeredCount;
        return (
          <>
            <div
              onClick={() => setShowFinishModal(false)}
              className="fixed inset-0 z-[300] bg-black/72 backdrop-blur-md"
            />
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90%] max-w-[400px] rounded-3xl p-7 shadow-2xl"
              style={{ background: '#13151E', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2"
                style={{ color: skippedCount === 0 ? '#34d399' : '#fbbf24' }}
              >
                {skippedCount === 0 ? '✓ All answered' : '⚠ Skipped questions'}
              </div>
              <h3 className="text-[20px] font-bold text-white tracking-tight mb-2">
                {skippedCount === 0 ? 'Ready to submit?' : `${skippedCount} unanswered`}
              </h3>
              <p className="text-[13px] text-white/55 leading-relaxed mb-5">
                {skippedCount === 0
                  ? `You answered all ${questions.length} questions.`
                  : `You answered ${answeredCount} of ${questions.length}. The remaining ${skippedCount} will be marked wrong.`}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setShowFinishModal(false); setSubmitted(true); setShowSaveModal(true); }}
                  className="w-full py-3 rounded-xl text-[13.5px] font-bold transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.18)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239,68,68,0.50)',
                  }}
                >
                  Submit test now
                </button>
                {skippedCount > 0 && (
                  <button
                    onClick={() => { setShowFinishModal(false); setShowPalette(true); }}
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white/90 transition-colors"
                  >
                    Review {skippedCount} unanswered
                  </button>
                )}
                <button
                  onClick={() => setShowFinishModal(false)}
                  className="w-full py-2 rounded-xl text-[12.5px] font-semibold text-white/45 hover:text-white/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Timer Warning Notifications */}
      {showWarning && (
        <div
          className="fixed top-20 right-5 z-[200] rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3"
          style={{
            background: showWarning === '1min' ? 'rgba(248,113,113,0.18)' : 'rgba(251,191,36,0.16)',
            border: `1px solid ${showWarning === '1min' ? 'rgba(248,113,113,0.55)' : 'rgba(251,191,36,0.50)'}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <Timer className="w-4 h-4" style={{ color: showWarning === '1min' ? '#fca5a5' : '#fcd34d' }} />
          <div>
            <div className="text-[13px] font-bold" style={{ color: showWarning === '1min' ? '#fecaca' : '#fde68a' }}>
              {showWarning === '1min' ? '1 minute remaining' : '5 minutes remaining'}
            </div>
            <div className="text-[11px] text-white/55 mt-0.5">
              {showWarning === '1min' ? 'Test will auto-submit at 0:00' : 'Time is running out'}
            </div>
          </div>
          <button
            onClick={() => setShowWarning(null)}
            className="ml-2 px-2.5 py-1 rounded-md text-[11px] font-bold text-white/65 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {/* Save/Discard Progress Modal */}
      {showSaveModal && (() => {
        const score = questions.filter(qq => isQuestionCorrect(qq)).length;
        const timeSpentMs = Date.now() - testStartTime;
        const timeSpentMin = Math.floor(timeSpentMs / 60000);
        const timeSpentSec = Math.floor((timeSpentMs % 60000) / 1000);
        const timeSpent = `${timeSpentMin}:${String(timeSpentSec).padStart(2, '0')}`;
        
        return (
          <TestSaveModal
            score={score}
            total={questions.length}
            timeSpent={timeSpent}
            onContinue={handleContinueToReview}
          />
        );
      })()}
    </div>
  );
}
