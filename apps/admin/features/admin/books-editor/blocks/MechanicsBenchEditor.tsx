'use client';

// Faculty-facing authoring form for the `mechanics_bench` block — the E1
// sibling of VectorBoardEditor, and the same governance deliverable
// (PHYSICS_SIMULATION_PROGRAM.md §3): a physics teacher builds a complete FBD
// or pulley exercise here, with no code and no deploy. Output is JSON on the
// block, saved through the book-writer gateway. The live preview is the
// editor's split-pane, rendering the very same MechanicsBenchRenderer the
// student sees.
//
// ── WHY THERE IS NO FORM PER ARCHETYPE ──────────────────────────────────────
// The whole point of the engine-once/exercises-as-data design is that adding an
// archetype must not require touching this file. So the parameter inputs are
// GENERATED from `archetype.params` metadata (`kind: number | boolean | select`
// plus min/max/step/options/unit). A new archetype ships its own knobs and they
// appear here automatically. Hardcoding a form per archetype would quietly undo
// the architecture.
//
// Structure: pick an ARCHETYPE (which supplies the scene + step script), tune
// its PARAMS, write the TASK (fbd or pulley), then bolt on the gradable
// exercise layers — predict / numeric. Each layer is independent.
//
// NOTE ON NULLS: removing a layer or clearing a field sets it to `undefined` or
// deletes the key — never `null`. Block fields are Mixed-stored but
// Zod-validated with `.optional()`, which REJECTS null; writing null here is
// what makes a page fail to save with an opaque "Invalid input" error.

import { useMemo } from 'react';
import type { MechanicsBenchBlock, MechanicsMode } from '@canvas/data/types/books';
import {
  MECHANICS_ARCHETYPE_CATALOG,
  getMechanicsArchetype,
  type MechanicsArchetypeSummary,
} from '@canvas/book-renderer/mechanics-bench';

const input =
  'w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';
const ghostBtn =
  'px-2 py-1 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10';

const MODES: { value: MechanicsMode; label: string; hint: string }[] = [
  { value: 'fbd', label: 'FBD Studio — draw the free-body diagram', hint: 'Every arrow must name the object applying it.' },
  { value: 'pulley', label: 'Pulley Lab — predict, run, see the constraint', hint: 'The string-length ledger is where the equation comes from.' },
  { value: 'solve', label: 'FBD → Solve — draw it, then set up ΣF = ma', hint: 'Same studio as FBD, with the solve stage unlocked after a correct diagram.' },
  { value: 'energy', label: 'Energy — ledger, coaster, collisions, orbits', hint: 'KE / PE / heat as a live stacked bar; the total never moves.' },
  { value: 'rotation', label: 'Rotation — MoI racer, torque, rolling, angular momentum', hint: 'Mass distribution, not mass, decides who wins the race.' },
];

// Exhaustive over MechanicsMode on purpose: adding a mode to the union without
// a group here is a compile error, not a silently ungrouped picker row.
const MODE_GROUP: Record<MechanicsMode, string> = {
  fbd: 'FBD Studio',
  pulley: 'Pulley Lab',
  solve: 'Solve',
  energy: 'Energy & Collisions',
  rotation: 'Rotation',
};

interface Props {
  block: MechanicsBenchBlock;
  onChange: (p: Partial<MechanicsBenchBlock>) => void;
}

