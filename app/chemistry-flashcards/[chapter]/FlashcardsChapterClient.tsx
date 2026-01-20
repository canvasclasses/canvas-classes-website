'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Layers,
    RotateCcw,
    ChevronLeft,
    Shuffle,
    Check,
    X,
    Sparkles,
    Brain,
    Zap,
    Clock,
    Trophy,
    RefreshCw
} from 'lucide-react';
import { FlashcardItem } from '../../lib/revisionData';
import { useCardProgress } from '../../hooks/useCardProgress';
import { QualityRating } from '../../lib/spacedRepetition';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
    chapterName: string;
    chapterSlug: string;
    initialFlashcards: FlashcardItem[];
    topics: string[];
    totalChapters: number;
}

type PracticeMode = 'due' | 'all';

export default function FlashcardsChapterClient({
    chapterName,
    chapterSlug,
    initialFlashcards,
    topics,
    totalChapters
}: Props) {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [practiceQueue, setPracticeQueue] = useState<FlashcardItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceType, setPracticeType] = useState<PracticeMode>('due');
    const [sessionStats, setSessionStats] = useState({ correct: 0, needsReview: 0 });

    const practiceContainerRef = useRef<HTMLDivElement>(null);

    const {
        isLoaded: progressLoaded,
        getProgress,
        updateProgress,
        getDueCards,
        sortByPriority,
        getStatistics,
    } = useCardProgress();

    const allCardIds = useMemo(() => initialFlashcards.map(c => c.id), [initialFlashcards]);

    const chapterStats = useMemo(() => {
        if (!progressLoaded || allCardIds.length === 0) return null;
        return getStatistics(allCardIds);
    }, [progressLoaded, allCardIds, getStatistics]);

    const startPractice = (mode: PracticeMode) => {
        let candidates = selectedTopics.length > 0
            ? initialFlashcards.filter(c => selectedTopics.includes(c.topicName))
            : initialFlashcards;

        let queue: FlashcardItem[];

        if (mode === 'due') {
            const dueCardIds = getDueCards(candidates.map(c => c.id));
            const sortedIds = sortByPriority(dueCardIds);
            queue = sortedIds.map(id => candidates.find(c => c.id === id)!).filter(Boolean);
        } else {
            queue = [...candidates].sort(() => Math.random() - 0.5);
        }

        setPracticeType(mode);
        setPracticeQueue(queue);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionStats({ correct: 0, needsReview: 0 });
        setIsPracticeMode(true);

        setTimeout(() => {
            practiceContainerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    };

    const handleResponse = (quality: QualityRating) => {
        const card = practiceQueue[currentIndex];
        if (card) {
            updateProgress(card.id, quality);
            if (quality >= 3) {
                setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
            } else {
                setSessionStats(prev => ({ ...prev, needsReview: prev.needsReview + 1 }));
            }
        }
        nextCard();
    };

    const nextCard = () => {
        setIsFlipped(false);
        if (currentIndex < practiceQueue.length - 1) {
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        } else {
            setIsPracticeMode(false);
        }
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    const getDueCountForSelection = () => {
        const candidates = selectedTopics.length > 0
            ? initialFlashcards.filter(c => selectedTopics.includes(c.topicName))
            : initialFlashcards;
        return getDueCards(candidates.map(c => c.id)).length;
    };

    const currentCard = practiceQueue[currentIndex];

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Section */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4">
                    {/* Back link */}
                    <Link
                        href="/chemistry-flashcards"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        All Chapters
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-6">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 font-semibold text-sm">Spaced Repetition</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            {chapterName}{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Flashcards
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                            Master {chapterName} with {initialFlashcards.length} flashcards using spaced repetition.
                        </p>

                        {/* Stats */}
                        {chapterStats && progressLoaded && (
                            <div className="flex flex-wrap justify-center gap-3 mb-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Layers className="w-4 h-4 text-purple-400" />
                                    <span className="text-white font-medium">{initialFlashcards.length} Cards</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <span className="text-white font-medium">{topics.length} Topics</span>
                                </div>
                                {chapterStats.dueToday > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                        <span className="text-amber-400 font-medium">{chapterStats.dueToday} Due Today</span>
                                    </div>
                                )}
                                {chapterStats.mastered > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        <Trophy className="w-4 h-4 text-emerald-400" />
                                        <span className="text-emerald-400 font-medium">{chapterStats.mastered} Mastered</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {!progressLoaded ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        </div>
                    ) : !isPracticeMode ? (
                        /* Topic Selection */
                        <div className="max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                                    <h2 className="text-xl font-bold text-white mb-2">Select Topics to Practice</h2>
                                    <p className="text-slate-400 mb-6">Choose specific topics or practice all cards</p>

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

                                    {/* Topic Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                        {topics.map(topic => {
                                            const count = initialFlashcards.filter(c => c.topicName === topic).length;
                                            const isSelected = selectedTopics.includes(topic);
                                            const topicCardIds = initialFlashcards
                                                .filter(c => c.topicName === topic)
                                                .map(c => c.id);
                                            const topicDue = getDueCards(topicCardIds).length;

                                            return (
                                                <button
                                                    key={topic}
                                                    onClick={() => toggleTopic(topic)}
                                                    className={`p-4 rounded-xl border text-left transition-all ${isSelected
                                                        ? 'bg-purple-500/20 border-purple-500/50 text-white'
                                                        : 'bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">{topic}</span>
                                                        <div className="flex items-center gap-2">
                                                            {topicDue > 0 && (
                                                                <span className="text-xs text-amber-400">{topicDue} due</span>
                                                            )}
                                                            <span className="text-sm text-slate-500">{count} cards</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        {getDueCountForSelection() > 0 && (
                                            <button
                                                onClick={() => startPractice('due')}
                                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                            >
                                                <Clock className="w-5 h-5" />
                                                Review Due Cards ({getDueCountForSelection()})
                                            </button>
                                        )}

                                        <button
                                            onClick={() => startPractice('all')}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                        >
                                            <Shuffle className="w-5 h-5" />
                                            Practice All ({selectedTopics.length > 0
                                                ? initialFlashcards.filter(c => selectedTopics.includes(c.topicName)).length
                                                : initialFlashcards.length} cards)
                                        </button>

                                        <button
                                            onClick={() => setSelectedTopics(topics)}
                                            className="px-4 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all"
                                        >
                                            Select All Topics
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Practice Mode */
                        <div ref={practiceContainerRef} className="max-w-2xl mx-auto">
                            {currentCard ? (
                                <motion.div
                                    key="practice"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                                            <span>Card {currentIndex + 1} of {practiceQueue.length}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-emerald-400">✓ {sessionStats.correct}</span>
                                                <span className="text-amber-400">↻ {sessionStats.needsReview}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                                style={{ width: `${((currentIndex + 1) / practiceQueue.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Flashcard */}
                                    <div
                                        onClick={() => setIsFlipped(!isFlipped)}
                                        className="relative cursor-pointer perspective-1000"
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={isFlipped ? 'back' : 'front'}
                                                initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                                                animate={{ rotateY: 0, opacity: 1 }}
                                                exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`min-h-[300px] p-8 rounded-3xl border flex items-center justify-center text-center ${isFlipped
                                                    ? 'bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500/30'
                                                    : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                                                        {isFlipped ? 'Answer' : 'Question'}
                                                    </p>
                                                    <div className="text-xl sm:text-2xl text-white font-medium leading-relaxed flashcard-content">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkMath]}
                                                            rehypePlugins={[rehypeKatex]}
                                                        >
                                                            {isFlipped ? currentCard.answer : currentCard.question}
                                                        </ReactMarkdown>
                                                    </div>
                                                    {!isFlipped && (
                                                        <p className="mt-6 text-slate-500 text-sm">Click to reveal answer</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Topic Badge */}
                                    <div className="text-center mt-4">
                                        <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-400 text-sm">
                                            {currentCard.topicName}
                                        </span>
                                    </div>

                                    {/* Response Buttons */}
                                    {isFlipped && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8"
                                        >
                                            <p className="text-center text-slate-500 text-sm mb-4">How well did you know this?</p>
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleResponse(1)}
                                                    className="flex flex-col items-center gap-1 px-5 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                    <span className="text-xs">Again</span>
                                                </button>
                                                <button
                                                    onClick={() => handleResponse(3)}
                                                    className="flex flex-col items-center gap-1 px-5 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors"
                                                >
                                                    <RotateCcw className="w-5 h-5" />
                                                    <span className="text-xs">Hard</span>
                                                </button>
                                                <button
                                                    onClick={() => handleResponse(4)}
                                                    className="flex flex-col items-center gap-1 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                                                >
                                                    <Check className="w-5 h-5" />
                                                    <span className="text-xs">Good</span>
                                                </button>
                                                <button
                                                    onClick={() => handleResponse(5)}
                                                    className="flex flex-col items-center gap-1 px-5 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
                                                >
                                                    <Zap className="w-5 h-5" />
                                                    <span className="text-xs">Easy</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Exit Button */}
                                    <div className="text-center mt-8">
                                        <button
                                            onClick={() => setIsPracticeMode(false)}
                                            className="text-slate-500 hover:text-white transition-colors"
                                        >
                                            Exit Practice
                                        </button>
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
                                        <Check className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
                                    <p className="text-slate-400 mb-8">No cards are due for review in {chapterName}.</p>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => startPractice('all')}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <Shuffle className="w-5 h-5" />
                                            Practice All Cards Anyway
                                        </button>
                                        <Link
                                            href="/flashcards"
                                            className="px-6 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                                        >
                                            Choose Different Chapter
                                        </Link>
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
                                    <p className="text-slate-400 mb-8">Your {chapterName} progress has been saved.</p>

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
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Practice Again
                                        </button>
                                        <Link
                                            href="/flashcards"
                                            className="px-6 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                                        >
                                            Choose Different Chapter
                                        </Link>
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
