'use client';

/**
 * TyndallEffectSim — Light Scattering Across True Solutions, Colloids & Suspensions
 *
 * Academic source: NCERT Class 9 Science, Chapter 2 — "Is Matter Around Us Pure?"
 * "The scattering of a beam of light by colloidal particles is called the Tyndall effect."
 *
 * Particle size boundaries (NCERT-sourced):
 *   True solution  : < 1 nm    — particles too small to scatter visible light
 *   Colloid        : 1–1000 nm — Tyndall effect; particles scatter light sideways
 *   Suspension     : > 1000 nm — very heavy scattering; particles settle under gravity
 *
 * Simulation shows a side-view of a glass cuvette with a torch beam entering
 * from the left. The slider moves particle size logarithmically from 0.1 nm
 * (ionic true solution) to 2000 nm (coarse suspension).
 */

import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './_shared';

// ─── Canvas geometry ──────────────────────────────────────────────────────────

const W = 780;
const H = 420;

const WALL = 6;

// Cuvette outer bounds
const CV_X1 = 188, CV_Y1 = 78;
const CV_W  = 400, CV_H  = 264;
const CV_X2 = CV_X1 + CV_W;
const CV_Y2 = CV_Y1 + CV_H;

// Inner fluid area
const FL_X1 = CV_X1 + WALL;
const FL_Y1 = CV_Y1 + WALL;
const FL_W  = CV_W - WALL * 2;
const FL_H  = CV_H - WALL * 2;
const FL_X2 = FL_X1 + FL_W;
const FL_Y2 = FL_Y1 + FL_H;

// Beam travels horizontally through the vertical center
const BEAM_Y = CV_Y1 + CV_H / 2;

// Light source (torch)
const TORCH_X = 68;
const TORCH_Y = BEAM_Y;

// ─── Science helpers ──────────────────────────────────────────────────────────

/** Log scale: t=0 → 0.1 nm, t=100 → 2000 nm */
function nmFromT(t: number): number {
  return 0.1 * Math.pow(20000, t / 100);
}

type Regime = 'true-solution' | 'colloid' | 'suspension';

function getRegime(nm: number): Regime {
  if (nm < 1) return 'true-solution';
  if (nm <= 1000) return 'colloid';
  return 'suspension';
}

/**
 * 0–1 intensity of the visible Tyndall cone inside the cuvette.
 * - Near zero for true solution (no scattering).
 * - Peaks sharply at the onset of the colloid range (1 nm).
 * - Stays high across the colloid range.
 * - Decreases in suspension (diffuse turbidity replaces a clean cone).
 */
function coneIntensity(nm: number): number {
  if (nm < 0.3) return 0;
  if (nm < 1)   return ((nm - 0.3) / 0.7) * 0.10;
  if (nm <= 60) return 0.10 + ((nm - 1) / 59) * 0.55;
  if (nm <= 500) return 0.65 + ((nm - 60) / 440) * 0.27;
  if (nm <= 1000) return 0.92 + ((nm - 500) / 500) * 0.05;
  // Suspension: cone character dissolves into diffuse turbidity
  return Math.max(0.25, 0.97 - ((nm - 1000) / 1000) * 0.72);
}

/** How milky/opaque the fluid looks. */
function turbidity(nm: number): number {
  if (nm < 1) return 0;
  if (nm <= 100) return ((nm - 1) / 99) * 0.09;
  if (nm <= 1000) return 0.09 + ((nm - 100) / 900) * 0.22;
  return 0.31 + ((nm - 1000) / 1000) * 0.62;
}

/** Visual particle radius in canvas pixels. */
function particlePxR(nm: number): number {
  if (nm < 1)     return 1.2;
  if (nm <= 100)  return 1.8 + Math.log10(nm) * 2.6;
  if (nm <= 1000) return 5.5 + ((nm - 100) / 900) * 5.5;
  return 11 + Math.min(14, ((nm - 1000) / 1000) * 14);
}

