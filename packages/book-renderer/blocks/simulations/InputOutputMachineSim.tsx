'use client';

// InputOutputMachineSim.tsx
// Class 9 Mathematics — Chapter 2 — Pages 5 & 6 (Polynomials as Functions)
// A literal "function machine": pick a polynomial preset (or define a custom
// linear ax + b), drop in any input x, and the machine reports the output.
// "Reverse the machine" mode: given an output, the student finds the input
// that produces it (i.e., solves the linear equation).

import { useState, useCallback, useMemo, useEffect } from 'react';

interface Poly {
  name: string;
  fn: (x: number) => number;
  display: (x: number, y: number) => string;
  // For reverse mode (linear only): solve ax + b = y for x
  invertable: boolean;
  invert?: (y: number) => number;
}

const PRESETS: Poly[] = [
  {
    name: '2x + 3',
    fn: x => 2 * x + 3,
    display: (x, y) => `2(${x}) + 3 = ${y}`,
    invertable: true,
    invert: y => (y - 3) / 2,
  },
  {
    name: '4x  (square perimeter)',
    fn: x => 4 * x,
    display: (x, y) => `4(${x}) = ${y}`,
    invertable: true,
    invert: y => y / 4,
  },
  {
    name: '200 + 50m  (chess club)',
    fn: x => 200 + 50 * x,
    display: (x, y) => `200 + 50(${x}) = ${y}`,
    invertable: true,
    invert: y => (y - 200) / 50,
  },
  {
    name: '5x − 3',
    fn: x => 5 * x - 3,
    display: (x, y) => `5(${x}) − 3 = ${y}`,
    invertable: true,
    invert: y => (y + 3) / 5,
  },
  {
    name: '7s² − 4s + 6  (quadratic)',
    fn: x => 7 * x * x - 4 * x + 6,
    display: (x, y) => `7(${x})² − 4(${x}) + 6 = ${y}`,
    invertable: false,
  },
  {
    name: '10x − x²  (area)',
    fn: x => 10 * x - x * x,
    display: (x, y) => `10(${x}) − (${x})² = ${y}`,
    invertable: false,
  },
];

type Mode = 'forward' | 'reverse';

