'use client';

/*
 * nuclear/ModesView.tsx — two rules decide every decay product.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * Students memorise four rules ("alpha: Z−2, A−4; beta-minus: Z+1, A same; …")
 * and then cannot apply them to an unfamiliar decay. The rules are not the
 * physics — they are CONSEQUENCES of two conservation laws, and on a
 * neutron-against-proton chart each one is a single arrow with a fixed direction:
 *
 *      alpha        ↙  two left, two down     (A−4, Z−2)
 *      beta-minus   ↖  one right, one down    (A same, Z+1)
 *      beta-plus    ↘  one left, one up       (A same, Z−1)
 *      gamma        •  nowhere at all         (A same, Z same)
 *
 * Seeing the four arrows on one chart replaces four rules with one picture, and
 * the picture is derivable: the student is asked where the daughter MUST land
 * given that charge and nucleon number both balance, before the arrow is drawn.
 *
 * ── fitView, and the trap it carries ────────────────────────────────────────
 * This is the one nuclear view whose axes share a unit — one nucleon across and
 * one nucleon up — so equal scaling on both axes is meaningful and `fitView` is
 * the right tool. It is passed EXPLICIT `maxScale` and `minScale`: the default
 * `maxScale: 400` is px per metre and would let a 3-nuclide chart zoom absurdly,
 * and the 1% quantisation ladder returns exactly ZERO for any scale below 0.005,
 * which is how a planetary-scale sim shipped a blank canvas. Dimensionless axes
 * of order 100 keep the scale around 1–5, comfortably inside the ladder.
 *
 * The canvas renders ZERO `<text>` elements.
 */

import * as React from 'react';
import {
  conservation, equation, labelOfTerm, qValue, reactionById, reactionsOfKind,
  type Reaction,
} from './lib/reactions';
import { NUCLIDES, neutronsOf, nuclide, pretty } from './lib/nuclides';
import {
  boxFor, Arrow, AttackCard, AXIS_STROKE, Canvas, Chip, GRID_STROKE, Marker, ACCENT_B,
} from './parts';
import { curveArrow } from './lib/view';
import { boundsOf, fitView, padBounds, worldToScreen } from '../../mechanics-bench/lib/svg';
import type { NuclearArchetype } from '../archetypes.nuclear';
import type { ResolvedNuclear } from './lib/scene';
import { ActionButton, Card, Legend, Readout, Toggle, PredictGate } from '../ui';
import { si, fixed } from '../lib/format';
import { ACCENT, TEXT, OK, BAD, SIM_CANVAS_BG, accentTint } from '../../simulations/_shared';
import { stageHeight } from '../useStageWidth';

/** One representative of each mode, so the chart can draw all four arrows. */
const REPRESENTATIVES = ['alpha-u238', 'beta-c14', 'beta-plus-na22', 'gamma-ni60'];

const DECAY_REACTIONS: Reaction[] = [
  ...reactionsOfKind('alpha'),
  ...reactionsOfKind('beta-minus'),
  ...reactionsOfKind('beta-plus'),
  ...reactionsOfKind('gamma'),
];

const MODE_WORD: Record<string, string> = {
  alpha: 'alpha — α',
  'beta-minus': 'beta-minus — β⁻',
  'beta-plus': 'beta-plus — β⁺',
  gamma: 'gamma — γ',
};

