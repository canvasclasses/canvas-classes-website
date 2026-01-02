'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Search,
    BookOpen,
    ChevronRight,
    ChevronDown,
    CheckCircle,
    AlertCircle,
    HelpCircle,
    Play,
    ExternalLink,
    ArrowLeft,
} from 'lucide-react';

interface NCERTQuestion {
    id: number;
    classNum: number;
    chapter: string;
    questionNumber: string;
    questionText: string;
    difficulty: string;
    solutionContent: string;
    solutionType: string;
    youtubeUrl: string;
}

// Difficulty colors
const difficultyColors: Record<string, { bg: string; text: string; border: string; icon: typeof CheckCircle }> = {
    'Easy': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
    'Moderate': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertCircle },
    'Hard': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: HelpCircle },
};

export default function ChapterSolutionsPage() {
    const params = useParams();
    const classNum = parseInt((params.classNum as string)?.replace('class-', '') || '11', 10);
    const chapterSlug = params.chapter as string;

    const [questions, setQuestions] = useState<NCERTQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [chapterName, setChapterName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    // Fetch data
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/ncert-solutions');
                const data = await response.json();

                // Find matching chapter by slug
                const allQuestions: NCERTQuestion[] = data.questions;
                const matchingQuestions = allQuestions.filter((q: NCERTQuestion) => {
                    const slug = q.chapter.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    return q.classNum === classNum && slug === chapterSlug;
                });

                if (matchingQuestions.length > 0) {
                    setChapterName(matchingQuestions[0].chapter);
                }
                setQuestions(matchingQuestions);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [classNum, chapterSlug]);

    // Filter questions
    const filteredQuestions = useMemo(() => {
        if (!searchQuery) return questions;
        return questions.filter(q =>
            q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.questionNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [questions, searchQuery]);

    const getDifficultyStyle = (difficulty: string) => {
        return difficultyColors[difficulty] || difficultyColors['Easy'];
    };

    // Format solution content
    const formatSolution = (content: string) => {
        return content.replace(/<br>/g, '\n').replace(/\|/g, '').trim();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/ncert-solutions" className="hover:text-blue-400 transition-colors">NCERT Solutions</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-500">Class {classNum}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-blue-400 line-clamp-1">{chapterName || 'Loading...'}</span>
                    </div>

                    {/* Back Button */}
                    <Link
                        href="/ncert-solutions"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Chapters
                    </Link>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 mb-6"
                    >
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-blue-400 font-medium mb-1">Class {classNum} Chemistry</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                {loading ? (
                                    <span className="inline-block w-64 h-10 bg-gray-700 rounded animate-pulse" />
                                ) : (
                                    chapterName
                                )}
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl"
                    >
                        {loading ? 'Loading...' : `${questions.length} questions with detailed step-by-step solutions`}
                    </motion.p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="py-6">
                <div className="container mx-auto px-6">
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <p className="text-gray-400 mt-4">
                        Showing <span className="font-bold text-white">{filteredQuestions.length}</span> questions
                    </p>
                </div>
            </section>

            {/* Questions List */}
            <section className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-gray-800/40 rounded-2xl p-6 animate-pulse">
                                    <div className="h-5 bg-gray-700 rounded w-1/4 mb-3" />
                                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredQuestions.map((question, idx) => {
                                const isExpanded = expandedQuestion === question.id;
                                const diffStyle = getDifficultyStyle(question.difficulty);
                                const DiffIcon = diffStyle.icon;

                                return (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.03 * Math.min(idx, 10) }}
                                        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
                                    >
                                        {/* Question Header */}
                                        <button
                                            onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                                            className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-800/60 transition-colors"
                                        >
                                            <span className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">
                                                Q{question.questionNumber}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white leading-relaxed mb-3">
                                                    {question.questionText}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                                                        <DiffIcon className="w-3.5 h-3.5" />
                                                        {question.difficulty}
                                                    </span>
                                                    {question.youtubeUrl && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                                            <Play className="w-3 h-3" />
                                                            Video Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronDown className={`shrink-0 w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Solution */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="border-t border-gray-700/50"
                                                >
                                                    <div className="p-6 bg-gray-900/50">
                                                        <h4 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                                                            <CheckCircle className="w-5 h-5" />
                                                            Solution
                                                        </h4>
                                                        <div className="text-gray-300 leading-loose whitespace-pre-wrap bg-gray-950/50 rounded-xl p-6 border border-gray-800 text-base font-sans tracking-wide">
                                                            {formatSolution(question.solutionContent).split('\n').map((line, i) => {
                                                                // Check if line is an image URL (ends with popular image extensions)
                                                                const isImageUrl = line.trim().match(/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i);

                                                                if (isImageUrl) {
                                                                    return (
                                                                        <div key={i} className="my-4">
                                                                            <img
                                                                                src={line.trim()}
                                                                                alt={`Solution diagram for Q${question.questionNumber}`}
                                                                                className="max-w-full h-auto rounded-lg border border-gray-700/50"
                                                                                loading="lazy"
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                                return <div key={i}>{line}</div>;
                                                            })}
                                                        </div>

                                                        {question.youtubeUrl && (
                                                            <a
                                                                href={question.youtubeUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <Play className="w-4 h-4" />
                                                                Watch Video Solution
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {filteredQuestions.length === 0 && !loading && (
                        <div className="text-center py-16">
                            <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No questions found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Navigation */}
            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center">
                        <Link
                            href="/ncert-solutions"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/60 text-white font-medium rounded-xl border border-gray-700/50 hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to All Chapters
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
