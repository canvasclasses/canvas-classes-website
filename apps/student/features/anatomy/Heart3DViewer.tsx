'use client';

/**
 * Heart3DViewer — flagship interactive 3D anatomy simulator for Live Books.
 *
 * Rendered as an INJECTED simulator (id: 'heart-3d') via ExtraSimulatorsProvider
 * in BookReader.tsx, exactly like 'atomic-models'. A page references it with a
 * normal `simulation` block: { type: 'simulation', simulation_id: 'heart-3d' }.
 * It is zero-prop and fully self-contained, matching the simulator contract in
 * packages/book-renderer/blocks/SimulationBlockRenderer.tsx.
 *
 * Stack: three + @react-three/fiber + @react-three/drei (already in apps/student).
 *
 * Model source: static .glb in apps/student/public/anatomy/, see HEART_MODEL_URL
 * for the current asset + its licence. We load the UNMODIFIED mesh and do all
 * peel/colour/label work at runtime, which keeps us in attribution-only territory
 * (no modified mesh is ever distributed).
 *
 * ── STRUCTURE NAMING CONTRACT ──────────────────────────────────────────────────
 * The HEART_STRUCTURES `match` arrays ARE the naming contract: name the MESH
 * objects in Blender to contain these tokens (e.g. "right_atrium", "aorta",
 * "myocardium") and they auto-bind to layers + labels here. Anything unmatched
 * still renders (under the "Other" layer). Tap-to-learn / peel-layers / the
 * guided blood-flow journey all require at least one matched structure — see
 * `hasStructures` below, which hides those panels gracefully when none match
 * (current model: a single unsegmented skinned mesh, see note by the URL).
 */

import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useThree, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── Heart model (Sketchfab "Beating-heart" by jalmer, CC BY 4.0) ──────────────
// Served as a STATIC file from apps/student/public/anatomy/. Same-origin (no CORS
// issue — three.js loads models via fetch, which R2's public URL blocks), and a
// static asset can't hang the way a server-side proxy fetch can. Vercel/Next serve
// it from the CDN. (The /anatomy-model R2 proxy route still exists for future
// admin-uploaded models, but the flagship heart uses this robust static path.)
//
// This is a SINGLE skinned mesh driven by an armature (not per-structure meshes
// like the old Z-Anatomy build), so it plays a real beating animation out of the
// box — but HEART_STRUCTURES / classifyMesh below currently can't resolve any
// structure on it (there's nothing named "aorta", "myocardium", etc. at the mesh
// level, only on the internal bones). Tap-to-learn, peel-layers and the guided
// blood-flow journey are gated on `hasStructures` and hide themselves until a
// future pass splits this mesh by bone weight into named regions.
const HEART_MODEL_URL = '/anatomy/heart-v7.glb';

// Design tokens — must match _agents/workflows/SIMULATION_DESIGN_WORKFLOW.md
const C = {
  root: '#0d1117',
  card: '#0B0F15',
  input: '#151E32',
  canvas: 'radial-gradient(circle at center, #1e204a 0%, #050614 100%)',
  indigo: '#6366f1',
  indigoLt: '#818cf8',
  indigoXlt: '#c4b5fd',
  emerald: '#34d399',
  border: 'rgba(255,255,255,0.08)',
  textDim: 'rgba(255,255,255,0.5)',
};

// ── Layers: the "peel-away" groups, outer → inner ─────────────────────────────
type LayerId = 'pericardium' | 'myocardium' | 'chambers' | 'valves' | 'vessels' | 'other';

const HEART_LAYERS: { id: LayerId; label: string; tint: string; defaultOn: boolean }[] = [
  { id: 'pericardium', label: 'Pericardium (outer sac)', tint: '#94a3b8', defaultOn: false },
  { id: 'myocardium',  label: 'Heart muscle (papillary)', tint: '#f472b6', defaultOn: true },
  { id: 'chambers',    label: 'Chambers',                tint: '#818cf8', defaultOn: true },
  { id: 'valves',      label: 'Valves',                  tint: '#fbbf24', defaultOn: true },
  { id: 'vessels',     label: 'Great vessels',           tint: '#f87171', defaultOn: true },
  { id: 'other',       label: 'Other structures',        tint: '#64748b', defaultOn: true },
];

