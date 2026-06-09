'use client';

// Junior practice — bank-backed chapter practice for grades 6–10.
// Fetches questions from the junior_questions bank (public API) by
// book_slug + chapter_number, then runs the session in a CENTERED MODAL
// (full-screen on mobile) so students solve distraction-free.
//
// Launcher behaviour:
//   • Real reader (BookContext.bookSlug set)  → a persistent FLOATING button
//     (portal, fixed) so it's reachable without scrolling to the block.
//   • Admin editor preview (bookSlug empty)   → an INLINE launcher card at the
//     block's position, so the floating button doesn't hover over the editor.
//
// Attempts log to /api/v2/books/practice (the shared Layer-2 stream).

import { useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { JuniorPracticeBlock } from '@canvas/data/types/books';
import { BookContext } from '../book-context';
import { REHYPE_KATEX_OPTIONS } from './_katexConfig';

interface BankQ {
  id: string;
  format: 'mcq' | 'assertion_reason';
  question: string;
  assertion: string | null;
  reason: string | null;
  options: string[];
  correct_index: number;
  explanation: string;
  image_src: string | null;
  concept_tag: string;
  difficulty: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkPlugins = [remarkMath, remarkGfm] as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypePlugins = [[rehypeKatex, REHYPE_KATEX_OPTIONS]] as any[];
const Md = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}
    components={{ p: ({ children: c }) => <span>{c}</span> }}>{children}</ReactMarkdown>
);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 2654435761) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'question' | 'feedback' | 'done';
const ACCENT = '#34d399';

