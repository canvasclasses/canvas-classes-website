'use client';

import { useState } from 'react';
import { CA_DATA } from './acidity-lab-data2';
import type { CaRow } from './acidity-lab-data2';

type SortCol = 'y' | 'acetic' | 'ortho' | 'meta' | 'para';
type HL = { y: string; col: SortCol } | null;

function heatBg(v: number | null, sel: boolean): string {
  if (v === null) return 'rgba(255,255,255,0.03)';
  const t = Math.max(0, Math.min(1, (v - 2.0) / 3.0));
  let r: number, g: number, b: number;

  // Vibrant Diverging Palette (Strong Acid Red -> Neutral Orange -> Weak Acid Blue)
  if (t < 0.5) {
    const s = t / 0.5;
    r = 255;
    g = Math.round(45 + s * 145);    // 45 -> 190
    b = Math.round(85 - s * 45);     // 85 -> 40
  } else {
    const s = (t - 0.5) / 0.5;
    r = Math.round(255 - s * 230);   // 255 -> 25
    g = Math.round(190 - s * 60);    // 190 -> 130
    b = Math.round(40 + s * 215);    // 40 -> 255
  }

  return `rgba(${r},${g},${b},${sel ? 0.95 : 0.8})`;
}

function heatText(v: number | null, sel: boolean): string {
  if (v === null) return 'rgba(255,255,255,0.2)';
  return '#ffffff';
}

function MiniRingSVG({ sub, pos, col, pka }: { sub: string; pos: 'ortho' | 'meta' | 'para'; col: string; pka: string }) {
  const w = 150, h = 190, cx = w / 2, cy = h / 2 + 8, r = 36, bo = 3.8;
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = -Math.PI / 2 + k * Math.PI / 3;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
  const bonds: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const a = pts[i], b = pts[(i + 1) % 6], dx = b[0] - a[0], dy = b[1] - a[1];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const id2 = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
    const inx = (cx - mx) / id2, iny = (cy - my) / id2;
    bonds.push(<line key={`b${i}`} x1={(a[0] + dx * .09).toFixed(1)} y1={(a[1] + dy * .09).toFixed(1)} x2={(b[0] - dx * .09).toFixed(1)} y2={(b[1] - dy * .09).toFixed(1)} stroke="rgba(255,255,255,0.6)" strokeWidth="1.7" />);
    if (i % 2 === 0) bonds.push(<line key={`d${i}`} x1={(a[0] + dx * .18 + inx * bo).toFixed(1)} y1={(a[1] + dy * .18 + iny * bo).toFixed(1)} x2={(b[0] - dx * .18 + inx * bo).toFixed(1)} y2={(b[1] - dy * .18 + iny * bo).toFixed(1)} stroke="rgba(255,255,255,0.6)" strokeWidth="1.7" />);
  }
  const [v0x, v0y] = pts[0];
  const pi = pos === 'ortho' ? 1 : pos === 'meta' ? 2 : 3;
  const [vsx, vsy] = pts[pi];
  const odx = vsx - cx, ody = vsy - cy, olen = Math.sqrt(odx ** 2 + ody ** 2);
  const ux = odx / olen, uy = ody / olen;
  const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
  const lx = vsx + ux * 37, ly = vsy + uy * 37;
  const pkaX = pos === 'para' ? cx - r - 8 : cx;
  const pkaA = pos === 'para' ? 'end' : 'middle';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      {bonds}
      <line x1={v0x.toFixed(1)} y1={(v0y - 2).toFixed(1)} x2={v0x.toFixed(1)} y2={(v0y - 22).toFixed(1)} stroke="rgba(255,255,255,0.55)" strokeWidth="1.7" />
      <text x={v0x.toFixed(1)} y={(v0y - 32).toFixed(1)} textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(255,255,255,0.88)" fontFamily="DM Mono,monospace">COOH</text>
      <line x1={(vsx + ux * 4).toFixed(1)} y1={(vsy + uy * 4).toFixed(1)} x2={(vsx + ux * 28).toFixed(1)} y2={(vsy + uy * 28).toFixed(1)} stroke={col} strokeWidth="2.2" />
      <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={ta} dominantBaseline="middle" fontSize="15" fontWeight="700" fill={col} fontFamily="DM Mono,monospace">{sub}</text>
      <text x={pkaX.toFixed(1)} y={(cy + r + 22).toFixed(1)} textAnchor={pkaA} fontSize="16" fontWeight="800" fill="rgba(255,255,255,0.92)" fontFamily="DM Mono,monospace">{pka}</text>
    </svg>
  );
}

