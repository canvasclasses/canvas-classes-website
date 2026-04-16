'use client';

// Free Fall Simulator — Chapter 3: Gravitation
// Demonstrates uniform acceleration under gravity: g = 9.8 m/s²
// Shows v = gt, s = ½gt², feather vs ball in vacuum/air

import { useEffect, useRef, useState, useCallback } from 'react';

const g = 9.8; // m/s²

type Phase = 'idle' | 'falling' | 'landed';
type ObjType = 'ball' | 'feather' | 'hammer';

interface ObjConfig {
  label: string;
  color: string;
  emoji: string;
  drag: number; // air drag coefficient (0 = no air resistance)
}

const OBJECTS: Record<ObjType, ObjConfig> = {
  ball:    { label: 'Ball',    color: '#60a5fa', emoji: '⚽', drag: 0.15 },
  feather: { label: 'Feather', color: '#fbbf24', emoji: '🪶', drag: 1.8  },
  hammer:  { label: 'Hammer',  color: '#94a3b8', emoji: '🔨', drag: 0.05 },
};

// v-t graph constants
const GW = 240, GH = 120;
const GP = { t: 28, r: 8, b: 24, l: 28 };
const gInnerW = GW - GP.l - GP.r;
const gInnerH = GH - GP.t - GP.b;