// ── Structures: clickable parts with NCERT-aligned labels + one-line blurbs ────
type Structure = { id: string; label: string; layer: LayerId; blurb: string; match: string[] };

const HEART_STRUCTURES: Structure[] = [
  { id: 'right_atrium', label: 'Right atrium', layer: 'chambers',
    blurb: 'Receives deoxygenated blood from the body through the superior and inferior vena cavae.',
    match: ['right_atrium', 'rightatrium', 'atrium_right'] },
  { id: 'right_ventricle', label: 'Right ventricle', layer: 'chambers',
    blurb: 'Pumps deoxygenated blood to the lungs through the pulmonary artery.',
    match: ['right_ventricle', 'rightventricle', 'ventricle_right'] },
  { id: 'left_atrium', label: 'Left atrium', layer: 'chambers',
    blurb: 'Receives oxygenated blood returning from the lungs via the pulmonary veins.',
    match: ['left_atrium', 'leftatrium', 'atrium_left'] },
  { id: 'left_ventricle', label: 'Left ventricle', layer: 'chambers',
    blurb: 'Pumps oxygenated blood to the whole body through the aorta — it has the thickest wall.',
    match: ['left_ventricle', 'leftventricle', 'ventricle_left'] },
  { id: 'papillary', label: 'Papillary muscle', layer: 'myocardium',
    blurb: 'Cone-shaped muscles in the ventricles. Their tendon-like chordae hold the AV valve cusps shut, stopping backflow when the ventricle contracts.',
    match: ['papillary'] },
  { id: 'septum', label: 'Interventricular septum', layer: 'myocardium',
    blurb: 'The muscular wall that separates the two ventricles, keeping oxygenated and deoxygenated blood apart.',
    match: ['septum', 'interventricular'] },
  { id: 'myocardium', label: 'Myocardium (heart wall)', layer: 'myocardium',
    blurb: 'The thick cardiac-muscle layer that contracts to pump blood.',
    match: ['myocardium', 'wall', 'muscle'] },
  { id: 'pericardium', label: 'Pericardium', layer: 'pericardium',
    blurb: 'The double-walled protective sac that surrounds and cushions the heart.',
    match: ['pericardium', 'sac'] },
  { id: 'tricuspid', label: 'Tricuspid valve', layer: 'valves',
    blurb: 'The right atrioventricular valve (three cusps) — stops backflow from the right ventricle into the right atrium.',
    match: ['tricuspid'] },
  { id: 'mitral', label: 'Bicuspid (mitral) valve', layer: 'valves',
    blurb: 'The left atrioventricular valve (two cusps) — stops backflow from the left ventricle into the left atrium.',
    match: ['mitral', 'bicuspid'] },
  { id: 'pulmonary_valve', label: 'Pulmonary semilunar valve', layer: 'valves',
    blurb: 'Guards the opening into the pulmonary artery so blood does not flow back into the right ventricle.',
    match: ['pulmonary_valve', 'pulmonaryvalve'] },
  { id: 'aortic_valve', label: 'Aortic semilunar valve', layer: 'valves',
    blurb: 'Guards the opening into the aorta so blood does not flow back into the left ventricle.',
    match: ['aortic_valve', 'aorticvalve'] },
  { id: 'aorta', label: 'Aorta', layer: 'vessels',
    blurb: 'The largest artery — carries oxygenated blood from the left ventricle to the entire body.',
    match: ['aorta', 'aortic_arch'] },
  { id: 'pulmonary_trunk', label: 'Pulmonary artery', layer: 'vessels',
    blurb: 'Carries deoxygenated blood from the right ventricle to the lungs — the only artery carrying deoxygenated blood.',
    match: ['pulmonary_trunk', 'pulmonary_artery', 'pulmonarytrunk'] },
  { id: 'pulmonary_veins', label: 'Pulmonary veins', layer: 'vessels',
    blurb: 'Carry oxygenated blood from the lungs to the left atrium — the only veins carrying oxygenated blood.',
    match: ['pulmonary_vein', 'pulmonaryvein'] },
  { id: 'svc', label: 'Superior vena cava', layer: 'vessels',
    blurb: 'Returns deoxygenated blood from the upper body to the right atrium.',
    match: ['superior_vena', 'svc', 'superiorvena'] },
  { id: 'ivc', label: 'Inferior vena cava', layer: 'vessels',
    blurb: 'Returns deoxygenated blood from the lower body to the right atrium.',
    match: ['inferior_vena', 'ivc', 'inferiorvena'] },
  { id: 'coronary_artery', label: 'Coronary artery', layer: 'vessels',
    blurb: 'Branches off the aorta to supply the heart muscle itself with oxygenated blood. A blockage here causes a heart attack.',
    match: ['coronary_artery', 'coronary'] },
];

