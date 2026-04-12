'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import { useBookProgress } from '@/hooks/useBookProgress';

/* ─── Serialisable types (no Mongoose/ObjectId) ─────────────────────────── */

export interface ToCPage {
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  reading_time_min?: number | null;
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
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function BookTableOfContents({ book, chapters, firstPageSlug }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const { completedSlugs, loading } = useBookProgress(book.slug);

  const activeChapter = chapters[activeIdx];

  /* Per-chapter progress derived from completedSlugs */
  const chapterProgress = useMemo(
    () =>
      chapters.map((ch) => {
        const total = ch.pages.length;
        if (total === 0) return { completed: 0, total: 0, pct: 0 };
        const completed = ch.pages.filter((p) => completedSlugs.has(p.slug)).length;
        return { completed, total, pct: Math.round((completed / total) * 100) };
      }),
    [chapters, completedSlugs]
  );

  /* Total book progress */
  const bookProgress = useMemo(() => {
    const total = chapters.reduce((s, ch) => s + ch.pages.length, 0);
    const completed = chapterProgress.reduce((s, p) => s + p.completed, 0);
    return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0 };
  }, [chapters, chapterProgress]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {/* Book identity */}
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

          {/* Overall progress pill */}
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

          {/* CTA */}
          {firstPageSlug && (
            <Link
              href={`/books/${book.slug}/${firstPageSlug}`}
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

      {/* ── Mobile chapter tabs ──────────────────────────────────────────── */}
      <div className="md:hidden border-b border-white/5 overflow-x-auto shrink-0">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {chapters.map((ch, i) => {
            const prog = chapterProgress[i];
            const isActive = i === activeIdx;
            return (
              <button
                key={ch.number}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                {prog.pct === 100 && (
                  <CheckCircle2 size={10} className="text-emerald-400" />
                )}
                Ch {ch.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Two-pane body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-6xl w-full mx-auto overflow-hidden">

        {/* ── Left: Chapter sidebar (desktop only) ──────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5
          sticky top-0 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4">
            <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-3 px-2">
              Chapters
            </p>
            <nav className="flex flex-col gap-0.5">
              {chapters.map((ch, i) => {
                const prog = chapterProgress[i];
                const isActive = i === activeIdx;
                const isDone = prog.pct === 100;
                return (
                  <button
                    key={ch.number}
                    onClick={() => setActiveIdx(i)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-white/8 border border-white/12'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {/* Chapter label row */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        isActive ? 'text-orange-400' : 'text-white/25 group-hover:text-white/40'
                      }`}>
                        Ch {ch.number}
                      </span>
                      {isDone && (
                        <CheckCircle2 size={11} className="text-emerald-400 ml-auto" />
                      )}
                    </div>

                    {/* Chapter title */}
                    <p className={`text-[13px] leading-snug mb-2.5 transition-colors ${
                      isActive ? 'text-white font-medium' : 'text-white/55 group-hover:text-white/80'
                    }`}>
                      {ch.title}
                    </p>

                    {/* Progress bar */}
                    {!loading && prog.total > 0 && (
                      <div>
                        <div className="h-[3px] bg-white/8 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDone
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-orange-500 to-amber-400'
                            }`}
                            style={{ width: `${prog.pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-white/20 mt-1">
                          {prog.completed} / {prog.total} pages
                        </p>
                      </div>
                    )}

                    {/* Skeleton bar while loading */}
                    {loading && prog.total > 0 && (
                      <div className="h-[3px] bg-white/5 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ── Right: Page list ───────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeChapter && (
            <>
              {/* Chapter header */}
              <div className="mb-6">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">
                  Chapter {activeChapter.number}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {activeChapter.title}
                </h2>

                {/* Chapter progress summary */}
                {!loading && chapterProgress[activeIdx].total > 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 max-w-xs h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          chapterProgress[activeIdx].pct === 100
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-orange-500 to-amber-400'
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
                  </div>
                )}
              </div>

              {/* Page list */}
              <div className="flex flex-col gap-2">
                {activeChapter.pages.map((pg, i) => {
                  const done = completedSlugs.has(pg.slug);
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
                      {/* Status icon */}
                      <div className="shrink-0 w-5 flex items-center justify-center">
                        {done ? (
                          <CheckCircle2 size={17} className="text-emerald-400" />
                        ) : (
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center
                            text-[10px] font-medium transition-colors ${
                            loading
                              ? 'border-white/10 text-white/20'
                              : 'border-white/20 text-white/35 group-hover:border-orange-500/50 group-hover:text-orange-400'
                          }`}>
                            {i + 1}
                          </span>
                        )}
                      </div>

                      {/* Page title */}
                      <span className={`flex-1 text-sm leading-snug transition-colors ${
                        done
                          ? 'text-white/50'
                          : 'text-white/80 group-hover:text-white'
                      }`}>
                        {pg.title}
                      </span>

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
