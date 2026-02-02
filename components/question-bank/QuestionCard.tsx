'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Check, X, AlertCircle } from 'lucide-react';
import { Question } from '@/app/the-crucible/types';
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

    // Reset numeric input when question changes (fixes bug where value persists across questions)
    useEffect(() => {
        setNumericInput('');
    }, [question.id]);

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
            <div className="p-0 mb-6 md:mb-8">
                <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-purple-500/20 text-purple-300 text-[10px] md:text-xs font-bold rounded-full mb-3 md:mb-4 border border-purple-500/30">
                    {question.tagId.split('_').pop()} • {question.difficulty}
                </span>
                <div className="text-sm md:text-base lg:text-lg font-medium text-white leading-relaxed prose prose-invert max-w-none prose-p:text-white prose-headings:text-white markdown-table-wrapper">
                    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
                        {question.textMarkdown}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Render Logic: MCQ vs INTEGER */}
            {question.type === 'INTEGER' ? (
                <div className="max-w-md mx-auto">
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={numericInput}
                            onChange={(e) => setNumericInput(e.target.value)}
                            disabled={showFeedback}
                            placeholder="Enter numerical value"
                            className={`w-full p-4 rounded-xl text-center text-2xl font-bold bg-gray-900 border-2 outline-none transition-all ${showFeedback
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
                <div className={`grid gap-2 md:gap-3 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {question.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.isCorrect;

                        // Determine styling based on state
                        let buttonStyle = "bg-gray-800/50 hover:bg-gray-700/50 border-gray-700 text-gray-300";
                        if (showFeedback) {
                            if (isCorrect) {
                                buttonStyle = "bg-emerald-900/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                            } else if (isSelected && !isCorrect) {
                                buttonStyle = "bg-amber-900/30 border-amber-500 text-amber-400";
                            } else {
                                buttonStyle = "bg-gray-900/10 border-gray-800 text-gray-500 opacity-50";
                            }
                        } else if (isSelected) {
                            buttonStyle = "bg-purple-600 border-purple-500 text-white shadow-lg scale-102";
                        }

                        return (
                            <motion.button
                                key={option.id}
                                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                onClick={() => handleOptionClick(option.id)}
                                className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden group ${buttonStyle}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border ${showFeedback && isCorrect ? 'bg-emerald-500 border-emerald-400 text-black' :
                                        showFeedback && isSelected && !isCorrect ? 'bg-amber-500 border-amber-400 text-white' :
                                            'bg-gray-700 border-gray-600 group-hover:bg-gray-600'
                                        }`}>
                                        {option.id}
                                    </span>
                                    <span className="flex-1 text-sm md:text-base font-medium text-left">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]} components={{ p: 'span' }}>
                                            {option.text}
                                        </ReactMarkdown>
                                    </span>

                                    {showFeedback && isCorrect && (
                                        <div className="absolute top-3 right-3 md:top-4 md:right-4 text-emerald-400">
                                            <Check size={16} className="md:w-5 md:h-5" />
                                        </div>
                                    )}
                                    {showFeedback && isSelected && !isCorrect && (
                                        <div className="absolute top-3 right-3 md:top-4 md:right-4 text-amber-400">
                                            <X size={16} className="md:w-5 md:h-5" />
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
