'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, BookOpen, Trophy, ArrowRight, Bookmark,
  CheckCircle2, Brain, Gamepad2, X, Library,
} from 'lucide-react';
import Link from 'next/link';
import PageRenderer from '@canvas/book-renderer/PageRenderer';
import { ExtraSimulatorsProvider } from '@canvas/book-renderer/simulators-context';
import { VaultProvider } from '@canvas/book-renderer/vault-context';
import { BookProvider } from '@canvas/book-renderer/book-context';
// App-injected simulators (atomic-models, heart-3d, VSEPR, bond-angle) live in a
// shared module so the reader AND the Biology Hub render the same sims by id.
import { EXTRA_SIMULATORS } from '@/features/books/lib/extraSimulators';
import { Book, BookPage, BlockType, ContentBlock, ChapterJourney } from '@canvas/data/types/books';
import ChapterOpener from './ChapterOpener';
import { useBookProgress } from '@/features/books/hooks/useBookProgress';
import { useBookBookmarks } from '@/features/books/hooks/useBookBookmarks';
import { useBookUserState } from '@/features/books/hooks/useBookUserState';
import { useVaultProgress } from '@/features/books/hooks/useVaultProgress';
import { isReaderLoggedIn } from '@/features/books/lib/readerAuth';
import type { VaultWord } from '@canvas/data/books/vocabulary';
import FreeGate from './FreeGate';
import ReaderThemeControl from './ReaderThemeControl';

// The Word Vault is only meaningful for English (Kaveri) books — that's where
// the tappable glosses + vocabulary_lab cards live. Other books simply don't
// surface the save action (the provider is still mounted but no English block
// ever calls onSaveWord).
const VAULT_ENABLED_SUBJECTS = new Set(['english']);

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
  page_type?: 'lesson' | 'chapter_opener';
  worked_example_count?: number;
}

interface Props {
  book: Book;
  page: BookPage;
  allPages: PageSummary[];
  chapterPages: PageSummary[];
  chapterJourney?: ChapterJourney | null;
  prevPageSlug: string | null;
  nextPageSlug: string | null;
  bookSlug: string;
  basePath?: string;
}

