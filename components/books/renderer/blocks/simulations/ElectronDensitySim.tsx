'use client';

// Electron Probability Density Visualizer
// Quantum mechanical |psi|^2 dot-cloud for hydrogen-like orbitals
// Wavefunctions: Griffiths, "Introduction to Quantum Mechanics" (2018)
// Radial nodes: Atkins, "Physical Chemistry" (11th ed.)

import { useCallback, useEffect, useRef, useState } from 'react';

type Orbital = '1s' | '2s' | '2p' | '3s';
type Mode = 'dots' | 'density';

const ORBITALS: Orbital[] = ['1s', '2s', '2p', '3s'];

const ORBITAL_COLORS: Record<Orbital, string> = {
  '1s': '#818cf8',
  '2s': '#6366f1',
  '2p': '#34d399',
  '3s': '#a78bfa',
};

const ORBITAL_SCALES: Record<Orbital, number> = {
  '1s': 6,
  '2s': 12,
  '2p': 12,
  '3s': 20,
};

const ORBITAL_INFO: Record<Orbital, string> = {
  '1s': 'The 1s electron cloud is spherically symmetric. The electron is most likely to be found at a distance of 1 Bohr radius (\u2009a\u2080 = 0.529 \u00C5\u2009) from the nucleus.',
  '2s': 'The 2s orbital has a radial node at r = 2a\u2080 \u2014 notice the gap in the dot cloud. The electron is found in two separate regions.',
  '2p': 'The 2p orbital has two lobes separated by a nodal plane through the nucleus. The electron is never found on this plane.',
  '3s': 'The 3s orbital has two radial nodes. Notice three distinct density regions separated by spherical shells where the probability drops to zero.',
};

// --- Wavefunctions (|psi|^2 in atomic units, a0 = 1) ---

function psi2_1s(r: number): number {
  return 4 * Math.exp(-2 * r);
}

function psi2_2s(r: number): number {
  const t = 2 - r;
  return (1 / 8) * t * t * Math.exp(-r);
}

function psi2_2p(r: number, theta: number): number {
  const cosT = Math.cos(theta);
  return (1 / 32) * r * r * Math.exp(-r) * cosT * cosT;
}

function psi2_3s(r: number): number {
  const t = 27 - 18 * r + 2 * r * r;
  return (4 / (81 * 81 * 3)) * t * t * Math.exp(-2 * r / 3);
}

function getPsi2(orbital: Orbital, r: number, theta: number): number {
  switch (orbital) {
    case '1s': return psi2_1s(r);
    case '2s': return psi2_2s(r);
    case '2p': return psi2_2p(r, theta);
    case '3s': return psi2_3s(r);
  }
}

function getMaxPsi2(orbital: Orbital): number {
  // Precomputed maxima from evaluating wavefunctions
  switch (orbital) {
    case '1s': return 4.0;           // at r=0
    case '2s': return 0.5;           // at r=0
    case '2p': return 0.0134;        // max of r^2 * exp(-r) at r=2
    case '3s': return 0.0133;        // at r=0
  }
}

// --- Dot generation via rejection sampling ---

interface Dot {
  px: number;
  py: number;
}

function generateDots(orbital: Orbital, count: number, size: number): Dot[] {
  const dots: Dot[] = [];
  const scale = ORBITAL_SCALES[orbital];
  const maxP = getMaxPsi2(orbital);
  const half = size / 2;

  let attempts = 0;
  const limit = count * 50;
  while (dots.length < count && attempts < limit) {
    attempts++;
    const px = Math.random() * size - half;
    const py = Math.random() * size - half;
    const x = (px / half) * scale;
    const y = (py / half) * scale;
    const r = Math.sqrt(x * x + y * y);
    // theta measured from z-axis (y-up in physical coords)
    const theta = Math.atan2(Math.abs(x), y);

    const prob = getPsi2(orbital, r, theta);
    if (Math.random() < prob / maxP) {
      dots.push({ px: px + half, py: half - py });
    }
  }
  return dots;
}

// --- Node positions (in Bohr radii) ---

function getNodeRadii(orbital: Orbital): number[] {
  switch (orbital) {
    case '2s': return [2.0];
    case '3s': return [1.90, 7.10];
    default: return [];
  }
}

