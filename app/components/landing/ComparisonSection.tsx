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
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative w-full py-24 px-6 newhero-bg overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-900/6 rounded-full blur-[120px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 text-xs text-blue-300/80 font-mono uppercase tracking-wider mb-5"
                    >
                        Before vs After
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
                    >
                        What Changes When You{' '}
                        <span className="newhero-gradient-text">Switch to Canvas</span>
                    </motion.h2>
                </div>

                {/* Comparison table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
                >
                    {/* Header */}
                    <div className="grid grid-cols-2 border-b border-white/[0.06]">
                        <div className="p-4 md:p-5 text-center">
                            <span className="text-xs font-mono uppercase tracking-wider text-red-400/70">Without Canvas</span>
                        </div>
                        <div className="p-4 md:p-5 text-center border-l border-white/[0.06]">
                            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400/70">With Canvas</span>
                        </div>
                    </div>

                    {/* Rows */}
                    {COMPARISONS.map((row, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                            className={`grid grid-cols-2 ${i < COMPARISONS.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                        >
                            <div className="p-4 md:p-5 flex items-center gap-3">
                                <X size={14} className="text-red-400/50 flex-shrink-0" />
                                <span className="text-sm text-slate-500">{row.old}</span>
                            </div>
                            <div className="p-4 md:p-5 flex items-center gap-3 border-l border-white/[0.06]">
                                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                                <span className="text-sm text-white/80">{row.new}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
