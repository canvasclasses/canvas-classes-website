'use client';

/*
 * motion-lab/circular/BankedRoadView.tsx — the banked highway curve.
 * ─────────────────────────────────────────────────────────────────────────────
 * A cross-section through the road with the three real forces on the car, plus
 * the thing no textbook figure can show: a SPEED BAND. Slide the speed along it
 * and watch the same curve be safe, then not safe, at both ends — too slow
 * slides you down the bank, too fast slides you up and off it.
 *
 * Every number comes from lib/circular.ts (`bankedSafeBand`), which is checked
 * by scripts/physics-checks/check-circular.ts — a 45° frictionless bend of
 * radius 50 m gives 22.1 m/s there and 22.1 m/s here, or one of them is wrong.
 *
 * Zero <text> in the SVG (§4E); arrows are named in the legend beneath it.
 */

import * as React from 'react';
import { bankedSafeBand, DEG } from '../lib/circular';
import { TEXT, BORDER, SIM_CANVAS_BG, accentTint, fmt } from '../../simulations/_shared';
import { Arrow, Card, Legend, Pill, Readouts, Slider, MOTION, FORCE, GHOST, num, type Screen } from './parts';
import { useStageWidth, stageHeight } from './useStageWidth';

const W = 600;
const H = 300;

// ── Figure units ─────────────────────────────────────────────────────────────
// The cross-section is laid out around a pivot at (0,0) in these units and then
// scaled by ONE factor onto the canvas — one scale on both axes, always, or a
// 15° bank would draw as 40° and contradict the slider reading it.
//
// A browser sweep on 2026-07-29 measured this figure filling 47% × 50% of its
// own viewBox, i.e. a quarter of the canvas, because `surfLen` and every arrow
// cap were hardcoded screen pixels tuned for one bank angle. They are now a
// shape, and the shape gets fitted.
const SURF = 210;        // road surface length
const REF_OVER = 40;     // how far the flat reference line runs past the road
const EMBANK = 44;       // embankment fill below the pivot
const CAR_UP = 13;       // car body above the road surface
const CAR_ALONG = 17;    // car position, up-slope from the pivot
const CAR_HALF = 23;     // half-diagonal of the (rotated) car box
const F_CAP = 74;        // longest weight / normal arrow
const N_CAP = 80;        // longest "needed toward the centre" arrow
const FR_CAP = 52;       // longest friction arrow
const NEEDED_UP = 44;    // the needed-arrow rides this far above the car
const ARC = 54;          // bank-angle arc radius
/** Fraction of the canvas left as breathing room on each side. */
const PAD_FRAC = 0.11;

export interface BankedState {
  radius: number;
  mass: number;
  speed: number;
  bank: number;
  mu: number;
}

