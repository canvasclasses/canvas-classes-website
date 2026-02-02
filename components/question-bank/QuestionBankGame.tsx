'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Flame, Target, Play, Pause, ArrowRight, Menu, X, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/app/the-crucible/types';
import QuestionCard from '@/components/question-bank/QuestionCard';
import FeedbackOverlay from '@/components/question-bank/FeedbackOverlay';
import SolutionViewer from '@/components/question-bank/SolutionViewer';
import { useCrucibleProgress } from '@/hooks/useCrucibleProgress';

interface QuestionBankGameProps {
    initialQuestions: Question[];
}

export default function QuestionBankGame({ initialQuestions }: QuestionBankGameProps) {
    const [mode, setMode] = useState<'menu' | 'playing' | 'completed'>('menu');
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);

    // Stats
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);

    // Arena Config State
    const [selectedChapter, setSelectedChapter] = useState('All Chapters');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Any Difficulty');
    const [questionLimit, setQuestionLimit] = useState('10');

    // Timer State (must be at top level for hooks rules)
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(true);

    // Question Status Tracking (for Navigator colors AND progress calculation)
    const [questionStatus, setQuestionStatus] = useState<Record<number, 'solved' | 'incorrect' | 'skipped' | 'marked' | null>>({});

    // Progress Tracking Hook (persisted in localStorage)
    const {
        progress,
        isLoaded: progressLoaded,
        recordAttempt,
        initializeChapterTotals,
        getChapterStats,
        overallAccuracy,
    } = useCrucibleProgress();

    const chapters = Array.from(new Set(initialQuestions.map(q => q.chapterId).filter(Boolean)));

    // Initialize chapter totals once questions are loaded
    useEffect(() => {
        if (initialQuestions.length > 0 && progressLoaded) {
            initializeChapterTotals(initialQuestions);
        }
    }, [initialQuestions, progressLoaded, initializeChapterTotals]);

    // Get tags for selected chapter
    const availableTags = Array.from(new Set(
        initialQuestions
            .filter(q => selectedChapter === 'All Chapters' || q.chapterId === selectedChapter)
            .map(q => q.tagId)
            .filter(Boolean)
    ));

    // Reset tags when chapter changes
    useEffect(() => {
        setSelectedTags([]);
    }, [selectedChapter]);

    // Cleanup global footer on this page
    useEffect(() => {
        const footer = document.querySelector('footer');
        if (footer) {
            const originalDisplay = footer.style.display;
            footer.style.display = 'none';
            return () => {
                footer.style.display = originalDisplay;
            };
        }
    }, []);

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (mode === 'playing' && timerActive) {
            interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [mode, timerActive]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    const activeQuestion = filteredQuestions[currentIndex];
    const isLastQuestion = currentIndex === filteredQuestions.length - 1;

    // Calculate ACTUAL progress based on attempted/skipped questions
    const attemptedCount = Object.values(questionStatus).filter(s => s === 'solved' || s === 'incorrect' || s === 'skipped').length;
    const progressPercentage = filteredQuestions.length > 0 ? (attemptedCount / filteredQuestions.length) * 100 : 0;

    const handleAnswerSubmit = (correct: boolean, optionId: string) => {
        setSelectedOptionId(optionId);
        setIsCorrect(correct);
        setQuestionStatus(prev => ({ ...prev, [currentIndex]: correct ? 'solved' : 'incorrect' }));

        // Record attempt in persistent progress
        const currentQuestion = filteredQuestions[currentIndex];
        if (currentQuestion) {
            recordAttempt(
                currentQuestion.id,
                currentQuestion.chapterId || 'Unknown',
                currentQuestion.difficulty,
                correct
            );
        }

        if (correct) {
            setStreak(prev => prev + 1);
            setScore(prev => prev + 10 + (streak * 2));
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentIndex(prev => prev + 1);
            resetState();
        } else {
            // Session Complete!
            setMode('completed');
        }
    };

    const handleFinish = () => {
        setMode('completed');
    };

    const handleSubmitTest = () => {
        setMode('completed');
    };

    const resetState = () => {
        setSelectedOptionId(null);
        setIsCorrect(null);
        setShowSolution(false);
    };

    const resetSession = () => {
        setMode('menu');
        setCurrentIndex(0);
        setQuestionStatus({});
        setTimerSeconds(0);
        setStreak(0);
        setScore(0);
        resetState();
    };

    // Filter Logic for Preview (includes tag filter)
    const previewQuestions = initialQuestions.filter(q => {
        if (filteredQuestions.length > 0 && mode === 'playing') return true;

        const chapterMatch = selectedChapter === 'All Chapters' || q.chapterId === selectedChapter;
        const tagMatch = selectedTags.length === 0 || (q.tagId && selectedTags.includes(q.tagId));
        const diffMatch = selectedDifficulty === 'Any Difficulty' ||
            (selectedDifficulty === 'NEET' ? (q.difficulty !== 'Mains' && q.difficulty !== 'Advanced') : q.difficulty === selectedDifficulty);

        return chapterMatch && tagMatch && diffMatch;
    });

    const totalPreview = previewQuestions.length;
    const questionsToPlay = previewQuestions.slice(0, questionLimit === 'Max' ? undefined : Number(questionLimit));
    const mainsCount = questionsToPlay.filter(q => q.difficulty === 'Mains').length;
    const advCount = questionsToPlay.filter(q => q.difficulty === 'Advanced').length;
    const neetCount = questionsToPlay.length - mainsCount - advCount;
    const estTime = questionsToPlay.length * 2; // Approx 2 mins per question

    const startPractice = () => {
        if (totalPreview === 0) {
            alert("No questions match your current filters.");
            return;
        }

        setFilteredQuestions(questionsToPlay);
        setMode('playing');
        setCurrentIndex(0);
        setQuestionStatus({});
        setTimerSeconds(0);
        resetState();
    };

    // === COMPLETED MODE ===
    if (mode === 'completed') {
        const solvedCount = Object.values(questionStatus).filter(s => s === 'solved').length;
        const incorrectCount = Object.values(questionStatus).filter(s => s === 'incorrect').length;
        const skippedCount = Object.values(questionStatus).filter(s => s === 'skipped').length;
        const accuracy = (solvedCount + incorrectCount) > 0 ? Math.round((solvedCount / (solvedCount + incorrectCount)) * 100) : 0;

        return (
            <div className="min-h-screen bg-[#0F172A] text-gray-100 flex items-center justify-center p-4">
                <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Session Complete!</h2>
                    <p className="text-gray-400 mb-8">Great effort! Here&apos;s your performance summary.</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="text-2xl font-black text-emerald-400">{solvedCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Correct</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="text-2xl font-black text-red-400">{incorrectCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Incorrect</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="text-2xl font-black text-gray-400">{skippedCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Skipped</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-xl p-6 mb-8">
                        <div className="text-5xl font-black text-white mb-2">{accuracy}%</div>
                        <div className="text-sm text-gray-400">Accuracy</div>
                        <div className="text-xs text-gray-500 mt-2">Time: {formatTime(timerSeconds)} | Score: {score}</div>
                    </div>

                    <button
                        onClick={resetSession}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-lg transition-all"
                    >
                        Practice Again
                    </button>
                </div>
            </div>
        );
    }

    // === MENU MODE ===
    if (mode === 'menu') {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-[#0F172A] text-gray-100 font-sans overflow-hidden">
                {/* Left Sidebar - Command Center */}
                <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-[#1E293B] flex flex-col z-20 shadow-2xl">
                    <div className="p-6 md:p-8 border-b border-white/5">
                        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-4 md:mb-6 text-xs uppercase tracking-widest font-bold">
                            <ArrowLeft size={14} /> Back to Hub
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            The Crucible
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">Forge your concepts in fire.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                        {/* 1. Chapter Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Target Chapter
                            </label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-gray-200"
                            >
                                <option>All Chapters</option>
                                {chapters.map(ch => <option key={ch}>{ch}</option>)}
                            </select>
                        </div>

                        {/* 2. Sub-Topic (Tag) Selection */}
                        {selectedChapter !== 'All Chapters' && availableTags.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                                    Sub-Topic
                                </label>
                                <div className="flex flex-wrap gap-2 p-1">
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${selectedTags.length === 0
                                            ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                                            : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        All Topics
                                    </button>
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => {
                                                if (selectedTags.includes(tag!)) {
                                                    setSelectedTags(selectedTags.filter(t => t !== tag));
                                                } else {
                                                    setSelectedTags([...selectedTags, tag!]);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${selectedTags.includes(tag!)
                                                ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                                                : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                                                }`}
                                        >
                                            {tag!.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Difficulty */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                Difficulty Level
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Any Difficulty', 'Mains', 'Advanced', 'NEET'].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setSelectedDifficulty(diff)}
                                        className={`px-2 py-2 rounded-lg text-xs font-bold border transition ${selectedDifficulty === diff
                                            ? 'bg-white/10 border-white/20 text-white'
                                            : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        {diff === 'Any Difficulty' ? 'Mixed' : diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Question Count */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Question Limit
                            </label>
                            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                                {['5', '10', '20', 'Max'].map(count => (
                                    <button
                                        key={count}
                                        onClick={() => setQuestionLimit(count)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${questionLimit === count
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Enter Arena Button */}
                    <div className="p-4 md:p-6 border-t border-white/5 bg-gradient-to-t from-[#0F172A] to-[#1E293B] md:hidden">
                        <button
                            onClick={startPractice}
                            disabled={totalPreview === 0}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-black text-lg text-white shadow-2xl shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            Ignite <Flame size={20} />
                        </button>
                        <p className="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-wider">
                            {totalPreview === 0 ? 'No Matching Questions' : `${questionsToPlay.length} Questions Ready`}
                        </p>
                    </div>

                    {/* Desktop Footer */}
                    <div className="hidden md:block p-6 md:p-8 border-t border-white/5 bg-[#1E293B]">
                        <p className="text-center text-xs text-gray-500 uppercase tracking-wider">
                            Configure & Check Stats
                        </p>
                    </div>
                </aside>

                {/* Right Main Dashboard - Mission Briefing (Hidden on mobile) */}
                <main className="hidden md:flex flex-1 min-h-full overflow-y-auto flex-col relative bg-black/40">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 text-center relative z-10">
                        <div className="mb-8 lg:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="text-purple-400 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Ready to Practice?</span>
                            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">
                                {selectedChapter === 'All Chapters' ? 'The Crucible' : selectedChapter}
                            </h2>
                            {selectedChapter === 'All Chapters' && (
                                <p className="text-lg md:text-xl text-purple-300 font-medium tracking-wide mb-6">"Forge your concepts in fire."</p>
                            )}
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                You are about to tackle <span className="text-white font-bold">{questionsToPlay.length}</span> high-quality problems.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 lg:gap-6 w-full max-w-2xl mb-8 lg:mb-10">
                            <div className="bg-gray-900/40 border border-white/5 p-4 lg:p-6 rounded-2xl backdrop-blur-md">
                                <div className="text-orange-400 font-bold text-2xl lg:text-3xl mb-1">
                                    {mainsCount}
                                </div>
                                <div className="text-[10px] lg:text-xs text-gray-500 uppercase font-bold tracking-wider">Mains Level</div>
                            </div>
                            <div className="bg-gray-900/40 border border-white/5 p-4 lg:p-6 rounded-2xl backdrop-blur-md">
                                <div className="text-red-400 font-bold text-2xl lg:text-3xl mb-1">
                                    {advCount}
                                </div>
                                <div className="text-[10px] lg:text-xs text-gray-500 uppercase font-bold tracking-wider">Advanced</div>
                            </div>

                            {neetCount > 0 ? (
                                <div className="bg-gray-900/40 border border-white/5 p-4 lg:p-6 rounded-2xl backdrop-blur-md">
                                    <div className="text-blue-400 font-bold text-2xl lg:text-3xl mb-1">{neetCount}</div>
                                    <div className="text-[10px] lg:text-xs text-gray-500 uppercase font-bold tracking-wider">NEET</div>
                                </div>
                            ) : (
                                <div className="bg-gray-900/40 border border-white/5 p-4 lg:p-6 rounded-2xl backdrop-blur-md">
                                    <div className="text-purple-400 font-bold text-2xl lg:text-3xl mb-1">~{estTime}m</div>
                                    <div className="text-[10px] lg:text-xs text-gray-500 uppercase font-bold tracking-wider">Est. Time</div>
                                </div>
                            )}
                        </div>

                        {/* Progress Stats Card - Dynamic data from localStorage */}
                        <div className="w-full max-w-2xl mb-8 lg:mb-10">
                            <div className="p-5 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 shrink-0">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Your Progress</h4>
                                        <p className="text-sm text-gray-400">
                                            {progress.totalAttempted > 0
                                                ? `${progress.totalAttempted} questions attempted with ${overallAccuracy}% accuracy`
                                                : 'Start practicing to track your progress!'
                                            }
                                        </p>
                                    </div>
                                </div>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold text-xl">{progress.totalCorrect}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">Correct</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-amber-400 font-bold text-xl">{progress.totalIncorrect}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">Incorrect</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-purple-400 font-bold text-xl flex items-center justify-center gap-1">
                                            {progress.bestStreak} <Zap size={14} />
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">Best Streak</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-2xl">
                            {/* Focus Concepts or Sub-topics Summary */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Focus Concepts</h4>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {selectedTags.length > 0 ? (
                                        <div className="px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                            <span className="font-bold">{selectedTags[0].replace(/_/g, ' ')}</span>
                                            {selectedTags.length > 1 && <span className="opacity-70 ml-1">+{selectedTags.length - 1} others</span>}
                                        </div>
                                    ) : (
                                        Array.from(new Set(previewQuestions.slice(0, 8).map(q => q.tagId).filter(Boolean))).map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                                                {tag!.replace(/_/g, ' ')}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={startPractice}
                                disabled={totalPreview === 0}
                                className="w-full py-4 md:py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-black text-xl text-white shadow-2xl shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                Ignite <Flame size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4 uppercase tracking-wider font-medium">
                                {totalPreview === 0
                                    ? 'No Matching Questions'
                                    : `Launching ${questionsToPlay.length} High-Quality Questions${neetCount > 0 ? ` (~${estTime}m)` : ''}`
                                }
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // === PLAYING MODE ===
    if (!activeQuestion) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">No questions available for this selection.</p>
                    <button onClick={resetSession} className="px-6 py-2 bg-purple-600 rounded-full">Back to Menu</button>
                </div>
            </div>
        );
    }

    const handleMarkForReview = () => {
        setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'marked' }));
    };

    const handleSkip = () => {
        setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'skipped' }));
        handleNext();
    };

    const getStatusColor = (idx: number) => {
        const status = questionStatus[idx];
        if (idx === currentIndex) return 'ring-2 ring-purple-500 bg-purple-500 text-white';
        switch (status) {
            case 'solved': return 'bg-emerald-500 text-white';
            case 'incorrect': return 'bg-red-500 text-white';
            case 'skipped': return 'bg-gray-500 text-white';
            case 'marked': return 'bg-amber-500 text-white';
            default: return 'bg-white/10 text-gray-400 hover:bg-white/20';
        }
    };

    return (
        <div className="h-screen bg-[#0F172A] text-gray-100 font-sans flex flex-col overflow-hidden relative">
            {/* === MOBILE NAVIGATOR DRAWER === */}
            {showMobileNav && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setShowMobileNav(false)} />
                    <div className="absolute right-0 top-0 h-full w-72 bg-[#0a0a16] p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-white">Question Palette</h4>
                            <button onClick={() => setShowMobileNav(false)} className="text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {filteredQuestions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentIndex(idx); resetState(); setShowMobileNav(false); }}
                                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${getStatusColor(idx)}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2 text-[10px] text-gray-400 mb-6">
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Correct</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Incorrect</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Marked</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-500"></span> Skipped</div>
                        </div>
                        <button
                            onClick={handleSubmitTest}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl text-sm md:text-base shadow-lg"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>
            )}

            {/* === HEADER BAR === */}
            <header className="h-12 md:h-14 bg-[#0a0a16]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-3 md:px-6 shrink-0 z-10">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={resetSession} className="text-gray-500 hover:text-white transition flex items-center gap-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        <ArrowLeft size={14} /> <span className="hidden sm:inline">Exit</span>
                    </button>
                    <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                    <span className="text-xs md:text-sm font-semibold text-purple-400 truncate max-w-[100px] md:max-w-none">
                        {selectedChapter === 'All Chapters' ? 'Practice' : selectedChapter}
                    </span>
                </div>

                {/* Progress Counter */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="font-bold text-white">{currentIndex + 1}</span>
                    <span>of</span>
                    <span>{filteredQuestions.length}</span>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Timer */}
                    <button
                        onClick={() => setTimerActive(!timerActive)}
                        className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border text-[10px] md:text-xs font-mono transition ${timerActive ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-gray-500 border-white/10'
                            }`}
                    >
                        {timerActive ? <Pause size={10} /> : <Play size={10} />}
                        {formatTime(timerSeconds)}
                    </button>
                    {/* Streak */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <Flame size={12} className={streak > 1 ? 'text-orange-500' : 'text-gray-600'} />
                        <span className="font-bold text-xs text-orange-400">{streak}</span>
                    </div>
                    {/* Mobile Nav Toggle */}
                    <button onClick={() => setShowMobileNav(true)} className="md:hidden p-1.5 hover:bg-white/5 rounded-lg">
                        <Menu size={18} className="text-gray-400" />
                    </button>
                </div>
            </header>

            {/* Progress Bar (Actual Progress) */}
            <div className="h-1 bg-white/5">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* === MAIN CONTENT: Split Screen === */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* ZONE A: The Learning Canvas */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 pb-40 md:pb-64">
                    <div className="max-w-2xl mx-auto">
                        {/* Question Meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-[10px] md:text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border border-purple-500/30">
                                Q.{currentIndex + 1}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-400 bg-white/5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border border-white/5">
                                {activeQuestion?.tagId?.replace(/_/g, ' ') || 'General'}
                            </span>
                            <span className={`text-[10px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-full font-medium border ${activeQuestion?.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                activeQuestion?.difficulty === 'Mains' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {activeQuestion?.difficulty}
                            </span>
                        </div>

                        {/* Question Card */}
                        <div className="p-0">
                            <QuestionCard
                                question={activeQuestion}
                                onAnswerSubmit={handleAnswerSubmit}
                                showFeedback={isCorrect !== null}
                                selectedOptionId={selectedOptionId}
                            />
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between mt-4 md:mt-6">
                            <button
                                onClick={handleMarkForReview}
                                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-xl border text-xs md:text-sm font-semibold transition ${questionStatus[currentIndex] === 'marked'
                                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                                    : 'border-white/10 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {questionStatus[currentIndex] === 'marked' ? '✓ Marked' : 'Mark'}
                            </button>

                            <div className="flex gap-2">
                                {selectedOptionId === null && (
                                    <button
                                        onClick={handleSkip}
                                        className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-xs md:text-sm font-semibold transition"
                                    >
                                        Skip
                                    </button>
                                )}
                                {isCorrect !== null && (
                                    <button
                                        onClick={handleNext}
                                        className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm md:text-base shadow-lg transition-all flex items-center gap-1"
                                    >
                                        {isLastQuestion ? 'Finish' : 'Next'} <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Solution Drawer */}
                        {showSolution && (
                            <div className="mt-6 md:mt-8 mb-48 animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                                <SolutionViewer solution={activeQuestion.solution} />
                            </div>
                        )}
                    </div>
                </main>

                {/* ZONE B: The Navigator (Right Sidebar - Desktop Only) */}
                <aside className="w-64 lg:w-72 bg-[#0a0a16]/80 backdrop-blur-xl border-l border-white/5 flex-col shrink-0 hidden md:flex">
                    {/* Stats Card */}
                    <div className="p-4 border-b border-white/5">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Accuracy</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-3 border-emerald-500 flex items-center justify-center bg-emerald-500/10">
                                <span className="text-sm font-black text-emerald-400">
                                    {Object.values(questionStatus).filter(s => s === 'solved').length > 0
                                        ? Math.round((Object.values(questionStatus).filter(s => s === 'solved').length / (Object.values(questionStatus).filter(s => s === 'solved' || s === 'incorrect').length || 1)) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-400">
                                <p><span className="font-bold text-emerald-400">{Object.values(questionStatus).filter(s => s === 'solved').length}</span> Correct</p>
                                <p><span className="font-bold text-red-400">{Object.values(questionStatus).filter(s => s === 'incorrect').length}</span> Wrong</p>
                            </div>
                        </div>
                    </div>

                    {/* Question Palette */}
                    <div className="p-4 flex-1 overflow-y-auto section-scrollbar">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Questions</h4>
                        <div className="grid grid-cols-5 gap-1.5">
                            {filteredQuestions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentIndex(idx); resetState(); }}
                                    className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${getStatusColor(idx)}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-3 border-t border-white/5 text-xs grid grid-cols-2 gap-2 text-gray-400">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Correct</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Wrong</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Marked</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span> Skipped</div>
                    </div>

                    {/* Submit Button */}
                    <div className="p-3 border-t border-white/5">
                        <button
                            onClick={handleSubmitTest}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                        >
                            Submit Test
                        </button>
                    </div>
                </aside>
            </div>

            {/* Feedback Overlay */}
            <FeedbackOverlay
                isOpen={isCorrect !== null}
                isCorrect={!!isCorrect}
                trap={activeQuestion?.trap}
                onNext={handleNext}
                onViewSolution={() => setShowSolution(true)}
            />
        </div>
    );
}
