'use client';

import { BookPage, ContentBlock } from '@/types/books';

import TextBlockRenderer from './blocks/TextBlockRenderer';
import HeadingBlockRenderer from './blocks/HeadingBlockRenderer';
import ImageBlockRenderer from './blocks/ImageBlockRenderer';
import InteractiveImageBlockRenderer from './blocks/InteractiveImageBlockRenderer';
import VideoBlockRenderer from './blocks/VideoBlockRenderer';
import AudioNoteBlockRenderer from './blocks/AudioNoteBlockRenderer';
import Molecule2DBlockRenderer from './blocks/Molecule2DBlockRenderer';
import Molecule3DBlockRenderer from './blocks/Molecule3DBlockRenderer';
import LatexBlockRenderer from './blocks/LatexBlockRenderer';
import PracticeLinkBlockRenderer from './blocks/PracticeLinkBlockRenderer';
import CalloutBlockRenderer from './blocks/CalloutBlockRenderer';
import TableBlockRenderer from './blocks/TableBlockRenderer';
import TimelineBlockRenderer from './blocks/TimelineBlockRenderer';
import ComparisonCardBlockRenderer from './blocks/ComparisonCardBlockRenderer';
import AnimationBlockRenderer from './blocks/AnimationBlockRenderer';
import InlineQuizRenderer from './blocks/InlineQuizRenderer';
import WorkedExampleRenderer from './blocks/WorkedExampleRenderer';

// Callout variants that float to the margin sidebar on desktop.
// Everything else stays in the main prose column.
const SIDEBAR_CALLOUT_VARIANTS = new Set(['exam_tip', 'fun_fact', 'remember']);

function isSidebarBlock(block: ContentBlock): boolean {
  return block.type === 'callout' && SIDEBAR_CALLOUT_VARIANTS.has(block.variant);
}

function BlockRenderer({
  block,
  onQuizPass,
}: {
  block: ContentBlock;
  onQuizPass?: (blockId: string, score: number) => void;
}) {
  switch (block.type) {
    case 'text':              return <TextBlockRenderer block={block} />;
    case 'heading':           return <HeadingBlockRenderer block={block} />;
    case 'image':             return <ImageBlockRenderer block={block} />;
    case 'interactive_image': return <InteractiveImageBlockRenderer block={block} />;
    case 'video':             return <VideoBlockRenderer block={block} />;
    case 'audio_note':        return <AudioNoteBlockRenderer block={block} />;
    case 'molecule_2d':       return <Molecule2DBlockRenderer block={block} />;
    case 'molecule_3d':       return <Molecule3DBlockRenderer block={block} />;
    case 'latex_block':       return <LatexBlockRenderer block={block} />;
    case 'practice_link':     return <PracticeLinkBlockRenderer block={block} />;
    case 'callout':           return <CalloutBlockRenderer block={block} />;
    case 'table':             return <TableBlockRenderer block={block} />;
    case 'timeline':          return <TimelineBlockRenderer block={block} />;
    case 'comparison_card':   return <ComparisonCardBlockRenderer block={block} />;
    case 'animation':         return <AnimationBlockRenderer block={block} />;
    case 'inline_quiz':       return <InlineQuizRenderer block={block} onPass={score => onQuizPass?.(block.id, score)} />;
    case 'worked_example':    return <WorkedExampleRenderer block={block} />;
    default:                  return null;
  }
}

interface PageRendererProps {
  page: Pick<BookPage, 'title' | 'subtitle' | 'blocks' | 'reading_time_min'>;
  onQuizPass?: (blockId: string, score: number) => void;
}

export default function PageRenderer({ page, onQuizPass }: PageRendererProps) {
  const sorted = [...page.blocks].sort((a, b) => a.order - b.order);

  // Split blocks into main column and sidebar (desktop only).
  // On mobile everything renders inline in document order.
  const mainBlocks = sorted.filter(b => !isSidebarBlock(b));
  const sidebarBlocks = sorted.filter(b => isSidebarBlock(b));
  const hasSidebar = sidebarBlocks.length > 0;

  return (
    // Outer shell: centers content and caps total width on large screens
    <div className="w-full max-w-[1120px] mx-auto px-5 sm:px-8 py-10">

      {/* Page header — always full width */}
      <header className="mb-10 max-w-[680px]">
        <h1 className="text-[32px] sm:text-[38px] font-bold text-white leading-[1.15] tracking-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="mt-3 text-[17px] text-white/55 leading-snug">{page.subtitle}</p>
        )}
        {page.reading_time_min && (
          <p className="mt-4 text-xs text-white/30 flex items-center gap-1.5 tracking-wide">
            <span>📖</span>
            <span>{page.reading_time_min} min read</span>
          </p>
        )}
        <div className="mt-5 h-px bg-white/8" />
      </header>

      {/*
        ── Layout zones ──────────────────────────────────────────────
        Mobile  : single column — sidebar callouts appear inline
        Desktop : two columns — main prose (flex-1) + sticky sidebar (260px)
        ──────────────────────────────────────────────────────────────
      */}
      <div className={hasSidebar ? 'lg:flex lg:gap-14 lg:items-start' : ''}>

        {/* ── Main prose column ── */}
        <article className="min-w-0 flex-1 max-w-[680px]">
          {/* Mobile: render ALL blocks inline including callouts */}
          <div className="lg:hidden flex flex-col gap-1">
            {sorted.map(block => (
              <div key={block.id}>
                <BlockRenderer block={block} onQuizPass={onQuizPass} />
              </div>
            ))}
          </div>

          {/* Desktop: render only main column blocks */}
          <div className="hidden lg:flex lg:flex-col lg:gap-1">
            {mainBlocks.map(block => (
              <div key={block.id}>
                <BlockRenderer block={block} onQuizPass={onQuizPass} />
              </div>
            ))}
          </div>
        </article>

        {/* ── Sidebar (desktop only) ── */}
        {hasSidebar && (
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-6 self-start">
            <div className="flex flex-col gap-6 pt-1">
              {sidebarBlocks.map(block => (
                <div key={block.id}>
                  <BlockRenderer block={block} onQuizPass={onQuizPass} />
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
