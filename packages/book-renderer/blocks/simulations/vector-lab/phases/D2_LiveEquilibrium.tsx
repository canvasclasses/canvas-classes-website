'use client';

// Dynamic Module — Live Equilibrium (real constraint solver).
// A load hangs from two cables modelled as planck DistanceJoints. The cable
// TENSIONS are read straight out of the solver (getReactionForce) — not from a
// formula we typed — so dragging an anchor re-settles the system and the
// tensions update with real physics. Verified against mg/(2 sinθ).
// Source: NCERT Class 11, Ch. 5 (equilibrium of concurrent forces) + Lami.

import { useEffect, useRef, useState } from 'react';
import { World, Vec2 as PVec2, Box, DistanceJoint } from 'planck';
import type { XY, ViewTransform } from '../engine/transform';
import { PhysicsCanvas } from '../engine/PhysicsCanvas';
import { arrowM, dotM, lineM, polyM, textM } from '../engine/canvasKit';
import { C } from '../lib/theme';
import { round } from '../lib/vectorMath';
import { PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { Slider, Rule, ExpertTip, Frac } from '../components/primitives';
import { ObjectivesPanel } from '../learning/ObjectivesPanel';
import { Checkpoint } from '../learning/Checkpoint';
import { useMastery } from '../learning/mastery';

const G = 9.8;
const CABLE_LEN = 3.6;

type Body = ReturnType<World['createBody']>;
type Joint = ReturnType<World['createJoint']>;

export default function LiveEquilibriumPhase() {
  const { complete } = useMastery();
  const [mass, setMass] = useState(2); // kg
  const [readout, setReadout] = useState({ tL: 0, tR: 0, angL: 0, angR: 0 });

  const worldRef = useRef<World | null>(null);
  const loadRef = useRef<Body | null>(null);
  const aLRef = useRef<Body | null>(null);
  const aRRef = useRef<Body | null>(null);
  const jLRef = useRef<Joint | null>(null);
  const jRRef = useRef<Joint | null>(null);
  const dragRef = useRef<'L' | 'R' | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    const world = new World({ gravity: new PVec2(0, -G) });
    const load = world.createBody({ type: 'dynamic', position: new PVec2(0, 0.4), fixedRotation: true, linearDamping: 1.2 });
    load.createFixture(new Box(0.28, 0.28), { density: 1 });
    load.setMassData({ mass: 2, center: new PVec2(0, 0), I: 0 });
    const aL = world.createBody({ position: new PVec2(-2.5, 3) });
    const aR = world.createBody({ position: new PVec2(2.5, 3) });
    const mk = (a: Body) =>
      world.createJoint(
        new DistanceJoint({ bodyA: a, bodyB: load, localAnchorA: new PVec2(0, 0), localAnchorB: new PVec2(0, 0), length: CABLE_LEN, frequencyHz: 0, dampingRatio: 0 })
      );
    worldRef.current = world;
    loadRef.current = load;
    aLRef.current = aL;
    aRRef.current = aR;
    jLRef.current = mk(aL);
    jRRef.current = mk(aR);
    return () => {
      worldRef.current = null;
    };
  }, []);

  // Apply mass changes to the existing body.
  useEffect(() => {
    loadRef.current?.setMassData({ mass, center: new PVec2(0, 0), I: 0 });
    loadRef.current?.setAwake(true);
  }, [mass]);

  const onStep = (dt: number) => {
    const world = worldRef.current;
    if (!world) return;
    world.step(dt);
    tickRef.current++;
    if (tickRef.current % 5 === 0) {
      const jL = jLRef.current;
      const jR = jRRef.current;
      const load = loadRef.current;
      const aL = aLRef.current;
      const aR = aRRef.current;
      if (jL && jR && load && aL && aR) {
        const lp = load.getPosition();
        const angOf = (a: Body) => {
          const ap = a.getPosition();
          return Math.atan2(ap.y - lp.y, Math.abs(ap.x - lp.x)) * (180 / Math.PI);
        };
        setReadout({
          tL: jL.getReactionForce(1 / dt).length(),
          tR: jR.getReactionForce(1 / dt).length(),
          angL: angOf(aL),
          angR: angOf(aR),
        });
      }
    }
  };

  const clampAnchor = (p: XY): XY => ({ x: Math.max(-4, Math.min(4, p.x)), y: Math.max(1.5, Math.min(4.2, p.y)) });

  const onPointerDown = (w: XY) => {
    const aL = aLRef.current;
    const aR = aRRef.current;
    if (!aL || !aR) return;
    const near = (b: Body) => Math.hypot(b.getPosition().x - w.x, b.getPosition().y - w.y) < 0.9;
    if (near(aL)) dragRef.current = 'L';
    else if (near(aR)) dragRef.current = 'R';
  };
  const onPointerMove = (w: XY) => {
    if (!dragRef.current) return;
    const body = dragRef.current === 'L' ? aLRef.current : aRRef.current;
    if (!body) return;
    const c = clampAnchor(w);
    body.setTransform(new PVec2(c.x, c.y), 0);
    loadRef.current?.setAwake(true);
  };
  const onPointerUp = () => {
    dragRef.current = null;
    complete('d-equilibrium');
  };

  const onDraw = (ctx: CanvasRenderingContext2D, t: ViewTransform) => {
    const load = loadRef.current;
    const aL = aLRef.current;
    const aR = aRRef.current;
    if (!load || !aL || !aR) return;
    const lp = load.getPosition();
    const L: XY = { x: aL.getPosition().x, y: aL.getPosition().y };
    const R: XY = { x: aR.getPosition().x, y: aR.getPosition().y };
    const lpos: XY = { x: lp.x, y: lp.y };

    // ceiling brackets
    polyM(ctx, t, [{ x: L.x - 0.35, y: L.y }, { x: L.x + 0.35, y: L.y }, { x: L.x + 0.35, y: L.y + 0.18 }, { x: L.x - 0.35, y: L.y + 0.18 }], '#475569');
    polyM(ctx, t, [{ x: R.x - 0.35, y: R.y }, { x: R.x + 0.35, y: R.y }, { x: R.x + 0.35, y: R.y + 0.18 }, { x: R.x - 0.35, y: R.y + 0.18 }], '#475569');

    // cables
    lineM(ctx, t, lpos, L, 'rgba(226,232,240,0.55)', 2);
    lineM(ctx, t, lpos, R, 'rgba(226,232,240,0.55)', 2);

    // anchor drag handles
    dotM(ctx, t, L, C.indigoMid, 8);
    dotM(ctx, t, R, C.amber, 8);

    // load box + label
    polyM(ctx, t, [{ x: lp.x - 0.42, y: lp.y - 0.32 }, { x: lp.x + 0.42, y: lp.y - 0.32 }, { x: lp.x + 0.42, y: lp.y + 0.32 }, { x: lp.x - 0.42, y: lp.y + 0.32 }], '#1e2a44', 'rgba(129,140,248,0.5)');
    textM(ctx, t, lpos, `${mass}kg`, C.text2, { align: 'center', size: 11, weight: 700 });

    // force vectors at the load (scaled so the biggest is ~2 m on canvas)
    const W = mass * G;
    const maxF = Math.max(readout.tL, readout.tR, W) || 1;
    const s = 2 / maxF;
    const uL: XY = norm({ x: L.x - lp.x, y: L.y - lp.y });
    const uR: XY = norm({ x: R.x - lp.x, y: R.y - lp.y });
    arrowM(ctx, t, lpos, { x: lp.x + uL.x * readout.tL * s, y: lp.y + uL.y * readout.tL * s }, { color: C.indigoMid, label: 'T₁', italic: false, width: 3.5 });
    arrowM(ctx, t, lpos, { x: lp.x + uR.x * readout.tR * s, y: lp.y + uR.y * readout.tR * s }, { color: C.amber, label: 'T₂', italic: false, width: 3.5 });
    arrowM(ctx, t, lpos, { x: lp.x, y: lp.y - W * s }, { color: C.emeraldLight, label: 'W', italic: false, width: 3.5 });
  };

  const W = mass * G;
  // Lami opposite-angles: angle opposite W = angle between the two cables.
  const angBetweenCables = readout.angL + readout.angR;

  return (
    <PhaseLayout
      scenarioTitle="A sign hung from two cables — drag the anchors"
      scenarioTag="Equilibrium · live solver"
      canvas={
        <PhysicsCanvas
          metersWide={11}
          originXFrac={0.5}
          originYFrac={0.32}
          height={440}
          onStep={onStep}
          onDraw={onDraw}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      }
      sidebar={
        <>
          <ObjectivesPanel
            moduleId="d-equilibrium"
            objectives={[
              'Feel why a near-horizontal cable carries enormous tension',
              'See three forces settle so they sum to zero',
              "Read tensions straight off Lami's theorem",
            ]}
          />
          <SideHeading>Forces in balance — for real</SideHeading>

          <Rule label="Drag an anchor">
            The load settles where the three forces sum to <span style={{ color: C.emeraldLight }}>zero</span>. These
            tensions come from a real constraint solver, not a formula — drag the{' '}
            <span style={{ color: C.indigoMid }}>left</span> or <span style={{ color: C.amber }}>right</span> anchor and
            watch them rebalance.
          </Rule>

          <Slider label="Load mass" value={mass} min={0.5} max={6} step={0.5} unit="kg" color={C.emeraldLight} onChange={setMass} />

          <div className="text-base" style={{ color: C.text2 }}>
            <span style={{ color: C.indigoMid }}>T₁</span> = <span className="text-white font-bold tabular-nums">{round(readout.tL, 1)} N</span>
            &nbsp;·&nbsp;
            <span style={{ color: C.amber }}>T₂</span> = <span className="text-white font-bold tabular-nums">{round(readout.tR, 1)} N</span>
            &nbsp;·&nbsp; W = <span className="text-white font-bold tabular-nums">{round(W, 1)} N</span>
          </div>

          <div className="text-sm" style={{ color: C.text2 }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: C.indigoLight }}>Lami&rsquo;s theorem</p>
            <div className="flex items-center gap-1 text-white font-bold">
              <Frac num="T₁" den={`sin ${round(90 + readout.angR, 0)}°`} />
              <span>=</span>
              <Frac num="T₂" den={`sin ${round(90 + readout.angL, 0)}°`} />
              <span>=</span>
              <Frac num="W" den={`sin ${round(angBetweenCables, 0)}°`} />
            </div>
          </div>

          <Checkpoint
            question="You pull the two cables almost horizontal. What happens to their tension?"
            options={['It drops toward zero', 'It barely changes', 'It shoots up, far above the weight']}
            correct={2}
            explain="As the cables flatten, sin θ → 0, so T = W / (2 sin θ) blows up. A nearly-horizontal cable needs a huge tension to support even a small weight — which is why tightropes and power lines are pulled so hard."
            onResolved={() => complete('d-equilibrium')}
          />

          <ExpertTip>
            Equilibrium isn&rsquo;t &ldquo;no forces&rdquo; — it&rsquo;s forces that cancel. Flatten a support and its
            tension explodes; that&rsquo;s the physics behind every snapped clothesline.
          </ExpertTip>
        </>
      }
    />
  );
}

function norm(v: XY): XY {
  const m = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / m, y: v.y / m };
}
