"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown, ChevronRight, Check, BarChart2, UserCircle, BookOpen, LayoutGrid, Clock, Lock, Sparkles, Star } from 'lucide-react';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import { Chapter, Question } from './types';
import ProgressPanel from './ProgressPanel';
import BrowseView from './BrowseView';
import TestView from './TestView';
import AuthRequiredDialog from './AuthRequiredDialog';
import GuidedPracticeWizard from './GuidedPracticeWizard';
import TestConfigModal, { DifficultyMix, QuestionSort } from './TestConfigModal';
import { buildSmartTest, AttemptedEntry } from './testGenerator';

type ActiveView = 'wizard' | 'shloka' | 'browse' | 'guided' | 'test';
type GuidedDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';

const CAT_COLOR: Record<string, string> = { Physical: '#3b82f6', Organic: '#8b5cf6', Inorganic: '#10b981', Practical: '#f59e0b' };
const CAT_ORDER = ['Physical', 'Inorganic', 'Organic', 'Practical'];

const COLLAPSE_TRANSITION = '0.38s cubic-bezier(0.16, 1, 0.3, 1)';

// ── Shloka loading screen ────────────────────────────────────────────────────
function ShlokaScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1600); return () => clearTimeout(t); }, [onDone]);

  const SHLOKAS = [
    { sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥', message: 'You have the right to perform your duty, but not to the fruits of your actions. Focus on the effort — results will follow.' },
    { sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥', message: 'Perform your duties with equanimity. Whether you succeed or fail, maintain your balance — that steadiness is true yoga.' },
    { sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥', message: 'Elevate yourself through your own effort. You are your own best friend — and your own worst enemy.' },
    { sanskrit: 'अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते।', message: 'The restless mind is controlled by practice and detachment. Regular study and freedom from distraction — that is the formula.' },
    { sanskrit: 'योगः कर्मसु कौशलम्।', message: 'Yoga is excellence in action. Whatever you do — practice, revision, tests — do it with full skill and attention.' },
    { sanskrit: 'तस्माद्युध्यस्व भारत।', message: 'Therefore, fight. Face your syllabus, your doubts, your fears — and fight through them.' },
    { sanskrit: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।', message: 'Arise, awake, and stop not till the goal is reached.' },
  ];

  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const shloka = SHLOKAS[dayOfYear % SHLOKAS.length];
  const lines = shloka.sanskrit.split('\n');

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,#1a0e00_0%,#0a0700_45%,#050507_100%)] flex items-center justify-center flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(180,100,0,0.18)_0%,transparent_65%)] pointer-events-none" />
      <div className="text-[52px] text-[rgba(160,100,20,0.55)] mb-6 font-serif leading-none">{String.fromCodePoint(0x0950)}</div>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-[60px] h-px bg-gradient-to-r from-transparent to-[rgba(180,130,40,0.4)]" />
        <div className="w-[5px] h-[5px] rounded-full bg-[rgba(180,130,40,0.5)]" />
        <div className="w-[60px] h-px bg-gradient-to-l from-transparent to-[rgba(180,130,40,0.4)]" />
      </div>
      <div className="text-center mb-7">
        {lines.map((line, i) => (
          <p key={i} className="text-[clamp(22px,5vw,40px)] font-black font-serif leading-snug m-0 mb-0.5 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 bg-clip-text text-transparent">
            {line}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2.5 mb-[22px]">
        <div className="w-[60px] h-px bg-gradient-to-r from-transparent to-[rgba(180,130,40,0.4)]" />
        <div className="w-[5px] h-[5px] rounded-full bg-[rgba(180,130,40,0.5)]" />
        <div className="w-[60px] h-px bg-gradient-to-l from-transparent to-[rgba(180,130,40,0.4)]" />
      </div>
      <p className="text-[13px] text-white/35 tracking-widest text-center max-w-[360px] leading-relaxed px-5">
        {shloka.message}
      </p>
      <div className="flex gap-2 mt-9">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-amber-600 animate-[shloka-dot_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <style>{`@keyframes shloka-dot { 0%,80%,100% { opacity:0.25; transform:scale(0.75); } 40% { opacity:1; transform:scale(1.1); } }`}</style>
    </div>
  );
}

// ── Question fetchers (reused from original) ─────────────────────────────────
async function fetchTopPYQs(): Promise<Question[]> {
  const params = new URLSearchParams();
  params.set('is_top_pyq', 'true');
  params.set('limit', '500');
  const res = await fetch(`/api/v2/questions?${params.toString()}`);
  const json = await res.json();
  return (json.data || []).map((q: any) => ({
    id: q._id,
    display_id: q.display_id || q._id?.slice(0, 8)?.toUpperCase() || 'Q',
    question_text: { markdown: q.question_text?.markdown || '' },
    type: q.type,
    options: q.options,
    answer: q.answer,
    solution: { text_markdown: q.solution?.text_markdown || '' },
    metadata: {
      difficulty: q.metadata?.difficulty || 'Medium',
      chapter_id: q.metadata?.chapter_id || '',
      tags: q.metadata?.tags || [],
      is_pyq: q.metadata?.is_pyq || false,
      is_top_pyq: q.metadata?.is_top_pyq || false,
      exam_source: q.metadata?.exam_source,
    },
    svg_scales: q.svg_scales || {},
  }));
}

async function fetchQuestions(chapterIds: string[], limit?: number, topPYQOnly?: boolean): Promise<Question[]> {
  const params = new URLSearchParams();
  chapterIds.forEach(id => params.append('chapter_id', id));
  params.set('limit', String(limit || 500));
  if (topPYQOnly) params.set('is_top_pyq', 'true');
  const res = await fetch(`/api/v2/questions?${params.toString()}`);
  const json = await res.json();
  return (json.data || []).map((q: any) => ({
    id: q._id,
    display_id: q.display_id || q._id?.slice(0, 8)?.toUpperCase() || 'Q',
    question_text: { markdown: q.question_text?.markdown || '' },
    type: q.type,
    options: q.options,
    answer: q.answer,
    solution: {
      text_markdown: q.solution?.text_markdown || '',
      video_url: q.solution?.video_url || undefined,
      asset_ids: q.solution?.asset_ids || undefined,
      latex_validated: q.solution?.latex_validated || false,
    },
    metadata: {
      difficulty: q.metadata?.difficulty || 'Medium',
      chapter_id: q.metadata?.chapter_id || '',
      tags: q.metadata?.tags || [],
      is_pyq: q.metadata?.is_pyq || false,
      is_top_pyq: q.metadata?.is_top_pyq || false,
      exam_source: q.metadata?.exam_source,
    },
    svg_scales: q.svg_scales || {},
  }));
}

function selectTestQuestions(all: Question[], count: number, mix: DifficultyMix): Question[] {
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  let pool: Question[];
  if (mix === 'pyq') {
    pool = all.filter(q => q.metadata.is_pyq);
    if (pool.length === 0) pool = all;
  } else if (mix === 'easy') {
    pool = [...shuffle(all.filter(q => q.metadata.difficulty === 'Easy')), ...shuffle(all.filter(q => q.metadata.difficulty === 'Medium'))];
  } else if (mix === 'hard') {
    pool = [...shuffle(all.filter(q => q.metadata.difficulty === 'Medium')), ...shuffle(all.filter(q => q.metadata.difficulty === 'Hard'))];
  } else {
    const easy = shuffle(all.filter(q => q.metadata.difficulty === 'Easy'));
    const medium = shuffle(all.filter(q => q.metadata.difficulty === 'Medium'));
    const hard = shuffle(all.filter(q => q.metadata.difficulty === 'Hard'));
    const eN = Math.round(count * 0.3), hN = Math.round(count * 0.3), mN = count - eN - hN;
    pool = [...easy.slice(0, eN), ...medium.slice(0, mN), ...hard.slice(0, hN)];
    if (pool.length < count) {
      const used = new Set(pool.map(q => q.id));
      pool = [...pool, ...shuffle(all.filter(q => !used.has(q.id)))];
    }
    pool = shuffle(pool);
  }

  let selected = pool.slice(0, count);

  // ── NVT cap: at most 25% of the test should be Numerical Value type ──────────
  // Rationale: NVT questions are cognitively very different from MCQ/SCQ and
  // flooding a test with them (common in certain chapters like Solutions) makes
  // the experience feel unbalanced. JEE Main itself caps NVT at 5 out of 20.
  const maxNVT = Math.max(1, Math.floor(count * 0.25));
  const nvtSelected = selected.filter(q => q.type === 'NVT');
  if (nvtSelected.length > maxNVT) {
    const excessNVT = nvtSelected.length - maxNVT;
    const selectedIds = new Set(selected.map(q => q.id));
    // Candidates to replace excess NVT: non-NVT questions not already selected
    const nonNVTReplacements = shuffle(all.filter(q => q.type !== 'NVT' && !selectedIds.has(q.id)));
    // Remove excess NVTs from selected (keep the first maxNVT ones)
    let nvtKept = 0;
    selected = selected.filter(q => {
      if (q.type !== 'NVT') return true;
      if (nvtKept < maxNVT) { nvtKept++; return true; }
      return false; // drop excess NVT
    });
    // Fill back up with non-NVT replacements
    const actuallyRemoved = excessNVT;
    selected = [...selected, ...nonNVTReplacements.slice(0, actuallyRemoved)];
    selected = shuffle(selected); // re-shuffle so NVTs don't cluster at end
  }

  return selected;
}

// ── Collapsible Step Card ─────────────────────────────────────────────────────
function StepCard({
  stepNum, label, value, isOpen, isConfirmed, onToggle, locked, children,
}: {
  stepNum: number; label: string; value: string; isOpen: boolean;
  isConfirmed: boolean; onToggle: () => void; locked?: boolean;
  children: React.ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setBodyHeight(bodyRef.current.scrollHeight);
  });

  const accent = '#818cf8';

  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${isConfirmed ? 'rgba(129,140,248,0.3)' : isOpen ? 'rgba(129,140,248,0.15)' : '#222525'}`,
      boxShadow: isConfirmed ? '0 0 0 1px rgba(129,140,248,0.1)' : isOpen ? '0 0 0 1px rgba(129,140,248,0.08)' : 'none',
      background: '#0f1010',
      overflow: 'hidden',
      transition: `border-color ${COLLAPSE_TRANSITION}`,
    }}>
      {/* Header — always visible */}
      <button
        onClick={locked ? undefined : onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: locked ? 'default' : 'pointer',
          WebkitTapHighlightColor: 'transparent',
          opacity: locked ? 0.45 : 1,
          transition: `opacity ${COLLAPSE_TRANSITION}`,
        }}
      >
        {/* Step badge */}
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
          background: (isOpen || isConfirmed) ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.05)',
          color: (isOpen || isConfirmed) ? accent : 'rgba(255,255,255,0.4)',
          border: `1px solid ${(isOpen || isConfirmed) ? 'rgba(129,140,248,0.25)' : 'rgba(255,255,255,0.08)'}`,
          transition: `all ${COLLAPSE_TRANSITION}`,
        }}>
          {stepNum}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>
            STEP {stepNum}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: isConfirmed ? '#fafafa' : 'rgba(255,255,255,0.7)' }}>
            {value}
          </div>
        </div>
        {/* Right icon: checkmark or chevron */}
        {isConfirmed ? (
          <div style={{ width: 24, height: 24, borderRadius: 99, background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check style={{ width: 14, height: 14, color: accent }} />
          </div>
        ) : (
          <ChevronDown style={{
            width: 18, height: 18, color: 'rgba(255,255,255,0.3)', flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${COLLAPSE_TRANSITION}`,
          }} />
        )}
      </button>

      {/* Collapsible body */}
      <div style={{
        maxHeight: isOpen ? bodyHeight + 40 : 0,
        overflow: 'hidden',
        transition: `max-height ${COLLAPSE_TRANSITION}`,
      }}>
        <div ref={bodyRef} style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Chapter list bar ─────────────────────────────────────────────────────────
function ChapterBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', borderRadius: 99, background: color, width: `${Math.max(value > 0 ? 2 : 0, value)}%`, transition: 'width 0.4s ease' }} />
    </div>
  );
}

