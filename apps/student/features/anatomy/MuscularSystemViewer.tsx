'use client';

/**
 * MuscularSystemViewer — the LEARNING template (not just a model viewer).
 * Turns the muscular-v1 glb into a teaching tool for NEET "Locomotion & Movement":
 *   • Depth-peel (Superficial → Intermediate → Deep) — purposeful, replaces vanity opacity.
 *   • Region isolate (head/neck, trunk, arm, …).
 *   • Tap-to-learn: real info panel (what the muscle does + region + depth), not just a name.
 *   • Guided tour: head→toe walkthrough, camera focuses each muscle with its blurb.
 *   • Quiz: "tap the muscle" active recall, scored.
 * Content from ./muscularLearning.ts (generated from the structure map). glb node
 * names ARE the tokens. Reuses the proven rules (FrontSide, frameloop demand,
 * Environment + N8AO, manual camera, CC BY-SA credit).
 */

import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MUSCLE_INFO, DEPTH_TIERS, REGIONS, MUSCLE_TOUR, MUSCLE_QUIZ, type MuscleDepth } from './muscularLearning';

type OControls = React.ElementRef<typeof OrbitControls>;
const MUSCULAR_URL = '/anatomy/muscular-v1.glb';
const HEAD_URL = '/anatomy/head-features-v1.glb';
const DEPTH_RANK: Record<MuscleDepth, number> = { L1: 1, L2: 2, L3: 3 };
const CC_LINE = '3D model: BodyParts3D © DBCLS (CC BY-SA 2.1 JP) · Z-Anatomy (CC BY-SA 4.0).';

const C = {
  root: '#0d1117', card: '#0B0F15', input: '#151E32',
  canvas: 'radial-gradient(circle at 50% 30%, #1a2238 0%, #070a12 70%)',
  indigo: '#6366f1', emerald: '#34d399', amber: '#fbbf24',
  border: 'rgba(255,255,255,0.08)', textDim: 'rgba(255,255,255,0.55)',
};

function pretty(t: string) { return MUSCLE_INFO[t]?.label ?? t.replace(/_/g, ' '); }

// ── The muscle geometry: visibility by depth/region + highlight + centroids ──
function MuscleModel({
  depthMax, region, highlight, onPick, centroids,
}: {
  depthMax: number; region: string; highlight: string | null;
  onPick: (t: string) => void; centroids: React.MutableRefObject<Record<string, THREE.Vector3>>;
}) {
  const { scene } = useGLTF(MUSCULAR_URL);
  const invalidate = useThree((s) => s.invalidate);

  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!(m as THREE.Mesh).isMesh) return;
      m.material = (m.material as THREE.Material).clone();
      (m.material as THREE.MeshStandardMaterial).side = THREE.FrontSide;
      // record original colour for highlight restore
      m.userData.baseColor = (m.material as THREE.MeshStandardMaterial).color.clone();
      // centroid for camera focus
      const box = new THREE.Box3().setFromObject(m);
      centroids.current[m.name] = box.getCenter(new THREE.Vector3());
    });
    return s;
  }, [scene, centroids]);

  useEffect(() => {
    cloned.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!(m as THREE.Mesh).isMesh) return;
      const info = MUSCLE_INFO[m.name];
      const depthOk = info ? DEPTH_RANK[info.depth] <= depthMax : true;
      const regionOk = region === 'all' || (info && info.region === region);
      m.visible = !!(depthOk && regionOk);
      const mat = m.material as THREE.MeshStandardMaterial;
      if (m.name === highlight) {
        mat.emissive.setHex(0x0f5132); mat.emissiveIntensity = 0.9;
        mat.color.set('#34d399');
      } else {
        mat.emissive.setHex(0x000000); mat.emissiveIntensity = 0;
        if (m.userData.baseColor) mat.color.copy(m.userData.baseColor as THREE.Color);
      }
    });
    invalidate();
  }, [depthMax, region, highlight, cloned, invalidate]);

  return (
    <primitive
      object={cloned}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (e.object?.name && e.object.visible) onPick(e.object.name);
      }}
    />
  );
}

// faint head features (eyes/ears) so the head isn't bare
function HeadFeatures() {
  const { scene } = useGLTF(HEAD_URL);
  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => { const m = o as THREE.Mesh; if ((m as THREE.Mesh).isMesh) (m.material as THREE.MeshStandardMaterial).side = THREE.FrontSide; });
    return s;
  }, [scene]);
  return <primitive object={cloned} />;
}

