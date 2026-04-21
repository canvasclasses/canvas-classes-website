'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen, ChevronRight, ChevronDown, Play, CheckCircle2, Search,
  FlaskConical, Video, Brain, ClipboardCheck, Gamepad2, Clock,
  ArrowRight, X, Sparkles, Bookmark, Atom, Calculator, Microscope,
  Beaker,
} from 'lucide-react';
import { useBookProgress, BookProgressRecord } from '@/hooks/useBookProgress';
import { useBookBookmarks } from '@/hooks/useBookBookmarks';
import { BlockType } from '@/types/books';

/* ─── Serialisable types ──────────────────────────────────────────────────── */

export interface GradePage {
  book_id: string;
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  reading_time_min?: number | null;
  content_types?: BlockType[] | null;
}

export interface GradeChapter {
  number: number;
  title: string;
  slug: string;
}

export interface GradeBook {
  _id: string;
  slug: string;
  title: string;
  subject: string;
  grade: number;
  chapters: GradeChapter[];
}

interface Props {
  grade: number;
  books: GradeBook[];
  pages: GradePage[];
  /** Base URL prefix for page links, e.g. "/class-9". Page links become basePath/bookSlug/pageSlug */
  basePath: string;
}

/* ─── Subject theming ─────────────────────────────────────────────────────── */

const SUBJECT_THEME: Record<string, {
  icon: typeof Atom;
  accent: string;
  bg: string;
  border: string;
  bar: string;
  badge: string;
}> = {
  physics: {
    icon: Atom,
    accent: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    bar: 'from-sky-500 to-cyan-400',
    badge: 'bg-sky-500/15 text-sky-400',
  },
  mathematics: {
    icon: Calculator,
    accent: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    bar: 'from-violet-500 to-purple-400',
    badge: 'bg-violet-500/15 text-violet-400',
  },
  science: {
    icon: Microscope,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    bar: 'from-emerald-500 to-teal-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
  },
  chemistry: {
    icon: Beaker,
    accent: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    bar: 'from-orange-500 to-amber-400',
    badge: 'bg-orange-500/15 text-orange-400',
  },
  biology: {
    icon: Microscope,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    bar: 'from-emerald-500 to-teal-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
  },
};

const DEFAULT_THEME = SUBJECT_THEME.science;
function getTheme(subject: string) {
  return SUBJECT_THEME[subject] ?? DEFAULT_THEME;
}

/* ─── Content type icons ──────────────────────────────────────────────────── */

