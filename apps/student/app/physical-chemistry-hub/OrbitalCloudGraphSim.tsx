'use client';

/**
 * Atomic Orbital Lab — a rotatable 3D electron-density cloud with nodal planes,
 * colored axes, the live radial wavefunction formula, its probability-density
 * and radial-distribution curves, and a Compare mode.
 *
 * This is a faithful React/R3F port of the reference design (the whole
 * feature set — cloud + nodal planes + axes + formula + step analysis +
 * Compare tab — is preserved). Three deliberate adaptations, all keeping the
 * look, because the reference's browser-CDN approach can't run inside our
 * bundle / sim standard:
 *   • formula rendered with KaTeX (bundled) instead of a CDN MathJax script;
 *   • the two curves are hand-rolled SVG paths instead of adding D3 as a dep;
 *   • no monospace anywhere (SIMULATION_DESIGN_WORKFLOW §2 bans it) — the
 *     orbital-name / axis labels use the normal sans stack.
 *
 * MATH is ported verbatim from the reference: the generalized Laguerre
 * polynomial → normalized hydrogenic radial wavefunction R_nl(r) (a₀ = 1),
 * and the real (cartesian) angular forms for s/p/d. Same functional family as
 * OrbitalShapeExplorerSim.tsx / RadialDistributionSim.tsx (NCERT Class 11
 * Ch.2 §2.6; Griffiths QM Table 4.7; Atkins' Physical Chemistry Table 9A.1).
 *
 * ARCHITECTURE: lives in apps/student (not book-renderer's internal registry)
 * because it needs @react-three/fiber / drei / three — app-only deps, same as
 * QuantumOrbital3DViewer / AtomicModels. Injected as simulation_id
 * 'orbital-cloud-graph' via ExtraSimulatorsProvider (see extraSimulators.tsx).
 * Chrome colours come from the book-renderer `_shared` design tokens; the
 * axes (X/Y/Z = red/green/blue), nodal-plane amber, and the green Compare
 * series are DATA colours, not chrome (marked `// sim-lint-ok`).
 */

