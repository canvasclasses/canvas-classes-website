'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search } from 'lucide-react';

// Cycling words shown on line 1 of the headline — each pairs with "under one Canvas."
const HEADLINE_WORDS = [
    'Academics',
    'Science',
    'Mathematics',
    'Mindset',
    'Life Skills',
    'Growth',
] as const;

// Placeholder topics in the search bar — broader than chemistry now
const PLACEHOLDER_TOPICS = [
    'Mole Concept',
    "Newton's Laws",
    'Periodic Trends',
    'Quadratic Equations',
    'Ionic Equilibrium',
    'Life Skills',
] as const;

// Quick-access chips — traffic-ranked, all direct links (not search openers)
const QUICK_LINKS = [
    { label: 'Handwritten Notes', href: '/handwritten-notes' },
    { label: 'Periodic Table', href: '/interactive-periodic-table' },
    { label: 'The Crucible', href: '/the-crucible' },
    { label: 'NCERT Solutions', href: '/ncert-solutions' },
    { label: 'Salt Analysis', href: '/salt-analysis' },
] as const;

// =====================================================================
// Typewriter hook — starts empty, types in first word, cycles through list
// =====================================================================
function useTypewriter(
    words: readonly string[],
    typingSpeed = 110,
    deletingSpeed = 55,
    pauseMs = 2200,
    startDelayMs = 400
) {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const wordsRef = useRef(words);

    useEffect(() => {
        wordsRef.current = words;
    }, [words]);

    useEffect(() => {
        const currentWords = wordsRef.current;
        const current = currentWords[wordIndex] ?? '';
        if (!current) return;

        if (!isDeleting && text === current) {
            const pause = setTimeout(() => setIsDeleting(true), pauseMs);
            return () => clearTimeout(pause);
        }
        if (isDeleting && text === '') {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        const delay =
            text.length === 0 && !isDeleting && wordIndex === 0
                ? startDelayMs
                : speed;

        const timeout = setTimeout(() => {
            setText(
                isDeleting
                    ? current.substring(0, text.length - 1)
                    : current.substring(0, text.length + 1)
            );
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex, typingSpeed, deletingSpeed, pauseMs, startDelayMs, words.length]);

    return text;
}

// =====================================================================
// Search bar placeholder typewriter
// =====================================================================
function usePlaceholderTypewriter(topics: readonly string[]) {
    const [placeholder, setPlaceholder] = useState('');
    const [topicIndex, setTopicIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = topics[topicIndex];
        const speed = isDeleting ? 40 : 80;
        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex <= current.length) {
                setPlaceholder('Search ' + current.substring(0, charIndex));
                setCharIndex((prev) => prev + 1);
            } else if (!isDeleting && charIndex > current.length) {
                setIsDeleting(true);
            } else if (isDeleting && charIndex >= 0) {
                setPlaceholder('Search ' + current.substring(0, charIndex));
                setCharIndex((prev) => prev - 1);
            } else {
                setIsDeleting(false);
                setTopicIndex((prev) => (prev + 1) % topics.length);
            }
        }, !isDeleting && charIndex > current.length ? 1500 : isDeleting && charIndex < 0 ? 200 : speed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, topicIndex, topics]);

    return placeholder;
}

// =====================================================================
// Periodic table background (unchanged — kept per design decision)
// =====================================================================
const ELEMENTS = [
    { n: 1,  s: 'H',  c: 1,  r: 1 }, { n: 2,  s: 'He', c: 18, r: 1 },
    { n: 3,  s: 'Li', c: 1,  r: 2 }, { n: 4,  s: 'Be', c: 2,  r: 2 },
    { n: 5,  s: 'B',  c: 13, r: 2 }, { n: 6,  s: 'C',  c: 14, r: 2 },
    { n: 7,  s: 'N',  c: 15, r: 2 }, { n: 8,  s: 'O',  c: 16, r: 2 },
    { n: 9,  s: 'F',  c: 17, r: 2 }, { n: 10, s: 'Ne', c: 18, r: 2 },
    { n: 11, s: 'Na', c: 1,  r: 3 }, { n: 12, s: 'Mg', c: 2,  r: 3 },
    { n: 13, s: 'Al', c: 13, r: 3 }, { n: 14, s: 'Si', c: 14, r: 3 },
    { n: 15, s: 'P',  c: 15, r: 3 }, { n: 16, s: 'S',  c: 16, r: 3 },
    { n: 17, s: 'Cl', c: 17, r: 3 }, { n: 18, s: 'Ar', c: 18, r: 3 },
    { n: 19, s: 'K',  c: 1,  r: 4 }, { n: 20, s: 'Ca', c: 2,  r: 4 },
    { n: 21, s: 'Sc', c: 3,  r: 4 }, { n: 22, s: 'Ti', c: 4,  r: 4 },
    { n: 23, s: 'V',  c: 5,  r: 4 }, { n: 24, s: 'Cr', c: 6,  r: 4 },
    { n: 25, s: 'Mn', c: 7,  r: 4 }, { n: 26, s: 'Fe', c: 8,  r: 4 },
    { n: 27, s: 'Co', c: 9,  r: 4 }, { n: 28, s: 'Ni', c: 10, r: 4 },
    { n: 29, s: 'Cu', c: 11, r: 4 }, { n: 30, s: 'Zn', c: 12, r: 4 },
    { n: 31, s: 'Ga', c: 13, r: 4 }, { n: 32, s: 'Ge', c: 14, r: 4 },
    { n: 33, s: 'As', c: 15, r: 4 }, { n: 34, s: 'Se', c: 16, r: 4 },
    { n: 35, s: 'Br', c: 17, r: 4 }, { n: 36, s: 'Kr', c: 18, r: 4 },
];

