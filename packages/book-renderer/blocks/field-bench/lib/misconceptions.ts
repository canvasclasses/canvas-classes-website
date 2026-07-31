/*
 * field-bench/lib/misconceptions.ts — the named wrong ideas, and what to say.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * Design law #2: feedback names the specific belief it is attacking, never just
 * "wrong". Every archetype declares a `targets` code; this file is the copy
 * that code resolves to, and `FieldLab` / `PhotoelectricBench` render it as a
 * card the moment the sim has SHOWN the contradicting evidence — never as a
 * preamble, because telling a student the punchline before the demonstration
 * turns a discovery into a fact to memorise.
 *
 * ⚠ A `targets` field proves intent, never delivery. Phase 1 shipped 22
 * misconception codes that were declared and then never read by any feedback
 * path. Every code below is reached by a real render site; `evidenceFor`
 * documents which one, and adding a code here without wiring its trigger is the
 * failure mode this comment exists to prevent.
 *
 * ⚠ THE `Record<FieldMisconception, FieldIssue>` ANNOTATION IS LOAD-BEARING. It
 * is exhaustive by design, so adding a code to the union without copy here is a
 * COMPILE ERROR rather than a card that renders blank. Never weaken it to a
 * Partial to make something compile — that guard is the whole reason the missing
 * copy could not ship.
 */

import type { FieldIssue, FieldMisconception } from '../types';

