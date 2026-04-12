'use client';

// Bulb Evolution — Blackbody radiation and why the world moved on from
// filament bulbs. Drag the temperature slider to see Planck's blackbody
// curve shift (Wien) and grow (Stefan-Boltzmann). The visible spectrum
// (380–780 nm) is highlighted, so students can see directly what fraction
// of emitted energy is useful light — and what is wasted as infrared heat.
//
// Below the canvas: the three bulb eras explained in terms of the graph.

import { useEffect, useRef, useState } from 'react';
import { useResolvedFont } from './_shared';

const GRAPH_W = 720;
const GRAPH_H = 400;
const BULB_W = 200;
const BULB_H = 320;

// Physical constants (SI)
const H = 6.626e-34;
const C = 3.0e8;
const KB = 1.381e-23;

// Visible range (nm) — photometric "useful light" band.
// Using 400–700 nm (rather than the broader 380–780 perceptual edges)
// matches the lighting-industry numbers we quote in the era cards
// (~5% for incandescent, ~37% for the sun).
const VIS_MIN = 400;
const VIS_MAX = 700;

// Plot wavelength domain (nm) — what we draw on the chart axis.
const LAM_MIN = 100;
const LAM_MAX = 3000;

// Integration domain for visibleFraction — wider than the plot so the
// denominator captures the IR tail at high T and the UV tail at low T.
// Truncating at LAM_MAX=3000 was inflating the visible-fraction reading
// at solar temperatures (we were missing ~25% of the spectrum's IR tail).
const INT_MIN = 50;
const INT_MAX = 30000;

// Planck's spectral radiance (per-wavelength form, SI)
function planck(lamNm: number, T: number): number {
  const lam = lamNm * 1e-9;
  const exponent = (H * C) / (lam * KB * T);
  // cap exponent to avoid Infinity for very cold T / short λ
  const ex = Math.exp(Math.min(exponent, 700));
  return ((2 * H * C * C) / Math.pow(lam, 5)) / (ex - 1);
}

// Wien's displacement law: λ_peak (nm) × T (K) = 2.898 × 10⁶ nm·K
function peakNm(T: number): number {
  return 2.898e6 / T;
}

// Numeric visible fraction: ∫visible B dλ / ∫total B dλ.
// Trapezoidal rule over a wide integration domain (INT_MIN..INT_MAX) so
// the denominator stays a faithful proxy for σT⁴ at every temperature
// in the slider range.
function visibleFraction(T: number): number {
  const N = 1500;
  const step = (INT_MAX - INT_MIN) / N;
  let total = 0;
  let vis = 0;
  for (let i = 0; i <= N; i++) {
    const lam = INT_MIN + i * step;
    const b = planck(lam, T);
    const w = i === 0 || i === N ? 0.5 : 1;
    total += b * w;
    if (lam >= VIS_MIN && lam <= VIS_MAX) vis += b * w;
  }
  return total > 0 ? vis / total : 0;
}

// Blackbody → RGB (Tanner Helland approximation, clamped)
function blackbodyRGB(T: number): [number, number, number] {
  T = Math.max(1000, Math.min(10000, T));
  const t = T / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  return [
    Math.max(0, Math.min(255, Math.round(r))),
    Math.max(0, Math.min(255, Math.round(g))),
    Math.max(0, Math.min(255, Math.round(b))),
  ];
}

const PRESETS = [
  { name: 'Candle', T: 1850 },
  { name: 'Incandescent', T: 2700 },
  { name: 'Halogen', T: 3200 },
  { name: 'Sun', T: 5800 },
];

