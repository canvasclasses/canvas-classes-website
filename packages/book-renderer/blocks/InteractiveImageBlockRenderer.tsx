'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { InteractiveImageBlock, Hotspot } from '@canvas/data/types/books';
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

  // PLACEHOLDER STATE (no src yet) — mirror ImageBlockRenderer §102: never pass
  // an empty string to <Image>/<img> (Next warns it re-downloads the whole page,
  // and it's a broken request). Show the generation-prompt card, and list the
  // authored hotspots below so the content is visible in the editor preview
  // before the diagram is uploaded.
  if (!block.src) {
    return (
      <figure className="my-6">
        <div className="w-full rounded-xl border border-dashed border-white/15 bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/8 flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/25 select-none">
              🖼 Interactive Image Pending
            </span>
            <span className="ml-auto text-[10px] text-white/20 italic">{block.alt}</span>
          </div>
          {block.generation_prompt && (
            <div className="px-4 py-4">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-orange-400/50 mb-2 select-none">
                AI Generation Prompt
              </p>
              <p className="text-[13px] leading-[1.65] text-white/50 font-mono">
                {block.generation_prompt}
              </p>
            </div>
          )}
          {block.hotspots.length > 0 && (
            <div className="px-4 py-3 border-t border-white/8">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/25 mb-2 select-none">
                {block.hotspots.length} hotspot{block.hotspots.length === 1 ? '' : 's'}
              </p>
              <ul className="space-y-2">
                {block.hotspots.map((h) => (
                  <li key={h.id} className="text-[13px] leading-snug">
                    <p className="text-orange-400/70 font-semibold mb-0.5">{h.label}</p>
                    <div className="text-white/55 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{h.detail}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-sm text-white/40 italic">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // SVGs bypass the Next.js optimizer (not allowed by default for security).
  const isSvg = /\.svg(\?|#|$)/i.test(block.src);

  return (
    <figure className="my-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-white/10 select-none"
      >
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.src}
            alt={block.alt}
            className="w-full h-auto object-contain block"
            draggable={false}
          />
        ) : (
          <Image
            src={block.src}
            alt={block.alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 960px"
            style={{ width: '100%', height: 'auto' }}
            className="object-contain block"
            draggable={false}
          />
        )}

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