function Focuser({ token, centroids, controls }: {
  token: string | null; centroids: React.MutableRefObject<Record<string, THREE.Vector3>>;
  controls: React.RefObject<OControls | null>;
}) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    if (!token) return;
    const c = centroids.current[token];
    if (!c || !controls.current) return;
    controls.current.target.copy(c);
    const dir = new THREE.Vector3(0.45, 0.12, 1).normalize();
    camera.position.copy(c.clone().add(dir.multiplyScalar(0.62)));
    controls.current.update();
    invalidate();
  }, [token, camera, centroids, controls, invalidate]);
  return null;
}

function FrameOnce({ controls }: { controls: React.RefObject<OControls | null> }) {
  const { camera } = useThree();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return; done.current = true;
    camera.position.set(0.5, 0.95, 3.1); camera.updateProjectionMatrix();
    if (controls.current) { controls.current.target.set(0, 0.92, 0); controls.current.update(); }
  }, [camera, controls]);
  return null;
}

class ErrB extends Component<{ children: ReactNode }, { e: boolean }> {
  state = { e: false }; static getDerivedStateFromError() { return { e: true }; }
  render() { return this.state.e ? <div style={{ padding: 24, color: C.textDim }}>3D model couldn’t load — please refresh.</div> : this.props.children; }
}

type Mode = 'explore' | 'tour' | 'quiz';