// --- Component ---

export default function ElectronDensitySim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orbital, setOrbital] = useState<Orbital>('1s');
  const [dotCount, setDotCount] = useState(1500);
  const [mode, setMode] = useState<Mode>('dots');

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 400;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.clearRect(0, 0, size, size);

    const color = ORBITAL_COLORS[orbital];
    const scale = ORBITAL_SCALES[orbital];
    const half = size / 2;

    if (mode === 'density') {
      // Pixel-by-pixel density rendering
      const maxP = getMaxPsi2(orbital);
      const imgData = ctx.createImageData(size, size);
      const [cr, cg, cb] = hexToRgb(color);

      for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
          const x = ((px - half) / half) * scale;
          const y = ((half - py) / half) * scale; // flip y
          const r = Math.sqrt(x * x + y * y);
          const theta = Math.atan2(Math.abs(x), y);
          const p = getPsi2(orbital, r, theta);
          const intensity = Math.min(p / maxP, 1);
          // Apply gamma for better contrast
          const mapped = Math.pow(intensity, 0.45);
          const idx = (py * size + px) * 4;
          imgData.data[idx] = cr * mapped;
          imgData.data[idx + 1] = cg * mapped;
          imgData.data[idx + 2] = cb * mapped;
          imgData.data[idx + 3] = mapped * 255;
        }
      }
      // Draw at 1:1 then let dpr scaling handle it
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const offCtx = offscreen.getContext('2d')!;
      offCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(offscreen, 0, 0, size, size);
    } else {
      // Dot cloud mode
      const dots = generateDots(orbital, dotCount, size);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = color;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.px, dot.py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Draw node indicators
    drawNodes(ctx, orbital, scale, half, size);

    // Nucleus
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(half, half, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [orbital, dotCount, mode]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div
      style={{
        background: '#050a14',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.07)',
        padding: 24,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#e2e8f0',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
          Electron Probability Density
        </h3>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
          Hydrogen atom |&psi;|&sup2; dot cloud
        </p>
      </div>

      {/* Orbital selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {ORBITALS.map((o) => (
          <button
            key={o}
            onClick={() => setOrbital(o)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              border: orbital === o
                ? `2px solid ${ORBITAL_COLORS[o]}`
                : '1px solid rgba(255,255,255,0.1)',
              background: orbital === o ? `${ORBITAL_COLORS[o]}18` : 'transparent',
              color: orbital === o ? ORBITAL_COLORS[o] : '#94a3b8',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {o}
          </button>
        ))}
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['dots', 'density'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 8,
              border: mode === m
                ? '1px solid rgba(99,102,241,0.4)'
                : '1px solid rgba(255,255,255,0.07)',
              background: mode === m ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: mode === m ? '#818cf8' : '#475569',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {m === 'dots' ? 'Dots' : 'Density'}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div
        style={{
          background: 'radial-gradient(circle at center, #1e204a 0%, #050614 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: 400, height: 400 }}
        />
      </div>

      {/* Dot count slider (only in dots mode) */}
      {mode === 'dots' && (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Dot count
            </span>
            <span style={{ fontSize: 13, color: '#818cf8', fontWeight: 600 }}>
              {dotCount}
            </span>
          </div>
          <input
            type="range"
            min={200}
            max={5000}
            step={100}
            value={dotCount}
            onChange={(e) => setDotCount(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#818cf8' }}
          />
        </div>
      )}

      {/* Info card */}
      <div
        style={{
          marginTop: 16,
          background: '#0d1117',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '12px 14px',
        }}
      >
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: '#94a3b8' }}>
          {ORBITAL_INFO[orbital]}
        </p>
      </div>
    </div>
  );
}

// --- Helpers ---

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  orbital: Orbital,
  scale: number,
  half: number,
  size: number,
) {
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
  ctx.lineWidth = 1;

  if (orbital === '2p') {
    // Nodal plane: horizontal line through center
    ctx.beginPath();
    ctx.moveTo(0, half);
    ctx.lineTo(size, half);
    ctx.stroke();
  } else {
    const radii = getNodeRadii(orbital);
    for (const nodeR of radii) {
      const pixelR = (nodeR / scale) * half;
      ctx.beginPath();
      ctx.arc(half, half, pixelR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}
