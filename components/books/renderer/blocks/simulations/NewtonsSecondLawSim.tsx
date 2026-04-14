'use client';

// NewtonsSecondLawSim.tsx
// Class 9 Physics — Force and Laws of Motion
// Newton's Second Law: F = ma.
// Doubling force doubles acceleration; doubling mass halves acceleration.
// Design: follows SIMULATION_DESIGN_WORKFLOW.md exactly.

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────────

const SVG_W        = 500;
const SVG_H        = 160;
const FLOOR_Y      = 120;
const BOX_W        = 60;
const BOX_H        = 50;
const BOX_START_X  = 30;
const BOX_END_X    = SVG_W - BOX_W - 20;
const TRACK_LEN    = BOX_END_X - BOX_START_X;

// Px-per-Newton for arrow rendering
const FORCE_ARROW_SCALE  = 2.5;  // max ~120px at 50 N
const FRICTION_ARROW_SCALE = 2.5;

// Speedometer arc
const SPEEDO_CX = SVG_W - 56;
const SPEEDO_CY = 52;
const SPEEDO_R  = 38;

// ── Types ──────────────────────────────────────────────────────────────────────

interface Preset {
  label: string;
  force: number;
  mass: number;
  friction: number;
  frictionOn: boolean;
}

const PRESETS: Preset[] = [
  { label: 'Heavy truck',  force: 50, mass: 20, friction: 10, frictionOn: false },
  { label: 'Bicycle',      force: 10, mass:  2, friction:  2, frictionOn: false },
  { label: 'Rocket',       force: 50, mass:  1, friction:  0, frictionOn: false },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Map a value 0→maxVal to an angle range (e.g. 210° to 330°) for speedometer arc */
function speedoAngle(speed: number, maxSpeed: number): number {
  const START_DEG = 210;
  const END_DEG   = 330;
  const frac = Math.min(speed / (maxSpeed || 1), 1);
  return START_DEG + frac * (END_DEG - START_DEG);
}

/** SVG arc path for speedometer needle area */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/** Needle endpoint from center at given angle, given radius */
function needlePoint(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function NewtonsSecondLawSim() {
  const [force, setForce]           = useState(10);   // N
  const [mass, setMass]             = useState(2);    // kg
  const [frictionOn, setFrictionOn] = useState(false);
  const [friction, setFriction]     = useState(5);    // N

  const [isAnimating, setIsAnimating] = useState(false);
  const [boxX, setBoxX]               = useState(BOX_START_X);
  const [currentVelocity, setCurrentVelocity] = useState(0); // px/s (for display)
  const [hasFinished, setHasFinished] = useState(false);

  const rafRef      = useRef<number | null>(null);
  const animState   = useRef({ x: BOX_START_X, v: 0, running: false });

  // ── Derived physics ────────────────────────────────────────────────────────

  const netForce = useMemo(() => {
    const f = frictionOn ? Math.max(0, force - friction) : force;
    return f;
  }, [force, friction, frictionOn]);

  const acceleration = useMemo(() => {
    if (mass <= 0) return 0;
    return netForce / mass; // m/s²
  }, [netForce, mass]);

  // Max reachable speed estimate for speedometer (top of range)
  const maxSpeed = useMemo(() => {
    // Use physics: v² = 2 * a * TRACK_LEN (px); we need px/s units in animation
    // We scale accel to px/s² — see launch logic below (scale = 30px per m/s²)
    const accelPx = acceleration * 30;
    return Math.sqrt(2 * accelPx * TRACK_LEN) || 1;
  }, [acceleration]);

  // ── Cancel animation ───────────────────────────────────────────────────────

  const cancelAnim = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    animState.current.running = false;
  }, []);

  const handleReset = useCallback(() => {
    cancelAnim();
    setBoxX(BOX_START_X);
    setCurrentVelocity(0);
    setIsAnimating(false);
    setHasFinished(false);
    animState.current = { x: BOX_START_X, v: 0, running: false };
  }, [cancelAnim]);

  const handleLaunch = useCallback(() => {
    if (isAnimating) return;
    if (netForce <= 0) return;
    cancelAnim();

    const accelPx = acceleration * 30; // scale: 30 px per m/s²

    animState.current = { x: BOX_START_X, v: 0, running: true };
    setBoxX(BOX_START_X);
    setCurrentVelocity(0);
    setIsAnimating(true);
    setHasFinished(false);

    let lastTs: number | null = null;

    function step(ts: number) {
      if (!animState.current.running) return;
      if (lastTs === null) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      const s = animState.current;
      s.v += accelPx * dt;
      s.x += s.v * dt;

      if (s.x >= BOX_END_X) {
        s.x = BOX_END_X;
        setBoxX(BOX_END_X);
        setCurrentVelocity(s.v);
        setIsAnimating(false);
        setHasFinished(true);
        animState.current.running = false;
        return;
      }

      setBoxX(s.x);
      setCurrentVelocity(s.v);
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
  }, [isAnimating, netForce, acceleration, cancelAnim]);

  // Cleanup on unmount
  useEffect(() => () => cancelAnim(), [cancelAnim]);

  // Reset on physics change
  useEffect(() => {
    handleReset();
  }, [force, mass, frictionOn, friction]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePreset = useCallback((p: Preset) => {
    cancelAnim();
    setForce(p.force);
    setMass(p.mass);
    setFrictionOn(p.frictionOn);
    setFriction(p.friction);
    setBoxX(BOX_START_X);
    setCurrentVelocity(0);
    setIsAnimating(false);
    setHasFinished(false);
    animState.current = { x: BOX_START_X, v: 0, running: false };
  }, [cancelAnim]);

  // ── SVG Scene ──────────────────────────────────────────────────────────────

  function renderScene() {
    // Force arrow: length proportional to force, from right face of box
    const forceArrowLen    = Math.min(force * FORCE_ARROW_SCALE, 130);
    const frictionArrowLen = frictionOn ? Math.min(friction * FRICTION_ARROW_SCALE, 100) : 0;

    // Box center Y
    const boxY       = FLOOR_Y - BOX_H;
    const boxCenterX = boxX + BOX_W / 2;
    const boxCenterY = boxY + BOX_H / 2;

    // Net force dashed arrow (below box)
    const netArrowLen = Math.min(netForce * FORCE_ARROW_SCALE, 130);

    // Speedometer
    const speedNorm  = Math.min(currentVelocity / (maxSpeed || 1), 1);
    const needleDeg  = speedoAngle(currentVelocity, maxSpeed);
    const [ndX, ndY] = needlePoint(SPEEDO_CX, SPEEDO_CY, SPEEDO_R - 6, needleDeg);

    // Friction hatch lines (floor)
    const hatchLines = frictionOn
      ? Array.from({ length: 12 }, (_, i) => ({
          x1: i * 45 - 5,
          y1: FLOOR_Y,
          x2: i * 45 + 20,
          y2: FLOOR_Y + 20,
        }))
      : [];

    return (
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ display: 'block', overflow: 'visible', borderRadius: 12 }}
      >
        {/* Background */}
        <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="#050a14" />

        {/* Floor */}
        <rect x={0} y={FLOOR_Y} width={SVG_W} height={SVG_H - FLOOR_Y} fill="#1a2030" />
        {/* Floor hatch (friction) */}
        {hatchLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="rgba(248,113,113,0.2)" strokeWidth={1.5} />
        ))}

        {/* Surface label */}
        {!frictionOn && (
          <text x={SVG_W / 2} y={FLOOR_Y + 22}
            fill="#475569" fontSize={10} fontWeight={700} textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif">
            Frictionless Surface
          </text>
        )}
        {frictionOn && (
          <text x={SVG_W / 2} y={FLOOR_Y + 22}
            fill="#f87171" fontSize={10} fontWeight={700} textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif">
            Surface with Friction
          </text>
        )}

        {/* ── Box ── */}
        <rect
          x={boxX}
          y={boxY}
          width={BOX_W}
          height={BOX_H}
          fill="#334155"
          stroke="#f59e0b"
          strokeWidth={2}
          rx={5}
        />
        <text
          x={boxCenterX}
          y={boxCenterY + 5}
          fill="#f59e0b"
          fontSize={13}
          fontWeight={900}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {mass} kg
        </text>

        {/* ── Applied force arrow → ── */}
        {forceArrowLen > 4 && (
          <g>
            <line
              x1={boxX + BOX_W}
              y1={boxCenterY}
              x2={boxX + BOX_W + forceArrowLen}
              y2={boxCenterY}
              stroke="#f59e0b"
              strokeWidth={3}
            />
            <polygon
              points={`
                ${boxX + BOX_W + forceArrowLen},${boxCenterY - 5}
                ${boxX + BOX_W + forceArrowLen + 10},${boxCenterY}
                ${boxX + BOX_W + forceArrowLen},${boxCenterY + 5}
              `}
              fill="#f59e0b"
            />
            <text
              x={boxX + BOX_W + forceArrowLen / 2 + 5}
              y={boxCenterY - 10}
              fill="#f59e0b"
              fontSize={10}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              F = {force} N
            </text>
          </g>
        )}

        {/* ── Friction arrow ← ── */}
        {frictionOn && frictionArrowLen > 4 && (
          <g>
            <line
              x1={boxX}
              y1={boxCenterY}
              x2={boxX - frictionArrowLen}
              y2={boxCenterY}
              stroke="#f87171"
              strokeWidth={3}
            />
            <polygon
              points={`
                ${boxX - frictionArrowLen},${boxCenterY - 5}
                ${boxX - frictionArrowLen - 10},${boxCenterY}
                ${boxX - frictionArrowLen},${boxCenterY + 5}
              `}
              fill="#f87171"
            />
            <text
              x={boxX - frictionArrowLen / 2 - 5}
              y={boxCenterY - 10}
              fill="#f87171"
              fontSize={10}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              f = {friction} N
            </text>
          </g>
        )}

        {/* ── Net force dashed arrow (below box) ── */}
        {netArrowLen > 2 && (
          <g>
            <line
              x1={boxCenterX}
              y1={FLOOR_Y + 8}
              x2={boxCenterX + netArrowLen}
              y2={FLOOR_Y + 8}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
              strokeDasharray="5,3"
            />
            <polygon
              points={`
                ${boxCenterX + netArrowLen},${FLOOR_Y + 4}
                ${boxCenterX + netArrowLen + 8},${FLOOR_Y + 8}
                ${boxCenterX + netArrowLen},${FLOOR_Y + 12}
              `}
              fill="rgba(255,255,255,0.5)"
            />
            <text
              x={boxCenterX + netArrowLen / 2 + 4}
              y={FLOOR_Y + 22}
              fill="rgba(255,255,255,0.35)"
              fontSize={9}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Net = {netForce.toFixed(0)} N
            </text>
          </g>
        )}

        {/* ── Acceleration label above box ── */}
        <text
          x={boxCenterX}
          y={boxY - 10}
          fill="#818cf8"
          fontSize={11}
          fontWeight={800}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          a = {acceleration.toFixed(2)} m/s²
        </text>

        {/* ── Speedometer arc (top-right) ── */}
        {/* Background track */}
        <path
          d={arcPath(SPEEDO_CX, SPEEDO_CY, SPEEDO_R, 210, 330)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* Filled arc showing speed */}
        {speedNorm > 0.01 && (
          <path
            d={arcPath(SPEEDO_CX, SPEEDO_CY, SPEEDO_R, 210, Math.min(needleDeg, 329))}
            fill="none"
            stroke="#818cf8"
            strokeWidth={6}
            strokeLinecap="round"
          />
        )}
        {/* Needle */}
        <line
          x1={SPEEDO_CX}
          y1={SPEEDO_CY}
          x2={ndX}
          y2={ndY}
          stroke="#a5b4fc"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={SPEEDO_CX} cy={SPEEDO_CY} r={3} fill="#818cf8" />
        {/* Speed label */}
        <text
          x={SPEEDO_CX}
          y={SPEEDO_CY + 16}
          fill="#818cf8"
          fontSize={9}
          fontWeight={700}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          speed
        </text>
      </svg>
    );
  }

  // ── Formula display ────────────────────────────────────────────────────────

  function renderFormula() {
    return (
      <div style={{
        textAlign: 'center',
        marginBottom: 20,
        padding: '16px 12px 12px',
        background: '#050a14',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
      }}>
        {/* Large formula */}
        <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1 }}>
          <span style={{ color: '#f59e0b' }}>F</span>
          <span style={{ color: '#94a3b8', margin: '0 6px', fontWeight: 400 }}>=</span>
          <span style={{ color: '#34d399' }}>m</span>
          <span style={{ color: '#94a3b8', margin: '0 4px', fontWeight: 400 }}>×</span>
          <span style={{ color: '#818cf8' }}>a</span>
        </div>
        {/* Substituted values */}
        <div style={{ fontSize: 15, fontWeight: 700, color: '#64748b' }}>
          <span style={{ color: '#f59e0b' }}>{netForce.toFixed(0)} N</span>
          <span style={{ margin: '0 6px' }}>=</span>
          <span style={{ color: '#34d399' }}>{mass} kg</span>
          <span style={{ margin: '0 4px' }}>×</span>
          <span style={{ color: '#818cf8' }}>{acceleration.toFixed(2)} m/s²</span>
        </div>
      </div>
    );
  }

  // ── Info cards ─────────────────────────────────────────────────────────────

  function renderInfoCards() {
    const cards = [
      { label: 'Force', value: `${netForce.toFixed(0)} N`,              color: '#f59e0b' },
      { label: 'Mass',  value: `${mass} kg`,                            color: '#34d399' },
      { label: 'Accel', value: `${acceleration.toFixed(2)} m/s²`,       color: '#818cf8' },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: '#050a14',
            border: `1px solid ${c.color}33`,
            borderRadius: 12,
            padding: '10px 6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const canLaunch = !isAnimating && netForce > 0;

  return (
    <div style={{
      background: '#0d1117',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16,
      padding: 24,
      maxWidth: 900,
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#fff',
          margin: 0,
          marginBottom: 4,
        }}>
          Newton&apos;s <span style={{ color: '#f59e0b' }}>Second Law</span>
        </h2>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#475569',
          margin: 0,
        }}>
          F = ma — force, mass, and acceleration
        </p>
      </div>

      {/* ── Formula display ── */}
      {renderFormula()}

      {/* ── Controls ── */}
      <div style={{
        background: '#050a14',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>

        {/* Force slider */}
        <div>
          <label style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: 6,
          }}>
            Applied Force (F)
            <span style={{ marginLeft: 8, color: '#f59e0b', fontWeight: 900, fontSize: 13, textTransform: 'none', letterSpacing: 0 }}>
              {force} N
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={force}
            onChange={e => setForce(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#f59e0b' }}
          />
        </div>

        {/* Mass slider */}
        <div>
          <label style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: 6,
          }}>
            Mass (m)
            <span style={{ marginLeft: 8, color: '#34d399', fontWeight: 900, fontSize: 13, textTransform: 'none', letterSpacing: 0 }}>
              {mass} kg
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={mass}
            onChange={e => setMass(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#34d399' }}
          />
        </div>

        {/* Friction toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            color: frictionOn ? '#f87171' : '#64748b',
            userSelect: 'none',
          }}>
            <div
              onClick={() => setFrictionOn(v => !v)}
              style={{
                width: 38,
                height: 20,
                borderRadius: 10,
                background: frictionOn ? '#ef4444' : 'rgba(255,255,255,0.1)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
                flexShrink: 0,
                border: frictionOn ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: frictionOn ? 18 : 2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }} />
            </div>
            Friction {frictionOn ? 'ON' : 'OFF'}
          </label>
          {frictionOn && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="range"
                min={0}
                max={Math.min(19, force - 1)}
                value={friction}
                onChange={e => setFriction(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#f87171' }}
              />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#f87171', minWidth: 36, textAlign: 'right' }}>
                {friction} N
              </span>
            </div>
          )}
        </div>

        {/* Net force display when friction ON */}
        {frictionOn && (
          <div style={{
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: '#f87171',
            fontWeight: 700,
          }}>
            Net Force = {force} N − {friction} N = <span style={{ color: netForce <= 0 ? '#ef4444' : '#fbbf24' }}>{netForce} N</span>
            {netForce <= 0 && (
              <span style={{ marginLeft: 8, color: '#ef4444', fontSize: 11 }}>
                (no motion — friction exceeds applied force)
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── SVG Animation scene ── */}
      <div style={{
        background: '#050a14',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        {renderScene()}
      </div>

      {/* ── Info cards ── */}
      {renderInfoCards()}

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button
          onClick={handleLaunch}
          disabled={!canLaunch}
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 800,
            cursor: canLaunch ? 'pointer' : 'not-allowed',
            border: 'none',
            background: canLaunch
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'rgba(255,255,255,0.06)',
            color: canLaunch ? '#000' : '#334155',
            letterSpacing: '0.02em',
            transition: 'all 0.2s',
          }}
        >
          {isAnimating ? '▶ Launching…' : hasFinished ? '▶ Launch Again' : '▶ Launch'}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '11px 20px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#94a3b8',
            letterSpacing: '0.02em',
          }}
        >
          ↺ Reset
        </button>
      </div>

      {/* ── Try it presets ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}>
          Try it
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              {p.label}
              <span style={{ marginLeft: 6, color: '#475569', fontWeight: 500 }}>
                (F={p.force}, m={p.mass})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Key insight ── */}
      <div style={{
        background: 'rgba(129,140,248,0.06)',
        border: '1px solid rgba(129,140,248,0.2)',
        borderRadius: 12,
        padding: '12px 14px',
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>
          <strong style={{ color: '#818cf8' }}>Doubling the force doubles the acceleration.</strong>{' '}
          Doubling the mass halves the acceleration. That is Newton&apos;s Second Law:{' '}
          <strong style={{ color: '#818cf8' }}>a = F / m</strong>.
        </p>
      </div>
    </div>
  );
}
