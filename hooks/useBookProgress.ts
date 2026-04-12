'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * useBookProgress
 * ----------------
 * Per-book progress state for the digital book reader.
 *
 * Design goals
 *  1. A student navigating pages within the same book must NOT re-fetch their
 *     progress on every page load. The first fetch populates a module-level
 *     cache keyed by book slug; every subsequent reader mount reads from it
 *     synchronously.
 *  2. Concurrent mounts of the same book must share ONE in-flight request —
 *     not N duplicate requests racing each other.
 *  3. `markComplete` applies an optimistic update, POSTs to the server, and
 *     rolls back on failure so the UI never flickers.
 *  4. On cross-tab navigation the cache survives (module state outlives
 *     component instances). Explicit `invalidate(bookSlug)` is exposed so an
 *     admin refresh / logout flow can wipe it if ever needed.
 *
 * This hook replaces the ad-hoc `fetch(...)` inside BookReader's useEffect,
 * which was re-running on every single page navigation.
 */

export interface BookProgressRecord {
  page_slug: string;
  chapter_number: number;
  quiz_score: number;
  completed_at: string;
}

interface CacheEntry {
  records: BookProgressRecord[];
  fetchedAt: number;
}

// Module-level cache shared by every BookReader mount. This survives client
// navigations inside the /books/* segment for as long as the tab lives.
const progressCache = new Map<string, CacheEntry>();

// In-flight request dedupe — if two components mount simultaneously and both
// ask for the same bookSlug, only one HTTP request actually goes out.
const inflight = new Map<string, Promise<BookProgressRecord[]>>();

// Lightweight pub/sub so an optimistic update in one component is reflected
// in any other BookReader instance that happens to be mounted (e.g. the
// milestone overlay and the chapter progress bar on the same page).
type Subscriber = (records: BookProgressRecord[]) => void;
const subscribers = new Map<string, Set<Subscriber>>();

function publish(bookSlug: string, records: BookProgressRecord[]) {
  const set = subscribers.get(bookSlug);
  if (!set) return;
  set.forEach((fn) => {
    try {
      fn(records);
    } catch {
      /* subscriber threw — ignore, don't break other listeners */
    }
  });
}

function subscribe(bookSlug: string, fn: Subscriber): () => void {
  let set = subscribers.get(bookSlug);
  if (!set) {
    set = new Set();
    subscribers.set(bookSlug, set);
  }
  set.add(fn);
  return () => {
    const s = subscribers.get(bookSlug);
    if (!s) return;
    s.delete(fn);
    if (s.size === 0) subscribers.delete(bookSlug);
  };
}

async function fetchProgress(bookSlug: string): Promise<BookProgressRecord[]> {
  const existing = inflight.get(bookSlug);
  if (existing) return existing;

  const p = (async () => {
    const res = await fetch(
      `/api/v2/books/progress?book_slug=${encodeURIComponent(bookSlug)}`,
      // The API sets `Cache-Control: private, no-store`, but the client also
      // explicitly opts out of the browser HTTP cache so stale data from a
      // logged-out session can never bleed in.
      { cache: 'no-store', credentials: 'same-origin' }
    );
    if (!res.ok) throw new Error(`Progress fetch failed: ${res.status}`);
    const body = await res.json();
    if (!body?.success) throw new Error(body?.error ?? 'Progress fetch failed');
    const records: BookProgressRecord[] = Array.isArray(body.data) ? body.data : [];
    progressCache.set(bookSlug, { records, fetchedAt: Date.now() });
    publish(bookSlug, records);
    return records;
  })();

  inflight.set(bookSlug, p);
  try {
    return await p;
  } finally {
    inflight.delete(bookSlug);
  }
}

/**
 * Drop the cached progress for a book. Used when the user logs out, or when
 * you explicitly need to re-pull from the server.
 */
export function invalidateBookProgress(bookSlug?: string) {
  if (bookSlug) {
    progressCache.delete(bookSlug);
    inflight.delete(bookSlug);
  } else {
    progressCache.clear();
    inflight.clear();
  }
}

