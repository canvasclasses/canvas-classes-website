'use client';

import { useEffect, useState } from 'react';

export interface BookStats {
  pages_completed: number;
  streak_days: number;
  avg_quiz_score: number | null;
  last_completed: { page_slug: string; completed_at: string } | null;
}

const cache = new Map<string, BookStats>();

export function useBookStats(bookSlug: string) {
  const cached = cache.get(bookSlug);
  const [stats, setStats] = useState<BookStats | null>(cached ?? null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    if (cache.has(bookSlug)) {
      setStats(cache.get(bookSlug)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/v2/books/stats?book_slug=${encodeURIComponent(bookSlug)}`, {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then(res => {
        // 401 = not logged in — stats require auth, silently skip
        if (res.status === 401) return { success: false };
        return res.json();
      })
      .then(body => {
        if (cancelled) return;
        if (body?.success && body.data) {
          cache.set(bookSlug, body.data);
          setStats(body.data);
        }
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [bookSlug]);

  return { stats, loading };
}
