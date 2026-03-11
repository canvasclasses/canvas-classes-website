"use client";

// ADAPTIVE ENGINE: Per-question confidence signal collected after every attempt.
// Slides up below the question card. Three pill buttons. Dismisses in <300ms.
// Emits MicroFeedback data to parent AdaptiveSession.

import { useEffect, useState } from 'react';
import type { MicroFeedbackResponse } from '@/lib/adaptiveEngine';

interface MicroFeedbackProps {
  questionId: string;
  answeredCorrectly: boolean;
  timeSpentMs: number;
  viewedSolutionBeforeAnswering: boolean;
  onFeedback: (response: MicroFeedbackResponse) => void;
}

const PILLS: { response: MicroFeedbackResponse; emoji: string; label: string }[] = [
  { response: 'too_hard', emoji: '😅', label: 'Too Hard' },
  { response: 'got_it',   emoji: '👍', label: 'Got It'   },
  { response: 'too_easy', emoji: '😴', label: 'Too Easy' },
];

export default function MicroFeedback({
  questionId,
  answeredCorrectly,
  timeSpentMs,
  viewedSolutionBeforeAnswering,
  onFeedback,
}: MicroFeedbackProps) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<MicroFeedbackResponse | null>(null);

  // Slide in after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  const handlePick = (response: MicroFeedbackResponse) => {
    if (selected) return; // guard double-tap
    setSelected(response);
    // Dismiss immediately — transition happens in <300ms via CSS
    setVisible(false);
    // Call parent after exit animation
    setTimeout(() => onFeedback(response), 260);
  };

  return (
    <div
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 0 4px',
        pointerEvents: selected ? 'none' : 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, whiteSpace: 'nowrap' }}>
          How was that?
        </span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', fontWeight: 500, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
          Be honest — it helps us adapt
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {PILLS.map(({ response, emoji, label }) => {
          const isSelected = selected === response;
          return (
            <button
              key={response}
              onClick={() => handlePick(response)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 99,
                border: `1px solid ${isSelected ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
                background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e => {
                if (!selected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                }
              }}
              onMouseLeave={e => {
                if (!selected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                }
              }}
            >
              <span style={{ fontSize: 13 }}>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