export default function MuscularSystemViewer() {
  const [mode, setMode] = useState<Mode>('explore');
  const [depthMax, setDepthMax] = useState(1);          // 1=superficial only … 3=all
  const [region, setRegion] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [tourI, setTourI] = useState(0);
  const [quiz, setQuiz] = useState<{ target: string; asked: number; score: number; result: '' | 'right' | 'wrong' }>(
    { target: MUSCLE_QUIZ[0], asked: 0, score: 0, result: '' });
  const controls = useRef<OControls | null>(null);
  const centroids = useRef<Record<string, THREE.Vector3>>({});

  // ── interactions per mode ──
  function handlePick(token: string) {
    if (mode === 'quiz') {
      const right = token === quiz.target;
      setSelected(token); setFocus(token);
      setQuiz((q) => ({ ...q, result: right ? 'right' : 'wrong', score: q.score + (right ? 1 : 0) }));
      return;
    }
    setSelected(token); setFocus(token);
  }
  function tourGo(i: number) {
    const n = (i + MUSCLE_TOUR.length) % MUSCLE_TOUR.length;
    setTourI(n); const t = MUSCLE_TOUR[n];
    setSelected(t); setFocus(t);
    const d = MUSCLE_INFO[t]?.depth ?? 'L1'; setDepthMax(DEPTH_RANK[d]); setRegion('all');
  }
  function nextQuiz() {
    const pool = MUSCLE_QUIZ.filter((t) => t !== quiz.target);
    const target = pool[Math.floor((quiz.asked + 1) % pool.length)] ?? MUSCLE_QUIZ[0];
    setQuiz((q) => ({ target, asked: q.asked + 1, score: q.score, result: '' }));
    setSelected(null); setFocus(null); setDepthMax(1); setRegion('all');
  }

  const info = selected ? MUSCLE_INFO[selected] : null;

  return (
    <div style={{ background: C.root, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 'min(80vh, 780px)' }}>
        {/* ── Left panel ── */}
        <div style={{ width: 280, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Muscular System</div>
          {/* mode tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['explore', 'tour', 'quiz'] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); setSelected(null); setFocus(null); if (m === 'tour') tourGo(0); if (m === 'quiz') { setDepthMax(1); setQuiz({ target: MUSCLE_QUIZ[0], asked: 0, score: 0, result: '' }); } }}
                style={{ flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
                  background: mode === m ? C.indigo : C.input, color: '#fff', border: `1px solid ${C.border}` }}>
                {m}
              </button>
            ))}
          </div>

          {mode === 'explore' && (
            <>
              <div>
                <div style={{ color: C.textDim, fontSize: 12, marginBottom: 6 }}>Depth (peel inward)</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {DEPTH_TIERS.map((d, i) => (
                    <button key={d.id} onClick={() => setDepthMax(i + 1)}
                      style={{ flex: 1, padding: '6px 2px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                        background: depthMax === i + 1 ? C.emerald : C.input, color: depthMax === i + 1 ? '#04130c' : '#fff',
                        fontWeight: 700, border: `1px solid ${C.border}` }}>
                      {d.label}
                    </button>
                  ))}
                </div>
                <div style={{ color: C.textDim, fontSize: 10.5, marginTop: 4 }}>Shows superficial muscles, then peels in to the deeper layers.</div>
              </div>
              <div>
                <div style={{ color: C.textDim, fontSize: 12, marginBottom: 6 }}>Region</div>
                <select value={region} onChange={(e) => setRegion(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 8, background: C.input, color: '#fff', border: `1px solid ${C.border}`, fontSize: 12 }}>
                  <option value="all">Whole body</option>
                  {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </>
          )}

          {mode === 'tour' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: C.textDim, fontSize: 12 }}>Guided tour · {tourI + 1} of {MUSCLE_TOUR.length}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => tourGo(tourI - 1)} style={btn(C)}>‹ Prev</button>
                <button onClick={() => tourGo(tourI + 1)} style={{ ...btn(C), background: C.indigo }}>Next ›</button>
              </div>
            </div>
          )}

          {mode === 'quiz' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Tap the <span style={{ color: C.amber }}>{pretty(quiz.target)}</span></div>
              <div style={{ color: C.textDim, fontSize: 12 }}>Score {quiz.score} / {quiz.asked + (quiz.result ? 1 : 0)}</div>
              {quiz.result === 'right' && <div style={{ color: C.emerald, fontWeight: 700 }}>✓ Correct!</div>}
              {quiz.result === 'wrong' && <div style={{ color: '#f87171', fontWeight: 700 }}>✗ That’s the {pretty(selected || '')}. Try the next one.</div>}
              {quiz.result && <button onClick={nextQuiz} style={{ ...btn(C), background: C.indigo }}>Next question ›</button>}
              <div style={{ color: C.textDim, fontSize: 10.5 }}>Hint: only superficial muscles are shown for the quiz.</div>
            </div>
          )}

          {/* info panel */}
          <div style={{ marginTop: 8, background: C.input, borderRadius: 10, padding: 12, border: `1px solid ${C.border}`, minHeight: 96 }}>
            {info ? (
              <>
                <div style={{ color: C.emerald, fontWeight: 700, fontSize: 15 }}>{info.label}</div>
                <div style={{ color: C.textDim, fontSize: 11, margin: '2px 0 6px' }}>
                  {REGIONS.find((r) => r.id === info.region)?.label ?? info.region} · {DEPTH_TIERS.find((d) => d.id === info.depth)?.label}
                </div>
                <div style={{ color: '#dfe6f0', fontSize: 12.5, lineHeight: 1.45 }}>{info.blurb}</div>
              </>
            ) : (
              <div style={{ color: C.textDim, fontSize: 12 }}>Tap any muscle to learn what it does.</div>
            )}
          </div>
        </div>

        {/* ── Canvas ── */}
        <div style={{ flex: 1, minWidth: 280, position: 'relative', background: C.canvas }}>
          <ErrB>
            <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [0.5, 0.95, 3.1], fov: 35 }}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
              onPointerMissed={() => { if (mode !== 'quiz') setSelected(null); }}
              style={{ width: '100%', height: '100%', minHeight: 480 }}>
              <FrameOnce controls={controls} />
              <Focuser token={focus} centroids={centroids} controls={controls} />
              <Environment resolution={256}>
                <Lightformer intensity={2.2} position={[2, 3, 3]} scale={6} />
                <Lightformer intensity={1.1} position={[-3, 1, 2]} scale={5} />
                <Lightformer intensity={0.8} position={[0, 2, -4]} scale={6} />
              </Environment>
              <ambientLight intensity={0.35} />
              <Suspense fallback={<Html center style={{ color: C.textDim }}>Loading…</Html>}>
                <MuscleModel depthMax={depthMax} region={region} highlight={selected} onPick={handlePick} centroids={centroids} />
                <HeadFeatures />
              </Suspense>
              <EffectComposer enableNormalPass={false}><N8AO aoRadius={0.06} intensity={2.4} /></EffectComposer>
              <OrbitControls ref={controls} makeDefault enablePan zoomToCursor screenSpacePanning minDistance={0.3} maxDistance={8} />
            </Canvas>
          </ErrB>
          <div style={{ position: 'absolute', bottom: 6, left: 10, right: 10, fontSize: 9.5, color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>{CC_LINE}</div>
        </div>
      </div>
    </div>
  );
}

function btn(C: Record<string, string>): React.CSSProperties {
  return { flex: 1, padding: '7px 6px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: C.input, color: '#fff', border: `1px solid ${C.border}` };
}

useGLTF.preload(MUSCULAR_URL);
useGLTF.preload(HEAD_URL);
