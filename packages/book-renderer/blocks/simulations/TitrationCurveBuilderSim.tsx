'use client';

// ──────────────────────────────────────────────────────────────────────────
// Titration Curve Builder  ·  simulation_id: 'titration-curve-builder'
// Class 11 Chemistry · Ionic Equilibrium · "Titration Curves and Indicators" page
//
// Build an acid–base titration curve drop by drop. Creep up on the equivalence
// point, watch the buffer region (pH = pKa at half-neutralisation), the steep
// jump, and learn to CHOOSE an indicator whose colour-change window straddles
// that jump. Three titration types via a tab selector:
//
//   1. Strong Acid – Strong Base (SA–SB)   equivalence pH = 7
//   2. Weak Acid – Strong Base   (WA–SB)   buffer region; equivalence pH > 7
//   3. Strong Acid – Weak Base   (SA–WB)   equivalence pH < 7
//
// Layout mirrors the FOUNDER-APPROVED HydrogenSpectrumDecoderSim:
//   guided beat strip + narration · hero canvas (the pH curve) · controls
//   below · burette/beaker visual · live readout panel · rAF loop + sizing.
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7) —
// every formula is standard NCERT Class 11 (Equilibrium, §7.x ionic equilibrium)
// / JEE–NEET syllabus, NOT generated from training knowledge. Notation:
//   Ca,Va = analyte conc & volume (in the flask);  Cb = titrant conc;
//   Vb = titrant volume added;  V = Va + Vb (total);  Kw = 1e-14, pKw = 14.
//   Acetic acid:  Ka = 1.8×10⁻⁵, pKa = 4.74.   Ammonia: Kb = 1.8×10⁻⁵, pKb = 4.74.
//
//  ── SA–SB ──
//   before eq:  [H+]  = (Ca·Va − Cb·Vb)/V          → pH = −log[H+]
//   at eq:      pH = 7
//   after eq:   [OH−] = (Cb·Vb − Ca·Va)/V          → pOH = −log[OH−]; pH = 14 − pOH
//
//  ── WA–SB (weak acid analyte, strong base titrant) ──
//   Vb = 0:        pH = ½(pKa − log Ca)            (pure weak acid)
//   0 < Vb < Veq:  pH = pKa + log( Cb·Vb / (Ca·Va − Cb·Vb) )   (Henderson buffer)
//                  ⇒ pH = pKa exactly at Vb = Veq/2 (half-equivalence)
//   at eq:         Cs = Ca·Va/V (conjugate base/salt);
//                  pH = ½(pKw + pKa + log Cs)      ( > 7, salt hydrolysis)
//   after eq:      excess strong base as in SA–SB
//
//  ── SA–WB (strong acid analyte, weak base titrant) — mirror image ──
//   before eq:     [H+] = (Ca·Va − Cb·Vb)/V        → pH (acidic, as SA–SB before eq)
//   at eq:         Cs = Ca·Va/V (conjugate acid/salt);
//                  pH = ½(pKw − pKb − log Cs)      ( < 7, salt hydrolysis)
//   after eq:      excess weak base buffer:
//                  pOH = pKb + log( excess base / conjugate acid ); pH = 14 − pOH
//                  (limiting to weak-base pH = 14 − ½(pKb − log C) far past eq)
//
//  Singularities (Vb→0 for SA, exact equivalence) are clamped/limited so the
//  curve stays smooth and pH ∈ [0, 14]. Curve is sampled at ~240 volumes.
//
//  WA–SB checkpoints this model reproduces (sanity gate):
//    Vb = 0    → pH ≈ 2.87   |   Vb = 12.5 mL → pH = 4.74 (= pKa)   |   Vb = 25 mL → pH ≈ 8.72
//
// NOTE on colour: the SIMULATION_DESIGN_WORKFLOW palette governs all CHROME
// (indigo/amber accents, #0d1117 surfaces). The INDICATOR colours (methyl-orange
// red→yellow, bromothymol yellow→blue, phenolphthalein colourless→pink) are
// REAL CHEMISTRY colours, not decoration — so the "no new colours" rule does not
// apply to them. Same intentional physics-colour exception documented in
// HydrogenSpectrumDecoderSim.tsx / BohrSpectraSim.tsx.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

// ── chrome palette (workflow §3) ────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  indigo: '#6366f1',
  indigoMid: '#818cf8',
  indigoLight: '#c4b5fd',
  amber: '#fbbf24',
  amberLight: '#fcd34d',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  red: '#f87171',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
};

