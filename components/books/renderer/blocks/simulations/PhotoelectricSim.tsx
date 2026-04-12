'use client';

// Photoelectric Effect — Einstein's quantum explanation in a real apparatus.
//
// Stage canvas:
//   • An evacuated photoelectric cell with a selectable cathode metal.
//   • A light source outside the tube fires colour-coded photons through a
//     quartz window onto the cathode.
//   • If hν ≥ W₀, electrons are ejected and accelerated to the anode.
//   • An external circuit (ammeter A, battery, rheostat) closes the loop, and
//     a live photo-current flows around it whenever the cell is above threshold.
//
// Two live graphs below the stage:
//   • KE vs ν   — flat at 0 until ν₀, then linear (slope h)
//   • KE vs I   — flat line (intensity never changes KE)
//
// Pedagogy invariant (do not break):
//   ν changes the ENERGY of each photon. Intensity changes the COUNT of photons.
//   Never let frequency change photon count or KE depend on intensity.

import { useEffect, useRef, useState } from 'react';
import {
  useAnimationFrame,
  useResolvedFont,
  mulberry32,
  nuToRGB,
} from './_shared';

const PLANCK = 6.626e-34;       // J·s
const EV = 1.602e-19;           // J per eV
const PLANCK_EV = PLANCK / EV;  // ≈ 4.136e-15 eV·s

// ── Metals from the NCERT work-function table ───────────────────────────
type Metal = {
  symbol: string;
  name: string;
  W0: number; // eV
};

const METALS: Metal[] = [
  { symbol: 'Cs', name: 'Cesium',    W0: 2.14 },
  { symbol: 'K',  name: 'Potassium', W0: 2.25 },
  { symbol: 'Na', name: 'Sodium',    W0: 2.30 },
  { symbol: 'Li', name: 'Lithium',   W0: 2.42 },
  { symbol: 'Mg', name: 'Magnesium', W0: 3.70 },
  { symbol: 'Ag', name: 'Silver',    W0: 4.30 },
  { symbol: 'Cu', name: 'Copper',    W0: 4.80 },
];

// Frequency slider holds ν in units of 10¹⁴ Hz.
// 3×10¹⁴ is below Cs's threshold; 20×10¹⁴ is well above Cu's threshold.
const NU_MIN = 3;
const NU_MAX = 20;

const CANVAS_W = 900;
const CANVAS_H = 460;
const GRAPH_W = 430;
const GRAPH_H = 230;

// ── Frequency → photon colour ───────────────────────────────────────────
// Frequency → colour mapping, PRNG and font resolution all live in the shared
// helpers module (`./_shared`) so every sim renders with the same maths and
// the same canvas typography stack.

function photonEnergyEV(nu10_14: number): number {
  return PLANCK_EV * nu10_14 * 1e14;
}
function formatEV(e: number): string {
  if (Math.abs(e) < 0.005) return '0.00';
  return e.toFixed(2);
}
function formatFreq(nu10_14: number): string {
  return `${nu10_14.toFixed(2)} × 10¹⁴ Hz`;
}

// ── Drawing helpers ─────────────────────────────────────────────────────
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function drawBattery(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Two-cell battery: alternating long (positive) and short (negative) plates.
  ctx.strokeStyle = 'rgba(226,232,240,0.9)';
  ctx.lineWidth = 2;
  const gap = 6;
  const longH = 18;
  const shortH = 10;
  const positions = [-gap * 1.5, -gap * 0.5, gap * 0.5, gap * 1.5];
  positions.forEach((dx, i) => {
    const h = i % 2 === 0 ? longH : shortH;
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy - h / 2);
    ctx.lineTo(cx + dx, cy + h / 2);
    ctx.stroke();
  });
}

function drawRheostat(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Zigzag resistor with a slider arrow above.
  const w = 44;
  const h = 7;
  const segs = 6;
  ctx.strokeStyle = 'rgba(226,232,240,0.9)';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy);
  for (let i = 0; i < segs; i++) {
    const x1 = cx - w / 2 + (w / segs) * (i + 0.5);
    const y1 = cy + (i % 2 === 0 ? -h : h);
    ctx.lineTo(x1, y1);
  }
  ctx.lineTo(cx + w / 2, cy);
  ctx.stroke();
  // Slider arrow
  ctx.beginPath();
  ctx.moveTo(cx, cy - 16);
  ctx.lineTo(cx + 5, cy - 8);
  ctx.lineTo(cx - 5, cy - 8);
  ctx.closePath();
  ctx.fillStyle = 'rgba(251,191,36,0.9)';
  ctx.fill();
}

