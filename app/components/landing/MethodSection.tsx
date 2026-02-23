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
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        hoverColor: 'group-hover:text-blue-300',
        numColor: 'text-blue-400/30 group-hover:text-blue-400/60',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]'
    },
    {
        num: '02',
        icon: Target,
        title: 'Practice With Purpose',
        desc: 'The Crucible adapts to your weak spots. Every question you solve makes the next session smarter.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        hoverColor: 'group-hover:text-emerald-300',
        numColor: 'text-emerald-400/30 group-hover:text-emerald-400/60',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]'
    },
    {
        num: '03',
        icon: Repeat,
        title: 'Spaced Repetition',
        desc: 'Our algorithm shows you what you\'re about to forget — right before you forget it. Science-backed retention.',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        hoverColor: 'group-hover:text-purple-300',
        numColor: 'text-purple-400/30 group-hover:text-purple-400/60',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]'
    },
    {
        num: '04',
        icon: TrendingUp,
        title: 'Track & Improve',
        desc: 'Chapter-wise analytics reveal your real score potential. No more guessing where you stand.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        hoverColor: 'group-hover:text-amber-300',
        numColor: 'text-amber-400/30 group-hover:text-amber-400/60',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.2)]'
    },
];

export default function MethodSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full py-32 px-6 bg-[#050505] overflow-hidden">
            {/* Colorful Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-900/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-900/15 rounded-full blur-[100px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto flex flex-col">

                {/* Header Sequence */}
                <div className="max-w-3xl mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs text-blue-300 font-mono uppercase tracking-wider mb-8"
                    >
                        The Canvas Method
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6"
                    >
                        Built Around How Your{' '}
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400 drop-shadow-sm">
                            Brain Actually Works.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-base md:text-lg text-slate-400 font-light max-w-2xl"
                    >
                        We don&apos;t just throw content at you. Every feature follows cognitive science principles to maximize what sticks.
                    </motion.p>
                </div>

                {/* Dynamic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-16 border-t border-white/5 pt-16">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col items-start relative group"
                            >
                                <div className="flex w-full items-end justify-between mb-8 border-b border-white/5 pb-6 transition-colors duration-500">
                                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl border ${step.border} ${step.bg} transition-all duration-500 ${step.glow}`}>
                                        <Icon size={24} className={`${step.color} ${step.hoverColor} transition-colors duration-500`} />
                                    </div>
                                    <span className={`text-5xl md:text-6xl font-light ${step.numColor} transition-colors duration-500 tracking-tighter`}>
                                        {step.num}
                                    </span>
                                </div>

                                <h3 className="text-xl text-white font-medium mb-3">
                                    {step.title}
                                </h3>

                                <p className="text-sm text-slate-400 leading-relaxed font-light">
                                    {step.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
