'use client';

// StoppingDistanceLabSim.tsx
// Class 9 Physics — Chapter 9: Motion (Page 9 — Stopping Distance & Safe Driving)
// Visualises total stopping distance = thinking distance + braking distance.
// Source: NCERT Class 9 Science (Exploration), Chapter 4.3 — kinematic equations
// applied to braking: d_brake = u² / (2|a|);  d_react = u × t_react.
// Road-condition decelerations from typical driver-education references:
//   dry tarmac     ~ 7 m/s²   (range 6–8 typical for modern car w/ ABS)
//   wet tarmac     ~ 4 m/s²   (range 3.5–5)
//   loose gravel   ~ 2.5 m/s² (range 2–3)

import { useState, useEffect, useRef, useCallback } from 'react';

type Road = 'dry' | 'wet' | 'gravel';
type Phase = 'idle' | 'reacting' | 'braking' | 'stopped';

const ROADS: Record<Road, { label: string; sublabel: string; decel: number; color: string }> = {
  dry:    { label: 'Dry tarmac',    sublabel: '|a| = 7 m/s²',   decel: 7,   color: '#34d399' },
  wet:    { label: 'Wet tarmac',    sublabel: '|a| = 4 m/s²',   decel: 4,   color: '#818cf8' },
  gravel: { label: 'Loose gravel',  sublabel: '|a| = 2.5 m/s²', decel: 2.5, color: '#fbbf24' },
};

