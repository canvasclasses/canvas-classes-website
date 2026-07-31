/*
 * field-bench/archetypes.nuclear.ts — the Nuclear Bench archetype library.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Every `build()` runs in a plain node script.
 *
 * ═══ REPORTED, NOT FORCED: THIS LIBRARY NEEDS ONE NEW MODE ═══════════════════
 *
 * `FieldArchetype['mode']` does not contain `'nuclear'`, and neither does
 * `FieldBenchBlock['mode']`. A nucleus is none of the modes they do list, and its scene is not a `FieldScene` — there are no sources, no
 * field to sample and no test charge. The brief says to stop and report rather
 * than force a bad fit, so:
 *
 *   NEEDED (4 one-line additions, all purely additive, no behaviour changes):
 *     1. `packages/book-renderer/blocks/field-bench/types.ts`
 *        FieldArchetype['mode']  →  add `| 'nuclear'`
 *     2. `packages/data/types/books.ts`
 *        FieldBenchBlock['mode'] →  add `| 'nuclear'`
 *     3. `packages/data/books/schemas.ts`
 *        the matching Zod enum    →  add `'nuclear'`
 *     4. `packages/book-renderer/blocks/field-bench/FieldBench.tsx`
 *        `case 'nuclear': return <NuclearBench block={block} />;`
 *   and then, in `field-bench/archetypes.ts`, one more entry in the merge list.
 *
 * Until those land this library is complete, verified and unreachable from a
 * book page — exactly the state the Phase-1 engines shipped in. `NuclearArchetype`
 * is `FieldArchetype` with the two fields the frozen union cannot express
 * (`mode: 'nuclear'`, and a nuclear scene instead of a field scene) so the
 * eventual merge is a type alias collapsing, not a rewrite.
 *
 * ═══ SIX NUCLEAR MISCONCEPTION CODES, NAMED AND WIRED ═══════════════════════
 *
 * `FieldMisconception` originally had nine codes, all electrostatic / magnetic /
 * gravitational, and NOT ONE of them described a nuclear misconception. Rather
 * than force-fit one (the Phase-1 audit found 22 declared-but-dead codes, which is
 * the failure mode that restraint avoids), the six beliefs these archetypes attack
 * were NAMED and folded into the union:
 *
 *   bigger_nucleus_more_tightly_bound     total BE grows with size; BE/A decides
 *   mass_and_energy_are_separate          Δm IS the energy, at 931.494 MeV/u
 *   fission_energy_from_size_not_binding  "big things break", not "it moved up"
 *   fission_and_fusion_are_opposites      both climb the SAME curve
 *   half_life_is_half_the_lifetime        after 2 half-lives, a QUARTER remains
 *   nucleus_contains_electrons            β⁻ CREATES the electron
 *
 * The copy lives in `lib/misconceptions.ts` — ONE source of truth, and the
 * `Record<FieldMisconception, FieldIssue>` annotation there makes a code without
 * copy a compile error. `NuclearBench` resolves `targets` through `issueFor()` and
 * renders the card only once the student has SEEN the contradicting evidence; the
 * gate for each code is recorded beside its entry.
 *
 * ═══ WHAT EACH ARCHETYPE IS FOR ═════════════════════════════════════════════
 * The flagship is the shared axis. Fission and fusion are not opposites: both
 * move nucleons TOWARD the peak of the binding-energy-per-nucleon curve, and the
 * energy released is exactly the height climbed × the number of nucleons that
 * climbed it. `curveMove()` computes that product and it agrees with the Q value
 * from real masses to the last digit — so the student reads the energy OFF the
 * curve instead of being told it.
 */

import type { FieldArchetype, FieldMisconception } from './types';
import { num, str, bool, type ParamBag } from './lib/params';
import { CURVE_NUCLIDES, NUCLIDES, RADIOACTIVE, nuclide } from './nuclear/lib/nuclides';
import { bindingCurve, binding, TEXTBOOK_PEAK_ID, curvePeak } from './nuclear/lib/binding';
import {
  FISSION_U235, FUSION_DT, REACTIONS, conservation, curveMove, qValue, reactionById,
} from './nuclear/lib/reactions';

export type NuclearParamBag = Record<string, number | string | boolean>;

/** Which face of the bench an archetype opens on. */
export type NuclearView = 'curve' | 'defect' | 'decay' | 'modes';

