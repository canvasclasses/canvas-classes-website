'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { CalloutBlock } from '@/types/books';

// ─── Exam Tip ─────────────────────────────────────────────────────────────────
// Card-style with amber accent. Each paragraph renders as a bullet row.
function ExamTipCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-6 lg:my-0 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3 border-b border-amber-400/15 flex items-center gap-2.5">
        <span className="text-amber-300 text-[15px] leading-none">✦</span>
        <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-amber-300 flex-1">
          {block.title ?? 'JEE / NEET Exam Insight'}
        </span>
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase
          text-amber-400/60 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/15">
          JEE / NEET
        </span>
      </div>

      {/* Body — each paragraph becomes a bullet row */}
      <div className="px-5 py-4">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => (
              <div className="flex gap-2.5 items-start text-[14px] leading-[1.7] text-white/72 mb-2.5 last:mb-0">
                <span className="text-amber-300/50 mt-[4px] shrink-0 text-[8px]">◆</span>
                <span>{children}</span>
              </div>
            ),
            ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
            li: ({ children }) => (
              <div className="flex gap-2.5 items-start text-[14px] leading-[1.7] text-white/72">
                <span className="text-amber-300/50 mt-[4px] shrink-0 text-[8px]">◆</span>
                <span>{children}</span>
              </div>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-amber-200">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-white/55">{children}</em>
            ),
          }}
        >
          {block.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ─── Fun Fact / Gita Verse / Real World Hook ──────────────────────────────────
// Uses explicit ReactMarkdown component overrides (not prose modifiers) so that
// every element has guaranteed, predictable styling.
//
// Three-layer verse markdown convention:
//   ### Sanskrit  → h3  → 21px amber-200 bold (largest, most authoritative)
//   ---           → hr  → visible amber divider with generous vertical gap
//   *Hindi*       → em  → 15px amber-200/75 italic (warm, medium)
//   ---           → hr  → separator
//   > English     → blockquote → 13px white/45 muted (analytical, smallest)
//   ---           → hr  → separator
//   *Connection*  → em  → same amber italic (bridges verse to science)
function FunFactCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-6 lg:my-0 rounded-xl border border-amber-500/20 bg-amber-950/25 overflow-hidden">

      {/* Header — no uppercase so Devanagari renders naturally */}
      <div className="px-5 py-3 border-b border-amber-500/10 flex items-center gap-2">
        <span className="text-amber-400/45 text-[11px] leading-none select-none">✦</span>
        <p className="text-[13px] font-semibold text-amber-300/70 leading-snug">
          {block.title ?? 'Real World'}
        </p>
      </div>

      {/* Body — custom components for guaranteed visual hierarchy */}
      <div className="px-5 py-5">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Sanskrit — largest, warm amber, bold
            h3: ({ children }) => (
              <h3 className="text-[20px] font-bold text-amber-200 leading-[1.55] mt-2 mb-1 not-italic">
                {children}
              </h3>
            ),
            // Layer separator — rendered as a clearly visible amber rule
            hr: () => (
              <div className="my-5 h-px bg-amber-400/35" />
            ),
            // Regular paragraphs (subtitle label, etc.)
            p: ({ children }) => (
              <p className="text-[13.5px] leading-[1.75] text-white/55 my-2">
                {children}
              </p>
            ),
            // Hindi translation + connection line — warm amber italic
            // (<em> is italic by default; amber color is what makes it distinctive)
            em: ({ children }) => (
              <em className="text-amber-200/80 text-[15px] leading-[1.8]">
                {children}
              </em>
            ),
            // English translation — muted blockquote, no left border
            blockquote: ({ children }) => (
              <blockquote className="bg-black/15 px-4 py-2 my-3 rounded not-italic text-white/45 text-[14px] leading-[1.7]">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-amber-100/90 not-italic">
                {children}
              </strong>
            ),
          }}
        >
          {block.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ─── Remember ─────────────────────────────────────────────────────────────────
// Uses custom ReactMarkdown components so --- renders as a real visible rule
// and paragraphs have generous spacing for readability.
// Single color family throughout: white/70 body, white/85 bold, italic natural.
function RememberCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-6 lg:my-0 pl-4 border-l-[3px] border-sky-500/40">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-sky-400/60 mb-3 select-none">
        {block.title ?? 'Remember'}
      </p>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // --- renders as a clearly visible hairline rule
          hr: () => (
            <div className="my-4 h-px bg-white/12" />
          ),
          // Generous paragraph spacing — the primary fix for the stacked look
          p: ({ children }) => (
            <p className="text-[14.5px] leading-[1.85] text-white/70 my-3 first:mt-0 last:mb-0">
              {children}
            </p>
          ),
          // Italic text (subtitle, closing question) — same color, just italic
          em: ({ children }) => (
            <em className="italic text-white/70">
              {children}
            </em>
          ),
          // Bold text — slightly brighter, same color family
          strong: ({ children }) => (
            <strong className="font-semibold text-white/88 not-italic">
              {children}
            </strong>
          ),
        }}
      >
        {block.markdown}
      </ReactMarkdown>
    </div>
  );
}

