'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Homepage promo banner. Despite the filename, it's a single slim bar with two
// CTA chips: the College Predictor (JEE/NEET) and the BITSAT 2026 hub (/bitsat).
// Homepage-only — each tool has its own page where the banner is redundant.
const ALLOWED_PATHS = new Set<string>(['/']);

export default function CollegePredictorBanner() {
    const pathname = usePathname();
    if (!pathname || !ALLOWED_PATHS.has(pathname)) return null;
    return <BannerInner />;
}

// Why the scroll-aware show/hide:
//   The banner sits below the floating navbar (top: 48px) and would
//   compete with the page hero for attention while a user is reading.
//   Hide on scroll-down past ~100px so it gets out of the way, show on
//   scroll-up so it's discoverable when the user goes back to the hero.
//   Same pattern the archived BitsatBanner used; UX is consistent for
//   anyone who saw the site during the BITSAT 2026 window.
function BannerInner() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const cur = window.scrollY;
            if (cur < 20) setIsVisible(true);
            else if (cur > lastScrollY && cur > 100) setIsVisible(false);
            else if (cur < lastScrollY) setIsVisible(true);
            lastScrollY = cur;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-[48px] left-1/2 -translate-x-1/2 z-40 w-[calc(95%-50px)] max-w-[1230px] transition-all duration-300 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0 pointer-events-none'
            }`}
        >
            {/* One slim promo bar with two CTA chips — College Predictor +
                BITSAT hub — instead of two stacked bars. The pill keeps the
                under-navbar tuck (pt-30, border-t-0). */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-[42px] pb-2.5 rounded-full bg-gradient-to-r from-orange-500/[0.12] via-amber-500/[0.08] to-amber-400/[0.04] backdrop-blur-xl border border-t-0 border-orange-500/25 shadow-md shadow-amber-950/30">
                {/* Lead label */}
                <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 shrink-0">
                        New
                    </span>
                    <span className="hidden sm:inline text-amber-500/40 shrink-0">·</span>
                    <span className="text-[12px] sm:text-[13px] font-medium text-white/90 truncate">
                        <span className="hidden md:inline">College admission tools are live</span>
                        <span className="md:hidden">Admissions</span>
                    </span>
                </div>

                {/* CTA text links (no buttons) — matches the original banner's
                    "Open the Predictor →" affordance. */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 text-[11px] sm:text-[12px] font-semibold">
                    <Link
                        href="/college-predictor"
                        className="group inline-flex items-center gap-1 text-orange-300 hover:text-orange-200 transition-colors no-underline"
                    >
                        <span className="hidden sm:inline">JEE / NEET Predictor</span>
                        <span className="sm:hidden">Predictor</span>
                        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <span className="text-white/15" aria-hidden>·</span>
                    <Link
                        href="/bitsat"
                        className="group inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors no-underline"
                    >
                        BITSAT 2026
                        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
