'use client';

import { LatexBlock } from '@/types/books';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props { block: LatexBlock; onChange: (p: Partial<LatexBlock>) => void; }

export default function LatexBlockEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-white/40 mb-1 block">LaTeX (no $$ needed)</label>
        <textarea
          value={block.latex}
          onChange={(e) => onChange({ latex: e.target.value })}
          rows={3}
          placeholder="\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-none focus:outline-none
            focus:border-orange-500/40 font-mono"
        />
      </div>

      {/* Live preview */}
      {block.latex && (
        <div className="p-3 bg-[#0B0F15] border border-white/10 rounded-lg overflow-x-auto">
          <p className="text-xs text-white/30 mb-1">Preview</p>
          <div className="text-white/90">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {`$$${block.latex}$$`}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Label</label>
          <input value={block.label ?? ''} onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Equation 3.1"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Note</label>
          <input value={block.note ?? ''} onChange={(e) => onChange({ note: e.target.value })}
            placeholder="Brief explanation"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>
    </div>
  );
}