import { Suspense, useEffect, useMemo, useState, Component, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { ACCENT, ACCENT_2, TEXT, BORDER, SIM_CANVAS_BG } from '@canvas/book-renderer/simulations/_shared';

const A0 = 1;
const AMBER = '#f59e0b';   // nodal planes — DATA colour, sim-lint-ok
const GREEN = '#10b981';   // Compare series — DATA colour, sim-lint-ok

/* ── Math (ported verbatim from the reference) ──────────────────────────── */

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Generalized Laguerre polynomial L_n^alpha(x)
function laguerre(n: number, alpha: number, x: number): number {
  if (n === 0) return 1;
  if (n === 1) return 1 + alpha - x;
  let L0 = 1;
  let L1 = 1 + alpha - x;
  let Lk = L1;
  for (let k = 1; k < n; k++) {
    Lk = ((2 * k + 1 + alpha - x) * L1 - (k + alpha) * L0) / (k + 1);
    L0 = L1;
    L1 = Lk;
  }
  return Lk;
}

function radialWavefunction(n: number, l: number, r: number): number {
  const rho = (2 * r) / (n * A0);
  const norm = Math.sqrt(
    Math.pow(2 / (n * A0), 3) * (factorial(n - l - 1) / (2 * n * factorial(n + l))),
  );
  return norm * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre(n - l - 1, 2 * l + 1, rho);
}

// Real angular probability density (unnormalized — only shape matters).
function angularDensitySq(l: number, ml: number, x: number, y: number, z: number, r: number): number {
  if (r === 0) return l === 0 ? 1 : 0;
  if (l === 0) return 1;
  const r2 = r * r, r4 = r2 * r2;
  if (l === 1) {
    if (ml === 0) return (z * z) / r2;      // p_z
    if (ml === 1) return (x * x) / r2;      // p_x
    if (ml === -1) return (y * y) / r2;     // p_y
  }
  if (l === 2) {
    if (ml === 0) return Math.pow(3 * z * z - r2, 2) / r4;  // d_z²
    if (ml === 1) return (x * x * z * z) / r4;              // d_xz
    if (ml === -1) return (y * y * z * z) / r4;             // d_yz
    if (ml === 2) return (x * x * y * y) / r4;              // d_xy
    if (ml === -2) return Math.pow(x * x - y * y, 2) / r4;  // d_x²-y²
  }
  return 1;
}

function orbitalName(n: number, l: number, ml: number): string {
  const letter = ['s', 'p', 'd', 'f', 'g'][l];
  let name = `${n}${letter}`;
  if (l === 1) name += ml === 0 ? '_z' : ml === 1 ? '_x' : '_y';
  else if (l === 2) {
    name += ml === 0 ? '_z²' : ml === 1 ? '_xz' : ml === -1 ? '_yz' : ml === 2 ? '_xy' : '_x²-y²';
  }
  return name;
}

interface OrbState { n: number; l: number; ml: number }

const PILLS: (OrbState & { label: string })[] = [
  { label: '1s', n: 1, l: 0, ml: 0 },
  { label: '2s', n: 2, l: 0, ml: 0 },
  { label: '2p', n: 2, l: 1, ml: 0 },
  { label: '3s', n: 3, l: 0, ml: 0 },
  { label: '3p', n: 3, l: 1, ml: 0 },
  { label: '3d', n: 3, l: 2, ml: 2 },
  { label: '4s', n: 4, l: 0, ml: 0 },
];

const COMPARE_OPTIONS: (OrbState & { label: string })[] = [
  { label: '3s', n: 3, l: 0, ml: 0 },
  { label: '3p_z', n: 3, l: 1, ml: 0 },
  { label: '3d_xy', n: 3, l: 2, ml: 2 },
  { label: '4s', n: 4, l: 0, ml: 0 },
  { label: '4p_z', n: 4, l: 1, ml: 0 },
  { label: '4d_xy', n: 4, l: 2, ml: 2 },
  { label: '5s', n: 5, l: 0, ml: 0 },
];

/* ── 3D point cloud ─────────────────────────────────────────────────────── */

const NUM_POINTS = 30000;
const MAX_ATTEMPTS = 1_500_000;

function boundsFor(n: number): number {
  return Math.min((n * n * 2.5 + 5) * 1.2, 80);
}

function generateCloud(n: number, l: number, ml: number) {
  const R_max = n * n * 2.5 + 5;
  const bounds = boundsFor(n);

  let maxRadDens = 0;
  for (let r = 0.1; r < R_max; r += 0.2) {
    const d = Math.pow(radialWavefunction(n, l, r), 2);
    if (d > maxRadDens) maxRadDens = d;
  }
  // The angular part's PEAK differs a lot between d-orbitals — d_xy tops out at
  // 0.25, d_x²−y² at 1, d_z² at 4 — so normalising only by the radial max (as
  // before) made d_x²−y² 4× and d_z² 16× denser than d_xy at their peaks, which
  // buried the nodal gaps. Normalise by the FULL peak (radial × angular),
  // measured numerically, so every orbital's densest region maps to the same
  // acceptance and the clouds read at a consistent, legible density.
  let maxAngDens = 1e-9;
  for (let k = 0; k < 3000; k++) {
    const ux = Math.random() - 0.5, uy = Math.random() - 0.5, uz = Math.random() - 0.5;
    const ur = Math.sqrt(ux * ux + uy * uy + uz * uz);
    if (ur < 1e-6) continue;
    maxAngDens = Math.max(maxAngDens, angularDensitySq(l, ml, ux, uy, uz, ur));
  }
  const totalMax = maxRadDens * maxAngDens;
  const GAMMA = 0.8; // <1 lifts diffuse regions so lobes aren't only a hot core

  const positions: number[] = [];
  const colors: number[] = [];
  const cA = new THREE.Color(ACCENT);
  const cB = new THREE.Color(ACCENT_2);

  let i = 0, attempts = 0;
  while (positions.length < NUM_POINTS * 3 && attempts < MAX_ATTEMPTS) {
    attempts++;
    const x = (Math.random() - 0.5) * 2 * bounds;
    const y = (Math.random() - 0.5) * 2 * bounds;
    const z = (Math.random() - 0.5) * 2 * bounds;
    const r = Math.sqrt(x * x + y * y + z * z);
    if (r > bounds) continue;

    const rProb = Math.pow(radialWavefunction(n, l, r), 2);
    const aProb = angularDensitySq(l, ml, x, y, z, r);
    const norm = (rProb * aProb) / totalMax; // in [0, 1], consistent across orbitals

    if (Math.random() < Math.pow(norm, GAMMA)) {
      positions.push(x, y, z);
      const mix = Math.min(1, r / (bounds * 0.8));
      const c = cA.clone().lerp(cB, mix * 0.6);
      colors.push(c.r, c.g, c.b);
      i++;
    }
  }
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    bounds,
  };
}

