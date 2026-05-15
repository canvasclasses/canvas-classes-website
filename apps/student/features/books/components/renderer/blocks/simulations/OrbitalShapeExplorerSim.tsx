'use client';

// Orbital Shape Explorer — Interactive simulator for s, p, d orbital shapes
// Students select an orbital and see its 2D boundary surface diagram with nodal surfaces.
//
// Academic sources:
//   NCERT Chemistry Class 11, Chapter 2, Section 2.6.2 — Shapes of s, p, d orbitals
//   Radial nodes = n − l − 1 (Section 2.6.4)
//   Angular nodes = l

import { useState } from 'react';

/* ── Types & Data ─────────────────────────────────────────────────────── */

type OrbitalFamily = 's' | 'p' | 'd';

interface OrbitalInfo {
  key: string;
  label: string;
  n: number;
  l: number;
  ml: number;
  radialNodes: number;
  angularNodes: number;
  description: string;
}

const ORBITALS: Record<OrbitalFamily, OrbitalInfo[]> = {
  s: [
    { key: '1s', label: '1s', n: 1, l: 0, ml: 0, radialNodes: 0, angularNodes: 0,
      description: 'The 1s orbital is a spherical electron cloud with no nodes. Electron probability is maximum at the nucleus.' },
    { key: '2s', label: '2s', n: 2, l: 0, ml: 0, radialNodes: 1, angularNodes: 0,
      description: 'The 2s orbital has one radial node \u2014 a spherical shell where the probability of finding the electron drops to zero.' },
    { key: '3s', label: '3s', n: 3, l: 0, ml: 0, radialNodes: 2, angularNodes: 0,
      description: 'The 3s orbital has two radial nodes. Between them, the wave function changes sign, creating regions of zero electron density.' },
  ],
  p: [
    { key: '2px', label: '2p\u2093', n: 2, l: 1, ml: -1, radialNodes: 0, angularNodes: 1,
      description: 'The 2px orbital has a dumbbell shape with two lobes along the x-axis. A nodal plane passes through the nucleus in the yz-plane.' },
    { key: '2py', label: '2p\u1D67', n: 2, l: 1, ml: 0, radialNodes: 0, angularNodes: 1,
      description: 'The 2py orbital has a dumbbell shape with two lobes along the y-axis. A nodal plane passes through the nucleus in the xz-plane.' },
    { key: '2pz', label: '2p\u2098', n: 2, l: 1, ml: 1, radialNodes: 0, angularNodes: 1,
      description: 'The 2pz orbital has a dumbbell shape with two lobes along the z-axis. A nodal plane passes through the nucleus in the xy-plane.' },
  ],
  d: [
    { key: 'dxy', label: '3d\u2093\u1D67', n: 3, l: 2, ml: -2, radialNodes: 0, angularNodes: 2,
      description: 'The 3dxy orbital has four lobes lying between the x and y axes. Two nodal planes pass through the nucleus along the xz and yz planes.' },
    { key: 'dxz', label: '3d\u2093\u2098', n: 3, l: 2, ml: -1, radialNodes: 0, angularNodes: 2,
      description: 'The 3dxz orbital has four lobes lying between the x and z axes. Two nodal planes contain the y-axis.' },
    { key: 'dyz', label: '3d\u1D67\u2098', n: 3, l: 2, ml: 1, radialNodes: 0, angularNodes: 2,
      description: 'The 3dyz orbital has four lobes lying between the y and z axes. Two nodal planes contain the x-axis.' },
    { key: 'dx2y2', label: '3d(x\u00B2\u2212y\u00B2)', n: 3, l: 2, ml: 2, radialNodes: 0, angularNodes: 2,
      description: 'The 3d(x\u00B2\u2212y\u00B2) orbital has four lobes pointing along the x and y axes. Two nodal planes are at 45\u00B0 to the axes.' },
    { key: 'dz2', label: '3d(z\u00B2)', n: 3, l: 2, ml: 0, radialNodes: 0, angularNodes: 2,
      description: 'The 3dz\u00B2 orbital has a unique shape \u2014 two lobes along the z-axis with a donut-shaped ring (torus) in the xy-plane.' },
  ],
};

