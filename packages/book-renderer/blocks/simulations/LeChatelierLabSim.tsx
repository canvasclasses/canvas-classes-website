'use client';

// ──────────────────────────────────────────────────────────────────────────
// Le Chatelier's Principle Lab  ·  simulation_id: 'le-chatelier-lab'
// Class 11 Chemistry · Chapter 7 (Equilibrium) · Le Chatelier: Concentration
//
// "Disturb an equilibrium and the system shifts to counteract the change."
// The student applies each kind of disturbance to a real, COLOUR-CHANGING
// equilibrium and watches it move — with a live Q-vs-Kc meter showing WHY the
// shift happens (the shift is always "Q chasing Kc back").
//
// THE REACTION (chosen because it makes every lever visible at once):
//     N2O4(g)  ⇌  2 NO2(g)
//   • N2O4 is COLOURLESS, NO2 is BROWN → the shift is literally a colour change
//   • ΔH°(forward) = +57.2 kJ/mol  → ENDOTHERMIC forward (heat favours NO2)
//   • Δn(gas) = +1 (1 mol gas → 2 mol gas) → pressure/volume lever bites
//   This is exactly the reaction NCERT Class 11 §7.8 uses for the heat & the
//   pressure experiments.
//
// THE MODEL (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7 — every
// number/direction below is standard NCERT Class 11 Ch.7 / JEE syllabus, NOT
// generated from training knowledge):
//   • Concentrations [X] = n_X / V  (n in mol, V in litres).
//   • van't Hoff (temperature dependence of Kc):
//       Kc(T) = K_ref · exp[ (−ΔH/R) · (1/T − 1/T_ref) ]
//       with ΔH = +57.2×10³ J/mol, R = 8.314 J/mol·K, T_ref = 298 K.
//       Because ΔH > 0 (endothermic forward), HIGHER T ⇒ HIGHER Kc ⇒ more NO2
//       (browner). This is the textbook "endothermic → heat is a reactant →
//       raising T shifts forward" result. K_ref is tuned so 298 K sits at a
//       visible brown mix, not at an extreme.
//   • Q = [NO2]² / [N2O4]. At equilibrium Q = Kc; a disturbance makes Q jump
//     off Kc, and the system shifts until Q = Kc again.
//   • CONSERVATION of atoms: every N2O4 that splits makes 2 NO2, so the total
//     "N2O4-equivalent"  A = n_N2O4 + n_NO2/2  is conserved on every lever
//     EXCEPT injecting/removing a species (which changes A directly).
//   • RE-SOLVE: with x = n_NO2 at the new equilibrium and n_N2O4 = A − x/2,
//       Kc = (x/V)² / ((A − x/2)/V) = x² / (V·(A − x/2))
//       ⇒ x² + (Kc·V/2)·x − Kc·V·A = 0   → take the positive root.
//     Then animate [N2O4], [NO2] from the disturbed values to that root.
//
//   LEVER DIRECTIONS (all standard Le Chatelier results, cited so they are not
//   "felt" — they are derived/known):
//   • Add NO2  → Q rises above Kc → shifts BACKWARD (remakes N2O4), brown fades.
//   • Add N2O4 → Q drops below Kc → shifts FORWARD (makes NO2), browns up.
//   • Remove NO2 → Q drops → shifts FORWARD to replace it.
//   • Compress (V↓) → higher pressure → shifts toward FEWER gas moles = toward
//     N2O4 (left). [Even though concentrations rise, Q = [NO2]²/[N2O4] rises
//     faster than Kc, so the back-shift is what restores Q = Kc.]
//   • Expand (V↑) → toward MORE gas moles = toward NO2 (right), browner.
//   • Inert gas at CONSTANT V → partial pressures / molar concentrations of the
//     reacting gases are UNCHANGED → Q unchanged → NO SHIFT. (#1 exam trap.)
//   • Inert gas at CONSTANT P → total V must expand to hold P → behaves like an
//     expansion → shifts toward MORE moles (NO2).
//   • Catalyst → speeds BOTH directions equally → NO shift in position; only
//     reaches equilibrium sooner.
//
// COLOUR NOTE: all CHROME uses the SIMULATION_DESIGN_WORKFLOW palette (indigo/
// amber accents, #0d1117 surfaces, emerald/red semantics). The NO2 brown is a
// WAVELENGTH-ACCURATE physics colour (NO2 absorbs blue/green, transmits red-
// orange-brown) — that is physics, not decoration, so the "no new colours" rule
// does not apply to it. Same documented exception as the spectral lines in
// BohrSpectraSim / HydrogenSpectrumDecoderSim.
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
  redDeep: '#dc2626',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
};

// the ONE physics colour: NO2 brown (the gas's true transmitted colour).
const NO2_BROWN = '#a85832';

