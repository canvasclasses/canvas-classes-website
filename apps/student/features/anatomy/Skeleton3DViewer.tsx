'use client';

/**
 * Skeleton3DViewer — the first full BODY-SYSTEM 3D anatomy simulator for Live Books
 * (the heart was a single organ). Rendered as an INJECTED simulator
 * (id: 'skeleton-3d') via ExtraSimulatorsProvider in extraSimulators.tsx, exactly
 * like 'heart-3d'. A page references it with a normal `simulation` block:
 * { type: 'simulation', simulation_id: 'skeleton-3d' }.
 *
 * Built per _agents/workflows/ANATOMY_3D_SIMULATOR_WORKFLOW.md — copies the heart
 * viewer's hard-won rules (single-sided default, MANUAL camera framing, NOT drei
 * <Bounds observe>; frameloop="demand"; 16:9 canvas; tap-to-label; hide-empty-
 * layers; static same-origin .glb hosting; CC BY-SA credit line).
 *
 * Model: Z-Anatomy / BodyParts3D (CC BY-SA, credited in-UI). 218 raw bones were
 * merged into 22 tappable structures (one draw call each) and decimated 506K→111K
 * tris in Blender (scripts/blender/_skeleton_*.py) so it stays phone-smooth.
 *
 * The SKELETON_STRUCTURES `match` arrays ARE the Blender naming contract: each glb
 * node is named exactly one of these tokens. Anything unmatched still renders under
 * the "Other" layer so nothing breaks.
 *
 * Pedagogy (NEET Class 11 "Locomotion & Movement"): 206 bones; AXIAL (skull, spine,
 * ribs, sternum, hyoid) vs APPENDICULAR (girdles + limbs). The journey here is NOT
 * blood flow but a guided region "Tour the skeleton" + a "Name the bone" quiz.
 */

import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';

// Static same-origin .glb (R2's public URL has no CORS header → three.js fetch is
// blocked; a static file can't hang like the server proxy can — see workflow §5.1).
const SKELETON_MODEL_URL = '/anatomy/skeleton-v8.glb';

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
  amber: '#fbbf24',
  sky: '#38bdf8',
  border: 'rgba(255,255,255,0.08)',
  textDim: 'rgba(255,255,255,0.5)',
};

// ── Layers: the "peel-away" body regions ──────────────────────────────────────
type LayerId = 'skull' | 'spine' | 'thorax' | 'upper' | 'lower' | 'ligaments' | 'other';

const SKELETON_LAYERS: { id: LayerId; label: string; tint: string; defaultOn: boolean }[] = [
  { id: 'skull',     label: 'Skull',                          tint: '#f0abfc', defaultOn: true },
  { id: 'spine',     label: 'Vertebral column',               tint: '#a5b4fc', defaultOn: true },
  { id: 'thorax',    label: 'Thorax (ribs + sternum)',        tint: '#fca5a5', defaultOn: true },
  { id: 'upper',     label: 'Pectoral girdle + upper limb',   tint: '#fcd34d', defaultOn: true },
  { id: 'lower',     label: 'Pelvic girdle + lower limb',     tint: '#6ee7b7', defaultOn: true },
  // Ligaments + joint cartilage are off by default — they're numerous and clutter
  // the clean bone view; turn on to study the joints.
  { id: 'ligaments', label: 'Ligaments + joint cartilage',    tint: '#d8caaa', defaultOn: false },
  { id: 'other',     label: 'Other structures',               tint: '#64748b', defaultOn: true },
];

// ── Structures: clickable bones with NCERT/NEET labels + blurbs ───────────────
type Division = 'axial' | 'appendicular';
type Structure = {
  // division null = soft tissue (ligaments/cartilage) — excluded from the
  // axial/appendicular bone split so it never fades under that toggle.
  id: string; label: string; layer: LayerId; division: Division | null; blurb: string; match: string[];
};

