'use client';

import { useState } from 'react';
import { QUIZ_QUESTIONS } from './acidity-lab-data2';

type Phase = 'idle' | 'answering' | 'revealed' | 'done';

export default function QuizModeTab() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ correct: boolean; chosen: number }[]>([]);

  const q = QUIZ_QUESTIONS[idx];
  const total = QUIZ_QUESTIONS.length;

  function start() {
    setPhase('answering');
    setIdx(0);
    setSelected(null);
    setScore(0);
    setResults([]);
  }

  function choose(i: number) {
    if (phase !== 'answering') return;
    setSelected(i);
    setPhase('revealed');
    const correct = i === q.answer;
    if (correct) setScore(s => s + 1);
    setResults(r => [...r, { correct, chosen: i }]);
  }

  function next() {
    if (idx + 1 >= total) {
      setPhase('done');
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setPhase('answering');
    }
  }

  function restart() {
    setPhase('idle');
    setIdx(0);
    setSelected(null);
    setScore(0);
    setResults([]);
  }

  // ── Idle / start screen ──────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420, textAlign: 'center' as const, gap: 24 }}>
        <div style={{ fontSize: 48 }}>🧪</div>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#dddae8', marginBottom: 8 }}>Acidity Quiz</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 420, lineHeight: 1.75 }}>
            {total} questions covering pKa trends, substituent effects, geometric isomers, and ring strain.
            Each question includes a detailed explanation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
          {[
            { label: `${total} Questions`, icon: '📋' },
            { label: 'Instant Feedback', icon: '⚡' },
            { label: 'Full Explanations', icon: '📖' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
        <button onClick={start} style={{ marginTop: 8, padding: '13px 40px', borderRadius: 12, background: 'rgba(180,150,220,0.15)', border: '1px solid rgba(180,150,220,0.35)', color: '#c8b4e8', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '.04em', transition: 'background .2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,150,220,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(180,150,220,0.15)')}>
          Start Quiz
        </button>
      </div>
    );
  }

  // ── Done / results screen ────────────────────────────────────────────────────
  if (phase === 'done') {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 80 ? { label: 'Excellent', col: '#78d0c0' } : pct >= 60 ? { label: 'Good', col: '#e0c878' } : { label: 'Keep Practising', col: '#e08080' };
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 24 }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 32 }}>
          <div style={{ fontSize: 52, fontWeight: 900, fontFamily: 'DM Mono,monospace', color: grade.col, lineHeight: 1 }}>{score}/{total}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: grade.col, marginTop: 6, marginBottom: 4 }}>{grade.label}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{pct}% correct</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {QUIZ_QUESTIONS.map((qq, i) => {
            const res = results[i];
            if (!res) return null;
            return (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: res.correct ? 'rgba(120,208,192,0.07)' : 'rgba(224,128,128,0.07)', border: `1px solid ${res.correct ? 'rgba(120,208,192,0.2)' : 'rgba(224,128,128,0.2)'}` }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{res.correct ? '✓' : '✗'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 4, lineHeight: 1.5 }}>Q{i + 1}. {qq.q}</div>
                    {!res.correct && (
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                        Your answer: <span style={{ color: '#e08080' }}>{qq.options[res.chosen]}</span><br />
                        Correct: <span style={{ color: '#78d0c0' }}>{qq.options[qq.answer]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={restart} style={{ padding: '12px 36px', borderRadius: 12, background: 'rgba(180,150,220,0.15)', border: '1px solid rgba(180,150,220,0.35)', color: '#c8b4e8', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,150,220,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(180,150,220,0.15)')}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────────────
  const isCorrect = selected === q.answer;

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((idx) / total) * 100}%`, background: 'rgba(180,150,220,0.6)', borderRadius: 2, transition: 'width .4s' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>{idx + 1} / {total}</span>
      </div>

      {/* Score chip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: 'rgba(120,208,192,0.1)', border: '1px solid rgba(120,208,192,0.2)', color: '#78d0c0', fontFamily: 'DM Mono,monospace' }}>
          Score: {score}/{idx}
        </span>
      </div>

      {/* Question */}
      <div style={{ padding: '22px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>Question {idx + 1}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1.65 }}>{q.q}</div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {q.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.04)';
          let border = '1px solid rgba(255,255,255,0.1)';
          let col = 'rgba(255,255,255,0.75)';
          let prefix = '';

          if (phase === 'revealed') {
            if (i === q.answer) { bg = 'rgba(120,208,192,0.12)'; border = '1px solid rgba(120,208,192,0.4)'; col = '#78d0c0'; prefix = '✓ '; }
            else if (i === selected && !isCorrect) { bg = 'rgba(224,128,128,0.12)'; border = '1px solid rgba(224,128,128,0.4)'; col = '#e08080'; prefix = '✗ '; }
            else { bg = 'rgba(255,255,255,0.02)'; col = 'rgba(255,255,255,0.35)'; }
          }

          return (
            <button key={i} onClick={() => choose(i)} disabled={phase === 'revealed'}
              style={{ padding: '14px 18px', borderRadius: 12, background: bg, border, color: col, fontSize: 14, fontWeight: 500, textAlign: 'left' as const, cursor: phase === 'answering' ? 'pointer' : 'default', transition: 'background .2s, border .2s', lineHeight: 1.5 }}
              onMouseEnter={e => { if (phase === 'answering') e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (phase === 'answering') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
              <span style={{ fontFamily: 'DM Mono,monospace', fontWeight: 700, marginRight: 10, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
              {prefix}{opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {phase === 'revealed' && (
        <div style={{ padding: '18px 20px', borderRadius: 12, background: isCorrect ? 'rgba(120,208,192,0.07)' : 'rgba(224,128,128,0.07)', border: `1px solid ${isCorrect ? 'rgba(120,208,192,0.2)' : 'rgba(224,128,128,0.2)'}`, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: isCorrect ? '#78d0c0' : '#e08080', marginBottom: 10 }}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'} — Explanation
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>{q.explanation}</div>
        </div>
      )}

      {/* Next button */}
      {phase === 'revealed' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={next} style={{ padding: '12px 32px', borderRadius: 12, background: 'rgba(180,150,220,0.15)', border: '1px solid rgba(180,150,220,0.35)', color: '#c8b4e8', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background .2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,150,220,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(180,150,220,0.15)')}>
            {idx + 1 >= total ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
