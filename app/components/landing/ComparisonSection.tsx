'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check } from 'lucide-react';

const COMPARISONS = [
    { old: 'Re-reading notes passively', new: 'Active recall with The Crucible' },
    { old: 'Random YouTube lectures', new: 'Structured one-shot & detailed courses' },
    { old: 'Memorizing reactions blindly', new: 'Visual mechanisms & interactive tools' },
    { old: 'No idea where you stand', new: 'Chapter-wise mastery analytics' },
    { old: 'Forgetting within a week', new: 'Spaced repetition locks it in' },
    { old: 'Generic study material', new: 'JEE/NEET specific PYQ practice' },
];

export default function ComparisonSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full py-24 md:py-28 px-6 bg-[#050505] overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[140px]" />
                <div className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[140px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center max-w-3xl mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300 font-mono uppercase tracking-wider mb-6"
                    >
                        Before vs After
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6"
                    >
                        What Changes When You{' '}
                        <span className="emerald-gradient-text">
                            Switch to Canvas.
                        </span>
                    </motion.h2>
                </div>

                {/* Comparison Cards */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">

                    {/* The Old Way Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col rounded-3xl border border-red-500/10 bg-red-950/10 p-8 md:p-10 relative overflow-hidden"
                    >
                        {/* Title */}
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-red-500/10">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                <X size={24} className="text-red-400/80" />
                            </div>
                            <h3 className="text-2xl font-medium text-slate-300 tracking-tight">
                                The Old Way
                            </h3>
                        </div>

                        {/* List */}
                        <div className="flex flex-col gap-8">
                            {COMPARISONS.map((row, i) => (
                                <div key={i} className="flex items-start gap-5 group">
                                    <div className="mt-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                        <X size={18} className="text-red-400" />
                                    </div>
                                    <span className="text-lg text-slate-400 font-light group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                                        {row.old}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* The Canvas Way Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8 md:p-10 relative overflow-hidden transform lg:scale-105 shadow-2xl shadow-emerald-900/10 z-10"
                    >
                        {/* Title */}
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-emerald-500/20">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]">
                                <Check size={24} className="text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-medium text-white tracking-tight drop-shadow-sm">
                                The Canvas Way
                            </h3>
                        </div>

                        {/* List */}
                        <div className="flex flex-col gap-8">
                            {COMPARISONS.map((row, i) => (
                                <div key={i} className="flex items-start gap-5 group">
                                    <div className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Check size={18} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                    </div>
                                    <span className="text-lg text-slate-200 font-medium group-hover:text-white transition-colors duration-300 leading-relaxed tracking-wide">
                                        {row.new}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
