'use client';

// ──────────────────────────────────────────────────────────────────────────
// Bohr Model → Hydrogen Spectrum  (the flagship "connect-the-dots" simulator)
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · JEE / NEET
//
// One continuous experience that fuses three views of the SAME physics so the
// student never has to mentally stitch separate textbook diagrams together:
//
//   ┌── THE ATOM ──────┐  ┌── ENERGY LEVELS ─┐  ┌── THE SPECTRUM ───────────┐
//   │ Bohr orbits with │  │ a ladder of rungs│  │ the full UV–Vis–IR line   │
//   │ radii ∝ n² (not  │  │ that CONVERGE to │  │ spectrum, each series     │
//   │ evenly spaced!)  │  │ 0 as n grows; the│  │ crowding toward its limit │
//   │ + de Broglie     │  │ jump arrow length│  │ = ionisation energy; the  │
//   │ standing wave    │  │ = the photon ΔE  │  │ continuum beyond it        │
//   └──────────────────┘  └──────────────────┘  └───────────────────────────┘
//
// Everything is driven by one shared state (current level, target level, Z),
// so a single jump lights up all three panes at once. Controls sit BELOW the
// full-width panes (per the layout brief).
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7) —
// every number below is standard NCERT Class 11 Chapter 2 / JEE syllabus data,
// NOT generated from training knowledge:
//   • Energy of level n (hydrogen-like):  Eₙ = −13.6 · Z² / n²   eV
//   • Bohr radius:                         rₙ = 0.529 · n² / Z    Å
//   • Rydberg / wavelength:  1/λ = R_H · Z² · (1/n₁² − 1/n₂²),
//                            R_H = 1.097×10⁷ m⁻¹ = 0.01097 nm⁻¹
//   • Angular-momentum quantisation: m v r = n·h/2π  ⇒  2π rₙ = n·λ_deBroglie
//     (n whole de-Broglie wavelengths fit the orbit — the standing-wave reason
//      the orbits are quantised at all)
//   • Series (n_final): Lyman→1 (UV), Balmer→2 (visible), Paschen→3 (IR),
//     Brackett→4, Pfund→5
//   • Balmer visible lines: Hα 656.3, Hβ 486.1, Hγ 434.0, Hδ 410.2 nm
//   • Series limits (n₂→∞): Lyman 91.2 nm, Balmer 364.6 nm
//   • Photoelectric bridge: E(eV) = 1240 / λ(nm)
//
// NOTE on colour: the SIMULATION_DESIGN_WORKFLOW palette governs all CHROME
// (orange/amber accents, #0d1117 surfaces, emerald/red semantics). The spectrum
// itself uses WAVELENGTH-ACCURATE colours (656 nm = red, 486 = cyan, …) — those
// are physics, not decoration, so the "no new colours" rule does not apply to
// the rendered spectral lines / photon. This is intentional.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

// ── chrome palette (workflow §3 + CLAUDE.md §7) ─────────────────────────────
const C = {
  bg: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  orange: '#f97316',
  amber: '#fbbf24',
  amberLight: '#fcd34d',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  red: '#f87171',
  redDark: '#dc2626',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
};

// ── physics constants ───────────────────────────────────────────────────────
const RH = 0.01097;   // Rydberg constant, nm⁻¹
const E_RYD = 13.6;   // eV — |E₁| for hydrogen
const NMAX = 6;       // highest orbit drawn in the atom pane
const SPEC_MIN = 80;  // nm — left edge of the (log) spectrum axis
const SPEC_MAX = 8000;// nm — right edge (covers Lyman → Pfund)

// hydrogen-like helpers (Z = nuclear charge)
const energyEv = (n: number, Z: number) => -E_RYD * Z * Z / (n * n);
const radiusA = (n: number, Z: number) => 0.529 * n * n / Z;
const wavelengthNm = (nLow: number, nHigh: number, Z: number) =>
  1 / (RH * Z * Z * (1 / (nLow * nLow) - 1 / (nHigh * nHigh)));
const seriesLimitNm = (nLow: number, Z: number) =>
  1 / (RH * Z * Z * (1 / (nLow * nLow)));
const photonEv = (nLow: number, nHigh: number, Z: number) =>
  energyEv(nHigh, Z) - energyEv(nLow, Z); // > 0

// log-scale x mapping for the spectrum axis
const L_MIN = Math.log10(SPEC_MIN);
const L_MAX = Math.log10(SPEC_MAX);
const specX = (wl: number, w: number, pad: number) => {
  const clamped = Math.min(Math.max(wl, SPEC_MIN), SPEC_MAX);
  return pad + ((Math.log10(clamped) - L_MIN) / (L_MAX - L_MIN)) * (w - pad * 2);
};

