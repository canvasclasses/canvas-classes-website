'use client';

import { useState } from 'react';
import { ThemeExplorerBlock, ThemeCard } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

function ThemePanel({ theme }: { theme: ThemeCard }) {
  const [showReflection, setShowReflection] = useState(false);
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(251,191,36,0.04)',
        border: '1.5px solid rgba(251,191,36,0.18)',
      }}
    >
      <div className="text-[15px] font-bold mb-2" style={{ color: '#fcd34d' }}>
        {theme.title}
      </div>
      <p className="text-[14px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {theme.description}
      </p>
      {theme.evidence.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {theme.evidence.map((e, i) => (
            <div
              key={i}
              className="text-[13px] italic leading-snug pl-3"
              style={{
                color: 'rgba(255,255,255,0.6)',
                borderLeft: '2px solid rgba(251,191,36,0.35)',
              }}
            >
              “{e}”
            </div>
          ))}
        </div>
      )}
      {!showReflection ? (
        <button
          onClick={() => setShowReflection(true)}
          className="text-[12px] font-semibold mt-2"
          style={{ color: 'rgba(252,211,77,0.7)' }}
        >
          Show reflection prompt →
        </button>
      ) : (
        <div
          className="mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(252,211,77,0.6)' }}>
            For You
          </div>
          <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/75">
            {theme.reflection_prompt}
          </InlineMarkdown>
        </div>
      )}
    </div>
  );
}

export default function ThemeExplorerRenderer({ block }: { block: ThemeExplorerBlock }) {
  return (
    <div className="my-8 rounded-2xl border border-amber-500/15 bg-amber-500/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-300 font-bold">◈</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/70">
          Themes
        </span>
      </div>

      {block.intro && (
        <div className="mb-4">
          <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/65">
            {block.intro}
          </InlineMarkdown>
        </div>
      )}

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {block.themes.map((t) => (
          <ThemePanel key={t.id} theme={t} />
        ))}
      </div>
    </div>
  );
}