const SKELETON_STRUCTURES: Structure[] = [
  // ── Skull region (axial) — individual cranial + facial bones ──
  // Cranial bones (8 — the braincase):
  { id: 'frontal_bone', label: 'Frontal bone', layer: 'skull', division: 'axial',
    blurb: 'Forms the forehead and the roof of the eye sockets — one of the eight cranial bones that wrap around and protect the brain.',
    match: ['frontal_bone'] },
  { id: 'parietal', label: 'Parietal bones (2)', layer: 'skull', division: 'axial',
    blurb: 'The pair of bones forming most of the roof and upper sides of the cranium (the braincase).',
    match: ['parietal'] },
  { id: 'temporal_bone', label: 'Temporal bones (2)', layer: 'skull', division: 'axial',
    blurb: 'Form the lower sides and base of the skull around the ears, and house the middle and inner ear (including the three tiny ear ossicles — the smallest bones in the body).',
    match: ['temporal_bone'] },
  { id: 'occipital_bone', label: 'Occipital bone', layer: 'skull', division: 'axial',
    blurb: 'Forms the back and base of the skull. Its large opening, the foramen magnum, is where the spinal cord joins the brain.',
    match: ['occipital_bone'] },
  { id: 'sphenoid_bone', label: 'Sphenoid bone', layer: 'skull', division: 'axial',
    blurb: 'A butterfly-shaped bone across the base of the skull that keys into almost every other cranial bone and cradles the pituitary gland.',
    match: ['sphenoid_bone'] },
  { id: 'ethmoid_bone', label: 'Ethmoid bone', layer: 'skull', division: 'axial',
    blurb: 'A light, spongy bone between the eyes that helps build the nasal cavity, the inner eye sockets and the nasal septum.',
    match: ['ethmoid_bone'] },
  // Facial bones (14):
  { id: 'maxilla', label: 'Maxillae (upper jaw, 2)', layer: 'skull', division: 'axial',
    blurb: 'The two fused upper-jaw bones. They hold the upper teeth and form the front of the hard palate and the floor of the nose.',
    match: ['maxilla'] },
  { id: 'zygomatic', label: 'Zygomatic bones (cheekbones, 2)', layer: 'skull', division: 'axial',
    blurb: 'The cheekbones — they shape the cheeks and form the outer wall and floor of the eye sockets.',
    match: ['zygomatic'] },
  { id: 'nasal_bone', label: 'Nasal bones (2)', layer: 'skull', division: 'axial',
    blurb: 'The two small bones that form the bony bridge of the nose; the tip of the nose is cartilage, not bone.',
    match: ['nasal_bone'] },
  { id: 'lacrimal_bone', label: 'Lacrimal bones (2)', layer: 'skull', division: 'axial',
    blurb: 'The smallest facial bones, set in the inner wall of each eye socket; they channel tears down into the nose.',
    match: ['lacrimal_bone'] },
  { id: 'palatine_bone', label: 'Palatine bones (2)', layer: 'skull', division: 'axial',
    blurb: 'L-shaped bones that form the back of the hard palate (roof of the mouth) and part of the nasal cavity.',
    match: ['palatine_bone'] },
  { id: 'inferior_nasal_concha', label: 'Inferior nasal conchae (2)', layer: 'skull', division: 'axial',
    blurb: 'Scroll-like bones on the side walls of the nasal cavity that swirl, warm and filter the air you breathe in.',
    match: ['inferior_nasal_concha'] },
  { id: 'vomer', label: 'Vomer', layer: 'skull', division: 'axial',
    blurb: 'A thin, flat bone forming the lower part of the nasal septum — the partition between the two nostrils.',
    match: ['vomer'] },
  { id: 'mandible', label: 'Mandible (lower jaw)', layer: 'skull', division: 'axial',
    blurb: 'The only movable bone of the skull. It forms the lower jaw, bears the lower teeth, and hinges at the temporomandibular joint so you can chew and speak.',
    match: ['mandible'] },
  { id: 'hyoid', label: 'Hyoid bone', layer: 'skull', division: 'axial',
    blurb: 'A small U-shaped bone in the neck that anchors the tongue muscles. It is the only bone in the body that does not articulate (join) directly with any other bone.',
    match: ['hyoid'] },
  // ── Vertebral column (axial) ──
  { id: 'cervical_vertebrae', label: 'Cervical vertebrae (7)', layer: 'spine', division: 'axial',
    blurb: 'The seven neck vertebrae. The first (atlas) supports the skull; the second (axis) lets the head turn side to side. All mammals — even a giraffe — have exactly seven.',
    match: ['cervical_vertebrae'] },
  { id: 'thoracic_vertebrae', label: 'Thoracic vertebrae (12)', layer: 'spine', division: 'axial',
    blurb: 'Twelve vertebrae of the upper back. Each one bears a pair of ribs, anchoring the rib cage to the spine.',
    match: ['thoracic_vertebrae'] },
  { id: 'lumbar_vertebrae', label: 'Lumbar vertebrae (5)', layer: 'spine', division: 'axial',
    blurb: 'Five large vertebrae of the lower back. They are the biggest in the spine because they carry most of the body’s weight.',
    match: ['lumbar_vertebrae'] },
  { id: 'sacrum', label: 'Sacrum', layer: 'spine', division: 'axial',
    blurb: 'Five vertebrae fused into one triangular bone that wedges between the two hip bones to form the back of the pelvis.',
    match: ['sacrum'] },
  { id: 'coccyx', label: 'Coccyx (tailbone)', layer: 'spine', division: 'axial',
    blurb: 'Three to five tiny vertebrae fused at the very base of the spine — the remnant of a tail. Counted as one bone in the vertebral column’s total of 26.',
    match: ['coccyx'] },
  { id: 'intervertebral_discs', label: 'Intervertebral discs', layer: 'spine', division: 'axial',
    blurb: 'Fibrocartilage cushions between the vertebrae. Each has a tough outer ring and a gel-like core that absorbs shock and lets the spine bend and twist. A "slipped disc" is when this bulges out.',
    match: ['intervertebral_discs'] },
  // ── Thorax (axial) ──
  { id: 'ribs', label: 'Ribs (12 pairs)', layer: 'thorax', division: 'axial',
    blurb: 'Twelve pairs of curved bones forming the rib cage that protects the heart and lungs. Pairs 1–7 are "true" ribs (joined to the sternum by cartilage), 8–10 are "false" (joined to the rib above), and 11–12 are "floating" (not joined at the front).',
    match: ['ribs'] },
  { id: 'sternum', label: 'Sternum (breastbone)', layer: 'thorax', division: 'axial',
    blurb: 'The flat dagger-shaped bone in the centre of the chest. The true ribs attach to it. It has three parts: manubrium, body and xiphoid process.',
    match: ['sternum'] },
  { id: 'costal_cartilage', label: 'Costal cartilage', layer: 'thorax', division: 'axial',
    blurb: 'Bars of flexible hyaline cartilage that connect the ribs to the sternum. Their springiness lets the rib cage expand and recoil as you breathe; they are not bone, so they appear whiter and glassier here.',
    match: ['costal_cartilage'] },
  // ── Pectoral girdle + upper limb (appendicular) ──
  { id: 'clavicle', label: 'Clavicle (collarbone)', layer: 'upper', division: 'appendicular',
    blurb: 'Part of the pectoral girdle. This slender bone braces the shoulder at the front, connecting the arm to the sternum. It is the most commonly fractured bone in the body.',
    match: ['clavicle'] },
  { id: 'scapula', label: 'Scapula (shoulder blade)', layer: 'upper', division: 'appendicular',
    blurb: 'A flat triangular bone of the pectoral girdle. Its socket, the glenoid cavity, holds the head of the humerus to form the highly mobile shoulder joint.',
    match: ['scapula'] },
  { id: 'humerus', label: 'Humerus (upper arm)', layer: 'upper', division: 'appendicular',
    blurb: 'The single long bone of the upper arm. It meets the scapula at the shoulder and the radius and ulna at the elbow.',
    match: ['humerus'] },
  { id: 'radius', label: 'Radius', layer: 'upper', division: 'appendicular',
    blurb: 'The forearm bone on the thumb side. It rotates over the ulna to turn the palm up or down (pronation and supination).',
    match: ['radius'] },
  { id: 'ulna', label: 'Ulna', layer: 'upper', division: 'appendicular',
    blurb: 'The forearm bone on the little-finger side. Its upper end forms the bony point of the elbow.',
    match: ['ulna'] },
  { id: 'hand', label: 'Hand (carpals, metacarpals, phalanges)', layer: 'upper', division: 'appendicular',
    blurb: 'Each hand has 27 bones: 8 carpals in the wrist, 5 metacarpals in the palm, and 14 phalanges in the fingers (the thumb has only two).',
    match: ['hand'] },
  // ── Pelvic girdle + lower limb (appendicular) ──
  { id: 'hip_bone', label: 'Hip bone (pelvic girdle)', layer: 'lower', division: 'appendicular',
    blurb: 'Each hip bone is three bones fused together — ilium, ischium and pubis. The two hip bones plus the sacrum form the pelvis, which supports the body and protects the lower organs.',
    match: ['hip_bone'] },
  { id: 'femur', label: 'Femur (thigh bone)', layer: 'lower', division: 'appendicular',
    blurb: 'The longest, strongest and heaviest bone in the body. It runs from the hip socket to the knee and carries the body’s full weight when you stand.',
    match: ['femur'] },
  { id: 'patella', label: 'Patella (kneecap)', layer: 'lower', division: 'appendicular',
    blurb: 'The small bone in front of the knee joint. It is a sesamoid bone — formed inside a tendon — and protects the knee while improving the leverage of the thigh muscle.',
    match: ['patella'] },
  { id: 'tibia', label: 'Tibia (shin bone)', layer: 'lower', division: 'appendicular',
    blurb: 'The thick weight-bearing bone of the lower leg, on the inner (big-toe) side. Its front edge is the shin you can feel under the skin.',
    match: ['tibia'] },
  { id: 'fibula', label: 'Fibula', layer: 'lower', division: 'appendicular',
    blurb: 'The thin bone of the lower leg, on the outer side. It bears little weight but anchors muscles and forms the outer ankle bump.',
    match: ['fibula'] },
  { id: 'foot', label: 'Foot (tarsals, metatarsals, phalanges)', layer: 'lower', division: 'appendicular',
    blurb: 'Each foot has 26 bones: 7 tarsals in the ankle, 5 metatarsals in the sole, and 14 phalanges in the toes. Arranged in arches, they spring and absorb shock when you walk.',
    match: ['foot'] },
  // ── Soft tissue (division null → ignored by the axial/appendicular toggle) ──
  { id: 'ligaments', label: 'Ligaments', layer: 'ligaments', division: null,
    blurb: 'Tough bands of fibrous connective tissue that tie bone to bone and hold joints together — e.g. the cruciate and collateral ligaments of the knee. They allow movement but resist over-stretching; a "sprain" is a torn ligament.',
    match: ['ligaments'] },
  { id: 'joint_cartilage', label: 'Joint cartilage (menisci & discs)', layer: 'ligaments', division: null,
    blurb: 'Smooth cartilage pads inside joints — such as the menisci of the knee and the labra of the hip and shoulder — that cushion the bones and let them glide almost without friction.',
    match: ['joint_cartilage'] },
];

