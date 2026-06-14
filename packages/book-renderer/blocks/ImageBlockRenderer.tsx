'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import { REHYPE_KATEX_OPTIONS } from './_katexConfig';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import type { Components } from 'react-markdown';
import { ImageBlock } from '@canvas/data/types/books';
import ImageLightbox from './_ImageLightbox';
import { FigureCaption } from '../figure-refs-context';

// ── Width presets when the block sits on its own row ──
const fullRowWidthClass: Record<NonNullable<ImageBlock['width']>, string> = {
  full:           'w-full',
  five_sixth:     'w-5/6 mx-auto',
  three_quarter:  'w-3/4 mx-auto',
  two_third:      'w-2/3 mx-auto',
  half:           'w-1/2 mx-auto',
  two_fifth:      'w-2/5 mx-auto',
  third:          'w-1/3 mx-auto',
  quarter:        'w-1/4 mx-auto',
};

// ── Aspect ratio → Tailwind class ──────────────────────────────────────────
// undefined / absent → natural proportions (no container height constraint)
const ASPECT_RATIO_CLASS: Record<NonNullable<ImageBlock['aspect_ratio']>, string> = {
  '16:9': 'aspect-video',
  '16:5': 'aspect-[16/5]',
  '4:3':  'aspect-[4/3]',
  '3:2':  'aspect-[3/2]',
  '1:1':  'aspect-square',
  '21:9': 'aspect-[21/9]',
};

// ── Width presets for the IMAGE pane inside a side-by-side row ──
// (the remaining horizontal space goes to the text pane)
// Anything ≥ half is capped at sm:w-1/2 so the text pane always has breathing room.
const sideImageWidthClass: Record<NonNullable<ImageBlock['width']>, string> = {
  full:           'sm:w-1/2',
  five_sixth:     'sm:w-1/2',
  three_quarter:  'sm:w-1/2',
  two_third:      'sm:w-1/2',
  half:           'sm:w-1/2',
  two_fifth:      'sm:w-2/5',
  third:          'sm:w-1/3',
  quarter:        'sm:w-1/4',
};

// ── Markdown renderer overrides for the side_text (match TextBlockRenderer) ──
// Font sizes are intentionally identical to TextBlockRenderer so body text,
// list items and headings look the same whether the text is standalone or
// sitting beside an image.  Only vertical margins are tightened slightly
// (my-2.5 / my-3 instead of my-3 / my-5) to suit the side-by-side column.
const sideTextComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-[22px] font-bold text-sky-300 mt-2 mb-2 tracking-tight leading-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[17px] font-semibold text-sky-300/80 mt-3 mb-1.5 tracking-tight">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[17px] leading-[1.65] text-white/82 my-2.5 first:mt-0 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-amber-200">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/75">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-3 pl-5 space-y-2 list-disc marker:text-white/30">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 pl-5 space-y-2 list-decimal marker:text-white/40">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[17px] leading-[1.75] text-white/78">{children}</li>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-orange-400 no-underline hover:underline">{children}</a>
  ),
};

