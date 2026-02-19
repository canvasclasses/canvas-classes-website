'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, BookOpen, CheckCircle2, X, Target, Zap, Clock, 
    Star, Bookmark, ChevronDown, ChevronUp, Filter,
    ArrowLeft, Flame, Trophy, BarChart3, Settings,
    Sparkles, Brain, HelpCircle, LayoutGrid, FileText,
    TrendingUp, Award, ChevronRight, Calendar, BarChart,
    Activity, Home, ChevronLeft, Layers, XCircle, Info
} from 'lucide-react';
// Using old Question type for student app compatibility
// Admin panel uses V2 types separately
interface Question {
    id: string;
    textMarkdown: string;
    chapterId?: string;
    difficulty?: string;
    examSource?: string;
    isTopPYQ?: boolean;
    [key: string]: any;
}

interface TaxonomyNode {
    id: string;
    name: string;
    type: string;
    [key: string]: any;
}
import { useCrucibleProgress } from '@/hooks/useCrucibleProgress';
import { CHAPTERS, CHAPTER_ID_MAPPINGS } from '@/lib/chaptersConfig';
import { useMagnetic } from '@/hooks/useMagnetic';
import MolecularParticles from '@/components/effects/MolecularParticles';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/effects/ScrollReveal';
import QuestionCard from './QuestionCard';
import SolutionViewer from './SolutionViewer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

