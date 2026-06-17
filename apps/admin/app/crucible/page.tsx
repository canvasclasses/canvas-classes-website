'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Plus, Filter, MonitorPlay, AlertTriangle, CheckSquare, Square, BarChart3, FileDown, FileJson, Wand2, Library, Info, ChevronLeft } from 'lucide-react';
// uuid removed — display_id is now generated inline
import AnalyticsDashboard from '@/features/admin/components/AnalyticsDashboard';
import ExportDashboard from '@/features/admin/components/ExportDashboard';
import { TAXONOMY_FROM_CSV, type TaxonomyNode } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import { validateLaTeX, autoFixLatex, getLatexSuggestions, type LaTeXValidationResult } from '@canvas/core/latex-validator';
import BulkImportModal from '@/features/admin/components/BulkImportModal';
import MathRenderer from '@canvas/ui/MathRenderer';
import AudioRecorder from '@canvas/ui/AudioRecorder';
import AudioPlayer from '@/features/admin/components/AudioPlayer';
import SVGScaleControls from '@/features/admin/components/SVGScaleControls';
import SVGDropZone from '@canvas/ui/SVGDropZone';
import VideoDropZone from '@canvas/ui/VideoDropZone';
import MockTestsAdmin from '@/features/admin/components/MockTestsAdmin';
import FlagsDashboard from '@/features/admin/components/FlagsDashboard';
import FlagModal, { type FlagSubmission } from '@/features/admin/components/FlagModal';
import AdminSectionTabs, { type AdminSection } from '@/features/admin/components/AdminSectionTabs';
import AdminFilterRow from '@/features/admin/components/AdminFilterRow';
import AITagSuggestionsBox from '@/features/admin/components/AITagSuggestionsBox';
import QuestionPreviewPane from '@/features/admin/components/QuestionPreviewPane';
import QuestionTaggingRow from '@/features/admin/components/QuestionTaggingRow';
import { usePermissions } from '@/features/admin/hooks/usePermissions';
import { useAdminKeyNav } from '@/features/admin/hooks/useAdminKeyNav';
import { useAdminFilterUrlSync } from '@/features/admin/hooks/useAdminFilterUrlSync';
import { type AdminQuestion as Question, type AdminChapter as Chapter, QUESTION_TYPES } from '@/features/admin/components/types';
import { Select } from '@/features/admin/components/Select';

const VALID_TOPIC_IDS = new Set(TAXONOMY_FROM_CSV.filter(t => t.type === 'topic').map(t => t.id));
const isTagValid = (tags: Array<{ tag_id: string }> | undefined | null): tags is Array<{ tag_id: string }> => {
    return !!(tags && tags.length > 0 && typeof tags[0] === 'object' && !!tags[0].tag_id && VALID_TOPIC_IDS.has(tags[0].tag_id));
};