const STRUCTURE_BY_ID = Object.fromEntries(SKELETON_STRUCTURES.map((s) => [s.id, s]));

function classifyMesh(name: string): { structureId: string | null; layer: LayerId; division: Division | null } {
  const n = name.toLowerCase();
  for (const s of SKELETON_STRUCTURES) {
    if (s.match.some((m) => n.includes(m))) return { structureId: s.id, layer: s.layer, division: s.division };
  }
  return { structureId: null, layer: 'other', division: null };
}

// ──────────────────────────────────────────────────────────────────────────────

type DivisionMode = 'all' | 'axial' | 'appendicular';
type LayerState = Record<LayerId, { on: boolean; opacity: number }>;

function initialLayerState(): LayerState {
  const s = {} as LayerState;
  for (const l of SKELETON_LAYERS) s[l.id] = { on: l.defaultOn, opacity: 1 };
  return s;
}

const IVORY = new THREE.Color('#e3d4b2');     // warm bone tone (not flat white)
const CARTILAGE = new THREE.Color('#e9edf0'); // cool glossy off-white (cartilage + discs)
const LIGAMENT = new THREE.Color('#d8caaa'); // pale fibrous tan

function SkeletonModel({
  url,
  layers,
  divisionMode,
  selectedId,
  highlightId,
  isolateLayer,
  onSelect,
  onReady,
}: {
  url: string;
  layers: LayerState;
  divisionMode: DivisionMode;
  selectedId: string | null;
  highlightId: string | null;        // tour / quiz target → emerald glow
  isolateLayer: LayerId | null;      // tour: show only this region
  onSelect: (id: string | null, point: THREE.Vector3 | null) => void;
  onReady?: (info: { present: LayerId[] }) => void;
}) {
  const { gl, camera, controls, invalidate } = useThree();
  const { scene } = useGLTF(url, false); // draco off, static glb (matches heart)

  const model = useMemo(() => scene.clone(true), [scene]);
  const meshes = useRef<THREE.Mesh[]>([]);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  // Tag every mesh once: clone material to ivory, record layer/structure/division.
  useEffect(() => {
    const list: THREE.Mesh[] = [];
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const { structureId, layer, division } = classifyMesh(mesh.name);
      mesh.userData.structureId = structureId;
      mesh.userData.layer = layer;
      mesh.userData.division = division;
      const lname = mesh.name.toLowerCase();
      const isLigament = lname.includes('ligament');
      const isCartilage = lname.includes('cartilage') || lname.includes('disc') || lname.includes('intervertebral');
      const src = mesh.material as THREE.MeshStandardMaterial;
      const mat = src.clone();
      if (isLigament) {            // pale fibrous, matte-ish
        mat.color.copy(LIGAMENT); mat.roughness = 0.6; mat.envMapIntensity = 0.35;
      } else if (isCartilage) {    // wetter/glossier + more reflective than bone
        mat.color.copy(CARTILAGE); mat.roughness = 0.2; mat.envMapIntensity = 0.85;
      } else {                     // bone
        mat.color.copy(IVORY); mat.roughness = 0.5; mat.envMapIntensity = 0.5;
      }
      mat.metalness = 0;
      mat.transparent = true;
      mat.side = THREE.FrontSide; // skeleton bones are solid → single-sided is clean
      mat.emissive = new THREE.Color(0x000000);
      mesh.material = mat;
      list.push(mesh);
    });
    meshes.current = list;
    const present = Array.from(new Set(list.map((m) => m.userData.layer as LayerId)));
    onReadyRef.current?.({ present });
    invalidate();
  }, [model, gl, invalidate]);

  // Frame the camera on load + on REAL canvas resize only (never per-frame, so it
  // never fights the user's zoom — drei <Bounds observe> does, hence manual).
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
      const dist = Math.max(fitH, fitW) * 1.18 + size.z / 2;
      const dir = new THREE.Vector3(0.08, 0, 1).normalize();
      cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));
      cam.near = Math.max(dist / 100, 0.01);
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

  // Visibility + opacity: layer toggles, the axial/appendicular fade, tour isolate.
  useEffect(() => {
    for (const mesh of meshes.current) {
      const layer = mesh.userData.layer as LayerId;
      const division = mesh.userData.division as Division | null;
      const st = layers[layer];
      let visible = st.on;
      let opacity = st.opacity;
      if (isolateLayer && layer !== isolateLayer) { opacity = 0.06; }
      if (divisionMode !== 'all' && division && division !== divisionMode) { opacity = Math.min(opacity, 0.07); }
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mesh.visible = visible;
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.5;
    }
    invalidate();
  }, [layers, divisionMode, isolateLayer, invalidate]);

  // Emissive highlight cascade: tour/quiz (emerald) > tap-selected (indigo) >
  // active division tint (axial amber / appendicular sky) > none.
  useEffect(() => {
    for (const mesh of meshes.current) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat.emissive) continue;
      const sid = mesh.userData.structureId as string | null;
      const division = mesh.userData.division as Division | null;
      if (sid && sid === highlightId) {
        mat.emissive.set(C.emerald); mat.emissiveIntensity = 0.8;
      } else if (sid && sid === selectedId) {
        mat.emissive.set(C.indigo); mat.emissiveIntensity = 0.6;
      } else if (divisionMode !== 'all' && division === divisionMode) {
        mat.emissive.set(divisionMode === 'axial' ? C.amber : C.sky); mat.emissiveIntensity = 0.4;
      } else {
        mat.emissive.set(0x000000); mat.emissiveIntensity = 1;
      }
    }
    invalidate();
  }, [selectedId, highlightId, divisionMode, invalidate]);

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

