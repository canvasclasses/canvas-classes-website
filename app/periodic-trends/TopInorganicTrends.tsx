'use client';

import React, { useState } from 'react';
import { inorganicTrendsData } from '@/app/lib/inorganicTrendsData';
import { BookOpen, Trophy, Sparkles, Lightbulb, ChevronDown, Hash, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Helper function to format chemical formulas with proper subscripts and superscripts
const formatChemicalFormula = (formula: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < formula.length) {
        const char = formula[i];
        
        // Handle underscore for subscripts (LaTeX notation: _3 becomes subscript 3)
        if (char === '_') {
            i++; // skip underscore
            let num = '';
            // Check if next char is opening brace
            if (i < formula.length && formula[i] === '{') {
                i++; // skip opening brace
                while (i < formula.length && formula[i] !== '}') {
                    num += formula[i];
                    i++;
                }
                i++; // skip closing brace
            } else {
                // Single character subscript
                if (i < formula.length) {
                    num = formula[i];
                    i++;
                }
            }
            if (num) {
                result.push(<sub key={key++} className="text-[0.7em]">{num}</sub>);
            }
            continue;
        }
        
        // Handle caret for superscripts (LaTeX notation: ^+ becomes superscript +)
        if (char === '^') {
            i++; // skip caret
            let sup = '';
            // Check if next char is opening brace
            if (i < formula.length && formula[i] === '{') {
                i++; // skip opening brace
                while (i < formula.length && formula[i] !== '}') {
                    sup += formula[i];
                    i++;
                }
                i++; // skip closing brace
            } else if (i < formula.length && formula[i] === '\\') {
                // Handle ^\command without braces
                i++; // skip backslash
                let command = '';
                while (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
                    command += formula[i];
                    i++;
                }
                // Convert command to symbol
                if (command === 'circ') sup = '°';
                else if (command === 'approx') sup = '≈';
                else if (command === 'gg') sup = '≫';
                else sup = '\\' + command;
            } else {
                // Single character superscript
                if (i < formula.length) {
                    sup = formula[i];
                    i++;
                }
            }
            if (sup) {
                result.push(<sup key={key++} className="text-[0.7em]">{sup}</sup>);
            }
            continue;
        }
        
        // Handle special characters with spacing
        if (char === '>' || char === '<' || char === '≈') {
            result.push(<span key={key++}> {char} </span>);
            i++;
            continue;
        }
        
        // Skip backslashes and handle LaTeX commands
        if (char === '\\') {
            i++;
            // Collect command name
            let command = '';
            while (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
                command += formula[i];
                i++;
            }
            
            // Handle specific commands
            if (command === 'circ') {
                result.push(<span key={key++}>°</span>);
            } else if (command === 'color') {
                // Skip color command and its argument
                if (i < formula.length && formula[i] === '{') {
                    i++;
                    while (i < formula.length && formula[i] !== '}') {
                        i++;
                    }
                    i++; // skip closing brace
                }
            } else if (command === 'underset') {
                // Handle \underset{value}{formula} - display value inline after formula
                if (i < formula.length && formula[i] === '{') {
                    i++; // skip opening brace for value
                    let value = '';
                    let braceCount = 1;
                    while (i < formula.length && braceCount > 0) {
                        if (formula[i] === '{') braceCount++;
                        else if (formula[i] === '}') braceCount--;
                        if (braceCount > 0) value += formula[i];
                        i++;
                    }
                    // Skip opening brace for formula
                    if (i < formula.length && formula[i] === '{') {
                        i++;
                        let form = '';
                        braceCount = 1;
                        while (i < formula.length && braceCount > 0) {
                            if (formula[i] === '{') braceCount++;
                            else if (formula[i] === '}') braceCount--;
                            if (braceCount > 0) form += formula[i];
                            i++;
                        }
                        // Clean up value (remove \color commands)
                        const cleanValue = value.replace(/\\color\{[^}]*\}/g, '').trim();
                        // Process value for degree symbols
                        const processedValue = cleanValue.replace(/\^\{?\\circ\}?/g, '°').replace(/\\circ/g, '°');
                        // Render inline: formula(value)
                        result.push(
                            <span key={key++}>
                                {formatChemicalFormula(form)}
                                <span className="text-amber-400 text-[0.85em]">({processedValue})</span>
                            </span>
                        );
                    }
                }
            } else if (command === 'gg') {
                result.push(<span key={key++}> ≫ </span>);
            } else if (command === 'approx') {
                result.push(<span key={key++}> ≈ </span>);
            }
            // Skip any remaining braces for this command
            continue;
        }
        
        // Regular character
        result.push(<span key={key++}>{char}</span>);
        i++;
    }
    
    return result;
};

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
        <div className="rounded-lg border border-gray-800/50 bg-[#0d1117] overflow-hidden transition-all duration-200 hover:border-gray-700">
            {/* Card Header - Always Visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left"
            >
                {/* Row 1: Number + Title + Expand Icon */}
                <div className="flex w-full items-center gap-3 p-4 md:p-5 pb-3 md:pb-3">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-400">{index + 1}</span>
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-[17px] md:text-base leading-snug ${(theme as any).titleColor || 'text-gray-200'}`}>
                            {block.title}
                        </h4>
                    </div>

                    {/* Expand Icon */}
                    <div className={`flex-shrink-0 p-1 rounded transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} className="text-gray-500 group-hover:text-gray-400" />
                    </div>
                </div>
                
                {/* Row 2: Trend Formula - Full Width with Background */}
                <div className="px-4 md:px-5 pb-4 md:pb-5">
                    <div className="rounded-lg bg-gray-800/30 border border-gray-700/30 px-4 py-3 overflow-x-auto">
                        <div className="text-lg md:text-xl text-gray-300 font-serif leading-relaxed whitespace-nowrap">
                            {formatChemicalFormula(block.trend.replace(/\$/g, ''))}
                        </div>
                    </div>
                </div>
            </button>

            {/* Expandable Content - Examiner's Logic */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 md:px-5 md:pb-5 pt-0 border-t border-gray-800/50">
                            <div className="pt-3 flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-800/50 flex items-center justify-center mt-0.5">
                                    <BookOpen size={13} className="text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Examiner's Logic</p>
                                    <div className="text-base text-gray-400 leading-relaxed prose prose-invert prose-sm max-w-none">
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
    { 
        accent: 'amber', 
        border: 'border-amber-500/30', 
        hoverBorder: 'hover:border-amber-500/50', 
        bg: 'bg-amber-500/10', 
        text: 'text-amber-400', 
        badgeBg: 'bg-amber-500/10', 
        trendText: 'text-amber-300',
        headerColor: 'text-amber-400',
        titleColor: 'text-amber-200/90'
    },
    { 
        accent: 'cyan', 
        border: 'border-cyan-500/30', 
        hoverBorder: 'hover:border-cyan-500/50', 
        bg: 'bg-cyan-500/10', 
        text: 'text-cyan-400', 
        badgeBg: 'bg-cyan-500/10', 
        trendText: 'text-cyan-300',
        headerColor: 'text-cyan-400',
        titleColor: 'text-cyan-200/90'
    },
    { 
        accent: 'purple', 
        border: 'border-purple-500/30', 
        hoverBorder: 'hover:border-purple-500/50', 
        bg: 'bg-purple-500/10', 
        text: 'text-purple-400', 
        badgeBg: 'bg-purple-500/10', 
        trendText: 'text-purple-300',
        headerColor: 'text-purple-400',
        titleColor: 'text-purple-200/90'
    },
    { 
        accent: 'emerald', 
        border: 'border-emerald-500/30', 
        hoverBorder: 'hover:border-emerald-500/50', 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-400', 
        badgeBg: 'bg-emerald-500/10', 
        trendText: 'text-emerald-300',
        headerColor: 'text-emerald-400',
        titleColor: 'text-emerald-200/90'
    },
    { 
        accent: 'rose', 
        border: 'border-rose-500/30', 
        hoverBorder: 'hover:border-rose-500/50', 
        bg: 'bg-rose-500/10', 
        text: 'text-rose-400', 
        badgeBg: 'bg-rose-500/10', 
        trendText: 'text-rose-300',
        headerColor: 'text-rose-400',
        titleColor: 'text-rose-200/90'
    },
    { 
        accent: 'blue', 
        border: 'border-blue-500/30', 
        hoverBorder: 'hover:border-blue-500/50', 
        bg: 'bg-blue-500/10', 
        text: 'text-blue-400', 
        badgeBg: 'bg-blue-500/10', 
        trendText: 'text-blue-300',
        headerColor: 'text-blue-400',
        titleColor: 'text-blue-200/90'
    },
];