export const FIELD_ISSUES: Record<FieldMisconception, FieldIssue> = {
  field_lines_are_paths: {
    code: 'field_lines_are_paths',
    message: 'A field line is not a route. It shows which way the FORCE points at that spot — and force changes velocity, it does not set it.',
    hint: 'The path only lies along the line when the charge starts at rest AND the line is straight. Break either and it cuts across.',
  },
  flux_depends_on_surface_shape: {
    code: 'flux_depends_on_surface_shape',
    message: 'The shape of the surface is not in Gauss\'s law. A circle, a box, a shape you drew badly — same enclosed charge, same flux.',
    hint: 'Where the surface is closer, the field is stronger but there is less of it. The two changes cancel exactly.',
  },
  flux_depends_on_position_inside: {
    code: 'flux_depends_on_position_inside',
    message: 'Where the charge sits inside makes no difference at all. Only whether it is inside.',
    hint: 'Off-centre changes the field at every point on the surface — and adds nothing to the total, because every extra line out one side is a missing line on the other.',
  },
  field_inside_conductor_nonzero: {
    code: 'field_inside_conductor_nonzero',
    message: 'Inside the metal the field is exactly zero — computed here from the induced charges, not drawn in.',
    hint: 'If it were not zero, the free electrons would still be moving. They move until it is zero, and then they stop. That IS electrostatic equilibrium.',
  },
  equipotential_not_perpendicular: {
    code: 'equipotential_not_perpendicular',
    message: 'Field lines meet equipotentials at 90°, everywhere, with no exceptions.',
    hint: 'Moving along an equipotential costs no work. If the field had any component along it, that move would cost work — so it cannot.',
  },
  magnetic_force_does_work: {
    code: 'magnetic_force_does_work',
    message: 'A magnetic force does zero work. It bends the path and never changes the speed.',
    hint: 'F = qv×B is perpendicular to v at every instant, and a force at 90° to the motion can neither add nor remove kinetic energy.',
  },
  field_needs_a_test_charge: {
    code: 'field_needs_a_test_charge',
    message: 'The field is there whether or not anything is there to feel it. The probe reveals it; it does not create it.',
    hint: 'E = F/q is how you MEASURE it, not what it is. Take the probe away and the field it measured is unchanged.',
  },
  potential_is_potential_energy: {
    code: 'potential_is_potential_energy',
    message: 'Potential (volts) belongs to the point. Potential energy (joules) belongs to the point AND the charge you put there.',
    hint: 'U = qV. Same point, double the charge, double the energy — while V has not moved.',
  },
  g_constant_inside_earth: {
    code: 'g_constant_inside_earth',
    message: 'g is not constant underground and it is not biggest at the centre. It falls in a straight line to zero at the centre.',
    hint: 'Everything above you pulls up as well as down and cancels exactly. Only the ball of mass below you counts, and it shrinks as r³.',
  },

  // ── Electromagnetic induction (unit 11) ────────────────────────────────────
  // Declared by an EMI archetype's `targets` and rendered by `emi/EmiBench.tsx`
  // once the demonstration has happened — the loop has been fully inside AND
  // moving, the tilt has passed 45°, the loop has travelled BOTH ways, two slot
  // counts have been compared, the hold segment has been reached. Never as a
  // preamble: telling a student the punchline before the demonstration turns a
  // discovery into a fact to memorise.
  emf_from_flux_not_its_rate: {
    code: 'emf_from_flux_not_its_rate',
    message:
      'A big flux is not a big EMF. Faraday\'s law contains the RATE, not the amount: '
      + 'a loop sitting still in the strongest field on this page reads exactly zero.',
    hint:
      'The loop that is completely inside the band has the most flux it will ever have — and no EMF. '
      + 'The loop half-way in has less flux and plenty of EMF. Only the CHANGE counts.',
  },
  flux_ignores_orientation: {
    code: 'flux_ignores_orientation',
    message:
      'Flux is not "field times area". It is field times the area the field actually threads: '
      + 'Φ = B A cos θ.',
    hint:
      'Turn the loop edge-on and the flux is exactly zero, with the same field and the same loop. '
      + 'The field now runs ALONG the loop instead of through it, so it links none of it.',
  },
  induced_current_has_a_fixed_direction: {
    code: 'induced_current_has_a_fixed_direction',
    message:
      'The induced current has no favourite direction. Push the loop in and it runs one way; '
      + 'pull the same loop out of the same field and it runs the other.',
    hint:
      'Lenz\'s law opposes the CHANGE, not the field. Flux rising, the current fights the rise; '
      + 'flux falling, the very same current fights the fall — which means it now flows the other way round.',
  },
  inductor_opposes_current_not_change: {
    code: 'inductor_opposes_current_not_change',
    message:
      'An inductor does not oppose current. It opposes the CHANGE in current — so a large steady '
      + 'current produces no back-EMF at all.',
    hint:
      'Hold the current flat at its peak: dI/dt is zero, so ε = −L dI/dt is zero. Then ramp it '
      + 'DOWN and the EMF flips sign and starts pushing the current along. That is why a switch arcs.',
  },
  steady_current_induces_a_secondary_emf: {
    code: 'steady_current_induces_a_secondary_emf',
    message:
      'A steady current in the primary induces nothing in the secondary. Mutual inductance '
      + 'responds to dI₁/dt, and a constant current has none.',
    hint:
      'This is why a transformer only works on AC, and why the DC that runs your phone has to be '
      + 'chopped up before a transformer can touch it.',
  },
  eddy_currents_are_about_being_metal: {
    code: 'eddy_currents_are_about_being_metal',
    message:
      'Braking is not about the plate being metal. It is about how BIG a loop the metal lets '
      + 'the current go round — cut the loops small and the same metal barely brakes.',
    hint:
      'Slots do not add resistance to a path so much as forbid the large paths. '
      + 'Each little loop has a smaller EMF, and the total heating falls in proportion to the slot width.',
  },
  induced_effects_are_free_energy: {
    code: 'induced_effects_are_free_energy',
    message:
      'The resistor gets hot because something is doing work on the rod — your hand, or gravity — '
      + 'not because the magnet is generous. Every joule in the circuit came from there.',
    hint:
      'Watch the two power readouts. Mechanical power supplied and electrical power dissipated are '
      + 'the same number, to every digit. Stop pushing and the current stops with you.',
  },
  // ── Nuclear physics (unit 13) ──────────────────────────────────────────────
  //
  // The Nuclear Bench renders these from its own evidence gates, listed in
  // `evidenceFor` below. All six lead with `belief` — a nuclear misconception is
  // usually held confidently and phrased in the student's own words, so quoting it
  // back is what stops the correction being skimmed.
  bigger_nucleus_more_tightly_bound: {
    code: 'bigger_nucleus_more_tightly_bound',
    belief: 'Heavier nuclei are more tightly bound, because they have more binding energy.',
    message:
      'Uranium has 1801 MeV of binding energy and helium has 28 — and helium is the more tightly '
      + 'bound of the two. Total binding energy grows with size and tells you almost nothing. '
      + 'Binding energy PER NUCLEON is the quantity that decides what a nucleus will do.',
    hint:
      'Per nucleon, uranium is 7.57 MeV and helium is 7.07 — but iron-56 is 8.79. Uranium is ABOVE '
      + 'the peak, helium is below it, and each of them can move toward it. That is the whole '
      + 'chapter in one sentence.',
  },
  mass_and_energy_are_separate: {
    code: 'mass_and_energy_are_separate',
    belief: 'Mass and energy are separate things. Mass is stuff; energy is what stuff does.',
    message:
      'The missing 0.03038 u did not go anywhere. It IS the 28.296 MeV. Mass is one of the forms '
      + 'energy comes in, and E = Δmc² is the exchange rate — 931.494 MeV per atomic mass unit.',
    hint:
      'This is not a nuclear speciality. A stretched spring and a warm cup of tea are both '
      + 'measurably heavier than the same objects at rest and cold. The nucleus is simply the one '
      + 'place where the effect is 0.8% instead of 0.000000001%, so you can see it.',
  },
  fission_energy_from_size_not_binding: {
    code: 'fission_energy_from_size_not_binding',
    belief: 'Fission releases energy because uranium is unstable and big things break.',
    message:
      'Size is not the reason. Uranium releases energy on splitting because it sits at 7.59 MeV per '
      + 'nucleon and its fragments sit at 8.33 and 8.51 — ABOVE it, closer to the peak. Every '
      + 'nucleon in the fragments is more tightly bound than it was, and the difference comes out '
      + 'as energy.',
    hint:
      'Check it: the climb is 0.734 MeV per nucleon, there are 236 nucleons, and 0.734 × 236 = '
      + '173 MeV — the exact Q value from the mass table. The curve is not an illustration of the '
      + 'energy, it IS the energy.',
  },
  fission_and_fusion_are_opposites: {
    code: 'fission_and_fusion_are_opposites',
    belief:
      'Fusion and fission are opposites, so if one releases energy the other must absorb it.',
    message:
      'Both release energy, and for the identical reason: both move nucleons toward the peak of the '
      + 'binding-energy curve. Light nuclei are below the peak and climb by JOINING; heavy nuclei '
      + 'are above it and climb by SPLITTING. Nothing is reversed except the direction of travel '
      + 'along one axis.',
    hint:
      'The test of whether a reaction gives out energy is never "is it fission or fusion?" — it is '
      + '"did the average binding energy per nucleon go up?". Fusing two iron nuclei would move '
      + 'DOWN the curve and cost energy, which is exactly why a star dies at iron.',
  },
  half_life_is_half_the_lifetime: {
    code: 'half_life_is_half_the_lifetime',
    belief:
      'Half-life is half the time it takes to decay away — so after two half-lives there is none left.',
    message:
      'After two half-lives a QUARTER is left, not zero. After three, an eighth. There is no number '
      + 'of half-lives that finishes the job, because each one halves what is there rather than '
      + 'removing a fixed amount.',
    hint:
      'The reason is that nuclei have no memory. A nucleus that has already survived ten half-lives '
      + 'is exactly as likely to decay in the next second as a brand new one — so the survivors '
      + 'always face the same fresh halving, forever.',
  },
  nucleus_contains_electrons: {
    code: 'nucleus_contains_electrons',
    belief:
      'In beta-minus decay an electron that was sitting inside the nucleus is thrown out.',
    message:
      'There are no electrons in a nucleus. A NEUTRON turns into a proton, and the electron is '
      + 'created at that instant along with an antineutrino. That is why the proton number goes up '
      + 'by one while the nucleon number does not move at all.',
    hint:
      'The proof is on the chart: a free neutron, with no nucleus around it, does exactly this in '
      + 'about ten minutes. Nothing was stored and released — a neutron simply becomes a proton, an '
      + 'electron and an antineutrino, because that combination weighs 0.782 MeV less.',
  },
};

