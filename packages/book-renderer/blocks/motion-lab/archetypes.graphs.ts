/*
 * motion-lab/archetypes.graphs.ts — the Unit-1 graphs rung ladder.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE DATA. No React, no DOM, no physics. Unit 1 of the catalogue
 * (PHYSICS_SIMULATION_PROGRAM.md §4): Motion Graph Studio, Match-the-Motion and
 * the Relative Motion Deck, all three on the E2 engine.
 *
 * The engine ships once as code; each exercise on each page is a `motion_lab`
 * block naming ONE id here plus params. Extending what the benches CAN do is
 * code; building an exercise is data, authorable in the admin books-editor with
 * no developer.
 *
 * ── THE THREE RULES PHASE 1's AUDIT PRODUCED, OBEYED BY EVERY ENTRY ─────────
 * `PHYSICS_SIM_QA_2026-07-29.md` found twenty-two `targets` codes wired to no UI
 * at all, archetypes whose guide text instructed actions the interface could not
 * perform, and predict gates whose three wrong options all received identical
 * feedback. So:
 *
 *   1. `attacks` carries the wrong belief AND the sentence that breaks it. An
 *      unwired archetype is then visibly missing copy rather than silently
 *      missing behaviour, and `verify-graphs.mjs` asserts both strings exist and
 *      that `targets === attacks.code`.
 *   2. `predict.responses` has ONE LINE PER OPTION. Three different wrong
 *      answers are three different pieces of reasoning.
 *   3. Every `params` key declared here is surfaced as a live control by the
 *      bench that renders it. A declared parameter with no slider was the single
 *      most common decoration in Phase 1, and the verifier checks it.
 *
 * ── WHAT THE CLASS-9 SIMS ALREADY DO, AND WHY THESE ARE NOT THAT ────────────
 * `simulations/TripleGraphScrubberSim` already stacks the three graphs and drives
 * them from one time slider — but the motions are five hardcoded presets and
 * NOTHING is draggable, so the student picks a scenario and watches. Every rung
 * below is instead built around the student CHANGING one graph and watching the
 * other two rebuild, which is the generation step the Class-9 sims skip.
 *
 * `scenario: 'graphs'` throughout — see `graphs/types.ts` for why, and the build
 * report for the `MotionScenarioId` addition that would let these say what they
 * are.
 */

import type { GraphsArchetype, GraphsArchetypeMap } from './graphs/types';
import {
  attacking,
  pX0, pU, pSegA, pSegT, pNodes, pDriver, pTolerance, pFlag,
  pRiverWidth, pCurrent, pBoat, pHeading, pRainSpeed, pWalkSpeed,
  pTrainV, pTrainL,
} from './graphs/types';

type Param = NonNullable<GraphsArchetype['params']>[number];

/** Which relative-motion construction. A select, so one bench serves four. */
const pScene = (d: string): Param =>
  ({ key: 'scene', label: 'Construction', kind: 'select', default: d, options: ['river', 'rain', 'trains', 'frame-swap'] });

const pGradedOn = (d = 'v'): Param =>
  ({ key: 'graded_on', label: 'Graded quantity', kind: 'select', default: d, options: ['v', 'x'] });

const pMark = (which: 'a' | 'b', d: number): Param => ({
  key: `mark_${which}`,
  label: `Marker ${which.toUpperCase()} (fraction of the run)`,
  kind: 'number',
  default: d,
  min: 0, max: 1, step: 0.05,
});

