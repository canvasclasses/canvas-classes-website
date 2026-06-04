'use client';

// Module 7 — Equilibrium & the Triangle of Forces.
// Scenario: a signboard hung from two cables.
// Targets: ΣF = 0, resultant vs equilibrant, and Lami's theorem for three
//   concurrent forces. Toggling the force triangle shows the three forces
//   closing into a loop — the geometric meaning of equilibrium.
// Source: NCERT Class 11, Ch. 5 §5.x (equilibrium of concurrent forces);
//   Lami's theorem is the standard JEE result for three coplanar forces.

import { useState } from 'react';
import { fromPolar, round, type Vec2 } from '../lib/vectorMath';
import { frame, toScreen } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot } from '../components/svg';
import { Rule, ExpertTip, Toggle, Slider, Frac } from '../components/primitives';

const F = frame({ originX: 230, originY: 215, scale: 15 });
const D2R = Math.PI / 180;

export default function EquilibriumPhase() {
  const [w, setW] = useState(6); // weight of the board
  const [th1, setTh1] = useState(40); // left cable, degrees above horizontal
  const [th2, setTh2] = useState(55); // right cable, degrees above horizontal
  const [triangle, setTriangle] = useState(false);

  // Solve the joint: T1·cosθ1 = T2·cosθ2 (horizontal), T1·sinθ1 + T2·sinθ2 = W.
  const t1 = w / (Math.sin(th1 * D2R) + Math.cos(th1 * D2R) * Math.tan(th2 * D2R));
  const t2 = (t1 * Math.cos(th1 * D2R)) / Math.cos(th2 * D2R);

  // Force vectors AT the joint (physics coords).
  const T1: Vec2 = fromPolar(t1, 180 - th1); // up-left
  const T2: Vec2 = fromPolar(t2, th2); // up-right
  const W: Vec2 = { x: 0, y: -w }; // straight down

  // Common display scale so all three arrows are proportionally honest on canvas.
  const ds = 5 / Math.max(t1, t2, w);
  const sv = (v: Vec2): Vec2 => ({ x: v.x * ds, y: v.y * ds });

  // anchors for the cables
  const L = 7.5;
  const anchorL: Vec2 = fromPolar(L, 180 - th1);
  const anchorR: Vec2 = fromPolar(L, th2);

  const joint = toScreen({ x: 0, y: 0 }, F);

  // Lami angles (angle "opposite" each force = angle between the other two).
  const angBetween_T1_T2 = th1 + th2; // between the two cables
  const angOpp_W = angBetween_T1_T2;
  const angOpp_T1 = 90 + th2; // between W (down) and T2
  const angOpp_T2 = 90 + th1; // between W (down) and T1

  return (
    <PhaseLayout
      scenarioTitle="A signboard on two cables"
      scenarioTag="Equilibrium"
      canvas={
        <Canvas>
          {!triangle ? (
            <>
              {/* cables + ceiling brackets */}
              <line {...seg({ x: 0, y: 0 }, anchorL)} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
              <line {...seg({ x: 0, y: 0 }, anchorR)} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
              <Bracket at={anchorL} />
              <Bracket at={anchorR} />
              {/* signboard */}
              <rect x={joint.x - 34} y={joint.y + 6} width={68} height={26} rx={4} fill="#1e2a44" stroke="rgba(129,140,248,0.4)" strokeWidth={2} />
              <text x={joint.x} y={joint.y + 23} fill={C.text2} fontSize={11} fontWeight={700} textAnchor="middle">SALE</text>
              {/* forces at the joint */}
              <VectorArrow from={{ x: 0, y: 0 }} to={sv(T1)} frame={F} color={C.indigoMid} label="T₁" italicLabel={false} />
              <VectorArrow from={{ x: 0, y: 0 }} to={sv(T2)} frame={F} color={C.amber} label="T₂" italicLabel={false} />
              <VectorArrow from={{ x: 0, y: 0 }} to={sv(W)} frame={F} color={C.emeraldLight} label="W" italicLabel={false} />
              <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />
            </>
          ) : (
            <>
              {/* the three forces tip-to-tail → a CLOSED triangle (ΣF = 0) */}
              <VectorArrow from={{ x: 0, y: 0 }} to={sv(W)} frame={F} color={C.emeraldLight} label="W" italicLabel={false} />
              <VectorArrow from={sv(W)} to={addv(sv(W), sv(T2))} frame={F} color={C.amber} label="T₂" italicLabel={false} />
              <VectorArrow from={addv(sv(W), sv(T2))} to={addv(addv(sv(W), sv(T2)), sv(T1))} frame={F} color={C.indigoMid} label="T₁" italicLabel={false} />
              <text x={joint.x} y={388} fill={C.ghost} fontSize={12} textAnchor="middle">three forces close the loop → balanced</text>
            </>
          )}
        </Canvas>
      }
      sidebar={
        <>
          <SideHeading>When everything balances</SideHeading>

          <Rule label="Equilibrium">
            The board doesn&rsquo;t move, so the three forces add to{' '}
            <span style={{ color: C.emeraldLight }}>zero</span>: T₁ + T₂ + W = 0. Drawn tip-to-tail they form a{' '}
            <span style={{ color: C.text }}>closed triangle</span>.
          </Rule>

          <div className="flex flex-col gap-3">
            <Slider label="Board weight W" value={w} min={2} max={10} unit="N" color={C.emeraldLight} onChange={setW} />
            <Slider label="Left cable angle θ₁" value={th1} min={20} max={75} unit="°" color={C.indigoMid} onChange={setTh1} />
            <Slider label="Right cable angle θ₂" value={th2} min={20} max={75} unit="°" color={C.amber} onChange={setTh2} />
          </div>

          <div className="text-base" style={{ color: C.text2 }}>
            <span style={{ color: C.indigoMid }}>T₁</span> ={' '}
            <span className="text-white font-bold tabular-nums">{round(t1, 1)} N</span> &nbsp;·&nbsp;{' '}
            <span style={{ color: C.amber }}>T₂</span> ={' '}
            <span className="text-white font-bold tabular-nums">{round(t2, 1)} N</span>
          </div>
          <p className="text-sm leading-snug" style={{ color: C.text2 }}>
            Lower a cable&rsquo;s angle and its tension shoots up — a near-horizontal cable must pull enormously hard to
            hold the same weight. That&rsquo;s why washing lines sag.
          </p>

          {/* Lami's theorem */}
          <div className="text-sm" style={{ color: C.text2 }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: C.indigoLight }}>Lami&rsquo;s theorem</p>
            <div className="flex items-center gap-1 text-white font-bold">
              <Frac num="T₁" den={`sin ${round(angOpp_T1, 0)}°`} />
              <span>=</span>
              <Frac num="T₂" den={`sin ${round(angOpp_T2, 0)}°`} />
              <span>=</span>
              <Frac num="W" den={`sin ${round(angOpp_W, 0)}°`} />
            </div>
          </div>

          <Toggle active={triangle} onToggle={() => setTriangle((v) => !v)} color={C.emeraldLight} activeLabel="Showing the closed force triangle" inactiveLabel="Show the force triangle" />

          <ExpertTip>
            Each force divided by the sine of the angle between the OTHER two is the same number. That&rsquo;s Lami&rsquo;s
            theorem — three concurrent forces in balance, solved without components.
          </ExpertTip>
        </>
      }
    />
  );
}

function addv(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}
function seg(a: Vec2, b: Vec2) {
  const pa = toScreen(a, F);
  const pb = toScreen(b, F);
  return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y };
}
function Bracket({ at }: { at: Vec2 }) {
  const p = toScreen(at, F);
  return <rect x={p.x - 9} y={p.y - 5} width={18} height={6} rx={2} fill="#475569" />;
}
