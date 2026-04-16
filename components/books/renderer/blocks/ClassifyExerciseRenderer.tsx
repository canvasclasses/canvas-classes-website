'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ClassifyExerciseBlock } from '@/types/books';

interface RowState {
  answered: boolean;
  wasCorrect: boolean;
  studentSaidYes: boolean;
}

export default function ClassifyExerciseRenderer({ block }: { block: ClassifyExerciseBlock }) {
  const [rowStates, setRowStates] = useState<RowState[]>(
    block.rows.map(() => ({ answered: false, wasCorrect: false, studentSaidYes: false }))
  );

  function answer(idx: number, studentSaysYes: boolean) {
    if (rowStates[idx].answered) return; // locked after first answer
    const wasCorrect = studentSaysYes === block.rows[idx].is_solution;
    setRowStates(prev => {
      const next = [...prev];
      next[idx] = { answered: true, wasCorrect, studentSaidYes: studentSaysYes };
      return next;
    });
  }

  const answeredCount = rowStates.filter(s => s.answered).length;
  const correctCount  = rowStates.filter(s => s.answered && s.wasCorrect).length;
  const allDone = answeredCount === block.rows.length;

  return (
    <div className="my-8">

      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-orange-400/70 mb-1.5 select-none">
          From your teacher&rsquo;s quick question
        </p>
        <p className="text-[17px] font-semibold text-white/90 leading-snug">
          {block.question}
        </p>
      </div>

      {/* Column labels */}
      <div className="grid gap-x-3 px-4 py-1.5 mb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-white/25 select-none"
        style={{ gridTemplateColumns: '1fr auto' }}>
        <span>{block.column_label ?? 'Substance'}</span>
        <span>Solution?</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1.5">
        {block.rows.map((row, idx) => {
          const state = rowStates[idx];
          return (
            <div
              key={idx}
              className={`rounded-xl border overflow-hidden transition-all duration-200
                ${state.answered
                  ? state.wasCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/20'
                    : 'border-red-500/25 bg-red-950/15'
                  : 'border-white/8 bg-white/[0.02] hover:border-white/14'
                }`}
            >
              {/* Main row */}
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Name + result icon */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {state.answered && (
                    state.wasCorrect
                      ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      : <XCircle     size={15} className="text-red-400 shrink-0" />
                  )}
                  <span className={`text-[15px] font-medium truncate
                    ${state.answered
                      ? state.wasCorrect ? 'text-white/88' : 'text-white/65'
                      : 'text-white/80'
                    }`}>
                    {row.substance}
                  </span>
                </div>

                {/* Buttons or answer badge */}
                <div className="flex gap-2 shrink-0">
                  {!state.answered ? (
                    <>
                      <button
                        onClick={() => answer(idx, true)}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold
                          border border-emerald-500/20 text-emerald-400/75
                          hover:bg-emerald-500/12 hover:border-emerald-400/40 hover:text-emerald-300
                          transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => answer(idx, false)}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold
                          border border-red-500/20 text-red-400/75
                          hover:bg-red-500/12 hover:border-red-400/40 hover:text-red-300
                          transition-colors"
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold
                      ${row.is_solution
                        ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/20'
                        : 'bg-red-500/12 text-red-300 border border-red-500/20'
                      }`}>
                      {row.is_solution ? '✓ Solution' : '✗ Not a solution'}
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation — visible only after answering */}
              {state.answered && (
                <div className="px-4 pb-3.5">
                  <div className={`flex items-start gap-2 ${!state.wasCorrect ? 'pl-0' : 'pl-6'}`}>
                    {!state.wasCorrect && (
                      <span className="text-[11px] font-semibold text-red-400/70 shrink-0 pt-0.5 leading-[1.65]">
                        {state.studentSaidYes ? 'Not quite —' : 'Actually —'}
                      </span>
                    )}
                    <p className="text-[13px] leading-[1.65] text-white/52">
                      {row.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score footer */}
      {answeredCount > 0 && (
        <div className="mt-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.025] border border-white/5">
          <span className="text-[12px] text-white/35">
            {answeredCount} of {block.rows.length} answered
          </span>
          <span className={`text-[13px] font-semibold
            ${allDone
              ? correctCount === block.rows.length
                ? 'text-emerald-400'
                : correctCount >= Math.ceil(block.rows.length * 0.7)
                  ? 'text-amber-400'
                  : 'text-red-400'
              : 'text-white/45'
            }`}>
            {correctCount} / {answeredCount} correct
            {allDone && correctCount === block.rows.length && ' 🎯'}
          </span>
        </div>
      )}
    </div>
  );
}
