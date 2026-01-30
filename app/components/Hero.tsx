'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Sparkles } from 'lucide-react';

const stats = [
    { value: '2K+', label: 'Chemistry Videos' },
    { value: '1M+', label: 'Students Helped' },
    { value: '15+', label: 'Years Experience' },
    { value: 'FREE', label: 'Content' },
];

export default function Hero() {
    return (
        <section className="relative flex flex-col w-full overflow-hidden bg-slate-950">

            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0">
                {/* Main gradient orbs */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10 flex items-center pt-24 lg:pt-32 pb-12">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-16 py-4 lg:py-6">

                        {/* Left Side - Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-start w-full lg:w-[55%] lg:max-w-[620px] flex-shrink-0"
                        >
                            {/* Personal Hook */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-500/20"
                            >
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-300 font-medium text-sm">Searching for someone who gets it?</span>
                            </motion.div>

                            {/* Main Headline */}
                            <h1 className="font-bold leading-[1.15] text-white mb-6">
                                <span className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">Chemistry</span>
                                <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl"> isn't just about </span>
                                <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">formulas</span>
                                <br />
                                <span className="text-slate-400 text-2xl sm:text-3xl lg:text-3xl xl:text-4xl">— it's about understanding</span>
                                <br className="sm:hidden" />
                                <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> WHY</span>{' '}
                                <span className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-white">things work.</span>
                            </h1>

                            {/* Personal Message */}
                            <div className="mb-8 pl-4 border-l-2 border-purple-500/50">
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    If you've struggled to find a teacher who{' '}
                                    <span className="text-purple-300 font-medium">feeds your curiosity</span>{' '}
                                    instead of shutting it down,{' '}
                                    <span className="text-white font-semibold">you've found your place.</span>
                                </p>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center gap-2 mb-8">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-emerald-400 font-medium text-sm">Trusted by 1M+ curious minds across India</span>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-10">
                                <Link href="#approach">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/25"
                                    >
                                        <Play className="w-5 h-5" />
                                        Start Learning Free
                                    </motion.button>
                                </Link>
                                <Link href="/about">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="cursor-pointer border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 font-semibold px-7 py-3.5 rounded-xl transition-all"
                                    >
                                        Meet Paaras Sir
                                    </motion.button>
                                </Link>
                            </div>


                        </motion.div>

                        {/* Right Side - Photo Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:flex justify-end flex-1 items-start pt-0"
                        >
                            <div className="relative w-[350px] xl:w-[400px]">
                                {/* Glow behind card */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl scale-105" />

                                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="relative h-[420px] xl:h-[480px] w-full">
                                        <Image
                                            src="/paaras_hero.webp"
                                            alt="Paaras Sir - Chemistry Expert"
                                            fill
                                            className="object-contain object-bottom"
                                            priority
                                        />
                                    </div>

                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg whitespace-nowrap">
                                        ✨ EdTech Pioneer Since 2014
                                    </div>
                                </div>

                                {/* Instructor Info - Moved here */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-6 flex items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                        P
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg leading-tight">Paaras Thakur</p>
                                        <p className="text-slate-400 text-sm mt-0.5 font-medium">JEE Chemistry Expert</p>
                                        <p className="text-slate-500 text-xs mt-1">Ex - Allen, Resonance, Unacademy, PW</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* Mobile Photo Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10 lg:hidden flex justify-center px-6 pb-8"
            >
                <div className="relative w-64 sm:w-72">
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl scale-105" />

                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="relative h-[300px] sm:h-[360px] w-full">
                            <Image
                                src="/paaras_hero.webp"
                                alt="Paaras Sir - Chemistry Expert"
                                fill
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>

                    </div>
                </div>

                {/* Instructor Info - Mobile */}
                <div className="mt-6 flex items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                        P
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-tight">Paaras Thakur</p>
                        <p className="text-slate-400 text-sm mt-0.5 font-medium">JEE Chemistry Expert</p>
                        <p className="text-slate-500 text-xs mt-1">Ex - Allen, Resonance, Unacademy, PW</p>
                    </div>
                </div>
            </motion.div>


            {/* Stats Section */}
            <div className="relative z-10 py-10 border-t border-white/5 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-full max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group text-center"
                            >
                                <div className="p-5 lg:p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 hover:bg-slate-800/50 transition-all duration-300">
                                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-slate-500 font-medium text-xs sm:text-sm">
                                        {stat.label}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
}
