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
    const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
    // Anion and cation selection state for confirmatory tests
    const [suspectedAnion, setSuspectedAnion] = useState<string | null>(null);
    const [suspectedCationGroup, setSuspectedCationGroup] = useState<number | null>(null);
    const [suspectedCation, setSuspectedCation] = useState<string | null>(null);

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
        setRevealedHints(new Set());
        // Reset confirmatory test selections
        setSuspectedAnion(null);
        setSuspectedCationGroup(null);
        setSuspectedCation(null);
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
            } else if (testId.startsWith('confirm_anion_')) {
                // Get the suspected anion's confirmatory test
                const suspectedAnionData = getAnionById(suspectedAnion || '');
                if (suspectedAnionData) {
                    // Find the specific confirmatory test being performed
                    const testIndex = parseInt(testName.split('_')[1] || '0');
                    const confirmTest = suspectedAnionData.confirmatoryTests[testIndex];
                    if (confirmTest) {
                        // Check if suspected anion matches actual anion
                        if (suspectedAnion === saltAnion.id) {
                            observation = confirmTest.observation;
                            inference = `${saltAnion.symbol} confirmed!`;
                        } else {
                            // Wrong anion suspected - show negative result
                            observation = `No characteristic reaction observed. The test is negative.`;
                            inference = `${suspectedAnionData.symbol} NOT confirmed. Your deduction may be incorrect.`;
                        }
                    }
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
            } else if (testId.startsWith('confirm_cation_')) {
                // Get the suspected cation's confirmatory test
                const suspectedCationData = getCationById(suspectedCation || '');
                if (suspectedCationData) {
                    // Find the specific confirmatory test being performed
                    const testIndex = parseInt(testName.split('_')[1] || '0');
                    const confirmTest = suspectedCationData.confirmatoryTests[testIndex];
                    if (confirmTest) {
                        // Check if suspected cation matches actual cation
                        if (suspectedCation === saltCation.id) {
                            observation = confirmTest.observation;
                            inference = `${saltCation.symbol} confirmed!`;
                        } else {
                            // Wrong cation suspected - show negative result
                            observation = `No characteristic reaction observed. The test is negative.`;
                            inference = `${suspectedCationData.symbol} NOT confirmed. Your deduction may be incorrect.`;
                        }
                    }
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

    // Reveal hint for a specific observation in Practice mode
    const revealHint = (index: number) => {
        setRevealedHints(prev => new Set([...prev, index]));
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pb-32">
            <SaltAnalysisHero />

            {/* Floating Navigation for Mobile */}
            <FloatingNav />

            <div className="container mx-auto px-4 pt-0 pb-8 relative z-20 mt-8">
                <AnimatePresence mode="popLayout">
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
                                {/* Subtle Professional Background Accent */}
                                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

                                <div className="text-center mb-10 md:mb-16 mt-0">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Path</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium">
                                        Structured learning tracks designed for every stage of your preparation.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
                                    {/* Learning Mode - The Apprentice */}
                                    <div
                                        onClick={() => startGame('learning')}
                                        className="group relative bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 flex flex-col transition-all duration-500 hover:border-emerald-500/30 hover:bg-slate-900/60 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)] overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-start justify-between mb-6 md:mb-8">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                                <GraduationCap size={28} className="text-emerald-400 md:w-8 md:h-8" />
                                            </div>
                                            <span className="px-2.5 py-1 md:px-3 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                                Foundation
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">The Apprentice</h3>
                                        <p className="text-slate-400 text-sm mb-6 md:mb-8 leading-relaxed">
                                            Perfect for beginners. Master the fundamentals of systematic analysis with guided assistance.
                                        </p>

                                        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-10">
                                            {[
                                                'Step-by-step guidance',
                                                'Real-time hints & help',
                                                'Complete walkthroughs'
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                                        <Check size={12} className="text-emerald-400" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div
                                            className="mt-auto w-full py-3 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all group-active:scale-95 shadow-lg shadow-emerald-500/20"
                                        >
                                            Start Learning <ArrowRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Practice Mode - The Analyst */}
                                    <div
                                        onClick={() => startGame('practice')}
                                        className="group relative bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 flex flex-col transition-all duration-500 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.15)] overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-start justify-between mb-6 md:mb-8">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                                <FlaskConical size={28} className="text-indigo-400 md:w-8 md:h-8" />
                                            </div>
                                            <span className="px-2.5 py-1 md:px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                                                Mastery
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">The Analyst</h3>
                                        <p className="text-slate-400 text-sm mb-6 md:mb-8 leading-relaxed">
                                            Scale your skills. Independent analysis with randomized salts to build your logic.
                                        </p>

                                        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-10">
                                            {[
                                                'Random salt generation',
                                                'Independent procedures',
                                                'Logic-based deductions'
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                        <Check size={12} className="text-indigo-400" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div
                                            className="mt-auto w-full py-3 md:py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all group-active:scale-95 shadow-lg shadow-indigo-500/20"
                                        >
                                            Analyze Now <ArrowRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Exam Mode - The Expert */}
                                    <div
                                        onClick={() => startGame('exam')}
                                        className="group relative bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 flex flex-col transition-all duration-500 hover:border-amber-500/30 hover:bg-slate-900/60 hover:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.15)] overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-start justify-between mb-6 md:mb-8">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                                <Timer size={28} className="text-amber-400 md:w-8 md:h-8" />
                                            </div>
                                            <span className="px-2.5 py-1 md:px-3 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                                                Precision
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">The Expert</h3>
                                        <p className="text-slate-400 text-sm mb-6 md:mb-8 leading-relaxed">
                                            Final preparation. Timed conditions following exact CBSE practical exam marking.
                                        </p>

                                        <ul className="space-y-3 md:space-y-4 mb-6 md:mb-10">
                                            {[
                                                '10 Minute time limit',
                                                'Official marking scheme',
                                                'Performance reports'
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                    <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                                        <Check size={12} className="text-amber-400" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div
                                            className="mt-auto w-full py-3 md:py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all group-active:scale-95 shadow-lg shadow-amber-500/20"
                                        >
                                            Begin Exam <ArrowRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats (Professional & Refined) */}
                            <div className="mt-8 md:mt-16 grid grid-cols-3 md:flex md:justify-center gap-2 md:gap-16 px-2">
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-3xl font-bold text-white mb-1">{ANIONS.length}</span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Anions</span>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-3xl font-bold text-white mb-1">{CATIONS.length}</span>
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Cations</span>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-3xl font-bold text-white mb-1">{SALTS.length}</span>
                                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Combinations</span>
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
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    <FlaskConical size={24} className="text-cyan-400 shrink-0" />
                                                    Unknown Salt Sample
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${gameMode === 'learning' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                                                    gameMode === 'practice' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                        'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                                                    }`}>
                                                    {gameMode} Mode
                                                </span>
                                            </div>
                                            <div className="flex gap-2 self-end md:self-auto">
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
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                                            <div
                                                className="w-24 h-24 rounded-2xl border-2 border-gray-600 flex items-center justify-center shrink-0"
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
                                    <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Perform Tests</h3>

                                        {/* Stage Tabs */}
                                        <div className="grid grid-cols-4 gap-1.5 sm:flex sm:gap-2 mb-4 sm:overflow-x-auto pb-2">
                                            {['preliminary', 'anion', 'cation', 'confirmatory'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStage(s as AnalysisStage)}
                                                    className={`px-1.5 py-2 sm:px-4 rounded-lg text-[11px] sm:text-sm font-medium whitespace-nowrap transition-colors ${stage === s
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
                                                    
                                                    {/* Suspected Anion Selection */}
                                                    <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                                                        <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                                                            <FlaskConical size={16} />
                                                            Step 1: Select Suspected Anion
                                                        </h4>
                                                        <select
                                                            value={suspectedAnion || ''}
                                                            onChange={(e) => setSuspectedAnion(e.target.value || null)}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-purple-500 focus:outline-none mb-2"
                                                        >
                                                            <option value="">-- Select suspected anion --</option>
                                                            <optgroup label="Group A (Dilute H₂SO₄)">
                                                                {ANIONS.filter(a => a.group === 'A').map(a => (
                                                                    <option key={a.id} value={a.id}>{a.symbol} - {a.name}</option>
                                                                ))}
                                                            </optgroup>
                                                            <optgroup label="Group B (Conc. H₂SO₄)">
                                                                {ANIONS.filter(a => a.group === 'B').map(a => (
                                                                    <option key={a.id} value={a.id}>{a.symbol} - {a.name}</option>
                                                                ))}
                                                            </optgroup>
                                                            <optgroup label="Independent">
                                                                {ANIONS.filter(a => a.group === 'independent').map(a => (
                                                                    <option key={a.id} value={a.id}>{a.symbol} - {a.name}</option>
                                                                ))}
                                                            </optgroup>
                                                        </select>
                                                        {gameMode === 'learning' && saltAnion && (
                                                            <p className="text-xs text-emerald-400 mt-1">
                                                                💡 Hint: Based on your observations, suspect {saltAnion.symbol}
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Confirmatory Tests for Selected Anion */}
                                                    {suspectedAnion && (
                                                        <div className="mt-3 space-y-2">
                                                            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                                                                <Check size={16} />
                                                                Step 2: Perform Confirmatory Test(s)
                                                            </h4>
                                                            {(() => {
                                                                const selectedAnion = getAnionById(suspectedAnion);
                                                                return selectedAnion?.confirmatoryTests.map((test, idx) => (
                                                                    <TestButton
                                                                        key={`${suspectedAnion}_confirm_${idx}`}
                                                                        id={`confirm_anion_${suspectedAnion}_${idx}`}
                                                                        name={test.testName}
                                                                        procedure={test.procedure}
                                                                        onPerform={() => performTest('anion', `confirm_anion_${suspectedAnion}`, `${test.testName}_${idx}`)}
                                                                        isExpanded={expandedTest === `confirm_anion_${suspectedAnion}_${idx}`}
                                                                        onToggle={() => setExpandedTest(expandedTest === `confirm_anion_${suspectedAnion}_${idx}` ? null : `confirm_anion_${suspectedAnion}_${idx}`)}
                                                                    />
                                                                ));
                                                            })()}
                                                        </div>
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
                                                    
                                                    {/* Suspected Cation Group Selection */}
                                                    <div className="mt-4 p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl">
                                                        <h4 className="text-sm font-bold text-orange-300 mb-3 flex items-center gap-2">
                                                            <FlaskConical size={16} />
                                                            Step 1: Select Suspected Group
                                                        </h4>
                                                        <select
                                                            value={suspectedCationGroup !== null ? String(suspectedCationGroup) : ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setSuspectedCationGroup(value ? parseInt(value) : null);
                                                                setSuspectedCation(null); // Reset cation when group changes
                                                            }}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-orange-500 focus:outline-none mb-2"
                                                        >
                                                            <option value="">-- Select suspected group --</option>
                                                            {CATION_GROUPS.map(g => (
                                                                <option key={g.group} value={g.group}>
                                                                    Group {g.group === 0 ? 'Zero' : g.group} - {g.name} ({g.cations.join(', ')})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {gameMode === 'learning' && saltCation && (
                                                            <p className="text-xs text-emerald-400 mt-1">
                                                                💡 Hint: Based on group test, suspect Group {saltCation.group === 0 ? 'Zero' : saltCation.group}
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Suspected Cation Selection */}
                                                    {suspectedCationGroup !== null && (
                                                        <div className="mt-3 p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                                                            <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                                                                <Check size={16} />
                                                                Step 2: Select Suspected Cation
                                                            </h4>
                                                            <select
                                                                value={suspectedCation || ''}
                                                                onChange={(e) => setSuspectedCation(e.target.value || null)}
                                                                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-amber-500 focus:outline-none mb-2"
                                                            >
                                                                <option value="">-- Select suspected cation --</option>
                                                                {CATIONS.filter(c => c.group === suspectedCationGroup).map(c => (
                                                                    <option key={c.id} value={c.id}>
                                                                        {c.symbol} - {c.name} {c.precipitateColor ? `(${c.precipitateColor})` : ''}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {gameMode === 'learning' && saltCation && saltCation.group === suspectedCationGroup && (
                                                                <p className="text-xs text-emerald-400 mt-1">
                                                                    💡 Hint: Based on precipitate colour, suspect {saltCation.symbol}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Confirmatory Tests for Selected Cation */}
                                                    {suspectedCation && (
                                                        <div className="mt-3 space-y-2">
                                                            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                                                                <Check size={16} />
                                                                Step 3: Perform Confirmatory Test(s)
                                                            </h4>
                                                            {(() => {
                                                                const selectedCation = getCationById(suspectedCation);
                                                                return selectedCation?.confirmatoryTests.map((test, idx) => (
                                                                    <TestButton
                                                                        key={`${suspectedCation}_confirm_${idx}`}
                                                                        id={`confirm_cation_${suspectedCation}_${idx}`}
                                                                        name={test.testName}
                                                                        procedure={test.procedure}
                                                                        onPerform={() => performTest('cation', `confirm_cation_${suspectedCation}`, `${test.testName}_${idx}`)}
                                                                        isExpanded={expandedTest === `confirm_cation_${suspectedCation}_${idx}`}
                                                                        onToggle={() => setExpandedTest(expandedTest === `confirm_cation_${suspectedCation}_${idx}` ? null : `confirm_cation_${suspectedCation}_${idx}`)}
                                                                    />
                                                                ));
                                                            })()}
                                                        </div>
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
                                                        key={`${obs.testName}-${idx}`}
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
                                                        {gameMode === 'learning' ? (
                                                            <p className="text-base text-green-400 mt-1 font-medium">→ {obs.inference}</p>
                                                        ) : gameMode === 'practice' ? (
                                                            revealedHints.has(idx) ? (
                                                                <p className="text-base text-amber-400 mt-1 font-medium">→ {obs.inference}</p>
                                                            ) : (
                                                                <button
                                                                    onClick={() => revealHint(idx)}
                                                                    className="mt-2 text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                                                                >
                                                                    <Lightbulb size={12} />
                                                                    Reveal Hint
                                                                </button>
                                                            )
                                                        ) : (
                                                            <p className="text-sm text-gray-500 mt-1 italic">→ Inference hidden</p>
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
