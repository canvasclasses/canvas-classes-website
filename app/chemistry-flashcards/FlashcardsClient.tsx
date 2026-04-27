'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { FlashcardItem, ChapterSummary, ChapterTopic } from '../lib/flashcardsData';
import { useCardProgress } from '../hooks/useCardProgress';
import { useFlashcardMeta } from '../hooks/useFlashcardMeta';
import { QualityRating } from '../lib/spacedRepetition';
import ReactMarkdown from 'react-markdown';
import { flashcardMarkdownComponents } from '@/app/lib/flashcardMarkdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ChapterGroup {
    chapterName: string;
    slug: string;
    category: string;
    cardIds: string[];
    topics: ChapterTopic[];
    cardCount: number;
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
    chapterSummaries: ChapterSummary[];
}

export default function FlashcardsClient({ chapterSummaries }: FlashcardsClientProps) {
    // Chapter groups derived from server-provided summaries (lightweight: IDs only, no card content).
    const chapterGroups: ChapterGroup[] = useMemo(
        () =>
            chapterSummaries.map((s) => {
                const cardIds = s.topics.flatMap((t) => t.cardIds);
                return {
                    chapterName: s.name,
                    slug: s.slug,
                    category: s.category,
                    cardIds,
                    topics: s.topics,
                    cardCount: cardIds.length,
                };
            }),
        [chapterSummaries]
    );

    // Cards (question + answer text) lazy-loaded per chapter when user actually
    // wants to practice. Map keyed by chapter slug.
    const [loadedCardsByChapter, setLoadedCardsByChapter] = useState<Map<string, FlashcardItem[]>>(
        new Map()
    );
    const [loadingPractice, setLoadingPractice] = useState(false);

    // Practice state
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [practiceQueue, setPracticeQueue] = useState<FlashcardItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceType, setPracticeType] = useState<PracticeMode>('due');
    const [sessionStats, setSessionStats] = useState({ correct: 0, needsReview: 0 });

    // Chapter grid controls
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortMode>('mostDue');

    const [isGlobalReview, setIsGlobalReview] = useState(false);

    const practiceContainerRef = useRef<HTMLDivElement>(null);

    // Spaced repetition hook (operates on card IDs only — no content needed)
    const {
        isLoaded: progressLoaded,
        updateProgress,
        getDueCards,
        sortByPriority,
        getStatistics,
        getTodaysQueue,
        getAccuracy,
        getLastReviewDate,
        getMaxOverdue,
        hasAnyProgress
    } = useCardProgress();

    const {
        currentStreak,
        recordStudyToday,
        lastChapter,
        setLastChapter
    } = useFlashcardMeta();

    // Idempotent chapter card loader — fetches once, caches, returns cached on subsequent calls.
    const loadChapterCards = useCallback(
        async (slug: string): Promise<FlashcardItem[]> => {
            const cached = loadedCardsByChapter.get(slug);
            if (cached) return cached;

            const res = await fetch(`/api/flashcards/cards/${slug}`);
            if (!res.ok) throw new Error(`Failed to load chapter ${slug}: ${res.status}`);
            const data = (await res.json()) as { cards: FlashcardItem[] };

            setLoadedCardsByChapter((prev) => {
                if (prev.has(slug)) return prev;
                const next = new Map(prev);
                next.set(slug, data.cards);
                return next;
            });

            return data.cards;
        },
        [loadedCardsByChapter]
    );

    // All card IDs across all chapters (no content). Used for global stats.
    const allCardIds = useMemo(
        () => chapterGroups.flatMap((g) => g.cardIds),
        [chapterGroups]
    );

    const globalStats = useMemo(() => {
        if (!progressLoaded || allCardIds.length === 0) return null;
        return getStatistics(allCardIds);
    }, [progressLoaded, allCardIds, getStatistics]);

    const selectedChapterData = chapterGroups.find((g) => g.chapterName === selectedChapter);

    // When user clicks a chapter card, kick off a background fetch immediately
    // so cards are usually ready by the time they pick topics and click Practice.
    const handleSelectChapter = useCallback(
        (chapterName: string) => {
            const group = chapterGroups.find((g) => g.chapterName === chapterName);
            setSelectedChapter(chapterName);
            setSelectedTopics([]);
            if (group) {
                loadChapterCards(group.slug).catch((err) => {
                    console.error('Prefetch failed:', err);
                });
            }
        },
        [chapterGroups, loadChapterCards]
    );

    // Start practice for the currently selected chapter.
    const startPractice = async (mode: PracticeMode) => {
        if (!selectedChapterData) return;

        setLoadingPractice(true);
        try {
            const cards = await loadChapterCards(selectedChapterData.slug);
            const cardById = new Map(cards.map((c) => [c.id, c]));

            const candidateIds =
                selectedTopics.length > 0
                    ? selectedChapterData.topics
                          .filter((t) => selectedTopics.includes(t.name))
                          .flatMap((t) => t.cardIds)
                    : selectedChapterData.cardIds;

            let queue: FlashcardItem[];
            if (mode === 'due') {
                const dueIds = getDueCards(candidateIds);
                const sortedIds = sortByPriority(dueIds);
                queue = sortedIds
                    .map((id) => cardById.get(id))
                    .filter((c): c is FlashcardItem => !!c);
            } else {
                queue = candidateIds
                    .map((id) => cardById.get(id))
                    .filter((c): c is FlashcardItem => !!c)
                    .sort(() => Math.random() - 0.5);
            }

            setLastChapter(selectedChapter);
            setIsGlobalReview(false);
            setPracticeType(mode);
            setPracticeQueue(queue);
            setCurrentIndex(0);
            setIsFlipped(false);
            setSessionStats({ correct: 0, needsReview: 0 });
            setIsPracticeMode(true);

            setTimeout(() => {
                practiceContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } catch (err) {
            console.error('Failed to start practice:', err);
        } finally {
            setLoadingPractice(false);
        }
    };

    // Mixed review across all chapters, capped to the daily target.
    // Only fetches the chapters that actually have cards in today's queue.
    const startGlobalReview = async () => {
        const todayIds = getTodaysQueue(allCardIds);
        if (todayIds.length === 0) return;

        const idToSlug = new Map<string, string>();
        chapterGroups.forEach((g) => {
            g.cardIds.forEach((id) => idToSlug.set(id, g.slug));
        });

        const neededSlugs = [
            ...new Set(
                todayIds
                    .map((id) => idToSlug.get(id))
                    .filter((s): s is string => !!s)
            ),
        ];

        setLoadingPractice(true);
        try {
            const fetched = await Promise.all(neededSlugs.map((slug) => loadChapterCards(slug)));
            const cardById = new Map<string, FlashcardItem>();
            fetched.flat().forEach((c) => cardById.set(c.id, c));

            const queue = todayIds
                .map((id) => cardById.get(id))
                .filter((c): c is FlashcardItem => !!c);

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
        } catch (err) {
            console.error('Failed to start global review:', err);
        } finally {
            setLoadingPractice(false);
        }
    };

    const handleResponse = (quality: QualityRating) => {
        const card = practiceQueue[currentIndex];
        if (card) {
            updateProgress(card.id, quality);
            recordStudyToday();
            if (quality >= 3) {
                setSessionStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
            } else {
                setSessionStats((prev) => ({ ...prev, needsReview: prev.needsReview + 1 }));
            }
        }
        nextCard();
    };

    const nextCard = () => {
        setIsFlipped(false);
        if (currentIndex < practiceQueue.length - 1) {
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
        } else {
            setIsPracticeMode(false);
        }
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const currentCard = practiceQueue[currentIndex];

    const chapterStats = useMemo(() => {
        if (!selectedChapterData || !progressLoaded) return null;
        return getStatistics(selectedChapterData.cardIds);
    }, [selectedChapterData, progressLoaded, getStatistics]);

    const todaysQueueSize = useMemo(() => {
        if (!progressLoaded) return 0;
        return getTodaysQueue(allCardIds).length;
    }, [progressLoaded, allCardIds, getTodaysQueue]);

    const visibleChapterGroups = useMemo(() => {
        if (!progressLoaded) return [];
        const q = searchQuery.trim().toLowerCase();
        const list = chapterGroups.filter(
            (g) =>
                (selectedCategory === 'All' || g.category === selectedCategory) &&
                (q === '' || g.chapterName.toLowerCase().includes(q))
        );

        const sorted = [...list];
        if (sortBy === 'mostDue') {
            sorted.sort((a, b) => {
                const da = getStatistics(a.cardIds).dueToday;
                const db = getStatistics(b.cardIds).dueToday;
                return db - da;
            });
        } else if (sortBy === 'recentlyStudied') {
            sorted.sort((a, b) => {
                const la = getLastReviewDate(a.cardIds) || '';
                const lb = getLastReviewDate(b.cardIds) || '';
                return lb.localeCompare(la);
            });
        } else {
            sorted.sort((a, b) => a.chapterName.localeCompare(b.chapterName));
        }
        return sorted;
    }, [progressLoaded, chapterGroups, selectedCategory, searchQuery, sortBy, getStatistics, getLastReviewDate]);

    const lastChapterGroup = useMemo(() => {
        if (!lastChapter) return null;
        return chapterGroups.find((g) => g.chapterName === lastChapter) || null;
    }, [lastChapter, chapterGroups]);

    const getDueCountForSelection = () => {
        if (!selectedChapterData) return 0;
        const candidateIds =
            selectedTopics.length > 0
                ? selectedChapterData.topics
                      .filter((t) => selectedTopics.includes(t.name))
                      .flatMap((t) => t.cardIds)
                : selectedChapterData.cardIds;
        return getDueCards(candidateIds).length;
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

                        {globalStats && progressLoaded && (
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                                    <span className="text-white font-medium text-xs md:text-sm">{allCardIds.length} Cards</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 rounded-lg border border-white/10">
                                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                                    <span className="text-white font-medium text-xs md:text-sm">{chapterGroups.length} Chapters</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                    <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
                                    <span className="text-amber-400 font-medium text-xs md:text-sm">
                                        Today&apos;s Goal: {todaysQueueSize}
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
                        <div className="max-w-5xl mx-auto">
                            {!selectedChapter ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {progressLoaded && (todaysQueueSize > 0 || lastChapterGroup) && (
                                        <div className="mb-6 md:mb-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
                                            {todaysQueueSize > 0 ? (
                                                <button
                                                    onClick={startGlobalReview}
                                                    disabled={loadingPractice}
                                                    className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg hover:opacity-95 transition-opacity text-left disabled:opacity-60"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-950/15 flex items-center justify-center shrink-0">
                                                            {loadingPractice ? (
                                                                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                                                            ) : (
                                                                <PlayCircle className="w-6 h-6" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-base md:text-lg">
                                                                {loadingPractice ? 'Loading cards…' : "Start Today's Review"}
                                                            </p>
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
                                                    onClick={() => handleSelectChapter(lastChapterGroup.chapterName)}
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

                                    {visibleChapterGroups.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500 text-sm">
                                            No chapters match that search.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {visibleChapterGroups.map((group, idx) => {
                                                const stats = getStatistics(group.cardIds);
                                                const dueCount = stats.dueToday;
                                                const maxOverdue = getMaxOverdue(group.cardIds);
                                                const accuracy = getAccuracy(group.cardIds);
                                                const lastReviewed = getLastReviewDate(group.cardIds);
                                                const hasAnyReview = stats.total !== stats.new;

                                                const catStyles: Record<string, { color: string; iconColor: string; borderHex: string }> = {
                                                    'Physical Chemistry': { color: 'text-emerald-400', iconColor: 'text-emerald-500', borderHex: '#10b981' },
                                                    'JEE PYQ': { color: 'text-amber-400', iconColor: 'text-amber-500', borderHex: '#f59e0b' },
                                                    'Organic Chemistry': { color: 'text-purple-400', iconColor: 'text-purple-500', borderHex: '#a855f7' },
                                                    'Inorganic Chemistry': { color: 'text-blue-400', iconColor: 'text-blue-500', borderHex: '#3b82f6' },
                                                };
                                                const styles = catStyles[group.category] || catStyles['Physical Chemistry'];

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
                                                        onClick={() => handleSelectChapter(group.chapterName)}
                                                        className={`group relative p-4 md:p-5 bg-slate-900/40 hover:bg-slate-900/80 border-y border-r border-white/5 hover:border-white/10 border-l-4 rounded-xl text-left transition-all overflow-hidden`}
                                                        style={{ borderLeftColor: styles.borderHex }}
                                                    >
                                                        <div className="flex flex-col h-full">
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

                                                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
                                                                <Layers className={`w-3.5 h-3.5 ${styles.iconColor} opacity-80`} />
                                                                <span>{group.category.replace(' Chemistry', '')}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                                <span>{group.cardCount} cards</span>
                                                            </div>

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
                                                    {selectedChapterData.topics.map((topic) => {
                                                        const isSelected = selectedTopics.includes(topic.name);
                                                        const topicDue = getDueCards(topic.cardIds).length;

                                                        return (
                                                            <button
                                                                key={topic.name}
                                                                onClick={() => toggleTopic(topic.name)}
                                                                className={`p-4 rounded-xl border text-left transition-all ${isSelected
                                                                    ? 'bg-purple-500/20 border-purple-500/50 text-white'
                                                                    : 'bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/20'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">{topic.name}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        {topicDue > 0 && (
                                                                            <span className="text-xs text-amber-400">{topicDue} due</span>
                                                                        )}
                                                                        <span className="text-sm text-slate-500">{topic.cardIds.length} cards</span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    {getDueCountForSelection() > 0 && (
                                                        <button
                                                            onClick={() => startPractice('due')}
                                                            disabled={loadingPractice}
                                                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                                                        >
                                                            {loadingPractice ? (
                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <Clock className="w-5 h-5" />
                                                            )}
                                                            Review Due Cards ({getDueCountForSelection()})
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => startPractice('all')}
                                                        disabled={loadingPractice}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                                                    >
                                                        {loadingPractice ? (
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <Shuffle className="w-5 h-5" />
                                                        )}
                                                        Practice All ({selectedTopics.length > 0
                                                            ? selectedChapterData.topics
                                                                .filter((t) => selectedTopics.includes(t.name))
                                                                .reduce((sum, t) => sum + t.cardIds.length, 0)
                                                            : selectedChapterData.cardCount} cards)
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedTopics(selectedChapterData.topics.map((t) => t.name));
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
                                                                strong: ({ ...props }) => <span className="text-amber-300 font-bold" {...props} />,
                                                                p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />
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