export default function ModesView({ resolved, arch, stageW, stacked }: {
  resolved: ResolvedNuclear;
  arch: NuclearArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const authored = typeof resolved.params.reaction === 'string'
    ? String(resolved.params.reaction) : 'alpha-u238';
  const [id, setId] = React.useState(authored);
  const [showAll, setShowAll] = React.useState(resolved.params.showAllArrows === true);
  /** The arrow is not drawn until the student has committed to where it goes. */
  const [drawn, setDrawn] = React.useState(false);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);

  const reaction = reactionById(id) ?? DECAY_REACTIONS[0];
  const cons = conservation(reaction);
  const q = qValue(reaction);

  const parent = nuclide(reaction.inputs[0].id);
  const daughterTerm = reaction.outputs.find((o) => o.id !== 'He-4' && o.id !== 'e-' && o.id !== 'e+'
    && o.id !== 'nu' && o.id !== 'nubar' && o.id !== 'gamma')
    ?? reaction.outputs[0];
  const daughter = nuclide(daughterTerm.id);

  // Chart neighbourhood: the parent, the daughter, and every tabulated nuclide
  // within a window around them — enough context that the arrow has somewhere to
  // point, few enough dots that it is not a starfield.
  const neighbourhood = React.useMemo(() => {
    const centreA = (parent.A + daughter.A) / 2;
    const span = showAll ? 240 : 26;
    return NUCLIDES.filter((n) => n.A >= 2 && Math.abs(n.A - centreA) <= span);
  }, [parent.A, daughter.A, showAll]);

  const w = Math.max(240, stageW || 320);
  const h = stageHeight(w, stacked ? 0.82 : 0.7, 400, 260);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  const arrows = showAll
    ? REPRESENTATIVES.map((r) => reactionById(r)).filter((r): r is Reaction => !!r)
    : drawn ? [reaction] : [];

  const shifted = {
    dZ: daughter.Z - parent.Z,
    dA: daughter.A - parent.A,
    dN: neutronsOf(daughter) - neutronsOf(parent),
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Predict BEFORE the arrow exists, and above the chart. */}
      {!drawn && !showAll && predictChoice === null && (
        <PredictGate
          prompt={
            `**${pretty(parent)} is about to decay by ${MODE_WORD[reaction.kind] ?? reaction.kind}.** `
            + 'Charge in must equal charge out and nucleons in must equal nucleons out. '
            + 'Where does the daughter land?'
          }
          options={[
            'Z drops by 2, A drops by 4',
            'Z rises by 1, A does not change',
            'Z drops by 1, A does not change',
            'Nothing changes — same Z, same A',
          ]}
          answerIndex={
            reaction.kind === 'alpha' ? 0
              : reaction.kind === 'beta-minus' ? 1
                : reaction.kind === 'beta-plus' ? 2 : 3
          }
          reveal={
            reaction.kind === 'gamma'
              ? 'Gamma changes no proton and no neutron — only the energy level. It is the one emission that is not a transmutation.'
              : `Nucleons: ${cons.nucleonsIn} in, ${cons.nucleonsOut} out. Charge: ${cons.chargeIn}e in, ${cons.chargeOut}e out. `
                + 'Both balance, and that alone forces the answer — there was never a rule to remember.'
          }
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      <div
        className="overflow-hidden rounded-2xl p-2"
        style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}
      >
        <Canvas box={box} label="Neutron number against proton number, with the decay arrows drawn on.">
          <NZChart box={box} nuclides={neighbourhood} arrows={arrows} focus={[parent.id, daughter.id]} />
        </Canvas>
      </div>

      <Legend rows={[
        { color: ACCENT, dot: true, label: 'a tabulated nuclide — across is protons, up is neutrons' },
        { color: ACCENT_B, dot: true, label: `the parent, ${pretty(parent)}` },
        ...(arrows.length ? [{ color: ACCENT_B, label: showAll ? 'one arrow per mode' : `the ${reaction.kind} arrow` }] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={ACCENT_B}
          disabled={drawn || (predictChoice === null && !showAll)}
          onClick={() => setDrawn(true)}
        >
          {drawn ? 'Arrow drawn' : 'Draw the arrow'}
        </ActionButton>
        <Toggle
          on={showAll}
          label="All four arrows at once"
          onClick={() => setShowAll((v) => !v)}
          accent={ACCENT_B}
        />
      </div>

      {(drawn || showAll) && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT_B }}>
            The two rules, checked
          </div>
          <div className="mt-1.5 flex flex-col gap-1">
            <RuleRow
              label="nucleon number A"
              left={`${cons.nucleonsIn}`}
              right={`${cons.nucleonsOut}`}
              ok={cons.nucleonsIn === cons.nucleonsOut}
            />
            <RuleRow
              label="charge, in units of e"
              left={`${cons.chargeIn}`}
              right={`${cons.chargeOut}`}
              ok={cons.chargeIn === cons.chargeOut}
            />
          </div>
          <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.primary }}>
            {reaction.kind === 'gamma'
              ? 'Both sides are identical, which is the point: gamma emission moves nowhere on this chart.'
              : `Z moved by ${shifted.dZ > 0 ? '+' : ''}${shifted.dZ} and A moved by ${shifted.dA > 0 ? '+' : ''}${shifted.dA}. `
                + 'Nothing else could have balanced both sums.'}
          </p>
        </Card>
      )}

      <Readout
        rows={[
          { label: 'the decay', value: equation(reaction), color: ACCENT },
          { label: 'mode', value: MODE_WORD[reaction.kind] ?? reaction.kind, color: ACCENT_B },
          { label: 'parent', value: `${pretty(parent)} — Z ${parent.Z}, N ${neutronsOf(parent)}` },
          {
            label: 'daughter',
            value: (drawn || showAll) ? `${pretty(daughter)} — Z ${daughter.Z}, N ${neutronsOf(daughter)}` : 'commit first',
            color: (drawn || showAll) ? ACCENT_B : TEXT.muted,
          },
          {
            label: 'energy released Q',
            value: (drawn || showAll) ? `${fixed(q.mev, 4)} MeV` : '—',
            color: ACCENT_B,
            strong: drawn || showAll,
          },
          { label: 'the same energy in joules', value: (drawn || showAll) ? si(q.joules, 'J') : '—' },
          { label: 'what the emitted particles are', value: reaction.outputs.slice(1).map(labelOfTerm).join(' + ') },
        ]}
        footnote={(drawn || showAll) ? q.method : 'The Q value stays hidden until the products are committed — it would give the answer away.'}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Another decay</span>
        <div className="flex flex-wrap gap-1.5">
          {DECAY_REACTIONS.map((r) => (
            <Chip
              key={r.id}
              label={`${pretty(nuclide(r.inputs[0].id))} ${r.kind === 'alpha' ? 'α' : r.kind === 'beta-minus' ? 'β⁻' : r.kind === 'beta-plus' ? 'β⁺' : 'γ'}`}
              colour={r.id === id ? ACCENT_B : ACCENT}
              dim={r.id !== id}
              onClick={() => { setId(r.id); setDrawn(false); setPredictChoice(null); }}
              title={r.headline}
            />
          ))}
        </div>
      </div>

      {(drawn || showAll) && <AttackCard code={arch.targets} />}

      {(drawn || showAll) && (
        <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
          {reaction.kind === 'beta-plus'
            ? 'Beta-plus is the only mode with a cost built in: two electron masses, 1.022 MeV, have to be paid before any energy is left over. That is why it is rarer than beta-minus, which has no threshold at all.'
            : reaction.kind === 'gamma'
              ? 'This energy is a measured level spacing (the 1332.5 keV transition in nickel-60), not a difference of ground-state masses — so it is the one Q on this bench that is looked up rather than derived.'
              : 'Alpha and beta-minus Q values need no electron bookkeeping: atomic masses carry equal numbers of electrons on both sides, so they cancel exactly.'}
        </p>
      )}
    </div>
  );
}

