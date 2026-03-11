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
  { value: 'concept-gap',    emoji: '🧠', label: 'Concept Gap',     sublabel: "Didn't understand the core idea" },
  { value: 'unclear-entry',  emoji: '🚪', label: 'Unclear Entry',   sublabel: "Didn't know how to start" },
  { value: 'calc-error',     emoji: '🔢', label: 'Calc Error',      sublabel: 'Made a calculation mistake' },
  { value: 'time-pressure',  emoji: '⏱️', label: 'Time Pressure',   sublabel: 'Knew it but ran out of time' },
  { value: 'silly-mistake',  emoji: '😅', label: 'Silly Mistake',   sublabel: 'Knew it but slipped up' },
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
        maxWidth: 480,
        width: '100%',
        pointerEvents: selected ? 'none' : 'auto',
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          Where did you get stuck?
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>
          This helps us adapt
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {OPTIONS.map(({ value, emoji, label }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              onClick={() => handlePick(value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                borderRadius: 99,
                border: `1px solid ${isSelected ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.12)'}`,
                background: isSelected ? 'rgba(251,191,36,0.1)' : 'transparent',
                color: isSelected ? '#fbbf24' : 'rgba(255,255,255,0.55)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e => {
                if (!selected) {
                  e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)';
                  e.currentTarget.style.background = 'rgba(251,191,36,0.06)';
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

      <button
        onClick={handleSkip}
        style={{
          marginTop: 8,
          padding: '5px 0',
          border: 'none',
          background: 'transparent',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 11,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Skip
      </button>
    </div>
  );
}
