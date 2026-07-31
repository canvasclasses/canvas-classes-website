/*
 * motion-lab/archetypes.waves.ts — the oscillations & waves rung ladder.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE DATA. No React, no DOM, no physics. Unit 8 of the catalogue
 * (PHYSICS_SIMULATION_PROGRAM.md §4): SHM Bench and Wave Studio are flagships,
 * Doppler Bench and Resonance Rig are standard rungs on the same engine.
 *
 * The engine ships once as code; each exercise on each page is a block naming
 * ONE id here plus params. Extending what the benches CAN do is code; building
 * an exercise is data.
 *
 * ── WHAT PHASE 1's AUDIT CHANGED ABOUT THIS TABLE ───────────────────────────
 * `PHYSICS_SIM_QA_2026-07-29.md` found twenty-two `targets` misconception codes
 * sitting in archetype data wired to no UI at all, several archetypes whose
 * guide text instructed an action the interface could not perform, and predict
 * gates whose three wrong options all received byte-identical feedback. Three
 * rules came out of that and every entry below obeys them:
 *
 *   1. `attacks` carries the wrong belief AND the sentence that breaks it, so
 *      an unwired archetype is visibly missing copy rather than silently
 *      missing behaviour. The verifier asserts both strings are present.
 *   2. `predict.responses` has ONE LINE PER OPTION. Three different wrong
 *      answers are three different pieces of reasoning and get three different
 *      replies.
 *   3. Every `params` key an archetype declares is surfaced as a live control
 *      by the bench that renders it. A declared parameter with no slider was
 *      the single most common decoration in Phase 1.
 *
 * `scenario: 'graphs'` throughout — see `waves/types.ts` for why, and the build
 * report for the shared-type additions that would let these say `'waves'`.
 */

import type { WavesArchetype, WavesArchetypeMap } from './waves/types';
import {
  attacking, pFlag,
  pMass, pSpring, pAmplitude, pLength, pAngle0, pGravity,
  pWaveAmp, pWavelength, pFrequency, pStringLength, pTension, pDensity, pHarmonic,
  pSoundSpeed, pEmitted, pSourceV, pObserverV,
  pDamping, pDrive, pDriveOmega, pNum,
} from './waves/types';

