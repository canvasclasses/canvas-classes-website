'use client';

import { useState } from 'react';
import { CuriosityPromptBlock } from '@/types/books';

export default function CuriosityPromptRenderer({ block }: { block: CuriosityPromptBlock }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-8 rounded-2xl border border-teal-500/20 bg-teal-500/[0.04] px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-teal-400 font-bold">✦</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400/70">
          Think About It
        </span>
      </div>

      <p className="text-[16px] leading-relaxed text-white/85 font-medium mb-3">
        {block.prompt}
      </p>

      {block.hint && !revealed && (
        <p className="text-[13px] text-white/35 italic mb-3">{block.hint}</p>
      )}

      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-[12px] font-semibold text-teal-400/60 hover:text-teal-400 transition-colors flex items-center gap-1.5"
        >
          I&apos;ve thought about it →
        </button>
      )}

      {revealed && block.reveal && (
        <div className="mt-3 pt-3 border-t border-white/8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400/60 mb-1.5">
            Here&apos;s what&apos;s interesting
          </p>
          <p className="text-[14px] text-white/60 leading-relaxed">{block.reveal}</p>
        </div>
      )}

      {revealed && !block.reveal && (
        <p className="text-[13px] text-teal-400/50 italic mt-2">
          Keep that thought — you&apos;ll find out as you read.
        </p>
      )}
    </div>
  );
}
