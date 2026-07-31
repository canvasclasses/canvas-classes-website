'use client';

/*
 * circuit-bench/CircuitBench.tsx — the E3 bench.
 * ─────────────────────────────────────────────────────────────────────────────
 * The claim this component has to earn: a student who works through it can look
 * at an exam-style tangle and SEE the topology — which things share nodes and
 * which do not — instead of guessing from the drawing. Everything is arranged
 * around that one skill.
 *
 * Three faces, and none of them is decoration:
 *
 *  1. THE CIRCUIT — the authored drawing, solved. Node colour is potential,
 *     stroke width is current, and a branch carrying nothing has no flow stroke
 *     at all. Drag any node: the drawing changes and not one number moves, which
 *     is the first half of the lesson.
 *
 *  2. REDRAW — press once and the tangle morphs into canonical form with NOTHING
 *     combined: same circuit, same numbers, laid out by electrical distance from
 *     the probes. Then one merge per press, each with its reason printed beside
 *     it. When the network is a genuine bridge the reduction STOPS and says why,
 *     and hands the question to Kirchhoff.
 *
 *  3. BUILD — a palette, a board, and two taps to wire an element between two
 *     nodes. Draw it as badly as you like; Redraw always recovers the topology.
 *
 * Guided, never auto-playing (design law #5): the panel says what is about to
 * happen, the student clicks, exactly one thing appears. Predictions are
 * committed before any number is revealed, and a wrong one is answered with the
 * archetype's own named misconception (design law #2).
 */

import * as React from 'react';
import type { CircuitBenchBlock } from '@canvas/data/types/books';
import type {
  Circuit, CircuitComponent, CircuitIssue, ComponentKind, Vec2,
} from './types';
import {
  CIRCUIT_ARCHETYPES, CIRCUIT_PREDICTS, getCircuitArchetype,
} from './archetypes';
import { labelOf } from './lib/netlist';
import {
  prepareForResistance, probeResistance, solveCircuit,
} from './lib/solve';
import { foldTree, redraw } from './lib/redraw';
import { CIRCUIT_ISSUES, detectIssues } from './lib/misconceptions';
import { canonicalPositions, nodePositions, type Positions } from './lib/layout';
import { fmtOhm } from './lib/format';
import {
  ACCENT, ACCENT_2, BORDER, ExpertTip, SectionLabel, SimHeader, SimShell,
  SimSlider, SimTabs, TEXT, TYPE, accentTint,
} from '../simulations/_shared';
import CircuitCanvas from './ui/CircuitCanvas';
import AcBench, { isAcArchetype } from './ac/AcBench';
import SemiconductorBench, { isSemiconductorArchetype } from './semiconductor/SemiconductorBench';
import Readouts from './ui/Readouts';
import WorkingPanel from './ui/WorkingPanel';
import { GlyphChip } from './ui/glyphs';
import { isStacked, useStageWidth } from './useStageWidth';

// ── Two colours. That is the whole budget (workflow §3). ─────────────────────
const A1 = ACCENT;      // violet — the circuit itself, and the high end of the heatmap
const A2 = ACCENT_2;    // sky — what is happening NOW: current, highlights, the low end

type Bag = Record<string, number | string | boolean>;
type Tab = 'circuit' | 'redraw' | 'build';

const PALETTE: { kind: ComponentKind; label: string; value: number }[] = [
  { kind: 'resistor', label: 'Resistor', value: 6 },
  { kind: 'bulb', label: 'Bulb', value: 6 },
  { kind: 'wire', label: 'Wire', value: 0 },
  { kind: 'battery', label: 'Cell', value: 12 },
  { kind: 'switch', label: 'Switch', value: 0 },
  { kind: 'ammeter', label: 'Ammeter', value: 0 },
  { kind: 'voltmeter', label: 'Voltmeter', value: 0 },
];

const TWEEN_MS = 420;

