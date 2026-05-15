'use client';

// Work Done Explorer — Chapter 4: Work and Energy
// W = F × d × cos θ
// Source: NCERT Class 9 Science, Chapter 11 (Work and Energy)
// Academic accuracy: work is done only when displacement occurs in the direction of force.
// cos θ component: θ = 0° → max work; θ = 90° → zero work; θ > 90° → negative work.

import { useState, useMemo } from 'react';

interface Scenario {
  label: string;
  emoji: string;
  F: number;
  d: number;
  theta: number;
  desc: string;
}

const SCENARIOS: Scenario[] = [
  { label: 'Push box',    emoji: '📦', F: 60,  d: 8,  theta: 0,  desc: 'Force parallel to displacement — maximum work done.' },
  { label: 'Carry bag',   emoji: '🎒', F: 50,  d: 10, theta: 90, desc: 'Lifting force is perpendicular to horizontal motion — zero work by hand!' },
  { label: 'Slope pull',  emoji: '⛷️', F: 80,  d: 6,  theta: 30, desc: 'Force at 30° to displacement — only the horizontal component does work.' },
  { label: 'Brake stop',  emoji: '🚗', F: 500, d: 5,  theta: 180, desc: 'Friction opposes motion — negative work (removes energy from the system).' },
  { label: 'Custom',      emoji: '🔧', F: 40,  d: 5,  theta: 45, desc: 'Adjust sliders to explore any combination.' },
];

function toDeg(r: number) { return r * 180 / Math.PI; }
function toRad(d: number) { return d * Math.PI / 180; }

// NCERT: work W = F × d × cos θ (in Joules when F in N, d in m)
function calcWork(F: number, d: number, theta: number) {
  return F * d * Math.cos(toRad(theta));
}

