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

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white leading-tight">{page.title}</h1>
        {page.subtitle && (
          <p className="mt-2 text-lg text-white/60">{page.subtitle}</p>
        )}
        {page.reading_time_min && (
          <p className="mt-3 text-xs text-white/35 flex items-center gap-1">
            <span>📖</span>
            <span>{page.reading_time_min} min read</span>
          </p>
        )}
        <div className="mt-4 h-px bg-white/10" />
      </header>

      {/* Block stack */}
      <div className="flex flex-col gap-2">
        {sorted.map((block) => (
          <div key={block.id}>
            <BlockRenderer block={block} onQuizPass={onQuizPass} />
          </div>
        ))}
      </div>
    </article>
  );
}
