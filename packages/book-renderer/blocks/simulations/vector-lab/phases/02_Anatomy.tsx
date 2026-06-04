'use client';

// Module 2 — Anatomy & Representation.
// Scenario: the tension in a kite string.
// Targets: tail / head / magnitude / direction; unit vector (î, ĵ); the
//   negative of a vector (same size, reversed). These are the graphical
//   objects PER finds students struggle to read.
// Source: NCERT Class 11, Ch. 4 §4.3-4.4 (position & unit vectors).

import { useRef, useState } from 'react';
import { fromPolar, magnitude, angle360, unit, negate, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { DraggableHead } from '../components/DraggableHead';
import { Rule, ExpertTip, Toggle } from '../components/primitives';
import { ComponentReadout } from '../components/ComponentReadout';

const F = frame({ originX: 120, originY: 330, scale: 19 });
const DEFAULT: Vec2 = fromPolar(8, 62);

function Hand({ at }: { at: Vec2 }) {
  const p = toScreen(at, F);
  return <circle cx={p.x} cy={p.y} r={7} fill="#2d3a5a" stroke={C.indigoMid} strokeWidth={2} />;
}

function Kite({ at }: { at: Vec2 }) {
  const p = toScreen(at, F);
  const s = 13;
  return (
    <polygon
      points={`${p.x},${p.y - s} ${p.x + s * 0.75},${p.y} ${p.x},${p.y + s} ${p.x - s * 0.75},${p.y}`}
      fill="rgba(251,191,36,0.18)"
      stroke={C.amber}
      strokeWidth={2}
    />
  );
}

export default function AnatomyPhase() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [t, setT] = useState<Vec2>(DEFAULT);
  const [showUnit, setShowUnit] = useState(false);
  const [showNeg, setShowNeg] = useState(false);
  const [mode, setMode] = useState<'polar' | 'cartesian'>('cartesian');

  const mag = magnitude(t);
  const u = unit(t);
  const neg = negate(t);

  return (
    <PhaseLayout
      scenarioTitle="Tension in a kite string"
      scenarioTag="Anatomy"
      canvas={
        <Canvas ref={svgRef}>
          {/* string */}
          <line {...lineProps({ x: 0, y: 0 }, t)} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="3 4" />
          <Kite at={t} />

          {showNeg ? <VectorArrow from={{ x: 0, y: 0 }} to={neg} frame={F} color={C.pink} label="−T" /> : null}
          <VectorArrow from={{ x: 0, y: 0 }} to={t} frame={F} color={C.indigoMid} label="T" />
          {showUnit ? <VectorArrow from={{ x: 0, y: 0 }} to={u} frame={F} color={C.emeraldLight} label="T̂" width={5} /> : null}

          <Hand at={{ x: 0, y: 0 }} />
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} r={3} />
          {/* tail / head annotations */}
          <text x={toScreen({ x: 0, y: 0 }, F).x - 10} y={toScreen({ x: 0, y: 0 }, F).y + 20} fill={C.ghost} fontSize={11} textAnchor="end">tail (hand)</text>
          <text x={toScreen(t, F).x + 16} y={toScreen(t, F).y - 10} fill={C.ghost} fontSize={11}>head (kite)</text>

          <DraggableHead value={t} frame={F} svgRef={svgRef} onChange={setT} color={C.indigoMid} maxMag={9} />
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>Parts of a vector</SideHeading>

          <Rule label="Read it like this">
            The string&rsquo;s tension starts at the <span style={{ color: C.amber }}>tail</span> and points to the{' '}
            <span style={{ color: C.amber }}>head</span>. Its length is the{' '}
            <span style={{ color: C.indigoLight }}>magnitude</span>, its tilt is the{' '}
            <span style={{ color: C.indigoLight }}>direction</span>.
          </Rule>

          <div className="space-y-1.5">
            <p className="text-base" style={{ color: C.text2 }}>
              In <span style={{ color: C.indigoLight }}>î ĵ</span> form:
            </p>
            <p className="text-xl font-bold text-white tabular-nums">
              T = {round(t.x, 1)} <span style={{ color: C.indigoLight, fontStyle: 'italic' }}>î</span>{' '}
              {t.y >= 0 ? '+' : '−'} {round(Math.abs(t.y), 1)} <span style={{ color: C.indigoLight, fontStyle: 'italic' }}>ĵ</span>
            </p>
            <p className="text-sm" style={{ color: C.text2 }}>
              | T | = <span className="text-white font-bold tabular-nums">{round(mag, 1)} N</span> at{' '}
              <span className="text-white font-bold tabular-nums">{round(angle360(t), 0)}°</span>. The unit vectors{' '}
              <span style={{ color: C.indigoLight, fontStyle: 'italic' }}>î</span> and{' '}
              <span style={{ color: C.indigoLight, fontStyle: 'italic' }}>ĵ</span> just mean &ldquo;one step along x&rdquo;
              and &ldquo;one step along y&rdquo;.
            </p>
          </div>

          <ComponentReadout rows={[{ label: 'T', color: C.indigoMid, v: t, unit: 'N' }]} mode={mode} onModeChange={setMode} />

          <div className="flex flex-col gap-2">
            <Toggle active={showUnit} onToggle={() => setShowUnit((v) => !v)} color={C.emeraldLight} activeLabel="Showing unit vector T̂ (length 1)" inactiveLabel="Show the unit vector T̂" />
            <Toggle active={showNeg} onToggle={() => setShowNeg((v) => !v)} color={C.pink} activeLabel="Showing −T (same size, reversed)" inactiveLabel="Show the negative vector −T" />
          </div>

          <ExpertTip>
            The unit vector is the &ldquo;just the direction&rdquo; version — length 1, no size. Multiply it by a
            magnitude and you rebuild any vector pointing that way.
          </ExpertTip>
        </>
      }
    />
  );
}

function lineProps(a: Vec2, b: Vec2) {
  const pa = toScreen(a, F);
  const pb = toScreen(b, F);
  return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y };
}
