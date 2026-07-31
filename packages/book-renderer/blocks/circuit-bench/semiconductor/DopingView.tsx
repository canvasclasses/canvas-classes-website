'use client';

/*
 * semiconductor/DopingView.tsx — doping TRADES carriers, it does not add them.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * Textbooks say "adding phosphorus gives extra electrons" and stop. What they do
 * not show is what happens to the HOLES, and that omission is the whole
 * misconception: students leave thinking a doped semiconductor has more of both.
 *
 * So this view puts the two counts side by side on a log scale AND prints their
 * product, live, while the dopant slider moves. The electron count climbs five
 * decades, the hole count falls five decades, and n·p sits absolutely still at
 * nᵢ². That is the law of mass action, seen rather than stated, and it is what
 * makes "majority carrier" and "minority carrier" mean something.
 *
 * The bar chart is on a LOG axis and says so in the legend. A linear axis cannot
 * show 10²² and 10¹⁰ on one picture — the smaller bar would be a fifth of a pixel
 * — and the honest fix is a log axis with a label, not a truncated linear one.
 *
 * Guided, never auto-playing. The canvas renders ZERO `<text>` elements.
 */

import * as React from 'react';
import {
  carriers, material, MATERIAL_NAMES, type DopingType,
} from './lib/materials';
import { axis, ticks } from './lib/view';
import { perM3, oneIn, si, fixed, power } from './lib/format';
import {
  A1, A2, ActionButton, AttackCard, Axes, Canvas, Card, Choice, Legend, Readout,
  Stage, TickStrip, Toggle, boxFor, type ReadoutRow,
} from './parts';
import type { SemiconductorArchetype, SemiconductorScene } from '../archetypes.semiconductor';
import { SimSlider, TEXT } from '../../simulations/_shared';
import { stageHeightFor } from './stage';

const DOPING_LABELS: Record<string, string> = {
  intrinsic: 'pure (intrinsic)',
  'n-type': 'n-type — add phosphorus',
  'p-type': 'p-type — add boron',
};

