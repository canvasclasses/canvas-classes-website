'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

/*
 * Compact, intent-grouped footer.
 *
 * Replaces the previous 3-column "wall of links" with:
 *   - One brand row (logo + tagline + social icons inline)
 *   - Three labelled pill bars grouped by user intent: Learn / Tools / Plan
 *   - One slim bottom bar (copyright + legal + made-with)
 *
 * Same set of internal links preserved (footer cross-linking is a real SEO
 * signal — don't quietly drop pages), but the visual real-estate is roughly
 * halved by switching from vertical lists to wrapping pill chips. Pages with
 * lots of content below the fold benefit the most.
 */

const TelegramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

type LinkItem = { label: string; href: string };

const LEARN_LINKS: LinkItem[] = [
    { label: 'JEE / NEET Prep', href: '/detailed-lectures' },
    { label: 'NCERT Solutions', href: '/ncert-solutions' },
    { label: 'NCERT PDFs', href: '/download-ncert-books' },
    { label: 'Notes', href: '/handwritten-notes' },
    { label: 'One Shots', href: '/one-shot-lectures' },
    { label: 'Question Bank', href: '/chemistry-questions' },
    { label: 'Blog', href: '/blog' },
];

const TOOLS_LINKS: LinkItem[] = [
    { label: 'Periodic Table', href: '/interactive-periodic-table' },
    { label: 'Flashcards', href: '/chemistry-flashcards' },
    { label: 'Salt Analysis', href: '/salt-analysis' },
    { label: 'Circuit Breaker', href: '/assertion-reason' },
    { label: 'Ksp Calculator', href: '/solubility-product-ksp-calculator' },
    { label: 'The Crucible', href: '/the-crucible' },
];

const PLAN_LINKS: LinkItem[] = [
    { label: 'College Predictor', href: '/college-predictor' },
    { label: 'Career Guide', href: '/career-guide' },
    { label: 'Career Planning', href: '/career-planning' },
];

function PillBar({ label, items }: { label: string; items: LinkItem[] }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35 sm:w-14 sm:shrink-0 sm:pt-[5px]">
                {label}
            </div>
            <div className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                    <Link
                        key={it.href}
                        href={it.href}
                        className="px-2.5 py-1 rounded-full text-[12.5px] text-zinc-400 bg-white/[0.025] border border-white/[0.06] hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors"
                    >
                        {it.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function Footer() {
    const pathname = usePathname();
    const isCrucibleAdmin = pathname?.startsWith('/the-crucible/admin') || pathname?.startsWith('/crucible/admin');
    const isOrganicMaster = pathname === '/organic-chemistry-hub';
    const isCrucibleLanding = pathname === '/the-crucible';
    const currentYear = new Date().getFullYear();

    if (isCrucibleAdmin || isOrganicMaster || isCrucibleLanding) return null;

    return (
        <footer className="relative bg-[#050505] border-t border-white/[0.06]">
            {/* Subtle orange accent gradient on the top edge — visual rhythm
                without adding a heavy element. Sits just under the border. */}
            <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                    background:
                        'linear-gradient(to right, transparent 0%, rgba(251,146,60,0.35) 50%, transparent 100%)',
                }}
                aria-hidden
            />

            <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
                {/* ── Top row: brand left, social right ───────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="inline-block group shrink-0">
                            <Image
                                src="/logo.webp"
                                alt="Canvas Classes"
                                width={120}
                                height={32}
                                className="object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity h-7 w-auto"
                            />
                        </Link>
                        <p className="text-zinc-500 text-[12.5px] leading-snug max-w-[280px] hidden sm:block">
                            Free chemistry education for JEE &amp; NEET.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="https://www.youtube.com/@CanvasClassesOfficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/30 transition-all"
                            aria-label="YouTube"
                        >
                            <Youtube size={16} />
                        </a>
                        <a
                            href="https://t.me/mycanvasclasses"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 border border-white/[0.06] hover:border-sky-500/30 transition-all"
                            aria-label="Telegram"
                        >
                            <TelegramIcon className="w-4 h-4" />
                        </a>
                        <a
                            href="mailto:support@canvasclasses.in"
                            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.2] transition-all"
                            aria-label="Email"
                        >
                            <Mail size={16} />
                        </a>
                    </div>
                </div>

                {/* ── Nav: three intent-grouped pill bars ─────────────── */}
                <div className="mt-7 space-y-3.5">
                    <PillBar label="Learn" items={LEARN_LINKS} />
                    <PillBar label="Tools" items={TOOLS_LINKS} />
                    <PillBar label="Plan" items={PLAN_LINKS} />
                </div>

                {/* ── Bottom bar ──────────────────────────────────────── */}
                <div className="mt-8 pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-zinc-500">
                    <p>
                        © {currentYear} Canvas Classes by Paaras Sir
                    </p>
                    <nav className="flex items-center gap-4">
                        <Link href="/about" className="hover:text-zinc-300 transition-colors">
                            About
                        </Link>
                        <span className="text-zinc-700">·</span>
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                            Privacy
                        </Link>
                        <span className="text-zinc-700">·</span>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                            Terms
                        </Link>
                    </nav>
                    <p className="text-zinc-600">
                        Made with <span className="text-red-500/80">❤</span> for students
                    </p>
                </div>
            </div>
        </footer>
    );
}
