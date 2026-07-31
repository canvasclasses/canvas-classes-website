'use client';

/*
 * motion-lab/circular/InstrumentsView.tsx — five real machines, one equation.
 * ─────────────────────────────────────────────────────────────────────────────
 * Conical pendulum · rotor (well of death) · car over a bridge crest · spin
 * dryer · laboratory centrifuge. Each one is a different agent supplying the
 * same mv²/r, and each one is quoted with the numbers the real machine runs at
 * (rpm for the dryer and the centrifuge, metres and m/s for the rest) so the
 * equation lands on something the student has actually seen.
 *
 * Every value comes from lib/circular.ts. Nothing is hardcoded, nothing is
 * approximated in the UI layer.
 *
 * At most one <text> per diagram (§4E) — in practice zero; the arrows are named
 * in the legend under each diagram.
 */

import * as React from 'react';
import { useState } from 'react';
import {
  conicalPendulum, rotorMinSpeed, crestAirborneSpeed, gForceOf, DEG,
} from '../lib/circular';
import { TEXT, BORDER, SIM_BG, SIM_CANVAS_BG, accentTint, fmt } from '../../simulations/_shared';
import {
  Arrow, Card, Legend, Pill, Readouts, Slider, MOTION, FORCE, GHOST, num, type Row,
} from './parts';
import { useStageWidth, stageHeight, STACK_WIDTH } from './useStageWidth';

const W = 460;
const H = 340;

export type InstrumentId = 'conical' | 'rotor' | 'crest' | 'dryer' | 'centrifuge';

const TABS: { id: InstrumentId; label: string }[] = [
  { id: 'conical', label: 'Conical pendulum' },
  { id: 'rotor', label: 'Rotor / well of death' },
  { id: 'crest', label: 'Bridge crest' },
  { id: 'dryer', label: 'Spin dryer' },
  { id: 'centrifuge', label: 'Centrifuge' },
];

/**
 * How much of the frame the drawing is allowed to occupy on each side.
 *
 * Every diagram below used to be laid out in hardcoded pixels tuned by eye, and
 * a browser sweep on 2026-07-29 caught what that costs: the conical pendulum
 * was filling 28% × 66% of its own canvas — 19% of the area — which is exactly
 * the "the diagrams are small" complaint, measured. Each machine now states its
 * NATURAL extent and gets fitted, with ONE scale on both axes (a stretched axis
 * would draw a 30° cone as 50° and contradict the slider next to it).
 */
const PAD_FRAC = 0.08;

function fitK(natW: number, natH: number, reserveW = 0, reserveH = 0): number {
  const uw = Math.max(40, W * (1 - 2 * PAD_FRAC) - reserveW);
  const uh = Math.max(40, H * (1 - 2 * PAD_FRAC) - reserveH);
  return Math.max(0.15, Math.min(uw / Math.max(natW, 1e-6), uh / Math.max(natH, 1e-6)));
}

/** Centre a figure-unit box `[b0, b1]` inside a span of `total`. */
const centreOn = (total: number, b0: number, b1: number): number => total / 2 - (b0 + b1) / 2;

