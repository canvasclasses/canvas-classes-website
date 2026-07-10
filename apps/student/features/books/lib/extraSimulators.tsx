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
const Heart3DViewer = dynamic(() => import('@/features/anatomy/Heart3DViewer'), { ssr: false });
const Skeleton3DViewer = dynamic(() => import('@/features/anatomy/Skeleton3DViewer'), { ssr: false });
const AnatomyExplorer = dynamic(() => import('@/features/anatomy/AnatomyExplorer'), { ssr: false });
const MuscularSystemViewer = dynamic(() => import('@/features/anatomy/MuscularSystemViewer'), { ssr: false });
const VSEPRSimulator = dynamic(() => import('@/app/inorganic-chemistry-hub/VSEPRSimulator'), { ssr: false });
const BondAngleSimulator = dynamic(() => import('@/app/inorganic-chemistry-hub/BondAngleSimulator'), { ssr: false });

export const EXTRA_SIMULATORS: ExtraSimulators = {
  'atomic-models': AtomicModels,
  'heart-3d': Heart3DViewer,
  'skeleton-3d': Skeleton3DViewer,
  'anatomy-explorer': AnatomyExplorer,
  'muscular-system': MuscularSystemViewer,
  'vsepr-shape-lab': VSEPRSimulator,
  'bond-angle-explorer': BondAngleSimulator,
};
