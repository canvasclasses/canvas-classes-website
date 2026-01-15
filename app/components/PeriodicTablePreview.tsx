'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Atom, Sparkles, TrendingUp, Palette, BookOpen, ArrowRight } from 'lucide-react';

// Mini periodic table elements for preview (subset)
const PREVIEW_ELEMENTS = [
    { symbol: 'H', color: '#22d3ee', col: 1, row: 1 },
    { symbol: 'He', color: '#a78bfa', col: 18, row: 1 },
    { symbol: 'Li', color: '#f87171', col: 1, row: 2 },
    { symbol: 'Be', color: '#fbbf24', col: 2, row: 2 },
    { symbol: 'B', color: '#34d399', col: 13, row: 2 },
    { symbol: 'C', color: '#22d3ee', col: 14, row: 2 },
    { symbol: 'N', color: '#22d3ee', col: 15, row: 2 },
    { symbol: 'O', color: '#22d3ee', col: 16, row: 2 },
    { symbol: 'F', color: '#22d3ee', col: 17, row: 2 },
    { symbol: 'Ne', color: '#a78bfa', col: 18, row: 2 },
    { symbol: 'Na', color: '#f87171', col: 1, row: 3 },
    { symbol: 'Mg', color: '#fbbf24', col: 2, row: 3 },
    { symbol: 'Al', color: '#60a5fa', col: 13, row: 3 },
    { symbol: 'Si', color: '#34d399', col: 14, row: 3 },
    { symbol: 'P', color: '#22d3ee', col: 15, row: 3 },
    { symbol: 'S', color: '#22d3ee', col: 16, row: 3 },
    { symbol: 'Cl', color: '#22d3ee', col: 17, row: 3 },
    { symbol: 'Ar', color: '#a78bfa', col: 18, row: 3 },
    { symbol: 'K', color: '#f87171', col: 1, row: 4 },
    { symbol: 'Ca', color: '#fbbf24', col: 2, row: 4 },
    { symbol: 'Fe', color: '#3b82f6', col: 8, row: 4 },
    { symbol: 'Cu', color: '#3b82f6', col: 11, row: 4 },
    { symbol: 'Zn', color: '#3b82f6', col: 12, row: 4 },
];

const FEATURES = [
    { icon: TrendingUp, label: 'Property Heatmaps', desc: 'Visualize trends in electronegativity, atomic radius, IE' },
    { icon: Palette, label: 'Ion Colours', desc: 'See aquated ion colors for 3d transition metals' },
    { icon: BookOpen, label: 'NCERT Tables', desc: 'Click blocks to see hydrides, oxides, oxoacids data' },
    { icon: Sparkles, label: 'Exceptions', desc: 'Highlighted anomalies with explanations' },
];

export default function PeriodicTablePreview() {
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);

    return (
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-black relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4"
                    >
                        <Atom size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                        <span>New Feature</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                    >
                        Interactive Periodic Table
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Explore elements with property heatmaps, NCERT data, and exam-focused insights all in one place
                    </motion.p>
                </div>

                {/* Main Content - Table Preview + Features */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Mini Periodic Table Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <div
                                className="grid gap-1"
                                style={{
                                    gridTemplateColumns: 'repeat(18, 1fr)',
                                    gridTemplateRows: 'repeat(4, 1fr)',
                                }}
                            >
                                {PREVIEW_ELEMENTS.map((el, idx) => (
                                    <motion.div
                                        key={el.symbol}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + idx * 0.02 }}
                                        className="aspect-square rounded-md flex items-center justify-center text-[10px] md:text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10"
                                        style={{
                                            gridColumn: el.col,
                                            gridRow: el.row,
                                            backgroundColor: hoveredElement === el.symbol ? el.color : `${el.color}40`,
                                            color: hoveredElement === el.symbol ? '#000' : '#fff',
                                            boxShadow: hoveredElement === el.symbol ? `0 0 20px ${el.color}` : 'none',
                                        }}
                                        onMouseEnter={() => setHoveredElement(el.symbol)}
                                        onMouseLeave={() => setHoveredElement(null)}
                                    >
                                        {el.symbol}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Overlay hint */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent rounded-2xl flex items-end justify-center pb-4 pointer-events-none">
                                <span className="text-gray-400 text-sm">Hover to preview • Click to explore</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features List */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={feature.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-cyan-500/30 hover:bg-gray-800/50 transition-all group"
                            >
                                <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                    <feature.icon className="text-cyan-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{feature.label}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9 }}
                        >
                            <Link
                                href="/interactive-periodic-table"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 group"
                            >
                                <Atom size={20} />
                                <span>Explore Periodic Table</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
