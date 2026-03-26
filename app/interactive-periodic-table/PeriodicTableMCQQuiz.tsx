'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Target,
    RotateCcw,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Lightbulb,
    Atom,
    Zap,
    BookOpen,
    Clock,
    Timer,
    ChevronLeft,
    X,
    Play,
    Pause,
    Info
} from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        question: "In Henry Moseley's 1913 experiment that led to the Modern Periodic Law, which mathematical relationship established that atomic number is a more fundamental property than atomic mass?",
        options: [
            "Plot of X-ray frequency (ν) vs. atomic mass is a straight line",
            "Plot of the square root of X-ray frequency (√ν) vs. atomic number (Z) is a straight line",
            "Plot of atomic radius vs. atomic number (Z) is a straight line",
            "Plot of X-ray wavelength (λ) vs. atomic number (Z) is a straight line"
        ],
        correctAnswer: 1,
        explanation: "Moseley observed regularities in characteristic X-ray spectra. A plot of √ν against atomic number (Z) gave a straight line, unlike the plot of ν vs. atomic mass.",
        topic: "Periodic Law",
        difficulty: "medium"
    },
    {
        id: 2,
        question: "While constructing his periodic table, Mendeleev placed Iodine (atomic weight 127) in Group VII along with Fluorine and Chlorine, instead of placing it before Tellurium (atomic weight 128). What was his primary justification for this?",
        options: [
            "Iodine is a halogen and therefore lighter than Tellurium",
            "He believed the atomic weight measurement for Tellurium was incorrect",
            "He prioritized grouping elements with similar chemical properties over strict increasing atomic weight",
            "Iodine has a higher atomic number than Tellurium"
        ],
        correctAnswer: 2,
        explanation: "Mendeleev ignored the strict order of atomic weights and placed elements with similar properties together.",
        topic: "Periodic Classification",
        difficulty: "medium"
    },
    {
        id: 3,
        question: "What is the correct IUPAC name and symbol for the hypothetical element with atomic number 120?",
        options: [
            "Unnilbium (Unb)",
            "Unbinilium (Ubn)",
            "Ununbium (Uub)",
            "Unbiquadium (Ubq)"
        ],
        correctAnswer: 1,
        explanation: "Following IUPAC nomenclature rules: 1 = un, 2 = bi, 0 = nil. Adding '-ium' gives Unbinilium. The symbol is Ubn.",
        topic: "IUPAC Nomenclature",
        difficulty: "easy"
    },
    {
        id: 4,
        question: "The 5th period of the periodic table contains 18 elements. Which set of subshells is progressively filled across this period?",
        options: [
            "5s, 5p, 5d",
            "5s, 4d, 5p",
            "5s, 4f, 5p",
            "4d, 5s, 5p"
        ],
        correctAnswer: 1,
        explanation: "The order of orbital energy is 5s < 4d < 5p. These subshells provide 9 orbitals, accommodating a maximum of 18 electrons.",
        topic: "Electronic Configuration",
        difficulty: "medium"
    },
    {
        id: 5,
        question: "Helium (1s²) is strictly an s-block element, yet it is placed in Group 18 of the p-block. What is the primary reason for this placement?",
        options: [
            "It exhibits strong pπ – pπ back bonding",
            "Its atomic radius matches the trend of the p-block exactly",
            "It has a completely filled valence shell, making it chemically inert like other noble gases",
            "Its ionization enthalpy is lower than expected for an s-block element"
        ],
        correctAnswer: 2,
        explanation: "Helium is placed with noble gases because its valence shell is fully filled, and it exhibits the characteristic inert properties of Group 18 elements.",
        topic: "Periodic Classification",
        difficulty: "easy"
    },
    {
        id: 6,
        question: "Which of the following accurately describes the relationship between Actinoids and Lanthanoids?",
        options: [
            "Actinoid chemistry is simpler because they have a stable +3 oxidation state exclusively",
            "Lanthanoids are all man-made radioactive elements, unlike Actinoids",
            "Actinoid chemistry is more complicated due to the large number of oxidation states possible",
            "The actinoid contraction is less pronounced than the lanthanoid contraction"
        ],
        correctAnswer: 2,
        explanation: "The chemistry of early actinoids is more complex than corresponding lanthanoids because they can exhibit a large number of oxidation states.",
        topic: "f-Block Elements",
        difficulty: "medium"
    },
    {
        id: 7,
        question: "Arrange the following isoelectronic species in order of increasing ionic radii: N³⁻, O²⁻, F⁻, Na⁺, Mg²⁺, Al³⁺",
        options: [
            "Al³⁺ < Mg²⁺ < Na⁺ < F⁻ < O²⁻ < N³⁻",
            "N³⁻ < O²⁻ < F⁻ < Na⁺ < Mg²⁺ < Al³⁺",
            "Na⁺ < Mg²⁺ < Al³⁺ < F⁻ < O²⁻ < N³⁻",
            "F⁻ < O²⁻ < N³⁻ < Na⁺ < Mg²⁺ < Al³⁺"
        ],
        correctAnswer: 0,
        explanation: "In isoelectronic species, as the positive nuclear charge (number of protons) increases, the electrons are pulled closer to the nucleus, decreasing the radius.",
        topic: "Atomic Radius",
        difficulty: "hard"
    },
    {
        id: 8,
        question: "Why is the atomic radius of a noble gas generally reported as much larger than the atomic radius of the preceding halogen in the same period?",
        options: [
            "Noble gases have lower effective nuclear charge than halogens",
            "Noble gases form extensive metallic bonds",
            "The radius of a noble gas is measured as a van der Waals radius, which is larger than a bonded covalent radius",
            "Noble gases suffer from an extreme shielding effect by their complete valence shell"
        ],
        correctAnswer: 2,
        explanation: "Being monoatomic and non-bonding, noble gas radii are expressed as van der Waals radii, which are significantly larger than the covalent radii used for other elements.",
        topic: "Atomic Radius",
        difficulty: "medium"
    },
    {
        id: 9,
        question: "The first ionization enthalpy (ΔiH) of Boron (Z=5) is lower than that of Beryllium (Z=4). What is the primary reason for this anomaly?",
        options: [
            "Boron has a smaller atomic radius than Beryllium",
            "The 2p electron of Boron is more effectively shielded by the inner core than the 2s electron of Beryllium",
            "Beryllium has a half-filled 2p orbital",
            "The 2p electron of Boron penetrates closer to the nucleus than the 2s electron of Beryllium"
        ],
        correctAnswer: 1,
        explanation: "An s-electron penetrates closer to the nucleus than a p-electron. Thus, the 2p electron in Boron is more shielded and easier to remove than the fully filled 2s electron pair in Beryllium.",
        topic: "Ionization Enthalpy",
        difficulty: "hard"
    },
    {
        id: 10,
        question: "Oxygen has a lower first ionization enthalpy than Nitrogen. What quantum mechanical principle explains this observation?",
        options: [
            "Aufbau Principle",
            "Pauli Exclusion Principle",
            "Heisenberg's Uncertainty Principle",
            "Hund's Rule of Maximum Multiplicity"
        ],
        correctAnswer: 3,
        explanation: "Nitrogen has a stable, half-filled 2p subshell (three electrons in different orbitals). In Oxygen, the fourth 2p electron must pair up, leading to electron-electron repulsion, making it easier to remove.",
        topic: "Ionization Enthalpy",
        difficulty: "hard"
    },
    {
        id: 11,
        question: "Element X has the following successive ionization enthalpies (in kJ/mol): IE₁ = 520, IE₂ = 7300, IE₃ = 11815. What is the most likely identity of Element X?",
        options: [
            "Magnesium",
            "Lithium",
            "Boron",
            "Carbon"
        ],
        correctAnswer: 1,
        explanation: "The massive jump between IE₁ and IE₂ indicates that the first electron was a valence electron and the second electron is being removed from a stable, noble gas core. This is characteristic of Group 1 alkali metals like Lithium.",
        topic: "Ionization Enthalpy",
        difficulty: "hard"
    },
    {
        id: 12,
        question: "Compare the ionization enthalpies of Sodium and Magnesium. Which of the following statements is true?",
        options: [
            "Both IE₁ and IE₂ of Na are higher than Mg",
            "Both IE₁ and IE₂ of Na are lower than Mg",
            "IE₁ of Na is lower than Mg, but IE₂ of Na is higher than Mg",
            "IE₁ of Na is higher than Mg, but IE₂ of Na is lower than Mg"
        ],
        correctAnswer: 2,
        explanation: "Na (3s¹) easily loses one electron (IE₁ is low). The second electron is removed from a stable 2p⁶ core, requiring more energy. Mg (3s²) requires more energy for the first electron, but less for the second compared to the core removal in Na.",
        topic: "Ionization Enthalpy",
        difficulty: "hard"
    },
    {
        id: 13,
        question: "Which of the following elements has the most negative electron gain enthalpy (ΔₑgH)?",
        options: [
            "Fluorine",
            "Chlorine",
            "Oxygen",
            "Sulphur"
        ],
        correctAnswer: 1,
        explanation: "While Fluorine is more electronegative, Chlorine has the most negative electron gain enthalpy. The added electron in F goes into a highly compact 2p orbital, causing significant electron-electron repulsion, whereas Cl's 3p orbital is larger and accommodates the electron more easily.",
        topic: "Electron Gain Enthalpy",
        difficulty: "medium"
    },
    {
        id: 14,
        question: "What is the typical sign of the electron gain enthalpy (ΔₑgH) for noble gases, and why?",
        options: [
            "Large negative, because they easily form anions",
            "Large positive, because the added electron must enter the next higher principal quantum level, creating an unstable state",
            "Zero, because they do not interact with electrons",
            "Small negative, due to weak van der Waals forces"
        ],
        correctAnswer: 1,
        explanation: "Adding an electron to a noble gas requires forcing it into a completely new, higher-energy shell. This is an endothermic process, resulting in a positive enthalpy change.",
        topic: "Electron Gain Enthalpy",
        difficulty: "medium"
    },
    {
        id: 15,
        question: "In terms of periodic trends, electronegativity is directly proportional to which of the following properties?",
        options: [
            "Metallic character",
            "Non-metallic character",
            "Atomic radius",
            "Shielding effect"
        ],
        correctAnswer: 1,
        explanation: "Electronegativity is the tendency to attract shared electrons, which is a hallmark of non-metals. Thus, as electronegativity increases across a period, non-metallic character also increases.",
        topic: "Electronegativity",
        difficulty: "easy"
    },
    {
        id: 16,
        question: "The anomalous behavior of second-period elements (Li to F) compared to heavier members of their groups is primarily due to:",
        options: [
            "Large atomic size and low electronegativity",
            "Availability of low-lying d-orbitals",
            "Small size, high charge/radius ratio, and the absence of d-orbitals in their valence shell",
            "The inert pair effect"
        ],
        correctAnswer: 2,
        explanation: "Second-period elements exhibit anomalous behavior because they are small, highly electronegative, and only have 2s and 2p orbitals (max covalency of 4), lacking d-orbitals for valence expansion.",
        topic: "Periodic Classification",
        difficulty: "medium"
    },
    {
        id: 17,
        question: "Why is Aluminium able to form the complex ion [AlF₆]³⁻, whereas Boron is restricted to forming [BF₄]⁻?",
        options: [
            "Boron is a metalloid while Aluminium is a metal",
            "Boron lacks vacant d-orbitals in its valence shell, restricting its covalency to 4",
            "Aluminium has a higher ionization enthalpy than Boron",
            "Boron exhibits a strong inert pair effect"
        ],
        correctAnswer: 1,
        explanation: "Boron is in the second period and only has four valence orbitals (2s and three 2p). It cannot expand its octet. Aluminium (period 3) has 3d orbitals available to expand its covalency.",
        topic: "Periodic Classification",
        difficulty: "hard"
    },
    {
        id: 18,
        question: "Which structural phenomenon is uniquely characteristic of the first members of the p-block (C, N, O) but extremely rare in heavier members (Si, P, S)?",
        options: [
            "Catenation",
            "Formation of strong pπ – pπ multiple bonds",
            "Formation of amphoteric oxides",
            "Exhibition of the maximum group oxidation state"
        ],
        correctAnswer: 1,
        explanation: "The small size of the 2p orbitals allows elements like C, N, and O to form strong pπ – pπ multiple bonds (e.g., C≡C, N≡N). Heavier elements have large, diffuse orbitals that cannot overlap effectively sideways.",
        topic: "Periodic Classification",
        difficulty: "hard"
    },
    {
        id: 19,
        question: "What is the fundamental reason behind the \"diagonal relationship\" observed between elements like Lithium-Magnesium and Beryllium-Aluminium?",
        options: [
            "They belong to the same period",
            "They have identical electronic configurations",
            "They possess similar size, charge/radius ratios, and polarizing power",
            "They both lack d-orbitals"
        ],
        correctAnswer: 2,
        explanation: "The increase in charge and decrease in size across a period is roughly compensated by the opposite trends down a group, leading diagonally positioned elements to have similar charge/radius ratios and related chemical behaviors.",
        topic: "Periodic Classification",
        difficulty: "medium"
    },
    {
        id: 20,
        question: "What is the oxidation state of Oxygen in the compound OF₂ and Na₂O₂ respectively?",
        options: [
            "-2 and -2",
            "+2 and -2",
            "-1 and +1",
            "-2 and +1"
        ],
        correctAnswer: 1,
        explanation: "Fluorine is more electronegative than Oxygen, so F takes -1, forcing O to be +2 in OF₂. Sodium is less electronegative, so O acts as the anion, taking a -2 state in Na₂O₂.",
        topic: "Oxidation States",
        difficulty: "medium"
    },
    {
        id: 21,
        question: "In the complex ion [AlCl(H₂O)₅]²⁺, what are the oxidation state and covalency of Aluminium?",
        options: [
            "Oxidation state = +2, Covalency = 5",
            "Oxidation state = +3, Covalency = 6",
            "Oxidation state = +3, Covalency = 5",
            "Oxidation state = +2, Covalency = 6"
        ],
        correctAnswer: 1,
        explanation: "The complex has 6 ligands (1 Cl and 5 H₂O) bonded to the metal, so the covalency is 6. Calculating charge: x + (-1) + 5(0) = +2 → x = +3.",
        topic: "Oxidation States",
        difficulty: "hard"
    },
    {
        id: 22,
        question: "According to periodic trends in chemical reactivity, normal oxides formed by elements on the extreme left of the periodic table are _____, while those on the extreme right are _____.",
        options: [
            "Acidic ; Basic",
            "Basic ; Acidic",
            "Neutral ; Amphoteric",
            "Basic ; Acidic"
        ],
        correctAnswer: 1,
        explanation: "Extreme left elements (metals like Na) form highly basic oxides (Na₂O). Extreme right elements (non-metals like Cl) form highly acidic oxides (Cl₂O₇).",
        topic: "Oxide Chemistry",
        difficulty: "easy"
    },
    {
        id: 23,
        question: "Among the following, which pair of oxides is considered strictly amphoteric?",
        options: [
            "Na₂O and CaO",
            "CO₂ and SO₃",
            "Al₂O₃ and As₂O₃",
            "NO and N₂O"
        ],
        correctAnswer: 2,
        explanation: "Al₂O₃ and As₂O₃ are amphoteric (they react with both acids and bases). Na₂O is basic, CO₂ is acidic, and NO/N₂O are neutral oxides.",
        topic: "Oxide Chemistry",
        difficulty: "medium"
    },
    {
        id: 24,
        question: "Based on group valence trends, what is the predicted formula of a binary compound formed by Silicon (Group 14) and Oxygen (Group 16)?",
        options: [
            "SiO₂",
            "SiO₂",
            "SiO",
            "Si₂O₃"
        ],
        correctAnswer: 0,
        explanation: "Silicon has a valence of 4. Oxygen has a valence of 2. The empirical formula simplifies to SiO₂.",
        topic: "Chemical Formulas",
        difficulty: "easy"
    },
    {
        id: 25,
        question: "A student tests the aqueous solution of two unknown oxides, Oxide X and Oxide Y, with litmus paper. Oxide X turns red litmus blue, while Oxide Y turns blue litmus red. Which of the following is the most likely identity of X and Y?",
        options: [
            "X = Cl₂O₇, Y = Na₂O",
            "X = CO₂, Y = Na₂O",
            "X = Na₂O, Y = Cl₂O₇",
            "X = Al₂O₃, Y = As₂O₃"
        ],
        correctAnswer: 2,
        explanation: "Red to blue means basic (Na₂O, a metallic oxide). Blue to red means acidic (Cl₂O₇, a non-metallic oxide).",
        topic: "Oxide Chemistry",
        difficulty: "medium"
    },
    {
        id: 26,
        question: "The transition elements (d-block) exhibit a much smaller decrease in atomic radii across a period compared to s- and p-block elements. What primarily accounts for this?",
        options: [
            "They have completely empty outermost s-orbitals",
            "The shielding effect of the inner (n-1)d electrons counteracts the increasing nuclear charge",
            "They form complex ions with water",
            "Their ionization enthalpies are lower than alkali metals"
        ],
        correctAnswer: 1,
        explanation: "In transition elements, the newly added electrons enter the inner (n-1)d subshell, which efficiently screens the outer ns electrons from the increasing nuclear charge, dampening the decrease in radius.",
        topic: "Atomic Radius",
        difficulty: "hard"
    },
    {
        id: 27,
        question: "What happens to the \"shielding effect\" as we move down a group in the periodic table, and what is its consequence on ionization enthalpy?",
        options: [
            "Shielding decreases, causing ionization enthalpy to increase",
            "Shielding increases, outweighing the increasing nuclear charge, causing ionization enthalpy to decrease",
            "Shielding remains constant, but nuclear charge increases, causing ionization enthalpy to increase",
            "Shielding increases, completely cancelling out nuclear charge, making ionization enthalpy zero"
        ],
        correctAnswer: 1,
        explanation: "Down a group, inner energy levels are completely filled, vastly increasing the shielding effect. This outweighs the increased nuclear charge, making it easier to remove the outermost electron.",
        topic: "Ionization Enthalpy",
        difficulty: "hard"
    },
    {
        id: 28,
        question: "Why does the actual chemical reactivity of elements drop to its lowest point in the middle of the periodic table (e.g., Groups 13, 14)?",
        options: [
            "They have extremely high electronegativity values",
            "They possess completely filled d-orbitals",
            "They have intermediate ionization enthalpies (not easily losing electrons) and intermediate electron gain enthalpies (not easily gaining electrons)",
            "They exist strictly as unreactive monoatomic gases"
        ],
        correctAnswer: 2,
        explanation: "Reactivity is highest at the extremes (ease of losing e⁻ on the left, ease of gaining e⁻ on the right). Elements in the middle have intermediate values, making ion formation energetically difficult, leading to lower reactivity and predominantly covalent chemistry.",
        topic: "Chemical Reactivity",
        difficulty: "hard"
    },
    {
        id: 29,
        question: "Which of the following factors does NOT significantly affect the valence shell of an element?",
        options: [
            "Valence principal quantum number (n)",
            "Nuclear mass",
            "Nuclear charge (Z)",
            "Number of core electrons"
        ],
        correctAnswer: 1,
        explanation: "Chemical properties and valence shell interactions are governed by electronic structure (n, Z, shielding by core electrons). Nuclear mass primarily affects physical properties like density and isotopy, not the chemical behavior of the valence shell.",
        topic: "Electronic Configuration",
        difficulty: "medium"
    },
    {
        id: 30,
        question: "Consider an element with the outer electronic configuration (n − 2)f⁷(n − 1)d¹ns² for n=6. To which block and specific series does this element belong?",
        options: [
            "d-block, Transition Series",
            "f-block, Lanthanoid Series",
            "f-block, Actinoid Series",
            "p-block, Heavy Metals"
        ],
        correctAnswer: 1,
        explanation: "The presence of electrons deep in the f-orbital indicates an inner-transition element (f-block). Because n=6, the orbital filled is 4f, which corresponds to the Lanthanoid series (Actinoids would be n=7 / 5f).",
        topic: "f-Block Elements",
        difficulty: "hard"
    }
];

