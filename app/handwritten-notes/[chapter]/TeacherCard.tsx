import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Static "Written by Paaras Sir" card. Single canonical author for now —
// expand to a prop-driven component when the notes get multi-author.

export default function TeacherCard() {
    return (
        <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5">
            <div
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border text-[28px] font-semibold leading-none text-white"
                style={{
                    background: 'linear-gradient(135deg, #2b3445, #1b2333)',
                    borderColor: 'rgba(255,255,255,0.10)',
                    fontFamily: 'var(--font-kalam), cursive',
                }}
            >
                P
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[16px] font-semibold text-white">Paaras Sir</div>
                <div className="text-[13px] text-zinc-500">Founder · Canvas Classes · 14 years JEE/NEET</div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-zinc-300">
                    <span>
                        <b className="font-semibold text-white">AIR 1-10</b> mentor
                    </span>
                    <span>
                        <b className="font-semibold text-white">42k+</b> students mentored
                    </span>
                    <span>
                        <b className="font-semibold text-white">YouTube</b> 200k+ subs
                    </span>
                </div>
            </div>
            <Link
                href="/handwritten-notes"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.04] px-4 text-[13px] font-semibold text-zinc-200 transition-colors hover:bg-white/[0.08]"
            >
                See all chapters
                <ArrowRight size={13} />
            </Link>
        </div>
    );
}
