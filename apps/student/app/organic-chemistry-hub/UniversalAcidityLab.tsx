'use client';

import { useState } from 'react';
import {
  type AcidFamily,
  type Position,
  getPka,
  getCompoundName,
} from './acidity-universal-data';
import {
  calculatePkaHammett,
  getHammettExplanation,
  type HammettCalculationResult,
} from '@/features/simulations/lib/hammettCalculator';
import {
  OrthoEffectSection,
} from './AcidityEducationCards.v2';
import AcidityHeatMap from './AcidityHeatMap';
import Molecule, { type MoleculeTone, type MoleculePosition } from './Molecule';

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

// ── DESIGN TOKENS (handoff Direction 1a — "Slate & Blue") ───────────────────────

const ACCENT = '#4E8CFF';                     // active nav / selected borders / primary
const ACCENT_TINT = 'rgba(78,140,255,.12)';   // selected surface tint
const ACCENT_TEXT = '#cfe0ff';                // selected compound / family name

const SURFACE_CARD = '#161C24';
const SURFACE_CARD_SEL = '#1B232E';
const SURFACE_WELL = '#10151C';               // molecule inset
const SURFACE_PANEL = '#12181F';              // comparison / detail panels
const BORDER = 'rgba(255,255,255,.07)';
const BORDER_SUBTLE = 'rgba(255,255,255,.05)';
const DIVIDER = 'rgba(255,255,255,.06)';

const TXT_PRIMARY = '#E6EAF0';
const TXT_SECONDARY = '#8a94a3';
const TXT_MUTED = '#5e6774';
const TXT_FAINT = '#6b7482';

const SANS = "var(--font-ibm-plex-sans), 'IBM Plex Sans', system-ui, sans-serif";
const MONO = "var(--font-geist-mono), 'Geist Mono', monospace";

// Semantic tone: colour encodes the substituent's electronic character.
const TYPE_COLORS: Record<MoleculeTone, string> = {
  ewg: '#E4A845',
  edg: '#46B98A',
  neutral: '#8B93A7',
};
const TYPE_GRADIENTS: Record<MoleculeTone, string> = {
  ewg: 'linear-gradient(90deg,#E0932E,#EEC468)',
  edg: 'linear-gradient(90deg,#2FA378,#5FD3AD)',
  neutral: 'linear-gradient(90deg,#5B76C4,#8E7BE0)',
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const ACID_FAMILIES: { id: AcidFamily; label: string; formula: string }[] = [
  { id: 'phenol', label: 'Phenol', formula: 'C₆H₅OH derivatives' },
  { id: 'benzoic', label: 'Benzoic acid', formula: 'C₆H₅COOH derivatives' },
  { id: 'aniline', label: 'Aniline', formula: 'C₆H₅NH₂ derivatives' },
  { id: 'aliphatic', label: 'Aliphatic', formula: 'Y–CH₂–COOH' },
];

// Substituent groups organized by electronic type
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

function subType(id: string): MoleculeTone {
  if (SUBSTITUENT_GROUPS.ewg.some(s => s.id === id)) return 'ewg';
  if (SUBSTITUENT_GROUPS.edg.some(s => s.id === id)) return 'edg';
  return 'neutral';
}

function coreSymbol(fam: AcidFamily): string {
  return fam === 'phenol' ? 'OH' : fam === 'benzoic' ? 'COOH' : fam === 'aniline' ? 'NH₂' : 'COOH';
}

function subSymbolOf(id: string): string {
  return ALL_SUBSTITUENTS.find(s => s.id === id)?.symbol || id;
}

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
    if (pKa < 1) return { txt: 'Very weak base', col: '#E4A845' };
    if (pKa < 3) return { txt: 'Weak base', col: '#E4A845' };
    if (pKa < 5) return { txt: 'Moderate base', col: '#46B98A' };
    return { txt: 'Strong base', col: '#7FA8E0' };
  } else {
    // For acids, lower pKa = stronger acid
    if (pKa < 3) return { txt: 'Strong acid', col: '#E4707A' };
    if (pKa < 5) return { txt: 'Moderate acid', col: '#E4A845' };
    if (pKa < 9) return { txt: 'Weak acid', col: '#E4A845' };
    return { txt: 'Very weak', col: '#7FA8E0' };
  }
}

// ── ALIPHATIC STRUCTURE (Y–CH₂–COOH) ────────────────────────────────────────────
// The parametric Molecule handles aromatic rings; aliphatic acids are linear.