// ── Main Wizard Component ────────────────────────────────────────────────────
interface CrucibleWizardProps {
  chapters: Chapter[];
  isLoggedIn: boolean;
}

export default function CrucibleWizard({ chapters, isLoggedIn }: CrucibleWizardProps) {
  const router = useRouter();
  const step2Ref = useRef<HTMLDivElement>(null);

  // Accordion state
  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [classTab, setClassTab] = useState<11 | 12>(12);

  // Guided practice config
  const [guidedDifficulty, setGuidedDifficulty] = useState<GuidedDifficulty>('Mixed');
  const [sessionLength, setSessionLength] = useState(20);
  const [guidedExpanded, setGuidedExpanded] = useState(false); // Collapsed by default (BETA)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Live chapter stats for Free Browse card
  const [chapterStats, setChapterStats] = useState<{ total: number; jeeMain: number; jeeAdv: number; nonPyq: number } | null>(null);

  // View state
  const [activeView, setActiveView] = useState<ActiveView>('wizard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showTestConfig, setShowTestConfig] = useState(false);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [pendingView, setPendingView] = useState<'browse' | 'test' | null>(null);
  const [shlokaExited, setShlokaExited] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<Question[] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const supabase = createSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (shlokaExited && pendingQuestions !== null && pendingView) {
      setQuestions(pendingQuestions);
      setActiveView(pendingView);
      setPendingView(null);
      setPendingQuestions(null);
      setShlokaExited(false);
    }
  }, [shlokaExited, pendingQuestions, pendingView]);

  const onShlokaDone = useCallback(() => { setShlokaExited(true); }, []);

  // Derived values
  const selectedChapter = selectedChapterId ? chapters.find(c => c.id === selectedChapterId) : null;
  const chapterConfirmed = !!selectedChapterId;
  const chapterQCount = selectedChapter?.question_count ?? 0;

  // Fetch live chapter stats for the Free Browse card with 24-hour caching
  const fetchChapterStats = useCallback(async (chapterId: string) => {
    setChapterStats(null);
    
    // Check cache first
    try {
      const cacheKey = `chapter_stats_${chapterId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
        
        if (age < CACHE_DURATION) {
          setChapterStats(data);
          return;
        }
      }
    } catch (error) {
      // Cache read failed, continue to fetch
    }
    
    // Fetch fresh data
    try {
      const [totalRes, mainRes, advRes, nonPyqRes] = await Promise.all([
        fetch(`/api/v2/questions?chapter_id=${chapterId}&countOnly=true`),
        fetch(`/api/v2/questions?chapter_id=${chapterId}&countOnly=true&is_pyq=true&exam_level=mains`),
        fetch(`/api/v2/questions?chapter_id=${chapterId}&countOnly=true&is_pyq=true&exam_level=adv`),
        fetch(`/api/v2/questions?chapter_id=${chapterId}&countOnly=true&is_pyq=false`),
      ]);
      const [t, m, a, n] = await Promise.all([totalRes.json(), mainRes.json(), advRes.json(), nonPyqRes.json()]);
      const stats = {
        total: t.pagination?.total ?? 0,
        jeeMain: m.pagination?.total ?? 0,
        jeeAdv: a.pagination?.total ?? 0,
        nonPyq: n.pagination?.total ?? 0,
      };
      setChapterStats(stats);
      
      // Cache the result
      try {
        const cacheKey = `chapter_stats_${chapterId}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data: stats,
          timestamp: Date.now(),
        }));
      } catch (error) {
        // Cache write failed, not critical
      }
    } catch {
      setChapterStats(null);
    }
  }, []);

  // Chapter selection handler
  const handleChapterTap = (id: string) => {
    setSelectedChapterId(id);
    setChapterStats(null);
    fetchChapterStats(id);
    setStep1Open(false);
    // Open step 2 after 280ms (no forced scroll - let it expand naturally)
    setTimeout(() => {
      setStep2Open(true);
    }, 280);
  };

  // Re-open step 1
  const handleStep1Toggle = () => {
    if (step1Open) {
      setStep1Open(false);
    } else {
      setStep1Open(true);
      setStep2Open(false);
    }
  };

  const handleStep2Toggle = () => {
    if (!chapterConfirmed) return;
    setStep2Open(!step2Open);
  };

  // Launch Guided Practice
  const handleGuidedLaunch = () => {
    if (!selectedChapterId) return;
    setActiveView('guided');
  };

  // Launch Free Browse
  const handleBrowseLaunch = () => {
    if (!selectedChapterId || loading) return;
    setLoading(true);
    setShlokaExited(false);
    setActiveView('shloka');
    setTimeout(() => {
      router.push(`/the-crucible/${selectedChapterId}?mode=browse`);
    }, 1800);
  };

  // Launch Quick Revision — browse mode filtered to star-marked questions
  const handleQuickRevisionLaunch = () => {
    if (!selectedChapterId || loading) return;
    setLoading(true);
    setShlokaExited(false);
    setActiveView('shloka');
    setTimeout(() => {
      router.push(`/the-crucible/${selectedChapterId}?mode=browse&is_top_pyq=true`);
    }, 1800);
  };

  // Launch Timed Test - show config modal
  const handleTestLaunch = () => {
    if (!selectedChapterId) return;
    if (!isLoggedIn) { setShowAuthDialog(true); return; }
    setShowTestConfig(true);
  };

  // Start test after configuration
  const startTest = useCallback(async (count: number, mix: DifficultyMix, sort: QuestionSort = 'random', useStarOnly?: boolean) => {
    if (!selectedChapterId) return;
    
    // Set shloka view first to avoid flash of wizard
    setShlokaExited(false);
    setActiveView('shloka');
    setIsBuilding(true);
    setLoading(true);
    
    // Close modal after view transition
    setTimeout(() => setShowTestConfig(false), 0);

    try {
      // Step 1: Fetch questions for the selected chapter
      const params = new URLSearchParams();
      params.set('chapter_id', selectedChapterId);
      params.set('limit', '500');
      if (useStarOnly) {
        params.set('is_top_pyq', 'true');
      }
      
      const questionsRes = await fetch(`/api/v2/questions?${params.toString()}`);
      const questionsJson = await questionsRes.json();
      const fetchedQuestions: Question[] = (questionsJson.data || []).map((q: any) => ({
        id: q._id,
        display_id: q.display_id,
        question_text: q.question_text,
        type: q.question_type || q.type || 'SCQ',
        options: q.options,
        answer: q.answer,
        solution: q.solution,
        metadata: q.metadata,
        svg_scales: q.svg_scales,
      }));

      if (fetchedQuestions.length === 0) {
        notify('No questions found for this chapter.');
        setIsBuilding(false);
        setLoading(false);
        return;
      }

      // Step 2: Fetch user progress for smart scoring
      let attempted: AttemptedEntry[] = [];
      let starredIds = new Set<string>();
      let last3Sessions: string[][] = [];

      const supabase = createSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (token) {
          try {
            const res = await fetch(`/api/v2/user/progress?chapterId=${selectedChapterId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const progress = await res.json();
              attempted = progress.attempted_ids ?? [];
              starredIds = new Set<string>(progress.starred_ids ?? []);
              last3Sessions = progress.last_3_sessions ?? [];
            }
          } catch { /* continue with empty progress */ }
        }
      }

      // Step 3: Build the smart test
      const picked = buildSmartTest({
        questions: fetchedQuestions,
        count,
        mix,
        sort,
        starredIds,
        attempted,
        last3Sessions,
      });

      if (picked.length === 0) {
        notify('Could not generate test with selected filters.');
        setIsBuilding(false);
        setLoading(false);
        return;
      }

      // Step 4: Set questions and transition to test after shloka
      setTestQuestions(picked);
      
      setTimeout(() => {
        setActiveView('test');
        setLoading(false);
        setIsBuilding(false);
      }, 1800);
    } catch (error) {
      console.error('Error building test:', error);
      notify('Failed to build test. Please try again.');
      setIsBuilding(false);
      setLoading(false);
    }
  }, [selectedChapterId, notify]);

  const handleBackToWizard = () => {
    setActiveView('wizard');
    setLoading(false);
  };

  if (!mounted) return (
    <div style={{ minHeight: '100vh', background: '#07080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (activeView === 'shloka') return <ShlokaScreen onDone={onShlokaDone} />;
  if (activeView === 'browse') return <BrowseView questions={questions} chapters={chapters} onBack={handleBackToWizard} />;
  if (activeView === 'test') return <TestView questions={testQuestions} onBack={handleBackToWizard} />;
  if (activeView === 'guided') return <GuidedPracticeWizard chapters={chapters} onBack={handleBackToWizard} preSelectedChapterId={selectedChapterId ?? undefined} preSelectedDifficulty={guidedDifficulty} preSelectedSessionLength={sessionLength} />;

  // Chapter list data
  const classChapters = chapters.filter(ch => ch.class_level === classTab);
  const grouped: Record<string, Chapter[]> = {};
  classChapters.forEach(ch => { const cat = ch.category ?? 'Physical'; (grouped[cat] = grouped[cat] || []).push(ch); });

  // Meta line for guided practice
  const metaLine = `${chapterQCount} questions · ${selectedChapter?.name ?? '—'} · ${guidedDifficulty} · ${sessionLength}Q`;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#07080f', color: '#fafafa', position: 'relative', overflow: 'hidden' }}>
        {/* Background gradient glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 45%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.03) 45%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-5%', left: '30%', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        </div>

        {/* NAV — kept exactly as is */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(7,8,15,0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '12px 20px' : '16px 40px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: 10, background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="flame-grad" x1="11" y1="14" x2="11" y2="1" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="55%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>
                    <linearGradient id="vessel-grad" x1="11" y1="12" x2="11" y2="21" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#78350f" />
                      <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>
                  </defs>
                  <path d="M5 13 Q4.5 21 11 21 Q17.5 21 17 13 Z" fill="url(#vessel-grad)" stroke="rgba(234,88,12,0.5)" strokeWidth="0.5" />
                  <rect x="4" y="12" width="14" height="2" rx="1" fill="#92400e" />
                  <path d="M11 13 C11 13 8.5 10 9 7 C9.5 4 11 2 11 2 C11 2 10 5 11.5 6.5 C12 5 12.5 3.5 13.5 3 C13 5 14 7 13 9 C14.5 7.5 15 5 14.5 3.5 C16 5.5 15.5 9 13.5 11 C14 10 14 9 13.5 8.5 C13 10 12 12 11 13 Z" fill="url(#flame-grad)" />
                  <path d="M8 13 C8 13 6.5 11 7 9 C7.5 7.5 8.5 7 8.5 7 C8 8.5 8.5 10 9.5 10.5 C9 9 9.5 7.5 10 7 C9.5 8.5 10 10.5 9 12 C9.5 11 9.5 10 9 9.5 C8.5 11 8.5 12 8 13 Z" fill="#f97316" opacity="0.7" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, letterSpacing: '-0.01em', color: '#fafafa', lineHeight: 1 }}>The Crucible</div>
                <div style={{ fontSize: isMobile ? 9 : 10, letterSpacing: '0.05em', color: 'rgba(251,146,60,0.7)', textTransform: 'uppercase', fontWeight: 500, marginTop: 3 }}>Forge Your Rank</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setShowProgress(true)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(165,180,252,0.9)', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <BarChart2 style={{ width: 14, height: 14 }} /> {isMobile ? '' : 'Progress'}
              </button>
              <a href="/"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(203,213,225,0.8)', fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s ease' }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} /> Home
              </a>
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, color: 'rgba(16,185,129,0.9)', fontWeight: 500 }}>Live</span>
                </div>
              )}
              {userEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <UserCircle style={{ width: 13, height: 13, color: 'rgba(165,180,252,0.9)' }} />
                  <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(165,180,252,0.9)', fontWeight: 500, maxWidth: isMobile ? 80 : 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userEmail}
                  </span>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? '20px 20px 48px' : '32px 40px 72px', position: 'relative', zIndex: 1 }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeUp 0.5s ease-out' }}>
            <h1 style={{ margin: '0 0 10px', lineHeight: 1.08, letterSpacing: '-0.03em', fontSize: isMobile ? 28 : 44, fontWeight: 800, color: '#fff', textShadow: '0 6px 40px rgba(99,102,241,0.3)' }}>
              <span style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Master Chemistry,
              </span>
              <br />
              <span style={{ fontSize: isMobile ? 18 : 26, fontWeight: 500, color: 'rgba(203,213,225,0.8)', letterSpacing: '-0.02em' }}>
                one question at a time.
              </span>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.85)', fontWeight: 400, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              Practice chapter-wise questions, measure accuracy, and build confidence.
            </p>
          </div>

          {/* Accordion Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp 0.5s ease-out 0.1s backwards' }}>

            {/* ═══ STEP 1: Chapter Selector ═══ */}
            <StepCard
              stepNum={1}
              label="STEP 1"
              value={chapterConfirmed ? (selectedChapter?.name ?? 'Chapter') : 'Select a chapter'}
              isOpen={step1Open}
              isConfirmed={chapterConfirmed && !step1Open}
              onToggle={handleStep1Toggle}
            >
              {/* Class tabs */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: 3, gap: 3, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                {([11, 12] as const).map(level => {
                  const isActive = classTab === level;
                  const color = level === 11 ? '#38bdf8' : '#a78bfa';
                  const count = chapters.filter(c => c.class_level === level).length;
                  return (
                    <button key={level} onClick={() => setClassTab(level)} style={{
                      flex: 1, padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent',
                    }}>
                      Class {level}
                      <span style={{ fontSize: 11, color: isActive ? color : 'rgba(255,255,255,0.3)' }}>{count} ch</span>
                    </button>
                  );
                })}
              </div>

              {/* Chapter list */}
              <div style={{ maxHeight: 340, overflowY: 'auto', margin: '0 -4px', padding: '0 4px' }}>
                {CAT_ORDER.filter(cat => grouped[cat]?.length).map(cat => (
                  <div key={cat}>
                    <div style={{ padding: '6px 0 4px', display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, background: '#0f1010', zIndex: 2 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLOR[cat] }} />
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: CAT_COLOR[cat] }}>{cat}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginLeft: 'auto' }}>
                        {grouped[cat].reduce((s, c) => s + (c.question_count ?? 0), 0)} Qs
                      </span>
                    </div>
                    {grouped[cat].map(ch => {
                      const isSelected = ch.id === selectedChapterId;
                      const accent = CAT_COLOR[ch.category ?? 'Physical'];
                      const qCount = ch.question_count ?? 0;
                      return (
                        <div
                          key={ch.id}
                          onClick={() => handleChapterTap(ch.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '11px 12px', borderRadius: 10, marginBottom: 2,
                            cursor: 'pointer', transition: 'all 0.15s',
                            background: isSelected ? 'rgba(99,102,241,0.09)' : 'transparent',
                            borderLeft: isSelected ? '3px solid #818cf8' : '3px solid transparent',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = `${accent}09`; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 13, color: isSelected ? '#fafafa' : 'rgba(255,255,255,0.88)', fontWeight: isSelected ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{ch.name}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, flexShrink: 0, color: qCount > 0 ? accent : 'rgba(148,163,184,0.4)', background: qCount > 0 ? `${accent}0d` : 'transparent', padding: '1px 6px', borderRadius: 4 }}>
                                {qCount > 0 ? qCount : '—'}
                              </span>
                            </div>
                            <ChapterBar value={qCount > 0 ? Math.min(100, Math.round((qCount / 300) * 100)) : 0} color={accent} />
                          </div>
                          <ChevronRight style={{ width: 14, height: 14, color: isSelected ? '#818cf8' : 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </StepCard>

            {/* ═══ STEP 2: Mode + Config ═══ */}
            <div ref={step2Ref}>
              <StepCard
                stepNum={2}
                label="STEP 2"
                value="How do you want to practice?"
                isOpen={step2Open}
                isConfirmed={false}
                onToggle={handleStep2Toggle}
                locked={!chapterConfirmed}
              >
                {!chapterConfirmed ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', opacity: 0.45 }}>
                    <Lock style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.4)' }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Pick a chapter first to unlock</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                    {/* A. Guided Practice card — expanded */}
                    <div style={{ borderRadius: 12, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 4px 20px rgba(99,102,241,0.08)' }}>
                      <button
                        onClick={() => setGuidedExpanded(!guidedExpanded)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <BookOpen style={{ width: 18, height: 18, color: '#818cf8', flexShrink: 0 }} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>Guided Practice</span>
                            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.05em', border: '1px solid rgba(251,191,36,0.3)' }}>BETA</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(165,180,252,0.7)', fontWeight: 500 }}>Currently: GOC only</div>
                        </div>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontWeight: 700, letterSpacing: '0.04em', border: '1px solid rgba(99,102,241,0.25)' }}>RECOMMENDED</span>
                        <ChevronDown style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.3)', transform: guidedExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: `transform ${COLLAPSE_TRANSITION}` }} />
                      </button>

                      {guidedExpanded && (
                        <div style={{ padding: '0 16px 16px' }}>
                          {/* Check if chapter is GOC */}
                          {selectedChapterId !== 'ch12_goc' && (
                            <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                              <div style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
                                <div style={{ fontSize: 18, flexShrink: 0 }}>🚧</div>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', marginBottom: 3 }}>Coming Soon for {selectedChapter?.name}</div>
                                  <div style={{ fontSize: 11, color: 'rgba(251,191,36,0.8)', lineHeight: 1.5, marginBottom: 8 }}>
                                    Guided Practice requires micro-concept tagging. Currently available for <strong style={{ color: '#fbbf24' }}>General Organic Chemistry (GOC)</strong> only.
                                  </div>
                                  <div style={{ fontSize: 10, color: 'rgba(251,191,36,0.6)' }}>
                                    💡 Try Free Browse or Timed Test for this chapter, or switch to GOC for the full adaptive experience.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Difficulty */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Difficulty</div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {(['Easy', 'Medium', 'Hard', 'Mixed'] as GuidedDifficulty[]).map(d => {
                                const sel = guidedDifficulty === d;
                                const color = d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : d === 'Hard' ? '#f87171' : '#a78bfa';
                                return (
                                  <button key={d} onClick={() => setGuidedDifficulty(d)} style={{
                                    flex: 1, padding: '10px 0', borderRadius: 8, border: `1.5px solid ${sel ? color + '60' : 'rgba(255,255,255,0.08)'}`,
                                    background: sel ? color + '15' : 'rgba(255,255,255,0.02)', color: sel ? color : 'rgba(255,255,255,0.5)',
                                    fontSize: 12, fontWeight: sel ? 700 : 600, cursor: 'pointer', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent',
                                  }}>
                                    {d}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Session Length */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Session Length</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                              {[{ val: 10, label: 'Quick', time: '~12 min' }, { val: 20, label: 'Standard', time: '~25 min' }, { val: 30, label: 'Deep', time: '~40 min' }].map(opt => {
                                const sel = sessionLength === opt.val;
                                return (
                                  <button key={opt.val} onClick={() => setSessionLength(opt.val)} style={{
                                    padding: '14px 8px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                                    border: `1.5px solid ${sel ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.06)'}`,
                                    background: sel ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)', textAlign: 'center',
                                    boxShadow: sel ? '0 0 0 1px rgba(99,102,241,0.15), 0 4px 16px rgba(99,102,241,0.12)' : 'none',
                                    WebkitTapHighlightColor: 'transparent',
                                  }}>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: sel ? '#a5b4fc' : 'rgba(255,255,255,0.5)', marginBottom: 2, letterSpacing: '-0.02em' }}>{opt.val}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: sel ? '#a5b4fc' : 'rgba(255,255,255,0.4)', marginBottom: 1 }}>{opt.label}</div>
                                    <div style={{ fontSize: 10, color: sel ? 'rgba(165,180,252,0.6)' : 'rgba(255,255,255,0.25)' }}>{opt.time}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* How this session works — toggle */}
                          <div style={{ marginBottom: 16 }}>
                            <button
                              onClick={() => setHowItWorksOpen(!howItWorksOpen)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, padding: '4px 0', WebkitTapHighlightColor: 'transparent' }}
                            >
                              <Sparkles style={{ width: 13, height: 13 }} />
                              How this session works
                              <ChevronDown style={{ width: 13, height: 13, transform: howItWorksOpen ? 'rotate(180deg)' : 'rotate(0)', transition: `transform ${COLLAPSE_TRANSITION}` }} />
                            </button>
                            {howItWorksOpen && (
                              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 4 }}>
                                {[
                                  { num: 1, title: 'Warm-up (5 questions)', desc: 'One per major concept, easy difficulty. We silently map your baseline.' },
                                  { num: 2, title: 'Adaptive practice', desc: 'One at a time. After each, tap how it felt. We adjust the next question instantly.' },
                                  { num: 3, title: 'Session summary', desc: 'See exactly what moved, what needs work, and what to focus on next time.' },
                                ].map(s => (
                                  <div key={s.num} style={{ display: 'flex', gap: 10 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#a5b4fc', flexShrink: 0 }}>{s.num}</div>
                                    <div>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>{s.title}</div>
                                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{s.desc}</div>
                                    </div>
                                  </div>
                                ))}
                                <div style={{ marginTop: 6, padding: '10px 12px', borderRadius: 8, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
                                  <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, marginBottom: 3, letterSpacing: '0.05em' }}>🧪 BETA FEATURE</div>
                                  <div style={{ fontSize: 11, color: 'rgba(251,191,36,0.8)', lineHeight: 1.5 }}>
                                    Adaptive practice is currently available for GOC only. We're adding micro-concept tags to more chapters — check back soon!
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Meta line */}
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
                            {metaLine}
                          </div>

                          {/* Begin Session button */}
                          <button
                            onClick={selectedChapterId === 'ch12_goc' ? handleGuidedLaunch : undefined}
                            disabled={selectedChapterId !== 'ch12_goc'}
                            onMouseEnter={e => { if (selectedChapterId === 'ch12_goc') { e.currentTarget.style.background = 'linear-gradient(135deg,#4f46e5 0%,#6366f1 50%,#818cf8 100%)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)'; } }}
                            onMouseLeave={e => { if (selectedChapterId === 'ch12_goc') { e.currentTarget.style.background = 'linear-gradient(135deg,#3730a3 0%,#4f46e5 50%,#6366f1 100%)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.35)'; } }}
                            style={{
                              width: '100%', padding: '15px 0', borderRadius: 12, border: 'none',
                              background: selectedChapterId === 'ch12_goc' ? 'linear-gradient(135deg,#3730a3 0%,#4f46e5 50%,#6366f1 100%)' : 'rgba(255,255,255,0.05)',
                              color: selectedChapterId === 'ch12_goc' ? '#fff' : 'rgba(255,255,255,0.3)',
                              fontSize: 15, fontWeight: 700,
                              cursor: selectedChapterId === 'ch12_goc' ? 'pointer' : 'not-allowed',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              boxShadow: selectedChapterId === 'ch12_goc' ? '0 6px 24px rgba(99,102,241,0.35)' : 'none',
                              transition: 'all 0.2s ease',
                              WebkitTapHighlightColor: 'transparent',
                              opacity: selectedChapterId === 'ch12_goc' ? 1 : 0.5,
                            }}
                          >
                            {selectedChapterId === 'ch12_goc' ? (
                              <>Begin Session <ChevronRight style={{ width: 18, height: 18 }} /></>
                            ) : (
                              <>Available for GOC Only</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* B. Free Browse — enhanced card with stats */}
                    <button
                      onClick={handleBrowseLaunch}
                      style={{
                        width: '100%', display: 'flex', flexDirection: 'column', gap: 10,
                        padding: '16px', borderRadius: 12,
                        border: '1px solid #222525', background: '#0f1010',
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'; e.currentTarget.style.background = 'rgba(56,189,248,0.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#222525'; e.currentTarget.style.background = '#0f1010'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <LayoutGrid style={{ width: 20, height: 20, color: '#3b82f6', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fafafa', marginBottom: 2 }}>Free Browse</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Explore questions at your own pace</div>
                        </div>
                        <ChevronRight style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                      </div>
                      {/* Chapter stats mini-grid — live from API */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, paddingTop: 4 }}>
                        {chapterStats === null ? (
                          // Loading skeleton
                          [['Total', 'rgba(255,255,255,0.5)'], ['JEE Main', '#38bdf8'], ['JEE Adv', '#a78bfa'], ['Non-PYQ', '#34d399']].map(([label, c]) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${c}22`, borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
                              <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.15)', fontFamily: 'monospace', lineHeight: 1 }}>—</div>
                              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, lineHeight: 1 }}>{label}</div>
                            </div>
                          ))
                        ) : (
                          [
                            [String(chapterStats.total), 'Total', 'rgba(255,255,255,0.5)'],
                            [String(chapterStats.jeeMain), 'JEE Main', '#38bdf8'],
                            [String(chapterStats.jeeAdv), 'JEE Adv', '#a78bfa'],
                            [String(chapterStats.nonPyq), 'Non-PYQ', '#34d399'],
                          ].map(([val, label, c]) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${c}22`, borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
                              <div style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: 'monospace', lineHeight: 1 }}>{val}</div>
                              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, lineHeight: 1 }}>{label}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </button>

                    {/* C. Quick Revision — only if chapter has ≥20 star questions */}
                    {(selectedChapter?.star_question_count ?? 0) >= 20 && (
                      <button
                        onClick={handleQuickRevisionLaunch}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                          padding: '16px', borderRadius: 12,
                          border: '1px solid rgba(251,191,36,0.15)', background: 'rgba(251,191,36,0.03)',
                          cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.35)'; e.currentTarget.style.background = 'rgba(251,191,36,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.15)'; e.currentTarget.style.background = 'rgba(251,191,36,0.03)'; }}
                      >
                        <Star style={{ width: 20, height: 20, color: '#fbbf24', fill: '#fbbf24', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fafafa', marginBottom: 2 }}>Quick Revision</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{selectedChapter?.star_question_count} hand-picked must-solve questions</div>
                        </div>
                        <ChevronRight style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                      </button>
                    )}

                    {/* D. Timed Test — row card */}
                    <button
                      onClick={handleTestLaunch}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '16px', borderRadius: 12,
                        border: '1px solid #222525', background: '#0f1010',
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; e.currentTarget.style.background = 'rgba(249,115,22,0.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#222525'; e.currentTarget.style.background = '#0f1010'; }}
                    >
                      <Clock style={{ width: 20, height: 20, color: '#f97316', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fafafa', marginBottom: 2 }}>Timed Test</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Simulate exam conditions • Test your speed & accuracy</div>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                    </button>

                  </div>
                )}
              </StepCard>
            </div>
          </div>
        </div>

        {/* Progress Panel (slide-over) */}
        <ProgressPanel
          isOpen={showProgress}
          onClose={() => setShowProgress(false)}
          isLoggedIn={isLoggedIn}
        />

        {/* Auth Required Dialog */}
        {showAuthDialog && <AuthRequiredDialog onClose={() => setShowAuthDialog(false)} />}

        {/* Test Config Modal */}
        {showTestConfig && (
          <TestConfigModal
            maxQ={chapterQCount}
            starQuestionCount={selectedChapter?.star_question_count ?? 0}
            onStart={startTest}
            onClose={() => setShowTestConfig(false)}
          />
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
            background: 'rgba(30,32,44,0.97)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '10px 18px', fontSize: 13, color: '#fff', fontWeight: 500,
            whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