// Draw an animated photo-current as glowing dashes flowing along a polyline.
function drawCurrentDashes(
  ctx: CanvasRenderingContext2D,
  path: Array<[number, number]>,
  time: number,
  intensity: number
) {
  type Seg = { x1: number; y1: number; x2: number; y2: number; len: number; cum: number };
  const segs: Seg[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    segs.push({ x1, y1, x2, y2, len, cum: total });
    total += len;
  }
  if (total === 0) return;

  const dashLen = 10;
  const gapLen = 18;
  const period = dashLen + gapLen;
  // Flow speed scales with intensity (more photons → more current)
  const speed = 60 + intensity * 16;
  const offset = (time * speed) % period;

  const dashCount = Math.ceil(total / period) + 2;

  ctx.save();
  ctx.strokeStyle = 'rgba(34,211,238,0.95)';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.shadowBlur = 7;
  ctx.shadowColor = 'rgba(34,211,238,0.7)';

  for (let k = 0; k < dashCount; k++) {
    const startD = k * period - offset;
    const endD = startD + dashLen;
    if (endD < 0 || startD > total) continue;
    const a = Math.max(0, startD);
    const b = Math.min(total, endD);
    if (b <= a) continue;

    ctx.beginPath();
    let started = false;
    for (const seg of segs) {
      const segStart = seg.cum;
      const segEnd = seg.cum + seg.len;
      if (b < segStart || a > segEnd) continue;
      const localA = Math.max(a, segStart) - segStart;
      const localB = Math.min(b, segEnd) - segStart;
      const tA = localA / seg.len;
      const tB = localB / seg.len;
      const xA = seg.x1 + (seg.x2 - seg.x1) * tA;
      const yA = seg.y1 + (seg.y2 - seg.y1) * tA;
      const xB = seg.x1 + (seg.x2 - seg.x1) * tB;
      const yB = seg.y1 + (seg.y2 - seg.y1) * tB;
      if (!started) {
        ctx.moveTo(xA, yA);
        started = true;
      } else {
        ctx.lineTo(xA, yA);
      }
      ctx.lineTo(xB, yB);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export default function PhotoelectricSim() {
  const [metalIdx, setMetalIdx] = useState(0); // start with Cs
  const [nu10_14, setNu10_14] = useState(8);    // ν = 8 × 10¹⁴ Hz
  const [intensity, setIntensity] = useState(5); // 1 → 10 scale
  const [time, setTime] = useState(0);

  const stageRef = useRef<HTMLCanvasElement | null>(null);
  const graphNuRef = useRef<HTMLCanvasElement | null>(null);
  const graphIRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFont = useResolvedFont();

  const metal = METALS[metalIdx];
  const Ephoton = photonEnergyEV(nu10_14);            // eV
  const KE = Math.max(0, Ephoton - metal.W0);         // eV
  const ejects = Ephoton >= metal.W0;
  const thresholdNu = metal.W0 / PLANCK_EV / 1e14;    // in units of 10¹⁴ Hz

  // Photo-current proportional to intensity above threshold (illustrative μA)
  const photoCurrent = ejects ? intensity * 0.12 : 0;

  // Frequency-driven photon colour
  const [pr, pg, pb] = nuToRGB(nu10_14);
  const photonCss = `rgb(${pr}, ${pg}, ${pb})`;
  const photonGlow = `rgba(${pr}, ${pg}, ${pb}, 0.55)`;

  // Animation loop — paused automatically when the stage canvas scrolls out
  // of view or the tab goes into the background. `time` still lives in React
  // state because the stage-draw effect below depends on it; the shared hook
  // just gates when the React update actually fires.
  useAnimationFrame(
    (delta) => {
      setTime((t) => t + delta);
    },
    { target: stageRef }
  );

  // ── Main stage ─────────────────────────────────────────────────────
  useEffect(() => {
    const c = stageRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.width;
    ctx.clearRect(0, 0, W, c.height);

    // ── Layout ──
    // Light source (outside the tube)
    const sourceX = 95;
    const sourceY = 140;
    const sourceR = 16;

    // Evacuated tube body
    const tubeX0 = 165, tubeX1 = 760;
    const tubeY0 = 60, tubeY1 = 220;

    // Cathode plate (left, inside tube)
    const cathodeX = 205;
    const plateW = 9;
    const plateY0 = 78, plateY1 = 202;

    // Anode plate (right, inside tube)
    const anodeX = 720;

    // Circuit rails / components
    const wireY = 290;       // upper horizontal trunk wires
    const circuitY = 380;    // bottom rail with components
    const leftRailX = 130;
    const rightRailX = 790;

    // ── Stat readouts (top corners) ──
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = `700 11px ${canvasFont}`;
    ctx.fillText('INCIDENT PHOTON', 24, 24);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `600 13px ${canvasFont}`;
    ctx.fillText(`hν = ${formatEV(Ephoton)} eV`, 24, 42);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = `700 11px ${canvasFont}`;
    ctx.fillText('PHOTOELECTRON KE', W - 24, 24);
    ctx.fillStyle = ejects ? '#22d3ee' : '#f87171';
    ctx.font = `600 13px ${canvasFont}`;
    ctx.fillText(`KE = ${formatEV(KE)} eV`, W - 24, 42);
    ctx.textAlign = 'start';

    // ── Light source ──
    // Glow radius and alpha scale with intensity so a brighter lamp "shines"
    // more strongly. The core colour is driven by ν (photon energy).
    const iNorm = (intensity - 1) / 9; // 0..1
    const haloMul = 0.75 + iNorm * 1.25;  // 0.75 → 2.0
    const haloA = 0.55 + iNorm * 0.45;    // 0.55 → 1.00

    // Outer glow layers
    ctx.beginPath();
    ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.07 * haloA})`;
    ctx.arc(sourceX, sourceY, (sourceR + 26) * haloMul, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.13 * haloA})`;
    ctx.arc(sourceX, sourceY, (sourceR + 14) * haloMul, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.22 * haloA})`;
    ctx.arc(sourceX, sourceY, (sourceR + 6) * haloMul, 0, Math.PI * 2);
    ctx.fill();

    // Core bulb
    ctx.save();
    ctx.shadowBlur = 22 + iNorm * 22;
    ctx.shadowColor = photonGlow;
    ctx.fillStyle = photonCss;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, sourceR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bright specular highlight on bulb
    ctx.fillStyle = `rgba(255, 255, 255, ${0.55 + iNorm * 0.35})`;
    ctx.beginPath();
    ctx.arc(sourceX - sourceR * 0.35, sourceY - sourceR * 0.35, sourceR * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Rim
    ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, 0.85)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, sourceR, 0, Math.PI * 2);
    ctx.stroke();

    // Beam cone from the bulb edge toward the cathode — subtle trapezoid that
    // gets brighter with intensity, so the viewer sees the lamp "lighting up"
    // the quartz window.
    const beamA = 0.05 + iNorm * 0.11;
    const beamGrad = ctx.createLinearGradient(sourceX + sourceR, 0, cathodeX, 0);
    beamGrad.addColorStop(0, `rgba(${pr}, ${pg}, ${pb}, ${beamA * 1.8})`);
    beamGrad.addColorStop(1, `rgba(${pr}, ${pg}, ${pb}, 0)`);
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(sourceX + sourceR - 2, sourceY - 8);
    ctx.lineTo(cathodeX - 2, sourceY - 34);
    ctx.lineTo(cathodeX - 2, sourceY + 34);
    ctx.lineTo(sourceX + sourceR - 2, sourceY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('LIGHT SOURCE', sourceX, sourceY - sourceR - 14);

    // ── Evacuated tube ──
    // Subtle glass-like fill
    const tubeGrad = ctx.createLinearGradient(0, tubeY0, 0, tubeY1);
    tubeGrad.addColorStop(0, 'rgba(148,163,184,0.06)');
    tubeGrad.addColorStop(0.5, 'rgba(148,163,184,0.10)');
    tubeGrad.addColorStop(1, 'rgba(148,163,184,0.06)');
    ctx.fillStyle = tubeGrad;
    roundedRect(ctx, tubeX0, tubeY0, tubeX1 - tubeX0, tubeY1 - tubeY0, 90);
    ctx.fill();

    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.lineWidth = 1.5;
    roundedRect(ctx, tubeX0, tubeY0, tubeX1 - tubeX0, tubeY1 - tubeY0, 90);
    ctx.stroke();

    // Tube label
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `700 13px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'EVACUATED PHOTOELECTRIC CELL',
      (tubeX0 + tubeX1) / 2,
      tubeY0 - 12
    );

    // Quartz window marker (where light enters)
    ctx.strokeStyle = 'rgba(148,163,184,0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(tubeX0, sourceY - 24);
    ctx.lineTo(tubeX0, sourceY + 24);
    ctx.stroke();

    // ── Cathode plate ──
    const plateGrad = ctx.createLinearGradient(cathodeX, 0, cathodeX + plateW, 0);
    plateGrad.addColorStop(0, 'rgba(148,163,184,0.95)');
    plateGrad.addColorStop(0.5, 'rgba(226,232,240,1)');
    plateGrad.addColorStop(1, 'rgba(100,116,139,0.95)');
    ctx.fillStyle = plateGrad;
    ctx.fillRect(cathodeX, plateY0, plateW, plateY1 - plateY0);
    ctx.strokeStyle = 'rgba(226,232,240,0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cathodeX + 0.5, plateY0 + 0.5, plateW - 1, plateY1 - plateY0 - 1);

    // Cathode (-) tag
    ctx.fillStyle = 'rgba(203,213,225,0.9)';
    ctx.font = `800 12px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('CATHODE (−)', cathodeX + plateW / 2, plateY0 - 8);

    // Metal symbol + work function below the cathode
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 22px ${canvasFont}`;
    ctx.fillText(metal.symbol, cathodeX + plateW / 2, plateY1 + 24);
    ctx.fillStyle = 'rgba(251,191,36,0.95)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.fillText(`W₀ = ${metal.W0.toFixed(2)} eV`, cathodeX + plateW / 2, plateY1 + 40);

    // ── Anode plate ──
    const anodeGrad = ctx.createLinearGradient(anodeX, 0, anodeX + plateW, 0);
    anodeGrad.addColorStop(0, 'rgba(148,163,184,0.95)');
    anodeGrad.addColorStop(0.5, 'rgba(226,232,240,1)');
    anodeGrad.addColorStop(1, 'rgba(100,116,139,0.95)');
    ctx.fillStyle = anodeGrad;
    ctx.fillRect(anodeX, plateY0, plateW, plateY1 - plateY0);
    ctx.strokeStyle = 'rgba(226,232,240,0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(anodeX + 0.5, plateY0 + 0.5, plateW - 1, plateY1 - plateY0 - 1);

    ctx.fillStyle = 'rgba(203,213,225,0.9)';
    ctx.font = `800 12px ${canvasFont}`;
    ctx.fillText('ANODE (+)', anodeX + plateW / 2, plateY0 - 8);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `800 22px ${canvasFont}`;
    ctx.fillText('A', anodeX + plateW / 2, plateY1 + 24);

    // ── Photons (light source → cathode) ──
    // Round photon particles travelling rightward in a slightly diverging cone
    // from the bulb to the quartz window. Count scales with intensity; each
    // photon's colour is driven by ν. A small tail streak hints at motion.
    const photonStartX = sourceX + sourceR - 1;
    const photonEndX = cathodeX;
    const flightDist = photonEndX - photonStartX;

    const photonCount = 6 + Math.round(intensity * 3.4); // ~9 → ~40
    const photonSpeed = 200;
    const photonR = 2.6;

    const rand = mulberry32(2025);

    for (let i = 0; i < photonCount; i++) {
      const lane = (rand() - 0.5) * 36;         // spread at source
      const phaseOffset = rand() * 1000;
      const localT = (time * photonSpeed + phaseOffset) % (flightDist + 18);
      const px = photonStartX + localT;
      if (px > photonEndX - 1) continue;

      // Cone divergence: lane widens as the photon moves away from the bulb
      const progress = Math.max(0, Math.min(1, localT / flightDist));
      const coneSpread = 1 + progress * 1.1;
      const py = sourceY + lane * coneSpread;

      // Motion tail (short streak)
      ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, 0.45)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px - 9, py);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Glowing particle body
      ctx.save();
      ctx.shadowBlur = 9;
      ctx.shadowColor = photonGlow;
      ctx.fillStyle = photonCss;
      ctx.beginPath();
      ctx.arc(px, py, photonR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bright white inner highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(px - photonR * 0.3, py - photonR * 0.3, photonR * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Ejected electrons (cathode → anode) ──
    if (ejects) {
      const electronCount = 3 + Math.round(intensity * 1.6);
      const flightRange = anodeX - (cathodeX + plateW);
      // Speed ∝ √KE, with a minimum so electrons stay perceptible at low KE
      const speedFactor = Math.sqrt(KE) * 110 + 80;

      for (let i = 0; i < electronCount; i++) {
        const lane = (mulberry32(9000 + i * 137)() - 0.5) * 110;
        const phaseOffset = mulberry32(17000 + i * 53)() * 1000;
        const localT = (time * speedFactor + phaseOffset) % flightRange;
        const ex = cathodeX + plateW + localT;
        const ey = sourceY + lane;

        // Fade in just after the cathode and out just before the anode
        const tNorm = localT / flightRange;
        const fadeIn = Math.min(1, tNorm * 8);
        const fadeOut = Math.min(1, (1 - tNorm) * 8);
        const fade = Math.max(0, Math.min(fadeIn, fadeOut));

        // Electron body — cyan (consistent with KE colour throughout the sim)
        ctx.save();
        ctx.shadowBlur = 9;
        ctx.shadowColor = `rgba(34,211,238,${0.7 * fade})`;
        ctx.fillStyle = `rgba(34,211,238,${0.95 * fade})`;
        ctx.beginPath();
        ctx.arc(ex, ey, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Subtle minus sign
        ctx.strokeStyle = `rgba(15,23,42,${fade})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(ex - 1.6, ey);
        ctx.lineTo(ex + 1.6, ey);
        ctx.stroke();
      }
    } else {
      // "No ejection" badge inside the tube near the cathode
      ctx.fillStyle = 'rgba(248,113,113,0.12)';
      const bx = cathodeX + plateW + 18;
      const by = plateY0 + 8;
      ctx.fillRect(bx, by, 184, 24);
      ctx.strokeStyle = 'rgba(248,113,113,0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 0.5, by + 0.5, 183, 23);
      ctx.fillStyle = 'rgba(252,165,165,0.95)';
      ctx.font = `700 11px ${canvasFont}`;
      ctx.textAlign = 'left';
      ctx.fillText('NO EJECTION  hν < W₀', bx + 10, by + 16);
    }

    // ── External circuit ──
    const wireColor = 'rgba(148,163,184,0.55)';
    const wireLW = 1.8;
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = wireLW;

    // Cathode side wire: plate bottom → down → outward → down to bottom rail
    // Start below the Cs/W₀ label stack so the wire doesn't cross the text.
    const cathodeWireTopY = plateY1 + 52;
    const cathodeBaseX = cathodeX + plateW / 2;
    ctx.beginPath();
    ctx.moveTo(cathodeBaseX, cathodeWireTopY);
    ctx.lineTo(cathodeBaseX, wireY);
    ctx.lineTo(leftRailX, wireY);
    ctx.lineTo(leftRailX, circuitY);
    ctx.stroke();

    // Anode side wire — start just below the big "A" label
    const anodeWireTopY = plateY1 + 36;
    const anodeBaseX = anodeX + plateW / 2;
    ctx.beginPath();
    ctx.moveTo(anodeBaseX, anodeWireTopY);
    ctx.lineTo(anodeBaseX, wireY);
    ctx.lineTo(rightRailX, wireY);
    ctx.lineTo(rightRailX, circuitY);
    ctx.stroke();

    // Bottom rail
    ctx.beginPath();
    ctx.moveTo(leftRailX, circuitY);
    ctx.lineTo(rightRailX, circuitY);
    ctx.stroke();

    // ── Components on the bottom rail ──
    // Ammeter (A)
    const ammeterX = 290, ammeterR = 19;
    ctx.beginPath();
    ctx.fillStyle = '#0b0d1a';
    ctx.arc(ammeterX, circuitY, ammeterR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34,211,238,0.85)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(ammeterX, circuitY, ammeterR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(34,211,238,0.95)';
    ctx.font = `800 17px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', ammeterX, circuitY + 1);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `700 11px ${canvasFont}`;
    ctx.fillText('AMMETER', ammeterX, circuitY + ammeterR + 16);

    // Live photo-current readout next to the ammeter
    ctx.fillStyle = ejects ? 'rgba(34,211,238,0.95)' : 'rgba(148,163,184,0.45)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.textAlign = 'left';
    ctx.fillText(
      `i = ${photoCurrent.toFixed(2)} μA`,
      ammeterX + ammeterR + 8,
      circuitY + 4
    );

    // Battery
    const batteryX = 470;
    drawBattery(ctx, batteryX, circuitY);
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `700 11px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('BATTERY', batteryX, circuitY + 24);

    // Rheostat
    const rheoX = 630;
    drawRheostat(ctx, rheoX, circuitY);
    ctx.fillStyle = 'rgba(203,213,225,0.85)';
    ctx.font = `700 11px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('RHEOSTAT', rheoX, circuitY + 24);

    // ── Animated photo-current flow ──
    if (ejects) {
      // Polyline path along the external circuit, going from cathode wire down,
      // along the bottom rail through ammeter, around the battery, and back up
      // to the anode wire. We split around components with no-draw gaps so the
      // dashes appear to enter and exit each instrument cleanly.
      const pathPart1: Array<[number, number]> = [
        [cathodeBaseX, cathodeWireTopY],
        [cathodeBaseX, wireY],
        [leftRailX, wireY],
        [leftRailX, circuitY],
        [ammeterX - ammeterR - 1, circuitY],
      ];
      const pathPart2: Array<[number, number]> = [
        [ammeterX + ammeterR + 1, circuitY],
        [batteryX - 14, circuitY],
      ];
      const pathPart3: Array<[number, number]> = [
        [batteryX + 14, circuitY],
        [rheoX - 24, circuitY],
      ];
      const pathPart4: Array<[number, number]> = [
        [rheoX + 24, circuitY],
        [rightRailX, circuitY],
        [rightRailX, wireY],
        [anodeBaseX, wireY],
        [anodeBaseX, anodeWireTopY],
      ];
      drawCurrentDashes(ctx, pathPart1, time, intensity);
      drawCurrentDashes(ctx, pathPart2, time, intensity);
      drawCurrentDashes(ctx, pathPart3, time, intensity);
      drawCurrentDashes(ctx, pathPart4, time, intensity);
    }
  }, [
    time, nu10_14, intensity, metalIdx, canvasFont,
    metal.W0, metal.symbol, Ephoton, KE, ejects,
    pr, pg, pb, photonCss, photonGlow, photoCurrent,
  ]);

  // ── Graph: KE vs ν ─────────────────────────────────────────────
  useEffect(() => {
    const c = graphNuRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.width;
    const H = c.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 46;
    const padR = 18;
    const padT = 32;
    const padB = 38;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Axes
    ctx.strokeStyle = 'rgba(148,163,184,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Title
    ctx.fillStyle = 'rgba(226,232,240,0.9)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('KE vs FREQUENCY (ν)', padL, 18);

    // Domain bounds
    const KEmaxDomain = Math.max(0.5, photonEnergyEV(NU_MAX) - metal.W0);

    const xFromNu = (n: number) =>
      padL + ((n - NU_MIN) / (NU_MAX - NU_MIN)) * plotW;
    const yFromKE = (k: number) =>
      padT + plotH - (k / KEmaxDomain) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(148,163,184,0.09)';
    for (let i = 1; i < 5; i++) {
      const y = padT + (plotH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
    }
    for (let i = 1; i < 5; i++) {
      const x = padL + (plotW / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
    }

    // Threshold line
    const thrX = xFromNu(thresholdNu);
    if (thrX >= padL && thrX <= padL + plotW) {
      ctx.strokeStyle = 'rgba(251,191,36,0.75)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(thrX, padT);
      ctx.lineTo(thrX, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(251,191,36,0.95)';
      ctx.font = `700 10px ${canvasFont}`;
      ctx.textAlign = 'center';
      ctx.fillText('ν₀', thrX, padT - 4);
    }

    // KE = hν − W₀ curve
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.4;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(34,211,238,0.55)';
    ctx.beginPath();
    const steps = 120;
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const n = NU_MIN + (i / steps) * (NU_MAX - NU_MIN);
      const k = Math.max(0, photonEnergyEV(n) - metal.W0);
      const px = xFromNu(n);
      const py = yFromKE(k);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current operating dot
    const dotX = xFromNu(nu10_14);
    const dotY = yFromKE(KE);
    ctx.fillStyle = '#f1f5f9';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(241,245,249,0.9)';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Axis labels
    ctx.fillStyle = 'rgba(148,163,184,0.85)';
    ctx.font = `500 11px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('ν (× 10¹⁴ Hz)', padL + plotW / 2, H - 8);
    ctx.save();
    ctx.translate(14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('KE (eV)', 0, 0);
    ctx.restore();

    // Y ticks
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = `400 10px ${canvasFont}`;
    for (let i = 0; i <= 5; i++) {
      const val = (KEmaxDomain * i) / 5;
      const y = padT + plotH - (plotH * i) / 5;
      ctx.fillText(val.toFixed(1), padL - 6, y + 3);
    }
    // X ticks
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const val = NU_MIN + ((NU_MAX - NU_MIN) * i) / 5;
      const x = padL + (plotW * i) / 5;
      ctx.fillText(val.toFixed(0), x, padT + plotH + 14);
    }
    ctx.textAlign = 'start';
  }, [nu10_14, metalIdx, metal.W0, thresholdNu, KE, canvasFont]);

  // ── Graph: KE vs Intensity ──────────────────────────────────────
  useEffect(() => {
    const c = graphIRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.width;
    const H = c.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 46;
    const padR = 18;
    const padT = 32;
    const padB = 38;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Axes
    ctx.strokeStyle = 'rgba(148,163,184,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Title
    ctx.fillStyle = 'rgba(226,232,240,0.9)';
    ctx.font = `700 12px ${canvasFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('KE vs INTENSITY (I)', padL, 18);

    // Same KE scale as the other graph
    const KEmaxDomain = Math.max(0.5, photonEnergyEV(NU_MAX) - metal.W0);

    const xFromI = (i: number) => padL + ((i - 1) / 9) * plotW;
    const yFromKE = (k: number) =>
      padT + plotH - (k / KEmaxDomain) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(148,163,184,0.09)';
    for (let i = 1; i < 5; i++) {
      const y = padT + (plotH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
    }
    for (let i = 1; i < 5; i++) {
      const x = padL + (plotW / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
    }

    // Flat line at current KE — intensity does not change KE
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.4;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(34,211,238,0.55)';
    ctx.beginPath();
    ctx.moveTo(xFromI(1), yFromKE(KE));
    ctx.lineTo(xFromI(10), yFromKE(KE));
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current dot
    const dotX = xFromI(intensity);
    const dotY = yFromKE(KE);
    ctx.fillStyle = '#f1f5f9';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(241,245,249,0.9)';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Why-it's-flat callout
    ctx.fillStyle = 'rgba(148,163,184,0.65)';
    ctx.font = `500 10px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'KE is independent of intensity',
      padL + plotW / 2,
      padT + plotH / 2 - 6
    );
    ctx.fillText(
      '(more photons → more electrons, same KE each)',
      padL + plotW / 2,
      padT + plotH / 2 + 9
    );

    // Axis labels
    ctx.fillStyle = 'rgba(148,163,184,0.85)';
    ctx.font = `500 11px ${canvasFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('I (relative)', padL + plotW / 2, H - 8);
    ctx.save();
    ctx.translate(14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('KE (eV)', 0, 0);
    ctx.restore();

    // Y ticks
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = `400 10px ${canvasFont}`;
    for (let i = 0; i <= 5; i++) {
      const val = (KEmaxDomain * i) / 5;
      const y = padT + plotH - (plotH * i) / 5;
      ctx.fillText(val.toFixed(1), padL - 6, y + 3);
    }
    // X ticks
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const val = 1 + (9 * i) / 5;
      const x = padL + (plotW * i) / 5;
      ctx.fillText(val.toFixed(0), x, padT + plotH + 14);
    }
    ctx.textAlign = 'start';
  }, [intensity, nu10_14, metalIdx, metal.W0, KE, canvasFont]);

  return (
    <div className="font-sans my-6">
      {/* Metal selector */}
      <div className="mb-4">
        <div className="text-slate-300 text-[11px] font-bold tracking-widest uppercase mb-2">
          Cathode Metal
        </div>
        <div className="flex flex-wrap gap-2">
          {METALS.map((m, i) => {
            const active = i === metalIdx;
            return (
              <button
                key={m.symbol}
                onClick={() => setMetalIdx(i)}
                className={`font-sans px-3 py-2 rounded-xl border transition-all text-[11px] font-bold tracking-wide ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
                title={m.name}
              >
                <span className="text-[14px] font-extrabold mr-1">{m.symbol}</span>
                <span className="opacity-70">{m.W0.toFixed(2)} eV</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main stage */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#0b0d1a',
          border: '1px solid rgba(148,163,184,0.12)',
        }}
      >
        <canvas
          ref={stageRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full h-auto block"
        />
      </div>

      {/* Sliders */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-slate-300 text-[11px] font-bold tracking-widest uppercase">
              Frequency (ν)
            </span>
            <span className="font-mono text-[13px] font-bold" style={{ color: photonCss }}>
              {formatFreq(nu10_14)}
            </span>
          </div>
          <input
            type="range"
            min={NU_MIN}
            max={NU_MAX}
            step={0.1}
            value={nu10_14}
            onChange={e => setNu10_14(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background:
                'linear-gradient(to right,' +
                ' rgb(180,60,30) 0%,' +
                ' rgb(255,90,50) 12%,' +
                ' rgb(255,140,50) 18%,' +
                ' rgb(255,210,70) 24%,' +
                ' rgb(120,220,110) 30%,' +
                ' rgb(60,170,255) 36%,' +
                ' rgb(170,90,240) 44%,' +
                ' rgb(195,130,255) 60%,' +
                ' rgb(230,225,255) 100%)',
              accentColor: photonCss,
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 tracking-wide uppercase font-semibold">
            <span>Low ν</span>
            <span className="text-amber-300">
              ν₀ = {thresholdNu.toFixed(2)} × 10¹⁴ Hz
            </span>
            <span>High ν</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-slate-300 text-[11px] font-bold tracking-widest uppercase">
              Intensity (I)
            </span>
            <span className="text-cyan-300 font-mono text-[13px] font-bold">
              {intensity}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={intensity}
            onChange={e => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 tracking-wide uppercase font-semibold">
            <span>Dim</span>
            <span>More photons, same energy each</span>
            <span>Bright</span>
          </div>
        </div>
      </div>

      {/* Status panel */}
      <div
        className="mt-6 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-5 gap-4"
        style={{
          background: 'rgba(148,163,184,0.04)',
          border: '1px solid rgba(148,163,184,0.12)',
        }}
      >
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Photon energy
          </div>
          <div className="font-mono text-[15px] text-slate-100 mt-1">
            hν = <span className="font-bold" style={{ color: photonCss }}>{formatEV(Ephoton)}</span> eV
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Work function
          </div>
          <div className="font-mono text-[15px] text-slate-100 mt-1">
            W₀ = <span className="text-amber-300 font-bold">{metal.W0.toFixed(2)}</span> eV
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Kinetic energy
          </div>
          <div className="font-mono text-[15px] text-slate-100 mt-1">
            KE = <span className={ejects ? 'text-cyan-300 font-bold' : 'text-rose-300 font-bold'}>
              {formatEV(KE)}
            </span> eV
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Photo-current
          </div>
          <div className="font-mono text-[15px] text-slate-100 mt-1">
            i = <span className={ejects ? 'text-cyan-300 font-bold' : 'text-slate-500 font-bold'}>
              {photoCurrent.toFixed(2)}
            </span> μA
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Status
          </div>
          <div className={`font-mono text-[12px] mt-1 font-bold ${ejects ? 'text-emerald-300' : 'text-rose-300'}`}>
            {ejects ? 'ELECTRONS EJECTED' : 'BELOW THRESHOLD'}
          </div>
        </div>
      </div>

      {/* Two live graphs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#0b0d1a',
            border: '1px solid rgba(148,163,184,0.12)',
          }}
        >
          <canvas
            ref={graphNuRef}
            width={GRAPH_W}
            height={GRAPH_H}
            className="w-full h-auto block"
          />
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#0b0d1a',
            border: '1px solid rgba(148,163,184,0.12)',
          }}
        >
          <canvas
            ref={graphIRef}
            width={GRAPH_W}
            height={GRAPH_H}
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* Takeaway */}
      <div className="mt-4 text-[12px] text-slate-300 leading-relaxed">
        Einstein&apos;s equation:{' '}
        <span className="font-mono text-slate-100 font-semibold">KE = hν − W₀</span>. Try it
        yourself — raising <span className="text-cyan-300 font-semibold">intensity</span> fires
        more photons (the ammeter climbs) but does{' '}
        <em className="not-italic text-rose-300">not</em> change each electron&apos;s KE.
        Raising <span className="text-cyan-300 font-semibold">frequency</span> past{' '}
        <span className="text-amber-300 font-semibold">ν₀</span> is the only way to speed
        electrons up. Switch metals to see how stubborn cathodes like{' '}
        <span className="text-slate-100 font-semibold">Cu</span> or{' '}
        <span className="text-slate-100 font-semibold">Ag</span> demand higher-energy photons
        than <span className="text-slate-100 font-semibold">Cs</span>.
      </div>
    </div>
  );
}
