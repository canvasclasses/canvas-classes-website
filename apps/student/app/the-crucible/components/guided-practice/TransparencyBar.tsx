"use client";

// ADAPTIVE ENGINE: Subtle single-line reason display below the question counter.
// Shows the engine's current reasoning so students feel the system is paying attention.
// Never shown during the diagnostic phase.

import { useEffect, useState } from 'react';

interface TransparencyBarProps {
  reason: string;        // ≤60 chars from adaptiveEngine
  questionNumber: number;
}

export default function TransparencyBar({ reason, questionNumber }: TransparencyBarProps) {
  const [displayedReason, setDisplayedReason] = useState(reason);
  const [fading, setFading] = useState(false);

  // Cross-fade when reason changes
  useEffect(() => {
    if (reason === displayedReason) return;
    setFading(true);
    const t = setTimeout(() => {
      setDisplayedReason(reason);
      setFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [reason]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!displayedReason) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '0 0 10px',
    }}>
      <span style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.28)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}>
        Q{questionNumber}
      </span>
      <span style={{
        fontSize: 11,
        color: '#6b7280',
        fontStyle: 'italic',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.18s ease',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {displayedReason}
      </span>
    </div>
  );
}