const STRUCTURE_BY_ID = Object.fromEntries(HEART_STRUCTURES.map((s) => [s.id, s]));

function classifyMesh(name: string): { structureId: string | null; layer: LayerId } {
  const n = name.toLowerCase();
  for (const s of HEART_STRUCTURES) {
    if (s.match.some((m) => n.includes(m))) return { structureId: s.id, layer: s.layer };
  }
  return { structureId: null, layer: 'other' };
}

// ──────────────────────────────────────────────────────────────────────────────

type LayerState = Record<LayerId, { on: boolean; opacity: number }>;

function initialLayerState(): LayerState {
  const s = {} as LayerState;
  for (const l of HEART_LAYERS) s[l.id] = { on: l.defaultOn, opacity: 1 };
  return s;
}

function HeartModel({
  url,
  layers,
  section,
  selectedId,
  highlightId,
  onSelect,
  onReady,
}: {
  url: string;
  layers: LayerState;
  section: { on: boolean; t: number };
  selectedId: string | null;
  highlightId: string | null;
  onSelect: (id: string | null, point: THREE.Vector3 | null) => void;
  onReady?: (info: { model: THREE.Object3D; present: LayerId[]; hasStructures: boolean }) => void;
}) {
  const { gl, camera, controls, invalidate } = useThree();
  const { scene, animations } = useGLTF(url, false); // draco off, meshopt on (gltfpack -cc)

  // Clone so per-mesh material edits never bleed into the cached gltf.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Play the model's own beat animation (armature-driven contraction), looping,
  // as soon as it's ready. useAnimations re-binds cleanly to the cloned scene.
  // `actions` is a lazily-populated object (drei only instantiates an entry once
  // it's accessed by name) — Object.values(actions) can come back empty even
  // when a clip exists, so index by `names[0]` instead of relying on enumeration.
  const { actions, names } = useAnimations(animations, model as unknown as THREE.Object3D);
  useEffect(() => {
    const clip = names[0] ? actions[names[0]] : null;
    clip?.reset().play();
    return () => { clip?.stop(); };
  }, [actions, names]);
  // The beat is a continuous clip, so the canvas must keep rendering while
  // mounted — override the parent's frameloop="demand" for this component only.
  useFrame(() => invalidate());

  const meshes = useRef<THREE.Mesh[]>([]);
  const bounds = useRef(new THREE.Box3());
  const clipPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, -1), 0));
  // Hold onReady in a ref so the tag effect doesn't depend on its (inline)
  // identity — otherwise it re-runs every render and thrashes the scene.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  // Tag every mesh once: clone material, record layer/structure, double-side.
  useEffect(() => {
    gl.localClippingEnabled = true;
    const list: THREE.Mesh[] = [];
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const { structureId, layer } = classifyMesh(mesh.name);
      mesh.userData.structureId = structureId;
      mesh.userData.layer = layer;
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      mat.transparent = true;
      // Single-sided by default: the Z-Anatomy chambers are open shells, and
      // double-siding makes their interiors show through the openings (the "mush"
      // look). We flip to DoubleSide only while cross-section is active so the cut
      // face reads as solid.
      mat.side = THREE.FrontSide;
      mat.clipShadows = true;
      mesh.userData.baseEmissive = (mat.emissive?.clone?.() ?? new THREE.Color(0x000000));
      mesh.material = mat;
      list.push(mesh);
    });
    meshes.current = list;
    bounds.current.setFromObject(model);
    const present = Array.from(new Set(list.map((m) => m.userData.layer as LayerId)));
    const hasStructures = list.some((m) => m.userData.structureId != null);
    onReadyRef.current?.({ model, present, hasStructures });
  }, [model, gl]);

  // Frame the camera to the model on load + on REAL canvas resize only (e.g. the
  // modal growing the canvas). Never per-frame — so it never resets the user's
  // zoom or the blood-flow animation (drei <Bounds observe> did, hence manual).
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const frame = () => {
      const box = new THREE.Box3().setFromObject(model);
      if (box.isEmpty()) return;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const vfov = (cam.fov * Math.PI) / 180;
      const fitH = size.y / 2 / Math.tan(vfov / 2);
      const fitW = size.x / 2 / Math.tan(vfov / 2) / (cam.aspect || 1);
      const dist = Math.max(fitH, fitW) * 1.4 + size.z / 2;
      const dir = new THREE.Vector3(0.25, 0, 1).normalize();
      cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));
      cam.near = Math.max(dist / 100, 0.001);
      cam.far = dist * 100;
      cam.updateProjectionMatrix();
      const ctrl = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
      if (ctrl?.target) { ctrl.target.copy(center); ctrl.update?.(); }
      invalidate();
    };
    let raf = 0;
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(gl.domElement.parentElement || gl.domElement);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [model, camera, controls, gl, invalidate]);

  // Apply layer visibility + opacity.
  useEffect(() => {
    for (const mesh of meshes.current) {
      const st = layers[mesh.userData.layer as LayerId];
      mesh.visible = st.on;
      (mesh.material as THREE.MeshStandardMaterial).opacity = st.opacity;
    }
  }, [layers]);

  // Apply cross-section clipping plane.
  useEffect(() => {
    const box = bounds.current;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    // t=0 → whole heart visible, t=1 → fully cut. Plane keeps z < constant.
    clipPlane.current.constant = center.z + size.z / 2 - section.t * size.z;
    const planes = section.on ? [clipPlane.current] : [];
    for (const mesh of meshes.current) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.clippingPlanes = planes;
      // Show interior faces only while cutting, so the cross-section looks solid.
      mat.side = section.on ? THREE.DoubleSide : THREE.FrontSide;
    }
  }, [section]);

  // Highlight: the blood-flow current structure (emerald) takes priority, then a
  // tapped/selected structure (indigo); everything else returns to base.
  useEffect(() => {
    for (const mesh of meshes.current) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat.emissive) continue;
      const sid = mesh.userData.structureId as string | null;
      if (sid && sid === highlightId) {
        mat.emissive.set(C.emerald);
        mat.emissiveIntensity = 0.7;
      } else if (sid && sid === selectedId) {
        mat.emissive.set(C.indigo);
        mat.emissiveIntensity = 0.55;
      } else {
        mat.emissive.copy(mesh.userData.baseEmissive as THREE.Color);
        mat.emissiveIntensity = 1;
      }
    }
  }, [selectedId, highlightId]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const id = (e.object as THREE.Mesh).userData.structureId as string | null;
    onSelect(id ?? null, e.point.clone());
  };

  return (
    <primitive
      object={model}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    />
  );
}

