'use client';

// Module 4 — Resolution into Components.
// Scenario: pulling a suitcase by a strap held at an angle.
// Targets: "components are projections, not halves." Shows Fx = F·cosθ does the
//   forward work while Fy = F·sinθ only lifts — the setup for the dot product
//   (work) in module 8 and for normal force in the upcoming NLM sim.
// Source: NCERT Class 11, Ch. 4 §4.6 (resolution of vectors).

import { useRef, useState } from 'react';
import { fromPolar, magnitude, angle360, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip } from '../components/primitives';

const F = frame({ originX: 130, originY: 300, scale: 18 });

export default function ResolutionPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [f, setF] = useState<Vec2>(fromPolar(8, 38));

  // Constrain to the upper-right quadrant — you pull a strap up-and-forward.
  const onChange = (v: Vec2) => setF({ x: Math.max(0, v.x), y: Math.max(0, v.y) });

  const fx: Vec2 = { x: f.x, y: 0 };
  const mag = magnitude(f);
  const theta = angle360(f);
  const origin = toScreen({ x: 0, y: 0 }, F);

  return (
    <PhaseLayout
      scenarioTitle="Pulling a suitcase by its strap"
      scenarioTag="Components"
      canvas={
        <Canvas ref={svgRef}>
          {/* ground + suitcase */}
          <line x1={0} y1={origin.y} x2={460} y2={origin.y} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
          <rect x={origin.x - 34} y={origin.y - 30} width={30} height={30} rx={5} fill="#1e2a44" stroke="rgba(129,140,248,0.4)" strokeWidth={2} />
          <circle cx={origin.x - 27} cy={origin.y} r={5} fill="#0a0f1c" stroke="#475569" strokeWidth={1.5} />
          <circle cx={origin.x - 11} cy={origin.y} r={5} fill="#0a0f1c" stroke="#475569" strokeWidth={1.5} />

          {/* projection guides */}
          <line {...seg({ x: f.x, y: 0 }, f)} stroke={C.ghost} strokeWidth={1.5} strokeDasharray="4 4" />
          <line {...seg({ x: 0, y: 0 }, { x: f.x, y: 0 })} stroke="transparent" />

          {/* components */}
          <VectorArrow from={{ x: 0, y: 0 }} to={fx} frame={F} color={C.emeraldLight} label="Fx" italicLabel={false} width={3} />
          <VectorArrow from={fx} to={f} frame={F} color={C.pink} label="Fy" italicLabel={false} width={3} />
          {/* the strap force */}
          <VectorArrow from={{ x: 0, y: 0 }} to={f} frame={F} color={C.amber} label="F" />
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />

          <DraggableHead value={f} frame={F} svgRef={svgRef} onChange={onChange} color={C.amber} maxMag={10} />
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Splitting a force apart</SideHeading>

          <Rule label="Resolve it">
            Any single force splits into two perpendicular pieces. The pull{' '}
            <span style={{ color: C.amber }}>F</span> becomes a forward part{' '}
            <span style={{ color: C.emeraldLight }}>Fx</span> and an upward part{' '}
            <span style={{ color: C.pink }}>Fy</span>.
          </Rule>

          <div className="space-y-1.5 text-base" style={{ color: C.text2 }}>
            <p className="text-xl font-bold text-white tabular-nums">
              Fx = F cos θ = <span style={{ color: C.emeraldLight }}>{round(f.x, 1)} N</span>
            </p>
            <p className="text-xl font-bold text-white tabular-nums">
              Fy = F sin θ = <span style={{ color: C.pink }}>{round(f.y, 1)} N</span>
            </p>
            <p className="text-sm">
              with F = <span className="text-white font-bold tabular-nums">{round(mag, 1)} N</span>, θ ={' '}
              <span className="text-white font-bold tabular-nums">{round(theta, 0)}°</span>
            </p>
          </div>

          <p className="text-sm leading-snug" style={{ color: C.text2 }}>
            Only <span style={{ color: C.emeraldLight }}>Fx</span> drags the case forward — it does the useful work.{' '}
            <span style={{ color: C.pink }}>Fy</span> just tries to lift it. Raise the strap angle and watch the
            forward part shrink: pull too steeply and you&rsquo;re mostly lifting, not moving.
          </p>
          <p className="text-sm leading-snug" style={{ color: C.muted }}>
            Components are <span style={{ color: C.text }}>projections</span> (shadows) of the force onto each axis —
            not two equal halves.
          </p>

          <ExpertTip>
            cos goes with the angle you measure from. Measure θ from the x-axis and the x-part is F cos θ — every
            single time.
          </ExpertTip>
        </>
      }
    />
  );
}

function seg(a: Vec2, b: Vec2) {
  const pa = toScreen(a, F);
  const pb = toScreen(b, F);
  return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y };
}
