'use client';

/**
 * QuantumOrbital3DViewer — interactive 3D quantum-number / orbital-shape explorer.
 *
 * Rendered as an INJECTED simulator (id: 'quantum-orbital-3d') via
 * ExtraSimulatorsProvider, exactly like 'heart-3d' / 'atomic-models'. A page
 * references it with a normal `simulation` block:
 * { type: 'simulation', simulation_id: 'quantum-orbital-3d' }. Zero-prop and
 * self-contained, matching the simulator contract in
 * packages/book-renderer/blocks/SimulationBlockRenderer.tsx.
 *
 * Lets a student pick n, l, m_l with the same constraints taught in NCERT
 * Class 11 Ch.2 "Structure of Atom" (l = 0..n-1, m_l = -l..+l) and see the
 * live electron-density point cloud for that orbital, alongside the 2n²/
 * 2(2l+1) capacity formulas and the shell → subshell → orbital hierarchy.
 * Sits next to the existing SVG-based `quantum-number-explorer` sim on the
 * quantum-mechanical-model page — this one adds a genuine rotatable 3D view.
 *
 * Stack: three + @react-three/fiber + @react-three/drei (already in apps/student).
 *
 * Palette: kept as its own dedicated blue/green/amber (n/l/m_l) colour coding
 * per founder decision (2026-07-22) rather than the book's default indigo/
 * emerald tokens — this sim's whole UI logic is built around that 3-colour
 * mapping (shell=blue, subshell=green, orbital=amber), so restyling to a
 * single indigo accent would erase the visual grammar that ties the selector
 * buttons to the axis colours and the hierarchy tree.
 */

