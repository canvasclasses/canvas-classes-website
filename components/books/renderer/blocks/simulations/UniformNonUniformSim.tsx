'use client';

/**
 * UniformNonUniformSim — Side-by-side motion comparison with live p-t graphs
 *
 * Academic source: NCERT Class 9 Science, Chapter 8 — Motion
 * Layout: wider two-column design — animation+graph on left, controls on right
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/* ── Physics / animation constants ─────────────────────────────────────────── */

const DURATION        = 8;       // simulation seconds
const TRACK_START     = 72;      // px — where cars start inside the lane
const FINISH_X        = 590;     // px — finish line
const TRACK_DIST      = FINISH_X - TRACK_START;          // 518 px
const UNIFORM_SPEED   = TRACK_DIST / DURATION;           // px/s (≈64.75)
const NON_UNIF_ACCEL  = TRACK_DIST / (0.5 * DURATION * DURATION); // px/s² (≈16.2)

const SPEED_MULTS = { slow: 0.5, normal: 1, fast: 2 } as const;

/* ── Track SVG layout ───────────────────────────────────────────────────────── */

const TW    = 640;   // track viewBox width
const LANE_H = 74;   // height of each lane
const TY1   = 14;    // y-top of lane 1
const TY2   = TY1 + LANE_H + 16;  // y-top of lane 2  (= 104)
const TSH   = TY2 + LANE_H + 10;  // total track SVG height  (= 188)
// Car anchor: wheel center sits 13 px above lane bottom
const GROUND_OFFSET = 15;  // distance from lane bottom to wheel center
const CAR_Y1 = TY1 + LANE_H - GROUND_OFFSET;   // 73
const CAR_Y2 = TY2 + LANE_H - GROUND_OFFSET;   // 163

/* ── Graph SVG layout ───────────────────────────────────────────────────────── */

const GW  = 640;  // graph viewBox width
const GH  = 260;  // graph viewBox height
const GL  = 52;   // left margin
const GT  = 18;   // top margin
const GPW = 558;  // plot width
const GPH = 190;  // plot height
const GR  = GL + GPW;
const GB  = GT + GPH;

const MAX_POS = TRACK_DIST;                               // max position (px)
const gX = (t: number) => GL + (t / DURATION) * GPW;
const gY = (p: number) => GB - (p / MAX_POS) * GPH;

/* ── Position helpers ───────────────────────────────────────────────────────── */

const uniformPos   = (t: number) => Math.min(t * UNIFORM_SPEED, MAX_POS);
const nonUnifPos   = (t: number) => Math.min(0.5 * NON_UNIF_ACCEL * t * t, MAX_POS);
const uniformX     = (t: number) => TRACK_START + uniformPos(t);
const nonUniformX  = (t: number) => TRACK_START + nonUnifPos(t);

/* ── Car SVG shape ──────────────────────────────────────────────────────────── */
// Origin at wheel-axle midpoint (between the two wheels, on the ground line).
// Car moves RIGHT → front is on the +x side.

function CarShape({ body, roof }: { body: string; roof: string }) {
  return (
    <>
      {/* Shadow */}
      <ellipse cx={0} cy={12} rx={32} ry={5} fill="rgba(0,0,0,0.35)" />

      {/* Rear bumper */}
      <rect x={-31} y={-18} width={5} height={10} rx={2} fill={roof} />
      {/* Taillight */}
      <rect x={-31} y={-16} width={3} height={5} rx={1} fill="rgba(255,60,60,0.9)" />

      {/* Main body */}
      <rect x={-30} y={-20} width={60} height={20} rx={5} fill={body} />

      {/* Cabin / roof — trapezoid sitting on body */}
      <path d={`M -14,-20 L -9,-34 L 14,-34 L 18,-20 Z`} fill={roof} />

      {/* Rear window */}
      <rect x={-12} y={-33} width={10} height={12} rx={2}
            fill="rgba(160,220,255,0.55)" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
      {/* Front window */}
      <rect x={2}  y={-33} width={13} height={12} rx={2}
            fill="rgba(160,220,255,0.55)" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />

      {/* Door line */}
      <line x1={1} y1={-20} x2={1} y2={0} stroke={roof} strokeWidth={1} opacity={0.5} />

      {/* Front headlight */}
      <ellipse cx={29} cy={-12} rx={4.5} ry={3.5} fill="rgba(255,252,200,0.95)" />
      <ellipse cx={29} cy={-12} rx={2} ry={1.5} fill="rgba(255,255,255,0.9)" />

      {/* Front bumper */}
      <rect x={27} y={-8} width={5} height={7} rx={2} fill={roof} />

      {/* Wheels — rear */}
      <circle cx={-16} cy={0} r={11} fill="#111827" />
      <circle cx={-16} cy={0} r={7}  fill="#1e2a3a" />
      <circle cx={-16} cy={0} r={3}  fill="#475569" />
      <circle cx={-16} cy={0} r={1.2} fill="#94a3b8" />

      {/* Wheels — front */}
      <circle cx={16}  cy={0} r={11} fill="#111827" />
      <circle cx={16}  cy={0} r={7}  fill="#1e2a3a" />
      <circle cx={16}  cy={0} r={3}  fill="#475569" />
      <circle cx={16}  cy={0} r={1.2} fill="#94a3b8" />
    </>
  );
}

