'use client';

import { SimulationBlock } from '@/types/books';

const SIMULATION_IDS = [
  // Class 11 Chemistry
  'fractional-distillation',
  'chromatography',
  'tyndall-effect',
  // Structure of Atom
  'rutherford-comparison',
  'atomic-models',
  'cathode-ray-tube',
  'gold-foil-experiment',
  'rutherford-collapse',
  'atom-builder',
  'em-wave-explorer',
  'wave-dynamics',
  'wave-vs-photon',
  'photoelectric-effect',
  'bulb-evolution',
  'quantum-number-explorer',
  'orbital-shape-explorer',
  'radial-distribution',
  'electron-density',
  // Class 9 Physics
  'sound-wave',
  'wave-properties',
  'speed-of-sound-media',
  'pitch-loudness',
  'echo-reverberation',
  'mechanical-advantage',
  'lever-classes',
  'pulley-system',
  'inclined-plane-sim',
  'force-balance',
  'friction-explorer',
  'circular-motion',
  'position-time-graph',
  'work-done',
  'kinetic-energy',
  'energy-conservation',
  'power-and-work',
  'gravitational-force',
  'free-fall-gravity',
  'weight-on-planets',
  'archimedes-principle',
  'inertia-sandbox',
  'newtons-second-law',
  'momentum-collision',
  'newtons-third-law',
  'velocity-time-graph',
  'uniform-nonuniform-motion',
  'distance-displacement',
  'equations-of-motion',
];

interface Props {
  block: SimulationBlock;
  onChange: (p: Partial<SimulationBlock>) => void;
}

export default function SimulationBlockEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Simulation ID dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Simulation ID</label>
        <select
          value={block.simulation_id}
          onChange={(e) => onChange({ simulation_id: e.target.value })}
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white focus:outline-none focus:border-orange-500/40 cursor-pointer"
        >
          {SIMULATION_IDS.map((id) => (
            <option key={id} value={id} className="bg-[#0B0F15]">
              {id}
            </option>
          ))}
        </select>
      </div>

      {/* Display title */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Title (optional)</label>
        <input
          value={block.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value || undefined })}
          placeholder="e.g. Tyndall Effect Simulator"
          className="w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40"
        />
      </div>
    </div>
  );
}
