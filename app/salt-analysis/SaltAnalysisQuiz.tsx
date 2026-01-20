'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, XCircle, Trophy, RefreshCcw, ChevronRight, ChevronDown,
    BrainCircuit, GraduationCap, ArrowRight, Eye, Zap, BookOpen,
    Filter, Clock, Sparkles, RotateCcw, Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MASTERY_QUESTIONS } from './quizData';
import { useSaltQuizProgress } from '../hooks/useSaltQuizProgress';
import { QualityRating, MasteryLevel } from '../lib/spacedRepetition';

// ============ MCQ QUESTIONS DATA ============
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "In the context of inorganic salt formation, which part of the salt is defined as the cation?",
        options: [
            "The part contributed by the acid.",
            "The part that reacts with dilute sulphuric acid to evolve gas.",
            "The part contributed by the base.",
            "The part that causes the salt to be acidic in nature."
        ],
        correctAnswer: 2,
        explanation: "A salt is formed by the neutralization of an acid and a base. The cation (positive ion) comes from the base, and the anion (negative ion) comes from the acid."
    },
    {
        id: 2,
        question: "Which of the following scales of qualitative analysis requires approximately 0.1 to 0.5 g of a substance and 20 mL of solution?",
        options: ["Macro analysis", "Sub-micro analysis", "Semimicro analysis", "Micro analysis"],
        correctAnswer: 0,
        explanation: "In Macro analysis, 0.1–0.5 g of salt and about 20 mL of solution are used. Semi-micro analysis uses much smaller quantities (0.05 g)."
    },
    {
        id: 3,
        question: "Which two basic chemical principles are fundamental for the systematic analysis of cations in solution?",
        options: [
            "Le Chatelier's principle and Catalysis",
            "Oxidation states and Molar mass",
            "Electronegativity and Atomic radii",
            "Solubility product and Common ion effect"
        ],
        correctAnswer: 3,
        explanation: "Selective precipitation of groups depends on exceeding the Solubility Product (Ksp) of specific salts, often controlled by the Common Ion Effect."
    },
    {
        id: 4,
        question: "According to the systematic analysis scheme, when should the determination of cations be performed?",
        options: [
            "Before the preliminary examination to save time.",
            "Immediately after the preliminary examination of the solid salt.",
            "Simultaneously with the determination of anions in the same test tube.",
            "After the preliminary examination and the determination of anions."
        ],
        correctAnswer: 3,
        explanation: "Cations are typically analyzed after anions because some anion tests can affect cation analysis."
    },
    {
        id: 5,
        question: "Which of these is considered a 'dry test' during the preliminary examination of a cation?",
        options: [
            "Flame test",
            "Preparation of sodium carbonate extract",
            "Treatment with dilute sulphuric acid",
            "Formation of a precipitate in solution"
        ],
        correctAnswer: 0,
        explanation: "The Flame Test is a dry test performed on the solid salt to identify cations by their characteristic flame colors."
    },
    {
        id: 6,
        question: "Which group reagent is used for the precipitation of Group III cations (Fe³⁺, Al³⁺, Cr³⁺)?",
        options: [
            "H₂S gas in presence of dilute HCl",
            "NH₄OH in presence of NH₄Cl",
            "H₂S gas in presence of NH₄OH",
            "(NH₄)₂CO₃ in presence of NH₄Cl"
        ],
        correctAnswer: 1,
        explanation: "Group III cations precipitate as hydroxides. NH₄Cl is added to suppress the ionization of NH₄OH."
    },
    {
        id: 7,
        question: "Which cation gives a characteristic 'Brick Red' flame color?",
        options: ["Barium (Ba²⁺)", "Calcium (Ca²⁺)", "Strontium (Sr²⁺)", "Copper (Cu²⁺)"],
        correctAnswer: 1,
        explanation: "Calcium salts impart a brick red color to the flame."
    },
    {
        id: 8,
        question: "Lead (Pb²⁺) is a member of which analysis group(s)?",
        options: ["Group I only", "Group II only", "Both Group I and Group II", "Group IV"],
        correctAnswer: 2,
        explanation: "PbCl₂ is partially soluble in water, so some Pb²⁺ precipitates in Group I, while the remaining precipitates as PbS in Group II."
    },
    {
        id: 9,
        question: "The brown ring test is used to confirm the presence of which ion?",
        options: ["Acetate (CH₃COO⁻)", "Nitrate (NO₃⁻)", "Chloride (Cl⁻)", "Sulphate (SO₄²⁻)"],
        correctAnswer: 1,
        explanation: "The Brown Ring Test confirms Nitrate ions. The brown complex formed is [Fe(H₂O)₅NO]²⁺."
    },
    {
        id: 10,
        question: "What is the correct group reagent for Group V (Ba²⁺, Sr²⁺, Ca²⁺)?",
        options: [
            "Ammonium Sulphate",
            "Ammonium Oxalate",
            "Ammonium Carbonate in presence of NH₄Cl",
            "Sodium Carbonate"
        ],
        correctAnswer: 2,
        explanation: "Group V cations are precipitated as carbonates using (NH₄)₂CO₃. NH₄Cl prevents magnesium precipitation."
    },
    {
        id: 11,
        question: "If an aqueous salt solution is basic in nature, what information does this provide about the potential ions present?",
        options: [
            "The salt is completely insoluble in water.",
            "The salt may be a carbonate or a sulphide.",
            "The salt contains NH₄⁺ ions.",
            "The salt is composed of a strong acid and a weak base."
        ],
        correctAnswer: 1,
        explanation: "Basic salts generally result from the hydrolysis of a Strong Base and Weak Acid. Carbonates and Sulphides hydrolyze to release OH⁻ ions."
    },
    {
        id: 12,
        question: "What is the primary objective of the 'Colour Test' in cation analysis?",
        options: [
            "To confirm the presence of Ba²⁺ and Ca²⁺ ions.",
            "To check if the salt will react with concentrated H₂SO₄.",
            "To provide useful preliminary information about the identity of the cation.",
            "To determine the exact solubility product of the salt."
        ],
        correctAnswer: 2,
        explanation: "The colour of the salt (e.g., Blue for Cu²⁺, Green for Ni²⁺/Fe²⁺) gives a strong preliminary clue about the cation present."
    },
    {
        id: 13,
        question: "According to the principles of salt analysis, precipitation of a cation occurs when:",
        options: [
            "Common ion effect is used to increase the solubility of the salt.",
            "The solubility product exceeds the ionic product.",
            "The solution is neutralised with sodium carbonate.",
            "The ionic product of the salt exceeds its solubility product."
        ],
        correctAnswer: 3,
        explanation: "Precipitation occurs only when the Ionic Product exceeds the Solubility Product (Ksp) of the salt."
    },
    {
        id: 14,
        question: "Why is it often necessary to neutralise an acidic salt solution with sodium carbonate before testing for anions?",
        options: [
            "To increase the evolution of CO₂ gas for identification.",
            "To ensure the salt is completely insoluble for dry testing.",
            "To account for salts derived from a weak base and a strong acid.",
            "To convert all cations into their corresponding nitrates."
        ],
        correctAnswer: 2,
        explanation: "Neutralizing with Na₂CO₃ precipitates interfering cations as carbonates/hydroxides, leaving anions in the filtrate for testing."
    },
    {
        id: 15,
        question: "Which of the following reagents can be used to distinguish between SO₂ and CO₂ gas?",
        options: ["Limewater (Calcium Hydroxide)", "BaCl₂ solution", "Acidified dichromate paper", "Dilute HCl"],
        correctAnswer: 2,
        explanation: "SO₂ is a reducing agent that turns orange acidified potassium dichromate paper green. CO₂ does not show this reaction."
    },
    {
        id: 16,
        question: "By using which of the following reagents can a sublimate of HgCl₂ be distinguished from one of NH₄Cl?",
        options: ["H₂S gas", "BaCl₂ solution", "FeSO4 solution", "FeCl3 solution"],
        correctAnswer: 0,
        explanation: "HgCl₂ reacts with H₂S to form a black precipitate of HgS. NH₄Cl does not react with H₂S."
    },
    {
        id: 17,
        question: "The nitrite ion can be best destroyed by:",
        options: ["NH₄Cl", "NH₂CONH₂ (Urea)", "NH₂CSNH₂ (Thiourea)", "NH₂-SO₂-OH (Sulphamic acid)"],
        correctAnswer: 3,
        explanation: "Sulphamic acid (NH₂-SO₂-OH) is used to destroy nitrite ions because other reagents form small amounts of NO₃⁻ during the reaction, giving false positive in nitrate tests. (JEE Main 2015)"
    },
    {
        id: 18,
        question: "The cation that will NOT be precipitated by H₂S in the presence of dilute HCl is:",
        options: ["Cu²⁺", "Pb²⁺", "As³⁺", "Co²⁺"],
        correctAnswer: 3,
        explanation: "Co²⁺ belongs to Group IV (higher group) and requires alkaline medium to precipitate as CoS. Dilute HCl + H₂S can only precipitate Group II cations with low Ksp. (JEE Main Online 2015)"
    },
    {
        id: 19,
        question: "An aqueous solution of metal ion (A) on reaction with KI gives green precipitate (B). The aqueous suspension of (B) when heated produces a red precipitate with finely distributed black particles. Then (A) is:",
        options: ["Hg₂²⁺", "Hg²⁺", "Cu²⁺", "Pb²⁺"],
        correctAnswer: 0,
        explanation: "Hg₂²⁺ + 2I⁻ → Hg₂I₂ (green ppt). On heating: Hg₂I₂ → HgI₂ (red ppt) + Hg (black particles). This is a characteristic test for mercurous ion."
    },
    {
        id: 20,
        question: "Which of the following compounds is NOT coloured yellow?",
        options: ["K₃[Co(NO₂)₆]", "(NH₄)₃[As(Mo₃O₁₀)₄]", "BaCrO₄", "Zn₂[Fe(CN)₆]"],
        correctAnswer: 3,
        explanation: "Zn₂[Fe(CN)₆] (Zinc ferrocyanide) is WHITE because it does not have unpaired electrons. The other three compounds are yellow. (JEE Main 2015)"
    },
    {
        id: 21,
        question: "A pink-coloured salt turns blue on heating. The presence of which cation is most likely?",
        options: ["Cu²⁺", "Fe²⁺", "Zn²⁺", "Co²⁺"],
        correctAnswer: 3,
        explanation: "CoCl₂·6H₂O (pink) loses water on heating → CoCl₂·2H₂O (red-violet) → CoCl₂ (blue anhydrous). This colour change is reversible and characteristic of Cobalt. (JEE Main Online 2015)"
    },
    {
        id: 22,
        question: "KMnO₄ + NaOH (hot conc.) → Green solution → Purple colour on dilution. Which statement is INCORRECT?",
        options: [
            "NaOH acts as an alkali.",
            "NaOH acts as a reducing agent.",
            "The oxidation state of Mn in green solution is +6.",
            "Both steps take place through redox reaction."
        ],
        correctAnswer: 0,
        explanation: "In this reaction, NaOH actually acts as a REDUCING agent (not just an alkali): MnO₄⁻ + 2OH⁻ → MnO₄²⁻ + H₂O + ½O₂. The green solution contains manganate (Mn +6) which reverts to permanganate on dilution."
    },
    {
        id: 23,
        question: "When Ca²⁺, Sr²⁺ and Ba²⁺ are taken together and Na₂C₂O₄ (sodium oxalate) solution is added, which cation will form precipitate FIRST?",
        options: ["Ca²⁺", "Sr²⁺", "Ba²⁺", "All will form precipitate together"],
        correctAnswer: 0,
        explanation: "The solubility order is: CaC₂O₄ < SrC₂O₄ < BaC₂O₄. Since Calcium oxalate has the LOWEST solubility (lowest Ksp), it precipitates first when oxalate is added."
    },
    {
        id: 24,
        question: "CuSO₄ decolourises on addition of KCN, the product is:",
        options: ["[Cu(CN)₄]²⁻", "Cu²⁺ gets reduced to [Cu(CN)₄]³⁻", "Cu(CN)₂", "CuCN"],
        correctAnswer: 3,
        explanation: "The decolourization of CuSO₄ occurs due to the formation of copper cyanide (CuCN). Cu²⁺ + 2CN⁻ → Cu(CN)₂, then 2Cu(CN)₂ → 2CuCN + (CN)₂. CuCN is white and insoluble. (IIT-JEE 2006)"
    },
    {
        id: 25,
        question: "MgSO₄ on reaction with NH₄OH and Na₂HPO₄ forms a white crystalline precipitate. What is its formula?",
        options: ["Mg(NH₄)PO₄", "Mg₃(PO₄)₂", "MgCl₂·MgSO₄", "MgPO₄"],
        correctAnswer: 0,
        explanation: "The reaction is: Mg²⁺ + NH₄OH + Na₂HPO₄ → Mg(NH₄)PO₄ (white crystalline precipitate). This is the confirmatory test for Mg²⁺. (IIT-JEE 2006)"
    },
    {
        id: 26,
        question: "A solution of metal ion when treated with KI gives a red precipitate which dissolves in excess KI to give a colourless solution. The solution also gives deep blue precipitate with cobalt(II) thiocyanate. The metal ion is:",
        options: ["Pb²⁺", "Hg²⁺", "Cu²⁺", "Co²⁺"],
        correctAnswer: 1,
        explanation: "Hg²⁺ + 2I⁻ → HgI₂ (red ppt.). In excess KI: HgI₂ + 2I⁻ → [HgI₄]²⁻ (colourless Nessler's reagent base). With Co(SCN)₂, Hg²⁺ forms deep blue precipitate. (IIT-JEE 2007)"
    },
    {
        id: 27,
        question: "Passing H₂S gas into a mixture of Mn²⁺, Ni²⁺, Cu²⁺ and Hg²⁺ ions in an ACIDIFIED aqueous solution precipitates:",
        options: ["CuS and HgS", "MnS and CuS", "MnS and NiS", "NiS and HgS"],
        correctAnswer: 0,
        explanation: "Cu²⁺ and Hg²⁺ belong to Group II of inorganic salt analysis and their sulphides have very low Ksp. Hence, CuS and HgS will be precipitated in acidic medium. Mn²⁺ and Ni²⁺ belong to Group IV and need alkaline medium. (IIT-JEE 2011)"
    },
    {
        id: 28,
        question: "Upon treatment with ammoniacal H₂S, the metal ion that precipitates as a sulphide is:",
        options: ["Fe(III)", "Al(III)", "Mg(II)", "Zn(II)"],
        correctAnswer: 3,
        explanation: "With ammoniacal H₂S (Group IV reagent), Zn(II) gets precipitated as ZnS. Mg(II) does not precipitate (belongs to Group VI), while Fe³⁺ and Al³⁺ precipitate as hydroxides, not sulphides. (JEE Advanced 2013)"
    },
    {
        id: 29,
        question: "The pair of ions where BOTH ions are precipitated upon passing H₂S gas in presence of dilute HCl is:",
        options: ["Ba²⁺ and Zn²⁺", "Cu²⁺ and Pb²⁺", "Bi³⁺ and Fe³⁺", "Hg²⁺ and Bi³⁺"],
        correctAnswer: 3,
        explanation: "In acidic medium (dilute HCl + H₂S), only Group II cations precipitate. Both Hg²⁺ and Bi³⁺ belong to Group II, so both form sulphides. Cu²⁺ and Pb²⁺ also work, but Hg²⁺ and Bi³⁺ is the best answer as both are exclusively Group II. (JEE Advanced 2015)"
    },
    {
        id: 30,
        question: "Salt A gives Gas B + Solution C when treated with NaOH. Solution C + Zn + NaOH also gives Gas B. Then solid A may be:",
        options: ["NaNO₃", "NH₄NO₂", "AgNO₂", "KNO₃"],
        correctAnswer: 1,
        explanation: "Gas B is NH₃. From NH₄NO₂: NH₄⁺ + OH⁻ → NH₃↑ + H₂O. The remaining NO₂⁻ in solution C, when treated with Zn + NaOH (Devarda's alloy), also gives NH₃. This confirms presence of both NH₄⁺ and NO₂⁻/NO₃⁻."
    },
    {
        id: 31,
        question: "When salt solution M + NaN₃ + I₂ is dissolved in KI solution, a colourless gas is evolved. Then salt M may be:",
        options: ["KCl", "Na₂S", "K₂SO₄", "NaNO₃"],
        correctAnswer: 1,
        explanation: "This is the iodine-azide test. 2N₃⁻ + I₃⁻ → 3N₂↑ + 3I⁻. This test is given by S₂O₃²⁻, SCN⁻, or S²⁻ ions which catalyze the reaction. Na₂S contains S²⁻ ion."
    },
    {
        id: 32,
        question: "Which of the following conditions is NOT suitable for the brown ring test of NO₃⁻?",
        options: [
            "FeSO₄ added must be freshly prepared",
            "H₂SO₄ added should be concentrated",
            "Acetic acid may be used as an alternative acid",
            "Shaking or warming is not allowed"
        ],
        correctAnswer: 1,
        explanation: "Concentrated H₂SO₄ causes oxidation of NO (the brown ring compound) forming brown fumes of NO₂, which destroys the test. The acid should be added carefully along the sides of the tube."
    },
    {
        id: 33,
        question: "Which of the following pair of species gives a precipitate when mixed together?",
        options: ["Na⁺ and HPO₄²⁻", "Ca²⁺ and NO₃⁻", "Fe³⁺ and NO₂⁻", "None of these"],
        correctAnswer: 3,
        explanation: "All sodium salts are soluble in water. All nitrates are soluble in water. All nitrites are soluble in water except AgNO₂. Therefore, none of these pairs will form a precipitate."
    },
    {
        id: 34,
        question: "Sodium nitroprusside solution is used to detect which of the following ions?",
        options: ["S₂O₃²⁻", "Al³⁺", "Cu²⁺", "S²⁻"],
        correctAnswer: 3,
        explanation: "Sodium nitroprusside test: [Fe(CN)₅NO]²⁻ + S²⁻ → [Fe(CN)₅(NOS)]⁴⁻ which gives a purple/violet colouration. This is a confirmatory test for sulphide ions."
    },
    {
        id: 35,
        question: "Choose the CORRECT statement from the following:",
        options: [
            "Obtaining vinegar smell from acetate ion is not affected by conc. H₂SO₄",
            "HCO₃⁻ ion gives the test with dil. H₂SO₄ as well as conc. H₂SO₄",
            "No precipitate is obtained when Pb(OAc)₂ is added to HCO₃⁻ solution",
            "All of these"
        ],
        correctAnswer: 1,
        explanation: "HCO₃⁻ + H₂SO₄ (dil.) → HCOOH↑ (formic acid - pungent smell). With conc. H₂SO₄: HCOOH → H₂O + CO (colourless gas that burns with blue flame). Both tests work."
    },
    {
        id: 36,
        question: "Which of the following compounds produces white needle-like crystals on recrystallization?",
        options: ["PbCl₂", "BaSO₄", "AgBr", "FePO₄"],
        correctAnswer: 0,
        explanation: "PbCl₂ is slightly soluble in cold water but soluble in hot water. On cooling, it crystallizes as characteristic white needle-shaped crystals. This is a confirmatory test for Pb²⁺."
    },
    {
        id: 37,
        question: "On addition of dil. H₂SO₄ to BaC₂O₄ solution, the gas(es) liberated is/are:",
        options: ["CO only", "CO₂ only", "CO + CO₂", "None of these"],
        correctAnswer: 3,
        explanation: "C₂O₄²⁻ (oxalate ion) does not react with dilute H₂SO₄ to evolve any gas. The oxalate ion requires concentrated H₂SO₄ and heating to decompose and release CO and CO₂."
    },
    {
        id: 38,
        question: "When a violet layer is obtained FIRST in the layer test for an unknown sample, the INCORRECT statement is:",
        options: [
            "I⁻ is confirmed",
            "Br⁻ may be present",
            "Br⁻ must be present",
            "No comment regarding the presence of Br⁻ ion"
        ],
        correctAnswer: 2,
        explanation: "In layer test, violet colour indicates I⁻. If violet appears first, it only confirms iodide. Bromide gives orange/brown colour. Since no observation about Br⁻ colour is mentioned, we cannot say Br⁻ 'must' be present - it 'may' be present."
    }
];

