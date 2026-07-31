'use client';

/*
 * motion-lab/thermo/MolecularChamber.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 7: "Molecular Chamber (piston, heat,
 * live distribution) — temperature IS mean KE."
 *
 * ── THE TEMPERATURE IS MEASURED FROM THE MOLECULES ──────────────────────────
 * The number under the box is not a slider value fed back to the student. It is
 * `chamberMeanKE(mols, m) / k_B` — the mean ½mv² of the dots actually on
 * screen, converted through equipartition. Push the piston in and the molecules
 * bounce off an incoming wall, leave faster (the one-line reflection rule
 * `vx = 2·v_piston − vx` in `lib/kinetic.ts`), and the temperature readout rises
 * because THEY sped up. No heat was added anywhere, and nothing in the code
 * told the temperature to rise.
 *
 * That is adiabatic heating shown at the level where it actually happens, and
 * it is why the piston is draggable rather than being a slider.
 *
 * ── AN HONEST 2-D / 3-D NOTE, STATED ON SCREEN ──────────────────────────────
 * The drawn chamber is two-dimensional, where equipartition gives ⟨½mv²⟩ = k_BT
 * (two degrees of freedom), while every quoted result — v_rms, v_p, v̄, the
 * distribution curve — is the real three-dimensional gas at (3/2)k_BT. The
 * bench says so in the footnote rather than quietly hoping nobody checks.
 *
 * ── THE DISTRIBUTION IS THE POINT, NOT THE AVERAGE ──────────────────────────
 * `heavy-vs-light-gas` draws two distributions at ONE temperature. The peaks
 * are far apart and the mean kinetic energies are identical, which is the whole
 * of "same temperature does not mean same speed" in one picture.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { ThermoArchetype } from './types';
import * as K from './lib/kinetic';
import { makePlot, px, py, type Plot } from '../waves/lib/plot';
import { resolveParams, num, bool, controlDefs, bagKey } from '../waves/lib/resolve';
import { useAnimationFrame } from '../../simulations/_shared';
import { PlotFrame, Hatch, svgPoint, GRAB_CSS_PX } from '../waves/svgparts';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, accentTint,
  clamp, f1, f2, f3, fInt, type LegendRow, type ReadoutRow,
} from '../waves/ui';
import { prettyExp } from '../../simulations/_typography';

/**
 * Scientific notation the way NCERT prints it — "6.02 × 10⁻²¹ J", never
 * "6.02e-21". Molecular kinetic energies are ~10⁻²¹ J, so this is not optional
 * here: the e-notation form is programming syntax and reads as a typo to a
 * student. `prettyExp` is the shared helper and the sim design gate checks for
 * it by name.
 */
const sci = (v: number, digits = 2): string =>
  Number.isFinite(v) ? prettyExp(v.toExponential(digits)) : '—';

const MAX_STAGE = 3;
/** World box, in arbitrary drawing units — the physics is carried by the
 *  speeds, which are real, so the box only has to be a shape. */
const BOX_W = 1;
const BOX_H = 0.62;

