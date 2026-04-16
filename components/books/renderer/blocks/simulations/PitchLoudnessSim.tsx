'use client';

// Pitch & Loudness Sim — Chapter 12: Pitch and Loudness
// Two waveforms (frequency/pitch + amplitude/loudness) + hearing range comparison.

import { useState, useEffect, useRef } from 'react';

const SVG_W = 500;
const TOP_WAVE_H = 110;
const BOT_WAVE_H = 110;
const SVG_H = TOP_WAVE_H + BOT_WAVE_H + 10;

const NOTES: Array<{ name: string; freq: number }> = [
  { name: 'C (Low)', freq: 261 },
  { name: 'A (440)', freq: 440 },
  { name: 'C (High)', freq: 523 },
  { name: 'E', freq: 659 },
];

const PRESETS: Array<{ label: string; freq: number }> = [
  { label: 'Bass', freq: 80 },
  { label: 'Voice', freq: 300 },
  { label: 'Whistle', freq: 2000 },
  { label: 'High', freq: 8000 },
];

function freqToColor(freq: number): string {
  // 20Hz → warm red, 20000Hz → violet/indigo
  const t = Math.min(1, Math.log10(freq / 20) / Math.log10(20000 / 20));
  const r = Math.round(248 - (248 - 129) * t);
  const g = Math.round(113 - (113 - 140) * t);
  const b = Math.round(113 + (248 - 113) * t);
  return `rgb(${r},${g},${b})`;
}

function pitchLabel(freq: number): string {
  if (freq < 300) return 'Low';
  if (freq < 2000) return 'Medium';
  if (freq < 8000) return 'High';
  return 'Very High';
}

function loudnessLabel(amp: number): string {
  if (amp <= 2) return 'Whisper';
  if (amp <= 5) return 'Normal';
  if (amp <= 8) return 'Loud';
  return 'Very Loud';
}

function nearNote(freq: number): string {
  for (const n of NOTES) {
    if (Math.abs(freq - n.freq) < freq * 0.05) return n.name;
  }
  return '';
}

// Build top waveform path (frequency): visually compress so differences are visible
function buildFreqPath(freq: number, animTime: number): string {
  const cy = TOP_WAVE_H / 2;
  const ampPx = 36;
  // Visual cycles: map so 20Hz=1 cycle, 20kHz=12 cycles across SVG_W
  const visualCycles = 1 + 11 * Math.min(1, Math.log10(freq / 20) / Math.log10(20000 / 20));
  const points: string[] = [];
  for (let x = 0; x <= SVG_W; x += 2) {
    const y = cy + ampPx * Math.sin(2 * Math.PI * visualCycles * (x / SVG_W) - animTime * 2);
    points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`);
  }
  return points.join(' ');
}

// Build bottom waveform path (amplitude)
function buildAmpPath(amplitude: number, animTime: number): string {
  const cy = BOT_WAVE_H / 2;
  const ampPx = (amplitude / 10) * 44;
  const points: string[] = [];
  for (let x = 0; x <= SVG_W; x += 2) {
    const y = cy + ampPx * Math.sin(2 * Math.PI * 3 * (x / SVG_W) - animTime * 2);
    points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`);
  }
  return points.join(' ');
}

