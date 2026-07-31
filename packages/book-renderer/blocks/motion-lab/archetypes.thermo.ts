/*
 * motion-lab/archetypes.thermo.ts — thermodynamics, kinetic theory, fluids.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE DATA. No React, no DOM, no physics. Units 6 and 7 of the catalogue
 * (PHYSICS_SIMULATION_PROGRAM.md §4): the PV-Diagram Workbench and the Fluid
 * Bench are flagships; Heat Engine Bench, Molecular Chamber, Float/Sink and
 * Terminal Velocity are standard rungs on the same two benches.
 *
 * Same three rules as `archetypes.waves.ts` — read that header. In short:
 * every archetype names the misconception it attacks AND supplies the sentence
 * that breaks it; every predict gate answers each wrong option differently; and
 * every declared `params` key is surfaced as a live control by the bench that
 * renders it.
 *
 * Numbers quoted in the copy below are hand-computed and asserted in
 * `scripts/verify-motion-phase2.mjs`, so prose and physics cannot drift apart.
 */

import type { ThermoArchetype, ThermoArchetypeMap } from './thermo/types';
import { attacking } from './waves/types';
import {
  pFlag, pNum,
  pMoles, pFreedom, pStartV, pEndV, pTemp, pRatio,
  pMolarMass, pMolecules,
  pInletRadius, pThroatRadius, pOutletRadius, pInletSpeed, pInletPressure, pThroatHeight, pFluidDensity,
  pObjectMass, pObjectVolume, pViscosity, pBallRadius,
} from './thermo/types';