// ── titration constants (NCERT defaults) ────────────────────────────────────
const CA = 0.1;          // analyte concentration (M)
const VA = 25.0;         // analyte volume (mL)
const CB = 0.1;          // titrant concentration (M)
const VEQ = (CA * VA) / CB; // = 25.0 mL — equivalence volume
const VB_MAX = 50.0;     // burette span plotted (mL)
const PKW = 14.0;
const PKA = 4.74;        // acetic acid, Ka = 1.8×10⁻⁵
const PKB = 4.74;        // ammonia,    Kb = 1.8×10⁻⁵
const N_SAMPLES = 240;   // curve samples
const PH_FLOOR = 0.3, PH_CEIL = 13.7; // clamp so the curve never pins the axis

const clampPh = (ph: number) => Math.min(PH_CEIL, Math.max(PH_FLOOR, ph));

type TType = 'sasb' | 'wasb' | 'sawb';

// ── pH model ────────────────────────────────────────────────────────────────
// Returns pH for a given titrant volume Vb (mL), per the formulas in the header.
function phAt(type: TType, vb: number): number {
  const v = VA + vb;                         // total volume (mL)
  const molA = CA * VA;                       // mmol analyte initially
  const molT = CB * vb;                        // mmol titrant added
  const EPS = 1e-4;

  if (type === 'sasb') {
    if (vb < VEQ - EPS) {
      const h = (molA - molT) / v;            // excess strong acid (mol/L)
      return clampPh(-Math.log10(Math.max(h, 1e-13)));
    }
    if (Math.abs(vb - VEQ) <= EPS) return 7;
    const oh = (molT - molA) / v;             // excess strong base
    return clampPh(PKW + Math.log10(Math.max(oh, 1e-13)));
  }

  if (type === 'wasb') {
    if (vb <= EPS) {
      // pure weak acid: pH = ½(pKa − log Ca)
      return clampPh(0.5 * (PKA - Math.log10(CA)));
    }
    if (vb < VEQ - EPS) {
      // Henderson buffer: pH = pKa + log([A−]/[HA])
      const base = molT;                      // conjugate base formed
      const acid = molA - molT;               // weak acid remaining
      return clampPh(PKA + Math.log10(base / acid));
    }
    if (Math.abs(vb - VEQ) <= EPS) {
      const cs = molA / v;                     // conjugate base conc at eq
      return clampPh(0.5 * (PKW + PKA + Math.log10(cs)));
    }
    const oh = (molT - molA) / v;             // excess strong base
    return clampPh(PKW + Math.log10(Math.max(oh, 1e-13)));
  }

  // type === 'sawb' (strong acid analyte, weak base titrant) — mirror image
  if (vb < VEQ - EPS) {
    const h = (molA - molT) / v;              // excess strong acid
    if (vb <= EPS) return clampPh(-Math.log10(CA)); // 0.1 M strong acid → pH 1
    return clampPh(-Math.log10(Math.max(h, 1e-13)));
  }
  if (Math.abs(vb - VEQ) <= EPS) {
    const cs = molA / v;                       // conjugate acid (salt) conc at eq
    return clampPh(0.5 * (PKW - PKB - Math.log10(cs)));
  }
  // past eq: weak-base buffer  pOH = pKb + log([BH+]/[B])
  const excessBase = molT - molA;             // excess weak base
  const conjAcid = molA;                       // conjugate acid present (mmol)
  const poh = PKB + Math.log10(conjAcid / excessBase);
  return clampPh(PKW - poh);
}

// half-equivalence pH (= pKa for WA, pOH=pKb basis for the salt point of WB)
const halfEqPh = (type: TType) =>
  type === 'wasb' ? PKA : type === 'sawb' ? PKW - PKB : 7;

// ── titration metadata ──────────────────────────────────────────────────────
const TYPES: { key: TType; tab: string; analyte: string; titrant: string; eqNote: string }[] = [
  { key: 'sasb', tab: 'Strong Acid + Strong Base', analyte: '0.10 M HCl (strong acid)', titrant: '0.10 M NaOH (strong base)', eqNote: 'equivalence pH = 7' },
  { key: 'wasb', tab: 'Weak Acid + Strong Base', analyte: '0.10 M CH₃COOH (weak acid)', titrant: '0.10 M NaOH (strong base)', eqNote: 'equivalence pH > 7' },
  { key: 'sawb', tab: 'Strong Acid + Weak Base', analyte: '0.10 M HCl (strong acid)', titrant: '0.10 M NH₃ (weak base)', eqNote: 'equivalence pH < 7' },
];
const typeMeta = (t: TType) => TYPES.find((x) => x.key === t)!;