// ─────────────────────────────────────────────────────────────────────────────
// FILE STRUCTURE — grep for `§N` anchors below to jump to each section.
//
//   §1 STATE          Centralized useState block (50+ filters / UI states)
//   §2 EFFECTS        URL sync (useAdminFilterUrlSync), key nav (useAdminKeyNav),
//                     scale debounce, mount-time data load
//   §3 LOADERS        loadData, loadQuestions, buildQueryParams
//   §4 CRUD           handleAddQuestion / Delete / Update / Reclassify /
//                     BulkTagAssignment / AITagSuggestion / SVGUploaded
//   §5 TOP_BAR        Section tabs, search, prev/next, chapter/type selectors,
//                     pagination, filter row
//   §6 SECTION_BODY   Conditional on adminSection: mock-tests | flags |
//                     practice (the practice path is the metadata editor +
//                     side-by-side text editor / live preview)
//   §7 MODALS         Analytics, BulkImport, Export, FlagModal
//
// Companion files (already extracted):
//   - ./hooks/useAdminKeyNav.ts          — arrow-key prev/next
//   - ./hooks/useAdminFilterUrlSync.ts   — filters ↔ URL search params
//   - ./hooks/usePermissions.ts          — RBAC check
//   - ./types.ts                         — AdminQuestion, AdminChapter, QUESTION_TYPES
// ─────────────────────────────────────────────────────────────────────────────
function AdminPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // §1 STATE ───────────────────────────────────────────────────────────────
    // Top-level section: 'practice' | 'mock-tests' | 'flags'
    const [adminSection, setAdminSection] = useState<AdminSection>('practice');

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

    // Permissions
    const { loading: permissionsLoading, canEdit, canView, isSuperAdmin, grants } = usePermissions();

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
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'chemistry' | 'physics' | 'maths' | 'biology' | 'all'>((searchParams.get('subject') as 'chemistry' | 'physics' | 'maths' | 'biology' | 'all' | null) || 'chemistry');
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

    // Flag state — only the visibility lives here; the modal owns reason/note.
    const [flagModalOpen, setFlagModalOpen] = useState(false);

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

    // §2 EFFECTS ─────────────────────────────────────────────────────────────
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

    useAdminKeyNav({
        getQuestionIds: () => filteredQuestionsRef.current.map(q => q._id),
        getCurrentId: () => selectedQuestionId,
        onSelect: (nextId) => setSelectedQuestionId(nextId),
    });

    useEffect(() => {
        loadData();
    }, []);

    useAdminFilterUrlSync({
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
    }, router);

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

    // §3 LOADERS ─────────────────────────────────────────────────────────────
    const loadData = async () => {
        setLoading(true);
        try {
            // Scope the initial count by the active filters (URL-driven on mount).
            // A chapter-scoped count uses the metadata.chapter_id index and returns
            // in milliseconds; an unscoped count is a full-collection scan.
            const [qRes, cRes] = await Promise.all([
                fetch(`/api/v2/questions?${buildQueryParams(0, true)}`, { cache: 'no-store' }),
                fetch('/api/v2/chapters', { cache: 'no-store' })
            ]);

            const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
            if (!isDev && (qRes.redirected || qRes.url.includes('/login') || qRes.status === 401)) {
                window.location.href = '/login?next=/crucible';
                return;
            }

            const qData = await qRes.json();
            const cData = await cRes.json();

            if (qData.success) {
                setTotalCount(qData.pagination?.total ?? 0);
            }
            if (cData.success) setChapters(cData.data);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (page = 0) => {
        // Only load questions if a chapter is selected, there's a search query, OR exam filters are applied
        const hasExamFilters = selectedSourceFilter !== 'all' || selectedShiftFilter !== 'all' || selectedYearFilter !== 'all';
        if (selectedChapterFilter === 'all' && !searchQuery && !hasExamFilters) {
            setQuestions([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/v2/questions?${buildQueryParams(page)}`, { cache: 'no-store' });

            const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
            if (!isDev && (res.redirected || res.url.includes('/login') || res.status === 401)) {
                window.location.href = '/login?next=/crucible';
                return;
            }

            const data = await res.json();

            if (data.success) {
                // API already sorts by display_id ascending — no need to re-sort client-side.
                setQuestions(data.data);
                setTotalCount(data.pagination?.total ?? data.data.length);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
        } finally {
            setLoading(false);
        }
    };

    // §4 CRUD ────────────────────────────────────────────────────────────────
    const handleAddQuestion = async () => {
        const defaultChapter = selectedChapterFilter !== 'all' ? selectedChapterFilter : (chapters[0]?._id || '');

        if (!defaultChapter) {
            alert('Please select a chapter first before adding a question.');
            return;
        }

        // display_id is generated by the server (lib/questionIdGenerator.ts) — it sees
        // the full DB, not the paginated slice loaded in the admin UI.
        const newQuestion: Partial<Question> = {
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
                // Phase 2 (2026-05-07): legacy `is_pyq` no longer set on new
                // questions. The admin can star-mark via is_top_pyq later.
                is_top_pyq: false
            },
            // Status policy (set by project decision 2026-05-07):
            // All new questions go directly to 'published'. There is no review gate.
            status: 'published'
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

    const handleReclassify = async (questionId: string, newChapterId: string, currentTags: Array<{ tag_id: string; weight: number }>) => {
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

    // RBAC gates for the UI surface. Backend already 403s on writes a staff
    // user isn't allowed to make; these mirror those checks so the buttons
    // never render in the first place. See _agents/adr/010-rbac-grant-redesign.md.
    //   canEditCurrent — can the user edit the currently selected question's chapter?
    //   canEditAny     — does the user have edit grants anywhere? Drives top-bar.
    const canEditCurrent = selectedQuestion ? canEdit(selectedQuestion.metadata.chapter_id) : true;
    const canEditAny = isSuperAdmin || grants.some(g => g.level === 'edit');

    const filteredQuestions = questions.filter(q => {
        // Tag status (client-side — fast on loaded batch)
        if (selectedTagStatusFilter === 'untagged' && q.metadata.chapter_id && isTagValid(q.metadata.tags)) return false;
        if (selectedTagStatusFilter === 'no-chapter' && q.metadata.chapter_id) return false;
        if (selectedTagStatusFilter === 'no-tag' && (!q.metadata.chapter_id || isTagValid(q.metadata.tags))) return false;
        if (selectedTagStatusFilter === 'flagged' && !q.flags?.some(f => !f.resolved)) return false;
        // Top PYQ
        if (selectedTopPYQFilter === 'top' && !q.metadata.is_top_pyq) return false;
        if (selectedTopPYQFilter === 'not-top' && q.metadata.is_top_pyq) return false;
        // Source Type (client-side filter for new metadata.sourceType field)
        if (selectedShiftFilter !== 'all' && q.metadata.sourceType !== selectedShiftFilter) return false;
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

    const submitFlag = async (data: FlagSubmission) => {
        if (!selectedQuestion) return;
        await handleUpdate(selectedQuestion._id, {
            add_flag: { type: data.type, note: data.note }
        } as Partial<Question>);
        setFlagModalOpen(false);

        const newFlag = { type: data.type, note: data.note, flagged_at: new Date().toISOString(), resolved: false };
        setQuestions(prev => prev.map(q =>
            q._id === selectedQuestion._id ? { ...q, flags: [...(q.flags || []), newFlag] } : q
        ));
    };

    const resolveFlags = async () => {
        if (!selectedQuestion) return;
        await handleUpdate(selectedQuestion._id, {
            resolve_flags: true
        } as Partial<Question>);
        setQuestions(prev => prev.map(q =>
            q._id === selectedQuestion._id ? {
                ...q,
                flags: (q.flags || []).map(f => ({ ...f, resolved: true }))
            } : q
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
            {/* §5 TOP_BAR — section tabs + search + nav + filters (renders for every adminSection) */}
            {/* TOP BAR — two rows */}
            {/* relative z-30 lifts the whole top bar (and any open dropdown that
                overflows down into the editor body) above the sibling body below.
                Without it, the body's controls paint over the open question menu. */}
            <header className="relative z-30 shrink-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 shadow-xl">
                {/* Row 1: title + actions + search + Prev/Next + selector + chapter/type filters */}
                {/* flex-wrap so content reflows to additional lines on narrow viewports — accessible without horizontal scroll on any laptop/OS */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800/40 flex-wrap">
                    <Link
                        href="/"
                        title="Back to admin home"
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800/60 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700/60 hover:text-white shrink-0"
                    >
                        <ChevronLeft size={12} />
                        Home
                    </Link>
                    <h1 className="text-sm font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent shrink-0">
                        Crucible Admin
                    </h1>

                    {/* Section tabs */}
                    <AdminSectionTabs section={adminSection} onChange={setAdminSection} />

                    {adminSection === 'practice' && (
                        <span className="text-gray-600 text-xs font-mono shrink-0">{questions.length}/{totalCount}</span>
                    )}

                    {adminSection === 'practice' && (<>
                    <div className="w-px h-4 bg-gray-700/50 shrink-0" />

                    {/* Icon-only action buttons. Write actions hidden for view-only staff. */}
                    {canEditAny && (
                        <button onClick={handleAddQuestion} title="Add Question"
                            className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition shrink-0">
                            <Plus size={13} />
                        </button>
                    )}
                    {canEditAny && (
                        <button onClick={() => setBulkMode(!bulkMode)} title="Bulk Mode"
                            className={`flex items-center justify-center w-7 h-7 rounded-lg transition shrink-0 ${bulkMode ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}>
                            {bulkMode ? <CheckSquare size={13} /> : <Square size={13} />}
                        </button>
                    )}
                    <button onClick={() => setShowAnalytics(!showAnalytics)} title="Analytics"
                        className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 rounded-lg transition shrink-0">
                        <BarChart3 size={13} />
                    </button>
                    <button onClick={() => setShowExport(true)} title="Export Practice Sheet"
                        className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-violet-700/60 rounded-lg transition shrink-0">
                        <FileDown size={13} />
                    </button>
                    {canEditAny && (
                        <button onClick={() => setShowBulkImport(true)} title="Bulk JSON Import"
                            className="flex items-center justify-center w-7 h-7 bg-gray-800/50 text-gray-300 hover:bg-blue-600/60 rounded-lg transition shrink-0">
                            <FileJson size={13} />
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
                            <Select
                                size="sm"
                                className="w-44"
                                value=""
                                onChange={(chapterId) => {
                                    if (chapterId && confirm(`Assign ${selectedQuestions.size} questions to this chapter?`)) {
                                        handleBulkTagAssignment(chapterId, '');
                                    }
                                }}
                                placeholder="Bulk Assign Chapter"
                                options={[
                                    { value: '', label: 'Bulk Assign Chapter' },
                                    ...chapters.map((ch) => ({ value: ch._id, label: ch.name })),
                                ]}
                            />
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
                                // Bridge: prefer modern examDetails, fall back to legacy exam_source.
                                const det = q.metadata?.examDetails;
                                const src = q.metadata?.exam_source;
                                const examName = det?.exam?.replace(/_/g, ' ').replace('JEE ', '') ?? src?.exam?.replace('JEE ', '') ?? '';
                                const examYear = det?.year ?? src?.year;
                                const examShift = det?.shift ?? src?.shift;
                                const srcLabel = (det?.year || src?.year) ? ` [${examName} ${examYear ?? ''} ${examShift ? examShift.replace(/^Shift-/, '') : ''}]` : '';
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
                        <Select
                            size="sm"
                            className="w-56 shrink-0"
                            value={selectedQuestionId || ''}
                            onChange={(v) => setSelectedQuestionId(v || null)}
                            placeholder={`Select (${filteredQuestions.length})`}
                            options={[
                                { value: '', label: `Select (${filteredQuestions.length})` },
                                ...filteredQuestions.map((q) => {
                                    const hasChapter = !!q.metadata.chapter_id;
                                    const hasPrimaryTag = isTagValid(q.metadata.tags);
                                    const statusDot = !hasChapter ? '🔴' : !hasPrimaryTag ? '🟡' : '🟢';
                                    const det = q.metadata?.examDetails;
                                    const src = q.metadata?.exam_source;
                                    const examName = det?.exam?.replace(/_/g, ' ').replace('JEE ', '') ?? src?.exam?.replace('JEE ', '') ?? '';
                                    const examYear = det?.year ?? src?.year;
                                    const examShift = det?.shift ?? src?.shift;
                                    const srcLabel = (det?.year || src?.year) ? ` [${examName} ${examYear ?? ''} ${examShift ? examShift.replace(/^Shift-/, '') : ''}]` : '';
                                    return {
                                        value: q._id,
                                        label: `${statusDot} ${q.display_id}${srcLabel}: ${q.question_text?.markdown?.substring(0, 40) || 'No text'}...`,
                                    };
                                }),
                            ]}
                        />
                    )}

                    {/* Subject Selector Pills */}
                    <div className="flex items-center gap-1 shrink-0 bg-gray-800/40 rounded-lg p-0.5">
                        {([
                            { id: 'chemistry', label: '⚗️ Chem', color: 'from-amber-600 to-orange-600' },
                            { id: 'physics', label: '⚡ Phys', color: 'from-blue-600 to-cyan-600' },
                            { id: 'maths', label: '📐 Math', color: 'from-violet-600 to-purple-600' },
                            { id: 'biology', label: '🧬 Bio', color: 'from-emerald-600 to-teal-600' },
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
                    <Select
                        size="sm"
                        className="shrink-0 w-40"
                        value={selectedChapterFilter}
                        onChange={setSelectedChapterFilter}
                        options={[
                            { value: 'all', label: 'All Chapters' },
                            ...chapters
                                .filter((ch) => {
                                    const id = ch._id;
                                    if (selectedSubjectFilter === 'chemistry' && !(id.startsWith('ch11_') || id.startsWith('ch12_'))) return false;
                                    if (selectedSubjectFilter === 'physics' && !(id.startsWith('ph11_') || id.startsWith('ph12_'))) return false;
                                    if (selectedSubjectFilter === 'maths' && !id.startsWith('ma_')) return false;
                                    if (selectedSubjectFilter === 'biology' && !(id.startsWith('bio11_') || id.startsWith('bio12_'))) return false;
                                    return canView(id);
                                })
                                .map((ch) => ({ value: ch._id, label: ch.name })),
                        ]}
                    />
                    <Select
                        size="sm"
                        className="shrink-0 w-24"
                        value={selectedTypeFilter}
                        onChange={setSelectedTypeFilter}
                        options={[
                            { value: 'all', label: 'All Types' },
                            ...QUESTION_TYPES.map((qt) => ({ value: qt.id, label: qt.id })),
                        ]}
                    />

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
                {/* flex-wrap so filters + per-question editors reflow on narrow viewports — accessible without horizontal scroll on any laptop/OS */}
                {adminSection === 'practice' && <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-800/50 flex-wrap">
                    <Filter size={11} className="text-purple-400 shrink-0" />

                    <AdminFilterRow
                        selectedDifficultyFilter={selectedDifficultyFilter}
                        setSelectedDifficultyFilter={setSelectedDifficultyFilter}
                        selectedSourceFilter={selectedSourceFilter}
                        setSelectedSourceFilter={setSelectedSourceFilter}
                        selectedShiftFilter={selectedShiftFilter}
                        setSelectedShiftFilter={setSelectedShiftFilter}
                        selectedYearFilter={selectedYearFilter}
                        setSelectedYearFilter={setSelectedYearFilter}
                        selectedTagFilter={selectedTagFilter}
                        setSelectedTagFilter={setSelectedTagFilter}
                        selectedTopPYQFilter={selectedTopPYQFilter}
                        setSelectedTopPYQFilter={setSelectedTopPYQFilter}
                        selectedTagStatusFilter={selectedTagStatusFilter}
                        setSelectedTagStatusFilter={setSelectedTagStatusFilter}
                        resetPage={() => setCurrentPage(0)}
                        selectedChapterFilter={selectedChapterFilter}
                        chapterFilterTags={chapterFilterTags}
                        untaggedCount={untaggedCount}
                        noChapterCount={noChapterCount}
                        noTagCount={noTagCount}
                        flaggedCount={questions.filter(q => q.flags?.some(f => !f.resolved)).length}
                    />

                    {/* Per-question rarely-changed metadata editors (only when a question is loaded) */}
                    {selectedQuestion && (() => {
                        const ed = selectedQuestion.metadata.examDetails;
                        const patchExamDetails = (patch: Partial<typeof ed>) => {
                            const merged = { ...ed, ...patch };
                            handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, examDetails: merged } });
                        };
                        const isPYQ = selectedQuestion.metadata.sourceType === 'PYQ';
                        return (
                            <fieldset disabled={!canEditCurrent} className="contents">
                            <div className="flex items-center gap-1.5 shrink-0 pl-2 ml-1 border-l border-gray-700/60">
                                {/* Source Type */}
                                <Select
                                    size="sm"
                                    className="shrink-0 w-28"
                                    title="Source"
                                    value={(selectedQuestion.metadata.sourceType ?? '') as string}
                                    onChange={(v) => handleUpdate(selectedQuestion._id, { metadata: { ...selectedQuestion.metadata, sourceType: (v || undefined) as 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock' | undefined } })}
                                    placeholder="Source —"
                                    options={[
                                        { value: '', label: 'Source —' },
                                        { value: 'PYQ', label: 'PYQ' },
                                        { value: 'NCERT_Textbook', label: 'NCERT Text' },
                                        { value: 'NCERT_Exemplar', label: 'NCERT Exem' },
                                        { value: 'Practice', label: 'Practice' },
                                        { value: 'Mock', label: 'Mock' },
                                    ]}
                                />
                                {isPYQ && (<>
                                    <Select
                                        size="sm"
                                        className="shrink-0 w-24"
                                        title="Exam"
                                        value={(ed?.exam ?? '') as string}
                                        onChange={(v) => patchExamDetails({ exam: (v || undefined) as 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG' | 'WBJEE' | undefined })}
                                        placeholder="Exam —"
                                        options={[
                                            { value: '', label: 'Exam —' },
                                            { value: 'JEE_Main', label: 'JEE Main' },
                                            { value: 'JEE_Advanced', label: 'JEE Adv' },
                                            { value: 'NEET_UG', label: 'NEET UG' },
                                            { value: 'WBJEE', label: 'WBJEE' },
                                        ]}
                                    />
                                    <Select
                                        size="sm"
                                        className="shrink-0 w-20"
                                        title="Year"
                                        value={String(ed?.year ?? '')}
                                        onChange={(v) => patchExamDetails({ year: v ? Number(v) : undefined })}
                                        placeholder="Year —"
                                        options={[
                                            { value: '', label: 'Year —' },
                                            ...[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => ({ value: String(y), label: String(y) })),
                                        ]}
                                    />
                                    <Select
                                        size="sm"
                                        className="shrink-0 w-20"
                                        title="Month"
                                        value={ed?.month ?? ''}
                                        onChange={(v) => patchExamDetails({ month: v })}
                                        placeholder="Month —"
                                        options={[
                                            { value: '', label: 'Month —' },
                                            ...['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => ({ value: m, label: m })),
                                        ]}
                                    />
                                    {ed?.exam?.startsWith('JEE') && (
                                        <Select
                                            size="sm"
                                            className="shrink-0 w-24"
                                            title="Shift"
                                            value={ed?.shift ?? ''}
                                            onChange={(v) => patchExamDetails({ shift: v })}
                                            placeholder="Shift —"
                                            options={[
                                                { value: '', label: 'Shift —' },
                                                { value: 'Shift 1', label: 'Shift 1' },
                                                { value: 'Shift 2', label: 'Shift 2' },
                                            ]}
                                        />
                                    )}
                                    {ed?.exam === 'NEET_UG' && (
                                        <Select
                                            size="sm"
                                            className="shrink-0 w-24"
                                            title="Phase"
                                            value={ed?.phase ?? ''}
                                            onChange={(v) => patchExamDetails({ phase: v })}
                                            placeholder="Phase —"
                                            options={[
                                                { value: '', label: 'Phase —' },
                                                { value: 'Phase 1', label: 'Phase 1' },
                                                { value: 'Phase 2', label: 'Phase 2' },
                                            ]}
                                        />
                                    )}
                                    {(ed?.exam === 'JEE_Advanced' || ed?.exam === 'WBJEE') && (
                                        <Select
                                            size="sm"
                                            className="shrink-0 w-24"
                                            title="Paper"
                                            value={ed?.paper ?? ''}
                                            onChange={(v) => patchExamDetails({ paper: v })}
                                            placeholder="Paper —"
                                            options={[
                                                { value: '', label: 'Paper —' },
                                                { value: 'Paper 1', label: 'Paper 1' },
                                                { value: 'Paper 2', label: 'Paper 2' },
                                            ]}
                                        />
                                    )}
                                </>)}
                            </div>
                            </fieldset>
                        );
                    })()}

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

            {/* §6 SECTION_BODY — conditional on adminSection: mock-tests | flags | practice */}
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
                    {!canEditCurrent && (
                        <div className="shrink-0 mx-3 mt-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                            <AlertTriangle size={14} />
                            <span><strong>View only</strong> — your access for this chapter is read-only. Save actions are disabled.</span>
                        </div>
                    )}
                    {/* `<fieldset disabled className="contents">` disables every form control inside
                        without affecting layout. Super admins always pass canEdit, so this fieldset
                        only ever triggers for staff with view-only grants on this chapter. */}
                    <fieldset disabled={!canEditCurrent} className="contents">
                    {/* TOP: Full-width metadata & tagging — 2 compact rows */}
                    <QuestionTaggingRow
                        selectedQuestion={selectedQuestion}
                        questions={questions}
                        chapters={chapters}
                        reclassifying={reclassifying}
                        aiAnalyzing={aiAnalyzing}
                        canDelete={isSuperAdmin}
                        deletingId={deletingId}
                        onReclassify={handleReclassify}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onAITagSuggestion={handleAITagSuggestion}
                        onOpenFlagModal={() => setFlagModalOpen(true)}
                        showTagSuggestions={showTagSuggestions}
                        setShowTagSuggestions={setShowTagSuggestions}
                        tagSuggestions={tagSuggestions}
                    />

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
                                                            const data = await res.json() as { data?: Array<{ _id: string; file: { cdn_url: string } }> };
                                                            const asset = data.data?.find((a) => a.file.cdn_url === videoUrl);
                                                            
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
                        <QuestionPreviewPane
                            selectedQuestion={selectedQuestion}
                            previewMode={previewMode}
                            setPreviewMode={setPreviewMode}
                            optionsLayout={optionsLayout}
                            setOptionsLayout={setOptionsLayout}
                            videoExpanded={videoExpanded}
                            setVideoExpanded={setVideoExpanded}
                            audioExpanded={audioExpanded}
                            setAudioExpanded={setAudioExpanded}
                            getSvgScale={getSvgScale}
                        />
                    </div>
                    </fieldset>
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

            {/* §7 MODALS — Analytics, BulkImport, Export, FlagModal */}
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

            <FlagModal
                isOpen={flagModalOpen}
                onClose={() => setFlagModalOpen(false)}
                onSubmit={submitFlag}
            />
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
