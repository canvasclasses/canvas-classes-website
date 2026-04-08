'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { TextBlock } from '@/types/books';
import type { Components } from 'react-markdown';

// Explicit component overrides — more reliable than prose modifier classes
// which can be tree-shaken or fail to apply in Tailwind v4.
const components: Components = {
  h2: ({ children }) => (
    <h2 className="text-[22px] font-bold text-white mt-10 mb-3 tracking-tight leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[17px] font-semibold text-white/90 mt-7 mb-2 tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] leading-[1.85] text-white/82 my-4">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/75">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-3 pl-5 space-y-1.5 list-disc marker:text-white/30">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 pl-5 space-y-1.5 list-decimal marker:text-white/40">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-[15px] leading-[1.75] text-white/78">{children}</li>
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  blockquote: ({ children }) => (
    <blockquote className="my-5 pl-4 border-l-2 border-orange-500/40 text-white/60 not-italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className={`block bg-[#0B0F15] border border-white/10 rounded-lg p-4 text-[13px] text-amber-300 overflow-x-auto ${className}`}>
        {children}
      </code>
    ) : (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] text-amber-300">
        {children}
      </code>
    );
  },
  a: ({ href, children }) => (
    <a href={href} className="text-orange-400 no-underline hover:underline">
      {children}
    </a>
  ),
};

export default function TextBlockRenderer({ block }: { block: TextBlock }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {block.markdown}
      </ReactMarkdown>
    </div>
  );
}
