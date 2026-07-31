'use strict';
/**
 * Class 11 Physics · Chapter 3 "Motion in Two Dimensions" — pages 13–14.
 * Wave 2b: relative velocity in two dimensions, and the river-boat / rain /
 * aircraft-wind families.
 *
 * PLAN GAP G1: the rationalised NCERT edition has no relative-velocity section
 * for this chapter at all — it is simply absent — yet TWO of the five Crucible
 * tags (`tag_k2d_3` Relative Motion in 2D, `tag_k2d_5` River-Boat & Rain) depend
 * on it. So these two pages are sourced from the reference books and do NOT cite
 * NCERT for the section. NCERT Exercise 3.22 is cited normally on p13.
 *
 * NOTATION (plan conflict C4): use `v_AB` read aloud as "velocity of A with
 * respect to B", matching Ch.2 p13 which is already built. The frame-subscript
 * form `v_{P,S}` appears once, in a note, because students will meet it.
 *
 * NOTATION CLASH, resolved here: the reference book writes the river WIDTH as
 * ω, which would collide head-on with angular velocity from p10–p12. This
 * chapter uses **d** for the river width throughout. Do not reintroduce ω.
 *
 * NOT INCLUDED — and deliberately: the plan (§2.3 B7) wanted the
 * three-particles-chasing-each-other problem on p13 as a competitive item. It is
 * not present in the source text extracted for this build, and Rule 0 forbids
 * reconstructing a problem from memory. Left out rather than fabricated; noted
 * in the plan's open items.
 *
 * Run: node scripts/physics11-book/build_ch3_relative.js
 */
const { b, q, st, mcq, hero, num, ensureChapter, upsertPages, withDb } = require('./_book_ch3');

