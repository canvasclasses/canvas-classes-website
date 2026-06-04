'use client';

import { useState, useContext, useCallback } from 'react';
import { ChapterPracticeBlock } from '@canvas/data/types/books';
import {
  initPracticeSession,
  nextPracticeQuestion,
  recordPracticeAnswer,
  type BankQuestion,
  type PracticeRuntimeState,
  type PracticeAttemptStat,
} from '@canvas/data/books/practiceSelector';
import { BookContext } from '../../book-context';
import InlineMarkdown from '../InlineMarkdown';

type Phase = 'intro' | 'question' | 'feedback' | 'done';

export default function ChapterPracticeRenderer({
  block,
  onComplete,
}: {
  block: ChapterPracticeBlock;
  onComplete?: (score: number) => void;
}) {
  const { bookSlug } = useContext(BookContext);
  const sessionSize = block.session_size ?? 8;
  const passThreshold = block.pass_threshold ?? 0.7;

  const [phase, setPhase] = useState<Phase>('intro');
  const [state, setState] = useState<PracticeRuntimeState | null>(null);
  const [current, setCurrent] = useState<BankQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [served, setServed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);

  // Loads the cross-chapter bank + this user's history, then opens the session.
  const start = useCallback(async () => {
    // Fallback bank = this block's own questions (works in admin preview and as
    // a graceful degrade if the bank fetch fails).
    let bank: BankQuestion[] = block.questions.map((q) => ({ ...q, chapter_number: block.chapter_number }));
    let history: PracticeAttemptStat[] = [];

    if (bookSlug) {
      try {
        const [bankRes, histRes] = await Promise.all([
          fetch(`/api/v2/books/${bookSlug}/practice-bank`),
          fetch(`/api/v2/books/practice?book_slug=${encodeURIComponent(bookSlug)}`, { credentials: 'same-origin' }),
        ]);
        if (bankRes.ok) {
          const body = await bankRes.json();
          const fetched = (body?.data?.questions ?? []) as BankQuestion[];
          if (fetched.length > 0) bank = fetched;
        }
        if (histRes.ok) {
          const body = await histRes.json();
          history = (body?.data ?? []) as PracticeAttemptStat[];
        }
      } catch {
        /* offline — use the block's own questions, no history */
      }
    }

    const session = initPracticeSession({
      bank,
      currentChapter: block.chapter_number,
      history,
      sessionSize,
    });
    const first = nextPracticeQuestion(session);
    if (!first) return; // empty bank — nothing to do
    setState(first.state);
    setCurrent(first.question);
    setServed(0);
    setCorrectCount(0);
    setSelected(null);
    setQuestionStart(Date.now());
    setPhase('question');
  }, [block, bookSlug, sessionSize]);

  const answer = useCallback((index: number) => {
    if (!current || !state || selected !== null) return;
    const isCorrect = index === current.correct_index;
    setSelected(index);
    setCorrectCount((c) => c + (isCorrect ? 1 : 0));
    setServed((s) => s + 1);

    // Persist the attempt (fire-and-forget; only when we know the book).
    if (bookSlug) {
      fetch('/api/v2/books/practice', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_slug: bookSlug,
          chapter_number: current.chapter_number,
          question_id: current.id,
          concept_tag: current.concept_tag,
          difficulty: current.difficulty,
          correct: isCorrect,
          time_ms: Date.now() - questionStart,
        }),
      }).catch(() => {});
    }

    setState(recordPracticeAnswer(state, isCorrect));
    setPhase('feedback');
  }, [current, state, selected, bookSlug, questionStart]);

  const advance = useCallback(() => {
    if (!state) return;
    if (served >= sessionSize) {
      finish();
      return;
    }
    const next = nextPracticeQuestion(state);
    if (!next) {
      finish();
      return;
    }
    setState(next.state);
    setCurrent(next.question);
    setSelected(null);
    setQuestionStart(Date.now());
    setPhase('question');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, served, sessionSize]);

  function finish() {
    const score = served > 0 ? Math.round((correctCount / served) * 100) : 0;
    setPhase('done');
    if (score >= passThreshold * 100) onComplete?.(score);
  }

  // ── Render ──────────────────────────────────────────────────────────────
  const accent = '#a78bfa'; // violet — distinct from inline_quiz amber

  if (phase === 'intro') {
    return (
      <div className="my-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] px-5 py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-violet-400 font-bold">◎</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
            {block.title || 'Chapter Practice'}
          </span>
        </div>
        {block.intro && (
          <div className="mb-4">
            <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/65">
              {block.intro}
            </InlineMarkdown>
          </div>
        )}
        <p className="text-[13px] text-white/45 mb-5">
          {sessionSize} questions · adapts to how you answer · counts toward your progress
        </p>
        <button
          onClick={start}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-black font-bold text-sm"
        >
          Start practice
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const score = served > 0 ? Math.round((correctCount / served) * 100) : 0;
    const passed = score >= passThreshold * 100;
    return (
      <div className="my-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] px-5 py-8 text-center">
        <div className="text-5xl mb-3">{passed ? '🎯' : '📚'}</div>
        <h3 className="text-xl font-bold mb-1">{passed ? 'Practice complete!' : 'Keep going'}</h3>
        <p className="text-white/50 text-sm mb-4">
          You got {correctCount} of {served} right ({score}%).
        </p>
        <button
          onClick={start}
          className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70"
        >
          Practice again
        </button>
      </div>
    );
  }

  if (!current) return null;

  // question / feedback share the card; feedback just reveals correctness.
  return (
    <div className="my-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
          {block.title || 'Chapter Practice'}
        </span>
        <span className="text-[11px] text-white/35 tabular-nums">
          {served + (phase === 'feedback' ? 0 : 1)} / {sessionSize}
        </span>
      </div>

      <div className="mb-4 text-[15px] leading-relaxed text-white/90">
        <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/90">
          {current.question}
        </InlineMarkdown>
      </div>

      <div className="space-y-2">
        {current.options.map((opt, i) => {
          const isChosen = selected === i;
          const isAnswer = i === current.correct_index;
          let border = 'rgba(255,255,255,0.1)';
          let bg = 'rgba(255,255,255,0.02)';
          let color = 'rgba(255,255,255,0.8)';
          if (phase === 'feedback') {
            if (isAnswer) { border = 'rgba(16,185,129,0.5)'; bg = 'rgba(16,185,129,0.1)'; color = '#34d399'; }
            else if (isChosen) { border = 'rgba(248,113,113,0.5)'; bg = 'rgba(248,113,113,0.1)'; color = '#f87171'; }
          } else if (isChosen) {
            border = `${accent}88`; bg = `${accent}1a`;
          }
          return (
            <button
              key={i}
              type="button"
              disabled={phase === 'feedback'}
              onClick={() => answer(i)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-[15px] leading-relaxed transition-colors"
              style={{ border: `1px solid ${border}`, background: bg, color, cursor: phase === 'feedback' ? 'default' : 'pointer' }}
            >
              <InlineMarkdown>{opt}</InlineMarkdown>
            </button>
          );
        })}
      </div>

      {phase === 'feedback' && (
        <div className="mt-4 pt-4 border-t border-white/8">
          {current.explanation && (
            <p className="text-[13px] text-white/55 leading-relaxed mb-4">{current.explanation}</p>
          )}
          <button
            onClick={advance}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-black font-bold text-sm"
          >
            {served >= sessionSize ? 'See results' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  );
}
