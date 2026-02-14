'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Check, X, AlertCircle } from 'lucide-react';
import { Question } from '@/app/the-crucible/types';
import ChemicalStructure from '../ChemicalStructure';
import 'katex/dist/katex.min.css';

interface QuestionCardProps {
    question: Question;
    onAnswerSubmit: (isCorrect: boolean, selectedOptionId: string) => void;
    showFeedback: boolean;
    selectedOptionId: string | null;
    layout?: 'grid' | 'list';
}

export default function QuestionCard({ question, onAnswerSubmit, showFeedback, selectedOptionId, layout = 'grid' }: QuestionCardProps) {
    const [numericInput, setNumericInput] = useState('');

    // Reset or restore numeric input when question changes
    useEffect(() => {
        setNumericInput(selectedOptionId || '');
    }, [question.id, selectedOptionId]);

    const processContent = (content: string) => {
        if (!content) return "";
        // 1. Only convert \n to real newline if NOT followed by a letter (preserves \nu, \neq, etc.)
        // 2. We use whitespace-pre-wrap in the CSS instead of aggressive replacement where possible
        return content.replace(/\\n(?![a-zA-Z])/g, '\n');
    };

    const processedText = useMemo(() => processContent(question.textMarkdown), [question.textMarkdown]);

    const handleOptionClick = (optionId: string) => {
        if (showFeedback) return;
        const isCorrect = question.options.find(o => o.id === optionId)?.isCorrect || false;
        onAnswerSubmit(isCorrect, optionId);
    };

    const handleNumericSubmit = () => {
        if (showFeedback || !numericInput) return;
        const isCorrect = numericInput.trim() === question.integerAnswer?.trim();
        onAnswerSubmit(isCorrect, numericInput);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Question Stem */}
            <div className="p-0 mb-4 md:mb-8">
                <div className="text-sm md:text-base lg:text-lg font-medium text-white leading-relaxed prose prose-invert max-w-none prose-p:text-white prose-headings:text-white">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        components={{
                            img: (props) => (
                                <img
                                    {...props}
                                    style={{
                                        maxWidth: question.imageScale ? `${question.imageScale}%` : '100%',
                                        height: 'auto',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                    className="rounded-lg border border-white/5 my-3"
                                />
                            ),
                            p: ({ children }) => <p className="mb-2 leading-tight tracking-normal text-gray-300/90 whitespace-pre-wrap">{children}</p>,
                            table: ({ children }) => (
                                <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/5 shadow-sm">
                                    <table className="w-full text-sm text-left border-collapse">{children}</table>
                                </div>
                            ),
                            th: ({ children }) => <th className="px-4 py-3 bg-white/10 font-bold border-b border-white/10 text-indigo-300 uppercase tracking-wider text-xs">{children}</th>,
                            td: ({ children }) => <td className="px-4 py-3 border-b border-white/5 text-gray-300">{children}</td>,
                        }}
                    >
                        {processedText}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Render Logic: MCQ vs NVT (Numerical Value Type) */}
            {question.questionType === 'NVT' ? (
                <div className="max-w-md mx-auto">
                    <div className="flex flex-col gap-4">
                        <input
                            type="number"
                            value={numericInput}
                            onChange={(e) => setNumericInput(e.target.value)}
                            disabled={showFeedback}
                            placeholder="Enter Value"
                            className={`w-48 p-3 rounded-xl text-center text-xl font-bold bg-gray-900 border-2 outline-none transition-all mx-auto ${showFeedback
                                ? (numericInput.trim() === question.integerAnswer?.trim()
                                    ? 'border-green-500 text-green-400 bg-green-900/20'
                                    : 'border-red-500 text-red-400 bg-red-900/20')
                                : 'border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                                }`}
                        />

                        {!showFeedback && (
                            <button
                                onClick={handleNumericSubmit}
                                disabled={!numericInput}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                            >
                                Submit Answer
                            </button>
                        )}

                        {showFeedback && (
                            <div className={`p-4 rounded-xl text-center border ${numericInput.trim() === question.integerAnswer?.trim()
                                ? 'bg-green-500/10 border-green-500/30 text-green-300'
                                : 'bg-red-500/10 border-red-500/30 text-red-300'
                                }`}>
                                {numericInput.trim() === question.integerAnswer?.trim() ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Check size={20} /> Correct! Answer is {question.integerAnswer}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-2 font-bold">
                                            <X size={20} /> Incorrect
                                        </div>
                                        <div className="text-sm opacity-80">Correct Answer: {question.integerAnswer}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* MCQ Options Grid */
                <div className={`grid gap-2 ${(() => {
                    // Logic: Determine layout based on content
                    // User Request: "The grid is best when we have 4 images... otherwise keep the text options in one line only"

                    const isAllImages = question.options.every(o =>
                        o.text.trim().startsWith('![') ||
                        o.text.includes('<img') ||
                        o.text.includes('[smiles:')
                    );

                    const isVeryShort = question.options.every(o => o.text.length < 10 && !o.text.includes('\n'));

                    // Strict Rule: Grid ONLY if all are images or very short labels
                    if (isAllImages || isVeryShort) return 'grid-cols-2';

                    // Default to List for everything else (text, mixed content, long formulas)
                    return 'grid-cols-1';
                })()}`}>
                    {question.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.isCorrect;

                        let buttonStyle = "bg-gray-800/40 hover:bg-gray-700/50 border-gray-700/50 text-gray-300";
                        if (showFeedback) {
                            if (isCorrect) {
                                buttonStyle = "bg-emerald-900/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                            } else if (isSelected && !isCorrect) {
                                buttonStyle = "bg-amber-900/20 border-amber-500/50 text-amber-400";
                            } else {
                                buttonStyle = "bg-transparent border-white/5 text-gray-600 opacity-40";
                            }
                        } else if (isSelected) {
                            buttonStyle = "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/50";
                        }

                        // Remove width-full grid behavior if using flex-col, but here we use grid layout classes
                        return (
                            <motion.button
                                key={option.id}
                                whileTap={!showFeedback ? { scale: 0.99 } : {}}
                                onClick={() => handleOptionClick(option.id)}
                                className={`w-full text-left rounded-xl border-2 transition-all duration-200 relative overflow-hidden group ${buttonStyle} flex items-start gap-3 p-3 md:p-4`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs border transition-colors ${showFeedback && isCorrect ? 'bg-emerald-500 border-emerald-400 text-black' :
                                        showFeedback && isSelected && !isCorrect ? 'bg-amber-500 border-amber-400 text-white' :
                                            isSelected ? 'bg-indigo-500 border-indigo-400 text-white' :
                                                'bg-white/5 border-white/10 group-hover:bg-white/10 text-gray-500'
                                        }`}>
                                        {option.id.split('_').pop()?.toUpperCase()}
                                    </span>
                                    <span className="flex-1 text-sm md:text-base font-medium text-left">
                                        {option.text.includes('[smiles:') ? (
                                            <span className="flex flex-col gap-2">
                                                {option.text.split(/(\[smiles:(?:[^\[\]]|\[[^\]]*\])*\])/).map((part, idx) => {
                                                    if (part.startsWith('[smiles:') && part.endsWith(']')) {
                                                        const inner = part.slice(8, -1);
                                                        const [code, ...params] = inner.split('|');
                                                        let rotate = 0;
                                                        params.forEach(p => {
                                                            if (p.startsWith('rotate=')) rotate = parseInt(p.split('=')[1]) || 0;
                                                        });

                                                        return (
                                                            <div key={idx} className="bg-gray-900/50 rounded-lg p-2 border border-gray-700/50 inline-block w-fit">
                                                                <ChemicalStructure smiles={code} rotate={rotate} />
                                                            </div>
                                                        );
                                                    }
                                                    if (!part.trim()) return null;
                                                    return (
                                                        <ReactMarkdown key={idx} remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex, rehypeRaw]} components={{ p: 'span' }}>
                                                            {processContent(part)}
                                                        </ReactMarkdown>
                                                    );
                                                })}
                                            </span>
                                        ) : (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath, remarkGfm]}
                                                rehypePlugins={[rehypeKatex, rehypeRaw]}
                                                components={{
                                                    p: 'span',
                                                    img: (props) => (
                                                        <img
                                                            {...props}
                                                            style={{
                                                                maxWidth: option.imageScale ? `${option.imageScale}%` : '100%',
                                                                height: 'auto',
                                                                display: 'block',
                                                                margin: '0 auto'
                                                            }}
                                                            className="rounded border border-gray-700/50 my-2"
                                                        />
                                                    )
                                                }}
                                            >
                                                {processContent(option.text)}
                                            </ReactMarkdown>
                                        )}
                                    </span>

                                    {showFeedback && isCorrect && (isSelected || true) && (
                                        <div className="shrink-0 text-emerald-400">
                                            <Check size={14} />
                                        </div>
                                    )}
                                    {showFeedback && isSelected && !isCorrect && (
                                        <div className="shrink-0 text-amber-400">
                                            <X size={14} />
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
