'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PageRenderer from '../renderer/PageRenderer';
import { Book, BookPage, BlockType, ContentBlock } from '@/types/books';
import { useBookProgress } from '@/hooks/useBookProgress';

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
}

export default function BookReader({
  book, page, chapterPages, prevPageSlug, nextPageSlug, bookSlug,
}: Props) {
  const router = useRouter();

  // Progress is now owned by the useBookProgress hook, which caches the
  // result at the module level for the whole tab session. Navigating between
  // pages inside the same book no longer re-fetches.
  const { completedSlugs, markComplete } = useBookProgress(bookSlug);

  const [quizPassed, setQuizPassed] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneScore, setMilestoneScore] = useState(0);

  const hasQuiz = hasBlockType(page.blocks, 'inline_quiz');

  // Flip quizPassed to true whenever the current page lands in the completed
  // set — covers both fresh mounts of an already-completed page and the
  // optimistic update applied by markComplete.
  useEffect(() => {
    if (completedSlugs.has(page.slug)) {
      setQuizPassed(true);
    } else {
      setQuizPassed(false);
    }
  }, [completedSlugs, page.slug]);

  const completePage = useCallback(
    async (score: number) => {
      if (completedSlugs.has(page.slug)) return;
      const ok = await markComplete({
        pageSlug: page.slug,
        chapterNumber: page.chapter_number,
        quizScore: score,
      });
      if (ok) {
        setMilestoneScore(score);
        setShowMilestone(true);
      }
    },
    [markComplete, completedSlugs, page.slug, page.chapter_number]
  );

  function handleQuizPass(_blockId: string, score: number) {
    setQuizPassed(true);
    completePage(score);
  }

  // Pages with no quiz complete on load
  useEffect(() => {
    if (!hasQuiz && !completedSlugs.has(page.slug)) {
      completePage(100);
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
          <Link href={`/books/${bookSlug}`}
            className="text-white/40 hover:text-white/70 transition-colors shrink-0">
            <ChevronLeft size={18} />
          </Link>
          <BookOpen size={14} className="text-orange-400 shrink-0" />
          <span className="text-xs text-white/50 truncate flex-1">{chapterTitle}</span>
          <span className="text-xs text-white/30 shrink-0">
            {completedInChapter}/{chapterPages.length}
          </span>
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

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main className="flex-1">
        <PageRenderer
          page={page}
          onQuizPass={handleQuizPass}
        />
      </main>

      {/* ── Bottom nav ──────────────────────────────────────────────────── */}
      <nav className="sticky bottom-0 z-40 bg-[#0B0F15]/95 backdrop-blur border-t border-white/8">
        <div className="max-w-[1060px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Previous */}
          {prevPageSlug ? (
            <Link href={`/books/${bookSlug}/${prevPageSlug}`}
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
              href={canGoNext ? `/books/${bookSlug}/${nextPageSlug}` : '#'}
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

            {/* Updated progress bar */}
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
                  onClick={() => router.push(`/books/${bookSlug}/${nextPageSlug}`)}
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
