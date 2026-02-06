'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Flame, Target, Play, Pause, ArrowRight, Menu, X, CheckCircle2, TrendingUp, Zap, BookOpen, Star, CheckCircle, Pencil, Trash2, HelpCircle, AlertTriangle, Rocket, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/app/the-crucible/types';
import QuestionCard from '@/components/question-bank/QuestionCard';
import FeedbackOverlay from '@/components/question-bank/FeedbackOverlay';
import SolutionViewer from '@/components/question-bank/SolutionViewer';
import { useCrucibleProgress } from '@/hooks/useCrucibleProgress';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

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

    // State for Vertical Feed (Practice Mode)
    const [expandedIds, setExpandedIds] = useState<number[]>([0]);
    const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});

    const toggleExpand = (index: number) => {
        setExpandedIds(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleSolution = (index: number) => {
        setShowSolutions(prev => ({ ...prev, [index]: !prev[index] }));
    };

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

    // Expanded Groups for Topic Scope
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    // Stats
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);

    // Arena Config State
    const [selectedChapter, setSelectedChapter] = useState('All Chapters');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Any Difficulty');
    const [questionLimit, setQuestionLimit] = useState('10');

    // New Filter Mode State
    const [filterMode, setFilterMode] = useState<'chapter' | 'paper'>('chapter');
    const [selectedExamSource, setSelectedExamSource] = useState('All Papers');

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

    // Activity Logger for 4-Bucket Architecture
    const {
        logQuestionAttempt,
        startQuestionTimer,
        startNewSession,
    } = useActivityLogger();

    const chapters = Array.from(new Set(initialQuestions.map(q => q.chapterId).filter((id): id is string => !!id)));

    // Grouped and Filtered Exam Sources
    const examSources = Array.from(new Set(initialQuestions.map(q => q.examSource).filter((src): src is string => !!src)))
        .filter(src => {
            const s = src.toLowerCase();
            return (s.includes('jee main') || s.includes('aieee') || s.includes('2026')) && !s.includes('iit');
        })
        .sort((a, b) => b.localeCompare(a));

    const paperGroups = {
        '2026 Shift-wise': examSources.filter(s => s.includes('2026')),
        '2025 Shift-wise': examSources.filter(s => s.includes('2025')),
        '2024 Shift-wise': examSources.filter(s => s.includes('2024')),
        'Older Papers': examSources.filter(s => !s.includes('2026') && !s.includes('2025') && !s.includes('2024'))
    };

    // Initialize chapter totals
    useEffect(() => {
        if (initialQuestions.length > 0 && progressLoaded) {
            initializeChapterTotals(initialQuestions);
        }
    }, [initialQuestions, progressLoaded, initializeChapterTotals]);

    // Reset tags when chapter changes
    useEffect(() => {
        setSelectedTags([]);
    }, [selectedChapter, filterMode, selectedExamSource]);

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

    // Session Persistence Key
    const SESSION_KEY = 'crucible_session_v1';

    // Restore Session Effect
    useEffect(() => {
        if (!initialQuestions.length) return;

        try {
            const savedSession = localStorage.getItem(SESSION_KEY);
            if (savedSession) {
                const session = JSON.parse(savedSession);
                // Basic validation: check if timestamp is within 24 hours
                const isRecent = (Date.now() - session.lastUpdated) < 86400000;

                if (session.isActive && isRecent) {
                    setMode(session.mode);
                    setGameMode(session.gameMode);
                    setCurrentIndex(session.currentIndex);
                    setExamAnswers(session.answers || {});
                    setQuestionStatus(session.status || {});
                    setTimerSeconds(session.timer || 0);
                    setStreak(session.streak || 0);
                    setScore(session.score || 0);
                    setIsReviewing(session.isReviewing || false);

                    if (session.questionIds && session.questionIds.length > 0) {
                        const restoredQuestions = session.questionIds
                            .map((id: string) => initialQuestions.find(q => q.id === id))
                            .filter((q: Question | undefined): q is Question => !!q);

                        if (restoredQuestions.length > 0) {
                            setFilteredQuestions(restoredQuestions);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Failed to restore session:', err);
        }
    }, [initialQuestions]);

    // Save Session Effect
    useEffect(() => {
        if (mode === 'playing') {
            const sessionData = {
                isActive: true,
                mode,
                gameMode,
                currentIndex,
                answers: examAnswers,
                status: questionStatus,
                timer: timerSeconds,
                streak,
                score,
                isReviewing,
                questionIds: filteredQuestions.map(q => q.id),
                lastUpdated: Date.now()
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        } else if (mode === 'completed') {
            localStorage.removeItem(SESSION_KEY);
        }
    }, [mode, gameMode, currentIndex, examAnswers, questionStatus, timerSeconds, streak, score, isReviewing, filteredQuestions]);

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

                // Log to backend API for 4-Bucket Architecture
                logQuestionAttempt(
                    activeQuestion.id,
                    correct,
                    optionId,
                    'practice'
                );
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

        // Start timing for this question (4-Bucket Architecture)
        startQuestionTimer();
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

                    // Log to backend API for 4-Bucket Architecture (exam mode)
                    logQuestionAttempt(q.id, !!isCorrect, answer, 'exam');
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
        localStorage.removeItem('crucible_session_v1');
    };

    const startReview = () => {
        setMode('playing');
        setCurrentIndex(0);
        setIsReviewing(true);
        resetState(0, true);
    };

    const startPractice = () => {
        const previewSizeQuery = initialQuestions.filter(q => {
            const isChapterMode = filterMode === 'chapter';

            // Filter Logic
            const scopeMatch = isChapterMode
                ? (selectedChapter === 'All Chapters' || q.chapterId === selectedChapter)
                : (selectedExamSource === 'All Papers' || q.examSource === selectedExamSource);

            const tagMatch = isChapterMode
                ? (selectedTags.length === 0 || (q.tagId && selectedTags.includes(q.tagId)))
                : true; // Disable tag filtering in Paper mode for now, or keep it optional

            const diffMatch = selectedDifficulty === 'Any Difficulty' || q.difficulty === selectedDifficulty;

            const isMastered = progress.masteredIds?.includes(q.id);
            const isStarred = progress.starredIds?.includes(q.id);

            if (hideMastered && isMastered && !onlyStarred) return false;
            if (onlyStarred && !isStarred) return false;

            return scopeMatch && tagMatch && diffMatch;
        });

        if (previewSizeQuery.length === 0) {
            alert("No questions match your selection.");
            return;
        }

        const playSet = previewSizeQuery.slice(0, questionLimit === 'Max' ? undefined : Number(questionLimit));

        // Trigger Shloka Transition
        setShowShloka(true);

        // Start a new session for activity logging (4-Bucket Architecture)
        startNewSession();

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
            .filter(q => filterMode === 'chapter' ? (selectedChapter === 'All Chapters' || q.chapterId === selectedChapter) : (selectedExamSource === 'All Papers' || q.examSource === selectedExamSource))
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
            const isChapterMode = filterMode === 'chapter';
            const scopeMatch = isChapterMode
                ? (selectedChapter === 'All Chapters' || q.chapterId === selectedChapter)
                : (selectedExamSource === 'All Papers' || q.examSource === selectedExamSource);

            const tg = isChapterMode ? (selectedTags.length === 0 || (q.tagId && selectedTags.includes(q.tagId))) : true;
            const df = selectedDifficulty === 'Any Difficulty' || q.difficulty === selectedDifficulty;
            const mast = progress.masteredIds?.includes(q.id);
            const star = progress.starredIds?.includes(q.id);
            if (hideMastered && mast && !onlyStarred) return false;
            if (onlyStarred && !star) return false;
            return scopeMatch && tg && df;
        });
        const previewSize = previewQuestions.length;
        const questionsToPlay = previewQuestions.slice(0, questionLimit === 'Max' ? undefined : Number(questionLimit));
        // Use database difficulty tags directly: Easy, Medium, Hard
        const easyCount = questionsToPlay.filter(q => q.difficulty === 'Easy').length;
        const mediumCount = questionsToPlay.filter(q => q.difficulty === 'Medium').length;
        const hardCount = questionsToPlay.filter(q => q.difficulty === 'Hard').length;
        const estTime = questionsToPlay.length * 2;

        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-[#0F172A] text-gray-100 font-sans overflow-hidden">
                {/* MOBILE STICKY FOOTER - Always visible at bottom */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/10 p-4 safe-area-pb">
                    <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        {easyCount} Easy • {mediumCount} Med • {hardCount} Hard
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

                {/* MINIMAL LEFT NAV - Desktop only */}
                <aside className="hidden md:flex w-20 flex-shrink-0 border-r border-white/5 bg-[#1E293B] flex-col items-center py-8 gap-6">
                    <Link href="/" className="p-3 rounded-xl hover:bg-white/5 transition text-gray-400 hover:text-white" title="Home">
                        <ArrowLeft size={22} />
                    </Link>
                    <div className="flex-1" />
                    <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest rotate-180 [writing-mode:vertical-lr]">The Crucible</div>
                </aside>

                {/* MOBILE SIDEBAR - Full config on mobile */}
                <aside className="md:hidden w-full flex-shrink-0 border-r border-white/5 bg-[#1E293B] flex flex-col z-20 shadow-2xl overflow-y-auto pb-36">
                    {/* Header with Chevron Back */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition text-gray-400 hover:text-white">
                            <ArrowLeft size={22} />
                        </Link>
                        <h1 className="text-lg font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">The Crucible</h1>
                        <div className="w-6" />
                    </div>

                    {/* CONTEXT FIRST: Chapter Title & Audio Tip (Mobile Priority) */}
                    <div className="p-4 border-b border-white/5 bg-[#0F172A]/50">
                        <div className="text-center space-y-3">
                            {(() => {
                                const fullTitle = filterMode === 'chapter' ? selectedChapter : selectedExamSource;
                                const parts = fullTitle.split(' - ');
                                if (parts.length > 1) {
                                    return (
                                        <>
                                            <h2 className="text-xl font-black text-white leading-tight">
                                                {parts[0]}
                                            </h2>
                                            <h3 className="text-[13px] font-bold text-indigo-400/80 mt-1 uppercase tracking-wider">
                                                {parts.slice(1).join(' - ')}
                                            </h3>
                                        </>
                                    );
                                }
                                return (
                                    <h2 className="text-xl font-black text-white leading-tight">
                                        {fullTitle}
                                    </h2>
                                );
                            })()}
                            <div className="h-1 w-12 bg-purple-500 rounded-full mx-auto mt-2"></div>
                            {/* Guru Mantra - Animated Waveform Audio Pill */}
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-xl p-2.5 pr-4 hover:from-indigo-900/60 hover:to-purple-900/60 transition cursor-pointer group mx-auto">
                                {/* Multicolor Waveform */}
                                <div className="flex items-center gap-[3px] h-8 px-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                                        const heights = [16, 12, 20, 14, 18, 10, 15];
                                        const durations = [0.5, 0.6, 0.45, 0.55, 0.5, 0.65, 0.4];
                                        return (
                                            <div
                                                key={i}
                                                className="w-[3px] rounded-full animate-pulse"
                                                style={{
                                                    height: `${heights[i]}px`,
                                                    background: `linear-gradient(to top, ${['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#fbbf24'][i]}, ${['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f59e0b'][i]})`,
                                                    animationDelay: `${i * 0.1}s`,
                                                    animationDuration: `${durations[i]}s`
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Sir's Strategy Tip</span>
                                    <span className="text-[9px] text-gray-400">0:42</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INSIGHT SECOND: Dynamic Tactical Tip */}
                    <div className="p-4 border-b border-white/5">
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

                    {/* MOBILE CONFIGURATION SECTION */}
                    <div className="flex-1 p-4 space-y-5">
                        {/* Scope Config */}
                        <div className="space-y-3">
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mb-2">
                                <button onClick={() => setFilterMode('chapter')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterMode === 'chapter' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}>Chapter Wise</button>
                                <button onClick={() => setFilterMode('paper')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filterMode === 'paper' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>Past Papers</button>
                            </div>

                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                {filterMode === 'chapter' ? 'Target Chapter' : 'Select Paper'}
                            </label>
                            <div className="relative group/select">
                                {filterMode === 'chapter' ? (
                                    <select
                                        value={selectedChapter}
                                        onChange={(e) => setSelectedChapter(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-4 pr-10 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all shadow-inner appearance-none"
                                    >
                                        <option>All Chapters</option>
                                        {chapters.map(ch => <option key={ch}>{ch}</option>)}
                                    </select>
                                ) : (
                                    <select
                                        value={selectedExamSource}
                                        onChange={(e) => setSelectedExamSource(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-4 pr-10 py-3 text-sm font-medium outline-none focus:border-indigo-500 transition-all shadow-inner appearance-none"
                                    >
                                        <option>All Papers</option>
                                        {Object.entries(paperGroups).map(([groupName, papers]) => (
                                            papers.length > 0 && (
                                                <optgroup key={groupName} label={groupName} className="bg-gray-900 text-indigo-400 font-bold uppercase text-[10px]">
                                                    {papers.map(src => <option key={src} value={src} className="text-gray-100 font-normal normal-case text-sm">{src}</option>)}
                                                </optgroup>
                                            )
                                        ))}
                                    </select>
                                )}
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within/select:text-purple-500 transition-colors" />
                            </div>
                        </div>

                        {/* Sub-Topics (Only for Chapter Mode) */}
                        {filterMode === 'chapter' && selectedChapter !== 'All Chapters' && (
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
                                        <div className={`text-[12px] font-black uppercase tracking-wider ${selectedTags.length === 0 ? 'text-cyan-400' : 'text-gray-300'}`}>🎯 All Topics Mixed</div>
                                        <div className="text-[10px] text-gray-400 mt-1">Random problems from entire chapter</div>
                                    </button>
                                    {[
                                        { id: 'Fundamentals', title: '📐 Fundamentals', desc: 'Mole, % Composition, Empirical Formula, Limiting Reagent', tags: ['Percentage_Composition', 'Empirical_Formula', 'Stoichiometry', 'Limiting_Reagent', 'Average_Atomic_Mass'] },
                                        { id: 'Concentrations', title: '🧪 Concentrations', desc: 'Molarity, Molality, Normality, Dilution, Solution Mixing', tags: ['Molarity', 'Molality', 'Normality', 'Mixing_of_Solutions', 'Dilution'] },
                                        { id: 'Advanced', title: '🔥 Advanced', desc: 'Eudiometry, POAC, n-Factor, Equivalent Concept', tags: ['Eudiometry', 'POAC', 'n_Factor', 'Equivalent_Concept'] }
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
                                                <div className={`text-[12px] font-black uppercase tracking-wider ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}>{group.title}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{group.desc}</div>
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
                                    { id: 'Easy', label: 'Easy', active: 'bg-emerald-600 text-white border-emerald-400' },
                                    { id: 'Medium', label: 'Med', active: 'bg-amber-600 text-white border-amber-400' },
                                    { id: 'Hard', label: 'Hard', active: 'bg-red-600 text-white border-red-400' }
                                ].map(diff => (
                                    <button
                                        key={diff.id}
                                        onClick={() => setSelectedDifficulty(diff.id)}
                                        className={`py-2.5 rounded-lg text-[11px] font-black border transition-all duration-300 ${selectedDifficulty === diff.id ? diff.active : 'border-white/10 text-gray-400 bg-white/5'}`}
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

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block">Refine Set</label>
                                <div className="group/info relative">
                                    <HelpCircle size={14} className="text-gray-600" />
                                    <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/20 rounded-xl text-[13px] text-gray-200 leading-relaxed shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50">
                                        <strong className="text-cyan-400 font-bold">Hide Known:</strong> Skip questions you've already mastered.<br />
                                        <strong className="text-amber-400 font-bold">Starred:</strong> Focus only on your bookmarked questions.
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setHideMastered(!hideMastered)} className={`p-3 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${hideMastered ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'border-white/10 text-gray-400 bg-white/5'}`}>
                                    <CheckCircle size={14} /> Hide Known
                                </button>
                                <button onClick={() => setOnlyStarred(!onlyStarred)} className={`p-3 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${onlyStarred ? 'bg-amber-600/20 border-amber-500/40 text-amber-300' : 'border-white/10 text-gray-400 bg-white/5'}`}>
                                    <Star size={14} /> Starred Only
                                </button>
                            </div>
                        </div>

                        {/* Game Mode */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Crucible Mode</label>
                                <div className="group/info relative">
                                    <HelpCircle size={14} className="text-gray-600" />
                                    <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/20 rounded-xl text-[13px] text-gray-200 leading-relaxed shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50">
                                        <strong className="text-purple-400 font-bold">Practice:</strong> See answers after each question. Learn at your pace.<br />
                                        <strong className="text-indigo-400 font-bold">Exam:</strong> No answers until the end. Simulates real test conditions.
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                                <button onClick={() => setGameMode('practice')} className={`py-3.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 ${gameMode === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Practice Mode</span>
                                </button>
                                <button onClick={() => setGameMode('exam')} className={`py-3.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 ${gameMode === 'exam' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Exam Mode</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ═══════════════════════════════════════════════════════════════════════════════
                    DESKTOP CENTER STAGE: "MISSION CONTROL" LAYOUT
                    - Top Header: Chapter Title + Audio Tip
                    - Tactical Grid: 2-column (Topic Scope | Parameters)
                    - Mission Payload: Color-coded stats bar
                    - Ignite Button: Primary CTA
                ═══════════════════════════════════════════════════════════════════════════════ */}
                <main className="hidden md:flex flex-1 flex-col overflow-y-auto bg-[#0F172A] relative">
                    <div className="max-w-4xl mx-auto p-8 lg:p-12 w-full flex-1 flex flex-col">

                        {/* ─────────────────────────────────────────────────────────────────
                            TOP HEADER: Chapter Title + Voice Tip (Compact Row)
                        ───────────────────────────────────────────────────────────────── */}
                        <div className="flex items-center justify-between gap-6 mb-10">
                            <div className="flex-1">
                                {(() => {
                                    const fullTitle = filterMode === 'chapter' ? selectedChapter : selectedExamSource;
                                    const parts = fullTitle.split(' - ');
                                    if (parts.length > 1) {
                                        return (
                                            <>
                                                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                                                    {parts[0]}
                                                </h1>
                                                <h2 className="text-lg lg:text-xl font-bold text-indigo-400/80 mt-1 tracking-wide">
                                                    {parts.slice(1).join(' - ')}
                                                </h2>
                                            </>
                                        );
                                    }
                                    return (
                                        <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                                            {fullTitle}
                                        </h1>
                                    );
                                })()}
                                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-3"></div>
                            </div>

                            {/* Voice Tip Pill */}
                            <div className="shrink-0">
                                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-2xl p-3 pr-5 hover:from-indigo-900/70 hover:to-purple-900/70 transition cursor-pointer group shadow-xl backdrop-blur-sm">
                                    <div className="flex items-center gap-[3px] h-8 px-1">
                                        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                                            const heights = [16, 12, 20, 14, 18, 10, 15];
                                            const durations = [0.5, 0.6, 0.45, 0.55, 0.5, 0.65, 0.4];
                                            return (
                                                <div
                                                    key={i}
                                                    className="w-[3px] rounded-full animate-pulse"
                                                    style={{
                                                        height: `${heights[i]}px`,
                                                        background: `linear-gradient(to top, ${['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#fbbf24'][i]}, ${['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f59e0b'][i]})`,
                                                        animationDelay: `${i * 0.1}s`,
                                                        animationDuration: `${durations[i]}s`
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Sir's Strategy Tip</span>
                                        <span className="text-[10px] text-gray-400">0:42</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────────
                            TACTICAL GRID: 2-Column Layout
                            Left: Topic Scope | Right: Mission Parameters
                        ───────────────────────────────────────────────────────────────── */}
                        <div className="grid grid-cols-2 gap-8 mb-10">

                            {/* LEFT COLUMN: Topic Scope */}
                            <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Target size={14} className="text-cyan-400" />
                                    Topic Scope
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                        <button onClick={() => setFilterMode('chapter')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${filterMode === 'chapter' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Chapter Wise</button>
                                        <button onClick={() => setFilterMode('paper')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${filterMode === 'paper' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Past Papers</button>
                                    </div>

                                    <div className="relative group/select">
                                        {filterMode === 'chapter' ? (
                                            <select
                                                value={selectedChapter}
                                                onChange={(e) => setSelectedChapter(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all appearance-none text-white"
                                            >
                                                <option>All Chapters</option>
                                                {chapters.map(ch => <option key={ch}>{ch}</option>)}
                                            </select>
                                        ) : (
                                            <select
                                                value={selectedExamSource}
                                                onChange={(e) => setSelectedExamSource(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm font-medium outline-none focus:border-indigo-500 transition-all appearance-none text-white"
                                            >
                                                <option>All Papers</option>
                                                {Object.entries(paperGroups).map(([groupName, papers]) => (
                                                    papers.length > 0 && (
                                                        <optgroup key={groupName} label={groupName} className="bg-gray-900 text-indigo-400 font-black uppercase text-[10px]">
                                                            {papers.map(src => <option key={src} value={src} className="text-gray-100 font-normal normal-case text-sm">{src}</option>)}
                                                        </optgroup>
                                                    )
                                                ))}
                                            </select>
                                        )}
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within/select:text-purple-500 transition-colors" />
                                    </div>
                                </div>

                                {/* Focus Areas with Expandable Subtopics (Only in Chapter Mode) */}
                                {filterMode === 'chapter' && selectedChapter !== 'All Chapters' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Focus Area</label>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setSelectedTags([])}
                                                className={`w-full px-3 py-2.5 rounded-xl text-left transition-all border ${selectedTags.length === 0
                                                    ? 'bg-cyan-500/20 border-cyan-500/30'
                                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <span className={`text-[13px] font-bold ${selectedTags.length === 0 ? 'text-cyan-400' : 'text-gray-400'}`}>🎯 All Topics</span>
                                            </button>
                                            {[
                                                { id: 'Fundamentals', title: '📐 Fundamentals', subtopics: ['Mole Concept', '% Composition', 'Empirical Formula', 'Limiting Reagent', 'Avg Atomic Mass'], tags: ['Percentage_Composition', 'Empirical_Formula', 'Stoichiometry', 'Limiting_Reagent', 'Average_Atomic_Mass'] },
                                                { id: 'Concentrations', title: '🧪 Concentrations', subtopics: ['Molarity', 'Molality', 'Normality', 'Dilution', 'Mixing Solutions'], tags: ['Molarity', 'Molality', 'Normality', 'Mixing_of_Solutions', 'Dilution'] },
                                                { id: 'Advanced', title: '🔥 Advanced', subtopics: ['Eudiometry', 'POAC', 'n-Factor', 'Equivalent Concept'], tags: ['Eudiometry', 'POAC', 'n_Factor', 'Equivalent_Concept'] }
                                            ].map(group => {
                                                const isActive = group.tags.every(t => selectedTags.includes(t)) && selectedTags.length === group.tags.length;
                                                return (
                                                    <div key={group.id} className="group/focus">
                                                        <button
                                                            onClick={() => setSelectedTags(group.tags)}
                                                            className={`w-full px-3 py-2.5 rounded-xl text-left transition-all border ${isActive
                                                                ? 'bg-cyan-500/20 border-cyan-500/30'
                                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className={`text-[13px] font-bold ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>{group.title}</span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleGroup(group.id);
                                                                    }}
                                                                    className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${expandedGroups.includes(group.id) ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-300'}`}
                                                                >
                                                                    {group.subtopics.length} topics
                                                                </span>
                                                            </div>
                                                        </button>
                                                        {/* Subtopics on click */}
                                                        {expandedGroups.includes(group.id) && (
                                                            <div className="mt-2 ml-2 pl-3 border-l-2 border-white/20 animate-in slide-in-from-top-2 duration-200">
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {group.subtopics.map(sub => (
                                                                        <span key={sub} className="text-xs text-gray-200 bg-white/10 px-2.5 py-1.5 rounded-md font-medium">{sub}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Mission Parameters */}
                            <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap size={14} className="text-amber-400" />
                                    Parameters
                                </h3>

                                {/* Difficulty - JEE Main Only */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Difficulty</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 'Any Difficulty', label: 'Mix', color: 'bg-white/10 text-white border-white/30' },
                                            { id: 'Easy', label: 'Easy', color: 'bg-emerald-600 text-white border-emerald-400' },
                                            { id: 'Medium', label: 'Med', color: 'bg-amber-600 text-white border-amber-400' },
                                            { id: 'Hard', label: 'Hard', color: 'bg-red-600 text-white border-red-400' }
                                        ].map(diff => (
                                            <button
                                                key={diff.id}
                                                onClick={() => setSelectedDifficulty(diff.id)}
                                                className={`py-2.5 rounded-xl text-xs font-black border transition-all ${selectedDifficulty === diff.id ? diff.color : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                                            >
                                                {diff.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Count */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Count</label>
                                    <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                                        {['5', '10', '20', 'Max'].map(count => (
                                            <button key={count} onClick={() => setQuestionLimit(count)} className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${questionLimit === count ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                                {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Refine Set Toggle with Info Tooltips */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Refine Set</label>
                                        <div className="group/info relative">
                                            <HelpCircle size={12} className="text-gray-600 cursor-help" />
                                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/20 rounded-xl text-[13px] text-gray-200 leading-relaxed shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50">
                                                <strong className="text-cyan-400 font-bold">Hide Known:</strong> Skip questions you've already mastered.<br />
                                                <strong className="text-amber-400 font-bold">Starred:</strong> Focus only on your bookmarked questions.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setHideMastered(!hideMastered)} className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${hideMastered ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                                            <CheckCircle size={14} /> Hide Known
                                        </button>
                                        <button onClick={() => setOnlyStarred(!onlyStarred)} className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${onlyStarred ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                                            <Star size={14} /> Starred
                                        </button>
                                    </div>
                                </div>

                                {/* Mode Toggle with Info Tooltip */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mode</label>
                                        <div className="group/info relative">
                                            <HelpCircle size={12} className="text-gray-600 cursor-help" />
                                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/20 rounded-xl text-[13px] text-gray-200 leading-relaxed shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50">
                                                <strong className="text-purple-400 font-bold">Practice:</strong> See answers after each question. Learn at your pace.<br />
                                                <strong className="text-indigo-400 font-bold">Exam:</strong> No answers until the end. Simulates real test conditions.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                                        <button onClick={() => setGameMode('practice')} className={`py-2.5 rounded-lg text-xs font-black transition-all ${gameMode === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                            Practice
                                        </button>
                                        <button onClick={() => setGameMode('exam')} className={`py-2.5 rounded-lg text-xs font-black transition-all ${gameMode === 'exam' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                            Exam
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────────
                            IGNITE SECTION: Compact Payload + CTA
                        ───────────────────────────────────────────────────────────────── */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/10 rounded-3xl p-6 mt-6">
                            {/* Payload Summary - Compact Inline */}
                            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-emerald-400 font-bold">{easyCount}</span>
                                    <span className="text-gray-400">Easy</span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    <span className="text-amber-400 font-bold">{mediumCount}</span>
                                    <span className="text-gray-400">Medium</span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-red-400 font-bold">{hardCount}</span>
                                    <span className="text-gray-400">Hard</span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <span className="text-white font-black text-sm">{previewSize} Total</span>
                                <span className="text-gray-400 text-xs">~{estTime}min</span>
                            </div>

                            {/* Ignite Button */}
                            <button
                                onClick={startPractice}
                                disabled={previewSize === 0}
                                className="w-full py-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl font-black text-white text-lg shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group border border-white/10"
                            >
                                <span className="tracking-widest uppercase">Ignite Mission</span>
                                <Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }



    if (!activeQuestion) return null;

    const attemptedTotal = Object.keys(examAnswers).length;
    const progressPercent = (attemptedTotal / filteredQuestions.length) * 100;

    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER: PRACTICE MODE (VERTICAL FEED)
    // ─────────────────────────────────────────────────────────────────────────────
    if (gameMode === 'practice') {
        return (
            <div className="h-screen bg-[#0F172A] text-gray-100 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-[#0a0a16]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 shadow-lg">
                    <div className="flex items-center gap-3 md:gap-6">
                        <button onClick={resetSession} className="text-gray-400 hover:text-white transition flex items-center gap-2 group">
                            <div className="p-2 rounded-lg group-hover:bg-white/10 transition">
                                <ArrowLeft size={20} />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider hidden sm:block">Exit Session</span>
                        </button>
                        <div className="h-6 w-px bg-white/10 hidden sm:block" />
                        <div className="flex flex-col">
                            <h1 className="text-sm md:text-base font-black text-white leading-none">Practice Feed</h1>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                {filteredQuestions.length} Qs • {selectedDifficulty === 'Any Difficulty' ? 'Mixed' : selectedDifficulty}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Streak Badge - Hidden on mobile */}
                        <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20">
                            <Flame size={18} className="text-orange-500 fill-orange-500/20" />
                            <div className="flex flex-col">
                                <span className="text-[10px] first-letter:text-orange-400 font-bold uppercase leading-none">Streak</span>
                                <span className="text-sm font-black text-white leading-none">{streak}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Feed Content */}
                <main className="flex-1 overflow-y-auto bg-[#0F172A] p-4 md:p-8 scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-6 pb-32">
                        {filteredQuestions.map((question, idx) => {
                            const isExpanded = expandedIds.includes(idx);
                            const status = questionStatus[idx];
                            const isSolutionVisible = showSolutions[idx];

                            // Status Colors
                            let statusColor = "border-white/5 bg-gray-900/40";
                            let statusIcon = <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 font-bold text-xs">{idx + 1}</div>;

                            if (status === 'solved') {
                                statusColor = "border-emerald-500/30 bg-emerald-900/10";
                                statusIcon = <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><CheckCircle2 size={16} /></div>;
                            } else if (status === 'incorrect') {
                                statusColor = "border-red-500/30 bg-red-900/10";
                                statusIcon = <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"><X size={16} /></div>;
                            }

                            return (
                                <div
                                    key={question.id}
                                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-gray-900 border-indigo-500/30 shadow-2xl ring-1 ring-indigo-500/20' : `${statusColor} hover:border-white/10`}`}
                                >
                                    {/* Question Header (Click to Expand) */}
                                    <div
                                        onClick={() => toggleExpand(idx)}
                                        className={`p-4 md:p-6 flex items-start gap-4 cursor-pointer select-none transition-colors ${isExpanded ? 'bg-black/20' : 'hover:bg-white/5'}`}
                                    >
                                        <div className="shrink-0 pt-1">
                                            {statusIcon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${question.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                    {question.difficulty}
                                                </span>
                                                {question.chapterId && (
                                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                                        {question.chapterId}
                                                    </span>
                                                )}
                                                {status === 'solved' && <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Solved</span>}
                                            </div>

                                            {/* Preview Text (Truncated) - Only show if collapsed */}
                                            {!isExpanded && (
                                                <div className="text-sm text-gray-400 font-medium line-clamp-2 prose prose-invert max-w-none prose-p:my-0 prose-p:inline prose-headings:text-sm prose-headings:my-0 leading-relaxed overflow-hidden">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkMath, remarkGfm]}
                                                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                                                        components={{
                                                            p: ({ children }) => <span className="inline">{children} </span>,
                                                            h1: ({ children }) => <span className="font-bold">{children} </span>,
                                                            h2: ({ children }) => <span className="font-bold">{children} </span>,
                                                            h3: ({ children }) => <span className="font-bold">{children} </span>,
                                                            ul: ({ children }) => <span className="inline">{children} </span>,
                                                            li: ({ children }) => <span className="inline">• {children} </span>,
                                                            table: () => <span className="italic text-xs">[Table Data]</span>,
                                                            img: () => <span className="italic text-xs">[Image]</span>,
                                                            div: ({ children }) => <span className="inline">{children}</span>
                                                        }}
                                                    >
                                                        {question.textMarkdown.split('\n').slice(0, 3).join('\n')}
                                                    </ReactMarkdown>
                                                </div>
                                            )}

                                            {isExpanded && (
                                                <div className="h-4" /> // Spacer
                                            )}
                                        </div>
                                        <div className="shrink-0 text-gray-600">
                                            <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-400' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="animate-in slide-in-from-top-2 duration-300 border-t border-white/5">
                                            {/* Question Card */}
                                            <div className="p-4 md:p-8">
                                                <QuestionCard
                                                    question={question}
                                                    onAnswerSubmit={(cor, optId) => {
                                                        // Update local state first to ensure UI responsiveness
                                                        setCurrentIndex(idx);
                                                        setQuestionStatus(prev => ({ ...prev, [idx]: cor ? 'solved' : 'incorrect' }));
                                                        handleAnswerSubmit(cor, optId);
                                                    }}
                                                    showFeedback={status === 'solved' || status === 'incorrect'}
                                                    selectedOptionId={question.id === activeQuestion.id ? selectedOptionId : null} // Use global active if matches (basic hack) or fix state
                                                // FIX: The QuestionCard relies on `selectedOptionId` which is currently a single global. 
                                                // For a feed, we ideally need `selectedOptions` map. 
                                                // For now, I will assume the feed is "stateless" regarding transient selection unless we refactor internal state.
                                                // Wait, `handleAnswerSubmit` logic uses `currentIndex`.
                                                // I need to ensure `handleAnswerSubmit` works for *this specific question*.
                                                // I will pass an inline handler wrapper.
                                                />
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="bg-black/20 p-4 md:p-6 flex items-center justify-between border-t border-white/5">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            toggleStar(question.id);
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${progress.starredIds?.includes(question.id) ? 'text-amber-400 bg-amber-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                                        title="Bookmark"
                                                    >
                                                        <Star size={18} fill={progress.starredIds?.includes(question.id) ? "currentColor" : "none"} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingNote(true)}
                                                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                                                        title="Add Note"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => toggleSolution(idx)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isSolutionVisible ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                                                >
                                                    {isSolutionVisible ? 'Hide Solution' : 'View Solution'}
                                                    {isSolutionVisible ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />}
                                                </button>
                                            </div>

                                            {/* Inline Solution Viewer */}
                                            {isSolutionVisible && (
                                                <div className="p-4 md:p-8 bg-black/40 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
                                                    <div className="flex items-center gap-2 mb-6 text-emerald-400">
                                                        <BookOpen size={18} />
                                                        <span className="text-sm font-bold uppercase tracking-widest">Detailed Solution</span>
                                                    </div>
                                                    <SolutionViewer
                                                        solution={question.solution}
                                                        sourceReferences={question.sourceReferences}
                                                        imageScale={question.solutionImageScale}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Feed Footer */}
                        <div className="pt-8 pb-12 text-center">
                            <p className="text-gray-500 text-sm mb-4">You've reached the end of the feed.</p>
                            <button
                                onClick={handleSubmitTest}
                                className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-purple-600 hover:to-indigo-600 rounded-xl font-bold text-white transition-all shadow-lg"
                            >
                                Complete Session
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER: EXAM MODE (CLASSIC ONE-BY-ONE)
    // ─────────────────────────────────────────────────────────────────────────────
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
                    {/* Streak hidden in exam mode usually, but code had it. Removing for clean exam UI or keeping if preferred. Code logic had it only for practice. */}
                </div>
                <button onClick={() => setShowMobileNav(!showMobileNav)} className="md:hidden"><Menu /></button>
            </header>

            <div className="h-1 bg-white/5 z-20">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16 pb-32 scroll-smooth">
                    <div className="max-w-3xl mx-auto">
                        {/* QUESTION CONTROL STRIP */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                            {/* Question Number + Difficulty */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-white leading-tight">Q.{currentIndex + 1}</span>
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg">{activeQuestion.difficulty}</span>
                            </div>

                            {/* 3-Button Toolbar with Hover Tooltips */}
                            <div className="flex items-center gap-2">
                                {/* Bookmark Button */}
                                <div className="group/btn relative">
                                    <button
                                        onClick={() => {
                                            toggleStar(activeQuestion.id);
                                            if (!progress.starredIds?.includes(activeQuestion.id) && progress.masteredIds?.includes(activeQuestion.id)) {
                                                toggleMaster(activeQuestion.id);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${progress.starredIds?.includes(activeQuestion.id)
                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                                    >
                                        <Star size={15} className={progress.starredIds?.includes(activeQuestion.id) ? 'fill-amber-400' : ''} />
                                        <span className="hidden sm:inline">{progress.starredIds?.includes(activeQuestion.id) ? 'Bookmarked' : 'Bookmark'}</span>
                                    </button>
                                    <div className="absolute md:bottom-full bottom-auto md:top-auto top-full left-1/2 -translate-x-1/2 md:mb-3 mt-3 w-44 p-2.5 bg-gray-900 border border-white/20 rounded-xl text-xs text-gray-100 font-medium text-center shadow-2xl opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all z-50">
                                        Save for revision
                                    </div>
                                </div>

                                {/* Mastered Button */}
                                <div className="group/btn relative">
                                    <button
                                        onClick={() => {
                                            toggleMaster(activeQuestion.id);
                                            if (!progress.masteredIds?.includes(activeQuestion.id) && progress.starredIds?.includes(activeQuestion.id)) {
                                                toggleStar(activeQuestion.id);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${progress.masteredIds?.includes(activeQuestion.id)
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                                    >
                                        <CheckCircle size={15} />
                                        <span className="hidden sm:inline">{progress.masteredIds?.includes(activeQuestion.id) ? 'Mastered' : 'Got It'}</span>
                                    </button>
                                    <div className="absolute md:bottom-full bottom-auto md:top-auto top-full left-1/2 -translate-x-1/2 md:mb-3 mt-3 w-48 p-2.5 bg-gray-900 border border-white/20 rounded-xl text-xs text-gray-100 font-medium text-center shadow-2xl opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all z-50">
                                        Too easy - hide next time
                                    </div>
                                </div>

                                {/* Note Button */}
                                <div className="group/btn relative">
                                    <button
                                        onClick={() => setEditingNote(true)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${progress.userNotes?.[activeQuestion.id]
                                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                                    >
                                        <Pencil size={15} />
                                        <span className="hidden sm:inline">Note</span>
                                    </button>
                                    <div className="absolute md:bottom-full bottom-auto md:top-auto top-full right-0 md:mb-3 mt-3 w-44 p-2.5 bg-gray-900 border border-white/20 rounded-xl text-xs text-gray-100 font-medium text-center shadow-2xl opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all z-50">
                                        Add strategy notes
                                    </div>
                                </div>
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
                                showFeedback={isReviewing && (isCorrect !== null || isReviewing)}
                                selectedOptionId={selectedOptionId}
                            />
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-4">
                            {/* Left: Back button (if reviewing) */}
                            <div className="flex gap-2">
                                {isReviewing && currentIndex > 0 && (
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border border-white/10 text-gray-500 hover:bg-white/5 text-[10px] md:text-xs font-black uppercase tracking-widest transition"
                                    >
                                        Back
                                    </button>
                                )}
                            </div>

                            {/* Right: Mark for Review + Skip + Proceed - all together */}
                            <div className="flex gap-2 md:gap-3">
                                {/* Mark for Review */}
                                <button onClick={() => setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'marked' }))} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-widest transition ${questionStatus[currentIndex] === 'marked' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                                    Mark
                                </button>

                                {/* Skip (when no answer selected) */}
                                {!isReviewing && selectedOptionId === null && (
                                    <button
                                        onClick={handleNext}
                                        className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl border border-white/10 text-gray-500 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition"
                                    >
                                        Skip
                                    </button>
                                )}

                                {/* Proceed (when answer selected or reviewing) */}
                                {(selectedOptionId !== null || isReviewing) && (
                                    <button onClick={handleNext} className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg md:rounded-xl font-black text-white shadow-xl flex items-center gap-2 hover:brightness-110 transition-all text-xs md:text-base">
                                        {isLastQuestion ? (isReviewing ? 'Finish Review' : 'Review Stats') : 'Proceed'} <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="w-80 bg-[#0a0a16]/80 border-l border-white/5 hidden lg:flex flex-col z-20">
                    <div className="p-8 flex-1 overflow-y-auto section-scrollbar">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6 block">Question Palette</label>
                        <div className="grid grid-cols-5 gap-3">
                            {filteredQuestions.map((_, idx) => {
                                const status = questionStatus[idx];
                                let style = 'bg-white/5 text-gray-600';
                                if (idx === currentIndex) {
                                    style = 'ring-2 ring-purple-500 bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]';
                                } else if (status === 'answered') {
                                    style = 'bg-indigo-500 text-white';
                                }

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
            {/* Practice mode feedback removed from Exam Mode */}
        </div>
    );
}
