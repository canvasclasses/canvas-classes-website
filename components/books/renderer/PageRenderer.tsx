'use client';

import { memo, useMemo } from 'react';
import { BookPage, ContentBlock } from '@/types/books';
import BlockRenderer from './BlockRenderer';

// Callout variants that float to the margin sidebar on desktop.
// Everything else stays in the main prose column.
const SIDEBAR_CALLOUT_VARIANTS = new Set(['exam_tip', 'fun_fact', 'remember']);

function isSidebarBlock(block: ContentBlock): boolean {
  return block.type === 'callout' && SIDEBAR_CALLOUT_VARIANTS.has(block.variant);
}

interface PageRendererProps {
  page: Pick<BookPage, 'title' | 'subtitle' | 'blocks' | 'reading_time_min'>;
  onQuizPass?: (blockId: string, score: number) => void;
}

function PageRendererInner({ page, onQuizPass }: PageRendererProps) {
  // Memoize expensive sort + split so it only recalculates when blocks change
  const { sorted, mainBlocks, sidebarBlocks, hasSidebar } = useMemo(() => {
    const s = [...page.blocks].sort((a, b) => a.order - b.order);
    const main = s.filter(b => !isSidebarBlock(b));
    const sidebar = s.filter(b => isSidebarBlock(b));
    return { sorted: s, mainBlocks: main, sidebarBlocks: sidebar, hasSidebar: sidebar.length > 0 };
  }, [page.blocks]);

  return (
    // Outer shell: centers content and caps total width on large screens
    // book-page-content scopes CSS fixes (e.g. fraction zoom) to this reader only
    <div className="book-page-content w-full max-w-[1300px] mx-auto px-5 sm:px-8 pt-10 pb-10">

      {/* Page header — always full width */}
      <header className="mb-5 max-w-[980px]">
        <h1 className="text-[32px] sm:text-[38px] font-bold text-white leading-[1.15] tracking-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="mt-3 text-[17px] text-white/55 leading-snug">{page.subtitle}</p>
        )}
        <div className="mt-5 h-px bg-white/8" />
      </header>

      {/*
        ── Layout zones ──────────────────────────────────────────────
        Mobile  : single column — sidebar callouts appear inline
        Desktop : two columns — main prose (flex-1) + sticky sidebar (260px)
        ──────────────────────────────────────────────────────────────
      */}
      <div className={hasSidebar ? 'xl:flex xl:gap-14 xl:items-start' : ''}>

        {/* ── Main prose column ── */}
        <article className="min-w-0 flex-1 max-w-[980px]">
          {/* Mobile/tablet: render ALL blocks inline including callouts */}
          <div className="xl:hidden flex flex-col gap-1">
            {sorted.map(block => (
              <div key={block.id}>
                <BlockRenderer block={block} onQuizPass={onQuizPass} />
              </div>
            ))}
          </div>

          {/* Desktop: render only main column blocks */}
          <div className="hidden xl:flex xl:flex-col xl:gap-1">
            {mainBlocks.map(block => (
              <div key={block.id}>
                <BlockRenderer block={block} onQuizPass={onQuizPass} />
              </div>
            ))}
          </div>
        </article>

        {/* ── Sidebar (desktop only) ── */}
        {hasSidebar && (
          <aside className="hidden xl:block w-[290px] shrink-0 sticky top-6 self-start">
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

// Memo prevents the entire preview pane from re-rendering when only workspace
// state (e.g. sidebar selection, save status) changes — blocks are the only
// prop that should trigger a re-render here.
const PageRenderer = memo(PageRendererInner);
export default PageRenderer;