function Frame({ children }: { children: React.ReactNode }) {
  // Measured, not a media query: a fixed-height stage letterboxes as soon as the
  // container is narrower than the viewBox, which on a phone means a small
  // diagram adrift in a tall empty box.
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const h = stageHeight(stageW, W, H, H);
  return (
    <div
      ref={wrapRef}
      className="overflow-hidden rounded-2xl"
      style={{ background: SIM_CANVAS_BG, border: `1px solid ${BORDER.card}`, height: h }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" width="100%" height={h}
        style={{ display: 'block' }}>
        {children}
      </svg>
    </div>
  );
}

export default function InstrumentsView({
  initial, g, mass: outerMass,
}: { initial?: InstrumentId; g: number; mass?: number }) {
  const [which, setWhich] = useState<InstrumentId>(initial ?? 'conical');
  // Measured container width, never a `lg:` viewport query — this also renders
  // in the admin editor's narrow split pane, where the viewport is a desktop.
  const [gridRef, stageW] = useStageWidth<HTMLDivElement>();
  const stacked = stageW > 0 && stageW < STACK_WIDTH;

  // Each instrument keeps its own knobs; switching tabs must not silently reset
  // the one you were just reading.
  const [coneLen, setConeLen] = useState(1);
  const [coneAng, setConeAng] = useState(30);
  const [coneMass, setConeMass] = useState(outerMass && outerMass < 5 ? outerMass : 0.4);

  const [rotorR, setRotorR] = useState(3);
  const [rotorMu, setRotorMu] = useState(0.4);
  const [rotorV, setRotorV] = useState(9);
  const [rotorM, setRotorM] = useState(60);

  const [crestR, setCrestR] = useState(25);
  const [crestV, setCrestV] = useState(12);
  const [crestM, setCrestM] = useState(1200);

  const [dryerR, setDryerR] = useState(0.25);
  const [dryerRpm, setDryerRpm] = useState(1200);

  const [cfR, setCfR] = useState(0.1);
  const [cfRpm, setCfRpm] = useState(12000);

  let diagram: React.ReactNode = null;
  let legend: { color: string; name: string; value?: string; dashed?: boolean }[] = [];
  let controls: React.ReactNode = null;
  let rows: Row[] = [];
  let verdict: React.ReactNode = null;
  let blurb = '';

  if (which === 'conical') {
    const cp = conicalPendulum(coneLen, coneAng, g);
    const T = cp.tension * coneMass;
    const period = (2 * Math.PI) / cp.omega;
    // The string's DRAWN length is fitted, not proportional to L — a 3 m string
    // and a 0.2 m string are the same picture at different scales, and the
    // length is read off the slider. The cone angle IS the shape, so it drives
    // the natural extent: half-width sin θ, drop cos θ, per unit of string.
    const th = coneAng * DEG;
    const sin = Math.sin(th), cos = Math.cos(th);
    // Reserved screen pixels: the bob on the right, the pivot bracket above and
    // the weight arrow below. Those are annotations at a fixed readable size,
    // so they are subtracted from the budget rather than scaled with the cone.
    const strLen = fitK(2 * sin, cos, 24, 68);
    const rx = sin * strLen;
    const drop = cos * strLen;
    const bx0 = Math.min(-rx, rx - 52, -26);   // ellipse left / velocity arrow / bracket
    const bx1 = Math.max(rx + 12, 26);
    const by1 = drop + Math.max(58, rx * 0.3);
    const pivot = { x: centreOn(W, bx0, bx1), y: centreOn(H, -10, by1) };
    const bob = { x: pivot.x + rx, y: pivot.y + drop };
    blurb =
      'A bob swung so the string sweeps out a cone. It never rises or falls, so the vertical part of the tension exactly carries the weight — and everything left over turns it.';
    diagram = (
      <>
        <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={bob.y + 34}
          stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} strokeDasharray="6 6" />
        <ellipse cx={pivot.x} cy={bob.y} rx={rx} ry={rx * 0.3}
          fill="none" stroke={accentTint(MOTION, 0.4)} strokeWidth={1.5} strokeDasharray="7 6" />
        <line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y}
          stroke="rgba(226,232,240,0.55)" strokeWidth={2} />
        <rect x={pivot.x - 26} y={pivot.y - 10} width={52} height={8} rx={3} fill="rgba(226,232,240,0.35)" />
        <Arrow from={bob} to={{ x: bob.x + (pivot.x - bob.x) * 0.45, y: bob.y + (pivot.y - bob.y) * 0.45 }}
          color={FORCE} width={3.5} />
        <Arrow from={bob} to={{ x: bob.x, y: bob.y + 52 }} color={GHOST} width={3} />
        <Arrow from={bob} to={{ x: bob.x - 46, y: bob.y }} color={MOTION} width={3} dashed />
        <circle cx={bob.x} cy={bob.y} r={11} fill={accentTint(MOTION, 0.9)} stroke={MOTION} strokeWidth={2} />
      </>
    );
    legend = [
      { color: FORCE, name: 'Tension along the string', value: num(T, 'N', 2) },
      { color: MOTION, name: 'Its horizontal part = the centripetal force', value: num(T * Math.sin(coneAng * DEG), 'N', 2), dashed: true },
      { color: GHOST, name: 'Weight', value: num(coneMass * g, 'N', 2) },
    ];
    controls = (
      <>
        <Slider label="String length" value={coneLen} min={0.2} max={3} step={0.05} unit="m" onChange={setConeLen} />
        <Slider label="Cone angle" value={coneAng} min={5} max={80} step={1} unit="°" onChange={setConeAng} format={(v) => v.toFixed(0)} accent={FORCE} />
        <Slider label="Bob mass" value={coneMass} min={0.05} max={3} step={0.05} unit="kg" onChange={setConeMass} />
      </>
    );
    rows = [
      { label: 'Circle radius r = L sin θ', value: num(cp.radius, 'm', 3) },
      { label: 'Angular speed ω', value: num(cp.omega, 'rad/s', 2), color: MOTION, strong: true },
      { label: 'Period', value: num(period, 's', 2) },
      { label: 'Speed v = ωr', value: num(cp.omega * cp.radius, 'm/s', 2) },
      { label: 'Tension T = mg / cos θ', value: num(T, 'N', 2), color: FORCE },
      { label: 'tan θ = v² / rg', value: fmt(Math.tan(coneAng * DEG), 3) },
    ];
    verdict = (
      <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
        Change the bob mass and watch ω and the period <b>not move</b>. Divide T sin θ = mv²/r by
        T cos θ = mg and the mass cancels — a heavy bob and a light bob swing at the same angle for
        the same speed.
      </p>
    );
  }

  if (which === 'rotor') {
    const N = (rotorM * rotorV * rotorV) / rotorR;
    const needed = rotorM * g;
    const available = rotorMu * N;
    const vMin = rotorMinSpeed(rotorR, rotorMu, g);
    const held = available >= needed;
    blurb =
      'You stand against the inside wall of a spinning drum. The floor drops away — and you do not. Find out what is actually holding you up, because it is not the wall pushing you outward.';
    // The drum is one shape scaled by one factor: half-width `a`, walls 1.12a
    // tall, a 0.23a top ellipse and a 0.2a floor ellipse. Fitting `a` is what
    // turns a 260-px-wide schematic in a 460-px frame into one that fills it.
    const a = fitK(2, 1.55);                        // natural box 2a wide × 1.55a tall
    const wallH = 1.12 * a, ryTop = 0.23 * a, ryBot = 0.2 * a;
    const cxx = W / 2;
    const topY = centreOn(H, -ryTop, wallH + ryBot);
    const botY = topY + wallH;
    const wallL = cxx - a;
    const wallR = cxx + a;
    const rider = { x: wallR - 0.2 * a, y: topY + 0.47 * wallH };
    const riderW = 0.14 * a, riderH = 0.4 * a;
    diagram = (
      <>
        <ellipse cx={cxx} cy={topY} rx={a} ry={ryTop} fill="none" stroke="rgba(226,232,240,0.35)" strokeWidth={2} />
        <line x1={wallL} y1={topY} x2={wallL} y2={botY} stroke="rgba(226,232,240,0.45)" strokeWidth={3} />
        <line x1={wallR} y1={topY} x2={wallR} y2={botY} stroke="rgba(226,232,240,0.45)" strokeWidth={3} />
        <ellipse cx={cxx} cy={botY} rx={a} ry={ryBot} fill="none"
          stroke="rgba(226,232,240,0.16)" strokeWidth={2} strokeDasharray="8 8" />
        <rect x={rider.x - riderW / 2} y={rider.y - riderH / 2} width={riderW} height={riderH} rx={6}
          fill={accentTint(MOTION, 0.85)} stroke={MOTION} strokeWidth={2} />
        <Arrow from={rider} to={{ x: rider.x - 0.48 * a, y: rider.y }} color={FORCE} width={3.5} />
        <Arrow from={{ x: rider.x + 0.16 * a, y: rider.y }}
          to={{ x: rider.x + 0.16 * a, y: rider.y - Math.min(0.54 * a, (available / needed) * 0.35 * a) }}
          color={FORCE} width={3} dashed />
        <Arrow from={{ x: rider.x + 0.16 * a, y: rider.y }}
          to={{ x: rider.x + 0.16 * a, y: rider.y + 0.35 * a }} color={GHOST} width={3} />
      </>
    );
    legend = [
      { color: FORCE, name: 'Wall normal, inward = mv²/r', value: num(N, 'N', 0) },
      { color: FORCE, name: 'Friction up the wall (max μN)', value: num(available, 'N', 0), dashed: true },
      { color: GHOST, name: 'Weight mg', value: num(needed, 'N', 0) },
    ];
    controls = (
      <>
        <Slider label="Drum radius" value={rotorR} min={1} max={8} step={0.1} unit="m" onChange={setRotorR} />
        <Slider label="Wall speed" value={rotorV} min={2} max={25} step={0.5} unit="m/s" onChange={setRotorV} />
        <Slider label="Friction μ" value={rotorMu} min={0.05} max={1} step={0.05} onChange={setRotorMu} accent={FORCE} />
        <Slider label="Rider mass" value={rotorM} min={30} max={120} step={5} unit="kg" onChange={setRotorM} />
      </>
    );
    rows = [
      { label: 'Normal force N = mv²/r', value: num(N, 'N', 0), color: FORCE },
      { label: 'Friction needed = mg', value: num(needed, 'N', 0) },
      { label: 'Friction available = μN', value: num(available, 'N', 0), color: held ? MOTION : FORCE, strong: true },
      { label: 'Minimum safe speed √(gr/μ)', value: num(vMin, 'm/s', 2) },
      { label: 'Drum period at this speed', value: num((2 * Math.PI * rotorR) / rotorV, 's', 2) },
    ];
    verdict = (
      <div className="flex flex-col gap-2">
        <Pill tone={held ? 'ok' : 'no'}>{held ? 'The rider stays up' : 'The rider slides down'}</Pill>
        <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
          μ m v²/r ≥ mg gives v ≥ √(gr/μ), and the mass cancels out completely. Slide the rider mass
          from 30 kg to 120 kg — the minimum speed does not move. The ride is exactly as safe for
          both.
        </p>
      </div>
    );
  }

  if (which === 'crest') {
    const N = crestM * (g - (crestV * crestV) / crestR);
    const vOff = crestAirborneSpeed(crestR, g);
    const airborne = N <= 0;
    blurb =
      'A car crosses a humped bridge at steady speed. The speedometer never moves — and yet the seat pushes on you less than your weight. Speed up until it pushes with nothing at all.';
    // Natural box: the arc spans 2rr plus the reference line's 20-px overhang
    // each side, and runs from the road line down at y = 0 up to the N arrow
    // clearing the car at rr + 68. One scale, fitted.
    const rr = fitK(2 + 40 / 150, 1 + 68 / 150);
    const over = 0.133 * rr;                      // reference-line overhang
    const lift = 0.08 * rr;                       // arrow origin above the crest
    const arrowMax = 0.373 * rr;                  // longest force arrow
    const carH = 0.13 * rr;
    const cxx = W / 2;
    const cyy = centreOn(H, -(rr + lift + arrowMax), 0);
    const top = cyy - rr - lift;                  // where every arrow starts
    diagram = (
      <>
        <path d={`M ${cxx - rr},${cyy} A ${rr} ${rr} 0 0 1 ${cxx + rr},${cyy}`}
          fill="none" stroke="rgba(226,232,240,0.5)" strokeWidth={4} />
        <line x1={cxx - rr - over} y1={cyy} x2={cxx + rr + over} y2={cyy}
          stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} strokeDasharray="6 6" />
        <line x1={cxx} y1={cyy} x2={cxx} y2={cyy - rr}
          stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} strokeDasharray="5 6" />
        <circle cx={cxx} cy={cyy} r={4} fill={TEXT.muted} />
        {/* The car sits ON the crest, and lifts clear of it once N reaches zero. */}
        <rect x={cxx - 0.16 * rr} y={cyy - rr - (airborne ? 0.093 : 0.013) * rr - carH}
          width={0.32 * rr} height={carH} rx={5}
          fill={accentTint(MOTION, 0.85)} stroke={MOTION} strokeWidth={2} />
        <Arrow from={{ x: cxx, y: top }} to={{ x: cxx, y: top + arrowMax }} color={GHOST} width={3} />
        {!airborne && (
          <Arrow from={{ x: cxx + 0.227 * rr, y: top }}
            to={{ x: cxx + 0.227 * rr, y: top - Math.max(6, (N / (crestM * g)) * arrowMax) }}
            color={FORCE} width={3.5} />
        )}
        <Arrow from={{ x: cxx - 0.227 * rr, y: top }}
          to={{ x: cxx - 0.227 * rr, y: top + Math.max(6, Math.min(1.2, ((crestV * crestV) / crestR) / g) * arrowMax) }}
          color={MOTION} width={3} dashed />
      </>
    );
    legend = [
      { color: FORCE, name: 'Road pushing up (N)', value: airborne ? 'zero — wheels off' : num(N, 'N', 0) },
      { color: GHOST, name: 'Weight mg', value: num(crestM * g, 'N', 0) },
      { color: MOTION, name: 'Needed acceleration v²/r, downward', value: num((crestV * crestV) / crestR, 'm/s²', 2), dashed: true },
    ];
    controls = (
      <>
        <Slider label="Crest radius" value={crestR} min={8} max={80} step={1} unit="m" onChange={setCrestR} format={(v) => v.toFixed(0)} />
        <Slider label="Speed" value={crestV} min={2} max={35} step={0.5} unit="m/s" onChange={setCrestV} />
        <Slider label="Car mass" value={crestM} min={500} max={3000} step={50} unit="kg" onChange={setCrestM} format={(v) => v.toFixed(0)} />
      </>
    );
    rows = [
      { label: 'Needed centripetal accel v²/r', value: num((crestV * crestV) / crestR, 'm/s²', 2), color: MOTION },
      { label: 'Road force N = m(g − v²/r)', value: airborne ? '0 (airborne)' : num(N, 'N', 0), color: FORCE, strong: true },
      { label: 'You feel this fraction of your weight', value: airborne ? '0' : `${fmt((N / (crestM * g)) * 100, 0)}%` },
      { label: 'Wheels leave the road at √(gr)', value: num(vOff, 'm/s', 2) },
      { label: 'That is', value: `${fmt(vOff * 3.6, 0)} km/h` },
    ];
    verdict = (
      <div className="flex flex-col gap-2">
        <Pill tone={airborne ? 'no' : 'ok'}>{airborne ? 'Airborne — this is now a projectile' : 'On the road'}</Pill>
        <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
          Steady speed, and still an acceleration — because the direction is changing. That is the
          whole reason N comes out smaller than mg. At v = √(gr) it reaches zero, which is the same
          equation, and the same number, as the top of a vertical circle.
        </p>
      </div>
    );
  }

  if (which === 'dryer') {
    const omega = (2 * Math.PI * dryerRpm) / 60;
    const v = omega * dryerR;
    const a = omega * omega * dryerR;
    const drop = 0.0002; // kg — a typical water droplet clinging to cloth
    blurb =
      'Everyone says the spin dryer "flings the water out". Nothing flings it. The drum wall pushes the cloth inward and keeps it turning; at a hole there is nothing to push the water inward, so the water simply carries straight on.';
    // Natural box: the drum spans 2R, and the tangential jet reaches a further
    // 0.913R past the hole on the right. Fitted, so the drum is as big as the
    // frame allows instead of a hardcoded 92-px circle in a 460-px canvas.
    const hole = 42 * DEG;
    const jet = 0.913;                            // jet length, in units of R
    const rightReach = Math.cos(hole) + Math.sin(hole) * jet;
    const R = fitK(1 + Math.max(1, rightReach) + 0.07, 2 + 0.07);
    const hx0 = Math.cos(hole) * R, hy0 = -Math.sin(hole) * R;
    const cxx = centreOn(W, -R - 3.2, Math.max(R + 3.2, hx0 + Math.sin(hole) * jet * R));
    const cyy = H / 2;
    const hx = cxx + hx0;
    const hy = cyy + hy0;
    diagram = (
      <>
        <circle cx={cxx} cy={cyy} r={R} fill="none" stroke="rgba(226,232,240,0.5)" strokeWidth={4} />
        {Array.from({ length: 16 }, (_, i) => {
          const a2 = (i / 16) * 2 * Math.PI;
          return (
            <circle key={i} cx={cxx + Math.cos(a2) * R} cy={cyy - Math.sin(a2) * R} r={3.2}
              fill={SIM_BG} stroke="rgba(226,232,240,0.4)" strokeWidth={1} />
          );
        })}
        <path d={`M ${cxx + Math.cos(hole - 0.5) * (R * 0.87)},${cyy - Math.sin(hole - 0.5) * (R * 0.87)}
                  A ${R * 0.87} ${R * 0.87} 0 0 0 ${cxx + Math.cos(hole + 0.9) * (R * 0.87)},${cyy - Math.sin(hole + 0.9) * (R * 0.87)}`}
          fill="none" stroke={accentTint(MOTION, 0.55)} strokeWidth={11} strokeLinecap="round" />
        <Arrow from={{ x: hx, y: hy }}
          to={{ x: hx + Math.sin(hole) * jet * R, y: hy + Math.cos(hole) * jet * R }}
          color={MOTION} width={3.5} />
        <Arrow from={{ x: cxx + Math.cos(hole + 1.6) * R, y: cyy - Math.sin(hole + 1.6) * R }}
          to={{ x: cxx + Math.cos(hole + 1.6) * (R * 0.5), y: cyy - Math.sin(hole + 1.6) * (R * 0.5) }}
          color={FORCE} width={3.5} />
        <circle cx={hx} cy={hy} r={5} fill={MOTION} />
      </>
    );
    legend = [
      { color: FORCE, name: 'Drum wall pushing the cloth inward', value: 'the centripetal force' },
      { color: MOTION, name: 'Water leaving along the tangent', value: num(v, 'm/s', 1) },
    ];
    controls = (
      <>
        <Slider label="Drum radius" value={dryerR} min={0.1} max={0.5} step={0.01} unit="m" onChange={setDryerR} />
        <Slider label="Spin speed" value={dryerRpm} min={200} max={1600} step={50} unit="rpm" onChange={setDryerRpm} format={(x) => x.toFixed(0)} accent={FORCE} />
      </>
    );
    rows = [
      { label: 'Angular speed ω = 2π × rpm / 60', value: num(omega, 'rad/s', 1), color: MOTION },
      { label: 'Rim speed v = ωr', value: num(v, 'm/s', 2) },
      { label: 'Centripetal acceleration ω²r', value: num(a, 'm/s²', 0), color: FORCE, strong: true },
      { label: 'In multiples of g', value: `${fmt(gForceOf(dryerR, omega, g), 0)} g` },
      { label: 'Force needed on a 0.2 g droplet', value: num(drop * a, 'N', 3) },
    ];
    verdict = (
      <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
        Exactly the same idea as cutting the string — running about twenty times a second in your
        kitchen. The water was never pushed out; it just stopped being pulled in.
      </p>
    );
  }

  if (which === 'centrifuge') {
    const omega = (2 * Math.PI * cfRpm) / 60;
    const a = omega * omega * cfR;
    const rcf = gForceOf(cfR, omega, g);
    blurb =
      'A blood sample spun in a rotor. The number printed on a lab centrifuge is not the speed — it is ω²r divided by g, the "relative centrifugal field", and it runs into the thousands on a benchtop machine.';
    // The rotor is a circle: natural box 2×(R + housing). Fitted so it fills the
    // frame rather than sitting as an 84-px disc in the middle of it.
    const HOUSING = 26 / 84;                      // housing clearance, in units of R
    const R = fitK(2 * (1 + HOUSING), 2 * (1 + HOUSING));
    const cxx = W / 2;
    const cyy = H / 2;
    const tubeW = 0.167 * R, tubeH = 0.476 * R;
    diagram = (
      <>
        <circle cx={cxx} cy={cyy} r={R * (1 + HOUSING)} fill="none" stroke="rgba(226,232,240,0.2)" strokeWidth={2} />
        <circle cx={cxx} cy={cyy} r={0.143 * R} fill="rgba(226,232,240,0.3)" />
        {[35, 145, 255].map((deg) => {
          const a2 = deg * DEG;
          const bx = cxx + Math.cos(a2) * R;
          const by = cyy - Math.sin(a2) * R;
          return (
            <g key={deg}>
              <line x1={cxx} y1={cyy} x2={bx} y2={by} stroke="rgba(226,232,240,0.35)" strokeWidth={3} />
              <rect x={bx - tubeW / 2} y={by - tubeH / 2} width={tubeW} height={tubeH} rx={6}
                fill={accentTint(MOTION, 0.75)} stroke={MOTION} strokeWidth={1.5}
                transform={`rotate(${-deg + 90} ${bx} ${by})`} />
              <Arrow from={{ x: bx, y: by }}
                to={{ x: bx + (cxx - bx) * 0.42, y: by + (cyy - by) * 0.42 }}
                color={FORCE} width={3} />
            </g>
          );
        })}
      </>
    );
    legend = [
      { color: FORCE, name: 'Inward force on each tube = mω²r', value: num(0.002 * a, 'N', 2) },
      { color: MOTION, name: 'Sample tubes', value: `${fmt(cfR * 100, 0)} cm from the axis` },
    ];
    controls = (
      <>
        <Slider label="Rotor radius" value={cfR} min={0.02} max={0.3} step={0.01} unit="m" onChange={setCfR} />
        <Slider label="Rotor speed" value={cfRpm} min={1000} max={20000} step={500} unit="rpm" onChange={setCfRpm} format={(x) => x.toFixed(0)} accent={FORCE} />
      </>
    );
    rows = [
      { label: 'Angular speed ω', value: num(omega, 'rad/s', 0), color: MOTION },
      { label: 'Acceleration ω²r', value: num(a, 'm/s²', 0), color: FORCE },
      { label: 'Relative centrifugal field', value: `${fmt(rcf, 0)} g`, strong: true, color: FORCE },
      { label: 'Rim speed', value: num(omega * cfR, 'm/s', 1) },
      { label: 'Force on a 2 g sample', value: num(0.002 * a, 'N', 2) },
    ];
    verdict = (
      <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
        Heavier particles need a larger inward force to keep turning with the tube. The liquid
        cannot supply it, so they fall behind the circle and end up at the bottom. That lag — not a
        push outward — is what separates the sample.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const on = t.id === which;
          return (
            <button
              key={t.id}
              onClick={() => setWhich(t.id)}
              className="rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                background: on ? accentTint(MOTION, 0.15) : 'rgba(255,255,255,0.02)',
                borderColor: on ? accentTint(MOTION, 0.45) : BORDER.card,
                color: on ? MOTION : TEXT.secondary,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="text-sm leading-snug" style={{ color: TEXT.secondary }}>{blurb}</p>

      <div
        ref={gridRef}
        className={`grid grid-cols-1 gap-4 ${stacked ? '' : 'lg:grid-cols-[6fr_5fr] lg:items-start'}`}
      >
        <div className="flex flex-col gap-3">
          <Frame>{diagram}</Frame>
          <Legend items={legend} />
        </div>
        <div className="flex flex-col gap-3">
          <Card><div className="flex flex-col gap-2.5">{controls}</div></Card>
          <Readouts rows={rows} />
          {verdict}
        </div>
      </div>
    </div>
  );
}
