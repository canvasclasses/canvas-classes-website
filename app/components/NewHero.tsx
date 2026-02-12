'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Sparkles,
    FlaskConical,
    Atom,
    Flame,
    ArrowRight,
    Target,
    Zap,
    Command,
} from 'lucide-react';

// --- Animated Molecule Background ---
const MoleculeBackground = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Animated gradient orbs — staggered timing creates organic movement */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* Dot grid texture — subtle visual rhythm */}
        <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }}
        />

        {/* Floating molecular bond SVGs — CSS animated, no JS overhead */}
        <svg className="absolute top-[15%] left-[8%] w-40 h-40 opacity-[0.04] hero-float-a" viewBox="0 0 100 100">
            <circle cx="20" cy="50" r="8" fill="currentColor" className="text-purple-300" />
            <circle cx="80" cy="50" r="6" fill="currentColor" className="text-pink-300" />
            <line x1="28" y1="50" x2="74" y2="50" stroke="currentColor" strokeWidth="2" className="text-purple-400" />
            <circle cx="50" cy="20" r="5" fill="currentColor" className="text-blue-300" />
            <line x1="50" y1="25" x2="50" y2="45" stroke="currentColor" strokeWidth="1.5" className="text-blue-400" />
        </svg>

        <svg className="absolute bottom-[20%] right-[12%] w-32 h-32 opacity-[0.035] hero-float-b" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="7" fill="currentColor" className="text-cyan-300" />
            <circle cx="15" cy="20" r="5" fill="currentColor" className="text-teal-300" />
            <circle cx="65" cy="20" r="5" fill="currentColor" className="text-cyan-200" />
            <line x1="35" y1="35" x2="19" y2="23" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" />
            <line x1="45" y1="35" x2="61" y2="23" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400" />
        </svg>

        <svg className="absolute top-[60%] left-[70%] w-24 h-24 opacity-[0.03] hero-float-c" viewBox="0 0 60 60">
            <circle cx="30" cy="15" r="6" fill="currentColor" className="text-orange-300" />
            <circle cx="15" cy="45" r="5" fill="currentColor" className="text-amber-300" />
            <circle cx="45" cy="45" r="5" fill="currentColor" className="text-orange-200" />
            <line x1="27" y1="20" x2="18" y2="40" stroke="currentColor" strokeWidth="1.5" className="text-orange-400" />
            <line x1="33" y1="20" x2="42" y2="40" stroke="currentColor" strokeWidth="1.5" className="text-orange-400" />
            <line x1="20" y1="45" x2="40" y2="45" stroke="currentColor" strokeWidth="1.5" className="text-amber-400" />
        </svg>
    </div>
);