// ── physics constants ───────────────────────────────────────────────────────
const DELTA_H = 57.2e3;   // J/mol — ΔH° forward (endothermic), NCERT Ch.7
const R_GAS = 8.314;      // J/mol·K
const T_REF = 298;        // K — reference temperature for K_ref
const K_REF = 0.5;        // mol/L — tuned so 298 K gives a visible brown mix
const T_MIN = 273;        // K — slider min
const T_MAX = 373;        // K — slider max

// Kc as a function of temperature (van't Hoff). ΔH>0 ⇒ Kc rises with T.
const kcAt = (T: number) =>
  K_REF * Math.exp((-DELTA_H / R_GAS) * (1 / T - 1 / T_REF));

// ── scientific notation → "5.0 × 10⁻²" (workflow §2, never "5e-2") ───────────
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
// format a small concentration / Q value nicely
const fmt = (v: number) => {
  if (!isFinite(v)) return '—';
  if (v === 0) return '0';
  if (v >= 0.01 && v < 1000) return v.toFixed(3);
  return prettyExp(v.toExponential(2));
};

// ── stacked fraction (workflow §2 — never the ÷ glyph) ──────────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.1, margin: '0 3px' }}>
      <span style={{ padding: '0 5px 1px' }}>{num}</span>
      <span style={{ padding: '1px 5px 0', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{den}</span>
    </span>
  );
}

// ── equilibrium re-solve ─────────────────────────────────────────────────────
// Given conserved N2O4-equivalent A, volume V, and Kc, solve for the new
// equilibrium NO2 amount x (mol) from:  x² + (Kc·V/2)x − Kc·V·A = 0  (x ≥ 0).
// Returns the two amounts {nN2O4, nNO2}.
function solveEquilibrium(A: number, V: number, Kc: number): { nN2O4: number; nNO2: number } {
  const b = (Kc * V) / 2;
  const c = -Kc * V * A;
  // positive root of x² + b·x + c = 0
  const disc = Math.sqrt(b * b - 4 * c);   // c<0 ⇒ disc real & > |b|
  let x = (-b + disc) / 2;
  x = Math.max(0, Math.min(x, 2 * A));     // x = n_NO2 can be at most 2A (all split)
  return { nN2O4: Math.max(0, A - x / 2), nNO2: x };
}

const concOf = (n: number, V: number) => n / V;
// Q = [NO2]² / [N2O4]
const reactionQ = (nN2O4: number, nNO2: number, V: number) => {
  const a = concOf(nN2O4, V);
  const b = concOf(nNO2, V);
  if (a <= 1e-9) return Infinity;
  return (b * b) / a;
};

// brown opacity from NO2 mole fraction (0..1) — flask darkens as NO2 grows.
const brownAlpha = (nN2O4: number, nNO2: number) => {
  const tot = nN2O4 + nNO2;
  if (tot <= 1e-9) return 0;
  const frac = nNO2 / tot;
  return Math.min(0.92, 0.06 + frac * 0.9);
};

// ── guided narrative beats ──────────────────────────────────────────────────
type StepDef = { key: string; label: string; title: string; body: string };
const STEPS: StepDef[] = [
  {
    key: 'principle',
    label: 'The Principle',
    title: 'Disturb an equilibrium and it pushes back',
    body:
      'Le Chatelier’s principle: if you disturb a system at equilibrium, it shifts in the direction that partly cancels your disturbance. Our test reaction is N₂O₄ ⇌ 2 NO₂ — N₂O₄ is colourless, NO₂ is brown, so any shift shows up as the flask getting darker or lighter. The real driver is the reaction quotient Q: at equilibrium Q = Kᶜ. A disturbance makes Q jump OFF Kᶜ, and the system moves until Q = Kᶜ again. Watch the Q-vs-K meter on every move.',
  },
  {
    key: 'concentration',
    label: 'Concentration',
    title: 'Add or remove a species → Q jumps, system chases it back',
    body:
      'Add NO₂ and Q = [NO₂]²/[N₂O₄] shoots ABOVE Kᶜ — the system shifts BACKWARD, eating NO₂ to remake N₂O₄, and the brown fades back. Add N₂O₄ (or remove NO₂) and Q drops BELOW Kᶜ — the system shifts FORWARD to make more NO₂, browning up. Kᶜ never changed; only Q was knocked away and crawled back. Try the three concentration buttons.',
  },
  {
    key: 'pressure',
    label: 'Pressure & Volume',
    title: 'Squeeze toward fewer gas molecules',
    body:
      'Halve the volume (compress) and the pressure doubles. The side with FEWER gas molecules relieves that pressure — here the left side (1 N₂O₄ vs 2 NO₂) — so the system shifts toward N₂O₄ and the brown fades. Double the volume (expand) and it shifts the other way, toward the 2-molecule side, getting browner. This lever only works because the two sides have different numbers of gas molecules (Δn = +1).',
  },
  {
    key: 'temperature',
    label: 'Temperature',
    title: 'Heat is a reactant for an endothermic reaction',
    body:
      'The forward reaction is endothermic (ΔH = +57.2 kJ/mol), so you can treat heat as a reactant: N₂O₄ + heat ⇌ 2 NO₂. Raise the temperature and the system consumes that extra heat by going FORWARD — more NO₂, deeper brown — and this is the one lever that actually CHANGES Kᶜ (it climbs with T). Cool it down and it retreats to colourless N₂O₄. Drag the temperature slider.',
  },
  {
    key: 'inertcat',
    label: 'Inert gas & Catalyst',
    title: 'The two famous "no-shift" traps',
    body:
      'Add argon at CONSTANT volume: it raises the total pressure but the concentrations of N₂O₄ and NO₂ are untouched, so Q is unchanged and there is NO shift — the classic exam trap. Add argon at CONSTANT pressure and the vessel must expand to fit it, which IS an expansion, so it shifts toward more molecules (browner). A catalyst speeds the forward and backward reactions equally: it reaches equilibrium faster but never moves where equilibrium sits.',
  },
];

