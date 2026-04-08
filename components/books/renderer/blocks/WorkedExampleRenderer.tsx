'use client';

import { useState } from 'react';
import { WorkedExampleBlock } from '@/types/books';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  block: WorkedExampleBlock;
}

export default function WorkedExampleRenderer({ block }: Props) {
  const [revealed, setRevealed] = useState(block.reveal_mode === 'always_visible');

  const isNcert = block.variant === 'ncert_intext';
  const accentColor = isNcert ? 'blue' : 'amber';

  const borderClass = isNcert
    ? 'border-blue-500/25 bg-blue-500/5'
    : 'border-amber-500/25 bg-amber-500/5';
  const headerClass = isNcert
    ? 'border-blue-500/20 text-blue-300'
    : 'border-amber-500/20 text-amber-300';
  const labelClass = isNcert ? 'text-blue-400' : 'text-amber-400';
  const revealBtnClass = isNcert
    ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
    : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10';

  return (
    <div className={`my-6 border rounded-2xl overflow-hidden ${borderClass}`}>
      <div className={`px-5 py-3 border-b flex items-center gap-2 ${headerClass}`}>
        <span className="text-base">{isNcert ? '📖' : '📘'}</span>
        <span className="text-sm font-semibold">{block.label}</span>
        <span className={`ml-auto text-xs ${labelClass}/60`}>
          {isNcert ? 'NCERT Intext' : 'Solved Example'}
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Problem */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}>Problem</p>
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{block.problem}</p>
        </div>

        {/* Solution */}
        {block.reveal_mode === 'tap_to_reveal' && !revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${revealBtnClass}`}
          >
            <ChevronDown size={15} /> Show Solution
          </button>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className={`text-xs font-semibold uppercase tracking-wider ${labelClass}`}>Solution</p>
              {block.reveal_mode === 'tap_to_reveal' && revealed && (
                <button onClick={() => setRevealed(false)} className={`ml-auto text-xs flex items-center gap-1 ${labelClass}/60 hover:${labelClass}`}>
                  <ChevronUp size={12} /> Hide
                </button>
              )}
            </div>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{block.solution}</p>

            {/* Walkthrough video */}
            {block.video_src && (
              <div className="mt-4">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}>Video Walkthrough</p>
                <video
                  src={block.video_src}
                  controls
                  className="w-full rounded-xl bg-black"
                  preload="metadata"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