export default function InputOutputMachineSim() {
  const [mode, setMode] = useState<Mode>('forward');
  const [presetIdx, setPresetIdx] = useState(0);
  const poly = PRESETS[presetIdx];

  // Forward mode
  const [input, setInput] = useState('4');
  const x = parseFloat(input);
  const validX = !Number.isNaN(x);
  const y = validX ? poly.fn(x) : NaN;

  // Reverse mode
  const [target, setTarget] = useState('');
  const [guess, setGuess] = useState('');
  const [revStatus, setRevStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');
  const tnum = parseFloat(target);
  const validTarget = !Number.isNaN(tnum);

  useEffect(() => {
    if (mode === 'reverse' && poly.invertable && poly.invert) {
      // Pre-fill a sensible target (an integer output) when switching presets
      setTarget(String(poly.fn(5)));
      setGuess('');
      setRevStatus('pending');
    }
  }, [mode, presetIdx, poly]);

  const checkGuess = useCallback(() => {
    if (!poly.invertable || !poly.invert) return;
    const g = parseFloat(guess);
    if (Number.isNaN(g) || !validTarget) { setRevStatus('wrong'); return; }
    const expected = poly.invert(tnum);
    setRevStatus(Math.abs(g - expected) < 0.05 ? 'correct' : 'wrong');
  }, [guess, tnum, poly, validTarget]);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Input–Output <span style={{ color: '#f59e0b' }}>Machine</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Polynomials as Functions · Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([['forward', 'Forward: x → y'], ['reverse', 'Reverse: y → x  (solve)']] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button key={m} onClick={() => setMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}>{label}</button>
          );
        })}
      </div>

      {/* Preset chooser */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {PRESETS.map((p, i) => {
          const active = i === presetIdx;
          return (
            <button key={p.name} onClick={() => setPresetIdx(i)}
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(96,165,250,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#60a5fa' : '#94a3b8',
              }}>{p.name}</button>
          );
        })}
      </div>

      {/* The machine visual */}
      <div style={{
        borderRadius: 12, padding: '20px 14px', marginBottom: 14,
        background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
        display: 'grid', gridTemplateColumns: '1fr auto 2fr auto 1fr', alignItems: 'center', gap: 10,
      }}>
        {/* Input slot */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', margin: 0, marginBottom: 4 }}>INPUT (x)</p>
          {mode === 'forward' ? (
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              style={{
                width: '90%', padding: '8px 6px', borderRadius: 6, fontSize: 18, fontWeight: 800,
                background: '#1c2330', border: '1.5px solid rgba(245,158,11,0.5)', color: '#fbbf24',
                textAlign: 'center', fontVariantNumeric: 'tabular-nums',
              }} />
          ) : (
            <div style={{
              padding: '8px 6px', borderRadius: 6, fontSize: 18, fontWeight: 800,
              background: '#1c2330', border: '1.5px solid rgba(167,139,250,0.5)', color: '#c7d2fe',
              fontVariantNumeric: 'tabular-nums',
            }}>?</div>
          )}
        </div>

        {/* Arrow */}
        <span style={{ fontSize: 28, color: '#475569' }}>→</span>

        {/* Machine box */}
        <div style={{
          background: 'linear-gradient(135deg, #1f2937, #0f172a)',
          borderRadius: 10, padding: '14px', border: '1px solid rgba(96,165,250,0.3)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', margin: 0, marginBottom: 2, letterSpacing: '0.06em' }}>
            FUNCTION
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
            y = {poly.name.split('  ')[0]}
          </p>
        </div>

        {/* Arrow */}
        <span style={{ fontSize: 28, color: '#475569' }}>→</span>

        {/* Output slot */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', margin: 0, marginBottom: 4 }}>OUTPUT (y)</p>
          {mode === 'forward' ? (
            <div style={{
              padding: '8px 6px', borderRadius: 6, fontSize: 18, fontWeight: 800,
              background: '#1c2330', border: '1.5px solid rgba(52,211,153,0.5)', color: '#34d399',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {validX ? y : '—'}
            </div>
          ) : (
            <input type="text" value={target} onChange={e => setTarget(e.target.value)}
              style={{
                width: '90%', padding: '8px 6px', borderRadius: 6, fontSize: 18, fontWeight: 800,
                background: '#1c2330', border: '1.5px solid rgba(52,211,153,0.5)', color: '#34d399',
                textAlign: 'center', fontVariantNumeric: 'tabular-nums',
              }} />
          )}
        </div>
      </div>

      {mode === 'forward' && validX && (
        <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
            Substitution
          </p>
          <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
            {poly.display(x, y)}
          </p>
        </div>
      )}

      {mode === 'reverse' && (
        <div>
          {!poly.invertable ? (
            <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <p style={{ fontSize: 12, color: '#f87171', margin: 0, lineHeight: 1.6 }}>
                <b>{poly.name.split('  ')[0]}</b> is <b>not</b> a linear polynomial. The reverse problem (given y, find x) doesn't have a clean single answer — and may have <b>two</b> answers, or <b>none</b>. Pick a linear preset to use this mode.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
                Set the target output above, then type your guess for x. The sim checks against the unique solution to the linear equation.
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Your x =</label>
                <input type="text" value={guess} onChange={e => setGuess(e.target.value)}
                  style={{
                    width: 100, padding: '6px 8px', borderRadius: 6, fontSize: 14, fontWeight: 700,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fbbf24', textAlign: 'center', fontVariantNumeric: 'tabular-nums',
                  }} />
                <button onClick={checkGuess}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
                  }}>Check</button>
                {revStatus === 'correct' && (
                  <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>✓ Correct.</span>
                )}
                {revStatus === 'wrong' && validTarget && poly.invert && (
                  <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>
                    Not quite — solving {poly.name.split('  ')[0]} = {tnum} gives x = {poly.invert(tnum)}.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
