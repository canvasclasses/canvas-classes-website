"use client";

// ADAPTIVE ENGINE: 5-question behavioral warm-up.
// Presents Easy questions one at a time. After the user answers, they see
// correct/incorrect feedback, micro-feedback pills, then a "Next" button.
// Collects ConceptBaseline data including micro-feedback response.

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Question, Chapter } from '@/app/the-crucible/components/types';
import type { ConceptBaseline, MicroFeedbackResponse } from '@/lib/adaptiveEngine';
import { SESSION_DIAGNOSTIC_LENGTH } from '@/constants/adaptivePractice';
import AdaptiveQuestionCard from './AdaptiveQuestionCard';
import MicroFeedback from './MicroFeedback';

interface DiagnosticWarmupProps {
  questions: Question[];           // pre-selected Easy questions, one per major concept
  chapters: Chapter[];
  onComplete: (baseline: ConceptBaseline[]) => void;
  onProgress: (entry: ConceptBaseline) => void; // fires per-question so parent tracks partial data
  onBack: () => void;
}

export default function DiagnosticWarmup({ questions, chapters, onComplete, onProgress, onBack }: DiagnosticWarmupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseline, setBaseline] = useState<ConceptBaseline[]>([]);
  const [showMicroFeedback, setShowMicroFeedback] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const questionStartTimeRef = useRef<number>(Date.now());
  const viewedSolutionRef = useRef<boolean>(false);
  const pendingEntryRef = useRef<ConceptBaseline | null>(null);

  const diagnosticQuestions = questions.slice(0, SESSION_DIAGNOSTIC_LENGTH);
  const currentQuestion = diagnosticQuestions[currentIndex] ?? null;

  // Reset per-question tracking when question changes
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    viewedSolutionRef.current = false;
    setShowMicroFeedback(false);
    setWaitingForNext(false);
  }, [currentIndex]);

  // Called when user selects an answer — show micro-feedback first
  const handleAnswered = useCallback((isCorrect: boolean) => {
    const timeSpentMs = Date.now() - questionStartTimeRef.current;
    const q = diagnosticQuestions[currentIndex];
    if (!q) return;

    pendingEntryRef.current = {
      conceptId: q.metadata.tags?.[0]?.tag_id ?? q.metadata.chapter_id,
      attempted: true,
      correct: isCorrect,
      timeSpentMs,
      viewedSolutionBeforeAnswering: viewedSolutionRef.current,
    };

    setLastCorrect(isCorrect);
    setShowMicroFeedback(true);
  }, [currentIndex, diagnosticQuestions]);

  // Called when user picks a micro-feedback pill — record baseline, show Next button
  const handleMicroFeedbackPick = useCallback((_response: MicroFeedbackResponse) => {
    setShowMicroFeedback(false);
    const entry = pendingEntryRef.current;
    if (!entry) return;
    pendingEntryRef.current = null;

    setBaseline(prev => [...prev, entry]);
    setWaitingForNext(true);
    onProgress(entry);
  }, [onProgress]);

  // Called when user clicks "Next Question" after reviewing their answer
  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= diagnosticQuestions.length) {
      onComplete(baseline);
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, diagnosticQuestions.length, baseline, onComplete]);

  if (!currentQuestion) return null;

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* key forces full state reset when question changes */}
      <AdaptiveQuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswered={handleAnswered}
      />

      {/* Micro-feedback overlay — slides up right after answering */}
      {showMicroFeedback && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          background: 'rgba(10,10,15,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '12px 20px 20px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <MicroFeedback
            questionId={currentQuestion.id}
            answeredCorrectly={lastCorrect}
            timeSpentMs={Date.now() - questionStartTimeRef.current}
            viewedSolutionBeforeAnswering={viewedSolutionRef.current}
            onFeedback={handleMicroFeedbackPick}
          />
        </div>
      )}

      {/* "Next Question" button — appears after micro-feedback is given */}
      {waitingForNext && !showMicroFeedback && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          background: 'rgba(10,10,15,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '14px 20px 20px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{ maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: lastCorrect ? '#34d399' : '#fbbf24',
            }}>
              {lastCorrect ? 'Nice work!' : 'Review the solution above, then continue.'}
            </div>
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 6px 24px rgba(16,185,129,0.3)',
              }}
            >
              {currentIndex + 1 >= diagnosticQuestions.length ? 'Start Practice' : 'Next Question'}
              <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
