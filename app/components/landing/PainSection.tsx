'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, Brain, Clock, RotateCcw } from 'lucide-react';

const PAIN_POINTS = [
    {
        icon: Brain,
        stat: '70%',
        label: 'of what you study is forgotten within 24 hours',
        subtext: 'Without active recall, your brain treats chemistry like spam.',
        color: 'text-red-400',
        borderColor: 'border-red-500/20',
        bgColor: 'bg-red-500/5',
    },
    {
        icon: Clock,
        stat: '3 hrs',
        label: 'average daily time wasted on passive re-reading',
        subtext: 'Highlighting textbooks feels productive. It isn\'t.',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/20',
        bgColor: 'bg-amber-500/5',
    },
    {
        icon: RotateCcw,
        stat: '5x',
        label: 'more revisions needed without spaced repetition',
        subtext: 'Cramming the night before? Your neurons disagree.',
        color: 'text-orange-400',
        borderColor: 'border-orange-500/20',
        bgColor: 'bg-orange-500/5',
    },
];

export default function PainSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative w-full py-24 px-6 newhero-bg overflow-hidden">
            {/* Subtle red-ish warning glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-900/5 rounded-full blur-[120px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-5xl mx-auto">
                {/* Section heading */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-950/30 text-xs text-red-300/80 font-mono uppercase tracking-wider mb-5"
                    >
                        <AlertTriangle size={12} />
                        The Brutal Truth
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
                    >
                        Your Current Method is{' '}
                        <span className="text-red-400">Working Against You</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base text-slate-400 leading-relaxed"
                    >
                        Science says most students study inefficiently. Here&apos;s what&apos;s really happening in your brain during &quot;revision.&quot;
                    </motion.p>
                </div>

                {/* Pain point cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PAIN_POINTS.map((pain, i) => {
                        const Icon = pain.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                                className={`rounded-2xl border ${pain.borderColor} ${pain.bgColor} p-6 backdrop-blur-sm`}
                            >
                                <div className={`w-10 h-10 rounded-xl ${pain.bgColor} border ${pain.borderColor} flex items-center justify-center mb-4`}>
                                    <Icon size={18} className={pain.color} />
                                </div>
                                <div className={`text-4xl font-bold ${pain.color} mb-1`}>{pain.stat}</div>
                                <p className="text-sm text-white/80 font-medium mb-2">{pain.label}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{pain.subtext}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Transition line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-center text-slate-500 text-sm mt-12 max-w-lg mx-auto"
                >
                    The problem isn&apos;t that chemistry is hard. The problem is that nobody taught you <span className="text-white font-medium">how to learn it</span>.
                </motion.p>
            </div>
        </section>
    );
}
