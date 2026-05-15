"use client";

// POST-SESSION REFLECTION: Collect qualitative feedback to understand WHY students
// performed well/poorly. Helps distinguish "careless mistakes" from "concept unclear".
// Shows 2-3 targeted questions based on weakest concept from the session.

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ReflectionAnswer {
  confidence: 'very-confident' | 'somewhat-confident' | 'not-confident' | null;
  preparation: 'studied-and-practiced' | 'studied-only' | 'not-covered' | null;
  difficulty: 'too-easy' | 'just-right' | 'too-hard' | null;
}

interface SessionReflectionProps {
  weakestConceptName: string;
  weakestConceptAccuracy: number;
  onComplete: (answers: ReflectionAnswer) => void;
  onSkip: () => void;
}

export default function SessionReflection({
  weakestConceptName,
  weakestConceptAccuracy,
  onComplete,
  onSkip,
}: SessionReflectionProps) {
  const [answers, setAnswers] = useState<ReflectionAnswer>({
    confidence: null,
    preparation: null,
    difficulty: null,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    {
      id: 'confidence',
      question: `How confident do you feel about ${weakestConceptName}?`,
      subtitle: `You scored ${weakestConceptAccuracy}% on this concept`,
      options: [
        { value: 'very-confident', emoji: '💪', label: 'Very Confident', sublabel: 'I just made silly mistakes' },
        { value: 'somewhat-confident', emoji: '🤔', label: 'Somewhat Confident', sublabel: 'Need more practice' },
        { value: 'not-confident', emoji: '😰', label: 'Not Confident', sublabel: 'Concept is unclear to me' },
      ],
    },
    {
      id: 'preparation',
      question: `Have you studied ${weakestConceptName} before?`,
      subtitle: 'This helps us recommend the right resources',
      options: [
        { value: 'studied-and-practiced', emoji: '📚', label: 'Yes, Theory + Practice', sublabel: 'Studied and solved problems' },
        { value: 'studied-only', emoji: '📖', label: 'Yes, Theory Only', sublabel: 'Read but limited practice' },
        { value: 'not-covered', emoji: '🆕', label: 'Not Yet', sublabel: "Haven't covered this topic" },
      ],
    },
    {
      id: 'difficulty',
      question: 'How did the questions feel overall?',
      subtitle: 'Your feedback helps us calibrate difficulty',
      options: [
        { value: 'too-easy', emoji: '😌', label: 'Too Easy', sublabel: 'I need harder questions' },
        { value: 'just-right', emoji: '🎯', label: 'Just Right', sublabel: 'Good challenge level' },
        { value: 'too-hard', emoji: '😓', label: 'Too Hard', sublabel: 'Questions were difficult' },
      ],
    },
  ];

  const currentQ = questions[currentStep];

  const handleAnswer = (value: string) => {
    const key = currentQ.id as keyof ReflectionAnswer;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  return (
    <div style={{
      maxWidth: 560,
      width: '100%',
      padding: '0 20px',
    }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 6, justifyContent: 'center' }}>
        {questions.map((_, idx) => (
          <div key={idx} style={{
            width: 40,
            height: 4,
            borderRadius: 99,
            background: idx <= currentStep ? '#10b981' : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      {/* Question card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 16,
      }}>
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.4 }}>
            {currentQ.question}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {currentQ.subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentQ.options.map(option => {
            const isSelected = answers[currentQ.id as keyof ReflectionAnswer] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 18px',
                  borderRadius: 12,
                  border: `1.5px solid ${isSelected ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.12)'}`,
                  background: isSelected ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)';
                    e.currentTarget.style.background = 'rgba(16,185,129,0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: 24 }}>{option.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? '#10b981' : '#fff', marginBottom: 2 }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: 12, color: isSelected ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.45)' }}>
                    {option.sublabel}
                  </div>
                </div>
                {isSelected && (
                  <ChevronRight style={{ width: 16, height: 16, color: '#10b981' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        style={{
          width: '100%',
          padding: '12px',
          border: 'none',
          background: 'transparent',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        Skip reflection
      </button>
    </div>
  );
}
