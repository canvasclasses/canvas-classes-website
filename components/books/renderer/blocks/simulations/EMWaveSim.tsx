'use client';

// Electromagnetic Wave Explorer
// Teaches: wavelength, frequency, c = νλ, the EM spectrum, and real-world uses
// Design: animated wave canvas + log-scale frequency slider + region info card

import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './_shared';

// ── EM Spectrum Regions ────────────────────────────────────────────────────
const REGIONS = [
  {
    name: 'Radio',
    short: 'Radio',
    log10Low: 4, log10High: 9,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.10)',
    waveRange: '> 30 cm',
    energy: 'Lowest energy',
    uses: ['AM / FM broadcasting', 'WiFi & mobile networks', 'Television signals', 'Radio astronomy'],
    fact: 'Right now, thousands of radio waves are silently passing through your body from dozens of broadcast towers — completely harmlessly.',
  },
  {
    name: 'Microwave',
    short: 'μWave',
    log10Low: 9, log10High: 12,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.10)',
    waveRange: '1 mm – 30 cm',
    energy: 'Low',
    uses: ['Microwave ovens (2.45 GHz)', 'Radar & weather forecasting', 'Satellite TV', 'Speed cameras'],
    fact: 'Your microwave oven uses 2.45 GHz radiation — the same frequency band as WiFi — to make water molecules vibrate rapidly and heat food.',
  },
  {
    name: 'Infrared (IR)',
    short: 'IR',
    log10Low: 12, log10High: 14.4,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.10)',
    waveRange: '700 nm – 1 mm',
    energy: 'Moderate',
    uses: ['TV & AC remotes', 'Night-vision cameras', 'Thermal imaging', 'Fibre optic cables'],
    fact: 'Point your TV remote at your phone\'s front camera and press a button. You\'ll see invisible IR light appear as a purple glow — the camera detects what your eye can\'t.',
  },
  {
    name: 'Visible',
    short: 'Visible',
    log10Low: 14.4, log10High: 15.0,
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.10)',
    waveRange: '400 – 700 nm',
    energy: 'Moderate',
    uses: ['Human vision', 'Photography', 'Laser surgery', 'Optical fibre internet'],
    fact: 'Visible light is a razor-thin slice of the EM spectrum — less than one octave wide out of more than 80. Our eyes evolved specifically to see the peak of sunlight\'s emission.',
  },
  {
    name: 'Ultraviolet (UV)',
    short: 'UV',
    log10Low: 15.0, log10High: 17,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.10)',
    waveRange: '10 – 400 nm',
    energy: 'High',
    uses: ['Sunscreen targets UV-B & UV-C', 'Sterilising water & surfaces', 'Fluorescent lights', 'Detecting forged currency'],
    fact: 'Scorpions glow bright blue under UV light. Their exoskeleton absorbs UV and re-emits visible blue — a process called fluorescence, used in washing powder "optical brighteners" too.',
  },
  {
    name: 'X-ray',
    short: 'X-ray',
    log10Low: 17, log10High: 20,
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.10)',
    waveRange: '0.01 – 10 nm',
    energy: 'Very high',
    uses: ['Medical bone imaging', 'Airport security scanners', 'DNA crystallography', 'Black hole astronomy'],
    fact: 'The 1953 discovery of DNA\'s double helix was cracked using X-ray crystallography — Rosalind Franklin\'s X-ray diffraction photograph of DNA fibre gave the critical clue.',
  },
  {
    name: 'Gamma (γ)',
    short: 'γ-ray',
    log10Low: 20, log10High: 26,
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.10)',
    waveRange: '< 0.01 nm',
    energy: 'Extreme',
    uses: ['Cancer radiotherapy', 'PET scans in hospitals', 'Sterilising surgical tools', 'Nuclear power monitoring'],
    fact: 'A gamma-ray burst from a dying massive star releases more energy in a few seconds than the Sun will emit across its entire 10-billion-year lifetime.',
  },
];

function getRegion(log10Freq: number) {
  return REGIONS.find(r => log10Freq >= r.log10Low && log10Freq < r.log10High) ?? REGIONS[REGIONS.length - 1];
}

// ── Formatting helpers ─────────────────────────────────────────────────────
function fmtFreq(hz: number): string {
  if (hz >= 1e21) return `${(hz / 1e21).toFixed(1)} ZHz`;
  if (hz >= 1e18) return `${(hz / 1e18).toFixed(1)} EHz`;
  if (hz >= 1e15) return `${(hz / 1e15).toFixed(2)} PHz`;
  if (hz >= 1e12) return `${(hz / 1e12).toFixed(1)} THz`;
  if (hz >= 1e9)  return `${(hz / 1e9).toFixed(2)} GHz`;
  if (hz >= 1e6)  return `${(hz / 1e6).toFixed(2)} MHz`;
  if (hz >= 1e3)  return `${(hz / 1e3).toFixed(1)} kHz`;
  return `${hz.toFixed(0)} Hz`;
}

