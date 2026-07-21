'use client';

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { BookPage, ContentBlock, TextBlock } from '@canvas/data/types/books';
import BlockRenderer from './BlockRenderer';
import RailPanel from './blocks/RailPanel';
import { FigureRefsProvider } from './figure-refs-context';
import { GlossaryProvider } from './glossary-context';

// Callout variants that float to the margin sidebar on desktop.
// fun_fact is intentionally excluded — opening hooks must render in the main column
// so students see them before diving into core text.
const SIDEBAR_CALLOUT_VARIANTS = new Set(['exam_tip', 'remember']);

function isExamBlock(block: ContentBlock): boolean {
  return block.type === 'callout' && SIDEBAR_CALLOUT_VARIANTS.has(block.variant);
}

// True if any analytical block carries a Hinglish twin — so the EN/HI toggle
// appears even on pages with no text-block hinglish_blocks (the analytical
// surfaces are where the Hindi-medium reader most needs the thinking supported).
function hasAnalyticalHinglish(blocks: ContentBlock[]): boolean {
  return blocks.some((b) => {
    if (b.type === 'callout') return !!b.markdown_hinglish;
    if (b.type === 'tone_meter') return b.segments?.some((s) => !!s.note_hinglish);
    if (b.type === 'literary_devices_highlighter') return b.devices?.some((d) => d.matches?.some((m) => !!m.explanation_hinglish));
    if (b.type === 'cultural_context_card') return !!b.detail_hinglish;
    if (b.type === 'theme_explorer') return b.themes?.some((t) => !!t.description_hinglish || !!t.reflection_prompt_hinglish);
    return false;
  });
}

const HINGLISH_PREF_KEY = 'canvas_hinglish_mode';

interface PageRendererProps {
  page: Pick<BookPage, 'title' | 'subtitle' | 'blocks' | 'reading_time_min' | 'hinglish_blocks' | 'competency' | 'figure_refs' | 'glossary'>;
  onQuizPass?: (blockId: string, score: number) => void;
  /**
   * When provided (admin preview), PageRenderer uses this value instead of its
   * own internal state and hides its in-page toggle to avoid duplication.
   * When undefined (student reader), the component manages its own toggle.
   */
  hinglishOverride?: boolean;
  /**
   * Real page origin (e.g. window.location.origin) for YouTube embeds — the
   * admin editor must pass this explicitly since its origin never matches
   * the student app's default. See VideoBlockRenderer.tsx.
   */
  videoOriginOverride?: string;
  /**
   * Running count of worked examples on chapter pages BEFORE this one. The
   * reader (BookReader) passes this so worked-example numbering is continuous
   * across the whole chapter — this page's examples are numbered
   * exampleOffset + 1, +2, … in document order. Defaults to 0 (admin preview /
   * standalone page → page-local numbering starting at 1).
   */
  exampleOffset?: number;
}

