'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { REHYPE_KATEX_OPTIONS } from './_katexConfig';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { CalloutBlock } from '@canvas/data/types/books';

// ─── Shared bottom image ──────────────────────────────────────────────────────
// Renders below the callout text when image_src or image_prompt is set.
// image_src filled → real image. Empty but image_prompt set → copyable placeholder.
function CalloutImage({ block }: { block: CalloutBlock }) {
  if (!block.image_src && !block.image_prompt) return null;

  if (block.image_src) {
    return (
      <figure className="mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.image_src}
          alt={block.title ?? ''}
          loading="lazy"
          className="w-full rounded-lg border border-white/10"
        />
      </figure>
    );
  }

  // Placeholder — show the generation prompt until the image is uploaded
  return (
    <div className="mt-4 rounded-lg border border-dashed border-white/12 bg-white/[0.02] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1.5">
        Image needed — generation prompt:
      </p>
      <p className="text-[12px] text-white/38 font-mono leading-relaxed select-all">
        {block.image_prompt}
      </p>
    </div>
  );
}

// ─── Exam Tip ─────────────────────────────────────────────────────────────────
// Neutral card, collapsed by default — the amber glow background/border read as
// "neon" and the tip was always forced open even for students who didn't want it.
// Now: no amber wash (small amber accents only, for identity), and the body only
// renders once the student taps to expand it.
//
// Header redesign (2026-07): the old header said "JEE / NEET Exam Insight" as the
// title AND repeated "JEE / NEET" again in the pill beside it — the same phrase
// twice in one row. Now the title is exam-agnostic wording ("Exam Insight" by
// default, author-overridable via block.title) and the pill is the ONLY place the
// exam name appears. The generic ✦ sparkle is replaced with a graduation-cap icon
// in a soft badge circle, so the row reads as "exam content" at a glance without
// needing the word "exam" twice either.
function ExamTipCallout({ block }: { block: CalloutBlock }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-6 lg:my-0 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(217,119,6,0.22)' }}>

      {/* Header — one clean line, subtle amber gradient, no icon. Toggles body. */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        className="w-full px-4 py-3 flex items-center gap-2 text-left transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.18) 0%, rgba(217,119,6,0.04) 100%)' }}
      >
        <span className="flex-1 text-[13px] font-bold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: '#fcd34d' }}>
          {block.title ?? 'Quick Recap'}
        </span>
        {expanded
          ? <ChevronUp size={15} className="shrink-0" style={{ color: 'rgba(252,211,77,0.6)' }} />
          : <ChevronDown size={15} className="shrink-0" style={{ color: 'rgba(252,211,77,0.6)' }} />}
      </button>

      {/* Body — each paragraph becomes a bullet row. Hidden until expanded. */}
      {expanded && (
        <div className="px-5 pb-4 pt-3 border-t border-white/8">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
            components={{
              p: ({ children }) => (
                <div className="flex gap-2.5 items-start text-[14px] leading-[1.7] text-white/72 mb-2.5 last:mb-0">
                  <span className="text-amber-300/40 mt-[4px] shrink-0 text-[8px]">◆</span>
                  <span>{children}</span>
                </div>
              ),
              ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
              li: ({ children }) => (
                <div className="flex gap-2.5 items-start text-[14px] leading-[1.7] text-white/72">
                  <span className="text-amber-300/40 mt-[4px] shrink-0 text-[8px]">◆</span>
                  <span>{children}</span>
                </div>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-amber-200/80">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-white/55">{children}</em>
              ),
            }}
          >
            {block.markdown}
          </ReactMarkdown>
          <CalloutImage block={block} />
        </div>
      )}
    </div>
  );
}