// Video Lectures Section Component
function VideoLecturesSection() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const videos = [
        { id: '7myt2pUILzM', title: 'Top trends of p-block', subtitle: 'Key p-block concepts' },
        { id: '7qW5JK8AK7k', title: 'Thermal Decomposition Reactions', subtitle: 'Reaction mechanisms' },
    ];

    return (
        <div className="mb-10 md:mb-16">
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
                                <X className="w-5 h-5" />
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
                    <h3 className="text-lg sm:text-xl font-bold text-white">Quick Revision Videos</h3>
                    <p className="text-sm text-gray-400">Master these concepts visually</p>
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
                        </div>
                        
                        {/* Info */}
                        <div className="p-2.5">
                            <h4 className="text-sm font-medium text-gray-200 group-hover:text-white leading-tight line-clamp-1">{video.title}</h4>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">{video.subtitle}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function TopInorganicTrends() {
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])); // First section expanded by default

    const toggleSection = (index: number) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <section id="top-trends" className="py-10 md:py-16 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm font-medium mb-3 md:mb-4">
                        <Trophy size={12} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>High Yield Topic</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                        Top Trends of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Inorganic Chemistry</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg">
                        Directly from the notes of toppers. Master these trends to secure easy marks in JEE, NEET & BITSAT.
                    </p>
                </div>

                {/* Coach's Corner */}
                <div className="mb-10 md:mb-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-4 md:p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={80} className="md:w-[120px] md:h-[120px]" />
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

                {/* Video Lectures Section */}
                <VideoLecturesSection />

                {/* Content Sections - List View */}
                <div className="space-y-10">
                    {inorganicTrendsData.map((section, sectionIndex) => {
                        const theme = SECTION_THEMES[sectionIndex % SECTION_THEMES.length];
                        const isExpanded = expandedSections.has(sectionIndex);
                        
                        return (
                            <div key={sectionIndex} className="scroll-mt-24" id={`section-${sectionIndex}`}>
                                {/* Section Header - Clickable */}
                                <button
                                    onClick={() => toggleSection(sectionIndex)}
                                    className="w-full flex items-center gap-3 mb-4 group cursor-pointer"
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-md ${theme.badgeBg} border ${theme.border} flex items-center justify-center`}>
                                        <Hash size={16} className={theme.text} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className={`text-lg md:text-xl font-semibold ${theme.headerColor || 'text-white'}`}>
                                            {section.title.replace(/Section \d+: /, '')}
                                        </h3>
                                        {section.description && (
                                            <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                                        )}
                                    </div>
                                    <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${isExpanded ? 'rotate-180 bg-gray-800/50' : 'bg-gray-800/30'}`}>
                                        <ChevronDown size={20} className={`${theme.text} transition-colors`} />
                                    </div>
                                </button>

                                {/* Cards List - Expandable */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-2">
                                                {section.blocks.map((block, blockIndex) => (
                                                    <TrendCard
                                                        key={block.id}
                                                        block={block}
                                                        theme={theme}
                                                        index={blockIndex}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
