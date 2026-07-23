'use client';

import dynamic from 'next/dynamic';
import type { ExtraSimulators } from '@canvas/book-renderer/simulators-context';

// Simulators that can't ship inside the shared book-renderer package because they
// depend on app-local code (the `@/` alias) or app-only deps (three / drei). They
// are injected into the renderer at runtime via ExtraSimulatorsProvider, so they
// resolve by `simulation_id` in BOTH the book reader and the Biology Hub. (They do
// NOT render in the admin editor preview — that's a known, accepted limitation.)
//
// Keep these ids in sync with the catalogs that list them
// (e.g. @canvas/data/simulations/biologySimulations).

const AtomicModels = dynamic(() => import('@/app/physical-chemistry-hub/AtomicModels'), { ssr: false });
const QuantumOrbital3DViewer = dynamic(() => import('@/app/physical-chemistry-hub/QuantumOrbital3DViewer'), { ssr: false });
const Heart3DViewer = dynamic(() => import('@/features/anatomy/Heart3DViewer'), { ssr: false });
const Skeleton3DViewer = dynamic(() => import('@/features/anatomy/Skeleton3DViewer'), { ssr: false });
const AnatomyExplorer = dynamic(() => import('@/features/anatomy/AnatomyExplorer'), { ssr: false });
const MuscularSystemViewer = dynamic(() => import('@/features/anatomy/MuscularSystemViewer'), { ssr: false });
const VSEPRSimulator = dynamic(() => import('@/app/inorganic-chemistry-hub/VSEPRSimulator'), { ssr: false });
const BondAngleSimulator = dynamic(() => import('@/app/inorganic-chemistry-hub/BondAngleSimulator'), { ssr: false });

// "First iteration" Class 11 Biology sweep (2026-07-15) — thin SimpleModelViewer
// wrappers, see SimpleModelViewers.tsx for the shared engine + per-model credit.
const CoronavirusViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.CoronavirusViewer), { ssr: false });
const SeaStarViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.SeaStarViewer), { ssr: false });
const FlowerAnatomyViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.FlowerAnatomyViewer), { ssr: false });
const RootStructureViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.RootStructureViewer), { ssr: false });
const FrogAnatomyViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.FrogAnatomyViewer), { ssr: false });
const AnimalCellViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.AnimalCellViewer), { ssr: false });
const PlantCellViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.PlantCellViewer), { ssr: false });
const MitochondriaViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.MitochondriaViewer), { ssr: false });
const LysosomeViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.LysosomeViewer), { ssr: false });
const DNAHelixViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.DNAHelixViewer), { ssr: false });
const LungsViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.LungsViewer), { ssr: false });
const NephronViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.NephronViewer), { ssr: false });
const NeuronViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.NeuronViewer), { ssr: false });
const BrainViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.BrainViewer), { ssr: false });
const PancreasViewer = dynamic(() => import('@/features/anatomy/SimpleModelViewers').then((m) => m.PancreasViewer), { ssr: false });

export const EXTRA_SIMULATORS: ExtraSimulators = {
  'atomic-models': AtomicModels,
  'quantum-orbital-3d': QuantumOrbital3DViewer,
  'heart-3d': Heart3DViewer,
  'skeleton-3d': Skeleton3DViewer,
  'anatomy-explorer': AnatomyExplorer,
  'muscular-system': MuscularSystemViewer,
  'vsepr-shape-lab': VSEPRSimulator,
  'bond-angle-explorer': BondAngleSimulator,
  'coronavirus-3d': CoronavirusViewer,
  'sea-star-3d': SeaStarViewer,
  'flower-anatomy-3d': FlowerAnatomyViewer,
  'root-structure-3d': RootStructureViewer,
  'frog-anatomy-3d': FrogAnatomyViewer,
  'animal-cell-3d': AnimalCellViewer,
  'plant-cell-3d': PlantCellViewer,
  'mitochondria-3d': MitochondriaViewer,
  'lysosome-3d': LysosomeViewer,
  'dna-helix': DNAHelixViewer,
  'lungs-3d': LungsViewer,
  'nephron-3d': NephronViewer,
  'neuron-3d': NeuronViewer,
  'brain-3d': BrainViewer,
  'pancreas-3d': PancreasViewer,
};
