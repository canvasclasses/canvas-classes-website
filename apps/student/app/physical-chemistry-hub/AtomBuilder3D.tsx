'use client';

/**
 * AtomBuilder3D — rotatable 3D atom builder for the "Atomic Number, Mass
 * Number and Isotopes" page.
 *
 * Rendered as an INJECTED simulator (id: 'atom-builder-3d') via
 * ExtraSimulatorsProvider, exactly like 'quantum-orbital-3d' / 'heart-3d'.
 * Lives here (not in packages/book-renderer/blocks/simulations/) because
 * three + @react-three/fiber + @react-three/drei are only dependencies of
 * apps/student, not of the shared book-renderer package — see
 * apps/student/features/books/lib/extraSimulators.tsx for why this pattern
 * exists. Known limitation shared by every sim on that list: it does not
 * render inside the admin editor's split-pane preview.
 *
 * Replaces the old 2D SVG two-atom comparator (packages/book-renderer/.../
 * AtomBuilderSim.tsx, removed). Founder feedback (2026-07-26): drop the
 * second atom, drop the separate Z/A/N/electron/charge stat table, and make
 * the atom itself a real rotatable 3D model — one atom, controls below it,
 * the notation next to it. Nucleon packing uses R ∝ (protons+neutrons)^(1/3)
 * (a volume-uniform Fibonacci-lattice fill), matching the real physics of
 * how nuclear radius scales with mass number.
 */

import { Suspense, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import type * as ThreeTypes from 'three';

// ── Palette — mirrors the platform's sim design tokens (violet primary,
// sky secondary, neutral gray for the "neutral" particle) ─────────────────
const ACCENT = '#c4b5fd';       // violet-300 — protons / Z (foreground/text use)
const ACCENT_MAT = '#8b7cd6';   // richer violet for the lit 3D proton material
const ACCENT_2 = '#7dd3fc';     // sky-300 — electrons (foreground/text use)
const ACCENT_2_MAT = '#38bdf8'; // richer sky for the lit 3D electron material
const NEUTRON_MAT = '#e0c98a';  // warm wheat/gold — neutrons (not gray; matches the ochre/cream
                                 // palette already used for protons/neutrons in this chapter's hero images)
const TEXT = { primary: '#e2e8f0', secondary: '#94a3b8', muted: '#475569', ghost: '#64748b' };
const BORDER = 'rgba(255,255,255,0.07)';

// ── Element data (H -> Ca) ──────────────────────────────────────────────────
const ELEMENTS: Record<number, { symbol: string; name: string }> = {
  1: { symbol: 'H', name: 'Hydrogen' }, 2: { symbol: 'He', name: 'Helium' },
  3: { symbol: 'Li', name: 'Lithium' }, 4: { symbol: 'Be', name: 'Beryllium' },
  5: { symbol: 'B', name: 'Boron' }, 6: { symbol: 'C', name: 'Carbon' },
  7: { symbol: 'N', name: 'Nitrogen' }, 8: { symbol: 'O', name: 'Oxygen' },
  9: { symbol: 'F', name: 'Fluorine' }, 10: { symbol: 'Ne', name: 'Neon' },
  11: { symbol: 'Na', name: 'Sodium' }, 12: { symbol: 'Mg', name: 'Magnesium' },
  13: { symbol: 'Al', name: 'Aluminium' }, 14: { symbol: 'Si', name: 'Silicon' },
  15: { symbol: 'P', name: 'Phosphorus' }, 16: { symbol: 'S', name: 'Sulfur' },
  17: { symbol: 'Cl', name: 'Chlorine' }, 18: { symbol: 'Ar', name: 'Argon' },
  19: { symbol: 'K', name: 'Potassium' }, 20: { symbol: 'Ca', name: 'Calcium' },
};
function getElement(z: number) {
  return ELEMENTS[z] ?? { symbol: '?', name: 'Unknown element' };
}
function chargeSuperscript(protons: number, electrons: number): string {
  const d = protons - electrons;
  if (d === 0) return '';
  const sign = d > 0 ? '+' : '−';
  const mag = Math.abs(d);
  return `${mag === 1 ? '' : mag}${sign}`;
}

type AtomState = { p: number; n: number; e: number };
interface Preset { label: string; atom: AtomState }
const PRESETS: Preset[] = [
  { label: 'Protium (¹H)', atom: { p: 1, n: 0, e: 1 } },
  { label: 'Deuterium (²H)', atom: { p: 1, n: 1, e: 1 } },
  { label: 'Tritium (³H)', atom: { p: 1, n: 2, e: 1 } },
  { label: 'Carbon-12', atom: { p: 6, n: 6, e: 6 } },
  { label: 'Carbon-14', atom: { p: 6, n: 8, e: 6 } },
  { label: 'Sodium ion (Na⁺)', atom: { p: 11, n: 12, e: 10 } },
  { label: 'Chlorine-35', atom: { p: 17, n: 18, e: 17 } },
  { label: 'Chlorine-37', atom: { p: 17, n: 20, e: 17 } },
];

// ── Nucleus — ONE defined sphere, not a cluster of nucleon spheres. Adding
// protons increases the nuclear charge (shown as a live "+N" label, since
// that's the thing worth seeing change); adding neutrons only grows the
// sphere slightly (it "gets heavier"), never adds visible pieces. Radius
// still follows R ∝ A^(1/3), the real physics of how nuclear size scales
// with mass number — just applied to a single sphere instead of a packed
// lattice of nucleon spheres, which read as "one nucleus per particle" and
// was flagged as confusing (7 spheres for nitrogen looked like 7 nuclei).
const NUCLEUS_BASE_R = 0.85;
function nucleusRadius(protons: number, neutrons: number) {
  return NUCLEUS_BASE_R * Math.cbrt(Math.max(1, protons + neutrons));
}

function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const R = nucleusRadius(protons, neutrons);
  return (
    <group>
      {/* Soft glow halo — two translucent layers for a smooth falloff, giving
          the sphere a "spherical feel" without a cluster of extra geometry. */}
      <mesh scale={1.9}>
        <sphereGeometry args={[R, 24, 24]} />
        <meshBasicMaterial color={ACCENT_MAT} transparent opacity={0.05} depthWrite={false} />
      </mesh>
      <mesh scale={1.4}>
        <sphereGeometry args={[R, 24, 24]} />
        <meshBasicMaterial color={ACCENT_MAT} transparent opacity={0.10} depthWrite={false} />
      </mesh>
      {/* Core nucleus sphere */}
      <mesh>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial color={ACCENT_MAT} emissive={ACCENT_MAT} emissiveIntensity={0.5} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Live nuclear charge — this is the thing that should visibly change
          when protons are added, not the sphere's shape. */}
      <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: 'system-ui, sans-serif', textShadow: '0 0 8px rgba(0,0,0,0.85)' }}>
          +{protons}
        </div>
      </Html>
    </group>
  );
}

