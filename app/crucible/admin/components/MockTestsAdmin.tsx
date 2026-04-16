'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Trash2, Save, Check, AlertCircle, Eye, FileJson,
  ChevronLeft, ChevronRight, LayoutList, LayoutGrid, Monitor, Smartphone,
  Wand2, Filter, MonitorPlay,
} from 'lucide-react';
import MathRenderer from './MathRenderer';
import SVGDropZone from './SVGDropZone';
import SVGScaleControls from './SVGScaleControls';
import VideoDropZone from './VideoDropZone';
import AudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';
import { validateLaTeX, autoFixLatex, type LaTeXValidationResult } from '@/lib/latexValidator';

// Supabase session cookie is sent automatically on same-origin requests.
// No secret header needed — API routes authenticate via the cookie.
function getAdminHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface MockQuestion {
  _id: string;
  question_number: number;
  display_id: string;
  question_text: { markdown: string; latex_validated: boolean };
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ';
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  answer?: { integer_value?: number; decimal_value?: number; unit?: string };
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
    subject: 'chemistry' | 'physics' | 'maths' | 'biology';
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    marks_correct?: number;
    marks_incorrect?: number;
    section?: string;
    topic_hint?: string;
  };
  svg_scales?: Record<string, number>;
  created_at: string;
  updated_at: string;
}

interface MockTestSet {
  _id: string;
  title: string;
  exam: 'JEE' | 'NEET';
  year?: number;
  source?: string;
  duration_minutes: number;
  marks_correct: number;
  marks_incorrect: number;
  sections?: Array<{ name: string; question_range: [number, number] }>;
  questions: MockQuestion[];
  question_count?: number;
  status: 'draft' | 'published' | 'archived';
  description?: string;
  created_at: string;
  updated_at: string;
}