export default function MolecularChamber({ block, arch }: { block: MotionBenchBlock; arch: ThermoArchetype }) {
  const twoGases = arch.id === 'heavy-vs-light-gas';
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [showDist, setShowDist] = useState(() => bool(authored, 'show_distribution', true));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);   // NEVER true on mount
  const [everRan, setEverRan] = useState(false);
  const [pistonX, setPistonX] = useState(BOX_W);
  const [pistonV, setPistonV] = useState(0);
  const [grabbed, setGrabbed] = useState(false);
  const [touched, setTouched] = useState(false);

  const mA = K.molecularMass(c.molarMass);
  const mB = K.molecularMass(c.molarMassB);

  const [molsA, setMolsA] = useState(() => K.seedChamber(c.count, c.T, mA, BOX_W, BOX_H, 7));
  const [molsB, setMolsB] = useState(() => (twoGases ? K.seedChamber(c.count, c.T, mB, BOX_W, BOX_H, 23) : []));

  // Re-seed only when the AUTHORED setup changes or the student explicitly
  // re-thermalises — never on the block's identity, which the admin editor
  // recreates on every keystroke.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMolsA(K.seedChamber(c.count, c.T, mA, BOX_W, BOX_H, 7));
    setMolsB(twoGases ? K.seedChamber(c.count, c.T, mB, BOX_W, BOX_H, 23) : []);
    setPistonX(BOX_W); setPistonV(0); setPlaying(false); setStep(guided ? 0 : MAX_STAGE + 1);
  }, [seed, guided, twoGases]);

  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((dt) => {
    const h = Math.min(dt, 0.05);
    setMolsA((prev) => K.advanceChamber(prev, h, BOX_H, pistonX, pistonV));
    if (twoGases) setMolsB((prev) => K.advanceChamber(prev, h, BOX_H, pistonX, pistonV));
    // The piston only carries a velocity while it is being dragged; releasing it
    // stops the work being done, which is what letting go of a piston means.
    if (!grabbed && pistonV !== 0) setPistonV(0);
  }, { enabled: playing, target: wrapRef });

  // ── measured, not assumed ─────────────────────────────────────────────────
  // 2-D equipartition: ⟨½mv²⟩ = k_B T over two degrees of freedom.
  const keA = K.chamberMeanKE(molsA, mA);
  const Tmeasured = keA / K.K_B;
  const keB = twoGases ? K.chamberMeanKE(molsB, mB) : 0;

  // Every quoted speed is the real 3-D result at the measured temperature.
  const vRmsA = K.vRms(mA, Tmeasured);
  const vRmsB = K.vRms(mB, Tmeasured);
  const vMpA = K.vMostProbable(mA, Tmeasured);
  const vMeanA = K.vMean(mA, Tmeasured);
  const meanKE3D = K.meanKineticEnergy(Tmeasured);

  const vMax = Math.max(vRmsA, vRmsB) * 2.6;
  const binsA = useMemo(() => K.speedBins(mA, Tmeasured, vMax, 160), [mA, Tmeasured, vMax]);
  const binsB = useMemo(() => (twoGases ? K.speedBins(mB, Tmeasured, vMax, 160) : []), [twoGases, mB, Tmeasured, vMax]);

  const compression = BOX_W / Math.max(pistonX, 0.01);
  const ready = misconceptionReady(arch.targets, { stage, everRan, compression, twoGases });

  // ── drag the piston ───────────────────────────────────────────────────────
  const geomRef = useRef<{ w: number; h: number; ox: number; oy: number; scale: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = geomRef.current;
    if (!g || stage < 1) return;
    const p = svgPoint(e, g.w, g.h);
    if (!p) return;
    const hx = g.ox + pistonX * g.scale;
    if (Math.abs(p.x - hx) * p.fit > GRAB_CSS_PX) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrabbed(true);
    setTouched(true);
    setEverRan(true);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = geomRef.current;
    if (!grabbed || !g) return;
    const p = svgPoint(e, g.w, g.h);
    if (!p) return;
    const next = clamp((p.x - g.ox) / g.scale, BOX_W * 0.4, BOX_W);
    // The piston's VELOCITY is what does work on the molecules, so it is
    // derived from the drag rather than being a separate control.
    setPistonV(clamp((next - pistonX) * 12, -3, 3));
    setPistonX(next);
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    setGrabbed(false);
    setPistonV(0);
  };

  // ── legend + readout ──────────────────────────────────────────────────────
  const legend: LegendRow[] = twoGases
    ? [
        { color: ACCENT, label: `${f1(c.molarMass)} g/mol`, value: `v_rms ${fInt(vRmsA)} m/s`, strong: true },
        { color: ACCENT_2, label: `${f1(c.molarMassB)} g/mol`, value: `v_rms ${fInt(vRmsB)} m/s`, strong: true },
        { color: 'rgba(255,255,255,0.5)', label: 'Both at the same measured temperature' },
      ]
    : [
        { color: ACCENT, label: 'Molecules', value: `${molsA.length} drawn`, strong: true },
        { color: ACCENT_2, label: 'Speed distribution at the measured T' },
        { color: 'rgba(255,255,255,0.5)', label: `v_p ${fInt(vMpA)} · v̄ ${fInt(vMeanA)} · v_rms ${fInt(vRmsA)} m/s` },
      ];

  const readout: ReadoutRow[] = [
    { label: 'Measured ⟨½mv²⟩ in the box', value: `${sci(keA)} J`, color: ACCENT, strong: true },
    { label: 'Temperature it implies', value: `${fInt(Tmeasured)} K`, color: ACCENT_2, strong: true },
    { label: '(3/2)k_BT for that temperature', value: `${sci(meanKE3D)} J` },
    { label: 'v_rms = √(3k_BT/m)', value: `${fInt(vRmsA)} m/s` },
    { label: 'v_p : v̄ : v_rms', value: `1 : ${f3(K.vMean(mA, Tmeasured) / vMpA)} : ${f3(vRmsA / vMpA)}` },
    { label: 'Compression so far', value: `${f2(compression)} ×` },
    ...(twoGases ? [{ label: 'Mean KE of the second gas', value: `${sci(keB)} J`, color: ACCENT_2 }] : []),
  ];

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · molecular chamber`}
        badge={<span className="tabular-nums">{`T = ${fInt(Tmeasured)} K`}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={1.45}
        maxCanvasHeight={440}
        frozen={grabbed}
        renderCanvas={(w, h) => {
          const boxH = h * (showDist && stage >= 2 ? 0.5 : 0.92);
          const scale = Math.min((w * 0.9) / BOX_W, (boxH * 0.82) / BOX_H);
          const ox = (w - BOX_W * scale) / 2;
          const oy = (boxH - BOX_H * scale) / 2;
          geomRef.current = { w, h, ox, oy, scale };

          const plot: Plot | null = showDist && stage >= 2
            ? makePlot(w, h - boxH, { xMin: 0, xMax: vMax, yMin: 0, yMax: Math.max(...binsA.map((b) => b.density), 1e-9) * 1.15 },
                { l: 24, r: 18, t: 14, b: 20 }, 0.02)
            : null;

          return (
            <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} width="100%" height="100%"
              style={{ display: 'block', touchAction: 'none' }}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              {/* the chamber */}
              <rect x={ox} y={oy} width={pistonX * scale} height={BOX_H * scale} rx={4}
                fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.28)" strokeWidth={2} />
              <Hatch x={ox} y={oy} len={BOX_H * scale} angleDeg={90} color="rgba(255,255,255,0.35)" teeth={7} />

              {/* the molecules — drawn from the SAME arrays the readout measures */}
              {stage >= 1 && molsA.map((m, i) => (
                <circle key={`a${i}`} cx={ox + clamp(m.x, 0, pistonX) * scale} cy={oy + (BOX_H - clamp(m.y, 0, BOX_H)) * scale}
                  r={2.6} fill={ACCENT} opacity={0.85} />
              ))}
              {stage >= 1 && molsB.map((m, i) => (
                <circle key={`b${i}`} cx={ox + clamp(m.x, 0, pistonX) * scale} cy={oy + (BOX_H - clamp(m.y, 0, BOX_H)) * scale}
                  r={3.4} fill={ACCENT_2} opacity={0.8} />
              ))}

              {/* the piston */}
              <rect x={ox + pistonX * scale - 5} y={oy - 4} width={10} height={BOX_H * scale + 8} rx={3}
                fill={accentTint(ACCENT_2, 0.5)} stroke={ACCENT_2} strokeWidth={2} />
              {!touched && stage >= 1 && (
                <circle cx={ox + pistonX * scale} cy={oy + (BOX_H * scale) / 2} r={17} fill="none"
                  stroke={ACCENT_2} strokeWidth={2} opacity={0.5}>
                  <animate attributeName="r" values="13;22;13" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.12;0.6" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}

              {/* the distribution */}
              {plot && (
                <g transform={`translate(0,${boxH})`}>
                  <PlotFrame plot={plot} xTicks={5} yTicks={3} zeroLine={false} />
                  {binsA.map((b, i) => (
                    <rect key={`da${i}`} x={px(plot, b.from)} y={py(plot, b.density)}
                      width={Math.max(1, px(plot, b.to) - px(plot, b.from))}
                      height={Math.max(0, py(plot, 0) - py(plot, b.density))}
                      fill={accentTint(ACCENT, 0.55)} />
                  ))}
                  {binsB.map((b, i) => (
                    <rect key={`db${i}`} x={px(plot, b.from)} y={py(plot, b.density)}
                      width={Math.max(1, px(plot, b.to) - px(plot, b.from))}
                      height={Math.max(0, py(plot, 0) - py(plot, b.density))}
                      fill={accentTint(ACCENT_2, 0.45)} />
                  ))}
                  {stage >= 3 && [vMpA, vMeanA, vRmsA].map((v, i) => (
                    <line key={`m${i}`} x1={px(plot, v)} y1={py(plot, plot.yMax)} x2={px(plot, v)} y2={py(plot, 0)}
                      stroke="rgba(255,255,255,0.55)" strokeWidth={1.4}
                      strokeDasharray={i === 0 ? '2 3' : i === 1 ? '5 4' : undefined} />
                  ))}
                </g>
              )}
            </svg>
          );
        }}
        legend={legend}
        belowCanvas={
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={() => { setPlaying((p) => !p); setEverRan(true); }} disabled={stage < MAX_STAGE}>
              {playing ? '❚❚ Freeze them' : '▶ Let them move'}
            </ActionButton>
            <ActionButton accent={ACCENT_2} disabled={stage < 1}
              onClick={() => {
                setMolsA(K.seedChamber(c.count, c.T, mA, BOX_W, BOX_H, 7));
                setMolsB(twoGases ? K.seedChamber(c.count, c.T, mB, BOX_W, BOX_H, 23) : []);
                setPistonX(BOX_W); setPistonV(0);
              }}>
              ↺ Re-thermalise at {fInt(c.T)} K
            </ActionButton>
            <Toggle on={showDist} label="show the speed distribution" onClick={() => setShowDist((v) => !v)} />
            <span className="text-[10px] leading-snug" style={{ color: TEXT.muted, maxWidth: 300 }}>
              {touched ? 'Push the piston in to compress — the wall does work on every molecule it meets.'
                : '👆 Drag the piston. No heat is added; the temperature still moves.'}
            </span>
          </div>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Set up the gas</SectionLabel>
            {defs.map((d) => d.kind === 'number' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 1} unit={d.unit ?? ''}
                accent={d.key === 'molar_mass_b' ? ACCENT_2 : ACCENT}
                format={(v) => v.toFixed(0)}
                onChange={(v) => {
                  setC((prev) => ({ ...prev, ...assign(d.key, v) }));
                  // Changing the gas or the target temperature re-seeds, because
                  // the old molecules were a sample from a different gas.
                  const next = { ...c, ...assign(d.key, v) };
                  setMolsA(K.seedChamber(next.count, next.T, K.molecularMass(next.molarMass), BOX_W, BOX_H, 7));
                  setMolsB(twoGases ? K.seedChamber(next.count, next.T, K.molecularMass(next.molarMassB), BOX_W, BOX_H, 23) : []);
                  setPistonX(BOX_W); setPistonV(0);
                }} />
            ) : null)}
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote="The drawn chamber is 2-D, where ⟨½mv²⟩ = k_BT over two degrees of freedom — that is what the temperature above is measured from. Every quoted SPEED is the real 3-D result at that temperature." />

            {twoGases && stage >= 3 && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>Same energy, different speed</SectionLabel>
                <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  Mean kinetic energies: <b style={{ color: ACCENT }}>{sci(keA)}</b> J and{' '}
                  <b style={{ color: ACCENT_2 }}>{sci(keB)}</b> J — the same number, because they
                  are at the same temperature. And v_rms differs by a factor of{' '}
                  <b style={{ color: ACCENT }}>{f2(Math.max(vRmsA, vRmsB) / Math.min(vRmsA, vRmsB))}</b>, which is exactly{' '}
                  √({f1(Math.max(c.molarMass, c.molarMassB) / Math.min(c.molarMass, c.molarMassB))}).
                </p>
              </Card>
            )}

            {!twoGases && compression > 1.1 && (
              <Card>
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  You have compressed by {f2(compression)}× and the temperature has gone from {fInt(c.T)} K to{' '}
                  <b style={{ color: ACCENT }}>{fInt(Tmeasured)} K</b> — with no heater anywhere. Every joule of that came from
                  molecules bouncing off a wall that was moving towards them.
                </p>
              </Card>
            )}

            {block.numeric && (
              <NumericPanel prompt={block.numeric.prompt} answer={block.numeric.answer}
                tolerance={block.numeric.tolerance} unit={block.numeric.unit}
                reveal={block.numeric.worked_reveal} />
            )}
          </>
        }
        misconception={ready ? { belief: arch.attacks.belief, attack: arch.attacks.attack } : null}
        tip={arch.tip}
        caption={block.caption}
      />
    </div>
  );
}

interface Controls { T: number; molarMass: number; molarMassB: number; count: number; piston: number }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  T: num(b, 'T', 300),
  molarMass: num(b, 'molar_mass', 32),
  molarMassB: num(b, 'molar_mass_b', 32),
  count: Math.round(num(b, 'molecules', 120)),
  piston: num(b, 'piston', 1),
});

const numberOf = (c: Controls, key: string): number => {
  switch (key) {
    case 'T': return c.T;
    case 'molar_mass': return c.molarMass;
    case 'molar_mass_b': return c.molarMassB;
    case 'molecules': return c.count;
    case 'piston': return c.piston;
    default: return 0;
  }
};

const assign = (key: string, v: number): Partial<Controls> => {
  switch (key) {
    case 'T': return { T: v };
    case 'molar_mass': return { molarMass: v };
    case 'molar_mass_b': return { molarMassB: v };
    case 'molecules': return { count: Math.round(v) };
    case 'piston': return { piston: v };
    default: return {};
  }
};

function misconceptionReady(code: string, x: {
  stage: number; everRan: boolean; compression: number; twoGases: boolean;
}): boolean {
  switch (code) {
    // The spread has to be visible — which needs the distribution drawn.
    case 'all_molecules_move_at_the_same_speed':
      return x.stage >= 2 && x.everRan;
    // Both curves have to be up before "same T, same speed" can be broken.
    case 'heavier_gas_moves_faster_at_same_temperature':
      return x.stage >= 3 && x.twoGases;
    default:
      return x.stage >= MAX_STAGE && x.everRan;
  }
}
