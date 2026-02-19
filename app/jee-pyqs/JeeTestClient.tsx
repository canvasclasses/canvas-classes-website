'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { JEEQuestion } from '@/app/lib/jee-pyqs/data';
import { LayoutGrid, CheckCircle, Clock, Video, FileText, ChevronLeft, ChevronRight, Play, Flag, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JeeTestClientProps {
    chapterName: string;
    questions: JEEQuestion[];
}

type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked';

export default function JeeTestClient({ chapterName, questions }: JeeTestClientProps) {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [mode, setMode] = useState<'practice' | 'test'>('practice');
    const [answers, setAnswers] = useState<Record<string, string>>({}); // valid options are 'A'|'B'|'C'|'D'
    const [marked, setMarked] = useState<Record<string, boolean>>({});
    const [showSolution, setShowSolution] = useState(false);

    // Timer Logic for Test Mode
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && mode === 'test') {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, mode]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionId: string) => {
        setAnswers(prev => ({ ...prev, [questions[currentQIndex].id]: optionId }));
        if (mode === 'practice') {
            setShowSolution(true); // Instant feedback in practice
        }
    };

    const toggleMark = () => {
        setMarked(prev => ({ ...prev, [questions[currentQIndex].id]: !prev[questions[currentQIndex].id] }));
    };

    const currentQ = questions[currentQIndex];

    if (!currentQ) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 text-lg mb-4">No questions available for this chapter yet.</p>
                    <a href="/jee-pyqs" className="text-blue-400 hover:text-blue-300 transition-colors">← Back to chapters</a>
                </div>
            </div>
        );
    }

    const getStatusParams = (qId: string, idx: number): string => {
        if (currentQIndex === idx) return 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 border-blue-500 bg-blue-500 text-white';
        if (marked[qId]) return 'bg-purple-600 border-purple-600 text-white';
        if (answers[qId]) return 'bg-emerald-600 border-emerald-600 text-white';
        return 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500';
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur flex items-center justify-between px-4 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <Link href="/jee-pyqs" className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-semibold hidden md:block">{chapterName}</h1>
                        <span className="text-xs text-amber-500 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            Top 25 PYQs
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {mode === 'test' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-white/5 text-slate-200 font-mono">
                            <Clock className="w-4 h-4 text-blue-400" />
                            {formatTime(seconds)}
                        </div>
                    )}

                    <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => { setMode('practice'); setIsActive(false); }}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'practice' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Practice
                        </button>
                        <button
                            onClick={() => { setMode('test'); setIsActive(true); setSeconds(0); setAnswers({}); setShowSolution(false); }}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'test' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Test Mode
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex pt-16 flex-col md:flex-row h-screen">
                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Question Header tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-white/5">
                                Q{currentQ.questionNumber}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {currentQ.year}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {currentQ.difficulty}
                            </span>
                        </div>

                        {/* Question Body */}
                        <div className="mb-8">
                            <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-serif whitespace-pre-wrap">
                                {currentQ.questionText}
                            </p>
                            {currentQ.hasImage && (
                                <div className="mt-4 relative w-full h-[300px] bg-white/5 rounded-xl overflow-hidden border border-white/10">
                                    <Image
                                        src={`/jee-pyqs/images/${currentQ.id}.webp`}
                                        alt="Question Diagram"
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {currentQ.options.map((opt) => {
                                const isSelected = answers[currentQ.id] === opt.id;
                                const isCorrect = currentQ.correctOption === opt.id;
                                const showResult = (mode === 'practice' && showSolution) || (mode === 'test' && false); // Hide result in test mode until end

                                let borderClass = "border-white/10 hover:border-blue-500/50";
                                let bgClass = "bg-slate-900/50";

                                if (isSelected) {
                                    borderClass = "border-blue-500";
                                    bgClass = "bg-blue-500/10";
                                }

                                // Reveal Color in practice mode
                                if (showResult) {
                                    if (isCorrect) {
                                        borderClass = "border-emerald-500";
                                        bgClass = "bg-emerald-500/20";
                                    } else if (isSelected && !isCorrect) {
                                        borderClass = "border-red-500";
                                        bgClass = "bg-red-500/10";
                                    }
                                }

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleOptionSelect(opt.id)}
                                        disabled={mode === 'practice' && showSolution} // Freeze after answer in practice
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${borderClass} ${bgClass}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            {opt.id}
                                        </div>
                                        <div className="flex-1">
                                            {opt.text && <span className="text-slate-200">{opt.text}</span>}
                                            {opt.hasImage && (
                                                <div className="relative h-16 w-32 mt-2">
                                                    <Image
                                                        src={`/jee-pyqs/images/${currentQ.id}_${opt.id}.webp`}
                                                        alt={`Option ${opt.id}`}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Control Bar (Mobile Sticky) */}
                        <div className="flex items-center justify-between gap-4 mt-8 pb-4 border-t border-white/10 pt-6">
                            <button
                                onClick={() => {
                                    setCurrentQIndex(Math.max(0, currentQIndex - 1));
                                    setShowSolution(answers[questions[currentQIndex - 1]?.id] ? true : false);
                                }}
                                disabled={currentQIndex === 0}
                                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={toggleMark}
                                    className={`p-2 rounded-lg transition-colors ${marked[currentQ.id] ? 'text-purple-400 bg-purple-400/10' : 'text-slate-500 hover:bg-slate-800'}`}
                                    title="Mark for Review"
                                >
                                    <Flag className="w-5 h-5 fill-current" />
                                </button>
                                {mode === 'practice' && (
                                    <button
                                        onClick={() => setShowSolution(!showSolution)}
                                        className={`px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-2`}
                                    >
                                        {showSolution ? <><Video className="w-4 h-4" /> Hide Solution</> : <><Video className="w-4 h-4" /> Video Solution</>}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1));
                                    const nextQId = questions[currentQIndex + 1]?.id;
                                    setShowSolution(mode === 'practice' && answers[nextQId] ? true : false);
                                }}
                                disabled={currentQIndex === questions.length - 1}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Detailed Solution (Practice Mode Only) */}
                        <AnimatePresence>
                            {mode === 'practice' && showSolution && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 p-6 rounded-xl bg-slate-900 border border-amber-500/20"
                                >
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        Answer & Explanation
                                    </h3>

                                    <div className="mb-4 text-emerald-400 font-semibold">
                                        Correct Option: {currentQ.correctOption}
                                    </div>

                                    {currentQ.textSolution && (
                                        <div className="prose prose-invert max-w-none text-slate-300 mb-6">
                                            {currentQ.textSolution}
                                        </div>
                                    )}

                                    {currentQ.videoSolutionUrl && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/5">
                                            {/* Simplified Video Placeholder or Embed */}
                                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-slate-500">
                                                <Play className="w-12 h-12 text-slate-600" />
                                                <p className="text-sm">Video Player Placeholder for {currentQ.videoSolutionUrl}</p>
                                                {/* In production, embed YouTube iframe here */}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>

                {/* Right Sidebar (Navigation) - Collapsible on Mobile */}
                <div className="w-full md:w-80 border-l border-white/10 bg-slate-900/30 p-4 md:flex flex-col hidden">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => { setCurrentQIndex(idx); setShowSolution(mode === 'practice' && answers[q.id] ? true : false); }}
                                className={`h-10 rounded-lg border text-sm font-medium transition-all ${getStatusParams(q.id, idx)}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="w-3 h-3 rounded-full bg-emerald-600"></div> Answered
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div> Not Answered
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div> Marked for Review
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
