'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTASection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative w-full py-24 md:py-28 px-6 newhero-bg overflow-hidden">
            {/* Multi-layered glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
                <div className="absolute bottom-10 left-1/3 w-[300px] h-[200px] bg-purple-600/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-1/3 w-[300px] h-[200px] bg-blue-500/8 rounded-full blur-[100px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 text-xs text-blue-300/80 font-mono uppercase tracking-wider mb-6"
                >
                    <Sparkles size={12} />
                    100% Free. No Catch.
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6 leading-[1.15]"
                >
                    Every Day You Wait,{' '}
                    <br className="hidden md:block" />
                    <span className="newhero-gradient-text">Someone Else Pulls Ahead</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base md:text-lg text-slate-400 font-light leading-relaxed mb-10 max-w-xl mx-auto"
                >
                    JEE and NEET don&apos;t wait. Your syllabus doesn&apos;t shrink. But with the right tools, you can cover more ground in less time — starting right now.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/the-crucible"
                        className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                    >
                        Start The Crucible
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        href="/one-shot-lectures"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 font-medium text-base hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                    >
                        Browse Lectures
                    </Link>
                </motion.div>

                {/* Trust line */}
                {/* <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-8 text-xs text-slate-600"
                >
                    No sign-up required. No credit card. Just start learning.
                </motion.p> */}
            </div>
        </section>
    );
}
