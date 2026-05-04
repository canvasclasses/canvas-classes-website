"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Check, X, Search, Flag, Volume2, MonitorPlay, ChevronDown, ChevronUp, ExternalLink, Menu, AlertCircle } from 'lucide-react';
import WaveformAudioPlayer from '@/components/WaveformAudioPlayer';
import { Chapter, Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import { difficultyColor } from '@/lib/difficultyUtils';
import { getTopicSortKey, hasNcertOrder, NCERT_TOPIC_ORDER } from '@/app/the-crucible/lib/ncertTopicOrder';
import { track } from '@/lib/analytics/mixpanel';

// ───────────────────────────── Helpers ─────────────────────────────
async function fetchOptionStats(qid: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/v2/questions/${qid}/stats`);
    if (!res.ok) return {};
    const data = await res.json() as Record<string, unknown>;
    return (data.optionStats as Record<string, number> | undefined) || {};
  } catch { return {}; }
}

const DIFF_COLOR = (d: number | string): string => {
  if (typeof d === 'number') return difficultyColor(d);
  const m: Record<string, string> = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171', Challenging: '#c084fc' };
  return m[d] ?? '#fbbf24';
};

const DIFF_LABEL = (d: number | string): string => {
  if (typeof d === 'number') {
    if (d <= 2) return 'Easy';
    if (d === 3) return 'Medium';
    if (d === 4) return 'Tough';
    return 'Advanced';
  }
  const lower = d.toLowerCase();
  if (lower === 'hard') return 'Tough';
  if (lower === 'challenging') return 'Advanced';
  return d.charAt(0).toUpperCase() + d.slice(1);
};

const TYPE_LABEL: Record<string, string> = {
  SCQ: 'Single Correct',
  MCQ: 'Multiple Correct',
  NVT: 'Integer',
  AR: 'Assertion-Reason',
  MST: 'Multi-Statement',
  MTC: 'Match Columns',
  SUBJ: 'Subjective',
  WKEX: 'Worked Example',
};

const PAGE_SIZE = 25;

const isShortOptions = (opts: { id: string; text: string }[], isMobile: boolean): boolean => {
  if (!opts || opts.length !== 4) return false;
  return opts.every(o => {
    const t = (o.text || '');
    if (t.includes('$') || t.includes('![')) return false;
    const plain = t.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    return plain.length <= (isMobile ? 14 : 36);
  });
};

const pad2 = (n: number): string => n.toString().padStart(2, '0');

// Chapter category → accent color. Falls back to amber.
const CAT_COLOR: Record<string, string> = {
  Physical: '#38bdf8',
  Organic: '#c084fc',
  Inorganic: '#34d399',
  Practical: '#fbbf24',
};
const catAccent = (cat?: string): string => CAT_COLOR[cat ?? ''] ?? '#fb923c';

// Per-question UI state. Lives in a single Map keyed by question id so it
// survives pagination / filter changes — avoids the old indexed-by-localIdx
// state that lost progress whenever the page changed.
interface QuestionState {
  selected: string | string[] | null; // single id or array (MCQ)
  integerInput?: string;
  submitted: boolean;
  isCorrect?: boolean;
  showSolution: boolean;
  optionStats?: Record<string, number>;
  videoOpen?: boolean;
  audioOpen?: Record<number, boolean>;
}

const emptyQState: QuestionState = { selected: null, submitted: false, showSolution: false };

// ───────────────────────────── Component ─────────────────────────────
export default function BrowseView({
  questions,
  chapters,
  onBack,
  chapterId,
  examBoard,
  onLoadSolutionsForPage,
}: {
  questions: Question[];
  chapters: Chapter[];
  onBack: () => void;
  chapterId?: string;
  guidedMode?: boolean;
  onQuestionAnswered?: (isCorrect: boolean) => void;
  examBoard?: 'JEE' | 'NEET';
  onLoadSolutionsForPage?: (qids: string[]) => void;
}) {
  // ── Layout / device state
  const [isMobile, setIsMobile] = useState(false);
  const [topicDrawerOpen, setTopicDrawerOpen] = useState(false);

  // ── Filters
  const [examFilter, setExamFilter] = useState<'all' | 'mains' | 'advanced' | 'non-pyq' | 'starred'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // ── User progress / stars
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [persistedAttempts, setPersistedAttempts] = useState<Map<string, 'correct' | 'wrong'>>(new Map());

  // ── Per-question UI state
  const [qStates, setQStates] = useState<Map<string, QuestionState>>(new Map());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ── Pagination (kept simple — render-window for perf)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ── Session-local attempt buffer (drives the post-session classification
  //     modal — see CRUCIBLE_ARCHITECTURE.md §3.2)
  type BrowseAttempt = { qq: Question; is_correct: boolean; selected_option: string | string[] | number | null };
  const [browseAttempts, setBrowseAttempts] = useState<BrowseAttempt[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  // True after the student taps "This was casual" — disables the button so
  // they can't double-tap, and switches the CTA to a confirmation state.
  const [casualMarking, setCasualMarking] = useState(false);

  // Stable session id — generated once per BrowseView mount. Sent with every
  // attempt POST so the PATCH /session-confidence endpoint can retroactively
  // reclassify the entire session as casual ('low' confidence).
  const sessionIdRef = useRef<string>('');
  if (!sessionIdRef.current) {
    sessionIdRef.current = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }

  // ── Flag modal
  const [flagModalQuestion, setFlagModalQuestion] = useState<{ id: string; displayId: string } | null>(null);
  const [flagType, setFlagType] = useState<string>('wrong_answer');
  const [flagNote, setFlagNote] = useState('');
  const [flagSubmitting, setFlagSubmitting] = useState(false);
  const [flagResult, setFlagResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  const FLAG_TYPES = [
    { id: 'wrong_answer', label: 'Answer seems incorrect' },
    { id: 'wrong_question', label: 'Question text has an error' },
    { id: 'latex_rendering', label: 'Math / formula not rendering' },
    { id: 'image_missing', label: 'Diagram or image missing' },
    { id: 'option_error', label: 'Error in one of the options' },
    { id: 'solution_error', label: 'Solution is wrong or incomplete' },
    { id: 'other', label: 'Other (describe below)' },
  ];

  // ── Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  // ───────────────────────── Effects ─────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Funnel: browse session opened. Fires once per mount.
  useEffect(() => {
    track('browse_session_started', {
      chapter_id: chapterId,
      question_count: questions.length,
      exam_board: examBoard,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user progress on mount
  useEffect(() => {
    (async () => {
      try {
        const supabase = createSupabaseClient();
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch(`/api/v2/user/progress${chapterId ? `?chapterId=${chapterId}` : ''}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.starred_ids?.length) setStarred(new Set<string>(data.starred_ids));
        if (data.attempted_ids?.length) {
          interface Row { question_id: string; times_attempted?: number; times_correct?: number }
          const map = new Map<string, 'correct' | 'wrong'>();
          for (const a of data.attempted_ids as Row[]) {
            if ((a.times_attempted ?? 0) > 0) {
              map.set(a.question_id, (a.times_correct ?? 0) > 0 ? 'correct' : 'wrong');
            }
          }
          setPersistedAttempts(map);
        }
      } catch { /* unauth — local only */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset visible count whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    scrollAreaRef.current?.scrollTo({ top: 0 });
  }, [examFilter, yearFilter, topicFilter, searchQuery]);

  // ───────────────────────── Derived data ─────────────────────────
  const currentChapter = useMemo(
    () => chapters.find(c => c.id === chapterId) ?? null,
    [chapters, chapterId]
  );

  // Single accent for this chapter — drives sidebar highlight, ambient gradient,
  // and chip colors so each chapter has its own colour identity.
  const accent = catAccent(currentChapter?.category);

  // Topics for this chapter (from taxonomy), reordered to NCERT order if defined
  const topics = useMemo(() => {
    if (!chapterId) return [] as Array<{ id: string; name: string }>;
    const list = (TAXONOMY_FROM_CSV as Array<{ type?: string; parent_id?: string; id?: string; name?: string }>)
      .filter(n => n.type === 'topic' && n.parent_id === chapterId)
      .map(n => ({ id: n.id || '', name: n.name || '' }));
    const order = NCERT_TOPIC_ORDER[chapterId];
    if (!order) return list;
    return [...list].sort((a, b) => {
      const ai = order.indexOf(a.id); const bi = order.indexOf(b.id);
      return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    });
  }, [chapterId]);

  // Questions per topic — count + solved-count (from persistedAttempts)
  const topicCounts = useMemo(() => {
    const counts = new Map<string, { total: number; solved: number }>();
    for (const t of topics) counts.set(t.id, { total: 0, solved: 0 });
    let totalAll = 0; let solvedAll = 0;
    for (const q of questions) {
      totalAll += 1;
      const isCorrect = persistedAttempts.get(q.id) === 'correct';
      if (isCorrect) solvedAll += 1;
      for (const tag of q.metadata.tags ?? []) {
        const entry = counts.get(tag.tag_id);
        if (entry) {
          entry.total += 1;
          if (isCorrect) entry.solved += 1;
        }
      }
    }
    return { perTopic: counts, all: { total: totalAll, solved: solvedAll } };
  }, [topics, questions, persistedAttempts]);

  // Available years for selected exam filter
  const availableYears = useMemo(() => {
    if (examFilter !== 'mains' && examFilter !== 'advanced') return [];
    const years = questions
      .filter(q => {
        const exam = (q.metadata.exam_source?.exam ?? '').toLowerCase();
        return examFilter === 'mains'
          ? q.metadata.is_pyq && /main/i.test(exam)
          : q.metadata.is_pyq && /adv/i.test(exam);
      })
      .map(q => q.metadata.exam_source?.year)
      .filter((y): y is number => typeof y === 'number');
    return [...new Set(years)].sort((a, b) => b - a);
  }, [questions, examFilter]);

  // Sort: NCERT topic order if available, then PYQ-first, year DESC, display_id ASC
  const isPYQ = (q: Question) => q.metadata.sourceType === 'PYQ' || q.metadata.is_pyq === true;
  const yearOf = (q: Question) => q.metadata.examDetails?.year ?? q.metadata.exam_source?.year ?? -1;

  const sortQuestions = (a: Question, b: Question): number => {
    if (chapterId && hasNcertOrder(chapterId)) {
      const aT = getTopicSortKey(chapterId, a.metadata.tags);
      const bT = getTopicSortKey(chapterId, b.metadata.tags);
      if (aT !== bT) return aT - bT;
    }
    const aP = isPYQ(a); const bP = isPYQ(b);
    if (aP !== bP) return aP ? -1 : 1;
    if (aP && bP) {
      const ay = yearOf(a); const by = yearOf(b);
      if (ay !== by) return by - ay;
    }
    return (a.display_id || '').localeCompare(b.display_id || '', undefined, { numeric: true, sensitivity: 'base' });
  };

  // Apply filters + sort
  const filteredQuestions = useMemo(() => {
    const norm = searchQuery.trim().toLowerCase();
    return questions
      .filter(q => {
        // Exam filter
        if (examFilter === 'starred') {
          if (!starred.has(q.id)) return false;
        } else if (examFilter === 'non-pyq') {
          if (q.metadata.is_pyq) return false;
        } else if (examFilter !== 'all') {
          const exam = (q.metadata.exam_source?.exam ?? '').toLowerCase();
          if (examFilter === 'mains' && (!q.metadata.is_pyq || !/main/i.test(exam))) return false;
          if (examFilter === 'advanced' && (!q.metadata.is_pyq || !/adv/i.test(exam))) return false;
        }
        // Year
        if (yearFilter !== 'all' && (examFilter === 'mains' || examFilter === 'advanced')) {
          if (q.metadata.exam_source?.year !== Number(yearFilter)) return false;
        }
        // Topic
        if (topicFilter !== 'all') {
          if (!q.metadata.tags?.some(t => t.tag_id === topicFilter)) return false;
        }
        // Search (display_id + question text)
        if (norm) {
          const hay = `${q.display_id ?? ''} ${q.question_text?.markdown ?? ''}`.toLowerCase();
          if (!hay.includes(norm)) return false;
        }
        return true;
      })
      .sort(sortQuestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, examFilter, yearFilter, topicFilter, searchQuery, starred, chapterId]);

  const visibleQuestions = filteredQuestions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredQuestions.length;

  // Lazy-load solutions for visible window
  useEffect(() => {
    if (!onLoadSolutionsForPage) return;
    const ids = visibleQuestions.map(q => q.id).filter(Boolean);
    if (ids.length === 0) return;
    onLoadSolutionsForPage(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, examFilter, yearFilter, topicFilter, searchQuery, questions.length]);

  // Session stats (header)
  const sessionStats = useMemo(() => {
    const localCorrect = browseAttempts.filter(a => a.is_correct).length;
    const localTotal = browseAttempts.length;
    const persistedCorrect = Array.from(persistedAttempts.values()).filter(v => v === 'correct').length;
    const persistedTotal = persistedAttempts.size;
    const totalAnswered = persistedTotal + localTotal;
    const totalCorrect = persistedCorrect + localCorrect;
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return {
      answered: totalAnswered,
      total: questions.length,
      accuracy,
    };
  }, [browseAttempts, persistedAttempts, questions.length]);

  // ───────────────────────── Handlers ─────────────────────────
  const updateQState = useCallback((qid: string, patch: Partial<QuestionState>) => {
    setQStates(prev => {
      const next = new Map(prev);
      const cur = next.get(qid) ?? { ...emptyQState };
      next.set(qid, { ...cur, ...patch });
      return next;
    });
  }, []);

  // In-flight attempt buffer used by the beforeunload / pagehide backstop.
  // Each attempt POSTs immediately on submit; if that POST is still in flight
  // (or it failed) when the user closes the tab, we replay it via sendBeacon
  // so no data is lost. Stored in a ref so the unload listener stays stable.
  const pendingFlushRef = useRef<BrowseAttempt[]>([]);

  // Persist a single attempt: update the local session summary AND fire a
  // POST to /api/v2/user/progress immediately. `keepalive` tells the browser
  // to let the request complete past page unload; sendBeacon is the
  // last-resort backstop wired up in the useEffect below.
  const persistAttempt = useCallback(async (
    qq: Question,
    is_correct: boolean,
    sel: string | string[] | number | null,
  ) => {
    // 1) Local buffer — drives the session summary modal + sidebar dots.
    setBrowseAttempts(prev => {
      if (prev.some(a => a.qq.id === qq.id)) return prev;
      return [...prev, { qq, is_correct, selected_option: sel }];
    });

    // 2) Mark as in-flight so the unload handler can replay it.
    const inflight: BrowseAttempt = { qq, is_correct, selected_option: sel };
    pendingFlushRef.current.push(inflight);

    const payload = {
      question_id: qq.id,
      display_id: qq.display_id,
      chapter_id: qq.metadata.chapter_id,
      difficulty: qq.metadata.difficultyLevel,
      concept_tags: qq.metadata.tags?.map(t => t.tag_id) ?? [],
      // Persona unification — feeds StudentChapterProfile's microConcept
      // dimension (audit #5). Browse-medium attempts get the field but the
      // server-side persona update is gated on HIGH so this is informational.
      micro_concept: qq.metadata.microConcept ?? null,
      is_correct,
      selected_option: sel,
      source: 'browse' as const,
      // Tiered signal — see CRUCIBLE_ARCHITECTURE.md §3.2.
      // Browse defaults to MEDIUM (counts toward exposure, NOT mastery).
      // Student can retroactively mark this whole session as 'low' via the
      // exit modal → PATCH /api/v2/user/progress/session-confidence.
      confidence: 'medium' as const,
      session_id: sessionIdRef.current,
    };

    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const res = await fetch('/api/v2/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      if (res.ok) {
        // Drop from in-flight — the server has it.
        pendingFlushRef.current = pendingFlushRef.current.filter(
          e => e.qq.id !== qq.id,
        );
      }
    } catch {
      /* network failure — leave in pendingFlushRef so unload backstop replays */
    }
  }, []);

  const toggleStar = useCallback(async (qq: Question) => {
    const id = qq.id;
    const isNowStarred = !starred.has(id);
    setStarred(prev => { const n = new Set(prev); if (isNowStarred) n.add(id); else n.delete(id); return n; });
    track(isNowStarred ? 'bookmark_added' : 'bookmark_removed', {
      mode: 'browse',
      question_id: id,
      chapter_id: qq.metadata.chapter_id,
    });
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch('/api/v2/user/starred', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ question_id: id, chapter_id: qq.metadata.chapter_id, action: isNowStarred ? 'star' : 'unstar' }),
      });
    } catch { /* local-only */ }
  }, [starred]);

  // The big behavior change: clicking just selects. Submit is a separate action.
  const onSelectOption = useCallback((qq: Question, optId: string) => {
    const cur = qStates.get(qq.id) ?? emptyQState;
    if (cur.submitted) return; // locked after submit
    const isMCQ = qq.type === 'MCQ';
    if (isMCQ) {
      const arr = Array.isArray(cur.selected) ? cur.selected : [];
      const newArr = arr.includes(optId) ? arr.filter(x => x !== optId) : [...arr, optId];
      updateQState(qq.id, { selected: newArr });
    } else {
      updateQState(qq.id, { selected: optId });
    }
  }, [qStates, updateQState]);

  const onSubmit = useCallback((qq: Question) => {
    const cur = qStates.get(qq.id) ?? emptyQState;
    if (cur.submitted) return;
    let correct = false;
    let selPayload: string | string[] | number | null = null;
    if (qq.type === 'MCQ') {
      const sel = Array.isArray(cur.selected) ? cur.selected : [];
      if (sel.length === 0) return;
      const correctIds = (qq.options ?? []).filter(o => o.is_correct).map(o => o.id);
      correct = correctIds.length === sel.length && sel.every(id => correctIds.includes(id));
      selPayload = sel;
    } else if (qq.type === 'NVT') {
      const v = (cur.integerInput ?? '').trim();
      if (!v) return;
      const n = Number(v);
      const expected = qq.answer?.integer_value;
      correct = typeof expected === 'number' && n === expected;
      selPayload = isFinite(n) ? n : v;
    } else {
      // SCQ / AR / MST / MTC — single selected id
      const sel = typeof cur.selected === 'string' ? cur.selected : null;
      if (!sel) return;
      const opt = (qq.options ?? []).find(o => o.id === sel);
      correct = !!opt?.is_correct;
      selPayload = sel;
    }
    updateQState(qq.id, { submitted: true, isCorrect: correct, showSolution: true });
    persistAttempt(qq, correct, selPayload);
    track('question_attempted', {
      mode: 'browse',
      question_id: qq.id,
      display_id: qq.display_id,
      chapter_id: qq.metadata.chapter_id,
      question_type: qq.type,
      difficulty_level: qq.metadata.difficultyLevel,
      is_correct: correct,
      is_pyq: !!qq.metadata.is_pyq,
    });
    // Fetch option stats once revealed
    if (!cur.optionStats) {
      fetchOptionStats(qq.id).then(stats => updateQState(qq.id, { optionStats: stats }));
    }
  }, [qStates, updateQState, persistAttempt]);

  const onRevealSolution = useCallback((qq: Question) => {
    // For SUBJ / when student gives up
    updateQState(qq.id, { showSolution: true });
  }, [updateQState]);

  // Open the session-classification modal if the student attempted at least 1
  // question; otherwise leave silently. Data is already persisted at MEDIUM
  // confidence — the modal lets the student keep that classification (default)
  // or downgrade the entire session to LOW ('this was casual'). Tab-close
  // skips the modal but data is still safe (handled by sendBeacon backstop).
  const handleExit = useCallback(() => {
    if (browseAttempts.length >= 1) setShowSaveModal(true);
    else onBack();
  }, [browseAttempts.length, onBack]);

  // Retroactively flag this whole browse session as casual ('low').
  // The PATCH endpoint walks recent_attempts, finds every attempt with this
  // session_id, decrements mastery + exposure counters, and tags them low.
  // No data is deleted — the attempts just stop influencing mastery surfaces.
  const markSessionCasual = useCallback(async () => {
    if (casualMarking) return;
    setCasualMarking(true);
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch('/api/v2/user/progress/session-confidence', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          confidence: 'low',
        }),
        keepalive: true,
      });
    } catch { /* best-effort — modal will still close on the user's tap */ }
    finally {
      setCasualMarking(false);
    }
  }, [casualMarking]);

  // beforeunload / pagehide backstop — replays any in-flight attempts via
  // sendBeacon (the only fetch primitive guaranteed to complete during
  // unload). Same-origin call → browser includes Supabase session cookies
  // automatically, and our unified getAuthenticatedUser supports cookie auth.
  useEffect(() => {
    const flush = () => {
      const pending = pendingFlushRef.current;
      if (pending.length === 0) return;
      for (const { qq, is_correct, selected_option } of pending) {
        const body = JSON.stringify({
          question_id: qq.id,
          display_id: qq.display_id,
          chapter_id: qq.metadata.chapter_id,
          difficulty: qq.metadata.difficultyLevel,
          concept_tags: qq.metadata.tags?.map(t => t.tag_id) ?? [],
          micro_concept: qq.metadata.microConcept ?? null,
          is_correct,
          selected_option,
          source: 'browse',
          confidence: 'medium',
          session_id: sessionIdRef.current,
        });
        try {
          navigator.sendBeacon(
            '/api/v2/user/progress',
            new Blob([body], { type: 'application/json' }),
          );
        } catch { /* nothing more we can do at this point */ }
      }
      pendingFlushRef.current = [];
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  // Flag modal submit
  const submitFlag = async () => {
    if (!flagModalQuestion) return;
    setFlagSubmitting(true); setFlagResult(null);
    try {
      const supabase = createSupabaseClient();
      let auth: Record<string, string> = {};
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) auth = { Authorization: `Bearer ${session.access_token}` };
      }
      const res = await fetch(`/api/v2/questions/${flagModalQuestion.id}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({ type: flagType, note: flagNote.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setFlaggedIds(prev => new Set(prev).add(flagModalQuestion.id));
        setFlagResult({ ok: true, msg: data.message });
        setTimeout(() => setFlagModalQuestion(null), 1500);
      } else {
        setFlagResult({ ok: false, msg: data.error ?? 'Failed to submit.' });
      }
    } catch {
      setFlagResult({ ok: false, msg: 'Network error.' });
    } finally { setFlagSubmitting(false); }
  };

  // ───────────────────────── Sub-renders ─────────────────────────
  const EXAM_FILTERS: { id: typeof examFilter; label: string }[] = examBoard === 'NEET'
    ? [
        { id: 'all', label: 'All' },
        { id: 'mains', label: 'NEET PYQ' },
        { id: 'non-pyq', label: 'Practice' },
        { id: 'starred', label: 'Bookmarked' },
      ]
    : [
        { id: 'all', label: 'All' },
        { id: 'mains', label: 'JEE Mains' },
        { id: 'advanced', label: 'JEE Advanced' },
        { id: 'non-pyq', label: 'Practice' },
        { id: 'starred', label: 'Bookmarked' },
      ];

  // Topic sidebar (desktop) / drawer (mobile)
  const TopicList = (
    <div className="flex flex-col gap-1.5 px-2.5 py-3">
      {/* All Topics — pinned */}
      {(() => {
        const active = topicFilter === 'all';
        const pct = topicCounts.all.total > 0 ? (topicCounts.all.solved / topicCounts.all.total) * 100 : 0;
        return (
          <button
            onClick={() => { setTopicFilter('all'); setTopicDrawerOpen(false); }}
            className="group relative flex flex-col gap-2 px-3.5 py-3 rounded-xl text-left transition-all overflow-hidden"
            style={{
              background: active
                ? `linear-gradient(135deg, ${accent}22, ${accent}10)`
                : 'transparent',
              border: `1px solid ${active ? `${accent}55` : 'transparent'}`,
              boxShadow: active ? `0 0 24px -8px ${accent}55` : 'none',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[13.5px] font-bold tracking-tight"
                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.85)' }}
              >
                All Topics
              </span>
              <span
                className="text-[10.5px] font-bold tabular-nums px-2 py-0.5 rounded-md"
                style={{
                  color: active ? accent : 'rgba(255,255,255,0.5)',
                  background: active ? `${accent}1F` : 'rgba(255,255,255,0.06)',
                }}
              >
                {topicCounts.all.solved}/{topicCounts.all.total}
              </span>
            </div>
            <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
                }}
              />
            </div>
          </button>
        );
      })()}

      <div className="h-px bg-white/[0.04] my-1.5 mx-2" />

      {topics.map(t => {
        const c = topicCounts.perTopic.get(t.id) ?? { solved: 0, total: 0 };
        if (c.total === 0) return null;
        const pct = c.total > 0 ? (c.solved / c.total) * 100 : 0;
        const active = topicFilter === t.id;
        return (
          <button
            key={t.id}
            onClick={() => { setTopicFilter(t.id); setTopicDrawerOpen(false); }}
            className="group relative flex flex-col gap-2 px-3.5 py-3 rounded-xl text-left transition-all overflow-hidden"
            style={{
              background: active
                ? `linear-gradient(135deg, ${accent}22, ${accent}10)`
                : 'transparent',
              border: `1px solid ${active ? `${accent}55` : 'transparent'}`,
              boxShadow: active ? `0 0 24px -8px ${accent}55` : 'none',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-start justify-between gap-2.5">
              <span
                className="text-[13px] font-semibold leading-snug tracking-tight"
                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.78)' }}
              >
                {t.name}
              </span>
              <span
                className="text-[10.5px] font-bold tabular-nums px-2 py-0.5 rounded-md shrink-0 mt-px"
                style={{
                  color: active ? accent : 'rgba(255,255,255,0.45)',
                  background: active ? `${accent}1F` : 'rgba(255,255,255,0.05)',
                }}
              >
                {c.solved}/{c.total}
              </span>
            </div>
            <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: active
                    ? `linear-gradient(90deg, ${accent}, ${accent}cc)`
                    : `linear-gradient(90deg, ${accent}99, ${accent}66)`,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );

  // ───────────────────────── Question card ─────────────────────────
  const renderOption = (qq: Question, opt: { id: string; text: string; is_correct: boolean }, idx: number) => {
    const st = qStates.get(qq.id) ?? emptyQState;
    const isMCQ = qq.type === 'MCQ';
    const sel = isMCQ
      ? (Array.isArray(st.selected) ? st.selected.includes(opt.id) : false)
      : st.selected === opt.id;
    const submitted = st.submitted;
    const correct = opt.is_correct;
    const stats = st.optionStats ?? {};
    const pct = stats[opt.id] ?? 0;

    let border = 'border-white/10';
    let bg = 'bg-white/[0.03] hover:bg-white/[0.06]';
    let labelColor = 'text-white/45';
    if (sel && !submitted) {
      border = 'border-orange-400';
      bg = 'bg-orange-500/8';
      labelColor = 'text-orange-300';
    }
    if (submitted) {
      if (correct) {
        border = 'border-emerald-500/70';
        bg = 'bg-emerald-500/10';
        labelColor = 'text-emerald-400';
      } else if (sel) {
        border = 'border-red-500/70';
        bg = 'bg-red-500/10';
        labelColor = 'text-red-400';
      } else {
        border = 'border-white/8';
        bg = 'bg-white/[0.02]';
        labelColor = 'text-white/30';
      }
    }

    const letter = String.fromCharCode(65 + idx); // A B C D

    return (
      <button
        key={opt.id}
        onClick={() => onSelectOption(qq, opt.id)}
        disabled={submitted}
        className={`relative overflow-hidden flex items-start gap-3 text-left rounded-xl border ${border} ${bg} px-4 py-3 transition-all ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {/* Stats bar (post-submit, poll-style) */}
        {submitted && pct > 0 && (
          <div
            className="absolute inset-y-0 left-0 pointer-events-none transition-all"
            style={{
              width: `${pct}%`,
              background: correct ? 'rgba(52,211,153,0.10)' : sel ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)',
            }}
          />
        )}

        <div className={`relative shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold ${labelColor} bg-white/5 border border-white/8`}>
          {submitted && correct ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : letter}
        </div>

        <div className="relative flex-1 min-w-0 text-[15px] text-white/90 pt-0.5">
          <MathRenderer
            markdown={opt.text || ''}
            fontSize={isMobile ? 14 : 15}
            imageScale={qq.svg_scales?.[`option_${opt.id}`] ?? 100}
          />
        </div>

        {submitted && pct > 0 && (
          <span className="relative shrink-0 text-[11px] font-mono tabular-nums text-white/40 self-center">
            {pct}%
          </span>
        )}
      </button>
    );
  };

  const renderCard = (qq: Question, displayIdx: number) => {
    const st = qStates.get(qq.id) ?? emptyQState;
    const isStarred = starred.has(qq.id);
    const diffColor = DIFF_COLOR(qq.metadata.difficultyLevel);
    const isMCQ = qq.type === 'MCQ';

    // Exam badge
    const examDet = qq.metadata.examDetails;
    const examSrc = qq.metadata.exam_source;
    let examLabel: string | null = null;
    let examAccent = '#60a5fa';
    if (examDet?.year) {
      const isNEET = examDet.exam === 'NEET_UG' || examDet.exam === 'NEET_PG';
      const name = isNEET ? 'NEET' : examDet.exam === 'JEE_Main' ? 'JEE Main' : examDet.exam === 'JEE_Advanced' ? 'JEE Adv' : examDet.exam;
      const suffix = examDet.phase ? ` · ${examDet.phase}` : examDet.shift ? ` (${examDet.shift.replace('Shift ', 'S').replace('Session ', 'S')})` : '';
      examLabel = `${name} ${examDet.year}${suffix}`;
      if (isNEET) examAccent = '#34d399';
    } else if (examSrc?.year) {
      examLabel = `${examSrc.exam ?? 'JEE Main'} ${examSrc.year}${examSrc.month ? ` · ${examSrc.month}` : ''}`;
    }

    const useGrid = qq.options ? isShortOptions(qq.options, isMobile) : false;

    // Submit-button enabled state
    let canSubmit = false;
    if (qq.type === 'MCQ') canSubmit = Array.isArray(st.selected) && st.selected.length > 0;
    else if (qq.type === 'NVT') canSubmit = !!(st.integerInput && st.integerInput.trim());
    else canSubmit = typeof st.selected === 'string' && !!st.selected;

    return (
      <article
        key={qq.id}
        ref={el => { cardRefs.current.set(qq.id, el); }}
        className="relative rounded-2xl overflow-hidden mb-5 transition-all"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(0,0,0,0.15) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset',
        }}
      >
        {/* Difficulty stripe — subtle gradient bar on the left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${diffColor}, ${diffColor}33)` }}
        />
        {/* Top metadata row */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.05] flex-wrap">
          <span
            className="font-mono text-[14px] font-bold tabular-nums tracking-tight select-none"
            style={{ color: accent }}
          >
            {pad2(displayIdx)}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
            style={{ color: diffColor, background: `${diffColor}1A`, border: `1px solid ${diffColor}33` }}
          >
            {DIFF_LABEL(qq.metadata.difficultyLevel)}
          </span>
          <span className="text-[10.5px] text-white/40 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
            {TYPE_LABEL[qq.type] ?? qq.type}
          </span>
          {persistedAttempts.get(qq.id) === 'correct' && !st.submitted && (
            <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" strokeWidth={3} />Solved
            </span>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => toggleStar(qq)}
              title="Bookmark"
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                isStarred ? 'bg-amber-400/15 text-amber-300' : 'text-white/35 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isStarred ? '#fbbf24' : 'none'} />
            </button>
            <button
              onClick={() => { setFlagModalQuestion({ id: qq.id, displayId: qq.display_id }); setFlagType('wrong_answer'); setFlagNote(''); setFlagResult(null); }}
              title="Report issue"
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                flaggedIds.has(qq.id) ? 'bg-red-500/10 text-red-400' : 'text-white/35 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Flag className="w-3.5 h-3.5" fill={flaggedIds.has(qq.id) ? '#f87171' : 'none'} />
            </button>
          </div>
        </div>

        {/* Question text */}
        <div className="px-5 pt-5 pb-4">
          <div className="text-white/95 text-[17px] leading-[1.55] tracking-[-0.005em] font-normal">
            <MathRenderer
              markdown={qq.question_text.markdown}
              fontSize={isMobile ? 15 : 17}
              imageScale={qq.svg_scales?.question ?? 100}
            />
          </div>
        </div>

        {/* MCQ hint */}
        {isMCQ && !st.submitted && (
          <div className="mx-5 mb-3 px-3 py-1.5 rounded-md text-[11px] font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 inline-flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3 h-3" />
            Multiple correct — select all that apply
          </div>
        )}

        {/* Options / NVT input / SUBJ */}
        <div className="px-5 pb-4">
          {qq.type === 'SUBJ' ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3.5 text-[13px] text-white/55">
              This is a subjective question. Solve it on paper, then check the worked solution.
            </div>
          ) : qq.type === 'NVT' ? (
            <input
              type="text"
              inputMode="decimal"
              placeholder="Enter your answer"
              disabled={st.submitted}
              value={st.integerInput ?? ''}
              onChange={e => updateQState(qq.id, { selected: 'nvt', integerInput: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter' && canSubmit) onSubmit(qq); }}
              className={`w-full px-4 py-3 rounded-xl border bg-white/[0.03] text-white text-[16px] outline-none transition-colors ${
                st.submitted
                  ? (st.isCorrect ? 'border-emerald-500/70 bg-emerald-500/5' : 'border-red-500/70 bg-red-500/5')
                  : 'border-white/12 focus:border-orange-400/60'
              }`}
            />
          ) : (
            qq.options && qq.options.length > 0 && (
              <div className={useGrid ? 'grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2.5'}>
                {qq.options.map((o, i) => renderOption(qq, o, i))}
              </div>
            )
          )}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3 px-5 pb-5 flex-wrap">
          {!st.submitted && qq.type !== 'SUBJ' ? (
            <button
              onClick={() => onSubmit(qq)}
              disabled={!canSubmit}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold tracking-tight transition-all"
              style={canSubmit ? {
                background: `${accent}1F`,
                color: accent,
                border: `1px solid ${accent}55`,
              } : {
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'not-allowed',
              }}
              onMouseEnter={e => {
                if (canSubmit) {
                  e.currentTarget.style.background = `${accent}33`;
                  e.currentTarget.style.borderColor = `${accent}88`;
                }
              }}
              onMouseLeave={e => {
                if (canSubmit) {
                  e.currentTarget.style.background = `${accent}1F`;
                  e.currentTarget.style.borderColor = `${accent}55`;
                }
              }}
            >
              Submit answer
            </button>
          ) : null}

          {/* Reveal solution / always available */}
          <button
            onClick={() => {
              const opening = !st.showSolution;
              if (opening) {
                track('solution_viewed', {
                  mode: 'browse',
                  question_id: qq.id,
                  chapter_id: qq.metadata.chapter_id,
                  // The strongest weakness signal in browse mode — viewing the
                  // solution without ever submitting an answer.
                  before_submit: !st.submitted,
                });
              }
              updateQState(qq.id, { showSolution: opening });
            }}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-colors flex items-center gap-1.5 ${
              st.showSolution
                ? 'bg-white/[0.06] text-white/80 border border-white/10'
                : 'bg-transparent text-white/55 hover:text-white/85 border border-white/10 hover:border-white/20'
            }`}
          >
            {st.showSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {st.showSolution ? 'Hide solution' : qq.type === 'SUBJ' ? 'View solution' : st.submitted ? 'View solution' : 'Skip & view solution'}
          </button>

          {/* Result badge after submit */}
          {st.submitted && (
            <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ${
              st.isCorrect ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
            }`}>
              {st.isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </span>
          )}

          {examLabel && (
            <span
              className="ml-auto text-[10.5px] px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{ color: examAccent, background: `${examAccent}12`, border: `1px solid ${examAccent}33` }}
            >
              {examLabel}
            </span>
          )}
        </div>

        {/* Solution drawer */}
        {st.showSolution && (
          <div className="border-t border-white/[0.06] bg-black/20 px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-400/80">Solution</span>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/the-crucible/q/${qq.id}`;
                  navigator.clipboard.writeText(url).then(() => {
                    setCopiedId(qq.id);
                    setTimeout(() => setCopiedId(null), 1500);
                  });
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white/65 transition-colors"
              >
                {copiedId === qq.id ? <><Check className="w-3 h-3" />Copied</> : <><ExternalLink className="w-3 h-3" />Share</>}
              </button>
            </div>

            {/* Media explanations — prominent row pinned just under the
                SOLUTION header so students don't miss them when scrolling
                long text. Each button is a full-fledged CTA (not a tiny
                pill) with a play affordance + descriptive label. */}
            {(qq.solution?.video_url || (qq.solution?.asset_ids?.audio?.length ?? 0) > 0) && (
              <div className="flex flex-wrap gap-2.5 mb-4">
                {qq.solution?.video_url && (
                  <button
                    onClick={() => updateQState(qq.id, { videoOpen: !st.videoOpen })}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                    style={st.videoOpen ? {
                      background: 'rgba(59,130,246,0.10)',
                      color: '#93c5fd',
                      border: '1px solid rgba(59,130,246,0.30)',
                    } : {
                      background: 'rgba(59,130,246,0.18)',
                      color: '#bfdbfe',
                      border: '1px solid rgba(59,130,246,0.50)',
                      boxShadow: '0 0 20px -6px rgba(59,130,246,0.45)',
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                      style={{ background: st.videoOpen ? 'rgba(59,130,246,0.20)' : 'rgba(59,130,246,0.40)' }}
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                    </span>
                    <span>{st.videoOpen ? 'Hide video' : 'Watch video explanation'}</span>
                    {st.videoOpen ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                  </button>
                )}
                {(qq.solution?.asset_ids?.audio ?? []).map((url, i) => url && (
                  <button
                    key={i}
                    onClick={() => updateQState(qq.id, { audioOpen: { ...(st.audioOpen ?? {}), [i]: !st.audioOpen?.[i] } })}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                    style={st.audioOpen?.[i] ? {
                      background: 'rgba(168,85,247,0.10)',
                      color: '#d8b4fe',
                      border: '1px solid rgba(168,85,247,0.30)',
                    } : {
                      background: 'rgba(168,85,247,0.18)',
                      color: '#e9d5ff',
                      border: '1px solid rgba(168,85,247,0.50)',
                      boxShadow: '0 0 20px -6px rgba(168,85,247,0.45)',
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                      style={{ background: st.audioOpen?.[i] ? 'rgba(168,85,247,0.20)' : 'rgba(168,85,247,0.40)' }}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                    <span>
                      {st.audioOpen?.[i]
                        ? `Hide audio${(qq.solution?.asset_ids?.audio?.length ?? 0) > 1 ? ` ${i + 1}` : ''}`
                        : `Listen to audio note${(qq.solution?.asset_ids?.audio?.length ?? 0) > 1 ? ` ${i + 1}` : ''}`}
                    </span>
                    {st.audioOpen?.[i] ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                  </button>
                ))}
              </div>
            )}

            {qq.solution?.video_url && st.videoOpen && (
              <div className="mb-4 rounded-lg overflow-hidden bg-black">
                {qq.solution.video_url.includes('youtube.com') || qq.solution.video_url.includes('youtu.be') ? (
                  <div className="relative pb-[56.25%]">
                    <iframe
                      src={qq.solution.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video controls className="w-full max-h-[600px] block">
                    <source src={qq.solution.video_url} type="video/mp4" />
                  </video>
                )}
              </div>
            )}

            {(qq.solution?.asset_ids?.audio ?? []).map((url, i) =>
              url && st.audioOpen?.[i] ? (
                <div key={i} className="mb-3">
                  <WaveformAudioPlayer src={url} accent="#a855f7" />
                </div>
              ) : null
            )}

            {qq.solution?.text_markdown ? (
              <div className="text-white/85 leading-relaxed">
                <MathRenderer
                  markdown={qq.solution.text_markdown}
                  fontSize={isMobile ? 14 : 16}
                  imageScale={qq.svg_scales?.solution ?? 100}
                />
              </div>
            ) : qq.solution_pending ? (
              <div className="text-[13px] text-white/45 italic flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full border-[1.5px] border-orange-400/30 border-t-orange-400 animate-spin" />
                Loading solution…
              </div>
            ) : (
              <div className="text-[13px] text-white/40 italic">Solution not available for this question.</div>
            )}
          </div>
        )}
      </article>
    );
  };

  // ───────────────────────── Layout ─────────────────────────
  return (
    <>
      <div className="fixed inset-0 z-50 text-white flex flex-col overflow-hidden" style={{ background: '#0F1117' }}>
        {/* Ambient color wash — picks up the chapter's accent so each subject feels distinct */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(900px 500px at 85% -10%, ${accent}1A, transparent 60%),
              radial-gradient(700px 600px at -10% 100%, ${accent}10, transparent 65%)
            `,
          }}
        />

        {/* HEADER */}
        <header className="relative z-10 border-b border-white/[0.06] bg-[#0A0B12]/95 backdrop-blur-md flex-shrink-0">
          <div className="max-w-[1480px] mx-auto px-4 lg:px-8 py-3.5 flex items-center gap-4">
            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back
            </button>

            {isMobile && topics.length > 0 && (
              <button
                onClick={() => setTopicDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/55 hover:text-white border border-white/10 transition-colors"
              >
                <Menu className="w-3.5 h-3.5" />
                Topics
              </button>
            )}

            <div className="flex-1 min-w-0 flex items-center gap-3">
              {currentChapter && (
                <>
                  <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/35 uppercase tracking-wider font-medium">
                    <span>The Crucible</span>
                    <span>/</span>
                    <span>{currentChapter.category ?? 'Chemistry'}</span>
                  </div>
                  <h1 className="text-[17px] lg:text-[20px] font-bold leading-tight tracking-tight text-white truncate">
                    {currentChapter.name}
                  </h1>
                  {currentChapter.category && (
                    <span
                      className="hidden lg:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap"
                      style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}35` }}
                    >
                      {currentChapter.category}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Session stats — colored chips */}
            <div className="hidden md:flex items-stretch gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <div className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold leading-none mb-1">Answered</div>
                <div className="font-mono text-[13px] text-white tabular-nums leading-none">
                  {sessionStats.answered}<span className="text-white/30">/{sessionStats.total}</span>
                </div>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg border"
                style={{ background: 'rgba(52,211,153,0.10)', borderColor: 'rgba(52,211,153,0.25)' }}
              >
                <div className="text-[9px] text-emerald-400/70 uppercase tracking-[0.1em] font-bold leading-none mb-1">Accuracy</div>
                <div className="font-mono text-[13px] text-emerald-300 tabular-nums leading-none">{sessionStats.accuracy}%</div>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg border"
                style={{ background: 'rgba(251,191,36,0.10)', borderColor: 'rgba(251,191,36,0.25)' }}
              >
                <div className="text-[9px] text-amber-300/70 uppercase tracking-[0.1em] font-bold leading-none mb-1">Saved</div>
                <div className="font-mono text-[13px] text-amber-300 tabular-nums leading-none">{starred.size}</div>
              </div>
            </div>
          </div>

          {/* Filter row */}
          <div className="border-t border-white/[0.04] bg-[#0A0B12]/80">
            <div className="max-w-[1480px] mx-auto px-4 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto">
              {EXAM_FILTERS.map(({ id, label }) => {
                const active = examFilter === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setExamFilter(id); setYearFilter('all'); }}
                    className="px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all"
                    style={active ? {
                      background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                      color: '#0A0B12',
                      border: `1px solid ${accent}`,
                      boxShadow: `0 0 18px -4px ${accent}88`,
                    } : {
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => {
                      if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }
                    }}
                    onMouseLeave={e => {
                      if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }
                    }}
                  >
                    {label}
                  </button>
                );
              })}

              {(examFilter === 'mains' || examFilter === 'advanced') && availableYears.length > 0 && (
                <select
                  value={yearFilter}
                  onChange={e => setYearFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white/[0.04] text-white/65 border border-white/[0.08] outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0A0B12]">All Years</option>
                  {availableYears.map(y => (
                    <option key={y} value={String(y)} className="bg-[#0A0B12]">{y}</option>
                  ))}
                </select>
              )}

              <div className="ml-auto flex items-center gap-2">
                {searchOpen ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12]">
                    <Search className="w-3.5 h-3.5 text-white/40" />
                    <input
                      autoFocus
                      placeholder="Search questions…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                      className="bg-transparent text-[12.5px] text-white outline-none w-44"
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="text-white/40 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-white/55 hover:text-white/85 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="relative z-0 flex-1 flex overflow-hidden">

          {/* TOPIC SIDEBAR (desktop) */}
          {!isMobile && topics.length > 0 && (
            <aside
              className="relative w-[310px] flex-shrink-0 border-r border-white/[0.06] overflow-y-auto"
              style={{
                background: `linear-gradient(180deg, ${accent}08 0%, transparent 35%), #0A0B12`,
              }}
            >
              {/* Sidebar header */}
              <div className="px-4 pt-5 pb-4 border-b border-white/[0.05] sticky top-0 z-10 backdrop-blur-md"
                style={{ background: `linear-gradient(180deg, #0A0B12 0%, rgba(10,11,18,0.85) 100%)` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                    Topics
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[20px] font-bold text-white tabular-nums leading-none">{topics.length}</span>
                  <span className="text-[11px] text-white/40">topics ·</span>
                  <span className="text-[12px] font-semibold text-white/70 tabular-nums">{topicCounts.all.total}</span>
                  <span className="text-[11px] text-white/40">questions</span>
                </div>
              </div>
              {TopicList}
            </aside>
          )}

          {/* TOPIC DRAWER (mobile) */}
          {isMobile && topicDrawerOpen && (
            <>
              <div
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                onClick={() => setTopicDrawerOpen(false)}
              />
              <aside className="fixed top-0 left-0 bottom-0 z-[61] w-[85%] max-w-[320px] bg-[#0A0B12] border-r border-white/10 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/55">Topics</div>
                  <button onClick={() => setTopicDrawerOpen(false)} className="text-white/50 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {TopicList}
              </aside>
            </>
          )}

          {/* QUESTION STREAM */}
          <main ref={scrollAreaRef} className="flex-1 overflow-y-auto">
            <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-white/25 text-[14px] mb-2">No questions match your filters</div>
                  <button
                    onClick={() => { setExamFilter('all'); setTopicFilter('all'); setYearFilter('all'); setSearchQuery(''); }}
                    className="text-orange-400 hover:text-orange-300 text-[13px] font-semibold"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Result count strip */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.05]">
                    <div className="text-[11.5px] text-white/45">
                      Showing <span className="text-white/80 font-mono tabular-nums">{Math.min(visibleCount, filteredQuestions.length)}</span> of <span className="text-white/80 font-mono tabular-nums">{filteredQuestions.length}</span> questions
                    </div>
                    {topicFilter !== 'all' && (
                      <button
                        onClick={() => setTopicFilter('all')}
                        className="text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        style={{ color: accent }}
                      >
                        <X className="w-3 h-3" /> Clear topic
                      </button>
                    )}
                  </div>

                  {visibleQuestions.map((qq, i) => renderCard(qq, i + 1))}

                  {hasMore && (
                    <div className="flex justify-center pt-4 pb-8">
                      <button
                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[13px] font-semibold text-white/75 transition-colors"
                      >
                        Load {Math.min(PAGE_SIZE, filteredQuestions.length - visibleCount)} more
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* SESSION CLASSIFICATION MODAL.
          Data is already persisted at MEDIUM confidence (drives "explored
          topics" exposure but NOT mastery — see CRUCIBLE_ARCHITECTURE.md
          §3.2). This modal lets the student either keep that classification
          or downgrade the whole session to LOW (casual). */}
      {showSaveModal && (() => {
        const correctCount = browseAttempts.filter(a => a.is_correct).length;
        const total = browseAttempts.length;
        const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        return (
          <div className="fixed inset-0 z-[100] bg-black/72 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-[#13151E] border border-white/10 rounded-3xl p-7 max-w-sm w-full shadow-2xl">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: accent }}>
                Session ended
              </div>
              <div className="text-[20px] font-bold text-white mb-1 leading-tight tracking-tight">
                Nice work.
              </div>
              <div className="text-[12.5px] text-white/55 mb-4 leading-snug">
                Was this real practice, or just casual browsing?
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
                  <div className="font-mono text-[18px] text-white tabular-nums leading-none">{total}</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/45 font-bold mt-1">Answered</div>
                </div>
                <div className="rounded-xl border p-3 text-center" style={{ background: 'rgba(52,211,153,0.10)', borderColor: 'rgba(52,211,153,0.25)' }}>
                  <div className="font-mono text-[18px] text-emerald-300 tabular-nums leading-none">{correctCount}</div>
                  <div className="text-[10px] uppercase tracking-wide text-emerald-400/70 font-bold mt-1">Correct</div>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
                  <div className="font-mono text-[18px] text-white tabular-nums leading-none">{acc}%</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/45 font-bold mt-1">Accuracy</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setShowSaveModal(false); onBack(); }}
                  disabled={casualMarking}
                  className="w-full py-3 rounded-xl text-[13.5px] font-bold transition-all disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                    color: '#0A0B12',
                    boxShadow: `0 0 18px -4px ${accent}88`,
                  }}
                >
                  Save to my progress
                </button>
                <button
                  onClick={async () => {
                    await markSessionCasual();
                    setShowSaveModal(false);
                    onBack();
                  }}
                  disabled={casualMarking}
                  className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold border border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white/85 transition-colors disabled:opacity-50"
                >
                  {casualMarking ? 'Marking…' : 'This was casual — don’t count'}
                </button>
              </div>
              <div className="text-[10.5px] text-white/35 mt-3 text-center leading-snug">
                Casual sessions stay in your history but don&rsquo;t affect your mastery score or recommendations.
              </div>
            </div>
          </div>
        );
      })()}

      {/* FLAG MODAL */}
      {flagModalQuestion && (
        <>
          <div onClick={() => setFlagModalQuestion(null)} className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-[440px] bg-[#0F1117] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-4">
              <Flag className="w-4 h-4 text-red-400" />
              <div className="flex-1">
                <div className="text-[14px] font-bold text-white">Report an issue</div>
                <div className="text-[11px] text-white/40 mt-0.5">{flagModalQuestion.displayId}</div>
              </div>
              <button onClick={() => setFlagModalQuestion(null)} className="w-7 h-7 rounded-md bg-white/5 border border-white/10 text-white/55 flex items-center justify-center hover:bg-white/10">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mb-3">
              {FLAG_TYPES.map(ft => (
                <button
                  key={ft.id}
                  onClick={() => setFlagType(ft.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                    flagType === ft.id
                      ? 'bg-red-500/10 border border-red-500/30'
                      : 'bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    flagType === ft.id ? 'border-red-400 bg-red-400' : 'border-white/25'
                  }`}>
                    {flagType === ft.id && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                  <span className={`text-[13px] ${flagType === ft.id ? 'text-red-200' : 'text-white/65'}`}>
                    {ft.label}
                  </span>
                </button>
              ))}
            </div>

            <textarea
              value={flagNote}
              onChange={e => setFlagNote(e.target.value.slice(0, 500))}
              placeholder="Any additional detail? (optional)"
              rows={2}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white outline-none resize-y mb-3"
            />

            {flagResult && (
              <div className={`px-3 py-2 rounded-lg mb-3 text-[13px] ${
                flagResult.ok
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}>
                {flagResult.msg}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setFlagModalQuestion(null)}
                className="px-4 py-2 rounded-lg border border-white/10 bg-transparent text-white/55 text-[13px] hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={submitFlag}
                disabled={flagSubmitting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold disabled:opacity-60"
              >
                {flagSubmitting ? 'Sending…' : 'Submit'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
