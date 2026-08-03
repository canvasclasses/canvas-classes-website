'use strict';
/**
 * Class 11 Physics · Chapter 4 "Laws of Motion" — pages 3–6.
 * Wave 1b: Free Body Diagrams, Connected Bodies, and Constraint Equations
 * (fixed pulley, then movable pulleys / multi-pulley redirects / the wedge
 * setup). This is the block the founder specifically asked to be dedicated,
 * scenario-rich pages rather than one or two pages trying to hold everything.
 *
 * Run: node scripts/physics11-book/build_ch4_fbd_constraint.js
 */
const { b, q, st, mcq, num, hero, ensureChapter, upsertPages, withDb } = require('./_book_ch4');

// ── p3 · Free Body Diagrams — Isolating One Body at a Time ──────────────────
const p3 = {
  page_number: 3,
  slug: 'free-body-diagrams',
  title: 'Free Body Diagrams — Isolating One Body at a Time',
  subtitle: 'The single most useful habit in the whole chapter',
  glossary: [
    { term: 'free body diagram (FBD)', definition: 'A diagram of ONE chosen body, showing every external force acting ON it, and nothing else — not forces it exerts on other bodies, and not forces on bodies it is not directly touching.' },
    { term: 'normal force', definition: 'The contact force a surface exerts perpendicular to itself, preventing the two surfaces from passing through each other. Its size is whatever equilibrium (or F = ma) demands — it is not always equal to weight.' },
  ],
  blocks: [
    hero('free-body-diagrams'),
    b('curiosity_prompt', 0, {
      prompt: 'A crate sits on a truck bed, which sits on the truck\'s suspension, which sits on the axle, which sits on the tyres, which sit on the road. To find the force between the crate and the truck bed, do you need to think about all of that at once?',
      hint: 'Ask what is actually touching the crate.',
      reveal: 'No — and trying to is exactly how these problems become unmanageable. **Draw only the crate**, as an isolated shape floating on the page, and ask only: what is touching THIS body, right now? Just two things: gravity (pulling it down) and the truck bed (pushing up on it, wherever it touches). The suspension, the axle, the tyres — none of them touch the crate directly, so none of them appear on the crate\'s own diagram.\n\nThis discipline — one body, only the forces landing on it — is the free body diagram, and it is what turns a tangled multi-object scene into a short list of equations.',
    }),
    b('text', 1, {
      markdown: 'A **free body diagram** is a sketch of exactly one chosen body, with every external force acting **on** it drawn as an arrow — and nothing else.\n\nTwo rules keep it honest:\n\n1. **Only forces from other things onto this body.** A force this body exerts on something else never appears on its own diagram.\n2. **Only forces from things actually touching it** (contact forces: normal, tension, friction, applied push/pull) **plus gravity**, which acts at a distance. A force on a different body — even one connected by a string — never appears here either.\n\nGet the diagram right and the rest is bookkeeping: write $ \\sum F_x = ma_x $ and $ \\sum F_y = ma_y $ (or $ = 0 $ if it is in equilibrium) and solve.',
    }),
    b('step_solver', 2, {
      title: 'Scenario 1 — a block resting on the floor',
      problem: 'A 5 kg block rests at rest on a horizontal floor. Draw its free body diagram and find the normal force the floor exerts on it. Take $ g = 9.8 $ m/s².',
      intro: 'The simplest possible free body diagram — worth doing slowly once, because every harder one is built the same way.',
      steps: [
        st('Isolate the block. Only two things touch it: the Earth (gravity) and the floor (contact). Draw weight $ mg $ down, normal force $ N $ up.',
          'Nothing else appears — not "the floor\'s weight," not "the force the block exerts on the floor" (that is a DIFFERENT body\'s diagram, by the Third Law).', {
            check: {
              kind: 'mcq',
              prompt: 'Which of these belongs on the BLOCK\'s free body diagram?',
              options: [
                'The normal force the floor exerts on the block',
                'The normal force the block exerts on the floor',
                'The weight of the floor',
                'The force of friction the floor exerts on a different object nearby',
              ],
              answer_index: 0,
              feedback_right: 'Right — only forces landing ON the block itself. The block-on-floor force is the block\'s effect on a different body, so it belongs on the FLOOR\'s diagram, not this one.',
              feedback_wrong: 'The block\'s own FBD only shows forces acting ON the block. The block pushing on the floor is a force the block exerts on something else — it is the Third Law partner of $ N $, and belongs on the floor\'s diagram, not the block\'s.',
            },
          }),
        st('Vertical equilibrium (the block is at rest, so $ a_y = 0 $): $ N - mg = 0 \\ \\Rightarrow\\ N = mg $.',
          'Not a definition — a CONCLUSION from equilibrium. $ N $ happens to equal $ mg $ here only because nothing else is pulling or pushing vertically.', {
            check: {
              kind: 'fill_blank',
              prompt: 'With $ m = 5 $ kg and $ g = 9.8 $ m/s², find $ N $ in newtons.',
              blank_answer: '49',
              feedback_right: 'Yes — $ N = 5 \\times 9.8 = 49 $ N.',
              feedback_wrong: '$ N = mg = 5 \\times 9.8 = 49 $ N.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A 12 kg crate rests on a floor. Find the normal force on it. Take g = 9.8 m/s².',
        answer: '$ 117.6 $ N',
        solution: '$ N = mg = 12 \\times 9.8 = 117.6 $ N — the same equilibrium logic, a different number.',
      },
    }),
    b('step_solver', 3, {
      title: 'Scenario 2 — a mass hanging from a string',
      problem: 'A 3 kg mass hangs at rest from a single vertical string tied to the ceiling. Find the tension in the string. Take $ g = 9.8 $ m/s².',
      intro: 'Same method, a different pair of forces — tension replaces the normal force, because a string, not a floor, is what is touching the body.',
      steps: [
        st('Isolate the mass. Only the string (tension $ T $, upward, since a string can only PULL) and gravity ($ mg $, downward) touch it.',
          'A string can only pull along its own length — never push, and never sideways unless it is not vertical. That restriction is worth remembering; it becomes important the moment a string is at an angle.', {
            check: {
              kind: 'mcq',
              prompt: 'Which of the following could a taut string exert on a body it is tied to?',
              options: ['A push, along the string', 'A pull, along the string', 'A pull, perpendicular to the string', 'Nothing unless the body is also touching a surface'],
              answer_index: 1,
              feedback_right: 'Right — tension is a PULL, directed along the string\'s own length. It cannot push, and it cannot act sideways to itself.',
              feedback_wrong: 'A string (or rope, cable, thread) can only PULL, and only along its own length. It can never push, and it cannot exert a force perpendicular to itself.',
            },
          }),
        st('Vertical equilibrium: $ T - mg = 0 \\ \\Rightarrow\\ T = mg = 3 \\times 9.8 = 29.4\\ \\text{N} $.',
          'Structurally identical to the floor scenario — only the AGENT supplying the upward force has changed, from a normal force to a tension.', {
            why: 'This is worth noticing explicitly: "normal force" and "tension" are not two different laws of physics — they are both just the name for whatever contact force keeps the equilibrium equation balanced, given what is actually touching the body.',
          }),
      ],
      now_you_try: {
        problem: 'A 7 kg lamp hangs from a single string. Find the tension. Take g = 9.8 m/s².',
        answer: '$ 68.6 $ N',
        solution: '$ T = mg = 7 \\times 9.8 = 68.6 $ N.',
      },
    }),
    b('image', 4, {
      src: '',
      alt: 'Three separate free body diagrams side by side: a block on a floor with weight and normal force, a mass hanging from a string with weight and tension, and a block on an incline with weight resolved into components along and perpendicular to the slope.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-fbd-three-scenarios',
      caption: 'Three different bodies, three different contact agents — floor, string, incline — but every diagram is built the same way: isolate the body, draw only what touches it.',
    }),
    b('step_solver', 5, {
      title: 'Scenario 3 — a block on a smooth (frictionless) incline',
      problem: 'A 4 kg block is placed on a smooth incline of angle $ 30° $ and released from rest. Find the normal force on it, and its acceleration down the slope. Take $ g = 9.8 $ m/s².',
      intro: 'Weight no longer points conveniently along one of the two directions you care about — so the FBD now needs a resolution, exactly the way Chapter 3 resolved a velocity.',
      steps: [
        st('Choose axes ALONG the incline and PERPENDICULAR to it — not horizontal/vertical. Resolve weight: $ mg\\sin\\theta $ along the slope (down), $ mg\\cos\\theta $ into the slope.',
          'This choice of axes is deliberate: the normal force and the block\'s eventual acceleration both lie along these two directions, so resolving weight (the one force NOT already along an axis) is the only resolution needed.', {
            check: {
              kind: 'mcq',
              prompt: 'Why resolve the WEIGHT here, rather than trying to resolve the normal force?',
              options: [
                'The normal force is already perpendicular to the incline — exactly one of our chosen axes',
                'The normal force is harder to resolve than weight',
                'Weight is always resolved by convention, regardless of the geometry',
                'It does not matter which one is resolved',
              ],
              answer_index: 0,
              feedback_right: 'Right — the normal force already points exactly along one of the chosen axes (perpendicular to the incline), so it needs no resolving. Weight is the only force pointing off-axis here.',
              feedback_wrong: 'Choosing axes along/perpendicular to the incline makes the normal force fall EXACTLY on one axis already — no resolution needed for it. Weight is the one force left pointing in an inconvenient direction, so it is the one that gets resolved.',
            },
          }),
        st('Perpendicular to the incline (no motion in this direction): $ N - mg\\cos\\theta = 0 \\ \\Rightarrow\\ N = mg\\cos30° = 4(9.8)(0.866) \\approx 34.0\\ \\text{N} $',
          'The FULL weight no longer presses on the surface — only its perpendicular component does. This is why $ N < mg $ on any incline, always.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Along the incline, the only force is $ mg\\sin\\theta $ (nothing opposes it — smooth incline, no friction). Using $ F = ma $, find the acceleration down the slope, $ a = g\\sin\\theta $, with $ g = 9.8 $ m/s² and $ \\theta = 30° $, in m/s² to one decimal place.',
              blank_answer: '4.9',
              feedback_right: 'Yes — $ a = 9.8 \\times 0.5 = 4.9 $ m/s².',
              feedback_wrong: '$ a = g\\sin30° = 9.8 \\times 0.5 = 4.9 $ m/s². Notice the mass cancelled out entirely — every block slides down a given smooth incline at the same rate, regardless of its mass, exactly like free fall.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A 2 kg block is released from rest on a smooth 45° incline. Find the normal force and the acceleration down the slope. Take g = 9.8 m/s², $ \\sin45° = \\cos45° = 0.707 $.',
        answer: '$ N \\approx 13.9 $ N, $ a \\approx 6.93 $ m/s²',
        solution: '$ N = mg\\cos45° = 2(9.8)(0.707) \\approx 13.9 $ N. $ a = g\\sin45° = 9.8(0.707) \\approx 6.93 $ m/s².',
      },
    }),
    b('step_solver', 6, {
      title: 'Scenario 4 — a block pressed against a frictionless wall',
      problem: 'A 5 kg block is pressed against a vertical, frictionless wall by a horizontal force of $ 50 $ N. Does the block stay in place, and what does its free body diagram show? Take $ g = 9.8 $ m/s².',
      intro: 'This scenario is deliberately left unresolved — it sets up exactly the question the Friction pages exist to answer.',
      steps: [
        st('Isolate the block. Forces: the applied push $ F = 50 $ N (horizontal, into the wall), the wall\'s normal force $ N $ (horizontal, out of the wall), and weight $ mg $ (down). Nothing acts upward.',
          'A frictionless wall can only push perpendicular to itself — horizontally, here — never vertically. There is genuinely no vertical force available to hold the block up.', {
            check: {
              kind: 'mcq',
              prompt: 'Horizontally, the block does not move into or out of the wall. What does that tell you about N?',
              options: ['N = F = 50 N', 'N is always zero for a vertical wall', 'N depends on the block\'s weight', 'N cannot be determined'],
              answer_index: 0,
              feedback_right: 'Right — horizontal equilibrium (the block neither accelerates into the wall nor flies off it) forces N to exactly balance F: N = 50 N.',
              feedback_wrong: 'The block stays pressed against the wall without moving further into it or away from it, so the horizontal forces must balance: N = F = 50 N.',
            },
          }),
        st('Vertically, only $ mg = 5(9.8) = 49\\ \\text{N} $ acts — nothing opposes it.',
          'With no vertical force available, the First Law is unambiguous: the block CANNOT be in vertical equilibrium here.', {
            check: {
              kind: 'mcq',
              prompt: 'So what actually happens to this block?',
              options: [
                'It stays perfectly still, held by the normal force',
                'It slides down the wall under gravity, at $ a = g = 9.8 $ m/s², while staying pressed against it horizontally',
                'It falls straight down, losing contact with the wall',
                'It flies off the wall horizontally',
              ],
              answer_index: 1,
              feedback_right: 'Right — the normal force only balances the horizontal push. With nothing to balance gravity, the block accelerates straight down at g, sliding down the wall face the entire time.',
              feedback_wrong: 'The normal force handles the horizontal direction only (N = F = 50 N keeps it from moving into or off the wall). Gravity is completely unopposed vertically, so the block slides straight down the wall at $ a = g = 9.8 $ m/s².',
            },
          }),
      ],
      now_you_try: {
        problem: 'A 2 kg block is pushed against a frictionless vertical wall by a horizontal force of 30 N. Find the normal force, and describe the block\'s vertical motion.',
        answer: 'N = 30 N; the block accelerates straight down at g = 9.8 m/s², since nothing opposes gravity vertically',
        solution: 'Horizontal equilibrium gives N = F = 30 N. With no vertical force available (frictionless wall, nothing below), gravity acts unopposed and the block slides down the wall face at a = g.',
      },
    }),
    b('callout', 7, {
      variant: 'note',
      title: 'What is missing from this last picture — on purpose',
      markdown: 'In real life, a block pressed hard enough against a wall usually DOES stay up — feel this by pinning a book to a wall with your palm. What is missing here is **friction**, which can act along the wall face and hold the block up, given a hard enough push.\n\nThis exact picture is worked out properly, with real numbers, on **"Friction — Walls, Wedges, and Minimum-Force Problems"** later in this chapter. It is left open here because an FBD should only show forces actually in the picture — and without friction, this one genuinely has none holding the block up.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A book\'s free body diagram should include:',
          ['Every single force present anywhere in the room, on any object', 'Only forces acting ON the book, from things touching it or gravity', 'Only the forces that the book itself exerts on other, different objects', 'The weight of the table that the book happens to be resting on'],
          1, 'An FBD isolates exactly one body and shows only the external forces landing ON it — nothing the body exerts elsewhere, and nothing acting on a different object.', 1),
        q('A block sits on an incline. The normal force on it is:',
          ['Always exactly equal to its full weight, mg, on any incline', 'Equal to $ mg\\cos\\theta $, less than the full weight', 'Equal to $ mg\\sin\\theta $, the component along the slope itself', 'Always exactly zero, regardless of the incline\'s angle'],
          1, 'Only the component of weight perpendicular to the incline is balanced by the normal force: $ N = mg\\cos\\theta $, which is always less than the full weight $ mg $ on any sloped surface.', 2),
        q('A string tied to a hanging mass can exert:',
          ['A push or a pull, along the string', 'Only a pull, along the string', 'A push perpendicular to itself', 'Force in any direction, depending on the mass'],
          1, 'A string (unlike a rigid rod) can only pull, and only along its own length — it goes slack rather than pushing.', 1),
        q('A block is pushed against a frictionless wall by a purely horizontal force and released from rest. Vertically, it will:',
          ['Remain exactly still, held in place by the wall\'s normal force', 'Accelerate downward at g, since nothing acts vertically to oppose gravity', 'Accelerate upward, away from the ground beneath it', 'Move sideways, coming away from the wall entirely'],
          1, 'The wall\'s normal force is horizontal only — it cannot supply any vertical support. With gravity unopposed vertically, the block falls at exactly g while remaining pressed to the wall horizontally.', 2),
        q('Two blocks are stacked, one on top of the other, on a table. When drawing the FREE BODY DIAGRAM of the TOP block alone, which force belongs on it?',
          ['The weight of the bottom block alone, never including the weight of the top one at all', 'The normal force from the table surface below, acting only on the bottom block itself', 'The normal force from the bottom block, pushing up on the top block, plus the top block\'s own weight', 'The combined weight of both blocks stacked together, added up as one single number'],
          2, 'The top block\'s own diagram only shows forces landing ON the top block: its own weight, and the contact force from whatever is actually touching it — the bottom block\'s upward push. Nothing about the bottom block\'s own weight or its contact with the table belongs on the TOP block\'s diagram.', 3),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- A free body diagram shows **only** forces acting ON one chosen body — never a force it exerts elsewhere, never a force on a body it is not touching.\n- A string can only **pull**, along its length. A surface\'s normal force is always **perpendicular** to it.\n- On an incline, resolve **weight** (not the normal force) — axes along/perpendicular to the slope leave the normal force needing no resolution.\n- $ N = mg\\cos\\theta $ on a smooth incline — always less than the full weight.\n- A frictionless surface can only push perpendicular to itself. With nothing else supporting a body in some direction, it accelerates freely that way.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. Draw the free body diagram first, on paper, before writing a single equation — every one of these is easy once the diagram is right and confusing if it is not.',
      sections: [
        {
          id: 'p3-ysi',
          title: 'Free Body Diagrams',
          items: [
            num('p3-y1', 'A 6 kg block rests on a floor. Find the normal force on it. Take g = 9.8 m/s².',
              '$ 58.8 $ N', '$ N = mg = 6 \\times 9.8 = 58.8 $ N.'),
            num('p3-y2', 'A 4.5 kg mass hangs from a single vertical string. Find the tension. Take g = 9.8 m/s².',
              '$ 44.1 $ N', '$ T = mg = 4.5 \\times 9.8 = 44.1 $ N.'),
            mcq('p3-y3', 'A block rests on an incline of angle 20°. Compared to the same block on a 40° incline, the normal force on the 20° incline is:',
              ['Smaller than on the steeper 40° incline', 'Larger, since $ \\cos20° > \\cos40° $', 'Exactly the same on both of these two inclines', 'Zero, since 20° is the gentler of the two inclines'],
              1, '$ N = mg\\cos\\theta $, and cosine DECREASES as the angle increases, so the gentler (20°) incline has the LARGER normal force — more of the weight presses straight into a gentler slope.'),
            num('p3-y4', 'A 5 kg block is released from rest on a smooth 37° incline. Find its acceleration down the slope. Take g = 9.8 m/s², sin37° = 0.6.',
              '$ 5.88 $ m/s²', '$ a = g\\sin37° = 9.8 \\times 0.6 = 5.88 $ m/s² — independent of the mass.'),
            mcq('p3-y5', 'On the FREE BODY DIAGRAM of a block held up by a hanging string, which of these should NOT appear?',
              ['The block\'s weight', 'The tension in the string', 'The force the block exerts on the string', 'Nothing else is missing — this list is complete'],
              2, 'The block exerts a force ON the string (pulling it down) — but that is a force from the block onto a DIFFERENT object, so it belongs on the string\'s own diagram, never on the block\'s.'),
            num('p3-y6', 'A 3 kg block is pushed against a frictionless vertical wall by a horizontal force of 40 N. Find the normal force from the wall.',
              '$ 40 $ N', 'Horizontal equilibrium: N = F = 40 N, regardless of the block\'s mass or weight.'),
            mcq('p3-y7', 'A block on a smooth incline is released from rest. Which statement about its acceleration down the slope is correct?',
              ['It depends on the block\'s mass — heavier blocks accelerate faster', 'It is independent of mass, equal to $ g\\sin\\theta $', 'It equals g regardless of the angle', 'It is always less than the acceleration of a block in free fall by exactly half'],
              1, 'The mass cancels out of $ ma = mg\\sin\\theta $ entirely, leaving $ a = g\\sin\\theta $ — every block on a given smooth incline accelerates at the same rate, exactly like the mass-independence of free fall.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'Every scenario on this page had exactly one body. The next page keeps the free body diagram discipline but adds the piece that makes it genuinely useful — a **string connecting two bodies**, where the trick is knowing which body to isolate, and when.',
    }),
  ],
};

// ── p4 · Connected Bodies — One String, One Acceleration ────────────────────
const p4 = {
  page_number: 4,
  slug: 'connected-bodies',
  title: 'Connected Bodies — One String, One Acceleration',
  subtitle: 'Two masses, one string, one shared number',
  glossary: [
    { term: 'system approach', definition: 'Treating several connected bodies as one combined body to find their SHARED acceleration, using only the external forces on the whole group.' },
  ],
  blocks: [
    hero('connected-bodies'),
    b('curiosity_prompt', 0, {
      prompt: 'Two blocks, tied together by a string, sit on a frictionless table. You pull the FRONT block forward with some force. Is the string\'s tension bigger, smaller, or the same as if you pulled the BACK block instead, with that same force?',
      hint: 'Ask what job the string is actually doing in each case.',
      reveal: '**Different — and quite a lot different.**\n\nPull the front block, and the string has to drag the ENTIRE back block along by itself — the tension does all the work of accelerating that mass. Pull the back block instead, and the string only has to drag the front block — a different mass, so a different tension, for the exact same pulling force.\n\nThe shared acceleration of the two blocks together does not care which one you pull — only the TOTAL mass and the total force matter for that. But the tension in the string very much depends on which block is doing the pulling, because the string\'s job is to supply exactly the force needed to accelerate whatever is on the OTHER side of it.',
    }),
    b('step_solver', 1, {
      title: 'The method: treat the system as one, then isolate one body for the string',
      problem: 'Two blocks of masses $ m_1 $ and $ m_2 $ are connected by a light, inextensible string, on a frictionless surface. A force $ F $ is applied to $ m_1 $, pulling both blocks together. Find (a) the common acceleration, and (b) the tension in the string, in terms of $ m_1, m_2, F $.',
      intro: 'This is the pattern every connected-body problem in this chapter follows: first the WHOLE system, then ONE body alone.',
      steps: [
        st('Treat $ m_1 $ and $ m_2 $ as ONE combined body of mass $ m_1+m_2 $. The only EXTERNAL force on this combined system is $ F $ — the string\'s tension is now internal, and cancels.',
          'Internal forces (the string pulling each block toward the other) never change the acceleration of the system as a whole — only forces from OUTSIDE the system do.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does the string\'s tension not appear when finding the common acceleration this way?',
              options: [
                'The string is assumed massless',
                'Tension pulls $ m_1 $ backward and $ m_2 $ forward with equal magnitude — internal to the system, it cancels when the whole system is considered together',
                'Tension is always zero for an inextensible string',
                'Tension only matters for the front block',
              ],
              answer_index: 1,
              feedback_right: 'Right — any internal force appears twice, once on each body, equal and opposite, and cancels the moment you consider the whole group as one.',
              feedback_wrong: 'Tension pulls $ m_2 $ forward and, by the Third Law, pulls $ m_1 $ backward with the same magnitude. Considered as ONE system, these are internal, equal-and-opposite forces and cancel out entirely — leaving only the external force $ F $.',
            },
          }),
        st('$ a = \\dfrac{F}{m_1+m_2} $',
          'The system\'s acceleration, from the combined mass and the one external force — Newton\'s Second Law applied to the group as a single object.', {
            why: 'This a is shared by BOTH blocks — the string is inextensible, so they cannot move at different rates. That shared value is exactly what makes step 2 possible.',
          }),
        st('Now isolate $ m_2 $ ALONE. The only horizontal force on it is the tension $ T $ pulling it forward: $ T = m_2 a = \\dfrac{m_2 F}{m_1+m_2} $.',
          'This is why you isolate the body that F is NOT applied to: every force accelerating it must be the string, so the string\'s tension is read off directly.', {
            check: {
              kind: 'mcq',
              prompt: 'If instead $ F $ had been applied to $ m_2 $ (pulling $ m_1 $ behind it), the tension in the string would then be:',
              options: [
                'Still $ m_2 a $',
                '$ m_1 a $ instead — the mass of whichever block is NOT being pulled directly',
                'Unchanged, since tension does not depend on which end is pulled',
                '$ F $ itself, regardless of either mass',
              ],
              answer_index: 1,
              feedback_right: 'Right — isolate whichever block is not directly pulled, and the tension is that block\'s mass times the (unchanged) common acceleration.',
              feedback_wrong: 'The rule is: isolate the block F is NOT applied to. If F pulls $ m_2 $, then $ m_1 $ is the one dragged along purely by the string, so $ T = m_1 a $ — a different tension than before, even though the common acceleration $ a $ is unchanged.',
            },
          }),
      ],
      now_you_try: {
        problem: 'Two blocks of mass 4 kg and 6 kg are connected by a string on a frictionless table. A force of 30 N is applied to the 4 kg block, pulling both. Find the common acceleration and the string tension.',
        answer: '$ a = 3 $ m/s², $ T = 18 $ N',
        solution: '$ a = F/(m_1+m_2) = 30/10 = 3 $ m/s². Isolating the 6 kg block (not directly pulled): $ T = m_2 a = 6 \\times 3 = 18 $ N.',
      },
    }),
    b('step_solver', 2, {
      title: 'The same string, pulled from the other end — a direct comparison',
      problem: 'Two blocks of mass $ 10 $ kg and $ 20 $ kg lie on a frictionless surface, connected by a string. A horizontal force of $ 600 $ N is applied (i) to the $ 10 $ kg block, and (ii) to the $ 20 $ kg block. Find the string\'s tension in each case.',
      intro: 'Same two masses, same force, same common acceleration — but watch how differently the tension comes out, depending on which block is pulled.',
      steps: [
        st('Common acceleration (same in both cases, since total mass and total external force are unchanged): $ a = \\dfrac{600}{10+20} = 20\\ \\text{m/s}^2 $',
          'This number does not care which block F is applied to — the whole-system argument from the previous step-solver only needs the total mass and the one external force.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Confirm: 600 divided by 30 is:',
              blank_answer: '20',
              feedback_right: 'Yes — 20 m/s².',
              feedback_wrong: '$ 600/30 = 20 $ m/s².',
            },
          }),
        st('Case (i), F on the 10 kg block: isolate the 20 kg block (not directly pulled). $ T = m_{20}\\,a = 20 \\times 20 = 400\\ \\text{N} $.',
          'The string has to drag the FULL 20 kg block, so it needs a large tension.', {
            check: {
              kind: 'mcq',
              prompt: 'Case (ii): F is now applied to the 20 kg block instead, pulling the 10 kg block behind it. The tension is now:',
              options: [
                'Still 400 N — the masses have not changed',
                '$ 10 \\times 20 = 200 $ N — the string now only has to drag the 10 kg block',
                '$ 600 $ N — the full applied force',
                'Zero, since the heavier block is doing the pulling',
              ],
              answer_index: 1,
              feedback_right: 'Right — isolate the block NOT being pulled (the 10 kg one, this time), so T = 10 × 20 = 200 N. Same acceleration, much smaller tension.',
              feedback_wrong: 'Isolating the block that is NOT directly pulled — the 10 kg block in case (ii) — gives $ T = m_{10}\\,a = 10 \\times 20 = 200 $ N. The tension has genuinely changed, even though the common acceleration has not.',
            },
          }),
        st('Case (i): $ T = 400 $ N. Case (ii): $ T = 200 $ N — exactly double, in the direction you\'d expect.',
          'Pulling from the LIGHTER block\'s end always produces MORE tension, because the string then has to drag the HEAVIER block. Pulling from the heavier end leaves the string with the lighter, easier job.', {
            why: 'This result generalises: for any two connected masses, the tension is always (mass of the block NOT being pulled) × (common acceleration) — so whichever block you pull from, look at the OTHER one to read off the tension.',
          }),
      ],
      now_you_try: {
        problem: 'Blocks of 5 kg and 15 kg are connected by a string on a frictionless surface. A force of 200 N is applied to the 5 kg block. Find the acceleration and the tension.',
        answer: '$ a = 10 $ m/s², $ T = 150 $ N',
        solution: '$ a = 200/20 = 10 $ m/s². The 15 kg block is not directly pulled, so $ T = 15 \\times 10 = 150 $ N.',
      },
    }),
    b('step_solver', 3, {
      title: 'Three blocks in a row — the method generalises exactly',
      problem: 'Three blocks of mass $ 2 $ kg, $ 3 $ kg and $ 5 $ kg are connected in a line by two strings, on a frictionless surface, and pulled by a force of $ 100 $ N applied to the front (2 kg) block. Find the common acceleration and the tension in each of the two strings.',
      intro: 'Nothing new here except one more body — which is exactly the point. The system method does not care how many blocks are in the chain.',
      steps: [
        st('Whole system: $ a = \\dfrac{F}{m_1+m_2+m_3} = \\dfrac{100}{2+3+5} = 10\\ \\text{m/s}^2 $',
          'All ten kilograms, one external force — the two internal string tensions cancel completely when the system is taken as a whole.', {
            check: {
              kind: 'fill_blank',
              prompt: '100 divided by 10 is:',
              blank_answer: '10',
              feedback_right: 'Yes — 10 m/s².',
              feedback_wrong: '$ 100/10 = 10 $ m/s².',
            },
          }),
        st('First string (between the 2 kg and 3 kg blocks): isolate EVERYTHING behind it — the 3 kg and 5 kg blocks together, mass 8 kg. $ T_1 = (m_2+m_3)a = 8 \\times 10 = 80\\ \\text{N} $.',
          'The trick for a chain: to find a string\'s tension, isolate the group of blocks BEHIND it (further from the pull) and treat that group as one system — the string is the only thing dragging that whole group forward.', {
            check: {
              kind: 'mcq',
              prompt: 'For the SECOND string (between the 3 kg and 5 kg blocks), which group should be isolated?',
              options: [
                'The 5 kg block alone, since it is the very last one',
                'The 2 kg and 3 kg blocks together',
                'All three blocks together',
                'The string cannot be isolated this way'
              ],
              answer_index: 0,
              feedback_right: 'Right — isolate whatever is behind THAT string. Behind the second string is just the 5 kg block, on its own.',
              feedback_wrong: 'Behind the second string is only the 5 kg block. Isolating IT alone (not the 2 kg + 3 kg group, which is in FRONT of this string) gives the second tension directly.',
            },
          }),
        st('$ T_2 = m_3\\,a = 5 \\times 10 = 50\\ \\text{N} $',
          'Notice the pattern: $ T_1 > T_2 $. Each string only has to drag the blocks behind IT — so tension decreases as you move back along the chain, and the very last block needs no string behind it at all.', {
            why: 'Check: the 3 kg block alone should feel $ T_1 $ forward and $ T_2 $ backward, giving its own acceleration: $ (80-50)/3 = 10 $ m/s² ✓ — matches the whole-system value, as it must.',
          }),
      ],
      now_you_try: {
        problem: 'Three blocks of mass 1 kg, 2 kg and 3 kg are connected in a line and pulled by a 60 N force on the front (1 kg) block. Find the acceleration and both string tensions.',
        answer: '$ a = 10 $ m/s², $ T_1 = 50 $ N, $ T_2 = 30 $ N',
        solution: '$ a = 60/6 = 10 $ m/s². First string (behind it: 2+3=5 kg): $ T_1 = 5\\times10 = 50 $ N. Second string (behind it: 3 kg alone): $ T_2 = 3\\times10 = 30 $ N.',
      },
    }),
    b('step_solver', 4, {
      title: 'Connected bodies on an incline',
      problem: 'Two blocks of mass $ 2 $ kg (lower) and $ 3 $ kg (upper) are connected by a string and lie along a smooth $ 30° $ incline. A force of $ 40 $ N, directed up the slope, is applied to the upper (3 kg) block, pulling both blocks up the incline. Take $ g = 10 $ m/s². Find the common acceleration and the tension.',
      intro: 'Same system method as the horizontal case — the only change is that gravity now has a component ALONG the direction of motion, which was zero before.',
      steps: [
        st('Whole system, along the incline: $ F - (m_1+m_2)g\\sin\\theta = (m_1+m_2)a $',
          'Gravity opposes the pull here, since the blocks are being dragged UP the slope. This is the one new term compared to the horizontal case — everything else about the method is identical.', {
            check: {
              kind: 'fill_blank',
              prompt: 'With $ m_1+m_2 = 5 $ kg, $ g=10 $, $ \\sin30°=0.5 $: evaluate $ (m_1+m_2)g\\sin\\theta $, in newtons.',
              blank_answer: '25',
              feedback_right: 'Yes — $ 5 \\times 10 \\times 0.5 = 25 $ N, the combined weight component pulling both blocks back down the slope.',
              feedback_wrong: '$ (m_1+m_2)g\\sin\\theta = 5(10)(0.5) = 25 $ N.',
            },
          }),
        st('$ 40 - 25 = 5a \\ \\Rightarrow\\ a = 3\\ \\text{m/s}^2 $ up the slope.',
          'A smaller net force than the horizontal case would have given (40 N vs. the full 40 N with nothing opposing it) — gravity is doing real work fighting the pull.', {
            check: {
              kind: 'mcq',
              prompt: 'To find the tension, which single block should be isolated?',
              options: [
                'The lower (2 kg) block — it is NOT directly pulled by F',
                'The upper (3 kg) block, since F acts on it',
                'Either block gives the same working',
                'Neither — tension needs the whole system',
              ],
              answer_index: 0,
              feedback_right: 'Right — same rule as the horizontal cases: isolate whichever block does not have F applied to it directly.',
              feedback_wrong: 'The lower (2 kg) block has no applied force of its own — only the string (tension, up the slope) and its own weight component (down the slope) act on it. That makes it the one to isolate.',
            },
          }),
        st('Lower block alone: $ T - m_1 g\\sin\\theta = m_1 a \\ \\Rightarrow\\ T = m_1(a+g\\sin\\theta) = 2(3+5) = 16\\ \\text{N}$',
          'Check against the upper block: $ F - T - m_2 g\\sin\\theta = 40 - 16 - 3(10)(0.5) = 40-16-15 = 9 = m_2 a = 3(3) = 9 $ ✓', {
            why: 'The check matters here specifically because this problem has more moving parts (an incline AND two blocks) than any before it on this page — always verify a harder result against the OTHER block\'s equation before trusting it.',
          }),
      ],
      now_you_try: {
        problem: 'Two blocks of mass 1 kg (lower) and 4 kg (upper) are connected by a string on a smooth 30° incline, pulled up the slope by a 30 N force on the upper block. Take g = 10 m/s². Find the acceleration and the tension.',
        answer: '$ a = 1 $ m/s², $ T = 6 $ N',
        solution: 'System: $ 30 - 5(10)(0.5) = 5a \\Rightarrow 30-25=5a \\Rightarrow a=1 $ m/s². Lower block: $ T = m_1(a+g\\sin\\theta) = 1(1+5) = 6 $ N. Check on upper block: $ 30-6-4(10)(0.5)=30-6-20=4=4(1) $ ✓.',
      },
    }),
    b('inline_quiz', 5, {
      pass_threshold: 0.6,
      questions: [
        q('Two blocks connected by a string are pulled by a force F applied to one of them, on a frictionless surface. The common acceleration of the system depends on:',
          ['Only the mass of whichever block is being directly pulled', 'The total mass of both blocks and the applied force', 'Only the tension developed in the connecting string', 'Depends on which of the two blocks is being pulled'],
          1, 'Treating the system as one body, $ a = F/(m_1+m_2) $ — total mass, one external force. Which block is pulled changes the TENSION, not this shared acceleration.', 1),
        q('For two blocks connected by a string, with F applied to block A, the string tension equals:',
          ['Simply equal to the applied force $ F $ itself', '(mass of A) × (common acceleration), the block being pulled', '(mass of B, the block NOT directly pulled) × (common acceleration)', 'Always exactly equal to half of the applied force F'],
          2, 'Isolating the block that F is NOT applied to shows the string is the ONLY force accelerating it, so T = (that block\'s mass) × a.', 2),
        q('In a chain of three blocks pulled from the front, the tension in the string CLOSEST to the pulling force, compared to the string FARTHEST from it, is:',
          ['Smaller than the string farthest from the pull', 'Larger — it has to drag more mass behind it', 'Exactly equal to the farthest string\'s tension', 'Zero, regardless of how many blocks are in the chain'],
          1, 'Each string only has to accelerate the blocks BEHIND it. The string closest to the front still has the most mass behind it (all the remaining blocks), so it carries the largest tension; the last string only drags the final block.', 2),
        q('Two blocks are connected by a string on a smooth incline and pulled up the slope by a force applied to one of them. Compared to the same setup on a horizontal frictionless surface, the common acceleration for the same applied force is:',
          ['Exactly the same in both of these two cases', 'Smaller, since gravity has a component opposing the motion up the slope', 'Larger, since the incline somehow helps the pulling motion', 'Impossible to compare without knowing the incline\'s angle'],
          1, 'On an incline, gravity contributes a retarding component $ (m_1+m_2)g\\sin\\theta $ that is absent on a horizontal surface, so the net force — and hence the acceleration — is smaller for the same applied F.', 2),
        q('If the string joining two connected blocks were replaced by a slightly STRETCHY (extensible) one, the assumption that both blocks share exactly the same acceleration would:',
          ['Still hold exactly true, regardless of what material the string happens to be made of', 'No longer hold exactly, since the string could stretch by a changing amount', 'Only fail to hold in the case where the two blocks happen to have different masses', 'Only ever matter for the string\'s tension, and never for the shared acceleration'],
          1, 'The "same acceleration" constraint comes directly from the string being INEXTENSIBLE — its length, and so the distance between the blocks, is fixed. An extensible string breaks that constraint, since the gap between the blocks could change over time.', 3),
      ],
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **The system method:** to find the shared acceleration, treat every connected body as ONE object — internal tensions cancel, only external forces and total mass matter.\n- **To find a tension:** isolate the block (or group of blocks) that force is NOT directly applied to. The string is then the only thing accelerating it.\n- In a chain, a string only has to drag whatever is BEHIND it — tension decreases moving back along the chain.\n- Which block is pulled from **never changes the shared acceleration**, but very much changes each individual tension.\n- On an incline, add the weight component along the slope to the system equation; everything else about the method is unchanged.',
    }),
    b('practice_bank', 7, {
      title: 'You solve it',
      intro: 'Seven questions. State which body (or group) you are isolating before writing the equation for it — this is the one habit that prevents these from becoming confusing.',
      sections: [
        {
          id: 'p4-ysi',
          title: 'Connected Bodies',
          items: [
            num('p4-y1', 'Two blocks of 3 kg and 7 kg are connected by a string on a frictionless table. A force of 50 N is applied to the 3 kg block. Find the acceleration and tension.',
              '$ a = 5 $ m/s², $ T = 35 $ N',
              '$ a = 50/10 = 5 $ m/s². Isolating the 7 kg block (not pulled): $ T = 7 \\times 5 = 35 $ N.'),
            mcq('p4-y2', 'The same two blocks (3 kg, 7 kg) and the same 50 N force, but now applied to the 7 kg block instead. The tension is now:',
              ['35 N, exactly unchanged from the first case', '15 N — the string now only drags the 3 kg block', '50 N, the full applied force itself', '21 N, some other intermediate value'],
              1, 'Acceleration is unchanged (5 m/s², same total mass and force), but now the 3 kg block is the one NOT directly pulled: $ T = 3 \\times 5 = 15 $ N.'),
            num('p4-y3', 'Four identical 2 kg blocks are connected in a line and pulled by a 40 N force on the front block. Find the tension in the LAST string (nearest the back).',
              '$ 10 $ N',
              '$ a = 40/8 = 5 $ m/s². The last string only has to drag the final 2 kg block: $ T = 2\\times5=10 $ N.'),
            mcq('p4-y4', 'In a three-block chain pulled from the front, the FIRST string (nearest the pull) carries a tension of 80 N and the acceleration is 10 m/s². The combined mass of the two blocks BEHIND that string is:',
              ['10 kg', '8 kg', '80 kg', 'Cannot be determined'],
              1, 'That string drags exactly the mass behind it: $ m = T/a = 80/10 = 8 $ kg.'),
            num('p4-y5', 'Two blocks of 4 kg and 6 kg, connected by a string, lie on a smooth 30° incline and are pulled up the slope by a 60 N force on the 4 kg (upper) block. Take g = 10 m/s². Find the common acceleration.',
              '$ 1 $ m/s²',
              '$ 60 - (10)(10)(0.5) = 10a \\Rightarrow 60-50=10a \\Rightarrow a=1 $ m/s².'),
            mcq('p4-y6', 'For the previous question, find the tension in the string, isolating the 6 kg (lower) block.',
              ['16 N', '36 N', '60 N', '6 N'],
              1, 'Lower-block equation: $ T - m_1 g\\sin\\theta = m_1 a \\Rightarrow T = m_1(a+g\\sin\\theta) = 6(1+5) = 36 $ N.'),
            mcq('p4-y7', 'A chain of connected blocks is pulled from the front on a frictionless surface. If the pulling force is DOUBLED (masses unchanged), the tension in every string in the chain:',
              ['Stays the same', 'Doubles, exactly like the acceleration', 'Halves', 'Increases, but not necessarily by exactly double'],
              1, 'Every tension in this method is (some mass) × (common acceleration). Doubling F doubles the common acceleration $ a=F/M $ exactly, and since each tension is directly proportional to that same $ a $, every tension in the chain doubles too.'),
          ],
        },
      ],
    }),
    b('text', 8, {
      markdown: 'Every string on this page ran in a straight line, with both blocks moving the same way at the same rate. The next two pages ask what happens the moment a string changes DIRECTION — over a pulley — where the two connected bodies can move at different speeds, in different directions, and the relationship between them has to be worked out from the string\'s own geometry.',
    }),
  ],
};

// ── p5 · Constraint Equations I — the Fixed Pulley ───────────────────────────
const p5 = {
  page_number: 5,
  slug: 'constraint-equations-fixed-pulley',
  title: 'Constraint Equations I — the Fixed Pulley',
  subtitle: 'One string, one pulley, and a rule that never needs guessing',
  glossary: [
    { term: 'constraint equation', definition: 'A relation between the accelerations (or velocities) of two connected bodies, forced by a fixed total length of string — derived from geometry, not from any force.' },
    { term: 'ideal pulley', definition: 'Massless and frictionless, unless stated otherwise. It changes the DIRECTION of a string\'s tension without changing its magnitude.' },
  ],
  blocks: [
    hero('constraint-equations-fixed-pulley'),
    b('curiosity_prompt', 0, {
      prompt: 'A 12 kg mass and an 8 kg mass hang from opposite ends of a string over a pulley. Before doing a single calculation — which way does the system move, and does the 8 kg mass\'s acceleration have to be exactly the same SIZE as the 12 kg mass\'s, even though they are moving in opposite directions?',
      hint: 'Think about what a fixed length of string actually forces to be true.',
      reveal: 'It moves with the **heavier (12 kg) side going down** — no surprise there. What is worth pausing on is the second half: yes, their accelerations must be **exactly equal in magnitude**, always, for as long as the string stays taut.\n\nThe string has a fixed total length. Whatever length is gained on one side (as the 12 kg mass descends) must be lost on the other (as the 8 kg mass rises) — not approximately, exactly, at every instant. That is a **constraint equation**, and it comes from the string\'s geometry alone, before a single force has been considered.',
    }),
    b('text', 1, {
      markdown: 'A fixed pulley — one bolted in place, not free to move — does exactly one job: it changes the **direction** a string pulls in, without changing the **magnitude** of its tension (true for an ideal, massless, frictionless pulley), and without changing the **magnitude** of the string\'s length on either side, taken together.\n\nThat second fact is the constraint. If one side lengthens by $ x $, the other side must shorten by exactly $ x $, because the total is fixed. Differentiate that length relation twice with respect to time, and:\n\n$ a_1 = a_2 $ (in magnitude) — one side\'s downward acceleration exactly equals the other side\'s upward acceleration, for any two masses joined by one string over one fixed pulley.',
    }),
    b('step_solver', 2, {
      title: 'One block on a table, one hanging — the most common single pulley picture',
      problem: 'A block of mass $ 3 $ kg lies on a frictionless horizontal table. A string from it runs over a pulley fixed at the edge of the table, down to a hanging block of mass $ 2 $ kg. Find the common acceleration and the tension. Take $ g = 10 $ m/s².',
      intro: 'The constraint here is the simplest version: the string is inextensible, so the table block moves exactly as far, and exactly as fast, as the hanging block falls.',
      steps: [
        st('Free body diagram of the table block (3 kg): only the tension $ T $ acts horizontally (the table\'s normal force and its weight cancel vertically). $ T = m_1 a $.',
          'Nothing opposes T on this block\'s horizontal direction — a frictionless table, so tension alone decides its acceleration.', {
            check: {
              kind: 'mcq',
              prompt: 'Free body diagram of the HANGING block (2 kg): which forces act on it?',
              options: [
                'Only tension, upward',
                'Weight downward and tension upward',
                'Weight downward only',
                'Weight, tension, and the table\'s normal force',
              ],
              answer_index: 1,
              feedback_right: 'Right — the hanging block only touches the string (tension, up) and is pulled by gravity (weight, down). It never touches the table at all.',
              feedback_wrong: 'The hanging block is touching only the string, plus gravity acting on it — so exactly two forces: tension T upward, weight $ m_2 g $ downward. It has no contact with the table.',
            },
          }),
        st('Hanging block: $ m_2 g - T = m_2 a $ (same $ a $ as the table block, by the constraint).',
          'This is the constraint equation doing its job silently — both equations use the SAME symbol $ a $, because the string forces it.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Add the two equations ($ T=m_1a $ and $ m_2g-T=m_2a $) so $ T $ cancels: $ m_2 g = (m_1+m_2)a $. With $ m_1=3, m_2=2, g=10 $, find $ a $ in m/s².',
              blank_answer: '4',
              feedback_right: 'Yes — $ a = 2(10)/5 = 4 $ m/s².',
              feedback_wrong: '$ a = m_2 g/(m_1+m_2) = 2(10)/(3+2) = 20/5 = 4 $ m/s².',
            },
          }),
        st('$ T = m_1 a = 3 \\times 4 = 12\\ \\text{N}$. Check: $ m_2g - T = 2(10)-12 = 8 = m_2 a = 2(4) = 8 $ ✓',
          'Both equations agree — the check is not optional here, because a sign error in either free body diagram would otherwise pass unnoticed.', {
            why: 'Notice the pattern: this is EXACTLY the same "add the equations, tension cancels" method as the connected-bodies page — a pulley only changes which direction each body\'s equation points in, not the method itself.',
          }),
      ],
      now_you_try: {
        problem: 'A 4 kg block on a frictionless table is connected by a string over an edge pulley to a hanging 6 kg block. Take g = 10 m/s². Find the acceleration and tension.',
        answer: '$ a = 6 $ m/s², $ T = 24 $ N',
        solution: '$ a = m_2g/(m_1+m_2) = 6(10)/10 = 6 $ m/s². $ T = m_1 a = 4(6)=24 $ N. Check: $ 6(10)-24=36=6(6) $ ✓.',
      },
    }),
    b('step_solver', 3, {
      title: 'The Atwood machine — two hanging masses',
      problem: 'Masses of $ 8 $ kg and $ 12 $ kg hang from the two ends of a light, inextensible string passing over a fixed, frictionless pulley. Find the acceleration of the system and the tension in the string, when released from rest. Take $ g = 10 $ m/s².',
      intro: 'Both bodies now hang — the constraint is the same rule as before, just applied to two vertical free body diagrams instead of one horizontal and one vertical.',
      steps: [
        st('Let the heavier (12 kg) side move DOWN with acceleration $ a $. By the constraint, the lighter (8 kg) side then moves UP with the same magnitude $ a $.',
          'Choosing a direction for $ a $ up front — "12 kg side goes down" — and staying consistent with it in both equations is what keeps the signs from going wrong.', {
            check: {
              kind: 'mcq',
              prompt: 'For the 12 kg mass (moving down, in our chosen positive direction), Newton\'s Second Law reads:',
              options: [
                '$ T - 12g = 12a $',
                '$ 12g - T = 12a $',
                '$ 12g + T = 12a $',
                '$ T = 12g $'
              ],
              answer_index: 1,
              feedback_right: 'Right — weight (down, positive here) minus tension (up, opposing the motion) equals mass times the acceleration in the chosen positive (downward) direction.',
              feedback_wrong: 'With "downward" chosen positive for the 12 kg mass: weight acts downward (+12g), tension acts upward (−T), giving $ 12g - T = 12a $.',
            },
          }),
        st('For the 8 kg mass (moving UP, so "up" is its positive direction here): $ T - 8g = 8a $',
          'The SAME tension $ T $ and the SAME magnitude $ a $ appear in both equations — that sharing is exactly what the constraint (and the ideal, massless pulley) guarantees.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Add the two equations: $ (12g-T) + (T-8g) = 12a+8a \\Rightarrow 4g = 20a $. With g=10, find a, in m/s².',
              blank_answer: '2',
              feedback_right: 'Yes — $ a = 40/20 = 2 $ m/s².',
              feedback_wrong: '$ 4g = 20a \\Rightarrow a = 4(10)/20 = 2 $ m/s².',
            },
          }),
        st('$ T = 8g+8a = 8(10)+8(2) = 96\\ \\text{N}$. Check on the other side: $ 12g-T = 120-96=24=12(2) $ ✓',
          'The general results, worth keeping: $ a = \\dfrac{(m_2-m_1)g}{m_1+m_2} $ and $ T = \\dfrac{2m_1m_2g}{m_1+m_2} $, with $ m_2 $ the heavier mass.', {
            why: 'A useful sanity check on the FORMULA itself, not just this one answer: if $ m_1=m_2 $, the formula gives $ a=0 $ and $ T=m_1g $ — an evenly balanced Atwood machine that simply hangs still, tension equal to either weight. That is exactly what should happen, and it is a fast way to catch an algebra mistake before trusting a general formula.',
          }),
      ],
      now_you_try: {
        problem: 'Masses of 5 kg and 15 kg hang over a fixed frictionless pulley. Take g = 10 m/s². Find the acceleration and the tension.',
        answer: '$ a = 5 $ m/s², $ T = 75 $ N',
        solution: '$ a = (15-5)(10)/(20) = 5 $ m/s². $ T = 5(10)+5(5) = 75 $ N. Check: $ 15(10)-75=75=15(5) $ ✓.',
      },
    }),
    b('image', 4, {
      src: '',
      alt: 'A fixed pulley with two masses hanging on either side, one arrow labelled a pointing down on the heavier mass and an equal-length arrow labelled a pointing up on the lighter mass, and the tension T drawn the same size on both string segments.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-atwood-machine',
      caption: 'The Atwood machine. Same tension throughout the string (ideal pulley), same magnitude of acceleration on both sides (inextensible string) — opposite directions.',
    }),
    b('step_solver', 5, {
      title: 'A quick sanity check that catches most algebra mistakes',
      problem: 'Using the general Atwood formulas $ a = \\dfrac{(m_2-m_1)g}{m_1+m_2} $ and $ T = \\dfrac{2m_1m_2g}{m_1+m_2} $, check what they predict if one of the two masses were replaced by nothing at all ($ m_1 \\to 0 $) — a single mass hanging from a string over a pulley, with the other end free.',
      intro: 'A "does this formula behave sensibly at an extreme?" check — cheap to do, and it catches sign errors that a single numeric plug-in can miss.',
      steps: [
        st('Set $ m_1 = 0 $ in $ a = \\dfrac{(m_2-m_1)g}{m_1+m_2} $: $ a = \\dfrac{m_2 g}{m_2} = g $.',
          'With nothing on the other end, the remaining mass should simply be in FREE FALL — and the formula, without being told that specifically, produces exactly $ g $.', {
            check: {
              kind: 'mcq',
              prompt: 'Does this match what should physically happen with the other end of the string completely free (nothing attached)?',
              options: [
                'Yes — with nothing resisting it, the hanging mass should fall exactly as if in free fall',
                'No — the pulley should still slow it down somewhat',
                'No — it should fall faster than g',
                'The formula does not apply once one mass is zero',
              ],
              answer_index: 0,
              feedback_right: 'Right — an unloaded string offers no resistance at all, so the remaining mass genuinely free-falls at g, exactly as the formula predicts.',
              feedback_wrong: 'With the other end of the string carrying nothing, there is nothing to resist the fall — the mass is essentially in free fall, and the formula correctly reduces to $ a = g $.',
            },
          }),
        st('Set $ m_1 = 0 $ in $ T = \\dfrac{2m_1m_2g}{m_1+m_2} $: $ T = 0 $.',
          'A free string, attached to nothing on one end, cannot carry any tension — and the formula agrees.', {
            why: 'This kind of check — set a variable to zero, or to equal the other variable, and see if the result is physically obvious — is worth running on ANY derived formula before using it on a real problem. It costs one line and catches sign errors that plugging in ordinary numbers would not.',
          }),
      ],
      now_you_try: {
        problem: 'Check the Atwood tension formula for the case $ m_1 = m_2 = m $ (equal masses). What does it predict, and does it make sense?',
        answer: '$ a = 0 $, $ T = mg $ — the system hangs in balance, each side\'s tension simply equal to its own weight',
        solution: '$ a=(m-m)g/(2m)=0 $. $ T=2m^2g/(2m)=mg $. With equal masses neither side has any reason to move, and each hanging mass is then in ordinary equilibrium, needing tension exactly equal to its own weight — exactly what the formula gives.',
      },
    }),
    b('step_solver', 6, {
      title: 'Three masses, one string, one pulley — the method scales up cleanly',
      problem: 'A mass $ m_1 = 6 $ kg hangs from one side of a fixed pulley. On the other side, a mass $ m_2 = 2 $ kg is tied to a second string below it, from which a third mass $ m_3 = 2 $ kg hangs. Take $ g = 10 $ m/s². Find the common acceleration and the tension in EACH of the two strings.',
      intro: 'Three bodies now, but only one string passes over the pulley — so the SAME single constraint (equal magnitude of acceleration for the pulley\'s two sides) still applies to the whole $ m_2+m_3 $ side taken together.',
      steps: [
        st('Guess $ m_1 $ (6 kg, alone on its side) moves DOWN with acceleration $ a $; then $ m_2 $ and $ m_3 $ together move UP with the same $ a $.',
          'Since $ m_1=6 $ kg is heavier than $ m_2+m_3=4 $ kg combined, this guessed direction is the physically sensible one — worth checking before solving, exactly like the two-mass case.', {
            check: {
              kind: 'mcq',
              prompt: 'Which equation is correct for $ m_1 $ (6 kg, moving down), with $ T_1 $ the tension in the string over the pulley?',
              options: ['$ T_1 - m_1 g = m_1 a $', '$ m_1 g - T_1 = m_1 a $', '$ m_1 g + T_1 = m_1 a $', '$ T_1 = m_1 g $'],
              answer_index: 1,
              feedback_right: 'Right — weight down (positive, our chosen direction), tension up (opposing), same form as the two-mass Atwood case.',
              feedback_wrong: 'Exactly as in the two-mass case: $ m_1 g - T_1 = m_1 a $, weight acting in the chosen positive (downward) direction, tension opposing it.',
            },
          }),
        st('For $ m_2 $ (moving UP): $ T_1 - m_2 g - T_2 = m_2 a $, where $ T_2 $ is the SECOND string\'s tension, pulling DOWN on $ m_2 $ (it is what holds $ m_3 $ below it).',
          'This is the one genuinely new idea: $ m_2 $ feels three forces, not two — the main string pulling it up, its own weight down, and the SECOND string pulling it down (the Third Law reaction to holding $ m_3 $ up).', {
            check: {
              kind: 'fill_blank',
              prompt: 'For $ m_3 $ (moving UP, held only by the second string): $ T_2 - m_3 g = m_3 a $. Add all three equations so BOTH $ T_1 $ and $ T_2 $ cancel: $ m_1g - m_2g - m_3g = (m_1+m_2+m_3)a $. With the given masses and g=10, find a, in m/s².',
              blank_answer: '2',
              feedback_right: 'Yes — $ a = (6-2-2)(10)/10 = 20/10 = 2 $ m/s².',
              feedback_wrong: '$ a = (m_1-m_2-m_3)g/(m_1+m_2+m_3) = (6-2-2)(10)/10 = 2 $ m/s².',
            },
          }),
        st('$ T_2 = m_3(g+a) = 2(10+2) = 24\\ \\text{N}$. Then $ T_1 = m_1(g-a) = 6(10-2) = 48\\ \\text{N}$. Check on $ m_2 $: $ T_1-m_2g-T_2 = 48-20-24=4=m_2a=2(2)=4 $ ✓',
          'Notice $ T_1 > T_2 $ — the string closer to the pulley carries more mass\'s worth of the total pull, exactly the same "tension is bigger nearer the driving end" pattern seen on the connected-bodies page.', {
            why: 'This three-body problem is really the connected-bodies chain from the last page, bent over a pulley — the SAME "isolate what\'s behind the string" logic works, once the direction of each side is fixed sensibly at the start.',
          }),
      ],
      now_you_try: {
        problem: 'A mass of 10 kg hangs on one side of a fixed pulley. On the other side, a 3 kg mass has a 1 kg mass tied below it by a second string. Take g = 10 m/s². Find the acceleration and both tensions.',
        answer: '$ a \\approx 4.29 $ m/s², $ T_2 \\approx 14.3 $ N, $ T_1 \\approx 57.1 $ N',
        solution: '$ a = (10-3-1)(10)/14 = 60/14 \\approx 4.29 $ m/s². $ T_2 = 1(10+4.29) \\approx 14.3 $ N. $ T_1 = 10(10-4.29) \\approx 57.1 $ N (check against $ m_2 $: $ T_1 - 3g - T_2 = 57.1-30-14.3 \\approx 12.9 \\approx 3(4.29) $ ✓, small rounding).',
      },
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('In an Atwood machine with masses 5 kg and 7 kg, the magnitude of the acceleration of the 5 kg mass, compared to the 7 kg mass, is:',
          ['Smaller', 'Exactly equal', 'Larger', 'Cannot be compared without more data'],
          1, 'A single inextensible string over one ideal pulley forces both sides to have exactly the same MAGNITUDE of acceleration — always, regardless of the two masses.', 1),
        q('For a general Atwood machine, if the two masses are made equal, the formulas predict:',
          ['A large acceleration in one particular direction', 'Zero acceleration and tension equal to either weight', 'Zero tension throughout the entire string', 'The whole system falls freely under gravity'],
          1, 'A sanity check worth remembering: equal masses balance exactly, giving a = 0, with each side needing tension just equal to its own weight to stay in that balance.', 2),
        q('One mass hangs from a string over a fixed pulley; the other end of the string is completely free (nothing attached). The hanging mass\'s acceleration is:',
          ['Zero, since the pulley still resists any motion', 'Less than g, since the string offers some resistance', 'Exactly g — free fall', 'Greater than g, since the pulley adds to the fall'],
          2, 'With nothing on the other end, the string offers no resistance at all — the mass is effectively in free fall, exactly matching the $ m_1\\to0 $ limit of the Atwood formula.', 2),
        q('A block on a frictionless table is connected via an edge pulley to a hanging block. Which force provides the horizontal acceleration of the TABLE block?',
          ['Its own weight', 'The normal force from the table', 'Tension in the string', 'Friction from the table'],
          2, 'On a frictionless table, weight and normal force cancel vertically and contribute nothing horizontally — the string\'s tension is the ONLY horizontal force on that block.', 2),
        q('In a three-mass pulley system (one mass alone on one side, two masses connected in series on the other), the tension in the string CLOSER to the single mass, compared to the tension in the string BETWEEN the two series masses, is generally:',
          ['Smaller than the string between the two series masses', 'Larger, since it must support more of the total moving mass', 'Exactly equal to it, always, regardless of the masses', 'Undefined without knowing every individual mass'],
          1, 'Exactly like the multi-block chain: the string nearer the "driving" side carries the combined effect of more of the system\'s mass, so it works out larger than the string further along the chain.', 3),
      ],
    }),
    b('callout', 8, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **The constraint:** one inextensible string over one fixed pulley forces both sides to the same MAGNITUDE of acceleration, always.\n- **Method:** write $ F=ma $ for EACH body, sharing one symbol for $ a $ across all of them, then add/eliminate to solve.\n- Atwood results: $ a = \\dfrac{(m_2-m_1)g}{m_1+m_2} $, $ T = \\dfrac{2m_1m_2g}{m_1+m_2} $ — both reduce sensibly at $ m_1=m_2 $ and at $ m_1\\to0 $.\n- **Sanity-check any derived formula** at an extreme case before trusting it — one extra line, catches real mistakes.\n- With three bodies on one string, the SAME constraint still holds — only the number of equations grows.',
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Eight questions on the fixed-pulley constraint. Fix a direction for the acceleration FIRST, in every question, and stay consistent with it in every equation you write.',
      sections: [
        {
          id: 'p5-ysi',
          title: 'Constraint Equations — Fixed Pulley',
          items: [
            num('p5-y1', 'A 5 kg block on a frictionless table is connected over an edge pulley to a hanging 5 kg block. Take g = 10 m/s². Find the acceleration.',
              '$ 5 $ m/s²', '$ a = m_2g/(m_1+m_2) = 5(10)/10 = 5 $ m/s².'),
            mcq('p5-y2', 'For the previous question, the tension in the string is:',
              ['50 N', '25 N', '10 N', '0 N'],
              1, 'Isolating the table block: $ T = m_1 a = 5(5) = 25 $ N.'),
            num('p5-y3', 'Masses of 6 kg and 10 kg hang from a fixed pulley. Take g = 10 m/s². Find the acceleration.',
              '$ 2.5 $ m/s²', '$ a = (10-6)(10)/16 = 40/16 = 2.5 $ m/s².'),
            mcq('p5-y4', 'For the previous question, the tension in the string is:',
              ['30 N', '75 N', '48 N', '60 N'],
              1, '$ T = m_1(g+a) = 6(10+2.5) = 75 $ N (check: $ m_2(g-a)=10(7.5)=75 $ ✓).'),
            mcq('p5-y5', 'In an Atwood machine, if BOTH masses are doubled (keeping their ratio the same), the acceleration:',
              ['Doubles along with the masses', 'Stays exactly the same', 'Halves as the masses double', 'Quadruples as the masses double'],
              1, '$ a=(m_2-m_1)g/(m_1+m_2) $ is a RATIO of masses — scaling both masses by the same factor leaves this ratio, and so the acceleration, completely unchanged. (The tension, however, does double.)'),
            num('p5-y6', 'A 6 kg mass hangs on one side of a fixed pulley. On the other side, a 1 kg mass has a 1 kg mass tied below it by a second string. Take g = 10 m/s². Find the common acceleration.',
              '$ 5 $ m/s²', '$ a = (m_1-m_2-m_3)g/(m_1+m_2+m_3) = (6-1-1)(10)/8 = 40/8 = 5 $ m/s².'),
            mcq('p5-y7', 'A single mass hangs from one end of a string over a fixed pulley, with literally nothing tied to the other end. Its acceleration is:',
              ['Zero', 'Less than g, since the pulley resists it', 'Exactly g', 'Greater than g'],
              2, 'A free string end offers no resistance at all — the hanging mass is in genuine free fall, at exactly g, matching the $ m_1\\to 0 $ limiting case worked through on this page.'),
            mcq('p5-y8', 'Which of these correctly states the fixed-pulley constraint, for two masses connected by one inextensible string over it?',
              ['Their velocities must be equal in both magnitude and direction, at every single instant', 'Their accelerations are equal in magnitude, opposite in direction (one side\'s down matches the other\'s up)', 'Their accelerations are entirely unrelated to one another in every possible case', 'Only their two masses need to be exactly equal for any constraint to exist at all'],
              1, 'The string\'s fixed total length forces the two sides to gain and lose length at exactly the same rate — same MAGNITUDE of acceleration, but directed oppositely (one side descending exactly as the other ascends).'),
          ],
        },
      ],
    }),
    b('text', 10, {
      markdown: 'Every pulley on this page was fixed in place — bolted to the ceiling or the table edge, never moving itself. The next page asks what changes the moment the PULLEY is free to move too — which turns out to double the mechanical advantage, and needs one more layer of constraint bookkeeping to get right.',
    }),
  ],
};

