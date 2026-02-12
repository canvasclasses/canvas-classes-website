'use client';

import { useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, BookOpen, Trophy, Star } from 'lucide-react';

// Animated counter hook
function useAnimatedCounter(target: number, isInView: boolean, duration = 2) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!isInView) return;
        const controls = animate(0, target, {
            duration,
            ease: 'easeOut',
            onUpdate: (v) => setValue(Math.round(v)),
        });
        return () => controls.stop();
    }, [isInView, target, duration]);
    return value;
}

const STATS = [
    { icon: Users, value: 50000, suffix: '+', label: 'Students Trusted Us', color: 'text-blue-400' },
    { icon: BookOpen, value: 500, suffix: '+', label: 'Video Lectures', color: 'text-emerald-400' },
    { icon: Trophy, value: 10000, suffix: '+', label: 'Practice Questions', color: 'text-amber-400' },
    { icon: Star, value: 98, suffix: '%', label: 'Student Satisfaction', color: 'text-purple-400' },
];

const TESTIMONIALS = [
    {
        quote: 'I went from 40% to 85% in chemistry within 3 months. The Crucible literally changed how I approach PYQs.',
        name: 'Arjun M.',
        detail: 'JEE Advanced 2025 — AIR 1,247',
        avatar: 'A',
    },
    {
        quote: 'Paaras Sir\'s notes are better than any coaching material I\'ve seen. And the spaced repetition keeps it in my head.',
        name: 'Priya S.',
        detail: 'NEET 2025 — 680/720',
        avatar: 'P',
    },
    {
        quote: 'Salt analysis was my nightmare. The virtual lab simulator made it intuitive. I scored full marks in boards.',
        name: 'Rohan K.',
        detail: 'CBSE 2025 — 97% in Chemistry',
        avatar: 'R',
    },
];

export default function SocialProofSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative w-full py-24 px-6 newhero-bg overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/6 rounded-full blur-[140px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-5xl mx-auto">
                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
                >
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        const count = useAnimatedCounter(stat.value, isInView);
                        return (
                            <div
                                key={i}
                                className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6"
                            >
                                <Icon size={20} className={`${stat.color} mx-auto mb-3 opacity-60`} />
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                                    {stat.value >= 1000 ? `${Math.round(count / 1000)}k` : count}{stat.suffix}
                                </div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Testimonials heading */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 text-xs text-blue-300/80 font-mono uppercase tracking-wider mb-5"
                    >
                        Real Results
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
                    >
                        Students Who Stopped Guessing,{' '}
                        <span className="newhero-gradient-text">Started Winning</span>
                    </motion.h2>
                </div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex gap-0.5 mb-4">
                                {[...Array(5)].map((_, si) => (
                                    <Star key={si} size={12} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-5">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{t.name}</div>
                                    <div className="text-[11px] text-slate-500">{t.detail}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