// ─── Fun Fact / Gita Verse / Real World Hook ──────────────────────────────────
// No card/box — renders as bold editorial prose directly in the content flow.
// Large text, amber accents on strong/em, label row anchors the section visually.
//
// Three-layer verse markdown convention:
//   ### Sanskrit  → h3  → 21px amber-200 bold (largest, most authoritative)
//   ---           → hr  → visible amber divider with generous vertical gap
//   *Hindi*       → em  → 15px amber-200/75 italic (warm, medium)
//   ---           → hr  → separator
//   > English     → blockquote → 14px white/50 left-border (analytical, smallest)
//   *Connection*  → em  → same amber italic (bridges verse to science)
// "Connect" family — a warm neutral "paper" box (Option 3). A fixed "Did You
// Know" eyebrow, no per-instance headline (block.title is ignored here), warm
// muted accents — no cyan. Solid fill, easy on the eyes on the dark reading
// surface.
function FunFactCallout({ block }: { block: CalloutBlock }) {
  return (
    <div
      className="my-8 rounded-[14px]"
      style={{ background: '#201e1a', border: '1px solid rgba(255,255,255,0.10)', padding: '22px 26px' }}
    >
      {/* Signpost row — diamond + fixed section label */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[13px] leading-none select-none" style={{ color: '#c3b7a4' }}>✦</span>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase leading-none" style={{ color: '#c3b7a4' }}>
          Did You Know
        </span>
      </div>

      {/* Body */}
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
        components={{
          // Sanskrit / large header
          h3: ({ children }) => (
            <h3 className="text-[21px] font-bold leading-[1.55] mt-2 mb-3" style={{ color: '#dcceb6' }}>
              {children}
            </h3>
          ),
          // Warm hairline separator
          hr: () => (
            <div className="my-6 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
          ),
          // Main body paragraphs — large, readable
          p: ({ children }) => (
            <p className="text-[17px] leading-[1.85] text-white/82 mb-4 last:mb-0">
              {children}
            </p>
          ),
          // Hindi / connection lines — warm muted italic
          em: ({ children }) => (
            <em className="italic text-[16px] leading-[1.8]" style={{ color: '#c9bda9' }}>
              {children}
            </em>
          ),
          // English translation blockquote — left border, no background box
          blockquote: ({ children }) => (
            <blockquote className="pl-4 my-4 text-white/52 text-[15px] leading-[1.75] not-italic" style={{ borderLeft: '2px solid rgba(255,255,255,0.15)' }}>
              {children}
            </blockquote>
          ),
          // Bold — warm highlight, pops off the white/82 body
          strong: ({ children }) => (
            <strong className="font-semibold not-italic" style={{ color: '#dcceb6' }}>
              {children}
            </strong>
          ),
        }}
      >
        {block.markdown}
      </ReactMarkdown>

      <CalloutImage block={block} />
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
        rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
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
      <CalloutImage block={block} />
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
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}>
          {block.markdown}
        </ReactMarkdown>
      </div>
      <CalloutImage block={block} />
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
            rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
            components={mdComponents}
          >
            {previewMd}
          </ReactMarkdown>

          {/* Detail — revealed on expand */}
          {hasDetail && expanded && (
            <div className="mt-1 border-t border-white/6 pt-3">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
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

// ─── Voices That Inspire ─────────────────────────────────────────────────────
// "One Page from My Bookshelf" — a teacher pulling a book off the shelf to share
// a line that connects to the chapter. Warm rose/sepia palette (evening-lamp
// feeling), distinct from FunFact's amber-Sanskrit hook.
//
// Markdown convention:
//   - regular paragraphs → teacher's framing prose
//   - `> the borrowed line` → pulled-out italic blockquote (large, the gem itself)
//   - `*— Author, Book*` → small italic attribution row
//   - `?? Where in your own life have you felt this?` → soft reflection prompt
function VoicesThatInspireCallout({ block }: { block: CalloutBlock }) {
  // Split out a trailing "?? prompt" line so it can render distinctly.
  const promptMatch = block.markdown.match(/\n\?\?\s+(.+?)\s*$/);
  const body = promptMatch ? block.markdown.slice(0, promptMatch.index ?? 0).trimEnd() : block.markdown;
  const prompt = promptMatch?.[1];

  return (
    <div className="my-8 rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-400/[0.05] to-amber-400/[0.03] overflow-hidden">
      {/* Banner — the teacher reaching for the shelf */}
      <div className="px-5 py-3 border-b border-rose-400/12 flex items-center gap-2.5">
        <span className="text-rose-300 text-[15px] leading-none">📖</span>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-rose-300/85 leading-none flex-1">
          {block.title ? 'Voices that Inspire' : 'One Page from My Bookshelf'}
        </span>
        <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-rose-300/55">
          from another book
        </span>
      </div>

      {/* Source line (the title field carries "Book — Author, Year") */}
      {block.title && (
        <div className="px-5 pt-4">
          <p className="text-[13px] italic text-rose-200/75 leading-snug">
            {block.title}
          </p>
        </div>
      )}

      {/* Body — framing prose + the pulled-out quote + attribution */}
      <div className="px-5 py-4">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
          components={{
            // Teacher's framing — warm, readable body
            p: ({ children }) => (
              <p className="text-[15.5px] leading-[1.85] text-white/75 my-3 first:mt-0 last:mb-0">
                {children}
              </p>
            ),
            // The borrowed gem — pulled out, large, italic, rose-tinted
            blockquote: ({ children }) => (
              <blockquote className="my-5 border-l-[3px] border-rose-300/40 pl-5 italic text-rose-100/90 text-[17px] leading-[1.7]">
                {children}
              </blockquote>
            ),
            // Attribution lines (*— Tagore, Gitanjali, 1910*) — small, italic, soft
            em: ({ children }) => (
              <em className="italic text-rose-200/70 text-[13.5px]">
                {children}
              </em>
            ),
            // Bold — warm highlight, not jarring
            strong: ({ children }) => (
              <strong className="font-semibold text-rose-100 not-italic">
                {children}
              </strong>
            ),
            hr: () => <div className="my-5 h-px bg-rose-400/15" />,
          }}
        >
          {body}
        </ReactMarkdown>

        {/* Reflection prompt — soft, at the bottom */}
        {prompt && (
          <div className="mt-5 pt-4 border-t border-rose-400/12 flex gap-2.5 items-start">
            <span className="text-rose-300/70 text-[15px] leading-none mt-[2px] select-none">🤔</span>
            <p className="text-[14px] leading-[1.7] italic text-rose-200/80">
              {prompt}
            </p>
          </div>
        )}

        <CalloutImage block={block} />
      </div>
    </div>
  );
}

// ─── Real-World Application ───────────────────────────────────────────────────
// "Connect" family enrichment card. Deliberately NOT a neon/translucent tint —
// a solid, muted teal panel with white body text and a soft-aqua header, for an
// elegant textbook feel. Distinct from the borderless "Did You Know" hook: this
// is the boxed section that says "here is where this shows up in the real world."
function RealWorldCallout({ block }: { block: CalloutBlock }) {
  const mdComponents = {
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-[16px] leading-[1.8] text-white/88 my-2.5 first:mt-0 last:mb-0">{children}</p>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold not-italic" style={{ color: '#8fe0d6' }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-white/70">{children}</em>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-2.5 pl-5 space-y-1.5 list-disc" style={{ color: 'rgba(255,255,255,0.88)' }}>{children}</ul>
    ),
    // Numbered variant of the list above — this card is also used for plain
    // ordered lists of facts (e.g. "Properties of X"), not just prose.
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-2.5 pl-5 space-y-2 list-decimal" style={{ color: 'rgba(255,255,255,0.88)' }}>{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-[16px] leading-[1.75] text-white/88 pl-1">{children}</li>
    ),
    hr: () => <div className="my-4 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />,
  };

  return (
    <div
      className="my-8 rounded-2xl overflow-hidden"
      style={{ background: '#14262b', border: '1px solid #244a52' }}
    >
      {/* Header — solid, muted; icon badge + label */}
      <div className="flex items-center gap-2.5 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(127,212,201,0.12)' }}>
          <Globe size={14} style={{ color: '#7fd4c9' }} />
        </span>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: '#7fd4c9' }}>
          {block.title ?? 'Real-World Application'}
        </span>
      </div>

      {/* Body — when an image is present, text sits on the left and the image
          on the right (stacks on mobile). Without one, the text spans full width. */}
      {(() => {
        const hasImage = !!(block.image_src || block.image_prompt);
        const text = (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
            components={mdComponents}
          >
            {block.markdown}
          </ReactMarkdown>
        );
        if (!hasImage) {
          return <div className="px-5 py-4">{text}</div>;
        }
        return (
          <div className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-5">
            <div className="md:flex-1 min-w-0">{text}</div>
            <div className="md:w-2/5 shrink-0">
              {block.image_src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={block.image_src}
                  alt={block.title ?? 'Real-world application'}
                  loading="lazy"
                  className="w-full rounded-lg border border-white/10"
                />
              ) : (
                <div className="rounded-lg border border-dashed border-white/12 bg-white/[0.02] px-3 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#7fd4c9' }}>
                    Image needed — generation prompt:
                  </p>
                  <p className="text-[12px] leading-relaxed text-white/45 select-all">
                    {block.image_prompt}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function CalloutBlockRenderer({ block, hinglish }: { block: CalloutBlock; hinglish?: boolean }) {
  // In HI mode, swap the body to the Hinglish twin so the sub-renderers
  // (which read block.markdown) display it without further changes.
  const b = hinglish && block.markdown_hinglish ? { ...block, markdown: block.markdown_hinglish } : block;
  switch (b.variant) {
    case 'exam_tip':            return <ExamTipCallout block={b} />;
    case 'fun_fact':            return <FunFactCallout block={b} />;
    case 'remember':            return <RememberCallout block={b} />;
    case 'warning':             return <WarningCallout block={b} />;
    case 'voices_that_inspire': return <VoicesThatInspireCallout block={b} />;
    case 'real_world':          return <RealWorldCallout block={b} />;
    case 'note':
    default:                    return <NoteCallout block={b} />;
  }
}
