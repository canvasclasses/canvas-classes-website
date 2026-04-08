'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CalloutBlock, CalloutVariant } from '@/types/books';

// ─── Exam Tip ─────────────────────────────────────────────────────────────────
// Clean typographic treatment — no box, no background. A subtle top rule + small
// caps label lets the content breathe and feel like an editorial aside.
function ExamTipCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-8 pt-5 border-t border-white/10">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-500/60 mb-3 select-none">
        <span className="text-[11px]">✦</span>
        {block.title ?? 'Exam Insight'}
        <span className="text-white/15">·</span>
        <span>JEE / NEET</span>
      </p>
      <div className="text-[15px] leading-[1.75] text-white/75
        prose prose-invert max-w-none
        prose-p:my-2 prose-p:leading-[1.75] prose-strong:text-white/90 prose-strong:font-semibold
        prose-ul:my-2 prose-li:my-1 prose-li:text-white/75">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ─── Fun Fact / Real World Hook ────────────────────────────────────────────────
// Editorial pull-quote style — a thin 3px left rule, generous indent, and soft
// italic tone. Feels like a magazine sidebar, not a UI notification.
function FunFactCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-7 pl-5 border-l-[3px] border-emerald-500/35">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-emerald-500/50 mb-2 select-none">
        {block.title ?? 'Real World'}
      </p>
      <div className="text-[15px] leading-[1.75] text-white/65 italic
        prose prose-invert max-w-none
        prose-p:my-2 prose-p:leading-[1.75] prose-strong:text-white/75 prose-strong:font-medium prose-strong:not-italic">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ─── Remember ─────────────────────────────────────────────────────────────────
// Left-rule accent, no background. Blue accent, clean.
function RememberCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-6 pl-5 border-l-[3px] border-blue-500/40">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-blue-400/60 mb-2 select-none">
        {block.title ?? 'Remember'}
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

// ─── Note ─────────────────────────────────────────────────────────────────────
function NoteCallout({ block }: { block: CalloutBlock }) {
  return (
    <div className="my-5 pl-4 border-l-[2px] border-white/15">
      {(block.title) && (
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/35 mb-1.5 select-none">
          {block.title}
        </p>
      )}
      <div className="text-[15px] leading-[1.75] text-white/55
        prose prose-invert max-w-none prose-p:my-1 prose-p:leading-[1.75]">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.markdown}
        </ReactMarkdown>
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
