'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { WorkedExampleBlock } from '@/types/books';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  block: WorkedExampleBlock;
}

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[15px] leading-[1.8] text-white/82 my-2">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-amber-200">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-white/65">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2 pl-5 space-y-1 list-disc marker:text-white/30">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2 pl-5 space-y-1 list-decimal marker:text-white/40">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[15px] leading-[1.75] text-white/78">{children}</li>
  ),
};

export default function WorkedExampleRenderer({ block }: Props) {
  const [revealed, setRevealed] = useState(block.reveal_mode === 'always_visible');

  const isNcert = block.variant === 'ncert_intext';

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
      {/* Header */}
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
          <div className="text-[15px] text-white/80 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={mdComponents}
            >
              {block.problem}
            </ReactMarkdown>
          </div>
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
                <button
                  onClick={() => setRevealed(false)}
                  className={`ml-auto text-xs flex items-center gap-1 opacity-60 hover:opacity-100 ${labelClass}`}
                >
                  <ChevronUp size={12} /> Hide
                </button>
              )}
            </div>
            <div className="text-[15px] text-white/80 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={mdComponents}
              >
                {block.solution}
              </ReactMarkdown>
            </div>

            {block.video_src && (
              <div className="mt-4">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}>
                  Video Walkthrough
                </p>
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