/** Particle fill colour as [r, g, b]. */
function particleRGB(nm: number): [number, number, number] {
  if (nm < 1) return [120, 215, 255];   // cyan-blue: hydrated ions
  if (nm <= 1000) return [251, 191, 36]; // amber: colloidal particles
  return [158, 128, 92];               // clay-brown: coarse suspension
}

function particleCount(nm: number): number {
  if (nm < 1) return 115;
  if (nm <= 100) return 80;
  if (nm <= 1000) return 52;
  return 22;
}

/** Brownian-motion speed in canvas-px / second. */
function particleSpd(nm: number): number {
  if (nm < 1) return 45;
  if (nm <= 100) return 26;
  if (nm <= 1000) return 11;
  return 3;
}

/** Downward drift (sedimentation) speed for suspension particles (px/s). */
function sinkSpd(nm: number): number {
  if (nm <= 1000) return 0;
  return Math.min(16, ((nm - 1000) / 1000) * 16);
}

// ─── Particle / ray types ─────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

/** Short animated line segment — simulates a scattered photon leaving the beam. */
interface ScatterRay {
  x: number; y: number;
  angle: number;
  len: number;
  age: number;
  life: number;
}

// ─── Particle factory ─────────────────────────────────────────────────────────

function buildParticles(nm: number): Particle[] {
  const n   = particleCount(nm);
  const r   = particlePxR(nm);
  const spd = particleSpd(nm);
  return Array.from({ length: n }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = spd * (0.55 + Math.random() * 0.9);
    return {
      x: FL_X1 + r + Math.random() * (FL_W - r * 2),
      y: FL_Y1 + r + Math.random() * (FL_H - r * 2),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r,
    };
  });
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  nm: number,
  particles: Particle[],
  rays: ScatterRay[],
) {
  const regime = getRegime(nm);
  const ci     = coneIntensity(nm);
  const turb   = turbidity(nm);
  const [pr, pg, pb] = particleRGB(nm);

  // ── 1. Canvas background ──────────────────────────────────────────────────
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.65);
  bg.addColorStop(0, '#1e204a');
  bg.addColorStop(1, '#050614');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Faint grid — gives a lab/instrument feel
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 0.8;
  for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
  for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
  ctx.restore();

  // ── 2. Outer beam: torch → left cuvette wall (always visible) ─────────────
  ctx.save();
  const extLen = CV_X1 - TORCH_X - 18;
  const extGrad = ctx.createLinearGradient(TORCH_X + 18, BEAM_Y, CV_X1, BEAM_Y);
  extGrad.addColorStop(0, 'rgba(255,238,130,0.75)');
  extGrad.addColorStop(1, 'rgba(255,238,130,0.35)');
  ctx.fillStyle = extGrad;
  ctx.fillRect(TORCH_X + 18, BEAM_Y - 3, extLen, 6);
  // Outer halo of pre-entry beam
  const extHalo = ctx.createLinearGradient(TORCH_X + 18, BEAM_Y - 18, TORCH_X + 18, BEAM_Y + 18);
  extHalo.addColorStop(0, 'rgba(255,238,100,0)');
  extHalo.addColorStop(0.5, 'rgba(255,238,100,0.14)');
  extHalo.addColorStop(1, 'rgba(255,238,100,0)');
  ctx.fillStyle = extHalo;
  ctx.fillRect(TORCH_X + 18, BEAM_Y - 18, extLen, 36);
  ctx.restore();

  // ── 3. Fluid fill ──────────────────────────────────────────────────────────
  const fr = Math.round(9  + turb * 50);
  const fg = Math.round(11 + turb * 24);
  const fb = Math.round(34 - turb * 12);
  ctx.fillStyle = `rgb(${fr},${fg},${fb})`;
  rr(ctx, FL_X1, FL_Y1, FL_W, FL_H, 3);
  ctx.fill();

  // ── 4. Tyndall cone (main visible beam inside cuvette) ────────────────────
  if (ci > 0.005) {
    ctx.save();
    rr(ctx, FL_X1, FL_Y1, FL_W, FL_H, 3);
    ctx.clip();

    // Cone narrows at entry, spreads at exit (scattering loss + divergence)
    const topW1 = 3, botW1 = 3;
    const topW2 = regime === 'suspension' ? 62 : 5 + ci * 58;
    const botW2 = topW2;

    // Core beam trapezoid
    const alpha = regime === 'suspension'
      ? ci * 0.42
      : Math.min(0.97, ci * 1.08);

    ctx.beginPath();
    ctx.moveTo(FL_X1, BEAM_Y - topW1);
    ctx.lineTo(FL_X2, BEAM_Y - topW2);
    ctx.lineTo(FL_X2, BEAM_Y + botW2);
    ctx.lineTo(FL_X1, BEAM_Y + botW1);
    ctx.closePath();

    const core = ctx.createLinearGradient(FL_X1, BEAM_Y, FL_X2, BEAM_Y);
    core.addColorStop(0,   `rgba(255,252,210,${alpha})`);
    core.addColorStop(0.55, `rgba(255,248,185,${alpha * 0.88})`);
    core.addColorStop(1,    `rgba(255,242,160,${alpha * (regime === 'suspension' ? 0.22 : 0.72)})`);
    ctx.fillStyle = core;
    ctx.fill();

    // Perpendicular halo — this is what makes the Tyndall cone look like a
    // cone seen from the side: light scattered upward/downward away from the beam axis
    const haloH = regime === 'suspension' ? 78 : 14 + ci * 78;
    const halo = ctx.createLinearGradient(FL_X1, BEAM_Y - haloH, FL_X1, BEAM_Y + haloH);
    halo.addColorStop(0,    'rgba(255,242,120,0)');
    halo.addColorStop(0.32, `rgba(255,240,130,${ci * 0.09})`);
    halo.addColorStop(0.5,  `rgba(255,252,175,${ci * 0.22})`);
    halo.addColorStop(0.68, `rgba(255,240,130,${ci * 0.09})`);
    halo.addColorStop(1,    'rgba(255,242,120,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(FL_X1, BEAM_Y - haloH, FL_W, haloH * 2);

    // For suspension: extra diffuse scattering overlay (whole fluid glows)
    if (regime === 'suspension' && turb > 0.28) {
      const diffuse = ctx.createRadialGradient(FL_X1 + FL_W * 0.4, BEAM_Y, 0, FL_X1 + FL_W * 0.4, BEAM_Y, FL_W * 0.7);
      diffuse.addColorStop(0, `rgba(255,235,160,${(turb - 0.28) * 0.28})`);
      diffuse.addColorStop(1, 'rgba(255,235,160,0)');
      ctx.fillStyle = diffuse;
      ctx.fillRect(FL_X1, FL_Y1, FL_W, FL_H);
    }

    ctx.restore();
  }

  // ── 5. Scattered rays (photons leaving the beam after hitting particles) ───
  if (rays.length > 0) {
    ctx.save();
    rr(ctx, FL_X1, FL_Y1, FL_W, FL_H, 3);
    ctx.clip();
    for (const ray of rays) {
      const t = ray.age / ray.life;
      const a = (1 - t) * 0.52 * ci;
      if (a < 0.01) continue;
      const endX = ray.x + Math.cos(ray.angle) * ray.len * t * 1.5;
      const endY = ray.y + Math.sin(ray.angle) * ray.len * t * 1.5;
      ctx.beginPath();
      ctx.moveTo(ray.x, ray.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgba(255,248,185,${a})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── 6. Particles ──────────────────────────────────────────────────────────
  ctx.save();
  rr(ctx, FL_X1, FL_Y1, FL_W, FL_H, 3);
  ctx.clip();

  const nearRange = 16 + ci * 22;
  const pAlpha = regime === 'true-solution' ? 0.42 : regime === 'colloid' ? 0.78 : 0.82;

  for (const p of particles) {
    const lit = Math.abs(p.y - BEAM_Y) < nearRange && p.x > FL_X1 && p.x < FL_X2;

    // Glow halo for beam-illuminated particles — this is what you'd see from
    // the side in a real Tyndall experiment: each particle glows where the beam hits it
    if (lit && ci > 0.06) {
      const gr = p.r * 3.8;
      const glow = ctx.createRadialGradient(p.x, p.y, p.r * 0.4, p.x, p.y, gr);
      glow.addColorStop(0, `rgba(${pr},${pg},${pb},${ci * 0.48})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particle body
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${pr},${pg},${pb},${pAlpha})`;
    ctx.fill();

    // Specular highlight — makes particle look spherical
    if (p.r > 2.5) {
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.28, p.y - p.r * 0.28, p.r * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.24)';
      ctx.fill();
    }
  }
  ctx.restore();

  // ── 7. Cuvette glass walls ────────────────────────────────────────────────
  ctx.save();
  rr(ctx, CV_X1, CV_Y1, CV_W, CV_H, 8);
  ctx.strokeStyle = 'rgba(175,215,255,0.18)';
  ctx.lineWidth = WALL;
  ctx.stroke();

  // Top / bottom wall shine
  const glassShine = ctx.createLinearGradient(CV_X1, 0, CV_X2, 0);
  glassShine.addColorStop(0.1, 'rgba(200,232,255,0.07)');
  glassShine.addColorStop(0.5, 'rgba(200,232,255,0.19)');
  glassShine.addColorStop(0.9, 'rgba(200,232,255,0.07)');
  ctx.fillStyle = glassShine;
  ctx.fillRect(CV_X1 + WALL, CV_Y1, CV_W - WALL * 2, WALL);
  ctx.fillRect(CV_X1 + WALL, CV_Y2 - WALL, CV_W - WALL * 2, WALL);

  // Side walls
  ctx.fillRect(CV_X1, CV_Y1, WALL, CV_H);
  ctx.fillRect(CV_X2 - WALL, CV_Y1, WALL, CV_H);
  ctx.restore();

  // ── 8. Exit beam (right of cuvette) ──────────────────────────────────────
  const transmit = regime === 'true-solution' ? 0.82 :
                   regime === 'colloid' ? Math.max(0.04, 0.72 - ci * 0.65) : 0.06;
  if (transmit > 0.01) {
    ctx.save();
    const exitGrad = ctx.createLinearGradient(CV_X2, BEAM_Y, CV_X2 + 90, BEAM_Y);
    exitGrad.addColorStop(0, `rgba(255,245,180,${transmit})`);
    exitGrad.addColorStop(1, 'rgba(255,245,180,0)');
    ctx.fillStyle = exitGrad;
    ctx.fillRect(CV_X2, BEAM_Y - 3, 90, 6);
    ctx.restore();
  }

  // ── 9. Torch light source ─────────────────────────────────────────────────
  ctx.save();
  // Outer corona
  const corona = ctx.createRadialGradient(TORCH_X, TORCH_Y, 0, TORCH_X, TORCH_Y, 28);
  corona.addColorStop(0,   'rgba(255,252,200,0.5)');
  corona.addColorStop(0.45, 'rgba(255,225,80,0.25)');
  corona.addColorStop(1,   'rgba(255,185,30,0)');
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(TORCH_X, TORCH_Y, 28, 0, Math.PI * 2);
  ctx.fill();
  // Core spot
  ctx.beginPath();
  ctx.arc(TORCH_X, TORCH_Y, 7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,240,1)';
  ctx.fill();
  ctx.restore();

  // ── 10. Text labels ───────────────────────────────────────────────────────
  ctx.save();
  ctx.font = '10px system-ui';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgba(100,116,139,0.75)';
  ctx.fillText('LIGHT', TORCH_X, TORCH_Y + 35);
  ctx.fillText('SOURCE', TORCH_X, TORCH_Y + 46);

  // Regime label below cuvette
  const regLabel = regime === 'true-solution' ? 'TRUE SOLUTION' :
                   regime === 'colloid' ? 'COLLOID' : 'SUSPENSION';
  const regColor = regime === 'true-solution' ? 'rgba(52,211,153,0.8)' :
                   regime === 'colloid' ? 'rgba(251,191,36,0.8)' : 'rgba(248,113,113,0.8)';
  ctx.font = 'bold 10px system-ui';
  ctx.fillStyle = regColor;
  ctx.fillText(regLabel, CV_X1 + CV_W / 2, CV_Y2 + 20);

  // "Tyndall Cone" annotation (colloid only, once cone is visible)
  if (regime === 'colloid' && ci > 0.35) {
    const coneTopY = BEAM_Y - (14 + ci * 78) - 8;
    ctx.font = '10px system-ui';
    ctx.fillStyle = `rgba(251,191,36,${ci * 0.7})`;
    ctx.fillText('▲ Tyndall Cone', CV_X1 + CV_W / 2 + 30, Math.max(FL_Y1 + 14, coneTopY));
  }

  // True-solution annotation
  if (regime === 'true-solution') {
    ctx.font = '10px system-ui';
    ctx.fillStyle = 'rgba(52,211,153,0.5)';
    ctx.fillText('Beam not visible inside', CV_X1 + CV_W / 2, BEAM_Y - 28);
  }

  ctx.restore();
}

// ─── Main component ───────────────────────────────────────────────────────────

const SIDEBAR: Record<Regime, {
  label: string; accent: string; heading: string;
  body: string; examples: string[]; tip: string;
}> = {
  'true-solution': {
    label: 'True Solution',
    accent: '#34d399',
    heading: 'Beam invisible inside the liquid',
    body: 'Dissolved ions and molecules are <strong style="color:#34d399">smaller than 1 nm</strong> — far too small to scatter visible light (wavelength ~400–700 nm). The beam passes straight through without interacting with any particle. No Tyndall effect is observed.',
    examples: ['Salt dissolved in water', 'Sugar solution', 'Copper sulphate in water'],
    tip: 'True solutions are perfectly transparent. No amount of bright light will make the beam visible from the side.',
  },
  colloid: {
    label: 'Colloid',
    accent: '#fbbf24',
    heading: 'Tyndall cone lit up!',
    body: 'Colloidal particles (1–1000 nm) are comparable in size to the wavelength of visible light. They scatter incoming photons in all directions — including <em>sideways toward the observer</em>. This creates the glowing cone called the <strong style="color:#fbbf24">Tyndall effect</strong>.',
    examples: ['Milk in water', 'Fog / mist in air', 'Smoke in air', 'Starch in water'],
    tip: 'Used in labs to distinguish a colloid from a true solution — shine a beam, look from the side. Cone visible = colloid.',
  },
  suspension: {
    label: 'Suspension',
    accent: '#f87171',
    heading: 'Heavy scattering — beam blocked',
    body: 'Suspension particles (>1000 nm = >1 µm) are massive relative to wavelength. They scatter so intensely that the beam is <strong style="color:#f87171">almost entirely blocked</strong>. The fluid looks visibly turbid or cloudy. Particles also settle under gravity over time.',
    examples: ['Chalk powder in water', 'Muddy river water', 'Flour in water'],
    tip: 'Suspensions are unstable — particles settle on standing. Colloids are stable because particles are too small for gravity to overcome Brownian motion.',
  },
};

function formatNm(nm: number): string {
  if (nm < 1)    return `${nm.toFixed(2)} nm`;
  if (nm < 10)   return `${nm.toFixed(1)} nm`;
  if (nm < 1000) return `${Math.round(nm)} nm`;
  return `${(nm / 1000).toFixed(2)} µm`;
}

export default function TyndallEffectSim() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const raysRef     = useRef<ScatterRay[]>([]);
  const nmRef       = useRef(nmFromT(0));
  const regimeRef   = useRef<Regime>('true-solution');

  const [sliderT, setSliderT]     = useState(0);
  const [displayNm, setDisplayNm] = useState(nmFromT(0));

  // Rebuild particles when regime changes; update radius in-place within a regime
  useEffect(() => {
    const nm = nmFromT(sliderT);
    nmRef.current = nm;
    setDisplayNm(nm);

    const newRegime = getRegime(nm);
    if (newRegime !== regimeRef.current) {
      regimeRef.current = newRegime;
      particlesRef.current = buildParticles(nm);
      raysRef.current = [];
    } else {
      // Smooth in-regime resize
      const r   = particlePxR(nm);
      const spd = particleSpd(nm);
      for (const p of particlesRef.current) {
        p.r = r;
        const curSpd = Math.hypot(p.vx, p.vy);
        if (curSpd > 0.01) {
          const scale = spd / curSpd;
          p.vx *= scale;
          p.vy *= scale;
        }
      }
    }
  }, [sliderT]);

  // Initialise particles once on mount
  useEffect(() => {
    particlesRef.current = buildParticles(nmFromT(0));
  }, []);

  // Animation loop
  useAnimationFrame((delta) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nm     = nmRef.current;
    const regime = regimeRef.current;
    const ci     = coneIntensity(nm);
    const sink   = sinkSpd(nm);
    const r      = particlePxR(nm);
    const spd    = particleSpd(nm);

    // ── Update particles ────────────────────────────────────────────────────
    for (const p of particlesRef.current) {
      p.x += p.vx * delta;
      p.y += p.vy * delta + sink * delta;

      // Random Brownian kick (thermal jitter)
      if (Math.random() < 0.055) {
        const angle = Math.random() * Math.PI * 2;
        const s = spd * (0.55 + Math.random() * 0.9);
        p.vx = Math.cos(angle) * s;
        p.vy = Math.sin(angle) * s;
      }

      // Boundary collisions
      if (p.x < FL_X1 + r)  { p.x = FL_X1 + r;  p.vx =  Math.abs(p.vx); }
      if (p.x > FL_X2 - r)  { p.x = FL_X2 - r;  p.vx = -Math.abs(p.vx); }
      if (p.y < FL_Y1 + r)  { p.y = FL_Y1 + r;  p.vy =  Math.abs(p.vy); }
      if (p.y > FL_Y2 - r) {
        if (regime === 'suspension') {
          // Reset to top — simulates visible sedimentation cycling
          p.y = FL_Y1 + r + Math.random() * 20;
          p.x = FL_X1 + r + Math.random() * (FL_W - r * 2);
        } else {
          p.y = FL_Y2 - r;
          p.vy = -Math.abs(p.vy);
        }
      }
    }

    // ── Spawn scatter rays from beam-lit particles ──────────────────────────
    if (ci > 0.06) {
      const spawnChance = ci * 13 * delta;
      for (const p of particlesRef.current) {
        if (Math.abs(p.y - BEAM_Y) < 14 && Math.random() < spawnChance * 0.55) {
          // Scatter upward or downward (perpendicular to beam)
          const sign  = Math.random() > 0.5 ? 1 : -1;
          const angle = sign * (Math.PI * 0.30 + Math.random() * Math.PI * 0.40);
          raysRef.current.push({
            x: p.x, y: p.y,
            angle,
            len: 20 + Math.random() * 32,
            age: 0,
            life: 0.30 + Math.random() * 0.25,
          });
        }
      }
    }

    // Age rays; hard cap to prevent accumulation
    raysRef.current = raysRef.current
      .map(ray => ({ ...ray, age: ray.age + delta }))
      .filter(ray => ray.age < ray.life)
      .slice(-90);

    drawFrame(ctx, nm, particlesRef.current, raysRef.current);
  }, { target: canvasRef });

  const regime  = getRegime(displayNm);
  const content = SIDEBAR[regime];

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '80vh' }}>

      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Tyndall <span style={{ color: '#7c3aed' }}>Effect</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Light scattering · True solution → Colloid → Suspension
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          NCERT Class 9 · Chapter 2
        </div>
      </div>

      {/* Grid: canvas (8) + sidebar (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">

        {/* ── Left: Canvas + controls ─────────────────────────────────────── */}
        <div>
          <div
            className="relative overflow-hidden rounded-2xl flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* ── Slider ───────────────────────────────────────────────────── */}
          <div className="mt-5 px-1">
            <div className="flex items-center gap-4">
              <span
                className="text-[11px] font-black uppercase tracking-widest shrink-0"
                style={{ color: '#475569' }}
              >
                Particle Size
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderT}
                onChange={e => setSliderT(Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: '#818cf8' }}
              />
              <span
                className="text-sm font-black font-mono shrink-0 w-24 text-right tabular-nums"
                style={{ color: content.accent }}
              >
                {formatNm(displayNm)}
              </span>
            </div>

            {/* Zone colour bar */}
            <div className="mt-2.5 flex h-2 rounded-full overflow-hidden">
              <div style={{ width: '18%',  background: 'linear-gradient(to right,#10b981,#34d39966)' }} />
              <div style={{ width: '57%',  background: 'linear-gradient(to right,#fbbf2466,#fbbf24,#fbbf2490)' }} />
              <div style={{ width: '25%',  background: 'linear-gradient(to right,#f8717166,#f87171)' }} />
            </div>
            <div className="flex mt-1.5 text-[10px] font-bold" style={{ color: '#475569' }}>
              <span style={{ width: '18%' }}>True Sol.</span>
              <span style={{ width: '57%', textAlign: 'center' }}>Colloid — Tyndall Effect</span>
              <span style={{ width: '25%', textAlign: 'right' }}>Suspension</span>
            </div>
            <div className="flex mt-0.5 text-[10px]" style={{ color: '#334155' }}>
              <span style={{ width: '18%' }}>&lt; 1 nm</span>
              <span style={{ width: '57%', textAlign: 'center' }}>1 nm → 1000 nm</span>
              <span style={{ width: '25%', textAlign: 'right' }}>&gt; 1 µm</span>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ──────────────────────────────────────────────── */}
        <div className="flex flex-col py-1 gap-5">
          <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
            What&apos;s Happening
          </h2>

          {/* Regime badge */}
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: content.accent, boxShadow: `0 0 6px ${content.accent}` }}
            />
            <span
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: content.accent }}
            >
              {content.label}
            </span>
          </div>

          {/* Explanation block */}
          <div style={{ transition: 'opacity 0.3s ease' }}>
            <h4
              className="font-black text-[13px] uppercase tracking-widest mb-2"
              style={{ color: content.accent }}
            >
              {content.heading}
            </h4>
            <p
              className="text-base leading-snug"
              style={{ color: '#94a3b8' }}
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          </div>

          {/* Examples */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: content.accent }}>
              Real Examples
            </p>
            <div className="flex flex-col gap-1.5">
              {content.examples.map(ex => (
                <div key={ex} className="flex items-start gap-2">
                  <span className="text-[9px] mt-1 shrink-0" style={{ color: content.accent }}>◆</span>
                  <span className="text-sm leading-snug" style={{ color: '#94a3b8' }}>{ex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Tip */}
          <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>
              Expert Tip
            </h5>
            <p className="text-white text-base font-bold leading-tight italic">
              &ldquo;{content.tip}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
