'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, BookOpen, XCircle, ArrowRight } from 'lucide-react';
import { TrapInfo } from '@/app/the-crucible/types';

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
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed bottom-0 left-0 right-0 md:right-64 lg:right-72 z-50 py-4 md:py-5 px-4 md:px-6 lg:px-8 rounded-t-2xl md:rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 ${isCorrect
                    ? 'bg-gradient-to-br from-emerald-900 to-teal-950'
                    : 'bg-gradient-to-br from-amber-900 to-orange-950'
                    }`}
            >
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {isCorrect ? (
                                <>
                                    <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_currentColor]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Excellent!</h3>
                                </>
                            ) : (
                                <>
                                    <XCircle className="text-amber-400 w-7 h-7 md:w-8 md:h-8" />
                                    <h3 className="text-xl md:text-2xl font-bold text-white">Not quite...</h3>
                                </>
                            )}
                        </div>

                        {!isCorrect && trap && (
                            <div className="mt-2 bg-black/20 p-3 rounded-xl border-l-4 border-orange-500 backdrop-blur-sm">
                                <p className="text-orange-200 text-sm font-medium flex items-start gap-2">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    {trap.message}
                                </p>
                            </div>
                        )}
                        {!isCorrect && !trap && (
                            <p className="text-amber-200/80 text-sm mt-2">Check the solution to understand the concept.</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {!isCorrect && (
                            <button
                                onClick={onViewSolution}
                                className="flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                            >
                                <BookOpen size={18} /> Explain Why
                            </button>
                        )}
                        <button
                            onClick={onNext}
                            className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg text-sm md:text-base ${isCorrect
                                ? 'bg-white text-emerald-900 hover:bg-gray-100'
                                : 'bg-white text-amber-900 hover:bg-gray-100'
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