// wavelength → visible-ish RGB (physics colour). Approximation good enough for
// teaching; the four named Balmer lines are pinned to crisp hues.
function photonColor(wl: number): string {
  if (Math.abs(wl - 656.3) < 4) return '#ff5b6e';
  if (Math.abs(wl - 486.1) < 4) return '#3bc9db';
  if (Math.abs(wl - 434.0) < 4) return '#5c8dff';
  if (Math.abs(wl - 410.2) < 4) return '#b46cff';
  if (wl < 380) return '#9a6bff';                 // UV → violet-ish stand-in
  if (wl > 700) return '#ff6b6b';                 // IR → red stand-in
  const t = (700 - wl) / 320;                     // 380..700 → hue sweep
  return `hsl(${Math.round(t * 280)}, 85%, 62%)`;
}

function regionOf(wl: number): { label: string; visible: boolean } {
  if (wl < 380) return { label: 'Ultraviolet', visible: false };
  if (wl > 700) return { label: 'Infrared', visible: false };
  return { label: 'Visible', visible: true };
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

// ── guided narrative beats ──────────────────────────────────────────────────
type StepDef = {
  key: string;
  label: string;
  title: string;
  body: string;
  // pre-configures shared state when the student enters this beat
  enter: Partial<{ mode: 'emission' | 'absorption'; deBroglie: boolean; nFinal: number; nInitial: number }>;
};
const STEPS: StepDef[] = [
  {
    key: 'problem',
    label: 'The Problem',
    title: 'Why the classical atom should collapse',
    body:
      "Rutherford's electron orbits the nucleus like a planet. But a circling charge is accelerating, and accelerating charges radiate energy — so it should spiral into the nucleus in about 10⁻⁸ s. Matter would not exist. Something is wrong with classical physics here.",
    enter: { mode: 'emission', deBroglie: false },
  },
  {
    key: 'fix',
    label: "Bohr's Fix",
    title: 'Only whole standing waves survive',
    body:
      'Bohr allowed only special orbits where the electron neither spirals nor radiates. de Broglie showed why: an orbit is allowed only if a whole number of electron waves fit exactly around it (2πr = n·λ). A non-whole number interferes with itself and cancels. Toggle the wave on — watch n=3 close perfectly, while in-between radii would not.',
    enter: { deBroglie: true, mode: 'emission' },
  },
  {
    key: 'jump',
    title: 'A jump emits one photon',
    label: 'The Jump',
    body:
      'An electron can drop from a higher rung to a lower one. The energy it loses, ΔE, leaves as a single photon. Bigger drop → more energy → higher frequency → shorter (bluer) wavelength. Watch the ladder arrow, the photon, and the spectral line all appear together.',
    enter: { mode: 'emission', deBroglie: false, nFinal: 2, nInitial: 3 },
  },
  {
    key: 'series',
    label: 'A Whole Series',
    title: 'A series crowds toward its limit',
    body:
      'Fix the landing level (n_final) and every possible drop into it forms one series. Because the energy rungs bunch up near the top, the spectral lines bunch up too — converging on the series limit. That limit is exactly the energy to rip the electron off from that level: ionisation. Beyond it lies a continuous band — a free electron can take any energy.',
    enter: { mode: 'emission', deBroglie: false, nFinal: 2, nInitial: 6 },
  },
  {
    key: 'mirror',
    label: 'Absorption',
    title: 'Absorption is the mirror image',
    body:
      'Send white light through cold hydrogen and the atom absorbs exactly the photons it would emit — so a dark line appears at the identical wavelength. Emission (bright) and absorption (dark) are perfect complements. Flip the mode and compare the same jump.',
    enter: { mode: 'absorption', deBroglie: false, nFinal: 2, nInitial: 4 },
  },
];

// ── stacked fraction (workflow §2 — never the ÷ glyph) ──────────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.1, margin: '0 3px' }}>
      <span style={{ padding: '0 5px 1px' }}>{num}</span>
      <span style={{ padding: '1px 5px 0', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{den}</span>
    </span>
  );
}

type Readout = {
  nLow: number; nHigh: number; wl: number; ev: number; thz: number;
  color: string; region: string; visible: boolean; isAbsorption: boolean;
} | null;

export default function BohrSpectraSim() {
  const atomRef = useRef<HTMLCanvasElement>(null);
  const ladderRef = useRef<HTMLCanvasElement>(null);
  const specRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [stepIdx, setStepIdx] = useState(0);
  const [mode, setMode] = useState<'emission' | 'absorption'>('emission');
  const [Z, setZ] = useState(1);
  const [nFinal, setNFinal] = useState(2);
  const [nInitial, setNInitial] = useState(3);
  const [deBroglie, setDeBroglie] = useState(false);
  const [readout, setReadout] = useState<Readout>(null);

  // mutable animation state — no React re-render in the rAF loop
  const sim = useRef({
    mode: 'emission' as 'emission' | 'absorption',
    Z: 1,
    step: 0,
    nFinal: 2,
    nInitial: 3,
    deBroglie: false,
    elecN: 3,        // current level (float while animating)
    targetN: 3,
    hoveredN: -1,
    animating: false,
    angle: 0,
    arrowPulse: 0,
    // active transition mirrored into the ref so the rAF-loop draw fns never
    // read React state (avoids a stale-closure: the loop is created once).
    tr: null as null | { nLow: number; nHigh: number; color: string; ev: number; isAbsorption: boolean },
    photons: [] as Array<{ x: number; y: number; vx: number; color: string; type: 'emission' | 'absorption'; wl: number; targetN: number }>,
    burnt: [] as Array<{ wl: number; color: string; type: 'emission' | 'absorption' }>,
    aW: 0, aH: 0, lW: 0, lH: 0, sW: 0, sH: 0,
  });

  // ── sync React controls → sim ref ─────────────────────────────────────────
  useEffect(() => { sim.current.mode = mode; }, [mode]);
  useEffect(() => { sim.current.Z = Z; }, [Z]);
  useEffect(() => { sim.current.deBroglie = deBroglie; }, [deBroglie]);
  useEffect(() => { sim.current.nFinal = nFinal; }, [nFinal]);
  useEffect(() => { sim.current.nInitial = nInitial; }, [nInitial]);
  useEffect(() => { sim.current.step = stepIdx; }, [stepIdx]);

  // place electron at the resting level when mode / levels change
  useEffect(() => {
    const s = sim.current;
    if (mode === 'emission') { s.elecN = nInitial; s.targetN = nInitial; }
    else { s.elecN = nFinal; s.targetN = nFinal; }
    s.animating = false;
    s.tr = null;
  }, [mode, nFinal, nInitial]);

  // ── narrative beat ────────────────────────────────────────────────────────
  const goStep = useCallback((idx: number) => {
    const st = STEPS[idx];
    setStepIdx(idx);
    if (st.enter.mode) setMode(st.enter.mode);
    if (st.enter.deBroglie !== undefined) setDeBroglie(st.enter.deBroglie);
    if (st.enter.nFinal !== undefined) setNFinal(st.enter.nFinal);
    if (st.enter.nInitial !== undefined) setNInitial(st.enter.nInitial);
    sim.current.burnt = [];
    sim.current.photons = [];
    sim.current.tr = null;
    setReadout(null);
  }, []);

  // ── fire a transition ─────────────────────────────────────────────────────
  const fire = useCallback((nLow: number, nHigh: number) => {
    const s = sim.current;
    if (s.animating || nLow >= nHigh) return;
    const wl = wavelengthNm(nLow, nHigh, s.Z);
    const ev = photonEv(nLow, nHigh, s.Z);
    const color = photonColor(wl);
    const reg = regionOf(wl);
    s.arrowPulse = 1;
    s.tr = { nLow, nHigh, color, ev, isAbsorption: s.mode === 'absorption' };

    if (s.mode === 'emission') {
      s.elecN = nHigh; s.targetN = nLow; s.animating = true;
      setTimeout(() => {
        s.photons.push({ type: 'emission', x: s.aW * 0.5, y: s.aH * 0.5, vx: 6, color, wl, targetN: nLow });
      }, 260);
    } else {
      s.elecN = nLow; s.targetN = nLow;
      s.photons.push({ type: 'absorption', x: -10, y: s.aH * 0.5, vx: 6, color, wl, targetN: nHigh });
    }
    setReadout({
      nLow, nHigh, wl: Math.round(wl * 10) / 10, ev: Math.round(ev * 1000) / 1000,
      thz: Math.round((299792.458 / wl) * 10) / 10, color,
      region: reg.label, visible: reg.visible, isAbsorption: s.mode === 'absorption',
    });
  }, []);

  // ── DRAW: the atom ────────────────────────────────────────────────────────
  function drawAtom(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.aW, h = s.aH, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    // background
    const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.7);
    bg.addColorStop(0, '#11182a');
    bg.addColorStop(1, C.card);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    // radii ∝ n²  — THE conceptual fix. n=6 fills the pane; n=1 is genuinely tiny.
    const maxR = Math.min(w, h) * 0.46;
    const rOf = (n: number) => (n * n) / (NMAX * NMAX) * maxR;

    // orbits
    ctx.setLineDash([3, 6]); ctx.lineWidth = 1;
    for (let n = 1; n <= NMAX; n++) {
      ctx.beginPath();
      ctx.arc(cx, cy, rOf(n), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '600 11px Geist, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`n=${n}`, cx + rOf(n) + 4, cy - 3);
    }
    ctx.setLineDash([]);

    // collapse-warning ghost spiral (opening beat only)
    if (s.step === 0) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 8; a += 0.12) {
        const rr = rOf(3) * (1 - a / (Math.PI * 8));
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(248,113,113,0.5)';
      ctx.setLineDash([2, 4]); ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.red; ctx.font = '600 11px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('classical: spirals in ~10⁻⁸ s', cx, h - 14);
    }

    // nucleus
    const pulse = Math.abs(Math.sin(Date.now() / 700)) * 1.6;
    const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12 + pulse);
    ng.addColorStop(0, '#fff'); ng.addColorStop(0.4, C.amber); ng.addColorStop(1, 'transparent');
    ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(cx, cy, 13 + pulse, 0, Math.PI * 2); ctx.fill();

    // hover preview arrow
    if (s.hoveredN !== -1 && !s.animating) {
      const cur = Math.round(s.elecN);
      const valid = s.mode === 'emission' ? s.hoveredN < cur : s.hoveredN > cur;
      if (valid) {
        const nLow = Math.min(s.hoveredN, cur), nHigh = Math.max(s.hoveredN, cur);
        const col = photonColor(wavelengthNm(nLow, nHigh, s.Z));
        ctx.beginPath(); ctx.arc(cx, cy, rOf(s.hoveredN), 0, Math.PI * 2);
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowBlur = 10; ctx.shadowColor = col;
        ctx.stroke(); ctx.shadowBlur = 0;
      }
    }

    // electron motion / animated drop
    s.angle += 0.02 / Math.max(1, s.elecN);
    if (s.animating) {
      if (Math.abs(s.elecN - s.targetN) < 0.04) { s.elecN = s.targetN; s.animating = false; }
      else s.elecN += (s.targetN - s.elecN) * 0.12;
    }
    const rNow = rOf(s.elecN);

    // de Broglie standing wave around the current orbit (n whole wavelengths)
    if (s.deBroglie) {
      const nWhole = Math.round(s.elecN);
      const amp = Math.min(10, rNow * 0.16);
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.04) {
        const rr = rNow + Math.sin(nWhole * a) * amp;
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(96,165,250,0.85)'; ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(96,165,250,0.6)'; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(147,197,253,0.9)'; ctx.font = '600 11px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`2πr = ${nWhole} λ  ✓`, cx, cy + rNow + amp + 16);
    }

    // electron
    const ex = cx + Math.cos(s.angle) * rNow, ey = cy + Math.sin(s.angle) * rNow;
    ctx.fillStyle = '#fff'; ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    // photons
    for (let i = s.photons.length - 1; i >= 0; i--) {
      const p = s.photons[i];
      p.x += p.vx;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      for (let j = 0; j < 16; j++) {
        ctx.lineTo(p.x - j * 3 * Math.sign(p.vx), p.y + Math.sin((p.x - j * 3 * Math.sign(p.vx)) * 0.25) * 5);
      }
      ctx.strokeStyle = p.color; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();

      if (p.type === 'emission' && p.x > w) {
        s.photons.splice(i, 1);
        if (!s.burnt.some((b) => Math.abs(b.wl - p.wl) < 0.5)) s.burnt.push({ wl: p.wl, color: p.color, type: 'emission' });
      } else if (p.type === 'absorption' && p.x >= cx - rOf(Math.round(s.elecN))) {
        s.photons.splice(i, 1);
        s.targetN = p.targetN; s.animating = true;
        if (!s.burnt.some((b) => Math.abs(b.wl - p.wl) < 0.5)) s.burnt.push({ wl: p.wl, color: p.color, type: 'absorption' });
      }
    }
    if (s.arrowPulse > 0) s.arrowPulse = Math.max(0, s.arrowPulse - 0.02);
  }

  // ── DRAW: the energy ladder ───────────────────────────────────────────────
  function drawLadder(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.lW, h = s.lH;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);

    const padT = 30, padB = 28, H = h - padT - padB;
    const xAxis = 52, xLevelEnd = w - 56;
    // y is linear in E, normalised by the ground-state energy so n=1 sits at the
    // bottom for any Z and levels converge to E=0 at the top.
    const E1 = energyEv(1, s.Z);
    const yOfE = (E: number) => padT + (E / E1) * H; // E=E1 → bottom; E=0 → top

    // continuum band (E ≥ 0 → above the n=∞ line)
    const yZero = yOfE(0);
    const cg = ctx.createLinearGradient(0, padT, 0, yZero);
    cg.addColorStop(0, 'rgba(249,115,22,0.16)'); cg.addColorStop(1, 'rgba(249,115,22,0.03)');
    ctx.fillStyle = cg; ctx.fillRect(xAxis, padT, xLevelEnd - xAxis, yZero - padT);
    ctx.fillStyle = 'rgba(251,191,36,0.8)'; ctx.font = '600 10px Geist, system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('continuum — free electron, any energy', xAxis + 6, padT + 13);

    // axis
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xAxis, padT - 4); ctx.lineTo(xAxis, h - padB + 4); ctx.stroke();
    ctx.fillStyle = C.text2; ctx.font = '600 10px Geist, system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('E (eV)', xAxis - 6, padT - 8);

    // n=∞ / ionisation line
    ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(251,191,36,0.55)';
    ctx.beginPath(); ctx.moveTo(xAxis, yZero); ctx.lineTo(xLevelEnd, yZero); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.amber; ctx.textAlign = 'right'; ctx.fillText('0  (n=∞)', xAxis - 6, yZero + 3);

    // rungs n=1..7 (7 is the "near ∞" convergence cue)
    const cur = Math.round(s.elecN);
    for (let n = 1; n <= 7; n++) {
      const E = energyEv(n, s.Z), y = yOfE(E);
      const isSeriesFloor = n === s.nFinal;
      ctx.strokeStyle = isSeriesFloor ? 'rgba(249,115,22,0.9)' : 'rgba(255,255,255,0.28)';
      ctx.lineWidth = isSeriesFloor ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(xAxis, y); ctx.lineTo(xLevelEnd, y); ctx.stroke();
      ctx.fillStyle = isSeriesFloor ? C.amberLight : 'rgba(255,255,255,0.55)';
      ctx.textAlign = 'left'; ctx.font = '600 10px Geist, system-ui, sans-serif';
      ctx.fillText(`n=${n}${n === 7 ? '…' : ''}`, xLevelEnd + 5, y + 3);
      // energy value for the first few rungs
      if (n <= 4) {
        ctx.fillStyle = C.ghost; ctx.textAlign = 'right';
        ctx.fillText(`${E.toFixed(2)}`, xAxis - 6, y + 3);
      }
      // electron marker
      if (n === cur && !s.animating) {
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 8; ctx.shadowColor = '#fff';
        ctx.beginPath(); ctx.arc(xAxis + 14, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
    }

    // transition arrow (length = ΔE = photon energy) — read from the ref, not
    // React state, so the once-created animation loop stays in sync.
    const tr = s.tr;
    if (tr) {
      const yHi = yOfE(energyEv(tr.nHigh, s.Z));
      const yLo = yOfE(energyEv(tr.nLow, s.Z));
      const ax = (xAxis + xLevelEnd) / 2;
      const down = !tr.isAbsorption; // emission falls
      const yA = down ? yHi : yLo, yB = down ? yLo : yHi;
      ctx.strokeStyle = tr.color; ctx.lineWidth = 2 + s.arrowPulse * 1.5;
      ctx.shadowBlur = 6 + s.arrowPulse * 8; ctx.shadowColor = tr.color;
      ctx.beginPath(); ctx.moveTo(ax, yA); ctx.lineTo(ax, yB); ctx.stroke();
      // arrowhead
      const dir = yB > yA ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(ax - 5, yB - dir * 9); ctx.lineTo(ax, yB); ctx.lineTo(ax + 5, yB - dir * 9);
      ctx.stroke(); ctx.shadowBlur = 0;
      // ΔE label
      ctx.fillStyle = tr.color; ctx.textAlign = 'left'; ctx.font = '700 11px Geist, system-ui, sans-serif';
      ctx.fillText(`ΔE = ${tr.ev.toFixed(2)} eV`, ax + 9, (yA + yB) / 2 + 3);
    }
  }

  // ── DRAW: the spectrum ────────────────────────────────────────────────────
  function drawSpectrum(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.sW, h = s.sH;
    ctx.clearRect(0, 0, w, h);
    const pad = 26;
    const stripTop = 30, stripH = h - stripTop - 34;
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
      vg.addColorStop(0, 'rgba(180,108,255,0.22)'); vg.addColorStop(0.5, 'rgba(59,201,219,0.22)'); vg.addColorStop(1, 'rgba(255,91,110,0.22)');
      ctx.fillStyle = vg; ctx.fillRect(vx1, stripTop, vx2 - vx1, stripH);
    }
    ctx.fillStyle = absorption ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.4)';
    ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('VISIBLE', (vx1 + vx2) / 2, stripTop - 6);
    ctx.textAlign = 'left'; ctx.fillText('◀ UV', pad, stripTop - 6);
    ctx.textAlign = 'right'; ctx.fillText('IR ▶', w - pad, stripTop - 6);

    // wavelength ticks (log)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    [100, 200, 400, 700, 1500, 4000].forEach((wl) => {
      const x = specX(wl, w, pad);
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x, stripTop + stripH, 1, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillText(`${wl}`, x, stripTop + stripH + 16);
    });

    // faint full series (all drops into nFinal) + the series limit
    for (let nHi = s.nFinal + 1; nHi <= 14; nHi++) {
      const wl = wavelengthNm(s.nFinal, nHi, s.Z);
      const x = specX(wl, w, pad);
      ctx.strokeStyle = absorption ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, stripTop); ctx.lineTo(x, stripTop + stripH); ctx.stroke();
    }
    // series limit (n→∞) = ionisation from nFinal
    const limit = seriesLimitNm(s.nFinal, s.Z);
    const lx = specX(limit, w, pad);
    ctx.strokeStyle = C.amber; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(lx, stripTop - 4); ctx.lineTo(lx, stripTop + stripH + 4); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.amberLight; ctx.font = '600 9px Geist, system-ui, sans-serif';
    ctx.textAlign = lx > w - 90 ? 'right' : 'left';
    ctx.fillText(`${seriesName(s.nFinal)} limit → ionisation`, lx + (lx > w - 90 ? -5 : 5), stripTop + stripH - 4);

    // burnt lines (what the student has fired)
    s.burnt.forEach((b) => {
      const x = specX(b.wl, w, pad);
      if (b.type === 'absorption') {
        ctx.fillStyle = 'rgba(5,6,12,0.95)'; ctx.fillRect(x - 1.5, stripTop, 3, stripH);
      } else {
        ctx.fillStyle = b.color; ctx.fillRect(x - 1.5, stripTop, 3, stripH);
        ctx.shadowBlur = 10; ctx.shadowColor = b.color; ctx.fillRect(x - 1.5, stripTop, 3, stripH); ctx.shadowBlur = 0;
      }
    });
  }

  // ── animation loop + sizing ───────────────────────────────────────────────
  useEffect(() => {
    const a = atomRef.current, l = ladderRef.current, sp = specRef.current;
    if (!a || !l || !sp) return;

    function size(canvas: HTMLCanvasElement, minH: number): [number, number] {
      const r = canvas.parentElement!.getBoundingClientRect();
      const W = Math.max(r.width, 240), Hh = Math.max(r.height, minH);
      canvas.width = W * 2; canvas.height = Hh * 2;
      const ctx = canvas.getContext('2d')!; ctx.setTransform(2, 0, 0, 2, 0, 0);
      return [W, Hh];
    }
    function resize() {
      const s = sim.current;
      [s.aW, s.aH] = size(a!, 380);
      [s.lW, s.lH] = size(l!, 380);
      [s.sW, s.sH] = size(sp!, 200);
    }

    const t = setTimeout(() => {
      resize();
      const loop = () => {
        const ca = a!.getContext('2d'), cl = l!.getContext('2d'), cs = sp!.getContext('2d');
        if (ca) drawAtom(ca);
        if (cl) drawLadder(cl);
        if (cs) drawSpectrum(cs);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, 60);

    window.addEventListener('resize', resize);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── atom-pane mouse interaction ───────────────────────────────────────────
  function atomMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const s = sim.current;
    if (s.animating) { s.hoveredN = -1; return; }
    const rect = atomRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = s.aW / 2, cy = s.aH / 2;
    const maxR = Math.min(s.aW, s.aH) * 0.46;
    const dist = Math.hypot(x - cx, y - cy);
    s.hoveredN = -1;
    for (let n = 1; n <= NMAX; n++) {
      const rn = (n * n) / (NMAX * NMAX) * maxR;
      if (Math.abs(dist - rn) < 16) {
        const cur = Math.round(s.elecN);
        if ((s.mode === 'emission' && n < cur) || (s.mode === 'absorption' && n > cur)) s.hoveredN = n;
        break;
      }
    }
  }
  function atomClick() {
    const s = sim.current;
    if (s.animating || s.hoveredN === -1) return;
    const cur = Math.round(s.elecN), n = s.hoveredN; s.hoveredN = -1;
    const nLow = Math.min(n, cur), nHigh = Math.max(n, cur);
    setNFinal(nLow); setNInitial(nHigh);
    fire(nLow, nHigh);
  }

  const step = STEPS[stepIdx];
  const ZLABELS = ['H', 'He⁺', 'Li²⁺', 'Be³⁺'];

  // small UI helpers ----------------------------------------------------------
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
            Bohr Model <span style={{ color: C.orange }}>→</span> Hydrogen Spectrum
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            One atom · one energy ladder · one spectrum — all in sync
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          Eₙ = −13.6 Z² / n²
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
                background: active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(249,115,22,0.45)' : C.border}`,
                color: active ? C.amberLight : 'rgba(255,255,255,0.4)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: active ? C.orange : 'rgba(255,255,255,0.06)', color: active ? '#000' : '#fff' }}>{i + 1}</span>
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

      {/* ── THE THREE SYNCHRONISED PANES (full width) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div>
          <PaneLabel accent={C.orange}>The Atom · radius ∝ n²</PaneLabel>
          <div className="relative w-full" style={{ height: 380 }}>
            <canvas ref={atomRef} className="w-full h-full block rounded-xl cursor-crosshair"
              style={{ border: `1px solid ${C.border}` }}
              onMouseMove={atomMove} onMouseLeave={() => { sim.current.hoveredN = -1; }} onClick={atomClick} />
          </div>
        </div>
        <div>
          <PaneLabel accent={C.amber}>Energy Levels · rungs converge to 0</PaneLabel>
          <div className="relative w-full" style={{ height: 380 }}>
            <canvas ref={ladderRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${C.border}` }} />
          </div>
        </div>
        <div>
          <PaneLabel accent={C.emerald}>The Spectrum · series → limit</PaneLabel>
          <div className="flex flex-col gap-3 h-[380px]">
            <div className="relative w-full" style={{ height: 200 }}>
              <canvas ref={specRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${C.border}` }} />
            </div>
            {/* live readout sits under the spectrum (this pane is the tall one) */}
            <div className="flex-1 rounded-xl px-4 py-3 flex flex-col justify-center"
              style={{ background: C.card, border: `1px solid ${C.border}` }}>
              {readout ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-4 h-4 rounded" style={{ background: readout.color, boxShadow: `0 0 10px ${readout.color}` }} />
                    <span className="text-sm font-bold tabular-nums" style={{ color: readout.color }}>
                      {readout.isAbsorption ? 'Absorbed' : 'Emitted'} · λ = {readout.wl} nm
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ color: readout.visible ? C.emeraldLight : C.ghost, background: readout.visible ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)' }}>
                      {readout.region}{readout.visible ? '' : ' (invisible)'}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: C.text2 }}>
                    <span className="tabular-nums">ΔE = <strong style={{ color: C.text }}>{readout.ev.toFixed(3)}</strong> eV</span>
                    <span className="tabular-nums">ν = <strong style={{ color: C.text }}>{readout.thz.toFixed(0)}</strong> THz</span>
                    <span className="tabular-nums">n={readout.nHigh} → n={readout.nLow}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm" style={{ color: C.muted }}>
                  Click an inner orbit (or pick a jump below) — the photon, the energy arrow and the spectral line all appear together.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS (below, full width) ── */}
      <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* mode */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Mode</div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#05060c', border: `1px solid ${C.line}` }}>
              {(['emission', 'absorption'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 px-3 py-2 rounded-md text-xs font-bold capitalize transition-all"
                  style={{ background: mode === m ? 'rgba(249,115,22,0.18)' : 'transparent', color: mode === m ? C.amberLight : 'rgba(255,255,255,0.45)', border: mode === m ? `1px solid rgba(249,115,22,0.4)` : '1px solid transparent' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* series (n_final) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
              Series — landing level n<sub>final</sub>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SERIES.map((s) => (
                <button key={s.nFinal}
                  onClick={() => { setNFinal(s.nFinal); if (nInitial <= s.nFinal) setNInitial(s.nFinal + 1); }}
                  className="px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all"
                  style={{ background: nFinal === s.nFinal ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.04)', color: nFinal === s.nFinal ? C.amberLight : C.text2, border: `1px solid ${nFinal === s.nFinal ? 'rgba(249,115,22,0.4)' : C.border}` }}
                  title={`${s.name} · ${s.region}`}>
                  {s.name}<span className="opacity-60"> ·{s.nFinal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* transition (n_initial) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
              Jump from n<sub>initial</sub>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[2, 3, 4, 5, 6, 7].filter((n) => n > nFinal).map((n) => (
                <button key={n}
                  onClick={() => { setNInitial(n); fire(nFinal, n); }}
                  className="w-9 h-9 rounded-md text-xs font-bold tabular-nums transition-all"
                  style={{ background: nInitial === n ? 'rgba(16,185,129,0.16)' : 'rgba(255,255,255,0.04)', color: nInitial === n ? C.emeraldLight : C.text2, border: `1px solid ${nInitial === n ? 'rgba(16,185,129,0.4)' : C.border}` }}>
                  {n}
                </button>
              ))}
              <button onClick={() => fire(nFinal, nInitial)}
                className="px-3 h-9 rounded-md text-xs font-bold transition-all"
                style={{ background: 'rgba(249,115,22,0.9)', color: '#000' }}>
                ▶ Fire
              </button>
            </div>
          </div>

          {/* Z + de Broglie */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest mb-2 flex justify-between" style={{ color: C.muted }}>
                <span>Nucleus Z</span>
                <span style={{ color: C.amberLight }}>{ZLABELS[Z - 1]} (Z={Z})</span>
              </div>
              <input type="range" min={1} max={4} step={1} value={Z}
                onChange={(e) => setZ(parseInt(e.target.value, 10))}
                className="w-full accent-orange-500" style={{ accentColor: C.orange }} />
            </div>
            <button onClick={() => setDeBroglie((v) => !v)}
              className="self-start text-xs font-bold transition-colors pb-0.5"
              style={{ color: deBroglie ? C.amber : C.muted, borderBottom: `1px solid ${deBroglie ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.12)'}` }}>
              {deBroglie ? '✓ de Broglie standing wave ON' : 'Show de Broglie standing wave'}
            </button>
          </div>
        </div>

        {/* live Rydberg equation */}
        <div className="mt-4 pt-4 flex items-center justify-center gap-3 flex-wrap text-lg" style={{ borderTop: `1px solid ${C.line}`, color: C.text }}>
          <span style={{ color: C.muted }} className="text-xs font-bold uppercase tracking-widest mr-1">Rydberg</span>
          <Frac num="1" den={<span style={{ fontStyle: 'italic' }}>λ</span>} />
          <span style={{ color: C.muted }}>=</span>
          <span style={{ color: C.amber, fontStyle: 'italic' }}>R<sub className="text-[0.6em]">H</sub></span>
          {Z > 1 && <span style={{ color: C.amber }}><span style={{ fontStyle: 'italic' }}>Z</span>²</span>}
          <span style={{ color: C.muted }}>[</span>
          <Frac num="1" den={<span className="tabular-nums">{nFinal}²</span>} />
          <span style={{ color: C.muted }}>−</span>
          <Frac num="1" den={<span className="tabular-nums">{nInitial}²</span>} />
          <span style={{ color: C.muted }}>]</span>
          <span style={{ color: C.muted }}>⇒</span>
          <span className="tabular-nums font-bold" style={{ color: readout ? readout.color : C.muted }}>
            λ = {readout ? `${readout.wl} nm` : '—'}
          </span>
        </div>
      </div>

      {/* ── PAYOFF: series limit = ionisation ── */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(249,115,22,0.06)', border: `1px solid rgba(249,115,22,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          The spectral lines of the <strong style={{ color: C.text }}>{seriesName(nFinal)}</strong> series pile up at{' '}
          <strong style={{ color: C.amberLight }} className="tabular-nums">{Math.round(seriesLimitNm(nFinal, Z))} nm</strong> — its{' '}
          <strong style={{ color: C.text }}>series limit</strong>. That is exactly the energy to remove the electron from level n={nFinal}:{' '}
          <strong style={{ color: C.amberLight }} className="tabular-nums">{Math.abs(energyEv(nFinal, Z)).toFixed(2)} eV</strong> of ionisation energy.
          Past that limit the lines merge into a <strong style={{ color: C.text }}>continuum</strong> — the electron is free and can carry away any extra energy.
        </p>
      </div>

      {/* ── LIMITS OF THE MODEL ── */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-4 rounded" style={{ background: C.red }} />
          <h3 className="text-lg font-bold text-white">Where the Bohr model breaks</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['Only one electron', 'It nails hydrogen and one-electron ions (He⁺, Li²⁺ — try the Z slider) but fails the moment a second electron and its repulsion enter.'],
            ['No line intensities', 'It predicts where the lines fall, never why some are brighter than others.'],
            ['Defies uncertainty', 'A fixed circular orbit with a known radius and speed violates Heisenberg (1927). The electron has no definite path.'],
            ['No bonding', 'It cannot explain why atoms share electrons to make molecules — the basis of all chemistry.'],
          ].map(([t, b]) => (
            <div key={t} className="pl-3" style={{ borderLeft: `2px solid ${C.line}` }}>
              <div className="font-bold text-sm mb-1" style={{ color: C.text }}>{t}</div>
              <div className="text-sm leading-relaxed" style={{ color: C.text2 }}>{b}</div>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed mt-4" style={{ color: C.muted }}>
          The orbit was a stepping stone. The standing wave you toggled on is the real clue — it grows up into the quantum-mechanical orbital, where the electron is a cloud of probability, not a ball on a track.
        </p>
      </div>
    </div>
  );
}