const QUESTION_TYPES = [
  { id: 'SCQ', name: 'Single Correct', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'MCQ', name: 'Multi Correct', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { id: 'NVT', name: 'Numerical', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { id: 'AR', name: 'Assertion-Reason', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { id: 'MST', name: 'Multi-Statement', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { id: 'MTC', name: 'Match Column', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
  { id: 'SUBJ', name: 'Subjective', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
];

const SUBJECT_COLORS: Record<string, string> = {
  physics:   'text-blue-400 bg-blue-500/10 border-blue-500/30',
  chemistry: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  biology:   'text-green-400 bg-green-500/10 border-green-500/30',
  maths:     'text-purple-400 bg-purple-500/10 border-purple-500/30',
};

const DIFF_COLORS = (d: number) =>
  d >= 4 ? 'border-red-500/50 text-red-400' :
  d === 3 ? 'border-orange-500/50 text-orange-400' :
  'border-emerald-500/50 text-emerald-400';

// ── Main Component ─────────────────────────────────────────────────────────────

export default function MockTestsAdmin() {
  // Sets list
  const [sets, setSets] = useState<MockTestSet[]>([]);
  const [loadingSets, setLoadingSets] = useState(true);

  // Selected set + questions
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<MockTestSet | null>(null);
  const [loadingSet, setLoadingSet] = useState(false);
  const [fetchSetError, setFetchSetError] = useState<string | null>(null);

  // Filters
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');

  // Current question (index into filtered list)
  const [currentQIdx, setCurrentQIdx] = useState(0);

  // Editor state (local copy of the selected question being edited)
  const [editingQ, setEditingQ] = useState<MockQuestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [questionLatex, setQuestionLatex] = useState<LaTeXValidationResult | null>(null);
  const [solutionLatex, setSolutionLatex] = useState<LaTeXValidationResult | null>(null);

  // Preview
  const [optionsLayout, setOptionsLayout] = useState<'auto' | 'list' | 'grid'>('auto');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '', exam: 'NEET' as 'JEE' | 'NEET',
    year: new Date().getFullYear(), source: 'Custom',
    duration_minutes: 200, description: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Bulk JSON import
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkError, setBulkError] = useState('');

  // SVG scale overrides (local fast state, debounce-PATCHed to DB)
  const [svgScaleOverrides, setSvgScaleOverrides] = useState<Record<string, number>>({});
  const scaleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchSets = useCallback(async () => {
    setLoadingSets(true);
    try {
      const res = await fetch('/api/v2/mock-tests', { headers: getAdminHeaders() });
      const data = await res.json();
      if (data.success) setSets(data.data);
    } catch (err) {
      console.error('Failed to load mock test sets', err);
    } finally {
      setLoadingSets(false);
    }
  }, []);

  useEffect(() => { fetchSets(); }, [fetchSets]);

  const fetchSet = useCallback(async (id: string) => {
    setLoadingSet(true);
    setFetchSetError(null);
    try {
      const res = await fetch(`/api/v2/mock-tests/${id}`, { headers: getAdminHeaders() });
      const data = await res.json();
      if (data.success) {
        setSelectedSet(data.data);
        setCurrentQIdx(0);
      } else {
        console.error('fetchSet error:', res.status, data.error);
        setFetchSetError(`${res.status}: ${data.error ?? 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to load set', err);
      setFetchSetError('Network error — check console');
    } finally {
      setLoadingSet(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSetId) {
      fetchSet(selectedSetId);
    } else {
      setSelectedSet(null);
      setFetchSetError(null);
    }
  }, [selectedSetId, fetchSet]);

  // ── Filtered questions ────────────────────────────────────────────────────

  const allQuestions = selectedSet?.questions ?? [];
  const filteredQuestions = allQuestions.filter(q => {
    if (filterSubject !== 'all' && q.metadata.subject !== filterSubject) return false;
    if (filterSection !== 'all' && q.metadata.section !== filterSection) return false;
    return true;
  });
  const currentQ = filteredQuestions[currentQIdx] ?? null;

  // All unique sections in the loaded set
  const allSections = Array.from(new Set(allQuestions.map(q => q.metadata.section).filter(Boolean)));

  // Keep currentQIdx in bounds when filters change
  useEffect(() => { setCurrentQIdx(0); }, [filterSubject, filterSection, selectedSetId]);

  // Global keyboard navigation — ArrowLeft / ArrowRight when no input is focused
  useEffect(() => {
    if (!selectedSet) return;
    const onKey = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in a text field, textarea, or select
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentQIdx(i => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentQIdx(i => Math.min((filteredQuestions.length || 1) - 1, i + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedSet, filteredQuestions.length]);

  // Sync editingQ when currentQ changes
  useEffect(() => {
    if (!currentQ) { setEditingQ(null); return; }
    setEditingQ(JSON.parse(JSON.stringify(currentQ)));
    setQuestionLatex(null);
    setSolutionLatex(null);
    setSaveSuccess(false);
    setSvgScaleOverrides({}); // reset local overrides when switching question
  }, [currentQ?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── SVG scale helpers ─────────────────────────────────────────────────────

  const getSvgScale = (field: string): number => {
    if (svgScaleOverrides[field] !== undefined) return svgScaleOverrides[field];
    return editingQ?.svg_scales?.[field] ?? 100;
  };

  const handleScaleChange = (questionId: string, field: string, scale: number) => {
    setSvgScaleOverrides(prev => ({ ...prev, [field]: scale }));
    const newScales = { ...(editingQ?.svg_scales ?? {}), [field]: scale };
    setEditingQ(prev => prev ? { ...prev, svg_scales: newScales } : prev);
    if (scaleDebounceRef.current) clearTimeout(scaleDebounceRef.current);
    scaleDebounceRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/v2/mock-tests/${selectedSetId}/questions/${questionId}`, {
          method: 'PATCH',
          headers: getAdminHeaders(),
          body: JSON.stringify({ svg_scales: newScales }),
        });
      } catch { /* silent — scale is non-critical */ }
    }, 600);
  };

  // ── SVG upload handler — updates local state AND immediately persists to DB ──
  // This prevents SVG links from being lost if the user navigates away before
  // clicking the manual "Save" button.
  const handleSvgUploaded = useCallback(async (
    field: 'question' | 'solution',
    markdownLink: string,
  ) => {
    if (!editingQ || !selectedSetId) return;

    // 1. Update local state immediately so the textarea reflects the new link
    let updatedField: Partial<MockQuestion> = {};
    if (field === 'question') {
      const newMarkdown = editingQ.question_text.markdown + '\n' + markdownLink;
      updatedField = { question_text: { ...editingQ.question_text, markdown: newMarkdown } };
    } else {
      const newMarkdown = editingQ.solution.text_markdown + '\n' + markdownLink;
      updatedField = { solution: { ...editingQ.solution, text_markdown: newMarkdown } };
    }
    setEditingQ(prev => prev ? { ...prev, ...updatedField } : prev);

    // 2. Immediately PATCH just that field to the DB (no manual Save needed)
    try {
      await fetch(`/api/v2/mock-tests/${selectedSetId}/questions/${editingQ._id}`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify(updatedField),
      });
    } catch {
      // Non-critical — user can still click Save manually as fallback
      console.warn('[MockTestsAdmin] Auto-save after SVG upload failed — use Save button');
    }
  }, [editingQ, selectedSetId]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateSet = async () => {
    if (!createForm.title.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/v2/mock-tests', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ ...createForm }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setCreateForm({ title: '', exam: 'NEET', year: new Date().getFullYear(), source: 'Custom', duration_minutes: 200, description: '' });
        await fetchSets();
        setSelectedSetId(data.data._id);
      } else {
        setCreateError(data.error ?? 'Failed to create set');
      }
    } catch {
      setCreateError('Network error');
    } finally {
      setCreating(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!editingQ || !selectedSetId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v2/mock-tests/${selectedSetId}/questions/${editingQ._id}`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify(editingQ),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await fetchSet(selectedSetId);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedSetId) return;
    const res = await fetch(`/api/v2/mock-tests/${selectedSetId}/questions`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({
        question_text: { markdown: 'New question', latex_validated: false },
        type: 'SCQ',
        options: [
          { id: 'a', text: 'Option A', is_correct: true },
          { id: 'b', text: 'Option B', is_correct: false },
          { id: 'c', text: 'Option C', is_correct: false },
          { id: 'd', text: 'Option D', is_correct: false },
        ],
        solution: { text_markdown: 'Solution', latex_validated: false },
        metadata: { subject: 'physics', difficultyLevel: 3, section: 'Section A', marks_correct: 4, marks_incorrect: -1 },
      }),
    });
    const data = await res.json();
    if (data.success) {
      await fetchSet(selectedSetId);
      // Jump to new question (last in unfiltered list)
      setFilterSubject('all');
      setFilterSection('all');
      setTimeout(() => setCurrentQIdx(allQuestions.length), 100);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!editingQ || !selectedSetId || !window.confirm('Delete this question?')) return;
    await fetch(`/api/v2/mock-tests/${selectedSetId}/questions/${editingQ._id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    await fetchSet(selectedSetId);
    setCurrentQIdx(prev => Math.max(0, prev - 1));
  };

  const handlePublishToggle = async () => {
    if (!selectedSet || !selectedSetId) return;
    const newStatus = selectedSet.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/v2/mock-tests/${selectedSetId}`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setSelectedSet(prev => prev ? { ...prev, status: newStatus } : prev);
      setSets(prev => prev.map(s => s._id === selectedSetId ? { ...s, status: newStatus } : s));
    }
  };

  const handleBulkImport = async () => {
    if (!selectedSetId || !bulkJson.trim()) return;
    setBulkImporting(true);
    setBulkError('');
    try {
      const parsed = JSON.parse(bulkJson);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const q of list) {
        await fetch(`/api/v2/mock-tests/${selectedSetId}/questions`, {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify(q),
        });
      }
      await fetchSet(selectedSetId);
      setShowBulkImport(false);
      setBulkJson('');
    } catch (e: unknown) {
      setBulkError(e instanceof Error ? e.message : 'Invalid JSON');
    } finally {
      setBulkImporting(false);
    }
  };

  const setOptionCorrect = (optId: string, correct: boolean) => {
    if (!editingQ) return;
    const isMulti = editingQ.type === 'MCQ';
    setEditingQ(prev => prev ? {
      ...prev,
      options: prev.options.map(o =>
        o.id === optId ? { ...o, is_correct: correct }
          : isMulti ? o : { ...o, is_correct: false }
      ),
    } : prev);
  };

  // ── Derived helpers ───────────────────────────────────────────────────────

  const qTypeInfo = (type: string) => QUESTION_TYPES.find(t => t.id === type);

  const shouldUseGrid = (q: MockQuestion | null) => {
    if (!q || q.type === 'NVT' || q.type === 'SUBJ') return false;
    if (optionsLayout === 'grid') return true;
    if (optionsLayout === 'list') return false;
    const avg = q.options.reduce((s, o) => s + o.text.length, 0) / (q.options.length || 1);
    return avg < 20 && Math.max(...q.options.map(o => o.text.length)) < 25;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ══ TOP TOOLBAR ════════════════════════════════════════════════════════ */}
      <div className="shrink-0 border-b border-gray-800/50 bg-gray-950/60">
        <div className="flex items-center gap-2 px-3 py-2 flex-wrap">

          {/* Mock test selector dropdown */}
          <div className="flex items-center gap-1.5">
            {loadingSets ? (
              <div className="text-xs text-gray-500 px-2">Loading…</div>
            ) : (
              <select
                value={selectedSetId ?? ''}
                onChange={e => setSelectedSetId(e.target.value || null)}
                className="bg-gray-800/70 border border-gray-700/50 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:border-orange-500 outline-none max-w-xs"
              >
                <option value="">— Select Mock Test —</option>
                {sets.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.title} ({s.question_count ?? s.questions?.length ?? 0}Q)
                  </option>
                ))}
              </select>
            )}
            {/* New test button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold rounded-lg hover:opacity-90 transition shrink-0"
              title="Create new mock test set"
            >
              <Plus size={12} /> New
            </button>
          </div>

          {/* Set metadata badges */}
          {selectedSet && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-mono ${
                selectedSet.exam === 'JEE'
                  ? 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10'
                  : 'text-green-400 border-green-500/40 bg-green-500/10'
              }`}>{selectedSet.exam}</span>
              <span className="text-[11px] text-gray-500">
                {Math.floor(selectedSet.duration_minutes / 60)}h {selectedSet.duration_minutes % 60}m
              </span>
              <button
                onClick={handlePublishToggle}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-bold transition ${
                  selectedSet.status === 'published'
                    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40'
                    : 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/40'
                }`}
                title={selectedSet.status === 'published' ? 'Click to unpublish' : 'Click to publish'}
              >
                {selectedSet.status === 'published' ? '● LIVE' : '○ DRAFT'}
              </button>
            </div>
          )}

          {/* Divider */}
          {selectedSet && <div className="w-px h-5 bg-gray-700/60 mx-1 shrink-0" />}

          {/* Question navigation */}
          {selectedSet && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setCurrentQIdx(i => Math.max(0, i - 1))}
                disabled={currentQIdx === 0}
                aria-label="Previous question (←)"
                title="Previous question (← arrow key)"
                className="p-1.5 rounded-lg bg-gray-800/70 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              ><ChevronLeft size={16} /></button>

              {/* Jump-to dropdown */}
              {filteredQuestions.length > 0 ? (
                <select
                  value={currentQIdx}
                  onChange={e => setCurrentQIdx(Number(e.target.value))}
                  aria-label="Jump to question"
                  className="bg-gray-800/70 border border-gray-700/50 rounded-lg px-2 py-1 text-xs text-gray-300 font-mono tabular-nums focus:border-orange-500 outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer max-w-[9rem]"
                >
                  {filteredQuestions.map((q, i) => (
                    <option key={q._id} value={i}>
                      {`Q${i + 1}${q.display_id ? ` · ${q.display_id}` : ''}`}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-gray-500 px-1">—</span>
              )}

              <button
                onClick={() => setCurrentQIdx(i => Math.min(filteredQuestions.length - 1, i + 1))}
                disabled={currentQIdx >= filteredQuestions.length - 1}
                aria-label="Next question (→)"
                title="Next question (→ arrow key)"
                className="p-1.5 rounded-lg bg-gray-800/70 hover:bg-gray-700/60 border border-gray-700/50 hover:border-gray-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              ><ChevronRight size={16} /></button>
            </div>
          )}

          {/* Filters */}
          {selectedSet && (
            <>
              <Filter size={11} className="text-orange-400 shrink-0" />

              {/* Subject filter */}
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-orange-500 outline-none ${filterSubject !== 'all' ? 'border-orange-500/60 text-orange-300' : 'border-gray-700/50'}`}
              >
                <option value="all">All Subjects</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="maths">Maths</option>
              </select>

              {/* Section filter */}
              {allSections.length > 0 && (
                <select
                  value={filterSection}
                  onChange={e => setFilterSection(e.target.value)}
                  className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-orange-500 outline-none ${filterSection !== 'all' ? 'border-orange-500/60 text-orange-300' : 'border-gray-700/50'}`}
                >
                  <option value="all">All Sections</option>
                  {allSections.map(s => <option key={s} value={s!}>{s}</option>)}
                </select>
              )}
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Add question + bulk import + save */}
          {selectedSet && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800/70 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 text-xs font-semibold rounded-lg transition"
              ><Plus size={12} /> Add Q</button>
              <button
                onClick={() => setShowBulkImport(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800/70 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 text-xs rounded-lg transition"
                title="Bulk JSON import"
              ><FileJson size={12} /></button>
              {editingQ && (
                <button
                  onClick={handleSaveQuestion}
                  disabled={saving}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    saveSuccess
                      ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-400'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:opacity-90'
                  }`}
                >
                  {saveSuccess ? <><Check size={12} /> Saved</> : saving ? <><Save size={12} className="animate-spin" /> Saving…</> : <><Save size={12} /> Save</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════════════ */}

      {/* Loading / error / empty states */}
      {loadingSet && (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Loading…</div>
      )}
      {!loadingSet && fetchSetError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <AlertCircle size={28} className="text-red-400" />
          <div className="text-sm text-red-400 font-mono">{fetchSetError}</div>
          <div className="text-xs text-gray-500">Restart the dev server if this persists (env var may not be inlined yet)</div>
        </div>
      )}
      {!loadingSet && !fetchSetError && !selectedSet && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center text-gray-500">
          <div className="text-4xl opacity-30">📋</div>
          <div className="text-sm">Select a mock test from the dropdown above, or create a new one.</div>
        </div>
      )}
      {!loadingSet && !fetchSetError && selectedSet && filteredQuestions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center text-gray-500">
          <div className="text-4xl opacity-30">🔍</div>
          <div className="text-sm">No questions match the current filters.</div>
          <button
            onClick={() => { setFilterSubject('all'); setFilterSection('all'); }}
            className="text-xs text-orange-400 hover:underline"
          >Clear filters</button>
        </div>
      )}

      {/* ── Split: editor left | preview right ─────────────────────────────── */}
      {!loadingSet && !fetchSetError && selectedSet && filteredQuestions.length > 0 && editingQ && (
        <div className="flex-1 flex overflow-hidden">

          {/* ══ LEFT: Editor ══════════════════════════════════════════════════ */}
          <div className="w-1/2 flex flex-col overflow-hidden border-r border-gray-800/50">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* ── Metadata row ── */}
              <div className="flex items-end gap-2 flex-wrap">

                {/* Display ID (read-only) */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-500">ID</span>
                  <input readOnly value={editingQ.display_id}
                    className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs font-mono text-purple-400 outline-none w-28" />
                </div>

                {/* Q# (read-only) */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-500">Q#</span>
                  <input readOnly value={`Q${editingQ.question_number}`}
                    className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs font-mono text-gray-400 outline-none w-14" />
                </div>

                {/* Type */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-500">Type</span>
                  <select value={editingQ.type}
                    onChange={e => {
                      const t = e.target.value as MockQuestion['type'];
                      const needsOptions = t !== 'NVT' && t !== 'SUBJ';
                      setEditingQ(prev => prev ? {
                        ...prev, type: t,
                        options: needsOptions && (!prev.options || prev.options.length === 0)
                          ? [{ id: 'a', text: 'Option A', is_correct: true }, { id: 'b', text: 'Option B', is_correct: false }, { id: 'c', text: 'Option C', is_correct: false }, { id: 'd', text: 'Option D', is_correct: false }]
                          : prev.options,
                      } : prev);
                    }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none">
                    {QUESTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-500">Subject</span>
                  <select value={editingQ.metadata.subject}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, metadata: { ...prev.metadata, subject: e.target.value as 'chemistry' | 'physics' | 'maths' | 'biology' } } : prev)}
                    className="bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-xs outline-none capitalize">
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="maths">Maths</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-500">Difficulty</span>
                  <select value={editingQ.metadata.difficultyLevel}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, metadata: { ...prev.metadata, difficultyLevel: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 } } : prev)}
                    className={`bg-gray-800/50 border rounded px-2 py-1 text-xs outline-none ${DIFF_COLORS(editingQ.metadata.difficultyLevel)}`}>
                    <option value="1">D1 — Easy</option>
                    <option value="2">D2 — Easy+</option>
                    <option value="3">D3 — Medium</option>
                    <option value="4">D4 — Hard</option>
                    <option value="5">D5 — Challenge</option>
                  </select>
                </div>

                {/* Delete button */}
                <button onClick={handleDeleteQuestion}
                  className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-800/50 hover:bg-red-600/20 border border-gray-700/50 hover:border-red-500/40 text-gray-500 hover:text-red-400 text-xs transition"
                  title="Delete this question">
                  <Trash2 size={12} />
                </button>
              </div>

              {/* ── Section & Topic Hint ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Section</label>
                  <input value={editingQ.metadata.section ?? ''}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, metadata: { ...prev.metadata, section: e.target.value } } : prev)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-xs outline-none focus:border-orange-500"
                    placeholder="e.g. Section A" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Topic Hint</label>
                  <input value={editingQ.metadata.topic_hint ?? ''}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, metadata: { ...prev.metadata, topic_hint: e.target.value } } : prev)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-xs outline-none focus:border-orange-500"
                    placeholder="e.g. Fluid Mechanics" />
                </div>
              </div>

              {/* ── Marks ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Marks (Correct)</label>
                  <input type="number" value={editingQ.metadata.marks_correct ?? selectedSet.marks_correct}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, metadata: { ...prev.metadata, marks_correct: Number(e.target.value) } } : prev)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-xs outline-none focus:border-orange-500 text-emerald-400" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Marks (Incorrect)</label>
                  <input type="number" value={editingQ.metadata.marks_incorrect ?? selectedSet.marks_incorrect}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, metadata: { ...prev.metadata, marks_incorrect: Number(e.target.value) } } : prev)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-xs outline-none focus:border-orange-500 text-red-400" />
                </div>
              </div>

              {/* ── Question Text ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 font-medium">Question Text</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const r = validateLaTeX(editingQ.question_text.markdown);
                        setQuestionLatex(r);
                      }}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 transition"
                    >Validate LaTeX</button>
                    <button
                      onClick={() => {
                        const r = autoFixLatex(editingQ.question_text.markdown);
                        if (r.fixesApplied.length === 0) return;
                        setEditingQ(prev => prev ? { ...prev, question_text: { ...prev.question_text, markdown: r.text } } : prev);
                      }}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-600/30 transition"
                    ><Wand2 size={10} /> Auto-fix</button>
                  </div>
                </div>
                {questionLatex && questionLatex.errors.length > 0 && (
                  <div className="mb-2 text-[11px] text-red-400 bg-red-900/20 border border-red-600/30 rounded-lg px-3 py-2 space-y-0.5">
                    {questionLatex.errors.map((e, i) => <div key={i}>⚠ {e.message}</div>)}
                  </div>
                )}
                {questionLatex && questionLatex.errors.length === 0 && (
                  <div className="mb-2 text-[11px] text-emerald-400 bg-emerald-900/20 border border-emerald-600/30 rounded-lg px-3 py-2">✓ LaTeX looks good</div>
                )}
                <div className="flex gap-3 items-stretch">
                  <textarea
                    value={editingQ.question_text.markdown}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, question_text: { ...prev.question_text, markdown: e.target.value } } : prev)}
                    className="flex-1 bg-gray-800/70 border-2 border-gray-600/70 rounded-lg px-4 py-3 text-sm leading-relaxed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none resize-y font-mono min-h-[10rem] text-gray-100"
                    placeholder="Question text (LaTeX: $...$ only, never $$...$$)"
                  />
                  <div className="w-28 shrink-0 flex flex-col gap-2">
                    <SVGDropZone
                      questionId={editingQ._id}
                      fieldType="question"
                      context="mock_test"
                      onUploaded={(markdownLink) => handleSvgUploaded('question', markdownLink)}
                    />
                    <SVGScaleControls
                      step={5}
                      initialScale={getSvgScale('question')}
                      onScaleChange={(scale) => handleScaleChange(editingQ._id, 'question', scale)}
                    />
                  </div>
                </div>
              </div>

              {/* ── Options (SCQ / MCQ / etc.) ── */}
              {editingQ.type !== 'NVT' && editingQ.type !== 'SUBJ' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500 font-medium">Options</label>
                    <button
                      onClick={() => setEditingQ(prev => {
                        if (!prev) return prev;
                        const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
                        const newId = ids[prev.options.length] ?? `opt${prev.options.length}`;
                        return { ...prev, options: [...prev.options, { id: newId, text: `Option ${newId.toUpperCase()}`, is_correct: false }] };
                      })}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-400 transition"
                    ><Plus size={10} /> Add Option</button>
                  </div>
                  <div className="space-y-2">
                    {editingQ.options.map((opt) => (
                      <div key={opt.id} className="flex items-start gap-2">
                        <button
                          onClick={() => setOptionCorrect(opt.id, !opt.is_correct)}
                          className={`mt-1 shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold border transition ${
                            opt.is_correct
                              ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300'
                              : 'bg-gray-700/30 border-gray-600/50 text-gray-400 hover:border-gray-500'
                          }`}
                        >{opt.id.toUpperCase()}</button>
                        <textarea
                          value={opt.text}
                          onChange={e => setEditingQ(prev => prev ? {
                            ...prev,
                            options: prev.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o)
                          } : prev)}
                          rows={2}
                          className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-xs font-mono leading-relaxed focus:border-purple-500 outline-none resize-none text-gray-200"
                        />
                        <div className="shrink-0 flex flex-col gap-1 mt-1">
                          <SVGScaleControls
                            compact={true}
                            step={5}
                            initialScale={getSvgScale(`option_${opt.id}`)}
                            onScaleChange={(scale) => handleScaleChange(editingQ._id, `option_${opt.id}`, scale)}
                          />
                          <button
                            onClick={() => setEditingQ(prev => prev ? { ...prev, options: prev.options.filter(o => o.id !== opt.id) } : prev)}
                            className="p-1.5 rounded hover:bg-red-600/20 text-gray-600 hover:text-red-400 transition"
                          ><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── NVT answer ── */}
              {editingQ.type === 'NVT' && (
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-2">Numerical Answer</label>
                  <input
                    type="text"
                    value={
                      editingQ.answer?.integer_value !== undefined ? editingQ.answer.integer_value
                      : editingQ.answer?.decimal_value !== undefined ? editingQ.answer.decimal_value
                      : ''
                    }
                    onChange={e => {
                      const raw = e.target.value;
                      if (raw !== '' && !/^-?\d*\.?\d*$/.test(raw)) return;
                      const num = parseFloat(raw);
                      const isDecimal = raw.includes('.');
                      const ans = isNaN(num) || raw === '' || raw === '-'
                        ? {}
                        : isDecimal ? { decimal_value: num } : { integer_value: num };
                      setEditingQ(prev => prev ? { ...prev, answer: ans } : prev);
                    }}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-2xl font-bold text-blue-400 focus:border-purple-500 outline-none"
                    placeholder="e.g. -5, 3.14"
                  />
                </div>
              )}

              {/* ── Solution ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 font-medium">Solution</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const r = validateLaTeX(editingQ.solution.text_markdown);
                        setSolutionLatex(r);
                      }}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 transition"
                    >Validate LaTeX</button>
                    <button
                      onClick={() => {
                        const r = autoFixLatex(editingQ.solution.text_markdown);
                        if (r.fixesApplied.length === 0) return;
                        setEditingQ(prev => prev ? { ...prev, solution: { ...prev.solution, text_markdown: r.text } } : prev);
                      }}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-600/30 transition"
                    ><Wand2 size={10} /> Auto-fix</button>
                  </div>
                </div>
                {solutionLatex && solutionLatex.errors.length > 0 && (
                  <div className="mb-2 text-[11px] text-red-400 bg-red-900/20 border border-red-600/30 rounded-lg px-3 py-2 space-y-0.5">
                    {solutionLatex.errors.map((e, i) => <div key={i}>⚠ {e.message}</div>)}
                  </div>
                )}
                {solutionLatex && solutionLatex.errors.length === 0 && (
                  <div className="mb-2 text-[11px] text-emerald-400 bg-emerald-900/20 border border-emerald-600/30 rounded-lg px-3 py-2">✓ LaTeX looks good</div>
                )}
                <div className="flex gap-3 items-stretch">
                  <textarea
                    value={editingQ.solution.text_markdown}
                    onChange={e => setEditingQ(prev => prev ? { ...prev, solution: { ...prev.solution, text_markdown: e.target.value } } : prev)}
                    className="flex-1 bg-gray-800/70 border-2 border-gray-600/70 rounded-lg px-4 py-3 text-sm leading-relaxed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none resize-y font-mono min-h-[8rem] text-gray-100"
                    placeholder="Solution explanation…"
                  />
                  <div className="w-28 shrink-0 flex flex-col gap-2">
                    <SVGDropZone
                      questionId={editingQ._id}
                      fieldType="solution"
                      context="mock_test"
                      onUploaded={(markdownLink) => handleSvgUploaded('solution', markdownLink)}
                    />
                    <SVGScaleControls
                      step={5}
                      initialScale={getSvgScale('solution')}
                      onScaleChange={(scale) => handleScaleChange(editingQ._id, 'solution', scale)}
                    />
                  </div>
                </div>
              </div>

              {/* ── Solution Video URL + Video Drop Zone ── */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">Solution Video</label>
                {editingQ.solution.video_url && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <MonitorPlay size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs text-blue-300 font-mono truncate flex-1">{editingQ.solution.video_url}</span>
                    <button
                      onClick={() => setEditingQ(prev => prev ? { ...prev, solution: { ...prev.solution, video_url: '' } } : prev)}
                      className="text-xs px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded border border-red-500/40 transition shrink-0"
                    >Remove</button>
                  </div>
                )}
                <input
                  type="text"
                  value={editingQ.solution.video_url ?? ''}
                  onChange={e => setEditingQ(prev => prev ? { ...prev, solution: { ...prev.solution, video_url: e.target.value } } : prev)}
                  placeholder="Paste YouTube or video URL…"
                  className="w-full bg-gray-800/70 border border-gray-600/70 rounded-lg px-3 py-2 text-xs focus:border-purple-500 outline-none text-gray-200 mb-2"
                />
                <p className="text-[10px] text-gray-600 mb-2">Or drag & drop an MP4 below to upload directly to Cloudflare R2:</p>
                <VideoDropZone
                  questionId={editingQ._id}
                  context="mock_test"
                  onUploaded={(videoUrl) => {
                    setEditingQ(prev => prev ? { ...prev, solution: { ...prev.solution, video_url: videoUrl } } : prev);
                  }}
                />
              </div>

              {/* ── Audio Solution ── */}
              <AudioRecorder
                questionId={editingQ._id}
                context="mock_test"
                existingAudioUrl={editingQ.solution.asset_ids?.audio?.[0]}
                onAudioSaved={(url) => {
                  setEditingQ(prev => prev ? {
                    ...prev,
                    solution: {
                      ...prev.solution,
                      asset_ids: {
                        ...prev.solution.asset_ids,
                        audio: [url],
                      },
                    },
                  } : prev);
                }}
                onAudioDeleted={() => {
                  setEditingQ(prev => prev ? {
                    ...prev,
                    solution: {
                      ...prev.solution,
                      asset_ids: {
                        ...prev.solution.asset_ids,
                        audio: [],
                      },
                    },
                  } : prev);
                }}
              />

            </div>{/* end scroll area */}
          </div>{/* end left panel */}

          {/* ══ RIGHT: Live Preview ══════════════════════════════════════════ */}
          <div className="w-1/2 flex flex-col overflow-hidden bg-gray-950/50">

            {/* Preview toolbar */}
            <div className="p-3 border-b border-gray-800/50 bg-gray-900/50 flex items-center justify-between gap-3 shrink-0">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Eye size={14} /> Live Preview
              </h3>
              <div className="flex items-center gap-2">
                {/* Options layout */}
                {editingQ.type !== 'NVT' && editingQ.type !== 'SUBJ' && (
                  <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-0.5">
                    <button onClick={() => setOptionsLayout('list')} title="List"
                      className={`p-1.5 rounded-md transition ${optionsLayout === 'list' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      <LayoutList size={13} /></button>
                    <button onClick={() => setOptionsLayout('auto')} title="Auto"
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${optionsLayout === 'auto' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      AUTO</button>
                    <button onClick={() => setOptionsLayout('grid')} title="Grid"
                      className={`p-1.5 rounded-md transition ${optionsLayout === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      <LayoutGrid size={13} /></button>
                  </div>
                )}
                {/* Device */}
                <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-0.5">
                  <button onClick={() => setPreviewDevice('desktop')} title="Desktop"
                    className={`p-1.5 rounded-md transition ${previewDevice === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Monitor size={13} /></button>
                  <button onClick={() => setPreviewDevice('mobile')} title="Mobile"
                    className={`p-1.5 rounded-md transition ${previewDevice === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Smartphone size={13} /></button>
                </div>
              </div>
            </div>

            {/* Preview body */}
            <div className="flex-1 overflow-y-auto p-4 flex justify-center">
              <div className={`space-y-4 transition-all duration-300 ${
                previewDevice === 'mobile'
                  ? 'w-[420px] border border-gray-700/60 rounded-2xl overflow-y-auto shadow-2xl shadow-black/50 bg-gray-900 max-h-full'
                  : 'w-full max-w-[860px]'
              }`}>
                {previewDevice === 'mobile' && (
                  <div className="flex items-center justify-center py-2 bg-gray-950/80 border-b border-gray-800">
                    <div className="w-16 h-1 bg-gray-600 rounded-full" />
                  </div>
                )}

                {/* Question card */}
                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${previewDevice === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                  {/* Badge row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-mono text-purple-400">{editingQ.display_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${qTypeInfo(editingQ.type)?.color}`}>
                      {editingQ.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${SUBJECT_COLORS[editingQ.metadata.subject]}`}>
                      {editingQ.metadata.subject}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      editingQ.metadata.difficultyLevel >= 4 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      editingQ.metadata.difficultyLevel === 3 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>D{editingQ.metadata.difficultyLevel}</span>
                    {editingQ.metadata.section && (
                      <span className="text-xs text-gray-500 font-mono">{editingQ.metadata.section}</span>
                    )}
                    <span className="text-xs text-emerald-400 font-mono">+{editingQ.metadata.marks_correct ?? selectedSet.marks_correct}</span>
                    <span className="text-xs text-red-400 font-mono">{editingQ.metadata.marks_incorrect ?? selectedSet.marks_incorrect}</span>
                  </div>

                  {/* Question text */}
                  <MathRenderer
                    markdown={editingQ.question_text.markdown}
                    className="text-gray-300"
                    fontSize={20}
                    imageScale={getSvgScale('question')}
                  />

                  {/* Options */}
                  {editingQ.type !== 'NVT' && editingQ.type !== 'SUBJ' && (
                    <div className={`mt-4 ${shouldUseGrid(editingQ) ? 'grid grid-cols-2 gap-3' : 'space-y-2'}`}>
                      {editingQ.options.map(opt => (
                        <div key={opt.id} className="flex items-center gap-3">
                          <div className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${
                            opt.is_correct
                              ? 'bg-green-600/30 text-green-300 border border-green-500/60'
                              : 'bg-gray-700/40 text-gray-300 border border-gray-600/60'
                          }`}>{opt.id.toUpperCase()}</div>
                          <div className={`flex-1 p-3 rounded-lg border ${
                            opt.is_correct
                              ? 'bg-green-900/20 border-green-600/50'
                              : 'bg-gray-800/30 border-gray-700/50'
                          }`}>
                            <MathRenderer markdown={opt.text} className="text-gray-300 option-text" fontSize={20} imageScale={getSvgScale(`option_${opt.id}`)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* NVT answer */}
                  {editingQ.type === 'NVT' && (
                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">Answer</div>
                      <div className="text-2xl font-bold text-blue-300">
                        {editingQ.answer?.integer_value ?? editingQ.answer?.decimal_value ?? '—'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Solution card */}
                <div className={`bg-gray-900/50 rounded-xl border border-gray-800/50 ${previewDevice === 'mobile' ? 'p-4 rounded-none border-x-0' : 'p-6'}`}>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Solution</h4>

                  {/* Media controls — video & audio buttons */}
                  {(editingQ.solution.video_url || (editingQ.solution.asset_ids?.audio && editingQ.solution.asset_ids.audio.length > 0)) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editingQ.solution.video_url && (
                        <a
                          href={editingQ.solution.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-blue-900/40"
                        >
                          <MonitorPlay size={16} />
                          Watch Video Solution
                        </a>
                      )}
                      {editingQ.solution.asset_ids?.audio?.[0] && (
                        <AudioPlayer
                          src={editingQ.solution.asset_ids.audio[0]}
                          label="Audio Solution"
                        />
                      )}
                    </div>
                  )}

                  <MathRenderer markdown={editingQ.solution.text_markdown} className="text-gray-300" fontSize={18} imageScale={getSvgScale('solution')} />
                  {editingQ.metadata.topic_hint && (
                    <div className="mt-3 text-[10px] text-gray-600 font-mono">Topic: {editingQ.metadata.topic_hint}</div>
                  )}
                </div>
              </div>
            </div>
          </div>{/* end right panel */}

        </div>
      )}

      {/* ══ CREATE MODAL ═══════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#151E32] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4">Create Mock Test Set</h2>
            {createError && (
              <div className="mb-3 flex items-start gap-2 px-3 py-2.5 bg-red-900/30 border border-red-500/40 rounded-lg text-red-300 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {createError}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Title *</label>
                <input value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
                  placeholder="NEET Mock Test — 002" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Exam</label>
                  <select value={createForm.exam} onChange={e => setCreateForm(f => ({ ...f, exam: e.target.value as 'JEE' | 'NEET' }))}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm outline-none">
                    <option value="NEET">NEET</option>
                    <option value="JEE">JEE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Duration (min)</label>
                  <input type="number" value={createForm.duration_minutes}
                    onChange={e => setCreateForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Description</label>
                <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setShowCreateModal(false); setCreateError(''); }}
                className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 text-sm rounded-lg transition">
                Cancel
              </button>
              <button onClick={handleCreateSet} disabled={creating || !createForm.title.trim()}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition">
                {creating ? 'Creating…' : 'Create Set'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ BULK IMPORT MODAL ══════════════════════════════════════════════════ */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#151E32] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">Bulk JSON Import</h2>
            <p className="text-xs text-gray-500 mb-3">Paste an array of question objects (or a single object). Each question will be appended to the current set.</p>
            {bulkError && (
              <div className="mb-2 text-xs text-red-400 bg-red-900/20 border border-red-600/30 rounded-lg px-3 py-2">{bulkError}</div>
            )}
            <textarea
              value={bulkJson}
              onChange={e => setBulkJson(e.target.value)}
              rows={14}
              className="w-full bg-gray-900/70 border border-gray-700/50 rounded-lg px-3 py-2 text-xs font-mono text-gray-200 outline-none focus:border-orange-500 resize-none"
              placeholder='[{"question_text": {"markdown": "..."}, "type": "SCQ", ...}]'
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowBulkImport(false); setBulkJson(''); setBulkError(''); }}
                className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 text-sm rounded-lg transition">
                Cancel
              </button>
              <button onClick={handleBulkImport} disabled={bulkImporting || !bulkJson.trim()}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition">
                {bulkImporting ? 'Importing…' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