// Chapter configuration with icons and colors
const CHAPTER_CONFIG: Record<string, { icon: string; color: string; bg: string; gradient: string }> = {
    'chapter_some_basic_concepts': { icon: '⚖️', color: 'text-blue-400', bg: 'bg-blue-500/10', gradient: 'from-blue-500/20 to-cyan-500/20' },
    'chapter_structure_of_atom': { icon: '⚛️', color: 'text-purple-400', bg: 'bg-purple-500/10', gradient: 'from-purple-500/20 to-pink-500/20' },
    'chapter_states_of_matter': { icon: '💨', color: 'text-cyan-400', bg: 'bg-cyan-500/10', gradient: 'from-cyan-500/20 to-teal-500/20' },
    'chapter_thermodynamics': { icon: '🌡️', color: 'text-orange-400', bg: 'bg-orange-500/10', gradient: 'from-orange-500/20 to-red-500/20' },
    'chapter_equilibrium': { icon: '⚖️', color: 'text-green-400', bg: 'bg-green-500/10', gradient: 'from-green-500/20 to-emerald-500/20' },
    'chapter_classification_of_elements': { icon: '📊', color: 'text-pink-400', bg: 'bg-pink-500/10', gradient: 'from-pink-500/20 to-rose-500/20' },
    'chapter_chemical_bonding': { icon: '🔗', color: 'text-indigo-400', bg: 'bg-indigo-500/10', gradient: 'from-indigo-500/20 to-violet-500/20' },
    'chapter_hydrogen': { icon: '💧', color: 'text-red-400', bg: 'bg-red-400/10', gradient: 'from-red-400/20 to-orange-400/20' },
    'chapter_s_block': { icon: '🧱', color: 'text-yellow-400', bg: 'bg-yellow-500/10', gradient: 'from-yellow-500/20 to-amber-500/20' },
    'chapter_p_block_11': { icon: '🧪', color: 'text-teal-400', bg: 'bg-teal-500/10', gradient: 'from-teal-500/20 to-cyan-500/20' },
    'chapter_organic_chemistry_basic': { icon: '📝', color: 'text-emerald-400', bg: 'bg-emerald-500/10', gradient: 'from-emerald-500/20 to-green-500/20' },
    'chapter_hydrocarbons': { icon: '⛽', color: 'text-amber-400', bg: 'bg-amber-500/10', gradient: 'from-amber-500/20 to-yellow-500/20' },
    'chapter_environmental_chemistry': { icon: '🌍', color: 'text-green-400', bg: 'bg-green-600/10', gradient: 'from-green-600/20 to-teal-600/20' },
    'chapter_solutions': { icon: '💧', color: 'text-sky-400', bg: 'bg-sky-500/10', gradient: 'from-sky-500/20 to-blue-500/20' },
    'chapter_electrochemistry': { icon: '⚡', color: 'text-violet-400', bg: 'bg-violet-500/10', gradient: 'from-violet-500/20 to-purple-500/20' },
    'chapter_chemical_kinetics': { icon: '⏱️', color: 'text-rose-400', bg: 'bg-rose-500/10', gradient: 'from-rose-500/20 to-pink-500/20' },
    'chapter_surface_chemistry': { icon: '🌊', color: 'text-cyan-400', bg: 'bg-cyan-600/10', gradient: 'from-cyan-600/20 to-blue-600/20' },
    'chapter_general_principles_processes': { icon: '⚒️', color: 'text-gray-400', bg: 'bg-gray-500/10', gradient: 'from-gray-500/20 to-slate-500/20' },
    'chapter_p_block_12': { icon: '🧪', color: 'text-lime-400', bg: 'bg-lime-500/10', gradient: 'from-lime-500/20 to-green-500/20' },
    'chapter_d_f_block': { icon: '🔮', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', gradient: 'from-fuchsia-500/20 to-purple-500/20' },
    'chapter_coordination_compounds': { icon: '🎯', color: 'text-cyan-400', bg: 'bg-cyan-600/10', gradient: 'from-cyan-600/20 to-teal-600/20' },
    'chapter_haloalkanes_haloarenes': { icon: '🔥', color: 'text-orange-400', bg: 'bg-orange-600/10', gradient: 'from-orange-600/20 to-red-600/20' },
    'chapter_alcohols_phenols_ethers': { icon: '🍷', color: 'text-pink-400', bg: 'bg-pink-600/10', gradient: 'from-pink-600/20 to-rose-600/20' },
    'chapter_aldehydes_ketones': { icon: '⚗️', color: 'text-purple-400', bg: 'bg-purple-600/10', gradient: 'from-purple-600/20 to-indigo-600/20' },
    'chapter_amines': { icon: '💊', color: 'text-blue-400', bg: 'bg-blue-600/10', gradient: 'from-blue-600/20 to-cyan-600/20' },
    'chapter_biomolecules': { icon: '🧬', color: 'text-green-400', bg: 'bg-green-600/10', gradient: 'from-green-600/20 to-emerald-600/20' },
    'chapter_polymers': { icon: '🧵', color: 'text-yellow-400', bg: 'bg-yellow-600/10', gradient: 'from-yellow-600/20 to-amber-600/20' },
    'chapter_chemistry_everyday_life': { icon: '💊', color: 'text-teal-400', bg: 'bg-teal-600/10', gradient: 'from-teal-600/20 to-cyan-600/20' },
    'chapter_salt_analysis': { icon: '🧂', color: 'text-orange-400', bg: 'bg-orange-400/10', gradient: 'from-orange-400/20 to-amber-400/20' },
    'chapter_stereochemistry': { icon: '🔄', color: 'text-purple-400', bg: 'bg-purple-400/10', gradient: 'from-purple-400/20 to-fuchsia-400/20' },
    'chapter_aromatic_compounds': { icon: '📿', color: 'text-pink-400', bg: 'bg-pink-400/10', gradient: 'from-pink-400/20 to-rose-400/20' },
    'chapter_redox_reactions': { icon: '⚡', color: 'text-red-400', bg: 'bg-red-500/10', gradient: 'from-red-500/20 to-orange-500/20' },
    'chapter_ionic_equilibrium': { icon: '🧪', color: 'text-blue-400', bg: 'bg-blue-400/10', gradient: 'from-blue-400/20 to-indigo-400/20' },
};

// Shuffle utility
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Helper function to get standard chapter ID
function getStandardChapterId(chapterId: string): string {
    return CHAPTER_ID_MAPPINGS[chapterId] || chapterId;
}

// 30 Bhagvadgita Shlokas for daily rotation
const SHLOKAS = [
    { sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥", meaning: "You have the right to work only but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.", message: "Focus on your preparation journey, not just the exam results. Consistent effort is what matters." },
    { sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥", meaning: "Be steadfast in the performance of your duty, O Arjuna, abandoning attachment to success and failure. Such equanimity is called Yoga.", message: "Treat success and failure in mock tests equally. Both are learning opportunities." },
    { sanskrit: "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते॥", meaning: "One whose mind remains undisturbed amidst misery, who does not crave for pleasure, and who is free from attachment, fear, and anger, is called a sage of steady wisdom.", message: "Stay calm during difficult questions. Don't get excited by easy ones either." },
    { sanskrit: "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते।\nतस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्॥", meaning: "Endowed with wisdom, one discards both good and bad deeds here. Therefore, engage yourself in Yoga. Skill in action is Yoga.", message: "Develop your problem-solving skills. Mastery comes from balanced practice." },
    { sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥", meaning: "Whenever there is a decline in righteousness and rise of unrighteousness, O Arjuna, I manifest Myself.", message: "When you feel your motivation declining, remind yourself why you started this journey." },
    { sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥", meaning: "To protect the righteous, to destroy the wicked, and to re-establish dharma, I manifest myself in every age.", message: "Be the warrior who conquers their own doubts and fears every single day." },
    { sanskrit: "अजोऽपि सन्नव्ययात्मा भूतानामीश्वरोऽपि सन्।\nप्रकृतिं स्वामधिष्ठाय सम्भवाम्यात्ममायया॥", meaning: "Though I am unborn and of imperishable nature, though I am the Lord of all beings, yet by controlling My material nature, I manifest through My own power.", message: "You have infinite potential within you. Manifest it through disciplined practice." },
    { sanskrit: "जन्म कर्म च मे दिव्यमेवं यो वेत्ति तत्त्वतः।\nत्यक्त्वा देहं पुनर्जन्म नैति मामेति सोऽर्जुन॥", meaning: "One who knows the divine nature of My birth and activities, upon leaving the body, does not take birth again and attains Me.", message: "True understanding of concepts frees you from the cycle of rote memorization." },
    { sanskrit: "वीतरागभयक्रोधा मन्मया मामुपाश्रिताः।\nबहवो ज्ञानतपसा पूता मद्भावमागताः॥", meaning: "Free from attachment, fear, and anger, being absorbed in Me and taking refuge in Me, many purified by the austerity of knowledge have attained My state.", message: "Purify your understanding through deep study, not surface-level reading." },
    { sanskrit: "ये तु सर्वाणि कर्माणि मयि सन्न्यस्य मत्पराः।\nअनन्येनैव योगेन मां ध्यायन्त उपासते॥", meaning: "But those who, dedicating all actions to Me and regarding Me as the Supreme, worship Me with single-minded devotion.", message: "Dedicate your study sessions completely. No distractions, no half-measures." },
    { sanskrit: "तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्।", meaning: "For those who are constantly devoted to Me, I carry what they lack and preserve what they have.", message: "Consistent effort brings support from unexpected sources. Keep going." },
    { sanskrit: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥", meaning: "Whoever offers Me with devotion and a pure mind, a leaf, a flower, a fruit, or water - I accept that offering of love.", message: "Even small consistent efforts with dedication are valuable. Size doesn't matter, consistency does." },
    { sanskrit: "यत्करोषि यदश्नासि यज्जुहोषि ददासि यत्।\nयत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम्॥", meaning: "Whatever you do, whatever you eat, whatever you offer, whatever you give, whatever austerity you perform - do that as an offering to Me.", message: "Make every study session an offering to your future self." },
    { sanskrit: "समः शत्रौ च मित्रे च तथा मानापमानयोः।\nशीतोष्णसुखदुःखेषु समः सङ्गविवर्जितः॥", meaning: "He who is the same to foe and friend, honor and dishonor, cold and heat, pleasure and pain, and is free from attachment.", message: "Treat easy and difficult subjects with equal attention. Don't neglect any topic." },
    { sanskrit: "तुल्यनिन्दास्तुतिर्मौनी सन्तुष्टो येन केनचित्।\nअनिकेतः स्थिरमतिर्भक्तिमान्मे प्रियो नरः॥", meaning: "One who is indifferent to censure or praise, who is silent, content with anything, who has no home, who is steady-minded and full of devotion - such a person is dear to Me.", message: "Don't seek validation from others' opinions. Focus on your own growth." },
    { sanskrit: "श्रद्धावाँल्लभते ज्ञानं तत्परः संयतेन्द्रियः।\nज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥", meaning: "The man who is full of faith, who is devoted to it, and has subdued his senses, obtains knowledge. Having obtained knowledge, he soon attains the supreme peace.", message: "Have faith in your preparation. Control your distractions, knowledge will follow." },
    { sanskrit: "युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु।\nयुक्तस्वप्नावबोधस्य योगो भवति दुःखहा॥", meaning: "For one who is moderate in eating, recreation, work, and sleep, Yoga destroys all sorrow.", message: "Balance is key - study, rest, eat, and exercise in moderation." },
    { sanskrit: "कर्मेन्द्रियाणि संयम्य य आस्ते मनसा स्मरन्।\nइन्द्रियार्थान्विमूढात्मा मिथ्याचारः स उच्यते॥", meaning: "One who controls the senses of action but whose mind dwells on sense objects, whose nature is deluded, is called a hypocrite.", message: "Don't just control your phone physically, control your mental urge to check it too." },
    { sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥", meaning: "But those who worship Me, thinking of Me alone with single-minded devotion, for them I provide what they need and preserve what they have.", message: "Single-minded focus on your goals brings the resources you need." },
    { sanskrit: "यं यं वापि स्मरन्भावं त्यजत्यन्ते कलेवरम्।\nतं तमेवैति कौन्तेय सदा तद्भावभावितः॥", meaning: "Whatever state of being one remembers when he quits the body, O Arjuna, that alone does he attain, being ever absorbed in that thought.", message: "Your thoughts shape your reality. Think of success, not failure." },
    { sanskrit: "अथ चित्तं समाधातुं न शक्नोषि मयि स्थिरम्।\nअभ्यासयोगेन ततो मामिच्छाप्तुं धनञ्जय॥", meaning: "If you cannot fix your mind steadily on Me, then seek to reach Me by the practice of repeated effort.", message: "Can't focus? That's okay. Just keep trying. Practice makes focus possible." },
    { sanskrit: "अभ्यासेऽप्यसमर्थोऽसि मत्कर्मपरमो भव।\nमदर्थमपि कर्माणि कुर्वन् सिद्धिमवाप्स्यसि॥", meaning: "If you are unable to practice even this, then take refuge in Me alone. Even performing actions for My sake, you shall attain perfection.", message: "When motivation is low, just do one small task. Action brings momentum." },
    { sanskrit: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते॥", meaning: "Whatever action is performed by a great man, common men follow. Whatever standard he sets, the world follows.", message: "Be the example for your peers. Your dedication can inspire others." },
    { sanskrit: "सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत।\nकुर्याद्विद्वांस्तथासक्तश्चिकीर्षुर्लोकसङ्ग्रहम्॥", meaning: "As the ignorant perform actions with attachment, so should the wise act without attachment, wishing the welfare of the world.", message: "Study hard not just for yourself, but to make your family and mentors proud." },
    { sanskrit: "वेदाविनाशिनं नित्यं य एनमजमव्ययम्।\nकथं स पुरुषः पार्थ कं घातयति हन्ति कम्॥", meaning: "How can a person who knows the soul to be imperishable, eternal, unborn, and immutable, kill anyone or cause anyone to kill?", message: "Your knowledge is eternal. No one can take it from you. Invest in it." },
    { sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥", meaning: "It is better to do one's own duty imperfectly than to do another's duty perfectly. Better is death in the performance of one's own duty.", message: "Focus on your own preparation strategy. Don't copy others blindly." },
    { sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥", meaning: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results.", message: "Show up every day and do your best. The results will take care of themselves." }
];

// Arjuna Archer SVG Component
function ArjunaArcher({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 200 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="150" r="80" fill="url(#glow)" opacity="0.3" />
            <defs>
                <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
            </defs>
            <path d="M70 280 L70 200 Q70 180 85 170 L85 120 Q85 100 100 90 Q115 100 115 120 L115 170 Q130 180 130 200 L130 280" fill="currentColor" opacity="0.8" />
            <ellipse cx="100" cy="75" rx="20" ry="22" fill="currentColor" opacity="0.9" />
            <path d="M80 65 Q100 55 120 65 L118 75 L82 75 Z" fill="currentColor" opacity="0.7" />
            <path d="M40 150 Q40 80 100 60 Q160 80 160 150" stroke="url(#bowGradient)" strokeWidth="4" fill="none" />
            <path d="M40 150 L100 60 L160 150" stroke="url(#bowGradient)" strokeWidth="2" fill="none" opacity="0.5" />
            <defs>
                <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
            </defs>
            <line x1="100" y1="60" x2="100" y2="20" stroke="#e5e7eb" strokeWidth="3" />
            <polygon points="100,15 95,25 105,25" fill="#e5e7eb" />
            <path d="M95 60 L100 55 L105 60 L100 65 Z" fill="#f59e0b" />
            <line x1="40" y1="150" x2="100" y2="60" stroke="#d1d5db" strokeWidth="1" opacity="0.6" />
            <line x1="160" y1="150" x2="100" y2="60" stroke="#d1d5db" strokeWidth="1" opacity="0.6" />
            <path d="M85 170 L60 150 L40 150" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M115 170 L140 130 L100 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8" />
            <circle cx="100" cy="30" r="8" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.8" />
            <circle cx="100" cy="30" r="3" fill="#ef4444" opacity="0.8" />
        </svg>
    );
}

interface CrucibleUnifiedProps {
    initialQuestions: Question[];
    taxonomy?: TaxonomyNode[];
}

export default function CrucibleUnified({ initialQuestions, taxonomy = [] }: CrucibleUnifiedProps) {
    // View mode: 'home' | 'shloka' | 'playing' | 'completed'
    const [viewMode, setViewMode] = useState<'home' | 'shloka' | 'playing' | 'completed'>('home');
    const [gameMode, setGameMode] = useState<'practice' | 'exam'>('practice');
    
    // Tab state
    const [activeTab, setActiveTab] = useState<'chapters' | 'papers' | 'saved'>('chapters');
    
    // Selection states
    const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
    const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
    
    // Mobile dropdown states
    const [chaptersDropdownOpen, setChaptersDropdownOpen] = useState(false);
    const [papersDropdownOpen, setPapersDropdownOpen] = useState(false);
    const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
    
    // How to Use popup state
    const [showHowToUse, setShowHowToUse] = useState(() => {
        // Check if user has seen the tutorial before
        if (typeof window !== 'undefined') {
            const hasSeenTutorial = localStorage.getItem('crucible-tutorial-seen');
            return !hasSeenTutorial;
        }
        return true;
    });
    
    // Tutorial step state
    const [tutorialStep, setTutorialStep] = useState(0);
    
    // Current shloka index based on day
    const [currentShlokaIndex, setCurrentShlokaIndex] = useState(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        return dayOfYear % SHLOKAS.length;
    });
    
    // Tooltip state
    const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({ show: false, text: '', x: 0, y: 0 });
    
    // Container height synchronization
    const [containerHeight, setContainerHeight] = useState('auto');
    
    // Session config
    const [questionCount, setQuestionCount] = useState(20);
    const [difficulty, setDifficulty] = useState<'Mix' | 'Easy' | 'Medium' | 'Hard'>('Mix');
    const [curationMode, setCurationMode] = useState<'standard' | 'toppyq'>('standard');
    const [questionType, setQuestionType] = useState<'Mix' | 'MCQ' | 'Numerical' | 'Statement' | 'AR'>('Mix');
    
    // Gameplay state
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [streak, setStreak] = useState(0);
    const [examAnswers, setExamAnswers] = useState<Record<number, string>>({});
    const [questionStatus, setQuestionStatus] = useState<Record<number, 'solved' | 'incorrect' | 'skipped' | null>>({});
    const [expandedIds, setExpandedIds] = useState<number[]>([0]);
    const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});
    
    // Progress hook
    const { progress, recordAttempt, toggleStar, getChapterStats, overallAccuracy, initializeChapterTotals } = useCrucibleProgress();
    
    // Progress stats
    const progressStats = useMemo(() => {
        if (!progress) return { attempted: 0, correct: 0, incorrect: 0, streak: 0 };
        return {
            attempted: progress.totalAttempted || 0,
            correct: progress.totalCorrect || 0,
            incorrect: progress.totalIncorrect || 0,
            streak: progress.currentStreak || 0
        };
    }, [progress]);
    
    // Initialize chapter totals
    useEffect(() => {
        if (initialQuestions.length > 0) {
            initializeChapterTotals(initialQuestions);
        }
    }, [initialQuestions, initializeChapterTotals]);
    
    // Synchronize container heights
    useEffect(() => {
        const syncHeights = () => {
            const leftPanel = document.getElementById('left-panel');
            const rightPanel = document.getElementById('right-panel');
            
            if (leftPanel && rightPanel) {
                // Force a reflow by temporarily removing the min-height
                leftPanel.style.minHeight = '0px';
                rightPanel.style.minHeight = '0px';
                
                // Force layout recalculation
                void leftPanel.offsetHeight;
                void rightPanel.offsetHeight;
                
                // Wait for the next frame to get natural heights
                requestAnimationFrame(() => {
                    const leftHeight = leftPanel.scrollHeight;
                    const rightHeight = rightPanel.scrollHeight;
                    const maxHeight = Math.max(leftHeight, rightHeight);
                    
                    // Ensure minimum height of 600px and add padding
                    const finalHeight = Math.max(maxHeight + 20, 600);
                    
                    // Set both to the same height
                    leftPanel.style.minHeight = `${finalHeight}px`;
                    rightPanel.style.minHeight = `${finalHeight}px`;
                    setContainerHeight(`${finalHeight}px`);
                });
            }
        };
        
        // Initial sync after component mounts
        const initialTimeout = setTimeout(syncHeights, 200);
        
        // Additional sync after content is fully loaded
        const contentTimeout = setTimeout(syncHeights, 500);
        
        // Sync on window resize and content changes
        const handleResize = () => {
            clearTimeout(initialTimeout);
            clearTimeout(contentTimeout);
            setTimeout(syncHeights, 150);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Also sync when dropdowns change
        const observer = new MutationObserver(() => {
            clearTimeout(initialTimeout);
            clearTimeout(contentTimeout);
            setTimeout(syncHeights, 200);
        });
        
        const leftPanel = document.getElementById('left-panel');
        const rightPanel = document.getElementById('right-panel');
        
        if (leftPanel) observer.observe(leftPanel, { childList: true, subtree: true, attributes: true });
        if (rightPanel) observer.observe(rightPanel, { childList: true, subtree: true, attributes: true });
        
        // Additional sync when tabs change
        const tabChangeTimeout = setTimeout(syncHeights, 300);
        
        return () => {
            clearTimeout(initialTimeout);
            clearTimeout(contentTimeout);
            clearTimeout(tabChangeTimeout);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [activeTab, selectedChapters, selectedPapers, progressStats, chaptersDropdownOpen, papersDropdownOpen, mobileConfigOpen, initialQuestions.length]);
    
    // Close tutorial function
    const closeTutorial = () => {
        setShowHowToUse(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem('crucible-tutorial-seen', 'true');
        }
    };
    
    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (viewMode === 'playing' && timerActive && gameMode === 'exam') {
            interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [viewMode, timerActive, gameMode]);
    
    // Get all chapters from CHAPTERS config with accurate question counts
    const allChapters = useMemo(() => {
        return CHAPTERS.map(ch => {
            // Count questions for this chapter from initialQuestions (including legacy IDs)
            const chapterQuestionCount = initialQuestions.filter(q => {
                const standardChapterId = getStandardChapterId(q.chapterId || '');
                return standardChapterId === ch.id;
            }).length;
            
            return {
                id: ch.id,
                name: ch.name,
                class: ch.class,
                branch: ch.branch,
                order: ch.order,
                color: CHAPTER_CONFIG[ch.id]?.color || 'text-gray-400',
                bg: CHAPTER_CONFIG[ch.id]?.bg || 'bg-gray-500/10',
                gradient: CHAPTER_CONFIG[ch.id]?.gradient || 'from-gray-500/20 to-slate-500/20',
                icon: CHAPTER_CONFIG[ch.id]?.icon || '📚',
                questionCount: chapterQuestionCount
            };
        }).sort((a, b) => a.order - b.order); // Sort by NCERT order
    }, [initialQuestions]);
    
    const class11Chapters = allChapters.filter(ch => ch.class === 11);
    const class12Chapters = allChapters.filter(ch => ch.class === 12);
    
    // Get PYQ papers with question counts
    const papers = useMemo(() => {
        const sources = Array.from(new Set(
            initialQuestions
                .map(q => q.examSource)
                .filter((s): s is string => !!s && s.includes('202'))
        )).sort().reverse();
        
        const grouped: Record<string, { name: string; count: number }[]> = {
            '2026': [], '2025': [], '2024': [], 'Older': []
        };
        
        sources.forEach(source => {
            const count = initialQuestions.filter(q => q.examSource === source).length;
            const paperInfo = { name: source, count };
            
            if (source.includes('2026')) grouped['2026'].push(paperInfo);
            else if (source.includes('2025')) grouped['2025'].push(paperInfo);
            else if (source.includes('2024')) grouped['2024'].push(paperInfo);
            else grouped['Older'].push(paperInfo);
        });
        
        return grouped;
    }, [initialQuestions]);
    
    // Get saved questions
    const savedQuestions = useMemo(() => {
        if (!progress.starredIds) return [];
        return initialQuestions.filter(q => progress.starredIds?.includes(q.id));
    }, [initialQuestions, progress.starredIds]);
    
    // Selection counts
    const selectionCount = activeTab === 'chapters' ? selectedChapters.length : 
                          activeTab === 'papers' ? selectedPapers.length : 
                          savedQuestions.length;
    
    const totalSelectedQuestions = useMemo(() => {
        if (activeTab === 'chapters') {
            if (selectedChapters.length === 0) {
                return initialQuestions.length;
            }
            return initialQuestions.filter(q => {
                const standardChapterId = getStandardChapterId(q.chapterId || '');
                return selectedChapters.includes(standardChapterId);
            }).length;
        } else if (activeTab === 'papers') {
            if (selectedPapers.length === 0) return 0;
            return initialQuestions.filter(q => selectedPapers.includes(q.examSource || '')).length;
        } else {
            return savedQuestions.length;
        }
    }, [activeTab, selectedChapters, selectedPapers, savedQuestions, initialQuestions]);
    
    // Toggle functions
    const toggleChapter = (chapterId: string) => {
        setSelectedChapters(prev => 
            prev.includes(chapterId) 
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };
    
    const togglePaper = (paper: string) => {
        setSelectedPapers(prev => 
            prev.includes(paper) 
                ? prev.filter(p => p !== paper)
                : [...prev, paper]
        );
    };
    
    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Start session
    const startSession = () => {
        let filtered = [...initialQuestions];
        
        // Filter by scope
        if (activeTab === 'chapters' && selectedChapters.length > 0) {
            filtered = filtered.filter(q => {
                const standardChapterId = getStandardChapterId(q.chapterId || '');
                return selectedChapters.includes(standardChapterId);
            });
        } else if (activeTab === 'papers' && selectedPapers.length > 0) {
            filtered = filtered.filter(q => selectedPapers.includes(q.examSource || ''));
        } else if (activeTab === 'saved') {
            filtered = savedQuestions;
        }
        
        // Filter by difficulty
        if (difficulty !== 'Mix') {
            filtered = filtered.filter(q => q.difficulty === difficulty);
        }
        
        // Filter by type
        if (questionType !== 'Mix') {
            filtered = filtered.filter(q => {
                const qType = (q as any).type || 'SCQ';
                return qType === questionType;
            });
        }
        
        // Filter by curation mode (Top PYQ)
        if (curationMode === 'toppyq') {
            filtered = filtered.filter(q => q.isTopPYQ);
        }
        
        // Shuffle and limit
        filtered = shuffleArray(filtered);
        const limited = filtered.slice(0, questionCount);
        
        if (limited.length === 0) {
            alert("No questions match your selection.");
            return;
        }
        
        setFilteredQuestions(limited);
        setViewMode('shloka');
        
        setTimeout(() => {
            setViewMode('playing');
            setCurrentIndex(0);
            setQuestionStatus({});
            setTimerSeconds(0);
            setTimerActive(gameMode === 'exam');
            resetState();
        }, 3000);
    };
    
    const resetState = () => {
        setSelectedOptionId(null);
        setIsCorrect(null);
        setShowSolution(false);
        setExamAnswers({});
        setExpandedIds([0]);
        setShowSolutions({});
    };
    
    const handleAnswerSubmit = (correct: boolean, optionId: string) => {
        setIsCorrect(correct);
        setSelectedOptionId(optionId);
        setShowSolution(true);
        
        const currentQ = filteredQuestions[currentIndex];
        if (currentQ) {
            const difficulty = currentQ.difficulty || 'Medium';
            recordAttempt(currentQ.id, currentQ.chapterId || '', difficulty, correct);
            setQuestionStatus(prev => ({ ...prev, [currentIndex]: correct ? 'solved' : 'incorrect' }));
            
            if (correct) {
                setStreak(prev => prev + 1);
            } else {
                setStreak(0);
            }
            
            if (gameMode === 'exam') {
                setExamAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
            }
        }
    };
    
    const handleNext = () => {
        if (currentIndex < filteredQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetState();
            if (gameMode === 'practice') {
                setExpandedIds(prev => [...prev, currentIndex + 1]);
            }
        } else {
            setViewMode('completed');
        }
    };
    
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetState();
        }
    };
    
    const resetSession = () => {
        setViewMode('home');
        setFilteredQuestions([]);
        setCurrentIndex(0);
        resetState();
        setTimerSeconds(0);
        setTimerActive(false);
    };
    
    // Shloka transition screen
    if (viewMode === 'shloka') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] z-50 flex items-center justify-center animate-in fade-in duration-500">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-orange-500/10 blur-[80px] rounded-full" />
                
                <div className="text-center space-y-8 relative z-10 px-6">
                    <div className="text-amber-500/20 text-6xl font-serif animate-pulse">ॐ</div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 tracking-wide leading-relaxed" style={{ fontFamily: 'serif' }}>
                        उद्यमेन हि सिध्यन्ति<br />कार्याणि न मनोरथैः
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    </div>
                    <p className="text-amber-200/60 text-sm md:text-base tracking-[0.2em] font-medium max-w-md mx-auto">
                        Tasks are accomplished through effort, not by mere wishes.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        );
    }
    
    // Completed screen
    if (viewMode === 'completed') {
        let solvedCount = 0, incorrectCount = 0, skippedCount = 0;
        filteredQuestions.forEach((q, idx) => {
            const status = questionStatus[idx];
            if (status === 'solved') solvedCount++;
            else if (status === 'incorrect') incorrectCount++;
            else skippedCount++;
        });
        
        const accuracy = (solvedCount + incorrectCount) > 0 
            ? Math.round((solvedCount / (solvedCount + incorrectCount)) * 100) 
            : 0;
        
        return (
            <div className="min-h-screen bg-[#0F172A] text-gray-100 flex items-center justify-center p-4">
                <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
                    
                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Trophy size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Session Complete</h2>
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
                        <button onClick={resetSession} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-xl hover:opacity-90 transition cursor-pointer">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Playing mode
    if (viewMode === 'playing') {
        const activeQuestion = filteredQuestions[currentIndex];
        if (!activeQuestion) return null;
        
        const soothingDark = "bg-[#0B1120]";
        const cardBg = "bg-[#151E32]";
        
        return (
            <div className={`min-h-screen ${soothingDark} text-slate-200 flex flex-col font-sans`}>
                {/* Header */}
                <header className="h-16 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
                    <div className="flex items-center gap-6">
                        <button onClick={resetSession} className="text-slate-400 hover:text-white transition flex items-center gap-2 group">
                            <div className="p-2 rounded-lg group-hover:bg-white/5 transition">
                                <ArrowLeft size={20} />
                            </div>
                            <span className="text-sm font-semibold uppercase tracking-wide hidden sm:block">Exit</span>
                        </button>
                        <div className="h-5 w-px bg-white/10 hidden sm:block" />
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold text-slate-100 leading-none">
                                {gameMode === 'exam' ? 'Exam Session' : 'Practice Session'}
                            </h1>
                            <span className="text-[11px] font-medium text-slate-500 mt-1">
                                Question {currentIndex + 1} of {filteredQuestions.length}
                                {gameMode === 'exam' && ` • ${formatTime(timerSeconds)}`}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {gameMode === 'exam' && (
                            <div className="hidden sm:flex items-center gap-2 bg-indigo-900/20 px-4 py-1.5 rounded-full border border-indigo-500/10">
                                <Clock size={16} className="text-indigo-400" />
                                <span className="text-sm font-bold text-indigo-200">{formatTime(timerSeconds)}</span>
                            </div>
                        )}
                        <div className="hidden sm:flex items-center gap-2 bg-orange-900/20 px-4 py-1.5 rounded-full border border-orange-500/10">
                            <Flame size={16} className="text-orange-400/80 fill-orange-500/10" />
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-orange-200">{streak}</span>
                                <span className="text-[10px] text-orange-400/60 uppercase tracking-widest font-semibold">Streak</span>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Main content */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Question List */}
                    <div className="w-full lg:w-[60%] h-full overflow-y-auto p-2 md:p-6 pb-32 border-r border-white/5">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {filteredQuestions.map((question, idx) => {
                                const isActive = idx === currentIndex;
                                const status = questionStatus[idx];
                                const isExpanded = expandedIds.includes(idx);
                                
                                let borderClass = "border-transparent";
                                if (isActive) borderClass = "border-indigo-500 ring-1 ring-indigo-500/20 bg-[#1E293B]";
                                else borderClass = "border-transparent hover:border-slate-700";
                                
                                let statusIcon = <span className="text-slate-500 font-bold text-sm">Q{idx + 1}</span>;
                                if (status === 'solved') statusIcon = <CheckCircle2 size={18} className="text-emerald-400" />;
                                else if (status === 'incorrect') statusIcon = <X size={18} className="text-red-400" />;
                                
                                return (
                                    <div
                                        key={question.id}
                                        onClick={() => {
                                            setCurrentIndex(idx);
                                            resetState();
                                            if (window.innerWidth < 1024) {
                                                setExpandedIds(prev => 
                                                    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                                                );
                                            }
                                        }}
                                        className={`rounded-lg md:rounded-xl border p-3 md:p-5 cursor-pointer transition-all duration-200 ${cardBg} ${borderClass} shadow-sm`}
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
                                                </div>
                                                <div className="text-sm text-slate-300 font-medium line-clamp-3 prose prose-invert prose-sm leading-relaxed opacity-90">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkMath, remarkGfm]}
                                                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                                                        components={{
                                                            p: ({ children }) => <span className="inline">{children} </span>,
                                                        }}
                                                    >
                                                        {question.textMarkdown?.split('\n').slice(0, 3).join('\n') || ''}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            <div className="lg:hidden shrink-0 text-slate-600">
                                                <ChevronDown size={20} className={isExpanded ? 'rotate-180' : ''} />
                                            </div>
                                        </div>
                                        
                                        {/* Mobile expansion */}
                                        {isExpanded && window.innerWidth < 1024 && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <QuestionCard
                                                    question={question}
                                                    onAnswerSubmit={handleAnswerSubmit}
                                                    showFeedback={!!selectedOptionId && idx === currentIndex}
                                                    selectedOptionId={idx === currentIndex ? selectedOptionId : null}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Detail Panel */}
                    <div className="hidden lg:flex w-[40%] h-full bg-[#0F172A] flex-col border-l border-white/5 relative z-10 shadow-2xl">
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#0B1120]">
                            <div className="bg-[#151E32] rounded-xl border border-white/5 p-6 mb-6 shadow-lg">
                                <QuestionCard
                                    question={activeQuestion}
                                    onAnswerSubmit={handleAnswerSubmit}
                                    showFeedback={!!selectedOptionId}
                                    selectedOptionId={selectedOptionId}
                                />
                            </div>
                            
                            {showSolution && activeQuestion.solution && (
                                <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                    <SolutionViewer solution={activeQuestion.solution} />
                                </div>
                            )}
                        </div>
                        
                        {/* Navigation */}
                        <div className="p-4 border-t border-white/5 bg-[#0F172A]">
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 rounded-xl font-semibold text-sm transition"
                                >
                                    {currentIndex < filteredQuestions.length - 1 ? 'Next' : 'Finish'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0F172A] border-t border-white/5 z-50">
                        <div className="flex gap-3">
                            <button onClick={handlePrevious} disabled={currentIndex === 0} className="flex-1 py-3 bg-white/5 rounded-xl font-semibold disabled:opacity-30 cursor-pointer">Previous</button>
                            <button onClick={handleNext} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold cursor-pointer">{currentIndex < filteredQuestions.length - 1 ? 'Next' : 'Finish'}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Home view - Redesigned world-class UI
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-100 relative overflow-hidden">
            {/* Molecular Particle Background */}
            <MolecularParticles />
            
            {/* Top Navigation Bar - with Back to Home */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Back to Home + Logo */}
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/" 
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group cursor-pointer"
                            >
                                <ChevronLeft size={18} className="text-gray-400 group-hover:text-white transition" />
                                <Home size={16} className="text-gray-400 group-hover:text-white transition" />
                                <span className="text-sm font-medium text-gray-400 group-hover:text-white hidden sm:block">Home</span>
                            </Link>
                            
                            <div className="h-6 w-px bg-white/10" />
                            
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <Flame size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-black tracking-tight">
                                        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                                            CRUCIBLE
                                        </span>
                                    </h1>
                                    <span className="text-[9px] font-bold tracking-[0.2em] text-orange-400/80 uppercase">
                                        Forge Your Rank
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Desktop Tabs */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => setActiveTab('chapters')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'chapters' 
                                        ? 'bg-white/10 text-white' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <BookOpen size={16} />
                                Chapters
                            </button>
                            <button
                                onClick={() => setActiveTab('papers')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'papers' 
                                        ? 'bg-white/10 text-white' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <FileText size={16} />
                                Papers
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'saved' 
                                        ? 'bg-white/10 text-white' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Bookmark size={16} />
                                Saved
                                {savedQuestions.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">
                                        {savedQuestions.length}
                                    </span>
                                )}
                            </button>
                        </div>
                        
                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-semibold text-emerald-400">Online</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Tabs */}
                    <div className="md:hidden flex gap-1 pb-3">
                        <button
                            onClick={() => setActiveTab('chapters')}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'chapters' 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-gray-400'
                            }`}
                        >
                            Chapters
                        </button>
                        <button
                            onClick={() => setActiveTab('papers')}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'papers' 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-gray-400'
                            }`}
                        >
                            Papers
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'saved' 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-gray-400'
                            }`}
                        >
                            Saved {savedQuestions.length > 0 && `(${savedQuestions.length})`}
                        </button>
                    </div>
                </div>
            </motion.header>
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-10">
                {/* Compact Progress Stats - Mobile Optimized */}
                {progressStats.attempted > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 relative overflow-hidden"
                    >
                        {/* Dynamic Background Animation */}
                        <div className="absolute inset-0">
                            <motion.div
                                className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
                                animate={{
                                    x: [0, 100, 0],
                                    y: [0, -50, 0],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl"
                                animate={{
                                    x: [0, -80, 0],
                                    y: [0, 30, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute bottom-0 left-1/2 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-3xl"
                                animate={{
                                    x: [-50, 50, -50],
                                    y: [0, -30, 0],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                        
                        {/* Desktop: Full Stats */}
                        <div className="hidden md:block bg-gradient-to-br from-[#151922] to-[#1a1f2e] rounded-2xl border border-white/5 p-5 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                                        <TrendingUp size={24} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Your Progress</h2>
                                        <p className="text-sm text-gray-500">
                                            {progressStats.streak} day streak · Keep pushing!
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 bg-indigo-500/10 rounded-xl px-4 py-2 border border-indigo-500/20">
                                        <Target size={18} className="text-indigo-400" />
                                        <div>
                                            <div className="text-xl font-bold text-white">
                                                <AnimatedCounter value={progressStats.attempted} />
                                            </div>
                                            <div className="text-[10px] text-indigo-400/70 uppercase font-semibold">Attempted</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-emerald-500/10 rounded-xl px-4 py-2 border border-emerald-500/20">
                                        <CheckCircle2 size={18} className="text-emerald-400" />
                                        <div>
                                            <div className="text-xl font-bold text-white">
                                                <AnimatedCounter value={progressStats.correct} />
                                            </div>
                                            <div className="text-[10px] text-emerald-400/70 uppercase font-semibold">{overallAccuracy}% Acc</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-rose-500/10 rounded-xl px-4 py-2 border border-rose-500/20">
                                        <X size={18} className="text-rose-400" />
                                        <div>
                                            <div className="text-xl font-bold text-white">
                                                <AnimatedCounter value={progressStats.incorrect} />
                                            </div>
                                            <div className="text-[10px] text-rose-400/70 uppercase font-semibold">Incorrect</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                        <Flame size={20} className="text-orange-400" />
                                        <span className="font-bold text-orange-400">
                                            <AnimatedCounter value={progressStats.streak} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile: Compact Stats */}
                        <div className="md:hidden bg-gradient-to-br from-[#151922] to-[#1a1f2e] rounded-xl border border-white/5 p-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                                        <TrendingUp size={18} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{progressStats.attempted} Attempted</div>
                                        <div className="text-xs text-gray-500">{overallAccuracy}% accuracy · {progressStats.streak}🔥 streak</div>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        <div className="text-sm font-bold text-emerald-400">{progressStats.correct}</div>
                                    </div>
                                    <div className="px-2 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
                                        <div className="text-sm font-bold text-rose-400">{progressStats.incorrect}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Panel - Chapters Selection */}
                    <div id="chapters-section" className="lg:col-span-8">
                        
                        {/* Chapters Tab - with Mobile Dropdown */}
                        {activeTab === 'chapters' && (
                            <div className="bg-[#151922] rounded-2xl border border-white/5 overflow-hidden">
                                {/* Mobile Dropdown Header */}
                                <button
                                    onClick={() => setChaptersDropdownOpen(!chaptersDropdownOpen)}
                                    className="w-full md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <BookOpen size={20} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h2 className="font-bold text-white">Select Chapters</h2>
                                            <p className="text-xs text-gray-500">{selectedChapters.length} selected · {totalSelectedQuestions} questions</p>
                                        </div>
                                    </div>
                                    <ChevronDown size={24} className={`text-gray-400 transition-transform ${chaptersDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Desktop Header */}
                                <div className="hidden md:flex items-center justify-between p-5 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                            <BookOpen size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Select Chapters</h2>
                                            <p className="text-xs text-gray-500">Choose topics to practice</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-white">{selectedChapters.length}</span>
                                        <span className="text-gray-500 text-sm"> selected</span>
                                        <p className="text-xs text-gray-500">{totalSelectedQuestions} questions available</p>
                                    </div>
                                </div>
                                
                                {/* Chapters Content - Collapsible on Mobile */}
                                <div className={`${chaptersDropdownOpen ? 'block' : 'hidden'} md:block p-4 md:p-5`}>
                                    {/* Branch Filter */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {['physical', 'inorganic', 'organic'].map((branch) => (
                                            <button
                                                key={branch}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition capitalize"
                                            >
                                                {branch}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Class 11 & 12 Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Class 11 */}
                                        <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                                            <StaggerItem>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                        <span className="font-bold text-sm text-white">Class 11</span>
                                                        <span className="text-xs text-gray-500">({class11Chapters.length} chapters)</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {class11Chapters.reduce((sum, c) => sum + c.questionCount, 0)} Qs
                                                    </span>
                                                </div>
                                            </StaggerItem>
                                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-visible">
                                                {class11Chapters.map(chapter => {
                                                    const isSelected = selectedChapters.includes(chapter.id);
                                                    const stats = getChapterStats(chapter.id);
                                                    const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
                                                    
                                                    return (
                                                        <StaggerItem key={chapter.id}>
                                                            <motion.button
                                                                onClick={() => toggleChapter(chapter.id)}
                                                                whileHover={{ scale: 1.01, y: -2 }}
                                                                whileTap={{ scale: 0.99 }}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                                    isSelected 
                                                                        ? `bg-gradient-to-r ${chapter.gradient} border-indigo-500/40 shadow-lg shadow-indigo-500/10` 
                                                                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-lg hover:shadow-black/20'
                                                                }`}
                                                            >
                                                                <div className={`w-10 h-10 rounded-lg ${chapter.bg} flex items-center justify-center shrink-0 text-lg`}>
                                                                    {chapter.icon}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-sm text-gray-200 truncate">{chapter.name}</div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-300' : 'text-gray-500'}`}>
                                                                            {chapter.questionCount} {chapter.questionCount === 1 ? 'question' : 'questions'}
                                                                        </span>
                                                                        {stats.attempted > 0 && (
                                                                            <>
                                                                                <span className="text-gray-600">·</span>
                                                                                <span className={`text-xs ${accuracy >= 70 ? 'text-emerald-400' : accuracy >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                                                    {accuracy}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                                    isSelected 
                                                                        ? 'bg-indigo-500 border-indigo-500' 
                                                                        : 'border-gray-600'
                                                                }`}>
                                                                    {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                                                </div>
                                                            </motion.button>
                                                        </StaggerItem>
                                                    );
                                                })}
                                            </div>
                                        </StaggerContainer>
                                        
                                        {/* Class 12 */}
                                        <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                                            <StaggerItem>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                        <span className="font-bold text-sm text-white">Class 12</span>
                                                        <span className="text-xs text-gray-500">({class12Chapters.length} chapters)</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {class12Chapters.reduce((sum, c) => sum + c.questionCount, 0)} Qs
                                                    </span>
                                                </div>
                                            </StaggerItem>
                                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-visible">
                                                {class12Chapters.map(chapter => {
                                                    const isSelected = selectedChapters.includes(chapter.id);
                                                    const stats = getChapterStats(chapter.id);
                                                    const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
                                                    
                                                    return (
                                                        <StaggerItem key={chapter.id}>
                                                            <motion.button
                                                                onClick={() => toggleChapter(chapter.id)}
                                                                whileHover={{ scale: 1.01, y: -2 }}
                                                                whileTap={{ scale: 0.99 }}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                                    isSelected 
                                                                        ? `bg-gradient-to-r ${chapter.gradient} border-purple-500/40 shadow-lg shadow-purple-500/10` 
                                                                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-lg hover:shadow-black/20'
                                                                }`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-lg ${chapter.bg} flex items-center justify-center shrink-0 text-lg`}>
                                                                {chapter.icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm text-gray-200 truncate">{chapter.name}</div>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className={`text-xs font-semibold ${isSelected ? 'text-purple-300' : 'text-gray-500'}`}>
                                                                        {chapter.questionCount} {chapter.questionCount === 1 ? 'question' : 'questions'}
                                                                    </span>
                                                                    {stats.attempted > 0 && (
                                                                        <>
                                                                            <span className="text-gray-600">·</span>
                                                                            <span className={`text-xs ${accuracy >= 70 ? 'text-emerald-400' : accuracy >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                                                {accuracy}%
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                                isSelected 
                                                                    ? 'bg-purple-500 border-purple-500' 
                                                                    : 'border-gray-600'
                                                            }`}>
                                                                {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                                            </div>
                                                        </motion.button>
                                                    </StaggerItem>
                                                );
                                            })}
                                        </div>
                                    </StaggerContainer>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Papers Tab - with Mobile Dropdown */}
                        {activeTab === 'papers' && (
                            <div className="bg-[#151922] rounded-2xl border border-white/5 overflow-hidden">
                                {/* Mobile Dropdown Header */}
                                <button
                                    onClick={() => setPapersDropdownOpen(!papersDropdownOpen)}
                                    className="w-full md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                            <FileText size={20} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h2 className="font-bold text-white">Previous Papers</h2>
                                            <p className="text-xs text-gray-500">{selectedPapers.length} selected · {totalSelectedQuestions} questions</p>
                                        </div>
                                    </div>
                                    <ChevronDown size={24} className={`text-gray-400 transition-transform ${papersDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Desktop Header */}
                                <div className="hidden md:flex items-center gap-3 p-5 border-b border-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <FileText size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Previous Papers</h2>
                                        <p className="text-xs text-gray-500">Select JEE Main & Advanced papers</p>
                                    </div>
                                </div>
                                
                                {/* Papers Content */}
                                <div className={`${papersDropdownOpen ? 'block' : 'hidden'} md:block p-4 md:p-5 max-h-[500px] overflow-y-auto custom-scrollbar`}>
                                    <div className="space-y-4">
                                        {Object.entries(papers).map(([year, yearPapers]) => yearPapers.length > 0 && (
                                            <div key={year}>
                                                <h3 className="font-bold text-sm text-gray-400 mb-2 flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {year === 'Older' ? 'Older Papers' : `JEE ${year}`}
                                                    <span className="text-xs text-gray-600">({yearPapers.length} papers)</span>
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {yearPapers.map(paper => {
                                                        const isSelected = selectedPapers.includes(paper.name);
                                                        
                                                        return (
                                                            <motion.button
                                                                key={paper.name}
                                                                onClick={() => togglePaper(paper.name)}
                                                                whileHover={{ scale: 1.01 }}
                                                                whileTap={{ scale: 0.99 }}
                                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                                    isSelected 
                                                                        ? 'bg-amber-500/10 border-amber-500/40' 
                                                                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                                                                }`}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                                    isSelected 
                                                                        ? 'bg-amber-500 border-amber-500' 
                                                                        : 'border-gray-600'
                                                                }`}>
                                                                    {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-sm text-gray-200 truncate">
                                                                        {paper.name.replace('JEE Main ', '').replace('JEE Advanced ', '')}
                                                                    </div>
                                                                    <span className={`text-xs ${isSelected ? 'text-amber-400' : 'text-gray-500'}`}>
                                                                        {paper.count} questions
                                                                    </span>
                                                                </div>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Saved Tab */}
                        {activeTab === 'saved' && (
                            <div className="bg-[#151922] rounded-2xl border border-white/5 p-5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                        <Bookmark size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Saved Questions</h2>
                                        <p className="text-xs text-gray-500">Your bookmarked questions for revision</p>
                                    </div>
                                </div>
                                
                                {savedQuestions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                            <Bookmark size={32} className="text-gray-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Saved Questions</h3>
                                        <p className="text-gray-600 text-sm max-w-xs mx-auto">Star questions during practice to save them here for quick revision</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {savedQuestions.map((q, idx) => (
                                            <div key={q.id} className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/10 transition">
                                                <span className="text-gray-600 font-bold w-6 text-center">{idx + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-300 line-clamp-2">{q.textMarkdown?.substring(0, 120)}...</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-500 uppercase">
                                                            {q.chapterId?.replace('chapter_', '').replace(/_/g, ' ')}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                                                            q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                            'bg-rose-500/20 text-rose-400'
                                                        }`}>
                                                            {q.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggleStar(q.id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition"
                                                >
                                                    <Bookmark size={18} className="text-rose-400 fill-rose-400" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Right Panel - Session Configuration */}
                    <div id="right-panel" className="lg:col-span-4">
                        <div className="bg-[#151922] rounded-2xl border border-white/5 overflow-hidden">
                            {/* Config Panel - Always Visible */}
                            <div className="p-5">
                                {/* Mobile Header */}
                                <div className="flex lg:hidden items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                        <Settings size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Session Config</h3>
                                        <p className="text-xs text-gray-500">Customize your practice</p>
                                    </div>
                                </div>
                                
                                {/* Desktop Header */}
                                <div className="hidden lg:flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                        <Settings size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Session Config</h3>
                                        <p className="text-xs text-gray-500">Customize your practice</p>
                                    </div>
                                </div>
                                
                                {/* Curation Mode */}
                                <div className="mb-5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Curation</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setCurationMode('standard')}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                curationMode === 'standard'
                                                    ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                                                    : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <Target size={18} className={`mx-auto mb-1 ${curationMode === 'standard' ? 'text-indigo-400' : 'text-gray-500'}`} />
                                            <div className="text-xs font-semibold">Standard</div>
                                            <div className="text-[10px] text-gray-500">Full mastery</div>
                                        </button>
                                        <button
                                            onClick={() => setCurationMode('toppyq')}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                curationMode === 'toppyq'
                                                    ? 'bg-amber-500/20 border-amber-500/40 text-white'
                                                    : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <Star size={18} className={`mx-auto mb-1 ${curationMode === 'toppyq' ? 'text-amber-400' : 'text-gray-500'}`} />
                                            <div className="text-xs font-semibold">Top PYQ</div>
                                            <div className="text-[10px] text-gray-500">High yield</div>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Difficulty */}
                                <div className="mb-5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Difficulty</label>
                                    <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
                                        {(['Mix', 'Easy', 'Med', 'Hard'] as const).map((diff) => (
                                            <button
                                                key={diff}
                                                onClick={() => setDifficulty(diff === 'Med' ? 'Medium' : diff)}
                                                className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                                                    (difficulty === diff || (difficulty === 'Medium' && diff === 'Med'))
                                                        ? diff === 'Mix' ? 'bg-amber-500 text-black' : 
                                                          diff === 'Easy' ? 'bg-emerald-500 text-black' :
                                                          diff === 'Med' ? 'bg-amber-500 text-black' :
                                                          'bg-rose-500 text-white'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {diff}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Question Type */}
                                <div className="mb-5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { id: 'Mix', label: 'Mix', icon: Zap },
                                            { id: 'MCQ', label: 'MCQ', icon: CheckCircle2 },
                                            { id: 'Numerical', label: 'Num', icon: BarChart3 },
                                            { id: 'AR', label: 'A/R', icon: Activity }
                                        ].map(({ id, label, icon: Icon }) => (
                                            <button
                                                key={id}
                                                onClick={() => setQuestionType(id as any)}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                                    questionType === id
                                                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                                                        : 'bg-white/[0.03] border border-white/5 text-gray-400 hover:bg-white/[0.06]'
                                                }`}
                                            >
                                                <Icon size={12} />
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Quantity */}
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</label>
                                        <span className="text-lg font-bold text-amber-400">{questionCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        step="5"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                                        <span>5</span>
                                        <span>100</span>
                                    </div>
                                </div>
                                
                                {/* Mode */}
                                <div className="mb-6">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Mode</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setGameMode('practice')}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                gameMode === 'practice'
                                                    ? 'bg-blue-500/20 border-blue-500/40 text-white'
                                                    : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <Zap size={18} className={`mx-auto mb-1 ${gameMode === 'practice' ? 'text-blue-400' : 'text-gray-500'}`} />
                                            <div className="text-xs font-semibold">Practice</div>
                                            <div className="text-[10px] text-gray-500">No timer</div>
                                        </button>
                                        <button
                                            onClick={() => setGameMode('exam')}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                gameMode === 'exam'
                                                    ? 'bg-rose-500/20 border-rose-500/40 text-white'
                                                    : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <Clock size={18} className={`mx-auto mb-1 ${gameMode === 'exam' ? 'text-rose-400' : 'text-gray-500'}`} />
                                            <div className="text-xs font-semibold">Exam</div>
                                            <div className="text-[10px] text-gray-500">Timed</div>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Begin Button */}
                                <div className="pt-4 border-t border-white/5">
                                <button
                                    onClick={() => {
                                        const needsSelection = (activeTab === 'chapters' && selectedChapters.length === 0) || (activeTab === 'papers' && selectedPapers.length === 0);
                                        if (needsSelection) {
                                            // Open the appropriate dropdown
                                            if (activeTab === 'chapters') {
                                                setChaptersDropdownOpen(true);
                                            } else if (activeTab === 'papers') {
                                                setPapersDropdownOpen(true);
                                            }
                                            // Scroll to top to show the selection area
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else {
                                            startSession();
                                        }
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Play size={20} fill="currentColor" />
                                    {(activeTab === 'chapters' && selectedChapters.length === 0) || (activeTab === 'papers' && selectedPapers.length === 0)
                                        ? 'Make Selection' 
                                        : `START ${gameMode.toUpperCase()}`}
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bhagvadgita Shloka Section - Below both panels - Desktop Only */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 mb-0 hidden md:block"
                >
                        <div className="bg-gradient-to-br from-[#1a1f2e] via-[#151922] to-[#1a1f2e] rounded-2xl border border-white/10 p-4 relative overflow-hidden">
                            {/* Background effects moved here */}
                            <div className="absolute inset-0 pointer-events-none">
                                <motion.div
                                    className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"
                                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.div
                                    className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl"
                                    animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
                                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                                {/* Arjuna Archer Illustration */}
                                <div className="flex-shrink-0">
                                    <motion.div
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <ArjunaArcher className="w-28 h-40 text-amber-400" />
                                    </motion.div>
                                </div>
                                
                                {/* Shloka Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <BookOpen size={16} className="text-amber-400" />
                                        <span className="text-amber-400 text-xs font-medium uppercase tracking-wider">Daily Wisdom</span>
                                    </div>
                                    
                                    {/* Sanskrit Shloka */}
                                    <h3 className="text-lg md:text-xl text-amber-100 font-serif mb-2 leading-relaxed">
                                        {SHLOKAS[currentShlokaIndex].sanskrit}
                                    </h3>
                                    
                                    {/* Message to Students */}
                                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-3 border-l-4 border-amber-500">
                                        <p className="text-gray-200 text-sm italic">
                                            💡 {SHLOKAS[currentShlokaIndex].message}
                                        </p>
                                    </div>
                                    
                                    {/* Navigation dots */}
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                                        {SHLOKAS.slice(0, 5).map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentShlokaIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === currentShlokaIndex ? 'bg-amber-400 w-4' : 'bg-gray-600 hover:bg-gray-500'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
            </main>
        </div>
    );
}
