'use client';

import { useState, useEffect } from 'react';
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
    Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchFlashcards, FlashcardItem } from '../lib/revisionData';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ChapterGroup {
    chapterName: string;
    cards: FlashcardItem[];
    topics: string[];
}

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
    const [knownCount, setKnownCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

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

    // Start practice session
    const startPractice = () => {
        if (!selectedChapter) return;

        const chapterCards = allFlashcards.filter(c => c.chapterName === selectedChapter);
        let queue = selectedTopics.length > 0
            ? chapterCards.filter(c => selectedTopics.includes(c.topicName))
            : chapterCards;

        // Shuffle
        queue = [...queue].sort(() => Math.random() - 0.5);

        setPracticeQueue(queue);
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCount(0);
        setReviewCount(0);
        setIsPracticeMode(true);
    };

    // Handle card actions
    const handleKnown = () => {
        setKnownCount(prev => prev + 1);
        nextCard();
    };

    const handleReview = () => {
        setReviewCount(prev => prev + 1);
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

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <Navbar />

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
                            Master chemistry concepts with interactive flashcards. Click to reveal answers and track your progress.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                <Layers className="w-4 h-4 text-purple-400" />
                                <span className="text-white font-medium">{allFlashcards.length} Cards</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                <BookOpen className="w-4 h-4 text-blue-400" />
                                <span className="text-white font-medium">{chapterGroups.length} Chapters</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
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
                                        {chapterGroups.map((group, idx) => (
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
                                                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                                                </div>
                                                <h3 className="text-white font-semibold mb-1">{group.chapterName}</h3>
                                                <p className="text-slate-500 text-sm">{group.cards.length} cards • {group.topics.length} topics</p>
                                            </motion.button>
                                        ))}
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

                                        {selectedChapterData && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                    {selectedChapterData.topics.map(topic => {
                                                        const count = selectedChapterData.cards.filter(c => c.topicName === topic).length;
                                                        const isSelected = selectedTopics.includes(topic);
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
                                                                    <span className="text-sm text-slate-500">{count} cards</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        onClick={startPractice}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                                                    >
                                                        <Zap className="w-5 h-5" />
                                                        Start Practice ({selectedTopics.length > 0
                                                            ? selectedChapterData.cards.filter(c => selectedTopics.includes(c.topicName)).length
                                                            : selectedChapterData.cards.length} cards)
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTopics(selectedChapterData.topics);
                                                        }}
                                                        className="px-4 py-3 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all"
                                                    >
                                                        Select All
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
                        <div className="max-w-2xl mx-auto">
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
                                                <span className="text-emerald-400">✓ {knownCount}</span>
                                                <span className="text-amber-400">↻ {reviewCount}</span>
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

                                    {/* Action Buttons */}
                                    {isFlipped && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-center gap-4 mt-8"
                                        >
                                            <button
                                                onClick={handleReview}
                                                className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                                Need Review
                                            </button>
                                            <button
                                                onClick={handleKnown}
                                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                                            >
                                                <Check className="w-5 h-5" />
                                                Got It!
                                            </button>
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
                                    <p className="text-slate-400 mb-8">Great job practicing your flashcards.</p>

                                    <div className="flex justify-center gap-6 mb-8">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-emerald-400">{knownCount}</p>
                                            <p className="text-slate-500 text-sm">Known</p>
                                        </div>
                                        <div className="w-px bg-slate-700" />
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-amber-400">{reviewCount}</p>
                                            <p className="text-slate-500 text-sm">Need Review</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={startPractice}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl"
                                        >
                                            <Shuffle className="w-5 h-5" />
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

            <Footer />
        </main>
    );
}
