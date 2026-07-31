'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ChevronDown, CheckCircle2, Search, PlayCircle, BookOpen,
  FlaskConical, Video, Brain, ClipboardCheck, Gamepad2, Clock,
  ArrowRight, X, Sparkles, Bookmark, Languages, Zap,
} from 'lucide-react';
import { useBookProgress, BookProgressRecord } from '@/features/books/hooks/useBookProgress';
import { useBookBookmarks } from '@/features/books/hooks/useBookBookmarks';
import { useBookTheme } from '@/features/books/hooks/useBookTheme';
import { BlockType } from '@canvas/data/types/books';
import {
  type SubjectTheme, getTheme, LiveBooksLogo,
} from './bookDesign';
import BookShelf from './BookShelf';

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
  /** Editorial one-liner already authored in the DB — real prose beats none. */
  description?: string | null;
  /** First image inside the chapter, used as the row thumbnail. */
  thumbnail?: string | null;
}

export interface GradeBook {
  _id: string;
  slug: string;
  /**
   * URL segment for this book under basePath, when it differs from `slug`.
   * Class 11/12 Chemistry lives at /class-11/chemistry but its DB slug is
   * `ncert-simplified`, so linking by slug would 404. Defaults to `slug`.
   */
  url_segment?: string;
  title: string;
  subject: string;
  grade: number;
  /** Cover artwork — an explicit book cover if set, else chapter 1's first image. */
  cover_image?: string | null;
  chapters: GradeChapter[];
}

interface Props {
  grade: number;
  books: GradeBook[];
  pages: GradePage[];
  /** Base URL prefix for page links, e.g. "/class-9". Page links become basePath/bookSlug/pageSlug */
  basePath: string;
}

/** URL segment for a book — `url_segment` when set, else the slug. */
const seg = (b: GradeBook) => b.url_segment ?? b.slug;

/* ─── Content type icons ──────────────────────────────────────────────────── */

/* These are content LABELS, not statuses, so they don't each get a hue — that
   seven-colour rainbow was the loudest thing on the old page. Everything is
   neutral except the hands-on formats, which lift to plum so a student can
   scan for "pages I can actually poke at". */
const NEUTRAL = 'text-white/45';
const HANDS_ON = 'text-[var(--plum-text)]';

