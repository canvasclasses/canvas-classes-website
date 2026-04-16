'use client';

// Energy Conservation Simulator — Chapter 4: Work and Energy
// Law of Conservation of Energy: PE + KE = Total Mechanical Energy = constant (no friction)
// Source: NCERT Class 9 Science, Chapter 11
// Pendulum model: at top → max PE, min KE; at bottom → max KE, min PE
// Also shows roller coaster / ramp variant

import { useState, useEffect, useRef, useCallback } from 'react';

const g = 9.8;           // m/s² — NCERT standard value
const L = 1.2;           // pendulum length in metres (display scale)
const PIVOT_X = 250;
const PIVOT_Y = 60;
const PX_PER_M = 120;    // SVG pixels per metre of pendulum length

// Convert angle (degrees from vertical) → pendulum bob position in SVG coords
function pendulumPos(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: PIVOT_X + L * PX_PER_M * Math.sin(a),
    y: PIVOT_Y + L * PX_PER_M * Math.cos(a),
  };
}

// Height above lowest point
function heightAt(angleDeg: number): number {
  return L * (1 - Math.cos((angleDeg * Math.PI) / 180));
}

export default function EnergyConservationSim() {
  const [maxAngle, setMaxAngle] = useState(45);   // release angle in degrees
  const [mass, setMass]         = useState(2);    // kg
  const [running, setRunning]   = useState(false);
  const [friction, setFriction] = useState(false);
  const [angleDeg, setAngleDeg] = useState(45);

  const animRef  = useRef<number | null>(null);
  const stateRef = useRef({ angle: 45.0, omega: 0.0, t: 0.0 });

  const totalE = 0.5 * mass * g * heightAt(maxAngle) * 2; // full ME = mgh_max

  // Height at current angle
  const h   = heightAt(angleDeg);
  const PE  = mass * g * h;
  // v² = 2g(h_max − h)
  const hMax = heightAt(maxAngle);
  const vSq = Math.max(0, 2 * g * (hMax - h));
  const v   = Math.sqrt(vSq);
  const KE  = 0.5 * mass * vSq;
  const ME  = PE + KE;

  const peBar = hMax > 0 ? (h / hMax) * 100 : 0;
  const keBar = hMax > 0 ? ((hMax - h) / hMax) * 100 : 0;

  // Physics: d²θ/dt² = -(g/L)sinθ — simple pendulum equation
  const step = useCallback((dt: number) => {
    const s = stateRef.current;
    // RK4 integration for smooth animation
    const f = (angle: number, omega: number) => -(g / L) * Math.sin((angle * Math.PI) / 180) * (180 / Math.PI);
    const k1a = s.omega;
    const k1o = f(s.angle, s.omega);
    const k2a = s.omega + 0.5 * dt * k1o;
    const k2o = f(s.angle + 0.5 * dt * k1a, s.omega + 0.5 * dt * k1o);
    const k3a = s.omega + 0.5 * dt * k2o;
    const k3o = f(s.angle + 0.5 * dt * k2a, s.omega + 0.5 * dt * k2o);
    const k4a = s.omega + dt * k3o;
    const k4o = f(s.angle + dt * k3a, s.omega + dt * k3o);

    s.angle += (dt / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
    s.omega += (dt / 6) * (k1o + 2 * k2o + 2 * k3o + k4o);
    s.t     += dt;

    // Energy damping for friction mode
    if (friction) {
      const b = 0.25; // damping coefficient
      s.omega -= b * s.omega * dt;
      // Gradually reduce angle amplitude via damping
    }
  }, [friction]);

  useEffect(() => {
    if (!running) return;
    let lastTime: number | null = null;
    const frame = (ts: number) => {
      if (lastTime !== null) {
        const dt = Math.min((ts - lastTime) / 1000, 0.04); // cap dt at 40ms
        step(dt);
        setAngleDeg(stateRef.current.angle);
      }
      lastTime = ts;
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, step]);

  function handlePlay() {
    stateRef.current = { angle: maxAngle, omega: 0, t: 0 };
    setAngleDeg(maxAngle);
    setRunning(true);
  }

  function handleReset() {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setRunning(false);
    stateRef.current = { angle: maxAngle, omega: 0, t: 0 };
    setAngleDeg(maxAngle);
  }

  // Trail effect: last N positions
  const bob = pendulumPos(angleDeg);
  const SVG_W = 500, SVG_H = 300;

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
          Conservation of Energy — Pendulum
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          PE + KE = constant (no friction) — energy converts but never disappears
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — pendulum SVG + energy bars */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Pendulum visualisation */}
          <div style={{
            background: 'linear-gradient(135deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}>
              {/* Arc guide (max swing) */}
              <path
                d={`M ${pendulumPos(-maxAngle).x} ${pendulumPos(-maxAngle).y} A ${L * PX_PER_M} ${L * PX_PER_M} 0 0 1 ${pendulumPos(maxAngle).x} ${pendulumPos(maxAngle).y}`}
                fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth={1.5} strokeDasharray="4,3"
              />

              {/* Height reference lines */}
              {/* Bottom (lowest point) */}
              <line x1={PIVOT_X - 60} y1={PIVOT_Y + L * PX_PER_M}
                x2={PIVOT_X + 60} y2={PIVOT_Y + L * PX_PER_M}
                stroke="rgba(52,211,153,0.3)" strokeWidth={1} strokeDasharray="4,3" />
              <text x={PIVOT_X + 68} y={PIVOT_Y + L * PX_PER_M + 4}
                fill="#34d399" fontSize={10}>h = 0 (max KE)</text>

              {/* Height label on bob */}
              {h > 0.02 && (
                <>
                  <line x1={bob.x + 22} y1={PIVOT_Y + L * PX_PER_M}
                    x2={bob.x + 22} y2={bob.y}
                    stroke="rgba(248,113,113,0.5)" strokeWidth={1.5} strokeDasharray="3,2" />
                  <text x={bob.x + 28} y={(PIVOT_Y + L * PX_PER_M + bob.y) / 2 + 3}
                    fill="#f87171" fontSize={10}>h = {h.toFixed(2)}m</text>
                </>
              )}

              {/* Pivot */}
              <circle cx={PIVOT_X} cy={PIVOT_Y} r={6} fill="#334155" stroke="#64748b" strokeWidth={1.5} />

              {/* String */}
              <line x1={PIVOT_X} y1={PIVOT_Y} x2={bob.x} y2={bob.y}
                stroke="#94a3b8" strokeWidth={2} />

              {/* Bob */}
              <circle cx={bob.x} cy={bob.y} r={18}
                fill={`rgba(99,102,241,${0.6 + keBar / 250})`}
                stroke="#818cf8" strokeWidth={2}
              />
              {/* Velocity arrow at bob */}
              {running && v > 0.1 && (
                <line
                  x1={bob.x} y1={bob.y}
                  x2={bob.x + (angleDeg > 0 ? -1 : 1) * Math.min(40, v * 6)} y2={bob.y + (angleDeg > 0 ? -1 : 1) * 2}
                  stroke="#34d399" strokeWidth={2.5}
                  markerEnd="url(#vel-arrow)"
                />
              )}
              <defs>
                <marker id="vel-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
                </marker>
              </defs>
              <text x={bob.x} y={bob.y + 5} textAnchor="middle" fill="white"
                fontSize={9} fontWeight={700}>{mass}kg</text>

              {/* Energy labels on pendulum */}
              <text x={PIVOT_X - 90} y={PIVOT_Y + 24} fill="#f87171" fontSize={10} fontWeight={700}>
                PE = {PE.toFixed(1)} J
              </text>
              <text x={PIVOT_X + 50} y={PIVOT_Y + 24} fill="#34d399" fontSize={10} fontWeight={700}>
                KE = {KE.toFixed(1)} J
              </text>
            </svg>
          </div>

          {/* Energy bars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '14px 16px', marginTop: 12,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Energy Breakdown
            </p>

            {/* Total ME bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Total Mechanical Energy (PE + KE)</span>
                <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>{ME.toFixed(1)} J</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, width: `${friction ? Math.max(5, (ME / (mass * g * hMax)) * 100) : 100}%`,
                  background: 'linear-gradient(to right, #fbbf24, #fb923c)', transition: 'width 0.3s' }} />
              </div>
              {friction && <div style={{ fontSize: 10, color: '#f87171', marginTop: 3 }}>
                ↓ Energy being lost to heat (friction)
              </div>}
            </div>

            {/* Stacked PE + KE bars */}
            <div style={{ height: 24, background: 'rgba(255,255,255,0.04)',
              borderRadius: 8, overflow: 'hidden', display: 'flex', marginBottom: 8 }}>
              <div style={{
                height: '100%', width: `${peBar}%`,
                background: 'linear-gradient(to right, #dc2626, #f87171)',
                transition: 'width 0.1s', display: 'flex', alignItems: 'center',
                justifyContent: 'center', overflow: 'hidden',
              }}>
                {peBar > 15 && <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>PE</span>}
              </div>
              <div style={{
                height: '100%', flex: 1,
                background: 'linear-gradient(to right, #059669, #34d399)',
                transition: 'width 0.1s', display: 'flex', alignItems: 'center',
                justifyContent: 'center', overflow: 'hidden',
              }}>
                {keBar > 15 && <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>KE</span>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#f87171' }} />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>PE = mgh = {PE.toFixed(1)} J</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#34d399' }} />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>KE = ½mv² = {KE.toFixed(1)} J</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — controls + concepts */}
        <div style={{ width: 240, flexShrink: 0 }}>

          {/* Playback controls */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={handlePlay} disabled={running} style={{
              flex: 1, padding: '9px 0', borderRadius: 8,
              border: '1px solid rgba(52,211,153,0.4)',
              background: running ? 'rgba(52,211,153,0.05)' : 'rgba(52,211,153,0.15)',
              color: running ? '#475569' : '#34d399',
              fontSize: 13, fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer',
            }}>
              ▶ Release
            </button>
            <button onClick={handleReset} style={{
              flex: 1, padding: '9px 0', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              ↺ Reset
            </button>
          </div>

          {/* Sliders */}
          {[
            { label: 'Release angle (°)', val: maxAngle, set: setMaxAngle, min: 5, max: 80, color: '#6366f1' },
            { label: 'Mass (kg)', val: mass, set: setMass, min: 1, max: 10, color: '#fb923c' },
          ].map(({ label, val, set, min, max, color }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 14, color, fontWeight: 700 }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: color }} />
            </div>
          ))}

          {/* Friction toggle */}
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => { setFriction(f => !f); handleReset(); }} style={{
              width: '100%', padding: '9px 0', borderRadius: 8, cursor: 'pointer',
              border: friction ? '1px solid rgba(248,113,113,0.4)' : '1px solid rgba(255,255,255,0.1)',
              background: friction ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
              color: friction ? '#f87171' : '#64748b',
              fontSize: 12, fontWeight: 700,
            }}>
              {friction ? '🔥 Friction ON (energy lost)' : '❄ Friction OFF (ideal)'}
            </button>
          </div>

          {/* Live readings */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '14px 12px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Live Readings
            </p>
            {[
              { label: 'Height h', val: `${h.toFixed(3)} m`,   color: '#f87171' },
              { label: 'Velocity v', val: `${v.toFixed(2)} m/s`, color: '#34d399' },
              { label: 'PE = mgh', val: `${PE.toFixed(2)} J`,  color: '#f87171' },
              { label: 'KE = ½mv²', val: `${KE.toFixed(2)} J`, color: '#34d399' },
              { label: 'Total ME', val: `${ME.toFixed(2)} J`,  color: '#fbbf24' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
                marginBottom: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: 12, color, fontWeight: 700 }}>{val}</span>
              </div>
            ))}
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
              { term: 'Conservation law', def: 'Energy is neither created nor destroyed — only transformed.' },
              { term: 'At top (θ = max)', def: 'All energy is PE. KE = 0. v = 0.' },
              { term: 'At bottom (θ = 0)', def: 'All energy is KE. PE = 0. v is maximum.' },
              { term: 'With friction', def: 'Some ME converts to heat. Total energy still conserved — just not mechanical.' },
              { term: 'Formula', def: 'mgh_max = ½mv²_max → v_max = √(2g·h_max)' },
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
