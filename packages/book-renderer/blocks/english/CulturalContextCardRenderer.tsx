'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CulturalContextCardBlock, CulturalContextCategory } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

const CATEGORY_ICON: Record<CulturalContextCategory, string> = {
  place: '🗺',
  person: '◉',
  event: '◷',
  concept: '◇',
  tradition: '✦',
};

export default function CulturalContextCardRenderer({ block }: { block: CulturalContextCardBlock }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="my-6 rounded-2xl px-5 py-4"
      style={{
        background: 'rgba(16,185,129,0.04)',
        border: '1.5px solid rgba(16,185,129,0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-[18px] flex-shrink-0 mt-0.5"
          style={{ color: '#34d399' }}
          aria-hidden
        >
          {CATEGORY_ICON[block.category]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(52,211,153,0.65)' }}>
              {block.category}
            </span>
            <span className="text-[15px] font-bold" style={{ color: '#34d399' }}>
              {block.reference}
            </span>
          </div>
          <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {block.short_desc}
          </p>

          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="text-[12px] font-semibold mt-2"
              style={{ color: 'rgba(52,211,153,0.7)' }}
            >
              Tell me more →
            </button>
          ) : (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {block.image_url && (
                <div className="rounded-xl overflow-hidden mb-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <Image
                    src={block.image_url}
                    alt={block.reference}
                    width={400}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/70">
                {block.detail}
              </InlineMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