// ── indicators (REAL chemistry colours — see header note) ───────────────────
interface Indicator {
  key: string; name: string; lo: number; hi: number;
  acidCol: string; baseCol: string; acidName: string; baseName: string;
}
const INDICATORS: Indicator[] = [
  { key: 'mo', name: 'Methyl orange', lo: 3.1, hi: 4.4, acidCol: '#e8503a', baseCol: '#f4c025', acidName: 'red', baseName: 'yellow' },
  { key: 'btb', name: 'Bromothymol blue', lo: 6.0, hi: 7.6, acidCol: '#e3d437', baseCol: '#2f7fe0', acidName: 'yellow', baseName: 'blue' },
  { key: 'php', name: 'Phenolphthalein', lo: 8.3, hi: 10.0, acidCol: '#cfd6e0', baseCol: '#e0468f', acidName: 'colourless', baseName: 'pink' },
];

// beaker colour = indicator colour at the current pH (blend across its window)
function indicatorColor(ind: Indicator, ph: number): string {
  const t = Math.min(1, Math.max(0, (ph - ind.lo) / (ind.hi - ind.lo)));
  return mix(ind.acidCol, ind.baseCol, t);
}
function mix(a: string, b: string, t: number): string {
  const pa = hex(a), pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// region label for the live readout
function regionOf(type: TType, vb: number): string {
  const EPS = 0.05;
  if (Math.abs(vb - VEQ) <= EPS) return 'Equivalence point';
  if (vb < VEQ) {
    if (type === 'wasb' && vb > 0.05) return 'Buffer region (acid + its salt)';
    if (type === 'sawb') return 'Acidic — excess strong acid';
    return 'Acidic — excess strong acid';
  }
  if (type === 'sawb') return 'Basic — excess weak base';
  return 'Basic — excess strong base';
}

// ── guided narrative beats ──────────────────────────────────────────────────
type StepDef = { key: string; label: string; title: string; body: string; type: TType; indicator: string };
const STEPS: StepDef[] = [
  {
    key: 'strong', label: 'Strong + Strong', type: 'sasb', indicator: 'btb',
    title: 'A flat run, then a vertical cliff',
    body:
      'Put 25 mL of 0.10 M strong acid in the flask and run 0.10 M strong base in from the burette. For a long time almost nothing happens to the pH — you are just mopping up acid. Then within one or two drops near 25 mL the pH leaps from about 3 to about 11: the equivalence point, where moles of base exactly equal moles of acid, sits dead centre at pH 7. Step the volume up one drop at a time to feel how sudden that cliff is.',
  },
  {
    key: 'buffer', label: 'Weak Acid · Buffer', type: 'wasb', indicator: 'php',
    title: 'The buffer region, and pH = pKa at half-way',
    body:
      'Swap the acid for a weak one (acetic acid). Now the curve is not flat early on — it rises gently through a buffer region, because the half-neutralised mixture of acid and its salt resists pH change. At exactly half the equivalence volume (12.5 mL) the pH equals the pKa, 4.74 — read it straight off the curve. The jump is shorter than before and the equivalence point lands above 7 (about 8.7), because the salt left behind is basic.',
  },
  {
    key: 'indicator', label: 'Choosing an Indicator', type: 'wasb', indicator: 'php',
    title: 'Pick an indicator whose window sits on the jump',
    body:
      'An indicator only tells the truth if it changes colour during the steep part of the curve. Drop the coloured band onto the plot: phenolphthalein (8.3–10.0) straddles the weak-acid equivalence point — good choice, ✓. Methyl orange (3.1–4.4) changes far too early here — it would scream "done" while half the acid is still unreacted, ✗. Switch indicators and titration types and watch the ✓/✗ verdict flip.',
  },
];

export default function TitrationCurveBuilderSim() {
  const plotRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [stepIdx, setStepIdx] = useState(0);
  const [type, setType] = useState<TType>('sasb');
  const [vb, setVb] = useState(0);                 // titrant added (mL)
  const [indicatorKey, setIndicatorKey] = useState('btb');

  // mutable draw state — never triggers React re-render inside the rAF loop
  const sim = useRef({
    type: 'sasb' as TType,
    vb: 0,
    indicatorKey: 'btb',
    pulse: 0,
    W: 0, H: 0,
  });

  useEffect(() => { sim.current.type = type; }, [type]);
  useEffect(() => { sim.current.vb = vb; }, [vb]);
  useEffect(() => { sim.current.indicatorKey = indicatorKey; }, [indicatorKey]);

  const indicator = INDICATORS.find((i) => i.key === indicatorKey)!;
  const curPh = phAt(type, vb);
  const beakerCol = indicatorColor(indicator, curPh);
  const eqPh = phAt(type, VEQ);
  const indicatorGood = eqPh >= indicator.lo && eqPh <= indicator.hi;

  const goStep = useCallback((idx: number) => {
    setStepIdx(idx);
    const st = STEPS[idx];
    setType(st.type);
    setIndicatorKey(st.indicator);
    setVb(0);
    sim.current.pulse = 1;
  }, []);

  const bump = useCallback((dv: number) => {
    setVb((p) => Math.min(VB_MAX, Math.max(0, +(p + dv).toFixed(2))));
    sim.current.pulse = 1;
  }, []);

  // ── DRAW: the pH curve ─────────────────────────────────────────────────────
  function drawPlot(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.W, h = s.H;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);

    const padL = 40, padR = 16, padT = 18, padB = 34;
    const plotW = w - padL - padR, plotH = h - padT - padB;
    const ind = INDICATORS.find((i) => i.key === s.indicatorKey)!;

    const xOf = (mlVb: number) => padL + (mlVb / VB_MAX) * plotW;
    const yOf = (ph: number) => padT + (1 - ph / 14) * plotH;

    // indicator colour-change band (translucent horizontal strip)
    const yHi = yOf(ind.hi), yLo = yOf(ind.lo);
    ctx.fillStyle = 'rgba(129,140,248,0.10)';
    ctx.fillRect(padL, yHi, plotW, yLo - yHi);
    ctx.strokeStyle = 'rgba(129,140,248,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(padL, yHi); ctx.lineTo(padL + plotW, yHi); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, yLo); ctx.lineTo(padL + plotW, yLo); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = C.indigoLight; ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`${ind.name} ${ind.lo}–${ind.hi}`, padL + plotW - 4, yHi - 4 < padT + 8 ? yLo + 12 : yHi - 4);

    // gridlines: pH ticks
    ctx.font = '600 9px Geist, system-ui, sans-serif';
    for (let ph = 0; ph <= 14; ph += 2) {
      const y = yOf(ph);
      ctx.strokeStyle = ph === 7 ? 'rgba(251,191,36,0.30)' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = ph === 7 ? 1.2 : 1;
      if (ph === 7) ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ph === 7 ? C.amberLight : 'rgba(255,255,255,0.4)'; ctx.textAlign = 'right';
      ctx.fillText(`${ph}`, padL - 6, y + 3);
    }
    ctx.save();
    ctx.translate(11, padT + plotH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = C.ghost; ctx.textAlign = 'center'; ctx.fillText('pH', 0, 0);
    ctx.restore();

    // x ticks: titrant volume
    ctx.textAlign = 'center';
    for (let ml = 0; ml <= VB_MAX; ml += 10) {
      const x = xOf(ml);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x, padT + plotH, 1, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillText(`${ml}`, x, padT + plotH + 15);
    }
    ctx.fillStyle = C.ghost; ctx.fillText('titrant added (mL)', padL + plotW / 2, padT + plotH + 28);

    // equivalence-volume vertical gridline
    const xEq = xOf(VEQ);
    ctx.strokeStyle = 'rgba(16,185,129,0.30)'; ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(xEq, padT); ctx.lineTo(xEq, padT + plotH); ctx.stroke(); ctx.setLineDash([]);

    // full faint curve + bright traced portion up to current Vb
    const pts: { x: number; y: number; vb: number }[] = [];
    for (let i = 0; i <= N_SAMPLES; i++) {
      const ml = (i / N_SAMPLES) * VB_MAX;
      pts.push({ x: xOf(ml), y: yOf(phAt(s.type, ml)), vb: ml });
    }
    // faint full curve
    ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    // bright traced portion (Vb ≤ current)
    ctx.strokeStyle = C.indigoMid; ctx.lineWidth = 2.6;
    ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(99,102,241,0.6)';
    ctx.beginPath();
    let started = false;
    for (const p of pts) {
      if (p.vb > s.vb + 1e-6) break;
      if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // equivalence-point marker
    const eqPh = phAt(s.type, VEQ);
    const eqY = yOf(eqPh);
    ctx.fillStyle = C.emerald;
    ctx.beginPath(); ctx.arc(xEq, eqY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = C.emeraldLight; ctx.font = '700 9px Geist, system-ui, sans-serif';
    ctx.textAlign = xEq > padL + plotW - 80 ? 'right' : 'left';
    ctx.fillText(`equiv. pt · pH ${eqPh.toFixed(1)}`, xEq + (xEq > padL + plotW - 80 ? -8 : 8), eqY - 8);

    // half-equivalence marker (only meaningful for the weak cases)
    if (s.type !== 'sasb') {
      const xHalf = xOf(VEQ / 2);
      const halfY = yOf(phAt(s.type, VEQ / 2));
      ctx.fillStyle = C.amber;
      ctx.beginPath(); ctx.arc(xHalf, halfY, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.amberLight; ctx.font = '600 8px Geist, system-ui, sans-serif'; ctx.textAlign = 'left';
      const lbl = s.type === 'wasb' ? 'pH = pKa · buffer' : 'half-equiv · buffer';
      ctx.fillText(lbl, xHalf + 6, halfY + 12);
    }

    // moving dot riding the curve at current Vb
    const dotX = xOf(s.vb), dotY = yOf(phAt(s.type, s.vb));
    const pr = 5 + s.pulse * 4;
    ctx.fillStyle = C.amber;
    ctx.shadowBlur = 10 + s.pulse * 12; ctx.shadowColor = C.amber;
    ctx.beginPath(); ctx.arc(dotX, dotY, pr, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#0d1117'; ctx.lineWidth = 2; ctx.stroke();

    if (s.pulse > 0) s.pulse = Math.max(0, s.pulse - 0.04);
  }

  // ── animation loop + sizing ────────────────────────────────────────────────
  useEffect(() => {
    const cv = plotRef.current;
    if (!cv) return;

    function size() {
      const r = cv!.parentElement!.getBoundingClientRect();
      const W = Math.max(r.width, 240), H = Math.max(r.height, 220);
      cv!.width = W * 2; cv!.height = H * 2;
      const ctx = cv!.getContext('2d')!; ctx.setTransform(2, 0, 0, 2, 0, 0);
      sim.current.W = W; sim.current.H = H;
    }

    const t = setTimeout(() => {
      size();
      const loop = () => {
        const ctx = cv!.getContext('2d');
        if (ctx) drawPlot(ctx);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, 60);

    window.addEventListener('resize', size);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', size); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = STEPS[stepIdx];
  const meta = typeMeta(type);
  const region = regionOf(type, vb);

  // burette fill fraction (drops as Vb rises)
  const buretteFill = 1 - vb / VB_MAX;

  const PaneLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-1 h-3.5 rounded" style={{ background: accent }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.text2 }}>{children}</span>
    </div>
  );

  return (
    <div className="w-full rounded-2xl p-4 md:p-6" style={{ background: C.bg, color: C.text }}>
      {/* header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Titration Curve <span style={{ color: C.indigo }}>Builder</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Add base drop by drop — find the jump, then choose the right indicator
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          pH = pK<sub>a</sub> at half-neutralisation
        </div>
      </div>

      {/* guided beat strip */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {STEPS.map((st, i) => {
          const active = i === stepIdx;
          return (
            <button key={st.key} onClick={() => goStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : C.border}`,
                color: active ? C.indigoLight : 'rgba(255,255,255,0.4)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: active ? C.indigo : 'rgba(255,255,255,0.06)', color: '#fff' }}>{i + 1}</span>
              {st.label}
            </button>
          );
        })}
      </div>

      {/* narration */}
      <div className="mb-5 rounded-xl px-4 py-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="text-sm font-bold text-white mb-1">{step.title}</div>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{step.body}</p>
      </div>

      {/* type tabs */}
      <div className="flex gap-1 p-1 rounded-lg mb-4 flex-wrap" style={{ background: '#05060c', border: `1px solid ${C.line}` }}>
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => { setType(t.key); setVb(0); sim.current.pulse = 1; }}
            className="flex-1 min-w-[160px] px-3 py-2 rounded-md text-xs font-bold transition-all"
            style={{
              background: type === t.key ? 'rgba(99,102,241,0.18)' : 'transparent',
              color: type === t.key ? C.indigoLight : 'rgba(255,255,255,0.45)',
              border: type === t.key ? `1px solid rgba(129,140,248,0.4)` : '1px solid transparent',
            }}>
            {t.tab}
          </button>
        ))}
      </div>

      {/* main: visual + plot */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 mb-4">
        {/* burette + beaker */}
        <div className="rounded-xl p-3 flex flex-col items-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <PaneLabel accent={C.indigo}>Burette</PaneLabel>
          <svg viewBox="0 0 120 240" width="100%" style={{ maxWidth: 150 }}>
            {/* burette barrel */}
            <rect x="50" y="6" width="20" height="120" rx="3" fill="#05060c" stroke={C.border} strokeWidth="1.5" />
            {/* titrant level */}
            <rect x="51.5" y={7.5 + (1 - buretteFill) * 117} width="17" height={buretteFill * 117} rx="2"
              fill="rgba(129,140,248,0.45)" />
            {/* graduation ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1="70" x2="76" y1={9 + f * 117} y2={9 + f * 117} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            ))}
            {/* stopcock + tip */}
            <rect x="56" y="126" width="8" height="10" fill={C.muted} />
            <polygon points="56,136 64,136 61,148 59,148" fill="#05060c" stroke={C.border} strokeWidth="1" />
            {/* a falling drop */}
            <circle cx="60" cy="156" r="2.5" fill="rgba(129,140,248,0.7)" />
            {/* beaker / flask */}
            <path d="M 38 168 L 38 222 Q 38 230 46 230 L 74 230 Q 82 230 82 222 L 82 168 Z"
              fill="none" stroke={C.border} strokeWidth="1.5" />
            {/* solution coloured by indicator at current pH */}
            <path d="M 39 192 L 39 221 Q 39 229 47 229 L 73 229 Q 81 229 81 221 L 81 192 Z"
              fill={beakerCol} opacity="0.92" />
            {/* meniscus shine */}
            <ellipse cx="60" cy="192" rx="21" ry="2.4" fill="rgba(255,255,255,0.18)" />
          </svg>
          <div className="text-[10px] text-center mt-1" style={{ color: C.ghost }}>
            flask: <span style={{ color: beakerCol === 'rgb(207,214,224)' ? C.text2 : beakerCol }} className="font-bold">
              {indicator.name}
            </span>
          </div>
        </div>

        {/* the pH curve (hero) */}
        <div>
          <PaneLabel accent={C.indigoMid}>pH Curve · the bright trace follows your titrant volume</PaneLabel>
          <div className="relative w-full" style={{ height: 280 }}>
            <canvas ref={plotRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${C.border}` }} />
          </div>
        </div>
      </div>

      {/* add-titrant control */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>
            Add titrant — creep up on the equivalence point
          </div>
          <div className="tabular-nums text-sm font-bold" style={{ color: C.indigoLight }}>
            V<sub>b</sub> = {vb.toFixed(1)} mL <span style={{ color: C.muted }}>/ {VB_MAX.toFixed(0)} mL</span>
          </div>
        </div>
        <input type="range" min={0} max={VB_MAX} step={0.1} value={vb}
          onChange={(e) => setVb(parseFloat(e.target.value))}
          className="w-full" style={{ accentColor: C.indigo }} />
        <div className="flex flex-wrap gap-2 mt-3">
          {[-1, -0.1, 0.1, 1, 5].map((dv) => (
            <button key={dv} onClick={() => bump(dv)}
              className="px-3 py-1.5 rounded-md text-xs font-bold tabular-nums transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: C.text2, border: `1px solid ${C.border}` }}>
              {dv > 0 ? `+${dv}` : dv} mL
            </button>
          ))}
          <button onClick={() => setVb(VEQ)}
            className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
            style={{ background: 'rgba(16,185,129,0.12)', color: C.emeraldLight, border: `1px solid rgba(16,185,129,0.35)` }}>
            jump to V<sub>eq</sub>
          </button>
          <button onClick={() => bump(-vb)}
            className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: C.ghost, border: `1px solid ${C.border}` }}>
            reset
          </button>
        </div>
      </div>

      {/* indicator selector + live readout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* indicator selector */}
        <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <PaneLabel accent={C.amber}>Indicator · does its window sit on the jump?</PaneLabel>
          <div className="flex flex-col gap-2">
            {INDICATORS.map((ind) => {
              const good = eqPh >= ind.lo && eqPh <= ind.hi;
              const sel = ind.key === indicatorKey;
              return (
                <button key={ind.key} onClick={() => setIndicatorKey(ind.key)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: sel ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sel ? 'rgba(129,140,248,0.45)' : C.border}`,
                  }}>
                  {/* colour swatch: acid→base */}
                  <span className="flex rounded overflow-hidden shrink-0" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                    <span className="w-4 h-6" style={{ background: ind.acidCol }} />
                    <span className="w-4 h-6" style={{ background: ind.baseCol }} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-white">{ind.name}</span>
                    <span className="block text-[10px] tabular-nums" style={{ color: C.text2 }}>
                      {ind.lo}–{ind.hi} · {ind.acidName} → {ind.baseName}
                    </span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full shrink-0"
                    style={{
                      color: good ? C.emeraldLight : C.red,
                      background: good ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)',
                    }}>
                    {good ? '✓ good' : '✗ poor'}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] leading-snug mt-2" style={{ color: C.muted }}>
            A good indicator changes colour <em>inside</em> the steep jump — so the equivalence pH
            (<span className="tabular-nums" style={{ color: C.text2 }}>{eqPh.toFixed(1)}</span>) must fall within its window.
          </p>
        </div>

        {/* live readout */}
        <div className="rounded-2xl p-4 flex flex-col" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <PaneLabel accent={C.emerald}>Live readout</PaneLabel>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Readout label="titrant added" value={`${vb.toFixed(1)} mL`} col={C.indigoLight} />
            <Readout label="current pH" value={curPh.toFixed(2)} col={C.amberLight} />
            <Readout label="equivalence Vₑq" value={`${VEQ.toFixed(1)} mL`} col={C.emeraldLight} />
            <Readout label="equivalence pH" value={eqPh.toFixed(2)} col={C.emeraldLight} />
          </div>
          <div className="rounded-lg px-3 py-2 mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.line}` }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: C.muted }}>region</div>
            <div className="text-sm font-bold" style={{ color: C.text }}>{region}</div>
          </div>
          <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.line}` }}>
            <span className="w-5 h-5 rounded shrink-0" style={{ background: beakerCol, border: '1px solid rgba(255,255,255,0.2)' }} />
            <div className="text-[11px] leading-snug" style={{ color: C.text2 }}>
              flask colour with <span className="font-bold" style={{ color: C.text }}>{indicator.name}</span> at pH {curPh.toFixed(1)}
            </div>
          </div>
          <div className="mt-auto pt-3 text-[11px] leading-snug" style={{ color: C.muted }}>
            <span style={{ color: indicatorGood ? C.emeraldLight : C.red }} className="font-bold">
              {indicatorGood ? '✓' : '✗'}
            </span>{' '}
            {indicator.name} {indicatorGood ? 'straddles' : 'misses'} this equivalence point ({meta.eqNote}).
          </div>
        </div>
      </div>

      {/* payoff */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          Flask: <strong style={{ color: C.text }}>{meta.analyte}</strong>, {VA} mL.{' '}
          Burette: <strong style={{ color: C.text }}>{meta.titrant}</strong>. The equivalence point is set by
          the chemistry of what is <em>left over</em>: a neutral salt gives{' '}
          <strong style={{ color: C.text }}>pH 7</strong>, a basic salt (weak acid + strong base) gives{' '}
          <strong style={{ color: C.amberLight }}>pH &gt; 7</strong>, and an acidic salt (strong acid + weak base) gives{' '}
          <strong style={{ color: C.amberLight }}>pH &lt; 7</strong>. Choose the indicator whose colour-change window lands on that jump — never one that changes before the steep part begins.
        </p>
      </div>
    </div>
  );
}

// small readout cell ----------------------------------------------------------
function Readout({ label, value, col }: { label: string; value: string; col: string }) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.line}` }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: C.muted }}>{label}</div>
      <div className="text-base font-black tabular-nums" style={{ color: col }}>{value}</div>
    </div>
  );
}