// ── "Follow a drop of blood" — a GUIDED, step-by-step journey of ONE drop ─────
// The drop travels one leg at a time and PAUSES at each structure; the parent
// lights up + names that structure and shows a plain-English caption over the
// canvas. The drop visibly turns blue→red crossing the lungs (and red→blue at
// the body), so a non-biology learner can follow exactly what happens, where.
export type FlowStop = { id: string; label: string; oxy: boolean; caption: string };
export const FLOW_STOPS: FlowStop[] = [
  { id: 'svc', label: 'Vena cava', oxy: false,
    caption: 'Oxygen-poor blood (blue) from the body arrives at the heart through the vena cava.' },
  { id: 'right_atrium', label: 'Right atrium', oxy: false,
    caption: 'It collects in the right atrium — the top-right chamber.' },
  { id: 'right_ventricle', label: 'Right ventricle', oxy: false,
    caption: 'It drops down into the right ventricle, through the tricuspid valve.' },
  { id: 'pulmonary_trunk', label: 'Pulmonary artery', oxy: false,
    caption: 'The right ventricle squeezes — blood is pushed out the pulmonary artery toward the lungs.' },
  { id: 'pulmonary_veins', label: 'Pulmonary veins', oxy: true,
    caption: 'In the lungs it picks up oxygen and turns red, then returns through the pulmonary veins.' },
  { id: 'left_atrium', label: 'Left atrium', oxy: true,
    caption: 'This oxygen-rich (red) blood fills the left atrium.' },
  { id: 'left_ventricle', label: 'Left ventricle', oxy: true,
    caption: 'It drops into the left ventricle — the strongest chamber, with the thickest wall.' },
  { id: 'aorta', label: 'Aorta', oxy: true,
    caption: 'The left ventricle pumps hard — blood blasts out the aorta to the whole body, then loops back.' },
];
const BLUE_HEX = '#3b82f6';
const RED_HEX = '#ef4444';
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

