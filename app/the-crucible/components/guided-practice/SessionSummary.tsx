"use client";

// ADAPTIVE ENGINE: End-of-session review screen.
// Shows accuracy, per-concept breakdown, proficiency deltas, and two CTAs.
// Writes concept deltas back to DB after session completes.

import { useEffect, useRef, useState } from 'react';
import { ChevronRight, RefreshCw, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import SessionReflection from './SessionReflection';
import type { MicroFeedback, ConceptLevel, UserConceptProfile } from '@/lib/adaptiveEngine';
import { updateConceptLevel } from '@/lib/adaptiveEngine';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';

// Build a lookup map for concept tag IDs → human-readable names
const TAG_NAME_MAP = new Map<string, string>(
  TAXONOMY_FROM_CSV.filter(n => n.type === 'topic').map(n => [n.id, n.name])
);

// ── Types ────────────────────────────────────────────────────────────────────

export interface ConceptDelta {
  conceptId: string;
  conceptName: string;
  previousLevel: ConceptLevel;
  newLevel: ConceptLevel;
  questionsAttempted: number;
  correctCount: number;
}

export interface SessionResult {
  userId: string | null;
  chapterId: string;
  sessionDate: Date;
  questionsAttempted: MicroFeedback[];
  conceptDeltas: ConceptDelta[];
}

interface SessionSummaryProps {
  chapterId: string;
  chapterName: string;
  feedbackHistory: MicroFeedback[];
  conceptBaseline: import('@/lib/adaptiveEngine').ConceptBaseline[];
  userProfile: UserConceptProfile;
  onContinuePracticing: () => void;
  onReviewMistakes: (wrongQuestionIds: string[]) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const LEVEL_ORDER: ConceptLevel[] = ['unseen', 'weak', 'developing', 'strong', 'mastered'];
const LEVEL_COLOR: Record<ConceptLevel, string> = {
  unseen: '#6b7280',
  weak: '#ef4444',
  developing: '#f59e0b',
  strong: '#10b981',
  mastered: '#059669',
};
const LEVEL_LABEL: Record<ConceptLevel, string> = {
  unseen: 'Unseen',
  weak: 'Weak',
  developing: 'Developing',
  strong: 'Strong',
  mastered: 'Mastered',
};

function levelUp(a: ConceptLevel, b: ConceptLevel): boolean {
  return LEVEL_ORDER.indexOf(b) > LEVEL_ORDER.indexOf(a);
}

function computeConceptDeltas(
  feedbackHistory: MicroFeedback[],
  userProfile: UserConceptProfile
): ConceptDelta[] {
  // Group feedback by concept
  const conceptFeedback = new Map<string, MicroFeedback[]>();
  for (const fb of feedbackHistory) {
    for (const cid of fb.conceptIds) {
      const arr = conceptFeedback.get(cid) ?? [];
      arr.push(fb);
      conceptFeedback.set(cid, arr);
    }
  }

  const deltas: ConceptDelta[] = [];
  for (const [cid, feedbacks] of conceptFeedback.entries()) {
    const profileEntry = userProfile[cid];
    const previousLevel: ConceptLevel = profileEntry?.level ?? 'unseen';
    let currentLevel = previousLevel;
    const recentFeedback = profileEntry?.recentFeedback ?? [];

    // Apply each feedback signal in order
    for (const fb of feedbacks) {
      currentLevel = updateConceptLevel(
        currentLevel,
        recentFeedback,
        fb.response,
        fb.difficulty
      );
    }

    const correctCount = feedbacks.filter(f => f.answeredCorrectly).length;
    const conceptName = TAG_NAME_MAP.get(cid) ?? cid.replace(/_/g, ' ').replace(/^(ch\d+_)/, '').replace(/^tag /, '');

    deltas.push({
      conceptId: cid,
      conceptName,
      previousLevel,
      newLevel: currentLevel,
      questionsAttempted: feedbacks.length,
      correctCount,
    });
  }

  return deltas.sort((a, b) => b.questionsAttempted - a.questionsAttempted);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SessionSummary({
  chapterId,
  chapterName,
  feedbackHistory,
  conceptBaseline,
  userProfile,
  onContinuePracticing,
  onReviewMistakes,
}: SessionSummaryProps) {
  const writtenRef = useRef(false);
  const [showReflection, setShowReflection] = useState(true);
  const [reflectionData, setReflectionData] = useState<Record<string, unknown> | null>(null);

  const totalAttempted = feedbackHistory.length + conceptBaseline.length;
  const totalCorrect = feedbackHistory.filter(f => f.answeredCorrectly).length +
    conceptBaseline.filter(b => b.correct).length;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const conceptDeltas = computeConceptDeltas(feedbackHistory, userProfile);

  // Find weakest concept this session
  const weakest = conceptDeltas.find(d => d.newLevel === 'weak' || d.newLevel === 'developing') ??
    conceptDeltas.reduce((worst, d) => {
      const score = d.correctCount / Math.max(d.questionsAttempted, 1);
      const worstScore = worst.correctCount / Math.max(worst.questionsAttempted, 1);
      return score < worstScore ? d : worst;
    }, conceptDeltas[0]);

  const wrongQuestionIds = feedbackHistory
    .filter(f => !f.answeredCorrectly)
    .map(f => f.questionId);

  const handleReflectionComplete = (answers: Record<string, unknown>) => {
    setReflectionData(answers);
    setShowReflection(false);
    // TODO: Send reflection data to API for storage
    console.log('Session reflection:', answers);
  };

  const handleReflectionSkip = () => {
    setShowReflection(false);
  };

  // Write session result to DB once on mount
  useEffect(() => {
    if (writtenRef.current || feedbackHistory.length === 0) return;
    writtenRef.current = true;

    const payload = {
      attempts: feedbackHistory.map(fb => ({
        question_id: fb.questionId,
        display_id: fb.questionId,
        chapter_id: chapterId,
        difficulty: fb.difficulty,
        concept_tags: fb.conceptIds,
        is_correct: fb.answeredCorrectly,
        selected_option: null,
        source: 'guided',
        time_spent_seconds: Math.round(fb.timeSpentMs / 1000),
        micro_feedback: fb.response,
      })),
    };

    fetch('/api/v2/user/progress/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => { /* best-effort */ });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Today's date for the header
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const conceptsCovered = conceptDeltas.length;

  // Show reflection first if there's a weak concept and user hasn't completed it yet
  if (showReflection && weakest && (weakest.newLevel === 'weak' || weakest.newLevel === 'developing')) {
    const weakestAcc = weakest.questionsAttempted > 0
      ? Math.round((weakest.correctCount / weakest.questionsAttempted) * 100)
      : 0;
    
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px 40px',
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Quick Reflection</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Help us understand your learning better
          </p>
        </div>
        <SessionReflection
          weakestConceptName={weakest.conceptName}
          weakestConceptAccuracy={weakestAcc}
          onComplete={handleReflectionComplete}
          onSkip={handleReflectionSkip}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 16px 40px',
      overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Session Complete 🎯
          </h1>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {chapterName} · {today} · {totalAttempted} questions
          </div>
        </div>

        {/* 3-stat grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 28,
        }}>
          {[
            {
              value: String(totalAttempted),
              label: 'Attempted',
              color: '#10b981',
            },
            {
              value: `${accuracy}%`,
              label: 'Accuracy',
              color: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#fbbf24' : '#f87171',
            },
            {
              value: String(conceptsCovered),
              label: 'Concepts Covered',
              color: '#a78bfa',
            },
          ].map(({ value, label, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '18px 10px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 30, fontWeight: 800, color, letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.3 }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Concept Breakdown */}
        {conceptDeltas.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
              marginBottom: 10,
              textAlign: 'center',
            }}>
              CONCEPT BREAKDOWN
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {conceptDeltas.map(delta => {
                const conceptAcc = delta.questionsAttempted > 0
                  ? Math.round((delta.correctCount / delta.questionsAttempted) * 100)
                  : 0;
                const improved = levelUp(delta.previousLevel, delta.newLevel);
                const barColor = delta.newLevel === 'mastered' || delta.newLevel === 'strong'
                  ? '#10b981'
                  : delta.newLevel === 'developing'
                  ? '#fbbf24'
                  : '#f87171';

                return (
                  <div
                    key={delta.conceptId}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      {/* Concept name */}
                      <div style={{
                        flex: 1, minWidth: 0,
                        fontSize: 13, fontWeight: 600, color: '#fff',
                        textTransform: 'capitalize',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {delta.conceptName}
                      </div>
                      {/* Inline stats */}
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                        {delta.questionsAttempted}Q · {conceptAcc}%
                      </div>
                      {/* Level badge */}
                      <div style={{
                        fontSize: 10, fontWeight: 800,
                        color: delta.newLevel === 'weak' ? '#fff' : LEVEL_COLOR[delta.newLevel],
                        padding: '3px 8px',
                        borderRadius: 6,
                        border: `1.5px solid ${LEVEL_COLOR[delta.newLevel]}${delta.newLevel === 'weak' ? '60' : '50'}`,
                        background: delta.newLevel === 'weak' 
                          ? `linear-gradient(135deg, ${LEVEL_COLOR[delta.newLevel]}30, ${LEVEL_COLOR[delta.newLevel]}20)`
                          : `${LEVEL_COLOR[delta.newLevel]}${delta.newLevel === 'strong' || delta.newLevel === 'mastered' ? '20' : '15'}`,
                        letterSpacing: '0.06em',
                        flexShrink: 0,
                      }}>
                        {LEVEL_LABEL[delta.newLevel].toUpperCase()}
                      </div>
                      {/* Arrow if improved */}
                      {improved && (
                        <span style={{ fontSize: 13, color: '#10b981', flexShrink: 0 }}>↑</span>
                      )}
                    </div>
                    {/* Horizontal progress bar */}
                    <div style={{
                      height: 4, borderRadius: 99,
                      background: 'rgba(255,255,255,0.07)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        background: barColor,
                        width: `${Math.max(conceptAcc, conceptAcc > 0 ? 3 : 0)}%`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Focus Area callout */}
        {weakest && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 14,
            padding: '16px 18px',
            marginBottom: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                Focus Area: <span style={{ color: '#10b981' }}>{weakest.conceptName}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              You attempted {weakest.questionsAttempted} question{weakest.questionsAttempted !== 1 ? 's' : ''} from
              this concept with {weakest.questionsAttempted > 0 ? Math.round((weakest.correctCount / weakest.questionsAttempted) * 100) : 0}% accuracy.
              Next session: try 5 targeted questions on{' '}
              <strong style={{ color: '#fff', fontWeight: 700 }}>{weakest.conceptName}</strong>
              {' '}at{' '}
              <strong style={{ color: '#10b981', fontWeight: 700 }}>
                {weakest.newLevel === 'weak' ? 'Easy' : 'Medium'}
              </strong>
              {' '}difficulty to build confidence before attempting Hard ones.
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Primary: restart session — wrong Qs from this session are prioritised */}
          <button
            onClick={() => onReviewMistakes(wrongQuestionIds)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontSize: 14, fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: '0 6px 20px rgba(16,185,129,0.25)',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14 }} />
            Practice Again{wrongQuestionIds.length > 0 ? ` (${wrongQuestionIds.length} mistakes first)` : ''}
          </button>
          {/* Secondary: go back to filters to change chapter/settings */}
          <button
            onClick={onContinuePracticing}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            <BookOpen style={{ width: 14, height: 14 }} />
            Change Chapter / Filters
          </button>
        </div>
      </div>
    </div>
  );
}
