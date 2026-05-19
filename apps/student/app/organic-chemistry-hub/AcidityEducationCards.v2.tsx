'use client';

// ══════════════════════════════════════════════════════════════════════════════
// ORTHO EFFECT - DETAILED ARTICLE
// ══════════════════════════════════════════════════════════════════════════════
// Comprehensive explanation of the ortho effect in benzoic acid derivatives
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';

// ── ORTHO EFFECT ARTICLE ──────────────────────────────────────────────────────

export function OrthoEffectSection() {
  return (
    <article style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
      {/* Header */}
      <header style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>🔄</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: 0, letterSpacing: '-0.02em' }}>
            The Ortho Effect in Benzoic Acids
          </h1>
        </div>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginLeft: 48, maxWidth: 900 }}>
          A fascinating phenomenon where ortho-substituted benzoic acids defy conventional electronic effects, 
          revealing the intricate interplay between steric hindrance, resonance, and through-space interactions.
        </p>
      </header>

      {/* Introduction */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Introduction: The Paradox
        </h2>
        <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
          In organic chemistry, electron-donating groups (EDGs) like alkyl groups (–CH₃, –C₂H₅) typically decrease acidity by destabilizing the conjugate base. This holds true for para and meta positions in benzoic acid derivatives. However, when these same alkyl groups occupy the ortho position, they paradoxically increase acidity. This counterintuitive behavior is known as the <strong>ortho effect</strong>, arising from two primary mechanisms: steric inhibition of resonance (where bulky ortho groups twist the –COOH out of plane, disrupting resonance stabilization) and field effects through space (electrostatic interactions between the ortho substituent and the carboxyl group).
        </div>
      </section>

      {/* Experimental Data */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Experimental Evidence
        </h2>
        <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Compound</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>pKa</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Benzoic acid (reference)</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(168,168,204,0.8)' }}>4.20</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>Baseline</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>ortho-Methylbenzoic acid</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(134,239,172,0.7)' }}>3.91</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>More acidic despite –CH₃ being EDG</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>ortho-Ethylbenzoic acid</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(134,239,172,0.7)' }}>3.79</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>Bulkier group → stronger ortho effect</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>para-Methylbenzoic acid</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(252,165,165,0.7)' }}>4.38</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>Less acidic (normal EDG behavior)</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>meta-Methylbenzoic acid</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace', color: 'rgba(253,224,71,0.7)' }}>4.27</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>Slightly less acidic (weak +I effect)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
          💡 <strong>Key observation:</strong> ortho-CH₃ (pKa = 3.91) is more acidic than benzoic acid (pKa = 4.20), 
          while para-CH₃ (pKa = 4.38) is less acidic. This reversal cannot be explained by electronic effects alone.
        </div>
      </section>

      {/* Mechanism Diagram */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Visualizing the Ortho Effect
        </h2>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img 
            src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/acidity/MultiColor_20260314_174536_384283000.webp"
            alt="Ortho Effect Mechanism Diagram"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* Mechanism 1: Steric Inhibition of Resonance */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Mechanism 1: Steric Inhibition of Resonance
        </h2>
        
        <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
          When a bulky substituent (like –CH₃ or –C₂H₅) is placed at the ortho position, it experiences steric repulsion with the carboxyl group (–COOH), forcing the –COOH to twist out of the benzene ring plane. In a planar conformation, the carboxyl group can engage in resonance with the benzene ring, delocalizing and stabilizing the negative charge of the carboxylate ion (–COO⁻). However, when twisted out of plane, this resonance is disrupted. The key insight is that the neutral acid is destabilized more than the conjugate base: the twisted –COOH in the neutral molecule loses resonance stabilization with the ring, while the carboxylate anion's negative charge is already delocalized within the –COO⁻ group itself (between the two oxygen atoms), making it less dependent on ring resonance. This differential destabilization shifts the equilibrium toward deprotonation, increasing acidity.
        </div>

        <div style={{ padding: 20, borderRadius: 10, background: 'rgba(203,213,225,0.08)', border: '1px solid rgba(203,213,225,0.2)', borderLeft: '4px solid rgba(148,163,184,0.5)' }}>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
            <strong style={{ color: 'rgba(203,213,225,0.9)' }}>📌 Key Principle:</strong> Acidity is determined by the relative stability of the acid and its conjugate base. If the neutral acid is destabilized more than the anion, acidity increases.
          </div>
        </div>
      </section>

      {/* Mechanism 2: Field Effect */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Mechanism 2: Field Effect Through Space
        </h2>
        
        <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
          Even when the ortho substituent is not directly conjugated with the –COOH group (due to twisted geometry), it can still interact through electrostatic field effects. The ortho substituent's close spatial proximity to the –COOH group allows it to stabilize or destabilize the developing negative charge on the carboxylate oxygen through through-space interactions. For alkyl groups, despite being typically electron-donating via the inductive effect (+I), their polarizable electron cloud can interact with the carboxylate oxygen to provide partial stabilization of the negative charge through polarization and dispersion forces. This contributes to the overall acidifying effect, though steric inhibition of resonance is generally the dominant factor.
        </div>
      </section>

      {/* Position Dependence */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Position Dependence: ortho vs. meta vs. para
        </h2>
        
        <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
          The ortho effect is position-specific, with the same substituent producing vastly different effects depending on its location:
        </div>

        <ul style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', paddingLeft: 24, marginBottom: 20 }}>
          <li style={{ marginBottom: 12 }}>
            <strong>ortho Position:</strong> Maximum steric hindrance forces –COOH out of plane. Field effects are strongest due to close proximity. For alkyl groups, acidity increases (pKa ~3.9).
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>meta Position:</strong> No direct steric clash. Electronic effects are weak because resonance cannot directly reach the carboxyl group. Alkyl groups show weak +I effect, slightly decreasing acidity (pKa = 4.27).
          </li>
          <li>
            <strong>para Position:</strong> No steric hindrance. Alkyl groups donate electrons through resonance and inductive effects, destabilizing the carboxylate anion and decreasing acidity (pKa = 4.38) — the expected behavior for EDGs.
          </li>
        </ul>

        <div style={{ padding: 20, borderRadius: 10, background: 'rgba(191,219,254,0.08)', border: '1px solid rgba(191,219,254,0.2)' }}>
          <div style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
            <strong>Acidity trend for alkyl substituents:</strong> ortho (pKa ~3.9) {'>'} benzoic acid (4.20) {'>'} meta (4.27) {'>'} para (4.38)
            <span style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: 4 }}>
              (Lower pKa = more acidic)
            </span>
          </div>
        </div>
      </section>

      {/* EWG vs EDG */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Ortho Effect with Electron-Withdrawing Groups (EWGs)
        </h2>
        
        <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
          For electron-withdrawing groups (like –NO₂, –Cl, –CF₃), the ortho position is always the most acidic, but for different reasons than alkyl groups. EWGs withdraw electrons through σ-bonds (inductive effect, strongest at ortho due to proximity), through π-conjugation (resonance effect, especially –NO₂, directly stabilizing the carboxylate anion), and through electrostatic attraction (field effect, where electronegative atoms stabilize the nearby negative charge on –COO⁻). For example, ortho-nitrobenzoic acid (pKa ≈ 2.2) is significantly more acidic than benzoic acid (pKa = 4.20) and even more acidic than para-nitrobenzoic acid (pKa ≈ 3.4), due to these combined effects.
        </div>
      </section>


      {/* Summary */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
          Summary
        </h2>
        
        <div style={{ padding: 24, borderRadius: 12, background: 'rgba(226,232,240,0.06)', border: '1px solid rgba(226,232,240,0.15)' }}>
          <ul style={{ fontSize: 16, lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', paddingLeft: 24, margin: 0, listStyleType: 'none' }}>
            <li style={{ marginBottom: 14, paddingLeft: 8, borderLeft: '3px solid rgba(203,213,225,0.5)' }}>
              <strong>The ortho effect</strong> causes ortho-substituted benzoic acids to exhibit anomalous acidity trends.
            </li>
            <li style={{ marginBottom: 14, paddingLeft: 8, borderLeft: '3px solid rgba(203,213,225,0.5)' }}>
              <strong>Steric inhibition of resonance</strong> is the primary mechanism: bulky ortho groups twist –COOH out of plane, destabilizing the neutral acid more than the anion.
            </li>
            <li style={{ marginBottom: 14, paddingLeft: 8, borderLeft: '3px solid rgba(203,213,225,0.5)' }}>
              <strong>Field effects through space</strong> provide additional stabilization/destabilization of the carboxylate ion.
            </li>
            <li style={{ marginBottom: 14, paddingLeft: 8, borderLeft: '3px solid rgba(203,213,225,0.5)' }}>
              For <strong>alkyl groups (EDGs)</strong>: ortho {'>'} H {'>'} meta {'>'} para (in terms of acidity).
            </li>
            <li style={{ paddingLeft: 8, borderLeft: '3px solid rgba(203,213,225,0.5)' }}>
              For <strong>EWGs</strong>: ortho is always most acidic due to combined inductive, resonance, and field effects.
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}

