'use client';

/**
 * AnatomyExplorer — the full-body, multi-layer 3D anatomy explorer ("our Complete
 * Anatomy"). Loads each body SYSTEM as its own optimized .glb LAYER and lets the
 * student toggle layers on/off, fade them (peel), and tap any structure for its name.
 *
 * Built per _agents/plans/ANATOMY_EXPLORER_VISION.md + ANATOMY_3D_SIMULATOR_WORKFLOW.md.
 * Reuses the single-organ viewers' hard-won rules: single-sided FrontSide materials,
 * MANUAL one-time camera framing (NOT drei <Bounds observe>), frameloop="demand",
 * a GENERATED <Environment> (no CDN — CSP/offline safe) + N8AO ambient occlusion,
 * static same-origin .glb hosting, and the CC BY-SA credit line.
 *
 * Each system glb is lazy-loaded only when its layer is toggled on. All systems share
 * the Z-Anatomy coordinate space, so they overlay perfectly with zero alignment work.
 * glb node names ARE the structure tokens (e.g. "pectoralis_major", "liver",
 * "cerebrum") — tap-to-label prettifies them.
 *
 * Model: Z-Anatomy / BodyParts3D (CC BY-SA, credited in-UI).
 */

import {
  Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode,
} from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';

const C = {
  root: '#0d1117', card: '#0B0F15', input: '#151E32',
  canvas: 'radial-gradient(circle at 50% 30%, #1a2238 0%, #070a12 70%)',
  indigo: '#6366f1', indigoLt: '#818cf8', emerald: '#34d399',
  border: 'rgba(255,255,255,0.08)', textDim: 'rgba(255,255,255,0.55)',
};

type OControls = React.ElementRef<typeof OrbitControls>;
type SystemDef = { id: string; label: string; url: string; tint: string; defaultOn: boolean };

// Order = anatomical depth (skin/muscle outermost → skeleton innermost). Head
// features (eyes/ears) always load with the head so the face is never a bare skull.
const SYSTEMS: SystemDef[] = [
  { id: 'muscular', label: 'Muscles',          url: '/anatomy/muscular-v1.glb', tint: '#c0504d', defaultOn: false },
  { id: 'cardio',   label: 'Heart & vessels',  url: '/anatomy/cardio-v1.glb',   tint: '#d9534f', defaultOn: false },
  { id: 'nervous',  label: 'Brain & nerves',   url: '/anatomy/nervous-v1.glb',  tint: '#c9b6c0', defaultOn: false },
  { id: 'viscera',  label: 'Internal organs',  url: '/anatomy/viscera-v1.glb',  tint: '#cf8b6c', defaultOn: false },
  { id: 'lymphoid', label: 'Lymphatic',        url: '/anatomy/lymphoid-v1.glb', tint: '#9ec07d', defaultOn: false },
  { id: 'skeleton', label: 'Skeleton',         url: '/anatomy/skeleton-v1.glb', tint: '#e3d4b2', defaultOn: true },
];
const HEAD_FEATURES_URL = '/anatomy/head-features-v1.glb';

const CC_LINE =
  '3D model: BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japan) · Z-Anatomy (CC BY-SA 4.0).';

function prettify(name: string): string {
  return name
    .replace(/\.\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ── One system's geometry, materials cloned so opacity is per-layer ───────────
function SystemLayer({
  url, opacity, onPick,
}: { url: string; opacity: number; onPick: (name: string) => void }) {
  const { scene } = useGLTF(url);
  const invalidate = useThree((s) => s.invalidate);

  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if ((m as THREE.Mesh).isMesh) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        m.material = (Array.isArray(m.material) ? mats.map((x) => x.clone()) : mats[0].clone()) as THREE.Material | THREE.Material[];
        const cm = Array.isArray(m.material) ? m.material : [m.material];
        cm.forEach((mat) => { (mat as THREE.MeshStandardMaterial).side = THREE.FrontSide; });
      }
    });
    return s;
  }, [scene]);

  useEffect(() => {
    cloned.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!(m as THREE.Mesh).isMesh) return;
      const cm = Array.isArray(m.material) ? m.material : [m.material];
      cm.forEach((mat) => {
        const sm = mat as THREE.MeshStandardMaterial;
        sm.transparent = opacity < 0.999;
        sm.opacity = opacity;
        sm.depthWrite = opacity >= 0.999;
      });
    });
    invalidate();
  }, [opacity, cloned, invalidate]);

  return (
    <primitive
      object={cloned}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        let o: THREE.Object3D | null = e.object;
        while (o && !o.name && o.parent) o = o.parent;
        if (o?.name) onPick(o.name);
      }}
    />
  );
}

