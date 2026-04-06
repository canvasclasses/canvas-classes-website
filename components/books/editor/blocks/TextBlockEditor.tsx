'use client';

import { TextBlock } from '@/types/books';

interface Props { block: TextBlock; onChange: (p: Partial<TextBlock>) => void; }

export default function TextBlockEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-white/40">Markdown (supports $LaTeX$)</label>
      <textarea
        value={block.markdown}
        onChange={(e) => onChange({ markdown: e.target.value })}
        rows={6}
        placeholder="Write content here…"
        className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
          text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-orange-500/40
          font-mono leading-relaxed"
      />
    </div>
  );
}
