"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, Check, ChevronDown, MonitorPlay, Volume2, ChevronUp, ExternalLink, Flag, X } from 'lucide-react';
import Link from 'next/link';
import { Chapter, Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import WatermarkOverlay from '@/components/WatermarkOverlay';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import { difficultyColor } from '@/lib/difficultyUtils';

async function fetchOptionStats(questionId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/v2/questions/${questionId}/stats`);
    if (!res.ok) return {};
    const data = await res.json() as Record<string, unknown>;
    return (data.optionStats as Record<string, number> | undefined) || {};
  } catch { return {}; }
}

const DIFF_COLOR = (d: number | string) => {
  if (typeof d === 'number') return difficultyColor(d);
  const strMap: Record<string, string> = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171', Challenging: '#c084fc' };
  return strMap[d] ?? '#fbbf24';
};
const PAGE_SIZE = 15;

const isShortOptions = (opts: { id: string; text: string; is_correct: boolean }[], isMobile: boolean): boolean => {
  if (!opts || opts.length !== 4) return false;
  return opts.every(o => {
    const t = (o.text || '');
    if (t.includes('$') || t.includes('![')) return false;
    const plain = t.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    // Very strict limit on mobile: only 1-2 word options get grid (e.g., "Structure A", "Three", "One")
    return plain.length <= (isMobile ? 12 : 28);
  });
};

const hasImageMarkdown = (markdown: string): boolean => /!\[[^\]]*\]\([^)]+\)/.test(markdown);

export default function BrowseView({ questions, chapters, onBack, chapterId, guidedMode, onQuestionAnswered, examBoard }: {
  questions: Question[];
  chapters: Chapter[];
  onBack: () => void;
  chapterId?: string;
  guidedMode?: boolean;
  onQuestionAnswered?: (isCorrect: boolean) => void;
  examBoard?: 'JEE' | 'NEET';
}) {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [cardExpanded, setCardExpanded] = useState<Record<number, boolean>>({});
  const [cardSol, setCardSol] = useState<Record<number, boolean>>({});
  const [cardOpt, setCardOpt] = useState<Record<number, string | string[] | null>>({});
  const [cardStats, setCardStats] = useState<Record<number, Record<string, number>>>({});
  const [activeNavIdx, setActiveNavIdx] = useState(0);
  // 'all' | 'mains' | 'advanced' | 'non-pyq'
  const [examFilter, setExamFilter] = useState<'all' | 'mains' | 'advanced' | 'non-pyq'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [conceptTagFilter, setConceptTagFilter] = useState<string>('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  // Video and audio expansion state
  const [videoExpanded, setVideoExpanded] = useState<Record<number, boolean>>({});
  const [audioExpanded, setAudioExpanded] = useState<Record<string, boolean>>({});
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Flag modal state
  const [flagModalQuestion, setFlagModalQuestion] = useState<{ id: string; displayId: string } | null>(null);
  const [flagType, setFlagType] = useState<string>('wrong_answer');
  const [flagNote, setFlagNote] = useState('');
  const [flagSubmitting, setFlagSubmitting] = useState(false);
  const [flagResult, setFlagResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set()); // questions already flagged this session

  const FLAG_TYPES = [
    { id: 'wrong_answer',   label: 'Answer seems incorrect' },
    { id: 'wrong_question', label: 'Question text has an error' },
    { id: 'latex_rendering', label: 'Math / formula not rendering' },
    { id: 'image_missing',  label: 'Diagram or image missing' },
    { id: 'option_error',   label: 'Error in one of the options' },
    { id: 'solution_error', label: 'Solution is wrong or incomplete' },
    { id: 'other',          label: 'Other (describe below)' },
  ];

  const openFlagModal = (id: string, displayId: string) => {
    setFlagModalQuestion({ id, displayId });
    setFlagType('wrong_answer');
    setFlagNote('');
    setFlagResult(null);
  };

  const submitFlag = async () => {
    if (!flagModalQuestion) return;
    setFlagSubmitting(true);
    setFlagResult(null);
    try {
      const supabase = createSupabaseClient();
      let authHeader: Record<string, string> = {};
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) authHeader = { Authorization: `Bearer ${session.access_token}` };
      }
      const res = await fetch(`/api/v2/questions/${flagModalQuestion.id}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ type: flagType, note: flagNote.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setFlaggedIds(prev => new Set(prev).add(flagModalQuestion.id));
        setFlagResult({ ok: true, msg: data.message });
        setTimeout(() => setFlagModalQuestion(null), 1800);
      } else {
        setFlagResult({ ok: false, msg: data.error ?? 'Failed to submit. Please try again.' });
      }
    } catch {
      setFlagResult({ ok: false, msg: 'Network error. Please try again.' });
    } finally {
      setFlagSubmitting(false);
    }
  };

  // Helper for alphanumeric sorting (e.g., GOC-001 < GOC-002)
  const sortQuestions = (a: Question, b: Question) => {
    return (a.display_id || '').localeCompare(b.display_id || '', undefined, { numeric: true, sensitivity: 'base' });
  };

  // Concept tags available for the current chapter (from taxonomy)
  const availableConceptTags = useMemo(() => {
    if (!chapterId) return [];
    return TAXONOMY_FROM_CSV
      .filter((node: { type?: string; parent_id?: string; id?: string; name?: string }) => node.type === 'topic' && node.parent_id === chapterId)
      .map((node: { type?: string; parent_id?: string; id?: string; name?: string }) => ({ id: node.id || '', name: node.name || '' }));
  }, [chapterId]);

  // Distinct years available for the selected PYQ source
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

  // Filter questions client-side based on exam filter + year filter + concept tag + starred + SORT BY display_id
  const filteredQuestions = questions
    .filter(q => {
      if (showStarredOnly && !starred.has(q.id)) return false;
      if (examFilter === 'non-pyq') { if (q.metadata.is_pyq) return false; }
      else if (examFilter !== 'all') {
        const exam = (q.metadata.exam_source?.exam ?? '').toLowerCase();
        if (examFilter === 'mains' && (!q.metadata.is_pyq || !/main/i.test(exam))) return false;
        if (examFilter === 'advanced' && (!q.metadata.is_pyq || !/adv/i.test(exam))) return false;
      }
      if (yearFilter !== 'all' && (examFilter === 'mains' || examFilter === 'advanced')) {
        if (q.metadata.exam_source?.year !== Number(yearFilter)) return false;
      }
      if (conceptTagFilter !== 'all') {
        if (!q.metadata.tags.some(t => t.tag_id === conceptTagFilter)) return false;
      }
      return true;
    })
    .sort(sortQuestions);

  // Local browse-session attempt buffer — flushed to API only if user confirms on exit
  type BrowseAttempt = {
    qq: Question;
    is_correct: boolean;
    selected_option: string | string[] | number | null;
  };
  const [browseAttempts, setBrowseAttempts] = useState<BrowseAttempt[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);
  const pageQuestions = filteredQuestions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load user starred questions on mount
  useEffect(() => {
    (async () => {
      try {
        const supabase = createSupabaseClient();
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch(
          `/api/v2/user/progress${chapterId ? `?chapterId=${chapterId}` : ''}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.starred_ids?.length) {
          setStarred(new Set<string>(data.starred_ids));
        }
      } catch { /* not logged in or network error — local state only */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Record a question attempt to the backend (best-effort)
  const recordAttempt = useCallback(async (
    qq: Question,
    is_correct: boolean,
    selected_option: string | string[] | number | null = null,
    time_spent_seconds = 0,
  ) => {
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch('/api/v2/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          question_id: qq.id,
          display_id: qq.display_id,
          chapter_id: qq.metadata.chapter_id,
          difficulty: qq.metadata.difficultyLevel,
          concept_tags: qq.metadata.tags?.map(t => t.tag_id) ?? [],
          is_correct,
          selected_option,
          time_spent_seconds,
          source: 'browse',
        }),
      });
    } catch { /* non-critical */ }
  }, []);


  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track which card is in view for nav rail highlighting
  // Refined: We track multiple intersecting cards and pick the top-most one (min index)
  useEffect(() => {
    const visibleIndices = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            visibleIndices.add(idx);
          } else {
            visibleIndices.delete(idx);
          }
        });

        if (visibleIndices.size > 0) {
          const sorted = Array.from(visibleIndices).sort((a, b) => a - b);
          setActiveNavIdx(sorted[0]);
        }
      },
      { root: scrollAreaRef.current, threshold: 0.15 }
    );

    cardRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pageQuestions.length]);

  const changePage = (newPage: number) => {
    setPage(newPage);
    setCardExpanded({});
    setCardSol({});
    setCardOpt({});
    setCardStats({});
    setActiveNavIdx(0);
    scrollAreaRef.current?.scrollTo({ top: 0 });
  };

  const scrollSolutionIntoView = useCallback((solDivId: string) => {
    setTimeout(() => {
      const el = document.getElementById(solDivId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }, []);

  const expandCard = (i: number, qq: Question) => {
    setCardExpanded(s => ({ ...s, [i]: true }));
    if (!cardStats[i]) {
      fetchOptionStats(qq.id).then(stats => setCardStats(s => ({ ...s, [i]: stats })));
    }
  };

  // Track attempt locally — no API call in real-time.
  // Only flushed to the backend if the user saves on exit.
  const trackBrowseAttempt = useCallback((qq: Question, is_correct: boolean, selected_option: string | string[] | number | null = null) => {
    setBrowseAttempts(prev => {
      // Don't double-record the same question
      const already = prev.some(a => a.qq.id === qq.id);
      if (already) return prev;
      return [...prev, { qq, is_correct, selected_option }];
    });
  }, []);

  // Batch-save all local browse attempts to the backend
  const saveBrowseProgress = useCallback(async () => {
    if (browseAttempts.length === 0) return;
    setIsSaving(true);
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      // Fire all in parallel — best effort
      await Promise.allSettled(
        browseAttempts.map(({ qq, is_correct, selected_option }) =>
          fetch('/api/v2/user/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({
              question_id: qq.id,
              display_id: qq.display_id,
              chapter_id: qq.metadata.chapter_id,
              difficulty: qq.metadata.difficultyLevel,
              concept_tags: qq.metadata.tags?.map(t => t.tag_id) ?? [],
              is_correct,
              selected_option,
              source: 'browse',
            }),
          })
        )
      );
    } finally {
      setIsSaving(false);
    }
  }, [browseAttempts]);

  // Intercept exit — show Save modal if there are any tracked attempts
  const handleExit = useCallback(() => {
    if (browseAttempts.length > 0) {
      setShowSaveModal(true);
    } else {
      onBack();
    }
  }, [browseAttempts, onBack]);

  const toggleStar = useCallback(async (id: string, qq: Question) => {
    const isNowStarred = !starred.has(id);
    // Optimistically update local state
    setStarred(prev => { const n = new Set(prev); isNowStarred ? n.add(id) : n.delete(id); return n; });
    // Persist to backend (best-effort)
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch('/api/v2/user/starred', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          question_id: id,
          chapter_id: qq.metadata.chapter_id,
          action: isNowStarred ? 'star' : 'unstar',
        }),
      });
    } catch { /* local state already updated */ }
  }, [starred]);


  const renderOptions = (qq: Question, i: number) => {
    const isMCQ = qq.type === 'MCQ';
    const solShown = cardSol[i] ?? false;
    const optChosen = cardOpt[i] ?? null;
    const stats = cardStats[i] ?? {};
    const chosenArr: string[] = isMCQ
      ? (Array.isArray(optChosen) ? optChosen : [])
      : (typeof optChosen === 'string' ? [optChosen] : []);
    const solDivId = `sol-${page}-${i}`;
    const useGrid = qq.options ? isShortOptions(qq.options, isMobile) : false;

    return (
      <div>
        {isMCQ && !solShown && (
          <div style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', padding: '5px 12px', borderRadius: 8, marginBottom: 10, fontWeight: 600 }}>
            MCQ — Select one or more correct options
          </div>
        )}
        {qq.type === 'SUBJ' ? (
          <div style={{ marginBottom: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              This is a subjective question or solved example. Solve it on paper, then check the solution.
            </div>
            <button
              onClick={() => { setCardSol(s => ({ ...s, [i]: true })); scrollSolutionIntoView(solDivId); }}
              style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View Detailed Solution</button>
          </div>
        ) : qq.type === 'NVT' ? (
          <div style={{ marginBottom: 10 }}>
            <input type="text" placeholder="Enter integer answer"
              onKeyDown={e => { if (e.key === 'Enter') { setCardSol(s => ({ ...s, [i]: true })); scrollSolutionIntoView(solDivId); } }}
              onChange={e => setCardOpt(s => ({ ...s, [i]: e.target.value }))}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            <button
              onClick={() => { setCardSol(s => ({ ...s, [i]: true })); scrollSolutionIntoView(solDivId); }}
              style={{ marginTop: 8, padding: '9px 18px', borderRadius: 9, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Submit</button>
          </div>
        ) : (
          qq.options && qq.options.length > 0 && (
            <div style={{ display: useGrid ? 'grid' : 'flex', gridTemplateColumns: useGrid ? '1fr 1fr' : undefined, flexDirection: useGrid ? undefined : 'column', gap: 7, marginBottom: 10 }}>
              {qq.options.map((opt) => {
                const sel = chosenArr.includes(opt.id);
                const correct = opt.is_correct;
                const rev = solShown;
                let bc = sel ? '#3b82f6' : 'rgba(255,255,255,0.1)', bg = sel ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)';
                if (rev && correct) { bc = '#34d399'; bg = 'rgba(52,211,153,0.1)'; } else if (rev && sel && !correct) { bc = '#f87171'; bg = 'rgba(248,113,113,0.08)'; }
                const pct = stats[opt.id] ?? 0;
                return (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'stretch', gap: isMobile ? 6 : 8 }}>
                    {/* External Option Label */}
                    <div style={{ 
                      width: isMobile ? 20 : 24, 
                      flexShrink: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: 700,
                      color: rev ? (correct ? '#34d399' : sel ? '#f87171' : 'rgba(255,255,255,0.4)') : (sel ? '#3b82f6' : 'rgba(255,255,255,0.4)'),
                      paddingTop: 2
                    }}>
                      {rev && correct ? <Check style={{ width: isMobile ? 13 : 15, height: isMobile ? 13 : 15 }} /> : opt.id.toUpperCase()}
                    </div>

                    {/* Option Box */}
                    <button
                      onClick={() => {
                        if (solShown) return;
                        if (isMCQ) {
                          const newArr = sel ? chosenArr.filter(id => id !== opt.id) : [...chosenArr, opt.id];
                          setCardOpt(s => ({ ...s, [i]: newArr }));
                        } else {
                          // SCQ — reveal immediately, track locally
                          setCardOpt(s => ({ ...s, [i]: opt.id }));
                          setCardSol(s => ({ ...s, [i]: true }));
                          trackBrowseAttempt(qq, opt.is_correct, opt.id);
                        }
                      }}
                      style={{ 
                        position: 'relative', 
                        overflow: 'hidden', 
                        padding: isMobile ? (useGrid ? '8px 10px' : '10px 12px') : (useGrid ? '11px 12px' : '12px 14px'),
                        borderRadius: isMobile ? 8 : 10, 
                        border: `1.5px solid ${bc}`, 
                        background: bg, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 5, 
                        cursor: solShown ? 'default' : 'pointer', 
                        textAlign: 'left', 
                        color: '#fff', 
                        fontSize: 15, 
                        flex: 1,
                        minWidth: 0 
                      }}>

                      {/* Background Progress Fill (Poll Style) */}
                      {rev && (
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: correct ? '#34d399' : '#f87171', opacity: 0.15, transition: 'width 0.5s ease', zIndex: 0 }} />
                      )}

                      {/* Content - No internal label, just text */}
                      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                        <MathRenderer markdown={opt.text || ''} className="text-sm" fontSize={isMobile ? 15 : 16} imageScale={qq.svg_scales?.[`option_${opt.id}`] ?? 100} />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
        {isMCQ && !solShown && chosenArr.length > 0 && (
          <button
            onClick={() => {
              setCardSol(s => ({ ...s, [i]: true }));
              // MCQ — track locally, correct = all selected match all correct
              const allCorrectIds = (qq.options ?? []).filter(o => o.is_correct).map(o => o.id);
              const isFullyCorrect = allCorrectIds.length === chosenArr.length && chosenArr.every(id => allCorrectIds.includes(id));
              trackBrowseAttempt(qq, isFullyCorrect, chosenArr);
            }}
            style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            Check Answer ({chosenArr.length} selected)
          </button>
        )}
        <button
          onClick={() => {
            const next = !(cardSol[i] ?? false);
            setCardSol(s => ({ ...s, [i]: next }));
          }}
          style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.4)', background: (cardSol[i] ?? false) ? 'rgba(124,58,237,0.15)' : 'transparent', color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, touchAction: 'manipulation' }}>
          <ChevronRight style={{ width: 13, height: 13, transform: (cardSol[i] ?? false) ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          {(cardSol[i] ?? false) ? 'Hide Solution' : 'View Solution'}
        </button>
        {(cardSol[i] ?? false) && (
          <div id={solDivId} style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</div>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/the-crucible/q/${qq.id}`;
                  navigator.clipboard.writeText(url).then(() => {
                    setCopiedQuestionId(qq.id);
                    setTimeout(() => setCopiedQuestionId(null), 2000);
                  });
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 5, 
                  fontSize: 11, 
                  fontWeight: 700,
                  color: '#fff', 
                  background: copiedQuestionId === qq.id 
                    ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' 
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '7px 12px',
                  borderRadius: 8,
                  transition: 'all 0.2s',
                  boxShadow: copiedQuestionId === qq.id 
                    ? '0 4px 12px rgba(52,211,153,0.4)' 
                    : '0 4px 12px rgba(139,92,246,0.4)',
                  transform: copiedQuestionId === qq.id ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (copiedQuestionId !== qq.id) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(139,92,246,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (copiedQuestionId !== qq.id) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.4)';
                  }
                }}
              >
                {copiedQuestionId === qq.id ? (
                  <>
                    <Check style={{ width: 12, height: 12 }} />
                    Copied!
                  </>
                ) : (
                  <>
                    <ExternalLink style={{ width: 12, height: 12 }} />
                    Share
                  </>
                )}
              </button>
            </div>
            
            {/* Media Controls Row - Video & Audio buttons */}
            {(qq.solution?.video_url || (qq.solution?.asset_ids?.audio && qq.solution.asset_ids.audio.length > 0)) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {/* Watch Video Solution Button */}
                {qq.solution?.video_url && (
                  <button
                    onClick={() => setVideoExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      border: 'none',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <MonitorPlay style={{ width: 14, height: 14 }} />
                    <span>{videoExpanded[i] ? 'Hide' : 'Watch'} Video</span>
                    {videoExpanded[i] ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                  </button>
                )}
                
                {/* Audio Note Button */}
                {qq.solution?.asset_ids?.audio && qq.solution.asset_ids.audio.length > 0 && (
                  qq.solution.asset_ids.audio.map((url, idx) => (
                    url ? (
                      <button
                        key={idx}
                        onClick={() => setAudioExpanded(prev => ({ ...prev, [`${i}-${idx}`]: !prev[`${i}-${idx}`] }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 14px',
                          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                          border: 'none',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Volume2 style={{ width: 14, height: 14 }} />
                        <span>{audioExpanded[`${i}-${idx}`] ? 'Hide' : 'Play'} Audio{qq.solution.asset_ids!.audio!.length > 1 ? ` ${idx + 1}` : ''}</span>
                        {audioExpanded[`${i}-${idx}`] ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                      </button>
                    ) : null
                  ))
                )}
              </div>
            )}
            
            {/* Collapsible Video Player - Square Aspect Ratio */}
            {qq.solution?.video_url && videoExpanded[i] && (
              <div style={{ marginBottom: 14, transition: 'all 0.3s ease-in-out' }}>
                {qq.solution.video_url.includes('youtube.com') || qq.solution.video_url.includes('youtu.be') ? (
                  <div style={{ position: 'relative', paddingBottom: '125%', height: 0, overflow: 'hidden', borderRadius: 8, background: '#000', maxWidth: '100%' }}>
                    <iframe
                      src={qq.solution.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video 
                    controls 
                    style={{ width: '100%', maxHeight: isMobile ? '70vh' : '600px', borderRadius: 8, background: '#000', display: 'block' }}
                    onKeyDown={(e) => {
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
                    <source src={qq.solution.video_url} type="video/mp4" />
                  </video>
                )}
              </div>
            )}
            
            {/* Collapsible Audio Players */}
            {qq.solution?.asset_ids?.audio && qq.solution.asset_ids.audio.length > 0 && (
              <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {qq.solution.asset_ids.audio.map((url, idx) => (
                  url && audioExpanded[`${i}-${idx}`] ? (
                    <audio key={idx} controls style={{ width: '100%', height: 40, borderRadius: 8, transition: 'all 0.3s ease-in-out' }}>
                      <source src={url} type="audio/webm" />
                      <source src={url} type="audio/mpeg" />
                    </audio>
                  ) : null
                ))}
              </div>
            )}
            
            {qq.solution?.text_markdown ? (
              <MathRenderer markdown={qq.solution.text_markdown} className="text-sm leading-relaxed" fontSize={16} imageScale={qq.svg_scales?.solution ?? 100} />
            ) : (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Solution not available for this question.</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const paginationBar = totalPages > 1 && (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(8,10,15,0.97)' }}>
      <button onClick={() => changePage(page - 1)} disabled={page === 0}
        style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: page === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, cursor: page === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
        <ChevronLeft style={{ width: 14, height: 14 }} /> Prev
      </button>

      {/* Centre: page indicator + Go-to-Q# jump */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
          {page + 1} / {totalPages}
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>({filteredQuestions.length} Qs)</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number"
            min={1}
            max={filteredQuestions.length}
            value={jumpInput}
            onChange={e => setJumpInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const n = parseInt(jumpInput);
                if (n >= 1 && n <= filteredQuestions.length) {
                  changePage(Math.floor((n - 1) / PAGE_SIZE));
                  setJumpInput('');
                }
              }
            }}
            placeholder="Go to Q#"
            style={{
              width: 72, padding: '3px 8px', borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)', fontSize: 11, outline: 'none', textAlign: 'center',
            }}
          />
          <button
            onClick={() => {
              const n = parseInt(jumpInput);
              if (n >= 1 && n <= filteredQuestions.length) { changePage(Math.floor((n - 1) / PAGE_SIZE)); setJumpInput(''); }
            }}
            style={{ padding: '3px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: 11, cursor: 'pointer' }}
          >↵</button>
        </div>
      </div>

      <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}
        style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: page === totalPages - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(124,58,237,0.15)', color: page === totalPages - 1 ? 'rgba(255,255,255,0.2)' : '#a78bfa', fontSize: 13, fontWeight: 600, cursor: page === totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
        Next <ChevronRight style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );

  const header = (
    <header style={{ background: 'rgba(8,10,15,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={handleExit} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>
          <ChevronLeft style={{ width: 14, height: 14 }} /> Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fafafa' }}>Browse</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 6 }}>{filteredQuestions.length} of {questions.length} Qs</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 99, fontSize: 11, color: '#34d399', fontWeight: 700, flexShrink: 0 }}>
          {String.fromCodePoint(0x1F525)} 0
        </div>
      </div>
    </header>
  );

  // ── Exam filter bar ─────────────────────────────────────────────────────────
  // For NEET, show NEET PYQ instead of JEE Mains / JEE Advanced
  const EXAM_FILTERS: { id: typeof examFilter; label: string; shortLabel: string }[] = examBoard === 'NEET'
    ? [
        { id: 'all', label: 'All', shortLabel: 'All' },
        { id: 'mains', label: 'NEET PYQ', shortLabel: 'PYQ' },   // reuse 'mains' slot — filter logic matches PYQ
        { id: 'non-pyq', label: 'Non-PYQ', shortLabel: 'Non-PYQ' },
      ]
    : [
        { id: 'all', label: 'All', shortLabel: 'All' },
        { id: 'mains', label: 'JEE Mains', shortLabel: 'Mains' },
        { id: 'advanced', label: 'JEE Advanced', shortLabel: 'Adv' },
        { id: 'non-pyq', label: 'Non-PYQ', shortLabel: 'Non-PYQ' },
      ];

  const sourceAccent = examFilter === 'mains' ? '#38bdf8' : examFilter === 'advanced' ? '#a78bfa' : '#34d399';

  const filterBar = (
    <div style={{ background: 'rgba(8,10,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
      {/* Compact single-row filter bar */}
      <div style={{ padding: isMobile ? '5px 8px' : '6px 16px', display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 6, overflowX: 'auto', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
        {/* Source pills */}
        {EXAM_FILTERS.map(({ id, label, shortLabel }) => {
          const active = examFilter === id;
          const accentColor = id === 'mains' ? '#38bdf8' : id === 'advanced' ? '#a78bfa' : id === 'non-pyq' ? '#34d399' : 'rgba(255,255,255,0.6)';
          return (
            <button
              key={id}
              onClick={() => { setExamFilter(id); setYearFilter('all'); setPage(0); setCardExpanded({}); setCardSol({}); setCardOpt({}); }}
              style={{
                padding: isMobile ? '4px 9px' : '5px 12px', 
                borderRadius: 99, 
                border: `1px solid ${active ? accentColor + '66' : 'rgba(255,255,255,0.1)'}`,
                background: active ? accentColor + '1a' : 'transparent',
                color: active ? accentColor : 'rgba(255,255,255,0.4)', 
                fontSize: isMobile ? 10 : 11, 
                fontWeight: active ? 700 : 500,
                cursor: 'pointer', 
                whiteSpace: 'nowrap', 
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              {isMobile ? shortLabel : label}
            </button>
          );
        })}
        
        {/* Year dropdown (compact) - only when JEE Mains selected */}
        {examFilter === 'mains' && availableYears.length > 0 && (
          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); setPage(0); setCardExpanded({}); setCardSol({}); setCardOpt({}); }}
            style={{
              padding: isMobile ? '3px 6px' : '4px 8px',
              borderRadius: 6,
              border: `1px solid ${yearFilter !== 'all' ? sourceAccent + '66' : 'rgba(255,255,255,0.15)'}`,
              background: yearFilter !== 'all' ? sourceAccent + '1a' : 'rgba(255,255,255,0.05)',
              color: yearFilter !== 'all' ? sourceAccent : 'rgba(255,255,255,0.5)',
              fontSize: isMobile ? 10 : 11,
              fontWeight: yearFilter !== 'all' ? 700 : 500,
              cursor: 'pointer',
              outline: 'none',
              flexShrink: 0,
            }}
          >
            <option value="all" style={{ background: '#1a1a1a', color: '#fff' }}>All Years</option>
            {availableYears.map(y => (
              <option key={y} value={String(y)} style={{ background: '#1a1a1a', color: '#fff' }}>{y}</option>
            ))}
          </select>
        )}
        
        {/* Bookmarks toggle */}
        <button
          onClick={() => { setShowStarredOnly(v => !v); setPage(0); setCardExpanded({}); setCardSol({}); setCardOpt({}); }}
          title={showStarredOnly ? 'Show all questions' : 'Show bookmarked questions only'}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: isMobile ? '3px 8px' : '3px 10px', borderRadius: 99,
            border: `1px solid ${showStarredOnly ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`,
            background: showStarredOnly ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)',
            color: showStarredOnly ? '#fbbf24' : 'rgba(255,255,255,0.4)',
            fontSize: 10, fontWeight: showStarredOnly ? 700 : 500,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            transition: 'all 0.15s',
          }}
        >
          <Star style={{ width: 10, height: 10, fill: showStarredOnly ? '#fbbf24' : 'none', flexShrink: 0 }} />
          {showStarredOnly ? 'Bookmarked' : 'Bookmarks'}
          {showStarredOnly && starred.size > 0 && (
            <span style={{ marginLeft: 2, opacity: 0.7 }}>({starred.size})</span>
          )}
        </button>

        {!isMobile && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
            {filteredQuestions.length} questions
          </span>
        )}
      </div>
      
      {/* Topic pills — separate row only if chapter has concept tags */}
      {availableConceptTags.length > 0 && (
        <div style={{ padding: isMobile ? '4px 8px 5px' : '4px 16px 6px', display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 5, overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', marginRight: 2, flexShrink: 0 }}>Topic:</span>
          <button
            onClick={() => { setConceptTagFilter('all'); setPage(0); setCardExpanded({}); setCardSol({}); setCardOpt({}); }}
            style={{
              padding: isMobile ? '3px 8px' : '3px 10px', 
              borderRadius: 99,
              border: `1px solid ${conceptTagFilter === 'all' ? '#34d39966' : 'rgba(255,255,255,0.08)'}`,
              background: conceptTagFilter === 'all' ? '#34d3991a' : 'transparent',
              color: conceptTagFilter === 'all' ? '#34d399' : 'rgba(255,255,255,0.35)',
              fontSize: 10, 
              fontWeight: conceptTagFilter === 'all' ? 700 : 500, 
              cursor: 'pointer', 
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >All</button>
          {availableConceptTags.map((tag: { id: string; name: string }) => (
            <button
              key={tag.id}
              onClick={() => { setConceptTagFilter(tag.id); setPage(0); setCardExpanded({}); setCardSol({}); setCardOpt({}); }}
              style={{
                padding: isMobile ? '3px 8px' : '3px 10px', 
                borderRadius: 99,
                border: `1px solid ${conceptTagFilter === tag.id ? '#34d39966' : 'rgba(255,255,255,0.08)'}`,
                background: conceptTagFilter === tag.id ? '#34d3991a' : 'transparent',
                color: conceptTagFilter === tag.id ? '#34d399' : 'rgba(255,255,255,0.35)',
                fontSize: 10, 
                fontWeight: conceptTagFilter === tag.id ? 700 : 500, 
                cursor: 'pointer', 
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >{tag.name}</button>
          ))}
        </div>
      )}
    </div>
  );

  // ── Shared full question card ───────────────────────────────────────────────
  const renderCard = (qq: Question, localIdx: number) => {
    const globalIdx = page * PAGE_SIZE + localIdx;
    const isStarred = starred.has(qq.id);
    const expanded = cardExpanded[localIdx] ?? false;
    const diffColor = DIFF_COLOR(qq.metadata.difficultyLevel);
    const examSrc = qq.metadata.exam_source;
    const examDet = qq.metadata.examDetails;

    // Build the exam badge label — prefer new examDetails field, fall back to legacy exam_source
    let examLabel: string | null = null;
    let examLabelColor = '#60a5fa';     // blue for JEE
    let examLabelBg   = 'rgba(96,165,250,0.08)';
    let examLabelBorder = 'rgba(96,165,250,0.18)';

    if (examDet?.year) {
      // New-style NEET / JEE questions (examDetails populated)
      const isNEET = examDet.exam === 'NEET_UG' || examDet.exam === 'NEET_PG';
      const examName = isNEET ? 'NEET' : examDet.exam === 'JEE_Main' ? 'JEE Main' : examDet.exam === 'JEE_Advanced' ? 'JEE Advanced' : (examDet.exam ?? '');
      const suffix = examDet.phase
        ? ` · ${examDet.phase}`
        : examDet.shift ? ` (${examDet.shift.replace('Shift ', 'S').replace('Session ', 'S')})` : '';
      examLabel = `${examName} ${examDet.year}${suffix}`;
      if (isNEET) {
        examLabelColor  = '#34d399';
        examLabelBg     = 'rgba(52,211,153,0.08)';
        examLabelBorder = 'rgba(52,211,153,0.2)';
      }
    } else if (examSrc?.year) {
      // Legacy exam_source field (older JEE questions)
      examLabel = `${examSrc.exam ?? 'JEE Main'} ${examSrc.year}${examSrc.month ? ` · ${examSrc.month}` : ''}${examSrc.shift ? ` (${examSrc.shift.replace('Shift ', 'S').replace('Session ', 'S')})` : ''}`;
    }

    return (
      <div
        key={qq.id}
        ref={el => { cardRefs.current[localIdx] = el; }}
        id={`card-${page}-${localIdx}`}
        data-index={localIdx}
        style={isMobile ? {
          background: 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          borderLeft: `2px solid ${diffColor}`,
          paddingLeft: 8,
          paddingBottom: 20,
          marginBottom: 20,
          marginLeft: 3,
    
        } : {
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: `3px solid ${diffColor}88`,
          borderRadius: 14,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {/* Header row: badges + star */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: isMobile ? '10px 8px 8px 0' : '12px 18px 10px', borderBottom: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
          <span style={{ minWidth: 30, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, padding: '0 6px', color: 'rgba(255,255,255,0.5)' }}>
            Q{globalIdx + 1}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: diffColor, background: diffColor + '18', padding: '2px 8px', borderRadius: 99 }}>L{qq.metadata.difficultyLevel}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 99 }}>{qq.type}</span>
          {examLabel && (
            <span style={{ fontSize: 10, color: examLabelColor, background: examLabelBg, border: `1px solid ${examLabelBorder}`, padding: '2px 8px', borderRadius: 99 }}>{examLabel}</span>
          )}
          {/* Star / bookmark */}
          <button onClick={() => toggleStar(qq.id, qq)} style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: 7, background: isStarred ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isStarred ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`, color: isStarred ? '#fbbf24' : 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title="Bookmark this question">
            <Star style={{ width: 13, height: 13, fill: isStarred ? '#fbbf24' : 'none' }} />
          </button>
          {/* Flag / report inaccuracy */}
          <button
            onClick={() => openFlagModal(qq.id, qq.display_id)}
            title="Report an issue with this question"
            style={{
              width: 28, height: 28, borderRadius: 7,
              background: flaggedIds.has(qq.id) ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${flaggedIds.has(qq.id) ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: flaggedIds.has(qq.id) ? '#f87171' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Flag style={{ width: 12, height: 12, fill: flaggedIds.has(qq.id) ? '#f87171' : 'none' }} />
          </button>
        </div>

        {/* Full question text (always visible) */}
        <div style={{ padding: isMobile ? '12px 8px' : '16px 20px' }}>
          <MathRenderer
            markdown={qq.question_text.markdown}
            className="text-sm leading-relaxed"
            fontSize={isMobile ? 15 : 17}
            imageScale={qq.svg_scales?.question ?? 90}
          />
        </div>

        {/* CTA footer */}
        {!expanded ? (
          <div style={{ padding: isMobile ? '10px 8px 0' : '10px 20px 14px', borderTop: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => expandCard(localIdx, qq)}
              style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              Solve it <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
            <button
              onClick={() => {
                expandCard(localIdx, qq);
                setTimeout(() => {
                  setCardSol(s => ({ ...s, [localIdx]: true }));
                }, 60);
              }}
              style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.35)', background: 'transparent', color: '#a78bfa', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              View Solution
            </button>
            {qq.options && qq.options.length > 0 && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>
                {qq.options.length} options
              </span>
            )}
          </div>
        ) : (
          <div style={{ padding: isMobile ? '4px 8px 0' : '4px 20px 16px', borderTop: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ paddingTop: 14 }}>
              {renderOptions(qq, localIdx)}
            </div>
            <button
              onClick={() => setCardExpanded(s => ({ ...s, [localIdx]: false }))}
              style={{ marginTop: 14, padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <ChevronDown style={{ width: 13, height: 13, transform: 'rotate(180deg)' }} /> Collapse
            </button>
          </div>
        )}
      </div>
    );
  };

  const saveModalElement = showSaveModal && (() => {
    const correctCount = browseAttempts.filter(a => a.is_correct).length;
    const total = browseAttempts.length;
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{
          background: '#13151f',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          padding: '28px 28px 24px',
          maxWidth: 380, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        }}>
          <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 18, fontWeight: 800, textAlign: 'center', marginBottom: 6, color: '#fff' }}>
            Save browse session progress?
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
            You attempted <strong style={{ color: '#fff' }}>{total} question{total !== 1 ? 's' : ''}</strong> in this session
            {total > 0 && (
              <> — <span style={{ color: '#34d399', fontWeight: 700 }}>{correctCount} correct</span>
                {correctCount < total && <>, <span style={{ color: '#f87171', fontWeight: 700 }}>{total - correctCount} wrong</span></>}
              </>
            )}.<br />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              Saved browse progress counts toward your streak but won&apos;t affect test question selection.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setShowSaveModal(false); onBack(); }}
              disabled={isSaving}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Discard &amp; Exit
            </button>
            <button
              onClick={async () => { await saveBrowseProgress(); setShowSaveModal(false); onBack(); }}
              disabled={isSaving}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: isSaving ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: isSaving ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {isSaving ? '⏳ Saving…' : '💾 Save & Exit'}
            </button>
          </div>
        </div>
      </div>
    );
  })();

  // ── Mobile: single scroll column ───────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
          <WatermarkOverlay />
          {header}
          {filterBar}
          <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 14px' } as React.CSSProperties}>
            {showStarredOnly && filteredQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: 'rgba(255,255,255,0.3)' }}>
                <Star style={{ width: 32, height: 32, margin: '0 auto 12px', opacity: 0.3 }} />
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No bookmarks yet</div>
                <div style={{ fontSize: 13 }}>Tap the ★ on any question to save it here.</div>
              </div>
            ) : (
              pageQuestions.map((qq, i) => renderCard(qq, i))
            )}
            <div style={{ height: 8 }} />
          </div>
          {paginationBar}
        </div>
        {saveModalElement}
      </>
    );
  }

  // ── Desktop: narrow nav rail + scrollable feed ─────────────────────────────
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080a0f', color: '#fff', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
        <WatermarkOverlay />
        {header}
        {filterBar}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Narrow nav rail */}
          <div style={{ width: 130, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pageQuestions.map((qq, i) => {
              const globalIdx = page * PAGE_SIZE + i;
              const isActive = activeNavIdx === i;
              const diffColor = DIFF_COLOR(qq.metadata.difficultyLevel);
              return (
                <button
                  key={qq.id}
                  onClick={() => {
                    const el = cardRefs.current[i];
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none',
                    background: isActive ? 'rgba(124,58,237,0.18)' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: diffColor, flexShrink: 0, opacity: isActive ? 1 : 0.5 }} />
                  <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                    Q{globalIdx + 1}
                  </span>
                  {(cardExpanded[i] ?? false) && (
                    <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
            {/* Page nav in rail */}
            {totalPages > 1 && (
              <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {page > 0 && (
                  <button onClick={() => changePage(page - 1)} style={{ padding: '6px 8px', borderRadius: 7, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ChevronLeft style={{ width: 12, height: 12 }} /> Prev
                  </button>
                )}
                {page < totalPages - 1 && (
                  <button onClick={() => changePage(page + 1)} style={{ padding: '6px 8px', borderRadius: 7, border: 'none', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Next <ChevronRight style={{ width: 12, height: 12 }} />
                  </button>
                )}
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', paddingTop: 2 }}>{page + 1}/{totalPages}</div>
              </div>
            )}
          </div>

          {/* Main feed area */}
          <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 40px 60px' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              {showStarredOnly && filteredQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 16px', color: 'rgba(255,255,255,0.3)' }}>
                  <Star style={{ width: 36, height: 36, margin: '0 auto 14px', opacity: 0.25 }} />
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No bookmarks in this chapter</div>
                  <div style={{ fontSize: 13 }}>Click ★ on any question to bookmark it for later review.</div>
                </div>
              ) : (
                pageQuestions.map((qq, i) => renderCard(qq, i))
              )}
            </div>
          </div>
        </div>
      </div>

      {saveModalElement}

      {/* ── Flag / Report Modal ──────────────────────────────────────────── */}
      {flagModalQuestion && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setFlagModalQuestion(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          />
          {/* Modal */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 301, width: '90%', maxWidth: 440,
            background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 24, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Flag style={{ width: 16, height: 16, color: '#f87171' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>Report an Issue</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
                  {flagModalQuestion.displayId}
                </div>
              </div>
              <button
                onClick={() => setFlagModalQuestion(null)}
                style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Flag type list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {FLAG_TYPES.map(ft => (
                <button
                  key={ft.id}
                  onClick={() => setFlagType(ft.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 9,
                    border: `1px solid ${flagType === ft.id ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    background: flagType === ft.id ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
                  }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${flagType === ft.id ? '#f87171' : 'rgba(255,255,255,0.25)'}`,
                    background: flagType === ft.id ? '#f87171' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {flagType === ft.id && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: 13, color: flagType === ft.id ? '#fca5a5' : 'rgba(255,255,255,0.65)' }}>
                    {ft.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Optional note */}
            <textarea
              value={flagNote}
              onChange={e => setFlagNote(e.target.value.slice(0, 500))}
              placeholder="Any additional detail? (optional)"
              rows={2}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9, padding: '9px 12px', fontSize: 13, color: '#e2e8f0',
                resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                marginBottom: 14,
              }}
            />

            {/* Result message */}
            {flagResult && (
              <div style={{
                padding: '9px 12px', borderRadius: 9, marginBottom: 12,
                background: flagResult.ok ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${flagResult.ok ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                fontSize: 13, color: flagResult.ok ? '#6ee7b7' : '#fca5a5',
              }}>
                {flagResult.msg}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setFlagModalQuestion(null)}
                style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={submitFlag}
                disabled={flagSubmitting}
                style={{
                  padding: '8px 18px', borderRadius: 9, border: 'none',
                  background: flagSubmitting ? 'rgba(239,68,68,0.4)' : '#dc2626',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: flagSubmitting ? 'not-allowed' : 'pointer', opacity: flagSubmitting ? 0.7 : 1,
                }}
              >
                {flagSubmitting ? 'Sending…' : 'Submit Report'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