function ElementTile({
    data,
    scrollY,
}: {
    data: (typeof ELEMENTS)[0];
    scrollY: ReturnType<typeof useScroll>['scrollY'];
}) {
    const { x, y, r } = useMemo(
        () => ({
            x: (Math.random() - 0.5) * 150,
            y: -(Math.random() * 150 + 50),
            r: (Math.random() - 0.5) * 20,
        }),
        []
    );

    const yMove   = useTransform(scrollY, [0, 500], [0, y]);
    const xMove   = useTransform(scrollY, [0, 500], [0, x]);
    const rotate  = useTransform(scrollY, [0, 500], [0, r]);
    const opacity = useTransform(scrollY, [0, 300], [0.7, 0]);

    const initialDelay = data.r * 0.1 + data.c * 0.02;

    return (
        <motion.div
            className="relative"
            style={{ gridColumnStart: data.c, gridRowStart: data.r }}
            initial={{ opacity: 0, y: -1000 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 40, delay: initialDelay }}
        >
            <motion.div
                style={{ y: yMove, x: xMove, rotate, opacity }}
                className="w-full h-full aspect-square border border-blue-400/10 bg-blue-500/5 rounded-sm flex flex-col items-center justify-center select-none overflow-hidden hover:bg-blue-500/10 transition-colors"
            >
                <span className="absolute top-0.5 left-0.5 text-[6px] md:text-[8px] opacity-30 font-mono leading-none">
                    {data.n}
                </span>
                <span className="text-[10px] md:text-sm font-semibold text-blue-200/80">
                    {data.s}
                </span>
            </motion.div>
        </motion.div>
    );
}

function PeriodicTableBackground() {
    const { scrollY } = useScroll();
    const y       = useTransform(scrollY, [0, 500], [0, -50]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <div className="w-full max-w-[1200px] mx-auto h-full flex items-end justify-center pb-0 md:pb-12 pointer-events-none overflow-visible">
            <motion.div
                style={{
                    y,
                    opacity,
                    maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
                }}
                className="w-full px-4"
            >
                <div
                    className="grid gap-1 md:gap-1.5 w-full opacity-80"
                    style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                >
                    {ELEMENTS.map((el) => (
                        <ElementTile key={el.s} data={el} scrollY={scrollY} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

// =====================================================================
// Main Hero
// =====================================================================
export default function NewHero() {
    const headlineText      = useTypewriter(HEADLINE_WORDS);
    const placeholderText   = usePlaceholderTypewriter(PLACEHOLDER_TOPICS);
    const searchInputRef    = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState('');

    // Global ⌘K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                window.dispatchEvent(new Event('openCommandPalette'));
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const handleSearchClick = useCallback(() => {
        window.dispatchEvent(new Event('openCommandPalette'));
    }, []);

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center text-[#fafafa] newhero-bg">

            {/* Background glow + periodic table */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-blue-900/30 via-blue-950/15 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-blue-700/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <PeriodicTableBackground />
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 relative z-10">
                <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-8">

                    {/* ── Headline ─────────────────────────────────────────────
                        Line 1: gradient cycling word (typewriter)
                        Line 2: static anchor "— under one Canvas."
                        The cursor sits after the cycling word, so it animates
                        with the text as it types / deletes.
                    ──────────────────────────────────────────────────────────── */}
                    <h1
                        className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.15] newhero-fade-up"
                        style={{ animationDelay: '50ms' }}
                    >
                        <span className="newhero-gradient-text block mb-1">
                            {headlineText}
                            <span className="newhero-cursor" />
                        </span>
                        <span className="text-white">— under one Canvas.</span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="text-base md:text-lg text-slate-400 font-light leading-relaxed max-w-xl mx-auto newhero-fade-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        From Class 9 to JEE. Interactive tools, adaptive practice, and lessons that go beyond textbooks — built by Paaras Sir.
                    </p>

                    {/* Search bar — opens command palette */}
                    <div className="w-full max-w-xl newhero-fade-up" style={{ animationDelay: '150ms' }}>
                        <div
                            className="relative group newhero-search-ring rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm cursor-pointer"
                            onClick={handleSearchClick}
                        >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Search size={18} />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    if (e.target.value.trim().length > 0) {
                                        window.dispatchEvent(
                                            new CustomEvent('openCommandPalette', {
                                                detail: { search: e.target.value },
                                            })
                                        );
                                        e.target.blur();
                                    }
                                }}
                                onFocus={(e) => {
                                    window.dispatchEvent(
                                        new CustomEvent('openCommandPalette', {
                                            detail: { search: e.target.value },
                                        })
                                    );
                                    e.target.blur();
                                }}
                                placeholder={placeholderText}
                                autoComplete="off"
                                className="w-full bg-transparent py-4 pl-12 pr-12 text-base text-white placeholder:text-slate-500 focus:outline-none cursor-pointer"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <kbd className="hidden sm:inline-block px-2 py-1 rounded text-xs font-mono text-slate-500 bg-white/[0.04] border border-white/[0.08]">
                                    ⌘ K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Quick-access chips — direct links, traffic-ranked */}
                    <div
                        className="flex flex-wrap justify-center gap-2 newhero-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        {QUICK_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="newhero-tag-pill px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                </div>
            </main>
        </section>
    );
}