function TrendCard({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.88)', flex: 1 }}>{title}</span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', letterSpacing: '.06em' }}>{badge}</span>
        <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', marginLeft: 4 }}>›</span>
      </button>
      {open && <div style={{ padding: '20px 22px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{children}</div>}
    </div>
  );
}

function StructureViewer({ hl }: { hl: HL }) {
  if (!hl) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.22)', fontSize: 14, textAlign: 'center' as const, lineHeight: 2 }}>
      Click any cell in the<br />table to see the structure
    </div>
  );
  const row = CA_DATA.find(r => r.y === hl.y)!;
  const typeCol = row.type === 'ewg' ? '#ff3b30' : row.type === 'edg' ? '#34c759' : '#5856d6';
  const v = hl.col === 'y' ? null : row[hl.col as keyof CaRow] as number | null;
  const isAcetic = hl.col === 'acetic';
  const posLabel = isAcetic ? 'Aliphatic' : hl.col.charAt(0).toUpperCase() + hl.col.slice(1);
  const mech = row.type === 'ewg' ? 'EWG — stabilises carboxylate anion, increases acidity' : row.type === 'edg' ? 'EDG — destabilises carboxylate anion, decreases acidity' : 'Neutral — no significant electronic effect';

  if (isAcetic) {
    const xOff = 20 + row.y.length * 11;
    return (
      <div>
        <svg width="240" height="100" viewBox="0 0 240 100" style={{ overflow: 'visible', display: 'block', margin: '0 auto 10px' }}>
          <text x="20" y="52" fontSize="17" fontWeight="700" fill={typeCol} fontFamily="DM Mono,monospace" dominantBaseline="middle">{row.y}</text>
          <line x1={xOff} y1="52" x2={xOff + 18} y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <text x={xOff + 22} y="52" fontSize="16" fill="rgba(255,255,255,0.75)" fontFamily="DM Mono,monospace" dominantBaseline="middle">CH₂</text>
          <line x1={xOff + 58} y1="52" x2={xOff + 76} y2="52" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <text x={xOff + 80} y="52" fontSize="16" fontWeight="600" fill="rgba(255,255,255,0.9)" fontFamily="DM Mono,monospace" dominantBaseline="middle">COOH</text>
          <text x="120" y="85" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.28)" fontFamily="DM Sans,sans-serif">inductive only — no resonance</text>
        </svg>
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: typeCol, marginBottom: 8, letterSpacing: '.04em' }}>{posLabel} · {row.y}</div>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, justifyContent: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Mono,monospace' }}>pKₐ =</span>
            <span style={{ fontSize: 26, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: '#fff', lineHeight: 1 }}>{v !== null ? (v as number).toFixed(2) : '—'}</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', marginTop: 10, lineHeight: 1.65, textAlign: 'left' as const }}>{mech}</div>
        </div>
      </div>
    );
  }

  const cx = 120, cy = 118, r = 44, bo = 4;
  const pts = Array.from({ length: 6 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 3; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number]; });
  const bonds: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const a = pts[i], b = pts[(i + 1) % 6], dx = b[0] - a[0], dy = b[1] - a[1];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const id2 = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
    const inx = (cx - mx) / id2, iny = (cy - my) / id2;
    bonds.push(<line key={`b${i}`} x1={(a[0] + dx * .09).toFixed(1)} y1={(a[1] + dy * .09).toFixed(1)} x2={(b[0] - dx * .09).toFixed(1)} y2={(b[1] - dy * .09).toFixed(1)} stroke="rgba(255,255,255,0.72)" strokeWidth="2" />);
    if (i % 2 === 0) bonds.push(<line key={`d${i}`} x1={(a[0] + dx * .18 + inx * bo).toFixed(1)} y1={(a[1] + dy * .18 + iny * bo).toFixed(1)} x2={(b[0] - dx * .18 + inx * bo).toFixed(1)} y2={(b[1] - dy * .18 + iny * bo).toFixed(1)} stroke="rgba(255,255,255,0.72)" strokeWidth="2" />);
  }
  const [v0x, v0y] = pts[0];
  const pi = hl.col === 'ortho' ? 1 : hl.col === 'meta' ? 2 : 3;
  const [vsx, vsy] = pts[pi];
  const odx = vsx - cx, ody = vsy - cy, olen = Math.sqrt(odx ** 2 + ody ** 2);
  const ux = odx / olen, uy = ody / olen;
  const ta = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
  const lx = vsx + ux * 40, ly = vsy + uy * 40;
  return (
    <div>
      <svg width="240" height="195" viewBox="0 0 240 195" style={{ overflow: 'visible', display: 'block', margin: '0 auto 10px' }}>
        {bonds}
        <line x1={v0x.toFixed(1)} y1={(v0y - 2).toFixed(1)} x2={v0x.toFixed(1)} y2={(v0y - 30).toFixed(1)} stroke="rgba(255,255,255,0.65)" strokeWidth="2" />
        <text x={v0x.toFixed(1)} y={(v0y - 44).toFixed(1)} textAnchor="middle" fontSize="17" fontWeight="700" fill="rgba(255,255,255,0.92)" fontFamily="DM Mono,monospace">COOH</text>
        <line x1={(vsx + ux * 4).toFixed(1)} y1={(vsy + uy * 4).toFixed(1)} x2={(vsx + ux * 30).toFixed(1)} y2={(vsy + uy * 30).toFixed(1)} stroke={typeCol} strokeWidth="2.4" />
        <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={ta} dominantBaseline="middle" fontSize="17" fontWeight="700" fill={typeCol} fontFamily="DM Mono,monospace">{row.y}</text>
      </svg>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: typeCol, marginBottom: 8, letterSpacing: '.04em' }}>{posLabel} · {row.y}</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Mono,monospace' }}>pKₐ =</span>
          <span style={{ fontSize: 26, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: '#fff', lineHeight: 1 }}>{v !== null ? (v as number).toFixed(2) : '—'}</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', marginTop: 10, lineHeight: 1.65, textAlign: 'left' as const }}>{mech}</div>
      </div>
    </div>
  );
}