export const THERMO_ARCHETYPES: ThermoArchetypeMap = {
  /* ══ PV WORKBENCH ════════════════════════════════════════════════════════ */

  /* 1 ─────────────────────────────────────────────────────────────────────── */
  'isothermal-work': {
    id: 'isothermal-work',
    title: 'The work is the area — measured, not quoted',
    summary:
      'Expand a gas slowly at constant temperature and watch the shaded region grow under the curve. The number in the ledger is that region, integrated as you drag — and beside it sits nRT ln(V₂/V₁) so you can see the two agree.',
    scenario: 'graphs',
    sim: 'pv-workbench',
    ...attacking(
      'work_is_p_times_delta_v_always',
      'Work done by a gas is P ΔV.',
      'Only when P holds still. Here the pressure falls the entire time the gas expands, so P ΔV would need you to pick WHICH pressure — the start, the end, or something in between — and all three give different answers. The honest calculation adds up P dV over the whole path, which is the area under the curve, which is nRT ln(V₂/V₁) for an isotherm.'
    ),
    predict: {
      prompt: 'One mole at 300 K expands isothermally from 0.02 m³ to 0.05 m³. Is the work done by the gas closer to P₁ΔV, P₂ΔV, or neither?',
      options: [
        'P₁ΔV — use the starting pressure',
        'P₂ΔV — use the finishing pressure',
        'Between the two, and neither formula is right',
        'Zero — the temperature did not change',
      ],
      answerIndex: 2,
      responses: [
        'P₁ΔV = 3741 J overestimates badly: it pretends the gas kept pushing at its initial pressure the whole way, and it did not.',
        'P₂ΔV = 1497 J underestimates for the mirror-image reason. The truth is 2286 J, comfortably between the two.',
        'Correct — 2286 J, and it is nRT ln(2.5). Whenever P moves during the process, the rectangle is the wrong shape and you need the integral.',
        'Constant temperature means ΔU = 0, not W = 0. All the work came from heat flowing in: Q = W = 2286 J.',
      ],
    },
    params: [pMoles(1), pFreedom(), pStartV(0.02), pEndV(0.05), pTemp('T', 'Temperature', 300), pFlag('show_exact', 'Quote the closed form beside it', true)],
    defaultSteps: [
      { say: 'One mole of gas in a cylinder at 300 K, plotted as a single point on the pressure–volume plane. Nothing has happened yet.', cta: 'Draw the isotherm' },
      { say: 'Holding the temperature fixed means PV stays constant, so the path is a hyperbola. It is the SHAPE of the path, not the endpoints, that decides the work.', cta: 'Expand the gas' },
      { say: 'Drag the piston out and the shaded region grows. That region is Σ P dV, added strip by strip along the path you actually drew.', cta: 'Compare with the formula' },
      { say: 'The ledger reads 2286 J and nRT ln(2.5) reads 2286 J. Same number, because "the area under the curve" and "the integral" are the same sentence said twice.', cta: 'Done' },
    ],
    tip: 'For an isotherm, W = nRT ln(V₂/V₁) and ΔU = 0, so Q = W. Those two facts answer most isothermal questions in a line, and the log means the numbers are always smaller than students expect.',
  },

  /* 2 ─────────────────────────────────────────────────────────────────────── */
  'adiabatic-vs-isothermal': {
    id: 'adiabatic-vs-isothermal',
    title: 'Two expansions from the same point',
    summary:
      'Run an isothermal and an adiabatic expansion from an identical start to an identical volume. The adiabatic curve falls away more steeply, does less work, and — the part that surprises everyone — comes out colder without a gram of anything having been cooled.',
    scenario: 'graphs',
    sim: 'pv-workbench',
    ...attacking(
      'adiabatic_means_constant_temperature',
      'Adiabatic means no heat, so nothing heats up or cools down.',
      'No heat FLOWS, which is not the same as no temperature change. The gas still does work pushing the piston out, and with no heat coming in, that energy can only come from its own internal store — so it cools. This is why a bicycle pump gets hot on the down-stroke and a spray can goes cold when you empty it.'
    ),
    predict: {
      prompt: 'A gas expands with no heat allowed in or out. Its temperature…',
      options: ['stays the same', 'falls', 'rises', 'depends on the gas'],
      answerIndex: 1,
      responses: [
        'That would be an ISOTHERMAL expansion, and it needs heat flowing in to keep the temperature up. Here no heat is allowed.',
        'Correct. W comes out of U because Q = 0, so ΔU = −W and the temperature drops. TV^(γ−1) = constant puts a number on it.',
        'Rising would mean the gas gained energy while doing work and receiving no heat — energy from nowhere.',
        'γ differs between gases, so HOW MUCH it cools depends on the gas. That it cools does not.',
      ],
    },
    params: [pMoles(1), pFreedom(), pStartV(0.02), pEndV(0.05), pTemp('T', 'Starting temperature', 300), pFlag('overlay', 'Overlay both processes', true)],
    defaultSteps: [
      { say: 'Same starting state for both: same pressure, same volume, same temperature. One cylinder sits in a water bath, the other is wrapped in perfect insulation.', cta: 'Expand both' },
      { say: 'The insulated one drops faster. PV^γ = constant is a steeper curve than PV = constant, because γ > 1 — and the extra steepness is the temperature falling as it goes.', cta: 'Read the two temperatures' },
      { say: 'The isothermal gas is still at 300 K, kept there by heat from the bath. The adiabatic one is measurably colder, with nothing having been taken out of it but work.', cta: 'Compare the two areas' },
      { say: 'Less area under the adiabatic curve means less work done — as it must, since that work had to be paid for out of the gas\'s own internal energy rather than out of the bath.', cta: 'Done' },
    ],
    tip: 'Adiabatic: PVᵞ = const, TVᵞ⁻¹ = const, and W = nCᵥ(T₁ − T₂) = (P₁V₁ − P₂V₂)/(γ − 1). If a question says "sudden", "rapid" or "insulated", it means adiabatic — there was no TIME for heat to flow.',
  },

  /* 3 ─────────────────────────────────────────────────────────────────────── */
  'path-dependence': {
    id: 'path-dependence',
    title: 'Same start, same finish, different work',
    summary:
      'Two routes between an identical pair of states. Route A expands then cools; route B cools then expands. The work done differs by hundreds of joules — and the change in internal energy is identical to the last decimal place.',
    scenario: 'graphs',
    sim: 'pv-workbench',
    ...attacking(
      'internal_energy_is_path_dependent',
      'The gas did more work on one route, so it must have ended up with less energy that way.',
      'It ended up in exactly the same state, so it has exactly the same internal energy — U depends only on T, and T depends only on where you ARE on the plane. What differs is the BOOKKEEPING: the route that did more work also absorbed more heat, by precisely the same amount. W and Q are path functions; U is a state function. That distinction is the whole first law.'
    ),
    predict: {
      prompt: 'Two different processes take a gas from state 1 to state 2. Which quantities MUST be the same for both?',
      options: [
        'The work done, W',
        'The heat absorbed, Q',
        'The change in internal energy, ΔU',
        'All three — they start and finish in the same place',
      ],
      answerIndex: 2,
      responses: [
        'W is the area under the path, and two different paths enclose different areas. That is exactly what this exercise shows.',
        'Q = ΔU + W, and since W differs between the routes, Q must differ too — by the same amount, in the same direction.',
        'Correct. U is fixed by the state alone, so ΔU is fixed by the two endpoints alone. Everything else on the route is free to differ.',
        'Only ΔU. If all three were fixed by the endpoints there would be no such thing as an engine — a cycle returns to its start, so ΔU = 0, and yet it delivers work.',
      ],
    },
    params: [pMoles(1), pFreedom(), pStartV(0.02), pEndV(0.05), pTemp('T', 'Starting temperature', 300), pFlag('show_both_paths', 'Run both routes', true)],
    defaultSteps: [
      { say: 'One starting state, one finishing state, marked on the plane. How you get between them is not yet decided.', cta: 'Take route A' },
      { say: 'Route A: expand at constant pressure first, then cool at constant volume. The area under it is the work — a tall rectangle.', cta: 'Take route B' },
      { say: 'Route B: cool first, then expand. Same two endpoints, a visibly smaller area, and so visibly less work.', cta: 'Compare the ledgers' },
      { say: 'W differs. Q differs by the same amount. ΔU is identical, because both routes end at the same temperature — and U cannot tell how it got there.', cta: 'Done' },
    ],
    tip: 'In any first-law question, compute ΔU from the temperatures FIRST — it is the one quantity you can get without knowing the path. Then use Q = ΔU + W for whichever of the other two you were given.',
  },

  /* 4 ─────────────────────────────────────────────────────────────────────── */
  'closed-cycle-area': {
    id: 'closed-cycle-area',
    title: 'Close the loop and the area becomes the output',
    summary:
      'Join four processes into a closed cycle. The gas returns to exactly where it started, so its internal energy change is zero — and every joule of net work came out of the enclosed area, which you can measure with your eye.',
    scenario: 'graphs',
    sim: 'pv-workbench',
    ...attacking(
      'cycle_does_no_work_because_it_returns',
      'The gas ends where it began, so the net work must be zero.',
      'ΔU is zero — that is what returning means. The net work is not. The gas expands at high pressure and is compressed back at low pressure, so it pushes harder going out than you push coming back, and the difference is the area enclosed. Run the same loop the other way and the sign flips: you pay work in, and you have built a fridge.'
    ),
    predict: {
      prompt: 'A cycle runs CLOCKWISE on the PV plane. Over one complete cycle…',
      options: [
        'net work is done BY the gas, and heat is absorbed net',
        'net work is done ON the gas, and heat is rejected net',
        'no net work is done either way',
        'the internal energy rises',
      ],
      answerIndex: 0,
      responses: [
        'Correct. Clockwise means the outward leg sits above the return leg, so the gas pushes harder than it is pushed. W_net > 0, ΔU = 0, therefore Q_net = W_net — heat in, work out. That is an engine.',
        'That is the ANTICLOCKWISE case: a refrigerator or heat pump. Reverse the cycle on screen and watch the sign of the ledger flip.',
        'It would be zero only if the two legs retraced each other exactly, enclosing no area at all.',
        'It cannot. The gas is back in exactly the state it started in, so ΔU = 0 by definition.',
      ],
    },
    params: [pMoles(1), pFreedom(), pStartV(0.02), pEndV(0.05), pTemp('T', 'Cold temperature', 300), pTemp('T_hot', 'Hot temperature', 500), pFlag('reverse', 'Run the cycle backwards', false)],
    defaultSteps: [
      { say: 'Four processes, drawn one at a time. So far it is an open path — the gas has not come home yet.', cta: 'Close the loop' },
      { say: 'Closed. The gas is back at its starting pressure, volume and temperature, so ΔU around the loop is exactly zero. Check the ledger — it reads zero, it is not assumed.', cta: 'Shade the enclosed region' },
      { say: 'That region is the net work. Positive going clockwise, because the top leg is an expansion at high pressure and the bottom leg is a compression at low pressure.', cta: 'Reverse it' },
      { say: 'Run it anticlockwise and every number in the ledger changes sign. Work now goes IN and heat is pumped from cold to hot. Same four processes, opposite machine.', cta: 'Done' },
    ],
    tip: 'For any cycle: ΔU = 0, so Q_net = W_net = enclosed area. That one line turns most cycle questions into a geometry problem, and it is worth writing down before touching any individual leg.',
  },

  /* ══ HEAT ENGINE BENCH ═══════════════════════════════════════════════════ */

  /* 5 ─────────────────────────────────────────────────────────────────────── */
  'carnot-engine': {
    id: 'carnot-engine',
    title: 'Why no engine can reach 100%',
    summary:
      'Assemble a Carnot cycle from four strokes and read its efficiency. Then try to beat it — raise the hot side, drop the cold side, change the gas, change the volumes. The ceiling does not move, and finding out why it cannot is the point.',
    scenario: 'graphs',
    sim: 'heat-engine',
    ...attacking(
      'efficiency_can_reach_one',
      'A perfectly built engine with no friction and no leaks would turn all its heat into work.',
      'Even a perfect engine has to DUMP heat, and that is not an engineering failure. To run in a cycle the gas must be returned to its starting state, and squeezing it back down costs work — unless you cool it first, which means throwing heat away. η = 1 − T_c/T_h reaches 1 only if the cold reservoir is at absolute zero, and there is no such reservoir.'
    ),
    predict: {
      prompt: 'A Carnot engine runs between 500 K and 300 K. You want to improve it by 10 percentage points. Which helps MORE — raising T_h by 100 K, or lowering T_c by 100 K?',
      options: [
        'Raising the hot side',
        'Lowering the cold side',
        'They are identical — it is the difference that matters',
        'Neither changes the efficiency',
      ],
      answerIndex: 1,
      responses: [
        'Raising T_h to 600 K gives 1 − 300/600 = 50.0%, up from 40%. Real, but the other option does better.',
        'Correct: lowering T_c to 200 K gives 1 − 200/500 = 60%, a full 20 points. T_c sits in the numerator of the fraction being subtracted, so it has more leverage — which is why power stations care so much about cooling water.',
        'The formula is a RATIO, not a difference. 1 − 300/500 and 1 − 400/600 are not the same number even though both gaps are 200 K.',
        'Both change it. The question is which changes it more.',
      ],
    },
    params: [
      pTemp('T_hot', 'Hot reservoir', 500), pTemp('T_cold', 'Cold reservoir', 300),
      pMoles(1), pFreedom(), pStartV(0.02), pEndV(0.05),
      pFlag('show_reservoirs', 'Show the heat flows', true),
    ],
    defaultSteps: [
      { say: 'Four strokes, in order: expand while touching the hot reservoir, expand insulated, compress while touching the cold one, compress insulated. Nothing is drawn yet.', cta: 'Take in heat at T_hot' },
      { say: 'The gas expands isothermally, doing work and drawing heat from the hot reservoir to stay at temperature. That heat is Q_h — the fuel bill.', cta: 'Expand adiabatically' },
      { say: 'Now insulated. It keeps expanding and cools all the way to T_cold, purely by doing work. No heat crosses the boundary at all.', cta: 'Dump heat at T_cold' },
      { say: 'To get home it must be compressed — and compressing a hot gas costs more than compressing a cold one, so it is cooled first. That is Q_c, the heat you are FORCED to throw away.', cta: 'Read the efficiency' },
    ],
    tip: 'η_Carnot = 1 − T_c/T_h with the temperatures in KELVIN, always. If an exam quotes °C, convert first — this is the single most common arithmetic slip in the topic, and it turns 40% into something absurd.',
  },

  /* 6 ─────────────────────────────────────────────────────────────────────── */
  'otto-engine': {
    id: 'otto-engine',
    title: 'A real engine, and the gap to the ideal',
    summary:
      'Build the four-stroke petrol cycle: squeeze, burn, push, exhaust. Its efficiency depends on the compression ratio and on nothing else — not the fuel, not the size. Then put it beside a Carnot engine working between the same two temperatures.',
    scenario: 'graphs',
    sim: 'heat-engine',
    ...attacking(
      'better_fuel_means_better_efficiency',
      'A better fuel would make the engine more efficient.',
      'A better fuel gives you more heat, which gives you more work — but the FRACTION converted does not move. η_Otto = 1 − r^(1−γ) contains only the compression ratio and the gas\'s γ. That is why engine specifications lead with the compression ratio, and why raising it is limited by the fuel knocking rather than by the fuel\'s energy content.'
    ),
    predict: {
      prompt: 'An Otto engine with compression ratio 8 runs between the same two extreme temperatures as a Carnot engine. Which is more efficient?',
      options: ['The Otto engine', 'The Carnot engine', 'They tie', 'It depends on the fuel'],
      answerIndex: 1,
      responses: [
        'No cycle operating between two given temperatures can beat Carnot — that is not an engineering limit, it is a consequence of the second law. Try to arrange one on this bench and the ledger will refuse.',
        'Correct, and by a lot. Carnot is the ceiling for any cycle between those temperatures; Otto loses because it takes in and rejects heat across a RANGE of temperatures rather than at the two extremes.',
        'Only a reversible cycle ties with Carnot, and Otto is not one — its isochoric legs exchange heat across finite temperature differences.',
        'The fuel changes how much heat you get, never what fraction of it becomes work.',
      ],
    },
    params: [
      pRatio(8), pMoles(1), pFreedom(), pStartV(0.05),
      pTemp('T', 'Intake temperature', 300), pTemp('T_peak', 'Peak temperature', 1600),
      pFlag('compare_carnot', 'Compare with Carnot', true),
    ],
    defaultSteps: [
      { say: 'The piston is at the bottom of its stroke with a fresh charge of air and fuel. Four strokes to come, and the first one is yours to size.', cta: 'Compress (adiabatic)' },
      { say: 'Squeezed by a factor of r with no time for heat to escape, so it heats up sharply. This stroke costs you work — it is the investment.', cta: 'Burn (constant volume)' },
      { say: 'The spark fires and the pressure leaps with the piston barely moving. Constant volume means no work done here at all, only heat added.', cta: 'Power stroke (adiabatic)' },
      { say: 'Now it pushes back, expanding through the same ratio — but from a much higher pressure, so it returns more work than the compression took. That difference is the engine.', cta: 'Compare the efficiencies' },
    ],
    tip: 'η_Otto = 1 − r^(1−γ). At r = 8 with γ = 1.4 that is 56%, and real petrol engines manage roughly half of it once friction, heat loss and incomplete burning are counted. Diesel engines win by running r near 20.',
  },

  /* 7 ─────────────────────────────────────────────────────────────────────── */
  'fridge-and-heat-pump': {
    id: 'fridge-and-heat-pump',
    title: 'Run it backwards and you have a fridge',
    summary:
      'Take the cycle you just built and drive it anticlockwise. Work goes in, heat is carried from the cold side to the hot side, and the number that describes it is bigger than one — which is why calling it "efficiency" would be nonsense.',
    scenario: 'graphs',
    sim: 'heat-engine',
    ...attacking(
      'fridge_creates_cold',
      'A fridge makes cold and sends it into the box.',
      'There is no such thing as cold to make. A fridge MOVES heat out of the box and dumps it into the room — which is why the coils behind it are warm and why leaving the door open heats the kitchen up. Its coefficient of performance is what you moved divided by what you paid, T_c/(T_h − T_c), and it is routinely 3 or more.'
    ),
    predict: {
      prompt: 'You leave the fridge door open in a sealed kitchen and go out for the day. When you come back the room is…',
      options: ['colder', 'the same temperature', 'warmer', 'colder near the fridge, warmer far away'],
      answerIndex: 2,
      responses: [
        'The fridge only moves heat around inside the room. Nothing leaves.',
        'The motor is doing work all day, and that work ends up as heat with nowhere else to go.',
        'Correct, and warmer by exactly the electrical energy the motor consumed. Q_hot = Q_cold + W, and both Q terms stay in the room — so the net effect is a heater with extra steps.',
        'It will mix long before you get home. The net energy balance is what decides the answer.',
      ],
    },
    params: [
      pTemp('T_hot', 'Room (hot side)', 300), pTemp('T_cold', 'Inside the box', 260),
      pMoles(1), pFreedom(), pStartV(0.02), pEndV(0.05),
      pFlag('show_reservoirs', 'Show the heat flows', true),
    ],
    defaultSteps: [
      { say: 'The same four strokes as the engine, in the same order — but the loop will be traced the other way round.', cta: 'Run it anticlockwise' },
      { say: 'Every arrow has reversed. Heat now flows OUT of the cold reservoir and INTO the hot one, which is the direction heat never goes on its own.', cta: 'Show what it costs' },
      { say: 'The price is the work you feed in, which is the enclosed area again — negative this time. Q_hot = Q_cold + W: everything you took out of the box, plus everything you paid, ends up in the room.', cta: 'Read the COP' },
      { say: 'The coefficient of performance is heat moved ÷ work paid, and it is well above 1 — you are not creating energy, you are relocating it, and relocating is cheap when the temperature gap is small.', cta: 'Done' },
    ],
    tip: 'COP_fridge = T_c/(T_h − T_c) and COP_heatpump = T_h/(T_h − T_c), one more than the other. Both blow up as the gap closes and collapse as it widens — which is exactly why heat pumps struggle in a hard winter.',
  },

  /* ══ MOLECULAR CHAMBER ═══════════════════════════════════════════════════ */

  /* 8 ─────────────────────────────────────────────────────────────────────── */
  'temperature-is-mean-ke': {
    id: 'temperature-is-mean-ke',
    title: 'Temperature IS the average kinetic energy',
    summary:
      'A chamber of molecules with a live speed distribution beside it. Heat it and the whole curve slides right and flattens; push the piston in and it does the same, with no heat added anywhere. The average kinetic energy and the temperature are one reading, not two.',
    scenario: 'graphs',
    sim: 'molecular-chamber',
    ...attacking(
      'all_molecules_move_at_the_same_speed',
      'At a given temperature all the molecules of a gas move at that temperature\'s speed.',
      'They are spread over an enormous range at every instant — some barely moving, a few at three times the average — and collisions reshuffle them constantly. What temperature fixes is the AVERAGE of ½mv², and that average is (3/2)k_BT for every gas. The spread itself is the reason evaporation, reaction rates and atmospheric escape all work the way they do.'
    ),
    predict: {
      prompt: 'You push the piston in quickly, with the chamber perfectly insulated. The gas temperature…',
      options: [
        'stays the same — no heat was added',
        'rises, because the molecules bounce off an incoming wall',
        'falls, because the molecules have less room',
        'rises only if you push hard enough to break the seal',
      ],
      answerIndex: 1,
      responses: [
        'No heat was added, but WORK was. The first law counts both.',
        'Correct — and you can watch it happen molecule by molecule. A ball bouncing off a bat coming towards it leaves faster; that is the entire mechanism of adiabatic heating, with no heat involved anywhere.',
        'Less room means more frequent collisions with the walls, which raises the pressure. The speeds go up too, for the reason above.',
        'It happens at any speed of push. Pushing faster simply gives the molecules less chance to spread the energy back out.',
      ],
    },
    params: [
      pTemp('T', 'Temperature', 300), pMolarMass(32), pMolecules(120),
      pNum('piston', 'Piston position', 1, 0.4, 1, 0.01, '×'),
      pFlag('show_distribution', 'Show the speed distribution', true),
    ],
    defaultSteps: [
      { say: 'A box of oxygen molecules at 300 K, drawn at rest so nothing is claimed before it is explained. The distribution beside them is empty.', cta: 'Let them move' },
      { say: 'Each molecule has its own speed — look at the spread. The curve building beside the box is how many molecules have each speed, and it is not a spike.', cta: 'Mark the three speeds' },
      { say: 'Most probable, mean and root-mean-square, in that order, always. They differ because the curve is lopsided: there is no upper limit on speed but there is a hard floor at zero.', cta: 'Heat it up' },
      { say: 'The whole curve slides right and flattens — hotter means faster on average and MORE spread out. And ⟨½mv²⟩ tracks (3/2)k_BT exactly, which is the readout under the box.', cta: 'Done' },
    ],
    tip: 'v_rms = √(3RT/M) with M in kg/mol. The three speeds are always in the ratio √2 : √(8/π) : √3 ≈ 1 : 1.13 : 1.22, whatever the gas and whatever the temperature — a free check on any answer.',
  },

  /* 9 ─────────────────────────────────────────────────────────────────────── */
  'heavy-vs-light-gas': {
    id: 'heavy-vs-light-gas',
    title: 'Same temperature, different speeds',
    summary:
      'Put helium and oxygen in the same box at the same temperature. Their average kinetic energies are identical — they must be — so the light molecules have to be moving much faster. Watch both distributions at once.',
    scenario: 'graphs',
    sim: 'molecular-chamber',
    ...attacking(
      'heavier_gas_moves_faster_at_same_temperature',
      'A heavier molecule has more energy, so at the same temperature it must be moving faster.',
      'Same temperature means the same average ½mv² — so a bigger m forces a SMALLER v². Oxygen is eight times the mass of helium, so its molecules move √8 ≈ 2.83 times slower on average at the same temperature. That ratio is why helium leaks out of a balloon faster and why the Earth has kept its nitrogen but lost its hydrogen.'
    ),
    predict: {
      prompt: 'Helium (4 g/mol) and oxygen (32 g/mol) sit in the same box at the same temperature. Compared with the oxygen, the helium molecules move on average…',
      options: ['8× faster', '2.83× faster', 'at the same speed', '2.83× slower'],
      answerIndex: 1,
      responses: [
        '8 is the MASS ratio. Speed comes from v ∝ 1/√m, so take the square root.',
        'Correct — √8 = 2.83. Equal kinetic energies with eight times less mass means √8 times more speed.',
        'Equal ENERGIES, not equal speeds. That is exactly the swap this exercise is about.',
        'The light one moves faster, not slower — it needs more speed to carry the same energy.',
      ],
    },
    params: [
      pTemp('T', 'Temperature', 300),
      pMolarMass(4), pNum('molar_mass_b', 'Second gas molar mass', 32, 2, 200, 1, 'g/mol'),
      pMolecules(120), pFlag('show_distribution', 'Show both distributions', true),
    ],
    defaultSteps: [
      { say: 'Two gases, one box, one temperature. Nothing distinguishes them except the mass of a molecule.', cta: 'Release both' },
      { say: 'The light molecules are visibly quicker. Before reading anything, guess the ratio — most people say 8, because that is the mass ratio.', cta: 'Show both curves' },
      { say: 'Two distributions, two peaks, one temperature. The light gas peaks far to the right and is far more spread out.', cta: 'Compare the mean energies' },
      { say: 'And the two mean kinetic energies are the same number. That is what "same temperature" means, and the speed ratio √(M₂/M₁) = 2.83 falls straight out of it.', cta: 'Done' },
    ],
    tip: 'Graham\'s law of effusion — rate ∝ 1/√M — is this exact result wearing a different hat. If you can recall "equal temperature means equal ½mv²", you never need to memorise it separately.',
  },

  /* ══ FLUID BENCH ═════════════════════════════════════════════════════════ */

  /* 10 ────────────────────────────────────────────────────────────────────── */
  'continuity-and-bernoulli': {
    id: 'continuity-and-bernoulli',
    title: 'Squeeze the pipe — does the pressure go up?',
    summary:
      'The flagship. Drag the pipe\'s cross-sections and watch three numbers move: speed rises where it narrows, and the pressure gauge falls at exactly that place. A live ledger shows the three Bernoulli terms trading while their total refuses to budge.',
    scenario: 'graphs',
    sim: 'fluid-bench',
    ...attacking(
      'narrow_pipe_means_higher_pressure',
      'Squeezing the pipe forces the water together, so the pressure there must be higher.',
      'The opposite, and the gauge proves it. Narrowing speeds the water up (nothing can pile up in a rigid pipe), and speeding up costs energy — which has to come out of the pressure term, because the height has not changed. P + ½ρv² + ρgh is constant along the streamline, so if ½ρv² goes up, P goes down. This is what lifts a wing and what pulls a shower curtain in against you.'
    ),
    predict: {
      prompt: 'Water flows steadily through a pipe that narrows to half its radius. At the narrow section, compared with the wide section:',
      options: [
        'faster and higher pressure',
        'faster and lower pressure',
        'slower and higher pressure',
        'same speed, higher pressure',
      ],
      answerIndex: 1,
      responses: [
        'The speed part is right and it is the reason the pressure part is wrong: that extra speed had to be paid for out of the pressure.',
        'Correct. Half the radius is a quarter of the area, so FOUR times the speed — and ½ρv² grows sixteenfold, all of it taken from P.',
        'Nothing can slow down going into a constriction without water piling up, and water does not pile up in a rigid full pipe.',
        'A₁v₁ = A₂v₂ forbids the same speed unless the area is the same.',
      ],
    },
    params: [
      pInletRadius(0.06), pThroatRadius(0.03), pOutletRadius(0.06),
      pInletSpeed(1.2), pInletPressure(150), pThroatHeight(0), pFluidDensity(1000),
      pFlag('show_ledger', 'Show the Bernoulli ledger', true),
    ],
    defaultSteps: [
      { say: 'A pipe of constant width with water flowing steadily through it. Three gauges along it all read the same, and nothing is moving faster anywhere.', cta: 'Narrow the middle' },
      { say: 'Now drag the middle section thinner. Before looking at the gauges: the same amount of water must pass every second, so what has to happen to the speed?', cta: 'Show the speeds' },
      { say: 'Four times faster through half the radius — because area goes as r². Now look at the middle gauge.', cta: 'Show the pressure' },
      { say: 'It has FALLEN. The ledger below shows why: the ½ρv² bar has grown by exactly what the P bar lost, and the total has not moved a pixel.', cta: 'Done' },
    ],
    tip: 'Use continuity first (A₁v₁ = A₂v₂) to get the speeds, then Bernoulli to get the pressures. Doing it the other way round leaves you with two unknowns in one equation — and remember area goes as r², so halving a radius quadruples a speed.',
  },

  /* ══ BUOYANCY LAB ════════════════════════════════════════════════════════ */

  /* 11 ────────────────────────────────────────────────────────────────────── */
  'float-or-sink': {
    id: 'float-or-sink',
    title: 'What actually decides whether it floats?',
    summary:
      'Drop objects of your own mass and volume into fluids of your own density. A one-tonne block of wood floats and a one-gram bolt sinks, and the reading that predicts it every time is not the mass.',
    scenario: 'graphs',
    sim: 'buoyancy-lab',
    ...attacking(
      'buoyancy_depends_on_object_mass',
      'Heavy things sink and light things float.',
      'Upthrust is ρ_fluid × V_displaced × g — the object\'s mass does not appear in it anywhere. What decides the outcome is the RATIO of the two densities. A steel ship weighing 50 000 tonnes floats because its hull shoves aside more than 50 000 tonnes of water; melt it into a solid cube and the same steel sinks instantly.'
    ),
    predict: {
      prompt: 'An ice cube floats in a glass of water with 92% of it submerged. What is the density of ice?',
      options: ['92 kg/m³', '917 kg/m³', '1087 kg/m³', 'You cannot tell without the mass'],
      answerIndex: 1,
      responses: [
        'That is the percentage read as a density. The submerged fraction is the density RATIO, so multiply by the water\'s 1000.',
        'Correct: submerged fraction = ρ_object/ρ_fluid, so ρ_ice = 0.917 × 1000 = 917 kg/m³. The 8% above water is the iceberg tip everyone quotes.',
        'That is denser than water, which would sink.',
        'You can, and that is the point — the floating fraction contains the whole answer, whatever the size of the cube.',
      ],
    },
    params: [
      pObjectMass(0.6), pObjectVolume(0.001), pFluidDensity(1000),
      pFlag('show_forces', 'Draw the free-body diagram', true),
    ],
    defaultSteps: [
      { say: 'An object held just above the surface, with its weight drawn. Nothing else acts on it yet.', cta: 'Lower it in' },
      { say: 'As it enters, an upward force appears and grows — and it grows in step with how much water has been pushed aside, not with how heavy the object is.', cta: 'Let it settle' },
      { say: 'It settles where the upthrust exactly equals the weight. That balance point is what "floating" means, and the fraction under water is ρ_object/ρ_fluid.', cta: 'Make it denser than water' },
      { say: 'Now even fully submerged the upthrust cannot match the weight, so it keeps going down. The shortfall is what a spring balance would read underwater — its apparent weight.', cta: 'Done' },
    ],
    tip: 'Floating fraction = ρ_object/ρ_fluid. Apparent weight when fully submerged = W − ρ_fluid V g. Between them these two lines answer almost every buoyancy question, and neither needs you to find the mass first.',
  },

  /* 12 ────────────────────────────────────────────────────────────────────── */
  'terminal-velocity': {
    id: 'terminal-velocity',
    title: 'Terminal velocity is a free-body diagram that closed',
    summary:
      'Drop a ball into a viscous fluid with its three forces drawn live. Weight is fixed, upthrust is fixed, drag grows with speed — and the ball stops accelerating at the exact instant the three add to zero. Nothing else happens; that IS terminal velocity.',
    scenario: 'graphs',
    sim: 'buoyancy-lab',
    ...attacking(
      'terminal_velocity_means_no_forces',
      'At terminal velocity there are no forces on the ball any more.',
      'There are three, and they are all large. Weight pulls down, upthrust and viscous drag push up, and at terminal velocity they happen to CANCEL. Zero net force means zero acceleration, not zero force — the same distinction as a book resting on a table, which is being pushed just as hard as it is being pulled. This is the FBD Studio idea (§5.1) applied in a fluid: the answer is the balance point, and it is only ever the balance point.'
    ),
    predict: {
      prompt: 'A ball falls at terminal velocity in oil. You swap it for one of the same size but twice the mass. Its new terminal velocity is…',
      options: [
        'the same — terminal velocity is a property of the fluid',
        'a bit more than twice as fast',
        'exactly twice as fast',
        'half as fast',
      ],
      answerIndex: 1,
      responses: [
        'The fluid sets how much drag each m/s costs. What has to be balanced is the object\'s own net downward pull, and that just doubled.',
        'Correct, and the "a bit more" matters: v_t = (mg − ρ_f V g)/6πηr. Doubling m doubles the first term but leaves the upthrust term alone, so the numerator MORE than doubles.',
        'It would be exactly twice if there were no upthrust. The buoyant term is subtracted before the doubling, so the answer is slightly above 2×.',
        'A heavier ball needs more drag to balance it, and more drag means more speed.',
      ],
    },
    params: [
      pObjectMass(0.004), pBallRadius(0.005), pViscosity(1), pFluidDensity(1260),
      pFlag('show_forces', 'Draw the free-body diagram', true),
      pFlag('show_graph', 'Plot speed against time', true),
    ],
    defaultSteps: [
      { say: 'A ball at rest at the surface of a jar of glycerine. Two forces so far: weight down, upthrust up — and the upthrust is not enough.', cta: 'Release it' },
      { say: 'It accelerates, and a third arrow appears and grows: viscous drag, proportional to how fast it is going. Notice the acceleration shrinking as that arrow lengthens.', cta: 'Watch the arrows close' },
      { say: 'The three arrows now sum to zero. From this instant the speed is constant — not because nothing acts on the ball, but because everything acting on it cancels.', cta: 'Show the speed graph' },
      { say: 'The curve flattens onto v_t = (mg − ρ_f V g)/6πηr and never quite touches it. Strictly it takes forever; practically, after about three time constants you cannot tell.', cta: 'Done' },
    ],
    tip: 'Set ΣF = 0 and solve for v — that is the whole method, and it works for a raindrop, a parachutist and a ball bearing alike. Only the drag law changes: 6πηrv when the flow is smooth, kv² once it is turbulent.',
  },
};

/** Stable ordering for pickers and for the admin editor's archetype list. */
export const THERMO_ARCHETYPE_IDS: string[] = Object.keys(THERMO_ARCHETYPES);

/** Look-up that tolerates an unknown id — an authoring typo must degrade, not crash. */
export const thermoArchetype = (id?: string): ThermoArchetype | undefined =>
  id ? THERMO_ARCHETYPES[id] : undefined;

/** Which bench an id belongs to, for the dispatcher. */
export const thermoSimOf = (id?: string): ThermoArchetype['sim'] | undefined =>
  thermoArchetype(id)?.sim;
