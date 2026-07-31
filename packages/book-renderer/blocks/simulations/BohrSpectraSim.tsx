'use client';

// ──────────────────────────────────────────────────────────────────────────
// Bohr Model → Hydrogen Spectrum
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · JEE / NEET
//
// ── DESIGN HISTORY (read before "improving" this again) ───────────────────
// v1  3-across grid (atom | energy ladder | spectrum). Rejected: every pane
//     was a third of the width, so orbit labels collided and the spectrum was
//     unreadable.
// v2  2-across + full-width spectrum, honest linear-in-E energy ladder with
//     leader-lined labels. Rejected: the ladder is unusable BY NATURE — since
//     Eₙ ∝ −1/n², rungs n≥4 pile into a few pixels against E=0. Leader lines
//     made it legible but not USEFUL; it read as decoration.
// v3  (this file) The ladder is replaced by a JUMP-ENERGY CHART: one row per
//     transition into the selected landing level, bar length = ΔE as a share
//     of the series limit, bar colour = the real photon colour. Rows are
//     evenly spaced, so nothing crowds; the convergence students must see
//     (bars bunching against the 100% ceiling) becomes the *point* of the
//     chart rather than a rendering problem. Every row is clickable — it is
//     the jump selector, not a read-only graph.
//
// LAYOUT — everything is full width, stacked in reading order:
//   ┌── THE ATOM ─────────────────────────────────────────────────────────┐
//   │ emission/absorption + wave toggles live INSIDE the box, next to what │
//   │ they control; a live caption NAMES the series on every transition    │
//   └──────────────────────────────────────────────────────────────────────┘
//   ┌── ENERGY OF EACH JUMP — series pills + one clickable bar per jump ───┐
//   ┌── THE SPECTRUM ─────────────────────────────────────────────────────┐
//   ┌── THIS LINE: series + the Rydberg calculation ──────────────────────┐
//
// Colour follows the two-colour rule (SIMULATION_DESIGN_WORKFLOW §3): ACCENT
// violet primary, ACCENT_2 sky for the wave/secondary axis. The only other
// colours are the wavelength-accurate spectral colours (physics, not
// decoration), marked `sim-lint-ok` at the usage site.
//
// ACADEMIC SOURCES (anti-hallucination gate, workflow §7) — standard NCERT
// Class 11 Ch.2 / JEE data, NOT generated from training knowledge:
//   • Energy of level n (hydrogen-like):  Eₙ = −13.6 · Z² / n²   eV
//   • Bohr radius:                         rₙ = 0.529 · n² / Z    Å
//   • Rydberg:  1/λ = R_H · Z² · (1/n₁² − 1/n₂²),
//               R_H = 1.097×10⁷ m⁻¹ = 0.01097 nm⁻¹
//   • Angular-momentum quantisation: m v r = n·h/2π ⇒ 2π rₙ = n·λ_deBroglie
//   • Series (n_final): Lyman→1 (UV), Balmer→2 (visible), Paschen→3 (IR),
//     Brackett→4, Pfund→5
//   • Balmer visible lines: Hα 656.3, Hβ 486.1, Hγ 434.0, Hδ 410.2 nm
//   • Series limits (n₂→∞): Lyman 91.2 nm, Balmer 364.6 nm
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  SimShell, SimHeader, StepBar, ExpertTip,
  ACCENT, ACCENT_2, TEXT, BORDER, TYPE, accentTint, Frac, prettyExp,
} from './_shared';
import type { StepDef as BarStep } from './_shared';

// ── physics constants ───────────────────────────────────────────────────────
const RH = 0.01097;    // Rydberg constant, nm⁻¹
const E_RYD = 13.6;    // eV — |E₁| for hydrogen
const NMAX = 6;        // highest orbit drawn in the atom pane
const ROWS = 5;        // transitions listed in the jump chart (+ the limit row)
const SPEC_MIN = 80;   // nm — left edge of the (log) spectrum axis
const SPEC_MAX = 8000; // nm — right edge (covers Lyman → Pfund)

const energyEv = (n: number, Z: number) => -E_RYD * Z * Z / (n * n);
const wavelengthNm = (nLow: number, nHigh: number, Z: number) =>
  1 / (RH * Z * Z * (1 / (nLow * nLow) - 1 / (nHigh * nHigh)));
const seriesLimitNm = (nLow: number, Z: number) => 1 / (RH * Z * Z * (1 / (nLow * nLow)));
const photonEv = (nLow: number, nHigh: number, Z: number) =>
  energyEv(nHigh, Z) - energyEv(nLow, Z); // > 0

// log-scale x mapping for the spectrum axis. The axis bounds are FIXED (the
// UV / visible / IR bands are physical and must not slide with Z), so a line
// outside them is skipped rather than clamped onto the edge — stacking
// off-scale lines on the border would read as a real pile-up.
const L_MIN = Math.log10(SPEC_MIN);
const L_MAX = Math.log10(SPEC_MAX);
const onScale = (wl: number) => wl >= SPEC_MIN && wl <= SPEC_MAX;
const specX = (wl: number, w: number, pad: number) => {
  const clamped = Math.min(Math.max(wl, SPEC_MIN), SPEC_MAX);
  return pad + ((Math.log10(clamped) - L_MIN) / (L_MAX - L_MIN)) * (w - pad * 2);
};

// wavelength → RGB. These are PHYSICS colours (656 nm really is red), not
// decoration, so the two-colour accent rule does not apply here.
function photonColor(wl: number): string {
  if (Math.abs(wl - 656.3) < 4) return '#ff5b6e'; // sim-lint-ok — Hα, real colour
  if (Math.abs(wl - 486.1) < 4) return '#3bc9db'; // sim-lint-ok — Hβ, real colour
  if (Math.abs(wl - 434.0) < 4) return '#5c8dff'; // sim-lint-ok — Hγ, real colour
  if (Math.abs(wl - 410.2) < 4) return '#b46cff'; // sim-lint-ok — Hδ, real colour
  if (wl < 380) return '#b191ff';                 // sim-lint-ok — UV stand-in
  if (wl > 700) return '#ff7a7a';                 // sim-lint-ok — IR stand-in
  const t = (700 - wl) / 320;
  return `hsl(${Math.round(t * 280)}, 85%, 66%)`;
}