// --- Dynamic Heading Component ---
const TypewriterHeading = () => {
    const words = ["Master", "Visualize", "Ace", "Understand"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
        >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                <span className="block mb-3 text-slate-300 text-3xl sm:text-4xl md:text-5xl font-semibold">
                    Don&apos;t Just Memorize,
                </span>
                <span className="flex flex-wrap justify-center items-baseline gap-x-4 gap-y-1">
                    <span className="relative inline-block">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={words[index]}
                                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent inline-block"
                            >
                                {words[index]}
                            </motion.span>
                        </AnimatePresence>
                        {/* Glowing underline accent */}
                        <motion.div
                            key={`underline-${words[index]}`}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full origin-left"
                            style={{ boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)' }}
                        />
                    </span>
                    <span>Chemistry</span>
                </span>
            </h1>
        </motion.div>
    );
};

// --- Dynamic Search Bar ---
const DynamicSearchBar = () => {
    const placeholders = [
        "How to balance redox reactions?",
        "What is the trend of ionization energy?",
        "Show me the flame test for Copper",
        "Explain hybridization of CH4...",
    ];
    const [placeholder, setPlaceholder] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = placeholders[wordIndex];
        const typeSpeed = isDeleting ? 30 : 80;

        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex < currentWord.length) {
                setPlaceholder(currentWord.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
            } else if (isDeleting && charIndex > 0) {
                setPlaceholder(currentWord.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
            } else if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % placeholders.length);
            }
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, wordIndex]);

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-14 group z-20">
            {/* Animated border glow */}
            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-purple-500/50 via-pink-500/30 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]" />

            <div className="relative flex items-center bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-full p-2 pl-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-purple-500/20 transition-all duration-500">
                <Search className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                <input
                    type="text"
                    readOnly
                    value=""
                    placeholder={placeholder + "▌"}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 text-base sm:text-lg py-2.5 cursor-default"
                />
                {/* Keyboard shortcut hint */}
                <div className="hidden sm:flex items-center gap-1 mr-3 px-2 py-1 rounded-md bg-white/[0.06] border border-white/[0.08]">
                    <Command className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500 font-medium">K</span>
                </div>
                <button className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 sm:px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-[0_0_24px_rgba(168,85,247,0.4)] transition-all duration-300 active:scale-95 cursor-pointer">
                    Search
                </button>
            </div>

            {/* Search Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 text-sm">
                <span className="text-slate-600">Try:</span>
                {['Periodic Table', 'Salt Analysis', 'Chemical Bonding', 'Thermodynamics'].map((tag) => (
                    <button
                        key={tag}
                        className="text-slate-500 hover:text-purple-400 transition-colors duration-300 border-b border-dashed border-slate-700/50 hover:border-purple-400/50 cursor-pointer pb-0.5"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Bento Card Wrapper with animated border ---
const BentoCard = ({
    children,
    href,
    accentFrom,
    accentTo,
    className = '',
}: {
    children: React.ReactNode;
    href: string;
    accentFrom: string;
    accentTo: string;
    className?: string;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouse = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const spotlightX = useTransform(mouseX, (v: number) => `${v}px`);
    const spotlightY = useTransform(mouseY, (v: number) => `${v}px`);
    const spotlightBg = useTransform(
        [spotlightX, spotlightY],
        ([x, y]: string[]) => `radial-gradient(400px circle at ${x} ${y}, ${accentFrom}15, transparent 60%)`
    );

    return (
        <Link href={href} className={`group relative block ${className}`}>
            <div
                ref={cardRef}
                onMouseMove={handleMouse}
                className="relative h-full rounded-2xl sm:rounded-3xl overflow-hidden"
            >
                {/* Hover spotlight effect */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: spotlightBg }}
                />

                {/* Card body */}
                <div className="relative z-10 h-full bg-slate-950/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-500 group-hover:border-white/[0.12] group-hover:bg-slate-900/50">
                    {children}

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className="p-1.5 rounded-full bg-white/[0.06]">
                            <ArrowRight className="w-4 h-4 text-white/60" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Mini Simulations ---
