'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Beaker,
    FlaskConical,
    Flame,
    Play,
    RotateCcw,
    Trophy,
    Clock,
    CheckCircle2,
    XCircle,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Eye,
    FileText,
    Sparkles,
    Target,
    GraduationCap,
    Timer,
    HelpCircle,
    ArrowRight,
    Check,
    BookOpen,
} from 'lucide-react';
import SaltAnalysisGuide from './SaltAnalysisGuide';
import {
    ANIONS,
    CATIONS,
    SALTS,
    CATION_GROUPS,
    ANION_GROUPS,
    getAnionById,
    getCationById,
    getRandomSalt,
    type Salt,
    type Anion,
    type Cation,
} from '../lib/saltAnalysisData';

type GameMode = 'learning' | 'practice' | 'exam';
type GameState = 'idle' | 'playing' | 'finished';
type AnalysisStage = 'preliminary' | 'anion' | 'cation' | 'confirmatory' | 'result';

interface Observation {
    testName: string;
    observation: string;
    inference: string;
    type: 'preliminary' | 'anion' | 'cation';
    isCorrect?: boolean;
}

// Mode selection cards
const ModeCard = ({ mode, icon: Icon, title, desc, color, onStart }: { mode: GameMode; icon: any; title: string; desc: string; color: string; onStart: (mode: GameMode) => void }) => {
    // Extract base color class for conditional styling
    const getBaseColor = (colorClass: string) => {
        if (colorClass.includes('cyan')) return 'cyan';
        if (colorClass.includes('orange')) return 'orange';
        return 'red';
    };

    const baseColor = getBaseColor(color);

    const styles = {
        cyan: {
            bg: 'bg-gradient-to-br from-gray-800 to-cyan-900/40',
            border: 'border-cyan-500/30 hover:border-cyan-400',
            iconBg: 'bg-cyan-500/20',
            iconText: 'text-cyan-400',
            glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]'
        },
        orange: {
            bg: 'bg-gradient-to-br from-gray-800 to-orange-900/40',
            border: 'border-orange-500/30 hover:border-orange-400',
            iconBg: 'bg-orange-500/20',
            iconText: 'text-orange-400',
            glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(251,146,60,0.3)]'
        },
        red: {
            bg: 'bg-gradient-to-br from-gray-800 to-red-900/40',
            border: 'border-red-500/30 hover:border-red-400',
            iconBg: 'bg-red-500/20',
            iconText: 'text-red-400',
            glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(248,113,113,0.3)]'
        }
    }[baseColor];

    return (
        <motion.button
            onClick={() => onStart(mode)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${styles.bg} ${styles.border} ${styles.glow} group relative overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 p-32 opacity-10 bg-gradient-to-br from-transparent to-${baseColor}-500 blur-3xl rounded-full translate-x-12 -translate-y-12 transition-opacity group-hover:opacity-20`} />

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${styles.iconBg}`}>
                <Icon className={styles.iconText} size={28} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-base text-gray-400 leading-relaxed mb-6">{desc}</p>

            <div className="flex items-center gap-2 text-base font-bold group-hover:gap-3 transition-all">
                <span className={styles.iconText}>Start Now</span>
                <ArrowRight size={20} className={styles.iconText} />
            </div>
        </motion.button>
    );
};