// ── Electron shells — tilted rings, each spinning at its own slow speed ────
const SHELL_CAP = [2, 8, 8, 2];
const SHELL_TILTS: [number, number, number][] = [
  [0, 0, 0],
  [0.55, 0, 0.25],
  [-0.45, 0, 0.55],
  [0.3, 0, -0.65],
];
const SHELL_SPIN_SPEED = [0.18, -0.13, 0.1, -0.15];

function shellsFor(electrons: number): number[] {
  const out = [0, 0, 0, 0];
  let r = electrons;
  for (let i = 0; i < 4 && r > 0; i++) {
    const fill = Math.min(SHELL_CAP[i], r);
    out[i] = fill;
    r -= fill;
  }
  return out;
}

function ElectronShell({ radius, count, tilt, spinSpeed }:
  { radius: number; count: number; tilt: [number, number, number]; spinSpeed: number }) {
  const spinRef = useRef<ThreeTypes.Group>(null);
  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.z += spinSpeed * delta;
  });

  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return pts;
  }, [radius]);

  return (
    <group rotation={tilt}>
      <Line points={ringPoints} color={ACCENT_2} transparent opacity={0.22} />
      <group ref={spinRef}>
        {Array.from({ length: count }).map((_, i) => {
          const a = (i / count) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color={ACCENT_2_MAT} emissive={ACCENT_2_MAT} emissiveIntensity={0.35} roughness={0.25} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function AtomScene({ protons, neutrons, electrons }: { protons: number; neutrons: number; electrons: number }) {
  const shells = shellsFor(electrons);
  const nucleusR = nucleusRadius(protons, neutrons);
  const shellRadii = [nucleusR + 1.6, nucleusR + 2.9, nucleusR + 4.2, nucleusR + 5.5];

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 6]} intensity={1.3} />
      <directionalLight position={[-6, -3, -5]} intensity={0.35} color="#93a5e8" />
      <Nucleus protons={protons} neutrons={neutrons} />
      {shells.map((count, i) => count > 0 && (
        <ElectronShell key={i} radius={shellRadii[i]} count={count} tilt={SHELL_TILTS[i]} spinSpeed={SHELL_SPIN_SPEED[i]} />
      ))}
      {/* Manual drag-to-rotate only — no automatic whole-scene spin. The
          electron shells already animate on their own (see ElectronShell). */}
      <OrbitControls enableDamping dampingFactor={0.06} enablePan={false} minDistance={4} maxDistance={22} />
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}
function SceneNotReady() {
  return (
    <div className="w-full h-full flex items-center justify-center text-center px-4">
      <p className="text-[11px]" style={{ color: TEXT.ghost }}>The 3D view couldn&apos;t load on this device. Try reloading the page.</p>
    </div>
  );
}

// ── Flat counter control — no bordered card wrapping the row ───────────────
function Counter({ label, value, color, onDec, onInc }:
  { label: string; value: number; color: string; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium" style={{ color }}>{label}</span>
      <button onClick={onDec}
        className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, color: TEXT.secondary, cursor: 'pointer' }}>
        &minus;
      </button>
      <span className="w-6 text-center text-base font-bold tabular-nums" style={{ color }}>{value}</span>
      <button onClick={onInc}
        className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, color: TEXT.secondary, cursor: 'pointer' }}>
        +
      </button>
    </div>
  );
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function AtomBuilder3D() {
  const [atom, setAtom] = useState<AtomState>({ p: 1, n: 0, e: 1 });
  const [activePreset, setActivePreset] = useState<number | null>(0);

  const { p, n, e } = atom;
  const Z = p, A = p + n;
  const el = getElement(Z);
  const sup = chargeSuperscript(p, e);

  const adjust = (field: keyof AtomState, delta: number) => {
    const limits: Record<keyof AtomState, [number, number]> = { p: [1, 20], n: [0, 25], e: [0, 22] };
    setAtom((cur) => ({ ...cur, [field]: clamp(cur[field] + delta, limits[field][0], limits[field][1]) }));
    setActivePreset(null);
  };
  function applyPreset(idx: number) {
    setActivePreset(idx);
    setAtom({ ...PRESETS[idx].atom });
  }

  return (
    <div className="p-4 md:p-6 rounded-2xl" style={{ background: '#0d1117', color: TEXT.primary, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
          Atom <span style={{ color: ACCENT }}>Builder</span>
        </h2>
        <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: TEXT.muted }}>
          Adjust protons, neutrons &amp; electrons — rotate the atom to explore it
        </p>
      </div>

      {/* 3D canvas + symbol, side by side. Controls live INSIDE the canvas
          panel, docked to its bottom, instead of a separate section below —
          one self-contained "simulator" surface, not three stacked ones. */}
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        <div className="relative overflow-hidden rounded-3xl flex-1 flex flex-col"
          style={{ minHeight: 440, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(196,181,253,0.2)' }}>
          <div className="relative flex-1" style={{ minHeight: 320 }}>
            <SceneBoundary fallback={<SceneNotReady />}>
              <Canvas dpr={[1, 2]} camera={{ position: [10, 6, 11], fov: 42 }} gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                  <AtomScene protons={p} neutrons={n} electrons={e} />
                </Suspense>
              </Canvas>
            </SceneBoundary>
          </div>

          {/* Controls — docked to the bottom of the simulator panel */}
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(5,6,20,0.45)' }}>
            <Counter label="Protons" value={p} color={ACCENT} onDec={() => adjust('p', -1)} onInc={() => adjust('p', +1)} />
            <Counter label="Neutrons" value={n} color={NEUTRON_MAT} onDec={() => adjust('n', -1)} onInc={() => adjust('n', +1)} />
            <Counter label="Electrons" value={e} color={ACCENT_2} onDec={() => adjust('e', -1)} onInc={() => adjust('e', +1)} />
          </div>
        </div>

        {/* Symbol — the only readout. A = superscript (top), Z = subscript
            (bottom, at the letter's baseline) via a stretched, space-between
            column next to the glyph — not a tight top-aligned stack. No
            element name: the symbol already says it. */}
        <div className="flex items-center justify-center md:w-56 shrink-0">
          <div className="flex items-stretch gap-2">
            <div className="flex flex-col justify-between items-end" style={{ paddingTop: 8, paddingBottom: 12 }}>
              <span className="text-2xl font-bold tabular-nums" style={{ color: TEXT.secondary, lineHeight: 1 }}>{A}</span>
              <span className="text-2xl font-bold tabular-nums" style={{ color: TEXT.muted, lineHeight: 1 }}>{Z}</span>
            </div>
            <span className="text-8xl font-black" style={{ lineHeight: 1, color: ACCENT }}>{el.symbol}</span>
            {sup && (
              <span className="text-2xl font-bold" style={{ color: sup.includes('−') ? ACCENT_2 : '#fca5a5', marginTop: 8 }}>{sup}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Examples */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEXT.secondary }}>Quick Examples</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((pr, i) => {
            const active = activePreset === i;
            return (
              <button key={i} onClick={() => applyPreset(i)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: active ? 'rgba(196,181,253,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(196,181,253,0.4)' : BORDER}`,
                  color: active ? ACCENT : TEXT.secondary,
                  cursor: 'pointer',
                }}>
                {pr.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