export default function DopingView({ scene, arch, stageW, stacked }: {
  scene: SemiconductorScene;
  arch: SemiconductorArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const start = scene.doping ?? { materialName: 'Si', type: 'n-type' as DopingType, dopantPerM3: 1e22 };
  const [materialName, setMaterialName] = React.useState(start.materialName);
  const [type, setType] = React.useState<DopingType>(start.type);
  /** Dopant density is dragged in DECADES, because that is how it varies — a
   *  linear slider from 0 to 10¹⁹ per cm³ spends 99.99% of its travel above 10¹⁷. */
  const [decade, setDecade] = React.useState(Math.log10(Math.max(start.dopantPerM3, 1e18)));
  const [logAxis, setLogAxis] = React.useState(true);
  const [rung, setRung] = React.useState(0);

  const m = material(materialName);
  const dopant = type === 'intrinsic' ? 0 : Math.pow(10, decade);
  const c = React.useMemo(() => carriers(m, type, dopant), [m, type, dopant]);
  const pure = React.useMemo(() => carriers(m, 'intrinsic', 0), [m]);

  const w = Math.max(240, stageW || 320);
  const h = stageHeightFor(w, stacked ? 0.56 : 0.46, 300, 190);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  // Evidence for the card: the student has moved the dopant slider AND the hole
  // count is on screen. Never before — the product staying still is the punchline.
  const [moved, setMoved] = React.useState(false);
  const evidence = moved && rung >= 2;

  const rows: ReadoutRow[] = [
    { label: 'material', value: `${m.label} — gap ${fixed(m.bandGapEv, 2)} eV`, color: A1 },
    { label: 'atoms', value: perM3(m.atomsPerM3) },
    { label: 'intrinsic carriers nᵢ', value: perM3(m.intrinsicPerM3), color: A1 },
    ...(type === 'intrinsic' ? [] : [
      { label: 'dopant added', value: perM3(dopant), color: A2 },
      { label: 'that is', value: oneIn(c.dopantFraction), color: A2, strong: true },
    ]),
    { label: 'electrons n', value: perM3(c.electrons), color: type === 'n-type' ? A2 : A1, strong: type === 'n-type' },
    {
      label: 'holes p',
      value: rung >= 2 ? perM3(c.holes) : 'not looked at yet',
      color: type === 'p-type' ? A2 : A1,
      strong: type === 'p-type',
    },
    {
      label: 'n × p',
      value: rung >= 2 ? power(c.electrons * c.holes, 'm⁻⁶') : '—',
      color: A2,
      strong: rung >= 2,
    },
    { label: 'nᵢ²', value: rung >= 2 ? power(m.intrinsicPerM3 ** 2, 'm⁻⁶') : '—' },
    { label: 'majority carrier', value: c.majorityCarrier, color: A2 },
    { label: 'resistivity', value: si(c.resistivity, 'Ω·m') },
    ...(rung >= 3 && type !== 'intrinsic'
      ? [{
        label: 'conductivity vs pure',
        value: `${si(c.conductivity / pure.conductivity, '×')} better`,
        color: A2,
        strong: true,
      }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <Stage>
        <Canvas box={box} label={`Electron and hole concentrations in ${type} ${m.label}, on a logarithmic scale.`}>
          <CarrierBars
            box={box}
            electrons={c.electrons}
            holes={rung >= 2 ? c.holes : null}
            ni={m.intrinsicPerM3}
            atoms={m.atomsPerM3}
            logAxis={logAxis}
          />
        </Canvas>
        <TickStrip
          box={box}
          ticks={logAxis ? ticks(8, 29, 7) : ticks(0, c.electrons, 4)}
          format={logAxis ? (v) => `10${sup(v)}` : (v) => power(v, '', 2)}
          unit={logAxis ? 'per m³ (log)' : 'per m³'}
        />
      </Stage>

      <Legend rows={[
        { color: A1, label: 'electrons', value: perM3(c.electrons) },
        ...(rung >= 2 ? [{ color: A2, label: 'holes', value: perM3(c.holes) }] : []),
        { color: TEXT.muted, dashed: true, label: 'nᵢ, the pure-crystal level' },
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton accent={A2} disabled={rung >= 3} onClick={() => setRung((r) => Math.min(3, r + 1))}>
          {rung === 0 ? 'Count the carriers in pure silicon'
            : rung === 1 ? 'Add the dopant'
              : rung === 2 ? 'Compare with the pure crystal' : 'All three shown'}
        </ActionButton>
        {rung > 0 && <ActionButton onClick={() => { setRung(0); setMoved(false); }}>Start again</ActionButton>}
        <Toggle on={logAxis} label="Logarithmic axis" onClick={() => setLogAxis((v) => !v)} accent={A2} />
      </div>

      {rung >= 1 && !logAxis && (
        <Card tone="second">
          <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
            On a linear axis the hole bar is not small — it is invisible. That is not a drawing problem,
            it is the actual ratio: <b>{si(c.electrons / Math.max(c.holes, 1e-30), '')}</b> to one. Switch
            the axis back to logarithmic to see both at once.
          </p>
        </Card>
      )}

      {rung >= 2 && (
        <Card tone="accent">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            Now drag the dopant slider and watch the product
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            The electron count climbs. The hole count falls. And <b>n × p</b> does not move — it stays at
            nᵢ² through every decade of doping. Doping did not add carriers, it traded one kind for the
            other, and that is what creates a majority and a minority carrier for the junction to use.
          </p>
        </Card>
      )}

      <Readout rows={rows} />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold" style={{ color: A1 }}>Material</span>
          <Choice options={[...MATERIAL_NAMES]} value={materialName} onChange={(v) => { setMaterialName(v); setMoved(true); }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold" style={{ color: A2 }}>Doping</span>
          <Choice
            options={['intrinsic', 'n-type', 'p-type']}
            labels={DOPING_LABELS}
            value={type}
            onChange={(v) => { setType(v as DopingType); setMoved(true); setRung(Math.max(rung, 1)); }}
            accent={A2}
          />
        </div>
        {type !== 'intrinsic' && (
          <SimSlider
            label="Dopant density"
            value={decade}
            min={18}
            max={25}
            step={0.1}
            accent={A2}
            onChange={(v) => { setDecade(v); setMoved(true); setRung(Math.max(rung, 1)); }}
            format={() => power(dopant, '', 2)}
            unit="m⁻³"
          />
        )}
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
        nᵢ for silicon is taken as 1.50 × 10¹⁶ m⁻³, the value NCERT uses. Later measurements give
        9.65 × 10¹⁵; the difference changes nᵢ² by a third and every number here with it, so it is worth
        knowing which value a question expects. Mobilities and atom densities are Sze, 300 K.
      </p>
    </div>
  );
}

const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (v: number): string =>
  String(Math.round(v)).split('').map((d) => SUPS[Number(d)] ?? d).join('');

/**
 * Two horizontal bars on a shared logarithmic axis.
 *
 * ZERO `<text>`. A log axis is used because the two quantities differ by up to
 * twelve decades and the honest alternative — a linear axis — renders the minority
 * bar as nothing at all, which teaches that the minority carriers do not exist.
 * The legend says the axis is logarithmic.
 */
function CarrierBars({ box, electrons, holes, ni, atoms, logAxis }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  electrons: number; holes: number | null; ni: number; atoms: number; logAxis: boolean;
}) {
  const { x, y, w, h } = box.rect;
  const LO = 8;
  const HI = 29;
  const px = logAxis
    ? axis(LO, HI, x, x + w)
    : axis(0, Math.max(electrons, atoms * 0.02), x, x + w);
  const at = (v: number) => (logAxis
    ? px(Math.max(LO, Math.min(HI, Math.log10(Math.max(v, 1)))))
    : px(Math.max(0, v)));

  const barH = Math.max(12, Math.min(34, h * 0.2));
  const rows = holes == null ? 1 : 2;
  const gap = h * (rows === 1 ? 0 : 0.16);
  const y0 = y + h / 2 - (rows * barH + gap) / 2;

  const gridY = [y0, y0 + barH + gap];
  const gridX = (logAxis ? ticks(LO, HI, 7) : ticks(0, Math.max(electrons, atoms * 0.02), 4)).map(px);

  return (
    <g>
      <Axes box={box} gridX={gridX} gridY={gridY.slice(0, 0)} />
      {/* nᵢ reference — where a pure crystal sits. */}
      <line x1={at(ni)} y1={y} x2={at(ni)} y2={y + h} stroke={TEXT.muted} strokeWidth={1.4} strokeDasharray="5 4" />
      <rect
        x={x} y={y0} width={Math.max(1, at(electrons) - x)} height={barH} rx={3}
        fill={`${A1}55`} stroke={A1} strokeWidth={1.4}
      />
      {holes != null && (
        <rect
          x={x} y={y0 + barH + gap} width={Math.max(1, at(holes) - x)} height={barH} rx={3}
          fill={`${A2}55`} stroke={A2} strokeWidth={1.4}
        />
      )}
    </g>
  );
}
