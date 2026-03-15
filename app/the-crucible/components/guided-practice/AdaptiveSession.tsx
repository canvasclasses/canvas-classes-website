"use client";

// ADAPTIVE ENGINE: Main session orchestrator. Replaces the old 10-question batch feed.
// Manages three phases: diagnostic → practice → complete.
// Calls adaptiveEngine.getNextQuestion() after every MicroFeedback to pick the next Q.

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { Question, Chapter } from '@/app/the-crucible/components/types';
import AdaptiveQuestionCard from './AdaptiveQuestionCard';
import DiagnosticWarmup from './DiagnosticWarmup';
import MicroFeedback from './MicroFeedback';
import StuckPointPrompt from './StuckPointPrompt';
import TransparencyBar from './TransparencyBar';
import SessionSummary from './SessionSummary';
import {
  getNextQuestion,
  buildInitialProfileFromBaseline,
  updateConceptLevel,
  type MicroFeedback as MicroFeedbackData,
  type ConceptBaseline,
  type UserConceptProfile,
  type MicroFeedbackResponse,
  type NextQuestionDecision,
  type AdaptiveEngineInputV2,
} from '@/lib/adaptiveEngine';
import type { IStudentChapterProfile } from '@/lib/models/StudentChapterProfile';
import {
  SESSION_PHASE_DIAGNOSTIC,
  SESSION_PHASE_PRACTICE,
  SESSION_PHASE_COMPLETE,
  SESSION_MAX_QUESTIONS,
} from '@/constants/adaptivePractice';
import type { StuckPoint } from '@/lib/models/StudentResponse';

// ── Types ────────────────────────────────────────────────────────────────────

type SessionPhase =
  | typeof SESSION_PHASE_DIAGNOSTIC
  | typeof SESSION_PHASE_PRACTICE
  | typeof SESSION_PHASE_COMPLETE;

interface AdaptiveSessionProps {
  chapter: { id: string; name: string };
  chapters: Chapter[];
  allQuestions: Question[];                // full pool for this chapter
  initialDifficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  conceptTagFilter: Set<string>;
  pyqOnly: boolean;
  sessionMaxQuestions: number;             // from SessionSetupScreen (10/20/30)
  priorityQuestionIds?: string[];          // wrong Qs from previous session — served first
  onBack: () => void;
  onReviewMistakes: (wrongIds: string[]) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function selectDiagnosticQuestions(
  pool: Question[],
  count: number
): Question[] {
  // Shuffle Easy questions first to avoid always getting the same warm-up set
  const easy = pool.filter(q => q.metadata.difficulty === 'Easy');
  const shuffled = [...easy].sort(() => Math.random() - 0.5);
  
  // One Easy question per distinct concept tag, up to count
  const seen = new Set<string>();
  const result: Question[] = [];
  for (const q of shuffled) {
    const tag = q.metadata.tags?.[0]?.tag_id ?? q.metadata.chapter_id;
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(q);
    }
    if (result.length >= count) break;
  }
  // Pad with any shuffled easy questions if not enough concept variety
  if (result.length < count) {
    for (const q of shuffled) {
      if (!result.includes(q)) result.push(q);
      if (result.length >= count) break;
    }
  }
  return result;
}

function applyConceptFilter(pool: Question[], tags: Set<string>): Question[] {
  if (tags.size === 0) return pool;
  return pool.filter(q => q.metadata.tags?.some(t => tags.has(t.tag_id)));
}

function applyDifficultyFilter(pool: Question[], diff: string): Question[] {
  if (diff === 'Mixed') return pool;
  return pool.filter(q => q.metadata.difficulty === diff);
}

// ── Context Banner — shown above the next question based on last feedback ────
const CONTEXT_MESSAGES: Record<MicroFeedbackResponse, { text: string; color: string; bg: string; border: string }> = {
  too_hard: { text: "Let's reinforce this concept with a simpler approach.", color: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.18)' },
  got_it:   { text: 'Nice — adapting based on your responses.', color: '#2dd4bf', bg: 'rgba(45,212,191,0.06)', border: 'rgba(45,212,191,0.18)' },
  too_easy: { text: "Stepping it up — here's a different angle.", color: '#a78bfa', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.18)' },
};

