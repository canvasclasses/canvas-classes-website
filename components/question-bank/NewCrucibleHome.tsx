'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Play, BookOpen, Target, Zap, Clock, 
    CheckCircle2, Brain, ChevronDown, ChevronUp,
    Settings, Filter, ArrowRight, Flame, BarChart3
} from 'lucide-react';
// Define Question type inline for compatibility
interface Question {
    id: string;
    textMarkdown: string;
    chapterId?: string;
    difficulty?: string;
    examSource?: string;
    isTopPYQ?: boolean;
    [key: string]: any;
}
import { useCrucibleProgress } from '@/hooks/useCrucibleProgress';
import StudentProgressDashboard from './StudentProgressDashboard';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';

interface NewCrucibleHomeProps {
    initialQuestions: Question[];
    onStart: (config: any) => void;
}

// Chapter icons mapping
const CHAPTER_ICONS: Record<string, string> = {
    'chapter_some_basic_concepts': '⚖️',
    'chapter_structure_of_atom': '⚛️',
    'chapter_states_of_matter': '💨',
    'chapter_thermodynamics': '🌡️',
    'chapter_equilibrium': '⚖️',
    'chapter_classification_of_elements': '📊',
    'chapter_chemical_bonding': '🔗',
    'chapter_hydrogen': '💧',
    'chapter_s_block': '🧱',
    'chapter_p_block_11': '🧪',
    'chapter_organic_chemistry_basic': '📝',
    'chapter_hydrocarbons': '⛽',
    'chapter_environmental_chemistry': '🌍',
    'chapter_solutions': '💧',
    'chapter_electrochemistry': '⚡',
    'chapter_chemical_kinetics': '⏱️',
    'chapter_surface_chemistry': '🌊',
    'chapter_general_principles_processes': '⚒️',
    'chapter_p_block_12': '🧪',
    'chapter_d_f_block': '🔮',
    'chapter_coordination_compounds': '🎯',
    'chapter_haloalkanes_haloarenes': '🔥',
    'chapter_alcohols_phenols_ethers': '🍷',
    'chapter_aldehydes_ketones': '⚗️',
    'chapter_amines': '💊',
    'chapter_biomolecules': '🧬',
    'chapter_polymers': '🧵',
    'chapter_chemistry_everyday_life': '💊',
    'chapter_salt_analysis': '🧂',
    'chapter_stereochemistry': '🔄',
    'chapter_aromatic_compounds': '�',
    'chapter_redox_reactions': '⚡',
    'chapter_ionic_equilibrium': '🧪',
};

// Chapter colors mapping
const CHAPTER_COLORS: Record<string, string> = {
    'chapter_some_basic_concepts': 'bg-blue-500',
    'chapter_structure_of_atom': 'bg-purple-500',
    'chapter_states_of_matter': 'bg-cyan-500',
    'chapter_thermodynamics': 'bg-orange-500',
    'chapter_equilibrium': 'bg-green-500',
    'chapter_classification_of_elements': 'bg-pink-500',
    'chapter_chemical_bonding': 'bg-indigo-500',
    'chapter_hydrogen': 'bg-red-400',
    'chapter_s_block': 'bg-yellow-500',
    'chapter_p_block_11': 'bg-teal-500',
    'chapter_organic_chemistry_basic': 'bg-emerald-500',
    'chapter_hydrocarbons': 'bg-amber-500',
    'chapter_environmental_chemistry': 'bg-green-600',
    'chapter_solutions': 'bg-sky-500',
    'chapter_electrochemistry': 'bg-violet-500',
    'chapter_chemical_kinetics': 'bg-rose-500',
    'chapter_surface_chemistry': 'bg-cyan-600',
    'chapter_general_principles_processes': 'bg-gray-500',
    'chapter_p_block_12': 'bg-lime-500',
    'chapter_d_f_block': 'bg-fuchsia-500',
    'chapter_coordination_compounds': 'bg-cyan-600',
    'chapter_haloalkanes_haloarenes': 'bg-orange-600',
    'chapter_alcohols_phenols_ethers': 'bg-pink-600',
    'chapter_aldehydes_ketones': 'bg-purple-600',
    'chapter_amines': 'bg-blue-600',
    'chapter_biomolecules': 'bg-green-600',
    'chapter_polymers': 'bg-yellow-600',
    'chapter_chemistry_everyday_life': 'bg-teal-600',
    'chapter_salt_analysis': 'bg-orange-400',
    'chapter_stereochemistry': 'bg-purple-400',
    'chapter_aromatic_compounds': 'bg-pink-400',
    'chapter_redox_reactions': 'bg-red-500',
    'chapter_ionic_equilibrium': 'bg-blue-400',
};

