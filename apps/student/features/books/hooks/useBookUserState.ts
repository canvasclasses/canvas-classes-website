'use client';

import { useEffect } from 'react';
import type { BookProgressRecord } from './useBookProgress';
import type { BookBookmark } from './useBookBookmarks';
import { seedProgressCache } from './useBookProgress';
import { seedBookmarksCache } from './useBookBookmarks';

/*
 * useBookUserState
 * ----------------
 * Kicks off a single combined fetch for progress + bookmarks on the current
 * book, then seeds the individual hooks' module-level caches. This collapses
 * what used to be two separate round-trips (blocking hydration) into one.
 *
 * The individual hooks (useBookProgress / useBookBookmarks) cooperate via
 * `getCombinedInflight(bookSlug)` so that when they mount in the same tick
 * as this prefetch, they await the shared promise instead of firing their
 * own redundant requests.
 */

interface UserStatePayload {
  progress: BookProgressRecord[];
  bookmarks: BookBookmark[];
}

// Shared in-flight tracker — individual hooks read this to avoid
// double-fetching when the combined endpoint is already in flight.
const inflight = new Map<string, Promise<UserStatePayload | null>>();
const attempted = new Set<string>();

export function getCombinedInflight(bookSlug: string): Promise<UserStatePayload | null> | undefined {
  return inflight.get(bookSlug);
}

async function fetchCombined(bookSlug: string): Promise<UserStatePayload | null> {
  const existing = inflight.get(bookSlug);
  if (existing) return existing;

  const p = (async (): Promise<UserStatePayload | null> => {
    try {
      const res = await fetch(
        `/api/v2/books/user-state?book_slug=${encodeURIComponent(bookSlug)}`,
        { cache: 'no-store', credentials: 'same-origin' }
      );
      if (!res.ok) return null;
      const body = await res.json();
      if (!body?.success || !body.data) return null;
      const progress: BookProgressRecord[] = Array.isArray(body.data.progress) ? body.data.progress : [];
      const bookmarks: BookBookmark[] = Array.isArray(body.data.bookmarks) ? body.data.bookmarks : [];
      // Seed both caches synchronously inside the same microtask so any
      // awaiter sees populated state immediately after `await` returns.
      seedProgressCache(bookSlug, progress);
      seedBookmarksCache(bookSlug, bookmarks);
      return { progress, bookmarks };
    } catch {
      return null;
    }
  })();

  inflight.set(bookSlug, p);
  try {
    return await p;
  } finally {
    inflight.delete(bookSlug);
  }
}

export function useBookUserState(bookSlug: string): void {
  useEffect(() => {
    if (attempted.has(bookSlug)) return;
    attempted.add(bookSlug);
    // Fire and forget — individual hooks will observe the seeded caches,
    // and if the combined fetch fails they fall back to their own fetches.
    fetchCombined(bookSlug).then((payload) => {
      if (!payload) attempted.delete(bookSlug);
    });
  }, [bookSlug]);
}
