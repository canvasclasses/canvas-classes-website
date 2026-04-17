'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, BookOpen, Trophy, ArrowRight, Bookmark,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import PageRenderer from '../renderer/PageRenderer';
import { Book, BookPage, BlockType, ContentBlock } from '@/types/books';
import { useBookProgress } from '@/hooks/useBookProgress';
import { useBookBookmarks } from '@/hooks/useBookBookmarks';
import FreeGate from './FreeGate';

function hasBlockType(blocks: ContentBlock[], type: BlockType): boolean {
  return blocks.some(b => {
    if (b.type === type) return true;
    if (b.type === 'section') return b.columns.some(col => hasBlockType(col, type));
    return false;
  });
}

interface PageSummary {
  _id: string;
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  published: boolean;
}

interface Props {
  book: Book;
  page: BookPage;
  allPages: PageSummary[];
  chapterPages: PageSummary[];
  prevPageSlug: string | null;
  nextPageSlug: string | null;
  bookSlug: string;
  basePath?: string;
}

export default function BookReader({
  book, page, chapterPages, prevPageSlug, nextPageSlug, bookSlug, basePath,
}: Props) {
  const bp = basePath ?? `/books/${bookSlug}`;
  const router = useRouter();

  const { completedSlugs, markComplete } = useBookProgress(bookSlug);
  const { bookmarkedSlugs, toggleBookmark } = useBookBookmarks(bookSlug);

  const [quizPassed, setQuizPassed] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneScore, setMilestoneScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const hasQuiz = hasBlockType(page.blocks, 'inline_quiz');

  useEffect(() => {
    if (completedSlugs.has(page.slug)) {
      setQuizPassed(true);
    } else {
      setQuizPassed(false);
    }
  }, [completedSlugs, page.slug]);

  const completePage = useCallback(
    async (score: number, celebrate = true) => {
      if (completedSlugs.has(page.slug)) return;
      const ok = await markComplete({
        pageSlug: page.slug,
        chapterNumber: page.chapter_number,
        quizScore: score,
      });
      if (ok && celebrate) {
        setMilestoneScore(score);
        setShowMilestone(true);
      }
    },
    [markComplete, completedSlugs, page.slug, page.chapter_number]
  );

  function handleQuizPass(_blockId: string, score: number) {
    setQuizPassed(true);
    completePage(score, true);
  }

  // Pages with no quiz complete silently on load — no popup
  useEffect(() => {
    if (!hasQuiz && !completedSlugs.has(page.slug)) {
      completePage(100, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuiz, page.slug]);

  const completedInChapter = chapterPages.filter(p => completedSlugs.has(p.slug)).length;
  const progressPct = chapterPages.length > 0
    ? Math.round((completedInChapter / chapterPages.length) * 100)
    : 0;

  const chapterTitle = book.chapters.find(c => c.number === page.chapter_number)?.title ?? `Chapter ${page.chapter_number}`;
  const canGoNext = !hasQuiz || quizPassed;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0B0F15]/95 backdrop-blur border-b border-white/8">
        <div className="max-w-[1060px] mx-auto px-4 h-12 flex items-center gap-3">
          <Link href={bp}
            className="text-white/40 hover:text-white/70 transition-colors shrink-0">
            <ChevronLeft size={18} />
          </Link>

          <BookOpen size={14} className="text-orange-400 shrink-0" />
          <span className="text-xs text-white/50 truncate flex-1">{chapterTitle}</span>
          <span className="text-xs text-white/30 shrink-0">
            {completedInChapter}/{chapterPages.length}
          </span>
          <button
            onClick={() => toggleBookmark(page.slug, page.title, page.chapter_number)}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              bookmarkedSlugs.has(page.slug)
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-white/25 hover:text-white/50 hover:bg-white/5'
            }`}
            title={bookmarkedSlugs.has(page.slug) ? 'Remove bookmark' : 'Bookmark this page'}
          >
            <Bookmark size={14} className={bookmarkedSlugs.has(page.slug) ? 'fill-amber-400' : ''} />
          </button>
        </div>

        {/* Chapter progress bar */}
        <div className="relative h-[2px] bg-white/8">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-amber-400 to-amber-300 transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              boxShadow: progressPct > 0 ? '0 0 10px 1px rgba(251,146,60,0.55)' : 'none',
            }}
          />
        </div>
      </header>

      {/* ── Body: sidebar + content ────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Chapter sidebar (desktop only) ───────────────────────────── */}
        {/* Outer flex row: sidebar panel + toggle tab, both sticky */}
        <div className="hidden lg:flex shrink-0">

          {/* Sidebar panel */}
          {sidebarOpen && (
            <aside className="w-[260px] flex flex-col overflow-y-auto
              border-r border-white/5 bg-[#0B0F15]/50
              sticky top-[50px] h-[calc(100vh-50px-56px)]">
              <div className="p-4">
                {/* Chapter heading */}
                <p className="text-[10px] text-orange-400/60 font-bold uppercase tracking-widest mb-1">
                  Chapter {page.chapter_number}
                </p>
                <p className="text-[13px] text-white/60 font-medium leading-snug mb-4">
                  {chapterTitle}
                </p>

                {/* Progress summary */}
                <div className="mb-4">
                  <div className="h-[3px] bg-white/8 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressPct === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-orange-500 to-amber-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/25">
                    {completedInChapter} of {chapterPages.length} completed
                  </p>
                </div>

                {/* Page list */}
                <nav className="flex flex-col gap-0.5">
                  {chapterPages.map((pg, i) => {
                    const isCurrent = pg.slug === page.slug;
                    const isDone    = completedSlugs.has(pg.slug);

                    return (
                      <Link
                        key={pg.slug}
                        href={`${bp}/${pg.slug}`}
                        className={`flex items-start gap-2 px-2.5 py-2 rounded-lg transition-all group ${
                          isCurrent
                            ? 'bg-orange-500/10 border border-orange-500/20'
                            : isDone
                              ? 'hover:bg-emerald-500/[0.06] border border-transparent'
                              : 'hover:bg-white/[0.04] border border-transparent'
                        }`}
                      >
                        {/* Status indicator */}
                        <div className="shrink-0 mt-0.5 w-4 flex items-center justify-center">
                          {isDone ? (
                            <CheckCircle2 size={13} className="text-emerald-400" />
                          ) : isCurrent ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          ) : (
                            <span className="text-[9px] text-white/25 font-medium">
                              {i + 1}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <span className={`text-[12px] leading-snug flex-1 transition-colors ${
                          isCurrent
                            ? 'text-orange-300 font-medium'
                            : isDone
                              ? 'text-white/35 group-hover:text-white/50'
                              : 'text-white/50 group-hover:text-white/70'
                        }`}>
                          {pg.title}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* Toggle tab strip — always rendered, sticky beside the sidebar.
              The button is centered vertically on the dividing line. */}
          <div className="sticky top-[50px] h-[calc(100vh-50px-56px)] flex items-center">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              title={sidebarOpen ? 'Hide chapter list' : 'Show chapter list'}
              className="flex items-center justify-center
                w-5 h-12 rounded-r-lg -ml-px
                bg-[#0B0F15] border border-l-0 border-white/10
                text-white/30 hover:text-white/70 hover:bg-[#151E32]
                transition-colors"
            >
              {sidebarOpen ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
            </button>
          </div>

        </div>

        {/* ── Page content ──────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          <PageRenderer
            page={page}
            onQuizPass={handleQuizPass}
          />
        </main>
      </div>

      {/* ── Bottom nav ──────────────────────────────────────────────────── */}
      <nav className="sticky bottom-0 z-40 bg-[#0B0F15]/95 backdrop-blur border-t border-white/8">
        <div className="max-w-[1060px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Previous */}
          {prevPageSlug ? (
            <Link href={`${bp}/${prevPageSlug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10
                bg-white/5 hover:bg-white/10 text-sm text-white/60 transition-colors">
              <ChevronLeft size={15} /> Previous
            </Link>
          ) : <div />}

          {/* Quiz gate hint */}
          {hasQuiz && !quizPassed && (
            <p className="text-xs text-white/30 text-center">
              Complete the quiz to unlock the next topic
            </p>
          )}

          {/* Next */}
          {nextPageSlug ? (
            <Link
              href={canGoNext ? `${bp}/${nextPageSlug}` : '#'}
              onClick={e => { if (!canGoNext) e.preventDefault(); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${canGoNext
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold hover:opacity-90'
                  : 'border border-white/10 bg-white/5 text-white/25 cursor-not-allowed'}`}
            >
              Next <ChevronRight size={15} />
            </Link>
          ) : (
            completedSlugs.has(page.slug) && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                <Trophy size={14} /> Chapter Complete!
              </div>
            )
          )}
        </div>
      </nav>

      {/* ── Metered free gate ──────────────────────────────────────────── */}
      <FreeGate bookSlug={bookSlug} pageSlug={page.slug} basePath={bp} />

      {/* ── Milestone overlay ───────────────────────────────────────────── */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowMilestone(false)}>
          <div className="bg-[#0B0F15] border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full
            text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-1">Milestone Unlocked!</h2>
            <p className="text-white/50 text-sm mb-2">{page.title}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
              bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
              <Trophy size={13} /> {milestoneScore}% score
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{chapterTitle}</span>
                <span>{completedInChapter}/{chapterPages.length} pages</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowMilestone(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white/80">
                Stay here
              </button>
              {nextPageSlug && (
                <button
                  onClick={() => router.push(`${bp}/${nextPageSlug}`)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500
                    text-black text-sm font-bold flex items-center justify-center gap-1.5">
                  Next Topic <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
