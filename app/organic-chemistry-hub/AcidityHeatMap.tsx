'use client';

import { useState } from 'react';
import { CA_DATA, type CaRow } from './acidity-lab-data2';

type SortCol = 'y' | 'acetic' | 'ortho' | 'meta' | 'para';
type HL = { y: string; col: SortCol } | null;

// Heat map background color based on pKa value
function heatBg(v: number | null, sel: boolean): string {
  if (v === null) return 'rgba(255,255,255,0.03)';
  const t = Math.max(0, Math.min(1, (v - 2.0) / 3.0));
  let r: number, g: number, b: number;

  if (t < 0.5) {
    const s = t / 0.5;
    r = Math.round(235 + s * 20);
    g = Math.round(95 + s * 95);
    b = Math.round(95 - s * 55);
  } else {
    const s = (t - 0.5) / 0.5;
    r = Math.round(255 - s * 175);
    g = Math.round(190 - s * 30);
    b = Math.round(40 + s * 160);
  }

  return `rgba(${r},${g},${b},${sel ? 0.95 : 0.75})`;
}

function heatText(v: number | null): string {
  if (v === null) return 'rgba(255,255,255,0.2)';
  return '#ffffff';
}

// Structure viewer for selected cell
function StructureViewer({ hl }: { hl: HL }) {
  if (!hl) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'rgba(255,255,255,0.22)', fontSize: 14, textAlign: 'center', lineHeight: 2 }}>
      Click any cell in the table<br />to see the structure
    </div>
  );

  const row = CA_DATA.find(r => r.y === hl.y)!;
  const typeCol = row.type === 'ewg' ? '#e57373' : row.type === 'edg' ? '#34c759' : '#5856d6';
  const v = hl.col === 'y' ? null : row[hl.col as keyof CaRow] as number | null;
  const isAcetic = hl.col === 'acetic';
  const posLabel = isAcetic ? 'Aliphatic' : hl.col.charAt(0).toUpperCase() + hl.col.slice(1);
  const mech = row.type === 'ewg' ? 'EWG — stabilises carboxylate anion, increases acidity' : row.type === 'edg' ? 'EDG — destabilises carboxylate anion, decreases acidity' : 'Neutral — no significant electronic effect';

  if (isAcetic) {
    const subWidth = row.y.length * 8;
    const startX = 50;
    const bondStart = startX + subWidth + 4;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {/* Structure */}
        <svg width="180" height="60" viewBox="0 0 180 60" style={{ overflow: 'visible', display: 'block' }}>
          <text x={startX} y="30" fontSize="14" fontWeight="700" fill={typeCol} dominantBaseline="middle">{row.y}</text>
          <line x1={bondStart} y1="30" x2={bondStart + 16} y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
          <text x={bondStart + 20} y="30" fontSize="13" fill="rgba(255,255,255,0.75)" dominantBaseline="middle">CH₂</text>
          <line x1={bondStart + 48} y1="30" x2={bondStart + 64} y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
          <text x={bondStart + 68} y="30" fontSize="14" fontWeight="600" fill="rgba(255,255,255,0.9)" dominantBaseline="middle">COOH</text>
        </svg>
        
        {/* pKa value */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: typeCol, marginBottom: 4, letterSpacing: '.04em' }}>{posLabel} · {row.y}</div>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>pKₐ =</span>
            <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-geist-mono),monospace', color: '#fff', lineHeight: 1 }}>{v !== null ? (v as number).toFixed(2) : '—'}</span>
          </div>
        </div>
        
        {/* Explanation */}
        <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Mechanism</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{mech}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontStyle: 'italic' }}>Inductive effect only — no resonance stabilization</div>
        </div>
      </div>
    );
  }

  // Benzoic acid structure (benzene ring) - smaller size
  const cx = 90, cy = 70, r = 32, bo = 3.5;
  const pts = Array.from({ length: 6 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 3; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number]; });
  const bonds: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const a = pts[i], b = pts[(i + 1) % 6], dx = b[0] - a[0], dy = b[1] - a[1];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const id2 = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
    const inx = (cx - mx) / id2, iny = (cy - my) / id2;
    bonds.push(<line key={`b${i}`} x1={(a[0] + dx * .09).toFixed(1)} y1={(a[1] + dy * .09).toFixed(1)} x2={(b[0] - dx * .09).toFixed(1)} y2={(b[1] - dy * .09).toFixed(1)} stroke="rgba(255,255,255,0.72)" strokeWidth="1.8" />);
    if (i % 2 === 0) bonds.push(<line key={`d${i}`} x1={(a[0] + dx * .18 + inx * bo).toFixed(1)} y1={(a[1] + dy * .18 + iny * bo).toFixed(1)} x2={(b[0] - dx * .18 + inx * bo).toFixed(1)} y2={(b[1] - dy * .18 + iny * bo).toFixed(1)} stroke="rgba(255,255,255,0.72)" strokeWidth="1.8" />);
  }
  const [v0x, v0y] = pts[0];
  const pi = hl.col === 'ortho' ? 1 : hl.col === 'meta' ? 2 : 3;
  const [vsx, vsy] = pts[pi];
  const odx = vsx - cx, ody = vsy - cy, olen = Math.sqrt(odx ** 2 + ody ** 2);
  const ux = odx / olen, uy = ody / olen;
  const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
  const lx = vsx + ux * 32, ly = vsy + uy * 32;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Structure */}
      <svg width="180" height="120" viewBox="0 0 180 120" style={{ overflow: 'visible', display: 'block' }}>
        {bonds}
        <line x1={v0x.toFixed(1)} y1={(v0y - 2).toFixed(1)} x2={v0x.toFixed(1)} y2={(v0y - 22).toFixed(1)} stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" />
        <text x={v0x.toFixed(1)} y={(v0y - 30).toFixed(1)} textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(255,255,255,0.92)">COOH</text>
        <line x1={(vsx + ux * 4).toFixed(1)} y1={(vsy + uy * 4).toFixed(1)} x2={(vsx + ux * 24).toFixed(1)} y2={(vsy + uy * 24).toFixed(1)} stroke={typeCol} strokeWidth="2" />
        <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={ta} dominantBaseline="middle" fontSize="14" fontWeight="700" fill={typeCol}>{row.y}</text>
      </svg>
      
      {/* pKa value */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: typeCol, marginBottom: 4, letterSpacing: '.04em' }}>{posLabel} · {row.y}</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>pKₐ =</span>
          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-geist-mono),monospace', color: '#fff', lineHeight: 1 }}>{v !== null ? (v as number).toFixed(2) : '—'}</span>
        </div>
      </div>
      
      {/* Explanation */}
      <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Mechanism</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{mech}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontStyle: 'italic' }}>Resonance stabilization of carboxylate anion through benzene ring</div>
      </div>
    </div>
  );
}