import { Suspense, useMemo, useState, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

const MAX_N = 5;
const L_LETTERS = ['s', 'p', 'd', 'f', 'g'];

const C = {
  root: '#030408',
  canvasBg: 'radial-gradient(circle at center, #0a0f1c 0%, #030408 70%)',
  panelBg: 'rgba(5, 8, 16, 0.6)',
  border: 'rgba(51, 65, 85, 0.4)',
  textDim: '#94a3b8',
  blue: '#3b82f6',
  blueLt: '#60a5fa',
  green: '#10b981',
  greenLt: '#34d399',
  amber: '#fbbf24',
};

// NCERT Class 11 Ch.2 "Structure of Atom": chemist's real (angular-part)
// orbital shapes — dumbbell p, cloverleaf d, doughnut+dumbbell dz². Same
// functional forms as packages/book-renderer/blocks/simulations/OrbitalShapeExplorerSim.tsx.
function getAngularProbability(nx: number, ny: number, nz: number, l: number, ml: number): number {
  if (l === 0) return 1.0;
  if (l === 1) {
    if (ml === -1) return ny * ny;
    if (ml === 0) return nz * nz;
    if (ml === 1) return nx * nx;
  }
  if (l === 2) {
    if (ml === -2) return 4 * nx * nx * ny * ny;
    if (ml === -1) return 4 * ny * ny * nz * nz;
    if (ml === 0) return Math.pow(3 * nz * nz - 1, 2) / 4;
    if (ml === 1) return 4 * nx * nx * nz * nz;
    if (ml === 2) return Math.pow(nx * nx - ny * ny, 2);
  }
  // f/g fallback — lobed approximation, same shape family the reference build used.
  const lobes = l === 3 ? 6 : 8;
  const angleOffset = (ml * Math.PI) / (lobes / 2);
  const theta = Math.atan2(ny, nx) + angleOffset;
  return Math.pow(Math.cos((lobes / 2) * theta), 2) * Math.pow(Math.cos((nz * Math.PI) / 2), 2);
}

function getOrbitalSubscript(l: number, ml: number): string {
  if (l === 0) return '';
  if (l === 1) {
    if (ml === -1) return 'y';
    if (ml === 0) return 'z';
    if (ml === 1) return 'x';
  }
  if (l === 2) {
    if (ml === -2) return 'xy';
    if (ml === -1) return 'yz';
    if (ml === 0) return 'z²';
    if (ml === 1) return 'xz';
    if (ml === 2) return 'x²-y²';
  }
  return `(${ml > 0 ? '+' + ml : ml})`;
}

// Point count/attempt budget tuned down from the reference build (60,000 pts /
// 250x attempts) to stay main-thread-friendly on mid-range phones — shape
// fidelity is unaffected since rejection sampling just yields fewer accepted
// points per lobe, not a different distribution.
// p/d orbitals (and higher n generally) spread their probability density over
// a much larger volume than an s orbital's tight exponential cloud, so the
// same point budget reads visibly sparser for them — bumped up from the
// original perf-driven 22,000 after founder feedback that 3d/3p/4p/4d looked
// too faint on a large/bright classroom screen.
const NUM_POINTS = 32000;
const ATTEMPT_MULTIPLIER = 180;

function generateOrbitalPoints(n: number, l: number, ml: number): Float32Array {
  const positions = new Float32Array(NUM_POINTS * 3);
  // The sampling cube's half-width must scale with l too, not just n — the
  // radial peak sits farther from the nucleus for higher l (peak at
  // normalizedR = l), so a box sized only off n was clipping real,
  // non-negligible density for p/d/f orbitals into a hard, visible sphere.
  // No `r <= scale` gate is applied below — this cube only bounds the
  // uniform proposal region; the natural exponential decay (computed with
  // enough headroom past the peak) does the actual tapering, so orbitals
  // fade into their lobe shapes instead of getting clipped by an invisible ball.
  const scale = (l + 6) * n * 0.7;
  const maxAttempts = NUM_POINTS * ATTEMPT_MULTIPLIER;
  let i = 0;
  let attempts = 0;

  while (i < NUM_POINTS && attempts < maxAttempts) {
    const x = (Math.random() - 0.5) * 2 * scale;
    const y = (Math.random() - 0.5) * 2 * scale;
    const z = (Math.random() - 0.5) * 2 * scale;
    const r = Math.sqrt(x * x + y * y + z * z);

    if (r > 0) {
      const normalizedR = r / (n * 0.7);
      let radialProb: number;
      if (l === 0) {
        radialProb = Math.exp(-2.0 * normalizedR);
      } else {
        const peak = l;
        radialProb = Math.pow(normalizedR / peak, 2 * l) * Math.exp(-2.0 * (normalizedR - peak));
      }
      const angularProb = getAngularProbability(x / r, y / r, z / r, l, ml);
      const visualPinch = Math.pow(angularProb, 1.5);
      const totalProb = radialProb * visualPinch;

      if (Math.random() < totalProb) {
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        i++;
      }
    }
    attempts++;
  }

  return positions.subarray(0, i * 3) as Float32Array;
}

function OrbitalCloud({ n, l, ml }: { n: number; l: number; ml: number }) {
  const positions = useMemo(() => generateOrbitalPoints(n, l, ml), [n, l, ml]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={C.amber}
        size={0.1}
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ShellRings({ n }: { n: number }) {
  const ringRadius = n * 2.5;
  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(theta) * ringRadius, Math.sin(theta) * ringRadius, 0]);
    }
    return pts;
  }, [ringRadius]);

  return (
    <>
      <Line points={ringPoints} color={C.blue} transparent opacity={0.15} />
      <Line points={ringPoints} color={C.blue} transparent opacity={0.15} rotation={[Math.PI / 2, 0, 0]} />
      <Line points={ringPoints} color={C.blue} transparent opacity={0.15} rotation={[0, Math.PI / 2, 0]} />
    </>
  );
}

// Axis labels are drawn onto a canvas texture and shown as sprites — NOT
// drei's <Text> (troika-three-text), which fetches its font over the network
// on first use. That fetch stalls the single Suspense boundary wrapping the
// whole scene indefinitely on a slow/blocked connection, which blanks out
// the ENTIRE canvas (axes, nucleus, orbital cloud — not just the labels).
// A canvas-drawn sprite has no such dependency.
function createAxisLabelSprite(text: string, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 34);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false }));
  sprite.scale.set(1.8, 1.8, 1.8);
  return sprite;
}

function ColoredAxes() {
  const axesHelper = useMemo(() => {
    const helper = new THREE.AxesHelper(12);
    const geom = helper.geometry as THREE.BufferGeometry;
    const colors = geom.attributes.color as THREE.BufferAttribute;
    const colorX = new THREE.Color(0xef4444);
    const colorY = new THREE.Color(0x10b981);
    const colorZ = new THREE.Color(0x3b82f6);
    colors.setXYZ(0, colorX.r, colorX.g, colorX.b);
    colors.setXYZ(1, colorX.r, colorX.g, colorX.b);
    colors.setXYZ(2, colorY.r, colorY.g, colorY.b);
    colors.setXYZ(3, colorY.r, colorY.g, colorY.b);
    colors.setXYZ(4, colorZ.r, colorZ.g, colorZ.b);
    colors.setXYZ(5, colorZ.r, colorZ.g, colorZ.b);
    return helper;
  }, []);

  const labelX = useMemo(() => createAxisLabelSprite('X', '#ef4444'), []);
  const labelY = useMemo(() => createAxisLabelSprite('Y', '#10b981'), []);
  const labelZ = useMemo(() => createAxisLabelSprite('Z', '#3b82f6'), []);

  return (
    <>
      <primitive object={axesHelper} />
      <primitive object={labelX} position={[13, 0, 0]} />
      <primitive object={labelY} position={[0, 13, 0]} />
      <primitive object={labelZ} position={[0, 0, 13]} />
    </>
  );
}

