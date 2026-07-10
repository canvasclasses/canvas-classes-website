'use client';

import { useEffect, useState } from 'react';
import { HabitTrackerBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';
import { readPractice, writePractice, todayISO } from './practiceStorage';

// Shared calm Live Books accent (globals.css --book-accent). DONE stays green —
// it's a semantic "completed" signal, not a UI accent.
const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_DIM = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const DONE = '#10b981';
const DONE_DIM = 'rgba(16,185,129,0.15)';

interface TrackerState {
  checks: string[]; // ISO dates (YYYY-MM-DD), one per completed day, in order
}

export default function HabitTrackerRenderer({ block }: { block: HabitTrackerBlock }) {
  const [checks, setChecks] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChecks(readPractice<TrackerState>(block.id)?.checks ?? []);
    setLoaded(true);
  }, [block.id]);

  const today = todayISO();
  const doneCount = checks.length;
  const allDone = doneCount >= block.duration_days;
  const checkedToday = checks.includes(today);
  const canCheckToday = loaded && !allDone && !checkedToday;

  // Missed-day detection: last check exists and is before yesterday
  const lastCheck = checks[checks.length - 1];
  const missedGap = (() => {
    if (!lastCheck || checkedToday || allDone) return false;
    const last = new Date(lastCheck + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    return (now.getTime() - last.getTime()) / 86400000 > 1;
  })();

  function checkIn() {
    if (!canCheckToday) return;
    const next = [...checks, today];
    setChecks(next);
    writePractice<TrackerState>(block.id, { checks: next });
  }

  const todaysTask =
    block.day_labels && block.day_labels[doneCount] ? block.day_labels[doneCount] : block.habit;

  return (
    <div
      className="my-8 rounded-2xl px-5 py-5 sm:px-6"
      style={{ background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT }}
        >
          {block.duration_days}-Day Challenge
        </span>
        <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest tabular-nums">
          {doneCount} / {block.duration_days} days
        </span>
      </div>

      <h3 className="text-lg font-bold text-white/90 mb-1">{block.title}</h3>
      {block.why && (
        <div className="mb-3">
          <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/55">
            {block.why}
          </InlineMarkdown>
        </div>
      )}

      {/* Day cells */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: block.duration_days }, (_, i) => {
          const isDone = i < doneCount;
          const isNext = i === doneCount && !allDone;
          return (
            <div
              key={i}
              className="flex items-center justify-center rounded-xl text-xs font-semibold tabular-nums"
              style={{
                width: 42,
                height: 42,
                background: isDone ? DONE_DIM : isNext ? ACCENT_DIM : 'rgba(255,255,255,0.03)',
                border: isDone
                  ? `1.5px solid ${DONE}`
                  : isNext
                    ? `1.5px solid ${ACCENT}`
                    : '1px solid rgba(255,255,255,0.07)',
                color: isDone ? DONE : isNext ? ACCENT : 'rgba(255,255,255,0.25)',
              }}
            >
              {isDone ? '✓' : i + 1}
            </div>
          );
        })}
      </div>

      {/* Today's action */}
      {!allDone && (
        <div className="mb-4 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: ACCENT }}>
            {checkedToday ? 'Done for today' : `Day ${doneCount + 1}`}
          </p>
          <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/80">
            {todaysTask}
          </InlineMarkdown>
        </div>
      )}

      {missedGap && (
        <p className="text-xs text-white/40 mb-3 italic">
          Missed a day? No guilt — the streak that matters is the one you restart. Continue today.
        </p>
      )}

      {/* Action row */}
      {allDone ? (
        <p className="text-sm font-semibold" style={{ color: DONE }}>
          Challenge complete — {block.duration_days} days. That consistency is the real skill.
        </p>
      ) : checkedToday ? (
        <p className="text-xs text-white/30">
          Checked in. Come back tomorrow for day {doneCount + 1}.
        </p>
      ) : (
        <button
          onClick={checkIn}
          disabled={!canCheckToday}
          className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
          style={{
            background: canCheckToday ? ACCENT_DIM : 'rgba(255,255,255,0.04)',
            color: canCheckToday ? ACCENT : 'rgba(255,255,255,0.2)',
            border: `1.5px solid ${canCheckToday ? ACCENT : 'rgba(255,255,255,0.06)'}`,
            cursor: canCheckToday ? 'pointer' : 'not-allowed',
          }}
        >
          I did it today
        </button>
      )}
    </div>
  );
}
