'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Atom, FlaskConical, BookOpen, GraduationCap,
    FileText, Layers, Zap, ChevronRight,
} from 'lucide-react';

// Cycling words shown on line 1 of the headline — each pairs with "under one Canvas."
const HEADLINE_WORDS = [
    'Academics',
    'Science',
    'Mathematics',
    'Mindset',
    'Life Skills',
    'Growth',
] as const;

// Placeholder topics in the search bar
const PLACEHOLDER_TOPICS = [
    'Mole Concept',
    "Newton's Laws",
    'Periodic Trends',
    'Quadratic Equations',
    'Ionic Equilibrium',
    'Life Skills',
] as const;

// Quick-access chips — traffic-ranked, all direct links
const QUICK_LINKS = [
    { label: 'Handwritten Notes', href: '/handwritten-notes' },
    { label: 'Periodic Table', href: '/interactive-periodic-table' },
    { label: 'The Crucible', href: '/the-crucible' },
    { label: 'NCERT Solutions', href: '/ncert-solutions' },
    { label: 'Salt Analysis', href: '/salt-analysis' },
] as const;

// ── Popular searches shown when the bar is focused but empty ─────────────────

type PopularItem = {
    id: string;
    Icon: React.ElementType;
    iconColor: string;
    title: string;
    subtitle: string;
    url: string;
    badge: string;
    badgeColor: string;
};

const POPULAR_SEARCHES: PopularItem[] = [
    {
        id: 'pop-pt',
        Icon: Atom,
        iconColor: 'text-cyan-400',
        title: 'Interactive Periodic Table',
        subtitle: 'Elements, trends & properties',
        url: '/interactive-periodic-table',
        badge: 'Tool',
        badgeColor: 'text-cyan-400 bg-cyan-500/10',
    },
    {
        id: 'pop-cruc',
        Icon: FlaskConical,
        iconColor: 'text-orange-400',
        title: 'The Crucible',
        subtitle: 'JEE & NEET question practice',
        url: '/the-crucible',
        badge: 'Practice',
        badgeColor: 'text-orange-400 bg-orange-500/10',
    },
    {
        id: 'pop-ch11',
        Icon: BookOpen,
        iconColor: 'text-amber-400',
        title: 'Class 11 Chemistry',
        subtitle: 'NCERT Simplified — all chapters',
        url: '/class-11/chemistry',
        badge: 'Book',
        badgeColor: 'text-amber-400 bg-amber-500/10',
    },
    {
        id: 'pop-cards',
        Icon: Layers,
        iconColor: 'text-violet-400',
        title: 'Chemistry Flashcards',
        subtitle: 'Spaced repetition revision',
        url: '/chemistry-flashcards',
        badge: 'Flashcards',
        badgeColor: 'text-violet-400 bg-violet-500/10',
    },
    {
        id: 'pop-salt',
        Icon: FlaskConical,
        iconColor: 'text-purple-400',
        title: 'Salt Analysis Simulator',
        subtitle: 'Virtual cation & anion tests',
        url: '/salt-analysis',
        badge: 'Simulator',
        badgeColor: 'text-purple-400 bg-purple-500/10',
    },
    {
        id: 'pop-notes',
        Icon: FileText,
        iconColor: 'text-emerald-400',
        title: 'Handwritten Notes',
        subtitle: 'Chapter-wise PDF downloads',
        url: '/handwritten-notes',
        badge: 'Notes',
        badgeColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
        id: 'pop-organic',
        Icon: Zap,
        iconColor: 'text-green-400',
        title: 'Organic Name Reactions',
        subtitle: 'Mechanisms & worked examples',
        url: '/organic-name-reactions',
        badge: 'Content',
        badgeColor: 'text-green-400 bg-green-500/10',
    },
    {
        id: 'pop-lec',
        Icon: GraduationCap,
        iconColor: 'text-red-400',
        title: 'Detailed Lectures',
        subtitle: 'Full chapter video series',
        url: '/detailed-lectures',
        badge: 'Lectures',
        badgeColor: 'text-red-400 bg-red-500/10',
    },
];

// ── Badge style for dynamic search results ───────────────────────────────────
function getBadge(category: string): { label: string; cls: string } {
    switch (category) {
        case 'Tools':     return { label: 'Tool',     cls: 'text-cyan-400 bg-cyan-500/10'     };
        case 'Reactions': return { label: 'Reaction', cls: 'text-green-400 bg-green-500/10'   };
        case 'Concepts':  return { label: 'Concept',  cls: 'text-amber-400 bg-amber-500/10'   };
        case 'Videos':    return { label: 'Video',    cls: 'text-red-400 bg-red-500/10'       };
        case 'Chapters':  return { label: 'Chapter',  cls: 'text-indigo-400 bg-indigo-500/10' };
        case 'Lectures':  return { label: 'Lecture',  cls: 'text-teal-400 bg-teal-500/10'    };
        default:          return { label: 'Page',     cls: 'text-slate-400 bg-white/[0.06]'   };
    }
}