const regionOf = (wl: number) =>
  wl < 380 ? { label: 'Ultraviolet', short: 'UV', visible: false }
    : wl > 700 ? { label: 'Infrared', short: 'IR', visible: false }
      : { label: 'Visible', short: 'visible', visible: true };

// ── series metadata (n_final defines the series) ────────────────────────────
const SERIES: { nFinal: number; name: string; region: string }[] = [
  { nFinal: 1, name: 'Lyman', region: 'Ultraviolet' },
  { nFinal: 2, name: 'Balmer', region: 'Visible' },
  { nFinal: 3, name: 'Paschen', region: 'Infrared' },
  { nFinal: 4, name: 'Brackett', region: 'Infrared' },
  { nFinal: 5, name: 'Pfund', region: 'Far infrared' },
];
const seriesOf = (nFinal: number) => SERIES.find((s) => s.nFinal === nFinal)!;

// ── guided narrative beats ──────────────────────────────────────────────────
type Beat = BarStep & {
  title: string;
  body: string;
  enter: Partial<{ mode: 'emission' | 'absorption'; deBroglie: boolean; nFinal: number; nInitial: number }>;
};
const BEATS: Beat[] = [
  {
    id: 'problem', label: 'The Problem',
    title: 'Why the classical atom should collapse',
    body: "Rutherford's electron orbits the nucleus like a planet. But a circling charge is accelerating, and accelerating charges radiate energy — so it should spiral into the nucleus in about 10⁻⁸ s. Matter would not exist. Something is wrong with classical physics here.",
    enter: { mode: 'emission', deBroglie: false },
  },
  {
    id: 'fix', label: "Bohr's Fix",
    title: 'Only whole standing waves survive',
    body: 'Bohr allowed only special orbits where the electron neither spirals nor radiates. de Broglie showed why: an orbit is allowed only if a whole number of electron waves fits exactly around it (2πr = n λ). A non-whole number interferes with itself and cancels.',
    enter: { deBroglie: true, mode: 'emission' },
  },
  {
    id: 'jump', label: 'The Jump',
    title: 'A jump emits one photon',
    body: 'The electron drops from a higher orbit to a lower one, and the energy it loses, ΔE, leaves as a single photon. Click any orbit inside the electron — or any bar below — and the photon, the series name and the spectral line all appear together.',
    enter: { mode: 'emission', deBroglie: false, nFinal: 2, nInitial: 4 },
  },
  {
    id: 'series', label: 'A Whole Series',
    title: 'A series crowds toward its limit',
    body: 'Fix the landing level and every possible drop into it forms one series. Look at the bars: each higher starting level adds less and less extra energy, so they bunch up against the series limit — the energy that would rip the electron off that level entirely.',
    enter: { mode: 'emission', deBroglie: false, nFinal: 2, nInitial: 6 },
  },
  {
    id: 'mirror', label: 'Absorption',
    title: 'Absorption is the mirror image',
    body: 'Send white light through cold hydrogen and the atom absorbs exactly the photons it would emit — so a dark line appears at the identical wavelength. Emission and absorption are perfect complements.',
    enter: { mode: 'absorption', deBroglie: false, nFinal: 2, nInitial: 4 },
  },
];

// Canvas needs literal colour strings, and larger sizes than the HTML scale —
// the founder's readability floor for in-canvas text is 13px (2026-07-27).
const CV = {
  faint: 'rgba(255,255,255,0.14)',
  line: 'rgba(255,255,255,0.24)',
  dim: 'rgba(255,255,255,0.5)',
  text: TEXT.primary,
  ghost: TEXT.ghost,
};
const FONT = (px: number, weight = 600) => `${weight} ${px}px system-ui, sans-serif`;

// Atom-pane geometry. Shared by the renderer AND the hit-test so a layout
// tweak can never desync what is drawn from what is clickable.
const atomGeom = (w: number, h: number) => ({
  cx: w / 2,
  cy: h * 0.47,
  maxR: Math.min(w * 0.34, h * 0.40),
});

/*
 * Orbit radius on screen.
 *
 * Drawing the orbits at their TRUE r ∝ n² is unworkable as the everyday view:
 * n=1 lands at 1/36 of the outer radius — a ~6px circle swallowed by the
 * nucleus — and n=1,2,3 sit within ~50px of each other, so no label can sit on
 * its own ring. The previous fix (push the labels outward on leader lines)
 * traded one problem for a worse one: the "n=3" text ended up floating where
 * n=4/n=5 actually are, so the numbers no longer matched the rings.
 *
 * So the default view spaces the orbits EVENLY, which is what every textbook
 * Bohr diagram does, and the n² fact is carried honestly by (a) the real Bohr
 * radius printed on every label — 0.53, 2.12, 4.76, 8.46, 13.2, 19.0 Å, whose
 * quadratic growth is right there in the numbers — and (b) a "true n² scale"
 * toggle that morphs the rings to their real radii on demand. Opt-in, so the
 * distortion is shown rather than hidden.
 */
const orbitR = (n: number, maxR: number, trueScale: boolean) =>
  trueScale
    ? ((n * n) / (NMAX * NMAX)) * maxR
    : (0.22 + 0.78 * ((n - 1) / (NMAX - 1))) * maxR;

// real Bohr radius, Å — rₙ = 0.529 n² / Z
const bohrA = (n: number, Z: number) => 0.529 * n * n / Z;

