'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { InlineQuizBlock } from '@/types/books';

interface Props {
  block: InlineQuizBlock;
  onPass?: (score: number) => void;
}

// ── Markdown pipeline ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkPlugins = [remarkMath, remarkGfm] as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypePlugins = [rehypeKatex] as any[];

const Md = ({ children }: { children: string }) => (
  <ReactMarkdown
    remarkPlugins={remarkPlugins}
    rehypePlugins={rehypePlugins}
    components={{ p: ({ children: c }) => <span>{c}</span> }}
  >
    {children}
  </ReactMarkdown>
);

// ── Component ─────────────────────────────────────────────────────────────────

export default function InlineQuizRenderer({ block, onPass }: Props) {
  const [current, setCurrent]   = useState(0);
  const [locked, setLocked]     = useState<number | null>(null); // chosen option for current q
  const [results, setResults]   = useState<{ chosen: number; correct: boolean }[]>([]);
  const [done, setDone]         = useState(false);

  const q         = block.questions[current];
  const total     = block.questions.length;
  const isLast    = current === total - 1;

  function choose(i: number) {
    if (locked !== null) return; // already answered
    setLocked(i);
  }

  function advance() {
    if (locked === null) return;
    const isCorrect = locked === q.correct_index;
    const newResults = [...results, { chosen: locked, correct: isCorrect }];
    setResults(newResults);

    if (isLast) {
      const passed = newResults.filter(r => r.correct).length / total >= block.pass_threshold;
      const score  = Math.round((newResults.filter(r => r.correct).length / total) * 100);
      setDone(true);
      if (passed) onPass?.(score);
    } else {
      setCurrent(c => c + 1);
      setLocked(null);
    }
  }

  function retry() {
    setCurrent(0);
    setLocked(null);
    setResults([]);
    setDone(false);
  }

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (done) {
    const correct = results.filter(r => r.correct).length;
    const passed  = correct / total >= block.pass_threshold;
    const pct     = Math.round((correct / total) * 100);

    return (
      <div className="my-8">
        {/* Divider label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Quick Check
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div className="text-center py-4">
          <p
            className="text-4xl font-black mb-1"
            style={{ color: passed ? '#34d399' : '#f87171' }}
          >
            {pct}%
          </p>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {correct} of {total} correct
          </p>
          <p className="text-sm font-semibold mb-6" style={{ color: passed ? '#34d399' : '#f87171' }}>
            {passed ? 'You passed.' : 'Not quite — give it another try.'}
          </p>

          {!passed && (
            <button
              onClick={retry}
              className="text-sm font-semibold px-5 py-2 rounded-xl transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Active question ─────────────────────────────────────────────────────────
  const isAnswered = locked !== null;
  const isCorrect  = isAnswered && locked === q.correct_index;

  return (
    <div className="my-8">
      {/* Divider label + progress dots */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Quick Check
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {block.questions.map((_, i) => {
          const isDone      = i < current;
          const isCurrent   = i === current;
          const wasCorrect  = isDone && results[i]?.correct;
          return (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:  isCurrent ? 20 : 7,
                height: 7,
                background: isDone
                  ? (wasCorrect ? '#34d399' : '#f87171')
                  : isCurrent
                  ? '#818cf8'
                  : 'rgba(255,255,255,0.12)',
              }}
            />
          );
        })}
      </div>

      {/* Question */}
      <p className="text-[15px] leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.88)' }}>
        <span className="text-xs font-bold mr-2" style={{ color: '#818cf8' }}>
          Q{current + 1}.
        </span>
        <Md>{q.question}</Md>
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-4">
        {q.options.map((opt, i) => {
          const chosen    = locked === i;
          const correct   = i === q.correct_index;

          let bg     = 'transparent';
          let border = 'rgba(255,255,255,0.08)';
          let color  = 'rgba(255,255,255,0.55)';
          let labelColor = 'rgba(255,255,255,0.2)';

          if (!isAnswered) {
            // hover handled via CSS class below
          } else if (correct) {
            bg = 'rgba(52,211,153,0.08)';
            border = 'rgba(52,211,153,0.5)';
            color = '#a7f3d0';
            labelColor = '#34d399';
          } else if (chosen) {
            bg = 'rgba(248,113,113,0.08)';
            border = 'rgba(248,113,113,0.5)';
            color = '#fecaca';
            labelColor = '#f87171';
          } else {
            color = 'rgba(255,255,255,0.18)';
            labelColor = 'rgba(255,255,255,0.1)';
          }

          return (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => choose(i)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                !isAnswered ? 'hover:border-indigo-500/40 hover:bg-indigo-500/5' : ''
              }`}
              style={{ border: `1.5px solid ${border}`, background: bg, color }}
            >
              <span className="text-xs font-bold mr-2" style={{ color: labelColor }}>
                {String.fromCharCode(65 + i)}.
              </span>
              <Md>{opt}</Md>
              {isAnswered && correct && (
                <span className="ml-2 text-xs" style={{ color: '#34d399' }}>✓</span>
              )}
              {isAnswered && chosen && !correct && (
                <span className="ml-2 text-xs" style={{ color: '#f87171' }}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && q.explanation && (
        <div
          className="text-sm leading-relaxed rounded-xl px-4 py-3 mb-4"
          style={{
            background: isCorrect ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)'}`,
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <Md>{q.explanation}</Md>
        </div>
      )}

      {/* Next / Finish */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            onClick={advance}
            className="text-sm font-semibold px-5 py-2 rounded-xl transition-all"
            style={{
              background: 'rgba(129,140,248,0.12)',
              border: '1.5px solid rgba(129,140,248,0.3)',
              color: '#a5b4fc',
            }}
          >
            {isLast ? 'See results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}
