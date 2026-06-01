'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Where the banner is allowed to render. Homepage only — College Predictor
// has its own page; showing the banner there would be redundant.
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
            <Link
                href="/college-predictor"
                className="group flex items-center justify-between gap-2.5 px-5 sm:px-7 pt-[30px] pb-2 rounded-full bg-gradient-to-r from-orange-500/[0.14] via-amber-500/[0.09] to-amber-400/[0.05] backdrop-blur-xl border border-t-0 border-orange-500/30 hover:border-orange-400/55 hover:from-orange-500/20 hover:via-amber-500/14 hover:to-amber-400/8 shadow-md shadow-amber-950/30 transition-all no-underline"
            >
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-orange-300 shrink-0">
                            New
                        </span>
                        <span className="hidden sm:inline text-orange-500/40 shrink-0">·</span>
                        <span className="text-[13px] text-white font-medium truncate">
                            <span className="hidden md:inline">Predict your colleges based on your </span>
                            <span className="md:hidden">College Predictor — </span>
                            JEE / NEET rank
                        </span>
                    </div>
                </div>

                <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">
                    <span className="hidden sm:inline">Open the Predictor</span>
                    <span className="sm:hidden">Open</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
            </Link>
        </div>
    );
}
