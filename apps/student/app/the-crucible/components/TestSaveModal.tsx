'use client';

import { Check, X } from 'lucide-react';

interface TestSaveModalProps {
  score: number;
  total: number;
  timeSpent: string;
  /** Single CTA — close the modal and proceed to the review screen.
   *  Test data is already persisted by TestView before this modal opens; the
   *  old onSave/onDiscard pair was an UX trap (Discard nuked the test). */
  onContinue: () => void;
}

export default function TestSaveModal({ score, total, timeSpent, onContinue }: TestSaveModalProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isPassing = percentage >= 60;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#13151E] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400 mb-1 inline-flex items-center gap-1.5">
              <Check className="w-3 h-3" strokeWidth={3} />
              Test saved
            </div>
            <h2 className="text-[20px] font-bold text-white tracking-tight">Test complete</h2>
          </div>
          <button
            onClick={onContinue}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Score */}
        <div className="text-center mb-5">
          <div className={`text-[48px] font-black leading-none mb-1 ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
            {score}<span className="text-white/30">/{total}</span>
          </div>
          <div className={`text-[18px] font-bold ${isPassing ? 'text-emerald-300' : 'text-amber-300'}`}>
            {percentage}%
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-center">
            <div className="font-mono text-[16px] text-emerald-300 tabular-nums leading-none">{score}</div>
            <div className="text-[9.5px] uppercase tracking-wide text-emerald-400/70 font-bold mt-1">Correct</div>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/25 p-3 text-center">
            <div className="font-mono text-[16px] text-red-300 tabular-nums leading-none">{total - score}</div>
            <div className="text-[9.5px] uppercase tracking-wide text-red-400/70 font-bold mt-1">Wrong</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
            <div className="font-mono text-[16px] text-white tabular-nums leading-none">{timeSpent}</div>
            <div className="text-[9.5px] uppercase tracking-wide text-white/45 font-bold mt-1">Time</div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-[14px] hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          Review answers
        </button>
      </div>
    </div>
  );
}
