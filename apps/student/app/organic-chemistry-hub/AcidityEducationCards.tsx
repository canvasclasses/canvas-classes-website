'use client';

// ══════════════════════════════════════════════════════════════════════════════
// ACIDITY EDUCATION CARDS
// ══════════════════════════════════════════════════════════════════════════════
// Clean, scannable educational content cards for acidity patterns and trends
// NO accordions, NO nested boxes - flat, open design for better focus
// ══════════════════════════════════════════════════════════════════════════════

// ── ORTHO EFFECT CARD ─────────────────────────────────────────────────────────

export function OrthoEffectCard() {
  return (
    <div className="concept-card">
      <div className="card-header">
        <span className="icon">🔄</span>
        <h3>Ortho Effect</h3>
        <span className="badge">Steric + Field</span>
      </div>
      
      <p className="explanation">
        Ortho-alkyl benzoic acids are <strong>more acidic</strong> than para isomers despite alkyl groups being EDG. 
        The bulky ortho substituent <strong>twists the COOH group out of plane</strong>, preventing resonance stabilization 
        of the neutral acid. This makes the acid less stable, increasing acidity.
      </p>
      
      <div className="comparison-grid">
        <div className="comparison-item" style={{ borderColor: '#60c080' }}>
          <div className="label">ortho-CH₃</div>
          <div className="pka-value">pKa 3.91</div>
          <div className="note">More acidic (steric effect)</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#a8a8cc' }}>
          <div className="label">Benzoic acid</div>
          <div className="pka-value">pKa 4.20</div>
          <div className="note">Reference</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#60c080' }}>
          <div className="label">para-CH₃</div>
          <div className="pka-value">pKa 4.38</div>
          <div className="note">Less acidic (EDG effect)</div>
        </div>
      </div>
      
      <div className="key-insight">
        <span className="insight-icon">💡</span>
        <span>Bulkier ortho groups (–C₂H₅, –C(CH₃)₃) show stronger effect → pKa 3.79, 3.21</span>
      </div>

      <style jsx>{`
        .concept-card {
          padding: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .icon {
          font-size: 20px;
        }
        
        h3 {
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin: 0;
          flex: 1;
        }
        
        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        
        .explanation {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        
        .explanation strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .comparison-item {
          padding: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          text-align: center;
        }
        
        .label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        
        .pka-value {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-geist-mono), monospace;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .note {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .key-insight {
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(139,92,246,0.1);
          border-left: 3px solid #a78bfa;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .insight-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

// ── CIS/TRANS GEOMETRY CARD ───────────────────────────────────────────────────

export function CisTransCard() {
  return (
    <div className="concept-card">
      <div className="card-header">
        <span className="icon">🔀</span>
        <h3>cis vs trans Acid Strength</h3>
        <span className="badge">Geometry</span>
      </div>
      
      <p className="explanation">
        <strong>cis-acids are more acidic than trans-acids.</strong> The cis geometry allows 
        intramolecular hydrogen bonding in the product anion, stabilizing the carboxylate and lowering pKa₁.
      </p>
      
      <div className="comparison-grid">
        <div className="comparison-item" style={{ borderColor: '#78d0c0' }}>
          <div className="label">Maleic acid (cis)</div>
          <div className="pka-value">pKa₁ 1.92</div>
          <div className="note">H-bond stabilizes anion</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#e08080' }}>
          <div className="label">Fumaric acid (trans)</div>
          <div className="pka-value">pKa₁ 3.02</div>
          <div className="note">No H-bond possible</div>
        </div>
      </div>
      
      <div className="key-insight">
        <span className="insight-icon">💡</span>
        <span>After first ionization, maleic acid's COO⁻ forms strong intramolecular H-bond with adjacent COOH. Fumaric groups are trans (too far apart).</span>
      </div>

      <style jsx>{`
        .concept-card {
          padding: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .icon {
          font-size: 20px;
        }
        
        h3 {
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin: 0;
          flex: 1;
        }
        
        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        
        .explanation {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        
        .explanation strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .comparison-item {
          padding: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          text-align: center;
        }
        
        .label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        
        .pka-value {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-geist-mono), monospace;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .note {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .key-insight {
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(139,92,246,0.1);
          border-left: 3px solid #a78bfa;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .insight-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

// ── RING STRAIN CARD ──────────────────────────────────────────────────────────

export function RingStrainCard() {
  return (
    <div className="concept-card">
      <div className="card-header">
        <span className="icon">💍</span>
        <h3>Ring Strain & s-Character</h3>
        <span className="badge">Hybridization</span>
      </div>
      
      <p className="explanation">
        C–H acidity increases with <strong>% s-character</strong> of the carbon orbital. Ring strain in small rings 
        forces smaller C–C–C bond angles, requiring more p-character in ring bonds, leaving <strong>more s-character 
        in C–H bonds</strong>. Higher s-character = better anion stabilization = lower pKa.
      </p>
      
      <div className="comparison-grid">
        <div className="comparison-item" style={{ borderColor: '#78d0c0' }}>
          <div className="label">Cyclopropane</div>
          <div className="pka-value">pKa 39</div>
          <div className="note">60° bond angle</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#e0c878' }}>
          <div className="label">Cyclobutane</div>
          <div className="pka-value">pKa 43</div>
          <div className="note">~90° bond angle</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#e08080' }}>
          <div className="label">Propane</div>
          <div className="pka-value">pKa 50</div>
          <div className="note">~109.5° (sp³)</div>
        </div>
      </div>
      
      <div className="key-insight">
        <span className="insight-icon">💡</span>
        <span>Hybridization series: sp C–H (pKa ~25) {'>'} sp² C–H (pKa ~44) {'>'} sp³ C–H (pKa ~50). More s-character → more acidic.</span>
      </div>

      <style jsx>{`
        .concept-card {
          padding: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .icon {
          font-size: 20px;
        }
        
        h3 {
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin: 0;
          flex: 1;
        }
        
        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        
        .explanation {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        
        .explanation strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .comparison-item {
          padding: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          text-align: center;
        }
        
        .label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        
        .pka-value {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-geist-mono), monospace;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .note {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .key-insight {
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(139,92,246,0.1);
          border-left: 3px solid #a78bfa;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .insight-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

// ── INDUCTIVE VS RESONANCE CARD ───────────────────────────────────────────────

export function InductiveResonanceCard() {
  return (
    <div className="concept-card">
      <div className="card-header">
        <span className="icon">⚡</span>
        <h3>Inductive vs Resonance Effects</h3>
        <span className="badge">Electronic</span>
      </div>
      
      <p className="explanation">
        <strong>Inductive effect (–I):</strong> Through σ-bonds, decreases with distance. Halogens: F {'>'} Cl {'>'} Br {'>'} I.<br/>
        <strong>Resonance effect (–M/+M):</strong> Through π-system, requires conjugation. –NO₂, –CN are strong –M (EWG). –OCH₃, –NH₂ are +M (EDG).
      </p>
      
      <div className="comparison-grid">
        <div className="comparison-item" style={{ borderColor: '#fb7185' }}>
          <div className="label">F–CH₂–COOH</div>
          <div className="pka-value">pKa 2.59</div>
          <div className="note">Strongest –I effect</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#fb923c' }}>
          <div className="label">Cl–CH₂–COOH</div>
          <div className="pka-value">pKa 2.85</div>
          <div className="note">Strong –I effect</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#4ade80' }}>
          <div className="label">CH₃–CH₂–COOH</div>
          <div className="pka-value">pKa 4.87</div>
          <div className="note">Weak +I effect</div>
        </div>
      </div>
      
      <div className="key-insight">
        <span className="insight-icon">💡</span>
        <span>Aliphatic acids: inductive only (no resonance). Aromatic acids: both inductive and resonance operate. para-NO₂ benzoic (pKa 3.42) combines both effects.</span>
      </div>

      <style jsx>{`
        .concept-card {
          padding: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .icon {
          font-size: 20px;
        }
        
        h3 {
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin: 0;
          flex: 1;
        }
        
        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        
        .explanation {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        
        .explanation strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .comparison-item {
          padding: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          text-align: center;
        }
        
        .label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        
        .pka-value {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-geist-mono), monospace;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .note {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .key-insight {
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(139,92,246,0.1);
          border-left: 3px solid #a78bfa;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .insight-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

// ── CYCLOHEXANE AXIAL/EQUATORIAL CARD ─────────────────────────────────────────

export function AxialEquatorialCard() {
  return (
    <div className="concept-card">
      <div className="card-header">
        <span className="icon">🔗</span>
        <h3>Axial vs Equatorial COOH</h3>
        <span className="badge">Cyclohexane</span>
      </div>
      
      <p className="explanation">
        For cyclohexane dicarboxylic acids, <strong>spatial relationship between two COOH groups</strong> determines acidity. 
        When both COOH groups are <strong>axial (cis-1,2)</strong>, they are close in space and the anion can be stabilized 
        by intramolecular H-bonding.
      </p>
      
      <div className="comparison-grid">
        <div className="comparison-item" style={{ borderColor: '#78d0c0' }}>
          <div className="label">cis-1,2 (both axial)</div>
          <div className="pka-value">Lower pKa₁</div>
          <div className="note">Close proximity → H-bond</div>
        </div>
        <div className="comparison-item" style={{ borderColor: '#e08080' }}>
          <div className="label">trans-1,2 (ax + eq)</div>
          <div className="pka-value">Higher pKa₁</div>
          <div className="note">Too far apart</div>
        </div>
      </div>
      
      <div className="key-insight">
        <span className="insight-icon">💡</span>
        <span>Same principle as maleic/fumaric. Whenever two COOH groups can be on the same face of a ring or double bond, pKa₁ is dramatically lowered by intramolecular H-bonding.</span>
      </div>

      <style jsx>{`
        .concept-card {
          padding: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .icon {
          font-size: 20px;
        }
        
        h3 {
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin: 0;
          flex: 1;
        }
        
        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        
        .explanation {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        
        .explanation strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .comparison-item {
          padding: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          text-align: center;
        }
        
        .label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
        }
        
        .pka-value {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-geist-mono), monospace;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .note {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .key-insight {
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(139,92,246,0.1);
          border-left: 3px solid #a78bfa;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .insight-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
