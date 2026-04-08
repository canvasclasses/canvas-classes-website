'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PageRenderer from '../renderer/PageRenderer';
import { Book, BookPage } from '@/types/books';

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
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [quizPassed, setQuizPassed] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneScore, setMilestoneScore] = useState(0);

  const hasQuiz = page.blocks.some(b => b.type === 'inline_quiz');

  // Load existing progress for this book
  useEffect(() => {
    fetch(`/api/v2/books/progress?book_slug=${bookSlug}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setCompletedSlugs(new Set(d.data.map((r: { page_slug: string }) => r.page_slug)));
          if (d.data.some((r: { page_slug: string }) => r.page_slug === page.slug)) {
            setQuizPassed(true);
          }
        }
      })
      .catch(() => {});
  }, [bookSlug, page.slug]);

  const completePage = useCallback(async (score: number) => {
    if (completedSlugs.has(page.slug)) return;
    try {
      await fetch('/api/v2/books/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_slug: bookSlug,
          chapter_number: page.chapter_number,
          page_slug: page.slug,
          quiz_score: score,
        }),
      });
      setCompletedSlugs(prev => new Set([...prev, page.slug]));
      setMilestoneScore(score);
      setShowMilestone(true);
    } catch {}
  }, [bookSlug, page.slug, page.chapter_number, completedSlugs]);

  function handleQuizPass(blockId: string, score: number) {
    setQuizPassed(true);
    completePage(score);
  }

  // Pages with no quiz complete on load
  useEffect(() => {
    if (!hasQuiz && !completedSlugs.has(page.slug)) {
      completePage(100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuiz]);

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
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center gap-3">
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
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
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
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
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
