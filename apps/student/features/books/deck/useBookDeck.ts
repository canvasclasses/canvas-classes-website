'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DeckState,
  emptyDeck,
  recordSprintResult,
  toISODate,
} from '@canvas/data/books/labelSprintDeck';

// Per-device, per-book spaced-repetition deck for Label Sprints. State lives in
// localStorage (no account needed) — matching the per-device precedent set by
// the reading-mode theme and Life Skills. Graduating to a cross-device
// Mongo-backed deck is a later, additive step.

const storageKey = (bookId: string) => `bioDeck:v1:${bookId}`;

export function useBookDeck(bookId: string) {
  const [deck, setDeck] = useState<DeckState>(emptyDeck);
  // Start unhydrated so SSR and first client render agree (empty deck), then
  // load the real state after mount — no hydration mismatch.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(bookId));
      if (raw) setDeck(JSON.parse(raw) as DeckState);
    } catch {
      /* corrupt/blocked storage — fall back to an empty deck */
    }
    setHydrated(true);
  }, [bookId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey(bookId), JSON.stringify(deck));
    } catch {
      /* storage full/blocked — progress is best-effort */
    }
  }, [deck, hydrated, bookId]);

  const recordResult = useCallback((sprintId: string, accuracy: number) => {
    setDeck((d) => recordSprintResult(d, sprintId, accuracy, toISODate(new Date())));
  }, []);

  return { deck, hydrated, recordResult };
}
