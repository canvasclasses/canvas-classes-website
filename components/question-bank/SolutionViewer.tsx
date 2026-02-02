'use client';

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import {
    Play,
    Mic,
    Image as ImageIcon,
    FileText,
    MonitorPlay,
    Zap,
    Lightbulb,
    Check
} from 'lucide-react';
import { SolutionAsset } from '@/app/the-crucible/types';
import 'katex/dist/katex.min.css';

interface SolutionViewerProps {
    solution: SolutionAsset;
}

type TabType = 'analysis' | 'video' | 'handwritten';

export default function SolutionViewer({ solution }: SolutionViewerProps) {
    const hasVideo = !!solution.videoUrl;
    const hasHandwritten = !!solution.handwrittenSolutionImageUrl;
    const [activeTab, setActiveTab] = useState<TabType>('analysis');

    // Process solution text - simpler processing, focusing on clean markdown
    const processedContent = useMemo(() => {
        let content = solution.textSolutionLatex;
        // Basic cleanup if needed, but keeping it raw allows the markdown renderer to do its job cleanly
        return content;
    }, [solution.textSolutionLatex]);

    return (
        <div className="flex flex-col h-full bg-[#0B0F1A] font-sans">
            {/* Minimal Tab Header */}
            {(hasVideo || hasHandwritten) && (
                <div className="flex items-center gap-6 px-6 py-3 border-b border-white/5 bg-[#0B0F1A] sticky top-0 z-10">
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`text-sm font-medium transition-colors ${activeTab === 'analysis'
                            ? 'text-white'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Solution
                    </button>

                    {hasVideo && (
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'video'
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Video
                        </button>
                    )}

                    {hasHandwritten && (
                        <button
                            onClick={() => setActiveTab('handwritten')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'handwritten'
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            Handwritten Note
                        </button>
                    )}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto p-6 md:p-8">

                    {/* 1. ANALYSIS TAB - Clean, Elegant Typography */}
                    {activeTab === 'analysis' && (
                        <div className="animate-in fade-in duration-500">

                            {/* Audio Player - Compact & Clean */}
                            {solution.audioExplanationUrl && (
                                <div className="mb-8 flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                        <Mic size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-medium text-indigo-200 mb-1 uppercase tracking-wider">Audio Explanation</div>
                                        <audio
                                            controls
                                            src={solution.audioExplanationUrl}
                                            className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity"
                                            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Main Solution Text */}
                            <div className="prose prose-invert prose-lg max-w-none 
                                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-light
                                prose-headings:text-white prose-headings:font-serif prose-headings:font-medium prose-headings:mb-4 prose-headings:mt-8
                                prose-strong:text-white prose-strong:font-semibold
                                prose-code:text-emerald-300 prose-code:bg-emerald-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.9em]
                                prose-li:text-gray-300 prose-li:marker:text-gray-500
                                prose-hr:border-white/10 prose-hr:my-8
                                markdown-table-wrapper select-text">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    components={{
                                        // Custom styling for specific elements to improve "calligraphy" / feel
                                        h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-serif text-white mb-6 border-b border-white/10 pb-2">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-xl md:text-2xl font-serif text-white mt-8 mb-4">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-lg md:text-xl font-serif text-indigo-200 mt-6 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
                                            {children}
                                        </h3>,
                                        p: ({ children }) => {
                                            const content = children?.toString() || "";

                                            // Highlight Formulas (clean, minimal highlighting)
                                            if (content.includes('$$') || (content.length < 60 && content.includes('='))) {
                                                return (
                                                    <div className="my-6 py-4 px-6 bg-white/5 rounded-lg border-l-2 border-emerald-500/50 text-center font-medium text-emerald-100 overflow-x-auto">
                                                        {children}
                                                    </div>
                                                );
                                            }

                                            // Key Notes (subtle)
                                            if (content.toLowerCase().startsWith('note:') || content.toLowerCase().startsWith('key point')) {
                                                return (
                                                    <div className="my-6 pl-4 border-l-2 border-indigo-500/50 text-indigo-100/90 italic text-[0.95em]">
                                                        {children}
                                                    </div>
                                                );
                                            }

                                            return <p className="mb-5 leading-7 tracking-wide text-[1.05rem] text-gray-300">{children}</p>;
                                        },
                                        ul: ({ children }) => <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-300">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-gray-300">{children}</ol>,
                                        table: ({ children }) => (
                                            <div className="my-8 overflow-x-auto rounded-lg border border-white/10">
                                                <table className="w-full text-sm text-left">{children}</table>
                                            </div>
                                        ),
                                        th: ({ children }) => <th className="px-4 py-3 bg-white/5 font-medium text-white border-b border-white/10 min-w-[120px]">{children}</th>,
                                        td: ({ children }) => <td className="px-4 py-3 border-b border-white/5 text-gray-400">{children}</td>,
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-2 border-gray-600 pl-4 my-6 italic text-gray-400">
                                                {children}
                                            </blockquote>
                                        )
                                    }}
                                >
                                    {processedContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {/* 2. VIDEO TAB - Clean Player */}
                    {activeTab === 'video' && solution.videoUrl && (
                        <div className="animate-in fade-in duration-500">
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                <iframe
                                    src={solution.videoUrl}
                                    title="Video Solution"
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-500">
                                Video solution breakdown
                            </div>
                        </div>
                    )}

                    {/* 3. HANDWRITTEN TAB - Focus on Content */}
                    {activeTab === 'handwritten' && solution.handwrittenSolutionImageUrl && (
                        <div className="animate-in fade-in duration-500">
                            <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
                                <img
                                    src={solution.handwrittenSolutionImageUrl}
                                    alt="Handwritten Solution"
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-500">
                                Handwritten notes by the expert
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
