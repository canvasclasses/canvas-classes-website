'use client';

// Blackbody / Bulb Efficiency Lab
//
// Drag temperature; watch Planck's curve shift (Wien), grow (Stefan-Boltzmann),
// and read off the number that actually matters: what FRACTION of the emitted
// energy lands in the visible band.
//
// Rebuilt 2026-07-26 after a founder review asked whether this was teaching or
// just "a fancy graph that changes with temperature". Three real defects were
// found and fixed here:
//   1. visibleFraction() was fully implemented, numerically validated, and then
//      NEVER CALLED — the single most pedagogically valuable quantity in the
//      sim was computed and discarded, while the UI showed hardcoded "~5%"
//      text that ignored the slider. It is now the headline readout.
//   2. The y-axis renormalised to the current curve's own max every frame, so
//      the curve never appeared to grow and Stefan-Boltzmann was invisible —
//      despite the old header comment claiming it was shown. There is now a
//      "true scale" mode (fixed reference) plus an always-on σT⁴ readout.
//   3. The slider let a *tungsten filament* be dragged to 6500 K with no
//      consequence, silently contradicting the page's own punchline that
//      tungsten melts at 3695 K. That ceiling is now marked and enforced
//      visually — the filament fails above it.
// The three static bulb-era cards were also removed: they ignored the slider
// entirely, so they live on the page as a comparison_card block instead.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SimShell, SimHeader, useResolvedFont, useCanvasSize, TEXT, BORDER, ACCENTS, accentTint } from './_shared';

