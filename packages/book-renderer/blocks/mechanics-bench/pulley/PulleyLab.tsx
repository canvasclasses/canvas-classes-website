'use client';

/*
 * pulley/PulleyLab.tsx — the E1 pulley tool.
 * ─────────────────────────────────────────────────────────────────────────────
 * The claim this component has to earn: a student who works through it can
 * WRITE a constraint equation for a pulley system they have never seen. Not
 * recall one — write one. Everything here is arranged around that.
 *
 * Three things make it possible, and none of them is a hardcoded case:
 *
 *  1. The scene is a GRAPH. `archetypes.pulley.ts` builds bodies, sheaves and
 *     rope paths; `deriveConstraints` walks the rope paths and returns the
 *     length-invariance equations; `solveScene` stacks those with ΣF = ma and
 *     solves the lot at once. Add a sheave and the equations change themselves.
 *     There is no `if (movablePulley) a1 = 2 * a2` anywhere in this directory.
 *
 *  2. The LEDGER makes the derivation visible. Each term in the equation is
 *     drawn with the same stroke style as the rope segments that produced it,
 *     and a coefficient of n is drawn as n mini-lines because n segments are
 *     bound to it. Drag a block and the segment lengths are re-measured off the
 *     moved diagram — some grow, some shrink, the total does not move. That
 *     last row is the constraint; the algebra above it is just the same
 *     sentence written down.
 *
 *  3. The LADDER adds one element at a time, and (with `allow_extend`) the
 *     student adds it themselves. Each rung is gated by a prediction they
 *     cannot take back, so being wrong is information rather than embarrassment.
 *
 * Guided, never auto-playing (design law #5): the panel says what is about to
 * happen, the student clicks, exactly one thing appears.
 *
 * ── §SURFACES — WHERE EACH RUNG'S `targets` CODE REACHES A STUDENT ───────────
 * `archetypes.pulley.ts` declares a `MisconceptionCode` on all nine rungs, and
 * its header closes by naming the danger: Phase 1 shipped 22 codes that were
 * declared and read by nothing. Pulley Lab has no free-body grader to put them
 * in, so they are wired to the four surfaces it does have. Every one is
 * predict-then-reveal, and `MisconceptionCard` renders nothing without evidence.
 *
 *   1. THE ADVANTAGE GATE — "how many lengths of rope are holding this?", then
 *      the "What you actually pull" panel. Present on EVERY rung, including
 *      rung 0, which is why it exists: the ladder verdict (surface 2) compares
 *      against the previous rung, so rung 0 could never produce one, and
 *      `fixed-pulley`'s `pulley_multiplies_force` was unreachable whenever it
 *      was the entry rung — i.e. by default. This gate needs no previous rung,
 *      so it is also the only surface a SINGLE-RUNG block has, and single-rung
 *      is what `allow_extend: false` (the default) produces.
 *   2. THE LADDER VERDICT — "does it accelerate faster, slower or the same than
 *      it did one rung ago?" Needs a previous rung whose watched body is the
 *      same body, so it is live on rungs 2, 3, 4, 6, 8 and 9 of the nine.
 *   3. THE TENSION GATE — "equal or different across the sheave?", ahead of the
 *      tensions readout and the ledger's τ = Iα rows. The only honest home for
 *      `tension_equal_across_any_pulley`, because both of those panels state the
 *      answer in prose.
 *   4. THE NUMERIC CHECK — a missed answer gets the rung's diagnostic instead of
 *      one generic sentence. On the accelerating-support rung that generic
 *      sentence WAS `accelerations_same_in_every_frame`, unnamed.
 *
 * NOT a surface: the ledger's `mismatches` list. It fires when the deriver's
 * segment count disagrees with the segments bindable on the canvas — an engine
 * or authoring bug, never a student action (`solveDisplacement` solves the
 * constraint, so a drag cannot violate it, and all nine rungs bind cleanly).
 * Tagging it with a belief code would file an engine bug as a student error,
 * which is the exact dishonesty `archetypes.pulley.ts` refused in Pass 1.
 */

import * as React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { MechanicsBenchBlock } from '@canvas/data/types/books';
import type { ConstraintEquation, Scene, SolveResult } from '../types';
import { normalizeScene } from '../lib/scene';
import { deriveConstraints } from '../lib/constraints';
import { solveScene } from '../lib/dynamics';
import { PULLEY_ARCHETYPES, PULLEY_LADDER, type PulleyRung } from '../archetypes.pulley';
import {
  ACCENT, ACCENT_2, BORDER, ExpertTip, SectionLabel, SimHeader, SimShell,
  SimSlider, SimTabs, StepBar, TEXT, TYPE, accentTint, fmt,
} from '../../simulations/_shared';
import PulleyCanvas from './PulleyCanvas';
import ConstraintLedger, { SegSwatch, type TorqueFact } from './ConstraintLedger';
import MisconceptionCard from './MisconceptionCard';
import Readouts from './Readouts';
import RealWorldTab from './RealWorldTab';
import { CANVAS_W, displaceScene, movableBodies, segmentsOf } from './geometry';
import { useStageWidth, STACK_WIDTH } from './useStageWidth';
import {
  NEUTRAL_STYLE, buildForceFacts, buildLedger, holdingCountOptionIndex,
  measureSegments, solveDisplacement, tensionsSplit,
  type ForceFacts, type LedgerModel, type SegmentDraw,
} from './ledger';