function CisTransTrend() {
  return (
    <TrendCard title="cis vs trans Acid Strength" badge="Geometry">
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 20 }}>
        <strong style={{ color: 'rgba(255,255,255,0.88)' }}>cis-acids are generally more acidic than trans-acids.</strong> The cis geometry allows{' '}
        <strong style={{ color: '#78d0c0' }}>intramolecular hydrogen bonding</strong> in the product anion, stabilising the carboxylate and lowering pKa₁.
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 20 }}>
        {[
          { label: 'cis (maleic)', pka: '1.92', col: '#78d0c0', note: 'H-bond stabilises anion after first ionisation' },
          { label: 'trans (fumaric)', pka: '3.02', col: '#e08080', note: 'No intramolecular H-bond possible' },
        ].map(item => (
          <div key={item.label} style={{ flex: 1, minWidth: 150, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.col}30`, textAlign: 'center' as const }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: item.col, marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: item.col, lineHeight: 1 }}>pKa₁ {item.pka}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{item.note}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(100,200,180,0.07)', border: '1px solid rgba(100,200,180,0.18)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(100,200,180,0.7)', marginBottom: 5 }}>Why maleic pKa₁ = 1.92</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
          After ionisation of one COOH, the carboxylate (COO⁻) in maleic acid forms a strong <strong style={{ color: '#fff' }}>intramolecular H-bond</strong> with the adjacent COOH.
          This extra stabilisation dramatically lowers pKa₁. Fumaric acid cannot do this (groups are trans, too far apart).
        </div>
      </div>
    </TrendCard>
  );
}

function CyclicTrend() {
  return (
    <TrendCard title="Cyclic Acids & s-Character" badge="Ring Strain">
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 20 }}>
        C–H acidity increases with <strong style={{ color: 'rgba(255,255,255,0.88)' }}>% s-character</strong> of the carbon orbital.
        Ring strain in small rings forces smaller C–C–C bond angles, requiring <strong style={{ color: '#e0c878' }}>more p-character in ring bonds</strong>,
        leaving more s-character in the C–H bonds. Higher s-character = better anion stabilisation = lower pKa.
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 20, alignItems: 'center' }}>
        {[
          { label: 'Cyclopropane', pka: 'pKa 39', note: '60° bond angle', col: '#78d0c0' },
          { label: 'Cyclobutane', pka: 'pKa 43', note: '~90° bond angle', col: '#e0c878' },
          { label: 'Propane', pka: 'pKa 50', note: '~109.5° (sp³)', col: '#e08080' },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'center' as const, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.col}30`, minWidth: 110 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.col, marginBottom: 5 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: '#fff' }}>{item.pka}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{item.note}</div>
            </div>
            {i < arr.length - 1 && <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}>&gt;</span>}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { title: 'Bond Angles', body: 'Cyclopropane: 60° (forced)\nCyclobutane: ~90°\nPropane: ~109.5°', highlight: 'Smaller angle → more p in ring → more s in C–H' },
          { title: 'Hybridisation Series', body: 'sp³ C–H: pKa ~50\nsp² C–H: pKa ~44 (alkene)\nsp C–H: pKa ~25 (alkyne)', highlight: 'More s-character → more acidic' },
        ].map(card => (
          <div key={card.title} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>{card.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, whiteSpace: 'pre-line' as const }}>{card.body}</div>
            <div style={{ fontSize: 12, color: '#e0c878', marginTop: 6 }}>{card.highlight}</div>
          </div>
        ))}
      </div>
    </TrendCard>
  );
}