// ── p6 · Constraint Equations II — Movable Pulleys and Wedges ───────────────
const p6 = {
  page_number: 6,
  slug: 'constraint-equations-movable-pulleys-and-wedges',
  title: 'Constraint Equations II — Movable Pulleys and Wedges',
  subtitle: 'When the pulley itself is free to move — and the hardest constraint picture in the chapter',
  glossary: [
    { term: 'movable pulley', definition: 'A pulley that is not fixed in place, but is itself free to move — typically hanging from, or carrying, a load. Two string segments support it, giving a mechanical advantage of 2.' },
  ],
  blocks: [
    hero('constraint-equations-movable-pulleys-and-wedges'),
    b('curiosity_prompt', 0, {
      prompt: 'A mechanic lifts an engine block using a pulley that hangs from a hook, with the rope looping under it and back up to a fixed point. To raise the engine by 1 metre, does the mechanic have to pull 1 metre of rope, or more than that?',
      hint: 'Count how many rope segments are actually holding the engine up.',
      reveal: '**More — twice as much, in fact.** TWO segments of rope support the movable pulley (and the engine hanging from it), one going up to the fixed point and one leading off to the mechanic\'s hands. For the engine to rise by 1 metre, BOTH of those two supporting segments must shorten by 1 metre each — so a full 2 metres of rope has to be pulled through.\n\nThis is the trade a movable pulley always makes: **pull twice the distance, at half the force**, to lift the same load. The constraint on this page is exactly that factor-of-2 relationship, made precise.',
    }),
    b('text', 1, {
      markdown: 'A **movable pulley** is not bolted down — it hangs from the very rope that runs through it, and typically carries the load itself. Two segments of that rope now support it (rather than one, as with a fixed pulley), and that changes both the force AND the constraint.\n\nThe total length of rope is still fixed, so the SAME logic as p5 applies — just applied to more segments. If the load end (movable pulley) rises by $ y $, and each of its two supporting segments must shorten by $ y $, then a full $ 2y $ of rope has to be taken up somewhere else along the line — usually at the free end being pulled.',
    }),
    b('step_solver', 2, {
      title: 'Deriving the movable-pulley constraint from the string length',
      problem: 'One end of a string is tied to a fixed support. It runs down and under a movable pulley (from which a mass hangs), then back up and over a SECOND, fixed pulley, then down to a mass hanging freely at the other end. If the freely-hanging mass descends by a distance $ x $, how far does the movable pulley (and its mass) move, and in which direction?',
      intro: 'This is a pure geometry question — no forces yet, exactly like the derivation that opened the fixed-pulley page.',
      steps: [
        st('Total string length = (fixed support to movable pulley) + (movable pulley to fixed pulley) + (fixed pulley to hanging mass) = constant.',
          'Three segments this time, not two — but the same "the sum cannot change" idea from the fixed-pulley constraint.', {
            check: {
              kind: 'mcq',
              prompt: 'If the freely-hanging mass descends by $ x $, the THIRD segment (fixed pulley to that mass) has:',
              options: ['Shortened by x', 'Lengthened by x', 'Stayed the same', 'Lengthened by 2x'],
              answer_index: 1,
              feedback_right: 'Right — as the mass descends, it moves further from the fixed pulley above it, so that segment gets longer, by exactly x.',
              feedback_wrong: 'The hanging mass moving DOWN, away from the fixed pulley above it, makes that segment of string LONGER, by exactly x.',
            },
          }),
        st('Since the total is fixed and the third segment lengthened by $ x $, the FIRST TWO segments together must shorten by $ x $ — and by symmetry (both pass over/under the movable pulley), each shortens by $ x/2 $.',
          'The movable pulley sits between segments one and two — as IT rises, both of those segments shorten together, equally, since both are attached to the same rising point.', {
            check: {
              kind: 'fill_blank',
              prompt: 'So the movable pulley (and its load) moves UP by how much, in terms of x — express as a fraction of x (e.g. "x/2"):',
              blank_answer: 'x/2',
              feedback_right: 'Yes — the movable pulley rises by x/2, exactly half of what the free end descended.',
              feedback_wrong: 'Each of the two segments supporting the movable pulley shortens by x/2 (half of the total x that had to be "found" from segments one and two combined), so the pulley itself rises by x/2.',
            },
          }),
        st('Differentiating twice: if $ a_1 $ is the acceleration of the freely-hanging mass and $ a_2 $ is the acceleration of the movable pulley\'s mass, then $ a_2 = \\dfrac{a_1}{2} $, in the OPPOSITE sense (one descends as the other rises).',
          'This is the constraint the rest of the page uses: whatever the single-string side does, the movable-pulley side does at HALF the rate, moving the other way.', {
            why: 'The mechanical-advantage-of-2 result from the curiosity prompt and this constraint are the same fact seen from two sides: half the acceleration (and half the force needed, by energy/momentum bookkeeping) is the price of needing twice the rope pulled through.',
          }),
      ],
      now_you_try: {
        problem: 'In the same arrangement, if the movable pulley\'s mass rises by 0.3 m, how much rope passes over the fixed pulley on the other side?',
        answer: '$ 0.6 $ m',
        solution: 'Reversing the constraint: the movable side moving by y requires 2y of rope taken up on the single-string side, so 2(0.3) = 0.6 m passes over the fixed pulley.',
      },
    }),
    b('step_solver', 3, {
      title: 'Solving the movable-pulley system with real masses',
      problem: 'A $ 1 $ kg mass hangs from the free end of the string (the single-segment side, over the fixed pulley). A $ 4 $ kg mass hangs from the movable pulley. Using the constraint $ a_1 = -2a_2 $ (taking "downward" as positive for each mass\'s own motion) and $ g = 10 $ m/s², find both accelerations and the tension.',
      intro: 'Two free body diagrams, one constraint equation, three unknowns ($ a_1, a_2, T $) — solvable exactly like the three-mass fixed-pulley problem, just with a different constraint ratio.',
      steps: [
        st('Free body diagram of the 1 kg mass: $ m_1 g - T = m_1 a_1 $. Free body diagram of the 4 kg mass (TWO string segments support it, each with tension $ T $): $ m_2 g - 2T = m_2 a_2 $.',
          'The movable pulley\'s mass is held by TWO segments of the same string — so the total upward force on it is $ 2T $, not $ T $. This factor of 2 is the other half of the mechanical-advantage trade.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does 2T (not T) appear in the equation for the 4 kg mass?',
              options: [
                'Because it is heavier than the 1 kg mass',
                'Because two segments of the same string both pull upward on the movable pulley carrying it',
                'Because the pulley itself has mass',
                'It is a typo — T should appear once, as usual',
              ],
              answer_index: 1,
              feedback_right: 'Right — the movable pulley (and its load) is supported by two string segments, each carrying tension T, so the total upward pull is 2T.',
              feedback_wrong: 'The movable pulley hangs from TWO segments of the string that loops under it, and each carries the same tension T (ideal string/pulley) — so the total supporting force is 2T, not T.',
            },
          }),
        st('Substitute the constraint $ a_1 = -2a_2 $ into the first equation: $ T = m_1(g-a_1) = m_1(g+2a_2) $. Substitute into the second: $ m_2 g - 2m_1(g+2a_2) = m_2 a_2 $.',
          'This is genuinely more algebra than the fixed-pulley case — three unknowns really do take more bookkeeping. Go slowly rather than trying to skip a line.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Expanding: $ m_2g - 2m_1g - 4m_1a_2 = m_2a_2 \\Rightarrow a_2(m_2+4m_1) = (m_2-2m_1)g $. With $ m_1=1, m_2=4, g=10 $: numerator is $ (4-2)(10)=20 $, denominator is $ (4+4)=8 $. Find $ a_2 $, in m/s².',
              blank_answer: '2.5',
              feedback_right: 'Yes — $ a_2 = 20/8 = 2.5 $ m/s², downward (the 4 kg mass descends).',
              feedback_wrong: '$ a_2 = 20/8 = 2.5 $ m/s².',
            },
          }),
        st('$ a_1 = -2a_2 = -5\\ \\text{m/s}^2 $ (the negative sign means the 1 kg mass actually accelerates UPWARD, at 5 m/s²). $ T = m_1(g-a_1) = 1(10-(-5)) = 15\\ \\text{N}$.',
          'Check on the 4 kg mass: $ m_2g - 2T = 4(10)-2(15) = 40-30 = 10 = m_2 a_2 = 4(2.5) = 10 $ ✓', {
            why: 'Physically this makes sense: the 4 kg mass, split across two rope segments, is effectively only "2 kg worth" of pull on the single-string side — which beats the 1 kg mass, so the heavier-looking side wins and descends, exactly as the numbers show.',
          }),
      ],
      now_you_try: {
        problem: 'A 2 kg mass hangs on the single-string side of a movable-pulley system; an 8 kg mass hangs from the movable pulley. Take g = 10 m/s². Using the same constraint and method, find both accelerations and the tension.',
        answer: '$ a_2 = 2.5 $ m/s² (8 kg mass descends), $ a_1 = 5 $ m/s² (2 kg mass rises), $ T = 30 $ N',
        solution: 'Numerator $ (m_2-2m_1)g = (8-4)(10) = 40 $; denominator $ (m_2+4m_1) = 8+8=16 $. $ a_2 = 40/16 = 2.5 $ m/s² (8 kg side descends). $ a_1 = -2a_2 = -5 $, i.e. the 2 kg mass accelerates upward at 5 m/s². $ T = m_1(g-a_1) = 2(10-(-5)) = 30 $ N. Check on the 8 kg mass: $ 8(10) - 2(30) = 80-60=20=8(2.5) $ ✓.',
      },
    }),
    b('step_solver', 4, {
      title: 'Sanity-checking the movable-pulley formula at an extreme',
      problem: 'Using $ a_2 = \\dfrac{(m_2-2m_1)g}{m_2+4m_1} $ (downward-positive for the movable-pulley side), check what happens if the single-string side carries NOTHING at all ($ m_1 \\to 0 $).',
      intro: 'The same habit as the fixed-pulley page: test a derived formula at an extreme case before trusting it on a real problem.',
      steps: [
        st('Set $ m_1 = 0 $: $ a_2 = \\dfrac{m_2 g}{m_2} = g $.',
          'With nothing at all on the single-string side, that side offers no resistance whatsoever — so the movable-pulley mass should simply free-fall.', {
            check: {
              kind: 'mcq',
              prompt: 'Does $ a_2 = g $ make physical sense here, with literally nothing on the other side of the string?',
              options: [
                'Yes — with no resistance at all from the empty single-string side, the movable pulley\'s load genuinely free-falls',
                'No — the pulley mechanism itself should still slow the fall down somewhat',
                'No — it should fall SLOWER than g because of the pulley',
                'The formula breaks down and gives a meaningless result here',
              ],
              answer_index: 0,
              feedback_right: 'Right — an ideal, massless pulley with nothing resisting on the other side offers no resistance at all, so free fall at g is exactly correct.',
              feedback_wrong: 'An ideal pulley has no mass and no friction of its own — with nothing on the single-string side to resist it, the movable-pulley\'s load is free to fall exactly as if nothing were attached at all: $ a_2 = g $.',
            },
          }),
        st('And the single-string side itself, with $ m_1=0 $: from $ a_1=-2a_2=-2g $, meaning it accelerates upward at $ 2g $ — twice free fall.',
          'This looks strange at first — nothing is there, so how can "it" accelerate at 2g? — but it is really a statement about the STRING END, which is snapped upward at twice the rate the movable pulley descends, exactly as the constraint requires.', {
            why: 'This is a genuinely useful habit for the hardest page in the chapter: when a derived result feels strange, check whether it is describing a physical mass (which must obey ordinary limits) or a purely geometric point on a string (which is under no such restriction).',
          }),
      ],
      now_you_try: {
        problem: 'Using the same formula, check what happens if the movable-pulley side carries NOTHING at all ($ m_2 \\to 0 $), with a real mass $ m_1 $ on the single-string side.',
        answer: '$ a_2 = -g/2 $ (the empty movable-pulley point moves UP at $ g/2 $), while $ a_1 = g $ (the single mass free-falls)',
        solution: '$ a_2 = (0-2m_1)g/(0+4m_1) = -2m_1g/4m_1 = -g/2 $. Then $ a_1=-2a_2=g $ — with nothing on the movable-pulley side to resist it, $ m_1 $ simply free-falls, exactly as on the fixed-pulley page\'s $ m_1\\to0 $ check.',
      },
    }),
    b('image', 5, {
      src: '',
      alt: 'A movable pulley with two string segments both labelled tension T supporting a hanging mass, and a single string segment of the same tension T running over a fixed pulley to a second hanging mass, with a note that the movable side moves at half the acceleration of the single-string side.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-movable-pulley',
      caption: 'Two segments, same tension T, both supporting the movable pulley — so 2T of upward force for one T of rope pulled. The trade: half the acceleration on that side, for every one unit on the other.',
    }),
    b('step_solver', 5, {
      title: 'Fixed pulleys in a row only redirect — they never change the physics',
      problem: 'A mass of $ 5 $ kg hangs from one end of a string. The string runs up, over a FIRST fixed pulley, sideways, then over a SECOND fixed pulley, and down to a $ 3 $ kg mass on the other side. Take $ g = 10 $ m/s². Find the acceleration and tension.',
      intro: 'This looks more complicated than a plain Atwood machine because of the extra pulley — but check whether that pulley actually changes anything.',
      steps: [
        st('Every pulley here is FIXED (bolted in place, not carrying a load itself) — it only bends the string\'s path, without adding or removing any length, and without changing the tension (ideal, frictionless).',
          'A fixed pulley\'s only job is redirection. Adding a second one just bends the string\'s path through one more corner — it does not add a second "2T" segment the way a MOVABLE pulley does.', {
            check: {
              kind: 'mcq',
              prompt: 'Does adding a second FIXED pulley (as opposed to a movable one) change the constraint between the two masses\' accelerations?',
              options: [
                'No — it is still exactly one string of fixed total length between the two masses, so the same "equal magnitude, opposite sense" constraint from a plain Atwood machine applies',
                'Yes — the constraint ratio becomes 1:2, as with a movable pulley',
                'Yes — the tension is now different on each side',
                'The problem cannot be solved without knowing the distance between the two pulleys',
              ],
              answer_index: 0,
              feedback_right: 'Right — redirecting a string through any number of FIXED, ideal pulleys changes nothing about the string\'s total length constraint or its tension. This is physically an ordinary Atwood machine, just laid out around a corner.',
              feedback_wrong: 'Fixed, ideal pulleys only bend the path of a string — they add no extra supporting segments (unlike a movable pulley) and do not change the tension. This is exactly an ordinary two-mass Atwood machine, mechanically, regardless of how many corners the string turns through.',
            },
          }),
        st('So this is simply $ a = \\dfrac{(m_2-m_1)g}{m_1+m_2} = \\dfrac{(5-3)(10)}{8} = 2.5\\ \\text{m/s}^2 $ and $ T = \\dfrac{2m_1m_2g}{m_1+m_2} = \\dfrac{2(5)(3)(10)}{8} = 37.5\\ \\text{N} $',
          'The exact same formulas from the plain Atwood machine, unchanged — because the extra fixed pulley genuinely adds nothing to the physics.', {
            why: 'The lesson worth taking from this one: before reaching for new algebra on a pulley problem that LOOKS more complicated, check whether every pulley is fixed. If so, it usually reduces to something already solved — the complexity is in the drawing, not the physics.',
          }),
      ],
      now_you_try: {
        problem: 'Masses of 6 kg and 4 kg are connected by a string that runs over three separate FIXED pulleys before reaching each mass. Take g = 10 m/s². Find the acceleration.',
        answer: '$ 2 $ m/s²',
        solution: 'Any number of fixed, ideal pulleys still leaves this as a plain Atwood machine: $ a = (6-4)(10)/10 = 2 $ m/s², regardless of how many corners the string turns through.',
      },
    }),
    b('callout', 6, {
      variant: 'note',
      title: 'Setting up the hardest picture in this chapter — solved properly on the Pseudo Force pages',
      markdown: 'One more picture is worth naming, though not fully solved here: a block sliding down a **wedge that is itself free to slide** on the floor. Both accelerate, in different directions, linked but not by a simple pulley ratio.\n\nSolved directly in the ground frame, it needs the block\'s acceleration relative to the wedge PLUS the wedge\'s own, combined vectorially, alongside a horizontal-momentum argument for the wedge — two coupled arguments at once, exactly where "just apply a formula" stops working.\n\nThe **Pseudo Force** pages solve this differently: step into the wedge\'s own accelerating frame, and the block\'s motion becomes an ordinary incline problem again. Worth waiting for.',
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('A movable pulley carries a load supported by two segments of the same string. If the load rises by 1 m, the total length of string pulled through at the free end is:',
          ['0.5 m', '1 m', '2 m', '4 m'],
          2, 'Both supporting segments must shorten by 1 m each to let the load rise 1 m, so a total of 2 m of string is taken up elsewhere along the line.', 1),
        q('For a movable pulley, the total upward force supporting the load (in terms of the string tension T) is:',
          ['T', '2T', 'T/2', 'Depends on the load\'s mass'],
          1, 'Two string segments, each carrying tension T (ideal string and pulley), both pull upward on the movable pulley and its load — a total of 2T.', 1),
        q('A string runs from one mass, over TWO separate fixed pulleys, to a second mass. Compared to the same two masses connected directly over just ONE fixed pulley, the acceleration of the system is:',
          ['Different, purely because of the presence of that one single extra pulley', 'Exactly the same — fixed pulleys only redirect, they add nothing to the constraint or the tension', 'Half of what it would otherwise be, purely because of the extra redirection involved', 'Cannot be compared at all without first knowing the distance between the two pulleys'],
          1, 'Any number of ideal FIXED pulleys leaves the string\'s total-length constraint and its tension completely unchanged — mechanically this is still a plain two-mass Atwood system.', 2),
        q('In a movable-pulley system with a 1 kg mass on the single-string side and a 4 kg mass on the movable-pulley side, which side accelerates faster (in magnitude)?',
          ['The 1 kg mass — twice as fast as the 4 kg mass', 'The 4 kg mass — twice as fast as the 1 kg mass', 'They accelerate at exactly the same rate', 'Neither accelerates — the system is balanced'],
          0, 'The constraint $ a_1 = -2a_2 $ means the single-string side ALWAYS moves at twice the rate of the movable-pulley side, in magnitude — confirmed by the worked numbers, 5 m/s² vs. 2.5 m/s².', 2),
        q('A block on a wedge that is itself free to slide on a frictionless floor is a harder constraint problem than a fixed pulley because:',
          ['The block and wedge both accelerate, in different directions, linked by a relationship that is not a simple fixed ratio like a pulley\'s', 'Wedges simply have no free body diagram of their own at all to speak of, unlike blocks or pulleys do in every case', 'Friction is always necessarily present on the surface of literally any wedge whatsoever, without a single exception', 'It cannot be solved by any method whatsoever, under any circumstances at all, even in principle, ever'],
          0, 'Unlike a pulley\'s clean 1:1 or 1:2 ratio, a sliding wedge and the block on it are linked through a genuinely two-dimensional relative-motion argument plus a momentum condition — harder to set up, though solvable, as the later Pseudo Force pages show with a cleaner method.', 3),
      ],
    }),
    b('callout', 8, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- A **movable pulley** is supported by TWO string segments — 2T lifts its load, but that load moves at HALF the rate of the single-string side: $ a_{\\text{single}} = 2\\,a_{\\text{movable}} $.\n- Any number of **fixed** pulleys in a row changes nothing about the tension or the constraint — still an ordinary Atwood machine, just bent around corners.\n- Before grinding through algebra on a "complicated-looking" diagram, check whether every pulley is fixed. If so, it likely reduces to something already solved.\n- A block on a wedge that can itself slide is the genuinely hard picture here — set up now, solved later via the pseudo-force trick.',
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Seven questions on movable pulleys and pulley redirection. State the constraint relation ($ a_1=a_2 $ or $ a_1=-2a_2 $, as appropriate) before writing any force equation.',
      sections: [
        {
          id: 'p6-ysi',
          title: 'Constraint Equations — Movable Pulleys',
          items: [
            mcq('p6-y1', 'A movable pulley\'s load rises by 0.4 m. How much string is pulled through on the single-string side?',
              ['0.2 m', '0.4 m', '0.8 m', '1.6 m'],
              2, 'Each of the two supporting segments must shorten by 0.4 m, so 0.8 m of string is taken up on the single-string side.'),
            mcq('p6-y2', 'The load on a movable pulley is supported by string tension T. The total upward force on that load from the pulley system is:',
              ['T', '2T', 'T/2', '4T'],
              1, 'Two segments, each carrying T, both pull upward — total 2T.'),
            num('p6-y3', 'A 1 kg mass hangs on the single-string side of a movable-pulley system, and a 6 kg mass hangs from the movable pulley. Take g = 10 m/s². Using $ a_2 = \\frac{(m_2-2m_1)g}{m_2+4m_1} $, find $ a_2 $.',
              '$ 4 $ m/s²',
              'Numerator: $ (m_2-2m_1)g = (6-2)(10) = 40 $. Denominator: $ (m_2+4m_1) = 6+4 = 10 $. $ a_2 = 40/10 = 4 $ m/s² (the 6 kg side descends at this rate).'),
            mcq('p6-y4', 'A string connects two masses over THREE fixed pulleys in sequence. This is mechanically equivalent to:',
              ['A movable-pulley system with mechanical advantage 3', 'An ordinary two-mass Atwood machine', 'Three separate, independent Atwood machines', 'A system with no defined constraint'],
              1, 'Fixed, ideal pulleys only redirect the string — any number of them still leaves the system as one ordinary Atwood machine, mechanically.'),
            mcq('p6-y5', 'For a movable-pulley system, if the single-string-side mass is much LARGER than the movable-pulley-side mass, the movable side will:',
              ['Rise, since the two sides always move in opposite senses and the heavy single-string side falls', 'Descend, following along after the heavier single-string side as it falls', 'Stay perfectly stationary, exactly balanced against the load on the other side', 'Oscillate back and forth forever, without ever settling into a fixed motion'],
              0, 'The two sides always move in OPPOSITE senses (that is the constraint). A much heavier single-string-side mass falls hard, and by the constraint the movable-pulley side is forced to rise as it does — regardless of how light the movable side\'s own load is.'),
            num('p6-y6', 'A movable pulley carries an 8 kg load. What is the MINIMUM tension needed in the string, on the single-string side, to just barely support the load in equilibrium (a = 0)? Take g = 10 m/s².',
              '$ 40 $ N',
              'In equilibrium, $ 2T = m g = 8(10) = 80 $ N, so $ T = 40 $ N — half the load\'s weight, the direct benefit of the two supporting segments.'),
            mcq('p6-y7', 'A block rests on a wedge that is free to slide on a frictionless floor. Compared to the same block on a wedge BOLTED to the floor, solving for the block\'s motion in the ground frame is:',
              ['Exactly as easy as the bolted case, since the wedge\'s own motion does not matter at all here', 'Harder, since the wedge\'s own motion and the block\'s motion are linked and both unknown', 'Impossible to solve by any method whatsoever, under any circumstances at all', 'Only solvable in the special case where the wedge happens to be heavier than the block'],
              1, 'A bolted wedge is a plain, one-body incline problem (as on the FBD page). A free-to-slide wedge adds a second unknown motion (the wedge\'s own acceleration), linked to the block\'s — genuinely harder in the ground frame, which is exactly why the pseudo-force shortcut earns its place later in the chapter.'),
          ],
        },
      ],
    }),
    b('text', 10, {
      markdown: 'Free body diagrams, connected bodies, and now two flavours of pulley constraint — that is the full toolkit for drawing the RIGHT picture. Every picture on these four pages, though, quietly assumed one thing: that no surface fought back sideways. The next three pages take that assumption away, and put **friction** into every single one of these pictures.',
    }),
  ],
};

// ── run ──────────────────────────────────────────────────────────────────────
withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p3, p4, p5, p6]);
  console.log('\n✅ Ch.4 Wave 1b done: p3–p6 (FBD, connected bodies, fixed-pulley + movable-pulley constraints)');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