export const GRAPHS_ARCHETYPES: GraphsArchetypeMap = {
  /* ══ MOTION GRAPH STUDIO ═════════════════════════════════════════════════ */

  /* 1 ─────────────────────────────────────────────────────────────────────── */
  'slope-is-velocity': {
    id: 'slope-is-velocity',
    title: 'The steepness IS the speed',
    summary:
      'Grab the tangent handles sitting on the x–t curve and tilt them. Each tilt sets the velocity at that instant, and the v–t graph below redraws itself as you move. Position is not something you set; it is what steepness adds up to.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'steeper_means_higher_up',
      'It is higher up on the graph, so it must be going faster.',
      'Height on an x–t graph tells you WHERE the body is. Steepness tells you HOW FAST. Look at the last stretch: the line is the highest it has ever been and also the shallowest it has ever been — furthest from home, and crawling.'
    ),
    predict: {
      prompt: 'Two straight stretches on an x–t graph. The second one is higher up but less steep than the first. What is the body doing during the second stretch?',
      options: [
        'Moving faster, because it is further along',
        'Moving slower, but still forwards',
        'Standing still, because the line is not rising much',
        'Moving backwards, because the slope dropped',
      ],
      answerIndex: 1,
      responses: [
        'Being further along says nothing about speed — that is the whole confusion. A car 200 km from home can be parked. Read the STEEPNESS, not the height.',
        'Right. A shallower line means fewer metres per second, and it is still rising so it is still going forwards. Two independent readings from one line: height = where, slope = how fast.',
        'Close, but not quite. A truly stationary body draws a perfectly FLAT line — zero rise. This one is still rising, just gently.',
        'Backwards would mean the line comes back DOWN. It is still climbing, so the body is still moving away from where it started.',
      ],
    },
    params: [
      pX0(0), pU(8),
      pSegA(1, 0), pSegT(1, 3),
      pSegA(2, -6), pSegT(2, 1),
      pSegA(3, 0), pSegT(3, 3),
      pDriver('x'), pFlag('tangent', 'Draw the tangent at the cursor', true),
    ],
    // The ladder is DATA because the right reveal order differs per exercise —
    // see `RevealLadder` in graphs/types.ts. Here: the curve, then the tangent
    // that measures it, then the two panels the tangent generates, then editing.
    reveals: [['x'], ['x', 'tangent'], ['v', 'a'], ['edit']],
    defaultSteps: [
      { say: 'Three panels, one motion, one clock — but only the top one, position against time, is drawn so far. Nothing is moving; drag the cursor along the bottom and the dot walks the curve.', cta: 'Show the tangent' },
      { say: 'The straight line pinned to the curve is the tangent, and its steepness is the velocity at that instant. It is the only thing on the top panel that carries a speed.', cta: 'Show the other two panels' },
      { say: 'The middle panel is nothing but the tangent slope, plotted against time — steep line above, big number below. The bottom panel is the steepness of the MIDDLE one in turn.', cta: 'Let me drag it' },
      { say: 'Handles now sit on the tangents. Every tilt you make appears instantly in the middle panel, and the top curve after that handle re-draws — because position is the running total of velocity, and you just changed the rate the total is growing at.', cta: 'Done' },
    ],
    tip: 'On an x–t graph, ask two separate questions: how HIGH is it (where the body is) and how STEEP is it (how fast). Marks are lost almost entirely by answering one of those when the question asked the other.',
  },

  /* 2 ─────────────────────────────────────────────────────────────────────── */
  'two-flat-lines': {
    id: 'two-flat-lines',
    title: 'Two flat lines that mean opposite things',
    summary:
      'One motion, and it goes flat twice: first the x–t line is flat, later the v–t line is flat. The first means the body is parked. The second means it is moving at a steady speed. Same shape on the page, opposite physics.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'flat_xt_means_constant_velocity',
      'A flat line on the graph means it is moving at a constant speed.',
      'A flat line means "this quantity is not changing" — and WHICH quantity depends on which panel you are looking at. Flat x means the position is not changing: the body is at rest. Flat v means the velocity is not changing: it is cruising. For the first three seconds here, the x–t line is flat and the body has not moved a centimetre.'
    ),
    predict: {
      prompt: 'On a position–time graph, a horizontal line means the body is…',
      options: ['moving at a steady speed', 'at rest', 'speeding up steadily', 'about to turn around'],
      answerIndex: 1,
      responses: [
        'This is the single most common slip in the chapter. A steady speed is a straight SLOPING line. Horizontal means the position never changes — nothing is moving.',
        'Correct. Zero slope means zero velocity. Watch the first three seconds: the top line is flat, the middle line sits on zero, and the dot on the track does not budge.',
        'Speeding up bends the x–t line into a curve that gets steeper. A horizontal line has no steepness at all, and it is not gaining any.',
        'Turning around shows up as a PEAK — the line rises, tops out and comes back down. A flat stretch is a pause, not a turn.',
      ],
    },
    params: [
      pX0(0), pU(0),
      pSegA(1, 0), pSegT(1, 3),
      pSegA(2, 2), pSegT(2, 2),
      pSegA(3, 0), pSegT(3, 4),
      pDriver('v'), pFlag('area', 'Shade the area under v–t', true),
    ],
    reveals: [[], ['x', 'v', 'area'], ['a'], ['edit']],
    defaultSteps: [
      { say: 'A motion in three phases, and nothing is drawn yet. Here is what is coming: the top panel will be flat for a while and the middle panel will be flat for a while, at different times. Decide now which flat stretch means "not moving".', cta: 'Draw the first two panels' },
      { say: 'For the first three seconds the top line runs dead level and the middle line sits on zero. Nothing has moved. A flat x–t line is a body standing still.', cta: 'Add the acceleration panel' },
      { say: 'From 5 s on it is the MIDDLE line that goes flat, at 4 m/s — and the new bottom panel drops to zero with it. Now the top line is a straight climb: the body is covering 4 m every second, steadily. Flat velocity, moving body.', cta: 'Let me drag it' },
      { say: 'Drag any handle in the middle panel and watch which stretch of the top panel changes. The word "flat" is worthless on its own; you have to say flat on WHICH graph.', cta: 'Done' },
    ],
    tip: 'Never answer a graph question from the shape alone. Read the y-axis label first, then the shape. "Flat" on three different axes is three different sentences.',
  },

  /* 3 ─────────────────────────────────────────────────────────────────────── */
  'area-is-displacement': {
    id: 'area-is-displacement',
    title: 'The area under v–t is the distance covered',
    summary:
      'Drag the velocity graph and watch the shaded area under it grow — and watch the x–t curve above build itself out of exactly that area, second by second. The number in the shading and the height of the curve are the same number.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'area_under_vt_is_speed',
      'The area under the velocity graph gives the speed.',
      'The area cannot be a speed — check the units. Height is m/s and width is s, so height × width is metres. The area under a v–t graph is a DISPLACEMENT, and it is the same number as the rise of the x–t curve above it. Watch them agree as you drag.'
    ),
    predict: {
      prompt: 'A body speeds up from rest at 3 m/s² for 4 s. What does the shaded triangle under its v–t graph give you?',
      options: ['Its final speed, 12 m/s', 'Its acceleration, 3 m/s²', 'The distance it covered, 24 m', 'The time it took, 4 s'],
      answerIndex: 2,
      responses: [
        'The final speed is the HEIGHT of the graph at the end, not the area. You can read 12 m/s straight off the axis without computing any area at all.',
        'The acceleration is the SLOPE of the v–t line, and it is also the height of the bottom panel. The area is a different quantity entirely.',
        'Right — ½ × 4 s × 12 m/s = 24 m. Multiply an m/s by an s and you get an m. Now look at the top panel at t = 4 s: the curve has risen by exactly 24.',
        'The time is the WIDTH of the shaded region. Multiply it by the height and you get something new — which is the point of taking an area.',
      ],
    },
    params: [
      pX0(0), pU(0),
      pSegA(1, 3), pSegT(1, 4),
      pSegA(2, 0), pSegT(2, 3),
      pSegA(3, -4), pSegT(3, 3),
      pDriver('v'), pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    reveals: [['v'], ['v', 'area'], ['x', 'a'], ['edit']],
    defaultSteps: [
      { say: 'A journey in three parts: pick up speed, hold it, then brake to a stop. The velocity graph is drawn; the position graph above it is empty.', cta: 'Shade the area under it' },
      { say: 'The shading grows as you drag the cursor. Its value in metres is in the ledger beside the graph, and it climbs by 1.5 m in the first second, 4.5 m in the second, 7.5 m in the third — the triangle is getting wider AND taller.', cta: 'Draw the x–t curve from it' },
      { say: 'The top curve is that running total, plotted. At every instant its height above the start equals the shaded area to the left of the cursor. Two panels, one number — and the bottom panel now shows the slope of the middle one.', cta: 'Now change the motion' },
      { say: 'Drag any velocity handle. The shading changes, and the top curve changes by exactly the area you added or removed. Nothing else can happen — position IS accumulated velocity.', cta: 'Done' },
    ],
    tip: 'When a question gives you a v–t graph and asks for a distance, do not reach for a formula. Cut the shape into triangles and rectangles and add up their areas — it works for graphs no formula can touch.',
  },

  /* 4 ─────────────────────────────────────────────────────────────────────── */
  'sketch-your-own': {
    id: 'sketch-your-own',
    title: 'Sketch a velocity graph and watch the journey appear',
    summary:
      'A blank velocity graph and twelve handles. Draw any motion you like — a sprint, a stop, a reverse — and the position graph builds itself above your hand as the area accumulates. Nothing is chosen for you.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'xt_curve_is_the_path',
      'The x–t curve shows the path the body took, like a map of the route.',
      'A graph is not a picture of the journey. The horizontal axis is TIME, not ground. Sketch a velocity that goes up and comes back down and you get a hill on the position graph — but the body never went up anything; it went forwards and then came back along the same straight line.'
    ),
    predict: {
      prompt: 'You sketch a v–t graph that rises to a peak and falls back to zero. What shape does the x–t graph take?',
      options: [
        'The same hill shape, since the body went up and came back',
        'A curve that keeps rising the whole time, steepest at the peak',
        'A flat line, since it started and finished at rest',
        'A hill, then a valley',
      ],
      answerIndex: 1,
      responses: [
        'This is the map-reading habit. The v–t hill is about SPEED, not height. As long as v stays positive the body keeps moving forwards, so the position never comes back down.',
        'Right. Positive velocity throughout means position only ever increases; the steepest part of the climb is where v is largest. To bring the position graph back down you would have to sketch v BELOW the axis.',
        'It finished at rest, so the position graph ends FLAT — but it does not end where it started. Everything it covered while moving is still covered.',
        'A valley on x–t needs a negative velocity. Your sketch never went below the axis, so the body never reversed.',
      ],
    },
    params: [
      pX0(0), pU(0),
      pSegA(1, 0), pSegT(1, 10),
      pSegA(2, 0), pSegT(2, 0),
      pSegA(3, 0), pSegT(3, 0),
      pFlag('sketch', 'Freehand sketch surface', true), pNodes(12),
      pDriver('v'), pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    reveals: [['v', 'edit'], ['area'], ['x', 'a'], []],
    defaultSteps: [
      { say: 'Twelve handles sitting on the zero line of the velocity graph. Nothing is moving, and nothing will until you drag one.', cta: 'Let me sketch' },
      { say: 'Sweep across the panel and the handles follow your finger. Do not aim for anything tidy — the point is that any shape you can draw is a real motion. The shading under your line is the distance it covers.', cta: 'Show what I built' },
      { say: 'Above your sketch, the position graph: the running area under whatever you just drew. Below it, the acceleration graph — the steepness of your own hand movement, phase by phase.', cta: 'Try going negative' },
      { say: 'Now drag some handles BELOW the zero line. The shading turns colour, the running total starts coming DOWN, and the body is heading back the way it came.', cta: 'Done' },
    ],
    tip: 'Given any v–t graph, you can answer three questions with no formula: is it above or below the axis (which way), is it steep or shallow (how hard the acceleration), and how much area is under it (how far).',
  },

  /* 5 ─────────────────────────────────────────────────────────────────────── */
  'there-and-back': {
    id: 'there-and-back',
    title: 'Went 10 m out and 40 m back — how far did it travel?',
    summary:
      'A motion that reverses. The shading under v–t turns colour when the velocity goes negative, and the running total starts falling. Two numbers come out of one graph, and they are not the same number.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'distance_equals_displacement',
      'Distance and displacement are two words for the same thing.',
      'They only agree when you never turn back. Here the total path is 50 m but the displacement is −30 m: the body ended up 30 m BEHIND where it started, having travelled 50 m to get there. One is what the odometer reads, the other is what a straight line from start to finish measures.'
    ),
    predict: {
      prompt: 'The shaded area above the time axis is +10 m and the shaded area below it totals −40 m. What is the displacement, and what is the distance travelled?',
      options: [
        'Displacement 50 m, distance 50 m',
        'Displacement −30 m, distance 50 m',
        'Displacement −30 m, distance −30 m',
        'Displacement 30 m, distance 30 m',
      ],
      answerIndex: 1,
      responses: [
        'Adding the magnitudes gives the DISTANCE, 50 m. But the two areas are on opposite sides of the axis, so for the displacement one of them has to be subtracted.',
        'Right. Displacement adds the areas WITH their signs: +10 − 40 = −30 m. Distance adds their sizes: 10 + 40 = 50 m. Same graph, two questions, two answers.',
        'The displacement is right. Distance can never be negative — it is a total of path lengths, and you cannot walk a negative number of metres.',
        'The size is right for neither. Watch the sign: more area sits below the axis than above it, so the body finishes behind its starting point.',
      ],
    },
    params: [
      pX0(0), pU(10),
      pSegA(1, -5), pSegT(1, 4),
      pSegA(2, 0), pSegT(2, 2),
      pSegA(3, 5), pSegT(3, 2),
      pDriver('v'), pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    reveals: [['v', 'area'], ['x'], ['a'], ['edit']],
    defaultSteps: [
      { say: 'The body starts out at 10 m/s forwards and is being slowed at 5 m/s². Before you move the cursor: at what instant does it stop, and what happens after that?', cta: 'Draw the position panel' },
      { say: 'At 2 s the velocity graph crosses the axis. The body is momentarily stopped 10 m from home — the area of the shaded triangle to the left of that point, and the peak of the new top curve.', cta: 'Add the acceleration panel' },
      { say: 'Drag the cursor past 2 s. The velocity graph is BELOW the axis, the shading has changed colour, and the bottom panel has not moved at all — a steady −5 m/s² the whole way. Look at the ledger: the distance keeps climbing while the displacement starts falling.', cta: 'Let me change it' },
      { say: 'Fifty metres travelled; thirty metres behind where it started. Both are correct answers to different questions, and an exam will ask you for the one you are not thinking of. Now drag a handle and watch both numbers move.', cta: 'Done' },
    ],
    tip: 'The moment a motion reverses, "how far" has two answers. Write both down: total path length, and the change in position. Average SPEED uses the first; average VELOCITY uses the second.',
  },

  /* 6 ─────────────────────────────────────────────────────────────────────── */
  'slowing-down-positive-a': {
    id: 'slowing-down-positive-a',
    title: 'Positive acceleration, and it is slowing down',
    summary:
      'A body moving backwards at 12 m/s with an acceleration of +3 m/s². The acceleration is positive for the whole eight seconds. For the first four of them the body gets slower. Drag the acceleration bar and find out why.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'positive_a_means_speeding_up',
      'The acceleration is positive, so it must be speeding up.',
      'The sign of a tells you which WAY the velocity is being pushed, not whether the body is getting faster. Speed grows when a and v point the same way and shrinks when they fight. Here v is negative and a is positive, so they fight: the speedometer falls from 12 to 0 while a stays at a steady +3 the whole time.'
    ),
    predict: {
      prompt: 'A body is moving in the −x direction at 12 m/s. Its acceleration is +3 m/s². What happens over the next two seconds?',
      options: [
        'It moves backwards faster, because the acceleration is positive',
        'It slows down, still moving backwards',
        'It immediately reverses and moves forwards',
        'Nothing changes, because the signs cancel',
      ],
      answerIndex: 1,
      responses: [
        'Positive acceleration pushes the velocity UP the number line: −12 becomes −9, then −6. Those are smaller speeds, not bigger ones. Positive a does not mean "more of whatever it was doing".',
        'Right. The velocity climbs from −12 towards zero, so the body is still going backwards but less and less quickly. Speed and velocity are different things, and only one of them is falling.',
        'It reverses eventually, but not at once — it takes 4 s for the velocity to climb from −12 to 0. Watch the middle panel cross the axis at exactly t = 4 s.',
        'Signs do not cancel; the acceleration keeps changing the velocity every single second. What is unchanging here is a, not v.',
      ],
    },
    params: [
      pX0(0), pU(-12),
      pSegA(1, 3), pSegT(1, 8),
      pSegA(2, 0), pSegT(2, 0),
      pSegA(3, 0), pSegT(3, 0),
      pDriver('a'), pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    reveals: [['a', 'v'], ['area'], ['x'], ['edit']],
    defaultSteps: [
      { say: 'The bottom panel is a single bar at +3 m/s², and it will not move for the whole eight seconds. The middle panel starts at −12 m/s, below the axis. Drag the cursor to 4 s and watch the speedometer reading beside the graph.', cta: 'Shade what it covers' },
      { say: 'The velocity has climbed from −12 to 0. It is below the axis the whole way, so the body has been moving BACKWARDS — but the SPEED has fallen from 12 m/s to nothing, with a positive acceleration pushing it. Slowing down under a positive a.', cta: 'Draw the position panel' },
      { say: 'Past 4 s the velocity is above the axis. Now a and v point the same way and the speed climbs again — same +3 as before, opposite effect. The top panel shows the result: down to −24 m, then back to 0.', cta: 'Drag the bar' },
      { say: 'Drag the acceleration bar negative and the whole story flips: the body speeds up backwards. The rule is not about the sign of a; it is about whether a and v agree.', cta: 'Done' },
    ],
    tip: '"Speeding up" and "positive acceleration" are different statements. Compare the SIGNS of v and a: same sign, speed rises; opposite signs, speed falls. That one check answers a whole family of exam questions.',
  },

  /* 7 ─────────────────────────────────────────────────────────────────────── */
  'retardation-both-signs': {
    id: 'retardation-both-signs',
    title: 'Braking twice, with a negative a and then a positive one',
    summary:
      'One body, two brakings. In the first it is moving forwards and the acceleration is negative. In the last it is moving backwards and the acceleration is positive. Both are retardation, and the sign of a was never the reason.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'retardation_is_negative_acceleration',
      'Retardation means the acceleration is negative.',
      'Retardation means the acceleration OPPOSES the motion. That makes a negative when the body moves forwards and POSITIVE when it moves backwards. Look at the last four seconds here: the body is travelling in −x, the bottom panel reads +5 m/s², and it is braking.'
    ),
    predict: {
      prompt: 'A car reverses down a driveway at 20 m/s and the driver brakes. What is the sign of the acceleration while it brakes?',
      options: ['Negative, because braking is always negative', 'Positive', 'Zero while braking', 'It depends on the speed'],
      answerIndex: 1,
      responses: [
        '"Braking is negative" is a habit picked up from problems where everything moves in +x. Reverse the motion and the whole sign convention reverses with it.',
        'Right. The car moves in −x, so slowing it down means pushing it towards +x — a positive acceleration. Retardation is about direction relative to v, not about a minus sign.',
        'Zero acceleration means the velocity never changes, so the car would keep reversing at 20 m/s forever. Braking is precisely a non-zero acceleration.',
        'The speed decides how LONG the braking takes, never the sign. The sign comes from which way the body is going.',
      ],
    },
    params: [
      pX0(0), pU(20),
      pSegA(1, -5), pSegT(1, 4),
      pSegA(2, -5), pSegT(2, 4),
      pSegA(3, 5), pSegT(3, 4),
      pDriver('v'), pFlag('area', 'Shade the area under v–t', true),
    ],
    reveals: [['v', 'a'], ['area'], ['x'], ['edit']],
    defaultSteps: [
      { say: 'Phase one: moving forwards at 20 m/s, acceleration −5 m/s². Drag the cursor across it and predict what the speedometer reads at 4 s, and whether that counts as retardation.', cta: 'Shade the area' },
      { say: 'Speed 20 down to 0, a negative the whole way, area piling up above the axis. That is the textbook case, and it is why "retardation = negative" gets believed.', cta: 'Draw the position panel' },
      { say: 'Phase two keeps the SAME −5 m/s². But v has gone below the axis and the speed is climbing again — the body is picking up speed backwards, and the top curve turns over and heads down. Same negative a, and no longer any retardation.', cta: 'Let me change it' },
      { say: 'Phase three flips the bar to +5 m/s² and the backwards motion slows to a stop. Positive acceleration, braking. Two brakings in one motion, opposite signs of a. Drag a handle and try to build a third.', cta: 'Done' },
    ],
    tip: 'Never translate "retardation" into "minus". Translate it into "a opposes v" and then work out what sign that gives you for the direction the body is actually moving.',
  },

  /* 8 ─────────────────────────────────────────────────────────────────────── */
  'turning-point': {
    id: 'turning-point',
    title: 'Stopped for an instant, and still accelerating',
    summary:
      'A ball thrown straight up, shown as three graphs. At the top the velocity graph touches zero and the acceleration graph does not flinch. Step the cursor onto that exact instant and read all three panels.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'at_rest_means_zero_acceleration',
      'At the highest point the ball is stopped, so its acceleration must be zero there too.',
      'Zero velocity and zero acceleration are different statements. Put the cursor on t = 2 s: the middle panel reads 0 m/s and the bottom panel reads −9.8 m/s², exactly what it read at every other instant. If the acceleration really did switch off, the ball would hang there — and no thrown ball has ever done that.'
    ),
    predict: {
      prompt: 'A ball thrown straight up is momentarily at rest at the top of its flight. What is its acceleration at that instant?',
      options: ['Zero, because it is not moving', '9.8 m/s² upwards', '9.8 m/s² downwards', 'Undefined at that instant'],
      answerIndex: 2,
      responses: [
        'This is the classic. Acceleration is the RATE the velocity changes, not the velocity itself. The velocity is passing through zero, which is exactly when it is changing fastest in relative terms.',
        'Upwards would mean gravity reverses at the top. Nothing changed about the Earth when the ball ran out of upward speed.',
        'Right. Gravity is the same 9.8 m/s² downwards for the whole flight — the bottom panel is a flat bar and never moves. That is why the ball cannot stay at the top for any length of time.',
        'It is perfectly well defined; the v–t graph has a clean, constant slope right through zero. Nothing special happens to it there.',
      ],
    },
    params: [
      pX0(0), pU(19.6),
      pSegA(1, -9.8), pSegT(1, 4),
      pSegA(2, 0), pSegT(2, 0),
      pSegA(3, 0), pSegT(3, 0),
      pDriver('v'), pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    reveals: [['v'], ['x', 'a'], ['area'], ['edit']],
    defaultSteps: [
      { say: 'A ball leaves your hand at 19.6 m/s straight up. Gravity takes 9.8 m/s off its upward velocity every second, so the middle panel crosses zero after exactly two seconds. Drag the cursor there.', cta: 'Draw the other two panels' },
      { say: 'The middle panel reached zero at 2 s and the top panel has flattened out at 19.6 m. Now look down at the bottom panel — a flat bar at −9.8, unmoved by any of it.', cta: 'Shade the area' },
      { say: 'Hold the cursor on 2 s and read all three. Velocity 0, acceleration −9.8 m/s². Those two facts live on different panels and there is no rule connecting them. Gravity does not care that the ball has stopped.', cta: 'Let me change it' },
      { say: 'Past the top, the velocity goes negative and the ball comes down. The v–t line is one unbroken straight line through zero — nothing happened at the top except a change of sign. Drag a handle and see if you can make the corner sharp.', cta: 'Done' },
    ],
    tip: '"Momentarily at rest" is a statement about v only. Do not let it leak into a claim about a. At every turning point, v = 0 and a is whatever it was — which is why the body turns instead of stopping.',
  },

  /* 9 ─────────────────────────────────────────────────────────────────────── */
  'uniform-accel-equations': {
    id: 'uniform-accel-equations',
    title: 'Where the three equations come from — and where they stop',
    summary:
      'Two phases: four seconds of +2 m/s², then four of −1 m/s². Drag either acceleration bar and watch v = u + at, s = ut + ½at² and v² = u² + 2as re-compute for the FIRST phase — and watch what happens when you try to use them across the corner.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'average_v_is_mean_of_endpoints',
      'Average velocity is always the starting velocity plus the finishing velocity, halved.',
      '(u + v)/2 is right only while the v–t graph is a STRAIGHT LINE, because only then is the area really a trapezium. This motion bends at 4 s. Its endpoints are 5 and 9 m/s, so the shortcut answers 7 m/s — but the ledger says the true average velocity is 10 m/s, because the journey spent its middle running fast. The formula is a fact about straight lines, not a fact about averages.'
    ),
    predict: {
      prompt: 'In the FIRST phase only, a body starts at 5 m/s and accelerates at 2 m/s² for 4 s. Which of these gives the distance it covers?',
      options: [
        'The final velocity times the time: 13 × 4 = 52 m',
        'The area of the trapezium under v–t: ½(5 + 13) × 4 = 36 m',
        'The average of the accelerations times the time squared',
        'The starting velocity times the time: 5 × 4 = 20 m',
      ],
      answerIndex: 1,
      responses: [
        'That would be right if the body had travelled at 13 m/s the whole way, but it only reached 13 m/s at the very end. You have taken a rectangle where the graph is a trapezium.',
        'Right — and notice this is exactly ut + ½at²: the 5 × 4 = 20 m rectangle plus the ½ × 2 × 16 = 16 m triangle. The equation is the two pieces of the shaded area, written out.',
        'Acceleration times time squared has the right units but the wrong structure; the ½ and the ut term are both missing. Read it off the area instead of guessing the form.',
        'That is only the rectangle — the part it would have covered if it had never sped up. The triangle on top is the extra 16 m the acceleration bought.',
      ],
    },
    params: [
      pX0(0), pU(5),
      pSegA(1, 2), pSegT(1, 4),
      pSegA(2, -1), pSegT(2, 4),
      pSegA(3, 0), pSegT(3, 0),
      pDriver('a'), pFlag('equations', 'Show the algebra check', true),
      pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    reveals: [['a'], ['v'], ['x', 'area'], ['edit']],
    defaultSteps: [
      { say: 'The bottom panel is the whole story: two bars, +2 m/s² for four seconds and then −1 m/s² for four more. The motion starts at u = 5 m/s. Everything else follows from those numbers.', cta: 'Read v = u + at off the middle panel' },
      { say: 'Each straight stretch of the middle line is straight BECAUSE the bar below it is flat. The first one starts at 5 and climbs 2 every second, reaching 13 m/s at 4 s — that value IS u + at. The equation is the equation of that straight line, and only of that one.', cta: 'Read s = ut + ½at² off the area' },
      { say: 'Shade the first phase and it splits into a rectangle 5 × 4 = 20 and a triangle ½ × 8 × 4 = 16. Total 36 m, which is exactly the rise of the top curve at 4 s. That sum, written symbolically, is ut + ½at².', cta: 'Get v² = u² + 2as' },
      { say: 'Eliminate the time between the two and you get v² = u² + 2as: 25 + 2 × 2 × 36 = 169 = 13². Now look at the ledger for the WHOLE run — average velocity 10 m/s, while (u + v)/2 over the two phases gives only 7. Across a corner, none of the three holds. Drag a bar and watch which numbers stay in step.', cta: 'Done' },
    ],
    tip: 'You only need two of the three equations; the third comes from eliminating t. But before any of them, check that the v–t graph is a SINGLE straight line over the interval you are using. If it bends, split it at the bend and carry the end velocity of one phase in as the start velocity of the next.',
  },

  /* 10 ────────────────────────────────────────────────────────────────────── */
  'tangent-vs-chord': {
    id: 'tangent-vs-chord',
    title: 'Average velocity is a chord; velocity is a tangent',
    summary:
      'One x–t curve with two draggable markers. The straight line joining them is the average velocity between them; the line touching the curve is the velocity at an instant. Drag the markers together and watch the two become one.',
    scenario: 'graphs',
    sim: 'graph-studio',
    ...attacking(
      'avg_equals_instantaneous',
      'Average velocity and velocity are the same thing.',
      'They are two different lines on the same curve. The chord between two markers uses only where the body was at those two instants and ignores everything in between; the tangent uses one instant and nothing else. Drag the markers apart on a bending curve and the two slopes visibly disagree — bring them together and they close on each other, which is what "instantaneous" means.'
    ),
    predict: {
      prompt: 'On a curved x–t graph, you measure the slope of the chord between t = 2 s and t = 6 s. What have you found?',
      options: [
        'The velocity at t = 2 s',
        'The velocity at t = 4 s',
        'The average velocity between 2 s and 6 s',
        'The acceleration between 2 s and 6 s',
      ],
      answerIndex: 2,
      responses: [
        'The chord starts there but its slope is a total for the whole interval. The velocity at 2 s alone is the TANGENT at 2 s, and on a bending curve the two are different.',
        'Careful — that is true only when the acceleration is constant, where the chord slope equals the velocity at the midpoint exactly. Bend the curve unevenly, as here, and it stops being true.',
        'Right. Displacement over time between two instants is the average velocity, and geometrically it is the chord. It never needs to equal the velocity at any particular instant.',
        'Acceleration would be the slope of a v–t graph. On an x–t graph the slope of anything is a velocity.',
      ],
    },
    params: [
      pX0(0), pU(0),
      pSegA(1, 1), pSegT(1, 4),
      pSegA(2, 4), pSegT(2, 4),
      pSegA(3, 0), pSegT(3, 0),
      pDriver('v'), pFlag('tangent', 'Draw the tangent at the cursor', true),
      pFlag('chord', 'Draw the chord between the markers', true),
      pMark('a', 0.2), pMark('b', 0.8),
    ],
    reveals: [['x'], ['x', 'chord'], ['tangent', 'v', 'a'], ['edit']],
    defaultSteps: [
      { say: 'One position curve, bending more and more steeply — the acceleration itself changes partway through. Nothing else is drawn yet.', cta: 'Draw the chord' },
      { say: 'Two markers have appeared, and the straight line joining them is the average velocity between them. Its slope uses only two positions and two times; it knows nothing about what happened in between. Drag either marker.', cta: 'Draw the tangent' },
      { say: 'Now the tangent at the cursor — the velocity at a single instant — plus the middle panel that plots it and the bottom panel that shows where the bend comes from. Slide the cursor between the markers and watch the tangent swing from shallower than the chord to steeper than it.', cta: 'Bring the markers together' },
      { say: 'Drag the two markers close and the chord lies on top of the tangent. That limit is the definition of instantaneous velocity, and it is the whole of differentiation in one gesture.', cta: 'Done' },
    ],
    tip: 'Read the question for the word "average". With it, you want two positions and the time between them. Without it, you want a tangent — and on a bending graph those two answers are simply different numbers.',
  },

  /* ══ MATCH THE MOTION ════════════════════════════════════════════════════ */

  /* 11 ────────────────────────────────────────────────────────────────────── */
  'match-uniform': {
    id: 'match-uniform',
    title: 'Match the motion — cruise, brake, wait',
    summary:
      'A target velocity graph is shown as a pale dashed line and your own graph starts flat. Drag your handles onto it. When you are inside the band everywhere, the other two panels match too — and you never touched them.',
    scenario: 'graphs',
    sim: 'match-the-motion',
    ...attacking(
      'steeper_means_higher_up',
      'To make my graph match, I should get the ENDS in the right place.',
      'Getting the two ends right does not match the graph; it matches two points on it. What has to agree is the whole shape — where each phase starts, how steep it is and how long it lasts. The grader looks at every instant, not at the endpoints, which is why a graph that is right at 0 s and 10 s can still fail.'
    ),
    predict: {
      prompt: 'Before you drag anything: the target v–t graph is flat, then slopes down to zero, then flat on zero. What does the vehicle do?',
      options: [
        'Speeds up, then cruises, then stops',
        'Cruises at a steady speed, then brakes to a stop, then waits',
        'Reverses, then brakes, then waits',
        'Cruises, then reverses, then cruises backwards',
      ],
      answerIndex: 1,
      responses: [
        'Speeding up would show as a line SLOPING UP at the start. This one starts flat, which is a steady speed from the very first instant.',
        'Right — flat above the axis is a steady speed, a downward slope to zero is braking, and flat ON the axis is standing still. Three shapes, three sentences.',
        'Reversing puts the line BELOW the axis. This target never goes below it, so the vehicle only ever moves one way.',
        'It stops at zero and stays there. To cruise backwards the line would have to keep going below the axis and then flatten out there.',
      ],
    },
    params: [
      pX0(0), pU(6),
      pSegA(1, 0), pSegT(1, 4),
      pSegA(2, -3), pSegT(2, 2),
      pSegA(3, 0), pSegT(3, 4),
      pNodes(11), pGradedOn('v'), pTolerance(1.2),
      pFlag('area', 'Shade the area under v–t', true),
    ],
    defaultSteps: [
      { say: 'The pale dashed line is the motion you have to reproduce. Your own graph is the flat one on the zero line — eleven handles, one per second.', cta: 'Read the target first' },
      { say: 'Three phases: flat, then sloping down, then flat on zero. Before dragging, decide which of your handles belong at 6 m/s and which at 0.', cta: 'Let me drag' },
      { say: 'Drag your handles onto the dashed line. The grader checks every instant, not just the corners — a handle left behind in the middle of a phase will fail it.', cta: 'Check the match' },
      { say: 'Inside the band everywhere. Now look up and down: the position panel and the acceleration panel match as well, and you never touched either of them. Match one graph and you have matched the motion.', cta: 'Done' },
    ],
    tip: 'When you have to reproduce a graph, work in phases, not in points. Name each phase — flat, rising, falling, above the axis, below it — before you move anything.',
  },

  /* 12 ────────────────────────────────────────────────────────────────────── */
  'match-reversal': {
    id: 'match-reversal',
    title: 'Match the motion — the one that goes backwards',
    summary:
      'The target dips below the time axis and stays there. Reproduce it, and read what the two panels you are not editing say about a body whose speed rises while its acceleration is positive.',
    scenario: 'graphs',
    sim: 'match-the-motion',
    ...attacking(
      'positive_a_means_speeding_up',
      'The line is going up, so it is speeding up.',
      'A rising v–t line means the velocity is increasing along the number line, which is not the same as the speed increasing. Look at the stretch of the target that rises from −8 towards zero: it is going up and the body is slowing down. Above the axis, up means faster. Below it, up means slower.'
    ),
    predict: {
      prompt: 'The target graph rises from −8 m/s to 0 m/s over the last two seconds. During that stretch the body is…',
      options: [
        'speeding up forwards',
        'speeding up backwards',
        'slowing down, moving backwards',
        'at rest the whole time',
      ],
      answerIndex: 2,
      responses: [
        'It is not moving forwards at all — the whole stretch is below the axis, so every instant of it is backward motion.',
        'Speeding up backwards would need the line to go DOWN, away from zero. This one is heading towards zero, so the backward speed is shrinking.',
        'Right. Below the axis means backwards; heading towards the axis means the speed is falling. The line rises and the speedometer falls, at the same time.',
        'At rest is the single instant where the line touches zero, right at the end. Everywhere before that it is genuinely moving.',
      ],
    },
    params: [
      pX0(0), pU(8),
      pSegA(1, -4), pSegT(1, 4),
      pSegA(2, 0), pSegT(2, 2),
      pSegA(3, 4), pSegT(3, 2),
      pNodes(9), pGradedOn('v'), pTolerance(1),
      pFlag('area', 'Shade the area under v–t', true), pFlag('ledger', 'Show the distance ledger', true),
    ],
    defaultSteps: [
      { say: 'Same job, harder target: this one crosses the axis and spends time below it. Your graph starts flat on zero again.', cta: 'Read the target' },
      { say: 'Four phases hidden in three: forwards and slowing, a moment at rest, backwards at a steady speed, then backwards and slowing. Work out which of your nine handles are positive and which are negative before you touch one.', cta: 'Let me drag' },
      { say: 'Drag your handles onto the dashed line, including the ones below the axis. If the grader says the shape is right but mirrored, you have got the sign of a phase wrong.', cta: 'Check the match' },
      { say: 'Matched. Now read the ledger: the distance travelled is bigger than the displacement, because part of the journey undid the rest. And read the bottom panel — the acceleration in the last phase is POSITIVE while the body slows.', cta: 'Done' },
    ],
    tip: 'The time axis on a v–t graph is the direction line. Above it is one way, below it is the other, and crossing it is a turn. Get every phase on the right side of the axis before you worry about how steep it is.',
  },

  /* ══ RELATIVE MOTION DECK ════════════════════════════════════════════════ */

  /* 13 ────────────────────────────────────────────────────────────────────── */
  'river-crossing': {
    id: 'river-crossing',
    title: 'Crossing the river — quickest is not straightest',
    summary:
      'Drag the boat’s heading and watch three arrows update: the boat through the water, the current, and the sum the bank actually sees. Then find the two special headings — one gets you across soonest, the other lands you opposite.',
    scenario: 'graphs',
    sim: 'relative-deck',
    ...attacking(
      'river_crossing_min_time_equals_min_drift',
      'Aim upstream to fight the current — that is the best way across.',
      'Angling upstream is the best way to land OPPOSITE, and the worst way to get across QUICKLY. Only the across-component of the boat’s velocity carries it to the far bank, and turning upstream steals from exactly that component. To cross soonest, point straight at the far bank and accept the drift: t = w/v_boat, and the current cannot change it.'
    ),
    predict: {
      prompt: 'A 100 m river flows at 3 m/s. Your boat does 5 m/s in still water. Which heading gets you to the far bank in the least time?',
      options: [
        'Angled upstream, to cancel the current',
        'Straight across, perpendicular to the bank',
        'Angled downstream, to use the current',
        'It makes no difference which way you point',
      ],
      answerIndex: 1,
      responses: [
        'That is the ZERO-DRIFT heading and it takes 25 s, not 20. Cancelling the current costs you across-speed: only 4 m/s of your 5 is left pointing at the far bank.',
        'Right. Straight across puts all 5 m/s into the crossing, so t = 100/5 = 20 s. The current sweeps you 60 m downstream, but it cannot slow you down — it pushes along the bank, not across it.',
        'Angling downstream also wastes across-speed, and it adds drift instead of removing it. Worst of both.',
        'It changes both the time and the landing point. What the current cannot change is the time for the straight-across heading — that is the part worth remembering.',
      ],
    },
    params: [
      pScene('river'), pRiverWidth(100), pCurrent(3), pBoat(5), pHeading(0),
      pFlag('construction', 'Show the vector construction', true),
    ],
    defaultSteps: [
      { say: 'A river 100 m wide, flowing right at 3 m/s. Your boat does 5 m/s through the water. Nothing is drawn yet except the banks.', cta: 'Show the boat’s own velocity' },
      { say: 'That arrow is the boat relative to the WATER — the only velocity the engine controls. Drag its head to change the heading; it always keeps the same length, because 5 m/s is 5 m/s.', cta: 'Add the current' },
      { say: 'The second arrow is the water relative to the bank, 3 m/s downstream. Add the two head to tail and the third arrow appears: that is what someone standing on the bank sees, and it is the only one that decides where you land.', cta: 'Cross it' },
      { say: 'Now hunt for the two special headings. Straight across is the quickest — 20 s. Angled upstream by 37° lands you exactly opposite but takes 25 s. Neither is "the right answer" until the question says which it wants.', cta: 'Done' },
    ],
    tip: 'Split every river problem into two independent one-dimensional problems: ACROSS decides the time, ALONG decides the drift. The only way the current can affect your crossing time is if you let it change your heading.',
  },

  /* 14 ────────────────────────────────────────────────────────────────────── */
  'rain-and-man': {
    id: 'rain-and-man',
    title: 'Why the rain slants when you walk',
    summary:
      'The rain falls straight down. Drag your own walking speed up and watch the rain you FEEL tilt further and further forwards — and watch it snap back to vertical the moment you stop.',
    scenario: 'graphs',
    sim: 'relative-deck',
    ...attacking(
      'rain_direction_is_absolute',
      'The rain is coming at me from the front, so it must be slanting.',
      'The rain is falling dead straight down; the slant is yours. What hits you is v_rain − v_you, and subtracting your forward velocity adds a BACKWARD horizontal part to the rain — so it appears to come from in front. Stop walking and the tilt goes to zero with nothing about the weather having changed.'
    ),
    predict: {
      prompt: 'Rain falls vertically at 10 m/s. You walk forwards at 5 m/s. Which way should you tilt the umbrella?',
      options: [
        'Straight up — the rain is vertical',
        'Backwards, away from the direction you are walking',
        'Forwards, into the direction you are walking',
        'It depends on how heavy the rain is',
      ],
      answerIndex: 2,
      responses: [
        'The rain is vertical to someone standing still. You are not standing still, and the umbrella has to shield you from what YOU meet, not from what the ground meets.',
        'Backwards is the instinct and it soaks you. Think about running through a shower: the drops hit your face, not the back of your head.',
        'Right — tilt forwards by atan(5/10) = 26.6° from the vertical. You are walking into the drops, so the shelter has to lean into them too.',
        'How heavy it is changes how wet you get, not which way it comes from. Only the two SPEEDS set the angle.',
      ],
    },
    params: [
      pScene('rain'), pRainSpeed(10), pWalkSpeed(5),
      // Positive means the wind blows the SAME way the walker walks (a tailwind),
      // matching `solveRain`'s sign convention: it is the rain's own x-velocity.
      { key: 'wind', label: 'Wind along your path (+ = with you)', kind: 'number', default: 0, min: -15, max: 15, step: 0.5, unit: 'm/s' },
      pFlag('construction', 'Show the vector construction', true),
    ],
    defaultSteps: [
      { say: 'Rain falling straight down at 10 m/s, and you standing still. The umbrella is vertical and you are dry.', cta: 'Start walking' },
      { say: 'Drag your walking speed up. Nothing about the rain has changed — the falling arrow is the same length and the same direction it always was.', cta: 'Subtract your own velocity' },
      { say: 'What you actually meet is the rain’s velocity minus yours. Subtracting a forward arrow is the same as adding a backward one, so the rain you feel leans towards you. That is the whole slant.', cta: 'Tilt the umbrella' },
      { say: 'Tilt the umbrella along that relative arrow and you are dry again. Now drag your speed back to zero and watch the tilt vanish. The rain never slanted; you did.', cta: 'Done' },
    ],
    tip: 'Whenever a problem says "appears to", it is asking for a relative velocity. Write v_thing − v_you, draw it, and read the angle off the drawing rather than trying to remember which way round the tangent goes.',
  },

  /* 15 ────────────────────────────────────────────────────────────────────── */
  'two-trains': {
    id: 'two-trains',
    title: 'Two trains, one subtraction',
    summary:
      'Set both trains’ velocities, including negative ones, and watch how long one takes to pass the other. The two speeds appear to add sometimes and subtract other times — from the same single formula.',
    scenario: 'graphs',
    sim: 'relative-deck',
    ...attacking(
      'relative_velocity_adds_scalars',
      'Relative speed is just the two speeds added together.',
      'There is one formula, v_AB = v_A − v_B, and the sign of v_B does the rest. Two trains going the same way at 20 and 15: v_AB = 20 − 15 = 5 m/s, and the passing takes a long time. Turn the second one round and its velocity is −15, so v_AB = 20 − (−15) = 35 m/s. The speeds did not "add" — the subtraction of a negative did.'
    ),
    predict: {
      prompt: 'Train A does 20 m/s east. Train B does 15 m/s east on the next track. How fast does A appear to move to a passenger on B?',
      options: ['35 m/s east', '5 m/s east', '20 m/s east', '15 m/s west'],
      answerIndex: 1,
      responses: [
        '35 m/s is what you get if B is travelling WEST. Same formula, but then v_B = −15 and subtracting it adds. Check the directions before you reach for a number.',
        'Right. v_AB = 20 − 15 = 5 m/s east. The passenger on B sees A creeping past, which is why overtaking on a highway takes so much longer than it feels like it should.',
        '20 m/s is A’s speed relative to the GROUND. The passenger on B is not standing on the ground, so that is not what they measure.',
        'That is B’s velocity as seen from A, with the sign flipped — the mirror answer. Useful to know: v_BA = −v_AB, always.',
      ],
    },
    params: [
      pScene('trains'), pTrainV('a', 20), pTrainV('b', 15), pTrainL('a', 120), pTrainL('b', 180),
      pFlag('construction', 'Show the vector construction', true),
    ],
    defaultSteps: [
      { say: 'Two trains on parallel tracks, A 120 m long and B 180 m long, both heading the same way. Their ground velocities are drawn as two arrows.', cta: 'Subtract B’s velocity' },
      { say: 'To see what a passenger on B sees, subtract B’s arrow from A’s. The remainder is short: 5 m/s. That is the only speed that matters for the overtake.', cta: 'Watch the overtake' },
      { say: 'The gap that has to be covered is both lengths together, 300 m, at 5 m/s — sixty seconds of grinding past. Neither train’s own speed appears anywhere in that calculation.', cta: 'Turn train B around' },
      { say: 'Now B’s velocity is negative, so subtracting it ADDS: 35 m/s. The same 300 m goes by in under nine seconds. One formula, two very different answers, and the only thing that changed was a sign.', cta: 'Done' },
    ],
    tip: 'Put both velocities on a number line with signs before you compute anything. Then v_AB = v_A − v_B handles same-direction and opposite-direction cases with no second rule to remember.',
  },

  /* 16 ────────────────────────────────────────────────────────────────────── */
  'frame-swap-1d': {
    id: 'frame-swap-1d',
    title: 'Swap who is watching',
    summary:
      'The same two bodies, seen from the ground, from A, and from B. Every switch changes every number on the screen except one: whatever A measures of B, B measures the exact opposite of A.',
    scenario: 'graphs',
    sim: 'relative-deck',
    // `frame_confusion` IS in the frozen `MotionMisconception` union and is
    // exactly this misconception, so it is used verbatim from upstream rather
    // than a near-duplicate being invented in the local vocabulary.
    ...attacking(
      'frame_confusion',
      'One of these observers must be measuring the real velocity and the others are mistaken.',
      'There is no privileged observer to be right. Velocity is a statement about a PAIR — this body, relative to that frame — and every one of the three readings here is correct in its own frame. The one thing all of them agree on is that v_AB and v_BA are equal and opposite, which is the only frame-independent fact on the screen.'
    ),
    predict: {
      prompt: 'A passenger on train A measures train B moving at −5 m/s. What does a passenger on B measure for A?',
      options: ['−5 m/s', '+5 m/s', '0 m/s', 'It cannot be worked out without the ground speeds'],
      answerIndex: 1,
      responses: [
        'Both cannot see the other going the same way — they would be measuring the gap as closing and opening at once. Swapping the observer swaps the sign.',
        'Right. v_BA = −v_AB always, straight from v_A − v_B = −(v_B − v_A). It is the one relative-velocity fact you never need the ground speeds for.',
        'Zero would mean the two are keeping station, which contradicts A already measuring −5 m/s for B.',
        'You have everything you need. The ground speeds set both numbers, but their relationship — equal and opposite — holds whatever they are.',
      ],
    },
    params: [
      pScene('frame-swap'), pTrainV('a', 20), pTrainV('b', 15), pTrainL('a', 0), pTrainL('b', 0),
      pFlag('construction', 'Show the vector construction', true),
    ],
    defaultSteps: [
      { say: 'Two bodies moving along one line, at 20 m/s and 15 m/s as measured from the ground. Three observers are available: the ground, body A, and body B.', cta: 'Watch from the ground' },
      { say: 'From the ground both are moving forwards, 20 and 15. This is the view every problem starts in, and there is nothing special about it apart from habit.', cta: 'Ride on A' },
      { say: 'Riding on A, A is at rest — by definition, because you are it. B drifts backwards at 5 m/s. Nothing about B changed; you changed.', cta: 'Ride on B' },
      { say: 'Riding on B, A now moves forwards at 5 m/s. Equal and opposite to what A said about B. Switch between the three views and watch which numbers change and which single relationship does not.', cta: 'Done' },
    ],
    tip: 'Always finish a relative-velocity answer by naming the frame: "5 m/s forwards, as seen from B". A bare number in this chapter is an incomplete answer, and the sign is only meaningful once the frame is stated.',
  },
};

/** Stable ordering for pickers and for the admin editor's archetype list. */
export const GRAPHS_ARCHETYPE_IDS: string[] = Object.keys(GRAPHS_ARCHETYPES);

/** Look-up that tolerates an unknown id (an authoring typo must not crash a page). */
export const graphsArchetype = (id?: string): GraphsArchetype | undefined =>
  id ? GRAPHS_ARCHETYPES[id] : undefined;
