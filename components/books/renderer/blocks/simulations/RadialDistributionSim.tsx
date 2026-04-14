'use client';

// Radial Probability Distribution Function Plotter
// Interactive SVG chart showing P(r) = 4πr²[R(r)]² for hydrogen-like orbitals.
//
// Academic source: NCERT Chemistry Class 11, Chapter 2 — Structure of Atom
// Section 2.6.4 — Shapes of Atomic Orbitals
// Wavefunctions: Normalized radial wavefunctions for hydrogen atom
// (Atkins' Physical Chemistry, 10th Ed., Table 9A.1; Griffiths QM, Table 4.7)

import { useState, useMemo, useCallback, useRef } from 'react';

/* ── Types & Constants ─────────────────────────────────────────────────── */

type OrbitalId = '1s' | '2s' | '2p' | '3s' | '3p' | '3d';

interface OrbitalMeta {
  color: string;
  n: number;
  l: number;
  radialNodes: number[];   // positions where R(r) = 0 (in a₀)
  rMostProbable: number;   // most probable radius (in a₀)
}

const ORBITALS: Record<OrbitalId, OrbitalMeta> = {
  '1s': { color: '#818cf8', n: 1, l: 0, radialNodes: [],          rMostProbable: 1.0   },
  '2s': { color: '#6366f1', n: 2, l: 0, radialNodes: [2],         rMostProbable: 5.24  },
  '2p': { color: '#34d399', n: 2, l: 1, radialNodes: [],          rMostProbable: 4.0   },
  '3s': { color: '#a78bfa', n: 3, l: 0, radialNodes: [1.90, 7.10], rMostProbable: 13.07 },
  '3p': { color: '#10b981', n: 3, l: 1, radialNodes: [6],         rMostProbable: 12.0  },
  '3d': { color: '#fbbf24', n: 3, l: 2, radialNodes: [],          rMostProbable: 9.0   },
};

const ALL_IDS: OrbitalId[] = ['1s', '2s', '3s', '2p', '3p', '3d'];
const NUM_POINTS = 400;
const R_MAX = 25;

/* ── SVG Layout ────────────────────────────────────────────────────────── */

const W = 800;
const H = 400;
const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

/* ── Radial Wavefunction R(n,l,r) ──────────────────────────────────────
   Source: Normalized hydrogen radial wavefunctions
   ρ = r/a₀, a₀ = 1 in atomic units
   Ref: NCERT Section 2.6.4; Griffiths, Introduction to Quantum Mechanics,
        Table 4.7; Atkins' Physical Chemistry, Table 9A.1               */

function R(id: OrbitalId, rho: number): number {
  switch (id) {
    case '1s': return 2 * Math.exp(-rho);
    case '2s': return (1 / Math.sqrt(8)) * (2 - rho) * Math.exp(-rho / 2);
    case '2p': return (1 / Math.sqrt(24)) * rho * Math.exp(-rho / 2);
    case '3s': return (2 / (81 * Math.sqrt(3))) * (27 - 18 * rho + 2 * rho * rho) * Math.exp(-rho / 3);
    case '3p': return (8 / (27 * Math.sqrt(6))) * (6 - rho) * rho * Math.exp(-rho / 3);
    case '3d': return (4 / (81 * Math.sqrt(30))) * rho * rho * Math.exp(-rho / 3);
  }
}

/* Radial Distribution Function: P(r) = 4π r² [R(r)]²
   Source: NCERT Section 2.6.4, Eq. relating radial probability to R(r) */