export const WAVES_ARCHETYPES: WavesArchetypeMap = {
  /* ══ SHM BENCH ═══════════════════════════════════════════════════════════ */

  /* 1 ─────────────────────────────────────────────────────────────────────── */
  'spring-shm': {
    id: 'spring-shm',
    title: 'Pull it further — does it take longer?',
    summary:
      'Set the mass and the stiffness, drag the block out to wherever you like, and let go. Then do it again from twice as far. Two swings, one stopwatch, and a result almost nobody predicts correctly.',
    scenario: 'graphs',
    sim: 'shm-bench',
    ...attacking(
      'shm_period_depends_on_amplitude',
      'A bigger pull means a bigger swing, so it must take longer to get back.',
      'Pull it twice as far and it has twice as far to travel — but the spring pulls back twice as hard the whole way, so it also moves twice as fast. The two cancel exactly. T = 2π√(m/k) has no A in it, and that absence is not an oversight.'
    ),
    predict: {
      prompt: 'You release the block from 10 cm instead of 5 cm. What happens to the time for one complete oscillation?',
      options: ['It roughly doubles', 'It gets a bit longer', 'It stays exactly the same', 'It gets shorter'],
      answerIndex: 2,
      responses: [
        'Doubling the distance is only half the story — the restoring force doubles too, so it covers that longer path proportionally faster. Watch both blocks reach the centre at the same instant.',
        'This is the common instinct and it is close to right for a pendulum swung too far — but a spring is exactly linear, so there is no "a bit". The period does not move at all.',
        'Correct, and the reason matters: force ∝ displacement means every part of the journey scales together. This is what makes it SIMPLE harmonic rather than merely oscillating.',
        'Nothing here got stiffer or lighter, so nothing can speed the cycle up. Only m and k can change T.',
      ],
    },
    params: [pMass(0.5), pSpring(20), pAmplitude(0.2), pFlag('compare_amplitude', 'Race a half-amplitude twin', true)],
    defaultSteps: [
      { say: 'A block on a spring, at rest at its natural length. Nothing is moving and nothing will move until you pull it.', cta: 'Show the equilibrium line' },
      { say: 'Drag the block sideways — that is the amplitude A. The spring now pulls back with force kx, and the further you pull, the harder it pulls. Let go and it will overshoot.', cta: 'Release it' },
      { say: 'A second, paler block is released from HALF that amplitude at the same instant. Watch where the two are when either one reaches the centre.', cta: 'Compare the two' },
      { say: 'They cross the centre together, they turn together, they arrive back together — for ever. Same mass, same spring, same period, whatever the amplitude.', cta: 'Read the period' },
    ],
    tip: 'T = 2π√(m/k) contains only the mass and the stiffness. If a question changes the amplitude and asks about the period, the answer is "unchanged" — and that is worth checking before you compute anything.',
  },

  /* 2 ─────────────────────────────────────────────────────────────────────── */
  'circle-of-reference': {
    id: 'circle-of-reference',
    title: 'SHM is the shadow of a circle',
    summary:
      'A point runs round a circle at a steady rate. Its shadow on the diameter is not merely LIKE simple harmonic motion — it is simple harmonic motion, exactly, and the same expression drives both. Watch them run in lockstep.',
    scenario: 'graphs',
    sim: 'shm-bench',
    ...attacking(
      'shm_and_circular_motion_unrelated',
      'Circular motion and oscillation are two different chapters that happen to both use ω.',
      'They are one motion. x = A cos(ωt) is the x-coordinate of a point going round a circle of radius A at ω rad/s — so ω really is an angular velocity here, A really is a radius, and the phase really is an angle. Every SHM formula you have memorised is a piece of circle geometry.'
    ),
    predict: {
      prompt: 'The reference point is at the TOP of its circle. Where is the oscillator, and how fast is it moving?',
      options: [
        'At the far right, momentarily still',
        'At the centre, moving at its fastest',
        'At the centre, momentarily still',
        'At the far left, moving at its fastest',
      ],
      answerIndex: 1,
      responses: [
        'That is where the reference point sits when it is at the RIGHT of the circle, not the top. At the top its shadow has been dragged all the way back to the middle.',
        'Correct. At the top the reference point is moving straight left — entirely horizontal — so the whole of its speed Aω shows up in the shadow. Maximum displacement and maximum speed are at opposite ends of the swing.',
        'The position is right and the speed is not. At the top the reference point\'s velocity is purely horizontal, so the shadow inherits all of it.',
        'Left and right are set by the cosine: at the top, cos 90° = 0, so the shadow is at the centre. The speed part of your answer is right.',
      ],
    },
    params: [pAmplitude(0.2), pNum('period', 'Time for one turn', 2, 0.5, 6, 0.1, 's'), pFlag('show_phasor', 'Show the phase angle', true)],
    defaultSteps: [
      { say: 'On the left, a point about to travel round a circle of radius A at a steady rate. On the right, a block on a spring. Nothing connects them yet.', cta: 'Start the circle' },
      { say: 'Now drop a perpendicular from the point onto the horizontal diameter. That foot is the shadow. Its position is A cos(θ) — nothing else.', cta: 'Attach the shadow to the block' },
      { say: 'The block is now driven by the shadow, and it is doing exactly what a block on a spring does. Same overshoot, same slowing near the ends, same everything.', cta: 'Show the velocity' },
      { say: 'The reference point\'s speed is Aω, always, and the shadow gets whatever part of it is horizontal. At the ends that part is zero; at the centre it is all of it.', cta: 'Done' },
    ],
    tip: 'When an SHM question mentions "phase", draw the circle. "π/2 out of phase" means a quarter turn, and questions about where the body is at a given phase become questions about where a point is on a circle — which you can see.',
  },

  /* 3 ─────────────────────────────────────────────────────────────────────── */
  'shm-velocity-and-acceleration': {
    id: 'shm-velocity-and-acceleration',
    title: 'Where is it fastest, and where is the pull biggest?',
    summary:
      'Step the oscillator through one cycle with both arrows drawn. The velocity arrow and the acceleration arrow are never long at the same moment — they are exactly a quarter cycle apart, and finding out where each one dies is the whole of this topic.',
    scenario: 'graphs',
    sim: 'shm-bench',
    ...attacking(
      'shm_v_and_a_peak_together',
      'The block is being pulled hardest where it is moving fastest — that is why it is moving fastest.',
      'The opposite. a = −ω²x, so the pull is biggest exactly where the block has stopped, and it is ZERO at the centre where the block is flying through at its fastest. The force does not maintain the speed; it is what turns the block around.'
    ),
    predict: {
      prompt: 'At the instant the block is momentarily at rest at the end of its swing, what is its acceleration?',
      options: ['Zero — it is not moving', 'Maximum, pointing back to the centre', 'Maximum, pointing outwards', 'It depends on the mass'],
      answerIndex: 1,
      responses: [
        'Zero velocity and zero acceleration are different statements. If the acceleration were zero here the block would simply stay put — and a stretched spring never does.',
        'Correct. The spring is stretched furthest, so it pulls hardest, so a = −ω²A pointing home. That is precisely why the block does not stay at the end.',
        'The spring is stretched, so it PULLS the block back in. An outward force at the extreme would fling it away and there would be no oscillation at all.',
        'a = −ω²x, and ω² = k/m, so a heavier block does accelerate less — but the direction and the "maximum here" part are fixed whatever the mass.',
      ],
    },
    params: [pMass(0.5), pSpring(20), pAmplitude(0.2), pFlag('show_arrows', 'Draw v and a arrows', true)],
    defaultSteps: [
      { say: 'One oscillator, stepped by hand rather than played. Two arrows will follow it: velocity in one colour, acceleration in the other.', cta: 'Go to the far end' },
      { say: 'At the extreme the velocity arrow has vanished and the acceleration arrow is at its longest, pointing straight back at the centre. Nothing is moving; everything is being pulled.', cta: 'Step to the centre' },
      { say: 'At the centre it has swapped completely: full speed, zero acceleration. The spring is at its natural length here, so it is not pulling at all — the block is coasting through.', cta: 'Show both graphs' },
      { say: 'On the graphs, v peaks a quarter cycle after x, and a is the mirror image of x. That quarter-cycle offset is the same 90° you saw on the reference circle.', cta: 'Done' },
    ],
    tip: 'v = ω√(A² − x²) and a = −ω²x. Between them they answer every "find the speed at this displacement" question without ever needing t — and neither of them contains a sine or a cosine you have to guess the phase of.',
  },

  /* 4 ─────────────────────────────────────────────────────────────────────── */
  'pendulum-small-angle': {
    id: 'pendulum-small-angle',
    title: 'What actually changes a pendulum\'s period?',
    summary:
      'Three sliders: the bob\'s mass, the string\'s length, and gravity. Change each in turn and watch which of them the stopwatch notices. One of the three does nothing at all.',
    scenario: 'graphs',
    sim: 'shm-bench',
    ...attacking(
      'pendulum_period_depends_on_mass',
      'A heavier bob is pulled down harder, so it must swing faster.',
      'It is pulled harder AND it is harder to move, in exactly the same proportion — the m cancels, as it always does when gravity is the only thing acting. T = 2π√(l/g) has no mass in it. This is the pendulum version of "everything falls at the same rate".'
    ),
    predict: {
      prompt: 'You swap the bob for one four times heavier, keeping the same string. The period…',
      options: ['halves', 'doubles', 'is unchanged', 'quadruples'],
      answerIndex: 2,
      responses: [
        'Nothing here got shorter or moved to a stronger gravity, and those are the only two things that can shorten the period.',
        'Four times the weight is also four times the inertia. The extra pull is exactly spent on moving the extra mass.',
        'Correct. Mass cancels out of the equation of motion — the same cancellation that makes a feather and a hammer land together on the Moon.',
        'Quadrupling the LENGTH would double the period (√4 = 2). Quadrupling the mass does nothing.',
      ],
    },
    params: [pLength(1), pMass(0.5), pGravity(9.8), pAngle0(8)],
    defaultSteps: [
      { say: 'A simple pendulum, released from a small angle. The period readout is measured from the swing itself, not quoted from a formula.', cta: 'Swing it' },
      { say: 'Now drag the MASS slider from one end to the other while it swings. Watch the period readout — not the picture, the number.', cta: 'Try the length instead' },
      { say: 'Length moves it immediately, and not proportionally: four times the length gives twice the period, because of the square root.', cta: 'Try gravity' },
      { say: 'Gravity is the other one that matters, and it works the opposite way — stronger gravity, faster swing. On the Moon (1.6 m/s²) this same pendulum takes about two and a half times as long.', cta: 'Done' },
    ],
    tip: 'T = 2π√(l/g). To double a pendulum\'s period you need FOUR times the length. Seconds-pendulum questions ("T = 2 s") are asking for l = g/π² ≈ 0.99 m — worth knowing by heart.',
  },

  /* 5 ─────────────────────────────────────────────────────────────────────── */
  'pendulum-large-angle': {
    id: 'pendulum-large-angle',
    title: 'Push it past small angles and the formula drifts',
    summary:
      'T = 2π√(l/g) is not the period of a pendulum. It is the period of a pendulum swinging through a SMALL angle, and the derivation quietly replaced sin θ with θ to get there. Drag the release angle up and watch the two clocks separate.',
    scenario: 'graphs',
    sim: 'shm-bench',
    ...attacking(
      'pendulum_always_simple_harmonic',
      'A pendulum performs SHM. That is what a pendulum is.',
      'A pendulum performs SHM only for small swings. The real restoring torque goes as sin θ, not θ, and sin θ is SMALLER than θ — so a wide swing is pulled back a little less eagerly than the formula assumes and takes measurably longer. At 60° the real period is about 7% above 2π√(l/g), and no amount of care with the arithmetic recovers that.'
    ),
    predict: {
      prompt: 'Released from 60° instead of 5°, the real period is…',
      options: ['about 7% SHORTER', 'exactly the same', 'about 7% LONGER', 'about twice as long'],
      answerIndex: 2,
      responses: [
        'Shorter would need a stronger restoring pull. sin 60° = 0.87 is less than 60° in radians (1.05), so the pull is WEAKER than the linear model claims.',
        'That is what the small-angle formula predicts, and it is why the formula has "small angle" in its name. The measured swing disagrees with it here.',
        'Correct — 7.3%, to be exact, and you can watch the two bobs drift apart on screen. The exact answer is 2π√(l/g)/AGM(1, cos 30°).',
        'Twice as long needs about 173°, essentially balancing it at the top. The drift grows slowly until you get very close to vertical, then runs away.',
      ],
    },
    params: [pLength(1), pAngle0(60), pGravity(9.8), pFlag('ghost_small_angle', 'Ghost the small-angle twin', true)],
    defaultSteps: [
      { say: 'Same pendulum as before, but the release angle is now yours to choose — all the way to nearly vertical.', cta: 'Release from 8°' },
      { say: 'At 8° the measured period and the formula agree to three decimal places. This is the regime the textbook derivation is talking about.', cta: 'Now try 60°' },
      { say: 'A second, paler bob is swinging with the small-angle period for comparison. Watch them start together and separate. After a few swings they are visibly out of step.', cta: 'Show both periods' },
      { say: 'The real period is 7.3% longer. The culprit is one line of the derivation: sin θ ≈ θ. At 8° that costs 0.03%; at 60° it costs 7%; at 170° the pendulum takes nearly three times as long.', cta: 'Done' },
    ],
    tip: 'Whenever a derivation says "for small oscillations", find the line where it linearised something. In a pendulum it is sin θ → θ. That single approximation is what makes the period amplitude-independent — take it away and the independence goes with it.',
  },

  /* 6 ─────────────────────────────────────────────────────────────────────── */
  'shm-energy-ledger': {
    id: 'shm-energy-ledger',
    title: 'Where does the energy go at the centre?',
    summary:
      'A live stacked bar of kinetic and potential energy beside the moving block. The two trade completely, twice per cycle, and the total does not move by so much as a pixel.',
    scenario: 'graphs',
    sim: 'shm-bench',
    ...attacking(
      'shm_energy_lost_at_centre',
      'At the middle the spring is not stretched, so the stored energy has gone.',
      'It has not gone anywhere — it is in the block. At the centre every joule is kinetic; at the ends every joule is elastic. The total stays at ½kA², which is exactly the work you did pulling the block out to A in the first place, and you can read it off the bar at any instant of the cycle.'
    ),
    predict: {
      prompt: 'You double the amplitude. The total energy of the oscillator becomes…',
      options: ['unchanged', 'twice as big', 'four times as big', 'half as big'],
      answerIndex: 2,
      responses: [
        'Something must change — you did more work pulling it out further, and that work went somewhere.',
        'The force grows as you pull, so the work is not force × distance. It is the AREA under the F-x line, which is a triangle, and the triangle grows in both directions at once.',
        'Correct: E = ½kA², so twice the amplitude is four times the energy. It is also four times the maximum kinetic energy, so the maximum speed only DOUBLES.',
        'Nothing here reduces the stored energy; you added to it.',
      ],
    },
    params: [pMass(0.5), pSpring(20), pAmplitude(0.2), pFlag('energy_bar', 'Show the energy ledger', true)],
    defaultSteps: [
      { say: 'The block is held at full stretch. All of the energy you put in is sitting in the spring — the bar beside it is entirely one colour.', cta: 'Let it go' },
      { say: 'As it accelerates inwards, elastic energy drains out of the bar and kinetic energy fills in behind it. The TOP of the bar has not moved.', cta: 'Stop at the centre' },
      { say: 'At the centre the spring is at its natural length and stores nothing at all — and the block is at its fastest. Every joule has crossed over.', cta: 'Let it run' },
      { say: 'It swaps back on the other side, twice per cycle, for ever. Total = ½kA² = the work you did at the start. Nothing is lost; nothing was ever created.', cta: 'Done' },
    ],
    tip: 'Use energy, not kinematics, whenever an SHM question asks "how fast at this displacement". ½kA² = ½kx² + ½mv² gives v in one line, with no phase angle to get wrong.',
  },

  /* ══ WAVE STUDIO ═════════════════════════════════════════════════════════ */

  /* 7 ─────────────────────────────────────────────────────────────────────── */
  'superposition': {
    id: 'superposition',
    title: 'Two waves meet — and then carry on',
    summary:
      'Send two pulses towards each other and watch what happens where they overlap. The rule is the least dramatic one available: at every point, just add. And after they have passed, each carries on as if nothing happened.',
    scenario: 'graphs',
    sim: 'wave-studio',
    ...attacking(
      'waves_destroy_each_other',
      'When a crest meets a trough they cancel out, so the waves are destroyed.',
      'They cancel at that INSTANT and at that POINT, and nowhere else. The medium is momentarily flat because the two displacements happen to sum to zero — but each wave still carries its own velocity, and a moment later both emerge unchanged. Destructive interference destroys nothing.'
    ),
    predict: {
      prompt: 'A crest and an equal trough overlap exactly. At that instant the string is flat. What happens next?',
      options: [
        'Both waves are gone — the string stays flat',
        'The two waves pass through and continue unchanged',
        'They bounce off each other and go back',
        'One wave absorbs the other',
      ],
      answerIndex: 1,
      responses: [
        'The string is flat but it is not still — every point is moving. That stored motion is what rebuilds both pulses a moment later.',
        'Correct. Superposition adds displacements, not waves. Each pulse keeps its own direction and shape and simply walks out the other side.',
        'Nothing reflects here. Reflection needs a boundary — a fixed end or a change of medium — and there is neither in the middle of the string.',
        'Waves do not interact with each other at all in a linear medium. They only add where they overlap.',
      ],
    },
    params: [pWaveAmp(1), pWavelength(2), pFrequency('frequency', 'Frequency', 0.8), pFlag('show_components', 'Show the two waves separately', true)],
    defaultSteps: [
      { say: 'Two identical waves, one travelling right and one travelling left, drawn in their own colours. They have not met yet.', cta: 'Let them run' },
      { say: 'Where they overlap, the black curve is the SUM of the two coloured ones — measured at every single x, with no other rule applied.', cta: 'Freeze at full overlap' },
      { say: 'Right now crest sits on trough everywhere and the sum is dead flat. But look at the two coloured curves: both are still there, both still moving.', cta: 'Carry on' },
      { say: 'And out they come, unchanged. That is what "waves pass through each other" means, and it is why two people can talk across a room at once.', cta: 'Done' },
    ],
    tip: 'Superposition is addition of DISPLACEMENTS. When a question asks for the resultant, add the y-values at a point — never add amplitudes unless you have already checked the two are in phase there.',
  },

  /* 8 ─────────────────────────────────────────────────────────────────────── */
  'beats': {
    id: 'beats',
    title: 'Two notes, one throb',
    summary:
      'Add two tones a couple of hertz apart. The result is a single tone at their average, getting loud and soft at the rate of their difference — and the factor of two hiding in that sentence is where the marks go.',
    scenario: 'graphs',
    sim: 'wave-studio',
    ...attacking(
      'beat_frequency_is_half_the_difference',
      'The envelope repeats at |f₁ − f₂|/2, so that is the beat frequency.',
      'The envelope really does repeat at half the difference — but the ear hears LOUDNESS, which does not care about the envelope\'s sign. |cos| peaks twice per cycle of cos, so you hear |f₁ − f₂| surges per second. Count the bulges on screen against the clock and you will get the full difference every time.'
    ),
    predict: {
      prompt: 'A 256 Hz fork and a 260 Hz fork are struck together. How many loudness surges do you hear per second?',
      options: ['2', '4', '258', '516'],
      answerIndex: 1,
      responses: [
        'That is the envelope\'s own repeat rate — half the difference. But each envelope cycle contains TWO loud moments, one for each hump of |cos|.',
        'Correct: |260 − 256| = 4 beats per second. Musicians tune by slowing this to zero.',
        'That is the pitch you hear — the average of the two — not the throbbing rate.',
        'That is the sum, which does not appear anywhere in the answer.',
      ],
    },
    params: [
      pWaveAmp(1),
      pFrequency('f1', 'First tone', 5),
      pFrequency('f2', 'Second tone', 6),
      pFlag('show_envelope', 'Draw the envelope', true),
    ],
    defaultSteps: [
      { say: 'Two pure tones plotted against TIME (not against distance — this is what one point of the medium does). Their frequencies are almost the same.', cta: 'Add them' },
      { say: 'The sum swells and fades. Nothing is switching anything on and off: the two tones simply drift in and out of step, and that drift is the throb.', cta: 'Show the envelope' },
      { say: 'The dashed envelope is 2A cos(π·Δf·t). It crosses zero — full cancellation — twice in every one of its cycles, so the loud moments come at Δf per second, not Δf/2.', cta: 'Count them against the clock' },
      { say: 'Set the two frequencies equal and the throb disappears entirely. That is exactly what a piano tuner listens for.', cta: 'Done' },
    ],
    tip: 'Beat frequency = |f₁ − f₂|, full stop. If a question gives you a beat rate and one fork, there are TWO possible answers for the other fork — one above and one below — unless something else in the question rules one out.',
  },

  /* 9 ─────────────────────────────────────────────────────────────────────── */
  'standing-wave-split': {
    id: 'standing-wave-split',
    title: 'A standing wave is two travelling waves',
    summary:
      'The flagship. Pull the standing pattern apart on a toggle and watch the two counter-running waves that were always inside it. The nodes are not drawn on — they are the places where the two are permanently out of step.',
    scenario: 'graphs',
    sim: 'wave-studio',
    ...attacking(
      'standing_wave_is_a_single_wave',
      'A standing wave is a special kind of wave that stays still.',
      'There is no such thing as a wave that stays still. What you are looking at is two perfectly ordinary travelling waves — same amplitude, same frequency, opposite directions — added point by point. Split them apart and each is still racing along at the full wave speed. Only the SUM sits still.'
    ),
    predict: {
      prompt: 'What is actually moving at a node of a standing wave on a string?',
      options: [
        'Nothing at all — no wave passes through it',
        'Two waves pass through it, but their displacements always cancel there',
        'The wave passes through but slows to zero',
        'Energy piles up there',
      ],
      answerIndex: 1,
      responses: [
        'Both waves cross every point of the string, including this one. Cut the string at a node and both halves change immediately — which could not happen if nothing were passing through.',
        'Correct. At a node the right-runner and the left-runner are permanently in antiphase, so their sum is zero for all time even though each is at full amplitude.',
        'Wave speed is fixed by the string\'s tension and mass per metre. It is the same at a node as anywhere else.',
        'Energy piles up at the ANTINODES, where the two agree. A node is the opposite.',
      ],
    },
    params: [
      pWaveAmp(1), pWavelength(2), pFrequency('frequency', 'Frequency', 0.6),
      pFlag('split', 'Start with the two waves separated', false),
      pFlag('mark_nodes', 'Mark the nodes the sum produces', true),
    ],
    defaultSteps: [
      { say: 'A pattern that appears to stand still: every point of the string oscillates up and down, but nothing travels along it. Some points never move at all.', cta: 'Split it apart' },
      { say: 'Two ordinary travelling waves, drawn separately. One runs right, one runs left, both at the full wave speed — nothing else is different about them.', cta: 'Add them back together' },
      { say: 'That is the same standing pattern, rebuilt by adding the two curves at every x. Nothing was added and nothing was taken away.', cta: 'Find the nodes' },
      { say: 'The marked points are simply where the sum is always zero — the two waves are in permanent antiphase there. Measure between neighbouring nodes: exactly half a wavelength, every time.', cta: 'Done' },
    ],
    tip: 'Adjacent nodes are λ/2 apart, and a node sits λ/4 from its neighbouring antinode. That is how a resonance-tube experiment measures the speed of sound: find two nodes, double the gap, multiply by f.',
  },

  /* 10 ────────────────────────────────────────────────────────────────────── */
  'string-harmonics': {
    id: 'string-harmonics',
    title: 'Why a string plays only certain notes',
    summary:
      'Clamp a string at both ends and there must be a node at each end. That single condition allows only a whole number of half-loops — and every note the string can play falls out of counting them.',
    scenario: 'graphs',
    sim: 'wave-studio',
    ...attacking(
      'string_pitch_depends_on_length_only',
      'A shorter string plays a higher note, so pitch is about length.',
      'Length is one of THREE. f₁ = (1/2L)√(T/μ): shorten it, tighten it, or use a thinner string and the note rises. That is exactly what a guitar does — six strings of the same length, different thicknesses, each with its own tuning peg.'
    ),
    predict: {
      prompt: 'You want to double a string\'s fundamental frequency without touching its length or thickness. The tension must be…',
      options: ['doubled', 'quadrupled', 'halved', 'increased by √2'],
      answerIndex: 1,
      responses: [
        'f ∝ √T, so doubling the tension raises the note by only √2 — about a perfect fifth, not an octave.',
        'Correct: f ∝ √T, so you need 4× the tension for 2× the frequency. This is why the thick low strings on a piano are under enormous tension AND wrapped to be heavier.',
        'Slackening the string lowers the note.',
        'That is what quadrupling gives you the square root of — it is the tension that goes up 4×, not √2×.',
      ],
    },
    params: [
      pStringLength(4), pTension(100), pDensity(0.01), pHarmonic(1),
      pFlag('show_all_modes', 'Show the first four modes together', false),
    ],
    defaultSteps: [
      { say: 'A string clamped at both ends. Whatever it does, the two ends cannot move — so every allowed pattern must have a node there.', cta: 'Show the fundamental' },
      { say: 'The simplest pattern that fits: one loop, half a wavelength between the clamps, so λ₁ = 2L. Its frequency is v/2L.', cta: 'Add the next one up' },
      { say: 'Two loops now — a full wavelength in the same space, so double the frequency. And there is no way to fit one-and-a-half loops: the far end would have to move.', cta: 'Climb the ladder' },
      { say: 'fₙ = n·v/2L. The whole harmonic series is just "how many half-loops fit", and the wave speed v = √(T/μ) is what tension and thickness control.', cta: 'Done' },
    ],
    tip: 'For a string fixed at both ends every integer harmonic exists: f, 2f, 3f, … For a pipe closed at ONE end only the odd ones do, because a closed end needs a node and an open end needs an antinode. Sketch the boundary conditions before reaching for a formula.',
  },

  /* ══ DOPPLER BENCH ═══════════════════════════════════════════════════════ */

  /* 11 ────────────────────────────────────────────────────────────────────── */
  'doppler-asymmetry': {
    id: 'doppler-asymmetry',
    title: 'Who is moving? It genuinely matters',
    summary:
      'Drag the source and the observer independently. Approaching at 30 m/s sounds higher either way — but not by the same amount, and the two cases are not the same formula. Find the gap yourself.',
    scenario: 'graphs',
    sim: 'doppler-bench',
    ...attacking(
      'doppler_only_relative_speed_matters',
      'Only the relative speed matters — it makes no difference who is moving.',
      'For sound it makes a real, measurable difference, because the AIR is there and it is not moving. A moving source physically bunches the crests in the air, so v_s lands in the denominator and the effect runs away as you approach the speed of sound. A moving observer changes nothing about the crests — they just meet more of them per second — so v_o lands in the numerator and stays perfectly tame. At 30 m/s the two answers differ by about 3 Hz in 400.'
    ),
    predict: {
      prompt: 'A 400 Hz siren approaches you at 30 m/s. Then instead you drive at 30 m/s towards a stationary 400 Hz siren. Which sounds higher? (sound: 340 m/s)',
      options: [
        'The moving siren',
        'You driving towards it',
        'Exactly the same — only relative speed matters',
        'Neither — the pitch is unchanged in both',
      ],
      answerIndex: 0,
      responses: [
        'Correct. Moving source gives 400 × 340/310 = 438.7 Hz; moving observer gives 400 × 370/340 = 435.3 Hz. The source case wins because bunching the wavelength is a stronger effect than counting crests faster.',
        'Close, and the reasoning is worth fixing: as the observer you meet extra crests, which is a linear gain. The source case shortens the wavelength itself, and division beats addition here.',
        'That is true for LIGHT, where there is no medium to be at rest with respect to. Sound has air, and the air breaks the symmetry.',
        'Both raise the pitch. The question is which raises it more.',
      ],
    },
    params: [pEmitted(400), pSoundSpeed(340), pSourceV(30), pObserverV(0), pFlag('show_wavefronts', 'Draw the emitted wavefronts', true)],
    defaultSteps: [
      { say: 'A stationary source emitting a crest every 1/f₀ seconds. Each crest spreads out as a circle at the speed of sound. Evenly spaced, in every direction.', cta: 'Move the source' },
      { say: 'Now the source drives forward between emissions. Each new circle is centred a little further along, so the crests BUNCH in front and STRETCH behind. The wavelength itself has changed.', cta: 'Stop the source, move the observer' },
      { say: 'Source at rest, observer running in. The circles are back to evenly spaced — nothing about the wave has changed. The observer simply crosses more of them per second.', cta: 'Compare the two numbers' },
      { say: 'Same 30 m/s of approach, two different answers. That gap is the whole reason the formula has v_s below the line and v_o above it.', cta: 'Done' },
    ],
    tip: 'Write f′ = f₀(v + v_o)/(v − v_s) once and get the signs from a sentence, not a table: anything that CLOSES the gap raises the pitch. Then check the denominator — if it is heading for zero you are approaching Mach 1 and the question is about a shock wave, not a siren.',
  },

  /* ══ RESONANCE RIG ═══════════════════════════════════════════════════════ */

  /* 12 ────────────────────────────────────────────────────────────────────── */
  'resonance-damping': {
    id: 'resonance-damping',
    title: 'What decides how big resonance gets?',
    summary:
      'Sweep the driving frequency and the amplitude-response curve builds itself, point by measured point. Then change the damping and watch the peak — not its position, its HEIGHT — respond.',
    scenario: 'graphs',
    sim: 'resonance-rig',
    ...attacking(
      'resonance_amplitude_independent_of_damping',
      'At resonance the amplitude goes to infinity — that is what resonance means.',
      'Only in a system with literally zero damping, which does not exist. The peak height is (F₀/m)/(2γ√(ω₀²−γ²)) — it is set entirely by γ. Halve the damping and the peak doubles. Every real bridge, tuning fork and radio circuit lives on that curve, and engineering resonance is engineering γ.'
    ),
    predict: {
      prompt: 'You halve the damping of a driven oscillator. At resonance the amplitude…',
      options: ['is unchanged — resonance is resonance', 'roughly doubles', 'roughly halves', 'becomes infinite'],
      answerIndex: 1,
      responses: [
        'The frequency at which the peak occurs barely moves, which may be what you were thinking of. The HEIGHT of the peak is a different question, and damping is the only thing in the expression for it.',
        'Correct — peak amplitude goes as 1/γ for light damping, so half the damping is twice the response. It also gets NARROWER: a lightly damped system is fussy about frequency as well as loud at the right one.',
        'Damping is what limits the response. Less of it means more, not less.',
        'Infinite needs γ = 0 exactly. Any real friction, however small, gives a finite peak — tall and narrow, but finite.',
      ],
    },
    params: [
      pNum('omega0', 'Natural frequency ω₀', 4, 0.5, 12, 0.1, 'rad/s'),
      pDamping(0.4), pDrive(1), pDriveOmega(3),
      pFlag('compare_damping', 'Ghost a second damping value', true),
    ],
    defaultSteps: [
      { say: 'An oscillator with its own natural frequency ω₀, and a driver you can set to any frequency you like. The response curve to the right is empty — no point of it is assumed.', cta: 'Drive it slowly' },
      { say: 'Well below ω₀ the mass simply follows the driver, small and in step. One measured point goes on the curve.', cta: 'Sweep upwards' },
      { say: 'As the drive approaches ω₀ the response climbs steeply, and the mass starts lagging a quarter cycle behind the push. That lag is what lets the driver keep feeding energy in.', cta: 'Change the damping' },
      { say: 'The peak moves up and down as you change γ, and hardly sideways at all. Damping does not decide WHERE resonance happens — it decides how bad it gets.', cta: 'Done' },
    ],
    tip: 'The peak is not exactly at ω₀: it sits at √(ω₀² − 2γ²), just below. For light damping the difference is negligible and everyone says "at ω₀" — but if a question gives you a heavily damped system, that shift is what it is testing.',
  },
};

/** Stable ordering for pickers and for the admin editor's archetype list. */
export const WAVES_ARCHETYPE_IDS: string[] = Object.keys(WAVES_ARCHETYPES);

/** Look-up that tolerates an unknown id — an authoring typo must degrade, not crash. */
export const wavesArchetype = (id?: string): WavesArchetype | undefined =>
  id ? WAVES_ARCHETYPES[id] : undefined;

/** Which bench an id belongs to, for the dispatcher. */
export const wavesSimOf = (id?: string): WavesArchetype['sim'] | undefined =>
  wavesArchetype(id)?.sim;
