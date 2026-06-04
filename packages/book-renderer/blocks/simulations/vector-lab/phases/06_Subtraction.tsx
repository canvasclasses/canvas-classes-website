'use client';

// Module 6 — Subtraction & Relative Velocity. ★ The pedagogical centerpiece.
// Scenario: rain on a walking person — why you tilt the umbrella forward.
// Targets: vector subtraction (the single hardest operation in PER). Teaches
//   A − B = A + (−B) by reversing B and adding, and shows the GHOST of the
//   common mistake (A + B) so the student sees the wrong answer and why.
// Source: NCERT Class 11, Ch. 4 §4.8 (relative velocity in a plane).

import { useRef, useState } from 'react';
import { add, negate, magnitude, angle360, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip, Toggle, Slider, MistakeCallout } from '../components/primitives';

const F = frame({ originX: 265, originY: 110, scale: 14 });

export default function SubtractionPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  // A = rain velocity (relative to ground), points downward.
  const [rain, setRain] = useState<Vec2>({ x: 0, y: -9 });
  // B = person's walking velocity (horizontal).
  const [walk, setWalk] = useState(6);
  const [showMistake, setShowMistake] = useState(false);

  const B: Vec2 = { x: walk, y: 0 };
  const negB = negate(B);
  const relative = add(rain, negB); // rain − person
  const wrong = add(rain, B); // the common mistake: rain + person

  // umbrella tilts to block the relative rain (opposite to where it travels)
  const tilt = angle360({ x: -relative.x, y: -relative.y });

  return (
    <PhaseLayout
      scenarioTitle="Rain on a walking person"
      scenarioTag="Relative velocity"
      canvas={
        <Canvas ref={svgRef}>
          {/* the rain, falling (A) */}
          <VectorArrow from={{ x: 0, y: 0 }} to={rain} frame={F} color={C.indigoMid} label="rain" italicLabel={false} />
          {/* reverse the person's velocity and add it: −B from the rain's tip */}
          <VectorArrow from={rain} to={add(rain, negB)} frame={F} color={C.pink} label="−person" italicLabel={false} dashed />
          {/* the relative velocity (the answer) */}
          <VectorArrow from={{ x: 0, y: 0 }} to={relative} frame={F} color={C.emeraldLight} label="rain − person" italicLabel={false} width={4.5} />

          {/* the common mistake ghost */}
          {showMistake ? <VectorArrow from={{ x: 0, y: 0 }} to={wrong} frame={F} color={C.red} label="rain + person ✗" italicLabel={false} width={2.5} dashed opacity={0.8} /> : null}

          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />
          <DraggableHead value={rain} frame={F} svgRef={svgRef} onChange={(v) => setRain({ x: v.x, y: Math.min(-1, v.y) })} color={C.indigoMid} maxMag={12} />

          {/* person + tilted umbrella at the bottom */}
          <Person tilt={tilt} />
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Subtracting is just reversing</SideHeading>

          <Rule label="The trick" color={C.pink}>
            To find <span style={{ color: C.emeraldLight }}>rain − person</span>, flip the person&rsquo;s vector to get{' '}
            <span style={{ color: C.pink }}>−person</span>, then add it tip-to-tail.{' '}
            <span style={{ color: C.text }}>A − B = A + (−B).</span>
          </Rule>

          <Slider label="Walking speed" value={walk} min={0} max={11} unit="m/s" color={C.amber} onChange={setWalk} />

          <p className="text-base leading-snug" style={{ color: C.text2 }}>
            In your own frame the rain arrives at{' '}
            <span className="text-white font-bold tabular-nums">{round(magnitude(relative), 1)} m/s</span>, slanting from
            ahead — so you tilt the umbrella <span style={{ color: C.text }}>forward</span>, into your motion. Stand
            still and it falls straight down again.
          </p>

          <Toggle active={showMistake} onToggle={() => setShowMistake((v) => !v)} color={C.red} activeLabel="Showing the common mistake" inactiveLabel="Show the common mistake" />
          {showMistake ? (
            <MistakeCallout>
              Adding instead of subtracting gives <span style={{ color: C.red }}>rain + person</span> — it leans the
              wrong way and would have you tilt the umbrella <span style={{ color: C.text }}>backward</span>. Reversing
              the right vector is everything.
            </MistakeCallout>
          ) : null}

          <ExpertTip>
            &ldquo;Relative to&rdquo; means subtract the observer&rsquo;s velocity. v(A relative to B) = vA − vB — flip
            B, add, done.
          </ExpertTip>
        </>
      }
    />
  );
}

function Person({ tilt }: { tilt: number }) {
  // Fixed cartoon at the bottom-centre; the umbrella canopy rotates by `tilt`.
  const cx = toScreen({ x: 0, y: 0 }, F).x - 4;
  const baseY = 388;
  return (
    <g>
      {/* body */}
      <line x1={cx} y1={baseY} x2={cx} y2={baseY - 34} stroke={C.text2} strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={baseY - 42} r={7} fill="#2d3a5a" stroke={C.indigoMid} strokeWidth={2} />
      {/* umbrella, rotated about the hand */}
      <g transform={`rotate(${90 - tilt} ${cx} ${baseY - 34})`}>
        <line x1={cx} y1={baseY - 34} x2={cx} y2={baseY - 74} stroke={C.text2} strokeWidth={2} />
        <path d={`M ${cx - 26} ${baseY - 74} Q ${cx} ${baseY - 94} ${cx + 26} ${baseY - 74} Z`} fill="rgba(52,211,153,0.2)" stroke={C.emeraldLight} strokeWidth={2} />
      </g>
    </g>
  );
}
