'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, Check, Trash2, Plus, Star, Filter, Calendar, MonitorPlay, Tag, Scale, AlertTriangle, BookOpen } from 'lucide-react';
import { Question, JEEQuestionType, WeightedTag, TaxonomyNode } from '../types';

import { getQuestions, saveQuestion, deleteQuestion, getTaxonomy, syncSupabaseToMongo } from '../actions';
import Link from 'next/link';
import { fetchLecturesData, Chapter } from '../../lib/lecturesData';
import AudioRecorder from './AudioRecorder';
import SmartUploader from '../../../components/admin/SmartUploader';
import { uploadAsset } from '../../../lib/uploadUtils';

const QUESTION_TYPES: { id: JEEQuestionType; name: string; color: string }[] = [
    { id: 'SCQ', name: 'Single Correct', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'MCQ', name: 'Multi Correct', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'NVT', name: 'Numerical', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'AR', name: 'Assertion-Reason', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { id: 'MST', name: 'Multi-Statement', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { id: 'MTC', name: 'Match Column', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
];

export default function AdminPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [taxonomy, setTaxonomy] = useState<TaxonomyNode[]>([]); // New state
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
    const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
    const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('all');
    const [selectedTopPYQFilter, setSelectedTopPYQFilter] = useState<string>('all');
    const [selectedTagStatusFilter, setSelectedTagStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [qData, cData, tData] = await Promise.all([
            getQuestions(),
            fetchLecturesData(),
            getTaxonomy() // Fetch DB taxonomy
        ]);
        setQuestions(qData);
        setChapters(cData);
        setTaxonomy(tData);
        setLoading(false);
    };

    const handleSync = async () => {
        if (!confirm('This will pull all questions from Supabase into MongoDB. Proceed?')) return;
        setIsSyncing(true);
        try {
            const result = await syncSupabaseToMongo();
            if (result.success) {
                alert(result.message);
                loadData(); // Reload the list
            } else {
                alert("Sync failed: " + result.message);
            }
        } catch (e) {
            alert("Error: " + String(e));
        } finally {
            setIsSyncing(false);
        }
    };

    const handleAddQuestion = async () => {
        const newId = `q_${Date.now()}`;
        const defaultChapter = selectedChapterFilter !== 'all' ? selectedChapterFilter : (chapters[0]?.name || 'Unassigned');

        const newQuestion: Question = {
            id: newId,
            questionType: 'SCQ',
            textMarkdown: "New Question Text",
            options: [
                { id: 'a', text: 'Option A', isCorrect: true },
                { id: 'b', text: 'Option B', isCorrect: false },
                { id: 'c', text: 'Option C', isCorrect: false },
                { id: 'd', text: 'Option D', isCorrect: false }
            ],
            integerAnswer: "",
            tagId: 'TAG_MOLE_BASICS',
            conceptTags: [{ tagId: 'TAG_MOLE_BASICS', weight: 1.0 }],
            difficulty: 'Medium',
            chapterId: defaultChapter,
            isTopPYQ: false,
            isPYQ: false,
            examSource: '',
            solution: {
                textSolutionLatex: "Wait for solution..."
            },
            needsReview: true,
            reviewNotes: ''
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
        const result = await saveQuestion(updated);
        if (!result.success) {
            alert(`Save failed: ${result.message}`);
        }
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

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>, q: Question, field: 'textMarkdown' | 'solution') => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (!file) continue;

                // Optimistic UI feedback could go here (e.g. "Uploading...")
                // For now, we rely on the async insert

                try {
                    // Upload
                    const { url } = await uploadAsset(file, 'questions', q.id);

                    // Insert Markdown at cursor
                    const textarea = e.currentTarget;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const before = text.substring(0, start);
                    const after = text.substring(end, text.length);
                    const newText = `${before}\n![Image](${url})\n${after}`;

                    if (field === 'solution') {
                        handleUpdate(q.id, 'solution', { ...q.solution, textSolutionLatex: newText });
                    } else {
                        handleUpdate(q.id, field, newText);
                    }
                } catch (error) {
                    console.error("Paste upload failed:", error);
                    alert("Failed to upload pasted image");
                }
            }
        }
    };

    const handleUploadComplete = (url: string, q: Question, field: 'textMarkdown' | 'solution') => {
        const currentText = field === 'solution' ? q.solution.textSolutionLatex : q.textMarkdown;
        const newText = `${currentText || ''}\n![Image](${url})`;

        if (field === 'solution') {
            handleUpdate(q.id, 'solution', { ...q.solution, textSolutionLatex: newText });
        } else {
            handleUpdate(q.id, field, newText);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading Admin...</div>;

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    // Extract unique exam sources for shift-wise filtering
    const examSourcesRaw = questions.map(q => q.examSource).filter((src): src is string => !!src && src.trim() !== '');
    const uniqueExamSources = Array.from(new Set(examSourcesRaw)).sort((a, b) => b.localeCompare(a));

    // Group sources by year for organized display
    const shiftGroups = {
        '2026': uniqueExamSources.filter(s => s.includes('2026')),
        '2025': uniqueExamSources.filter(s => s.includes('2025')),
        '2024': uniqueExamSources.filter(s => s.includes('2024')),
        'Older': uniqueExamSources.filter(s => !s.includes('2026') && !s.includes('2025') && !s.includes('2024'))
    };

    // Count questions per shift
    const getShiftCount = (shift: string) => questions.filter(q => q.examSource === shift).length;

    // Filter questions based on selected filters
    const filteredQuestions = questions.filter(q => {
        // Chapter Filter
        if (selectedChapterFilter !== 'all' && q.chapterId !== selectedChapterFilter) return false;

        // Type Filter
        if (selectedTypeFilter !== 'all' && q.questionType !== selectedTypeFilter) return false;

        // Shift Filter (NEW - takes priority over source filter)
        if (selectedShiftFilter !== 'all') {
            if (q.examSource !== selectedShiftFilter) return false;
        }
        // Source Filter (only if shift filter is not active)
        else if (selectedSourceFilter !== 'all') {
            if (selectedSourceFilter === 'mains_pyq') {
                if (!q.isPYQ) return false;
                const src = (q.examSource || '').toLowerCase();
                if (!src.includes('main')) return false;
            } else if (selectedSourceFilter === 'adv_pyq') {
                if (!q.isPYQ) return false;
                const src = (q.examSource || '').toLowerCase();
                if (!src.includes('adv')) return false;
            } else if (selectedSourceFilter === 'non_pyq') {
                if (q.isPYQ) return false;
            }
        }

        // TopPYQ Filter
        if (selectedTopPYQFilter !== 'all') {
            if (selectedTopPYQFilter === 'top' && !q.isTopPYQ) return false;
            if (selectedTopPYQFilter === 'not-top' && q.isTopPYQ) return false;
        }

        // Tag Status Filter
        if (selectedTagStatusFilter !== 'all') {
            const hasChapter = !!q.chapterId;
            const hasTag = !!q.tagId;
            if (selectedTagStatusFilter === 'untagged' && hasChapter && hasTag) return false;
            if (selectedTagStatusFilter === 'no-chapter' && hasChapter) return false;
            if (selectedTagStatusFilter === 'no-tag' && (!hasChapter || hasTag)) return false;
        }

        return true;
    });

    // Tag status counts
    const untaggedCount = questions.filter(q => !q.chapterId || !q.tagId).length;
    const noChapterCount = questions.filter(q => !q.chapterId).length;
    const noTagCount = questions.filter(q => q.chapterId && !q.tagId).length;

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            {/* TOP BAR: Single row with all controls */}
            <header className="shrink-0 bg-gray-950 border-b border-gray-800 px-4 py-2.5">
                <div className="flex items-center gap-3">
                    {/* Left: Title + Actions */}
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent shrink-0">Admin</h1>
                    <span className="text-gray-500 text-[10px] shrink-0">{questions.length}</span>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={handleAddQuestion}
                            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold hover:bg-indigo-500 transition"
                        >
                            <Plus size={10} /> Add
                        </button>
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-[10px] hover:bg-gray-700 transition"
                        >
                            {isSyncing ? '...' : 'Sync'}
                        </button>
                        <Link href="/the-crucible" className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-[10px] hover:bg-gray-700 transition">
                            Live
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-700 shrink-0" />

                    {/* Question Selector + Navigation - NOW ON LEFT */}
                    <select
                        value={selectedQuestionId || ''}
                        onChange={(e) => setSelectedQuestionId(e.target.value)}
                        className="w-64 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[10px] focus:border-purple-500 outline-none shrink-0"
                    >
                        <option value="">Question ({filteredQuestions.length})</option>
                        {filteredQuestions.map(q => {
                            const dot = !q.chapterId ? '🔴' : !q.tagId ? '🟡' : '🟢';
                            return (
                                <option key={q.id} value={q.id}>
                                    {dot} {q.id} - {q.textMarkdown.substring(0, 28)}...
                                </option>
                            );
                        })}
                    </select>

                    {selectedQuestion && (
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                onClick={() => {
                                    const idx = filteredQuestions.findIndex(q => q.id === selectedQuestionId);
                                    if (idx > 0) setSelectedQuestionId(filteredQuestions[idx - 1].id);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-500 transition shadow-sm"
                            >
                                ← Prev
                            </button>
                            <button
                                onClick={() => {
                                    const idx = filteredQuestions.findIndex(q => q.id === selectedQuestionId);
                                    if (idx < filteredQuestions.length - 1) setSelectedQuestionId(filteredQuestions[idx + 1].id);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-500 transition shadow-sm"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-700 shrink-0" />

                    {/* Filters: Spread evenly - NOW ON RIGHT */}
                    <div className="flex items-center gap-2 flex-1">
                        <Filter size={10} className="text-purple-400 shrink-0" />

                        <select
                            value={selectedChapterFilter}
                            onChange={(e) => setSelectedChapterFilter(e.target.value)}
                            className="w-32 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[10px] focus:border-purple-500 outline-none truncate"
                        >
                            <option value="all">Chapter</option>
                            {chapters.map(ch => (
                                <option key={ch.slug} value={ch.name}>{ch.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedTypeFilter}
                            onChange={(e) => setSelectedTypeFilter(e.target.value)}
                            className="w-20 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[10px] focus:border-purple-500 outline-none"
                        >
                            <option value="all">Type</option>
                            {QUESTION_TYPES.map(qt => (
                                <option key={qt.id} value={qt.id}>{qt.id}</option>
                            ))}
                        </select>

                        <select
                            value={selectedSourceFilter}
                            onChange={(e) => { setSelectedSourceFilter(e.target.value); setSelectedShiftFilter('all'); }}
                            className="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[10px] focus:border-purple-500 outline-none"
                        >
                            <option value="all">Source</option>
                            <option value="mains_pyq">Mains</option>
                            <option value="adv_pyq">Adv</option>
                            <option value="non_pyq">Non-PYQ</option>
                        </select>

                        <select
                            value={selectedShiftFilter}
                            onChange={(e) => { setSelectedShiftFilter(e.target.value); if (e.target.value !== 'all') setSelectedSourceFilter('all'); }}
                            className={`w-36 bg-gray-900 border rounded px-2 py-1 text-[10px] outline-none truncate ${selectedShiftFilter !== 'all' ? 'border-indigo-500 text-indigo-300' : 'border-gray-700'}`}
                        >
                            <option value="all">Shift</option>
                            {Object.entries(shiftGroups).map(([year, shifts]) => (
                                shifts.length > 0 && (
                                    <optgroup key={year} label={year}>
                                        {shifts.map(shift => (
                                            <option key={shift} value={shift}>
                                                {shift.replace('JEE Main ', '').replace('JEE Advanced ', '')} ({getShiftCount(shift)})
                                            </option>
                                        ))}
                                    </optgroup>
                                )
                            ))}
                        </select>

                        <select
                            value={selectedTopPYQFilter}
                            onChange={(e) => setSelectedTopPYQFilter(e.target.value)}
                            className={`w-16 bg-gray-900 border rounded px-1.5 py-1 text-[10px] outline-none ${selectedTopPYQFilter !== 'all' ? 'border-amber-500 text-amber-300' : 'border-gray-700'}`}
                        >
                            <option value="all">All</option>
                            <option value="top">⭐Top</option>
                            <option value="not-top">Other</option>
                        </select>

                        <select
                            value={selectedTagStatusFilter}
                            onChange={(e) => setSelectedTagStatusFilter(e.target.value)}
                            className={`w-24 bg-gray-900 border rounded px-1.5 py-1 text-[10px] outline-none ${selectedTagStatusFilter !== 'all' ? 'border-red-500 text-red-300' : 'border-gray-700'}`}
                        >
                            <option value="all">Tags ✓</option>
                            <option value="untagged">⚠ Untagged ({untaggedCount})</option>
                            <option value="no-chapter">🔴 No Chapter ({noChapterCount})</option>
                            <option value="no-tag">🟡 No Tag ({noTagCount})</option>
                        </select>

                        {(selectedChapterFilter !== 'all' || selectedTypeFilter !== 'all' || selectedSourceFilter !== 'all' || selectedShiftFilter !== 'all' || selectedTopPYQFilter !== 'all' || selectedTagStatusFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSelectedChapterFilter('all');
                                    setSelectedTypeFilter('all');
                                    setSelectedSourceFilter('all');
                                    setSelectedShiftFilter('all');
                                    setSelectedTopPYQFilter('all');
                                    setSelectedTagStatusFilter('all');
                                }}
                                className="text-[9px] text-red-400 hover:text-red-300 shrink-0"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Save Status */}
                    {savingId && <span className="text-[10px] text-yellow-400 flex items-center gap-1 shrink-0"><Save size={10} className="animate-spin" /></span>}
                </div>
            </header>

            {/* MAIN AREA: 65/35 split - Editor + Preview */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT: Editor (65%) */}
                <div className="w-[60%] flex flex-col overflow-hidden border-r border-gray-800">
                    {selectedQuestion ? (
                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Header: ID + Type + Difficulty + Actions */}
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-800">
                                <input
                                    type="text"
                                    value={selectedQuestion.id}
                                    onChange={(e) => handleUpdate(selectedQuestion.id, 'id', e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono focus:border-purple-500 outline-none w-44"
                                />
                                <select
                                    value={selectedQuestion.questionType || 'SCQ'}
                                    onChange={(e) => handleUpdate(selectedQuestion.id, 'questionType', e.target.value as JEEQuestionType)}
                                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                                >
                                    {QUESTION_TYPES.map(qt => (
                                        <option key={qt.id} value={qt.id}>{qt.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedQuestion.difficulty}
                                    onChange={(e) => handleUpdate(selectedQuestion.id, 'difficulty', e.target.value)}
                                    className={`bg-gray-800 border rounded px-2 py-1 text-sm ${selectedQuestion.difficulty === 'Hard' ? 'border-red-500/50 text-red-400' : selectedQuestion.difficulty === 'Medium' ? 'border-orange-500/50 text-orange-400' : 'border-emerald-500/50 text-emerald-400'}`}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>

                                <div className="flex items-center gap-3 ml-auto">
                                    <label className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-gray-800/50 hover:bg-gray-700/50 transition">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedQuestion.isPYQ}
                                            onChange={(e) => handleUpdate(selectedQuestion.id, 'isPYQ', e.target.checked)}
                                            className="h-4 w-4 accent-blue-500"
                                        />
                                        <span className="text-xs text-gray-300 font-medium">PYQ</span>
                                    </label>
                                    <button
                                        onClick={() => handleUpdate(selectedQuestion.id, 'isTopPYQ', !selectedQuestion.isTopPYQ)}
                                        className={`p-1.5 rounded transition ${selectedQuestion.isTopPYQ ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800/50 text-gray-500 hover:text-amber-400 hover:bg-gray-700/50'}`}
                                        title="Mark as Top PYQ"
                                    >
                                        <Star size={18} fill={selectedQuestion.isTopPYQ ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedQuestion.id)}
                                        className={`p-1.5 rounded transition ${deletingId === selectedQuestion.id ? 'bg-red-500 text-white' : 'bg-gray-800/50 text-gray-500 hover:text-red-400 hover:bg-red-500/20'}`}
                                        title="Delete question"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Row: Chapter + Tag + Source */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block">Chapter</label>
                                    <select
                                        value={selectedQuestion.chapterId || ''}
                                        onChange={(e) => handleUpdate(selectedQuestion.id, 'chapterId', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs focus:border-purple-500 outline-none"
                                    >
                                        <option value="">Select</option>
                                        {taxonomy.filter(n => n.type === 'chapter').sort((a, b) => (a.sequence_order || 999) - (b.sequence_order || 999)).map(ch => (
                                            <option key={ch.id} value={ch.id}>{ch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block">Primary Tag</label>
                                    <select
                                        value={selectedQuestion.tagId || ''}
                                        onChange={(e) => handleUpdate(selectedQuestion.id, 'tagId', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-purple-300 focus:border-purple-500 outline-none"
                                    >
                                        <option value="">Select</option>
                                        {(() => {
                                            const cName = selectedQuestion.chapterId || '';
                                            const chapterNode = taxonomy.find(n =>
                                                n.type === 'chapter' && (n.id === cName || n.name === cName || n.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cName.toLowerCase().replace(/[^a-z0-9]/g, ''))
                                            );
                                            const availableTags = chapterNode ? taxonomy.filter(n => n.type === 'topic' && n.parent_id === chapterNode.id) : [];
                                            if (selectedQuestion.tagId && !availableTags.find(t => t.id === selectedQuestion.tagId)) {
                                                const currentTag = taxonomy.find(t => t.id === selectedQuestion.tagId);
                                                if (currentTag) availableTags.push(currentTag);
                                            }
                                            return availableTags.map(tag => (
                                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                                            ));
                                        })()}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block">{selectedQuestion.isPYQ ? 'Exam Source' : 'Reference'}</label>
                                    <input
                                        type="text"
                                        value={selectedQuestion.examSource || ''}
                                        placeholder={selectedQuestion.isPYQ ? "JEE Main 2026..." : "NCERT, etc."}
                                        onChange={(e) => handleUpdate(selectedQuestion.id, 'examSource', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs focus:border-purple-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Question Text - Side by side with uploader */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] text-gray-500">Question Text</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] text-gray-500">Scale:</span>
                                        <input
                                            type="number"
                                            min="10"
                                            max="100"
                                            value={selectedQuestion.imageScale || 100}
                                            onChange={(e) => handleUpdate(selectedQuestion.id, 'imageScale', parseInt(e.target.value) || 100)}
                                            className="bg-gray-900 border border-gray-700 rounded w-10 text-[9px] text-center px-0.5"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 items-stretch h-72">
                                    <textarea
                                        value={selectedQuestion.textMarkdown}
                                        onPaste={(e) => handlePaste(e, selectedQuestion, 'textMarkdown')}
                                        onChange={(e) => handleUpdate(selectedQuestion.id, 'textMarkdown', e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm leading-tight focus:border-purple-500 outline-none resize-none font-mono"
                                    />
                                    <div className="w-24 shrink-0">
                                        <SmartUploader
                                            questionId={selectedQuestion.id}
                                            onUploadComplete={(url) => handleUploadComplete(url, selectedQuestion, 'textMarkdown')}
                                            className="h-full w-full text-[8px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Options (non-NVT) OR Numerical Answer */}
                            {selectedQuestion.questionType !== 'NVT' ? (
                                <div className="mb-3">
                                    <label className="text-[10px] text-gray-500 mb-1 block">Options</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedQuestion.options.map((opt) => (
                                            <div key={opt.id} className={`p-2 rounded border ${opt.isCorrect ? 'bg-green-900/20 border-green-600/50' : 'bg-gray-800/50 border-gray-700'}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <button
                                                        onClick={() => handleAnswerChange(selectedQuestion, opt.id)}
                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${opt.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                                    >
                                                        {opt.id.toUpperCase()} {opt.isCorrect && '✓'}
                                                    </button>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] text-gray-500">Scale:</span>
                                                        <input
                                                            type="number"
                                                            min="10"
                                                            max="100"
                                                            value={opt.imageScale || 100}
                                                            onChange={(e) => {
                                                                const newOpts = selectedQuestion.options.map(o => o.id === opt.id ? { ...o, imageScale: parseInt(e.target.value) || 100 } : o);
                                                                handleUpdate(selectedQuestion.id, 'options', newOpts);
                                                            }}
                                                            className="bg-gray-900 border border-gray-700 rounded w-10 text-[9px] text-center px-0.5"
                                                        />
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => handleOptionTextChange(selectedQuestion, opt.id, e.target.value)}
                                                    className="w-full bg-transparent text-xs focus:outline-none focus:text-purple-300 font-mono"
                                                    placeholder="Option text or SVG URL..."
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <label className="text-[10px] text-gray-500 mb-1 block">Numerical Answer</label>
                                    <input
                                        type="text"
                                        value={selectedQuestion.integerAnswer || ''}
                                        onChange={(e) => handleUpdate(selectedQuestion.id, 'integerAnswer', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xl font-bold text-blue-400 focus:border-purple-500 outline-none"
                                        placeholder="Enter numerical answer"
                                    />
                                </div>
                            )}

                            {/* Solution - Side by side with uploader */}
                            <div className="mb-3">
                                <label className="text-[10px] text-gray-500 mb-1 block">Solution</label>
                                <div className="flex gap-2 items-stretch h-88">
                                    <textarea
                                        value={selectedQuestion.solution.textSolutionLatex}
                                        onPaste={(e) => handlePaste(e, selectedQuestion, 'solution')}
                                        onChange={(e) => handleSolutionChange(selectedQuestion, e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm leading-tight focus:border-purple-500 outline-none resize-none font-mono"
                                    />
                                    <div className="w-24 shrink-0">
                                        <SmartUploader
                                            questionId={selectedQuestion.id}
                                            onUploadComplete={(url) => handleUploadComplete(url, selectedQuestion, 'solution')}
                                            className="h-full w-full text-[8px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Audio + References (collapsed) */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <AudioRecorder
                                        questionId={selectedQuestion.id}
                                        existingAudioUrl={selectedQuestion.solution.audioExplanationUrl}
                                        onUploadComplete={(url) => {
                                            handleUpdate(selectedQuestion.id, 'solution', { ...selectedQuestion.solution, audioExplanationUrl: url });
                                        }}
                                    />
                                </div>
                                <details className="flex-1">
                                    <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-300 flex items-center gap-1">
                                        <BookOpen size={10} /> Refs ({selectedQuestion.sourceReferences?.length || 0})
                                    </summary>
                                    <div className="mt-2 space-y-1 text-xs">
                                        {(selectedQuestion.sourceReferences || []).map((ref, idx) => (
                                            <div key={idx} className="flex gap-1 items-center">
                                                <select
                                                    value={ref.type}
                                                    onChange={(e) => {
                                                        const newRefs = [...(selectedQuestion.sourceReferences || [])];
                                                        newRefs[idx] = { ...ref, type: e.target.value as any };
                                                        handleUpdate(selectedQuestion.id, 'sourceReferences', newRefs);
                                                    }}
                                                    className="bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-[10px]"
                                                >
                                                    <option value="NCERT">NCERT</option>
                                                    <option value="PYQ">PYQ</option>
                                                    <option value="COACHING">Coaching</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Desc"
                                                    value={ref.description || ''}
                                                    onChange={(e) => {
                                                        const newRefs = [...(selectedQuestion.sourceReferences || [])];
                                                        newRefs[idx] = { ...ref, description: e.target.value };
                                                        handleUpdate(selectedQuestion.id, 'sourceReferences', newRefs);
                                                    }}
                                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-[10px]"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newRefs = (selectedQuestion.sourceReferences || []).filter((_, i) => i !== idx);
                                                        handleUpdate(selectedQuestion.id, 'sourceReferences', newRefs);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 p-0.5"
                                                >
                                                    <Trash2 size={10} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newRefs = [...(selectedQuestion.sourceReferences || []), { type: 'NCERT' as any, similarity: 'concept' as any }];
                                                handleUpdate(selectedQuestion.id, 'sourceReferences', newRefs);
                                            }}
                                            className="w-full py-1 border border-dashed border-gray-700 rounded text-gray-500 hover:text-gray-300 text-[10px]"
                                        >
                                            <Plus size={10} className="inline mr-1" /> Add Ref
                                        </button>
                                    </div>
                                </details>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-600">
                            <div className="text-center">
                                <MonitorPlay size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Select a question to edit</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Live Preview (35%) */}
                <div className="w-[40%] flex flex-col overflow-hidden bg-gray-950">
                    <div className="p-3 border-b border-gray-800 bg-gray-900/50">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <MonitorPlay size={12} /> Live Preview
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedQuestion ? (
                            <PreviewCard question={selectedQuestion} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600">
                                <p className="text-sm">No question selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple wrapper to safely use the QuestionCard which is complex
import QuestionCard from '../../../components/question-bank/QuestionCard';
import SolutionViewer from '../../../components/question-bank/SolutionViewer';

function PreviewCard({ question }: { question: Question }) {
    return (
        <div className="space-y-4">
            <div className="pointer-events-none">
                <QuestionCard
                    question={question}
                    onAnswerSubmit={() => { }}
                    showFeedback={false}
                    selectedOptionId={null}
                    layout="list"
                />
            </div>

            <div className="border-t border-gray-800 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Solution</h4>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 p-2">
                    <SolutionViewer solution={question.solution} sourceReferences={question.sourceReferences} />
                </div>
            </div>
        </div>
    );
}