export default function BohrSpectraSim() {
  const atomRef = useRef<HTMLCanvasElement>(null);
  const specRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [beatIdx, setBeatIdx] = useState(0);
  const [mode, setMode] = useState<'emission' | 'absorption'>('emission');
  const [Z, setZ] = useState(1);
  const [nFinal, setNFinal] = useState(2);
  const [nInitial, setNInitial] = useState(5);   // electron rests on n=5 by default
  const [deBroglie, setDeBroglie] = useState(false);
  const [trueScale, setTrueScale] = useState(false);

  // mutable animation state — the rAF loop never reads React state
  const sim = useRef({
    mode: 'emission' as 'emission' | 'absorption',
    Z: 1, beat: 0, nFinal: 2, nInitial: 5, deBroglie: false, trueScale: false,
    elecN: 5, targetN: 5, hoveredN: -1, animating: false, angle: 0, flash: 0,
    tr: null as null | { nLow: number; nHigh: number; color: string; ev: number; wl: number; series: string; isAbsorption: boolean },
    photons: [] as Array<{ x: number; y: number; vx: number; color: string; type: 'emission' | 'absorption'; wl: number; targetN: number }>,
    burnt: [] as Array<{ wl: number; color: string; type: 'emission' | 'absorption' }>,
    aW: 0, aH: 0, sW: 0, sH: 0,
  });

  useEffect(() => { sim.current.mode = mode; }, [mode]);
  useEffect(() => { sim.current.Z = Z; }, [Z]);
  useEffect(() => { sim.current.deBroglie = deBroglie; }, [deBroglie]);
  useEffect(() => { sim.current.trueScale = trueScale; }, [trueScale]);
  useEffect(() => { sim.current.nFinal = nFinal; }, [nFinal]);
  useEffect(() => { sim.current.nInitial = nInitial; }, [nInitial]);
  useEffect(() => { sim.current.beat = beatIdx; }, [beatIdx]);

  // Park the electron on a resting orbit and clear any in-flight transition.
  //
  // This used to be an effect on [mode, nFinal, nInitial] — which was the cause
  // of "sometimes the electron jumps, sometimes it doesn't". Clicking an orbit
  // (or a bar) calls setNInitial/setNFinal AND fire() in the same handler; the
  // effect then ran AFTER the state commit and immediately reset elecN,
  // animating and tr — cancelling the jump that had just started, but only when
  // the selection actually changed. Parking is now explicit: it happens on a
  // mode switch, a series switch or a beat switch, and never after a fire.
  const park = useCallback((n: number) => {
    const s = sim.current;
    s.elecN = n; s.targetN = n; s.animating = false; s.tr = null; s.photons = [];
  }, []);

  useEffect(() => {
    const s = sim.current;
    park(mode === 'emission' ? s.nInitial : s.nFinal);
  }, [mode, park]);

  const goBeat = useCallback((idx: number) => {
    const b = BEATS[idx];
    setBeatIdx(idx);
    if (b.enter.mode) setMode(b.enter.mode);
    if (b.enter.deBroglie !== undefined) setDeBroglie(b.enter.deBroglie);
    if (b.enter.nFinal !== undefined) setNFinal(b.enter.nFinal);
    if (b.enter.nInitial !== undefined) setNInitial(b.enter.nInitial);
    const m = b.enter.mode ?? sim.current.mode;
    const ni = b.enter.nInitial ?? sim.current.nInitial;
    const nf = b.enter.nFinal ?? sim.current.nFinal;
    sim.current.burnt = [];
    park(m === 'emission' ? ni : nf);
  }, [park]);

  // Switching series moves the landing level, so the electron re-parks.
  const pickSeries = useCallback((nf: number) => {
    const s = sim.current;
    const ni = s.nInitial <= nf ? nf + 1 : s.nInitial;
    setNFinal(nf); setNInitial(ni);
    park(s.mode === 'emission' ? ni : nf);
  }, [park]);

  const fire = useCallback((nLow: number, nHigh: number) => {
    const s = sim.current;
    if (s.animating || nLow >= nHigh) return;
    const wl = wavelengthNm(nLow, nHigh, s.Z);
    const color = photonColor(wl);
    s.flash = 1;
    s.tr = {
      nLow, nHigh, color, wl, ev: photonEv(nLow, nHigh, s.Z),
      series: seriesOf(nLow)?.name ?? '', isAbsorption: s.mode === 'absorption',
    };

    if (s.mode === 'emission') {
      s.elecN = nHigh; s.targetN = nLow; s.animating = true;
      setTimeout(() => {
        s.photons.push({ type: 'emission', x: s.aW * 0.5, y: s.aH * 0.47, vx: 6, color, wl, targetN: nLow });
      }, 260);
    } else {
      s.elecN = nLow; s.targetN = nLow;
      s.photons.push({ type: 'absorption', x: -10, y: s.aH * 0.47, vx: 6, color, wl, targetN: nHigh });
    }
  }, []);

  // ── DRAW: the atom ────────────────────────────────────────────────────────
  function drawAtom(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.aW, h = s.aH;
    const { cx, cy, maxR } = atomGeom(w, h);
    ctx.clearRect(0, 0, w, h);

    const rOf = (n: number) => orbitR(n, maxR, s.trueScale);
    const cur = Math.round(s.elecN);

    // ── background: layered glow, then a vignette so the edges fall away ────
    ctx.fillStyle = '#07080d'; ctx.fillRect(0, 0, w, h);
    const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.5);
    aura.addColorStop(0, accentTint(ACCENT, 0.26));
    aura.addColorStop(0.28, accentTint(ACCENT, 0.10));
    aura.addColorStop(0.65, accentTint(ACCENT, 0.03));
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura; ctx.fillRect(0, 0, w, h);
    const gx = cx - maxR * 0.55, gy = cy + maxR * 0.6;
    const cool = ctx.createRadialGradient(gx, gy, 0, gx, gy, maxR * 1.05);
    cool.addColorStop(0, accentTint(ACCENT_2, 0.13));
    cool.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cool; ctx.fillRect(0, 0, w, h);
    const vig = ctx.createRadialGradient(cx, cy, maxR * 0.95, cx, cy, Math.max(w, h) * 0.78);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);

    // ── orbits ──────────────────────────────────────────────────────────────
    for (let n = 1; n <= NMAX; n++) {
      const isFloor = n === s.nFinal, isHere = n === cur;
      ctx.beginPath(); ctx.arc(cx, cy, rOf(n), 0, Math.PI * 2);
      if (isHere) { ctx.setLineDash([]); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.8; }
      else if (isFloor) { ctx.setLineDash([5, 5]); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.6; }
      else { ctx.setLineDash([3, 7]); ctx.strokeStyle = CV.line; ctx.lineWidth = 1; }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // ── orbit labels ────────────────────────────────────────────────────────
    // In the default (evenly spaced) view every ring is ~32px from its
    // neighbour, so each label sits ON its own ring — no leader lines, no
    // ambiguity about which number belongs to which circle. The min-gap push
    // + leader only kicks in under "true n² scale", where the inner rings
    // genuinely overlap and the student has asked to see that.
    const TH = (-52 * Math.PI) / 180;
    const cosT = Math.cos(TH), sinT = Math.sin(TH);
    let prevLabelR = 0;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    for (let n = 1; n <= NMAX; n++) {
      const r = rOf(n);
      const lr = Math.max(r, prevLabelR + 27);
      prevLabelR = lr;
      const ax = cx + cosT * lr, ay = cy + sinT * lr;
      if (lr - r > 3) {
        ctx.beginPath();
        ctx.moveTo(cx + cosT * r, cy + sinT * r);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = CV.line; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = CV.line;
        ctx.beginPath(); ctx.arc(cx + cosT * r, cy + sinT * r, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      const isHere = n === cur, isFloor = n === s.nFinal;
      const active = isHere || isFloor || n === s.hoveredN;
      let x = ax + 8;

      // n = N
      ctx.fillStyle = isHere ? '#ffffff' : active ? ACCENT : CV.dim;
      ctx.font = FONT(active ? 17 : 15, active ? 800 : 600);
      ctx.fillText(`n=${n}`, x, ay);
      x += ctx.measureText(`n=${n}`).width + 9;

      // the REAL radius — this is where r ∝ n² stays visible even when the
      // circles are drawn evenly (0.53 → 2.12 → 4.76 → 8.46 → 13.2 → 19.0 Å)
      const rA = bohrA(n, s.Z);
      const rTxt = `${rA < 10 ? rA.toFixed(2) : rA.toFixed(1)} Å`;
      ctx.fillStyle = CV.ghost; ctx.font = FONT(13, 500);
      ctx.fillText(rTxt, x, ay);
      x += ctx.measureText(rTxt).width + 10;

      // say which ring is which — the solid ring and the dashed ring were
      // both "highlighted" with nothing telling them apart
      if (isHere) {
        ctx.fillStyle = '#ffffff'; ctx.font = FONT(13, 700);
        ctx.fillText('electron is here', x, ay);
      } else if (isFloor) {
        ctx.fillStyle = ACCENT; ctx.font = FONT(13, 700);
        ctx.fillText('lands here', x, ay);
      }
    }

    // NOTE: the "classical spiral" ghost path used to be drawn here on beat 0.
    // Removed 2026-07-27 — it cut across the inner orbits and made n=1..3
    // impossible to pick out. The narration already makes the point in words.

    // ── nucleus: bloom + core (small on purpose — it really is ~10⁻⁵ of the atom)
    // Sized against the n=1 ring so the innermost orbit is always a clearly
    // separate circle. Previously the bloom (34px) reached past r₁ and the
    // electron looked like it was orbiting *inside* the nucleus.
    const flash = s.flash;
    const coreR = Math.max(4, Math.min(8, rOf(1) * 0.16));
    const bloomR = Math.min(rOf(1) * 0.55, 24) + flash * 8;
    const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
    bloom.addColorStop(0, accentTint(ACCENT, 0.55 + flash * 0.3));
    bloom.addColorStop(0.4, accentTint(ACCENT, 0.16));
    bloom.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bloom; ctx.beginPath(); ctx.arc(cx, cy, bloomR, 0, Math.PI * 2); ctx.fill();
    const core = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, coreR);
    core.addColorStop(0, '#ffffff');
    core.addColorStop(0.55, ACCENT);
    core.addColorStop(1, accentTint(ACCENT, 0.25));
    ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill();

    // hover preview
    if (s.hoveredN !== -1 && !s.animating) {
      ctx.beginPath(); ctx.arc(cx, cy, rOf(s.hoveredN), 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 3;
      ctx.shadowBlur = 12; ctx.shadowColor = accentTint(ACCENT, 0.8);
      ctx.stroke(); ctx.shadowBlur = 0;
    }

    // ── electron motion ─────────────────────────────────────────────────────
    s.angle += 0.02 / Math.max(1, s.elecN);
    if (s.animating) {
      if (Math.abs(s.elecN - s.targetN) < 0.04) { s.elecN = s.targetN; s.animating = false; }
      else s.elecN += (s.targetN - s.elecN) * 0.12;
    }
    const rNow = rOf(s.elecN);

    // de Broglie standing wave (n whole wavelengths around the orbit)
    if (s.deBroglie) {
      const nWhole = Math.round(s.elecN);
      const amp = Math.min(12, rNow * 0.18);
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.04) {
        const rr = rNow + Math.sin(nWhole * a) * amp;
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = ACCENT_2; ctx.lineWidth = 1.8;
      ctx.shadowBlur = 10; ctx.shadowColor = accentTint(ACCENT_2, 0.7);
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = ACCENT_2; ctx.font = FONT(14, 700); ctx.textAlign = 'center';
      ctx.fillText(`2πr = ${nWhole} λ`, cx, cy + rNow + amp + 20);
    }

    // electron (comet trail, then the ball)
    for (let k = 6; k >= 1; k--) {
      const a = s.angle - k * 0.05;
      ctx.globalAlpha = 0.05 * (7 - k);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rNow, cy + Math.sin(a) * rNow, 2.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const ex = cx + Math.cos(s.angle) * rNow, ey = cy + Math.sin(s.angle) * rNow;
    ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(255,255,255,0.8)';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // ── photons ─────────────────────────────────────────────────────────────
    for (let i = s.photons.length - 1; i >= 0; i--) {
      const p = s.photons[i];
      p.x += p.vx;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      for (let j = 0; j < 18; j++) {
        const px = p.x - j * 3 * Math.sign(p.vx);
        ctx.lineTo(px, p.y + Math.sin(px * 0.25) * 6);
      }
      ctx.strokeStyle = p.color; ctx.lineWidth = 2.4;
      ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.stroke(); ctx.shadowBlur = 0;

      if (p.type === 'emission' && p.x > w) {
        s.photons.splice(i, 1);
        if (!s.burnt.some((b) => Math.abs(b.wl - p.wl) < 0.5)) s.burnt.push({ wl: p.wl, color: p.color, type: 'emission' });
      } else if (p.type === 'absorption' && p.x >= cx - rOf(Math.round(s.elecN))) {
        s.photons.splice(i, 1);
        s.targetN = p.targetN; s.animating = true;
        if (!s.burnt.some((b) => Math.abs(b.wl - p.wl) < 0.5)) s.burnt.push({ wl: p.wl, color: p.color, type: 'absorption' });
      }
    }
    if (s.flash > 0) s.flash = Math.max(0, s.flash - 0.02);

    // ── live caption: every transition NAMES its spectral series ────────────
    const tr = s.tr;
    ctx.textBaseline = 'middle';
    const capY = h - 24;
    if (tr) {
      const head = `n=${tr.nHigh} → n=${tr.nLow}`;
      const tail = `  ${tr.series} series · ${tr.isAbsorption ? 'absorbs' : 'emits'} ${tr.wl.toFixed(1)} nm`;
      ctx.font = FONT(18, 800);
      const hw = ctx.measureText(head).width;
      ctx.font = FONT(16, 600);
      const tw = ctx.measureText(tail).width;
      const startX = Math.max(12, (w - (hw + tw + 22)) / 2);
      ctx.textAlign = 'left';
      ctx.fillStyle = tr.color;
      ctx.fillRect(startX, capY - 7, 14, 14);
      ctx.font = FONT(18, 800); ctx.fillStyle = CV.text;
      ctx.fillText(head, startX + 22, capY);
      ctx.font = FONT(16, 600); ctx.fillStyle = tr.color;
      ctx.fillText(tail, startX + 22 + hw, capY);
    } else {
      ctx.font = FONT(15, 600); ctx.fillStyle = CV.ghost; ctx.textAlign = 'center';
      ctx.fillText(
        s.mode === 'emission'
          ? 'Click any orbit inside the electron to make it drop'
          : 'Click any orbit outside the electron to absorb a photon',
        cx, capY
      );
    }
  }

  // ── DRAW: the spectrum (full width) ───────────────────────────────────────
  function drawSpectrum(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.sW, h = s.sH;
    ctx.clearRect(0, 0, w, h);
    const pad = 32, stripTop = 32, stripH = h - stripTop - 36;
    const absorption = s.mode === 'absorption';

    ctx.fillStyle = '#07080d'; ctx.fillRect(0, 0, w, h);
    if (absorption) {
      const g = ctx.createLinearGradient(pad, 0, w - pad, 0);
      // sim-lint-ok — a real continuous white-light spectrum, physics not chrome
      g.addColorStop(0, '#b46cff'); g.addColorStop(0.35, '#5c8dff');
      g.addColorStop(0.5, '#3bc9db'); g.addColorStop(0.7, '#fcd34d'); g.addColorStop(1, '#ff5b6e');
      ctx.fillStyle = g; ctx.fillRect(pad, stripTop, w - pad * 2, stripH);
    } else {
      ctx.fillStyle = '#04050a'; ctx.fillRect(pad, stripTop, w - pad * 2, stripH);
    }

    // band markers
    const vx1 = specX(380, w, pad), vx2 = specX(700, w, pad);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = absorption ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.55)';
    ctx.font = FONT(13, 700); ctx.textAlign = 'center';
    ctx.fillText('VISIBLE', (vx1 + vx2) / 2, stripTop - 11);
    if (!absorption) {
      ctx.strokeStyle = 'rgba(255,255,255,0.13)'; ctx.lineWidth = 1;
      ctx.strokeRect(vx1, stripTop, vx2 - vx1, stripH);
    }
    ctx.textAlign = 'left'; ctx.fillText('◀ ULTRAVIOLET', pad, stripTop - 11);
    ctx.textAlign = 'right'; ctx.fillText('INFRARED ▶', w - pad, stripTop - 11);

    // wavelength ticks (log scale). The 6000 tick is deliberately absent — it
    // landed on top of the "λ (nm)" axis title at every realistic width.
    ctx.font = FONT(13, 500); ctx.textAlign = 'center';
    [100, 200, 400, 700, 1500, 3000].forEach((tick) => {
      const x = specX(tick, w, pad);
      ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(x, stripTop + stripH, 1, 5);
      ctx.fillStyle = CV.ghost; ctx.fillText(`${tick}`, x, stripTop + stripH + 23);
    });
    ctx.textAlign = 'right'; ctx.fillStyle = CV.ghost;
    ctx.fillText('λ (nm)', w - pad, stripTop + stripH + 23);

    // the whole series, faint, so the crowding toward the limit is visible
    for (let nHi = s.nFinal + 1; nHi <= 16; nHi++) {
      const swl = wavelengthNm(s.nFinal, nHi, s.Z);
      if (!onScale(swl)) continue;
      const x = specX(swl, w, pad);
      ctx.strokeStyle = absorption ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.26)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, stripTop); ctx.lineTo(x, stripTop + stripH); ctx.stroke();
    }

    // series limit (n→∞) = ionisation from nFinal
    const limitWl = seriesLimitNm(s.nFinal, s.Z);
    if (onScale(limitWl)) {
      const lx = specX(limitWl, w, pad);
      ctx.strokeStyle = ACCENT; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(lx, stripTop - 5); ctx.lineTo(lx, stripTop + stripH + 5); ctx.stroke();
      ctx.setLineDash([]);
      // The label sits ON the strip, which is a bright rainbow in absorption
      // mode — violet text on that was unreadable. Give it its own dark plate.
      const txt = 'series limit';
      ctx.font = FONT(13, 700);
      const tw = ctx.measureText(txt).width;
      const flip = lx + tw + 20 > w - pad;
      const bx = flip ? lx - tw - 16 : lx + 6;
      ctx.fillStyle = 'rgba(6,7,12,0.9)';
      ctx.fillRect(bx, stripTop + 6, tw + 12, 22);
      ctx.fillStyle = ACCENT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(txt, bx + 6, stripTop + 17);
      ctx.textBaseline = 'alphabetic';
    }

    // lines the student has actually fired
    s.burnt.forEach((b) => {
      if (!onScale(b.wl)) return;
      const x = specX(b.wl, w, pad);
      if (b.type === 'absorption') {
        ctx.fillStyle = 'rgba(4,5,10,0.95)';
        ctx.fillRect(x - 1.5, stripTop, 3, stripH);
      } else {
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 12; ctx.shadowColor = b.color;
        ctx.fillRect(x - 1.5, stripTop, 3, stripH);
        ctx.shadowBlur = 0;
      }
    });
  }

  // ── animation loop + sizing ───────────────────────────────────────────────
  useEffect(() => {
    const a = atomRef.current, sp = specRef.current;
    if (!a || !sp) return;

    const size = (canvas: HTMLCanvasElement, minH: number): [number, number] => {
      const r = canvas.parentElement!.getBoundingClientRect();
      const W = Math.max(r.width, 240), Hh = Math.max(r.height, minH);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = Hh * dpr;
      const ctx = canvas.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return [W, Hh];
    };
    const resize = () => {
      const s = sim.current;
      [s.aW, s.aH] = size(a, 520);
      [s.sW, s.sH] = size(sp, 160);
    };

    const t = setTimeout(() => {
      resize();
      const loop = () => {
        const ca = a.getContext('2d'), cs = sp.getContext('2d');
        if (ca) drawAtom(ca);
        if (cs) drawSpectrum(cs);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, 60);

    window.addEventListener('resize', resize);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── atom-pane interaction ─────────────────────────────────────────────────
  // Hit-testing: pick the NEAREST orbit the current mode allows, rather than
  // the first ring within a fixed tolerance. The old version walked n=1→6 and
  // `break`ed on the first ring within 16px even when that ring was an illegal
  // target — so with r ∝ n² (n=1,2,3 only ~20px apart) the inner rings ate
  // every hover and nothing got selected. Nearest-valid-wins is predictable:
  // the ring you are closest to is the one that lights up.
  function pickOrbit(x: number, y: number): number {
    const s = sim.current;
    const { cx, cy, maxR } = atomGeom(s.aW, s.aH);
    const dist = Math.hypot(x - cx, y - cy);
    const cur = Math.round(s.elecN);
    let best = -1, bestGap = Infinity;
    for (let n = 1; n <= NMAX; n++) {
      const legal = s.mode === 'emission' ? n < cur : n > cur;
      if (!legal) continue;
      const gap = Math.abs(dist - orbitR(n, maxR, s.trueScale));
      if (gap < bestGap) { bestGap = gap; best = n; }
    }
    return bestGap <= 30 ? best : -1;
  }

  function atomMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const s = sim.current;
    if (s.animating) { s.hoveredN = -1; return; }
    const rect = atomRef.current!.getBoundingClientRect();
    s.hoveredN = pickOrbit(e.clientX - rect.left, e.clientY - rect.top);
  }
  function atomClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const s = sim.current;
    if (s.animating) return;
    const rect = atomRef.current!.getBoundingClientRect();
    const n = pickOrbit(e.clientX - rect.left, e.clientY - rect.top);
    if (n === -1) return;
    const cur = Math.round(s.elecN);
    s.hoveredN = -1;
    const nLow = Math.min(n, cur), nHigh = Math.max(n, cur);
    setNFinal(nLow); setNInitial(nHigh);
    fire(nLow, nHigh);
  }

  // ── live values for the current selection ─────────────────────────────────
  const beat = BEATS[beatIdx];
  const ser = seriesOf(nFinal);
  const wl = wavelengthNm(nFinal, nInitial, Z);
  const dE = photonEv(nFinal, nInitial, Z);
  const thz = 299792.458 / wl;
  const col = photonColor(wl);
  const reg = regionOf(wl);
  const invLambda = RH * Z * Z * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial));
  const bracket = 1 / (nFinal * nFinal) - 1 / (nInitial * nInitial);
  const limitEv = Math.abs(energyEv(nFinal, Z));       // ΔE of the series limit
  const ZLABELS = ['H', 'He⁺', 'Li²⁺', 'Be³⁺'];

  // one row per transition into the landing level; the limit is the ceiling
  const jumps = Array.from({ length: ROWS }, (_, i) => nFinal + 1 + i).map((nHi) => {
    const jwl = wavelengthNm(nFinal, nHi, Z);
    return { nHi, wl: jwl, ev: photonEv(nFinal, nHi, Z), color: photonColor(jwl), region: regionOf(jwl) };
  });

  const pill = (on: boolean) => ({
    background: on ? accentTint(ACCENT, 0.18) : 'rgba(255,255,255,0.05)',
    border: `1px solid ${on ? accentTint(ACCENT, 0.5) : BORDER.card}`,
    color: on ? ACCENT : TEXT.secondary,
  });

  // Pane headings sit at text-base, not the 10px uppercase SectionLabel — the
  // founder's readability call (2026-07-27): micro-caps labels were too small
  // to read comfortably on a large screen.
  const PaneTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
    <div className="mb-3">
      <div className="text-base font-bold" style={{ color: TEXT.primary }}>{children}</div>
      {sub && <div className="text-sm mt-1" style={{ color: TEXT.ghost }}>{sub}</div>}
    </div>
  );

  return (
    <SimShell style={{ minHeight: 'auto' }}>
      <SimHeader
        title="Bohr Model"
        accentWord="→ Hydrogen Spectrum"
        subtitle="one atom · one set of jumps · one spectrum, all in sync"
        badge={<span className="tabular-nums">Eₙ = −13.6 Z² / n² eV</span>}
      />

      <StepBar steps={BEATS} currentId={beat.id} onGo={(id) => goBeat(BEATS.findIndex((b) => b.id === id))} />

      {/* narration — plain text, never a bordered card (workflow §4) */}
      <div className="mb-6 max-w-4xl">
        <div className={`${TYPE.conceptHeading} mb-1.5`}>{beat.title}</div>
        <p className="text-base leading-relaxed" style={{ color: TEXT.secondary }}>{beat.body}</p>
      </div>

      <div className="mb-8">
        {/* ── THE ATOM (full width) — its own controls live inside the box ── */}
        <div>
          <PaneTitle sub="Rings are drawn evenly spaced so every level stays readable — the real radius (0.529 n² Å) is printed on each one. Flip on true n² scale to see how fast they actually grow. Click any orbit the electron is allowed to move to.">The atom</PaneTitle>
          <div className="relative w-full" style={{ height: 520 }}>
            <canvas
              ref={atomRef}
              className="w-full h-full block rounded-xl cursor-crosshair"
              style={{ border: `1px solid ${BORDER.card}` }}
              onMouseMove={atomMove}
              onMouseLeave={() => { sim.current.hoveredN = -1; }}
              onClick={atomClick}
            />
            {/* mode toggle — docked inside the simulator it controls */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {(['emission', 'absorption'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                  style={pill(mode === m)}>
                  {m}
                </button>
              ))}
            </div>
            {/* de Broglie toggle — also an atom control, so also inside the box */}
            <button onClick={() => setDeBroglie((v) => !v)}
              className="absolute top-3 right-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: deBroglie ? accentTint(ACCENT_2, 0.18) : 'rgba(255,255,255,0.05)',
                border: `1px solid ${deBroglie ? accentTint(ACCENT_2, 0.5) : BORDER.card}`,
                color: deBroglie ? ACCENT_2 : TEXT.secondary,
              }}>
              {deBroglie ? 'wave: on' : 'show wave'}
            </button>
            {/* the honest escape hatch for the evenly-spaced default */}
            <button onClick={() => setTrueScale((v) => !v)}
              className="absolute bottom-3 right-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: trueScale ? accentTint(ACCENT, 0.18) : 'rgba(255,255,255,0.05)',
                border: `1px solid ${trueScale ? accentTint(ACCENT, 0.5) : BORDER.card}`,
                color: trueScale ? ACCENT : TEXT.secondary,
              }}>
              {trueScale ? 'true n² scale: on' : 'true n² scale'}
            </button>
          </div>

          {/* nucleus charge — the atom's other property, so it sits with the atom */}
          <div className="flex items-center gap-4 mt-4 max-w-md">
            <span className="text-sm font-semibold shrink-0" style={{ color: TEXT.secondary }}>Nucleus</span>
            <input type="range" min={1} max={4} step={1} value={Z}
              onChange={(e) => setZ(parseInt(e.target.value, 10))}
              className="flex-1" style={{ accentColor: ACCENT }} />
            <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: ACCENT }}>
              {ZLABELS[Z - 1]} · Z={Z}
            </span>
          </div>
        </div>

        {/* ── ENERGY OF EACH JUMP — replaces the unreadable E-level ladder ── */}
        <div className="mt-8">
          <PaneTitle sub="Bar length = energy released, as a share of the series limit. Click any bar to make that jump.">
            Energy of each jump
          </PaneTitle>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {SERIES.map((s) => (
              <button key={s.nFinal}
                onClick={() => pickSeries(s.nFinal)}
                title={`${s.name} · lands on n=${s.nFinal} · ${s.region}`}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                style={pill(nFinal === s.nFinal)}>
                {s.name}
                <span className="ml-1.5 tabular-nums" style={{ opacity: 0.6 }}>→{s.nFinal}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {jumps.map((j) => {
              const on = j.nHi === nInitial;
              return (
                <button key={j.nHi}
                  onClick={() => { setNInitial(j.nHi); fire(nFinal, j.nHi); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{
                    background: on ? accentTint(ACCENT, 0.12) : 'transparent',
                    border: `1px solid ${on ? accentTint(ACCENT, 0.4) : 'transparent'}`,
                  }}>
                  <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: on ? ACCENT : TEXT.primary, width: 60 }}>
                    {j.nHi} → {nFinal}
                  </span>
                  <span className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="block h-full rounded-full" style={{ width: `${(j.ev / limitEv) * 100}%`, background: j.color }} />
                  </span>
                  <span className="text-sm font-bold tabular-nums shrink-0 text-right" style={{ color: TEXT.primary, width: 62 }}>
                    {j.ev.toFixed(2)} eV
                  </span>
                  <span className="text-sm tabular-nums shrink-0 text-right" style={{ color: j.color, width: 72 }}>
                    {j.wl.toFixed(0)} nm
                  </span>
                  <span className="text-xs shrink-0 text-right" style={{ color: TEXT.ghost, width: 44 }}>
                    {j.region.short}
                  </span>
                </button>
              );
            })}

            {/* the ceiling: n=∞ → nFinal, i.e. ionisation from the landing level */}
            <div className="w-full flex items-center gap-3 px-3 py-2.5 mt-1"
              style={{ borderTop: `1px solid ${BORDER.divider}` }}>
              <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: ACCENT, width: 60 }}>
                ∞ → {nFinal}
              </span>
              <span className="flex-1 h-3 rounded-full" style={{ border: `1px dashed ${accentTint(ACCENT, 0.6)}` }} />
              <span className="text-sm font-bold tabular-nums shrink-0 text-right" style={{ color: ACCENT, width: 62 }}>
                {limitEv.toFixed(2)} eV
              </span>
              <span className="text-sm tabular-nums shrink-0 text-right" style={{ color: ACCENT, width: 72 }}>
                {seriesLimitNm(nFinal, Z).toFixed(0)} nm
              </span>
              <span className="text-xs shrink-0 text-right" style={{ color: TEXT.ghost, width: 44 }}>limit</span>
            </div>
          </div>

          <p className="text-sm mt-3 leading-relaxed" style={{ color: TEXT.ghost }}>
            Each higher starting level adds less and less extra energy, so the bars bunch up against the dashed
            ceiling. That ceiling is the series limit — past it the electron is simply gone, and the spectrum
            turns into an unbroken continuum.
          </p>
        </div>
      </div>

      {/* ── THE SPECTRUM (full width) ── */}
      <PaneTitle sub="Faint lines are the whole series; a bright line burns in wherever you have actually fired a jump.">
        The spectrum
      </PaneTitle>
      <div className="relative w-full mb-6" style={{ height: 160 }}>
        <canvas ref={specRef} className="w-full h-full block rounded-xl" style={{ border: `1px solid ${BORDER.card}` }} />
      </div>

      {/* ── THIS LINE: series + the calculation ── */}
      <div className="pt-6" style={{ borderTop: `1px solid ${BORDER.divider}` }}>
        <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: TEXT.ghost }}>This line belongs to</div>
            <div className="text-3xl font-black leading-none" style={{ color: ACCENT }}>
              {ser.name} series
            </div>
            <div className="text-base mt-2 tabular-nums" style={{ color: TEXT.secondary }}>
              n={nInitial} → n={nFinal} · it lands on n={nFinal}, so it is a {ser.name} line
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: TEXT.ghost }}>
              {mode === 'absorption' ? 'Absorbed' : 'Emitted'} photon
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-sm shrink-0" style={{ background: col }} />
              <span className="text-3xl font-black leading-none tabular-nums" style={{ color: col }}>
                {wl.toFixed(1)} nm
              </span>
            </div>
            <div className="text-base mt-2 tabular-nums" style={{ color: TEXT.secondary }}>
              ΔE = <strong style={{ color: TEXT.primary }}>{dE.toFixed(3)}</strong> eV ·{' '}
              ν = <strong style={{ color: TEXT.primary }}>{thz.toFixed(0)}</strong> THz ·{' '}
              {reg.label}{reg.visible ? '' : ' — invisible to the eye'}
            </div>
          </div>
        </div>

        {/* the calculation, worked with the numbers actually on screen */}
        <div className="mt-7">
          <div className="text-sm font-semibold mb-3" style={{ color: TEXT.ghost }}>How that wavelength is calculated</div>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-3 text-xl" style={{ color: TEXT.primary }}>
            <Frac num="1" den={<span style={{ fontStyle: 'italic' }}>λ</span>} />
            <span style={{ color: TEXT.ghost }}>=</span>
            <span style={{ color: ACCENT, fontStyle: 'italic' }}>R<sub className="text-[0.6em] not-italic">H</sub></span>
            {Z > 1 && <span style={{ color: ACCENT, fontStyle: 'italic' }}>Z²</span>}
            <span style={{ color: TEXT.ghost }}>[</span>
            <Frac num="1" den={<span className="tabular-nums">{nFinal}²</span>} />
            <span style={{ color: TEXT.ghost }}>−</span>
            <Frac num="1" den={<span className="tabular-nums">{nInitial}²</span>} />
            <span style={{ color: TEXT.ghost }}>]</span>
          </div>
          <div className="flex items-center flex-wrap gap-x-2.5 gap-y-3 text-lg mt-4 tabular-nums" style={{ color: TEXT.secondary }}>
            <span style={{ color: TEXT.ghost }}>=</span>
            <span>0.01097{Z > 1 ? ` × ${Z * Z}` : ''}</span>
            <span style={{ color: TEXT.ghost }}>×</span>
            <span>{bracket.toFixed(4)}</span>
            <span style={{ color: TEXT.ghost }}>=</span>
            <span>{prettyExp(invLambda.toExponential(3))} nm⁻¹</span>
            <span style={{ color: TEXT.ghost }} className="mx-1">⇒</span>
            <span className="font-bold" style={{ color: col }}>λ = {wl.toFixed(1)} nm</span>
          </div>
        </div>
      </div>

      <ExpertTip>
        The {ser.name} lines pile up at{' '}
        <span className="tabular-nums" style={{ color: ACCENT }}>{Math.round(seriesLimitNm(nFinal, Z))} nm</span> — the series limit —
        because that is exactly the energy needed to pull the electron off level n={nFinal}:{' '}
        <span className="tabular-nums" style={{ color: ACCENT }}>{limitEv.toFixed(2)} eV</span>.
        Past the limit the lines merge into a continuum: the electron is free and can carry away any leftover energy.
      </ExpertTip>

      {/* ── LIMITS OF THE MODEL ── */}
      <div className="mt-8">
        <div className={`${TYPE.conceptHeading} mb-4`}>Where the Bohr model breaks</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          {[
            ['Only one electron', 'It nails hydrogen and one-electron ions (He⁺, Li²⁺ — try the nucleus slider) but fails the moment a second electron and its repulsion enter.'],
            ['No line intensities', 'It predicts where the lines fall, never why some are brighter than others.'],
            ['Defies uncertainty', 'A fixed circular orbit with a known radius and speed violates Heisenberg (1927). The electron has no definite path.'],
            ['No bonding', 'It cannot explain why atoms share electrons to make molecules — the basis of all chemistry.'],
          ].map(([t, b]) => (
            <div key={t}>
              <div className="text-base font-bold mb-1" style={{ color: TEXT.primary }}>{t}</div>
              <div className="text-base leading-relaxed" style={{ color: TEXT.secondary }}>{b}</div>
            </div>
          ))}
        </div>
        <p className="text-base leading-relaxed mt-5 max-w-4xl" style={{ color: TEXT.ghost }}>
          The orbit was a stepping stone. The standing wave is the real clue — it grows up into the quantum-mechanical
          orbital, where the electron is a cloud of probability rather than a ball on a track.
        </p>
      </div>
    </SimShell>
  );
}
