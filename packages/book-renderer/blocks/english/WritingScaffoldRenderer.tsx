'use client';

import { useState } from 'react';
import { WritingScaffoldBlock, ScaffoldPart } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

function Part({ part, index }: { part: ScaffoldPart; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 last:mb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left rounded-xl px-4 py-3 transition-all"
        style={{
          background: open ? 'rgba(168,162,158,0.08)' : 'rgba(255,255,255,0.025)',
          border: `1.5px solid ${open ? 'rgba(214,211,209,0.3)' : 'rgba(255,255,255,0.07)'}`,
          cursor: 'pointer',
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(214,211,209,0.7)' }}>
            {String(index + 1).padStart(2, '0')} · {part.label}
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {open ? 'hide ✕' : 'why this works'}
          </span>
        </div>
        <div
          className="text-[14px] leading-relaxed font-serif whitespace-pre-wrap"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          {part.text}
        </div>
      </button>
      {open && (
        <div
          className="rounded-xl px-4 py-3 mt-1.5"
          style={{
            background: 'rgba(168,162,158,0.06)',
            border: '1px solid rgba(214,211,209,0.2)',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(214,211,209,0.55)' }}>
            Why this works
          </div>
          <InlineMarkdown paragraphClassName="text-[13px] leading-relaxed">
            {part.annotation}
          </InlineMarkdown>
        </div>
      )}
    </div>
  );
}

export default function WritingScaffoldRenderer({ block }: { block: WritingScaffoldBlock }) {
  return (
    <div className="my-8 rounded-2xl border border-stone-400/15 bg-stone-400/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-stone-300 font-bold">✎</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300/70">
          Writing Workshop · {block.format.replace('_', ' ')}
        </span>
      </div>

      <div
        className="rounded-xl p-4 mb-5"
        style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          The Task
        </div>
        <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
          {block.task}
        </p>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(214,211,209,0.5)' }}>
        Model Answer — tap any part to see why it works
      </div>

      {block.model_parts.map((p, i) => (
        <Part key={p.id} part={p} index={i} />
      ))}

      {block.tips && block.tips.length > 0 && (
        <div
          className="mt-5 rounded-xl px-4 py-3"
          style={{ background: 'rgba(168,162,158,0.04)', border: '1px solid rgba(214,211,209,0.15)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(214,211,209,0.6)' }}>
            Tips
          </div>
          <ul className="space-y-1.5">
            {block.tips.map((t, i) => (
              <li key={i} className="text-[13px] leading-relaxed flex gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: 'rgba(214,211,209,0.5)' }}>▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
