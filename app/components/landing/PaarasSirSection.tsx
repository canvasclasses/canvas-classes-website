'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Youtube, GraduationCap, Clock } from 'lucide-react';

const CREDENTIALS = [
    { icon: Clock, text: '15+ years teaching experience', color: 'text-blue-400' },
    { icon: GraduationCap, text: 'Ex-Allen, Ex-Unacademy faculty', color: 'text-emerald-400' },
    { icon: Youtube, text: '50,000+ students taught', color: 'text-red-400' },
    { icon: Award, text: 'Hundreds of IIT/AIIMS selections', color: 'text-amber-400' },
];

export default function PaarasSirSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="relative w-full py-24 px-6 newhero-bg overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-800/6 rounded-full blur-[120px]" />
            </div>

            <div ref={ref} className="relative z-10 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Left: Info */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-950/30 text-xs text-amber-300/80 font-mono uppercase tracking-wider mb-5"
                        >
                            Your Mentor
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
                        >
                            Taught by{' '}
                            <span className="newhero-gradient-text">Paaras Sir</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-base text-slate-400 leading-relaxed mb-8"
                        >
                            Not just another YouTube teacher. Paaras Sir has spent 15 years in the trenches of competitive chemistry — at Allen, at Unacademy, and now building Canvas Classes to make elite-level coaching accessible to everyone, for free.
                        </motion.p>

                        <div className="space-y-3">
                            {CREDENTIALS.map((cred, i) => {
                                const Icon = cred.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                            <Icon size={14} className={cred.color} />
                                        </div>
                                        <span className="text-sm text-slate-300">{cred.text}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Visual card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 text-center"
                    >
                        {/* Avatar placeholder */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-white/10 mx-auto mb-5 flex items-center justify-center">
                            <span className="text-3xl font-bold newhero-gradient-text">P</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Paaras Thakur</h3>
                        <p className="text-sm text-slate-500 mb-6">Founder & Chemistry Educator</p>

                        {/* Quote */}
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                            <p className="text-sm text-slate-300 leading-relaxed italic">
                                &ldquo;Chemistry isn&apos;t about memorizing — it&apos;s about seeing patterns. Once you see them, you can&apos;t unsee them. That&apos;s what Canvas is built to do.&rdquo;
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
