'use client';

// PolynomialClassifierSim.tsx
// Class 9 Mathematics — Chapter 2 — Page 3 (What's a Polynomial? Degree & Family Tree)
// Two modes:
//   - Inspect: type any one-variable polynomial; sim parses, finds the highest
//     power (degree), names the family (constant / linear / quadratic / cubic / higher),
//     and lists the coefficient of every term.
//   - Quiz: random polynomial appears; student picks the family before reveal.
//
// Note: parser is intentionally simple (single variable, integer powers,
// "+" / "-" terms, optional coefficient). Bad input shows a helpful hint.

import { useState, useCallback, useMemo, useEffect } from 'react';

type Mode = 'inspect' | 'quiz';
type Family = 'constant' | 'linear' | 'quadratic' | 'cubic' | 'higher';

const FAMILY_COLOUR: Record<Family, string> = {
  constant: '#94a3b8',
  linear: '#34d399',
  quadratic: '#60a5fa',
  cubic: '#a78bfa',
  higher: '#f472b6',
};

interface ParsedTerm { coeff: number; power: number }
interface ParseOk { ok: true; variable: string | null; terms: ParsedTerm[] }
interface ParseErr { ok: false; error: string }
type Parsed = ParseOk | ParseErr;

// Parses a polynomial like "5y^3 + y^2 + 2y - 1" or "8" or "-3x + 7"
function parse(input: string): Parsed {
  const s = input.replace(/\s+/g, '').replace(/−/g, '-');
  if (!s) return { ok: false, error: 'Type a polynomial.' };

  // Detect the variable (single lowercase letter); allow constant-only
  const varMatch = s.match(/[a-zA-Z]/);
  const variable = varMatch ? varMatch[0] : null;

  // Reject multiple distinct variables
  if (variable) {
    const otherVar = s.split('').find(c => /[a-zA-Z]/.test(c) && c !== variable);
    if (otherVar) return { ok: false, error: `This sim handles ONE variable only. Found "${variable}" and "${otherVar}".` };
  }

  // Split into signed terms
  const tokens: string[] = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if ((ch === '+' || ch === '-') && i > 0 && s[i - 1] !== '^' && s[i - 1] !== '*') {
      if (cur) tokens.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) tokens.push(cur);

  const terms: ParsedTerm[] = [];
  for (const t of tokens) {
    if (!t || t === '+' || t === '-') return { ok: false, error: `Stray "${t}" — check the expression.` };
    let body = t;
    let sign = 1;
    if (body.startsWith('+')) body = body.slice(1);
    else if (body.startsWith('-')) { sign = -1; body = body.slice(1); }

    if (!body) return { ok: false, error: 'Empty term.' };

    if (!variable || !body.includes(variable)) {
      // Pure constant term
      const num = parseFloat(body);
      if (Number.isNaN(num)) return { ok: false, error: `Couldn't read "${body}" as a number.` };
      terms.push({ coeff: sign * num, power: 0 });
      continue;
    }
    // Has the variable
    const parts = body.split(variable);
    if (parts.length !== 2) return { ok: false, error: `Strange variable usage in "${body}".` };
    const [coeffPart, powerPart] = parts;
    let coeff = coeffPart === '' ? 1 : parseFloat(coeffPart);
    if (Number.isNaN(coeff)) return { ok: false, error: `Couldn't read coefficient in "${body}".` };
    let power = 1;
    if (powerPart) {
      if (!powerPart.startsWith('^')) return { ok: false, error: `Use ^ for powers (e.g. ${variable}^2). Got "${powerPart}".` };
      const p = parseInt(powerPart.slice(1), 10);
      if (Number.isNaN(p) || p < 0) return { ok: false, error: 'Power must be a non-negative integer.' };
      power = p;
    }
    terms.push({ coeff: sign * coeff, power });
  }
  return { ok: true, variable, terms };
}

function familyOf(degree: number): Family {
  if (degree === 0) return 'constant';
  if (degree === 1) return 'linear';
  if (degree === 2) return 'quadratic';
  if (degree === 3) return 'cubic';
  return 'higher';
}

const QUIZ_BANK: { expr: string; family: Family }[] = [
  { expr: '4x', family: 'linear' },
  { expr: 'x^2 + 1', family: 'quadratic' },
  { expr: '2y - 5', family: 'linear' },
  { expr: '5y^3 + y^2 + 2y - 1', family: 'cubic' },
  { expr: '3z + 7', family: 'linear' },
  { expr: '8', family: 'constant' },
  { expr: 'x^4 - 3x^3 + 6x^2 - 2x + 7', family: 'higher' },
  { expr: '7s^2 - 4s + 6', family: 'quadratic' },
  { expr: '2n - 1', family: 'linear' },
  { expr: '-9', family: 'constant' },
];

const FAMILIES: Family[] = ['constant', 'linear', 'quadratic', 'cubic', 'higher'];

