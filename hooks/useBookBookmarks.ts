'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface BookBookmark {
  page_slug: string;
  page_title: string;
  chapter_number: number;
  created_at: string;
}

// Module-level cache (same pattern as useBookProgress)
const cache = new Map<string, BookBookmark[]>();
const inflight = new Map<string, Promise<BookBookmark[]>>();

async function fetchBookmarks(bookSlug: string): Promise<BookBookmark[]> {
  const existing = inflight.get(bookSlug);
  if (existing) return existing;

  const p = (async () => {
    const res = await fetch(
      `/api/v2/books/bookmarks?book_slug=${encodeURIComponent(bookSlug)}`,
      { cache: 'no-store', credentials: 'same-origin' }
    );
    // 401 = not logged in — return empty (bookmarks require auth)
    if (res.status === 401) { cache.set(bookSlug, []); return []; }
    if (!res.ok) throw new Error(`Bookmark fetch failed: ${res.status}`);
    const body = await res.json();
    const data: BookBookmark[] = Array.isArray(body.data) ? body.data : [];
    cache.set(bookSlug, data);
    return data;
  })();

  inflight.set(bookSlug, p);
  try { return await p; } finally { inflight.delete(bookSlug); }
}

export function useBookBookmarks(bookSlug: string) {
  const cached = cache.get(bookSlug);
  const [bookmarks, setBookmarks] = useState<BookBookmark[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const bookmarksRef = useRef(bookmarks);
  bookmarksRef.current = bookmarks;

  useEffect(() => {
    let cancelled = false;
    if (cache.has(bookSlug)) {
      setBookmarks(cache.get(bookSlug)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchBookmarks(bookSlug)
      .then(data => { if (!cancelled) { setBookmarks(data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [bookSlug]);

  const bookmarkedSlugs = useRefSet(bookmarks);

  const toggleBookmark = useCallback(async (
    pageSlug: string,
    pageTitle: string,
    chapterNumber: number
  ): Promise<'added' | 'removed'> => {
    const current = bookmarksRef.current;
    const exists = current.some(b => b.page_slug === pageSlug);

    // Optimistic update
    const next = exists
      ? current.filter(b => b.page_slug !== pageSlug)
      : [...current, { page_slug: pageSlug, page_title: pageTitle, chapter_number: chapterNumber, created_at: new Date().toISOString() }];
    setBookmarks(next);
    cache.set(bookSlug, next);

    try {
      const res = await fetch('/api/v2/books/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ book_slug: bookSlug, page_slug: pageSlug, page_title: pageTitle, chapter_number: chapterNumber }),
      });
      if (!res.ok) throw new Error('toggle failed');
      const body = await res.json();
      return body.action as 'added' | 'removed';
    } catch {
      // Rollback
      setBookmarks(current);
      cache.set(bookSlug, current);
      return exists ? 'added' : 'removed';
    }
  }, [bookSlug]);

  return { bookmarks, bookmarkedSlugs, loading, toggleBookmark };
}

function useRefSet(bookmarks: BookBookmark[]): Set<string> {
  const lastRef = useRef<{ bookmarks: BookBookmark[]; set: Set<string> }>({
    bookmarks: [],
    set: new Set(),
  });
  if (lastRef.current.bookmarks !== bookmarks) {
    lastRef.current = {
      bookmarks,
      set: new Set(bookmarks.map(b => b.page_slug)),
    };
  }
  return lastRef.current.set;
}