export default function BulbEvolutionSim() {
  const [T, setT] = useState(2700);
  const graphRef = useRef<HTMLCanvasElement | null>(null);
  const bulbRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFont = useResolvedFont();

  const peak = peakNm(T);
  const [br, bg, bb] = blackbodyRGB(T);
  const bbCss = `rgb(${br}, ${bg}, ${bb})`;

  // ── Draw blackbody curve ──────────────────────────────────────────
  useEffect(() => {
    const c1 = graphRef.current;
    if (!c1) return;
    const ctx = c1.getContext('2d');
    if (!ctx) return;
    const W = c1.width;
    const H = c1.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 64;
    const padR = 24;
    const padT = 54;
    const padB = 58;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Title
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `700 17px ${canvasFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('BLACKBODY RADIATION', padL, 24);
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `500 13px ${canvasFont}`;
    ctx.fillText('Intensity vs Wavelength — curve shifts as temperature changes', padL, 46);

    // Axis frame
    ctx.strokeStyle = 'rgba(203,213,225,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    const xFromLam = (lam: number) =>
      padL + ((lam - LAM_MIN) / (LAM_MAX - LAM_MIN)) * plotW;

    // Precompute curve
    const samples = 400;
    const vals: number[] = new Array(samples + 1);
    let maxB = 0;
    for (let i = 0; i <= samples; i++) {
      const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
      const b = planck(lam, T);
      vals[i] = b;
      if (b > maxB) maxB = b;
    }
    // Safety
    if (maxB <= 0) maxB = 1;
    const yFromB = (b: number) => padT + plotH - (b / maxB) * plotH * 0.88;

    // Visible spectrum band with rainbow shading
    const visX1 = xFromLam(VIS_MIN);
    const visX2 = xFromLam(VIS_MAX);
    const grad = ctx.createLinearGradient(visX1, 0, visX2, 0);
    grad.addColorStop(0.00, 'rgba(160,  0,  220, 0.30)'); // violet
    grad.addColorStop(0.20, 'rgba( 30, 100, 255, 0.30)'); // blue
    grad.addColorStop(0.45, 'rgba(  0, 220, 120, 0.30)'); // green
    grad.addColorStop(0.70, 'rgba(255, 200,   0, 0.30)'); // yellow
    grad.addColorStop(1.00, 'rgba(230,  60,  60, 0.30)'); // red
    ctx.fillStyle = grad;
    ctx.fillRect(visX1, padT, visX2 - visX1, plotH);

    // Region labels at top
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `600 13px ${canvasFont}`;
    ctx.textAlign = 'center';
    if (visX1 - padL > 30) ctx.fillText('UV', (padL + visX1) / 2, padT + 16);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 13px ${canvasFont}`;
    ctx.fillText('VISIBLE', (visX1 + visX2) / 2, padT + 16);
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `600 13px ${canvasFont}`;
    ctx.fillText('INFRARED', (visX2 + padL + plotW) / 2, padT + 16);

    // Grid
    ctx.strokeStyle = 'rgba(148,163,184,0.08)';
    for (let i = 1; i < 5; i++) {
      const y = padT + (plotH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
    }

    // Filled area under the curve
    ctx.beginPath();
    ctx.fillStyle = 'rgba(251, 146, 60, 0.14)';
    ctx.moveTo(padL, padT + plotH);
    for (let i = 0; i <= samples; i++) {
      const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
      ctx.lineTo(xFromLam(lam), yFromB(vals[i]));
    }
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.closePath();
    ctx.fill();

    // Highlight the visible portion of the area with a stronger fill
    ctx.save();
    ctx.beginPath();
    ctx.rect(visX1, padT, visX2 - visX1, plotH);
    ctx.clip();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(34, 211, 238, 0.22)';
    ctx.moveTo(padL, padT + plotH);
    for (let i = 0; i <= samples; i++) {
      const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
      ctx.lineTo(xFromLam(lam), yFromB(vals[i]));
    }
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Curve itself
    ctx.beginPath();
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 2.4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(251, 146, 60, 0.5)';
    for (let i = 0; i <= samples; i++) {
      const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
      const px = xFromLam(lam);
      const py = yFromB(vals[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Peak marker
    const peakClamped = Math.max(LAM_MIN, Math.min(LAM_MAX, peak));
    const peakX = xFromLam(peakClamped);
    const peakY = yFromB(maxB);
    ctx.strokeStyle = 'rgba(241,245,249,0.55)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Peak label (with a small background card so it stays readable)
    const peakLabel = `λ_peak ≈ ${peak.toFixed(0)} nm`;
    ctx.font = `700 13px ${canvasFont}`;
    const lw = ctx.measureText(peakLabel).width + 14;
    let labelX = peakX - lw / 2;
    // clamp within plot
    if (labelX < padL + 2) labelX = padL + 2;
    if (labelX + lw > padL + plotW - 2) labelX = padL + plotW - 2 - lw;
    const labelY = Math.max(padT + 28, peakY - 22);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(labelX, labelY - 15, lw, 22);
    ctx.strokeStyle = 'rgba(203,213,225,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(labelX + 0.5, labelY - 14.5, lw - 1, 21);
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.fillText(peakLabel, labelX + lw / 2, labelY + 1);

    // Axis labels
    ctx.fillStyle = 'rgba(226,232,240,0.95)';
    ctx.font = `600 13px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('Wavelength λ (nm)', padL + plotW / 2, H - 14);
    ctx.save();
    ctx.translate(20, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Intensity (relative)', 0, 0);
    ctx.restore();

    // X ticks
    ctx.fillStyle = 'rgba(226,232,240,0.85)';
    ctx.font = `500 12px ${canvasFont}`;
    [500, 1000, 1500, 2000, 2500, 3000].forEach(lam => {
      const px = xFromLam(lam);
      ctx.fillText(String(lam), px, padT + plotH + 18);
    });
    ctx.textAlign = 'start';
  }, [T, canvasFont, peak]);

  // ── Draw bulb glow ────────────────────────────────────────────────
  useEffect(() => {
    const cc = bulbRef.current;
    if (!cc) return;
    const ctx = cc.getContext('2d');
    if (!ctx) return;
    const W = cc.width;
    const H = cc.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 - 10;

    // Brightness cue: grows smoothly with T (not literal T⁴, for visual readability)
    const brightness = Math.max(0.15, Math.min(1, (T - 800) / 4200));

    // Outer radial halo
    const halo = ctx.createRadialGradient(cx, cy, 4, cx, cy, 140);
    halo.addColorStop(0, `rgba(${br}, ${bg}, ${bb}, ${brightness * 0.55})`);
    halo.addColorStop(0.4, `rgba(${br}, ${bg}, ${bb}, ${brightness * 0.15})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // Bulb shape (teardrop)
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy + 34);
    ctx.bezierCurveTo(cx - 52, cy + 10, cx - 52, cy - 44, cx, cy - 52);
    ctx.bezierCurveTo(cx + 52, cy - 44, cx + 52, cy + 10, cx + 32, cy + 34);
    ctx.closePath();

    // Glass interior fill
    const interior = ctx.createRadialGradient(cx, cy - 4, 4, cx, cy, 60);
    interior.addColorStop(0, `rgba(${br}, ${bg}, ${bb}, ${Math.min(0.9, brightness + 0.15)})`);
    interior.addColorStop(1, `rgba(${br}, ${bg}, ${bb}, ${brightness * 0.35})`);
    ctx.fillStyle = interior;
    ctx.fill();

    ctx.strokeStyle = 'rgba(226,232,240,0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Filament (two loops)
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(${br}, ${bg}, ${bb}, ${Math.min(1, brightness + 0.2)})`;
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, brightness + 0.15)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const x = cx - 14 + i * 2;
      const y = cy + (i % 2 === 0 ? -4 : 4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // filament leads down to the base
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 4);
    ctx.lineTo(cx - 6, cy + 28);
    ctx.moveTo(cx + 14, cy - 4);
    ctx.lineTo(cx + 6, cy + 28);
    ctx.stroke();
    ctx.restore();

    // Screw base
    ctx.fillStyle = 'rgba(148,163,184,0.75)';
    ctx.fillRect(cx - 14, cy + 34, 28, 10);
    ctx.fillStyle = 'rgba(100,116,139,0.85)';
    ctx.fillRect(cx - 14, cy + 44, 28, 4);
    ctx.fillRect(cx - 11, cy + 48, 22, 4);
    ctx.fillRect(cx - 8, cy + 52, 16, 4);
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.beginPath();
    ctx.arc(cx, cy + 60, 3, 0, Math.PI * 2);
    ctx.fill();

    // Temperature label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 20px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${T} K`, cx, H - 22);
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `600 12px ${canvasFont}`;
    ctx.fillText('blackbody glow', cx, H - 8);
    ctx.textAlign = 'start';
  }, [T, canvasFont, br, bg, bb]);

  return (
    <div className="font-sans my-6">
      {/* Graph + bulb side by side — graph dominates, bulb is a compact aside */}
      <div className="grid grid-cols-1 md:grid-cols-[2.7fr_1fr] gap-4 items-stretch">
        <div
          className="rounded-2xl overflow-hidden flex items-center"
          style={{ background: '#0b0d1a', border: '1px solid rgba(148,163,184,0.12)' }}
        >
          <canvas ref={graphRef} width={GRAPH_W} height={GRAPH_H} className="w-full h-auto block" />
        </div>
        <div
          className="rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: '#0b0d1a', border: '1px solid rgba(148,163,184,0.12)' }}
        >
          <canvas ref={bulbRef} width={BULB_W} height={BULB_H} className="w-full h-auto block" />
        </div>
      </div>

      {/* Temperature slider */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-slate-300 text-[12px] font-bold tracking-widest uppercase">
            Temperature (T)
          </span>
          <span className="font-mono text-[16px] font-bold" style={{ color: bbCss }}>
            {T} K
          </span>
        </div>
        <input
          type="range"
          min={800}
          max={6500}
          step={10}
          value={T}
          onChange={e => setT(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-2 tracking-wide uppercase font-semibold">
          <span>Dull</span>
          <span>Red hot</span>
          <span>White hot</span>
          <span>Blue-white</span>
        </div>
      </div>

      {/* Preset jumps */}
      <div className="mt-5 flex flex-wrap gap-2">
        {PRESETS.map(p => {
          const active = Math.abs(T - p.T) < 15;
          return (
            <button
              key={p.name}
              onClick={() => setT(p.T)}
              className={`font-sans px-4 py-2.5 rounded-xl border transition-all text-[12px] font-bold tracking-widest uppercase ${
                active
                  ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200'
                  : 'bg-white/[0.02] border-white/10 text-slate-300 hover:text-white hover:border-white/25'
              }`}
            >
              {p.name} <span className="opacity-60 ml-1">{p.T} K</span>
            </button>
          );
        })}
      </div>

      {/* Evolution comparison */}
      <div
        className="mt-6 rounded-2xl p-5"
        style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.12)' }}
      >
        <div className="text-[12px] font-bold tracking-widest uppercase text-slate-300 mb-4">
          Why we moved from filament → CFL → LED
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BulbTypeCard
            title="Incandescent filament"
            years="1880 → 2010"
            useful="~5%"
            desc="A tungsten filament at ~2700 K is essentially a blackbody. Wien puts its peak near 1073 nm — deep infrared. ~95% of the electricity leaves as heat, not light. The only way to shift the peak into visible would be to heat the filament above 5000 K, but tungsten melts at 3695 K."
            tone="loss"
          />
          <BulbTypeCard
            title="CFL (compact fluorescent)"
            years="1995 → 2015"
            useful="~20%"
            desc="Not a blackbody at all. Mercury vapour excited by a current emits UV; a phosphor coating on the glass converts that UV into visible light. The thermal spectrum is sidestepped entirely — you only emit the wavelengths you actually want."
            tone="mid"
          />
          <BulbTypeCard
            title="LED"
            years="2010 → today"
            useful="~40–50%"
            desc="Semiconductor band-gap emission. Electrons drop across an engineered energy gap and release a photon whose wavelength is set directly by that gap. You tune the material → you tune the colour. Almost nothing is wasted as infrared."
            tone="good"
          />
        </div>
        <div className="mt-5 text-[14px] text-slate-300 leading-relaxed">
          The filament bulb&apos;s failure is written into the blackbody curve — drag the slider down
          to <span className="text-white font-semibold">2700 K</span> and look where the peak
          lands. Almost the entire orange area sits to the <em className="not-italic">right</em> of
          the visible band. CFL and LED win because they don&apos;t rely on a thermal spectrum at all.
        </div>
      </div>
    </div>
  );
}

// ── Era card for the three bulb types ─────────────────────────────
function BulbTypeCard({
  title,
  years,
  useful,
  desc,
  tone,
}: {
  title: string;
  years: string;
  useful: string;
  desc: string;
  tone: 'loss' | 'mid' | 'good';
}) {
  const toneClass =
    tone === 'loss' ? 'text-rose-300' : tone === 'mid' ? 'text-amber-300' : 'text-emerald-300';
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.12)' }}
    >
      <div className="text-[16px] font-bold text-white">{title}</div>
      <div className="text-[11px] text-slate-500 mt-1 mb-4 tracking-widest uppercase">{years}</div>
      <div className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
        Useful light output
      </div>
      <div className={`font-mono text-[22px] font-bold mt-1 ${toneClass}`}>{useful}</div>
      <div className="text-[14px] text-slate-300 leading-relaxed mt-3">{desc}</div>
    </div>
  );
}
