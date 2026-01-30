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
    RefreshCw,
    Beaker,
    Atom,
    FlaskConical,
    ChevronDown
} from 'lucide-react';
import { FlashcardItem } from '../lib/revisionData';
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
    category: string;
}

type PracticeMode = 'due' | 'all';

interface FlashcardsClientProps {
    initialFlashcards: FlashcardItem[];
}

// Data is now fetched on the server and passed as props for SEO
export default function FlashcardsClient({ initialFlashcards }: FlashcardsClientProps) {
    const [allFlashcards] = useState<FlashcardItem[]>(initialFlashcards);
    const [chapterGroups, setChapterGroups] = useState<ChapterGroup[]>([]);

    // Practice state
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
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

    // Group flashcards by chapter on initial load
    useEffect(() => {
        const groups: { [key: string]: ChapterGroup } = {};
        initialFlashcards.forEach(card => {
            if (!groups[card.chapterName]) {
                groups[card.chapterName] = {
                    chapterName: card.chapterName,
                    cards: [],
                    topics: [],
                    category: card.category || 'Physical Chemistry'
                };
            }
            groups[card.chapterName].cards.push(card);
            if (!groups[card.chapterName].topics.includes(card.topicName)) {
                groups[card.chapterName].topics.push(card.topicName);
            }
        });
        setChapterGroups(Object.values(groups));
    }, [initialFlashcards]);

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
            <section className="relative pt-48 pb-12 overflow-hidden">
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
                    {!progressLoaded ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        </div>
                    ) : !isPracticeMode ? (
                        /* Chapter Selection View */
                        <div className="max-w-5xl mx-auto">
                            {!selectedChapter ? (
                                /* Chapter Grid with Category Tabs */
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">Select a Chapter</h2>

                                    {/* Category Tabs */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {[
                                            { id: 'All', label: 'All Chapters', icon: Layers, color: 'from-purple-500 to-pink-500' },
                                            { id: 'JEE PYQ', label: 'JEE PYQ', icon: Target, color: 'from-amber-400 to-orange-500' },
                                            { id: 'Physical Chemistry', label: 'Physical', icon: FlaskConical, color: 'from-green-500 to-emerald-500' },
                                            { id: 'Organic Chemistry', label: 'Organic', icon: Beaker, color: 'from-purple-500 to-pink-500' },
                                            { id: 'Inorganic Chemistry', label: 'Inorganic', icon: Atom, color: 'from-blue-500 to-cyan-500' },
                                        ].map((cat) => {
                                            const count = cat.id === 'All'
                                                ? chapterGroups.length
                                                : chapterGroups.filter(g => g.category === cat.id).length;
                                            const isActive = selectedCategory === cat.id;

                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive
                                                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
                                                        }`}
                                                >
                                                    <cat.icon className="w-4 h-4" />
                                                    {cat.label}
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-slate-700'
                                                        }`}>
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Filtered Chapters Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {chapterGroups
                                            .filter(group => selectedCategory === 'All' || group.category === selectedCategory)
                                            .map((group, idx) => {
                                                const chapterCardIds = group.cards.map(c => c.id);
                                                const stats = getStatistics(chapterCardIds);
                                                const dueCount = stats.dueToday;

                                                // Get category styling
                                                const catStyles: Record<string, { color: string; iconColor: string; borderHex: string }> = {
                                                    'Physical Chemistry': { color: 'text-emerald-400', iconColor: 'text-emerald-500', borderHex: '#10b981' },
                                                    'JEE PYQ': { color: 'text-amber-400', iconColor: 'text-amber-500', borderHex: '#f59e0b' },
                                                    'Organic Chemistry': { color: 'text-purple-400', iconColor: 'text-purple-500', borderHex: '#a855f7' },
                                                    'Inorganic Chemistry': { color: 'text-blue-400', iconColor: 'text-blue-500', borderHex: '#3b82f6' },
                                                };
                                                // Default style
                                                const styles = catStyles[group.category] || catStyles['Physical Chemistry'];

                                                return (
                                                    <motion.button
                                                        key={group.chapterName}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                        onClick={() => {
                                                            setSelectedChapter(group.chapterName);
                                                            setSelectedTopics([]);
                                                        }}
                                                        className={`group relative p-5 bg-slate-900/40 hover:bg-slate-900/80 border-y border-r border-white/5 hover:border-white/10 border-l-4 rounded-xl text-left transition-all overflow-hidden`}
                                                        style={{ borderLeftColor: styles.borderHex }}
                                                    >
                                                        <div className="flex flex-col h-full">
                                                            {/* Header Level: Title & Due Badge */}
                                                            <div className="flex items-start justify-between mb-3 gap-4">
                                                                <h3 className="text-lg font-bold text-white group-hover:text-white/90 leading-tight">
                                                                    {group.chapterName}
                                                                </h3>
                                                                {dueCount > 0 && (
                                                                    <span className={`shrink-0 px-2 py-0.5 ${styles.color} bg-white/5 rounded text-xs font-medium border border-white/5`}>
                                                                        {dueCount} due
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Meta Level: Icon, Category name, Card count */}
                                                            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4 mt-auto">
                                                                <Layers className={`w-4 h-4 ${styles.iconColor} opacity-80`} />
                                                                <span>{group.category.replace(' Chemistry', '')}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                                <span>{group.cards.length} cards</span>
                                                            </div>

                                                            {/* Progress Bar (Neat & Thin) */}
                                                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden w-full flex">
                                                                {stats.mastered > 0 && (
                                                                    <div className="h-full bg-emerald-500/60" style={{ width: `${(stats.mastered / stats.total) * 100}%` }} />
                                                                )}
                                                                {stats.reviewing > 0 && (
                                                                    <div className="h-full bg-blue-500/60" style={{ width: `${(stats.reviewing / stats.total) * 100}%` }} />
                                                                )}
                                                                {stats.learning > 0 && (
                                                                    <div className="h-full bg-amber-500/60" style={{ width: `${(stats.learning / stats.total) * 100}%` }} />
                                                                )}
                                                            </div>
                                                        </div>
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
                                                            components={{
                                                                strong: ({ node, ...props }) => <span className="text-amber-300 font-bold" {...props} />,
                                                                p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />
                                                            }}
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

            {/* FAQ Section for SEO */}
            <section className="py-16 border-t border-white/5">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-white text-center mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
                            Everything you need to know about Chemistry Flashcards
                        </p>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "What are Chemistry Flashcards?",
                                    a: "Chemistry flashcards are digital study cards that present questions on one side and answers on the other. Our flashcards cover all Class 12 NCERT Chemistry topics including Physical, Organic, and Inorganic Chemistry, designed specifically for JEE, NEET, and CBSE board exam preparation."
                                },
                                {
                                    q: "How does spaced repetition help in learning?",
                                    a: "Spaced repetition is a scientifically-proven learning technique that shows you cards at increasing intervals based on how well you remember them. Cards you find difficult appear more frequently, while mastered cards appear less often. This optimizes your study time and improves long-term retention by up to 200%."
                                },
                                {
                                    q: "Which chemistry chapters are covered?",
                                    a: "Our flashcards cover all 16 chapters of Class 12 NCERT Chemistry including Solutions, Electrochemistry, Chemical Kinetics, Surface Chemistry, Coordination Compounds, Haloalkanes, Alcohols, Aldehydes & Ketones, Amines, Biomolecules, Polymers, and more."
                                },
                                {
                                    q: "Are these flashcards aligned with NCERT?",
                                    a: "Yes! All our flashcards are based on NCERT textbooks and cover the exact topics, definitions, reactions, and concepts mentioned in the NCERT curriculum. They're perfect for CBSE board exams, JEE Main, JEE Advanced, and NEET preparation."
                                },
                                {
                                    q: "How do I track my progress?",
                                    a: "Your progress is automatically saved in your browser. You can see mastery levels for each chapter - from 'New' to 'Mastered'. The system tracks which cards are due for review and shows you statistics like total cards reviewed, cards mastered, and cards that need more practice."
                                },
                                {
                                    q: "Can I practice specific topics within a chapter?",
                                    a: "Absolutely! After selecting a chapter, you can choose specific topics to practice. You can also filter between 'Due Cards' (cards that need review based on spaced repetition) or 'All Cards' for comprehensive practice."
                                }
                            ].map((faq, idx) => (
                                <details
                                    key={idx}
                                    className="group bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                        <span className="text-white font-medium pr-4">{faq.q}</span>
                                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                    </summary>
                                    <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
