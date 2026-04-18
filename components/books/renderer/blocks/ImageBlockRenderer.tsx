'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import type { Components } from 'react-markdown';
import { ImageBlock } from '@/types/books';

// ── Width presets when the block sits on its own row ──
const fullRowWidthClass: Record<NonNullable<ImageBlock['width']>, string> = {
  full: 'w-full',
  half: 'w-1/2 mx-auto',
  third: 'w-1/3 mx-auto',
};

// ── Aspect ratio → Tailwind class ──────────────────────────────────────────
// undefined / absent → natural proportions (no container height constraint)
const ASPECT_RATIO_CLASS: Record<NonNullable<ImageBlock['aspect_ratio']>, string> = {
  '16:9': 'aspect-video',
  '4:3':  'aspect-[4/3]',
  '3:2':  'aspect-[3/2]',
  '1:1':  'aspect-square',
  '21:9': 'aspect-[21/9]',
};

// ── Width presets for the IMAGE pane inside a side-by-side row ──
// (the remaining horizontal space goes to the text pane)
const sideImageWidthClass: Record<NonNullable<ImageBlock['width']>, string> = {
  full:  'sm:w-1/2',   // 'full' inside a row = equal 50/50 split
  half:  'sm:w-1/2',   // 'half' = equal 50/50 split
  third: 'sm:w-1/3',   // 'third' = narrow image, wide text
};

// ── Markdown renderer overrides for the side_text (match TextBlockRenderer) ──
const sideTextComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-[19px] font-bold text-sky-300 mt-2 mb-2 tracking-tight leading-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[16px] font-semibold text-sky-300/80 mt-3 mb-1.5 tracking-tight">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[16px] leading-[1.65] text-white/82 my-2.5 first:mt-0 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-amber-200">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/75">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-3 pl-5 space-y-2 list-disc marker:text-white/30 text-[15px]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 pl-5 space-y-2 list-decimal marker:text-white/40 text-[15px]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[15px] leading-[1.6] text-white/78">{children}</li>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-orange-400 no-underline hover:underline">{children}</a>
  ),
};

export default function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  const [copied, setCopied] = useState(false);
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
      <div className={`relative w-full overflow-hidden rounded-xl border border-white/10 ${aspectClass}`}>
        {useOptimizer ? (
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 800px"
            className="object-cover"
            loading="lazy"
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
            className="w-full h-auto object-contain block"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );

  if (!hasSideText) return figure;
  return wrapSideBySide(figure, block, align);
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
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={sideTextComponents}
        >
          {block.side_text ?? ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
