'use client';

// ══════════════════════════════════════════════════════════════════════════════
// PYRIDINE BASICITY HEAT MAP
// ══════════════════════════════════════════════════════════════════════════════
// Interactive pKa table for substituted pyridines
// Data source: Effects of Substitution on Pyridine Basicity
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';

// ── DATA ──────────────────────────────────────────────────────────────────────

interface PyridineData {
  substituent: string;
  position2: number;
  position3: number;
  position4: number;
}

// pKa values from the table (higher pKa = more basic)
const PYRIDINE_DATA: PyridineData[] = [
  { substituent: 'H', position2: 5.2, position3: 5.2, position4: 5.2 }, // baseline
  { substituent: 'Me', position2: 6.0, position3: 5.7, position4: 6.0 },
  { substituent: 'ᵗBu', position2: 5.8, position3: 5.9, position4: 6.0 },
  { substituent: 'NH₂', position2: 6.9, position3: 6.1, position4: 9.2 },
  { substituent: 'NHAc', position2: 4.1, position3: 4.5, position4: 5.9 },
  { substituent: 'OMe', position2: 3.3, position3: 4.9, position4: 6.6 },
  { substituent: 'SMe', position2: 3.6, position3: 4.4, position4: 6.0 },
  { substituent: 'Cl', position2: 0.7, position3: 2.8, position4: 3.8 },
  { substituent: 'Ph', position2: 4.5, position3: 4.8, position4: 5.5 },
  { substituent: 'vinyl', position2: 4.8, position3: 4.8, position4: 5.5 },
  { substituent: 'CN', position2: -0.3, position3: 1.4, position4: 1.9 },
  { substituent: 'NO₂', position2: -2.6, position3: 0.6, position4: 1.6 },
  { substituent: 'CH(OH)₂', position2: 3.8, position3: 3.8, position4: 4.7 },
];

type HL = { row: PyridineData; col: 2 | 3 | 4 } | null;

// Color scale: higher pKa (more basic) = green/blue, lower pKa (less basic) = orange/yellow
// Matches carboxylic acid heat map style - lighter, more subtle
function pkaColor(pka: number): string {
  if (pka >= 7) return 'rgba(52,211,153,0.45)'; // Strong base - green
  if (pka >= 5.5) return 'rgba(96,165,250,0.4)'; // Moderate base - blue
  if (pka >= 3.5) return 'rgba(168,162,158,0.35)'; // Weak base - gray
  if (pka >= 1.5) return 'rgba(251,191,36,0.4)'; // Very weak - yellow
  if (pka >= 0) return 'rgba(251,146,60,0.45)'; // Extremely weak - orange
  return 'rgba(251,146,60,0.5)'; // Negative pKa - orange
}

// ── STRUCTURE VIEWER ──────────────────────────────────────────────────────────

function PyridineStructureViewer({ hl }: { hl: HL }) {
  if (!hl) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
        Click any cell to view structure
      </div>
    );
  }

  const { row, col } = hl;
  const pka = col === 2 ? row.position2 : col === 3 ? row.position3 : row.position4;
  const posLabel = col === 2 ? '2-position' : col === 3 ? '3-position' : '4-position';
  const color = pkaColor(pka);

  // Pyridine ring structure
  const w = 140, h = 140, cx = 70, cy = 70, r = 35;
  
  // Hexagonal ring points (nitrogen at top)
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = -Math.PI / 2 + k * Math.PI / 3;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });

  const bonds: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const a = pts[i], b = pts[(i + 1) % 6];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const idist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
    const inx = (cx - mx) / idist, iny = (cy - my) / idist;
    
    bonds.push(
      <line 
        key={`b${i}`} 
        x1={(a[0] + dx * .09).toFixed(1)} 
        y1={(a[1] + dy * .09).toFixed(1)} 
        x2={(b[0] - dx * .09).toFixed(1)} 
        y2={(b[1] - dy * .09).toFixed(1)} 
        stroke="rgba(255,255,255,0.65)" 
        strokeWidth="2" 
      />
    );
    
    if (i % 2 === 0) {
      bonds.push(
        <line 
          key={`d${i}`} 
          x1={(a[0] + dx * .18 + inx * 4).toFixed(1)} 
          y1={(a[1] + dy * .18 + iny * 4).toFixed(1)} 
          x2={(b[0] - dx * .18 + inx * 4).toFixed(1)} 
          y2={(b[1] - dy * .18 + iny * 4).toFixed(1)} 
          stroke="rgba(255,255,255,0.65)" 
          strokeWidth="2" 
        />
      );
    }
  }

  // Nitrogen at position 1 (top)
  const [n1x, n1y] = pts[0];
  
  // Substituent position
  const posIdx = col === 2 ? 1 : col === 3 ? 2 : col === 4 ? 3 : -1;
  const [subx, suby] = pts[posIdx];
  const odx = subx - cx, ody = suby - cy, olen = Math.sqrt(odx ** 2 + ody ** 2);
  const ux = odx / olen, uy = ody / olen;
  const lx = subx + ux * 28, ly = suby + uy * 28;
  const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Structure */}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', display: 'block' }}>
        {bonds}
        
        {/* Nitrogen at top */}
        <text x={n1x.toFixed(1)} y={(n1y - 8).toFixed(1)} textAnchor="middle" fontSize="16" fontWeight="700" fill="#60a5fa">N</text>
        
        {/* Substituent */}
        {row.substituent !== 'H' && (
          <>
            <line x1={(subx + ux * 4).toFixed(1)} y1={(suby + uy * 4).toFixed(1)} x2={(subx + ux * 22).toFixed(1)} y2={(suby + uy * 22).toFixed(1)} stroke={color} strokeWidth="2.5" />
            <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={ta} dominantBaseline="middle" fontSize="14" fontWeight="700" fill={color}>{row.substituent}</text>
          </>
        )}
      </svg>
      
      {/* pKa value */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 6, letterSpacing: '.04em' }}>{posLabel} · {row.substituent}</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>pKₐ =</span>
          <span style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color, lineHeight: 1 }}>{pka.toFixed(1)}</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          {pka >= 5.2 ? 'More basic than pyridine' : pka < 5.2 ? 'Less basic than pyridine' : 'Baseline (pyridine)'}
        </div>
      </div>
      
      {/* Explanation */}
      <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', width: '100%', maxWidth: 280 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Effect</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
          {getEffectExplanation(row.substituent, col, pka)}
        </div>
      </div>
    </div>
  );
}