function RuleRow({ label, left, right, ok }: { label: string; left: string; right: string; ok: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[12px]" style={{ color: TEXT.secondary }}>{label}</span>
      <span className="text-[13px] font-semibold tabular-nums" style={{ color: ok ? OK : BAD }}>
        {/* sim-lint-ok — OK/BAD are the sanctioned pass/fail pair */}
        {left} {ok ? '=' : '≠'} {right}
      </span>
    </div>
  );
}

// ── The N–Z chart ────────────────────────────────────────────────────────────

function NZChart({ box, nuclides, arrows, focus }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  nuclides: { id: string; Z: number; A: number }[];
  arrows: Reaction[];
  focus: string[];
}) {
  const { x, y, w, h } = box.rect;

  const pts = nuclides.map((n) => ({ x: n.Z, y: n.A - n.Z }));
  const raw = boundsOf(pts);
  if (!raw) return null;
  const bounds = padBounds(raw, 3);

  // Dimensionless axes of order 10–150 → a scale of order 1–5, comfortably above
  // the 1% quantisation floor that returns 0. Explicit limits because the
  // defaults are calibrated for metres. See the file header.
  const view = fitView(bounds, w, h, { padFrac: 0.06, maxScale: 40, minScale: 0.15 });
  const to = (Z: number, N: number) => {
    const p = worldToScreen({ x: Z, y: N }, view);
    return { x: x + p.x, y: y + p.y };
  };

  const canvasMin = Math.min(box.width, box.height);
  const dot = Math.max(1.8, Math.min(3.6, canvasMin * 0.008));

  // The N = Z line — the reference every stability argument is made against.
  const zLo = Math.max(bounds.minX, bounds.minY);
  const zHi = Math.min(bounds.maxX, bounds.maxY);
  const a = to(zLo, zLo);
  const b = to(zHi, zHi);

  return (
    <g>
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={AXIS_STROKE} strokeWidth={1.2} />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={AXIS_STROKE} strokeWidth={1.2} />
      {zHi > zLo && (
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GRID_STROKE} strokeWidth={1.4} strokeDasharray="5 5" />
      )}

      {nuclides.map((n) => {
        const p = to(n.Z, n.A - n.Z);
        const isFocus = focus.includes(n.id);
        return (
          <circle
            key={n.id}
            cx={p.x}
            cy={p.y}
            r={isFocus ? dot * 2.1 : dot}
            fill={isFocus ? ACCENT_B : ACCENT}
            opacity={isFocus ? 1 : 0.7}
          />
        );
      })}

      {arrows.map((r) => {
        const parent = nuclide(r.inputs[0].id);
        const dTerm = r.outputs.find((o) => !['He-4', 'e-', 'e+', 'nu', 'nubar', 'gamma'].includes(o.id))
          ?? r.outputs[0];
        const child = nuclide(dTerm.id);
        const p1 = to(parent.Z, parent.A - parent.Z);
        const p2 = to(child.Z, child.A - child.Z);
        // Gamma goes nowhere: draw a ring instead of a zero-length arrow, which
        // would render as a stray triangle and read as a bug.
        if (parent.id === child.id) {
          return (
            <g key={r.id}>
              <Marker cx={p1.x} cy={p1.y} r={dot * 1.6} colour={ACCENT_B} />
              <circle cx={p1.x} cy={p1.y} r={dot * 4.2} fill="none" stroke={ACCENT_B} strokeWidth={1.6} strokeDasharray="3 3" />
            </g>
          );
        }
        const arr = curveArrow(p1.x, p1.y, p2.x, p2.y, canvasMin);
        return <Arrow key={r.id} {...arr} colour={ACCENT_B} width={2.2} />;
      })}
    </g>
  );
}