function computeCurve(id: OrbitalId): { r: number; p: number }[] {
  const pts: { r: number; p: number }[] = [];
  const dr = R_MAX / NUM_POINTS;
  for (let i = 0; i <= NUM_POINTS; i++) {
    const r = 0.01 + i * dr;
    const Rr = R(id, r);
    const p = 4 * Math.PI * r * r * Rr * Rr;
    pts.push({ r, p });
  }
  return pts;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function RadialDistributionSim() {
  const [selected, setSelected] = useState<Set<OrbitalId>>(new Set(['1s']));
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  /* Compute curves only when selection changes */
  const curves = useMemo(() => {
    const map = new Map<OrbitalId, { r: number; p: number }[]>();
    for (const id of selected) map.set(id, computeCurve(id));
    return map;
  }, [selected]);

  /* Global peak for normalization — each curve normalized independently
     so the tallest peak reaches ~80% chart height */
  const normalizedPaths = useMemo(() => {
    const result: { id: OrbitalId; points: string; peakSvg: [number, number]; peakR: number }[] = [];
    for (const [id, pts] of curves) {
      const maxP = Math.max(...pts.map(p => p.p));
      const scale = maxP > 0 ? 0.8 / maxP : 1;
      const svgPts = pts.map(({ r, p }) => {
        const sx = PAD.left + (r / R_MAX) * CW;
        const sy = PAD.top + CH - (p * scale) * CH;
        return `${sx.toFixed(2)},${sy.toFixed(2)}`;
      });
      // Find peak
      let peakIdx = 0;
      for (let i = 1; i < pts.length; i++) {
        if (pts[i].p > pts[peakIdx].p) peakIdx = i;
      }
      const peakR = pts[peakIdx].r;
      const peakSvgX = PAD.left + (peakR / R_MAX) * CW;
      const peakSvgY = PAD.top + CH - (pts[peakIdx].p * scale) * CH;
      result.push({ id, points: svgPts.join(' '), peakSvg: [peakSvgX, peakSvgY], peakR });
    }
    return result;
  }, [curves]);

  /* Toggle orbital */
  const toggle = useCallback((id: OrbitalId) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  /* Mouse tracking for crosshair */
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    if (mx >= PAD.left && mx <= W - PAD.right) setHoverX(mx);
    else setHoverX(null);
  }, []);

  const hoverR = hoverX !== null ? ((hoverX - PAD.left) / CW) * R_MAX : null;

  /* Hover values for each visible orbital */
  const hoverValues = useMemo(() => {
    if (hoverR === null) return [];
    return Array.from(selected).map(id => {
      const Rr = R(id, hoverR);
      const p = 4 * Math.PI * hoverR * hoverR * Rr * Rr;
      return { id, p };
    });
  }, [hoverR, selected]);

  /* Grid lines */
  const xTicks = [0, 5, 10, 15, 20, 25];
  const yFractions = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div style={{
      background: '#050a14',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, marginBottom: 4 }}>
          Radial Probability Distribution
        </h3>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
          P(r) = 4&pi;r&sup2;[R(r)]&sup2; for hydrogen orbitals &mdash; toggle orbitals to compare
        </p>
      </div>

      {/* Orbital selector */}
      <div style={{
        background: '#0d1117',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
        padding: '10px 14px',
        marginBottom: 16,
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginRight: 4 }}>
          Orbitals
        </span>
        {ALL_IDS.map(id => {
          const active = selected.has(id);
          const meta = ORBITALS[id];
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              style={{
                background: active ? meta.color + '22' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${active ? meta.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 8,
                padding: '5px 14px',
                color: active ? meta.color : '#475569',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {id}
            </button>
          );
        })}
      </div>

      {/* SVG Chart */}
      <div style={{
        background: 'radial-gradient(circle at center, #1e204a 0%, #050614 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
      }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', minHeight: 320, display: 'block' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          {/* Grid lines */}
          {xTicks.map(v => {
            const x = PAD.left + (v / R_MAX) * CW;
            return (
              <line key={`gx-${v}`} x1={x} y1={PAD.top} x2={x} y2={PAD.top + CH}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            );
          })}
          {yFractions.map((f, i) => {
            const y = PAD.top + CH * (1 - f);
            return (
              <line key={`gy-${i}`} x1={PAD.left} y1={y} x2={PAD.left + CW} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            );
          })}

          {/* Axes */}
          <line x1={PAD.left} y1={PAD.top + CH} x2={PAD.left + CW} y2={PAD.top + CH}
            stroke="#475569" strokeWidth={1.5} />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + CH}
            stroke="#475569" strokeWidth={1.5} />

          {/* X-axis ticks & labels */}
          {xTicks.map(v => {
            const x = PAD.left + (v / R_MAX) * CW;
            return (
              <g key={`xt-${v}`}>
                <line x1={x} y1={PAD.top + CH} x2={x} y2={PAD.top + CH + 6} stroke="#475569" strokeWidth={1} />
                <text x={x} y={PAD.top + CH + 20} textAnchor="middle" fill="#94a3b8" fontSize={11}>{v}</text>
              </g>
            );
          })}
          <text x={PAD.left + CW / 2} y={H - 6} textAnchor="middle" fill="#94a3b8" fontSize={12} fontWeight={600}>
            r / a&#x2080;
          </text>

          {/* Y-axis label */}
          <text x={16} y={PAD.top + CH / 2} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}
            transform={`rotate(-90, 16, ${PAD.top + CH / 2})`}>
            4&pi;r&sup2;R&sup2;(r)
          </text>

          {/* Radial node lines (dashed vertical) */}
          {normalizedPaths.map(({ id }) => {
            const meta = ORBITALS[id];
            return meta.radialNodes.map((nr, ni) => {
              const x = PAD.left + (nr / R_MAX) * CW;
              return (
                <line key={`node-${id}-${ni}`} x1={x} y1={PAD.top} x2={x} y2={PAD.top + CH}
                  stroke={meta.color} strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
              );
            });
          })}

          {/* Curves */}
          {normalizedPaths.map(({ id, points }) => (
            <polyline key={`curve-${id}`} points={points}
              fill="none" stroke={ORBITALS[id].color} strokeWidth={2} opacity={0.9} />
          ))}

          {/* Peak dots & labels */}
          {normalizedPaths.map(({ id, peakSvg, peakR }) => {
            const meta = ORBITALS[id];
            return (
              <g key={`peak-${id}`}>
                {/* Glow */}
                <circle cx={peakSvg[0]} cy={peakSvg[1]} r={7} fill={meta.color} opacity={0.15} />
                <circle cx={peakSvg[0]} cy={peakSvg[1]} r={4} fill={meta.color} opacity={0.9} />
                {/* Label */}
                <text x={peakSvg[0] + 8} y={peakSvg[1] - 8} fill={meta.color} fontSize={10} fontWeight={600}>
                  r&#x2098;&#x209A; = {peakR.toFixed(peakR % 1 === 0 ? 0 : 2)}a&#x2080;
                </text>
              </g>
            );
          })}

          {/* Hover crosshair */}
          {hoverX !== null && (
            <>
              <line x1={hoverX} y1={PAD.top} x2={hoverX} y2={PAD.top + CH}
                stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeDasharray="3 3" />
              {/* Tooltip background */}
              <rect x={Math.min(hoverX + 10, W - 150)} y={PAD.top + 6} width={140}
                height={24 + hoverValues.length * 18} rx={6}
                fill="rgba(5,10,20,0.92)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
              <text x={Math.min(hoverX + 18, W - 142)} y={PAD.top + 22}
                fill="#94a3b8" fontSize={10} fontWeight={600}>
                r = {hoverR !== null ? hoverR.toFixed(2) : ''}a&#x2080;
              </text>
              {hoverValues.map(({ id, p }, i) => (
                <text key={`hv-${id}`}
                  x={Math.min(hoverX + 18, W - 142)} y={PAD.top + 40 + i * 18}
                  fill={ORBITALS[id].color} fontSize={10} fontWeight={600}>
                  {id}: P = {p.toFixed(4)}
                </text>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Info Panel */}
      {selected.size > 0 && (
        <div style={{
          background: '#0d1117',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10,
          padding: '12px 16px',
        }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8 }}>
            Selected Orbitals
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from(selected).sort().map(id => {
              const meta = ORBITALS[id];
              const nodeCount = meta.n - meta.l - 1;
              return (
                <div key={`info-${id}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13,
                  flexWrap: 'wrap',
                }}>
                  {/* Color dot */}
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: meta.color, flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 700, minWidth: 28 }}>{id}</span>
                  <span style={{ color: '#94a3b8' }}>
                    Radial nodes: {nodeCount} (n&minus;l&minus;1)
                  </span>
                  <span style={{ color: '#94a3b8' }}>
                    &middot; Peak at {meta.rMostProbable}a&#x2080;
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