export default function NewCrucibleHome({ initialQuestions, onStart }: NewCrucibleHomeProps) {
    // Progress hook for student stats
    const { progress, overallAccuracy, getChapterStats } = useCrucibleProgress();
    
    // State for chapter selection
    const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
    const [class11Expanded, setClass11Expanded] = useState(true);
    const [class12Expanded, setClass12Expanded] = useState(true);
    
    // State for session configuration
    const [questionCount, setQuestionCount] = useState(20);
    const [difficulty, setDifficulty] = useState<'Mix' | 'Easy' | 'Medium' | 'Hard'>('Mix');
    const [mode, setMode] = useState<'practice' | 'exam'>('practice');
    const [questionType, setQuestionType] = useState<'Mix' | 'SCQ' | 'MCQ' | 'NVT'>('Mix');
    
    // Get available chapters from TAXONOMY_FROM_CSV — single source of truth
    const allChapters = useMemo(() => {
        return TAXONOMY_FROM_CSV
            .filter(node => node.type === 'chapter')
            .sort((a, b) => (a.sequence_order ?? 99) - (b.sequence_order ?? 99))
            .map(ch => ({
                id: ch.id,
                name: ch.name,
                class: ch.class_level ?? 11,
                color: CHAPTER_COLORS[ch.id] || 'bg-gray-500',
                icon: CHAPTER_ICONS[ch.id] || '📚',
                questionCount: initialQuestions.filter(q => q.chapterId === ch.id).length
            }));
    }, [initialQuestions]);
    
    const class11Chapters = allChapters.filter(ch => ch.class === 11);
    const class12Chapters = allChapters.filter(ch => ch.class === 12);
    
    // Calculate total questions for selection
    const totalQuestionsForSelection = useMemo(() => {
        if (selectedChapters.length === 0) {
            return initialQuestions.length;
        }
        return initialQuestions.filter(q => selectedChapters.includes(q.chapterId || '')).length;
    }, [selectedChapters, initialQuestions]);
    
    const toggleChapter = (chapterId: string) => {
        setSelectedChapters(prev => 
            prev.includes(chapterId) 
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };
    
    const handleStart = () => {
        onStart({
            chapters: selectedChapters.length > 0 ? selectedChapters : 'all',
            questionCount,
            difficulty,
            mode,
            questionType
        });
    };
    
    // Render chapter list section
    const renderChapterList = () => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-400" />
                    Select Chapters
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    {selectedChapters.length > 0 
                        ? `${selectedChapters.length} chapters selected • ${totalQuestionsForSelection} questions available`
                        : 'All chapters selected • Click to customize'}
                </p>
            </div>
            
            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {/* Class 11 */}
                <div>
                    <button 
                        onClick={() => setClass11Expanded(!class11Expanded)}
                        className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <span className="font-semibold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">11</span>
                            Class 11
                        </span>
                        <div className="flex items-center gap-2">
                            {class11Expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                        </div>
                    </button>
                    
                    {class11Expanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
                        >
                            {class11Chapters.map(chapter => {
                                const isSelected = selectedChapters.includes(chapter.id);
                                const stats = getChapterStats(chapter.id);
                                const attemptedPercent = chapter.questionCount > 0 
                                    ? Math.round((stats.attempted / chapter.questionCount) * 100) 
                                    : 0;
                                
                                return (
                                    <button
                                        key={chapter.id}
                                        onClick={() => toggleChapter(chapter.id)}
                                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                                            isSelected 
                                                ? 'border-indigo-500 bg-indigo-500/10' 
                                                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className={`w-8 h-8 rounded-lg ${chapter.color} bg-opacity-20 flex items-center justify-center text-lg`}>
                                                {chapter.icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white text-sm truncate">{chapter.name}</h3>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                    <span>{chapter.questionCount} Qs</span>
                                                    {stats.attempted > 0 && (
                                                        <span className={stats.accuracy > 70 ? 'text-green-400' : stats.accuracy > 40 ? 'text-yellow-400' : 'text-red-400'}>
                                                            {stats.accuracy}% acc
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Progress bar */}
                                                {stats.attempted > 0 && (
                                                    <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${
                                                                stats.accuracy > 70 ? 'bg-green-500' : stats.accuracy > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${attemptedPercent}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <CheckCircle2 size={18} className="text-indigo-400 shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
                
                {/* Class 12 */}
                <div>
                    <button 
                        onClick={() => setClass12Expanded(!class12Expanded)}
                        className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <span className="font-semibold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">12</span>
                            Class 12
                        </span>
                        <div className="flex items-center gap-2">
                            {class12Expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                        </div>
                    </button>
                    
                    {class12Expanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
                        >
                            {class12Chapters.map(chapter => {
                                const isSelected = selectedChapters.includes(chapter.id);
                                const stats = getChapterStats(chapter.id);
                                
                                return (
                                    <button
                                        key={chapter.id}
                                        onClick={() => toggleChapter(chapter.id)}
                                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                                            isSelected 
                                                ? 'border-purple-500 bg-purple-500/10' 
                                                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className={`w-8 h-8 rounded-lg ${chapter.color} bg-opacity-20 flex items-center justify-center text-lg`}>
                                                {chapter.icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white text-sm truncate">{chapter.name}</h3>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                    <span>{chapter.questionCount} Qs</span>
                                                    {stats.attempted > 0 && (
                                                        <span className={stats.accuracy > 70 ? 'text-green-400' : stats.accuracy > 40 ? 'text-yellow-400' : 'text-red-400'}>
                                                            {stats.accuracy}% acc
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <CheckCircle2 size={18} className="text-purple-400 shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
    
    // Render session configuration
    const renderSessionConfig = () => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings size={20} className="text-amber-400" />
                    Session Configuration
                </h2>
            </div>
            
            <div className="p-4 space-y-5">
                {/* Mode Selection */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                        <Target size={16} className="text-indigo-400" />
                        Practice Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setMode('practice')}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                                mode === 'practice'
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                            }`}
                        >
                            <Brain size={18} className={mode === 'practice' ? 'text-green-400' : 'text-gray-400'} />
                            <div className="text-left">
                                <div className="font-medium text-white text-sm">Practice</div>
                                <div className="text-xs text-gray-400">Learn at your pace</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setMode('exam')}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                                mode === 'exam'
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                            }`}
                        >
                            <Clock size={18} className={mode === 'exam' ? 'text-amber-400' : 'text-gray-400'} />
                            <div className="text-left">
                                <div className="font-medium text-white text-sm">Exam</div>
                                <div className="text-xs text-gray-400">Timed simulation</div>
                            </div>
                        </button>
                    </div>
                </div>
                
                {/* Question Count */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                        <BarChart3 size={16} className="text-blue-400" />
                        Question Count: <span className="text-white font-bold">{questionCount}</span>
                    </label>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5</span>
                        <span>50</span>
                        <span>100</span>
                    </div>
                </div>
                
                {/* Difficulty */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                        <Zap size={16} className="text-yellow-400" />
                        Difficulty
                    </label>
                    <div className="flex gap-2">
                        {(['Mix', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                    difficulty === diff
                                        ? diff === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                            : diff === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                            : diff === 'Hard' ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                                }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Question Type */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                        <Filter size={16} className="text-pink-400" />
                        Question Type
                    </label>
                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value as typeof questionType)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="Mix">All Types (Mixed)</option>
                        <option value="SCQ">Single Correct (SCQ)</option>
                        <option value="MCQ">Multiple Correct (MCQ)</option>
                        <option value="NVT">Numerical Value (NVT)</option>
                    </select>
                </div>
                
                {/* Start Button */}
                <motion.button
                    onClick={handleStart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
                >
                    <Play size={24} fill="currentColor" />
                    Start Session
                    <ArrowRight size={20} />
                </motion.button>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            The Crucible
                        </h1>
                        <p className="text-gray-400 mt-1">Master JEE Chemistry through adaptive practice</p>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2">
                            <Target size={18} className="text-indigo-400" />
                            <span className="text-sm text-gray-300">Accuracy:</span>
                            <span className={`font-bold ${overallAccuracy > 70 ? 'text-green-400' : overallAccuracy > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {overallAccuracy}%
                            </span>
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2">
                            <Flame size={18} className="text-orange-400" />
                            <span className="text-sm text-gray-300">Streak:</span>
                            <span className="font-bold text-orange-400">{progress.currentStreak} days</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Layout: 3 columns on large screens */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Chapter List (5 cols) */}
                <div className="lg:col-span-5">
                    {renderChapterList()}
                </div>
                
                {/* Right: Session Config (4 cols) */}
                <div className="lg:col-span-4">
                    {renderSessionConfig()}
                </div>
                
                {/* Far Right: Mini Progress (3 cols) */}
                <div className="lg:col-span-3">
                    <StudentProgressDashboard compact />
                </div>
            </div>
            
            {/* Bottom: Full Progress Dashboard */}
            <div className="max-w-7xl mx-auto mt-6">
                <StudentProgressDashboard />
            </div>
        </div>
    );
}
