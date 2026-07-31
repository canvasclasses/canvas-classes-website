'use client';

/*
 * optics-bench/assembler/InstrumentAssembler.tsx — THE CENTREPIECE (§6).
 * ─────────────────────────────────────────────────────────────────────────────
 * The student starts with a lens and an object and builds forward. Every time
 * they add a primitive the bench is re-read from scratch by
 * `lib/instruments.ts`, which decides what they have made from WHICH PRIMITIVES
 * ARE PRESENT AND HOW THEY ARE ARRANGED — never from a flag this component
 * sets. That is the whole design: "you have just built a camera" has to be a
 * conclusion, not an announcement, or it is worth nothing.
 *
 * The evidence list under the banner is the recogniser's own working, in order.
 * If a student disagrees with the verdict they can read why it decided that,
 * and change the bench until it decides otherwise.
 *
 * The stage table is the other half of the point. A compound instrument's
 * INTERMEDIATE image is the thing textbooks skip and the reason magnifications
 * multiply instead of adding — so it is drawn on the canvas and listed here,
 * stage by stage, with the running product.
 */

import * as React from 'react';
import type { OpticsBenchBlock } from '@canvas/data/types/books';
import type { Bench, ElementKind, OpticalElement } from '../types';
import { resolveArchetype, defaultParams, type OpticsArchetypeEx } from '../archetypes';
import { traceBench } from '../lib/trace';
import {
  ASSEMBLER_PALETTE, ASSEMBLY_ARC, makeElement, recognise,
} from '../lib/instruments';
import { cartesianFocal, isLens, isMirror, NEAR_POINT_CM } from '../lib/convention';
import { dioptres, fNumber } from '../lib/formula';
import {
  SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TEXT, TYPE, BORDER, OK, accentTint,
} from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';
import BenchCanvas, { type CanvasLayers } from '../ui/BenchCanvas';
import {
  ActionButton, Card, GuidedPanel, Legend, Pill, ProbeGate, Readouts, TraceNotes,
  cm, sig, type LegendItem, type Row,
} from '../ui/parts';
import { GLASS, LIGHT } from '../ui/theme';
import { isNarrow, stageHeight, useStageWidth } from '../ui/useStageWidth';

type Params = Record<string, number | string | boolean>;

const KIND_LABEL: Record<string, string> = {
  'thin-lens': 'Lens', 'thick-lens': 'Lens', 'mirror-spherical': 'Mirror',
  'mirror-plane': 'Plane mirror', aperture: 'Stop', screen: 'Sensor',
  prism: 'Prism', slab: 'Glass', eye: 'Eye', grating: 'Slits',
};

const INSTRUMENT_LABEL: Record<string, string> = {
  'bare-lens': 'A bare lens', pinhole: 'A pinhole camera', camera: 'A camera',
  eye: 'An eye', 'eye-myopic': 'A short-sighted eye', 'eye-corrected': 'An eye with spectacles',
  magnifier: 'A magnifying glass', microscope: 'A compound microscope',
  'telescope-refracting': 'A refracting telescope', 'telescope-reflecting': 'A reflecting telescope',
  binoculars: 'A pair of binoculars', projector: 'A projector',
};

const glyphFor = (el: OpticalElement): LegendItem['glyph'] =>
  isLens(el.kind) || el.kind === 'eye' ? 'lens'
    : isMirror(el.kind) ? 'mirror'
      : el.kind === 'aperture' ? 'stop'
        : el.kind === 'screen' ? 'screen' : 'glass';

