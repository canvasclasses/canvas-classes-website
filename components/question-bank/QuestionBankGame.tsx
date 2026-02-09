'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Flame, Target, Play, Pause, ArrowRight, Menu, X, CheckCircle2, TrendingUp, Zap, BookOpen, Star, CheckCircle, Pencil, Trash2, HelpCircle, AlertTriangle, Rocket, ChevronDown, Code } from 'lucide-react';
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
import FocusDashboard from './FocusDashboard';


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

    const {
        recordAttemptWithSR,
        getDueQuestions
    } = useCrucibleProgress();

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

        // Mark as answered locally
        setSelectedOptionId(optionId);
        setIsCorrect(correct);
        setQuestionStatus(prev => ({ ...prev, [currentIndex]: correct ? 'solved' : 'incorrect' }));

        if (gameMode === 'exam') {
            // In exam mode, we don't show immediate feedback or do SR
            return;
        }

        // Practice Mode Logic
        if (activeQuestion) {
            // We DON'T record attempt immediately for SR in practice mode
            // We wait for the quality rating (Again/Hard/Good/Easy)

            // Log to backend API for analytics (still do this)
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
    };

    const handleSRSubmit = (quality: 1 | 2 | 3 | 4) => {
        if (!activeQuestion) return;

        const correct = isCorrect === true; // Should be true if they are rating it, but handle edge cases

        recordAttemptWithSR(
            activeQuestion.id,
            activeQuestion.chapterId || 'Unknown',
            activeQuestion.difficulty,
            correct,
            quality
        );

        // Move to next question after short delay
        setTimeout(() => {
            handleNext();
            // Reset state for next Q
            setSelectedOptionId(null);
            setIsCorrect(null);
        }, 300);
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

    // Focus Flow Dashboard Integration
    if (mode === 'menu') {
        return (
            <FocusDashboard
                initialQuestions={initialQuestions}
                onStart={(config) => {
                    // Filter Logic
                    let filtered = [...initialQuestions];

                    // 1. Filter by Scope
                    if (config.filterType === 'chapter') {
                        filtered = filtered.filter(q => config.selectedScope.includes(q.chapterId));
                    } else if (config.filterType === 'pyq') {
                        filtered = filtered.filter(q => config.selectedScope.includes(q.examSource));
                    }

                    // 2. Filter by Difficulty
                    if (config.difficulty !== 'Mix') {
                        filtered = filtered.filter(q => q.difficulty === config.difficulty);
                    }

                    // 3. Limit & Shuffle
                    let playSet = shuffleArray(filtered);

                    if (config.selectionTier === 'high-yield') {
                        playSet = playSet.filter(q => q.isTopPYQ);
                    }

                    // Apply count limit
                    playSet = playSet.slice(0, config.questionCount === 'Max' ? filtered.length : Number(config.questionCount));

                    if (playSet.length === 0) {
                        alert("No questions found.");
                        return;
                    }

                    setFilteredQuestions(playSet);
                    setMode('playing');
                    setGameMode(config.mode); // 'practice' or 'exam'
                    setCurrentIndex(0);
                    setQuestionStatus({});
                    setTimerSeconds(0);

                    if (config.mode === 'exam') {
                        setTimerActive(true);
                    } else {
                        setTimerActive(false);
                    }
                }}
            />
        );
    }
    if (!activeQuestion) return null;

    const attemptedTotal = Object.keys(examAnswers).length;
    const progressPercent = (attemptedTotal / filteredQuestions.length) * 100;

    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER: PRACTICE MODE (MASTER-DETAIL LAYOUT)
    // ─────────────────────────────────────────────────────────────────────────────
    if (gameMode === 'practice') {
        const soothingDark = "bg-[#0B1120]";
        const cardBg = "bg-[#151E32]";
        const activeCardBg = "bg-[#1E293B]";

        return (
            <div className={`h-screen ${soothingDark} text-slate-200 flex flex-col overflow-hidden font-sans`}>
                {/* Header */}
                <header className="h-16 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm transition-all">
                    <div className="flex items-center gap-6">
                        <button onClick={resetSession} className="text-slate-400 hover:text-white transition flex items-center gap-2 group">
                            <div className="p-2 rounded-lg group-hover:bg-white/5 transition">
                                <ArrowLeft size={20} />
                            </div>
                            <span className="text-sm font-semibold uppercase tracking-wide hidden sm:block">Exit</span>
                        </button>
                        <div className="h-5 w-px bg-white/10 hidden sm:block" />
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold text-slate-100 leading-none">Practice Session</h1>
                            <span className="text-[11px] font-medium text-slate-500 mt-1">
                                {filteredQuestions.length} Questions • {selectedDifficulty}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-orange-900/20 px-4 py-1.5 rounded-full border border-orange-500/10">
                            <Flame size={16} className="text-orange-400/80 fill-orange-500/10" />
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-orange-200">{streak}</span>
                                <span className="text-[10px] text-orange-400/60 uppercase tracking-widest font-semibold">Streak</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Master-Detail Content */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* LEFT PANEL: Question List (60% Desktop, 100% Mobile) */}
                    <div className="w-full lg:w-[60%] h-full overflow-y-auto p-4 md:p-6 pb-32 scroll-smooth border-r border-white/5">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {filteredQuestions.map((question, idx) => {
                                const isActive = idx === currentIndex;
                                const status = questionStatus[idx];
                                const isExpanded = expandedIds.includes(idx); // Only relevant for mobile default

                                // Dynamic Styling
                                let borderClass = "border-transparent";
                                if (isActive) borderClass = "border-indigo-500 ring-1 ring-indigo-500/20 bg-[#1E293B]";
                                else borderClass = "border-transparent hover:border-slate-700";

                                let statusIcon = <span className="text-slate-500 font-bold text-sm">Q{idx + 1}</span>;
                                if (status === 'solved') statusIcon = <CheckCircle2 size={18} className="text-emerald-400" />;
                                else if (status === 'incorrect') statusIcon = <X size={18} className="text-red-400" />;

                                return (
                                    <div
                                        key={question.id}
                                        id={`question-card-${idx}`}
                                        onClick={() => {
                                            setCurrentIndex(idx);
                                            setSelectedOptionId(null); // Reset selection to avoid pre-selected bug
                                            // On Mobile: Toggle expand logic if needed, or unify. 
                                            // For this Layout, clicking sets 'currentIndex' which updates Right Panel on Desktop.
                                            // On Mobile, we might want to expand inline or show a drawer?
                                            // User requested "Desktop" specifically. I'll maintain inline expansion for mobile logic if clicked.
                                            if (window.innerWidth < 1024) toggleExpand(idx);
                                        }}
                                        className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 ${cardBg} ${borderClass} shadow-sm group`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg bg-black/20">
                                                {statusIcon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${question.difficulty === 'Hard' ? 'bg-red-500/5 text-red-400/80 border-red-500/10' : question.difficulty === 'Medium' ? 'bg-amber-500/5 text-amber-400/80 border-amber-500/10' : 'bg-emerald-500/5 text-emerald-400/80 border-emerald-500/10'}`}>
                                                        {question.difficulty}
                                                    </span>
                                                    {question.chapterId && <span className="text-[10px] text-slate-500 truncate">{question.chapterId}</span>}
                                                </div>

                                                {/* Preview Text */}
                                                <div className="text-sm text-slate-300 font-medium line-clamp-3 prose prose-invert prose-sm leading-relaxed opacity-90">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkMath, remarkGfm]}
                                                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                                                        components={{ p: ({ children }) => <span className="inline">{children} </span> }}
                                                    >
                                                        {question.textMarkdown.split('\n').slice(0, 3).join('\n')}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>

                                            {/* Mobile Expand Indicator */}
                                            <div className="lg:hidden shrink-0 text-slate-600">
                                                <ChevronDown size={20} className={isExpanded ? 'rotate-180' : ''} />
                                            </div>
                                        </div>

                                        {/* Mobile: Inline Expansion */}
                                        <div className="lg:hidden">
                                            {isExpanded && (
                                                <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
                                                    <QuestionCard
                                                        question={question}
                                                        onAnswerSubmit={(cor, optId) => {
                                                            setQuestionStatus(prev => ({ ...prev, [idx]: cor ? 'solved' : 'incorrect' }));
                                                            handleAnswerSubmit(cor, optId);
                                                        }}
                                                        showFeedback={status === 'solved' || status === 'incorrect'}
                                                        selectedOptionId={question.id === activeQuestion.id ? selectedOptionId : null}
                                                    />
                                                    {/* Mobile Solution Toggle */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleSolution(idx); }}
                                                        className="mt-4 w-full py-2 bg-white/5 text-slate-400 text-xs font-bold uppercase rounded-lg"
                                                    >
                                                        {showSolutions[idx] ? 'Hide Solution' : 'View Solution'}
                                                    </button>
                                                    {showSolutions[idx] && (
                                                        <div className="mt-4 p-4 bg-black/20 rounded-lg">
                                                            <SolutionViewer solution={question.solution} sourceReferences={question.sourceReferences} imageScale={question.solutionImageScale} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="py-12 text-center text-slate-500 text-sm">
                                End of List
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Detail View (40% Desktop, Hidden Mobile) */}
                    <div className="hidden lg:flex w-[40%] h-full bg-[#0F172A] flex-col border-l border-white/5 relative z-10 shadow-2xl">
                        {/* Active Question Detail */}
                        {currentIndex >= 0 && filteredQuestions[currentIndex] ? (
                            <div className="flex-1 flex flex-col h-full">
                                {/* Detail Header */}
                                <div className="min-h-14 shrink-0 border-b border-white/5 flex items-center justify-between px-6 py-3 bg-[#0B1120] gap-4">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-sm font-bold text-slate-300">Question {currentIndex + 1}</span>
                                        {/* Source/Year Tags */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {filteredQuestions[currentIndex].sourceReferences?.map((ref, i) => (
                                                <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 whitespace-nowrap">
                                                    {ref.type === 'PYQ' ? `${ref.pyqExam || ''} ${ref.pyqShift || ''}`.trim() || 'PYQ' :
                                                        ref.type === 'NCERT' ? `${ref.ncertBook || ''} ${ref.ncertChapter || ''}`.trim() || 'NCERT' :
                                                            ref.sourceName || ref.type || 'Source'}
                                                </span>
                                            ))}
                                            {!filteredQuestions[currentIndex].sourceReferences?.length && (
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Practice Question</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => toggleStar(filteredQuestions[currentIndex].id)}
                                            className={`p-2.5 rounded-lg transition-all ${progress.starredIds?.includes(filteredQuestions[currentIndex].id) ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-white/5 text-slate-400'}`}
                                            title={progress.starredIds?.includes(filteredQuestions[currentIndex].id) ? "Remove Bookmark" : "Bookmark for Revision"}
                                        >
                                            <Star size={18} fill={progress.starredIds?.includes(filteredQuestions[currentIndex].id) ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => setEditingNote(true)}
                                            className={`p-2.5 rounded-lg transition-all ${editingNote || progress.userNotes?.[filteredQuestions[currentIndex].id] ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-white/5 text-slate-400'}`}
                                            title="Add Personal Note"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Detail Content (Scrollable) */}
                                <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#0B1120]">

                                    {/* Note Editor Area (Prominent) */}
                                    {(progress.userNotes?.[filteredQuestions[currentIndex].id] || editingNote) && (
                                        <div className="mb-6 animate-in slide-in-from-top-2">
                                            <div className="bg-[#FFF982] text-slate-900 p-4 rounded-xl relative shadow-lg mx-1 border-l-4 border-amber-400/50">
                                                {editingNote ? (
                                                    <div className="relative">
                                                        <textarea
                                                            value={noteText}
                                                            onChange={(e) => setNoteText(e.target.value)}
                                                            autoFocus
                                                            className="w-full bg-transparent border-none focus:ring-0 text-base font-handwritten leading-relaxed h-24 resize-none placeholder-slate-500/50"
                                                            placeholder="Write your mental note here..."
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button onClick={() => setEditingNote(false)} className="p-1.5 hover:bg-black/5 rounded text-slate-600" title="Cancel"><X size={16} /></button>
                                                            <button onClick={() => { saveNote(filteredQuestions[currentIndex].id, noteText); setEditingNote(false); }} className="p-1.5 hover:bg-black/5 rounded text-emerald-700" title="Save"><CheckCircle2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="group relative">
                                                        <p className="text-base font-handwritten leading-relaxed whitespace-pre-wrap">{progress.userNotes?.[filteredQuestions[currentIndex].id]}</p>
                                                        <button
                                                            onClick={() => { setNoteText(progress.userNotes?.[filteredQuestions[currentIndex].id] || ''); setEditingNote(true); }}
                                                            className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 rounded"
                                                            title="Edit Note"
                                                        >
                                                            <Pencil size={12} className="text-slate-500" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Question Card (Interactive) */}
                                    <div className="bg-[#151E32] rounded-xl border border-white/5 p-6 mb-6 shadow-lg">
                                        <QuestionCard
                                            question={filteredQuestions[currentIndex]}
                                            onAnswerSubmit={(cor, optId) => {
                                                handleAnswerSubmit(cor, optId);
                                            }}
                                            showFeedback={!!selectedOptionId} // Just show visual feedback
                                            selectedOptionId={filteredQuestions[currentIndex].id === activeQuestion.id ? selectedOptionId : null}
                                        />

                                        {/* Spaced Repetition Controls */}
                                        {gameMode === 'practice' && selectedOptionId && (
                                            <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                <div className="text-center mb-4">
                                                    <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Rate Difficulty</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3">
                                                    <button onClick={() => handleSRSubmit(1)} className="group flex flex-col items-center gap-1 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all active:scale-95">
                                                        <span className="text-sm font-black text-red-400 group-hover:text-red-300">Again</span>
                                                        <span className="text-[10px] text-red-500/70 font-mono text-center">&lt; 1 min</span>
                                                    </button>
                                                    <button onClick={() => handleSRSubmit(2)} className="group flex flex-col items-center gap-1 p-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all active:scale-95">
                                                        <span className="text-sm font-black text-orange-400 group-hover:text-orange-300">Hard</span>
                                                        <span className="text-[10px] text-orange-500/70 font-mono text-center">2 days</span>
                                                    </button>
                                                    <button onClick={() => handleSRSubmit(3)} className="group flex flex-col items-center gap-1 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all active:scale-95">
                                                        <span className="text-sm font-black text-blue-400 group-hover:text-blue-300">Good</span>
                                                        <span className="text-[10px] text-blue-500/70 font-mono text-center">4 days</span>
                                                    </button>
                                                    <button onClick={() => handleSRSubmit(4)} className="group flex flex-col items-center gap-1 p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all active:scale-95">
                                                        <span className="text-sm font-black text-emerald-400 group-hover:text-emerald-300">Easy</span>
                                                        <span className="text-[10px] text-emerald-500/70 font-mono text-center">7 days</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center mb-6">
                                        <button
                                            onClick={() => toggleSolution(currentIndex)}
                                            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition"
                                        >
                                            {showSolutions[currentIndex] ? 'Hide Solution' : 'View Full Solution'}
                                        </button>
                                    </div>

                                    {/* Solution Viewer */}
                                    {showSolutions[currentIndex] && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 pb-10">
                                            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <BookOpen size={64} className="text-emerald-500" />
                                                </div>
                                                <h3 className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">Detailed Explanation</h3>
                                                <SolutionViewer
                                                    solution={filteredQuestions[currentIndex].solution}
                                                    sourceReferences={filteredQuestions[currentIndex].sourceReferences}
                                                    imageScale={filteredQuestions[currentIndex].solutionImageScale}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
                                <Code size={48} className="opacity-20" />
                                <p>Select a question from the left to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER: EXAM MODE (PROCTOR SPLIT-SCREEN)
    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <div className="h-screen bg-[#0B1120] text-slate-200 flex overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Watermark Background (Subtle) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0 overflow-hidden">
                <img src="/logo.png" alt="Watermark" className="w-[40%] object-contain grayscale" />
            </div>

            {/* LEFT PANEL: QUESTION AREA (Flex Grow) */}
            <div className="flex-1 flex flex-col h-full relative z-10 min-w-0">
                {/* Exam Header */}
                <header className="h-14 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-400">Section 1: Chemistry</span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500 border border-white/5">
                            Single Correct
                        </span>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-sm font-medium text-slate-300">
                        <div className={`flex items-center gap-2 ${timerSeconds < 300 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                            <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center border border-white/5">
                                <Pause size={14} />
                            </div>
                            <span className="text-lg tracking-widest">{formatTime(timerSeconds)}</span>
                        </div>
                    </div>
                </header>

                {/* Progress Bar (Thin) */}
                <div className="h-0.5 bg-white/5 w-full">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>

                {/* Main Scrollable Question Area */}
                <main className="flex-1 overflow-y-auto scroll-smooth relative">
                    <div className="max-w-[1200px] mx-auto p-6 md:p-10 pb-32">
                        {/* Question Header Strip */}
                        <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-slate-100">Question {currentIndex + 1}</span>
                                <div className="flex gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">+4 Correct</span>
                                    <span className="text-[11px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded">-1 Wrong</span>
                                </div>
                            </div>

                            {/* Action Tools */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { toggleStar(activeQuestion.id); }}
                                    className={`p-2 rounded-lg border transition-all ${progress.starredIds?.includes(activeQuestion.id) ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'border-transparent hover:bg-white/5 text-slate-500'}`}
                                    title="Mark for later revision"
                                >
                                    <Star size={18} fill={progress.starredIds?.includes(activeQuestion.id) ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => setEditingNote(true)}
                                    className="p-2 rounded-lg border border-transparent hover:bg-white/5 text-slate-500 transition-all"
                                    title="Add Note"
                                >
                                    <Pencil size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Note Area */}
                        {(progress.userNotes?.[activeQuestion.id] || editingNote) && (
                            <div className="mb-8 animate-in slide-in-from-top-2">
                                <div className="bg-[#FFF982] text-slate-900 p-4 rounded-bl-xl rounded-br-xl rounded-tr-xl relative shadow-lg mx-1">
                                    <div className="absolute top-0 left-0 -mt-2 -ml-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[10px] border-r-[#E5DE60] border-b-[0px] border-b-transparent brightness-75"></div>
                                    {editingNote ? (
                                        <div className="relative">
                                            <textarea
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                                autoFocus
                                                className="w-full bg-transparent border-none focus:ring-0 text-lg font-handwritten leading-relaxed h-24 resize-none placeholder-slate-500/50"
                                                placeholder="Write your thoughts..."
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => setEditingNote(false)} className="p-1.5 hover:bg-black/5 rounded"><X size={16} /></button>
                                                <button onClick={() => { saveNote(activeQuestion.id, noteText); setEditingNote(false); }} className="p-1.5 hover:bg-black/5 rounded text-emerald-700"><CheckCircle2 size={16} /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-handwritten leading-relaxed whitespace-pre-wrap">{progress.userNotes?.[activeQuestion.id]}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* The Question */}
                        <div className="bg-[#151E32] rounded-2xl border border-white/5 p-6 md:p-8 shadow-sm">
                            <QuestionCard
                                question={activeQuestion}
                                onAnswerSubmit={handleAnswerSubmit}
                                showFeedback={false} // Exam mode: No immediate feedback
                                selectedOptionId={selectedOptionId}
                            />
                        </div>
                    </div>
                </main>

                {/* Sticky Action Footer */}
                <footer className="bg-[#0F172A] border-t border-white/5 p-4 md:px-8 z-30 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setSelectedOptionId(null); setIsCorrect(null); setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'skipped' })); }}
                            className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            Clear Response
                        </button>
                        <button
                            onClick={() => {
                                setQuestionStatus(prev => ({ ...prev, [currentIndex]: 'marked' }));
                                handleNext();
                            }}
                            className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div> Mark & Next
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {currentIndex > 0 && (
                            <button
                                onClick={handleBack}
                                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                        >
                            {isLastQuestion ? 'Submit Test' : 'Save & Next'}
                            {!isLastQuestion && <ArrowRight size={18} />}
                        </button>
                    </div>
                </footer>
            </div>

            {/* RIGHT PANEL: SIDEBAR (Fixed Width) */}
            <aside className="w-80 lg:w-96 bg-[#0F172A] border-l border-white/5 hidden lg:flex flex-col z-20 shrink-0">
                {/* Header User/Profile maybe? Or just generic */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Overview</h2>
                        <button onClick={resetSession} className="text-xs font-bold text-red-400 hover:text-red-300 transition">Quit</button>
                    </div>

                    {/* Stats Grid - Competitor Style */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#151E32] p-3 rounded-xl border-l-2 border-emerald-500">
                            <div className="text-2xl font-bold text-slate-200">{Object.values(questionStatus).filter(s => s === 'answered' || s === 'solved' || s === 'incorrect').length}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Answered</div>
                        </div>
                        <div className="bg-[#151E32] p-3 rounded-xl border-l-2 border-red-500">
                            <div className="text-2xl font-bold text-slate-200">{filteredQuestions.length - Object.keys(questionStatus).length}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Not Visited</div>
                        </div>
                        <div className="bg-[#151E32] p-3 rounded-xl border-l-2 border-purple-500">
                            <div className="text-2xl font-bold text-slate-200">{Object.values(questionStatus).filter(s => s === 'marked').length}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Marked</div>
                        </div>
                        <div className="bg-[#151E32] p-3 rounded-xl border-l-2 border-gray-500">
                            <div className="text-2xl font-bold text-slate-200">{Object.values(questionStatus).filter(s => s === 'skipped').length}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Skipped</div>
                        </div>
                    </div>
                </div>

                {/* Question Palette Grid */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {filteredQuestions.map((_, idx) => {
                            const status = questionStatus[idx];
                            let style = 'bg-[#151E32] text-slate-500 border border-transparent hover:border-slate-600';

                            // Active State
                            if (idx === currentIndex) {
                                style = 'ring-2 ring-indigo-500 bg-indigo-500/20 text-indigo-300 border-indigo-500/50';
                            }
                            // Status States (Override)
                            else if (status === 'answered' || status === 'solved' || status === 'incorrect') {
                                style = 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30';
                            } else if (status === 'marked') {
                                style = 'bg-purple-600/20 text-purple-400 border-purple-600/30';
                            } else if (status === 'skipped') {
                                style = 'bg-red-500/10 text-red-400 border-red-500/20';
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentIndex(idx); resetState(idx); }}
                                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${style}`}
                                >
                                    {idx + 1}
                                    {status === 'marked' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Action */}
                <div className="p-6 border-t border-white/5 bg-[#0a0a16]/30">
                    <button
                        onClick={handleSubmitTest}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        SUBMIT TEST
                    </button>
                    <p className="text-center text-[10px] text-slate-600 mt-3">
                        Once submitted, you cannot edit responses.
                    </p>
                </div>
            </aside>
        </div>
    );
}