export default function WorkDoneSim() {
  const [F, setF]         = useState(60);
  const [d, setD]         = useState(8);
  const [theta, setTheta] = useState(0);
  const [scenario, setScenario] = useState(0);

  const W = calcWork(F, d, theta);
  const cosT = Math.cos(toRad(theta));
  const Feff = F * cosT;           // effective (component along displacement)

  // Colour coding based on work sign
  const wColor = W > 0.5 ? '#34d399' : W < -0.5 ? '#f87171' : '#fbbf24';
  const wLabel = W > 0.5 ? 'Positive Work' : W < -0.5 ? 'Negative Work' : 'Zero Work';

  function applyScenario(idx: number) {
    const s = SCENARIOS[idx];
    setF(s.F); setD(s.d); setTheta(s.theta); setScenario(idx);
  }

  // ── SVG geometry ───────────────────────────────────────────────────────────
  const SVG_W = 500, SVG_H = 200;
  const groundY = SVG_H - 36;
  const boxSize = 40;
  // Box starts at left, moves right by d (scaled)
  const boxX = 60;
  const dScale = Math.min(1, (SVG_W - 180) / (d * 20));
  const dispLen = d * dScale * 20;   // displacement arrow pixel length
  const forceLen = Math.min(100, F * 0.8);  // force arrow pixel length
  const thetaRad = toRad(theta);
  // Force arrow from box centre
  const bCx = boxX + boxSize / 2;
  const bCy = groundY - boxSize / 2;
  const fArrowX = bCx + forceLen * Math.cos(thetaRad);
  const fArrowY = bCy - forceLen * Math.sin(thetaRad);  // SVG y inverted

  // Stars in bg
  const stars = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    cx: (i * 137 + 23) % SVG_W,
    cy: (i * 83 + 10) % (groundY - 10),
    r: 0.7,
  })), [groundY]);

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Work Done Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          W = F × d × cos θ — work is done only when force has a component along displacement
        </p>
      </div>

      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const }}>
        {SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => applyScenario(i)} style={{
            padding: '5px 12px', borderRadius: 20,
            border: scenario === i ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
            background: scenario === i ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
            color: scenario === i ? '#818cf8' : '#94a3b8',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — SVG */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}>
              {/* Stars */}
              {stars.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="rgba(255,255,255,0.3)" />
              ))}

              {/* Ground */}
              <line x1={0} y1={groundY} x2={SVG_W} y2={groundY}
                stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
              {/* Ground hash marks */}
              {Array.from({ length: 20 }, (_, i) => (
                <line key={i} x1={i * 28} y1={groundY} x2={i * 28 - 8} y2={groundY + 10}
                  stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
              ))}

              {/* Displacement arrow */}
              <defs>
                <marker id="disp-arrow" markerWidth="7" markerHeight="7"
                  refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#6366f1" />
                </marker>
                <marker id="force-arrow" markerWidth="7" markerHeight="7"
                  refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#fbbf24" />
                </marker>
                <marker id="comp-arrow" markerWidth="7" markerHeight="7"
                  refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#34d399" />
                </marker>
              </defs>
              <line
                x1={bCx} y1={groundY - 4}
                x2={bCx + dispLen} y2={groundY - 4}
                stroke="#6366f1" strokeWidth={2.5}
                markerEnd="url(#disp-arrow)"
              />
              <text x={bCx + dispLen / 2} y={groundY + 16} textAnchor="middle"
                fill="#818cf8" fontSize={10} fontWeight={600}>
                d = {d} m
              </text>

              {/* Box */}
              <rect x={boxX} y={groundY - boxSize} width={boxSize} height={boxSize}
                rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1.5} />
              {/* Box grid lines */}
              <line x1={boxX + boxSize / 2} y1={groundY - boxSize} x2={boxX + boxSize / 2} y2={groundY}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              <line x1={boxX} y1={groundY - boxSize / 2} x2={boxX + boxSize} y2={groundY - boxSize / 2}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

              {/* Force arrow (at angle theta) */}
              <line
                x1={bCx} y1={bCy}
                x2={fArrowX} y2={fArrowY}
                stroke="#fbbf24" strokeWidth={2.5}
                markerEnd="url(#force-arrow)"
              />
              <text x={fArrowX + 6} y={fArrowY - 4}
                fill="#fbbf24" fontSize={10} fontWeight={600}>
                F = {F} N
              </text>

              {/* Effective component (horizontal) */}
              {Math.abs(theta) > 1 && Math.abs(theta) < 179 && (
                <>
                  <line
                    x1={bCx} y1={bCy}
                    x2={bCx + Feff * 0.8 * dScale * 10} y2={bCy}
                    stroke="#34d399" strokeWidth={2} strokeDasharray="5,3"
                    markerEnd="url(#comp-arrow)"
                  />
                  <text x={bCx + (Feff * 0.8 * dScale * 10) / 2} y={bCy - 8}
                    textAnchor="middle" fill="#34d399" fontSize={10}>
                    F·cos{theta}° = {Math.abs(Feff).toFixed(1)} N
                  </text>

                  {/* Angle arc */}
                  {theta !== 180 && (
                    <path
                      d={`M ${bCx + 22} ${bCy} A 22 22 0 0 ${thetaRad > 0 ? 0 : 1} ${bCx + 22 * Math.cos(thetaRad)} ${bCy - 22 * Math.sin(thetaRad)}`}
                      fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth={1.5}
                    />
                  )}
                  <text x={bCx + 28} y={bCy + 5} fill="#fbbf24" fontSize={9}>{theta}°</text>
                </>
              )}

              {/* Work result */}
              <text x={SVG_W / 2} y={SVG_H - 12} textAnchor="middle"
                fill={wColor} fontSize={12} fontWeight={700}>
                W = {W.toFixed(1)} J  ({wLabel})
              </text>
            </svg>
          </div>

          {/* Concept callout */}
          <div style={{
            marginTop: 12,
            background: theta === 90 ? 'rgba(248,113,113,0.07)' : 'rgba(99,102,241,0.07)',
            border: `1px solid ${theta === 90 ? 'rgba(248,113,113,0.2)' : 'rgba(99,102,241,0.2)'}`,
            borderRadius: 10, padding: '10px 14px',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: theta === 90 ? '#f87171' : '#818cf8' }}>
                {theta === 90 ? '⚠ Zero Work! ' : theta > 90 ? '⚠ Negative Work! ' : '✓ Positive Work. '}
              </strong>
              {SCENARIOS[scenario].desc}
            </p>
          </div>
        </div>

        {/* RIGHT — controls */}
        <div style={{ width: 240, flexShrink: 0 }}>

          {/* Sliders */}
          {([
            { label: 'Force F (N)', val: F, set: setF, min: 1, max: 200, color: '#fbbf24' },
            { label: 'Displacement d (m)', val: d, set: setD, min: 1, max: 20, color: '#6366f1' },
            { label: 'Angle θ (degrees)', val: theta, set: setTheta, min: 0, max: 180, color: '#fb923c' },
          ] as { label: string; val: number; set: (n: number) => void; min: number; max: number; color: string }[])
            .map(({ label, val, set, min, max, color }) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 14, color, fontWeight: 700 }}>{val}</span>
                </div>
                <input type="range" min={min} max={max} value={val}
                  onChange={e => { set(Number(e.target.value)); setScenario(4); }}
                  style={{ width: '100%', accentColor: color }} />
              </div>
            ))}

          {/* Live formula */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '14px 12px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Live Formula
            </p>
            <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.8, textAlign: 'center' }}>
              <div>
                <span style={{ color: wColor, fontWeight: 700 }}>W</span>
                {' = '}
                <span style={{ color: '#fbbf24' }}>{F}</span>
                {' × '}
                <span style={{ color: '#6366f1' }}>{d}</span>
                {' × cos('}
                <span style={{ color: '#fb923c' }}>{theta}°</span>
                {')'}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 8 }}>
                <span style={{ color: wColor, fontWeight: 700 }}>{' = '}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: wColor }}>
                  {W.toFixed(1)} J
                </span>
              </div>
            </div>
          </div>

          {/* Key concepts */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Key Concepts
            </p>
            {[
              { term: 'Condition', def: 'Work is done only if displacement occurs AND force has a component along it.' },
              { term: 'θ = 0°', def: 'Max work: W = F × d (pushing in direction of motion).' },
              { term: 'θ = 90°', def: 'Zero work (carrying bag horizontally).' },
              { term: 'θ = 180°', def: 'Negative work — force opposes motion (friction, braking).' },
              { term: 'Unit', def: '1 Joule = 1 Newton × 1 metre' },
            ].map(({ term, def }) => (
              <div key={term} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 700 }}>{term}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{def}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