// Test button component
const TestButton = ({ id, name, procedure, onPerform, isExpanded, onToggle }: { id: string; name: string; procedure: string; onPerform: () => void; isExpanded: boolean; onToggle: () => void }) => (
    <div className="bg-gray-700/50 rounded-xl overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-600/50 transition-colors"
        >
            <span className="text-base font-semibold text-white">{name}</span>
            <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
        </button>
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 pt-0 space-y-3">
                        <p className="text-sm text-gray-300">{procedure}</p>
                        <button
                            onClick={onPerform}
                            className="w-full py-3 bg-cyan-500/20 text-cyan-400 rounded-lg text-base font-semibold hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                        >
                            <Beaker size={18} />
                            Perform Test
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default function SaltAnalysisClient() {
    const [gameMode, setGameMode] = useState<GameMode>('learning');
    const [gameState, setGameState] = useState<GameState>('idle');
    const [currentSalt, setCurrentSalt] = useState<Salt | null>(null);
    const [stage, setStage] = useState<AnalysisStage>('preliminary');
    const [observations, setObservations] = useState<Observation[]>([]);
    const [identifiedAnion, setIdentifiedAnion] = useState<string | null>(null);
    const [identifiedCation, setIdentifiedCation] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [score, setScore] = useState(0);
    const [expandedTest, setExpandedTest] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for exam

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && gameMode === 'exam') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        submitAnswer();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, gameMode]);

    const saltCation = useMemo(() => currentSalt ? getCationById(currentSalt.cation) : null, [currentSalt]);
    const saltAnion = useMemo(() => currentSalt ? getAnionById(currentSalt.anion) : null, [currentSalt]);

    // Start game
    const startGame = (mode: GameMode) => {
        setGameMode(mode);
        setGameState('playing');
        const salt = getRandomSalt();
        setCurrentSalt(salt);
        setStage('preliminary');
        setObservations([]);
        setIdentifiedAnion(null);
        setIdentifiedCation(null);
        setShowHint(false);
        setStartTime(Date.now());
        setElapsedTime(0);
        setScore(0);
        setExpandedTest(null);
        setTimeLeft(600); // Reset timer to 10 mins
    };

    // Perform a test
    const performTest = (testType: 'preliminary' | 'anion' | 'cation', testId: string, testName: string) => {
        if (!currentSalt || !saltAnion || !saltCation) return;

        let observation = '';
        let inference = '';

        // Determine observation based on test type
        if (testType === 'preliminary') {
            if (testId === 'color') {
                observation = `The salt is ${currentSalt.color} in colour.`;
                if (currentSalt.color === 'Blue') inference = 'Cu²⁺ may be present';
                else if (currentSalt.color === 'Green') inference = 'Fe²⁺ or Ni²⁺ may be present';
                else if (currentSalt.color === 'Pink') inference = 'Mn²⁺ or Co²⁺ may be present';
                else inference = 'Coloured cations may be absent';
            } else if (testId === 'heating') {
                observation = currentSalt.colorOnHeating
                    ? `On heating, the salt turns ${currentSalt.colorOnHeating}.`
                    : 'No significant colour change on heating.';
                inference = currentSalt.colorOnHeating ? `Possible: ${saltCation.symbol}` : 'Continue with further tests';
            } else if (testId === 'flame') {
                if (saltCation.flameTest) {
                    observation = `${saltCation.flameTest.nakedEye} flame observed.`;
                    inference = `${saltCation.symbol} may be present`;
                } else {
                    observation = 'No characteristic flame colour observed.';
                    inference = 'Ca²⁺, Sr²⁺, Ba²⁺, Cu²⁺ may be absent';
                }
            }
        } else if (testType === 'anion') {
            if (testId === 'dilH2SO4') {
                if (saltAnion.group === 'A') {
                    observation = saltAnion.preliminaryTest.observation;
                    inference = `${saltAnion.symbol} (${saltAnion.name}) may be present`;
                } else {
                    observation = 'No gas evolved. No effervescence observed.';
                    inference = 'Group A anions (CO₃²⁻, S²⁻, SO₃²⁻, NO₂⁻, CH₃COO⁻) are absent';
                }
            } else if (testId === 'concH2SO4') {
                if (saltAnion.group === 'B') {
                    observation = saltAnion.preliminaryTest.observation;
                    inference = `${saltAnion.symbol} (${saltAnion.name}) may be present`;
                } else {
                    observation = 'No characteristic gas evolved.';
                    inference = 'Group B anions (Cl⁻, Br⁻, I⁻, NO₃⁻, C₂O₄²⁻) may be absent';
                }
            } else if (testId.startsWith('confirm_')) {
                const confirmTest = saltAnion.confirmatoryTests[0];
                if (confirmTest) {
                    observation = confirmTest.observation;
                    inference = `${saltAnion.symbol} confirmed!`;
                }
            }
        } else if (testType === 'cation') {
            if (testId === 'groupTest') {
                const group = CATION_GROUPS.find(g => g.group === saltCation.group);
                if (group) {
                    observation = saltCation.precipitateColor
                        ? `${saltCation.precipitateColor} precipitate formed with ${group.reagent}.`
                        : `Tested with ${group.reagent}. Precipitate observed.`;
                    inference = `Cation belongs to ${group.name}`;
                }
            } else if (testId.startsWith('confirm_')) {
                const confirmTest = saltCation.confirmatoryTests[0];
                if (confirmTest) {
                    observation = confirmTest.observation;
                    inference = `${saltCation.symbol} confirmed!`;
                }
            }
        }

        const newObs: Observation = {
            testName,
            observation,
            inference,
            type: testType,
            isCorrect: true
        };

        setObservations(prev => [...prev, newObs]);
        setExpandedTest(null);
    };

    // Submit final answer
    const submitAnswer = () => {
        if (!currentSalt || !identifiedAnion || !identifiedCation) return;

        const isCorrect = identifiedAnion === currentSalt.anion && identifiedCation === currentSalt.cation;
        setElapsedTime(Date.now() - startTime);

        if (isCorrect) {
            setScore(100);
        } else {
            setScore(identifiedAnion === currentSalt.anion ? 50 : 0);
            setScore(prev => prev + (identifiedCation === currentSalt.cation ? 50 : 0));
        }

        setGameState('finished');
    };



    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-24 sm:pt-28">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full mb-4 border border-green-500/30"
                    >
                        <span className="text-sm font-medium text-green-300">End your Salt Analysis struggles forever!</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        Salt Analysis Simulator
                    </h1>

                    <p className="text-gray-300 mt-2 text-lg sm:text-xl max-w-2xl mx-auto">
                        Master NCERT qualitative analysis with confidence. Practice like a pro, score like a topper! 🎯
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* Mode Selection */}
                    {gameState === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-semibold text-white mb-2">Select Your Mode</h2>
                                <p className="text-gray-400">Choose how you want to practice</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <ModeCard
                                    mode="learning"
                                    icon={GraduationCap}
                                    title="Learning Mode"
                                    desc="Step-by-step guided analysis with hints and explanations"
                                    color="bg-gray-800/50 border-cyan-500/30 hover:border-cyan-400"
                                    onStart={startGame}
                                />
                                <ModeCard
                                    mode="practice"
                                    icon={Target}
                                    title="Practice Mode"
                                    desc="Random salt, self-paced analysis without time limit"
                                    color="bg-gray-800/50 border-orange-500/30 hover:border-orange-400"
                                    onStart={startGame}
                                />
                                <ModeCard
                                    mode="exam"
                                    icon={Timer}
                                    title="Exam Mode"
                                    desc="Timed analysis simulating CBSE practical exam"
                                    color="bg-gray-800/50 border-red-500/30 hover:border-red-400"
                                    onStart={startGame}
                                />
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-800/30 rounded-xl p-4">
                                    <div className="text-2xl font-bold text-cyan-400">{ANIONS.length}</div>
                                    <div className="text-xs text-gray-400">Anions</div>
                                </div>
                                <div className="bg-gray-800/30 rounded-xl p-4">
                                    <div className="text-2xl font-bold text-green-400">{CATIONS.length}</div>
                                    <div className="text-xs text-gray-400">Cations</div>
                                </div>
                                <div className="bg-gray-800/30 rounded-xl p-4">
                                    <div className="text-2xl font-bold text-purple-400">{SALTS.length}</div>
                                    <div className="text-xs text-gray-400">Salts</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Playing State */}
                    {gameState === 'playing' && currentSalt && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-6xl mx-auto"
                        >
                            {/* Navigation Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <button
                                    onClick={() => setGameState('idle')}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                    <span className="font-medium">Back to Menu</span>
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => startGame(gameMode)}
                                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 transition-colors"
                                    >
                                        <RotateCcw size={18} />
                                        <span className="font-medium">New Salt</span>
                                    </button>
                                    <button
                                        onClick={() => setGameState('idle')}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 transition-colors"
                                    >
                                        <XCircle size={18} />
                                        <span className="font-medium">Quit Analysis</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Left: Salt Sample & Tests */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Salt Sample Card */}
                                    <div className="bg-gradient-to-br from-gray-800/80 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    <FlaskConical size={24} className="text-cyan-400" />
                                                    Unknown Salt Sample
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${gameMode === 'learning' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                                                    gameMode === 'practice' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                        'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                                                    }`}>
                                                    {gameMode} Mode
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {gameMode === 'exam' && (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                                                        <Clock size={16} />
                                                        <span className="font-mono font-bold">
                                                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                )}
                                                {gameMode === 'learning' && (
                                                    <button
                                                        onClick={() => setShowHint(!showHint)}
                                                        className={`p-2 rounded-lg transition-colors ${showHint ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                                    >
                                                        <Lightbulb size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Salt Visual */}
                                        <div className="flex items-center gap-6">
                                            <div
                                                className="w-24 h-24 rounded-2xl border-2 border-gray-600 flex items-center justify-center"
                                                style={{ backgroundColor: currentSalt.colorHex + '40' }}
                                            >
                                                <div
                                                    className="w-16 h-16 rounded-full"
                                                    style={{ backgroundColor: currentSalt.colorHex }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-base">Appearance</p>
                                                <p className="text-white font-semibold text-lg">{currentSalt.color} crystalline solid</p>
                                                <p className="text-gray-400 text-base mt-3">Solubility</p>
                                                <p className="text-white font-semibold text-lg capitalize">{currentSalt.solubility} in water</p>
                                            </div>
                                        </div>

                                        {showHint && gameMode === 'learning' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
                                            >
                                                <p className="text-sm text-yellow-300">
                                                    💡 Hint: This salt is {currentSalt.name} ({currentSalt.formula})
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Test Sections */}
                                    <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                                        <h3 className="text-xl font-bold text-white mb-4">Perform Tests</h3>

                                        {/* Stage Tabs */}
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                            {['preliminary', 'anion', 'cation', 'confirmatory'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStage(s as AnalysisStage)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${stage === s
                                                        ? 'bg-cyan-500 text-white'
                                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Test Options */}
                                        <div className="space-y-2">
                                            {stage === 'preliminary' && (
                                                <>
                                                    <TestButton
                                                        id="color"
                                                        name="Color Observation"
                                                        procedure="Observe the colour of the given salt sample."
                                                        onPerform={() => performTest('preliminary', 'color', 'Color Observation')}
                                                        isExpanded={expandedTest === 'color'}
                                                        onToggle={() => setExpandedTest(expandedTest === 'color' ? null : 'color')}
                                                    />
                                                    <TestButton
                                                        id="heating"
                                                        name="Dry Heating Test"
                                                        procedure="Heat 0.5 g of salt in a dry test tube and note changes."
                                                        onPerform={() => performTest('preliminary', 'heating', 'Dry Heating Test')}
                                                        isExpanded={expandedTest === 'heating'}
                                                        onToggle={() => setExpandedTest(expandedTest === 'heating' ? null : 'heating')}
                                                    />
                                                    <TestButton
                                                        id="flame"
                                                        name="Flame Test"
                                                        procedure="Prepare paste with conc. HCl and perform flame test."
                                                        onPerform={() => performTest('preliminary', 'flame', 'Flame Test')}
                                                        isExpanded={expandedTest === 'flame'}
                                                        onToggle={() => setExpandedTest(expandedTest === 'flame' ? null : 'flame')}
                                                    />
                                                </>
                                            )}

                                            {stage === 'anion' && (
                                                <>
                                                    <TestButton
                                                        id="dilH2SO4"
                                                        name="Dilute H₂SO₄ Test"
                                                        procedure="Add dilute H₂SO₄ to salt and observe gas evolution."
                                                        onPerform={() => performTest('anion', 'dilH2SO4', 'Dilute H₂SO₄ Test')}
                                                        isExpanded={expandedTest === 'dilH2SO4'}
                                                        onToggle={() => setExpandedTest(expandedTest === 'dilH2SO4' ? null : 'dilH2SO4')}
                                                    />
                                                    <TestButton
                                                        id="concH2SO4"
                                                        name="Concentrated H₂SO₄ Test"
                                                        procedure="Add conc. H₂SO₄ to salt carefully and observe."
                                                        onPerform={() => performTest('anion', 'concH2SO4', 'Conc. H₂SO₄ Test')}
                                                        isExpanded={expandedTest === 'concH2SO4'}
                                                        onToggle={() => setExpandedTest(expandedTest === 'concH2SO4' ? null : 'concH2SO4')}
                                                    />
                                                    {saltAnion && (
                                                        <TestButton
                                                            id={`confirm_anion_${saltAnion.id}`}
                                                            name={`Confirmatory: ${saltAnion.confirmatoryTests[0]?.testName || 'Test'}`}
                                                            procedure={saltAnion.confirmatoryTests[0]?.procedure || ''}
                                                            onPerform={() => performTest('anion', `confirm_${saltAnion.id}`, saltAnion.confirmatoryTests[0]?.testName || 'Confirmatory Test')}
                                                            isExpanded={expandedTest === `confirm_anion_${saltAnion.id}`}
                                                            onToggle={() => setExpandedTest(expandedTest === `confirm_anion_${saltAnion.id}` ? null : `confirm_anion_${saltAnion.id}`)}
                                                        />
                                                    )}
                                                </>
                                            )}

                                            {stage === 'cation' && (
                                                <>
                                                    <TestButton
                                                        id="groupTest"
                                                        name="Group Reagent Test"
                                                        procedure="Perform systematic group analysis starting with dil. HCl."
                                                        onPerform={() => performTest('cation', 'groupTest', 'Group Reagent Test')}
                                                        isExpanded={expandedTest === 'groupTest'}
                                                        onToggle={() => setExpandedTest(expandedTest === 'groupTest' ? null : 'groupTest')}
                                                    />
                                                    {saltCation && (
                                                        <TestButton
                                                            id={`confirm_cation_${saltCation.id}`}
                                                            name={`Confirmatory: ${saltCation.confirmatoryTests[0]?.testName || 'Test'}`}
                                                            procedure={saltCation.confirmatoryTests[0]?.procedure || ''}
                                                            onPerform={() => performTest('cation', `confirm_${saltCation.id}`, saltCation.confirmatoryTests[0]?.testName || 'Confirmatory Test')}
                                                            isExpanded={expandedTest === `confirm_cation_${saltCation.id}`}
                                                            onToggle={() => setExpandedTest(expandedTest === `confirm_cation_${saltCation.id}` ? null : `confirm_cation_${saltCation.id}`)}
                                                        />
                                                    )}
                                                </>
                                            )}

                                            {stage === 'confirmatory' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Identified Anion:</label>
                                                        <select
                                                            value={identifiedAnion || ''}
                                                            onChange={(e) => setIdentifiedAnion(e.target.value)}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:outline-none"
                                                        >
                                                            <option value="">Select Anion</option>
                                                            {ANIONS.map((a) => (
                                                                <option key={a.id} value={a.id}>{a.symbol} - {a.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-2">Identified Cation:</label>
                                                        <select
                                                            value={identifiedCation || ''}
                                                            onChange={(e) => setIdentifiedCation(e.target.value)}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-cyan-500 focus:outline-none"
                                                        >
                                                            <option value="">Select Cation</option>
                                                            {CATIONS.map((c) => (
                                                                <option key={c.id} value={c.id}>{c.symbol} - {c.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={submitAnswer}
                                                        disabled={!identifiedAnion || !identifiedCation}
                                                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Check size={20} />
                                                        Submit Answer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Observations Log */}
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-gray-800/80 to-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <FileText size={24} className="text-green-400" />
                                            Observations Log
                                        </h3>

                                        {observations.length === 0 ? (
                                            <p className="text-gray-400 text-base text-center py-8">
                                                Perform tests to record observations
                                            </p>
                                        ) : (
                                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                {observations.map((obs, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="p-3 bg-gray-700/50 rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs px-2 py-0.5 rounded ${obs.type === 'preliminary' ? 'bg-blue-500/20 text-blue-400' :
                                                                obs.type === 'anion' ? 'bg-purple-500/20 text-purple-400' :
                                                                    'bg-orange-500/20 text-orange-400'
                                                                }`}>
                                                                {obs.type}
                                                            </span>
                                                            <span className="text-lg font-semibold text-white">{obs.testName}</span>
                                                        </div>
                                                        <p className="text-base text-gray-300">{obs.observation}</p>
                                                        {gameMode !== 'exam' ? (
                                                            <p className="text-base text-green-400 mt-1 font-medium">→ {obs.inference}</p>
                                                        ) : (
                                                            <p className="text-sm text-gray-500 mt-1 italic">→ Inference hidden in Exam Mode</p>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Reference */}
                                    {gameMode === 'learning' && (
                                        <div className="bg-gradient-to-br from-gray-800/80 to-yellow-900/30 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                                            <h4 className="text-lg font-bold text-white mb-3">📚 Quick Reference</h4>
                                            <div className="text-base text-gray-300 space-y-2">
                                                <p>• <span className="text-cyan-400 font-medium">Group A</span> (dil. H₂SO₄): CO₃²⁻, S²⁻, SO₃²⁻, NO₂⁻, CH₃COO⁻</p>
                                                <p>• <span className="text-purple-400 font-medium">Group B</span> (conc. H₂SO₄): Cl⁻, Br⁻, I⁻, NO₃⁻, C₂O₄²⁻</p>
                                                <p>• <span className="text-orange-400 font-medium">Independent</span>: SO₄²⁻, PO₄³⁻</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Finished State */}
                    {gameState === 'finished' && currentSalt && (
                        <motion.div
                            key="finished"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${score === 100 ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-orange-400 to-red-500'
                                    }`}
                            >
                                {score === 100 ? <Trophy className="text-white" size={48} /> : <Target className="text-white" size={48} />}
                            </motion.div>

                            <h2 className="text-2xl font-bold text-white mb-2">
                                {score === 100 ? 'Excellent! 🎉' : 'Good Try!'}
                            </h2>
                            <p className="text-gray-400 mb-6">
                                {score === 100 ? 'You correctly identified the salt!' : 'Keep practicing to improve!'}
                            </p>

                            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Your Answer</p>
                                        <p className="text-lg font-bold text-white">
                                            {identifiedCation && getCationById(identifiedCation)?.symbol} + {identifiedAnion && getAnionById(identifiedAnion)?.symbol}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Correct Answer</p>
                                        <p className="text-lg font-bold text-green-400">
                                            {currentSalt.formula} ({currentSalt.name})
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                                    <div>
                                        <p className="text-2xl font-bold text-cyan-400">{score}%</p>
                                        <p className="text-xs text-gray-400">Score</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-400">{observations.length}</p>
                                        <p className="text-xs text-gray-400">Tests Done</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-purple-400">{Math.round(elapsedTime / 1000)}s</p>
                                        <p className="text-xs text-gray-400">Time</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => startGame(gameMode)}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2"
                                >
                                    <RotateCcw size={20} />
                                    Try Another Salt
                                </button>
                                <button
                                    onClick={() => setGameState('idle')}
                                    className="px-6 py-3 bg-gray-700 text-white font-medium rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    Change Mode
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Revision Guide Section */}
            <SaltAnalysisGuide />
        </div>
    );
}