const CONTENT_ICONS: Partial<Record<BlockType, { icon: typeof FlaskConical; label: string; color: string }>> = {
  inline_quiz:       { icon: ClipboardCheck, label: 'Quiz',           color: NEUTRAL  },
  simulation:        { icon: Gamepad2,       label: 'Simulation',     color: HANDS_ON },
  video:             { icon: Video,          label: 'Video',          color: NEUTRAL  },
  molecule_3d:       { icon: FlaskConical,   label: '3D Molecule',    color: HANDS_ON },
  reasoning_prompt:  { icon: Brain,          label: 'Reasoning',      color: HANDS_ON },
  worked_example:    { icon: Sparkles,       label: 'Worked Example', color: NEUTRAL  },
  classify_exercise: { icon: ClipboardCheck, label: 'Exercise',       color: HANDS_ON },
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
            <span className="text-[11px] uppercase tracking-wider text-white/55 font-semibold">
              Completed
            </span>
            <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
              {totalCompleted}
              <span className="text-white/45 font-bold text-lg">/{totalPages}</span>
            </span>
            <span className="text-xs text-white/60 tabular-nums">{overallPct}% done</span>
          </div>

          {totalRemainingMin > 0 && (
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-white/55 font-semibold">
                Remaining
              </span>
              <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
                {totalRemainingMin}
                <span className="text-white/45 font-bold text-lg"> min</span>
              </span>
              <span className="text-xs text-white/60">of reading left</span>
            </div>
          )}
        </div>

        {/* Continue reading card */}
        {continueReading && (() => {
          const theme = getTheme(continueReading.book.subject);
          const Icon = theme.icon;
          return (
            <Link
              href={`${basePath}/${seg(continueReading.book)}/${continueReading.page.slug}`}
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
                <p className="text-xs text-white/60 truncate">
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
        done ? 'hover:bg-[var(--plum-tint)]' : 'hover:bg-white/[0.04]'
      }`}
    >
      <div className="shrink-0 w-5 flex items-center justify-center">
        {done ? (
          <CheckCircle2 size={16} className="text-[var(--plum-text)]" />
        ) : (
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center
            text-[10px] font-semibold transition-colors ${
            loading ? 'border-white/10 text-white/40' : 'border-white/15 text-white/60'
          }`}>
            {index + 1}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className={`text-sm leading-snug transition-colors block ${
          done ? 'text-white/55' : 'text-white/85 group-hover:text-white'
        }`}>
          {page.title}
        </span>
        {page.video_title && (
          <span className="flex items-center gap-1 mt-1">
            <PlayCircle size={11} className="text-white/40 shrink-0" />
            <span className="text-[11px] text-white/45 truncate">{page.video_title}</span>
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
            ? 'text-[var(--gold)] hover:brightness-125'
            : 'text-white/35 hover:text-white/70 opacity-0 group-hover:opacity-100'
        }`}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
      >
        <Bookmark size={13} className={isBookmarked ? 'fill-[var(--gold)]' : ''} />
      </button>

      <ChevronRight size={14} className={`shrink-0 transition-colors ${
        done ? 'text-[var(--plum-text)]/50' : `text-white/35 group-hover:text-white`
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
        {/* Thumbnail — a real image from inside the chapter. This is the
            single biggest thing separating a list of titles from something
            that looks made by a person. Falls back to the number alone. */}
        <div className="shrink-0 relative w-[74px] h-[52px] md:w-[92px] md:h-[62px] rounded-lg
          overflow-hidden border border-white/[0.08] bg-white/[0.03]">
          {chapter.thumbnail ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={chapter.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-80
                  group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            </>
          ) : (
            /* Not every chapter has an in-book image yet. A bare box with only
               the darkening gradient below read as a broken/failed thumbnail
               rather than "none exists" — this glyph makes the empty state
               legible as a deliberate placeholder. */
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={16} className="text-white/15" strokeWidth={1.5} />
            </div>
          )}
          <span className={`absolute bottom-1 left-1.5 text-[11px] font-black tabular-nums leading-none
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${isDone ? 'text-[var(--gold)]' : theme.accent}`}>
            {chapter.number}
          </span>
        </div>

        {/* Title + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h4 className="text-base md:text-lg font-bold text-white leading-tight">
              {chapter.title}
            </h4>
            {isDone && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--gold)]
                bg-[var(--gold-tint)] border border-[rgba(199,154,74,0.30)] px-1.5 py-0.5 rounded-full">
                <CheckCircle2 size={10} />
                Complete
              </span>
            )}
          </div>

          {chapter.description && (
            <p className="text-[13px] text-white/45 leading-snug mb-2 line-clamp-2 max-w-2xl">
              {chapter.description}
            </p>
          )}

          {total > 0 ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[120px] max-w-[280px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                {loading ? (
                  <div className="h-full w-0 bg-white/5 animate-pulse rounded-full" />
                ) : (
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone ? 'bg-[var(--gold)]' : `bg-gradient-to-r ${theme.bar}`
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}
              </div>
              <span className="text-xs text-white/60 tabular-nums font-medium">
                {completed}/{total}<span className="text-white/45"> pages</span>
              </span>
              {totalMin > 0 && (
                <span className="text-xs text-white/55 flex items-center gap-1 tabular-nums">
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
            <p className="text-xs text-white/50 italic">Pages coming soon</p>
          )}
        </div>

        {total > 0 && (
          <ChevronDown
            size={18}
            className={`shrink-0 text-white/45 group-hover:text-white/80 transition-all duration-200
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
                  bookSlug={seg(book)}
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

          {/* The floating subject decor icons that used to drift here are gone.
              Low-opacity outline glyphs on a dark ground are the strongest
              "AI-generated page" tell, and they carried no information. The
              shelf's ambient light now does the subject-signalling instead. */}

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
                    <span className="text-white/55"> chapters</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span>
                    <span className="font-bold text-white">{totalPages}</span>
                    <span className="text-white/55"> pages</span>
                  </span>
                  {totalMin > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span>
                        <span className="font-bold text-white">~{Math.round(totalMin / 60) || 1}h</span>
                        <span className="text-white/55"> reading</span>
                      </span>
                    </>
                  )}
                </div>
                {donePages > 0 && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 max-w-md h-2 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          pct === 100 ? 'bg-[var(--gold)]' : `bg-gradient-to-r ${theme.bar}`
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-300 tabular-nums font-medium">
                      {doneChapters}/{book.chapters.length}
                      <span className="text-white/50"> chapters · </span>
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
                <p className="text-[11px] text-white/55 mt-0.5 tabular-nums">
                  {book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'}
                  {totalPages > 0 && ` · ${totalPages} pages`}
                  {totalMin > 0 && ` · ~${Math.max(1, Math.round(totalMin / 60))}h read`}
                </p>
              </div>
              {totalPages > 0 ? (
                <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs text-zinc-200 tabular-nums font-semibold">
                    {donePages}<span className="text-white/45">/{totalPages}</span>
                    {pct > 0 && <span className={`ml-1.5 ${theme.accent}`}>{pct}%</span>}
                  </span>
                  <div className="w-28 md:w-44 h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct === 100 ? 'bg-[var(--gold)]' : `bg-gradient-to-r ${theme.bar}`
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50
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
            <p className="text-sm text-white/55">No chapters published yet.</p>
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
/* ─── Main Component                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function GradeLandingPage({ grade, books, pages, basePath }: Props) {
  useBookTheme(); // apply the reader's saved brightness on the library too
  const [searchQuery,  setSearchQuery]  = useState('');
  const [openChapter,  setOpenChapter]  = useState<{ bookSlug: string; chapterNum: number } | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(books[0]?.slug ?? null);

  const singleBook = books.length === 1;

  /* One ordered shelf, not two labelled sections.
   *
   * The Core / Languages split only earns its space where it tells a student
   * something they'd act on. At Class 11-12 it does — core is exactly the four
   * exam subjects — but there it also happens to be exactly one row, so the
   * ORDER alone conveys it. At Class 9-10 every subject is compulsory, core is
   * only 3, and the heading just cost a row to say nothing: 6 books became two
   * half-empty rows, and adding two electives would have made it three.
   *
   * So we keep the ordering (core first) and drop the headings. Class 9 fills
   * row one with Maths / Science / Social Science / English; Class 11 fills it
   * with P/C/M/B. Eight books land in exactly two full rows either way. */
  const orderedBooks = useMemo(() => {
    const ELECTIVE = new Set(['english', 'hindi', 'sanskrit', 'ai', 'ict', 'life_skills']);
    const isElective = (b: GradeBook) => ELECTIVE.has(b.subject.toLowerCase());
    // Unknown subjects sort as core, so a newly added book is never buried.
    return [...books].sort((a, b) => Number(isElective(a)) - Number(isElective(b)));
  }, [books]);

  /* ── Derived data ─────────────────────────────────────────────────── */

  const pagesForBook = useMemo(() => {
    const map = new Map<string, GradePage[]>();
    for (const b of books) map.set(b._id, pages.filter(p => p.book_id === b._id));
    return map;
  }, [books, pages]);

  const activeBook = useMemo(
    () => books.find(b => b.slug === activeSubject) ?? books[0] ?? null,
    [books, activeSubject],
  );

  const toggleChapter = useCallback((bookSlug: string, chapterNum: number) => {
    setOpenChapter(prev =>
      prev?.bookSlug === bookSlug && prev.chapterNum === chapterNum
        ? null
        : { bookSlug, chapterNum },
    );
  }, []);

  /* Picking a book swaps the chapter list below the shelf. It does NOT scroll
     and does NOT stack every book's chapters: at 15-16 chapters x 4 subjects
     that was ~60 rows of accordion nobody reads. One book at a time. */
  const jumpToSubject = useCallback((slug: string) => {
    setActiveSubject(slug);
    setOpenChapter(null);
  }, []);

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
            results.push({ ...pg, bookSlug: seg(book), bookTitle: book.title, chapterTitle: ch.title });
          }
        }
      }
    }
    return results;
  }, [searchQuery, books, pages]);

  /* ── Render ───────────────────────────────────────────────────────── */

  return (
    <div className="relative min-h-screen bg-[var(--book-bg)] text-white flex flex-col pt-[72px]">

      {/* ── Ambient background — fixed glows + faint dot grid ──────────
          Plum only. This used to be three competing glows (orange / violet /
          emerald); under the plum system a background wash is decoration, so
          it gets one hue and stays near-invisible. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[18%] -left-[8%] w-[560px] h-[560px] rounded-full
          bg-[var(--plum)] opacity-[0.05] blur-[130px]" />
        <div className="absolute top-[55%] -right-[10%] w-[500px] h-[500px] rounded-full
          bg-[var(--plum)] opacity-[0.035] blur-[130px]" />
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

      {/* ── Masthead ──────────────────────────────────────────────────
          The old hero (big logo tile, four feature chips, Start-learning CTA)
          pushed the books ~460px below the fold. This keeps one real brand
          lockup and the claim, and hands the page straight to the books. */}
      <header className="relative shrink-0 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-6 md:pt-8 md:pb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="min-w-0">
              {/* Brand lockup — a mark, a wordmark and a live state, in one
                  object. The previous version was a bare text pill. */}
              <div className="inline-flex items-center gap-2.5 rounded-2xl p-[1px]
                bg-gradient-to-br from-[var(--plum-line)] via-white/10 to-transparent">
                <div className="flex items-center gap-2.5 rounded-[15px] pl-2 pr-3.5 py-2
                  bg-[#15121a]/90 backdrop-blur-sm">
                  <span className="grid place-items-center w-8 h-8 rounded-xl
                    bg-gradient-to-br from-[var(--plum)] to-[#5d2145]
                    ring-1 ring-inset ring-white/15 shadow-lg shadow-black/40">
                    <LiveBooksLogo size={18} />
                  </span>
                  <span className="leading-none">
                    <span className="block text-[15px] font-bold tracking-tight text-white">
                      Live<span className="text-[var(--plum-text)]">Books</span>
                    </span>
                    <span className="mt-1 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                        Interactive · NCERT
                      </span>
                    </span>
                  </span>
                </div>
              </div>

              <h1 className="mt-4 text-[2rem] md:text-[2.6rem] font-extrabold tracking-[-0.025em] leading-[1.0]
                bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent">
                Class {grade}
              </h1>

              <p className="mt-2 text-[15px] md:text-lg font-medium text-white/70 max-w-xl text-balance leading-snug">
                The NCERT syllabus, rebuilt to actually teach.
              </p>
            </div>

            {/* The claim, itemised. Reads as a sentence, not a chip rack — the
                four coloured chips this replaces were pure decoration. */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 shrink-0 lg:pb-1">
              {[
                'Visuals that explain',
                'Simulations you push on',
                'Reasoning questions',
                'Worked examples',
                'Video walkthroughs',
                'Quizzes that check you',
                'Hinglish mode',
                'Every NCERT chapter',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-[12.5px] text-white/50">
                  <span className="h-1 w-1 rounded-full bg-[var(--plum-text)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ── Book chooser ────────────────────────────────────────────────
          Picking a book swaps the chapter list below. This is the only
          chooser on the page — the sticky subject pills it replaced were a
          second control for the same job. */}
      <div className="px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto pb-2">
          <BookShelf
            heading="Subjects"
            books={orderedBooks}
            pages={pages}
            activeSlug={activeSubject}
            onSelect={jumpToSubject}
          />
        </div>
      </div>

      {/* ── Stats + Continue reading (hidden for fresh users) ───────── */}
      <ProgressBand books={books} pages={pages} basePath={basePath} />

      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06] px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search topics across ${singleBook ? (books[0]?.title ?? 'this book') : 'all books'}...`}
              className="w-full pl-9 pr-8 py-2 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg
                text-white placeholder:text-white/40 focus:outline-none focus:border-white/25
                focus:bg-white/[0.05] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="mt-2 border border-white/[0.08] rounded-xl bg-[var(--book-surface)] overflow-hidden
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
                      <p className="text-sm text-white/85 truncate">{pg.title}</p>
                      <p className="text-[11px] text-white/50 truncate">
                        {pg.bookTitle} · {pg.chapterTitle}
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-white/35 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {searchResults && searchResults.length === 0 && (
            <p className="text-xs text-white/50 py-2 px-1">
              No topics found for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Chapters for the SELECTED book only ─────────────────────── */}
      <main className="flex-1 px-4 md:px-8 pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="max-w-6xl mx-auto">
          {activeBook && (
            <SubjectSection
              key={activeBook.slug}
              book={activeBook}
              bookPages={pagesForBook.get(activeBook._id) ?? []}
              basePath={basePath}
              singleBook={singleBook}
              openChapter={openChapter}
              onToggleChapter={toggleChapter}
            />
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
