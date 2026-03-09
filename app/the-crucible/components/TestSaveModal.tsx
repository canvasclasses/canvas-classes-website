'use client';

import { X } from 'lucide-react';

interface TestSaveModalProps {
  score: number;
  total: number;
  timeSpent: string;
  onSave: () => void;
  onDiscard: () => void;
}

export default function TestSaveModal({ score, total, timeSpent, onSave, onDiscard }: TestSaveModalProps) {
  const percentage = Math.round((score / total) * 100);
  const isPassing = percentage >= 60;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-[#12141f] border border-white/12 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Test Complete!</h2>
          <button
            onClick={onDiscard}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Score Display */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className={`text-5xl font-black mb-2 ${isPassing ? 'text-green-400' : 'text-amber-400'}`}>
              {score}/{total}
            </div>
            <div className={`text-2xl font-bold ${isPassing ? 'text-green-400/80' : 'text-amber-400/80'}`}>
              {percentage}%
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>{score} Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span>{total - score} Wrong</span>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-white/50">
            Time: {timeSpent}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-white/70 leading-relaxed">
            <strong className="text-white">Save this test to your progress?</strong>
            <br />
            Saving will update your mastery levels and help personalize future tests. 
            Discard if this was just casual practice.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors font-medium"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all font-bold shadow-lg shadow-indigo-500/20"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
