'use client';

// ══════════════════════════════════════════════════════════════════════════════
// PYRIDINE BASICITY SECTION
// ══════════════════════════════════════════════════════════════════════════════
// Comprehensive explanation of substituent effects on pyridine basicity
// Based on provided NCERT-style explanations
// ══════════════════════════════════════════════════════════════════════════════

import PyridineBasicityHeatMap from './PyridineBasicityHeatMap';

export function PyridineBasicitySection() {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>⬡</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0 }}>
            Pyridine and Substituted Pyridines
          </h2>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 12, background: 'rgba(96,165,250,0.15)', color: '#60a5fa', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Position Effects
          </span>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginLeft: 36 }}>
          Understanding how substituent position (2, 3, or 4) dramatically affects basicity through electronic and steric effects
        </p>
      </div>

      {/* Heat Map */}
      <PyridineBasicityHeatMap />

      {/* Comprehensive Explanation */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginBottom: 20 }}>
          📖 Understanding Pyridine Basicity
        </div>

        {/* Baseline */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
            <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Baseline:</strong> Unsubstituted pyridine has pKₐ ≈ <strong>5.2</strong>. 
            Higher pKₐ = more basic (conjugate acid more stable).
          </div>
        </div>

        {/* 1. Electronic Effects */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>
            1. Electronic Effects: EDG vs. EWG
          </div>
          
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>
            The basicity of the nitrogen lone pair is primarily determined by the electronic nature of the substituent:
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#34d399', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>●</span> Electron-Donating Groups (EDGs)
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', paddingLeft: 24, borderLeft: '2px solid rgba(52,211,153,0.3)' }}>
              Groups like <strong>–NH₂</strong>, <strong>–Me</strong>, and <strong>–OMe</strong> increase electron density on the nitrogen, 
              making it more basic.
              <div style={{ marginTop: 8, fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>
                Example: 4-aminopyridine (pKₐ = 9.2) is significantly more basic than pyridine because of resonance donation.
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>●</span> Electron-Withdrawing Groups (EWGs)
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', paddingLeft: 24, borderLeft: '2px solid rgba(239,68,68,0.3)' }}>
              Groups like <strong>–NO₂</strong>, <strong>–CN</strong>, and <strong>–Cl</strong> pull electron density away from the nitrogen, 
              making it less basic.
              <div style={{ marginTop: 8, fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>
                Example: 2-nitropyridine (pKₐ = −2.6) is an extremely weak base due to the powerful inductive and resonance withdrawal 
                of the nitro group.
              </div>
            </div>
          </div>
        </div>

        {/* 2. Position Matters */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>
            2. The Position Matters (2 vs. 3 vs. 4)
          </div>
          
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>
            The location of the substituent relative to the nitrogen (N₁) drastically changes the magnitude of its effect:
          </div>

          {/* 4-Position */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
              4-Position (Para-like) — Strongest Resonance
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
              –NH₂ at 4-pos (pKₐ = 9.2): Lone pair delocalized onto ring N via resonance.<br/>
              –NO₂ at 4-pos (pKₐ = 1.6): Resonance withdraws electrons from N lone pair.
            </div>
          </div>

          {/* 2-Position */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
              2-Position (Ortho-like) — Inductive + Steric
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
              Strongest inductive effect (closest to N). EWGs like –Cl lower basicity significantly.<br/>
              Large groups (ᵗBu) can sterically hinder protonation, though electronic effects dominate.
            </div>
          </div>

          {/* 3-Position */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
              3-Position (Meta-like) — Inductive Only
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
              Resonance blocked from reaching N directly. Effects weaker and more uniform than 2- or 4-positions.
            </div>
          </div>
        </div>

        {/* 3. Notable Trends */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>
            3. Notable Trends in the Data
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Substituent</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Trend Observation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Alkyl (Me, ᵗBu)</td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    Slight increase in basicity (pKₐ ≈ 6.0) due to weak inductive donation (+I).
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Halogens (Cl)</td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    Decrease in basicity due to strong electronegativity (−I), with the 2-position being the weakest (0.7).
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Methoxy (OMe)</td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    Interesting split: At the 4-position (6.6), resonance (+R) dominates. At the 2-position (3.3), 
                    the inductive withdrawal (−I) of the oxygen dominates.
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Nitro (NO₂)</td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    Drastic decrease everywhere, but the 2-position is almost non-basic (pKₐ = −2.6) because the −I effect 
                    is maximized by proximity.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* JEE Key Takeaway */}
      <div style={{ marginTop: 20, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
        💡 Position matters: Same substituent has vastly different effects at 2-, 3-, or 4-positions. 
        Consider resonance (strongest at 4) and inductive (strongest at 2) when predicting trends.
      </div>

      {/* Placeholder for diagrams */}
      <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: 'rgba(139,92,246,0.08)', border: '1px dashed rgba(139,92,246,0.3)' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          📎 Space reserved for resonance structures showing 4-position vs 2-position effects
        </div>
      </div>
    </section>
  );
}