function AliphaticStructure({ substituent, color, size = 130 }: { substituent: string; color: string; size?: number }) {
  const subSymbol = subSymbolOf(substituent);
  const w = 200, h = 100;
  const subWidth = substituent === 'H' ? 0 : subSymbol.length * 10;
  const startX = 20;
  const bondStart = startX + subWidth + (substituent === 'H' ? 0 : 8);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={size} height={size * (h / w)} style={{ display: 'block', overflow: 'visible' }}>
      {substituent !== 'H' && (
        <text x={startX} y="50" fontSize="15" fontWeight="600" fill={color} dominantBaseline="middle" fontFamily={SANS}>
          {subSymbol}
        </text>
      )}
      <line x1={bondStart} y1="50" x2={bondStart + 18} y2="50" stroke="#c2cad6" strokeWidth="2" strokeLinecap="round" />
      <text x={bondStart + 22} y="50" fontSize="14" fill="#c2cad6" dominantBaseline="middle" fontFamily={SANS}>CH₂</text>
      <line x1={bondStart + 54} y1="50" x2={bondStart + 72} y2="50" stroke="#c2cad6" strokeWidth="2" strokeLinecap="round" />
      <text x={bondStart + 76} y="50" fontSize="15" fontWeight="600" fill="#c2cad6" dominantBaseline="middle" fontFamily={SANS}>COOH</text>
    </svg>
  );
}

// Renders the correct structure for a slot (aromatic ring or aliphatic chain).
function StructureFor({ slot, size }: { slot: CompoundSlot; size: number }) {
  const tone = subType(slot.substituent);
  if (slot.acidFamily === 'aliphatic') {
    return <AliphaticStructure substituent={slot.substituent} color={TYPE_COLORS[tone]} size={size} />;
  }
  const isNone = slot.substituent === 'H' || slot.position === null;
  return (
    <Molecule
      core={coreSymbol(slot.acidFamily)}
      sub={isNone ? '' : subSymbolOf(slot.substituent)}
      position={(slot.position ?? 'none') as MoleculePosition}
      tone={tone}
      stroke="#c2cad6"
      size={size}
    />
  );
}

// ── COMPOUND CARD ───────────────────────────────────────────────────────────────

function classChipStyle(col: string): React.CSSProperties {
  return {
    font: `600 9.5px ${MONO}`,
    color: col,
    background: `${col}1f`,
    borderRadius: 5,
    padding: '2px 7px',
    letterSpacing: '.03em',
    whiteSpace: 'nowrap',
  };
}

function posBtnStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    textAlign: 'center',
    font: `${active ? 600 : 500} 10px ${MONO}`,
    textTransform: 'uppercase',
    color: active ? ACCENT_TEXT : TXT_MUTED,
    background: active ? 'rgba(78,140,255,.18)' : 'rgba(255,255,255,.03)',
    border: `1px solid ${active ? 'rgba(78,140,255,.4)' : 'rgba(255,255,255,.06)'}`,
    borderRadius: 6,
    padding: '4px 0',
    cursor: 'pointer',
    transition: 'all .15s',
  };
}

