'use client';

/**
 * Molar Conductivity vs √C Explorer
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry) —
 * "Variation of molar conductivity with concentration".
 *  - STRONG electrolyte: Λm = Λ°m − A√C (Debye–Hückel–Onsager), nearly linear,
 *    so Λ°m is read off by extrapolating the line to C → 0.
 *    Illustrative KCl: Λ°m = 149.9 S cm² mol⁻¹ (NCERT), here Λm ≈ 149.9 − 38√C.
 *  - WEAK electrolyte: Λm rises steeply as C → 0 (no straight part to
 *    extrapolate) — Λ°m must instead come from Kohlrausch's law.
 *    For a weak acid, α = √(Ka/C) and Λm = α·Λ°m. CH₃COOH: Λ°m = 390.7
 *    S cm² mol⁻¹, Ka = 1.8×10⁻⁵ (NCERT).
 *  - Degree of dissociation for weak electrolytes: α = Λm / Λ°m.
 *
 * Pedagogical goal: drag the concentration and watch the marker ride the curve —
 * see the strong line extrapolate cleanly to Λ°m while the weak curve rockets up
 * near the axis (so it cannot be extrapolated, which is exactly why Kohlrausch's
 * law is needed). The weak mode also shows α changing with dilution.
 */

import { useState } from 'react';

type Kind = 'strong' | 'weak';
const KA = 1.8e-5;
const L0 = { strong: 149.9, weak: 390.7 };

// plot geometry
const LEFT = 92, RIGHT = 712, TOP = 48, BOTTOM = 398;
const XMAX = 0.37; // √C axis max
const YMAX = 420; // Λm axis max
const xOf = (sc: number) => LEFT + (sc / XMAX) * (RIGHT - LEFT);
const yOf = (lm: number) => BOTTOM - (lm / YMAX) * (BOTTOM - TOP);

function lambda(kind: Kind, sc: number): number {
  if (kind === 'strong') return Math.max(0, L0.strong - 38 * sc);
  const C = sc * sc;
  const alpha = Math.min(1, Math.sqrt(KA / C));
  return alpha * L0.weak;
}

// palette (workflow §3)
const STRONG_C = '#34d399';
const WEAK_C = '#fbbf24';
const INDIGO = '#818cf8';