// ── Error boundary + loading/fallback states ──────────────────────────────────
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Loading() {
  return (
    <Html center>
      <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
        Loading skeleton…
      </div>
    </Html>
  );
}

function NotReady() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
      <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: C.indigoLt }}>
        Skeleton model loading soon
      </p>
      <p className="text-[11px] max-w-[280px]" style={{ color: C.textDim }}>
        The interactive 3D skeleton is being prepared. Controls are live — the model attaches here once published.
      </p>
    </div>
  );
}

// ── Guided "Tour the skeleton" — step through the five regions ─────────────────
type TourStep = { layer: LayerId; structureId: string; title: string; caption: string };
const TOUR: TourStep[] = [
  { layer: 'skull', structureId: 'frontal_bone', title: 'The skull',
    caption: 'We start at the top. The skull’s 22 bones — 8 cranial (the braincase) + 14 facial — protect the brain and shape the face. Tap any one to name it; only the lower jaw moves.' },
  { layer: 'spine', structureId: 'thoracic_vertebrae', title: 'The vertebral column',
    caption: '26 vertebrae stack into the backbone — 7 neck, 12 chest, 5 lower-back, plus the sacrum and coccyx. It holds you upright and shields the spinal cord.' },
  { layer: 'thorax', structureId: 'ribs', title: 'The thorax',
    caption: '12 pairs of ribs and the sternum form a protective cage around the heart and lungs that still flexes when you breathe.' },
  { layer: 'upper', structureId: 'humerus', title: 'Pectoral girdle + arms',
    caption: 'The collarbone and shoulder blade hang the arms from the trunk — then humerus, radius, ulna and 27 hand bones give you reach and grip.' },
  { layer: 'lower', structureId: 'femur', title: 'Pelvic girdle + legs',
    caption: 'The pelvis carries your weight onto the legs — femur, patella, tibia, fibula and 26 foot bones — built for standing and walking.' },
];