function AxEqTrend() {
  return (
    <TrendCard title="Axial vs Equatorial COOH" badge="Cyclohexane">
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 20 }}>
        For cyclohexane dicarboxylic acids, the <strong style={{ color: 'rgba(255,255,255,0.88)' }}>spatial relationship between two COOH groups</strong> determines acidity.
        When both COOH groups are <strong style={{ color: '#78d0c0' }}>axial</strong> (cis-1,2), they are close in space and the anion formed after first ionisation
        can be stabilised by <strong style={{ color: '#78d0c0' }}>intramolecular H-bonding</strong>.
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const, marginBottom: 20 }}>
        {[
          { label: 'cis-1,2 (both axial)', pka: 'pKa₁ lower', note: 'Both groups point up — close proximity enables intramolecular H-bond in carboxylate → lower pKa₁ (more acidic)', col: '#78d0c0' },
          { label: 'trans-1,2 (ax + eq)', pka: 'pKa₁ higher', note: 'Groups on opposite faces — too far apart for H-bonding → higher pKa₁ (less acidic)', col: '#e08080' },
        ].map(item => (
          <div key={item.label} style={{ flex: 1, minWidth: 180, padding: '14px 16px', borderRadius: 12, background: `rgba(255,255,255,0.03)`, border: `1px solid ${item.col}25` }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: item.col, marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: item.col, marginBottom: 6 }}>{item.pka}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.note}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: 5 }}>JEE Key Point</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
          The same principle applies to maleic/fumaric acids. Whenever two COOH groups can be on the same face of a ring or double bond,
          the first pKa is dramatically lowered by intramolecular H-bonding in the anion.
        </div>
      </div>
    </TrendCard>
  );
}