export default function PolynomialClassifierSim() {
  const [mode, setMode] = useState<Mode>('inspect');

  // Inspect mode
  const [input, setInput] = useState('5y^3 + y^2 + 2y - 1');
  const parsed = parse(input);
  const degree = parsed.ok ? Math.max(0, ...parsed.terms.map(t => t.power)) : null;
  const family: Family | null = degree !== null ? familyOf(degree) : null;

  // Quiz mode
  const [quizIdx, setQuizIdx] = useState(0);
  const [picked, setPicked] = useState<Family | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const quiz = QUIZ_BANK[quizIdx];

  const submit = useCallback((f: Family) => {
    if (picked) return;
    setPicked(f);
    setScore(s => ({
      correct: s.correct + (f === quiz.family ? 1 : 0),
      total: s.total + 1,
    }));
  }, [picked, quiz.family]);

  const next = useCallback(() => {
    setPicked(null);
    setQuizIdx((quizIdx + 1) % QUIZ_BANK.length);
  }, [quizIdx]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m); setPicked(null);
  }, []);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Polynomial <span style={{ color: '#f59e0b' }}>Classifier</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Degree · Family · Coefficients — Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([['inspect', 'Inspect a Polynomial'], ['quiz', 'Quick Classification Quiz']] as [Mode, string][]).map(([m, label]) => {
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

      {mode === 'inspect' && (
        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
            Type any one-variable polynomial. Use <code>^</code> for powers (e.g. <code>x^2</code>). Try <code>5y^3 + y^2 + 2y - 1</code> or <code>-9</code> or <code>3z + 7</code>.
          </p>
          <input
            type="text" value={input} onChange={e => setInput(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 16, fontWeight: 700,
              background: '#0B0F15', border: '1px solid rgba(255,255,255,0.1)', color: '#fbbf24',
              fontVariantNumeric: 'tabular-nums', marginBottom: 14,
            }} />

          {!parsed.ok ? (
            <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{parsed.error}</p>
            </div>
          ) : (
            <div style={{ borderRadius: 10, padding: '14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
                Analysis
              </p>
              <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
                Variable: <b style={{ color: '#fbbf24' }}>{parsed.variable ?? '(none — pure constant)'}</b><br />
                Number of terms: <b>{parsed.terms.length}</b><br />
                Highest power (degree): <b style={{ color: '#fbbf24' }}>{degree}</b><br />
                Family: <b style={{ color: family ? FAMILY_COLOUR[family] : '#fff', textTransform: 'capitalize' }}>{family} polynomial</b>
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 10, lineHeight: 1.6 }}>
                Term-by-term coefficients:
              </p>
              <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: 12, color: '#e2e8f0', lineHeight: 1.6 }}>
                {[...parsed.terms].sort((a, b) => b.power - a.power).map((t, i) => (
                  <li key={i}>
                    coefficient of {parsed.variable ?? 'x'}<sup>{t.power}</sup> = <b style={{ color: '#fbbf24' }}>{t.coeff}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {mode === 'quiz' && (
        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
            Pick the family this polynomial belongs to. <b style={{ color: '#fbbf24' }}>Score: {score.correct}/{score.total}</b>
          </p>

          <div style={{
            borderRadius: 12, padding: '20px 14px', marginBottom: 14,
            background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#fbbf24',
          }}>
            {quiz.expr.replace(/\^(\d+)/g, '⁰¹²³⁴⁵⁶⁷⁸⁹'.split('').map((c, i) => `${c}`).join(''))
              .replace(/\^(\d+)/g, (_, n) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[parseInt(n, 10)] || `^${n}`)}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
            {FAMILIES.map(f => {
              const isCorrect = picked && f === quiz.family;
              const isWrongPick = picked === f && f !== quiz.family;
              return (
                <button key={f} onClick={() => submit(f)} disabled={!!picked}
                  style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: picked ? 'default' : 'pointer',
                    border: picked
                      ? (isCorrect ? `1.5px solid ${FAMILY_COLOUR[f]}` : (isWrongPick ? '1.5px solid rgba(248,113,113,0.7)' : '1px solid rgba(255,255,255,0.08)'))
                      : '1px solid rgba(255,255,255,0.08)',
                    background: picked
                      ? (isCorrect ? `${FAMILY_COLOUR[f]}33` : (isWrongPick ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.04)'))
                      : 'rgba(255,255,255,0.04)',
                    color: picked
                      ? (isCorrect ? FAMILY_COLOUR[f] : (isWrongPick ? '#f87171' : '#475569'))
                      : '#fbbf24',
                    textTransform: 'capitalize',
                  }}>
                  {f}
                </button>
              );
            })}
          </div>

          {picked && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 13, color: picked === quiz.family ? '#34d399' : '#f87171', margin: 0, fontWeight: 700 }}>
                {picked === quiz.family ? '✓ Correct!' : `Not quite — this is a ${quiz.family} polynomial.`}
              </p>
              <button onClick={next}
                style={{
                  marginTop: 10, padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                }}>Next →</button>
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: 14, borderRadius: 10, padding: '10px 14px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          <b style={{ color: FAMILY_COLOUR.constant }}>Constant</b> (deg 0)&nbsp;·&nbsp;
          <b style={{ color: FAMILY_COLOUR.linear }}>Linear</b> (deg 1)&nbsp;·&nbsp;
          <b style={{ color: FAMILY_COLOUR.quadratic }}>Quadratic</b> (deg 2)&nbsp;·&nbsp;
          <b style={{ color: FAMILY_COLOUR.cubic }}>Cubic</b> (deg 3)&nbsp;·&nbsp;
          <b style={{ color: FAMILY_COLOUR.higher }}>Higher</b> (deg 4+)
        </p>
      </div>
    </div>
  );
}
