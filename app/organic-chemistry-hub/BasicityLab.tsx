'use client';

// ══════════════════════════════════════════════════════════════════════════════
// BASICITY LAB - NITROGEN BASES
// ══════════════════════════════════════════════════════════════════════════════
// Side-by-side comparison of basicity in aqueous vs gas phase
// NO toggles - both phases visible simultaneously to reduce decision fatigue
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';

// ── BASICITY DATA ─────────────────────────────────────────────────────────────

interface BaseData {
  id: string;
  name: string;
  formula: string;
  type: 'aliphatic-1' | 'aliphatic-2' | 'aliphatic-3' | 'aromatic' | 'heterocyclic';
  pKb_aqueous: number;
  pKa_conjugate_aqueous: number; // pKa + pKb = 14 at 25°C
  gas_phase_order: number; // 1 = most basic, higher = less basic
  notes: string;
}

const BASICITY_DATA: BaseData[] = [
  // Aliphatic amines (aqueous: 2° > 1° > 3°, gas: 3° > 2° > 1°)
  { id: 'methylamine', name: 'Methylamine', formula: 'CH₃NH₂', type: 'aliphatic-1', pKb_aqueous: 3.36, pKa_conjugate_aqueous: 10.64, gas_phase_order: 3, notes: '1° amine - moderate solvation' },
  { id: 'dimethylamine', name: 'Dimethylamine', formula: '(CH₃)₂NH', type: 'aliphatic-2', pKb_aqueous: 3.27, pKa_conjugate_aqueous: 10.73, gas_phase_order: 2, notes: '2° amine - optimal balance in water' },
  { id: 'trimethylamine', name: 'Trimethylamine', formula: '(CH₃)₃N', type: 'aliphatic-3', pKb_aqueous: 4.19, pKa_conjugate_aqueous: 9.81, gas_phase_order: 1, notes: '3° amine - steric hindrance in water' },
  { id: 'ethylamine', name: 'Ethylamine', formula: 'C₂H₅NH₂', type: 'aliphatic-1', pKb_aqueous: 3.25, pKa_conjugate_aqueous: 10.75, gas_phase_order: 4, notes: '1° amine - slightly more basic than methylamine' },
  { id: 'diethylamine', name: 'Diethylamine', formula: '(C₂H₅)₂NH', type: 'aliphatic-2', pKb_aqueous: 3.02, pKa_conjugate_aqueous: 10.98, gas_phase_order: 5, notes: '2° amine - most basic in aqueous' },
  { id: 'triethylamine', name: 'Triethylamine', formula: '(C₂H₅)₃N', type: 'aliphatic-3', pKb_aqueous: 3.25, pKa_conjugate_aqueous: 10.75, gas_phase_order: 6, notes: '3° amine - steric effects reduce aqueous basicity' },
  
  // Aromatic amines (much weaker bases due to resonance)
  { id: 'aniline', name: 'Aniline', formula: 'C₆H₅NH₂', type: 'aromatic', pKb_aqueous: 9.13, pKa_conjugate_aqueous: 4.87, gas_phase_order: 10, notes: 'Lone pair delocalized into benzene ring' },
  { id: 'p-toluidine', name: 'p-Toluidine', formula: 'CH₃-C₆H₄-NH₂', type: 'aromatic', pKb_aqueous: 8.92, pKa_conjugate_aqueous: 5.08, gas_phase_order: 9, notes: 'CH₃ is EDG, increases basicity slightly' },
  { id: 'p-nitroaniline', name: 'p-Nitroaniline', formula: 'O₂N-C₆H₄-NH₂', type: 'aromatic', pKb_aqueous: 13.0, pKa_conjugate_aqueous: 1.0, gas_phase_order: 12, notes: 'NO₂ is strong EWG, very weak base' },
  
  // Heterocyclic bases
  { id: 'pyridine', name: 'Pyridine', formula: 'C₅H₅N', type: 'heterocyclic', pKb_aqueous: 8.75, pKa_conjugate_aqueous: 5.25, gas_phase_order: 8, notes: 'sp² nitrogen, lone pair not in aromatic system' },
  { id: 'piperidine', name: 'Piperidine', formula: 'C₅H₁₁N', type: 'heterocyclic', pKb_aqueous: 2.88, pKa_conjugate_aqueous: 11.12, gas_phase_order: 7, notes: 'Saturated 6-membered ring, strong base' },
  { id: 'pyrrole', name: 'Pyrrole', formula: 'C₄H₅N', type: 'heterocyclic', pKb_aqueous: 15.0, pKa_conjugate_aqueous: -1.0, gas_phase_order: 13, notes: 'Lone pair in aromatic system, extremely weak base' },
  { id: 'imidazole', name: 'Imidazole', formula: 'C₃H₄N₂', type: 'heterocyclic', pKb_aqueous: 7.05, pKa_conjugate_aqueous: 6.95, gas_phase_order: 11, notes: 'Two nitrogens, one basic, one aromatic' },
];