function OrthoEffect() {
  const cases: { sub: string; pos: 'ortho' | 'meta' | 'para'; col: string; pka: string; note: string }[] = [
    { sub: 'H', pos: 'ortho', col: '#a8a8cc', pka: '4.20', note: 'Reference' },
    { sub: 'CH₃', pos: 'ortho', col: '#60c080', pka: '3.91', note: 'EDG, but ortho → acidity increase (steric inhibition of resonance)' },
    { sub: 'C₂H₅', pos: 'ortho', col: '#60c080', pka: '3.79', note: 'Bulkier → stronger steric effect' },
    { sub: 'CH₃', pos: 'para', col: '#60c080', pka: '4.38', note: 'Para-CH₃ is EDG → raises pKa (less acidic)' },
    { sub: 'CH₃', pos: 'meta', col: '#60c080', pka: '4.27', note: 'Meta-CH₃: weak +I → slightly less acidic than H' },
  ];
  return (
    <TrendCard title="Ortho Effect" badge="Steric + Field">
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 20 }}>
        The <strong style={{ color: 'rgba(255,255,255,0.88)' }}>ortho effect</strong>: ortho-alkyl benzoic acids are <em>more</em> acidic than para isomers despite alkyl being EDG.
        Two factors: <strong style={{ color: '#e0c878' }}>steric inhibition of resonance</strong> + <strong style={{ color: '#e0c878' }}>field effect</strong> through space.
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'flex', gap: 10, minWidth: 'max-content' }}>
          {cases.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 140 }}>
              <MiniRingSVG sub={c.sub} pos={c.pos} col={c.col} pka={c.pka} />
              <div style={{ fontSize: 11, color: 'rgba(200,200,210,0.5)', textAlign: 'center' as const, maxWidth: 130, lineHeight: 1.5, marginTop: 4 }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(200,180,50,0.08)', border: '1px solid rgba(200,180,50,0.2)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(200,180,50,0.7)', marginBottom: 5 }}>JEE Key Point</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
          For alkyl groups: <strong style={{ color: '#fff' }}>ortho &gt; meta ≈ para</strong> in acidity. For EWG (–NO₂, –CN): ortho is most acidic via direct resonance stabilisation.
        </div>
      </div>
    </TrendCard>
  );
}