function ContextBanner({ response }: { response: MicroFeedbackResponse }) {
  const msg = CONTEXT_MESSAGES[response];
  return (
    <div style={{
      maxWidth: 900, margin: '0 auto', padding: '0 20px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', borderRadius: 10,
        background: msg.bg, border: `1px solid ${msg.border}`,
        fontSize: 13, fontWeight: 600, color: msg.color,
        animation: 'fadeUp 0.3s ease-out',
      }}>
        <span style={{ fontSize: 15 }}>
          {response === 'too_hard' ? '🔄' : response === 'too_easy' ? '🚀' : '✓'}
        </span>
        {msg.text}
      </div>
      <style>{`@keyframes fadeUp{from{transform:translateY(6px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdaptiveSession({
  chapter,
  chapters,
  allQuestions,
  initialDifficulty,
  conceptTagFilter,
  pyqOnly,
  sessionMaxQuestions,
  priorityQuestionIds = [],
  onBack,
  onReviewMistakes,
}: AdaptiveSessionProps) {
  const [phase, setPhase] = useState<SessionPhase>(SESSION_PHASE_DIAGNOSTIC);
  const [conceptBaseline, setConceptBaseline] = useState<ConceptBaseline[]>([]);
  const [userProfile, setUserProfile] = useState<UserConceptProfile>({});
  const [feedbackHistory, setFeedbackHistory] = useState<MicroFeedbackData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [lastDecision, setLastDecision] = useState<NextQuestionDecision | null>(null);
  const [showMicroFeedback, setShowMicroFeedback] = useState(false);
  const [pendingFeedbackQ, setPendingFeedbackQ] = useState<Question | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [questionNumber, setQuestionNumber] = useState(0);
  const [lastFeedbackResponse, setLastFeedbackResponse] = useState<MicroFeedbackResponse | null>(null);
  const [showStuckPoint, setShowStuckPoint] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const viewedSolutionRef = useRef<boolean>(false);
  const pendingAnswerRef = useRef<{
    q: Question; correct: boolean; timeMs: number; viewedSol: boolean;
  } | null>(null);
  const pendingMicroFeedbackRef = useRef<MicroFeedbackResponse | null>(null);
  const sessionIdRef = useRef<string>('');
  const [chapterProfile, setChapterProfile] = useState<IStudentChapterProfile | null>(null);

  // Generate a unique session ID on mount + load chapter profile
  useEffect(() => {
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    // Load chapter profile from DB (best-effort)
    fetch(`/api/v2/user/chapter-profile?chapterId=${encodeURIComponent(chapter.id)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.profile) setChapterProfile(data.profile);
      })
      .catch(() => { /* profile unavailable — V2 engine will fallback to V1 */ });
  }, [chapter.id]);

  // Full pool for diagnostic — memoized to avoid stale closure in useCallback
  const basePool = useMemo(() => {
    let pool = allQuestions;
    if (pyqOnly) pool = pool.filter(q => q.metadata.is_pyq);
    pool = applyConceptFilter(pool, conceptTagFilter);
    return pool;
  }, [allQuestions, pyqOnly, conceptTagFilter]);

  // Practice pool: also apply difficulty bias if not Mixed — memoized
  // Priority questions (wrong from previous session) are placed first so the engine sees them first
  const filteredPool = useMemo(() => {
    let pool = initialDifficulty === 'Mixed'
      ? basePool
      : (() => { const pref = basePool.filter(q => q.metadata.difficulty === initialDifficulty); return pref.length >= 5 ? pref : basePool; })();
    if (priorityQuestionIds.length > 0) {
      const prioSet = new Set(priorityQuestionIds);
      const prio = pool.filter(q => prioSet.has(q.id));
      const rest = pool.filter(q => !prioSet.has(q.id));
      pool = [...prio, ...rest];
    }
    return pool;
  }, [basePool, initialDifficulty, priorityQuestionIds]);

  // Diagnostic questions — always from basePool to ensure Easy questions exist — memoized
  const diagnosticQuestions = useMemo(() => selectDiagnosticQuestions(basePool, 5), [basePool]);

  // ── Diagnostic complete ─────────────────────────────────────────────────────
  const handleDiagnosticComplete = useCallback((baseline: ConceptBaseline[]) => {
    const initialProfile = buildInitialProfileFromBaseline(baseline);
    const diagnosticSeenIds = new Set(diagnosticQuestions.map(q => q.id));

    setConceptBaseline(baseline);
    setUserProfile(initialProfile);
    setSeenIds(diagnosticSeenIds);

    // Pick first practice question — start at user's chosen difficulty
    const decision = getNextQuestion({
      chapter,
      sessionHistory: [],
      conceptBaseline: baseline,
      availableQuestions: filteredPool,
      userGlobalProfile: initialProfile,
      seenQuestionIds: diagnosticSeenIds,
      sessionMaxQuestions,
      initialDifficulty: initialDifficulty === 'Mixed' ? undefined : initialDifficulty,
      chapterProfile,
    } as AdaptiveEngineInputV2);

    if (!decision) {
      // No questions available after diagnostic → go straight to summary
      setPhase(SESSION_PHASE_COMPLETE);
      return;
    }

    setCurrentQuestion(decision.question);
    setLastDecision(decision);
    setSeenIds(prev => new Set([...prev, decision.question.id]));
    setQuestionNumber(1);
    setPhase(SESSION_PHASE_PRACTICE);
    questionStartTimeRef.current = Date.now();
    viewedSolutionRef.current = false;
  }, [chapter, filteredPool, diagnosticQuestions, sessionMaxQuestions, initialDifficulty]);

  // ── Answer tracked (BrowseView callback) ────────────────────────────────────
  const handleQuestionAnswered = useCallback((isCorrect: boolean) => {
    if (!currentQuestion) return;
    // Show micro-feedback after answer
    setPendingFeedbackQ(currentQuestion);
    setShowMicroFeedback(true);
    // Store for feedback processing — we don't have response yet
    // Will be completed in handleMicroFeedback
    // Store temp ref values now before they reset
    const q = currentQuestion;
    const correct = isCorrect;
    const timeMs = Date.now() - questionStartTimeRef.current;
    const viewedSol = viewedSolutionRef.current;
    // Store metadata in ref so handleMicroFeedback can read it
    pendingAnswerRef.current = { q, correct, timeMs, viewedSol };
  }, [currentQuestion]);

  // ── Write StudentResponse to API (fire-and-forget) ─────────────────────────
  const writeResponseToAPI = useCallback((meta: {
    q: Question; correct: boolean; timeMs: number; viewedSol: boolean;
  }, response: MicroFeedbackResponse, stuckPoint: StuckPoint | null) => {
    const totalServed = feedbackHistory.length + conceptBaseline.length + 1;
    const payload = {
      sessionId: sessionIdRef.current,
      questionId: meta.q.id,
      chapterId: chapter.id,
      primaryConcept: meta.q.metadata.tags?.[0]?.tag_id ?? '',
      microConcept: meta.q.metadata.microConcept ?? '',
      cognitiveType: meta.q.metadata.cognitiveType ?? '',
      calcLoad: meta.q.metadata.calcLoad ?? '',
      entryPoint: meta.q.metadata.entryPoint ?? '',
      answeredCorrectly: meta.correct,
      timeSpentMs: meta.timeMs,
      viewedSolutionBeforeAnswer: meta.viewedSol,
      microFeedback: response,
      stuckPoint,
      sessionPhase: phase === SESSION_PHASE_DIAGNOSTIC ? 'diagnostic' : 'practice',
      positionInSession: totalServed,
    };
    fetch('/api/v2/user/session-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => { /* best-effort */ });
  }, [feedbackHistory.length, conceptBaseline.length, phase]);

  // ── Core: process feedback + advance to next question ─────────────────────────
  const advanceAfterFeedback = useCallback((response: MicroFeedbackResponse, stuckPoint: StuckPoint | null) => {
    const meta = pendingAnswerRef.current;
    if (!meta) return;
    pendingAnswerRef.current = null;
    pendingMicroFeedbackRef.current = null;

    // Write per-question response to new API
    writeResponseToAPI(meta, response, stuckPoint);

    const feedbackEntry: MicroFeedbackData = {
      questionId: meta.q.id,
      response,
      answeredCorrectly: meta.correct,
      timeSpentMs: meta.timeMs,
      viewedSolutionBeforeAnswering: meta.viewedSol,
      conceptIds: meta.q.metadata.tags?.map(t => t.tag_id) ?? [],
      difficulty: meta.q.metadata.difficulty,
    };

    const newHistory = [...feedbackHistory, feedbackEntry];
    setFeedbackHistory(newHistory);

    // Update user profile concept levels
    const updatedProfile = { ...userProfile };
    for (const cid of feedbackEntry.conceptIds) {
      const existing = updatedProfile[cid] ?? {
        level: 'unseen' as const,
        questionsAttempted: 0,
        correctCount: 0,
        recentFeedback: [],
      };
      const newLevel = updateConceptLevel(
        existing.level,
        existing.recentFeedback,
        response,
        feedbackEntry.difficulty
      );
      updatedProfile[cid] = {
        level: newLevel,
        questionsAttempted: existing.questionsAttempted + 1,
        correctCount: existing.correctCount + (meta.correct ? 1 : 0),
        recentFeedback: [...existing.recentFeedback.slice(-4), response],
      };
    }
    setUserProfile(updatedProfile);

    // Check session cap
    const totalServed = newHistory.length + conceptBaseline.length;
    if (totalServed >= sessionMaxQuestions) {
      setPhase(SESSION_PHASE_COMPLETE);
      return;
    }

    // Ask engine for next question
    const decision = getNextQuestion({
      chapter,
      sessionHistory: newHistory,
      conceptBaseline,
      availableQuestions: filteredPool,
      userGlobalProfile: updatedProfile,
      seenQuestionIds: seenIds,
      sessionMaxQuestions,
      chapterProfile,
    } as AdaptiveEngineInputV2);

    if (!decision) {
      setPhase(SESSION_PHASE_COMPLETE);
      return;
    }

    setCurrentQuestion(decision.question);
    setLastDecision(decision);
    setSeenIds(prev => new Set([...prev, decision.question.id]));
    setQuestionNumber(prev => prev + 1);
    questionStartTimeRef.current = Date.now();
    viewedSolutionRef.current = false;
  }, [feedbackHistory, userProfile, conceptBaseline, chapter, filteredPool, seenIds, sessionMaxQuestions, writeResponseToAPI]);

  // ── Micro-feedback received ──────────────────────────────────────────────────
  const handleMicroFeedback = useCallback((response: MicroFeedbackResponse) => {
    setShowMicroFeedback(false);
    setLastFeedbackResponse(response);
    pendingMicroFeedbackRef.current = response;

    const meta = pendingAnswerRef.current;
    // Show StuckPoint prompt if too_hard OR wrong answer — NOT for got_it/too_easy with correct
    if (meta && (response === 'too_hard' || !meta.correct)) {
      setShowStuckPoint(true);
      return;
    }

    // No stuck point needed — advance directly
    advanceAfterFeedback(response, null);
  }, [advanceAfterFeedback]);

  // ── StuckPoint received ────────────────────────────────────────────────────────
  const handleStuckPoint = useCallback((stuckPoint: StuckPoint) => {
    setShowStuckPoint(false);
    const response = pendingMicroFeedbackRef.current ?? 'too_hard';
    advanceAfterFeedback(response, stuckPoint);
  }, [advanceAfterFeedback]);

  const handleStuckPointSkip = useCallback(() => {
    setShowStuckPoint(false);
    const response = pendingMicroFeedbackRef.current ?? 'too_hard';
    advanceAfterFeedback(response, null);
  }, [advanceAfterFeedback]);

  // ── Diagnostic per-question progress (so End Session mid-warmup has data) ───
  const handleDiagnosticProgress = useCallback((entry: ConceptBaseline) => {
    setConceptBaseline(prev => [...prev, entry]);
  }, []);

  // ── End session ──────────────────────────────────────────────────────────────
  const handleEndSession = useCallback(() => {
    setPhase(SESSION_PHASE_COMPLETE);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────

  if (phase === SESSION_PHASE_COMPLETE) {
    return (
      <SessionSummary
        chapterId={chapter.id}
        chapterName={chapter.name}
        feedbackHistory={feedbackHistory}
        conceptBaseline={conceptBaseline}
        userProfile={userProfile}
        onContinuePracticing={onBack}
        onReviewMistakes={onReviewMistakes}
      />
    );
  }

  // ── Derived display values ──────────────────────────────────────────────────
  const totalServedSoFar = feedbackHistory.length + conceptBaseline.length;
  const liveAccuracy = totalServedSoFar > 0
    ? Math.round(
        (feedbackHistory.filter(f => f.answeredCorrectly).length +
          conceptBaseline.filter(b => b.correct).length) /
        totalServedSoFar * 100
      )
    : 0;

  const chapterBadge = chapter.name
    .split(' ')
    .filter(w => w.length > 2)
    .map(w => w[0].toUpperCase())
    .join('')
    .slice(0, 4) || chapter.name.slice(0, 4).toUpperCase();

  const isDiagnosticPhase = phase === SESSION_PHASE_DIAGNOSTIC;
  const displayTotal = sessionMaxQuestions;
  const displayCurrent = isDiagnosticPhase ? conceptBaseline.length + 1 : totalServedSoFar + 1;

  if (phase === SESSION_PHASE_DIAGNOSTIC) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
        {/* Shared top bar — same in both phases */}
        <SessionTopBar
          chapterBadge={chapterBadge}
          current={displayCurrent}
          total={displayTotal}
          accuracy={liveAccuracy}
          totalServed={totalServedSoFar}
          isWarmup
          onEndSession={handleEndSession}
          onBack={onBack}
        />
        <div style={{ paddingTop: 100, flex: 1 }}>
          <DiagnosticWarmup
            questions={diagnosticQuestions}
            chapters={chapters}
            onComplete={handleDiagnosticComplete}
            onProgress={handleDiagnosticProgress}
            onBack={onBack}
          />
        </div>
      </div>
    );
  }

  // ── Practice phase ───────────────────────────────────────────────────────────
  if (!currentQuestion) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
      <SessionTopBar
        chapterBadge={chapterBadge}
        current={displayCurrent}
        total={displayTotal}
        accuracy={liveAccuracy}
        totalServed={totalServedSoFar}
        isWarmup={false}
        lastReason={lastDecision?.reason ?? null}
        onEndSession={handleEndSession}
        onBack={onBack}
      />

      {/* Spacer + context message based on last feedback */}
      <div style={{ paddingTop: 88 }}>
        {lastFeedbackResponse && (
          <ContextBanner response={lastFeedbackResponse} />
        )}
      </div>

      {/* Question card with inline feedback below */}
      <div style={{ flex: 1, paddingBottom: 40 }}>
        <AdaptiveQuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswered={handleQuestionAnswered}
        />

        {/* MicroFeedback — shown inline after answer */}
        {showMicroFeedback && pendingFeedbackQ && (
          <div style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '0 20px 20px',
          }}>
            <div style={{
              background: 'rgba(10,10,15,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '20px 24px',
            }}>
              <MicroFeedback
                questionId={pendingFeedbackQ.id}
                answeredCorrectly={pendingAnswerRef.current?.correct ?? false}
                timeSpentMs={pendingAnswerRef.current?.timeMs ?? 0}
                viewedSolutionBeforeAnswering={pendingAnswerRef.current?.viewedSol ?? false}
                onFeedback={handleMicroFeedback}
              />
            </div>
          </div>
        )}

        {/* StuckPoint follow-up — shown inline after too_hard or wrong answer */}
        {showStuckPoint && (
          <div style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '0 20px 20px',
          }}>
            <div style={{
              background: 'rgba(10,10,15,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '20px 24px',
            }}>
              <StuckPointPrompt
                onSelect={handleStuckPoint}
                onSkip={handleStuckPointSkip}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SessionTopBar ─────────────────────────────────────────────────────────────
