'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { REHYPE_KATEX_OPTIONS } from './_katexConfig';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import type { Components } from 'react-markdown';

/**
 * Shared inline markdown + LaTeX renderer for block fields that are plain
 * strings (not full markdown documents) — comparison-card points, headings,
 * timeline labels, prompt/reveal text, classify rows, etc.
 *
 * Why this exists
 * ---------------
 * Several block renderers used to print author text raw (`{point}`,
 * `{block.text}`, …). Any `$...$` / `$\ce{...}$` / `$$...$$` in those fields
 * showed as literal source instead of rendering. The full-document blocks
 * (`text`, `callout`, `table` cells, `worked_example`) already pipe through
 * ReactMarkdown + remark-math + rehype-katex (with mhchem); this component
 * gives the string-field blocks the same capability through one code path.
 *
 * Two modes:
 *  - **inline** (default): paragraphs render as a Fragment, so the result
 *    drops cleanly inside an existing styled `<p>` / `<li>` / `<span>`.
 *  - **block** (`paragraphClassName` set): paragraphs render as real `<p>`
 *    elements carrying that className — use when the field stands alone and
 *    may contain display math (`$$...$$`), which is not legal inside a `<p>`.
 *
 * Bold / italic inherit the surrounding text color (the consuming cards are
 * variously colored), so only weight/style are applied.
 */
interface InlineMarkdownProps {
  children: string;
  paragraphClassName?: string;
}

export default function InlineMarkdown({ children, paragraphClassName }: InlineMarkdownProps) {
  const components: Components = {
    p: paragraphClassName
      ? ({ children }) => <p className={paragraphClassName}>{children}</p>
      : ({ children }) => <>{children}</>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-white/10 px-1 rounded text-[0.9em] text-amber-300 font-mono">
        {children}
      </code>
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
