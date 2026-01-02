'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';

const stats = [
    { value: '2K+', label: 'Chemistry Videos' },
    { value: '1M+', label: 'Students Helped' },
    { value: '15+', label: 'Years Experience' },
    { value: 'FREE', label: 'Content' },
];

export default function Hero() {
    return (
        <section className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[#0a0a1a]">

            {/* Molecular Flow Background - Positioned to the right */}
            <div className="absolute inset-0 z-0 select-none">
                <Image
                    src="/molecular_bg.png"
                    alt="Molecular Background"
                    fill
                    className="object-cover object-right"
                    priority
                    quality={100}
                />
                {/* Strong left gradient to keep text area clean */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-[#0a0a1a]/90 to-transparent" />
            </div>

            {/* Main Hero Content - Fixed left padding for consistent alignment */}
            <div className="relative z-10 flex-1 flex items-center pt-28 lg:pt-24">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-16 py-12 lg:py-8">

                        {/* Left Side - Text Content - Fixed width */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-start w-full lg:w-[50%] lg:max-w-[560px] flex-shrink-0"
                        >
                            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-white mb-6">
                                Master<br />
                                Chemistry <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">with</span><br />
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Confidence</span>
                            </h1>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                                <span className="text-yellow-400 font-medium text-sm">Trusted by 1M+ Students Worldwide</span>
                            </div>

                            <p className="text-xl text-white font-medium mb-2">
                                Complete preparation for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">JEE & NEET</span>
                            </p>

                            <p className="text-gray-400 mb-8 text-base">
                                Expert video lectures, handwritten notes, and comprehensive practice<br className="hidden sm:block" />
                                materials — all absolutely free
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-10">
                                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-purple-500/25">
                                    <Play className="w-5 h-5" />
                                    Start Learning
                                </button>
                                <button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 font-semibold px-6 py-3 rounded-lg transition-colors">
                                    About Paaras Sir
                                </button>
                            </div>

                            {/* Instructor Badge */}
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                    P
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Paaras Sir</p>
                                    <p className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐ 15+ Years Experience</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Photo Card - Bigger and aligned with heading */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:flex justify-end flex-1 items-start pt-0"
                        >
                            <div className="relative w-[420px] xl:w-[480px]">
                                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="relative h-[500px] xl:h-[560px] w-full">
                                        <Image
                                            src="/paaras_hero.png"
                                            alt="Paaras Sir - Chemistry Expert"
                                            fill
                                            className="object-contain object-bottom"
                                            priority
                                        />
                                    </div>

                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg whitespace-nowrap">
                                        Chemistry Educator & EdTech Pioneer
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* Mobile Photo Card - Shows below text on smaller screens */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10 lg:hidden flex justify-center px-6 pb-8"
            >
                <div className="relative w-72 sm:w-80">
                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="relative h-[380px] sm:h-[420px] w-full">
                            <Image
                                src="/paaras_hero.png"
                                alt="Paaras Sir - Chemistry Expert"
                                fill
                                className="object-contain object-bottom"
                                priority
                            />
                        </div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-xs shadow-lg whitespace-nowrap">
                            Chemistry Educator & EdTech Pioneer
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Section - Matching Old Design */}
            <div className="relative z-10 bg-gradient-to-br from-slate-50 via-purple-50/50 to-pink-50/30 py-12">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -4,
                                    transition: { duration: 0.25 }
                                }}
                                className="relative cursor-pointer group"
                            >
                                <div className={`relative rounded-2xl p-6 lg:p-8 text-center overflow-hidden transition-all duration-300 group-hover:shadow-xl ${index % 2 === 0
                                    ? 'bg-gradient-to-br from-purple-50 to-pink-100/80 border border-purple-200/50'
                                    : 'bg-gradient-to-br from-pink-50 to-purple-100/80 border border-pink-200/50'
                                    }`}>
                                    <p className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                                        {stat.label}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
