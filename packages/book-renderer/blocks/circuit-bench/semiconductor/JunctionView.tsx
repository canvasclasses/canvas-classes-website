'use client';

/*
 * semiconductor/JunctionView.tsx — the barrier, and the bands bending under bias.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * Two things textbooks state and cannot show:
 *
 *  1. THE BARRIER BUILDS ITSELF. No battery is connected. Carriers diffuse, uncover
 *     fixed ions, the ions make a field, the field stops the diffusion. This view
 *     draws the exposed-ion charge blocks BESIDE the band diagram, from
 *     `chargeProfile()`, so "the field comes from the ions" is a picture of the
 *     ions rather than a sentence about them.
 *  2. FORWARD AND REVERSE ARE ONE FORMULA. The width readout and the band bend
 *     both come from W = √(2ε(V_bi − V)/q · (1/N_A + 1/N_D)) with the sign of V in
 *     it. Drag the bias slider through zero and nothing jumps — which is the proof
 *     that there is not a second rule for reverse.
 *
 * ── Two views, deliberately linked ──────────────────────────────────────────
 * The charge blocks and the band diagram share ONE x-axis in nanometres and ONE
 * depletion geometry, from a single `depletion()` call. They cannot disagree about
 * where the depletion region is, and watching both edges move together is what
 * connects "charge separated" to "bands bent".
 *
 * ⚠ WHY NANOMETRES. A depletion width is ~4×10⁻⁷ m. Working in metres puts the
 * axis scale near 10⁹ px/m, and `fitView`'s 1% quantisation ladder returns exactly
 * zero for the reciprocal case — a trap already hit at planetary scale. Every
 * length here is converted once, at the boundary, by `toNm`.
 *
 * The canvas renders ZERO `<text>` elements. Guided, never auto-playing.
 */

import * as React from 'react';
import {
  bandProfile, builtInPotential, chargeProfile, depletion, type JunctionSpec,
} from './lib/junction';
import { material, MATERIAL_NAMES, carriers } from './lib/materials';
import { axis, junctionLimits, polyline, ticks, toNm } from './lib/view';
import { perM3, si, fixed, power } from './lib/format';
import {
  A1, A2, ActionButton, AttackCard, Axes, Canvas, Card, Choice, Legend, ModelNote,
  PredictGate, Readout, Stage, TickStrip, Toggle, boxFor, type ReadoutRow,
} from './parts';
import type { SemiconductorArchetype, SemiconductorScene } from '../archetypes.semiconductor';
import { SimSlider, TEXT } from '../../simulations/_shared';
import { stageHeightFor } from './stage';