export default function InstrumentAssembler({ block }: { block: OpticsBenchBlock }) {
  const arch: OpticsArchetypeEx = React.useMemo(
    () => resolveArchetype(block.archetype, block.mode),
    [block.archetype, block.mode],
  );
  const blockParamsKey = JSON.stringify(block.params ?? {});

  const [params, setParams] = React.useState<Params>(() => ({
    ...defaultParams(arch), ...(block.params ?? {}),
  }));
  // Student edits on TOP of the archetype's bench, so changing a slider does
  // not throw away the primitives they added.
  const [added, setAdded] = React.useState<OpticalElement[]>([]);
  const [removed, setRemoved] = React.useState<string[]>([]);
  const [moved, setMoved] = React.useState<Record<string, number>>({});
  const [selected, setSelected] = React.useState<string | null>(null);
  const [step, setStep] = React.useState(0);
  const [probePick, setProbePick] = React.useState<number | null>(null);

  React.useEffect(() => {
    setParams({ ...defaultParams(arch), ...(JSON.parse(blockParamsKey) as Params) });
    setAdded([]); setRemoved([]); setMoved({}); setSelected(null);
  }, [arch, blockParamsKey]);

  const [stageRef, stageWidth] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageWidth);

  const built: Bench = React.useMemo(() => arch.build(params), [arch, params]);

  const bench: Bench = React.useMemo(() => ({
    ...built,
    elements: [...built.elements, ...added]
      .filter((e) => !removed.includes(e.id))
      .map((e) => (moved[e.id] !== undefined ? { ...e, x: moved[e.id] } : e))
      .sort((a, b) => a.x - b.x),
  }), [built, added, removed, moved]);

  const trace = React.useMemo(
    () => traceBench(bench, { realFan: true, rayCount: arch.rays ?? 11 }),
    [bench, arch.rays],
  );
  const assembly = React.useMemo(() => recognise(bench), [bench]);

  // Which rungs of the §6 arc this student has actually reached. A ref, so a
  // slider nudge that momentarily un-recognises the instrument does not wipe
  // the progress rail.
  const reached = React.useRef<Set<string>>(new Set());
  if (assembly.recognised) reached.current.add(assembly.recognised);

  const steps = block.steps?.length ? block.steps : (arch.defaultSteps ?? []);
  const guided = block.guided !== false && steps.length > 0;
  const total = Math.max(1, steps.length);
  const n = guided ? step : Infinity;
  const at = (want: number) => n >= Math.min(want, total);
  const layers: CanvasLayers = {
    focalPoints: true,
    rays: at(1),
    image: at(1),
    // The intermediate image is the whole reason a microscope multiplies, so it
    // is on as soon as there is light to make it.
    intermediates: at(1),
    construction: false,
  };

  const probe = arch.probe;
  const probeDue = !!probe && guided && step >= probe.afterStep;

  // ── Stage table — the running product ─────────────────────────────────────
  const named = (id: string) => {
    const el = bench.elements.find((e) => e.id === id);
    return el?.label ?? KIND_LABEL[el?.kind ?? ''] ?? id;
  };
  let running = 1;
  const stageRows: Row[] = trace.stages.map((s, i) => {
    const m = s.magnification;
    if (m != null) running *= m;
    const last = i === trace.stages.length - 1;
    return {
      label: `Stage ${i + 1} · ${named(s.elementId)}`,
      value: m == null ? 'image at ∞' : `×${sig(m, 2)}`,
      colour: LIGHT,
      note: m == null
        ? (last && trace.angular != null
          ? `The last stage sends the light out parallel, so its contribution is ANGULAR: ×${sig(NEAR_POINT_CM / Math.abs(cartesianFocal(bench.elements.find((e) => e.id === s.elementId) ?? { id: '', kind: 'thin-lens', x: 0 }) ?? 1), 2)} — and the total becomes ×${sig(Math.abs(trace.angular), 2)}.`
          : 'The rays leave parallel — this stage puts the image at infinity.')
        : `Image at ${cm(s.imageX)}. Running product so far: ×${sig(running, 2)}.`,
    };
  });

  // ── Readouts ──────────────────────────────────────────────────────────────
  const rows: Row[] = [];
  const lens = bench.elements.find((e) => isLens(e.kind));
  const stop = bench.elements.find((e) => e.kind === 'aperture');
  const screen = bench.elements.find((e) => e.kind === 'screen');
  const eye = bench.elements.find((e) => e.kind === 'eye');

  if (stop && lens) {
    const N = fNumber(Math.abs(cartesianFocal(lens) ?? 1), 2 * stop.aperture!);
    rows.push({
      label: 'Aperture', value: `f/${sig(N, 1)}`, colour: GLASS,
      note: `A ${(2 * stop.aperture!).toFixed(1)} cm opening on a ${Math.abs(cartesianFocal(lens) ?? 0).toFixed(1)} cm lens. Halve the opening and you quarter the light — and roughly double the depth that stays sharp.`,
    });
  }
  if (screen && trace.finalImage?.x != null) {
    const err = trace.finalImage.x - screen.x;
    rows.push({
      label: 'Focus', value: Math.abs(err) < 0.25 ? 'sharp' : `${sig(Math.abs(err), 2)} cm out`,
      colour: Math.abs(err) < 0.25 ? OK : LIGHT,   // sim-lint-ok — pass/fail pair
      note: Math.abs(err) < 0.25
        ? 'The sensor sits exactly at the image plane.'
        : `The image forms ${err > 0 ? 'behind' : 'in front of'} the sensor. Move the SENSOR to fix it — that is what a focus ring does.`,
    });
  }
  if (eye) {
    const fEye = cartesianFocal(eye) ?? 2.5;
    const axial = eye.radius && eye.radius > 0 ? eye.radius : 2.5;
    rows.push({
      label: 'Eyeball', value: `${axial.toFixed(2)} cm long, f = ${fEye.toFixed(2)} cm`,
      colour: GLASS,
      note: axial > fEye * 1.02
        ? `Too long by ${((axial - fEye) * 10).toFixed(1)} mm. Distant light focuses ${((axial - fEye) * 10).toFixed(1)} mm short of the retina — that is myopia, and two millimetres is a strong prescription.`
        : 'Focal length matches the axial length, so parallel light lands on the retina with the lens relaxed.',
    });
    const spec = bench.elements.find((e) => isLens(e.kind) && e.x < eye.x);
    if (spec) {
      const f = cartesianFocal(spec) ?? 0;
      rows.push({
        label: 'Prescription', value: `${dioptres(f) > 0 ? '+' : ''}${sig(dioptres(f), 2)} D`,
        colour: LIGHT,
        note: dioptres(f) < 0
          ? 'Negative power: a diverging lens, the correction for short sight.'
          : 'Positive power: a converging lens, the correction for long sight. Check the sign against which side of the retina the image is landing.',
      });
    }
  }
  if (trace.angular != null && (assembly.recognised === 'telescope-refracting'
    || assembly.recognised === 'telescope-reflecting' || assembly.recognised === 'binoculars'
    || assembly.recognised === 'microscope' || assembly.recognised === 'magnifier')) {
    rows.push({
      label: 'Angular magnification', value: `×${sig(Math.abs(trace.angular), 2)}`, strong: true,
      colour: LIGHT,
      note: trace.angular < 0
        ? 'Negative — the image is inverted. Measured from the emergent ray directions, not from a formula.'
        : 'Positive — the image is the right way up.',
    });
  }
  if (trace.finalImage?.x != null && !screen && !eye) {
    rows.push({ label: 'Image', value: cm(trace.finalImage.x), colour: LIGHT });
  }

  // ── Legend ────────────────────────────────────────────────────────────────
  const legend: LegendItem[] = [
    { name: 'Traced rays', colour: LIGHT, glyph: 'ray' },
    { name: 'Virtual — no light here', colour: LIGHT, glyph: 'dashed' },
    { name: 'Object', colour: LIGHT, glyph: 'arrow' },
  ];
  if (trace.images.length > 1) {
    legend.push({ name: 'Intermediate image', colour: LIGHT, glyph: 'arrow', note: 'faint — the second lens\'s object' });
  }
  for (const el of bench.elements) {
    const f = cartesianFocal(el);
    legend.push({
      name: el.label ?? KIND_LABEL[el.kind] ?? el.kind,
      colour: GLASS,
      glyph: glyphFor(el),
      value: f !== null && Number.isFinite(f) && (isLens(el.kind) || el.kind === 'mirror-spherical' || el.kind === 'eye')
        ? `f = ${f.toFixed(1)} cm` : undefined,
    });
  }

  const stageH = stageHeight(stageWidth, 900, narrow ? 620 : 470, narrow ? 300 : 460, 240);
  const canvasW = narrow ? Math.max(240, stageWidth - 8) : Math.max(300, Math.round(stageWidth * 0.58) - 12);

  const addPrimitive = (kind: ElementKind) => {
    const id = `ADD-${kind}-${added.length + 1}`;
    setAdded((a) => [...a, makeElement(kind, bench, id)]);
    setSelected(id);
  };

  const status = assembly.recognised
    ? (INSTRUMENT_LABEL[assembly.recognised] ?? assembly.recognised).toUpperCase()
    : undefined;

  return (
    <SimShell>
      <SimHeader
        title={arch.title.split('—')[0].trim()}
        subtitle={arch.summary}
        accent={LIGHT}
        badge={arch.targets ? <Pill tone="info">{arch.targets.replace(/_/g, ' ')}</Pill> : undefined}
      />

      {guided && (
        <StepBar
          accent={LIGHT}
          steps={steps.map((s, i) => ({ id: String(i), label: `${i + 1}` }))}
          currentId={String(Math.min(step, steps.length - 1))}
          onGo={(id) => setStep(Number(id))}
        />
      )}

      <div ref={stageRef} className={narrow ? 'flex flex-col gap-4' : 'grid gap-4'}
        style={narrow ? undefined : { gridTemplateColumns: '1.35fr 1fr' }}>
        <div className="flex flex-col gap-3">
          <BenchCanvas
            bench={bench}
            trace={trace}
            width={canvasW}
            height={stageH}
            layers={layers}
            status={status}
            selectedElementId={selected}
            onSelectElement={setSelected}
            onDragElement={(id, x) => setMoved((m) => ({ ...m, [id]: Math.round(x * 4) / 4 }))}
          />
          <Legend items={legend} />
          <TraceNotes notes={trace.warnings} />
        </div>

        <div className="flex flex-col gap-3">
          {/* ── The verdict, and the recogniser's working ── */}
          <Card accent={assembly.recognised ? OK : GLASS}>
            <div className={`${TYPE.badge} mb-1`} style={{ color: assembly.recognised ? OK : TEXT.muted }}>
              {assembly.recognised ? 'You have built' : 'Not an instrument yet'}
            </div>
            <div className="text-lg font-bold leading-snug mb-2" style={{ color: TEXT.primary }}>
              {assembly.recognised ? (INSTRUMENT_LABEL[assembly.recognised] ?? assembly.recognised) : 'Keep going'}
            </div>
            <ul className="flex flex-col gap-1.5">
              {assembly.evidence.map((e) => (
                <li key={e} className="text-sm leading-snug flex gap-2" style={{ color: TEXT.secondary }}>
                  <span style={{ color: GLASS }}>·</span>
                  <span><InlineMarkdown>{e}</InlineMarkdown></span>
                </li>
              ))}
            </ul>
          </Card>

          {assembly.nextStep && (
            <Card accent={LIGHT}>
              <div className={`${TYPE.badge} mb-1`} style={{ color: LIGHT }}>Next</div>
              <p className="text-sm leading-snug mb-2.5" style={{ color: TEXT.primary }}>
                <InlineMarkdown>{assembly.nextStep.because}</InlineMarkdown>
              </p>
              <ActionButton accent={LIGHT} onClick={() => addPrimitive(assembly.nextStep!.add)}>
                Add a {KIND_LABEL[assembly.nextStep.add] ?? assembly.nextStep.add} →{' '}
                {INSTRUMENT_LABEL[assembly.nextStep.becomes] ?? assembly.nextStep.becomes}
              </ActionButton>
            </Card>
          )}

          {assembly.nextTransform && (
            <Card>
              <div className={`${TYPE.badge} mb-1`} style={{ color: GLASS }}>Or change what is already there</div>
              <p className="text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>
                {assembly.nextTransform.change} → {INSTRUMENT_LABEL[assembly.nextTransform.becomes] ?? assembly.nextTransform.becomes}
              </p>
              <p className="text-sm leading-snug mt-1" style={{ color: TEXT.secondary }}>
                <InlineMarkdown>{assembly.nextTransform.because}</InlineMarkdown>
              </p>
            </Card>
          )}

          {guided && steps[Math.min(step, steps.length - 1)] && (
            <GuidedPanel
              step={step}
              total={steps.length}
              say={steps[Math.min(step, steps.length - 1)].say}
              cta={steps[Math.min(step, steps.length - 1)].cta}
              onNext={() => setStep((s) => Math.min(s + 1, steps.length))}
              onBack={() => setStep((s) => Math.max(0, s - 1))}
              done={step >= steps.length}
              accent={LIGHT}
            />
          )}

          {probeDue && probe && (
            <ProbeGate spec={probe} picked={probePick} onPick={setProbePick} accent={LIGHT} />
          )}

          {stageRows.length > 1 && <Readouts rows={stageRows} title="Stage by stage — this is why they multiply" />}
          <Readouts rows={rows} title="The numbers" />

          {/* ── The palette ── */}
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>Add a primitive</div>
            <div className="flex flex-wrap gap-2">
              {ASSEMBLER_PALETTE.map((p) => (
                <button
                  key={p.kind}
                  type="button"
                  onClick={() => addPrimitive(p.kind)}
                  title={p.blurb}
                  style={{
                    minHeight: 44, touchAction: 'manipulation',
                    background: 'rgba(125,211,252,0.08)',
                    border: `1px solid ${accentTint(GLASS, 0.3)}`,
                    color: GLASS,
                  }}
                  className="rounded-lg px-3 text-xs font-bold"
                >
                  + {p.label}
                </button>
              ))}
            </div>
            {selected && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs" style={{ color: TEXT.muted }}>
                  Selected: {bench.elements.find((e) => e.id === selected)?.label ?? selected} — drag it along the bench
                </span>
                <ActionButton
                  tone="ghost"
                  onClick={() => { setRemoved((r) => [...r, selected]); setSelected(null); }}
                >
                  Remove
                </ActionButton>
              </div>
            )}
          </Card>

          {/* ── The §6 arc ── */}
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
              Three primitives, eight instruments
            </div>
            <div className="flex flex-col gap-1">
              {ASSEMBLY_ARC.map((rung) => {
                const here = assembly.recognised === rung.id;
                const done = reached.current.has(rung.id);
                return (
                  <div key={rung.id} className="flex items-baseline gap-2 py-0.5">
                    <span
                      className="inline-block rounded-full shrink-0"
                      style={{
                        width: 7, height: 7, marginTop: 5,
                        background: here ? LIGHT : done ? OK : 'rgba(255,255,255,0.16)',   // sim-lint-ok — pass/fail pair
                      }}
                    />
                    <span className="text-xs font-semibold" style={{ color: here ? LIGHT : done ? TEXT.secondary : TEXT.muted }}>
                      {rung.label}
                    </span>
                    <span className="text-[11px]" style={{ color: TEXT.muted }}>{rung.oneLine}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {(arch.params?.length ?? 0) > 0 && (
            <Card>
              <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>Set the scene</div>
              <div className="flex flex-col gap-1">
                {(arch.params ?? []).map((p) => {
                  const value = params[p.key];
                  if (p.kind === 'select') {
                    return (
                      <div key={p.key} className="flex items-center gap-2 flex-wrap py-1" style={{ minHeight: 44 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: LIGHT, minWidth: 92 }}>{p.label}</span>
                        {(p.options ?? []).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setParams((q) => ({ ...q, [p.key]: opt }))}
                            style={{
                              minHeight: 44, touchAction: 'manipulation',
                              background: value === opt ? 'rgba(252,211,77,0.16)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${value === opt ? 'rgba(252,211,77,0.4)' : BORDER.card}`,
                              color: value === opt ? LIGHT : TEXT.secondary,
                            }}
                            className="rounded-lg px-3 text-xs font-semibold"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    );
                  }
                  if (p.kind === 'boolean') return null;
                  return (
                    <SimSlider
                      key={p.key}
                      label={p.label}
                      accent={LIGHT}
                      value={typeof value === 'number' ? value : Number(p.default)}
                      min={p.min ?? 0}
                      max={p.max ?? 100}
                      step={p.step ?? 1}
                      unit={p.unit ?? ''}
                      onChange={(v) => setParams((q) => ({ ...q, [p.key]: v }))}
                    />
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {block.caption && (
        <p className="mt-4 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{block.caption}</InlineMarkdown>
        </p>
      )}

      <ExpertTip accent={LIGHT}>
        A camera, an eye, a microscope, a telescope and a pair of binoculars are the same three
        primitives — a lens, a stop, and something at the image — rearranged. Nothing new is added at
        any rung; only the distances change, and once that is visible the instruments stop being five
        things to memorise.
      </ExpertTip>
    </SimShell>
  );
}
