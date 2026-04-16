'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
// Hero Split Background — Vedic (amber, left) ↔ Modern Science (blue, right)
// =====================================================================

const Va = (o: number) => `rgba(251,191,36,${o})`;
const Mb = (o: number) => `rgba(96,165,250,${o})`;

function HeroSplitBackground() {
    const { scrollY } = useScroll();
    const yMove  = useTransform(scrollY, [0, 500], [0, -50]);
    const opFade = useTransform(scrollY, [0, 400], [1,  0]);

    return (
        <div className="w-full h-full flex items-end justify-center pointer-events-none overflow-visible select-none">
            <motion.div
                style={{
                    y: yMove,
                    opacity: opFade,
                    maskImage: 'linear-gradient(to top, black 45%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 45%, transparent 100%)',
                }}
                className="w-full"
            >
                <svg viewBox="0 0 1440 460" preserveAspectRatio="xMidYMax meet" className="w-full" aria-hidden="true">
                    <defs>
                        <filter id="hg-a" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="5" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="hg-b" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur stdDeviation="3" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <linearGradient id="hg-div" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor="transparent" />
                            <stop offset="55%"  stopColor="rgba(255,255,255,0.03)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    <text x="170" y="310" fontSize="110"
                        fontFamily="'Noto Sans Devanagari','Mangal',Georgia,serif"
                        fill={Va(0.018)} textAnchor="middle">ॐ</text>

                    {/* LEFT — VEDIC (amber) */}

                    <g transform="translate(75,340)">
                        <circle cx="0" cy="0" r="32" fill="none" stroke={Va(0.12)} strokeWidth="0.5" />
                        <path d="M -14 -24 A 16 16 0 0 1 14 -24" fill="none" stroke={Va(0.14)} strokeWidth="0.6" />
                        <circle cx="0" cy="-28" r="2.5" fill={Va(0.18)} stroke="none" />
                        <text x="0" y="13" fontSize="34"
                            fontFamily="'Noto Sans Devanagari','Mangal',Georgia,serif"
                            fill={Va(0.32)} textAnchor="middle">ॐ</text>
                    </g>
                    <text x="75" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">PRANAVA</text>

                    <g transform="translate(210,340)" stroke={Va(0.17)} strokeWidth="0.72" fill="none">
                        <circle cx="0" cy="0" r="34" stroke={Va(0.11)} strokeWidth="0.5" />
                        <path d="M 0 -27 L 23.4 13.5 L -23.4 13.5 Z" />
                        <path d="M 0 27 L 23.4 -13.5 L -23.4 -13.5 Z" />
                        <circle cx="0" cy="0" r="10" stroke={Va(0.11)} strokeWidth="0.5" />
                        <circle cx="0" cy="0" r="3.5" fill={Va(0.28)} stroke="none" filter="url(#hg-a)" />
                    </g>
                    <text x="210" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">SHATKONA</text>

                    <g transform="translate(345,340)">
                        {[0,1,2,3,4,5,6,7].map(i => (
                            <ellipse key={i} cx="0" cy="-21" rx="7" ry="18"
                                transform={`rotate(${i * 45})`}
                                fill={Va(0.03)} stroke={Va(0.15)} strokeWidth="0.6" />
                        ))}
                        <circle cx="0" cy="0" r="9"  fill="none" stroke={Va(0.16)} strokeWidth="0.65" />
                        <circle cx="0" cy="0" r="3.5" fill={Va(0.30)} stroke="none" filter="url(#hg-a)" />
                    </g>
                    <text x="345" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">PADMA</text>

                    <g transform="translate(480,340)" fill="none">
                        <circle cx="0" cy="0" r="30" stroke={Va(0.15)} strokeWidth="0.65" />
                        <circle cx="0" cy="0" r="20" stroke={Va(0.08)} strokeWidth="0.45" />
                        <circle cx="0" cy="0" r="7"  stroke={Va(0.17)} strokeWidth="0.7" />
                        {[0,1,2,3,4,5,6,7].map(i => {
                            const a = (i * 45) * Math.PI / 180;
                            return <line key={i} x1={8*Math.cos(a)} y1={8*Math.sin(a)} x2={30*Math.cos(a)} y2={30*Math.sin(a)} stroke={Va(0.15)} strokeWidth="0.6" />;
                        })}
                        {[0,1,2,3,4,5,6,7].map(i => {
                            const a = ((i * 45) + 22.5) * Math.PI / 180;
                            return <circle key={i} cx={21*Math.cos(a)} cy={21*Math.sin(a)} r={2.8} fill={Va(0.05)} stroke={Va(0.12)} strokeWidth="0.5" />;
                        })}
                        <circle cx="0" cy="0" r="3" fill={Va(0.28)} stroke="none" />
                    </g>
                    <text x="480" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">CHAKRA</text>

                    <g transform="translate(610,334)" stroke={Va(0.18)} strokeWidth="0.8" fill="none">
                        <line x1="0" y1="44" x2="0" y2="-8" />
                        <line x1="-19" y1="-2" x2="19" y2="-2" />
                        <line x1="0" y1="-2"  x2="0"   y2="-48" />
                        <path d="M -19 -2 C -27 -8, -28 -20, -22 -36" />
                        <path d="M  19 -2 C  27 -8,  28 -20,  22 -36" />
                        <circle cx="0"   cy="-48" r="2.2" fill={Va(0.22)} stroke="none" />
                        <circle cx="-22" cy="-36" r="2"   fill={Va(0.19)} stroke="none" />
                        <circle cx=" 22" cy="-36" r="2"   fill={Va(0.19)} stroke="none" />
                        <path d="M 0 14 L 6 20 L 0 26 L -6 20 Z" stroke={Va(0.12)} strokeWidth="0.5" />
                    </g>
                    <text x="610" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">TRISHUL</text>

                    <line x1="720" y1="165" x2="720" y2="435" stroke="url(#hg-div)" strokeWidth="0.6" />

                    {/* RIGHT — MODERN SCIENCE (blue) */}

                    <g transform="translate(835,338)" fill="none">
                        <circle cx="0" cy="0" r="9" fill={Mb(0.14)} stroke={Mb(0.28)} strokeWidth="0.8" filter="url(#hg-b)" />
                        <ellipse cx="0" cy="0" rx="44" ry="15" stroke={Mb(0.17)} strokeWidth="0.7" />
                        <ellipse cx="0" cy="0" rx="44" ry="15" stroke={Mb(0.17)} strokeWidth="0.7" transform="rotate(60)" />
                        <ellipse cx="0" cy="0" rx="44" ry="15" stroke={Mb(0.17)} strokeWidth="0.7" transform="rotate(120)" />
                        <circle cx=" 44" cy="0"  r="3" fill={Mb(0.26)} stroke="none" />
                        <circle cx=" 22" cy="-23" r="3" fill={Mb(0.22)} stroke="none" />
                        <circle cx="-22" cy="-23" r="3" fill={Mb(0.22)} stroke="none" />
                    </g>
                    <text x="835" y="397" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">PHYSICS</text>

                    <g transform="translate(970,346)" stroke={Mb(0.17)} strokeWidth="0.75" fill="none">
                        <path d="M 24 -14 L 24 14 L 0 28 L -24 14 L -24 -14 L 0 -28 Z" />
                        <circle cx="0" cy="0" r="18" stroke={Mb(0.10)} />
                        <circle cx="0" cy="0" r="3.5" fill={Mb(0.18)} stroke="none" />
                    </g>
                    <text x="970" y="390" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">CHEMISTRY</text>

                    <g transform="translate(1105,0)" stroke={Mb(0.15)} strokeWidth="0.75" fill="none">
                        <path d="M 0 302 C 28 312,28 326, 0 336 C -28 346,-28 360, 0 370 C 28 380,28 394, 0 404" />
                        <path d="M 0 302 C -28 312,-28 326, 0 336 C 28 346,28 360, 0 370 C -28 380,-28 394, 0 404" />
                        {[319, 353, 387].map(ry => (
                            <g key={ry}>
                                <line x1="-26" y1={ry} x2="26" y2={ry} stroke={Mb(0.09)} />
                                <circle cx="-20" cy={ry} r={2} fill={Mb(0.22)} stroke="none" />
                                <circle cx=" 20" cy={ry} r={2} fill={Mb(0.22)} stroke="none" />
                            </g>
                        ))}
                    </g>
                    <text x="1105" y="420" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">BIOLOGY</text>

                    <g transform="translate(1245,340)">
                        {([[-20,-16],[-20,16]] as [number,number][]).flatMap(([ix,iy]) =>
                            ([[-1,-28],[-1,0],[-1,28]] as [number,number][]).map(([hx,hy]) => (
                                <line key={`${iy}${hy}`} x1={ix} y1={iy} x2={hx} y2={hy} stroke={Mb(0.07)} strokeWidth="0.45" fill="none" />
                            ))
                        )}
                        {([[-1,-28],[-1,0],[-1,28]] as [number,number][]).flatMap(([hx,hy]) =>
                            ([[20,-16],[20,16]] as [number,number][]).map(([ox,oy]) => (
                                <line key={`${hy}${oy}`} x1={hx} y1={hy} x2={ox} y2={oy} stroke={Mb(0.07)} strokeWidth="0.45" fill="none" />
                            ))
                        )}
                        {([[-20,-16],[-20,16]] as [number,number][]).map(([cx,cy],i) => (
                            <circle key={i} cx={cx} cy={cy} r={4.5} fill={Mb(0.07)} stroke={Mb(0.26)} strokeWidth="0.7" />
                        ))}
                        {([[-1,-28],[-1,0],[-1,28]] as [number,number][]).map(([cx,cy],i) => (
                            <circle key={i} cx={cx} cy={cy} r={4.5} fill={Mb(0.05)} stroke={Mb(0.19)} strokeWidth="0.7" />
                        ))}
                        {([[20,-16],[20,16]] as [number,number][]).map(([cx,cy],i) => (
                            <circle key={i} cx={cx} cy={cy} r={4.5} fill={Mb(0.07)} stroke={Mb(0.26)} strokeWidth="0.7" />
                        ))}
                    </g>
                    <text x="1245" y="390" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">AI</text>

                    <g transform="translate(1375,340)" fill="none">
                        <circle cx="0" cy="0" r="22" fill={Mb(0.04)} stroke={Mb(0.17)} strokeWidth="0.75" />
                        <ellipse cx="0" cy="0" rx="40" ry="10" stroke={Mb(0.18)} strokeWidth="0.75" />
                        {([[-42,-42],[-28,-56],[22,-50],[44,-25],[-46,-14],[42,18],[-38,20]] as [number,number][]).map(([sx,sy],i) => (
                            <circle key={i} cx={sx} cy={sy} r={1.4} fill={Mb(0.24)} stroke="none" />
                        ))}
                    </g>
                    <text x="1375" y="390" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">SPACE</text>

                </svg>
            </motion.div>
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

            {/* Background glow + split SVG */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-blue-900/30 via-blue-950/15 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-blue-700/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <HeroSplitBackground />
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
                        The textbook tells you what. We show you why — and what it means for the world you are about to inherit.
                        <span className="block mt-2 text-zinc-500 font-normal text-sm md:text-base tracking-wide">
                            Class 9 through JEE / NEET, built by Paaras Sir.
                        </span>
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
