'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Save, AlertCircle, Check, Trash2, Plus, Star, Filter, Calendar, MonitorPlay, Tag, Scale, AlertTriangle, BookOpen, Mic, Eye, Sparkles, CheckSquare, Square, BarChart3, TrendingUp, Zap, ZoomIn, ZoomOut, FileDown, Smartphone, Monitor, LayoutGrid, LayoutList, FileJson, Wand2 } from 'lucide-react';
// uuid removed — display_id is now generated inline
import AnalyticsDashboard from './AnalyticsDashboard';
import ExportDashboard from './components/ExportDashboard';
import { TAXONOMY_FROM_CSV, type TaxonomyNode } from './taxonomy/taxonomyData_from_csv';
import { validateLaTeX, autoFixLatex, getLatexSuggestions, type LaTeXValidationResult } from '@/lib/latexValidator';
import BulkImportModal from './components/BulkImportModal';
import MathRenderer from './components/MathRenderer';
import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from './components/AudioPlayer';
import SVGScaleControls from './components/SVGScaleControls';
import SVGDropZone from './components/SVGDropZone';

// Types
interface Question {
    _id: string;
    display_id: string;
    question_text: {
        markdown: string;
        latex_validated: boolean;
    };
    type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
    options: Array<{
        id: string;
        text: string;
        is_correct: boolean;
        asset_ids?: string[];
    }>;
    answer?: {
        integer_value?: number;
        decimal_value?: number;
        unit?: string;
    };
    solution: {
        text_markdown: string;
        latex_validated: boolean;
        asset_ids?: {
            images?: string[];
            svg?: string[];
            audio?: string[];
        };
    };
    metadata: {
        difficulty: 'Easy' | 'Medium' | 'Hard';
        chapter_id: string;
        tags: Array<{
            tag_id: string;
            weight: number;
        }>;
        exam_source?: {
            exam: string;
            year?: number;
            month?: string;
            day?: number;
            shift?: string;
        };
        is_pyq: boolean;
        is_top_pyq: boolean;
    };
    status: 'draft' | 'review' | 'published' | 'archived';
    quality_score: number;
    version: number;
    created_at: string;
    updated_at: string;
    svg_scales?: Record<string, number>;
    flags?: Array<{
        type: 'latex_error' | 'table_error' | 'mismatch' | 'solution_incorrect' | 'other';
        note: string;
        flagged_at: string;
        resolved: boolean;
    }>;
}

interface Chapter {
    _id: string;
    name: string;
    display_order: number;
    stats: {
        total_questions: number;
    };
}