// ── Two colours. That is the entire budget (workflow §3). ────────────────────
const A1 = ACCENT;      // violet — the rope, its segments, their terms
const A2 = ACCENT_2;    // sky — motion: acceleration arrows and readouts

const STAGE_SCENE = 0;
const STAGE_LEDGER = 1;
const STAGE_SOLVE = 2;

type Verdict = 'faster' | 'slower' | 'same';
const PREDICT_OPTIONS: { key: Verdict; label: string }[] = [
  { key: 'faster', label: 'Faster' },
  { key: 'slower', label: 'Slower' },
  { key: 'same', label: 'Exactly the same' },
];

/**
 * Surface 1's options. Three, and the index of the true one comes from
 * `holdingCountOptionIndex` in `ledger.ts` — the same function
 * `verify-pulley-wiring.mjs` calls, so the verifier is checking the answer the
 * student is graded against rather than a second copy of the rule.
 */
const HOLD_OPTIONS = [
  'Just one length of rope',
  'Two lengths',
  'More than two',
];

/**
 * Surface 3's options. Option 0 IS `tension_equal_across_any_pulley`, stated the
 * way a student states it. Option 1 is the same answer with the assumption named
 * — and it is the TRUE one whenever the pulley mass is zero, which is what makes
 * this a question about an assumption rather than about a number.
 */
const TENSION_OPTIONS = [
  'Equal — a rope has one tension, always',
  'Equal, but only because a massless sheave needs no torque to spin up',
  'Different — the two sides must differ to spin the sheave up',
];

// ── A very small KaTeX wrapper for the ΣF = ma lines ─────────────────────────
function Tex({ src }: { src: string }) {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(src, { throwOnError: false, displayMode: false });
    } catch {
      return '';
    }
  }, [src]);
  if (!html) return <span style={{ color: TEXT.ghost }}>{src}</span>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// ── The three predict gates share one shape ──────────────────────────────────
// Three gates and three verdict chips, all identical in structure, is exactly
// the case the shared-utility rule is for. Keeping them as one component also
// keeps the promise consistent: every gate carries the same "you cannot take it
// back" line, because that line is the reason the gate works.

function Gate({ label, question, options, onCommit, accent }: {
  label: string;
  question: React.ReactNode;
  options: string[];
  onCommit: (index: number) => void;
  accent: string;
}) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
      <SectionLabel accent={accent}>{label}</SectionLabel>
      <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.primary }}>{question}</p>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((o, i) => (
          <button key={o} onClick={() => onCommit(i)}
            // 44 px minimum touch target — py-2.5 on text-sm clears it, and the
            // full-width row means a thumb cannot miss it on a phone.
            className="rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${BORDER.card}`, color: TEXT.primary,
              minHeight: 44,
            }}>
            {o}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs" style={{ color: TEXT.ghost }}>
        Commit before you look. A guess you cannot take back is worth ten you can.
      </p>
    </div>
  );
}

/** "You said X" + whether the sim agreed. `hit == null` means the sim had
 *  nothing to compare against, which is said out loud rather than left blank. */
function VerdictChip({ said, hit, note }: {
  said: string; hit: boolean | null; note: string;
}) {
  return (
    <div className="rounded-lg px-3 py-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
      <span className="text-sm" style={{ color: TEXT.ghost }}>You said: </span>
      <span className="text-sm font-semibold" style={{ color: TEXT.primary }}>{said}</span>
      {hit != null && (
        <span className="ml-2 rounded px-1.5 py-0.5 text-[11px] font-semibold"
          style={hit
            // sim-lint-ok — the OK/BAD pass-fail pair, §3 exception.
            ? { background: 'rgba(110,231,183,0.14)', color: '#6ee7b7' }
            : { background: 'rgba(252,165,165,0.14)', color: '#fca5a5' }}>
          {hit ? 'It did' : 'Not this time'}
        </span>
      )}
      <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>{note}</p>
    </div>
  );
}

/**
 * What the ladder verdict tells the student, including the case where it has
 * nothing to compare against.
 *
 * A null verdict used to render as an empty chip. It happens on the two rungs
 * where the watched body changes (`movable-pulley` starts watching the sheave,
 * `pulley-with-mass` goes back to watching m₁), and saying so is better than a
 * blank: the reason is real physics — those two runs are not comparable — and
 * both of those rungs carry their diagnosis on another surface anyway.
 */
function verdictNote(
  actual: Verdict | null, said: Verdict | undefined, bodyLabel: string,
): string {
  if (!actual) {
    return `There is no like-for-like run to compare against here — this rung `
      + `watches ${bodyLabel}, and the rung before it did not. Read it off the `
      + `numbers below instead.`;
  }
  const word = actual === 'same' ? 'came out exactly the same' : `got ${actual}`;
  return said === actual
    ? `It ${word}, exactly as you said.`
    : `It ${word}.`;
}

/** One row of the "What you actually pull" panel. */
function Fact({ label, value, unit, colour, swatch }: {
  label: React.ReactNode; value: string; unit?: string; colour: string;
  swatch?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2.5 py-1.5"
      style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
      {swatch}
      <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>{label}</span>
      <span className="tabular-nums text-sm font-semibold" style={{ color: colour }}>
        {value}
        {unit && <span style={{ color: TEXT.ghost, fontWeight: 500 }}> {unit}</span>}
      </span>
    </div>
  );
}