// Soft radial-gradient sprite → the additive glow that makes the cloud read as
// a luminous density, not scattered dots.
function makeGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.8, 'rgba(255,255,255,0.1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

function OrbitalCloud({ n, l, ml }: OrbState) {
  const { positions, colors, bounds } = useMemo(() => generateCloud(n, l, ml), [n, l, ml]);
  const texture = useMemo(makeGlowTexture, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={bounds * 0.035}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Nodal planes for p / d orbitals, defined by each plane's NORMAL vector (a
// default plane lies in xy with normal +z; we rotate it so its normal points
// along the given vector). This is unambiguous — deriving Euler tuples by hand
// got d_x²−y² wrong before. Each plane passes through the nucleus.
function NodalPlanes({ l, ml, bounds }: { l: number; ml: number; bounds: number }) {
  const rotations = useMemo<[number, number, number][]>(() => {
    let normals: [number, number, number][] = [];
    if (l === 1) {
      if (ml === 0) normals = [[0, 0, 1]];            // p_z  → z = 0 (xy plane)
      else if (ml === 1) normals = [[1, 0, 0]];       // p_x  → x = 0 (yz plane)
      else if (ml === -1) normals = [[0, 1, 0]];      // p_y  → y = 0 (xz plane)
    } else if (l === 2) {
      if (ml === 2) normals = [[0, 1, 0], [1, 0, 0]];          // d_xy    → y=0 & x=0
      else if (ml === -2) normals = [[-1, 1, 0], [1, 1, 0]];   // d_x²−y² → y=x & y=−x (45°, contain z)
      else if (ml === 1) normals = [[0, 0, 1], [1, 0, 0]];     // d_xz    → z=0 & x=0
      else if (ml === -1) normals = [[0, 0, 1], [0, 1, 0]];    // d_yz    → z=0 & y=0
      // ml === 0 (d_z²) has nodal cones, not planes — handled by <NodalCones>.
    }
    const up = new THREE.Vector3(0, 0, 1);
    return normals.map((nrm) => {
      const q = new THREE.Quaternion().setFromUnitVectors(
        up, new THREE.Vector3(nrm[0], nrm[1], nrm[2]).normalize(),
      );
      const e = new THREE.Euler().setFromQuaternion(q);
      return [e.x, e.y, e.z] as [number, number, number];
    });
  }, [l, ml]);

  const s = bounds * 1.8;
  return (
    <>
      {rotations.map((rot, i) => (
        <mesh key={i} rotation={rot}>
          <planeGeometry args={[s, s]} />
          {/* sim-lint-ok — amber is a nodal-plane DATA colour, not chrome */}
          <meshBasicMaterial color={AMBER} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
          <Edges color={AMBER} />
        </mesh>
      ))}
    </>
  );
}

// d_z² has NO nodal plane — its angular node is a pair of nodal CONES. The
// angular part ∝ (3cos²θ − 1) vanishes at 3cos²θ = 1 → θ ≈ 54.7° (and its
// mirror ≈ 125.3°) from the z-axis: two cones meeting apex-to-apex at the
// nucleus. Built as two open cones with apex at the origin, opening along ±z.
function coneAlongZ(h: number, r: number, up: boolean): THREE.ConeGeometry {
  const g = new THREE.ConeGeometry(r, h, 48, 1, true); // apex +y, base −y, open
  g.translate(0, -h / 2, 0);                            // apex → origin, opens −y
  g.rotateX(up ? -Math.PI / 2 : Math.PI / 2);           // −y → +z (up) or −z (down)
  return g;
}

function NodalCones({ bounds }: { bounds: number }) {
  const cones = useMemo(() => {
    const alpha = Math.acos(1 / Math.sqrt(3)); // ≈ 54.7° — the physical node angle
    // Keep the angle exact but the cones COMPACT: sized to sit within the cloud
    // rather than sprawling past it (they used to be ~1.8× bounds wide and
    // buried the electron cloud). Height 0.45× bounds ⇒ base radius ~0.64×.
    const h = bounds * 0.45;
    const r = h * Math.tan(alpha);
    return [coneAlongZ(h, r, true), coneAlongZ(h, r, false)];
  }, [bounds]);
  return (
    <>
      {cones.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          {/* sim-lint-ok — amber nodal-cone surface (data, not chrome); low
              opacity so the electron cloud reads clearly through it */}
          <meshBasicMaterial color={AMBER} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function makeAxisLabel(text: string, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.font = 'bold 34px sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 34);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), depthWrite: false }));
  return sprite;
}

// X/Y/Z = red/green/blue — a universal DATA convention, sim-lint-ok.
function ColoredAxes({ bounds }: { bounds: number }) {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const len = bounds * 0.9;
    const helper = new THREE.AxesHelper(len);
    const colors = (helper.geometry as THREE.BufferGeometry).attributes.color as THREE.BufferAttribute;
    const rx = new THREE.Color(0xef4444), gy = new THREE.Color(0x22c55e), bz = new THREE.Color(0x3b82f6);
    colors.setXYZ(0, rx.r, rx.g, rx.b); colors.setXYZ(1, rx.r, rx.g, rx.b);
    colors.setXYZ(2, gy.r, gy.g, gy.b); colors.setXYZ(3, gy.r, gy.g, gy.b);
    colors.setXYZ(4, bz.r, bz.g, bz.b); colors.setXYZ(5, bz.r, bz.g, bz.b);
    g.add(helper);
    const lx = makeAxisLabel('X', '#ef4444'); lx.position.set(len + bounds * 0.08, 0, 0); lx.scale.setScalar(bounds * 0.12);
    const ly = makeAxisLabel('Y', '#22c55e'); ly.position.set(0, len + bounds * 0.08, 0); ly.scale.setScalar(bounds * 0.12);
    const lz = makeAxisLabel('Z', '#3b82f6'); lz.position.set(0, 0, len + bounds * 0.08); lz.scale.setScalar(bounds * 0.12);
    g.add(lx, ly, lz);
    return g;
  }, [bounds]);
  return <primitive object={group} />;
}

function CameraRig({ bounds }: { bounds: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(bounds * 2.0, bounds * 1.4, bounds * 2.0);
    camera.updateProjectionMatrix();
  }, [bounds, camera]);
  return null;
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center text-center px-4">
      <p className="text-[11px]" style={{ color: TEXT.ghost }}>3D view unavailable on this device.</p>
    </div>
  );
}

function Scene({ n, l, ml, showNodes }: OrbState & { showNodes: boolean }) {
  const bounds = boundsFor(n);
  return (
    <Canvas camera={{ position: [bounds * 2, bounds * 1.4, bounds * 2], fov: 45, far: 2000 }} style={{ width: '100%', height: '100%' }}>
      <CameraRig bounds={bounds} />
      <ColoredAxes bounds={bounds} />
      <mesh>
        <sphereGeometry args={[bounds * 0.012, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <OrbitalCloud n={n} l={l} ml={ml} />
      {showNodes && (l === 2 && ml === 0
        ? <NodalCones bounds={bounds} />
        : <NodalPlanes l={l} ml={ml} bounds={bounds} />)}
      {/* No auto-rotate — opens on a clear, steady 3/4 view; user can drag to rotate. */}
      <OrbitControls enableDamping dampingFactor={0.05} enablePan={false} />
    </Canvas>
  );
}

/* ── 2D curves (hand-rolled SVG — no chart library) ─────────────────────── */

const GW = 440, GH = 160;
const GPAD = { top: 12, right: 14, bottom: 26, left: 48 };
const GCW = GW - GPAD.left - GPAD.right;
const GCH = GH - GPAD.top - GPAD.bottom;

// Compact numeric tick label — no exponential (workflow §2); handles the tiny
// density values (~0.002) and the O(1) radial-distribution values alike.
function fmtTick(v: number): string {
  if (!v) return '0';
  return String(Number(v.toPrecision(2)));
}

interface PlotInfo { data: { r: number; density: number; radial: number }[]; peakR: number; maxR: number }

function plotData(n: number, l: number): PlotInfo {
  const maxR = Math.max(30, n * n * 2.5);
  const data: PlotInfo['data'] = [];
  let peakR = 0, peakVal = 0;
  for (let r = 0.05; r <= maxR; r += maxR / 320) {
    const Rr = radialWavefunction(n, l, r);
    const density = Rr * Rr;
    const radial = 4 * Math.PI * r * r * density;
    if (radial > peakVal) { peakVal = radial; peakR = r; }
    data.push({ r, density, radial });
  }
  return { data, peakR, maxR };
}

function pathFor(info: PlotInfo, key: 'density' | 'radial', maxV: number, domainR: number): string {
  // NB: no top clamp — for the density 'reveal' scale the near-nucleus cusp
  // deliberately runs off the top of the frame (clipped by the SVG viewport),
  // exactly the schematic textbook shape.
  return info.data
    .map((p, i) => {
      const x = GPAD.left + (p.r / domainR) * GCW;
      const y = GPAD.top + GCH - (p[key] / maxV) * GCH * 0.9;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

// For s-orbital density, R(r)² has a huge near-nucleus cusp that flattens the
// outer node structure to nothing when you scale to the global max. Instead we
// scale to the tallest feature AFTER the first radial node (the first local
// minimum), so the outer humps fill the frame and the zero-touches (nodes) are
// clearly visible — the way textbooks draw it. For l ≥ 1 (no cusp) this reduces
// to the ordinary max, so those curves are unaffected.
function densityDisplayMax(info: PlotInfo): number {
  const d = info.data;
  let firstMin = 0;
  for (let i = 1; i < d.length - 1; i++) {
    if (d[i].density <= d[i - 1].density && d[i].density <= d[i + 1].density) { firstMin = i; break; }
  }
  let m = 1e-12;
  for (let i = firstMin; i < d.length; i++) m = Math.max(m, d[i].density);
  return m;
}

function Curve({
  title, unit, curKey, scaleMode, current, compare, domainR,
}: {
  title: string; unit: string; curKey: 'density' | 'radial';
  scaleMode: 'reveal' | 'normal';
  current: PlotInfo; compare: PlotInfo | null; domainR: number;
}) {
  // REVEAL_HEADROOM > 1 scales the axis a bit taller than the outer hump so the
  // revealed hump sits around 60% of the frame (textbook proportion) instead of
  // nearly touching the top; the near-nucleus cusp still runs off-frame.
  const REVEAL_HEADROOM = 1.5;
  const maxV = scaleMode === 'reveal'
    ? REVEAL_HEADROOM * Math.max(densityDisplayMax(current), compare ? densityDisplayMax(compare) : 0, 1e-12)
    : Math.max(
        ...current.data.map((p) => p[curKey]),
        ...(compare ? compare.data.map((p) => p[curKey]) : [0]),
        1e-12,
      );
  return (
    <div>
      <div className="text-base font-bold mb-2" style={{ color: TEXT.primary }}>
        {title} <span style={{ color: TEXT.ghost, fontWeight: 500 }}>({unit})</span>
      </div>
      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height={GH} style={{ display: 'block', overflow: 'hidden' }}>
        {/* y-axis + ticks (0, half, max) */}
        <line x1={GPAD.left} y1={GPAD.top} x2={GPAD.left} y2={GPAD.top + GCH} stroke={BORDER.card} strokeWidth={1} />
        {[0, 0.5, 1].map((frac) => {
          const y = GPAD.top + GCH - frac * 0.9 * GCH;
          return (
            <g key={frac}>
              <line x1={GPAD.left - 4} y1={y} x2={GPAD.left} y2={y} stroke={BORDER.card} strokeWidth={1} />
              <text x={GPAD.left - 6} y={y + 3} fontSize={10} fill={TEXT.ghost} textAnchor="end">{fmtTick(frac * maxV)}</text>
            </g>
          );
        })}
        {/* x-axis (baseline) */}
        <line x1={GPAD.left} y1={GPAD.top + GCH} x2={GPAD.left + GCW} y2={GPAD.top + GCH} stroke={BORDER.card} strokeWidth={1} />
        {compare && <path d={pathFor(compare, curKey, maxV, domainR)} fill="none" stroke={GREEN} strokeWidth={2} opacity={0.9} />}
        <path d={pathFor(current, curKey, maxV, domainR)} fill="none" stroke={ACCENT} strokeWidth={2} />
        <text x={GPAD.left + GCW} y={GH - 6} fontSize={10} fill={TEXT.ghost} textAnchor="end">{Math.round(domainR)} a₀</text>
      </svg>
    </div>
  );
}

/* ── Stat card (analysis) ───────────────────────────────────────────────── */

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: TEXT.ghost }}>{label}</div>
      <div className="text-lg font-bold tabular-nums" style={{ color: ACCENT }}>{value}</div>
      {sub != null && <div className="text-[11px] mt-0.5" style={{ color: GREEN }}>{sub}</div>}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function OrbitalCloudGraphSim() {
  const [orb, setOrb] = useState<OrbState>({ n: 3, l: 2, ml: 2 });
  const [compareOn, setCompareOn] = useState(false);
  const [cmp, setCmp] = useState<OrbState>({ n: 4, l: 0, ml: 0 });
  const [showNodes, setShowNodes] = useState(true);

  const name = orbitalName(orb.n, orb.l, orb.ml);
  const cmpName = orbitalName(cmp.n, cmp.l, cmp.ml);
  const radialNodes = orb.n - orb.l - 1;
  const angularNodes = orb.l;
  const totalNodes = orb.n - 1;
  const isDzSquared = orb.l === 2 && orb.ml === 0;
  const nodalLabel = isDzSquared ? 'Nodal Cones' : 'Nodal Planes';

  const curInfo = useMemo(() => plotData(orb.n, orb.l), [orb.n, orb.l]);
  const cmpInfo = useMemo(() => plotData(cmp.n, cmp.l), [cmp.n, cmp.l]);
  const domainR = Math.max(curInfo.maxR, compareOn ? cmpInfo.maxR : 0);

  const pillActive = (p: OrbState) => p.n === orb.n && p.l === orb.l;

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: TEXT.primary, borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div className="mb-5 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Atomic <span style={{ color: ACCENT }}>Orbital Lab</span>
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: TEXT.muted }}>
            Explore electron density &amp; probability distribution
          </p>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest pt-1" style={{ color: TEXT.ghost }}>
          Atomic Model
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ── LEFT: tabs + pills + 3D ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-6 text-sm font-bold" style={{ borderBottom: `1px solid ${BORDER.divider}` }}>
            {([['single', 'Analyze Single'], ['compare', 'Compare']] as const).map(([key, label]) => {
              const active = (key === 'compare') === compareOn;
              return (
                <button key={key} onClick={() => setCompareOn(key === 'compare')}
                  className="pb-2 transition-colors" style={{ background: 'none', outline: 'none',
                    color: active ? ACCENT : TEXT.secondary,
                    borderBottom: `2px solid ${active ? ACCENT : 'transparent'}`, marginBottom: -1 }}>
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {PILLS.map((p) => {
              const active = pillActive(p);
              return (
                <button key={p.label} onClick={() => setOrb({ n: p.n, l: p.l, ml: p.ml })}
                  className="px-4 py-1.5 rounded-full text-[13px] font-bold transition-all"
                  style={{
                    background: active ? 'rgba(196,181,253,0.14)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(196,181,253,0.45)' : 'rgba(255,255,255,0.08)'}`,
                    color: active ? ACCENT : TEXT.secondary,
                  }}>
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* d-orbital shape selector — the three shapes students study: the
              between-axes cloverleaf (d_xy), the along-axes cloverleaf
              (d_x²−y²), and the unique dumbbell+torus (d_z², nodal cones). */}
          {orb.l === 2 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest mr-1" style={{ color: TEXT.ghost }}>d-orbital shape:</span>
              {[{ ml: 2, label: 'd_xy' }, { ml: -2, label: 'd_x²−y²' }, { ml: 0, label: 'd_z²' }].map((v) => {
                const active = orb.ml === v.ml;
                return (
                  <button key={v.ml} onClick={() => setOrb({ ...orb, ml: v.ml })}
                    className="px-3 py-1 rounded-full text-[12px] font-semibold transition-all"
                    style={{
                      background: active ? 'rgba(196,181,253,0.14)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(196,181,253,0.45)' : 'rgba(255,255,255,0.08)'}`,
                      color: active ? ACCENT : TEXT.secondary,
                    }}>
                    {v.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER.card}`, background: 'rgba(255,255,255,0.02)' }}>
            <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: `1px solid ${BORDER.divider}` }}>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: TEXT.ghost }}>3D Node View</div>
                <div className="text-lg font-bold" style={{ color: ACCENT }}>{name}</div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded"
                style={{ background: 'rgba(245,158,11,0.10)', border: `1px solid rgba(245,158,11,0.35)` }}>
                <input type="checkbox" checked={showNodes} onChange={(e) => setShowNodes(e.target.checked)}
                  style={{ accentColor: AMBER, width: 15, height: 15, cursor: 'pointer' }} />
                {/* sim-lint-ok — amber label pairs with the amber nodal surfaces (data) */}
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: AMBER }}>{nodalLabel}</span>
              </label>
            </div>
            <div style={{ background: SIM_CANVAS_BG, height: 460 }}>
              <SceneBoundary fallback={<SceneFallback />}>
                <Suspense fallback={<SceneFallback />}>
                  <Scene n={orb.n} l={orb.l} ml={orb.ml} showNodes={showNodes} />
                </Suspense>
              </SceneBoundary>
            </div>
          </div>
          <div className="text-[10px] italic" style={{ color: TEXT.ghost }}>Scroll to zoom · drag to rotate.</div>
        </div>

        {/* ── RIGHT: probability graphs ───────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: TEXT.secondary }}>
            Probability Distribution{compareOn ? ' & Comparison' : ''}
          </div>

          {/* Compare legend / selector */}
          {compareOn && (
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1.5"><span style={{ width: 12, height: 12, borderRadius: 6, background: ACCENT, display: 'inline-block' }} /> {name}</span>
              <span className="flex items-center gap-1.5">
                {/* sim-lint-ok — green marks the compare series (data) */}
                <span style={{ width: 12, height: 12, borderRadius: 6, background: GREEN, display: 'inline-block' }} />
                <select value={`${cmp.n},${cmp.l},${cmp.ml}`}
                  onChange={(e) => { const [n, l, ml] = e.target.value.split(',').map(Number); setCmp({ n, l, ml }); }}
                  className="rounded px-2 py-0.5 text-[12px] font-bold"
                  style={{ background: 'rgba(16,185,129,0.10)', border: `1px solid rgba(16,185,129,0.4)`, color: GREEN, cursor: 'pointer' }}>
                  {COMPARE_OPTIONS.map((o) => <option key={o.label} value={`${o.n},${o.l},${o.ml}`}>{o.label}</option>)}
                </select>
              </span>
            </div>
          )}

          <Curve title="Probability Density" unit="R(r)²" curKey="density" scaleMode="reveal" current={curInfo} compare={compareOn ? cmpInfo : null} domainR={domainR} />
          <Curve title="Radial Probability Distribution" unit="4πr²R(r)²" curKey="radial" scaleMode="normal" current={curInfo} compare={compareOn ? cmpInfo : null} domainR={domainR} />
        </div>
      </div>

      {/* ── Analysis band — full width below both columns (uses the space that
          the removed formula freed up; keeps peak / nodes / interpretation) ─── */}
      <div className="mt-6 rounded-2xl p-4 md:p-5" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER.card}` }}>
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TEXT.ghost }}>
            Analysis · <span style={{ color: ACCENT }}>{name}</span>{compareOn && <> vs <span style={{ color: GREEN }}>{cmpName}</span></>}
          </div>
          <div className="text-[12px]" style={{ color: TEXT.ghost }}>n = {orb.n} · l = {orb.l}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Peak (radial)" value={`${curInfo.peakR.toFixed(1)} a₀`} sub={compareOn ? `${cmpName}: ${cmpInfo.peakR.toFixed(1)} a₀` : undefined} />
          <Stat label="Radial nodes" value={radialNodes} sub={compareOn ? `${cmpName}: ${cmp.n - cmp.l - 1}` : undefined} />
          <Stat label="Angular nodes" value={angularNodes} sub={compareOn ? `${cmpName}: ${cmp.l}` : undefined} />
          <Stat label="Total nodes" value={totalNodes} sub={compareOn ? `${cmpName}: ${cmp.n - 1}` : undefined} />
        </div>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: TEXT.secondary }}>
          <span className="font-semibold" style={{ color: TEXT.primary }}>Reading it: </span>
          the most probable radius (the peak of the radial-distribution curve) shifts outward with higher n.
          Radial nodes are spherical shells where R(r) = 0 — the density curve touches zero and rises again.
          Angular nodes are the {nodalLabel.toLowerCase()} through the nucleus ({angularNodes} for this orbital).
        </p>
      </div>
    </div>
  );
}