// ── p13 · Relative Velocity in Two Dimensions ────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'relative-velocity-in-two-dimensions',
  title: 'Relative Velocity in Two Dimensions',
  subtitle: 'Two observers, two completely different stories, both correct',
  glossary: [
    { term: 'relative velocity', definition: 'The velocity of one body as measured from another. v_AB = v_A − v_B, read as "the velocity of A with respect to B".' },
    { term: 'frame of reference', definition: 'The coordinate system an observer uses. Position, velocity and acceleration all depend on which frame you choose.' },
    { term: 'closest approach', definition: 'The minimum separation reached by two bodies in relative motion.' },
  ],
  blocks: [
    hero('relative-velocity-in-two-dimensions'),
    b('curiosity_prompt', 0, {
      prompt: 'You are on a train. A packet is dropped from a plane flying overhead. You say the packet fell in a curve; the pilot says it fell straight down. Which of you is wrong?',
      hint: 'Neither. So what does that tell you about the question?',
      reveal: '**Neither of you. And the question "what is the *actual* path?" has no answer.**\n\nFrom the pilot\'s frame, the packet keeps the plane\'s horizontal velocity and so stays directly below — it drops straight down. From the ground, the packet has a horizontal velocity *and* a vertical acceleration, so it traces a parabola. Both descriptions are complete and correct in their own frame.\n\nThere is no privileged frame that holds the real answer. Asking which path is "actual" is like asking whether the book on your desk is *really* at rest or *really* orbiting the Sun — the question is missing the words **"with respect to"**.\n\nChapter 2 page 13 made this point in one dimension. Here it gets vectors, and the disagreement becomes much more dramatic: not a different number, but a different **shape**.',
    }),
    b('text', 1, {
      markdown: 'The rule is the one from Chapter 2, with the plus-and-minus signs promoted to vectors:\n\n$ \\mathbf{v}_{AB} = \\mathbf{v}_A - \\mathbf{v}_B $\n\nRead the subscripts in order — *A with respect to B*. Everything else follows:\n\n$ \\mathbf{v}_{AB} = -\\mathbf{v}_{BA} \\qquad \\mathbf{a}_{AB} = \\mathbf{a}_A - \\mathbf{a}_B $\n\nThe only genuinely new thing is that the subtraction is now a **vector** subtraction, so it has to be drawn or resolved rather than done with signs.',
    }),
    b('step_solver', 2, {
      title: 'The subtraction, drawn out once',
      problem: 'Car A moves due east at $ 30 $ km/h. Car B moves due north at $ 40 $ km/h. Find the velocity of A with respect to B — its magnitude and its direction.',
      intro: 'This is the vector subtraction that every remaining problem on these two pages is built out of, so it is worth drawing the triangle explicitly once.',
      steps: [
        st('$ \\mathbf{v}_{AB} = \\mathbf{v}_A - \\mathbf{v}_B $. To draw it: **reverse $ \\mathbf{v}_B $, then add tip-to-tail to $ \\mathbf{v}_A $.**',
          'Reversing a northward $ 40 $ km/h gives a southward $ 40 $ km/h. That is the whole of the "subtraction" — the rest is the triangle law from Chapter 0 Unit C.', {
            check: {
              kind: 'mcq',
              prompt: 'So the two vectors being added tip-to-tail are:',
              options: [
                '$ 30 $ km/h east and $ 40 $ km/h south',
                '$ 30 $ km/h east and $ 40 $ km/h north',
                '$ 30 $ km/h west and $ 40 $ km/h south',
                '$ 30 $ km/h west and $ 40 $ km/h north',
              ],
              answer_index: 0,
              feedback_right: 'Right — A\'s own velocity, plus the reverse of B\'s.',
              feedback_wrong: '$ \\mathbf{v}_A $ is unchanged at 30 km/h east. $ -\\mathbf{v}_B $ is B\'s velocity reversed, so 40 km/h **south**. Forgetting to reverse is the single commonest error here, and it gives an answer of the right size pointing the wrong way.',
            },
          }),
        st('In components, with east $ = \\hat{i} $ and north $ = \\hat{j} $: $ \\quad \\mathbf{v}_{AB} = 30\\,\\hat{i} - 40\\,\\hat{j} $ km/h',
          'The components say the same thing as the triangle, and are usually quicker. The two vectors are perpendicular here, so the triangle is right-angled.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ |\\mathbf{v}_{AB}| $ in km/h.',
              blank_answer: '50',
              feedback_right: 'Yes — the 3–4–5 triangle again.',
              feedback_wrong: '$ |\\mathbf{v}_{AB}| = \\sqrt{30^2 + 40^2} = \\sqrt{900+1600} = \\sqrt{2500} = 50 $ km/h.',
            },
          }),
        st('$ |\\mathbf{v}_{AB}| = 50 $ km/h, at $ \\tan^{-1}(40/30) = 53° $ **south** of east.',
          'So a passenger in B sees A moving away to the south-east at 50 km/h — faster than either car is actually going, and in a direction neither of them is travelling.', {
            why: 'That last sentence is the whole reason relative velocity feels strange. **Neither car is moving south-east, and neither is doing 50 km/h**, yet that is a completely correct description of what one observer sees. The velocity you measure genuinely depends on where you are standing.\n\nAnd the check: $ \\mathbf{v}_{BA} $ must be $ -50 $ km/h in the same line, i.e. 50 km/h to the north-west — which is what A sees of B. Same size, opposite direction.',
          }),
      ],
      now_you_try: {
        problem: 'Ship P sails due west at $ 12 $ km/h and ship Q sails due south at $ 5 $ km/h. Find the velocity of Q with respect to P.',
        answer: '$ 13 $ km/h, at $ \\tan^{-1}(5/12) = 22.6° $ south of east',
        solution: 'With east $ = \\hat{i} $, north $ = \\hat{j} $: $ \\mathbf{v}_P = -12\\,\\hat{i} $ and $ \\mathbf{v}_Q = -5\\,\\hat{j} $. So $ \\mathbf{v}_{QP} = -5\\,\\hat{j} - (-12\\,\\hat{i}) = 12\\,\\hat{i} - 5\\,\\hat{j} $ km/h, with magnitude $ \\sqrt{144+25} = 13 $ km/h, pointing $ 22.6° $ south of east.',
      },
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'How to subtract two vectors, since this page needs it constantly',
      markdown: '$ \\mathbf{v}_A - \\mathbf{v}_B $ means $ \\mathbf{v}_A + (-\\mathbf{v}_B) $. So:\n\n1. **Reverse** $ \\mathbf{v}_B $ — same length, opposite direction.\n2. Add it to $ \\mathbf{v}_A $ **tip-to-tail**.\n3. The resultant, from the tail of $ \\mathbf{v}_A $ to the tip of the reversed $ \\mathbf{v}_B $, is $ \\mathbf{v}_{AB} $.\n\nThat is the triangle law from Chapter 0 Unit C, with one vector flipped first. The flip is the whole difficulty — get it the wrong way round and you get an answer of the right size pointing the wrong way.\n\nIn components it is easier still: subtract $ \\hat{i} $ from $ \\hat{i} $ and $ \\hat{j} $ from $ \\hat{j} $.',
    }),
    b('step_solver', 3, {
      title: 'Two ships, and the moment they are closest',
      problem: 'Two ships A and B are $ 10 $ km apart on a line running south to north. Ship A, further north, is steaming west at $ 20 $ km/h and ship B is steaming north at $ 20 $ km/h. Find their distance of closest approach and how long they take to reach it.',
      intro: 'The trick is the one from Chapter 2 page 13, now in two dimensions: **freeze one ship** and the two-body problem becomes a one-body problem.',
      steps: [
        st('Take east as $ +\\hat{i} $ and north as $ +\\hat{j} $. Then $ \\quad \\mathbf{v}_A = -20\\,\\hat{i} \\quad\\text{and}\\quad \\mathbf{v}_B = +20\\,\\hat{j} $ km/h',
          'This is the first component extraction on this page, so it is written in full: west is the negative x-direction, north the positive y-direction.', {
            check: {
              kind: 'mcq',
              prompt: 'We want to freeze A and watch B. Which relative velocity is that?',
              options: [
                '$ \\mathbf{v}_{BA} = \\mathbf{v}_B - \\mathbf{v}_A $',
                '$ \\mathbf{v}_{AB} = \\mathbf{v}_A - \\mathbf{v}_B $',
                '$ \\mathbf{v}_A + \\mathbf{v}_B $',
                '$ |\\mathbf{v}_A| + |\\mathbf{v}_B| $',
              ],
              answer_index: 0,
              feedback_right: 'Right — "B with respect to A" is B\'s motion as seen from a frozen A.',
              feedback_wrong: 'Freezing A and watching B means finding B\'s velocity *relative to A*, which is $ \\mathbf{v}_{BA} = \\mathbf{v}_B - \\mathbf{v}_A $. The reverse subtraction would freeze B instead — also valid, but then the geometry is drawn the other way round.',
            },
          }),
        st('$ \\mathbf{v}_{BA} = \\mathbf{v}_B - \\mathbf{v}_A = 20\\,\\hat{j} - (-20\\,\\hat{i}) = 20\\,\\hat{i} + 20\\,\\hat{j} $ km/h',
          'Subtracting a westward velocity **adds** an eastward one — the reversal step from the box above, done in components.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ |\\mathbf{v}_{BA}| $. Give the answer as a multiple of $ \\sqrt{2} $ — enter just the number in front.',
              blank_answer: '20',
              feedback_right: 'Yes — $ \\sqrt{400+400} = 20\\sqrt{2} $ km/h.',
              feedback_wrong: '$ |\\mathbf{v}_{BA}| = \\sqrt{20^2 + 20^2} = \\sqrt{800} = 20\\sqrt{2} $ km/h, at $ 45° $ north of east.',
            },
          }),
        st('So in A\'s frame, B travels in a **straight line** at $ 20\\sqrt{2} $ km/h, $ 45° $ north of east, starting $ 10 $ km due south of A.',
          'Both ships have zero acceleration, so the relative acceleration is zero and the relative path is a straight line — which is what makes the geometry easy.', {
            check: {
              kind: 'mcq',
              prompt: 'The closest approach is the perpendicular distance from A to that straight line. With the line at $ 45° $ and A $ 10 $ km away, that distance is:',
              options: [
                '$ 10\\sin 45° = 5\\sqrt{2} $ km',
                '$ 10\\cos 45° \\times 2 $ km',
                '$ 10 $ km',
                '$ 10\\tan 45° = 10 $ km',
              ],
              answer_index: 0,
              feedback_right: 'Right — drop a perpendicular from A onto B\'s relative path.',
              feedback_wrong: 'The shortest distance from a point to a line is the perpendicular. With the separation 10 km and the relative velocity at $ 45° $ to it, that perpendicular is $ 10\\sin 45° = 10/\\sqrt{2} = 5\\sqrt{2} \\approx 7.07 $ km.',
            },
          }),
        st('$ s_{\\min} = 5\\sqrt{2} \\approx 7.07\\ \\text{km} $, reached after $ \\quad t = \\dfrac{5\\sqrt{2}}{20\\sqrt{2}} = \\dfrac{1}{4}\\ \\text{h} = 15\\ \\text{min} $',
          'The distance travelled along the relative path to the closest point is also $ 5\\sqrt{2} $ km, because the triangle is isosceles at $ 45° $.', {
            why: 'The whole method in one sentence: **zero relative acceleration makes the relative path a straight line, and then "closest approach" is a perpendicular-distance problem from geometry.** No calculus, no minimising a quadratic. Doing it in the ground frame would mean writing both positions as functions of time, forming the separation, squaring it and differentiating — many times the work for the same answer.',
          }),
      ],
      now_you_try: {
        problem: 'Two cars are $ 100 $ m apart on perpendicular roads, approaching the junction. Car P moves east at $ 15 $ m/s and car Q moves north at $ 20 $ m/s. What is $ \\mathbf{v}_{PQ} $, and what is its magnitude?',
        answer: '$ 15\\,\\hat{i} - 20\\,\\hat{j} $ m/s, magnitude $ 25 $ m/s',
        solution: 'With east $ = \\hat{i} $ and north $ = \\hat{j} $: $ \\mathbf{v}_P = 15\\,\\hat{i} $ and $ \\mathbf{v}_Q = 20\\,\\hat{j} $. So $ \\mathbf{v}_{PQ} = 15\\,\\hat{i} - 20\\,\\hat{j} $ m/s, with magnitude $ \\sqrt{225+400} = \\sqrt{625} = 25 $ m/s. From Q\'s point of view, P moves south-east at 25 m/s.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('Two cars travel at $ 30 $ m/s along perpendicular roads. Their relative speed is:',
          ['$ 0 $, since the two speeds match', '$ 30 $ m/s, unchanged', '$ 30\\sqrt{2} $ m/s', '$ 60 $ m/s, the sum of the two'], 2,
          'The velocities are perpendicular, so the subtraction gives a right triangle: $ |\\mathbf{v}_{AB}| = \\sqrt{30^2 + 30^2} = 30\\sqrt{2} \\approx 42.4 $ m/s. Adding to get 60 would only be right for exactly opposite directions.', 2),
        q('If $ \\mathbf{v}_{AB} = 5\\,\\hat{i} + 12\\,\\hat{j} $ m/s, then $ \\mathbf{v}_{BA} $ is:',
          ['$ 5\\,\\hat{i} + 12\\,\\hat{j} $ m/s', '$ -5\\,\\hat{i} - 12\\,\\hat{j} $ m/s', '$ 12\\,\\hat{i} + 5\\,\\hat{j} $ m/s', '$ 13 $ m/s'], 1,
          'Swapping the subscripts reverses the subtraction, so $ \\mathbf{v}_{BA} = -\\mathbf{v}_{AB} $ — every component changes sign. The magnitude, 13 m/s, is the same for both.', 1),
        q('Two bodies move with the same constant velocity. In each other\'s frame they appear:',
          ['To move at twice the speed of either one', 'To be permanently at rest relative to each other', 'To accelerate steadily towards each other', 'To move in circles around each other'], 1,
          '$ \\mathbf{v}_{AB} = \\mathbf{v}_A - \\mathbf{v}_B = \\mathbf{0} $, so neither moves in the other\'s frame. This is the experience of two cars travelling side by side at the same speed on a motorway.', 1),
        q('For two bodies both in free fall, launched at different times and angles, the relative acceleration is:',
          ['$ g $ downwards, the same value as for each one separately', 'Zero, so the relative motion is a straight line at constant velocity', '$ 2g $ downwards, the sum of the two accelerations', 'It depends on the two launch angles and the two speeds'], 1,
          'Both have acceleration $ \\mathbf{g} $, so $ \\mathbf{a}_{AB} = \\mathbf{g} - \\mathbf{g} = \\mathbf{0} $. Each sees the other move in a straight line at constant velocity — which is the condition for two projectiles to be able to collide in mid-air.', 2),
      ],
    }),
    b('heading', 5, {
      text: 'Where the rule comes from',
      level: 2,
      objective: 'Derive the frame-transformation relations for position, velocity and acceleration.',
    }),
    b('text', 6, {
      markdown: 'Two frames, $ S $ and $ S\' $, both watching a particle $ P $. From the vector triangle of the three positions,\n\n$ \\mathbf{r}_{P,S} = \\mathbf{r}_{P,S\'} + \\mathbf{r}_{S\',S} $\n\n"Where $ P $ is according to $ S $" is "where $ P $ is according to $ S\' $" plus "where $ S\' $ is according to $ S $". Differentiate once and the velocities obey the same pattern.',
    }),
    b('step_solver', 7, {
      title: 'Why two frames can disagree about a path but never about an acceleration',
      problem: 'Starting from $ \\mathbf{r}_{P,S} = \\mathbf{r}_{P,S\'} + \\mathbf{r}_{S\',S} $, derive the relations between the velocities and between the accelerations measured in the two frames. Then state the condition under which the two frames agree about the acceleration.',
      intro: 'Two differentiations. The second one produces the most important result on this page.',
      steps: [
        st('Differentiating once: $ \\quad \\mathbf{v}_{P,S} = \\mathbf{v}_{P,S\'} + \\mathbf{v}_{S\',S} $',
          'Each term is the time derivative of the corresponding position — differentiation is linear, so it goes straight through the sum.', {
            check: {
              kind: 'mcq',
              prompt: 'Rearranged, this says $ \\mathbf{v}_{P,S\'} = \\mathbf{v}_{P,S} - \\mathbf{v}_{S\',S} $. What is that in the $ v_{AB} $ notation of this page?',
              options: [
                'The velocity of $ P $ relative to $ S\' $ equals $ P $\'s velocity minus $ S\' $\'s velocity',
                'The velocity of $ P $ equals the sum of the two frame velocities',
                'The two frames must have the same velocity',
                'The particle must be at rest in one of the frames',
              ],
              answer_index: 0,
              feedback_right: 'Right — it is the same $ \\mathbf{v}_{AB} = \\mathbf{v}_A - \\mathbf{v}_B $ rule, derived properly.',
              feedback_wrong: 'It is exactly the subtraction rule from the top of the page: what $ S\' $ measures is what $ S $ measures minus $ S\' $\'s own velocity. The frame-subscript notation and the $ v_{AB} $ notation say the same thing.',
            },
          }),
        st('Differentiating again: $ \\quad \\mathbf{a}_{P,S} = \\mathbf{a}_{P,S\'} + \\mathbf{a}_{S\',S} $',
          'The same pattern once more. Now look at the last term and ask when it vanishes.', {
            check: {
              kind: 'mcq',
              prompt: 'When is $ \\mathbf{a}_{S\',S} = \\mathbf{0} $?',
              options: [
                'When the two frames move at constant velocity relative to each other',
                'When the two frames are both at rest',
                'When the particle is not accelerating',
                'Never — it is always non-zero',
              ],
              answer_index: 0,
              feedback_right: 'Right — constant relative velocity means zero relative acceleration.',
              feedback_wrong: 'The term is the acceleration of one frame relative to the other, which is zero whenever their relative velocity is constant. They need not be at rest — a smoothly moving train qualifies.',
            },
          }),
        st('So if the frames move at **constant relative velocity**: $ \\quad \\mathbf{a}_{P,S} = \\mathbf{a}_{P,S\'} $',
          'The two observers disagree about the position, disagree about the velocity, and **agree exactly about the acceleration.**', {
            why: 'This is the deepest result in the chapter, and it is why the packet argument at the top has no answer. Two such observers cannot possibly settle which of them is "really" moving, because every measurement they could make of an *acceleration* comes out the same. There is no experiment that picks a winner.\n\nThat is the seed of the principle of relativity, and it is also why the coin on your desk falls the same way whether you do the experiment at home or on a smoothly moving train.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is dropped inside a train moving at a constant $ 30 $ m/s. What is the ball\'s acceleration as measured (a) by a passenger and (b) by someone on the platform? What if the train is accelerating forwards at $ 2 $ m/s²?',
        answer: '(a) and (b) both $ g $ downwards for a steady train; if the train accelerates, the passenger measures $ g $ down and $ 2 $ m/s² backwards',
        solution: 'At constant velocity, $ \\mathbf{a}_{S\',S} = \\mathbf{0} $, so both measure $ g $ downwards — the ball falls at the passenger\'s feet exactly as it would on the ground. If the train accelerates at $ 2 $ m/s² forwards, then $ \\mathbf{a}_{\\text{ball,train}} = \\mathbf{g} - 2\\,\\hat{i} $, so the passenger sees the ball drift **backwards** as it falls while the platform observer still sees plain free fall.',
      },
    }),
    b('callout', 8, {
      variant: 'note',
      title: 'What a stated speed quietly means',
      markdown: 'Almost every speed you are given is a **relative** speed, with the reference left unsaid.\n\n- "**Muzzle velocity** $ 60 $ m/s" means relative to the **gun**. Fired forwards from a train doing $ 20 $ m/s, its ground speed is $ 80 $ m/s.\n- "A swimmer can swim at $ 5 $ km/h" means relative to the **water**. Downstream in a $ 3 $ km/h river, she makes $ 8 $ km/h over the ground.\n- "The plane\'s speed is $ 400 $ km/h" almost always means relative to the **air**.\n\n**Whenever you are given a speed, ask what it is measured against.** Half the difficulty of the next page is that the answer changes from sentence to sentence.',
    }),
    b('step_solver', 9, {
      title: 'Finding a speed from an angle subtended',
      problem: 'An aircraft is flying at a height of $ 3400 $ m above the ground. The angle subtended at a ground observation point by the aircraft positions $ 10.0 $ s apart is $ 30° $. What is the speed of the aircraft?',
      intro: 'Not a relative-velocity problem at heart, but it is the standard companion question — and it turns on drawing the geometry before touching physics.',
      steps: [
        st('The observer sees the aircraft move from one position to another, subtending $ 30° $ at the observation point. Split that angle in half with the vertical.',
          'The aircraft flies level, so the two sight-lines are symmetric about the vertical — giving two right triangles of angle $ 15° $ each.', {
            check: {
              kind: 'mcq',
              prompt: 'In each right triangle, the height is $ 3400 $ m and the angle at the observer is $ 15° $. Which ratio gives the horizontal half-distance?',
              options: [
                '$ \\tan 15° = \\dfrac{\\text{half-distance}}{3400} $',
                '$ \\sin 15° = \\dfrac{\\text{half-distance}}{3400} $',
                '$ \\cos 15° = \\dfrac{\\text{half-distance}}{3400} $',
                '$ \\tan 15° = \\dfrac{3400}{\\text{half-distance}} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — opposite over adjacent, with the height as the adjacent side.',
              feedback_wrong: 'The angle sits at the observer, with the vertical height $ 3400 $ m as the adjacent side and the horizontal half-distance as the opposite side. So $ \\tan 15° = \\text{half-distance}/3400 $.',
            },
          }),
        st('half-distance $ = 3400\\tan 15° = 3400(0.268) = 911\\ \\text{m} $, so the full distance is $ 1822\\ \\text{m} $',
          'Doubling the half-distance gives the distance the aircraft actually covered in the 10 s.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the speed: $ 1822 $ m in $ 10.0 $ s. Give the answer in m/s to the nearest whole number.',
              blank_answer: '182',
              feedback_right: 'Yes — about 182 m/s, roughly 656 km/h.',
              feedback_wrong: '$ v = 1822/10.0 = 182 $ m/s. That is about 656 km/h, a plausible cruising speed for an airliner — always worth a sanity check.',
            },
          }),
        st('$ v \\approx 182\\ \\text{m/s} $ (about $ 656 $ km/h)',
          'The 3400 m and the 30° were the only data; the geometry did the rest.', {
            why: 'The move worth stealing here is **halving the angle to make a right triangle.** An isosceles triangle is awkward; two right triangles are trivial. That step turns up constantly in geometry-flavoured physics questions, and it is almost always the first thing to try when an angle is subtended symmetrically.',
          }),
      ],
      now_you_try: {
        problem: 'An aircraft flies at $ 2000 $ m altitude. The angle subtended at a ground point by its positions $ 5.0 $ s apart is $ 60° $. Find its speed.',
        answer: '$ 462 $ m/s',
        solution: 'Half-angle $ 30° $, so the half-distance is $ 2000\\tan 30° = 2000(0.577) = 1155 $ m, and the full distance is $ 2310 $ m. The speed is $ 2310/5.0 = 462 $ m/s — supersonic, so this is a military aircraft rather than an airliner.',
      },
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'A food packet is dropped from a plane flying horizontally at a steady speed, from an altitude of 100 m. What is the path of the packet as seen from the plane? What is its path as seen from the ground? And if someone asks you "but what is the *actual* path?", what will you answer?',
      reveal: '**From the plane:** a straight line, vertically down. The packet keeps the plane\'s horizontal velocity and so does the plane, so it stays directly beneath the whole way. The pilot simply sees it drop away.\n\n**From the ground:** a parabola. The packet has a constant horizontal velocity and a downward acceleration — this chapter\'s page 4, exactly.\n\n**And the third question is the one that matters: there is no "actual" path.** Both descriptions are complete and correct in their own frame, and neither is privileged. Asking which is real is like asking whether the book on your table is "really" at rest or "really" orbiting the Sun — the question is missing the words "with respect to".\n\nThe solver above proved *why* no experiment can settle it: two frames in constant relative motion agree about every acceleration. They disagree about paths and velocities, and there is no measurement either could make to break the tie.\n\nThis is the same point Chapter 2 page 1 opened with. The chapter has now earned it three times, and this is the strongest version — because here the two observers do not merely disagree about a number, they disagree about the **shape**.',
      difficulty_level: 3,
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('Two frames move at constant velocity relative to each other. They will agree about a particle\'s:',
          ['Position', 'Velocity', 'Acceleration', 'Path shape'], 2,
          'The frame-transformation relations give $ \\mathbf{a}_{P,S} = \\mathbf{a}_{P,S\'} $ when the relative acceleration of the frames is zero. Positions, velocities and path shapes can all differ — the dropped packet is straight in one frame and parabolic in the other.', 3),
        q('The statement "a swimmer can swim at $ 5 $ km/h" means her speed relative to:',
          ['The ground', 'The water', 'The far bank', 'The current direction'], 1,
          'A swimmer\'s quoted speed is always with respect to the water — it is what her arms and legs can do against the medium. Her ground speed depends on what the water is doing as well.', 2),
        q('For two bodies with zero relative acceleration, the relative path is:',
          ['A parabola, as in projectile motion', 'A straight line traversed at constant velocity', 'A circle about the other body', 'Undetermined without more information'], 1,
          'Zero relative acceleration means constant relative velocity, so in one body\'s frame the other moves in a straight line at a steady rate. That is what makes closest-approach problems pure geometry.', 2),
        q('In the closest-approach method, the minimum separation is found by:',
          ['Differentiating the separation with respect to time and minimising', 'Dropping a perpendicular from one body onto the other\'s relative path', 'Adding the two velocity vectors together', 'Setting the relative velocity equal to zero'], 1,
          'Once one body is frozen, the other moves along a straight line, and the shortest distance from a point to a line is the perpendicular. Differentiating the separation also works but is far more labour for the same answer.', 3),
      ],
    }),
    b('callout', 12, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ \\mathbf{v}_{AB} = \\mathbf{v}_A - \\mathbf{v}_B $ — **a vector subtraction now.** Reverse the second vector, then add tip-to-tail.\n- $ \\mathbf{v}_{AB} = -\\mathbf{v}_{BA} $, and $ \\mathbf{a}_{AB} = \\mathbf{a}_A - \\mathbf{a}_B $.\n- **Frames in constant relative motion agree about every acceleration** and about nothing else. That is why "the actual path" has no meaning.\n- **To solve a two-body problem, freeze one body.** The other then moves in a straight line, and closest approach becomes a perpendicular-distance problem.\n- **Every quoted speed has an unstated reference.** Muzzle speed is relative to the gun, swim speed to the water, air speed to the air.\n- Two projectiles have zero relative acceleration, so each sees the other move in a straight line.',
    }),
    b('practice_bank', 13, {
      title: 'You solve it',
      intro: 'Eight questions. Declare your $ \\hat{i} $ and $ \\hat{j} $ directions before you write a single velocity down.',
      sections: [
        {
          id: 'p13-ysi',
          title: 'Relative velocity in a plane',
          items: [
            num('p13-y1', 'Car P moves north at $ 40 $ km/h and car Q moves east at $ 30 $ km/h. Find the velocity of P relative to Q and its magnitude.',
              '$ -30\\,\\hat{i} + 40\\,\\hat{j} $ km/h, magnitude $ 50 $ km/h',
              'With east $ = \\hat{i} $, north $ = \\hat{j} $: $ \\mathbf{v}_P = 40\\,\\hat{j} $ and $ \\mathbf{v}_Q = 30\\,\\hat{i} $. So $ \\mathbf{v}_{PQ} = -30\\,\\hat{i} + 40\\,\\hat{j} $ km/h, with magnitude $ \\sqrt{900+1600} = 50 $ km/h — pointing north-west as seen from Q.'),
            mcq('p13-y2', 'Two trains move on perpendicular tracks at $ 60 $ km/h each. The speed of one relative to the other is:',
              ['$ 0 $, since the speeds are equal', '$ 60 $ km/h, unchanged', '$ 84.9 $ km/h', '$ 120 $ km/h, the sum of the two'], 2,
              'Perpendicular velocities give $ \\sqrt{60^2 + 60^2} = 60\\sqrt{2} = 84.9 $ km/h. The sum, 120 km/h, would apply only if they moved in exactly opposite directions.'),
            num('p13-y3', 'A bullet is fired forwards at a muzzle speed of $ 500 $ m/s from a train moving at $ 30 $ m/s. Find the bullet\'s speed relative to the ground.',
              '$ 530 $ m/s',
              'Muzzle speed is relative to the gun, so $ \\mathbf{v}_{\\text{bullet,ground}} = \\mathbf{v}_{\\text{bullet,gun}} + \\mathbf{v}_{\\text{gun,ground}} = 500 + 30 = 530 $ m/s. Fired backwards it would be 470 m/s.'),
            mcq('p13-y4', 'A passenger on a smoothly moving train drops a coin. Compared with dropping it on the platform, the coin:',
              ['Lands further back, towards the rear of the carriage', 'Lands in exactly the same place relative to the passenger', 'Lands further forward, towards the front of the carriage', 'Takes noticeably longer to fall than on the platform'], 1,
              'At constant velocity the relative acceleration of the two frames is zero, so both observers measure the same $ g $ and the coin falls at the passenger\'s feet exactly as it would on the ground. Only if the train *accelerated* would it drift.'),
            num('p13-y5', 'Two ships are $ 20 $ km apart on a north-south line. The northern one steams west at $ 15 $ km/h and the southern one steams north at $ 20 $ km/h. Find their relative speed.',
              '$ 25 $ km/h',
              'With east $ = \\hat{i} $, north $ = \\hat{j} $: $ \\mathbf{v}_A = -15\\,\\hat{i} $ and $ \\mathbf{v}_B = 20\\,\\hat{j} $. So $ \\mathbf{v}_{BA} = 15\\,\\hat{i} + 20\\,\\hat{j} $ km/h, with magnitude $ \\sqrt{225+400} = 25 $ km/h.'),
            mcq('p13-y6', 'Two projectiles are launched from different points with different speeds and angles. In the frame of one, the other moves:',
              ['Along a parabola', 'Along a straight line at constant velocity', 'Along a circle', 'Along a path depending on both launch angles'], 1,
              'Both have acceleration $ \\mathbf{g} $, so the relative acceleration is zero and the relative motion is uniform along a straight line. Two projectiles can therefore collide in mid-air only if that relative velocity points along the line joining them.'),
            num('p13-y7', 'An aircraft at $ 4000 $ m altitude subtends an angle of $ 90° $ at a ground point between its positions $ 8.0 $ s apart. Find its speed.',
              '$ 1000 $ m/s',
              'Half-angle $ 45° $, so the half-distance is $ 4000\\tan 45° = 4000 $ m and the full distance is $ 8000 $ m. The speed is $ 8000/8.0 = 1000 $ m/s. That is close to Mach 3 — a very fast military aircraft indeed.'),
            num('p13-y8', 'A man in a lift accelerating upwards at $ 2 $ m/s² drops a ball. Find the ball\'s acceleration relative to the lift. Take $ g = 10 $ m/s².',
              '$ 12 $ m/s² downwards',
              '$ \\mathbf{a}_{\\text{ball,lift}} = \\mathbf{a}_{\\text{ball}} - \\mathbf{a}_{\\text{lift}} = (-10) - (+2) = -12 $ m/s², i.e. 12 m/s² downwards. The ball falls *faster* than normal in the lift\'s frame, because the floor is rising to meet it. Note this frame is accelerating, so the frames do **not** agree about the acceleration.'),
          ],
        },
      ],
    }),
    b('text', 14, {
      markdown: 'The rule is settled. The last page of the teaching half applies it to the three situations exam setters return to again and again — a boat, an umbrella and an aeroplane.',
    }),
  ],
};

