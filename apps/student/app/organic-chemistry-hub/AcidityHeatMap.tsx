'use client';

import { useState } from 'react';
import { CA_DATA, type CaRow } from './acidity-lab-data2';
import Molecule, { MOLECULE_TONE_COLORS, type MoleculeTone, type MoleculePosition } from './Molecule';

type SortCol = 'y' | 'acetic' | 'ortho' | 'meta' | 'para';
type HL = { y: string; col: SortCol } | null;

// ── Design tokens (handoff 1a — Slate & Blue) ───────────────────────────────────
const SANS = "var(--font-ibm-plex-sans), 'IBM Plex Sans', system-ui, sans-serif";
const MONO = "var(--font-geist-mono), 'Geist Mono', monospace";
const SURFACE_WELL = '#10151C';
const SURFACE_PANEL = '#12181F';
const BORDER = 'rgba(255,255,255,.07)';
const BORDER_SUBTLE = 'rgba(255,255,255,.05)';
const TXT_PRIMARY = '#E6EAF0';
const TXT_SECONDARY = '#8a94a3';
const TXT_MUTED = '#5e6774';

// ── Heat scale: strong acid (red) → amber → weak acid (blue). ───────────────────
// A warm-red → amber → periwinkle-blue ramp; the blue endpoint keeps a moderate
// green channel so the amber→blue transition passes through warm taupe, never the
// muddy olive-green the old scale produced.
const HEAT_STOPS: [number, number, number][] = [
  [216, 80, 78],   // strong  (#D8504E)
  [228, 168, 69],  // mid amber (#E4A845)
  [95, 130, 210],  // weak    (#5F82D2)
];

function heatRGB(v: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, (v - 2.0) / 3.0));
  const [a, b, c] = HEAT_STOPS;
  const lerp = (x: number, y: number, s: number) => Math.round(x + (y - x) * s);
  if (t < 0.5) {
    const s = t / 0.5;
    return [lerp(a[0], b[0], s), lerp(a[1], b[1], s), lerp(a[2], b[2], s)];
  }
  const s = (t - 0.5) / 0.5;
  return [lerp(b[0], c[0], s), lerp(b[1], c[1], s), lerp(b[2], c[2], s)];
}

function heatBg(v: number | null, sel: boolean): string {
  if (v === null) return 'rgba(255,255,255,0.03)';
  const [r, g, b] = heatRGB(v);
  return `rgba(${r},${g},${b},${sel ? 0.96 : 0.82})`;
}

function heatText(v: number | null): string {
  if (v === null) return 'rgba(255,255,255,0.2)';
  const [r, g, b] = heatRGB(v);
  const L = 0.299 * r + 0.587 * g + 0.114 * b;
  return L > 165 ? '#10151C' : '#ffffff'; // dark ink on the brightest amber cells
}

function toneColor(type: string): string {
  return MOLECULE_TONE_COLORS[type as MoleculeTone] ?? MOLECULE_TONE_COLORS.neutral;
}

// ── Linear aliphatic structure (Y–CH₂–COOH) ─────────────────────────────────────
function AliphaticStructure({ label, color }: { label: string; color: string }) {
  const subWidth = label === 'H' ? 0 : label.length * 9;
  const startX = 30;
  const bondStart = startX + subWidth + (label === 'H' ? 0 : 6);
  return (
    <svg width="190" height="64" viewBox="0 0 190 64" style={{ overflow: 'visible', display: 'block' }}>
      {label !== 'H' && (
        <text x={startX} y="32" fontSize="15" fontWeight="600" fill={color} dominantBaseline="middle" fontFamily={SANS}>{label}</text>
      )}
      <line x1={bondStart} y1="32" x2={bondStart + 18} y2="32" stroke="#c2cad6" strokeWidth="2" strokeLinecap="round" />
      <text x={bondStart + 22} y="32" fontSize="14" fill="#c2cad6" dominantBaseline="middle" fontFamily={SANS}>CH₂</text>
      <line x1={bondStart + 54} y1="32" x2={bondStart + 72} y2="32" stroke="#c2cad6" strokeWidth="2" strokeLinecap="round" />
      <text x={bondStart + 76} y="32" fontSize="15" fontWeight="600" fill="#c2cad6" dominantBaseline="middle" fontFamily={SANS}>COOH</text>
    </svg>
  );
}

