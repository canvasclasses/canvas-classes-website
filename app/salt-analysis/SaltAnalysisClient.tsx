'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
    Zap,
    Network,
} from 'lucide-react';
import SaltAnalysisHero from './SaltAnalysisHero';
import FloatingNav from './FloatingNav';
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

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="w-full h-64 bg-gray-800/50 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
    </div>
);

// Dynamic imports for heavy components - these load on-demand
const FlameTestSimulator = dynamic(() => import('./FlameTestSimulator'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const DryHeatingTest = dynamic(() => import('./DryHeatingTest'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const BoraxBeadTest = dynamic(() => import('./BoraxBeadTest'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const CationFlowchartSimulator = dynamic(() => import('./CationFlowchartSimulator'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const AnionFlowchartSimulator = dynamic(() => import('./AnionFlowchartSimulator'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const CationSchemeFlowchart = dynamic(() => import('./CationSchemeFlowchart'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const ReagentReactionTables = dynamic(() => import('./ReagentReactionTables'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const SaltAnalysisGuide = dynamic(() => import('./SaltAnalysisGuide'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});

const SaltAnalysisQuiz = dynamic(() => import('./SaltAnalysisQuiz'), {
    loading: () => <LoadingSkeleton />,
    ssr: false
});



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
// Mode selection cards


// Test button component
const TestButton = ({ id, name, procedure, onPerform, isExpanded, onToggle }: { id: string; name: string; procedure: string; onPerform: () => void; isExpanded: boolean; onToggle: () => void }) => (
    <div className="bg-gray-700/50 rounded-lg md:rounded-xl overflow-hidden border border-gray-600/30">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-gray-600/50 transition-colors text-left"
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



const CONCEPTUAL_QUESTIONS = [
    {
        id: 'pb',
        label: 'The Ambiguous Behaviour of Lead',
        color: 'text-purple-400',
        question: 'Why does Lead (Pb²⁺) partially precipitate in Group I and then reappear in Group II analysis?',
        answer: `<strong>Simple Explanation:</strong> Lead chloride (PbCl₂) is a bit of a "drama queen" among salts – it doesn't fully dissolve, but it also doesn't fully precipitate!<br/><br/>

<strong>What happens step by step:</strong><br/>
1. When you add dilute HCl (Group I reagent) to your salt solution, PbCl₂ forms as a white precipitate.<br/>
2. But here's the catch – PbCl₂ is <em>slightly soluble</em> in cold water. So not all of it settles down.<br/>
3. Some Pb²⁺ ions escape into the filtrate (the liquid that passes through).<br/>
4. When this filtrate reaches Group II (where we pass H₂S in acidic medium), these remaining Pb²⁺ ions form black PbS precipitate.<br/><br/>

<strong>Pro Tip:</strong> This is why Lead can appear in <em>both</em> Group I and Group II! In exams, if you see white ppt in Group I AND black ppt in Group II, think of Lead first.`
    },
    {
        id: 'group2',
        label: 'Separating Group II Sub-groups',
        color: 'text-yellow-400',
        question: 'How can we chemically distinguish and separate the Copper Group (IIA) from the Arsenic Group (IIB)?',
        answer: `<strong>The Problem:</strong> Group II has too many cations! So we divide it into two sub-groups:<br/>
• <strong>Group IIA (Copper Group):</strong> Cu²⁺, Pb²⁺, Bi³⁺, Cd²⁺, Hg²⁺<br/>
• <strong>Group IIB (Arsenic Group):</strong> As³⁺, Sb³⁺, Sn²⁺, Sn⁴⁺<br/><br/>

<strong>The Magic Reagent:</strong> Yellow Ammonium Polysulphide [(NH₄)₂Sₓ]<br/><br/>

<strong>How it works:</strong><br/>
1. Take all the Group II sulphide precipitates.<br/>
2. Add Yellow Ammonium Polysulphide to them.<br/>
3. <strong>Group IIB sulphides dissolve</strong> – they form soluble "thio-salts" (sulphur-containing complexes).<br/>
4. <strong>Group IIA sulphides don't dissolve</strong> – they remain as residue.<br/><br/>

<strong>Why does this happen?</strong> The Arsenic group metals (As, Sb, Sn) are acidic in nature and can form thio-anions. Copper group metals cannot do this.<br/><br/>

<strong>Easy Memory Trick:</strong> "A-S-S" dissolve (As, Sb, Sn) = Arsenic group = Soluble in yellow ammonium sulphide!`
    },
    {
        id: 'h2s_medium',
        label: 'The Role of pH in Precipitation',
        color: 'text-green-400',
        question: 'Why is H₂S passed in an acidic medium for Group II but strictly alkaline medium for Group IV?',
        answer: `<strong>This is the MOST important concept in Salt Analysis!</strong><br/><br/>

<strong>The Key Principle:</strong> Ksp (Solubility Product)<br/>
• Every sparingly soluble salt has a Ksp value.<br/>
• <em>Precipitation happens only when Ionic Product > Ksp</em><br/><br/>

<strong>For Group II (Acidic Medium – add HCl):</strong><br/>
• Group II sulphides (CuS, PbS, etc.) have <strong>very low Ksp</strong> values.<br/>
• This means even a <em>tiny amount</em> of S²⁻ ions is enough to precipitate them.<br/>
• HCl keeps the medium acidic, which <strong>suppresses the ionization of H₂S</strong> (Common Ion Effect with H⁺).<br/>
• So we get low [S²⁻], but it's still enough for Group II!<br/><br/>

<strong>For Group IV (Alkaline Medium – add NH₄OH):</strong><br/>
• Group IV sulphides (ZnS, NiS, CoS, MnS) have <strong>high Ksp</strong> values.<br/>
• They need a <strong>lot of S²⁻ ions</strong> to precipitate.<br/>
• NH₄OH makes the medium basic, which <strong>increases the ionization of H₂S</strong>.<br/>
• More H₂S breaks down → More S²⁻ ions → Group IV precipitates!<br/><br/>

<strong>Think of it like this:</strong> Group II cations are "easy to catch" (low Ksp), Group IV cations are "hard to catch" (high Ksp). You need more S²⁻ "bait" for Group IV!`
    },
    {
        id: 'nh4cl_group3',
        label: 'Control of Hydroxide Concentration',
        color: 'text-pink-400',
        question: 'What is the specific role of NH₄Cl when adding NH₄OH during Group III Analysis?',
        answer: `<strong>The Situation:</strong> In Group III, we want to precipitate Fe(OH)₃, Al(OH)₃, and Cr(OH)₃ using NH₄OH.<br/><br/>

<strong>The Problem:</strong> If we add only NH₄OH, it gives too many OH⁻ ions! This would also precipitate:<br/>
• Mg(OH)₂ (which belongs to Group VI)<br/>
• Group IV cations as hydroxides<br/><br/>

<strong>The Solution:</strong> Add NH₄Cl along with NH₄OH!<br/><br/>

<strong>How NH₄Cl helps (Common Ion Effect):</strong><br/>
1. NH₄OH ⇌ NH₄⁺ + OH⁻ (this equilibrium gives us OH⁻)<br/>
2. When we add NH₄Cl, it fully dissociates: NH₄Cl → NH₄⁺ + Cl⁻<br/>
3. Now there's extra NH₄⁺ from NH₄Cl!<br/>
4. According to Le Chatelier's Principle, the equilibrium shifts LEFT.<br/>
5. This <strong>reduces the [OH⁻] concentration</strong> in solution.<br/><br/>

<strong>Result:</strong><br/>
• The reduced [OH⁻] is just enough to exceed the Ksp of Group III hydroxides (which have low Ksp).<br/>
• But NOT enough to precipitate Mg(OH)₂ and Group IV hydroxides (which have higher Ksp).<br/><br/>

<strong>Simple Analogy:</strong> Think of NH₄Cl as a "brake" that controls how much OH⁻ is released. Without the brake, too many unwanted cations would precipitate!`
    },
    {
        id: 'prevention_mg',
        label: 'Preventing Premature Precipitation',
        color: 'text-cyan-400',
        question: 'How does the Common Ion Effect protect Magnesium and Group IV cations from interfering early?',
        answer: `<strong>Why Magnesium is Special:</strong> Mg²⁺ belongs to Group VI, but Mg(OH)₂ can precipitate if [OH⁻] is too high during Group III or IV analysis!<br/><br/>

<strong>The Danger:</strong><br/>
• During Group III (NH₄OH + NH₄Cl), if [OH⁻] is not controlled, Mg(OH)₂ precipitates.<br/>
• During Group IV (H₂S + NH₄OH), same problem can occur.<br/>
• This would <strong>contaminate</strong> our Group III and IV precipitates!<br/><br/>

<strong>How Common Ion Effect Saves the Day:</strong><br/>
1. We add NH₄Cl in Group III (provides extra NH₄⁺).<br/>
2. We add NH₄Cl in Group V analysis too (when using (NH₄)₂CO₃).<br/>
3. The extra NH₄⁺ suppresses OH⁻ concentration.<br/>
4. Mg(OH)₂ has a relatively high Ksp, so this lower [OH⁻] won't precipitate it.<br/><br/>

<strong>Similarly for Group IV cations:</strong><br/>
• Zn(OH)₂, Mn(OH)₂, Ni(OH)₂, Co(OH)₂ all have higher Ksp than Group III hydroxides.<br/>
• The controlled [OH⁻] only precipitates Group III, leaving Group IV in solution for later.<br/><br/>

<strong>Key Takeaway:</strong> NH₄Cl is your "bodyguard" in salt analysis – it protects later groups from precipitating early!`
    },
    {
        id: 'zero',
        label: 'The Zero Group Exception',
        color: 'text-blue-400',
        question: 'Why must Ammonium (NH₄⁺) be analyzed in the original solution unlike all other cations?',
        answer: `<strong>The Unique Problem with NH₄⁺:</strong> During salt analysis, we add many ammonium-containing reagents:<br/>
• NH₄Cl (in Group III, IV, V)<br/>
• NH₄OH (in Group III, IV)<br/>
• (NH₄)₂CO₃ (in Group V)<br/>
• (NH₄)₂SO₄, (NH₄)₂C₂O₄ (in confirmatory tests)<br/><br/>

<strong>What happens if we test for NH₄⁺ after Group analysis?</strong><br/>
• All these added reagents contain NH₄⁺!<br/>
• The test would show <strong>positive result even if NH₄⁺ was not originally present</strong> in your salt!<br/>
• This is called a <strong>"False Positive"</strong> – a disaster in exams!<br/><br/>

<strong>The Solution:</strong><br/>
1. Test for NH₄⁺ in the <strong>original solution</strong> BEFORE starting group analysis.<br/>
2. Take a small portion of your original salt solution.<br/>
3. Add NaOH and heat gently.<br/>
4. If NH₄⁺ is present: NH₄⁺ + OH⁻ → NH₃↑ + H₂O<br/>
5. The ammonia gas has a sharp, pungent smell and turns moist red litmus paper blue.<br/><br/>

<strong>This is why NH₄⁺ is called "Zero Group":</strong> It must be tested at the very beginning (position zero), before we add any reagents that could interfere.<br/><br/>

<strong>Exam Tip:</strong> Always write "Test for NH₄⁺ in original solution" in your practical record!`
    }
];


export default function SaltAnalysisClient() {
    const [openFAQ, setOpenFAQ] = useState<string | null>(null);
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pb-32">
            <SaltAnalysisHero />

            {/* Floating Navigation for Mobile */}
            <FloatingNav />

            <div className="container mx-auto px-4 py-8 relative z-20 mt-10 md:-mt-20">
                <AnimatePresence mode="wait">
                    {/* Mode Selection */}
                    {gameState === 'idle' && (
                        <motion.div
                            id="mode-selection"
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="relative">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full -z-10" />

                                <div className="text-center mb-6 md:mb-12 mt-4 md:mt-0">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight">
                                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Path</span>
                                    </h2>
                                    <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
                                        Whether you're just starting or preparing for finals, we have a mode for you.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto px-2 md:px-4">
                                    {/* Learning Mode - Compact on mobile */}
                                    <button
                                        onClick={() => startGame('learning')}
                                        className="group relative bg-gray-900/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-cyan-500/50 rounded-2xl md:rounded-3xl p-4 md:p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] flex flex-col items-center text-center overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-800 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-cyan-500/50 shadow-lg">
                                            <GraduationCap size={24} className="text-cyan-400 md:hidden" />
                                            <GraduationCap size={40} className="text-cyan-400 hidden md:block" />
                                        </div>

                                        <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-cyan-300 transition-colors">The Apprentice</h3>
                                        <p className="text-cyan-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4">Learning Mode</p>
                                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-8 hidden md:block">
                                            Step-by-step guidance with real-time hints. Perfect for your first analysis.
                                        </p>

                                        <div className="mt-auto flex items-center gap-1.5 md:gap-2 text-cyan-400 font-bold text-sm md:text-base group-hover:gap-3 transition-all">
                                            Start <ArrowRight size={14} className="md:hidden" /><ArrowRight size={18} className="hidden md:block" />
                                        </div>
                                    </button>

                                    {/* Practice Mode - Compact on mobile */}
                                    <button
                                        onClick={() => startGame('practice')}
                                        className="group relative bg-gray-900/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-purple-500/50 rounded-2xl md:rounded-3xl p-4 md:p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] flex flex-col items-center text-center overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-800 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-purple-500/50 shadow-lg">
                                            <FlaskConical size={24} className="text-purple-400 md:hidden" />
                                            <FlaskConical size={40} className="text-purple-400 hidden md:block" />
                                        </div>

                                        <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-purple-300 transition-colors">The Analyst</h3>
                                        <p className="text-purple-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4">Practice Mode</p>
                                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-8 hidden md:block">
                                            Self-paced analysis with random salts. No hints, just you and the logic.
                                        </p>

                                        <div className="mt-auto flex items-center gap-1.5 md:gap-2 text-purple-400 font-bold text-sm md:text-base group-hover:gap-3 transition-all">
                                            Analyze <ArrowRight size={14} className="md:hidden" /><ArrowRight size={18} className="hidden md:block" />
                                        </div>
                                    </button>

                                    {/* Exam Mode - Compact on mobile */}
                                    <button
                                        onClick={() => startGame('exam')}
                                        className="group relative bg-gray-900/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-red-500/50 rounded-2xl md:rounded-3xl p-4 md:p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)] flex flex-col items-center text-center overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-800 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-red-500/50 shadow-lg">
                                            <Timer size={24} className="text-red-400 md:hidden" />
                                            <Timer size={40} className="text-red-400 hidden md:block" />
                                        </div>

                                        <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-red-300 transition-colors">The Expert</h3>
                                        <p className="text-red-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4">Exam Mode</p>
                                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-8 hidden md:block">
                                            High stakes. Timed conditions. Simulate the real CBSE practical exam.
                                        </p>

                                        <div className="mt-auto flex items-center gap-1.5 md:gap-2 text-red-400 font-bold text-sm md:text-base group-hover:gap-3 transition-all">
                                            Exam <ArrowRight size={14} className="md:hidden" /><ArrowRight size={18} className="hidden md:block" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            {/* Quick Stats (Subtle) */}
                            <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
                                <div className="px-4 py-2 bg-gray-900/30 rounded-full border border-white/5 flex items-center gap-3">
                                    <Zap size={14} className="text-cyan-500" />
                                    <span className="text-gray-300 font-mono text-sm">
                                        <span className="text-white font-bold">{ANIONS.length}</span> ANIONS
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-gray-900/30 rounded-full border border-white/5 flex items-center gap-3">
                                    <Sparkles size={14} className="text-emerald-500" />
                                    <span className="text-gray-300 font-mono text-sm">
                                        <span className="text-white font-bold">{CATIONS.length}</span> CATIONS
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-gray-900/30 rounded-full border border-white/5 flex items-center gap-3">
                                    <FlaskConical size={14} className="text-purple-500" />
                                    <span className="text-gray-300 font-mono text-sm">
                                        <span className="text-white font-bold">{SALTS.length}</span> SALTS
                                    </span>
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
                                    <div className="bg-gradient-to-br from-gray-800/80 to-cyan-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
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

            {/* ========== SECTION 2: REVISION GUIDE ========== */}
            <div id="revision-guide">
                <SaltAnalysisGuide />
            </div>

            {/* ========== SECTION 3: ANION SIMULATOR ========== */}
            <section id="anion-simulator" className="py-20 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]">
                            STEP 1: Anion Analysis
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Anion Identification <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Simulator</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Select an anion and simulate its identification using dilute and concentrated H₂SO₄ group tests.
                        </p>
                    </div>
                    <AnionFlowchartSimulator />
                </div>
            </section>

            {/* ========== SECTION 4: DRY TESTS (Flame, Dry Heating, Borax) ========== */}
            <section id="dry-tests" className="py-10 md:py-20 bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4 shadow-[0_0_15px_-3px_rgba(251,146,60,0.2)]">
                            Preliminary Tests
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Dry Tests & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Flame Analysis</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Master the preliminary dry tests that help narrow down the possible cations before wet analysis.
                        </p>
                    </div>

                    {/* Dry Heating Test */}
                    <div id="dry-heating">
                        <DryHeatingTest />
                    </div>

                    {/* Flame Test Simulator */}
                    <div id="flame-test">
                        <FlameTestSimulator />
                    </div>

                    {/* Borax Bead Test Simulator */}
                    <BoraxBeadTest />
                </div>
            </section>

            {/* ========== SECTION 5: CATION FLOWCHART ========== */}
            <section id="cation-flowchart" className="py-20 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]">
                            Systematic Analysis
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Cation Flowchart <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">for Wet Tests</span>
                        </h2>

                        {/* Educational Intro */}
                        <div className="text-left max-w-5xl mx-auto mb-12">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <BookOpen className="text-purple-400" size={28} />
                                Understanding Systematic Analysis
                            </h3>
                            <div className="text-gray-300 text-lg leading-relaxed space-y-4">
                                <p>
                                    Wet tests are carried out in solution. This method relies on the <strong>Separation of Cations into Groups</strong> using specific <em>Group Reagents</em>.
                                    A group reagent precipitates a set of cations (e.g., Dilute HCl precipitates Group I chlorides like PbCl₂).
                                </p>
                                <p>
                                    <strong>Crucial Rule:</strong> You must strictly follow the order. Only after completely precipitating and separating one group can you proceed to the next.
                                    <em> If a cation from a previous group remains, it will interfere with subsequent tests.</em>
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mt-8">
                                <div className="flex-1 bg-gray-800/30 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-white mb-1">Step 1: Precipitation</h4>
                                    <p className="text-sm text-gray-400">Add Group Reagent. If a ppt forms, the cation belongs to that group.</p>
                                </div>
                                <div className="flex-1 bg-gray-800/30 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-white mb-1">Step 2: Filtration</h4>
                                    <p className="text-sm text-gray-400">Filter out the ppt. Use the <strong>filtrate</strong> for the next group.</p>
                                </div>
                                <div className="flex-1 bg-gray-800/30 border-l-4 border-green-500 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-white mb-1">Step 3: Sequence</h4>
                                    <p className="text-sm text-gray-400">Never skip a group. Identify, separate, then proceed.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Flowchart */}
                    <CationSchemeFlowchart />
                </div>
            </section>

            {/* ========== SECTION 6: CATION SIMULATOR ========== */}
            <section id="cation-simulator" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20 mb-4 shadow-[0_0_15px_-3px_rgba(74,222,128,0.2)]">
                            STEP 2: Cation Analysis
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Cation Identification <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Simulator</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Select a cation and trace its path through the systematic group analysis from Group I to Group VI.
                        </p>
                    </div>
                    <CationFlowchartSimulator />
                </div>
            </section>

            {/* ========== QUICK REFERENCE TABLES ========== */}
            <section className="py-16 bg-gray-800/50 border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <ReagentReactionTables />
                </div>
            </section>

            {/* ========== SECTION 7: QUESTION PRACTICE ========== */}
            <section id="quiz-section" className="py-20 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-4 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]">
                            Test Your Knowledge
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Question <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Practice</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Test your understanding of Salt Analysis with conceptual MCQs and tricky questions.
                        </p>
                    </div>

                    {/* Quiz Component */}
                    <div className="mb-20">
                        <SaltAnalysisQuiz />
                    </div>

                    {/* Conceptual Questions (Tricky Points) - Expandable */}
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Conceptual Questions</h3>
                        <div className="space-y-6">
                            {CONCEPTUAL_QUESTIONS.map((item) => {
                                const isOpen = openFAQ === item.id;
                                return (
                                    <div key={item.id} className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden">
                                        <button
                                            onClick={() => setOpenFAQ(isOpen ? null : item.id)}
                                            className="w-full text-left p-6 group flex items-start justify-between gap-6 hover:bg-gray-800/50 transition-colors"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <h4 className={`font-bold ${item.color} text-xs uppercase tracking-wider`}>
                                                    {item.label}
                                                </h4>
                                                <h5 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                                    {item.question}
                                                </h5>
                                            </div>
                                            <div className={`mt-1 p-1.5 rounded-full border border-gray-700 transition-all duration-300 shrink-0 ${isOpen ? 'bg-purple-500/20 rotate-180 border-purple-500/50' : 'bg-gray-800'}`}>
                                                <ChevronDown className={isOpen ? 'text-purple-400' : 'text-gray-400'} size={20} />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6">
                                                        <p
                                                            className="text-gray-300 text-base leading-loose"
                                                            dangerouslySetInnerHTML={{ __html: item.answer }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
