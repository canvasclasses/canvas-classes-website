'use client';
import dynamic from 'next/dynamic';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TrendsComponent = dynamic(() => import('../interactive-periodic-table/TrendsComponent'), {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center text-gray-400 bg-gray-900/20 rounded-2xl border border-gray-700/50 animate-pulse">Loading Trends Data...</div>
});

const TopInorganicTrends = dynamic(() => import('./TopInorganicTrends'), {
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center text-gray-400 bg-gray-900/20 rounded-2xl border border-gray-700/50 animate-pulse mt-12">Loading Top Trends...</div>
});

const ColorsOfCompoundsSection = dynamic(() => import('./ColorsOfCompoundsSection'), {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center text-gray-400 bg-gray-900/20 rounded-2xl border border-gray-700/50 animate-pulse mt-12">Loading Colors...</div>
});

const YouTubeLecturesSection = () => {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const videos = [
        { id: 'zmnRASd0GhA', title: 'Revise s block', subtitle: 'in 15 minutes', thumbnail: 'mqdefault' },
        { id: 'bm4A9FSyjPg', title: 'All about diborane', subtitle: 'B₂H₆ structures', thumbnail: 'mqdefault' },
        { id: '9A-5gd9Q8os', title: 'All structures', subtitle: 'from p-block', thumbnail: 'mqdefault' },
        { id: 'MtgYnKCJehk', title: 'Revise hydrogen', subtitle: 'in 15 minutes', thumbnail: 'mqdefault' },
        { id: 'uRPfNa5_RPk', title: 'Coordination compounds', subtitle: 'NCERT revision', thumbnail: 'mqdefault' },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                                aria-label="Close video"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section Title */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-700 to-red-900 translate-y-1" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 border border-red-400/50 shadow-[inset_0_2px_0_rgba(255,255,255,0.25),0_4px_8px_rgba(239,68,68,0.3)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Quick Revision Videos</h2>
                    <p className="text-sm text-gray-400">NCERT summaries by Paaras Sir</p>
                </div>
            </div>

            {/* Video Grid - Thumbnail Style */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {videos.map((video) => (
                    <button
                        key={video.id}
                        onClick={() => setActiveVideo(video.id)}
                        className="group relative rounded-xl bg-gray-800/60 border border-gray-700/50 hover:border-red-500/50 hover:bg-gray-800/90 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5 transition-all duration-200 text-left overflow-hidden cursor-pointer"
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full overflow-hidden">
                            <img 
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg">
                                    <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[9px] border-y-transparent ml-1" />
                                </div>
                            </div>
                            {/* Duration badge (optional - can add if known) */}
                        </div>
                        
                        {/* Info */}
                        <div className="p-2.5">
                            <h4 className="text-sm font-medium text-gray-200 group-hover:text-white leading-tight line-clamp-1">{video.title}</h4>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">{video.subtitle}</p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default function PeriodicTrendsPage() {
    return (
        <main className="min-h-screen bg-[#0d1117] text-white">
            {/* Hero Header */}
            <section className="relative pt-12 pb-6 md:pt-24 md:pb-10 overflow-hidden">
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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Periodic Trends & Exceptions
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-base md:text-xl max-w-3xl mx-auto mb-6 md:mb-8">
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

            {/* Quick Stats - 3 Cards */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8 md:mb-12">
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: '200+', label: 'Data Points', sub: 'From NCERT visualized' },
                        { value: '15', label: 'Properties', sub: 'From atomic radius to E°' },
                        { value: '100+', label: 'Exceptions', sub: 'With examiner logic' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-900/60 rounded-xl border border-gray-700/50 p-4 md:p-5 text-center backdrop-blur-sm hover:border-violet-500/30 transition-colors">
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-300">{stat.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trends Component */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <TrendsComponent />
            </section>

            {/* YouTube Lectures Section */}
            <YouTubeLecturesSection />

            {/* Colors of Inorganic Compounds Section */}
            <ColorsOfCompoundsSection />

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