export default function BookReader({
  book, page, chapterPages, chapterJourney, prevPageSlug, nextPageSlug, bookSlug, basePath,
}: Props) {
  const bp = basePath ?? `/books/${bookSlug}`;
  const router = useRouter();

  // Chapter opener (§15.1) is a cover page, not a lesson — exclude it from
  // progress counts and the numbered sidebar list.
  const isOpener = page.page_type === 'chapter_opener';
  const lessonPages = chapterPages.filter(p => p.page_type !== 'chapter_opener');
  const openerPage = chapterPages.find(p => p.page_type === 'chapter_opener');

  // Chapter-continuous "Solved Example N" numbering: the running count of
  // worked examples on all chapter pages BEFORE this one. PageRenderer numbers
  // this page's examples starting at exampleOffset + 1, so numbers stay unique
  // and auto-adjust across the whole chapter as examples are added/removed.
  // chapterPages arrives pre-sorted (chapter_number, page_number) from the route.
  const currentPageIdx = chapterPages.findIndex(p => p.slug === page.slug);
  const exampleOffset = chapterPages
    .slice(0, currentPageIdx < 0 ? 0 : currentPageIdx)
    .reduce((sum, p) => sum + (p.worked_example_count ?? 0), 0);

  // Kicks off a single combined fetch for progress + bookmarks, seeding both
  // caches before the individual hooks would otherwise fire two round-trips.
  useBookUserState(bookSlug);

  const { completedSlugs, markComplete } = useBookProgress(bookSlug);
  const { bookmarkedSlugs, toggleBookmark } = useBookBookmarks(bookSlug);

  // Word Vault — saved-word state + a transient "saved" toast.
  const vaultEnabled = VAULT_ENABLED_SUBJECTS.has(book.subject);
  const vault = useVaultProgress(bookSlug);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const handleSaveWord = useCallback((word: VaultWord) => {
    if (vault.saveWord(word)) setSavedToast(word.word);
  }, [vault]);
  useEffect(() => {
    if (!savedToast) return;
    const t = setTimeout(() => setSavedToast(null), 2200);
    return () => clearTimeout(t);
  }, [savedToast]);

  const [quizPassed, setQuizPassed] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneScore, setMilestoneScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // null = unknown (auth check still in flight). We only gate once we know the
  // visitor is definitively logged out, so a slow check never blocks a member.
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  // A page is "gated" if it has a closing quiz OR an adaptive practice block —
  // either way the reader must finish it before the page counts as complete.
  const hasQuiz = hasBlockType(page.blocks, 'inline_quiz')
    || hasBlockType(page.blocks, 'chapter_practice')
    || hasBlockType(page.blocks, 'apply_express');

  useEffect(() => {
    let cancelled = false;
    isReaderLoggedIn().then(v => { if (!cancelled) setLoggedIn(v); });
    return () => { cancelled = true; };
  }, []);

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
    // Logged-out readers can't have progress saved — the POST would 401 and the
    // optimistic insert would roll back, flipping `quizPassed` (and the Next
    // button) back off with no explanation. Skip the save and nudge them to
    // sign in instead.
    if (loggedIn === false) {
      setShowSignInPrompt(true);
      return;
    }
    completePage(score, true);
  }

  // Pages with no quiz complete silently on load — no popup. Only attempt the
  // save once we know the reader is logged in; for anonymous visitors it would
  // just 401 and roll back.
  useEffect(() => {
    if (loggedIn === true && !hasQuiz && !isOpener && !completedSlugs.has(page.slug)) {
      completePage(100, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuiz, page.slug, loggedIn, isOpener]);

  const completedInChapter = lessonPages.filter(p => completedSlugs.has(p.slug)).length;
  const progressPct = lessonPages.length > 0
    ? Math.round((completedInChapter / lessonPages.length) * 100)
    : 0;

  const chapterTitle = book.chapters.find(c => c.number === page.chapter_number)?.title ?? `Chapter ${page.chapter_number}`;
  const canGoNext = !hasQuiz || quizPassed;

  // Chapter-opener content is authored as a hero image + an optional bullet-list
  // text block ("What you'll master"); the journey is computed server-side.
  const heroBlock = isOpener ? page.blocks.find(b => b.type === 'image') : undefined;
  const outcomesBlock = isOpener ? page.blocks.find(b => b.type === 'text') : undefined;
  const openerOutcomes = outcomesBlock && 'markdown' in outcomesBlock
    ? outcomesBlock.markdown.split('\n').map(l => l.trim()).filter(l => /^[-*]\s+/.test(l)).map(l => l.replace(/^[-*]\s+/, ''))
    : [];

  return (
    <div className="min-h-screen bg-[var(--book-bg)] text-white flex flex-col">

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[var(--book-surface)] backdrop-blur border-b border-white/8">
        <div className="max-w-[1060px] mx-auto px-4 h-12 flex items-center gap-3">
          <Link href={bp}
            className="text-white/40 hover:text-white/70 transition-colors shrink-0">
            <ChevronLeft size={18} />
          </Link>

          <BookOpen size={14} className="text-orange-400 shrink-0" />
          <span className="text-xs text-white/50 truncate flex-1">{chapterTitle}</span>
          <span className="text-xs text-white/30 shrink-0">
            {completedInChapter}/{lessonPages.length}
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
          {vaultEnabled && (
            <Link
              href={`${bp}/vault`}
              title="Open your Word Vault"
              className="shrink-0 flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-lg text-sky-300/80
                bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
            >
              <Library size={14} />
              <span className="text-[11px] font-semibold tabular-nums">{vault.savedCount}</span>
            </Link>
          )}
          <ReaderThemeControl />
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
              border-r border-white/5 bg-[var(--book-surface)]
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
                    {completedInChapter} of {lessonPages.length} completed
                  </p>
                </div>

                {/* Page list */}
                <nav className="flex flex-col gap-0.5">
                  {/* Chapter overview (opener) — the front door, reachable from any page */}
                  {openerPage && (
                    <Link
                      href={`${bp}/${openerPage.slug}`}
                      className={`flex items-center gap-2 px-2.5 py-2 mb-1 rounded-lg transition-all ${
                        isOpener
                          ? 'bg-orange-500/10 border border-orange-500/20'
                          : 'hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <BookOpen size={13} className={isOpener ? 'text-orange-400 shrink-0' : 'text-white/35 shrink-0'} />
                      <span className={`text-[12px] font-medium leading-snug ${isOpener ? 'text-orange-300' : 'text-white/55'}`}>
                        Chapter Overview
                      </span>
                    </Link>
                  )}

                  {lessonPages.map((pg, i) => {
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
                bg-[var(--book-surface)] border border-l-0 border-white/10
                text-white/30 hover:text-white/70 hover:bg-[#151E32]
                transition-colors"
            >
              {sidebarOpen ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
            </button>
          </div>

        </div>

        {/* ── Page content ──────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {isOpener && chapterJourney ? (
            <ChapterOpener
              chapterNumber={page.chapter_number}
              chapterTitle={page.title}
              heroSrc={heroBlock && 'src' in heroBlock ? heroBlock.src : undefined}
              heroAlt={heroBlock && 'alt' in heroBlock ? heroBlock.alt : undefined}
              intro={page.subtitle}
              outcomes={openerOutcomes}
              journey={chapterJourney}
              basePath={bp}
            />
          ) : (
            <ExtraSimulatorsProvider value={EXTRA_SIMULATORS}>
              <BookProvider value={{ bookSlug }}>
                <VaultProvider
                  value={vaultEnabled ? { onSaveWord: handleSaveWord, isWordSaved: vault.hasWord } : {}}
                >
                  <PageRenderer
                    page={page}
                    onQuizPass={handleQuizPass}
                    exampleOffset={exampleOffset}
                  />
                </VaultProvider>
              </BookProvider>
            </ExtraSimulatorsProvider>
          )}
        </main>
      </div>

      {/* ── Bottom nav ──────────────────────────────────────────────────── */}
      <nav className="sticky bottom-0 z-40 bg-[var(--book-surface)] backdrop-blur border-t border-white/8">
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
              href={canGoNext && loggedIn !== false ? `${bp}/${nextPageSlug}` : '#'}
              onClick={e => {
                // Anonymous readers get one free page — intercept and prompt
                // sign-in instead of silently advancing or silently blocking.
                if (loggedIn === false) { e.preventDefault(); setShowSignInPrompt(true); return; }
                if (!canGoNext) e.preventDefault();
              }}
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

      {/* ── Word Vault save toast ──────────────────────────────────────── */}
      {savedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
          px-4 py-2.5 rounded-full bg-[var(--book-surface)] border border-sky-500/30 shadow-2xl
          text-sm text-white/85">
          <Library size={15} className="text-sky-400" />
          <span>Saved <span className="font-semibold text-sky-300">“{savedToast}”</span> to your Word Vault</span>
          <Link href={`${bp}/vault`} className="ml-1 text-sky-400 hover:text-sky-300 font-semibold text-[13px]">
            Review →
          </Link>
        </div>
      )}

      {/* ── Metered free gate ──────────────────────────────────────────── */}
      <FreeGate bookSlug={bookSlug} pageSlug={page.slug} basePath={bp} />

      {/* ── Milestone overlay ───────────────────────────────────────────── */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowMilestone(false)}>
          <div className="bg-[var(--book-surface)] border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full
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
                <span>{completedInChapter}/{lessonPages.length} pages</span>
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

      {/* ── Sign-in nudge (logged-out readers) ──────────────────────────── */}
      {showSignInPrompt && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          onClick={() => setShowSignInPrompt(false)}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />

          <div className="relative w-full max-w-md mx-4 bg-[var(--book-surface)] border border-white/10
            rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Dismiss */}
            <button
              onClick={() => setShowSignInPrompt(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30
                hover:text-white/70 hover:bg-white/5 transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
              flex items-center justify-center mx-auto mb-5">
              <BookOpen size={24} className="text-black" />
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-2">
              Sign in to keep reading
            </h2>
            <p className="text-sm text-white/50 text-center mb-6">
              You can read the first page for free. Create a free account to continue to
              the next page — and so your progress is saved as you go.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Track your progress across all chapters</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Brain size={16} className="text-violet-400 shrink-0" />
                <span>Adaptive quizzes that learn your weak spots</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Gamepad2 size={16} className="text-sky-400 shrink-0" />
                <span>Interactive simulations and 3D molecules</span>
              </div>
            </div>

            <Link
              href={`/login?next=${encodeURIComponent(nextPageSlug ? `${bp}/${nextPageSlug}` : `${bp}/${page.slug}`)}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
                hover:opacity-90 transition-opacity mb-3"
            >
              Sign in to continue <ArrowRight size={15} />
            </Link>

            <button
              onClick={() => setShowSignInPrompt(false)}
              className="w-full py-2 text-[13px] text-white/40 hover:text-white/70 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
