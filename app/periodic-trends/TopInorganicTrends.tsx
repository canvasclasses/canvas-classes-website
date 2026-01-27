
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { inorganicTrendsData } from '@/app/lib/inorganicTrendsData';
import { BookOpen, Trophy, Sparkles, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

// Section color themes for visual variety
const SECTION_THEMES = [
    { accent: 'amber', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500/50', bg: 'bg-amber-500/5', text: 'text-amber-400', badgeBg: 'bg-amber-500/10', trendText: 'text-amber-300', numberBg: 'bg-amber-900/30', numberBorder: 'border-amber-700/50' },
    { accent: 'cyan', border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-500/50', bg: 'bg-cyan-500/5', text: 'text-cyan-400', badgeBg: 'bg-cyan-500/10', trendText: 'text-cyan-300', numberBg: 'bg-cyan-900/30', numberBorder: 'border-cyan-700/50' },
    { accent: 'purple', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/50', bg: 'bg-purple-500/5', text: 'text-purple-400', badgeBg: 'bg-purple-500/10', trendText: 'text-purple-300', numberBg: 'bg-purple-900/30', numberBorder: 'border-purple-700/50' },
    { accent: 'emerald', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/50', bg: 'bg-emerald-500/5', text: 'text-emerald-400', badgeBg: 'bg-emerald-500/10', trendText: 'text-emerald-300', numberBg: 'bg-emerald-900/30', numberBorder: 'border-emerald-700/50' },
    { accent: 'rose', border: 'border-rose-500/30', hoverBorder: 'hover:border-rose-500/50', bg: 'bg-rose-500/5', text: 'text-rose-400', badgeBg: 'bg-rose-500/10', trendText: 'text-rose-300', numberBg: 'bg-rose-900/30', numberBorder: 'border-rose-700/50' },
    { accent: 'blue', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/50', bg: 'bg-blue-500/5', text: 'text-blue-400', badgeBg: 'bg-blue-500/10', trendText: 'text-blue-300', numberBg: 'bg-blue-900/30', numberBorder: 'border-blue-700/50' },
];

export default function TopInorganicTrends() {
    return (
        <section id="top-trends" className="py-16 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                        <Trophy size={14} />
                        <span>High Yield Topic</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Top Trends of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Inorganic Chemistry</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Directly from the notes of toppers. Master these trends to secure easy marks in JEE, NEET & BITSAT.
                    </p>
                </div>

                {/* Coach's Corner */}
                <div className="mb-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6 md:p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={120} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                            <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Coach's Insight 🧠</h3>
                            <div className="text-gray-300 leading-relaxed italic space-y-2">
                                <p>
                                    "Inorganic Chemistry isn't just about memorization; it's about understanding the <strong>'Why'</strong>.
                                    <strong className="text-amber-300 block my-1">There is a very high probability that you will get a DIRECT question from these trends in JEE Mains, NEET, or BITSAT.</strong>
                                </p>
                                <p>
                                    Examiners love these exceptions because they filter out students who rote-learned from those who conceptually understood.
                                    If you master the logic below each trend, you won't just remember it—you'll own it.
                                    <span className="text-amber-400 font-semibold block mt-2">You've got this! Let's conquer P, D & F-Block today! 🚀"</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {inorganicTrendsData.map((section, index) => {
                        const theme = SECTION_THEMES[index % SECTION_THEMES.length];
                        return (
                            <div key={index} className="scroll-mt-24" id={`section-${index}`}>
                                {/* Section Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <span className={`flex-shrink-0 w-10 h-10 rounded-lg ${theme.numberBg} flex items-center justify-center text-lg font-bold ${theme.text} border ${theme.numberBorder}`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white shadow-sm">
                                            {section.title.replace(/Section \d+: /, '')}
                                        </h3>
                                        {section.description && (
                                            <p className="text-gray-500 text-sm mt-1">{section.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {section.blocks.map((block) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                            key={block.id}
                                            className={`bg-[#161b22] rounded-xl border ${theme.border} ${theme.hoverBorder} transition-all duration-300 flex flex-col h-full group`}
                                        >
                                            <div className="p-5 flex-grow">
                                                {/* Block Header */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className={`font-semibold text-gray-200 text-lg group-hover:${theme.text} transition-colors`}>
                                                        {block.title}
                                                    </h4>
                                                    <span className={`text-xs font-mono ${theme.text} ${theme.badgeBg} px-2 py-1 rounded border ${theme.border}`}>
                                                        #{block.id}
                                                    </span>
                                                </div>

                                                {/* Trend Visual */}
                                                <div className={`mb-6 p-4 ${theme.bg} rounded-lg border ${theme.border}`}>
                                                    <div className={`text-center font-mono text-base md:text-lg ${theme.trendText} overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700 pb-1`}>
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkMath]}
                                                            rehypePlugins={[rehypeKatex]}
                                                            components={{
                                                                p: ({ node, ...props }) => <span {...props} />
                                                            }}
                                                        >
                                                            {block.trend}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>

                                                {/* Logic/Explanation */}
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-2">
                                                        <BookOpen size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                                                        <div className="text-sm text-gray-400 leading-relaxed">
                                                            <span className="text-gray-300 font-semibold block mb-1">Examiner's Logic:</span>
                                                            <div className="prose prose-invert prose-sm max-w-none [&>p]:leading-relaxed">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkMath]}
                                                                    rehypePlugins={[rehypeKatex]}
                                                                >
                                                                    {block.logic}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
