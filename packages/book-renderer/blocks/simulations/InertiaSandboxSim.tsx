'use client';

// InertiaSandboxSim.tsx
// Class 9 Physics — Force and Laws of Motion
// Newton's First Law (Law of Inertia): objects resist changes in motion.
// When a truck brakes, objects on the flatbed keep moving forward because
// of inertia. Heavier objects carry more momentum and are harder to stop.
// Design: follows SIMULATION_DESIGN_WORKFLOW.md exactly.

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type Phase = 'ready' | 'moving' | 'braking' | 'stopped';
type MassKey = 'light' | 'medium' | 'heavy';

interface MassConfig {
  key: MassKey;
  label: string;
  mass: number;           // kg
  size: number;           // px
  color: string;
  baseX: number;          // x on flatbed (relative to flatbed left edge)
}

// ── Constants ──────────────────────────────────────────────────────────────────

const MASSES: MassConfig[] = [
  { key: 'light',  label: '1 kg',  mass: 1,  size: 25, color: '#34d399', baseX: 50  },
  { key: 'medium', label: '5 kg',  mass: 5,  size: 35, color: '#f59e0b', baseX: 120 },
  { key: 'heavy',  label: '10 kg', mass: 10, size: 45, color: '#f87171', baseX: 210 },
];

const FLATBED_LEFT   = 60;   // x in SVG
const FLATBED_RIGHT  = 340;  // x in SVG
const FLATBED_TOP    = 130;  // y in SVG
const FLATBED_HEIGHT = 30;
const CAB_LEFT       = 340;
const CAB_TOP        = 90;
const CAB_WIDTH      = 90;
const CAB_HEIGHT     = 70;
const ROAD_Y         = 160;
const SVG_W          = 500;
const SVG_H          = 200;

// ── Main component ─────────────────────────────────────────────────────────────