export default function AcidityHeatMap() {
  const [hl, setHl] = useState<HL>(null);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>
          Interactive pKa Table
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          Click any cell to see the structure and mechanism. Color intensity indicates acidity (red = strong acid, blue = weak acid).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'center' }} className="heat-map-container">
        {/* Structure viewer - no box, center-aligned */}
        <div style={{ display: 'flex', justifyContent: 'center' }} className="structure-viewer-col">
          <StructureViewer hl={hl} />
        </div>

        {/* Heat map table */}
        <div style={{ overflowX: 'auto' }} className="heat-map-table-col">
          <style jsx>{`
            @media (max-width: 768px) {
              .heat-map-container {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
              .structure-viewer-col {
                order: 2;
              }
              .heat-map-table-col {
                order: 1;
              }
            }
          `}</style>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Substituent
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Aliphatic
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Ortho
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Meta
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Para
                </th>
              </tr>
            </thead>
            <tbody>
              {CA_DATA.map((row, idx) => {
                const typeCol = row.type === 'ewg' ? '#e57373' : row.type === 'edg' ? '#34c759' : '#5856d6';
                return (
                  <tr key={idx}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: typeCol, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {row.y}
                    </td>
                    {(['acetic', 'ortho', 'meta', 'para'] as const).map(col => {
                      const v = row[col] as number | null;
                      const isSelected = hl?.y === row.y && hl?.col === col;
                      return (
                        <td
                          key={col}
                          onClick={() => setHl({ y: row.y, col })}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontFamily: 'var(--font-geist-mono), monospace',
                            cursor: 'pointer',
                            background: heatBg(v, isSelected),
                            color: heatText(v),
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            border: isSelected ? '2px solid rgba(255,255,255,0.5)' : 'none',
                            transition: 'all .15s',
                          }}
                        >
                          {v !== null ? v.toFixed(2) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