const QUESTION_TYPES = [
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
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    // svg_scales are loaded from the selected question's DB record
    // Keys: 'question', 'solution', 'option_a', 'option_b', 'option_c', 'option_d'
    const [svgScaleOverrides, setSvgScaleOverrides] = useState<Record<string, number>>({});
    const scaleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [reclassifying, setReclassifying] = useState(false);

    // Bulk selection
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

    // Tag suggestions
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);

    // Analytics
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showExport, setShowExport] = useState(false);

    // Bulk import
    const [showBulkImport, setShowBulkImport] = useState(false);

    // Preview mode: 'desktop' | 'mobile'
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Options layout override: 'auto' | 'grid' | 'list'
    const [optionsLayout, setOptionsLayout] = useState<'auto' | 'grid' | 'list'>('auto');

    // LaTeX auto-fix state
    const [latexFixResult, setLatexFixResult] = useState<{ field: string; fixes: string[] } | null>(null);

    // LaTeX Validation
    const [questionLatexValidation, setQuestionLatexValidation] = useState<LaTeXValidationResult | null>(null);
    const [solutionLatexValidation, setSolutionLatexValidation] = useState<LaTeXValidationResult | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
    const [selectedSourceFilter, setSelectedSourceFilter] = useState('all');
    const [selectedShiftFilter, setSelectedShiftFilter] = useState('all');

    // Filter state (continued)
    const [selectedTopPYQFilter, setSelectedTopPYQFilter] = useState('all');
    const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('all');
    const [selectedTagStatusFilter, setSelectedTagStatusFilter] = useState('all');
    const [selectedYearFilter, setSelectedYearFilter] = useState('all');
    const [selectedPaperFilter, setSelectedPaperFilter] = useState('all');

    // Get chapter-specific tags from taxonomy
    const [availableTags, setAvailableTags] = useState<Array<{ id: string, name: string }>>([]);

    // Flag state
    const [flagModalOpen, setFlagModalOpen] = useState(false);
    const [flagReason, setFlagReason] = useState('latex_error');
    const [flagNote, setFlagNote] = useState('');

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // Helper: get scale for a field from the selected question or local override
    const getSvgScale = (field: string): number => {
        if (svgScaleOverrides[field] !== undefined) return svgScaleOverrides[field];
        const q = questions.find(q => q._id === selectedQuestionId);
        return q?.svg_scales?.[field] ?? 100;
    };

    // Save scale to DB and local state (debounced — only PATCHes 600ms after user stops dragging)
    const handleScaleChange = (questionId: string, field: string, scale: number) => {
        setSvgScaleOverrides(prev => ({ ...prev, [field]: scale }));
        const q = questions.find(q => q._id === questionId);
        const newScales = { ...(q?.svg_scales ?? {}), [field]: scale };
        // Update local questions state immediately
        setQuestions(prev => prev.map(qq =>
            qq._id === questionId ? { ...qq, svg_scales: newScales } : qq
        ));
        // Debounce the PATCH — cancel any pending save and schedule a new one
        if (scaleDebounceRef.current) clearTimeout(scaleDebounceRef.current);
        scaleDebounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/v2/questions/${questionId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ svg_scales: newScales })
                });
                const data = await res.json();
                if (!data.success) {
                    console.error('Scale save failed:', data.error);
                    alert(`Scale save failed: ${data.error}`);
                }
            } catch (e) {
                console.error('Scale save error:', e);
            }
        }, 600);
    };

    // Reset local scale overrides when switching questions
    useEffect(() => {
        setSvgScaleOverrides({});
    }, [selectedQuestionId]);

    // Ref to always hold the latest filteredQuestions without causing hook ordering issues
    const filteredQuestionsRef = useRef<Question[]>([]);

    // Keyboard navigation: ArrowLeft/Up = Prev, ArrowRight/Down = Next
    const handleKeyNav = useCallback((e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedQuestionId(prev => {
                const fq = filteredQuestionsRef.current;
                const idx = fq.findIndex(q => q._id === prev);
                if (idx > 0) return fq[idx - 1]._id;
                return prev;
            });
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedQuestionId(prev => {
                const fq = filteredQuestionsRef.current;
                const idx = fq.findIndex(q => q._id === prev);
                if (idx < fq.length - 1) return fq[idx + 1]._id;
                return prev;
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyNav);
        return () => window.removeEventListener('keydown', handleKeyNav);
    }, [handleKeyNav]);

    useEffect(() => {
        loadData(0);
    }, []);

    // Reload from server when server-side filters change
    useEffect(() => {
        loadData(0);
    }, [selectedChapterFilter, selectedTypeFilter, selectedDifficultyFilter, selectedSourceFilter]);

    // Update available tags when selected question changes
    useEffect(() => {
        const currentQuestion = questions.find(q => q._id === selectedQuestionId);
        if (currentQuestion && currentQuestion.metadata && currentQuestion.metadata.chapter_id) {
            const chapterTags = TAXONOMY_FROM_CSV
                .filter(node => node.parent_id === currentQuestion.metadata.chapter_id && node.type === 'topic')
                .map(tag => ({ id: tag.id, name: tag.name }));
            setAvailableTags(chapterTags);
        } else {
            setAvailableTags([]);
        }
    }, [selectedQuestionId, questions]);

    const PAGE_SIZE = 5000;
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const buildQueryParams = (page: number) => {
        const params = new URLSearchParams();
        params.set('limit', String(PAGE_SIZE));
        params.set('skip', String(page * PAGE_SIZE));
        if (selectedChapterFilter !== 'all') params.set('chapter_id', selectedChapterFilter);
        if (selectedTypeFilter !== 'all') params.set('type', selectedTypeFilter);
        if (selectedDifficultyFilter !== 'all') params.set('difficulty', selectedDifficultyFilter);
        if (selectedSourceFilter === 'mains_pyq' || selectedSourceFilter === 'adv_pyq') params.set('is_pyq', 'true');
        return params.toString();
    };

    const loadData = async (page = 0) => {
        setLoading(true);
        try {
            const [qRes, cRes] = await Promise.all([
                fetch(`/api/v2/questions?${buildQueryParams(page)}`, { cache: 'no-store' }),
                fetch('/api/v2/chapters', { cache: 'no-store' })
            ]);

            // If redirected to login (unauthenticated), send user there — but not on local dev
            const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
            if (!isDev && (qRes.redirected || qRes.url.includes('/login') || qRes.status === 401)) {
                window.location.href = '/login?next=/crucible/admin';
                return;
            }

            const qData = await qRes.json();
            const cData = await cRes.json();

            if (qData.success) {
                setQuestions(qData.data.sort((a: Question, b: Question) => a.display_id.localeCompare(b.display_id)));
                setTotalCount(qData.pagination?.total ?? qData.data.length);
                setCurrentPage(page);
            }
            if (cData.success) setChapters(cData.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async () => {
        const defaultChapter = selectedChapterFilter !== 'all' ? selectedChapterFilter : (chapters[0]?._id || '');

        if (!defaultChapter) {
            alert('Please select a chapter first before adding a question.');
            return;
        }

        // Generate display_id client-side to avoid relying on MongoDB chapters collection
        // Find current max sequence for this chapter prefix
        const CHAPTER_PREFIX_MAP: Record<string, string> = {
            ch11_atom: 'ATOM', ch11_bonding: 'BOND', ch11_chem_eq: 'CEQ', ch11_goc: 'GOC',
            ch11_hydrocarbon: 'HC', ch11_ionic_eq: 'IEQ', ch11_mole: 'MOLE', ch11_pblock: 'PB11',
            ch11_periodic: 'PERI', ch11_prac_org: 'POC', ch11_redox: 'RDX', ch11_thermo: 'THERMO',
            ch12_alcohols: 'ALCO', ch12_amines: 'AMIN', ch12_biomolecules: 'BIO',
            ch12_carbonyl: 'ALDO', ch12_coord: 'CORD', ch12_dblock: 'DNF', ch12_electrochem: 'EC',
            ch12_haloalkanes: 'HALO', ch12_kinetics: 'CK', ch12_pblock: 'PB12', ch12_phenols: 'PHEN',
            ch12_salt: 'SALT', ch12_solutions: 'SOL',
        };
        const prefix = CHAPTER_PREFIX_MAP[defaultChapter] || defaultChapter.split('_').pop()?.toUpperCase().substring(0, 4) || 'QUES';
        // Find current max display_id with this prefix from loaded questions
        const existingNums = questions
            .filter(q => q.display_id?.startsWith(prefix + '-'))
            .map(q => parseInt(q.display_id.split('-')[1], 10))
            .filter(n => !isNaN(n));
        const nextSeq = (existingNums.length > 0 ? Math.max(...existingNums) : 0) + 1;
        const display_id = `${prefix}-${String(nextSeq).padStart(3, '0')}`;

        const newQuestion: Partial<Question> = {
            display_id,
            question_text: { markdown: "New Question Text", latex_validated: false },
            type: 'SCQ',
            options: [
                { id: 'a', text: 'Option A', is_correct: true },
                { id: 'b', text: 'Option B', is_correct: false },
                { id: 'c', text: 'Option C', is_correct: false },
                { id: 'd', text: 'Option D', is_correct: false }
            ],
            solution: { text_markdown: "Solution placeholder - to be written.", latex_validated: false },
            metadata: {
                difficulty: 'Medium',
                chapter_id: defaultChapter,
                tags: [],
                is_pyq: false,
                is_top_pyq: false
            },
            status: 'draft'
        };

        try {
            const res = await fetch('/api/v2/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuestion)
            });
            const data = await res.json();
            if (data.success) {
                await loadData();
                setSelectedQuestionId(data.data._id);
            } else {
                console.error('Add question failed:', data);
                alert(`Failed to add question: ${data.error || 'Unknown error'}${data.detail ? '\n' + data.detail : ''}${data.details ? '\n' + JSON.stringify(data.details) : ''}`);
            }
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Network error while adding question. Check console for details.');
        }
    };

    const handleDelete = async (id: string) => {
        if (deletingId === id) {
            try {
                const res = await fetch(`/api/v2/questions/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    await loadData();
                    if (selectedQuestionId === id) setSelectedQuestionId(null);
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
            setDeletingId(null);
        } else {
            setDeletingId(id);
            setTimeout(() => setDeletingId(null), 3000);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<Question>) => {
        setSavingId(id);
        // Optimistically update local state so UI reflects changes immediately
        setQuestions(prev => prev.map(q => {
            if (q._id !== id) return q;
            return {
                ...q,
                ...(updates.type !== undefined ? { type: updates.type } : {}),
                ...(updates.status !== undefined ? { status: updates.status } : {}),
                ...(updates.question_text ? { question_text: { ...q.question_text, ...updates.question_text } } : {}),
                ...(updates.solution ? { solution: { ...q.solution, ...updates.solution } } : {}),
                ...(updates.options ? { options: updates.options } : {}),
                ...(updates.answer ? { answer: { ...q.answer, ...updates.answer } } : {}),
                ...(updates.metadata ? { metadata: { ...q.metadata, ...updates.metadata } } : {}),
            };
        }));
        try {
            const res = await fetch(`/api/v2/questions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            if (!data.success) {
                console.error('Failed to save:', data);
            }
            return data;
        } catch (error) {
            console.error('Error updating:', error);
            return { success: false, error };
        } finally {
            setTimeout(() => setSavingId(null), 1000);
        }
    };


    const handleBulkTagAssignment = async (chapterId: string, tagId: string) => {
        const questionIds = Array.from(selectedQuestions);
        for (const qId of questionIds) {
            const question = questions.find(q => q._id === qId);
            if (question) {
                await handleUpdate(qId, {
                    metadata: {
                        ...question.metadata,
                        chapter_id: chapterId,
                        tags: tagId ? [{ tag_id: tagId, weight: 1.0 }] : []
                    }
                });
            }
        }
        setSelectedQuestions(new Set());
        setBulkMode(false);
        await loadData();
    };

    const handleAITagSuggestion = async (questionId: string) => {
        setAiAnalyzing(true);
        const question = questions.find(q => q._id === questionId);
        if (!question) return;

        try {
            const res = await fetch('/api/v2/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_text: question.question_text.markdown,
                    solution_text: question.solution.text_markdown
                })
            });
            const data = await res.json();
            if (data.success) {
                setTagSuggestions(data.data.tags || []);
                setShowTagSuggestions(true);
            }
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
        } finally {
            setAiAnalyzing(false);
        }
    };

    const validateTag = (tagId: string, chapterId: string): { valid: boolean; warning?: string } => {
        if (!tagId) return { valid: false, warning: 'Tag is required' };
        if (!tagId.startsWith('tag_')) return { valid: false, warning: 'Tag must start with tag_' };
        // Check if tag belongs to the selected chapter
        const isValidTag = TAXONOMY_FROM_CSV.some(node =>
            node.id === tagId && node.parent_id === chapterId && node.type === 'topic'
        );
        if (!isValidTag) return { valid: true, warning: 'Tag may not belong to this chapter' };
        return { valid: true };
    };

    const handleReclassify = async (questionId: string, newChapterId: string, currentTags: any[]) => {
        if (!newChapterId || reclassifying) return;
        setReclassifying(true);
        try {
            const res = await fetch(`/api/v2/questions/${questionId}/reclassify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_chapter_id: newChapterId, new_tags: [] }),
            });
            const data = await res.json();
            if (data.success) {
                // Update local state: new display_id, chapter_id, clear tags
                setQuestions(prev => prev.map(q =>
                    q._id === questionId
                        ? { ...q, display_id: data.data.new_display_id, metadata: { ...q.metadata, chapter_id: newChapterId, tags: [] } }
                        : q
                ));
                // Refresh available tags for new chapter
                const chapterTags = TAXONOMY_FROM_CSV
                    .filter(node => node.parent_id === newChapterId && node.type === 'topic')
                    .map(tag => ({ id: tag.id, name: tag.name }));
                setAvailableTags(chapterTags);
            } else {
                alert(`Reclassify failed: ${data.error}`);
            }
        } catch (e) {
            alert('Reclassify request failed');
        } finally {
            setReclassifying(false);
        }
    };

    const handleSVGUploaded = (questionId: string, field: 'question' | 'solution', markdownLink: string) => {
        const question = questions.find(q => q._id === questionId);
        if (!question) return;
        if (field === 'question') {
            const newText = question.question_text.markdown
                ? `${question.question_text.markdown}\n${markdownLink}`
                : markdownLink;
            setQuestions(prev => prev.map(q =>
                q._id === questionId
                    ? { ...q, question_text: { ...q.question_text, markdown: newText } }
                    : q
            ));
            handleUpdate(questionId, { question_text: { markdown: newText, latex_validated: false } });
        } else {
            const newText = question.solution.text_markdown
                ? `${question.solution.text_markdown}\n${markdownLink}`
                : markdownLink;
            setQuestions(prev => prev.map(q =>
                q._id === questionId
                    ? { ...q, solution: { ...q.solution, text_markdown: newText } }
                    : q
            ));
            handleUpdate(questionId, { solution: { text_markdown: newText, latex_validated: false } });
        }
    };

    if (loading) return <div className="p-8 text-white">Loading Admin...</div>;

    const selectedQuestion = questions.find(q => q._id === selectedQuestionId);

    // Filter questions
    const filteredQuestions = questions.filter(q => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!q.display_id.toLowerCase().includes(query) &&
                !q.question_text.markdown.toLowerCase().includes(query)) return false;
        }
        if (selectedChapterFilter !== 'all' && q.metadata.chapter_id !== selectedChapterFilter) return false;
        if (selectedTypeFilter !== 'all' && q.type !== selectedTypeFilter) return false;
        if (selectedDifficultyFilter !== 'all' && q.metadata.difficulty !== selectedDifficultyFilter) return false;
        if (selectedSourceFilter !== 'all') {
            const examName = q.metadata?.exam_source?.exam ?? '';
            if (selectedSourceFilter === 'mains_pyq' && !(q.metadata?.is_pyq && examName.toLowerCase().includes('main'))) return false;
            if (selectedSourceFilter === 'adv_pyq' && !(q.metadata?.is_pyq && (examName.toLowerCase().includes('adv') || examName.toLowerCase().includes('advanced')))) return false;
            if (selectedSourceFilter === 'non_pyq' && q.metadata?.is_pyq) return false;
        }
        if (selectedYearFilter !== 'all') {
            const qYear = q.metadata?.exam_source?.year;
            if (!qYear || String(qYear) !== selectedYearFilter) return false;
        }
        if (selectedPaperFilter !== 'all') {
            const es = q.metadata?.exam_source;
            const key = es ? `${es.exam}|${es.year}|${es.month}|${es.day}|${es.shift}` : '';
            if (key !== selectedPaperFilter) return false;
        }
        if (selectedShiftFilter !== 'all') {
            const qShift = q.metadata?.exam_source?.shift ?? '';
            if (qShift.toLowerCase() !== selectedShiftFilter.toLowerCase()) return false;
        }
        if (selectedTopPYQFilter !== 'all') {
            if (selectedTopPYQFilter === 'top' && !q.metadata.is_top_pyq) return false;
            if (selectedTopPYQFilter === 'not-top' && q.metadata.is_top_pyq) return false;
        }
        // Tag Status Filter
        if (selectedTagStatusFilter !== 'all') {
            const hasChapter = !!q.metadata.chapter_id;
            const hasPrimaryTag = q.metadata.tags && q.metadata.tags.length > 0;
            const hasActiveFlags = q.flags?.some(f => !f.resolved);
            if (selectedTagStatusFilter === 'untagged' && hasChapter && hasPrimaryTag) return false;
            if (selectedTagStatusFilter === 'no-chapter' && hasChapter) return false;
            if (selectedTagStatusFilter === 'no-tag' && (!hasChapter || hasPrimaryTag)) return false;
            if (selectedTagStatusFilter === 'flagged' && !hasActiveFlags) return false;
        }
        return true;
    });
    filteredQuestionsRef.current = filteredQuestions;

    // Compute distinct papers from loaded questions for Previous Papers dropdown
    const distinctPapers = Array.from(
        new Map(
            questions
                .filter(q => q.metadata?.exam_source?.year && q.metadata?.exam_source?.day)
                .map(q => {
                    const es = q.metadata.exam_source!;
                    const key = `${es.exam}|${es.year}|${es.month}|${es.day}|${es.shift}`;
                    const label = `${es.exam} ${es.year} ${es.month ?? ''} ${es.day ?? ''} ${es.shift ?? ''}`.trim();
                    return [key, label] as [string, string];
                })
        ).entries()
    ).sort((a, b) => b[0].localeCompare(a[0]));

    // Calculate tag status counts for filter display
    const untaggedCount = questions.filter(q => !q.metadata.chapter_id || !(q.metadata.tags && q.metadata.tags.length > 0)).length;
    const noChapterCount = questions.filter(q => !q.metadata.chapter_id).length;
    const noTagCount = questions.filter(q => q.metadata.chapter_id && !(q.metadata.tags && q.metadata.tags.length > 0)).length;

    const submitFlag = async () => {
        if (!selectedQuestion) return;
        await handleUpdate(selectedQuestion._id, {
            add_flag: { type: flagReason, note: flagNote }
        } as any);
        setFlagModalOpen(false);
        setFlagReason('latex_error');
        setFlagNote('');

        const newFlag = { type: flagReason as any, note: flagNote, flagged_at: new Date().toISOString(), resolved: false };
        setQuestions(prev => prev.map(q =>
            q._id === selectedQuestion._id ? { ...q, flags: [...(q.flags || []), newFlag] } : q
        ));
    };

    const resolveFlags = async () => {
        if (!selectedQuestion) return;
        await handleUpdate(selectedQuestion._id, {
            resolve_flags: true
        } as any);
        setQuestions(prev => prev.map(q =>
            q._id === selectedQuestion._id ? {
                ...q,
                flags: (q.flags || []).map(f => ({ ...f, resolved: true }))
            } : q
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
            {/* TOP BAR — two rows */}
            <header className="shrink-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 shadow-xl">
                {/* Row 1: title + actions + search + Prev/Next + selector + chapter/type filters */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800/40">
                    <h1 className="text-sm font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent shrink-0">
                        Crucible Admin
                    </h1>
                    <span className="text-gray-600 text-xs font-mono shrink-0">{questions.length}/{totalCount}</span>

                    <div className="w-px h-4 bg-gray-700/50 shrink-0" />

                    {/* Icon-only action buttons */}
                    <button onClick={handleAddQuestion} title="Add Question"
                        className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition shrink-0">
                        <Plus size={13} />
                    </button>
                    <button onClick={() => setBulkMode(!bulkMode)} title="Bulk Mode"
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition shrink-0 ${bulkMode ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                            }`}>
                        {bulkMode ? <CheckSquare size={13} /> : <Square size={13} />}
                    </button>
                    <button onClick={() => setShowAnalytics(!showAnalytics)} title="Analytics"
                        className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 rounded-lg transition shrink-0">
                        <BarChart3 size={13} />
                    </button>
                    <button onClick={() => setShowExport(true)} title="Export Practice Sheet"
                        className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-violet-700/60 rounded-lg transition shrink-0">
                        <FileDown size={13} />
                    </button>
                    <button onClick={() => setShowBulkImport(true)} title="Bulk JSON Import"
                        className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-blue-600/60 rounded-lg transition shrink-0">
                        <FileJson size={13} />
                    </button>

                    <div className="w-px h-4 bg-gray-700/50 shrink-0" />

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search ID, Text..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-32 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none shrink-0 placeholder-gray-500"
                    />

                    {/* ── Prev / Next — centred in the bar ── */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            title="Previous question (← or ↑)"
                            onClick={() => {
                                const idx = filteredQuestions.findIndex(q => q._id === selectedQuestionId);
                                if (idx > 0) setSelectedQuestionId(filteredQuestions[idx - 1]._id);
                            }}
                            disabled={!selectedQuestionId || filteredQuestions.findIndex(q => q._id === selectedQuestionId) <= 0}
                            className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition shrink-0"
                        >
                            ← Prev
                        </button>
                        {selectedQuestionId && (
                            <span className="text-xs text-gray-500 font-mono shrink-0">
                                {filteredQuestions.findIndex(q => q._id === selectedQuestionId) + 1}/{filteredQuestions.length}
                            </span>
                        )}
                        <button
                            title="Next question (→ or ↓)"
                            onClick={() => {
                                const idx = filteredQuestions.findIndex(q => q._id === selectedQuestionId);
                                if (idx < filteredQuestions.length - 1) setSelectedQuestionId(filteredQuestions[idx + 1]._id);
                            }}
                            disabled={!selectedQuestionId || filteredQuestions.findIndex(q => q._id === selectedQuestionId) >= filteredQuestions.length - 1}
                            className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition shrink-0"
                        >
                            Next →
                        </button>
                    </div>

                    <div className="w-px h-4 bg-gray-700/50 shrink-0" />

                    {/* Question Selector or Bulk Selection Info */}
                    {bulkMode && selectedQuestions.size > 0 ? (
                        <div className="flex items-center gap-2 px-2 py-1 bg-green-900/20 border border-green-600/50 rounded-lg shrink-0">
                            <CheckSquare size={12} className="text-green-400" />
                            <span className="text-xs font-bold text-green-400">{selectedQuestions.size} sel</span>
                            <select
                                onChange={(e) => {
                                    const chapterId = e.target.value;
                                    if (chapterId && confirm(`Assign ${selectedQuestions.size} questions to this chapter?`)) {
                                        handleBulkTagAssignment(chapterId, '');
                                    }
                                }}
                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
                            >
                                <option value="">Bulk Assign Chapter</option>
                                {chapters.map(ch => (
                                    <option key={ch._id} value={ch._id}>{ch.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setSelectedQuestions(new Set())}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Clear
                            </button>
                        </div>
                    ) : bulkMode ? (
                        <div className="flex-1 max-h-32 overflow-y-auto bg-gray-800/30 border border-gray-700/50 rounded-lg p-2 space-y-1">
                            {filteredQuestions.slice(0, 50).map(q => {
                                const hasChapter = !!q.metadata.chapter_id;
                                const hasPrimaryTag = q.metadata.tags && q.metadata.tags.length > 0;
                                const statusDot = !hasChapter ? '🔴' : !hasPrimaryTag ? '🟡' : '🟢';
                                const src = q.metadata?.exam_source;
                                const srcLabel = src ? ` [${src.exam?.replace('JEE ', '') ?? ''} ${src.year ?? ''} ${src.shift ? src.shift[0] : ''}]` : '';
                                const isSelected = selectedQuestions.has(q._id);
                                return (
                                    <label key={q._id} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-700/30 ${isSelected ? 'bg-green-900/20' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                const newSet = new Set(selectedQuestions);
                                                if (e.target.checked) {
                                                    newSet.add(q._id);
                                                } else {
                                                    newSet.delete(q._id);
                                                }
                                                setSelectedQuestions(newSet);
                                            }}
                                            className="h-3 w-3 accent-green-500"
                                        />
                                        <span className="text-xs text-gray-400 flex-1 truncate">
                                            {statusDot} {q.display_id}{srcLabel}: {q.question_text?.markdown?.substring(0, 35) || "No text"}...
                                        </span>
                                    </label>
                                );
                            })}
                            {filteredQuestions.length > 50 && (
                                <div className="text-xs text-gray-500 text-center py-1">Showing first 50 of {filteredQuestions.length}</div>
                            )}
                        </div>
                    ) : (
                        <select
                            value={selectedQuestionId || ''}
                            onChange={(e) => setSelectedQuestionId(e.target.value || null)}
                            className="w-56 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none shrink-0"
                        >
                            <option value="">Select ({filteredQuestions.length})</option>
                            {filteredQuestions.map(q => {
                                const hasChapter = !!q.metadata.chapter_id;
                                const hasPrimaryTag = q.metadata.tags && q.metadata.tags.length > 0;
                                const statusDot = !hasChapter ? '🔴' : !hasPrimaryTag ? '🟡' : '🟢';
                                const src = q.metadata?.exam_source;
                                const srcLabel = src ? ` [${src.exam?.replace('JEE ', '') ?? ''} ${src.year ?? ''} ${src.shift ? src.shift[0] : ''}]` : '';
                                return (
                                    <option key={q._id} value={q._id}>
                                        {statusDot} {q.display_id}{srcLabel}: {q.question_text?.markdown?.substring(0, 40) || "No text"}...
                                    </option>
                                );
                            })}
                        </select>
                    )}

                    {/* Chapter + Type filters moved to row 1 */}
                    <select
                        value={selectedChapterFilter}
                        onChange={(e) => setSelectedChapterFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Chapters</option>
                        {chapters.map(ch => (
                            <option key={ch._id} value={ch._id}>{ch.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedTypeFilter}
                        onChange={(e) => setSelectedTypeFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Types</option>
                        {QUESTION_TYPES.map(qt => (
                            <option key={qt.id} value={qt.id}>{qt.id}</option>
                        ))}
                    </select>

                    {/* Page navigation */}
                    {totalCount > PAGE_SIZE && (
                        <div className="flex items-center gap-1 shrink-0 ml-auto">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => loadData(currentPage - 1)}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-xs transition"
                            >‹</button>
                            <span className="text-xs text-gray-500 font-mono">{currentPage + 1}/{Math.ceil(totalCount / PAGE_SIZE)}</span>
                            <button
                                disabled={(currentPage + 1) * PAGE_SIZE >= totalCount}
                                onClick={() => loadData(currentPage + 1)}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-xs transition"
                            >›</button>
                        </div>
                    )}

                    {/* Save Status */}
                    {savingId && (
                        <span className="text-xs text-yellow-400 flex items-center gap-1 shrink-0 ml-auto">
                            <Save size={12} className="animate-spin" /> Saving...
                        </span>
                    )}
                </div>

                {/* Row 2: secondary filters — Difficulty, Source, Year, Shift, PYQ, Tags */}
                <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as any}>
                    <Filter size={11} className="text-purple-400 shrink-0" />
                    <select
                        value={selectedDifficultyFilter}
                        onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select
                        value={selectedSourceFilter}
                        onChange={(e) => { setSelectedSourceFilter(e.target.value); setSelectedShiftFilter('all'); }}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Sources</option>
                        <option value="mains_pyq">JEE Main</option>
                        <option value="adv_pyq">JEE Adv</option>
                        <option value="non_pyq">Non-PYQ</option>
                    </select>
                    <select
                        value={selectedYearFilter}
                        onChange={(e) => setSelectedYearFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Years</option>
                        {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(y => (
                            <option key={y} value={String(y)}>{y}</option>
                        ))}
                    </select>
                    <select
                        value={selectedShiftFilter}
                        onChange={(e) => setSelectedShiftFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Shifts</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                    </select>
                    <select
                        value={selectedPaperFilter}
                        onChange={(e) => setSelectedPaperFilter(e.target.value)}
                        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedPaperFilter !== 'all' ? 'border-purple-500 text-purple-300' : 'border-gray-700/50'
                            }`}
                    >
                        <option value="all">📄 All Papers</option>
                        {distinctPapers.map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <select
                        value={selectedTopPYQFilter}
                        onChange={(e) => setSelectedTopPYQFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All PYQ</option>
                        <option value="top">⭐ Top</option>
                        <option value="not-top">Other</option>
                    </select>
                    <select
                        value={selectedTagStatusFilter}
                        onChange={(e) => setSelectedTagStatusFilter(e.target.value)}
                        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs outline-none ${selectedTagStatusFilter !== 'all' ? 'border-red-500 text-red-300' : 'border-gray-700/50'
                            }`}
                    >
                        <option value="all">Tags ✓</option>
                        <option value="untagged">⚠ Untagged ({untaggedCount})</option>
                        <option value="no-chapter">🔴 No Chapter ({noChapterCount})</option>
                        <option value="no-tag">🟡 No Tag ({noTagCount})</option>
                        <option value="flagged">🚨 Flagged ({questions.filter(q => q.flags?.some(f => !f.resolved)).length})</option>
                    </select>
                    {(selectedChapterFilter !== 'all' || selectedTypeFilter !== 'all' || selectedSourceFilter !== 'all' || selectedTopPYQFilter !== 'all' || selectedDifficultyFilter !== 'all' || selectedTagStatusFilter !== 'all' || selectedYearFilter !== 'all' || selectedShiftFilter !== 'all' || selectedPaperFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSelectedChapterFilter('all');
                                setSelectedTypeFilter('all');
                                setSelectedSourceFilter('all');
                                setSelectedTopPYQFilter('all');
                                setSelectedDifficultyFilter('all');
                                setSelectedTagStatusFilter('all');
                                setSelectedYearFilter('all');
                                setSelectedShiftFilter('all');
                                setSelectedPaperFilter('all');
                            }}
                            className="shrink-0 text-xs text-red-400 hover:text-red-300 px-2"
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
            </header>

            {/* MAIN AREA: 54/46 split */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT: Editor (54%) */}
                <div className="w-[54%] flex flex-col overflow-hidden border-r border-gray-800/50">
                    {selectedQuestion ? (
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {/* Header Row */}
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-800/50">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-1">Display ID</span>
                                    <input
                                        type="text"
                                        value={selectedQuestion.display_id}
                                        readOnly
                                        className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-1.5 text-sm font-mono focus:border-purple-500 outline-none w-32 text-purple-400"
                                    />
                                </div>

                                <select
                                    value={selectedQuestion.type}
                                    onChange={(e) => {
                                        const newType = e.target.value as Question['type'];
                                        const oldType = selectedQuestion.type;
                                        if (newType === oldType) return;

                                        // Build the update payload with appropriate options/answer based on new type
                                        const update: Partial<Question> = { type: newType };

                                        if (newType === 'NVT') {
                                            // Switching TO NVT: clear options, set default numerical answer
                                            update.options = [] as any;
                                            update.answer = { integer_value: 0 } as any;
                                        } else if (oldType === 'NVT' || !selectedQuestion.options || selectedQuestion.options.length === 0) {
                                            // Switching FROM NVT or question has no options: provide 4 default options
                                            update.options = [
                                                { id: 'a', text: 'Option A', is_correct: newType === 'SCQ' },
                                                { id: 'b', text: 'Option B', is_correct: false },
                                                { id: 'c', text: 'Option C', is_correct: false },
                                                { id: 'd', text: 'Option D', is_correct: false }
                                            ] as any;
                                            // Clear numerical answer when moving away from NVT
                                            update.answer = {} as any;
                                        }
                                        // For MCQ, ensure we don't force single-correct constraints
                                        // For types that already have options (e.g., SCQ→MCQ), keep existing options

                                        handleUpdate(selectedQuestion._id, update);
                                    }}
                                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm font-medium"
                                >
                                    {QUESTION_TYPES.map(qt => (
                                        <option key={qt.id} value={qt.id}>{qt.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedQuestion.metadata.difficulty}
                                    onChange={(e) => handleUpdate(selectedQuestion._id, {
                                        metadata: { ...selectedQuestion.metadata, difficulty: e.target.value as any }
                                    })}
                                    className={`bg-gray-800/50 border rounded-lg px-3 py-2 text-sm font-medium ${selectedQuestion.metadata.difficulty === 'Hard' ? 'border-red-500/50 text-red-400' :
                                        selectedQuestion.metadata.difficulty === 'Medium' ? 'border-orange-500/50 text-orange-400' :
                                            'border-emerald-500/50 text-emerald-400'
                                        }`}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>

                                <div className="flex items-center gap-3 ml-auto">
                                    <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestion.metadata.is_pyq}
                                            onChange={(e) => handleUpdate(selectedQuestion._id, {
                                                metadata: { ...selectedQuestion.metadata, is_pyq: e.target.checked }
                                            })}
                                            className="h-4 w-4 accent-blue-500"
                                        />
                                        <span className="text-xs text-gray-300 font-medium">PYQ</span>
                                    </label>

                                    <button
                                        onClick={() => handleUpdate(selectedQuestion._id, {
                                            metadata: { ...selectedQuestion.metadata, is_top_pyq: !selectedQuestion.metadata.is_top_pyq }
                                        })}
                                        className={`p-2 rounded-lg transition ${selectedQuestion.metadata.is_top_pyq
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : 'bg-gray-800/50 text-gray-500 hover:text-amber-400'
                                            }`}
                                    >
                                        <Star size={18} fill={selectedQuestion.metadata.is_top_pyq ? "currentColor" : "none"} />
                                    </button>

                                    <button
                                        onClick={() => setFlagModalOpen(true)}
                                        className={`p-2 rounded-lg transition ${selectedQuestion.flags?.some(f => !f.resolved)
                                            ? 'bg-red-500/20 text-red-500'
                                            : 'bg-gray-800/50 text-gray-500 hover:text-red-400'
                                            }`}
                                        title="Flag Question"
                                    >
                                        <AlertTriangle size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedQuestion._id)}
                                        className={`p-2 rounded-lg transition ${deletingId === selectedQuestion._id
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-800/50 text-gray-500 hover:text-red-400'
                                            }`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Exam Source Row */}
                            <div className="flex flex-wrap items-end gap-3 p-3 bg-gray-800/30 border border-gray-700/40 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedQuestion.metadata.is_pyq}
                                            onChange={(e) => handleUpdate(selectedQuestion._id, {
                                                metadata: { ...selectedQuestion.metadata, is_pyq: e.target.checked }
                                            })}
                                            className="h-3.5 w-3.5 accent-blue-500"
                                        />
                                        <span className="text-xs text-gray-400 font-medium">PYQ</span>
                                    </label>
                                </div>
                                {selectedQuestion.metadata.is_pyq && (
                                    <>
                                        {(() => {
                                            const es = selectedQuestion.metadata.exam_source;
                                            const patchSrc = (patch: Partial<{ exam: string; year: number; month: string; day: number; shift: string }>) => {
                                                const merged = { exam: es?.exam ?? '', year: es?.year, month: es?.month, day: es?.day, shift: es?.shift, ...patch };
                                                handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, exam_source: { ...merged, exam: merged.exam } } });
                                            };
                                            return (
                                                <>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">Exam</label>
                                                        <select value={es?.exam ?? ''} onChange={(e) => patchSrc({ exam: e.target.value })} className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none">
                                                            <option value="">Select</option>
                                                            <option value="JEE Main">JEE Main</option>
                                                            <option value="JEE Advanced">JEE Advanced</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">Year</label>
                                                        <select value={es?.year ?? ''} onChange={(e) => patchSrc({ year: Number(e.target.value) })} className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none">
                                                            <option value="">Year</option>
                                                            {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map(y => (
                                                                <option key={y} value={y}>{y}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">Month</label>
                                                        <select value={es?.month ?? ''} onChange={(e) => patchSrc({ month: e.target.value })} className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none">
                                                            <option value="">Month</option>
                                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                                <option key={m} value={m}>{m}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">Day</label>
                                                        <input type="number" min={1} max={31} value={es?.day ?? ''} onChange={(e) => patchSrc({ day: Number(e.target.value) })} className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none w-14" placeholder="Day" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">Shift</label>
                                                        <select value={es?.shift ?? ''} onChange={(e) => patchSrc({ shift: e.target.value })} className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none">
                                                            <option value="">Shift</option>
                                                            <option value="Morning">Morning</option>
                                                            <option value="Evening">Evening</option>
                                                        </select>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </>
                                )}
                                {selectedQuestion.metadata.is_pyq && selectedQuestion.metadata.exam_source?.exam && (
                                    <span className="ml-auto text-[10px] font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                                        {selectedQuestion.metadata.exam_source.exam} {selectedQuestion.metadata.exam_source.year} {selectedQuestion.metadata.exam_source.month} {selectedQuestion.metadata.exam_source.day} · {selectedQuestion.metadata.exam_source.shift}
                                    </span>
                                )}
                            </div>

                            {/* Tag Status Indicator */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border-2 ${
                                !selectedQuestion.metadata.chapter_id 
                                    ? 'bg-red-900/20 border-red-600/50' 
                                    : !(selectedQuestion.metadata.tags && selectedQuestion.metadata.tags.length > 0)
                                    ? 'bg-yellow-900/20 border-yellow-600/50'
                                    : 'bg-green-900/20 border-green-600/50'
                            }">
                                <div className="flex items-center gap-2">
                                    {!selectedQuestion.metadata.chapter_id ? (
                                        <><AlertTriangle size={16} className="text-red-400" /><span className="text-xs font-bold text-red-400">Missing Chapter</span></>
                                    ) : !(selectedQuestion.metadata.tags && selectedQuestion.metadata.tags.length > 0) ? (
                                        <><AlertCircle size={16} className="text-yellow-400" /><span className="text-xs font-bold text-yellow-400">Missing Primary Tag</span></>
                                    ) : (
                                        <><Check size={16} className="text-green-400" /><span className="text-xs font-bold text-green-400">Fully Tagged</span></>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAITagSuggestion(selectedQuestion._id)}
                                    disabled={aiAnalyzing}
                                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                                >
                                    <Sparkles size={12} /> {aiAnalyzing ? 'Analyzing...' : 'AI Suggest Tags'}
                                </button>
                            </div>

                            {/* AI Tag Suggestions */}
                            {showTagSuggestions && tagSuggestions.length > 0 && (
                                <div className="p-4 bg-purple-900/20 border border-purple-600/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-purple-400">AI Suggested Tags:</span>
                                        <button onClick={() => setShowTagSuggestions(false)} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tagSuggestions.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    handleUpdate(selectedQuestion._id, {
                                                        metadata: { ...selectedQuestion.metadata, tags: [{ tag_id: tag, weight: 1.0 }] }
                                                    });
                                                    setShowTagSuggestions(false);
                                                }}
                                                className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg text-xs font-mono text-purple-300 transition"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chapter and Tag Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                        Chapter
                                        {reclassifying && <span className="text-purple-400 text-[10px] animate-pulse">● Reclassifying…</span>}
                                    </label>
                                    <select
                                        value={selectedQuestion.metadata.chapter_id}
                                        disabled={reclassifying}
                                        onChange={(e) => {
                                            const newChapterId = e.target.value;
                                            if (!newChapterId || newChapterId === selectedQuestion.metadata.chapter_id) return;
                                            handleReclassify(selectedQuestion._id, newChapterId, selectedQuestion.metadata.tags);
                                        }}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        <option value="">Select Chapter</option>
                                        {chapters.map(ch => (
                                            <option key={ch._id} value={ch._id}>{ch.name}</option>
                                        ))}
                                    </select>
                                    {selectedQuestion.display_id && (
                                        <p className="text-[10px] text-gray-600 mt-1 font-mono">
                                            ID: <span className="text-purple-400">{selectedQuestion.display_id}</span> — changes on reclassify
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                                        <span>Primary Concept Tag</span>
                                        {selectedQuestion.metadata.tags?.[0]?.tag_id && (() => {
                                            const validation = validateTag(selectedQuestion.metadata.tags![0].tag_id, selectedQuestion.metadata.chapter_id);
                                            return validation.warning ? (
                                                <span className="text-xs text-yellow-400 flex items-center gap-1">
                                                    <AlertCircle size={10} /> {validation.warning}
                                                </span>
                                            ) : null;
                                        })()}
                                    </label>
                                    <select
                                        value={selectedQuestion.metadata.tags?.[0]?.tag_id || ''}
                                        onChange={(e) => handleUpdate(selectedQuestion._id, {
                                            metadata: {
                                                ...selectedQuestion.metadata,
                                                tags: e.target.value ? [{ tag_id: e.target.value, weight: 1.0 }] : []
                                            }
                                        })}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-purple-300 focus:border-purple-500 outline-none font-mono"
                                    >
                                        <option value="">Select Tag</option>
                                        {TAXONOMY_FROM_CSV
                                            .filter(node => node.parent_id === selectedQuestion.metadata.chapter_id && node.type === 'topic')
                                            .map(tag => (
                                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                                            ))
                                        }
                                    </select>
                                    {availableTags.length === 0 && selectedQuestion.metadata.chapter_id && (
                                        <p className="text-[10px] text-yellow-600 mt-1">No tags found for this chapter in taxonomy</p>
                                    )}
                                </div>
                            </div>

                            {/* Active flags warning */}
                            {selectedQuestion.flags?.some(f => !f.resolved) && (
                                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex flex-col gap-2 relative">
                                    <button onClick={resolveFlags} className="absolute top-2 right-2 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-200 text-[10px] font-bold uppercase tracking-wider rounded transition">Resolve All</button>
                                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                                        <AlertTriangle size={14} /> Active Flags
                                    </h4>
                                    <div className="space-y-2 mt-2">
                                        {selectedQuestion.flags.filter(f => !f.resolved).map((f, i) => (
                                            <div key={i} className="text-sm bg-red-950/40 p-2 rounded">
                                                <div className="font-bold text-red-300 capitalize">{f.type.replace('_', ' ')}</div>
                                                <div className="text-red-200">{f.note}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Question Text with SVG Upload */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs text-gray-500 font-medium">
                                        Question Text {savingId === selectedQuestion._id ? '• Saving…' : ''}
                                    </label>
                                    <button
                                        onClick={() => {
                                            const result = autoFixLatex(selectedQuestion.question_text.markdown);
                                            if (result.fixesApplied.length === 0) { alert('No auto-fixable issues found.'); return; }
                                            setQuestions(prev => prev.map(q =>
                                                q._id === selectedQuestion._id
                                                    ? { ...q, question_text: { ...q.question_text, markdown: result.text } }
                                                    : q
                                            ));
                                            handleUpdate(selectedQuestion._id, { question_text: { markdown: result.text, latex_validated: false } });
                                            setLatexFixResult({ field: 'question', fixes: result.fixesApplied });
                                            setTimeout(() => setLatexFixResult(null), 5000);
                                        }}
                                        title="Auto-fix LaTeX issues"
                                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-600/30 transition"
                                    >
                                        <Wand2 size={10} /> Auto-fix LaTeX
                                    </button>
                                </div>
                                {latexFixResult?.field === 'question' && (
                                    <div className="mb-2 text-[11px] text-green-400 bg-green-900/20 border border-green-600/30 rounded-lg px-3 py-2 space-y-0.5">
                                        {latexFixResult.fixes.map((f, i) => <div key={i}>✓ {f}</div>)}
                                    </div>
                                )}
                                <div className="flex gap-3 items-stretch">
                                    <textarea
                                        value={selectedQuestion.question_text.markdown}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setQuestions(prev => prev.map(q =>
                                                q._id === selectedQuestion._id
                                                    ? { ...q, question_text: { ...q.question_text, markdown: newValue } }
                                                    : q
                                            ));
                                        }}
                                        onBlur={(e) => {
                                            handleUpdate(selectedQuestion._id, {
                                                question_text: { markdown: e.target.value, latex_validated: false }
                                            });
                                        }}
                                        className="flex-1 bg-gray-800/70 border-2 border-gray-600/70 rounded-lg px-4 py-3 text-base leading-relaxed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 hover:border-gray-500 outline-none resize-y font-mono min-h-[16rem] text-gray-100"
                                        placeholder="✏️ Click here to edit question text... (LaTeX: use $...$ only, never $$...$$)"
                                    />
                                    <div className="w-32 shrink-0 flex flex-col gap-2">
                                        <SVGDropZone
                                            questionId={selectedQuestion._id}
                                            fieldType="question"
                                            onUploaded={(markdownLink) => handleSVGUploaded(selectedQuestion._id, 'question', markdownLink)}
                                        />
                                        <SVGScaleControls
                                            step={5}
                                            initialScale={getSvgScale('question')}
                                            onScaleChange={(scale) => handleScaleChange(selectedQuestion._id, 'question', scale)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shared SVG drop zone for options — drag here, copy link, paste into option */}
                            {selectedQuestion.type !== 'NVT' && (
                                <div className="rounded-lg border border-dashed border-gray-700/40 bg-gray-800/20 px-3 py-2">
                                    <p className="text-[10px] text-gray-500 mb-2 font-medium uppercase tracking-wide">Option SVG — drop here → copy link → paste into option text</p>
                                    <SVGDropZone
                                        questionId={selectedQuestion._id}
                                        fieldType="question"
                                        onUploaded={(markdownLink) => {
                                            navigator.clipboard.writeText(markdownLink);
                                        }}
                                        compact={true}
                                    />
                                </div>
                            )}

                            {/* Options or Numerical Answer */}
                            {selectedQuestion.type !== 'NVT' ? (
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block font-medium">
                                        Options {selectedQuestion.type === 'MCQ' && <span className="text-yellow-400 ml-1">(multiple correct)</span>}
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedQuestion.options.filter(opt => opt && opt.id).map((opt) => (
                                            <div
                                                key={opt.id}
                                                className={`p-3 rounded-lg border-2 transition ${opt.is_correct
                                                    ? 'bg-green-900/20 border-green-600/50'
                                                    : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <button
                                                        onClick={() => {
                                                            let newOptions;
                                                            if (selectedQuestion.type === 'MCQ') {
                                                                // MCQ: toggle this option's is_correct (checkbox)
                                                                newOptions = selectedQuestion.options.map(o => ({
                                                                    ...o,
                                                                    is_correct: o.id === opt.id ? !o.is_correct : o.is_correct
                                                                }));
                                                            } else {
                                                                // SCQ/AR/MST/MTC: exclusive (radio) — only this one is correct
                                                                newOptions = selectedQuestion.options.map(o => ({
                                                                    ...o,
                                                                    is_correct: o.id === opt.id
                                                                }));
                                                            }
                                                            setQuestions(prev => prev.map(q =>
                                                                q._id === selectedQuestion._id
                                                                    ? { ...q, options: newOptions }
                                                                    : q
                                                            ));
                                                            handleUpdate(selectedQuestion._id, { options: newOptions });
                                                        }}
                                                        className={`text-xs font-bold px-2 py-1 rounded-lg transition ${opt.is_correct
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                                                            }`}
                                                    >
                                                        {opt.id.toUpperCase()} {opt.is_correct ? '✓' : '○'}
                                                    </button>
                                                    {!opt.is_correct && (
                                                        <span className="text-xs text-gray-500">
                                                            {selectedQuestion.type === 'MCQ' ? 'click to toggle' : 'click to mark correct'}
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => {
                                                        const newOptions = selectedQuestion.options.map(o =>
                                                            o.id === opt.id ? { ...o, text: e.target.value } : o
                                                        );
                                                        setQuestions(prev => prev.map(q =>
                                                            q._id === selectedQuestion._id
                                                                ? { ...q, options: newOptions }
                                                                : q
                                                        ));
                                                    }}
                                                    onBlur={(e) => {
                                                        const newOptions = selectedQuestion.options.map(o =>
                                                            o.id === opt.id ? { ...o, text: e.target.value } : o
                                                        );
                                                        handleUpdate(selectedQuestion._id, { options: newOptions });
                                                    }}
                                                    className="w-full bg-gray-900/50 border border-gray-700/50 rounded px-2 py-1.5 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 hover:border-gray-600 font-mono mb-2 text-gray-100"
                                                    placeholder="✏️ Click to edit option text..."
                                                />
                                                <SVGScaleControls
                                                    compact={true}
                                                    step={5}
                                                    initialScale={getSvgScale(`option_${opt.id}`)}
                                                    onScaleChange={(scale) => handleScaleChange(selectedQuestion._id, `option_${opt.id}`, scale)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block font-medium">Numerical Answer</label>
                                    <input
                                        type="text"
                                        value={
                                            selectedQuestion.answer?.integer_value !== undefined
                                                ? selectedQuestion.answer.integer_value
                                                : selectedQuestion.answer?.decimal_value !== undefined
                                                    ? selectedQuestion.answer.decimal_value
                                                    : ''
                                        }
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            const num = parseFloat(raw);
                                            const isDecimal = raw.includes('.');
                                            const answerUpdate = isNaN(num)
                                                ? {}
                                                : isDecimal
                                                    ? { decimal_value: num }
                                                    : { integer_value: num };
                                            setQuestions(prev => prev.map(q =>
                                                q._id === selectedQuestion._id
                                                    ? { ...q, answer: { ...q.answer, ...answerUpdate } }
                                                    : q
                                            ));
                                        }}
                                        onBlur={(e) => {
                                            const raw = e.target.value;
                                            const num = parseFloat(raw);
                                            if (isNaN(num) || raw.trim() === '') return;
                                            const isDecimal = raw.includes('.');
                                            const answerUpdate = isDecimal
                                                ? { decimal_value: num }
                                                : { integer_value: num };
                                            handleUpdate(selectedQuestion._id, {
                                                answer: { ...selectedQuestion.answer, ...answerUpdate }
                                            });
                                        }}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-2xl font-bold text-blue-400 focus:border-purple-500 outline-none"
                                        placeholder="Enter numerical answer"
                                    />
                                </div>
                            )}

                            {/* Solution with SVG Upload */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs text-gray-500 font-medium">
                                        Solution {savingId === selectedQuestion._id ? '• Saving…' : ''}
                                    </label>
                                    <button
                                        onClick={() => {
                                            const sol = selectedQuestion.solution?.text_markdown || '';
                                            const result = autoFixLatex(sol);
                                            if (result.fixesApplied.length === 0) { alert('No auto-fixable issues found.'); return; }
                                            setQuestions(prev => prev.map(q =>
                                                q._id === selectedQuestion._id
                                                    ? { ...q, solution: { ...(q.solution || { text_markdown: '', latex_validated: false }), text_markdown: result.text } }
                                                    : q
                                            ));
                                            handleUpdate(selectedQuestion._id, { solution: { text_markdown: result.text, latex_validated: false } });
                                            setLatexFixResult({ field: 'solution', fixes: result.fixesApplied });
                                            setTimeout(() => setLatexFixResult(null), 5000);
                                        }}
                                        title="Auto-fix LaTeX issues in solution"
                                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-600/30 transition"
                                    >
                                        <Wand2 size={10} /> Auto-fix LaTeX
                                    </button>
                                </div>
                                {latexFixResult?.field === 'solution' && (
                                    <div className="mb-2 text-[11px] text-green-400 bg-green-900/20 border border-green-600/30 rounded-lg px-3 py-2 space-y-0.5">
                                        {latexFixResult.fixes.map((f, i) => <div key={i}>✓ {f}</div>)}
                                    </div>
                                )}
                                <div className="flex gap-3 items-stretch">
                                    <textarea
                                        value={selectedQuestion.solution?.text_markdown || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setQuestions(prev => prev.map(q =>
                                                q._id === selectedQuestion._id
                                                    ? { ...q, solution: { ...(q.solution || { text_markdown: '', latex_validated: false }), text_markdown: newValue } }
                                                    : q
                                            ));
                                        }}
                                        onBlur={(e) => {
                                            handleUpdate(selectedQuestion._id, {
                                                solution: { text_markdown: e.target.value, latex_validated: false }
                                            });
                                        }}
                                        className="flex-1 bg-gray-800/70 border-2 border-gray-600/70 rounded-lg px-4 py-3 text-base leading-relaxed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 hover:border-gray-500 outline-none resize-y font-mono min-h-[20rem] text-gray-100"
                                        placeholder="✏️ Click here to edit solution... (Use **Step 1:** for bold, $$...$$ for equations)"
                                    />
                                    <div className="w-32 shrink-0 flex flex-col gap-2">
                                        <SVGDropZone
                                            questionId={selectedQuestion._id}
                                            fieldType="solution"
                                            onUploaded={(markdownLink) => handleSVGUploaded(selectedQuestion._id, 'solution', markdownLink)}
                                        />
                                        <SVGScaleControls
                                            step={5}
                                            initialScale={getSvgScale('solution')}
                                            onScaleChange={(scale) => handleScaleChange(selectedQuestion._id, 'solution', scale)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Audio Recording */}
                            <AudioRecorder
                                questionId={selectedQuestion._id}
                                onAudioSaved={(url) => {
                                    handleUpdate(selectedQuestion._id, {
                                        solution: {
                                            ...(selectedQuestion.solution || { text_markdown: '', latex_validated: false }),
                                            asset_ids: {
                                                ...(selectedQuestion.solution?.asset_ids || {}),
                                                audio: [...(selectedQuestion.solution?.asset_ids?.audio || []), url]
                                            }
                                        }
                                    });
                                }}
                                existingAudioUrl={selectedQuestion.solution?.asset_ids?.audio?.[0]}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-600">
                            <div className="text-center">
                                <MonitorPlay size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="text-sm">Select a question to edit</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Live Preview (46%) */}
                <div className="w-[46%] flex flex-col overflow-hidden bg-gray-950/50">
                    <div className="p-3 border-b border-gray-800/50 bg-gray-900/50 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={14} /> Live Preview
                        </h3>
                        <div className="flex items-center gap-2">
                            {/* Options layout toggle */}
                            {selectedQuestion && selectedQuestion.type !== 'NVT' && (
                                <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setOptionsLayout('list')}
                                        title="List layout"
                                        className={`p-1.5 rounded-md transition ${optionsLayout === 'list' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    ><LayoutList size={13} /></button>
                                    <button
                                        onClick={() => setOptionsLayout('auto')}
                                        title="Auto layout (smart)"
                                        className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${optionsLayout === 'auto' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >AUTO</button>
                                    <button
                                        onClick={() => setOptionsLayout('grid')}
                                        title="2×2 grid layout"
                                        className={`p-1.5 rounded-md transition ${optionsLayout === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    ><LayoutGrid size={13} /></button>
                                </div>
                            )}
                            {/* Mobile / Desktop toggle */}
                            <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-0.5">
                                <button
                                    onClick={() => setPreviewMode('desktop')}
                                    title="Desktop preview"
                                    className={`p-1.5 rounded-md transition ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                ><Monitor size={13} /></button>
                                <button
                                    onClick={() => setPreviewMode('mobile')}
                                    title="Mobile preview"
                                    className={`p-1.5 rounded-md transition ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                ><Smartphone size={13} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex justify-center">
                        {selectedQuestion ? (
                            <div className={`space-y-4 transition-all duration-300 ${
                                previewMode === 'mobile'
                                    ? 'w-[390px] border border-gray-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-gray-900'
                                    : 'w-full'
                            }`}>
                                {previewMode === 'mobile' && (
                                    <div className="flex items-center justify-center gap-1 py-2 bg-gray-950/80 border-b border-gray-800">
                                        <div className="w-16 h-1 bg-gray-600 rounded-full" />
                                    </div>
                                )}
                                {/* Question Preview */}
                                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${ previewMode === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs font-mono text-purple-400">{selectedQuestion.display_id}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${QUESTION_TYPES.find(t => t.id === selectedQuestion.type)?.color
                                            }`}>
                                            {selectedQuestion.type}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${selectedQuestion.metadata.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                                            selectedQuestion.metadata.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {selectedQuestion.metadata.difficulty}
                                        </span>
                                    </div>
                                    <MathRenderer
                                        markdown={selectedQuestion.question_text.markdown}
                                        className="text-gray-300"
                                        fontSize={20}
                                        imageScale={getSvgScale('question')}
                                    />
                                    {selectedQuestion.type !== 'NVT' && (() => {
                                        const hasImages = selectedQuestion.options.some(opt =>
                                            opt.text.includes('![') || opt.text.includes('<img') || opt.text.includes('.svg') || opt.text.includes('.png')
                                        );
                                        const maxTextLength = Math.max(...selectedQuestion.options.map(opt => opt.text.length));
                                        const avgTextLength = selectedQuestion.options.reduce((sum, opt) => sum + opt.text.length, 0) / selectedQuestion.options.length;
                                        const autoGrid = hasImages || (avgTextLength < 20 && maxTextLength < 25);
                                        // On mobile preview, grid is only 2 cols for truly short/image options
                                        const useGrid = optionsLayout === 'grid'
                                            ? true
                                            : optionsLayout === 'list'
                                                ? false
                                                : (previewMode === 'mobile' ? (hasImages || (avgTextLength < 15 && maxTextLength < 18)) : autoGrid);

                                        return (
                                            <div className={`mt-4 ${useGrid
                                                ? 'grid grid-cols-2 gap-3'
                                                : 'space-y-2'
                                                }`}>
                                                {selectedQuestion.options.map(opt => (
                                                    <div key={opt.id} className="flex items-center gap-3">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${opt.is_correct
                                                            ? 'bg-green-600/30 text-green-300 border border-green-500/60'
                                                            : 'bg-gray-700/40 text-gray-300 border border-gray-600/60'
                                                            }`}>
                                                            {opt.id.toUpperCase()}
                                                        </div>
                                                        <div className={`flex-1 p-3 rounded-lg border ${opt.is_correct
                                                            ? 'bg-green-900/20 border-green-600/50'
                                                            : 'bg-gray-800/30 border-gray-700/50'
                                                            }`}>
                                                            <MathRenderer
                                                                markdown={opt.text}
                                                                className="text-gray-300 option-text"
                                                                fontSize={20}
                                                                imageScale={getSvgScale(`option_${opt.id}`)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Solution Preview */}
                                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${ previewMode === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Solution</h4>
                                    {/* Audio Player — shown when audio is attached */}
                                    {selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0 && (
                                        <div className="mb-4 space-y-2">
                                            {selectedQuestion.solution.asset_ids.audio.map((url, idx) => (
                                                url ? <AudioPlayer key={idx} src={url} label={`Audio Note${selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}`} /> : null
                                            ))}
                                        </div>
                                    )}
                                    <MathRenderer
                                        markdown={selectedQuestion.solution?.text_markdown || ''}
                                        className="text-gray-300 solution-text"
                                        fontSize={20}
                                        imageScale={getSvgScale('solution')}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600">
                                <p className="text-sm">No question selected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard Modal */}
            {showAnalytics && (
                <AnalyticsDashboard
                    questions={questions}
                    chapters={chapters}
                    onClose={() => setShowAnalytics(false)}
                />
            )}

            {/* Bulk Import Modal */}
            {showBulkImport && (
                <BulkImportModal
                    onClose={() => setShowBulkImport(false)}
                    onImported={(count) => { setShowBulkImport(false); loadData(0); }}
                    defaultChapterId={selectedChapterFilter !== 'all' ? selectedChapterFilter : ''}
                />
            )}

            {/* Export Dashboard Modal */}
            {showExport && (
                <ExportDashboard
                    questions={questions}
                    initialSelected={bulkMode && selectedQuestions.size > 0 ? selectedQuestions : undefined}
                    onClose={() => setShowExport(false)}
                />
            )}

            {/* Flag Modal */}
            {flagModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={20} /> Flag Question
                            </h2>
                            <button onClick={() => setFlagModalOpen(false)} className="text-gray-500 hover:text-white transition">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Issue Type</label>
                                <select
                                    value={flagReason}
                                    onChange={(e) => setFlagReason(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white"
                                >
                                    <option value="latex_error">LaTeX not rendering properly</option>
                                    <option value="table_error">Table formatting issue</option>
                                    <option value="mismatch">Question text/options mismatch</option>
                                    <option value="solution_incorrect">Solution is incorrect</option>
                                    <option value="other">Other issue</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Remarks (Optional)</label>
                                <textarea
                                    value={flagNote}
                                    onChange={(e) => setFlagNote(e.target.value)}
                                    placeholder="Add specific details for the content team..."
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none text-white resize-y min-h-[100px]"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
                            <button onClick={() => setFlagModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition">Cancel</button>
                            <button onClick={submitFlag} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-red-900/20">Submit Flag</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

