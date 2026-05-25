/**
 * Shared layout for every /seo/* page — header + sub-nav, then the page body.
 *
 * Auth: the admin middleware already gates everything under apps/admin/ so
 * we don't re-check here. Pages that need the identity (e.g. for "signed in
 * as X" labels) can call requireAdmin() themselves.
 */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SeoSubnav } from '@/features/admin/seo/SeoSubnav';

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#050505]">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80"
          >
            <ArrowLeft size={12} /> Back to admin home
          </Link>
          <div className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-orange-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> SEO Dashboard
          </div>
        </div>
      </div>
      <SeoSubnav />
      {children}
    </div>
  );
}