function curvePoints(kind: Kind): string {
  const pts: string[] = [];
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const sc = 0.002 + (XMAX - 0.002) * (i / N);
    pts.push(`${xOf(sc).toFixed(1)},${yOf(lambda(kind, sc)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function fmtConc(c: number): string {
  if (c >= 0.01) return c.toFixed(3);
  if (c >= 0.0001) return c.toFixed(4);
  return c.toExponential(1).replace('e', ' × 10^').replace('+', '');
}

export default function MolarConductivityCurveSim() {
  const [kind, setKind] = useState<Kind>('strong');
  const [sc, setSc] = useState(0.2); // √C
  const color = kind === 'strong' ? STRONG_C : WEAK_C;
  const C = sc * sc;
  const Lm = lambda(kind, sc);
  const L0v = L0[kind];
  const alpha = kind === 'weak' ? Math.min(1, Math.sqrt(KA / C)) : null;

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Molar Conductivity <span style={{ color: '#7c3aed' }}>vs √C</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Why strong extrapolates and weak doesn’t · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>{kind === 'strong' ? 'KCl' : 'CH₃COOH'}</div>
      </div>

      {/* tabs (§4g) */}
      <div className="flex mb-5 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {(['strong', 'weak'] as Kind[]).map((k) => {
          const active = k === kind;
          const c = k === 'strong' ? STRONG_C : WEAK_C;
          return (
            <button key={k} onClick={() => { setKind(k); setSc(0.2); }}
              className="px-5 py-3 text-center transition-all"
              style={{ background: 'none', outline: 'none', borderBottom: `2px solid ${active ? c : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.55, marginBottom: -1 }}>
              <div className="text-sm font-black" style={{ color: active ? c : '#94a3b8' }}>{k === 'strong' ? 'Strong (KCl)' : 'Weak (CH₃COOH)'}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>{k === 'strong' ? 'Λ°m = 149.9' : 'Λ°m = 390.7'}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">
        {/* plot */}
        <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 420, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <svg width="100%" height="100%" viewBox="0 0 760 460" style={{ minHeight: 420 }}>
            {/* axes */}
            <line x1={LEFT} y1={TOP} x2={LEFT} y2={BOTTOM} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            {/* y ticks */}
            {[0, 100, 200, 300, 400].map((v) => (
              <g key={v}>
                <line x1={LEFT - 4} y1={yOf(v)} x2={LEFT} y2={yOf(v)} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x={LEFT - 8} y={yOf(v) + 3} fontSize="10" fill="#64748b" textAnchor="end" className="tabular-nums">{v}</text>
              </g>
            ))}
            {/* x ticks */}
            {[0.1, 0.2, 0.3].map((v) => (
              <g key={v}>
                <line x1={xOf(v)} y1={BOTTOM} x2={xOf(v)} y2={BOTTOM + 4} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x={xOf(v)} y={BOTTOM + 16} fontSize="10" fill="#64748b" textAnchor="middle" className="tabular-nums">{v.toFixed(1)}</text>
              </g>
            ))}
            <text x={(LEFT + RIGHT) / 2} y={BOTTOM + 34} fontSize="11" fontWeight="700" fill="#94a3b8" textAnchor="middle">√C  (mol L⁻¹)^½</text>
            <text x={26} y={(TOP + BOTTOM) / 2} fontSize="11" fontWeight="700" fill="#94a3b8" textAnchor="middle" transform={`rotate(-90 26 ${(TOP + BOTTOM) / 2})`}>Λm  (S cm² mol⁻¹)</text>

            {/* faint other curve for contrast */}
            <polyline points={curvePoints(kind === 'strong' ? 'weak' : 'strong')} fill="none" stroke={kind === 'strong' ? WEAK_C : STRONG_C} strokeWidth="1.2" opacity="0.18" strokeDasharray="3 4" />

            {/* Λ°m target line + intercept */}
            <line x1={LEFT} y1={yOf(L0v)} x2={RIGHT} y2={yOf(L0v)} stroke={color} strokeWidth="1" strokeDasharray="4 5" opacity="0.5" />
            <text x={RIGHT - 4} y={yOf(L0v) - 5} fontSize="10.5" fontWeight="800" fill={color} textAnchor="end">Λ°m = {L0v}</text>

            {/* the curve */}
            <polyline points={curvePoints(kind)} fill="none" stroke={color} strokeWidth="3" />

            {/* strong: show the clean extrapolation to the intercept */}
            {kind === 'strong' && (
              <g>
                <circle cx={xOf(0)} cy={yOf(L0v)} r="5" fill={color} />
                <text x={xOf(0) + 8} y={yOf(L0v) - 8} fontSize="10" fontWeight="700" fill={color}>extrapolate → Λ°m</text>
              </g>
            )}
            {/* weak: flag the un-extrapolatable rise */}
            {kind === 'weak' && (
              <text x={xOf(0.02)} y={yOf(330)} fontSize="10.5" fontWeight="700" fill={WEAK_C}>steep — can’t extrapolate ✗</text>
            )}

            {/* current marker + crosshairs */}
            <line x1={xOf(sc)} y1={yOf(Lm)} x2={xOf(sc)} y2={BOTTOM} stroke={INDIGO} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1={LEFT} y1={yOf(Lm)} x2={xOf(sc)} y2={yOf(Lm)} stroke={INDIGO} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx={xOf(sc)} cy={yOf(Lm)} r="7" fill={INDIGO} stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* readout + slider */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl px-4 py-4" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: '#94a3b8' }}>At this concentration</div>
            <div className="space-y-1.5 text-[13px] tabular-nums">
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>C</span><span style={{ color: '#cbd5e1' }}>{fmtConc(C)} mol L⁻¹</span></div>
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>√C</span><span style={{ color: '#cbd5e1' }}>{sc.toFixed(3)}</span></div>
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>Λm</span><span className="font-black" style={{ color }}>{Lm.toFixed(1)} S cm² mol⁻¹</span></div>
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>Λ°m (limiting)</span><span style={{ color: '#cbd5e1' }}>{L0v} S cm² mol⁻¹</span></div>
              {alpha !== null && (
                <div className="flex justify-between pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}><span className="font-black" style={{ color: '#94a3b8' }}>α = Λm / Λ°m</span><span className="font-black" style={{ color: WEAK_C }}>{alpha.toFixed(3)}</span></div>
              )}
            </div>
          </div>

          {/* slider */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Dilute ← → concentrate</span>
              <span className="text-[12px] font-black tabular-nums" style={{ color: INDIGO }}>√C = {sc.toFixed(3)}</span>
            </div>
            <input type="range" min={0.005} max={0.36} step={0.005} value={sc} onChange={(e) => setSc(parseFloat(e.target.value))} className="w-full" style={{ accentColor: INDIGO, direction: 'rtl' }} />
            <div className="flex justify-between text-[9px] mt-0.5" style={{ color: '#475569' }}><span>more dilute (C→0)</span><span>more concentrated</span></div>
          </div>

          {/* verdict */}
          <div className="rounded-xl px-4 py-3.5" style={{ background: `${color}12`, border: `1px solid ${color}40` }}>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
              {kind === 'strong'
                ? 'A strong electrolyte is fully dissociated; Λm falls only gently (and almost linearly) with √C. Slide all the way to C → 0 and the line meets the axis at Λ°m — so you can simply extrapolate to find the limiting value.'
                : 'A weak electrolyte is barely dissociated when concentrated, so Λm is tiny — then it climbs steeply as you dilute (α rises toward 1). Because the curve has no straight portion near the axis, you cannot extrapolate it; Λ°m must come from Kohlrausch’s law instead.'}
            </p>
          </div>
        </div>
      </div>

      {/* Expert Tip (§4j) */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;The <span style={{ color: STRONG_C }}>shape of the curve</span> tells you the type: a gentle, near-straight fall = strong electrolyte (extrapolate it to Λ°m); a curve that shoots up near the axis = weak electrolyte (use Kohlrausch). And for any weak electrolyte, α = Λm/Λ°m hands you the degree of dissociation directly.&rdquo;
        </p>
      </div>
    </div>
  );
}
