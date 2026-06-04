'use client';

// Dynamic Module — River Crossing (relative velocity, engine-driven).
// A real planck kinematic body integrates the boat's motion frame-by-frame so
// the resultant velocity becomes a TRACED TRAJECTORY and a landing point — the
// single clearest demonstration that v_ground = v_boat(rel water) + v_current.
// Source: NCERT Class 11, Ch. 4 §4.8 (relative velocity / river-boat problem).

import { useEffect, useRef, useState } from 'react';
import { World, Vec2 as PVec2 } from 'planck';
import type { XY, ViewTransform } from '../engine/transform';
import { PhysicsCanvas } from '../engine/PhysicsCanvas';
import { arrowM, dotM, lineM, pathM, polyM, textM, gridM } from '../engine/canvasKit';
import { C } from '../lib/theme';
import { round } from '../lib/vectorMath';
import { PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { Slider, Rule, ExpertTip } from '../components/primitives';
import { ObjectivesPanel } from '../learning/ObjectivesPanel';
import { Checkpoint } from '../learning/Checkpoint';
import { useMastery } from '../learning/mastery';

const WIDTH = 7; // river width (m), near bank y=0 → far bank y=WIDTH
const START_X = 0;
const D2R = Math.PI / 180;

type Phase = 'aim' | 'crossing' | 'landed';

export default function RiverCrossingPhase() {
  const { complete } = useMastery();
  const [boatSpeed, setBoatSpeed] = useState(3); // m/s relative to water
  const [current, setCurrent] = useState(1.6); // m/s downstream (+x)
  const [headingUp, setHeadingUp] = useState(0); // degrees aimed upstream from "straight across"
  const [phase, setPhase] = useState<Phase>('aim');
  const [landingX, setLandingX] = useState<number | null>(null);

  const worldRef = useRef<World | null>(null);
  const boatRef = useRef<ReturnType<World['createBody']> | null>(null);
  const traceRef = useRef<XY[]>([]);
  const particlesRef = useRef<XY[]>([]);

  // Live preview of the velocity triangle (also what the engine will integrate).
  const rad = headingUp * D2R;
  const vBoat: XY = { x: -boatSpeed * Math.sin(rad), y: boatSpeed * Math.cos(rad) };
  const vGround: XY = { x: vBoat.x + current, y: vBoat.y };
  const driftPerCross = vGround.y > 0 ? (vGround.x * WIDTH) / vGround.y : Infinity;

  // Build the world + boat + current particles once.
  useEffect(() => {
    const world = new World({ gravity: new PVec2(0, 0) });
    const boat = world.createBody({ type: 'kinematic', position: new PVec2(START_X, 0) });
    worldRef.current = world;
    boatRef.current = boat;
    const ps: XY[] = [];
    for (let i = 0; i < 46; i++) ps.push({ x: -7 + Math.random() * 16, y: Math.random() * WIDTH });
    particlesRef.current = ps;
    return () => {
      worldRef.current = null;
      boatRef.current = null;
    };
  }, []);

  const launch = () => {
    const boat = boatRef.current;
    if (!boat) return;
    boat.setTransform(new PVec2(START_X, 0), 0);
    boat.setLinearVelocity(new PVec2(0, 0));
    traceRef.current = [{ x: START_X, y: 0 }];
    setLandingX(null);
    setPhase('crossing');
  };
  const reset = () => {
    const boat = boatRef.current;
    if (boat) {
      boat.setTransform(new PVec2(START_X, 0), 0);
      boat.setLinearVelocity(new PVec2(0, 0));
    }
    traceRef.current = [];
    setLandingX(null);
    setPhase('aim');
  };

  const onStep = (dt: number) => {
    const world = worldRef.current;
    const boat = boatRef.current;
    if (!world || !boat) return;

    // Advect the current particles (visual only) — they drift downstream.
    for (const p of particlesRef.current) {
      p.x += current * dt;
      if (p.x > 9) p.x = -7;
    }

    if (phase !== 'crossing') return;
    boat.setLinearVelocity(new PVec2(vGround.x, vGround.y));
    world.step(dt);
    const pos = boat.getPosition();
    traceRef.current.push({ x: pos.x, y: pos.y });
    if (pos.y >= WIDTH) {
      boat.setLinearVelocity(new PVec2(0, 0));
      setLandingX(round(pos.x, 2));
      setPhase('landed');
      complete('d-river');
    }
  };

  const onDraw = (ctx: CanvasRenderingContext2D, t: ViewTransform) => {
    gridM(ctx, t, 1);

    // river band
    polyM(ctx, t, [
      { x: -7, y: 0 }, { x: 9, y: 0 }, { x: 9, y: WIDTH }, { x: -7, y: WIDTH },
    ], 'rgba(56,89,168,0.18)');
    lineM(ctx, t, { x: -7, y: 0 }, { x: 9, y: 0 }, 'rgba(148,163,184,0.5)', 2);
    lineM(ctx, t, { x: -7, y: WIDTH }, { x: 9, y: WIDTH }, 'rgba(148,163,184,0.5)', 2);
    textM(ctx, t, { x: -6.6, y: -0.05 }, 'near bank', C.ghost, { dyPx: 12, size: 10 });
    textM(ctx, t, { x: -6.6, y: WIDTH + 0.05 }, 'far bank', C.ghost, { dyPx: -10, size: 10 });

    // current particles
    for (const p of particlesRef.current) dotM(ctx, t, p, 'rgba(129,140,248,0.35)', 2);

    // target "straight across" line + landing
    lineM(ctx, t, { x: START_X, y: 0 }, { x: START_X, y: WIDTH }, 'rgba(52,211,153,0.35)', 1.5, true);
    if (landingX !== null) {
      dotM(ctx, t, { x: landingX, y: WIDTH }, C.amber, 5);
      textM(ctx, t, { x: landingX, y: WIDTH }, `drift ${landingX} m`, C.amber, { dyPx: -12, size: 11, align: 'center', weight: 700 });
    }

    // trajectory trace
    if (traceRef.current.length > 1) pathM(ctx, t, traceRef.current, C.emeraldLight, 2.5);

    // boat + live velocity triangle
    const boat = boatRef.current;
    const pos = boat ? boat.getPosition() : { x: START_X, y: 0 };
    const bp: XY = { x: pos.x, y: pos.y };
    // boat hull (a little triangle pointing along its heading-rel-water)
    const ang = Math.atan2(vBoat.y, vBoat.x);
    const nose = { x: bp.x + 0.5 * Math.cos(ang), y: bp.y + 0.5 * Math.sin(ang) };
    const tailL = { x: bp.x - 0.3 * Math.cos(ang) - 0.22 * Math.sin(ang), y: bp.y - 0.3 * Math.sin(ang) + 0.22 * Math.cos(ang) };
    const tailR = { x: bp.x - 0.3 * Math.cos(ang) + 0.22 * Math.sin(ang), y: bp.y - 0.3 * Math.sin(ang) - 0.22 * Math.cos(ang) };
    polyM(ctx, t, [nose, tailL, tailR], 'rgba(226,232,240,0.85)', '#cbd5e1');

    // vectors scaled (1 m/s ≈ 1 m on the canvas reads cleanly here)
    const tip = (v: XY): XY => ({ x: bp.x + v.x, y: bp.y + v.y });
    arrowM(ctx, t, bp, tip(vBoat), { color: C.indigoMid, label: 'boat', italic: false, width: 3 });
    arrowM(ctx, t, tip(vBoat), tip(vGround), { color: C.amber, label: 'current', italic: false, width: 3, dashed: true });
    arrowM(ctx, t, bp, tip(vGround), { color: C.emeraldLight, label: 'actual', italic: false, width: 4 });
    dotM(ctx, t, bp, C.text, 2.5);
  };

  return (
    <PhaseLayout
      scenarioTitle="Rowing a boat across a flowing river"
      scenarioTag="Relative velocity · live"
      canvas={
        <PhysicsCanvas
          metersWide={16}
          originXFrac={0.44}
          originYFrac={0.86}
          height={440}
          onStep={onStep}
          onDraw={onDraw}
        />
      }
      sidebar={
        <>
          <ObjectivesPanel
            moduleId="d-river"
            objectives={[
              'See the resultant velocity become a real path across the river',
              'Predict where the current carries the boat',
              'Aim upstream to cancel the drift and land straight across',
            ]}
          />
          <SideHeading>The river pushes back</SideHeading>

          <Rule label="Two velocities, one path">
            The water carries the boat <span style={{ color: C.amber }}>downstream</span> while you row{' '}
            <span style={{ color: C.indigoLight }}>across</span>. Its real motion is the{' '}
            <span style={{ color: C.emeraldLight }}>sum</span> — so it lands downstream of where it&rsquo;s pointed.
          </Rule>

          <div className="flex flex-col gap-3">
            <Slider label="Boat speed (rel. water)" value={boatSpeed} min={1} max={6} step={0.1} unit="m/s" color={C.indigoMid} onChange={(v) => { setBoatSpeed(v); reset(); }} />
            <Slider label="Current speed" value={current} min={0} max={4} step={0.1} unit="m/s" color={C.amber} onChange={(v) => { setCurrent(v); reset(); }} />
            <Slider label="Aim upstream" value={headingUp} min={0} max={80} unit="°" color={C.emeraldLight} onChange={(v) => { setHeadingUp(v); reset(); }} />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={launch} disabled={phase === 'crossing'} className="px-5 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: C.emeraldLight, opacity: phase === 'crossing' ? 0.5 : 1 }}>
              ▶ Launch boat
            </button>
            <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: C.text2 }}>
              ↺ Reset
            </button>
          </div>

          <p className="text-sm leading-snug" style={{ color: C.text2 }}>
            Predicted drift this crossing:{' '}
            <span className="text-white font-bold tabular-nums">
              {Number.isFinite(driftPerCross) ? `${round(driftPerCross, 1)} m` : 'never reaches the far bank'}
            </span>
            {boatSpeed > current ? (
              <> · cancel it exactly by aiming <span style={{ color: C.emeraldLight }}>{round(Math.asin(Math.min(1, current / boatSpeed)) / D2R, 0)}°</span> upstream.</>
            ) : (
              <> · the current is faster than you can row — you can&rsquo;t avoid drifting.</>
            )}
          </p>

          <Checkpoint
            question="To land directly across (zero drift), which way should you point the boat?"
            options={['Straight across', 'Angled upstream', 'Angled downstream']}
            correct={1}
            explain="Aim upstream so your across-velocity's upstream component cancels the current: sin θ = current / boat speed. Then the resultant points straight across."
            onResolved={() => complete('d-river')}
          />

          <ExpertTip>
            You never beat the current by rowing harder straight across — you beat it by pointing partly into it. The
            resultant does the rest.
          </ExpertTip>
        </>
      }
    />
  );
}
