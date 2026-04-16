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

/* ─── Chapter accent colors (used for pages within a chapter) ─────────────── */

const CHAPTER_COLORS = [
  { accent: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', bar: 'from-sky-500 to-cyan-400' },
  { accent: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', bar: 'from-violet-500 to-purple-400' },
  { accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'from-emerald-500 to-teal-400' },
  { accent: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'from-orange-500 to-amber-400' },
  { accent: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'from-rose-500 to-pink-400' },
  { accent: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'from-amber-500 to-yellow-400' },
];

function getChapterColor(index: number) {
  return CHAPTER_COLORS[index % CHAPTER_COLORS.length];
}

/* ─── Content type icons ──────────────────────────────────────────────────── */

const CONTENT_ICONS: Partial<Record<BlockType, { icon: typeof FlaskConical; label: string; color: string }>> = {
  inline_quiz:       { icon: ClipboardCheck, label: 'Quiz', color: 'text-amber-400' },
  simulation:        { icon: Gamepad2, label: 'Simulation', color: 'text-sky-400' },
  video:             { icon: Video, label: 'Video', color: 'text-rose-400' },
  molecule_3d:       { icon: FlaskConical, label: '3D Molecule', color: 'text-violet-400' },
  reasoning_prompt:  { icon: Brain, label: 'Reasoning', color: 'text-emerald-400' },
  worked_example:    { icon: Sparkles, label: 'Worked Example', color: 'text-orange-400' },
  classify_exercise: { icon: ClipboardCheck, label: 'Exercise', color: 'text-teal-400' },
};

/* ─── Feature cards for welcome state ─────────────────────────────────────── */

const FEATURES = [
  {
    icon: Gamepad2,
    title: 'Interactive Simulations',
    desc: 'Visualise concepts with hands-on simulations you can control.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/8',
  },
  {
    icon: ClipboardCheck,
    title: 'Inline Quizzes',
    desc: 'Test yourself as you read — instant feedback on every page.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
  },
  {
    icon: Video,
    title: 'Video Explanations',
    desc: 'Watch Paaras Sir break down tricky topics step by step.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/8',
  },
  {
    icon: Sparkles,
    title: 'Worked Examples',
    desc: 'See problems solved line by line with clear reasoning.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/8',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── ChapterPageList — right panel when a chapter is selected ──────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ChapterPageList({
  book,
  chapter,
  chapterIdx,
  chapterPages,
}: {
  book: GradeBook;
  chapter: GradeChapter;
  chapterIdx: number;
  chapterPages: GradePage[];
}) {
  const { records, completedSlugs, loading } = useBookProgress(book.slug);
  const { bookmarkedSlugs, toggleBookmark } = useBookBookmarks(book.slug);

  const recordsBySlug = useMemo(() => {
    const map = new Map<string, BookProgressRecord>();
    for (const r of records) map.set(r.page_slug, r);
    return map;
  }, [records]);

  const progress = useMemo(() => {
    const total = chapterPages.length;
    if (total === 0) return { completed: 0, total: 0, pct: 0, remainingMin: 0 };
    const completed = chapterPages.filter((p) => completedSlugs.has(p.slug)).length;
    const remainingMin = chapterPages
      .filter((p) => !completedSlugs.has(p.slug))
      .reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
    return { completed, total, pct: Math.round((completed / total) * 100), remainingMin };
  }, [chapterPages, completedSlugs]);

  const color = getChapterColor(chapterIdx);
  const theme = getTheme(book.subject);

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
          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accent}`}>
            {book.title}
          </span>
          <ChevronRight size={10} className="text-white/20" />
          <span className={`text-xs font-bold uppercase tracking-wider ${color.accent}`}>
            Chapter {chapter.number}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{chapter.title}</h2>

        {!loading && progress.total > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex-1 max-w-xs h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  progress.pct === 100 ? 'bg-emerald-500' : `bg-gradient-to-r ${color.bar}`
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
          const done = completedSlugs.has(pg.slug);
          const isBookmarked = bookmarkedSlugs.has(pg.slug);
          const progressRecord = recordsBySlug.get(pg.slug);
          const quizScore = progressRecord?.quiz_score;
          const hasRealQuiz = pg.content_types?.includes('inline_quiz');
          const contentIcons = (pg.content_types ?? [])
            .map((t) => CONTENT_ICONS[t])
            .filter(Boolean);

          return (
            <Link
              key={pg.slug}
              href={`/books/${book.slug}/${pg.slug}`}
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
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center
                      text-[10px] font-medium transition-colors ${
                      loading
                        ? 'border-white/10 text-white/20'
                        : 'border-white/20 text-white/35'
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm leading-snug transition-colors block ${
                    done ? 'text-white/50' : 'text-white/80 group-hover:text-white'
                  }`}
                >
                  {pg.title}
                </span>
                {contentIcons.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    {contentIcons.map((ci, idx) => {
                      const Icon = ci!.icon;
                      return (
                        <span
                          key={idx}
                          className={`flex items-center gap-0.5 text-[10px] ${ci!.color} opacity-60`}
                          title={ci!.label}
                        >
                          <Icon size={10} />
                          <span className="hidden sm:inline">{ci!.label}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {done && hasRealQuiz && quizScore != null && quizScore < 100 && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                    quizScore >= 80
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : quizScore >= 60
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {quizScore}%
                </span>
              )}

              <button
                onClick={(e) => handleBookmark(e, pg)}
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

              <ChevronRight
                size={14}
                className={`shrink-0 transition-colors ${
                  done ? 'text-emerald-500/30' : 'text-white/15 group-hover:text-white/40'
                }`}
              />
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
/* ─── WelcomePanel — default right panel ────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

function WelcomePanel({ grade, books, pages }: { grade: number; books: GradeBook[]; pages: GradePage[] }) {
  const totalPages = pages.length;
  const totalChapters = books.reduce((s, b) => s + b.chapters.length, 0);
  const totalMin = pages.reduce((s, p) => s + (p.reading_time_min ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Class {grade} Live Books
        </h2>
        <p className="text-sm text-white/40 max-w-lg leading-relaxed">
          Interactive, NCERT-aligned lessons with simulations, quizzes, and worked examples.
          Select a book and chapter from the sidebar to start learning.
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.02]">
          <BookOpen size={18} className="text-sky-400" />
          <div>
            <p className="text-lg font-bold text-white tabular-nums">{books.length}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Books</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.02]">
          <ClipboardCheck size={18} className="text-violet-400" />
          <div>
            <p className="text-lg font-bold text-white tabular-nums">{totalChapters}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Chapters</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.02]">
          <ArrowRight size={18} className="text-emerald-400" />
          <div>
            <p className="text-lg font-bold text-white tabular-nums">{totalPages}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Pages</p>
          </div>
        </div>
        {totalMin > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.02]">
            <Clock size={18} className="text-amber-400" />
            <div>
              <p className="text-lg font-bold text-white tabular-nums">~{totalMin} min</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Content</p>
            </div>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div>
        <h3 className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-3">
          What makes Live Books different
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`flex items-start gap-3 px-4 py-4 rounded-xl border border-white/5 ${f.bg}`}
              >
                <div className="mt-0.5 shrink-0">
                  <Icon size={18} className={f.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{f.title}</p>
                  <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book overview cards */}
      <div>
        <h3 className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-3">
          Available Books
        </h3>
        <div className="flex flex-col gap-2">
          {books.map((book) => {
            const theme = getTheme(book.subject);
            const Icon = theme.icon;
            const bookPages = pages.filter((p) => p.book_id === book._id);
            const totalBookMin = bookPages.reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
            return (
              <div
                key={book.slug}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${theme.border} ${theme.bg}`}
              >
                <Icon size={18} className={theme.accent} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/80 truncate">{book.title}</p>
                  <p className="text-[10px] text-white/30">
                    {book.chapters.length} chapter{book.chapters.length !== 1 ? 's' : ''}
                    {' · '}
                    {bookPages.length} page{bookPages.length !== 1 ? 's' : ''}
                    {totalBookMin > 0 && ` · ~${totalBookMin} min`}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${theme.badge}`}>
                  {book.subject}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Main Component ────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface Selection {
  bookSlug: string;
  chapterNum: number;
}

export default function GradeLandingPage({ grade, books, pages }: Props) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Helpers ───────────────────────────────────────────────────────────── */

  const pagesForBook = useMemo(() => {
    const map = new Map<string, GradePage[]>();
    for (const b of books) {
      map.set(b._id, pages.filter((p) => p.book_id === b._id));
    }
    return map;
  }, [books, pages]);

  const toggleBook = useCallback((slug: string) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const selectChapter = useCallback((bookSlug: string, chapterNum: number) => {
    setSelection({ bookSlug, chapterNum });
    setExpandedBooks((prev) => new Set([...prev, bookSlug]));
  }, []);

  /* ── Search ────────────────────────────────────────────────────────────── */

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: (GradePage & { bookSlug: string; chapterTitle: string })[] = [];
    for (const book of books) {
      for (const ch of book.chapters) {
        const chPages = pages.filter(
          (p) => p.book_id === book._id && p.chapter_number === ch.number,
        );
        for (const pg of chPages) {
          if (pg.title.toLowerCase().includes(q) || ch.title.toLowerCase().includes(q)) {
            results.push({ ...pg, bookSlug: book.slug, chapterTitle: ch.title });
          }
        }
      }
    }
    return results;
  }, [searchQuery, books, pages]);

  /* ── Derived state ─────────────────────────────────────────────────────── */

  const selectedBook = selection ? books.find((b) => b.slug === selection.bookSlug) : null;
  const selectedChapter = selectedBook
    ? selectedBook.chapters.find((c) => c.number === selection!.chapterNum)
    : null;
  const selectedChapterIdx = selectedBook
    ? selectedBook.chapters.findIndex((c) => c.number === selection!.chapterNum)
    : 0;
  const selectedChapterPages = selectedBook && selectedChapter
    ? (pagesForBook.get(selectedBook._id) ?? []).filter(
        (p) => p.chapter_number === selectedChapter.number,
      )
    : [];

  /* ── Total page count across all books ─────────────────────────────────── */

  const totalPages = pages.length;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500
              flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">
                Live Books · Class {grade}
              </p>
              <h1 className="text-base md:text-lg font-bold text-white leading-tight truncate">
                {books.length} Book{books.length !== 1 ? 's' : ''} · {totalPages} Pages
              </h1>
            </div>
          </div>

          {selectedBook && selectedChapter && (
            <Link
              href={`/books/${selectedBook.slug}/${selectedChapterPages[0]?.slug ?? ''}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-sm
                hover:opacity-90 transition-opacity shrink-0"
            >
              <Play size={13} className="fill-white" />
              <span className="hidden sm:inline">Start Chapter</span>
              <span className="sm:hidden">Start</span>
            </Link>
          )}
        </div>
      </header>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {searchResults.map((pg) => (
                <Link
                  key={`${pg.bookSlug}-${pg.slug}`}
                  href={`/books/${pg.bookSlug}/${pg.slug}`}
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

      {/* ── Mobile book/chapter selector ─────────────────────────────────── */}
      <div className="md:hidden border-b border-white/5 overflow-x-auto shrink-0">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {books.map((book) => {
            const theme = getTheme(book.subject);
            const isActive = selection?.bookSlug === book.slug;
            return (
              <button
                key={book.slug}
                onClick={() => {
                  if (isActive) {
                    setSelection(null);
                  } else if (book.chapters.length > 0) {
                    selectChapter(book.slug, book.chapters[0].number);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  whitespace-nowrap transition-all ${
                  isActive
                    ? `${theme.bg} ${theme.accent} border ${theme.border}`
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                {book.title.length > 25 ? book.title.slice(0, 25) + '…' : book.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Two-pane body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-6xl w-full mx-auto overflow-hidden">

        {/* ── Left: Book & chapter sidebar (desktop) ─────────────────────── */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-white/5
          sticky top-0 h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 flex-1">
            <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-3 px-2">
              Books
            </p>

            <nav className="flex flex-col gap-1">
              {books.map((book) => {
                const theme = getTheme(book.subject);
                const Icon = theme.icon;
                const isExpanded = expandedBooks.has(book.slug);
                const isBookSelected = selection?.bookSlug === book.slug;
                const bookPageList = pagesForBook.get(book._id) ?? [];

                return (
                  <div key={book.slug}>
                    {/* Book row */}
                    <button
                      onClick={() => toggleBook(book.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group flex items-center gap-2.5 ${
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
                        <p
                          className={`text-[13px] leading-snug transition-colors truncate ${
                            isBookSelected
                              ? 'text-white font-medium'
                              : 'text-white/55 group-hover:text-white/80'
                          }`}
                        >
                          {book.title}
                        </p>
                        <p className="text-[10px] text-white/20 mt-0.5">
                          {book.chapters.length} ch · {bookPageList.length} pages
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={12} className="text-white/20 shrink-0" />
                      ) : (
                        <ChevronRight size={12} className="text-white/20 shrink-0" />
                      )}
                    </button>

                    {/* Chapters */}
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 mb-1 pl-3 border-l border-white/5">
                        {book.chapters.map((ch) => {
                          const isChSelected =
                            selection?.bookSlug === book.slug &&
                            selection?.chapterNum === ch.number;
                          const chPages = bookPageList.filter(
                            (p) => p.chapter_number === ch.number,
                          );
                          const totalMin = chPages.reduce(
                            (s, p) => s + (p.reading_time_min ?? 0),
                            0,
                          );

                          return (
                            <button
                              key={ch.number}
                              onClick={() => selectChapter(book.slug, ch.number)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all group ${
                                isChSelected
                                  ? 'bg-white/8 border border-white/12'
                                  : 'hover:bg-white/[0.03] border border-transparent'
                              }`}
                            >
                              <p
                                className={`text-xs leading-snug transition-colors ${
                                  isChSelected
                                    ? 'text-white font-medium'
                                    : 'text-white/45 group-hover:text-white/70'
                                }`}
                              >
                                Ch. {ch.number} | {ch.title}
                              </p>
                              <p className="text-[10px] text-white/15 mt-0.5">
                                {chPages.length} page{chPages.length !== 1 ? 's' : ''}
                                {totalMin > 0 && ` · ~${totalMin} min`}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ── Right: Content ──────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {selectedBook && selectedChapter ? (
            <ChapterPageList
              book={selectedBook}
              chapter={selectedChapter}
              chapterIdx={selectedChapterIdx}
              chapterPages={selectedChapterPages}
            />
          ) : (
            <WelcomePanel grade={grade} books={books} pages={pages} />
          )}
        </main>
      </div>
    </div>
  );
}
