'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Play, CheckCircle2, Search, Bookmark, PlayCircle,
  FlaskConical, Video, Brain, ClipboardCheck, Gamepad2, Clock,
  Flame, ArrowRight, X, Sparkles, Languages, Zap,
} from 'lucide-react';
import { useBookProgress, BookProgressRecord } from '@/hooks/useBookProgress';
import { useBookBookmarks } from '@/hooks/useBookBookmarks';
import { useBookStats } from '@/hooks/useBookStats';
import { BlockType } from '@/types/books';
import { getTheme, getDecor, LiveBooksLogo } from './bookDesign';

/* ─── Serialisable types (no Mongoose/ObjectId) ─────────────────────────── */

export interface ToCPage {
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  reading_time_min?: number | null;
  content_types?: BlockType[] | null;
  video_title?: string | null;
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

/* ─── Content type icon mapping ─────────────────────────────────────────── */

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
/* ─── Component                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function BookTableOfContents({ book, chapters, firstPageSlug, basePath }: Props) {
  const bp = basePath ?? `/books/${book.slug}`;
  const theme = getTheme(book.subject);
  const decor = getDecor(book.subject);
  const Icon = theme.icon;

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

    const allPages = chapters.flatMap(ch => ch.pages);
    const lastIdx = allPages.findIndex(p => p.slug === lastSlug);
    if (lastIdx === -1) return null;

    for (let i = lastIdx + 1; i < allPages.length; i++) {
      if (!completedSlugs.has(allPages[i].slug)) return allPages[i];
    }
    for (let i = 0; i < lastIdx; i++) {
      if (!completedSlugs.has(allPages[i].slug)) return allPages[i];
    }
    return null;
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
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col pt-[72px]">

      {/* ── Ambient background — fixed glows + faint dot grid ─────────────── */}
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

      <div className="relative z-10 flex-1 flex flex-col">

        {/* ── Hero header ───────────────────────────────────────────────── */}
        <header className="relative border-b border-white/[0.06] shrink-0 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full
              bg-orange-500/[0.08] blur-[100px]" />
            <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full
              bg-amber-500/[0.05] blur-[100px]" />
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

          <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10
            flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1 min-w-0">
              {/* Live Books pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                bg-orange-500/10 border border-orange-500/20 mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">
                  Live Book
                </span>
              </div>

              {/* Logo + title */}
              <div className="flex items-center gap-4 md:gap-5">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
                    blur-2xl opacity-50" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl
                    bg-gradient-to-br from-orange-500 to-amber-500
                    flex items-center justify-center shadow-xl shadow-orange-500/30
                    ring-1 ring-orange-300/40">
                    <LiveBooksLogo size={38} className="md:hidden" />
                    <LiveBooksLogo size={46} className="hidden md:block" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] uppercase tracking-[0.18em] font-bold ${theme.accent} mb-1`}>
                    {book.subject} · Grade {book.grade}
                  </p>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-[1.05]">
                    {book.title}
                  </h1>
                </div>
              </div>

              <p className="mt-4 text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl">
                NCERT Class {book.grade} {book.subject} as an interactive live book — with simulations,
                worked examples, quizzes, and Hinglish mode. Free, forever.
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  { icon: Gamepad2,       label: 'Simulations',   color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
                  { icon: ClipboardCheck, label: 'Quizzes',       color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
                  { icon: Languages,      label: 'Hinglish mode', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
                  { icon: Zap,            label: 'Adaptive',      color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                ].map(chip => {
                  const Ic = chip.icon;
                  return (
                    <span
                      key={chip.label}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                        text-[10px] font-semibold border ${chip.bg} ${chip.border} ${chip.color}`}
                    >
                      <Ic size={10} />
                      {chip.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {firstPageSlug && (
              <Link
                href={`${bp}/${continueReading?.slug ?? firstPageSlug}`}
                className="group relative flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl
                  bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
                  hover:scale-[1.03] transition-transform shrink-0 shadow-xl shadow-orange-500/30
                  ring-1 ring-orange-300/40 self-start md:self-end"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400
                  opacity-0 group-hover:opacity-100 blur-md transition-opacity -z-10" />
                <Play size={14} className="fill-black" />
                <span>{continueReading ? 'Continue Reading' : 'Start Learning'}</span>
              </Link>
            )}
          </div>
        </header>

        {/* ── Stats strip + Continue reading card ─────────────────────────── */}
        {(bookProgress.completed > 0 || continueReading || (stats && stats.streak_days > 0)) && (
          <div className="border-b border-white/[0.06] px-4 md:px-8 shrink-0">
            <div className="max-w-6xl mx-auto py-5 flex flex-col md:flex-row gap-4 md:items-stretch">

              {/* Stats */}
              <div className="flex items-center gap-5 md:gap-7 md:pr-7 md:border-r md:border-white/[0.06] flex-wrap">
                {!loading && bookProgress.total > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Completed
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
                      {bookProgress.completed}
                      <span className="text-zinc-600 font-bold text-lg">/{bookProgress.total}</span>
                    </span>
                    <span className="text-xs text-zinc-400 tabular-nums">{bookProgress.pct}% done</span>
                  </div>
                )}

                {!loading && bookProgress.remainingMin > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Remaining
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
                      {bookProgress.remainingMin}
                      <span className="text-zinc-600 font-bold text-lg"> min</span>
                    </span>
                    <span className="text-xs text-zinc-400">of reading left</span>
                  </div>
                )}

                {stats && stats.streak_days > 0 && (
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold
                      flex items-center gap-1">
                      <Flame size={11} className="text-orange-400" /> Streak
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
                      {stats.streak_days}
                      <span className="text-zinc-600 font-bold text-lg"> days</span>
                    </span>
                    <span className="text-xs text-zinc-400">keep it going</span>
                  </div>
                )}

                {stats && stats.avg_quiz_score !== null && (
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Avg quiz
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-tight">
                      {stats.avg_quiz_score}
                      <span className="text-zinc-600 font-bold text-lg">%</span>
                    </span>
                    <span className="text-xs text-zinc-400">across submissions</span>
                  </div>
                )}
              </div>

              {/* Continue reading card */}
              {continueReading && (
                <Link
                  href={`${bp}/${continueReading.slug}`}
                  className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08]
                    bg-gradient-to-br ${theme.gradient} hover:border-white/[0.18] transition-all group`}
                >
                  <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center shrink-0`}>
                    <ArrowRight size={18} className={theme.accent} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider font-bold ${theme.accent}`}>
                      Continue reading
                    </p>
                    <p className="text-sm md:text-base text-white font-semibold truncate">
                      {continueReading.title}
                    </p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${theme.bg} flex items-center justify-center shrink-0
                    group-hover:scale-110 transition-transform`}>
                    <ChevronRight size={16} className={theme.accent} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <div className="border-b border-white/[0.06] px-4 md:px-8 shrink-0">
          <div className="max-w-6xl mx-auto py-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
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
                {searchResults.map((pg) => {
                  const done = completedSlugs.has(pg.slug);
                  return (
                    <Link
                      key={pg.slug}
                      href={`${bp}/${pg.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors
                        border-b border-white/[0.05] last:border-0"
                    >
                      {done ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 truncate">{pg.title}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{pg.chapterTitle}</p>
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

        {/* ── Mobile chapter tabs ─────────────────────────────────────────── */}
        <div className="md:hidden border-b border-white/[0.06] overflow-x-auto shrink-0">
          <div className="flex gap-1 px-4 py-2 min-w-max">
            {chapters.map((ch, i) => {
              const prog = chapterProgress[i];
              const isActive = i === activeIdx && !showBookmarks;
              return (
                <button
                  key={ch.number}
                  onClick={() => { setActiveIdx(i); setShowBookmarks(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                    whitespace-nowrap transition-all ${
                    isActive
                      ? `${theme.bg} ${theme.accent} border ${theme.border}`
                      : 'text-zinc-400 hover:text-white border border-transparent'
                  }`}
                >
                  {prog.pct === 100 && <CheckCircle2 size={10} className="text-emerald-400" />}
                  <span>Ch {ch.number}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Two-pane body ───────────────────────────────────────────────── */}
        <div className="flex-1 px-4 md:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto flex gap-6">

            {/* ── Sidebar — one glassmorphic card, flat chapter rows ──── */}
            <aside className="hidden md:flex flex-col w-72 shrink-0 self-start
              sticky top-[88px] max-h-[calc(100vh-100px)]">

              <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden
                bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40 flex flex-col
                max-h-[calc(100vh-100px)]">

                {/* Header */}
                <div className="relative px-4 py-3 border-b border-white/[0.06] shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                    from-transparent via-white/[0.18] to-transparent" />
                  <p className="relative text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                    Chapters
                  </p>
                </div>

                {/* Flat chapter rows — no per-row box */}
                <nav className="flex-1 overflow-y-auto">
                  {chapters.map((ch, i) => {
                    const prog = chapterProgress[i];
                    const isActive = i === activeIdx && !showBookmarks;
                    const isDone = prog.pct === 100;
                    return (
                      <button
                        key={ch.number}
                        onClick={() => { setActiveIdx(i); setShowBookmarks(false); }}
                        className={`w-full text-left px-4 py-3.5 flex flex-col gap-1.5
                          border-b border-white/[0.04] last:border-b-0 transition-colors group ${
                          isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-[0.15em] leading-none
                            transition-colors ${
                            isDone
                              ? 'text-emerald-400/70'
                              : isActive ? theme.accent : `${theme.accent} opacity-60 group-hover:opacity-90`
                          }`}>
                            Ch {ch.number}
                          </span>
                          {isDone && <CheckCircle2 size={11} className="text-emerald-400 ml-auto" />}
                        </div>

                        <p className={`text-[13px] leading-snug transition-colors ${
                          isActive ? 'text-white font-semibold' : 'text-zinc-300 group-hover:text-white'
                        }`}>
                          {ch.title}
                        </p>

                        {!loading && prog.total > 0 && (
                          <div className="mt-0.5">
                            <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDone ? 'bg-emerald-500' : `bg-gradient-to-r ${theme.bar}`
                                }`}
                                style={{ width: `${prog.pct}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1 tabular-nums">
                              {prog.completed} / {prog.total} pages
                            </p>
                          </div>
                        )}
                        {loading && prog.total > 0 && (
                          <div className="h-[3px] bg-white/5 rounded-full animate-pulse mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Bookmarks toggle */}
                <div className="border-t border-white/[0.06] p-2 shrink-0">
                  <button
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors ${
                      showBookmarks
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Bookmark size={13} className={showBookmarks ? 'fill-amber-400' : ''} />
                    <span className="font-semibold">Bookmarks</span>
                    {bookmarks.length > 0 && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                        showBookmarks ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.06] text-zinc-400'
                      }`}>
                        {bookmarks.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </aside>

            {/* ── Right pane — chapter detail or bookmarks ────────────── */}
            <main className="flex-1 min-w-0">

              {showBookmarks ? (
                /* ── Bookmarks view ──────────────────────────────────── */
                <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden
                  bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40">
                  <div className="relative px-6 md:px-8 py-6 md:py-7 border-b border-white/[0.06]">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.08] via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                      from-transparent via-white/[0.18] to-transparent" />
                    <div className="relative flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-xl bg-amber-500/10 blur-xl opacity-90" />
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-amber-500/10
                          border border-amber-500/20 flex items-center justify-center">
                          <Bookmark size={22} className="text-amber-400 fill-amber-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400">
                          Saved
                        </p>
                        <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                          Bookmarked Pages
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Pages you want to revisit</p>
                      </div>
                    </div>
                  </div>

                  {bookmarks.length === 0 ? (
                    <div className="text-center py-16 px-6">
                      <Bookmark size={36} className="text-zinc-700 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400">No bookmarks yet</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Click the bookmark icon on any page to save it here
                      </p>
                    </div>
                  ) : (
                    <div>
                      {bookmarks.map((bm) => (
                        <Link
                          key={bm.page_slug}
                          href={`${bp}/${bm.page_slug}`}
                          className="flex items-center gap-3 px-5 md:px-8 py-3.5 transition-colors
                            border-b border-white/[0.04] last:border-b-0 hover:bg-amber-500/[0.04] group"
                        >
                          <Bookmark size={14} className="text-amber-400 shrink-0 fill-amber-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/90 group-hover:text-white truncate">
                              {bm.page_title}
                            </p>
                            <p className="text-[11px] text-zinc-500">Chapter {bm.chapter_number}</p>
                          </div>
                          <ChevronRight size={14} className="text-zinc-600 group-hover:text-amber-400/60 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

              ) : activeChapter && (
                /* ── Chapter card — header + flat page rows ─────────── */
                <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden
                  bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40">

                  {/* Header region — subject gradient + floating decor */}
                  <div className="relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent
                      pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                      from-transparent via-white/[0.18] to-transparent" />

                    {/* Floating decor icons */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {decor.map((d, i) => {
                        const DecorI = d.Icon;
                        return (
                          <DecorI
                            key={i}
                            size={d.size}
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

                    <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
                      <div className="relative shrink-0">
                        <div className={`absolute inset-0 rounded-2xl ${theme.bg} blur-2xl opacity-80`} />
                        <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl ${theme.bg} border ${theme.border}
                          flex flex-col items-center justify-center backdrop-blur-sm`}>
                          <span className={`text-[10px] uppercase tracking-[0.18em] font-bold leading-none mb-0.5 ${theme.accent} opacity-70`}>
                            Ch
                          </span>
                          <span className={`text-2xl md:text-3xl font-black tabular-nums leading-none ${theme.accent}`}>
                            {activeChapter.number}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] uppercase tracking-[0.2em] font-bold ${theme.accent} mb-1`}>
                          Chapter {activeChapter.number}
                        </p>
                        <h2 className="text-lg md:text-xl font-black text-white leading-tight">
                          {activeChapter.title}
                        </h2>

                        {!loading && chapterProgress[activeIdx].total > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <div className="flex-1 min-w-[140px] max-w-xs h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  chapterProgress[activeIdx].pct === 100
                                    ? 'bg-emerald-500'
                                    : `bg-gradient-to-r ${theme.bar}`
                                }`}
                                style={{ width: `${chapterProgress[activeIdx].pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-300 tabular-nums font-medium">
                              {chapterProgress[activeIdx].completed} of {chapterProgress[activeIdx].total} completed
                              {chapterProgress[activeIdx].pct > 0 && (
                                <span className="text-zinc-500"> · {chapterProgress[activeIdx].pct}%</span>
                              )}
                            </span>
                            {chapterProgress[activeIdx].remainingMin > 0 && (
                              <span className="text-xs text-zinc-400 flex items-center gap-1 tabular-nums">
                                <Clock size={11} />
                                ~{chapterProgress[activeIdx].remainingMin} min left
                              </span>
                            )}
                            {chapterProgress[activeIdx].totalMin > 0 && chapterProgress[activeIdx].pct === 0 && (
                              <span className="text-xs text-zinc-400 flex items-center gap-1 tabular-nums">
                                <Clock size={11} />
                                ~{chapterProgress[activeIdx].totalMin} min total
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flat page rows — no per-row box */}
                  {activeChapter.pages.length === 0 ? (
                    <div className="border-t border-white/[0.08] px-6 py-10 text-center">
                      <p className="text-sm text-zinc-400">No published pages yet.</p>
                    </div>
                  ) : (
                    <div className="relative border-t border-white/[0.08]">
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
                            className={`flex items-center gap-4 px-5 md:px-8 py-3.5 md:py-4
                              border-b border-white/[0.05] last:border-b-0 transition-colors group
                              ${done ? 'hover:bg-emerald-500/[0.04]' : 'hover:bg-white/[0.02]'}`}
                          >
                            {/* Status icon */}
                            <div className="shrink-0 w-5 flex items-center justify-center">
                              {done ? (
                                <CheckCircle2 size={17} className="text-emerald-400" />
                              ) : (
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center
                                  text-[10px] font-semibold transition-colors ${
                                  loading
                                    ? 'border-white/10 text-zinc-600'
                                    : 'border-white/15 text-zinc-400'
                                }`}>
                                  {i + 1}
                                </span>
                              )}
                            </div>

                            {/* Title + video preview + content chips */}
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm md:text-[15px] leading-snug transition-colors block ${
                                done ? 'text-zinc-400' : 'text-white/90 group-hover:text-white'
                              }`}>
                                {pg.title}
                              </span>
                              {pg.video_title && (
                                <span className="flex items-center gap-1 mt-1">
                                  <PlayCircle size={11} className="text-rose-400 shrink-0" />
                                  <span className="text-[11px] text-rose-400/80 truncate">{pg.video_title}</span>
                                </span>
                              )}
                              {contentIcons.filter(ci => ci!.label !== 'Video').length > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  {contentIcons.filter(ci => ci!.label !== 'Video').map((ci, idx) => {
                                    const Ic = ci!.icon;
                                    return (
                                      <span
                                        key={idx}
                                        className={`flex items-center gap-0.5 text-[10px] ${ci!.color} opacity-70`}
                                        title={ci!.label}
                                      >
                                        <Ic size={10} />
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
                              onClick={(e) => handleBookmark(e, pg)}
                              className={`shrink-0 p-1 rounded-md transition-colors ${
                                isBookmarked
                                  ? 'text-amber-400 hover:text-amber-300'
                                  : 'text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100'
                              }`}
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
                            >
                              <Bookmark size={13} className={isBookmarked ? 'fill-amber-400' : ''} />
                            </button>


                            <ChevronRight
                              size={14}
                              className={`shrink-0 transition-colors ${
                                done ? 'text-emerald-500/40' : 'text-zinc-600 group-hover:text-white'
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
