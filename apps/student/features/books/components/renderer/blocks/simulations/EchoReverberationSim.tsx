'use client';

// Echo & Reverberation Sim — Chapter 12: Reflection of Sound
// Interactive echo simulator with animated pulse, echo log, Gol Gumbaz info card.

import { useState, useEffect, useRef, useCallback } from 'react';

const SPEED_OF_SOUND = 343; // m/s
const MIN_ECHO_DIST = 17.2; // meters

interface Pulse {
  id: number;
  startTime: number; // performance.now() ms at creation
  distance: number;  // distance snapshot when clapped
}

interface EchoLog {
  id: number;
  distance: number;
  echoTime: number;
  timestamp: number;
}

const SVG_W = 500;
const SVG_H = 180;

export default function EchoReverberationSim() {
  const [distance, setDistance] = useState(50);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [currentTime, setCurrentTime] = useState(0); // ms elapsed since page load
  const [echoLog, setEchoLog] = useState<EchoLog[]>([]);
  const [showGolGumbaz, setShowGolGumbaz] = useState(false);
  const [echoFlashes, setEchoFlashes] = useState<number[]>([]); // pulse ids that just echoed

  const rafRef = useRef<number | null>(null);
  const pulseIdRef = useRef(0);
  const logIdRef = useRef(0);
  const completedPulsesRef = useRef<Set<number>>(new Set());

  // Animation loop
  useEffect(() => {
    const loop = (ts: number) => {
      setCurrentTime(ts);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Check pulse completions
  useEffect(() => {
    pulses.forEach(pulse => {
      const elapsed = (currentTime - pulse.startTime) / 1000;
      const totalTime = (2 * pulse.distance) / SPEED_OF_SOUND;
      if (elapsed >= totalTime && !completedPulsesRef.current.has(pulse.id)) {
        completedPulsesRef.current.add(pulse.id);
        const logEntry: EchoLog = {
          id: logIdRef.current++,
          distance: pulse.distance,
          echoTime: totalTime,
          timestamp: Date.now(),
        };
        setEchoLog(prev => [logEntry, ...prev].slice(0, 3));
        setEchoFlashes(prev => [...prev, pulse.id]);
        setTimeout(() => {
          setEchoFlashes(prev => prev.filter(id => id !== pulse.id));
          setPulses(prev => prev.filter(p => p.id !== pulse.id));
        }, 800);
      }
    });
  }, [currentTime, pulses]);

  const sendClap = useCallback(() => {
    if (pulses.length >= 3) return;
    const newPulse: Pulse = {
      id: pulseIdRef.current++,
      startTime: currentTime,
      distance,
    };
    setPulses(prev => [...prev, newPulse]);
  }, [pulses.length, currentTime, distance]);

  const echoTime = (2 * distance) / SPEED_OF_SOUND;
  const tooClose = distance < MIN_ECHO_DIST;

  // Visualization layout
  const personX = 50;
  const wallX = SVG_W - 40;
  const trackY = SVG_H / 2;

  // Build pulse visuals
  type PulseVisual = {
    pulse: Pulse;
    progress: number; // 0→1 outgoing, 1→2 returning
    x: number;
    phase: 'outgoing' | 'returning';
    opacity: number;
  };

  const pulseVisuals: PulseVisual[] = pulses.map(pulse => {
    const elapsed = (currentTime - pulse.startTime) / 1000;
    const half = pulse.distance / SPEED_OF_SOUND;
    const progress = Math.min(2, elapsed / half);
    const phase = progress <= 1 ? 'outgoing' : 'returning';
    let x: number;
    if (progress <= 1) {
      x = personX + (wallX - personX) * progress;
    } else {
      x = wallX - (wallX - personX) * (progress - 1);
    }
    const opacity = progress >= 1.8 ? 1 - (progress - 1.8) / 0.2 : 1;
    return { pulse, progress, x, phase, opacity };
  });

  const hasEchoFlash = echoFlashes.length > 0;

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f87171', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Echo &amp; Reverberation
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          Reflection of Sound: Echo Simulator
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* Left panel: SVG + echo log */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>

          {/* Main visualization */}
          <div style={{ background: '#050a10', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 14 }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Ground */}
              <line x1={personX} y1={trackY + 30} x2={wallX} y2={trackY + 30} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

              {/* Distance label */}
              <line x1={personX} y1={trackY + 22} x2={wallX} y2={trackY + 22} stroke="rgba(255,255,255,0.12)" strokeWidth={1} markerEnd="url(#arrowD)" markerStart="url(#arrowDStart)" />
              <text x={(personX + wallX) / 2} y={trackY + 19} fill="#64748b" fontSize={10} textAnchor="middle">{distance} m</text>

              {/* Person */}
              <text x={personX} y={trackY + 8} fontSize={22} textAnchor="middle">🔊</text>

              {/* Wall */}
              <rect x={wallX - 8} y={20} width={14} height={SVG_H - 60} rx={3} fill="#94a3b8" opacity={0.6} />
              <text x={wallX} y={SVG_H - 10} fontSize={9} fill="#64748b" textAnchor="middle">WALL</text>

              {/* Pulse animations */}
              {pulseVisuals.map(({ pulse, x, phase, opacity }) => {
                const color = phase === 'returning' ? '#fb923c' : '#818cf8';
                return (
                  <g key={pulse.id} opacity={opacity}>
                    <circle cx={x} cy={trackY} r={10} fill="none" stroke={color} strokeWidth={2} />
                    <circle cx={x} cy={trackY} r={18} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
                    <circle cx={x} cy={trackY} r={26} fill="none" stroke={color} strokeWidth={0.5} opacity={0.2} />
                  </g>
                );
              })}

              {/* ECHO flash */}
              {hasEchoFlash && (
                <text x={personX} y={trackY - 30} fill="#fbbf24" fontSize={16} fontWeight={800} textAnchor="middle">ECHO!</text>
              )}

              {/* Arrow defs */}
              <defs>
                <marker id="arrowD" markerWidth={5} markerHeight={5} refX={3} refY={2.5} orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(255,255,255,0.2)" />
                </marker>
                <marker id="arrowDStart" markerWidth={5} markerHeight={5} refX={2} refY={2.5} orient="auto-start-reverse">
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(255,255,255,0.2)" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Timeline */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              Timeline (current settings)
            </div>
            <div style={{ position: 'relative', height: 24 }}>
              {/* Track */}
              <div style={{ position: 'absolute', top: 11, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
              {/* Sent marker */}
              <div style={{ position: 'absolute', top: 4, left: 0, width: 16, height: 16, borderRadius: '50%', background: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 700 }}>S</div>
              {/* Echo received marker */}
              <div style={{ position: 'absolute', top: 4, right: 0, width: 16, height: 16, borderRadius: '50%', background: '#fb923c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 700 }}>E</div>
              {/* Labels */}
              <div style={{ position: 'absolute', top: 0, left: 20, fontSize: 9, color: '#818cf8' }}>Clap sent</div>
              <div style={{ position: 'absolute', top: 0, right: 20, fontSize: 9, color: '#fb923c', textAlign: 'right' }}>Echo: {echoTime.toFixed(2)}s</div>
            </div>
          </div>

          {/* Echo log */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              Echo Log (last 3)
            </div>
            {echoLog.length === 0 && (
              <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>No echoes yet — send a clap!</div>
            )}
            {echoLog.map((entry, i) => (
              <div key={entry.id} style={{
                display: 'flex', justifyContent: 'space-between', marginBottom: 6,
                opacity: 1 - i * 0.25,
              }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{entry.distance} m away</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>heard at {entry.echoTime.toFixed(2)}s</span>
              </div>
            ))}
          </div>

          {/* Min distance indicator */}
          <div style={{
            borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700,
            background: tooClose ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)',
            border: `1px solid ${tooClose ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
            color: tooClose ? '#f87171' : '#34d399',
            textAlign: 'center',
          }}>
            {tooClose
              ? '✗ Too close — echo merges with original sound'
              : '✓ Echo possible (distance ≥ 17.2 m)'}
          </div>
        </div>

        {/* Controls panel */}
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Distance slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Distance to Wall</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>{distance} m</span>
            </div>
            <input type="range" min={5} max={200} step={5} value={distance}
              onChange={e => setDistance(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }} />
          </div>

          {/* Clap button */}
          <button
            onClick={sendClap}
            disabled={pulses.length >= 3}
            style={{
              padding: '12px 16px', borderRadius: 8, cursor: pulses.length >= 3 ? 'not-allowed' : 'pointer',
              fontWeight: 800, fontSize: 16, border: 'none',
              background: pulses.length >= 3 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg,#f87171,#fb923c)',
              color: pulses.length >= 3 ? '#64748b' : '#fff', transition: 'all 0.15s',
              letterSpacing: '0.04em',
            }}
          >
            👏 Clap!
          </button>

          {/* Gol Gumbaz toggle */}
          <button
            onClick={() => setShowGolGumbaz(g => !g)}
            style={{
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700,
              fontSize: 13, border: `1px solid ${showGolGumbaz ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`,
              background: showGolGumbaz ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)',
              color: showGolGumbaz ? '#fbbf24' : '#94a3b8', transition: 'all 0.2s',
            }}
          >
            {showGolGumbaz ? '🕌 Hide Gol Gumbaz' : '🕌 Show Gol Gumbaz'}
          </button>

          {/* Gol Gumbaz card */}
          {showGolGumbaz && (
            <div style={{
              background: 'rgba(251,191,36,0.06)', borderRadius: 10, padding: 14,
              border: '1px solid rgba(251,191,36,0.2)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', marginBottom: 8 }}>🕌 Gol Gumbaz, Bijapur</div>
              <div style={{ fontSize: 11, color: '#d4a72c', lineHeight: 1.6 }}>
                One of the world&apos;s largest unsupported domes.<br />
                Reverberation time: ~12 seconds.<br />
                Even a whisper echoes 7+ times!<br />
                Sound reflects off 8 massive walls.
              </div>
            </div>
          )}

          {/* Live display */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Live Values</div>
            {[
              { label: 'Distance', value: `${distance} m` },
              { label: 'Echo time = 2d/v', value: `${echoTime.toFixed(2)} s` },
              { label: 'Speed of sound', value: '343 m/s' },
              { label: 'Min echo distance', value: '17.2 m' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Echo vs Reverberation */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Echo vs Reverberation</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fb923c', marginBottom: 3 }}>Echo</div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                Single distinct reflected sound. Requires distance ≥ 17.2 m (so reflected sound reaches after 0.1 s).
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', marginBottom: 3 }}>Reverberation</div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                Multiple rapid reflections. Sound seems prolonged. Common in concert halls, big rooms, caves.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
