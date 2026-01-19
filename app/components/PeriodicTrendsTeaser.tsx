'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Zap, LineChart, AlertCircle } from 'lucide-react';

export default function PeriodicTrendsTeaser() {
    return (
        <section className="py-20 px-4 bg-gray-950 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/20 via-gray-950 to-gray-950" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium"
                        >
                            <Zap className="w-4 h-4" />
                            <span>Correctness &gt; Memorization</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white leading-tight"
                        >
                            Stop Memorizing <br />
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                Periodic Trends
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg leading-relaxed max-w-xl"
                        >
                            Why does Ionization Energy drop after Nitrogen? Why is Fluorine's Electron Gain Enthalpy lower than Chlorine's?
                            <br /><br />
                            <span className="text-gray-200 font-semibold">Don't just read exceptions. See them.</span> Analyze trends across s, p, d, and f blocks with our interactive visualizer.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                href="/periodic-trends"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-violet-600/25 transition-all transform hover:-translate-y-0.5"
                            >
                                <LineChart className="w-5 h-5" />
                                Visualize Trends
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Visual Teaser (Animated Graph) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Card container */}
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 md:p-8 shadow-2xl relative overflow-hidden group">

                            {/* Decorative glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-colors duration-500" />

                            {/* Mock Graph UI */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-gray-400 text-sm font-medium">Trend Analysis</div>
                                        <div className="text-white text-xl font-bold">First Ionization Enthalpy</div>
                                    </div>
                                    <div className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-mono text-violet-300 border border-gray-700">
                                        Period 2 Elements
                                    </div>
                                </div>

                                {/* Graph Area */}
                                <div className="h-48 w-full bg-gray-950/50 rounded-xl border border-gray-800 relative flex items-end p-4 gap-2 md:gap-4 overflow-hidden">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 grid grid-rows-4 gap-4 opacity-10 pointer-events-none">
                                        {[...Array(4)].map((_, i) => <div key={i} className="border-t border-gray-400 w-full" />)}
                                    </div>

                                    {/* Mock Data Points (Period 2 IE trend approximation) */}
                                    {/* Li, Be, B, C, N, O, F, Ne */}
                                    {/* 520, 899, 801, 1086, 1402, 1314, 1681, 2080 */}
                                    {/* Scaled for visualization height percentages roughly */}
                                    {[25, 43, 38, 52, 67, 63, 80, 100].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${height}%` }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + (i * 0.1), duration: 0.8, type: "spring" }}
                                            className="flex-1 bg-gradient-to-t from-violet-600/20 to-violet-500 rounded-t-md relative group/bar hover:from-fuchsia-600/40 hover:to-fuchsia-500 transition-colors cursor-pointer"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-700 pointer-events-none">
                                                {['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'][i]}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Trend Line Overlay (SVG) */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                                        <motion.path
                                            d="M 10 75 L 50 57 L 90 62 L 130 48 L 170 33 L 210 37 L 250 20 L 290 0" // Approximate path for visuals
                                            fill="none"
                                            stroke="#a78bfa"
                                            strokeWidth="2"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            whileInView={{ pathLength: 1, opacity: 0.5 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1, duration: 1.5 }}
                                            className="opacity-50"
                                        />
                                    </svg>
                                </div>

                                {/* Alert Box for Exception */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl"
                                >
                                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-rose-300 text-sm font-semibold">Exception Detected</div>
                                        <div className="text-gray-400 text-xs mt-0.5">Boron's IE is lower than Beryllium's due to 2p penetration.</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
