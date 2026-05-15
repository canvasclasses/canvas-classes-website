'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Zap, CheckCircle, XCircle, Sparkles, Trophy, RefreshCw,
    ChevronRight, ChevronLeft, Lightbulb, Target, Brain,
    ArrowRight, RotateCcw, X, Clock, Shuffle, Layers, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { AssertionReasonQuestion, groupByChapter, ChapterGroup, shuffleArray } from '../lib/assertionReasonData';
import { useAssertionProgress } from '../hooks/useAssertionProgress';
import { QualityRating } from '../lib/spacedRepetition';

type Phase = 'assertion' | 'reason' | 'link' | 'result';
type PracticeMode = 'due' | 'all';

interface Props {
    initialQuestions: AssertionReasonQuestion[];
}

export default function AssertionReasonClient({ initialQuestions }: Props) {
    const [chapterGroups, setChapterGroups] = useState<ChapterGroup[]>([]);

    // Navigation state
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceType, setPracticeType] = useState<PracticeMode>('due');

    // Practice state
    const [practiceQueue, setPracticeQueue] = useState<AssertionReasonQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('assertion');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ a: boolean | null; r: boolean | null; link: boolean | null }>({ a: null, r: null, link: null });

    // Session stats
    const [sessionStats, setSessionStats] = useState({ correct: 0, needsReview: 0 });

    // Ref for scrolling
    const practiceContainerRef = useRef<HTMLDivElement>(null);

    // Spaced repetition hook
    const {
        isLoaded: progressLoaded,
        getProgress,
        updateProgress,
        getDueCards,
        sortByPriority,
        getStatistics,
        resetAllProgress,
        hasAnyProgress
    } = useAssertionProgress();

    // Group questions by chapter on mount
    useEffect(() => {
        const groups = groupByChapter(initialQuestions);
        setChapterGroups(groups);
    }, [initialQuestions]);

    // Get all question IDs for global stats
    const allQuestionIds = useMemo(() => initialQuestions.map(q => q.id), [initialQuestions]);

    // Global statistics
    const globalStats = useMemo(() => {
        if (!progressLoaded || allQuestionIds.length === 0) return null;
        return getStatistics(allQuestionIds);
    }, [progressLoaded, allQuestionIds, getStatistics]);

    // Get selected chapter data
    const selectedChapterData = chapterGroups.find(g => g.chapterName === selectedChapter);

    // Chapter-specific stats
    const chapterStats = useMemo(() => {
        if (!selectedChapterData || !progressLoaded) return null;
        const chapterQuestionIds = selectedChapterData.questions.map(q => q.id);
        return getStatistics(chapterQuestionIds);
    }, [selectedChapterData, progressLoaded, getStatistics]);

    // Get due count for current selection
    const getDueCountForSelection = () => {
        if (!selectedChapterData) return 0;
        return getDueCards(selectedChapterData.questions.map(q => q.id)).length;
    };

    // Current question
    const currentQuestion = practiceQueue[currentIndex];

    // Start practice session
    const startPractice = (mode: PracticeMode) => {
        if (!selectedChapterData) return;

        let queue: AssertionReasonQuestion[];

        if (mode === 'due') {
            const dueIds = getDueCards(selectedChapterData.questions.map(q => q.id));
            const sortedIds = sortByPriority(dueIds);
            queue = sortedIds.map(id => selectedChapterData.questions.find(q => q.id === id)!).filter(Boolean);
        } else {
            queue = shuffleArray(selectedChapterData.questions);
        }

        setPracticeType(mode);
        setPracticeQueue(queue);
        setCurrentIndex(0);
        setPhase('assertion');
        setIsCorrect(null);
        setUserAnswers({ a: null, r: null, link: null });
        setSessionStats({ correct: 0, needsReview: 0 });
        setIsPracticeMode(true);

        setTimeout(() => {
            practiceContainerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    };

    // Phase handlers - same logic as before
    const handleAssertionAnswer = (answer: boolean) => {
        setUserAnswers({ ...userAnswers, a: answer });

        if (answer === currentQuestion.aTruth) {
            if (!currentQuestion.aTruth) {
                setIsCorrect(true);
                setPhase('result');
            } else {
                setPhase('reason');
            }
        } else {
            setIsCorrect(false);
            setPhase('result');
        }
    };

    const handleReasonAnswer = (answer: boolean) => {
        setUserAnswers({ ...userAnswers, r: answer });

        if (answer === currentQuestion.rTruth) {
            if (!currentQuestion.rTruth) {
                setIsCorrect(true);
                setPhase('result');
            } else {
                setPhase('link');
            }
        } else {
            setIsCorrect(false);
            setPhase('result');
        }
    };

    const handleLinkAnswer = (answer: boolean) => {
        setUserAnswers({ ...userAnswers, link: answer });

        if (answer === currentQuestion.isExplanation) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
        setPhase('result');
    };

    // Handle spaced repetition response
    const handleQualityResponse = (quality: QualityRating) => {
        if (currentQuestion) {
            updateProgress(currentQuestion.id, quality);

            if (quality >= 3) {
                setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
            } else {
                setSessionStats(prev => ({ ...prev, needsReview: prev.needsReview + 1 }));
            }
        }
        nextQuestion();
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= practiceQueue.length) {
            setIsPracticeMode(false);
        } else {
            setCurrentIndex(currentIndex + 1);
            setPhase('assertion');
            setIsCorrect(null);
            setUserAnswers({ a: null, r: null, link: null });
        }
    };

    const exitPractice = () => {
        setIsPracticeMode(false);
    };

    // Loading state
    if (!progressLoaded) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

            {/* Hero Section */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
                            <Zap className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-semibold text-sm">NCERT & Boards</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Circuit{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Breaker
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                            Master Assertion & Reason questions with our 3-step decision flow and spaced repetition.
                        </p>

                        {/* Global Stats */}
                        {globalStats && (
                            <div className="flex flex-wrap justify-center gap-3 mb-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Layers className="w-4 h-4 text-blue-400" />
                                    <span className="text-white font-medium">{initialQuestions.length} Questions</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Brain className="w-4 h-4 text-purple-400" />
                                    <span className="text-white font-medium">{chapterGroups.length} Chapters</span>
                                </div>
                                {hasAnyProgress() && (
                                    <>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                            <Clock className="w-4 h-4 text-amber-400" />
                                            <span className="text-amber-400 font-medium">{globalStats.dueToday} Due Today</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            <Trophy className="w-4 h-4 text-emerald-400" />
                                            <span className="text-emerald-400 font-medium">{globalStats.mastered} Mastered</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {!isPracticeMode ? (
                        /* Chapter Selection View */
                        <div className="max-w-5xl mx-auto">
                            {!selectedChapter ? (
                                /* Chapter Grid */
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">Select a Chapter</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {chapterGroups.map((group, idx) => {
                                            const chapterQuestionIds = group.questions.map(q => q.id);
                                            const stats = getStatistics(chapterQuestionIds);
                                            const dueCount = stats.dueToday;

                                            return (
                                                <motion.button
                                                    key={group.chapterName}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    onClick={() => setSelectedChapter(group.chapterName)}
                                                    className="group p-5 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-blue-500/30 rounded-2xl text-left transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                            <Zap className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {dueCount > 0 && (
                                                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                                                    {dueCount} due
                                                                </span>
                                                            )}
                                                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-white font-semibold mb-1">{group.chapterName}</h3>
                                                    <p className="text-slate-500 text-sm mb-3">{group.questions.length} questions</p>

                                                    {/* Mini progress bar */}
                                                    {stats.mastered + stats.reviewing + stats.learning > 0 && (
                                                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden flex">
                                                            {stats.mastered > 0 && (
                                                                <div
                                                                    className="h-full bg-emerald-500"
                                                                    style={{ width: `${(stats.mastered / stats.total) * 100}%` }}
                                                                />
                                                            )}
                                                            {stats.reviewing > 0 && (
                                                                <div
                                                                    className="h-full bg-blue-500"
                                                                    style={{ width: `${(stats.reviewing / stats.total) * 100}%` }}
                                                                />
                                                            )}
                                                            {stats.learning > 0 && (
                                                                <div
                                                                    className="h-full bg-amber-500"
                                                                    style={{ width: `${(stats.learning / stats.total) * 100}%` }}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : (
                                /* Chapter Detail / Practice Options */
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <button
                                        onClick={() => setSelectedChapter(null)}
                                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Back to chapters
                                    </button>

                                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                                        <h2 className="text-2xl font-bold text-white mb-2">{selectedChapter}</h2>
                                        <p className="text-slate-400 mb-6">Choose your practice mode to begin</p>

                                        {/* Chapter Stats */}
                                        {chapterStats && (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                                <div className="p-3 bg-slate-900/50 rounded-xl text-center">
                                                    <p className="text-2xl font-bold text-slate-400">{chapterStats.new}</p>
                                                    <p className="text-xs text-slate-500">New</p>
                                                </div>
                                                <div className="p-3 bg-amber-500/10 rounded-xl text-center">
                                                    <p className="text-2xl font-bold text-amber-400">{chapterStats.learning}</p>
                                                    <p className="text-xs text-amber-500/80">Learning</p>
                                                </div>
                                                <div className="p-3 bg-blue-500/10 rounded-xl text-center">
                                                    <p className="text-2xl font-bold text-blue-400">{chapterStats.reviewing}</p>
                                                    <p className="text-xs text-blue-500/80">Reviewing</p>
                                                </div>
                                                <div className="p-3 bg-emerald-500/10 rounded-xl text-center">
                                                    <p className="text-2xl font-bold text-emerald-400">{chapterStats.mastered}</p>
                                                    <p className="text-xs text-emerald-500/80">Mastered</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3-Phase Explanation */}
                                        <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                                <Brain className="w-4 h-4 text-purple-400" />
                                                How Circuit Breaker Works
                                            </h3>
                                            <div className="grid md:grid-cols-3 gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">1</div>
                                                    <span className="text-slate-400 text-sm">Is Assertion True?</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">2</div>
                                                    <span className="text-slate-400 text-sm">Is Reason True?</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">3</div>
                                                    <span className="text-slate-400 text-sm">Does R explain A?</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Practice Buttons */}
                                        <div className="flex flex-wrap gap-3">
                                            {getDueCountForSelection() > 0 && (
                                                <button
                                                    onClick={() => startPractice('due')}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                                >
                                                    <Clock className="w-5 h-5" />
                                                    Review Due ({getDueCountForSelection()})
                                                </button>
                                            )}

                                            <button
                                                onClick={() => startPractice('all')}
                                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                            >
                                                <Shuffle className="w-5 h-5" />
                                                Practice All ({selectedChapterData?.questions.length || 0})
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        /* Practice Mode */
                        <div ref={practiceContainerRef} className="max-w-3xl mx-auto">
                            {currentQuestion ? (
                                <motion.div
                                    key={`question-${currentIndex}-${phase}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-800/50 rounded-3xl border border-white/5 overflow-hidden"
                                >
                                    {/* Progress Bar */}
                                    <div className="px-6 py-4 bg-slate-900/50 border-b border-white/5">
                                        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                                            <span>Question {currentIndex + 1} of {practiceQueue.length}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-emerald-400">✓ {sessionStats.correct}</span>
                                                <span className="text-amber-400">↻ {sessionStats.needsReview}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((currentIndex + 1) / practiceQueue.length) * 100}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8">
                                        {/* Chapter Badge & Exit */}
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-sm font-medium text-slate-500">{currentQuestion.chapter}</span>
                                            <button
                                                onClick={exitPractice}
                                                className="p-2 rounded-full hover:bg-slate-700 text-slate-500 hover:text-white transition-colors"
                                                title="Exit Practice"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        {/* Phase Indicator */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${phase === 'assertion' || phase === 'reason' || phase === 'link' || phase === 'result'
                                                    ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'
                                                }`}>1</div>
                                            <div className={`w-12 h-1 rounded ${userAnswers.a !== null ? 'bg-blue-600' : 'bg-slate-700'}`} />
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${phase === 'reason' || phase === 'link' || phase === 'result'
                                                    ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-500'
                                                }`}>2</div>
                                            <div className={`w-12 h-1 rounded ${userAnswers.r !== null ? 'bg-purple-600' : 'bg-slate-700'}`} />
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${phase === 'link' || phase === 'result'
                                                    ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-500'
                                                }`}>3</div>
                                        </div>

                                        {/* Assertion Box */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="rounded-xl p-5 mb-4 border-2 border-blue-500/30 bg-blue-500/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold">A</div>
                                                <div className="flex-1 text-white text-lg leading-relaxed">
                                                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                        {currentQuestion.assertion}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Reason Box (appears in phase 2+) */}
                                        <AnimatePresence>
                                            {(phase === 'reason' || phase === 'link' || phase === 'result') && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="rounded-xl p-5 mb-4 border-2 border-purple-500/30 bg-purple-500/10"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="px-2 py-1 rounded bg-purple-600 text-white text-xs font-bold">R</div>
                                                        <div className="flex-1 text-white text-lg leading-relaxed">
                                                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                                {currentQuestion.reason}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Phase 1: Assertion Question */}
                                        {phase === 'assertion' && (
                                            <div className="mt-8">
                                                <h3 className="text-center text-slate-400 font-medium mb-4">Is the Assertion TRUE or FALSE?</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => handleAssertionAnswer(true)}
                                                        className="py-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-lg transition-all border-2 border-emerald-500/30 hover:border-emerald-500/50"
                                                    >
                                                        TRUE
                                                    </button>
                                                    <button
                                                        onClick={() => handleAssertionAnswer(false)}
                                                        className="py-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-lg transition-all border-2 border-red-500/30 hover:border-red-500/50"
                                                    >
                                                        FALSE
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Phase 2: Reason Question */}
                                        {phase === 'reason' && (
                                            <div className="mt-8">
                                                <h3 className="text-center text-slate-400 font-medium mb-4">Is the Reason TRUE or FALSE?</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => handleReasonAnswer(true)}
                                                        className="py-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-lg transition-all border-2 border-emerald-500/30 hover:border-emerald-500/50"
                                                    >
                                                        TRUE
                                                    </button>
                                                    <button
                                                        onClick={() => handleReasonAnswer(false)}
                                                        className="py-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-lg transition-all border-2 border-red-500/30 hover:border-red-500/50"
                                                    >
                                                        FALSE
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Phase 3: Link Question */}
                                        {phase === 'link' && (
                                            <div className="mt-8">
                                                <h3 className="text-center text-slate-400 font-medium mb-4">
                                                    Does the Reason CORRECTLY explain the Assertion?
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => handleLinkAnswer(true)}
                                                        className="py-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-bold text-lg transition-all border-2 border-indigo-500/30 hover:border-indigo-500/50"
                                                    >
                                                        Yes, it explains
                                                    </button>
                                                    <button
                                                        onClick={() => handleLinkAnswer(false)}
                                                        className="py-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-lg transition-all border-2 border-amber-500/30 hover:border-amber-500/50"
                                                    >
                                                        No, just a fact
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Result Phase */}
                                        {phase === 'result' && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mt-6"
                                            >
                                                {isCorrect ? (
                                                    <div className="rounded-xl p-5 bg-emerald-500/10 border-2 border-emerald-500/30">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                <CheckCircle className="text-white" size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-emerald-400 text-lg">Correct!</div>
                                                                <div className="text-emerald-500/80 flex items-center gap-1">
                                                                    <Sparkles size={16} /> Great job!
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-xl p-5 bg-red-500/10 border-2 border-red-500/30">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                                                                <XCircle className="text-white" size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-red-400 text-lg">Not quite right</div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-red-500/20">
                                                            <div className="flex items-start gap-2 mb-2">
                                                                <Lightbulb className="text-amber-400 mt-0.5" size={18} />
                                                                <span className="font-semibold text-white">Concept Card</span>
                                                            </div>
                                                            <div className="text-slate-300 text-sm">
                                                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                                    {currentQuestion.explanation}
                                                                </ReactMarkdown>
                                                            </div>
                                                            <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-slate-400">
                                                                <p><strong>Assertion:</strong> {currentQuestion.aTruth ? 'True' : 'False'}</p>
                                                                <p><strong>Reason:</strong> {currentQuestion.rTruth ? 'True' : 'False'}</p>
                                                                {currentQuestion.aTruth && currentQuestion.rTruth && (
                                                                    <p><strong>Link:</strong> {currentQuestion.isExplanation ? 'R explains A' : 'R does not explain A'}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Spaced Repetition Response Buttons */}
                                                <div className="mt-8">
                                                    <p className="text-center text-slate-500 text-sm mb-4">How well did you know this?</p>
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => handleQualityResponse(1)}
                                                            className="flex flex-col items-center gap-1 px-5 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                                        >
                                                            <X className="w-5 h-5" />
                                                            <span className="text-xs">Again</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleQualityResponse(3)}
                                                            className="flex flex-col items-center gap-1 px-5 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors"
                                                        >
                                                            <RotateCcw className="w-5 h-5" />
                                                            <span className="text-xs">Hard</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleQualityResponse(4)}
                                                            className="flex flex-col items-center gap-1 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                            <span className="text-xs">Good</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleQualityResponse(5)}
                                                            className="flex flex-col items-center gap-1 px-5 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
                                                        >
                                                            <Zap className="w-5 h-5" />
                                                            <span className="text-xs">Easy</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : practiceQueue.length === 0 ? (
                                /* No Due Cards */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
                                    <p className="text-slate-400 mb-8">No questions are due for review right now. Great job!</p>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => startPractice('all')}
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <Shuffle className="w-5 h-5" />
                                            Practice All Anyway
                                        </button>
                                        <button
                                            onClick={() => setSelectedChapter(null)}
                                            className="px-6 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                                        >
                                            Choose Different Chapter
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Session Complete */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Session Complete!</h2>
                                    <p className="text-slate-400 mb-8">Your progress has been saved. Come back tomorrow to review!</p>

                                    <div className="flex justify-center gap-6 mb-8">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-emerald-400">{sessionStats.correct}</p>
                                            <p className="text-slate-500 text-sm">Correct</p>
                                        </div>
                                        <div className="w-px bg-slate-700" />
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-amber-400">{sessionStats.needsReview}</p>
                                            <p className="text-slate-500 text-sm">Need Review</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => startPractice(practiceType)}
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Practice Again
                                        </button>
                                        <button
                                            onClick={() => setSelectedChapter(null)}
                                            className="px-6 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                                        >
                                            Choose Different Chapter
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
