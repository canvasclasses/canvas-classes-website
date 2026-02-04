'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, Check, Trash2, Plus, Star, Filter, Calendar, MonitorPlay } from 'lucide-react';
import { Question } from '../types';
import { getQuestions, saveQuestion, deleteQuestion } from '../actions';
import Link from 'next/link';
import { fetchLecturesData, Chapter } from '../../lib/lecturesData';

export default function AdminPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
    const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [qData, cData] = await Promise.all([
            getQuestions(),
            fetchLecturesData()
        ]);
        setQuestions(qData);
        setChapters(cData);
        setLoading(false);
    };

    const handleAddQuestion = async () => {
        const newId = `q_${Date.now()}`;
        const defaultChapter = selectedChapterFilter !== 'all' ? selectedChapterFilter : (chapters[0]?.name || 'Unassigned');

        const newQuestion: Question = {
            id: newId,
            type: 'MCQ', // Default
            textMarkdown: "New Question Text",
            options: [
                { id: 'a', text: 'Option A', isCorrect: true },
                { id: 'b', text: 'Option B', isCorrect: false },
                { id: 'c', text: 'Option C', isCorrect: false },
                { id: 'd', text: 'Option D', isCorrect: false }
            ],
            integerAnswer: "", // Blank by default
            tagId: 'Unassigned',
            difficulty: 'Medium',
            chapterId: defaultChapter,
            isTopPYQ: false,
            isPYQ: false,
            examSource: '',
            solution: {
                textSolutionLatex: "Wait for solution..."
            }
        };

        setQuestions(prev => [newQuestion, ...prev]);
        setSelectedQuestionId(newId);
        await saveQuestion(newQuestion);
    };

    const handleDelete = async (id: string) => {
        if (deletingId === id) {
            setQuestions(prev => prev.filter(q => q.id !== id));
            await deleteQuestion(id);
            setDeletingId(null);
            if (selectedQuestionId === id) setSelectedQuestionId(null);
        } else {
            setDeletingId(id);
            setTimeout(() => setDeletingId(null), 3000);
        }
    };

    const handleUpdate = async (id: string, field: keyof Question, value: any) => {
        const question = questions.find(q => q.id === id);
        if (!question) return;

        let updated = { ...question, [field]: value };

        // Special handling for Answer Update
        if (field === 'options') {
            updated = { ...question, options: value };
        }

        // Logic: specific business rules
        if (field === 'isPYQ' && value === false) {
            // If unchecking PYQ, clear year? Maybe keep it as history.
            // Let's decided to keep it, but UI will hide it.
        }

        // Optimistic update
        setQuestions(prev => prev.map(q => q.id === id ? updated : q));

        setSavingId(id);
        await saveQuestion(updated);
        setTimeout(() => setSavingId(null), 1000);
    };

    const handleAnswerChange = (q: Question, correctOptionId: string) => {
        const newOptions = q.options.map(opt => ({
            ...opt,
            isCorrect: opt.id === correctOptionId
        }));
        handleUpdate(q.id, 'options', newOptions);
    };

    const handleOptionTextChange = (q: Question, optionId: string, text: string) => {
        const newOptions = q.options.map(opt => ({
            ...opt,
            text: opt.id === optionId ? text : opt.text
        }));
        handleUpdate(q.id, 'options', newOptions);
    };

    const handleSolutionChange = (q: Question, text: string) => {
        handleUpdate(q.id, 'solution', { ...q.solution, textSolutionLatex: text });
    };

    if (loading) return <div className="p-8 text-white">Loading Admin...</div>;

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    // Filter questions based on selected chapter
    // Filter questions based on selected filters
    const filteredQuestions = questions.filter(q => {
        // Chapter Filter
        if (selectedChapterFilter !== 'all' && q.chapterId !== selectedChapterFilter) return false;

        // Type Filter
        if (selectedTypeFilter !== 'all' && q.type !== selectedTypeFilter) return false;

        // Source Filter
        if (selectedSourceFilter !== 'all') {
            if (selectedSourceFilter === 'mains_pyq') {
                if (!q.isPYQ) return false;
                const src = (q.examSource || '').toLowerCase();
                // Check for Main
                if (!src.includes('main')) return false;
            } else if (selectedSourceFilter === 'adv_pyq') {
                if (!q.isPYQ) return false;
                const src = (q.examSource || '').toLowerCase();
                // Check for Advanced
                if (!src.includes('adv')) return false;
            }
        }

        return true;
    });

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Left Panel: Table Editor */}
            <div className="flex-1 flex flex-col w-1/2 h-screen">
                <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 p-8 space-y-4 shadow-2xl shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                The Crucible Admin
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Manage Chapter, Difficulty, and NEET/Top Qs.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddQuestion}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-bold transition shadow-lg shadow-purple-900/20"
                            >
                                <Plus size={18} /> Add Question
                            </button>
                            <Link href="/the-crucible" className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition">
                                View Live
                            </Link>
                        </div>
                    </div>

                    {/* Global Filter Bar */}
                    <div className="flex items-center gap-4 bg-gray-800/80 p-3 rounded-xl border border-gray-700 overflow-x-auto">
                        <div className="flex items-center gap-2 text-purple-400 shrink-0">
                            <Filter size={18} />
                            <span className="font-bold text-sm">Filters:</span>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <select
                                value={selectedChapterFilter}
                                onChange={(e) => setSelectedChapterFilter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none transition"
                            >
                                <option value="all">All Chapters ({questions.length} Qs)</option>
                                {chapters.map(ch => (
                                    <option key={ch.slug} value={ch.name}>
                                        {ch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-32 shrink-0">
                            <select
                                value={selectedTypeFilter}
                                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none transition"
                            >
                                <option value="all">Any Type</option>
                                <option value="MCQ">MCQ</option>
                                <option value="INTEGER">Integer</option>
                            </select>
                        </div>

                        <div className="w-40 shrink-0">
                            <select
                                value={selectedSourceFilter}
                                onChange={(e) => setSelectedSourceFilter(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none transition"
                            >
                                <option value="all">Any Source</option>
                                <option value="mains_pyq">JEE Mains PYQ</option>
                                <option value="adv_pyq">JEE Adv PYQ</option>
                            </select>
                        </div>

                        {selectedChapterFilter !== 'all' && (
                            <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-300 whitespace-nowrap">
                                Default: <b>{selectedChapterFilter}</b>
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 border-b border-gray-700">
                                <tr>
                                    <th className="p-3 text-gray-400 font-medium text-[10px] uppercase tracking-wider w-20">ID</th>
                                    <th className="p-3 text-gray-400 font-medium text-[10px] uppercase tracking-wider">Question Content</th>
                                    <th className="p-3 text-gray-400 font-medium text-[10px] uppercase tracking-wider w-20">PYQ</th>
                                    <th className="p-3 text-gray-400 font-medium text-[10px] uppercase tracking-wider w-20">Diff</th>
                                    <th className="p-3 text-gray-400 font-medium text-[10px] uppercase tracking-wider w-12 text-center">Top</th>
                                    <th className="p-3 text-gray-400 font-medium text-[10px] uppercase tracking-wider w-16 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredQuestions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                                            No questions found for this chapter. Add one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuestions.map(q => (
                                        <tr
                                            key={q.id}
                                            className={`hover:bg-gray-700/30 transition cursor-pointer ${selectedQuestionId === q.id ? 'bg-purple-900/10 border-l-2 border-purple-500' : ''}`}
                                            onClick={() => setSelectedQuestionId(q.id)}
                                        >
                                            <td className="p-3 align-top">
                                                <input
                                                    type="text"
                                                    value={q.id}
                                                    onChange={(e) => handleUpdate(q.id, 'id', e.target.value)}
                                                    className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full text-[10px] font-mono focus:border-purple-500 outline-none"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="mt-2 text-[10px]">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-gray-500">
                                                            {q.type === 'INTEGER' ? 'Value:' : 'Ans:'}
                                                        </span>
                                                        <select
                                                            className="bg-gray-900 border border-gray-700 text-[9px] rounded px-1 text-gray-400"
                                                            value={q.type || 'MCQ'}
                                                            onChange={(e) => handleUpdate(q.id, 'type', e.target.value)}
                                                        >
                                                            <option value="MCQ">MCQ</option>
                                                            <option value="INTEGER">INT</option>
                                                        </select>
                                                    </div>

                                                    {q.type === 'INTEGER' ? (
                                                        <input
                                                            type="text"
                                                            value={q.integerAnswer || ''}
                                                            placeholder="e.g. 5"
                                                            onChange={(e) => handleUpdate(q.id, 'integerAnswer', e.target.value)}
                                                            className="bg-gray-900 border border-gray-600 rounded px-1 py-0.5 w-full text-blue-400 font-bold focus:border-purple-500 outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <select
                                                            value={q.options.find(o => o.isCorrect)?.id || ''}
                                                            onChange={(e) => handleAnswerChange(q, e.target.value)}
                                                            className="bg-gray-900 border border-gray-600 rounded px-1 py-0.5 w-full text-green-400 font-bold focus:border-purple-500 outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {q.options.map(opt => (
                                                                <option key={opt.id} value={opt.id}>{opt.id.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 align-top">
                                                <div className="space-y-2">
                                                    {/* Only show chapter selector if filtering is NOT active or showing all, otherwise it's redundant but useful for moving questions */}
                                                    {selectedChapterFilter === 'all' && (
                                                        <select
                                                            value={q.chapterId || ''}
                                                            onChange={(e) => handleUpdate(q.id, 'chapterId', e.target.value)}
                                                            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full text-[14.5px] text-blue-300 focus:border-purple-500 outline-none mb-1"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <option value="">Select Chapter</option>
                                                            {chapters.map(ch => (
                                                                <option key={ch.slug} value={ch.name}>{ch.name}</option>
                                                            ))}
                                                        </select>
                                                    )}

                                                    <textarea
                                                        value={q.textMarkdown}
                                                        onChange={(e) => handleUpdate(q.id, 'textMarkdown', e.target.value)}
                                                        placeholder="Question Text (Markdown/Latex)"
                                                        className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full h-32 text-[14.5px] focus:border-purple-500 outline-none resize-y font-mono"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />

                                                    {/* Editable Options */}
                                                    {q.type !== 'INTEGER' && (
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {q.options.map((opt) => (
                                                                <div key={opt.id} className="flex items-center gap-1 bg-gray-900/50 p-1 rounded border border-gray-700">
                                                                    <span className="text-[9px] font-bold text-gray-500 w-4">{opt.id.toUpperCase()}</span>
                                                                    <input
                                                                        type="text"
                                                                        value={opt.text}
                                                                        onChange={(e) => handleOptionTextChange(q, opt.id, e.target.value)}
                                                                        className="bg-transparent border-none p-0 text-[13px] w-full focus:outline-none focus:text-purple-300"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={q.tagId}
                                                            placeholder="Tag / Concept ID"
                                                            onChange={(e) => handleUpdate(q.id, 'tagId', e.target.value)}
                                                            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 flex-1 text-[14.5px] text-purple-300 focus:border-purple-500 outline-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>

                                                    {/* Solution Editor */}
                                                    <textarea
                                                        value={q.solution.textSolutionLatex}
                                                        onChange={(e) => handleSolutionChange(q, e.target.value)}
                                                        placeholder="Explanation / Solution (Markdown/Latex)"
                                                        className="bg-gray-900/30 border border-gray-700/50 rounded px-2 py-1 w-full h-32 text-[13px] text-gray-400 focus:border-purple-500 outline-none resize-y font-mono italic"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </td>

                                            {/* PYQ Column */}
                                            <td className="p-3 align-top">
                                                <div className="flex flex-col gap-2">
                                                    <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={!!q.isPYQ}
                                                            onChange={(e) => handleUpdate(q.id, 'isPYQ', e.target.checked)}
                                                            className="rounded border-gray-600 bg-gray-900 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                        />
                                                        <span className="text-[10px] text-gray-400">is PYQ?</span>
                                                    </label>

                                                    {q.isPYQ && (
                                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <div className="flex items-center gap-1 mb-1">
                                                                <Calendar size={10} className="text-gray-500" />
                                                                <span className="text-[9px] text-gray-500 uppercase">Year / Exam</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={q.examSource || ''}
                                                                placeholder="e.g. 2024"
                                                                onChange={(e) => handleUpdate(q.id, 'examSource', e.target.value)}
                                                                className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full text-[10px] text-white focus:border-purple-500 outline-none"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-3 align-top">
                                                <select
                                                    value={q.difficulty}
                                                    onChange={(e) => handleUpdate(q.id, 'difficulty', e.target.value)}
                                                    className={`bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full text-[10px] focus:border-purple-500 outline-none ${q.difficulty === 'Hard' ? 'text-red-400' : q.difficulty === 'Medium' ? 'text-orange-400' : 'text-emerald-400'
                                                        }`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </td>
                                            <td className="p-3 align-top text-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleUpdate(q.id, 'isTopPYQ', !q.isTopPYQ); }}
                                                    className={`transition p-2 rounded-full ${q.isTopPYQ ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 hover:text-gray-400'}`}
                                                    title="Mark as Top PYQ"
                                                >
                                                    <Star size={18} fill={q.isTopPYQ ? "currentColor" : "none"} />
                                                </button>
                                            </td>
                                            <td className="p-3 align-top">
                                                <div className="flex flex-col gap-2 items-center">
                                                    {savingId === q.id ? (
                                                        <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                                                            <Save size={10} className="animate-spin" />
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[10px] text-green-400">
                                                            <Check size={10} />
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                                                        className={`transition flex items-center justify-center gap-1 p-1 rounded ${deletingId === q.id ? 'bg-red-900/50 text-red-200' : 'text-gray-500 hover:text-red-400 hover:bg-gray-700'}`}
                                                        title="Delete"
                                                    >
                                                        {deletingId === q.id ? <span className="text-[10px]">?</span> : <Trash2 size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Panel: Live Preview */}
            <div className="w-[45%] border-l border-gray-800 bg-gray-950/20 backdrop-blur-xl p-8 pt-24 sticky top-0 h-screen overflow-y-auto no-scrollbar">
                <h2 className="text-lg font-bold text-gray-300 mb-8 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></span>
                    Live Preview
                </h2>

                {selectedQuestion ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="mb-6 flex items-center justify-between bg-gray-900/50 p-4 rounded-xl border border-gray-800 shadow-lg">
                            <span className="text-xs text-gray-400 font-mono tracking-wider">{selectedQuestion.id}</span>
                            <div className="flex gap-2">
                                <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md border ${selectedQuestion.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    selectedQuestion.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                    {selectedQuestion.difficulty}
                                </span>
                                {selectedQuestion.isTopPYQ && (
                                    <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                                        <Star size={10} fill="currentColor" /> Top PYQ
                                    </span>
                                )}
                                {selectedQuestion.isPYQ && selectedQuestion.examSource && (
                                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1 font-bold italic">
                                        <Calendar size={10} /> {selectedQuestion.examSource}
                                    </span>
                                )}
                            </div>
                        </div>
                        <PreviewCard question={selectedQuestion} />
                    </div>
                ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-gray-600 gap-4 border-2 border-dashed border-gray-800/50 rounded-3xl">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                            <MonitorPlay size={32} className="opacity-40" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-500">No Question Selected</p>
                            <p className="text-sm">Select a question from the table to see the live preview here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

// Simple wrapper to safely use the QuestionCard which is complex
import QuestionCard from '../../../components/question-bank/QuestionCard';
import SolutionViewer from '../../../components/question-bank/SolutionViewer';

function PreviewCard({ question }: { question: Question }) {
    return (
        <div className="space-y-6">
            <div className="pointer-events-none">
                <QuestionCard
                    question={question}
                    onAnswerSubmit={() => { }}
                    showFeedback={false}
                    selectedOptionId={null}
                    layout="list"
                />
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
                    Solution Preview
                </h3>
                <div className="bg-gray-950/50 rounded-2xl border border-gray-800/50 backdrop-blur-sm p-2 shadow-2xl">
                    <SolutionViewer solution={question.solution} />
                </div>
            </div>
        </div>
    );
}
