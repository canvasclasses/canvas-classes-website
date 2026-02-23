'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    ArrowRight,
    Play,
    FileText,
    Zap,
    FlaskConical,
    BookOpen,
    Timer,
} from 'lucide-react';

// =============================================
// Shared Sub-components
// =============================================

function CardSimLayer({ children }: { children: ReactNode }) {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-0 pt-14 px-4 pb-4">
                {children}
            </div>
        </div>
    );
}

// --- Crucible: Animated score bars (bigger version) ---
const CrucibleSim = () => (
    <div className="flex items-end gap-2 h-full w-full px-2">
        {[20, 35, 28, 48, 38, 68, 52, 88, 60, 45, 72, 55, 80].map((h, i) => (
            <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${h}%`, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`flex-1 rounded-t-sm ${i === 7
                    ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                    : 'bg-white/[0.06] group-hover:bg-white/[0.10]'
                    } transition-colors duration-300`}
                style={i === 7 ? { boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' } : {}}
            />
        ))}
    </div>
);

// --- Periodic Table: Mini interactive grid ---
const MINI_ELEMENTS = [
    { s: 'H', c: '#60a5fa', col: 1, row: 1 },
    { s: 'He', c: '#a78bfa', col: 8, row: 1 },
    { s: 'Li', c: '#f87171', col: 1, row: 2 },
    { s: 'Be', c: '#fbbf24', col: 2, row: 2 },
    { s: 'B', c: '#34d399', col: 3, row: 2 },
    { s: 'C', c: '#60a5fa', col: 4, row: 2 },
    { s: 'N', c: '#60a5fa', col: 5, row: 2 },
    { s: 'O', c: '#f87171', col: 6, row: 2 },
    { s: 'F', c: '#60a5fa', col: 7, row: 2 },
    { s: 'Ne', c: '#a78bfa', col: 8, row: 2 },
    { s: 'Na', c: '#f87171', col: 1, row: 3 },
    { s: 'Mg', c: '#fbbf24', col: 2, row: 3 },
    { s: 'Al', c: '#60a5fa', col: 3, row: 3 },
    { s: 'Si', c: '#34d399', col: 4, row: 3 },
    { s: 'P', c: '#60a5fa', col: 5, row: 3 },
    { s: 'S', c: '#fbbf24', col: 6, row: 3 },
    { s: 'Cl', c: '#34d399', col: 7, row: 3 },
    { s: 'Ar', c: '#a78bfa', col: 8, row: 3 },
];

const PeriodicTableSim = () => {
    const [hovered, setHovered] = useState<string | null>(null);
    return (
        <div
            className="grid gap-[3px] h-full"
            style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}
        >
            {MINI_ELEMENTS.map((el, idx) => (
                <motion.div
                    key={el.s}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.02 }}
                    className="rounded-[3px] flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10"
                    style={{
                        gridColumn: el.col,
                        gridRow: el.row,
                        backgroundColor: hovered === el.s ? el.c : `${el.c}25`,
                        color: hovered === el.s ? '#000' : '#fff',
                        boxShadow: hovered === el.s ? `0 0 12px ${el.c}` : 'none',
                    }}
                    onMouseEnter={() => setHovered(el.s)}
                    onMouseLeave={() => setHovered(null)}
                >
                    {el.s}
                </motion.div>
            ))}
        </div>
    );
};

// --- Salt Analysis: Animated flame + test tube ---
const SaltAnalysisSim = () => (
    <div className="relative h-full flex items-end justify-center">
        <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 w-16 h-12 bg-orange-500/20 rounded-full blur-xl"
        />
        <motion.div
            animate={{ height: ['44px', '62px', '44px'], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 w-5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200/0 blur-[2px] rounded-t-full"
        />
        <motion.div
            animate={{ height: ['26px', '40px', '26px'] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            className="absolute bottom-0 w-2 bg-gradient-to-t from-blue-400/80 to-transparent rounded-t-full mix-blend-screen"
        />
        <div
            className="relative z-10 w-6 h-24 border border-white/20 border-t-0 rounded-b-full bg-white/[0.03] overflow-hidden mb-8 ml-8"
            style={{ transform: 'rotate(10deg)' }}
        >
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-7 h-[2px] bg-white/25 rounded-full" />
            <motion.div
                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500/60 to-cyan-400/40"
                animate={{ height: ['30%', '45%', '30%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
        <div className="absolute bottom-2 right-2 flex flex-col gap-1">
            {['Cu²⁺', 'Fe³⁺', 'Ni²⁺'].map((ion, i) => (
                <motion.span
                    key={ion}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                    className="text-[9px] font-mono text-blue-300/50"
                >
                    {ion}
                </motion.span>
            ))}
        </div>
    </div>
);

// --- Handwritten Notes: Animated lines ---
const HandwrittenNotesSim = () => (
    <div className="h-full flex flex-col gap-2 pt-2">
        {[85, 70, 90, 60, 80, 50].map((w, i) => (
            <motion.div
                key={i}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${w}%`, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="h-[3px] rounded-full bg-gradient-to-r from-amber-400/40 to-amber-400/10"
            />
        ))}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-auto flex items-center gap-2"
        >
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <FileText size={12} className="text-amber-400/60" />
            </div>
            <div className="space-y-1">
                <div className="h-1.5 w-16 bg-white/[0.06] rounded-full" />
                <div className="h-1.5 w-10 bg-white/[0.04] rounded-full" />
            </div>
        </motion.div>
    </div>
);