// ─── Warning ──────────────────────────────────────────────────────────────────
function WarningCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-6 pl-5 border-l-[3px] border-red-500/45">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-red-400/60 mb-2 select-none">
        {block.title ?? 'Warning'}
      </p>
      <div className="text-[15px] leading-[1.75] text-white/75
        prose prose-invert max-w-none prose-p:my-1.5 prose-p:leading-[1.75]
        prose-strong:text-white/90 prose-strong:font-semibold">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Returns a field-appropriate symbol for the placeholder thumbnail.
function fieldSymbol(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('astronomy'))  return '✦';
  if (t.includes('atomic'))     return '⚛';
  if (t.includes('medicine'))   return '⚕';
  if (t.includes('mind'))       return '◎';
  if (t.includes('linguistics'))return 'λ';
  if (t.includes('mathemat'))   return '∑';
  return '◆';
}

// ─── Note ─────────────────────────────────────────────────────────────────────
// Card-style with optional left-side thumbnail and collapsible detail.
//
// Thumbnail behaviour (when image_src or image_prompt is set):
//   - image_src filled  → renders actual <img>
//   - image_src empty   → styled placeholder box with field symbol
//
// Collapsible behaviour:
//   - markdown with \n\n → preview = first paragraph, detail hidden until click
//   - markdown without \n\n → always fully visible, no toggle
function NoteCallout({ block }: { block: CalloutBlock }) {
  const firstBreak  = block.markdown.indexOf('\n\n');
  const hasDetail   = firstBreak !== -1;
  const previewMd   = hasDetail ? block.markdown.slice(0, firstBreak) : block.markdown;
  const detailMd    = hasDetail ? block.markdown.slice(firstBreak + 2) : '';
  const hasThumbnail = !!(block.image_src !== undefined || block.image_prompt);

  const [expanded, setExpanded] = useState(false);

  const mdComponents = {
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-[15.5px] leading-[1.85] text-white/65 my-2 first:mt-0 last:mb-0">
        {children}
      </p>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-white/85 not-italic">
        {children}
      </strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-white/55">
        {children}
      </em>
    ),
    hr: () => <div className="my-3 h-px bg-white/10" />,
  };

  return (
    <div className="my-5 rounded-xl border border-white/8 bg-[#0B0F15]/70 overflow-hidden">

      {/* Header */}
      {block.title && (
        <div className="px-4 py-2.5 border-b border-white/6">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/62 select-none leading-snug">
            {block.title}
          </p>
        </div>
      )}

      {/* Body — flex row when thumbnail present */}
      <div className={`px-4 py-3.5 ${hasThumbnail ? 'flex gap-4 items-start' : ''}`}>

        {/* Left thumbnail */}
        {hasThumbnail && (
          <div className="shrink-0 w-[76px] h-[76px] rounded-lg overflow-hidden border border-white/8">
            {block.image_src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.image_src}
                alt={block.title ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Placeholder until image is generated */
              <div className="w-full h-full bg-amber-950/50 flex flex-col items-center justify-center gap-1">
                <span className="text-amber-400/70 text-[40px] leading-none select-none">
                  {fieldSymbol(block.title ?? '')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Right content */}
        <div className="flex-1 min-w-0">

          {/* Preview */}
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={mdComponents}
          >
            {previewMd}
          </ReactMarkdown>

          {/* Detail — revealed on expand */}
          {hasDetail && expanded && (
            <div className="mt-1 border-t border-white/6 pt-3">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={mdComponents}
              >
                {detailMd}
              </ReactMarkdown>
            </div>
          )}

          {/* Toggle */}
          {hasDetail && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-2.5 flex items-center gap-1 text-[12px] font-medium
                text-white/35 hover:text-white/65 transition-colors"
            >
              {expanded
                ? <><ChevronUp size={13} /><span>Collapse</span></>
                : <><ChevronDown size={13} /><span>Read more</span></>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function CalloutBlockRenderer({ block }: { block: CalloutBlock }) {
  switch (block.variant) {
    case 'exam_tip':  return <ExamTipCallout block={block} />;
    case 'fun_fact':  return <FunFactCallout block={block} />;
    case 'remember':  return <RememberCallout block={block} />;
    case 'warning':   return <WarningCallout block={block} />;
    case 'note':
    default:          return <NoteCallout block={block} />;
  }
}