export default function PitchLoudnessSim() {
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(5);
  const [animTime, setAnimTime] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
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
  }, []);

  const waveColor = freqToColor(frequency);
  const topPath = buildFreqPath(frequency, animTime);
  const botPath = buildAmpPath(amplitude, animTime);
  const noteLabel = nearNote(frequency);

  // Hearing range bar — 20 to 20000Hz on log scale
  const HB_W = SVG_W - 40;
  const freqToX = (f: number) => 20 + (Math.log10(f / 20) / Math.log10(20000 / 20)) * HB_W;
  const currentX = freqToX(Math.min(20000, Math.max(20, frequency)));

  const HB_H = 50;
  // Animal ranges
  const animals: Array<{ name: string; minF: number; maxF: number; color: string; y: number }> = [
    { name: 'Human', minF: 20, maxF: 20000, color: '#818cf8', y: 8 },
    { name: 'Dog', minF: 40, maxF: 40000, color: '#fbbf24', y: 26 },
    { name: 'Bat', minF: 2000, maxF: 150000, color: '#94a3b8', y: 36 },
  ];

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fb923c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Pitch &amp; Loudness
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          How Frequency → Pitch and Amplitude → Loudness
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* Left panel: waveforms + hearing range */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          {/* Two waveforms */}
          <div style={{ background: '#050a10', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 14 }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Top wave background */}
              <rect x={0} y={0} width={SVG_W} height={TOP_WAVE_H} fill="rgba(129,140,248,0.03)" />
              {/* Baseline top */}
              <line x1={0} y1={TOP_WAVE_H / 2} x2={SVG_W} y2={TOP_WAVE_H / 2} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="5 4" />
              {/* Top wave */}
              <path d={topPath} fill="none" stroke={waveColor} strokeWidth={2.5} />
              {/* Top label */}
              <rect x={0} y={0} width={SVG_W} height={18} fill="rgba(0,0,0,0.4)" />
              <text x={8} y={13} fill={waveColor} fontSize={11} fontWeight={700}>
                Frequency = {frequency} Hz → PITCH: {pitchLabel(frequency)}{noteLabel ? ` (${noteLabel})` : ''}
              </text>

              {/* Divider */}
              <line x1={0} y1={TOP_WAVE_H + 5} x2={SVG_W} y2={TOP_WAVE_H + 5} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

              {/* Bottom wave background */}
              <rect x={0} y={TOP_WAVE_H + 10} width={SVG_W} height={BOT_WAVE_H} fill="rgba(52,211,153,0.03)" />
              {/* Baseline bottom */}
              <line x1={0} y1={TOP_WAVE_H + 10 + BOT_WAVE_H / 2} x2={SVG_W} y2={TOP_WAVE_H + 10 + BOT_WAVE_H / 2} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="5 4" />
              {/* Bottom wave (shift y by offset) */}
              <g transform={`translate(0, ${TOP_WAVE_H + 10})`}>
                <path d={botPath} fill="none" stroke="#34d399" strokeWidth={2.5} />
              </g>
              {/* Bottom label */}
              <rect x={0} y={TOP_WAVE_H + 10} width={SVG_W} height={18} fill="rgba(0,0,0,0.4)" />
              <text x={8} y={TOP_WAVE_H + 23} fill="#34d399" fontSize={11} fontWeight={700}>
                Amplitude = {amplitude} → LOUDNESS: {loudnessLabel(amplitude)}
              </text>
            </svg>
          </div>

          {/* Animal hearing range */}
          <div style={{ background: '#050a10', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              Hearing Range Comparison (Log Scale)
            </div>
            <svg viewBox={`0 0 ${SVG_W} ${HB_H + 24}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Axis */}
              <line x1={20} y1={HB_H + 4} x2={SVG_W - 20} y2={HB_H + 4} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
              {[20, 200, 2000, 20000].map(f => {
                const x = freqToX(f);
                return (
                  <g key={f}>
                    <line x1={x} y1={HB_H} x2={x} y2={HB_H + 8} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                    <text x={x} y={HB_H + 18} fill="#64748b" fontSize={9} textAnchor="middle">
                      {f >= 1000 ? `${f / 1000}k` : f}
                    </text>
                  </g>
                );
              })}

              {/* Animal bars */}
              {animals.map(a => {
                const x1 = freqToX(Math.max(20, a.minF));
                const x2 = Math.min(SVG_W - 20, freqToX(Math.min(20000, a.maxF)));
                return (
                  <g key={a.name}>
                    <rect x={x1} y={a.y} width={Math.max(4, x2 - x1)} height={10} rx={3} fill={a.color} opacity={0.7} />
                    <text x={x1 - 2} y={a.y + 9} fill={a.color} fontSize={9} textAnchor="end" fontWeight={600}>{a.name}</text>
                  </g>
                );
              })}

              {/* Current frequency marker */}
              {frequency >= 20 && frequency <= 20000 && (
                <g>
                  <line x1={currentX} y1={0} x2={currentX} y2={HB_H} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3 3" />
                  <circle cx={currentX} cy={HB_H - 2} r={4} fill="#fbbf24" />
                </g>
              )}
            </svg>
            {/* Infra/Ultrasound labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <div style={{ fontSize: 10, color: '#f87171' }}>← Infrasound (&lt;20 Hz)</div>
              <div style={{ fontSize: 10, color: '#818cf8' }}>Ultrasound (&gt;20 kHz) →</div>
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Frequency slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Frequency</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: waveColor }}>{frequency} Hz</span>
            </div>
            <input
              type="range" min={20} max={20000} step={10} value={frequency}
              onChange={e => setFrequency(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer' }}
            />
            {noteLabel && (
              <div style={{ fontSize: 10, color: '#fbbf24', marginTop: 3 }}>♪ Near musical note: {noteLabel}</div>
            )}
          </div>

          {/* Amplitude slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amplitude</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>{amplitude}</span>
            </div>
            <input
              type="range" min={1} max={10} step={1} value={amplitude}
              onChange={e => setAmplitude(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
            />
          </div>

          {/* Presets */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Quick Presets</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setFrequency(p.freq)}
                  style={{
                    padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                    fontSize: 11, fontWeight: 700,
                    border: `1px solid ${frequency === p.freq ? '#818cf8' : 'rgba(255,255,255,0.1)'}`,
                    background: frequency === p.freq ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.04)',
                    color: frequency === p.freq ? '#c7d2fe' : '#94a3b8',
                    transition: 'all 0.15s',
                  }}
                >
                  {p.label} ({p.freq >= 1000 ? `${p.freq / 1000}k` : p.freq} Hz)
                </button>
              ))}
            </div>
          </div>

          {/* Perception display */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Perception</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Pitch</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: waveColor }}>{pitchLabel(frequency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Loudness</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>{loudnessLabel(amplitude)}</span>
            </div>
          </div>

          {/* Key concepts */}
          <div style={{ background: '#0f1623', borderRadius: 10, padding: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Key Concepts</div>
            {[
              'Frequency → Pitch (high freq = high pitch)',
              'Amplitude → Loudness (large amplitude = loud)',
              '20 Hz to 20,000 Hz: human audible range',
              'Infrasound: < 20 Hz',
              'Ultrasound: > 20,000 Hz',
            ].map((tip, i) => (
              <div key={i} style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5, lineHeight: 1.4 }}>• {tip}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