export interface UseBookProgressResult {
  /** All completed pages for this book. */
  records: BookProgressRecord[];
  /** Fast membership check — rebuilt whenever records change. */
  completedSlugs: Set<string>;
  /** True while the first fetch for this book is in flight. */
  loading: boolean;
  /** Non-null if the last fetch threw. */
  error: Error | null;
  /**
   * Mark a page complete. Applies an optimistic update immediately and POSTs
   * to the server in the background. Rolls back on failure. No-op if the page
   * is already in the completed set (idempotent).
   */
  markComplete: (args: {
    pageSlug: string;
    chapterNumber: number;
    quizScore: number;
  }) => Promise<boolean>;
  /** Force a refetch from the server, bypassing the module-level cache. */
  refresh: () => Promise<void>;
}

export function useBookProgress(bookSlug: string): UseBookProgressResult {
  // Seed from cache if we already have data for this book — no loading flash.
  const cached = progressCache.get(bookSlug);
  const [records, setRecords] = useState<BookProgressRecord[]>(cached?.records ?? []);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<Error | null>(null);

  // Keep a ref so callbacks always see the current list without re-creating.
  const recordsRef = useRef(records);
  recordsRef.current = records;

  // Subscribe to cross-component updates for this book.
  useEffect(() => {
    const unsub = subscribe(bookSlug, (next) => setRecords(next));
    return unsub;
  }, [bookSlug]);

  // First-time fetch (or refetch if cache was invalidated elsewhere).
  useEffect(() => {
    let cancelled = false;
    if (progressCache.has(bookSlug)) {
      // Cache hit — mirror it into local state in case this instance was
      // instantiated before the subscriber wired up.
      setRecords(progressCache.get(bookSlug)!.records);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProgress(bookSlug)
      .then((next) => {
        if (cancelled) return;
        setRecords(next);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookSlug]);

  const markComplete = useCallback(
    async ({
      pageSlug,
      chapterNumber,
      quizScore,
    }: {
      pageSlug: string;
      chapterNumber: number;
      quizScore: number;
    }): Promise<boolean> => {
      const current = recordsRef.current;
      if (current.some((r) => r.page_slug === pageSlug)) return true;

      const optimistic: BookProgressRecord = {
        page_slug: pageSlug,
        chapter_number: chapterNumber,
        quiz_score: quizScore,
        completed_at: new Date().toISOString(),
      };
      const next = [...current, optimistic];
      progressCache.set(bookSlug, { records: next, fetchedAt: Date.now() });
      publish(bookSlug, next);

      try {
        const res = await fetch('/api/v2/books/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            book_slug: bookSlug,
            chapter_number: chapterNumber,
            page_slug: pageSlug,
            quiz_score: quizScore,
          }),
        });
        if (!res.ok) throw new Error(`Progress POST failed: ${res.status}`);
        const body = await res.json();
        if (!body?.success) throw new Error(body?.error ?? 'Progress POST failed');
        return true;
      } catch (err) {
        // Roll back the optimistic insert so the UI stays honest.
        const rolled = recordsRef.current.filter((r) => r.page_slug !== pageSlug);
        progressCache.set(bookSlug, { records: rolled, fetchedAt: Date.now() });
        publish(bookSlug, rolled);
        setError(err as Error);
        return false;
      }
    },
    [bookSlug]
  );

  const refresh = useCallback(async () => {
    invalidateBookProgress(bookSlug);
    setLoading(true);
    try {
      const next = await fetchProgress(bookSlug);
      setRecords(next);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [bookSlug]);

  // Derived Set for O(1) membership checks — rebuilt only when records change.
  const completedSlugs = useRefSet(records);

  return { records, completedSlugs, loading, error, markComplete, refresh };
}

// Small helper — builds and memoises a Set<string> of page slugs from the
// records array. useMemo equivalent without pulling in the dep.
function useRefSet(records: BookProgressRecord[]): Set<string> {
  const lastRef = useRef<{ records: BookProgressRecord[]; set: Set<string> }>({
    records: [],
    set: new Set(),
  });
  if (lastRef.current.records !== records) {
    lastRef.current = {
      records,
      set: new Set(records.map((r) => r.page_slug)),
    };
  }
  return lastRef.current.set;
}
