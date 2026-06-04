'use client';

// SoundWaveStudioSim.tsx
// Class 9 ICT — Chapter 4 (Creating Audio Video Communication).
// The concept behind Audacity: a sound is a wave. Amplitude = loudness,
// frequency = pitch. A "sampling" overlay shows how a microphone turns the
// smooth wave into numbers (digital audio) — and why more samples = truer sound.
// Wave facts (amplitude↔loudness, frequency↔pitch) are standard NCERT physics.

import { useState, useMemo } from 'react';

const ACCENT = '#818cf8';
const W = 720, H = 220, MID = H / 2;

export default function SoundWaveStudioSim() {
  const [amp, setAmp] = useState(70);     // loudness, 0–100
  const [freq, setFreq] = useState(3);    // pitch, cycles across view
  const [sampling, setSampling] = useState(false);
  const [rate, setRate] = useState(16);   // samples across the view

  const A = (amp / 100) * (MID - 14);

  const path = useMemo(() => {
    let d = '';
    for (let x = 0; x <= W; x += 3) {
      const y = MID - A * Math.sin((x / W) * freq * 2 * Math.PI);
      d += `${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  }, [A, freq]);

  const samples = useMemo(() => {
    if (!sampling) return [];
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= rate; i++) {
      const x = (i / rate) * W;
      const y = MID - A * Math.sin((x / W) * freq * 2 * Math.PI);
      pts.push({ x, y });
    }
    return pts;
  }, [sampling, rate, A, freq]);

  const stairPath = useMemo(() => {
    if (!sampling || samples.length === 0) return '';
    let d = `M 0 ${samples[0].y.toFixed(1)} `;
    samples.forEach((p, i) => { if (i > 0) d += `L ${p.x.toFixed(1)} ${samples[i - 1].y.toFixed(1)} L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `; });
    return d;
  }, [samples, sampling]);

  const loud = amp > 66 ? 'Loud' : amp > 33 ? 'Medium' : 'Soft';
  const pitch = freq > 5 ? 'High pitch' : freq > 2 ? 'Medium pitch' : 'Low pitch';

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-3xl font-black tracking-tight text-white">Sound Wave <span style={{ color: ACCENT }}>Studio</span></h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>How Sound Becomes Digital · Class 9 ICT</p>
      </div>

      <div className="rounded-3xl mb-4 p-3" style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          <line x1={0} y1={MID} x2={W} y2={MID} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          {sampling && <path d={stairPath} fill="none" stroke="#fbbf24" strokeWidth={2} opacity={0.7} />}
          <path d={path} fill="none" stroke={ACCENT} strokeWidth={3} />
          {samples.map((p, i) => (
            <line key={i} x1={p.x} y1={MID} x2={p.x} y2={p.y} stroke="#34d399" strokeWidth={1} opacity={0.4} />
          ))}
          {samples.map((p, i) => <circle key={`d${i}`} cx={p.x} cy={p.y} r={3.5} fill="#34d399" />)}
          {/* amplitude marker */}
          <line x1={18} y1={MID} x2={18} y2={MID - A} stroke="#f472b6" strokeWidth={2} />
          <text x={26} y={MID - A / 2} fontSize={11} fontWeight={700} fill="#f472b6">amplitude</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center"><span className="text-xs font-bold" style={{ color: '#94a3b8' }}>Amplitude → <span style={{ color: '#f472b6' }}>loudness</span></span><span className="text-xs font-black" style={{ color: '#f472b6' }}>{loud}</span></div>
          <input type="range" min={5} max={100} value={amp} onChange={e => setAmp(+e.target.value)} style={{ accentColor: '#f472b6' }} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center"><span className="text-xs font-bold" style={{ color: '#94a3b8' }}>Frequency → <span style={{ color: ACCENT }}>pitch</span></span><span className="text-xs font-black" style={{ color: ACCENT }}>{pitch}</span></div>
          <input type="range" min={1} max={8} value={freq} onChange={e => setFreq(+e.target.value)} style={{ accentColor: ACCENT }} />
        </div>
      </div>

      <div className="mt-4 rounded-xl p-3" style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button onClick={() => setSampling(v => !v)} className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: sampling ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${sampling ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`, color: sampling ? '#34d399' : '#94a3b8' }}>
            {sampling ? '✓ Showing digital sampling' : 'Show digital sampling'}
          </button>
          {sampling && (
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <span className="text-[11px] font-bold" style={{ color: '#64748b' }}>Samples</span>
              <input type="range" min={6} max={64} value={rate} onChange={e => setRate(+e.target.value)} className="flex-1" style={{ accentColor: '#34d399' }} />
              <span className="text-xs font-black tabular-nums w-8 text-right" style={{ color: '#34d399' }}>{rate}</span>
            </div>
          )}
        </div>
        {sampling && <p className="text-sm leading-snug mt-2" style={{ color: '#94a3b8' }}>A microphone measures the wave many times a second — each green dot is one <span style={{ color: '#34d399' }}>sample</span> (a number). The yellow steps are the digital copy. More samples = closer to the real sound.</p>}
      </div>

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Audio Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Editing audio in Audacity is just editing these numbers — delete a cough, raise the amplitude, and you&rsquo;ve reshaped the wave.&rdquo;</p>
      </div>
    </div>
  );
}
