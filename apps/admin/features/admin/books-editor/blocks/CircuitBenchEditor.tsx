'use client';

// Faculty-facing authoring form for the `circuit_bench` block — the E3 sibling
// of MechanicsBenchEditor / MotionLabEditor, and the same governance
// deliverable (PHYSICS_SIMULATION_PROGRAM.md §3): a physics teacher builds a
// complete network / meter / bridge exercise here, with no code and no deploy.
// Output is JSON on the block, saved through the book-writer gateway. The live
// preview is the editor's split-pane, rendering the very same
// CircuitBenchRenderer the student sees.
//
// ── WHY THERE IS NO FORM PER ARCHETYPE ──────────────────────────────────────
// The whole point of the engine-once/exercises-as-data design is that adding an
// archetype must not require touching this file. So the parameter inputs are
// GENERATED from `archetype.params` metadata (`kind: number | boolean | select`
// plus min/max/step/options/unit). A new archetype ships its own knobs and they
// appear here automatically. Hardcoding a form per archetype would quietly undo
// the architecture.
//
// Structure: pick an ARCHETYPE (which supplies the netlist + step script), tune
// its PARAMS, set the PROBES the redraw reduces between and what the bench
// SHOWS, then bolt on the gradable exercise layers — predict / numeric. Each
// layer is independent.
//
// NOTE ON NULLS: removing a layer or clearing a field sets it to `undefined` or
// deletes the key — never `null`. Block fields are Mixed-stored but
// Zod-validated with `.optional()`, which REJECTS null; writing null here is
// what makes a page fail to save with an opaque "Invalid input" error.

import { useMemo } from 'react';
import type { CircuitBenchBlock } from '@canvas/data/types/books';
import { CIRCUIT_ARCHETYPES } from '@canvas/book-renderer/circuit-bench';

const input =
  'w-full min-h-[44px] px-2.5 py-2 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';
const ghostBtn =
  'inline-flex min-h-[44px] items-center px-3 py-2 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10';
const chk = 'flex min-h-[44px] items-center gap-1.5 text-[11px] text-white/60';

// The bench's display switches. Every one defaults ON — the redraw in
// particular IS the reason the engine exists, so hiding it must be deliberate.
const SHOW_KEYS = ['redraw', 'potentialHeatmap', 'currentWidth', 'values', 'equations'] as const;

const SHOW_HINT: Record<(typeof SHOW_KEYS)[number], string> = {
  redraw: 'the topological regroup animation — the tangle becoming its canonical form',
  potentialHeatmap: 'colour nodes by potential, so equal-potential wires are visible',
  currentWidth: 'stroke width ∝ current, so a zero-current branch visibly stops',
  values: 'component values on the diagram',
  equations: 'the working panel',
};

// ── Topic grouping ───────────────────────────────────────────────────────────
// The archetype contract carries no topic field, so the dropdown groups by
// keyword over id + title. Ordered — first match wins, and the specific rules
// (a *meter* bridge is a bridge, not a meter) must come before the general
// ones. An archetype that ships its own `topic` string always wins over this.
const TOPIC_RULES: { group: string; test: RegExp }[] = [
  { group: 'Bridges & potentiometer', test: /wheatstone|bridge|potentiometer/ },
  { group: 'Meters & measurement', test: /ammeter|voltmeter|galvanometer|shunt|meter/ },
  { group: 'Capacitors & RC', test: /capacit|farad|\brc\b|charg|discharg/ },
  { group: 'Cells, EMF & internal resistance', test: /emf|cell|batter|internal|terminal/ },
  { group: 'Kirchhoff & loops', test: /kirchhoff|kvl|kcl|loop|junction|mesh|node/ },
  { group: 'Bulbs, power & heating', test: /bulb|lamp|power|watt|heating|bright/ },
  { group: 'Series & parallel networks', test: /series|parallel|combination|network|equivalent|ladder|cube|symmetr/ },
  { group: "Ohm's law & resistivity", test: /ohm|resistiv|conduct|drift|density/ },
  { group: 'Switches & short circuits', test: /switch|short|open/ },
];

