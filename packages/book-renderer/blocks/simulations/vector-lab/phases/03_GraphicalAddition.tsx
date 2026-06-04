'use client';

// Module 3 — Graphical Addition.
// Scenario: two tugboats pulling a ship.
// Targets: the "closing-the-loop" error (resultant drawn backwards). Shows the
//   tip-to-tail and parallelogram methods give the SAME resultant, and binds
//   the parallelogram law R = √(A² + B² + 2AB·cosθ) live to the drag.
// Source: NCERT Class 11, Ch. 4 §4.5 (triangle & parallelogram laws).

import { useRef, useState } from 'react';
import { add, sub, fromPolar, magnitude, angleBetween, angleDeg, parallelogramMagnitude, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot, AngleArc } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip } from '../components/primitives';

const F = frame({ originX: 140, originY: 250, scale: 15 });

export default function GraphicalAdditionPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState<Vec2>(fromPolar(8, 28));
  const [b, setB] = useState<Vec2>(fromPolar(7, -22));
  const [method, setMethod] = useState<'tip' | 'para'>('tip');

  const r = add(a, b);
  const between = angleBetween(a, b);
  const lawR = parallelogramMagnitude(magnitude(a), magnitude(b), between);

  return (
    <PhaseLayout
      scenarioTitle="Two tugboats pulling one ship"
      scenarioTag="Resultant"
      canvas={
        <Canvas ref={svgRef}>
          {method === 'tip' ? (
            <>
              {/* A from origin, B from tip of A, R closes origin → tip of B */}
              <VectorArrow from={{ x: 0, y: 0 }} to={a} frame={F} color={C.indigoMid} label="A" />
              <VectorArrow from={a} to={r} frame={F} color={C.amber} label="B" />
              <VectorArrow from={{ x: 0, y: 0 }} to={r} frame={F} color={C.emeraldLight} label="R" width={4.5} />
            </>
          ) : (
            <>
              {/* Parallelogram: both from origin, dashed completions, R = diagonal */}
              <VectorArrow from={{ x: 0, y: 0 }} to={a} frame={F} color={C.indigoMid} label="A" />
              <VectorArrow from={{ x: 0, y: 0 }} to={b} frame={F} color={C.amber} label="B" />
              <VectorArrow from={a} to={r} frame={F} color={C.amber} width={2} dashed opacity={0.5} />
              <VectorArrow from={b} to={r} frame={F} color={C.indigoMid} width={2} dashed opacity={0.5} />
              <VectorArrow from={{ x: 0, y: 0 }} to={r} frame={F} color={C.emeraldLight} label="R" width={4.5} />
            </>
          )}

          <AngleArc vertex={{ x: 0, y: 0 }} fromDeg={angleDeg(b)} toDeg={angleDeg(a)} frame={F} label="θ" />
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />
          <text x={toScreen({ x: 0, y: 0 }, F).x} y={toScreen({ x: 0, y: 0 }, F).y + 22} fill={C.ghost} fontSize={11} textAnchor="middle">ship</text>

          <DraggableHead value={a} frame={F} svgRef={svgRef} onChange={setA} color={C.indigoMid} maxMag={11} />
          {method === 'tip' ? (
            // In tip-to-tail mode B is drawn from A's head, so its handle lives there.
            <DraggableHead value={r} tail={a} frame={F} svgRef={svgRef} onChange={(v) => setB(sub(v, a))} color={C.amber} maxMag={11} />
          ) : (
            <DraggableHead value={b} frame={F} svgRef={svgRef} onChange={setB} color={C.amber} maxMag={11} />
          )}
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Adding by drawing</SideHeading>

          {/* method switch */}
          <div className="flex items-center gap-5">
            {(['tip', 'para'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className="text-[11px] font-black uppercase tracking-widest pb-0.5"
                style={{
                  color: method === m ? C.indigoLight : C.muted,
                  borderBottom: `2px solid ${method === m ? C.indigo : 'transparent'}`,
                  background: 'none',
                }}
              >
                {m === 'tip' ? 'Tip-to-tail' : 'Parallelogram'}
              </button>
            ))}
          </div>

          <Rule label={method === 'tip' ? 'Triangle law' : 'Parallelogram law'}>
            {method === 'tip' ? (
              <>
                Slide <span style={{ color: C.amber }}>B</span> so its tail starts at the head of{' '}
                <span style={{ color: C.indigoLight }}>A</span>. The resultant{' '}
                <span style={{ color: C.emeraldLight }}>R</span> runs from the first tail to the last head.
              </>
            ) : (
              <>
                Draw <span style={{ color: C.indigoLight }}>A</span> and <span style={{ color: C.amber }}>B</span> from
                the same point and complete the parallelogram.{' '}
                <span style={{ color: C.emeraldLight }}>R</span> is the diagonal.
              </>
            )}
          </Rule>

          <div className="flex items-center gap-3 text-base" style={{ color: C.text2 }}>
            <span>R =</span>
            <span className="text-white font-bold">
              √( A² + B² + 2·A·B·cos θ )
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: C.text2 }}>
            <span>θ = <span className="text-white font-bold tabular-nums">{round(between, 0)}°</span></span>
            <span>law → <span className="font-bold tabular-nums" style={{ color: C.emeraldLight }}>{round(lawR, 2)}</span></span>
            <span>by drawing → <span className="font-bold tabular-nums" style={{ color: C.emeraldLight }}>{round(magnitude(r), 2)}</span></span>
          </div>
          <p className="text-sm leading-snug" style={{ color: C.text2 }}>
            Both numbers match — the formula and the picture are the same truth. Notice{' '}
            <span style={{ color: C.text }}>R is shorter than A + B</span> unless the boats pull in exactly the same
            direction (θ = 0).
          </p>

          <ExpertTip>
            The resultant always points from the very first tail to the very last head — never the other way. Draw
            it backwards and you&rsquo;ve found −R.
          </ExpertTip>
        </>
      }
    />
  );
}