// ── PHASE COMPARISON COMPONENT ────────────────────────────────────────────────

function PhaseComparison() {
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Filter data by type
  const filteredData = selectedType === 'all' 
    ? BASICITY_DATA 
    : BASICITY_DATA.filter(b => b.type.startsWith(selectedType));
  
  // Sort for aqueous (by pKb ascending = more basic first)
  const aqueousSorted = [...filteredData].sort((a, b) => a.pKb_aqueous - b.pKb_aqueous);
  
  // Sort for gas phase (by gas_phase_order ascending)
  const gasPhaseSorted = [...filteredData].sort((a, b) => a.gas_phase_order - b.gas_phase_order);
  
  const typeColors: Record<string, string> = {
    'aliphatic-1': '#60a5fa',
    'aliphatic-2': '#34d399',
    'aliphatic-3': '#fbbf24',
    'aromatic': '#f87171',
    'heterocyclic': '#a78bfa',
  };
  
  const getTypeColor = (type: string) => typeColors[type] || '#9ca3af';
  
  return (
    <div>
      {/* Filter buttons */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
          Filter by Type
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Bases' },
            { id: 'aliphatic', label: 'Aliphatic Amines' },
            { id: 'aromatic', label: 'Aromatic Amines' },
            { id: 'heterocyclic', label: 'Heterocyclic' },
          ].map(filter => {
            const isActive = selectedType === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedType(filter.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  background: isActive ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                  transition: 'all .2s',
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Side-by-side comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Aqueous Phase */}
        <div style={{ padding: 24, borderRadius: 12, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa', marginBottom: 4 }}>
              💧 Aqueous Phase
            </h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Basicity order: 2° {'>'} 1° {'>'} 3° (aliphatic). Solvation and steric effects dominate.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aqueousSorted.map((base, idx) => (
              <div
                key={base.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${getTypeColor(base.type)}40`,
                  borderLeft: `4px solid ${getTypeColor(base.type)}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: getTypeColor(base.type) }}>
                      {base.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.7)' }}>
                    pKb {base.pKb_aqueous.toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {base.formula}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gas Phase */}
        <div style={{ padding: 24, borderRadius: 12, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', marginBottom: 4 }}>
              ☁️ Gas Phase
            </h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Basicity order: 3° {'>'} 2° {'>'} 1° (aliphatic). Inductive effect dominates, no solvation.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {gasPhaseSorted.map((base, idx) => (
              <div
                key={base.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${getTypeColor(base.type)}40`,
                  borderLeft: `4px solid ${getTypeColor(base.type)}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: getTypeColor(base.type) }}>
                      {base.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: 'rgba(168,85,247,0.2)', color: '#c4b5fd' }}>
                    Most basic
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {base.formula}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Key insight */}
      <div style={{ marginTop: 24, padding: 16, borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderLeft: '4px solid #a78bfa' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Order Reversal Explained:</strong> In aqueous solution, the conjugate acid (BH⁺) must be solvated by water. 
            2° amines have optimal solvation (2 H atoms for H-bonding). 3° amines have steric hindrance preventing effective solvation, making them weaker bases in water. 
            In gas phase, no solvation occurs - only inductive effect matters. More alkyl groups = more electron donation = stronger base.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EDUCATIONAL CARDS ─────────────────────────────────────────────────────────

function SolvationCard() {
  return (
    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>💧</span>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Solvation Effects
        </h3>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          Aqueous
        </span>
      </div>
      
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>
        In water, the conjugate acid (R₃NH⁺) must be stabilized by H-bonding. <strong style={{ color: 'rgba(255,255,255,0.9)' }}>2° amines</strong> have 
        2 H atoms available for H-bonding with water, providing optimal stabilization. <strong style={{ color: 'rgba(255,255,255,0.9)' }}>3° amines</strong> have 
        only 1 H atom, and bulky alkyl groups create steric hindrance, reducing solvation efficiency.
      </p>
      
      <div style={{ padding: 14, borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', marginBottom: 8 }}>Aqueous Basicity Order:</div>
        <div style={{ fontSize: 14, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.8)' }}>
          (C₂H₅)₂NH {'>'} C₂H₅NH₂ {'>'} (C₂H₅)₃N {'>'} NH₃
        </div>
      </div>
    </div>
  );
}

function InductiveCard() {
  return (
    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>⚡</span>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Inductive Effect
        </h3>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          Gas Phase
        </span>
      </div>
      
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>
        In gas phase, <strong style={{ color: 'rgba(255,255,255,0.9)' }}>no solvation occurs</strong>. Basicity depends purely on electron density at nitrogen. 
        Alkyl groups are <strong style={{ color: 'rgba(255,255,255,0.9)' }}>+I (electron-donating)</strong>, increasing electron density and stabilizing the positive charge 
        on the conjugate acid. More alkyl groups = more electron donation = stronger base.
      </p>
      
      <div style={{ padding: 14, borderRadius: 8, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 8 }}>Gas Phase Basicity Order:</div>
        <div style={{ fontSize: 14, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.8)' }}>
          (C₂H₅)₃N {'>'} (C₂H₅)₂NH {'>'} C₂H₅NH₂ {'>'} NH₃
        </div>
      </div>
    </div>
  );
}

function AromaticCard() {
  return (
    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>🔴</span>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          Aromatic Amines
        </h3>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          Resonance
        </span>
      </div>
      
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>
        Aromatic amines (like aniline) are <strong style={{ color: 'rgba(255,255,255,0.9)' }}>much weaker bases</strong> than aliphatic amines. 
        The nitrogen lone pair is <strong style={{ color: 'rgba(255,255,255,0.9)' }}>delocalized into the benzene ring</strong> through resonance, 
        making it less available for protonation. Electron-withdrawing groups (like –NO₂) further reduce basicity.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Aniline</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-geist-mono), monospace', color: '#f87171' }}>
            pKb 9.13
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Methylamine</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-geist-mono), monospace', color: '#34d399' }}>
            pKb 3.36
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function BasicityLab() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '6px 14px', borderRadius: 20, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#c4b5fd' }}>NEW</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Nitrogen bases · Aqueous vs Gas Phase
          </span>
        </div>
        
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginBottom: 12, lineHeight: 1.2 }}>
          Basicity of Nitrogen Bases
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 800 }}>
          Compare basicity orders in aqueous and gas phases side-by-side. Understand how solvation effects reverse the order 
          for aliphatic amines, and why aromatic amines are much weaker bases.
        </p>
      </div>
      
      {/* Phase comparison */}
      <PhaseComparison />
      
      {/* Educational cards */}
      <div style={{ marginTop: 48, paddingTop: 32, borderTop: '2px solid rgba(255,255,255,0.08)' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
            📚 Understanding Basicity
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Key concepts that explain basicity trends in different environments.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <SolvationCard />
          <InductiveCard />
          <AromaticCard />
        </div>
      </div>
    </div>
  );
}
