'use client';

import { HeadingBlock } from '@/types/books';

interface Props { block: HeadingBlock; onChange: (p: Partial<HeadingBlock>) => void; }

export default function HeadingBlockEditor({ block, onChange }: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Level</label>
        <div className="flex gap-1">
          {([1, 2, 3] as const).map((l) => (
            <button
              key={l}
              onClick={() => onChange({ level: l })}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors
                ${block.level === l
                  ? 'bg-orange-500 text-black'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}
            >
              H{l + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-xs text-white/40">Text</label>
        <input
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Heading text…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
        />
      </div>
    </div>
  );
}
