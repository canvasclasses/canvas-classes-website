'use client';

import { useState, useMemo, useCallback } from 'react';
import { Salt, formatKsp, calculateSolubility, formatSolubility, getDissociationEquation, solubilityFormulas } from '@/app/lib/kspData';

interface QuizModeProps {
    salts: Salt[];
}

interface Question {
    type: 'order' | 'precipitate' | 'compare';
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    salts: Salt[];
}

export default function QuizMode({ salts }: QuizModeProps) {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);

    // Generate a random question
    const generateQuestion = useCallback((): Question => {
        const questionTypes = ['order', 'compare', 'precipitate'] as const;
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        // Get random salts
        const shuffled = [...salts].sort(() => Math.random() - 0.5);

        if (type === 'order') {
            // Order by solubility question
            const selectedSalts = shuffled.slice(0, 4);
            const sortedBySolubility = [...selectedSalts].sort(
                (a, b) => calculateSolubility(a) - calculateSolubility(b)
            );
            const correctOrder = sortedBySolubility.map(s => s.formula).join(' < ');

            // Generate wrong options by shuffling
            const options = [correctOrder];
            while (options.length < 4) {
                const shuffledOrder = [...sortedBySolubility]
                    .sort(() => Math.random() - 0.5)
                    .map(s => s.formula)
                    .join(' < ');
                if (!options.includes(shuffledOrder)) {
                    options.push(shuffledOrder);
                }
            }

            const shuffledOptions = options.sort(() => Math.random() - 0.5);
            const correctIndex = shuffledOptions.indexOf(correctOrder);

            const explanationParts = sortedBySolubility.map(s =>
                `${s.formula}: s = ${formatSolubility(calculateSolubility(s))}`
            );

            return {
                type: 'order',
                question: `Arrange the following salts in increasing order of solubility:`,
                options: shuffledOptions,
                correctIndex,
                explanation: `Calculating molar solubility for each:\n${explanationParts.join('\n')}`,
                salts: selectedSalts,
            };
        } else if (type === 'compare') {
            // Compare two salts
            const [salt1, salt2] = shuffled.slice(0, 2);
            const sol1 = calculateSolubility(salt1);
            const sol2 = calculateSolubility(salt2);
            const moreSoluble = sol1 > sol2 ? salt1 : salt2;

            const options = [
                `${salt1.formula} is more soluble`,
                `${salt2.formula} is more soluble`,
                `Both have equal solubility`,
                `Cannot be determined`,
            ];

            const correctIndex = moreSoluble === salt1 ? 0 : 1;

            return {
                type: 'compare',
                question: `Compare the solubility of ${salt1.name} (${salt1.formula}) and ${salt2.name} (${salt2.formula}). Which is more soluble?`,
                options,
                correctIndex,
                explanation: `${salt1.formula} (${salt1.type}): Ksp = ${formatKsp(salt1)}, s = ${formatSolubility(sol1)}\n${salt2.formula} (${salt2.type}): Ksp = ${formatKsp(salt2)}, s = ${formatSolubility(sol2)}\n\n${moreSoluble.formula} has higher molar solubility.${salt1.type !== salt2.type ? '\n\n⚠️ Note: Different salt types - direct Ksp comparison would be wrong!' : ''}`,
                salts: [salt1, salt2],
            };
        } else {
            // Precipitation question - which precipitates first
            // Pick salts with same anion for realistic question
            const anions = [...new Set(salts.map(s => s.anion))];
            const randomAnion = anions[Math.floor(Math.random() * anions.length)];
            const sameanionSalts = salts.filter(s => s.anion === randomAnion);

            if (sameanionSalts.length < 2) {
                // Fallback to compare question
                return generateQuestion();
            }

            const [salt1, salt2] = sameanionSalts.sort(() => Math.random() - 0.5).slice(0, 2);
            const sol1 = calculateSolubility(salt1);
            const sol2 = calculateSolubility(salt2);

            // Lower solubility = precipitates first (lower concentration needed)
            const precipitatesFirst = sol1 < sol2 ? salt1 : salt2;

            const options = [
                salt1.formula,
                salt2.formula,
                'Both precipitate together',
                'Neither will precipitate',
            ];

            const correctIndex = precipitatesFirst === salt1 ? 0 : 1;

            return {
                type: 'precipitate',
                question: `If solutions of ${salt1.cation} and ${salt2.cation} are mixed and ${salt1.anion} ions are slowly added, which salt precipitates first?`,
                options,
                correctIndex,
                explanation: `The salt with LOWER solubility precipitates first (reaches saturation at lower ion concentration).\n\n${salt1.formula}: s = ${formatSolubility(sol1)}\n${salt2.formula}: s = ${formatSolubility(sol2)}\n\n${precipitatesFirst.formula} has lower solubility, so it precipitates first.`,
                salts: [salt1, salt2],
            };
        }
    }, [salts]);

    // Start new question
    const startNewQuestion = () => {
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
    };

    // Handle answer selection
    const handleAnswer = (index: number) => {
        if (showResult) return;
        setSelectedAnswer(index);
    };

    // Submit answer
    const submitAnswer = () => {
        if (selectedAnswer === null || !currentQuestion) return;

        setShowResult(true);
        setTotalAnswered(prev => prev + 1);

        if (selectedAnswer === currentQuestion.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    // Reset quiz
    const resetQuiz = () => {
        setScore(0);
        setTotalAnswered(0);
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    return (
        <div className="space-y-6">
            {/* Score Display */}
            {totalAnswered > 0 && (
                <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 flex items-center justify-between">
                    <div className="text-gray-400">
                        Score: <span className="text-white font-bold">{score}/{totalAnswered}</span>
                        <span className="text-sm ml-2">
                            ({((score / totalAnswered) * 100).toFixed(0)}%)
                        </span>
                    </div>
                    <button
                        onClick={resetQuiz}
                        className="text-sm text-purple-400 hover:text-purple-300"
                    >
                        Reset Score
                    </button>
                </div>
            )}

            {/* Start/Question Area */}
            {!currentQuestion ? (
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h2 className="text-2xl font-bold text-white mb-2">JEE-Style Ksp Quiz</h2>
                    <p className="text-gray-400 mb-6">
                        Test your understanding of solubility and Ksp concepts with JEE-style questions.
                    </p>
                    <button
                        onClick={startNewQuestion}
                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors border border-gray-600"
                    >
                        Start Quiz
                    </button>
                </div>
            ) : (
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 space-y-6">
                    {/* Question Type Badge */}
                    <div className="flex items-center justify-between">
                        <span className={`text-xs px-3 py-1 rounded-full ${currentQuestion.type === 'order'
                            ? 'bg-blue-500/20 text-blue-300'
                            : currentQuestion.type === 'compare'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-orange-500/20 text-orange-300'
                            }`}>
                            {currentQuestion.type === 'order' && '📊 Ordering'}
                            {currentQuestion.type === 'compare' && '⚖️ Comparison'}
                            {currentQuestion.type === 'precipitate' && '💧 Precipitation'}
                        </span>
                        <span className="text-gray-500 text-sm">
                            Question #{totalAnswered + 1}
                        </span>
                    </div>

                    {/* Question */}
                    <h3 className="text-xl text-white font-medium">{currentQuestion.question}</h3>

                    {/* Salt Info Cards */}
                    <div className="flex flex-wrap gap-2">
                        {currentQuestion.salts.map(salt => (
                            <span
                                key={salt.formula}
                                className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded"
                            >
                                {salt.formula}: Ksp = {formatKsp(salt)}
                            </span>
                        ))}
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            let bgClass = 'bg-slate-800 border-slate-600 hover:border-purple-500';

                            if (showResult) {
                                if (index === currentQuestion.correctIndex) {
                                    bgClass = 'bg-green-600/20 border-green-500';
                                } else if (index === selectedAnswer) {
                                    bgClass = 'bg-red-600/20 border-red-500';
                                }
                            } else if (selectedAnswer === index) {
                                bgClass = 'bg-purple-600/20 border-purple-500';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={showResult}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${bgClass} ${showResult ? 'cursor-default' : 'cursor-pointer'
                                        }`}
                                >
                                    <span className="text-gray-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                                    <span className="text-white font-mono">{option}</span>
                                    {showResult && index === currentQuestion.correctIndex && (
                                        <span className="ml-2 text-green-400">✓</span>
                                    )}
                                    {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                                        <span className="ml-2 text-red-400">✗</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Submit / Next Button */}
                    {!showResult ? (
                        <button
                            onClick={submitAnswer}
                            disabled={selectedAnswer === null}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-slate-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors border border-gray-600"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <>
                            {/* Explanation */}
                            <div className={`p-4 rounded-xl ${selectedAnswer === currentQuestion.correctIndex
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-red-500/10 border border-red-500/30'
                                }`}>
                                <h4 className={`font-semibold mb-2 ${selectedAnswer === currentQuestion.correctIndex
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                    }`}>
                                    {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
                                </h4>
                                <p className="text-gray-300 text-sm whitespace-pre-line">
                                    {currentQuestion.explanation}
                                </p>
                            </div>

                            <button
                                onClick={startNewQuestion}
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors border border-gray-600"
                            >
                                Next Question →
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Tips Section */}
            <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
                <h4 className="text-gray-400 text-sm font-medium mb-2">💡 Quick Tips</h4>
                <ul className="text-gray-500 text-sm space-y-1">
                    <li>• For same type salts: Higher Ksp = More soluble</li>
                    <li>• For different types: Must calculate s first!</li>
                    <li>• Lower solubility salt precipitates first</li>
                    <li>• AB: s = √Ksp | AB₂: s = ∛(Ksp/4) | AB₃: s = ⁴√(Ksp/27)</li>
                </ul>
            </div>
        </div>
    );
}