function fmtLambda(m: number): string {
  if (m >= 1e3)   return `${(m / 1e3).toFixed(0)} km`;
  if (m >= 1)     return `${m.toFixed(2)} m`;
  if (m >= 1e-2)  return `${(m * 1e2).toFixed(2)} cm`;
  if (m >= 1e-3)  return `${(m * 1e3).toFixed(2)} mm`;
  if (m >= 1e-6)  return `${(m * 1e6).toFixed(1)} μm`;
  if (m >= 1e-9)  return `${(m * 1e9).toFixed(1)} nm`;
  if (m >= 1e-12) return `${(m * 1e12).toFixed(2)} pm`;
  return `${(m * 1e15).toFixed(1)} fm`;
}

function fmtEnergy(hz: number): string {
  const eV = (6.626e-34 * hz) / 1.602e-19;
  if (eV >= 1e9)  return `${(eV / 1e9).toExponential(1)} GeV`;
  if (eV >= 1e6)  return `${(eV / 1e6).toExponential(1)} MeV`;
  if (eV >= 1e3)  return `${(eV / 1e3).toFixed(1)} keV`;
  if (eV >= 1)    return `${eV.toFixed(2)} eV`;
  if (eV >= 1e-3) return `${(eV * 1e3).toFixed(2)} meV`;
  return `${eV.toExponential(2)} eV`;
}

const C = 3e8;
const SLIDER_MIN = 4;
const SLIDER_MAX = 26;