export default function BankedRoadView({
  state, onChange, g, height = 300,
}: {
  state: BankedState;
  onChange: (patch: Partial<BankedState>) => void;
  g: number;
  height?: number;
}) {
  const { radius, mass, speed, bank, mu } = state;
  // Measured container width — a narrow stage (a phone, or the admin editor's
  // split pane) gets a shorter box rather than a small drawing letterboxed
  // inside a tall one.
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const stageH = stageHeight(stageW, W, H, height);
  const band = bankedSafeBand(radius, bank, mu, g);
  const needed = (mass * speed * speed) / radius;
  const idealSpeed = Math.sqrt(g * radius * Math.tan(bank * DEG));

  const tooSlow = speed < band.vMin - 1e-6;
  const tooFast = speed > band.vMax + 1e-6;
  const safe = !tooSlow && !tooFast;

  // ── Cross-section geometry ────────────────────────────────────────────────
  // The centre of the bend is to the LEFT, so the road rises to the right.
  const th = bank * DEG;
  const up = { x: -Math.sin(th), y: Math.cos(th) };          // surface normal (physics: y up)
  const along = { x: Math.cos(th), y: Math.sin(th) };        // up-slope, outward
  const toScreen = (p: Screen, ux: number, uy: number, len: number): Screen =>
    ({ x: p.x + ux * len, y: p.y - uy * len });

  // Figure-unit layout around a pivot at the origin.
  const O: Screen = { x: 0, y: 0 };
  const uLeft = toScreen(O, -along.x, -along.y, SURF / 2);
  const uRight = toScreen(O, along.x, along.y, SURF / 2);
  const uCarAt = toScreen(O, along.x, along.y, CAR_ALONG);
  const uCar = toScreen(uCarAt, up.x, up.y, CAR_UP);

  // The fit reserves each arrow's CAP rather than its current length, so the
  // camera depends on the bank angle alone. Re-fitting on every speed nudge
  // would rescale the whole drawing under the student's finger — the exact
  // failure `stableFit` exists to prevent elsewhere in the engine.
  const extremes: Screen[] = [
    uLeft, uRight,
    { x: uLeft.x - REF_OVER, y: 0 }, { x: uRight.x + REF_OVER, y: 0 },
    { x: uLeft.x, y: EMBANK }, { x: uRight.x, y: EMBANK },
    { x: uCar.x - CAR_HALF, y: uCar.y - CAR_HALF },
    { x: uCar.x + CAR_HALF, y: uCar.y + CAR_HALF },
    { x: uCar.x, y: uCar.y + F_CAP },                                   // weight
    toScreen(uCar, up.x, up.y, F_CAP),                                  // normal
    toScreen(uCar, along.x, along.y, FR_CAP),                           // friction, either way
    toScreen(uCar, -along.x, -along.y, FR_CAP),
    { x: uCar.x - N_CAP, y: uCar.y - NEEDED_UP },                       // needed, at the centre
    { x: ARC, y: 0 }, toScreen(O, along.x, along.y, ARC),
  ];
  const minX = Math.min(...extremes.map((p) => p.x));
  const maxX = Math.max(...extremes.map((p) => p.x));
  const minY = Math.min(...extremes.map((p) => p.y));
  const maxY = Math.max(...extremes.map((p) => p.y));
  const K = Math.max(0.4, Math.min(
    (W * (1 - 2 * PAD_FRAC)) / Math.max(maxX - minX, 1e-6),
    (H * (1 - 2 * PAD_FRAC)) / Math.max(maxY - minY, 1e-6),
  ));
  // Place the pivot so the fitted box lands centred in the canvas.
  const pivot: Screen = {
    x: W / 2 - K * (minX + maxX) / 2,
    y: H / 2 - K * (minY + maxY) / 2,
  };
  const S = (p: Screen): Screen => ({ x: pivot.x + K * p.x, y: pivot.y + K * p.y });

  const left = S(uLeft);
  const right = S(uRight);
  const carBody = S(uCar);

  // Friction acts DOWN the slope when the car is going faster than the ideal
  // (no-friction) speed and UP the slope when it is going slower. Getting this
  // backwards is the single most common error in a banked-road figure.
  const frictionUpSlope = speed < idealSpeed;
  const fDir = frictionUpSlope ? along : { x: -along.x, y: -along.y };
  const requiredFriction = Math.abs(
    mass * ((speed * speed) / radius) * Math.cos(th) - mass * g * Math.sin(th)
  );
  const maxFriction = mu * mass * (g * Math.cos(th) + ((speed * speed) / radius) * Math.sin(th));

  // Arrow lengths are a fraction of a reserved cap, in FIGURE units, so they
  // scale with the drawing and can never run outside the box the fit reserved
  // for them. (Capping at 1.3× the reserve, as this did, was what let a fast
  // car's normal arrow spill past the frame edge.)
  const fRef = Math.max(mass * g, 1e-6);
  const px = (f: number, cap = F_CAP) =>
    K * Math.max(5, Math.min(cap, (Math.abs(f) / fRef) * cap));
  const normalMag = mass * (g * Math.cos(th) + ((speed * speed) / radius) * Math.sin(th));

  // ── The speed band bar ────────────────────────────────────────────────────
  const barMax = Math.max(
    speed * 1.25,
    Number.isFinite(band.vMax) ? band.vMax * 1.2 : band.vMin * 2 + 10,
    10
  );
  const pct = (v: number) => Math.max(0, Math.min(100, (v / barMax) * 100));
  const bandLeft = pct(band.vMin);
  const bandRight = Number.isFinite(band.vMax) ? pct(band.vMax) : 100;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-snug" style={{ color: TEXT.secondary }}>
        A {fmt(radius, 0)} m bend on a state highway — the kind with a GO SLOW board before it. To go
        round, something must push the car toward the centre of the bend. Tilt the road and the
        normal force itself leans inward and does part of that job.
      </p>

      <div
        ref={wrapRef}
        className="overflow-hidden rounded-2xl"
        style={{ background: SIM_CANVAS_BG, border: `1px solid ${BORDER.card}`, height: stageH }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" width="100%" height={stageH}
          style={{ display: 'block' }}>
          {/* Horizontal reference — the flat road the bank is measured from. */}
          <line x1={left.x - REF_OVER * K} y1={pivot.y} x2={right.x + REF_OVER * K} y2={pivot.y}
            stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} strokeDasharray="6 6" />

          {/* Embankment fill + road surface */}
          <polygon
            points={`${left.x},${left.y} ${right.x},${right.y} ${right.x},${pivot.y + EMBANK * K} ${left.x},${pivot.y + EMBANK * K}`}
            fill="rgba(255,255,255,0.035)"
          />
          <line x1={left.x} y1={left.y} x2={right.x} y2={right.y}
            stroke="rgba(226,232,240,0.55)" strokeWidth={4} strokeLinecap="round" />

          {/* Bank angle arc, between the flat reference and the surface */}
          <path
            d={`M ${pivot.x + ARC * K},${pivot.y} A ${ARC * K} ${ARC * K} 0 0 0 ${toScreen(pivot, along.x, along.y, ARC * K).x},${toScreen(pivot, along.x, along.y, ARC * K).y}`}
            fill="none" stroke={accentTint(MOTION, 0.55)} strokeWidth={1.5}
          />

          {/* The car */}
          <rect
            x={carBody.x - 20 * K} y={carBody.y - 11 * K} width={40 * K} height={20 * K} rx={5}
            fill={accentTint(MOTION, 0.85)} stroke={MOTION} strokeWidth={2}
            transform={`rotate(${-bank} ${carBody.x} ${carBody.y})`}
          />

          {/* Forces */}
          <Arrow from={carBody} to={{ x: carBody.x, y: carBody.y + px(mass * g) }}
            color={GHOST} width={3} />
          <Arrow from={carBody} to={toScreen(carBody, up.x, up.y, px(normalMag))}
            color={FORCE} width={3.5} />
          {mu > 0 && (
            <Arrow from={carBody}
              to={toScreen(carBody, fDir.x, fDir.y, px(Math.min(requiredFriction, maxFriction), FR_CAP))}
              color={FORCE} width={3} dashed />
          )}
          {/* Where the whole thing has to end up pointing: at the centre. */}
          <Arrow from={{ x: carBody.x, y: carBody.y - NEEDED_UP * K }}
            to={{ x: carBody.x - px(needed, N_CAP), y: carBody.y - NEEDED_UP * K }}
            color={MOTION} width={3.5} />
        </svg>
      </div>

      <Legend
        items={[
          { color: MOTION, name: 'Needed toward the centre', value: num(needed, 'N', 0) },
          { color: FORCE, name: 'Normal from the road', value: num(normalMag, 'N', 0) },
          { color: FORCE, name: frictionUpSlope ? 'Friction, up the slope' : 'Friction, down the slope', value: num(Math.min(requiredFriction, maxFriction), 'N', 0), dashed: true },
          { color: GHOST, name: 'Weight', value: num(mass * g, 'N', 0) },
        ]}
      />

      {/* ── The safe band ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TEXT.muted }}>
            Safe speed band
          </span>
          <Pill tone={safe ? 'ok' : 'no'}>
            {tooSlow ? 'Too slow — slides down the bank' : tooFast ? 'Too fast — slides up and off' : 'Safe'}
          </Pill>
        </div>
        <div className="relative h-7 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}` }}>
          <div
            className="absolute inset-y-0 rounded-md"
            style={{
              left: `${bandLeft}%`, width: `${Math.max(0, bandRight - bandLeft)}%`,
              background: accentTint(FORCE, 0.22), borderLeft: `2px solid ${FORCE}`,
              borderRight: Number.isFinite(band.vMax) ? `2px solid ${FORCE}` : 'none',
            }}
          />
          <div
            className="absolute inset-y-0 w-[3px] rounded-full"
            style={{ left: `${pct(speed)}%`, background: MOTION }}
          />
        </div>
        <div className="flex justify-between text-[11px] tabular-nums" style={{ color: TEXT.muted }}>
          <span>0</span>
          <span>
            band <b style={{ color: FORCE }}>{fmt(band.vMin, 1)}</b>
            {' – '}
            <b style={{ color: FORCE }}>{Number.isFinite(band.vMax) ? fmt(band.vMax, 1) : 'no upper limit'}</b> m/s
          </span>
          <span>{fmt(barMax, 0)} m/s</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-2.5">
          <Slider label="Bank angle" value={bank} min={0} max={45} step={1} unit="°"
            onChange={(v) => onChange({ bank: v })} format={(v) => v.toFixed(0)} accent={FORCE} />
          <Slider label="Friction μ" value={mu} min={0} max={1.2} step={0.05}
            onChange={(v) => onChange({ mu: v })} accent={FORCE} />
          <Slider label="Curve radius" value={radius} min={15} max={300} step={5} unit="m"
            onChange={(v) => onChange({ radius: v })} format={(v) => v.toFixed(0)} />
          <Slider label="Car speed" value={speed} min={2} max={45} step={0.5} unit="m/s"
            onChange={(v) => onChange({ speed: v })} format={(v) => v.toFixed(1)} />
        </div>
      </Card>

      <Readouts
        rows={[
          { label: 'Needed centripetal force', value: num(needed, 'N', 0), color: MOTION, strong: true },
          { label: 'Ideal speed (no friction needed)', value: num(idealSpeed, 'm/s', 1), color: FORCE },
          { label: 'Slowest safe speed', value: num(band.vMin, 'm/s', 1) },
          { label: 'Fastest safe speed', value: Number.isFinite(band.vMax) ? num(band.vMax, 'm/s', 1) : 'no upper limit' },
          { label: 'Friction demanded / available', value: `${fmt(requiredFriction, 0)} / ${fmt(maxFriction, 0)} N` },
          { label: 'In km/h', value: `${fmt(speed * 3.6, 0)} km/h` },
        ]}
      />

      <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
        At the ideal speed, tan θ = v² / (rg) and friction is doing <b>nothing at all</b> — the road
        alone turns the car. Set μ to 0 and watch the band collapse onto that single speed: a
        frictionless bank has exactly one speed that works.
      </p>
    </div>
  );
}
