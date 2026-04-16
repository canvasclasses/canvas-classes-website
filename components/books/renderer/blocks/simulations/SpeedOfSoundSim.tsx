'use client';

// Speed of Sound Sim — Chapter 12: Speed of Sound in Different Media
// Shows bar chart across media + echo distance calculator.

import { useState, useEffect, useRef } from 'react';

type Medium = 'air' | 'water' | 'steel';

interface MediaData {
  label: string;
  baseSpeed: number;
  color: string;
  emoji: string;
  tempDependent: boolean;
}

const MEDIA: Record<Medium, MediaData> = {
  air:   { label: 'Air',   baseSpeed: 331, color: '#60a5fa', emoji: '💨', tempDependent: true },
  water: { label: 'Water', baseSpeed: 1480, color: '#34d399', emoji: '💧', tempDependent: false },
  steel: { label: 'Steel', baseSpeed: 5100, color: '#94a3b8', emoji: '⚙️', tempDependent: false },
};

const MEDIUM_KEYS: Medium[] = ['air', 'water', 'steel'];
const MIN_ECHO_DIST = 17.2; // meters

function getAirSpeed(tempC: number) { return 331 + 0.6 * tempC; }

interface EchoState {
  active: boolean;
  startTime: number | null;
  phase: 'outgoing' | 'returning' | 'done';
  echoDuration: number; // seconds = 2d/v
}

