'use client';

import { CuriosityPromptBlock } from '@/types/books';

interface Props {
  block: CuriosityPromptBlock;
  onChange: (p: Partial<CuriosityPromptBlock>) => void;
}

export default function CuriosityPromptBlockEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-white/40 mb-1 block">
          Prompt <span className="text-red-400">*</span>
        </label>
        <textarea
          value={block.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          rows={3}
          placeholder="Open-ended question answerable with zero prior knowledge of this topic…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-teal-500/40 font-mono leading-relaxed"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Hint (optional)</label>
        <input
          value={block.hint ?? ''}
          onChange={(e) => onChange({ hint: e.target.value || undefined })}
          placeholder="One-line nudge if the student feels stuck…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-500/40"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">
          Reflection reveal (optional)
        </label>
        <textarea
          value={block.reveal ?? ''}
          onChange={(e) => onChange({ reveal: e.target.value || undefined })}
          rows={3}
          placeholder="Teacher-voice reflection shown after 'I've thought about it'. Frame as 'here's what's interesting', not 'here's the answer'…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-teal-500/40 font-mono leading-relaxed"
        />
      </div>

      <p className="text-[11px] text-white/25">
        Block 0 only · No options · No correct answer · Primes curiosity before the concept is introduced
      </p>
    </div>
  );
}