const FAMILIES: { key: OrbitalFamily; label: string }[] = [
  { key: 's', label: 's orbitals' },
  { key: 'p', label: 'p orbitals' },
  { key: 'd', label: 'd orbitals' },
];

/* ── SVG Drawing Helpers ──────────────────────────────────────────────── */

const COL = {
  indigo: '#818cf8',
  emerald: '#34d399',
  red: '#ef4444',
  amber: '#fbbf24',
  pink: '#f472b6',
  text: '#e2e8f0',
  muted: '#475569',
  node: '#94a3b8',
};

function AxisLabels({ cx, cy, show }: { cx: number; cy: number; show: boolean }) {
  if (!show) return null;
  const off = 140;
  const s: React.CSSProperties = { fontSize: 12, fill: COL.muted, fontFamily: 'system-ui', fontStyle: 'italic' };
  return (
    <g>
      <text x={cx + off} y={cy + 4} style={s}>x</text>
      <text x={cx - off - 6} y={cy + 4} style={s}>-x</text>
      <text x={cx - 4} y={cy - off + 4} style={s}>z</text>
      <text x={cx - 6} y={cy + off + 12} style={s}>-z</text>
      <text x={cx + off - 24} y={cy - off + 14} style={{ ...s, fontSize: 10 }}>y</text>
    </g>
  );
}

function NodalLabel({ x, y, text, show }: { x: number; y: number; text: string; show: boolean }) {
  if (!show) return null;
  return (
    <text x={x} y={y} style={{ fontSize: 10, fill: COL.node, fontFamily: 'system-ui', letterSpacing: '0.04em' }}>
      {text}
    </text>
  );
}

/* ── Orbital SVG renderers ────────────────────────────────────────────── */

