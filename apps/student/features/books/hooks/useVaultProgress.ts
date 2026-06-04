'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CardProgress,
  QualityRating,
  createInitialProgress,
  calculateNextReview,
  isCardDue,
} from '@/lib/spacedRepetition';
import type { VaultWord } from '@canvas/data/books/vocabulary';

/**
 * Word Vault progress hook — spaced-repetition state for Live Books vocabulary.
 *
 * Deliberately a *sibling* of useCardProgress, not a reuse of it: the chemistry
 * flashcard hook is bound to its own deck-shaped sync layer and storage key.
 * Mixing vault words into that store would pollute the chemistry deck's stats.
 * Here we keep a small, self-contained store: localStorage cache + direct sync
 * to /api/v2/user/word-vault. The FSRS engine itself is fully reused.
 */

interface ProgressMap {
  [wordId: string]: CardProgress;
}

const STORAGE_PREFIX = 'canvas_word_vault_';
const SYNC_DEBOUNCE_MS = 1500;

function storageKey(bookSlug: string): string {
  return `${STORAGE_PREFIX}${bookSlug}`;
}

function readLocal(bookSlug: string): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(storageKey(bookSlug));
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeLocal(bookSlug: string, map: ProgressMap) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(bookSlug), JSON.stringify(map));
  } catch (err) {
    console.error('Word Vault localStorage write failed:', err);
  }
}

/** Merge server cards into local, newest `updatedAt` wins. */
function mergeByUpdatedAt(local: ProgressMap, remote: ProgressMap): ProgressMap {
  const out: ProgressMap = { ...local };
  for (const [id, card] of Object.entries(remote)) {
    const existing = out[id];
    if (!existing || (card.updatedAt ?? 0) >= (existing.updatedAt ?? 0)) {
      out[id] = card;
    }
  }
  return out;
}

export interface UseVaultProgress {
  cards: ProgressMap;
  isLoaded: boolean;
  savedCount: number;
  hasWord: (wordId: string) => boolean;
  /** Add a word to the vault. Returns true if it was newly added. */
  saveWord: (word: VaultWord) => boolean;
  /** Score a review and reschedule the word. */
  reviewWord: (wordId: string, quality: QualityRating) => void;
  /** Given the full harvested deck, the subset due for review today (saved words only). */
  dueWords: (deck: VaultWord[]) => VaultWord[];
}

export function useVaultProgress(bookSlug: string): UseVaultProgress {
  const [cards, setCards] = useState<ProgressMap>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load: localStorage first (instant), then merge server state.
  useEffect(() => {
    let cancelled = false;
    const local = readLocal(bookSlug);
    setCards(local);
    setIsLoaded(true);

    (async () => {
      try {
        const res = await fetch('/api/v2/user/word-vault', { credentials: 'same-origin' });
        if (!res.ok) return; // 401 (anon) or error → stay local-only
        const body = await res.json();
        const remote = (body?.cards ?? {}) as ProgressMap;
        if (cancelled || Object.keys(remote).length === 0) return;
        setCards((prev) => {
          const merged = mergeByUpdatedAt(prev, remote);
          writeLocal(bookSlug, merged);
          return merged;
        });
      } catch {
        /* offline — local cache stands */
      }
    })();

    return () => { cancelled = true; };
  }, [bookSlug]);

  // Debounced push of changed cards to the server.
  const scheduleSync = useCallback((map: ProgressMap) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      const ids = Array.from(pendingRef.current);
      if (ids.length === 0) return;
      const payload = ids.map((id) => map[id]).filter(Boolean);
      pendingRef.current.clear();
      try {
        await fetch('/api/v2/user/word-vault', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cards: payload }),
        });
      } catch {
        // Re-queue on failure; the next change flushes them.
        ids.forEach((id) => pendingRef.current.add(id));
      }
    }, SYNC_DEBOUNCE_MS);
  }, []);

  const commit = useCallback((next: ProgressMap, changedId: string) => {
    pendingRef.current.add(changedId);
    writeLocal(bookSlug, next);
    scheduleSync(next);
  }, [bookSlug, scheduleSync]);

  const saveWord = useCallback((word: VaultWord): boolean => {
    let added = false;
    setCards((prev) => {
      if (prev[word.wordId]) return prev; // already saved — no-op
      added = true;
      const next = { ...prev, [word.wordId]: createInitialProgress(word.wordId) };
      commit(next, word.wordId);
      return next;
    });
    return added;
  }, [commit]);

  const reviewWord = useCallback((wordId: string, quality: QualityRating) => {
    setCards((prev) => {
      const current = prev[wordId] ?? createInitialProgress(wordId);
      const updated = calculateNextReview(current, quality);
      const next = { ...prev, [wordId]: updated };
      commit(next, wordId);
      return next;
    });
  }, [commit]);

  const hasWord = useCallback((wordId: string) => !!cards[wordId], [cards]);

  const dueWords = useCallback((deck: VaultWord[]): VaultWord[] => {
    return deck.filter((w) => {
      const card = cards[w.wordId];
      return card && isCardDue(card);
    });
  }, [cards]);

  return {
    cards,
    isLoaded,
    savedCount: Object.keys(cards).length,
    hasWord,
    saveWord,
    reviewWord,
    dueWords,
  };
}
