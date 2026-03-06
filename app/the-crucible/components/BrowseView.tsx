"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Check, ChevronDown } from 'lucide-react';
import { Chapter, Question } from './types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import WatermarkOverlay from '@/components/WatermarkOverlay';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';

async function fetchOptionStats(questionId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/v2/questions/${questionId}/stats`);
    if (!res.ok) return {};
    const data = await res.json();
    return data.optionStats || {};
  } catch { return {}; }
}

const DIFF_COLOR = (d: string) => d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#f87171';
const PAGE_SIZE = 15;

const isShortOptions = (opts: { id: string; text: string; is_correct: boolean }[]): boolean => {
  if (!opts || opts.length !== 4) return false;
  return opts.every(o => {
    const t = (o.text || '');
    if (t.includes('$') || t.includes('![')) return false;
    const plain = t.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    return plain.length <= 28;
  });
};

const hasImageMarkdown = (markdown: string): boolean => /!\[[^\]]*\]\([^)]+\)/.test(markdown);

export default function BrowseView({ questions, chapters, onBack, chapterId }: {
  questions: Question[];
  chapters: Chapter[];
  onBack: () => void;
  chapterId?: string;
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

  // Filter questions client-side based on exam filter
  const filteredQuestions = questions.filter(q => {
    if (examFilter === 'all') return true;
    if (examFilter === 'non-pyq') return !q.metadata.is_pyq;
    const exam = (q.metadata.exam_source?.exam ?? '').toLowerCase();
    if (examFilter === 'mains') return q.metadata.is_pyq && /main/i.test(exam);
    if (examFilter === 'advanced') return q.metadata.is_pyq && /adv/i.test(exam);
    return true;
  });

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
          difficulty: qq.metadata.difficulty,
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
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveNavIdx(i); },
        { root: scrollAreaRef.current, threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
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
              difficulty: qq.metadata.difficulty,
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
    const useGrid = qq.options ? isShortOptions(qq.options) : false;

    return (
      <div>
        {isMCQ && !solShown && (
          <div style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', padding: '5px 12px', borderRadius: 8, marginBottom: 10, fontWeight: 600 }}>
            MCQ — Select one or more correct options
          </div>
        )}
        {qq.type === 'NVT' ? (
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
                  <button key={opt.id}
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
                    style={{ position: 'relative', overflow: 'hidden', padding: useGrid ? '11px 12px' : '12px 16px', borderRadius: 10, border: `1.5px solid ${bc}`, background: bg, display: 'flex', flexDirection: 'column', gap: 5, cursor: solShown ? 'default' : 'pointer', textAlign: 'left', color: '#fff', fontSize: 15, width: '100%', minWidth: 0 }}>

                    {/* Background Progress Fill (Poll Style) */}
                    {rev && (
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: correct ? '#34d399' : '#f87171', opacity: 0.15, transition: 'width 0.5s ease', zIndex: 0 }} />
                    )}

                    {/* Content Wrapper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', position: 'relative', zIndex: 10 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${bc}`, background: sel ? (rev ? (correct ? '#34d399' : '#f87171') : '#3b82f6') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                        {rev && correct ? <Check style={{ width: 11, height: 11 }} /> : opt.id.toUpperCase()}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as any}>
                        <MathRenderer markdown={opt.text || ''} className="text-sm" fontSize={16} imageScale={qq.svg_scales?.[`option_${opt.id}`] ?? 100} />
                      </span>
                    </div>
                  </button>
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
          <div id={solDivId} style={{ marginTop: 10, padding: '14px 18px', borderRadius: 12, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</div>
            {qq.solution?.video_url && (
              <div style={{ marginBottom: 14 }}>
                {qq.solution.video_url.includes('youtube.com') || qq.solution.video_url.includes('youtu.be') ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
                    <iframe
                      src={qq.solution.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video controls style={{ width: '100%', borderRadius: 8, background: '#000' }}>
                    <source src={qq.solution.video_url} type="video/mp4" />
                  </video>
                )}
              </div>
            )}
            {qq.solution?.asset_ids?.audio && qq.solution.asset_ids.audio.length > 0 && (
              <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {qq.solution.asset_ids.audio.map((url, idx) => (
                  <audio key={idx} controls style={{ width: '100%', height: 40, borderRadius: 8 }}>
                    <source src={url} type="audio/mpeg" />
                  </audio>
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
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
        {page + 1} / {totalPages}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>({filteredQuestions.length} Qs)</span>
      </span>
      <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}
        style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: page === totalPages - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(124,58,237,0.15)', color: page === totalPages - 1 ? 'rgba(255,255,255,0.2)' : '#a78bfa', fontSize: 13, fontWeight: 600, cursor: page === totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
        Next <ChevronRight style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );

  const header = (
    <header style={{ background: 'rgba(8,10,15,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={handleExit} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>
          <ChevronLeft style={{ width: 14, height: 14 }} /> EXIT
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Browse Questions</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{questions.length} Questions · Scroll to explore</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 99, fontSize: 12, color: '#34d399', fontWeight: 700, flexShrink: 0 }}>
          {String.fromCodePoint(0x1F525)} 0 STREAK
        </div>
      </div>
    </header>
  );

  // ── Exam filter bar ─────────────────────────────────────────────────────────
  const EXAM_FILTERS: { id: typeof examFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'mains', label: 'JEE Mains' },
    { id: 'advanced', label: 'JEE Advanced' },
    { id: 'non-pyq', label: 'Non-PYQ' },
  ];

  const filterBar = (
    <div style={{ background: 'rgba(8,10,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
      {EXAM_FILTERS.map(({ id, label }) => {
        const active = examFilter === id;
        const accentColor = id === 'mains' ? '#38bdf8' : id === 'advanced' ? '#a78bfa' : id === 'non-pyq' ? '#34d399' : 'rgba(255,255,255,0.6)';
        return (
          <button
            key={id}
            onClick={() => { setExamFilter(id); setPage(0); setCardExpanded({}); setCardSol({}); setCardOpt({}); }}
            style={{
              padding: '5px 12px', borderRadius: 99, border: `1px solid ${active ? accentColor + '66' : 'rgba(255,255,255,0.1)'}`,
              background: active ? accentColor + '1a' : 'transparent',
              color: active ? accentColor : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: active ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        );
      })}
      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
        {filteredQuestions.length} questions
      </span>
    </div>
  );

  // ── Shared full question card ───────────────────────────────────────────────
  const renderCard = (qq: Question, localIdx: number) => {
    const globalIdx = page * PAGE_SIZE + localIdx;
    const isStarred = starred.has(qq.id);
    const expanded = cardExpanded[localIdx] ?? false;
    const diffColor = DIFF_COLOR(qq.metadata.difficulty);
    const examSrc = qq.metadata.exam_source;
    const examLabel = examSrc?.year
      ? `${examSrc.exam ?? 'JEE Main'} ${examSrc.year}${examSrc.month ? ` · ${examSrc.month}` : ''}${examSrc.shift ? ` (${examSrc.shift[0]})` : ''}`
      : null;

    return (
      <div
        key={qq.id}
        ref={el => { cardRefs.current[localIdx] = el; }}
        id={`card-${page}-${localIdx}`}
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: `3px solid ${diffColor}88`,
          borderRadius: 14,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {/* Header row: badges + star */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
          <span style={{ minWidth: 30, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, padding: '0 6px', color: 'rgba(255,255,255,0.5)' }}>
            Q{globalIdx + 1}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: diffColor, background: diffColor + '18', padding: '2px 8px', borderRadius: 99 }}>{qq.metadata.difficulty}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 99 }}>{qq.type}</span>
          {hasImageMarkdown(qq.question_text.markdown) && (
            <span style={{ fontSize: 10, color: '#fb923c', background: 'rgba(251,146,60,0.1)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(251,146,60,0.2)' }}>🖼 Diagram</span>
          )}
          {examLabel && (
            <span style={{ fontSize: 10, color: '#60a5fa', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)', padding: '2px 8px', borderRadius: 99 }}>{examLabel}</span>
          )}
          <button onClick={() => toggleStar(qq.id, qq)} style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: 7, background: isStarred ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isStarred ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`, color: isStarred ? '#fbbf24' : 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Star style={{ width: 13, height: 13, fill: isStarred ? '#fbbf24' : 'none' }} />
          </button>
        </div>

        {/* Full question text (always visible) */}
        <div style={{ padding: '16px 20px' }}>
          <MathRenderer
            markdown={qq.question_text.markdown}
            className="text-sm leading-relaxed"
            fontSize={isMobile ? 15 : 17}
            imageScale={qq.svg_scales?.question ?? 90}
          />
        </div>

        {/* CTA footer */}
        {!expanded ? (
          <div style={{ padding: '10px 20px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
          <div style={{ padding: '4px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
          <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 14px' } as any}>
            {pageQuestions.map((qq, i) => renderCard(qq, i))}
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
              const diffColor = DIFF_COLOR(qq.metadata.difficulty);
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
              {pageQuestions.map((qq, i) => renderCard(qq, i))}
            </div>
          </div>
        </div>
      </div>

      {saveModalElement}
    </>
  );
}

