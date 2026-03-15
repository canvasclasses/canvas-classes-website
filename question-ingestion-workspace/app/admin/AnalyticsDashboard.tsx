'use client';

import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Tag, BookOpen } from 'lucide-react';

interface AnalyticsDashboardProps {
    questions: any[];
    chapters: any[];
    onClose: () => void;
}

export default function AnalyticsDashboard({ questions, chapters, onClose }: AnalyticsDashboardProps) {
    // Calculate statistics
    const totalQuestions = questions.length;
    const fullyTagged = questions.filter(q => q.metadata.chapter_id && q.metadata.tags?.length > 0).length;
    const missingChapter = questions.filter(q => !q.metadata.chapter_id).length;
    const missingTag = questions.filter(q => q.metadata.chapter_id && (!q.metadata.tags || q.metadata.tags.length === 0)).length;
    const taggedPercentage = totalQuestions > 0 ? ((fullyTagged / totalQuestions) * 100).toFixed(1) : 0;

    // Tag frequency
    const tagFrequency: Record<string, number> = {};
    questions.forEach(q => {
        if (q.metadata.tags && q.metadata.tags.length > 0) {
            q.metadata.tags.forEach((tag: any) => {
                tagFrequency[tag.tag_id] = (tagFrequency[tag.tag_id] || 0) + 1;
            });
        }
    });
    const topTags = Object.entries(tagFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    // Chapter statistics
    const chapterStats = chapters.map(ch => {
        const chQuestions = questions.filter(q => q.metadata.chapter_id === ch._id);
        const chFullyTagged = chQuestions.filter(q => q.metadata.tags?.length > 0).length;
        return {
            name: ch.name,
            total: chQuestions.length,
            tagged: chFullyTagged,
            percentage: chQuestions.length > 0 ? ((chFullyTagged / chQuestions.length) * 100).toFixed(0) : 0
        };
    }).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BarChart3 size={24} className="text-purple-400" />
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tag Analytics Dashboard
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={16} className="text-blue-400" />
                                <span className="text-xs text-gray-400">Total Questions</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{totalQuestions}</div>
                        </div>

                        <div className="bg-green-900/20 border border-green-600/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle size={16} className="text-green-400" />
                                <span className="text-xs text-gray-400">Fully Tagged</span>
                            </div>
                            <div className="text-3xl font-bold text-green-400">{fullyTagged}</div>
                            <div className="text-xs text-green-300 mt-1">{taggedPercentage}% complete</div>
                        </div>

                        <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={16} className="text-red-400" />
                                <span className="text-xs text-gray-400">Missing Chapter</span>
                            </div>
                            <div className="text-3xl font-bold text-red-400">{missingChapter}</div>
                        </div>

                        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Tag size={16} className="text-yellow-400" />
                                <span className="text-xs text-gray-400">Missing Tag</span>
                            </div>
                            <div className="text-3xl font-bold text-yellow-400">{missingTag}</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">Overall Tagging Progress</span>
                            <span className="text-sm font-bold text-purple-400">{taggedPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                                style={{ width: `${taggedPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Top Tags */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <TrendingUp size={14} className="text-purple-400" />
                                Most Used Tags
                            </h3>
                            <div className="space-y-2">
                                {topTags.map(([tag, count], idx) => (
                                    <div key={tag} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                                            <span className="text-xs font-mono text-purple-300">{tag}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chapter Progress */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <BookOpen size={14} className="text-blue-400" />
                                Chapter Tagging Status
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {chapterStats.map(stat => (
                                    <div key={stat.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-300 truncate">{stat.name}</span>
                                            <span className="text-xs font-bold text-gray-400">{stat.tagged}/{stat.total}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${
                                                    parseInt(String(stat.percentage)) >= 80 ? 'bg-green-500' :
                                                    parseInt(String(stat.percentage)) >= 50 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6 bg-purple-900/20 border border-purple-600/50 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-purple-400 mb-3">📊 Recommendations</h3>
                        <ul className="space-y-2 text-xs text-gray-300">
                            {missingChapter > 0 && (
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400">•</span>
                                    <span><strong>{missingChapter} questions</strong> need chapter assignment. Use bulk mode to assign quickly.</span>
                                </li>
                            )}
                            {missingTag > 0 && (
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span><strong>{missingTag} questions</strong> need primary tags. Use AI suggestions for faster tagging.</span>
                                </li>
                            )}
                            {parseFloat(taggedPercentage as string) >= 80 && (
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400">•</span>
                                    <span>Great progress! <strong>{taggedPercentage}%</strong> of questions are fully tagged.</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
