'use client';

// ExpressionBuilderSim.tsx
// Class 9 Mathematics — Chapter 2 — Page 1 (Why We Use Letters)
// Two modes:
//   - Build:  the expression 4x + 5y + 3 with sliders for x and y, live value,
//             and colour-coded labels for terms / coefficients / variables / constant.
//   - Label:  a random expression (e.g. -7p + 2) appears with its parts as
//             tappable chips. The student picks the right name for each.

import { useState, useCallback, useMemo, useEffect } from 'react';

type Mode = 'build' | 'label';

const COLOURS = {
  variable: '#fbbf24',      // amber
  coefficient: '#34d399',   // green
  constant: '#a78bfa',      // violet
  term: '#60a5fa',          // blue
  text: '#e2e8f0',
};

interface Part {
  // Display string of the part
  text: string;
  // What kind of object it is
  kind: 'variable' | 'coefficient' | 'constant' | 'term';
  // The English label the student should pick
  answer: 'Variable' | 'Coefficient' | 'Constant' | 'Term';
}

const LABEL_EXPRESSIONS: { expr: string; parts: Part[] }[] = [
  {
    expr: '4x + 5y + 3',
    parts: [
      { text: '4', kind: 'coefficient', answer: 'Coefficient' },
      { text: 'x', kind: 'variable', answer: 'Variable' },
      { text: '4x', kind: 'term', answer: 'Term' },
      { text: '5y', kind: 'term', answer: 'Term' },
      { text: '3', kind: 'constant', answer: 'Constant' },
    ],
  },
  {
    expr: '−7p + 2',
    parts: [
      { text: '−7', kind: 'coefficient', answer: 'Coefficient' },
      { text: 'p', kind: 'variable', answer: 'Variable' },
      { text: '2', kind: 'constant', answer: 'Constant' },
      { text: '−7p', kind: 'term', answer: 'Term' },
    ],
  },
  {
    expr: '3a + 5b − 8',
    parts: [
      { text: '3', kind: 'coefficient', answer: 'Coefficient' },
      { text: 'a', kind: 'variable', answer: 'Variable' },
      { text: 'b', kind: 'variable', answer: 'Variable' },
      { text: '−8', kind: 'constant', answer: 'Constant' },
      { text: '5b', kind: 'term', answer: 'Term' },
    ],
  },
  {
    expr: '½ m + 9',
    parts: [
      { text: '½', kind: 'coefficient', answer: 'Coefficient' },
      { text: 'm', kind: 'variable', answer: 'Variable' },
      { text: '9', kind: 'constant', answer: 'Constant' },
    ],
  },
];

const ALL_LABELS = ['Term', 'Variable', 'Coefficient', 'Constant'] as const;

