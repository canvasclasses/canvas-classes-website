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
    Check,
    BookOpen,
    History,
    ExternalLink,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { SolutionAsset, SourceReference } from '@/app/the-crucible/types';
import 'katex/dist/katex.min.css';

interface SolutionViewerProps {
    solution: SolutionAsset;
    sourceReferences?: SourceReference[];
    imageScale?: number;
}

type TabType = 'analysis' | 'video' | 'handwritten';

export default function SolutionViewer({
    solution,
    sourceReferences,
    imageScale
}: SolutionViewerProps) {
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
                            <div className="prose prose-invert max-w-none 
                                prose-p:text-gray-300/90 prose-p:leading-snug prose-p:my-1 prose-p:text-[15px]
                                prose-headings:text-white prose-headings:font-bold prose-headings:mb-3 prose-headings:mt-6 prose-headings:tracking-tight
                                prose-strong:text-indigo-300 prose-strong:font-bold
                                prose-code:text-emerald-300 prose-code:bg-emerald-950/20 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono prose-code:text-[0.85em]
                                prose-li:text-gray-300 prose-li:marker:text-gray-600 prose-li:mb-1
                                prose-hr:border-white/5 prose-hr:my-4
                                markdown-table-wrapper select-text">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    components={{
                                        // Custom styling for specific elements to improve "calligraphy" / feel
                                        h1: ({ children }) => <h1 className="text-xl md:text-2xl font-bold text-white mb-3 pb-2 border-b border-white/5">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-lg md:text-xl font-bold text-white mt-5 mb-2 opacity-95">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-base font-bold text-indigo-400 mt-4 mb-2 uppercase tracking-wider">
                                            {children}
                                        </h3>,
                                        img: (props) => (
                                            <img
                                                {...props}
                                                style={{
                                                    maxWidth: imageScale ? `${imageScale}%` : '100%',
                                                    height: 'auto',
                                                    display: 'block',
                                                    margin: '0 auto'
                                                }}
                                                className="rounded-lg border border-white/5 my-4"
                                            />
                                        ),
                                        p: ({ children }) => {
                                            const childrenArray = React.Children.toArray(children);
                                            const firstChild = childrenArray[0];
                                            const isHighlighted = typeof firstChild === 'string' && firstChild.trimStart().startsWith('!!');

                                            if (isHighlighted) {
                                                // Strip the "!!" from the first child
                                                const newFirstChild = (firstChild as string).replace(/^\s*!!\s*/, '');
                                                const newChildren = [newFirstChild, ...childrenArray.slice(1)];

                                                return (
                                                    <div className="my-4 py-3 px-4 bg-white/[0.015] rounded-xl border border-white/5 text-center font-medium text-emerald-100/90 overflow-x-auto shadow-inner">
                                                        <div className="text-lg md:text-xl tracking-tight">
                                                            {newChildren}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const content = children?.toString() || "";

                                            // Key Notes (subtle)
                                            if (content.toLowerCase().startsWith('note:') || content.toLowerCase().startsWith('key point')) {
                                                return (
                                                    <div className="my-3 p-3 bg-indigo-500/05 border-l-2 border-indigo-500/30 rounded-r-lg text-indigo-100/90 text-[14px] leading-relaxed font-medium">
                                                        {children}
                                                    </div>
                                                );
                                            }

                                            // Remove empty paragraphs
                                            if (!content || content.trim() === '') return null;

                                            return <p className="mb-1 leading-snug tracking-normal text-[15px] text-gray-300/90">{children}</p>;
                                        },
                                        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-gray-300">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-gray-300">{children}</ol>,
                                        table: ({ children }) => (
                                            <div className="my-4 overflow-x-auto rounded-lg border border-white/10">
                                                <table className="w-full text-sm text-left">{children}</table>
                                            </div>
                                        ),
                                        th: ({ children }) => <th className="px-4 py-3 bg-white/5 font-medium text-white border-b border-white/10 min-w-[120px]">{children}</th>,
                                        td: ({ children }) => <td className="px-4 py-3 border-b border-white/5 text-gray-400">{children}</td>,
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-2 border-gray-600 pl-4 my-3 italic text-gray-400">
                                                {children}
                                            </blockquote>
                                        )
                                    }}
                                >
                                    {processedContent}
                                </ReactMarkdown>
                            </div>

                            {/* Source References Section */}
                            {sourceReferences && sourceReferences.length > 0 && (
                                <div className="mt-16 pt-8 border-t border-white/5">
                                    {/* Section Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                            <Sparkles size={16} className="text-amber-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-[0.2em]">
                                            Question Origins
                                        </h3>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                        This question is based on concepts from the following sources. Understanding these connections will help you master similar questions.
                                    </p>

                                    {/* Reference Cards */}
                                    <div className="space-y-4">
                                        {sourceReferences.map((ref, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative rounded-xl border p-5 transition-all hover:border-opacity-50 ${ref.type === 'NCERT'
                                                    ? 'bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20 hover:border-emerald-500/40'
                                                    : ref.type === 'PYQ'
                                                        ? 'bg-gradient-to-r from-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/40'
                                                        : 'bg-gradient-to-r from-purple-500/5 to-transparent border-purple-500/20 hover:border-purple-500/40'
                                                    }`}
                                            >
                                                {/* Type Badge */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${ref.type === 'NCERT'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : ref.type === 'PYQ'
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-purple-500/20 text-purple-400'
                                                        }`}>
                                                        {ref.type === 'NCERT' && <BookOpen size={12} />}
                                                        {ref.type === 'PYQ' && <History size={12} />}
                                                        {ref.type}
                                                    </div>

                                                    {/* Similarity Badge */}
                                                    {ref.similarity && (
                                                        <span className={`text-xs px-2 py-1 rounded-full ${ref.similarity === 'exact'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : ref.similarity === 'similar'
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-gray-500/20 text-gray-400'
                                                            }`}>
                                                            {ref.similarity === 'exact' && '🎯 Exact Match'}
                                                            {ref.similarity === 'similar' && '≈ Similar'}
                                                            {ref.similarity === 'concept' && '💡 Same Concept'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* NCERT Reference Content */}
                                                {ref.type === 'NCERT' && (
                                                    <div className="space-y-2">
                                                        {ref.ncertBook && (
                                                            <div className="flex items-center gap-2 text-white font-medium">
                                                                <span className="text-emerald-400">📚</span>
                                                                {ref.ncertBook}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                                                            {ref.ncertChapter && (
                                                                <span className="flex items-center gap-1">
                                                                    <ArrowRight size={12} className="text-emerald-500" />
                                                                    {ref.ncertChapter}
                                                                </span>
                                                            )}
                                                            {ref.ncertPage && (
                                                                <span className="text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                                                                    {ref.ncertPage}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {ref.ncertTopic && (
                                                            <div className="text-sm text-gray-500 italic mt-2">
                                                                Topic: {ref.ncertTopic}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* PYQ Reference Content */}
                                                {ref.type === 'PYQ' && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-white font-medium">
                                                            <span className="text-blue-400">📝</span>
                                                            {ref.pyqExam}
                                                            {ref.pyqYear && <span className="text-blue-300 font-mono">({ref.pyqYear})</span>}
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                                                            {ref.pyqShift && (
                                                                <span className="flex items-center gap-1">
                                                                    <ArrowRight size={12} className="text-blue-500" />
                                                                    {ref.pyqShift}
                                                                </span>
                                                            )}
                                                            {ref.pyqQuestionNo && (
                                                                <span className="text-blue-300 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                                                                    {ref.pyqQuestionNo}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Other/Coaching Reference */}
                                                {(ref.type === 'COACHING' || ref.type === 'OTHER') && ref.sourceName && (
                                                    <div className="text-white font-medium">
                                                        <span className="text-purple-400">📖</span> {ref.sourceName}
                                                    </div>
                                                )}

                                                {/* Description */}
                                                {ref.description && (
                                                    <p className="mt-3 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                                                        💡 {ref.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pro Tip */}
                                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                                        <div className="flex items-start gap-3">
                                            <div className="text-indigo-400 mt-0.5">💡</div>
                                            <div className="text-sm text-gray-400">
                                                <span className="text-indigo-300 font-medium">Pro Tip:</span> Questions often repeat with minor variations.
                                                Mastering the source concepts ensures you're prepared for any twist!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
