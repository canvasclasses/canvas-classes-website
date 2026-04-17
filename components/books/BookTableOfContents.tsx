'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen, ChevronRight, Play, CheckCircle2, Search, Bookmark,
  FlaskConical, Video, Brain, ClipboardCheck, Gamepad2, Clock,
  Flame, ArrowRight, X, Sparkles,
} from 'lucide-react';
import { useBookProgress, BookProgressRecord } from '@/hooks/useBookProgress';
import { useBookBookmarks } from '@/hooks/useBookBookmarks';
import { useBookStats } from '@/hooks/useBookStats';
import { BlockType } from '@/types/books';

/* ─── Serialisable types (no Mongoose/ObjectId) ─────────────────────────── */

export interface ToCPage {
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  reading_time_min?: number | null;
  content_types?: BlockType[] | null;
}

export interface ToCChapter {
  number: number;
  title: string;
  slug: string;
  pages: ToCPage[];
}

export interface ToCBook {
  slug: string;
  title: string;
  subject: string;
  grade: number;
}

interface Props {
  book: ToCBook;
  chapters: ToCChapter[];
  firstPageSlug?: string;
  basePath?: string;
}

/* ─── Chapter accent colors ─────────────────────────────────────────────── */

const CHAPTER_COLORS = [
  { accent: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'from-orange-500 to-amber-400' },
  { accent: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', bar: 'from-sky-500 to-cyan-400' },
  { accent: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', bar: 'from-violet-500 to-purple-400' },
  { accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'from-emerald-500 to-teal-400' },
  { accent: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'from-rose-500 to-pink-400' },
  { accent: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'from-amber-500 to-yellow-400' },
];

function getChapterColor(index: number) {
  return CHAPTER_COLORS[index % CHAPTER_COLORS.length];
}

/* ─── Content type icon mapping ─────────────────────────────────────────── */

const CONTENT_ICONS: Partial<Record<BlockType, { icon: typeof FlaskConical; label: string; color: string }>> = {
  inline_quiz:       { icon: ClipboardCheck, label: 'Quiz', color: 'text-amber-400' },
  simulation:        { icon: Gamepad2, label: 'Simulation', color: 'text-sky-400' },
  video:             { icon: Video, label: 'Video', color: 'text-rose-400' },
  molecule_3d:       { icon: FlaskConical, label: '3D Molecule', color: 'text-violet-400' },
  reasoning_prompt:  { icon: Brain, label: 'Reasoning', color: 'text-emerald-400' },
  worked_example:    { icon: Sparkles, label: 'Worked Example', color: 'text-orange-400' },
  classify_exercise: { icon: ClipboardCheck, label: 'Exercise', color: 'text-teal-400' },
};

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function BookTableOfContents({ book, chapters, firstPageSlug, basePath }: Props) {
  const bp = basePath ?? `/books/${book.slug}`;
  const [activeIdx, setActiveIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);

  const { records, completedSlugs, loading } = useBookProgress(book.slug);
  const { bookmarks, bookmarkedSlugs, toggleBookmark } = useBookBookmarks(book.slug);
  const { stats } = useBookStats(book.slug);

  const activeChapter = chapters[activeIdx];

  /* ── Progress helpers ──────────────────────────────────────────────────── */

  const recordsBySlug = useMemo(() => {
    const map = new Map<string, BookProgressRecord>();
    for (const r of records) map.set(r.page_slug, r);
    return map;
  }, [records]);

  const chapterProgress = useMemo(
    () =>
      chapters.map((ch) => {
        const total = ch.pages.length;
        if (total === 0) return { completed: 0, total: 0, pct: 0, totalMin: 0, remainingMin: 0 };
        const completed = ch.pages.filter((p) => completedSlugs.has(p.slug)).length;
        const totalMin = ch.pages.reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
        const remainingMin = ch.pages
          .filter((p) => !completedSlugs.has(p.slug))
          .reduce((s, p) => s + (p.reading_time_min ?? 0), 0);
        return { completed, total, pct: Math.round((completed / total) * 100), totalMin, remainingMin };
      }),
    [chapters, completedSlugs]
  );

  const bookProgress = useMemo(() => {
    const total = chapters.reduce((s, ch) => s + ch.pages.length, 0);
    const completed = chapterProgress.reduce((s, p) => s + p.completed, 0);
    const totalMin = chapterProgress.reduce((s, p) => s + p.totalMin, 0);
    const remainingMin = chapterProgress.reduce((s, p) => s + p.remainingMin, 0);
    return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0, totalMin, remainingMin };
  }, [chapters, chapterProgress]);

  /* ── Continue reading ──────────────────────────────────────────────────── */

  const continueReading = useMemo(() => {
    if (!stats?.last_completed) return null;
    const lastSlug = stats.last_completed.page_slug;

    // Find all pages in order, locate the last completed, suggest next incomplete
    const allPages = chapters.flatMap(ch => ch.pages);
    const lastIdx = allPages.findIndex(p => p.slug === lastSlug);
    if (lastIdx === -1) return null;

    // Find next incomplete page after the last completed
    for (let i = lastIdx + 1; i < allPages.length; i++) {
      if (!completedSlugs.has(allPages[i].slug)) {
        return allPages[i];
      }
    }
    // If all subsequent are done, find first incomplete from start
    for (let i = 0; i < lastIdx; i++) {
      if (!completedSlugs.has(allPages[i].slug)) {
        return allPages[i];
      }
    }
    return null; // All pages completed
  }, [stats, chapters, completedSlugs]);

  /* ── Search ────────────────────────────────────────────────────────────── */

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: (ToCPage & { chapterTitle: string })[] = [];
    for (const ch of chapters) {
      for (const pg of ch.pages) {
        if (pg.title.toLowerCase().includes(q)) {
          results.push({ ...pg, chapterTitle: ch.title });
        }
      }
    }
    return results;
  }, [searchQuery, chapters]);

  /* ── Bookmark handler ──────────────────────────────────────────────────── */

  const handleBookmark = useCallback((e: React.MouseEvent, pg: ToCPage) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(pg.slug, pg.title, pg.chapter_number);
  }, [toggleBookmark]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-[72px]">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500
              flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-black" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-orange-400 font-semibold uppercase tracking-wider">
                {book.subject} · Grade {book.grade}
              </p>
              <h1 className="text-base md:text-lg font-bold text-white leading-tight truncate">
                {book.title}
              </h1>
            </div>
          </div>

          {!loading && bookProgress.total > 0 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
                  style={{ width: `${bookProgress.pct}%` }}
                />
              </div>
              <span className="text-xs text-white/30">
                {bookProgress.completed}/{bookProgress.total}
              </span>
            </div>
          )}

          {firstPageSlug && (
            <Link
              href={`${bp}/${continueReading?.slug ?? firstPageSlug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
                hover:opacity-90 transition-opacity shrink-0"
            >
              <Play size={13} className="fill-black" />
              <span className="hidden sm:inline">
                {continueReading ? 'Continue' : 'Start Learning'}
              </span>
              <span className="sm:hidden">
                {continueReading ? 'Continue' : 'Start'}
              </span>
            </Link>
          )}
        </div>
      </header>

      {/* ── Stats banner + Continue reading ──────────────────────────────── */}
      <div className="border-b border-white/5 px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-3 flex flex-col gap-3">

          {/* Study stats strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {stats && stats.streak_days > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <Flame size={13} className="text-orange-400" />
                <span className="text-white/50">
                  <span className="text-white font-semibold">{stats.streak_days}</span> day streak
                </span>
              </div>
            )}

            {!loading && bookProgress.completed > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-white/50">
                  <span className="text-white font-semibold">{bookProgress.completed}</span> pages completed
                </span>
              </div>
            )}

            {!loading && bookProgress.remainingMin > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <Clock size={13} className="text-sky-400" />
                <span className="text-white/50">
                  <span className="text-white font-semibold">~{bookProgress.remainingMin} min</span> remaining
                </span>
              </div>
            )}

            {stats && stats.avg_quiz_score !== null && (
              <div className="flex items-center gap-1.5 text-xs">
                <ClipboardCheck size={13} className="text-amber-400" />
                <span className="text-white/50">
                  Avg quiz: <span className="text-white font-semibold">{stats.avg_quiz_score}%</span>
                </span>
              </div>
            )}
          </div>

          {/* Continue reading card */}
          {continueReading && (
            <Link
              href={`${bp}/${continueReading.slug}`}
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
                  {continueReading.title}
                </p>
              </div>
              {continueReading.reading_time_min && (
                <span className="text-xs text-white/20 shrink-0">{continueReading.reading_time_min} min</span>
              )}
              <ChevronRight size={14} className="text-white/20 group-hover:text-orange-400 transition-colors shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-4 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto py-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
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

          {/* Search results dropdown */}
          {searchResults && searchResults.length > 0 && (
            <div className="mt-1 mb-2 border border-white/8 rounded-xl bg-[#0B0F15] overflow-hidden
              max-h-64 overflow-y-auto">
              {searchResults.map((pg) => {
                const done = completedSlugs.has(pg.slug);
                return (
                  <Link
                    key={pg.slug}
                    href={`${bp}/${pg.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors
                      border-b border-white/5 last:border-0"
                  >
                    {done ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{pg.title}</p>
                      <p className="text-[10px] text-white/25">{pg.chapterTitle}</p>
                    </div>
                    <ChevronRight size={12} className="text-white/15 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {searchResults && searchResults.length === 0 && (
            <p className="text-xs text-white/25 py-2 px-1">No topics found for &ldquo;{searchQuery}&rdquo;</p>
          )}
        </div>
      </div>

      {/* ── Mobile chapter tabs ──────────────────────────────────────────── */}
      <div className="md:hidden border-b border-white/5 overflow-x-auto shrink-0">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {chapters.map((ch, i) => {
            const prog = chapterProgress[i];
            const isActive = i === activeIdx;
            const color = getChapterColor(i);
            return (
              <button
                key={ch.number}
                onClick={() => { setActiveIdx(i); setShowBookmarks(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  whitespace-nowrap transition-all ${
                  isActive
                    ? `${color.bg} ${color.accent} border ${color.border}`
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                {prog.pct === 100 && (
                  <CheckCircle2 size={10} className="text-emerald-400" />
                )}
                {ch.title.length > 22 ? ch.title.slice(0, 22).trim() + '…' : ch.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Two-pane body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-6xl w-full mx-auto overflow-hidden">

        {/* ── Left: Chapter sidebar (desktop only) ──────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5
          sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-4 flex-1">
            <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-3 px-2">
              Chapters
            </p>
            <nav className="flex flex-col gap-0.5">
              {chapters.map((ch, i) => {
                const prog = chapterProgress[i];
                const isActive = i === activeIdx && !showBookmarks;
                const isDone = prog.pct === 100;
                const color = getChapterColor(i);
                return (
                  <button
                    key={ch.number}
                    onClick={() => { setActiveIdx(i); setShowBookmarks(false); }}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-white/8 border border-white/12'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        isActive ? color.accent : 'text-white/25 group-hover:text-white/40'
                      }`}>
                        Ch {ch.number}
                      </span>
                      {isDone && (
                        <CheckCircle2 size={11} className="text-emerald-400 ml-auto" />
                      )}
                    </div>

                    <p className={`text-[13px] leading-snug mb-2.5 transition-colors ${
                      isActive ? 'text-white font-medium' : 'text-white/55 group-hover:text-white/80'
                    }`}>
                      {ch.title}
                    </p>

                    {!loading && prog.total > 0 && (
                      <div>
                        <div className="h-[3px] bg-white/8 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDone
                                ? 'bg-emerald-500'
                                : `bg-gradient-to-r ${color.bar}`
                            }`}
                            style={{ width: `${prog.pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-white/20 mt-1">
                          {prog.completed} / {prog.total} pages
                        </p>
                      </div>
                    )}

                    {loading && prog.total > 0 && (
                      <div className="h-[3px] bg-white/5 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bookmarks section in sidebar */}
          <div className="border-t border-white/5 p-4">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-all ${
                showBookmarks
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <Bookmark size={13} />
              <span className="font-semibold">Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                  showBookmarks ? 'bg-amber-500/20 text-amber-400' : 'bg-white/8 text-white/30'
                }`}>
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* ── Right: Page list or Bookmarks ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">

          {/* ── Bookmarks view ──────────────────────────────────────────── */}
          {showBookmarks ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  <Bookmark size={20} className="text-amber-400" /> Bookmarked Pages
                </h2>
                <p className="text-xs text-white/30 mt-1">Pages you want to revisit</p>
              </div>

              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark size={32} className="text-white/10 mx-auto mb-3" />
                  <p className="text-sm text-white/25">No bookmarks yet</p>
                  <p className="text-xs text-white/15 mt-1">
                    Click the bookmark icon on any page to save it here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {bookmarks.map((bm) => (
                    <Link
                      key={bm.page_slug}
                      href={`${bp}/${bm.page_slug}`}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border
                        border-amber-500/10 bg-amber-500/[0.02] hover:bg-amber-500/[0.06]
                        transition-all group"
                    >
                      <Bookmark size={14} className="text-amber-400 shrink-0 fill-amber-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 group-hover:text-white truncate">
                          {bm.page_title}
                        </p>
                        <p className="text-[10px] text-white/20">
                          Chapter {bm.chapter_number}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-white/15 group-hover:text-amber-400/50 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

          ) : activeChapter && (
            /* ── Chapter page list view ─────────────────────────────────── */
            <>
              {/* Chapter header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${getChapterColor(activeIdx).accent}`}>
                    Chapter {activeChapter.number}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {activeChapter.title}
                </h2>

                {/* Chapter progress summary with time estimate */}
                {!loading && chapterProgress[activeIdx].total > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex-1 max-w-xs h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          chapterProgress[activeIdx].pct === 100
                            ? 'bg-emerald-500'
                            : `bg-gradient-to-r ${getChapterColor(activeIdx).bar}`
                        }`}
                        style={{ width: `${chapterProgress[activeIdx].pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/35">
                      {chapterProgress[activeIdx].completed} of {chapterProgress[activeIdx].total} completed
                      {chapterProgress[activeIdx].pct > 0 && (
                        <span className="text-white/20"> · {chapterProgress[activeIdx].pct}%</span>
                      )}
                    </span>
                    {chapterProgress[activeIdx].remainingMin > 0 && (
                      <span className="text-xs text-white/20 flex items-center gap-1">
                        <Clock size={11} />
                        ~{chapterProgress[activeIdx].remainingMin} min left
                      </span>
                    )}
                    {chapterProgress[activeIdx].totalMin > 0 && chapterProgress[activeIdx].pct === 0 && (
                      <span className="text-xs text-white/20 flex items-center gap-1">
                        <Clock size={11} />
                        ~{chapterProgress[activeIdx].totalMin} min total
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Page list */}
              <div className="flex flex-col gap-2">
                {activeChapter.pages.map((pg, i) => {
                  const done = completedSlugs.has(pg.slug);
                  const isBookmarked = bookmarkedSlugs.has(pg.slug);
                  const progressRecord = recordsBySlug.get(pg.slug);
                  const quizScore = progressRecord?.quiz_score;
                  const hasRealQuiz = pg.content_types?.includes('inline_quiz');
                  const contentIcons = (pg.content_types ?? [])
                    .map(t => CONTENT_ICONS[t])
                    .filter(Boolean);

                  return (
                    <Link
                      key={pg.slug}
                      href={`${bp}/${pg.slug}`}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                        transition-all group ${
                        done
                          ? 'border-emerald-500/20 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                          : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
                      }`}
                    >
                      {/* Status icon */}
                      <div className="shrink-0 w-5 flex items-center justify-center">
                        {done ? (
                          <CheckCircle2 size={17} className="text-emerald-400" />
                        ) : (
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center
                            text-[10px] font-medium transition-colors ${
                            loading
                              ? 'border-white/10 text-white/20'
                              : `border-white/20 text-white/35 group-hover:border-${getChapterColor(activeIdx).accent.replace('text-', '')}/50 group-hover:${getChapterColor(activeIdx).accent}`
                          }`}>
                            {i + 1}
                          </span>
                        )}
                      </div>

                      {/* Page title + content type badges */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm leading-snug transition-colors block ${
                          done
                            ? 'text-white/50'
                            : 'text-white/80 group-hover:text-white'
                        }`}>
                          {pg.title}
                        </span>

                        {/* Content type badges */}
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

                      {/* Quiz score badge */}
                      {done && hasRealQuiz && quizScore != null && quizScore < 100 && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                          quizScore >= 80
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : quizScore >= 60
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}>
                          {quizScore}%
                        </span>
                      )}

                      {/* Bookmark toggle */}
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

                      {/* Read time */}
                      {pg.reading_time_min && (
                        <span className="text-xs text-white/20 shrink-0 tabular-nums">
                          {pg.reading_time_min} min
                        </span>
                      )}

                      {/* Arrow */}
                      <ChevronRight
                        size={14}
                        className={`shrink-0 transition-colors ${
                          done ? 'text-emerald-500/30' : 'text-white/15 group-hover:text-white/40'
                        }`}
                      />
                    </Link>
                  );
                })}

                {activeChapter.pages.length === 0 && (
                  <p className="text-sm text-white/20 px-4 py-3">
                    No published pages yet.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
