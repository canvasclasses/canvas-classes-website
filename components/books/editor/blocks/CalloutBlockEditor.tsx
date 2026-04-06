'use client';

import { CalloutBlock, CalloutVariant } from '@/types/books';

const VARIANTS: { value: CalloutVariant; label: string; icon: string }[] = [
  { value: 'note',      label: 'Note',      icon: '📝' },
  { value: 'remember',  label: 'Remember',  icon: '🔁' },
  { value: 'warning',   label: 'Warning',   icon: '⚠️' },
  { value: 'exam_tip',  label: 'Exam Tip',  icon: '🎯' },
  { value: 'fun_fact',  label: 'Fun Fact',  icon: '💡' },
];

interface Props { block: CalloutBlock; onChange: (p: Partial<CalloutBlock>) => void; }

export default function CalloutBlockEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Variant</label>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((v) => (
            <button key={v.value} onClick={() => onChange({ variant: v.value })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors
                ${block.variant === v.value
                  ? 'bg-orange-500 text-black font-bold'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/20'}`}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Title (optional)</label>
        <input value={block.title ?? ''} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Override default title…"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Content (markdown)</label>
        <textarea value={block.markdown} onChange={(e) => onChange({ markdown: e.target.value })}
          rows={4} placeholder="Callout content…"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 resize-y focus:outline-none focus:border-orange-500/40 font-mono" />
      </div>
    </div>
  );
}