function getEffectExplanation(sub: string, pos: 2 | 3 | 4, pka: number): string {
  // EDG examples
  if (sub === 'NH₂') {
    if (pos === 4) return 'Strong resonance donation at 4-position → highly basic (pKa 9.2)';
    if (pos === 2) return 'Resonance + inductive effect, but steric hindrance reduces basicity';
    return 'Resonance blocked at 3-position → mostly inductive effect';
  }
  if (sub === 'Me' || sub === 'ᵗBu') {
    return 'Weak +I effect increases electron density on nitrogen → slightly more basic';
  }
  if (sub === 'OMe') {
    if (pos === 4) return 'Resonance donation dominates → more basic (pKa 6.6)';
    if (pos === 2) return 'Inductive withdrawal (−I) dominates → less basic (pKa 3.3)';
    return 'Mixed inductive effect → moderate basicity';
  }
  
  // EWG examples
  if (sub === 'NO₂') {
    if (pos === 2) return 'Extremely strong −I and −R effects → almost non-basic (pKa −2.6)';
    return 'Strong electron withdrawal → very weak base';
  }
  if (sub === 'CN') {
    if (pos === 2) return 'Strong −I effect at 2-position → non-basic (pKa −0.3)';
    return 'Electron withdrawal reduces basicity significantly';
  }
  if (sub === 'Cl') {
    if (pos === 2) return 'Strong −I effect (closest to N) → very weak base (pKa 0.7)';
    return 'Electronegativity withdraws electrons → reduced basicity';
  }
  
  return 'Substituent effect on nitrogen lone pair availability';
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function PyridineBasicityHeatMap() {
  const [hl, setHl] = useState<HL>(null);

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>
          Interactive Pyridine Basicity Table
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          Click any cell to see the structure and effect. Higher pKa = more basic. Baseline: unsubstituted pyridine (pKa ≈ 5.2).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'center' }} className="pyridine-heat-map-container">
        {/* Structure viewer */}
        <div style={{ display: 'flex', justifyContent: 'center' }} className="pyridine-structure-col">
          <PyridineStructureViewer hl={hl} />
        </div>

        {/* Heat map table */}
        <div style={{ overflowX: 'auto' }} className="pyridine-table-col">
          <style jsx>{`
            @media (max-width: 768px) {
              .pyridine-heat-map-container {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
              .pyridine-structure-col {
                order: 2;
              }
              .pyridine-table-col {
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
                  2-position
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  3-position
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  4-position
                </th>
              </tr>
            </thead>
            <tbody>
              {PYRIDINE_DATA.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                    {row.substituent}
                  </td>
                  {([2, 3, 4] as const).map(pos => {
                    const val = pos === 2 ? row.position2 : pos === 3 ? row.position3 : row.position4;
                    const isActive = hl?.row === row && hl?.col === pos;
                    return (
                      <td
                        key={pos}
                        onClick={() => setHl({ row, col: pos })}
                        style={{
                          padding: '10px 12px',
                          textAlign: 'center',
                          fontSize: 14,
                          fontWeight: 700,
                          fontFamily: 'var(--font-geist-mono), monospace',
                          color: '#fff',
                          background: pkaColor(val),
                          cursor: 'pointer',
                          border: isActive ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {val.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
