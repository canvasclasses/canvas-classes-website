'use client';

import { useState } from 'react';
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
  // ── Class 9 Physics — Chapter 12: Sound ──────────────────────────────────
  'sound-wave': dynamic(
    () => import('./simulations/SoundWaveSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'wave-properties': dynamic(
    () => import('./simulations/WavePropertiesSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'speed-of-sound-media': dynamic(
    () => import('./simulations/SpeedOfSoundSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'pitch-loudness': dynamic(
    () => import('./simulations/PitchLoudnessSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'echo-reverberation': dynamic(
    () => import('./simulations/EchoReverberationSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 11: Work, Energy, and Simple Machines ───────
  'mechanical-advantage': dynamic(
    () => import('./simulations/MechanicalAdvantageSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'lever-classes': dynamic(
    () => import('./simulations/LeverClassesSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'pulley-system': dynamic(
    () => import('./simulations/PulleySystemSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'inclined-plane-sim': dynamic(
    () => import('./simulations/InclinedPlaneSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 10: Force and Laws of Motion ───────────────
  'force-balance': dynamic(
    () => import('./simulations/ForceBalanceSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'friction-explorer': dynamic(
    () => import('./simulations/FrictionExplorerSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 9: Motion ──────────────────────────────────
  'circular-motion': dynamic(
    () => import('./simulations/CircularMotionSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'position-time-graph': dynamic(
    () => import('./simulations/PositionTimeGraphSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 4: Work and Energy ─────────────────────────
  'work-done': dynamic(
    () => import('./simulations/WorkDoneSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'kinetic-energy': dynamic(
    () => import('./simulations/KineticEnergySim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'energy-conservation': dynamic(
    () => import('./simulations/EnergyConservationSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'power-and-work': dynamic(
    () => import('./simulations/PowerSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  // ── Class 9 Physics — Chapter 3: Gravitation ─────────────────────────────
  'gravitational-force': dynamic(
    () => import('./simulations/GravitationalForceSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'free-fall-gravity': dynamic(
    () => import('./simulations/FreeFallSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'weight-on-planets': dynamic(
    () => import('./simulations/WeightOnPlanetsSim'),
    { ssr: false, loading: () => <SimulationSkeleton /> }
  ),
  'archimedes-principle': dynamic(
    () => import('./simulations/ArchimedesPrincipleSim'),
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
  // ── Class 9 Science — Chapter 2: Is Matter Around Us Pure? ──────────────
  'tyndall-effect': dynamic(
    () => import('./simulations/TyndallEffectSim'),
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

// ── Prediction gate ───────────────────────────────────────────────────────────

function PredictionGate({
  block,
  onUnlock,
}: {
  block: SimulationBlock;
  onUnlock: (choice: number) => void;
}) {
  const pred = block.prediction!;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className="rounded-2xl px-6 py-6"
      style={{ background: '#0b0f15', border: '1px solid rgba(99,102,241,0.18)' }}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}
        >
          Predict First
        </span>
        <span className="text-[10px] text-white/25 uppercase tracking-widest">
          before running the simulation
        </span>
      </div>

      {/* Prompt */}
      <p className="text-[15px] leading-relaxed text-white/85 font-medium mb-5">
        {pred.prompt}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-5">
        {pred.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
            style={{
              border: selected === i
                ? '1.5px solid rgba(99,102,241,0.6)'
                : '1.5px solid rgba(255,255,255,0.07)',
              background: selected === i ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: selected === i ? '#c7d2fe' : 'rgba(255,255,255,0.5)',
            }}
          >
            <span
              className="mr-2 text-xs font-bold"
              style={{ color: selected === i ? '#818cf8' : 'rgba(255,255,255,0.2)' }}
            >
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Unlock button */}
      <button
        disabled={selected === null}
        onClick={() => selected !== null && onUnlock(selected)}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
        style={{
          background: selected !== null
            ? 'linear-gradient(135deg, #6366f1, #818cf8)'
            : 'rgba(255,255,255,0.04)',
          color: selected !== null ? '#fff' : 'rgba(255,255,255,0.2)',
          cursor: selected === null ? 'not-allowed' : 'pointer',
        }}
      >
        Lock In My Prediction →
      </button>
    </div>
  );
}

// ── Main renderer ─────────────────────────────────────────────────────────────

export default function SimulationBlockRenderer({ block }: { block: SimulationBlock }) {
  const [unlockedChoice, setUnlockedChoice] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);

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

  // No prediction — render simulator directly
  if (!block.prediction) return <Sim />;

  // Has prediction — gate until committed
  if (unlockedChoice === null) {
    return <PredictionGate block={block} onUnlock={setUnlockedChoice} />;
  }

  // Unlocked — show prediction badge, then sim, then reveal
  const pred = block.prediction;
  return (
    <div>
      {/* Your prediction badge */}
      <div
        className="flex items-center gap-2 mb-3 px-4 py-2 rounded-xl"
        style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
          Your prediction
        </span>
        <span className="text-xs text-white/60">
          {pred.options[unlockedChoice]}
        </span>
      </div>

      {/* Simulation */}
      <Sim />

      {/* What actually happens — reveal */}
      {!showReveal ? (
        <button
          onClick={() => setShowReveal(true)}
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          What actually happens? →
        </button>
      ) : (
        <div
          className="mt-4 rounded-xl px-4 py-4 text-sm leading-relaxed"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-indigo-400">
            Observe &amp; Explain
          </p>
          {pred.reveal_after}
        </div>
      )}
    </div>
  );
}