export default function FreeFallSim() {
  const [height, setHeight] = useState(50);      // metres
  const [objType, setObjType] = useState<ObjType>('ball');
  const [airResistance, setAirResistance] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');

  const tRef    = useRef(0);
  const prevRef = useRef(0);
  const rafRef  = useRef(0);

  const [elapsed, setElapsed]   = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [fallen,   setFallen]   = useState(0);
  const [history,  setHistory]  = useState<{ t: number; v: number }[]>([]);

  // Time to hit ground (no air resistance)
  const tTotal = Math.sqrt((2 * height) / g);

  const obj = OBJECTS[objType];
  const drag = airResistance ? obj.drag : 0;

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    tRef.current = 0; prevRef.current = 0;
    setPhase('idle'); setElapsed(0); setVelocity(0);
    setFallen(0); setHistory([]);
  }, []);

  useEffect(() => { reset(); }, [height, objType, airResistance, reset]);

  const start = useCallback(() => {
    if (phase === 'falling') return;
    reset();
    setPhase('falling');

    // Use Euler integration for air resistance; analytic for vacuum
    let t = 0, v = 0, s = 0;
    let prev = performance.now();
    const hist: { t: number; v: number }[] = [{ t: 0, v: 0 }];

    function frame(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      t += dt;

      if (drag > 0) {
        const a = g - drag * v;
        v = Math.max(0, v + a * dt);
        s += v * dt;
      } else {
        v = g * t;
        s = 0.5 * g * t * t;
      }

      if (s >= height) {
        const vFinal = drag > 0 ? v : g * tTotal;
        setElapsed(t); setVelocity(vFinal); setFallen(height);
        setHistory([...hist, { t, v: vFinal }]);
        setPhase('landed');
        return;
      }

      setElapsed(t); setVelocity(v); setFallen(s);
      if (Math.floor(t * 10) > Math.floor((t - dt) * 10)) {
        hist.push({ t, v });
        setHistory([...hist]);
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [phase, reset, height, drag, tTotal]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Visual: fraction fallen (0–1)
  const frac = Math.min(fallen / height, 1);

  // SVG layout
  const SW = 200, SH = 320;
  const trackTop = 30, trackBot = SH - 40;
  const trackH = trackBot - trackTop;
  const objY = trackTop + frac * (trackH - 28);
  const velArrowH = Math.min(60, (velocity / (g * tTotal)) * 55);

  // v-t graph path
  const vtPath = (() => {
    if (history.length < 2) return '';
    const maxT = Math.max(tTotal * 1.05, elapsed + 0.1);
    const maxV = g * tTotal * 1.1;
    const pts = history.map(({ t, v }) => {
      const x = GP.l + (t / maxT) * gInnerW;
      const y = GP.t + gInnerH - (v / maxV) * gInnerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${pts.join(' L ')}`;
  })();

  const statStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '8px 12px', textAlign: 'center',
  };

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Free Fall Simulator</h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          All objects fall with the same acceleration g = 9.8 m/s² (in vacuum)
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — drop animation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(180deg, #060a18 0%, #0a0e1a 100%)',
            border: '1px solid rgba(96,165,250,0.15)',
            borderRadius: 14, overflow: 'hidden',
            display: 'flex', justifyContent: 'center',
          }}>
            <svg viewBox={`0 0 ${SW} ${SH}`}
              style={{ width: '100%', maxWidth: SW, display: 'block' }}>

              {/* Sky gradient */}
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#060a18" />
                  <stop offset="100%" stopColor="#0d1a2e" />
                </linearGradient>
              </defs>
              <rect x={0} y={0} width={SW} height={SH} fill="url(#sky)" />

              {/* Height labels */}
              <text x={14} y={trackTop + 5} fill="#475569" fontSize={9}>
                {height}m
              </text>
              <text x={14} y={trackBot + 4} fill="#475569" fontSize={9}>0m</text>

              {/* Track line */}
              <line x1={SW / 2} y1={trackTop} x2={SW / 2} y2={trackBot}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,4" />

              {/* Ground */}
              <rect x={20} y={trackBot} width={SW - 40} height={8}
                rx={2} fill="rgba(100,116,139,0.3)" />
              <line x1={20} y1={trackBot} x2={SW - 20} y2={trackBot}
                stroke="#475569" strokeWidth={1.5} />

              {/* Fallen distance label */}
              {phase !== 'idle' && (
                <>
                  <line x1={24} y1={trackTop} x2={24} y2={objY + 14}
                    stroke="rgba(251,146,60,0.3)" strokeWidth={1} />
                  <text x={28} y={(trackTop + objY + 14) / 2}
                    fill="#fb923c" fontSize={9} dominantBaseline="middle">
                    {fallen.toFixed(1)}m
                  </text>
                </>
              )}

              {/* Object */}
              <g transform={`translate(${SW / 2}, ${objY + 14})`}>
                {/* Shadow */}
                <ellipse cx={0} cy={16} rx={16} ry={4}
                  fill="rgba(0,0,0,0.4)"
                  opacity={1 - frac * 0.6} />
                {/* Body */}
                <circle cx={0} cy={0} r={14}
                  fill={obj.color} opacity={0.9}
                  stroke={obj.color} strokeWidth={1.5} />
                {/* Velocity arrow */}
                {phase === 'falling' && velocity > 0.5 && (
                  <line x1={0} y1={14} x2={0} y2={14 + velArrowH}
                    stroke="#f87171" strokeWidth={2.5}
                    markerEnd="url(#arr-red)" />
                )}
                {/* Emoji label */}
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={16} y={1}>{obj.emoji}</text>
              </g>

              <defs>
                <marker id="arr-red" markerWidth="5" markerHeight="5"
                  refX="2.5" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
                </marker>
              </defs>

              {/* Landed splash */}
              {phase === 'landed' && (
                <g transform={`translate(${SW / 2}, ${trackBot})`}>
                  {[-20, -10, 0, 10, 20].map((dx, i) => (
                    <line key={i} x1={dx} y1={-2} x2={dx + (dx < 0 ? -4 : dx > 0 ? 4 : 0)} y2={-10}
                      stroke={obj.color} strokeWidth={1.5} opacity={0.7} />
                  ))}
                </g>
              )}

              {/* Status text */}
              <text x={SW / 2} y={SH - 10} textAnchor="middle"
                fill={phase === 'landed' ? '#4ade80' : '#64748b'} fontSize={10} fontWeight={600}>
                {phase === 'idle' ? 'Press DROP to release' :
                  phase === 'falling' ? `Falling… ${elapsed.toFixed(2)}s` :
                    `Landed after ${elapsed.toFixed(2)} s`}
              </text>
            </svg>
          </div>

          {/* v-t graph */}
          <div style={{
            marginTop: 12,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Velocity–Time Graph
            </p>
            <svg viewBox={`0 0 ${GW} ${GH}`}
              style={{ width: '100%', maxWidth: GW, display: 'block' }}>
              {/* Axes */}
              <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + gInnerH}
                stroke="#334155" strokeWidth={1} />
              <line x1={GP.l} y1={GP.t + gInnerH} x2={GP.l + gInnerW} y2={GP.t + gInnerH}
                stroke="#334155" strokeWidth={1} />
              <text x={GP.l - 4} y={GP.t} textAnchor="end"
                fill="#475569" fontSize={8} dominantBaseline="middle">
                v
              </text>
              <text x={GP.l + gInnerW} y={GP.t + gInnerH + 10}
                fill="#475569" fontSize={8} textAnchor="middle">
                t (s)
              </text>

              {/* Ideal (vacuum) line */}
              {phase !== 'idle' && (
                <line
                  x1={GP.l} y1={GP.t + gInnerH}
                  x2={GP.l + gInnerW * 0.95} y2={GP.t + gInnerH * 0.05}
                  stroke="rgba(96,165,250,0.25)" strokeWidth={1} strokeDasharray="3,3"
                />
              )}

              {/* Actual v-t path */}
              {vtPath && (
                <path d={vtPath} fill="none"
                  stroke={airResistance ? '#fbbf24' : '#60a5fa'}
                  strokeWidth={2} strokeLinejoin="round" />
              )}

              {/* Labels */}
              <text x={GP.l + gInnerW * 0.5} y={GP.t + 8}
                fill="rgba(96,165,250,0.5)" fontSize={8} textAnchor="middle">
                v = gt (vacuum)
              </text>
            </svg>
          </div>
        </div>

        {/* RIGHT — controls + stats */}
        <div style={{ width: 244, flexShrink: 0 }}>

          {/* Object selector */}
          <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Object
          </p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {(Object.entries(OBJECTS) as [ObjType, ObjConfig][]).map(([k, o]) => (
              <button key={k} onClick={() => setObjType(k)} style={{
                flex: 1, padding: '7px 0', borderRadius: 8, cursor: 'pointer',
                border: objType === k ? `2px solid ${o.color}` : '1px solid rgba(255,255,255,0.08)',
                background: objType === k ? `${o.color}18` : 'transparent',
                color: objType === k ? o.color : '#64748b',
                fontSize: 11, fontWeight: 600,
              }}>
                {o.emoji}<br />{o.label}
              </button>
            ))}
          </div>

          {/* Height */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Drop height</span>
              <span style={{ fontSize: 13, color: '#fb923c', fontWeight: 700 }}>{height} m</span>
            </div>
            <input type="range" min={10} max={200} step={5} value={height}
              onChange={e => setHeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fb923c' }} />
          </div>

          {/* Air resistance toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 18, padding: '10px 12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8,
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>Air resistance</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                {airResistance ? 'Objects fall at different rates' : 'All objects fall identically'}
              </div>
            </div>
            <button onClick={() => setAirResistance(v => !v)} style={{
              width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
              border: 'none',
              background: airResistance ? '#fb923c' : 'rgba(255,255,255,0.1)',
              position: 'relative', flexShrink: 0, transition: 'background 0.2s',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: airResistance ? 21 : 3, transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {/* Drop / Reset buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={start} disabled={phase === 'falling'} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              border: 'none', cursor: phase === 'falling' ? 'not-allowed' : 'pointer',
              background: phase === 'falling'
                ? 'rgba(251,146,60,0.3)'
                : 'linear-gradient(135deg, #fb923c, #f59e0b)',
              color: '#000', fontSize: 13, fontWeight: 700,
              opacity: phase === 'falling' ? 0.6 : 1,
            }}>
              {phase === 'falling' ? 'Falling…' : '▼ Drop'}
            </button>
            <button onClick={reset} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
              color: '#94a3b8', fontSize: 13, fontWeight: 600,
            }}>
              Reset
            </button>
          </div>

          {/* Live stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Time', val: `${elapsed.toFixed(2)} s`,  color: '#a78bfa' },
              { label: 'Velocity', val: `${velocity.toFixed(1)} m/s`, color: '#f87171' },
              { label: 'Distance', val: `${fallen.toFixed(1)} m`, color: '#fb923c' },
              { label: 'g', val: '9.8 m/s²', color: '#4ade80' },
            ].map(({ label, val, color }) => (
              <div key={label} style={statStyle}>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, color, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Equations */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Free-fall equations
            </p>
            {[
              'v = g × t',
              's = ½ × g × t²',
              'v² = 2 × g × s',
              `t_impact = √(2h/g) ≈ ${tTotal.toFixed(2)} s`,
            ].map(eq => (
              <div key={eq} style={{
                fontSize: 12, color: '#60a5fa', fontWeight: 600,
                padding: '4px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>{eq}</div>
            ))}
            <p style={{ fontSize: 11, color: '#64748b', margin: '8px 0 0', lineHeight: 1.5 }}>
              {airResistance
                ? `${obj.label} has drag coefficient ${obj.drag} — notice it falls slower than in vacuum.`
                : 'In vacuum, all objects experience the same g regardless of mass (Galileo).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