/**
 * The scene a nuclear archetype builds.
 *
 * Unlike `FieldScene` this carries no geometry — a nucleus at this scale has no
 * useful position on a canvas, and drawing one as a ball of spheres would be a
 * moving diagram of exactly the kind the design law forbids. What it carries is
 * the SELECTION: which nuclides are on the table, which reaction is on the
 * bench, which sample is decaying. Everything numerical is derived from the mass
 * table by the pure lib, never stored here, so a scene can never disagree with
 * the physics.
 */
export interface NuclearScene {
  view: NuclearView;
  /** Nuclide ids the exercise puts in front of the student. */
  nuclides: string[];
  /** The reaction on the bench, when there is one. */
  reactionId?: string;
  /** The decay sample: nuclide, sample mass in grams, population to simulate. */
  sample?: { id: string; grams: number; population: number; seed: number };
  /** Reaction ids the `modes` view compares side by side. */
  compare?: string[];
}

/**
 * `FieldArchetype`, minus the two fields the frozen contract cannot yet express.
 * When `'nuclear'` joins `FieldArchetype['mode']` this becomes a plain
 * `FieldArchetype & { view }` and nothing below changes.
 */
export interface NuclearArchetype extends Omit<FieldArchetype, 'mode' | 'build' | 'kind' | 'targets'> {
  mode: 'nuclear';
  view: NuclearView;
  build(params?: ParamBag): NuclearScene;
  /**
   * REQUIRED here, unlike on `FieldArchetype`. Every nuclear exercise exists to
   * break one specific belief, the copy for it lives in `lib/misconceptions.ts`,
   * and making the field mandatory means a new archetype cannot be added without
   * deciding which belief it attacks. Optional on the base interface only because
   * some Phase-1 archetypes predate the discipline.
   */
  targets: FieldMisconception;
}

const CURVE_IDS = CURVE_NUCLIDES.map((n) => n.id);
const HEAVY_IDS = NUCLIDES.filter((n) => n.A >= 200).map((n) => n.id);
const LIGHT_IDS = NUCLIDES.filter((n) => n.A <= 16 && n.A >= 2).map((n) => n.id);
const DECAY_IDS = RADIOACTIVE.map((n) => n.id);

/** A param value that must name a real nuclide. Falls back rather than throwing,
 *  because a hand-edited block with a typo should degrade to a working exercise
 *  and say so, not blank the page. */
const nuclideParam = (p: ParamBag, key: string, fallback: string): string => {
  const raw = str(p, key, fallback);
  try { nuclide(raw); return raw; } catch { return fallback; }
};

