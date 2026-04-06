'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { LatexBlock } from '@/types/books';

export default function LatexBlockRenderer({ block }: { block: LatexBlock }) {
  // Wrap in $$ so remark-math treats it as block (display) math
  const source = `$$${block.latex}$$`;

  return (
    <div className="my-4 overflow-x-auto">
      <div className="flex flex-col items-center gap-1">
        <div className="text-white/90 text-lg">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {source}
          </ReactMarkdown>
        </div>

        {block.label && (
          <p className="text-xs text-white/40 font-mono">{block.label}</p>
        )}
        {block.note && (
          <p className="text-sm text-white/60 italic mt-1">{block.note}</p>
        )}
      </div>
    </div>
  );
}