/**
 * Surface 1's reveal. Every number is a read: `n` off the deriver's coefficient,
 * the tension and the acceleration off the solve, the weight as m·g with the
 * scene's own g. Nothing about pulleys is computed here.
 */
function PullPanel({ facts, accent, accent2 }: {
  facts: ForceFacts; accent: string; accent2: string;
}) {
  const { n, weight, tension, accel, bodyLabel } = facts;
  const total = tension != null ? n * tension : null;
  const moving = accel != null && Math.abs(accel) > 1e-3;
  return (
    <div>
      <div className="mt-2 flex flex-col">
        <Fact colour={accent} value={String(n)}
          swatch={<SegSwatch style={facts.style} count={n} accent={accent} w={22} />}
          label={<>Lengths of rope holding <span style={{ color: TEXT.primary, fontWeight: 600 }}>{bodyLabel}</span></>} />
        <Fact colour={accent} value={fmt(1 / n, 2)} unit="m"
          label={<>Haul one metre of rope, and {bodyLabel} moves</>} />
        {weight != null && (
          <Fact colour={TEXT.primary} value={fmt(weight, 2)} unit="N"
            label={<>Its own weight, m·g</>} />
        )}
        {tension != null && (
          <Fact colour={accent} value={fmt(tension, 2)} unit="N"
            label={<>The pull in one length of rope, from the solve</>} />
        )}
        {total != null && n > 1 && (
          <Fact colour={accent} value={fmt(total, 2)} unit="N"
            label={<>All {n} lengths together</>} />
        )}
        {facts.movableSheave && accel != null && (
          <Fact colour={accent2} value={fmt(Math.abs(accel), 2)} unit="m s⁻²"
            label={<>{bodyLabel}&rsquo;s own acceleration</>} />
        )}
      </div>

      {/* Two voices, chosen by whether this body is something a person could be
          hauling. `weight == null` on a massless movable sheave (double Atwood):
          nobody's hands are on that rope, another body is driving it, so the
          hauling story would be a lie in the middle of a correction. */}
      <p className={`${TYPE.body} mt-2`} style={{ color: TEXT.secondary }}>
        {n === 1 && weight != null
          && `One length of rope, so that one rope carries all of it — and ${bodyLabel} moves exactly as far as the rope you haul. The sheave turned your pull around. It did not divide it.`}
        {n === 1 && weight == null
          && `One length of rope at ${bodyLabel}, so it moves exactly as far as the rope that pulls it. Nothing here divides anything: one segment shortens by whatever the other lengthens.`}
        {n > 1 && weight != null
          && `${n} lengths share it, so each carries a fraction — and ${bodyLabel} rises one metre only after ${n} metres of rope have gone through your hands. The force divides by ${n}; the distance multiplies by ${n}.`}
        {n > 1 && weight == null
          && `${n} lengths of rope run to ${bodyLabel}, so it moves only one ${n}th as far as the rope feeding it — and it does move. Its own acceleration is in the row above; a fixed point would have none.`}
      </p>

      {moving && weight != null && tension != null && (
        <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.ghost }}>
          Nothing here is standing still, so the rope is not merely holding{' '}
          {bodyLabel}: the gap between those last two figures is what accelerates
          it, and it comes to exactly m·a. Set the masses so the system balances
          and the two match to the last decimal.
        </p>
      )}
    </div>
  );
}

// ── Params ───────────────────────────────────────────────────────────────────
type ParamBag = Record<string, number | string | boolean>;

