"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, BarChart2 } from 'lucide-react';
import { Chapter, Question } from './types';
import WizardStepIndicator from './WizardStepIndicator';
import StepModeSelect from './StepModeSelect';
import StepChapterSelect from './StepChapterSelect';
import StepConfirmLaunch, { DifficultyMix } from './StepConfirmLaunch';
import ProgressPanel from './ProgressPanel';
import BrowseView from './BrowseView';
import TestView from './TestView';
import AuthRequiredDialog from './AuthRequiredDialog';

type WizardStep = 1 | 2 | 3;
type ActiveView = 'wizard' | 'shloka' | 'browse' | 'test';

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
  return pool.slice(0, count);
}

// ── Main Wizard Component ────────────────────────────────────────────────────
interface CrucibleWizardProps {
  chapters: Chapter[];
  isLoggedIn: boolean;
}

export default function CrucibleWizard({ chapters, isLoggedIn }: CrucibleWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [mode, setMode] = useState<'browse' | 'test' | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [jeeMode, setJeeMode] = useState<'mains' | 'advanced'>('mains');
  const [topPYQFilter, setTopPYQFilter] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('wizard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingView, setPendingView] = useState<'browse' | 'test' | null>(null);
  // Two-flag handshake: only transition to browse/test when BOTH the shloka has
  // exited AND the questions fetch has completed. Without this, TestView mounts
  // with questions=[] → seconds=0 → instant auto-submission (race condition).
  const [shlokaExited, setShlokaExited] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<Question[] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Coordinate the two async "ready" signals:
  // 1. Shloka has played (setShlokaExited)
  // 2. Questions have been fetched (setPendingQuestions)
  // Only when both are true do we switch to the final view.
  useEffect(() => {
    if (shlokaExited && pendingQuestions !== null && pendingView) {
      setQuestions(pendingQuestions);
      setActiveView(pendingView);
      // Reset for next session
      setPendingView(null);
      setPendingQuestions(null);
      setShlokaExited(false);
    }
  }, [shlokaExited, pendingQuestions, pendingView]);

  const onShlokaDone = useCallback(() => {
    setShlokaExited(true);
  }, []);

  // Step 1: Mode selection
  const handleModeSelect = (m: 'browse' | 'test') => {
    setMode(m);
    setStep(2);
  };

  // Top PYQ shortcut — skip chapter selection
  const handleTopPYQ = () => {
    setLoading(true);
    setPendingView('browse');
    setShlokaExited(false);
    setPendingQuestions(null);
    setActiveView('shloka');
    fetchTopPYQs()
      .then(qs => {
        if (qs.length === 0) { notify('Top PYQs not tagged yet — check back soon!'); setActiveView('wizard'); return; }
        setPendingQuestions(qs); // signal questions ready; shloka flag will complete the handshake
      })
      .catch(() => { notify('Failed to load Top PYQs.'); setActiveView('wizard'); })
      .finally(() => setLoading(false));
  };

  // Step 2: Chapter selection helpers
  const toggle = (id: string) => setSelectedChapters(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAllClass = (lvl: number) => { setSelectedChapters(prev => { const n = new Set(prev); chapters.filter(ch => ch.class_level === lvl).forEach(c => n.add(c.id)); return n; }); };
  const clearClass = (lvl: number) => { const ids = new Set(chapters.filter(ch => ch.class_level === lvl).map(c => c.id)); setSelectedChapters(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n; }); };
  const clearAll = () => setSelectedChapters(new Set());

  // Step 3: Launch
  const handleLaunch = (count?: number, mix?: DifficultyMix) => {
    if (loading) return;
    setLoading(true);
    // Reset the two-flag handshake for this new session
    setShlokaExited(false);
    setPendingQuestions(null);

    const chapterIds = Array.from(selectedChapters);

    if (mode === 'browse') {
      setPendingView('browse');
      setActiveView('shloka');
      fetchQuestions(chapterIds, undefined, topPYQFilter)
        .then(qs => {
          if (qs.length === 0) {
            notify(topPYQFilter ? 'No Top PYQs found for selected chapters yet.' : 'No questions found for selected chapters yet.');
            setActiveView('wizard');
            return;
          }
          setPendingQuestions(qs); // will activate view once shloka exits too
        })
        .catch(() => { notify('Failed to load questions.'); setActiveView('wizard'); })
        .finally(() => setLoading(false));
    } else {
      setPendingView('test');
      setActiveView('shloka');
      fetchQuestions(chapterIds, undefined, topPYQFilter)
        .then(qs => {
          if (qs.length === 0) { notify('No questions found.'); setActiveView('wizard'); return; }
          const effectiveMix = topPYQFilter ? 'pyq' : mix;
          const selected = selectTestQuestions(qs, count || 20, (effectiveMix || 'balanced') as DifficultyMix);
          setPendingQuestions(selected); // will activate view once shloka exits too
        })
        .catch(() => { notify('Failed to load questions.'); setActiveView('wizard'); })
        .finally(() => setLoading(false));
    }
  };

  const handleBackToWizard = () => {
    setActiveView('wizard');
    // Don't reset wizard state so user can re-launch with different settings
  };

  if (!mounted) return (
    <div style={{ minHeight: '100vh', background: '#080a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // View routing
  if (activeView === 'shloka') return <ShlokaScreen onDone={onShlokaDone} />;
  if (activeView === 'browse') return <BrowseView questions={questions} chapters={chapters} onBack={handleBackToWizard} />;
  if (activeView === 'test') return <TestView questions={questions} onBack={handleBackToWizard} />;

  // Wizard UI
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', position: 'relative', overflow: 'hidden' }}>
        {/* Background gradient glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(59,130,246,0.06), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'rgba(59,130,246,0.08)', filter: 'blur(140px)', borderRadius: '50%' }} />
        </div>

        {/* NAV */}
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(5,5,5,0.8)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '12px 20px' : '16px 40px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* Crucible icon */}
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
              {/* My Progress button */}
              <button
                onClick={() => setShowProgress(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(147,197,253,0.9)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <BarChart2 style={{ width: 14, height: 14 }} /> {isMobile ? '' : 'Progress'}
              </button>
              {/* Home link */}
              <a
                href="/"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(203,213,225,0.8)',
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}>
                <ChevronLeft style={{ width: 14, height: 14 }} /> Home
              </a>
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, color: 'rgba(16,185,129,0.9)', fontWeight: 500 }}>Live</span>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? '20px 24px 48px' : '32px 40px 72px', position: 'relative', zIndex: 1 }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 24, animation: 'fadeUp 0.5s ease-out' }}>
            <h1 style={{
              margin: '0 0 10px',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              fontSize: isMobile ? 28 : 42,
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 6px 24px rgba(0,0,0,0.45)',
            }}>
              <span style={{
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(147,197,253,0.82) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Master Chemistry,
              </span>
              <br />
              <span style={{
                fontSize: isMobile ? 18 : 26,
                fontWeight: 600,
                color: 'rgba(226,232,240,0.9)',
                letterSpacing: '-0.02em',
              }}>
                one question at a time.
              </span>
            </h1>
            <p style={{
              fontSize: 14,
              color: 'rgba(148,163,184,0.85)',
              fontWeight: 400,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.65,
            }}>
              Practice chapter-wise questions, measure accuracy, and build confidence.
            </p>
          </div>

          {/* Step indicator */}
          <WizardStepIndicator currentStep={step} mode={mode} />

          {/* Step content */}
          <div style={{ marginTop: 16 }}>
            {step === 1 && (
              <StepModeSelect
                onSelectMode={handleModeSelect}
                onTopPYQ={handleTopPYQ}
                isLoggedIn={isLoggedIn}
                onAuthRequired={() => setShowAuthDialog(true)}
              />
            )}

            {step === 2 && mode && (
              <StepChapterSelect
                chapters={chapters}
                selectedChapters={selectedChapters}
                onToggle={toggle}
                onSelectAllClass={selectAllClass}
                onClearClass={clearClass}
                onClearAll={clearAll}
                onContinue={() => setStep(3)}
                mode={mode}
                jeeMode={jeeMode}
                onJeeModeChange={setJeeMode}
                topPYQFilter={topPYQFilter}
                onTopPYQFilterChange={setTopPYQFilter}
                onBack={() => { setStep(1); setMode(null); }}
              />
            )}

            {step === 3 && mode && (
              <StepConfirmLaunch
                mode={mode}
                chapters={chapters}
                selectedChapters={selectedChapters}
                jeeMode={jeeMode}
                onLaunch={handleLaunch}
                onBack={() => setStep(2)}
                loading={loading}
              />
            )}
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

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: 'rgba(30,32,44,0.97)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '10px 18px',
            fontSize: 13,
            color: '#fff',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
