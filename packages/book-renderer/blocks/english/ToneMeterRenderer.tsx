'use client';

import { useState } from 'react';
import { ToneMeterBlock } from '@canvas/data/types/books';

const INTENSITY_COLOR = ['#94a3b8', '#a78bfa', '#60a5fa', '#fb923c', '#f87171'];

export default function ToneMeterRenderer({ block, hinglish }: { block: ToneMeterBlock; hinglish?: boolean }) {
  const [active, setActive] = useState<number>(0);
  const seg = block.segments[active];
  const note = hinglish && seg.note_hinglish ? seg.note_hinglish : seg.note;

  return (
    <div className="my-8 rounded-2xl border border-rose-400/15 bg-rose-400/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-rose-300 font-bold">♥</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300/70">
          Emotional Arc
        </span>
      </div>

      <div
        className="rounded-xl p-4 mb-4"
        style={{
          background: 'rgba(0,0,0,0.2)',
          minHeight: 120,
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {seg.emotion} · intensity {seg.intensity}/5
        </div>
        <div
          className="italic text-[15px] leading-relaxed mb-3 font-serif"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          “{seg.excerpt}”
        </div>
        <div className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {note}
        </div>
      </div>

      {/* Meter bars */}
      <div className="flex items-end gap-1.5 px-2" style={{ height: 60 }}>
        {block.segments.map((s, i) => {
          const isActive = i === active;
          const color = INTENSITY_COLOR[Math.min(s.intensity - 1, 4)];
          return (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className="flex-1 rounded-t transition-all"
              style={{
                height: `${(s.intensity / 5) * 100}%`,
                background: isActive ? color : `${color}40`,
                border: `1.5px solid ${isActive ? color : 'transparent'}`,
                borderBottom: 'none',
                cursor: 'pointer',
                minHeight: 8,
              }}
              aria-label={`${s.emotion}, intensity ${s.intensity}`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-1 px-2">
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          start
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          end
        </span>
      </div>
    </div>
  );
}
