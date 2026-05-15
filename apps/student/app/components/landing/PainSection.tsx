'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Brain, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

const PAIN_POINTS = [
    {
        icon: Brain,
        stat: '70%',
        title: 'Forgotten in 24h',
        description: 'Without active recall, your brain constantly discards your chemistry revisions like spam.',
        color: 'text-rose-400',
        hoverGlow: 'group-hover:text-rose-300',
        spotlightColor: 'rgba(244, 63, 94, 0.4)', // rose-500
    },
    {
        icon: Clock,
        stat: '3 hrs',
        title: 'Daily Wasted Time',
        description: 'Highlighting textbooks and passive reading feels productive, but yields zero retention.',
        color: 'text-amber-400',
        hoverGlow: 'group-hover:text-amber-300',
        spotlightColor: 'rgba(251, 191, 36, 0.4)', // amber-500
    },
    {
        icon: RotateCcw,
        stat: '5x',
        title: 'More Revisions Needed',
        description: 'Cramming without spaced repetition forces you to relearn the same concepts over and over.',
        color: 'text-orange-400',
        hoverGlow: 'group-hover:text-orange-300',
        spotlightColor: 'rgba(249, 115, 22, 0.4)', // orange-500
    },
];

function PainCard({ pain, index, isInView }: { pain: typeof PAIN_POINTS[0]; index: number; isInView: boolean }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const Icon = pain.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={onMouseMove}
            className="flex flex-col items-start relative group p-8 -m-8 rounded-3xl"
        >
            {/* Spotlight Border */}
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            400px circle at ${mouseX}px ${mouseY}px,
                            ${pain.spotlightColor},
                            transparent 60%
                        )
                    `,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px',
                }}
            />

            {/* Giant Number as Heading */}
            <div className={`text-4xl md:text-5xl font-light tracking-tighter ${pain.color} mb-8 opacity-90 group-hover:opacity-100 ${pain.hoverGlow} transition-colors duration-500 drop-shadow-sm`}>
                {pain.stat}
            </div>

            {/* Icon + Text Block Layout */}
            <div className="flex items-start gap-4">
                <Icon size={24} className={`${pain.color} mt-0.5 shrink-0 opacity-90`} />
                <div className="flex flex-col">
                    <h3 className="text-xl text-white font-medium mb-2">
                        {pain.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                        {pain.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function PainSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full py-24 md:py-28 px-6 bg-[#050505] overflow-hidden">
            {/* Colorful Warning Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-900/10 rounded-full blur-[140px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center max-w-3xl mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-950/30 text-xs text-red-300/80 font-mono uppercase tracking-wider mb-6"
                    >
                        <AlertTriangle size={12} />
                        The Brutal Truth
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6"
                    >
                        Your Current Method is{' '}
                        <span className="pain-gradient-text">
                            Working Against You.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-base md:text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        Science proves most students study inefficiently. Here is what actually happens in your brain during traditional &quot;revision&quot;.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-y-0 md:gap-x-12 lg:gap-x-20 w-full mb-24">
                    {PAIN_POINTS.map((pain, i) => (
                        <PainCard key={i} pain={pain} index={i} isInView={isInView} />
                    ))}
                </div>

                {/* Footer Quote / Transition */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col items-center pt-12 border-t border-white/5 w-full max-w-2xl text-center"
                >
                    <p className="text-slate-400 text-base font-light">
                        The problem isn&apos;t that chemistry is hard. <br className="hidden md:block" />
                        The problem is that nobody taught you <span className="text-white font-medium">how to learn it.</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
