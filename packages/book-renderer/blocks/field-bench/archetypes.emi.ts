/*
 * field-bench/archetypes.emi.ts — Unit 11's EMI construction library. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every EMI exercise on every page is a
 * `field_bench` block naming ONE id from this map plus params
 * (PHYSICS_SIMULATION_PROGRAM.md §3). Twelve rungs, all data.
 *
 * ═══ TWO THINGS THIS FILE NEEDS FROM THE ENGINE OWNER ════════════════════════
 *
 * 1. A `'emi'` MODE. `FieldArchetype['mode']` and `FieldBenchBlock['mode']` are
 *    frozen at sculptor | gauss | trajectory | photoelectric, and none of them
 *    is what these twelve are. Rather than invent one (the brief says stop and
 *    report), every archetype below declares `mode: 'gauss'` — the closest true
 *    statement, since ten of the twelve literally drag a closed rectangle
 *    through a field and read the flux through it — and `EMI_VIEW` below carries
 *    the real dispatch key that `emi/EmiBench.tsx` switches on.
 *
 *    To wire it properly, three edits outside this folder:
 *      • add `'emi'` to `FieldBenchBlock['mode']` (packages/data/types/books.ts
 *        AND its Zod union in packages/data/books/schemas.ts);
 *      • add `'emi'` to `FieldArchetype['mode']` in field-bench/types.ts;
 *      • add `case 'emi': return <EmiBench block={block} />;` to
 *        field-bench/FieldBench.tsx.
 *    Then change `mode: 'gauss'` to `mode: 'emi'` here — nothing else moves.
 *
 * ═══ EVERY RUNG NAMES A MISCONCEPTION ════════════════════════════════════════
 * `FieldMisconception` gained seven EMI codes when this library landed (see
 * field-bench/types.ts); their copy lives in `lib/misconceptions.ts` beside the
 * original nine, under the same exhaustive `Record` that makes a code without
 * copy a compile error. `magnetic_force_does_work` is honestly reused on
 * `motional-emf-rod` — the charges in the rod feel qv×B and it does no net work,
 * which is precisely why the joules have to come from the hand.
 *
 * ═══ COORDINATES AND SCALE ═══════════════════════════════════════════════════
 * SI, x right, y UP, B_z positive OUT of the page — the shared convention. The
 * whole EMI bench lives inside about 60 cm of bench, so every readout lands in
 * millivolts, milliamps and milliwatts, which the SI-prefix formatter prints
 * without switching prefix half-way along a slider.
 *
 * ═══ EVERY DEFAULT IS HAND-DERIVED IN ITS COMMENT ════════════════════════════
 * and re-derived independently in `scripts/verify-emi-ac.mjs`.
 */

import type { FieldArchetype, FieldScene } from './types';
import type { ParamBag } from './lib/params';
import { buildEmiScene, emiSetup, type EmiView } from './emi/lib/setup';

// ── Param helpers ────────────────────────────────────────────────────────────

type Param = NonNullable<FieldArchetype['params']>[number];

const n = (
  key: string, label: string, def: number,
  min: number, max: number, step: number, unit?: string,
): Param => ({ key, label, kind: 'number', default: def, min, max, step, unit });

const pick = (key: string, label: string, def: string, options: string[]): Param =>
  ({ key, label, kind: 'select', default: def, options });

/** Every EMI archetype builds its scene the same way — through `emiSetup`, so
 *  the drawing and the physics can never read different numbers (see setup.ts). */
const sceneFor = (view: EmiView) => (p?: ParamBag): FieldScene =>
  buildEmiScene(emiSetup(view, p));

// ── The sub-view each archetype routes to ────────────────────────────────────

/**
 * The real dispatch key, standing in for the `'emi'` mode this file asks for.
 * `EmiBench` reads THIS, not `mode`, so the twelve rungs work today.
 */