export default function JunctionView({ scene, arch, stageW, stacked }: {
  scene: SemiconductorScene;
  arch: SemiconductorArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const start: JunctionSpec = scene.junction ?? { material: material('Si'), na: 1e22, nd: 1e22 };
  const [materialName, setMaterialName] = React.useState<string>(start.material.name);
  const [naDecade, setNaDecade] = React.useState(Math.log10(start.na));
  const [ndDecade, setNdDecade] = React.useState(Math.log10(start.nd));

  /** Whether this archetype is the biasing one. `pn-junction` opens with the bias
   *  control hidden, because "nothing is connected" is its entire first beat. */
  const biasable = arch.id === 'biasing';
  const [bias, setBias] = React.useState(biasable ? 0 : 0);
  const [showCharge, setShowCharge] = React.useState<boolean>(true);
  const [rung, setRung] = React.useState(0);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);
  const [everBiased, setEverBiased] = React.useState(false);

  const m = material(materialName);
  const j: JunctionSpec = { material: m, na: Math.pow(10, naDecade), nd: Math.pow(10, ndDecade) };

  const appliedBias = biasable && rung >= 1 ? bias : 0;
  const dep = React.useMemo(() => depletion(j, appliedBias), [j.material, j.na, j.nd, appliedBias]);
  const bands = React.useMemo(() => bandProfile(j, appliedBias, 180), [j.material, j.na, j.nd, appliedBias]);
  const charge = React.useMemo(() => chargeProfile(j, appliedBias), [j.material, j.na, j.nd, appliedBias]);
  const vbi = builtInPotential(j);
  const cP = carriers(m, 'p-type', j.na);
  const cN = carriers(m, 'n-type', j.nd);

  const w = Math.max(240, stageW || 320);
  const bandH = stageHeightFor(w, stacked ? 0.6 : 0.5, 340, 210);
  const chargeH = stageHeightFor(w, stacked ? 0.26 : 0.2, 150, 96);
  const bandBox = React.useMemo(() => boxFor(w - 16, bandH), [w, bandH]);
  const chargeBox = React.useMemo(() => boxFor(w - 16, chargeH), [w, chargeH]);

  const lim = junctionLimits(toNm(dep.intoP), toNm(dep.intoN));
  const evidence = biasable ? everBiased && rung >= 2 : rung >= 2;

  const rows: ReadoutRow[] = [
    { label: 'material', value: `${m.label} — gap ${fixed(m.bandGapEv, 2)} eV`, color: A1 },
    { label: 'p-side, acceptors', value: perM3(j.na) },
    { label: 'n-side, donors', value: perM3(j.nd) },
    { label: 'majority on the p-side', value: `${power(cP.holes, 'm⁻³')} holes` },
    { label: 'majority on the n-side', value: `${power(cN.electrons, 'm⁻³')} electrons` },
    { label: 'built-in potential V_bi', value: `${fixed(vbi, 4)} V`, color: A1, strong: true },
    ...(biasable
      ? [
        { label: 'applied bias V', value: `${appliedBias >= 0 ? '+' : ''}${fixed(appliedBias, 2)} V`, color: A2 },
        { label: 'the barrier now, V_bi − V', value: `${fixed(dep.barrier, 4)} V`, color: A2, strong: true },
      ]
      : []),
    { label: 'depletion width W', value: si(dep.width, 'm'), color: A2, strong: true },
    { label: 'reaching into the p-side', value: si(dep.intoP, 'm') },
    { label: 'reaching into the n-side', value: si(dep.intoN, 'm') },
    ...(rung >= 2
      ? [
        { label: 'peak field at the junction', value: si(dep.peakField, 'V/m'), color: A2 },
        { label: 'exposed charge per unit area', value: si(Math.abs(charge.chargeN), 'C/m²') },
        { label: 'junction capacitance', value: si(dep.capacitancePerArea, 'F/m²') },
      ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Predict BEFORE anything is drawn, and above the canvas. */}
      {biasable && rung === 0 && predictChoice === null && (
        <PredictGate
          prompt="Connect the battery + to the p-side — forward bias. **Does the depletion region get wider, narrower, or stay the same?**"
          options={[
            'Wider — the battery pulls the carriers further apart',
            'Narrower — the battery pushes carriers back into it',
            'The same — the depletion region is fixed by the doping',
            'It disappears completely',
          ]}
          answerIndex={1}
          reveal={
            'Narrower. Forward bias pushes holes in from the left and electrons in from the right, and they '
            + 'refill part of the depleted zone — so the barrier the ions were holding up is partly cancelled. '
            + 'The barrier is V_bi − V, and W goes as its square root.'
          }
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      {/* ══ the band diagram ════════════════════════════════════════════════ */}
      <Stage>
        <Canvas
          box={bandBox}
          label={`Conduction and valence band edges across the junction at ${fixed(appliedBias, 2)} volts of bias.`}
        >
          <BandDiagram
            box={bandBox}
            bands={bands}
            lim={lim}
            gap={m.bandGapEv}
            showFermiSplit={biasable && Math.abs(appliedBias) > 1e-9}
          />
        </Canvas>
      </Stage>

      <Legend rows={[
        { color: A1, label: 'conduction band edge E_c' },
        { color: A1, dashed: true, label: 'valence band edge E_v' },
        { color: A2, dashed: true, label: 'Fermi level — flat at equilibrium, split by the bias' },
        { color: A2, label: 'band bend', value: `${fixed(bands.bendEv, 4)} eV` },
      ]} />

      {/* ══ the exposed ions ════════════════════════════════════════════════ */}
      {showCharge && (
        <>
          <Stage>
            <Canvas box={chargeBox} label="Fixed ionised dopants uncovered on each side of the junction.">
              <ChargeBlocks box={chargeBox} charge={charge} lim={lim} />
            </Canvas>
            <TickStrip
              box={chargeBox}
              ticks={ticks(lim.xMin, lim.xMax, 5)}
              format={(v) => fixed(v, 0)}
              unit="nm from the junction"
            />
          </Stage>
          <Legend rows={[
            { color: A1, label: 'negative acceptor ions, p-side', value: si(Math.abs(charge.chargeP), 'C/m²') },
            { color: A2, label: 'positive donor ions, n-side', value: si(charge.chargeN, 'C/m²') },
          ]} />
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={A2}
          disabled={rung >= 3 || (biasable && rung === 0 && predictChoice === null)}
          onClick={() => setRung((r) => Math.min(3, r + 1))}
        >
          {rung === 0 ? (biasable ? 'Apply the bias' : 'Join the two blocks')
            : rung === 1 ? 'Show the exposed ions'
              : rung === 2 ? 'Read the field they make' : 'All three shown'}
        </ActionButton>
        {rung > 0 && (
          <ActionButton onClick={() => { setRung(0); setBias(0); setPredictChoice(null); setEverBiased(false); }}>
            Start again
          </ActionButton>
        )}
        <Toggle on={showCharge} label="Show the ions" onClick={() => setShowCharge((v) => !v)} accent={A2} />
      </div>

      {rung >= 1 && (
        <Card tone="accent">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            {biasable ? 'One formula, both directions' : 'Nobody connected anything'}
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            {biasable
              ? <>The barrier is <b>V_bi − V</b> = {fixed(dep.barrier, 4)} V, and{' '}
                <b>W = √(2ε(V_bi − V)/q · (1/N_A + 1/N_D))</b> = {si(dep.width, 'm')}. Drag the bias slider
                through zero: the width moves smoothly and never jumps. If forward and reverse were two
                different rules there would be a discontinuity at V = 0, and there is not.</>
              : <>There is no battery in this circuit. The {fixed(vbi, 3)} V barrier and the{' '}
                {si(dep.width, 'm')} depletion layer built themselves, out of nothing but diffusion and the
                fixed ions it uncovered — and that {fixed(vbi, 2)} V is the same 0.7 V that shows up as the
                diode knee. It is not a coincidence; it is the same number.</>}
          </p>
        </Card>
      )}

      {rung >= 2 && j.na !== j.nd && (
        <Card tone="second">
          <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
            The two sides are doped differently, and look where the depletion region went: <b>{si(dep.intoP, 'm')}</b>{' '}
            into the p-side and <b>{si(dep.intoN, 'm')}</b> into the n-side. It sits almost entirely in the{' '}
            <b>lightly</b> doped side, because both sides must expose exactly equal charge and the lightly
            doped side needs more volume to find it. That is why a real diode&apos;s heavily doped region is
            barely visible on a band diagram.
          </p>
        </Card>
      )}

      {dep.beyondApproximation && dep.note && (
        <Card tone="bad">
          <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>{dep.note}</p>
        </Card>
      )}

      <Readout rows={rows} />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold" style={{ color: A1 }}>Material</span>
          <Choice options={[...MATERIAL_NAMES]} value={materialName} onChange={setMaterialName} />
        </div>
        <SimSlider
          label="p-side N_A"
          value={naDecade}
          min={20}
          max={25}
          step={0.1}
          onChange={setNaDecade}
          format={() => power(j.na, '', 2)}
          unit="m⁻³"
        />
        <SimSlider
          label="n-side N_D"
          value={ndDecade}
          min={20}
          max={25}
          step={0.1}
          onChange={setNdDecade}
          format={() => power(j.nd, '', 2)}
          unit="m⁻³"
        />
        {biasable && rung >= 1 && (
          <SimSlider
            label="Applied bias"
            value={bias}
            min={-10}
            max={Math.max(0.1, vbi - 0.05)}
            step={0.02}
            accent={A2}
            onChange={(v) => { setBias(v); setEverBiased(true); }}
            format={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}`}
            unit="V"
          />
        )}
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      <ModelNote>
        Abrupt (step) junction with the depletion approximation — the standard textbook derivation. The
        potential inside the layer is the exact solution of Poisson&apos;s equation for that model, parabolic
        on each side and matched at the junction plane, which is why the peak field and the total bend agree
        with each other. It stops being valid within a few kT/q of V_bi, and says so when it does.
      </ModelNote>
    </div>
  );
}

// ── the band diagram ─────────────────────────────────────────────────────────

function BandDiagram({ box, bands, lim, gap, showFermiSplit }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  bands: ReturnType<typeof bandProfile>;
  lim: { xMin: number; xMax: number };
  gap: number;
  showFermiSplit: boolean;
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(lim.xMin, lim.xMax, x, x + w);

  const ecMax = Math.max(...bands.ec);
  const evMin = Math.min(...bands.ev);
  const pad = (ecMax - evMin) * 0.12;
  // Energy INCREASES upward, so the pixel axis is inverted — the single y-flip.
  const py = axis(evMin - pad, ecMax + pad, y + h, y);

  const pts = bands.x.map((xi, i) => ({ xi: toNm(xi), ec: bands.ec[i], ev: bands.ev[i], fp: bands.efP[i], fn: bands.efN[i] }));

  const gridY = ticks(evMin - pad, ecMax + pad, 5).map(py);
  const depFrom = px(toNm(bands.depletionFrom));
  const depTo = px(toNm(bands.depletionTo));

  return (
    <g>
      <Axes box={box} gridY={gridY} />

      {/* The depletion region, shaded. */}
      <rect
        x={depFrom} y={y} width={Math.max(1, depTo - depFrom)} height={h}
        fill={`${A2}1f`} stroke={A2} strokeWidth={1} strokeDasharray="4 3"
      />

      {/* Band gap fill — so the forbidden zone reads as forbidden. */}
      <path
        d={`${polyline(pts, (p) => px(p.xi), (p) => py(p.ec))} L${px(pts[pts.length - 1].xi)},${py(pts[pts.length - 1].ev)} ${
          polyline([...pts].reverse(), (p) => px(p.xi), (p) => py(p.ev)).replace(/^M/, 'L')} Z`}
        fill={`${A1}12`}
      />

      <path d={polyline(pts, (p) => px(p.xi), (p) => py(p.ec))} fill="none" stroke={A1} strokeWidth={2.4} />
      <path
        d={polyline(pts, (p) => px(p.xi), (p) => py(p.ev))}
        fill="none" stroke={A1} strokeWidth={2} strokeDasharray="7 4"
      />

      {/* Fermi level(s). Flat and single at equilibrium; split by the bias. */}
      {showFermiSplit ? (
        <>
          <path
            d={polyline(pts.filter((p) => p.xi <= 0), (p) => px(p.xi), (p) => py(p.fp))}
            fill="none" stroke={A2} strokeWidth={1.8} strokeDasharray="3 3"
          />
          <path
            d={polyline(pts.filter((p) => p.xi >= 0), (p) => px(p.xi), (p) => py(p.fn))}
            fill="none" stroke={A2} strokeWidth={1.8} strokeDasharray="3 3"
          />
        </>
      ) : (
        <line x1={x} y1={py(0)} x2={x + w} y2={py(0)} stroke={A2} strokeWidth={1.8} strokeDasharray="3 3" />
      )}
      {void gap}
    </g>
  );
}

// ── the exposed ions ─────────────────────────────────────────────────────────

/** The step-junction charge density IS piecewise constant, so it is drawn as two
 *  blocks rather than a sampled curve — sampling a step function only invents
 *  intermediate values that are not there. */
function ChargeBlocks({ box, charge, lim }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  charge: ReturnType<typeof chargeProfile>;
  lim: { xMin: number; xMax: number };
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(lim.xMin, lim.xMax, x, x + w);
  const mid = y + h / 2;
  const peak = Math.max(...charge.blocks.map((b) => Math.abs(b.rho)), 1);
  const scale = (h / 2) * 0.82;

  return (
    <g>
      <line x1={x} y1={mid} x2={x + w} y2={mid} stroke="rgba(255,255,255,0.20)" strokeWidth={1.2} />
      {charge.blocks.map((b, i) => {
        const x1 = px(toNm(b.from));
        const x2 = px(toNm(b.to));
        const height = (Math.abs(b.rho) / peak) * scale;
        const up = b.rho > 0;
        return (
          <rect
            key={i}
            x={Math.min(x1, x2)}
            y={up ? mid - height : mid}
            width={Math.max(1, Math.abs(x2 - x1))}
            height={Math.max(1, height)}
            fill={up ? `${A2}55` : `${A1}55`}
            stroke={up ? A2 : A1}
            strokeWidth={1.4}
          />
        );
      })}
    </g>
  );
}
