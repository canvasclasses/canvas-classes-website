'use client';

/*
 * motion-lab/graphs/RelativeDeck.tsx — subtracting the frame, as a drawing.
 * ─────────────────────────────────────────────────────────────────────────────
 * Four constructions, one canvas, one idea: v_AB = v_A − v_B.
 *
 * ── WHAT THE EXISTING SURFACES ALREADY COVER, AND WHAT THEY DO NOT ──────────
 * The engine's `scenario: 'relative'` routes to `ProjectilePlayground`, whose
 * only relative archetype is `cart-frame`: a ball dropped from a moving trolley,
 * a parabola from the platform and a straight line down from the trolley. That is
 * a genuinely good frame-change demonstration and it is NOT duplicated here — it
 * is a two-dimensional projectile in two frames, and it stays where it is.
 *
 * `simulations/RiverJourneySim.tsx` is, despite the name, a **Class-9 Social
 * Science** sim about a river's course from mountain source to delta — erosion,
 * meanders, oxbow lakes. It has nothing to do with relative motion and there is
 * nothing to extend.
 *
 * So river-crossing, rain-and-man and two-trains are new, and the one thing they
 * add that `cart-frame` cannot is the SUBTRACTION AS A VECTOR CONSTRUCTION:
 * v_A drawn, v_B drawn, −v_B drawn, and the resultant closing the triangle,
 * updating as the student drags. `cart-frame` shows the CONSEQUENCE of a frame
 * change; this shows the OPERATION.
 *
 * ── FRAME MATHS COMES FROM THE ENGINE ───────────────────────────────────────
 * `toFrame` and `transformTrajectory` from the frozen `lib/frames.ts` do the
 * transforms, and the boat's ground path is integrated by the frozen
 * `lib/integrate.ts`. `graphs/lib/relative.ts` adds only the SCENE closed forms
 * (crossing time, drift, the two extremal headings, umbrella tilt, overtaking
 * time), because "which way should I point the boat" is not a kinematics
 * question and does not belong in the engine.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { GraphsArchetype, RelativeScene } from './types';
import {
  solveRiver, riverPath, riverPathInWaterFrame, solveRain, solveTrains, mag, rad,
} from './lib/relative';
import { resolveRelative, relativeKey } from './lib/resolve';
import { isNarrow } from './lib/plot';
import {
  GraphsFrame, Card, Pill, Toggle, ActionButton, Segmented, Readout, SectionLabel,
  SimSlider, ACCENT, ACCENT_2, TEXT, accentTint, clamp, f1, f2,
  type LegendRow, type ReadoutRow,
} from './panels';

const SCENE_LABEL: Record<RelativeScene, string> = {
  river: 'River crossing',
  rain: 'Rain and the walker',
  trains: 'Two trains',
  'frame-swap': 'Swap the observer',
};

export default function RelativeDeck({ block, arch }: { block: MotionBenchBlock; arch: GraphsArchetype }) {
  const setupKey = JSON.stringify([
    block.archetype, block.params, block.steps, block.guided, block.height, block.predict, block.numeric,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setup = useMemo(() => resolveRelative(block, arch), [setupKey]);
  const seed = relativeKey(setup);

  const [scene, setScene] = useState<RelativeScene>(setup.scene);
  const [heading, setHeading] = useState(setup.heading);
  const [current, setCurrent] = useState(setup.current);
  const [boat, setBoat] = useState(setup.boat);
  const [rain, setRain] = useState(setup.rain);
  const [walk, setWalk] = useState(setup.walk);
  const [wind, setWind] = useState(setup.wind);
  const [vA, setVA] = useState(setup.vA);
  const [vB, setVB] = useState(setup.vB);
  const [observer, setObserver] = useState<'ground' | 'a' | 'b'>('ground');
  const [step, setStep] = useState(setup.guided ? 0 : 999);
  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setScene(setup.scene);
    setHeading(setup.heading);
    setCurrent(setup.current);
    setBoat(setup.boat);
    setRain(setup.rain);
    setWalk(setup.walk);
    setWind(setup.wind);
    setVA(setup.vA);
    setVB(setup.vB);
    setObserver('ground');
    setStep(setup.guided ? 0 : 999);
    setPredictChoice(null);
    setTouched(false);
  }, [seed]);

  const guidedDone = !setup.guided || step >= setup.steps.length;
  /** How much of the construction is drawn. One beat, one new arrow. */
  const stage = setup.guided ? Math.min(step, 3) : 3;

  const river = useMemo(
    () => solveRiver({ width: setup.width, current, boat, headingDeg: heading }),
    [setup.width, current, boat, heading]
  );
  const rainR = useMemo(() => solveRain(rain, walk, wind), [rain, walk, wind]);
  const trains = useMemo(() => solveTrains(vA, vB, setup.lenA, setup.lenB), [vA, vB, setup.lenA, setup.lenB]);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // ── legend + readout, per scene ───────────────────────────────────────────
  const legend: LegendRow[] = [];
  const readout: ReadoutRow[] = [];

  if (scene === 'river') {
    legend.push({ color: ACCENT, label: 'the boat through the water — you steer this one', strong: true });
    if (stage >= 1) legend.push({ color: ACCENT_2, label: 'the current, carrying you downstream' });
    if (stage >= 2) legend.push({ color: 'rgba(255,255,255,0.85)', label: 'the sum — what the bank sees, and where you land', strong: true });
    if (stage >= 3) legend.push({ color: 'rgba(255,255,255,0.35)', dashed: true, label: 'the path, as the WATER sees it — a straight line, no drift' });
    readout.push(
      { label: 'across component', value: `${f2(river.vBoatGround.y)} m/s`, color: ACCENT, strong: true },
      { label: 'along the bank', value: `${f2(river.vBoatGround.x)} m/s`, color: ACCENT_2 },
      { label: 'crossing time', value: river.crossTime == null ? 'never lands' : `${f2(river.crossTime)} s`, strong: true },
      { label: 'drift downstream', value: river.drift == null ? '—' : `${f1(river.drift)} m` },
      { label: 'quickest heading', value: `0° · ${f2(river.minTime.time)} s · ${f1(river.minTime.drift)} m drift` },
      {
        label: river.minDrift.unavoidable ? 'least possible drift' : 'zero-drift heading',
        value: `${f1(river.minDrift.headingDeg)}° · ${f2(river.minDrift.time)} s · ${f1(river.minDrift.drift)} m`,
        color: ACCENT_2,
      }
    );
  } else if (scene === 'rain') {
    legend.push({ color: ACCENT_2, label: 'the rain, falling — unchanged by anything you do', strong: true });
    if (stage >= 1) legend.push({ color: ACCENT, label: 'your own velocity' });
    if (stage >= 2) legend.push({ color: 'rgba(255,255,255,0.85)', label: 'rain minus you — what actually hits you', strong: true });
    if (stage >= 3) legend.push({ color: 'rgba(255,255,255,0.35)', label: 'the umbrella, along that direction' });
    readout.push(
      { label: 'rain, from the ground', value: `${f1(rain)} m/s straight down`, color: ACCENT_2 },
      { label: 'your velocity', value: `${f1(walk)} m/s forwards`, color: ACCENT },
      { label: 'what you feel', value: `${f2(rainR.apparentSpeed)} m/s`, strong: true },
      { label: 'tilt from vertical', value: `${f1(rainR.umbrellaTiltDeg)}° forwards`, color: ACCENT, strong: true }
    );
  } else {
    legend.push({ color: ACCENT, label: 'train A', strong: true });
    legend.push({ color: ACCENT_2, label: 'train B', strong: true });
    if (stage >= 1) legend.push({ color: 'rgba(255,255,255,0.5)', dashed: true, label: '−v_B, the arrow you add instead of subtracting' });
    if (stage >= 2) legend.push({ color: 'rgba(255,255,255,0.85)', label: 'v_AB — what a passenger on B measures', strong: true });
    readout.push(
      { label: 'v_A (ground)', value: `${f1(vA)} m/s`, color: ACCENT },
      { label: 'v_B (ground)', value: `${f1(vB)} m/s`, color: ACCENT_2 },
      { label: 'v_AB = v_A − v_B', value: `${f2(trains.vAB)} m/s`, strong: true },
      { label: 'v_BA = v_B − v_A', value: `${f2(trains.vBA)} m/s` },
      { label: 'same direction?', value: trains.sameDirection ? 'yes — speeds subtract' : 'no — speeds add' }
    );
    if (scene === 'trains') {
      readout.push(
        { label: 'gap to cover', value: `${f1(trains.passLength)} m` },
        { label: 'time to pass', value: trains.passTime == null ? 'never — same velocity' : `${f2(trains.passTime)} s`, color: ACCENT, strong: true }
      );
    } else {
      readout.push({
        label: `A, as seen from ${observer === 'ground' ? 'the ground' : observer === 'a' ? 'A' : 'B'}`,
        value: `${f2(observer === 'ground' ? vA : observer === 'a' ? 0 : trains.vAB)} m/s`,
        color: ACCENT, strong: true,
      });
      readout.push({
        label: `B, as seen from ${observer === 'ground' ? 'the ground' : observer === 'a' ? 'A' : 'B'}`,
        value: `${f2(observer === 'ground' ? vB : observer === 'a' ? trains.vBA : 0)} m/s`,
        color: ACCENT_2, strong: true,
      });
    }
  }

  // ── evidence gate for the misconception card ──────────────────────────────
  const evidence =
    scene === 'river' ? touched && stage >= 2
    : scene === 'rain' ? walk > 0.1 && stage >= 2
    : (Math.abs(vA - vB) > 0.1 && stage >= 2 && (touched || observer !== 'ground'));

  return (
    <GraphsFrame
      title={setup.title}
      subtitle={`${arch.id.replace(/-/g, ' ')} · relative motion deck`}
      badge={<span className="tabular-nums">{SCENE_LABEL[scene]}</span>}
      panelCount={2}
      maxH={block.height}
      frozen={dragging}
      guided={setup.guided ? { steps: setup.steps, index: Math.min(step, setup.steps.length - 1), done: guidedDone, onAdvance: () => setStep((s) => s + 1) } : null}
      predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
      legend={legend}
      renderCanvas={(w, h) => {
        return (
          <DeckCanvas
            w={w} h={h} scene={scene} stage={stage}
            river={river} rainR={rainR} trains={trains}
            width={setup.width} current={current} boat={boat} heading={heading}
            vA={vA} vB={vB} lenA={setup.lenA} lenB={setup.lenB} observer={observer}
            svgRef={svgRef}
            showConstruction={setup.construction}
            onHeading={(deg) => { setHeading(deg); setTouched(true); }}
            onGrab={setDragging}
            grabHint={!touched}
          />
        );
      }}
      controls={
        <div className="flex flex-col gap-3">
          {/* Only the constructions this archetype's params actually describe are
              offered. A tab that prints copy for the wrong scene was one of
              Phase 1's worst findings, so the picker only appears when the
              author has genuinely set the deck up for more than one. */}
          {scene === 'river' && (
            <div className="flex flex-col gap-2.5">
              <SectionLabel accent={ACCENT}>Steer the boat</SectionLabel>
              <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
                {touched
                  ? 'Drag the arrowhead, or use the slider.'
                  : '👆 Drag the head of the boat arrow — that is the heading. Its length never changes.'}
              </p>
              <SimSlider label="Heading" value={heading} min={-80} max={80} step={1} unit="° upstream"
                onChange={(v) => { setHeading(v); setTouched(true); }} />
              <SimSlider label="Current" value={current} min={0} max={12} step={0.1} unit="m/s"
                onChange={setCurrent} accent={ACCENT_2} format={(v) => v.toFixed(1)} />
              <SimSlider label="Boat speed" value={boat} min={0.5} max={15} step={0.1} unit="m/s"
                onChange={setBoat} format={(v) => v.toFixed(1)} />
              <div className="flex flex-wrap gap-3 pt-1">
                <ActionButton onClick={() => { setHeading(0); setTouched(true); }}>Quickest crossing</ActionButton>
                <ActionButton accent={ACCENT_2}
                  onClick={() => { setHeading(river.minDrift.headingDeg); setTouched(true); }}>
                  {river.minDrift.unavoidable ? 'Least drift possible' : 'Land straight opposite'}
                </ActionButton>
              </div>
            </div>
          )}

          {scene === 'rain' && (
            <div className="flex flex-col gap-2.5">
              <SectionLabel accent={ACCENT}>Walk faster</SectionLabel>
              <SimSlider label="Your speed" value={walk} min={0} max={20} step={0.25} unit="m/s"
                onChange={(v) => { setWalk(v); setTouched(true); }} format={(v) => v.toFixed(2)} />
              <SimSlider label="Rain falls at" value={rain} min={1} max={25} step={0.5} unit="m/s"
                onChange={setRain} accent={ACCENT_2} format={(v) => v.toFixed(1)} />
              <SimSlider label="Wind with you" value={wind} min={-15} max={15} step={0.5} unit="m/s"
                onChange={setWind} format={(v) => v.toFixed(1)} />
              <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
                Drag your speed to zero and watch the tilt go with it. Nothing about the rain moved.
              </p>
            </div>
          )}

          {(scene === 'trains' || scene === 'frame-swap') && (
            <div className="flex flex-col gap-2.5">
              <SectionLabel accent={ACCENT}>Set the two velocities</SectionLabel>
              <SimSlider label="Train A" value={vA} min={-40} max={40} step={0.5} unit="m/s"
                onChange={(v) => { setVA(v); setTouched(true); }} format={(v) => v.toFixed(1)} />
              <SimSlider label="Train B" value={vB} min={-40} max={40} step={0.5} unit="m/s"
                onChange={(v) => { setVB(v); setTouched(true); }} accent={ACCENT_2} format={(v) => v.toFixed(1)} />
              <div className="flex flex-wrap gap-3 pt-1">
                <ActionButton onClick={() => { setVB(-Math.abs(vB)); setTouched(true); }}>Turn B around</ActionButton>
              </div>
              {scene === 'frame-swap' && (
                <div className="flex flex-col gap-2 pt-1">
                  <SectionLabel accent={ACCENT_2}>Who is watching?</SectionLabel>
                  <Segmented
                    value={observer}
                    onChange={(k) => setObserver(k)}
                    options={[
                      { key: 'ground' as const, label: 'the ground' },
                      { key: 'a' as const, label: 'riding A' },
                      { key: 'b' as const, label: 'riding B' },
                    ]}
                  />
                  <p className="text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                    {observer === 'ground'
                      ? 'From the ground both are moving. There is nothing special about this view except habit.'
                      : observer === 'a'
                        ? 'Riding A, A is at rest by definition — because you are it. Only B moves.'
                        : 'Riding B, B is at rest and A moves the opposite way to what A said about B.'}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
            <Toggle on={stage >= 3} label="show every arrow"
              onClick={() => setStep(setup.steps.length)} accent={ACCENT_2} />
          </div>
        </div>
      }
      panels={
        <div className="flex flex-col gap-3">
          <Readout rows={readout} title="The numbers" footnote="Every value here comes from one subtraction: v_AB = v_A − v_B." />
          {scene === 'river' && (
            <Card tone={river.crossTime == null ? 'bad' : 'plain'}>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill tone={river.crossTime == null ? 'bad' : 'info'}>
                  {river.crossTime == null ? 'It never gets there' : 'Two different "best"s'}
                </Pill>
              </div>
              <p className="text-sm leading-snug" style={{ color: TEXT.secondary }}>
                {river.crossTime == null
                  ? 'Pointed this far upstream, the across-component has gone to zero or negative — the boat is no longer heading for the far bank at all. Turn back towards straight across.'
                  : `Quickest is ${f2(river.minTime.time)} s pointing straight across, and it drifts you ${f1(river.minTime.drift)} m downstream. ` +
                    (river.minDrift.unavoidable
                      ? `The current is faster than the boat, so you cannot land opposite at all — the least drift possible is ${f1(river.minDrift.drift)} m, at ${f1(river.minDrift.headingDeg)}° upstream.`
                      : `Landing straight opposite needs ${f1(river.minDrift.headingDeg)}° upstream and takes ${f2(river.minDrift.time)} s. Neither is "the answer" until the question says which it wants.`)}
              </p>
            </Card>
          )}
          {scene === 'trains' && trains.passTime != null && (
            <Card>
              <p className="text-sm leading-snug" style={{ color: TEXT.secondary }}>
                {`${f1(trains.passLength)} m of train to get past, at ${f2(Math.abs(trains.vAB))} m/s of relative speed — `}
                <b style={{ color: ACCENT }}>{f2(trains.passTime)} s</b>
                {'. Neither train’s own speed appears anywhere in that calculation.'}
              </p>
            </Card>
          )}
        </div>
      }
      misconception={evidence ? { belief: arch.attacks.belief, attack: arch.attacks.attack } : null}
      tip={arch.tip}
      caption={block.caption}
    />
  );
}

// ── the canvas ───────────────────────────────────────────────────────────────

interface DeckCanvasProps {
  w: number; h: number;
  scene: RelativeScene;
  stage: number;
  river: ReturnType<typeof solveRiver>;
  rainR: ReturnType<typeof solveRain>;
  trains: ReturnType<typeof solveTrains>;
  width: number; current: number; boat: number; heading: number;
  /** Ground-frame velocities of the two bodies, m/s. */
  vA: number; vB: number;
  /** Train lengths, m — the overtake gap is both of them together. */
  lenA: number; lenB: number;
  observer: 'ground' | 'a' | 'b';
  svgRef: React.RefObject<SVGSVGElement | null>;
  showConstruction: boolean;
  onHeading: (deg: number) => void;
  onGrab: (v: boolean) => void;
  grabHint: boolean;
}

/**
 * ONE SVG, and exactly ONE `<text>` element on it (the "you are here" tick on the
 * far bank / the ground line label is deliberately absent — every name and number
 * is in the legend and the readout below, per §4E).
 *
 * The construction is drawn in SCREEN pixels normalised by the largest speed on
 * screen, so a 0.5 m/s current and a 15 m/s boat both produce arrows you can see
 * and compare — the same rule the projectile module uses for its velocity arrows,
 * and the reason its vectors do not explode or vanish across the slider range.
 */
function DeckCanvas(p: DeckCanvasProps) {
  const narrow = isNarrow(p.w);
  const PAD = narrow ? 16 : 26;
  const W = Math.max(240, p.w);
  const H = Math.max(200, p.h);

  const grabbedRef = useRef(false);

  const toBox = (e: React.PointerEvent<SVGSVGElement>): { x: number; y: number } | null => {
    const svg = p.svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const fit = Math.min(r.width / W, r.height / H);
    if (!(fit > 0)) return null;
    return {
      x: (e.clientX - r.left - (r.width - W * fit) / 2) / fit,
      y: (e.clientY - r.top - (r.height - H * fit) / 2) / fit,
    };
  };

  if (p.scene === 'river') {
    // Geometry: the river runs left→right across the canvas, near bank at the
    // bottom, far bank at the top. One scale for both axes — a stretched view
    // would make a 37° heading look like 60° and contradict the readout.
    const bankGap = H - 2 * PAD - 26;
    const mPerPx = p.width / Math.max(bankGap, 1);
    const originX = PAD + 26;
    const originY = H - PAD - 13;
    const farY = originY - bankGap;

    const speedMax = Math.max(p.boat, p.current, mag(p.river.vBoatGround), 1);
    const arrowPx = clamp(0.2 * Math.min(W, H), 40, 110);
    const k = arrowPx / speedMax;

    const bw = p.river.vBoatWater;
    const bg = p.river.vBoatGround;
    const tipBoat = { x: originX + bw.x * k, y: originY - bw.y * k };
    const tipCurrentFromBoat = { x: tipBoat.x + p.current * k, y: tipBoat.y };
    const tipSum = { x: originX + bg.x * k, y: originY - bg.y * k };

    const path = p.river.crossTime != null ? riverPath({ width: p.width, current: p.current, boat: p.boat, headingDeg: p.heading }) : null;
    const waterPath = p.river.crossTime != null ? riverPathInWaterFrame({ width: p.width, current: p.current, boat: p.boat, headingDeg: p.heading }) : null;
    const toPx = (v: { x: number; y: number }) => ({ x: originX + v.x / mPerPx, y: originY - v.y / mPerPx });

    const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
      const at = toBox(e);
      if (!at) return;
      if (Math.hypot(at.x - tipBoat.x, at.y - tipBoat.y) > 30) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      grabbedRef.current = true;
      p.onGrab(true);
    };
    const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!grabbedRef.current) return;
      const at = toBox(e);
      if (!at) return;
      // Heading is measured from straight across, positive upstream (−x).
      const dx = at.x - originX;
      const dy = originY - at.y;
      const deg = (Math.atan2(-dx, Math.max(dy, 1e-6)) * 180) / Math.PI;
      p.onHeading(clamp(Math.round(deg), -80, 80));
    };
    const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!grabbedRef.current) return;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      grabbedRef.current = false;
      p.onGrab(false);
    };

    return (
      <svg ref={p.svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%"
        style={{ display: 'block', touchAction: 'none', cursor: 'grab' }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {/* banks */}
        <rect x={0} y={farY} width={W} height={originY - farY} fill={accentTint(ACCENT_2, 0.07)} />
        <line x1={0} y1={originY} x2={W} y2={originY} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
        <line x1={0} y1={farY} x2={W} y2={farY} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
        {/* current streaks — direction, not decoration: they show which way the
            water goes, which is the only thing the current arrow asserts. */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = farY + ((i + 0.5) * (originY - farY)) / 5;
          return (
            <line key={`streak-${i}`} x1={PAD} y1={y} x2={PAD + clamp(p.current * 14, 6, W - 2 * PAD)} y2={y}
              stroke={accentTint(ACCENT_2, 0.5)} strokeWidth={1.5} strokeDasharray="10 8" />
          );
        })}

        {/* the paths */}
        {p.stage >= 2 && path && (
          <path d={pathD(path.points.map((s) => toPx(s.pos)))} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2.5} />
        )}
        {p.stage >= 3 && waterPath && (
          <path d={pathD(waterPath.points.map((s) => toPx(s.pos)))} fill="none"
            stroke="rgba(255,255,255,0.35)" strokeWidth={2} strokeDasharray="6 5" />
        )}

        {/* the construction */}
        {p.showConstruction && (
          <>
            <Arrow x1={originX} y1={originY} x2={tipBoat.x} y2={tipBoat.y} color={ACCENT} width={3} />
            {p.stage >= 1 && (
              <Arrow x1={tipBoat.x} y1={tipBoat.y} x2={tipCurrentFromBoat.x} y2={tipCurrentFromBoat.y} color={ACCENT_2} width={3} />
            )}
            {p.stage >= 2 && (
              <Arrow x1={originX} y1={originY} x2={tipSum.x} y2={tipSum.y} color="rgba(255,255,255,0.9)" width={3.5} />
            )}
          </>
        )}

        {/* the boat, and the aim handle at the arrowhead */}
        <circle cx={originX} cy={originY} r={7} fill={ACCENT} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} />
        {p.grabHint && (
          <circle cx={tipBoat.x} cy={tipBoat.y} r={16} fill="none" stroke={ACCENT} strokeWidth={2} opacity={0.5}>
            <animate attributeName="r" values="12;20;12" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.12;0.6" dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx={tipBoat.x} cy={tipBoat.y} r={8} fill={accentTint(ACCENT, 0.9)}
          stroke="rgba(255,255,255,0.92)" strokeWidth={1.5} style={{ cursor: 'grab' }} />

        {/* landing point */}
        {p.stage >= 2 && p.river.drift != null && (
          <circle cx={originX + p.river.drift / mPerPx} cy={farY} r={6}
            fill="rgba(255,255,255,0.9)" stroke={ACCENT_2} strokeWidth={2} />
        )}

        {/* THE ONE TEXT ELEMENT: the far-bank distance, which has no legend row
            because it is a position on the drawing rather than a quantity. */}
        <text x={W - PAD} y={farY - 6} textAnchor="end" fill={TEXT.ghost} fontSize={11} fontWeight={600}
          className="tabular-nums" style={{ pointerEvents: 'none' }}>
          {`${f1(p.width)} m across`}
        </text>
      </svg>
    );
  }

  if (p.scene === 'rain') {
    const cx = W * 0.42;
    const groundY = H - PAD - 20;
    const speedMax = Math.max(p.rainR.apparentSpeed, mag(p.rainR.vRain), mag(p.rainR.vMan), 1);
    const arrowPx = clamp(0.24 * Math.min(W, H), 44, 120);
    const k = arrowPx / speedMax;
    const headY = groundY - 96;

    const rainTip = { x: cx + p.rainR.vRain.x * k, y: headY - p.rainR.vRain.y * k };
    const manTip = { x: cx + p.rainR.vMan.x * k, y: headY };
    const negManTip = { x: rainTip.x - p.rainR.vMan.x * k, y: rainTip.y };
    const relTip = { x: cx + p.rainR.vRelative.x * k, y: headY - p.rainR.vRelative.y * k };
    const tilt = rad(p.rainR.umbrellaTiltDeg);

    return (
      <svg ref={p.svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block', touchAction: 'none' }}>
        <line x1={0} y1={groundY} x2={W} y2={groundY} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
        {/* falling rain — vertical always, because it IS vertical */}
        {Array.from({ length: 14 }, (_, i) => {
          const x = PAD + (i * (W - 2 * PAD)) / 13;
          return <line key={`drop-${i}`} x1={x} y1={PAD} x2={x} y2={groundY} stroke={accentTint(ACCENT_2, 0.28)} strokeWidth={1.5} strokeDasharray="8 14" />;
        })}
        {/* the walker */}
        <circle cx={cx} cy={headY} r={11} fill={accentTint(ACCENT, 0.35)} stroke={ACCENT} strokeWidth={2} />
        <line x1={cx} y1={headY + 11} x2={cx} y2={groundY} stroke={ACCENT} strokeWidth={3} />
        {/* the umbrella, along the relative direction */}
        {p.stage >= 3 && (
          <line
            x1={cx - 34 * Math.cos(tilt)} y1={headY - 30 - 34 * Math.sin(tilt)}
            x2={cx + 34 * Math.cos(tilt)} y2={headY - 30 + 34 * Math.sin(tilt)}
            stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinecap="round"
            transform={`rotate(${p.rainR.umbrellaTiltDeg} ${cx} ${headY - 30})`}
          />
        )}
        {p.showConstruction && (
          <>
            <Arrow x1={cx} y1={headY} x2={rainTip.x} y2={rainTip.y} color={ACCENT_2} width={3} />
            {p.stage >= 1 && <Arrow x1={cx} y1={headY} x2={manTip.x} y2={manTip.y} color={ACCENT} width={3} />}
            {p.stage >= 2 && (
              <>
                <Arrow x1={rainTip.x} y1={rainTip.y} x2={negManTip.x} y2={negManTip.y} color="rgba(255,255,255,0.45)" width={2.5} dashed />
                <Arrow x1={cx} y1={headY} x2={relTip.x} y2={relTip.y} color="rgba(255,255,255,0.9)" width={3.5} />
              </>
            )}
          </>
        )}
        <text x={W - PAD} y={PAD + 10} textAnchor="end" fill={TEXT.ghost} fontSize={11} fontWeight={600}
          className="tabular-nums" style={{ pointerEvents: 'none' }}>
          {`tilt ${f1(p.rainR.umbrellaTiltDeg)}° forwards`}
        </text>
      </svg>
    );
  }

  // ── trains / frame-swap ───────────────────────────────────────────────────
  const laneA = H * 0.34;
  const laneB = H * 0.64;

  /**
   * What the chosen observer measures.
   *
   * ONE subtraction, three views. Riding A, A is at rest by definition and B
   * moves at v_B − v_A; riding B it is the mirror; from the ground both move.
   * There is no fourth formula and no privileged reading — which is the whole
   * lesson of the frame-swap archetype.
   */
  const measured =
    p.observer === 'a' ? { a: 0, b: p.vB - p.vA }
    : p.observer === 'b' ? { a: p.vA - p.vB, b: 0 }
    : { a: p.vA, b: p.vB };

  // One px-per-(m/s) for every arrow on this canvas, normalised by the largest
  // speed on screen — so a 2 m/s difference and a 40 m/s ground speed both draw
  // as something you can see and compare. Same rule as the projectile module's
  // velocity arrows, and the reason they do not explode or vanish across a
  // slider's range.
  const speedMax = Math.max(Math.abs(measured.a), Math.abs(measured.b), Math.abs(p.trains.vAB), 1);
  const k = clamp(0.2 * W, 44, 150) / speedMax;
  const cx0 = W * (p.observer === 'ground' ? 0.22 : 0.3);

  return (
    <svg ref={p.svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block', touchAction: 'none' }}>
      {[laneA, laneB].map((y, i) => (
        <line key={`rail-${i}`} x1={0} y1={y + 22} x2={W} y2={y + 22} stroke="rgba(255,255,255,0.28)" strokeWidth={2} />
      ))}

      {/* the two bodies. Length is drawn to scale for the two-train overtake,
          because the gap that has to be covered IS both lengths and a picture
          that ignores it would make the 300 m disappear. */}
      {(() => {
        // One metres-per-pixel for both bodies, chosen so the pair together fills
        // half the canvas. Drawing them at a fixed size would hide the fact that
        // the distance to be covered in an overtake is BOTH lengths — which is
        // the only reason the lengths are in the problem at all.
        const mPerPx = Math.max(p.trains.passLength, 60) / Math.max(W * 0.5, 1);
        const la = p.scene === 'trains' ? clamp(p.lenA / mPerPx, 40, W * 0.34) : 62;
        const lb = p.scene === 'trains' ? clamp(p.lenB / mPerPx, 40, W * 0.34) : 62;
        return (
          <>
            <rect x={cx0 - la / 2} y={laneA - 12} width={la} height={26} rx={5}
              fill={accentTint(ACCENT, 0.24)} stroke={ACCENT} strokeWidth={2} />
            <rect x={cx0 - lb / 2} y={laneB - 12} width={lb} height={26} rx={5}
              fill={accentTint(ACCENT_2, 0.24)} stroke={ACCENT_2} strokeWidth={2} />
            <Arrow x1={cx0 + la / 2 + 4} y1={laneA + 1} x2={cx0 + la / 2 + 4 + measured.a * k} y2={laneA + 1}
              color={ACCENT} width={3.5} />
            <Arrow x1={cx0 + lb / 2 + 4} y1={laneB + 1} x2={cx0 + lb / 2 + 4 + measured.b * k} y2={laneB + 1}
              color={ACCENT_2} width={3.5} />
          </>
        );
      })()}

      {/* The construction, in the ground view only: A's arrow, then −v_B laid on
          its tip, and the remainder IS v_AB. Subtracting a vector is adding its
          reverse, and that is a thing to be seen rather than a rule to recite. */}
      {p.showConstruction && p.observer === 'ground' && p.stage >= 1 && (
        <Arrow
          x1={cx0 + 40 + measured.a * k} y1={laneA - 26}
          x2={cx0 + 40 + measured.a * k - measured.b * k} y2={laneA - 26}
          color="rgba(255,255,255,0.5)" width={2.5} dashed
        />
      )}
      {p.showConstruction && p.observer === 'ground' && p.stage >= 1 && (
        <Arrow x1={cx0 + 40} y1={laneA - 26} x2={cx0 + 40 + measured.a * k} y2={laneA - 26}
          color={ACCENT} width={2.5} />
      )}
      {p.showConstruction && p.observer === 'ground' && p.stage >= 2 && (
        <Arrow x1={cx0 + 40} y1={laneA - 48} x2={cx0 + 40 + p.trains.vAB * k} y2={laneA - 48}
          color="rgba(255,255,255,0.9)" width={3.5} />
      )}

      {/* THE ONE TEXT ELEMENT on this canvas. */}
      <text x={W - PAD} y={PAD + 10} textAnchor="end" fill={TEXT.ghost} fontSize={11} fontWeight={600}
        className="tabular-nums" style={{ pointerEvents: 'none' }}>
        {p.observer === 'ground' ? `v_AB = ${f2(p.trains.vAB)} m/s` : `you are riding ${p.observer.toUpperCase()}`}
      </text>
    </svg>
  );
}

// ── primitives ───────────────────────────────────────────────────────────────

function Arrow({ x1, y1, x2, y2, color, width = 2.5, dashed }:
  { x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dashed?: boolean }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!Number.isFinite(len) || len < 3) return null;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(12, Math.max(6, len * 0.28));
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy;
  const py = ux;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined} />
      <polygon fill={color}
        points={`${x2},${y2} ${bx + px * head * 0.48},${by + py * head * 0.48} ${bx - px * head * 0.48},${by - py * head * 0.48}`} />
    </g>
  );
}

const pathD = (pts: { x: number; y: number }[]): string =>
  pts.length ? pts.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join('') : '';