// disturbance kinds (for the "what just happened" line + animation trigger)
type Note = { text: string; tone: 'forward' | 'backward' | 'none' };

export default function LeChatelierLabSim() {
  const flaskRef = useRef<HTMLCanvasElement>(null);
  const meterRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [stepIdx, setStepIdx] = useState(0);
  const [temp, setTemp] = useState(298);          // K
  const [volume, setVolume] = useState(2);         // litres
  const [note, setNote] = useState<Note>({
    text: 'System is at equilibrium — Q = Kᶜ. Apply a disturbance and watch it move.',
    tone: 'none',
  });

  // live readouts mirrored out of the rAF loop into React for the panel
  const [readout, setReadout] = useState({ nN2O4: 0, nNO2: 0, Q: 0, Kc: 0, dir: 'eq' as 'fwd' | 'back' | 'eq' });

  // mutable physics/draw state — never triggers React re-render inside rAF
  const sim = useRef({
    // current (possibly mid-animation) amounts
    nN2O4: 1.2,
    nNO2: 0.8,
    // animation target amounts
    tN2O4: 1.2,
    tNO2: 0.8,
    // animation start amounts + progress 0..1
    sN2O4: 1.2,
    sNO2: 0.8,
    anim: 1,                 // 1 = settled, <1 = mid shift
    V: 2,
    T: 298,
    Kc: kcAt(298),
    // Q is held at its DISTURBED value briefly then relaxes to Kc as anim runs
    qDisplay: kcAt(298),
    qJump: kcAt(298),        // Q value at the instant of disturbance
    fW: 0, fH: 0, mW: 0, mH: 0,
    pulse: 0,
  });

  // ── settle to equilibrium for the current V, T (no disturbance to A) ───────
  const settleNow = useCallback((silent = false) => {
    const s = sim.current;
    const A = s.nN2O4 + s.nNO2 / 2;
    s.Kc = kcAt(s.T);
    const eq = solveEquilibrium(A, s.V, s.Kc);
    s.nN2O4 = eq.nN2O4; s.nNO2 = eq.nNO2;
    s.tN2O4 = eq.nN2O4; s.tNO2 = eq.nNO2;
    s.sN2O4 = eq.nN2O4; s.sNO2 = eq.nNO2;
    s.anim = 1; s.qDisplay = s.Kc; s.qJump = s.Kc;
    if (!silent) s.pulse = 1;
  }, []);

  // initialise to equilibrium once
  useEffect(() => {
    sim.current.V = volume; sim.current.T = temp;
    settleNow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── apply a disturbance: set new disturbed amounts + animate to new eq ──────
  // `mutate` adjusts the CURRENT amounts/V/T to the disturbed state; the new
  // equilibrium is then solved from the (possibly changed) conserved A.
  const disturb = useCallback((mutate: () => void, mkNote: (ctx: { dir: 'fwd' | 'back' | 'eq' }) => Note, noShift = false) => {
    const s = sim.current;
    // snapshot starting amounts for the animation
    mutate();
    s.Kc = kcAt(s.T);
    // Q at the instant just after the disturbance (before any shift)
    s.qJump = reactionQ(s.nN2O4, s.nNO2, s.V);
    s.qDisplay = s.qJump;

    const A = s.nN2O4 + s.nNO2 / 2;
    const eq = noShift
      ? { nN2O4: s.nN2O4, nNO2: s.nNO2 }
      : solveEquilibrium(A, s.V, s.Kc);

    s.sN2O4 = s.nN2O4; s.sNO2 = s.nNO2;
    s.tN2O4 = eq.nN2O4; s.tNO2 = eq.nNO2;
    s.anim = noShift ? 1 : 0;
    s.pulse = 1;

    const dir: 'fwd' | 'back' | 'eq' = noShift
      ? 'eq'
      : eq.nNO2 > s.nNO2 + 1e-6 ? 'fwd' : eq.nNO2 < s.nNO2 - 1e-6 ? 'back' : 'eq';
    setNote(mkNote({ dir }));
  }, []);

  // ── concentration levers ───────────────────────────────────────────────────
  const addNO2 = () => disturb(
    () => { sim.current.nNO2 += 0.8; },
    () => ({ tone: 'backward', text: 'You added NO₂ → Q rose above Kᶜ → the system shifts BACKWARD to remake N₂O₄, and the brown fades.' }),
  );
  const addN2O4 = () => disturb(
    () => { sim.current.nN2O4 += 1.0; },
    () => ({ tone: 'forward', text: 'You added N₂O₄ → Q dropped below Kᶜ → the system shifts FORWARD to make more NO₂, and the brown deepens.' }),
  );
  const removeNO2 = () => disturb(
    () => { sim.current.nNO2 = Math.max(0.05, sim.current.nNO2 - 0.6); },
    () => ({ tone: 'forward', text: 'You removed NO₂ → Q dropped below Kᶜ → the system shifts FORWARD to replace the NO₂ you took out.' }),
  );

  // ── pressure / volume levers ───────────────────────────────────────────────
  const compress = () => disturb(
    () => { sim.current.V = Math.max(0.5, sim.current.V / 2); setVolume(sim.current.V); },
    () => ({ tone: 'backward', text: 'You halved the volume (pressure ↑) → the system shifts toward FEWER gas molecules, i.e. toward N₂O₄ — the brown fades.' }),
  );
  const expand = () => disturb(
    () => { sim.current.V = Math.min(16, sim.current.V * 2); setVolume(sim.current.V); },
    () => ({ tone: 'forward', text: 'You doubled the volume (pressure ↓) → the system shifts toward MORE gas molecules, i.e. toward NO₂ — the brown deepens.' }),
  );

  // ── temperature lever (slider) — changes Kc itself ─────────────────────────
  const onTemp = (T: number) => {
    setTemp(T);
    disturb(
      () => { sim.current.T = T; },
      ({ dir }) => ({
        tone: dir === 'fwd' ? 'forward' : dir === 'back' ? 'backward' : 'none',
        text: dir === 'fwd'
          ? `Heated to ${T} K → Kᶜ rises (endothermic forward) → shifts FORWARD, more NO₂, deeper brown.`
          : dir === 'back'
            ? `Cooled to ${T} K → Kᶜ falls → shifts BACKWARD toward colourless N₂O₄.`
            : `Temperature set to ${T} K.`,
      }),
    );
  };

  // ── inert gas + catalyst levers ────────────────────────────────────────────
  const argonConstV = () => disturb(
    () => { /* no change to amounts, V, or T */ },
    () => ({ tone: 'none', text: 'Added Ar at constant V → total pressure ↑, but [N₂O₄] and [NO₂] are unchanged → Q = Kᶜ still → NO shift. (The classic trap.)' }),
    true,
  );
  const argonConstP = () => disturb(
    () => { sim.current.V = Math.min(16, sim.current.V * 1.5); setVolume(sim.current.V); },
    () => ({ tone: 'forward', text: 'Added Ar at constant P → the vessel must expand → like an expansion → shifts toward MORE molecules (NO₂), browner.' }),
  );
  const addCatalyst = () => disturb(
    () => { /* no change */ },
    () => ({ tone: 'none', text: 'Added a catalyst → it speeds the forward and backward reactions equally → equilibrium arrives SOONER but does NOT move.' }),
    true,
  );

  const resetLab = () => {
    sim.current.nN2O4 = 1.2; sim.current.nNO2 = 0.8;
    sim.current.V = 2; sim.current.T = 298;
    setVolume(2); setTemp(298);
    settleNow(true);
    setNote({ text: 'Lab reset — back to equilibrium at 298 K, 2 L.', tone: 'none' });
  };

  // ── guided-beat presets ────────────────────────────────────────────────────
  const goStep = useCallback((idx: number) => {
    setStepIdx(idx);
    const s = sim.current;
    // each beat pre-sets a sensible neutral equilibrium so the lever it teaches
    // starts from a clean state
    s.V = 2; s.T = 298; setVolume(2); setTemp(298);
    s.nN2O4 = 1.2; s.nNO2 = 0.8;
    settleNow(true);
    setNote({ text: 'System at equilibrium — try the controls for this step.', tone: 'none' });
  }, [settleNow]);

  // ── DRAW: the reaction flask ───────────────────────────────────────────────
  function drawFlask(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.fW, h = s.fH;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);

    // flask geometry — round-bottom flask centred
    const cx = w / 2;
    const neckW = Math.max(18, w * 0.10);
    const neckTop = 18;
    const bulbCY = h * 0.60;
    const bulbR = Math.min(w * 0.32, h * 0.30);
    const neckBot = bulbCY - bulbR * 0.78;

    // gas colour fill = brown with opacity ∝ NO2 fraction
    const a = brownAlpha(s.nN2O4, s.nNO2);

    // ── flask body path (neck + bulb) used both for fill clip and outline ──
    function flaskPath() {
      ctx.beginPath();
      ctx.moveTo(cx - neckW / 2, neckTop);
      ctx.lineTo(cx - neckW / 2, neckBot);
      // left shoulder into bulb
      ctx.quadraticCurveTo(cx - bulbR, neckBot + bulbR * 0.3, cx - bulbR, bulbCY);
      ctx.arc(cx, bulbCY, bulbR, Math.PI, 0, true); // bottom half (anticlockwise: left→bottom→right)
      ctx.quadraticCurveTo(cx + bulbR, neckBot + bulbR * 0.3, cx + neckW / 2, neckBot);
      ctx.lineTo(cx + neckW / 2, neckTop);
    }

    // gas fill (clipped to flask interior)
    ctx.save();
    flaskPath();
    ctx.clip();
    // base dark interior
    ctx.fillStyle = '#070a10';
    ctx.fillRect(0, 0, w, h);
    // brown gas — radial so it reads as a volume of gas, not a flat panel
    const g = ctx.createRadialGradient(cx, bulbCY, bulbR * 0.15, cx, bulbCY, bulbR * 1.15);
    g.addColorStop(0, hexA(NO2_BROWN, Math.min(1, a + 0.12)));
    g.addColorStop(0.6, hexA(NO2_BROWN, a));
    g.addColorStop(1, hexA(NO2_BROWN, a * 0.5));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // a few drifting molecule specks (NO2 = brown, N2O4 = faint cool)
    const t = Date.now() / 1000;
    const nBrown = Math.round(Math.min(40, s.nNO2 * 14));
    const nClear = Math.round(Math.min(28, s.nN2O4 * 9));
    drawSpecks(ctx, cx, bulbCY, bulbR, neckBot, nClear, t, 0.7, 'rgba(180,200,230,0.30)', 11);
    drawSpecks(ctx, cx, bulbCY, bulbR, neckBot, nBrown, t, 1.0, hexA('#d97a44', 0.85), 33);
    ctx.restore();

    // flask outline (glass)
    flaskPath();
    ctx.strokeStyle = 'rgba(200,220,255,0.35)'; ctx.lineWidth = 2; ctx.stroke();
    // glass highlight
    ctx.beginPath();
    ctx.arc(cx - bulbR * 0.4, bulbCY - bulbR * 0.35, bulbR * 0.5, Math.PI * 1.05, Math.PI * 1.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3; ctx.stroke();
    // stopper
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    roundRect(ctx, cx - neckW / 2 - 2, neckTop - 8, neckW + 4, 12, 3); ctx.fill();

    // colour-state caption
    ctx.textAlign = 'center'; ctx.font = '700 11px Geist, system-ui, sans-serif';
    const frac = (s.nNO2) / Math.max(1e-9, s.nN2O4 + s.nNO2);
    const label = frac < 0.25 ? 'mostly colourless N₂O₄' : frac > 0.6 ? 'deep brown NO₂' : 'pale brown mix';
    ctx.fillStyle = hexA('#d97a44', 0.9);
    ctx.fillText(label, cx, h - 14);

    if (s.pulse > 0) s.pulse = Math.max(0, s.pulse - 0.025);
  }

  // ── DRAW: the Q-vs-Kc meter ────────────────────────────────────────────────
  function drawMeter(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.mW, h = s.mH;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.card; ctx.fillRect(0, 0, w, h);

    const padT = 26, padB = 30;
    const barX = w * 0.42, barW = Math.min(54, w * 0.22);
    const top = padT, bot = h - padB, H = bot - top;

    // log scale around Kc so Q jumps are visible both above & below
    const Kc = Math.max(1e-6, s.Kc);
    const lo = Math.log10(Kc / 30), hi = Math.log10(Kc * 30);
    const yOf = (val: number) => {
      const lv = Math.log10(Math.max(1e-9, val));
      const tt = (lv - lo) / (hi - lo);
      return bot - Math.min(1, Math.max(0, tt)) * H;
    };

    // bar track
    roundRect(ctx, barX, top, barW, H, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
    ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke();

    // shaded zones: above Kc = "shift backward", below Kc = "shift forward"
    const yK = yOf(Kc);
    ctx.fillStyle = 'rgba(248,113,113,0.10)'; ctx.fillRect(barX, top, barW, yK - top);
    ctx.fillStyle = 'rgba(52,211,153,0.10)'; ctx.fillRect(barX, yK, barW, bot - yK);

    // Kc fixed line
    ctx.strokeStyle = C.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(barX - 8, yK); ctx.lineTo(barX + barW + 8, yK); ctx.stroke();
    ctx.fillStyle = C.amberLight; ctx.font = '700 10px Geist, system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('Kᶜ', barX - 12, yK - 4);
    ctx.font = '600 9px Geist, system-ui, sans-serif';
    ctx.fillText(fmt(Kc), barX - 12, yK + 9);

    // Q moving marker
    const Q = Math.max(1e-9, s.qDisplay);
    const yQ = yOf(Q);
    const offFromK = Math.abs(Math.log10(Q) - Math.log10(Kc));
    const qCol = offFromK < 0.04 ? C.amberLight : Q > Kc ? C.red : C.emeraldLight;
    ctx.fillStyle = qCol;
    ctx.beginPath();
    ctx.moveTo(barX + barW + 8, yQ);
    ctx.lineTo(barX + barW + 18, yQ - 6);
    ctx.lineTo(barX + barW + 18, yQ + 6);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = qCol; ctx.lineWidth = 2;
    if (s.pulse > 0) { ctx.shadowBlur = 12 * s.pulse; ctx.shadowColor = qCol; }
    ctx.beginPath(); ctx.moveTo(barX - 4, yQ); ctx.lineTo(barX + barW + 8, yQ); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left'; ctx.font = '700 10px Geist, system-ui, sans-serif';
    ctx.fillStyle = qCol;
    ctx.fillText('Q', barX + barW + 22, yQ - 3);
    ctx.font = '600 9px Geist, system-ui, sans-serif';
    ctx.fillText(fmt(Q), barX + barW + 22, yQ + 9);

    // zone captions
    ctx.textAlign = 'center'; ctx.font = '700 9px Geist, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(248,113,113,0.8)';
    ctx.fillText('Q > Kᶜ', barX + barW / 2, top + 12);
    ctx.fillStyle = 'rgba(248,113,113,0.55)'; ctx.font = '600 8px Geist, system-ui, sans-serif';
    ctx.fillText('shift ←', barX + barW / 2, top + 23);
    ctx.fillStyle = 'rgba(52,211,153,0.8)'; ctx.font = '700 9px Geist, system-ui, sans-serif';
    ctx.fillText('Q < Kᶜ', barX + barW / 2, bot - 16);
    ctx.fillStyle = 'rgba(52,211,153,0.55)'; ctx.font = '600 8px Geist, system-ui, sans-serif';
    ctx.fillText('shift →', barX + barW / 2, bot - 5);

    // title
    ctx.textAlign = 'left'; ctx.fillStyle = C.text2; ctx.font = '700 10px Geist, system-ui, sans-serif';
    ctx.fillText('Q chases Kᶜ', 6, 14);
  }

  // ── animation loop + sizing ───────────────────────────────────────────────
  useEffect(() => {
    const f = flaskRef.current, m = meterRef.current;
    if (!f || !m) return;

    function size(canvas: HTMLCanvasElement, minH: number): [number, number] {
      const r = canvas.parentElement!.getBoundingClientRect();
      const W = Math.max(r.width, 200), Hh = Math.max(r.height, minH);
      canvas.width = W * 2; canvas.height = Hh * 2;
      const ctx = canvas.getContext('2d')!; ctx.setTransform(2, 0, 0, 2, 0, 0);
      return [W, Hh];
    }
    function resize() {
      const s = sim.current;
      [s.fW, s.fH] = size(f!, 300);
      [s.mW, s.mH] = size(m!, 300);
    }

    let frame = 0;
    const t = setTimeout(() => {
      resize();
      const loop = () => {
        const s = sim.current;
        // advance the shift animation (~1 s at 60fps)
        if (s.anim < 1) {
          s.anim = Math.min(1, s.anim + 0.016);
          const e = s.anim < 0.5 ? 2 * s.anim * s.anim : 1 - Math.pow(-2 * s.anim + 2, 2) / 2; // easeInOut
          s.nN2O4 = s.sN2O4 + (s.tN2O4 - s.sN2O4) * e;
          s.nNO2 = s.sNO2 + (s.tNO2 - s.sNO2) * e;
          // Q relaxes from its jumped value back to Kc as the shift completes
          const logJump = Math.log10(Math.max(1e-9, s.qJump));
          const logK = Math.log10(Math.max(1e-9, s.Kc));
          s.qDisplay = Math.pow(10, logJump + (logK - logJump) * e);
        } else {
          s.qDisplay = reactionQ(s.nN2O4, s.nNO2, s.V);
        }

        const cf = f!.getContext('2d'), cm = m!.getContext('2d');
        if (cf) drawFlask(cf);
        if (cm) drawMeter(cm);

        // push readouts to React ~6×/sec (cheap; avoids per-frame setState)
        frame++;
        if (frame % 10 === 0) {
          const dir: 'fwd' | 'back' | 'eq' =
            s.anim >= 1 ? 'eq' : s.tNO2 > s.sNO2 ? 'fwd' : s.tNO2 < s.sNO2 ? 'back' : 'eq';
          setReadout({ nN2O4: s.nN2O4, nNO2: s.nNO2, Q: s.qDisplay, Kc: s.Kc, dir });
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, 60);

    window.addEventListener('resize', resize);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = STEPS[stepIdx];
  const cN2O4 = concOf(readout.nN2O4, sim.current.V);
  const cNO2 = concOf(readout.nNO2, sim.current.V);
  const dirIcon = readout.dir === 'fwd' ? '→' : readout.dir === 'back' ? '←' : '⇌';
  const dirCol = readout.dir === 'fwd' ? C.emeraldLight : readout.dir === 'back' ? C.red : C.amberLight;
  const dirWord = readout.dir === 'fwd' ? 'forward (making NO₂)' : readout.dir === 'back' ? 'backward (making N₂O₄)' : 'at equilibrium';
  const noteCol = note.tone === 'forward' ? C.emeraldLight : note.tone === 'backward' ? C.red : C.amberLight;
  const noteBg = note.tone === 'forward' ? 'rgba(16,185,129,0.08)' : note.tone === 'backward' ? 'rgba(248,113,113,0.08)' : 'rgba(251,191,36,0.07)';
  const noteBd = note.tone === 'forward' ? 'rgba(52,211,153,0.3)' : note.tone === 'backward' ? 'rgba(248,113,113,0.3)' : 'rgba(251,191,36,0.28)';

  // small UI helpers ----------------------------------------------------------
  const PaneLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-1 h-3.5 rounded" style={{ background: accent }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.text2 }}>{children}</span>
    </div>
  );
  const Lever = ({ onClick, children, tone = 'ghost' }: { onClick: () => void; children: React.ReactNode; tone?: 'ghost' | 'fwd' | 'back' | 'flat' }) => {
    const map = {
      ghost: { bg: 'rgba(255,255,255,0.05)', col: C.text2, bd: C.border },
      fwd: { bg: 'rgba(16,185,129,0.12)', col: C.emeraldLight, bd: 'rgba(52,211,153,0.35)' },
      back: { bg: 'rgba(248,113,113,0.12)', col: C.red, bd: 'rgba(248,113,113,0.35)' },
      flat: { bg: 'rgba(99,102,241,0.12)', col: C.indigoLight, bd: 'rgba(129,140,248,0.35)' },
    }[tone];
    return (
      <button onClick={onClick}
        className="px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap"
        style={{ background: map.bg, color: map.col, border: `1px solid ${map.bd}` }}>
        {children}
      </button>
    );
  };

  return (
    <div className="w-full rounded-2xl p-4 md:p-6" style={{ background: C.bg, color: C.text }}>
      {/* header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Le Chatelier&apos;s <span style={{ color: C.indigo }}>Principle Lab</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Disturb the equilibrium — watch Q chase K<sub>c</sub> back
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          N<sub>2</sub>O<sub>4</sub> ⇌ 2 NO<sub>2</sub> &nbsp;·&nbsp; ΔH = +57.2 kJ/mol
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

      {/* ── FLASK + METER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 mb-4">
        {/* reaction flask */}
        <div>
          <PaneLabel accent={C.indigo}>Reaction Flask · brown intensity ∝ how much NO<sub>2</sub></PaneLabel>
          <div className="relative w-full" style={{ height: 300 }}>
            <canvas ref={flaskRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${C.border}` }} />
            {/* direction indicator overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(13,17,23,0.7)', border: `1px solid ${C.border}` }}>
              <span className="text-lg font-black leading-none" style={{ color: dirCol }}>{dirIcon}</span>
              <span className="text-[10px] font-bold" style={{ color: dirCol }}>{dirWord}</span>
            </div>
          </div>
        </div>

        {/* Q-vs-Kc meter */}
        <div>
          <PaneLabel accent={C.amber}>Q vs K<sub>c</sub> · the engine of every shift</PaneLabel>
          <div className="relative w-full" style={{ height: 300 }}>
            <canvas ref={meterRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${C.border}` }} />
          </div>
        </div>
      </div>

      {/* ── "what just happened" line ── */}
      <div className="mb-4 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: noteBg, border: `1px solid ${noteBd}` }}>
        <span className="text-base mt-0.5">{note.tone === 'forward' ? '→' : note.tone === 'backward' ? '←' : '⇌'}</span>
        <p className="text-sm leading-relaxed font-medium" style={{ color: noteCol }}>{note.text}</p>
      </div>

      {/* ── LIVE READOUT ── */}
      <div className="rounded-xl p-3 mb-4 grid grid-cols-3 md:grid-cols-6 gap-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {[
          { k: '[N₂O₄]', v: fmt(cN2O4), u: 'mol/L', c: C.indigoLight },
          { k: '[NO₂]', v: fmt(cNO2), u: 'mol/L', c: hexA('#d97a44', 1) },
          { k: 'Q', v: fmt(readout.Q), u: '', c: readout.Q > readout.Kc * 1.05 ? C.red : readout.Q < readout.Kc * 0.95 ? C.emeraldLight : C.amberLight },
          { k: 'Kᶜ', v: fmt(readout.Kc), u: '', c: C.amber },
          { k: 'T', v: `${Math.round(temp)}`, u: 'K', c: C.text },
          { k: 'V', v: volume.toFixed(volume < 1 ? 2 : 1), u: 'L', c: C.text },
        ].map((cell) => (
          <div key={cell.k} className="rounded-lg px-2 py-1.5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C.muted }} dangerouslySetInnerHTML={{ __html: cell.k }} />
            <div className="text-sm font-black tabular-nums leading-none" style={{ color: cell.c }}>{cell.v}</div>
            <div className="text-[9px] mt-0.5" style={{ color: C.ghost }}>{cell.u}</div>
          </div>
        ))}
      </div>

      {/* ── DISTURBANCE CONTROLS ── */}
      <div className="rounded-2xl p-4 mb-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* concentration */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Concentration</div>
            <div className="flex flex-wrap gap-1.5">
              <Lever onClick={addN2O4} tone="fwd">+ Add N<sub>2</sub>O<sub>4</sub></Lever>
              <Lever onClick={addNO2} tone="back">+ Add NO<sub>2</sub></Lever>
              <Lever onClick={removeNO2} tone="fwd">− Remove NO<sub>2</sub></Lever>
            </div>
          </div>

          {/* pressure / volume */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Volume / Pressure</div>
            <div className="flex flex-wrap gap-1.5">
              <Lever onClick={compress} tone="back">Compress (halve V)</Lever>
              <Lever onClick={expand} tone="fwd">Expand (double V)</Lever>
            </div>
          </div>

          {/* temperature */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2 flex justify-between" style={{ color: C.muted }}>
              <span>Temperature</span>
              <span className="tabular-nums" style={{ color: C.indigoLight }}>{Math.round(temp)} K</span>
            </div>
            <input type="range" min={T_MIN} max={T_MAX} step={1} value={temp}
              onChange={(e) => onTemp(parseInt(e.target.value, 10))}
              className="w-full" style={{ accentColor: C.indigo }} />
            <p className="text-[10px] leading-snug mt-1" style={{ color: C.muted }}>
              Endothermic forward → heating raises <span style={{ color: C.amberLight }}>K<sub>c</sub></span> and browns it up.
            </p>
          </div>

          {/* inert gas + catalyst */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Inert Gas &amp; Catalyst</div>
            <div className="flex flex-wrap gap-1.5">
              <Lever onClick={argonConstV} tone="flat">Add Ar (const V)</Lever>
              <Lever onClick={argonConstP} tone="fwd">Add Ar (const P)</Lever>
              <Lever onClick={addCatalyst} tone="flat">Add catalyst</Lever>
            </div>
            <p className="text-[10px] leading-snug mt-1.5" style={{ color: C.muted }}>
              <span style={{ color: C.indigoLight }}>Const V</span> = no shift (the trap); <span style={{ color: C.emeraldLight }}>const P</span> = expansion.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={resetLab}
            className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: C.text2, border: `1px solid ${C.border}` }}>
            ⟲ Reset lab
          </button>
        </div>
      </div>

      {/* ── PAYOFF ── */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          Every shift you triggered was the same story: a disturbance knocked <strong style={{ color: C.text }}>Q</strong> away from{' '}
          <strong style={{ color: C.amberLight }}>K<sub>c</sub></strong>, and the system moved until <strong style={{ color: C.text }}>Q = K<sub>c</sub></strong> again. Concentration, volume and pressure only move <strong style={{ color: C.text }}>Q</strong> — they never change <strong style={{ color: C.amberLight }}>K<sub>c</sub></strong>. Only <strong style={{ color: C.text }}>temperature</strong> changes K<sub>c</sub> itself. And the two traps — <strong style={{ color: C.indigoLight }}>inert gas at constant volume</strong> and a <strong style={{ color: C.indigoLight }}>catalyst</strong> — leave Q and K<sub>c</sub> both untouched, so the equilibrium does not move at all.
        </p>
      </div>
    </div>
  );
}

// ── canvas helpers ────────────────────────────────────────────────────────────
// hex + alpha → rgba() string (alpha 0..1)
function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// drifting gas-molecule specks inside the bulb (deterministic pseudo-random)
function drawSpecks(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, neckBot: number,
  count: number, t: number, speed: number, color: string, seed: number,
) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const a = (i * 2.399963 + seed) % (Math.PI * 2);  // golden-angle scatter
    const rad = (0.2 + ((i * 7 + seed) % 70) / 100) * r * 0.92;
    const drift = Math.sin(t * speed + i * 1.7) * 4;
    const x = cx + Math.cos(a + t * 0.15 * speed) * rad;
    const y = Math.max(neckBot + 6, cy + Math.sin(a) * rad * 0.85 + drift);
    const sz = 1.4 + ((i + seed) % 3) * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fill();
  }
}
