'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

// Animated counter hook
function useAnimatedCounter(target: number, isInView: boolean, duration = 2) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!isInView) return;
        const controls = animate(0, target, {
            duration,
            ease: [0.22, 1, 0.36, 1], // ease out cubic
            onUpdate: (v) => setValue(Math.round(v)),
        });
        return () => controls.stop();
    }, [isInView, target, duration]);
    return value;
}

const STATS = [
    { value: 300000, suffix: '+', label: 'Students Trusted Us', description: 'across India who have transformed their chemistry prep with our platform.', color: 'text-blue-400', glow: 'from-blue-500/20' },
    { value: 2000, suffix: '+', label: 'Video Lectures', description: 'of structured, high-yield content covering every single concept in depth.', color: 'text-emerald-400', glow: 'from-emerald-500/20' },
    { value: 4000, suffix: '+', label: 'Practice Questions', description: 'hand-picked, JEE/NEET relevant problems with detailed video solutions.', color: 'text-amber-400', glow: 'from-amber-500/20' },
];

export default function StatsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full py-24 md:py-28 px-6 bg-[#050505] overflow-hidden">
            {/* Colorful Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-900/10 rounded-full blur-[150px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">

                {/* Heading sequence */}
                <div className="text-center max-w-3xl mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6"
                    >
                        Numbers That{' '}
                        <span className="violet-gradient-text">
                            Speak for Themselves.
                        </span>
                    </motion.h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-y-0 md:gap-x-12 lg:gap-x-20 w-full md:pb-8">
                    {STATS.map((stat, i) => {
                        const count = useAnimatedCounter(stat.value, isInView, 2.5);
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col items-center text-center relative group"
                            >
                                {/* Distinctive large number typography with color */}
                                <div className={`text-4xl md:text-5xl font-light tracking-tighter ${stat.color} mb-4 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 flex items-baseline drop-shadow-md`}>
                                    {stat.value >= 1000 ? `${Math.round(count / 1000)}k` : count}
                                    <span className={`text-4xl md:text-5xl ${stat.color} opacity-50 ml-1`}>{stat.suffix}</span>
                                </div>

                                <h3 className="text-lg md:text-xl text-white font-medium tracking-wide mb-2">
                                    {stat.label}
                                </h3>

                                <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm">
                                    {stat.description}
                                </p>

                                {/* subtle bottom glow on hover */}
                                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-linear-to-t ${stat.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-full`} />

                                {/* Divider for desktop */}
                                {i !== STATS.length - 1 && (
                                    <div className="hidden md:block absolute right-[-24px] lg:right-[-40px] top-[20%] bottom-[20%] w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
