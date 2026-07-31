'use client';

// Faculty-facing authoring form for the `motion_lab` block — the E2 sibling of
// MechanicsBenchEditor and VectorBoardEditor, and the same governance
// deliverable (PHYSICS_SIMULATION_PROGRAM.md §3): a physics teacher builds a
// complete projectile or circular-motion exercise here, with no code and no
// deploy. Output is JSON on the block, saved through the book-writer gateway.
// The live preview is the editor's split-pane, rendering the very same
// MotionLabRenderer the student sees.
//
// ── WHY THERE IS NO FORM PER ARCHETYPE ──────────────────────────────────────
// The parameter inputs are GENERATED from `archetype.params` metadata
// (`kind: number | boolean | select` plus min/max/step/options/unit), so a new
// archetype ships its own knobs and they appear here automatically without this
// file changing. Hardcoding a form per archetype would undo the whole
// engine-once/exercises-as-data architecture.
//
// Structure: pick a SCENARIO + ARCHETYPE, tune its PARAMS, choose the
// synchronized STRIPS and FRAMES that carry the concept, then bolt on the
// gradable layers — predict / numeric.
//
// NOTE ON NULLS: removing a layer or clearing a field sets it to `undefined` or
// deletes the key — never `null`. Block fields are Mixed-stored but
// Zod-validated with `.optional()`, which REJECTS null; writing null here is
// what makes a page fail to save with an opaque "Invalid input" error.

import type { MotionBenchBlock, MotionScenario } from '@canvas/data/types/books';
import {
  MOTION_ARCHETYPE_CATALOG,
  type MotionArchetypeSummary,
} from '@canvas/book-renderer/motion-lab';

const input =
  'w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';
const ghostBtn =
  'px-2 py-1 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10';

const SCENARIOS: { value: MotionScenario; label: string; hint: string }[] = [
  { value: 'projectile', label: 'Projectile', hint: 'x and y are two independent 1-D movies playing side by side.' },
  { value: 'projectile-incline', label: 'Projectile on an incline', hint: 'Same integrator, tilted landing line.' },
  { value: 'monkey-hunter', label: 'Monkey & hunter', hint: 'Both fall at the same rate — so aim directly at it.' },
  { value: 'relative', label: 'Relative motion', hint: 'Velocity is frame-dependent; the "subtract the frame" move.' },
  { value: 'circular', label: 'Circular motion', hint: 'Centripetal force is a requirement, not a new force.' },
  { value: 'vertical-circle', label: 'Vertical circle', hint: 'The string goes slack, and the ball becomes a projectile.' },
  { value: 'banked-road', label: 'Banked road', hint: 'A safe speed band, not a single speed.' },
  { value: 'graphs', label: 'Motion graphs (not built yet)', hint: 'Motion Graph Studio has not shipped — the block renders a placeholder.' },
];

const SCENARIO_GROUP: Record<MotionScenario, string> = {
  projectile: 'Projectile Playground',
  'projectile-incline': 'Projectile Playground',
  'monkey-hunter': 'Projectile Playground',
  relative: 'Projectile Playground',
  circular: 'Circular Arena',
  'vertical-circle': 'Circular Arena',
  'banked-road': 'Circular Arena',
  graphs: 'Motion Graphs (not built yet)',
};

const STRIP_AXES = ['x', 'y', 'speed', 'vx', 'vy', 'ax', 'ay'] as const;
const STRIP_MODES = ['line', 'graph'] as const;
const FRAMES = ['ground', 'translating', 'accelerating', 'rotating'] as const;

type Strip = NonNullable<MotionBenchBlock['strips']>[number];

interface Props {
  block: MotionBenchBlock;
  onChange: (p: Partial<MotionBenchBlock>) => void;
}

