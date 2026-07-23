'use client';

/**
 * Orbital Cloud + Graph Lab — a rotatable 3D probability cloud shown side by
 * side with its own probability-density and radial-distribution curves.
 *
 * WHY THIS SIM, GIVEN THE PAGE ALREADY HAS TWO ORBITAL SIMS:
 *   `orbital-shape-explorer` (above) shows the boundary-surface SHAPE as a
 *   static 2D diagram. `radial-distribution` (also above) lets a student
 *   overlay several orbitals' P(r) curves on one 2D chart. Neither shows a
 *   rotatable 3D cloud, and neither pairs the cloud with its own curves in
 *   one view. This sim is deliberately scoped to fill exactly that gap —
 *   ONE orbital at a time (not a multi-compare tool; `radial-distribution`
 *   already owns that job) — a "put it together in 3D" capstone.
 *
 * MATH: the closed-form radial wavefunctions R(r) below are the exact same
 * ones already cited and vetted in packages/book-renderer/blocks/simulations/
 * RadialDistributionSim.tsx (Griffiths QM Table 4.7; Atkins' Physical
 * Chemistry Table 9A.1; NCERT §2.6.4) — duplicated here (not imported) rather
 * than sharing a module, matching the existing precedent in this file set
 * (QuantumOrbital3DViewer.tsx documents doing the same for its angular
 * forms). Both files must therefore be kept numerically in sync if a formula
 * source is ever corrected.
 *
 * The 3D point cloud is Monte Carlo rejection sampling weighted by the EXACT
 * R(r)² (not the approximate exponential the sibling 3D viewer uses), times
 * a real angular form for the canonical orientation of each family (s, p_z,
 * d_z²) — the same functional forms as OrbitalShapeExplorerSim.tsx. Multiple
 * ml orientations per l are intentionally NOT offered here; that's already
 * `orbital-shape-explorer`'s job for the current page.
 *
 * ARCHITECTURE: lives in apps/student (not packages/book-renderer's internal
 * simulation registry) because it depends on @react-three/fiber / drei / three
 * — app-only deps, same reason QuantumOrbital3DViewer and AtomicModels live
 * here. Registered as an INJECTED simulator (id: 'orbital-cloud-graph') via
 * ExtraSimulatorsProvider — see apps/student/features/books/lib/extraSimulators.tsx.
 * Design tokens/components imported from the book-renderer package's public
 * `./simulations/_shared` export (not a relative path — this file is outside
 * that package).
 *
 * Academic source: NCERT Chemistry Class 11, Ch. 2 §2.6.2 (shapes) and
 * §2.6.4 (radial distribution).
 */

import { Suspense, useMemo, useState, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  ACCENT, ACCENT_2, TEXT, BORDER, SIM_CANVAS_BG,
  SimShell, SimHeader, SectionLabel,
} from '@canvas/book-renderer/simulations/_shared';

/* ── Orbital catalogue — same 6 orbitals + exact formulas as RadialDistributionSim ── */

type OrbitalId = '1s' | '2s' | '2p' | '3s' | '3p' | '3d';

interface OrbitalMeta { n: number; l: number; label: string }

const ORBITALS: Record<OrbitalId, OrbitalMeta> = {
  '1s': { n: 1, l: 0, label: '1s' },
  '2s': { n: 2, l: 0, label: '2s' },
  '2p': { n: 2, l: 1, label: '2p_z' },
  '3s': { n: 3, l: 0, label: '3s' },
  '3p': { n: 3, l: 1, label: '3p_z' },
  '3d': { n: 3, l: 2, label: '3d_z²' },
};
const ORBITAL_IDS: OrbitalId[] = ['1s', '2s', '2p', '3s', '3p', '3d'];

