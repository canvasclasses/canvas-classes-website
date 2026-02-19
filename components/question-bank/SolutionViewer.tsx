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
import 'katex/dist/katex.min.css';

// Define Question type inline for compatibility
interface Question {
    id: string;
    textMarkdown: string;
    chapterId?: string;
    difficulty?: string;
    examSource?: string;
    isTopPYQ?: boolean;
    [key: string]: any;
}

interface SolutionAsset {
    videoUrl?: string;
    handwrittenSolutionImageUrl?: string;
    textSolutionLatex?: string;
    [key: string]: any;
}

interface SourceReference {
    type?: string;
    pyqExam?: string;
    pyqShift?: string;
    ncertBook?: string;
    ncertChapter?: string;
    sourceName?: string;
    [key: string]: any;
}

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
        let content = solution.textSolutionLatex || "";
        // 1. Convert literal \n to real newlines ONLY if not followed by a letter (preserves LaTeX like \nu, \neq)
        content = content.replace(/\\n(?![a-zA-Z])/g, '\n');
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

                                            return <p className="mb-1 leading-snug tracking-normal text-[15px] text-gray-300/90 whitespace-pre-wrap">{children}</p>;
                                        },
                                        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-gray-300">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-gray-300">{children}</ol>,
                                        table: ({ children }) => (
                                            <div className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] shadow-sm">
                                                <table className="w-full text-sm text-left border-collapse">{children}</table>
                                            </div>
                                        ),
                                        th: ({ children }) => <th className="px-5 py-4 bg-white/5 font-bold text-indigo-300 border-b border-white/10 uppercase tracking-wider text-xs min-w-[140px]">{children}</th>,
                                        td: ({ children }) => <td className="px-5 py-4 border-b border-white/5 text-gray-400 leading-relaxed">{children}</td>,
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

                            {/* Question Origins - Compact & Minimal */}
                            {sourceReferences && sourceReferences.length > 0 && (
                                <div className="mt-8 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={14} className="text-amber-400" />
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Reference Source
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        {sourceReferences.map((ref, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-2 rounded bg-white/[0.02] border border-white/5 text-sm hover:bg-white/[0.04] transition-colors">
                                                {/* Compact Badge */}
                                                <div className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${ref.type === 'NCERT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        ref.type === 'PYQ' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                    }`}>
                                                    {ref.type}
                                                </div>

                                                {/* Content - Inline */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-x-2 text-gray-300 text-xs">
                                                        {ref.type === 'NCERT' && (
                                                            <>
                                                                {ref.ncertBook && <span className="font-medium text-emerald-200">{ref.ncertBook}</span>}
                                                                {ref.ncertChapter && <span className="text-gray-500">/</span>}
                                                                {ref.ncertChapter && <span>{ref.ncertChapter}</span>}
                                                                {ref.ncertPage && (
                                                                    <span className="text-gray-500 ml-auto font-mono text-[10px]">Pg. {ref.ncertPage}</span>
                                                                )}
                                                            </>
                                                        )}
                                                        {ref.type === 'PYQ' && (
                                                            <>
                                                                <span className="font-medium text-blue-200">{ref.pyqExam} {ref.pyqYear}</span>
                                                                {ref.pyqShift && <span className="text-gray-500">- {ref.pyqShift}</span>}
                                                            </>
                                                        )}
                                                        {(ref.type === 'COACHING' || ref.type === 'OTHER') && (
                                                            <span className="font-medium text-purple-200">{ref.sourceName}</span>
                                                        )}
                                                    </div>

                                                    {/* Concise Description line if exists */}
                                                    {ref.description && (
                                                        <div className="mt-1 text-[11px] text-gray-500 line-clamp-1 italic">
                                                            {ref.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
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
