'use client';

// Wave vs Photon — Planck's quantum idea, visualised.
// Top lane: continuous sine wave (classical light).
// Bottom lane: the SAME wave, chopped into discrete one-wavelength packets.
// Both lanes share the SAME colour at any given frequency — that colour
// shifts through dim red → rainbow → violet as the user sweeps the slider,
// so students see directly that "frequency" is what we perceive as "colour".

import { useEffect, useRef, useState } from 'react';
import {
  useAnimationFrame,
  useResolvedFont,
  logFreqToRGB as freqToRGB,
} from './_shared';

const CANVAS_W = 900;
const CANVAS_H = 360;

const PLANCK = 6.626e-34; // J·s
const EV = 1.602e-19;     // J per eV

// Colour mapping and font resolution live in `./_shared`. We keep a tiny
// region classifier here because it's specific to this sim's annotations.
function regionLabel(logFreq: number): 'IR' | 'Visible' | 'UV' {
  if (logFreq < 14.4) return 'IR';
  if (logFreq > 14.93) return 'UV';
  return 'Visible';
}

function formatFreq(f: number): string {
  if (f >= 1e15) return `${(f / 1e15).toFixed(2)} × 10¹⁵ Hz`;
  if (f >= 1e12) return `${(f / 1e12).toFixed(2)} × 10¹² Hz`;
  return `${(f / 1e9).toFixed(2)} × 10⁹ Hz`;
}

function formatEnergy(e: number): string {
  if (e < 0.01) return e.toExponential(2);
  if (e < 10) return e.toFixed(2);
  return e.toFixed(1);
}

