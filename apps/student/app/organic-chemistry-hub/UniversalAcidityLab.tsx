'use client';

import { useState, useMemo } from 'react';
import {
  type AcidFamily,
  type Position,
  type PkaDataPoint,
  getPka,
  getAvailableSubstituents,
  getCompoundName,
  PHENOL_PKA_DATA,
  BENZOIC_ACID_PKA_DATA,
  ANILINE_PKA_DATA,
  DATA_STATS,
} from './acidity-universal-data';
import {
  calculatePkaHammett,
  getHammettExplanation,
  type HammettCalculationResult,
} from '@/lib/hammettCalculator';
import {
  OrthoEffectSection,
} from './AcidityEducationCards.v2';
import AcidityHeatMap from './AcidityHeatMap';

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface CompoundSlot {
  acidFamily: AcidFamily;
  substituent: string;
  position: Position | null;
}

interface CompoundData extends CompoundSlot {
  pKa: number;
  dataSource: 'EXPERIMENTAL' | 'CALCULATED';
  reference: string;
  compoundName: string;
  hammettResult?: HammettCalculationResult;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const SLOT_COLORS = ['#818cf8', '#f59e0b', '#34d399', '#f472b6'];

const ACID_FAMILIES: { id: AcidFamily; label: string; description: string }[] = [
  { id: 'phenol', label: 'Phenol', description: 'C₆H₅OH derivatives (pKa of –OH)' },
  { id: 'benzoic', label: 'Benzoic Acid', description: 'C₆H₅COOH derivatives (pKa of –COOH)' },
  { id: 'aniline', label: 'Aniline', description: 'C₆H₅NH₂ derivatives (pKa of –NH₃⁺)' },
  { id: 'aliphatic', label: 'Aliphatic Acid', description: 'Y–CH₂–COOH derivatives (inductive only)' },
];

// Substituent groups organized by type
const SUBSTITUENT_GROUPS = {
  ewg: [
    { id: 'NO2', symbol: 'NO₂', name: 'Nitro' },
    { id: 'CN', symbol: 'CN', name: 'Cyano' },
    { id: 'CF3', symbol: 'CF₃', name: 'Trifluoromethyl' },
    { id: 'COOH', symbol: 'COOH', name: 'Carboxyl' },
    { id: 'CHO', symbol: 'CHO', name: 'Aldehyde' },
    { id: 'Cl', symbol: 'Cl', name: 'Chloro' },
    { id: 'Br', symbol: 'Br', name: 'Bromo' },
    { id: 'I', symbol: 'I', name: 'Iodo' },
    { id: 'F', symbol: 'F', name: 'Fluoro' },
  ],
  edg: [
    { id: 'NH2', symbol: 'NH₂', name: 'Amino' },
    { id: 'OH', symbol: 'OH', name: 'Hydroxyl' },
    { id: 'OCH3', symbol: 'OCH₃', name: 'Methoxy' },
    { id: 'CH3', symbol: 'CH₃', name: 'Methyl' },
    { id: 'C2H5', symbol: 'C₂H₅', name: 'Ethyl' },
    { id: 'C(CH3)3', symbol: 'C(CH₃)₃', name: 'tert-Butyl' },
  ],
  neutral: [
    { id: 'H', symbol: 'H', name: 'None' },
    { id: 'C6H5', symbol: 'C₆H₅', name: 'Phenyl' },
  ],
};

const ALL_SUBSTITUENTS = [
  ...SUBSTITUENT_GROUPS.ewg,
  ...SUBSTITUENT_GROUPS.edg,
  ...SUBSTITUENT_GROUPS.neutral,
];

// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

function getCompoundData(slot: CompoundSlot): CompoundData {
  const { acidFamily, substituent, position } = slot;
  
  // Try to get experimental data first
  const experimental = getPka(acidFamily, substituent, position);
  
  if (experimental) {
    return {
      ...slot,
      pKa: experimental.pKa,
      dataSource: 'EXPERIMENTAL',
      reference: experimental.reference,
      compoundName: getCompoundName(acidFamily, substituent, position),
    };
  }
  
  // Fall back to Hammett calculation
  const hammett = calculatePkaHammett(acidFamily, substituent, position);
  
  if (hammett) {
    return {
      ...slot,
      pKa: hammett.pKa,
      dataSource: 'CALCULATED',
      reference: 'Hammett equation',
      compoundName: getCompoundName(acidFamily, substituent, position),
      hammettResult: hammett,
    };
  }
  
  // Default fallback (should rarely happen)
  return {
    ...slot,
    pKa: acidFamily === 'phenol' ? 9.99 : acidFamily === 'benzoic' ? 4.204 : 4.87,
    dataSource: 'EXPERIMENTAL',
    reference: 'Base compound',
    compoundName: getCompoundName(acidFamily, 'H', null),
  };
}

function acidLabel(pKa: number, acidFamily: AcidFamily): { txt: string; col: string } {
  if (acidFamily === 'aniline') {
    // For aniline, higher pKa of conjugate acid = stronger base
    if (pKa < 1) return { txt: 'Very Weak Base', col: '#fb7185' };
    if (pKa < 3) return { txt: 'Weak Base', col: '#fb923c' };
    if (pKa < 5) return { txt: 'Moderate Base', col: '#4ade80' };
    return { txt: 'Strong Base', col: '#60a5fa' };
  } else {
    // For acids, lower pKa = stronger acid
    if (pKa < 3) return { txt: 'Strong Acid', col: '#fb7185' };
    if (pKa < 5) return { txt: 'Moderate Acid', col: '#fb923c' };
    if (pKa < 9) return { txt: 'Weak Acid', col: '#4ade80' };
    return { txt: 'Very Weak Acid', col: '#60a5fa' };
  }
}

// ── STRUCTURE SVG COMPONENT ───────────────────────────────────────────────────

function StructureSVG({
  acidFamily,
  substituent,
  position,
  color,
}: {
  acidFamily: AcidFamily;
  substituent: string;
  position: Position | null;
  color: string;
}) {
  const subSymbol = ALL_SUBSTITUENTS.find(s => s.id === substituent)?.symbol || substituent;
  
  // Aliphatic structure: Y–CH₂–COOH (linear)
  if (acidFamily === 'aliphatic') {
    const w = 200, h = 100;
    // Calculate substituent width dynamically (approximate 10px per character for safety)
    const subWidth = substituent === 'H' ? 0 : subSymbol.length * 10;
    const startX = 20;
    const bondStart = startX + subWidth + (substituent === 'H' ? 0 : 8);
    
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
        {/* Substituent */}
        {substituent !== 'H' && (
          <text x={startX} y="52" fontSize="15" fontWeight="700" fill={color} dominantBaseline="middle">
            {subSymbol}
          </text>
        )}
        
        {/* Bond to CH₂ */}
        <line x1={bondStart} y1="52" x2={bondStart + 18} y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        
        {/* CH₂ */}
        <text x={bondStart + 22} y="52" fontSize="14" fill="rgba(255,255,255,0.75)" dominantBaseline="middle">
          CH₂
        </text>
        
        {/* Bond to COOH */}
        <line x1={bondStart + 54} y1="52" x2={bondStart + 72} y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        
        {/* COOH */}
        <text x={bondStart + 76} y="52" fontSize="15" fontWeight="700" fill="rgba(255,255,255,0.9)" dominantBaseline="middle">
          COOH
        </text>
        
        {/* Note */}
        <text x={w / 2} y="82" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.25)">
          inductive only — no resonance
        </text>
      </svg>
    );
  }
  
  // Aromatic structure: Benzene ring
  const w = 140, h = 160, cx = 70, cy = 80, r = 32, bondOff = 4;
  
  // Benzene ring vertices
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = -Math.PI / 2 + k * Math.PI / 3;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
  
  // Draw bonds
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
        x1={(a[0] + dx * 0.09).toFixed(1)}
        y1={(a[1] + dy * 0.09).toFixed(1)}
        x2={(b[0] - dx * 0.09).toFixed(1)}
        y2={(b[1] - dy * 0.09).toFixed(1)}
        stroke="rgba(255,255,255,0.72)"
        strokeWidth="1.8"
      />
    );
    
    if (i % 2 === 0) {
      bonds.push(
        <line
          key={`d${i}`}
          x1={(a[0] + dx * 0.18 + inx * bondOff).toFixed(1)}
          y1={(a[1] + dy * 0.18 + iny * bondOff).toFixed(1)}
          x2={(b[0] - dx * 0.18 + inx * bondOff).toFixed(1)}
          y2={(b[1] - dy * 0.18 + iny * bondOff).toFixed(1)}
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.8"
        />
      );
    }
  }
  
  // Acidic group at position 0 (top)
  const [v0x, v0y] = pts[0];
  const acidGroupSymbol = 
    acidFamily === 'phenol' ? 'OH' :
    acidFamily === 'benzoic' ? 'COOH' :
    'NH₂';
  
  // Substituent position
  const posIdx = position === 'ortho' ? 1 : position === 'meta' ? 2 : position === 'para' ? 3 : null;
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
      {bonds}
      
      {/* Acidic group */}
      <line x1={v0x} y1={v0y - 2} x2={v0x} y2={v0y - 18} stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
      <text x={v0x} y={v0y - 24} textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(255,255,255,0.9)">
        {acidGroupSymbol}
      </text>
      
      {/* Substituent */}
      {posIdx !== null && substituent !== 'H' && (
        <>
          {(() => {
            const [vsx, vsy] = pts[posIdx];
            const odx = vsx - cx, ody = vsy - cy;
            const olen = Math.sqrt(odx ** 2 + ody ** 2);
            const ux = odx / olen, uy = ody / olen;
            const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
            
            return (
              <>
                <line
                  x1={(vsx + ux * 4).toFixed(1)}
                  y1={(vsy + uy * 4).toFixed(1)}
                  x2={(vsx + ux * 22).toFixed(1)}
                  y2={(vsy + uy * 22).toFixed(1)}
                  stroke={color}
                  strokeWidth="1.8"
                />
                <text
                  x={(vsx + ux * 32).toFixed(1)}
                  y={(vsy + uy * 32 + 4).toFixed(1)}
                  textAnchor={ta}
                  fontSize="14"
                  fontWeight="700"
                  fill={color}
                >
                  {subSymbol}
                </text>
              </>
            );
          })()}
        </>
      )}
      
      {/* Position indicators */}
      {['ortho', 'meta', 'para'].map((p, idx) => {
        const vi = idx + 1;
        const [vx, vy] = pts[vi];
        const isActive = position === p;
        return (
          <circle
            key={p}
            cx={vx}
            cy={vy}
            r={isActive ? 5.5 : 3.5}
            fill={isActive ? color : 'rgba(255,255,255,0.12)'}
            stroke={isActive ? 'none' : 'rgba(255,255,255,0.25)'}
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

// ── COMPOUND SLOT TILE ────────────────────────────────────────────────────────

function CompoundSlotTile({
  slot,
  slotIdx,
  isActive,
  onActivate,
  onUpdateSlot,
}: {
  slot: CompoundSlot;
  slotIdx: number;
  isActive: boolean;
  onActivate: () => void;
  onUpdateSlot: (updates: Partial<CompoundSlot>) => void;
}) {
  const col = SLOT_COLORS[slotIdx];
  const data = getCompoundData(slot);
  const acL = acidLabel(data.pKa, slot.acidFamily);
  
  return (
    <div
      onClick={onActivate}
      style={{
        borderRadius: 10,
        padding: '11px 11px 9px',
        background: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isActive ? col : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer',
        transition: 'all .2s',
      }}
    >
      {/* Header */}
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: isActive ? col : 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
        Compound {slotIdx + 1}
      </div>
      
      {/* Compound name and pKa */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.92)', lineHeight: 1.2, marginBottom: 2 }}>
            {data.compoundName}
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: acL.col }}>{acL.txt}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.35, letterSpacing: '.05em', marginBottom: 1 }}>pKₐ</div>
          <div className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: isActive ? col : 'rgba(255,255,255,0.6)', lineHeight: 1 }}>
            {data.pKa.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Data quality badge */}
      <div style={{ marginBottom: 8 }}>
        {data.dataSource === 'EXPERIMENTAL' ? (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
            🟢 EXPERIMENTAL
          </span>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}>
            🟡 CALCULATED
          </span>
        )}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>{data.reference}</span>
      </div>
      
      {/* Structure visualization */}
      <StructureSVG
        acidFamily={slot.acidFamily}
        substituent={slot.substituent}
        position={slot.position}
        color={col}
      />
      
      {/* Position selector (only for aromatic acids) */}
      {slot.acidFamily !== 'aliphatic' && (
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {(['ortho', 'meta', 'para'] as Position[]).map(p => {
            const isOn = slot.position === p;
            return (
              <button
                key={p}
                onClick={e => {
                  e.stopPropagation();
                  onUpdateSlot({ position: p });
                }}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: 5,
                  fontSize: 12.5,
                  fontWeight: isOn ? 700 : 500,
                  cursor: 'pointer',
                  letterSpacing: '.02em',
                  border: `1px solid ${isOn ? col : 'rgba(255,255,255,0.12)'}`,
                  background: isOn ? col : 'rgba(255,255,255,0.03)',
                  color: isOn ? '#1a1a1a' : 'rgba(255,255,255,0.4)',
                  transition: 'all .15s',
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1, 4)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── SUBSTITUENT SELECTOR ──────────────────────────────────────────────────────

function SubstituentSelector({
  activeSubstituent,
  onSelect,
}: {
  activeSubstituent: string;
  onSelect: (id: string) => void;
}) {
  const typeStyles = {
    ewg: { border: 'rgba(251, 146, 60, 0.25)', col: 'rgba(251, 146, 60, 0.65)', selBg: 'rgba(251, 146, 60, 0.15)', selBorder: 'rgba(251, 146, 60, 0.5)', selCol: '#fb923c' },
    edg: { border: 'rgba(16, 185, 129, 0.25)', col: 'rgba(16, 185, 129, 0.65)', selBg: 'rgba(16, 185, 129, 0.15)', selBorder: 'rgba(16, 185, 129, 0.5)', selCol: '#10b981' },
    neutral: { border: 'rgba(99, 102, 241, 0.25)', col: 'rgba(99, 102, 241, 0.65)', selBg: 'rgba(99, 102, 241, 0.15)', selBorder: 'rgba(99, 102, 241, 0.5)', selCol: '#818cf8' },
  };
  
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
        Substituent · <span style={{ color: '#fb923c' }}>● EWG</span> <span style={{ color: '#10b981' }}>● EDG</span> <span style={{ color: '#6366f1' }}>● Neutral</span>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ALL_SUBSTITUENTS.map(sub => {
          const type = SUBSTITUENT_GROUPS.ewg.includes(sub) ? 'ewg' : SUBSTITUENT_GROUPS.edg.includes(sub) ? 'edg' : 'neutral';
          const ts = typeStyles[type];
          const isSel = sub.id === activeSubstituent;
          
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12.5,
                cursor: 'pointer',
                fontWeight: isSel ? 700 : 500,
                letterSpacing: '.02em',
                border: `1px solid ${isSel ? ts.selBorder : ts.border}`,
                background: isSel ? ts.selBg : 'rgba(255,255,255,0.03)',
                color: isSel ? ts.selCol : ts.col,
                transition: 'all .2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {sub.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── COMPARISON CHART ──────────────────────────────────────────────────────────

function ComparisonChart({ slots }: { slots: CompoundSlot[] }) {
  const dataPoints = slots.map((slot, i) => ({
    ...getCompoundData(slot),
    slotIdx: i,
    color: SLOT_COLORS[i],
  }));
  
  const pkas = dataPoints.map(d => d.pKa);
  const pMin = Math.min(...pkas);
  const pMax = Math.max(...pkas);
  
  return (
    <div className="mt-6 overflow-x-auto pb-2">
      <div className="min-w-[500px]">
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
          pKₐ Comparison
        </div>
        
        {dataPoints.map((d, idx) => {
          const acL = acidLabel(d.pKa, d.acidFamily);
          const w = pMax === pMin ? 60 : Math.round(30 + 60 * (pMax - d.pKa) / (pMax - pMin));
          
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: idx < dataPoints.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.3)', minWidth: 24 }}>
                #{d.slotIdx + 1}
              </span>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)', minWidth: 140, flexShrink: 0 }}>
                {d.compoundName}
              </span>
              <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${w}%`,
                    background: `linear-gradient(90deg, ${d.color}66, ${d.color}dd)`,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    transition: 'all .6s cubic-bezier(.34,1.56,.64,1)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                    {d.pKa.toFixed(2)}
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 20,
                  whiteSpace: 'nowrap',
                  minWidth: 110,
                  textAlign: 'center',
                  color: acL.col,
                  background: `${acL.col}15`,
                  border: `1px solid ${acL.col}25`,
                }}
              >
                {acL.txt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function UniversalAcidityLab() {
  const [acidFamily, setAcidFamily] = useState<AcidFamily>('phenol');
  const [slots, setSlots] = useState<CompoundSlot[]>([
    { acidFamily: 'phenol', substituent: 'NO2', position: 'para' },
    { acidFamily: 'phenol', substituent: 'Cl', position: 'ortho' },
    { acidFamily: 'phenol', substituent: 'CH3', position: 'meta' },
    { acidFamily: 'phenol', substituent: 'H', position: null },
  ]);
  const [activeSlot, setActiveSlot] = useState(0);
  
  // Update all slots when acid family changes
  const handleAcidFamilyChange = (newFamily: AcidFamily) => {
    setAcidFamily(newFamily);
    setSlots(prev => prev.map(slot => ({
      ...slot,
      acidFamily: newFamily,
      // Aliphatic acids don't have positions (no ortho/meta/para)
      position: newFamily === 'aliphatic' ? null : (slot.position || 'para'),
    })));
  };
  
  const handleUpdateSlot = (slotIdx: number, updates: Partial<CompoundSlot>) => {
    setSlots(prev => prev.map((slot, i) => i === slotIdx ? { ...slot, ...updates } : slot));
  };
  
  const activeSlotData = getCompoundData(slots[activeSlot]);
  
  return (
    <div>
      {/* Acid family selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
          Acid Family
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ACID_FAMILIES.map(fam => {
            const isActive = acidFamily === fam.id;
            return (
              <button
                key={fam.id}
                onClick={() => handleAcidFamilyChange(fam.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  background: isActive ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                  transition: 'all .2s',
                }}
              >
                <div>{fam.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{fam.description}</div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Substituent selector */}
      <SubstituentSelector
        activeSubstituent={slots[activeSlot].substituent}
        onSelect={sub => handleUpdateSlot(activeSlot, { substituent: sub, position: sub === 'H' ? null : slots[activeSlot].position || 'para' })}
      />
      
      {/* Compound slots */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {slots.map((slot, i) => (
          <CompoundSlotTile
            key={i}
            slot={slot}
            slotIdx={i}
            isActive={activeSlot === i}
            onActivate={() => setActiveSlot(i)}
            onUpdateSlot={updates => handleUpdateSlot(i, updates)}
          />
        ))}
      </div>
      
      {/* Comparison chart */}
      <ComparisonChart slots={slots} />
      
      {/* Detail panel for active compound */}
      <div style={{ marginTop: 20, padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
          Compound {activeSlot + 1} Details
        </div>
        
        <div style={{ fontSize: 18, fontWeight: 700, color: SLOT_COLORS[activeSlot], marginBottom: 8 }}>
          {activeSlotData.compoundName}
        </div>
        
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
          pKₐ = {activeSlotData.pKa.toFixed(2)} · {activeSlotData.reference}
        </div>
        
        {activeSlotData.hammettResult && (
          <div style={{ padding: 14, borderRadius: 8, background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', marginTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(251,146,60,0.8)', marginBottom: 6 }}>
              Hammett Calculation
            </div>
            <pre style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-geist-mono), monospace' }}>
              {getHammettExplanation(activeSlotData.hammettResult, activeSlotData.acidFamily)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Educational Content Section */}
      <div style={{ marginTop: 48, paddingTop: 32, borderTop: '2px solid rgba(255,255,255,0.08)' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
            📊 Acidity Patterns & Trends
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Understanding the factors that influence acid strength: electronic effects, geometry, and structural features.
          </p>
        </div>
        
        {/* Heat map table */}
        <AcidityHeatMap />
        
        {/* Vertical layout for educational sections */}
        <div style={{ marginTop: 48 }}>
          <OrthoEffectSection />
        </div>
      </div>
    </div>
  );
}