function radialWavefunction(id: OrbitalId, rho: number): number {
  switch (id) {
    case '1s': return 2 * Math.exp(-rho);
    case '2s': return (1 / Math.sqrt(8)) * (2 - rho) * Math.exp(-rho / 2);
    case '2p': return (1 / Math.sqrt(24)) * rho * Math.exp(-rho / 2);
    case '3s': return (2 / (81 * Math.sqrt(3))) * (27 - 18 * rho + 2 * rho * rho) * Math.exp(-rho / 3);
    case '3p': return (8 / (27 * Math.sqrt(6))) * (6 - rho) * rho * Math.exp(-rho / 3);
    case '3d': return (4 / (81 * Math.sqrt(30))) * rho * rho * Math.exp(-rho / 3);
  }
}

// Canonical-orientation angular part, squared (unnormalized — only the shape
// matters here since sampling is normalized against its own numeric max).
function angularSq(l: number, nz: number): number {
  if (l === 0) return 1;                        // s
  if (l === 1) return nz * nz;                   // p_z, dumbbell along z
  return Math.pow(3 * nz * nz - 1, 2) / 4;       // d_z², torus + two lobes
}

const R_MAX = 25; // Bohr radii — matches RadialDistributionSim's chart domain

/* ── 2D graph data (plain hand-rolled SVG — no chart library, per §2) ────── */

const GW = 380, GH = 150;
const GPAD = { top: 10, right: 14, bottom: 24, left: 14 };
const GCW = GW - GPAD.left - GPAD.right;
const GCH = GH - GPAD.top - GPAD.bottom;

function buildCurve(id: OrbitalId, kind: 'density' | 'distribution') {
  const pts: { r: number; v: number }[] = [];
  const steps = 300;
  for (let i = 0; i <= steps; i++) {
    const r = 0.01 + (i / steps) * R_MAX;
    const Rr = radialWavefunction(id, r);
    const density = Rr * Rr;
    pts.push({ r, v: kind === 'density' ? density : 4 * Math.PI * r * r * density });
  }
  const maxV = Math.max(...pts.map((p) => p.v), 1e-9);
  const path = pts
    .map((p, i) => {
      const x = GPAD.left + (p.r / R_MAX) * GCW;
      const y = GPAD.top + GCH - (p.v / maxV) * GCH * 0.85;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return path;
}

function Graph({ title, path, accent }: { title: string; path: string; accent: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: TEXT.ghost }}>
        {title}
      </div>
      <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height={GH} style={{ display: 'block' }}>
        <line x1={GPAD.left} y1={GPAD.top + GCH} x2={GPAD.left + GCW} y2={GPAD.top + GCH}
          stroke={BORDER.card} strokeWidth={1} />
        <path d={path} fill="none" stroke={accent} strokeWidth={2} />
        <text x={GPAD.left} y={GH - 4} fontSize={9} fill={TEXT.ghost}>0</text>
        <text x={GPAD.left + GCW} y={GH - 4} fontSize={9} fill={TEXT.ghost} textAnchor="end">{R_MAX} a₀</text>
      </svg>
    </div>
  );
}

/* ── 3D point cloud ───────────────────────────────────────────────────── */

const NUM_POINTS = 20000;
const ATTEMPT_MULTIPLIER = 200;

function generatePoints(id: OrbitalId): Float32Array {
  const { l } = ORBITALS[id];
  const positions = new Float32Array(NUM_POINTS * 3);

  // Numeric max of R(r)^2 over the domain, so acceptance probability stays in [0,1].
  let maxRadialSq = 0;
  for (let r = 0.05; r <= R_MAX; r += 0.1) {
    const v = radialWavefunction(id, r);
    if (v * v > maxRadialSq) maxRadialSq = v * v;
  }
  const maxAngular = l === 2 ? 1 : 1; // dz2's (3nz²-1)²/4 peaks at 1 too (nz=±1)
  const maxDensity = maxRadialSq * maxAngular;

  const half = R_MAX * 0.85;
  let i = 0, attempts = 0;
  const maxAttempts = NUM_POINTS * ATTEMPT_MULTIPLIER;

  while (i < NUM_POINTS && attempts < maxAttempts) {
    attempts++;
    const x = (Math.random() - 0.5) * 2 * half;
    const y = (Math.random() - 0.5) * 2 * half;
    const z = (Math.random() - 0.5) * 2 * half;
    const r = Math.sqrt(x * x + y * y + z * z);
    if (r < 0.05 || r > R_MAX) continue;

    const Rr = radialWavefunction(id, r);
    const prob = (Rr * Rr * angularSq(l, z / r)) / maxDensity;
    if (Math.random() < prob) {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      i++;
    }
  }
  return positions.subarray(0, i * 3) as Float32Array;
}