function topicOf(a: ArchetypeCard): string {
  if (a.topic) return a.topic;
  const hay = `${a.id} ${a.title} ${a.summary ?? ''}`.toLowerCase();
  return TOPIC_RULES.find((r) => r.test.test(hay))?.group ?? 'Other constructions';
}

interface Props {
  block: CircuitBenchBlock;
  onChange: (p: Partial<CircuitBenchBlock>) => void;
}

export default function CircuitBenchEditor({ block, onChange }: Props) {
  const catalog = useMemo(() => toCatalog<ArchetypeCard>(CIRCUIT_ARCHETYPES), []);
  const current = catalog.find((a) => a.id === block.archetype);
  const show = block.show ?? {};
  const params = block.params ?? {};

  // Node ids for the probe pickers. The author's explicit netlist wins;
  // otherwise we ask the archetype to build its circuit. build() is pure, so
  // this is cheap — but it is other-agent code running on author input, so a
  // throw must degrade to a free-text field, never break the editor.
  const nodeIds = useMemo<string[]>(() => {
    if (block.nodes?.length) return block.nodes.map((n) => n.id);
    if (!current?.build) return [];
    try {
      return (current.build(block.params)?.nodes ?? []).map((n) => n.id);
    } catch {
      return [];
    }
  }, [current, block.nodes, block.params]);

  const groups = catalog.reduce<Record<string, ArchetypeCard[]>>((acc, a) => {
    (acc[topicOf(a)] ??= []).push(a);
    return acc;
  }, {});

  const pickArchetype = (id: string) => {
    if (!id) {
      // Clear by omitting the key, never by writing null.
      onChange({ archetype: undefined, params: undefined });
      return;
    }
    const arch = catalog.find((a) => a.id === id);
    onChange({
      archetype: id,
      // Params belong to the archetype that declared them — carrying the old
      // ones across would silently feed one construction another's knobs.
      params: undefined,
      // Same for probes: node ids are per-netlist, so a stale pair would point
      // at nodes this construction does not have.
      probes: arch?.probes ? [...arch.probes] : undefined,
    });
  };

  const setParam = (key: string, value: number | string | boolean | undefined) => {
    const next = { ...params };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onChange({ params: Object.keys(next).length ? next : undefined });
  };

  const setProbe = (i: 0 | 1, value: string) => {
    const pair: [string, string] = [block.probes?.[0] ?? '', block.probes?.[1] ?? ''];
    pair[i] = value;
    // A half-filled pair is not a probe — drop the key rather than storing ''.
    onChange({ probes: pair[0] && pair[1] ? pair : undefined });
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Title</span>
            <input
              className={input}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value || undefined })}
              placeholder="Same three resistors, two different networks"
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
          {SHOW_KEYS.map((k) => (
            <label key={k} className={chk} title={SHOW_HINT[k]}>
              <input
                type="checkbox"
                checked={show[k] ?? true}
                onChange={(e) => onChange({ show: { ...show, [k]: e.target.checked } })}
              />
              {k}
            </label>
          ))}
          {current && (
            <label className="flex min-h-[44px] items-center gap-1.5 text-[11px] font-semibold text-amber-300/80">
              <input
                type="checkbox"
                checked={!!block.guided}
                onChange={(e) => onChange({ guided: e.target.checked || undefined })}
              />
              Guided{current.defaultSteps?.length ? ` (${current.defaultSteps.length} steps)` : ''}
            </label>
          )}
        </div>
        {show.redraw === false && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            The redraw is off. Students cannot see topology through an exam-style tangle — turning this off hands
            them R<sub>eq</sub> without the regrouping that explains it.
          </p>
        )}
      </div>

      {/* ── Parameters (generated from the archetype's own metadata) ── */}
      {current && (current.params?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Circuit parameters</span>
            {block.params && (
              <button className={ghostBtn} onClick={() => onChange({ params: undefined })}>
                use defaults
              </button>
            )}
          </div>
          <ParamFields spec={current.params ?? []} values={params} onSet={setParam} />
        </div>
      )}

      {/* ── Probes ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Probes — where R&#8203;<sub>eq</sub> is measured</span>
          {block.probes && (
            <button className={ghostBtn} onClick={() => onChange({ probes: undefined })}>
              clear
            </button>
          )}
        </div>
        <p className="text-[11px] leading-snug text-white/45">
          The two nodes the reduction runs between. Leave both blank and the bench simply solves the circuit
          without asking for an equivalent resistance.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Node A</span>
            <input
              className={input}
              list="circuit-node-ids"
              value={block.probes?.[0] ?? ''}
              placeholder={current?.probes?.[0] ?? 'A'}
              onChange={(e) => setProbe(0, e.target.value)}
            />
          </div>
          <div>
            <span className={lbl}>Node B</span>
            <input
              className={input}
              list="circuit-node-ids"
              value={block.probes?.[1] ?? ''}
              placeholder={current?.probes?.[1] ?? 'B'}
              onChange={(e) => setProbe(1, e.target.value)}
            />
          </div>
        </div>
        <datalist id="circuit-node-ids">
          {nodeIds.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
        {nodeIds.length > 0 && <p className="text-[11px] text-white/35">In this circuit: {nodeIds.join(', ')}</p>}
      </div>

      {/* ── Guided step script ── */}
      {block.guided && (
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
            One entry per click. <b>Say</b> is what the student reads <i>before</i> the step runs — teach here,
            don&rsquo;t narrate (&ldquo;R2 and R3 share both ends — that is parallel&rdquo;, not &ldquo;now we
            merge them&rdquo;). <b>Button</b> is the action label.
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
          name="Predict first (gates the bench)"
          on={!!block.predict}
          add={() => onChange({ predict: { prompt: '', options: ['', ''] } })}
          remove={() => onChange({ predict: undefined })}
        >
          {block.predict && (
            <>
              <input
                className={input}
                placeholder="Add a second bulb in parallel. Does the first one get dimmer?"
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
                  <label className="flex min-h-[44px] shrink-0 items-center gap-1 text-[10px] text-white/50">
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
                Make one wrong option the actual misconception — &ldquo;the current gets used up by the first
                bulb&rdquo; — not an obviously silly answer. A trap only teaches if it is tempting.
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
                placeholder="What is the equivalent resistance between A and B?"
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
                    placeholder="Ω"
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

// ── Archetype catalogue shape ────────────────────────────────────────────────
// A structural mirror of `blocks/circuit-bench/types.ts` → `CircuitArchetype`,
// declared locally so this editor depends on the engine's DATA, not on which
// of its types the engine chooses to re-export through the package subpath.
// Only the fields the form actually consumes are listed.

type ParamSpec = {
  key: string;
  label: string;
  kind: 'number' | 'boolean' | 'select';
  default: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
};

type ArchetypeCard = {
  id: string;
  title: string;
  summary: string;
  /** Optional — the contract has no topic field today, so the dropdown falls
   *  back to keyword grouping. If the engine adds one, it wins. */
  topic?: string;
  params?: ParamSpec[];
  probes?: [string, string];
  defaultSteps?: { say: string; cta: string }[];
  targets?: string;
  build?: (p?: Record<string, number | string | boolean>) => { nodes?: { id: string }[] } | undefined;
};

/** The engine may publish its catalogue as an array or as an id-keyed map.
 *  Accept either — this editor only ever iterates it. */
function toCatalog<T>(src: unknown): T[] {
  if (Array.isArray(src)) return src as T[];
  if (src && typeof src === 'object') return Object.values(src as Record<string, T>);
  return [];
}

// ── Generated parameter inputs ───────────────────────────────────────────────
// One input per knob the archetype declares. Nothing here knows what any
// individual archetype is about — that is the point.

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
                  className="min-h-[44px] px-2 text-[10px] text-white/45 hover:text-white/70"
                  onClick={() => onSet(p.key, undefined)}
                >
                  reset
                </button>
              )}
            </div>

            {p.kind === 'boolean' && (
              <label className={chk}>
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
                  <p className="mt-0.5 text-[10px] text-white/45">
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
        <button className={ghostBtn} onClick={on ? remove : add}>
          {on ? 'remove' : 'add'}
        </button>
      </div>
      {on && <div className="mt-2 flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}
