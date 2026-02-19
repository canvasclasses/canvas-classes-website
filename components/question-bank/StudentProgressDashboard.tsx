'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, Target, Award, Clock, BookOpen, 
    CheckCircle2, XCircle, HelpCircle, Zap, Crown,
    BarChart3, Flame, Star, ChevronRight, Brain,
    Calendar, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { useCrucibleProgress } from '@/hooks/useCrucibleProgress';

interface StudentProgressDashboardProps {
    compact?: boolean;
}

export default function StudentProgressDashboard({ compact = false }: StudentProgressDashboardProps) {
    const { 
        progress, 
        overallAccuracy, 
        getChapterStats,
        dueCount 
    } = useCrucibleProgress();
    
    // Calculate statistics
    const stats = useMemo(() => {
        const totalQuestions = progress.totalAttempted;
        const correct = progress.totalCorrect;
        const incorrect = progress.totalIncorrect;
        const skipped = totalQuestions - correct - incorrect;
        
        const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
        
        // Calculate mastery level
        const masteredCount = progress.masteredIds?.length || 0;
        const starredCount = progress.starredIds?.length || 0;
        
        // Get chapter-wise breakdown
        const chapterStats = Object.entries(progress.chapterStats || {}).map(([chapterId, stats]) => ({
            chapterId,
            ...stats,
            mastery: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0
        }));
        
        // Find strongest and weakest chapters
        const sortedChapters = chapterStats.filter(ch => ch.attempted > 0).sort((a, b) => b.mastery - a.mastery);
        const strongestChapter = sortedChapters[0];
        const weakestChapter = sortedChapters[sortedChapters.length - 1];
        
        return {
            totalQuestions,
            correct,
            incorrect,
            skipped,
            accuracy,
            masteredCount,
            starredCount,
            chapterStats,
            strongestChapter,
            weakestChapter,
            currentStreak: progress.currentStreak || 0,
            bestStreak: progress.bestStreak || 0,
            dueForReview: dueCount || 0
        };
    }, [progress, dueCount]);
    
    // Compact version for sidebar
    if (compact) {
        return (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-emerald-600/20 to-teal-600/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-400" />
                        Your Progress
                    </h3>
                </div>
                
                <div className="p-4 space-y-4">
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-xl p-3">
                            <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
                            <div className="text-xs text-gray-400">Attempted</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-3">
                            <div className={`text-2xl font-bold ${stats.accuracy >= 70 ? 'text-green-400' : stats.accuracy >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {stats.accuracy}%
                            </div>
                            <div className="text-xs text-gray-400">Accuracy</div>
                        </div>
                    </div>
                    
                    {/* Correct/Incorrect mini bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle2 size={12} /> {stats.correct} Correct
                            </span>
                            <span className="text-red-400 flex items-center gap-1">
                                <XCircle size={12} /> {stats.incorrect} Wrong
                            </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
                            {stats.totalQuestions > 0 && (
                                <>
                                    <div 
                                        className="h-full bg-green-500"
                                        style={{ width: `${(stats.correct / stats.totalQuestions) * 100}%` }}
                                    />
                                    <div 
                                        className="h-full bg-red-500"
                                        style={{ width: `${(stats.incorrect / stats.totalQuestions) * 100}%` }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Streak */}
                    <div className="flex items-center justify-between bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
                        <div className="flex items-center gap-2">
                            <Flame size={20} className="text-orange-400" />
                            <span className="text-sm text-gray-300">Current Streak</span>
                        </div>
                        <span className="text-xl font-bold text-orange-400">{stats.currentStreak} days</span>
                    </div>
                    
                    {/* Due for Review */}
                    {stats.dueForReview > 0 && (
                        <div className="flex items-center justify-between bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20">
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-indigo-400" />
                                <span className="text-sm text-gray-300">Due for Review</span>
                            </div>
                            <span className="text-xl font-bold text-indigo-400">{stats.dueForReview}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    // Full dashboard version
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <BarChart3 size={24} className="text-indigo-400" />
                            Student Progress Dashboard
                        </h2>
                        <p className="text-gray-400 mt-1">Track your learning journey and identify areas for improvement</p>
                    </div>
                    
                    {/* Overall Score Card */}
                    <div className="flex items-center gap-4 bg-gray-800/50 rounded-2xl p-4">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={stats.accuracy > 70 ? '#22c55e' : stats.accuracy > 40 ? '#eab308' : '#ef4444'}
                                    strokeWidth="3"
                                    strokeDasharray={`${stats.accuracy}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{stats.accuracy}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Overall Accuracy</div>
                            <div className={`text-sm font-medium ${stats.accuracy > 70 ? 'text-green-400' : stats.accuracy > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {stats.accuracy > 70 ? 'Excellent!' : stats.accuracy > 40 ? 'Good Progress' : 'Keep Practicing'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <BookOpen size={20} className="text-blue-400" />
                            </div>
                            <div className="text-sm text-gray-400">Attempted</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalQuestions}</div>
                        <div className="text-xs text-gray-500 mt-1">questions solved</div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-green-400" />
                            </div>
                            <div className="text-sm text-gray-400">Correct</div>
                        </div>
                        <div className="text-3xl font-bold text-green-400">{stats.correct}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.totalQuestions > 0 ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0}% of total
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <XCircle size={20} className="text-red-400" />
                            </div>
                            <div className="text-sm text-gray-400">Incorrect</div>
                        </div>
                        <div className="text-3xl font-bold text-red-400">{stats.incorrect}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.totalQuestions > 0 ? Math.round((stats.incorrect / stats.totalQuestions) * 100) : 0}% of total
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Crown size={20} className="text-purple-400" />
                            </div>
                            <div className="text-sm text-gray-400">Mastered</div>
                        </div>
                        <div className="text-3xl font-bold text-purple-400">{stats.masteredCount}</div>
                        <div className="text-xs text-gray-500 mt-1">topics conquered</div>
                    </motion.div>
                </div>
                
                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance by Chapter */}
                    <div className="lg:col-span-2 bg-gray-800/20 rounded-xl p-4 border border-gray-700/30">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Target size={18} className="text-indigo-400" />
                            Chapter-wise Performance
                        </h3>
                        
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {stats.chapterStats.length > 0 ? (
                                stats.chapterStats
                                    .filter(ch => ch.attempted > 0)
                                    .sort((a, b) => b.attempted - a.attempted)
                                    .slice(0, 8)
                                    .map((chapter) => (
                                        <div key={chapter.chapterId} className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-300 truncate">{chapter.chapterId.replace('chapter_', '').replace(/_/g, ' ')}</span>
                                                    <span className={`text-sm font-medium ${chapter.mastery > 70 ? 'text-green-400' : chapter.mastery > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                        {chapter.mastery}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            chapter.mastery > 70 ? 'bg-green-500' : chapter.mastery > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${chapter.mastery}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>{chapter.attempted} attempted</span>
                                                    <span>{chapter.correct}/{chapter.attempted} correct</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Brain size={40} className="mx-auto mb-3 opacity-30" />
                                    <p>Start practicing to see your chapter-wise progress!</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Insights & Recommendations */}
                    <div className="space-y-4">
                        {/* Streak Card */}
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                    <Flame size={24} className="text-orange-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Current Streak</div>
                                    <div className="text-2xl font-bold text-orange-400">{stats.currentStreak} days</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Best streak: {stats.bestStreak} days
                            </div>
                        </div>
                        
                        {/* Review Due */}
                        {stats.dueForReview > 0 && (
                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock size={20} className="text-indigo-400" />
                                    <span className="font-medium text-white">Review Due</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">
                                    {stats.dueForReview} questions are due for spaced repetition review
                                </p>
                                <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors">
                                    Start Review Session
                                </button>
                            </div>
                        )}
                        
                        {/* Strongest/Weakest */}
                        {stats.strongestChapter && (
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                    <Award size={16} className="text-yellow-400" />
                                    Performance Insights
                                </h4>
                                
                                {stats.strongestChapter && (
                                    <div className="mb-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ArrowUpRight size={16} className="text-green-400" />
                                            <span className="text-sm font-medium text-green-400">Strongest Area</span>
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {stats.strongestChapter.chapterId.replace('chapter_', '').replace(/_/g, ' ')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {stats.strongestChapter.mastery}% accuracy
                                        </div>
                                    </div>
                                )}
                                
                                {stats.weakestChapter && stats.weakestChapter.chapterId !== stats.strongestChapter?.chapterId && (
                                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ArrowDownRight size={16} className="text-red-400" />
                                            <span className="text-sm font-medium text-red-400">Needs Improvement</span>
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {stats.weakestChapter.chapterId.replace('chapter_', '').replace(/_/g, ' ')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {stats.weakestChapter.mastery}% accuracy
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Stats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Starred Questions</span>
                                    <span className="text-yellow-400 font-medium">{stats.starredCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Session</span>
                                    <span className="text-gray-300">{progress.lastSessionDate || 'Never'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Questions Due</span>
                                    <span className="text-indigo-400 font-medium">{stats.dueForReview}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
