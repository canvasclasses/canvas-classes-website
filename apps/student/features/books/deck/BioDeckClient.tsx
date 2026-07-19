'use client';

import { useState } from 'react';
import InteractiveImageBlockRenderer from '@canvas/book-renderer/blocks/InteractiveImageBlockRenderer';
import { InteractiveImageBlock } from '@canvas/data/types/books';
import {
  LEVEL_XP,
  REVIEW_INTERVALS_DAYS,
  deckSummary,
  sprintMastery,
  sprintStatus,
  toISODate,
} from '@canvas/data/books/labelSprintDeck';
import { useBookDeck } from './useBookDeck';

export interface DeckSprint {
  id: string; // interactive_image block id
  block: InteractiveImageBlock;
  pageTitle: string;
  pageSlug: string;
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  new:       { label: 'New',       cls: 'text-orange-300 bg-orange-500/15 border-orange-500/30' },
  due:       { label: 'Due',       cls: 'text-orange-300 bg-orange-500/15 border-orange-500/30' },
  scheduled: { label: 'Scheduled', cls: 'text-white/45 bg-white/5 border-white/10' },
  mastered:  { label: 'Mastered',  cls: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/30' },
};

export default function BioDeckClient({
  bookId,
  bookTitle,
  sprints,
}: {
  bookId: string;
  bookTitle: string;
  sprints: DeckSprint[];
}) {
  const { deck, recordResult } = useBookDeck(bookId);
  const [playId, setPlayId] = useState<string | null>(null);

  const today = toISODate(new Date());
  const ids = sprints.map((s) => s.id);
  const summary = deckSummary(deck, ids, today);
  const playing = sprints.find((s) => s.id === playId) ?? null;
  const firstDue = sprints.find((s) => {
    const st = sprintStatus(deck.sprints[s.id], today);
    return st === 'new' || st === 'due';
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-serif italic text-white/40">{bookTitle}</p>
          <h1 className="text-xl font-bold tracking-tight">Bio Deck</h1>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--book-surface)] px-3 py-1.5 font-mono text-sm font-semibold text-amber-400">
          🔥 {deck.streak}
        </span>
      </div>

      {/* Due card */}
      <div className="mt-4 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#221a12] to-[var(--book-surface)] p-5">
        <div className="text-5xl font-extrabold leading-none tabular-nums">{summary.due}</div>
        <div className="mt-1 text-sm text-white/50">
          {summary.due === 0 ? 'all caught up — nothing due' : 'diagrams due for review'}
        </div>
        {firstDue && (
          <button
            onClick={() => setPlayId(firstDue.id)}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-black transition hover:brightness-110"
          >
            Start review →
          </button>
        )}
      </div>

      {/* XP */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-xs text-white/45">
          <span>Level <b className="text-white/80">{deck.level}</b></span>
          <span className="font-mono">{deck.xp} / {LEVEL_XP} XP</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-[width] duration-500"
            style={{ width: `${Math.round((deck.xp / LEVEL_XP) * 100)}%` }}
          />
        </div>
      </div>

      {/* Sprint list */}
      <p className="mt-6 mb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-white/30">
        Label Sprints · {summary.total}
      </p>
      <div className="space-y-2">
        {sprints.map((s) => {
          const prog = deck.sprints[s.id];
          const status = sprintStatus(prog, today);
          const chip = STATUS_STYLE[status];
          const mastery = sprintMastery(prog);
          return (
            <button
              key={s.id}
              onClick={() => setPlayId(s.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-[var(--book-surface)] p-3 text-left transition hover:border-white/15"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.pageTitle}</p>
                <p className="truncate text-xs text-white/40">{s.block.alt}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-orange-500/70" style={{ width: `${mastery}%` }} />
                  </span>
                  <span className="font-mono text-[11px] text-white/35">{mastery}%</span>
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${chip.cls}`}>
                {chip.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Spacing-curve footnote */}
      <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-[var(--book-surface)] px-4 py-3">
        <p className="mb-2 text-xs text-white/45">Every diagram you clear comes back on a spacing curve, so it sticks.</p>
        <div className="flex items-center gap-1 font-mono text-[11px] text-white/35">
          {REVIEW_INTERVALS_DAYS.map((d, i) => (
            <span key={d} className="flex items-center gap-1">
              <span className="rounded bg-white/8 px-1.5 py-0.5">{d}d</span>
              {i < REVIEW_INTERVALS_DAYS.length - 1 && <span className="text-white/20">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Play modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setPlayId(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[var(--book-surface)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold">{playing.pageTitle}</p>
              <button
                onClick={() => setPlayId(null)}
                aria-label="Close"
                className="text-lg leading-none text-white/45 hover:text-white/90"
              >
                ✕
              </button>
            </div>
            <InteractiveImageBlockRenderer
              key={playing.id}
              block={playing.block}
              autoQuiz
              onQuizComplete={(acc) => recordResult(playing.id, acc)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
