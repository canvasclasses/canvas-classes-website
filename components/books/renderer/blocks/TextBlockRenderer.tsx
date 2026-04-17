'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { TextBlock } from '@/types/books';
import type { Components } from 'react-markdown';

/**
 * Inline image layout presets — selected via the markdown title attribute.
 *
 *   ![alt](src "right")                  → floats right, default size
 *   ![alt](src "left|Caption text")      → floats left with caption
 *   ![alt](src "center-half")            → centred block, half the column width
 *
 * Supported positions: right, left, right-sm, left-sm, center-half.
 * Anything else (or omitted title) renders as a default full-width block image.
 * On mobile (< md), all floats collapse to full-width stacks so layouts never break.
 */
const INLINE_IMAGE_LAYOUTS: Record<string, string> = {
  'right':       'md:float-right md:w-1/3 md:max-w-[320px] md:ml-6 md:mb-3',
  'left':        'md:float-left  md:w-1/3 md:max-w-[320px] md:mr-6 md:mb-3',
  'right-sm':    'md:float-right md:w-1/4 md:max-w-[240px] md:ml-6 md:mb-3',
  'left-sm':     'md:float-left  md:w-1/4 md:max-w-[240px] md:mr-6 md:mb-3',
  'center-half': 'md:w-1/2 md:mx-auto',
};

// Explicit component overrides — more reliable than prose modifier classes
// which can be tree-shaken or fail to apply in Tailwind v4.
const components: Components = {
  h2: ({ children }) => (
    // clear-both resets any active float from a preceding inline image so
    // the next section starts on a fresh line
    <h2 className="clear-both text-[22px] font-bold text-sky-300 mt-10 mb-3 tracking-tight leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="clear-both text-[17px] font-semibold text-sky-300/80 mt-7 mb-2 tracking-tight">
      {children}
    </h3>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-amber-200">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/75">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-5 pl-5 space-y-2.5 list-disc marker:text-white/30">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 pl-5 space-y-2.5 list-decimal marker:text-white/40">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-[17px] leading-[1.75] text-white/78">{children}</li>
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  table: ({ children }) => (
    <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0d1320]">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px] border-collapse">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#151e32] border-b border-white/10">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55 whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-5 py-3.5 text-[14px] text-white/75 align-middle leading-[1.55] first:font-semibold first:text-white/90">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 pl-4 border-l-2 border-orange-500/40 text-white/60 not-italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className={`block bg-[#0B0F15] border border-white/10 rounded-lg p-4 text-[13px] text-amber-300 overflow-x-auto ${className}`}>
        {children}
      </code>
    ) : (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] text-amber-300">
        {children}
      </code>
    );
  },
  a: ({ href, children }) => (
    <a href={href} className="text-orange-400 no-underline hover:underline">
      {children}
    </a>
  ),
  /**
   * Inline images.
   *   ![alt](src)                       → default, full-width block image
   *   ![alt](src "right")                → float right, text wraps
   *   ![alt](src "left|Credit: NASA")    → float left with caption
   *
   * Title syntax: `"<position>"` or `"<position>|<caption>"`.
   * Unknown positions fall back to the default block layout.
   */
  img: ({ src, alt, title }) => {
    const [rawPosition, ...captionParts] = (title ?? '').split('|');
    const position = rawPosition.trim();
    const caption = captionParts.join('|').trim();
    const floatClasses = INLINE_IMAGE_LAYOUTS[position];

    // Default path: no title (or unknown) → full-width block image, same as before
    if (!floatClasses) {
      return (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? ''} loading="lazy"
            className="w-full rounded-lg border border-white/10" />
          {caption && (
            <figcaption className="mt-2 text-[13px] text-white/45 text-center leading-snug">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // Inline layout — floats on desktop, stacks full-width on mobile
    return (
      <figure className={`my-3 ${floatClasses}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ''} loading="lazy"
          className="w-full rounded-lg border border-white/10" />
        {caption && (
          <figcaption className="mt-2 text-[12px] text-white/45 leading-snug">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
  // When a paragraph contains nothing but an inline-floated image, strip the
  // wrapping <p> so the float works cleanly against subsequent paragraphs.
  // (A <p> can't legally contain a <figure>; browsers auto-close but we avoid
  // the weirdness by rendering a fragment here.)
  p: ({ children }) => {
    const kids = Array.isArray(children) ? children : [children];
    const onlyChild = kids.length === 1 ? kids[0] : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const asEl = onlyChild as any;
    if (asEl && typeof asEl === 'object' && asEl.type && asEl.props?.node?.tagName === 'img') {
      return <>{children}</>;
    }
    return (
      <p className="text-[17px] leading-[1.65] text-white/82 my-3">
        {children}
      </p>
    );
  },
};

export default function TextBlockRenderer({ block }: { block: TextBlock }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {block.markdown}
      </ReactMarkdown>
    </div>
  );
}