export default function CircuitBench({ block }: { block: CircuitBenchBlock }) {
  // AC lives on the same block type — reactance, phasors, transients and
  // transformers are all circuits, and giving them a separate block would have
  // split one authoring surface in two for no gain. `circuit_bench` has no
  // `mode` field to switch on, so the archetype id is the discriminator, exactly
  // as MotionLab.tsx routes its three 'graphs' libraries. AC_ARCHETYPES ids are
  // asserted disjoint from CIRCUIT_ARCHETYPES by the Unit-11 verifier.
  if (isAcArchetype(block.archetype)) return <AcBench block={block} />;
  if (isSemiconductorArchetype(block.archetype)) return <SemiconductorBench block={block} />;

  // Everything derived from `block` is keyed on stable PRIMITIVES. The admin
  // editor autosaves on every keystroke and hands us a brand-new block object
  // each time; a memo keyed on `block` would rebuild the circuit, drop the
  // student's edits and reset their prediction on every character typed.
  const archetypeId = block.archetype ?? 'series-vs-parallel';
  const authorParamsKey = JSON.stringify(block.params ?? {});
  const authorNetlistKey = block.components?.length
    ? JSON.stringify({ n: block.nodes ?? [], c: block.components })
    : '';
  const authorProbesKey = JSON.stringify(block.probes ?? null);
  const guided = block.guided !== false;
  const wantRedraw = block.show?.redraw !== false;
  const wantHeatmap = block.show?.potentialHeatmap !== false;
  const wantCurrent = block.show?.currentWidth !== false;
  const wantValues = block.show?.values !== false;
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const numeric = block.numeric;
  const height = block.height;

  const archetype = getCircuitArchetype(archetypeId)
    ?? CIRCUIT_ARCHETYPES['series-vs-parallel'];

  // ── Student state ─────────────────────────────────────────────────────────
  const [overrides, setOverrides] = React.useState<Bag>({});
  const [edits, setEdits] = React.useState<Circuit | null>(null);
  const [tab, setTab] = React.useState<Tab>('circuit');
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [hoverNode, setHoverNode] = React.useState<string | null>(null);
  const [heatmap, setHeatmap] = React.useState(wantHeatmap);
  const [flow, setFlow] = React.useState(wantCurrent);
  const [tool, setTool] = React.useState<ComponentKind | null>(null);
  const [pending, setPending] = React.useState<string | null>(null);
  const [buildNote, setBuildNote] = React.useState<string | null>(null);
  const [numericDraft, setNumericDraft] = React.useState('');
  const [numericChecked, setNumericChecked] = React.useState(false);

  // ── The circuit ───────────────────────────────────────────────────────────
  const activeParams: Bag = React.useMemo(() => ({
    ...(JSON.parse(authorParamsKey) as Bag), ...overrides,
  }), [authorParamsKey, overrides]);

  const built: Circuit = React.useMemo(() => {
    if (authorNetlistKey) {
      const spec = JSON.parse(authorNetlistKey) as {
        n: { id: string; x?: number; y?: number; label?: string; ground?: boolean }[];
        c: (Omit<CircuitComponent, 'pos'> & { x?: number; y?: number })[];
      };
      return {
        nodes: spec.n.map((n) => ({
          id: n.id, label: n.label, ground: n.ground,
          pos: n.x != null && n.y != null ? { x: n.x, y: n.y } : undefined,
        })),
        components: spec.c.map((c) => ({
          ...c, pos: c.x != null && c.y != null ? { x: c.x, y: c.y } : undefined,
        })),
      };
    }
    return archetype.build(activeParams);
    // `archetype` is a module constant keyed by id — stable by construction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, activeParams, authorNetlistKey]);

  const circuit = edits ?? built;

  const probes: [string, string] = React.useMemo(() => {
    const authored = JSON.parse(authorProbesKey) as [string, string] | null;
    const ids = new Set(circuit.nodes.map((n) => n.id));
    const ok = (p: [string, string] | undefined | null) =>
      !!p && ids.has(p[0]) && ids.has(p[1]);
    if (ok(authored)) return authored as [string, string];
    if (ok(archetype.probes)) return archetype.probes as [string, string];
    const cell = circuit.components.find((c) => c.kind === 'battery');
    if (cell) return [cell.a, cell.b];
    const list = circuit.nodes.map((n) => n.id);
    return [list[0] ?? '', list[list.length - 1] ?? ''];
  }, [authorProbesKey, archetype, circuit]);

  const solution = React.useMemo(() => solveCircuit(circuit), [circuit]);
  const prep = React.useMemo(() => prepareForResistance(circuit, probes), [circuit, probes]);
  const result = React.useMemo(() => redraw(circuit, probes), [circuit, probes]);
  const nodal = React.useMemo(() => probeResistance(circuit, probes), [circuit, probes]);
  const tree = React.useMemo(() => foldTree(result.steps, prep.circuit), [result, prep]);
  const issues = React.useMemo(
    () => detectIssues(circuit, solution), [circuit, solution]);

  // ── Guided script ─────────────────────────────────────────────────────────
  const script = React.useMemo(() => {
    const authored = JSON.parse(stepsKey) as { say: string; cta: string }[] | null;
    return authored?.length ? authored : (archetype.defaultSteps ?? []);
  }, [stepsKey, archetype]);
  const step = script[Math.min(stage, script.length - 1)];
  const atEnd = stage >= script.length - 1;

  // ── Predict-first ─────────────────────────────────────────────────────────
  // ⚠ An AUTHORED `block.predict` belongs to CircuitBenchRenderer, which gates
  // the whole bench behind it and shows the verdict afterwards. Rendering it
  // here too would ask the same question twice on one page. So the bench only
  // ever shows its OWN archetype-level prediction — which is also the one wired
  // to the misconception feedback below.
  const predict = React.useMemo(() => {
    const authored = JSON.parse(predictKey) as { options?: string[] } | null;
    if (authored?.options?.length) return null;
    return CIRCUIT_PREDICTS[archetypeId] ?? null;
  }, [predictKey, archetypeId]);

  const needsPredict = guided && !!predict && choice === null;
  const wasWrong = predict?.answer_index != null && choice != null
    && choice !== predict.answer_index;
  const targetIssue: CircuitIssue | null = archetype.targets
    ? CIRCUIT_ISSUES[archetype.targets] : null;

  // ── The reveal ladder (design law #5) ─────────────────────────────────────
  // Nothing is on screen before it has been explained, and no number appears
  // before the student has committed a prediction. Level 0 is the drawing
  // alone; level 1 adds the potentials the heatmap is made of; level 2 adds
  // currents, p.d.s and power. Ungated when the author turns `guided` off.
  const level = needsPredict ? 0 : guided ? Math.min(stage, 2) : 2;
  const showPotentials = level >= 1 && !solution.singular;
  const showValues = wantValues && level >= 2;

  // ── Redraw animation ──────────────────────────────────────────────────────
  // `from`/`to` are PHASES: −1 the authored tangle, 0 the untangle (nothing
  // combined), 1..n after each step. `t` eases between them.
  const [anim, setAnim] = React.useState<{ from: number; to: number }>({ from: -1, to: -1 });
  const [t, setT] = React.useState(1);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || anim.from === anim.to) { setT(1); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / TWEEN_MS);
      setT(k < 1 ? 1 - (1 - k) ** 3 : 1);       // ease-out cubic
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setT(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anim]);

  const goPhase = (next: number) => setAnim((a) => ({ from: a.to, to: next }));
  React.useEffect(() => {
    // A new circuit invalidates the sequence — start again from the tangle.
    setAnim({ from: -1, to: -1 });
    setT(1);
  }, [circuit]);

  const frameOf = React.useCallback((phase: number): { circuit: Circuit; pos: Positions; canonical: boolean } => {
    if (phase < 0) return { circuit, pos: nodePositions(circuit), canonical: false };
    if (phase === 0) {
      return { circuit, pos: canonicalPositions(circuit, probes), canonical: true };
    }
    const after = result.steps[Math.min(phase, result.steps.length) - 1]?.after ?? circuit;
    return { circuit: after, pos: canonicalPositions(after, prep.probes), canonical: true };
  }, [circuit, probes, result, prep.probes]);

  const fromFrame = React.useMemo(() => frameOf(anim.from), [frameOf, anim.from]);
  const toFrame = React.useMemo(() => frameOf(anim.to), [frameOf, anim.to]);
  const lerped = React.useMemo(
    () => lerpPositions(fromFrame.pos, toFrame.pos, t, survivorMap(result.steps, anim)),
    [fromFrame.pos, toFrame.pos, t, result.steps, anim],
  );

  const phase = anim.to;
  const lastStep = phase > 0 ? result.steps[phase - 1] : null;
  const canStep = phase < result.steps.length;

  // ── Layout, measured — never a media query ────────────────────────────────
  const [stageRef, stageW] = useStageWidth<HTMLDivElement>();
  const stacked = isStacked(stageW);
  const [boardRef, boardW] = useStageWidth<HTMLDivElement>();

  // ── Build mode ────────────────────────────────────────────────────────────
  const fork = React.useCallback((mutate: (c: Circuit) => Circuit) => {
    setEdits((cur) => mutate(cur ?? clone(built)));
    setAnim({ from: -1, to: -1 });
  }, [built]);

  const addNode = (at: Vec2) => {
    if (tab !== 'build' || tool === null) return;
    fork((c) => {
      const id = nextId(c.nodes.map((n) => n.id), 'N');
      return { ...c, nodes: [...c.nodes, { id, pos: { x: Math.round(at.x), y: Math.round(at.y) } }] };
    });
    setBuildNote('New node added. Tap it, then tap another node, to wire the chosen element between them.');
  };

  const tapNode = (id: string) => {
    if (tab !== 'build') { setSelected(null); return; }
    if (!tool) { setPending(null); return; }
    if (!pending) {
      setPending(id);
      setBuildNote(`Now tap the other end for the ${tool}.`);
      return;
    }
    if (pending === id) { setPending(null); setBuildNote('Cancelled.'); return; }
    const spec = PALETTE.find((p) => p.kind === tool)!;
    fork((c) => ({
      ...c,
      components: [...c.components, {
        id: nextId(c.components.map((x) => x.id), prefixFor(tool)),
        label: nextId(c.components.map((x) => x.id), prefixFor(tool)),
        kind: tool, a: pending, b: id, value: spec.value,
      }],
    }));
    setPending(null);
    setBuildNote(`${spec.label} wired between ${pending} and ${id}. Draw it as badly as you like — Redraw always finds the topology.`);
  };

  const moveNode = (id: string, at: Vec2) => {
    fork((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === id
        ? { ...n, pos: { x: Math.round(at.x), y: Math.round(at.y) } } : n)),
    }));
  };

  const selectedComp = circuit.components.find((c) => c.id === selected) ?? null;

  // ── Hints (the ONE text on the board) ─────────────────────────────────────
  const hint = tab === 'redraw'
    ? phase < 0 ? 'As drawn — nothing has been combined'
      : phase === 0 ? 'Same circuit, redrawn by electrical distance'
        : `Step ${phase} of ${result.steps.length}`
    : tab === 'build'
      ? pending ? `From ${pending} — tap the other end`
        : tool ? `Tap two nodes to place a ${tool}, or empty space for a new node`
          : 'Pick an element, or drag a node'
      : needsPredict ? 'Predict first — nothing is solved yet'
        : solution.singular ? 'This circuit has no unique solution'
          : level < 1 ? 'Nothing has been calculated yet'
            : level < 2 ? 'Node potentials only — no currents yet'
              : 'Drag any node — the drawing moves, the numbers do not';

  const tabs = [
    { key: 'circuit', label: 'The circuit', sub: 'solved, as drawn' },
    ...(wantRedraw ? [{ key: 'redraw', label: 'Redraw', sub: 'watch the topology' }] : []),
    { key: 'build', label: 'Build', sub: 'wire your own' },
  ];

  const numericOk = numeric
    ? Math.abs(parseFloat(numericDraft) - numeric.answer) <= (numeric.tolerance ?? 0.05)
    : false;

  return (
    <SimShell>
      {/* The BLOCK's own title and caption belong to CircuitBenchRenderer —
          this header is the tool's identity, not the exercise's. */}
      <SimHeader
        title="Circuit"
        accentWord="Bench"
        subtitle="Series and parallel are about shared nodes, not about the drawing"
        badge={archetype.title}
        accent={A1}
      />

      <SimTabs tabs={tabs} active={tab} onChange={(k) => { setTab(k as Tab); setPending(null); }} accent={A1} />

      <div
        ref={stageRef}
        className={`grid grid-cols-1 gap-6 ${stacked ? '' : 'lg:grid-cols-[7fr_5fr]'}`}
      >
        {/* ── Board column ────────────────────────────────────────────── */}
        <div ref={boardRef} className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: `1px solid ${accentTint(A1, 0.2)}`,
            }}>
            <CircuitCanvas
              circuit={tab === 'redraw' ? toFrame.circuit : circuit}
              positions={tab === 'redraw' ? lerped : nodePositions(circuit)}
              solution={solution}
              probes={tab === 'redraw' && phase > 0 ? prep.probes : probes}
              accent={A1}
              accent2={A2}
              showHeatmap={heatmap && showPotentials}
              showCurrent={flow && showValues && tab !== 'redraw' && !solution.singular}
              hint={hint}
              highlightComponents={
                tab === 'redraw'
                  ? lastStep?.componentIds ?? []
                  : selected ? [selected] : []
              }
              highlightNodes={[
                ...(tab === 'redraw' ? (lastStep?.nodeIds ?? []) : []),
                ...(hoverNode ? [hoverNode] : []),
                ...(pending ? [pending] : []),
              ]}
              selectedId={selected}
              ghost={tab === 'redraw' && t < 1
                ? { circuit: fromFrame.circuit, positions: lerped, opacity: 1 - t } : null}
              ignoreAuthored={tab === 'redraw'}
              width={boardW}
              height={height}
              stable={tab !== 'redraw'}
              onPickComponent={tab === 'redraw' ? undefined : setSelected}
              onPickNode={tapNode}
              onDragNode={tab === 'redraw' ? undefined : moveNode}
              onPickEmpty={tab === 'build' ? addNode : undefined}
            />
          </div>

          {/* Board controls */}
          <div className="flex flex-wrap items-center gap-2">
            {tab === 'redraw' ? (
              <>
                <button
                  type="button"
                  onClick={() => goPhase(phase < 0 ? 0 : Math.min(result.steps.length, phase + 1))}
                  disabled={phase >= 0 && !canStep}
                  className="rounded-lg px-4 py-2 text-sm font-bold transition-all"
                  // A disabled button is still text a student reads. Dimming it
                  // with an opacity would drop it under the AA floor, so the
                  // "spent" state is a different COLOUR, at full opacity.
                  style={phase >= 0 && !canStep
                    ? {
                      background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}`,
                      color: TEXT.muted, minHeight: 44, cursor: 'default',
                    }
                    : {
                      background: accentTint(A2, 0.18), border: `1px solid ${accentTint(A2, 0.4)}`,
                      color: A2, minHeight: 44,
                    }}>
                  {phase < 0 ? 'Redraw it' : canStep ? 'Next step →' : 'Done'}
                </button>
                {phase >= 0 && (
                  <button type="button" onClick={() => goPhase(-1)}
                    className="rounded-lg px-4 py-2 text-sm font-bold"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${BORDER.card}`, color: TEXT.secondary, minHeight: 44,
                    }}>
                    ↺ Back to the tangle
                  </button>
                )}
              </>
            ) : (
              <>
                <Toggle on={heatmap} label="Potential heatmap" accent={A1}
                  onClick={() => setHeatmap((v) => !v)} />
                <Toggle on={flow} label="Current as width" accent={A2}
                  onClick={() => setFlow((v) => !v)} />
                {edits && (
                  <button type="button"
                    onClick={() => { setEdits(null); setBuildNote(null); setSelected(null); }}
                    className="rounded-lg px-4 py-2 text-sm font-bold"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${BORDER.card}`, color: TEXT.secondary, minHeight: 44,
                    }}>
                    ↺ Reset the circuit
                  </button>
                )}
              </>
            )}
          </div>

          {/* Build palette */}
          {tab === 'build' && (
            <div className="flex flex-col gap-2">
              <SectionLabel accent={A1}>Pick an element, then tap two nodes</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((p) => {
                  const on = tool === p.kind;
                  return (
                    <button key={p.kind} type="button"
                      onClick={() => { setTool(on ? null : p.kind); setPending(null); }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                      style={{
                        background: on ? accentTint(A2, 0.16) : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${on ? accentTint(A2, 0.45) : BORDER.card}`,
                        color: on ? A2 : TEXT.secondary, minHeight: 44,
                      }}>
                      <GlyphChip kind={p.kind} color={on ? A2 : A1} size={28} />
                      {p.label}
                    </button>
                  );
                })}
              </div>
              {buildNote && (
                <p className={TYPE.body} style={{ color: TEXT.ghost }}>{buildNote}</p>
              )}
              {selectedComp && (
                <div className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
                  <SectionLabel accent={A2}>{labelOf(selectedComp)}</SectionLabel>
                  {(selectedComp.kind === 'resistor' || selectedComp.kind === 'bulb'
                    || selectedComp.kind === 'battery') && (
                    <div className="mt-2">
                      <SimSlider
                        label={selectedComp.kind === 'battery' ? 'EMF' : 'Resistance'}
                        value={selectedComp.value}
                        min={selectedComp.kind === 'battery' ? 1 : 1}
                        max={selectedComp.kind === 'battery' ? 24 : 60}
                        step={1}
                        unit={selectedComp.kind === 'battery' ? 'V' : 'Ω'}
                        accent={A2}
                        onChange={(v) => fork((c) => ({
                          ...c,
                          components: c.components.map((x) => (x.id === selectedComp.id
                            ? { ...x, value: v } : x)),
                        }))} />
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedComp.kind === 'switch' && (
                      <button type="button"
                        onClick={() => fork((c) => ({
                          ...c,
                          components: c.components.map((x) => (x.id === selectedComp.id
                            ? { ...x, open: !x.open } : x)),
                        }))}
                        className="rounded-lg px-3 py-2 text-xs font-bold"
                        style={{
                          background: accentTint(A2, 0.14), border: `1px solid ${accentTint(A2, 0.35)}`,
                          color: A2, minHeight: 44,
                        }}>
                        {selectedComp.open ? 'Close it' : 'Open it'}
                      </button>
                    )}
                    <button type="button"
                      onClick={() => {
                        fork((c) => ({ ...c, components: c.components.filter((x) => x.id !== selectedComp.id) }));
                        setSelected(null);
                      }}
                      className="rounded-lg px-3 py-2 text-xs font-bold"
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}`,
                        color: TEXT.secondary, minHeight: 44,
                      }}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Author-tunable knobs, rendered straight off the archetype */}
          {tab === 'circuit' && !edits && (archetype.params?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-2 pt-1">
              <SectionLabel accent={TEXT.secondary}>Set the circuit</SectionLabel>
              {archetype.params!.map((p) => {
                if (p.kind === 'number') {
                  const v = typeof activeParams[p.key] === 'number'
                    ? (activeParams[p.key] as number) : (p.default as number);
                  return (
                    <SimSlider key={p.key} label={p.label} value={v}
                      min={p.min ?? 0} max={p.max ?? 10} step={p.step ?? 1}
                      unit={p.unit} accent={A1}
                      onChange={(nv) => { setOverrides((o) => ({ ...o, [p.key]: nv })); setNumericChecked(false); }} />
                  );
                }
                const current = activeParams[p.key] ?? p.default;
                const options = p.kind === 'boolean'
                  ? [{ v: false as const, l: 'No' }, { v: true as const, l: 'Yes' }]
                  : (p.options ?? []).map((o) => ({ v: o, l: o.replace(/-/g, ' ') }));
                return (
                  <div key={p.key} className="flex flex-wrap items-center gap-2">
                    <span style={{ minWidth: 88, fontSize: 12, fontWeight: 600, color: A1 }}>
                      {p.label}
                    </span>
                    {options.map((o) => {
                      const on = current === o.v;
                      return (
                        <button key={String(o.v)} type="button"
                          onClick={() => setOverrides((s) => ({ ...s, [p.key]: o.v }))}
                          className="rounded-lg px-3 py-2 text-xs font-semibold capitalize"
                          style={{
                            background: on ? accentTint(A1, 0.16) : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${on ? accentTint(A1, 0.42) : BORDER.card}`,
                            color: on ? A1 : TEXT.secondary, minHeight: 44,
                          }}>
                          {o.l}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Panel column ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {tab === 'redraw' ? (
            <>
              {phase === 0 && prep.notes.length > 0 && (
                <div className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
                  <SectionLabel accent={A1}>Before anything is combined</SectionLabel>
                  {prep.notes.map((n, i) => (
                    <p key={i} className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>{n}</p>
                  ))}
                </div>
              )}
              <WorkingPanel
                result={result}
                shown={Math.max(0, phase)}
                accent={A1}
                accent2={A2}
                tree={phase > 0 ? tree : []}
                nodalR={nodal.singular ? undefined : nodal.value}
                onPickStep={(i) => goPhase(i)}
              />
              {phase >= result.steps.length && result.fullyReduced && result.rEquivalent != null && (
                <div className="rounded-xl p-4"
                  style={{ background: accentTint(A2, 0.1), border: `1px solid ${accentTint(A2, 0.35)}` }}>
                  <SectionLabel accent={A2}>Between the probes</SectionLabel>
                  <p className="mt-1 text-2xl font-black tabular-nums" style={{ color: A2 }}>
                    {fmtOhm(result.rEquivalent)}
                  </p>
                  <p className={`${TYPE.body} mt-1`} style={{ color: TEXT.secondary }}>
                    Every step was a statement about which nodes were shared. Not one of them
                    was about where anything sat on the page.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Guided narration + the one CTA */}
              {guided && step && tab === 'circuit' && (
                <div>
                  <SectionLabel accent={A1}>
                    Step {Math.min(stage, script.length - 1) + 1} of {script.length}
                  </SectionLabel>
                  <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                    {step.say}
                  </p>
                  {/* The script cannot run ahead of the predict gate — the CTA
                      that would reveal the first number is not there until a
                      guess has been committed below. */}
                  {!atEnd && !needsPredict && (
                    <button type="button"
                      onClick={() => setStage((s) => Math.min(script.length - 1, s + 1))}
                      className="mt-3 rounded-lg px-5 py-2 text-sm font-bold transition-all"
                      style={{
                        background: accentTint(A1, 0.18), border: `1px solid ${accentTint(A1, 0.4)}`,
                        color: A1, minHeight: 44,
                      }}>
                      {step.cta} →
                    </button>
                  )}
                  {needsPredict && (
                    <p className="mt-2 text-xs" style={{ color: TEXT.ghost }}>
                      Commit a prediction below first.
                    </p>
                  )}
                </div>
              )}

              {/* Predict-first gate */}
              {predict && tab === 'circuit' && (
                <div className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
                  <SectionLabel accent={A1}>Predict first</SectionLabel>
                  <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.primary }}>
                    {predict.prompt}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {predict.options.map((o, i) => {
                      const picked = choice === i;
                      const right = predict.answer_index === i;
                      return (
                        <button key={i} type="button"
                          onClick={() => choice === null && setChoice(i)}
                          className="rounded-lg px-3 py-2 text-left text-sm transition-colors"
                          style={{
                            background: choice !== null && right
                              // sim-lint-ok — the OK/BAD pass-fail pair, §3 exception.
                              ? 'rgba(110,231,183,0.12)'
                              : picked ? 'rgba(252,165,165,0.12)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${choice !== null && right
                              // sim-lint-ok — the OK/BAD pass-fail pair, §3 exception.
                              ? 'rgba(110,231,183,0.4)'
                              : picked ? 'rgba(252,165,165,0.4)' : BORDER.card}`,
                            color: TEXT.primary, minHeight: 44,
                          }}>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                  {choice === null ? (
                    <p className="mt-3 text-xs" style={{ color: TEXT.ghost }}>
                      Commit before you look. A guess you cannot take back is worth ten you can.
                    </p>
                  ) : (
                    <div className="mt-3">
                      {wasWrong && targetIssue && (
                        <div className="mb-2 rounded-lg p-3"
                          style={{ background: accentTint(A2, 0.1), border: `1px solid ${accentTint(A2, 0.32)}` }}>
                          <p className={TYPE.body} style={{ color: TEXT.primary }}>
                            {targetIssue.message}
                          </p>
                          {targetIssue.hint && (
                            <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                              {targetIssue.hint}
                            </p>
                          )}
                        </div>
                      )}
                      {predict.reveal && (
                        <p className={TYPE.body} style={{ color: TEXT.secondary }}>{predict.reveal}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Readouts
                circuit={circuit}
                solution={solution}
                probes={probes}
                accent={A1}
                accent2={A2}
                showValues={showValues}
                showPotentials={showPotentials}
                selectedId={selected}
                onSelect={setSelected}
                onHoverNode={setHoverNode}
              />

              {showValues && !nodal.singular && Number.isFinite(nodal.value) && (
                <div className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
                  <SectionLabel accent={A2}>
                    Between {probes[0]} and {probes[1]}
                  </SectionLabel>
                  <p className="mt-1 text-xl font-black tabular-nums" style={{ color: A2 }}>
                    {fmtOhm(nodal.value)}
                  </p>
                </div>
              )}

              {/* Live misconception callouts — the codes this circuit is
                  currently a demonstration of, with its own numbers. */}
              {showValues && issues.length > 0 && (
                <div>
                  <SectionLabel accent={A1}>What this circuit is showing</SectionLabel>
                  <div className="mt-1.5 flex flex-col gap-2">
                    {issues
                      .slice()
                      .sort((x, y) => Number(y.code === archetype.targets) - Number(x.code === archetype.targets))
                      .slice(0, 3)
                      .map((iss) => (
                        <div key={iss.code} className="rounded-lg p-3"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${iss.code === archetype.targets
                              ? accentTint(A2, 0.35) : BORDER.card}`,
                          }}>
                          <p className={TYPE.body} style={{ color: TEXT.primary }}>{iss.message}</p>
                          {iss.code === archetype.targets && iss.hint && (
                            <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                              {iss.hint}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Numeric answer check */}
              {showValues && numeric && (
                <div className="pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
                  <SectionLabel accent={A1}>Your turn</SectionLabel>
                  <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                    {numeric.prompt}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={numericDraft}
                      onChange={(e) => { setNumericDraft(e.target.value); setNumericChecked(false); }}
                      inputMode="decimal"
                      aria-label={numeric.prompt}
                      className="tabular-nums rounded-lg px-3 py-2 text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}`,
                        color: TEXT.primary, width: 120, outline: 'none', minHeight: 44,
                      }}
                      placeholder="0.00" />
                    {numeric.unit && (
                      <span className="text-sm" style={{ color: TEXT.ghost }}>{numeric.unit}</span>
                    )}
                    <button type="button" onClick={() => setNumericChecked(true)}
                      className="rounded-lg px-4 py-2 text-sm font-bold"
                      style={{
                        background: accentTint(A1, 0.18), border: `1px solid ${accentTint(A1, 0.4)}`,
                        color: A1, minHeight: 44,
                      }}>
                      Check
                    </button>
                  </div>
                  {numericChecked && (
                    <p className={`${TYPE.body} mt-2`}
                      // sim-lint-ok — OK/BAD pass-fail pair, §3 exception.
                      style={{ color: numericOk ? '#6ee7b7' : '#fca5a5' }}>
                      {numericOk
                        ? 'That matches what the circuit solved to.'
                        : 'Not yet — check which element the question is asking about, and whether you used the total resistance or just one branch.'}
                    </p>
                  )}
                  {numericChecked && numericOk && numeric.worked_reveal && (
                    <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                      {numeric.worked_reveal}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {targetIssue && (
        <ExpertTip accent={A1}>{targetIssue.hint ?? targetIssue.message}</ExpertTip>
      )}
    </SimShell>
  );
}

// ── Small pieces ─────────────────────────────────────────────────────────────

function Toggle({ on, label, accent, onClick }:
{ on: boolean; label: string; accent: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
      style={{
        background: on ? accentTint(accent, 0.16) : 'rgba(255,255,255,0.03)',
        border: `1px solid ${on ? accentTint(accent, 0.42) : BORDER.card}`,
        color: on ? accent : TEXT.secondary, minHeight: 44,
      }}>
      {label}
    </button>
  );
}

const clone = (c: Circuit): Circuit => ({
  nodes: c.nodes.map((n) => ({ ...n, pos: n.pos ? { ...n.pos } : undefined })),
  components: c.components.map((x) => ({ ...x, pos: x.pos ? { ...x.pos } : undefined })),
});

function nextId(existing: string[], prefix: string): string {
  let i = 1;
  while (existing.includes(`${prefix}${i}`)) i++;
  return `${prefix}${i}`;
}

const prefixFor = (kind: ComponentKind) =>
  kind === 'resistor' ? 'R' : kind === 'bulb' ? 'L' : kind === 'battery' ? 'B'
    : kind === 'wire' ? 'w' : kind === 'switch' ? 'S' : kind === 'ammeter' ? 'A'
      : kind === 'voltmeter' ? 'V' : 'X';

/**
 * Node ids that vanished between two frames, mapped to the node that absorbed
 * them — so a merging node animates INTO its survivor rather than disappearing.
 */
function survivorMap(
  steps: { kind: string; nodeIds?: string[] }[], anim: { from: number; to: number },
): Record<string, string> {
  const out: Record<string, string> = {};
  const lo = Math.min(anim.from, anim.to);
  const hi = Math.max(anim.from, anim.to);
  for (let i = Math.max(0, lo); i < hi && i < steps.length; i++) {
    const ids = steps[i].nodeIds;
    if (ids && ids.length === 2) out[ids[1]] = ids[0];
  }
  return out;
}

function lerpPositions(
  from: Positions, to: Positions, t: number, survivors: Record<string, string>,
): Positions {
  const out: Positions = {};
  const target = (id: string): Vec2 | undefined => {
    let cur = id;
    for (let i = 0; i < 8; i++) {
      if (to[cur]) return to[cur];
      const next = survivors[cur];
      if (!next) return undefined;
      cur = next;
    }
    return undefined;
  };
  for (const id of new Set([...Object.keys(from), ...Object.keys(to)])) {
    const a = from[id];
    const b = target(id) ?? to[id];
    if (a && b) out[id] = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    else out[id] = (b ?? a)!;
  }
  return out;
}
