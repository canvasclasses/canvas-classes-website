'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    BookOpen,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Shuffle,
    Check,
    X,
    Sparkles,
    Brain,
    Zap,
    Clock,
    Trophy,
    Target,
    TrendingUp,
    RefreshCw
} from 'lucide-react';
import { fetchFlashcards, FlashcardItem } from '../lib/revisionData';
import { useCardProgress } from '../hooks/useCardProgress';
import { getMasteryLevel, getMasteryColor, daysUntilReview, QualityRating } from '../lib/spacedRepetition';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ChapterGroup {
    chapterName: string;
    cards: FlashcardItem[];
    topics: string[];
}

type PracticeMode = 'due' | 'all';

export default function FlashcardsClient() {
    const [allFlashcards, setAllFlashcards] = useState<FlashcardItem[]>([]);
    const [chapterGroups, setChapterGroups] = useState<ChapterGroup[]>([]);
    const [loading, setLoading] = useState(true);

    // Practice state
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [practiceQueue, setPracticeQueue] = useState<FlashcardItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceType, setPracticeType] = useState<PracticeMode>('due');

    // Session stats (temporary, for current session display)
    const [sessionStats, setSessionStats] = useState({ correct: 0, needsReview: 0 });

    // Ref for scrolling to flashcard view
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
    } = useCardProgress();

    // Fetch flashcards on mount
    useEffect(() => {
        async function loadFlashcards() {
            try {
                const cards = await fetchFlashcards();
                setAllFlashcards(cards);

                // Group by chapter
                const groups: { [key: string]: ChapterGroup } = {};
                cards.forEach(card => {
                    if (!groups[card.chapterName]) {
                        groups[card.chapterName] = {
                            chapterName: card.chapterName,
                            cards: [],
                            topics: []
                        };
                    }
                    groups[card.chapterName].cards.push(card);
                    if (!groups[card.chapterName].topics.includes(card.topicName)) {
                        groups[card.chapterName].topics.push(card.topicName);
                    }
                });

                setChapterGroups(Object.values(groups));
            } catch (error) {
                console.error('Error loading flashcards:', error);
            } finally {
                setLoading(false);
            }
        }
        loadFlashcards();
    }, []);

    // Get all card IDs
    const allCardIds = useMemo(() => allFlashcards.map(c => c.id), [allFlashcards]);

    // Global statistics
    const globalStats = useMemo(() => {
        if (!progressLoaded || allCardIds.length === 0) return null;
        return getStatistics(allCardIds);
    }, [progressLoaded, allCardIds, getStatistics]);

    // Start practice session
    const startPractice = (mode: PracticeMode) => {
        if (!selectedChapter) return;

        const chapterCards = allFlashcards.filter(c => c.chapterName === selectedChapter);
        let candidates = selectedTopics.length > 0
            ? chapterCards.filter(c => selectedTopics.includes(c.topicName))
            : chapterCards;

        let queue: FlashcardItem[];

        if (mode === 'due') {
            // Get due cards and sort by priority
            const dueCardIds = getDueCards(candidates.map(c => c.id));
            const sortedIds = sortByPriority(dueCardIds);
            queue = sortedIds.map(id => candidates.find(c => c.id === id)!).filter(Boolean);
        } else {
            // All cards, shuffled
            queue = [...candidates].sort(() => Math.random() - 0.5);
        }

        setPracticeType(mode);
        setPracticeQueue(queue);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionStats({ correct: 0, needsReview: 0 });
        setIsPracticeMode(true);

        // Scroll to flashcard view on mobile
        setTimeout(() => {
            practiceContainerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    };

    // Handle card responses with SM-2 quality ratings
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
            // End of deck
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

    const currentCard = practiceQueue[currentIndex];
    const selectedChapterData = chapterGroups.find(g => g.chapterName === selectedChapter);

    // Get chapter-specific stats
    const chapterStats = useMemo(() => {
        if (!selectedChapterData || !progressLoaded) return null;
        const chapterCardIds = selectedChapterData.cards.map(c => c.id);
        return getStatistics(chapterCardIds);
    }, [selectedChapterData, progressLoaded, getStatistics]);

    // Get due count for topic selection
    const getDueCountForSelection = () => {
        if (!selectedChapterData) return 0;
        const candidates = selectedTopics.length > 0
            ? selectedChapterData.cards.filter(c => selectedTopics.includes(c.topicName))
            : selectedChapterData.cards;
        return getDueCards(candidates.map(c => c.id)).length;
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

            {/* Hero Section */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-6">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 font-semibold text-sm">Active Recall & Spaced Repetition</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Chemistry{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Flashcards
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                            Master chemistry concepts with spaced repetition. The algorithm remembers what you know and shows you what you need to review.
                        </p>

                        {/* Global Stats */}
                        {globalStats && progressLoaded && (
                            <div className="flex flex-wrap justify-center gap-3 mb-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Layers className="w-4 h-4 text-purple-400" />
                                    <span className="text-white font-medium">{allFlashcards.length} Cards</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <BookOpen className="w-4 h-4 text-blue-400" />
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
                    {loading || !progressLoaded ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        </div>
                    ) : !isPracticeMode ? (
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
                                            const chapterCardIds = group.cards.map(c => c.id);
                                            const stats = getStatistics(chapterCardIds);
                                            const dueCount = stats.dueToday;

                                            return (
                                                <motion.button
                                                    key={group.chapterName}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    onClick={() => {
                                                        setSelectedChapter(group.chapterName);
                                                        setSelectedTopics([]);
                                                    }}
                                                    className="group p-5 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-purple-500/30 rounded-2xl text-left transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                            <Layers className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {dueCount > 0 && (
                                                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                                                    {dueCount} due
                                                                </span>
                                                            )}
                                                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-white font-semibold mb-1">{group.chapterName}</h3>
                                                    <p className="text-slate-500 text-sm mb-3">{group.cards.length} cards • {group.topics.length} topics</p>

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
                                /* Topic Selection */
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
                                        <p className="text-slate-400 mb-6">Select topics to practice or start with all cards</p>

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

                                        {selectedChapterData && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                    {selectedChapterData.topics.map(topic => {
                                                        const count = selectedChapterData.cards.filter(c => c.topicName === topic).length;
                                                        const isSelected = selectedTopics.includes(topic);
                                                        const topicCardIds = selectedChapterData.cards
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

                                                <div className="flex flex-wrap gap-3">
                                                    {/* Due Cards Button */}
                                                    {getDueCountForSelection() > 0 && (
                                                        <button
                                                            onClick={() => startPractice('due')}
                                                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                                        >
                                                            <Clock className="w-5 h-5" />
                                                            Review Due Cards ({getDueCountForSelection()})
                                                        </button>
                                                    )}

                                                    {/* All Cards Button */}
                                                    <button
                                                        onClick={() => startPractice('all')}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                                    >
                                                        <Shuffle className="w-5 h-5" />
                                                        Practice All ({selectedTopics.length > 0
                                                            ? selectedChapterData.cards.filter(c => selectedTopics.includes(c.topicName)).length
                                                            : selectedChapterData.cards.length} cards)
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedTopics(selectedChapterData.topics);
                                                        }}
                                                        className="px-4 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all"
                                                    >
                                                        Select All Topics
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
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

                                    {/* Action Buttons - Spaced Repetition */}
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
                                    <p className="text-slate-400 mb-8">No cards are due for review right now. Great job staying on top of your studies!</p>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => startPractice('all')}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <Shuffle className="w-5 h-5" />
                                            Practice All Cards Anyway
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
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
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
