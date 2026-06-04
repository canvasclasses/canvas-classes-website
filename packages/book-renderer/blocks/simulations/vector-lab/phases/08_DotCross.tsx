'use client';

// Module 8 — Dot & Cross Product (JEE Advanced).
// Scenarios: dragging a suitcase (dot → work W = F·d = Fd cosθ) and turning a
//   wrench (cross → torque τ = r×F, magnitude rF sinθ, direction by the
//   right-hand rule). Toggling between them contrasts "how much along" (dot)
//   with "how much across" (cross).
// Source: NCERT Class 11, Ch. 6 (work, dot product) & Ch. 7 (torque, cross).

import { useRef, useState } from 'react';
import { fromPolar, magnitude, dot, cross2, angleBetween, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip } from '../components/primitives';

const F = frame({ originX: 150, originY: 250, scale: 18 });
const REF: Vec2 = { x: 7, y: 0 }; // displacement d / lever arm r — fixed along +x

export default function DotCrossPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<'dot' | 'cross'>('dot');
  const [f, setF] = useState<Vec2>(fromPolar(7, 42));

  const between = angleBetween(REF, f);
  const work = dot(f, REF); // F·d
  const torque = cross2(REF, f); // r×F (z-component)
  const proj = (dot(f, REF) / magnitude(REF)); // scalar projection of F on d
  const projVec: Vec2 = { x: proj, y: 0 };
  const ccw = torque >= 0;

  const origin = toScreen({ x: 0, y: 0 }, F);
  const corner = { x: REF.x + f.x, y: REF.y + f.y };

  return (
    <PhaseLayout
      scenarioTitle={mode === 'dot' ? 'Dragging a suitcase — work done' : 'Turning a wrench — torque'}
      scenarioTag={mode === 'dot' ? 'Dot product' : 'Cross product'}
      canvas={
        <Canvas ref={svgRef}>
          {mode === 'cross' ? (
            <polygon
              points={[origin, toScreen(REF, F), toScreen(corner, F), toScreen(f, F)]
                .map((p) => `${p.x},${p.y}`)
                .join(' ')}
              fill={ccw ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)'}
              stroke={ccw ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'}
              strokeWidth={1.5}
            />
          ) : null}

          {/* reference vector: displacement (dot) or lever arm (cross) */}
          <VectorArrow from={{ x: 0, y: 0 }} to={REF} frame={F} color={C.emeraldLight} label={mode === 'dot' ? 'd' : 'r'} width={3} />

          {/* dot mode: projection of F onto d */}
          {mode === 'dot' ? (
            <>
              <line {...seg(f, projVec)} stroke={C.ghost} strokeWidth={1.5} strokeDasharray="4 4" />
              <VectorArrow from={{ x: 0, y: 0 }} to={projVec} frame={F} color={C.indigoLight} label="F cos θ" italicLabel={false} width={5} />
            </>
          ) : null}

          {/* the force */}
          <VectorArrow from={{ x: 0, y: 0 }} to={f} frame={F} color={C.amber} label="F" />
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />

          {/* cross mode: direction symbol (right-hand rule) */}
          {mode === 'cross' ? (
            <g>
              <circle cx={390} cy={70} r={16} fill="none" stroke={ccw ? C.emeraldLight : C.red} strokeWidth={2} />
              {ccw ? (
                <circle cx={390} cy={70} r={3.5} fill={C.emeraldLight} />
              ) : (
                <>
                  <line x1={379} y1={59} x2={401} y2={81} stroke={C.red} strokeWidth={2} />
                  <line x1={401} y1={59} x2={379} y2={81} stroke={C.red} strokeWidth={2} />
                </>
              )}
              <text x={390} y={104} fill={ccw ? C.emeraldLight : C.red} fontSize={11} fontWeight={700} textAnchor="middle">
                {ccw ? 'out of page' : 'into page'}
              </text>
            </g>
          ) : null}

          <DraggableHead value={f} frame={F} svgRef={svgRef} onChange={setF} color={C.amber} maxMag={9} />
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Two ways to multiply</SideHeading>

          <div className="flex items-center gap-5">
            {(['dot', 'cross'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="text-[11px] font-black uppercase tracking-widest pb-0.5"
                style={{
                  color: mode === m ? C.indigoLight : C.muted,
                  borderBottom: `2px solid ${mode === m ? C.indigo : 'transparent'}`,
                  background: 'none',
                }}
              >
                {m === 'dot' ? 'Dot · Work' : 'Cross · Torque'}
              </button>
            ))}
          </div>

          {mode === 'dot' ? (
            <>
              <Rule label="Dot product → a number">
                The dot product keeps only the part of <span style={{ color: C.amber }}>F</span> that lies{' '}
                <span style={{ color: C.text }}>along</span> the motion <span style={{ color: C.emeraldLight }}>d</span>.
                That part does the work.
              </Rule>
              <div className="space-y-1 text-base" style={{ color: C.text2 }}>
                <p className="text-xl font-bold text-white tabular-nums">
                  W = F · d = | F | | d | cos θ
                </p>
                <p className="text-base">
                  = <span className="font-bold tabular-nums" style={{ color: C.indigoLight }}>{round(work, 1)} J</span>{' '}
                  &nbsp;(θ = <span className="text-white tabular-nums">{round(between, 0)}°</span>)
                </p>
              </div>
              <p className="text-sm leading-snug" style={{ color: C.text2 }}>
                Pull straight along the floor (θ = 0) and every newton works. Pull at 90° — straight up — and the
                dot product is <span style={{ color: C.text }}>zero</span>: no work, however hard you pull.
              </p>
              <ExpertTip>Dot product = &ldquo;how much of one vector lies along the other.&rdquo; A scalar, and it&rsquo;s biggest when they&rsquo;re parallel.</ExpertTip>
            </>
          ) : (
            <>
              <Rule label="Cross product → a vector">
                The cross product keeps the part of <span style={{ color: C.amber }}>F</span> that lies{' '}
                <span style={{ color: C.text }}>across</span> the arm <span style={{ color: C.emeraldLight }}>r</span> —
                that&rsquo;s what twists the bolt.
              </Rule>
              <div className="space-y-1 text-base" style={{ color: C.text2 }}>
                <p className="text-xl font-bold text-white tabular-nums">
                  τ = | r × F | = | r | | F | sin θ
                </p>
                <p className="text-base">
                  = <span className="font-bold tabular-nums" style={{ color: ccw ? C.emeraldLight : C.red }}>{round(Math.abs(torque), 1)} N·m</span>,{' '}
                  pointing <span style={{ color: ccw ? C.emeraldLight : C.red }}>{ccw ? 'out of the page' : 'into the page'}</span>{' '}
                  (right-hand rule).
                </p>
              </div>
              <p className="text-sm leading-snug" style={{ color: C.text2 }}>
                Push along the spanner (θ = 0) and nothing turns — sin 0 = 0. Push at 90° and you get the full twist.
                The shaded parallelogram&rsquo;s area <span style={{ color: C.text }}>is</span> the torque.
              </p>
              <ExpertTip>Cross product = &ldquo;how much one vector lies across the other.&rdquo; A vector, perpendicular to both, biggest when they&rsquo;re at 90°.</ExpertTip>
            </>
          )}
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
