'use client';

import { useState } from 'react';
import { InlineQuizBlock } from '@/types/books';
import { Trophy, RotateCcw } from 'lucide-react';

interface Props {
  block: InlineQuizBlock;
  onPass?: (score: number) => void;
}

export default function InlineQuizRenderer({ block, onPass }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  const allAnswered = block.questions.every(q => answers[q.id] !== undefined);

  function submit() {
    const correct = block.questions.filter(q => answers[q.id] === q.correct_index).length;
    const score = Math.round((correct / block.questions.length) * 100);
    const didPass = correct / block.questions.length >= block.pass_threshold;
    setSubmitted(true);
    setPassed(didPass);
    if (didPass) onPass?.(score);
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setPassed(false);
  }

  const correctCount = submitted
    ? block.questions.filter(q => answers[q.id] === q.correct_index).length
    : 0;
  const scorePercent = submitted ? Math.round((correctCount / block.questions.length) * 100) : 0;

  return (
    <div className="my-6 border border-violet-500/20 rounded-2xl overflow-hidden bg-violet-500/5">
      <div className="px-5 py-3 border-b border-violet-500/20 flex items-center gap-2">
        <span className="text-lg">🧠</span>
        <span className="text-sm font-semibold text-violet-300">Quick Check</span>
        <span className="ml-auto text-xs text-violet-400/60">
          Pass at {Math.round(block.pass_threshold * 100)}%
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-6">
        {block.questions.map((q, qi) => (
          <div key={q.id}>
            <p className="text-sm text-white/90 mb-3">
              <span className="text-violet-400 font-semibold mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const isCorrect = oi === q.correct_index;
                let cls = 'border border-white/10 bg-white/5 text-white/70';
                if (submitted) {
                  if (isCorrect) cls = 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
                  else if (chosen) cls = 'border border-red-500/60 bg-red-500/10 text-red-300';
                  else cls = 'border border-white/5 bg-transparent text-white/30';
                } else if (chosen) {
                  cls = 'border border-violet-500/60 bg-violet-500/15 text-violet-200';
                }

                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${cls} ${
                      !submitted ? 'hover:border-violet-500/40 hover:bg-violet-500/10' : ''
                    }`}
                  >
                    <span className="text-white/40 mr-2">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                    {submitted && isCorrect && <span className="ml-2 text-emerald-400">✓</span>}
                    {submitted && chosen && !isCorrect && <span className="ml-2 text-red-400">✗</span>}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="mt-2 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-2 border border-white/8">
                {q.explanation}
              </p>
            )}
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${
              allAnswered
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-white/5 text-white/25 cursor-not-allowed'
            }`}
          >
            Submit Answers
          </button>
        ) : (
          <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
            passed
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            {passed ? <Trophy size={16} className="text-emerald-400 shrink-0" /> : <RotateCcw size={16} className="text-red-400 shrink-0" />}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${passed ? 'text-emerald-300' : 'text-red-300'}`}>
                {passed ? 'Nice work! You passed.' : 'Not quite — try again.'}
              </p>
              <p className="text-xs text-white/40">
                {correctCount}/{block.questions.length} correct · {scorePercent}%
              </p>
            </div>
            {!passed && (
              <button onClick={retry} className="text-xs text-white/50 hover:text-white/80 transition-colors">
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
