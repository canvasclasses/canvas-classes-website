'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Trash2, Save, X, FolderPlus, Loader2,
  Eye, List, CheckCircle, AlertCircle, Tag, RefreshCw, Hash,
  ChevronLeft, ChevronRight, ArrowDownAZ, ArrowUpAZ,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SVGDropZone from '../components/SVGDropZone';
import FlashcardImageScaleControls from '../components/FlashcardImageScaleControls';
import { flashcardMarkdownComponents } from '@/app/lib/flashcardMarkdown';
import { getCategoryNames, getFlashcardChaptersByCategory } from '@/lib/flashcardTaxonomy';

interface Flashcard {
  _id: string;
  flashcard_id: string;
  chapter: { id: string; name: string; category: string };
  topic: { name: string; order: number };
  question: string;
  answer: string;
  metadata: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags: string[];
    source: string;
    class_num: number;
    flashcard_type?: 'standard' | 'true-false';
  };
}

const CATEGORIES = getCategoryNames();
const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-red-500/20 text-red-400',
};

// Read initial query-param value in a way that's safe during SSR
// (returns the default on the server; hydrates on client).
function readParam(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(key) ?? fallback;
}
function readParamInt(key: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  const raw = new URLSearchParams(window.location.search).get(key);
  const n = raw == null ? NaN : parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export default function EnhancedFlashcardAdmin() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => readParam('q', ''));
  const [selectedCategory, setSelectedCategory] = useState<string>(() => readParam('category', 'All'));
  const [selectedChapter, setSelectedChapter] = useState<string>(() => readParam('chapter', 'All'));
  const [selectedTopic, setSelectedTopic] = useState<string>(() => readParam('topic', 'All'));
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showTopicManager, setShowTopicManager] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => (readParam('sort', 'asc') === 'desc' ? 'desc' : 'asc'));
  const [page, setPage] = useState(() => readParamInt('page', 1));
  const [pageSize, setPageSize] = useState(() => readParamInt('ps', 50));
  const [jumpValue, setJumpValue] = useState('');

  // Card ID to auto-open once flashcards finish loading. Captured on first
  // render only — after that, selectedFlashcard drives the URL.
  const pendingCardIdRef = useRef<string | null>(readParam('card', '') || null);

  // ── Auto-save plumbing ──────────────────────────────────────────────────
  // `autoSaveStatus` drives the small indicator next to the Save button.
  // `lastSavedAt` is shown when status is 'saved'.
  // `autoSaveTimerRef` holds the debounce handle so we can cancel/flush it.
  // `saveInFlightRef` blocks overlapping saves (auto + manual clicks).
  type AutoSaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveInFlightRef = useRef(false);

  const [formData, setFormData] = useState({
    flashcard_id: '',
    chapter_name: '',
    category: 'Physical Chemistry',
    topic_name: '',
    question: '',
    answer: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    source: 'NCERT',
    class_num: 12,
    flashcard_type: 'standard' as 'standard' | 'true-false',
  });

  useEffect(() => { fetchFlashcards(); }, []);

  // Reset topic filter whenever chapter changes — but not on first render,
  // so URL-hydrated values survive the initial mount.
  const skipTopicResetRef = useRef(true);
  useEffect(() => {
    if (skipTopicResetRef.current) { skipTopicResetRef.current = false; return; }
    setSelectedTopic('All');
  }, [selectedChapter, selectedCategory]);

  // Open the card referenced in the URL as soon as the list loads.
  useEffect(() => {
    const id = pendingCardIdRef.current;
    if (!id || flashcards.length === 0) return;
    const card = flashcards.find(f => f.flashcard_id === id);
    pendingCardIdRef.current = null; // consume regardless of hit/miss
    if (card) {
      setSelectedFlashcard(card);
      setFormData({
        flashcard_id: card.flashcard_id,
        chapter_name: card.chapter.name,
        category: card.chapter.category,
        topic_name: card.topic.name,
        question: card.question,
        answer: card.answer,
        difficulty: card.metadata.difficulty || 'medium',
        source: card.metadata.source || 'NCERT',
        class_num: card.metadata.class_num || 12,
        flashcard_type: card.metadata.flashcard_type || 'standard',
      });
      setIsEditing(true);
      setIsCreating(false);
    }
  }, [flashcards]);

  // Keep the URL in sync with filter/sort/pagination/selection state so that
  // a page refresh lands the user back exactly where they were.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedChapter !== 'All') params.set('chapter', selectedChapter);
    if (selectedTopic !== 'All') params.set('topic', selectedTopic);
    if (searchQuery) params.set('q', searchQuery);
    if (sortOrder !== 'asc') params.set('sort', sortOrder);
    if (page !== 1) params.set('page', String(page));
    if (pageSize !== 50) params.set('ps', String(pageSize));
    if (selectedFlashcard) params.set('card', selectedFlashcard.flashcard_id);
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    // replaceState avoids cluttering history and never triggers a re-render.
    window.history.replaceState(null, '', url);
  }, [selectedCategory, selectedChapter, selectedTopic, searchQuery, sortOrder, page, pageSize, selectedFlashcard]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v2/flashcards?limit=5000');
      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch {
      showMessage('error', 'Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  };

  // Derived: is the form different from the last-saved source of truth?
  // Used by auto-save to decide whether there's anything worth writing.
  // For a brand-new (creating) card we consider it dirty so the user sees
  // the "Unsaved changes" hint, but auto-save still won't fire on creates.
  const isDirty = useMemo(() => {
    if (isCreating) return true;
    if (!selectedFlashcard) return false;
    return (
      formData.chapter_name !== selectedFlashcard.chapter.name ||
      formData.category     !== selectedFlashcard.chapter.category ||
      formData.topic_name   !== selectedFlashcard.topic.name ||
      formData.question     !== selectedFlashcard.question ||
      formData.answer       !== selectedFlashcard.answer ||
      formData.difficulty   !== (selectedFlashcard.metadata.difficulty   || 'medium') ||
      formData.source       !== (selectedFlashcard.metadata.source       || 'NCERT') ||
      formData.class_num    !== (selectedFlashcard.metadata.class_num    || 12) ||
      formData.flashcard_type !== (selectedFlashcard.metadata.flashcard_type || 'standard')
    );
  }, [formData, selectedFlashcard, isCreating]);

  // Derived: unique chapter names from loaded data
  const allChapters = useMemo(
    () => Array.from(new Set(flashcards.map(f => f.chapter.name))).sort(),
    [flashcards]
  );

  // Derived: unique topics for the currently selected chapter
  const topicsForChapter = useMemo(() => {
    const scoped = flashcards.filter(f => {
      if (selectedCategory !== 'All' && f.chapter.category !== selectedCategory) return false;
      if (selectedChapter !== 'All' && f.chapter.name !== selectedChapter) return false;
      return true;
    });
    const map = new Map<string, number>();
    scoped.forEach(f => {
      map.set(f.topic.name, (map.get(f.topic.name) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [flashcards, selectedCategory, selectedChapter]);

  // Natural comparator: sort by topic.order first, then by numeric suffix of flashcard_id,
  // then lexicographically. Produces DFB-001, DFB-002, ... DFB-120 order per-topic.
  const cardComparator = (a: Flashcard, b: Flashcard) => {
    const ta = a.topic?.order ?? 9999;
    const tb = b.topic?.order ?? 9999;
    if (ta !== tb) return ta - tb;
    const parse = (id: string) => {
      const m = id.match(/(\d+)\s*$/);
      return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
    };
    const na = parse(a.flashcard_id);
    const nb = parse(b.flashcard_id);
    if (na !== nb) return na - nb;
    return a.flashcard_id.localeCompare(b.flashcard_id);
  };

  // Filtered + sorted list for sidebar
  const filteredFlashcards = useMemo(() => {
    let out = flashcards;
    if (selectedCategory !== 'All') out = out.filter(f => f.chapter.category === selectedCategory);
    if (selectedChapter !== 'All') out = out.filter(f => f.chapter.name === selectedChapter);
    if (selectedTopic !== 'All') out = out.filter(f => f.topic.name === selectedTopic);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      out = out.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.chapter.name.toLowerCase().includes(q) ||
        f.topic.name.toLowerCase().includes(q) ||
        f.flashcard_id.toLowerCase().includes(q)
      );
    }
    const sorted = [...out].sort(cardComparator);
    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }, [flashcards, selectedCategory, selectedChapter, selectedTopic, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredFlashcards.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, filteredFlashcards.length);
  const paginatedFlashcards = useMemo(
    () => filteredFlashcards.slice(pageStart, pageEnd),
    [filteredFlashcards, pageStart, pageEnd],
  );

  // Reset to page 1 whenever filters or sort change — but skip first render
  // so URL-hydrated page number survives the initial mount.
  const skipPageResetRef = useRef(true);
  useEffect(() => {
    if (skipPageResetRef.current) { skipPageResetRef.current = false; return; }
    setPage(1);
  }, [selectedCategory, selectedChapter, selectedTopic, searchQuery, sortOrder, pageSize]);

  // Jump to card by ID, number, or index — finds it in the filtered list and opens it
  const handleJump = () => {
    const raw = jumpValue.trim();
    if (!raw) return;
    const lower = raw.toLowerCase();

    // Try match by flashcard_id (case-insensitive, partial)
    let idx = filteredFlashcards.findIndex(f => f.flashcard_id.toLowerCase() === lower);
    if (idx < 0) idx = filteredFlashcards.findIndex(f => f.flashcard_id.toLowerCase().includes(lower));

    // Try as 1-based index into the filtered list
    if (idx < 0) {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= filteredFlashcards.length) idx = n - 1;
    }

    // Try as numeric suffix of a flashcard_id in the filtered list (e.g. "100" → DFB-100)
    if (idx < 0) {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) {
        idx = filteredFlashcards.findIndex(f => {
          const m = f.flashcard_id.match(/(\d+)\s*$/);
          return m ? parseInt(m[1], 10) === n : false;
        });
      }
    }

    if (idx < 0) {
      showMessage('error', `No card matches "${raw}" in current filter`);
      return;
    }
    setPage(Math.floor(idx / pageSize) + 1);
    handleEdit(filteredFlashcards[idx]);
    setJumpValue('');
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // If there's a pending auto-save timer for the card we're leaving, cancel
  // it and fire the save synchronously (fire-and-forget). The save targets
  // the *old* flashcard_id via closure, and `performSave` guards against
  // stomping the editor state for the newly-selected card.
  const flushPendingAutoSave = () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    if (isEditing && !isCreating && isDirty && validateForm()) {
      // Don't await — let navigation happen immediately.
      performSave({ silent: true });
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    flushPendingAutoSave();
    setSelectedFlashcard(flashcard);
    setFormData({
      flashcard_id: flashcard.flashcard_id,
      chapter_name: flashcard.chapter.name,
      category: flashcard.chapter.category,
      topic_name: flashcard.topic.name,
      question: flashcard.question,
      answer: flashcard.answer,
      difficulty: flashcard.metadata.difficulty || 'medium',
      source: flashcard.metadata.source || 'NCERT',
      class_num: flashcard.metadata.class_num || 12,
      flashcard_type: flashcard.metadata.flashcard_type || 'standard',
    });
    setIsEditing(true);
    setIsCreating(false);
    setAutoSaveStatus('idle');
  };

  const handleCreate = () => {
    flushPendingAutoSave();
    setFormData({
      flashcard_id: `FLASH-${Date.now()}`,
      chapter_name: selectedChapter !== 'All' ? selectedChapter : '',
      category: selectedCategory !== 'All' ? selectedCategory : 'Physical Chemistry',
      topic_name: selectedTopic !== 'All' ? selectedTopic : '',
      question: '',
      answer: '',
      difficulty: 'medium',
      source: 'NCERT',
      class_num: 12,
      flashcard_type: 'standard',
    });
    setSelectedFlashcard(null);
    setIsCreating(true);
    setIsEditing(false);
    setAutoSaveStatus('idle');
  };

  const validateForm = () => !!(
    formData.flashcard_id &&
    formData.question &&
    formData.answer &&
    formData.chapter_name &&
    formData.topic_name
  );

  // Build the request body from current formData. Preserves existing
  // chapter.id/topic.order/tags when editing so auto-save doesn't re-slug
  // identifiers or move the card to the top of the list on every write.
  const buildPayload = () => {
    const existingChapterId  = isEditing ? selectedFlashcard?.chapter.id    : undefined;
    const existingTopicOrder = isEditing ? selectedFlashcard?.topic.order   : undefined;
    const existingTags       = isEditing ? selectedFlashcard?.metadata.tags : undefined;
    const chapterId = existingChapterId
      || formData.chapter_name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const topicOrder = typeof existingTopicOrder === 'number' ? existingTopicOrder : 0;
    const mergedTags = Array.from(new Set([
      ...(existingTags ?? []),
      formData.topic_name,
      formData.chapter_name,
    ].filter(Boolean)));
    return {
      flashcard_id: formData.flashcard_id,
      chapter: { id: chapterId, name: formData.chapter_name, category: formData.category },
      topic:   { name: formData.topic_name, order: topicOrder },
      question: formData.question,
      answer:   formData.answer,
      metadata: {
        difficulty: formData.difficulty,
        tags: mergedTags,
        source: formData.source,
        class_num: formData.class_num,
        flashcard_type: formData.flashcard_type,
      },
    };
  };

  // Shared save core. Called by:
  //   - handleSave   (explicit Save button)           → silent=false, toast on result
  //   - auto-save    (debounced, on formData change)  → silent=true,  status chip only
  // Targets the card that was selected *when this function was invoked* via
  // the captured `targetId` — so a stale in-flight save never stomps a card
  // the user has since navigated away from.
  const performSave = async (opts: { silent?: boolean } = {}) => {
    if (saveInFlightRef.current) return;
    if (!validateForm()) {
      if (!opts.silent) showMessage('error', 'Please fill in all required fields (ID, Chapter, Topic, Question, Answer)');
      return;
    }

    saveInFlightRef.current = true;
    setSaving(true);
    if (opts.silent) setAutoSaveStatus('saving');

    const wasEditing = isEditing;
    const targetId = wasEditing ? selectedFlashcard?.flashcard_id : undefined;

    try {
      const payload = buildPayload();
      const url    = wasEditing ? `/api/v2/flashcards/${targetId}` : '/api/v2/flashcards';
      const method = wasEditing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Read as text first so non-JSON error bodies (e.g. "Internal Server
        // Error" from a crashed handler) don't explode the JSON parser and
        // swallow the real status code.
        const raw = await res.text();
        let message = raw;
        try { message = (JSON.parse(raw)?.error as string) || raw; } catch {}
        throw new Error(message || `Save failed (HTTP ${res.status})`);
      }

      const data = await res.json();
      const saved: Flashcard | undefined = data.flashcard;

      if (saved) {
        // Always merge into the list — safe regardless of what the user has
        // since selected, since we key by flashcard_id.
        setFlashcards(prev => {
          const idx = prev.findIndex(f => f.flashcard_id === saved.flashcard_id);
          if (idx >= 0) {
            const next = prev.slice();
            next[idx] = saved;
            return next;
          }
          return [saved, ...prev];
        });

        // Only touch editor focus if the user is still on this same card
        // (or we just created a new one and there's nothing to conflict with).
        const stillOnSameCard = !wasEditing || selectedFlashcard?.flashcard_id === targetId;
        if (stillOnSameCard) {
          setSelectedFlashcard(saved);
          setIsEditing(true);
          setIsCreating(false);
        }
      } else if (!opts.silent) {
        // Fallback: server didn't return the card — refetch just in case.
        setIsEditing(false);
        setIsCreating(false);
        setSelectedFlashcard(null);
        fetchFlashcards();
      }

      if (opts.silent) {
        setAutoSaveStatus('saved');
        setLastSavedAt(new Date());
      } else {
        showMessage('success', wasEditing ? 'Flashcard updated!' : 'Flashcard created!');
      }
    } catch (error: unknown) {
      if (opts.silent) {
        setAutoSaveStatus('error');
      } else {
        showMessage('error', error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      setSaving(false);
      saveInFlightRef.current = false;
    }
  };

  const handleSave = () => performSave({ silent: false });

  // Debounced auto-save. Fires 1.2 s after the user stops editing, provided:
  //   - we're editing an existing card (creates still require an explicit click)
  //   - there are actual changes vs. the last-saved version
  //   - all required fields are filled
  // Any new change cancels the pending timer and restarts the window.
  useEffect(() => {
    if (!isEditing || isCreating) return;
    if (!isDirty) return;
    if (!validateForm()) return;

    setAutoSaveStatus('dirty');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      performSave({ silent: true });
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
    // We intentionally omit performSave/validateForm from deps — they close
    // over the latest formData via the setTimeout callback, which is what
    // we want. Re-registering the effect on every render would cause a
    // cancel→re-arm loop that never fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isEditing, isCreating, isDirty]);

  const handleDelete = async (flashcard: Flashcard) => {
    if (!confirm(`Delete ${flashcard.flashcard_id}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/v2/flashcards/${flashcard.flashcard_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showMessage('success', 'Flashcard deleted!');
      if (selectedFlashcard?._id === flashcard._id) {
        setSelectedFlashcard(null);
        setIsEditing(false);
      }
      // Remove from local state — no full refetch needed.
      setFlashcards(prev => prev.filter(f => f._id !== flashcard._id));
    } catch {
      showMessage('error', 'Failed to delete flashcard');
    }
  };

  const handleSVGUpload = (field: 'question' | 'answer', markdownLink: string) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + '\n\n' + markdownLink }));
  };

  const setTopicFromManager = () => {
    if (!newTopicName.trim()) return;
    setFormData(prev => ({ ...prev, topic_name: newTopicName.trim() }));
    showMessage('success', `Topic "${newTopicName.trim()}" set — save any card to add it to the chapter`);
    setNewTopicName('');
    setShowTopicManager(false);
  };

  const isFormDirty = isEditing || isCreating;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="flex h-screen overflow-hidden">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
        <div className="w-96 border-r border-white/10 flex flex-col bg-slate-900/50 shrink-0">

          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Flashcards</h1>
              <p className="text-slate-400 text-xs mt-0.5">
                <span className="text-purple-400 font-semibold">{filteredFlashcards.length}</span>
                <span className="text-slate-500"> / {flashcards.length} cards shown</span>
              </p>
            </div>
            <button
              onClick={fetchFlashcards}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Refresh flashcards"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-white/10 space-y-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by question, ID, topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setSelectedChapter('All'); }}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {/* Chapter */}
            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Chapters</option>
              {selectedCategory === 'All'
                ? allChapters.map(ch => <option key={ch} value={ch}>{ch}</option>)
                : getFlashcardChaptersByCategory(selectedCategory).map(ch => (
                    <option key={ch.id} value={ch.name}>{ch.displayName}</option>
                  ))
              }
            </select>

            {/* Topic / Subtopic filter (only visible when a chapter is selected) */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="All">
                    All Topics {topicsForChapter.length > 0 ? `(${topicsForChapter.length})` : ''}
                  </option>
                  {topicsForChapter.map(([name, count]) => (
                    <option key={name} value={name}>
                      {name} ({count})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowTopicManager(true)}
                className="px-3 py-2 bg-slate-800 border border-white/10 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-purple-500/50 transition-all"
                title="Add new topic to this chapter"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Topic count pills — only when a chapter is selected */}
            {selectedChapter !== 'All' && topicsForChapter.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topicsForChapter.map(([name, count]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedTopic(prev => prev === name ? 'All' : name)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all border ${
                      selectedTopic === name
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'bg-slate-800 border-white/10 text-slate-400 hover:border-purple-500/50'
                    }`}
                  >
                    {name.length > 22 ? name.slice(0, 20) + '…' : name}
                    <span className="ml-1 opacity-70">{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              New Flashcard
            </button>
          </div>

          {/* Sort + Jump toolbar */}
          {!loading && filteredFlashcards.length > 0 && (
            <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 bg-slate-900/30">
              <button
                onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 px-2 py-1 bg-slate-800 border border-white/10 rounded-md text-[10px] text-slate-300 hover:border-purple-500/50 transition-colors shrink-0"
                title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'} by topic order and ID`}
              >
                {sortOrder === 'asc' ? <ArrowDownAZ className="w-3 h-3" /> : <ArrowUpAZ className="w-3 h-3" />}
                {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
              </button>
              <input
                type="text"
                value={jumpValue}
                onChange={e => setJumpValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleJump()}
                placeholder="Jump to ID or # (e.g. 100)"
                className="flex-1 min-w-0 px-2 py-1 bg-slate-800 border border-white/10 rounded-md text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleJump}
                className="px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded-md text-[10px] text-purple-300 hover:bg-purple-500/30 transition-colors shrink-0"
              >
                Go
              </button>
            </div>
          )}

          {/* Card List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : filteredFlashcards.length === 0 ? (
              <div className="text-center py-20 text-slate-500 text-sm">
                <Hash className="w-8 h-8 mx-auto mb-3 opacity-30" />
                No flashcards match these filters
              </div>
            ) : (
              paginatedFlashcards.map(flashcard => (
                <motion.div
                  key={flashcard._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all group ${
                    selectedFlashcard?._id === flashcard._id
                      ? 'bg-purple-500/15 border-purple-500/60'
                      : 'bg-slate-800/40 border-white/8 hover:border-white/20 hover:bg-slate-800/70'
                  }`}
                  onClick={() => handleEdit(flashcard)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-purple-500/25 text-purple-300 border border-purple-500/40 rounded text-[11px] font-mono font-semibold shrink-0 tracking-wide">
                      {flashcard.flashcard_id}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${DIFFICULTY_COLORS[flashcard.metadata.difficulty || 'medium']}`}>
                        {flashcard.metadata.difficulty || 'med'}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(flashcard); }}
                        className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-white text-xs mb-1.5 line-clamp-2 leading-relaxed prose prose-invert max-w-none prose-xs">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {flashcard.question.slice(0, 120)}
                    </ReactMarkdown>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="truncate max-w-[140px]">{flashcard.topic.name}</span>
                    {flashcard.metadata.flashcard_type === 'true-false' && (
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded shrink-0">T/F</span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination footer */}
          {!loading && filteredFlashcards.length > pageSize && (
            <div className="border-t border-white/10 px-3 py-2 bg-slate-900/50 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="p-1.5 rounded-md bg-slate-800 border border-white/10 text-slate-300 hover:border-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <span>
                  <span className="text-white font-semibold">{pageStart + 1}</span>
                  –<span className="text-white font-semibold">{pageEnd}</span>
                  <span className="text-slate-500"> of {filteredFlashcards.length}</span>
                </span>
                <span className="text-slate-600">·</span>
                <select
                  value={safePage}
                  onChange={e => setPage(parseInt(e.target.value, 10))}
                  className="bg-slate-800 border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:border-purple-500"
                  title="Jump to page"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <option key={p} value={p}>Page {p}/{totalPages}</option>
                  ))}
                </select>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(parseInt(e.target.value, 10))}
                  className="bg-slate-800 border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:border-purple-500"
                  title="Cards per page"
                >
                  {[25, 50, 100, 200].map(n => <option key={n} value={n}>{n}/page</option>)}
                </select>
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="p-1.5 rounded-md bg-slate-800 border border-white/10 text-slate-300 hover:border-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Editor & Preview ──────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {isFormDirty ? (
            <>
              {/* Editor Header */}
              <div className="p-5 border-b border-white/10 bg-slate-900/50 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEditing ? 'Edit Flashcard' : 'Create Flashcard'}
                  </h2>
                  {isEditing && (
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">{selectedFlashcard?.flashcard_id}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Auto-save status chip. Only meaningful in edit mode —
                      creates rely on the Save button until first persistence. */}
                  {isEditing && (
                    <div className="flex items-center gap-1.5 text-xs font-medium min-w-[120px] justify-end">
                      {autoSaveStatus === 'saving' && (
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <Loader2 className="w-3 h-3 animate-spin" /> Saving…
                        </span>
                      )}
                      {autoSaveStatus === 'saved' && (
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          Saved{lastSavedAt ? ` · ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
                        </span>
                      )}
                      {autoSaveStatus === 'dirty' && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Unsaved changes
                        </span>
                      )}
                      {autoSaveStatus === 'error' && (
                        <span className="flex items-center gap-1.5 text-red-400">
                          <AlertCircle className="w-3 h-3" /> Save failed — click Save to retry
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-semibold"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      flushPendingAutoSave();
                      setIsEditing(false);
                      setIsCreating(false);
                      setSelectedFlashcard(null);
                      setAutoSaveStatus('idle');
                    }}
                    className="px-4 py-2 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Split: Editor left, Preview right */}
              <div className="flex-1 flex overflow-hidden">
                {/* Editor */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 min-w-0">

                  {/* Row 1: ID + Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Flashcard ID *</label>
                      <input
                        type="text"
                        value={formData.flashcard_id}
                        onChange={e => setFormData({ ...formData, flashcard_id: e.target.value })}
                        disabled={isEditing}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 disabled:opacity-40 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Type</label>
                      <select
                        value={formData.flashcard_type}
                        onChange={e => setFormData({
                          ...formData,
                          flashcard_type: e.target.value as 'standard' | 'true-false',
                          answer: e.target.value === 'true-false' ? 'True' : formData.answer,
                        })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="standard">Standard</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Category + Class */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category *</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Class</label>
                      <select
                        value={formData.class_num}
                        onChange={e => setFormData({ ...formData, class_num: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value={11}>Class 11</option>
                        <option value={12}>Class 12</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Chapter + Topic */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Chapter *</label>
                      <input
                        type="text"
                        value={formData.chapter_name}
                        onChange={e => setFormData({ ...formData, chapter_name: e.target.value })}
                        placeholder="e.g., p-block Group 13 & 14"
                        list="chapters-datalist"
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                      <datalist id="chapters-datalist">
                        {allChapters.map(ch => <option key={ch} value={ch} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Topic (Sub-topic) *
                      </label>
                      <input
                        type="text"
                        value={formData.topic_name}
                        onChange={e => setFormData({ ...formData, topic_name: e.target.value })}
                        placeholder="e.g., G13: Trends & Inert Pair"
                        list="topics-datalist"
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                      <datalist id="topics-datalist">
                        {topicsForChapter.map(([name]) => <option key={name} value={name} />)}
                      </datalist>
                    </div>
                  </div>

                  {/* Row 4: Difficulty + Source */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={e => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Source</label>
                      <input
                        type="text"
                        value={formData.source}
                        onChange={e => setFormData({ ...formData, source: e.target.value })}
                        placeholder="NCERT / JEE PYQ / etc."
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Question * <span className="text-slate-600 font-normal">(Supports LaTeX: $$...$$, Markdown)</span>
                    </label>
                    <SVGDropZone
                      questionId={formData.flashcard_id}
                      fieldType="question"
                      onUploaded={(markdownLink) => handleSVGUpload('question', markdownLink)}
                      compact={false}
                    />
                    <textarea
                      value={formData.question}
                      onChange={e => setFormData({ ...formData, question: e.target.value })}
                      placeholder="What is Raoult's Law? Use $$P = P_0 \times X$$ for LaTeX"
                      rows={5}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 font-mono mt-2 resize-y"
                    />
                    <FlashcardImageScaleControls
                      value={formData.question}
                      onChange={next => setFormData({ ...formData, question: next })}
                    />
                  </div>

                  {/* Answer */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Answer * <span className="text-slate-600 font-normal">(Supports LaTeX & Markdown)</span>
                    </label>
                    {formData.flashcard_type === 'true-false' ? (
                      <select
                        value={formData.answer}
                        onChange={e => setFormData({ ...formData, answer: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="True">True</option>
                        <option value="False">False</option>
                      </select>
                    ) : (
                      <>
                        <SVGDropZone
                          questionId={formData.flashcard_id}
                          fieldType="solution"
                          onUploaded={(markdownLink) => handleSVGUpload('answer', markdownLink)}
                          compact={false}
                        />
                        <textarea
                          value={formData.answer}
                          onChange={e => setFormData({ ...formData, answer: e.target.value })}
                          placeholder="Raoult's law states that..."
                          rows={7}
                          className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 font-mono mt-2 resize-y"
                        />
                        <FlashcardImageScaleControls
                          value={formData.answer}
                          onChange={next => setFormData({ ...formData, answer: next })}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="w-[45%] border-l border-white/10 bg-slate-900/30 overflow-y-auto p-5 shrink-0">
                  <div className="sticky top-0 bg-slate-900/70 backdrop-blur-sm pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-semibold">Live Preview</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Topic badge */}
                    {formData.topic_name && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500">{formData.chapter_name} › {formData.topic_name}</span>
                      </div>
                    )}

                    {/* Question preview */}
                    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                      <div className="text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-widest">Question</div>
                      <div className="prose prose-invert max-w-none prose-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={flashcardMarkdownComponents}
                        >
                          {formData.question || '*No question yet*'}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Answer preview */}
                    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                      <div className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-widest">Answer</div>
                      <div className="prose prose-invert max-w-none prose-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={flashcardMarkdownComponents}
                        >
                          {formData.answer || '*No answer yet*'}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-[10px]">{formData.category}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px]">{formData.chapter_name || 'No chapter'}</span>
                      {formData.topic_name && (
                        <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded-full text-[10px]">{formData.topic_name}</span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${DIFFICULTY_COLORS[formData.difficulty]}`}>
                        {formData.difficulty}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-[10px]">Class {formData.class_num}</span>
                      {formData.flashcard_type === 'true-false' && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px]">True/False</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center text-slate-600">
              <div className="text-center">
                <List className="w-14 h-14 mx-auto mb-4 opacity-20" />
                <p className="text-base">Select a flashcard to edit</p>
                <p className="text-sm mt-1 opacity-60">or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-4 right-4 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-medium ${
              message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Topic Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showTopicManager && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Add New Topic</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {selectedChapter !== 'All' ? `For: ${selectedChapter}` : 'Works for any chapter'}
                  </p>
                </div>
                <button onClick={() => setShowTopicManager(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <p className="text-slate-400 text-xs mb-4">
                Type a new sub-topic name. It will be set as the topic for your next card. The topic officially 'exists' once you save a card with this name.
              </p>

              <input
                type="text"
                value={newTopicName}
                onChange={e => setNewTopicName(e.target.value)}
                placeholder="e.g., G13: Borax & Boric Acid"
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm mb-4 focus:outline-none focus:border-purple-500"
                onKeyDown={e => e.key === 'Enter' && setTopicFromManager()}
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  onClick={setTopicFromManager}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold"
                >
                  Set Topic
                </button>
                <button
                  onClick={() => setShowTopicManager(false)}
                  className="px-4 py-2.5 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>

              {/* Existing topics for this chapter */}
              {topicsForChapter.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="text-xs font-semibold text-slate-400 mb-2">
                    Existing Topics in {selectedChapter !== 'All' ? selectedChapter : 'this chapter'}:
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {topicsForChapter.map(([name, count]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
                        onClick={() => { setNewTopicName(name); }}
                      >
                        <span className="text-slate-300 text-xs">{name}</span>
                        <span className="text-slate-500 text-[10px]">{count} cards</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
