'use client';

// Dynamic Module — Net Force → Motion (F = ma, engine-driven).
// A puck on a top-down surface. You aim an applied-force vector; planck
// integrates F = ma in real time so the resultant force VISIBLY becomes
// acceleration and then velocity. Optional kinetic friction opposes motion.
// This is the conceptual bridge from "adding vectors" to Newton's second law.
// Source: NCERT Class 11, Ch. 5 (Newton's second law, F = ma).

import { useEffect, useRef, useState } from 'react';
import { World, Vec2 as PVec2, Box } from 'planck';
import type { XY, ViewTransform } from '../engine/transform';
import { PhysicsCanvas } from '../engine/PhysicsCanvas';
import { arrowM, dotM, polyM, textM, gridM } from '../engine/canvasKit';
import { C } from '../lib/theme';
import { round } from '../lib/vectorMath';
import { PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { Slider, Toggle, Rule, ExpertTip } from '../components/primitives';
import { ObjectivesPanel } from '../learning/ObjectivesPanel';
import { Checkpoint } from '../learning/Checkpoint';
import { useMastery } from '../learning/mastery';

const G = 9.8;
const FORCE_SCALE = 0.28; // metres of arrow per newton
type Body = ReturnType<World['createBody']>;

export default function NetForceMotionPhase() {
  const { complete } = useMastery();
  const [mass, setMass] = useState(2);
  const [frictionOn, setFrictionOn] = useState(false);
  const [mu, setMu] = useState(0.3);
  const [running, setRunning] = useState(false);
  const [force, setForce] = useState<XY>({ x: 6, y: 2 });
  const [vel, setVel] = useState<XY>({ x: 0, y: 0 });

  const worldRef = useRef<World | null>(null);
  const puckRef = useRef<Body | null>(null);
  const dragRef = useRef(false);
  const traceRef = useRef<XY[]>([]);
  const tickRef = useRef(0);
  // Live mirrors so onStep (recreated each render) always reads fresh values.
  const forceRef = useRef(force);
  const runRef = useRef(running);
  const fricRef = useRef({ on: frictionOn, mu });
  forceRef.current = force;
  runRef.current = running;
  fricRef.current = { on: frictionOn, mu };

  useEffect(() => {
    const world = new World({ gravity: new PVec2(0, 0) });
    const puck = world.createBody({ type: 'dynamic', position: new PVec2(0, 0), fixedRotation: true, linearDamping: 0 });
    puck.createFixture(new Box(0.4, 0.4), { density: 1 });
    puck.setMassData({ mass: 2, center: new PVec2(0, 0), I: 0 });
    worldRef.current = world;
    puckRef.current = puck;
    return () => {
      worldRef.current = null;
    };
  }, []);

  useEffect(() => {
    puckRef.current?.setMassData({ mass, center: new PVec2(0, 0), I: 0 });
    puckRef.current?.setAwake(true);
  }, [mass]);

  const reset = () => {
    const puck = puckRef.current;
    if (puck) {
      puck.setTransform(new PVec2(0, 0), 0);
      puck.setLinearVelocity(new PVec2(0, 0));
      puck.setAwake(true);
    }
    traceRef.current = [];
    setVel({ x: 0, y: 0 });
    setRunning(false);
  };

  const onStep = (dt: number) => {
    const world = worldRef.current;
    const puck = puckRef.current;
    if (!world || !puck) return;
    if (runRef.current) {
      const F = forceRef.current;
      puck.applyForceToCenter(new PVec2(F.x, F.y), true);
      const v = puck.getLinearVelocity();
      const speed = Math.hypot(v.x, v.y);
      if (fricRef.current.on && speed > 0.05) {
        const fricMag = fricRef.current.mu * mass * G;
        puck.applyForceToCenter(new PVec2((-v.x / speed) * fricMag, (-v.y / speed) * fricMag), true);
      }
      world.step(dt);
      const p = puck.getPosition();
      if (tickRef.current % 2 === 0) traceRef.current.push({ x: p.x, y: p.y });
      // stop if it sails off-stage
      if (Math.abs(p.x) > 10 || Math.abs(p.y) > 7) setRunning(false);
    }
    tickRef.current++;
    if (tickRef.current % 5 === 0) {
      const v = puck.getLinearVelocity();
      setVel({ x: v.x, y: v.y });
    }
  };

  const onPointerDown = (w: XY) => {
    if (running) return; // only aim while paused
    dragRef.current = true;
    const puck = puckRef.current;
    const pp = puck ? puck.getPosition() : { x: 0, y: 0 };
    setForce(clampF({ x: (w.x - pp.x) / FORCE_SCALE, y: (w.y - pp.y) / FORCE_SCALE }));
  };
  const onPointerMove = (w: XY) => {
    if (!dragRef.current || running) return;
    const puck = puckRef.current;
    const pp = puck ? puck.getPosition() : { x: 0, y: 0 };
    setForce(clampF({ x: (w.x - pp.x) / FORCE_SCALE, y: (w.y - pp.y) / FORCE_SCALE }));
  };
  const onPointerUp = () => {
    dragRef.current = false;
  };

  const onDraw = (ctx: CanvasRenderingContext2D, t: ViewTransform) => {
    gridM(ctx, t, 1);
    const puck = puckRef.current;
    const p = puck ? puck.getPosition() : { x: 0, y: 0 };
    const pp: XY = { x: p.x, y: p.y };

    if (traceRef.current.length > 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(129,140,248,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const a0 = t.toPx(traceRef.current[0]);
      ctx.moveTo(a0.x, a0.y);
      for (const q of traceRef.current) {
        const px = t.toPx(q);
        ctx.lineTo(px.x, px.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // puck
    polyM(ctx, t, [{ x: p.x - 0.4, y: p.y - 0.4 }, { x: p.x + 0.4, y: p.y - 0.4 }, { x: p.x + 0.4, y: p.y + 0.4 }, { x: p.x - 0.4, y: p.y + 0.4 }], '#1e2a44', 'rgba(129,140,248,0.5)');
    textM(ctx, t, pp, `${mass}kg`, C.text2, { align: 'center', size: 10, weight: 700 });

    const F = force;
    const v = vel;
    const fricMag = frictionOn ? mu * mass * G : 0;
    const speed = Math.hypot(v.x, v.y);
    const fric: XY = speed > 0.05 ? { x: (-v.x / speed) * fricMag, y: (-v.y / speed) * fricMag } : { x: 0, y: 0 };
    const net: XY = { x: F.x + fric.x, y: F.y + fric.y };

    // applied force (amber) — its head is the drag handle while paused
    arrowM(ctx, t, pp, { x: pp.x + F.x * FORCE_SCALE, y: pp.y + F.y * FORCE_SCALE }, { color: C.amber, label: 'F applied', italic: false, width: 3.5 });
    if (frictionOn && speed > 0.05) {
      arrowM(ctx, t, pp, { x: pp.x + fric.x * FORCE_SCALE, y: pp.y + fric.y * FORCE_SCALE }, { color: C.red, label: 'friction', italic: false, width: 3 });
    }
    // net force (emerald)
    arrowM(ctx, t, pp, { x: pp.x + net.x * FORCE_SCALE, y: pp.y + net.y * FORCE_SCALE }, { color: C.emeraldLight, label: 'net', italic: false, width: 2.5, dashed: true });
    // velocity (indigo), scaled differently (0.4 m per m/s)
    if (speed > 0.05) arrowM(ctx, t, pp, { x: pp.x + v.x * 0.4, y: pp.y + v.y * 0.4 }, { color: C.indigoMid, label: 'v', width: 3 });
    if (!running) dotM(ctx, t, { x: pp.x + F.x * FORCE_SCALE, y: pp.y + F.y * FORCE_SCALE }, C.amber, 7);
  };

  const Fmag = Math.hypot(force.x, force.y);
  const fricMag = frictionOn ? mu * mass * G : 0;
  const speed = Math.hypot(vel.x, vel.y);
  // net magnitude along motion (rough, for readout): |F| minus friction when moving
  const netMag = Math.max(0, Fmag - (speed > 0.05 ? fricMag : 0));
  const accel = netMag / mass;

  return (
    <PhaseLayout
      scenarioTitle="Push a puck — the net force becomes motion"
      scenarioTag="F = ma · live"
      canvas={
        <PhysicsCanvas
          metersWide={14}
          originXFrac={0.5}
          originYFrac={0.5}
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
            moduleId="d-netforce"
            objectives={[
              'See the resultant force point the same way as acceleration',
              'Watch velocity build up along the net force',
              'Add friction and see the net force (and path) bend',
            ]}
          />
          <SideHeading>Where the resultant takes you</SideHeading>

          <Rule label="Aim, then launch">
            Drag to aim the <span style={{ color: C.amber }}>applied force</span>, then launch. The puck accelerates
            along the <span style={{ color: C.emeraldLight }}>net force</span> — that&rsquo;s Newton&rsquo;s second law,{' '}
            <span style={{ color: C.text }}>a = F / m</span>, with vectors doing the work.
          </Rule>

          <div className="flex flex-col gap-3">
            <Slider label="Mass" value={mass} min={0.5} max={6} step={0.5} unit="kg" color={C.indigoMid} onChange={(v) => { setMass(v); }} />
            <Toggle active={frictionOn} onToggle={() => setFrictionOn((f) => !f)} color={C.red} activeLabel="Friction on" inactiveLabel="Add kinetic friction" />
            {frictionOn ? <Slider label="Friction coefficient μ" value={mu} min={0.05} max={0.8} step={0.05} color={C.red} onChange={setMu} /> : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRunning((r) => !r); complete('d-netforce'); }}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: C.emeraldLight }}
            >
              {running ? '❙❙ Pause' : '▶ Launch'}
            </button>
            <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: C.text2 }}>
              ↺ Reset
            </button>
          </div>

          <div className="text-base" style={{ color: C.text2 }}>
            | F | = <span className="text-white font-bold tabular-nums">{round(Fmag, 1)} N</span> &nbsp;·&nbsp;
            a = <span className="text-white font-bold tabular-nums">{round(accel, 2)} m/s²</span> &nbsp;·&nbsp;
            | v | = <span className="text-white font-bold tabular-nums">{round(speed, 1)} m/s</span>
          </div>

          <Checkpoint
            question="With a steady force pushing it, the puck's velocity arrow will…"
            options={['Stay a fixed length', 'Grow longer over time', 'Point opposite the force']}
            correct={1}
            explain="A constant net force gives constant acceleration, so velocity keeps increasing — the v arrow grows every second. Force sets acceleration, not velocity itself."
            onResolved={() => complete('d-netforce')}
          />

          <ExpertTip>
            Force decides the direction of <em>acceleration</em>, not of motion. That&rsquo;s why a thrown ball can move
            up while gravity pulls it down — velocity and net force are different vectors.
          </ExpertTip>
        </>
      }
    />
  );
}

function clampF(f: XY): XY {
  const m = Math.hypot(f.x, f.y);
  const max = 12;
  if (m > max) return { x: (f.x / m) * max, y: (f.y / m) * max };
  return f;
}
