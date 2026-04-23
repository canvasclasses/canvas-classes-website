'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ChevronDown, Play, CheckCircle2, Search, PlayCircle,
  FlaskConical, Video, Brain, ClipboardCheck, Gamepad2, Clock,
  ArrowRight, X, Sparkles, Bookmark, Languages, Zap,
} from 'lucide-react';
import { useBookProgress, BookProgressRecord } from '@/hooks/useBookProgress';
import { useBookBookmarks } from '@/hooks/useBookBookmarks';
import { BlockType } from '@/types/books';
import {
  type SubjectTheme, getTheme, getDecor, LiveBooksLogo,
} from './bookDesign';

/* ─── Serialisable types ──────────────────────────────────────────────────── */

export interface GradePage {
  book_id: string;
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  reading_time_min?: number | null;
  content_types?: BlockType[] | null;
  video_title?: string | null;
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
/* ─── ProgressBand                                                          */
/* Aggregates progress across up to 4 books; renders stats strip +          */
/* "Continue reading" card — visually upgraded to a gradient hero strip.    */
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
  const totalPages = pages.length;

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

    const last = [...allRecords].sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
    )[0];

    const book = books.find(b => b.slug === last.bSlug);
    if (!book) return null;

    const bookPages = pages
      .filter(p => p.book_id === book._id)
      .sort((a, b) => a.chapter_number - b.chapter_number || a.page_number - b.page_number);

    const lastIdx = bookPages.findIndex(p => p.slug === last.page_slug);

    for (let i = Math.max(0, lastIdx + 1); i < bookPages.length; i++) {
      if (!allCompleted.has(bookPages[i].slug)) {
        return { page: bookPages[i], book };
      }
    }

    for (const b2 of books) {
      if (b2.slug === book.slug) continue;
      const b2Pages = pages
        .filter(p => p.book_id === b2._id)
        .sort((a, b) => a.chapter_number - b.chapter_number || a.page_number - b.page_number);
      const first = b2Pages.find(p => !allCompleted.has(p.slug));
      if (first) return { page: first, book: b2 };
    }
    return null;
  }, [prog0.records, prog1.records, prog2.records, prog3.records, books, pages, allCompleted]);

  if (totalCompleted === 0) return null;

  const overallPct = totalPages > 0 ? Math.round((totalCompleted / totalPages) * 100) : 0;

  return (
    <div className="border-b border-white/[0.06] px-4 md:px-8 shrink-0">
      <div className="max-w-6xl mx-auto py-5 flex flex-col md:flex-row gap-4 md:items-stretch">

        {/* Stats block */}
        <div className="flex items-center gap-5 md:gap-7 md:pr-7 md:border-r md:border-white/[0.06]">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Completed
            </span>
            <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
              {totalCompleted}
              <span className="text-zinc-600 font-bold text-lg">/{totalPages}</span>
            </span>
            <span className="text-xs text-zinc-400 tabular-nums">{overallPct}% done</span>
          </div>

          {totalRemainingMin > 0 && (
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                Remaining
              </span>
              <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
                {totalRemainingMin}
                <span className="text-zinc-600 font-bold text-lg"> min</span>
              </span>
              <span className="text-xs text-zinc-400">of reading left</span>
            </div>
          )}
        </div>

        {/* Continue reading card */}
        {continueReading && (() => {
          const theme = getTheme(continueReading.book.subject);
          const Icon = theme.icon;
          return (
            <Link
              href={`${basePath}/${continueReading.book.slug}/${continueReading.page.slug}`}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08]
                bg-gradient-to-br ${theme.gradient} hover:border-white/[0.18] transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={theme.accent} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] uppercase tracking-wider font-bold ${theme.accent}`}>
                  Continue reading
                </p>
                <p className="text-sm md:text-base text-white font-semibold truncate">
                  {continueReading.page.title}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {continueReading.book.title}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${theme.bg} flex items-center justify-center shrink-0
                group-hover:scale-110 transition-transform`}>
                <ArrowRight size={16} className={theme.accent} />
              </div>
            </Link>
          );
        })()}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── PageRow — a single page inside an expanded chapter tile              */
/* ═══════════════════════════════════════════════════════════════════════════ */

