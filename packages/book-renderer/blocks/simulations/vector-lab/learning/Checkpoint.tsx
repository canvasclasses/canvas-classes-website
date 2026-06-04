'use client';

// Checkpoint.tsx — an inline "predict-then-reveal" question. Research is clear
// that committing to a prediction BEFORE seeing the answer is what converts a
// demo into learning. Each module drops one of these in its sidebar; answering
// it marks the module complete.

import { useState } from 'react';
import { C } from '../lib/theme';

export function Checkpoint({
  question,
  options,
  correct,
  explain,
  onResolved,
}: {
  question: string;
  options: string[];
  correct: number;
  explain: string;
  onResolved?: (wasCorrect: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;

  const pick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    onResolved?.(i === correct);
  };

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(129,140,248,0.2)' }}>
      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: C.indigoLight }}>
        Predict first
      </p>
      <p className="text-white font-bold text-base leading-snug mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isCorrect = i === correct;
          const isPicked = i === picked;
          const bg = !revealed
            ? 'rgba(255,255,255,0.03)'
            : isCorrect
              ? 'rgba(52,211,153,0.12)'
              : isPicked
                ? 'rgba(248,113,113,0.12)'
                : 'rgba(255,255,255,0.02)';
          const border = !revealed
            ? 'rgba(255,255,255,0.1)'
            : isCorrect
              ? 'rgba(52,211,153,0.5)'
              : isPicked
                ? 'rgba(248,113,113,0.5)'
                : 'rgba(255,255,255,0.06)';
          const col = !revealed ? C.text : isCorrect ? C.emeraldLight : isPicked ? C.red : C.muted;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color: col, cursor: revealed ? 'default' : 'pointer' }}
            >
              {revealed && isCorrect ? '✓ ' : revealed && isPicked ? '✗ ' : ''}
              {opt}
            </button>
          );
        })}
      </div>
      {revealed ? (
        <p className="text-sm leading-snug mt-3" style={{ color: C.text2 }}>
          {explain}
        </p>
      ) : null}
    </div>
  );
}
