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

    const resetState = (index: number) => {
        if (gameMode === 'exam' || isReviewing) {
            setSelectedOptionId(examAnswers[index] || null);
        } else {
            setSelectedOptionId(null);
        }
        setIsCorrect(null);
        setShowSolution(isReviewing);
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
        setShowSolution(true);
        resetState(0);
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
                <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-white/5 bg-[#1E293B] flex flex-col z-20 shadow-2xl overflow-y-auto">
                    <div className="p-6 md:p-8 border-b border-white/5">
                        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-6 text-xs uppercase tracking-widest font-bold">
                            <ArrowLeft size={14} /> Back to Hub
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">The Crucible</h1>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Configure your mission parameters.</p>
                    </div>
                    <div className="flex-1 p-6 md:p-8 space-y-6 md:space-y-8">
                        {/* Chapter Config */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Target Chapter
                            </label>
                            <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-purple-500 transition-all shadow-inner">
                                <option>All Chapters</option>
                                {chapters.map(ch => <option key={ch}>{ch}</option>)}
                            </select>
                        </div>

                        {/* Sub-Topics (Horizontal Scroll on Mobile) */}
                        {selectedChapter !== 'All Chapters' && availableTags.length > 0 && (
                            <div className="space-y-4 pt-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                                    Sub-Topics
                                </label>
                                <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 -mx-2 px-2 snap-x">
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all duration-300 snap-start whitespace-nowrap ${selectedTags.length === 0
                                            ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
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
                                            className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all duration-300 snap-start whitespace-nowrap ${selectedTags.includes(tag!)
                                                ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                                                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                                                }`}
                                        >
                                            {tag!.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Difficulty Level */}
                        <div className="space-y-4 pt-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                Difficulty Level
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'Any Difficulty', label: 'Mixed', color: 'border-white/20 hover:border-white/40', active: 'bg-white/10 text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' },
                                    { id: 'Mains', label: 'JEE Mains', color: 'border-blue-500/20 hover:border-blue-500/40', active: 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]' },
                                    { id: 'Advanced', label: 'Advanced', color: 'border-red-500/20 hover:border-red-500/40', active: 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.3)]' },
                                    { id: 'NEET', label: 'NEET Level', color: 'border-emerald-500/20 hover:border-emerald-500/40', active: 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(5,150,105,0.3)]' }
                                ].map(diff => (
                                    <button
                                        key={diff.id}
                                        onClick={() => setSelectedDifficulty(diff.id)}
                                        className={`py-2 rounded-xl text-[11px] font-black border transition-all duration-300 ${selectedDifficulty === diff.id ? diff.active : `${diff.color} text-gray-500`}`}
                                    >
                                        {diff.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Count */}
                        <div className="space-y-4 pt-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Question Count
                            </label>
                            <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                                {['5', '10', '20', 'Max'].map(count => (
                                    <button key={count} onClick={() => setQuestionLimit(count)} className={`flex-1 py-2 rounded-lg text-[11px] font-black transition-all duration-300 ${questionLimit === count ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Collection Filters */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block">Collection Filters</label>
                            <div className="space-y-3">
                                <button onClick={() => setHideMastered(!hideMastered)} className="flex items-center justify-between group w-full text-left">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[13px] font-bold transition-colors ${hideMastered ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}>Exclude Mastered</span>
                                        <div className="group/tooltip relative">
                                            <HelpCircle size={12} className="text-gray-600" />
                                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 bg-gray-900 border border-white/10 p-2 rounded-lg text-[10px] text-gray-400 hidden group-hover/tooltip:block z-50 shadow-xl">
                                                Hides questions you have already answered correctly in previous sessions.
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${hideMastered ? 'bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.3)]' : 'bg-gray-800'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${hideMastered ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                    </div>
                                </button>
                                <button onClick={() => setOnlyStarred(!onlyStarred)} className="flex items-center justify-between group w-full text-left">
                                    <span className={`text-[13px] font-bold transition-colors ${onlyStarred ? 'text-amber-400' : 'text-gray-500 hover:text-gray-400'}`}>Starred Focus</span>
                                    <div className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${onlyStarred ? 'bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.3)]' : 'bg-gray-800'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${onlyStarred ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Game Mode */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Crucible Mode</label>
                            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                                <button onClick={() => setGameMode('practice')} className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-all duration-300 ${gameMode === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Practice</span>
                                </button>
                                <button onClick={() => setGameMode('exam')} className={`py-3 rounded-lg flex flex-col items-center gap-1 transition-all duration-300 ${gameMode === 'exam' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Exam</span>
                                </button>
                            </div>
                        </div>

                        {/* MOBILE ONLY IGNITE BUTTON - High Visibility Positioning */}
                        <div className="pt-6 md:hidden">
                            <button
                                onClick={startPractice}
                                disabled={previewSize === 0}
                                className="w-full py-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                            >
                                <span className="tracking-widest uppercase text-sm">Ignite Mission</span>
                                <Rocket size={20} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT DASHBOARD */}
                <main className="flex-1 overflow-y-auto bg-[#0F172A] relative">
                    <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-32">
                        {/* Header Section - CENTERED */}
                        <div className="flex flex-col items-center text-center gap-4 md:gap-6 mb-8 md:mb-10">
                            <div className="space-y-2 md:space-y-3 flex flex-col items-center">
                                <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight px-4">
                                    {selectedChapter}
                                </h2>
                                <div className="h-1 md:h-1.5 w-16 md:w-32 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                                <p className="text-gray-500 font-medium text-xs md:text-base max-w-sm md:max-w-lg">
                                    {questionLimit} Problems • {selectedDifficulty === 'Any Difficulty' ? 'Adaptive' : selectedDifficulty} Mode
                                </p>
                            </div>

                            {/* Guru Mantra */}
                            <div className="shrink-0 mt-2">
                                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 pr-5 hover:bg-white/10 transition cursor-pointer group shadow-xl backdrop-blur-sm">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
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
                                        <span className="text-[10px] md:text-[11px] font-bold text-gray-300 group-hover:text-white transition uppercase tracking-wider">Sir's Strategy Tip</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP ONLY IGNITE ACTION */}
                        <div className="hidden md:flex flex-col items-center gap-4 mb-12">
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

                        {/* Stats Cards (Compact on Mobile) */}
                        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-gray-900/40 border border-white/5 p-3 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="text-blue-400 font-black text-xl md:text-4xl mb-0.5">{mainsCount}</div>
                                <div className="text-[8px] md:text-[10px] text-gray-600 uppercase font-black tracking-widest">Mains</div>
                            </div>
                            <div className="bg-gray-900/40 border border-white/5 p-3 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="text-red-400 font-black text-xl md:text-4xl mb-0.5">{advCount}</div>
                                <div className="text-[8px] md:text-[10px] text-gray-600 uppercase font-black tracking-widest">Advanced</div>
                            </div>
                            <div className="bg-gray-900/40 border border-white/5 p-3 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="text-purple-400 font-black text-xl md:text-4xl mb-0.5 text-center transition group-hover:scale-105">
                                    {neetCount > 0 ? neetCount : `~${estTime}m`}
                                </div>
                                <div className="text-[8px] md:text-[10px] text-gray-600 uppercase font-black tracking-widest text-center">
                                    {neetCount > 0 ? 'NEET' : 'Est. Time'}
                                </div>
                            </div>
                        </div>

                        {/* Tactical Insight Card (Streamlined for Mobile) */}
                        <div className="bg-slate-900/80 border border-white/10 rounded-2xl md:rounded-[32px] p-5 md:p-8 mb-6 md:mb-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-indigo-500/5 rounded-full blur-2xl md:blur-3xl pointer-events-none" />

                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
                                <div className="flex items-start gap-3 md:gap-4 md:w-1/2">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[9px] md:text-[11px] font-black text-indigo-400 uppercase tracking-widest">Tactical Insight</h4>
                                        <div className="text-[12px] md:text-sm text-gray-400 leading-relaxed font-medium">
                                            {progress.totalAttempted > 0 ? (
                                                overallAccuracy < 50 ? (
                                                    <p><span className="text-amber-500 font-bold">Heads Up:</span> Focus on basics first.</p>
                                                ) : <p><span className="text-emerald-500 font-bold">Mastery:</span> Scaling difficulty up.</p>
                                            ) : <p>Complete a session to unlock data.</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 md:border-l border-white/5 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0">
                                    <h5 className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3" >Focus Areas</h5>
                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {selectedTags.length > 0 ? (
                                            selectedTags.slice(0, 3).map(tag => (
                                                <div key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] md:text-[11px] font-bold text-gray-400">
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
                <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 pb-32 scroll-smooth">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">Q.{currentIndex + 1}</span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeQuestion.difficulty}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                            <button onClick={() => toggleStar(activeQuestion.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${progress.starredIds?.includes(activeQuestion.id) ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                                <Star size={14} fill={progress.starredIds?.includes(activeQuestion.id) ? "currentColor" : "none"} />
                                {progress.starredIds?.includes(activeQuestion.id) ? 'Starred' : 'Star for Revision'}
                            </button>
                            <button onClick={() => toggleMaster(activeQuestion.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${progress.masteredIds?.includes(activeQuestion.id) ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                                <CheckCircle size={14} />
                                {progress.masteredIds?.includes(activeQuestion.id) ? 'Mastered' : 'Easy - Hide'}
                            </button>
                            <div className="flex-1" />
                            <button onClick={() => setEditingNote(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${progress.userNotes?.[activeQuestion.id] ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                                <Pencil size={14} />
                                {progress.userNotes?.[activeQuestion.id] ? 'My Note' : 'Add Note'}
                            </button>
                        </div>

                        {(progress.userNotes?.[activeQuestion.id] || editingNote) && (
                            <div className="mb-10 animate-in slide-in-from-top-4 duration-300">
                                <div className="bg-[#FFF982] p-6 shadow-2xl relative transform rotate-1 border-l-8 border-amber-400/50">
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {editingNote ? (
                                            <button onClick={() => { saveNote(activeQuestion.id, noteText); setEditingNote(false); }} className="p-2 text-emerald-700 hover:bg-black/5 rounded"><CheckCircle2 size={18} /></button>
                                        ) : (
                                            <button onClick={() => { saveNote(activeQuestion.id, ''); setEditingNote(false); }} className="p-2 text-red-700 hover:bg-black/5 rounded"><Trash2 size={18} /></button>
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
                            <button onClick={() => setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'marked' }))} className={`px-5 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest transition ${questionStatus[currentIndex] === 'marked' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-white/10 text-gray-500'}`}>
                                Mark for Review
                            </button>

                            <div className="flex gap-3">
                                {!isReviewing && selectedOptionId === null && (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition"
                                    >
                                        Skip Question
                                    </button>
                                )}
                                {(selectedOptionId !== null || isReviewing) && (
                                    <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-black text-white shadow-xl flex items-center gap-2 hover:scale-[1.05] transition-transform">
                                        {isLastQuestion ? 'Review Stats' : 'Proceed'} <ArrowRight size={18} />
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
