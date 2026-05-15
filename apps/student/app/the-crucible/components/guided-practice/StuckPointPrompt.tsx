"use client";

// ADAPTIVE ENGINE: Follow-up prompt shown after a wrong answer or "Too Hard" feedback.
// Asks "Where did you get stuck?" with 5 options. Dismisses quickly.
// Only shown when microFeedback is 'too_hard' OR answeredCorrectly is false.
// NOT shown after 'got_it' or 'too_easy' responses.

import { useState, useEffect } from 'react';
import type { StuckPoint } from '@/lib/models/StudentResponse';

interface StuckPointPromptProps {
  onSelect: (stuckPoint: StuckPoint) => void;
  onSkip: () => void;
}

const OPTIONS: { value: StuckPoint; emoji: string; label: string; sublabel: string }[] = [
  { value: 'concept-gap',    emoji: '🧠', label: 'Concept Unclear',     sublabel: "Didn't understand the theory" },
  { value: 'unclear-entry',  emoji: '🤔', label: 'Couldn\'t Start',   sublabel: "Didn't know the first step" },
  { value: 'calc-error',     emoji: '🔢', label: 'Calculation Error',      sublabel: 'Made a math mistake' },
  { value: 'time-pressure',  emoji: '⏱️', label: 'Ran Out of Time',   sublabel: 'Understood but too slow' },
  { value: 'silly-mistake',  emoji: '😅', label: 'Careless Mistake',   sublabel: 'Knew it but made a slip' },
];

export default function StuckPointPrompt({ onSelect, onSkip }: StuckPointPromptProps) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<StuckPoint | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  const handlePick = (value: StuckPoint) => {
    if (selected) return;
    setSelected(value);
    setVisible(false);
    setTimeout(() => onSelect(value), 220);
  };

  const handleSkip = () => {
    if (selected) return;
    setVisible(false);
    setTimeout(() => onSkip(), 220);
  };

  return (
    <div
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease',
        maxWidth: 900,
        width: '100%',
        pointerEvents: selected ? 'none' : 'auto',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          What went wrong?
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Help us understand so we can adapt better
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {OPTIONS.map(({ value, emoji, label, sublabel }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              onClick={() => handlePick(value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 6,
                padding: '14px 16px',
                borderRadius: 12,
                border: `1.5px solid ${isSelected ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.12)'}`,
                background: isSelected ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!selected) {
                  e.currentTarget.style.borderColor = 'rgba(251,191,36,0.5)';
                  e.currentTarget.style.background = 'rgba(251,191,36,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (!selected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: 700, 
                  color: isSelected ? '#fbbf24' : '#fff',
                  flex: 1,
                }}>
                  {label}
                </span>
              </div>
              <span style={{ 
                fontSize: 11, 
                color: isSelected ? 'rgba(251,191,36,0.7)' : 'rgba(255,255,255,0.45)',
                lineHeight: 1.4,
              }}>
                {sublabel}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSkip}
        style={{
          marginTop: 12,
          padding: '8px 0',
          border: 'none',
          background: 'transparent',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        Skip for now
      </button>
    </div>
  );
}