const TOPIC_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    "Periodic Law": { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
    "Periodic Classification": { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
    "IUPAC Nomenclature": { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
    "Electronic Configuration": { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
    "f-Block Elements": { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-rose-500/20" },
    "Atomic Radius": { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
    "Ionization Enthalpy": { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/20" },
    "Electron Gain Enthalpy": { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", glow: "shadow-pink-500/20" },
    "Electronegativity": { bg: "bg-lime-500/10", border: "border-lime-500/30", text: "text-lime-400", glow: "shadow-lime-500/20" },
    "Oxidation States": { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/20" },
    "Oxide Chemistry": { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", glow: "shadow-teal-500/20" },
    "Chemical Formulas": { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30", text: "text-fuchsia-400", glow: "shadow-fuchsia-500/20" },
    "Chemical Reactivity": { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20" },
};

const DIFFICULTY_BADGES = {
    easy: { text: "Easy", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    medium: { text: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    hard: { text: "Hard", color: "bg-red-500/20 text-red-400 border-red-500/30" }
};

type QuizState = 'idle' | 'playing' | 'answered' | 'finished';
type TimerState = 'idle' | 'running' | 'paused';

export default function PeriodicTableMCQQuiz() {
    const [quizState, setQuizState] = useState<QuizState>('idle');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<{ questionId: number; correct: boolean; selected: number }[]>([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [timeRemaining, setTimeRemaining] = useState(1200);
    const [elapsedTime, setElapsedTime] = useState(0);

    const currentQuestion = QUESTIONS[currentIndex];
    const theme = TOPIC_COLORS[currentQuestion?.topic] || TOPIC_COLORS["Periodic Law"];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerState === 'running' && timeRemaining > 0 && quizState !== 'finished') {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setQuizState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerState, timeRemaining, quizState]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startQuiz = (withTimer: boolean = false) => {
        setQuizState('playing');
        setCurrentIndex(0);
        setScore(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimerState(withTimer ? 'running' : 'idle');
        setTimeRemaining(1200);
        setElapsedTime(0);
    };

    const stopQuiz = () => {
        setQuizState('finished');
        setTimerState('idle');
    };

    const jumpToQuestion = (index: number) => {
        if (index === currentIndex) return;
        setCurrentIndex(index);
        setSelectedAnswer(null);
        setQuizState('playing');
        setShowExplanation(false);
        
        const existingAnswer = answers.find(a => a.questionId === QUESTIONS[index].id);
        if (existingAnswer) {
            setSelectedAnswer(existingAnswer.selected);
            setQuizState('answered');
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (quizState !== 'playing') return;
        
        const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
        if (existingAnswer) return;
        
        setSelectedAnswer(index);
        setQuizState('answered');
        
        const isCorrect = index === currentQuestion.correctAnswer;
        if (isCorrect) setScore(s => s + 1);
        
        setAnswers(prev => [...prev, { 
            questionId: currentQuestion.id, 
            correct: isCorrect, 
            selected: index 
        }]);
    };

    const handleNext = () => {
        if (currentIndex < QUESTIONS.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSelectedAnswer(null);
            setQuizState('playing');
            setShowExplanation(false);
            
            const existingAnswer = answers.find(a => a.questionId === QUESTIONS[nextIndex].id);
            if (existingAnswer) {
                setSelectedAnswer(existingAnswer.selected);
                setQuizState('answered');
            }
        } else {
            setQuizState('finished');
            setTimerState('idle');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setShowExplanation(false);
            
            const existingAnswer = answers.find(a => a.questionId === QUESTIONS[prevIndex].id);
            if (existingAnswer) {
                setSelectedAnswer(existingAnswer.selected);
                setQuizState('answered');
            } else {
                setSelectedAnswer(null);
                setQuizState('playing');
            }
        }
    };

    const handleRestart = () => {
        setQuizState('idle');
        setTimerState('idle');
    };

    const toggleTimer = () => {
        if (timerState === 'running') {
            setTimerState('paused');
        } else {
            setTimerState('running');
        }
    };

    const formatFormula = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part) && index > 0 && /[A-Za-z)²³⁺⁻]$/.test(parts[index - 1])) {
                return <sub key={index} className="text-[0.75em]">{part}</sub>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    const QuestionGrid = () => (
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-3">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-300">Navigator</h4>
                <span className="text-xs text-gray-500">{answers.length}/{QUESTIONS.length}</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
                {QUESTIONS.map((q, idx) => {
                    const answer = answers.find(a => a.questionId === q.id);
                    const isCurrent = idx === currentIndex;
                    const isAnswered = !!answer;
                    const isCorrect = answer?.correct;
                    
                    return (
                        <button
                            key={q.id}
                            onClick={() => jumpToQuestion(idx)}
                            className={`aspect-square rounded-md text-xs font-bold transition-all ${
                                isCurrent 
                                    ? 'bg-indigo-500 text-white ring-2 ring-indigo-400' 
                                    : isAnswered
                                        ? isCorrect
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    );
                })}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-800">
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-green-500/30 border border-green-500/50" />
                        <span className="text-gray-500 text-xs">Correct</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-red-500/30 border border-red-500/50" />
                        <span className="text-gray-500 text-xs">Wrong</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl -z-10" />
            
            <div className="bg-[#0d1117]/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 overflow-hidden">
                {/* Header */}
                <div className="relative px-6 py-4 border-b border-gray-800/60">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <Atom className="text-indigo-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Knowledge Check</h2>
                                <p className="text-xs text-gray-500">30 questions • Complete Periodicity chapter</p>
                            </div>
                        </div>
                        
                        {quizState !== 'idle' && quizState !== 'finished' && (
                            <div className="flex items-center gap-4">
                                {timerState !== 'idle' && (
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                                        timeRemaining < 60 
                                            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                            : 'bg-gray-800 border-gray-700 text-gray-300'
                                    }`}>
                                        <Clock size={14} />
                                        <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Target size={14} className="text-cyan-400" />
                                    <span className="text-gray-400">{currentIndex + 1}/{QUESTIONS.length}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Trophy size={14} className="text-amber-400" />
                                    <span className="text-white font-semibold">{score}</span>
                                </div>
                                
                                <button
                                    onClick={stopQuiz}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                                    title="End Quiz"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {quizState === 'idle' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12 px-4"
                        >
                            {/* Creative periodic table element-inspired design */}
                            <div className="relative mb-8">
                                <div className="inline-block relative">
                                    {/* Atomic number style badge */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        30
                                    </div>
                                    {/* Main element card */}
                                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl shadow-purple-500/30 border-2 border-white/20">
                                        <div className="text-6xl font-black text-white mb-2 tracking-tight">Pd</div>
                                        <div className="text-sm text-white/90 font-medium">Periodicity</div>
                                    </div>
                                    {/* Atomic mass style badge */}
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-500 to-orange-600 px-3 py-1 rounded-lg text-white text-xs font-bold shadow-lg">
                                        Class 11
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Think You Know Periodicity?
                            </h3>
                            <p className="text-gray-300 text-base mb-2 max-w-xl mx-auto font-medium">
                                <span className="text-white font-bold">30 challenging questions from the lines of NCERT</span> to master the Periodicity chapter — from atomic radius to oxidation states.
                            </p>
                            <p className="text-amber-400 text-sm mb-8 max-w-xl mx-auto font-bold">
                                🎯 This isn't just practice — it's your final checkpoint before the exam!
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => startQuiz(false)}
                                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
                                >
                                    <Zap size={20} />
                                    Start Practice
                                </button>
                                <button
                                    onClick={() => startQuiz(true)}
                                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
                                >
                                    <Timer size={20} />
                                    Timed Mode (20 min)
                                </button>
                            </div>
                        </motion.div>
                    ) : quizState === 'finished' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6 max-w-lg mx-auto"
                        >
                            <div className="relative w-28 h-28 mx-auto mb-5">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                    <motion.circle
                                        cx="50" cy="50" r="42" fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={`${(score / QUESTIONS.length) * 264} 264`}
                                        initial={{ strokeDashoffset: 264 }}
                                        animate={{ strokeDashoffset: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white">{score}</span>
                                    <span className="text-xs text-gray-500">/{QUESTIONS.length}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {score === QUESTIONS.length ? "Perfect Score! 🎉" : 
                                 score >= QUESTIONS.length * 0.7 ? "Great Job! 🌟" : 
                                 score >= QUESTIONS.length * 0.5 ? "Good Effort! 💪" : "Keep Learning! 📚"}
                            </h3>
                            
                            {timerState !== 'idle' && (
                                <p className="text-gray-400 text-sm mb-2">
                                    Time: {formatTime(elapsedTime)}
                                </p>
                            )}
                            
                            <p className="text-gray-400 text-sm mb-6">
                                You answered {score} out of {QUESTIONS.length} questions correctly
                                ({Math.round((score / QUESTIONS.length) * 100)}% accuracy)
                            </p>

                            <button
                                onClick={handleRestart}
                                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl border border-gray-700 transition-all"
                            >
                                <RotateCcw size={16} />
                                Try Again
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Question Card */}
                            <div className="lg:col-span-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentQuestion.id}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className={`mb-4 p-4 rounded-xl border ${theme.bg} ${theme.border} shadow-lg`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${DIFFICULTY_BADGES[currentQuestion.difficulty].color}`}>
                                                    {DIFFICULTY_BADGES[currentQuestion.difficulty].text}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-medium text-white leading-relaxed">
                                                {formatFormula(currentQuestion.question)}
                                            </h3>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {currentQuestion.options.map((option, index) => {
                                                const isSelected = selectedAnswer === index;
                                                const isCorrect = index === currentQuestion.correctAnswer;
                                                const showResult = quizState === 'answered';
                                                
                                                let buttonClass = "w-full p-3 rounded-lg border text-left transition-all duration-200 flex items-start gap-3 ";
                                                
                                                if (showResult) {
                                                    if (isCorrect) {
                                                        buttonClass += "bg-emerald-500/15 border-emerald-500/40 ";
                                                    } else if (isSelected && !isCorrect) {
                                                        buttonClass += "bg-red-500/15 border-red-500/40 ";
                                                    } else {
                                                        buttonClass += "bg-gray-800/50 border-gray-700/50 opacity-50 ";
                                                    }
                                                } else {
                                                    buttonClass += isSelected 
                                                        ? "bg-indigo-500/15 border-indigo-500 shadow-lg shadow-indigo-500/20"
                                                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800";
                                                }

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleAnswerSelect(index)}
                                                        disabled={quizState === 'answered'}
                                                        className={buttonClass}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                                                                showResult 
                                                                    ? isCorrect 
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : isSelected 
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'bg-gray-700 text-gray-400'
                                                                : isSelected
                                                                    ? 'bg-indigo-500 text-white'
                                                                    : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                                                            }`}>
                                                                {String.fromCharCode(65 + index)}
                                                            </div>
                                                            <span className="text-base text-gray-200 leading-relaxed font-medium">
                                                                {formatFormula(option)}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <AnimatePresence>
                                            {quizState === 'answered' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mb-4"
                                                >
                                                    <button
                                                        onClick={() => setShowExplanation(!showExplanation)}
                                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors mb-2"
                                                    >
                                                        <Lightbulb size={14} className={showExplanation ? "text-amber-400" : ""} />
                                                        {showExplanation ? "Hide Explanation" : "Show Explanation"}
                                                        <ChevronRight size={12} className={`transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
                                                    </button>
                                                    
                                                    {showExplanation && (
                                                        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                                            <p className="text-sm text-amber-100/90 leading-relaxed">
                                                                <span className="font-semibold text-amber-400">Logic: </span>
                                                                {formatFormula(currentQuestion.explanation)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentIndex === 0}
                                                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft size={16} />
                                                Previous
                                            </button>
                                            
                                            {quizState === 'answered' && (
                                                <button
                                                    onClick={handleNext}
                                                    className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-4 py-2 rounded-lg transition-all"
                                                >
                                                    {currentIndex < QUESTIONS.length - 1 ? 'Next' : 'Finish'}
                                                    <ChevronRight size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${((currentIndex + (quizState === 'answered' ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Right Column - Question Grid & Controls */}
                            <div className="space-y-4">
                                {timerState !== 'idle' && (
                                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Timer size={16} className="text-cyan-400" />
                                                <span className="text-sm font-medium text-gray-300">Timer</span>
                                            </div>
                                            <span className={`text-lg font-mono font-bold ${
                                                timeRemaining < 60 ? 'text-red-400' : 'text-white'
                                            }`}>
                                                {formatTime(timeRemaining)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={toggleTimer}
                                            className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
                                        >
                                            {timerState === 'running' ? 'Pause' : 'Resume'}
                                        </button>
                                    </div>
                                )}

                                <QuestionGrid />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