// Rendered heights in CSS px — width comes from the layout, and the canvas
// backing store is sized from the real element (see useCanvasSize), so text is
// drawn at true size instead of being upscaled from a fixed 720x400 bitmap.
const GRAPH_H = 460;
const BULB_H = 460;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Physical constants — NIST values (SIMULATION_DESIGN_WORKFLOW §7 requires
// exact constants, never rounded). c was previously 3.0e8.
const H_PLANCK = 6.62607015e-34;   // J·s
const C_LIGHT = 2.99792458e8;      // m/s
const KB = 1.380649e-23;           // J/K
const SIGMA_SB = 5.670374419e-8;   // W·m⁻²·K⁻⁴

// Tungsten's melting point — the physical ceiling on any filament bulb.
const TUNGSTEN_MP = 3695;

const T_MIN = 800;
const T_MAX = 6500;

const VIS_MIN = 400;
const VIS_MAX = 700;
const LAM_MIN = 100;
const LAM_MAX = 3000;
const INT_MIN = 50;
const INT_MAX = 30000;

function planck(lamNm: number, T: number): number {
  const lam = lamNm * 1e-9;
  const exponent = (H_PLANCK * C_LIGHT) / (lam * KB * T);
  const ex = Math.exp(Math.min(exponent, 700));
  return ((2 * H_PLANCK * C_LIGHT * C_LIGHT) / Math.pow(lam, 5)) / (ex - 1);
}

// Wien's displacement law: λ_peak × T = 2.897771955 × 10⁶ nm·K
const peakNm = (T: number) => 2.897771955e6 / T;

// ∫visible B dλ / ∫total B dλ — trapezoidal, over a domain wide enough that the
// denominator stays a faithful proxy for σT⁴ across the whole slider range.
function visibleFraction(T: number): number {
  const N = 1500;
  const step = (INT_MAX - INT_MIN) / N;
  let total = 0;
  let vis = 0;
  for (let i = 0; i <= N; i++) {
    const lam = INT_MIN + i * step;
    const b = planck(lam, T);
    const w = i === 0 || i === N ? 0.5 : 1;
    total += b * w;
    if (lam >= VIS_MIN && lam <= VIS_MAX) vis += b * w;
  }
  return total > 0 ? vis / total : 0;
}

// Peak spectral radiance at the top of the slider range — the fixed yardstick
// for "true scale" mode, so the curve's height carries real meaning.
const REF_MAX_B = planck(peakNm(T_MAX), T_MAX);

function blackbodyRGB(T: number): [number, number, number] {
  T = Math.max(1000, Math.min(10000, T));
  const t = T / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  return [
    Math.max(0, Math.min(255, Math.round(r))),
    Math.max(0, Math.min(255, Math.round(g))),
    Math.max(0, Math.min(255, Math.round(b))),
  ];
}

function formatPower(wPerM2: number): string {
  if (wPerM2 >= 1e6) return `${(wPerM2 / 1e6).toFixed(1)} MW/m²`;
  if (wPerM2 >= 1e3) return `${(wPerM2 / 1e3).toFixed(0)} kW/m²`;
  return `${wPerM2.toFixed(0)} W/m²`;
}

const PRESETS = [
  { name: 'Candle', T: 1850 },
  { name: 'Incandescent', T: 2700 },
  { name: 'Halogen', T: 3200 },
  { name: 'Sun', T: 5800 },
];

// An LED belongs in this row — it is the answer to "so what replaced the
// filament?" — but it is NOT a thermal emitter, so it cannot simply be a
// fifth blackbody preset. A white LED's "4000 K" is a CORRELATED COLOUR
// temperature: the blackbody whose colour its light resembles. Selecting it
// therefore switches the explanation into a mode that says so explicitly,
// rather than silently implying the curve on screen is an LED's spectrum.
const LED_CCT = 4000;      // typical "cool white"
const LED_CCT_RANGE = '2700–6500 K';

export default function BulbEvolutionSim() {
  const [T, setT] = useState(2700);
  const [trueScale, setTrueScale] = useState(false);
  const [ledMode, setLedMode] = useState(false);
  const graphRef = useRef<HTMLCanvasElement | null>(null);
  const bulbRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFont = useResolvedFont();

  const peak = peakNm(T);
  const [br, bg, bb] = blackbodyRGB(T);
  const bbCss = `rgb(${br}, ${bg}, ${bb})`;

  // The number this whole simulation exists to show.
  const visPct = useMemo(() => visibleFraction(T) * 100, [T]);
  const totalPower = SIGMA_SB * Math.pow(T, 4);
  const melted = T > TUNGSTEN_MP;

  // Colour the efficiency readout by how bad it is.
  const visColor = visPct < 5 ? '#fca5a5' : visPct < 15 ? ACCENTS.amber : ACCENTS.emerald; // sim-lint-ok: pass/fail semantics

  // ── GRAPH ────────────────────────────────────────────────────────────────
  // Drawn in CSS pixels at the element's real size (useCanvasSize handles the
  // devicePixelRatio backing store). Previously the canvas was a fixed
  // 720x400 stretched to fit, so every label was upscaled — soft edges AND
  // small relative to the plot.
  const drawGraph = useCallback(() => {
    const c = graphRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const { w: W, h: H } = graphDims.current;
    if (W < 10 || H < 10) return;
    ctx.clearRect(0, 0, W, H);

    const padL = 84, padR = 34, padT = 116, padB = 74;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    if (plotW < 40 || plotH < 40) return;

    // ── titles ───────────────────────────────────────────────────────────
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 22px ${canvasFont}`;
    ctx.fillText('BLACKBODY RADIATION', padL, 32);
    ctx.fillStyle = 'rgba(203,213,225,0.8)';
    ctx.font = `500 15px ${canvasFont}`;
    ctx.fillText(
      trueScale
        ? 'True scale — height shows real intensity (Stefan-Boltzmann)'
        : 'Fitted scale — curve rescaled each time, best for seeing the peak shift',
      padL, 60,
    );

    // ── plot panel ───────────────────────────────────────────────────────
    roundRect(ctx, padL, padT, plotW, plotH, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.018)';
    ctx.fill();

    const xFromLam = (lam: number) => padL + ((lam - LAM_MIN) / (LAM_MAX - LAM_MIN)) * plotW;

    const samples = 500;
    const vals: number[] = new Array(samples + 1);
    let maxB = 0;
    for (let i = 0; i <= samples; i++) {
      const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
      const b = planck(lam, T);
      vals[i] = b;
      if (b > maxB) maxB = b;
    }
    if (maxB <= 0) maxB = 1;

    // In true-scale mode the denominator is a fixed reference, so a hotter
    // body genuinely draws a taller curve (Stefan-Boltzmann becomes visible).
    const scaleRef = trueScale ? REF_MAX_B : maxB;
    const yFromFrac = (f: number) => padT + plotH - Math.min(1, f) * plotH * 0.88;
    const yFromB = (b: number) => yFromFrac(b / scaleRef);

    // ── visible band: a real spectrum strip, faded top to bottom ──────────
    const visX1 = xFromLam(VIS_MIN);
    const visX2 = xFromLam(VIS_MAX);
    ctx.save();
    roundRect(ctx, padL, padT, plotW, plotH, 10);
    ctx.clip();
    const grad = ctx.createLinearGradient(visX1, 0, visX2, 0);
    grad.addColorStop(0.00, 'rgba(150,  0, 230, 1)'); // sim-lint-ok: real spectral colours
    grad.addColorStop(0.20, 'rgba( 30, 100, 255, 1)'); // sim-lint-ok
    grad.addColorStop(0.45, 'rgba(  0, 225, 120, 1)'); // sim-lint-ok
    grad.addColorStop(0.70, 'rgba(255, 205,   0, 1)'); // sim-lint-ok
    grad.addColorStop(1.00, 'rgba(235,  55,  55, 1)'); // sim-lint-ok
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = grad;
    ctx.fillRect(visX1, padT, visX2 - visX1, plotH);
    ctx.globalAlpha = 1;
    // soft edges so the band reads as a region, not a pasted rectangle
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(visX1, padT); ctx.lineTo(visX1, padT + plotH);
    ctx.moveTo(visX2, padT); ctx.lineTo(visX2, padT + plotH);
    ctx.stroke();
    ctx.restore();

    // ── grid + y-axis values ─────────────────────────────────────────────
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const y = yFromFrac(frac);
      ctx.strokeStyle = i === 0 ? 'rgba(203,213,225,0.35)' : 'rgba(148,163,184,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(203,213,225,0.7)';
      ctx.font = `600 14px ${canvasFont}`;
      ctx.fillText(`${Math.round(frac * 100)}`, padL - 12, y);
    }

    // ── band labels ──────────────────────────────────────────────────────
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.font = `700 15px ${canvasFont}`;
    ctx.fillStyle = 'rgba(203,213,225,0.75)';
    if (visX1 - padL > 40) ctx.fillText('UV', (padL + visX1) / 2, padT - 22);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 15px ${canvasFont}`;
    ctx.fillText('VISIBLE', (visX1 + visX2) / 2, padT - 22);
    ctx.fillStyle = 'rgba(203,213,225,0.75)';
    ctx.font = `700 15px ${canvasFont}`;
    ctx.fillText('INFRARED', (visX2 + padL + plotW) / 2, padT - 22);

    // ── 2700 K ghost reference (true-scale mode only) ────────────────────
    if (trueScale && Math.abs(T - 2700) > 40) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(148,163,184,0.55)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i <= samples; i++) {
        const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
        const px = xFromLam(lam);
        const py = yFromB(planck(lam, 2700));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(148,163,184,0.85)';
      ctx.font = `600 14px ${canvasFont}`;
      ctx.textAlign = 'left';
      ctx.fillText('2700 K bulb (reference)', padL + 12, padT + plotH - 14);
    }

    // ── area under the curve: vertical fade, not a flat wash ─────────────
    const tracePath = () => {
      ctx.beginPath();
      ctx.moveTo(padL, padT + plotH);
      for (let i = 0; i <= samples; i++) {
        const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
        ctx.lineTo(xFromLam(lam), yFromB(vals[i]));
      }
      ctx.lineTo(padL + plotW, padT + plotH);
      ctx.closePath();
    };
    ctx.save();
    roundRect(ctx, padL, padT, plotW, plotH, 10);
    ctx.clip();
    const areaGrad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    areaGrad.addColorStop(0, 'rgba(251, 146, 60, 0.34)'); // sim-lint-ok: thermal identity colour
    areaGrad.addColorStop(1, 'rgba(251, 146, 60, 0.03)'); // sim-lint-ok
    ctx.fillStyle = areaGrad;
    tracePath();
    ctx.fill();

    // the slice the "visible light %" readout actually measures
    ctx.save();
    ctx.beginPath();
    ctx.rect(visX1, padT, visX2 - visX1, plotH);
    ctx.clip();
    const visGrad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    visGrad.addColorStop(0, 'rgba(103, 232, 249, 0.55)'); // sim-lint-ok: visible-slice highlight
    visGrad.addColorStop(1, 'rgba(103, 232, 249, 0.12)'); // sim-lint-ok
    ctx.fillStyle = visGrad;
    tracePath();
    ctx.fill();
    ctx.restore();

    // ── the curve ────────────────────────────────────────────────────────
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const lam = LAM_MIN + (i / samples) * (LAM_MAX - LAM_MIN);
      const px = xFromLam(lam);
      const py = yFromB(vals[i]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#fb923c'; // sim-lint-ok: thermal identity colour
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 16;
    ctx.shadowColor = 'rgba(251,146,60,0.65)'; // sim-lint-ok
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // ── axes ─────────────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(203,213,225,0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // ── peak marker + callout ────────────────────────────────────────────
    const peakClamped = Math.max(LAM_MIN, Math.min(LAM_MAX, peak));
    const peakX = xFromLam(peakClamped);
    const peakY = yFromB(maxB);
    ctx.strokeStyle = 'rgba(241,245,249,0.6)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#0b0f16';
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(peakX, peakY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Offset to the SIDE of the peak dot, not centred above it — a centred
    // label sits directly on top of the curve at exactly the point a student
    // is trying to read. Defaults to the right; flips to the left only when
    // the peak is close enough to the right edge that it would overflow.
    const peakLabel = `λpeak ≈ ${peak.toFixed(0)} nm`;
    ctx.font = `700 16px ${canvasFont}`;
    const lw = ctx.measureText(peakLabel).width + 22;
    const lh = 32;
    const gap = 16;
    const roomRight = (padL + plotW - 4) - (peakX + gap + lw);
    const goRight = roomRight >= 0 || peakX - padL < (padL + plotW) - peakX;
    let labelX = goRight ? peakX + gap : peakX - gap - lw;
    labelX = Math.max(padL + 4, Math.min(padL + plotW - 4 - lw, labelX));
    let labelY = peakY - lh / 2;
    labelY = Math.max(padT + 4, Math.min(padT + plotH - lh - 4, labelY));
    roundRect(ctx, labelX, labelY, lw, lh, 8);
    ctx.fillStyle = 'rgba(11,15,22,0.94)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(203,213,225,0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // short leader connecting the dot to the label so the offset reads as
    // "pointing at" the peak rather than a floating, unrelated box
    ctx.beginPath();
    ctx.moveTo(peakX + (goRight ? 7 : -7), peakY);
    ctx.lineTo(goRight ? labelX : labelX + lw, labelY + lh / 2);
    ctx.strokeStyle = 'rgba(241,245,249,0.4)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(peakLabel, labelX + lw / 2, labelY + lh / 2 + 1);

    // ── axis titles + ticks ──────────────────────────────────────────────
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(226,232,240,0.95)';
    ctx.font = `700 16px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('Wavelength  λ (nm)', padL + plotW / 2, H - 16);
    ctx.save();
    ctx.translate(24, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(trueScale ? 'Intensity (% of 6500 K peak)' : 'Intensity (% of peak)', 0, 0);
    ctx.restore();

    ctx.fillStyle = 'rgba(226,232,240,0.85)';
    ctx.font = `600 14px ${canvasFont}`;
    [500, 1000, 1500, 2000, 2500, 3000].forEach((lam) => {
      const x = xFromLam(lam);
      ctx.strokeStyle = 'rgba(203,213,225,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padT + plotH);
      ctx.lineTo(x, padT + plotH + 6);
      ctx.stroke();
      ctx.fillText(String(lam), x, padT + plotH + 26);
    });
    ctx.textAlign = 'start';
  }, [T, canvasFont, peak, trueScale]);

  // useCanvasSize captures its callback once (its effect deps are [ref]), so
  // handing it drawGraph directly would repaint a STALE temperature on any
  // window resize. Route resize repaints through a ref that always holds the
  // current closure.
  const drawGraphRef = useRef<() => void>(() => {});
  useEffect(() => { drawGraphRef.current = drawGraph; }, [drawGraph]);
  const onGraphResize = useCallback(() => { drawGraphRef.current(); }, []);
  const graphDims = useCanvasSize(graphRef, onGraphResize);
  useEffect(() => { drawGraph(); }, [drawGraph]);

  // ── BULB ─────────────────────────────────────────────────────────────────
  const drawBulb = useCallback(() => {
    const c = bulbRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const { w: W, h: H } = bulbDims.current;
    if (W < 10 || H < 10) return;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H * 0.40;
    const R = Math.min(W * 0.34, H * 0.20);     // glass radius
    const brightness = Math.max(0.15, Math.min(1, (T - T_MIN) / (TUNGSTEN_MP - T_MIN)));
    const rgba = (a: number) => `rgba(${br}, ${bg}, ${bb}, ${a})`;

    // halo
    const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 4);
    halo.addColorStop(0, rgba(brightness * (melted ? 0.18 : 0.5)));
    halo.addColorStop(0.35, rgba(brightness * 0.12));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // ── glass envelope ───────────────────────────────────────────────────
    const neckY = cy + R * 0.92;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.46, neckY);
    ctx.bezierCurveTo(cx - R * 1.05, cy + R * 0.35, cx - R * 1.02, cy - R * 0.95, cx, cy - R * 1.06);
    ctx.bezierCurveTo(cx + R * 1.02, cy - R * 0.95, cx + R * 1.05, cy + R * 0.35, cx + R * 0.46, neckY);
    ctx.closePath();
    const interior = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.3, R * 0.05, cx, cy, R * 1.25);
    interior.addColorStop(0, rgba(Math.min(0.95, brightness + 0.2)));
    interior.addColorStop(0.55, rgba(brightness * 0.45));
    interior.addColorStop(1, rgba(brightness * 0.16));
    ctx.fillStyle = interior;
    ctx.fill();
    ctx.strokeStyle = 'rgba(226,232,240,0.55)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // specular highlight on the glass — what makes it read as glass
    ctx.save();
    ctx.clip();
    const spec = ctx.createLinearGradient(cx - R, cy - R, cx - R * 0.1, cy + R * 0.2);
    spec.addColorStop(0, 'rgba(255,255,255,0.22)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.ellipse(cx - R * 0.42, cy - R * 0.34, R * 0.3, R * 0.52, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── filament ─────────────────────────────────────────────────────────
    const stemTop = cy - R * 0.1;
    const coilY = cy - R * 0.12;
    const coilHalf = R * 0.34;
    ctx.save();
    ctx.lineCap = 'round';
    // support wires from the base up to the coil
    ctx.strokeStyle = 'rgba(148,163,184,0.65)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx - coilHalf, stemTop); ctx.lineTo(cx - R * 0.16, neckY - 2);
    ctx.moveTo(cx + coilHalf, stemTop); ctx.lineTo(cx + R * 0.16, neckY - 2);
    ctx.stroke();

    if (melted) {
      // snapped: two drooping stubs and a gap where it vaporised
      ctx.strokeStyle = 'rgba(120,113,108,0.95)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - coilHalf, coilY);
      ctx.quadraticCurveTo(cx - coilHalf * 0.6, coilY + R * 0.16, cx - coilHalf * 0.32, coilY + R * 0.1);
      ctx.moveTo(cx + coilHalf, coilY);
      ctx.quadraticCurveTo(cx + coilHalf * 0.6, coilY + R * 0.17, cx + coilHalf * 0.3, coilY + R * 0.12);
      ctx.stroke();
    } else {
      // a real coil: zig-zag between two rails, glowing with temperature
      const turns = 9;
      ctx.shadowBlur = 22 * brightness;
      ctx.shadowColor = rgba(Math.min(1, brightness + 0.3));
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, 0.35 + brightness * 0.65)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= turns * 2; i++) {
        const x = cx - coilHalf + (i / (turns * 2)) * coilHalf * 2;
        const y = coilY + (i % 2 === 0 ? -R * 0.09 : R * 0.09);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    // ── screw base ───────────────────────────────────────────────────────
    const baseW = R * 0.86;
    const baseTop = neckY;
    const metal = ctx.createLinearGradient(cx - baseW / 2, 0, cx + baseW / 2, 0);
    metal.addColorStop(0, 'rgba(71,85,105,0.95)');
    metal.addColorStop(0.35, 'rgba(203,213,225,0.9)');
    metal.addColorStop(0.6, 'rgba(148,163,184,0.9)');
    metal.addColorStop(1, 'rgba(51,65,85,0.95)');
    ctx.fillStyle = metal;
    roundRect(ctx, cx - baseW / 2, baseTop, baseW, R * 0.26, 3);
    ctx.fill();
    // threads
    ctx.strokeStyle = 'rgba(15,23,42,0.45)';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 4; i++) {
      const y = baseTop + R * 0.3 + i * R * 0.13;
      const wdt = baseW * (1 - i * 0.07);
      ctx.fillStyle = metal;
      roundRect(ctx, cx - wdt / 2, y, wdt, R * 0.1, 4);
      ctx.fill();
      ctx.stroke();
    }
    // contact tip
    ctx.fillStyle = 'rgba(100,116,139,0.95)';
    ctx.beginPath();
    ctx.arc(cx, baseTop + R * 0.86, R * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // ── readout ──────────────────────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 30px ${canvasFont}`;
    ctx.fillText(`${T} K`, cx, H - 34);
    if (melted) {
      ctx.fillStyle = '#fca5a5'; // sim-lint-ok: failure-state semantics
      ctx.font = `700 15px ${canvasFont}`;
      ctx.fillText('filament has vaporised', cx, H - 12);
    } else {
      ctx.fillStyle = 'rgba(203,213,225,0.8)';
      ctx.font = `600 15px ${canvasFont}`;
      ctx.fillText('blackbody glow', cx, H - 12);
    }
    ctx.textAlign = 'start';
  }, [T, canvasFont, br, bg, bb, melted]);

  const drawBulbRef = useRef<() => void>(() => {});
  useEffect(() => { drawBulbRef.current = drawBulb; }, [drawBulb]);
  const onBulbResize = useCallback(() => { drawBulbRef.current(); }, []);
  const bulbDims = useCanvasSize(bulbRef, onBulbResize);
  useEffect(() => { drawBulb(); }, [drawBulb]);

  const tungstenPct = ((TUNGSTEN_MP - T_MIN) / (T_MAX - T_MIN)) * 100;

  // ── The explanation that sits directly under the graph ────────────────────
  // State-aware, so it always describes what is actually on screen — and it
  // answers the question the old copy left hanging. The previous melted-state
  // note ended on "...had to come from something other than a hot wire" and
  // never said what that something was.
  const band = peak < VIS_MIN ? 'in the ultraviolet'
    : peak <= VIS_MAX ? 'inside the visible band'
      : 'deep in the infrared';

  const reading = ledMode
    ? {
      tone: ACCENTS.emerald,
      title: 'An LED is not a hot object at all',
      body: (
        <>
          {LED_CCT} K is an LED&apos;s <strong style={{ color: TEXT.primary }}>correlated colour temperature</strong> — the
          blackbody whose <em>colour</em> its light resembles. It is not the temperature of anything. The chip itself sits a
          little above 100 °C; the light comes from electrons dropping across an engineered semiconductor band gap, not from
          heat. So the curve on screen is what a {LED_CCT} K hot object would radiate, <strong style={{ color: TEXT.primary }}>not
          an LED&apos;s spectrum</strong> — a real white LED emits a narrow blue spike plus a broad phosphor band, which is how it
          delivers <strong style={{ color: ACCENTS.emerald }}>40–50%</strong> of its energy as visible light where a 2700 K
          filament manages <strong style={{ color: '#fca5a5' }}>5%</strong>. LED colour temperatures run from 2700 K warm white
          to 6500 K daylight — every one of them the same cool little chip.
        </>
      ),
    }
    : melted
      ? {
        tone: '#fca5a5', // sim-lint-ok: failure-state semantics
        title: 'No filament can reach here — this is where the LED took over',
        body: (
          <>
            Above {TUNGSTEN_MP} K a tungsten filament vaporises, so everything past the red marker is real physics that no
            filament bulb can ever use — and even here only {visPct.toFixed(1)}% of the energy would be visible. The answer was
            to stop making light with heat altogether. An <strong style={{ color: ACCENTS.emerald }}>LED</strong> emits light
            from a semiconductor band gap instead of a temperature: 40–50% of its energy leaves as visible light, and the chip
            never goes much above 100 °C. When an LED is sold as &ldquo;2700 K warm white&rdquo; or &ldquo;6500 K
            daylight&rdquo;, that number is only the colour its light imitates — not how hot anything gets.
          </>
        ),
      }
      : {
        tone: ACCENTS.sky,
        title: `What the curve says at ${T} K`,
        body: (
          <>
            Wien puts the peak at <strong style={{ color: TEXT.primary }}>{peak.toFixed(0)} nm</strong>, {band}. Only{' '}
            <strong style={{ color: visColor }}>{visPct.toFixed(1)}%</strong> of the radiated energy lands between 400 and
            700 nm where your eye can use it — the other {(100 - visPct).toFixed(1)}% leaves as invisible infrared, which is
            the warmth you feel standing near an old bulb. Total output is {formatPower(totalPower)} and it climbs as T⁴, so
            pushing a filament brighter mostly makes it hotter, not more efficient.
          </>
        ),
      };

  const labelCls = 'text-xs font-semibold uppercase tracking-widest';

  return (
    <SimShell>
      <SimHeader
        title="Bulb Efficiency"
        accentWord="Lab"
        subtitle="Drag the temperature — watch where the peak lands and how little of it is light"
      />

      {/* ── CONTROL FIRST ────────────────────────────────────────────────────
          The subtitle says "drag the temperature", so the thing you drag now
          sits directly under it rather than below the graph it drives. */}
      <div className="mt-1">
        <div className="flex items-baseline justify-between mb-2">
          <span className={labelCls} style={{ color: TEXT.secondary }}>Temperature (T)</span>
          <span className="tabular-nums text-xl font-bold" style={{ color: bbCss }}>{T} K</span>
        </div>
        <div className="relative">
          <input
            type="range" min={T_MIN} max={T_MAX} step={10} value={T}
            onChange={(e) => { setLedMode(false); setT(parseInt(e.target.value)); }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', accentColor: ACCENTS.sky }}
          />
          {/* Tungsten melting-point marker */}
          <div className="absolute pointer-events-none" style={{ left: `${tungstenPct}%`, top: -4, transform: 'translateX(-50%)' }}>
            <div style={{ width: 2, height: 18, background: '#fca5a5', opacity: 0.9 }} />
          </div>
          <div className="absolute pointer-events-none text-xs font-semibold whitespace-nowrap"
            style={{ left: `${tungstenPct}%`, top: 18, transform: 'translateX(-50%)', color: '#fca5a5' }}>
            tungsten melts · {TUNGSTEN_MP} K
          </div>
        </div>
        <div className="flex justify-between text-xs mt-8 tracking-wide uppercase font-semibold" style={{ color: TEXT.muted }}>
          <span>Dull</span><span>Red hot</span><span>White hot</span><span>Blue-white</span>
        </div>

        {/* Presets — including the LED, which is what replaced the filament */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => {
            const active = !ledMode && Math.abs(T - p.T) < 15;
            return (
              <button key={p.name} onClick={() => { setLedMode(false); setT(p.T); }}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: active ? accentTint(ACCENTS.sky, 0.15) : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? accentTint(ACCENTS.sky, 0.4) : BORDER.card}`,
                  color: active ? ACCENTS.sky : TEXT.secondary, cursor: 'pointer',
                }}>
                {p.name} <span className="opacity-60 ml-1 tabular-nums">{p.T} K</span>
              </button>
            );
          })}
          {/* Dashed border = "this one is not a blackbody" */}
          <button onClick={() => { setLedMode(true); setT(LED_CCT); }}
            title="LEDs are not thermal emitters — this is a correlated colour temperature"
            className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: ledMode ? accentTint(ACCENTS.emerald, 0.15) : 'rgba(255,255,255,0.04)',
              border: `1px dashed ${ledMode ? accentTint(ACCENTS.emerald, 0.5) : BORDER.card}`,
              color: ledMode ? ACCENTS.emerald : TEXT.secondary, cursor: 'pointer',
            }}>
            LED <span className="opacity-60 ml-1 tabular-nums">{LED_CCT_RANGE}</span>
            <span className="opacity-50 ml-1.5">colour temp</span>
          </button>
          <span className="flex-1" />
          <button onClick={() => setTrueScale((v) => !v)}
            className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: trueScale ? accentTint(ACCENTS.amber, 0.15) : 'rgba(255,255,255,0.04)',
              border: `1px solid ${trueScale ? accentTint(ACCENTS.amber, 0.4) : BORDER.card}`,
              color: trueScale ? ACCENTS.amber : TEXT.secondary, cursor: 'pointer',
            }}>
            {trueScale ? '✓ True scale' : 'True scale'}
          </button>
        </div>
      </div>

      {/* ── THE GRAPH ── */}
      <div className="grid grid-cols-1 md:grid-cols-[2.6fr_1fr] gap-4 items-center mt-6">
        <canvas ref={graphRef} className="w-full block" style={{ height: GRAPH_H }} />
        <canvas ref={bulbRef} className="w-full block" style={{ height: BULB_H }} />
      </div>

      {/* Readouts — plain text, hairline separators, no cards */}
      <div className="flex flex-wrap gap-x-10 gap-y-3 py-4 mt-2" style={{ borderTop: `1px solid ${BORDER.hairline}`, borderBottom: `1px solid ${BORDER.hairline}` }}>
        <div>
          <div className={labelCls} style={{ color: TEXT.secondary }}>Visible light</div>
          <div className="text-3xl font-black tabular-nums" style={{ color: visColor, lineHeight: 1.25 }}>{visPct.toFixed(1)}%</div>
          <div className="text-sm" style={{ color: TEXT.ghost }}>{(100 - visPct).toFixed(1)}% wasted as heat</div>
        </div>
        <div>
          <div className={labelCls} style={{ color: TEXT.secondary }}>Peak wavelength</div>
          <div className="text-3xl font-black tabular-nums" style={{ color: TEXT.primary, lineHeight: 1.25 }}>{peak.toFixed(0)}<span className="text-base font-semibold"> nm</span></div>
          <div className="text-sm" style={{ color: TEXT.ghost }}>Wien: λ_peak × T = constant</div>
        </div>
        <div>
          <div className={labelCls} style={{ color: TEXT.secondary }}>Total power</div>
          <div className="text-3xl font-black tabular-nums" style={{ color: TEXT.primary, lineHeight: 1.25 }}>{formatPower(totalPower)}</div>
          <div className="text-sm" style={{ color: TEXT.ghost }}>Stefan-Boltzmann: σT⁴</div>
        </div>
      </div>

      {/* ── READING THIS CURVE — the explanation, right under the graph ── */}
      <div className="mt-5 pl-4" style={{ borderLeft: `2px solid ${reading.tone}` }}>
        <div className="text-lg font-bold mb-1.5" style={{ color: reading.tone }}>{reading.title}</div>
        <p className="text-base leading-relaxed" style={{ color: TEXT.secondary }}>{reading.body}</p>
      </div>

      <p className="text-base leading-relaxed mt-6" style={{ color: TEXT.ghost }}>
        Turn on <span style={{ color: ACCENTS.amber }}>true scale</span> to stop rescaling the graph: the curve&apos;s height
        then carries real meaning, and a dashed 2700 K bulb stays on screen for comparison. The sun radiates about 21× the
        power of a filament — on a fitted axis you would never see it.
      </p>
    </SimShell>
  );
}
