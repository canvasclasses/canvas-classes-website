'use client';

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { BookPage, ContentBlock, TextBlock } from '@/types/books';
import BlockRenderer from './BlockRenderer';

// Callout variants that float to the margin sidebar on desktop.
// fun_fact is intentionally excluded — opening hooks must render in the main column
// so students see them before diving into core text.
const SIDEBAR_CALLOUT_VARIANTS = new Set(['exam_tip', 'remember']);

function isSidebarBlock(block: ContentBlock): boolean {
  return block.type === 'callout' && SIDEBAR_CALLOUT_VARIANTS.has(block.variant);
}

const HINGLISH_PREF_KEY = 'canvas_hinglish_mode';

interface PageRendererProps {
  page: Pick<BookPage, 'title' | 'subtitle' | 'blocks' | 'reading_time_min' | 'hinglish_blocks'>;
  onQuizPass?: (blockId: string, score: number) => void;
  /**
   * When provided (admin preview), PageRenderer uses this value instead of its
   * own internal state and hides its in-page toggle to avoid duplication.
   * When undefined (student reader), the component manages its own toggle.
   */
  hinglishOverride?: boolean;
}

function PageRendererInner({ page, onQuizPass, hinglishOverride }: PageRendererProps) {
  const hasHinglish = Boolean(page.hinglish_blocks && page.hinglish_blocks.length > 0);
  // In controlled mode (admin), the parent drives the value — no internal state needed.
  const isControlled = hinglishOverride !== undefined;

  // Read persisted preference on mount; default to English
  const [hinglish, setHinglish] = useState(false);
  useEffect(() => {
    if (isControlled || !hasHinglish) return;
    try {
      setHinglish(localStorage.getItem(HINGLISH_PREF_KEY) === '1');
    } catch { /* localStorage unavailable — stay English */ }
  }, [isControlled, hasHinglish]);

  const toggleHinglish = useCallback(() => {
    setHinglish(prev => {
      const next = !prev;
      try { localStorage.setItem(HINGLISH_PREF_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Effective value: parent-controlled when override is set, internal otherwise
  const activeHinglish = isControlled ? hinglishOverride : hinglish;

  // Map from block id → Hinglish TextBlock for O(1) lookup during render
  const hinglishMap = useMemo(
    () => new Map<string, TextBlock>(
      (page.hinglish_blocks ?? []).map(b => [b.id, b])
    ),
    [page.hinglish_blocks]
  );

  // When Hinglish mode is active, swap text blocks that have a translation
  const resolveBlock = useCallback(
    (block: ContentBlock): ContentBlock => {
      if (activeHinglish && block.type === 'text') {
        return (hinglishMap.get(block.id) as ContentBlock) ?? block;
      }
      return block;
    },
    [activeHinglish, hinglishMap]
  );

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
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-white leading-[1.15] tracking-tight">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="mt-3 text-[17px] text-white/55 leading-snug">{page.subtitle}</p>
            )}
          </div>

          {/* EN / HI toggle — student reader only (hidden when parent controls via hinglishOverride) */}
          {hasHinglish && !isControlled && (
            <div className="shrink-0 mt-1.5 flex items-center rounded-lg overflow-hidden
              border border-white/10 text-[11px] font-bold tracking-wider">
              <button
                onClick={() => activeHinglish && toggleHinglish()}
                className={`px-3 py-1.5 transition-colors ${
                  !activeHinglish
                    ? 'bg-orange-500 text-black'
                    : 'bg-transparent text-white/40 hover:text-white/70'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => !activeHinglish && toggleHinglish()}
                className={`px-3 py-1.5 transition-colors ${
                  activeHinglish
                    ? 'bg-orange-500 text-black'
                    : 'bg-transparent text-white/40 hover:text-white/70'
                }`}
              >
                HI
              </button>
            </div>
          )}
        </div>
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
                <BlockRenderer block={resolveBlock(block)} onQuizPass={onQuizPass} />
              </div>
            ))}
          </div>

          {/* Desktop: render only main column blocks */}
          <div className="hidden xl:flex xl:flex-col xl:gap-1">
            {mainBlocks.map(block => (
              <div key={block.id}>
                <BlockRenderer block={resolveBlock(block)} onQuizPass={onQuizPass} />
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
