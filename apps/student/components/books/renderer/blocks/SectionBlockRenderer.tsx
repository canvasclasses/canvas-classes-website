'use client';

import { SectionBlock, SectionLayout } from '@/types/books';
import BlockRenderer from '../BlockRenderer';

const LAYOUT_CLASSES: Record<SectionLayout, string> = {
  'single-column': '',
  '50-50':     'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8',
  '60-40':     'grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-8',
  '40-60':     'grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-8',
  'full-bleed': '',
};

interface Props {
  block: SectionBlock;
  onQuizPass?: (blockId: string, score: number) => void;
}

export default function SectionBlockRenderer({ block, onQuizPass }: Props) {
  const isFullBleed = block.layout === 'full-bleed';
  const isSingleCol = block.layout === 'single-column' || isFullBleed;
  const gridClass = LAYOUT_CLASSES[block.layout];

  return (
    <div
      className={
        isFullBleed
          ? 'relative w-screen left-1/2 -translate-x-1/2'
          : ''
      }
    >
      {block.title && (
        <h2 className="text-[22px] font-semibold text-white/90 mb-4 tracking-tight">
          {block.title}
        </h2>
      )}

      {isSingleCol ? (
        /* Single column: render all blocks from columns[0] */
        <div className={isFullBleed ? 'w-full' : ''}>
          <div className="flex flex-col gap-1">
            {(block.columns[0] || []).map(child => (
              <div key={child.id}>
                <BlockRenderer block={child} onQuizPass={onQuizPass} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Multi-column grid */
        <div className={gridClass}>
          {block.columns.map((column, colIdx) => (
            <div key={colIdx} className="min-w-0 flex flex-col gap-1">
              {column.map(child => (
                <div key={child.id}>
                  <BlockRenderer block={child} onQuizPass={onQuizPass} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
