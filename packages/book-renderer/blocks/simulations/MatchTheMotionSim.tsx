'use client';

// MatchTheMotionSim.tsx
// Class 9 Physics — Chapter 9: Motion (Page 6 — Position-Time Graphs)
// Game: a target position-time curve is shown. The student drives a "puck"
// in real time using a velocity slider. Their actual p-t curve is plotted
// alongside the target. After 10 seconds, a match percentage is shown.
// Source: NCERT Class 9 Science (Exploration), §4.2 — graph reading skills.

import { useState, useEffect, useRef, useCallback } from 'react';

type Level = 'uniform' | 'accel' | 'multi';

interface LevelConfig {
  id: Level;
  label: string;
  sublabel: string;
  // Returns the target position (in metres) at time t (seconds, 0..T)
  target: (t: number) => number;
  hint: string;
}

const T_TOTAL = 10;       // simulation duration (seconds)
const X_MAX = 100;        // metres on y-axis

const LEVELS: LevelConfig[] = [
  {
    id: 'uniform',
    label: 'Level 1',
    sublabel: 'Constant speed',
    // 10 m/s for the whole 10 s ⇒ 0 → 100 m linearly
    target: (t) => 10 * t,
    hint: 'Hold the slider steady at one value the whole time.',
  },
  {
    id: 'accel',
    label: 'Level 2',
    sublabel: 'Speeding up',
    // a = 2 m/s², starts at rest ⇒ x = ½ × 2 × t² = t²
    target: (t) => t * t,
    hint: 'Slowly increase the slider from 0 — let the curve bend upward.',
  },
  {
    id: 'multi',
    label: 'Level 3',
    sublabel: 'Cruise then brake',
    target: (t) => {
      // 0 → 5 s: 12 m/s steady (60 m); 5 → 10 s: decelerate to 0 (covers 30 m more)
      if (t <= 5) return 12 * t;
      const tau = t - 5;
      const v0 = 12;
      const a = -12 / 5; // deceleration to stop in 5 s
      return 60 + v0 * tau + 0.5 * a * tau * tau;
    },
    hint: 'Hold high for 5 s, then drop the slider to zero by t = 10 s.',
  },
];

interface Sample { t: number; xT: number; xS: number; }