/* ── Graph path builder ─────────────────────────────────────────────────────── */

function buildPath(posFunc: (t: number) => number, upTo: number): string {
  const steps = Math.max(2, Math.round((upTo / DURATION) * 200));
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * upTo;
    const x = gX(t);
    const y = gY(posFunc(t));
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return pts.join(' ');
}

/* ── Component ──────────────────────────────────────────────────────────────── */

export default function UniformNonUniformSim() {
  const [playing, setPlaying]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [speed, setSpeed]       = useState<'slow' | 'normal' | 'fast'>('normal');

  const rafRef      = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  /* ── RAF loop ─────────────────────────────────────────────────────────────── */

  const tick = useCallback((now: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const delta = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;
    setElapsed(prev => {
      const next = prev + delta * SPEED_MULTS[speed];
      if (next >= DURATION) { setPlaying(false); return DURATION; }
      return next;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [speed]);

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [playing, tick]);

  const handleReset = () => { setPlaying(false); setElapsed(0); lastTimeRef.current = null; };

  /* ── Derived values ───────────────────────────────────────────────────────── */

  const t       = Math.min(elapsed, DURATION);
  const uX      = uniformX(t);
  const nuX     = nonUniformX(t);
  const nuVelNow = NON_UNIF_ACCEL * t;
  const maxNuVel = NON_UNIF_ACCEL * DURATION;

  // Velocity arrow length (0–40 px)
  const arrowLen = (v: number, max: number) => Math.max(6, Math.min(40, (v / max) * 40));

  // Graph paths
  const uRefPath  = buildPath(uniformPos,  DURATION);
  const nuRefPath = buildPath(nonUnifPos,  DURATION);
  const uLive     = t > 0 ? buildPath(uniformPos,  t) : '';
  const nuLive    = t > 0 ? buildPath(nonUnifPos, t) : '';

  // Y-axis scale: 1 px ≈ MAX_POS/100 m → label = pos * 100 / MAX_POS
  const posToM = (px: number) => Math.round((px / MAX_POS) * 100);

  /* ── Shared styles ────────────────────────────────────────────────────────── */

  const card: React.CSSProperties = {
    background : '#0d1117',
    border     : '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
  };

  const speedBtn = (s: typeof speed): React.CSSProperties => ({
    flex        : 1,
    background  : speed === s ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.04)',
    color       : speed === s ? '#f59e0b' : '#64748b',
    border      : speed === s ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: 6,
    padding     : '7px 0',
    fontSize    : 12,
    fontWeight  : speed === s ? 700 : 400,
    cursor      : 'pointer',
    fontFamily  : 'system-ui, -apple-system, sans-serif',
  });

  /* ── Render ───────────────────────────────────────────────────────────────── */

  return (
    <div style={{
      background  : '#050a14',
      borderRadius: 16,
      padding     : 24,
      maxWidth    : 920,
      margin      : '0 auto',
      fontFamily  : 'system-ui, -apple-system, sans-serif',
      color       : '#e2e8f0',
    }}>

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>
          Uniform vs Non-Uniform Motion
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 5 }}>
          Watch how constant speed differs from accelerating motion — and see it on the graph
        </div>
      </div>

      {/* ── Main two-column layout ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* ── LEFT: Track + Graph ──────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Track SVG */}
          <div style={{ ...card, padding: '12px 8px 8px' }}>
            <svg width="100%" viewBox={`0 0 ${TW} ${TSH}`} style={{ display: 'block' }}>
              <defs>
                <marker id="ua-arr" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto">
                  <path d="M 0 0 L 7 3.5 L 0 7 Z" fill="#f59e0b" />
                </marker>
                <marker id="nu-arr" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto">
                  <path d="M 0 0 L 7 3.5 L 0 7 Z" fill="#34d399" />
                </marker>
              </defs>

              {/* ── Lane 1 — Uniform ─────────────────────────────────────── */}
              <rect x={6} y={TY1} width={TW - 12} height={LANE_H} rx={10}
                    fill="#0a0f1a" stroke="#1e2a3a" strokeWidth={1} />
              {/* Road surface */}
              <rect x={14} y={TY1 + LANE_H - 20} width={TW - 28} height={14} rx={3} fill="#131c2e" />
              {/* Road dashes */}
              {Array.from({ length: 9 }).map((_, i) => (
                <rect key={i} x={80 + i * 62} y={TY1 + LANE_H - 15} width={36} height={3} rx={1.5}
                      fill="rgba(255,255,255,0.1)" />
              ))}
              <text x={18} y={TY1 + 20} fill="#64748b" fontSize={11} fontWeight={600}>Uniform Motion</text>

              {/* ── Lane 2 — Non-Uniform ─────────────────────────────────── */}
              <rect x={6} y={TY2} width={TW - 12} height={LANE_H} rx={10}
                    fill="#0a0f1a" stroke="#1e2a3a" strokeWidth={1} />
              <rect x={14} y={TY2 + LANE_H - 20} width={TW - 28} height={14} rx={3} fill="#131c2e" />
              {Array.from({ length: 9 }).map((_, i) => (
                <rect key={i} x={80 + i * 62} y={TY2 + LANE_H - 15} width={36} height={3} rx={1.5}
                      fill="rgba(255,255,255,0.1)" />
              ))}
              <text x={18} y={TY2 + 20} fill="#64748b" fontSize={11} fontWeight={600}>Non-Uniform Motion</text>

              {/* ── Finish lines ─────────────────────────────────────────── */}
              {([TY1, TY2] as const).map((ty) => (
                <g key={ty}>
                  <line x1={FINISH_X} y1={ty + 4} x2={FINISH_X} y2={ty + LANE_H - 4}
                        stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray="5 3" />
                  <text x={FINISH_X + 5} y={ty + 22} fill="rgba(255,255,255,0.2)" fontSize={9}>FINISH</text>
                </g>
              ))}

              {/* ── Uniform car ──────────────────────────────────────────── */}
              <g transform={`translate(${uX}, ${CAR_Y1})`}>
                {/* velocity arrow above car */}
                <line x1={-8} y1={-40} x2={arrowLen(UNIFORM_SPEED, maxNuVel) - 8} y2={-40}
                      stroke="#f59e0b" strokeWidth={2} markerEnd="url(#ua-arr)" />
                <CarShape body="#f59e0b" roof="#d97706" />
              </g>

              {/* ── Non-uniform car ──────────────────────────────────────── */}
              <g transform={`translate(${nuX}, ${CAR_Y2})`}>
                {/* velocity arrow grows with acceleration */}
                <line x1={-8} y1={-40} x2={arrowLen(nuVelNow, maxNuVel) - 8} y2={-40}
                      stroke="#34d399" strokeWidth={2} markerEnd="url(#nu-arr)" />
                <CarShape body="#34d399" roof="#059669" />
              </g>
            </svg>
          </div>

          {/* ── Graph SVG ─────────────────────────────────────────────────── */}
          <div style={{ ...card, padding: '14px 8px 8px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, paddingLeft: 6, marginBottom: 8, color: '#e2e8f0' }}>
              Position–Time Graph
            </div>
            <svg width="100%" viewBox={`0 0 ${GW} ${GH}`} style={{ display: 'block' }}>

              {/* Grid */}
              {[0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={gX(DURATION * f)} y1={GT} x2={gX(DURATION * f)} y2={GB}
                      stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
              ))}
              {[0.25, 0.5, 0.75].map(f => (
                <line key={f} x1={GL} y1={GT + GPH * (1 - f)} x2={GR} y2={GT + GPH * (1 - f)}
                      stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
              ))}

              {/* Ghost reference paths */}
              <path d={uRefPath}  fill="none" stroke="#f59e0b" strokeWidth={1} opacity={0.1} />
              <path d={nuRefPath} fill="none" stroke="#34d399" strokeWidth={1} opacity={0.1} />

              {/* Live paths */}
              {uLive  && <path d={uLive}  fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />}
              {nuLive && <path d={nuLive} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" />}

              {/* Axes */}
              <line x1={GL} y1={GB} x2={GR} y2={GB} stroke="#334155" strokeWidth={1.5} />
              <line x1={GL} y1={GT} x2={GL} y2={GB} stroke="#334155" strokeWidth={1.5} />

              {/* X-axis */}
              {[0, 2, 4, 6, 8].map(tick => (
                <g key={tick}>
                  <line x1={gX(tick)} y1={GB} x2={gX(tick)} y2={GB + 5} stroke="#334155" strokeWidth={1} />
                  <text x={gX(tick)} y={GB + 16} fill="#94a3b8" fontSize={11} textAnchor="middle">{tick}</text>
                </g>
              ))}
              <text x={GL + GPW / 2} y={GH - 4} fill="#94a3b8" fontSize={11} textAnchor="middle">Time (s)</text>

              {/* Y-axis */}
              {[0, 0.5, 1].map(f => {
                const px = f * MAX_POS;
                const ty = gY(px);
                return (
                  <g key={f}>
                    <line x1={GL - 4} y1={ty} x2={GL} y2={ty} stroke="#334155" strokeWidth={1} />
                    <text x={GL - 8} y={ty + 4} fill="#94a3b8" fontSize={11} textAnchor="end">
                      {posToM(px)}
                    </text>
                  </g>
                );
              })}
              <text x={GL - 36} y={GT + GPH / 2} fill="#94a3b8" fontSize={11} textAnchor="middle"
                    transform={`rotate(-90, ${GL - 36}, ${GT + GPH / 2})`}>
                Position (m)
              </text>

              {/* Curve annotations */}
              {t > 1.2 && (
                <text x={gX(Math.min(t, DURATION) * 0.52)} y={gY(uniformPos(Math.min(t, DURATION) * 0.52)) - 10}
                      fill="#f59e0b" fontSize={10.5} opacity={0.9}>
                  Straight line = constant velocity
                </text>
              )}
              {t > 2.8 && (
                <text x={gX(Math.min(t, DURATION) * 0.38)} y={gY(nonUnifPos(Math.min(t, DURATION) * 0.38)) + 17}
                      fill="#34d399" fontSize={10.5} opacity={0.9}>
                  Curved = changing velocity
                </text>
              )}

              {/* Legend */}
              <g transform={`translate(${GR - 205}, ${GT + 6})`}>
                <circle cx={0} cy={5} r={5.5} fill="#f59e0b" />
                <text x={13} y={9.5} fill="#94a3b8" fontSize={11}>Uniform</text>
                <circle cx={0} cy={23} r={5.5} fill="#34d399" />
                <text x={13} y={27.5} fill="#94a3b8" fontSize={11}>Non-Uniform (Accelerating)</text>
              </g>
            </svg>
          </div>
        </div>

        {/* ── RIGHT: Controls column ──────────────────────────────────────────── */}
        <div style={{
          width         : 180,
          flexShrink    : 0,
          display       : 'flex',
          flexDirection : 'column',
          gap           : 12,
        }}>

          {/* Play / Pause / Replay */}
          <button
            onClick={() => { if (elapsed >= DURATION) handleReset(); else setPlaying(p => !p); }}
            style={{
              background  : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              color       : '#000',
              border      : 'none',
              borderRadius: 10,
              padding     : '13px 0',
              fontSize    : 15,
              fontWeight  : 700,
              cursor      : 'pointer',
              width       : '100%',
              fontFamily  : 'system-ui, -apple-system, sans-serif',
            }}
          >
            {playing ? '⏸ Pause' : elapsed >= DURATION ? '↺ Replay' : '▶ Play'}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            style={{
              background  : 'rgba(255,255,255,0.05)',
              color       : '#e2e8f0',
              border      : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding     : '10px 0',
              fontSize    : 14,
              cursor      : 'pointer',
              width       : '100%',
              fontFamily  : 'system-ui, -apple-system, sans-serif',
            }}
          >
            ↺ Reset
          </button>

          {/* Speed selector */}
          <div style={{ ...card, padding: 12 }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Playback Speed
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['slow', 'normal', 'fast'] as const).map(s => (
                <button key={s} onClick={() => setSpeed(s)} style={speedBtn(s)}>
                  {s === 'slow' ? '0.5×' : s === 'normal' ? '1×' : '2×'}
                </button>
              ))}
            </div>
          </div>

          {/* Elapsed time */}
          <div style={{ ...card, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Elapsed Time
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {t.toFixed(1)}
              <span style={{ fontSize: 14, color: '#64748b', marginLeft: 4 }}>s</span>
            </div>
          </div>

          {/* Live speeds */}
          <div style={{ ...card, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Current Speed
            </div>
            {/* Uniform */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>Uniform</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
                  {(UNIFORM_SPEED / (MAX_POS / 100)).toFixed(1)} m/s
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', background: '#f59e0b', borderRadius: 2 }} />
              </div>
            </div>
            {/* Non-uniform */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>Accelerating</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399', fontVariantNumeric: 'tabular-nums' }}>
                  {(nuVelNow / (MAX_POS / 100)).toFixed(1)} m/s
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(nuVelNow / maxNuVel) * 100}%`, background: '#34d399', borderRadius: 2, transition: 'width 0.1s linear' }} />
              </div>
            </div>
          </div>

          {/* Key insight */}
          <div style={{
            background  : 'rgba(245,158,11,0.07)',
            border      : '1px solid rgba(245,158,11,0.2)',
            borderRadius: 10,
            padding     : '12px 13px',
            fontSize    : 12.5,
            color       : '#e2e8f0',
            lineHeight  : 1.7,
          }}>
            A <strong>straight line</strong> on a position–time graph means <strong>uniform motion</strong>. A <strong>curve</strong> means the speed is <strong>changing</strong> — non-uniform motion.
          </div>
        </div>

      </div>
    </div>
  );
}