const CONTENT_ICONS: Partial<Record<BlockType, { icon: typeof FlaskConical; label: string; color: string }>> = {
  inline_quiz:       { icon: ClipboardCheck, label: 'Quiz',           color: 'text-amber-400' },
  simulation:        { icon: Gamepad2,       label: 'Simulation',     color: 'text-sky-400'   },
  video:             { icon: Video,          label: 'Video',          color: 'text-rose-400'  },
  molecule_3d:       { icon: FlaskConical,   label: '3D Molecule',    color: 'text-violet-400'},
  reasoning_prompt:  { icon: Brain,          label: 'Reasoning',      color: 'text-emerald-400'},
  worked_example:    { icon: Sparkles,       label: 'Worked Example', color: 'text-orange-400'},
  classify_exercise: { icon: ClipboardCheck, label: 'Exercise',       color: 'text-teal-400'  },
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── BookSidebarItem                                                       */
/* Calls useBookProgress for one book; renders book row + chapters with      */
/* progress bars — matches BookTableOfContents chapter card style            */
/* ═══════════════════════════════════════════════════════════════════════════ */

function BookSidebarItem({
  book, bookPages, isExpanded, selection, onToggle, onSelectChapter,
}: {
  book: GradeBook;
  bookPages: GradePage[];
  isExpanded: boolean;
  selection: Selection | null;
  onToggle: () => void;
  onSelectChapter: (bookSlug: string, chapterNum: number) => void;
}) {
  const { completedSlugs, loading } = useBookProgress(book.slug);
  const theme = getTheme(book.subject);
  const Icon = theme.icon;
  const isBookSelected = selection?.bookSlug === book.slug;

  return (
    <div>
      {/* Book row */}
      <button
        onClick={onToggle}
        className={`w-full text-left px-3 py-3 rounded-xl transition-all group flex items-center gap-2.5 ${
          isBookSelected
            ? `${theme.bg} border ${theme.border}`
            : 'hover:bg-white/[0.04] border border-transparent'
        }`}
      >
        <Icon
          size={15}
          className={`shrink-0 transition-colors ${
            isBookSelected ? theme.accent : 'text-white/30 group-hover:text-white/50'
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] leading-snug truncate transition-colors ${
            isBookSelected ? 'text-white font-medium' : 'text-white/55 group-hover:text-white/80'
          }`}>
            {book.title}
          </p>
          <p className="text-[10px] text-white/20 mt-0.5">
            {book.chapters.length} ch · {bookPages.length} pages
          </p>
        </div>
        {isExpanded
          ? <ChevronDown size={12} className="text-white/20 shrink-0" />
          : <ChevronRight size={12} className="text-white/20 shrink-0" />
        }
      </button>

      {/* Chapter list with progress bars */}
      {isExpanded && (
        <div className="ml-4 mt-2 mb-2 pl-3 border-l border-white/5 flex flex-col gap-0.5">
          {book.chapters.map((ch) => {
            const isChSelected = selection?.bookSlug === book.slug && selection?.chapterNum === ch.number;
            const chPages    = bookPages.filter(p => p.chapter_number === ch.number);
            const totalMin   = chPages.reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
            const completed  = !loading ? chPages.filter(p => completedSlugs.has(p.slug)).length : 0;
            const pct        = chPages.length > 0 ? Math.round((completed / chPages.length) * 100) : 0;
            const isDone     = pct === 100 && chPages.length > 0;

            return (
              <button
                key={ch.number}
                onClick={() => onSelectChapter(book.slug, ch.number)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group ${
                  isChSelected
                    ? 'bg-white/8 border border-white/12'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isChSelected ? theme.accent : 'text-white/25 group-hover:text-white/40'
                  }`}>
                    Ch {ch.number}
                  </span>
                  {isDone && <CheckCircle2 size={10} className="text-emerald-400 ml-auto" />}
                </div>
                <p className={`text-xs leading-snug transition-colors ${
                  isChSelected ? 'text-white font-medium' : 'text-white/45 group-hover:text-white/70'
                }`}>
                  {ch.title}
                </p>
                {/* Progress bar — only shown when chapter has pages */}
                {chPages.length > 0 && (
                  <div className="mt-2">
                    <div className="h-[3px] bg-white/8 rounded-full overflow-hidden">
                      {loading ? (
                        <div className="h-full w-0 bg-white/5 animate-pulse rounded-full" />
                      ) : (
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' : `bg-gradient-to-r ${theme.bar}`
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-white/20 mt-0.5">
                      {completed}/{chPages.length} pages{totalMin > 0 && ` · ~${totalMin} min`}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── ProgressBand                                                          */
/* Aggregates progress across up to 4 books; renders stats strip +          */
/* "Continue reading" card — mirrors BookTableOfContents section 2          */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ProgressBand({ books, pages, basePath }: { books: GradeBook[]; pages: GradePage[]; basePath: string }) {
  // Fixed hook calls — no conditional hooks, safe for up to 4 books per grade
  const prog0 = useBookProgress(books[0]?.slug ?? '__none__');
  const prog1 = useBookProgress(books[1]?.slug ?? '__none__');
  const prog2 = useBookProgress(books[2]?.slug ?? '__none__');
  const prog3 = useBookProgress(books[3]?.slug ?? '__none__');

  const allCompleted = useMemo(() => {
    const set = new Set<string>();
    [prog0, prog1, prog2, prog3].forEach(p => p.completedSlugs.forEach(s => set.add(s)));
    return set;
  }, [prog0.completedSlugs, prog1.completedSlugs, prog2.completedSlugs, prog3.completedSlugs]);

  const totalCompleted = allCompleted.size;

  const totalRemainingMin = useMemo(
    () => pages.filter(p => !allCompleted.has(p.slug)).reduce((s, p) => s + (p.reading_time_min ?? 0), 0),
    [pages, allCompleted],
  );

  // Find the next unread page after the most recently completed one
  const continueReading = useMemo(() => {
    const allRecords: (BookProgressRecord & { bSlug: string; bId: string })[] = [
      ...prog0.records.map(r => ({ ...r, bSlug: books[0]?.slug ?? '', bId: books[0]?._id ?? '' })),
      ...prog1.records.map(r => ({ ...r, bSlug: books[1]?.slug ?? '', bId: books[1]?._id ?? '' })),
      ...prog2.records.map(r => ({ ...r, bSlug: books[2]?.slug ?? '', bId: books[2]?._id ?? '' })),
      ...prog3.records.map(r => ({ ...r, bSlug: books[3]?.slug ?? '', bId: books[3]?._id ?? '' })),
    ].filter(r => r.bSlug);

    if (allRecords.length === 0) return null;

    // Most recently completed record
    const last = [...allRecords].sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
    )[0];

    const book = books.find(b => b.slug === last.bSlug);
    if (!book) return null;

    const bookPages = pages
      .filter(p => p.book_id === book._id)
      .sort((a, b) => a.chapter_number - b.chapter_number || a.page_number - b.page_number);

    const lastIdx = bookPages.findIndex(p => p.slug === last.page_slug);

    // Walk forward from last completed; find first incomplete page
    for (let i = Math.max(0, lastIdx + 1); i < bookPages.length; i++) {
      if (!allCompleted.has(bookPages[i].slug)) {
        return { page: bookPages[i], bookSlug: book.slug };
      }
    }

    // All done in that book — find first incomplete page in any other book
    for (const b2 of books) {
      if (b2.slug === book.slug) continue;
      const b2Pages = pages
        .filter(p => p.book_id === b2._id)
        .sort((a, b) => a.chapter_number - b.chapter_number || a.page_number - b.page_number);
      const first = b2Pages.find(p => !allCompleted.has(p.slug));
      if (first) return { page: first, bookSlug: b2.slug };
    }
    return null;
  }, [prog0.records, prog1.records, prog2.records, prog3.records, books, pages, allCompleted]);

  if (totalCompleted === 0) return null;

  return (
    <>
      {/* Stats strip */}
      <div className="border-b border-white/5 px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span className="text-white/50">
              <span className="text-white font-semibold">{totalCompleted}</span> pages completed
            </span>
          </div>
          {totalRemainingMin > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <Clock size={13} className="text-sky-400" />
              <span className="text-white/50">
                ~<span className="text-white font-semibold">{totalRemainingMin} min</span> remaining
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Continue reading card */}
      {continueReading && (
        <div className="border-b border-white/5 px-4 md:px-8 shrink-0">
          <div className="max-w-6xl mx-auto py-3">
            <Link
              href={`${basePath}/${continueReading.bookSlug}/${continueReading.page.slug}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/15
                bg-orange-500/[0.04] hover:bg-orange-500/[0.08] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0">
                <ArrowRight size={14} className="text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-orange-400/60 uppercase tracking-wider font-semibold">
                  Continue reading
                </p>
                <p className="text-sm text-white/80 group-hover:text-white truncate transition-colors">
                  {continueReading.page.title}
                </p>
              </div>
              {continueReading.page.reading_time_min && (
                <span className="text-xs text-white/20 shrink-0">
                  {continueReading.page.reading_time_min} min
                </span>
              )}
              <ChevronRight size={14} className="text-white/20 group-hover:text-orange-400 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── ChapterPageList — right panel when a chapter is selected              */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ChapterPageList({
  book, chapter, chapterIdx, chapterPages, basePath,
}: {
  book: GradeBook;
  chapter: GradeChapter;
  chapterIdx: number;
  chapterPages: GradePage[];
  basePath: string;
}) {
  const { records, completedSlugs, loading } = useBookProgress(book.slug);
  const { bookmarkedSlugs, toggleBookmark }  = useBookBookmarks(book.slug);
  const theme = getTheme(book.subject);

  const recordsBySlug = useMemo(() => {
    const map = new Map<string, BookProgressRecord>();
    for (const r of records) map.set(r.page_slug, r);
    return map;
  }, [records]);

  const progress = useMemo(() => {
    const total = chapterPages.length;
    if (total === 0) return { completed: 0, total: 0, pct: 0, remainingMin: 0 };
    const completed    = chapterPages.filter(p => completedSlugs.has(p.slug)).length;
    const remainingMin = chapterPages
      .filter(p => !completedSlugs.has(p.slug))
      .reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
    return { completed, total, pct: Math.round((completed / total) * 100), remainingMin };
  }, [chapterPages, completedSlugs]);

  const handleBookmark = useCallback(
    (e: React.MouseEvent, pg: GradePage) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmark(pg.slug, pg.title, pg.chapter_number);
    },
    [toggleBookmark],
  );

  return (
    <>
      {/* Chapter header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${theme.accent}`}>
            {book.title}
          </span>
          <ChevronRight size={10} className="text-white/20" />
          <span className={`text-xs font-bold uppercase tracking-wider ${theme.accent}`}>
            Chapter {chapter.number}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{chapter.title}</h2>

        {!loading && progress.total > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex-1 max-w-xs h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  progress.pct === 100 ? 'bg-emerald-500' : `bg-gradient-to-r ${theme.bar}`
                }`}
                style={{ width: `${progress.pct}%` }}
              />
            </div>
            <span className="text-xs text-white/35">
              {progress.completed} of {progress.total} completed
              {progress.pct > 0 && <span className="text-white/20"> · {progress.pct}%</span>}
            </span>
            {progress.remainingMin > 0 && (
              <span className="text-xs text-white/20 flex items-center gap-1">
                <Clock size={11} /> ~{progress.remainingMin} min left
              </span>
            )}
          </div>
        )}
      </div>

      {/* Page list */}
      <div className="flex flex-col gap-2">
        {chapterPages.map((pg, i) => {
          const done          = completedSlugs.has(pg.slug);
          const isBookmarked  = bookmarkedSlugs.has(pg.slug);
          const progressRecord = recordsBySlug.get(pg.slug);
          const quizScore      = progressRecord?.quiz_score;
          const hasRealQuiz    = pg.content_types?.includes('inline_quiz');
          const contentIcons   = (pg.content_types ?? []).map(t => CONTENT_ICONS[t]).filter(Boolean);

          return (
            <Link
              key={pg.slug}
              href={`${basePath}/${book.slug}/${pg.slug}`}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                transition-all group ${
                done
                  ? 'border-emerald-500/20 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                  : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
              }`}
            >
              <div className="shrink-0 w-5 flex items-center justify-center">
                {done ? (
                  <CheckCircle2 size={17} className="text-emerald-400" />
                ) : (
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center
                    text-[10px] font-medium transition-colors ${
                    loading ? 'border-white/10 text-white/20' : 'border-white/20 text-white/35'
                  }`}>
                    {i + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className={`text-sm leading-snug transition-colors block ${
                  done ? 'text-white/50' : 'text-white/80 group-hover:text-white'
                }`}>
                  {pg.title}
                </span>
                {contentIcons.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    {contentIcons.map((ci, idx) => {
                      const Icon = ci!.icon;
                      return (
                        <span key={idx} className={`flex items-center gap-0.5 text-[10px] ${ci!.color} opacity-60`}>
                          <Icon size={10} />
                          <span className="hidden sm:inline">{ci!.label}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {done && hasRealQuiz && quizScore != null && quizScore < 100 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                  quizScore >= 80 ? 'bg-emerald-500/15 text-emerald-400'
                  : quizScore >= 60 ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-red-500/15 text-red-400'
                }`}>
                  {quizScore}%
                </span>
              )}

              <button
                onClick={e => handleBookmark(e, pg)}
                className={`shrink-0 p-1 rounded-md transition-colors ${
                  isBookmarked
                    ? 'text-amber-400 hover:text-amber-300'
                    : 'text-white/10 hover:text-white/30 opacity-0 group-hover:opacity-100'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
              >
                <Bookmark size={13} className={isBookmarked ? 'fill-amber-400' : ''} />
              </button>

              {pg.reading_time_min && (
                <span className="text-xs text-white/20 shrink-0 tabular-nums">
                  {pg.reading_time_min} min
                </span>
              )}

              <ChevronRight size={14} className={`shrink-0 transition-colors ${
                done ? 'text-emerald-500/30' : 'text-white/15 group-hover:text-white/40'
              }`} />
            </Link>
          );
        })}

        {chapterPages.length === 0 && (
          <p className="text-sm text-white/20 px-4 py-3">No published pages yet.</p>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── WelcomePanel — right panel when nothing is selected                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function WelcomePanel({ grade, books }: { grade: number; books: GradeBook[] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
        flex items-center justify-center mb-4">
        <BookOpen size={24} className="text-black" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Class {grade} Live Books</h2>
      <p className="text-sm text-white/35 max-w-xs leading-relaxed">
        Select a book from the sidebar, then pick a chapter to start reading.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {books.map(b => {
          const theme = getTheme(b.subject);
          const Icon  = theme.icon;
          return (
            <div key={b.slug} className={`flex items-center gap-2 px-3 py-1.5 rounded-full
              border text-xs font-medium ${theme.border} ${theme.bg} ${theme.accent}`}>
              <Icon size={12} />
              {b.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── MobileBookCards — full-width tappable book + chapter cards (mobile)   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function MobileBookCards({
  books, pagesForBook, onSelectChapter,
}: {
  books: GradeBook[];
  pagesForBook: Map<string, GradePage[]>;
  onSelectChapter: (bookSlug: string, chapterNum: number) => void;
}) {
  const [expandedBook, setExpandedBook] = useState<string | null>(
    books.length === 1 ? books[0].slug : null,
  );

  return (
    <div className="flex flex-col gap-3">
      {books.map(book => {
        const theme     = getTheme(book.subject);
        const Icon      = theme.icon;
        const bookPages = pagesForBook.get(book._id) ?? [];
        const isOpen    = expandedBook === book.slug;

        return (
          <div
            key={book.slug}
            className={`rounded-2xl border overflow-hidden transition-colors ${
              isOpen ? `${theme.border} ${theme.bg}` : 'border-white/8'
            }`}
          >
            {/* Book header — tap to expand */}
            <button
              onClick={() => setExpandedBook(isOpen ? null : book.slug)}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg}`}>
                <Icon size={22} className={theme.accent} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${theme.accent}`}>
                  {book.subject}
                </p>
                <p className="text-base font-bold text-white leading-tight">{book.title}</p>
                <p className="text-xs text-white/30 mt-0.5">
                  {book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'} · {bookPages.length} pages
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-white/30 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Chapter list — shown when expanded */}
            {isOpen && (
              <div className="border-t border-white/8 flex flex-col">
                {book.chapters.map(ch => {
                  const chPages = bookPages.filter(p => p.chapter_number === ch.number);
                  return (
                    <button
                      key={ch.number}
                      onClick={() => onSelectChapter(book.slug, ch.number)}
                      className="flex items-center gap-3 px-5 py-3.5 text-left
                        hover:bg-white/[0.04] border-b border-white/5 last:border-0 transition-colors"
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${theme.accent}`}>
                        Ch {ch.number}
                      </span>
                      <span className="flex-1 text-sm text-white/70">{ch.title}</span>
                      <span className="text-xs text-white/25 shrink-0">{chPages.length} pages</span>
                      <ChevronRight size={14} className="text-white/20 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Main Component                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface Selection {
  bookSlug: string;
  chapterNum: number;
}

export default function GradeLandingPage({ grade, books, pages, basePath }: Props) {
  const [selection,     setSelection]     = useState<Selection | null>(null);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [searchQuery,   setSearchQuery]   = useState('');

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  const pagesForBook = useMemo(() => {
    const map = new Map<string, GradePage[]>();
    for (const b of books) map.set(b._id, pages.filter(p => p.book_id === b._id));
    return map;
  }, [books, pages]);

  // First page across all books (for the header Start button)
  const startHref = useMemo(() => {
    for (const b of books) {
      const sorted = (pagesForBook.get(b._id) ?? [])
        .slice()
        .sort((a, b2) => a.chapter_number - b2.chapter_number || a.page_number - b2.page_number);
      if (sorted.length) return `${basePath}/${b.slug}/${sorted[0].slug}`;
    }
    return null;
  }, [books, pagesForBook]);

  const toggleBook = useCallback((slug: string) => {
    setExpandedBooks(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  const selectChapter = useCallback((bookSlug: string, chapterNum: number) => {
    setSelection({ bookSlug, chapterNum });
    setExpandedBooks(prev => new Set([...prev, bookSlug]));
  }, []);

  /* ── Search ──────────────────────────────────────────────────────────── */

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: (GradePage & { bookSlug: string; chapterTitle: string })[] = [];
    for (const book of books) {
      for (const ch of book.chapters) {
        const chPages = pages.filter(p => p.book_id === book._id && p.chapter_number === ch.number);
        for (const pg of chPages) {
          if (pg.title.toLowerCase().includes(q) || ch.title.toLowerCase().includes(q)) {
            results.push({ ...pg, bookSlug: book.slug, chapterTitle: ch.title });
          }
        }
      }
    }
    return results;
  }, [searchQuery, books, pages]);

  /* ── Derived state ───────────────────────────────────────────────────── */

  const selectedBook    = selection ? books.find(b => b.slug === selection.bookSlug) : null;
  const selectedChapter = selectedBook
    ? selectedBook.chapters.find(c => c.number === selection!.chapterNum) : null;
  const selectedChapterIdx = selectedBook
    ? selectedBook.chapters.findIndex(c => c.number === selection!.chapterNum) : 0;
  const selectedChapterPages = selectedBook && selectedChapter
    ? (pagesForBook.get(selectedBook._id) ?? []).filter(p => p.chapter_number === selectedChapter.number)
    : [];

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-[72px]">

      {/* ── Top bar — matches BookTableOfContents header style ────────── */}
      <header className="border-b border-white/5 px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500
              flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-black" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-orange-400 font-semibold uppercase tracking-wider">
                Live Books · Class {grade}
              </p>
              <h1 className="text-base md:text-lg font-bold text-white leading-tight truncate">
                Class {grade}
              </h1>
            </div>
          </div>

          {startHref && (
            <Link
              href={startHref}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
                hover:opacity-90 transition-opacity shrink-0"
            >
              <Play size={13} className="fill-black" />
              <span className="hidden sm:inline">Start Learning</span>
              <span className="sm:hidden">Start</span>
            </Link>
          )}
        </div>
      </header>

      {/* ── Stats strip + Continue reading (hidden for fresh users) ─── */}
      <ProgressBand books={books} pages={pages} basePath={basePath} />

      {/* ── Search bar ────────────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topics across all books..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-white/[0.03] border border-white/8 rounded-lg
                text-white placeholder:text-white/25 focus:outline-none focus:border-white/20
                transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="mt-1 mb-2 border border-white/8 rounded-xl bg-[#0B0F15] overflow-hidden
              max-h-64 overflow-y-auto">
              {searchResults.map(pg => (
                <Link
                  key={`${pg.bookSlug}-${pg.slug}`}
                  href={`${basePath}/${pg.bookSlug}/${pg.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors
                    border-b border-white/5 last:border-0"
                >
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{pg.title}</p>
                    <p className="text-[10px] text-white/25">{pg.chapterTitle}</p>
                  </div>
                  <ChevronRight size={12} className="text-white/15 shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {searchResults && searchResults.length === 0 && (
            <p className="text-xs text-white/25 py-2 px-1">
              No topics found for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Two-pane body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-6xl w-full mx-auto overflow-hidden">

        {/* ── Left: Book & chapter sidebar (desktop only) ────────────── */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-white/5
          sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-4 flex-1">
            <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-3 px-2">
              Books
            </p>
            <nav className="flex flex-col gap-1">
              {books.map(book => (
                <BookSidebarItem
                  key={book.slug}
                  book={book}
                  bookPages={pagesForBook.get(book._id) ?? []}
                  isExpanded={expandedBooks.has(book.slug)}
                  selection={selection}
                  onToggle={() => toggleBook(book.slug)}
                  onSelectChapter={selectChapter}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Right: Content ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">

          {/* Mobile: no selection → show prominent book cards */}
          {!selection && (
            <div className="md:hidden">
              <MobileBookCards
                books={books}
                pagesForBook={pagesForBook}
                onSelectChapter={selectChapter}
              />
            </div>
          )}

          {/* Mobile: chapter selected → back button */}
          {selection && (
            <button
              onClick={() => setSelection(null)}
              className="md:hidden flex items-center gap-1.5 text-sm text-white/45
                hover:text-white/80 transition-colors mb-5"
            >
              <ChevronRight size={14} className="rotate-180 shrink-0" />
              All Books
            </button>
          )}

          {/* Chapter content (both desktop + mobile when selected) */}
          {selectedBook && selectedChapter ? (
            <ChapterPageList
              book={selectedBook}
              chapter={selectedChapter}
              chapterIdx={selectedChapterIdx}
              chapterPages={selectedChapterPages}
              basePath={basePath}
            />
          ) : (
            /* Desktop welcome panel — hidden on mobile (mobile shows book cards above) */
            <div className="hidden md:block">
              <WelcomePanel grade={grade} books={books} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
