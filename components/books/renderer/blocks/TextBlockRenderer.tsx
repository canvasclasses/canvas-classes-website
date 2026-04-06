'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { TextBlock } from '@/types/books';

export default function TextBlockRenderer({ block }: { block: TextBlock }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed
      prose-p:my-2 prose-headings:text-white prose-strong:text-white
      prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
      prose-code:bg-white/10 prose-code:px-1 prose-code:rounded prose-code:text-amber-300
      prose-pre:bg-[#0B0F15] prose-pre:border prose-pre:border-white/10
      prose-blockquote:border-l-orange-500 prose-blockquote:text-white/60
      prose-li:my-0.5">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {block.markdown}
      </ReactMarkdown>
    </div>
  );
}