export default function WaveVsPhotonSim() {
  const [logFreq, setLogFreq] = useState(14.6);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFont = useResolvedFont();

  // Animation loop — the shared hook pauses the loop when the canvas is
  // offscreen or the tab is hidden. The old code advanced `time` by a fixed
  // 0.03 per frame (≈ double real time, because wave aesthetics looked
  // sluggish at 60 fps); we preserve that feel by scaling delta by the same
  // factor so existing wave/photon motion speeds are unchanged.
  useAnimationFrame(
    (delta) => {
      setTime((t) => t + delta * 1.8);
    },
    { target: canvasRef }
  );

  const freq = Math.pow(10, logFreq);
  const eJ = PLANCK * freq;
  const eEV = eJ / EV;
  const [cr, cg, cb] = freqToRGB(logFreq);
  const colorCss = `rgb(${cr}, ${cg}, ${cb})`;
  const colorGlow = `rgba(${cr}, ${cg}, ${cb}, 0.55)`;
  const region = regionLabel(logFreq);

  // ── Draw ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.width;
    const H = c.height;

    ctx.clearRect(0, 0, W, H);

    // Layout — reserve space on the left for sources
    const sourceX = 70;
    const sourceR = 16;
    const laneStart = sourceX + sourceR + 8;  // where wave / photons begin
    const laneEnd = W - 30;
    const drawWidth = laneEnd - laneStart;

    const laneAY = 105; // wave baseline
    const laneBY = 260; // photon baseline
    const amp = 38;

    // Visual wavelength shrinks as frequency rises — this is what "higher ν" means
    const waveLen = Math.max(34, 210 - (logFreq - 12) * 44);

    // Wave scrolls rightward at a rate that scales with ν, so the user *sees*
    // more cycles per second at higher frequency. Photons use a SEPARATE FIXED
    // rate so their count never appears to depend on ν.
    const waveScrollPx = 30 + (logFreq - 12) * 18;
    const phaseShift = ((time * waveScrollPx) / waveLen) * 2 * Math.PI;

    // ─── Labels ───────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(226,232,240,0.85)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.fillText('CONTINUOUS WAVE', 30, 30);
    ctx.fillStyle = 'rgba(148,163,184,0.55)';
    ctx.font = `400 11px ${canvasFont}`;
    ctx.fillText('Classical view — energy flows as an unbroken stream', 30, 48);

    ctx.fillStyle = 'rgba(226,232,240,0.85)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.fillText('SAME LIGHT, AS PHOTONS', 30, 190);
    ctx.fillStyle = 'rgba(148,163,184,0.55)';
    ctx.font = `400 11px ${canvasFont}`;
    ctx.fillText(
      'Quantum view — each photon carries energy hν. Same count, more energy each as ν ↑',
      30,
      208
    );

    // Lane guide lines (start after the source)
    ctx.strokeStyle = 'rgba(148,163,184,0.08)';
    ctx.lineWidth = 1;
    [laneAY, laneBY].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(laneStart, y);
      ctx.lineTo(laneEnd, y);
      ctx.stroke();
    });

    // Dashed divider between lanes
    ctx.strokeStyle = 'rgba(148,163,184,0.10)';
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(30, 170);
    ctx.lineTo(laneEnd, 170);
    ctx.stroke();
    ctx.setLineDash([]);

    // ─── Sources (one per lane) ───────────────────────────────────────
    // Source disc glows in the SAME colour as what it emits — students
    // immediately link "this lamp glows red" with "the wave is red".
    const drawSource = (cy: number) => {
      // Outer halo
      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.10)`;
      ctx.arc(sourceX, cy, sourceR + 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.20)`;
      ctx.arc(sourceX, cy, sourceR + 6, 0, Math.PI * 2);
      ctx.fill();
      // Core
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = colorGlow;
      ctx.fillStyle = colorCss;
      ctx.beginPath();
      ctx.arc(sourceX, cy, sourceR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Subtle rim
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, 0.85)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sourceX, cy, sourceR, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawSource(laneAY);
    drawSource(laneBY);

    // "SOURCE" labels
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = `700 9px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('SOURCE', sourceX, laneAY - sourceR - 12);
    ctx.fillText('SOURCE', sourceX, laneBY - sourceR - 12);
    ctx.textAlign = 'start';

    // ─── Continuous wave (emerges from source, moves right) ──────────
    ctx.beginPath();
    ctx.strokeStyle = colorCss;
    ctx.lineWidth = 2.8;
    ctx.shadowBlur = 12;
    ctx.shadowColor = colorGlow;
    for (let x = 0; x <= drawWidth; x++) {
      const y = laneAY + Math.sin((x / waveLen) * 2 * Math.PI - phaseShift) * amp;
      if (x === 0) ctx.moveTo(x + laneStart, y);
      else ctx.lineTo(x + laneStart, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ─── Photon stream (emerges from source, moves right) ────────────
    // Fixed spacing + fixed scroll rate, independent of ν.
    // Each photon's RADIUS grows with ν to signal higher energy per photon.
    const photonSpacing = 110;        // px between photons (fixed)
    const photonScrollPx = 50;        // fixed scroll speed
    const photonScroll = (time * photonScrollPx) % photonSpacing;

    const minR = 9;
    const maxR = 26;
    const photonR = minR + ((logFreq - 12) / 4) * (maxR - minR);
    const glowAlpha = 0.35 + ((logFreq - 12) / 4) * 0.4;

    // Photons emerge from the source and travel rightward.
    // Start one spacing-width behind laneStart so a new photon can appear
    // each time photonScroll wraps, giving the illusion of emission.
    const nPhotons = Math.ceil(drawWidth / photonSpacing) + 2;
    for (let i = 0; i < nPhotons; i++) {
      const cx = laneStart + photonScroll + i * photonSpacing;
      if (cx > laneEnd + maxR) break;
      if (cx < laneStart - maxR) continue;

      // Fade in near the source and fade out near the right edge
      const fadeInDist = 30;
      const fadeOutDist = 30;
      let alphaMul = 1;
      if (cx - laneStart < fadeInDist) alphaMul = (cx - laneStart) / fadeInDist;
      if (laneEnd - cx < fadeOutDist) alphaMul = Math.min(alphaMul, (laneEnd - cx) / fadeOutDist);
      alphaMul = Math.max(0, Math.min(1, alphaMul));

      // Outer glow
      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${glowAlpha * 0.28 * alphaMul})`;
      ctx.arc(cx, laneBY, photonR + 10, 0, Math.PI * 2);
      ctx.fill();

      // Core photon
      ctx.beginPath();
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, ${glowAlpha * alphaMul})`;
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alphaMul})`;
      ctx.arc(cx, laneBY, photonR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bright inner highlight so the photon reads as a glowing sphere
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.55 * alphaMul})`;
      ctx.arc(cx - photonR * 0.3, laneBY - photonR * 0.3, photonR * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // "hν" label below each fully-visible photon
      if (
        alphaMul > 0.85 &&
        cx >= laneStart + photonR + 4 &&
        cx <= laneEnd - photonR - 4
      ) {
        ctx.fillStyle = 'rgba(226,232,240,0.75)';
        ctx.font = `600 11px ${canvasFont}`;
        ctx.textAlign = 'center';
        ctx.fillText('hν', cx, laneBY + maxR + 22);
        ctx.textAlign = 'start';
      }
    }
  }, [time, logFreq, canvasFont, cr, cg, cb, colorCss, colorGlow]);

  return (
    <div className="font-sans my-6">
      {/* Canvas */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#0b0d1a',
          border: '1px solid rgba(148,163,184,0.12)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full h-auto block"
        />
      </div>

      {/* Frequency slider */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-slate-300 text-[12px] font-bold tracking-widest uppercase">
            Frequency (ν)
          </span>
          <span className="font-mono text-[14px] font-bold" style={{ color: colorCss }}>
            {formatFreq(freq)}
          </span>
        </div>
        <input
          type="range"
          min={12}
          max={16}
          step={0.01}
          value={logFreq}
          onChange={e => setLogFreq(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background:
              'linear-gradient(to right,' +
              ' rgb(110,30,20) 0%,' +
              ' rgb(220,55,30) 35%,' +
              ' rgb(255,70,40) 47%,' +
              ' rgb(255,145,40) 51%,' +
              ' rgb(255,220,60) 54%,' +
              ' rgb(80,220,110) 58%,' +
              ' rgb(60,130,255) 62%,' +
              ' rgb(170,80,240) 67%,' +
              ' rgb(200,110,255) 75%,' +
              ' rgb(210,220,255) 100%)',
            accentColor: colorCss,
          }}
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-2 tracking-wide uppercase font-semibold">
          <span>IR</span>
          <span>Visible</span>
          <span>UV</span>
        </div>
      </div>

      {/* Single photon energy readout */}
      <div
        className="mt-6 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: 'rgba(148,163,184,0.04)',
          border: '1px solid rgba(148,163,184,0.12)',
        }}
      >
        <div>
          <div className="text-[11px] font-bold tracking-widest uppercase text-slate-300">
            Energy of one photon{' '}
            <span className="ml-2 text-slate-500">— {region}</span>
          </div>
          <div className="font-mono text-xl text-slate-100 mt-1">
            E = hν =&nbsp;
            <span className="font-bold" style={{ color: colorCss }}>
              {formatEnergy(eEV)} eV
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500 text-right">
          h = 6.626 × 10⁻³⁴ J s
        </div>
      </div>
    </div>
  );
}
