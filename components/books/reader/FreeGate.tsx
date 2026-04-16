'use client';

import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Brain, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/client';

const COOKIE_NAME = 'books_viewed';
const FREE_PAGE_LIMIT = 2;

/**
 * Reads the per-book page view counts from a JSON cookie.
 * Shape: { "book-slug": ["page-slug-1", "page-slug-2"] }
 */
function getViewedPages(): Record<string, string[]> {
  if (typeof document === 'undefined') return {};
  try {
    const raw = document.cookie
      .split('; ')
      .find(c => c.startsWith(`${COOKIE_NAME}=`));
    if (!raw) return {};
    return JSON.parse(decodeURIComponent(raw.split('=').slice(1).join('=')));
  } catch {
    return {};
  }
}

function setViewedPages(data: Record<string, string[]>) {
  const encoded = encodeURIComponent(JSON.stringify(data));
  // 30-day expiry — resets naturally, giving returning visitors another free taste
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encoded}; path=/; expires=${expires}; SameSite=Lax`;
}

/**
 * Records a page view for a book and returns the total unique pages viewed.
 */
function recordPageView(bookSlug: string, pageSlug: string): number {
  const data = getViewedPages();
  const viewed = data[bookSlug] ?? [];
  if (!viewed.includes(pageSlug)) {
    viewed.push(pageSlug);
    data[bookSlug] = viewed;
    setViewedPages(data);
  }
  return viewed.length;
}

interface Props {
  bookSlug: string;
  pageSlug: string;
  basePath?: string;
}

/**
 * Metered access gate for live books.
 * - First 2 pages per book: free, no login required
 * - Page 3+: frosted overlay asking to sign in
 * - Authenticated users never see the gate
 */
export default function FreeGate({ bookSlug, pageSlug, basePath }: Props) {
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // Check if user is authenticated
      const supabase = createClient();
      if (supabase) {
        try {
          const { data } = await supabase.auth.getUser();
          if (data.user) return; // Authenticated — never gate
        } catch {
          // Auth check failed — treat as unauthenticated
        }
      }

      // Count page views per book
      const viewCount = recordPageView(bookSlug, pageSlug);
      if (!cancelled && viewCount > FREE_PAGE_LIMIT) {
        setShowGate(true);
      }
    }

    check();
    return () => { cancelled = true; };
  }, [bookSlug, pageSlug]);

  if (!showGate) return null;

  const returnUrl = basePath ? `${basePath}/${pageSlug}` : `/books/${bookSlug}/${pageSlug}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop — blurs the page content beneath */}
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />

      {/* Gate card */}
      <div className="relative w-full max-w-md mx-4 mb-0 sm:mb-0 bg-[#0B0F15] border border-white/10
        rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl">

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
          flex items-center justify-center mx-auto mb-5">
          <BookOpen size={24} className="text-black" />
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-2">
          You&apos;re enjoying this book!
        </h2>
        <p className="text-sm text-white/50 text-center mb-6">
          Create a free account to continue reading and unlock all features.
        </p>

        {/* Value props */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-white/60">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Track your progress across all chapters</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <Brain size={16} className="text-violet-400 shrink-0" />
            <span>Adaptive quizzes that learn your weak spots</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <Gamepad2 size={16} className="text-sky-400 shrink-0" />
            <span>Interactive simulations and 3D molecules</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/login?next=${encodeURIComponent(returnUrl)}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
            bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
            hover:opacity-90 transition-opacity mb-3"
        >
          Sign in to continue <ArrowRight size={15} />
        </Link>

        <p className="text-[11px] text-white/25 text-center">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
}
