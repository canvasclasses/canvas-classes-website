'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Flame, Target, Play, Pause, ArrowRight, Menu, X, CheckCircle2, TrendingUp, Zap, BookOpen, Star, CheckCircle, Pencil, Trash2, HelpCircle, AlertTriangle, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/app/the-crucible/types';
import QuestionCard from '@/components/question-bank/QuestionCard';
import FeedbackOverlay from '@/components/question-bank/FeedbackOverlay';
import SolutionViewer from '@/components/question-bank/SolutionViewer';
import { useCrucibleProgress } from '@/hooks/useCrucibleProgress';

interface QuestionBankGameProps {
    initialQuestions: Question[];
}

// Utility to shuffle questions
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export default function QuestionBankGame({ initialQuestions }: QuestionBankGameProps) {
    const [mode, setMode] = useState<'menu' | 'playing' | 'completed'>('menu');
    const [gameMode, setGameMode] = useState<'practice' | 'exam'>('practice');
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [showShloka, setShowShloka] = useState(false); // Transition state
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [examAnswers, setExamAnswers] = useState<Record<number, string>>({});

    // Initialize/Reset
    useEffect(() => {
        if (initialQuestions.length > 0) {
            setFilteredQuestions(initialQuestions);
        }
    }, [initialQuestions]);

    // Curation Filters
    const [hideMastered, setHideMastered] = useState(true);
    const [onlyStarred, setOnlyStarred] = useState(false);

    // User Notes State
    const [editingNote, setEditingNote] = useState(false);
    const [noteText, setNoteText] = useState('');

    // Stats
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);

    // Arena Config State
    const [selectedChapter, setSelectedChapter] = useState('All Chapters');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Any Difficulty');
    const [questionLimit, setQuestionLimit] = useState('10');

    // Timer State
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(true);

    // Question Status Tracking
    const [questionStatus, setQuestionStatus] = useState<Record<number, 'solved' | 'incorrect' | 'skipped' | 'marked' | 'answered' | null>>({});

    // Progress Hook
    const {
        progress,
        isLoaded: progressLoaded,
        recordAttempt,
        initializeChapterTotals,
        getChapterStats,
        overallAccuracy,
        toggleStar,
        toggleMaster,
        saveNote,
    } = useCrucibleProgress();

    const chapters = Array.from(new Set(initialQuestions.map(q => q.chapterId).filter(Boolean)));

    // Initialize chapter totals
    useEffect(() => {
        if (initialQuestions.length > 0 && progressLoaded) {
            initializeChapterTotals(initialQuestions);
        }
    }, [initialQuestions, progressLoaded, initializeChapterTotals]);

    // Reset tags when chapter changes
    useEffect(() => {
        setSelectedTags([]);
    }, [selectedChapter]);

    // Cleanup global footer
    useEffect(() => {
        const footer = document.querySelector('footer');
        if (footer) {
            const display = footer.style.display;
            footer.style.display = 'none';
            return () => { footer.style.display = display; };
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

    const activeQuestion = filteredQuestions[currentIndex];
    const isLastQuestion = currentIndex === filteredQuestions.length - 1;

    // Load existing note when question changes
    useEffect(() => {
        if (activeQuestion) {
            setNoteText(progress.userNotes?.[activeQuestion.id] || '');
            setEditingNote(false);
        }
    }, [currentIndex, activeQuestion, progress.userNotes]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswerSubmit = (correct: boolean, optionId: string) => {
        setExamAnswers(prev => ({ ...prev, [currentIndex]: optionId }));

        if (gameMode === 'practice') {
            setSelectedOptionId(optionId);
            setIsCorrect(correct);
            setQuestionStatus(prev => ({ ...prev, [currentIndex]: correct ? 'solved' : 'incorrect' }));

            if (activeQuestion) {
                recordAttempt(activeQuestion.id, activeQuestion.chapterId || 'Unknown', activeQuestion.difficulty, correct);
            }

            if (correct) {
                setStreak(prev => prev + 1);
                setScore(prev => prev + 10 + (streak * 2));
            } else {
                setStreak(0);
            }
        } else {
            setSelectedOptionId(optionId);
            setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'answered' }));
        }
    };

    const resetState = (index: number, forceReviewMode?: boolean) => {
        const reviewActive = !!(isReviewing || forceReviewMode);
        if (gameMode === 'exam' || reviewActive) {
            setSelectedOptionId(examAnswers[index] || null);
        } else {
            setSelectedOptionId(null);
        }
        setIsCorrect(null);
        setShowSolution(reviewActive);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            resetState(prevIndex);
        }
    };

    const handleNext = () => {
        // If skipping (no answer selected) and not in review mode
        if (!isReviewing && selectedOptionId === null) {
            setQuestionStatus(prev => ({
                ...prev,
                [currentIndex]: prev[currentIndex] === 'marked' ? 'marked' : 'skipped'
            }));
        }

        if (!isLastQuestion) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            resetState(nextIndex);
        } else {
            handleSubmitTest();
        }
    };

    const handleSubmitTest = () => {
        if (gameMode === 'exam') {
            filteredQuestions.forEach((q, idx) => {
                const answer = examAnswers[idx];
                if (answer) {
                    const isCorrect = q.options.find(o => o.id === answer)?.isCorrect;
                    recordAttempt(q.id, q.chapterId || 'Unknown', q.difficulty, !!isCorrect);
                }
            });
        }
        setMode('completed');
    };

    const resetSession = () => {
        setMode('menu');
        setCurrentIndex(0);
        setQuestionStatus({});
        setTimerSeconds(0);
        setStreak(0);
        setScore(0);
        setIsReviewing(false);
        setExamAnswers({});
        resetState(0);
    };

    const startReview = () => {
        setMode('playing');
        setCurrentIndex(0);
        setIsReviewing(true);
        resetState(0, true);
    };

    const startPractice = () => {
        const previewSizeQuery = initialQuestions.filter(q => {
            const chapterMatch = selectedChapter === 'All Chapters' || q.chapterId === selectedChapter;
            const tagMatch = selectedTags.length === 0 || (q.tagId && selectedTags.includes(q.tagId));
            const diffMatch = selectedDifficulty === 'Any Difficulty' ||
                (selectedDifficulty === 'NEET' ? (q.difficulty !== 'Mains' && q.difficulty !== 'Advanced') : q.difficulty === selectedDifficulty);

            const isMastered = progress.masteredIds?.includes(q.id);
            const isStarred = progress.starredIds?.includes(q.id);

            if (hideMastered && isMastered && !onlyStarred) return false;
            if (onlyStarred && !isStarred) return false;

            return chapterMatch && tagMatch && diffMatch;
        });

        if (previewSizeQuery.length === 0) {
            alert("No questions match your selection.");
            return;
        }

        const playSet = previewSizeQuery.slice(0, questionLimit === 'Max' ? undefined : Number(questionLimit));

        // Trigger Shloka Transition
        setShowShloka(true);

        setTimeout(() => {
            setShowShloka(false);
            setFilteredQuestions(shuffleArray(playSet));
            setMode('playing');
            setCurrentIndex(0);
            setQuestionStatus({});
            setTimerSeconds(0);
            resetState(0);
        }, 2000);
    };

    const availableTags = Array.from(new Set(
        initialQuestions
            .filter(q => selectedChapter === 'All Chapters' || q.chapterId === selectedChapter)
            .map(q => q.tagId)
            .filter(Boolean)
    ));

    if (showShloka) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-in fade-in duration-300">
                <div className="text-center space-y-6">
                    <h1 className="text-3xl md:text-5xl font-black text-amber-400 tracking-wider leading-relaxed drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                        उद्यमेन हि सिध्यन्ति<br />कार्याणि न मनोरथैः
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base uppercase tracking-[0.3em] font-medium">Focus on the effort, not the result</p>
                </div>
            </div>
        );
    }

    if (mode === 'completed') {
        let solvedCount = 0;
        let incorrectCount = 0;
        let skippedCount = 0;

        filteredQuestions.forEach((q, idx) => {
            const answer = examAnswers[idx];
            if (!answer) skippedCount++;
            else {
                const correct = q.options.find(o => o.id === answer)?.isCorrect;
                if (correct) solvedCount++;
                else incorrectCount++;
            }
        });

        const accuracy = (solvedCount + incorrectCount) > 0 ? Math.round((solvedCount / (solvedCount + incorrectCount)) * 100) : 0;

        return (
            <div className="min-h-screen bg-[#0F172A] text-gray-100 flex items-center justify-center p-4">
                <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Trophy size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Crucible Summarized</h2>
                        <div className="grid grid-cols-3 gap-4 mb-8 mt-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-2xl font-black text-emerald-400">{solvedCount}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Correct</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-2xl font-black text-red-400">{incorrectCount}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Wrong</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-2xl font-black text-gray-400">{skippedCount}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Skipped</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl p-6 mb-8">
                            <div className="text-5xl font-black text-white mb-1">{accuracy}%</div>
                            <div className="text-[10px] text-purple-300 uppercase font-black tracking-widest">Accuracy</div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={startReview} className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2">
                                <BookOpen size={18} /> Review All Solutions
                            </button>
                            <button onClick={resetSession} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-xl">
                                Back to Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'menu') {
        const previewQuestions = initialQuestions.filter(q => {
            const ch = selectedChapter === 'All Chapters' || q.chapterId === selectedChapter;
            const tg = selectedTags.length === 0 || (q.tagId && selectedTags.includes(q.tagId));
            const df = selectedDifficulty === 'Any Difficulty' || (selectedDifficulty === 'NEET' ? (q.difficulty !== 'Mains' && q.difficulty !== 'Advanced') : q.difficulty === selectedDifficulty);
            const mast = progress.masteredIds?.includes(q.id);
            const star = progress.starredIds?.includes(q.id);
            if (hideMastered && mast && !onlyStarred) return false;
            if (onlyStarred && !star) return false;
            return ch && tg && df;
        });
        const previewSize = previewQuestions.length;
        const questionsToPlay = previewQuestions.slice(0, questionLimit === 'Max' ? undefined : Number(questionLimit));
        const mainsCount = questionsToPlay.filter(q => q.difficulty === 'Mains').length;
        const advCount = questionsToPlay.filter(q => q.difficulty === 'Advanced').length;
        const neetCount = questionsToPlay.filter(q => q.difficulty !== 'Mains' && q.difficulty !== 'Advanced').length;
        const estTime = questionsToPlay.length * 2;

        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-[#0F172A] text-gray-100 font-sans overflow-hidden">
                {/* MOBILE STICKY FOOTER - Always visible at bottom */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/10 p-4 safe-area-pb">
                    <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        {mainsCount} Mains • {advCount} Adv • {neetCount > 0 ? `${neetCount} NEET` : `~${estTime}m`}
                    </div>
                    <button
                        onClick={startPractice}
                        disabled={previewSize === 0}
                        className="w-full py-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
                    >
                        <span className="tracking-widest uppercase text-sm">Ignite Mission</span>
                        <Rocket size={20} />
                    </button>
                </div>

                <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-white/5 bg-[#1E293B] flex flex-col z-20 shadow-2xl overflow-y-auto pb-36 md:pb-8">
                    {/* Header with Chevron Back */}
                    <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between">
                        <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition text-gray-400 hover:text-white">
                            <ArrowLeft size={22} />
                        </Link>
                        <h1 className="text-lg md:text-2xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">The Crucible</h1>
                        <div className="w-6" /> {/* Spacer for centering */}
                    </div>

                    {/* CONTEXT FIRST: Chapter Title & Audio Tip (Mobile Priority) */}
                    <div className="p-4 md:p-6 border-b border-white/5 bg-[#0F172A]/50">
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                {selectedChapter}
                            </h2>
                            <div className="h-1 w-12 bg-purple-500 rounded-full mx-auto"></div>
                            {/* Guru Mantra - Animated Waveform Audio Pill */}
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-xl p-2.5 pr-4 hover:from-indigo-900/60 hover:to-purple-900/60 transition cursor-pointer group mx-auto">
                                {/* Multicolor Waveform */}
                                <div className="flex items-center gap-[3px] h-8 px-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="w-[3px] rounded-full animate-pulse"
                                            style={{
                                                height: `${12 + Math.sin(i * 0.8) * 8}px`,
                                                background: `linear-gradient(to top, ${['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#fbbf24'][i]}, ${['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f59e0b'][i]})`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: `${0.4 + Math.random() * 0.3}s`
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">Sir's Strategy Tip</span>
                                    <span className="text-[9px] text-gray-400">0:42</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INSIGHT SECOND: Dynamic Tactical Tip */}
                    <div className="p-4 md:p-6 border-b border-white/5">
                        <div className="flex items-start gap-3 bg-slate-900/60 border border-white/5 rounded-xl p-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${progress.totalAttempted > 0 ? (overallAccuracy >= 70 ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : overallAccuracy >= 50 ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'bg-amber-500/20 border border-amber-500/30 text-amber-400') : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'}`}>
                                {progress.totalAttempted > 0 ? (overallAccuracy >= 70 ? <TrendingUp size={14} /> : overallAccuracy >= 50 ? <Target size={14} /> : <AlertTriangle size={14} />) : <HelpCircle size={14} />}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Tactical Insight</h4>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    {(() => {
                                        if (progress.totalAttempted === 0) return "Complete a session to unlock personalized insights.";
                                        const masteredCount = progress.masteredIds?.length || 0;
                                        const starredCount = progress.starredIds?.length || 0;
                                        if (overallAccuracy >= 80) return <><span className="text-emerald-400 font-bold">Excellent!</span> {masteredCount} mastered. Try Advanced difficulty.</>;
                                        if (overallAccuracy >= 60) return <><span className="text-blue-400 font-bold">Good progress.</span> {starredCount > 0 ? `${starredCount} starred for review.` : 'Star weak questions for focused practice.'}</>;
                                        if (overallAccuracy >= 40) return <><span className="text-amber-400 font-bold">Focus needed.</span> Try the 'Stoichiometry' section first.</>;
                                        return <><span className="text-red-400 font-bold">Review basics.</span> Start with Mole Concept fundamentals.</>;
                                    })()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONFIGURATION SECTION */}
                    <div className="flex-1 p-4 md:p-6 space-y-5">
                        {/* Chapter Config */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Target Chapter
                            </label>
                            <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all shadow-inner">
                                <option>All Chapters</option>
                                {chapters.map(ch => <option key={ch}>{ch}</option>)}
                            </select>
                        </div>

                        {/* Sub-Topics: 2-COLUMN GRID */}
                        {selectedChapter !== 'All Chapters' && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                                    Focus Area
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className={`px-3 py-3 rounded-xl text-left transition-all duration-300 border ${selectedTags.length === 0
                                            ? 'bg-cyan-500/20 border-cyan-500/30'
                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className={`text-[10px] font-black uppercase tracking-wider ${selectedTags.length === 0 ? 'text-cyan-400' : 'text-gray-400'}`}>🎯 All Topics Mixed</div>
                                        <div className="text-[9px] text-gray-500 mt-0.5">Random problems from entire chapter</div>
                                    </button>
                                    {[
                                        { id: 'Basics', title: '⚗️ Stoichiometry & Mole', desc: 'Mole, % Composition, Empirical Formula, Limiting Reagent', tags: ['Percentage_Composition', 'Empirical_Formula', 'Stoichiometry', 'Limiting_Reagent', 'Average_Atomic_Mass'] },
                                        { id: 'Solutions', title: '🧪 Concentration & Mixing', desc: 'Molarity, Molality, Normality, Dilution, Solution Mixing', tags: ['Molarity', 'Molality', 'Normality', 'Mixing_of_Solutions', 'Dilution'] },
                                        { id: 'Advanced', title: '🔥 Redox & Gas Analysis', desc: 'Eudiometry, POAC, n-Factor, Equivalent Concept', tags: ['Eudiometry', 'POAC', 'n_Factor', 'Equivalent_Concept'] }
                                    ].map(group => {
                                        const isActive = group.tags.every(t => selectedTags.includes(t)) && selectedTags.length === group.tags.length;
                                        return (
                                            <button
                                                key={group.id}
                                                onClick={() => setSelectedTags(group.tags)}
                                                className={`px-3 py-3 rounded-xl text-left transition-all duration-300 border ${isActive
                                                    ? 'bg-cyan-500/20 border-cyan-500/30'
                                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>{group.title}</div>
                                                <div className="text-[9px] text-gray-500 mt-0.5">{group.desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Difficulty Level */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                Difficulty Level
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { id: 'Any Difficulty', label: 'Mix', active: 'bg-white/10 text-white border-white' },
                                    { id: 'Mains', label: 'Mains', active: 'bg-blue-600 text-white border-blue-400' },
                                    { id: 'Advanced', label: 'Adv', active: 'bg-red-600 text-white border-red-400' },
                                    { id: 'NEET', label: 'NEET', active: 'bg-emerald-600 text-white border-emerald-400' }
                                ].map(diff => (
                                    <button
                                        key={diff.id}
                                        onClick={() => setSelectedDifficulty(diff.id)}
                                        className={`py-2 rounded-lg text-[10px] font-black border transition-all duration-300 ${selectedDifficulty === diff.id ? diff.active : 'border-white/10 text-gray-500'}`}
                                    >
                                        {diff.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Count */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Question Count
                            </label>
                            <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                                {['5', '10', '20', 'Max'].map(count => (
                                    <button key={count} onClick={() => setQuestionLimit(count)} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all duration-300 ${questionLimit === count ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Collection Filters */}
                        <div className="space-y-3 pt-3 border-t border-white/5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block">Filters</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setHideMastered(!hideMastered)} className={`p-2 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${hideMastered ? 'bg-purple-600/20 border-purple-500/30 text-purple-300' : 'border-white/10 text-gray-500'}`}>
                                    <CheckCircle size={12} /> Hide Mastered
                                </button>
                                <button onClick={() => setOnlyStarred(!onlyStarred)} className={`p-2 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${onlyStarred ? 'bg-amber-600/20 border-amber-500/30 text-amber-300' : 'border-white/10 text-gray-500'}`}>
                                    <Star size={12} /> Starred Only
                                </button>
                            </div>
                        </div>

                        {/* Game Mode */}
                        <div className="space-y-3 pt-3 border-t border-white/5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Crucible Mode</label>
                            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                                <button onClick={() => setGameMode('practice')} className={`py-2.5 rounded-lg flex flex-col items-center gap-1 transition-all duration-300 ${gameMode === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Practice</span>
                                </button>
                                <button onClick={() => setGameMode('exam')} className={`py-2.5 rounded-lg flex flex-col items-center gap-1 transition-all duration-300 ${gameMode === 'exam' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Exam</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT DASHBOARD - Desktop Only */}
                <main className="hidden md:flex flex-1 overflow-y-auto bg-[#0F172A] relative">
                    <div className="max-w-5xl mx-auto p-8 lg:p-12 pb-32 w-full">
                        {/* Header Section - CENTERED */}
                        <div className="flex flex-col items-center text-center gap-6 mb-10">
                            <div className="space-y-3 flex flex-col items-center">
                                <h2 className="text-6xl font-black text-white tracking-tight leading-tight px-4">
                                    {selectedChapter}
                                </h2>
                                <div className="h-1.5 w-32 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                                <p className="text-gray-500 font-medium text-base max-w-lg">
                                    {questionLimit} Problems • {selectedDifficulty === 'Any Difficulty' ? 'Adaptive' : selectedDifficulty} Mode
                                </p>
                            </div>

                            {/* Guru Mantra */}
                            <div className="shrink-0 mt-2">
                                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 pr-5 hover:bg-white/10 transition cursor-pointer group shadow-xl backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                                        <Play size={14} className="fill-white text-white ml-0.5" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="flex gap-0.5">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className={`w-0.5 h-2.5 rounded-full ${i < 3 ? 'bg-indigo-400 animate-pulse' : 'bg-gray-700'}`} style={{ animationDelay: `${i * 0.1}s` }} />
                                                ))}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500">0:42</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-300 group-hover:text-white transition uppercase tracking-wider">Sir's Strategy Tip</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP ONLY IGNITE ACTION */}
                        <div className="flex flex-col items-center gap-4 mb-12">
                            <button
                                onClick={startPractice}
                                disabled={previewSize === 0}
                                className="w-auto px-12 py-5 md:max-w-md bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl font-black text-white shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-4 text-xl group border border-white/10"
                            >
                                <span className="tracking-widest uppercase">Ignite Mission</span>
                                <Rocket size={26} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Mission Ready • {previewSize} Strategic Problems
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="text-blue-400 font-black text-4xl mb-0.5">{mainsCount}</div>
                                <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Mains</div>
                            </div>
                            <div className="bg-gray-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="text-red-400 font-black text-4xl mb-0.5">{advCount}</div>
                                <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Advanced</div>
                            </div>
                            <div className="bg-gray-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="text-purple-400 font-black text-4xl mb-0.5 text-center transition group-hover:scale-105">
                                    {neetCount > 0 ? neetCount : `~${estTime}m`}
                                </div>
                                <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest text-center">
                                    {neetCount > 0 ? 'NEET' : 'Est. Time'}
                                </div>
                            </div>
                        </div>

                        {/* Tactical Insight Card */}
                        <div className="bg-slate-900/80 border border-white/10 rounded-[32px] p-8 mb-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex flex-row gap-8 relative z-10">
                                <div className="flex items-start gap-4 w-1/2">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Tactical Insight</h4>
                                        <div className="text-sm text-gray-400 leading-relaxed font-medium">
                                            {progress.totalAttempted > 0 ? (
                                                overallAccuracy < 50 ? (
                                                    <p><span className="text-amber-500 font-bold">Heads Up:</span> Focus on basics first.</p>
                                                ) : <p><span className="text-emerald-500 font-bold">Mastery:</span> Scaling difficulty up.</p>
                                            ) : <p>Complete a session to unlock data.</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-1/2 border-l border-white/5 pl-8">
                                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Focus Areas</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.length > 0 ? (
                                            selectedTags.slice(0, 3).map(tag => (
                                                <div key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold text-gray-400">
                                                    {tag.replace(/_/g, ' ')}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Adaptive Analysis Pending</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!activeQuestion) return null;

    const attemptedTotal = Object.keys(examAnswers).length;
    const progressPercent = (attemptedTotal / filteredQuestions.length) * 100;

    return (
        <div className="h-screen bg-[#0F172A] text-gray-100 flex flex-col overflow-hidden relative">
            <header className="h-14 bg-[#0a0a16]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={resetSession} className="text-gray-500 hover:text-white transition flex items-center gap-2 text-xs font-black uppercase">
                        <ArrowLeft size={16} /> Exit
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm font-black text-purple-400 uppercase tracking-widest">{currentIndex + 1} / {filteredQuestions.length}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-sm text-gray-500">
                    <Pause size={14} /> {formatTime(timerSeconds)}
                    {gameMode === 'practice' && (
                        <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20">
                            <Flame size={14} className="text-orange-500" />
                            <span className="font-black text-orange-400">{streak}</span>
                        </div>
                    )}
                </div>
                <button onClick={() => setShowMobileNav(!showMobileNav)} className="md:hidden"><Menu /></button>
            </header>

            <div className="h-1 bg-white/5 z-20">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16 pb-32 scroll-smooth">
                    <div className="max-w-3xl mx-auto">
                        {/* ULTRA-COMPACT CONTROL STRIP */}
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white leading-tight">Q.{currentIndex + 1}</span>
                                <span className="text-[9px] font-bold text-indigo-400/50 uppercase tracking-widest">{activeQuestion.difficulty}</span>
                            </div>

                            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5 shadow-inner">
                                <button
                                    onClick={() => {
                                        toggleStar(activeQuestion.id);
                                        if (!progress.starredIds?.includes(activeQuestion.id) && progress.masteredIds?.includes(activeQuestion.id)) {
                                            toggleMaster(activeQuestion.id);
                                        }
                                    }}
                                    className={`p-2 rounded-md transition-all ${progress.starredIds?.includes(activeQuestion.id) ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    title="Star for Revision"
                                >
                                    <Star size={14} fill={progress.starredIds?.includes(activeQuestion.id) ? "currentColor" : "none"} />
                                </button>
                                <div className="w-px h-3 bg-white/10 mx-0.5" />
                                <button
                                    onClick={() => {
                                        toggleMaster(activeQuestion.id);
                                        if (!progress.masteredIds?.includes(activeQuestion.id) && progress.starredIds?.includes(activeQuestion.id)) {
                                            toggleStar(activeQuestion.id);
                                        }
                                    }}
                                    className={`p-2 rounded-md transition-all ${progress.masteredIds?.includes(activeQuestion.id) ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    title="Easy - Hide"
                                >
                                    <CheckCircle size={14} />
                                </button>
                                <div className="w-px h-3 bg-white/10 mx-0.5" />
                                <button
                                    onClick={() => setEditingNote(true)}
                                    className={`p-2 rounded-md transition-all ${progress.userNotes?.[activeQuestion.id] ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    title="Add Strategy Note"
                                >
                                    <Pencil size={14} />
                                </button>
                            </div>
                        </div>

                        {(progress.userNotes?.[activeQuestion.id] || editingNote) && (
                            <div className="mb-10 animate-in slide-in-from-top-4 duration-300">
                                <div className="bg-[#FFF982] p-6 shadow-2xl relative transform rotate-1 border-l-8 border-amber-400/50">
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {editingNote ? (
                                            <>
                                                <button onClick={() => setEditingNote(false)} className="p-2 text-amber-700/50 hover:bg-black/5 rounded group" title="Cancel">
                                                    <X size={18} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button onClick={() => { saveNote(activeQuestion.id, noteText); setEditingNote(false); }} className="p-2 text-emerald-700 hover:bg-black/5 rounded group" title="Save Note">
                                                    <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => { saveNote(activeQuestion.id, ''); setEditingNote(false); }} className="p-2 text-red-700 hover:bg-black/5 rounded group" title="Delete Note">
                                                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                    <label className="text-[9px] font-black text-amber-900/40 uppercase tracking-[0.2em] mb-3 block">Personal Strategy</label>
                                    {editingNote ? (
                                        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} autoFocus className="w-full bg-transparent border-none focus:ring-0 text-lg font-handwritten text-gray-900 leading-relaxed h-32 resize-none" placeholder="Mental shortcuts or key observations..." />
                                    ) : (
                                        <p className="text-lg font-handwritten text-gray-900 leading-relaxed">{progress.userNotes?.[activeQuestion.id]}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={isReviewing ? 'pointer-events-none' : ''}>
                            <QuestionCard
                                question={activeQuestion}
                                onAnswerSubmit={handleAnswerSubmit}
                                showFeedback={(gameMode === 'practice' || isReviewing) && (isCorrect !== null || isReviewing)}
                                selectedOptionId={selectedOptionId}
                            />
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-4">
                            <div className="flex gap-2">
                                {isReviewing && currentIndex > 0 && (
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border border-white/10 text-gray-500 hover:bg-white/5 text-[10px] md:text-xs font-black uppercase tracking-widest transition"
                                    >
                                        Back
                                    </button>
                                )}
                                <button onClick={() => setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'marked' }))} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-widest transition ${questionStatus[currentIndex] === 'marked' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-white/10 text-gray-500'}`}>
                                    Mark for Review
                                </button>
                            </div>

                            <div className="flex gap-2 md:gap-3">
                                {!isReviewing && selectedOptionId === null && (
                                    <button
                                        onClick={handleNext}
                                        className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl border border-white/10 text-gray-500 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition"
                                    >
                                        Skip
                                    </button>
                                )}
                                {(selectedOptionId !== null || isReviewing) && (
                                    <button onClick={handleNext} className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg md:rounded-xl font-black text-white shadow-xl flex items-center gap-2 hover:brightness-110 transition-all text-xs md:text-base">
                                        {isLastQuestion ? (isReviewing ? 'Finish Review' : 'Review Stats') : 'Proceed'} <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {showSolution && (
                            <div id="solution-viewer-container" className="mt-16 bg-black/20 rounded-[40px] border border-white/5 overflow-hidden animate-in fade-in duration-1000">
                                <SolutionViewer solution={activeQuestion.solution} />
                            </div>
                        )}
                    </div>
                </main>

                <aside className="w-80 bg-[#0a0a16]/80 border-l border-white/5 hidden lg:flex flex-col z-20">
                    <div className="p-8 flex-1 overflow-y-auto section-scrollbar">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6 block">Question Palette</label>
                        <div className="grid grid-cols-5 gap-3">
                            {filteredQuestions.map((_, idx) => {
                                const status = questionStatus[idx];
                                let style = 'bg-white/5 text-gray-600';
                                if (idx === currentIndex) style = 'ring-2 ring-purple-500 bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]';
                                else if (gameMode === 'practice') {
                                    if (status === 'solved') style = 'bg-emerald-500 text-white';
                                    else if (status === 'incorrect') style = 'bg-red-500 text-white';
                                } else if (status === 'answered') style = 'bg-indigo-500 text-white';

                                if (status === 'marked') style = 'bg-amber-500 text-white';
                                if (status === 'skipped') style = 'bg-gray-700 text-white';

                                return (
                                    <button key={idx} onClick={() => { setCurrentIndex(idx); resetState(idx); }} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${style}`}>
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-8 border-t border-white/5">
                        <button onClick={handleSubmitTest} className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl font-black text-white shadow-xl transition-all hover:brightness-110">
                            TERMINATE MISSION
                        </button>
                    </div>
                </aside>
            </div>

            {gameMode === 'practice' && (
                <FeedbackOverlay
                    isOpen={isCorrect !== null}
                    isCorrect={!!isCorrect}
                    trap={activeQuestion?.trap}
                    onNext={handleNext}
                    onViewSolution={() => {
                        setShowSolution(true);
                        setTimeout(() => document.getElementById('solution-viewer-container')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                />
            )}
        </div>
    );
}
