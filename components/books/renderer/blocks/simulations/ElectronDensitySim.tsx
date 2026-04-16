'use client';

// Electron Probability Density Visualizer — v2
// Quantum mechanical |ψ|² for hydrogen-like orbitals
// Wavefunctions: Griffiths "Introduction to Quantum Mechanics" (2018), Table 4.3
// 3D mode: rejection sampling in ℝ³ with Y-axis rotation & perspective depth

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Orbital = '1s' | '2s' | '2p' | '3s' | '3p' | '3d';
type Mode    = 'dots' | 'density' | '3d';

const ORBITALS: Orbital[] = ['1s', '2s', '2p', '3s', '3p', '3d'];

// ─── Colours ─────────────────────────────────────────────────────────────────

const COL: Record<Orbital, string> = {
  '1s': '#818cf8', '2s': '#6366f1', '2p': '#34d399',
  '3s': '#a78bfa', '3p': '#60a5fa', '3d': '#fb923c',
};

// Phase colours for 3D: [+ψ lobe, −ψ lobe]
const PHASE: Record<Orbital, [string, string]> = {
  '1s': ['#818cf8', '#818cf8'],
  '2s': ['#6366f1', '#6366f1'],
  '2p': ['#34d399', '#f87171'],
  '3s': ['#a78bfa', '#a78bfa'],
  '3p': ['#60a5fa', '#f59e0b'],
  '3d': ['#fb923c', '#c084fc'],
};

// ─── Sampling scale (atomic units, a₀ = 1) ───────────────────────────────────

