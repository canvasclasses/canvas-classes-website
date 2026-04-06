'use client';

import { useState, useRef } from 'react';
import { InteractiveImageBlock, Hotspot } from '@/types/books';
import ReactMarkdown from 'react-markdown';

const iconShape: Record<NonNullable<Hotspot['icon']>, string> = {
  circle: '●',
  pin: '📍',
  plus: '+',
};

export default function InteractiveImageBlockRenderer({
  block,
}: {
  block: InteractiveImageBlock;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeHotspot = block.hotspots.find((h) => h.id === activeId);

  return (
    <figure className="my-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-white/10 select-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          className="w-full h-auto object-contain"
          draggable={false}
        />

        {/* Hotspot dots */}
        {block.hotspots.map((hotspot, idx) => (
          <button
            key={hotspot.id}
            className={`absolute flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
              border-2 transition-all duration-150 cursor-pointer z-10
              ${activeId === hotspot.id
                ? 'bg-orange-500 border-orange-300 scale-110 text-black'
                : 'bg-[#0B0F15]/80 border-orange-500 text-orange-400 hover:scale-110'
              }`}
            style={{
              left: `calc(${hotspot.x * 100}% - 14px)`,
              top: `calc(${hotspot.y * 100}% - 14px)`,
            }}
            onClick={() => setActiveId(activeId === hotspot.id ? null : hotspot.id)}
            aria-label={hotspot.label}
          >
            {hotspot.icon ? iconShape[hotspot.icon] : idx + 1}
          </button>
        ))}
      </div>

      {/* Active hotspot detail panel */}
      {activeHotspot && (
        <div className="mt-3 p-4 bg-[#151E32] border border-orange-500/30 rounded-xl">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-orange-400 mb-1">{activeHotspot.label}</p>
            <button
              onClick={() => setActiveId(null)}
              className="text-white/40 hover:text-white/80 text-xs shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-white/80 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{activeHotspot.detail}</ReactMarkdown>
          </div>
        </div>
      )}

      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
