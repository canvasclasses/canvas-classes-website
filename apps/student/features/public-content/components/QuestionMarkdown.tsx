'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// mhchem teaches KaTeX the \ce{...} chemistry macro. Without this import every
// \ce formula (6,521 occurrences across the exported PYQ JSON) renders as a
// KaTeX ParseError — red raw-LaTeX error text — for users AND for crawlers
// reading the SSR HTML. Same pattern as packages/book-renderer TextBlockRenderer.
// (Do NOT copy book-renderer's REHYPE_KATEX_OPTIONS \frac→\dfrac macro here —
// questions are authored under the §4 rule that \dfrac is wrong for them.)
import 'katex/contrib/mhchem';

interface Props {
    children: string;
    className?: string;
}

// Renders question/option/explanation markdown with KaTeX math and
// styled inline images. SSR-rendered at build time; the small client
// hydration is for KaTeX glyph layout and image lazy-loading.

export default function QuestionMarkdown({ children, className = '' }: Props) {
    return (
        <div
            className={`prose prose-invert max-w-none [&_p]:my-2 [&_p]:leading-relaxed [&_img]:my-3 [&_img]:rounded-lg [&_img]:bg-white [&_img]:p-2 [&_img]:max-w-full [&_img]:max-h-[420px] [&_img]:h-auto [&_img]:mx-auto [&_img]:block ${className}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    img: (props) => <img {...props} loading="lazy" />,
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
