'use client';

// ──────────────────────────────────────────────────────────────────────────
// Hydrogen Spectrum Decoder  ·  simulation_id: 'hydrogen-spectrum-decoder'
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · Atomic Spectra page
//
// The EMPIRICAL, "read the fingerprint" companion that sits on the Atomic
// Spectra & Rydberg page — BEFORE Bohr's model explains WHY. Where the flagship
// BohrSpectraSim asks "fire a jump, watch the line appear," this sim runs the
// inverse, which is how spectroscopy is actually done:
//
//    you SEE a line  →  which electron jump made it?  →  prove it with Rydberg
//
// Three linked panels, all driven by one selected transition:
//   ┌── THE SPECTRUM (hero) ───────────────────────────────────────────────┐
//   │ the observed H line spectrum on a log-λ axis. CLICK a line to decode  │
//   │ it; a reveal slider sweeps n₂→∞ so the lines visibly crowd onto the   │
//   │ series limit; emission (bright on black) ↔ absorption (dark on rainbow)│
//   └──────────────────────────────────────────────────────────────────────┘
//   ┌── ENERGY LADDER ────────────┐  ┌── RYDBERG WORKSHEET ─────────────────┐
//   │ rungs with 1/n² crowding;   │  │ the SAME line worked out step by step │
//   │ the decoded jump lit up     │  │ 1/λ = R_H[1/n₁²−1/n₂²] → λ in nm       │
//   └─────────────────────────────┘  └───────────────────────────────────────┘
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7) —
// every number is standard NCERT Class 11 Chapter 2 / JEE syllabus data, NOT
// generated from training knowledge:
//   • Rydberg: 1/λ = R_H (1/n₁² − 1/n₂²),  R_H = 1.097×10⁷ m⁻¹  (n₁ < n₂)
//   • Energy of level n (hydrogen):  Eₙ = −13.6 / n²  eV
//   • Series (n_final): Lyman→1 (UV), Balmer→2 (visible), Paschen→3 (IR),
//     Brackett→4 (IR), Pfund→5 (far IR)
//   • Balmer visible lines: Hα 656.3, Hβ 486.1, Hγ 434.0, Hδ 410.2 nm
//   • Series limits (n₂→∞): Lyman 91.2 nm, Balmer 364.6 nm, Paschen 820.4 nm
//   • Ionisation energy from level n = |Eₙ| = 13.6/n² eV  (= the series limit)
//
// NOTE on colour: the SIMULATION_DESIGN_WORKFLOW palette governs all CHROME
// (indigo/amber accents, #0d1117 surfaces). The spectral lines themselves use
// WAVELENGTH-ACCURATE colours (656 nm = red, 486 = cyan, …) — those are physics,
// not decoration, so the "no new colours" rule does not apply to them. Same
// intentional exception documented in BohrSpectraSim.tsx.
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

// ── physics constants ───────────────────────────────────────────────────────
const RH_NM = 0.01097;      // Rydberg constant in nm⁻¹  (= 1.097×10⁷ m⁻¹)
const RH_M = 1.097e7;       // Rydberg constant in m⁻¹  (NCERT display form)
const E_RYD = 13.6;         // eV — |E₁| for hydrogen
const SPEC_MIN = 80;        // nm — left edge of the log spectrum axis
const SPEC_MAX = 8000;      // nm — right edge (covers Lyman → Pfund)
const NTOP = 30;            // highest upper-level we ever draw (the "→ ∞" tail)

const energyEv = (n: number) => -E_RYD / (n * n);
const wavelengthNm = (nLow: number, nHigh: number) =>
  1 / (RH_NM * (1 / (nLow * nLow) - 1 / (nHigh * nHigh)));
const seriesLimitNm = (nLow: number) => 1 / (RH_NM * (1 / (nLow * nLow)));
const photonEv = (nLow: number, nHigh: number) => energyEv(nHigh) - energyEv(nLow); // > 0

// log-scale x mapping for the spectrum axis
const L_MIN = Math.log10(SPEC_MIN);
const L_MAX = Math.log10(SPEC_MAX);
const specX = (wl: number, w: number, pad: number) => {
  const clamped = Math.min(Math.max(wl, SPEC_MIN), SPEC_MAX);
  return pad + ((Math.log10(clamped) - L_MIN) / (L_MAX - L_MIN)) * (w - pad * 2);
};

