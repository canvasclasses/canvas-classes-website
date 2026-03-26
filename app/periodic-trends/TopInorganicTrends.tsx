'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { inorganicTrendsData } from '@/app/lib/inorganicTrendsData';
import { BookOpen, Trophy, Sparkles, Lightbulb, ChevronDown, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendCardProps {
    block: {
        id: number;
        title: string;
        trend: string;
        logic: string;
    };
    theme: {
        accent: string;
        border: string;
        hoverBorder: string;
        bg: string;
        text: string;
        badgeBg: string;
        trendText: string;
    };
    index: number;
}

function TrendCard({ block, theme, index }: TrendCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-xl border ${theme.border} bg-[#161b22] overflow-hidden transition-all duration-300 ${theme.hoverBorder}`}>
            {/* Card Header - Always Visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                {/* Number Badge */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.badgeBg} border ${theme.border} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${theme.text}`}>{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-200 text-base mb-2 pr-2">
                        {block.title}
                    </h4>
                    <div className={`inline-block px-3 py-1.5 rounded-lg ${theme.bg} border ${theme.border}`}>
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

                {/* Expand Icon */}
                <div className={`flex-shrink-0 p-1.5 rounded-lg border ${theme.border} ${theme.badgeBg} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} className={theme.text} />
                </div>
            </button>

            {/* Expandable Content - Examiner's Logic */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className={`px-5 pb-5 pt-0 border-t ${theme.border}`}>
                            <div className="pt-4 flex gap-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.badgeBg} border ${theme.border} flex items-center justify-center mt-0.5`}>
                                    <BookOpen size={16} className={theme.text} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${theme.text} mb-2`}>Examiner&apos;s Logic</p>
                                    <div className="text-base text-gray-400 leading-relaxed prose prose-invert prose-sm max-w-none [&>p]:leading-relaxed">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Section color themes for visual variety
const SECTION_THEMES = [
    { accent: 'amber', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400', badgeBg: 'bg-amber-500/10', trendText: 'text-amber-300' },
    { accent: 'cyan', border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400', badgeBg: 'bg-cyan-500/10', trendText: 'text-cyan-300' },
    { accent: 'purple', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-400', badgeBg: 'bg-purple-500/10', trendText: 'text-purple-300' },
    { accent: 'emerald', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badgeBg: 'bg-emerald-500/10', trendText: 'text-emerald-300' },
    { accent: 'rose', border: 'border-rose-500/30', hoverBorder: 'hover:border-rose-500/50', bg: 'bg-rose-500/10', text: 'text-rose-400', badgeBg: 'bg-rose-500/10', trendText: 'text-rose-300' },
    { accent: 'blue', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-400', badgeBg: 'bg-blue-500/10', trendText: 'text-blue-300' },
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

                {/* Content Sections - List View */}
                <div className="space-y-10">
                    {inorganicTrendsData.map((section, sectionIndex) => {
                        const theme = SECTION_THEMES[sectionIndex % SECTION_THEMES.length];
                        return (
                            <div key={sectionIndex} className="scroll-mt-24" id={`section-${sectionIndex}`}>
                                {/* Section Header */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${theme.badgeBg} border ${theme.border} flex items-center justify-center`}>
                                        <Hash size={20} className={theme.text} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {section.title.replace(/Section \d+: /, '')}
                                        </h3>
                                        {section.description && (
                                            <p className="text-gray-500 text-sm mt-0.5">{section.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Cards List */}
                                <div className="space-y-3">
                                    {section.blocks.map((block, blockIndex) => (
                                        <TrendCard
                                            key={block.id}
                                            block={block}
                                            theme={theme}
                                            index={blockIndex}
                                        />
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