function CompoundCard({
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
  const data = getCompoundData(slot);
  const acL = acidLabel(data.pKa, slot.acidFamily);
  const tone = subType(slot.substituent);

  return (
    <div
      onClick={onActivate}
      title={`${data.dataSource === 'EXPERIMENTAL' ? 'Experimental' : 'Calculated'} · ${data.reference}`}
      style={{
        background: isActive ? SURFACE_CARD_SEL : SURFACE_CARD,
        border: `1px solid ${isActive ? 'rgba(78,140,255,.55)' : BORDER}`,
        borderRadius: 12,
        padding: 14,
        cursor: 'pointer',
        transition: 'border-color .15s',
        boxShadow: isActive ? '0 0 0 1px rgba(78,140,255,.25)' : 'none',
      }}
    >
      {/* Header: label + tone dot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ font: `600 9.5px ${MONO}`, letterSpacing: '.1em', color: TXT_MUTED }}>
          COMPOUND {slotIdx + 1}
        </span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[tone] }} />
      </div>

      {/* Name */}
      <div style={{ font: `600 15px ${SANS}`, color: TXT_PRIMARY, marginBottom: 3 }}>
        {data.compoundName}
      </div>

      {/* Class chip + pKa */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={classChipStyle(acL.col)}>{acL.txt}</span>
        <span style={{ font: `600 22px ${MONO}`, color: TXT_PRIMARY, letterSpacing: '-.02em' }}>
          {data.pKa.toFixed(2)}
        </span>
      </div>

      {/* Molecule well */}
      <div style={{ background: SURFACE_WELL, border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 9, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
        <StructureFor slot={slot} size={130} />
      </div>

      {/* Position toggle (aromatic only) */}
      {slot.acidFamily !== 'aliphatic' && (
        <div style={{ display: 'flex', gap: 4 }}>
          {(['ortho', 'meta', 'para'] as Position[]).map(p => (
            <button
              key={p}
              title={p.charAt(0).toUpperCase() + p.slice(1)}
              onClick={e => { e.stopPropagation(); onUpdateSlot({ position: p }); }}
              style={posBtnStyle(slot.position === p)}
            >
              {p.charAt(0)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ACID FAMILY SELECTOR ────────────────────────────────────────────────────────

function AcidFamilySelector({ active, onSelect }: { active: AcidFamily; onSelect: (id: AcidFamily) => void }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.14em', color: TXT_MUTED, marginBottom: 10 }}>ACID FAMILY</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {ACID_FAMILIES.map(fam => {
          const isActive = active === fam.id;
          return (
            <button
              key={fam.id}
              onClick={() => onSelect(fam.id)}
              style={{
                textAlign: 'left',
                background: isActive ? ACCENT_TINT : SURFACE_CARD,
                border: `1px solid ${isActive ? 'rgba(78,140,255,.5)' : BORDER}`,
                borderRadius: 11,
                padding: '12px 13px',
                cursor: 'pointer',
                transition: 'border-color .15s',
              }}
            >
              <div style={{ font: `600 13.5px ${SANS}`, color: isActive ? ACCENT_TEXT : '#c3ccd9', marginBottom: 4 }}>{fam.label}</div>
              <div style={{ font: `400 10.5px ${SANS}`, color: TXT_FAINT, lineHeight: 1.35 }}>{fam.formula}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── SUBSTITUENT SELECTOR ────────────────────────────────────────────────────────

function SubstituentSelector({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const legend: { tone: MoleculeTone; label: string }[] = [
    { tone: 'ewg', label: 'EWG' },
    { tone: 'edg', label: 'EDG' },
    { tone: 'neutral', label: 'NEUTRAL' },
  ];
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 11, flexWrap: 'wrap' }}>
        <span style={{ font: `600 10px ${MONO}`, letterSpacing: '.14em', color: TXT_MUTED }}>SUBSTITUENT</span>
        {legend.map(l => (
          <span key={l.tone} style={{ display: 'flex', alignItems: 'center', gap: 5, font: `500 10px ${MONO}`, color: TYPE_COLORS[l.tone] }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: TYPE_COLORS[l.tone] }} />{l.label}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {ALL_SUBSTITUENTS.map(sub => {
          const tone = subType(sub.id);
          const col = TYPE_COLORS[tone];
          const isSel = sub.id === active;
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              style={{
                font: `${isSel ? 600 : 500} 12px ${MONO}`,
                color: isSel ? '#0E1319' : col,
                background: isSel ? col : `${col}12`,
                border: `1px solid ${isSel ? col : `${col}4d`}`,
                borderRadius: 8,
                padding: '6px 11px',
                cursor: 'pointer',
                transition: 'all .15s',
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

// ── pKa COMPARISON (gradient ranked bars) ────────────────────────────────────────

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function ComparisonChart({ slots }: { slots: CompoundSlot[] }) {
  const dataPoints = slots.map((slot, i) => ({
    ...getCompoundData(slot),
    slotIdx: i,
    tone: subType(slot.substituent),
  }));

  // Fixed pKa domain from the handoff (6.5–11), widened only if real data
  // falls outside so bars never overflow or vanish.
  const allP = dataPoints.map(d => d.pKa);
  const SMIN = Math.min(6.5, ...allP);
  const SMAX = Math.max(11, ...allP);

  const ranked = [...dataPoints].sort((a, b) => a.pKa - b.pKa);

  return (
    <div style={{ background: SURFACE_PANEL, border: `1px solid ${DIVIDER}`, borderRadius: 12, padding: '18px 22px', marginBottom: 16, overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, minWidth: 460 }}>
        <span style={{ font: `600 10px ${MONO}`, letterSpacing: '.14em', color: TXT_SECONDARY }}>pKₐ COMPARISON</span>
        <span style={{ font: `400 10.5px ${SANS}`, color: TXT_MUTED }}>ranked · longer bar = more acidic</span>
      </div>

      <div style={{ minWidth: 460 }}>
        {ranked.map((d, idx) => {
          const acL = acidLabel(d.pKa, d.acidFamily);
          const barPct = clamp(((SMAX - d.pKa) / (SMAX - SMIN)) * 100, 2, 100);
          return (
            <div key={d.slotIdx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: idx < ranked.length - 1 ? 12 : 0 }}>
              <span style={{ font: `500 10px ${MONO}`, color: TXT_MUTED, width: 16 }}>#{idx + 1}</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[d.tone], flex: 'none' }} />
              <span style={{ width: 118, flex: 'none', font: `500 12.5px ${SANS}`, color: '#c8cfda', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.compoundName}</span>
              <span style={{ flex: 1, height: 9, borderRadius: 5, background: 'rgba(255,255,255,.045)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${barPct}%`, background: TYPE_GRADIENTS[d.tone], borderRadius: 5, transition: 'width .5s cubic-bezier(.34,1.56,.64,1)' }} />
              </span>
              <span style={{ font: `600 13px ${MONO}`, color: TXT_PRIMARY, width: 44, textAlign: 'right' }}>{d.pKa.toFixed(2)}</span>
              <span style={classChipStyle(acL.col)}>{acL.txt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SELECTED-COMPOUND DETAIL ─────────────────────────────────────────────────────

function DetailPanel({ slot }: { slot: CompoundSlot }) {
  const data = getCompoundData(slot);
  return (
    <div style={{ background: SURFACE_PANEL, border: `1px solid ${DIVIDER}`, borderRadius: 12, padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
        <div style={{ width: 70, height: 70, flex: 'none', background: SURFACE_WELL, border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StructureFor slot={slot} size={60} />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.12em', color: TXT_MUTED, marginBottom: 5 }}>SELECTED COMPOUND</div>
          <div style={{ font: `600 17px ${SANS}`, color: ACCENT_TEXT }}>{data.compoundName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: `400 11px ${SANS}`, color: TXT_SECONDARY, marginBottom: 3 }}>
            {data.dataSource === 'EXPERIMENTAL' ? 'experimental' : 'calculated'} pKₐ · {data.reference}
          </div>
          <div style={{ font: `600 26px ${MONO}`, color: TXT_PRIMARY, letterSpacing: '-.02em' }}>{data.pKa.toFixed(2)}</div>
        </div>
      </div>

      {data.hammettResult && (
        <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'rgba(228,168,69,.07)', border: '1px solid rgba(228,168,69,.2)' }}>
          <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.08em', color: 'rgba(228,168,69,.85)', marginBottom: 6 }}>HAMMETT CALCULATION</div>
          <pre style={{ font: `400 12px ${MONO}`, color: '#97a0ae', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
            {getHammettExplanation(data.hammettResult, data.acidFamily)}
          </pre>
        </div>
      )}
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

  const handleAcidFamilyChange = (newFamily: AcidFamily) => {
    setAcidFamily(newFamily);
    setSlots(prev => prev.map(slot => ({
      ...slot,
      acidFamily: newFamily,
      position: newFamily === 'aliphatic' ? null : (slot.position || 'para'),
    })));
  };

  const handleUpdateSlot = (slotIdx: number, updates: Partial<CompoundSlot>) => {
    setSlots(prev => prev.map((slot, i) => (i === slotIdx ? { ...slot, ...updates } : slot)));
  };

  return (
    <div style={{ fontFamily: SANS, color: TXT_PRIMARY }}>
      <AcidFamilySelector active={acidFamily} onSelect={handleAcidFamilyChange} />

      <SubstituentSelector
        active={slots[activeSlot].substituent}
        onSelect={sub => handleUpdateSlot(activeSlot, { substituent: sub, position: sub === 'H' ? null : slots[activeSlot].position || 'para' })}
      />

      {/* Compound cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 26 }} className="acidlab-cards">
        {slots.map((slot, i) => (
          <CompoundCard
            key={i}
            slot={slot}
            slotIdx={i}
            isActive={activeSlot === i}
            onActivate={() => setActiveSlot(i)}
            onUpdateSlot={updates => handleUpdateSlot(i, updates)}
          />
        ))}
      </div>

      <ComparisonChart slots={slots} />

      <DetailPanel slot={slots[activeSlot]} />

      {/* Educational Content Section */}
      <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${DIVIDER}` }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ font: `600 20px ${SANS}`, color: TXT_PRIMARY, margin: '0 0 8px' }}>
            Acidity Patterns &amp; Trends
          </h2>
          <p style={{ font: `400 13px ${SANS}`, color: TXT_SECONDARY, lineHeight: 1.6, margin: 0 }}>
            Understanding the factors that influence acid strength: electronic effects, geometry, and structural features.
          </p>
        </div>

        <AcidityHeatMap />

        <div style={{ marginTop: 48 }}>
          <OrthoEffectSection />
        </div>
      </div>

      {/* Responsive: stack cards on narrow screens */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) { .acidlab-cards { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .acidlab-cards { grid-template-columns: 1fr !important; } }
      ` }} />
    </div>
  );
}
