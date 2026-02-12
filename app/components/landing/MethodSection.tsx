'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Repeat, Eye, Target, TrendingUp } from 'lucide-react';

const STEPS = [
    {
        num: '01',
        icon: Eye,
        title: 'Understand, Don\'t Memorize',
        desc: 'Visual explanations and interactive tools make concepts click — not stick temporarily.',
        color: 'text-blue-400',
        borderColor: 'border-blue-500/20',
        glowColor: 'bg-blue-500/10',
    },
    {
        num: '02',
        icon: Target,
        title: 'Practice With Purpose',
        desc: 'The Crucible adapts to your weak spots. Every question you solve makes the next session smarter.',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        glowColor: 'bg-emerald-500/10',
    },
    {
        num: '03',
        icon: Repeat,
        title: 'Spaced Repetition',
        desc: 'Our algorithm shows you what you\'re about to forget — right before you forget it. Science-backed retention.',
        color: 'text-purple-400',
        borderColor: 'border-purple-500/20',
        glowColor: 'bg-purple-500/10',
    },
    {
        num: '04',
        icon: TrendingUp,
        title: 'Track & Improve',
        desc: 'Chapter-wise analytics reveal your real score potential. No more guessing where you stand.',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/20',
        glowColor: 'bg-amber-500/10',
    },
];

export default function MethodSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative w-full py-24 px-6 newhero-bg overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-900/8 rounded-full blur-[100px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-5xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/30 text-xs text-emerald-300/80 font-mono uppercase tracking-wider mb-5"
                    >
                        The Canvas Method
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
                    >
                        Built Around How Your{' '}
                        <span className="newhero-gradient-text">Brain Actually Works</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base text-slate-400 leading-relaxed"
                    >
                        We don&apos;t just throw content at you. Every feature follows cognitive science principles to maximize what sticks.
                    </motion.p>
                </div>

                {/* Steps — vertical timeline on mobile, 2x2 grid on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                                className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 group hover:border-blue-500/20 transition-all duration-300`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.glowColor} border ${step.borderColor} flex items-center justify-center`}>
                                        <Icon size={20} className={step.color} />
                                    </div>
                                    <div>
                                        <span className={`text-xs font-mono ${step.color} opacity-60`}>{step.num}</span>
                                        <h3 className="text-base font-semibold text-white mt-0.5 mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