// ── "Name the bone" quiz ──────────────────────────────────────────────────────
const QUIZ_POOL = ['frontal_bone', 'temporal_bone', 'occipital_bone', 'maxilla',
  'zygomatic', 'mandible', 'cervical_vertebrae', 'ribs', 'sternum', 'clavicle',
  'scapula', 'humerus', 'radius', 'ulna', 'hip_bone', 'femur', 'patella',
  'tibia', 'fibula'];
// Deterministic shuffle helpers (no Math.random at module load — vary by step).
function pick4(answerId: string, seed: number): string[] {
  const others = QUIZ_POOL.filter((id) => id !== answerId);
  // rotate by seed for variety, take 3 distractors
  const start = seed % others.length;
  const rotated = [...others.slice(start), ...others.slice(0, start)];
  const distractors = rotated.slice(0, 3);
  const opts = [...distractors, answerId];
  // shuffle the 4 by seed
  for (let i = opts.length - 1; i > 0; i--) {
    const j = (seed * 7 + i * 13) % (i + 1);
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

// ──────────────────────────────────────────────────────────────────────────────

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 h-8 rounded-lg text-[11px] font-bold transition-colors"
      style={{
        background: active ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
        color: active ? '#c7d2fe' : 'rgba(255,255,255,0.55)',
        border: `1px solid ${active ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {children}
    </button>
  );
}

function FlowBtn({ children, onClick, label, wide }: { children: ReactNode; onClick: () => void; label: string; wide?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} title={label}
      className={`${wide ? 'flex-1' : 'w-9'} h-8 rounded-lg text-[12px] font-bold flex items-center justify-center transition-colors`}
      style={{ background: 'rgba(99,102,241,0.12)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.28)' }}>
      {children}
    </button>
  );
}

export default function Skeleton3DViewer() {
  const [layers, setLayers] = useState<LayerState>(initialLayerState);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<THREE.Vector3 | null>(null);
  const [present, setPresent] = useState<LayerId[] | null>(null);
  const [divisionMode, setDivisionMode] = useState<DivisionMode>('all');

  // Tour state
  const [tourOn, setTourOn] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(true);

  // Quiz state
  const [quizOn, setQuizOn] = useState(false);
  const [quizSeed, setQuizSeed] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ right: 0, total: 0 });

  const tour = tourOn ? TOUR[tourStep] : null;
  const quizTargetId = quizOn ? QUIZ_POOL[quizSeed % QUIZ_POOL.length] : null;
  const quizOptions = useMemo(
    () => (quizTargetId ? pick4(quizTargetId, quizSeed) : []),
    [quizTargetId, quizSeed],
  );

  // Auto-advance the tour while playing.
  useEffect(() => {
    if (!tourOn || !tourPlaying) return;
    const id = setTimeout(() => setTourStep((s) => (s + 1) % TOUR.length), 5200);
    return () => clearTimeout(id);
  }, [tourOn, tourPlaying, tourStep]);

  const clearSelection = () => { setSelectedId(null); setLabelPos(null); };
  const startTour = () => { setQuizOn(false); clearSelection(); setTourOn(true); setTourStep(0); setTourPlaying(true); };
  const stopTour = () => { setTourOn(false); };
  const startQuiz = () => {
    setTourOn(false); clearSelection(); setQuizOn(true); setQuizSeed(1); setQuizAnswer(null);
    setQuizScore({ right: 0, total: 0 }); setDivisionMode('all');
  };
  const answerQuiz = (id: string) => {
    if (quizAnswer) return;
    setQuizAnswer(id);
    setQuizScore((s) => ({ right: s.right + (id === quizTargetId ? 1 : 0), total: s.total + 1 }));
  };
  const nextQuiz = () => { setQuizAnswer(null); setQuizSeed((s) => s + 1); };

  const toggleLayer = (id: LayerId) => setLayers((p) => ({ ...p, [id]: { ...p[id], on: !p[id].on } }));
  const setOpacity = (id: LayerId, opacity: number) => setLayers((p) => ({ ...p, [id]: { ...p[id], opacity } }));

  const selected = selectedId ? STRUCTURE_BY_ID[selectedId] : null;
  const hasModel = SKELETON_MODEL_URL.length > 0;

  // What the model should glow / isolate this frame.
  const highlightId = tour ? tour.structureId : (quizOn ? quizTargetId : null);
  const isolateLayer = tour ? tour.layer : null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.root, border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-white/90">The Human Skeleton — explore in 3D</h3>
          <p className="text-[11px]" style={{ color: C.textDim }}>
            Drag to rotate · scroll to zoom where you point · right-drag (or two-finger) to move · tap a bone
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(99,102,241,0.12)', color: C.indigoLt }}>
          Interactive
        </span>
      </div>

      <div className="grid gap-3 px-3 pb-3 md:grid-cols-[1fr_250px]">
        {/* Canvas — a standing skeleton is tall + narrow, so use a TALL canvas
            (not the heart's 16:9) to give the body real vertical room. */}
        <div className="relative rounded-xl overflow-hidden" style={{ background: C.canvas, height: 'min(80vh, 820px)', minHeight: 460 }}>
          {hasModel ? (
            <ModelBoundary fallback={<NotReady />}>
              <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 45 }} frameloop="demand"
                gl={{ antialias: true, toneMappingExposure: 1.05 }}>
                <ambientLight intensity={0.45} />
                <hemisphereLight intensity={0.4} groundColor={'#15182a'} />
                <directionalLight position={[5, 6, 5]} intensity={1.15} />
                <directionalLight position={[-5, -2, -3]} intensity={0.35} />
                {/* Generated environment (no network) → soft sheen on the bone */}
                <Environment resolution={256}>
                  <Lightformer intensity={1.5} position={[0, 4, 3]} scale={[8, 8, 1]} />
                  <Lightformer intensity={0.8} position={[-4, 1, -2]} scale={[5, 5, 1]} />
                  <Lightformer intensity={0.6} position={[4, 0, 2]} scale={[5, 5, 1]} />
                </Environment>
                <Suspense fallback={<Loading />}>
                  <SkeletonModel
                    url={SKELETON_MODEL_URL}
                    layers={layers}
                    divisionMode={divisionMode}
                    selectedId={selectedId}
                    highlightId={highlightId}
                    isolateLayer={isolateLayer}
                    onSelect={(id, point) => { setSelectedId(id); setLabelPos(point); }}
                    onReady={(info) => setPresent(info.present)}
                  />
                  {selected && labelPos && (
                    <Html position={[labelPos.x, labelPos.y, labelPos.z]} occlude center style={{ pointerEvents: 'none' }}>
                      <div className="px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap"
                        style={{ background: 'rgba(99,102,241,0.9)', color: '#fff' }}>
                        {selected.label}
                      </div>
                    </Html>
                  )}
                </Suspense>
                {/* zoomToCursor: the wheel zooms toward wherever you point, so you
                    can zoom into the skull or the feet (not just the centre). Pan
                    (right-drag / two-finger) moves up–down along the tall body. */}
                <OrbitControls makeDefault enablePan zoomToCursor screenSpacePanning enableDamping={false} />
                {/* Ambient occlusion — the crevice shadows that make bone read as 3D,
                    not flat white (eye sockets, between teeth, rib gaps, sutures). */}
                <EffectComposer enableNormalPass>
                  <N8AO aoRadius={0.07} intensity={2.6} distanceFalloff={0.6} />
                </EffectComposer>

              </Canvas>
            </ModelBoundary>
          ) : (
            <NotReady />
          )}

          {/* Tour caption — big, over the action */}
          {hasModel && tour && (
            <div className="absolute inset-x-0 bottom-0 p-4"
              style={{ background: 'linear-gradient(to top, rgba(5,6,12,0.96), rgba(5,6,12,0))', pointerEvents: 'none' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: C.emerald }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.emerald }}>
                  Step {tourStep + 1} of {TOUR.length} · {tour.title}
                </span>
              </div>
              <p className="text-[14px] leading-snug font-medium text-white/90" style={{ maxWidth: 620 }}>
                {tour.caption}
              </p>
            </div>
          )}

          {/* Quiz overlay */}
          {hasModel && quizOn && quizTargetId && (
            <div className="absolute inset-x-0 bottom-0 p-4"
              style={{ background: 'linear-gradient(to top, rgba(5,6,12,0.97), rgba(5,6,12,0))' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.emerald }}>
                Name the glowing bone · score {quizScore.right}/{quizScore.total}
              </p>
              <div className="grid grid-cols-2 gap-1.5" style={{ maxWidth: 520 }}>
                {quizOptions.map((id) => {
                  const isAns = quizAnswer === id;
                  const isCorrect = id === quizTargetId;
                  let bg = 'rgba(255,255,255,0.05)';
                  let bd = 'rgba(255,255,255,0.1)';
                  let col = 'rgba(255,255,255,0.85)';
                  if (quizAnswer) {
                    if (isCorrect) { bg = 'rgba(16,185,129,0.18)'; bd = 'rgba(16,185,129,0.6)'; col = '#a7f3d0'; }
                    else if (isAns) { bg = 'rgba(239,68,68,0.16)'; bd = 'rgba(239,68,68,0.55)'; col = '#fca5a5'; }
                  }
                  return (
                    <button key={id} onClick={() => answerQuiz(id)} disabled={!!quizAnswer}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-colors"
                      style={{ background: bg, border: `1px solid ${bd}`, color: col }}>
                      {STRUCTURE_BY_ID[id].label}
                    </button>
                  );
                })}
              </div>
              {quizAnswer && (
                <button onClick={nextQuiz}
                  className="mt-2 px-3 h-8 rounded-lg text-[11px] font-bold"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.45)' }}>
                  Next bone ›
                </button>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Axial vs Appendicular */}
          <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.indigoLt }}>
              Axial vs appendicular
            </p>
            <div className="flex gap-1.5">
              <ModeBtn active={divisionMode === 'all'} onClick={() => setDivisionMode('all')}>All</ModeBtn>
              <ModeBtn active={divisionMode === 'axial'} onClick={() => setDivisionMode('axial')}>Axial</ModeBtn>
              <ModeBtn active={divisionMode === 'appendicular'} onClick={() => setDivisionMode('appendicular')}>Append.</ModeBtn>
            </div>
            <p className="text-[10px] mt-2 leading-snug" style={{ color: C.textDim }}>
              {divisionMode === 'axial'
                ? 'Axial skeleton (80 bones): skull, vertebral column, ribs, sternum + hyoid — the central axis.'
                : divisionMode === 'appendicular'
                ? 'Appendicular skeleton (126 bones): the limbs plus the pectoral and pelvic girdles that attach them.'
                : 'The 206 bones split into two groups. Tap Axial or Appendicular to light each one up.'}
            </p>
          </div>

          {/* Layers peel */}
          <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.indigoLt }}>
              Peel the regions
            </p>
            <div className="flex flex-col gap-2">
              {SKELETON_LAYERS.filter((l) => !present || present.includes(l.id)).map((l) => {
                const st = layers[l.id];
                return (
                  <div key={l.id}>
                    <button onClick={() => toggleLayer(l.id)}
                      className="w-full flex items-center gap-2 text-left text-[12px] font-medium transition-colors"
                      style={{ color: st.on ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)' }}>
                      <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                        style={{ background: st.on ? l.tint : 'transparent', border: `1.5px solid ${l.tint}` }} />
                      {l.label}
                    </button>
                    {st.on && (
                      <input type="range" min={0.1} max={1} step={0.05} value={st.opacity}
                        onChange={(e) => setOpacity(l.id, parseFloat(e.target.value))}
                        className="w-full mt-1 accent-indigo-400 h-1" aria-label={`${l.label} opacity`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tour */}
          <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <button onClick={() => (tourOn ? stopTour() : startTour())}
              className="w-full flex items-center gap-2 text-left text-[12px] font-bold uppercase tracking-widest"
              style={{ color: tourOn ? C.emerald : C.indigoLt }}>
              <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                style={{ background: tourOn ? C.emerald : 'transparent', border: `1.5px solid ${tourOn ? C.emerald : C.indigoLt}` }} />
              {tourOn ? 'Stop the tour' : 'Tour the skeleton'}
            </button>
            {tourOn ? (
              <>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <FlowBtn label="Previous region" onClick={() => { setTourPlaying(false); setTourStep((s) => (s - 1 + TOUR.length) % TOUR.length); }}>‹</FlowBtn>
                  <FlowBtn label={tourPlaying ? 'Pause' : 'Play'} wide onClick={() => setTourPlaying((p) => !p)}>
                    {tourPlaying ? '❚❚ Pause' : '▶ Play'}
                  </FlowBtn>
                  <FlowBtn label="Next region" onClick={() => { setTourPlaying(false); setTourStep((s) => (s + 1) % TOUR.length); }}>›</FlowBtn>
                </div>
                <p className="text-[10px] mt-2 tabular-nums" style={{ color: C.textDim }}>
                  Region {tourStep + 1} of {TOUR.length} · pause to read, then Play to continue.
                </p>
              </>
            ) : (
              <p className="text-[10px] mt-1.5" style={{ color: C.textDim }}>
                A guided, region-by-region walk down the skeleton with plain-English explanations.
              </p>
            )}
          </div>

          {/* Quiz */}
          <div className="rounded-xl p-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <button onClick={() => (quizOn ? setQuizOn(false) : startQuiz())}
              className="w-full flex items-center gap-2 text-left text-[12px] font-bold uppercase tracking-widest"
              style={{ color: quizOn ? C.emerald : C.indigoLt }}>
              <span className="inline-block w-3 h-3 rounded-sm shrink-0"
                style={{ background: quizOn ? C.emerald : 'transparent', border: `1.5px solid ${quizOn ? C.emerald : C.indigoLt}` }} />
              {quizOn ? 'End quiz' : 'Name the bone (quiz)'}
            </button>
            <p className="text-[10px] mt-1.5" style={{ color: C.textDim }}>
              {quizOn ? 'One bone glows on the model — pick its name below.'
                : 'Test yourself: a bone lights up and you name it from four choices.'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected-structure detail panel */}
      <div className="mx-3 mb-3 rounded-xl px-4 py-3 min-h-[64px]" style={{ background: C.input, border: `1px solid ${C.border}` }}>
        {selected ? (
          <>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-bold" style={{ color: C.indigoXlt }}>{selected.label}</p>
              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{
                  background: selected.division === 'axial' ? 'rgba(251,191,36,0.14)' : 'rgba(56,189,248,0.14)',
                  color: selected.division === 'axial' ? C.amber : C.sky,
                }}>
                {selected.division}
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {selected.blurb}
            </p>
          </>
        ) : (
          <p className="text-[12px]" style={{ color: C.textDim }}>
            Tap any bone on the model to read about it.
          </p>
        )}
      </div>

      {/* CC BY-SA attribution — required by the model licence (kept in-UI) */}
      <p className="px-4 pb-3 text-[9.5px] leading-snug" style={{ color: 'rgba(255,255,255,0.28)' }}>
        3D model: BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japan) ·
        Z-Anatomy — the libre 3D atlas of anatomy (CC BY-SA 4.0).
      </p>
    </div>
  );
}

// Preload the static model so it's ready when the block scrolls into view.
if (SKELETON_MODEL_URL) useGLTF.preload(SKELETON_MODEL_URL, false);