// ── Structure viewer for the selected cell ──────────────────────────────────────
function StructureViewer({ hl }: { hl: HL }) {
  if (!hl) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 210, color: 'rgba(255,255,255,0.24)', font: `400 13px ${SANS}`, textAlign: 'center', lineHeight: 2 }}>
        Click any cell in the table<br />to see the structure
      </div>
    );
  }

  const row = CA_DATA.find(r => r.y === hl.y)!;
  const tCol = toneColor(row.type);
  const v = hl.col === 'y' ? null : (row[hl.col as keyof CaRow] as number | null);
  const isAcetic = hl.col === 'acetic';
  const posLabel = isAcetic ? 'Aliphatic' : hl.col.charAt(0).toUpperCase() + hl.col.slice(1);
  const mech = row.type === 'ewg'
    ? 'EWG — stabilises the carboxylate anion, increases acidity'
    : row.type === 'edg'
      ? 'EDG — destabilises the carboxylate anion, decreases acidity'
      : 'Neutral — no significant electronic effect';
  const note = isAcetic
    ? 'Inductive effect only — no resonance stabilisation'
    : 'Resonance stabilisation of the carboxylate anion through the benzene ring';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
      {/* Structure — framed inset well */}
      <div style={{ width: '100%', background: SURFACE_WELL, border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 12, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isAcetic ? (
          <AliphaticStructure label={row.y} color={tCol} />
        ) : (
          <Molecule core="COOH" sub={row.y === 'H' ? '' : row.y} position={hl.col as MoleculePosition} tone={row.type as MoleculeTone} stroke="#c2cad6" size={150} />
        )}
      </div>

      {/* pKa value */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ font: `500 11px ${MONO}`, letterSpacing: '.08em', textTransform: 'uppercase', color: tCol, marginBottom: 5 }}>{posLabel} · {row.y}</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ font: `500 14px ${SANS}`, color: 'rgba(255,255,255,0.4)' }}>pKₐ =</span>
          <span style={{ font: `600 26px ${MONO}`, color: TXT_PRIMARY, lineHeight: 1, letterSpacing: '-.02em' }}>{v !== null ? (v as number).toFixed(2) : '—'}</span>
        </div>
      </div>

      {/* Mechanism */}
      <div style={{ padding: '12px 14px', borderRadius: 10, background: SURFACE_PANEL, border: `1px solid ${BORDER}`, width: '100%' }}>
        <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.12em', textTransform: 'uppercase', color: TXT_MUTED, marginBottom: 6 }}>Mechanism</div>
        <div style={{ font: `400 12.5px ${SANS}`, color: '#97a0ae', lineHeight: 1.55 }}>{mech}</div>
        <div style={{ font: `400 11.5px ${SANS}`, color: TXT_MUTED, marginTop: 6, fontStyle: 'italic' }}>{note}</div>
      </div>
    </div>
  );
}

export default function AcidityHeatMap() {
  const [hl, setHl] = useState<HL>(null);

  const thStyle: React.CSSProperties = {
    padding: '10px 12px',
    textAlign: 'center',
    font: `600 10px ${MONO}`,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: TXT_MUTED,
    borderBottom: `1px solid ${BORDER}`,
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ font: `600 16px ${SANS}`, color: TXT_PRIMARY, margin: '0 0 6px' }}>Interactive pKₐ Table</h3>
        <p style={{ font: `400 12.5px ${SANS}`, color: TXT_SECONDARY, lineHeight: 1.6, margin: 0 }}>
          Click any cell to see the structure and mechanism. Colour indicates acidity — <span style={{ color: '#E37E79', fontWeight: 600 }}>red = strong acid</span>, <span style={{ color: '#7FA0E0', fontWeight: 600 }}>blue = weak acid</span>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '288px 1fr', gap: 32, alignItems: 'center' }} className="heat-map-container">
        {/* Structure viewer */}
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
              .structure-viewer-col { order: 2; }
              .heat-map-table-col { order: 1; }
            }
          `}</style>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 3px', fontSize: 13, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: 'left' }}>Substituent</th>
                <th style={thStyle}>Aliphatic</th>
                <th style={thStyle}>Ortho</th>
                <th style={thStyle}>Meta</th>
                <th style={thStyle}>Para</th>
              </tr>
            </thead>
            <tbody>
              {CA_DATA.map((row, idx) => {
                const tCol = toneColor(row.type);
                return (
                  <tr key={idx}>
                    <td style={{ padding: '8px 12px', font: `600 12.5px ${MONO}`, color: tCol }}>
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
                            padding: '9px 12px',
                            textAlign: 'center',
                            font: `600 13px ${MONO}`,
                            cursor: 'pointer',
                            background: heatBg(v, isSelected),
                            color: heatText(v),
                            boxShadow: isSelected ? 'inset 0 0 0 2px rgba(255,255,255,0.85)' : 'none',
                            transition: 'background .15s, box-shadow .15s',
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
