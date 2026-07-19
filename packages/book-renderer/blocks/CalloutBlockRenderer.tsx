'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
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
    <div className="my-6 lg:my-0 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">

      {/* Header — always visible, toggles the body */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        className="w-full px-4 py-3 flex items-center gap-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="shrink-0 w-7 h-7 rounded-full bg-amber-300/10 flex items-center justify-center">
          <GraduationCap size={14} className="text-amber-300/80" />
        </span>
        <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-amber-300/80 flex-1">
          {block.title ?? 'Quick Recap'}
        </span>
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase
          text-white/40 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10 shrink-0">
          JEE / NEET
        </span>
        {expanded
          ? <ChevronUp size={15} className="text-white/30 shrink-0" />
          : <ChevronDown size={15} className="text-white/30 shrink-0" />}
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
function FunFactCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-8">

      {/* Label row — diamond + title + trailing line */}
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-amber-400 text-[14px] leading-none select-none">✦</span>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-400/80 leading-none">
          {block.title ?? 'Real Life Hook'}
        </span>
        <div className="flex-1 h-px bg-amber-400/18" />
      </div>

      {/* Body */}
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
        components={{
          // Sanskrit / large header
          h3: ({ children }) => (
            <h3 className="text-[21px] font-bold text-amber-200/80 leading-[1.55] mt-2 mb-3">
              {children}
            </h3>
          ),
          // Amber hairline separator
          hr: () => (
            <div className="my-6 h-px bg-amber-400/20" />
          ),
          // Main body paragraphs — large, warm, readable
          p: ({ children }) => (
            <p className="text-[17px] leading-[1.85] text-white/82 mb-4 last:mb-0">
              {children}
            </p>
          ),
          // Hindi / connection lines — amber italic
          em: ({ children }) => (
            <em className="italic text-amber-200/80 text-[16px] leading-[1.8]">
              {children}
            </em>
          ),
          // English translation blockquote — left border, no background box
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-amber-400/30 pl-4 my-4 text-white/52 text-[15px] leading-[1.75] not-italic">
              {children}
            </blockquote>
          ),
          // Bold — amber highlight, pops off the white/82 body
          strong: ({ children }) => (
            <strong className="font-semibold text-amber-200/80 not-italic">
              {children}
            </strong>
          ),
        }}
      >
        {block.markdown}
      </ReactMarkdown>

      <CalloutImage block={block} />

      {/* Bottom accent — tapers to transparent, marks end of hook zone */}
      <div className="mt-7 h-px bg-gradient-to-r from-amber-400/25 via-amber-400/10 to-transparent" />
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
    case 'note':
    default:                    return <NoteCallout block={b} />;
  }
}
