'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CalloutBlock, CalloutVariant } from '@/types/books';

const VARIANT_CONFIG: Record<CalloutVariant, {
  icon: string;
  borderColor: string;
  bgColor: string;
  titleColor: string;
  defaultTitle: string;
}> = {
  remember: {
    icon: '🔁',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/10',
    titleColor: 'text-blue-400',
    defaultTitle: 'Remember',
  },
  note: {
    icon: '📝',
    borderColor: 'border-white/20',
    bgColor: 'bg-white/5',
    titleColor: 'text-white/70',
    defaultTitle: 'Note',
  },
  warning: {
    icon: '⚠️',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/10',
    titleColor: 'text-red-400',
    defaultTitle: 'Warning',
  },
  exam_tip: {
    icon: '🎯',
    borderColor: 'border-orange-500/40',
    bgColor: 'bg-orange-500/10',
    titleColor: 'text-orange-400',
    defaultTitle: 'Exam Tip',
  },
  fun_fact: {
    icon: '💡',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    titleColor: 'text-emerald-400',
    defaultTitle: 'Fun Fact',
  },
};

export default function CalloutBlockRenderer({ block }: { block: CalloutBlock }) {
  const cfg = VARIANT_CONFIG[block.variant];

  return (
    <div className={`my-4 p-4 rounded-xl border ${cfg.borderColor} ${cfg.bgColor}`}>
      <div className={`flex items-center gap-2 font-semibold text-sm mb-2 ${cfg.titleColor}`}>
        <span>{cfg.icon}</span>
        <span>{block.title ?? cfg.defaultTitle}</span>
      </div>
      <div className="text-sm text-white/80 prose prose-invert prose-sm max-w-none
        prose-p:my-1 prose-li:my-0.5">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {block.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
