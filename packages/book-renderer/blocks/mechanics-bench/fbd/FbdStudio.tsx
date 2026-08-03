'use client';

/*
 * fbd/FbdStudio.tsx — the flagship. §5.1 of PHYSICS_SIMULATION_PROGRAM.md.
 * ─────────────────────────────────────────────────────────────────────────────
 * Four stages, in the order a physicist actually works:
 *
 *   1. COMPOSE  the student builds the problem — bodies, a draggable incline,
 *               masses, μ, a push. Design law #1, and not optional.
 *   2. DRAW     one body lifts out into isolation; forces are placed from a
 *               labelled palette, each one asked "what object applies this?".
 *   3. GRADE    `gradeFbd` returns named misconceptions, rendered as questions.
 *               Hints appear only after a SECOND miss, and never say what.
 *   4. CUT      drag a boundary; internal third-law pairs cancel one at a time.
 *   5. SOLVE    choose the axes and watch the algebra rewrite itself.
 *
 * WHAT THIS FILE OWNS: stage routing, the scene's lifecycle, and calling the
 * engine. It computes no physics of its own — `lib/scene`, `lib/dynamics`,
 * `lib/grade` and `lib/cut` are the only sources of truth, and every one of them
 * is a pure function verifiable outside React.
 *
 * MEMO KEYS ARE PRIMITIVES, NEVER THE BLOCK OBJECT. The admin books-editor
 * autosaves on a debounce and recreates the block on every keystroke; an
 * identity-keyed memo re-seeds the scene continuously and eats the student's
 * work mid-gesture. (Learned the hard way on the Ch.0 build.)
 */

import React, { useEffect, useMemo, useState } from 'react';
import type { MechanicsBenchBlock } from '@canvas/data/types/books';
import type {
  Scene, Body, TrueForce, GradeResult, SolveResult, ReferenceFrame, Vec2,
} from '../types';

import { normalizeScene, trueForcesFor, bodyById } from '../lib/scene';
import { solveScene } from '../lib/dynamics';
import { gradeFbd } from '../lib/grade';

import { FBD_ARCHETYPES, FBD_FALLBACK } from '../archetypes.fbd';
import { sceneFromSpec, setFrame } from './sceneEdit';
import ComposeStage from './ComposeStage';
import DrawStage, { selectableBodies } from './DrawStage';
import type { FrameChoice } from './DrawStage';
import { toStudentForces } from './forces';
import type { DrawnForce } from './forces';
import CutStage from './CutStage';
import SolveStage from './SolveStage';
import { Card, ActionButton, GuidePanel } from './ui';
import { PRIMARY, TEXT } from './theme';
import {
  SimShell, SimHeader, StepBar, ExpertTip, TYPE,
} from '../../simulations/_shared';
import type { StepDef } from '../../simulations/_shared';

type Stage = 'compose' | 'draw' | 'cut' | 'solve';

const STAGE_LABEL: Record<Stage, string> = {
  compose: 'Build it',
  draw: 'Draw the forces',
  cut: 'Cut the system',
  solve: 'Do the algebra',
};

/** Engine calls are pure, but a student-composed scene can be degenerate. A
 *  thrown exception must never blank the page mid-lesson. */
function safe<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

/** Plain-English name for a frame, for the "where are you standing?" toggle. */
function frameLabel(f: ReferenceFrame): string {
  return f.kind === 'accelerating' ? 'Inside the lift'
    : f.kind === 'rotating' ? 'Spinning with it'
    : 'On the ground';
}

/** What changes about the physics when you stand there. Stated BEFORE the
 *  student draws, never as a correction afterwards. */
function frameBlurb(f: ReferenceFrame): string {
  switch (f.kind) {
    case 'accelerating':
      return 'You are riding along, so as far as you are concerned nothing is accelerating — '
        + 'and the forces you can name no longer add to zero on their own. One extra term has to appear.';
    case 'rotating':
      return 'You are turning with it, so the body is simply at rest in front of you. '
        + 'Everything must balance — which means an outward term is now compulsory, not an error.';
    default:
      return 'You are watching from the ground, where the body really is accelerating. '
        + 'Only real interactions count here: every arrow must have an object behind it.';
  }
}