// wavelength → visible-ish colour (physics colour). Four named Balmer lines
// pinned to crisp hues; UV/IR get stand-ins. Mirrors BohrSpectraSim.
function photonColor(wl: number): string {
  if (Math.abs(wl - 656.3) < 4) return '#ff5b6e';
  if (Math.abs(wl - 486.1) < 4) return '#3bc9db';
  if (Math.abs(wl - 434.0) < 4) return '#5c8dff';
  if (Math.abs(wl - 410.2) < 4) return '#b46cff';
  if (wl < 380) return '#9a6bff';                 // UV → violet stand-in
  if (wl > 700) return '#ff6b6b';                 // IR → red stand-in
  const t = (700 - wl) / 320;                     // 380..700 → hue sweep
  return `hsl(${Math.round(t * 280)}, 85%, 62%)`;
}

function regionOf(wl: number): { label: string; visible: boolean } {
  if (wl < 380) return { label: 'Ultraviolet', visible: false };
  if (wl > 700) return { label: 'Infrared', visible: false };
  return { label: 'Visible', visible: true };
}

// ── scientific notation → "6.022 × 10²³" (workflow §2, never "6.022e+23") ────
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const mantissa = m[1];
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return mantissa;
  const sup = String(Math.abs(expNum)).split('').map((d) => SUP_DIGITS[parseInt(d, 10)]).join('');
  const sign = expNum < 0 ? '⁻' : '';
  return `${mantissa} × 10${sign}${sup}`;
}

// ── stacked fraction (workflow §2 — never the ÷ glyph) ──────────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.1, margin: '0 3px' }}>
      <span style={{ padding: '0 5px 1px' }}>{num}</span>
      <span style={{ padding: '1px 5px 0', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{den}</span>
    </span>
  );
}

// ── series metadata (n_final defines the series) ────────────────────────────
const SERIES: { nFinal: number; name: string; region: string }[] = [
  { nFinal: 1, name: 'Lyman', region: 'Ultraviolet' },
  { nFinal: 2, name: 'Balmer', region: 'Visible' },
  { nFinal: 3, name: 'Paschen', region: 'Infrared' },
  { nFinal: 4, name: 'Brackett', region: 'Infrared' },
  { nFinal: 5, name: 'Pfund', region: 'Far Infrared' },
];
const seriesName = (nFinal: number) => SERIES.find((s) => s.nFinal === nFinal)?.name ?? '';

// Balmer lines have classic names (Hα…Hδ). Only the Balmer series is labelled.
const balmerLineName = (nFinal: number, nHigh: number): string | null => {
  if (nFinal !== 2) return null;
  return ({ 3: 'Hα', 4: 'Hβ', 5: 'Hγ', 6: 'Hδ' } as Record<number, string>)[nHigh] ?? null;
};

// ── guided narrative beats ──────────────────────────────────────────────────
type StepDef = { key: string; label: string; title: string; body: string };
const STEPS: StepDef[] = [
  {
    key: 'mystery',
    label: 'The Mystery',
    title: 'A glowing gas gives only a few sharp lines',
    body:
      'Pass an electric current through hydrogen gas and it glows. Split that glow with a prism and you do NOT get a smooth rainbow — you get a handful of sharp, separate coloured lines, always at the exact same wavelengths. A continuous source (a hot filament) gives every colour; a single element gives only its own private set. Why these lines, and why only these?',
  },
  {
    key: 'decode',
    label: 'Decode a Line',
    title: 'Each line is one electron jump',
    body:
      'Every line is a photon released when an electron falls from a higher energy level to a lower one. Click any line in the spectrum: the energy ladder lights up the exact jump that produced it, and the Rydberg equation on the right works out its wavelength from scratch — no measurement, just two whole numbers n₁ and n₂.',
  },
  {
    key: 'limit',
    label: 'The Series Limit',
    title: 'Lines crowd onto a limit — that is ionisation',
    body:
      'Drag the reveal slider to add jumps from higher and higher levels. Because the energy rungs bunch up near the top, the lines bunch up too, converging on a single edge — the series limit. That limit is exactly the energy needed to rip the electron right off that level. Beyond it the electron is free, and the spectrum becomes a continuous band.',
  },
];

type Selected = { nFinal: number; nHigh: number } | null;

