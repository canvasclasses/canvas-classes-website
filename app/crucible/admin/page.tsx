'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, AlertCircle, Check, Trash2, Plus, Star, Filter, Calendar, MonitorPlay, Tag, Scale, AlertTriangle, BookOpen, Mic, Eye, Sparkles, CheckSquare, Square, BarChart3, TrendingUp, Zap, ZoomIn, ZoomOut, FileDown, Smartphone, Monitor, LayoutGrid, LayoutList, FileJson, Wand2, Library, Info, Volume2, ChevronDown, ChevronUp, Shield } from 'lucide-react';
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
import VideoDropZone from './components/VideoDropZone';
import RoleManagement from './components/RoleManagement';
import MockTestsAdmin from './components/MockTestsAdmin';
import FlagsDashboard from './components/FlagsDashboard';
import { usePermissions } from './hooks/usePermissions';

const VALID_TOPIC_IDS = new Set(TAXONOMY_FROM_CSV.filter(t => t.type === 'topic').map(t => t.id));
const isTagValid = (tags: any[] | undefined | null) => {
    return !!(tags && tags.length > 0 && typeof tags[0] === 'object' && !!tags[0].tag_id && VALID_TOPIC_IDS.has(tags[0].tag_id));
};

// Types
interface Question {
    _id: string;
    display_id: string;
    question_text: {
        markdown: string;
        latex_validated: boolean;
    };
    type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX';
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
        video_url?: string;
        asset_ids?: {
            images?: string[];
            svg?: string[];
            audio?: string[];
        };
    };
    metadata: {
        difficultyLevel: 1 | 2 | 3 | 4 | 5;
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
        source_id?: string;
        microConcept?: string;
        isMultiConcept?: boolean;
        questionNature?: 'Recall' | 'Rule_Application' | 'Mechanistic' | 'Synthesis';
        // NEW: 3-Tier Exam Taxonomy
        examBoard?: 'JEE' | 'NEET' | 'CBSE' | 'State_Board' | 'BITSAT' | 'OLYMPIAD';
        sourceType?: 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock';
        examDetails?: {
            exam?: 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG';
            year?: number;
            month?: string;
            phase?: string;
            shift?: string;
            paper?: string;
            question_number?: string;
        };
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
    { id: 'SUBJ', name: 'Subjective / Example', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { id: 'WKEX', name: 'Worked Example', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
];

function AdminPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Top-level section: 'practice' | 'mock-tests' | 'flags'
    const [adminSection, setAdminSection] = useState<'practice' | 'mock-tests' | 'flags'>('practice');

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
    const [showRoleManagement, setShowRoleManagement] = useState(false);

    // Permissions
    const { permissions, loading: permissionsLoading, canEdit, canDelete, canManageRoles, canAccessChapter } = usePermissions();

    // Bulk import
    const [showBulkImport, setShowBulkImport] = useState(false);

    // Preview mode: 'desktop' | 'mobile'
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Options layout override: 'auto' | 'grid' | 'list'
    const [optionsLayout, setOptionsLayout] = useState<'auto' | 'grid' | 'list'>('auto');

    // Video and audio visibility
    const [videoExpanded, setVideoExpanded] = useState<Record<string, boolean>>({});
    const [audioExpanded, setAudioExpanded] = useState<Record<string, boolean>>({});

    // LaTeX auto-fix state
    const [latexFixResult, setLatexFixResult] = useState<{ field: string; fixes: string[] } | null>(null);

    // LaTeX Validation
    const [questionLatexValidation, setQuestionLatexValidation] = useState<LaTeXValidationResult | null>(null);
    const [solutionLatexValidation, setSolutionLatexValidation] = useState<LaTeXValidationResult | null>(null);

    // Filters - initialize from URL params
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || ''); // draft — applied on Enter
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'chemistry' | 'physics' | 'maths' | 'all'>((searchParams.get('subject') as any) || 'chemistry');
    const [selectedChapterFilter, setSelectedChapterFilter] = useState(searchParams.get('chapter') || 'all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState(searchParams.get('type') || 'all');
    const [selectedSourceFilter, setSelectedSourceFilter] = useState(searchParams.get('source') || 'all');
    const [selectedShiftFilter, setSelectedShiftFilter] = useState(searchParams.get('shift') || 'all');

    // Filter state (continued)
    const [selectedTopPYQFilter, setSelectedTopPYQFilter] = useState(searchParams.get('topPyq') || 'all');
    const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState(searchParams.get('difficulty') || 'all');
    const [selectedTagStatusFilter, setSelectedTagStatusFilter] = useState(searchParams.get('tagStatus') || 'all');
    const [selectedYearFilter, setSelectedYearFilter] = useState(searchParams.get('year') || 'all');
    const [selectedTagFilter, setSelectedTagFilter] = useState(searchParams.get('tag') || 'all');

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
        loadData();
    }, []);

    // Sync filter state to URL params
    useEffect(() => {
        const params = new URLSearchParams();
        
        if (searchQuery) params.set('search', searchQuery);
        if (selectedSubjectFilter !== 'chemistry') params.set('subject', selectedSubjectFilter);
        if (selectedChapterFilter !== 'all') params.set('chapter', selectedChapterFilter);
        if (selectedTypeFilter !== 'all') params.set('type', selectedTypeFilter);
        if (selectedSourceFilter !== 'all') params.set('source', selectedSourceFilter);
        if (selectedShiftFilter !== 'all') params.set('shift', selectedShiftFilter);
        if (selectedTopPYQFilter !== 'all') params.set('topPyq', selectedTopPYQFilter);
        if (selectedDifficultyFilter !== 'all') params.set('difficulty', selectedDifficultyFilter);
        if (selectedTagStatusFilter !== 'all') params.set('tagStatus', selectedTagStatusFilter);
        if (selectedYearFilter !== 'all') params.set('year', selectedYearFilter);
        if (selectedTagFilter !== 'all') params.set('tag', selectedTagFilter);
        
        const newUrl = params.toString() ? `?${params.toString()}` : '/crucible/admin';
        router.replace(newUrl, { scroll: false });
    }, [
        searchQuery,
        selectedSubjectFilter,
        selectedChapterFilter,
        selectedTypeFilter,
        selectedSourceFilter,
        selectedShiftFilter,
        selectedTopPYQFilter,
        selectedDifficultyFilter,
        selectedTagStatusFilter,
        selectedYearFilter,
        selectedTagFilter,
        router
    ]);

    // Load questions when filters or search change
    useEffect(() => {
        loadQuestions(0);
    }, [selectedChapterFilter, selectedTypeFilter, selectedDifficultyFilter, selectedSourceFilter, selectedYearFilter, searchQuery]);

    // Reset year when source switches away from PYQ
    useEffect(() => {
        if (selectedSourceFilter === 'non_pyq' || selectedSourceFilter === 'all') {
            setSelectedYearFilter('all');
            setSelectedShiftFilter('all');
        }
    }, [selectedSourceFilter]);

    // Reset concept tag filter when chapter changes
    useEffect(() => {
        setSelectedTagFilter('all');
    }, [selectedChapterFilter]);

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

    const buildQueryParams = (page: number, countOnly: boolean = false) => {
        const params = new URLSearchParams();

        if (countOnly) {
            params.set('countOnly', 'true');
        } else {
            params.set('limit', String(PAGE_SIZE));
            params.set('skip', String(page * PAGE_SIZE));
        }

        if (selectedChapterFilter !== 'all') params.set('chapter_id', selectedChapterFilter);
        if (selectedTypeFilter !== 'all') params.set('type', selectedTypeFilter);
        if (selectedDifficultyFilter !== 'all') params.set('difficulty', selectedDifficultyFilter);
        
        // NEW: Exam taxonomy filters (separated)
        // Exam Board filter
        if (selectedSourceFilter !== 'all') params.set('examBoard', selectedSourceFilter);
        
        // Source Type filter (using selectedShiftFilter variable for now)
        if (selectedShiftFilter !== 'all') params.set('sourceType', selectedShiftFilter);
        
        // Year filter
        if (selectedYearFilter !== 'all') {
            params.set('year', selectedYearFilter);
        }
        if (searchQuery) params.set('search', searchQuery);

        return params.toString();
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [qRes, cRes] = await Promise.all([
                fetch(`/api/v2/questions?countOnly=true`, { cache: 'no-store' }),
                fetch('/api/v2/chapters', { cache: 'no-store' })
            ]);

            const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
            if (!isDev && (qRes.redirected || qRes.url.includes('/login') || qRes.status === 401)) {
                window.location.href = '/login?next=/crucible/admin';
                return;
            }

            const qData = await qRes.json();
            const cData = await cRes.json();

            if (qData.success) {
                setTotalCount(qData.pagination?.total ?? 0);
            }
            if (cData.success) setChapters(cData.data);

            // If there's an active filter or search, load questions immediately
            if (selectedChapterFilter !== 'all' || searchQuery) {
                await loadQuestions(0);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (page = 0) => {
        // Only load questions if a chapter is selected or there's a search query
        if (selectedChapterFilter === 'all' && !searchQuery) {
            setQuestions([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/v2/questions?${buildQueryParams(page)}`, { cache: 'no-store' });

            const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
            if (!isDev && (res.redirected || res.url.includes('/login') || res.status === 401)) {
                window.location.href = '/login?next=/crucible/admin';
                return;
            }

            const data = await res.json();

            if (data.success) {
                setQuestions(data.data.sort((a: Question, b: Question) => a.display_id.localeCompare(b.display_id)));
                setTotalCount(data.pagination?.total ?? data.data.length);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
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
            // Chemistry
            ch11_atom: 'ATOM', ch11_bonding: 'BOND', ch11_chem_eq: 'CEQ', ch11_goc: 'GOC',
            ch11_hydrocarbon: 'HC', ch11_ionic_eq: 'IEQ', ch11_mole: 'MOLE', ch11_pblock: 'PB11',
            ch11_periodic: 'PERI', ch11_prac_org: 'POC', ch11_redox: 'RDX', ch11_thermo: 'THERMO',
            ch12_alcohols: 'ALCO', ch12_amines: 'AMIN', ch12_biomolecules: 'BIO',
            ch12_carbonyl: 'ALDO', ch12_coord: 'CORD', ch12_dblock: 'DNF', ch12_electrochem: 'EC',
            ch12_haloalkanes: 'HALO', ch12_kinetics: 'CK', ch12_pblock: 'PB12',
            ch12_salt: 'SALT', ch12_solutions: 'SOL',
            // Physics
            ph11_units: 'UNIT', ph11_kinematics1d: 'K1D', ph11_kinematics2d: 'K2D',
            ph11_nlm: 'NLM', ph11_wep: 'WEP', ph11_com_mom: 'COM', ph11_rotation: 'ROT',
            ph11_gravitation: 'GRAV', ph11_matter: 'MATT', ph11_thermo_phy: 'PHTH',
            ph11_shm: 'SHM', ph11_waves: 'WAVE',
            ph12_electrostatics: 'ELST', ph12_current: 'CURR', ph12_magnetism: 'MAG',
            ph12_emi: 'EMI', ph12_ac: 'ACE', ph12_ray_optics: 'ROPY',
            ph12_wave_optics: 'WVOP', ph12_modern: 'MOD', ph12_semiconductors: 'SEMI',
            // Maths (Competitive Syllabus — 33 chapters)
            ma_basic_math: 'BOMA', ma_quadratic: 'QUAD', ma_complex: 'CMPL',
            ma_sequence: 'SQSR', ma_pnc: 'PMCM', ma_binomial: 'BNML',
            ma_reasoning: 'MRES', ma_statistics: 'STAT', ma_matrices: 'MTRX',
            ma_determinants: 'DTRM', ma_probability: 'PROB', ma_sets_rel: 'STRL',
            ma_functions: 'FUNC', ma_limits: 'LIMS', ma_continuity_diff: 'CTDF',
            ma_differentiation: 'DIFF', ma_aod: 'AODV', ma_indef_int: 'ININ',
            ma_def_int: 'DFIN', ma_auc: 'AUC', ma_diff_eq: 'DFEQ',
            ma_straight_lines: 'STLN', ma_circle: 'CRCL', ma_parabola: 'PRBL',
            ma_ellipse: 'ELPS', ma_hyperbola: 'HYPB', ma_trig_ratios: 'TRRI',
            ma_trig_eq: 'TREQ', ma_itf: 'ITF', ma_height_dist: 'HTDT',
            ma_triangle_prop: 'PRTR', ma_vector_algebra: 'VCAL', ma_3d_geom: 'TDGM',
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
                difficultyLevel: 3,
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
                await loadQuestions();
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
                    await loadQuestions();
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

    // The API optimization replaces this client-side export load with an API fetch in a future step if needed.
    const handleExport = async () => {
        setShowExport(true);
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
                alert(`❌ Update failed: ${data.error}\n${data.details || ''}\n\nPlease check console for details.`);
                // Reload the question from server to revert optimistic update
                const reloadRes = await fetch(`/api/v2/questions/${id}`);
                const reloadData = await reloadRes.json();
                if (reloadData.success) {
                    setQuestions(prev => prev.map(q => q._id === id ? reloadData.data : q));
                }
            }
            return data;
        } catch (error) {
            console.error('Error updating:', error);
            alert(`❌ Network error while saving. Please check your connection.`);
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
        await loadQuestions();
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
                    solution_text: question.solution?.text_markdown || ''
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
            // Handle null/undefined solution object safely
            const existingSolution = question.solution || { text_markdown: '', latex_validated: false };
            const newText = existingSolution.text_markdown
                ? `${existingSolution.text_markdown}\n${markdownLink}`
                : markdownLink;
            setQuestions(prev => prev.map(q =>
                q._id === questionId
                    ? { ...q, solution: { ...existingSolution, text_markdown: newText } }
                    : q
            ));
            handleUpdate(questionId, { solution: { text_markdown: newText, latex_validated: false } });
        }
    };

    if (loading || permissionsLoading) return <div className="p-8 text-white">Loading Admin...</div>;

    const selectedQuestion = questions.find(q => q._id === selectedQuestionId);

    const filteredQuestions = questions.filter(q => {
        // Tag status (client-side — fast on loaded batch)
        if (selectedTagStatusFilter === 'untagged' && q.metadata.chapter_id && isTagValid(q.metadata.tags)) return false;
        if (selectedTagStatusFilter === 'no-chapter' && q.metadata.chapter_id) return false;
        if (selectedTagStatusFilter === 'no-tag' && (!q.metadata.chapter_id || isTagValid(q.metadata.tags))) return false;
        if (selectedTagStatusFilter === 'flagged' && !q.flags?.some(f => !f.resolved)) return false;
        // Top PYQ
        if (selectedTopPYQFilter === 'top' && !q.metadata.is_top_pyq) return false;
        if (selectedTopPYQFilter === 'not-top' && q.metadata.is_top_pyq) return false;
        // Shift (client-side — only 2 values)
        if (selectedShiftFilter !== 'all' && q.metadata.exam_source?.shift !== selectedShiftFilter) return false;
        // Concept tag (primary)
        if (selectedTagFilter !== 'all' && !q.metadata.tags.some(t => t.tag_id === selectedTagFilter)) return false;
        return true;
    });
    filteredQuestionsRef.current = filteredQuestions;

    // Tags for the active chapter — used by concept tag filter dropdown
    const chapterFilterTags = selectedChapterFilter !== 'all'
        ? TAXONOMY_FROM_CSV.filter(n => n.type === 'topic' && n.parent_id === selectedChapterFilter)
            .map(t => ({ id: t.id, name: t.name }))
        : [];

    // Calculate tag status counts for filter display
    const untaggedCount = questions.filter(q => !q.metadata.chapter_id || !isTagValid(q.metadata.tags)).length;
    const noChapterCount = questions.filter(q => !q.metadata.chapter_id).length;
    const noTagCount = questions.filter(q => q.metadata.chapter_id && !isTagValid(q.metadata.tags)).length;

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

                    {/* Section tabs */}
                    <div className="flex items-center gap-0.5 bg-gray-800/60 rounded-lg p-0.5 shrink-0">
                        <button
                            onClick={() => setAdminSection('practice')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                adminSection === 'practice'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Practice Bank
                        </button>
                        <button
                            onClick={() => setAdminSection('mock-tests')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                adminSection === 'mock-tests'
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Mock Tests
                        </button>
                        <button
                            onClick={() => setAdminSection('flags')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                adminSection === 'flags'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            🚩 Reports
                        </button>
                    </div>

                    {adminSection === 'practice' && (
                        <span className="text-gray-600 text-xs font-mono shrink-0">{questions.length}/{totalCount}</span>
                    )}

                    {adminSection === 'practice' && (<>
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
                    {canManageRoles && (
                        <button onClick={() => setShowRoleManagement(!showRoleManagement)} title="Role Management"
                            className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-purple-600/60 rounded-lg transition shrink-0">
                            <Shield size={13} />
                        </button>
                    )}

                    <div className="w-px h-4 bg-gray-700/50 shrink-0" />

                    {/* Search — press Enter to apply, Escape to clear */}
                    <div className="relative shrink-0 flex items-center">
                        <input
                            type="text"
                            placeholder="Search… ↵"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { setSearchQuery(searchInput); }
                                if (e.key === 'Escape') { setSearchInput(''); setSearchQuery(''); }
                            }}
                            className={`w-36 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none placeholder-gray-500 ${searchQuery ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
                        />
                        {(searchInput || searchQuery) && (
                            <button
                                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                                className="absolute right-1.5 text-gray-500 hover:text-gray-200 text-xs leading-none"
                                title="Clear search"
                            >✕</button>
                        )}
                    </div>

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
                    </>)}

                    {adminSection === 'practice' && (<>
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
                                const hasPrimaryTag = isTagValid(q.metadata.tags);
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
                                const hasPrimaryTag = isTagValid(q.metadata.tags);
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

                    {/* Subject Selector Pills */}
                    <div className="flex items-center gap-1 shrink-0 bg-gray-800/40 rounded-lg p-0.5">
                        {([
                            { id: 'chemistry', label: '⚗️ Chem', color: 'from-amber-600 to-orange-600' },
                            { id: 'physics', label: '⚡ Phys', color: 'from-blue-600 to-cyan-600' },
                            { id: 'maths', label: '📐 Math', color: 'from-violet-600 to-purple-600' },
                        ] as const).map(s => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setSelectedSubjectFilter(s.id);
                                    setSelectedChapterFilter('all');
                                }}
                                className={`px-2 py-1 text-xs font-medium rounded-md transition shrink-0 ${selectedSubjectFilter === s.id
                                    ? `bg-gradient-to-r ${s.color} text-white shadow`
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Chapter filter — scoped to selected subject */}
                    <select
                        value={selectedChapterFilter}
                        onChange={(e) => setSelectedChapterFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All Chapters</option>
                        {chapters
                            .filter(ch => {
                                const id = ch._id;
                                // Subject filter
                                if (selectedSubjectFilter === 'chemistry' && !(id.startsWith('ch11_') || id.startsWith('ch12_'))) return false;
                                if (selectedSubjectFilter === 'physics' && !(id.startsWith('ph11_') || id.startsWith('ph12_'))) return false;
                                if (selectedSubjectFilter === 'maths' && !id.startsWith('ma_')) return false;
                                // Permission filter - only show chapters user can access
                                return canAccessChapter(id);
                            })
                            .map(ch => (
                                <option key={ch._id} value={ch._id}>{ch.name}</option>
                            ))
                        }
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
                    {totalCount > PAGE_SIZE && (!searchQuery && selectedChapterFilter !== 'all') && (
                        <div className="flex items-center gap-1 shrink-0 ml-auto">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => loadQuestions(currentPage - 1)}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-xs transition"
                            >‹</button>
                            <span className="text-xs text-gray-500 font-mono">{currentPage + 1}/{Math.ceil(totalCount / PAGE_SIZE)}</span>
                            <button
                                disabled={(currentPage + 1) * PAGE_SIZE >= totalCount}
                                onClick={() => loadQuestions(currentPage + 1)}
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
                    </>)}
                </div>

                {/* Row 2: All filters consolidated in one row — practice bank only */}
                {adminSection === 'practice' && <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto border-t border-gray-800/50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as any}>
                    <Filter size={11} className="text-purple-400 shrink-0" />

                    {/* Difficulty */}
                    <select
                        value={selectedDifficultyFilter}
                        onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedDifficultyFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
                    >
                        <option value="all">All Difficulties</option>
                        <option value="1">L1 — Easy</option>
                        <option value="2">L2 — Easy+</option>
                        <option value="3">L3 — Medium</option>
                        <option value="4">L4 — Hard</option>
                        <option value="5">L5 — Challenging</option>
                    </select>

                    {/* Exam Board */}
                    <select
                        value={selectedSourceFilter}
                        onChange={(e) => { setSelectedSourceFilter(e.target.value); setCurrentPage(0); }}
                        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedSourceFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
                    >
                        <option value="all">All Boards</option>
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="CBSE">CBSE</option>
                        <option value="BITSAT">BITSAT</option>
                    </select>

                    {/* Source Type */}
                    <select
                        value={selectedShiftFilter}
                        onChange={(e) => { setSelectedShiftFilter(e.target.value); setCurrentPage(0); }}
                        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedShiftFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
                    >
                        <option value="all">All Sources</option>
                        <option value="PYQ">PYQ</option>
                        <option value="Practice">Practice</option>
                        <option value="NCERT_Textbook">NCERT Text</option>
                        <option value="NCERT_Exemplar">NCERT Exem</option>
                        <option value="Mock">Mock</option>
                    </select>

                    {/* Year — visible when PYQ source or exam board is selected */}
                    {(selectedShiftFilter === 'PYQ' || selectedSourceFilter === 'JEE' || selectedSourceFilter === 'NEET') && (
                        <select
                            value={selectedYearFilter}
                            onChange={(e) => setSelectedYearFilter(e.target.value)}
                            className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedYearFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
                        >
                            <option value="all">All Years</option>
                            {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(y => (
                                <option key={y} value={String(y)}>{y}</option>
                            ))}
                        </select>
                    )}

                    {/* Concept / Topic tag — only when a chapter is loaded */}
                    {selectedChapterFilter !== 'all' && chapterFilterTags.length > 0 && (
                        <select
                            value={selectedTagFilter}
                            onChange={(e) => setSelectedTagFilter(e.target.value)}
                            className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedTagFilter !== 'all' ? 'border-emerald-500/70 text-emerald-300' : 'border-gray-700/50'}`}
                        >
                            <option value="all">All Topics</option>
                            {chapterFilterTags.map(tag => (
                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                        </select>
                    )}

                    {/* Top PYQ */}
                    <select
                        value={selectedTopPYQFilter}
                        onChange={(e) => setSelectedTopPYQFilter(e.target.value)}
                        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
                    >
                        <option value="all">All PYQ</option>
                        <option value="top">⭐ Top</option>
                        <option value="not-top">Other</option>
                    </select>

                    {/* Tag / QC status */}
                    <select
                        value={selectedTagStatusFilter}
                        onChange={(e) => setSelectedTagStatusFilter(e.target.value)}
                        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs outline-none ${selectedTagStatusFilter !== 'all' ? 'border-red-500 text-red-300' : 'border-gray-700/50'}`}
                    >
                        <option value="all">Tags ✓</option>
                        <option value="untagged">⚠ Untagged ({untaggedCount})</option>
                        <option value="no-chapter">🔴 No Chapter ({noChapterCount})</option>
                        <option value="no-tag">🟡 No Tag ({noTagCount})</option>
                        <option value="flagged">🚨 Flagged ({questions.filter(q => q.flags?.some(f => !f.resolved)).length})</option>
                    </select>

                    {/* Count of filtered vs total */}
                    {filteredQuestions.length !== questions.length && (
                        <span className="text-xs text-purple-400 font-mono shrink-0">{filteredQuestions.length}/{questions.length}</span>
                    )}

                    {/* Clear all filters */}
                    {(selectedChapterFilter !== 'all' || selectedTypeFilter !== 'all' || selectedSourceFilter !== 'all' || selectedTopPYQFilter !== 'all' || selectedDifficultyFilter !== 'all' || selectedTagStatusFilter !== 'all' || selectedYearFilter !== 'all' || selectedShiftFilter !== 'all' || selectedTagFilter !== 'all') && (
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
                                setSelectedTagFilter('all');
                            }}
                            className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs transition shrink-0 ml-auto"
                        >
                            Clear All
                        </button>
                    )}
                </div>}

            </header>

            {/* MOCK TESTS section — full content area replacement */}
            {adminSection === 'mock-tests' && (
                <div className="flex-1 overflow-hidden">
                    <MockTestsAdmin />
                </div>
            )}

            {/* FLAGS / REPORTS section */}
            {adminSection === 'flags' && (
                <div className="flex-1 overflow-hidden">
                    <FlagsDashboard />
                </div>
            )}

            {/* PRACTICE BANK section — full-width metadata top + split editor/preview bottom */}
            {adminSection === 'practice' && <div className="flex-1 flex flex-col overflow-hidden">
                {selectedChapterFilter === 'all' && !searchQuery ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                        <Library size={48} className="mb-4 text-gray-600 opacity-50" />
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">Select a Chapter</h2>
                        <p className="max-w-md text-sm">
                            To optimize performance, the admin dashboard no longer loads all questions at once.
                            Please select a chapter from the dropdown above or use the search bar to find specific questions.
                        </p>
                    </div>
                ) : selectedQuestion ? (
                    <>
                    {/* TOP: Full-width metadata & tagging — 2 compact rows */}
                    <div className="shrink-0 border-b border-gray-800/50">
                        <div className="p-3 space-y-2">

                            {/* ── ROW 1: ID · Type · Difficulty │ Exam source │ Chapter · Tag │ Status + Actions ── */}
                            <div className="flex items-end gap-0 flex-wrap">

                                {/* Group A: ID, Type, Difficulty */}
                                <div className="flex items-end gap-1.5 pr-3 mr-2 border-r border-gray-700/60">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 mb-0.5">ID</span>
                                        <input type="text" value={selectedQuestion.display_id} readOnly
                                            className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs font-mono outline-none w-24 text-purple-400" />
                                    </div>
                                    <select
                                        value={selectedQuestion.type}
                                        onChange={(e) => {
                                            const newType = e.target.value as Question['type'];
                                            const oldType = selectedQuestion.type;
                                            if (newType === oldType) return;
                                            const update: Partial<Question> = { type: newType };
                                            if (newType === 'NVT' || newType === 'WKEX' || newType === 'SUBJ') {
                                                update.options = [] as any;
                                                update.answer = {} as any;
                                            } else if (oldType === 'NVT' || oldType === 'WKEX' || oldType === 'SUBJ' || !selectedQuestion.options || selectedQuestion.options.length === 0) {
                                                update.options = [
                                                    { id: 'a', text: 'Option A', is_correct: newType === 'SCQ' },
                                                    { id: 'b', text: 'Option B', is_correct: false },
                                                    { id: 'c', text: 'Option C', is_correct: false },
                                                    { id: 'd', text: 'Option D', is_correct: false }
                                                ] as any;
                                                update.answer = {} as any;
                                            }
                                            handleUpdate(selectedQuestion._id, update);
                                        }}
                                        className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs font-medium"
                                    >
                                        {QUESTION_TYPES.map(qt => <option key={qt.id} value={qt.id}>{qt.name}</option>)}
                                    </select>
                                    <select
                                        value={selectedQuestion.metadata.difficultyLevel}
                                        onChange={(e) => handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, difficultyLevel: Number(e.target.value) as any } })}
                                        className={`bg-gray-800/50 border rounded px-2 py-1 text-xs font-medium ${
                                            selectedQuestion.metadata.difficultyLevel >= 4 ? 'border-red-500/50 text-red-400' :
                                            selectedQuestion.metadata.difficultyLevel === 3 ? 'border-orange-500/50 text-orange-400' :
                                            'border-emerald-500/50 text-emerald-400'}`}
                                    >
                                        <option value="1">Level 1</option>
                                        <option value="2">Level 2</option>
                                        <option value="3">Level 3</option>
                                        <option value="4">Level 4</option>
                                        <option value="5">Level 5</option>
                                    </select>
                                </div>

                                {/* Group B: NEW Exam Taxonomy (examBoard → sourceType → examDetails) */}
                                {(() => {
                                    const ed = selectedQuestion.metadata.examDetails;
                                    const patchExamDetails = (patch: Partial<typeof ed>) => {
                                        const merged = { ...ed, ...patch };
                                        handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, examDetails: merged } });
                                    };
                                    const isPYQ = selectedQuestion.metadata.sourceType === 'PYQ';
                                    return (
                                        <div className="flex items-end gap-1.5 pr-3 mr-2 border-r border-gray-700/60">
                                            {/* Exam Board */}
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 mb-0.5">Board</span>
                                                <select value={selectedQuestion.metadata.examBoard ?? ''} 
                                                    onChange={(e) => handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, examBoard: e.target.value as any } })}
                                                    className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none w-20">
                                                    <option value="">—</option>
                                                    <option value="JEE">JEE</option>
                                                    <option value="NEET">NEET</option>
                                                    <option value="CBSE">CBSE</option>
                                                    <option value="BITSAT">BITSAT</option>
                                                </select>
                                            </div>
                                            {/* Source Type */}
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 mb-0.5">Source</span>
                                                <select value={selectedQuestion.metadata.sourceType ?? ''} 
                                                    onChange={(e) => handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, sourceType: e.target.value as any } })}
                                                    className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none w-28">
                                                    <option value="">—</option>
                                                    <option value="PYQ">PYQ</option>
                                                    <option value="NCERT_Textbook">NCERT Text</option>
                                                    <option value="NCERT_Exemplar">NCERT Exem</option>
                                                    <option value="Practice">Practice</option>
                                                    <option value="Mock">Mock</option>
                                                </select>
                                            </div>
                                            {/* Exam Details (conditional - only for PYQ) */}
                                            {isPYQ && (<>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 mb-0.5">Exam</span>
                                                    <select value={ed?.exam ?? ''} onChange={(e) => patchExamDetails({ exam: e.target.value as any })}
                                                        className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none w-24">
                                                        <option value="">—</option>
                                                        <option value="JEE_Main">JEE Main</option>
                                                        <option value="JEE_Advanced">JEE Adv</option>
                                                        <option value="NEET_UG">NEET UG</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 mb-0.5">Year</span>
                                                    <select value={ed?.year ?? ''} onChange={(e) => patchExamDetails({ year: Number(e.target.value) })}
                                                        className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none w-16">
                                                        <option value="">—</option>
                                                        {[2026,2025,2024,2023,2022,2021,2020,2019,2018,2017,2016,2015].map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 mb-0.5">Month</span>
                                                    <select value={ed?.month ?? ''} onChange={(e) => patchExamDetails({ month: e.target.value })}
                                                        className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none w-14">
                                                        <option value="">—</option>
                                                        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                </div>
                                                {/* Shift (JEE) or Phase (NEET) */}
                                                {ed?.exam?.startsWith('JEE') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500 mb-0.5">Shift</span>
                                                        <select value={ed?.shift ?? ''} onChange={(e) => patchExamDetails({ shift: e.target.value })}
                                                            className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none w-16">
                                                            <option value="">—</option>
                                                            <option value="Shift 1">S1</option>
                                                            <option value="Shift 2">S2</option>
                                                        </select>
                                                    </div>
                                                )}
                                                {ed?.exam === 'NEET_UG' && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500 mb-0.5">Phase</span>
                                                        <select value={ed?.phase ?? ''} onChange={(e) => patchExamDetails({ phase: e.target.value })}
                                                            className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none w-20">
                                                            <option value="">—</option>
                                                            <option value="Phase 1">P1</option>
                                                            <option value="Phase 2">P2</option>
                                                        </select>
                                                    </div>
                                                )}
                                                {ed?.exam === 'JEE_Advanced' && (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500 mb-0.5">Paper</span>
                                                        <select value={ed?.paper ?? ''} onChange={(e) => patchExamDetails({ paper: e.target.value })}
                                                            className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none w-16">
                                                            <option value="">—</option>
                                                            <option value="Paper 1">P1</option>
                                                            <option value="Paper 2">P2</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </>)}
                                        </div>
                                    );
                                })()}

                                {/* Group C: Chapter + Primary Tag (take remaining space) */}
                                <div className="flex items-end gap-1.5 flex-1 min-w-0 pr-3 mr-2 border-r border-gray-700/60">
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <label className="text-[10px] text-gray-500 mb-0.5 flex items-center gap-1">
                                            Chapter {reclassifying && <span className="text-purple-400 animate-pulse">● …</span>}
                                        </label>
                                        <select
                                            value={selectedQuestion.metadata.chapter_id}
                                            disabled={reclassifying}
                                            onChange={(e) => {
                                                const newChapterId = e.target.value;
                                                if (!newChapterId || newChapterId === selectedQuestion.metadata.chapter_id) return;
                                                handleReclassify(selectedQuestion._id, newChapterId, selectedQuestion.metadata.tags);
                                            }}
                                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            <option value="">Select Chapter</option>
                                            {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <label className="text-[10px] text-gray-500 mb-0.5 flex items-center justify-between">
                                            <span>Primary Tag</span>
                                            {selectedQuestion.metadata.tags?.[0]?.tag_id && (() => {
                                                const validation = validateTag(selectedQuestion.metadata.tags![0].tag_id, selectedQuestion.metadata.chapter_id);
                                                return validation.warning ? <span className="text-yellow-400 flex items-center gap-0.5"><AlertCircle size={8} />{validation.warning}</span> : null;
                                            })()}
                                        </label>
                                        <select
                                            value={selectedQuestion.metadata.tags?.[0]?.tag_id || ''}
                                            onChange={(e) => handleUpdate(selectedQuestion._id, {
                                                metadata: { ...selectedQuestion.metadata, tags: e.target.value ? [{ tag_id: e.target.value, weight: 1.0 }] : [] }
                                            })}
                                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs text-purple-300 focus:border-purple-500 outline-none font-mono"
                                        >
                                            <option value="">Select Tag</option>
                                            {TAXONOMY_FROM_CSV
                                                .filter(node => node.parent_id === selectedQuestion.metadata.chapter_id && node.type === 'topic')
                                                .map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>

                                {/* Group D: Tag status + AI Suggest + icon actions */}
                                <div className="flex items-center gap-1.5">
                                    {/* Tag status badge */}
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border ${
                                        !selectedQuestion.metadata.chapter_id ? 'bg-red-900/20 border-red-600/40 text-red-400' :
                                        !isTagValid(selectedQuestion.metadata.tags) ? 'bg-yellow-900/20 border-yellow-600/40 text-yellow-400' :
                                        'bg-green-900/20 border-green-600/40 text-green-400'}`}>
                                        {!selectedQuestion.metadata.chapter_id
                                            ? <><AlertTriangle size={11} /> No Chapter</>
                                            : !isTagValid(selectedQuestion.metadata.tags)
                                            ? <><AlertCircle size={11} /> No Tag</>
                                            : <><Check size={11} /> Tagged</>}
                                    </div>
                                    <button
                                        onClick={() => handleAITagSuggestion(selectedQuestion._id)}
                                        disabled={aiAnalyzing}
                                        className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded text-[10px] font-bold transition disabled:opacity-50"
                                    >
                                        <Sparkles size={10} /> {aiAnalyzing ? '…' : 'AI Tags'}
                                    </button>
                                    {/* Star */}
                                    <div className="flex flex-col items-center">
                                        <button onClick={() => handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, is_top_pyq: !selectedQuestion.metadata.is_top_pyq } })}
                                            className={`p-1.5 rounded transition ${selectedQuestion.metadata.is_top_pyq ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800/50 text-gray-500 hover:text-amber-400'}`} title="Top PYQ">
                                            <Star size={14} fill={selectedQuestion.metadata.is_top_pyq ? "currentColor" : "none"} />
                                        </button>
                                        <span className="text-[9px] font-mono text-amber-400/70 leading-none">
                                            {questions.filter(q => q.metadata.is_top_pyq && q.metadata.chapter_id === selectedQuestion.metadata.chapter_id).length}
                                        </span>
                                    </div>
                                    <button onClick={() => setFlagModalOpen(true)}
                                        className={`p-1.5 rounded transition ${selectedQuestion.flags?.some(f => !f.resolved) ? 'bg-red-500/20 text-red-500' : 'bg-gray-800/50 text-gray-500 hover:text-red-400'}`} title="Flag">
                                        <AlertTriangle size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(selectedQuestion._id)}
                                        disabled={!canDelete}
                                        title={!canDelete ? 'Only super admins can delete questions' : 'Delete question'}
                                        className={`p-1.5 rounded transition ${deletingId === selectedQuestion._id ? 'bg-red-500 text-white' : 'bg-gray-800/50 text-gray-500 hover:text-red-400'} ${!canDelete ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* AI Tag Suggestions (shown inline when active) */}
                            {showTagSuggestions && tagSuggestions.length > 0 && (
                                <div className="flex items-center gap-2 p-2 bg-purple-900/20 border border-purple-600/50 rounded">
                                    <span className="text-[10px] font-bold text-purple-400 shrink-0">AI Suggested:</span>
                                    <div className="flex flex-wrap gap-1.5 flex-1">
                                        {tagSuggestions.map(tag => (
                                            <button key={tag}
                                                onClick={() => { handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, tags: [{ tag_id: tag, weight: 1.0 }] } }); setShowTagSuggestions(false); }}
                                                className="px-2 py-0.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded text-[10px] font-mono text-purple-300 transition">
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowTagSuggestions(false)} className="text-xs text-gray-500 hover:text-gray-300 shrink-0">✕</button>
                                </div>
                            )}

                            {/* ── ROW 2: Micro Concept + Question Nature (consolidated) ── */}
                            <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-teal-900/10 to-purple-900/10 border border-teal-700/30 rounded">
                                {/* Micro Concept */}
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 block mb-1">Micro Concept</label>
                                    <select
                                        value={selectedQuestion.metadata.microConcept ?? ''}
                                        onChange={(e) => handleUpdate(selectedQuestion._id, {
                                            metadata: { ...selectedQuestion.metadata, microConcept: e.target.value }
                                        })}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-xs text-teal-300 focus:border-teal-500 outline-none"
                                    >
                                        <option value="">— select micro concept —</option>
                                        {(() => {
                                            const primaryTagId = selectedQuestion.metadata.tags?.[0]?.tag_id;
                                            if (!primaryTagId) return <option value="" disabled>Select a Primary Tag first</option>;
                                            const microTopics = TAXONOMY_FROM_CSV.filter(node => 
                                                node.parent_id === primaryTagId && node.type === 'micro_topic'
                                            );
                                            if (microTopics.length === 0) return <option value="" disabled>No micro concepts for this tag</option>;
                                            return microTopics.map(micro => (
                                                <option key={micro.id} value={micro.name}>{micro.name}</option>
                                            ));
                                        })()}
                                    </select>
                                </div>

                                {/* Multi-Concept Checkbox */}
                                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedQuestion.metadata.isMultiConcept}
                                        onChange={(e) => handleUpdate(selectedQuestion._id, {
                                            metadata: { ...selectedQuestion.metadata, isMultiConcept: e.target.checked }
                                        })}
                                        className="h-3.5 w-3.5 accent-teal-500"
                                    />
                                    <span className="text-xs text-gray-400">Multi</span>
                                </label>

                                {/* Question Nature */}
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 block mb-1">Question Nature</label>
                                    <select
                                        value={selectedQuestion.metadata.questionNature ?? ''}
                                        onChange={(e) => handleUpdate(selectedQuestion._id, {
                                            metadata: { ...selectedQuestion.metadata, questionNature: e.target.value as any }
                                        })}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-xs text-purple-300 focus:border-purple-500 outline-none"
                                    >
                                        <option value="">— select nature —</option>
                                        <option value="Recall">Recall</option>
                                        <option value="Rule_Application">Rule Application</option>
                                        <option value="Mechanistic">Mechanistic</option>
                                        <option value="Synthesis">Synthesis</option>
                                    </select>
                                </div>

                                {/* Nature Description */}
                                <div className="text-[10px] text-gray-500 shrink-0 w-[140px]">
                                    {selectedQuestion.metadata.questionNature === 'Recall' && 'Fact/definition recall'}
                                    {selectedQuestion.metadata.questionNature === 'Rule_Application' && 'Apply rules/formulas'}
                                    {selectedQuestion.metadata.questionNature === 'Mechanistic' && 'Reaction mechanisms'}
                                    {selectedQuestion.metadata.questionNature === 'Synthesis' && 'Multi-step solving'}
                                    {!selectedQuestion.metadata.questionNature && 'Cognitive approach'}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* BOTTOM: Side-by-side editor and live preview */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* LEFT: Question editor (50%) */}
                        <div className="w-1/2 flex flex-col overflow-hidden border-r border-gray-800/50">
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
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

                            {/* Options or Numerical Answer or Subjective */}
                            {selectedQuestion.type === 'NVT' ? (
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block font-medium">Numerical Answer (accepts negative numbers and decimals)</label>
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
                                            // Allow typing: digits, minus sign (only at start), decimal point, and empty string
                                            // This regex allows partial input like "-", ".", "-.", "12.", etc.
                                            if (raw !== '' && !/^-?\d*\.?\d*$/.test(raw)) {
                                                return; // Block invalid characters
                                            }
                                            
                                            // Update local state immediately for responsive typing
                                            const num = parseFloat(raw);
                                            const isDecimal = raw.includes('.');
                                            const answerUpdate = isNaN(num) || raw === '' || raw === '-' || raw === '.' || raw === '-.'
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
                                            const raw = e.target.value.trim();
                                            if (raw === '' || raw === '-' || raw === '.' || raw === '-.') return;
                                            const num = parseFloat(raw);
                                            if (isNaN(num)) return;
                                            const isDecimal = raw.includes('.');
                                            const answerUpdate = isDecimal
                                                ? { decimal_value: num }
                                                : { integer_value: num };
                                            handleUpdate(selectedQuestion._id, {
                                                answer: { ...selectedQuestion.answer, ...answerUpdate }
                                            });
                                        }}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-2xl font-bold text-blue-400 focus:border-purple-500 outline-none"
                                        placeholder="e.g., -5, 3.14, -0.5"
                                    />
                                </div>
                            ) : selectedQuestion.type === 'SUBJ' ? (
                                <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-lg">
                                    <p className="text-sm text-yellow-400/80 mb-1 font-medium flex items-center gap-2">
                                        <Info size={16} />
                                        Subjective / Solved Example Question
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        This question type does not have options or a numerical answer.
                                        Provide the detailed answer directly in the Solution box below.
                                    </p>
                                </div>
                            ) : selectedQuestion.type === 'WKEX' ? (
                                <div className="p-4 bg-teal-900/10 border border-teal-500/20 rounded-lg">
                                    <p className="text-sm text-teal-400/80 mb-1 font-medium flex items-center gap-2">
                                        <Info size={16} />
                                        Worked Example Document
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Worked examples have no options or answer. Write the step-by-step walkthrough
                                        (including Key insight and Common mistake) in the Solution box below.
                                        Use the <strong className="text-gray-400">Question Text</strong> field for the title and scenario.
                                        Set <strong className="text-gray-400">microConcept</strong> and <strong className="text-gray-400">tag</strong> so the engine can serve it for the right concept.
                                    </p>
                                </div>
                            ) : (
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
                                                    <div className="flex items-center gap-2">
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
                                                        <SVGScaleControls
                                                            compact={true}
                                                            step={5}
                                                            initialScale={getSvgScale(`option_${opt.id}`)}
                                                            onScaleChange={(scale) => handleScaleChange(selectedQuestion._id, `option_${opt.id}`, scale)}
                                                        />
                                                    </div>
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
                                                    className="w-full bg-gray-900/50 border border-gray-700/50 rounded px-2 py-1.5 text-base focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 hover:border-gray-600 font-mono text-gray-100"
                                                    placeholder="✏️ Click to edit option text..."
                                                />
                                            </div>
                                        ))}
                                    </div>
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

                            {/* Video Solution */}
                            <div className="flex flex-col gap-2 p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <MonitorPlay size={14} /> Video Solution
                                </h4>
                                
                                {/* Current Video Display with Delete Option */}
                                {selectedQuestion.solution?.video_url && (
                                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-green-400 font-medium">✓ Video Attached</span>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Delete this video? This will remove it from Cloudflare R2 storage.')) return;
                                                    
                                                    const videoUrl = selectedQuestion.solution?.video_url;
                                                    if (!videoUrl) return;
                                                    
                                                    // Extract asset ID from URL if it's from R2
                                                    const isR2Video = videoUrl.includes('canvas-chemistry-assets');
                                                    if (isR2Video) {
                                                        // Find asset by CDN URL
                                                        try {
                                                            const res = await fetch(`/api/v2/assets?question_id=${selectedQuestion._id}&type=video`);
                                                            const data = await res.json();
                                                            const asset = data.data?.find((a: any) => a.file.cdn_url === videoUrl);
                                                            
                                                            if (asset) {
                                                                // Delete from R2 and DB
                                                                await fetch(`/api/v2/assets/${asset._id}`, { method: 'DELETE' });
                                                            }
                                                        } catch (err) {
                                                            console.error('Failed to delete video from R2:', err);
                                                        }
                                                    }
                                                    
                                                    // Clear video URL from question
                                                    handleUpdate(selectedQuestion._id, {
                                                        solution: {
                                                            ...(selectedQuestion.solution || { text_markdown: '', latex_validated: false }),
                                                            video_url: ''
                                                        }
                                                    });
                                                }}
                                                className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded border border-red-500/50 transition"
                                            >
                                                Delete Video
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400 truncate font-mono bg-gray-900/50 px-2 py-1 rounded">
                                            {selectedQuestion.solution?.video_url || ''}
                                        </div>
                                    </div>
                                )}
                                
                                <input
                                    type="text"
                                    value={selectedQuestion.solution?.video_url || ''}
                                    onChange={(e) => {
                                        handleUpdate(selectedQuestion._id, {
                                            solution: {
                                                ...(selectedQuestion.solution || { text_markdown: '', latex_validated: false }),
                                                video_url: e.target.value
                                            }
                                        });
                                    }}
                                    placeholder="Paste YouTube or Cloudflare Stream URL here..."
                                    className="w-full bg-gray-800/70 border border-gray-600/70 rounded-lg px-3 py-2 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none text-gray-200"
                                />
                                <div className="text-[10px] text-gray-500 mt-1 mb-2">
                                    Directly paste a YouTube link, or drag & drop an MP4 below to automatically upload it to Cloudflare R2 and copy the link.
                                </div>
                                <VideoDropZone
                                    questionId={selectedQuestion._id}
                                    onUploaded={(videoUrl) => {
                                        handleUpdate(selectedQuestion._id, {
                                            solution: {
                                                ...(selectedQuestion.solution || { text_markdown: '', latex_validated: false }),
                                                video_url: videoUrl
                                            }
                                        });
                                    }}
                                />
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
                                onAudioDeleted={() => {
                                    handleUpdate(selectedQuestion._id, {
                                        solution: {
                                            ...(selectedQuestion.solution || { text_markdown: '', latex_validated: false }),
                                            asset_ids: {
                                                ...(selectedQuestion.solution?.asset_ids || {}),
                                                audio: []
                                            }
                                        }
                                    });
                                }}
                                existingAudioUrl={selectedQuestion.solution?.asset_ids?.audio?.[0]}
                            />
                        </div>
                        </div>

                        {/* RIGHT: Live Preview (50%) */}
                        <div className="w-1/2 flex flex-col overflow-hidden bg-gray-950/50">
                    <div className="p-3 border-b border-gray-800/50 bg-gray-900/50 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={14} /> Live Preview
                        </h3>
                        <div className="flex items-center gap-2">
                            {/* Options layout toggle */}
                            {selectedQuestion && selectedQuestion.type !== 'NVT' && selectedQuestion.type !== 'SUBJ' && (
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
                            <div className={`space-y-4 transition-all duration-300 ${previewMode === 'mobile'
                                ? 'w-[420px] border border-gray-700/60 rounded-2xl overflow-y-auto shadow-2xl shadow-black/50 bg-gray-900 max-h-full'
                                : 'w-full max-w-[860px]'
                                }`}>
                                {previewMode === 'mobile' && (
                                    <div className="flex items-center justify-center gap-1 py-2 bg-gray-950/80 border-b border-gray-800">
                                        <div className="w-16 h-1 bg-gray-600 rounded-full" />
                                    </div>
                                )}
                                {/* Question Preview */}
                                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${previewMode === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs font-mono text-purple-400">{selectedQuestion.display_id}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${QUESTION_TYPES.find(t => t.id === selectedQuestion.type)?.color
                                            }`}>
                                            {selectedQuestion.type}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${selectedQuestion.metadata.difficultyLevel >= 4 ? 'bg-red-500/20 text-red-400' :
                                            selectedQuestion.metadata.difficultyLevel === 3 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            Level {selectedQuestion.metadata.difficultyLevel}
                                        </span>
                                    </div>
                                    <MathRenderer
                                        markdown={selectedQuestion.question_text.markdown}
                                        className="text-gray-300"
                                        fontSize={20}
                                        imageScale={getSvgScale('question')}
                                    />
                                    {selectedQuestion.type !== 'NVT' && selectedQuestion.type !== 'SUBJ' && (() => {
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
                                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${previewMode === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Solution</h4>
                                    
                                    {/* Media Controls Row - Video & Audio buttons at top */}
                                    {(selectedQuestion.solution?.video_url || (selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0)) && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {/* Watch Video Solution Button with State Indicator */}
                                            {selectedQuestion.solution?.video_url && (
                                                <button
                                                    onClick={() => {
                                                        setVideoExpanded(prev => ({
                                                            ...prev,
                                                            [selectedQuestion._id]: !prev[selectedQuestion._id]
                                                        }));
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-800/50 active:scale-95"
                                                >
                                                    <MonitorPlay size={16} />
                                                    <span className="hidden sm:inline">
                                                        {videoExpanded[selectedQuestion._id] ? 'Hide' : 'Watch'} Video Solution
                                                    </span>
                                                    <span className="sm:hidden">Video</span>
                                                    {videoExpanded[selectedQuestion._id] 
                                                        ? <ChevronUp size={14} className="transition-transform duration-200" />
                                                        : <ChevronDown size={14} className="transition-transform duration-200" />
                                                    }
                                                </button>
                                            )}
                                            
                                            {/* Audio Note Waveform Button with State Indicator */}
                                            {selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0 && (
                                                selectedQuestion.solution.asset_ids.audio.map((url, idx) => {
                                                    const audioKey = `${selectedQuestion._id}-${idx}`;
                                                    return url ? (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setAudioExpanded(prev => ({
                                                                    ...prev,
                                                                    [audioKey]: !prev[audioKey]
                                                                }));
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-900/40 hover:shadow-purple-800/50 active:scale-95"
                                                        >
                                                            <Volume2 size={16} />
                                                            <span className="hidden sm:inline">
                                                                {audioExpanded[audioKey] ? 'Hide' : 'Play'} Audio Note{selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}
                                                            </span>
                                                            <span className="sm:hidden">Audio{selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}</span>
                                                            {audioExpanded[audioKey]
                                                                ? <ChevronUp size={14} className="transition-transform duration-200" />
                                                                : <ChevronDown size={14} className="transition-transform duration-200" />
                                                            }
                                                        </button>
                                                    ) : null;
                                                })
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Collapsible Video Player - Square Aspect Ratio (1:1) with Smooth Animation */}
                                    {selectedQuestion.solution?.video_url && (
                                        <div 
                                            className={`mb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                                                videoExpanded[selectedQuestion._id] 
                                                    ? 'max-h-[600px] opacity-100' 
                                                    : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <div className={`bg-black rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'w-full' : 'max-w-md mx-auto'}`} style={{ aspectRatio: '1/1' }}>
                                                <video
                                                    controls
                                                    className="w-full h-full object-contain"
                                                    src={selectedQuestion.solution.video_url}
                                                    onKeyDown={(e) => {
                                                        // Keyboard shortcuts
                                                        if (e.key === ' ') {
                                                            e.preventDefault();
                                                            const video = e.currentTarget;
                                                            video.paused ? video.play() : video.pause();
                                                        } else if (e.key === 'ArrowRight') {
                                                            e.preventDefault();
                                                            e.currentTarget.currentTime += 5;
                                                        } else if (e.key === 'ArrowLeft') {
                                                            e.preventDefault();
                                                            e.currentTarget.currentTime -= 5;
                                                        }
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Collapsible Audio Players with Waveform and Smooth Animation */}
                                    {selectedQuestion.solution?.asset_ids?.audio && selectedQuestion.solution.asset_ids.audio.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {selectedQuestion.solution.asset_ids.audio.map((url, idx) => {
                                                const audioKey = `${selectedQuestion._id}-${idx}`;
                                                return url ? (
                                                    <div 
                                                        key={idx}
                                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                            audioExpanded[audioKey]
                                                                ? 'max-h-40 opacity-100'
                                                                : 'max-h-0 opacity-0'
                                                        }`}
                                                    >
                                                        <AudioPlayer src={url} label={`Audio Note${selectedQuestion.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}`} />
                                                    </div>
                                                ) : null;
                                            })}
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
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-600">
                        <div className="text-center">
                            <MonitorPlay size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-sm">Select a question to edit</p>
                        </div>
                    </div>
                )}
            </div>}

            {/* Analytics Dashboard Modal */}
            {showAnalytics && (
                <AnalyticsDashboard
                    questions={questions}
                    chapters={chapters}
                    onClose={() => setShowAnalytics(false)}
                    selectedChapterId={selectedChapterFilter !== 'all' ? selectedChapterFilter : undefined}
                />
            )}

            {/* Bulk Import Modal */}
            {showBulkImport && (
                <BulkImportModal
                    onClose={() => setShowBulkImport(false)}
                    onImported={(count) => { setShowBulkImport(false); loadData(); }}
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

            {/* Role Management Modal */}
            {showRoleManagement && canManageRoles && permissions && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl my-8 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Shield className="text-purple-400" size={24} />
                                Role Management
                            </h2>
                            <button 
                                onClick={() => setShowRoleManagement(false)} 
                                className="text-gray-500 hover:text-white transition text-2xl leading-none"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            <RoleManagement currentUserEmail={permissions.email} />
                        </div>
                    </div>
                </div>
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

// Wrapper component with Suspense boundary for useSearchParams
export default function AdminPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-gray-400">Loading admin dashboard...</p>
                </div>
            </div>
        }>
            <AdminPageContent />
        </Suspense>
    );
}
