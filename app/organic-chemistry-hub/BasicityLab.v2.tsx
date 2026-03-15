'use client';

// ══════════════════════════════════════════════════════════════════════════════
// BASICITY LAB V2 - NITROGEN BASES (NCERT-ALIGNED)
// ══════════════════════════════════════════════════════════════════════════════
// Based on NCERT Class 12 Chemistry Table 13.3 and explanations
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { PyridineBasicitySection } from './PyridineBasicitySection';

// ── BASICITY DATA (NCERT Table 13.3) ─────────────────────────────────────────

interface BaseData {
  id: string;
  name: string;
  formula: string;
  type: 'aliphatic' | 'aromatic' | 'heterocyclic';
  pKb_aqueous: number;
  notes: string;
}

// EXACT values from NCERT Table 13.3
const ALIPHATIC_AMINES: BaseData[] = [
  { id: 'methanamine', name: 'Methanamine', formula: 'CH₃NH₂', type: 'aliphatic', pKb_aqueous: 3.38, notes: '1° amine' },
  { id: 'n-methylmethanamine', name: 'N-Methylmethanamine', formula: 'CH₃NHCH₃', type: 'aliphatic', pKb_aqueous: 3.27, notes: '2° amine - most basic in aqueous' },
  { id: 'n-n-dimethylmethanamine', name: 'N,N-Dimethylmethanamine', formula: '(CH₃)₂NCH₃', type: 'aliphatic', pKb_aqueous: 4.22, notes: '3° amine - steric hindrance' },
  { id: 'ethanamine', name: 'Ethanamine', formula: 'C₂H₅NH₂', type: 'aliphatic', pKb_aqueous: 3.29, notes: '1° amine' },
  { id: 'n-ethylethanamine', name: 'N-Ethylethanamine', formula: '(C₂H₅)₂NH', type: 'aliphatic', pKb_aqueous: 3.00, notes: '2° amine - strongest base' },
  { id: 'n-n-diethylethanamine', name: 'N,N-Diethylethanamine', formula: '(C₂H₅)₃N', type: 'aliphatic', pKb_aqueous: 3.25, notes: '3° amine' },
];

const AROMATIC_AMINES: BaseData[] = [
  { id: 'benzenamine', name: 'Benzenamine (Aniline)', formula: 'C₆H₅NH₂', type: 'aromatic', pKb_aqueous: 9.38, notes: 'Lone pair delocalized' },
  { id: 'phenylmethanamine', name: 'Phenylmethanamine', formula: 'C₆H₅CH₂NH₂', type: 'aromatic', pKb_aqueous: 4.70, notes: 'CH₂ insulates from ring' },
  { id: 'n-methylaniline', name: 'N-Methylaniline', formula: 'C₆H₅NHCH₃', type: 'aromatic', pKb_aqueous: 9.30, notes: 'N-alkylation, still weak' },
  { id: 'n-n-dimethylaniline', name: 'N,N-Dimethylaniline', formula: 'C₆H₅N(CH₃)₂', type: 'aromatic', pKb_aqueous: 8.92, notes: 'Slightly stronger than aniline' },
];

const HETEROCYCLIC_BASES: BaseData[] = [
  { id: 'pyridine', name: 'Pyridine', formula: 'C₅H₅N', type: 'heterocyclic', pKb_aqueous: 8.75, notes: 'sp² N, lone pair perpendicular to π-system' },
  { id: 'piperidine', name: 'Piperidine', formula: 'C₅H₁₁N', type: 'heterocyclic', pKb_aqueous: 2.88, notes: 'Saturated, strong base like aliphatic' },
  { id: 'pyrrole', name: 'Pyrrole', formula: 'C₄H₅N', type: 'heterocyclic', pKb_aqueous: 15.0, notes: 'Lone pair in aromatic system, extremely weak' },
];

// ── ALIPHATIC AMINES SECTION ──────────────────────────────────────────────────