// Parent-controlled: the drop animates from stop `from` → stop `stop` whenever
// `animKey` changes; otherwise it rests at `stop`. The parent (React) owns step
// progression, play/pause and seeking — this component just renders the drop +
// the on-model name label. Self-invalidates only while animating (demand mode).
function BloodFlow({
  model,
  active,
  from,
  stop,
  animKey,
}: {
  model: THREE.Object3D;
  active: boolean;
  from: number;
  stop: number;
  animKey: number;
}) {
  const ANIM = 1.8; // seconds to travel one leg
  const drop = useRef<THREE.Mesh>(null);
  const centroids = useRef<(THREE.Vector3 | null)[] | null>(null);
  const radius = useRef(0.01);
  const t = useRef(1);
  const labeledStop = useRef(-1);
  const invalidate = useThree((s) => s.invalidate);
  const [labelPos, setLabelPos] = useState<THREE.Vector3 | null>(null);

  useEffect(() => { centroids.current = null; labeledStop.current = -1; }, [model, active]);
  // (Re)start the leg animation whenever the parent bumps animKey.
  useEffect(() => { if (active) { t.current = 0; invalidate(); } }, [animKey, active, invalidate]);

  useFrame((state, dt) => {
    if (!active || !drop.current) return;
    if (!centroids.current) {
      const pts: (THREE.Vector3 | null)[] = [];
      for (const s of FLOW_STOPS) {
        const box = new THREE.Box3();
        let found = false;
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh && o.userData?.structureId === s.id) { box.expandByObject(o); found = true; }
        });
        pts.push(found && !box.isEmpty() ? box.getCenter(new THREE.Vector3()) : null);
      }
      centroids.current = pts;
      const msize = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).length();
      radius.current = Math.max(msize * 0.02, 0.001);
    }
    const C = centroids.current;
    const a = C[from] ?? C[stop];
    const b = C[stop] ?? a;
    if (!a || !b) return;

    if (t.current < 1) t.current = Math.min(t.current + dt / ANIM, 1);
    const e = easeInOut(t.current);
    drop.current.position.copy(a.clone().lerp(b, e));
    drop.current.scale.setScalar(radius.current);
    const c0 = new THREE.Color(FLOW_STOPS[from].oxy ? RED_HEX : BLUE_HEX);
    const c1 = new THREE.Color(FLOW_STOPS[stop].oxy ? RED_HEX : BLUE_HEX);
    (drop.current.material as THREE.MeshBasicMaterial).color.copy(c0.lerp(c1, e));

    if (labeledStop.current !== stop) {
      labeledStop.current = stop;
      setLabelPos(b.clone());
    }
    if (t.current < 1) state.invalidate(); // keep animating until arrival, then idle
  });

  if (!active) return null;
  return (
    <group>
      <mesh ref={drop}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </mesh>
      {labelPos && (
        <Html position={[labelPos.x, labelPos.y, labelPos.z]} center style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap"
            style={{ background: 'rgba(16,185,129,0.92)', color: '#04140d' }}>
            {FLOW_STOPS[stop].label}
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Error boundary so a failed/missing model never crashes the page ───────────
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Loading() {
  return (
    <Html center>
      <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
        Loading heart…
      </div>
    </Html>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function FlowBtn({
  children,
  onClick,
  label,
  wide,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`${wide ? 'flex-1' : 'w-9'} h-8 rounded-lg text-[12px] font-bold flex items-center justify-center transition-colors`}
      style={{ background: 'rgba(99,102,241,0.12)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.28)' }}
    >
      {children}
    </button>
  );
}

export default function Heart3DViewer() {
  const [layers, setLayers] = useState<LayerState>(initialLayerState);
  const [section, setSection] = useState({ on: false, t: 0.5 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<THREE.Vector3 | null>(null);
  const [present, setPresent] = useState<LayerId[] | null>(null);
  const [hasStructures, setHasStructures] = useState(true);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [bloodFlow, setBloodFlow] = useState(false);
  const [flowStop, setFlowStop] = useState(0);
  const [flowFrom, setFlowFrom] = useState(0);
  const [flowPlaying, setFlowPlaying] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const flowStructure = bloodFlow ? FLOW_STOPS[flowStop] : null;
  const N = FLOW_STOPS.length;

  // Auto-advance the journey while playing; each step reschedules the next.
  useEffect(() => {
    if (!bloodFlow || !flowPlaying) return;
    const id = setTimeout(() => {
      setFlowFrom(flowStop);
      setFlowStop((flowStop + 1) % N);
      setAnimKey((k) => k + 1);
    }, 4200);
    return () => clearTimeout(id);
  }, [bloodFlow, flowPlaying, flowStop, N]);

  const startFlow = () => {
    setBloodFlow(true); setFlowFrom(0); setFlowStop(0); setAnimKey((k) => k + 1); setFlowPlaying(true);
  };
  const seekFlow = (target: number) => {
    if (!bloodFlow) setBloodFlow(true);
    setFlowFrom(flowStop);
    setFlowStop(((target % N) + N) % N);
    setAnimKey((k) => k + 1);
    setFlowPlaying(false);
  };
  const replayStep = () => {
    setFlowFrom((flowStop - 1 + N) % N); setAnimKey((k) => k + 1); setFlowPlaying(false);
  };

  const toggleLayer = (id: LayerId) =>
    setLayers((p) => ({ ...p, [id]: { ...p[id], on: !p[id].on } }));
  const setOpacity = (id: LayerId, opacity: number) =>
    setLayers((p) => ({ ...p, [id]: { ...p[id], opacity } }));

  const selected = selectedId ? STRUCTURE_BY_ID[selectedId] : null;
  const hasModel = HEART_MODEL_URL.length > 0;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.root, border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-white/90">The Human Heart — explore in 3D</h3>
          <p className="text-[11px]" style={{ color: C.textDim }}>
            {hasStructures
              ? 'Drag to rotate · scroll to zoom · tap any part to learn what it does'
              : 'Drag to rotate · scroll to zoom · watch it beat'}
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(99,102,241,0.12)', color: C.indigoLt }}>
          Interactive
        </span>
      </div>

      <div className="grid gap-3 px-3 pb-3 md:grid-cols-[1fr_240px]">
        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden" style={{ background: C.canvas, aspectRatio: '16 / 9', minHeight: 320 }}>
          {hasModel ? (
            <ModelBoundary fallback={<NotReady />}>
              <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 3], fov: 45 }}
                frameloop="demand"
                gl={{ antialias: true }}
              >
                <ambientLight intensity={0.7} />
                <hemisphereLight intensity={0.5} groundColor={'#1e204a'} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <directionalLight position={[-5, -2, -3]} intensity={0.3} />
                <Suspense fallback={<Loading />}>
                  <HeartModel
                    url={HEART_MODEL_URL}
                    layers={layers}
                    section={section}
                    selectedId={selectedId}
                    highlightId={flowStructure ? flowStructure.id : null}
                    onSelect={(id, point) => { setSelectedId(id); setLabelPos(point); }}
                    onReady={(info) => { setModel(info.model); setPresent(info.present); setHasStructures(info.hasStructures); }}
                  />
                  {hasStructures && model && <BloodFlow model={model} active={bloodFlow} from={flowFrom} stop={flowStop} animKey={animKey} />}
                  {hasStructures && selected && labelPos && (
                    <Html position={[labelPos.x, labelPos.y, labelPos.z]} occlude center
                      style={{ pointerEvents: 'none' }}>
                      <div className="px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap"
                        style={{ background: 'rgba(99,102,241,0.9)', color: '#fff' }}>
                        {selected.label}
                      </div>
                    </Html>
                  )}
                </Suspense>
                {/* No damping: with frameloop="demand" inertia would stutter.
                    drei invalidates on control change, so drag stays responsive. */}
                <OrbitControls enablePan makeDefault />
              </Canvas>
            </ModelBoundary>
          ) : (
            <NotReady />
          )}

          {/* Guided blood-flow caption — big, right over the action */}
          {hasModel && hasStructures && flowStructure && (
            <div className="absolute inset-x-0 bottom-0 p-4"
              style={{ background: 'linear-gradient(to top, rgba(5,6,12,0.96), rgba(5,6,12,0))', pointerEvents: 'none' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: flowStructure.oxy ? '#f87171' : '#60a5fa' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: flowStructure.oxy ? '#f87171' : '#60a5fa' }}>
                  Step {flowStop + 1} of {FLOW_STOPS.length} · {flowStructure.oxy ? 'Oxygen-rich blood' : 'Oxygen-poor blood'}
                </span>
              </div>
              <p className="text-[14px] leading-snug font-medium text-white/90" style={{ maxWidth: 620 }}>
                {flowStructure.caption}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Layers */}
          {hasStructures && (
            <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.indigoLt }}>
                Peel the layers
              </p>
              <div className="flex flex-col gap-2">
                {HEART_LAYERS.filter((l) => !present || present.includes(l.id)).map((l) => {
                  const st = layers[l.id];
                  return (
                    <div key={l.id}>
                      <button
                        onClick={() => toggleLayer(l.id)}
                        className="w-full flex items-center gap-2 text-left text-[12px] font-medium transition-colors"
                        style={{ color: st.on ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)' }}
                      >
                        <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                          style={{ background: st.on ? l.tint : 'transparent', border: `1.5px solid ${l.tint}` }} />
                        {l.label}
                      </button>
                      {st.on && (
                        <input
                          type="range" min={0.15} max={1} step={0.05} value={st.opacity}
                          onChange={(e) => setOpacity(l.id, parseFloat(e.target.value))}
                          className="w-full mt-1 accent-indigo-400 h-1"
                          aria-label={`${l.label} opacity`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cross-section */}
          <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <button
              onClick={() => setSection((s) => ({ ...s, on: !s.on }))}
              className="w-full flex items-center gap-2 text-left text-[12px] font-bold uppercase tracking-widest"
              style={{ color: section.on ? C.emerald : C.indigoLt }}
            >
              <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                style={{ background: section.on ? C.emerald : 'transparent', border: `1.5px solid ${section.on ? C.emerald : C.indigoLt}` }} />
              Cross-section
            </button>
            {section.on && (
              <input
                type="range" min={0} max={1} step={0.02} value={section.t}
                onChange={(e) => setSection((s) => ({ ...s, t: parseFloat(e.target.value) }))}
                className="w-full mt-2 accent-emerald-400 h-1"
                aria-label="Cross-section depth"
              />
            )}
            <p className="text-[10px] mt-1" style={{ color: C.textDim }}>
              Slice through to see the chambers and valves inside.
            </p>
          </div>

          {/* Blood flow — "follow a drop of blood" */}
          {hasStructures && (
          <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <button
              onClick={() => (bloodFlow ? setBloodFlow(false) : startFlow())}
              className="w-full flex items-center gap-2 text-left text-[12px] font-bold uppercase tracking-widest"
              style={{ color: bloodFlow ? C.emerald : C.indigoLt }}
            >
              <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                style={{ background: bloodFlow ? C.emerald : 'transparent', border: `1.5px solid ${bloodFlow ? C.emerald : C.indigoLt}` }} />
              {bloodFlow ? 'Stop the journey' : 'Follow a drop of blood'}
            </button>
            {bloodFlow ? (
              <>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <FlowBtn label="Previous step" onClick={() => seekFlow(flowStop - 1)}>‹</FlowBtn>
                  <FlowBtn label={flowPlaying ? 'Pause' : 'Play'} wide onClick={() => setFlowPlaying((p) => !p)}>
                    {flowPlaying ? '❚❚ Pause' : '▶ Play'}
                  </FlowBtn>
                  <FlowBtn label="Next step" onClick={() => seekFlow(flowStop + 1)}>›</FlowBtn>
                  <FlowBtn label="Replay this step" onClick={replayStep}>↻</FlowBtn>
                </div>
                <p className="text-[10px] mt-2 tabular-nums" style={{ color: C.textDim }}>
                  Step {flowStop + 1} of {N} · pause to read, then Play to continue.
                </p>
              </>
            ) : (
              <p className="text-[10px] mt-1.5" style={{ color: C.textDim }}>
                A guided, step-by-step tour: one drop travels through the heart, pausing at each part with a plain-English explanation.
              </p>
            )}
          </div>
          )}
        </div>
      </div>

      {/* The circuit — a clickable sequence of the whole journey, below the sim */}
      {hasModel && hasStructures && (
        <div className="mx-3 mb-3 rounded-xl px-3 py-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.indigoLt }}>
            The circuit — tap a step to jump there
          </p>
          <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
            {FLOW_STOPS.map((s, i) => (
              <div key={`${s.id}-${i}`} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => seekFlow(i)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap"
                  style={{
                    background: bloodFlow && flowStop === i ? 'rgba(16,185,129,0.16)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${bloodFlow && flowStop === i ? 'rgba(16,185,129,0.55)' : 'rgba(255,255,255,0.08)'}`,
                    color: bloodFlow && flowStop === i ? '#fff' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <span className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: s.oxy ? '#f87171' : '#60a5fa' }} />
                  {i + 1}. {s.label}
                </button>
                {i < FLOW_STOPS.length - 1 && (
                  <span className="text-[11px] shrink-0"
                    style={{ color: i === 3 ? '#34d399' : 'rgba(255,255,255,0.25)' }}>
                    {i === 3 ? '· lungs +O₂ ·' : '→'}
                  </span>
                )}
              </div>
            ))}
            <span className="text-[11px] shrink-0 self-center pl-1" style={{ color: 'rgba(255,255,255,0.25)' }}>↺ to body</span>
          </div>
        </div>
      )}

      {/* Selected-structure detail panel */}
      {hasStructures && (
        <div className="mx-3 mb-3 rounded-xl px-4 py-3 min-h-[64px]"
          style={{ background: C.input, border: `1px solid ${C.border}` }}>
          {selected ? (
            <>
              <p className="text-[13px] font-bold" style={{ color: C.indigoXlt }}>{selected.label}</p>
              <p className="text-[12.5px] leading-relaxed mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {selected.blurb}
              </p>
            </>
          ) : (
            <p className="text-[12px]" style={{ color: C.textDim }}>
              Tap any structure on the model to read what it does.
            </p>
          )}
        </div>
      )}

      {/* CC BY attribution — required by the model licence (kept in-UI) */}
      <p className="px-4 pb-3 text-[9.5px] leading-snug" style={{ color: 'rgba(255,255,255,0.28)' }}>
        3D model: "Beating-heart" by jalmer (Dreamwasabducted), licensed under Creative Commons
        Attribution 4.0 (CC BY 4.0) — sketchfab.com/3d-models/beating-heart-d9845afb1ee64ad094adc96320c67d98.
      </p>
    </div>
  );
}

function NotReady() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
      <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: C.indigoLt }}>
        Heart model loading soon
      </p>
      <p className="text-[11px] max-w-[280px]" style={{ color: C.textDim }}>
        The interactive 3D heart is being prepared. Controls are live — the model attaches here once published.
      </p>
    </div>
  );
}

// Preload only when a URL is configured (avoids a fetch to an empty string).
if (HEART_MODEL_URL) useGLTF.preload(HEART_MODEL_URL, false);
