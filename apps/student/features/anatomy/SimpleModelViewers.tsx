'use client';

/**
 * Thin, zero-prop wrappers around SimpleModelViewer — one per `simulation_id`
 * registered in EXTRA_SIMULATORS (apps/student/features/books/lib/extraSimulators.tsx)
 * and packages/data/simulations/biologySimulations.ts. Class 11 Biology sweep,
 * 2026-07-15 — see _agents/state/LIVE_BOOKS_STATE.md changelog for the placement map.
 *
 * Every source model is Sketchfab CC BY 4.0 unless noted (nephron is Sketchfab
 * "Free Standard" — commercial use permitted, per-model detail in project memory).
 */

import { SimpleModelViewer } from './SimpleModelViewer';

export function CoronavirusViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/coronavirus-v1.glb"
      title="SARS-CoV-2 — 3D"
      credit='3D model: "Lowpoly Coronavirus (SARS-CoV-2)" by tales, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/lowpoly-coronavirus-sars-cov-2-81acdfb6457b471c9aa355f1925fe2b9.'
    />
  );
}

export function SeaStarViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/sea-star-v1.glb"
      title="Sea Star — 3D"
      credit='3D model: "Sea Star" by RISD Nature Lab, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/sea-star-a017feaa16de43f3b491f7163cdfa1ad.'
    />
  );
}

export function FlowerAnatomyViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/flower-v1.glb"
      title="Anatomy of a Flower — 3D"
      credit='3D model: "Anatomy of a Flower" by arloopa, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/anatomy-of-a-flower-4ce0afd091d742e286a0de156e183d95.'
    />
  );
}

export function RootStructureViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/root-v1.glb"
      title="Internal Root Structure — 3D"
      credit='3D model: "Internal Root Structure" by arloopa, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/internal-root-structure-ab72ac8a4c584a8baa35b6dc90bc361f.'
    />
  );
}

export function FrogAnatomyViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/frog-v1.glb"
      title="Frog Anatomy — 3D"
      credit='3D model: "Anatomy Frog" by Brad Short, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/anatomy-frog-fb3317347dfd4587b2ca370d5aa927a6.'
    />
  );
}

export function AnimalCellViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/animal-cell-v1.glb"
      title="Animal Cell — 3D"
      credit='3D model: "Simple Animal Cell Model" by maryk, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/simple-animal-cell-model-839832a82ead4d9ea3a748f48fd5de88.'
    />
  );
}

export function PlantCellViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/plant-cell-v1.glb"
      title="Plant Cell — 3D"
      credit='3D model: "Plant Cell | Biology" by Oliver, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/plant-cell-biology-0640c7a14f41400fbdac382c7de1d776.'
    />
  );
}

export function MitochondriaViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/mitochondria-v1.glb"
      title="Mitochondria — 3D"
      credit='3D model: "Mitochondria" by brianj.seely, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/mitochondria-7445a425050e49daa881070ca6917a91.'
    />
  );
}

export function LysosomeViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/lysosome-v1.glb"
      title="Lysosome — 3D"
      credit='3D model: "Lysosome" by arloopa, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/lysosome-6bd2957542ae4625aa0dcd180d979f9b.'
    />
  );
}

export function DNAHelixViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/dna-v1.glb"
      title="DNA Double Helix — 3D"
      credit='3D model: "DNA" by Holoxica, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/dna-60e95170b37549e3b45ee490b74bb112.'
    />
  );
}

export function LungsViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/lungs-v1.glb"
      title="Human Lungs — 3D"
      credit='3D model: "Realistic Human Lungs" by neshallads, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/realistic-human-lungs-ce09f4099a68467880f46e61eb9a3531.'
    />
  );
}

export function NephronViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/nephron-v1.glb"
      title="The Nephron — 3D"
      credit='3D model: "Structure Of Nephron" by arloopa, Sketchfab Free Standard licence (commercial use permitted) — sketchfab.com/3d-models/structure-of-nephron-338b7a2396e14055ad3adbbbd007c882.'
    />
  );
}

export function NeuronViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/neuron-v1.glb"
      title="The Neuron — 3D"
      credit='3D model: "Neuron" by tarun_tkg, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/neuron-01d20ef702ee41478a8bc1da8082e504.'
    />
  );
}

export function BrainViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/brain-v1.glb"
      title="Human Brain — 3D"
      credit='3D model: "Human brain, Cerebrum & Brainstem" by FrankJohansson, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/human-brain-cerebrum-brainstem-0aa0e33c5c854d1bab7bac9e1c7acaec.'
    />
  );
}

export function PancreasViewer() {
  return (
    <SimpleModelViewer
      modelUrl="/anatomy/pancreas-v1.glb"
      title="Human Pancreas — 3D"
      credit='3D model: "Human Pancreas Cross section" by arloopa, licensed under Creative Commons Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/human-pancreas-cross-section-f7b30e11b5df445fbdfe0e262e777c85.'
    />
  );
}
