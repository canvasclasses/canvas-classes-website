'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Beaker, ArrowRight, Sparkles, Zap, Microscope } from 'lucide-react';

export default function SaltAnalysisTeaser() {
    return (
        <section className="relative w-full py-20 px-4 overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <Link href="/salt-analysis" className="group block">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 hover:border-purple-500/50 transition-colors duration-500">

                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="grid md:grid-cols-2 gap-12 items-center">

                            {/* Text Content */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span className="text-sm font-semibold text-purple-300 tracking-wide uppercase">New Interactive Module</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                    Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Salt Analysis</span> with Virtual Labs
                                </h2>

                                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                                    Stop memorizing procedure sheets! Experience our state-of-the-art virtual lab simulator.
                                    Perform dry tests, flame tests, and wet tests for cations and anions in a realistic 3D-like environment.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                                        <Microscope size={18} className="text-blue-400" />
                                        <span>Lab Simulators</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                                        <Zap size={18} className="text-yellow-400" />
                                        <span>Instant Feedback</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="cursor-pointer flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-500 group-hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform group-hover:-translate-y-1">
                                        Enter Virtual Lab
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Visual/Icon Side */}
                            <div className="relative flex items-center justify-center h-64 md:h-auto">
                                {/* Simulator Mockup Container */}
                                <div className="relative z-10 w-full max-w-[360px] aspect-[4/3] bg-gray-950/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col group-hover:scale-105 transition-transform duration-500">

                                    {/* Mock Header */}
                                    <div className="h-8 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Virtual Lab v2.0</div>
                                    </div>

                                    {/* Simulator Content */}
                                    <div className="flex-1 p-5 flex gap-6 relative">
                                        {/* Left: Flame/Test Tube Area */}
                                        <div className="flex-1 flex flex-col items-center justify-end relative pb-4">

                                            {/* Custom Flame */}
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-32 pointer-events-none">
                                                <motion.div
                                                    animate={{
                                                        height: ["60%", "80%", "60%"],
                                                        opacity: [0.6, 0.9, 0.6]
                                                    }}
                                                    transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent blur-md rounded-t-full"
                                                />
                                                <motion.div
                                                    animate={{ scaleY: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                                                    transition={{ duration: 0.1, repeat: Infinity }}
                                                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-16 bg-blue-400 blur-sm rounded-t-full mix-blend-screen"
                                                />
                                            </div>

                                            {/* Custom Test Tube */}
                                            <div className="relative z-10 w-12 h-32 border-2 border-white/40 border-t-0 rounded-b-full overflow-hidden bg-white/5 backdrop-blur-[2px]">
                                                {/* Rim */}
                                                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-14 h-1 bg-white/40 rounded-full" />

                                                {/* Liquid */}
                                                <motion.div
                                                    animate={{ height: ["40%", "45%", "40%"] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500/80 to-cyan-400/80"
                                                >
                                                    {/* Bubbles */}
                                                    <motion.div
                                                        animate={{ y: [0, -40], opacity: [0, 1, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute bottom-2 left-1/3 w-1.5 h-1.5 bg-white/60 rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [0, -30], opacity: [0, 1, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                                        className="absolute bottom-1 left-2/3 w-1 h-1 bg-white/60 rounded-full"
                                                    />
                                                </motion.div>
                                            </div>

                                            {/* Test Tube Holder/Shadow */}
                                            <div className="w-16 h-2 bg-black/40 blur-md rounded-full mt-4" />
                                        </div>

                                        {/* Right: Real Cation Grid */}
                                        <div className="w-32 flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium px-1">
                                                <span>CATIONS</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { s: 'Cu²⁺', c: 'blue' },
                                                    { s: 'Fe³⁺', c: 'red' },
                                                    { s: 'Ni²⁺', c: 'green' },
                                                    { s: 'Co²⁺', c: 'purple' },
                                                    { s: 'Ba²⁺', c: 'yellow' },
                                                    { s: 'Sr²⁺', c: 'red' }
                                                ].map((ion, i) => (
                                                    <div
                                                        key={ion.s}
                                                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all border
                                                            ${i === 0
                                                                ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                                                : 'bg-white/5 border-white/10 text-gray-500'}`}
                                                    >
                                                        {ion.s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Simulating Interaction Cursor */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 0.8, 1],
                                                x: [0, -5, 0],
                                                y: [0, -5, 0]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                            className="absolute bottom-32 right-12 pointer-events-none z-20"
                                        >
                                            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/60 shadow-[0_0_10px_white]" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Decorative Glows - Adjusted Colors - Reduced Opacity */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                            </div>

                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
