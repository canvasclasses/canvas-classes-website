'use client';

import { PracticeLinkBlock } from '@/types/books';

interface Props { block: PracticeLinkBlock; onChange: (p: Partial<PracticeLinkBlock>) => void; }

export default function PracticeLinkEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-white/40 mb-1 block">Button label</label>
        <input value={block.label} onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Test yourself on this section"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Style</label>
        <div className="flex gap-2">
          {(['link_to_crucible', 'inline_quiz'] as const).map((s) => (
            <button key={s} onClick={() => onChange({ style: s })}
              className={`px-3 py-1 rounded-lg text-xs transition-colors
                ${block.style === s
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {s === 'link_to_crucible' ? 'Link to Crucible' : 'Inline Quiz'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">
          Question IDs <span className="text-white/25">(comma-separated, e.g. ATOM-001, ATOM-002)</span>
        </label>
        <input
          value={block.question_ids.join(', ')}
          onChange={(e) => onChange({
            question_ids: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
          })}
          placeholder="ATOM-001, ATOM-002"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">
          Or by chapter tag <span className="text-white/25">(overrides IDs)</span>
        </label>
        <input value={block.chapter_tag ?? ''} onChange={(e) => onChange({ chapter_tag: e.target.value || undefined })}
          placeholder="tag_atom_3"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>
    </div>
  );
}