export default function ExpressionBuilderSim() {
  const [mode, setMode] = useState<Mode>('build');

  // Build mode
  const [x, setX] = useState(2);
  const [y, setY] = useState(3);
  const value = 4 * x + 5 * y + 3;

  // Label mode
  const [exprIdx, setExprIdx] = useState(0);
  const [partIdx, setPartIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const expression = LABEL_EXPRESSIONS[exprIdx];
  const part = expression.parts[partIdx];

  const submit = useCallback((label: string) => {
    if (picked) return;
    setPicked(label);
    setScore(s => ({
      correct: s.correct + (label === part.answer ? 1 : 0),
      total: s.total + 1,
    }));
  }, [picked, part]);

  const nextPart = useCallback(() => {
    setPicked(null);
    if (partIdx + 1 < expression.parts.length) {
      setPartIdx(partIdx + 1);
    } else {
      setExprIdx((exprIdx + 1) % LABEL_EXPRESSIONS.length);
      setPartIdx(0);
    }
  }, [partIdx, exprIdx, expression.parts.length]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setPicked(null);
  }, []);

  return (
    <div style={{
      background: '#0d1117', color: COLOURS.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Expression <span style={{ color: '#f59e0b' }}>Builder</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Terms · Variables · Coefficients · Constants — Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([['build', 'Build & Evaluate'], ['label', 'Label the Parts']] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button key={m} onClick={() => switchMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}>{label}</button>
          );
        })}
      </div>

      {/* Build mode */}
      {mode === 'build' && (
        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>
            Slide x (red boxes) and y (blue boxes). The expression <b>4x + 5y + 3</b> updates live — and so does the total count of pens and pencils Raju walks home with.
          </p>

          {/* The expression display */}
          <div style={{
            borderRadius: 12, padding: '20px 14px', marginBottom: 14,
            background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center', fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ color: COLOURS.coefficient }}>4</span>
            <span style={{ color: COLOURS.variable }}>x</span>
            <span style={{ color: '#475569', margin: '0 6px' }}>+</span>
            <span style={{ color: COLOURS.coefficient }}>5</span>
            <span style={{ color: COLOURS.variable }}>y</span>
            <span style={{ color: '#475569', margin: '0 6px' }}>+</span>
            <span style={{ color: COLOURS.constant }}>3</span>
            <span style={{ color: '#475569', margin: '0 10px' }}>=</span>
            <span style={{ color: '#fbbf24' }}>{4 * x + 5 * y + 3}</span>
          </div>

          {/* Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>x (red boxes):</label>
            <input type="range" min={0} max={10} step={1} value={x}
              onChange={e => setX(parseInt(e.target.value, 10))} style={{ accentColor: '#f59e0b' }} />
            <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{x}</span>

            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>y (blue boxes):</label>
            <input type="range" min={0} max={10} step={1} value={y}
              onChange={e => setY(parseInt(e.target.value, 10))} style={{ accentColor: '#f59e0b' }} />
            <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{y}</span>
          </div>

          {/* Breakdown */}
          <div style={{
            borderRadius: 10, padding: '12px 14px',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
              Live breakdown
            </p>
            <p style={{ fontSize: 13, color: COLOURS.text, margin: 0, lineHeight: 1.6 }}>
              Pens from {x} red boxes = <b style={{ color: COLOURS.coefficient }}>4</b> × <b style={{ color: COLOURS.variable }}>{x}</b> = <b>{4 * x}</b>
              <br />
              Pencils from {y} blue boxes = <b style={{ color: COLOURS.coefficient }}>5</b> × <b style={{ color: COLOURS.variable }}>{y}</b> = <b>{5 * y}</b>
              <br />
              Free pens = <b style={{ color: COLOURS.constant }}>3</b>
              <br />
              <b>Total</b> = {4 * x} + {5 * y} + 3 = <b style={{ color: '#fbbf24' }}>{value}</b>
            </p>
          </div>
        </div>
      )}

      {/* Label mode */}
      {mode === 'label' && (
        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
            What kind of object is the highlighted part? <b style={{ color: '#fbbf24' }}>Score: {score.correct}/{score.total}</b>
          </p>

          <div style={{
            borderRadius: 12, padding: '20px 14px', marginBottom: 14,
            background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center', fontSize: 28, fontWeight: 800,
          }}>
            <span style={{ color: '#94a3b8' }}>{expression.expr}</span>
          </div>

          <p style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 12, textAlign: 'center' }}>
            Highlighted part: <b style={{ color: '#fbbf24', fontSize: 18 }}>{part.text}</b>
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
            {ALL_LABELS.map(lbl => {
              const isCorrect = picked && lbl === part.answer;
              const isWrongPick = picked === lbl && lbl !== part.answer;
              return (
                <button key={lbl} onClick={() => submit(lbl)} disabled={!!picked}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: picked ? 'default' : 'pointer',
                    border: picked
                      ? (isCorrect ? '1.5px solid rgba(52,211,153,0.7)' : (isWrongPick ? '1.5px solid rgba(248,113,113,0.7)' : '1px solid rgba(255,255,255,0.08)'))
                      : '1px solid rgba(255,255,255,0.08)',
                    background: picked
                      ? (isCorrect ? 'rgba(52,211,153,0.15)' : (isWrongPick ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.04)'))
                      : 'rgba(255,255,255,0.04)',
                    color: picked
                      ? (isCorrect ? '#34d399' : (isWrongPick ? '#f87171' : '#475569'))
                      : '#fbbf24',
                  }}>
                  {lbl}
                </button>
              );
            })}
          </div>

          {picked && (
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              {picked === part.answer ? (
                <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
                  ✓ Correct — <b>{part.text}</b> is a {part.answer.toLowerCase()}.
                </span>
              ) : (
                <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>
                  Not quite — <b>{part.text}</b> is a {part.answer.toLowerCase()}.
                </span>
              )}
              <button onClick={nextPart}
                style={{
                  marginLeft: 12, padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                }}>
                Next →
              </button>
            </div>
          )}

          <div style={{
            borderRadius: 10, padding: '12px 14px',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
              Quick reminder
            </p>
            <p style={{ fontSize: 12, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
              <b style={{ color: COLOURS.term }}>Term</b>: a part separated by + or − (e.g. <i>4x</i>, <i>5y</i>, <i>3</i>)<br />
              <b style={{ color: COLOURS.variable }}>Variable</b>: the letter that can change (<i>x</i>, <i>y</i>, <i>m</i>)<br />
              <b style={{ color: COLOURS.coefficient }}>Coefficient</b>: the number multiplying a variable (<i>4</i>, <i>5</i>)<br />
              <b style={{ color: COLOURS.constant }}>Constant</b>: a stand-alone number with no variable (<i>3</i>)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