const SaltAnalysisCard = () => (
    <BentoCard href="/salt-analysis" accentFrom="#3b82f6" accentTo="#8b5cf6" className="h-full">
        <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/10 rounded-xl">
                <FlaskConical className="w-5 h-5 text-blue-400" />
            </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Salt Analysis</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium tracking-wide uppercase">Virtual Lab Simulator</p>

        {/* Animated flame + test tube visualization */}
        <div className="relative h-28 flex justify-center items-end">
            {/* Flame glow base */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 w-16 h-12 bg-orange-500/20 rounded-full blur-xl"
            />
            {/* Primary flame */}
            <motion.div
                animate={{ height: ['50px', '66px', '50px'], opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 w-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200/0 blur-[2px] rounded-t-full"
            />
            {/* Inner flame core */}
            <motion.div
                animate={{ height: ['30px', '42px', '30px'] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                className="absolute bottom-0 w-2.5 bg-gradient-to-t from-white/60 to-transparent rounded-t-full"
            />
            {/* Test Tube */}
            <motion.div
                className="relative z-10 w-5 h-20 border border-white/20 border-t-0 rounded-b-full bg-white/[0.03] backdrop-blur-sm overflow-hidden mb-3 ml-6 origin-bottom"
                style={{ transform: 'rotate(12deg)' }}
            >
                <motion.div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500/50 to-emerald-400/20"
                    animate={{ height: ['28%', '38%', '28%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Bubble */}
                <motion.div
                    className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300/40 left-1"
                    animate={{ bottom: ['30%', '60%'], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
            </motion.div>
        </div>
    </BentoCard>
);

const PeriodicTableCard = () => {
    const elements = Array.from({ length: 56 });
    return (
        <BentoCard href="/interactive-periodic-table" accentFrom="#06b6d4" accentTo="#14b8a6" className="h-full">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/10 rounded-xl">
                    <Atom className="w-5 h-5 text-cyan-400" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Periodic Table</h3>
            <p className="text-xs text-slate-500 mb-5 font-medium tracking-wide uppercase">Interactive Trends</p>

            {/* Mini periodic table — wave reveal */}
            <div className="grid grid-cols-8 gap-[3px] sm:gap-1">
                {elements.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.15, scale: 0.8 }}
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.8, 1, 0.8] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: (Math.floor(i / 8) * 0.15) + ((i % 8) * 0.1),
                            ease: 'easeInOut',
                        }}
                        className="w-full aspect-square rounded-[2px] bg-cyan-400/40"
                        style={{
                            boxShadow: '0 0 4px rgba(34, 211, 238, 0.08)',
                        }}
                    />
                ))}
            </div>
        </BentoCard>
    );
};

const CrucibleCard = () => (
    <BentoCard href="/the-crucible" accentFrom="#f97316" accentTo="#ef4444" className="h-full">
        <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-orange-500/10 border border-orange-500/10 rounded-xl">
                <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-[10px] font-bold text-orange-400/80 bg-orange-900/20 px-2.5 py-1 rounded-full border border-orange-500/10 uppercase tracking-wider">
                Daily
            </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">The Crucible</h3>
        <p className="text-xs text-slate-500 mb-auto font-medium tracking-wide uppercase">Forge your routine</p>

        {/* Streak bars — staggered reveal with glow on peak */}
        <div className="flex items-end gap-1 mt-6 h-20">
            {[28, 48, 38, 68, 52, 82, 60].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${h}%`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex-1 rounded-t-sm transition-colors duration-300 ${i === 5
                        ? 'bg-gradient-to-t from-orange-600 to-orange-400'
                        : 'bg-slate-700/60 group-hover:bg-slate-600/60'
                        }`}
                    style={i === 5 ? { boxShadow: '0 0 16px rgba(249, 115, 22, 0.35)' } : {}}
                />
            ))}
        </div>
    </BentoCard>
);

const LargeFeatureCard = () => (
    <BentoCard href="/detailed-lectures" accentFrom="#a855f7" accentTo="#ec4899" className="col-span-1 md:col-span-2">
        <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none">
            <Sparkles size={100} />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/15 rounded-full text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-5">
                    <Sparkles size={10} />
                    <span>Featured</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                    Interactive Simulations
                </h3>
                <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
                    Experience chemistry like never before. Our simulations bridge the gap between theory and reality,
                    helping you visualize complex concepts effortlessly.
                </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 sm:mt-8">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="p-1 rounded bg-emerald-500/10">
                        <Target size={13} className="text-emerald-400" />
                    </div>
                    <span>Exam Focused</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="p-1 rounded bg-amber-500/10">
                        <Zap size={13} className="text-amber-400" />
                    </div>
                    <span>Instant Feedback</span>
                </div>
            </div>
        </div>
    </BentoCard>
);


// --- Main Hero Component ---
export default function NewHero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden bg-black">
            <MoleculeBackground />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* 1. Dynamic Heading */}
                <TypewriterHeading />

                {/* 2. Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed px-2"
                >
                    Experience the future of chemistry education.
                    From virtual labs to interactive periodic tables,
                    we provide the tools you need to{' '}
                    <span className="text-white font-semibold">understand</span>, not just memorize.
                </motion.p>

                {/* 3. Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex justify-center"
                >
                    <DynamicSearchBar />
                </motion.div>

                {/* 4. Asymmetric Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-10 sm:mt-12"
                >
                    {/* Large Feature Block — spans 2 cols */}
                    <LargeFeatureCard />

                    {/* Salt Analysis Mini Sim */}
                    <div className="col-span-1 min-h-[260px] md:min-h-0">
                        <SaltAnalysisCard />
                    </div>

                    {/* Crucible — daily practice */}
                    <div className="col-span-1 min-h-[260px]">
                        <CrucibleCard />
                    </div>

                    {/* Periodic Table — spans 2 cols */}
                    <div className="col-span-1 md:col-span-2 min-h-[260px]">
                        <PeriodicTableCard />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