// ── One-time camera frame on the standing figure (Y-up after glTF export) ─────
function FrameOnce({ controls }: { controls: React.RefObject<OControls | null> }) {
  const { camera } = useThree();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    // Body ≈ 1.7 m tall, feet at y≈0. Frame the standing figure from the front.
    camera.position.set(0.5, 0.95, 3.1);
    (camera as THREE.PerspectiveCamera).near = 0.01;
    (camera as THREE.PerspectiveCamera).far = 50;
    camera.updateProjectionMatrix();
    if (controls.current) {
      controls.current.target.set(0, 0.92, 0);
      controls.current.update();
    }
  }, [camera, controls]);
  return null;
}

class ErrBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 24, color: C.textDim, textAlign: 'center' }}>
          The 3D model couldn’t load. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AnatomyExplorer() {
  const [on, setOn] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SYSTEMS.map((s) => [s.id, s.defaultOn])),
  );
  const [opacity, setOpacity] = useState<Record<string, number>>(
    () => Object.fromEntries(SYSTEMS.map((s) => [s.id, 1])),
  );
  const [picked, setPicked] = useState<string | null>(null);
  const controls = useRef<OControls | null>(null);

  const headOn = on.skeleton || on.muscular; // show eyes/ears whenever the head is visible

  return (
    <div style={{ background: C.root, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 'min(78vh, 760px)' }}>
        {/* ── Layer control panel ── */}
        <div style={{ width: 260, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Anatomy Explorer</div>
          <div style={{ color: C.textDim, fontSize: 12, marginBottom: 4 }}>
            Toggle a system on, drag the slider to fade it (peel), and tap any structure to name it.
          </div>
          {SYSTEMS.map((s) => (
            <div key={s.id} style={{ background: C.input, borderRadius: 10, padding: '8px 10px', border: `1px solid ${C.border}` }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13 }}>
                <input type="checkbox" checked={!!on[s.id]} onChange={(e) => setOn((p) => ({ ...p, [s.id]: e.target.checked }))} />
                <span style={{ width: 10, height: 10, borderRadius: 3, background: s.tint }} />
                {s.label}
              </label>
              {on[s.id] && (
                <input
                  type="range" min={0.1} max={1} step={0.05} value={opacity[s.id]}
                  onChange={(e) => setOpacity((p) => ({ ...p, [s.id]: Number(e.target.value) }))}
                  style={{ width: '100%', marginTop: 6 }}
                  aria-label={`${s.label} opacity`}
                />
              )}
            </div>
          ))}
          <div style={{ marginTop: 'auto', minHeight: 52 }}>
            {picked
              ? <div style={{ color: C.emerald, fontWeight: 700, fontSize: 15 }}>{prettify(picked)}</div>
              : <div style={{ color: C.textDim, fontSize: 12 }}>Tap a structure to identify it.</div>}
          </div>
        </div>

        {/* ── 3D canvas ── */}
        <div style={{ flex: 1, minWidth: 280, position: 'relative', background: C.canvas }}>
          <ErrBoundary>
            <Canvas
              frameloop="demand"
              dpr={[1, 2]}
              camera={{ position: [0.5, 0.95, 3.1], fov: 35 }}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
              onPointerMissed={() => setPicked(null)}
              style={{ width: '100%', height: '100%', minHeight: 460 }}
            >
              <FrameOnce controls={controls} />
              <Environment resolution={256}>
                <Lightformer intensity={2.2} position={[2, 3, 3]} scale={6} />
                <Lightformer intensity={1.1} position={[-3, 1, 2]} scale={5} />
                <Lightformer intensity={0.8} position={[0, 2, -4]} scale={6} />
              </Environment>
              <ambientLight intensity={0.35} />
              <Suspense fallback={<Html center style={{ color: C.textDim }}>Loading…</Html>}>
                {SYSTEMS.filter((s) => on[s.id]).map((s) => (
                  <SystemLayer key={s.id} url={s.url} opacity={opacity[s.id]} onPick={setPicked} />
                ))}
                {headOn && <SystemLayer url={HEAD_FEATURES_URL} opacity={1} onPick={setPicked} />}
              </Suspense>
              <EffectComposer enableNormalPass={false}>
                <N8AO aoRadius={0.06} intensity={2.4} />
              </EffectComposer>
              <OrbitControls
                ref={controls}
                makeDefault
                enablePan
                zoomToCursor
                screenSpacePanning
                minDistance={0.3}
                maxDistance={8}
              />
            </Canvas>
          </ErrBoundary>
          <div style={{ position: 'absolute', bottom: 6, left: 10, right: 10, fontSize: 9.5, lineHeight: 1.3, color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>
            {CC_LINE}
          </div>
        </div>
      </div>
    </div>
  );
}

SYSTEMS.forEach((s) => useGLTF.preload(s.url));
