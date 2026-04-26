"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, ChevronRight, Check, BarChart2, UserCircle, BookOpen, LayoutGrid, Clock, Lock, Sparkles, Star, LogOut, ClipboardList, Search, X } from 'lucide-react';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import { Chapter, Question } from './types';

// API response types
interface ApiQuestion {
  _id: string;
  display_id: string;
  question_text?: { markdown?: string };
  type: string;
  options?: unknown[];
  answer?: unknown;
  solution?: {
    markdown?: string;
    text_markdown?: string;
    video_url?: string;
    asset_ids?: unknown;
    latex_validated?: boolean;
  };
  metadata?: {
    difficulty?: string;
    chapter_id?: string;
    tags?: unknown[];
    is_pyq?: boolean;
    is_top_pyq?: boolean;
    exam_source?: unknown;
    difficultyLevel?: number;
    examBoard?: string;
    sourceType?: string;
    examDetails?: unknown;
  };
  svg_scales?: Record<string, number>;
}
import ProgressPanel from './ProgressPanel';
import BrowseView from './BrowseView';
import TestView from './TestView';
import AuthRequiredDialog from './AuthRequiredDialog';
import GuidedPracticeWizard from './GuidedPracticeWizard';
import TestConfigModal, { DifficultyMix, QuestionSort } from './TestConfigModal';
import { buildSmartTest, AttemptedEntry } from './testGenerator';

type ActiveView = 'wizard' | 'shloka' | 'browse' | 'guided' | 'test';
type GuidedDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
type ExamType = 'JEE' | 'NEET';
type SubjectType = 'Chemistry' | 'Physics' | 'Maths' | 'Biology';

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

// ── Question fetchers ────────────────────────────────────────────────────────