export const NUCLEAR_ARCHETYPES: Record<string, NuclearArchetype> = {

  // ── 1 ──────────────────────────────────────────────────────────────────────
  'binding-energy-curve': {
    id: 'binding-energy-curve',
    title: 'One curve explains both bombs and both stars',
    summary:
      'Binding energy per nucleon, plotted against mass number, for 38 real nuclides. It climbs '
      + 'steeply from hydrogen, peaks around iron, and sags all the way to uranium. Everything in '
      + 'this chapter is a consequence of that shape.',
    mode: 'nuclear',
    view: 'curve',
    targets: 'bigger_nucleus_more_tightly_bound',
    params: [
      { key: 'pick', label: 'Nuclide to inspect', kind: 'select', default: 'Fe-56', options: CURVE_IDS },
      { key: 'markPeak', label: 'Mark the peak', kind: 'boolean', default: true },
      { key: 'showAll', label: 'Show every tabulated nuclide', kind: 'boolean', default: false },
    ],
    build(p?: ParamBag): NuclearScene {
      const pick = nuclideParam(p, 'pick', 'Fe-56');
      const showAll = bool(p, 'showAll', false);
      // Read every param here so an authoring typo surfaces at build, not deep
      // in a render pass where the failure has no name.
      void bool(p, 'markPeak', true);
      return {
        view: 'curve',
        nuclides: showAll ? NUCLIDES.filter((n) => n.A >= 2).map((n) => n.id) : CURVE_IDS,
        compare: [pick, TEXTBOOK_PEAK_ID, curvePeak().id],
      };
    },
    defaultSteps: [
      { say: 'Nothing is plotted yet. Before it is: **which is more tightly bound, a helium nucleus or a uranium nucleus?** Most people say uranium, because uranium is bigger. Commit to an answer, then plot it.', cta: 'Plot the curve' },
      { say: 'Read the y-axis carefully — it is binding energy **per nucleon**, in MeV. Helium-4 sits at 7.07. Uranium-235 sits at 7.59. And iron-56, right at the top, sits at 8.79.', cta: 'Mark the peak' },
      { say: 'Now the shape. Steep climb up to about A = 20, a broad flat plateau from roughly 50 to 65, then a slow sag all the way to uranium. Click any point to see the mass defect it came from.', cta: 'Inspect a nuclide' },
      { say: 'Last thing, and it is the one that pays off for the rest of the chapter: **anything not at the peak can release energy by moving toward it.** Light nuclei get there by joining. Heavy nuclei get there by splitting. Same curve, same reason, opposite directions.', cta: 'Done' },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  'mass-defect': {
    id: 'mass-defect',
    title: 'Weigh the parts, weigh the whole, and find mass missing',
    summary:
      'Two hydrogen atoms and two neutrons weigh 4.03298 u. A helium atom weighs 4.00260 u. '
      + 'The 0.03038 u that went missing is the binding energy — 28.296 MeV, or 4.53×10⁻¹² J.',
    mode: 'nuclear',
    view: 'defect',
    targets: 'mass_and_energy_are_separate',
    params: [
      { key: 'pick', label: 'Nuclide', kind: 'select', default: 'He-4', options: CURVE_IDS },
      { key: 'showJoules', label: 'Show the energy in joules too', kind: 'boolean', default: true },
      { key: 'perNucleon', label: 'Divide by A at the end', kind: 'boolean', default: true },
    ],
    build(p?: ParamBag): NuclearScene {
      const pick = nuclideParam(p, 'pick', 'He-4');
      void bool(p, 'showJoules', true);
      void bool(p, 'perNucleon', true);
      // Force the arithmetic now: a nuclide whose mass excess is mistyped would
      // otherwise first show up as an odd-looking number on a student's screen.
      const b = binding(pick);
      if (!Number.isFinite(b.bindingMev)) {
        throw new Error(`nuclear: binding energy of ${pick} is not finite — check its mass excess.`);
      }
      return { view: 'defect', nuclides: [pick, 'H-1', 'n'] };
    },
    defaultSteps: [
      { say: 'A helium nucleus is two protons and two neutrons. **Predict:** does a helium atom weigh more than, less than, or exactly the same as the parts it is made of?', cta: 'Weigh the parts' },
      { say: 'Two hydrogen atoms and two neutrons: **4.03298 u**. That is the shopping list. Now weigh the finished nucleus.', cta: 'Weigh the helium atom' },
      { say: '**4.00260 u.** It is lighter. 0.03038 u of mass is simply not there — and nothing leaked out, because we counted every proton, every neutron and every electron.', cta: 'Convert it with E = Δmc²' },
      { say: '0.03038 u × 931.494 MeV/u = **28.296 MeV** = 4.53×10⁻¹² J. That is the energy you would have to put back in to pull the nucleus apart. It was paid out when the nucleus formed, and the payment was made in mass.', cta: 'Divide by four' },
      { say: '**7.074 MeV per nucleon.** Now compare it with any other nuclide — that one number is what the curve plots, and it is the whole reason fission and fusion both work.', cta: 'Done' },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  'fission-on-the-curve': {
    id: 'fission-on-the-curve',
    title: 'Split uranium and watch the fragments climb',
    summary:
      'One slow neutron, one uranium-235, two middle-weight fragments and three spare neutrons. '
      + 'Both fragments land HIGHER on the binding-energy curve than uranium was — and the energy '
      + 'released is exactly the height they climbed, times the number of nucleons that climbed it.',
    mode: 'nuclear',
    view: 'curve',
    targets: 'fission_energy_from_size_not_binding',
    params: [
      { key: 'reaction', label: 'Fission channel', kind: 'select', default: 'fission-u235',
        options: REACTIONS.filter((r) => r.kind === 'fission').map((r) => r.id) },
      { key: 'showAccount', label: 'Show where the 200 MeV goes', kind: 'boolean', default: true },
      { key: 'compareCoal', label: 'Compare a kilogram with coal', kind: 'boolean', default: true },
    ],
    build(p?: ParamBag): NuclearScene {
      const id = str(p, 'reaction', 'fission-u235');
      const r = reactionById(id) ?? FISSION_U235;
      // Nothing is displayed that does not conserve A and charge.
      const c = conservation(r);
      if (!c.ok) throw new Error(`nuclear: ${r.id} does not conserve — ${c.problems.join(' ')}`);
      const move = curveMove(r);
      if (!move.towardPeak) {
        throw new Error(`nuclear: ${r.id} does not move toward the peak, so it cannot release energy this way.`);
      }
      void bool(p, 'showAccount', true);
      void bool(p, 'compareCoal', true);
      return {
        view: 'curve',
        nuclides: CURVE_IDS,
        reactionId: r.id,
        compare: [...r.inputs, ...r.outputs].filter((x) => x.id !== 'n').map((x) => x.id),
      };
    },
    defaultSteps: [
      { say: 'Uranium-235 is at A = 235, near the right-hand end of the curve, at 7.59 MeV per nucleon. A slow neutron goes in. **Predict:** will the two fragments land higher on this curve, lower, or in the same place?', cta: 'Fire the neutron' },
      { say: 'Barium-141 at **8.33** and krypton-92 at **8.51** — both higher than uranium was. The nucleons did not lose binding by splitting up; they gained it, because they moved toward the peak.', cta: 'Measure the climb' },
      { say: 'The climb is **0.734 MeV per nucleon**, and 236 nucleons made it. 0.734 × 236 = **173 MeV**, which is exactly the Q value the mass table gives. You have just read the energy off the graph.', cta: 'Find the missing 30 MeV' },
      { say: 'Textbooks say "about 200 MeV per fission", and 173 is what the masses give. Both are right: 173 MeV is prompt, and the fragments are neutron-rich, so they go on beta-decaying for years afterward. Add that in and the total is about 205 MeV, of which about 10 leaves as antineutrinos and is gone forever.', cta: 'Compare it with coal' },
      { say: 'One kilogram of uranium-235: 8.4×10¹³ J. One kilogram of coal: 3×10⁷ J. **Nearly three million times more**, from the same mass — because chemistry rearranges electrons and this rearranges nucleons, and nucleons are bound a million times more tightly.', cta: 'Done' },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  'fusion-on-the-curve': {
    id: 'fusion-on-the-curve',
    title: 'Now go the other way, up the same curve',
    summary:
      'Deuterium plus tritium makes helium-4 plus a neutron, and releases 17.59 MeV from five '
      + 'nucleons. Same curve as fission, same rule — move toward the peak — travelled in the '
      + 'opposite direction. Fission and fusion are not opposites; they are the same idea.',
    mode: 'nuclear',
    view: 'curve',
    targets: 'fission_and_fusion_are_opposites',
    params: [
      { key: 'reaction', label: 'Fusion reaction', kind: 'select', default: 'fusion-dt',
        options: REACTIONS.filter((r) => r.kind === 'fusion').map((r) => r.id) },
      { key: 'showFission', label: 'Keep the fission arrow on the axis', kind: 'boolean', default: true },
      { key: 'perNucleonCompare', label: 'Compare energy per nucleon', kind: 'boolean', default: true },
    ],
    build(p?: ParamBag): NuclearScene {
      const id = str(p, 'reaction', 'fusion-dt');
      const r = reactionById(id) ?? FUSION_DT;
      const c = conservation(r);
      if (!c.ok) throw new Error(`nuclear: ${r.id} does not conserve — ${c.problems.join(' ')}`);
      const q = qValue(r);
      if (!q.releases) throw new Error(`nuclear: ${r.id} has Q = ${q.mev.toFixed(3)} MeV and cannot be a source.`);
      const withFission = bool(p, 'showFission', true);
      void bool(p, 'perNucleonCompare', true);
      return {
        view: 'curve',
        nuclides: CURVE_IDS,
        reactionId: r.id,
        compare: withFission ? [r.id, FISSION_U235.id] : [r.id],
      };
    },
    defaultSteps: [
      { say: 'The fission arrow is still on the axis, pointing left toward the peak. Now look at the far LEFT of the curve, where deuterium sits at 1.11 MeV per nucleon. **Predict:** to move toward the peak from there, do these nuclei need to split or to join?', cta: 'Fuse them' },
      { say: 'Deuterium and tritium make helium-4 and a neutron. Helium-4 is at **7.07** — a climb of 3.52 MeV per nucleon from an average of 2.14. That is nearly FIVE TIMES the per-nucleon climb fission manages.', cta: 'Read the energy' },
      { say: '**17.59 MeV** from five nucleons — and again it is just the climb times the nucleons: 3.518 × 5 = 17.59, matching the mass table exactly. Per nucleon, fusion beats fission about four to one.', cta: 'Put both arrows on one axis' },
      { say: 'Two arrows, one curve, both pointing at the peak from opposite sides. That is the answer to the question this chapter is really asking: **not "why does fission work and fusion also work", but "why does anything not at the peak release energy by moving toward it".**', cta: 'Ask what stops us' },
      { say: 'If fusion is better, why is every power station fission? Because two deuterons are both positive, and getting them close enough needs about 10⁸ K. A star has gravity to do that. We do not — which is the whole engineering problem, not a physics one.', cta: 'Done' },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  'decay-law': {
    id: 'decay-law',
    title: 'Half-life is not half the time until it is gone',
    summary:
      '400 individual nuclei, each with the same fixed chance of decaying in the next instant and '
      + 'no memory of how long it has waited. Nothing imposes an exponential — watch one appear.',
    mode: 'nuclear',
    view: 'decay',
    targets: 'half_life_is_half_the_lifetime',
    params: [
      { key: 'nuclide', label: 'Sample', kind: 'select', default: 'I-131', options: DECAY_IDS },
      { key: 'population', label: 'Nuclei to simulate', kind: 'number', default: 400, min: 100, max: 900, step: 100 },
      { key: 'grams', label: 'Real sample mass', kind: 'number', default: 1, min: 0.1, max: 10, step: 0.1, unit: 'g' },
      { key: 'seed', label: 'Random seed', kind: 'number', default: 20260730, min: 1, max: 99999999, step: 1 },
    ],
    build(p?: ParamBag): NuclearScene {
      const id = nuclideParam(p, 'nuclide', 'I-131');
      const nuc = nuclide(id);
      if (nuc.halfLife == null) {
        // A stable nuclide in a decay exercise is an authoring mistake with no
        // sensible fallback — an activity of zero would look like an answer.
        throw new Error(`nuclear: ${id} is stable, so it cannot be the sample in decay-law.`);
      }
      const population = Math.round(num(p, 'population', 400));
      return {
        view: 'decay',
        nuclides: [id],
        sample: {
          id,
          grams: num(p, 'grams', 1),
          population: Math.max(50, Math.min(1200, population)),
          seed: Math.round(num(p, 'seed', 20260730)),
        },
      };
    },
    defaultSteps: [
      { say: 'A grid of 400 iodine-131 nuclei, none of them decayed yet. Its half-life is 8.03 days. **Predict:** after 2 half-lives — about 16 days — how many of the 400 are left? Commit to a number before you run it.', cta: 'Run one half-life' },
      { say: 'About 200 gone, about 200 left. So far it matches everyone\'s intuition. Run the second one.', cta: 'Run the second half-life' },
      { say: 'About **100 left, not zero.** Half of the survivors went, not half of the original. Each half-life halves whatever is still there — so the answer after n of them is (1/2)ⁿ, and (1/2)ⁿ is never zero.', cta: 'Run it out to six' },
      { say: 'Six half-liveses in, 1/64 of the sample is still going. Now compare the noisy step-count with the smooth curve beside it: **nothing here was told to follow an exponential.** Each nucleus flipped a weighted coin on its own. The curve is what that adds up to.', cta: 'Switch on the activity readout' },
      { say: 'Activity is A = λN — decays per second, which is what a Geiger counter clicks. It falls in exactly the same proportion as N, because λ never changes. One gram of caesium-137 is 3.2×10¹² Bq; the same gram in 30 years is half that, and in 60 years a quarter.', cta: 'Done' },
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  'decay-modes': {
    id: 'decay-modes',
    title: 'Two rules decide every decay product',
    summary:
      'Alpha, beta-minus, beta-plus, gamma. Plotted on a neutron-versus-proton chart you do not '
      + 'memorise four rules — you apply two conservation laws and read the arrow off the chart.',
    mode: 'nuclear',
    view: 'modes',
    targets: 'nucleus_contains_electrons',
    params: [
      { key: 'reaction', label: 'Decay to inspect', kind: 'select', default: 'alpha-u238',
        options: REACTIONS.filter((r) => r.kind !== 'fission' && r.kind !== 'fusion').map((r) => r.id) },
      { key: 'showChart', label: 'Show the N–Z chart', kind: 'boolean', default: true },
      { key: 'showAllArrows', label: 'Draw all four arrows at once', kind: 'boolean', default: false },
    ],
    build(p?: ParamBag): NuclearScene {
      const id = str(p, 'reaction', 'alpha-u238');
      const r = reactionById(id);
      if (!r) throw new Error(`nuclear: unknown reaction id "${id}" in decay-modes.`);
      const c = conservation(r);
      if (!c.ok) throw new Error(`nuclear: ${r.id} does not conserve — ${c.problems.join(' ')}`);
      const all = bool(p, 'showAllArrows', false);
      void bool(p, 'showChart', true);
      // One representative of each mode, so the chart can draw all four arrows.
      const representatives = ['alpha-u238', 'beta-c14', 'beta-plus-na22', 'gamma-ni60'];
      return {
        view: 'modes',
        nuclides: [...HEAVY_IDS, ...LIGHT_IDS],
        reactionId: r.id,
        compare: all ? representatives : [r.id],
      };
    },
    defaultSteps: [
      { say: 'Uranium-238, at Z = 92 and N = 146 on the chart. It is about to alpha-decay. **Before the arrow is drawn:** an alpha particle is a helium nucleus — 2 protons and 2 neutrons. Where must the daughter land?', cta: 'Draw the alpha arrow' },
      { say: 'Down two in Z, down two in N — so A drops by 4 and Z drops by 2. Thorium-234. You did not need a rule for that: you needed **charge in = charge out** and **nucleons in = nucleons out**, and the arrow follows.', cta: 'Now do beta-minus' },
      { say: 'Carbon-14 to nitrogen-14. A neutron became a proton, so the arrow goes up one in Z and down one in N — **diagonally, along a line of constant A**. The electron was created on the spot; it was never inside.', cta: 'Now beta-plus' },
      { say: 'Sodium-22 to neon-22 — the same diagonal, travelled the other way, because here a proton became a neutron. And it costs 1.022 MeV up front (two electron masses), which is why beta-plus is rarer than beta-minus and has a threshold beta-minus does not.', cta: 'Now gamma' },
      { say: 'Gamma moves **nowhere** on this chart. Same Z, same N, same element — only the energy level changed. It is the one emission that is not a transmutation, and the only one with no arrow to draw.', cta: 'Check the books' },
      { say: 'Last: put every arrow on at once and check the two sums on each. Nucleon number and charge balance on all four, every time. Those two rules are the whole of this section — everything else is a consequence.', cta: 'Done' },
    ],
  },
};

/** Stable presentation order for a picker — the teaching order, not alphabetical:
 *  the curve first, then where its numbers come from, then the two ways to climb
 *  it, then the decay laws. */
export const NUCLEAR_ARCHETYPE_ORDER: string[] = [
  'binding-energy-curve',
  'mass-defect',
  'fission-on-the-curve',
  'fusion-on-the-curve',
  'decay-law',
  'decay-modes',
];

export const getNuclearArchetype = (id?: string): NuclearArchetype | undefined =>
  id ? NUCLEAR_ARCHETYPES[id] : undefined;

/** What an admin picker needs — metadata only, readable without running `build()`. */
export interface NuclearArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  view: NuclearView;
  params: NonNullable<NuclearArchetype['params']>;
  stepped: boolean;
  stepCount: number;
  /** Always present — required on `NuclearArchetype`. */
  targets: NuclearArchetype['targets'];
}

export const NUCLEAR_ARCHETYPE_CATALOG: NuclearArchetypeSummary[] =
  NUCLEAR_ARCHETYPE_ORDER
    .map((id) => NUCLEAR_ARCHETYPES[id])
    .filter((a): a is NuclearArchetype => !!a)
    .map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      view: a.view,
      params: a.params ?? [],
      stepped: !!a.defaultSteps?.length,
      stepCount: a.defaultSteps?.length ?? 0,
      targets: a.targets,
    }));

/** Re-exported so a consumer of the archetype library never has to reach past it
 *  into `nuclear/lib` for the one function that turns a selection into numbers. */
export { bindingCurve, binding, curveMove, qValue, conservation };
