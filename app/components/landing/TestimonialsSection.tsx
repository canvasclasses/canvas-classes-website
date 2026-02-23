'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        quote: 'I went from 40% to 85% in chemistry within 3 months. The Crucible literally changed how I approach PYQs.',
        name: 'Arjun M.',
        detail: 'JEE Advanced 2025 — AIR 1,247',
        avatar: 'A',
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/20',
        cardGlow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]',
        cardBorderHover: 'hover:border-blue-500/30'
    },
    {
        quote: 'Paaras Sir\'s notes are better than any coaching material I\'ve seen. And the spaced repetition keeps it in my head.',
        name: 'Priya S.',
        detail: 'NEET 2025 — 680/720',
        avatar: 'P',
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/20',
        cardGlow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]',
        cardBorderHover: 'hover:border-purple-500/30'
    },
    {
        quote: 'Salt analysis was my nightmare. The virtual lab simulator made it intuitive. I scored full marks in boards.',
        name: 'Rohan K.',
        detail: 'CBSE 2025 — 97% in Chemistry',
        avatar: 'R',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/20',
        cardGlow: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]',
        cardBorderHover: 'hover:border-emerald-500/30'
    },
];

export default function TestimonialsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full py-32 px-6 bg-[#050505] overflow-hidden">
            {/* Colorful Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">

                {/* Heading */}
                <div className="text-center max-w-3xl mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 text-xs text-blue-300/80 font-mono uppercase tracking-wider mb-8"
                    >
                        Real Results
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6"
                    >
                        Students Who Stopped Guessing,{' '}
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-300 to-purple-400 drop-shadow-sm">
                            Started Winning.
                        </span>
                    </motion.h2>
                </div>

                {/* Testimonial grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex flex-col p-8 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-500 group backdrop-blur-sm ${t.cardGlow} ${t.cardBorderHover}`}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, si) => (
                                    <Star key={si} size={14} className="text-amber-400 fill-amber-400 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                ))}
                            </div>

                            <p className="text-base text-slate-300 leading-relaxed font-light flex-1 mb-8">
                                &ldquo;{t.quote}&rdquo;
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                <div className={`w-12 h-12 rounded-full ${t.bg} border ${t.border} flex items-center justify-center text-lg font-medium ${t.color}`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-base font-medium text-white group-hover:text-blue-200 transition-colors duration-300">{t.name}</div>
                                    <div className="text-sm text-slate-500 mt-0.5">{t.detail}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