// Shared mapper: API question shape → client Question shape.
// `solution_pending` is set when the API returned the question without
// solution.text_markdown (i.e., excludeSolutions=true was used). The UI uses
// this to distinguish "still loading" from "genuinely missing solution".
function mapApiToQuestion(q: ApiQuestion): Question {
  // The projected response has solution.text_markdown undefined; a fully
  // loaded one has it as a string (possibly empty for genuinely missing).
  const solutionWasIncluded = q.solution?.text_markdown !== undefined;
  return {
    id: q._id,
    display_id: q.display_id || q._id?.slice(0, 8)?.toUpperCase() || 'Q',
    question_text: { markdown: q.question_text?.markdown || '' },
    type: (q.type as 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX') || 'SCQ',
    options: (q.options as Array<{ id: string; text: string; is_correct: boolean }> | undefined) || [],
    answer: (q.answer as { integer_value?: number; correct_option?: string } | undefined) || {},
    solution: {
      text_markdown: q.solution?.text_markdown || '',
      video_url: q.solution?.video_url || undefined,
      asset_ids: (q.solution?.asset_ids as { audio?: string[] } | undefined) || undefined,
      latex_validated: q.solution?.latex_validated || false,
    },
    solution_pending: !solutionWasIncluded,
    metadata: {
      difficultyLevel: ((q.metadata?.difficultyLevel || 3) as 1 | 2 | 3 | 4 | 5),
      chapter_id: q.metadata?.chapter_id || '',
      subject: 'chemistry',
      tags: ((q.metadata?.tags as Array<{ tag_id: string; weight: number }>) || []),
      is_pyq: q.metadata?.is_pyq || false,
      is_top_pyq: q.metadata?.is_top_pyq || false,
      exam_source: (q.metadata?.exam_source as Record<string, unknown> | undefined),
    },
    svg_scales: q.svg_scales || {},
  };
}

async function fetchTopPYQs(): Promise<Question[]> {
  const params = new URLSearchParams();
  params.set('is_top_pyq', 'true');
  params.set('limit', '500');
  const res = await fetch(`/api/v2/questions?${params.toString()}`);
  const json = await res.json();
  return (json.data || []).map(mapApiToQuestion);
}

// Used by Test mode and Quick Revision — both need the full set up front.
async function fetchQuestions(chapterIds: string[], limit?: number, topPYQOnly?: boolean, examBoard?: string): Promise<Question[]> {
  const params = new URLSearchParams();
  chapterIds.forEach(id => params.append('chapter_id', id));
  params.set('limit', String(limit || 500));
  if (topPYQOnly) params.set('is_top_pyq', 'true');
  if (examBoard) params.set('examBoard', examBoard);
  const res = await fetch(`/api/v2/questions?${params.toString()}`);
  const json = await res.json();
  return (json.data || []).map(mapApiToQuestion);
}

// Single batch fetch — used by both prefetch and the streaming continuation.
// Returns the questions plus the chapter total so the caller knows when to stop.
// Pass excludeSolutions=true to skip the heavy solution markdown (loaded lazily
// when the user navigates to that page in BrowseView).
async function fetchBatch(
  chapterId: string,
  examBoard: string | undefined,
  skip: number,
  limit: number,
  signal?: AbortSignal,
  excludeSolutions = true,
): Promise<{ questions: Question[]; total: number }> {
  const params = new URLSearchParams();
  params.set('chapter_id', chapterId);
  params.set('skip', String(skip));
  params.set('limit', String(limit));
  if (examBoard) params.set('examBoard', examBoard);
  if (excludeSolutions) params.set('excludeSolutions', 'true');
  const res = await fetch(`/api/v2/questions?${params.toString()}`, { signal });
  const json = await res.json();
  return {
    questions: (json.data || []).map(mapApiToQuestion),
    total: json.pagination?.total ?? 0,
  };
}

// Fetches full data (including solutions) for a specific list of question IDs.
// Used by BrowseView's page-aware lazy loading: as the user navigates to each
// 15-question page, we ensure those 15 have solutions ready.
async function fetchSolutionsForIds(ids: string[], signal?: AbortSignal): Promise<Question[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams();
  params.set('ids', ids.join(','));
  const res = await fetch(`/api/v2/questions?${params.toString()}`, { signal });
  const json = await res.json();
  return (json.data || []).map(mapApiToQuestion);
}

// Streams remaining batches from `startSkip` to `total`. Fetches up to `concurrency`
// batches in parallel (each ~500ms on free-tier Mongo) which roughly halves the wall
// time for large chapters without hammering the connection pool.
//
// Batches are appended in skip-order (batch[0] before batch[1]) so the question list
// stays sorted by display_id even when the network returns the second batch first.
async function streamRemainingBatches(
  chapterId: string,
  examBoard: string | undefined,
  startSkip: number,
  total: number,
  onBatch: (qs: Question[]) => void,
  signal: AbortSignal,
  batchSize = 100,
  concurrency = 2,
) {
  // Pre-compute every batch window so we can fire them in fixed order.
  const windows: Array<{ skip: number; limit: number }> = [];
  for (let s = startSkip; s < total; s += batchSize) {
    windows.push({ skip: s, limit: Math.min(batchSize, total - s) });
  }

  // Process in chunks of `concurrency`, awaiting both before moving on. Within a
  // chunk we pass results to onBatch in original order so display_id sort holds.
  for (let i = 0; i < windows.length; i += concurrency) {
    if (signal.aborted) return;
    const chunk = windows.slice(i, i + concurrency);

    const results = await Promise.all(
      chunk.map(w =>
        fetchBatch(chapterId, examBoard, w.skip, w.limit, signal)
          .then(r => r.questions)
          .catch(err => {
            if ((err as Error)?.name === 'AbortError') return null;
            console.warn('Stream batch failed:', err);
            return [] as Question[];
          })
      )
    );

    for (const r of results) {
      if (signal.aborted) return;
      if (r === null) return; // aborted mid-chunk
      if (r.length > 0) onBatch(r);
    }
  }
}

function selectTestQuestions(all: Question[], count: number, mix: DifficultyMix): Question[] {
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  let pool: Question[];
  if (mix === 'pyq') {
    pool = all.filter(q => q.metadata.is_pyq);
    if (pool.length === 0) pool = all;
  } else if (mix === 'easy') {
    pool = [...shuffle(all.filter(q => q.metadata.difficultyLevel <= 2)), ...shuffle(all.filter(q => q.metadata.difficultyLevel === 3))];
  } else if (mix === 'hard') {
    pool = [...shuffle(all.filter(q => q.metadata.difficultyLevel === 3)), ...shuffle(all.filter(q => q.metadata.difficultyLevel >= 4))];
  } else {
    const easy = shuffle(all.filter(q => q.metadata.difficultyLevel <= 2));
    const medium = shuffle(all.filter(q => q.metadata.difficultyLevel === 3));
    const hard = shuffle(all.filter(q => q.metadata.difficultyLevel >= 4));
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
  // Provided by the [chapterId] route when a user refreshes or opens a direct
  // link like /the-crucible/ch11_mole?mode=browse&examBoard=JEE.
  // CrucibleWizard skips the shloka and launches browse immediately.
  initialChapterId?: string;
  initialMode?: 'browse';
  initialExam?: 'JEE' | 'NEET';
}

export default function CrucibleWizard({ chapters, isLoggedIn, initialChapterId, initialMode, initialExam }: CrucibleWizardProps) {
  const router = useRouter();
  const step2Ref = useRef<HTMLDivElement>(null);

  // Accordion state — 4 steps now
  const [step1Open, setStep1Open] = useState(true);   // Exam
  const [step2Open, setStep2Open] = useState(false);  // Subject
  const [step3Open, setStep3Open] = useState(false);  // Chapter
  const [step4Open, setStep4Open] = useState(false);  // Practice Mode

  // Exam + subject — default to JEE/Chemistry so the page shows content immediately.
  // initialExam/initialChapterId seed from the [chapterId] route on direct URL load.
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(initialExam ?? 'JEE');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>('Chemistry');

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(initialChapterId ?? null);
  const [classTab, setClassTab] = useState<'all' | 11 | 12>('all');
  const [chapterSearch, setChapterSearch] = useState('');
  const [openModeSheet, setOpenModeSheet] = useState(false);

  // Prefetch cache — first batch (50 questions) loads while user reads the mode sheet,
  // so when they pick Browse the data is already in memory.
  const [prefetchedChapterId, setPrefetchedChapterId] = useState<string | null>(null);
  const [prefetchedExam, setPrefetchedExam] = useState<ExamType | null>(null);
  const [prefetchedQuestions, setPrefetchedQuestions] = useState<Question[] | null>(null);
  const [prefetchedTotal, setPrefetchedTotal] = useState<number>(0);

  // Stream control: lets us abort in-flight fetches when chapter changes or user goes back.
  const streamAbortRef = useRef<AbortController | null>(null);
  // Tracks whether BrowseView is currently mounted (so streaming batches go to the
  // right place: questions state if mounted, pendingQuestions buffer if not yet).
  const transitionedRef = useRef(false);
  // Progress for the floating "Loading X of Y" indicator while batches stream in.
  const [streamProgress, setStreamProgress] = useState<{ loaded: number; total: number } | null>(null);

  // Ref mirror of `questions` so the lazy-solution callback can read fresh data
  // without forcing re-renders or unstable callback identity.
  const questionsRef = useRef<Question[]>([]);
  // Tracks which IDs have an in-flight solution fetch — prevents duplicate calls
  // when the user rapidly toggles pages or filters.
  const inFlightSolutionsRef = useRef<Set<string>>(new Set());

  // Guided practice config
  const [guidedDifficulty, setGuidedDifficulty] = useState<GuidedDifficulty>('Mixed');
  const [sessionLength, setSessionLength] = useState(20);
  const [guidedExpanded, setGuidedExpanded] = useState(false); // Collapsed by default (BETA)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Live chapter stats for Free Browse card
  const [chapterStats, setChapterStats] = useState<{ total: number; jeeMain: number; jeeAdv: number; nonPyq: number; neetPyq?: number } | null>(null);

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mockTestSets, setMockTestSets] = useState<Array<{ _id: string; title: string; exam: string; question_count: number; duration_minutes: number; status: string }>>([]);

  useEffect(() => { setMounted(true); }, []);

  // Auto-launch browse when arriving via a direct URL (refresh or shared link).
  // Skips the shloka — this is a restore, not a fresh session start.
  // Runs once after mount; props are stable so stale-closure is not a concern.
  useEffect(() => {
    if (!mounted || !initialChapterId || initialMode !== 'browse') return;

    const exam = initialExam ?? undefined;
    const controller = new AbortController();
    streamAbortRef.current = controller;

    // Mark as transitioned immediately — batches go straight to `questions`.
    transitionedRef.current = true;
    setLoading(true);

    fetchBatch(initialChapterId, exam, 0, 50, controller.signal)
      .then(({ questions: firstBatch, total }) => {
        if (controller.signal.aborted) return;
        setQuestions(firstBatch);
        setActiveView('browse');
        setLoading(false);
        setStreamProgress({ loaded: firstBatch.length, total });

        if (total > firstBatch.length) {
          const onBatch = (batch: Question[]) => {
            setQuestions(prev => [...prev, ...batch]);
            setStreamProgress(prev => prev ? { ...prev, loaded: prev.loaded + batch.length } : null);
          };
          streamRemainingBatches(initialChapterId, exam, firstBatch.length, total, onBatch, controller.signal)
            .finally(() => setStreamProgress(null));
        } else {
          setStreamProgress(null);
        }
      })
      .catch(err => {
        if ((err as Error)?.name !== 'AbortError') setLoading(false);
      });

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]); // intentionally runs once after mount

  // Load user session + saved exam preference from Supabase user_metadata
  useEffect(() => {
    const supabase = createSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
      // Restore saved exam preference
      const saved = session?.user?.user_metadata?.exam_preference as ExamType | undefined;
      if (saved && (saved === 'JEE' || saved === 'NEET') && !selectedExam) {
        setSelectedExam(saved);
        setSelectedSubject('Chemistry');
        setStep1Open(false);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch published mock test sets for the landing page card
  useEffect(() => {
    fetch('/api/v2/mock-tests?status=published')
      .then(r => r.json())
      .then(d => { if (d.success) setMockTestSets(d.data); })
      .catch(() => {});
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
      transitionedRef.current = true; // BrowseView is now mounted; future stream batches go to `questions`
    }
  }, [shlokaExited, pendingQuestions, pendingView]);

  const onShlokaDone = useCallback(() => { setShlokaExited(true); }, []);

  // Keep questionsRef in sync so the stable callback below can read the latest
  // questions array without taking it as a dependency (which would change identity).
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  // Mirror (view, chapter, exam) into the URL so the address bar is shareable and
  // consistent with already-published links (YouTube videos, student groups, etc.).
  // Format matches the existing [chapterId] route:
  //   /the-crucible/{chapterId}?mode=browse&examBoard=JEE
  // Uses replaceState — in-app Back button drives navigation, browser history is clean.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const base = '/the-crucible';
    let target = base;
    if ((activeView === 'browse' || activeView === 'guided' || activeView === 'test') && selectedChapterId) {
      const params = new URLSearchParams({ mode: activeView });
      if (selectedExam) params.set('examBoard', selectedExam);
      target = `${base}/${selectedChapterId}?${params.toString()}`;
    }
    if (window.location.pathname + window.location.search !== target) {
      window.history.replaceState(null, '', target);
    }
  }, [activeView, selectedChapterId, selectedExam]);

  // Lazy solution loader — called by BrowseView whenever the visible 15-question
  // page changes. We filter to only the IDs that still have solution_pending,
  // de-dupe in-flight requests, fetch in one batch, then merge solutions back
  // into the questions array (preserving everything else about each question).
  const loadSolutionsForPage = useCallback(async (pageIds: string[]) => {
    const allQuestions = questionsRef.current;
    const idsToLoad = pageIds.filter(id => {
      if (inFlightSolutionsRef.current.has(id)) return false;
      const q = allQuestions.find(qq => qq.id === id);
      return q?.solution_pending === true;
    });
    if (idsToLoad.length === 0) return;

    idsToLoad.forEach(id => inFlightSolutionsRef.current.add(id));

    try {
      const fullQuestions = await fetchSolutionsForIds(idsToLoad);
      const solutionsByID = new Map(fullQuestions.map(fq => [fq.id, fq.solution]));

      setQuestions(prev => prev.map(q => {
        const sol = solutionsByID.get(q.id);
        if (!sol) return q;
        return { ...q, solution: sol, solution_pending: false };
      }));
    } catch (err) {
      console.warn('Lazy solution load failed:', err);
    } finally {
      idsToLoad.forEach(id => inFlightSolutionsRef.current.delete(id));
    }
  }, []);

  // Derived values — counts switch based on which exam is selected
  const selectedChapter = selectedChapterId ? chapters.find(c => c.id === selectedChapterId) : null;
  const chapterConfirmed = !!selectedChapterId;
  const chapterQCount = selectedExam === 'NEET'
    ? (selectedChapter?.neet_question_count ?? 0)
    : (selectedChapter?.question_count ?? 0);
  const chapterStarCount = selectedExam === 'NEET'
    ? (selectedChapter?.neet_star_question_count ?? 0)
    : (selectedChapter?.star_question_count ?? 0);

  // Fetch live chapter stats for the Free Browse card with 24-hour caching
  // Cache key includes exam so JEE and NEET stats are stored separately
  const fetchChapterStats = useCallback(async (chapterId: string) => {
    setChapterStats(null);
    const exam = selectedExam ?? 'JEE';

    // Check cache first
    try {
      const cacheKey = `chapter_stats_${exam}_${chapterId}`;
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
    } catch {
      // Cache read failed, continue to fetch
    }

    // Fetch fresh data — always scoped by examBoard
    try {
      const base = `/api/v2/questions?chapter_id=${chapterId}&examBoard=${exam}&countOnly=true`;
      if (exam === 'NEET') {
        // NEET stats: total, PYQ, non-PYQ
        const [totalRes, pyqRes, nonPyqRes] = await Promise.all([
          fetch(base),
          fetch(`${base}&sourceType=PYQ`),
          fetch(`${base}&is_pyq=false`),
        ]);
        const [t, p, n] = await Promise.all([totalRes.json(), pyqRes.json(), nonPyqRes.json()]);
        const stats = {
          total: t.pagination?.total ?? 0,
          jeeMain: 0,      // Not applicable for NEET
          jeeAdv: 0,       // Not applicable for NEET
          nonPyq: n.pagination?.total ?? 0,
          neetPyq: p.pagination?.total ?? 0,
        };
        setChapterStats(stats);
        try {
          localStorage.setItem(`chapter_stats_${exam}_${chapterId}`, JSON.stringify({ data: stats, timestamp: Date.now() }));
        } catch { /* not critical */ }
      } else {
        // JEE stats: total, JEE Main PYQ, JEE Adv PYQ, non-PYQ
        const [totalRes, mainRes, advRes, nonPyqRes] = await Promise.all([
          fetch(base),
          fetch(`${base}&is_pyq=true&exam_level=mains`),
          fetch(`${base}&is_pyq=true&exam_level=adv`),
          fetch(`${base}&is_pyq=false`),
        ]);
        const [t, m, a, n] = await Promise.all([totalRes.json(), mainRes.json(), advRes.json(), nonPyqRes.json()]);
        const stats = {
          total: t.pagination?.total ?? 0,
          jeeMain: m.pagination?.total ?? 0,
          jeeAdv: a.pagination?.total ?? 0,
          nonPyq: n.pagination?.total ?? 0,
        };
        setChapterStats(stats);
        try {
          localStorage.setItem(`chapter_stats_${exam}_${chapterId}`, JSON.stringify({ data: stats, timestamp: Date.now() }));
        } catch { /* not critical */ }
      }
    } catch {
      setChapterStats(null);
    }
  }, [selectedExam]);

  // Step 1: Exam selection — auto-selects Chemistry and jumps straight to chapter list
  const handleExamSelect = (exam: ExamType) => {
    setSelectedExam(exam);
    setSelectedSubject('Chemistry'); // only Chemistry is live; auto-select to skip subject step
    setSelectedChapterId(null);
    setChapterStats(null);
    setStep1Open(false);
    // Persist to Supabase (best-effort, non-blocking)
    const supabase = createSupabaseClient();
    if (supabase) {
      supabase.auth.updateUser({ data: { exam_preference: exam } }).catch(() => {});
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    window.location.reload();
  };

  // Switch exam — called from profile menu or exam chips; clears chapter selection
  const handleChangeExam = (exam?: ExamType) => {
    setShowProfileMenu(false);
    const next = exam ?? (selectedExam === 'JEE' ? 'NEET' : 'JEE');
    setSelectedExam(next);
    setSelectedSubject('Chemistry');
    setSelectedChapterId(null);
    setChapterStats(null);
    setOpenModeSheet(false);
    const supabase = createSupabaseClient();
    if (supabase) {
      supabase.auth.updateUser({ data: { exam_preference: next } }).catch(() => {});
    }
  };

  // Step 2: Subject selection
  const handleSubjectSelect = (subject: SubjectType) => {
    setSelectedSubject(subject);
    setSelectedChapterId(null);
    setChapterStats(null);
    setStep2Open(false);
    setTimeout(() => setStep3Open(true), 280);
  };

  // Step 3 (formerly Step 1): Chapter selection handler
  const handleChapterTap = (id: string) => {
    setSelectedChapterId(id);
    setChapterStats(null);
    fetchChapterStats(id);
    setStep3Open(false);
    setTimeout(() => setStep4Open(true), 280);
  };

  // Chapter tap — opens mode sheet AND kicks off a small first-batch prefetch (50 Qs only).
  // The remaining batches stream once the user actually picks Browse, so we don't waste
  // bandwidth fetching a full 500-question chapter the user might never browse.
  const handleChapterSelect = (id: string) => {
    setSelectedChapterId(id);
    setChapterStats(null);
    fetchChapterStats(id);
    setOpenModeSheet(true);
    setGuidedExpanded(false);

    if (id !== prefetchedChapterId || selectedExam !== prefetchedExam) {
      // Cancel any in-flight prefetch for the previous chapter
      streamAbortRef.current?.abort();
      const controller = new AbortController();
      streamAbortRef.current = controller;

      setPrefetchedChapterId(id);
      setPrefetchedExam(selectedExam);
      setPrefetchedQuestions(null);
      setPrefetchedTotal(0);

      fetchBatch(id, selectedExam ?? undefined, 0, 50, controller.signal)
        .then(({ questions, total }) => {
          if (controller.signal.aborted) return;
          setPrefetchedQuestions(questions);
          setPrefetchedTotal(total);
        })
        .catch(err => {
          // Silent on abort; the next handler will refetch if needed.
          if ((err as Error)?.name !== 'AbortError') console.warn('Prefetch failed:', err);
        });
    }
  };

  // Toggle handlers
  const handleStep1Toggle = () => {
    if (step1Open) { setStep1Open(false); return; }
    setStep1Open(true);
    setStep2Open(false);
    setStep3Open(false);
    setStep4Open(false);
  };

  const handleStep2Toggle = () => {
    if (!selectedExam) return;
    if (step2Open) { setStep2Open(false); return; }
    setStep2Open(true);
    setStep3Open(false);
    setStep4Open(false);
  };

  const handleStep3Toggle = () => {
    if (!selectedSubject) return;
    if (step3Open) { setStep3Open(false); return; }
    setStep3Open(true);
    setStep4Open(false);
  };

  const handleStep4Toggle = () => {
    if (!chapterConfirmed) return;
    setStep4Open(!step4Open);
  };

  // Launch Guided Practice
  const handleGuidedLaunch = () => {
    if (!selectedChapterId) return;
    setActiveView('guided');
  };

  // Returns true when the prefetch cache is valid for the current chapter + exam.
  const hasPrefetch = () =>
    prefetchedQuestions !== null &&
    prefetchedChapterId === selectedChapterId &&
    prefetchedExam === selectedExam;

  // Append a streamed batch — goes to `pendingQuestions` if BrowseView hasn't mounted
  // yet (during shloka), or directly to `questions` once it has. Also bumps the
  // visible progress counter so the floating indicator can update.
  const appendStreamedBatch = (batch: Question[]) => {
    if (transitionedRef.current) {
      setQuestions(prev => [...prev, ...batch]);
    } else {
      setPendingQuestions(prev => prev ? [...prev, ...batch] : batch);
    }
    setStreamProgress(prev => prev ? { ...prev, loaded: prev.loaded + batch.length } : null);
  };

  // Launch Free Browse — first batch shows immediately (or via shloka if not prefetched);
  // remaining batches stream in the background while the user practices. Scales to any
  // chapter size: GoC with 500 questions feels just as fast as Mole with 184.
  const handleBrowseLaunch = () => {
    if (!selectedChapterId || loading) return;
    const chapterId = selectedChapterId;
    const examBoard = selectedExam ?? undefined;

    setLoading(true);
    setShlokaExited(false);
    setOpenModeSheet(false);
    setActiveView('shloka');
    setPendingView('browse');
    transitionedRef.current = false;

    // Reuse the prefetch's controller if cache is valid; otherwise abort and start fresh.
    const cacheHit = hasPrefetch();

    if (cacheHit) {
      // First 50 already loaded — display immediately, then stream the rest.
      setPendingQuestions(prefetchedQuestions);
      setLoading(false);

      const total = prefetchedTotal;
      const startSkip = prefetchedQuestions!.length;
      setStreamProgress({ loaded: startSkip, total });

      if (total > startSkip) {
        // Reuse the existing controller (still valid) for continuation
        const controller = streamAbortRef.current ?? new AbortController();
        if (!streamAbortRef.current) streamAbortRef.current = controller;
        streamRemainingBatches(chapterId, examBoard, startSkip, total, appendStreamedBatch, controller.signal)
          .finally(() => setStreamProgress(null));
      } else {
        setStreamProgress(null);
      }
      return;
    }

    // Cache miss — abort any old stream and start fresh.
    streamAbortRef.current?.abort();
    const controller = new AbortController();
    streamAbortRef.current = controller;

    fetchBatch(chapterId, examBoard, 0, 50, controller.signal)
      .then(({ questions, total }) => {
        if (controller.signal.aborted) return;
        setPendingQuestions(questions);
        setLoading(false);
        setStreamProgress({ loaded: questions.length, total });
        // Continue streaming the rest in the background
        if (total > questions.length) {
          streamRemainingBatches(chapterId, examBoard, questions.length, total, appendStreamedBatch, controller.signal)
            .finally(() => setStreamProgress(null));
        } else {
          setStreamProgress(null);
        }
      })
      .catch(err => {
        if ((err as Error)?.name === 'AbortError') return;
        notify('Failed to load questions. Please try again.');
        setActiveView('wizard');
        setPendingView(null);
        setLoading(false);
        setStreamProgress(null);
      });
  };

  // Launch Quick Revision — star questions are a small subset (~30–50 per chapter),
  // so a single fetch is fine. No streaming needed.
  const handleQuickRevisionLaunch = () => {
    if (!selectedChapterId || loading) return;
    setLoading(true);
    setShlokaExited(false);
    setOpenModeSheet(false);
    setActiveView('shloka');
    setPendingView('browse');
    transitionedRef.current = false;

    streamAbortRef.current?.abort();

    fetchQuestions([selectedChapterId], 500, true, selectedExam ?? undefined)
      .then(qs => {
        setPendingQuestions(qs);
        setLoading(false);
      })
      .catch(() => {
        notify('Failed to load questions. Please try again.');
        setActiveView('wizard');
        setPendingView(null);
        setLoading(false);
      });
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
      // Step 1: Fetch questions for the selected chapter, scoped by exam board
      const params = new URLSearchParams();
      params.set('chapter_id', selectedChapterId);
      params.set('limit', '500');
      if (useStarOnly) params.set('is_top_pyq', 'true');
      if (selectedExam) params.set('examBoard', selectedExam);

      const questionsRes = await fetch(`/api/v2/questions?${params.toString()}`);
      const questionsJson = await questionsRes.json();
      const fetchedQuestions: Question[] = (questionsJson.data || []).map((q: ApiQuestion): Question => ({
        id: q._id,
        display_id: q.display_id || q._id?.slice(0, 8)?.toUpperCase() || 'Q',
        question_text: { markdown: q.question_text?.markdown || '' },
        type: (q.type as 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX') || 'SCQ',
        options: (q.options as Array<{ id: string; text: string; is_correct: boolean }> | undefined) || [],
        answer: (q.answer as { integer_value?: number; correct_option?: string } | undefined) || {},
        solution: {
          text_markdown: q.solution?.text_markdown || '',
          video_url: q.solution?.video_url || undefined,
          asset_ids: (q.solution?.asset_ids as { audio?: string[] } | undefined) || undefined,
          latex_validated: q.solution?.latex_validated || false,
        },
        metadata: {
          difficultyLevel: ((q.metadata?.difficultyLevel || 3) as 1 | 2 | 3 | 4 | 5),
          chapter_id: q.metadata?.chapter_id || '',
          subject: 'chemistry',
          tags: ((q.metadata?.tags as Array<{ tag_id: string; weight: number }>) || []),
          is_pyq: q.metadata?.is_pyq || false,
          is_top_pyq: q.metadata?.is_top_pyq || false,
          exam_source: (q.metadata?.exam_source as Record<string, unknown> | undefined),
        },
        svg_scales: q.svg_scales || {},
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
    // Abort any in-flight streaming so we don't keep paying for batches the user no longer needs
    streamAbortRef.current?.abort();
    streamAbortRef.current = null;
    transitionedRef.current = false;
    inFlightSolutionsRef.current.clear();
    setStreamProgress(null);
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
  if (activeView === 'browse') return (
    <>
      <BrowseView questions={questions} chapters={chapters} onBack={handleBackToWizard} chapterId={selectedChapterId ?? undefined} examBoard={selectedExam ?? undefined} onLoadSolutionsForPage={loadSolutionsForPage} />
      {streamProgress && streamProgress.loaded < streamProgress.total && (
        <div
          aria-live="polite"
          style={{
            position: 'fixed', bottom: 16, right: 16, zIndex: 100,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            background: 'rgba(15,17,26,0.92)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 999,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            fontSize: 12,
            color: 'rgba(165,180,252,0.95)',
            fontWeight: 500,
            animation: 'fadeUp 0.3s ease-out',
          }}
        >
          <span
            style={{
              display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
              border: '1.5px solid rgba(99,102,241,0.4)',
              borderTopColor: '#818cf8',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>Loading <span style={{ fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{streamProgress.loaded}</span> of {streamProgress.total} questions…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
  if (activeView === 'test') return <TestView questions={testQuestions} onBack={handleBackToWizard} />;
  if (activeView === 'guided') return <GuidedPracticeWizard chapters={chapters} onBack={handleBackToWizard} preSelectedChapterId={selectedChapterId ?? undefined} preSelectedDifficulty={guidedDifficulty} preSelectedSessionLength={sessionLength} />;

  // Chapter list data (kept for any legacy references)
  const classChapters = chapters.filter(ch => ch.class_level === (classTab === 'all' ? ch.class_level : classTab));
  const grouped: Record<string, Chapter[]> = {};
  classChapters.forEach(ch => { const cat = ch.category ?? 'Physical'; (grouped[cat] = grouped[cat] || []).push(ch); });

  // Meta line for guided practice
  const metaLine = `${chapterQCount} questions · ${selectedChapter?.name ?? '—'} · ${guidedDifficulty} · ${sessionLength}Q`;

  // Subject list for the horizontal tab row
  const subjectList = selectedExam === 'JEE'
    ? [
        { id: 'Chemistry' as SubjectType, emoji: '⚗️', color: '#38bdf8', available: true },
        { id: 'Physics' as SubjectType, emoji: '⚡', color: '#a78bfa', available: false },
        { id: 'Maths' as SubjectType, emoji: '∑', color: '#f97316', available: false },
      ]
    : [
        { id: 'Chemistry' as SubjectType, emoji: '⚗️', color: '#38bdf8', available: true },
        { id: 'Biology' as SubjectType, emoji: '🧬', color: '#34d399', available: false },
        { id: 'Physics' as SubjectType, emoji: '⚡', color: '#a78bfa', available: false },
      ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
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
              <Link href="/"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(203,213,225,0.8)', fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s ease' }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} /> Home
              </Link>
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, color: 'rgba(16,185,129,0.9)', fontWeight: 500 }}>Live</span>
                </div>
              )}
              {userEmail && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowProfileMenu(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '5px 10px', borderRadius: 8,
                      background: showProfileMenu ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                      border: `1px solid ${showProfileMenu ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.2)'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!showProfileMenu) { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; } }}
                    onMouseLeave={e => { if (!showProfileMenu) { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; } }}
                  >
                    <UserCircle style={{ width: 13, height: 13, color: 'rgba(165,180,252,0.9)', flexShrink: 0 }} />
                    {!isMobile && (
                      <span style={{ fontSize: 11, color: 'rgba(165,180,252,0.9)', fontWeight: 500, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {userEmail}
                      </span>
                    )}
                    <ChevronDown style={{ width: 11, height: 11, color: 'rgba(165,180,252,0.6)', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>

                  {/* Profile dropdown */}
                  {showProfileMenu && (
                    <>
                      {/* Click-away backdrop */}
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
                        background: 'rgba(10,12,20,0.98)', border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 12, padding: '8px', minWidth: 200,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                      }}>
                        {/* User info */}
                        <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 6 }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Signed in as</div>
                          <div style={{ fontSize: 12, color: 'rgba(165,180,252,0.9)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                          {selectedExam && (
                            <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 6, background: selectedExam === 'NEET' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)', border: `1px solid ${selectedExam === 'NEET' ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}` }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: selectedExam === 'NEET' ? '#34d399' : '#a5b4fc' }}>{selectedExam}</span>
                            </div>
                          )}
                        </div>

                        {/* Change exam */}
                        <button
                          onClick={() => handleChangeExam()}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 10px', borderRadius: 8, border: 'none',
                            background: 'transparent', cursor: 'pointer', textAlign: 'left',
                            color: 'rgba(203,213,225,0.85)', fontSize: 13, fontWeight: 500,
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <LayoutGrid style={{ width: 14, height: 14, color: 'rgba(165,180,252,0.7)', flexShrink: 0 }} />
                          Switch to {selectedExam === 'JEE' ? 'NEET' : 'JEE'}
                        </button>

                        {/* Sign out */}
                        <button
                          onClick={handleSignOut}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 10px', borderRadius: 8, border: 'none',
                            background: 'transparent', cursor: 'pointer', textAlign: 'left',
                            color: 'rgba(248,113,113,0.85)', fontSize: 13, fontWeight: 500,
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <LogOut style={{ width: 14, height: 14, flexShrink: 0 }} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── Main content: wide two-column layout ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 16px 64px' : '20px 40px 72px', position: 'relative', zIndex: 1 }}>

          {/* Top bar: exam selector + subject selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 20px', marginBottom: 20, animation: 'fadeUp 0.4s ease-out' }}>

            {/* Exam segmented control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Exam</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 3, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {(['JEE', 'NEET'] as ExamType[]).map(exam => {
                  const active = selectedExam === exam;
                  const color = exam === 'NEET' ? '#34d399' : '#a5b4fc';
                  return (
                    <button
                      key={exam}
                      onClick={() => handleChangeExam(exam)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 16px', borderRadius: 6, border: 'none', background: active ? 'rgba(255,255,255,0.09)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em', color: active ? color : 'rgba(255,255,255,0.4)' }}>{exam}</span>
                      {active && <Check style={{ width: 11, height: 11, color }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

            {/* Subject tiles */}
            <div style={{ display: 'flex', gap: 7 }}>
              {subjectList.map(subj => (
                <div
                  key={subj.id}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 13px 6px 10px',
                    borderRadius: 6,
                    borderTop: `1px solid ${subj.available ? `${subj.color}38` : 'rgba(255,255,255,0.06)'}`,
                    borderRight: `1px solid ${subj.available ? `${subj.color}38` : 'rgba(255,255,255,0.06)'}`,
                    borderBottom: `1px solid ${subj.available ? `${subj.color}38` : 'rgba(255,255,255,0.06)'}`,
                    borderLeft: `3px solid ${subj.available ? subj.color : 'rgba(255,255,255,0.12)'}`,
                    background: subj.available ? `${subj.color}10` : 'rgba(255,255,255,0.02)',
                    opacity: subj.available ? 1 : 0.42,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', color: subj.available ? subj.color : 'rgba(255,255,255,0.35)' }}>{subj.id}</span>
                  {!subj.available && <Lock style={{ width: 10, height: 10, color: 'rgba(255,255,255,0.2)' }} />}
                </div>
              ))}
            </div>

          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24, alignItems: 'start' }}>

            {/* LEFT: search + class filter + chapter rows */}
            <div>
              {/* Search + class filter row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={chapterSearch}
                    onChange={e => setChapterSearch(e.target.value)}
                    placeholder="Search chapters…"
                    style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fafafa', fontSize: 13, outline: 'none', transition: 'border-color 0.15s' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
                  {(['all', 11, 12] as const).map(c => (
                    <button key={String(c)} onClick={() => setClassTab(c)} style={{ padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: classTab === c ? 'rgba(255,255,255,0.1)' : 'transparent', color: classTab === c ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent' }}>
                      {c === 'all' ? 'All' : `Class ${c}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter rows grouped by category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease-out 0.05s backwards' }}>
                {CAT_ORDER.map(cat => {
                  const list = chapters.filter(ch => {
                    if ((ch.category ?? 'Physical') !== cat) return false;
                    if (classTab !== 'all' && ch.class_level !== classTab) return false;
                    if (chapterSearch && !ch.name.toLowerCase().includes(chapterSearch.toLowerCase())) return false;
                    return true;
                  });
                  if (list.length === 0) return null;
                  const totalQs = list.reduce((s, c) => s + ((selectedExam === 'NEET' ? c.neet_question_count : c.question_count) ?? 0), 0);
                  const accent = CAT_COLOR[cat];
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '0 2px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
                        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent }}>{cat}</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>{totalQs.toLocaleString()} Qs</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 3 }}>
                        {list.map(ch => {
                          const qCount = (selectedExam === 'NEET' ? ch.neet_question_count : ch.question_count) ?? 0;
                          const isSelected = ch.id === selectedChapterId;
                          return (
                            <button
                              key={ch.id}
                              onClick={() => handleChapterSelect(ch.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: `1px solid ${isSelected ? 'rgba(99,102,241,0.3)' : 'transparent'}`, background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent' }}
                              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
                              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'transparent'; } }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{ch.class_level}</span>
                                  <span style={{ fontSize: 14, fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{ch.name}</span>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{qCount > 0 ? qCount : '—'}</span>
                                </div>
                                <ChapterBar value={qCount > 0 ? Math.min(100, Math.round((qCount / 400) * 100)) : 0} color={accent} />
                              </div>
                              <ChevronRight style={{ width: 14, height: 14, color: isSelected ? '#818cf8' : 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {chapters.filter(ch => {
                  if (classTab !== 'all' && ch.class_level !== classTab) return false;
                  if (chapterSearch && !ch.name.toLowerCase().includes(chapterSearch.toLowerCase())) return false;
                  return true;
                }).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No chapters match your search.</div>
                )}
              </div>

              {/* NEET Mock Test card — below chapter list on mobile */}
              {selectedExam === 'NEET' && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ borderRadius: 16, border: '1px solid rgba(217,119,6,0.3)', background: 'linear-gradient(160deg, #1a1200 0%, #120d00 60%, #0f0b00 100%)', overflow: 'hidden', position: 'relative' }}>
                    <svg aria-hidden="true" width="140" height="200" viewBox="0 0 140 200" style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.08, pointerEvents: 'none', overflow: 'visible' }}>
                      <path d="M 45 10 C 25 30, 65 50, 45 70 C 25 90, 65 110, 45 130 C 25 150, 65 170, 45 190" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 95 10 C 115 30, 75 50, 95 70 C 115 90, 75 110, 95 130 C 115 150, 75 170, 95 190" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                      {[30,50,70,90,110,130,150,170].map((y, i) => <line key={y} x1={i%2===0?46:36} y1={y} x2={i%2===0?94:104} y2={y} stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />)}
                    </svg>
                    <div style={{ padding: '22px 20px 20px', position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#d97706', textTransform: 'uppercase', marginBottom: 6 }}>NEET Mock Tests</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#fef3c7', lineHeight: 1.25, marginBottom: 5 }}>Full-Syllabus Practice Tests</div>
                      <div style={{ fontSize: 13, color: 'rgba(254,243,199,0.5)' }}>180 Qs · 200 min · Timed &amp; scored</div>
                      {mockTestSets.length === 0 ? (
                        <div style={{ padding: '18px 0 10px', color: 'rgba(254,243,199,0.3)', fontSize: 13 }}>No mock tests published yet — check back soon.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '16px 0 20px' }}>
                          {mockTestSets.filter(s => s.exam === 'NEET' || s.exam === 'neet' || !s.exam).map(set => (
                            <button key={set._id} onClick={() => { if (!isLoggedIn) { setShowAuthDialog(true); return; } window.location.href = `/the-crucible/mock-test/${set._id}`; }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.07)', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.14)'; e.currentTarget.style.borderColor = 'rgba(217,119,6,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.07)'; e.currentTarget.style.borderColor = 'rgba(217,119,6,0.2)'; }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#fef3c7', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{set.title}</div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                  {set.question_count > 0 && <span style={{ fontSize: 11, color: 'rgba(254,243,199,0.4)' }}>{set.question_count} questions</span>}
                                  {set.duration_minutes > 0 && <span style={{ fontSize: 11, color: 'rgba(254,243,199,0.4)' }}>{set.duration_minutes} min</span>}
                                </div>
                              </div>
                              <ChevronRight style={{ width: 15, height: 15, color: 'rgba(254,243,199,0.3)', flexShrink: 0 }} />
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => { const s = mockTestSets.filter(s => s.exam === 'NEET' || s.exam === 'neet' || !s.exam); if (s.length === 0) return; if (!isLoggedIn) { setShowAuthDialog(true); return; } window.location.href = `/the-crucible/mock-test/${s[0]._id}`; }} style={{ width: '100%', padding: '13px 0', background: '#d97706', color: '#000', fontSize: 15, fontWeight: 700, borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'background 0.15s', WebkitTapHighlightColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = '#b45309'; }} onMouseLeave={e => { e.currentTarget.style.background = '#d97706'; }}>
                        {mockTestSets.filter(s => s.exam === 'NEET' || s.exam === 'neet' || !s.exam).length === 0 ? 'Coming Soon' : 'Start Test →'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: sticky sidebar — desktop only */}
            {!isMobile && (
              <aside style={{ position: 'sticky', top: 72, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => setShowProgress(true)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <BarChart2 style={{ width: 16, height: 16, color: '#a5b4fc', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fafafa' }}>View Progress</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Stats, streaks &amp; history</div>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                </button>

                <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 12 }}>HOW IT WORKS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { dot: CAT_COLOR.Physical, text: 'Pick any chapter from the list' },
                      { dot: '#f97316', text: 'Choose your mode — Browse, Test, or Guided' },
                      { dot: CAT_COLOR.Inorganic, text: 'Practice and track your improvement' },
                    ].map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, marginTop: 5, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedExam === 'NEET' && mockTestSets.filter(s => s.exam === 'NEET' || s.exam === 'neet' || !s.exam).length > 0 && (
                  <div style={{ padding: 16, borderRadius: 12, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#d97706', textTransform: 'uppercase', marginBottom: 8 }}>NEET MOCK TESTS</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fef3c7', marginBottom: 4 }}>Full-Syllabus Tests</div>
                    <div style={{ fontSize: 12, color: 'rgba(254,243,199,0.45)', marginBottom: 12 }}>180 Qs · 200 min · scored</div>
                    <button onClick={() => { const s = mockTestSets.filter(s => s.exam === 'NEET' || s.exam === 'neet' || !s.exam); if (!isLoggedIn) { setShowAuthDialog(true); return; } window.location.href = `/the-crucible/mock-test/${s[0]._id}`; }} style={{ width: '100%', padding: '10px 0', background: '#d97706', color: '#000', fontSize: 13, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#b45309'; }} onMouseLeave={e => { e.currentTarget.style.background = '#d97706'; }}>
                      Start Test →
                    </button>
                  </div>
                )}
              </aside>
            )}
          </div>

        </div>

        {/* ── Mode picker bottom sheet ────────────────────────────────────────── */}
        {openModeSheet && selectedChapterId && (
          <div
            onClick={() => setOpenModeSheet(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', animation: 'fadeIn 120ms ease-out' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 680, background: '#0d0f1a', borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 0 0', padding: isMobile ? '20px 20px 36px' : '24px 32px 40px', animation: 'slideUp 200ms ease-out', maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Handle */}
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />

              {/* Chapter info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ minWidth: 0, paddingRight: 16 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Chapter · Class {selectedChapter?.class_level}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 4, lineHeight: 1.2 }}>{selectedChapter?.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                    {chapterQCount > 0 ? `${chapterQCount} questions` : 'Loading…'} · {selectedExam}
                  </div>
                </div>
                <button onClick={() => setOpenModeSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>

              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>How do you want to practice?</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* A. Free Browse */}
                <button onClick={handleBrowseLaunch} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.04)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: '#38bdf8', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fafafa', marginBottom: 3 }}>Free Browse</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      {chapterStats === null ? (
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Loading…</span>
                      ) : (selectedExam === 'NEET'
                        ? [[String(chapterStats.total), 'total'], [String(chapterStats.neetPyq ?? 0), 'PYQ'], [String(chapterStats.nonPyq), 'new']]
                        : [[String(chapterStats.total), 'total'], [String(chapterStats.jeeMain), 'Main'], [String(chapterStats.jeeAdv), 'Adv']]
                      ).map(([val, lbl]) => (
                        <span key={lbl} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                          <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>{val}</span> {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                </button>

                {/* B. Quick Revision (conditional) */}
                {chapterStarCount >= 20 && (
                  <button onClick={handleQuickRevisionLaunch} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.04)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 3, height: 36, borderRadius: 2, background: '#fbbf24', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fafafa', marginBottom: 3 }}>Quick Revision</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{chapterStarCount} hand-picked must-solve questions</div>
                    </div>
                    <ChevronRight style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  </button>
                )}

                {/* C. Timed Test */}
                <button onClick={handleTestLaunch} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.04)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: '#f97316', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fafafa', marginBottom: 3 }}>Timed Test</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Simulate exam conditions · speed &amp; accuracy</div>
                  </div>
                  <ChevronRight style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                </button>

                {/* D. Guided Practice */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 2 }}>
                  <button onClick={() => setGuidedExpanded(!guidedExpanded)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px', borderRadius: 0, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 3, height: 36, borderRadius: 2, background: '#818cf8', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#fafafa' }}>Guided Practice</span>
                        <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 3, background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.05em', border: '1px solid rgba(251,191,36,0.2)' }}>BETA</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(165,180,252,0.6)' }}>Adaptive · GOC only right now</div>
                    </div>
                    <ChevronDown style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.25)', transform: guidedExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: `transform ${COLLAPSE_TRANSITION}`, flexShrink: 0 }} />
                  </button>
                  {guidedExpanded && (
                    <div style={{ padding: '4px 4px 8px' }}>
                      {selectedChapterId !== 'ch12_goc' && (
                        <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', marginBottom: 2 }}>Coming Soon for {selectedChapter?.name}</div>
                          <div style={{ fontSize: 12, color: 'rgba(251,191,36,0.7)', lineHeight: 1.5 }}>Guided Practice needs micro-concept tagging — currently live for <strong style={{ color: '#fbbf24' }}>GOC</strong> only.</div>
                        </div>
                      )}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Difficulty</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(['Easy', 'Medium', 'Hard', 'Mixed'] as GuidedDifficulty[]).map(d => {
                            const sel = guidedDifficulty === d;
                            const color = d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : d === 'Hard' ? '#f87171' : '#a78bfa';
                            return <button key={d} onClick={() => setGuidedDifficulty(d)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${sel ? color + '55' : 'rgba(255,255,255,0.07)'}`, background: sel ? color + '12' : 'transparent', color: sel ? color : 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: sel ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent' }}>{d}</button>;
                          })}
                        </div>
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Session Length</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                          {[{ val: 10, label: 'Quick', time: '~12 min' }, { val: 20, label: 'Standard', time: '~25 min' }, { val: 30, label: 'Deep', time: '~40 min' }].map(opt => {
                            const sel = sessionLength === opt.val;
                            return <button key={opt.val} onClick={() => setSessionLength(opt.val)} style={{ padding: '12px 8px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', border: `1.5px solid ${sel ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`, background: sel ? 'rgba(99,102,241,0.09)' : 'rgba(255,255,255,0.02)', textAlign: 'center', WebkitTapHighlightColor: 'transparent' }}><div style={{ fontSize: 22, fontWeight: 800, color: sel ? '#a5b4fc' : 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{opt.val}</div><div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#a5b4fc' : 'rgba(255,255,255,0.35)', marginBottom: 1 }}>{opt.label}</div><div style={{ fontSize: 11, color: sel ? 'rgba(165,180,252,0.55)' : 'rgba(255,255,255,0.2)' }}>{opt.time}</div></button>;
                          })}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>{metaLine}</div>
                      <button onClick={selectedChapterId === 'ch12_goc' ? handleGuidedLaunch : undefined} disabled={selectedChapterId !== 'ch12_goc'} style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: selectedChapterId === 'ch12_goc' ? '#4f46e5' : 'rgba(255,255,255,0.04)', color: selectedChapterId === 'ch12_goc' ? '#fff' : 'rgba(255,255,255,0.25)', fontSize: 15, fontWeight: 700, cursor: selectedChapterId === 'ch12_goc' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', WebkitTapHighlightColor: 'transparent', opacity: selectedChapterId === 'ch12_goc' ? 1 : 0.5 }} onMouseEnter={e => { if (selectedChapterId === 'ch12_goc') e.currentTarget.style.background = '#4338ca'; }} onMouseLeave={e => { if (selectedChapterId === 'ch12_goc') e.currentTarget.style.background = '#4f46e5'; }}>
                        {selectedChapterId === 'ch12_goc' ? <><span>Begin Session</span><ChevronRight style={{ width: 16, height: 16 }} /></> : <span>Available for GOC Only</span>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Panel (slide-over) */}
        <ProgressPanel
          isOpen={showProgress}
          onClose={() => setShowProgress(false)}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          selectedExam={selectedExam}
          onChangeExam={handleChangeExam}
          onSignOut={handleSignOut}
        />

        {/* Auth Required Dialog */}
        {showAuthDialog && <AuthRequiredDialog onClose={() => setShowAuthDialog(false)} />}

        {/* Test Config Modal */}
        {showTestConfig && (
          <TestConfigModal
            maxQ={chapterQCount}
            starQuestionCount={chapterStarCount}
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