function PageRendererInner({ page, onQuizPass, hinglishOverride, videoOriginOverride, exampleOffset = 0 }: PageRendererProps) {
  const hasHinglish = Boolean(
    (page.hinglish_blocks && page.hinglish_blocks.length > 0) || hasAnalyticalHinglish(page.blocks)
  );
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

  // Memoize expensive sort + split so it only recalculates when blocks change.
  // Only exam callouts are PULLED OUT of the main column. Media (audio/video)
  // stays inline at its recorded section position; instead of a separate rail
  // playlist, each media block appears in the "On This Page" nav (below) as a
  // stop that scrolls to its inline player — so the nav reflects the true shape
  // of the page, media included.
  const { sorted, mainBlocks, examBlocks, hasExamRail } = useMemo(() => {
    const s = [...page.blocks].sort((a, b) => a.order - b.order);
    const main = s.filter(b => !isExamBlock(b));
    const exam = s.filter(b => isExamBlock(b));
    return { sorted: s, mainBlocks: main, examBlocks: exam, hasExamRail: exam.length > 0 };
  }, [page.blocks]);

  // Chapter-continuous worked-example numbering. Walk blocks in display order
  // (sorted by `order`, recursing into section columns so the count matches
  // book-writer's stored worked_example_count) and assign each worked_example
  // its number = exampleOffset + running index. Computed here, never stored in
  // the block, so numbers auto-adjust when examples are added/removed/reordered.
  const exampleNumbers = useMemo(() => {
    const map = new Map<string, number>();
    let n = exampleOffset;
    const walk = (blocks: ContentBlock[]) => {
      for (const b of blocks) {
        if (b.type === 'section' && Array.isArray(b.columns)) {
          for (const col of b.columns) walk(col as ContentBlock[]);
        } else if (b.type === 'worked_example') {
          map.set(b.id, ++n);
        }
      }
    };
    walk(sorted);
    return map;
  }, [sorted, exampleOffset]);

  // "On This Page" rail navigation — a MAP of the page, not just a list of
  // subtopics. Headings are top-level; the landmark special sections (worked
  // examples, Think It Through prompts, Real-World Application cards) appear as
  // indented, colour-dotted sub-items under their parent heading, so the shape
  // of the page (where the examples and practice sit) is visible at a glance.
  // Colours match the book system: Learn=amber, Think=violet, Connect=cyan.
  const navItems = useMemo(() => {
    const items: { id: string; label: string; kind: 'heading' | 'example' | 'think' | 'connect' | 'video' | 'audio' }[] = [];
    const snippet = (s: string) =>
      s.replace(/[*_$#>`~]/g, '').replace(/\s+/g, ' ').trim().slice(0, 34).replace(/\s\S*$/, '') + '…';
    const walk = (blocks: ContentBlock[]) => {
      for (const b of blocks) {
        if (b.type === 'heading' && (b.level == null || b.level <= 2)) {
          items.push({ id: b.id, label: b.text, kind: 'heading' });
        } else if (b.type === 'worked_example') {
          const n = exampleNumbers.get(b.id);
          items.push({ id: b.id, label: n != null ? `Example ${n}` : (b.label || 'Example'), kind: 'example' });
        } else if (b.type === 'reasoning_prompt') {
          items.push({ id: b.id, label: snippet(b.prompt), kind: 'think' });
        } else if (b.type === 'callout' && b.variant === 'real_world') {
          items.push({ id: b.id, label: b.title || 'Real-World Application', kind: 'connect' });
        } else if (b.type === 'video') {
          items.push({ id: b.id, label: b.caption || 'Video lecture', kind: 'video' });
        } else if (b.type === 'audio_note' && b.src?.trim()) {
          items.push({ id: b.id, label: b.label || 'Audio note', kind: 'audio' });
        } else if (b.type === 'section' && Array.isArray(b.columns)) {
          for (const col of b.columns) walk(col as ContentBlock[]);
        }
      }
    };
    walk(sorted);
    return items;
  }, [sorted, exampleNumbers]);

  // Show the nav lane only when there are ≥2 subtopic headings to jump between
  // (sub-items alone don't justify a map).
  const hasNav = navItems.filter((i) => i.kind === 'heading').length >= 2;
  const showRail = hasExamRail || hasNav;

  return (
    // Outer shell: centers content and caps total width on large screens
    // book-page-content scopes CSS fixes (e.g. fraction zoom) to this reader only
    <FigureRefsProvider value={page.figure_refs ?? {}}>
    <GlossaryProvider value={page.glossary ?? []}>
    <div className="book-page-content w-full max-w-[1495px] mx-auto px-3 sm:px-8 pt-8 pb-10">

      {/* Page header — always full width */}
      <header className="mb-5 max-w-[912px]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {page.competency && (
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1">
                <span className="text-emerald-300/90 text-[10px]">◆</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">
                  Builds: {page.competency.label}
                </span>
              </div>
            )}
            <h1
              className="text-[32px] sm:text-[38px] font-bold leading-[1.15] tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(120deg, #6ee7b7 0%, #34d399 45%, #22d3ee 100%)' }}
            >
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
      <div className={showRail ? 'xl:flex xl:gap-14 xl:items-start' : ''}>

        {/* ── Main prose column ── */}
        <article className="min-w-0 flex-1 max-w-[912px]">
          {/* Mobile/tablet: render ALL blocks inline including callouts + media
              (the rail doesn't exist below xl, so media stays in the flow). */}
          <div className="xl:hidden flex flex-col gap-1">
            {sorted.map(block => (
              /* No anchor id here: the rail (and its "On This Page" nav) is
                 desktop-only, and duplicate ids across the mobile + desktop
                 copies would make getElementById target this hidden copy. */
              <div key={block.id}>
                <BlockRenderer block={resolveBlock(block)} onQuizPass={onQuizPass} hinglish={activeHinglish} videoOriginOverride={videoOriginOverride} exampleNumber={exampleNumbers.get(block.id)} />
              </div>
            ))}
          </div>

          {/* Desktop: main column = everything except exam callouts (media stays inline; it's also mirrored in the rail) */}
          <div className="hidden xl:flex xl:flex-col xl:gap-1">
            {mainBlocks.map(block => (
              <div key={block.id} id={`block-${block.id}`} className="scroll-mt-20">
                <BlockRenderer block={resolveBlock(block)} onQuizPass={onQuizPass} hinglish={activeHinglish} videoOriginOverride={videoOriginOverride} exampleNumber={exampleNumbers.get(block.id)} />
              </div>
            ))}
          </div>
        </article>

        {/* ── Rail (desktop only): On This Page (incl. media) | Exam Insight ── */}
        {showRail && (
          // Sticks below the 50px reader header (top-0, sticky) with a comfortable
          // gap so the "On This Page" title isn't jammed under the header on scroll.
          <aside className="hidden xl:block w-[290px] shrink-0 sticky top-[66px] self-start">
            <div className="pt-1">
              <RailPanel navItems={hasNav ? navItems : []} examBlocks={examBlocks} onQuizPass={onQuizPass} />
            </div>
          </aside>
        )}
      </div>
    </div>
    </GlossaryProvider>
    </FigureRefsProvider>
  );
}

// Memo prevents the entire preview pane from re-rendering when only workspace
// state (e.g. sidebar selection, save status) changes — blocks are the only
// prop that should trigger a re-render here.
const PageRenderer = memo(PageRendererInner);
export default PageRenderer;