export default function StoppingDistanceLabSim() {
  const [speedKmh, setSpeedKmh]       = useState(90);   // km/h
  const [reactSec, setReactSec]       = useState(1.0);  // s
  const [road, setRoad]               = useState<Road>('dry');
  const [phase, setPhase]             = useState<Phase>('idle');

  // Animation state
  const [carX, setCarX]               = useState(0);    // m, distance travelled
  const [tInPhase, setTInPhase]       = useState(0);    // seconds elapsed in current phase
  const lastTRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);

  // ── Derived quantities ────────────────────────────────────────────────────
  const u    = speedKmh / 3.6;                  // m/s
  const aDec = ROADS[road].decel;               // m/s²
  const dReact = u * reactSec;                  // metres
  const dBrake = (u * u) / (2 * aDec);          // metres
  const dTotal = dReact + dBrake;

  // Half-speed comparison (illustrates u² scaling)
  const uHalf  = u / 2;
  const dBrakeHalf = (uHalf * uHalf) / (2 * aDec);

  // ── Animation loop ────────────────────────────────────────────────────────
  const tick = useCallback((ts: number) => {
    if (lastTRef.current === null) lastTRef.current = ts;
    const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
    lastTRef.current = ts;

    setTInPhase(t => t + dt);
    setCarX(prev => {
      let next = prev;
      // Phase logic uses t and current phase; we track using setPhase below
      if (phase === 'reacting') {
        next = prev + u * dt;
      } else if (phase === 'braking') {
        // velocity at time τ since braking started: v = u − aDec*τ
        // distance covered in this dt: v*dt
        const tBraking = tInPhase;
        const vNow = Math.max(0, u - aDec * tBraking);
        next = prev + vNow * dt;
      }
      return next;
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [phase, u, aDec, tInPhase]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'stopped') {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    lastTRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, tick]);

  // ── Phase transitions ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'reacting' && tInPhase >= reactSec) {
      setPhase('braking');
      setTInPhase(0);
    } else if (phase === 'braking') {
      const tBrakeNeeded = u / aDec;
      if (tInPhase >= tBrakeNeeded) {
        setPhase('stopped');
        setCarX(dTotal); // snap to exact final position
      }
    }
  }, [phase, tInPhase, reactSec, u, aDec, dTotal]);

  const start = () => {
    setCarX(0);
    setTInPhase(0);
    setPhase('reacting');
  };
  const reset = () => {
    setCarX(0);
    setTInPhase(0);
    setPhase('idle');
  };

  // ── SVG geometry ──────────────────────────────────────────────────────────
  // Track is 700px wide, mapping to (dTotal × 1.15) metres for a bit of headroom.
  const SVG_W = 760;
  const SVG_H = 230;
  const trackXStart = 30;
  const trackXEnd   = 720;
  const trackY      = 145;
  const mPerPx = (dTotal * 1.15) / (trackXEnd - trackXStart);
  const xToPx = (m: number) => trackXStart + m / mPerPx;

  const carPx = xToPx(Math.min(carX, dTotal * 1.15));

  return (
    <div className="p-4 md:p-6"
         style={{ background:'#0d1117', color:'#e2e8f0', minHeight:'80vh' }}>
      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Stopping Distance <span style={{color:'#7c3aed'}}>Lab</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
             style={{color:'#475569'}}>
            See how speed × speed controls the gap you need
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1"
             style={{color:'#64748b'}}>
          NCERT Class 9 — §4.3
        </div>
      </div>

      {/* SVG track */}
      <div className="relative overflow-hidden rounded-3xl mb-4"
           style={{
             background:'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
             border:'1px solid rgba(99,102,241,0.2)',
           }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{display:'block', height:'auto'}}>
          {/* Road */}
          <rect x={trackXStart} y={trackY} width={trackXEnd - trackXStart} height={26}
                fill="rgba(148,163,184,0.10)" stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
          {/* Lane dashes */}
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i}
                  x={trackXStart + 8 + i * 24} y={trackY + 12}
                  width={12} height={2}
                  fill="rgba(255,255,255,0.18)" />
          ))}

          {/* Reaction zone (yellow) */}
          <rect x={trackXStart} y={trackY - 6}
                width={Math.max(0, xToPx(dReact) - trackXStart)} height={38}
                fill="rgba(251,191,36,0.08)"
                stroke="rgba(251,191,36,0.35)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={trackXStart + 4} y={trackY - 12} fill="#fbbf24"
                fontSize={10} fontWeight={700}>
            THINKING ZONE  ({dReact.toFixed(1)} m)
          </text>

          {/* Braking zone (red) */}
          <rect x={xToPx(dReact)} y={trackY - 6}
                width={Math.max(0, xToPx(dReact + dBrake) - xToPx(dReact))} height={38}
                fill="rgba(248,113,113,0.08)"
                stroke="rgba(248,113,113,0.35)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={xToPx(dReact) + 4} y={trackY - 12} fill="#f87171"
                fontSize={10} fontWeight={700}>
            BRAKING ZONE  ({dBrake.toFixed(1)} m)
          </text>

          {/* Stop marker */}
          <line x1={xToPx(dTotal)} y1={trackY - 30}
                x2={xToPx(dTotal)} y2={trackY + 36}
                stroke="#dc2626" strokeWidth={2} strokeDasharray="5 4" />
          <text x={xToPx(dTotal) + 4} y={trackY + 50}
                fill="#f87171" fontSize={11} fontWeight={800}>
            STOP · {dTotal.toFixed(1)} m
          </text>

          {/* Car */}
          <g transform={`translate(${carPx - 22}, ${trackY - 10})`}>
            {/* car body */}
            <rect x={0} y={4} width={44} height={16} rx={4}
                  fill={phase === 'braking' ? '#dc2626' : '#6366f1'}
                  stroke={phase === 'braking' ? '#f87171' : '#818cf8'} strokeWidth={1.5}/>
            <rect x={8} y={0} width={28} height={8} rx={2}
                  fill="rgba(255,255,255,0.18)"/>
            {/* wheels */}
            <circle cx={9}  cy={22} r={4} fill="#0f172a" stroke="#475569" strokeWidth={1}/>
            <circle cx={35} cy={22} r={4} fill="#0f172a" stroke="#475569" strokeWidth={1}/>
            {/* brake light */}
            {phase === 'braking' && (
              <circle cx={2} cy={12} r={3} fill="#dc2626" opacity={0.9}>
                <animate attributeName="opacity" values="0.4;1;0.4" dur="0.4s" repeatCount="indefinite"/>
              </circle>
            )}
          </g>

          {/* Phase status label */}
          <text x={SVG_W / 2} y={28} textAnchor="middle"
                fill={phase === 'idle' ? '#475569' :
                      phase === 'reacting' ? '#fbbf24' :
                      phase === 'braking'  ? '#f87171' : '#34d399'}
                fontSize={13} fontWeight={800} letterSpacing={1}>
            {phase === 'idle'     ? 'READY' :
             phase === 'reacting' ? 'REACTION TIME — brake not pressed yet' :
             phase === 'braking'  ? 'BRAKING — decelerating' :
                                    'STOPPED'}
          </text>
        </svg>
      </div>

      {/* Sliders + Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">

        {/* Left — controls */}
        <div className="flex flex-col gap-4">
          {/* Speed slider */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-black uppercase tracking-widest"
                    style={{color:'#94a3b8'}}>Initial speed</span>
              <span className="text-2xl font-black text-white">{speedKmh} <span className="text-sm" style={{color:'#64748b'}}>km/h</span></span>
            </div>
            <input type="range" min={20} max={150} step={5}
                   value={speedKmh} disabled={phase!=='idle'}
                   onChange={e=>setSpeedKmh(Number(e.target.value))}
                   style={{ width:'100%', accentColor:'#6366f1' }}/>
            <div className="text-[10px]" style={{color:'#475569'}}>
              {u.toFixed(1)} m/s
            </div>
          </div>

          {/* Reaction slider */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-black uppercase tracking-widest"
                    style={{color:'#94a3b8'}}>Reaction time</span>
              <span className="text-2xl font-black text-white">{reactSec.toFixed(1)} <span className="text-sm" style={{color:'#64748b'}}>s</span></span>
            </div>
            <input type="range" min={0.4} max={3.0} step={0.1}
                   value={reactSec} disabled={phase!=='idle'}
                   onChange={e=>setReactSec(Number(e.target.value))}
                   style={{ width:'100%', accentColor:'#fbbf24' }}/>
            <div className="text-[10px]" style={{color:'#475569'}}>
              {reactSec < 0.8 ? 'fast — alert young driver' :
               reactSec < 1.2 ? 'typical alert driver' :
               reactSec < 2.0 ? 'tired or distracted' : 'glancing at phone'}
            </div>
          </div>

          {/* Road condition tabs */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest mb-2 block"
                  style={{color:'#94a3b8'}}>Road condition</span>
            <div className="grid grid-cols-3">
              {(Object.entries(ROADS) as [Road, typeof ROADS.dry][]).map(([key, cfg]) => {
                const active = road === key;
                return (
                  <button key={key} onClick={()=>setRoad(key)}
                          disabled={phase!=='idle'}
                          className="px-3 py-2 text-center transition-all"
                          style={{
                            borderBottom:`2px solid ${active ? cfg.color : 'rgba(255,255,255,0.06)'}`,
                            opacity: active ? 1 : 0.5,
                            background:'none', outline:'none', cursor: phase!=='idle' ? 'not-allowed' : 'pointer',
                          }}>
                    <div className="text-xs font-black" style={{color:cfg.color}}>{cfg.label}</div>
                    <div className="text-[10px]" style={{color:'#475569'}}>{cfg.sublabel}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button onClick={start} disabled={phase !== 'idle'}
                    className="flex-1 px-4 py-3 rounded-lg text-sm font-black uppercase tracking-widest transition-all"
                    style={{
                      background: phase==='idle' ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(129,140,248,0.4)',
                      color: phase==='idle' ? '#fff' : 'rgba(255,255,255,0.25)',
                      cursor: phase==='idle' ? 'pointer' : 'not-allowed',
                    }}>
              ▶ Hit the brake!
            </button>
            <button onClick={reset}
                    className="px-4 py-3 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background:'rgba(99,102,241,0.10)',
                      border:'1px solid rgba(129,140,248,0.3)',
                      color:'#a5b4fc',
                    }}>
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Right — calculations panel */}
        <div className="rounded-2xl p-4"
             style={{ background:'#0B0F15', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-3"
               style={{color:'#64748b'}}>Live calculations</div>

          <div className="space-y-3">
            <Row label="Thinking distance"
                 formula={`u × t = ${u.toFixed(1)} × ${reactSec.toFixed(1)}`}
                 value={`${dReact.toFixed(1)} m`} color="#fbbf24"/>
            <Row label="Braking distance"
                 formula={`u² / 2|a| = ${u.toFixed(1)}² / ${(2*aDec).toFixed(1)}`}
                 value={`${dBrake.toFixed(1)} m`} color="#f87171"/>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }} className="pt-3">
              <Row label="Total stopping"
                   formula="thinking + braking"
                   value={`${dTotal.toFixed(1)} m`} color="#34d399" big/>
            </div>
          </div>

          {/* u² insight */}
          <div className="mt-4 pt-4" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest mb-1.5"
                 style={{color:'#6366f1'}}>The u² insight</div>
            <p className="text-white text-sm font-bold leading-snug italic">
              At <span style={{color:'#fbbf24'}}>half this speed</span>, braking distance drops to{' '}
              <span style={{color:'#34d399'}}>{dBrakeHalf.toFixed(1)} m</span> — only <span style={{color:'#34d399'}}>1/4</span>.
              Doubling speed quadruples the gap you need.
            </p>
          </div>

          {/* Real-world scale */}
          <div className="mt-4 pt-4" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest mb-1.5"
                 style={{color:'#475569'}}>For scale</div>
            <p className="text-sm leading-snug" style={{color:'#94a3b8'}}>
              {dTotal.toFixed(0)} m ≈ <span style={{color:'#e2e8f0',fontWeight:700}}>
              {(dTotal / 100).toFixed(1)} football fields</span> end-to-end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Row helper ─────────────────────────────────────────────────────────────
function Row({ label, formula, value, color, big }:{
  label:string; formula:string; value:string; color:string; big?:boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <div>
        <div className={`${big ? 'text-sm' : 'text-xs'} font-bold`}
             style={{color: big ? '#e2e8f0' : '#94a3b8'}}>{label}</div>
        <div className="text-[10px] font-mono" style={{color:'#475569'}}>{formula}</div>
      </div>
      <div className={`${big ? 'text-2xl' : 'text-lg'} font-black tabular-nums`} style={{color}}>{value}</div>
    </div>
  );
}