export default function MatchTheMotionSim() {
  const [levelId, setLevelId] = useState<Level>('uniform');
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [velocity, setVelocity] = useState(0); // student's current velocity setting (m/s)
  const [samples, setSamples] = useState<Sample[]>([{ t: 0, xT: 0, xS: 0 }]);

  const lastTRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);
  const tRef     = useRef(0);
  const xSRef    = useRef(0);
  const velRef   = useRef(0);

  useEffect(() => { velRef.current = velocity; }, [velocity]);

  const level = LEVELS.find(l => l.id === levelId)!;

  // ── Animation loop ────────────────────────────────────────────────────────
  const tick = useCallback((ts: number) => {
    if (lastTRef.current === null) lastTRef.current = ts;
    const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
    lastTRef.current = ts;

    tRef.current += dt;
    xSRef.current += velRef.current * dt;
    if (xSRef.current < 0) xSRef.current = 0;
    if (xSRef.current > X_MAX) xSRef.current = X_MAX;

    if (tRef.current >= T_TOTAL) {
      tRef.current = T_TOTAL;
      setRunning(false);
      setFinished(true);
      setSamples(prev => [...prev, { t: T_TOTAL, xT: level.target(T_TOTAL), xS: xSRef.current }]);
      return;
    }

    setSamples(prev => [...prev, {
      t: tRef.current,
      xT: level.target(tRef.current),
      xS: xSRef.current,
    }]);

    rafRef.current = requestAnimationFrame(tick);
  }, [level]);

  useEffect(() => {
    if (running) {
      lastTRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [running, tick]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const start = () => {
    tRef.current = 0;
    xSRef.current = 0;
    velRef.current = velocity;
    setSamples([{ t: 0, xT: 0, xS: 0 }]);
    setFinished(false);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setFinished(false);
    tRef.current = 0;
    xSRef.current = 0;
    setVelocity(0);
    setSamples([{ t: 0, xT: 0, xS: 0 }]);
  };

  const switchLevel = (id: Level) => {
    if (running) return;
    setLevelId(id);
    reset();
  };

  // ── Score ─────────────────────────────────────────────────────────────────
  let score = 0;
  if (finished && samples.length > 1) {
    let totErr = 0;
    let totMag = 0;
    for (const s of samples) {
      totErr += Math.abs(s.xS - s.xT);
      totMag += Math.max(s.xT, 1);
    }
    score = Math.max(0, Math.min(100, Math.round(100 * (1 - totErr / totMag))));
  }

  // ── SVG geometry ──────────────────────────────────────────────────────────
  const SVG_W = 720;
  const SVG_H = 380;
  const PAD_L = 50;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 35;
  const plotW = SVG_W - PAD_L - PAD_R;
  const plotH = SVG_H - PAD_T - PAD_B;
  const tToX = (t: number) => PAD_L + (t / T_TOTAL) * plotW;
  const xToY = (x: number) => PAD_T + plotH - (x / X_MAX) * plotH;

  const targetPathD = `M ${tToX(0)} ${xToY(level.target(0))} ` +
    Array.from({ length: 60 }).map((_, i) => {
      const t = ((i + 1) / 60) * T_TOTAL;
      return `L ${tToX(t)} ${xToY(Math.min(level.target(t), X_MAX))}`;
    }).join(' ');

  const studentPathD = samples.length < 2 ? '' :
    `M ${tToX(samples[0].t)} ${xToY(samples[0].xS)} ` +
    samples.slice(1).map(s => `L ${tToX(s.t)} ${xToY(s.xS)}`).join(' ');

  return (
    <div className="p-4 md:p-6"
         style={{ background:'#0d1117', color:'#e2e8f0', minHeight:'80vh' }}>
      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Match the <span style={{color:'#7c3aed'}}>Motion</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
             style={{color:'#475569'}}>
            Drive the puck so its p-t curve matches the target
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1"
             style={{color:'#64748b'}}>
          NCERT Class 9 — §4.2.2
        </div>
      </div>

      {/* Level selector */}
      <div className="grid grid-cols-3 mb-4">
        {LEVELS.map(l => {
          const active = l.id === levelId;
          return (
            <button key={l.id} onClick={()=>switchLevel(l.id)} disabled={running}
                    className="px-3 py-2 text-center transition-all"
                    style={{
                      borderBottom:`2px solid ${active ? '#818cf8' : 'rgba(255,255,255,0.06)'}`,
                      opacity: active ? 1 : 0.5,
                      background:'none', outline:'none',
                      cursor: running ? 'not-allowed' : 'pointer',
                    }}>
              <div className="text-xs font-black" style={{color:'#c4b5fd'}}>{l.label}</div>
              <div className="text-[10px]" style={{color:'#475569'}}>{l.sublabel}</div>
            </button>
          );
        })}
      </div>

      {/* SVG plot */}
      <div className="relative overflow-hidden rounded-3xl mb-4"
           style={{
             background:'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
             border:'1px solid rgba(99,102,241,0.2)',
             padding: 12,
           }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display:'block', height:'auto' }}>
          {/* Grid */}
          {Array.from({ length: 11 }).map((_, i) => {
            const t = i;
            return <line key={`v${i}`} x1={tToX(t)} y1={PAD_T} x2={tToX(t)} y2={PAD_T + plotH}
                         stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>;
          })}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = i * 10;
            return <line key={`h${i}`} x1={PAD_L} y1={xToY(x)} x2={PAD_L + plotW} y2={xToY(x)}
                         stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>;
          })}

          {/* Axes */}
          <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH}
                stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH}
                stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>

          {/* Axis labels */}
          {[0, 2, 4, 6, 8, 10].map(t => (
            <text key={`tx${t}`} x={tToX(t)} y={SVG_H - 12} textAnchor="middle"
                  fontSize={10} fill="#64748b">{t}</text>
          ))}
          <text x={PAD_L + plotW / 2} y={SVG_H - 2} textAnchor="middle"
                fontSize={10} fill="#94a3b8" fontWeight={700}>Time (s)</text>
          {[0, 25, 50, 75, 100].map(x => (
            <text key={`yx${x}`} x={PAD_L - 6} y={xToY(x) + 3} textAnchor="end"
                  fontSize={10} fill="#64748b">{x}</text>
          ))}
          <text x={14} y={PAD_T + plotH / 2} textAnchor="middle"
                fontSize={10} fill="#94a3b8" fontWeight={700}
                transform={`rotate(-90, 14, ${PAD_T + plotH / 2})`}>Position (m)</text>

          {/* Target curve */}
          <path d={targetPathD}
                fill="none"
                stroke="rgba(251,191,36,0.55)"
                strokeWidth={3}
                strokeDasharray="6 5"/>

          {/* Student curve */}
          {studentPathD && (
            <path d={studentPathD}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth={3}
                  strokeLinecap="round"/>
          )}

          {/* Current playhead */}
          {(running || finished) && (
            <line x1={tToX(tRef.current)} y1={PAD_T}
                  x2={tToX(tRef.current)} y2={PAD_T + plotH}
                  stroke="rgba(255,255,255,0.4)" strokeWidth={1} strokeDasharray="3 3"/>
          )}

          {/* Student dot at current time */}
          {samples.length > 0 && (
            <circle cx={tToX(samples[samples.length-1].t)}
                    cy={xToY(samples[samples.length-1].xS)}
                    r={6} fill="#34d399" stroke="#10b981" strokeWidth={2}/>
          )}

          {/* Legend */}
          <g transform={`translate(${PAD_L + 12}, ${PAD_T + 12})`}>
            <line x1={0} y1={5} x2={28} y2={5}
                  stroke="rgba(251,191,36,0.7)" strokeWidth={3} strokeDasharray="6 5"/>
            <text x={34} y={9} fontSize={11} fill="#fbbf24" fontWeight={700}>Target</text>
            <line x1={100} y1={5} x2={128} y2={5}
                  stroke="#34d399" strokeWidth={3}/>
            <text x={134} y={9} fontSize={11} fill="#34d399" fontWeight={700}>You</text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Velocity slider */}
        <div className="rounded-2xl p-4"
             style={{ background:'#0B0F15', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-black uppercase tracking-widest"
                  style={{color:'#94a3b8'}}>Your velocity right now</span>
            <span className="text-3xl font-black text-white tabular-nums">
              {velocity.toFixed(1)} <span className="text-sm" style={{color:'#64748b'}}>m/s</span>
            </span>
          </div>
          <input type="range" min={0} max={20} step={0.5}
                 value={velocity}
                 onChange={e=>setVelocity(Number(e.target.value))}
                 disabled={!running && finished}
                 style={{ width:'100%', accentColor:'#34d399' }}/>
          <div className="flex justify-between text-[10px] mt-1" style={{color:'#475569'}}>
            <span>0 m/s</span><span>10 m/s</span><span>20 m/s</span>
          </div>
          <p className="text-[11px] mt-3 italic" style={{color:'#64748b'}}>
            💡 {level.hint}
          </p>
        </div>

        {/* Play / Reset */}
        <div className="flex flex-col gap-2">
          <button onClick={start} disabled={running}
                  className="flex-1 px-4 py-4 rounded-xl text-base font-black uppercase tracking-widest transition-all"
                  style={{
                    background: !running
                      ? 'linear-gradient(135deg,#10b981,#34d399)'
                      : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(52,211,153,0.5)',
                    color: !running ? '#0d1117' : 'rgba(255,255,255,0.25)',
                    cursor: running ? 'not-allowed' : 'pointer',
                  }}>
            {running ? '⏵ Running…' : finished ? '↻ Try again' : '▶ Start (10 s)'}
          </button>
          <button onClick={reset}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background:'rgba(99,102,241,0.10)',
                    border:'1px solid rgba(129,140,248,0.3)',
                    color:'#a5b4fc',
                  }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Score banner */}
      {finished && (
        <div className="mt-4 rounded-2xl px-5 py-4"
             style={{
               background: score >= 85 ? 'rgba(52,211,153,0.10)' :
                           score >= 60 ? 'rgba(251,191,36,0.10)' :
                                         'rgba(248,113,113,0.10)',
               border: `1px solid ${score >= 85 ? 'rgba(52,211,153,0.4)' :
                                    score >= 60 ? 'rgba(251,191,36,0.4)' :
                                                  'rgba(248,113,113,0.4)'}`,
             }}>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest"
                   style={{color: score >= 85 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'}}>
                {score >= 85 ? '🎯 Excellent match' :
                 score >= 60 ? 'Close — try a smoother curve' :
                               'Curves diverged — re-read the hint'}
              </div>
              <div className="text-base mt-1" style={{color:'#94a3b8'}}>
                Your curve matched the target by <span className="font-black text-white text-lg">{score}%</span>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