function SOrbital({ orbital, showNodes, showAxes, cx, cy }: {
  orbital: OrbitalInfo; showNodes: boolean; showAxes: boolean; cx: number; cy: number;
}) {
  const radii = orbital.key === '1s' ? [70]
    : orbital.key === '2s' ? [90, 40]
    : [110, 70, 36];
  const outer = radii[0];
  const nodeRadii = radii.slice(1);

  return (
    <g>
      <AxisLabels cx={cx} cy={cy} show={showAxes} />
      <circle cx={cx} cy={cy} r={outer} fill={`${COL.indigo}26`} stroke={COL.indigo} strokeWidth={1.8} />
      {showNodes && nodeRadii.map((r, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={COL.node}
            strokeWidth={1.2} strokeDasharray="5 4" />
          <NodalLabel x={cx + r + 4} y={cy - 4} show={showNodes}
            text={nodeRadii.length === 1 ? 'radial node' : `node ${i + 1}`} />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={3} fill="white" />
    </g>
  );
}

function POrbital({ orbital, showNodes, showAxes, cx, cy }: {
  orbital: OrbitalInfo; showNodes: boolean; showAxes: boolean; cx: number; cy: number;
}) {
  // Rotation angles: px horizontal (0), py tilted 30 deg, pz vertical (90)
  const angle = orbital.key === '2px' ? 0 : orbital.key === '2py' ? -60 : -90;
  const rx = 34, ry = 60;
  const lobeOffset = 52;

  // Nodal plane perpendicular to lobe axis
  const nodePlaneAngle = angle + 90;
  const npRad = (nodePlaneAngle * Math.PI) / 180;
  const npLen = 80;

  return (
    <g>
      <AxisLabels cx={cx} cy={cy} show={showAxes} />
      <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
        {/* Positive lobe (right/top) */}
        <ellipse cx={cx + lobeOffset} cy={cy} rx={ry} ry={rx}
          fill={`${COL.emerald}33`} stroke={COL.emerald} strokeWidth={1.5} />
        <text x={cx + lobeOffset} y={cy - rx - 6}
          style={{ fontSize: 10, fill: COL.emerald, fontFamily: 'system-ui', textAnchor: 'middle' }}>+</text>
        {/* Negative lobe (left/bottom) */}
        <ellipse cx={cx - lobeOffset} cy={cy} rx={ry} ry={rx}
          fill={`${COL.red}26`} stroke={COL.red} strokeWidth={1.5} />
        <text x={cx - lobeOffset} y={cy - rx - 6}
          style={{ fontSize: 10, fill: COL.red, fontFamily: 'system-ui', textAnchor: 'middle' }}>&minus;</text>
      </g>
      {showNodes && (
        <g>
          <line
            x1={cx - npLen * Math.cos(npRad)} y1={cy - npLen * Math.sin(npRad)}
            x2={cx + npLen * Math.cos(npRad)} y2={cy + npLen * Math.sin(npRad)}
            stroke={COL.node} strokeWidth={1.2} strokeDasharray="5 4" />
          <NodalLabel x={cx + npLen * Math.cos(npRad) + 4}
            y={cy + npLen * Math.sin(npRad) - 4} text="nodal plane" show />
        </g>
      )}
      <circle cx={cx} cy={cy} r={3} fill="white" />
    </g>
  );
}

function DClover({ cx, cy, angle, showNodes }: {
  cx: number; cy: number; angle: number; showNodes: boolean;
}) {
  // Four-lobe clover rotated by angle
  const rx = 22, ry = 44, off = 36;
  const lobes = [
    { dx: off, dy: -off, phase: '+' },
    { dx: -off, dy: off, phase: '+' },
    { dx: off, dy: off, phase: '-' },
    { dx: -off, dy: -off, phase: '-' },
  ];
  const nodeLen = 90;
  return (
    <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
      {lobes.map((lb, i) => {
        const isPos = lb.phase === '+';
        const col = isPos ? COL.amber : COL.red;
        const lobeAngle = Math.atan2(lb.dy, lb.dx) * 180 / Math.PI;
        return (
          <g key={i} transform={`rotate(${lobeAngle}, ${cx}, ${cy})`}>
            <ellipse cx={cx + Math.sqrt(lb.dx ** 2 + lb.dy ** 2)} cy={cy}
              rx={ry} ry={rx} fill={`${col}${isPos ? '33' : '26'}`}
              stroke={col} strokeWidth={1.3} />
          </g>
        );
      })}
      {showNodes && (
        <>
          <line x1={cx - nodeLen} y1={cy} x2={cx + nodeLen} y2={cy}
            stroke={COL.node} strokeWidth={1} strokeDasharray="5 4" />
          <line x1={cx} y1={cy - nodeLen} x2={cx} y2={cy + nodeLen}
            stroke={COL.node} strokeWidth={1} strokeDasharray="5 4" />
        </>
      )}
    </g>
  );
}

function DOrbital({ orbital, showNodes, showAxes, cx, cy }: {
  orbital: OrbitalInfo; showNodes: boolean; showAxes: boolean; cx: number; cy: number;
}) {
  if (orbital.key === 'dz2') {
    // Special dz^2 shape: two lobes along z + equatorial torus
    const coneAngle = 54.7;
    const coneLen = 85;
    const radC = (a: number) => (a * Math.PI) / 180;
    return (
      <g>
        <AxisLabels cx={cx} cy={cy} show={showAxes} />
        {/* Torus belt (behind lobes) */}
        <ellipse cx={cx} cy={cy} rx={60} ry={16}
          fill={`${COL.red}20`} stroke={COL.red} strokeWidth={1.2} />
        {/* Top lobe */}
        <ellipse cx={cx} cy={cy - 55} rx={28} ry={50}
          fill={`${COL.amber}33`} stroke={COL.amber} strokeWidth={1.4} />
        <text x={cx} y={cy - 100} style={{ fontSize: 10, fill: COL.amber, fontFamily: 'system-ui', textAnchor: 'middle' }}>+</text>
        {/* Bottom lobe */}
        <ellipse cx={cx} cy={cy + 55} rx={28} ry={50}
          fill={`${COL.amber}33`} stroke={COL.amber} strokeWidth={1.4} />
        <text x={cx} y={cy + 112} style={{ fontSize: 10, fill: COL.amber, fontFamily: 'system-ui', textAnchor: 'middle' }}>+</text>
        {/* Nodal cone lines */}
        {showNodes && (
          <g>
            <line x1={cx} y1={cy}
              x2={cx + coneLen * Math.sin(radC(coneAngle))} y2={cy - coneLen * Math.cos(radC(coneAngle))}
              stroke={COL.node} strokeWidth={1} strokeDasharray="5 4" />
            <line x1={cx} y1={cy}
              x2={cx - coneLen * Math.sin(radC(coneAngle))} y2={cy - coneLen * Math.cos(radC(coneAngle))}
              stroke={COL.node} strokeWidth={1} strokeDasharray="5 4" />
            <line x1={cx} y1={cy}
              x2={cx + coneLen * Math.sin(radC(coneAngle))} y2={cy + coneLen * Math.cos(radC(coneAngle))}
              stroke={COL.node} strokeWidth={1} strokeDasharray="5 4" />
            <line x1={cx} y1={cy}
              x2={cx - coneLen * Math.sin(radC(coneAngle))} y2={cy + coneLen * Math.cos(radC(coneAngle))}
              stroke={COL.node} strokeWidth={1} strokeDasharray="5 4" />
            <NodalLabel x={cx + coneLen * Math.sin(radC(coneAngle)) + 4}
              y={cy - coneLen * Math.cos(radC(coneAngle)) + 2} text="nodal cone" show />
          </g>
        )}
        <circle cx={cx} cy={cy} r={3} fill="white" />
      </g>
    );
  }

  // Four-leaf clover d-orbitals
  const rotations: Record<string, number> = {
    dxy: 0, dxz: -90, dyz: -90, dx2y2: 45,
  };
  // dxz and dyz are in xz / yz plane — rotate about different visual axis
  // For 2D projection: dxy lies in xy-plane (rotate 0), dx2y2 rotated 45
  // dxz in xz-plane, dyz in yz-plane — we show them rotated for distinction
  const baseAngle = rotations[orbital.key] ?? 0;

  // For dxz, dyz we rotate the clover differently to show the different plane
  const extraRotate = orbital.key === 'dyz' ? 30 : 0;

  return (
    <g>
      <AxisLabels cx={cx} cy={cy} show={showAxes} />
      <DClover cx={cx} cy={cy} angle={baseAngle + extraRotate} showNodes={showNodes} />
      {showNodes && (
        <NodalLabel x={cx + 70} y={cy - 70} text="nodal planes" show />
      )}
      <circle cx={cx} cy={cy} r={3} fill="white" />
    </g>
  );
}

/* ── Main Component ───────────────────────────────────────────────────── */

export default function OrbitalShapeExplorerSim() {
  const [family, setFamily] = useState<OrbitalFamily>('s');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showNodes, setShowNodes] = useState(true);
  const [showAxes, setShowAxes] = useState(true);

  const orbitals = ORBITALS[family];
  const current = orbitals[Math.min(selectedIdx, orbitals.length - 1)];

  const handleFamilyChange = (f: OrbitalFamily) => {
    setFamily(f);
    setSelectedIdx(0);
  };

  const svgW = 360, svgH = 360;
  const cx = svgW / 2, cy = svgH / 2;

  return (
    <div style={{
      background: '#050a14', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui', color: COL.text, maxWidth: 520, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
        Orbital Shape Explorer
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {FAMILIES.map((f) => (
          <button key={f.key} onClick={() => handleFamilyChange(f.key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 20px', fontSize: 13, fontWeight: 600,
              color: family === f.key ? COL.indigo : '#94a3b8',
              borderBottom: family === f.key ? `2px solid ${COL.indigo}` : '2px solid transparent',
              transition: 'color 0.2s, border-color 0.2s',
              fontFamily: 'system-ui',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Sub-selector */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        {orbitals.map((o, i) => (
          <button key={o.key} onClick={() => setSelectedIdx(i)}
            style={{
              background: selectedIdx === i ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.04)',
              border: selectedIdx === i ? `1px solid ${COL.indigo}` : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
              color: selectedIdx === i ? COL.indigo : '#94a3b8',
              fontSize: 13, fontWeight: 600, fontFamily: 'system-ui',
              transition: 'all 0.2s',
            }}>
            {o.label}
          </button>
        ))}
      </div>

      {/* SVG Visualization */}
      <div style={{
        background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 12, marginBottom: 16,
      }}>
        <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`}
          style={{
            display: 'block', minHeight: 360, borderRadius: 16,
            background: 'radial-gradient(circle at center, #1e204a 0%, #050614 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
          {/* Faint crosshairs */}
          <line x1={cx} y1={20} x2={cx} y2={svgH - 20}
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
          <line x1={20} y1={cy} x2={svgW - 20} y2={cy}
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />

          {family === 's' && <SOrbital orbital={current} showNodes={showNodes} showAxes={showAxes} cx={cx} cy={cy} />}
          {family === 'p' && <POrbital orbital={current} showNodes={showNodes} showAxes={showAxes} cx={cx} cy={cy} />}
          {family === 'd' && <DOrbital orbital={current} showNodes={showNodes} showAxes={showAxes} cx={cx} cy={cy} />}
        </svg>
      </div>

      {/* Toggle Controls */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
        <button onClick={() => setShowNodes(!showNodes)}
          style={{
            background: showNodes ? 'rgba(148,163,184,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showNodes ? 'rgba(148,163,184,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
            color: showNodes ? COL.node : COL.muted, fontSize: 12, fontFamily: 'system-ui',
            transition: 'all 0.2s',
          }}>
          {showNodes ? '\u2611' : '\u2610'} Show nodal surfaces
        </button>
        <button onClick={() => setShowAxes(!showAxes)}
          style={{
            background: showAxes ? 'rgba(148,163,184,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showAxes ? 'rgba(148,163,184,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
            color: showAxes ? COL.node : COL.muted, fontSize: 12, fontFamily: 'system-ui',
            transition: 'all 0.2s',
          }}>
          {showAxes ? '\u2611' : '\u2610'} Show axis labels
        </button>
      </div>

      {/* Info Panel */}
      <div style={{
        background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: 16,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const,
          letterSpacing: '0.18em', color: '#94a3b8', marginBottom: 12,
        }}>
          Orbital Details
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 14 }}>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>Quantum numbers: </span>
            <span style={{ color: COL.indigo, fontWeight: 600 }}>n = {current.n}</span>
            <span style={{ color: '#94a3b8' }}>, </span>
            <span style={{ color: COL.emerald, fontWeight: 600 }}>l = {current.l}</span>
          </div>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>m</span>
            <sub style={{ color: '#94a3b8', fontSize: 10 }}>l</sub>
            <span style={{ color: '#94a3b8' }}> range: </span>
            <span style={{ color: COL.amber, fontWeight: 600 }}>
              {current.l === 0 ? '0' : `\u2212${current.l} to +${current.l}`}
            </span>
            <span style={{ color: '#94a3b8' }}>, current: </span>
            <span style={{ color: COL.amber, fontWeight: 600 }}>
              {current.ml > 0 ? `+${current.ml}` : current.ml}
            </span>
          </div>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>Radial nodes: </span>
            <span style={{ color: COL.pink, fontWeight: 600 }}>{current.radialNodes}</span>
            <span style={{ color: COL.muted, fontSize: 11 }}> (n \u2212 l \u2212 1)</span>
          </div>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>Angular nodes: </span>
            <span style={{ color: COL.pink, fontWeight: 600 }}>{current.angularNodes}</span>
            <span style={{ color: COL.muted, fontSize: 11 }}> (l)</span>
          </div>
        </div>

        <div style={{
          fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
          borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12,
        }}>
          {current.description}
        </div>
      </div>
    </div>
  );
}
