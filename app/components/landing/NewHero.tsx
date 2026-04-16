'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
// Hero Split Background — Vedic (amber, left) ↔ Modern Science (blue, right)
// Icons arranged in two clean horizontal rows across full width
// =====================================================================

const Va = (o: number) => `rgba(251,191,36,${o})`;  // Vedic amber
const Mb = (o: number) => `rgba(96,165,250,${o})`;  // Modern blue

function HeroSplitBackground() {
    const { scrollY } = useScroll();
    const yMove  = useTransform(scrollY, [0, 500], [0, -50]);
    const opFade = useTransform(scrollY, [0, 400], [1,  0]);

    // Vedic icons at x = 75, 210, 345, 480, 610 (left half)
    // Modern icons at x = 835, 970, 1105, 1245, 1375 (right half)
    // All icons centred at y = 340

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
                        {/* Soft glow for nucleus / lotus centre */}
                        <filter id="hg-a" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="5" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        {/* Subtle glow for atom nucleus */}
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

                    {/* ── Background: faint OM watermark ── */}
                    <text x="170" y="310" fontSize="110"
                        fontFamily="'Noto Sans Devanagari','Mangal',Georgia,serif"
                        fill={Va(0.018)} textAnchor="middle">ॐ</text>

                    {/* ════════════════════════════════════════
                        LEFT — VEDIC LEARNING SYSTEM (amber)
                        5 icons in a single horizontal row
                    ════════════════════════════════════════ */}

                    {/* 1 — PRANAVA (OM) ─── x=75 */}
                    <g transform="translate(75,340)">
                        {/* Outer decorative ring */}
                        <circle cx="0" cy="0" r="32" fill="none" stroke={Va(0.12)} strokeWidth="0.5" />
                        {/* Crescent arc at top */}
                        <path d="M -14 -24 A 16 16 0 0 1 14 -24" fill="none" stroke={Va(0.14)} strokeWidth="0.6" />
                        <circle cx="0" cy="-28" r="2.5" fill={Va(0.18)} stroke="none" />
                        {/* OM glyph */}
                        <text x="0" y="13" fontSize="34"
                            fontFamily="'Noto Sans Devanagari','Mangal',Georgia,serif"
                            fill={Va(0.32)} textAnchor="middle">ॐ</text>
                    </g>
                    <text x="75" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">PRANAVA</text>

                    {/* 2 — SHATKONA (Star of David / Sri Yantra fragment) ─── x=210 */}
                    <g transform="translate(210,340)" stroke={Va(0.17)} strokeWidth="0.72" fill="none">
                        <circle cx="0" cy="0" r="34" stroke={Va(0.11)} strokeWidth="0.5" />
                        {/* Upward triangle (inscribed, r=27) */}
                        <path d="M 0 -27 L 23.4 13.5 L -23.4 13.5 Z" />
                        {/* Downward triangle */}
                        <path d="M 0 27 L 23.4 -13.5 L -23.4 -13.5 Z" />
                        {/* Inner hexagon trace */}
                        <circle cx="0" cy="0" r="10" stroke={Va(0.11)} strokeWidth="0.5" />
                        {/* Bindu */}
                        <circle cx="0" cy="0" r="3.5" fill={Va(0.28)} stroke="none" filter="url(#hg-a)" />
                    </g>
                    <text x="210" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">SHATKONA</text>

                    {/* 3 — PADMA (8-petal lotus) ─── x=345 */}
                    <g transform="translate(345,340)">
                        {/* 8 petals: each ellipse offset 20px from centre, rotated around origin */}
                        {[0,1,2,3,4,5,6,7].map(i => (
                            <ellipse key={i}
                                cx="0" cy="-21" rx="7" ry="18"
                                transform={`rotate(${i * 45})`}
                                fill={Va(0.03)} stroke={Va(0.15)} strokeWidth="0.6"
                            />
                        ))}
                        {/* Inner ring */}
                        <circle cx="0" cy="0" r="9"  fill="none" stroke={Va(0.16)} strokeWidth="0.65" />
                        {/* Luminous centre */}
                        <circle cx="0" cy="0" r="3.5" fill={Va(0.30)} stroke="none" filter="url(#hg-a)" />
                    </g>
                    <text x="345" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">PADMA</text>

                    {/* 4 — DHARMA CHAKRA (8-spoke wheel) ─── x=480 */}
                    <g transform="translate(480,340)" fill="none">
                        {/* Outer rim */}
                        <circle cx="0" cy="0" r="30" stroke={Va(0.15)} strokeWidth="0.65" />
                        {/* Mid ring */}
                        <circle cx="0" cy="0" r="20" stroke={Va(0.08)} strokeWidth="0.45" />
                        {/* Hub */}
                        <circle cx="0" cy="0" r="7"  stroke={Va(0.17)} strokeWidth="0.7" />
                        {/* 8 spokes */}
                        {[0,1,2,3,4,5,6,7].map(i => {
                            const a = (i * 45) * Math.PI / 180;
                            return <line key={i}
                                x1={8 * Math.cos(a)} y1={8 * Math.sin(a)}
                                x2={30 * Math.cos(a)} y2={30 * Math.sin(a)}
                                stroke={Va(0.15)} strokeWidth="0.6" />;
                        })}
                        {/* 8 petal beads between spokes at r=21 */}
                        {[0,1,2,3,4,5,6,7].map(i => {
                            const a = ((i * 45) + 22.5) * Math.PI / 180;
                            return <circle key={i}
                                cx={21 * Math.cos(a)} cy={21 * Math.sin(a)} r={2.8}
                                fill={Va(0.05)} stroke={Va(0.12)} strokeWidth="0.5" />;
                        })}
                        <circle cx="0" cy="0" r="3" fill={Va(0.28)} stroke="none" />
                    </g>
                    <text x="480" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">CHAKRA</text>

                    {/* 5 — TRISHUL ─── x=610 */}
                    <g transform="translate(610,334)" stroke={Va(0.18)} strokeWidth="0.8" fill="none">
                        {/* Handle */}
                        <line x1="0" y1="44" x2="0" y2="-8" />
                        {/* Cross-guard */}
                        <line x1="-19" y1="-2" x2="19" y2="-2" />
                        {/* Centre prong (tallest) */}
                        <line x1="0" y1="-2"  x2="0"   y2="-48" />
                        {/* Left prong */}
                        <path d="M -19 -2 C -27 -8, -28 -20, -22 -36" />
                        {/* Right prong */}
                        <path d="M  19 -2 C  27 -8,  28 -20,  22 -36" />
                        {/* Prong tips */}
                        <circle cx="0"   cy="-48" r="2.2" fill={Va(0.22)} stroke="none" />
                        <circle cx="-22" cy="-36" r="2"   fill={Va(0.19)} stroke="none" />
                        <circle cx=" 22" cy="-36" r="2"   fill={Va(0.19)} stroke="none" />
                        {/* Handle ornament (diamond) */}
                        <path d="M 0 14 L 6 20 L 0 26 L -6 20 Z" stroke={Va(0.12)} strokeWidth="0.5" />
                    </g>
                    <text x="610" y="390" fontSize="6.5" fill={Va(0.14)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">TRISHUL</text>

                    {/* ── Centre divider ── */}
                    <line x1="720" y1="165" x2="720" y2="435"
                        stroke="url(#hg-div)" strokeWidth="0.6" />

                    {/* ════════════════════════════════════════
                        RIGHT — MODERN SCIENCE (blue)
                        5 icons in a single horizontal row
                    ════════════════════════════════════════ */}

                    {/* 6 — BOHR ATOM (Physics) ─── x=835 */}
                    <g transform="translate(835,338)" fill="none">
                        {/* Nucleus */}
                        <circle cx="0" cy="0" r="9" fill={Mb(0.14)} stroke={Mb(0.28)} strokeWidth="0.8" filter="url(#hg-b)" />
                        {/* 3 orbital ellipses */}
                        <ellipse cx="0" cy="0" rx="44" ry="15" stroke={Mb(0.17)} strokeWidth="0.7" />
                        <ellipse cx="0" cy="0" rx="44" ry="15" stroke={Mb(0.17)} strokeWidth="0.7" transform="rotate(60)" />
                        <ellipse cx="0" cy="0" rx="44" ry="15" stroke={Mb(0.17)} strokeWidth="0.7" transform="rotate(120)" />
                        {/* Electrons */}
                        <circle cx=" 44" cy="0"  r="3" fill={Mb(0.26)} stroke="none" />
                        <circle cx=" 22" cy="-23" r="3" fill={Mb(0.22)} stroke="none" />
                        <circle cx="-22" cy="-23" r="3" fill={Mb(0.22)} stroke="none" />
                    </g>
                    <text x="835" y="397" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">PHYSICS</text>

                    {/* 7 — BENZENE RING (Chemistry) ─── x=970 */}
                    <g transform="translate(970,346)" stroke={Mb(0.17)} strokeWidth="0.75" fill="none">
                        {/* Flat-top hexagon r=28 (vertices at 30°,90°,150°,210°,270°,330°) */}
                        <path d="M 24 -14 L 24 14 L 0 28 L -24 14 L -24 -14 L 0 -28 Z" />
                        {/* Aromatic inner circle */}
                        <circle cx="0" cy="0" r="18" stroke={Mb(0.10)} />
                        {/* Centre dot */}
                        <circle cx="0" cy="0" r="3.5" fill={Mb(0.18)} stroke="none" />
                    </g>
                    <text x="970" y="390" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">CHEMISTRY</text>

                    {/* 8 — DNA DOUBLE HELIX (Biology) ─── x=1105 */}
                    <g transform="translate(1105,0)" stroke={Mb(0.15)} strokeWidth="0.75" fill="none">
                        {/* Strand 1 — sweeps right then left */}
                        <path d="M 0 302 C 28 312,28 326, 0 336 C -28 346,-28 360, 0 370 C 28 380,28 394, 0 404" />
                        {/* Strand 2 — mirror */}
                        <path d="M 0 302 C -28 312,-28 326, 0 336 C 28 346,28 360, 0 370 C -28 380,-28 394, 0 404" />
                        {/* Rungs + base-pair dots */}
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

                    {/* 9 — NEURAL NETWORK (AI) ─── x=1245 */}
                    <g transform="translate(1245,340)">
                        {/* 2-3-2 architecture */}
                        {/* Connections: input → hidden */}
                        {([[-20,-16],[-20,16]] as [number,number][]).flatMap(([ix,iy]) =>
                            ([[-1,-28],[-1,0],[-1,28]] as [number,number][]).map(([hx,hy]) => (
                                <line key={`${iy}${hy}`} x1={ix} y1={iy} x2={hx} y2={hy}
                                    stroke={Mb(0.07)} strokeWidth="0.45" fill="none" />
                            ))
                        )}
                        {/* Connections: hidden → output */}
                        {([[-1,-28],[-1,0],[-1,28]] as [number,number][]).flatMap(([hx,hy]) =>
                            ([[20,-16],[20,16]] as [number,number][]).map(([ox,oy]) => (
                                <line key={`${hy}${oy}`} x1={hx} y1={hy} x2={ox} y2={oy}
                                    stroke={Mb(0.07)} strokeWidth="0.45" fill="none" />
                            ))
                        )}
                        {/* Input nodes */}
                        {([[-20,-16],[-20,16]] as [number,number][]).map(([cx,cy],i)=>(
                            <circle key={i} cx={cx} cy={cy} r={4.5}
                                fill={Mb(0.07)} stroke={Mb(0.26)} strokeWidth="0.7" />
                        ))}
                        {/* Hidden nodes */}
                        {([[-1,-28],[-1,0],[-1,28]] as [number,number][]).map(([cx,cy],i)=>(
                            <circle key={i} cx={cx} cy={cy} r={4.5}
                                fill={Mb(0.05)} stroke={Mb(0.19)} strokeWidth="0.7" />
                        ))}
                        {/* Output nodes */}
                        {([[20,-16],[20,16]] as [number,number][]).map(([cx,cy],i)=>(
                            <circle key={i} cx={cx} cy={cy} r={4.5}
                                fill={Mb(0.07)} stroke={Mb(0.26)} strokeWidth="0.7" />
                        ))}
                    </g>
                    <text x="1245" y="390" fontSize="6.5" fill={Mb(0.15)} fontFamily="monospace"
                        textAnchor="middle" letterSpacing="1.5">AI</text>

                    {/* 10 — SATURN (Space) ─── x=1375 */}
                    <g transform="translate(1375,340)" fill="none">
                        {/* Planet */}
                        <circle cx="0" cy="0" r="22" fill={Mb(0.04)} stroke={Mb(0.17)} strokeWidth="0.75" />
                        {/* Ring ellipse */}
                        <ellipse cx="0" cy="0" rx="40" ry="10" stroke={Mb(0.18)} strokeWidth="0.75" />
                        {/* Stars */}
                        {([[-42,-42],[-28,-56],[22,-50],[44,-25],[-46,-14],[42,18],[-38,20]] as [number,number][]).map(([sx,sy],i)=>(
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

                    {/* ── Sanskrit Shloka — epigraph ────────────────────────── */}
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

                    {/* ── Headline ─────────────────────────────────────────────
                        Line 1: gradient cycling word (typewriter)
                        Line 2: static anchor "— under one Canvas."
                        The cursor sits after the cycling word, so it animates
                        with the text as it types / deletes.
                    ──────────────────────────────────────────────────────────── */}
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

                    {/* Search bar — opens command palette */}
                    <div className="w-full max-w-xl newhero-fade-up" style={{ animationDelay: '310ms' }}>
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
