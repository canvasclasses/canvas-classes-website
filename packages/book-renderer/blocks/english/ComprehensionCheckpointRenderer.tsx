'use client';

import { useState } from 'react';
import { ComprehensionCheckpointBlock, ComprehensionQuestion } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

function Question({ q }: { q: ComprehensionQuestion }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isMCQ = q.options && q.options.length > 0;
  const isAnswered = isMCQ ? chosen !== null : revealed;
  const isCorrect = isMCQ ? chosen === q.correct_index : true;

  return (
    <div
      className="rounded-xl p-4 mb-3 last:mb-0"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="text-[14px] font-medium mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
        <InlineMarkdown paragraphClassName="text-[14px] font-medium">
          {q.question}
        </InlineMarkdown>
      </div>

      {isMCQ && q.options && (
        <div className="flex flex-col gap-1.5 mb-3">
          {q.options.map((opt, i) => {
            const isThis = chosen === i;
            const isRight = q.correct_index === i;
            let bg = 'transparent';
            let border = 'rgba(255,255,255,0.08)';
            let color = 'rgba(255,255,255,0.6)';
            if (chosen !== null) {
              if (isRight) {
                bg = 'rgba(52,211,153,0.08)';
                border = 'rgba(52,211,153,0.4)';
                color = '#a7f3d0';
              } else if (isThis) {
                bg = 'rgba(248,113,113,0.08)';
                border = 'rgba(248,113,113,0.4)';
                color = '#fecaca';
              } else {
                color = 'rgba(255,255,255,0.25)';
              }
            }
            return (
              <button
                key={i}
                disabled={chosen !== null}
                onClick={() => setChosen(i)}
                className="text-left text-[13px] px-3 py-2 rounded-lg transition-all"
                style={{ background: bg, border: `1.5px solid ${border}`, color }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {!isMCQ && !revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-[12px] font-semibold"
          style={{ color: 'rgba(129,140,248,0.7)' }}
        >
          I&apos;ve thought about it →
        </button>
      )}

      {isAnswered && (
        <div
          className="text-[13px] leading-relaxed rounded-lg px-3 py-2.5 mt-2"
          style={{
            background: isCorrect ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)'}`,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          <InlineMarkdown paragraphClassName="text-[13px] leading-relaxed">
            {q.explanation}
          </InlineMarkdown>
        </div>
      )}
    </div>
  );
}

export default function ComprehensionCheckpointRenderer({ block }: { block: ComprehensionCheckpointBlock }) {
  return (
    <div className="my-8 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-300 font-bold">✓</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/70">
          {block.intro ? 'Check Your Understanding' : 'Pause and Check'}
        </span>
      </div>

      {block.intro && (
        <div className="mb-3">
          <InlineMarkdown paragraphClassName="text-[13px] italic text-white/55">
            {block.intro}
          </InlineMarkdown>
        </div>
      )}

      {block.questions.map((q) => (
        <Question key={q.id} q={q} />
      ))}
    </div>
  );
}
