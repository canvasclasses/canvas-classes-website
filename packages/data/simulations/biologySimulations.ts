/**
 * Biology simulations catalog — the SINGLE SOURCE OF TRUTH for which interactive
 * biology sims / 3D models exist, what they're called, and which grades they suit.
 *
 * This is pure data (no React, no component imports) so it can be consumed by:
 *   - the public Biology Hub page (apps/student/app/biology-hub)
 *   - the admin Books-editor simulation picker (SimulationBlockEditor)
 *   - anywhere else that needs to list/insert a biology sim
 *
 * `id` is the `simulation_id` used in a `simulation` content block. A sim renders
 * wherever that block is placed — ANY grade, ANY page — so `grades` here is only a
 * discovery/filter hint, never a hard binding.
 *
 * To add a sim: register its component in the renderer (in-package
 * SimulationBlockRenderer registry, or app-injected via ExtraSimulatorsProvider),
 * then add a row here. Keep `id` identical in both places.
 */

export type BioGrade = 9 | 10 | 11 | 12;

export interface BiologySimulation {
  /** simulation_id used by the `simulation` content block + the renderer registry */
  id: string;
  title: string;
  /** one-line description for cards */
  description: string;
  /** syllabus area, e.g. "Body Fluids & Circulation" */
  topic: string;
  /** grades this sim is most relevant to (discovery filter only) */
  grades: BioGrade[];
  status: 'live' | 'coming_soon';
}

export const BIOLOGY_SIMULATIONS: BiologySimulation[] = [
  {
    id: 'heart-3d',
    title: 'The Human Heart — 3D',
    description:
      'Rotate a real human heart, peel its layers, slice a cross-section, and tap any chamber or valve to see what it does. Colour-coded by oxygenation (blue = deoxygenated, red = oxygenated).',
    topic: 'Body Fluids & Circulation · Transportation',
    grades: [10, 11, 12],
    status: 'live',
  },
  {
    id: 'skeleton-3d',
    title: 'The Skeletal System — 3D',
    description:
      'Rotate a full human skeleton, peel it region by region, and tap any bone — skull, spine, ribs, limbs — for its NCERT name and function. Toggle the axial vs appendicular split, take a guided tour, or test yourself with the "name the bone" quiz.',
    topic: 'Locomotion & Movement · The Skeletal System',
    grades: [9, 10, 11, 12],
    status: 'live',
  },
  {
    id: 'muscular-system',
    title: 'The Muscular System — 3D',
    description:
      'Peel from superficial to deep muscles, tap any muscle to learn what it does, take a head-to-toe guided tour, or test yourself with the “tap the muscle” quiz. ~90 muscles, by region and depth.',
    topic: 'Locomotion & Movement · The Muscular System',
    grades: [9, 10, 11, 12],
    status: 'live',
  },
  {
    id: 'anatomy-explorer',
    title: 'Anatomy Explorer — Full Body 3D',
    description:
      'The whole human body in 3D. Toggle each system on or off — skeleton, muscles, heart & vessels, brain & nerves, internal organs, lymphatic — fade a layer to peel it away, rotate and zoom, and tap any structure to name it.',
    topic: 'Human Anatomy · All Body Systems',
    grades: [9, 10, 11, 12],
    status: 'live',
  },
  // ── Roadmap (placeholders — flip to 'live' once the model/sim is registered) ──
  {
    id: 'nephron-3d',
    title: 'The Nephron — 3D',
    description:
      'Trace filtration, reabsorption and secretion along a 3D nephron — the functional unit of the kidney.',
    topic: 'Excretory Products & their Elimination',
    grades: [10, 11, 12],
    status: 'coming_soon',
  },
  {
    id: 'neuron-3d',
    title: 'The Neuron & Synapse — 3D',
    description:
      'Explore a neuron, watch an impulse travel down the axon, and see how it crosses a synapse.',
    topic: 'Neural Control & Coordination',
    grades: [10, 11, 12],
    status: 'coming_soon',
  },
  {
    id: 'dna-helix',
    title: 'DNA Double Helix',
    description:
      'Rotate the double helix, see base pairing (A–T, G–C), and unzip the strands for replication.',
    topic: 'Molecular Basis of Inheritance',
    grades: [12],
    status: 'coming_soon',
  },
];
