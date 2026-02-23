'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Youtube, GraduationCap, Clock } from 'lucide-react';
import Image from 'next/image';

const CREDENTIALS = [
    { icon: Clock, text: '15+ years teaching experience', color: 'text-blue-400' },
    { icon: GraduationCap, text: 'B.Tech Mech Engg, NIT Hamirpur', color: 'text-emerald-400' },
    { icon: Youtube, text: '1M+ students impacted', color: 'text-red-400' },
    { icon: Award, text: 'Recognized by MHRD', color: 'text-amber-400' },
];

export default function PaarasSirSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section className="relative w-full py-24 md:py-28 px-6 bg-[#050505] overflow-hidden">
            {/* Subtle Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] -translate-y-1/2" />
            </div>

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Professional Typography & Info */}
                    <div className="flex flex-col z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300 font-mono uppercase tracking-wider mb-6"
                        >
                            Your Mentor
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6"
                        >
                            Taught by{' '}
                            <span className="newhero-gradient-text">
                                Paaras Sir
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-base md:text-lg text-slate-400 font-light leading-relaxed mb-10 max-w-xl"
                        >
                            An EdTech enthusiast and teaching geek who chose inspiring minds over conventional engineering. From a strong foundation at <strong className="text-slate-200">NIT Hamirpur</strong>, he has spent 15+ years empowering students to conquer JEE and NEET.
                        </motion.p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                            {CREDENTIALS.map((cred, i) => {
                                const Icon = cred.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-xs">
                                            <Icon size={18} className={cred.color} />
                                        </div>
                                        <span className="text-sm md:text-base text-slate-300 font-medium pt-2 leading-tight flex-1">
                                            {cred.text}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Elegant Quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="border-l-2 border-slate-700 pl-6 py-1"
                        >
                            <p className="text-base md:text-lg text-slate-400 italic font-light leading-relaxed">
                                &ldquo;Teaching is an art. I chose teaching over core engineering because I found my calling in interacting with the beautiful minds of our country.&rdquo;
                            </p>
                        </motion.div>
                    </div>

                    {/* Right: Uncontained Professional Image - No Cards */}
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] flex items-end justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-lg h-full lg:-right-8 xl:-right-16 drop-shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                        >
                            <Image
                                src="/paaras_hero.webp"
                                alt="Paaras Thakur"
                                fill
                                className="object-contain object-bottom opacity-90 hover:opacity-100 transition-opacity duration-700"
                                priority
                            />
                            {/* Seamless fade to black at bottom to perfectly blend the image cut into the section background */}
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#050505] to-transparent pointer-events-none" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
