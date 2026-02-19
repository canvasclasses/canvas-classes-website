'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, BookOpen, XCircle, ArrowRight } from 'lucide-react';

// Define TrapInfo inline for compatibility
interface TrapInfo {
    optionId: string;
    explanation: string;
    [key: string]: any;
}

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface FeedbackOverlayProps {
    isOpen: boolean;
    isCorrect: boolean;
    trap?: TrapInfo;
    onNext: () => void;
    onViewSolution: () => void;
}

export default function FeedbackOverlay({ isOpen, isCorrect, trap, onNext, onViewSolution }: FeedbackOverlayProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className={`fixed bottom-0 left-0 right-0 md:right-64 lg:right-72 z-50 border-t border-white/10 shadow-2xl safe-area-pb ${isCorrect
                    ? 'bg-[#064e3b]' // emerald-900 solid 
                    : 'bg-[#451a03]' // amber-950 solid
                    }`}
            >
                <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
                    {/* Main Content Area: Status + Tip */}
                    <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className="shrink-0 mt-0.5">
                            {isCorrect ? (
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_currentColor]" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <AlertTriangle className="text-amber-400 w-6 h-6" />
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 space-y-1">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/50">
                                {isCorrect ? 'Victory Status' : 'Strategic Adjustment'}
                            </h3>
                            <div className="prose prose-invert prose-p:my-0 prose-p:leading-relaxed max-w-none">
                                {isCorrect ? (
                                    <p className="text-base font-bold text-white">Excellent! Question Mastered.</p>
                                ) : trap ? (
                                    <div className="text-sm md:text-base text-amber-100 font-medium leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                            {trap.message}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm text-amber-200/80">Check the solution below to refine your approach.</p>
                                )}
                            </div>
                        </div>

                        {/* Desktop Actions Placeholder (Hidden on small screens, part of flex-row on larger) */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={onViewSolution}
                                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap"
                            >
                                <BookOpen size={18} /> {isCorrect ? 'Solution' : 'Explain Why'}
                            </button>
                            <button
                                onClick={onNext}
                                className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg text-sm md:text-base whitespace-nowrap ${isCorrect
                                    ? 'bg-white text-emerald-900 border-none'
                                    : 'bg-white text-amber-900 border-none'
                                    }`}
                            >
                                Next <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Actions Overlay: Full width footer buttons for better tap targets but shorter height */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={onViewSolution}
                            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                        >
                            <BookOpen size={16} /> {isCorrect ? 'Solution' : 'Why?'}
                        </button>
                        <button
                            onClick={onNext}
                            className={`flex-[1.5] px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg text-sm ${isCorrect
                                ? 'bg-white text-emerald-900'
                                : 'bg-white text-amber-900'
                                }`}
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
