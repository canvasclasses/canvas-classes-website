'use client';

import type { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// mhchem teaches KaTeX the \ce{...} chemistry macro — without it every \ce
// formula renders as a ParseError. See QUESTION_LIBRARY_SPEC Phase A.1.
import 'katex/contrib/mhchem';
import { prepareQuestionMarkdown } from '../lib/questionContentTransform';

/**
 * Server-renderable question/option/solution markdown renderer.
 *
 * Drop-in replacement for `@canvas/ui/MathRenderer` on the public question
 * surfaces (same prop shape). The critical difference: MathRenderer builds
 * its output in a `useEffect` → `innerHTML`, so server HTML ships EMPTY
 * divs — invisible to Google/AI crawlers (QUESTION_LIBRARY_SPEC §2.1).
 * ReactMarkdown + rehype-katex render synchronously, so the full content is
 * in the SSR HTML — readable by every crawler AND faster to first paint.
 * ('use client' is fine: client components still server-render their initial
 * HTML — the proven jee-main-pyqs QuestionMarkdown pattern.)
 *
 * DB-content quirks (brace-less \ce, ^*, MTC pseudo-tables) are repaired by
 * the pure transform in ../lib/questionContentTransform.ts.
 *
 * No rehype-raw ON PURPOSE: raw HTML in content stays escaped (XSS-safe
 * without needing DOMPurify — there is no innerHTML in this path, §8.4).
 */

interface Props {
  markdown: string;
  className?: string;
  /** px — set on the container; inherited by rendered text. */
  fontSize?: number;
  /** Fixed pixel width for images: scale * 2px (100 → 200px). Matches MathRenderer. */
  imageScale?: number;
}

// Dark-theme table styling — ported verbatim from MathRenderer's
// TABLE/TH/TD inline styles so converted MTC + pipe tables look identical.
const TABLE_STYLE: CSSProperties = { borderCollapse: 'collapse', margin: '1em 0', width: 'auto', maxWidth: '100%' };
const TH_STYLE: CSSProperties = { border: '1px solid #4B5563', padding: '0.5rem 0.75rem', backgroundColor: '#374151', fontWeight: 600, color: '#E5E7EB' };
const TD_STYLE: CSSProperties = { border: '1px solid #4B5563', padding: '0.5rem 0.75rem', backgroundColor: '#1F2937', color: '#D1D5DB' };

export default function QuestionContent({ markdown, className = '', fontSize, imageScale = 100 }: Props) {
  const prepared = prepareQuestionMarkdown(markdown);
  const pxWidth = Math.round(imageScale * 2);

  return (
    <div className={`question-content ${className}`} style={fontSize ? { fontSize } : undefined}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          img: (props) => (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              {...props}
              loading="lazy"
              style={{ width: pxWidth, height: 'auto', display: 'block', margin: '8px 0' }}
            />
          ),
          table: (props) => <table {...props} className="markdown-table" style={TABLE_STYLE} />,
          th: (props) => <th {...props} style={TH_STYLE} />,
          td: (props) => <td {...props} style={TD_STYLE} />,
          // Question markdown uses paragraphs only for spacing — keep them
          // tight so the swap doesn't change the page rhythm.
          p: (props) => <p {...props} style={{ margin: '0.5em 0' }} />,
        }}
      >
        {prepared}
      </ReactMarkdown>
    </div>
  );
}