// ── Main component ─────────────────────────────────────────────────────────
export default function EMWaveSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const phaseRef     = useRef<number>(0);
  const freqRef      = useRef<number>(14.7);
  const colorRef     = useRef<string>('#22d3ee');

  const [log10Freq, setLog10Freq] = useState(14.7); // green light ~500 THz
  const freq   = Math.pow(10, log10Freq);
  const lambda = C / freq;
  const region = getRegion(log10Freq);

  // Keep refs in sync with state (read by animation loop without re-subscribing)
  freqRef.current  = log10Freq;
  colorRef.current = region.color;

  // ── Canvas size / DPR — kept in its own effect so resizes don't restart
  // the animation loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const W = canvas.parentElement?.offsetWidth ?? 600;
      const H = 150;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
    }
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  // ── Animation loop ──────────────────────────────────────────────────────
  // Paused automatically when the canvas is offscreen or the tab is in the
  // background. The old loop advanced phase by 0.05 per frame (= 3.0/sec at
  // 60 fps); we preserve that rate by scaling delta by 3.0.
  useAnimationFrame(
    (delta) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W  = canvas.width  / dpr;
      const H  = canvas.height / dpr;
      const CY = H / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, W, H);

      // Visual wavelength in pixels: log-scale from 200px (radio) to 8px (gamma)
      const t  = (freqRef.current - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN);
      const vL = Math.round(200 - t * 192); // 200 → 8 px

      // Advance phase — constant visual speed regardless of region
      phaseRef.current += delta * 3.0;
      const ph = phaseRef.current;
      const col = colorRef.current;

      // ── Center axis ──
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(W, CY); ctx.stroke();

      // ── Main E-field wave (coloured, glowing) ──
      const amp = 45;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const y = CY + amp * Math.sin((2 * Math.PI / vL) * x - ph);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.shadowColor = col;
      ctx.shadowBlur  = 10;
      ctx.strokeStyle = col;
      ctx.lineWidth   = 2.5;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── B-field wave (dashed, perpendicular represented as cosine) ──
      const ampB = 28;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const y = CY + ampB * Math.cos((2 * Math.PI / vL) * x - ph);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(148,163,184,0.28)';
      ctx.lineWidth   = 1.4;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── λ bracket between first two visible crests ──
      // Crests of the E field at: x = vL * (1/4 + ph/(2π) + n)
      const offset = (vL * (0.25 + ph / (2 * Math.PI))) % vL;
      // First crest that has space to the left for an arrow
      let c1 = offset < 8 ? offset + vL : offset;
      while (c1 + vL > W - 4) c1 -= vL;
      const c2 = c1 + vL;

      if (c1 > 4 && c2 < W - 4) {
        const bracketY = CY - amp - 14;
        ctx.strokeStyle = 'rgba(251,191,36,0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(c1, bracketY + 5); ctx.lineTo(c1, bracketY);
        ctx.lineTo(c2, bracketY); ctx.lineTo(c2, bracketY + 5);
        ctx.stroke();
        ctx.fillStyle = 'rgba(251,191,36,0.90)';
        ctx.font = 'italic bold 13px Georgia, "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('λ', (c1 + c2) / 2, bracketY - 1);
        ctx.textBaseline = 'alphabetic';
      }

      // ── Labels ──
      ctx.textAlign = 'left';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = col + 'bb';
      ctx.fillText('E field', 8, CY - amp - 4);
      ctx.fillStyle = 'rgba(148,163,184,0.45)';
      ctx.fillText('B field', 8, CY + ampB + 16);
    },
    { target: canvasRef }
  );

  return (
    <div style={{ background: '#050a14', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>
            Interactive Simulator
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>EM Wave Explorer</div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: region.bg, border: `1px solid ${region.color}50`, color: region.color, transition: 'all 0.3s' }}>
          {region.name}
        </div>
      </div>

      {/* ── Wave canvas ── */}
      <div className="px-5 mb-3">
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <canvas ref={canvasRef} className="block w-full" style={{ height: 150 }} />
        </div>
      </div>

      {/* ── Slider ── */}
      <div className="px-5 mb-3">
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={0.05}
          value={log10Freq}
          onChange={e => setLog10Freq(parseFloat(e.target.value))}
          className="w-full"
          style={{
            WebkitAppearance: 'none', appearance: 'none',
            height: 6, borderRadius: 4, outline: 'none',
            background: 'linear-gradient(to right, #6366f1 0%, #8b5cf6 18%, #f97316 38%, #22d3ee 52%, #a78bfa 60%, #94a3b8 75%, #f43f5e 100%)',
          }}
        />

        {/* Region label buttons */}
        <div className="flex justify-between mt-2">
          {REGIONS.map(r => {
            const active = log10Freq >= r.log10Low && log10Freq < r.log10High;
            return (
              <button key={r.short}
                onClick={() => setLog10Freq((r.log10Low + r.log10High) / 2)}
                style={{
                  fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  color: active ? r.color : 'rgba(255,255,255,0.20)',
                  background: 'none', border: 'none', padding: '3px 0',
                  transition: 'color 0.2s', lineHeight: 1,
                }}
              >{r.short}</button>
            );
          })}
        </div>
      </div>

      {/* ── Properties row ── */}
      <div className="grid grid-cols-3 gap-3 px-5 mb-3">
        {[
          { label: 'Wavelength',   sym: 'λ',  val: fmtLambda(lambda), color: '#fbbf24',    note: 'λ = c / ν' },
          { label: 'Frequency',    sym: 'ν',  val: fmtFreq(freq),     color: region.color, note: freq.toExponential(2) + ' Hz' },
          { label: 'Photon Energy',sym: 'E',  val: fmtEnergy(freq),   color: '#f87171',    note: 'E = hν' },
        ].map(p => (
          <div key={p.label} className="rounded-xl p-3 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.3s' }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: p.color, lineHeight: 1.1 }}>{p.val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.label}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', marginTop: 2, fontFamily: 'monospace' }}>{p.note}</div>
          </div>
        ))}
      </div>

      {/* ── Region info card ── */}
      <div className="mx-5 mb-3 rounded-xl p-4"
        style={{ background: region.bg, border: `1px solid ${region.color}30`, transition: 'all 0.3s' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: region.color, marginBottom: 8 }}>
          {region.name} waves — {region.waveRange} · {region.energy}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {region.uses.map(u => (
            <span key={u} style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 500,
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}>{u}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.65)', lineHeight: 1.6, margin: 0, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 8 }}>
          💡 {region.fact}
        </p>
      </div>

      {/* ── c = νλ reminder ── */}
      <div className="mx-5 mb-5 rounded-xl p-3 flex items-center gap-4"
        style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Georgia, serif', color: '#fbbf24', fontStyle: 'italic', flexShrink: 0 }}>
          c = νλ
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', lineHeight: 1.55 }}>
          The speed of light is always <strong style={{ color: 'rgba(255,255,255,0.75)' }}>3.0 × 10⁸ m s⁻¹</strong> in vacuum.
          Higher frequency → shorter wavelength. Higher frequency → higher photon energy.
        </span>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; cursor: pointer;
          box-shadow: 0 0 10px rgba(255,255,255,0.6);
          margin-top: -7px;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: none; cursor: pointer;
        }
        input[type='range']::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; }
        input[type='range']::-moz-range-track { height: 6px; border-radius: 3px; }
      `}</style>
    </div>
  );
}
