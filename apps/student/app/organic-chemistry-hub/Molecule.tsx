'use client';

import React from 'react';

// ── Reusable skeletal-benzene molecule (design-handoff "Molecule" component) ────
// Ported 1:1 from the Direction 1a handoff (Molecule.dc.html renderVals geometry).
// Draws a pointy-top benzene ring with a top core group (OH/COOH/NH₂) and an
// optional substituent at the ortho / meta / para vertex, tinted by electronic tone.

export type MoleculeTone = 'ewg' | 'edg' | 'neutral';
export type MoleculePosition = 'none' | 'ortho' | 'meta' | 'para';

export const MOLECULE_TONE_COLORS: Record<MoleculeTone, string> = {
  ewg: '#E4A845',
  edg: '#46B98A',
  neutral: '#8B93A7',
};

const MOLECULE_FONT = "var(--font-ibm-plex-sans), 'IBM Plex Sans', system-ui, sans-serif";

// Render a chemical label, dropping digits to subscripts (e.g. NO2 → NO₂).
function renderChem(t: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let k = 0;
  let prevSub = false;
  for (const ch of String(t)) {
    if (/[0-9]/.test(ch)) {
      out.push(<tspan key={k++} dy={5} fontSize={12}>{ch}</tspan>);
      prevSub = true;
    } else if (prevSub) {
      out.push(<tspan key={k++} dy={-5}>{ch}</tspan>);
      prevSub = false;
    } else {
      out.push(<tspan key={k++}>{ch}</tspan>);
    }
  }
  return out;
}

export default function Molecule({
  core = 'OH',
  sub = '',
  position = 'para',
  tone = 'neutral',
  stroke = '#c2cad6',
  size = 130,
}: {
  core?: string;
  sub?: string;
  position?: MoleculePosition;
  tone?: MoleculeTone;
  stroke?: string;
  size?: number;
}) {
  const toneColor = MOLECULE_TONE_COLORS[tone] ?? MOLECULE_TONE_COLORS.neutral;

  // Pointy-top hexagon, centered. Vertex i at angle 90 + 60·i degrees.
  const cx = 100, cy = 112, r = 46;
  const ang = (i: number) => (90 + 60 * i) * Math.PI / 180;
  const V = (i: number) => ({ x: cx + r * Math.cos(ang(i)), y: cy - r * Math.sin(ang(i)) });
  const v = [0, 1, 2, 3, 4, 5].map(V);
  // v[0]=top, v[1]=UL, v[2]=LL, v[3]=bottom, v[4]=LR, v[5]=UR

  const els: React.ReactNode[] = [];
  const line = (x1: number, y1: number, x2: number, y2: number, w: number, col: string, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={w} strokeLinecap="round" />
  );

  // Ring edges
  for (let i = 0; i < 6; i++) {
    const a = v[i], b = v[(i + 1) % 6];
    els.push(line(a.x, a.y, b.x, b.y, 2, stroke, 'e' + i));
  }

  // Inner double-bond lines on edges 0-1, 2-3, 4-5 (offset toward center)
  const dbl: [number, number][] = [[0, 1], [2, 3], [4, 5]];
  dbl.forEach((pair, k) => {
    const a = v[pair[0]], b = v[pair[1]];
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    let nx = -uy, ny = ux;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    if ((cx - mx) * nx + (cy - my) * ny < 0) { nx = -nx; ny = -ny; }
    const off = 7, sh = len * 0.2;
    els.push(line(a.x + nx * off + ux * sh, a.y + ny * off + uy * sh, b.x + nx * off - ux * sh, b.y + ny * off - uy * sh, 1.6, stroke, 'd' + k));
  });

  // Core group bond (from top vertex up) + label — bond lengthened 30%
  els.push(line(v[0].x, v[0].y, v[0].x, v[0].y - 20.8, 2, stroke, 'cb'));
  els.push(
    <text key="ct" x={v[0].x} y={v[0].y - 26.8} textAnchor="middle" fontSize={19} fontWeight={600} fill={stroke} fontFamily={MOLECULE_FONT}>
      {renderChem(core)}
    </text>
  );

  // Substituent — bond lengthened 30% (16→20.8, 9→11.7); labels shifted out to match
  if (sub && position !== 'none') {
    const base = position === 'para' ? v[3] : position === 'ortho' ? v[5] : v[4];
    let ex: number, ey: number, lx: number, ly: number;
    let anchor: 'start' | 'middle';
    if (position === 'para') { ex = base.x; ey = base.y + 20.8; lx = base.x; ly = base.y + 38.8; anchor = 'middle'; }
    else if (position === 'ortho') { ex = base.x + 20.8; ey = base.y - 11.7; lx = base.x + 28.8; ly = base.y - 15.7; anchor = 'start'; }
    else { ex = base.x + 20.8; ey = base.y + 11.7; lx = base.x + 28.8; ly = base.y + 18.7; anchor = 'start'; }
    els.push(line(base.x, base.y, ex, ey, 2, toneColor, 'sb'));
    els.push(<circle key="sd" cx={(base.x + ex) / 2} cy={(base.y + ey) / 2} r={3.4} fill={toneColor} />);
    els.push(
      <text key="st" x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize={17} fontWeight={600} fill={toneColor} fontFamily={MOLECULE_FONT}>
        {renderChem(sub)}
      </text>
    );
  }

  return (
    <svg width={size} height={size * (220 / 200)} viewBox="0 0 200 220" style={{ display: 'block', overflow: 'visible' }}>
      {els}
    </svg>
  );
}
