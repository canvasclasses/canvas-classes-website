'use client';

// Wave Properties Sim — Chapter 12: Characteristics of Sound Waves
// Interactive sine wave with frequency, amplitude, live annotations.

import { useState, useEffect, useRef } from 'react';

const SVG_W = 500;
const SVG_H = 180;
const CY = SVG_H / 2;

function getWaveColor(frequency: number): string {
  // low freq (1) → orange (#fb923c), high freq (10) → indigo (#818cf8)
  const t = (frequency - 1) / 9;
  const r = Math.round(251 + (129 - 251) * t);
  const g = Math.round(146 + (140 - 146) * t);
  const b = Math.round(60 + (248 - 60) * t);
  return `rgb(${r},${g},${b})`;
}

function buildWavePath(frequency: number, amplitude: number, animTime: number): string {
  const points: string[] = [];
  const ampPx = amplitude * 28;
  for (let x = 0; x <= SVG_W; x += 2) {
    const y = CY + ampPx * Math.sin(2 * Math.PI * frequency * (x / SVG_W) - 2 * Math.PI * animTime * frequency / 4);
    points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`);
  }
  return points.join(' ');
}

export default function WavePropertiesSim() {
  const [frequency, setFrequency] = useState(3);
  const [amplitude, setAmplitude] = useState(3);
  const [animTime, setAnimTime] = useState(0);
  const [frozen, setFrozen] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (frozen) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }
    const loop = (ts: number) => {
      if (lastRef.current === null) lastRef.current = ts;
      const delta = (ts - lastRef.current) / 1000;
      lastRef.current = ts;
      setAnimTime(t => t + delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [frozen]);

  const speedOfSound = 343;
  const wavelength = speedOfSound / frequency;
  const period = 1 / frequency;
  const waveColor = getWaveColor(frequency);
  const ampPx = amplitude * 28;

  // Compute annotation positions for one wavelength
  // One cycle spans SVG_W / frequency pixels... but wave has `frequency` cycles over SVG_W
  // So one wavelength in px = SVG_W / frequency
  const cycleWidthPx = SVG_W / frequency;

  // Find where the first crest is
  // y = CY + ampPx * sin(2π*freq*(x/SVG_W) - phase)
  // Crest when 2π*freq*(x/SVG_W) - phase = π/2 + 2πk
  const phase = 2 * Math.PI * animTime * frequency / 4;
  // x = (π/2 + phase) * SVG_W / (2π*frequency)
  const crestX = ((Math.PI / 2 + phase) * SVG_W) / (2 * Math.PI * frequency);
  // Find visible crest
  const adjustedCrestX = ((crestX % SVG_W) + SVG_W) % SVG_W;
  const crestY = CY - ampPx;

  // Trough
  const troughX = ((adjustedCrestX + cycleWidthPx / 2) % SVG_W + SVG_W) % SVG_W;
  const troughY = CY + ampPx;

  // Node (zero crossing after crest)
  const nodeX = ((adjustedCrestX + cycleWidthPx / 4) % SVG_W + SVG_W) % SVG_W;

  // Lambda arrow: from a crest to the next crest
  const lambdaStartX = adjustedCrestX;
  const lambdaEndX = adjustedCrestX + cycleWidthPx;
  const lambdaArrowY = CY + ampPx + 28;

  const wavePath = buildWavePath(frequency, amplitude, animTime);

  const gridLines = [];
  for (let x = 0; x <= SVG_W; x += 50) {
    gridLines.push(<line key={`gv${x}`} x1={x} y1={0} x2={x} y2={SVG_H} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />);
  }
  for (let y = 30; y < SVG_H; y += 30) {
    gridLines.push(<line key={`gh${y}`} x1={0} y1={y} x2={SVG_W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />);
  }

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Wave Properties
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          Frequency, Wavelength &amp; Amplitude
        </div>
      </div>

      {/* Body: responsive flex */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* Visualization */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          {/* Wave SVG */}
          <div style={{ background: '#050a10', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              aria-label="Animated sine wave with annotations"
            >
              {/* Grid */}
              {gridLines}

              {/* Baseline (dashed) */}
              <line x1={0} y1={CY} x2={SVG_W} y2={CY} stroke="rgba(255,255,255,0.18)" strokeWidth={1} strokeDasharray="6 4" />

              {/* Wave */}
              <path d={wavePath} fill="none" stroke={waveColor} strokeWidth={2.5} />

              {/* Amplitude arrow */}
              {ampPx > 8 && (
                <g>
                  <line x1={20} y1={CY} x2={20} y2={crestY} stroke="#fbbf24" strokeWidth={1.5} markerEnd="url(#arrowAmb)" markerStart="url(#arrowAmbStart)" />
                  <text x={26} y={CY - ampPx / 2} fill="#fbbf24" fontSize={11} fontWeight={700}>A</text>
                </g>
              )}

              {/* Wavelength arrow (only if fits in view) */}
              {lambdaEndX <= SVG_W && lambdaArrowY < SVG_H && (
                <g>
                  <line
                    x1={lambdaStartX} y1={lambdaArrowY}
                    x2={lambdaEndX} y2={lambdaArrowY}
                    stroke="#34d399" strokeWidth={1.5}
                    markerEnd="url(#arrowEm)" markerStart="url(#arrowEmStart)"
                  />
                  <text
                    x={(lambdaStartX + lambdaEndX) / 2} y={lambdaArrowY - 5}
                    fill="#34d399" fontSize={10} fontWeight={700} textAnchor="middle"
                  >
                    λ = {wavelength.toFixed(1)} m
                  </text>
                </g>
              )}

              {/* Crest dot */}
              {adjustedCrestX >= 5 && adjustedCrestX <= SVG_W - 5 && (
                <g>
                  <circle cx={adjustedCrestX} cy={crestY} r={4} fill={waveColor} />
                  <text x={adjustedCrestX + 6} y={crestY - 6} fill="#f1f5f9" fontSize={10} fontWeight={600}>Crest</text>
                </g>
              )}

              {/* Trough dot */}
              {troughX >= 5 && troughX <= SVG_W - 5 && (
                <g>
                  <circle cx={troughX} cy={troughY} r={4} fill={waveColor} />
                  <text x={troughX + 6} y={troughY + 14} fill="#94a3b8" fontSize={10} fontWeight={600}>Trough</text>
                </g>
              )}

              {/* Node dot */}
              {nodeX >= 5 && nodeX <= SVG_W - 5 && (
                <g>
                  <circle cx={nodeX} cy={CY} r={4} fill="#64748b" />
                  <text x={nodeX + 6} y={CY - 6} fill="#64748b" fontSize={10} fontWeight={600}>Node</text>
                </g>
              )}

              {/* Arrow marker defs */}
              <defs>
                <marker id="arrowAmb" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
                </marker>
                <marker id="arrowAmbStart" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
                </marker>
                <marker id="arrowEm" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
                </marker>
                <marker id="arrowEmStart" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* v = fλ formula */}
          <div style={{
            marginTop: 12, padding: '10px 16px',
            background: 'rgba(129,140,248,0.1)', borderRadius: 8,
            border: '1px solid rgba(129,140,248,0.25)',
            textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#c7d2fe',
            letterSpacing: '0.04em',
          }}>
            v = f × λ &nbsp;=&nbsp; {frequency} × {wavelength.toFixed(1)} &nbsp;≈&nbsp; 343 m/s
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Frequency slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Frequency</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{frequency} Hz</span>
            </div>
            <input
              type="range" min={1} max={10} step={1} value={frequency}
              onChange={e => setFrequency(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer' }}
            />
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>Higher freq → shorter λ, more waves/sec</div>
          </div>

          {/* Amplitude slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amplitude</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>{amplitude}</span>
            </div>
            <input
              type="range" min={1} max={5} step={1} value={amplitude}
              onChange={e => setAmplitude(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
            />
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>Bigger amplitude → louder sound</div>
          </div>

          {/* Freeze toggle */}
          <button
            onClick={() => setFrozen(f => !f)}
            style={{
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700,
              fontSize: 13, border: '1px solid rgba(255,255,255,0.12)',
              background: frozen ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.05)',
              color: frozen ? '#c7d2fe' : '#94a3b8', transition: 'all 0.2s',
            }}
          >
            {frozen ? '▶ Resume Wave' : '⏸ Freeze Wave'}
          </button>

          {/* Live values */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Live Values</div>
            {[
              { label: 'f', value: `${frequency} Hz` },
              { label: 'λ = 343/f', value: `${wavelength.toFixed(1)} m` },
              { label: 'v', value: '343 m/s' },
              { label: 'T = 1/f', value: `${period.toFixed(2)} s` },
              { label: 'A', value: `${amplitude} units` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Key concepts */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Key Concepts</div>
            {[
              'Frequency ↑ → wavelength ↓ (constant speed)',
              'Amplitude affects loudness, NOT speed',
              'Sound speed in air ≈ 343 m/s at 20°C',
            ].map((tip, i) => (
              <div key={i} style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5, lineHeight: 1.4 }}>
                • {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