export default function PulleyLab({ block }: { block: MechanicsBenchBlock }) {
  // Everything derived from `block` is keyed on stable PRIMITIVES. The admin
  // editor autosaves on every keystroke and hands us a brand-new block object
  // each time; a memo keyed on `block` would rebuild the scene, reset the drag
  // and drop the student's prediction on every character typed.
  const authorArchetype = block.archetype ?? 'fixed-pulley';
  const authorParamsKey = JSON.stringify(block.params ?? {});
  const authorSceneKey = block.scene ? JSON.stringify(block.scene) : '';
  const allowExtend = !!block.pulley?.allow_extend;
  const showLedger = block.pulley?.show_constraint_ledger !== false;
  const predictBodyProp = block.pulley?.predict_body;
  const guided = block.guided !== false;
  const showEquations = !!block.show?.equations;
  const showReadout = block.show?.readout !== false;
  const height = block.height;

  // ── Ladder position ────────────────────────────────────────────────────────
  const ladder: PulleyRung[] = React.useMemo(() => {
    if (authorSceneKey) return [];                     // an explicit scene has no ladder
    if (!allowExtend) {
      const r = PULLEY_LADDER.find((x) => x.id === authorArchetype);
      return r ? [r] : [];
    }
    const start = Math.max(0, PULLEY_LADDER.findIndex((x) => x.id === authorArchetype));
    return PULLEY_LADDER.slice(start);
  }, [authorArchetype, allowExtend, authorSceneKey]);

  const [rung, setRung] = React.useState(0);
  const [reached, setReached] = React.useState(0);
  const [stage, setStage] = React.useState(guided ? STAGE_SCENE : STAGE_SOLVE);
  const [tab, setTab] = React.useState('lab');
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const [deltas, setDeltas] = React.useState<Record<string, number>>({});
  const [dragNote, setDragNote] = React.useState<string | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, ParamBag>>({});
  const [predictions, setPredictions] = React.useState<Record<string, Verdict>>({});
  // The verdict is frozen at the moment the student commits, not recomputed —
  // otherwise nudging a mass slider afterwards would silently rewrite what they
  // were told about their own prediction.
  const [verdicts, setVerdicts] = React.useState<Record<string, Verdict | null>>({});
  // Surfaces 1 and 3. Both keyed by rung id, both storing the OPTION INDEX the
  // student picked — and neither is ever cleared, including by `goToRung`.
  // A prediction you can walk back and re-take is not a prediction.
  const [holdSaid, setHoldSaid] = React.useState<Record<string, number>>({});
  const [tensionSaid, setTensionSaid] = React.useState<Record<string, number>>({});
  const [numericDraft, setNumericDraft] = React.useState('');
  const [numericChecked, setNumericChecked] = React.useState(false);

  // ── Layout, driven off the MEASURED stage, not the viewport ────────────────
  // A `lg:` variant asks the browser window how wide it is. Pulley Lab also
  // renders inside the admin books-editor's ~380 px split-pane preview and on a
  // 375 px phone stage, where a viewport query keeps two columns and squeezes
  // the diagram to nothing. Measuring the wrapper is the only thing that is
  // true in all three places.
  const [stageRef, stageW] = useStageWidth<HTMLDivElement>();
  const stacked = stageW > 0 && stageW < STACK_WIDTH;
  // The canvas COLUMN is measured separately rather than inferred from the
  // stage and the 7fr/5fr split — the split does not apply at every width, and
  // a guessed column width would size the touch targets wrongly exactly where
  // it matters. viewBox units per CSS pixel; drag handles are sized in viewBox
  // units, so without this a phone (where the 660-unit board renders into
  // ~330 px) gets every touch target at half the size it was designed at.
  const [canvasColRef, canvasW] = useStageWidth<HTMLDivElement>();
  const hitScale = canvasW > 0 ? Math.max(1, CANVAS_W / canvasW) : 1;

  const rungId = ladder[rung]?.id ?? authorArchetype;
  const archetype =
    PULLEY_ARCHETYPES[rungId]
    ?? PULLEY_ARCHETYPES[authorArchetype]
    ?? PULLEY_ARCHETYPES['fixed-pulley'];

  // Author params only apply to the rung the author chose; later rungs start
  // from their own defaults, which is what "add the next element" should mean.
  const paramsKey = React.useMemo(() => {
    const base = rungId === authorArchetype ? (JSON.parse(authorParamsKey) as ParamBag) : {};
    return JSON.stringify({ ...base, ...(overrides[rungId] ?? {}) });
  }, [rungId, authorArchetype, authorParamsKey, overrides]);

  const activeParams = React.useMemo(
    () => JSON.parse(paramsKey) as ParamBag, [paramsKey]);

  // ── The scene, the constraints, the solution ───────────────────────────────
  const baseScene: Scene = React.useMemo(() => {
    if (authorSceneKey && rungId === authorArchetype) {
      return normalizeScene(JSON.parse(authorSceneKey));
    }
    return archetype.buildScene(JSON.parse(paramsKey) as ParamBag);
    // `archetype` is a module constant keyed by rungId — stable by construction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rungId, paramsKey, authorSceneKey, authorArchetype]);

  const constraints: ConstraintEquation[] = React.useMemo(() => {
    try {
      return deriveConstraints(baseScene);
    } catch {
      return [];
    }
  }, [baseScene]);

  const solve: SolveResult | null = React.useMemo(() => {
    try {
      return solveScene(baseScene);
    } catch {
      return null;
    }
  }, [baseScene]);

  // ── The τ = Iα row, for a sheave that carries rotational inertia ───────────
  // This is a DYNAMICS row, so it is not in `deriveConstraints` (which only
  // walks rope length) and never will be — it lives on `solve.constraints`,
  // which is where `lib/dynamics` puts it. Reading it is the whole fix: the
  // engine has solved T₁ ≠ T₂ since 2026-07-29 and the rung built to break
  // "tension is the same across a pulley" was showing two numbers and no
  // reason. Every value below is read off the solve; nothing is recomputed.
  const torque: TorqueFact[] = React.useMemo(() => {
    if (!solve || solve.singular) return [];
    const out: TorqueFact[] = [];
    for (const row of solve.constraints) {
      if (!row.id.startsWith('torque_')) continue;
      const sheave = baseScene.bodies.find(
        (b) => (b.inertia ?? 0) > 0 && row.id.endsWith(`_${b.id}`));
      const link = (baseScene.strings ?? []).find((s) => row.id.startsWith(`torque_${s.id}_`));
      if (!sheave || !link) continue;
      const runs = Object.keys(solve.tensions)
        .filter((k) => k.startsWith(`${link.id}#`))
        .sort();
      if (runs.length < 2) continue;
      out.push({
        id: row.id,
        sheaveLabel: sheave.label ?? sheave.id,
        ropeLabel: link.label ?? link.id,
        t1: solve.tensions[runs[0]] ?? 0,
        t2: solve.tensions[runs[1]] ?? 0,
        radius: sheave.radius ?? 0,
        inertia: sheave.inertia ?? 0,
        derivation: row.derivation,
      });
    }
    return out;
  }, [solve, baseScene]);

  // ── Drag → displaced scene → measured segments ─────────────────────────────
  const dragged = Object.values(deltas).some((d) => Math.abs(d) > 1e-6);
  const shownScene = React.useMemo(
    () => displaceScene(baseScene, deltas), [baseScene, deltas]);

  const ledger: LedgerModel = React.useMemo(
    () => buildLedger(shownScene, constraints, segmentsOf(shownScene)),
    [shownScene, constraints]);

  const measured = React.useMemo(
    () => measureSegments(baseScene, deltas), [baseScene, deltas]);

  const stringLabels = React.useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of baseScene.strings ?? []) m[s.id] = s.label ?? s.id;
    return m;
  }, [baseScene]);

  const handleDrag = React.useCallback((bodyId: string, delta: number) => {
    const r = solveDisplacement(baseScene, constraints, bodyId, delta);
    setDeltas(r.deltas);
    setDragNote(r.reason ?? null);
  }, [baseScene, constraints]);

  // ── SURFACE 1: the advantage gate ──────────────────────────────────────────
  // Deliberately NOT conditioned on the rung index or on anything the author has
  // to switch on. It is the only surface a rung-0 or single-rung block gets, and
  // `allow_extend: false` (the default) makes every block single-rung.
  const holdFacts = React.useMemo(
    () => buildForceFacts(baseScene, ledger.groups, solve, archetype.defaultBody),
    // `archetype` is a module constant keyed by rungId — stable by construction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseScene, ledger.groups, solve, rungId]);
  const holdAnswer = holdFacts ? holdingCountOptionIndex(holdFacts.n) : -1;
  const holdChoice = holdSaid[rungId];
  // `guided === false` is the author saying "show it all at once", and the same
  // flag already decides the opening stage. A gate would contradict it — and a
  // card with no committed prediction behind it would break design law #5, so
  // an unguided block correctly shows no diagnostic at all.
  const holdNeeded = guided && holdFacts != null && holdChoice == null;

  // ── SURFACE 3: the tension gate ────────────────────────────────────────────
  // Keyed off the rung's own `targets`, not off the pulley's mass: at M = 0 the
  // honest answer is "equal, because the sheave is massless", and that answer is
  // the assumption being named. Asking only when M > 0 would hide the case that
  // makes it an assumption rather than a law.
  const tensionAsk = archetype.targets === 'tension_equal_across_any_pulley';
  const tensionAnswer = tensionsSplit(solve) ? 2 : 1;
  const tensionChoice = tensionSaid[rungId];
  const tensionNeeded = guided && tensionAsk && tensionChoice == null;

  // ── SURFACE 2: the ladder verdict, per rung ────────────────────────────────
  // The gate no longer needs `block.pulley.predict_body`. Line above already
  // falls back to the archetype's `defaultBody` for WHICH body; requiring the
  // author to set the prop as well meant the gate was off on every block ever
  // saved, and a gate nobody sees cannot carry a misconception anywhere.
  const predictBody = predictBodyProp ?? archetype.defaultBody ?? movableBodies(baseScene)[0]?.id;
  const predictNeeded = predictBody != null && rung > 0 && !predictions[rungId];
  // Records the rung INDEX as well as the body. A single "previous magnitude"
  // was silently producing no verdict at two rungs (the watched body changes at
  // `movable-pulley` and changes back at `pulley-with-mass`), and a plain
  // body→magnitude map would be worse: it would compare `pulley-with-mass`
  // against `incline-and-hanging` three rungs earlier and call that a result.
  // Only the immediately preceding rung, watching the same body, is comparable.
  const prevRunRef = React.useRef<{ rung: number; body: string; mag: number } | null>(null);

  const predictLabel = baseScene.bodies.find((b) => b.id === predictBody)?.label
    ?? predictBody ?? 'the load';

  const currentMag = predictBody != null && solve && !solve.singular
    ? Math.abs(solve.accelerations[predictBody] ?? 0) : null;

  const commitPrediction = (choice: Verdict) => {
    const prev = prevRunRef.current;
    const comparable = prev != null && prev.rung === rung - 1 && prev.body === predictBody;
    const actual: Verdict | null =
      !comparable || prev == null || currentMag == null
        ? null
        : Math.abs(currentMag - prev.mag) < 1e-3
          ? 'same'
          : currentMag > prev.mag ? 'faster' : 'slower';
    setPredictions((p) => ({ ...p, [rungId]: choice }));
    setVerdicts((v) => ({ ...v, [rungId]: actual }));
  };

  const actualVerdict = verdicts[rungId] ?? null;
  const revealSolve = stage >= STAGE_SOLVE && !holdNeeded && !predictNeeded;

  // Remember what this rung solved to, so the NEXT rung's prediction has
  // something to be measured against. Only once the student has actually seen
  // it — a comparison against a number they never saw is not a prediction.
  React.useEffect(() => {
    if (revealSolve && predictBody && currentMag != null) {
      prevRunRef.current = { rung, body: predictBody, mag: currentMag };
    }
  }, [revealSolve, predictBody, currentMag, rung]);

  // ── SURFACE 4: the numeric check ───────────────────────────────────────────
  // Declared up here rather than beside its markup because `cardEvidence` below
  // has to know whether the numeric answer was missed.
  const numeric = block.numeric;
  const numericOk = numeric
    ? Math.abs(parseFloat(numericDraft) - numeric.answer) <= (numeric.tolerance ?? 0.05)
    : false;
  const numericMissed = !!numeric && numericChecked && !numericOk;

  // ── The one gate every misconception card passes through ────────────────────
  // Design law #5, in one expression: a committed prediction on THIS rung, and a
  // solved system on screen behind it. `tensionNeeded` is in here because on the
  // massive-sheave rung the advantage gate resolves first — without this clause
  // the card would spell out the tension answer while the tension gate was still
  // open, which is the spoiler the gate exists to prevent.
  const committed = holdChoice != null || predictions[rungId] != null || tensionChoice != null;
  const cardEvidence = revealSolve && committed && !tensionNeeded;

  // ── Rung navigation ────────────────────────────────────────────────────────
  const goToRung = (i: number) => {
    setRung(i);
    setReached((r) => Math.max(r, i));
    setStage(guided ? STAGE_SCENE : STAGE_SOLVE);
    setDeltas({});
    setDragNote(null);
    setHighlight(null);
    setNumericDraft('');
    setNumericChecked(false);
    setDragNote(null);
  };

  const steps = archetype.defaultSteps ?? [];
  const step = steps[Math.min(stage, steps.length - 1)];
  const nextRung = ladder[rung + 1];

  // ── Canvas draws: before the ledger is revealed, the rope is anonymous ─────
  // The advantage gate asks the student to COUNT the lengths of rope, so it has
  // to sit in front of the ledger: the ledger prints the coefficient and draws it
  // as that many mini-lines, which is the answer. The rope itself stays on the
  // canvas throughout — counting it is the work, and the work is not a spoiler.
  const ledgerRevealed = stage >= STAGE_LEDGER && showLedger && !holdNeeded;
  const draggable = stage >= STAGE_LEDGER && !holdNeeded;

  const draws: SegmentDraw[] = React.useMemo(() => {
    if (ledgerRevealed) return ledger.draws;
    return segmentsOf(shownScene).map((seg) => ({
      seg, style: NEUTRAL_STYLE, groupKey: null, laneOffset: seg.lane * 5,
    }));
  }, [ledgerRevealed, ledger, shownScene]);

  const groupsForCanvas = ledgerRevealed ? ledger.groups : [];

  const hint = dragged
    ? 'Dragging — watch the segment lengths below'
    : draggable
      ? 'Drag any block'
      : holdNeeded
        ? 'Count the lengths of rope, then answer'
        : 'Nothing has been calculated yet';

  const tabs = [
    { key: 'lab', label: 'The lab', sub: 'Build it, derive it, solve it' },
    { key: 'real', label: 'Real world', sub: 'Five machines, one trade' },
  ];

  return (
    <SimShell>
      <SimHeader
        title={block.title ?? 'Pulley'}
        accentWord={block.title ? undefined : 'Lab'}
        subtitle="Where the constraint equation comes from"
        badge={ladder.length > 1 ? `Rung ${rung + 1} of ${ladder.length}` : archetype.title}
        accent={A1}
      />

      <SimTabs tabs={tabs} active={tab} onChange={setTab} accent={A1} />

      {tab === 'real' ? (
        <RealWorldTab accent={A1} />
      ) : (
        <>
          {ladder.length > 1 && (
            <StepBar
              steps={ladder.slice(0, reached + 1).map((r) => ({ id: r.id, label: r.short }))}
              currentId={rungId}
              onGo={(id) => goToRung(ladder.findIndex((r) => r.id === id))}
              accent={A1}
            />
          )}

          {block.pulley?.prompt && (
            <p className="mb-4 text-lg font-bold leading-snug text-white">
              {block.pulley.prompt}
            </p>
          )}

          <div
            ref={stageRef}
            className={`grid grid-cols-1 gap-6 ${stacked ? '' : 'lg:grid-cols-[7fr_5fr]'}`}
          >
            {/* ── Canvas column ───────────────────────────────────────────── */}
            <div ref={canvasColRef} className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-2xl"
                style={{
                  background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                  border: `1px solid ${accentTint(A1, 0.2)}`,
                  minHeight: height ? Math.max(260, height) : undefined,
                }}>
                <PulleyCanvas
                  baseScene={baseScene}
                  scene={shownScene}
                  draws={draws}
                  groups={groupsForCanvas}
                  accelerations={revealSolve && solve && !solve.singular ? solve.accelerations : null}
                  accent={A1}
                  accent2={A2}
                  hint={hint}
                  highlight={highlight}
                  onDrag={handleDrag}
                  onDragEnd={() => { /* the displacement stays put so it can be read */ }}
                  draggable={draggable}
                  hitScale={hitScale}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {dragged && (
                  <button onClick={() => { setDeltas({}); setDragNote(null); }}
                    className="rounded-lg px-4 py-2 text-sm font-bold transition-all"
                    style={{
                      background: accentTint(A1, 0.1),
                      border: `1px solid ${accentTint(A1, 0.3)}`, color: A1,
                    }}>
                    ↺ Put it back
                  </button>
                )}
                {dragNote && (
                  <span className="text-xs" style={{ color: TEXT.ghost }}>{dragNote}</span>
                )}
              </div>

              {/* Author-tunable knobs, rendered straight off the archetype. */}
              {(archetype.params?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <SectionLabel accent={TEXT.secondary}>Set the scene</SectionLabel>
                  {archetype.params!.filter((p) => p.kind === 'number').map((p) => {
                    const v = typeof activeParams[p.key] === 'number'
                      ? (activeParams[p.key] as number) : (p.default as number);
                    return (
                      <SimSlider key={p.key} label={p.label} value={v}
                        min={p.min ?? 0} max={p.max ?? 10} step={p.step ?? 1}
                        unit={p.unit} accent={A1}
                        onChange={(nv) => {
                          setOverrides((o) => ({
                            ...o, [rungId]: { ...(o[rungId] ?? {}), [p.key]: nv },
                          }));
                          setDeltas({});
                          setNumericChecked(false);
                        }} />
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Panel column ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5">
              {/* Guided narration + the one CTA */}
              {guided && step && (
                <div>
                  <SectionLabel accent={A1}>
                    Step {Math.min(stage, steps.length - 1) + 1} of {steps.length}
                  </SectionLabel>
                  <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                    {step.say}
                  </p>
                  {/* Hidden while a gate is open — "exactly one thing appears"
                      only holds if there is exactly one thing to press. */}
                  {stage < STAGE_SOLVE && !holdNeeded && (
                    <button onClick={() => setStage((s) => Math.min(STAGE_SOLVE, s + 1))}
                      className="mt-3 rounded-lg px-5 py-2 text-sm font-bold transition-all"
                      style={{
                        background: accentTint(A1, 0.18),
                        border: `1px solid ${accentTint(A1, 0.4)}`, color: A1,
                      }}>
                      {step.cta} →
                    </button>
                  )}
                </div>
              )}

              {/* ── SURFACE 1: the advantage gate, then what it actually buys ── */}
              {stage >= STAGE_LEDGER && holdNeeded && holdFacts && (
                <Gate label="Count it first" accent={A1}
                  options={HOLD_OPTIONS}
                  onCommit={(i) => setHoldSaid((s) => ({ ...s, [rungId]: i }))}
                  question={
                    <>
                      Count it off the diagram, before anything is derived. How
                      many separate lengths of rope are holding{' '}
                      {holdFacts.bodyLabel} up? That number is the whole of the
                      machine&rsquo;s advantage — there is nothing else in the rig
                      that can give you one.
                    </>
                  } />
              )}

              {stage >= STAGE_LEDGER && holdFacts && holdChoice != null && (
                <div>
                  <SectionLabel accent={A1}>What you actually pull</SectionLabel>
                  <div className="mt-2">
                    <VerdictChip
                      said={HOLD_OPTIONS[holdChoice]}
                      hit={holdChoice === holdAnswer}
                      note={holdChoice === holdAnswer
                        ? 'That is what the derivation counted too — and the coefficient in the equation below is the same number.'
                        : `The derivation counted ${holdFacts.n}. The coefficient in the equation below is that count, and the swatch beside it draws that many lines.`} />
                  </div>
                  <PullPanel facts={holdFacts} accent={A1} accent2={A2} />
                </div>
              )}

              {/* ── SURFACE 2: the ladder verdict ───────────────────────────── */}
              {stage >= STAGE_SOLVE && predictNeeded && (
                <Gate label="Predict first" accent={A1}
                  options={PREDICT_OPTIONS.map((o) => o.label)}
                  onCommit={(i) => commitPrediction(PREDICT_OPTIONS[i].key)}
                  question={
                    <>
                      You added {ladder[rung]?.added ?? 'a new element'}. Does{' '}
                      {baseScene.bodies.find((b) => b.id === predictBody)?.label ?? 'the load'}{' '}
                      now accelerate faster, slower, or exactly the same?
                    </>
                  } />
              )}

              {predictions[rungId] && stage >= STAGE_SOLVE && (
                <VerdictChip
                  said={PREDICT_OPTIONS.find((o) => o.key === predictions[rungId])?.label ?? ''}
                  hit={actualVerdict ? predictions[rungId] === actualVerdict : null}
                  note={verdictNote(actualVerdict, predictions[rungId], predictLabel)} />
              )}

              {/* THE LEDGER */}
              {ledgerRevealed && (
                <div>
                  <SectionLabel accent={A1}>The constraint</SectionLabel>
                  <div className="mt-2">
                    <ConstraintLedger
                      constraints={constraints}
                      groups={ledger.groups}
                      deltas={measured.rows}
                      totals={measured.totals}
                      stringLabels={stringLabels}
                      mismatches={ledger.mismatches}
                      dragged={dragged}
                      accent={A1}
                      highlight={highlight}
                      onHighlight={setHighlight}
                      // Only once the system has been solved — the torque story
                      // is made of tensions, and nothing is on screen before it
                      // has been explained.
                      // Only once the system has been solved AND — on the
                      // massive-sheave rung — the student has said which they
                      // expect. This section is titled "why the two tensions
                      // differ": it is the answer to surface 3's question.
                      torque={revealSolve && !tensionNeeded ? torque : []}
                    />
                  </div>
                </div>
              )}

              {/* Readouts */}
              {revealSolve && showReadout && (
                <div className="pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
                  <Readouts scene={baseScene} solve={solve} accent={A1} accent2={A2}
                    showTensions={!tensionNeeded} />
                </div>
              )}

              {/* ── SURFACE 3: the tension gate ─────────────────────────────── */}
              {revealSolve && tensionNeeded && (
                <Gate label="Predict first" accent={A1}
                  options={TENSION_OPTIONS}
                  onCommit={(i) => setTensionSaid((s) => ({ ...s, [rungId]: i }))}
                  question={
                    <>
                      The sheave itself has mass now, and mass has to be spun up.
                      Before you look at the tensions: what is the pull on the two
                      sides of it doing?
                    </>
                  } />
              )}

              {revealSolve && tensionAsk && tensionChoice != null && (
                <VerdictChip
                  said={TENSION_OPTIONS[tensionChoice]}
                  hit={tensionChoice === tensionAnswer}
                  note={tensionChoice === tensionAnswer
                    ? 'That is what the solve says — the two numbers above are the check.'
                    : `The solve says: ${TENSION_OPTIONS[tensionAnswer].toLowerCase()}. The two numbers above are the check.`} />
              )}

              {/* The ΣF = ma lines, if the author asked for them. Held back with
                  the tensions: one of these rows is (T₁ − T₂)·r = Iα, which
                  answers surface 3's question in symbols. */}
              {revealSolve && !tensionNeeded && showEquations && solve && solve.equations.length > 0 && (
                <div>
                  <SectionLabel accent={TEXT.secondary}>Written out</SectionLabel>
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {solve.equations.map((eq, i) => (
                      <div key={i} className="text-sm" style={{ color: TEXT.primary }}>
                        <Tex src={eq} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── THE DIAGNOSIS ──────────────────────────────────────────────
                  `archetype.targets` finally costs something. `cardEvidence`
                  carries the whole design-law-#5 contract (see its definition);
                  `MisconceptionCard` renders nothing without it.

                  `!numericMissed` is not a gate, it is de-duplication: a missed
                  numeric answer shows the SAME paragraph in the block below, and
                  the same six sentences twice on one screen reads as a bug. */}
              <MisconceptionCard
                code={archetype.targets}
                evidence={cardEvidence && !numericMissed}
                accent={A1}
                lead={`You have committed a prediction on this rung and the system has been solved. Here is the belief it was built to catch.`} />

              {/* Numeric answer check */}
              {revealSolve && numeric && (
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
                      className="tabular-nums rounded-lg px-3 py-2 text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${BORDER.card}`, color: TEXT.primary,
                        width: 120, outline: 'none',
                      }}
                      placeholder="0.00" />
                    {numeric.unit && (
                      <span className="text-sm" style={{ color: TEXT.ghost }}>{numeric.unit}</span>
                    )}
                    <button onClick={() => setNumericChecked(true)}
                      className="rounded-lg px-4 py-2 text-sm font-bold transition-all"
                      style={{
                        background: accentTint(A1, 0.18),
                        border: `1px solid ${accentTint(A1, 0.4)}`, color: A1,
                      }}>
                      Check
                    </button>
                  </div>
                  {numericChecked && (
                    <p className={`${TYPE.body} mt-2`}
                      // sim-lint-ok — OK/BAD pass-fail pair, §3 exception.
                      style={{ color: numericOk ? '#6ee7b7' : '#fca5a5' }}>
                      {numericOk ? 'That matches what the system solved to.' : 'Not yet — check which body the question is asking about, and which way you called positive.'}
                    </p>
                  )}
                  {numericChecked && numericOk && numeric.worked_reveal && (
                    <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                      {numeric.worked_reveal}
                    </p>
                  )}

                  {/* ── SURFACE 4 ──────────────────────────────────────────────
                      The line above is one generic sentence for all nine rungs.
                      On the accelerating-support rung that sentence — "check
                      which body, and which way you called positive" — IS
                      `accelerations_same_in_every_frame`, delivered without ever
                      naming it. This is where it gets named. */}
                  <div className="mt-3">
                    <MisconceptionCard
                      code={archetype.targets}
                      evidence={cardEvidence && numericMissed}
                      accent={A1}
                      lead="You typed an answer and the system has been solved. Before you re-derive it, check this — it is the belief this rung is built to catch, and it is the usual reason the number comes out close but not equal." />
                  </div>
                </div>
              )}

              {/* Climb the ladder */}
              {revealSolve && nextRung && allowExtend && (
                <div className="pt-1">
                  {block.pulley?.success && (
                    <p className={`${TYPE.body} mb-2`} style={{ color: TEXT.secondary }}>
                      {block.pulley.success}
                    </p>
                  )}
                  <button onClick={() => goToRung(rung + 1)}
                    className="w-full rounded-lg px-5 py-2.5 text-sm font-bold transition-all"
                    style={{
                      background: accentTint(A1, 0.18),
                      border: `1px solid ${accentTint(A1, 0.4)}`, color: A1,
                    }}>
                    Add {nextRung.added} →
                  </button>
                  <p className="mt-1.5 text-xs" style={{ color: TEXT.ghost }}>
                    Next: {nextRung.teaches}
                  </p>
                </div>
              )}
            </div>
          </div>

          {ladder[rung] && (
            <ExpertTip accent={A1}>{ladder[rung].teaches}</ExpertTip>
          )}
        </>
      )}

      {block.caption && (
        <p className={`${TYPE.body} mt-4`} style={{ color: TEXT.muted }}>
          {block.caption}
        </p>
      )}
    </SimShell>
  );
}