export default function SpeedOfSoundSim() {
  const [tempC, setTempC] = useState(20);
  const [distanceM, setDistanceM] = useState(50);
  const [echoState, setEchoState] = useState<EchoState>({ active: false, startTime: null, phase: 'done', echoDuration: 0 });
  const [echoFlash, setEchoFlash] = useState(false);
  const [animProgress, setAnimProgress] = useState(0); // 0 to 1, outgoing; 1 to 2, returning

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const echoDurRef = useRef(0);

  const airSpeed = getAirSpeed(tempC);
  const echoTime = (2 * distanceM) / airSpeed;
  const tooClose = distanceM < MIN_ECHO_DIST;

  // Animation loop for echo
  useEffect(() => {
    if (!echoState.active) return;

    echoDurRef.current = echoState.echoDuration;
    startTsRef.current = null;

    const loop = (ts: number) => {
      if (startTsRef.current === null) startTsRef.current = ts;
      const elapsed = (ts - startTsRef.current) / 1000;
      const half = echoDurRef.current / 2;
      const total = echoDurRef.current;

      if (elapsed < half) {
        setAnimProgress(elapsed / half); // 0→1 outgoing
      } else if (elapsed < total) {
        setAnimProgress(1 + (elapsed - half) / half); // 1→2 returning
      } else {
        setAnimProgress(2);
        setEchoFlash(true);
        setEchoState(s => ({ ...s, active: false, phase: 'done' }));
        setTimeout(() => setEchoFlash(false), 800);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [echoState.active, echoState.echoDuration]);

  function sendEcho() {
    if (echoState.active) return;
    setAnimProgress(0);
    setEchoFlash(false);
    setEchoState({
      active: true,
      startTime: null,
      phase: 'outgoing',
      echoDuration: echoTime,
    });
  }

  // Bar chart
  const maxSpeed = 5100;
  const SVG_W = 460;
  const SVG_H = 140;
  const barH = 28;
  const barGap = 16;
  const labelW = 60;
  const maxBarW = SVG_W - labelW - 70;

  // Echo visualizer
  const VIS_W = 460;
  const VIS_H = 90;
  const personX = 40;
  const wallX = VIS_W - 30;
  const pulseY = VIS_H / 2;

  // Current pulse X
  let pulseX = personX;
  if (animProgress <= 1) {
    pulseX = personX + (wallX - personX) * animProgress;
  } else {
    pulseX = wallX - (wallX - personX) * (animProgress - 1);
  }

  const isOutgoing = animProgress > 0 && animProgress <= 1;
  const isReturning = animProgress > 1 && animProgress < 2;
  const pulseColor = isReturning ? '#fb923c' : '#818cf8';

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Speed of Sound
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          Propagation in Different Media &amp; Echo Calculator
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* Left panel: bar chart + echo visualizer */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>

          {/* Speed comparison bar chart */}
          <div style={{ background: '#050a10', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
              Speed of Sound in Different Media
            </div>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {MEDIUM_KEYS.map((key, i) => {
                const data = MEDIA[key];
                const speed = key === 'air' ? airSpeed : data.baseSpeed;
                const barW = (speed / maxSpeed) * maxBarW;
                const y = i * (barH + barGap) + 8;
                return (
                  <g key={key}>
                    {/* Label */}
                    <text x={0} y={y + barH / 2 + 4} fill="#94a3b8" fontSize={12} fontWeight={600}>
                      {data.emoji} {data.label}
                    </text>
                    {/* Bar background */}
                    <rect x={labelW} y={y} width={maxBarW} height={barH} rx={5} fill="rgba(255,255,255,0.04)" />
                    {/* Bar fill */}
                    <rect x={labelW} y={y} width={barW} height={barH} rx={5} fill={data.color} opacity={0.85} />
                    {/* Speed text */}
                    <text x={labelW + barW + 6} y={y + barH / 2 + 4} fill={data.color} fontSize={11} fontWeight={700}>
                      {speed.toFixed(0)} m/s
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Echo visualizer */}
          <div style={{ background: '#050a10', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              Echo Visualizer
            </div>
            <svg viewBox={`0 0 ${VIS_W} ${VIS_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Ground line */}
              <line x1={personX} y1={pulseY + 20} x2={wallX} y2={pulseY + 20} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

              {/* Distance label */}
              <line x1={personX} y1={pulseY + 14} x2={wallX} y2={pulseY + 14} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <text x={(personX + wallX) / 2} y={pulseY + 11} fill="#64748b" fontSize={10} textAnchor="middle">{distanceM} m</text>

              {/* Person (🔊) */}
              <text x={personX} y={pulseY + 6} fontSize={20} textAnchor="middle">🔊</text>

              {/* Wall */}
              <rect x={wallX - 6} y={10} width={12} height={VIS_H - 30} rx={2} fill="#94a3b8" />

              {/* Pulse */}
              {(isOutgoing || isReturning) && (
                <g>
                  <circle cx={pulseX} cy={pulseY} r={8} fill="none" stroke={pulseColor} strokeWidth={2} opacity={0.8} />
                  <circle cx={pulseX} cy={pulseY} r={14} fill="none" stroke={pulseColor} strokeWidth={1} opacity={0.4} />
                </g>
              )}

              {/* ECHO flash */}
              {echoFlash && (
                <text x={personX} y={pulseY - 20} fill="#fbbf24" fontSize={13} fontWeight={700} textAnchor="middle">ECHO!</text>
              )}

              {/* Outgoing/returning label */}
              {isOutgoing && (
                <text x={pulseX} y={pulseY - 20} fill="#818cf8" fontSize={10} textAnchor="middle">→ outgoing</text>
              )}
              {isReturning && (
                <text x={pulseX} y={pulseY - 20} fill="#fb923c" fontSize={10} textAnchor="middle">← reflected</text>
              )}
            </svg>

            {/* Echo result */}
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: tooClose ? '#f87171' : '#34d399', textAlign: 'center' }}>
              {tooClose
                ? '⚠ Too close! Echo merges with original sound.'
                : `Echo heard after: ${echoTime.toFixed(2)} seconds`}
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Temperature slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Temperature</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>{tempC}°C</span>
            </div>
            <input type="range" min={0} max={40} step={1} value={tempC}
              onChange={e => setTempC(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#60a5fa', cursor: 'pointer' }} />
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>Air speed = 331 + 0.6×T m/s</div>
          </div>

          {/* Distance slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Distance to Wall</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>{distanceM} m</span>
            </div>
            <input type="range" min={10} max={200} step={5} value={distanceM}
              onChange={e => setDistanceM(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }} />
          </div>

          {/* Send echo button */}
          <button
            onClick={sendEcho}
            disabled={echoState.active}
            style={{
              padding: '10px 16px', borderRadius: 8, cursor: echoState.active ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: 14, border: 'none',
              background: echoState.active ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg,#818cf8,#60a5fa)',
              color: echoState.active ? '#64748b' : '#fff', transition: 'all 0.2s',
            }}
          >
            {echoState.active ? 'Pulse in flight…' : '📡 Send Echo Pulse'}
          </button>

          {/* Key values */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Key Values</div>
            {[
              { label: 'v_air', value: `${airSpeed.toFixed(0)} m/s` },
              { label: 'Echo time = 2d/v', value: `${echoTime.toFixed(2)} s` },
              { label: 'Min dist for echo', value: '17.2 m' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: tooClose && label === 'Echo time = 2d/v' ? '#f87171' : '#e2e8f0' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Facts */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Did You Know?</div>
            {[
              'Sound is ~4× faster in water than air',
              'Sound is ~15× faster in steel than air',
              'Hear trains through rails before air!',
              'Gol Gumbaz: reverberation ~12 seconds!',
            ].map((fact, i) => (
              <div key={i} style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5, lineHeight: 1.4 }}>• {fact}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
