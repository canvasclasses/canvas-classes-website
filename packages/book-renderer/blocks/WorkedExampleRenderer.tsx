'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { REHYPE_KATEX_OPTIONS } from './_katexConfig';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { WorkedExampleBlock } from '@canvas/data/types/books';

interface Props {
  block: WorkedExampleBlock;
}

// ── Header parsing ─────────────────────────────────────────────────────────
// Splits the worked-example label into a main label ("Example N"), a descriptive
// subtitle, and a source/exam badge ("NCERT", "JEE 2009", "AIIMS 1998", "SOLVED").
//
// Behaviour:
//   "Example 1"                                                   → main="Example 1", sub=null, badge="NCERT"/"SOLVED" (from variant)
//   "Example 2 — Empirical formula → molecular formula"           → main="Example 2", sub="Empirical formula → molecular formula", badge="SOLVED"
//   "Example 2 — JEE 2009 (Iron isotopes)"                        → main="Example 2", sub="Iron isotopes", badge="JEE 2009"
//   "Example 3 — Empirical formula from elemental analysis (AIIMS 1998)"
//                                                                 → main="Example 3", sub="Empirical formula from elemental analysis", badge="AIIMS 1998"
const EXAM_REGEX = /\b(JEE\s+Main\s+\d{4}|JEE\s+Advanced\s+\d{4}|JEE\s+\d{4}|AIIMS\s+\d{4}|NEET\s+\d{4}|IIT\s+JEE\s+\d{4})\b/i;

function parseLabel(
  label: string,
  variant?: string,
): { labelMain: string; subtitle: string | null; badge: string } {
  const defaultBadge = variant === 'ncert_intext' ? 'NCERT' : 'SOLVED';
  const dashIdx = label.indexOf(' — ');
  if (dashIdx === -1) {
    return { labelMain: label.trim() || 'Example', subtitle: null, badge: defaultBadge };
  }
  const labelMain = label.slice(0, dashIdx).trim() || 'Example';
  let rest = label.slice(dashIdx + 3).trim();

  const examMatch = rest.match(EXAM_REGEX);
  if (examMatch) {
    const badge = examMatch[0].replace(/\s+/g, ' ').toUpperCase();
    rest = rest.replace(EXAM_REGEX, '').trim();
    // Strip surrounding parens if the residue is fully parenthesised
    if (rest.startsWith('(') && rest.endsWith(')')) {
      rest = rest.slice(1, -1).trim();
    }
    // Remove orphaned empty parens like "( )"
    rest = rest.replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();
    // Trim leading/trailing punctuation
    rest = rest.replace(/^[\s\-—:()]+|[\s\-—:()]+$/g, '').trim();
    return { labelMain, subtitle: rest || null, badge };
  }

  return { labelMain, subtitle: rest || null, badge: defaultBadge };
}

// ── Markdown component overrides ───────────────────────────────────────────
const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[15px] leading-[1.7] text-white/85 my-2.5">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="not-italic text-white/55 text-[13px]">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2 pl-5 space-y-1 list-disc marker:text-white/30">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2 pl-5 space-y-1 list-decimal marker:text-white/40">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[15px] leading-[1.7] text-white/80">{children}</li>
  ),
};

// ── Main renderer ──────────────────────────────────────────────────────────
export default function WorkedExampleRenderer({ block }: Props) {
  const [revealed, setRevealed] = useState(block.reveal_mode === 'always_visible');

  const { labelMain, subtitle, badge } = parseLabel(
    block.label || 'Example',
    block.variant,
  );

  const isNcert = block.variant === 'ncert_intext';
  // Blue accent for NCERT examples, amber for solved/exam-PYQ examples.
  const accent = isNcert ? '#60a5fa' : '#fbbf24';

  return (
    <div
      className="my-8 pl-6 pb-6 border-b border-white/5"
      style={{ borderLeft: `2px solid ${accent}` }}
    >
      {/* Header row: label + subtitle + badge */}
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[15px] font-bold" style={{ color: accent }}>
            {labelMain}
          </span>
          {subtitle && (
            <span className="text-[15px] text-white/70 font-normal leading-normal">
              {subtitle}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/35 whitespace-nowrap pt-1">
          {badge}
        </span>
      </div>

      {/* Problem body */}
      <div className="text-white/85 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
          components={mdComponents}
        >
          {block.problem}
        </ReactMarkdown>
      </div>

      {/* Solution toggle / body */}
      {block.reveal_mode === 'tap_to_reveal' && !revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: accent }}
        >
          + Show solution
        </button>
      ) : (
        <div className="mt-4">
          <div className="text-white/85 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
              components={mdComponents}
            >
              {block.solution}
            </ReactMarkdown>
          </div>
          {block.reveal_mode === 'tap_to_reveal' && (
            <button
              onClick={() => setRevealed(false)}
              className="mt-3 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: accent }}
            >
              − Hide solution
            </button>
          )}
          {block.video_src && (
            <div className="mt-4">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: accent }}
              >
                Video Walkthrough
              </p>
              <video
                src={block.video_src}
                controls
                className="w-full rounded-xl bg-black"
                preload="metadata"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
