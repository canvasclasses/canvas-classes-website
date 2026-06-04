'use client';

// Module 1 — Why Direction Matters.
// Scenario: two people pushing a stalled car.
// Targets: scalar-vs-vector, and the position-independence misconception
//   (a vector is NOT tied to a location — only magnitude + direction matter).
// Source: NCERT Class 11, Ch. 4 §4.2 (scalars and vectors).

import { useRef, useState } from 'react';
import { fromPolar, magnitude, angle360, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip, ResetButton } from '../components/primitives';

const F = frame({ originX: 235, originY: 215, scale: 17 });
const DEFAULT: Vec2 = fromPolar(7, 20);

function Car({ at }: { at: Vec2 }) {
  const p = toScreen(at, F);
  return (
    <g opacity={0.9}>
      {/* body */}
      <rect x={p.x - 46} y={p.y - 14} width={92} height={26} rx={8} fill="#1e2a44" stroke="rgba(129,140,248,0.4)" strokeWidth={2} />
      <rect x={p.x - 26} y={p.y - 26} width={44} height={16} rx={6} fill="#243154" stroke="rgba(129,140,248,0.3)" strokeWidth={1.5} />
      {/* wheels */}
      <circle cx={p.x - 28} cy={p.y + 14} r={9} fill="#0a0f1c" stroke="#475569" strokeWidth={2} />
      <circle cx={p.x + 28} cy={p.y + 14} r={9} fill="#0a0f1c" stroke="#475569" strokeWidth={2} />
    </g>
  );
}

export default function WhyDirectionPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [push, setPush] = useState<Vec2>(DEFAULT);

  const mag = magnitude(push);
  const ang = angle360(push);
  const heading =
    ang < 22.5 || ang >= 337.5 ? 'east' : ang < 67.5 ? 'north-east' : ang < 112.5 ? 'north' : ang < 157.5 ? 'north-west' : ang < 202.5 ? 'west' : ang < 247.5 ? 'south-west' : ang < 292.5 ? 'south' : 'south-east';

  return (
    <PhaseLayout
      scenarioTitle="Two people pushing a stalled car"
      scenarioTag="Force"
      canvas={
        <Canvas ref={svgRef}>
          <Car at={{ x: 0, y: 0 }} />
          {/* Two ghost arrows: SAME magnitude+direction, DIFFERENT position. */}
          <VectorArrow from={{ x: -7, y: 6.5 }} to={{ x: -3.5, y: 6.5 }} frame={F} color={C.muted} width={2.5} dashed opacity={0.55} />
          <VectorArrow from={{ x: 3.5, y: 6.5 }} to={{ x: 7, y: 6.5 }} frame={F} color={C.muted} width={2.5} dashed opacity={0.55} />
          <text x={toScreen({ x: -5.2, y: 8.2 }, F).x} y={toScreen({ x: 0, y: 8.2 }, F).y} fill={C.ghost} fontSize={10} textAnchor="middle">same vector, moved</text>

          {/* The interactive push force, applied at the car. */}
          <VectorArrow from={{ x: 0, y: 0 }} to={push} frame={F} color={C.indigoMid} label="F" />
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />
          <DraggableHead value={push} frame={F} svgRef={svgRef} onChange={setPush} color={C.indigoMid} maxMag={8} />
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Direction is half the answer</SideHeading>

          <Rule label="The Idea">
            A <span style={{ color: C.amber }}>scalar</span> is just a size — mass, time, temperature.
            A <span style={{ color: C.indigoLight }}>vector</span> needs a size{' '}
            <span style={{ color: C.amber }}>and</span> a direction. Force is a vector.
          </Rule>

          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.indigoLight }}>
              Your push
            </p>
            <p className="text-base leading-snug" style={{ color: C.text2 }}>
              <span className="text-white font-bold tabular-nums">{round(mag, 1)} N</span> pointing{' '}
              <span className="text-white font-bold">{heading}</span>. Drag the tip — the same{' '}
              <span style={{ color: C.indigoLight }}>{round(mag, 1)} N</span> sends the car a completely different way
              depending on direction. A number alone can&rsquo;t tell the car where to go.
            </p>
          </div>

          <p className="text-base leading-snug" style={{ color: C.text2 }}>
            See the two faded arrows under the car? They&rsquo;re drawn in different places but have the{' '}
            <span style={{ color: C.text }}>same length and direction</span> — so they are the{' '}
            <span style={{ color: C.text }}>same vector</span>. Where you draw an arrow on the page never changes
            what it is.
          </p>

          <ResetButton onClick={() => setPush(DEFAULT)} label="Reset push" />

          <ExpertTip>
            A vector is free to slide anywhere — only its length and tilt define it. Position on the page is just
            bookkeeping.
          </ExpertTip>
        </>
      }
    />
  );
}
