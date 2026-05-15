"use client";

// ADAPTIVE ENGINE: Minimal single-question renderer for the diagnostic phase.
// Reuses BrowseView in guidedMode (single question, no pagination) so all
// question types (SCQ/MCQ/NVT/SUBJ) are handled without duplication.
// Does not reveal diagnostic status — looks like normal practice to the student.

import { useCallback, useRef } from 'react';
import { Question, Chapter } from '@/app/the-crucible/components/types';
import AdaptiveQuestionCard from './AdaptiveQuestionCard';

interface DiagnosticQuestionCardProps {
  question: Question;
  chapters: Chapter[];
  onAnswered: (isCorrect: boolean) => void;
  onSolutionViewed: () => void;
  onBack: () => void;
}

export default function DiagnosticQuestionCard({
  question,
  chapters,
  onAnswered,
  onSolutionViewed,
  onBack,
}: DiagnosticQuestionCardProps) {
  const answeredRef = useRef(false);

  const handleAnswered = useCallback((isCorrect: boolean) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    onAnswered(isCorrect);
  }, [onAnswered]);

  return (
    <AdaptiveQuestionCard
      question={question}
      onAnswered={handleAnswered}
    />
  );
}