export default function HydrogenSpectrumDecoderSim() {
  const specRef = useRef<HTMLCanvasElement>(null);
  const ladderRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [stepIdx, setStepIdx] = useState(0);
  const [mode, setMode] = useState<'emission' | 'absorption'>('emission');
  const [nFinal, setNFinal] = useState(2);       // Balmer — the visible series, best first impression
  const [nMax, setNMax] = useState(6);            // reveal slider: highest upper-level shown
  const [selected, setSelected] = useState<Selected>({ nFinal: 2, nHigh: 3 });

  // mutable draw state — never triggers React re-render inside the rAF loop
  const sim = useRef({
    mode: 'emission' as 'emission' | 'absorption',
    nFinal: 2,
    nMax: 6,
    selNHigh: 3,
    hoverNHigh: -1,
    pulse: 0,
    // hit-test table for the spectrum strip, rebuilt every draw
    hits: [] as Array<{ nHigh: number; x: number; wl: number }>,
    sW: 0, sH: 0, lW: 0, lH: 0,
  });

  // ── sync React controls → sim ref ─────────────────────────────────────────
  useEffect(() => { sim.current.mode = mode; }, [mode]);
  useEffect(() => { sim.current.nFinal = nFinal; }, [nFinal]);
  useEffect(() => { sim.current.nMax = nMax; }, [nMax]);
  useEffect(() => { sim.current.selNHigh = selected ? selected.nHigh : -1; }, [selected]);

  // when the series changes, clamp the reveal + selection into the new range
  useEffect(() => {
    setNMax((m) => Math.max(nFinal + 1, Math.min(m, NTOP)));
    setSelected((sel) =>
      sel && sel.nFinal === nFinal ? sel : { nFinal, nHigh: nFinal + 1 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nFinal]);

  // keep the selected line inside the revealed range
  useEffect(() => {
    setSelected((sel) => (sel && sel.nHigh > nMax ? { nFinal, nHigh: nMax } : sel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nMax]);

  const goStep = useCallback((idx: number) => {
    setStepIdx(idx);
    if (STEPS[idx].key === 'limit') setNMax(NTOP);          // reveal the convergence
    if (STEPS[idx].key === 'mystery') { setNFinal(2); setNMax(6); }
    sim.current.pulse = 1;
  }, []);

  const pickLine = useCallback((nHigh: number) => {
    setSelected({ nFinal: sim.current.nFinal, nHigh });
    sim.current.pulse = 1;
  }, []);

  // ── DRAW: the spectrum strip (hero) ───────────────────────────────────────
  function drawSpectrum(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.sW, h = s.sH;
    ctx.clearRect(0, 0, w, h);
    const pad = 30;
    const stripTop = 34, stripH = h - stripTop - 40;
    const absorption = s.mode === 'absorption';

    // base strip
    if (absorption) {
      const g = ctx.createLinearGradient(pad, 0, w - pad, 0);
      g.addColorStop(0, '#b46cff'); g.addColorStop(0.35, '#5c8dff');
      g.addColorStop(0.5, '#3bc9db'); g.addColorStop(0.7, '#fcd34d'); g.addColorStop(1, '#ff5b6e');
      ctx.fillStyle = g; ctx.fillRect(pad, stripTop, w - pad * 2, stripH);
    } else {
      ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#05060c'; ctx.fillRect(pad, stripTop, w - pad * 2, stripH);
    }

    // visible-band marker (380–700 nm)
    const vx1 = specX(380, w, pad), vx2 = specX(700, w, pad);
    if (!absorption) {
      const vg = ctx.createLinearGradient(vx1, 0, vx2, 0);
      vg.addColorStop(0, 'rgba(180,108,255,0.18)'); vg.addColorStop(0.5, 'rgba(59,201,219,0.18)'); vg.addColorStop(1, 'rgba(255,91,110,0.18)');
      ctx.fillStyle = vg; ctx.fillRect(vx1, stripTop, vx2 - vx1, stripH);
    }
    ctx.fillStyle = absorption ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)';
    ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('VISIBLE', (vx1 + vx2) / 2, stripTop - 7);
    ctx.textAlign = 'left'; ctx.fillText('◀ UV (shorter λ)', pad, stripTop - 7);
    ctx.textAlign = 'right'; ctx.fillText('(longer λ) IR ▶', w - pad, stripTop - 7);

    // wavelength ticks (log)
    ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    [100, 200, 400, 700, 1500, 4000].forEach((wl) => {
      const x = specX(wl, w, pad);
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(x, stripTop + stripH, 1, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillText(`${wl}`, x, stripTop + stripH + 16);
    });
    ctx.fillStyle = C.ghost; ctx.fillText('wavelength λ (nm)', w / 2, stripTop + stripH + 30);

    // rebuild hit table + draw lines for the current series up to nMax
    s.hits = [];
    for (let nHigh = s.nFinal + 1; nHigh <= NTOP; nHigh++) {
      const revealed = nHigh <= s.nMax;
      const wl = wavelengthNm(s.nFinal, nHigh);
      const x = specX(wl, w, pad);
      const isSel = nHigh === s.selNHigh;
      const isHover = nHigh === s.hoverNHigh;

      if (revealed) s.hits.push({ nHigh, x, wl });

      // faint "tail" lines beyond the reveal hint the pile-up toward the limit
      if (!revealed) {
        ctx.strokeStyle = absorption ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, stripTop + stripH * 0.18); ctx.lineTo(x, stripTop + stripH * 0.82); ctx.stroke();
        continue;
      }

      const col = photonColor(wl);
      const lw = isSel ? 4 : isHover ? 3 : 2;
      if (absorption) {
        ctx.fillStyle = isSel ? '#000' : 'rgba(5,6,12,0.9)';
        ctx.fillRect(x - lw / 2, stripTop, lw, stripH);
      } else {
        ctx.fillStyle = col;
        if (isSel || isHover) { ctx.shadowBlur = isSel ? 14 : 8; ctx.shadowColor = col; }
        ctx.fillRect(x - lw / 2, stripTop, lw, stripH);
        ctx.shadowBlur = 0;
      }

      // selection caret + label above the strip
      if (isSel) {
        ctx.fillStyle = absorption ? '#000' : col;
        ctx.beginPath();
        ctx.moveTo(x, stripTop - 2); ctx.lineTo(x - 4, stripTop - 9); ctx.lineTo(x + 4, stripTop - 9); ctx.closePath(); ctx.fill();
      }
    }

    // series limit (n→∞) = ionisation from nFinal
    const limit = seriesLimitNm(s.nFinal);
    const lx = specX(limit, w, pad);
    const limitProminent = s.nMax >= NTOP - 2;
    ctx.strokeStyle = limitProminent ? C.amber : 'rgba(251,191,36,0.4)';
    ctx.setLineDash([3, 3]); ctx.lineWidth = limitProminent ? 1.8 : 1.2;
    ctx.beginPath(); ctx.moveTo(lx, stripTop - 4); ctx.lineTo(lx, stripTop + stripH + 4); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = limitProminent ? C.amberLight : 'rgba(251,191,36,0.6)';
    ctx.font = '600 9px Geist, system-ui, sans-serif';
    ctx.textAlign = lx > w - 110 ? 'right' : 'left';
    ctx.fillText('series limit → ionisation', lx + (lx > w - 110 ? -6 : 6), stripTop + 11);

    if (s.pulse > 0) s.pulse = Math.max(0, s.pulse - 0.03);
  }

  // ── DRAW: the energy ladder ───────────────────────────────────────────────
  function drawLadder(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.lW, h = s.lH;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);

    const padT = 26, padB = 24, H = h - padT - padB;
    const xAxis = 46, xEnd = w - 50;
    const E1 = energyEv(1);
    const yOfE = (E: number) => padT + (E / E1) * H;  // E1 → bottom, 0 → top
    const yZero = yOfE(0);

    // continuum band above n=∞
    const cg = ctx.createLinearGradient(0, padT, 0, yZero);
    cg.addColorStop(0, 'rgba(99,102,241,0.16)'); cg.addColorStop(1, 'rgba(99,102,241,0.03)');
    ctx.fillStyle = cg; ctx.fillRect(xAxis, padT, xEnd - xAxis, yZero - padT);
    ctx.fillStyle = 'rgba(129,140,248,0.85)'; ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('continuum — electron is free', xAxis + 6, padT + 12);

    // axis
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xAxis, padT - 4); ctx.lineTo(xAxis, h - padB + 4); ctx.stroke();
    ctx.fillStyle = C.text2; ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('E (eV)', xAxis - 6, padT - 7);

    // n=∞ line
    ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(251,191,36,0.55)';
    ctx.beginPath(); ctx.moveTo(xAxis, yZero); ctx.lineTo(xEnd, yZero); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.amber; ctx.textAlign = 'right'; ctx.fillText('0  (n=∞)', xAxis - 6, yZero + 3);

    // rungs n=1..7 (1/n² crowding is the whole point)
    for (let n = 1; n <= 7; n++) {
      const E = energyEv(n), y = yOfE(E);
      const isFloor = n === s.nFinal;
      ctx.strokeStyle = isFloor ? 'rgba(99,102,241,0.95)' : 'rgba(255,255,255,0.26)';
      ctx.lineWidth = isFloor ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(xAxis, y); ctx.lineTo(xEnd, y); ctx.stroke();
      ctx.fillStyle = isFloor ? C.indigoLight : 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'left'; ctx.font = '600 9px Geist, system-ui, sans-serif';
      ctx.fillText(`n=${n}${n === 7 ? '…' : ''}`, xEnd + 5, y + 3);
      if (n <= 4) { ctx.fillStyle = C.ghost; ctx.textAlign = 'right'; ctx.fillText(`${E.toFixed(2)}`, xAxis - 6, y + 3); }
    }

    // the decoded transition arrow (emission falls into nFinal; absorption rises)
    const nHigh = s.selNHigh;
    if (nHigh > s.nFinal) {
      const wl = wavelengthNm(s.nFinal, nHigh);
      const col = photonColor(wl);
      const yHi = yOfE(energyEv(Math.min(nHigh, 7)));   // clamp draw to visible rungs
      const yLo = yOfE(energyEv(s.nFinal));
      const ax = (xAxis + xEnd) / 2;
      const down = s.mode === 'emission';
      const yA = down ? yHi : yLo, yB = down ? yLo : yHi;
      const pulseW = 1 + s.pulse * 1.5;
      ctx.strokeStyle = col; ctx.lineWidth = 2 + pulseW;
      ctx.shadowBlur = 6 + s.pulse * 10; ctx.shadowColor = col;
      ctx.beginPath(); ctx.moveTo(ax, yA); ctx.lineTo(ax, yB); ctx.stroke();
      const dir = yB > yA ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(ax - 5, yB - dir * 9); ctx.lineTo(ax, yB); ctx.lineTo(ax + 5, yB - dir * 9); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.font = '700 10px Geist, system-ui, sans-serif';
      const lbl = nHigh > 7 ? `n=${nHigh} → n=${s.nFinal}` : `ΔE = ${photonEv(s.nFinal, nHigh).toFixed(2)} eV`;
      ctx.fillText(lbl, ax + 9, (yA + yB) / 2 + 3);
    }
  }

  // ── animation loop + sizing ───────────────────────────────────────────────
  useEffect(() => {
    const sp = specRef.current, l = ladderRef.current;
    if (!sp || !l) return;

    function size(canvas: HTMLCanvasElement, minH: number): [number, number] {
      const r = canvas.parentElement!.getBoundingClientRect();
      const W = Math.max(r.width, 240), Hh = Math.max(r.height, minH);
      canvas.width = W * 2; canvas.height = Hh * 2;
      const ctx = canvas.getContext('2d')!; ctx.setTransform(2, 0, 0, 2, 0, 0);
      return [W, Hh];
    }
    function resize() {
      const s = sim.current;
      [s.sW, s.sH] = size(sp!, 220);
      [s.lW, s.lH] = size(l!, 300);
    }

    const t = setTimeout(() => {
      resize();
      const loop = () => {
        const cs = sp!.getContext('2d'), cl = l!.getContext('2d');
        if (cs) drawSpectrum(cs);
        if (cl) drawLadder(cl);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, 60);

    window.addEventListener('resize', resize);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── spectrum mouse interaction (hover + click to decode a line) ────────────
  function nearestLine(clientX: number): number {
    const s = sim.current;
    const rect = specRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    let best = -1, bestD = 11;        // 11px hit tolerance
    for (const ht of s.hits) {
      const d = Math.abs(ht.x - x);
      if (d < bestD) { bestD = d; best = ht.nHigh; }
    }
    return best;
  }
  function specMove(e: React.MouseEvent<HTMLCanvasElement>) {
    sim.current.hoverNHigh = nearestLine(e.clientX);
  }
  function specClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const n = nearestLine(e.clientX);
    if (n !== -1) pickLine(n);
  }

  // ── derived values for the worksheet (the selected line) ──────────────────
  const sel = selected ?? { nFinal, nHigh: nFinal + 1 };
  const invN1 = 1 / (sel.nFinal * sel.nFinal);
  const invN2 = 1 / (sel.nHigh * sel.nHigh);
  const bracket = invN1 - invN2;
  const invLambdaM = RH_M * bracket;                  // m⁻¹
  const lambdaM = 1 / invLambdaM;                     // m
  const lambdaNm = lambdaM * 1e9;                     // nm
  const selColor = photonColor(lambdaNm);
  const selRegion = regionOf(lambdaNm);
  const selName = balmerLineName(sel.nFinal, sel.nHigh);
  const selEv = photonEv(sel.nFinal, sel.nHigh);

  const step = STEPS[stepIdx];

  // small UI helper -----------------------------------------------------------
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
            Hydrogen Spectrum <span style={{ color: C.indigo }}>Decoder</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Read the fingerprint — every line is a hidden electron jump
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          1/λ = R<sub>H</sub> [ 1/n₁² − 1/n₂² ]
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
                style={{ background: active ? C.indigo : 'rgba(255,255,255,0.06)', color: active ? '#fff' : '#fff' }}>{i + 1}</span>
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

      {/* ── THE SPECTRUM (hero, full width, clickable) ── */}
      <div className="mb-4">
        <PaneLabel accent={C.indigo}>The Observed Spectrum · click a line to decode it</PaneLabel>
        <div className="relative w-full" style={{ height: 220 }}>
          <canvas ref={specRef} className="w-full h-full block rounded-xl cursor-pointer"
            style={{ border: `1px solid ${C.border}` }}
            onMouseMove={specMove} onMouseLeave={() => { sim.current.hoverNHigh = -1; }} onClick={specClick} />
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* series */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
              Series — landing level n<sub>final</sub>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SERIES.map((s) => (
                <button key={s.nFinal} onClick={() => setNFinal(s.nFinal)}
                  className="px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all"
                  style={{ background: nFinal === s.nFinal ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)', color: nFinal === s.nFinal ? C.indigoLight : C.text2, border: `1px solid ${nFinal === s.nFinal ? 'rgba(129,140,248,0.4)' : C.border}` }}
                  title={`${s.name} · ${s.region}`}>
                  {s.name}<span className="opacity-60"> ·{s.nFinal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* mode */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Mode</div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#05060c', border: `1px solid ${C.line}` }}>
              {(['emission', 'absorption'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 px-3 py-2 rounded-md text-xs font-bold capitalize transition-all"
                  style={{ background: mode === m ? 'rgba(99,102,241,0.18)' : 'transparent', color: mode === m ? C.indigoLight : 'rgba(255,255,255,0.45)', border: mode === m ? `1px solid rgba(129,140,248,0.4)` : '1px solid transparent' }}>
                  {m}
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-snug mt-1.5" style={{ color: C.muted }}>
              {mode === 'emission'
                ? 'Bright lines: the gas gives OUT these exact wavelengths.'
                : 'Dark lines: cold gas takes IN the same wavelengths from white light — same positions.'}
            </p>
          </div>

          {/* reveal slider (series limit) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2 flex justify-between" style={{ color: C.muted }}>
              <span>Reveal jumps up to</span>
              <span style={{ color: C.indigoLight }} className="tabular-nums">
                {nMax >= NTOP - 2 ? 'n → ∞' : `n = ${nMax}`}
              </span>
            </div>
            <input type="range" min={nFinal + 1} max={NTOP} step={1} value={nMax}
              onChange={(e) => setNMax(parseInt(e.target.value, 10))}
              className="w-full" style={{ accentColor: C.indigo }} />
            <p className="text-[11px] leading-snug mt-1.5" style={{ color: C.muted }}>
              Slide right — watch the lines crowd onto the <span style={{ color: C.amberLight }}>series limit</span>.
            </p>
          </div>
        </div>
      </div>

      {/* ── LADDER + WORKSHEET ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* energy ladder */}
        <div>
          <PaneLabel accent={C.amber}>Energy Ladder · rungs crowd as 1/n²</PaneLabel>
          <div className="relative w-full" style={{ height: 300 }}>
            <canvas ref={ladderRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${C.border}` }} />
          </div>
        </div>

        {/* rydberg worksheet */}
        <div>
          <PaneLabel accent={C.emerald}>Rydberg Worksheet · the decoded line, step by step</PaneLabel>
          <div className="rounded-xl p-4 h-[300px] flex flex-col" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            {/* selected line header */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="w-4 h-4 rounded" style={{ background: mode === 'absorption' ? '#000' : selColor, boxShadow: `0 0 10px ${selColor}`, border: '1px solid rgba(255,255,255,0.2)' }} />
              <span className="text-sm font-bold tabular-nums" style={{ color: selColor }}>
                {seriesName(sel.nFinal)} · n={sel.nHigh} → n={sel.nFinal}{selName ? ` · ${selName}` : ''}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ color: selRegion.visible ? C.emeraldLight : C.ghost, background: selRegion.visible ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)' }}>
                {selRegion.label}{selRegion.visible ? '' : ' (invisible)'}
              </span>
            </div>

            {/* step-by-step substitution */}
            <div className="flex-1 flex flex-col justify-center gap-2.5 text-sm" style={{ color: C.text2 }}>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                <Frac num="1" den={<span style={{ fontStyle: 'italic' }}>λ</span>} />
                <span style={{ color: C.muted }}>=</span>
                <span style={{ color: C.amber, fontStyle: 'italic' }}>R<sub className="text-[0.6em]">H</sub></span>
                <span style={{ color: C.muted }}>[</span>
                <Frac num="1" den={<span className="tabular-nums">{sel.nFinal}²</span>} />
                <span style={{ color: C.muted }}>−</span>
                <Frac num="1" den={<span className="tabular-nums">{sel.nHigh}²</span>} />
                <span style={{ color: C.muted }}>]</span>
              </div>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 tabular-nums">
                <span style={{ color: C.muted }}>=</span>
                <span style={{ color: C.amberLight }}>{prettyExp(RH_M.toExponential(3))}</span>
                <span style={{ color: C.muted }}>[ {invN1.toFixed(4)} − {invN2.toFixed(4)} ]  m⁻¹</span>
              </div>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 tabular-nums">
                <span style={{ color: C.muted }}>=</span>
                <span style={{ color: C.amberLight }}>{prettyExp(RH_M.toExponential(3))}</span>
                <span style={{ color: C.muted }}>× {bracket.toFixed(4)}</span>
              </div>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 tabular-nums">
                <Frac num="1" den={<span style={{ fontStyle: 'italic' }}>λ</span>} />
                <span style={{ color: C.muted }}>=</span>
                <strong style={{ color: C.text }}>{prettyExp(invLambdaM.toExponential(3))}</strong>
                <span style={{ color: C.muted }}>m⁻¹</span>
                <span className="text-[11px]" style={{ color: C.ghost }}>(wavenumber)</span>
              </div>
              <div className="pt-2 mt-1 flex items-center flex-wrap gap-x-2 gap-y-1 tabular-nums text-base"
                style={{ borderTop: `1px solid ${C.line}` }}>
                <span style={{ fontStyle: 'italic', color: C.text }}>λ</span>
                <span style={{ color: C.muted }}>=</span>
                <strong style={{ color: selColor }}>{prettyExp(lambdaM.toExponential(3))} m</strong>
                <span style={{ color: C.muted }}>=</span>
                <strong style={{ color: selColor }}>{lambdaNm.toFixed(1)} nm</strong>
              </div>
              <div className="flex items-center flex-wrap gap-x-3 text-[11px] tabular-nums" style={{ color: C.ghost }}>
                <span>photon energy ΔE = {selEv.toFixed(2)} eV</span>
                <span>ν = {(299792.458 / lambdaNm).toFixed(0)} THz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAYOFF: series limit = ionisation ── */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          The lines of the <strong style={{ color: C.text }}>{seriesName(nFinal)}</strong> series pile up at{' '}
          <strong style={{ color: C.amberLight }} className="tabular-nums">{Math.round(seriesLimitNm(nFinal))} nm</strong> — its{' '}
          <strong style={{ color: C.text }}>series limit</strong>. That edge is exactly the energy to tear the electron off level n={nFinal}:{' '}
          <strong style={{ color: C.amberLight }} className="tabular-nums">{Math.abs(energyEv(nFinal)).toFixed(2)} eV</strong>. Past it the electron is free and can carry any energy — the lines blur into a continuous band. So a spectrum is not random: it is the atom&apos;s own energy ladder, written in light.
        </p>
      </div>
    </div>
  );
}
