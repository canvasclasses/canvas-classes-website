"use client";

// ADAPTIVE ENGINE: Pre-session setup screen shown before the adaptive session begins.
// Lets the student pick session length (10/20/30 questions) and explains the 3-phase flow.
// Matches the dark theme with teal accents from the existing design system.

import { useState } from 'react';
import { ChevronLeft, ArrowRight, Compass } from 'lucide-react';

interface SessionOption {
  count: number;
  label: string;
  sublabel: string;
  mins: number;
}

const SESSION_OPTIONS: SessionOption[] = [
  { count: 10, label: '10', sublabel: 'Quick',    mins: 12 },
  { count: 20, label: '20', sublabel: 'Standard', mins: 25 },
  { count: 30, label: '30', sublabel: 'Deep',     mins: 40 },
];

const STEPS = [
  {
    num: 1,
    title: 'Warm-up (5 questions)',
    desc: '— one per major concept, easy difficulty. We silently map your baseline.',
  },
  {
    num: 2,
    title: 'Adaptive practice',
    desc: '— one question at a time. After each, tap how it felt. We adjust the next question instantly.',
  },
  {
    num: 3,
    title: 'Session summary',
    desc: '— see exactly what moved, what needs work, and what to focus on next time.',
  },
];

interface SessionSetupScreenProps {
  chapterName: string;
  chapterId: string;
  onBack: () => void;
  onBegin: (sessionMaxQuestions: number) => void;
}

export default function SessionSetupScreen({
  chapterName,
  chapterId,
  onBack,
  onBegin,
}: SessionSetupScreenProps) {
  const [selected, setSelected] = useState<number>(20);

  // Short chapter label for the badge (e.g. "GOC" from "General Organic Chemistry")
  const chapterBadge = chapterName
    .split(' ')
    .filter(w => w.length > 2)
    .map(w => w[0].toUpperCase())
    .join('')
    .slice(0, 4) || chapterName.slice(0, 4).toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,15,0.97)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ChevronLeft style={{ width: 14, height: 14 }} />
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            🔥
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>The Crucible</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#f97316', letterSpacing: '0.12em' }}>FORGE YOUR RANK</div>
          </div>
        </div>

        <div style={{
          padding: '5px 12px', borderRadius: 6,
          background: 'rgba(124,58,237,0.2)',
          border: '1px solid rgba(124,58,237,0.4)',
          fontSize: 12, fontWeight: 800, color: '#a78bfa',
          letterSpacing: '0.06em',
        }}>
          {chapterBadge}
        </div>
      </nav>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 32px',
        maxWidth: 520,
        margin: '0 auto',
        width: '100%',
      }}>

        {/* Compass icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.1) 100%)',
          border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28, fontSize: 36,
          boxShadow: '0 8px 32px rgba(16,185,129,0.12)',
        }}>
          🧭
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em',
          marginBottom: 12, textAlign: 'center', lineHeight: 1.2,
        }}>
          Your{' '}
          <span style={{ color: '#10b981' }}>Guided</span>
          {' '}Session
        </h1>

        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.5)',
          textAlign: 'center', lineHeight: 1.6,
          marginBottom: 36, maxWidth: 400,
        }}>
          We'll start with a few warm-up questions to understand where you stand,
          then adapt in real-time based on how you're doing.
        </p>

        {/* Session length picker */}
        <div style={{ width: '100%', marginBottom: 28 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em', marginBottom: 12,
          }}>
            HOW MANY QUESTIONS?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {SESSION_OPTIONS.map(opt => {
              const isSelected = selected === opt.count;
              return (
                <button
                  key={opt.count}
                  onClick={() => setSelected(opt.count)}
                  style={{
                    padding: '18px 12px',
                    borderRadius: 12,
                    border: isSelected
                      ? '1.5px solid #10b981'
                      : '1.5px solid rgba(255,255,255,0.09)',
                    background: isSelected
                      ? 'rgba(16,185,129,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    color: isSelected ? '#10b981' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em',
                    marginBottom: 4, lineHeight: 1,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: isSelected ? '#10b981' : 'rgba(255,255,255,0.4)',
                    marginBottom: 2,
                  }}>
                    {opt.sublabel}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: isSelected ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.25)',
                  }}>
                    ~{opt.mins} min
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-step explainer */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
          {STEPS.map(step => (
            <div
              key={step.num}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 16px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#10b981',
                marginTop: 1,
              }}>
                {step.num}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{step.title}</span>
                {' '}{step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Begin Session CTA */}
        <button
          onClick={() => onBegin(selected)}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            letterSpacing: '-0.01em',
            boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
            transition: 'box-shadow 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.45)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Begin Session
          <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
}