// Fixed top bar: Row 1 = Q counter · dot history · badge · End Session
// Row 2 = linear progress bar with accuracy% left + remaining right

function SessionTopBar({
  chapterBadge,
  current,
  total,
  accuracy,
  totalServed,
  isWarmup,
  lastReason,
  onEndSession,
  onBack,
}: {
  chapterBadge: string;
  current: number;
  total: number;
  accuracy: number;
  totalServed: number;
  isWarmup: boolean;
  lastReason?: string | null;
  onEndSession: () => void;
  onBack: () => void;
}) {
  const progressPct = total > 0 ? Math.round((totalServed / total) * 100) : 0;
  const remaining = Math.max(0, total - totalServed);

  const accentColor = accuracy === 0
    ? 'rgba(255,255,255,0.3)'
    : accuracy >= 70 ? '#10b981'
    : accuracy >= 40 ? '#fbbf24'
    : '#f87171';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      background: 'rgba(10,10,15,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Constrained container to prevent stretching on wide screens */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Row 1: Q counter · reason text · badge · End Session */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px 6px',
        }}>
        {/* Q1 of N */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: 'monospace' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Q</span>
          <span>{current}</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400, fontSize: 12 }}>
            {' '}of{' '}
          </span>
          <span style={{ color: '#10b981' }}>{total}</span>
        </div>

        {/* Center: reason or warm-up label */}
        <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
          {isWarmup ? (
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: 'rgba(251,191,36,0.8)',
              letterSpacing: '0.01em',
            }}>
              🔍 Warm-up phase — mapping your baseline
            </span>
          ) : lastReason ? (
            <span style={{
              fontSize: 11,
              fontStyle: 'italic',
              color: '#6b7280',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {lastReason}
            </span>
          ) : null}
        </div>

        {/* Phase badge */}
        <div style={{
          padding: '3px 8px',
          borderRadius: 6,
          border: `1px solid ${isWarmup ? 'rgba(251,191,36,0.25)' : 'rgba(16,185,129,0.3)'}`,
          background: isWarmup ? 'rgba(251,191,36,0.06)' : 'rgba(16,185,129,0.08)',
          fontSize: 10,
          fontWeight: 800,
          color: isWarmup ? 'rgba(251,191,36,0.7)' : '#10b981',
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          {isWarmup ? 'WARM-UP' : 'ADAPTIVE'}
        </div>

        {/* End Session */}
        <button
          onClick={onEndSession}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 11px',
            borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <X style={{ width: 11, height: 11 }} />
          End Session
        </button>
      </div>

        {/* Row 2: Linear progress bar */}
        <div style={{ padding: '0 14px', marginBottom: 4 }}>
          <div style={{
            height: 4,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: 99,
              width: `${progressPct}%`,
              background: '#10b981',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Row 3: accuracy% left · remaining right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px 8px',
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: accentColor,
          }}>
            {totalServed === 0 ? '—' : `${accuracy}%`}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            {remaining} question{remaining !== 1 ? 's' : ''} remaining
          </div>
        </div>
      </div>
    </div>
  );
}