export default function FbdStudio({ block }: { block: MechanicsBenchBlock }) {
  // ── Seed ───────────────────────────────────────────────────────────────────
  // Keyed on CONTENT, not identity — see the file header.
  const seedKey = useMemo(
    () => JSON.stringify({ a: block.archetype, p: block.params ?? null, s: block.scene ?? null }),
    [block.archetype, block.params, block.scene]
  );

  const archetype = FBD_ARCHETYPES[block.archetype ?? FBD_FALLBACK];

  const buildSeed = React.useCallback((): Scene | null => {
    const raw = block.scene
      ? sceneFromSpec(block.scene)
      : archetype
        ? archetype.buildScene(block.params)
        : null;
    return raw ? safe(() => normalizeScene(raw), raw) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  const [scene, setScene] = useState<Scene | null>(buildSeed);
  const [stage, setStage] = useState<Stage>('compose');
  const [bodyId, setBodyId] = useState<string>('');
  const [drawn, setDrawn] = useState<DrawnForce[]>([]);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [guideStep, setGuideStep] = useState(0);
  // Arrow LENGTHS are graded only when the student opts in (or the author asked
  // for values up front). See the toggle in DrawStage for why.
  const [checkSizes, setCheckSizes] = useState(!!block.show?.values);

  const resetAll = React.useCallback(() => {
    setScene(buildSeed());
    setStage('compose');
    setDrawn([]);
    setGrade(null);
    setAttempts(0);
    setGuideStep(0);
  }, [buildSeed]);

  useEffect(() => { resetAll(); }, [resetAll]);

  // ── Task config ────────────────────────────────────────────────────────────
  const task = block.fbd;
  const requireAgent = task?.require_agent ?? true;
  const allowCut = !!task?.allow_cut;
  const thenSolve = !!task?.then_solve;
  const show = block.show ?? {};
  // The scene stays editable UNLESS the author pinned it. An explicit `scene:`
  // means "this exact arrangement", and a `numeric:` answer stops being true the
  // moment a mass changes — either one locks composition. Everything else is the
  // student's to rearrange, which is design law #1.
  const editable = !block.scene && !block.numeric && block.params?.lock_scene !== true;

  // Pick the body to isolate: the task's, else the archetype's, else the first
  // one the student could sensibly isolate. Re-picked if the scene changes under
  // it (they may have deleted the body the exercise named).
  useEffect(() => {
    if (!scene) return;
    const wanted = task?.body ?? archetype?.defaultBody;
    const ok = (id?: string) => !!id && scene.bodies.some((b) => b.id === id);
    if (ok(bodyId)) return;
    const next = ok(wanted) ? wanted! : (selectableBodies(scene)[0]?.id ?? scene.bodies[0]?.id ?? '');
    setBodyId(next);
  }, [scene, bodyId, task?.body, archetype?.defaultBody]);

  const body: Body | undefined = useMemo(
    () => (scene && bodyId ? safe(() => bodyById(scene, bodyId), undefined) ?? scene.bodies.find((b) => b.id === bodyId) : undefined),
    [scene, bodyId]
  );

  const trueForces: TrueForce[] = useMemo(
    () => (scene && bodyId ? safe(() => trueForcesFor(scene, bodyId), []) : []),
    [scene, bodyId]
  );

  const solve: SolveResult | null = useMemo(
    () => (scene ? safe(() => solveScene(scene), null) : null),
    [scene]
  );

  // ── Reference frames ───────────────────────────────────────────────────────
  // `lift-accelerating` and `rotating-drum` are the two rungs whose entire
  // lesson is that the SAME scene has two different correct diagrams depending
  // on where the student is standing. Both declare a `frame` select param, and
  // params are author-only — so the instruction in the guide ("now switch the
  // frame and draw it again") named an action the UI could not perform, and
  // `setFrame` sat in sceneEdit.ts called from nowhere.
  //
  // The archetype is rebuilt once per option purely to READ the frame it
  // produces; only that frame is applied, via `setFrame`, so a student's own
  // edits to the bodies survive the switch.
  const frames: FrameChoice[] = useMemo(() => {
    const opts = archetype?.params?.find((p) => p.key === 'frame' && p.kind === 'select')?.options;
    if (!archetype || !opts || opts.length < 2) return [];
    const out: FrameChoice[] = [];
    for (const id of opts) {
      const f = safe(
        () => archetype.buildScene({ ...(block.params ?? {}), frame: id }).frame,
        undefined as ReferenceFrame | undefined
      );
      if (f) out.push({ id, label: frameLabel(f), frame: f, blurb: frameBlurb(f) });
    }
    return out.length > 1 ? out : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype, seedKey]);

  const frameId = useMemo(() => {
    const kind = scene?.frame?.kind ?? 'inertial';
    return frames.find((f) => f.frame.kind === kind)?.id ?? frames[0]?.id ?? '';
  }, [frames, scene]);

  /** Switching frames keeps the arrows and drops the verdict — deliberately.
   *  Pressing Check again and watching the diagram that just passed now fail is
   *  the entire lesson of the last two rungs. */
  const pickFrame = (id: string) => {
    const next = frames.find((f) => f.id === id);
    if (!next || !scene) return;
    setScene(safe(() => setFrame(scene, next.frame), scene));
  };

  /** The spin axis, if this scene has one in EITHER frame — an outward
   *  pseudo-force arrow is only recognisable as "centrifugal" relative to it,
   *  and in the ground frame the current scene no longer carries the centre. */
  const spinCentre: Vec2 | null = useMemo(() => {
    const rotating = [scene?.frame, ...frames.map((f) => f.frame)]
      .find((f) => f?.kind === 'rotating');
    return rotating && rotating.kind === 'rotating' ? rotating.centre : null;
  }, [scene, frames]);

  // ── Grading ────────────────────────────────────────────────────────────────
  const check = () => {
    if (!scene || !bodyId || !body) return;
    const result = safe(
      () => gradeFbd(scene, bodyId,
        toStudentForces(drawn, body, checkSizes, spinCentre), { requireAgent }),
      null as GradeResult | null
    );
    setGrade(result);
    setAttempts((a) => a + 1);
  };

  // A change to the scene invalidates a verdict about a diagram of that scene.
  useEffect(() => { setGrade(null); setAttempts(0); }, [scene]);
  // Changing which body is isolated starts a new diagram, not a continuation.
  useEffect(() => { setDrawn([]); setGrade(null); setAttempts(0); }, [bodyId]);

  // ── Stages ─────────────────────────────────────────────────────────────────
  const stages: Stage[] = ['compose', 'draw', ...(allowCut ? ['cut' as Stage] : []), ...(thenSolve ? ['solve' as Stage] : [])];
  const steps: StepDef[] = stages.map((s) => ({ id: s, label: STAGE_LABEL[s] }));
  const stageIndex = stages.indexOf(stage);
  const solveLocked = thenSolve && !grade?.correct;

  const guideScript = block.steps ?? archetype?.defaultSteps ?? [];
  const guide = guideScript[Math.min(guideStep, Math.max(0, guideScript.length - 1))];
  const guideDone = guideStep >= guideScript.length;

  if (!scene || !body) {
    return (
      <SimShell>
        <SimHeader title="FBD" accentWord="Studio" subtitle="Free-body diagram builder" />
        <Card>
          <p className="text-sm" style={{ color: TEXT.secondary }}>
            {block.archetype
              ? `Mechanics archetype “${block.archetype}” is not in the FBD library.`
              : 'This block has no scene and no archetype to build one from.'}
          </p>
        </Card>
      </SimShell>
    );
  }

  const goto = (s: Stage) => {
    if (s === 'solve' && solveLocked) return;
    setStage(s);
  };

  return (
    <SimShell>
      <SimHeader
        title={block.title ?? 'FBD'}
        accentWord={block.title ? undefined : 'Studio'}
        subtitle={archetype?.title ?? 'Free-body diagram builder'}
        badge={`${scene.bodies.length} bodies · ${scene.frame?.kind ?? 'inertial'} frame`}
      />

      <StepBar steps={steps} currentId={stage} onGo={(id) => goto(id as Stage)} accent={PRIMARY} />

      {/* The guided script. States what is about to happen BEFORE it happens —
          nothing is on screen that has not been explained. */}
      {guideScript.length > 0 && (block.guided ?? true) && (
        <div className="mb-4">
          <GuidePanel
            say={guideDone
              ? 'That is the whole construction. Change anything you like now and watch every force follow.'
              : guide?.say ?? ''}
            cta={guideDone ? undefined : guide?.cta}
            done={guideDone}
            onAdvance={() => setGuideStep((s) => s + 1)} />
        </div>
      )}

      {stage === 'compose' && (
        <ComposeStage scene={scene} editable={editable}
          focusBodyId={task?.body ?? archetype?.defaultBody}
          onChange={setScene} onReset={resetAll} />
      )}

      {stage === 'draw' && (
        <DrawStage
          scene={scene} body={body} drawn={drawn} onChange={setDrawn}
          requireAgent={requireAgent}
          bodies={selectableBodies(scene)} onPickBody={setBodyId}
          frames={frames} frameId={frameId} onPickFrame={pickFrame}
          grade={grade} attempts={attempts} trueForces={trueForces}
          onCheck={check} onReset={() => { setDrawn([]); setGrade(null); setAttempts(0); }}
          prompt={task?.prompt ?? `Draw every force acting on ${body.label ?? body.id} — and nothing else.`}
          successMessage={task?.success}
          showValues={!!show.values}
          checkSizes={checkSizes}
          onToggleSizes={() => { setCheckSizes((v) => !v); setGrade(null); }} />
      )}

      {stage === 'cut' && (
        <CutStage scene={scene} solve={solve}
          onDone={thenSolve && !solveLocked ? () => setStage('solve') : undefined} />
      )}

      {stage === 'solve' && !solveLocked && (
        <SolveStage scene={scene} body={body} forces={trueForces} solve={solve}
          numeric={block.numeric}
          showComponents={show.components} showEquations={show.equations} />
      )}

      {/* Stage navigation. Explicit, and never auto-advancing — the student
          decides when they are done with a stage. */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <ActionButton onClick={() => goto(stages[Math.max(0, stageIndex - 1)])}
          disabled={stageIndex === 0}>
          ← {STAGE_LABEL[stages[Math.max(0, stageIndex - 1)]]}
        </ActionButton>

        <div className="flex items-center gap-2">
          {stage === 'draw' && grade?.correct && (
            <span className="text-[11px]" style={{ color: TEXT.ghost }}>Diagram accepted</span>
          )}
          {stageIndex < stages.length - 1 && (
            <ActionButton
              onClick={() => goto(stages[stageIndex + 1])}
              disabled={stages[stageIndex + 1] === 'solve' && solveLocked}
              active
              title={stages[stageIndex + 1] === 'solve' && solveLocked
                ? 'Get the free-body diagram right first — algebra on a wrong diagram teaches the wrong lesson.'
                : undefined}>
              {STAGE_LABEL[stages[stageIndex + 1]]} →
            </ActionButton>
          )}
        </div>
      </div>

      {solveLocked && stage !== 'draw' && thenSolve && (
        <p className="mt-2 text-[11px] leading-snug" style={{ color: TEXT.muted }}>
          The algebra stage stays closed until the diagram is right. That is deliberate: a correct answer from
          a wrong diagram is the most expensive habit in this chapter.
        </p>
      )}

      {block.caption && (
        <p className={`mt-4 ${TYPE.body}`} style={{ color: TEXT.secondary }}>{block.caption}</p>
      )}

      <ExpertTip accent={PRIMARY}>
        Every arrow needs two names: what kind of force it is, and which object is applying it. If you cannot
        supply the second name, delete the arrow — you have invented it.
      </ExpertTip>
    </SimShell>
  );
}