// --- 2-Min Chemistry: Timer ring ---
const TwoMinSim = () => (
    <div className="h-full flex items-center justify-center">
        <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6" strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="97.4"
                    initial={{ strokeDashoffset: 97.4 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-xs font-mono font-bold text-blue-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    2:00
                </motion.span>
            </div>
        </div>
    </div>
);

// --- Flashcards sim ---
const FlashcardSim = () => (
    <div className="h-full flex items-center justify-center relative">
        {[2, 1, 0].map((i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1 - i * 0.3, y: i * -4, x: i * 3, rotate: i * 2 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="absolute w-14 h-18 rounded-lg border border-white/10 bg-white/[0.03]"
                style={{ zIndex: 3 - i }}
            />
        ))}
        <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 w-14 h-18 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center"
        >
            <BookOpen size={14} className="text-emerald-400/60" />
        </motion.div>
    </div>
);

// --- Name Reactions sim ---
const NameReactionSim = () => (
    <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-1.5">
            <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[10px] font-mono text-purple-300/60"
            >
                R-X
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="w-6 h-[1px] bg-gradient-to-r from-purple-400/40 to-purple-400/80 relative"
            >
                <Zap size={8} className="text-purple-400/80 absolute -top-1 right-0" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-[10px] font-mono text-purple-300/60"
            >
                R-Nu
            </motion.div>
        </div>
    </div>
);

// =============================================
// Section Heading
// =============================================
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-20">
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 text-xs text-blue-300/80 font-mono uppercase tracking-wider mb-6"
            >
                {eyebrow}
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6"
            >
                {title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto"
            >
                {subtitle}
            </motion.p>
        </div>
    );
}

// =============================================
// Main FeaturesBento Component
// =============================================
export default function FeaturesBento() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <section className="relative w-full py-24 md:py-28 px-6 newhero-bg overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <SectionHeading
                    eyebrow="Your Arsenal"
                    title="Everything You Need. Nothing You Don't."
                    subtitle="Each tool is designed to eliminate a specific weakness in your chemistry prep. Pick your battle."
                />

                {/* ===== Bento Grid ===== */}
                {/* 6-column grid for fine-grained control */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-6 gap-3"
                >
                    {/* Row 1: Small | BIG CRUCIBLE (center) | Small */}
                    {/* 2-Min Chemistry — small (1 col on mobile, 1 col on md) */}
                    <Link
                        href="/2-minute-chemistry"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-1 min-h-[160px]"
                    >
                        <CardSimLayer>
                            <TwoMinSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Timer size={12} className="text-blue-400/70" />
                                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">2-Min Chem</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">Quick concepts</p>
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                    </Link>

                    {/* THE CRUCIBLE — BIG center card (4 cols, 2 rows) */}
                    <Link
                        href="/the-crucible"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-2 md:col-span-4 md:row-span-2 min-h-[280px] md:min-h-[420px]"
                    >
                        <CardSimLayer>
                            <CrucibleSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">The Crucible</h3>
                                <span className="text-[10px] font-mono font-bold text-blue-400/80 border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/10 uppercase tracking-wider">Flagship</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                                Adaptive PYQ simulator with spaced repetition, exam-grade analytics, and chapter-wise mastery tracking. The only practice tool you need.
                            </p>
                        </div>
                        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                                <span>Start Practicing</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* Flashcards — small */}
                    <Link
                        href="/chemistry-flashcards"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-1 min-h-[160px]"
                    >
                        <CardSimLayer>
                            <FlashcardSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <BookOpen size={12} className="text-emerald-400/70" />
                                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Flashcards</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">Spaced recall</p>
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                    </Link>

                    {/* Name Reactions — small */}
                    <Link
                        href="/organic-name-reactions"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-1 min-h-[160px]"
                    >
                        <CardSimLayer>
                            <NameReactionSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <FlaskConical size={12} className="text-purple-400/70" />
                                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Reactions</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">Name reactions</p>
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                    </Link>

                    {/* Row 2 sides (Crucible occupies center from row 1) */}
                    {/* Salt Analysis — mid (2 cols on md via col-span-1 + row placed next to crucible) */}
                    <Link
                        href="/salt-analysis"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-1 min-h-[200px]"
                    >
                        <CardSimLayer>
                            <SaltAnalysisSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-4">
                            <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">Salt Analysis</h3>
                            <p className="text-[10px] text-slate-500 leading-relaxed">Virtual lab simulation</p>
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                    </Link>

                    {/* Row 3: Mid-sized cards spanning bottom */}
                    {/* Periodic Table & Trends — mid (2 cols) */}
                    <Link
                        href="/interactive-periodic-table"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-2 md:col-span-2 min-h-[200px]"
                    >
                        <CardSimLayer>
                            <PeriodicTableSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-5">
                            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">Periodic Table & Trends</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Interactive element explorer with property heatmaps</p>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                        </div>
                    </Link>

                    {/* Handwritten Notes — mid (2 cols) */}
                    <Link
                        href="/handwritten-notes"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-2 md:col-span-2 min-h-[200px]"
                    >
                        <CardSimLayer>
                            <HandwrittenNotesSim />
                        </CardSimLayer>
                        <div className="relative z-10 p-5">
                            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">Handwritten Notes</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Paaras Sir&apos;s personal notes — exam-ready summaries</p>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                        </div>
                    </Link>

                    {/* NCERT Solutions — mid (2 cols) */}
                    <Link
                        href="/ncert-solutions"
                        className="newhero-bento-card rounded-2xl relative overflow-hidden group cursor-pointer col-span-2 md:col-span-2 min-h-[200px]"
                    >
                        <CardSimLayer>
                            <div className="h-full flex flex-col gap-2 pt-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.12 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[8px] font-mono text-emerald-400/50">
                                            Q{i}
                                        </div>
                                        <div className="flex-1 h-[3px] rounded-full bg-white/[0.04]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${60 + i * 10}%` }}
                                                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                                                className="h-full rounded-full bg-emerald-500/20"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardSimLayer>
                        <div className="relative z-10 p-5">
                            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">NCERT Solutions</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Chapter-wise solutions for Class 11 &amp; 12</p>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