export const issueFor = (code?: FieldMisconception): FieldIssue | null =>
  code ? FIELD_ISSUES[code] ?? null : null;

/**
 * The evidence each code needs before its card may appear — the render sites
 * that make the declaration real, listed so a reviewer can check the wiring
 * without reading three components.
 *
 * field_lines_are_paths          → FieldLab, once a trajectory has been run
 * flux_depends_on_surface_shape  → FieldLab, once the surface size or shape changed
 * flux_depends_on_position_inside→ FieldLab, once the surface has been dragged
 * field_inside_conductor_nonzero → FieldLab, once a surface sits inside the metal
 * equipotential_not_perpendicular→ FieldLab, once the probe reads a crossing angle
 * magnetic_force_does_work       → FieldLab, once a trajectory has been run
 * field_needs_a_test_charge      → FieldLab, once the probe has been moved
 * potential_is_potential_energy  → FieldLab (probe moved) / PhotoelectricBench (V₀ read)
 * g_constant_inside_earth        → FieldLab, once the probe has been inside the planet
 *
 * bigger_nucleus_more_tightly_bound    → NuclearBench/CurveView, once a SECOND
 *                                        nuclide has been inspected (one alone
 *                                        contradicts nothing)
 * mass_and_energy_are_separate         → NuclearBench/DefectView, once Δm has been
 *                                        converted and the joules are on screen
 * fission_energy_from_size_not_binding → NuclearBench/CurveView, once the climb has
 *                                        been MEASURED (reveal rung 3)
 * fission_and_fusion_are_opposites     → NuclearBench/CurveView, same gate, on a
 *                                        fusion archetype
 * half_life_is_half_the_lifetime       → NuclearBench/DecayView, once the SECOND
 *                                        half-life has run and a quarter is visibly
 *                                        left — never before the prediction
 * nucleus_contains_electrons           → NuclearBench/ModesView, once the arrow has
 *                                        been drawn and the two sums have balanced
 *
 * emf_from_flux_not_its_rate            → FluxMachine / GeneratorBench, once the loop
 *                                         has been fully inside AND moving, or turned edge-on
 * flux_ignores_orientation              → FluxMachine, once the tilt has passed 45°
 * induced_current_has_a_fixed_direction → FluxMachine, once the loop has run BOTH ways
 * induced_effects_are_free_energy       → MotionalEmf, once both power rows are shown
 * eddy_currents_are_about_being_metal   → EddyBrake, once two slot counts have been compared
 * inductor_opposes_current_not_change   → InductanceBench, once the hold segment is reached
 * steady_current_induces_a_secondary_emf→ InductanceBench, once the hold segment is reached
 */
export const EVIDENCE_NOTE = 'Cards fire after the demonstration, never before it.';