function OrbitalPoints({ id }: { id: OrbitalId }) {
  const positions = useMemo(() => generatePoints(id), [id]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT}
        size={0.35}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
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

/* ── Main component ───────────────────────────────────────────────────── */

export default function OrbitalCloudGraphSim() {
  const [orbitalId, setOrbitalId] = useState<OrbitalId>('2p');
  const meta = ORBITALS[orbitalId];
  const radialNodes = meta.n - meta.l - 1;
  const angularNodes = meta.l;

  const densityPath = useMemo(() => buildCurve(orbitalId, 'density'), [orbitalId]);
  const distributionPath = useMemo(() => buildCurve(orbitalId, 'distribution'), [orbitalId]);

  return (
    <SimShell>
      <SimHeader title="Orbital" accentWord="Cloud Lab" subtitle="3D probability cloud + its own curves, side by side" />

      <div className="flex flex-wrap gap-2 mb-5">
        {ORBITAL_IDS.map((id) => {
          const active = id === orbitalId;
          return (
            <button key={id} onClick={() => setOrbitalId(id)}
              className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                background: active ? 'rgba(196,181,253,0.14)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(196,181,253,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color: active ? ACCENT : TEXT.secondary,
              }}>
              {ORBITALS[id].label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[6fr_6fr] gap-5">
        {/* LEFT — 3D canvas */}
        <div className="rounded-2xl overflow-hidden" style={{ background: SIM_CANVAS_BG, border: `1px solid ${BORDER.card}`, minHeight: 360 }}>
          <SceneBoundary fallback={<SceneFallback />}>
            <Suspense fallback={<SceneFallback />}>
              <Canvas camera={{ position: [22, 18, 22], fov: 45 }} style={{ minHeight: 360 }}>
                <OrbitalPoints id={orbitalId} />
                <OrbitControls enableDamping dampingFactor={0.06} autoRotate autoRotateSpeed={0.6} />
              </Canvas>
            </Suspense>
          </SceneBoundary>
        </div>

        {/* RIGHT — node summary + the two curves */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 text-[13px]">
            <div><span style={{ color: TEXT.ghost }}>Radial nodes: </span><b style={{ color: TEXT.primary }}>{radialNodes}</b></div>
            <div><span style={{ color: TEXT.ghost }}>Angular nodes: </span><b style={{ color: TEXT.primary }}>{angularNodes}</b></div>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER.card}` }}>
            <SectionLabel accent={ACCENT}>Probability Density — R(r)²</SectionLabel>
            <p className="text-[12px] mt-1 mb-2" style={{ color: TEXT.secondary }}>
              Where the wavefunction itself is large. Dips to zero at each radial node.
            </p>
            <Graph title="" path={densityPath} accent={ACCENT} />
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER.card}` }}>
            <SectionLabel accent={ACCENT_2}>Radial Distribution — 4πr²R(r)²</SectionLabel>
            <p className="text-[12px] mt-1 mb-2" style={{ color: TEXT.secondary }}>
              Weighted by the volume of each thin spherical shell — this is what actually peaks away from the nucleus.
            </p>
            <Graph title="" path={distributionPath} accent={ACCENT_2} />
          </div>
        </div>
      </div>
    </SimShell>
  );
}