export default function JuniorPracticeRenderer({
  block, onComplete,
}: { block: JuniorPracticeBlock; onComplete?: (score: number) => void }) {
  const { bookSlug } = useContext(BookContext);
  const previewMode = !bookSlug;                       // admin editor preview
  const slug = block.book_slug || bookSlug || '';
  const sessionSize = block.session_size ?? 10;
  const passThreshold = block.pass_threshold ?? 0.7;
  const isTest = block.mode === 'test';
  const label = block.title ?? (isTest ? 'Take the chapter test' : 'Practice this chapter');

  const [mounted, setMounted] = useState(false);
  const [bank, setBank] = useState<BankQ[] | null>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('question');
  const [queue, setQueue] = useState<BankQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [qStart, setQStart] = useState(0);

  useEffect(() => setMounted(true), []);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/v2/junior-questions/practice?book_slug=${encodeURIComponent(slug)}&chapter_number=${block.chapter_number}`);
      const body = await res.json();
      setBank(body?.success ? (body.data.questions as BankQ[]) : []);
    } catch {
      setBank([]);
    }
  }, [slug, block.chapter_number]);
  useEffect(() => { load(); }, [load]);

  // Lock the page behind the modal so it doesn't scroll under the overlay.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const requestClose = useCallback(() => {
    if (isTest && (phase === 'question' || phase === 'feedback')) {
      if (!window.confirm('Leave the test? Your progress will be lost.')) return;
    }
    setOpen(false);
  }, [isTest, phase]);

  // Escape closes (with the test guard inside requestClose).
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, requestClose]);

  function begin() {
    if (!bank || bank.length === 0) return;
    setQueue(shuffle(bank).slice(0, sessionSize));
    setIdx(0); setPicked(null); setCorrectCount(0);
    setPhase('question'); setQStart(Date.now());
  }
  function launch() { if (bank && bank.length) { begin(); setOpen(true); } }

  const current = queue[idx];
  const total = queue.length;

  async function logAttempt(q: BankQ, correct: boolean) {
    if (previewMode) return; // don't record from the admin editor preview
    try {
      await fetch('/api/v2/books/practice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
        body: JSON.stringify({
          book_slug: slug, chapter_number: block.chapter_number, question_id: q.id,
          concept_tag: q.concept_tag, difficulty: q.difficulty, correct, time_ms: Date.now() - qStart,
        }),
      });
    } catch { /* best-effort */ }
  }

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === current.correct_index;
    const newCorrect = correctCount + (ok ? 1 : 0);
    setCorrectCount(newCorrect);
    logAttempt(current, ok);
    // Test mode advances immediately (same tick), so pass the fresh count —
    // reading state here would be stale on the final question.
    if (isTest) advance(newCorrect);
    else setPhase('feedback');
  }

  // runningCorrect lets the same-tick test path pass an up-to-date tally;
  // the practice path calls advance() from a later render where state is fresh.
  function advance(runningCorrect: number = correctCount) {
    const done = idx + 1 >= total;
    if (done) {
      const score = Math.round((runningCorrect / total) * 100);
      setPhase('done');
      if (runningCorrect / total >= passThreshold) onComplete?.(score);
    } else {
      setIdx((n) => n + 1); setPicked(null); setPhase('question'); setQStart(Date.now());
    }
  }

  const count = bank?.length ?? null;
  const answered = picked !== null;

  // ── Session content (rendered inside the modal) ──────────────────────────────
  function sessionContent() {
    if (phase === 'done') {
      const pct = Math.round((correctCount / total) * 100);
      const passed = correctCount / total >= passThreshold;
      return (
        <div className="py-8 text-center">
          <p className="mb-1 text-5xl font-black" style={{ color: passed ? ACCENT : '#f87171' }}>{pct}%</p>
          <p className="mb-1 text-sm text-white/45">{correctCount} of {total} correct</p>
          <p className="mb-6 text-sm font-semibold" style={{ color: passed ? ACCENT : '#f87171' }}>
            {passed ? 'Well done!' : 'Keep practising — try again.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={begin} className="rounded-xl px-5 py-2 text-sm font-bold text-black" style={{ background: 'linear-gradient(to right, #f97316, #f59e0b)' }}>New set</button>
            <button onClick={() => setOpen(false)} className="rounded-xl px-5 py-2 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Done</button>
          </div>
        </div>
      );
    }
    if (!current) return null;
    return (
      <>
        {/* progress dots */}
        <div className="mb-6 flex items-center justify-center gap-1.5">
          {queue.map((_, i) => (
            <span key={i} className="rounded-full transition-all" style={{
              width: i === idx ? 20 : 7, height: 7,
              background: i < idx ? ACCENT : i === idx ? '#818cf8' : 'rgba(255,255,255,0.12)',
            }} />
          ))}
        </div>

        {current.format === 'assertion_reason' && (
          <div className="mb-3 space-y-1 rounded-xl border p-3 text-sm" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}>
            <p><b>Assertion (A):</b> <Md>{current.assertion ?? ''}</Md></p>
            <p><b>Reason (R):</b> <Md>{current.reason ?? ''}</Md></p>
          </div>
        )}

        <p className="mb-3 text-[15px] leading-relaxed text-white/90">
          <span className="mr-2 text-xs font-bold" style={{ color: '#818cf8' }}>Q{idx + 1}.</span>
          <Md>{current.question}</Md>
        </p>
        {current.image_src && <img src={current.image_src} alt="" className="mb-4 max-h-64 rounded-lg" />}

        <div className="mb-4 flex flex-col gap-2">
          {current.options.map((opt, i) => {
            const isCorrect = i === current.correct_index;
            const chosen = picked === i;
            let border = 'rgba(255,255,255,0.08)', bg = 'transparent', color = 'rgba(255,255,255,0.6)';
            if (answered && !isTest) {
              if (isCorrect) { border = 'rgba(52,211,153,0.5)'; bg = 'rgba(52,211,153,0.08)'; color = '#a7f3d0'; }
              else if (chosen) { border = 'rgba(248,113,113,0.5)'; bg = 'rgba(248,113,113,0.08)'; color = '#fecaca'; }
              else color = 'rgba(255,255,255,0.25)';
            }
            return (
              <button key={i} disabled={answered} onClick={() => choose(i)}
                className={`rounded-xl px-4 py-3 text-left text-sm transition-all ${!answered ? 'hover:border-indigo-500/40 hover:bg-indigo-500/5' : ''}`}
                style={{ border: `1.5px solid ${border}`, background: bg, color }}>
                <span className="mr-2 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{String.fromCharCode(65 + i)}.</span>
                <Md>{opt}</Md>
              </button>
            );
          })}
        </div>

        {phase === 'feedback' && current.explanation && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
            <Md>{current.explanation}</Md>
          </div>
        )}

        <div className="flex justify-end">
          {phase === 'feedback' ? (
            <button onClick={() => advance()} className="rounded-xl px-5 py-2 text-sm font-semibold"
              style={{ background: 'rgba(129,140,248,0.12)', border: '1.5px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
              {idx + 1 >= total ? 'See results' : 'Next →'}
            </button>
          ) : isTest ? (
            <span className="text-xs text-white/40">Question {idx + 1} of {total}</span>
          ) : null}
        </div>
      </>
    );
  }

  // ── Modal (portal) ───────────────────────────────────────────────────────────
  const modal = mounted && open ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={requestClose} />
      <div role="dialog" aria-modal="true" aria-label={label}
        className="relative z-10 flex h-full w-full flex-col overflow-y-auto border-white/10 bg-[#0B0F15] p-6 sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-2xl sm:border">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{isTest ? 'Chapter Test' : 'Chapter Practice'}</span>
          <button onClick={requestClose} aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white/80">✕</button>
        </div>
        {sessionContent()}
      </div>
    </div>, document.body) : null;

  // ── Launcher ─────────────────────────────────────────────────────────────────
  // Editor preview → inline card. Reader → floating button (portal).
  if (previewMode) {
    return (
      <>
        <div className="my-8 rounded-2xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{isTest ? 'Chapter Test' : 'Chapter Practice'}</p>
          <h3 className="mt-1 text-lg font-bold text-white/90">{label}</h3>
          {block.intro && <p className="mt-1 text-sm text-white/55">{block.intro}</p>}
          {count === null ? <p className="mt-4 text-sm text-white/40">Loading questions…</p>
            : count === 0 ? <p className="mt-4 text-sm text-white/40">No practice questions for this chapter yet.</p>
            : (
              <button onClick={launch} className="mt-4 rounded-xl px-5 py-2.5 text-sm font-bold text-black"
                style={{ background: 'linear-gradient(to right, #f97316, #f59e0b)' }}>
                Open practice — {Math.min(sessionSize, count)} question{Math.min(sessionSize, count) !== 1 ? 's' : ''} →
              </button>
            )}
          <p className="mt-3 text-xs text-white/30">In the live reader this opens as a centered modal, launched from a floating button.</p>
        </div>
        {modal}
      </>
    );
  }

  const floating = mounted && count ? createPortal(
    <button onClick={launch}
      className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-black shadow-lg shadow-black/40 transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      style={{ background: 'linear-gradient(to right, #f97316, #f59e0b)' }}>
      <span aria-hidden>✎</span>{label}
    </button>, document.body) : null;

  return <>{floating}{modal}</>;
}