export default function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false); // §15.6 blur-up fade-in
  const [zoom, setZoom] = useState(false);      // §15.6 tap-to-zoom lightbox
  const width = block.width ?? 'full';
  const align = block.align ?? 'center';
  const hasSideText = (align === 'left' || align === 'right') && !!block.side_text?.trim();

  // ──────────────────────────────────────────────────────────────
  // PLACEHOLDER STATE (no src yet) — show generation prompt card
  // ──────────────────────────────────────────────────────────────
  if (!block.src) {
    const wClass = hasSideText ? 'w-full' : fullRowWidthClass[width];
    const placeholder = (
      <figure className={`${wClass} my-6`}>
        <div className="w-full rounded-xl border border-dashed border-white/15 bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/8 flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/25 select-none">
              🖼 Image Pending
            </span>
            <span className="ml-auto text-[10px] text-white/20 italic">{block.alt}</span>
          </div>

          {block.generation_prompt ? (
            <div className="px-4 py-4">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-orange-400/50 mb-2 select-none">
                AI Generation Prompt
              </p>
              <p className="text-[13px] leading-[1.65] text-white/50 font-mono mb-3">
                {block.generation_prompt}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(block.generation_prompt!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-orange-500/25 text-orange-400/70
                           hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy prompt'}
              </button>
            </div>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-xs text-white/25 italic">{block.caption || block.alt}</p>
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
    // Even in placeholder state, respect the side-by-side layout so the editor preview looks right
    return hasSideText ? wrapSideBySide(placeholder, block, align) : placeholder;
  }

  // ──────────────────────────────────────────────────────────────
  // NORMAL STATE (src present)
  // ──────────────────────────────────────────────────────────────
  // SVGs bypass the Next.js optimizer (the image service rejects them by default
  // for security). Everything else (webp/png/jpg/jpeg/gif/avif) flows through
  // next/image for automatic format negotiation and responsive srcsets.
  const isSvg = /\.svg(\?|#|$)/i.test(block.src);

  const hasAspectRatio = !!block.aspect_ratio;
  const aspectClass = block.aspect_ratio ? ASPECT_RATIO_CLASS[block.aspect_ratio] : '';

  // next/image can't safely handle SVGs (the optimizer rejects them by default
  // for XSS reasons) or images without known dimensions displayed at natural
  // size — for those we fall back to a plain <img> with async decoding.
  //
  // When aspect_ratio IS set, the container already locks the layout box, so
  // we can use next/image with `fill` to get AVIF/WebP format negotiation,
  // responsive srcsets, and automatic lazy loading — no CLS, no guesswork.
  const useOptimizer = hasAspectRatio && !isSvg;

  const figure = (
    <figure className={`${hasSideText ? 'w-full' : fullRowWidthClass[width]} ${hasSideText ? '' : 'my-4'}`}>
      {/* The image is a button so the whole frame is tap-to-zoom (§15.6). */}
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={`View larger: ${block.alt}`}
        className={`group relative block w-full overflow-hidden rounded-xl border border-white/10 cursor-zoom-in ${aspectClass}`}
      >
        {/* Skeleton shimmer until the image decodes — never a black void (§15.6).
            Only shown when the box height is reserved (aspect_ratio set). */}
        {hasAspectRatio && !loaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background:
                'linear-gradient(110deg, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 70%)',
            }}
          />
        )}
        {useOptimizer ? (
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 800px"
            className={`object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          // No aspect_ratio set: we don't know the image's intrinsic dimensions,
          // so next/image's fill mode would collapse to zero height. Keep a plain
          // <img> but opt into async decode + lazy load so the main thread isn't
          // blocked on image decoding. R2 already serves through a CDN; the main
          // win we're giving up here is AVIF/WebP negotiation, which is OK for
          // the minority of blocks that don't pin an aspect ratio.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.src}
            alt={block.alt}
            className={`w-full h-auto object-contain block transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )}
        {/* Zoom affordance on hover */}
        <span
          aria-hidden
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center
            text-white/85 text-[13px] bg-black/45 border border-white/15 backdrop-blur-sm
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          ⤢
        </span>
      </button>
      <FigureCaption blockType="image" figureNumber={block.figure_number} caption={block.caption} />
    </figure>
  );

  const content = hasSideText ? wrapSideBySide(figure, block, align) : figure;
  return (
    <>
      {content}
      {zoom && (
        <ImageLightbox
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          onClose={() => setZoom(false)}
        />
      )}
    </>
  );
}

// ── Side-by-side wrapper ─────────────────────────────────────────
// Image pane + text pane in a responsive flex row.
// Mobile (<sm) : stacks vertically — image on top, text below
// Desktop (sm+): side-by-side, image pinned to `align` side
function wrapSideBySide(figure: React.ReactNode, block: ImageBlock, align: 'left' | 'right' | 'center') {
  const width = block.width ?? 'full';
  const imageWidthClass = sideImageWidthClass[width];
  const direction = align === 'right' ? 'sm:flex-row-reverse' : 'sm:flex-row';

  return (
    <div className={`w-full my-5 flex flex-col ${direction} gap-5 sm:gap-6 items-start`}>
      <div className={`w-full ${imageWidthClass} shrink-0`}>
        {figure}
      </div>
      <div className="flex-1 min-w-0 w-full pt-1">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
          rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS], rehypeRaw]}
          components={sideTextComponents}
        >
          {block.side_text ?? ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