export default function InertiaSandboxSim() {
  const [speed, setSpeed]             = useState(80);           // km/h
  const [brakeForce, setBrakeForce]   = useState(5);
  const [activeBlocks, setActiveBlocks] = useState<Record<MassKey, boolean>>({
    light: true, medium: true, heavy: true,
  });

  const [phase, setPhase]             = useState<Phase>('ready');
  // truckOffset: how many px the truck has moved leftward (positive = moved left)
  const [truckOffset, setTruckOffset] = useState(0);
  // blockSlide: how many px each block slid rightward relative to truck
  const [blockSlide, setBlockSlide]   = useState<Record<MassKey, number>>({
    light: 0, medium: 0, heavy: 0,
  });
  const [currentSpeed, setCurrentSpeed] = useState(0); // km/h, for display
  const [brakingFlash, setBrakingFlash] = useState(false);

  const rafRef         = useRef<number | null>(null);
  const stateRef       = useRef({
    truckOffset: 0,
    blockSlide:  { light: 0, medium: 0, heavy: 0 } as Record<MassKey, number>,
    speed:       0,
    phase:       'ready' as Phase,
  });

  // Keep ref in sync with rendered values
  const phaseRef = useRef<Phase>('ready');

  const cancelAnim = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleReset = useCallback(() => {
    cancelAnim();
    setPhase('ready');
    phaseRef.current = 'ready';
    setTruckOffset(0);
    setBlockSlide({ light: 0, medium: 0, heavy: 0 });
    setCurrentSpeed(0);
    setBrakingFlash(false);
    stateRef.current = {
      truckOffset: 0,
      blockSlide:  { light: 0, medium: 0, heavy: 0 },
      speed:       0,
      phase:       'ready',
    };
  }, [cancelAnim]);

  const toggleBlock = useCallback((key: MassKey) => {
    if (phase !== 'ready') return;
    setActiveBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  }, [phase]);

  const handleStartMoving = useCallback(() => {
    cancelAnim();
    stateRef.current = {
      truckOffset: 0,
      blockSlide:  { light: 0, medium: 0, heavy: 0 },
      speed:       speed,
      phase:       'moving',
    };
    setTruckOffset(0);
    setBlockSlide({ light: 0, medium: 0, heavy: 0 });
    setCurrentSpeed(speed);
    setPhase('moving');
    phaseRef.current = 'moving';
  }, [cancelAnim, speed]);

  const handleBrake = useCallback(() => {
    if (phaseRef.current !== 'moving') return;
    stateRef.current.phase = 'braking';
    setPhase('braking');
    phaseRef.current = 'braking';
    setBrakingFlash(true);

    let lastTs: number | null = null;

    function step(ts: number) {
      if (lastTs === null) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05); // seconds, capped
      lastTs = ts;

      const s = stateRef.current;
      if (s.phase !== 'braking') return;

      // Convert km/h to px/s for visual offset (scale: 1 km/h ≈ 0.6 px/s)
      const PX_PER_KMH = 0.6;
      // Deceleration: brakeForce * 10 km/h/s
      const decel = brakeForce * 10; // km/h per second

      const prevSpeed = s.speed;
      const newSpeed  = Math.max(0, prevSpeed - decel * dt);
      s.speed = newSpeed;

      // Truck moves leftward by how much the truck slowed visually
      const deltaTruck = prevSpeed * PX_PER_KMH * dt;
      s.truckOffset += deltaTruck;

      // Each active block slides rightward relative to truck
      // Blocks keep moving at original speed while truck decelerates.
      // Relative slide per frame = (original speed - current truck speed) * px factor * dt
      // But since we accumulate deltaTruck each frame, blockSlide = truckOffset
      // (all blocks slide the same relative to truck — they all maintain inertia equally)
      // Momentum display: p = m * v, so heavier blocks HAVE more momentum
      // The educational point is shown via momentum labels, not different slide amounts.
      const newSlide = { ...s.blockSlide };
      for (const mk of (['light', 'medium', 'heavy'] as MassKey[])) {
        if (activeBlocks[mk]) {
          newSlide[mk] = s.truckOffset; // slide = truck's leftward shift
        }
      }
      s.blockSlide = newSlide;

      setTruckOffset(s.truckOffset);
      setBlockSlide({ ...s.blockSlide });
      setCurrentSpeed(s.speed);

      if (newSpeed <= 0) {
        s.phase = 'stopped';
        setPhase('stopped');
        phaseRef.current = 'stopped';
        setBrakingFlash(false);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
  }, [brakeForce, activeBlocks]);

  // Clean up on unmount
  useEffect(() => {
    return () => cancelAnim();
  }, [cancelAnim]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const speedInMs = (s: number) => parseFloat((s / 3.6).toFixed(1)); // km/h → m/s

  // ── Render SVG scene ───────────────────────────────────────────────────────

  // Truck body shifts left by truckOffset
  const tOff = Math.min(truckOffset, 200); // cap so it doesn't leave the scene

  function renderTruckScene() {
    const flatbedX = FLATBED_LEFT - tOff;
    const cabX     = CAB_LEFT - tOff;

    // Velocity arrow length: proportional to currentSpeed / speed (max 100px)
    const arrowLen = speed > 0 ? (currentSpeed / speed) * 90 : 0;
    const arrowX   = flatbedX + (FLATBED_RIGHT - FLATBED_LEFT) / 2;
    const arrowY   = FLATBED_TOP - 30;

    return (
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ display: 'block', overflow: 'hidden', borderRadius: 12 }}
      >
        {/* Sky */}
        <rect x={0} y={0} width={SVG_W} height={ROAD_Y} fill="#050a14" />

        {/* Road */}
        <rect x={0} y={ROAD_Y} width={SVG_W} height={SVG_H - ROAD_Y} fill="#1e2435" />

        {/* Road markings: dashed white lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect
            key={i}
            x={i * 60 + ((tOff * 0.5) % 60) - 10}
            y={ROAD_Y + 16}
            width={30}
            height={4}
            fill="rgba(255,255,255,0.18)"
            rx={2}
          />
        ))}

        {/* BRAKING text */}
        {brakingFlash && (
          <text
            x={SVG_W / 2}
            y={24}
            fill="#ef4444"
            fontSize={14}
            fontWeight={900}
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing={3}
          >
            ⚠ BRAKING
          </text>
        )}

        {/* ── Flatbed ── */}
        <rect
          x={flatbedX}
          y={FLATBED_TOP}
          width={FLATBED_RIGHT - FLATBED_LEFT}
          height={FLATBED_HEIGHT}
          fill="#1e2a3a"
          rx={2}
        />

        {/* ── Cab (right side of truck) ── */}
        <rect
          x={cabX}
          y={CAB_TOP}
          width={CAB_WIDTH}
          height={CAB_HEIGHT}
          fill="#334155"
          rx={6}
        />
        {/* Windshield */}
        <rect
          x={cabX + 8}
          y={CAB_TOP + 10}
          width={CAB_WIDTH - 24}
          height={28}
          fill="rgba(100,200,255,0.15)"
          rx={4}
        />
        {/* Headlight */}
        <circle
          cx={cabX + CAB_WIDTH - 8}
          cy={CAB_TOP + CAB_HEIGHT - 12}
          r={5}
          fill="#fef08a"
          opacity={0.7}
        />

        {/* ── Wheels ── (4 wheels, positions relative to flatbed/cab) */}
        {[
          flatbedX + 30,
          flatbedX + 110,
          flatbedX + (FLATBED_RIGHT - FLATBED_LEFT) - 30,
          cabX + CAB_WIDTH - 20,
        ].map((wx, i) => (
          <g key={i}>
            <circle cx={wx} cy={ROAD_Y} r={20} fill="#0f1a24" stroke="#334155" strokeWidth={3} />
            <circle cx={wx} cy={ROAD_Y} r={8}  fill="#1e2a3a" />
          </g>
        ))}

        {/* ── Objects on flatbed ── */}
        {MASSES.map(({ key, size, color, baseX }) => {
          if (!activeBlocks[key]) return null;

          // Block's absolute x: baseX relative to flatbed left, plus flatbed's current x, plus slide
          const slide   = blockSlide[key];
          const blockX  = flatbedX + baseX + slide;
          const blockY  = FLATBED_TOP - size;
          const centerX = blockX + size / 2;
          const centerY = blockY + size / 2;

          // Momentum = mass × speed (in m/s)
          const momentum = MASSES.find(m => m.key === key)!.mass * speedInMs(currentSpeed);

          return (
            <g key={key}>
              <rect
                x={blockX}
                y={blockY}
                width={size}
                height={size}
                fill={color}
                opacity={0.9}
                rx={4}
              />
              {/* Mass label */}
              <text
                x={centerX}
                y={centerY + 4}
                fill="#fff"
                fontSize={10}
                fontWeight={700}
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {MASSES.find(m => m.key === key)!.label}
              </text>
              {/* Momentum label above block (shown during/after braking) */}
              {(phase === 'braking' || phase === 'stopped') && (
                <text
                  x={centerX}
                  y={blockY - 6}
                  fill={color}
                  fontSize={9}
                  fontWeight={700}
                  textAnchor="middle"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  p = {momentum.toFixed(0)} kg·m/s
                </text>
              )}
            </g>
          );
        })}

        {/* ── Velocity arrow ── */}
        {(phase === 'moving' || (phase === 'braking' && currentSpeed > 1)) && arrowLen > 4 && (
          <g>
            <line
              x1={arrowX - arrowLen / 2}
              y1={arrowY}
              x2={arrowX + arrowLen / 2}
              y2={arrowY}
              stroke="#f59e0b"
              strokeWidth={3}
            />
            <polygon
              points={`
                ${arrowX + arrowLen / 2},${arrowY - 5}
                ${arrowX + arrowLen / 2 + 10},${arrowY}
                ${arrowX + arrowLen / 2},${arrowY + 5}
              `}
              fill="#f59e0b"
            />
            <text
              x={arrowX}
              y={arrowY - 10}
              fill="#f59e0b"
              fontSize={10}
              fontWeight={700}
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {currentSpeed.toFixed(0)} km/h
            </text>
          </g>
        )}

        {/* ── "Objects slid forward!" label on stopped ── */}
        {phase === 'stopped' && (
          <text
            x={SVG_W / 2}
            y={FLATBED_TOP - 55}
            fill="#34d399"
            fontSize={12}
            fontWeight={800}
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Objects slid forward due to inertia!
          </text>
        )}
      </svg>
    );
  }

  // ── Momentum cards ─────────────────────────────────────────────────────────

  function renderMomentumCards() {
    const displayPhase = phase === 'braking' || phase === 'stopped';
    if (!displayPhase) return null;
    const initSpeedMs = speedInMs(speed);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {MASSES.map(({ key, label, mass, color }) => {
          if (!activeBlocks[key]) return null;
          const initMomentum = mass * initSpeedMs;
          return (
            <div
              key={key}
              style={{
                background: '#0d1117',
                border: `1px solid ${color}33`,
                borderRadius: 12,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: color, fontWeight: 800, marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>
                Initial momentum
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: color }}>
                {initMomentum.toFixed(1)} <span style={{ fontSize: 9, fontWeight: 500, color: '#64748b' }}>kg·m/s</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Insight callout ────────────────────────────────────────────────────────

  const insight = (
    <div style={{
      background: 'rgba(245,158,11,0.06)',
      border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: 12,
      padding: '12px 14px',
    }}>
      <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>
        The blocks kept moving because of <strong style={{ color: '#f59e0b' }}>inertia</strong> — the
        tendency of objects to resist changes in their state of motion. This is Newton&apos;s{' '}
        <strong style={{ color: '#f59e0b' }}>First Law of Motion</strong>.
      </p>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

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
          Inertia <span style={{ color: '#f59e0b' }}>Sandbox</span>
        </h2>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#475569',
          margin: 0,
        }}>
          Newton&apos;s First Law — objects resist changes in motion
        </p>
      </div>

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
        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Speed */}
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
              Truck Speed
              <span style={{
                marginLeft: 8,
                color: '#f59e0b',
                fontWeight: 900,
                fontSize: 13,
                textTransform: 'none',
                letterSpacing: 0,
              }}>{speed} km/h</span>
            </label>
            <input
              type="range"
              min={20}
              max={120}
              value={speed}
              disabled={phase !== 'ready'}
              onChange={e => setSpeed(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: phase !== 'ready' ? 'not-allowed' : 'pointer' }}
            />
          </div>
          {/* Brake Force */}
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
              Brake Force
              <span style={{
                marginLeft: 8,
                color: '#f87171',
                fontWeight: 900,
                fontSize: 13,
                textTransform: 'none',
                letterSpacing: 0,
              }}>{brakeForce} / 10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={brakeForce}
              disabled={phase !== 'ready'}
              onChange={e => setBrakeForce(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', cursor: phase !== 'ready' ? 'not-allowed' : 'pointer' }}
            />
          </div>
        </div>

        {/* Mass toggles */}
        <div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}>
            Objects on truck
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {MASSES.map(({ key, label, mass, color }) => {
              const active = activeBlocks[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleBlock(key)}
                  disabled={phase !== 'ready'}
                  style={{
                    flex: 1,
                    padding: '7px 6px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: phase !== 'ready' ? 'not-allowed' : 'pointer',
                    border: `1px solid ${active ? color + '66' : 'rgba(255,255,255,0.08)'}`,
                    background: active ? color + '18' : 'rgba(255,255,255,0.03)',
                    color: active ? color : '#475569',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {active ? '● ' : '○ '}
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({mass} kg)
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SVG Scene ── */}
      <div style={{
        background: '#050a14',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        {renderTruckScene()}
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {phase === 'ready' && (
          <button
            onClick={handleStartMoving}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              letterSpacing: '0.02em',
            }}
          >
            ▶ Start Moving
          </button>
        )}
        {phase === 'moving' && (
          <button
            onClick={handleBrake}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              background: '#ef4444',
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            🛑 Brake!
          </button>
        )}
        {(phase === 'braking' || phase === 'stopped') && (
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '11px 16px',
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
        )}
      </div>

      {/* ── Momentum cards ── */}
      {renderMomentumCards()}

      {/* ── Key insight ── */}
      {insight}
    </div>
  );
}
