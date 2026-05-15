'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    RotateCcw,
    Trophy,
    Target,
    Zap,
    Clock,
    CheckCircle2,
    XCircle,
    Lightbulb,
    ChevronRight,
    X,
} from 'lucide-react';
import { ELEMENTS, type Element } from '../lib/elementsData';

type GameState = 'idle' | 'playing' | 'finished';
type BlockFilter = 'all' | 's' | 'p' | 'd' | 'f';

// Filter elements for quiz - exclude lanthanides and actinides for simpler gameplay
const getQuizElements = (blockFilter: BlockFilter): Element[] => {
    let elements = ELEMENTS.filter(e => e.row <= 7); // Main table only

    if (blockFilter !== 'all') {
        elements = elements.filter(e => e.block === blockFilter);
    }

    // Shuffle elements
    return [...elements].sort(() => Math.random() - 0.5);
};

export default function PeriodicTableQuiz() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [blockFilter, setBlockFilter] = useState<BlockFilter>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; position?: { row: number; col: number } } | null>(null);
    const [placedElements, setPlacedElements] = useState<Set<number>>(new Set());
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    // Get shuffled elements based on filter
    const quizElements = useMemo(() => getQuizElements(blockFilter), [blockFilter, gameState]);

    const currentElement = quizElements[currentIndex];
    const totalElements = Math.min(quizElements.length, 20); // Limit to 20 per round

    // Start game
    const startGame = () => {
        setGameState('playing');
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setAttempts(0);
        setShowHint(false);
        setFeedback(null);
        setPlacedElements(new Set());
        setStartTime(Date.now());
        setElapsedTime(0);
    };

    // Handle cell click
    const handleCellClick = useCallback((row: number, col: number) => {
        if (gameState !== 'playing' || !currentElement || placedElements.has(currentIndex)) return;

        setAttempts(prev => prev + 1);

        // Check if correct position
        if (row === currentElement.row && col === currentElement.col) {
            // Correct!
            setFeedback({ type: 'correct', position: { row, col } });
            setScore(prev => prev + 1);
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > bestStreak) setBestStreak(newStreak);
                return newStreak;
            });
            setPlacedElements(prev => new Set([...prev, currentIndex]));
            setShowHint(false);

            // Move to next element after delay
            setTimeout(() => {
                setFeedback(null);
                if (currentIndex < totalElements - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    // Game finished
                    setElapsedTime(Date.now() - startTime);
                    setGameState('finished');
                }
            }, 800);
        } else {
            // Wrong!
            setFeedback({ type: 'wrong', position: { row, col } });
            setStreak(0);

            setTimeout(() => setFeedback(null), 500);
        }
    }, [gameState, currentElement, currentIndex, totalElements, placedElements, bestStreak, startTime]);

    // Render empty cell for quiz grid
    const QuizCell = ({ row, col }: { row: number; col: number }) => {
        const placedElement = ELEMENTS.find(e =>
            e.row === row && e.col === col &&
            quizElements.slice(0, currentIndex).some(qe => qe.atomicNumber === e.atomicNumber) &&
            placedElements.has(quizElements.findIndex(qe => qe.atomicNumber === e.atomicNumber))
        );

        const isFeedbackCell = feedback?.position?.row === row && feedback?.position?.col === col;
        const isHintCell = showHint && currentElement?.row === row && currentElement?.col === col;

        // Check if this position has an element
        const hasElement = ELEMENTS.some(e => e.row === row && e.col === col);
        if (!hasElement) return <div style={{ gridColumn: col, gridRow: row }} />;

        return (
            <motion.div
                className={`
                    relative cursor-pointer rounded-md p-1 min-h-[40px] sm:min-h-[50px]
                    flex items-center justify-center transition-all border-2
                    ${placedElement
                        ? 'bg-green-500/30 border-green-500/50'
                        : 'bg-gray-700/50 border-gray-600 hover:border-cyan-400 hover:bg-gray-600/50'
                    }
                    ${isFeedbackCell && feedback?.type === 'correct' ? 'bg-green-500 border-green-400' : ''}
                    ${isFeedbackCell && feedback?.type === 'wrong' ? 'bg-red-500 border-red-400' : ''}
                    ${isHintCell ? 'border-yellow-400 border-dashed animate-pulse' : ''}
                `}
                style={{
                    gridColumn: col,
                    gridRow: row,
                }}
                onClick={() => handleCellClick(row, col)}
                animate={isFeedbackCell && feedback?.type === 'wrong' ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
            >
                {placedElement ? (
                    <>
                        <div className="text-[8px] absolute top-0.5 left-1 text-green-200">{placedElement.atomicNumber}</div>
                        <div className="text-sm sm:text-base font-bold text-green-100">{placedElement.symbol}</div>
                    </>
                ) : (
                    isFeedbackCell && feedback?.type === 'correct' && currentElement && (
                        <>
                            <div className="text-[8px] absolute top-0.5 left-1 text-white">{currentElement.atomicNumber}</div>
                            <div className="text-sm sm:text-base font-bold text-white">{currentElement.symbol}</div>
                        </>
                    )
                )}
                {isFeedbackCell && feedback?.type === 'wrong' && <XCircle className="text-white" size={20} />}
            </motion.div>
        );
    };

    // Render quiz grid (simplified - main 7 periods, 18 groups)
    const renderQuizGrid = () => {
        const cells = [];
        for (let row = 1; row <= 7; row++) {
            for (let col = 1; col <= 18; col++) {
                cells.push(<QuizCell key={`${row}-${col}`} row={row} col={col} />);
            }
        }
        return cells;
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <Target className="text-cyan-400 shrink-0" size={20} />
                    <h2 className="text-base sm:text-xl font-bold text-white whitespace-nowrap">Memory Practice</h2>
                </div>
                {gameState === 'playing' && (
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-3 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 text-green-400 whitespace-nowrap">
                                <CheckCircle2 size={14} />
                                <span>{score}/{totalElements}</span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-400 whitespace-nowrap">
                                <Zap size={14} />
                                <span>Streak: {streak}</span>
                            </div>
                        </div>

                        {/* Stop Button */}
                        <button
                            onClick={() => setGameState('idle')}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all flex items-center gap-1.5 px-2 py-1 sm:px-2.5"
                            title="Stop Practice"
                        >
                            <X size={14} />
                            <span className="text-[10px] sm:text-xs font-semibold">Stop</span>
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 px-4"
                    >
                        {/* Left: Stunning authentic periodic table with glassmorphism */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative flex items-center justify-center min-h-[400px]"
                        >
                            {/* Ambient glow background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl" />
                            
                            {/* Authentic periodic table structure */}
                            <div className="relative w-full" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', 
                                gap: '4px',
                                padding: '10px'
                            }}>
                                {/* Generate authentic periodic table layout */}
                                {(() => {
                                    const elements = [];
                                    const blockColors = {
                                        s: ['from-red-500/50 to-orange-500/50', 'shadow-red-500/30'],
                                        p: ['from-green-500/50 to-emerald-500/50', 'shadow-green-500/30'],
                                        d: ['from-blue-500/50 to-cyan-500/50', 'shadow-blue-500/30'],
                                        f: ['from-purple-500/50 to-pink-500/50', 'shadow-purple-500/30'],
                                    };
                                    
                                    // Period 1: H and He
                                    elements.push({ row: 1, col: 1, block: 's', delay: 0 }); // H
                                    elements.push({ row: 1, col: 18, block: 'p', delay: 0.05 }); // He
                                    
                                    // Period 2: Li-Ne
                                    for (let col = 1; col <= 2; col++) elements.push({ row: 2, col, block: 's', delay: 0.1 + col * 0.02 });
                                    for (let col = 13; col <= 18; col++) elements.push({ row: 2, col, block: 'p', delay: 0.1 + col * 0.02 });
                                    
                                    // Period 3: Na-Ar
                                    for (let col = 1; col <= 2; col++) elements.push({ row: 3, col, block: 's', delay: 0.2 + col * 0.02 });
                                    for (let col = 13; col <= 18; col++) elements.push({ row: 3, col, block: 'p', delay: 0.2 + col * 0.02 });
                                    
                                    // Period 4: K-Kr
                                    for (let col = 1; col <= 2; col++) elements.push({ row: 4, col, block: 's', delay: 0.3 + col * 0.02 });
                                    for (let col = 3; col <= 12; col++) elements.push({ row: 4, col, block: 'd', delay: 0.3 + col * 0.02 });
                                    for (let col = 13; col <= 18; col++) elements.push({ row: 4, col, block: 'p', delay: 0.3 + col * 0.02 });
                                    
                                    // Period 5: Rb-Xe
                                    for (let col = 1; col <= 2; col++) elements.push({ row: 5, col, block: 's', delay: 0.4 + col * 0.02 });
                                    for (let col = 3; col <= 12; col++) elements.push({ row: 5, col, block: 'd', delay: 0.4 + col * 0.02 });
                                    for (let col = 13; col <= 18; col++) elements.push({ row: 5, col, block: 'p', delay: 0.4 + col * 0.02 });
                                    
                                    // Period 6: Cs-Rn (with lanthanide gap)
                                    for (let col = 1; col <= 2; col++) elements.push({ row: 6, col, block: 's', delay: 0.5 + col * 0.02 });
                                    elements.push({ row: 6, col: 3, block: 'f', delay: 0.52, isLanthanide: true }); // La placeholder
                                    for (let col = 4; col <= 12; col++) elements.push({ row: 6, col, block: 'd', delay: 0.5 + col * 0.02 });
                                    for (let col = 13; col <= 18; col++) elements.push({ row: 6, col, block: 'p', delay: 0.5 + col * 0.02 });
                                    
                                    // Period 7: Fr-Og (with actinide gap)
                                    for (let col = 1; col <= 2; col++) elements.push({ row: 7, col, block: 's', delay: 0.6 + col * 0.02 });
                                    elements.push({ row: 7, col: 3, block: 'f', delay: 0.62, isActinide: true }); // Ac placeholder
                                    for (let col = 4; col <= 12; col++) elements.push({ row: 7, col, block: 'd', delay: 0.6 + col * 0.02 });
                                    for (let col = 13; col <= 18; col++) elements.push({ row: 7, col, block: 'p', delay: 0.6 + col * 0.02 });
                                    
                                    return elements.map((elem, idx) => {
                                        const [gradient, shadow] = blockColors[elem.block as keyof typeof blockColors];
                                        const isSpecial = elem.isLanthanide || elem.isActinide;
                                        
                                        return (
                                            <motion.div
                                                key={`${elem.row}-${elem.col}`}
                                                initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
                                                animate={{ 
                                                    opacity: [0.6, 1, 0.6],
                                                    scale: [0.95, 1, 0.95],
                                                    rotateY: 0,
                                                }}
                                                transition={{
                                                    opacity: {
                                                        duration: 3,
                                                        delay: elem.delay,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    },
                                                    scale: {
                                                        duration: 3,
                                                        delay: elem.delay,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    },
                                                    rotateY: {
                                                        duration: 0.6,
                                                        delay: elem.delay,
                                                        ease: "backOut"
                                                    }
                                                }}
                                                style={{
                                                    gridColumn: elem.col,
                                                    gridRow: elem.row,
                                                }}
                                                className={`relative aspect-square rounded-lg backdrop-blur-md bg-gradient-to-br ${gradient} border border-white/30 ${shadow} shadow-lg overflow-hidden group cursor-pointer`}
                                            >
                                                {/* Shimmer effect */}
                                                <motion.div
                                                    animate={{
                                                        x: ['-100%', '200%'],
                                                        opacity: [0, 1, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2.5,
                                                        delay: elem.delay + 1,
                                                        repeat: Infinity,
                                                        repeatDelay: 3,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                                />
                                                
                                                {/* Inner glow */}
                                                <motion.div
                                                    animate={{
                                                        opacity: [0.3, 0.7, 0.3],
                                                        scale: [0.8, 1.2, 0.8],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        delay: elem.delay + 0.5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute inset-0 bg-gradient-radial from-white/40 via-transparent to-transparent blur-sm"
                                                />
                                                
                                                {/* Particle effect for special elements */}
                                                {isSpecial && (
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [0.5, 0, 0.5],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            delay: elem.delay,
                                                            repeat: Infinity,
                                                            ease: "easeOut"
                                                        }}
                                                        className="absolute inset-0 rounded-lg border-2 border-white/50"
                                                    />
                                                )}
                                                
                                                {/* Hover glow */}
                                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300" />
                                            </motion.div>
                                        );
                                    });
                                })()}
                            </div>
                        </motion.div>

                        {/* Right: Text content */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col justify-center"
                        >
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mb-6"
                            >
                                <h3 className="text-3xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    Test Your Periodic Table Memory
                                </h3>
                                <p className="text-gray-300 text-base mb-3 leading-relaxed">
                                    Can you place each element in its correct position? Challenge yourself!
                                </p>
                                <p className="text-cyan-400 text-sm font-semibold">
                                    🧠 Click on the grid where each element belongs
                                </p>
                            </motion.div>

                            {/* Block filter */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mb-8"
                            >
                                <p className="text-gray-400 text-sm mb-3 font-medium">Choose practice mode:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'all', label: 'All Elements', color: 'gray' },
                                        { id: 's', label: 's-Block', color: 'red' },
                                        { id: 'p', label: 'p-Block', color: 'green' },
                                        { id: 'd', label: 'd-Block', color: 'blue' },
                                    ].map(block => (
                                        <button
                                            key={block.id}
                                            onClick={() => setBlockFilter(block.id as BlockFilter)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                                                blockFilter === block.id
                                                    ? 'text-white shadow-lg'
                                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border-gray-700'
                                            }`}
                                            style={{
                                                backgroundColor: blockFilter === block.id
                                                    ? block.id === 's' ? '#ef4444'
                                                        : block.id === 'p' ? '#22c55e'
                                                            : block.id === 'd' ? '#3b82f6'
                                                                : '#6b7280'
                                                    : undefined,
                                                borderColor: blockFilter === block.id
                                                    ? block.id === 's' ? '#f87171'
                                                        : block.id === 'p' ? '#4ade80'
                                                            : block.id === 'd' ? '#60a5fa'
                                                                : '#9ca3af'
                                                    : undefined
                                            }}
                                        >
                                            {block.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startGame}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                            >
                                <Play size={20} />
                                Start Practice
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {gameState === 'playing' && currentElement && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Current element card */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <motion.div
                                key={currentElement.atomicNumber}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 rounded-xl p-4 text-center min-w-[120px]"
                            >
                                <div className="text-xs text-cyan-300 mb-1">Place this element:</div>
                                <div className="text-3xl font-bold text-white">{currentElement.symbol}</div>
                                <div className="text-sm text-cyan-200">{currentElement.name}</div>
                            </motion.div>

                            {/* Hint button */}
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${showHint ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                            >
                                <Lightbulb size={20} />
                                <span className="text-xs">Hint</span>
                            </button>
                        </div>

                        {/* Hint display */}
                        {showHint && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-sm text-yellow-300 mb-3 bg-yellow-500/10 rounded-lg py-2"
                            >
                                💡 Period {currentElement.period}, Group {currentElement.group} ({currentElement.block}-block)
                            </motion.div>
                        )}

                        {/* Quiz grid */}
                        <div className="overflow-x-auto pb-2">
                            <div
                                className="grid gap-0.5 min-w-[600px]"
                                style={{
                                    gridTemplateColumns: 'repeat(18, minmax(32px, 1fr))',
                                    gridTemplateRows: 'repeat(7, minmax(40px, auto))',
                                }}
                            >
                                {renderQuizGrid()}
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{currentIndex + 1} / {totalElements}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIndex + (feedback?.type === 'correct' ? 1 : 0)) / totalElements) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {gameState === 'finished' && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-500/30"
                        >
                            <Trophy className="text-white" size={40} />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-white mb-2">Great Job! 🎉</h3>

                        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
                            <div className="bg-gray-700/50 rounded-xl p-3">
                                <div className="text-2xl font-bold text-green-400">{score}</div>
                                <div className="text-xs text-gray-400">Correct</div>
                            </div>
                            <div className="bg-gray-700/50 rounded-xl p-3">
                                <div className="text-2xl font-bold text-orange-400">{bestStreak}</div>
                                <div className="text-xs text-gray-400">Best Streak</div>
                            </div>
                            <div className="bg-gray-700/50 rounded-xl p-3">
                                <div className="text-2xl font-bold text-cyan-400">{Math.round(elapsedTime / 1000)}s</div>
                                <div className="text-xs text-gray-400">Time</div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-400 mb-6">
                            Accuracy: {Math.round((score / attempts) * 100)}% ({score}/{attempts} attempts)
                        </div>

                        <button
                            onClick={startGame}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
                        >
                            <RotateCcw size={20} />
                            Play Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