const SCALE: Record<Orbital, number> = {
  '1s': 7, '2s': 18, '2p': 18, '3s': 34, '3p': 34, '3d': 30,
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface Meta {
  n: number; l: number; m: string;
  shape: string;
  rNodes: number; aNodes: number;
  probR: string;
  desc: string;
}

const META: Record<Orbital, Meta> = {
  '1s': {
    n:1, l:0, m:'0', shape:'Sphere',
    rNodes:0, aNodes:0, probR:'1 a₀ (0.529 Å)',
    desc:'Perfectly spherically symmetric ground state. Equal probability of finding the electron in any direction. Binding energy: 13.6 eV.',
  },
  '2s': {
    n:2, l:0, m:'0', shape:'Sphere + radial node',
    rNodes:1, aNodes:0, probR:'~5 a₀',
    desc:'Spherically symmetric with one radial node at r = 2a₀ — a spherical shell of zero probability. Density appears in two concentric regions.',
  },
  '2p': {
    n:2, l:1, m:'0, ±1', shape:'Dumbbell',
    rNodes:0, aNodes:1, probR:'~4 a₀',
    desc:'Two lobes pointing in opposite directions, separated by a nodal plane through the nucleus. Three degenerate 2p orbitals (2pₓ, 2p_y, 2p_z) form sp, sp², sp³ hybrids.',
  },
  '3s': {
    n:3, l:0, m:'0', shape:'Sphere + 2 radial nodes',
    rNodes:2, aNodes:0, probR:'~13 a₀',
    desc:'Two radial nodes create three concentric density shells. Still spherically symmetric — the probability at a given radius is direction-independent.',
  },
  '3p': {
    n:3, l:1, m:'0, ±1', shape:'Dumbbell + radial node',
    rNodes:1, aNodes:1, probR:'~12 a₀',
    desc:'Extended version of 2p with an additional radial node in each lobe (r = 6a₀). Used in S, P, Cl bonding. The 3p−3s energy gap determines many period-3 properties.',
  },
  '3d': {
    n:3, l:2, m:'0, ±1, ±2', shape:'Ring + dumbbell (d_z²)',
    rNodes:0, aNodes:2, probR:'~9 a₀',
    desc:'Showing 3d_z²: two lobes along z-axis and a toroidal ring in the xy-plane. Five 3d orbitals (split into t₂g + eₘ in crystal fields) control transition-metal colour and magnetism.',
  },
};

// ─── Wavefunctions  |ψ|²  &  phase sign ──────────────────────────────────────
// r in atomic units; cosT = cos(polar angle from z-axis)
// Returns [|ψ|², +1 or −1 sign of ψ]

function psi2(orb: Orbital, r: number, cosT: number): [number, number] {
  switch (orb) {
    case '1s':
      return [Math.exp(-2 * r), 1];

    case '2s': {
      const t = 2 - r;
      return [t * t * Math.exp(-r), 1];
    }

    case '2p': {
      const val = r * r * Math.exp(-r) * cosT * cosT;
      return [val, cosT >= 0 ? 1 : -1];
    }

    case '3s': {
      const t = 27 - 18 * r + 2 * r * r;
      return [t * t * Math.exp(-2 * r / 3), 1];
    }

    case '3p': {
      const val = r * r * (6 - r) * (6 - r) * cosT * cosT * Math.exp(-2 * r / 3);
      return [Math.max(0, val), (6 - r) * cosT >= 0 ? 1 : -1];
    }

    case '3d': {
      const ang = 3 * cosT * cosT - 1;
      const val = Math.pow(r, 4) * ang * ang * Math.exp(-2 * r / 3);
      return [val, ang >= 0 ? 1 : -1];
    }
  }
}

// Precomputed upper bounds for rejection sampling  (value ≥ max of |ψ|²)
const MAX_PSI2: Record<Orbital, number> = {
  '1s': 1.0,   // at r=0: e^0=1
  '2s': 4.0,   // at r=0: (2-0)²=4
  '2p': 0.56,  // r=2, θ=0: 4·e⁻²≈0.541
  '3s': 730,   // at r=0: 27²=729
  '3p': 20,    // r≈1.76, θ=0: ~17.2
  '3d': 100,   // r=6, θ=0: 4·6⁴·e⁻⁴≈95
};

// ─── Dot structures ───────────────────────────────────────────────────────────

interface Dot2D { px: number; py: number; }
interface Dot3D { x: number; y: number; z: number; phase: number; }

// ─── Rejection sampling ───────────────────────────────────────────────────────

function gen2D(orb: Orbital, count: number, sz: number): Dot2D[] {
  const out: Dot2D[] = [];
  const sc = SCALE[orb];
  const mp = MAX_PSI2[orb];
  const h  = sz / 2;
  let att  = 0;
  while (out.length < count && att < count * 70) {
    att++;
    const px = Math.random() * sz - h;
    const py = Math.random() * sz - h;
    const x  = (px / h) * sc;
    const y  = (py / h) * sc;
    const r  = Math.sqrt(x * x + y * y);
    // treat canvas as XZ plane: y-axis = physical z-axis
    const cosT = r > 0 ? y / r : 1;
    const [p] = psi2(orb, r, cosT);
    if (Math.random() < p / mp) out.push({ px: px + h, py: h - py });
  }
  return out;
}

function gen3D(orb: Orbital, count: number): Dot3D[] {
  const out: Dot3D[] = [];
  const sc = SCALE[orb];
  const mp = MAX_PSI2[orb];
  let att  = 0;
  while (out.length < count && att < count * 90) {
    att++;
    const x = (Math.random() * 2 - 1) * sc;
    const y = (Math.random() * 2 - 1) * sc;
    const z = (Math.random() * 2 - 1) * sc;
    const r = Math.sqrt(x * x + y * y + z * z);
    const cosT = r > 0 ? z / r : 1;
    const [p, phase] = psi2(orb, r, cosT);
    if (Math.random() < p / mp) out.push({ x, y, z, phase });
  }
  return out;
}

// ─── Radial node radii (a₀) ───────────────────────────────────────────────────

function nodeRadii(orb: Orbital): number[] {
  switch (orb) {
    case '2s': return [2.0];
    case '3s': return [1.90, 7.10];
    case '3p': return [6.0];   // one radial node per lobe
    default:   return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  orb: Orbital, sc: number, h: number, sz: number,
) {
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(248,113,113,0.45)';
  ctx.lineWidth = 1;

  if (orb === '2p' || orb === '3p') {
    // Nodal plane (horizontal line through nucleus)
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(sz, h); ctx.stroke();
  }
  if (orb === '3d') {
    // Conical nodes at θ = arccos(1/√3) ≈ 54.7° from z-axis
    const sinMagic = Math.sqrt(2 / 3); // sin(54.7°)
    const cosMagic = 1 / Math.sqrt(3); // cos(54.7°)
    const len = h * 0.95;
    ctx.translate(h, h);
    for (const [sx, sy] of [
      [ sinMagic, -cosMagic], [-sinMagic,  cosMagic],
      [-sinMagic, -cosMagic], [ sinMagic,  cosMagic],
    ]) {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sx * len, sy * len); ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(248,113,113,0.45)';
    ctx.lineWidth = 1;
  }
  // Radial node circles
  for (const nr of nodeRadii(orb)) {
    const pixR = (nr / sc) * h;
    ctx.beginPath(); ctx.arc(h, h, pixR, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

function drawAxisIndicator(
  ctx: CanvasRenderingContext2D, angle: number, sz: number,
) {
  const cx = 38, cy = sz - 38, L = 22;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  ctx.save();
  ctx.lineWidth  = 1.5;
  ctx.font       = '9px system-ui';
  ctx.textBaseline = 'middle';
  // X  axis
  ctx.strokeStyle = '#f87171'; ctx.fillStyle = '#f87171'; ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + L * ca, cy); ctx.stroke();
  ctx.fillText('x', cx + L * ca + 4, cy);
  // Y axis (always vertical)
  ctx.strokeStyle = '#4ade80'; ctx.fillStyle = '#4ade80';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - L); ctx.stroke();
  ctx.fillText('y', cx + 3, cy - L - 4);
  // Z axis
  ctx.strokeStyle = '#60a5fa'; ctx.fillStyle = '#60a5fa';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - L * sa, cy); ctx.stroke();
  ctx.fillText('z', cx - L * sa - 12, cy);
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ElectronDensitySim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dots3DRef  = useRef<Dot3D[]>([]);
  const animRef    = useRef<number>(0);
  const angleRef   = useRef(0.4);

  const [orbital,  setOrbital]  = useState<Orbital>('1s');
  const [mode,     setMode]     = useState<Mode>('dots');
  const [dotCount, setDotCount] = useState(1500);

  const meta      = META[orbital];
  const color     = COL[orbital];
  const [posCol, negCol] = PHASE[orbital];
  const hasTwoPhases = posCol !== negCol;

  // ── 2-D draw ───────────────────────────────────────────────────────────────

  const draw2D = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const sz  = 500;
    canvas.width  = sz * dpr;
    canvas.height = sz * dpr;
    canvas.style.width  = `${sz}px`;
    canvas.style.height = `${sz}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sz, sz);

    const sc = SCALE[orbital];
    const h  = sz / 2;

    if (mode === 'density') {
      const mp  = MAX_PSI2[orbital];
      const img = ctx.createImageData(sz, sz);
      const [cr, cg, cb] = hexRgb(color);
      for (let py = 0; py < sz; py++) {
        for (let px = 0; px < sz; px++) {
          const x    = ((px - h) / h) * sc;
          const y    = ((h - py) / h) * sc;
          const r    = Math.sqrt(x * x + y * y);
          const cosT = r > 0 ? y / r : 1;
          const [p]  = psi2(orbital, r, cosT);
          const m    = Math.pow(Math.min(p / mp, 1), 0.40);
          const idx  = (py * sz + px) * 4;
          img.data[idx]     = cr * m;
          img.data[idx + 1] = cg * m;
          img.data[idx + 2] = cb * m;
          img.data[idx + 3] = m * 255;
        }
      }
      const off = document.createElement('canvas');
      off.width = sz; off.height = sz;
      off.getContext('2d')!.putImageData(img, 0, 0);
      ctx.drawImage(off, 0, 0, sz, sz);
    } else {
      const dots = gen2D(orbital, dotCount, sz);
      ctx.globalAlpha = 0.65;
      ctx.fillStyle   = color;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.px, d.py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    drawNodes(ctx, orbital, sc, h, sz);

    // Nucleus
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(h, h, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [orbital, mode, dotCount, color]);

  // ── 3-D frame draw ─────────────────────────────────────────────────────────

  const draw3D = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const sz  = 500;
    if (canvas.width !== sz * dpr) {
      canvas.width  = sz * dpr;
      canvas.height = sz * dpr;
      canvas.style.width  = `${sz}px`;
      canvas.style.height = `${sz}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.clearRect(0, 0, sz, sz);

    const h   = sz / 2;
    const sc  = SCALE[orbital];
    const ppu = h / (sc * 1.15);   // pixels per atomic unit
    const A   = angleRef.current;
    const ca  = Math.cos(A), sa = Math.sin(A);

    const [pr, pg, pb] = hexRgb(posCol);
    const [nr, ng, nb] = hexRgb(negCol);

    // Project all dots
    const proj = dots3DRef.current.map(d => {
      // Rotate around Y-axis
      const xr =  d.x * ca + d.z * sa;
      const yr =  d.y;
      const zr = -d.x * sa + d.z * ca;
      return {
        sx: h + xr * ppu,
        sy: h - yr * ppu,
        zr,
        phase: d.phase,
      };
    });
    proj.sort((a, b) => a.zr - b.zr); // back → front

    for (const p of proj) {
      const depth = (p.zr + sc) / (2 * sc);         // 0=back, 1=front
      const alpha = 0.28 + 0.52 * depth;
      const [r, g, b] = p.phase >= 0
        ? [pr, pg, pb] : [nr, ng, nb];
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Nucleus
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(h, h, 3, 0, Math.PI * 2);
    ctx.fill();

    drawAxisIndicator(ctx, A, sz);
  }, [orbital, posCol, negCol]);

  // ── Effects ────────────────────────────────────────────────────────────────

  // Generate 3-D dots when orbital or mode changes
  useEffect(() => {
    if (mode === '3d') {
      dots3DRef.current = gen3D(orbital, 3500);
    }
  }, [orbital, mode]);

  // 2-D draw
  useEffect(() => {
    if (mode !== '3d') {
      cancelAnimationFrame(animRef.current);
      draw2D();
    }
  }, [draw2D, mode]);

  // 3-D animation loop
  useEffect(() => {
    if (mode !== '3d') return;
    let prev = 0;
    function frame(ts: number) {
      const dt = ts - prev;
      prev = ts;
      if (dt < 200) angleRef.current += (dt / 7000) * Math.PI * 2;
      draw3D();
      animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, draw3D]);

  // ── Styles ─────────────────────────────────────────────────────────────────

  const S = {
    root: {
      background: '#050a14',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#e2e8f0',
      maxWidth: 980,
      margin: '0 auto',
    } as React.CSSProperties,

    label: {
      fontSize: 10,
      color: '#64748b',
      fontWeight: 600,
      letterSpacing: '0.07em',
      textTransform: 'uppercase' as const,
      margin: '0 0 8px',
    } as React.CSSProperties,
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={S.root}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
          Electron Probability Density
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Hydrogen atom |ψ|² — quantum mechanical orbital visualiser
        </p>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── LEFT: Canvas ──────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Canvas wrapper */}
          <div style={{
            background: 'radial-gradient(ellipse at center, #1a1e42 0%, #050614 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <canvas
              ref={canvasRef}
              style={{ display: 'block', maxWidth: '100%' }}
            />
          </div>

          {/* Dot count slider — dots mode only */}
          {mode === 'dots' && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={S.label}>Dot count</span>
                <span style={{ fontSize: 12, color, fontWeight: 700 }}>
                  {dotCount.toLocaleString()}
                </span>
              </div>
              <input
                type="range" min={300} max={5000} step={100} value={dotCount}
                onChange={e => setDotCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: color }}
              />
            </div>
          )}

          {/* Phase legend — 3D only */}
          {mode === '3d' && hasTwoPhases && (
            <div style={{ marginTop: 12, display: 'flex', gap: 20, justifyContent: 'center' }}>
              {([['+ phase', posCol], ['− phase', negCol]] as [string, string][]).map(([lbl, c]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{lbl}</span>
                </div>
              ))}
            </div>
          )}

          {/* Node legend */}
          {mode !== '3d' && (orbital === '2p' || orbital === '3p' || orbital === '2s' || orbital === '3s' || orbital === '3d') && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, borderTop: '1px dashed rgba(248,113,113,0.6)' }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {orbital === '2p' || orbital === '3p' ? 'Nodal plane' : orbital === '3d' ? 'Angular nodes (θ ≈ 54.7°)' : 'Radial node'}
              </span>
            </div>
          )}
        </div>

        {/* ── RIGHT: Controls + Info ─────────────────────────────────── */}
        <div style={{ width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Orbital selector — 2×3 grid */}
          <div>
            <p style={S.label}>Orbital</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {ORBITALS.map(o => (
                <button key={o} onClick={() => setOrbital(o)} style={{
                  padding: '7px 0',
                  borderRadius: 8,
                  border: orbital === o
                    ? `2px solid ${COL[o]}`
                    : '1px solid rgba(255,255,255,0.08)',
                  background: orbital === o ? `${COL[o]}1c` : 'transparent',
                  color: orbital === o ? COL[o] : '#64748b',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* View mode */}
          <div>
            <p style={S.label}>View mode</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {([
                { id: 'dots'    as Mode, icon: '·∙·', label: 'Dot cloud',   sub: '|ψ|² sampled' },
                { id: 'density' as Mode, icon: '▣',   label: 'Density map', sub: 'Continuous |ψ|²' },
                { id: '3d'      as Mode, icon: '⟲',   label: '3D Orbital',  sub: 'Rotating + phase' },
              ]).map(({ id, icon, label, sub }) => (
                <button key={id} onClick={() => setMode(id)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: mode === id
                    ? '1px solid rgba(99,102,241,0.5)'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: mode === id
                    ? 'rgba(99,102,241,0.12)'
                    : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  transition: 'all 0.15s',
                }}>
                  <span style={{
                    fontSize: 15,
                    color: mode === id ? '#818cf8' : '#475569',
                    width: 22,
                    textAlign: 'center' as const,
                  }}>
                    {icon}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: mode === id ? '#818cf8' : '#94a3b8' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantum numbers card */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '12px 14px',
          }}>
            <p style={{ ...S.label, marginBottom: 10 }}>Quantum Numbers</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([
                ['n  (principal)', meta.n],
                ['ℓ  (angular)',   meta.l],
                ['mℓ (magnetic)',  meta.m],
                ['Shape',          meta.shape],
                ['Radial nodes',   meta.rNodes],
                ['Angular nodes',  meta.aNodes],
                ['Most prob. r',   meta.probR],
              ] as [string, string | number][]).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px 14px',
          }}>
            <p style={{ ...S.label, marginBottom: 6 }}>Interpretation</p>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              {meta.desc}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