function AliphaticAminesSection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>🧪</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>
            Aliphatic Amines
          </h2>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 12, background: 'rgba(52,211,153,0.15)', color: '#34d399', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            NCERT Table 13.3
          </span>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginLeft: 36 }}>
          Basicity order in aqueous phase: <strong style={{ color: 'rgba(255,255,255,0.8)' }}>2° {'>'} 1° {'>'} 3°</strong> (due to solvation effects)
        </p>
      </div>

      <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Data table */}
        <div style={{ marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Formula</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>pKb</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {ALIPHATIC_AMINES.map((base, idx) => {
                const typeColor = base.notes.includes('2°') ? '#34d399' : base.notes.includes('3°') ? '#fbbf24' : '#60a5fa';
                return (
                  <tr key={base.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{base.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.65)' }}>{base.formula}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: typeColor }}>{base.pKb_aqueous.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{base.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* NCERT Explanation */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>
            <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Aqueous Phase:</strong> BH⁺ must be stabilized by solvation. 
            2° amines have optimal H-bonding (2 H atoms) → most basic. 
            3° amines have steric hindrance → reduced basicity.
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
            <strong>Gas Phase:</strong> 3° {'>'} 2° {'>'} 1° {'>'} NH₃ (pure inductive effect, no solvation)
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
            💡 For –C₂H₅: steric hindrance increases → (C₂H₅)₂NH {'>'} C₂H₅NH₂ {'>'} (C₂H₅)₃N
          </div>
        </div>
      </div>

      {/* Solvation diagram placeholder */}
      <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: 'rgba(139,92,246,0.08)', border: '1px dashed rgba(139,92,246,0.3)' }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          📎 Space reserved for H-bonding solvation diagram (1°, 2°, 3° comparison)
        </div>
      </div>
    </section>
  );
}

// ── AROMATIC AMINES SECTION ───────────────────────────────────────────────────

function AromaticAminesSection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>🔴</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>
            Aromatic Amines (Arylamines)
          </h2>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 12, background: 'rgba(248,113,113,0.15)', color: '#f87171', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Resonance
          </span>
        </div>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginLeft: 36 }}>
          Much weaker bases than aliphatic amines due to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>electron pair delocalization</strong> into benzene ring
        </p>
      </div>

      <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Data table */}
        <div style={{ marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Formula</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>pKb</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {AROMATIC_AMINES.map((base) => (
                <tr key={base.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{base.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 16, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.65)' }}>{base.formula}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: '#f87171' }}>{base.pKb_aqueous.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>{base.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NCERT Explanation */}
        <div style={{ padding: 16, borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderLeft: '4px solid #f87171' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f87171', marginBottom: 10, letterSpacing: '.04em' }}>
            📖 NCERT Explanation
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
            <p style={{ marginBottom: 12 }}>
              In aniline, the –NH₂ group is directly attached to the benzene ring. The unshared electron pair on nitrogen 
              is in <strong style={{ color: '#f87171' }}>conjugation with the benzene ring</strong>, making it less available for protonation.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Resonance structures:</strong> Aniline has 5 resonating structures, 
              while anilinium ion (C₆H₅NH₃⁺) has only 2 (Kekulé structures). Greater stability of aniline → less basic.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Substituent effects:</strong> EDG like –OCH₃, –CH₃ increase basicity. 
              EWG like –NO₂, –SO₃H, –COOH, –X decrease basicity.
            </p>
            <p style={{ margin: 0, fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>
              Phenylmethanamine (C₆H₅CH₂NH₂) is much more basic than aniline because the –CH₂– group insulates 
              the nitrogen from the benzene ring, preventing resonance.
            </p>
          </div>
        </div>
      </div>

      {/* Resonance structures placeholder */}
      <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: 'rgba(139,92,246,0.08)', border: '1px dashed rgba(139,92,246,0.3)' }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          📎 Space reserved for aniline resonance structures diagram (5 structures)
        </div>
      </div>
    </section>
  );
}

// ── HETEROCYCLIC BASES SECTION ────────────────────────────────────────────────

function HeterocyclicBasesSection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>⬡</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>
            Heterocyclic Nitrogen Bases
          </h2>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 12, background: 'rgba(168,85,247,0.15)', color: '#a78bfa', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Structures
          </span>
        </div>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginLeft: 36 }}>
          Basicity depends on whether the lone pair is part of the aromatic π-system
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {HETEROCYCLIC_BASES.map((base) => {
            const color = base.id === 'piperidine' ? '#34d399' : base.id === 'pyridine' ? '#60a5fa' : '#f87171';
            return (
              <div key={base.id} style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>{base.name}</div>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
                  {base.formula}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color, marginBottom: 6 }}>
                  pKb {base.pKb_aqueous.toFixed(2)}
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  {base.notes}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
            <strong style={{ color: '#34d399' }}>Piperidine:</strong> sp³ N, lone pair not in aromatic system → strong base.<br/>
            <strong style={{ color: '#60a5fa' }}>Pyridine:</strong> sp² N, lone pair perpendicular to π-system → weaker than aliphatic.<br/>
            <strong style={{ color: '#f87171' }}>Pyrrole:</strong> Lone pair part of aromatic sextet → extremely weak base.
          </div>
        </div>
      </div>

      {/* Structure diagrams placeholder */}
      <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: 'rgba(139,92,246,0.08)', border: '1px dashed rgba(139,92,246,0.3)' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          📎 Space reserved for heterocyclic structure diagrams with orbital representations
        </div>
      </div>
    </section>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function BasicityLab() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '6px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#34d399' }}>NCERT ALIGNED</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Table 13.3 · Class 12 Chemistry
          </span>
        </div>
        
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginBottom: 12, lineHeight: 1.2 }}>
          Basicity of Nitrogen Bases
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 800 }}>
          Comprehensive study of amine basicity with NCERT-accurate pKb values. Understand how structure, 
          solvation, and resonance affect basic strength in aqueous phase.
        </p>
      </div>
      
      {/* Sections */}
      <AliphaticAminesSection />
      <AromaticAminesSection />
      <PyridineBasicitySection />
      <HeterocyclicBasesSection />
    </div>
  );
}
