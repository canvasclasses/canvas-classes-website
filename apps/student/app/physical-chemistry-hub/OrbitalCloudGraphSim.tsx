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

import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import * as THREE from 'three';
import katex from 'katex';
import 'katex/dist/katex.min.css';
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
  const maxProb = maxRadDens * 1.1;

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
    const total = rProb * aProb;

    if (Math.random() * maxProb < Math.pow(total, 0.85)) {
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

// Nodal planes for p / d orbitals (in the canonical orientations above).
function NodalPlanes({ l, ml, bounds }: { l: number; ml: number; bounds: number }) {
  const rotations = useMemo<[number, number, number][]>(() => {
    if (l === 1) {
      if (ml === 0) return [[0, 0, 0]];                 // p_z → xy plane
      if (ml === 1) return [[0, Math.PI / 2, 0]];       // p_x → yz plane
      if (ml === -1) return [[Math.PI / 2, 0, 0]];      // p_y → xz plane
    }
    if (l === 2) {
      if (ml === 2) return [[Math.PI / 2, 0, 0], [0, Math.PI / 2, 0]];          // d_xy
      if (ml === -2) return [[0, Math.PI / 2, Math.PI / 4], [0, Math.PI / 2, -Math.PI / 4]]; // d_x²-y²
      if (ml === 1) return [[0, 0, 0], [0, Math.PI / 2, 0]];                    // d_xz
      if (ml === -1) return [[0, 0, 0], [Math.PI / 2, 0, 0]];                   // d_yz
      // ml === 0 (d_z²) has nodal cones, not planes — none drawn.
    }
    return [];
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
    <Canvas camera={{ position: [bounds * 2, bounds * 1.4, bounds * 2], fov: 45, far: 2000 }} style={{ minHeight: 460 }}>
      <CameraRig bounds={bounds} />
      <ColoredAxes bounds={bounds} />
      <mesh>
        <sphereGeometry args={[bounds * 0.012, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <OrbitalCloud n={n} l={l} ml={ml} />
      {showNodes && <NodalPlanes l={l} ml={ml} bounds={bounds} />}
      <OrbitControls enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} enablePan={false} />
    </Canvas>
  );
}

/* ── 2D curves (hand-rolled SVG — no chart library) ─────────────────────── */

const GW = 420, GH = 150;
const GPAD = { top: 12, right: 16, bottom: 26, left: 16 };
const GCW = GW - GPAD.left - GPAD.right;
const GCH = GH - GPAD.top - GPAD.bottom;

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
  return info.data
    .map((p, i) => {
      const x = GPAD.left + (p.r / domainR) * GCW;
      const y = GPAD.top + GCH - (p[key] / maxV) * GCH * 0.9;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${Math.max(GPAD.top, y).toFixed(1)}`;
    })
    .join(' ');
}

function Curve({
  title, unit, curKey, current, compare, domainR,
}: {
  title: string; unit: string; curKey: 'density' | 'radial';
  current: PlotInfo; compare: PlotInfo | null; domainR: number;
}) {
  const maxV = Math.max(
    ...current.data.map((p) => p[curKey]),
    ...(compare ? compare.data.map((p) => p[curKey]) : [0]),
    1e-12,
  );
  return (
    <div>
      <div className="text-base font-bold mb-2" style={{ color: TEXT.primary }}>
        {title} <span style={{ color: TEXT.ghost, fontWeight: 500 }}>({unit})</span>
      </div>
      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height={GH} style={{ display: 'block' }}>
        <line x1={GPAD.left} y1={GPAD.top + GCH} x2={GPAD.left + GCW} y2={GPAD.top + GCH} stroke={BORDER.card} strokeWidth={1} />
        {compare && <path d={pathFor(compare, curKey, maxV, domainR)} fill="none" stroke={GREEN} strokeWidth={2} opacity={0.9} />}
        <path d={pathFor(current, curKey, maxV, domainR)} fill="none" stroke={ACCENT} strokeWidth={2} />
        <text x={GPAD.left} y={GH - 6} fontSize={10} fill={TEXT.ghost}>0</text>
        <text x={GPAD.left + GCW} y={GH - 6} fontSize={10} fill={TEXT.ghost} textAnchor="end">{Math.round(domainR)} a₀</text>
      </svg>
    </div>
  );
}

/* ── Formula (KaTeX) ────────────────────────────────────────────────────── */

function FormulaBlock({ n, l }: { n: number; l: number }) {
  const html = useMemo(() => {
    const radialNodes = n - l - 1;
    const latex =
      `R_{${n}${l}}(r) = \\sqrt{\\left(\\frac{2}{${n}a_0}\\right)^3 \\frac{${radialNodes}!}{2(${n})(${n + l})!}}\\; ` +
      `e^{-\\frac{r}{${n}a_0}} \\left(\\frac{2r}{${n}a_0}\\right)^{${l}} L_{${radialNodes}}^{${2 * l + 1}}\\!\\left(\\frac{2r}{${n}a_0}\\right)`;
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch {
      return '';
    }
  }, [n, l]);
  return (
    <div className="w-full overflow-x-auto text-center" style={{ color: TEXT.primary }}
      dangerouslySetInnerHTML={{ __html: html }} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {/* sim-lint-ok — amber label pairs with the amber nodal planes (data) */}
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: AMBER }}>Nodal Planes</span>
              </label>
            </div>
            <div style={{ background: SIM_CANVAS_BG, minHeight: 460 }}>
              <SceneBoundary fallback={<SceneFallback />}>
                <Suspense fallback={<SceneFallback />}>
                  <Scene n={orb.n} l={orb.l} ml={orb.ml} showNodes={showNodes} />
                </Suspense>
              </SceneBoundary>
            </div>
          </div>
          <div className="text-[10px] italic" style={{ color: TEXT.ghost }}>Scroll to zoom · drag to rotate.</div>
        </div>

        {/* ── RIGHT: focus + graphs + formula + analysis ──────────────────── */}
        <div className="flex flex-col gap-5">
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: TEXT.secondary }}>
            Probability Distribution{compareOn ? ' & Comparison' : ''}
          </div>

          {/* Focus chips */}
          <div className="flex flex-wrap gap-2 text-[12px]">
            {[['Orbital', name], ['n', String(orb.n)], ['l', String(orb.l)],
              ['Radial nodes', String(radialNodes)], ['Angular nodes', String(angularNodes)]].map(([k, v]) => (
              <div key={k} className="px-3 py-1.5 rounded flex gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}` }}>
                <span style={{ color: TEXT.ghost }}>{k}=</span><span className="font-bold" style={{ color: TEXT.primary }}>{v}</span>
              </div>
            ))}
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

          <Curve title="Probability Density" unit="R(r)²" curKey="density" current={curInfo} compare={compareOn ? cmpInfo : null} domainR={domainR} />
          <Curve title="Radial Probability Distribution" unit="4πr²R(r)²" curKey="radial" current={curInfo} compare={compareOn ? cmpInfo : null} domainR={domainR} />

          {/* Formula + analysis */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER.card}` }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: TEXT.ghost }}>The Formula</div>
            <FormulaBlock n={orb.n} l={orb.l} />

            <div className="text-[10px] font-semibold uppercase tracking-widest mt-5 mb-2" style={{ color: TEXT.ghost }}>Step-by-step analysis</div>
            <ol className="text-[13px] space-y-2 list-decimal list-inside" style={{ color: TEXT.secondary }}>
              <li>
                <span style={{ color: TEXT.ghost }}>Peak position: </span>
                <b style={{ color: ACCENT }}>{name}</b> ~{curInfo.peakR.toFixed(1)} a₀
                {compareOn && <> vs <b style={{ color: GREEN }}>{cmpName}</b> ~{cmpInfo.peakR.toFixed(1)} a₀</>}
                . The most probable radius shifts outward with higher n.
              </li>
              <li>
                <span style={{ color: TEXT.ghost }}>Nodes: </span>
                radial <b style={{ color: ACCENT }}>{radialNodes}</b>{compareOn && <> vs <b style={{ color: GREEN }}>{cmp.n - cmp.l - 1}</b></>},
                {' '}angular <b style={{ color: ACCENT }}>{angularNodes}</b>{compareOn && <> vs <b style={{ color: GREEN }}>{cmp.l}</b></>}.
              </li>
              <li><span style={{ color: TEXT.ghost }}>Interpretation: </span>higher quantum numbers spread the probability over a larger volume with more complex nodal structure.</li>
            </ol>

            <div className="mt-5 pt-4 flex justify-between items-end" style={{ borderTop: `1px solid ${BORDER.divider}` }}>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TEXT.ghost }}>Final value</div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: ACCENT }}>Nodes for {name}</div>
                <div className="text-[13px] mt-1 flex gap-2 justify-end tabular-nums" style={{ color: TEXT.secondary }}>
                  <span>Total: <b style={{ color: TEXT.primary }}>{totalNodes}</b></span><span style={{ color: TEXT.muted }}>|</span>
                  <span>Radial: <b style={{ color: TEXT.primary }}>{radialNodes}</b></span><span style={{ color: TEXT.muted }}>|</span>
                  <span>Angular: <b style={{ color: TEXT.primary }}>{angularNodes}</b></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
