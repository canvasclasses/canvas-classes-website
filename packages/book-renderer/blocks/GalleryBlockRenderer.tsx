'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryBlock } from '@canvas/data/types/books';
import ImageLightbox from './_ImageLightbox';
import { figureLabel } from '../figure-refs-context';

const ASPECT_CLASS: Record<NonNullable<GalleryBlock['aspect_ratio']>, string> = {
  '16:9': 'aspect-video',
  '16:5': 'aspect-[16/5]',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '1:1': 'aspect-square',
  '21:9': 'aspect-[21/9]',
};

// Real photos vary wildly in shape. When the block doesn't pin an explicit
// aspect_ratio, size the carousel to the CURRENT slide's own natural ratio
// (clamped so a stray portrait/panorama can't turn the carousel into a
// sliver or a skyscraper) instead of force-cropping every slide into one box.
const MIN_RATIO = 0.66; // tallest allowed (~2:3 portrait)
const MAX_RATIO = 2.2; // widest allowed (~21:9-ish)
const FALLBACK_RATIO = 3 / 2;

/**
 * Swipeable gallery (§15.6) — 2–6 images for ONE concept shown as a carousel
 * instead of a vertical stack. Arrows + dots to move; each slide is tap-to-zoom.
 */
export default function GalleryBlockRenderer({ block }: { block: GalleryBlock }) {
  const items = (block.items ?? []).filter((it) => it.src?.trim());
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [naturalRatio, setNaturalRatio] = useState<Record<string, number>>({});

  if (items.length === 0) return null;

  const clamp = (i: number) => (i + items.length) % items.length;
  const go = (d: number) => setIdx((i) => clamp(i + d));
  const current = items[idx];

  // Explicit aspect_ratio on the block is author intent — respect it (locked
  // box, cropped fill). Otherwise adapt to the current slide's own shape.
  const hasExplicitRatio = !!block.aspect_ratio;
  const aspectClass = hasExplicitRatio ? ASPECT_CLASS[block.aspect_ratio!] : '';
  const currentRatio = naturalRatio[current.id];
  const containerStyle = hasExplicitRatio
    ? undefined
    : { aspectRatio: String(currentRatio ? Math.min(MAX_RATIO, Math.max(MIN_RATIO, currentRatio)) : FALLBACK_RATIO) };

  return (
    <figure className="my-5 w-full">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 transition-[aspect-ratio] duration-300 ${aspectClass}`}
        style={containerStyle}
      >
        {/* Slides track */}
        <div
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setZoom(items.indexOf(it))}
              aria-label={`View larger: ${it.alt}`}
              className="relative w-full h-full shrink-0 grow-0 basis-full cursor-zoom-in group"
              style={{ minWidth: '100%' }}
            >
              {!loaded[it.id] && (
                <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(110deg,rgba(255,255,255,0.03),rgba(255,255,255,0.08),rgba(255,255,255,0.03))' }} />
              )}
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className={`${hasExplicitRatio ? 'object-cover' : 'object-contain'} transition-opacity duration-500 ${loaded[it.id] ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={(e) => {
                  setLoaded((m) => ({ ...m, [it.id]: true }));
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    const ratio = img.naturalWidth / img.naturalHeight;
                    setNaturalRatio((m) => (m[it.id] ? m : { ...m, [it.id]: ratio }));
                  }
                }}
              />
              <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center
                bg-black/45 border border-white/15 text-white/85 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Maximize2 size={13} />
              </span>
            </button>
          ))}
        </div>

        {/* Arrows (only when >1) */}
        {items.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
                bg-black/45 hover:bg-black/65 border border-white/15 text-white/85 transition-colors z-10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => go(1)} aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
                bg-black/45 hover:bg-black/65 border border-white/15 text-white/85 transition-colors z-10">
              <ChevronRight size={18} />
            </button>
            {/* Counter */}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums
              bg-black/45 border border-white/15 text-white/80 z-10">
              {idx + 1} / {items.length}
            </div>
          </>
        )}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {items.map((it, i) => (
            <button key={it.id} onClick={() => setIdx(i)} aria-label={`Go to image ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 18 : 6, height: 6,
                background: i === idx ? '#fb923c' : 'rgba(255,255,255,0.25)',
              }} />
          ))}
        </div>
      )}

      {/* Caption — "Fig. 1.3 (a) — caption" for a numbered multi-panel figure */}
      {(() => {
        const lab = figureLabel('gallery', block.figure_number);
        if (!lab && !current.caption) return null;
        const panel = lab && items.length > 1 ? ` (${String.fromCharCode(97 + idx)})` : '';
        return (
          <figcaption className="mt-2 text-center text-sm text-white/50 italic">
            {lab && <span className="font-semibold not-italic text-white/70">{lab}{panel}</span>}
            {lab && current.caption ? ' — ' : ''}
            {current.caption}
          </figcaption>
        );
      })()}

      {zoom !== null && items[zoom] && (
        <ImageLightbox
          src={items[zoom].src}
          alt={items[zoom].alt}
          caption={items[zoom].caption}
          onClose={() => setZoom(null)}
        />
      )}
    </figure>
  );
}
