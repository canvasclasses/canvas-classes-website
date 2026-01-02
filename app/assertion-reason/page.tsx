'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { fetchAssertionReasonQuestions, AssertionReasonQuestion, getUniqueChapters, shuffleArray } from '../lib/assertionReasonData';
import { Zap, CheckCircle, XCircle, Sparkles, Trophy, RefreshCw, ChevronRight, Lightbulb, Target, Brain, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

type Phase = 'assertion' | 'reason' | 'link' | 'result';
type GameState = 'menu' | 'playing' | 'finished';

interface GameProgress {
    total: number;
    correct: number;
    xp: number;
}

export default function AssertionReasonPage() {
    const [allQuestions, setAllQuestions] = useState<AssertionReasonQuestion[]>([]);
    const [questions, setQuestions] = useState<AssertionReasonQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameState, setGameState] = useState<GameState>('menu');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('assertion');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ a: boolean | null; r: boolean | null; link: boolean | null }>({ a: null, r: null, link: null });
    const [progress, setProgress] = useState<GameProgress>({ total: 0, correct: 0, xp: 0 });
    const [selectedChapter, setSelectedChapter] = useState<string>('all');
    const [questionCount, setQuestionCount] = useState<number>(10);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchAssertionReasonQuestions();
            setAllQuestions(data);
            setLoading(false);
        };
        loadData();
    }, []);

    const chapters = getUniqueChapters(allQuestions);
    const currentQuestion = questions[currentIndex];

    const startGame = () => {
        let filtered = selectedChapter === 'all' ? allQuestions : allQuestions.filter(q => q.chapter === selectedChapter);
        const shuffled = shuffleArray(filtered).slice(0, questionCount);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setPhase('assertion');
        setIsCorrect(null);
        setUserAnswers({ a: null, r: null, link: null });
        setProgress({ total: shuffled.length, correct: 0, xp: 0 });
        setGameState('playing');
    };

    const handleAssertionAnswer = (answer: boolean) => {
        setUserAnswers({ ...userAnswers, a: answer });

        if (answer === currentQuestion.aTruth) {
            // Correct about assertion
            if (!currentQuestion.aTruth) {
                // Assertion is False - question is done
                setIsCorrect(true);
                setProgress(p => ({ ...p, correct: p.correct + 1, xp: p.xp + 100 }));
                setPhase('result');
            } else {
                // Assertion is True - move to Reason
                setPhase('reason');
            }
        } else {
            // Wrong about assertion
            setIsCorrect(false);
            setPhase('result');
        }
    };

    const handleReasonAnswer = (answer: boolean) => {
        setUserAnswers({ ...userAnswers, r: answer });

        if (answer === currentQuestion.rTruth) {
            // Correct about reason
            if (!currentQuestion.rTruth) {
                // Reason is False - question is done
                setIsCorrect(true);
                setProgress(p => ({ ...p, correct: p.correct + 1, xp: p.xp + 100 }));
                setPhase('result');
            } else {
                // Reason is True - move to Link phase
                setPhase('link');
            }
        } else {
            // Wrong about reason
            setIsCorrect(false);
            setPhase('result');
        }
    };

    const handleLinkAnswer = (answer: boolean) => {
        setUserAnswers({ ...userAnswers, link: answer });

        if (answer === currentQuestion.isExplanation) {
            // Correct about link
            setIsCorrect(true);
            setProgress(p => ({ ...p, correct: p.correct + 1, xp: p.xp + 100 }));
        } else {
            // Wrong about link
            setIsCorrect(false);
        }
        setPhase('result');
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= questions.length) {
            setGameState('finished');
        } else {
            setCurrentIndex(currentIndex + 1);
            setPhase('assertion');
            setIsCorrect(null);
            setUserAnswers({ a: null, r: null, link: null });
        }
    };

    const restartGame = () => {
        setGameState('menu');
        setCurrentIndex(0);
        setPhase('assertion');
        setIsCorrect(null);
        setUserAnswers({ a: null, r: null, link: null });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Zap size={16} />
                        NCERT & Boards
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Circuit Breaker
                    </h1>
                    <p className="text-lg text-white/90 mb-2 max-w-xl mx-auto">
                        Master Assertion & Reason questions with our 3-step decision flow
                    </p>

                    {gameState === 'playing' && (
                        <div className="mt-8 max-w-md mx-auto">
                            <div className="flex justify-between text-white/80 text-sm mb-2">
                                <span>Progress</span>
                                <span>{currentIndex + 1} / {questions.length}</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <div className="flex items-center gap-2 text-white">
                                    <Trophy size={18} className="text-yellow-300" />
                                    <span className="font-bold">{progress.xp} XP</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <Target size={18} className="text-green-300" />
                                    <span>{progress.correct} correct</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 py-12 -mt-8">
                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* Menu State */}
                        {gameState === 'menu' && (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                        <Brain size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Break the Circuit?</h2>
                                    <p className="text-gray-600">Test your understanding with our unique 3-phase decision flow</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-8">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600 mb-1">Phase 1</div>
                                        <div className="text-sm text-gray-600">Is Assertion True?</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600 mb-1">Phase 2</div>
                                        <div className="text-sm text-gray-600">Is Reason True?</div>
                                    </div>
                                    <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-indigo-600 mb-1">Phase 3</div>
                                        <div className="text-sm text-gray-600">Does R explain A?</div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Chapter</label>
                                        <select
                                            value={selectedChapter}
                                            onChange={(e) => setSelectedChapter(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Chapters ({allQuestions.length} questions)</option>
                                            {chapters.map(chapter => (
                                                <option key={chapter} value={chapter}>
                                                    {chapter} ({allQuestions.filter(q => q.chapter === chapter).length})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                                        <div className="flex gap-3">
                                            {[5, 10, 15, 20].map(count => (
                                                <button
                                                    key={count}
                                                    onClick={() => setQuestionCount(count)}
                                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${questionCount === count
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {count}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={startGame}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Start Challenge <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {/* Playing State */}
                        {gameState === 'playing' && currentQuestion && (
                            <motion.div
                                key={`question-${currentIndex}-${phase}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                {/* Chapter Badge */}
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">{currentQuestion.chapter}</span>
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        Q{currentIndex + 1}
                                    </span>
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* Phase Indicator */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${phase === 'assertion' || phase === 'reason' || phase === 'link' || phase === 'result'
                                                ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}>1</div>
                                        <div className={`w-12 h-1 rounded ${userAnswers.a !== null ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${phase === 'reason' || phase === 'link' || phase === 'result'
                                                ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}>2</div>
                                        <div className={`w-12 h-1 rounded ${userAnswers.r !== null ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${phase === 'link' || phase === 'result'
                                                ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}>3</div>
                                    </div>

                                    {/* Assertion Box */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-xl p-5 mb-4 border-2 border-blue-200 bg-blue-50"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold">A</div>
                                            <div className="flex-1 text-gray-800 text-lg leading-relaxed">
                                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                    {currentQuestion.assertion}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Reason Box (appears in phase 2+) */}
                                    <AnimatePresence>
                                        {(phase === 'reason' || phase === 'link' || phase === 'result') && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="rounded-xl p-5 mb-4 border-2 border-purple-200 bg-purple-50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="px-2 py-1 rounded bg-purple-600 text-white text-xs font-bold">R</div>
                                                    <div className="flex-1 text-gray-800 text-lg leading-relaxed">
                                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                            {currentQuestion.reason}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Phase 1: Assertion Question */}
                                    {phase === 'assertion' && (
                                        <div className="mt-8">
                                            <h3 className="text-center text-gray-700 font-medium mb-4">Is the Assertion TRUE or FALSE?</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => handleAssertionAnswer(true)}
                                                    className="py-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-lg transition-all border-2 border-emerald-300 hover:border-emerald-400"
                                                >
                                                    TRUE
                                                </button>
                                                <button
                                                    onClick={() => handleAssertionAnswer(false)}
                                                    className="py-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-lg transition-all border-2 border-red-300 hover:border-red-400"
                                                >
                                                    FALSE
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phase 2: Reason Question */}
                                    {phase === 'reason' && (
                                        <div className="mt-8">
                                            <h3 className="text-center text-gray-700 font-medium mb-4">Is the Reason TRUE or FALSE?</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => handleReasonAnswer(true)}
                                                    className="py-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-lg transition-all border-2 border-emerald-300 hover:border-emerald-400"
                                                >
                                                    TRUE
                                                </button>
                                                <button
                                                    onClick={() => handleReasonAnswer(false)}
                                                    className="py-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-lg transition-all border-2 border-red-300 hover:border-red-400"
                                                >
                                                    FALSE
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phase 3: Link Question */}
                                    {phase === 'link' && (
                                        <div className="mt-8">
                                            <h3 className="text-center text-gray-700 font-medium mb-4">
                                                Does the Reason CORRECTLY explain the Assertion?
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => handleLinkAnswer(true)}
                                                    className="py-4 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold text-lg transition-all border-2 border-indigo-300 hover:border-indigo-400"
                                                >
                                                    Yes, it explains
                                                </button>
                                                <button
                                                    onClick={() => handleLinkAnswer(false)}
                                                    className="py-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold text-lg transition-all border-2 border-amber-300 hover:border-amber-400"
                                                >
                                                    No, just a fact
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Result */}
                                    {phase === 'result' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-6"
                                        >
                                            {isCorrect ? (
                                                <div className="rounded-xl p-5 bg-emerald-50 border-2 border-emerald-200">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                                            <CheckCircle className="text-white" size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-emerald-700 text-lg">Correct!</div>
                                                            <div className="text-emerald-600 flex items-center gap-1">
                                                                <Sparkles size={16} /> +100 XP
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rounded-xl p-5 bg-red-50 border-2 border-red-200">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                                                            <XCircle className="text-white" size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-red-700 text-lg">Not quite right</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 p-4 bg-white rounded-lg border border-red-100">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <Lightbulb className="text-amber-500 mt-0.5" size={18} />
                                                            <span className="font-semibold text-gray-900">Concept Card</span>
                                                        </div>
                                                        <div className="text-gray-700 text-sm">
                                                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                                {currentQuestion.explanation}
                                                            </ReactMarkdown>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                                                            <p><strong>Assertion:</strong> {currentQuestion.aTruth ? 'True' : 'False'}</p>
                                                            <p><strong>Reason:</strong> {currentQuestion.rTruth ? 'True' : 'False'}</p>
                                                            {currentQuestion.aTruth && currentQuestion.rTruth && (
                                                                <p><strong>Link:</strong> {currentQuestion.isExplanation ? 'R explains A' : 'R does not explain A'}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={nextQuestion}
                                                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                {currentIndex + 1 >= questions.length ? 'View Results' : 'Next Question'} <ChevronRight size={20} />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Finished State */}
                        {gameState === 'finished' && (
                            <motion.div
                                key="finished"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                                    <Trophy size={48} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Challenge Complete!</h2>
                                <p className="text-gray-600 mb-8">You've finished all {progress.total} questions</p>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <div className="text-3xl font-bold text-emerald-600">{progress.correct}</div>
                                        <div className="text-sm text-gray-600">Correct</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="text-3xl font-bold text-blue-600">{Math.round((progress.correct / progress.total) * 100)}%</div>
                                        <div className="text-sm text-gray-600">Accuracy</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <div className="text-3xl font-bold text-purple-600">{progress.xp}</div>
                                        <div className="text-sm text-gray-600">XP Earned</div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={restartGame}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={20} /> New Challenge
                                    </button>
                                    <button
                                        onClick={startGame}
                                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={20} /> Retry Same
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
