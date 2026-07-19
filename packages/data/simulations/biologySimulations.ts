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
  // ── Class 11 Biology sweep (2026-07-15) — "first iteration": rotate + zoom
  // only, no peel-layers/tap-to-learn yet. Descriptions are written to match
  // that honestly; upgrade later per model as bespoke viewers get built. ──
  {
    id: 'nephron-3d',
    title: 'The Nephron — 3D',
    description: 'Rotate a 3D nephron — the functional unit of the kidney — and see how the tubule coils around its blood supply.',
    topic: 'Excretory Products & their Elimination',
    grades: [11, 12],
    status: 'live',
  },
  {
    id: 'neuron-3d',
    title: 'The Neuron — 3D',
    description: 'Rotate a neuron and see its soma, dendrites, axon, and myelin sheath in 3D.',
    topic: 'Neural Control & Coordination',
    grades: [11, 12],
    status: 'live',
  },
  {
    id: 'dna-helix',
    title: 'DNA Double Helix — 3D',
    description: 'Rotate a real atomic-scale model of the DNA double helix.',
    topic: 'Biomolecules · Molecular Basis of Inheritance',
    grades: [11, 12],
    status: 'live',
  },
  {
    id: 'coronavirus-3d',
    title: 'SARS-CoV-2 — 3D',
    description: 'Rotate a labelled coronavirus particle — spike proteins, envelope, and RNA core.',
    topic: 'Biological Classification · Viruses',
    grades: [11],
    status: 'live',
  },
  {
    id: 'sea-star-3d',
    title: 'Sea Star — 3D',
    description: 'Rotate a real sea star specimen scan — an example of Phylum Echinodermata.',
    topic: 'Animal Kingdom · Echinodermata',
    grades: [11],
    status: 'live',
  },
  {
    id: 'flower-anatomy-3d',
    title: 'Anatomy of a Flower — 3D',
    description: 'Rotate a cutaway flower showing calyx, corolla, androecium, and gynoecium together.',
    topic: 'Morphology of Flowering Plants',
    grades: [11],
    status: 'live',
  },
  {
    id: 'root-structure-3d',
    title: 'Internal Root Structure — 3D',
    description: 'Rotate a root cross-section showing the epidermis, cortex, endodermis, and vascular tissue rings.',
    topic: 'Anatomy of Flowering Plants',
    grades: [11],
    status: 'live',
  },
  {
    id: 'frog-anatomy-3d',
    title: 'Frog Anatomy — 3D',
    description: 'Rotate a real scanned frog specimen — the NCERT case-study animal for this chapter.',
    topic: 'Structural Organisation in Animals',
    grades: [11],
    status: 'live',
  },
  {
    id: 'animal-cell-3d',
    title: 'Animal Cell — 3D',
    description: 'Rotate an animal cell and see its nucleus, ER, Golgi, mitochondria, and other organelles in place.',
    topic: 'Cell: The Unit of Life',
    grades: [11],
    status: 'live',
  },
  {
    id: 'plant-cell-3d',
    title: 'Plant Cell — 3D',
    description: 'Rotate a plant cell and see its cell wall, vacuole, chloroplast, and other organelles in place.',
    topic: 'Cell: The Unit of Life',
    grades: [11],
    status: 'live',
  },
  {
    id: 'mitochondria-3d',
    title: 'Mitochondria — 3D',
    description: 'Rotate a mitochondrion labelled with its membrane, cristae, matrix, and ribosomes.',
    topic: 'Cell: The Unit of Life · Mitochondria & Plastids',
    grades: [11],
    status: 'live',
  },
  {
    id: 'lysosome-3d',
    title: 'Lysosome — 3D',
    description: 'Rotate a lysosome in context, showing where it sits in the endomembrane system.',
    topic: 'Cell: The Unit of Life · The Endomembrane System',
    grades: [11],
    status: 'live',
  },
  {
    id: 'lungs-3d',
    title: 'Human Lungs — 3D',
    description: 'Rotate a realistic pair of human lungs with the trachea and bronchial tree.',
    topic: 'Breathing & Exchange of Gases',
    grades: [11],
    status: 'live',
  },
  {
    id: 'brain-3d',
    title: 'Human Brain — 3D',
    description: 'Rotate a real human brain and see the cerebrum, cerebellum, and brainstem from every angle.',
    topic: 'Neural Control & Coordination',
    grades: [11],
    status: 'live',
  },
  {
    id: 'pancreas-3d',
    title: 'Human Pancreas — 3D',
    description: 'Rotate a pancreas cross-section, shown here with the stomach and duodenum for context.',
    topic: 'Chemical Coordination & Integration',
    grades: [11],
    status: 'live',
  },
];
