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
    ChevronDown,
    Flame,
    Search,
    PlayCircle,
    History,
    ArrowUpDown
} from 'lucide-react';
import { FlashcardItem } from '../lib/flashcardsData';
import { useCardProgress } from '../hooks/useCardProgress';
import { useFlashcardMeta } from '../hooks/useFlashcardMeta';
import { getMasteryLevel, getMasteryColor, daysUntilReview, QualityRating } from '../lib/spacedRepetition';
import ReactMarkdown from 'react-markdown';
import { flashcardMarkdownComponents } from '@/app/lib/flashcardMarkdown';
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
type SortMode = 'mostDue' | 'recentlyStudied' | 'alphabetical';

function formatLastReviewed(isoDate: string | null): string {
    if (!isoDate) return 'Not started';
    const reviewMs = new Date(isoDate).getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - reviewMs) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
}

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

    // Chapter grid controls
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortMode>('mostDue');

    // True when practice session was started from the global "today" CTA rather than a specific chapter
    const [isGlobalReview, setIsGlobalReview] = useState(false);

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
        getTodaysQueue,
        getAccuracy,
        getLastReviewDate,
        getMaxOverdue,
        resetAllProgress,
        hasAnyProgress
    } = useCardProgress();

    const {
        currentStreak,
        longestStreak,
        recordStudyToday,
        lastChapter,
        setLastChapter
    } = useFlashcardMeta();

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

        setLastChapter(selectedChapter);
        setIsGlobalReview(false);
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

    // Start a mixed review across every chapter, capped to the daily target
    const startGlobalReview = () => {
        const todayIds = getTodaysQueue(allFlashcards.map(c => c.id));
        if (todayIds.length === 0) return;
        const cardById = new Map(allFlashcards.map(c => [c.id, c]));
        const queue = todayIds.map(id => cardById.get(id)!).filter(Boolean);

        setIsGlobalReview(true);
        setSelectedChapter(null);
        setSelectedTopics([]);
        setPracticeType('due');
        setPracticeQueue(queue);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionStats({ correct: 0, needsReview: 0 });
        setIsPracticeMode(true);

        setTimeout(() => {
            practiceContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    // Handle card responses with SM-2 quality ratings
    const handleResponse = (quality: QualityRating) => {
        const card = practiceQueue[currentIndex];
        if (card) {
            updateProgress(card.id, quality);
            recordStudyToday();

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

    // Size of today's recommended mixed queue (capped by daily limits)
    const todaysQueueSize = useMemo(() => {
        if (!progressLoaded) return 0;
        return getTodaysQueue(allCardIds).length;
    }, [progressLoaded, allCardIds, getTodaysQueue]);

    // Filter + sort chapters for the grid
    const visibleChapterGroups = useMemo(() => {
        if (!progressLoaded) return [];
        const q = searchQuery.trim().toLowerCase();
        let list = chapterGroups.filter(g =>
            (selectedCategory === 'All' || g.category === selectedCategory)
            && (q === '' || g.chapterName.toLowerCase().includes(q))
        );

        const sorted = [...list];
        if (sortBy === 'mostDue') {
            sorted.sort((a, b) => {
                const da = getStatistics(a.cards.map(c => c.id)).dueToday;
                const db = getStatistics(b.cards.map(c => c.id)).dueToday;
                return db - da;
            });
        } else if (sortBy === 'recentlyStudied') {
            sorted.sort((a, b) => {
                const la = getLastReviewDate(a.cards.map(c => c.id)) || '';
                const lb = getLastReviewDate(b.cards.map(c => c.id)) || '';
                return lb.localeCompare(la);
            });
        } else {
            sorted.sort((a, b) => a.chapterName.localeCompare(b.chapterName));
        }
        return sorted;
    }, [progressLoaded, chapterGroups, selectedCategory, searchQuery, sortBy, getStatistics, getLastReviewDate]);

    const lastChapterGroup = useMemo(() => {
        if (!lastChapter) return null;
        return chapterGroups.find(g => g.chapterName === lastChapter) || null;
    }, [lastChapter, chapterGroups]);

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
            <section className="relative pt-20 pb-6 md:pt-24 md:pb-8 overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4 md:mb-6">
                            <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                            <span className="text-purple-400 font-semibold text-xs md:text-sm">Active Recall & Spaced Repetition</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Chemistry{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Flashcards
                            </span>
                        </h1>

                        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                            Master chemistry concepts with spaced repetition. The algorithm remembers what you know and shows you what you need to review.
                        </p>

                        {/* Global Stats */}
                        {globalStats && progressLoaded && (
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                                    <span className="text-white font-medium text-xs md:text-sm">{allFlashcards.length} Cards</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 rounded-lg border border-white/10">
                                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                                    <span className="text-white font-medium text-xs md:text-sm">{chapterGroups.length} Chapters</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                    <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
                                    <span className="text-amber-400 font-medium text-xs md:text-sm">
                                        Today's Goal: {todaysQueueSize}
                                    </span>
                                </div>
                                {currentStreak > 0 && (
                                    <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                        <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
                                        <span className="text-orange-400 font-medium text-xs md:text-sm">
                                            {currentStreak} day streak
                                        </span>
                                    </div>
                                )}
                                {hasAnyProgress() && (
                                    <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                                        <span className="text-emerald-400 font-medium text-xs md:text-sm">{globalStats.mastered} Mastered</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-6 md:py-12">
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
                                    {/* Primary CTA row: today's mixed review + continue where you left off */}
                                    {progressLoaded && (todaysQueueSize > 0 || lastChapterGroup) && (
                                        <div className="mb-6 md:mb-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
                                            {todaysQueueSize > 0 ? (
                                                <button
                                                    onClick={startGlobalReview}
                                                    className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg hover:opacity-95 transition-opacity text-left"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-950/15 flex items-center justify-center shrink-0">
                                                            <PlayCircle className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-base md:text-lg">Start Today's Review</p>
                                                            <p className="text-sm font-medium text-slate-950/80">
                                                                {todaysQueueSize} card{todaysQueueSize === 1 ? '' : 's'} across all chapters · mixed for best recall
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                                        <Check className="w-6 h-6 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">All caught up for today</p>
                                                        <p className="text-sm text-emerald-300/80">Pick a chapter below to practice ahead.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {lastChapterGroup && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedChapter(lastChapterGroup.chapterName);
                                                        setSelectedTopics([]);
                                                    }}
                                                    className="group flex items-center gap-3 p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 hover:bg-slate-900 text-left transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                                        <History className="w-5 h-5 text-slate-300" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs uppercase tracking-wider text-slate-500">Continue</p>
                                                        <p className="text-white font-semibold truncate">{lastChapterGroup.chapterName}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-bold text-white">Or pick a chapter</h2>
                                    </div>

                                    {/* Category Tabs */}
                                    <div className="flex flex-col gap-3 mb-8">
                                        {/* Row 1: All and JEE PYQ */}
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'All', label: 'All Chapters', icon: Layers, color: 'from-purple-500 to-pink-500' },
                                                { id: 'JEE PYQ', label: 'JEE PYQ', icon: Target, color: 'from-amber-400 to-orange-500' },
                                            ].map((cat) => {
                                                const count = cat.id === 'All'
                                                    ? chapterGroups.length
                                                    : chapterGroups.filter(g => g.category === cat.id).length;
                                                const isActive = selectedCategory === cat.id;

                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setSelectedCategory(cat.id)}
                                                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${isActive
                                                            ? `bg-gradient-to-r ${cat.color} ${cat.id === 'JEE PYQ' ? 'text-slate-950/90' : 'text-white'} shadow-lg`
                                                            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
                                                            }`}
                                                    >
                                                        <cat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        <span>{cat.label}</span>
                                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] md:text-xs ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                                                            {count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Row 2: Subject Sections */}
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'Physical Chemistry', label: 'Physical', icon: FlaskConical, color: 'from-green-500 to-emerald-500' },
                                                { id: 'Organic Chemistry', label: 'Organic', icon: Beaker, color: 'from-purple-500 to-pink-500' },
                                                { id: 'Inorganic Chemistry', label: 'Inorganic', icon: Atom, color: 'from-blue-500 to-cyan-500' },
                                            ].map((cat) => {
                                                const count = chapterGroups.filter(g => g.category === cat.id).length;
                                                const isActive = selectedCategory === cat.id;

                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setSelectedCategory(cat.id)}
                                                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${isActive
                                                            ? `bg-gradient-to-r ${cat.color} ${cat.id === 'Physical Chemistry' ? 'text-slate-950/90' : 'text-white'} shadow-lg`
                                                            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
                                                            }`}
                                                    >
                                                        <span className="truncate">{cat.label}</span>
                                                        <span className={`px-1 py-0.5 rounded-full text-[9px] md:text-xs ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                                                            {count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Search + Sort controls */}
                                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                        <div className="relative flex-1">
                                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search chapters…"
                                                className="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-xl px-2 py-1.5">
                                            <ArrowUpDown className="w-4 h-4 text-slate-500 ml-1" />
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as SortMode)}
                                                className="bg-transparent text-sm text-white focus:outline-none pr-2"
                                            >
                                                <option className="bg-slate-900" value="mostDue">Most due</option>
                                                <option className="bg-slate-900" value="recentlyStudied">Recently studied</option>
                                                <option className="bg-slate-900" value="alphabetical">A–Z</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Filtered Chapters Grid */}
                                    {visibleChapterGroups.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500 text-sm">
                                            No chapters match that search.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {visibleChapterGroups.map((group, idx) => {
                                                const chapterCardIds = group.cards.map(c => c.id);
                                                const stats = getStatistics(chapterCardIds);
                                                const dueCount = stats.dueToday;
                                                const maxOverdue = getMaxOverdue(chapterCardIds);
                                                const accuracy = getAccuracy(chapterCardIds);
                                                const lastReviewed = getLastReviewDate(chapterCardIds);
                                                const hasAnyReview = stats.total !== stats.new;

                                                // Category styling (left-border accent)
                                                const catStyles: Record<string, { color: string; iconColor: string; borderHex: string }> = {
                                                    'Physical Chemistry': { color: 'text-emerald-400', iconColor: 'text-emerald-500', borderHex: '#10b981' },
                                                    'JEE PYQ': { color: 'text-amber-400', iconColor: 'text-amber-500', borderHex: '#f59e0b' },
                                                    'Organic Chemistry': { color: 'text-purple-400', iconColor: 'text-purple-500', borderHex: '#a855f7' },
                                                    'Inorganic Chemistry': { color: 'text-blue-400', iconColor: 'text-blue-500', borderHex: '#3b82f6' },
                                                };
                                                const styles = catStyles[group.category] || catStyles['Physical Chemistry'];

                                                // Urgency pill — drives colour off how overdue the most overdue card is
                                                let pillLabel: string | null = null;
                                                let pillClass = '';
                                                if (dueCount === 0) {
                                                    pillLabel = null;
                                                } else if (!hasAnyReview) {
                                                    pillLabel = `${dueCount} new`;
                                                    pillClass = 'text-slate-300 bg-slate-500/10 border-slate-500/20';
                                                } else if (maxOverdue > 3) {
                                                    pillLabel = `${dueCount} due`;
                                                    pillClass = 'text-red-400 bg-red-500/10 border-red-500/20';
                                                } else {
                                                    pillLabel = `${dueCount} due`;
                                                    pillClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                                                }

                                                return (
                                                    <motion.button
                                                        key={group.chapterName}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.02 }}
                                                        onClick={() => {
                                                            setSelectedChapter(group.chapterName);
                                                            setSelectedTopics([]);
                                                        }}
                                                        className={`group relative p-4 md:p-5 bg-slate-900/40 hover:bg-slate-900/80 border-y border-r border-white/5 hover:border-white/10 border-l-4 rounded-xl text-left transition-all overflow-hidden`}
                                                        style={{ borderLeftColor: styles.borderHex }}
                                                    >
                                                        <div className="flex flex-col h-full">
                                                            {/* Header: Title & urgency pill */}
                                                            <div className="flex items-start justify-between mb-3 gap-4">
                                                                <h3 className="text-lg font-bold text-white group-hover:text-white/90 leading-tight">
                                                                    {group.chapterName}
                                                                </h3>
                                                                {pillLabel && (
                                                                    <span className={`shrink-0 px-2 py-0.5 ${pillClass} rounded text-xs font-medium border`}>
                                                                        {pillLabel}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Meta row 1: category + total cards */}
                                                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
                                                                <Layers className={`w-3.5 h-3.5 ${styles.iconColor} opacity-80`} />
                                                                <span>{group.category.replace(' Chemistry', '')}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                                <span>{group.cards.length} cards</span>
                                                            </div>

                                                            {/* Meta row 2: last reviewed + accuracy (when applicable) */}
                                                            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 mt-auto">
                                                                <span className="flex items-center gap-1.5">
                                                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                                    {formatLastReviewed(lastReviewed)}
                                                                </span>
                                                                {accuracy !== null && (
                                                                    <>
                                                                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                                        <span className="flex items-center gap-1.5">
                                                                            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                                                                            {Math.round(accuracy * 100)}% correct
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Progress Bar */}
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
                                    )}
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
                                                                ...flashcardMarkdownComponents,
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

                                    {/* Topic / Chapter Badge */}
                                    <div className="text-center mt-4 flex items-center justify-center gap-2 flex-wrap">
                                        {isGlobalReview && (
                                            <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/20 rounded-full text-purple-300 text-sm">
                                                {currentCard.chapterName}
                                            </span>
                                        )}
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
                                            onClick={() => {
                                                setIsPracticeMode(false);
                                                setIsGlobalReview(false);
                                            }}
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
                                        {!isGlobalReview && (
                                            <button
                                                onClick={() => startPractice('all')}
                                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
                                            >
                                                <Shuffle className="w-5 h-5" />
                                                Practice All Cards Anyway
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsPracticeMode(false);
                                                setIsGlobalReview(false);
                                                setSelectedChapter(null);
                                            }}
                                            className="px-6 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                                        >
                                            Back to dashboard
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

                                    {currentStreak > 0 && (
                                        <div className="flex items-center justify-center gap-2 mb-6 text-orange-400">
                                            <Flame className="w-4 h-4" />
                                            <span className="text-sm font-semibold">{currentStreak} day streak — keep it going!</span>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => {
                                                if (isGlobalReview) {
                                                    startGlobalReview();
                                                } else {
                                                    startPractice(practiceType);
                                                }
                                            }}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Practice Again
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsPracticeMode(false);
                                                setIsGlobalReview(false);
                                                setSelectedChapter(null);
                                            }}
                                            className="px-6 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                                        >
                                            Back to dashboard
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