// ============ HELPER FUNCTIONS ============

const getMasteryColor = (level: MasteryLevel): { bg: string; text: string; border: string } => {
    switch (level) {
        case 'new': return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
        case 'learning': return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
        case 'reviewing': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
        case 'mastered': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    }
};

type QuizMode = 'selection' | 'quick' | 'practice' | 'mastery';
type PracticeFilter = 'all' | 'due' | 'new' | 'mastered';

export default function SaltAnalysisQuiz() {
    const [mode, setMode] = useState<QuizMode>('selection');

    // Spaced repetition hooks
    const mcqProgress = useSaltQuizProgress('mcq');
    const flashcardProgress = useSaltQuizProgress('flashcard');

    // Quick Quiz State
    const [quickQuizQuestions, setQuickQuizQuestions] = useState<typeof QUIZ_QUESTIONS>([]);
    const [quickIndex, setQuickIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quickScore, setQuickScore] = useState(0);
    const [showQuickResults, setShowQuickResults] = useState(false);

    // Practice All State
    const [practiceFilter, setPracticeFilter] = useState<PracticeFilter>('all');
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
    const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number | null>>({});
    const [practiceRevealed, setPracticeRevealed] = useState<Record<number, boolean>>({});

    // Mastery Flashcard State
    const [masteryIndex, setMasteryIndex] = useState(0);
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    const [showMasteryResults, setShowMasteryResults] = useState(false);
    const [masteryQuestions, setMasteryQuestions] = useState<typeof MASTERY_QUESTIONS>([]);

    // Get all MCQ IDs for statistics
    const mcqIds = useMemo(() => QUIZ_QUESTIONS.map(q => `mcq_${q.id}`), []);
    const flashcardIds = useMemo(() => MASTERY_QUESTIONS.map(q => `fc_${q.id}`), []);

    // Statistics
    const mcqStats = mcqProgress.isLoaded ? mcqProgress.getStatistics(mcqIds) : null;
    const flashcardStats = flashcardProgress.isLoaded ? flashcardProgress.getStatistics(flashcardIds) : null;

    // Filtered questions for Practice All
    const filteredQuestions = useMemo(() => {
        if (!mcqProgress.isLoaded) return QUIZ_QUESTIONS;

        return QUIZ_QUESTIONS.filter(q => {
            const cardId = `mcq_${q.id}`;
            const level = mcqProgress.getCardMasteryLevel(cardId);

            switch (practiceFilter) {
                case 'due': return mcqProgress.getDueCards([cardId]).length > 0;
                case 'new': return level === 'new';
                case 'mastered': return level === 'mastered';
                default: return true;
            }
        });
    }, [practiceFilter, mcqProgress]);

    // ============ QUICK QUIZ HANDLERS ============

    const startQuickQuiz = () => {
        // Get 10 random questions prioritizing due cards
        const selectedIds = mcqProgress.getRandomSelection(mcqIds, 10);
        const selected = selectedIds.map(id => {
            const qId = parseInt(id.replace('mcq_', ''));
            return QUIZ_QUESTIONS.find(q => q.id === qId)!;
        }).filter(Boolean);

        // Shuffle for variety
        const shuffled = [...selected].sort(() => Math.random() - 0.5);

        setQuickQuizQuestions(shuffled.length > 0 ? shuffled : QUIZ_QUESTIONS.slice(0, 10));
        setQuickIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setQuickScore(0);
        setShowQuickResults(false);
        setMode('quick');
    };

    const handleQuickAnswer = (optionIndex: number) => {
        if (isAnswered) return;
        setSelectedOption(optionIndex);
        setIsAnswered(true);

        const currentQ = quickQuizQuestions[quickIndex];
        const isCorrect = optionIndex === currentQ.correctAnswer;

        if (isCorrect) setQuickScore(s => s + 1);

        // Record answer for spaced repetition
        mcqProgress.recordAnswer(`mcq_${currentQ.id}`, isCorrect);
    };

    const handleQuickNext = () => {
        if (quickIndex < quickQuizQuestions.length - 1) {
            setQuickIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowQuickResults(true);
            if (quickScore >= 7) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        }
    };

    const jumpToQuestion = (index: number) => {
        if (index !== quickIndex) {
            setQuickIndex(index);
            setSelectedOption(null);
            setIsAnswered(false);
        }
    };

    // ============ PRACTICE ALL HANDLERS ============

    const handlePracticeAnswer = (questionId: number, optionIndex: number) => {
        if (practiceRevealed[questionId]) return;

        setPracticeAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
        setPracticeRevealed(prev => ({ ...prev, [questionId]: true }));

        const q = QUIZ_QUESTIONS.find(q => q.id === questionId);
        if (q) {
            const isCorrect = optionIndex === q.correctAnswer;
            mcqProgress.recordAnswer(`mcq_${questionId}`, isCorrect);
        }
    };

    // ============ MASTERY FLASHCARD HANDLERS ============

    const startMasteryMode = () => {
        // Sort flashcards by priority (due cards first)
        const sortedIds = flashcardProgress.sortByPriority(flashcardIds);
        const sorted = sortedIds.map(id => {
            const fcId = parseInt(id.replace('fc_', ''));
            return MASTERY_QUESTIONS.find(q => q.id === fcId)!;
        }).filter(Boolean);

        setMasteryQuestions(sorted.length > 0 ? sorted : MASTERY_QUESTIONS);
        setMasteryIndex(0);
        setIsCardRevealed(false);
        setShowMasteryResults(false);
        setMode('mastery');
    };

    const handleMasteryGrade = (quality: QualityRating) => {
        const currentCard = masteryQuestions[masteryIndex];
        flashcardProgress.updateProgress(`fc_${currentCard.id}`, quality);

        if (masteryIndex < masteryQuestions.length - 1) {
            setTimeout(() => {
                setMasteryIndex(i => i + 1);
                setIsCardRevealed(false);
            }, 200);
        } else {
            setShowMasteryResults(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#a855f7', '#ec4899', '#eab308'] });
        }
    };

    // ============ RESET HANDLERS ============

    const resetToSelection = () => {
        setMode('selection');
        setQuickIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setQuickScore(0);
        setShowQuickResults(false);
        setExpandedQuestion(null);
        setPracticeAnswers({});
        setPracticeRevealed({});
        setMasteryIndex(0);
        setIsCardRevealed(false);
        setShowMasteryResults(false);
    };

    // ============ RENDER: SELECTION SCREEN ============

    if (mode === 'selection') {
        return (
            <div className="w-full max-w-5xl mx-auto">
                {/* Statistics Dashboard */}
                {mcqStats && flashcardStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
                            <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{mcqStats.dueToday + flashcardStats.dueToday}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Due Today</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
                            <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{mcqStats.new + flashcardStats.new}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">New Cards</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
                            <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{mcqStats.learning + mcqStats.reviewing + flashcardStats.learning + flashcardStats.reviewing}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Learning</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
                            <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{mcqStats.mastered + flashcardStats.mastered}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Mastered</p>
                        </div>
                    </div>
                )}

                {/* Mode Selection Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Quick Quiz */}
                    <button
                        onClick={startQuickQuiz}
                        className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 text-left transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Zap className="w-10 h-10 text-purple-400 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Quick Quiz</h3>
                        <p className="text-gray-400 text-sm mb-3">10 random questions from the question bank. Perfect for a quick review.</p>
                        <div className="flex items-center text-purple-400 font-bold text-sm">
                            START <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        {mcqStats && mcqStats.dueToday > 0 && (
                            <span className="absolute top-4 right-4 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                                {mcqStats.dueToday} due
                            </span>
                        )}
                    </button>

                    {/* Practice All */}
                    <button
                        onClick={() => setMode('practice')}
                        className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-cyan-500 rounded-2xl p-6 text-left transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <BookOpen className="w-10 h-10 text-cyan-400 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Practice All</h3>
                        <p className="text-gray-400 text-sm mb-3">Browse all {QUIZ_QUESTIONS.length} questions. Filter by status. Learn at your pace.</p>
                        <div className="flex items-center text-cyan-400 font-bold text-sm">
                            BROWSE <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Mastery Flashcards */}
                    <button
                        onClick={startMasteryMode}
                        className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-yellow-500 rounded-2xl p-6 text-left transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <GraduationCap className="w-10 h-10 text-yellow-400 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Mastery Cards</h3>
                        <p className="text-gray-400 text-sm mb-3">{MASTERY_QUESTIONS.length} advanced flashcards with spaced repetition.</p>
                        <div className="flex items-center text-yellow-400 font-bold text-sm">
                            CHALLENGE <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        {flashcardStats && flashcardStats.dueToday > 0 && (
                            <span className="absolute top-4 right-4 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                                {flashcardStats.dueToday} due
                            </span>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // ============ RENDER: QUICK QUIZ MODE ============

    if (mode === 'quick') {
        if (showQuickResults) {
            return (
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
                    <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                    <p className="text-gray-300 mb-6">
                        You scored <span className="text-purple-400 font-bold text-xl">{quickScore}</span> out of <span className="text-white font-bold">{quickQuizQuestions.length}</span>
                    </p>

                    <div className="w-full bg-gray-700 h-3 rounded-full mb-8 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                            style={{ width: `${(quickScore / quickQuizQuestions.length) * 100}%` }}
                        />
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={startQuickQuiz} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-colors flex items-center gap-2">
                            <Shuffle size={18} /> New Quiz
                        </button>
                        <button onClick={resetToSelection} className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors">
                            Menu
                        </button>
                    </div>
                </div>
            );
        }

        const currentQ = quickQuizQuestions[quickIndex];
        if (!currentQ) return null;

        return (
            <div className="w-full max-w-3xl mx-auto">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={resetToSelection} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                        <ChevronRight className="rotate-180" size={16} /> Back
                    </button>
                    <div className="text-gray-400 text-sm font-mono">
                        Score: {quickScore}/{quickQuizQuestions.length}
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {quickQuizQuestions.map((q, idx) => (
                        <button
                            key={q.id}
                            onClick={() => jumpToQuestion(idx)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${idx === quickIndex
                                ? 'bg-purple-500 text-white scale-110'
                                : idx < quickIndex
                                    ? 'bg-gray-600 text-gray-300'
                                    : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Question Card */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentQ.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
                                {currentQ.question}
                            </h3>

                            <div className="space-y-3">
                                {currentQ.options.map((option, index) => {
                                    let buttonStyle = "border-gray-700 hover:border-gray-500 bg-gray-900/50 text-gray-300";

                                    if (isAnswered) {
                                        if (index === currentQ.correctAnswer) {
                                            buttonStyle = "border-green-500 bg-green-500/10 text-green-100";
                                        } else if (index === selectedOption) {
                                            buttonStyle = "border-red-500 bg-red-500/10 text-red-100";
                                        } else {
                                            buttonStyle = "border-gray-800 bg-gray-900/20 text-gray-600 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAnswer(index)}
                                            disabled={isAnswered}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
                                        >
                                            <span>{option}</span>
                                            {isAnswered && index === currentQ.correctAnswer && <CheckCircle2 className="text-green-500" size={20} />}
                                            {isAnswered && index === selectedOption && index !== currentQ.correctAnswer && <XCircle className="text-red-500" size={20} />}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 pt-6 border-t border-gray-700"
                                >
                                    <div className="mb-4 p-4 bg-gray-900/50 rounded-xl">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Explanation</h4>
                                        <p className="text-gray-300">{currentQ.explanation}</p>
                                    </div>
                                    <button
                                        onClick={handleQuickNext}
                                        className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {quickIndex < quickQuizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                                        <ChevronRight size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // ============ RENDER: PRACTICE ALL MODE ============

    if (mode === 'practice') {
        return (
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={resetToSelection} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                        <ChevronRight className="rotate-180" size={16} /> Back to Menu
                    </button>
                    <div className="text-gray-400 text-sm">
                        {filteredQuestions.length} questions
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {(['all', 'due', 'new', 'mastered'] as PracticeFilter[]).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setPracticeFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${practiceFilter === filter
                                ? 'bg-cyan-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {filter === 'all' && `All (${QUIZ_QUESTIONS.length})`}
                            {filter === 'due' && `Due (${mcqStats?.dueToday || 0})`}
                            {filter === 'new' && `New (${mcqStats?.new || 0})`}
                            {filter === 'mastered' && `Mastered (${mcqStats?.mastered || 0})`}
                        </button>
                    ))}
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                    {filteredQuestions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Filter size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No questions match this filter.</p>
                        </div>
                    ) : (
                        filteredQuestions.map((q, idx) => {
                            const cardId = `mcq_${q.id}`;
                            const masteryLevel = mcqProgress.getCardMasteryLevel(cardId);
                            const colors = getMasteryColor(masteryLevel);
                            const isExpanded = expandedQuestion === q.id;
                            const selectedOpt = practiceAnswers[q.id];
                            const isRevealed = practiceRevealed[q.id];

                            return (
                                <div
                                    key={q.id}
                                    className={`bg-gray-800/50 border rounded-xl overflow-hidden transition-all ${colors.border}`}
                                >
                                    <button
                                        onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                                        className="w-full p-4 text-left flex items-start gap-4 hover:bg-gray-800/80 transition-colors"
                                    >
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
                                            {masteryLevel.toUpperCase()}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium line-clamp-2">{q.question}</p>
                                        </div>
                                        <ChevronDown className={`text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={20} />
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
                                                    {q.options.map((option, optIdx) => {
                                                        let optStyle = "border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-500";

                                                        if (isRevealed) {
                                                            if (optIdx === q.correctAnswer) {
                                                                optStyle = "border-green-500 bg-green-500/10 text-green-100";
                                                            } else if (optIdx === selectedOpt) {
                                                                optStyle = "border-red-500 bg-red-500/10 text-red-100";
                                                            } else {
                                                                optStyle = "border-gray-800 bg-gray-900/20 text-gray-600 opacity-50";
                                                            }
                                                        }

                                                        return (
                                                            <button
                                                                key={optIdx}
                                                                onClick={() => handlePracticeAnswer(q.id, optIdx)}
                                                                disabled={isRevealed}
                                                                className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${optStyle}`}
                                                            >
                                                                {option}
                                                            </button>
                                                        );
                                                    })}

                                                    {isRevealed && (
                                                        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg text-sm text-gray-300">
                                                            <strong className="text-gray-400">Explanation:</strong> {q.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // ============ RENDER: MASTERY FLASHCARDS MODE ============

    if (mode === 'mastery') {
        if (showMasteryResults) {
            const stats = flashcardProgress.getStatistics(flashcardIds);
            return (
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Session Complete!</h3>
                    <p className="text-gray-300 mb-6">You've reviewed all {masteryQuestions.length} cards for today.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-900/50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-emerald-400">{stats.mastered}</p>
                            <p className="text-xs text-gray-400">Mastered</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-amber-400">{stats.learning + stats.reviewing}</p>
                            <p className="text-xs text-gray-400">Still Learning</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={startMasteryMode} className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2">
                            <RotateCcw size={18} /> Review Again
                        </button>
                        <button onClick={resetToSelection} className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors">
                            Menu
                        </button>
                    </div>
                </div>
            );
        }

        const card = masteryQuestions[masteryIndex];
        if (!card) return null;

        const cardId = `fc_${card.id}`;
        const masteryLevel = flashcardProgress.getCardMasteryLevel(cardId);
        const colors = getMasteryColor(masteryLevel);

        return (
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={resetToSelection} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                        <ChevronRight className="rotate-180" size={16} /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
                            {masteryLevel.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm font-mono">
                            {masteryIndex + 1}/{masteryQuestions.length}
                        </span>
                    </div>
                </div>

                <motion.div
                    key={card.id}
                    initial={{ opacity: 0, rotateX: -15 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    className="bg-gray-800/80 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm min-h-[400px] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${card.category === 'Anion' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {card.category} Analysis
                        </span>
                        <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase">{card.title}</h3>
                    </div>

                    {/* Question */}
                    <div className="flex-1 flex flex-col justify-center text-center">
                        <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
                            {card.question}
                        </h2>

                        <AnimatePresence>
                            {isCardRevealed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-black/30 rounded-xl p-6 border border-gray-700"
                                >
                                    <p className="text-green-400 font-bold text-xl mb-2">{card.answer}</p>
                                    <p className="text-gray-400 text-sm">{card.logic}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                        {!isCardRevealed ? (
                            <button
                                onClick={() => setIsCardRevealed(true)}
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Eye size={20} /> Reveal Answer
                            </button>
                        ) : (
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={() => handleMasteryGrade(1)}
                                    className="py-3 bg-red-600/80 text-white rounded-xl font-bold hover:bg-red-500 transition-colors text-sm"
                                >
                                    Again
                                </button>
                                <button
                                    onClick={() => handleMasteryGrade(3)}
                                    className="py-3 bg-orange-600/80 text-white rounded-xl font-bold hover:bg-orange-500 transition-colors text-sm"
                                >
                                    Hard
                                </button>
                                <button
                                    onClick={() => handleMasteryGrade(4)}
                                    className="py-3 bg-blue-600/80 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors text-sm"
                                >
                                    Good
                                </button>
                                <button
                                    onClick={() => handleMasteryGrade(5)}
                                    className="py-3 bg-green-600/80 text-white rounded-xl font-bold hover:bg-green-500 transition-colors text-sm"
                                >
                                    Easy
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}