export const EMI_VIEW: Record<string, EmiView> = {
  'flux-machine': 'flux',
  'flux-not-flux-rate': 'flux',
  'loop-tilt-flux': 'flux',
  'lenz-both-ways': 'flux',
  'motional-emf-rod': 'motional',
  'motional-power-balance': 'motional',
  'rod-terminal-velocity': 'motional',
  'eddy-brake-solid': 'eddy',
  'eddy-slotted-plate': 'eddy',
  'self-inductance-ramp': 'inductance',
  'mutual-inductance-pair': 'inductance',
  'ac-generator-loop': 'generator',
};

// ── The library ──────────────────────────────────────────────────────────────

export const EMI_ARCHETYPES: Record<string, FieldArchetype> = {

  // ── 1 · THE FLAGSHIP ───────────────────────────────────────────────────────
  // B 1.2 T, loop 15 cm × 10 cm, R 0.20 Ω, band 30 cm wide, dragged at 0.50 m/s.
  //   entering:  dΦ/dt = B h v = 1.2 × 0.10 × 0.50 = 0.060 Wb/s
  //              emf = 60 mV, I = 60 mV / 0.20 Ω = 300 mA
  //              F   = I B h = 0.300 × 1.2 × 0.10 = 36 mN, opposing the drag
  //              P   = F v = 18 mW   and   I²R = 0.09 × 0.20 = 18 mW  ✓
  //   fully in:  dΦ/dt = 0 exactly. Φ = 1.2 × 0.015 = 18 mWb — the most it ever
  //              holds — and the EMF is zero. That is the exercise.
  'flux-machine': {
    id: 'flux-machine',
    title: 'The Flux Machine',
    summary:
      'Drag a loop through a field region with your finger. Flux, its rate of change, the EMF and the '
      + 'induced current, all live — and a real drag you can feel, because the induced current fights you.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'emf_from_flux_not_its_rate',
    params: [
      n('B', 'Field strength', 1.2, 0.2, 3, 0.1, 'T'),
      n('loop_w', 'Loop width', 0.15, 0.04, 0.30, 0.01, 'm'),
      n('loop_h', 'Loop height', 0.10, 0.04, 0.20, 0.01, 'm'),
      n('R', 'Loop resistance', 0.20, 0.05, 2, 0.05, 'Ω'),
      n('band_width', 'Field region width', 0.30, 0.10, 0.60, 0.02, 'm'),
      n('turns', 'Turns', 1, 1, 20, 1, ''),
      n('v', 'Steady-slide speed', 0.5, 0.05, 2, 0.05, 'm/s'),
    ],
    build: sceneFor('flux'),
    defaultSteps: [
      { say: 'A loop, and a band of field pointing out of the page. Nothing is moving, and the loop is outside the band, so there is no flux through it and nothing to read. **Take hold of the loop** and start easing it toward the field.', cta: 'Show the flux readout' },
      { say: 'Now push the loop in until only PART of it is over the field. Watch two numbers: the flux Φ climbing, and beside it the rate dΦ/dt. The EMF follows the rate, not the flux.', cta: 'Show the EMF and the current' },
      { say: 'Feel that? The drag under your finger is the induced current pushing back. **Predict before you look:** keep pushing until the loop is COMPLETELY inside the band — does the EMF go up, stay the same, or drop to zero?', cta: 'Push it all the way in' },
      { say: 'Zero. The loop now holds the most flux it will ever hold, and reads no EMF whatsoever, because nothing is changing. The drag vanished with it — there is no current to push against you.', cta: 'Pull it back out' },
      { say: 'Coming out, the flux falls and the current runs the OTHER way — and the drag is back, still fighting you. That is Lenz\'s law: it never opposes the field, only the change.', cta: 'Done' },
    ],
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  // The same machine, framed as a contest the intuition loses.
  // parked at the band centre in 3 T: Φ = 3 × 0.015 = 45 mWb, emf = 0.
  // creeping at 0.05 m/s through 0.2 T: Φ ≤ 3 mWb, emf = 0.2×0.1×0.05 = 1 mV.
  'flux-not-flux-rate': {
    id: 'flux-not-flux-rate',
    title: 'Huge flux, no EMF',
    summary:
      'Two situations, side by side in one machine: a loop parked in the strongest field on the page, and '
      + 'the same loop creeping through a weak one. The second makes an EMF. The first makes nothing.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'emf_from_flux_not_its_rate',
    params: [
      n('B', 'Field strength', 3, 0.1, 3, 0.1, 'T'),
      n('v', 'Slide speed', 0.5, 0.05, 1.5, 0.05, 'm/s'),
      n('R', 'Loop resistance', 0.20, 0.05, 2, 0.05, 'Ω'),
      n('loop_h', 'Loop height', 0.10, 0.04, 0.20, 0.01, 'm'),
    ],
    build: sceneFor('flux'),
    defaultSteps: [
      { say: 'The field is at its maximum, 3 T, and the loop is parked right in the middle of it. **Predict:** with that much flux threading it, is the EMF large, small, or zero?', cta: 'Read the EMF' },
      { say: 'Exactly zero, with 45 mWb through the loop. Now turn the field down to almost nothing — 0.2 T — and give the loop the slowest slide the control allows.', cta: 'Weaken the field and nudge it' },
      { say: 'A millivolt, from a fifteenth of the flux. Flux is not the cause of anything; its rate of change is. Faraday\'s law has a d/dt in it and no Φ on its own anywhere.', cta: 'Done' },
    ],
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  // Φ = B A cos θ.  B 1.2 T, A = 0.15 × 0.10 = 0.015 m² → 18 mWb face-on,
  // 12.73 mWb at 45° (cos 45° = 0.70711), EXACTLY 0 at 90°.
  'loop-tilt-flux': {
    id: 'loop-tilt-flux',
    title: 'Turn the loop, lose the flux',
    summary:
      'Same field, same loop, nothing moving. Rotate it and the flux falls by cos θ — all the way to '
      + 'exactly zero when the loop is edge-on and the field runs along it instead of through it.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'flux_ignores_orientation',
    params: [
      n('B', 'Field strength', 1.2, 0.2, 3, 0.1, 'T'),
      n('tilt', 'Tilt of the loop', 0, 0, 90, 1, '°'),
      n('loop_w', 'Loop width', 0.15, 0.04, 0.30, 0.01, 'm'),
      n('loop_h', 'Loop height', 0.10, 0.04, 0.20, 0.01, 'm'),
      n('turns', 'Turns', 1, 1, 20, 1, ''),
    ],
    build: sceneFor('flux'),
    defaultSteps: [
      { say: 'A loop lying face-on inside a uniform field, holding all the flux it can. The loop is not going anywhere — the only thing that will change is which way it FACES.', cta: 'Show the flux' },
      { say: '**Predict first:** turn the loop through 60°. Does the flux fall to 60% of what it was, to a third of it, or to half?', cta: 'Turn it to 60°' },
      { say: 'Half — cos 60° is 0.5. Flux counts only the part of the area the field actually threads, and that shrinks as cos θ. Now take it all the way to edge-on.', cta: 'Turn it to 90°' },
      { say: 'Zero. Not "nearly zero" — the field is now running parallel to the plane of the loop, so it threads none of it. The field did not change and neither did the area.', cta: 'Done' },
    ],
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────
  // The sign check, both ways.  Entering (v > 0): dΦ/dt > 0, emf < 0,
  // I < 0 = clockwise, own field INTO the page. Exiting: every sign flips.
  'lenz-both-ways': {
    id: 'lenz-both-ways',
    title: 'Lenz, in both directions',
    summary:
      'Push the loop in, then pull the same loop out of the same field. The induced current reverses — '
      + 'and the force on the loop does not: it opposes you either way.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'induced_current_has_a_fixed_direction',
    params: [
      n('B', 'Field strength', 1.2, 0.2, 3, 0.1, 'T'),
      n('R', 'Loop resistance', 0.20, 0.05, 2, 0.05, 'Ω'),
      n('v', 'Slide speed', 0.5, 0.05, 2, 0.05, 'm/s'),
      n('loop_h', 'Loop height', 0.10, 0.04, 0.20, 0.01, 'm'),
    ],
    build: sceneFor('flux'),
    defaultSteps: [
      { say: 'Send the loop INTO the field and watch the little arrow on the loop. Note which way round it goes — clockwise or counter-clockwise — before you do anything else.', cta: 'Push it in' },
      { say: 'Clockwise, so its own field inside the loop points INTO the page, against the flux that is arriving. **Predict:** pull it back out. Does the current keep the same direction, or reverse?', cta: 'Pull it out' },
      { say: 'It reverses. There is no "the" direction of an induced current. Now look at the force arrow in both cases — it points backwards along your drag both times.', cta: 'Compare the two forces' },
      { say: 'Opposing the CHANGE, never the field. Going in it fights the flux arriving; coming out it fights the flux leaving. Which is why it always feels like wading, whichever way you go.', cta: 'Done' },
    ],
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  // ε = B ℓ v with B 0.8 T, ℓ 0.25 m, v 2.0 m/s → 0.400 V.
  // I = 0.400/0.50 = 0.800 A. F = I ℓ B = 0.8 × 0.25 × 0.8 = 0.160 N.
  'motional-emf-rod': {
    id: 'motional-emf-rod',
    title: 'A rod on rails: ε = Bℓv',
    summary:
      'Slide a bare metal rod along two rails through a field. No coil, no magnet moving, no battery — '
      + 'and a real voltage appears across it, exactly B times ℓ times v.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'magnetic_force_does_work',
    params: [
      n('B', 'Field strength', 0.8, 0.1, 2, 0.1, 'T'),
      n('rail_gap', 'Rail separation ℓ', 0.25, 0.05, 0.50, 0.01, 'm'),
      n('v', 'Rod speed', 2, 0.1, 5, 0.1, 'm/s'),
      n('R', 'Circuit resistance', 0.5, 0.1, 5, 0.1, 'Ω'),
    ],
    build: sceneFor('motional'),
    defaultSteps: [
      { say: 'Two rails, a resistor closing them at the far end, and a plain metal rod lying across them. A uniform field comes out of the page. There is no cell anywhere in this circuit.', cta: 'Show the circuit' },
      { say: '**Predict:** slide the rod along the rails. Does anything at all happen in the resistor?', cta: 'Slide the rod' },
      { say: 'A current. The free charges in the rod are moving with it, so each one feels qv×B along the rod, and that sideways shove is the EMF: ε = Bℓv. Three numbers, multiplied.', cta: 'Vary the speed' },
      { say: 'Double the speed and the EMF doubles exactly. Halve the rail gap and it halves. Nothing here is a fitted curve — it is a product of three things you can each change one at a time.', cta: 'Done' },
    ],
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  // THE ENERGY IDENTITY.  Same numbers as rung 5:
  //   P_mech = F v = 0.160 × 2 = 0.320 W
  //   P_elec = I²R = 0.64 × 0.50 = 0.320 W
  // Computed from a FORCE and from a CURRENT, and equal to the last bit.
  'motional-power-balance': {
    id: 'motional-power-balance',
    title: 'Where the heat comes from',
    summary:
      'The mechanical power your hand supplies and the electrical power the resistor dissipates, side by '
      + 'side, computed by two different routes — and identical. This is where EMI stops feeling like magic.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'induced_effects_are_free_energy',
    params: [
      n('B', 'Field strength', 0.8, 0.1, 2, 0.1, 'T'),
      n('rail_gap', 'Rail separation ℓ', 0.25, 0.05, 0.50, 0.01, 'm'),
      n('v', 'Rod speed', 2, 0.1, 5, 0.1, 'm/s'),
      n('R', 'Circuit resistance', 0.5, 0.1, 5, 0.1, 'Ω'),
      n('mass', 'Rod mass', 0.05, 0.01, 0.5, 0.01, 'kg'),
    ],
    build: sceneFor('motional'),
    defaultSteps: [
      { say: 'The rod is running at a steady speed and the resistor is getting warm. **Predict:** where is that heat coming from — the magnet, the field, or your hand?', cta: 'Show the force on the rod' },
      { say: 'The current in the rod sits in the field, so the rod feels I ℓ B — backwards. To hold a STEADY speed you have to push forward with exactly that much force. Look at the two power rows.', cta: 'Show both powers' },
      { say: 'Identical, to every digit shown. One was computed from a force times a speed; the other from a current squared times a resistance. Nothing was copied from the other.', cta: 'Let go of the rod' },
      { say: 'Let go and it slows to a stop, because nothing is feeding it any more. The magnetic force never did a joule of work — it passed your work through to the resistor and took no cut.', cta: 'Done' },
    ],
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  // v_t = m g R / (B²ℓ²) = 0.05 × 9.8 × 0.50 / (0.8² × 0.25²)
  //     = 0.245 / 0.04 = 6.125 m/s
  // τ = m R / (B²ℓ²) = 0.025 / 0.04 = 0.625 s
  'rod-terminal-velocity': {
    id: 'rod-terminal-velocity',
    title: 'The rod that stops speeding up',
    summary:
      'Drop the rod down vertical rails. It accelerates, the induced current grows, the magnetic force '
      + 'grows with it — and it settles at the speed where that force exactly equals its weight.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'induced_effects_are_free_energy',
    params: [
      n('B', 'Field strength', 0.8, 0.1, 2, 0.1, 'T'),
      n('rail_gap', 'Rail separation ℓ', 0.25, 0.05, 0.50, 0.01, 'm'),
      n('R', 'Circuit resistance', 0.5, 0.1, 5, 0.1, 'Ω'),
      n('mass', 'Rod mass', 0.05, 0.01, 0.5, 0.01, 'kg'),
    ],
    build: sceneFor('motional'),
    defaultSteps: [
      { say: 'The same rod and rails, stood on end so gravity does the pulling. **Predict:** does it fall freely, fall at a steady speed from the start, or speed up and then level off?', cta: 'Release it' },
      { say: 'It speeds up at first — at rest there is no EMF, no current, and nothing but gravity. Then the current grows and the retarding force grows with the speed.', cta: 'Show the force balance' },
      { say: 'It levels off exactly where I ℓ B equals mg. Set the two equal and the speed falls out: v = mgR / (B²ℓ²) — no calculus needed, just a balanced free-body diagram.', cta: 'Change the resistance' },
      { say: 'Halve the resistance and it settles at half the speed: a better conductor brakes harder. Short the rails out entirely and it barely moves at all.', cta: 'Done' },
    ],
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  // Solid aluminium plate, 10 cm tall, 2 mm thick, ρ = 2.65e-8 Ω·m, B 0.6 T.
  //   a = h = 0.10 m,  R_loop = 16ρ/t = 16 × 2.65e-8 / 0.002 = 2.12e-4 Ω
  //   b = B²a²/R_loop = 0.36 × 0.01 / 2.12e-4 = 16.98 N·s/m
  //   v_terminal = mg/b = 0.06 × 9.8 / 16.98 = 0.0346 m/s — a plate that creeps.
  'eddy-brake-solid': {
    id: 'eddy-brake-solid',
    title: 'The plate that will not fall',
    summary:
      'A solid aluminium plate dropped into a field region almost stops dead. There is no coil and no '
      + 'circuit — the metal is its own circuit, and the currents it carries are enormous.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'eddy_currents_are_about_being_metal',
    params: [
      n('B', 'Field strength', 0.6, 0.1, 1.5, 0.05, 'T'),
      pick('material', 'Plate material', 'aluminium', ['copper', 'aluminium', 'stainless']),
      n('thickness', 'Plate thickness', 0.002, 0.0005, 0.006, 0.0005, 'm'),
      n('plate_h', 'Plate height', 0.10, 0.04, 0.20, 0.01, 'm'),
      n('mass', 'Plate mass', 0.06, 0.01, 0.5, 0.01, 'kg'),
      n('v', 'Entry speed', 0.5, 0.02, 2, 0.02, 'm/s'),
    ],
    build: sceneFor('eddy'),
    defaultSteps: [
      { say: 'A solid plate of aluminium, about to enter a field region edge-first. There is no wire on it and nowhere for a current to go round — or so it looks. **Predict:** does it slow down at all?', cta: 'Send it in' },
      { say: 'It nearly stops. The metal does not need a wire: the free electrons circulate in closed loops inside the sheet itself. Look at the current — hundreds of amps, in a plate you could hold.', cta: 'Show the eddy loops' },
      { say: 'Each loop dissipates its own I²R and every one of those watts comes out of the plate\'s kinetic energy. Now swap the plate for stainless steel, which conducts about 26 times worse.', cta: 'Try stainless steel' },
      { say: 'Barely brakes. Same shape, same field, same mass — a worse conductor. So this is not about "being metal", it is about how easily a current can go round.', cta: 'Done' },
    ],
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  // The same plate with s slots cut along the motion. a = h/s, and
  //   b(s) = s · B²(h/s)²/R_loop = B²h²/(s R_loop)   →   braking ∝ 1/s.
  // 4 slots: b = 16.98/4 = 4.245 N·s/m, v_terminal = 0.1385 m/s — 4× faster.
  'eddy-slotted-plate': {
    id: 'eddy-slotted-plate',
    title: 'Why a slotted plate barely brakes',
    summary:
      'Cut slots along the direction of motion and the same plate, the same metal and the same field '
      + 'brake four times less. Slots do not add resistance — they forbid the big loops.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'eddy_currents_are_about_being_metal',
    params: [
      n('slots', 'Number of strips', 4, 1, 10, 1, ''),
      n('B', 'Field strength', 0.6, 0.1, 1.5, 0.05, 'T'),
      pick('material', 'Plate material', 'aluminium', ['copper', 'aluminium', 'stainless']),
      n('thickness', 'Plate thickness', 0.002, 0.0005, 0.006, 0.0005, 'm'),
      n('plate_h', 'Plate height', 0.10, 0.04, 0.20, 0.01, 'm'),
      n('mass', 'Plate mass', 0.06, 0.01, 0.5, 0.01, 'kg'),
      n('v', 'Entry speed', 0.5, 0.02, 2, 0.02, 'm/s'),
    ],
    build: sceneFor('eddy'),
    defaultSteps: [
      { say: 'The same aluminium plate, but with slots cut down it along the direction it travels. Not a scrap of metal has been removed from the current\'s way across the plate. **Predict:** does it brake more, less, or the same?', cta: 'Send it in' },
      { say: 'Four strips brake about a quarter as hard. Each strip can only carry a loop as tall as itself, and a smaller loop cuts a smaller EMF: ε goes as the loop size.', cta: 'Compare the loops' },
      { say: 'Follow it through. Each loop\'s power goes as the EMF squared, so as (size)², and there are more loops in proportion to 1/size. Multiply: total heating goes as the SIZE. Halve it and you halve the braking.', cta: 'Add more slots' },
      { say: 'This is why a transformer core is a stack of thin laminations rather than a solid block — the laminations are slots, and the eddy currents they forbid would otherwise be pure waste heat.', cta: 'Done' },
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  // L = μ₀ N² A / ℓ = 4π×10⁻⁷ × 800² × 8×10⁻⁴ / 0.15 = 4.2886 mH.
  // Ramp 0 → 2 A in 20 ms: dI/dt = 100 A/s, ε = −L dI/dt = −0.4289 V.
  // Hold at 2 A: dI/dt = 0, ε = 0 EXACTLY — biggest current, no EMF.
  // Energy at the peak: ½LI² = 0.5 × 4.2886e-3 × 4 = 8.577 mJ.
  'self-inductance-ramp': {
    id: 'self-inductance-ramp',
    title: 'An inductor opposes the change, not the current',
    summary:
      'Drive the current yourself: ramp it up, hold it flat, ramp it down. The back-EMF tracks the SLOPE '
      + 'of your ramp — so the biggest current in the whole run produces no EMF at all.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'inductor_opposes_current_not_change',
    params: [
      n('N1', 'Turns on the coil', 800, 100, 2000, 50, ''),
      n('area', 'Coil cross-section', 8e-4, 1e-4, 3e-3, 1e-4, 'm²'),
      n('coil_len', 'Coil length', 0.15, 0.05, 0.40, 0.01, 'm'),
      n('peak', 'Peak current', 2, 0.2, 5, 0.1, 'A'),
      n('ramp_up', 'Ramp-up time', 0.02, 0.002, 0.10, 0.002, 's'),
      n('hold', 'Hold time', 0.03, 0, 0.10, 0.005, 's'),
      n('ramp_down', 'Ramp-down time', 0.02, 0.002, 0.10, 0.002, 's'),
    ],
    build: sceneFor('inductance'),
    defaultSteps: [
      { say: 'A coil of 800 turns, and a current YOU shape: it will rise for 20 ms, sit still at 2 A, then fall again. **Predict:** during which part is the back-EMF biggest — the rise, the flat middle, or the fall?', cta: 'Run the programme' },
      { say: 'Look at the flat middle. Two amps flowing — the most in the whole run — and the EMF is exactly zero. An inductor cannot feel a current. It can only feel a current CHANGING.', cta: 'Compare the three EMFs' },
      { say: 'Rising and falling give the same size of EMF and OPPOSITE signs. On the way down the coil is not resisting the current at all; it is pushing it along, trying to keep it going.', cta: 'Make the ramp steeper' },
      { say: 'Steeper ramp, bigger EMF, same peak current. Now imagine cutting the current to zero in a microsecond by opening a switch: that is why the switch sparks, and why big coils need a path for the current to die into.', cta: 'Done' },
    ],
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  // M = μ₀ N₁ N₂ A / ℓ = 4π×10⁻⁷ × 800 × 1600 × 8×10⁻⁴ / 0.15 = 8.5773 mH,
  // which must equal √(L₁L₂) at perfect coupling: L₁ = 4.2886 mH,
  // L₂ = μ₀N₂²A/ℓ = 17.1546 mH, √(4.2886 × 17.1546) mH = 8.5773 mH ✓
  // ε₂ while ramping at 100 A/s = −M × 100 = −0.8577 V; while HOLDING = 0.
  'mutual-inductance-pair': {
    id: 'mutual-inductance-pair',
    title: 'Two coils, no connection',
    summary:
      'A second coil wound over the first, joined to it by nothing but flux. Ramp the primary and the '
      + 'secondary produces a voltage; hold the primary steady, however large, and it produces nothing.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'steady_current_induces_a_secondary_emf',
    params: [
      n('N1', 'Primary turns', 800, 100, 2000, 50, ''),
      n('N2', 'Secondary turns', 1600, 100, 4000, 50, ''),
      n('area', 'Shared cross-section', 8e-4, 1e-4, 3e-3, 1e-4, 'm²'),
      n('coil_len', 'Coil length', 0.15, 0.05, 0.40, 0.01, 'm'),
      n('k', 'Coupling', 1, 0.1, 1, 0.05, ''),
      n('peak', 'Peak primary current', 2, 0.2, 5, 0.1, 'A'),
      n('ramp_up', 'Ramp-up time', 0.02, 0.002, 0.10, 0.002, 's'),
      n('hold', 'Hold time', 0.03, 0, 0.10, 0.005, 's'),
      n('ramp_down', 'Ramp-down time', 0.02, 0.002, 0.10, 0.002, 's'),
    ],
    build: sceneFor('inductance'),
    defaultSteps: [
      { say: 'A second coil of 1600 turns wound over the first. There is no wire between them — not one. **Predict:** hold a big steady current in the primary. What does the secondary read?', cta: 'Hold 2 A in the primary' },
      { say: 'Nothing. Zero volts, with 2 A flowing next to it. Mutual inductance answers to dI₁/dt, and a steady current has no rate of change to offer.', cta: 'Now ramp the primary' },
      { say: 'A voltage, from a coil nothing is connected to. ε₂ = −M dI₁/dt, and M here is 8.58 mH — twice the primary\'s own inductance, because there are twice as many turns to link.', cta: 'Check M against √(L₁L₂)' },
      { say: 'At perfect coupling M is exactly √(L₁L₂). Drop the coupling to 0.5 and it halves: only half the primary\'s flux reaches the secondary. This is a transformer, and it works on AC for exactly the reason step 1 showed.', cta: 'Done' },
    ],
  },

  // ── 12 · THE BRIDGE INTO AC ───────────────────────────────────────────────
  // A loop spun in a uniform field: Φ = BA cos ωt, ε = NBAω sin ωt.
  // B 0.5 T, A 0.02 m², N 50, f 5 Hz → ω = 31.4159 rad/s,
  // peak ε = 50 × 0.5 × 0.02 × 31.4159 = 15.708 V.
  'ac-generator-loop': {
    id: 'ac-generator-loop',
    title: 'The loop that makes AC',
    summary:
      'Spin the loop instead of sliding it and the flux becomes a cosine, so the EMF becomes a sine. '
      + 'This is where alternating current comes from — the same Faraday law, turning.',
    mode: 'gauss',
    kind: 'magnetic',
    targets: 'emf_from_flux_not_its_rate',
    params: [
      n('B', 'Field strength', 0.5, 0.1, 1.5, 0.05, 'T'),
      n('gen_area', 'Loop area', 0.02, 0.005, 0.06, 0.005, 'm²'),
      n('gen_turns', 'Turns', 50, 5, 200, 5, ''),
      n('gen_freq', 'Rotation rate', 5, 0.5, 20, 0.5, 'Hz'),
      n('R', 'Circuit resistance', 10, 1, 50, 1, 'Ω'),
    ],
    build: sceneFor('generator'),
    defaultSteps: [
      { say: 'The same loop, the same field — but now it turns instead of sliding. Turn the handle yourself and watch the flux trace: Φ = BA cos θ, and θ is now growing steadily.', cta: 'Turn the loop' },
      { say: '**Predict:** where in the turn is the EMF biggest — where the flux is biggest (face-on), or where the flux is zero (edge-on)?', cta: 'Show the EMF trace' },
      { say: 'Edge-on. The EMF follows the SLOPE of the flux curve, and a cosine is steepest exactly where it crosses zero. Face-on the flux is at its peak and momentarily flat, so the EMF is zero there.', cta: 'Change the rate' },
      { say: 'Spin it twice as fast and the peak EMF doubles AND the frequency doubles: ε₀ = NBAω. Every socket in the country is a much bigger version of this loop, turning fifty times a second.', cta: 'Done' },
    ],
  },
};

/** Teaching order — flux first, then motion, then the metal, then the coils,
 *  and the generator last because it is the doorway into the AC bench. */
export const EMI_ARCHETYPE_ORDER: string[] = [
  'flux-machine', 'flux-not-flux-rate', 'loop-tilt-flux', 'lenz-both-ways',
  'motional-emf-rod', 'motional-power-balance', 'rod-terminal-velocity',
  'eddy-brake-solid', 'eddy-slotted-plate',
  'self-inductance-ramp', 'mutual-inductance-pair',
  'ac-generator-loop',
];