// ── p14 · Crossing a River, and Walking in the Rain ──────────────────────────
const p14 = {
  page_number: 14,
  slug: 'crossing-a-river-and-walking-in-the-rain',
  title: 'Crossing a River, and Walking in the Rain',
  subtitle: 'One subtraction, three disguises',
  glossary: [
    { term: 'drift', definition: 'The distance a boat is carried downstream while crossing a river.' },
    { term: 'still-water speed', definition: 'The speed of a boat or swimmer relative to the water, written v_br. It is what the rower can do, independent of the current.' },
  ],
  blocks: [
    hero('crossing-a-river-and-walking-in-the-rain'),
    b('curiosity_prompt', 0, {
      prompt: 'A swimmer who can do 4 km/h in still water wants to cross a river flowing at 3 km/h. Should she aim straight across, or angle upstream?',
      hint: 'What is she trying to win — the least time, or the least distance travelled?',
      reveal: '**It depends entirely on what she is trying to achieve, and the two goals need different answers.**\n\n**To cross in the shortest *time*:** aim straight across. Every bit of her 4 km/h then goes into closing the width, and she crosses in the least possible time — but the current carries her downstream, so she lands well below the point opposite.\n\n**To land exactly opposite:** aim upstream at an angle, so that her upstream component exactly cancels the current. That works, but it takes longer, because part of her effort is now spent fighting sideways instead of crossing.\n\nYou cannot have both. And there is a third case worth knowing: **if the river flows faster than she can swim, landing directly opposite is impossible** — no angle exists. This page derives all three.',
    }),
    b('text', 1, {
      markdown: 'Three velocities, and keeping them apart is the whole game:\n\n- $ \\mathbf{v}_r $ — the velocity of the **river**, relative to the ground\n- $ \\mathbf{v}_{br} $ — the velocity of the **boat relative to the river**. This is what the rower can do; it is the "still-water speed"\n- $ \\mathbf{v}_b $ — the **actual** velocity of the boat over the ground\n\nAnd they are related by the rule from page 13:\n\n$ \\mathbf{v}_b = \\mathbf{v}_{br} + \\mathbf{v}_r $',
    }),
    b('inline_quiz', 2, {
      pass_threshold: 0.6,
      questions: [
        q('A rower says "I can do $ 5 $ km/h". Which of the three velocities has she just told you?',
          ['$ \\mathbf{v}_b $, her actual velocity over the ground', '$ \\mathbf{v}_{br} $, her velocity relative to the water', '$ \\mathbf{v}_r $, the velocity of the river', 'None of them — the statement is incomplete'], 1,
          'What a rower can do is measured against the water she is rowing through, so it is $ v_{br} $. Her speed over the ground also depends on what the river is doing, and will differ going upstream and downstream.', 2),
        q('A boat is pointed straight across a river that is flowing. Which statement is true?',
          ['$ \\mathbf{v}_{br} $ is across the river and $ \\mathbf{v}_b $ is at an angle to it', 'Both $ \\mathbf{v}_{br} $ and $ \\mathbf{v}_b $ point straight across', '$ \\mathbf{v}_b $ is across the river and $ \\mathbf{v}_{br} $ is at an angle', 'Both point at an angle to the bank'], 0,
          '"Pointed straight across" is a statement about the direction the boat is steered, which is $ \\mathbf{v}_{br} $. The actual velocity $ \\mathbf{v}_b $ adds the current, so it comes out at an angle — the boat faces one way and travels another.', 2),
      ],
    }),
    b('callout', 3, {
      variant: 'warning',
      title: 'The one distinction that decides every river question',
      markdown: '$ \\mathbf{v}_{br} $ is what the rower **steers**. $ \\mathbf{v}_b $ is where the boat **actually goes**. They are different vectors, and a question will always be about one or the other.\n\n"Row at $ 5 $ km/h" is $ v_{br} $. "Head straight across" is a statement about the direction of $ \\mathbf{v}_{br} $. "Land directly opposite" is a statement about the direction of $ \\mathbf{v}_b $.\n\nRead which one the question is constraining, and the problem is half solved. Confuse them and no amount of algebra will save the answer.\n\n**Notation note:** we write the river width as $ d $. The reference books often use $ \\omega $ for it, which would collide with angular velocity from pages 10–12.',
    }),
    b('step_solver', 3, {
      title: 'Crossing in the shortest time',
      problem: 'A river of width $ d $ flows at $ v_r $. A boat can move at $ v_{br} $ in still water. Show that the crossing time is least when the boat is steered straight across, find that time, and find the resulting drift.',
      intro: 'The result is almost obvious once you see which component does the crossing — but it is worth deriving, because the general case has a $ \\cos\\theta $ in it that people mis-handle.',
      steps: [
        st('Steer at angle $ \\theta $ from straight-across. Then the **across-river** component of $ \\mathbf{v}_{br} $ is $ v_{br}\\cos\\theta $.',
          'Only the across-river component gets the boat to the other bank. The along-river component just moves it up or downstream.', {
            check: {
              kind: 'mcq',
              prompt: 'So the crossing time is:',
              options: [
                '$ t = \\dfrac{d}{v_{br}\\cos\\theta} $',
                '$ t = \\dfrac{d}{v_{br}} $',
                '$ t = \\dfrac{d}{v_{br}\\sin\\theta} $',
                '$ t = \\dfrac{d}{v_{br} + v_r} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — width divided by the across-river speed.',
              feedback_wrong: 'Time is the width divided by the component of velocity *across* the river, which is $ v_{br}\\cos\\theta $. Note the river\'s own velocity does not appear at all — it is entirely along the bank, so it cannot help or hinder the crossing.',
            },
          }),
        st('$ t = \\dfrac{d}{v_{br}\\cos\\theta} $ is **smallest when $ \\cos\\theta $ is largest**, i.e. when $ \\theta = 0 $.',
          'Any steering angle at all wastes some of the boat\'s speed on a sideways component.', {
            check: {
              kind: 'fill_blank',
              prompt: 'So $ t_{\\min} = d/v_{br} $. For $ d = 30 $ m and $ v_{br} = 5 $ m/s, find $ t_{\\min} $ in seconds.',
              blank_answer: '6',
              feedback_right: 'Yes — $ 30/5 = 6 $ s.',
              feedback_wrong: '$ t_{\\min} = d/v_{br} = 30/5 = 6 $ s.',
            },
          }),
        st('$ t_{\\min} = \\dfrac{d}{v_{br}} $, with the boat pointed straight across.',
          'Now the price: during those $ t_{\\min} $ seconds, the river has been carrying the boat downstream the whole time.', {
            check: {
              kind: 'mcq',
              prompt: 'The drift is:',
              options: [
                '$ x = v_r t_{\\min} = \\dfrac{v_r d}{v_{br}} $',
                '$ x = v_{br} t_{\\min} = d $',
                '$ x = 0 $, since the boat points straight across',
                '$ x = (v_{br} - v_r)t_{\\min} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the current acts for the whole crossing, unopposed.',
              feedback_wrong: 'Pointing straight across means nothing opposes the current, so the boat is carried downstream at $ v_r $ for the whole time $ t_{\\min} $. The drift is $ v_r t_{\\min} = v_r d/v_{br} $.',
            },
          }),
        st('drift $ x = \\dfrac{v_r d}{v_{br}} $, and the boat\'s actual speed over the ground is $ \\sqrt{v_{br}^2 + v_r^2} $.',
          'The boat travels faster over the ground than it can row — the current is a free gift, just in an unhelpful direction.', {
            why: 'Note that the boat\'s *path* over the ground is a straight line at an angle, even though it was pointed straight across the whole time. The rower faces one way and travels another. That is the clearest possible illustration of $ \\mathbf{v}_b \\ne \\mathbf{v}_{br} $, and it is why the distinction in the box above is worth so much.',
          }),
      ],
      now_you_try: {
        problem: 'A river $ 400 $ m wide flows at $ 2.0 $ m/s. A boat sails at $ 10.0 $ m/s relative to the water, steered perpendicular to the current. Find (a) the time to reach the opposite bank and (b) how far downstream of the point directly opposite it lands.',
        answer: '(a) $ 40 $ s  (b) $ 80 $ m',
        solution: '(a) $ t = d/v_{br} = 400/10.0 = 40 $ s — the current does not affect this at all. (b) drift $ = v_r t = 2.0(40) = 80 $ m downstream.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('A boat is steered perpendicular to a river current. The time to cross depends on:',
          ['The speed of the current on its own', 'The boat\'s still-water speed and the river width only', 'Both the current speed and the boat speed together', 'The width of the river on its own'], 1,
          'The current is entirely along the bank, so it contributes nothing to crossing. The time is $ d/v_{br} $, with no $ v_r $ in it — which is the two-independent-motions idea from page 1, in a boat.', 2),
        q('To cross a river in the shortest time, a boat should be steered:',
          ['Upstream at an angle to the bank', 'Perpendicular to the current', 'Downstream at an angle to the bank', 'Along the current, with the flow'], 1,
          'The crossing time is $ d/(v_{br}\\cos\\theta) $, minimised when $ \\cos\\theta = 1 $, i.e. $ \\theta = 0 $. Any angle at all diverts some speed away from crossing.', 2),
        q('A boat pointed straight across a flowing river travels over the ground:',
          ['Straight across, perpendicular to the bank', 'Along a straight line at an angle to the bank', 'Along a curved path', 'Upstream at an angle'], 1,
          'The actual velocity is the vector sum of a constant across-river velocity and a constant downstream one, so the ground path is a straight line at an angle. The boat *faces* one way and *travels* another.', 2),
      ],
    }),
    b('step_solver', 5, {
      title: 'Landing directly opposite — and when it cannot be done',
      problem: 'A river of width $ d $ flows at $ v_r $, and a boat can row at $ v_{br} $. Find the steering angle needed to land at the point directly opposite the start, the time it takes, and the condition for this to be possible at all.',
      intro: 'Now the constraint is on $ \\mathbf{v}_b $, not $ \\mathbf{v}_{br} $ — the *actual* velocity must point straight across. That changes which triangle you draw.',
      steps: [
        st('Landing directly opposite means the **drift is zero**, so the along-river component of $ \\mathbf{v}_b $ must vanish.',
          'The boat steers upstream at angle $ \\theta $, giving an upstream component $ v_{br}\\sin\\theta $ that has to cancel the current exactly.', {
            check: {
              kind: 'mcq',
              prompt: 'Writing that cancellation gives:',
              options: [
                '$ v_{br}\\sin\\theta = v_r $',
                '$ v_{br}\\cos\\theta = v_r $',
                '$ v_{br} = v_r $',
                '$ v_{br}\\tan\\theta = v_r $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the upstream component must exactly match the downstream current.',
              feedback_wrong: 'The upstream component of the steering velocity is $ v_{br}\\sin\\theta $ (measuring $ \\theta $ from straight-across), and it must equal $ v_r $ for the two to cancel. The cosine component is the one doing the crossing.',
            },
          }),
        st('$ \\sin\\theta = \\dfrac{v_r}{v_{br}} \\quad \\Rightarrow \\quad \\theta = \\sin^{-1}\\left(\\dfrac{v_r}{v_{br}}\\right) $ upstream',
          'Now the across-river speed is what is left over: $ v_b = v_{br}\\cos\\theta = \\sqrt{v_{br}^2 - v_r^2} $.', {
            check: {
              kind: 'mcq',
              prompt: 'Where does $ \\sqrt{v_{br}^2 - v_r^2} $ come from?',
              options: [
                'From $ \\cos\\theta = \\sqrt{1 - \\sin^2\\theta} $ with $ \\sin\\theta = v_r/v_{br} $',
                'From adding the two velocities',
                'From the Pythagorean theorem applied to $ v_b $ and $ v_r $',
                'From $ v_b = v_{br} - v_r $',
              ],
              answer_index: 0,
              feedback_right: 'Right — and it is also the third side of the velocity triangle.',
              feedback_wrong: '$ v_{br}\\cos\\theta = v_{br}\\sqrt{1 - (v_r/v_{br})^2} = \\sqrt{v_{br}^2 - v_r^2} $. Geometrically, $ v_{br} $ is the hypotenuse of a right triangle with $ v_r $ as one leg, so the crossing speed is the other leg.',
            },
          }),
        st('$ t = \\dfrac{d}{\\sqrt{v_{br}^2 - v_r^2}} $ — always **longer** than $ t_{\\min} = d/v_{br} $.',
          'Because $ \\sqrt{v_{br}^2 - v_r^2} < v_{br} $ whenever the river is flowing at all.', {
            check: {
              kind: 'mcq',
              prompt: 'Now look at that square root. What happens if $ v_r \\ge v_{br} $?',
              options: [
                'It becomes zero or imaginary — landing directly opposite is impossible',
                'The time becomes zero',
                'The boat crosses instantly',
                'The angle becomes $ 45° $',
              ],
              answer_index: 0,
              feedback_right: 'Right, and the sine condition says the same thing: $ \\sin\\theta $ cannot exceed 1.',
              feedback_wrong: 'If $ v_r = v_{br} $ the crossing speed is zero and the time is infinite; if $ v_r > v_{br} $ the square root is imaginary. Equivalently $ \\sin\\theta = v_r/v_{br} > 1 $, and no such angle exists.',
            },
          }),
        st('**Possible only if $ v_{br} > v_r $.** If the river runs faster than you can row, you cannot land directly opposite.',
          'Not "it is hard" — there is no angle that works.', {
            why: 'This is a limit worth understanding rather than memorising. At $ v_r = v_{br} $ the required angle is $ 90° $ — you would have to point straight upstream, which cancels the current perfectly and leaves you with **no across-river component at all**. You hold position and never cross. Beyond that, the current simply wins.\n\nWhat you *can* still do is minimise the drift, which is a different and harder question — and one that would need calculus.',
          }),
      ],
      now_you_try: {
        problem: 'A river $ 30 $ m wide flows at $ 4 $ m/s. A boat can row at $ 5 $ m/s. (a) Can it land directly opposite? If so, at what angle and in what time? (b) What is the shortest-time crossing, and its drift?',
        answer: '(a) Yes — $ 53° $ upstream, $ 10 $ s  (b) $ 6 $ s, with a $ 24 $ m drift',
        solution: '(a) Since $ 5 > 4 $, it is possible. $ \\sin\\theta = 4/5 $, so $ \\theta = 53° $ upstream. The crossing speed is $ \\sqrt{25-16} = 3 $ m/s, so $ t = 30/3 = 10 $ s. (b) Shortest time: $ t = 30/5 = 6 $ s, with a drift of $ 4(6) = 24 $ m. So landing opposite costs 4 extra seconds — a 67% increase.',
      },
    }),
    b('step_solver', 6, {
      title: 'Working backwards from two crossings',
      problem: 'A man crosses a river in a boat. Crossing in minimum time takes $ 10 $ min with a drift of $ 120 $ m. Crossing by the shortest path takes $ 12.5 $ min. Find the width of the river, the boat\'s still-water speed and the speed of the current.',
      intro: 'Three unknowns and three pieces of data. The two crossing formulas from this page give two equations; the drift gives the third.',
      steps: [
        st('Minimum time: $ \\quad t_1 = \\dfrac{d}{v_{br}} = 10\\ \\text{min}, \\qquad \\text{drift} = v_r t_1 = 120\\ \\text{m} $',
          'The drift equation is the easy one — it gives $ v_r $ straight away.', {
            check: {
              kind: 'fill_blank',
              prompt: 'From the drift, find $ v_r $ in metres per minute.',
              blank_answer: '12',
              feedback_right: 'Yes — $ 120/10 = 12 $ m/min.',
              feedback_wrong: '$ v_r = 120/10 = 12 $ m/min. Working in metres per minute rather than converting to m/s keeps the arithmetic clean here.',
            },
          }),
        st('Shortest path: $ \\quad t_2 = \\dfrac{d}{\\sqrt{v_{br}^2 - v_r^2}} = 12.5\\ \\text{min} $',
          'Divide this by the minimum-time equation and the unknown width $ d $ cancels.', {
            check: {
              kind: 'mcq',
              prompt: 'Dividing $ t_2 $ by $ t_1 $ gives:',
              options: [
                '$ \\dfrac{v_{br}}{\\sqrt{v_{br}^2 - v_r^2}} = 1.25 $',
                '$ \\dfrac{\\sqrt{v_{br}^2 - v_r^2}}{v_{br}} = 1.25 $',
                '$ \\dfrac{v_{br}}{v_r} = 1.25 $',
                '$ \\dfrac{d}{v_r} = 1.25 $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the width cancels, leaving one equation in $ v_{br} $ alone.',
              feedback_wrong: '$ t_2/t_1 = \\dfrac{d/\\sqrt{v_{br}^2-v_r^2}}{d/v_{br}} = \\dfrac{v_{br}}{\\sqrt{v_{br}^2-v_r^2}} $, and $ 12.5/10 = 1.25 $. Cancelling the unknown you do not yet want is the standard move with three unknowns.',
            },
          }),
        st('$ \\dfrac{v_{br}^2}{v_{br}^2 - 144} = 1.5625 \\quad \\Rightarrow \\quad 0.5625\\,v_{br}^2 = 225 \\quad \\Rightarrow \\quad v_{br} = 20\\ \\text{m/min} $',
          'Squaring both sides, substituting $ v_r = 12 $, and solving.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the width, from $ d = v_{br}t_1 $. Give the answer in metres.',
              blank_answer: '200',
              feedback_right: 'Yes — $ 20 \\times 10 = 200 $ m.',
              feedback_wrong: '$ d = v_{br}t_1 = 20 \\times 10 = 200 $ m.',
            },
          }),
        st('$ d = 200\\ \\text{m}, \\quad v_{br} = 20\\ \\text{m/min}, \\quad v_r = 12\\ \\text{m/min} $',
          'Check the second crossing: $ \\sqrt{400-144} = \\sqrt{256} = 16 $ m/min, and $ 200/16 = 12.5 $ min ✓.', {
            why: 'That final check is not optional on a three-unknown problem. Each value was found using the previous one, so a slip anywhere propagates silently to the end. **Substituting back into the equation you did not use to derive the last unknown** is the only way to catch it.',
          }),
      ],
      now_you_try: {
        problem: 'A boat crosses a $ 60 $ m river in minimum time in $ 15 $ s, drifting $ 45 $ m downstream. How long would the shortest-path crossing take?',
        answer: 'About $ 22.7 $ s',
        solution: '$ v_{br} = 60/15 = 4 $ m/s and $ v_r = 45/15 = 3 $ m/s. The shortest-path crossing speed is $ \\sqrt{16-9} = \\sqrt{7} = 2.65 $ m/s, so $ t = 60/2.65 = 22.7 $ s.',
      },
    }),
    b('heading', 7, {
      text: 'The same subtraction in the rain',
      level: 2,
      objective: 'Find the direction to tilt an umbrella, from the relative velocity of the rain.',
    }),
    b('text', 8, {
      markdown: 'Rain falls vertically. You walk east. The rain appears to come at you from the front — so you tilt your umbrella forwards.\n\nWhat you are protecting yourself from is not $ \\mathbf{v}_r $ but $ \\mathbf{v}_{rm} = \\mathbf{v}_r - \\mathbf{v}_m $, the velocity of the **rain relative to you**. That is the direction the drops actually approach along, and it is the direction to point the umbrella.',
    }),
    b('step_solver', 9, {
      title: 'Which way to tilt the umbrella',
      problem: 'A man is walking east at $ 3 $ m/s. Rain is falling vertically downwards at $ 4 $ m/s. In which direction should he hold his umbrella so the rain does not wet him?',
      intro: 'A vector subtraction where the two vectors are perpendicular, so the triangle is a right triangle and the answer is one arctangent.',
      steps: [
        st('$ \\mathbf{v}_{rm} = \\mathbf{v}_r - \\mathbf{v}_m $. With east as $ +\\hat{i} $ and up as $ +\\hat{j} $: $ \\quad \\mathbf{v}_r = -4\\,\\hat{j} $ and $ \\mathbf{v}_m = +3\\,\\hat{i} $.',
          'Rain falling downwards is a negative $ \\hat{j} $ velocity. Declaring the directions first is what keeps the signs honest.', {
            check: {
              kind: 'mcq',
              prompt: 'So $ \\mathbf{v}_{rm} $ is:',
              options: [
                '$ -3\\,\\hat{i} - 4\\,\\hat{j} $ m/s',
                '$ 3\\,\\hat{i} - 4\\,\\hat{j} $ m/s',
                '$ -3\\,\\hat{i} + 4\\,\\hat{j} $ m/s',
                '$ 3\\,\\hat{i} + 4\\,\\hat{j} $ m/s',
              ],
              answer_index: 0,
              feedback_right: 'Right — subtracting the eastward walk gives a westward component.',
              feedback_wrong: '$ \\mathbf{v}_{rm} = (-4\\,\\hat{j}) - (3\\,\\hat{i}) = -3\\,\\hat{i} - 4\\,\\hat{j} $ m/s. The rain appears to come **from the east** — from in front of him — which is why the umbrella tilts forward.',
            },
          }),
        st('$ |\\mathbf{v}_{rm}| = \\sqrt{9 + 16} = 5\\ \\text{m/s} $, and $ \\tan\\theta = \\dfrac{3}{4} $ from the vertical',
          'The horizontal part of the relative velocity is 3 and the vertical part is 4, so the tilt from the vertical is $ \\tan^{-1}(3/4) $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ \\tan^{-1}(3/4) $ in degrees, to the nearest whole number.',
              blank_answer: '37',
              feedback_right: 'Yes — $ 37° $ from the vertical.',
              feedback_wrong: '$ \\tan^{-1}(0.75) = 36.9° \\approx 37° $. The 3–4–5 triangle appears again.',
            },
          }),
        st('Hold the umbrella at $ 37° $ from the vertical, tilted **towards the east** — that is, into his own direction of motion.',
          'Which matches what everyone does instinctively when walking through rain.', {
            why: 'And it explains the observation that a man *standing* in the same rain holds his umbrella vertical while a man *running* tilts it. The rain has not changed at all. What changed is $ \\mathbf{v}_m $, and so $ \\mathbf{v}_{rm} $.\n\nNote also that both of them keep the umbrella **vertical** to block the sun, because sunlight arrives at $ 3 \\times 10^8 $ m/s — a walking speed of 3 m/s changes its apparent direction by an utterly negligible amount.',
          }),
      ],
      now_you_try: {
        problem: 'To a man walking at $ 3 $ km/h the rain appears to fall vertically downwards. When he increases his speed to $ 6 $ km/h it appears to meet him at $ 45° $ with the vertical. Find the speed of the rain.',
        answer: '$ 3\\sqrt{2} \\approx 4.24 $ km/h',
        solution: 'Let $ \\mathbf{v}_r = a\\,\\hat{i} + b\\,\\hat{j} $. At $ 3 $ km/h: $ \\mathbf{v}_{rm} = (a-3)\\,\\hat{i} + b\\,\\hat{j} $ appears vertical, so $ a - 3 = 0 $ and $ a = 3 $. At $ 6 $ km/h: $ \\mathbf{v}_{rm} = -3\\,\\hat{i} + b\\,\\hat{j} $ is at $ 45° $ to the vertical, so $ |b| = 3 $. Hence the rain\'s speed is $ \\sqrt{9+9} = 3\\sqrt{2} = 4.24 $ km/h. Notice the rain is **not** falling vertically at all — it only appeared to, to a man walking at 3 km/h.',
      },
    }),
    b('step_solver', 10, {
      title: 'Steering an aircraft into a crosswind',
      problem: 'An aircraft flies at $ 400 $ km/h in still air. A wind of $ 200\\sqrt{2} $ km/h blows from the south towards the north. The pilot wishes to travel from A to a point B north-east of A, with $ AB = 1000 $ km. Find the direction the pilot must steer, and the time of the journey.',
      intro: 'Identical in structure to the river-boat problem — the wind replaces the current and the air speed replaces the still-water speed. The difference is that here the *destination* is fixed, which makes it a triangle-solving problem.',
      steps: [
        st('The requirement is that $ \\mathbf{v}_a $, the **actual** velocity, points along AB — that is, north-east.',
          'And $ \\mathbf{v}_a = \\mathbf{v}_{aw} + \\mathbf{v}_w $, so the steering velocity $ \\mathbf{v}_{aw} $ has to complete a triangle whose resultant lies along AB.', {
            check: {
              kind: 'mcq',
              prompt: 'Which of the three vectors is completely known at the start?',
              options: [
                'The wind velocity — both magnitude and direction',
                'The steering velocity',
                'The actual velocity',
                'All three',
              ],
              answer_index: 0,
              feedback_right: 'Right — the wind is fully given; the other two are each known in only one respect.',
              feedback_wrong: 'The wind is fully specified ($ 200\\sqrt{2} $ km/h due north). The steering velocity has a known *magnitude* (400 km/h) but unknown direction; the actual velocity has a known *direction* (north-east) but unknown magnitude. Two half-known vectors and one fully known one is exactly a sine-rule triangle.',
            },
          }),
        st('In the velocity triangle, apply the sine rule: $ \\quad \\dfrac{200\\sqrt{2}}{\\sin\\alpha} = \\dfrac{400}{\\sin 45°} $',
          'Here $ \\alpha $ is the angle between the steering direction and AB, and the $ 45° $ is the angle between the wind (north) and AB (north-east).', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve for $ \\sin\\alpha $. Enter it as a decimal.',
              blank_answer: '0.5',
              feedback_right: 'Yes — so $ \\alpha = 30° $.',
              feedback_wrong: '$ \\sin\\alpha = \\dfrac{200\\sqrt{2}\\sin 45°}{400} = \\dfrac{200\\sqrt{2}(0.707)}{400} = \\dfrac{200}{400} = 0.5 $, so $ \\alpha = 30° $.',
            },
          }),
        st('$ \\alpha = 30° $, so the pilot steers at $ 45° + 30° = 75° $ from north, towards the east.',
          'Well to the east of the intended track — the northward wind has to be leaned into.', {
            check: {
              kind: 'mcq',
              prompt: 'Now the ground speed, from the sine rule again with the third angle $ 180° - 45° - 30° = 105° $:',
              options: [
                '$ v_a = \\dfrac{400\\sin 105°}{\\sin 45°} \\approx 546 $ km/h',
                '$ v_a = 400 $ km/h, unchanged',
                '$ v_a = 400 + 200\\sqrt{2} \\approx 683 $ km/h',
                '$ v_a = \\sqrt{400^2 + (200\\sqrt{2})^2} \\approx 490 $ km/h',
              ],
              answer_index: 0,
              feedback_right: 'Right — the wind adds a useful component, pushing the ground speed above the air speed.',
              feedback_wrong: 'The sine rule gives $ \\dfrac{v_a}{\\sin 105°} = \\dfrac{400}{\\sin 45°} $, so $ v_a = 400(0.966)/0.707 = 546 $ km/h. Simply adding the magnitudes would only be right if the two were parallel.',
            },
          }),
        st('$ v_a \\approx 546\\ \\text{km/h} $, so $ \\quad t = \\dfrac{1000}{546} \\approx 1.83\\ \\text{h} $',
          'About one hour fifty minutes.', {
            why: 'Note that the ground speed, 546 km/h, **exceeds** the aircraft\'s 400 km/h air speed. The wind is partly along the route, so it helps — the pilot pays for it by steering $ 30° $ off the direct line. This is why real flight times differ so much between an outbound and a return leg on the same route: the same wind is a tailwind one way and a headwind the other.',
          }),
      ],
      now_you_try: {
        problem: 'An aeroplane must fly from A to B, $ 500 $ km away, due $ 30° $ east of north. The wind blows due north at $ 20 $ m/s and the plane\'s steering speed is $ 150 $ m/s. Find the direction the pilot should head.',
        answer: 'About $ 33.9° $ east of north',
        solution: 'The angle between the wind (north) and AB is $ 30° $. By the sine rule, $ \\sin\\alpha = \\dfrac{20\\sin 30°}{150} = \\dfrac{10}{150} = 0.0667 $, so $ \\alpha = 3.8° $. The pilot must head $ 30° + 3.8° = 33.8° $ east of north — leaning east to offset the northward wind.',
      },
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('A boat can row at $ 3 $ km/h in still water. In a river flowing at $ 5 $ km/h, can it reach the point directly opposite?',
          ['Yes, by steering upstream at $ 30° $', 'Yes, by steering upstream at $ 60° $', 'No — the current is faster than the boat', 'Yes, but only by rowing downstream first'], 2,
          'Landing directly opposite needs $ \\sin\\theta = v_r/v_{br} = 5/3 > 1 $, which no angle satisfies. When $ v_r \\ge v_{br} $ it is impossible, not merely difficult.', 2),
        q('Rain falls vertically. A cyclist rides north. She should tilt her umbrella:',
          ['Towards the north, into her direction of motion', 'Towards the south, away from her motion', 'Straight up, with no tilt', 'Towards the east'], 0,
          'The relative velocity $ \\mathbf{v}_r - \\mathbf{v}_m $ acquires a southward component, meaning the rain appears to come from the north — from in front. So the umbrella tilts forward, into the motion.', 2),
        q('A boat crosses a river by the shortest path rather than in the shortest time. The crossing:',
          ['Takes less time', 'Takes more time', 'Takes the same time', 'Is impossible'], 1,
          'The shortest path uses only $ \\sqrt{v_{br}^2 - v_r^2} $ for crossing, which is less than the full $ v_{br} $ available when pointing straight across. Less crossing speed means more time.', 2),
        q('An aircraft\'s ground speed can exceed its air speed when:',
          ['The wind has a component along the intended route', 'The wind blows exactly perpendicular to the route', 'The wind opposes the route', 'Never — the air speed is the maximum'], 0,
          'The ground velocity is the vector sum of the air velocity and the wind. If the wind has a favourable component along the route, the ground speed exceeds the air speed. That is the whole reason a tailwind shortens a flight.', 2),
        q('A man walking at $ 4 $ km/h finds the rain appears to fall vertically. The rain\'s actual horizontal velocity is:',
          ['Zero', '$ 4 $ km/h in his direction of motion', '$ 4 $ km/h opposite to his motion', '$ 8 $ km/h in his direction'], 1,
          'For the rain to appear vertical, the horizontal part of $ \\mathbf{v}_r - \\mathbf{v}_m $ must vanish, so the rain\'s horizontal velocity equals his — 4 km/h in his direction of motion. Rain appearing vertical does not mean it *is* vertical.', 3),
      ],
    }),
    b('callout', 12, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- Keep the three apart: $ \\mathbf{v}_{br} $ is what you **steer**, $ \\mathbf{v}_b $ is where you **go**, and $ \\mathbf{v}_b = \\mathbf{v}_{br} + \\mathbf{v}_r $.\n- **Shortest time:** steer straight across. $ t_{\\min} = d/v_{br} $, with drift $ v_r d/v_{br} $. The current does not affect the *time* at all.\n- **Zero drift:** steer upstream at $ \\sin\\theta = v_r/v_{br} $, taking $ t = d/\\sqrt{v_{br}^2 - v_r^2} $ — always longer.\n- **Impossible if $ v_r \\ge v_{br} $.** No angle exists.\n- **Rain:** tilt the umbrella along $ \\mathbf{v}_r - \\mathbf{v}_m $, which means **into** your own motion.\n- **Aircraft and wind** is the river-boat problem again: wind for current, air speed for still-water speed. A ground speed above the air speed just means a favourable wind.',
    }),
    b('practice_bank', 13, {
      title: 'You solve it',
      intro: 'Eight questions. On every river question, decide first whether the constraint is on the steering velocity or the actual velocity.',
      sections: [
        {
          id: 'p14-ysi',
          title: 'Boats, rain and wind',
          items: [
            num('p14-y1', 'A river $ 120 $ m wide flows at $ 3 $ m/s. A boat rows at $ 4 $ m/s in still water, steered straight across. Find the crossing time and the drift.',
              '$ 30 $ s and $ 90 $ m',
              '$ t = d/v_{br} = 120/4 = 30 $ s. Drift $ = v_r t = 3(30) = 90 $ m downstream.'),
            mcq('p14-y2', 'A swimmer can swim at $ 5 $ km/h. To cross a river flowing at $ 3 $ km/h and land directly opposite, she should aim upstream at:',
              ['$ 30° $ from the perpendicular', '$ 37° $ from the perpendicular', '$ 45° $ from the perpendicular', '$ 53° $ from the perpendicular'], 1,
              '$ \\sin\\theta = v_r/v_{br} = 3/5 = 0.6 $, so $ \\theta = 37° $ upstream from the straight-across direction.'),
            num('p14-y3', 'A swimmer swims at $ 4.0 $ km/h in still water, heading perpendicular to a current of $ 3.0 $ km/h. Find her velocity relative to the ground.',
              '$ 5.0 $ km/h, at $ \\tan^{-1}(4/3) = 53° $ from the direction of flow',
              'The two velocities are perpendicular, so $ v_b = \\sqrt{16 + 9} = 5.0 $ km/h. The angle with the flow direction is $ \\tan^{-1}(4/3) = 53° $.'),
            mcq('p14-y4', 'Rain falls vertically at $ 4 $ m/s. A man runs east at $ 3 $ m/s. The speed of the rain relative to him is:',
              ['$ 1 $ m/s', '$ 4 $ m/s', '$ 5 $ m/s', '$ 7 $ m/s'], 2,
              'The two velocities are perpendicular, so $ |\\mathbf{v}_{rm}| = \\sqrt{16 + 9} = 5 $ m/s. It arrives at $ \\tan^{-1}(3/4) = 37° $ from the vertical, tilted from in front of him.'),
            num('p14-y5', 'A boat rows at $ 5 $ m/s across a $ 100 $ m river flowing at $ 3 $ m/s. Compare the time taken for the shortest-time crossing with the shortest-path crossing.',
              '$ 20 $ s versus $ 25 $ s',
              'Shortest time: $ t = 100/5 = 20 $ s, with a drift of $ 60 $ m. Shortest path: crossing speed $ = \\sqrt{25-9} = 4 $ m/s, so $ t = 100/4 = 25 $ s. Landing opposite costs 5 extra seconds.'),
            mcq('p14-y6', 'A boat rows straight across a flowing river. The time taken is:',
              ['Increased by the current', 'Unaffected by the current', 'Decreased by the current', 'Zero if the current is fast enough'], 1,
              'The current is entirely along the bank, so it has no across-river component and cannot change the crossing time. It only produces drift. This is the independence of perpendicular motions from page 1.'),
            num('p14-y7', 'A boat rows at $ 5 $ m/s in still water. How long does it take to row $ 10 $ m upstream and then back to the starting point, in a river flowing at $ 4 $ m/s?',
              '$ 100/9 \\approx 11.1 $ s',
              'Upstream the ground speed is $ 5 - 4 = 1 $ m/s, taking $ 10/1 = 10 $ s. Downstream it is $ 5 + 4 = 9 $ m/s, taking $ 10/9 = 1.1 $ s. Total $ = 100/9 \\approx 11.1 $ s. Note the round trip takes far longer than $ 20/5 = 4 $ s in still water — the slow leg dominates.'),
            num('p14-y8', 'A river $ 20 $ m wide flows at $ 3 $ m/s. A boat starts with a velocity of $ 2\\sqrt{2} $ m/s relative to the water, at $ 45° $ to the current. Find (a) the crossing time and (b) the drift.',
              '(a) $ 10 $ s  (b) $ 50 $ m',
              'Resolving: the across-river component is $ 2\\sqrt{2}\\sin 45° = 2 $ m/s and the along-river component is $ 2\\sqrt{2}\\cos 45° = 2 $ m/s downstream. (a) $ t = 20/2 = 10 $ s. (b) The total downstream speed is $ 3 + 2 = 5 $ m/s, so the drift is $ 5(10) = 50 $ m.'),
          ],
        },
      ],
    }),
    b('text', 14, {
      markdown: 'That is the teaching half of the chapter complete. What remains is retrieval: a recap page, the NCERT exercises, and a drill bank mapped onto the five topics this chapter has to cover.',
    }),
  ],
};

withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p13, p14]);
}).then(() => { console.log('\nWave 2b done — p13–p14'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