function OrbitalScene({ n, l, ml }: { n: number; l: number; ml: number }) {
  return (
    <>
      <ColoredAxes />
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <ShellRings n={n} />
      <OrbitalCloud n={n} l={l} ml={ml} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enablePan={false}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function SceneNotReady() {
  return (
    <div className="w-full h-full flex items-center justify-center text-center px-4">
      <p className="text-[11px]" style={{ color: C.textDim }}>
        The 3D view couldn&apos;t load on this device. Try reloading the page.
      </p>
    </div>
  );
}

function SelectBtn({
  active,
  activeColor,
  activeBorder,
  activeGlow,
  onClick,
  children,
}: {
  active: boolean;
  activeColor: string;
  activeBorder: string;
  activeGlow: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg font-medium flex items-center justify-center transition-all"
      style={{
        minWidth: '2.75rem',
        height: '2.75rem',
        fontSize: '0.9rem',
        background: active ? `${activeColor}26` : 'rgba(30, 41, 59, 0.4)',
        border: `1px solid ${active ? activeBorder : 'rgba(51, 65, 85, 0.6)'}`,
        color: active ? activeBorder : C.textDim,
        boxShadow: active ? `0 0 12px ${activeGlow}` : 'none',
      }}
    >
      {children}
    </button>
  );
}

export default function QuantumOrbital3DViewer() {
  const [n, setNRaw] = useState(1);
  const [l, setLRaw] = useState(0);
  const [ml, setMlRaw] = useState(0);

  const setN = (value: number) => {
    let nextL = l;
    let nextMl = ml;
    if (nextL >= value) nextL = value - 1;
    if (Math.abs(nextMl) > nextL) nextMl = nextMl > 0 ? nextL : -nextL;
    setNRaw(value);
    setLRaw(nextL);
    setMlRaw(nextMl);
  };
  const setL = (value: number) => {
    let nextMl = ml;
    if (Math.abs(nextMl) > value) nextMl = nextMl > 0 ? value : -value;
    setLRaw(value);
    setMlRaw(nextMl);
  };
  const setMl = (value: number) => setMlRaw(value);

  const subscript = getOrbitalSubscript(l, ml);
  const shellElectrons = 2 * Math.pow(n, 2);
  const subshellElectrons = (2 * l + 1) * 2;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.root, border: `1px solid ${C.border}` }}>
      {/* Header / controls */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between flex-wrap gap-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex flex-wrap gap-6 overflow-x-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-[10px]">
              <span className="text-slate-300 font-semibold tracking-wider uppercase">Principal (n)</span>
              <span className="text-[10px] font-semibold tracking-widest uppercase ml-2" style={{ color: C.blueLt }}>Shell</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: MAX_N }, (_, i) => i + 1).map((val) => (
                <SelectBtn key={val} active={val === n} activeColor={C.blue} activeBorder={C.blueLt} activeGlow="rgba(59,130,246,0.2)" onClick={() => setN(val)}>
                  {val}
                </SelectBtn>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-[10px]">
              <span className="text-slate-300 font-semibold tracking-wider uppercase">Azimuthal (l)</span>
              <span className="text-[10px] font-semibold tracking-widest uppercase ml-2" style={{ color: C.greenLt }}>Subshell</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: n }, (_, i) => i).map((val) => (
                <SelectBtn key={val} active={val === l} activeColor={C.green} activeBorder={C.greenLt} activeGlow="rgba(16,185,129,0.2)" onClick={() => setL(val)}>
                  <span className="flex items-center gap-1">
                    {val} <span className="text-[10px] opacity-70">({L_LETTERS[val]})</span>
                  </span>
                </SelectBtn>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-[10px]">
              <span className="text-slate-300 font-semibold tracking-wider uppercase">
                Magnetic (m<sub>l</sub>)
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase ml-2" style={{ color: C.amber }}>Orbital</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 2 * l + 1 }, (_, i) => i - l).map((val) => (
                <SelectBtn key={val} active={val === ml} activeColor={C.amber} activeBorder={C.amber} activeGlow="rgba(251,191,36,0.2)" onClick={() => setMl(val)}>
                  {val > 0 ? `+${val}` : val}
                </SelectBtn>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.textDim }}>Current Focus</span>
          <div className="text-4xl font-light text-slate-100">
            {n}
            {L_LETTERS[l]}
            {subscript && <sub className="text-xl ml-1 opacity-70">{subscript}</sub>}
          </div>
        </div>
      </div>

      {/* Canvas + HUD panels */}
      <div className="grid gap-3 p-3 md:grid-cols-[1fr_260px]">
        <div className="relative rounded-xl overflow-hidden" style={{ background: C.canvasBg, aspectRatio: '4 / 3', minHeight: 340 }}>
          <SceneBoundary fallback={<SceneNotReady />}>
            <Canvas dpr={[1, 2]} camera={{ position: [22, 16, 28], fov: 45 }} gl={{ antialias: true, alpha: true }}>
              <Suspense fallback={null}>
                <OrbitalScene n={n} l={l} ml={ml} />
              </Suspense>
            </Canvas>
          </SceneBoundary>
        </div>

        <div className="flex flex-col gap-3">
          {/* Capacity rules */}
          <div className="rounded-lg p-4" style={{ background: C.panelBg, border: `1px solid ${C.border}` }}>
            <h3 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: C.textDim }}>Capacity Rules</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-end pb-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div className="text-slate-300 text-[13px] font-medium">Shell n={n}</div>
                  <div className="text-[10px]" style={{ color: C.textDim }}>Formula: 2n²</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light" style={{ color: C.blueLt }}>{shellElectrons}</div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.textDim }}>Max e⁻</div>
                </div>
              </div>
              <div className="flex justify-between items-end pb-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div className="text-slate-300 text-[13px] font-medium">
                    Subshell <span style={{ color: C.greenLt }}>{L_LETTERS[l]}</span>
                  </div>
                  <div className="text-[10px]" style={{ color: C.textDim }}>Formula: 2(2l+1)</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light" style={{ color: C.greenLt }}>{subshellElectrons}</div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.textDim }}>Max e⁻</div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-slate-300 text-[13px] font-medium">Orbital</div>
                  <div className="text-[10px]" style={{ color: C.textDim }}>Pauli Principle</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light" style={{ color: C.amber }}>2</div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.textDim }}>Max e⁻</div>
                </div>
              </div>
            </div>
          </div>

          {/* Structure tree */}
          <div className="rounded-lg p-4" style={{ background: C.panelBg, border: `1px solid ${C.border}` }}>
            <h3 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: C.textDim }}>Structure View</h3>
            <div className="text-[12px] font-medium" style={{ color: C.textDim }}>
              <div className="text-slate-200 font-bold mb-2">Atom</div>
              <div
                className="rounded px-2.5 py-1.5 mb-1"
                style={{ borderLeft: `2px solid ${C.blue}`, background: 'rgba(59,130,246,0.06)' }}
              >
                <span className="font-medium" style={{ color: C.blueLt }}>Shell n = {n}</span>
              </div>
              {Array.from({ length: n }, (_, currL) => currL).map((currL) => {
                const isLActive = currL === l;
                return (
                  <div key={currL}>
                    <div
                      className="rounded px-2.5 py-1.5 mb-1 ml-3"
                      style={{
                        borderLeft: `2px solid ${isLActive ? C.green : 'transparent'}`,
                        background: isLActive ? 'rgba(16,185,129,0.08)' : 'transparent',
                        opacity: isLActive ? 1 : 0.6,
                      }}
                    >
                      <span style={{ color: isLActive ? C.greenLt : C.textDim, fontWeight: isLActive ? 600 : 400 }}>
                        Subshell l = {currL} ({L_LETTERS[currL]})
                      </span>
                    </div>
                    {isLActive &&
                      Array.from({ length: 2 * currL + 1 }, (_, i) => i - currL).map((currMl) => {
                        const isMlActive = currMl === ml;
                        return (
                          <div
                            key={currMl}
                            className="rounded px-2.5 py-1.5 mb-1 ml-6"
                            style={{
                              borderLeft: `2px solid ${isMlActive ? C.amber : 'transparent'}`,
                              background: isMlActive ? 'rgba(251,191,36,0.08)' : 'transparent',
                              opacity: isMlActive ? 1 : 0.6,
                            }}
                          >
                            <span style={{ color: isMlActive ? C.amber : C.textDim, fontWeight: isMlActive ? 700 : 400 }}>
                              Orbital m<sub>l</sub> = {currMl > 0 ? `+${currMl}` : currMl}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
