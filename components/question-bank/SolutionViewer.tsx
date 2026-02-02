'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Play, Mic, Image as ImageIcon, FileText, MonitorPlay, BookOpen } from 'lucide-react';
import { SolutionAsset } from '@/app/the-crucible/types';
import 'katex/dist/katex.min.css';

interface SolutionViewerProps {
    solution: SolutionAsset;
}

type TabType = 'analysis' | 'video' | 'handwritten';

export default function SolutionViewer({ solution }: SolutionViewerProps) {
    // Determine available extra tabs
    const hasVideo = !!solution.videoUrl;
    const hasHandwritten = !!solution.handwrittenSolutionImageUrl;

    // Default to 'analysis' (Text + Audio)
    const [activeTab, setActiveTab] = useState<TabType>('analysis');

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tab Header - Only show if there are multiple views */}
            {(hasVideo || hasHandwritten) && (
                <div className="flex items-center overflow-x-auto border-b border-gray-800 no-scrollbar">
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'analysis'
                            ? 'text-orange-400 border-b-2 border-orange-500 bg-orange-500/5'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <FileText size={16} /> Analysis & Expert Guidance
                    </button>

                    {hasVideo && (
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'video'
                                ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <MonitorPlay size={16} /> Video Solution
                        </button>
                    )}

                    {hasHandwritten && (
                        <button
                            onClick={() => setActiveTab('handwritten')}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'handwritten'
                                ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <ImageIcon size={16} /> Handwritten Note
                        </button>
                    )}
                </div>
            )}

            {/* Content Area */}
            <div className="min-h-[300px] animate-fadeIn">

                {/* 1. ANALYSIS TAB (Text + Audio) */}
                {activeTab === 'analysis' && (
                    <div className="space-y-10 pt-6">
                        {/* Text Solution */}
                        <div className="prose prose-invert prose-lg max-w-none 
                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                            prose-headings:text-white prose-headings:mb-4
                            prose-strong:text-purple-300 prose-strong:font-bold
                            prose-code:text-purple-400 prose-code:bg-purple-950/30 prose-code:rounded prose-code:px-1
                            markdown-table-wrapper select-text">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[rehypeKatex, rehypeRaw]}
                                components={{
                                    p: ({ children }) => <p className="mb-6 leading-relaxed text-[15px] md:text-[16px]">{children}</p>,
                                    table: ({ children }) => (
                                        <div className="my-8 overflow-x-auto rounded-xl border border-gray-800 shadow-xl bg-black/40">
                                            <table className="w-full text-sm text-left">{children}</table>
                                        </div>
                                    ),
                                    th: ({ children }) => <th className="px-6 py-4 bg-gray-800/50 font-bold text-white border-b border-gray-700">{children}</th>,
                                    td: ({ children }) => <td className="px-6 py-4 border-b border-gray-800/30 text-gray-400">{children}</td>,
                                }}
                            >
                                {solution.textSolutionLatex}
                            </ReactMarkdown>
                        </div>

                        {/* Embedded Audio Player (Inline) */}
                        {solution.audioExplanationUrl && (
                            <div className="bg-gradient-to-r from-green-900/10 to-emerald-900/10 border border-green-500/20 p-5 rounded-xl flex flex-col md:flex-row items-center gap-6 mt-8">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] shrink-0">
                                        <Mic size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-1">Expert Guidance</h4>
                                        <p className="text-gray-400 text-xs md:text-sm">
                                            Click play to hear the expert's thought process for this problem.
                                        </p>
                                    </div>
                                </div>
                                <audio controls src={solution.audioExplanationUrl} className="w-full md:w-64 h-10" />
                            </div>
                        )}
                    </div>
                )}

                {/* 2. VIDEO TAB */}
                {activeTab === 'video' && solution.videoUrl && (
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                        <iframe
                            src={solution.videoUrl}
                            title="Video Solution"
                            className="absolute top-0 left-0 w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                )}

                {/* 3. HANDWRITTEN TAB */}
                {activeTab === 'handwritten' && solution.handwrittenSolutionImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                        <img
                            src={solution.handwrittenSolutionImageUrl}
                            alt="Handwritten Solution"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