export default function AcidPatternsTab() {
  const [sortCol, setSortCol] = useState<SortCol>('acetic');
  const [hl, setHl] = useState<HL>(null);

  const sorted = [...CA_DATA].sort((a, b) => {
    if (sortCol === 'y') return a.y.localeCompare(b.y);
    const av = a[sortCol as keyof CaRow] as number | null;
    const bv = b[sortCol as keyof CaRow] as number | null;
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return av - bv;
  });

  const dotCol: Record<string, string> = { ewg: '#ff3b30', edg: '#34c759', neutral: '#5856d6' };
  const cols: { key: SortCol; label: string }[] = [
    { key: 'y', label: 'Substituent' },
    { key: 'acetic', label: 'Y–CH₂COOH' },
    { key: 'ortho', label: 'ortho' },
    { key: 'meta', label: 'meta' },
    { key: 'para', label: 'para' },
  ];

  const thBase: React.CSSProperties = { padding: '8px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#dddae8', marginBottom: 3 }}>Acid Patterns & Trends</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)' }}>pKa data for substituted acetic and benzoic acids · click any cell to see the structure</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 270px', gap: 16, marginBottom: 32 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr>
                <th colSpan={2} style={{ ...thBase, textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>Aliphatic</th>
                <th colSpan={3} style={{ ...thBase, color: 'rgba(255,255,255,0.3)' }}>Benzoic acid (Y–C₆H₄–COOH)</th>
              </tr>
              <tr>
                {cols.map(c => (
                  <th key={c.key} onClick={() => setSortCol(c.key)}
                    style={{ ...thBase, color: c.key === sortCol ? '#c8b4e8' : 'rgba(255,255,255,0.4)', borderRight: c.key === 'acetic' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                    {c.label}{c.key === sortCol ? ' ↑' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(row => (
                <tr key={row.y} style={{ background: hl?.y === row.y ? 'rgba(255,255,255,0.04)' : 'transparent', cursor: 'pointer' }}>
                  <td style={{ padding: '9px 4px 9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: dotCol[row.type], marginRight: 8, verticalAlign: 'middle' }} />
                    {row.y}
                  </td>
                  {(['acetic', 'ortho', 'meta', 'para'] as const).map((col, ci) => {
                    const v = row[col];
                    const isSel = hl?.y === row.y && hl?.col === col;
                    return (
                      <td key={col} onClick={() => setHl({ y: row.y, col })}
                        style={{ padding: '9px 14px', textAlign: 'center', fontFamily: 'DM Mono,monospace', fontSize: 14, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)', borderRight: ci === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: heatBg(v, isSel), color: heatText(v, isSel), outline: isSel ? '2px solid rgba(255,255,255,0.45)' : 'none', outlineOffset: -2, cursor: 'pointer', transition: 'background .2s' }}>
                        {v !== null ? v.toFixed(2) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 14px', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <StructureViewer hl={hl} />
        </div>
      </div>

      <div style={{ marginBottom: 28, padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Key Patterns</div>
        {[
          'EWG (–NO₂, –CN, –Cl) always lower pKa — stronger acid',
          'EDG (–NH₂, –OCH₃, –CH₃) always raise pKa — weaker acid',
          'Aliphatic acids: only inductive effect operates (no resonance through CH₂)',
          'Benzoic acids: both inductive AND resonance effects; para = maximum resonance',
          'Ortho anomaly: even EDG groups can increase acidity at ortho (steric + field)',
        ].map((pt, i) => (
          <div key={i} style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', paddingLeft: 18, position: 'relative', marginBottom: 2 }}>
            <span style={{ position: 'absolute', left: 0, color: 'rgba(180,150,220,0.7)', fontWeight: 700 }}>→</span>
            {pt}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.22)', marginBottom: 14 }}>Acidity Trends</div>
      <OrthoEffect />
      <CisTransTrend />
      <CyclicTrend />
      <AxEqTrend />
      <ActiveMethylenePkaTable />
    </div>
  );
}

function ActiveMethylenePkaTable() {
  const red = "#ef4444";
  const bond = "rgba(255,255,255,0.7)";
  const textFill = "rgba(255,255,255,0.9)";

  const PKA_DATA_LEFT = [
    {
      type: '[1] Amide', pka: '30', svg: (
        <svg width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
          <text x="10" y="27" fill={red} fontSize="14" fontWeight="bold">H</text>
          <line x1="23" y1="21" x2="35" y2="40" stroke={bond} strokeWidth="1.5" />
          <line x1="35" y1="40" x2="55" y2="25" stroke={bond} strokeWidth="1.5" />
          <line x1="53" y1="26" x2="53" y2="10" stroke={bond} strokeWidth="1.5" />
          <line x1="58" y1="26" x2="58" y2="10" stroke={bond} strokeWidth="1.5" />
          <text x="55" y="8" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="55" y1="25" x2="72" y2="40" stroke={bond} strokeWidth="1.5" />
          <text x="76" y="47" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">N</text>
          <line x1="76" y1="50" x2="76" y2="65" stroke={bond} strokeWidth="1.5" />
          <line x1="84" y1="43" x2="100" y2="43" stroke={bond} strokeWidth="1.5" />
        </svg>
      )
    },
    {
      type: '[2] Nitrile', pka: '25', svg: (
        <svg width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
          <text x="20" y="40" fill={red} fontSize="14" fontWeight="bold">H</text>
          <line x1="32" y1="36" x2="45" y2="45" stroke={bond} strokeWidth="1.5" />
          <line x1="45" y1="45" x2="65" y2="25" stroke={bond} strokeWidth="1.5" />
          <text x="68" y="27" fill={textFill} fontSize="14" fontFamily="DM Mono,monospace">CN</text>
        </svg>
      )
    },
    {
      type: '[3] Ester', pka: '25', svg: (
        <svg width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
          <text x="5" y="27" fill={red} fontSize="14" fontWeight="bold">H</text>
          <line x1="18" y1="21" x2="30" y2="40" stroke={bond} strokeWidth="1.5" />
          <line x1="30" y1="40" x2="45" y2="25" stroke={bond} strokeWidth="1.5" />
          <line x1="43" y1="26" x2="43" y2="10" stroke={bond} strokeWidth="1.5" />
          <line x1="48" y1="26" x2="48" y2="10" stroke={bond} strokeWidth="1.5" />
          <text x="45" y="8" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="45" y1="25" x2="60" y2="40" stroke={bond} strokeWidth="1.5" />
          <text x="65" y="48" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="72" y1="42" x2="85" y2="30" stroke={bond} strokeWidth="1.5" />
          <line x1="85" y1="30" x2="105" y2="45" stroke={bond} strokeWidth="1.5" />
        </svg>
      )
    },
    {
      type: '[4] Ketone', pka: '19.2', svg: (
        <svg width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
          <text x="15" y="27" fill={red} fontSize="14" fontWeight="bold">H</text>
          <line x1="28" y1="21" x2="40" y2="40" stroke={bond} strokeWidth="1.5" />
          <line x1="40" y1="40" x2="55" y2="25" stroke={bond} strokeWidth="1.5" />
          <line x1="53" y1="26" x2="53" y2="10" stroke={bond} strokeWidth="1.5" />
          <line x1="58" y1="26" x2="58" y2="10" stroke={bond} strokeWidth="1.5" />
          <text x="55" y="8" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="55" y1="25" x2="75" y2="45" stroke={bond} strokeWidth="1.5" />
        </svg>
      )
    },
    {
      type: '[5] Aldehyde', pka: '17', svg: (
        <svg width="120" height="80" viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
          <text x="15" y="27" fill={red} fontSize="14" fontWeight="bold">H</text>
          <line x1="28" y1="21" x2="40" y2="40" stroke={bond} strokeWidth="1.5" />
          <line x1="40" y1="40" x2="55" y2="25" stroke={bond} strokeWidth="1.5" />
          <line x1="53" y1="26" x2="53" y2="10" stroke={bond} strokeWidth="1.5" />
          <line x1="58" y1="26" x2="58" y2="10" stroke={bond} strokeWidth="1.5" />
          <text x="55" y="8" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="55" y1="25" x2="70" y2="40" stroke={bond} strokeWidth="1.5" />
          <text x="73" y="48" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">H</text>
        </svg>
      )
    }
  ];

  const PKA_DATA_RIGHT = [
    {
      type: '[6] 1,3-Diester', pka: '13.3', svg: (
        <svg width="180" height="80" viewBox="0 0 180 80" style={{ overflow: 'visible' }}>
          <line x1="10" y1="45" x2="25" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="25" y1="35" x2="35" y2="45" stroke={bond} strokeWidth="1.5" />
          <text x="42" y="52" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="49" y1="45" x2="60" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="58" y1="34" x2="58" y2="18" stroke={bond} strokeWidth="1.5" />
          <line x1="63" y1="34" x2="63" y2="18" stroke={bond} strokeWidth="1.5" />
          <text x="60" y="15" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="60" y1="35" x2="80" y2="48" stroke={bond} strokeWidth="1.5" />
          <line x1="80" y1="48" x2="80" y2="60" stroke={bond} strokeWidth="1.5" />
          <text x="80" y="75" fill={red} fontSize="14" fontWeight="bold" textAnchor="middle">H</text>
          <line x1="80" y1="48" x2="100" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="97" y1="34" x2="97" y2="18" stroke={bond} strokeWidth="1.5" />
          <line x1="102" y1="34" x2="102" y2="18" stroke={bond} strokeWidth="1.5" />
          <text x="100" y="15" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="100" y1="35" x2="111" y2="45" stroke={bond} strokeWidth="1.5" />
          <text x="118" y="52" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="125" y1="45" x2="135" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="135" y1="35" x2="150" y2="45" stroke={bond} strokeWidth="1.5" />
        </svg>
      )
    },
    {
      type: '[7] 1,3-Dinitrile', pka: '11', svg: (
        <svg width="180" height="80" viewBox="0 0 180 80" style={{ overflow: 'visible' }}>
          <text x="40" y="45" fill={textFill} fontSize="14" textAnchor="end" fontFamily="DM Mono,monospace">NC</text>
          <line x1="45" y1="40" x2="65" y2="50" stroke={bond} strokeWidth="1.5" />
          <line x1="65" y1="50" x2="85" y2="40" stroke={bond} strokeWidth="1.5" />
          <text x="90" y="45" fill={textFill} fontSize="14" textAnchor="start" fontFamily="DM Mono,monospace">CN</text>
          <line x1="65" y1="50" x2="65" y2="35" stroke={bond} strokeWidth="1.5" />
          <text x="65" y="30" fill={red} fontSize="14" fontWeight="bold" textAnchor="middle">H</text>
        </svg>
      )
    },
    {
      type: '[8] β-Keto ester', pka: '10.7', svg: (
        <svg width="180" height="80" viewBox="0 0 180 80" style={{ overflow: 'visible' }}>
          <line x1="20" y1="48" x2="40" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="38" y1="34" x2="38" y2="18" stroke={bond} strokeWidth="1.5" />
          <line x1="43" y1="34" x2="43" y2="18" stroke={bond} strokeWidth="1.5" />
          <text x="40" y="15" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="40" y1="35" x2="60" y2="48" stroke={bond} strokeWidth="1.5" />
          <line x1="60" y1="48" x2="60" y2="60" stroke={bond} strokeWidth="1.5" />
          <text x="60" y="75" fill={red} fontSize="14" fontWeight="bold" textAnchor="middle">H</text>
          <line x1="60" y1="48" x2="80" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="77" y1="34" x2="77" y2="18" stroke={bond} strokeWidth="1.5" />
          <line x1="82" y1="34" x2="82" y2="18" stroke={bond} strokeWidth="1.5" />
          <text x="80" y="15" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="80" y1="35" x2="91" y2="45" stroke={bond} strokeWidth="1.5" />
          <text x="98" y="52" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="105" y1="45" x2="115" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="115" y1="35" x2="130" y2="45" stroke={bond} strokeWidth="1.5" />
        </svg>
      )
    },
    {
      type: '[9] β-Diketone', pka: '9', svg: (
        <svg width="180" height="80" viewBox="0 0 180 80" style={{ overflow: 'visible' }}>
          <line x1="30" y1="48" x2="50" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="48" y1="34" x2="48" y2="18" stroke={bond} strokeWidth="1.5" />
          <line x1="53" y1="34" x2="53" y2="18" stroke={bond} strokeWidth="1.5" />
          <text x="50" y="15" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="50" y1="35" x2="70" y2="48" stroke={bond} strokeWidth="1.5" />
          <line x1="70" y1="48" x2="70" y2="60" stroke={bond} strokeWidth="1.5" />
          <text x="70" y="75" fill={red} fontSize="14" fontWeight="bold" textAnchor="middle">H</text>
          <line x1="70" y1="48" x2="90" y2="35" stroke={bond} strokeWidth="1.5" />
          <line x1="87" y1="34" x2="87" y2="18" stroke={bond} strokeWidth="1.5" />
          <line x1="92" y1="34" x2="92" y2="18" stroke={bond} strokeWidth="1.5" />
          <text x="90" y="15" fill={textFill} fontSize="14" textAnchor="middle" fontFamily="DM Mono,monospace">O</text>
          <line x1="90" y1="35" x2="110" y2="48" stroke={bond} strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  const tableHeaderStyle = { display: 'flex', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '.08em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8, marginBottom: 8, padding: '0 8px 8px 8px' };
  const th1Style = { width: '33%' };
  const th2Style = { width: '40%', textAlign: 'center' as const };
  const th3Style = { width: '27%', textAlign: 'right' as const };

  const TableHeader = () => (
    <div style={tableHeaderStyle}>
      <div style={th1Style}>Compound type</div>
      <div style={th2Style}>Example</div>
      <div style={{ ...th3Style, paddingRight: 8 }}>pKₐ</div>
    </div>
  );

  const TableRow = ({ item }: { item: any }) => (
    <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '8px', fontSize: 13 }}>
      <div style={{ width: '33%', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item.type}</div>
      <div style={{ width: '40%', display: 'flex', justifyContent: 'center' }}>{item.svg}</div>
      <div style={{ width: '27%', textAlign: 'right', fontFamily: 'DM Mono,monospace', fontWeight: 700, color: '#34d399', fontSize: 15, paddingRight: 8 }}>{item.pka}</div>
    </div>
  );

  return (
    <TrendCard title="Important pKa Values (α-Hydrogen Acidity)" badge="Active Methylene">
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 20 }}>
        The acidity of <strong style={{ color: 'rgba(255,255,255,0.88)' }}>α-hydrogens</strong> next to carbonyls or electron-withdrawing groups is dramatically increased due to resonance stabilisation of the resulting carbanion (enolate).
        Compounds with two EWGs (<strong style={{ color: '#78d0c0' }}>active methylene compounds</strong>) are particularly acidic.
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 16 }}>
        <div style={{ flex: '1 1 300px', minWidth: 280 }}>
          <TableHeader />
          {PKA_DATA_LEFT.map(item => <TableRow key={item.type} item={item} />)}
        </div>
        <div style={{ flex: '1 1 300px', minWidth: 280 }}>
          <TableHeader />
          {PKA_DATA_RIGHT.map(item => <TableRow key={item.type} item={item} />)}
        </div>
      </div>
    </TrendCard>
  );
}