function PageRow({
  page, index, done, loading, quizScore, hasQuiz, isBookmarked,
  basePath, bookSlug, onBookmark,
}: {
  page: GradePage;
  index: number;
  done: boolean;
  loading: boolean;
  quizScore?: number;
  hasQuiz: boolean;
  isBookmarked: boolean;
  basePath: string;
  bookSlug: string;
  onBookmark: (e: React.MouseEvent) => void;
}) {
  const contentIcons = (page.content_types ?? []).map(t => CONTENT_ICONS[t]).filter(Boolean);

  return (
    <Link
      href={`${basePath}/${bookSlug}/${page.slug}`}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
        done ? 'hover:bg-emerald-500/[0.06]' : 'hover:bg-white/[0.04]'
      }`}
    >
      <div className="shrink-0 w-5 flex items-center justify-center">
        {done ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center
            text-[10px] font-semibold transition-colors ${
            loading ? 'border-white/10 text-zinc-600' : 'border-white/15 text-zinc-400'
          }`}>
            {index + 1}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className={`text-sm leading-snug transition-colors block ${
          done ? 'text-zinc-400' : 'text-white/90 group-hover:text-white'
        }`}>
          {page.title}
        </span>
        {page.video_title && (
          <span className="flex items-center gap-1 mt-1">
            <PlayCircle size={11} className="text-rose-400 shrink-0" />
            <span className="text-[11px] text-rose-400/80 truncate">{page.video_title}</span>
          </span>
        )}
        {contentIcons.filter(ci => ci!.label !== 'Video').length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            {contentIcons.filter(ci => ci!.label !== 'Video').map((ci, idx) => {
              const Icon = ci!.icon;
              return (
                <span key={idx} className={`flex items-center gap-0.5 text-[10px] ${ci!.color} opacity-70`}>
                  <Icon size={10} />
                  <span className="hidden sm:inline">{ci!.label}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {done && hasQuiz && quizScore != null && quizScore < 100 && (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
          quizScore >= 80 ? 'bg-emerald-500/15 text-emerald-400'
          : quizScore >= 60 ? 'bg-amber-500/15 text-amber-400'
          : 'bg-red-500/15 text-red-400'
        }`}>
          {quizScore}%
        </span>
      )}

      <button
        onClick={onBookmark}
        className={`shrink-0 p-1 rounded-md transition-colors ${
          isBookmarked
            ? 'text-amber-400 hover:text-amber-300'
            : 'text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100'
        }`}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
      >
        <Bookmark size={13} className={isBookmarked ? 'fill-amber-400' : ''} />
      </button>

      <ChevronRight size={14} className={`shrink-0 transition-colors ${
        done ? 'text-emerald-500/40' : `text-zinc-600 group-hover:text-white`
      }`} />
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── ChapterRow — flat row inside the book card. No own border/card.       */
/* Dividers separate rows; expanded state shows an inline flat page list.    */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ChapterRow({
  book, chapter, chapterPages, isOpen, onToggle, basePath, theme,
  records, completedSlugs, loading, bookmarkedSlugs, toggleBookmark,
}: {
  book: GradeBook;
  chapter: GradeChapter;
  chapterPages: GradePage[];
  isOpen: boolean;
  onToggle: () => void;
  basePath: string;
  theme: SubjectTheme;
  records: BookProgressRecord[];
  completedSlugs: Set<string>;
  loading: boolean;
  bookmarkedSlugs: Set<string>;
  toggleBookmark: (slug: string, title: string, chapterNum: number) => void;
}) {
  const recordsBySlug = useMemo(() => {
    const map = new Map<string, BookProgressRecord>();
    for (const r of records) map.set(r.page_slug, r);
    return map;
  }, [records]);

  const total = chapterPages.length;
  const completed = chapterPages.filter(p => completedSlugs.has(p.slug)).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalMin = chapterPages.reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
  const remainingMin = chapterPages
    .filter(p => !completedSlugs.has(p.slug))
    .reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
  const isDone = pct === 100 && total > 0;

  return (
    <div
      className={`relative border-b border-white/[0.05] last:border-b-0 transition-colors
        ${isOpen ? 'bg-white/[0.015]' : ''}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 md:px-8 py-4 md:py-5 flex items-center gap-4 md:gap-5
          hover:bg-white/[0.02] transition-colors group disabled:cursor-default disabled:hover:bg-transparent"
        disabled={total === 0}
      >
        {/* Chapter number — text only, no box */}
        <div className="shrink-0 flex flex-col items-center justify-center min-w-[40px]">
          <span className={`text-[9px] uppercase tracking-[0.18em] font-bold leading-none mb-0.5 ${
            isDone ? 'text-emerald-400/70' : `${theme.accent} opacity-70`
          }`}>
            Ch
          </span>
          <span className={`text-2xl md:text-3xl font-black tabular-nums leading-none ${
            isDone ? 'text-emerald-400' : theme.accent
          }`}>
            {chapter.number}
          </span>
        </div>

        {/* Subtle vertical divider */}
        <div className="w-px self-stretch bg-white/[0.06] shrink-0" />

        {/* Title + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h4 className="text-base md:text-lg font-bold text-white leading-tight">
              {chapter.title}
            </h4>
            {isDone && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400
                bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                <CheckCircle2 size={10} />
                Complete
              </span>
            )}
          </div>

          {total > 0 ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[120px] max-w-[280px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
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
              <span className="text-xs text-zinc-400 tabular-nums font-medium">
                {completed}/{total}<span className="text-zinc-500"> pages</span>
              </span>
              {totalMin > 0 && (
                <span className="text-xs text-zinc-500 flex items-center gap-1 tabular-nums">
                  <Clock size={11} />
                  {isDone
                    ? `${totalMin} min`
                    : remainingMin > 0
                      ? `~${remainingMin} min left`
                      : `${totalMin} min`}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">Pages coming soon</p>
          )}
        </div>

        {total > 0 && (
          <ChevronDown
            size={18}
            className={`shrink-0 text-zinc-500 group-hover:text-zinc-200 transition-all duration-200
              ${isOpen ? 'rotate-180 text-zinc-200' : ''}`}
          />
        )}
      </button>

      {/* Expanded page list — flat rows, indented under the title column */}
      {isOpen && total > 0 && (
        <div className="px-5 md:px-8 pb-4 md:pb-5">
          <div className="pl-0 md:pl-[61px] flex flex-col">
            {chapterPages.map((pg, i) => {
              const done         = completedSlugs.has(pg.slug);
              const isBookmarked = bookmarkedSlugs.has(pg.slug);
              const progressRec  = recordsBySlug.get(pg.slug);
              const quizScore    = progressRec?.quiz_score;
              const hasRealQuiz  = pg.content_types?.includes('inline_quiz') ?? false;

              return (
                <PageRow
                  key={pg.slug}
                  page={pg}
                  index={i}
                  done={done}
                  loading={loading}
                  quizScore={quizScore}
                  hasQuiz={hasRealQuiz}
                  isBookmarked={isBookmarked}
                  basePath={basePath}
                  bookSlug={book.slug}
                  onBookmark={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBookmark(pg.slug, pg.title, pg.chapter_number);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── SubjectSection — one per book. Header + chapter tiles                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

function SubjectSection({
  book, bookPages, basePath, singleBook, openChapter, onToggleChapter, sectionRef,
}: {
  book: GradeBook;
  bookPages: GradePage[];
  basePath: string;
  singleBook: boolean;
  openChapter: { bookSlug: string; chapterNum: number } | null;
  onToggleChapter: (bookSlug: string, chapterNum: number) => void;
  sectionRef?: (el: HTMLElement | null) => void;
}) {
  const theme = getTheme(book.subject);
  const Icon = theme.icon;
  const { records, completedSlugs, loading } = useBookProgress(book.slug);
  const { bookmarkedSlugs, toggleBookmark } = useBookBookmarks(book.slug);

  const totalPages   = bookPages.length;
  const donePages    = bookPages.filter(p => completedSlugs.has(p.slug)).length;
  const totalMin     = bookPages.reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
  const remainingMin = bookPages
    .filter(p => !completedSlugs.has(p.slug))
    .reduce((s, p) => s + (p.reading_time_min ?? 0), 0);

  const doneChapters = book.chapters.filter(ch => {
    const chPgs = bookPages.filter(p => p.chapter_number === ch.number);
    return chPgs.length > 0 && chPgs.every(p => completedSlugs.has(p.slug));
  }).length;
  const pct = totalPages > 0 ? Math.round((donePages / totalPages) * 100) : 0;

  const decor = getDecor(book.subject);
  const decorScale = singleBook ? 1.25 : 1;

  return (
    <section
      id={`subject-${book.slug}`}
      ref={sectionRef}
      className={singleBook ? '' : 'scroll-mt-[140px]'}
      data-subject-section={book.slug}
    >
      {/* ── One glassmorphic book card — header + chapter rows ───────── */}
      <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden
        bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40">

        {/* Header region — the ONLY part tinted by the subject gradient + decor */}
        <div className="relative overflow-hidden">
          {/* Subject-tinted gradient wash */}
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
          {/* Glass sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent
            pointer-events-none" />
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
            from-transparent via-white/[0.18] to-transparent" />

          {/* Floating subject decor icons — scoped to the header only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {decor.map((d, i) => {
              const DecorI = d.Icon;
              return (
                <DecorI
                  key={i}
                  size={d.size * decorScale}
                  strokeWidth={1.3}
                  className={theme.accent}
                  style={{
                    position: 'absolute',
                    top: d.top,
                    left: d.left,
                    transform: `rotate(${d.rotate}deg)`,
                    opacity: d.opacity,
                    filter: 'blur(0.4px)',
                  }}
                />
              );
            })}
          </div>

          {singleBook ? (
            /* Single-book — spacious hero header */
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
              <div className="relative shrink-0">
                <div className={`absolute inset-0 rounded-2xl ${theme.bg} blur-2xl opacity-80`} />
                <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl ${theme.bg} border ${theme.border}
                  flex items-center justify-center backdrop-blur-sm`}>
                  <Icon size={34} className={theme.accent} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] uppercase tracking-[0.15em] font-bold ${theme.accent} mb-1`}>
                  {book.subject}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {book.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-300 tabular-nums">
                  <span>
                    <span className="font-bold text-white">{book.chapters.length}</span>
                    <span className="text-zinc-400"> chapters</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span>
                    <span className="font-bold text-white">{totalPages}</span>
                    <span className="text-zinc-400"> pages</span>
                  </span>
                  {totalMin > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span>
                        <span className="font-bold text-white">~{Math.round(totalMin / 60) || 1}h</span>
                        <span className="text-zinc-400"> reading</span>
                      </span>
                    </>
                  )}
                </div>
                {donePages > 0 && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 max-w-md h-2 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          pct === 100 ? 'bg-emerald-500' : `bg-gradient-to-r ${theme.bar}`
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-300 tabular-nums font-medium">
                      {doneChapters}/{book.chapters.length}
                      <span className="text-zinc-500"> chapters · </span>
                      {pct}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Multi-book — compact header with right-aligned progress */
            <div className="relative px-5 md:px-7 py-5 md:py-6 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className={`absolute inset-0 rounded-xl ${theme.bg} blur-xl opacity-90`} />
                <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl ${theme.bg} border ${theme.border}
                  flex items-center justify-center backdrop-blur-sm`}>
                  <Icon size={24} className={theme.accent} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${theme.accent}`}>
                  {book.subject}
                </p>
                <h2 className="text-lg md:text-xl font-bold text-white leading-tight truncate">
                  {book.title}
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5 tabular-nums">
                  {book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'}
                  {totalPages > 0 && ` · ${totalPages} pages`}
                  {totalMin > 0 && ` · ~${Math.max(1, Math.round(totalMin / 60))}h read`}
                </p>
              </div>
              {totalPages > 0 ? (
                <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs text-zinc-200 tabular-nums font-semibold">
                    {donePages}<span className="text-zinc-500">/{totalPages}</span>
                    {pct > 0 && <span className={`ml-1.5 ${theme.accent}`}>{pct}%</span>}
                  </span>
                  <div className="w-28 md:w-44 h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct === 100 ? 'bg-emerald-500' : `bg-gradient-to-r ${theme.bar}`
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500
                  bg-white/[0.06] border border-white/[0.08] px-2 py-1 rounded-full shrink-0 backdrop-blur-sm">
                  Coming soon
                </span>
              )}
            </div>
          )}
        </div>

        {/* Chapter rows — flat, divider-separated, inside the same card */}
        {book.chapters.length === 0 ? (
          <div className="border-t border-white/[0.06] px-5 py-8 text-center">
            <p className="text-sm text-zinc-400">No chapters published yet.</p>
          </div>
        ) : (
          <div className="relative border-t border-white/[0.08]">
            {book.chapters.map(ch => {
              const chPages = bookPages.filter(p => p.chapter_number === ch.number);
              const isOpen = openChapter?.bookSlug === book.slug && openChapter.chapterNum === ch.number;
              return (
                <ChapterRow
                  key={ch.number}
                  book={book}
                  chapter={ch}
                  chapterPages={chPages}
                  isOpen={isOpen}
                  onToggle={() => onToggleChapter(book.slug, ch.number)}
                  basePath={basePath}
                  theme={theme}
                  records={records}
                  completedSlugs={completedSlugs}
                  loading={loading}
                  bookmarkedSlugs={bookmarkedSlugs}
                  toggleBookmark={toggleBookmark}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── SubjectNav — sticky horizontal jump-tabs                              */
/* Hidden when there is only one book.                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */

function SubjectNav({
  books, activeSlug, onSelect,
}: {
  books: GradeBook[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="sticky top-[72px] z-30 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-md shrink-0">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
        {books.map(book => {
          const theme = getTheme(book.subject);
          const Icon = theme.icon;
          const isActive = activeSlug === book.slug;
          return (
            <button
              key={book.slug}
              onClick={() => onSelect(book.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                whitespace-nowrap border transition-all shrink-0 ${
                isActive
                  ? `${theme.bg} ${theme.border} ${theme.accent}`
                  : 'border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.18]'
              }`}
            >
              <Icon size={13} className={isActive ? theme.accent : 'text-zinc-500'} />
              <span className="capitalize">{book.subject}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Main Component                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function GradeLandingPage({ grade, books, pages, basePath }: Props) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [openChapter,  setOpenChapter]  = useState<{ bookSlug: string; chapterNum: number } | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(books[0]?.slug ?? null);

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const singleBook = books.length === 1;

  /* ── Derived data ─────────────────────────────────────────────────── */

  const pagesForBook = useMemo(() => {
    const map = new Map<string, GradePage[]>();
    for (const b of books) map.set(b._id, pages.filter(p => p.book_id === b._id));
    return map;
  }, [books, pages]);

  const startHref = useMemo(() => {
    for (const b of books) {
      const sorted = (pagesForBook.get(b._id) ?? [])
        .slice()
        .sort((a, b2) => a.chapter_number - b2.chapter_number || a.page_number - b2.page_number);
      if (sorted.length) return `${basePath}/${b.slug}/${sorted[0].slug}`;
    }
    return null;
  }, [books, pagesForBook, basePath]);

  const toggleChapter = useCallback((bookSlug: string, chapterNum: number) => {
    setOpenChapter(prev =>
      prev?.bookSlug === bookSlug && prev.chapterNum === chapterNum
        ? null
        : { bookSlug, chapterNum },
    );
  }, []);

  const jumpToSubject = useCallback((slug: string) => {
    const el = sectionRefs.current.get(slug);
    if (!el) return;
    // Offset accounts for top bar (72px) + sticky subject nav (~50px)
    const y = el.getBoundingClientRect().top + window.scrollY - 136;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveSubject(slug);
  }, []);

  /* ── Scroll-spy for sticky subject tabs ───────────────────────────── */

  useEffect(() => {
    if (singleBook || books.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = (visible[0].target as HTMLElement).dataset.subjectSection;
          if (slug) setActiveSubject(slug);
        }
      },
      { rootMargin: '-140px 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    );
    sectionRefs.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [singleBook, books]);

  /* ── Search ───────────────────────────────────────────────────────── */

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: (GradePage & { bookSlug: string; bookTitle: string; chapterTitle: string })[] = [];
    for (const book of books) {
      for (const ch of book.chapters) {
        const chPages = pages.filter(p => p.book_id === book._id && p.chapter_number === ch.number);
        for (const pg of chPages) {
          if (pg.title.toLowerCase().includes(q) || ch.title.toLowerCase().includes(q)) {
            results.push({ ...pg, bookSlug: book.slug, bookTitle: book.title, chapterTitle: ch.title });
          }
        }
      }
    }
    return results;
  }, [searchQuery, books, pages]);

  /* ── Render ───────────────────────────────────────────────────────── */

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col pt-[72px]">

      {/* ── Ambient background — fixed glows + faint dot grid ────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[18%] -left-[8%] w-[560px] h-[560px] rounded-full
          bg-orange-500/[0.04] blur-[130px]" />
        <div className="absolute top-[55%] -right-[10%] w-[500px] h-[500px] rounded-full
          bg-violet-500/[0.035] blur-[130px]" />
        <div className="absolute bottom-[5%] left-[30%] w-[420px] h-[420px] rounded-full
          bg-emerald-500/[0.025] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content wrapper — sits above the ambient layer */}
      <div className="relative z-10 flex-1 flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="relative border-b border-white/[0.06] shrink-0 overflow-hidden">
        {/* Decorative hero backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 w-[260px] h-[260px] md:w-[520px] md:h-[520px] rounded-full
            bg-orange-500/[0.07] md:bg-orange-500/[0.08] blur-[80px] md:blur-[100px]" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[420px] md:h-[420px] rounded-full
            bg-amber-500/[0.04] md:bg-amber-500/[0.05] blur-[70px] md:blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '28px 28px',
              maskImage: 'linear-gradient(to bottom, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-10 flex flex-col md:flex-row md:items-end gap-5 md:gap-6">
          <div className="flex-1 min-w-0">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
              bg-orange-500/10 border border-orange-500/20 mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">
                Live Books
              </span>
            </div>

            {/* Logo + title row — visually paired */}
            <div className="flex items-center gap-4 md:gap-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
                  blur-xl opacity-30 md:blur-2xl md:opacity-50" />
                <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-2xl
                  bg-gradient-to-br from-orange-500 to-amber-500
                  flex items-center justify-center shadow-lg shadow-orange-500/20
                  ring-1 ring-orange-300/30">
                  <LiveBooksLogo size={34} className="text-black md:hidden" />
                  <LiveBooksLogo size={46} className="text-black hidden md:block" />
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-[1.05] min-w-0">
                Class {grade}{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Library
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="mt-4 text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl">
              NCERT-aligned chapters as interactive live books — with simulations, worked examples,
              quizzes, and Hinglish mode. Free, forever.
            </p>

            {/* Feature chips */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                { icon: Gamepad2,       label: 'Simulations',   color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
                { icon: ClipboardCheck, label: 'Quizzes',       color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
                { icon: Languages,      label: 'Hinglish mode', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
                { icon: Zap,            label: 'Adaptive',      color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
              ].map(chip => {
                const Icon = chip.icon;
                return (
                  <span
                    key={chip.label}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                      text-[10px] font-semibold border ${chip.bg} ${chip.border} ${chip.color}`}
                  >
                    <Icon size={10} />
                    {chip.label}
                  </span>
                );
              })}
            </div>
          </div>

          {startHref && (
            <Link
              href={startHref}
              className="group relative flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl
                bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
                hover:scale-[1.03] transition-transform shrink-0 shadow-md shadow-orange-500/15 md:shadow-lg md:shadow-orange-500/25
                ring-1 ring-orange-300/30 self-stretch md:self-end"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400
                opacity-0 group-hover:opacity-100 blur-md transition-opacity -z-10" />
              <Play size={14} className="fill-black" />
              <span>Start Learning</span>
            </Link>
          )}
        </div>
      </header>

      {/* ── Stats + Continue reading (hidden for fresh users) ───────── */}
      <ProgressBand books={books} pages={pages} basePath={basePath} />

      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06] px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search topics across ${singleBook ? (books[0]?.title ?? 'this book') : 'all books'}...`}
              className="w-full pl-9 pr-8 py-2 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg
                text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/25
                focus:bg-white/[0.05] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="mt-2 border border-white/[0.08] rounded-xl bg-[#0B0F15] overflow-hidden
              max-h-72 overflow-y-auto">
              {searchResults.map(pg => {
                const theme = getTheme(books.find(b => b.slug === pg.bookSlug)?.subject ?? '');
                return (
                  <Link
                    key={`${pg.bookSlug}-${pg.slug}`}
                    href={`${basePath}/${pg.bookSlug}/${pg.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors
                      border-b border-white/[0.05] last:border-0"
                  >
                    <div className={`w-1 h-8 rounded-full ${theme.bg}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 truncate">{pg.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {pg.bookTitle} · {pg.chapterTitle}
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-zinc-600 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {searchResults && searchResults.length === 0 && (
            <p className="text-xs text-zinc-500 py-2 px-1">
              No topics found for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Sticky subject nav (hidden when only 1 book) ────────────── */}
      {!singleBook && (
        <SubjectNav
          books={books}
          activeSlug={activeSubject}
          onSelect={jumpToSubject}
        />
      )}

      {/* ── Main content: stacked subject sections ──────────────────── */}
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">
          {books.map(book => (
            <SubjectSection
              key={book.slug}
              book={book}
              bookPages={pagesForBook.get(book._id) ?? []}
              basePath={basePath}
              singleBook={singleBook}
              openChapter={openChapter}
              onToggleChapter={toggleChapter}
              sectionRef={(el) => {
                if (el) sectionRefs.current.set(book.slug, el);
                else sectionRefs.current.delete(book.slug);
              }}
            />
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}