export default function MotionLabEditor({ block, onChange }: Props) {
  const current = MOTION_ARCHETYPE_CATALOG.find((a) => a.id === block.archetype);
  const show = block.show ?? {};
  const params = block.params ?? {};
  const strips = block.strips ?? [];
  const frames = block.frames ?? [];

  const groups = MOTION_ARCHETYPE_CATALOG.reduce<Record<string, MotionArchetypeSummary[]>>((acc, a) => {
    const g = SCENARIO_GROUP[a.scenario] ?? 'Other';
    (acc[g] ??= []).push(a);
    return acc;
  }, {});

  const pickArchetype = (id: string) => {
    if (!id) {
      // Clear by omitting the key, never by writing null.
      onChange({ archetype: undefined, params: undefined });
      return;
    }
    const arch = MOTION_ARCHETYPE_CATALOG.find((a) => a.id === id);
    onChange({
      archetype: id,
      // Params belong to the archetype that declared them.
      params: undefined,
      ...(arch ? { scenario: arch.scenario } : {}),
    });
  };

  const setParam = (key: string, value: number | string | boolean | undefined) => {
    const next = { ...params };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onChange({ params: Object.keys(next).length ? next : undefined });
  };

  const setStrip = (i: number, patch: Partial<Strip>) =>
    onChange({ strips: strips.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  const toggleFrame = (f: (typeof FRAMES)[number], on: boolean) => {
    const next = on ? [...frames, f] : frames.filter((x) => x !== f);
    onChange({ frames: next.length ? next : undefined });
  };

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
        {current?.targets && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            Attacks the misconception <code>{current.targets}</code>.
          </p>
        )}

        <div>
          <span className={lbl}>Scenario</span>
          <select
            className={input}
            value={block.scenario}
            onChange={(e) => onChange({ scenario: e.target.value as MotionScenario })}
          >
            {SCENARIOS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] leading-snug text-white/40">
            {SCENARIOS.find((s) => s.value === block.scenario)?.hint}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Title</span>
            <input
              className={input}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value || undefined })}
              placeholder="Two movies at once"
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
              placeholder="460"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {(['grid', 'trail', 'vectors', 'components', 'readout', 'envelope'] as const).map((k) => (
            <label key={k} className="flex items-center gap-1.5 text-[11px] text-white/60">
              <input
                type="checkbox"
                checked={show[k] ?? true}
                onChange={(e) => onChange({ show: { ...show, [k]: e.target.checked } })}
              />
              {k}
            </label>
          ))}
          <label className="flex items-center gap-1.5 text-[11px] text-white/60">
            <input
              type="checkbox"
              checked={!!block.allow_release}
              onChange={(e) => onChange({ allow_release: e.target.checked || undefined })}
            />
            allow release (cut the string / leave the track)
          </label>
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
        {block.allow_release && (
          <p className="text-[11px] leading-snug text-white/45">
            On release the body is handed to the projectile integrator and keeps going — no reset. That handoff
            is the moment that kills &ldquo;it flies outward&rdquo;.
          </p>
        )}
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

      {/* ── Strips ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Synchronized strips</span>
          <div className="flex gap-1.5">
            <button
              className={ghostBtn}
              onClick={() => onChange({ strips: [...strips, { axis: 'x', label: 'Horizontal', mode: 'line' }] })}
            >
              + strip
            </button>
            {strips.length > 0 && (
              <button className={ghostBtn} onClick={() => onChange({ strips: undefined })}>
                use defaults
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] leading-snug text-white/45">
          Each strip is one 1-D view playing in lockstep beside the trajectory. An <b>x</b> strip (constant
          velocity) next to a <b>y</b> strip (free fall) <i>is</i> the independence of the components — that
          pairing is the lesson, not decoration.
        </p>
        {strips.length === 0 && (
          <p className="text-[11px] text-white/35">
            Using this construction&rsquo;s built-in strips. Add one to override them.
          </p>
        )}
        {strips.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.4fr_1fr_1fr_auto] items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div>
              <span className={lbl}>Axis</span>
              <select className={input} value={s.axis} onChange={(e) => setStrip(i, { axis: e.target.value as Strip['axis'] })}>
                {STRIP_AXES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={lbl}>Label</span>
              <input className={input} value={s.label} onChange={(e) => setStrip(i, { label: e.target.value })} />
            </div>
            <div>
              <span className={lbl}>Mode</span>
              <select className={input} value={s.mode} onChange={(e) => setStrip(i, { mode: e.target.value as Strip['mode'] })}>
                {STRIP_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={lbl}>Unit</span>
              <input
                className={input}
                value={s.unit ?? ''}
                placeholder="m"
                onChange={(e) => setStrip(i, { unit: e.target.value || undefined })}
              />
            </div>
            <button
              className="pb-1.5 text-[11px] text-red-400/70 hover:text-red-400"
              onClick={() => onChange({ strips: strips.filter((_, k) => k !== i) })}
            >
              remove
            </button>
          </div>
        ))}
      </div>

      {/* ── Frames ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Frames the student can switch to</span>
        <div className="flex flex-wrap items-center gap-3">
          {FRAMES.map((f) => (
            <label key={f} className="flex items-center gap-1.5 text-[11px] text-white/60">
              <input type="checkbox" checked={frames.includes(f)} onChange={(e) => toggleFrame(f, e.target.checked)} />
              {f}
            </label>
          ))}
        </div>
        <p className="text-[11px] leading-snug text-white/45">
          Offering <b>ground</b> plus one non-inertial frame is what makes centrifugal force appear and vanish on
          demand. Offer none and the block simply stays in the ground frame.
        </p>
      </div>

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

      {/* ── Exercise layers ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Exercise layers</span>

        <LayerBox
          name="Predict first (gates the lab)"
          on={!!block.predict}
          add={() => onChange({ predict: { prompt: '', options: ['', ''] } })}
          remove={() => onChange({ predict: undefined })}
        >
          {block.predict && (
            <>
              <input
                className={input}
                placeholder="The string snaps at the top. Which path does the ball take?"
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
              <p className="text-[11px] leading-snug text-amber-300/60">
                Make one wrong option the actual misconception — &ldquo;it flies straight outward&rdquo; — not an
                obviously silly path. A trap only teaches if it is tempting.
              </p>
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
                placeholder="What is the minimum speed at the top?"
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
                    placeholder="m s⁻¹"
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

type ParamSpec = MotionArchetypeSummary['params'][number];

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
                <input type="checkbox" checked={value === true} onChange={(e) => onSet(p.key, e.target.checked)} />
                {value === true ? 'on' : 'off'}
              </label>
            )}

            {p.kind === 'select' && (
              <select className={input} value={String(value)} onChange={(e) => onSet(p.key, e.target.value)}>
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
