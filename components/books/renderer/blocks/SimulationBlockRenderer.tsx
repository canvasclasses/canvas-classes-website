'use client';

import { SimulationBlock } from '@/types/books';
import dynamic from 'next/dynamic';

// Lazy-load each simulator — keeps initial page bundle small
const simulators: Record<string, React.ComponentType> = {
  'fractional-distillation': dynamic(
    () => import('./simulations/FractionalDistillationSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'chromatography': dynamic(
    () => import('./simulations/ChromatographySim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'rutherford-comparison': dynamic(
    () => import('./simulations/RutherfordComparisonSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'atomic-models': dynamic(
    () => import('@/app/physical-chemistry-hub/AtomicModels'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'cathode-ray-tube': dynamic(
    () => import('./simulations/CathodeRayTubeSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'gold-foil-experiment': dynamic(
    () => import('./simulations/GoldFoilSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'rutherford-collapse': dynamic(
    () => import('./simulations/RutherfordCollapseSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'atom-builder': dynamic(
    () => import('./simulations/AtomBuilderSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'em-wave-explorer': dynamic(
    () => import('./simulations/EMWaveSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'wave-dynamics': dynamic(
    () => import('./simulations/WaveDynamicsSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'wave-vs-photon': dynamic(
    () => import('./simulations/WaveVsPhotonSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'photoelectric-effect': dynamic(
    () => import('./simulations/PhotoelectricSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'bulb-evolution': dynamic(
    () => import('./simulations/BulbEvolutionSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'quantum-number-explorer': dynamic(
    () => import('./simulations/QuantumNumberExplorerSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'orbital-shape-explorer': dynamic(
    () => import('./simulations/OrbitalShapeExplorerSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'radial-distribution': dynamic(
    () => import('./simulations/RadialDistributionSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'electron-density': dynamic(
    () => import('./simulations/ElectronDensitySim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 2: Force and Laws of Motion ───────────────
  'inertia-sandbox': dynamic(
    () => import('./simulations/InertiaSandboxSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'newtons-second-law': dynamic(
    () => import('./simulations/NewtonsSecondLawSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'momentum-collision': dynamic(
    () => import('./simulations/MomentumCollisionSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'newtons-third-law': dynamic(
    () => import('./simulations/NewtonsThirdLawSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 1: Motion ──────────────────────────────────
  'velocity-time-graph': dynamic(
    () => import('./simulations/VelocityTimeGraphSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'uniform-nonuniform-motion': dynamic(
    () => import('./simulations/UniformNonUniformSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'distance-displacement': dynamic(
    () => import('./simulations/DistanceDisplacementSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'equations-of-motion': dynamic(
    () => import('./simulations/EquationsOfMotionSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
};

function SimulationSkeleton() {
  return (
    <div className="rounded-2xl flex items-center justify-center py-16"
      style={{ background: '#0d1117', border: '1px solid rgba(99,102,241,0.15)' }}>
      <p className="text-[12px] font-bold uppercase tracking-widest"
        style={{ color: '#334155' }}>Loading simulator…</p>
    </div>
  );
}

export default function SimulationBlockRenderer({ block }: { block: SimulationBlock }) {
  const Sim = simulators[block.simulation_id];
  if (!Sim) {
    return (
      <div className="rounded-xl py-8 text-center"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-sm" style={{ color: '#475569' }}>
          Simulator <code className="text-amber-400">{block.simulation_id}</code> not found.
        </p>
      </div>
    );
  }
  return <Sim />;
}
