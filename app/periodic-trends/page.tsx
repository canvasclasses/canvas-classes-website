'use client';

import TrendsComponent from '../interactive-periodic-table/TrendsComponent';
import TopInorganicTrends from './TopInorganicTrends';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PeriodicTrendsPage() {
    return (
        <main className="min-h-screen bg-[#0d1117] text-white">
            {/* Hero Header */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 mb-6">
                        <Sparkles size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400">NCERT Data Visualizations</span>
                    </div>

                    {/* Main Title with Gradient */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Periodic Trends & Exceptions
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                        Interactive graphs for s, p, d, and f block elements with all properties and
                        exceptions from NCERT Class 11 & 12 Chemistry
                    </p>

                    {/* CTA Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="#trends-section" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25">
                            <TrendingUp size={18} />
                            Explore Trends
                        </Link>
                        <Link href="/interactive-periodic-table" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800/80 border border-gray-700 rounded-full text-gray-300 font-medium hover:bg-gray-700 hover:text-white transition-all">
                            Periodic Table
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Block Types', value: '4', desc: 's, p, d, f' },
                        { label: 'Data Tables', value: '15+', desc: 'From NCERT' },
                        { label: 'Properties', value: '50+', desc: 'Graphable' },
                        { label: 'Elements', value: '118', desc: 'Covered' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-900/60 rounded-xl border border-gray-700/50 p-4 text-center backdrop-blur-sm">
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                            <div className="text-xs text-gray-500">{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trends Component */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <TrendsComponent />
            </section>

            {/* Top 50 Trends Section */}
            <TopInorganicTrends />

            {/* SEO Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Understanding Periodic Trends</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-gray-400 text-base leading-relaxed">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">What are Periodic Trends?</h3>
                            <p className="mb-3">
                                Periodic trends are patterns in element properties that occur as you move across
                                periods (left to right) or down groups (top to bottom) of the periodic table.
                                Key trends include atomic radius, ionization energy, electronegativity, and
                                electron affinity.
                            </p>
                            <h3 className="text-lg font-semibold text-white mb-2">Important Exceptions</h3>
                            <p>
                                Many elements show exceptions to general trends due to factors like d/f orbital
                                shielding, inert pair effect, and half/full-filled orbital stability. Examples
                                include Ga having smaller radius than Al, and Cu/Cr having anomalous electronic
                                configurations.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">JEE & NEET Relevance</h3>
                            <p className="mb-3">
                                Periodic trends are frequently tested in JEE Main, JEE Advanced, and NEET.
                                Questions often test comparative properties across groups/periods and exceptions
                                to standard trends. Understanding lanthanide contraction is crucial for
                                explaining d-block and p-block anomalies.
                            </p>
                            <h3 className="text-lg font-semibold text-white mb-2">How to Use This Tool</h3>
                            <p>
                                Select a block (s, p, d, or f), choose a data table, and click on properties
                                to visualize trends. Hover over data points for exact values. Key observations
                                are shown alongside each graph for quick revision.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-400">Essential guide for JEE & NEET Aspirants</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-6 hover:border-violet-500/30 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                            <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded text-sm mt-0.5">Q</span>
                            Why is NCERT mastery a must for Inorganic Chemistry?
                        </h3>
                        <p className="text-gray-400 leading-relaxed pl-9">
                            NCERT is considered the "Bible" for Inorganic Chemistry preparation. In exams like <strong className="text-gray-200">JEE Main, BITSAT, and NEET</strong>, over 90% of questions are directly framed from NCERT lines, tables, and graphs. Mastering this content ensures you don't miss out on high-scoring, direct questions.
                        </p>
                    </div>

                    <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-6 hover:border-violet-500/30 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                            <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded text-sm mt-0.5">Q</span>
                            Are questions asked directly from graphs and tables?
                        </h3>
                        <p className="text-gray-400 leading-relaxed pl-9">
                            Yes, absolutely. Trends in Ionization Energy, Atomic Radius, and Electrode Potentials are frequent topics. Examiners often test your understanding of <strong className="text-gray-200">exceptions and anomalies</strong> visible in these graphs (e.g., Lanthanoid contraction effects or stability of half-filled orbitals), which are hard to memorize but easy to recall visually.
                        </p>
                    </div>

                    <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-6 hover:border-violet-500/30 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                            <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded text-sm mt-0.5">Q</span>
                            How can this tool help optimize my revision?
                        </h3>
                        <p className="text-gray-400 leading-relaxed pl-9">
                            Instead of flipping through pages, use this interactive tool to visualize trends for s, p, d, and f blocks instantly. It highlights <strong className="text-gray-200">key observations and exceptions</strong> for every property, helping you build a strong visual memory—critical for quick recall during high-pressure exams.
                        </p>
                    </div>
                </div>
            </section>
        </main >
    );
}