export default function MechanicsBenchEditor({ block, onChange }: Props) {
  const current = MECHANICS_ARCHETYPE_CATALOG.find((a) => a.id === block.archetype);
  const show = block.show ?? {};
  const params = block.params ?? {};

  // Body ids for the "which body?" pickers. The author's explicit scene wins;
  // otherwise we ask the archetype to build its scene. buildScene is pure, so
  // this is cheap — but it is other-agent code running on author input, so a
  // throw must degrade to a free-text field, never break the editor.
  const bodyIds = useMemo<string[]>(() => {
    if (block.scene?.bodies?.length) return block.scene.bodies.map((b) => b.id);
    const arch = getMechanicsArchetype(block.archetype);
    if (!arch) return [];
    try {
      return arch.buildScene(block.params).bodies.map((b) => b.id);
    } catch {
      return [];
    }
  }, [block.archetype, block.params, block.scene]);

  const groups = MECHANICS_ARCHETYPE_CATALOG.reduce<Record<string, MechanicsArchetypeSummary[]>>(
    (acc, a) => {
      const g = MODE_GROUP[a.mode] ?? 'Other';
      (acc[g] ??= []).push(a);
      return acc;
    },
    {}
  );

  const pickArchetype = (id: string) => {
    if (!id) {
      // Clear by omitting the key, never by writing null.
      onChange({ archetype: undefined, params: undefined });
      return;
    }
    const arch = MECHANICS_ARCHETYPE_CATALOG.find((a) => a.id === id);
    onChange({
      archetype: id,
      // Params belong to the archetype that declared them — carrying the old
      // ones across would silently feed one construction another's knobs.
      params: undefined,
      ...(arch ? { mode: arch.mode } : {}),
    });
  };

  const setParam = (key: string, value: number | string | boolean | undefined) => {
    const next = { ...params };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onChange({ params: Object.keys(next).length ? next : undefined });
  };

  const isFbdSide = block.mode === 'fbd' || block.mode === 'solve';

  return (
    <div className="flex flex-col gap-4">
      {/* ── Construction ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Construction</span>
        <select value={block.archetype || ''} onChange={(e) => pickArchetype(e.target.value)} className={input}>
          <option value="">— pick a construction —</option>
          {Object.entries(groups).map(([group, list]) => (
            <optgroup key={group} label={group}>
              {list.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {current && <p className="text-[11px] leading-snug text-white/45">{current.summary}</p>}

        <div>
          <span className={lbl}>Mode</span>
          <select
            className={input}
            value={block.mode}
            onChange={(e) => onChange({ mode: e.target.value as MechanicsMode })}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] leading-snug text-white/40">
            {MODES.find((m) => m.value === block.mode)?.hint}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Title</span>
            <input
              className={input}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value || undefined })}
              placeholder="The block on the incline"
            />
          </div>
          <div>
            <span className={lbl}>Height (px — blank = default)</span>
            <input
              type="number"
              className={input}
              value={block.height ?? ''}
              onChange={(e) =>
                onChange({ height: e.target.value === '' ? undefined : parseInt(e.target.value, 10) || undefined })
              }
              placeholder="440"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {(['grid', 'axes', 'components', 'readout', 'equations', 'values'] as const).map((k) => (
            <label key={k} className="flex items-center gap-1.5 text-[11px] text-white/60">
              <input
                type="checkbox"
                checked={show[k] ?? true}
                onChange={(e) => onChange({ show: { ...show, [k]: e.target.checked } })}
              />
              {k}
            </label>
          ))}
          {current?.stepped && (
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300/80">
              <input
                type="checkbox"
                checked={!!block.guided}
                onChange={(e) => onChange({ guided: e.target.checked || undefined })}
              />
              Guided ({current.stepCount} steps)
            </label>
          )}
        </div>
      </div>

      {/* ── Parameters (generated from the archetype's own metadata) ── */}
      {current && current.params.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Scene parameters</span>
            {block.params && (
              <button className={ghostBtn} onClick={() => onChange({ params: undefined })}>
                use defaults
              </button>
            )}
          </div>
          <ParamFields spec={current.params} values={params} onSet={setParam} />
        </div>
      )}

      {/* ── Guided step script ── */}
      {current?.stepped && block.guided && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Step script</span>
            {block.steps ? (
              <button className={ghostBtn} onClick={() => onChange({ steps: undefined })}>
                use defaults
              </button>
            ) : (
              <span className="text-[11px] text-white/35">using the built-in script</span>
            )}
          </div>
          <p className="text-[11px] leading-snug text-white/45">
            One entry per click. <b>Say</b> is what the student reads <i>before</i> the element appears — teach
            here, don&rsquo;t narrate. <b>Button</b> is the action label.
          </p>
          {(block.steps ?? []).map((st, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
              <span className={lbl}>Step {i + 1} — say</span>
              <textarea
                className={input}
                rows={2}
                value={st.say}
                onChange={(e) =>
                  onChange({ steps: (block.steps ?? []).map((x, k) => (k === i ? { ...x, say: e.target.value } : x)) })
                }
              />
              <span className={lbl}>Button label</span>
              <input
                className={input}
                value={st.cta}
                onChange={(e) =>
                  onChange({ steps: (block.steps ?? []).map((x, k) => (k === i ? { ...x, cta: e.target.value } : x)) })
                }
              />
            </div>
          ))}
          <button
            className={ghostBtn}
            onClick={() => onChange({ steps: [...(block.steps ?? []), { say: '', cta: 'Next' }] })}
          >
            + step
          </button>
        </div>
      )}

      {/* ── The task ── */}
      {isFbdSide && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>FBD task</span>
            <button
              className={ghostBtn}
              onClick={() =>
                block.fbd
                  ? onChange({ fbd: undefined })
                  : onChange({
                      fbd: { body: current?.defaultBody ?? bodyIds[0] ?? '', prompt: '' },
                    })
              }
            >
              {block.fbd ? 'remove' : 'add'}
            </button>
          </div>
          {!block.fbd && (
            <p className="text-[11px] text-white/35">
              No task — the bench renders the construction only. Add one to make it gradable.
            </p>
          )}
          {block.fbd && (
            <>
              <div>
                <span className={lbl}>Isolate which body?</span>
                <input
                  className={input}
                  list="mechanics-body-ids"
                  value={block.fbd.body}
                  placeholder={current?.defaultBody ?? 'm1'}
                  onChange={(e) => onChange({ fbd: { ...block.fbd!, body: e.target.value } })}
                />
                <datalist id="mechanics-body-ids">
                  {bodyIds.map((id) => (
                    <option key={id} value={id} />
                  ))}
                </datalist>
                {bodyIds.length > 0 && (
                  <p className="mt-1 text-[11px] text-white/35">In this scene: {bodyIds.join(', ')}</p>
                )}
              </div>
              <div>
                <span className={lbl}>Prompt</span>
                <textarea
                  className={input}
                  rows={2}
                  placeholder="Draw every force acting on the block — and name what applies each one."
                  value={block.fbd.prompt}
                  onChange={(e) => onChange({ fbd: { ...block.fbd!, prompt: e.target.value } })}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <input
                    type="checkbox"
                    checked={block.fbd.require_agent ?? true}
                    onChange={(e) => onChange({ fbd: { ...block.fbd!, require_agent: e.target.checked } })}
                  />
                  require the agent to be named
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <input
                    type="checkbox"
                    checked={!!block.fbd.allow_cut}
                    onChange={(e) => onChange({ fbd: { ...block.fbd!, allow_cut: e.target.checked || undefined } })}
                  />
                  enable the system-boundary cut tool
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <input
                    type="checkbox"
                    checked={!!block.fbd.then_solve}
                    onChange={(e) => onChange({ fbd: { ...block.fbd!, then_solve: e.target.checked || undefined } })}
                  />
                  reveal the solve step after a correct FBD
                </label>
              </div>
              <p className="text-[11px] leading-snug text-amber-300/60">
                Turning off &ldquo;require the agent&rdquo; removes the anti-ghost-force mechanism — a student can
                then draw a &ldquo;force of motion&rdquo; and be marked correct. Leave it on unless the exercise
                is a first, deliberately gentle introduction.
              </p>
              <div>
                <span className={lbl}>Success message</span>
                <input
                  className={input}
                  placeholder="Exactly. Three forces, three named agents, nothing invented."
                  value={block.fbd.success ?? ''}
                  onChange={(e) => onChange({ fbd: { ...block.fbd!, success: e.target.value || undefined } })}
                />
              </div>
            </>
          )}
        </div>
      )}

      {block.mode === 'pulley' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Pulley task</span>
            <button
              className={ghostBtn}
              onClick={() =>
                block.pulley ? onChange({ pulley: undefined }) : onChange({ pulley: { prompt: '' } })
              }
            >
              {block.pulley ? 'remove' : 'add'}
            </button>
          </div>
          {block.pulley && (
            <>
              <div>
                <span className={lbl}>Prompt</span>
                <textarea
                  className={input}
                  rows={2}
                  placeholder="Which mass accelerates faster — and by what factor?"
                  value={block.pulley.prompt}
                  onChange={(e) => onChange({ pulley: { ...block.pulley!, prompt: e.target.value } })}
                />
              </div>
              <div>
                <span className={lbl}>Predict the acceleration of which body? (blank = no prediction)</span>
                <input
                  className={input}
                  list="mechanics-body-ids"
                  value={block.pulley.predict_body ?? ''}
                  onChange={(e) =>
                    onChange({ pulley: { ...block.pulley!, predict_body: e.target.value || undefined } })
                  }
                />
                {bodyIds.length > 0 && (
                  <p className="mt-1 text-[11px] text-white/35">In this scene: {bodyIds.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <input
                    type="checkbox"
                    checked={block.pulley.show_constraint_ledger ?? true}
                    onChange={(e) =>
                      onChange({ pulley: { ...block.pulley!, show_constraint_ledger: e.target.checked } })
                    }
                  />
                  show the string-length ledger
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <input
                    type="checkbox"
                    checked={!!block.pulley.allow_extend}
                    onChange={(e) =>
                      onChange({ pulley: { ...block.pulley!, allow_extend: e.target.checked || undefined } })
                    }
                  />
                  let the student add a pulley/mass and re-solve
                </label>
              </div>
              <p className="text-[11px] leading-snug text-white/45">
                The ledger is the lesson — it is where the constraint equation comes from. Hide it only if a
                later exercise on the same page is meant to make the student derive it unaided.
              </p>
              <div>
                <span className={lbl}>Success message</span>
                <input
                  className={input}
                  value={block.pulley.success ?? ''}
                  onChange={(e) => onChange({ pulley: { ...block.pulley!, success: e.target.value || undefined } })}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Exercise layers ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Exercise layers</span>

        <LayerBox
          name="Predict first (gates the bench)"
          on={!!block.predict}
          add={() => onChange({ predict: { prompt: '', options: ['', ''] } })}
          remove={() => onChange({ predict: undefined })}
        >
          {block.predict && (
            <>
              <input
                className={input}
                placeholder="Which way does the block accelerate — and does the surface still push on it?"
                value={block.predict.prompt}
                onChange={(e) => onChange({ predict: { ...block.predict!, prompt: e.target.value } })}
              />
              {block.predict.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={input}
                    placeholder={`Option ${i + 1}`}
                    value={o}
                    onChange={(e) =>
                      onChange({
                        predict: {
                          ...block.predict!,
                          options: block.predict!.options.map((x, k) => (k === i ? e.target.value : x)),
                        },
                      })
                    }
                  />
                  <label className="flex shrink-0 items-center gap-1 text-[10px] text-white/50">
                    <input
                      type="radio"
                      checked={block.predict!.answer_index === i}
                      onChange={() => onChange({ predict: { ...block.predict!, answer_index: i } })}
                    />
                    correct
                  </label>
                </div>
              ))}
              <button
                className={ghostBtn}
                onClick={() => onChange({ predict: { ...block.predict!, options: [...block.predict!.options, ''] } })}
              >
                + option
              </button>
              <input
                className={input}
                placeholder="Reveal (shown after the guess)"
                value={block.predict.reveal ?? ''}
                onChange={(e) => onChange({ predict: { ...block.predict!, reveal: e.target.value || undefined } })}
              />
            </>
          )}
        </LayerBox>

        <LayerBox
          name="Numeric — type the answer"
          on={!!block.numeric}
          add={() => onChange({ numeric: { prompt: '', answer: 0, worked_reveal: '' } })}
          remove={() => onChange({ numeric: undefined })}
        >
          {block.numeric && (
            <>
              <input
                className={input}
                placeholder="What is the tension in the string?"
                value={block.numeric.prompt}
                onChange={(e) => onChange({ numeric: { ...block.numeric!, prompt: e.target.value } })}
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className={lbl}>Answer</span>
                  <input
                    type="number"
                    className={input}
                    value={block.numeric.answer}
                    onChange={(e) =>
                      onChange({ numeric: { ...block.numeric!, answer: parseFloat(e.target.value) || 0 } })
                    }
                  />
                </div>
                <div>
                  <span className={lbl}>Tolerance</span>
                  <input
                    type="number"
                    className={input}
                    placeholder="0.05"
                    value={block.numeric.tolerance ?? ''}
                    onChange={(e) =>
                      onChange({
                        numeric: {
                          ...block.numeric!,
                          tolerance: e.target.value === '' ? undefined : parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <span className={lbl}>Unit</span>
                  <input
                    className={input}
                    placeholder="N"
                    value={block.numeric.unit ?? ''}
                    onChange={(e) => onChange({ numeric: { ...block.numeric!, unit: e.target.value || undefined } })}
                  />
                </div>
              </div>
              <textarea
                className={input}
                rows={2}
                placeholder="Worked reveal — the full substitution, shown after they answer"
                value={block.numeric.worked_reveal}
                onChange={(e) => onChange({ numeric: { ...block.numeric!, worked_reveal: e.target.value } })}
              />
            </>
          )}
        </LayerBox>
      </div>

      <div>
        <span className={lbl}>Caption</span>
        <input
          className={input}
          value={block.caption ?? ''}
          onChange={(e) => onChange({ caption: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}

// ── Generated parameter inputs ───────────────────────────────────────────────
// One input per knob the archetype declares. Nothing here knows what any
// individual archetype is about — that is the point.

type ParamSpec = MechanicsArchetypeSummary['params'][number];

function ParamFields({
  spec,
  values,
  onSet,
}: {
  spec: ParamSpec[];
  values: Record<string, number | string | boolean>;
  onSet: (key: string, value: number | string | boolean | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {spec.map((p) => {
        const value = values[p.key] ?? p.default;
        const overridden = Object.prototype.hasOwnProperty.call(values, p.key);
        return (
          <div key={p.key} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div className="flex items-baseline justify-between">
              <span className={lbl}>
                {p.label}
                {p.unit ? ` (${p.unit})` : ''}
              </span>
              {overridden && (
                <button
                  className="text-[10px] text-white/35 hover:text-white/60"
                  onClick={() => onSet(p.key, undefined)}
                >
                  reset
                </button>
              )}
            </div>

            {p.kind === 'boolean' && (
              <label className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
                <input
                  type="checkbox"
                  checked={value === true}
                  onChange={(e) => onSet(p.key, e.target.checked)}
                />
                {value === true ? 'on' : 'off'}
              </label>
            )}

            {p.kind === 'select' && (
              <select
                className={input}
                value={String(value)}
                onChange={(e) => onSet(p.key, e.target.value)}
              >
                {(p.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}

            {p.kind === 'number' && (
              <>
                <input
                  type="number"
                  className={input}
                  min={p.min}
                  max={p.max}
                  step={p.step ?? 'any'}
                  value={typeof value === 'number' ? value : Number(value) || 0}
                  onChange={(e) => onSet(p.key, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
                {(p.min !== undefined || p.max !== undefined) && (
                  <p className="mt-0.5 text-[10px] text-white/30">
                    {p.min ?? '−∞'} … {p.max ?? '∞'}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LayerBox({
  name,
  on,
  add,
  remove,
  children,
}: {
  name: string;
  on: boolean;
  add: () => void;
  remove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 p-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/60">{name}</span>
        <button
          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
          onClick={on ? remove : add}
        >
          {on ? 'remove' : 'add'}
        </button>
      </div>
      {on && <div className="mt-2 flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}
