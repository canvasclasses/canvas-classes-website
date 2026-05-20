'use client';

// LinearPatternExplorerSim.tsx
// Class 9 Mathematics — Chapter 2 — Pages 4 & 8
// Slide a (slope) and b (intercept). Live table of f(n) = a·n + b for n = 1..10
// plus a row of *successive differences* showing they're constant = a.
// "Compare with x²" toggle reveals non-constant differences for non-linear.

import { useState, useCallback, useMemo } from 'react';

const PRESETS: { name: string; a: number; b: number }[] = [
  { name: '4n  (square perimeter)', a: 4, b: 0 },
  { name: '200 + 50n  (chess club)', a: 50, b: 200 },
  { name: '100 − 5n  (Bela)', a: -5, b: 100 },
  { name: '15n − 5  (auto fare)', a: 15, b: -5 },
  { name: '120 − 9n  (rally)', a: -9, b: 120 },
  { name: '500 + 150n  (savings)', a: 150, b: 500 },
];

export default function LinearPatternExplorerSim() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(0);
  const [compareSquare, setCompareSquare] = useState(false);
  const [presetIdx, setPresetIdx] = useState(0);

  const applyPreset = useCallback((idx: number) => {
    setPresetIdx(idx);
    setA(PRESETS[idx].a);
    setB(PRESETS[idx].b);
  }, []);

  const values = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const n = i + 1;
      return a * n + b;
    });
  }, [a, b]);

  const diffs = useMemo(() => values.slice(1).map((v, i) => v - values[i]), [values]);
  const sqValues = useMemo(() => Array.from({ length: 10 }, (_, i) => (i + 1) * (i + 1)), []);
  const sqDiffs = useMemo(() => sqValues.slice(1).map((v, i) => v - sqValues[i]), [sqValues]);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Linear Pattern <span style={{ color: '#f59e0b' }}>Explorer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          The Constant-Difference Signature · Class 9 Mathematics
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        Choose values of <b>a</b> and <b>b</b> for the linear polynomial <b>a·n + b</b>. The table fills in <b>f(1), f(2), …, f(10)</b>, and the row underneath shows the <b>successive differences</b>. They're always equal to <b>a</b> — that's the signature of every linear pattern.
      </p>

      {/* Presets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {PRESETS.map((p, i) => {
          const active = i === presetIdx;
          return (
            <button key={p.name} onClick={() => applyPreset(i)}
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}>{p.name}</button>
          );
        })}
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>a (slope):</label>
        <input type="range" min={-20} max={20} step={1} value={a}
          onChange={e => setA(parseInt(e.target.value, 10))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{a}</span>

        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>b (intercept):</label>
        <input type="range" min={-100} max={500} step={5} value={b}
          onChange={e => setB(parseInt(e.target.value, 10))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{b}</span>
      </div>

      {/* Formula display */}
      <div style={{
        borderRadius: 12, padding: '14px', marginBottom: 14,
        background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
        textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#fbbf24',
      }}>
        f(n) = {a}n {b >= 0 ? '+' : '−'} {Math.abs(b)}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>n</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '6px 8px', color: '#fbbf24', fontWeight: 700 }}>f(n) = an + b</td>
              {values.map((v, i) => (
                <td key={i} style={{ padding: '6px 8px', color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{v}</td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '6px 8px', color: '#34d399', fontWeight: 700 }}>differences</td>
              <td></td>
              {diffs.map((d, i) => (
                <td key={i} style={{ padding: '6px 8px', color: '#34d399', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{d > 0 ? '+' : ''}{d}</td>
              ))}
            </tr>
            {compareSquare && (
              <>
                <tr>
                  <td style={{ padding: '6px 8px', color: '#a78bfa', fontWeight: 700, paddingTop: 12 }}>n² (compare)</td>
                  {sqValues.map((v, i) => (
                    <td key={i} style={{ padding: '6px 8px', color: '#a78bfa', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{v}</td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '6px 8px', color: '#f472b6', fontWeight: 700 }}>differences</td>
                  <td></td>
                  {sqDiffs.map((d, i) => (
                    <td key={i} style={{ padding: '6px 8px', color: '#f472b6', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>+{d}</td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={() => setCompareSquare(v => !v)}
        style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          border: compareSquare ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.08)',
          background: compareSquare ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.04)',
          color: compareSquare ? '#a78bfa' : '#94a3b8', marginBottom: 14,
        }}>
        {compareSquare ? '● Hide n² comparison' : '○ Compare with n² (non-linear)'}
      </button>

      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Linear-pattern signature
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
          For <b>f(n) = {a}n {b >= 0 ? '+' : '−'} {Math.abs(b)}</b>, every successive difference is <b style={{ color: '#34d399' }}>{a}</b>. {a > 0 ? `That's positive — linear growth.` : a < 0 ? `That's negative — linear decay.` : `That's zero — constant pattern.`}
          {compareSquare && <><br /><span style={{ color: '#a78bfa' }}>n² differences (3, 5, 7, 9, …) are <b>not</b> constant — that's why n² is *not* a linear pattern.</span></>}
        </p>
      </div>
    </div>
  );
}
