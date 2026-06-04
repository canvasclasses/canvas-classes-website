'use client';

// Module 5 — Analytical Addition (the components method).
// Scenario: a plane's heading + a crosswind = its true ground velocity.
// Targets: the documented error of SUBTRACTING x-components when adding. The
//   table makes the rule physical: x adds to x, y adds to y, never crossed.
// Source: NCERT Class 11, Ch. 4 §4.7 (analytical method of addition).

import { useRef, useState } from 'react';
import { add, fromPolar, magnitude, angle360, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip } from '../components/primitives';

const F = frame({ originX: 150, originY: 230, scale: 14 });

export default function AnalyticalAdditionPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [air, setAir] = useState<Vec2>(fromPolar(10, 8)); // plane through the air
  const [wind, setWind] = useState<Vec2>(fromPolar(5, 120)); // crosswind
  const ground = add(air, wind);

  const cell = (n: number, color: string = C.text) => (
    <td className="text-right py-1.5 px-3 tabular-nums font-bold" style={{ color }}>
      {round(n, 1)}
    </td>
  );

  return (
    <PhaseLayout
      scenarioTitle="Plane heading + crosswind = ground track"
      scenarioTag="Velocity"
      canvas={
        <Canvas ref={svgRef}>
          {/* tip-to-tail so the ground track is visibly the closing side */}
          <VectorArrow from={{ x: 0, y: 0 }} to={air} frame={F} color={C.indigoMid} label="air" italicLabel={false} />
          <VectorArrow from={air} to={ground} frame={F} color={C.amber} label="wind" italicLabel={false} />
          <VectorArrow from={{ x: 0, y: 0 }} to={ground} frame={F} color={C.emeraldLight} label="ground" italicLabel={false} width={4.5} />
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />
          {/* tiny plane marker */}
          <text x={toScreen({ x: 0, y: 0 }, F).x - 6} y={toScreen({ x: 0, y: 0 }, F).y + 5} fontSize={16}>✈</text>

          <DraggableHead value={air} frame={F} svgRef={svgRef} onChange={setAir} color={C.indigoMid} maxMag={13} />
          <DraggableHead value={ground} frame={F} svgRef={svgRef} onChange={(v) => setWind({ x: v.x - air.x, y: v.y - air.y })} tail={air} color={C.amber} maxMag={13} />
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Adding by components</SideHeading>

          <Rule label="The only rule">
            Add the x-parts to get <span style={{ color: C.emeraldLight }}>Rx</span>, add the y-parts to get{' '}
            <span style={{ color: C.emeraldLight }}>Ry</span>. <span style={{ color: C.text }}>Never mix the columns.</span>
          </Rule>

          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.ghost }}>
                <th className="text-left py-1.5" />
                <th className="text-right py-1.5 px-3">x</th>
                <th className="text-right py-1.5 px-3">y</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: `1px solid ${C.divider}` }}>
                <td className="py-1.5 font-black" style={{ color: C.indigoMid }}>air velocity</td>
                {cell(air.x)}
                {cell(air.y)}
              </tr>
              <tr style={{ borderTop: `1px solid ${C.divider}` }}>
                <td className="py-1.5 font-black" style={{ color: C.amber }}>+ wind</td>
                {cell(wind.x)}
                {cell(wind.y)}
              </tr>
              <tr style={{ borderTop: `2px solid rgba(52,211,153,0.4)` }}>
                <td className="py-2 font-black" style={{ color: C.emeraldLight }}>= ground</td>
                {cell(ground.x, C.emeraldLight)}
                {cell(ground.y, C.emeraldLight)}
              </tr>
            </tbody>
          </table>

          <p className="text-base" style={{ color: C.text2 }}>
            Recombine:{' '}
            <span className="text-white font-bold tabular-nums">
              | ground | = √(Rx² + Ry²) = {round(magnitude(ground), 1)}
            </span>{' '}
            at <span className="text-white font-bold tabular-nums">{round(angle360(ground), 0)}°</span>.
          </p>
          <p className="text-sm leading-snug" style={{ color: C.text2 }}>
            That&rsquo;s why a plane pointed dead-ahead drifts sideways in a crosswind — the wind&rsquo;s components add
            in, bending the real path off the nose direction.
          </p>

          <ExpertTip>
            Two vectors → four numbers → two sums → one resultant. Stay in columns and you can&rsquo;t go wrong; the
            classic slip is subtracting the x-parts out of habit.
          </ExpertTip>
        </>
      }
    />
  );
}
