'use client';

// MarbleInRingSim.tsx
// Class 9 Physics — Chapter 9: Motion (Page 10 — Uniform Circular Motion)
// Recreates NCERT Activity 4.5: marble circles inside a ring; when the ring
// is "lifted" (clicked), the marble flies off in a straight tangent line —
// proving that the inward push from the ring was responsible for the
// continuous redirection (i.e. the centripetal acceleration).
// Source: NCERT Class 9 Science (Exploration), §4.4.1, Activity 4.5.

import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'circling' | 'released';

export default function MarbleInRingSim() {
  const [phase, setPhase] = useState<Phase>('circling');
  const [period, setPeriod] = useState(2.4); // seconds per revolution
  const [showTangentArrow, setShowTangentArrow] = useState(true);
  const [showRadiusArrow, setShowRadiusArrow] = useState(false);

  // ── Geometry ──────────────────────────────────────────────────────────────
  const SVG_W = 700;
  const SVG_H = 460;
  const cx = SVG_W / 2;
  const cy = SVG_H / 2;
  const R_inner = 130;
  const R_marble = 12;

  // ── Animation state ───────────────────────────────────────────────────────
  const angleRef    = useRef(-Math.PI / 2); // start at top of circle
  const releasePosRef = useRef<{x:number;y:number} | null>(null);
  const releaseDirRef = useRef<{vx:number;vy:number} | null>(null);
  const releaseTRef   = useRef<number>(0);
  const lastTRef      = useRef<number | null>(null);
  const rafRef        = useRef<number | null>(null);

  const [angle, setAngle] = useState(angleRef.current);
  const [pos, setPos] = useState({ x: cx + R_inner * Math.cos(angleRef.current),
                                    y: cy + R_inner * Math.sin(angleRef.current) });
  const [trail, setTrail] = useState<{x:number;y:number}[]>([]);

  // ── Tick ──────────────────────────────────────────────────────────────────
  const tick = useCallback((ts: number) => {
    if (lastTRef.current === null) lastTRef.current = ts;
    const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
    lastTRef.current = ts;

    if (phase === 'circling') {
      const omega = (2 * Math.PI) / period;
      angleRef.current += omega * dt;
      const a = angleRef.current;
      setAngle(a);
      const x = cx + R_inner * Math.cos(a);
      const y = cy + R_inner * Math.sin(a);
      setPos({ x, y });
      setTrail(prev => {
        const next = [...prev, { x, y }];
        return next.slice(-22);
      });
    } else if (phase === 'released' && releasePosRef.current && releaseDirRef.current) {
      releaseTRef.current += dt;
      const t = releaseTRef.current;
      // 200 px/s is the marble's tangential speed at release-time animation pace
      const speedPx = (2 * Math.PI * R_inner) / period;
      const x = releasePosRef.current.x + releaseDirRef.current.vx * speedPx * t;
      const y = releasePosRef.current.y + releaseDirRef.current.vy * speedPx * t;
      setPos({ x, y });
      setTrail(prev => {
        const next = [...prev, { x, y }];
        return next.slice(-100);
      });
      // Stop animating once marble exits the SVG
      if (x < -50 || x > SVG_W + 50 || y < -50 || y > SVG_H + 50) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [phase, period, cx, cy]);

  useEffect(() => {
    lastTRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const liftRing = () => {
    if (phase !== 'circling') return;
    // Tangent direction at current angle for CCW motion is (-sin a, cos a)
    const a = angleRef.current;
    const vx = -Math.sin(a);
    const vy = Math.cos(a);
    releasePosRef.current = { x: cx + R_inner * Math.cos(a), y: cy + R_inner * Math.sin(a) };
    releaseDirRef.current = { vx, vy };
    releaseTRef.current = 0;
    setTrail([releasePosRef.current]);
    setPhase('released');
  };

  const reset = () => {
    angleRef.current = -Math.PI / 2;
    releasePosRef.current = null;
    releaseDirRef.current = null;
    releaseTRef.current = 0;
    setAngle(angleRef.current);
    setPos({ x: cx + R_inner * Math.cos(angleRef.current),
             y: cy + R_inner * Math.sin(angleRef.current) });
    setTrail([]);
    setPhase('circling');
  };

  // ── Tangent and radius arrows (current state) ─────────────────────────────
  const tangentLen = 60;
  const tx2 = pos.x + (-Math.sin(angle)) * tangentLen;
  const ty2 = pos.y + Math.cos(angle)    * tangentLen;
  const radLen = R_inner;
  const rx2 = cx;
  const ry2 = cy;

  // ── Tangent line for released state ───────────────────────────────────────
  let tangentLineStart: { x:number; y:number } | null = null;
  let tangentLineEnd: { x:number; y:number } | null = null;
  if (phase === 'released' && releasePosRef.current && releaseDirRef.current) {
    tangentLineStart = releasePosRef.current;
    // extend the line a long way
    tangentLineEnd = {
      x: releasePosRef.current.x + releaseDirRef.current.vx * 1200,
      y: releasePosRef.current.y + releaseDirRef.current.vy * 1200,
    };
  }

  return (
    <div className="p-4 md:p-6"
         style={{ background:'#0d1117', color:'#e2e8f0', minHeight:'80vh' }}>
      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Marble in a Ring <span style={{color:'#7c3aed'}}>Lab</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
             style={{color:'#475569'}}>
            Activity 4.5 · Lift the ring to see the tangent escape
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1"
             style={{color:'#64748b'}}>
          NCERT Class 9 — §4.4.1
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
        {/* SVG canvas */}
        <div className="relative overflow-hidden rounded-3xl"
             style={{
               background:'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
               border:'1px solid rgba(99,102,241,0.2)',
             }}>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{display:'block', height:'auto'}}>
            {/* Table-top hint (subtle wood ring shadow) */}
            <ellipse cx={cx} cy={cy + 110} rx={210} ry={28}
                     fill="rgba(0,0,0,0.35)" />

            {/* Trail of marble (fades out backwards) */}
            {trail.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y}
                      r={3 + (i / trail.length) * 2}
                      fill={phase === 'released' ? '#fbbf24' : '#818cf8'}
                      opacity={(i + 1) / trail.length * 0.6}/>
            ))}

            {/* The Ring (annulus) — only when circling */}
            {phase === 'circling' && (
              <g style={{ transition:'opacity 0.4s ease' }}>
                {/* outer ring */}
                <circle cx={cx} cy={cy} r={R_inner + 18} fill="none"
                        stroke="rgba(148,163,184,0.55)" strokeWidth={2}/>
                {/* inner ring */}
                <circle cx={cx} cy={cy} r={R_inner} fill="none"
                        stroke="rgba(148,163,184,0.55)" strokeWidth={2}/>
                {/* annular fill */}
                <path
                  d={`M ${cx + R_inner + 18} ${cy} A ${R_inner + 18} ${R_inner + 18} 0 1 1 ${cx - R_inner - 18} ${cy} A ${R_inner + 18} ${R_inner + 18} 0 1 1 ${cx + R_inner + 18} ${cy} Z M ${cx + R_inner} ${cy} A ${R_inner} ${R_inner} 0 1 0 ${cx - R_inner} ${cy} A ${R_inner} ${R_inner} 0 1 0 ${cx + R_inner} ${cy} Z`}
                  fillRule="evenodd"
                  fill="rgba(148,163,184,0.10)" />
              </g>
            )}

            {/* Centre dot */}
            <circle cx={cx} cy={cy} r={3} fill="#475569"/>
            <text x={cx} y={cy + 18} textAnchor="middle"
                  fontSize={10} fill="#475569" fontWeight={700}>centre</text>

            {/* Radius arrow (when toggle on, only while circling) */}
            {showRadiusArrow && phase === 'circling' && (
              <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                    stroke="#f87171" strokeWidth={1.5} strokeDasharray="6 4"/>
            )}

            {/* Tangent (velocity) arrow on the marble */}
            {showTangentArrow && phase === 'circling' && (
              <Arrow x1={pos.x} y1={pos.y} x2={tx2} y2={ty2} color="#34d399" width={2.5}/>
            )}
            {showTangentArrow && phase === 'circling' && (
              <text x={tx2 + (-Math.sin(angle))*12} y={ty2 + Math.cos(angle)*12 + 4}
                    fill="#34d399" fontSize={11} fontWeight={700} textAnchor="middle">
                v
              </text>
            )}

            {/* Tangent escape line (released state) */}
            {tangentLineStart && tangentLineEnd && (
              <line x1={tangentLineStart.x} y1={tangentLineStart.y}
                    x2={tangentLineEnd.x}   y2={tangentLineEnd.y}
                    stroke="rgba(251,191,36,0.45)" strokeWidth={1.5} strokeDasharray="6 5"/>
            )}

            {/* Marble */}
            <circle cx={pos.x} cy={pos.y} r={R_marble}
                    fill={phase === 'released' ? '#fbbf24' : '#818cf8'}
                    stroke={phase === 'released' ? '#d97706' : '#6366f1'}
                    strokeWidth={2}/>
            <circle cx={pos.x - 3} cy={pos.y - 4} r={3}
                    fill="rgba(255,255,255,0.5)"/>

            {/* Status banner */}
            <text x={SVG_W / 2} y={28} textAnchor="middle"
                  fill={phase === 'circling' ? '#94a3b8' : '#fbbf24'}
                  fontSize={13} fontWeight={800} letterSpacing={1.5}>
              {phase === 'circling'
                ? 'RING IN PLACE — wall keeps redirecting the marble'
                : 'RING LIFTED — marble flies off tangentially'}
            </text>
          </svg>
        </div>

        {/* Control panel */}
        <div className="flex flex-col gap-4">
          <button onClick={liftRing} disabled={phase !== 'circling'}
                  className="w-full py-4 rounded-xl text-base font-black uppercase tracking-widest transition-all"
                  style={{
                    background: phase === 'circling'
                      ? 'linear-gradient(135deg,#fbbf24,#d97706)'
                      : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(251,191,36,0.5)',
                    color: phase === 'circling' ? '#0d1117' : 'rgba(255,255,255,0.25)',
                    cursor: phase === 'circling' ? 'pointer' : 'not-allowed',
                  }}>
            ✋ Lift the ring!
          </button>

          <button onClick={reset}
                  className="w-full py-2 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background:'rgba(99,102,241,0.10)',
                    border:'1px solid rgba(129,140,248,0.3)',
                    color:'#a5b4fc',
                  }}>
            ↺ Reset
          </button>

          {/* Speed slider */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-black uppercase tracking-widest"
                    style={{color:'#94a3b8'}}>Spin period</span>
              <span className="text-base font-black text-white">{period.toFixed(1)} s</span>
            </div>
            <input type="range" min={1.0} max={5.0} step={0.2}
                   value={period}
                   onChange={e=>setPeriod(Number(e.target.value))}
                   style={{ width:'100%', accentColor:'#6366f1' }}/>
          </div>

          {/* Vector toggles */}
          <div className="flex flex-col gap-2">
            <ToggleButton active={showTangentArrow}
                          onClick={()=>setShowTangentArrow(v=>!v)}
                          activeColor="#34d399"
                          activeLabel="✓ Show velocity vector (tangent)"
                          inactiveLabel="Show velocity vector (tangent)"/>
            <ToggleButton active={showRadiusArrow}
                          onClick={()=>setShowRadiusArrow(v=>!v)}
                          activeColor="#f87171"
                          activeLabel="✓ Show radius (inward push line)"
                          inactiveLabel="Show radius (inward push line)"/>
          </div>

          {/* Concept explanation */}
          <div className="pt-3" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-2"
               style={{color: phase === 'circling' ? '#818cf8' : '#fbbf24'}}>
              {phase === 'circling' ? 'What\'s happening' : 'What you just saw'}
            </p>
            <p className="text-white text-sm font-bold leading-snug">
              {phase === 'circling' ? (
                <>The marble &ldquo;wants&rdquo; to go in a straight line tangent to the circle. The ring&apos;s
                inner wall keeps pushing it inward, redirecting its velocity at every instant.
                That continuous redirection <span style={{color:'#fbbf24'}}>is the acceleration</span>.</>
              ) : (
                <>Without the ring&apos;s inward push, the marble simply continued in the direction
                it was already moving — <span style={{color:'#34d399'}}>the tangent</span>. Speed
                stayed the same; only the constraint disappeared.</>
              )}
            </p>
          </div>

          <div className="pt-3" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5"
               style={{color:'#6366f1'}}>Expert Tip</p>
            <p className="text-white text-sm font-bold leading-tight italic">
              &ldquo;Constant speed ≠ constant velocity. Direction is half of velocity.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────
function Arrow({ x1, y1, x2, y2, color, width=2 }:{
  x1:number;y1:number;x2:number;y2:number;color:string;width?:number;
}) {
  const dx=x2-x1, dy=y2-y1;
  const len=Math.sqrt(dx*dx+dy*dy);
  if (len<1) return null;
  const ux=dx/len, uy=dy/len;
  const headLen=10, headWidth=5;
  const bx=x2-ux*headLen, by=y2-uy*headLen;
  const px=-uy*headWidth, py=ux*headWidth;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round"/>
      <polygon points={`${x2},${y2} ${bx+px},${by+py} ${bx-px},${by-py}`} fill={color}/>
    </g>
  );
}

function ToggleButton({ active, onClick, activeColor, activeLabel, inactiveLabel }:{
  active:boolean; onClick:()=>void; activeColor:string; activeLabel:string; inactiveLabel:string;
}) {
  return (
    <button onClick={onClick}
            className="self-start text-xs font-semibold transition-colors pb-0.5"
            style={{
              color: active ? activeColor : '#475569',
              borderBottom: `1px solid ${active ? activeColor + '88' : 'rgba(255,255,255,0.1)'}`,
              background:'none', outline:'none',
            }}>
      {active ? activeLabel : inactiveLabel}
    </button>
  );
}
