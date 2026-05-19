'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { usePlanProgress } from '@/app/bitsat-chemistry-revision/usePlanProgress';
import { dayByNumber } from '@/app/bitsat-chemistry-revision/plan/planData';

const ALLOWED_PATHS = new Set<string>(['/', '/bitsat-chemistry-revision']);

export default function BitsatBanner() {
    const pathname = usePathname();
    if (!pathname || !ALLOWED_PATHS.has(pathname)) return null;
    return <BannerInner />;
}

function BannerInner() {
    const { resumeDay, hydrated } = usePlanProgress();
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

    if (!hydrated) return null;

    const hasProgress = resumeDay !== null;
    const day = hasProgress ? dayByNumber(resumeDay) : null;
    const cleanTitle = day?.title.split('—')[0].trim() ?? '';
    const href = hasProgress
        ? `/bitsat-chemistry-revision/plan/day/${resumeDay}`
        : '/bitsat-chemistry-revision/plan/day/1';

    return (
        <div
            className={`fixed top-[48px] left-1/2 -translate-x-1/2 z-40 w-[calc(95%-50px)] max-w-[1230px] transition-all duration-300 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0 pointer-events-none'
            }`}
        >
            <Link
                href={href}
                className="group flex items-center justify-between gap-2.5 px-5 sm:px-7 pt-[30px] pb-2 rounded-full bg-gradient-to-r from-red-500/[0.14] via-red-500/[0.09] to-rose-500/[0.05] backdrop-blur-xl border border-t-0 border-red-500/30 hover:border-red-400/55 hover:from-red-500/20 hover:via-red-500/14 hover:to-rose-500/8 shadow-md shadow-red-950/30 transition-all no-underline"
            >
                <div className="flex items-center gap-2 min-w-0">

                    {hasProgress ? (
                        <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-red-300 shrink-0">
                                BITSAT 2026
                            </span>
                            <span className="hidden sm:inline text-red-500/40 shrink-0">·</span>
                            <span className="text-[13px] text-white font-medium shrink-0">
                                Continue Day {resumeDay}
                            </span>
                            {cleanTitle && (
                                <>
                                    <span className="text-zinc-600 hidden md:inline shrink-0">—</span>
                                    <span className="text-[13px] text-zinc-300 truncate hidden md:inline">
                                        {cleanTitle}
                                    </span>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-red-300 shrink-0">
                                New
                            </span>
                            <span className="hidden sm:inline text-red-500/40 shrink-0">·</span>
                            <span className="text-[13px] text-white font-medium truncate">
                                Check out the 30-day BITSAT Chemistry Revision
                            </span>
                        </div>
                    )}
                </div>

                <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-red-300 group-hover:text-red-200 transition-colors">
                    <span className="hidden sm:inline">{hasProgress ? 'Resume' : 'Open the Plan'}</span>
                    <span className="sm:hidden">{hasProgress ? 'Resume' : 'Open'}</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
            </Link>
        </div>
    );
}
