'use client';

/**
 * SimpleModelViewer — shared engine behind the "first iteration" batch of 3D
 * anatomy/biology models (Class 11 Biology sweep, 2026-07-15). Deliberately
 * minimal: orbit + zoom + auto-fit camera + credit line. No peel-layers/
 * tap-to-learn (unlike Heart3DViewer) because these single-mesh Sketchfab
 * sources have no per-structure naming to hang that on — see
 * SimpleModelViewers.tsx for the per-model wrappers that feed this engine,
 * and the CC BY credit line each one carries.
 *
 * Upgrade path: once a model needs peel-layers/tap-to-learn, give it a
 * bespoke viewer (Heart3DViewer is the template) instead of stretching this.
 */

import { Suspense, useEffect, Component, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

const C = {
  root: '#0d1117',
  card: '#0B0F15',
  canvas: 'radial-gradient(circle at center, #1e204a 0%, #050614 100%)',
  indigoLt: '#818cf8',
  border: 'rgba(255,255,255,0.08)',
  textDim: 'rgba(255,255,255,0.5)',
};

function AutoFitModel({ url }: { url: string }) {
  const { scene } = useGLTF(url, false);
  const { camera, controls, invalidate } = useThree();
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const cam = camera as THREE.PerspectiveCamera;
    const dist = Math.max(size.x, size.y, size.z) * 1.6 + 0.001;
    cam.position.copy(center.clone().add(new THREE.Vector3(dist * 0.5, dist * 0.3, dist)));
    cam.near = Math.max(dist / 1000, 0.0001);
    cam.far = dist * 1000;
    cam.updateProjectionMatrix();
    const ctrl = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
    if (ctrl?.target) { ctrl.target.copy(center); ctrl.update?.(); }
    invalidate();
  }, [scene, camera, controls, invalidate]);
  return <primitive object={scene} />;
}

function Loading() {
  return (
    <Html center>
      <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
        Loading…
      </div>
    </Html>
  );
}

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function LoadError() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center px-6">
      <p className="text-[11px]" style={{ color: C.textDim }}>Model failed to load.</p>
    </div>
  );
}

export function SimpleModelViewer({
  modelUrl,
  title,
  hint = 'Drag to rotate · scroll to zoom',
  credit,
}: {
  modelUrl: string;
  title: string;
  hint?: string;
  credit: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.root, border: `1px solid ${C.border}` }}>
      <div className="px-5 pt-4 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-white/90">{title}</h3>
          <p className="text-[11px]" style={{ color: C.textDim }}>{hint}</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(99,102,241,0.12)', color: C.indigoLt }}>
          Interactive
        </span>
      </div>
      <div className="mx-3 mb-3 relative rounded-xl overflow-hidden"
        style={{ background: C.canvas, aspectRatio: '16 / 9', minHeight: 320 }}>
        <ModelBoundary fallback={<LoadError />}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 45 }} frameloop="demand" gl={{ antialias: true }}>
            <ambientLight intensity={0.7} />
            <hemisphereLight intensity={0.5} groundColor={'#1e204a'} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, -2, -3]} intensity={0.4} />
            <Suspense fallback={<Loading />}>
              <AutoFitModel url={modelUrl} />
            </Suspense>
            <OrbitControls enablePan makeDefault />
          </Canvas>
        </ModelBoundary>
      </div>
      <p className="px-4 pb-3 text-[9.5px] leading-snug" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {credit}
      </p>
    </div>
  );
}