// ── Search result type ───────────────────────────────────────────────────────
type SearchItem = {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    url: string;
    keywords?: string[];
};

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
// Hero Fusion Sigil — Vedic × Western learning, single centered composite
// Bohr orbitals (cyan, CW) + Shatkona/outer ring (amber, CCW)
// + lotus & flower-of-life (CW) + static ॐ nucleus. Breathes subtly.
// =====================================================================

function HeroFusionSigil() {
    // Electron dot positions on the three tilted Bohr orbitals (rx=240, ry=85)
    // Angles chosen so they don't visually cluster during rotation.
    const electrons = [
        { orbit: 0,   t:  20, r: 4.0, op: 0.32 },
        { orbit: 0,   t: 200, r: 3.2, op: 0.20 },
        { orbit: 60,  t:  95, r: 3.6, op: 0.28 },
        { orbit: 60,  t: 275, r: 3.0, op: 0.18 },
        { orbit: 120, t: 150, r: 3.6, op: 0.28 },
        { orbit: 120, t: 330, r: 3.0, op: 0.18 },
    ];

    return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
            <div
                className="relative w-[min(860px,96vw)] aspect-square newhero-sigil-breathe"
                style={{
                    maskImage: 'radial-gradient(closest-side, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(closest-side, black 60%, transparent 100%)',
                }}
            >
                {/* Layer 1 — Bohr orbitals + electrons (cyan), rotates CW */}
                <div className="newhero-sigil-layer newhero-sigil-cw-slow">
                    <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
                        <g transform="translate(300,300)" fill="none"
                           stroke="rgba(255,255,255,0.10)" strokeWidth="0.75">
                            <ellipse rx="240" ry="85" />
                            <ellipse rx="240" ry="85" transform="rotate(60)" />
                            <ellipse rx="240" ry="85" transform="rotate(120)" />
                        </g>
                        <g transform="translate(300,300)" stroke="none">
                            {electrons.map((e, i) => {
                                const rad = (e.t * Math.PI) / 180;
                                const px = 240 * Math.cos(rad);
                                const py =  85 * Math.sin(rad);
                                const rot = `rotate(${e.orbit} 0 0)`;
                                return (
                                    <circle
                                        key={i}
                                        cx={px} cy={py} r={e.r}
                                        fill={`rgba(255,255,255,${e.op})`}
                                        transform={rot}
                                    />
                                );
                            })}
                        </g>
                    </svg>
                </div>

                {/* Layer 2 — Shatkona + outer ring + inner hexagon (amber), rotates CCW */}
                <div className="newhero-sigil-layer newhero-sigil-ccw-slow">
                    <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
                        <g transform="translate(300,300)" fill="none">
                            <circle r="200" stroke="rgba(255,255,255,0.06)" strokeWidth="0.55" />
                            <circle r="220" stroke="rgba(255,255,255,0.03)" strokeWidth="0.4" />
                            <path d="M 0 -170 L 147.2 85 L -147.2 85 Z"
                                  stroke="rgba(255,255,255,0.10)" strokeWidth="0.7" />
                            <path d="M 0 170 L 147.2 -85 L -147.2 -85 Z"
                                  stroke="rgba(255,255,255,0.10)" strokeWidth="0.7" />
                            <path d="M 85 -49 L 85 49 L 0 98 L -85 49 L -85 -49 L 0 -98 Z"
                                  stroke="rgba(255,255,255,0.07)" strokeWidth="0.45" />
                        </g>
                    </svg>
                </div>

                {/* Layer 3 — Lotus petals + flower-of-life seed (warm/cool mix), rotates CW */}
                <div className="newhero-sigil-layer newhero-sigil-cw-med">
                    <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
                        <g transform="translate(300,300)">
                            {[0,45,90,135,180,225,270,315].map(a => (
                                <ellipse
                                    key={a} cx="0" cy="-72" rx="15" ry="40"
                                    transform={`rotate(${a})`}
                                    fill="rgba(255,255,255,0.01)"
                                    stroke="rgba(255,255,255,0.08)" strokeWidth="0.4"
                                />
                            ))}
                            <circle r="32" fill="none"
                                    stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" />
                            {[0,60,120,180,240,300].map(a => {
                                const rad = (a * Math.PI) / 180;
                                const cx  = 32 * Math.cos(rad);
                                const cy  = 32 * Math.sin(rad);
                                return (
                                    <circle key={a} cx={cx} cy={cy} r="32" fill="none"
                                            stroke="rgba(255,255,255,0.05)" strokeWidth="0.35" />
                                );
                            })}
                        </g>
                    </svg>
                </div>

                {/* Layer 4 — Static nucleus glow */}
                <div className="newhero-sigil-layer">
                    <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
                        <defs>
                            <radialGradient id="sigilNucleus" cx="50%" cy="50%" r="50%">
                                <stop offset="0%"   stopColor="rgba(255,255,255,0.10)" />
                                <stop offset="55%"  stopColor="rgba(255,255,255,0.04)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </radialGradient>
                        </defs>
                        <circle cx="300" cy="300" r="62" fill="url(#sigilNucleus)" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// =====================================================================
// Main Hero
// =====================================================================
export default function NewHero() {
    const router             = useRouter();
    const headlineText       = useTypewriter(HEADLINE_WORDS);
    const placeholderText    = usePlaceholderTypewriter(PLACEHOLDER_TOPICS);
    const searchInputRef     = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const [searchValue,   setSearchValue]   = useState('');
    const [searchOpen,    setSearchOpen]    = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchItems,   setSearchItems]   = useState<SearchItem[]>([]);
    const [activeIndex,   setActiveIndex]   = useState(-1);

    // ── Fetch search index lazily on first focus ──────────────────────
    const fetchItems = useCallback(async () => {
        if (searchItems.length > 0 || searchLoading) return;
        setSearchLoading(true);
        try {
            const res = await fetch('/api/search');
            if (res.ok) setSearchItems(await res.json());
        } catch { /* silent */ }
        finally { setSearchLoading(false); }
    }, [searchItems.length, searchLoading]);

    // ── Close dropdown on outside click ──────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target as Node)
            ) {
                setSearchOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Global ⌘K — keeps command palette for power users ────────────
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

    // ── Filter + score results as user types ─────────────────────────
    const filteredResults = useMemo<SearchItem[]>(() => {
        const q = searchValue.toLowerCase().trim();
        if (!q || !searchItems.length) return [];
        return searchItems
            .map(item => {
                const t = item.title.toLowerCase();
                const score =
                    t.startsWith(q)                                       ? 4 :
                    t.includes(q)                                         ? 3 :
                    item.subtitle.toLowerCase().includes(q)               ? 2 :
                    item.keywords?.some(k => k.toLowerCase().includes(q)) ? 1 : -1;
                return { item, score };
            })
            .filter(x => x.score >= 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(x => x.item);
    }, [searchValue, searchItems]);

    // ── Keyboard navigation ───────────────────────────────────────────
    const listLength = searchValue.trim() ? filteredResults.length : POPULAR_SEARCHES.length;

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!searchOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, listLength - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const list = searchValue.trim() ? filteredResults : POPULAR_SEARCHES;
            const active = list[activeIndex];
            if (active) {
                router.push(active.url);
                setSearchOpen(false);
                setSearchValue('');
            }
        } else if (e.key === 'Escape') {
            setSearchOpen(false);
            setActiveIndex(-1);
            searchInputRef.current?.blur();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchOpen, activeIndex, listLength, filteredResults, searchValue, router]);

    // ── Navigate on result select ─────────────────────────────────────
    const navigate = useCallback((url: string) => {
        router.push(url);
        setSearchOpen(false);
        setSearchValue('');
        setActiveIndex(-1);
    }, [router]);

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center text-[#fafafa] newhero-bg">

            {/* Background — bottom blue wash + ambient glows + centered fusion sigil */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-blue-900/30 via-blue-950/15 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-blue-700/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 z-0">
                    <HeroFusionSigil />
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 relative z-10">
                <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-8">

                    {/* ── Sanskrit Shloka ───────────────────────────────────── */}
                    <div className="flex flex-col items-center gap-2 newhero-fade-up" style={{ animationDelay: '0ms' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-px bg-gradient-to-r from-transparent to-amber-600/35" />
                            <span className="text-[9px] font-mono text-amber-600/50 uppercase tracking-[0.3em]">
                                ॥ Bhagavad Gita · 4.38 ॥
                            </span>
                            <div className="w-10 h-px bg-gradient-to-l from-transparent to-amber-600/35" />
                        </div>
                        <p
                            className="text-sm md:text-base text-amber-400/70 font-medium leading-relaxed"
                            style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', Georgia, serif" }}
                        >
                            न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।
                        </p>
                        <p className="text-[11px] text-slate-500 italic font-light tracking-wide">
                            &ldquo;In this world, nothing purifies as knowledge does.&rdquo;
                        </p>
                    </div>

                    {/* ── Headline ──────────────────────────────────────────── */}
                    <h1
                        className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.15] newhero-fade-up"
                        style={{ animationDelay: '150ms' }}
                    >
                        <span className="newhero-gradient-text block mb-1">
                            {headlineText}
                            <span className="newhero-cursor" />
                        </span>
                        <span className="text-white">Under one Canvas.</span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="text-base md:text-lg text-slate-400 font-light leading-relaxed max-w-xl mx-auto newhero-fade-up"
                        style={{ animationDelay: '230ms' }}
                    >
                        The textbook tells you what. We show you why.
                    </p>

                    {/* ── Search bar — inline dropdown ─────────────────────── */}
                    <div
                        ref={searchContainerRef}
                        className="w-full max-w-xl newhero-fade-up relative z-20"
                        style={{ animationDelay: '310ms' }}
                    >
                        {/* Input */}
                        <div className={`relative newhero-search-ring backdrop-blur-sm transition-all duration-200 ${
                            searchOpen
                                ? 'bg-white/[0.06] border border-white/[0.14] rounded-t-xl rounded-b-none'
                                : 'bg-white/[0.04] border border-white/[0.08] rounded-xl'
                        }`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                {searchLoading
                                    ? <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-600 border-t-slate-400 animate-spin" />
                                    : <Search size={18} />
                                }
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setActiveIndex(-1);
                                }}
                                onFocus={() => {
                                    setSearchOpen(true);
                                    fetchItems();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={searchOpen ? 'Search pages, topics, or tools…' : placeholderText}
                                autoComplete="off"
                                className="w-full bg-transparent py-4 pl-12 pr-14 text-base text-white placeholder:text-slate-500 focus:outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <kbd className="hidden sm:inline-block px-2 py-1 rounded text-xs font-mono text-slate-500 bg-white/[0.04] border border-white/[0.08]">
                                    ⌘ K
                                </kbd>
                            </div>
                        </div>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.13 }}
                                    className="absolute left-0 right-0 bg-[#0a0a0a]/96 backdrop-blur-xl border border-t-0 border-white/[0.14] rounded-b-2xl shadow-2xl shadow-black/70 overflow-hidden"
                                >

                                    {/* ── Empty query: Popular ── */}
                                    {!searchValue.trim() && (
                                        <>
                                            <div className="px-4 pt-3 pb-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                                                    Popular
                                                </span>
                                            </div>
                                            {POPULAR_SEARCHES.map((item, i) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => navigate(item.url)}
                                                    onMouseEnter={() => setActiveIndex(i)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                                        activeIndex === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                                                    }`}
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                                                        <item.Icon size={13} className={item.iconColor} />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <p className="text-[13px] text-white/85 font-medium truncate leading-snug">{item.title}</p>
                                                        <p className="text-[11px] text-slate-600 truncate leading-snug">{item.subtitle}</p>
                                                    </div>
                                                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                                        {item.badge}
                                                    </span>
                                                    <ChevronRight size={12} className="shrink-0 text-white/15" />
                                                </button>
                                            ))}
                                            <div className="px-4 py-2.5 border-t border-white/[0.05]">
                                                <p className="text-[11px] text-slate-700">
                                                    Start typing to search 100+ topics, tools &amp; lectures
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {/* ── Has query: filtered results ── */}
                                    {searchValue.trim() && filteredResults.length > 0 && (
                                        <>
                                            <div className="px-4 pt-3 pb-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                                                    Results
                                                </span>
                                            </div>
                                            {filteredResults.map((item, i) => {
                                                const badge = getBadge(item.category);
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => navigate(item.url)}
                                                        onMouseEnter={() => setActiveIndex(i)}
                                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                                            activeIndex === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] text-white/85 font-medium truncate leading-snug">{item.title}</p>
                                                            <p className="text-[11px] text-slate-600 truncate leading-snug">{item.subtitle}</p>
                                                        </div>
                                                        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                                                            {badge.label}
                                                        </span>
                                                        <ChevronRight size={12} className="shrink-0 text-white/15" />
                                                    </button>
                                                );
                                            })}
                                        </>
                                    )}

                                    {/* ── Has query but no results ── */}
                                    {searchValue.trim() && !searchLoading && filteredResults.length === 0 && (
                                        <div className="py-8 px-4 text-center">
                                            <p className="text-sm text-slate-500">
                                                No results for &ldquo;{searchValue}&rdquo;
                                            </p>
                                            <p className="text-xs text-slate-700 mt-1">
                                                Try &ldquo;mole concept&rdquo;, &ldquo;equilibrium&rdquo;, or &ldquo;organic reactions&rdquo;
                                            </p>
                                        </div>
                                    )}

                                    {/* ── Loading ── */}
                                    {searchValue.trim() && searchLoading && (
                                        <div className="py-6 text-center">
                                            <p className="text-xs text-slate-600">Loading…</p>
                                        </div>
                                    )}

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Quick-access chips */}
                    <div
                        className="flex flex-wrap justify-center gap-2 newhero-fade-up"
                        style={{ animationDelay: '390ms' }}
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
