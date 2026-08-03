'use strict';
/**
 * Class 11 Physics · Chapter 4 "Laws of Motion" — pages 0–2.
 * Wave 1a: the chapter opener, Newton's First & Third Law, and Newton's
 * Second Law + impulse + equilibrium of a particle.
 *
 * Run: node scripts/physics11-book/build_ch4_foundations.js
 */
const { b, q, st, mcq, num, hero, ensureChapter, upsertPages, withDb } = require('./_book_ch4');

// ── p0 · Chapter opener ──────────────────────────────────────────────────────
const p0 = {
  page_number: 0,
  slug: 'laws-of-motion-opener',
  title: 'Laws of Motion',
  subtitle: 'Why things move at all — and why they stop',
  page_type: 'chapter_opener',
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A single glowing arrow pushing against a dark mass, with a faint equal-and-opposite arrow pushing back from the mass.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: 'Wide cinematic illustration on a very dark near-black background. A single bright amber '
        + 'arrow pushing rightward into a dark rounded mass from the left, and a fainter, equal-length arrow pointing '
        + 'left, pushing back out of the mass toward the source. Minimal, clean, technical-diagram feel, no text or '
        + 'numbers. Dark background with orange and amber accents only.',
    }),
    b('text', 1, {
      markdown: 'The last two chapters described motion completely — where something is, how fast, which way, whether it is turning. Not once did they ask *why*.\n\nThis chapter asks why. And the answer turns out to explain far more than falling balls: why a seatbelt matters, why pulling a cart is easier than pushing one, why a coin on a spinning turntable slides off, why a lift makes you feel heavier for one second and lighter the next.',
    }),
    b('callout', 2, {
      variant: 'remember',
      title: 'The one sentence this chapter is built on',
      markdown: 'A body\'s motion does not change **unless a net force acts on it** — and when one does, the change is exactly $ \\mathbf{F} = m\\mathbf{a} $.\n\nEverything else in this chapter is that sentence applied to harder and harder pictures: two bodies instead of one, a string that changes direction, a surface that fights back, a frame of reference that is itself accelerating.',
    }),
    b('text', 3, {
      markdown: '**What is in this chapter**\n\n- Newton\'s First and Third Law — inertia, and what a force pair really is\n- Newton\'s Second Law, impulse, and the equilibrium of a particle\n- **Free body diagrams** — isolating one body, one connected system, one pulley at a time\n- **Constrained motion** — the fixed pulley, then movable pulleys and wedges\n- **Friction** — static and kinetic, then every scenario that actually shows up in an exam: pulling, pushing, stacked blocks, walls, wedges, minimum speed\n- **Pseudo force** — the trick that makes an accelerating frame simple, with lifts, wedges and pendulums\n- **Circular motion, properly this time** — the vertical circle, the conical pendulum, and banked roads',
    }),
    b('callout', 4, {
      variant: 'note',
      title: 'A note on scale',
      markdown: 'This is the longest, most scenario-heavy chapter so far — deliberately. Formula substitution stops working here; almost every question is really the same question, *"what does the free body diagram actually look like?"*, asked about a different picture.\n\nSo friction and constrained motion each get several dedicated pages, each built around two or three genuinely different pictures with a full worked example apiece, rather than one page trying to hold all of them at once.',
    }),
  ],
};

// ── p1 · Newton's First & Third Law — Inertia and Force Pairs ────────────────
const p1 = {
  page_number: 1,
  slug: 'newtons-first-and-third-law',
  title: "Newton's First & Third Law — Inertia and Force Pairs",
  subtitle: 'Why nothing needs a reason to keep doing what it is already doing',
  glossary: [
    { term: 'inertia', definition: 'The tendency of a body to resist a change in its state of rest or motion. Mass is the measure of inertia.' },
    { term: 'action–reaction pair', definition: 'The two forces of Newton\'s Third Law: equal in magnitude, opposite in direction, acting on two DIFFERENT bodies, and existing simultaneously.' },
  ],
  blocks: [
    hero('newtons-first-and-third-law'),
    b('curiosity_prompt', 0, {
      prompt: 'Roll a ball across a wooden floor and it stops after a few metres. Roll it across smooth ice and it goes much further. Aristotle looked at the floor and concluded that a force is needed to KEEP something moving. What did he miss?',
      hint: 'Look at what changed between the floor and the ice — not what stayed the same.',
      reveal: 'He missed **friction**. The floor was quietly applying a backward force the whole time; the ice applies much less of one. Aristotle was watching a *decelerating* force at work and mistaking its absence for the natural state of things.\n\nGalileo pushed the thought experiment further: imagine a floor with *no* friction at all. The ball would never stop — not because something keeps pushing it, but because **nothing needs to**. That imagined limit is the law of inertia, and Newton\'s First Law is that same idea, stated as a law.',
    }),
    b('text', 1, {
      markdown: '**Newton\'s First Law:** *A body continues in its state of rest, or of uniform motion in a straight line, unless compelled by a net external force to change that state.*\n\nRestated the way it actually gets used: **if the net force on a body is zero, its acceleration is zero.** Nothing here says the body must be at rest — a body already cruising at constant velocity, in a straight line, needs zero net force to keep doing exactly that.\n\nThe tendency to resist a change in motion is called **inertia**, and its measure is **mass**. A loaded truck is harder to start moving *and* harder to stop than an empty one — same law, both directions.',
    }),
    b('step_solver', 2, {
      title: 'An astronaut, alone, with no force on her at all',
      problem: 'A spaceship is travelling through interstellar space — far from every star and planet — at a constant $ 15 $ m/s, accelerating at $ 100 $ m/s² under its own engines. An astronaut doing a spacewalk accidentally loses her grip and drifts free of the ship at the instant its speed is $ 15 $ m/s. What is her acceleration the instant after she separates, and what happens to her afterwards?',
      intro: 'The trap is assuming she keeps accelerating with the ship, since she was "attached" to it a moment ago. Read the First Law literally: it only cares about the force acting on HER, right now.',
      steps: [
        st('The instant she is no longer touching the ship, is any force from the ship acting on her?',
          'She is in deep space — no planet\'s gravity, no air resistance, nothing to push or pull her except the ship, and she is no longer in contact with it.', {
            check: {
              kind: 'mcq',
              prompt: 'Once separated, what net force acts on the astronaut?',
              options: [
                'Zero — nothing in deep space is touching or pulling on her',
                'The same $ 100 $ m/s² the ship was producing, since she just left it',
                'Half the ship\'s force, since she is smaller',
                'A force equal to her own weight',
              ],
              answer_index: 0,
              feedback_right: 'Right — the ship\'s engines push the SHIP. The instant she is no longer part of that system, that force has nothing to do with her.',
              feedback_wrong: 'The $ 100 $ m/s² was a force the ship\'s engines applied to the ship\'s own structure. Once the astronaut is no longer attached to it, none of that force reaches her at all.',
            },
          }),
        st('$ F_{\\text{net, astronaut}} = 0 \\quad \\Rightarrow \\quad a_{\\text{astronaut}} = 0 $',
          'Zero net force means, by the First Law, exactly zero acceleration — not "very small," zero.', {
            check: {
              kind: 'fill_blank',
              prompt: 'With zero acceleration, what speed does she drift at forever afterwards, in m/s (the speed she had at the instant of separation)?',
              blank_answer: '15',
              feedback_right: 'Yes — 15 m/s, the speed she happened to have at that instant, unchanged forever after.',
              feedback_wrong: 'With no force on her, her velocity cannot change at all, so she keeps the exact velocity she had the instant she let go: 15 m/s, in a straight line.',
            },
          }),
        st('She drifts onward at a constant $ 15 $ m/s in a straight line — while the ship, still accelerating, pulls away from her.',
          'The ship keeps speeding up. She does not. The gap between them grows every second, faster and faster.', {
            why: 'This is the First Law with every distraction stripped away. On Earth a "released" object still has gravity and air acting on it, which is why the law can feel abstract. Deep space is the one place you can actually watch a body coast with truly nothing acting on it.',
          }),
      ],
      now_you_try: {
        problem: 'A cargo pod is being towed behind a spacecraft accelerating at $ 4 $ m/s² through empty space, currently moving at $ 6000 $ m/s. The tow cable snaps. What is the pod\'s acceleration immediately after, and its speed one minute later?',
        answer: '$ 0 $ m/s², and still $ 6000 $ m/s',
        solution: 'The tow force was transmitted through the cable; once it snaps, no force acts on the pod at all (empty space, no cable). By the First Law its acceleration is instantly zero, so its velocity is frozen at whatever it was the instant the cable broke — 6000 m/s, unchanged one minute, one year, or one century later.',
      },
    }),
    b('step_solver', 3, {
      title: 'Why an unstrapped suitcase slides to the front of a braking bus',
      problem: 'A suitcase rests on the floor of a bus, unstrapped, on a patch of floor smooth enough to treat as frictionless. The bus is moving at $ 15 $ m/s when the driver brakes hard, bringing the bus to a stop in $ 3 $ s at a constant deceleration. Find how far the bus travels while stopping, how far the suitcase travels (in the ground frame) in that same time, and how far the suitcase ends up from where it started, RELATIVE TO THE BUS.',
      intro: 'This is the First Law explaining something everyone has felt but rarely puts numbers to — and it is exactly why the chapter opener mentioned seatbelts.',
      steps: [
        st('The bus decelerates: $ a_{\\text{bus}} = \\dfrac{v-u}{t} = \\dfrac{0-15}{3} = -5\\ \\text{m/s}^2 $. Distance covered by the BUS: $ s_{\\text{bus}} = ut + \\tfrac{1}{2}at^2 = 15(3) - \\tfrac{1}{2}(5)(3)^2 = 45 - 22.5 = 22.5\\ \\text{m} $.',
          'The brakes exert a real, physical decelerating force on the BUS (through its wheels). Nothing has been said yet about the suitcase — that is the next step, and the point of the whole question.', {
            check: {
              kind: 'mcq',
              prompt: 'What horizontal force acts on the SUITCASE itself, given the frictionless patch of floor it sits on?',
              options: [
                'The same braking force as the bus, since it is inside the bus',
                'Zero — nothing is touching the suitcase horizontally',
                'Half the braking force',
                'A force equal to the suitcase\'s own weight',
              ],
              answer_index: 1,
              feedback_right: 'Right — with no friction, nothing at all pushes the suitcase horizontally. The braking force acts on the BUS\'s wheels, not on the suitcase.',
              feedback_wrong: 'The braking force is applied to the bus through its wheels and the road. With a frictionless floor patch, nothing transmits any of that force to the suitcase — horizontally, the suitcase feels nothing.',
            },
          }),
        st('Zero horizontal force on the suitcase means, by the First Law, zero horizontal acceleration: it keeps moving at a constant $ 15 $ m/s for the entire $ 3 $ s.',
          'The suitcase simply does not know the bus is braking — nothing has told it to.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Distance covered by the SUITCASE (ground frame) in 3 s at a constant 15 m/s, in metres:',
              blank_answer: '45',
              feedback_right: 'Yes — $ 15 \\times 3 = 45 $ m.',
              feedback_wrong: 'At constant velocity, distance $ = vt = 15 \\times 3 = 45 $ m.',
            },
          }),
        st('Relative to the BUS: $ 45 - 22.5 = 22.5\\ \\text{m forward} $ — the suitcase ends up 22.5 m closer to the front of the bus than where it started.',
          'In a real bus this is stopped early by the seat in front, the dashboard, or another passenger — but the size of the effect (over 22 metres, uninterrupted) is exactly why an unstrapped object, or an unbelted person, becomes dangerous during hard braking.', {
            why: 'This is the First Law, not a mysterious "forward force" throwing the suitcase forward. NOTHING pushed the suitcase forward at all — it simply kept its original motion, while the bus (and everything actually gripped to it) stopped moving out from underneath it.',
          }),
      ],
      now_you_try: {
        problem: 'A ball rests on the frictionless floor of a train moving at 20 m/s. The train brakes to a stop in 4 s at constant deceleration. Find how far the ball ends up from its starting point, relative to the train.',
        answer: '$ 40 $ m, toward the front of the train',
        solution: 'Train: $ a=(0-20)/4=-5 $ m/s², distance $ = 20(4)-\\tfrac{1}{2}(5)(16) = 80-40=40 $ m. Ball (no horizontal force, constant velocity): distance $ = 20(4) = 80 $ m. Relative to the train: $ 80-40=40 $ m forward.',
      },
    }),
    b('callout', 4, {
      variant: 'note',
      title: 'Momentum, in one line, before the Second Law needs it',
      markdown: 'A body\'s **momentum** is $ \\mathbf{p} = m\\mathbf{v} $ — mass times velocity. The First Law restated: **momentum stays constant unless a net external force acts.** The next page makes that precise — exactly *how much* it changes, for a given force.',
    }),
    b('text', 4, {
      markdown: '**Newton\'s Third Law:** *to every action, an equal and opposite reaction* — whenever A exerts a force on B, B simultaneously exerts an equal, opposite force on A.\n\nTwo things easy to get backwards: the forces act on **two different bodies**, so they never cancel (cancelling needs the *same* body); and neither causes the other — they exist **at the same instant**. Either can be labelled "action"; the choice is arbitrary.',
    }),
    b('step_solver', 5, {
      title: 'Which of these is actually an action–reaction pair?',
      problem: 'A book of mass $ 2 $ kg sits at rest on a table. Two forces act on the book: its weight $ mg $ pulling it down, and the table\'s normal force $ N $ pushing it up. The book is in equilibrium, so $ N = mg $. Are the weight and the normal force an action–reaction pair?',
      intro: 'This is the single most common mix-up with the Third Law, precisely because the two forces happen to be equal and opposite here — which makes them *look* like exactly what the law describes.',
      steps: [
        st('Weight and Normal force both act on the SAME body — the book.',
          'The Third Law is about a force pair acting on two DIFFERENT bodies. Two forces on one body, however equal and opposite, cannot be that pair.', {
            check: {
              kind: 'mcq',
              prompt: 'So are the book\'s weight and the table\'s normal force on it an action–reaction pair?',
              options: [
                'No — both act on the book, so they cannot be a Third Law pair',
                'Yes — they are equal and opposite, which is all the Third Law requires',
                'Yes, but only while the book is at rest',
                'It depends on the mass of the book',
              ],
              answer_index: 0,
              feedback_right: 'Right — equal-and-opposite is necessary but not sufficient. The Third Law also requires two different bodies, and both of these forces land on the book alone.',
              feedback_wrong: 'They ARE equal and opposite here, purely because the book is in equilibrium — but the Third Law needs the two forces to act on two DIFFERENT bodies, and both weight and normal force act on the book itself. That fails the test.',
            },
          }),
        st('The real pairs: (i) Earth pulls book down (weight) $ \\leftrightarrow $ book pulls Earth up, equally. (ii) Book pushes down on table $ \\leftrightarrow $ table pushes up on book (this second half IS the normal force $ N $).',
          'Every genuine action–reaction pair here involves the book paired with a DIFFERENT object — the Earth, or the table — never the book paired with itself.', {
            why: 'So $ N $ (table on book) is one half of a real Third Law pair — but its partner is "book on table," not "weight on book." The weight\'s actual Third Law partner is the book\'s pull on the Earth, which is far too small an effect on the Earth\'s huge mass to notice, but is exactly as real.',
          }),
        st('If the book were instead pushed sideways and accelerating (so $ N \\ne mg $), the same pairing rule would still hold — only the numbers change.',
          'The identity of a Third Law pair never depends on whether the body is in equilibrium. It depends only on which two bodies are pushing on each other.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The Third Law partner of "the table pushes up on the book with force N" is: "the ___ pushes down on the ___, with force N."',
              blank_answer: 'book, table',
              feedback_right: 'Exactly — book on table, same magnitude N, opposite direction.',
              feedback_wrong: 'It is "the book pushes down on the table, with force N" — same two bodies as the original force, direction and body reversed.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A $ 60 $ kg woman stands still on a bathroom scale. The scale reads her weight. Name the Third Law partner of "the scale pushes up on the woman."',
        answer: '"The woman pushes down on the scale," with the same magnitude',
        solution: 'The Third Law pair always swaps the two bodies and reverses the direction, keeping the same magnitude: the scale-on-woman force is answered by an equal woman-on-scale force. (Her weight, Earth pulling her down, is a separate force entirely — its own partner is her pulling the Earth up, not the scale reading.)',
      },
    }),
    b('image', 6, {
      src: '',
      alt: 'A book on a table, with the weight and normal force drawn as one pair of arrows on the book, and a second diagram showing the book-on-table and table-on-book forces as the true action-reaction pair, drawn on two separate bodies.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-action-reaction-pairs',
      caption: 'Left: two forces on ONE body — never a Third Law pair, however equal and opposite. Right: the real pair, one force on each of two different bodies.',
    }),
    b('step_solver', 7, {
      title: 'Rocket propulsion — the Third Law with nothing to push against',
      problem: 'A rocket coasting through deep space needs to accelerate. There is no ground, no air, no water — nothing around it to push against. Its engine ejects burning gas backward with a force of $ 5000 $ N. The rocket\'s mass is $ 2000 $ kg. Find the thrust force on the rocket, and its acceleration.',
      intro: 'The question everyone asks at some point: if there is nothing to push against, how does a rocket move at all? The Third Law answers it directly.',
      steps: [
        st('The engine pushes the exhaust gas BACKWARD with $ 5000 $ N. By the Third Law, the gas pushes the ROCKET forward with the same magnitude: $ 5000 $ N.',
          'This is the entire trick: a rocket does not need anything external to push against. It pushes part of ITSELF (the fuel) one way, and by the Third Law gets pushed the other way in return.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does a rocket not need air, water, or ground to push against, unlike a car\'s wheels or a swimmer\'s hands?',
              options: [
                'It does need something to push against — rockets do not actually work in a vacuum',
                'Its Third Law partner is its own ejected exhaust gas, not anything external',
                'Rockets do not obey the Third Law',
                'Gravity alone accelerates the rocket',
              ],
              answer_index: 1,
              feedback_right: 'Right — the ejected exhaust gas IS the "other body" in the Third Law pair. It never needs anything external at all, which is exactly why rockets work in empty space.',
              feedback_wrong: 'Rockets work fine in a vacuum precisely because their Third Law partner is their own ejected fuel — the exhaust gas — not any external medium. A car\'s wheels, by contrast, genuinely need the ground to push against.',
            },
          }),
        st('$ a = \\dfrac{F}{m} = \\dfrac{5000}{2000} = 2.5\\ \\text{m/s}^2 $',
          'A direct application of the Second Law, once the Third Law has supplied the force to use.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate 5000 divided by 2000.',
              blank_answer: '2.5',
              feedback_right: 'Yes — 2.5 m/s².',
              feedback_wrong: '$ 5000/2000 = 2.5 $ m/s².',
            },
          }),
      ],
      now_you_try: {
        problem: 'A rocket of mass 4000 kg in deep space ejects gas backward with a force of 12000 N. Find its acceleration.',
        answer: '$ 3 $ m/s²',
        solution: 'By the Third Law, the reaction thrust on the rocket is also 12000 N. $ a = F/m = 12000/4000 = 3 $ m/s².',
      },
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'logical',
      prompt: 'A horse is harnessed to a cart and pulls it forward. By the Third Law, the cart pulls back on the horse with an equal and opposite force. So why does the cart ever move at all — shouldn\'t the two equal-and-opposite forces cancel and leave everything standing still?',
      reveal: 'They cancel **only if you add up forces on the wrong body.**\n\nThe horse-pulls-cart force and the cart-pulls-horse force are a genuine Third Law pair — but one acts on the cart and the other acts on the horse. They can never cancel each other, because forces only cancel when added on the SAME body.\n\nWhat actually decides whether the cart moves is the set of forces acting on the **cart alone**: the horse\'s pull forward, and the ground\'s friction on the cart\'s wheels backward. If the pull beats the friction, the cart accelerates.\n\nAnd what lets the horse move forward at all is a *different* pair entirely: the horse\'s hooves push backward on the ground, and by the Third Law the ground pushes forward on the horse\'s hooves. That ground-on-horse push is what actually drives the horse (and everything harnessed behind it) forward — which is also the answer to "why can\'t a horse pull a cart while standing on frictionless ice."',
      difficulty_level: 3,
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A rocket in deep space, far from any planet, has its engines shut off completely. What happens to it?',
          ['It gradually slows down and eventually stops, the way a car does with its engine off', 'It continues at whatever constant velocity it had, forever', 'It stops the instant the engines are switched off, since nothing pushes it anymore', 'It depends on how fast it was moving when the engines were shut off'],
          1, 'With engines off and nothing else to exert a force, the net force is zero, so by the First Law the acceleration is zero — the rocket coasts at constant velocity indefinitely.', 1),
        q('Two forces are equal in magnitude and opposite in direction, and both act on the same book lying on a table. Can they be a Newton\'s Third Law pair?',
          ['Yes, equal and opposite is the only requirement', 'No — a Third Law pair must act on two different bodies', 'Only if the book is accelerating', 'Only if one of the forces is gravity'],
          1, 'Equal-and-opposite is necessary but not sufficient for a Third Law pair; the two forces must also act on two different bodies. Two such forces on the same body are simply that body\'s force balance, not a Third Law pair.', 2),
        q('A bird sits on a swaying, flexible branch. Which pair of forces is the Third Law partner of "the branch pushes up on the bird"?',
          ['The bird\'s weight, pulling it down', '"The bird pushes down on the branch," equal in magnitude', 'The wind pushing on the bird', 'There is no partner unless the bird is flying'],
          1, 'Swap the two bodies and reverse the direction: branch-pushes-up-on-bird pairs with bird-pushes-down-on-branch. The bird\'s weight is a separate force (Earth pulling the bird down), whose own partner is the bird pulling the Earth up.', 2),
        q('A block of mass 3 kg rests on a frictionless table with no horizontal force applied. Its state of motion is:',
          ['Slowing down, since inertia opposes motion', 'Unchanging — whatever it was doing before, it keeps doing', 'Accelerating due to its own weight', 'Impossible to determine without knowing its speed'],
          1, 'With the net horizontal force zero (gravity and the normal force are vertical and cancel each other on this body), the First Law says the horizontal state of motion cannot change — if it was still, it stays still; if it was sliding, it keeps sliding at that same velocity (frictionless table).', 2),
        q('Which of these is the best restatement of the law of inertia?',
          ['A force is required to keep any object moving, however smooth the surface it moves on', 'An object requires a net force only to CHANGE its existing state of motion, not to maintain it', 'Heavier objects have less inertia than lighter ones, since they are harder to notice moving', 'Inertia only applies to objects that are completely at rest, not to moving ones'],
          1, 'This is exactly the Aristotle-vs-Galileo distinction from the opening of the page: maintaining motion needs nothing; changing it is what needs a force. Heavier objects have MORE inertia, not less — that is precisely why mass is inertia\'s measure.', 1),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **First Law:** zero net force $ \\Rightarrow $ zero acceleration. Uniform motion needs no force to continue; only a CHANGE in motion does.\n- **Inertia** is the resistance to a change in motion; **mass** is its measure.\n- **Third Law:** every force has an equal, opposite partner — on a DIFFERENT body, at the same instant. Two forces on the same body, however equal and opposite, are never a Third Law pair.\n- $ \\mathbf{p} = m\\mathbf{v} $ — momentum. A restated First Law: momentum is constant unless a net external force acts.\n- The horse-and-cart puzzle: Third Law pairs act on *different* bodies and so can never cancel each other; whether something accelerates is decided only by the forces acting on **that one body**.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. For each, first say which body you are analysing — the whole scene is rarely what a First or Third Law question is actually asking about.',
      sections: [
        {
          id: 'p1-ysi',
          title: "Newton's First & Third Law",
          items: [
            mcq('p1-y1', 'A car moving at a constant 60 km/h on a straight, level road has:',
              ['A net force acting forward, equal to its weight', 'Zero net force acting on it', 'A net force acting backward, to balance the engine', 'A net force that increases with speed'],
              1, 'Constant velocity in a straight line means zero acceleration, which by the First Law means zero net force — the engine\'s forward push and the resisting forces (friction, air drag) exactly cancel.'),
            num('p1-y2', 'A spacecraft coasting through empty space (engines off) is moving at 8000 m/s. No force acts on it for the next 3 hours. What is its speed at the end of those 3 hours?',
              '$ 8000 $ m/s',
              'Zero net force means zero acceleration by the First Law, so the velocity cannot change at all — it stays exactly 8000 m/s, however long the engines remain off.'),
            mcq('p1-y3', 'A 5 kg block hangs at rest from a single vertical string. The Third Law partner of "the string pulls up on the block" is:',
              ['The block\'s own weight, pulling it straight down toward the Earth', 'The Earth pulling down on the string that the block hangs from', '"The block pulls down on the string," with the same magnitude', 'There is no partner as long as the block remains at rest'],
              2, 'Swap the two bodies, reverse the direction: string-pulls-up-on-block pairs with block-pulls-down-on-string. The block\'s weight is a separate, unrelated force (Earth on block).'),
            mcq('p1-y4', 'Which statement about action–reaction pairs is correct?',
              ['They can cancel each other out whenever the body happens to be in equilibrium', 'They always act on two different bodies and can never cancel each other', 'The "action" always happens a short instant before the "reaction" follows it', 'They only exist for as long as both bodies remain in direct contact'],
              1, 'A Third Law pair is defined by acting on two different bodies at the same instant — which is exactly why they can never cancel (forces only cancel when summed on one body), and why there is no before/after between them.'),
            num('p1-y5', 'A ball of mass 0.5 kg moving at 4 m/s has momentum of what magnitude?',
              '$ 2 $ kg·m/s',
              '$ p = mv = 0.5 \\times 4 = 2 $ kg·m/s, in the same direction as the velocity.'),
            mcq('p1-y6', 'A person tries to walk on a perfectly frictionless icy patch and cannot move forward at all. This is best explained because:',
              ['Their own body\'s inertia is simply too large for any one person to overcome without extra help from someone else', 'Walking needs a backward push on the ground so the ground can push them forward — friction supplies that push, and there is none here', 'The First Law directly forbids any forward motion from ever occurring on a surface like ice', 'Their body weight is left completely unsupported the entire moment they first step onto the icy patch'],
              1, 'Walking works via a Third Law pair: foot pushes back on the ground, ground pushes forward on the foot. With zero friction, the foot cannot push the ground backward at all, so there is no forward reaction to receive — nothing to do with inertia or weight.'),
            mcq('p1-y7', 'A truck and a car, both moving, collide head-on. By the Third Law, the force the truck exerts on the car during the collision is:',
              ['Much larger than the force the car exerts on the truck, because the truck is heavier', 'Exactly equal in magnitude to the force the car exerts on the truck', 'Smaller, because the car was moving slower', 'Impossible to compare without knowing both speeds'],
              1, 'The Third Law makes no reference to mass or speed — the mutual forces during the collision are exactly equal in magnitude and opposite in direction on the two vehicles. What differs is the resulting ACCELERATION (F = ma), which is much larger for the lighter car — that difference is about consequence, not about the force pair itself.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'The First and Third Laws say when nothing changes, and what a force pair actually looks like. The next page supplies the missing piece — exactly how much a body\'s motion changes, for a given force — which is the Second Law, and the one you will use in almost every calculation from here on.',
    }),
  ],
};

// ── p2 · Newton's Second Law — F = ma, Impulse, and Equilibrium ─────────────
const p2 = {
  page_number: 2,
  slug: 'newtons-second-law-and-equilibrium',
  title: "Newton's Second Law — F = ma, Impulse, and Equilibrium",
  subtitle: 'How much a force changes motion — and how to add up several at once',
  glossary: [
    { term: 'impulse', definition: 'The product of force and the time for which it acts, J = FΔt. Equal to the change in momentum it produces.' },
    { term: 'equilibrium of a particle', definition: 'A particle is in equilibrium when the net (vector) sum of every force on it is zero, so its acceleration is zero.' },
  ],
  blocks: [
    hero('newtons-second-law-and-equilibrium'),
    b('curiosity_prompt', 0, {
      prompt: 'A cricket ball and a tennis ball, thrown at exactly the same speed, are both caught bare-handed. The cricket ball stings far more. Both arrive with the same speed and are brought to rest — so where does the extra sting come from?',
      hint: 'Think about what F = ma actually depends on, given a fixed change in speed.',
      reveal: 'Two things, both hidden in $ F = ma $. First, the cricket ball has more **mass**, so stopping it changes more momentum for the same speed. Second — and this is the sharper reason — a cricket ball is harder and bounces less into your hand, so it is stopped in **less time** than a tennis ball, which sinks into your palm a little as it stops.\n\nA bigger $ \\Delta p $ over a smaller $ \\Delta t $ means a much bigger average force, by exactly the relation this page derives. It is also why a wicketkeeper\'s gloves — and "giving with the catch" — genuinely reduce the sting: by extending the stopping time, they cut the force for the *same* change in momentum.',
    }),
    b('text', 1, {
      markdown: '**Newton\'s Second Law:** the rate of change of momentum is proportional to the net force applied, in the direction of that force.\n\n$ \\mathbf{F} = \\dfrac{d\\mathbf{p}}{dt} = \\dfrac{d(m\\mathbf{v})}{dt} $\n\nFor **constant mass**, this collapses to the familiar form:\n\n$ \\mathbf{F} = m\\dfrac{d\\mathbf{v}}{dt} = m\\mathbf{a} $\n\nThe **newton (N)** is defined directly from this: $ 1 $ N gives a $ 1 $ kg mass an acceleration of $ 1 $ m/s².',
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'The First Law is a special case of the Second',
      markdown: 'Set $ \\mathbf{F} = 0 $ in $ \\mathbf{F} = m\\mathbf{a} $ and you get $ \\mathbf{a} = 0 $ — exactly the First Law. Newton kept them separate because the First Law also *defines* what an inertial frame even is, before the Second Law\'s equation may be applied in it. (Frames where this breaks down: the Pseudo Force pages, later in this chapter.)',
    }),
    b('step_solver', 3, {
      title: 'A bullet stopped inside a block',
      problem: 'A bullet of mass $ 0.04 $ kg, moving at $ 90 $ m/s, enters a heavy wooden block and comes to rest after penetrating $ 0.60 $ m into it. Find the average resistive force the block exerts on the bullet.',
      intro: 'No time is given — but the distance and the speeds are enough, via $ v^2 = u^2 + 2as $, to get the deceleration first.',
      steps: [
        st('$ v^2 = u^2 + 2as \\quad\\Rightarrow\\quad 0 = (90)^2 + 2a(0.60) $',
          'The bullet starts at 90 m/s and ends at rest over a distance of 0.60 m — a Chapter 2 SUVAT relation, with $ a $ as the only unknown.', {
            check: {
              kind: 'mcq',
              prompt: 'Since the bullet is slowing down, the acceleration $ a $ that solves this equation will come out:',
              options: ['Positive', 'Negative — a deceleration', 'Exactly zero', 'Impossible to tell without more data'],
              answer_index: 1,
              feedback_right: 'Right — the bullet loses speed, so $ a $ is negative: the resistive force acts opposite to the bullet\'s motion.',
              feedback_wrong: 'The bullet goes from 90 m/s to 0, so its velocity is decreasing — the acceleration must be negative, i.e. a deceleration, opposing the direction of motion.',
            },
          }),
        st('$ a = -\\dfrac{(90)^2}{2(0.60)} = -\\dfrac{8100}{1.2} = -6750\\ \\text{m/s}^2 $',
          'A magnitude of 6750 m/s² — nearly 700 times $ g $. This is exactly why a bullet does damage even though it carries "only" 0.04 kg.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ 8100/1.2 $.',
              blank_answer: '6750',
              feedback_right: 'Yes — 6750.',
              feedback_wrong: '$ 8100 \\div 1.2 = 6750 $.',
            },
          }),
        st('$ F = ma = 0.04 \\times 6750 = 270\\ \\text{N} $',
          'The Second Law, applied directly once the acceleration is known. This is the average resistive force the wood exerts on the bullet, backward along its path.', {
            check: {
              kind: 'mcq',
              prompt: 'By the Third Law, the force the bullet exerts on the block during this same interval is:',
              options: [
                'Also 270 N, but on the block, in the direction of the bullet\'s original motion',
                'Zero, since the block does not move',
                'Much larger than 270 N, since the bullet has more energy',
                'Impossible to know without the block\'s mass',
              ],
              answer_index: 0,
              feedback_right: 'Right — a Third Law pair, same 270 N, acting on the block instead of the bullet, in the opposite direction to the force ON the bullet.',
              feedback_wrong: 'Third Law pairs are always equal in magnitude — 270 N — acting on the OTHER body (the block here), in the direction opposite to the force on the bullet. The block\'s own mass decides its resulting acceleration, but not the size of the force pair.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A hockey puck of mass 0.16 kg, moving at 25 m/s, is stopped by a goalkeeper\'s pad after penetrating 0.05 m into it. Find the average force the pad exerts on the puck.',
        answer: '$ 1000 $ N',
        solution: '$ 0 = 25^2 - 2a(0.05) \\Rightarrow a = 625/0.1 = 6250 $ m/s². $ F = ma = 0.16 \\times 6250 = 1000 $ N.',
      },
    }),
    b('step_solver', 4, {
      title: 'Two forces at once, at right angles to each other',
      problem: 'A body of mass $ 5 $ kg is acted on by two perpendicular forces, $ 8 $ N and $ 6 $ N. Find the magnitude and direction of its acceleration.',
      intro: 'F = ma is a VECTOR equation — with two forces acting together, it is their combined (resultant) force that goes into it, not either one alone.',
      steps: [
        st('The two forces are perpendicular, so their resultant\'s magnitude is $ F = \\sqrt{8^2+6^2} = \\sqrt{64+36} = \\sqrt{100} = 10\\ \\text{N} $.',
          'This is exactly the 3-4-5-style right triangle from the last chapter\'s resolutions, run in reverse: combining two components into one resultant instead of splitting one into two.', {
            check: {
              kind: 'mcq',
              prompt: 'Why can the two forces not simply be added as 8 + 6 = 14 N?',
              options: [
                'Because force is not a vector quantity',
                'Because they act in different directions (perpendicular), so they must be combined as vectors, not added as plain numbers',
                'Because one of them is much larger than the other',
                'Because the mass has not been accounted for yet',
              ],
              answer_index: 1,
              feedback_right: 'Right — force is a vector. Two perpendicular forces combine via the Pythagorean relation, not simple addition, because they do not point the same way.',
              feedback_wrong: 'Force IS a vector, and these two act in different (perpendicular) directions. Combining them needs the Pythagorean relation for perpendicular vectors, not ordinary arithmetic addition.',
            },
          }),
        st('$ a = \\dfrac{F}{m} = \\dfrac{10}{5} = 2\\ \\text{m/s}^2 $',
          'Newton\'s Second Law applied to the RESULTANT force — this is always the right move whenever more than one force acts.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The direction of the acceleration is along the resultant force, at angle $ \\theta = \\tan^{-1}(6/8) $ from the 8 N force. Evaluate 6/8 as a decimal.',
              blank_answer: '0.75',
              feedback_right: 'Yes — 0.75, giving $ \\theta = \\tan^{-1}(0.75) \\approx 37° $ from the 8 N force.',
              feedback_wrong: '$ 6/8 = 0.75 $, so $ \\theta = \\tan^{-1}(0.75) \\approx 37° $ from the direction of the 8 N force.',
            },
          }),
        st('$ a = 2\\ \\text{m/s}^2 $, directed at $ \\approx 37° $ from the 8 N force, toward the 6 N side.',
          'Notice the acceleration points along the RESULTANT, not along either individual force — a common point of confusion when more than one force is in play.', {
            why: 'This 8-6-10 triangle (and its 37°/53° angles) is the same one used throughout this chapter\'s equilibrium and incline problems — recognising it on sight saves real calculation time.',
          }),
      ],
      now_you_try: {
        problem: 'A 2 kg body is acted on by two perpendicular forces, 3 N and 4 N. Find the magnitude of its acceleration.',
        answer: '$ 2.5 $ m/s²',
        solution: 'Resultant: $ \\sqrt{3^2+4^2} = \\sqrt{25} = 5 $ N. $ a = F/m = 5/2 = 2.5 $ m/s².',
      },
    }),
    b('text', 5, {
      markdown: 'A different way of writing $ \\mathbf{F} = d\\mathbf{p}/dt $ is useful whenever a force acts for a **known, short time** rather than over a known distance: multiply both sides by $ dt $ and integrate.\n\n$ \\mathbf{J} = \\mathbf{F}\\,\\Delta t = \\Delta \\mathbf{p} $\n\nThis quantity, $ \\mathbf{J} $, is called **impulse**. It is exactly the change in momentum a force produces — which means, usefully, you never need to know the force *or* the time individually if you can get $ \\Delta\\mathbf{p} $ directly from the before-and-after velocities.',
    }),
    b('step_solver', 5, {
      title: 'A ball deflected straight back — impulse without ever finding the force',
      problem: 'A batsman hits a ball straight back toward the bowler, reversing its direction without changing its speed of $ 12 $ m/s. The ball\'s mass is $ 0.15 $ kg. Find the impulse imparted to the ball by the bat.',
      intro: 'There is no time given, and no force given — which is the signal that this is an impulse-from-momentum-change question, not an $ F = ma $ one.',
      steps: [
        st('Take "toward the bowler" (the ball\'s original direction) as positive. Initial momentum: $ p_i = +0.15 \\times 12 = +1.8\\ \\text{kg·m/s} $.',
          'Fix a sign convention before touching the reversal — this is exactly the "which way is positive" discipline from Chapter 2.', {
            check: {
              kind: 'mcq',
              prompt: 'The ball leaves the bat moving back toward the bowler at the same speed. Its final momentum, in this sign convention, is:',
              options: ['$ +1.8 $ kg·m/s — unchanged', '$ -1.8 $ kg·m/s — same magnitude, reversed sign', '$ 0 $, since it is momentarily at rest at the bat', 'Cannot be found without the bat\'s mass'],
              answer_index: 1,
              feedback_right: 'Right — same speed, opposite direction, so the momentum flips sign but keeps its size.',
              feedback_wrong: 'The ball now moves back toward the bowler — the direction opposite to its original motion, which was chosen as positive — so its final momentum is $ -1.8 $ kg·m/s, same magnitude, flipped sign.',
            },
          }),
        st('$ \\Delta p = p_f - p_i = (-1.8) - (+1.8) = -3.6\\ \\text{kg·m/s} $',
          'The change is nearly double the single momentum, not zero — because the ball did not just slow down, it reversed.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The magnitude of the impulse imparted to the ball, in kg·m/s, is:',
              blank_answer: '3.6',
              feedback_right: 'Yes — 3.6 kg·m/s.',
              feedback_wrong: '$ |\\Delta p| = |-3.6| = 3.6 $ kg·m/s.',
            },
          }),
        st('$ J = \\Delta p = 3.6\\ \\text{kg·m/s, directed back toward the bowler} $',
          'Exactly twice the ball\'s original momentum — the general result whenever a collision perfectly REVERSES a velocity without changing its size: $ J = 2mv $.', {
            why: 'This "double the momentum" result is worth recognising on sight: any time a question describes a ball, wall-collision, or piston bouncing back at the *same* speed it arrived with, the impulse is $ 2mv $, not $ mv $ — a very common place marks are lost by treating it as if the ball simply stopped.',
          }),
      ],
      now_you_try: {
        problem: 'A 0.5 kg ball moving at 8 m/s strikes a wall and rebounds straight back at the same speed. Find the magnitude of the impulse on the ball from the wall.',
        answer: '$ 8 $ kg·m/s',
        solution: 'This is a perfect reversal, so $ J = 2mv = 2(0.5)(8) = 8 $ kg·m/s.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('A net force of 10 N acts on a 2 kg body for 4 seconds, starting from rest. Its final momentum is:',
          ['$ 20 $ kg·m/s', '$ 40 $ kg·m/s', '$ 2.5 $ kg·m/s', '$ 80 $ kg·m/s'],
          1, 'Impulse $ J = F\\Delta t = 10 \\times 4 = 40 $ kg·m/s, which equals the change in momentum. Starting from rest, this IS the final momentum.', 1),
        q('A wicketkeeper "gives with the catch" — moving the gloves backward as the ball arrives — rather than holding them rigid. This reduces the force on the hands because:',
          ['It somehow reduces the total impulse needed to bring the ball to rest', 'The same impulse is delivered over a longer time, so the average force is smaller', 'It reduces the ball\'s own momentum before the catch is even made', 'It has no real physical effect at all — it is only technique for a firmer grip'],
          1, 'The impulse (the change in the ball\'s momentum) is fixed by the ball\'s mass and speed — giving with the catch does not change that. It stretches out the TIME over which that same impulse is delivered, and since $ F = J/\\Delta t $, a longer time means a smaller average force.', 2),
        q('A body has zero net force acting on it at some instant. At that same instant, its momentum:',
          ['Must necessarily be zero at that same instant', 'Is not changing, whatever value it currently has', 'Must necessarily be increasing at that same instant', 'Cannot be determined without further information'],
          1, '$ F = dp/dt $, so zero force means zero RATE of change of momentum — the momentum is simply holding steady at whatever value it already has, which need not be zero.', 2),
        q('Two balls of masses 1 kg and 2 kg are both brought to rest from 6 m/s by their respective goalkeepers, in the same amount of time. Compared to the 1 kg ball, the force needed to stop the 2 kg ball is:',
          ['Half as much', 'The same', 'Twice as much', 'Four times as much'],
          2, 'Same speed change, same time, but twice the mass means twice the momentum change, so by $ F = \\Delta p/\\Delta t $ the force is exactly twice as large.', 1),
        q('An egg dropped onto a hard concrete floor breaks, but the same egg dropped from the same height onto a thick cushion usually survives. Both falls end at the same speed. The best explanation is:',
          ['The cushion somehow reduces the egg\'s own momentum before the impact even happens at all', 'The cushion increases the stopping time, reducing the average force for the same change in momentum', 'The cushion material itself is simply much lighter in weight than the concrete floor is', 'The egg\'s own weight is somehow different when it is resting on top of a soft cushion'],
          1, 'Exactly the impulse-time trade-off: same $ \\Delta p $ (same impact speed brought to rest), but the cushion compresses and extends the stopping time, so $ F = \\Delta p/\\Delta t $ comes out much smaller.', 2),
      ],
    }),
    b('text', 7, {
      markdown: 'One more idea belongs on this page before the chapter moves to harder pictures: what happens when **several forces act on one particle at once**, and none of them alone is zero.',
    }),
    b('callout', 8, {
      variant: 'note',
      title: 'Equilibrium of a particle',
      markdown: 'A particle is in **equilibrium** when the vector sum of every force on it is zero:\n\n$ \\sum \\mathbf{F} = 0 \\qquad\\Longleftrightarrow\\qquad \\sum F_x = 0 \\ \\text{ and } \\ \\sum F_y = 0 $\n\nTwo forces in equilibrium must be equal and opposite (a straight line). Three or more forces in equilibrium is the genuinely useful case — resolve every force into components along two convenient perpendicular axes, and each axis gives its own equation.',
    }),
    b('step_solver', 9, {
      title: 'A lamp hung by two strings',
      problem: 'A lamp weighing $ 100 $ N (take $ g = 10 $ m/s² for this problem) hangs in equilibrium from two strings tied to the ceiling, one making $ 37° $ with the horizontal and the other $ 53° $. Find the tension in each string.',
      intro: 'Three forces on one point — the two tensions and the weight — so this is a genuine equilibrium-of-a-particle problem, not a single free body diagram of a block.',
      steps: [
        st('Resolve both tensions into horizontal and vertical components: $ T_1\\cos37°, T_1\\sin37° $ and $ T_2\\cos53°, T_2\\sin53° $, with $ \\sin37°=\\cos53°=0.6 $ and $ \\cos37°=\\sin53°=0.8 $.',
          'Same resolution move as every projectile on the last chapter — only now both forces are unknowns, tied together by the equilibrium condition.', {
            check: {
              kind: 'mcq',
              prompt: 'For horizontal equilibrium, the two horizontal components must be:',
              options: ['Equal in magnitude, pulling in opposite directions', 'Both zero individually', 'In the ratio of the two angles', 'Unrelated — only vertical equilibrium matters here'],
              answer_index: 0,
              feedback_right: 'Right — the lamp does not accelerate sideways, so the two horizontal pulls (one from each string, in opposite directions) must exactly cancel.',
              feedback_wrong: 'With no horizontal acceleration, $ \\sum F_x = 0 $: the two horizontal components (one from each tension, pulling opposite ways since the strings lean opposite directions) must be equal in magnitude.',
            },
          }),
        st('Horizontal: $ T_1\\cos37° = T_2\\cos53° \\quad\\Rightarrow\\quad 0.8\\,T_1 = 0.6\\,T_2 \\quad\\Rightarrow\\quad T_1 = 0.75\\,T_2 $',
          'One equation, two unknowns — not solvable alone. This is exactly why the vertical equation is needed too.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Vertical equilibrium reads $ T_1\\sin37° + T_2\\sin53° = 100 $, i.e. $ 0.6\\,T_1 + 0.8\\,T_2 = 100 $. Substituting $ T_1 = 0.75\\,T_2 $ gives $ 1.25\\,T_2 = 100 $. Solve for $ T_2 $, in newtons.',
              blank_answer: '80',
              feedback_right: 'Yes — $ T_2 = 100/1.25 = 80 $ N.',
              feedback_wrong: '$ T_2 = 100 \\div 1.25 = 80 $ N.',
            },
          }),
        st('$ T_2 = 80\\ \\text{N} \\quad\\Rightarrow\\quad T_1 = 0.75 \\times 80 = 60\\ \\text{N} $',
          'Check: $ 0.8(60) = 48 $ and $ 0.6(80) = 48 $ — the two horizontal pulls do cancel. And $ 0.6(60) + 0.8(80) = 36 + 64 = 100 $ N — the weight is fully supported.', {
            why: 'Notice which string carries more load: $ T_2 = 80 $ N is the string at the STEEPER angle ($ 53° $, closer to vertical). A more vertical string is more efficient at supporting weight directly, so it ends up doing more of the work — a pattern worth expecting before calculating it.',
          }),
      ],
      now_you_try: {
        problem: 'A sign board weighing 50 N (take g = 10 m/s²) hangs from two strings, one at 30° and one at 60° to the horizontal, on either side. Find both tensions. (Use $ \\sin30°=0.5, \\cos30°=0.866, \\sin60°=0.866, \\cos60°=0.5 $.)',
        answer: '$ T_{30°} = 25 $ N, $ T_{60°} = 43.3 $ N',
        solution: 'Horizontal: $ T_{30}\\cos30° = T_{60}\\cos60° \\Rightarrow 0.866\\,T_{30} = 0.5\\,T_{60} \\Rightarrow T_{60} = 1.732\\,T_{30} $. Vertical: $ T_{30}\\sin30° + T_{60}\\sin60° = 50 \\Rightarrow 0.5\\,T_{30} + 0.866\\,T_{60} = 50 $. Substituting: $ 0.5\\,T_{30} + 0.866(1.732\\,T_{30}) = 0.5\\,T_{30} + 1.5\\,T_{30} = 2\\,T_{30} = 50 \\Rightarrow T_{30} = 25\\ \\text{N} $, so $ T_{60} = 1.732(25) = 43.3 $ N. As before, the steeper string (60°) carries the larger share.',
      },
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('A particle has three forces acting on it and is in equilibrium. If two of the forces are known and a third is unknown, the unknown force must be:',
          ['Zero', 'Equal and opposite to the vector SUM of the other two', 'Equal to the larger of the other two forces', 'Impossible to find without more information'],
          1, 'Equilibrium means all three forces sum to zero, so the third force is exactly the negative of the vector sum of the first two — equal in magnitude, opposite in direction, to their resultant.', 2),
        q('In a two-string equilibrium problem, the string at the steeper angle to the horizontal generally carries:',
          ['Less tension, simply because it happens to be the shorter of the two strings', 'More tension, since it is more efficient at supporting weight directly', 'Exactly the same tension as the other string, always, regardless of angle', 'No tension at all, since it is closer to vertical than the other one'],
          1, 'A steeper string directs more of its own tension straight up, doing more of the job of supporting the weight — this is why the 53° / 60° string in these problems consistently comes out with the larger tension.', 2),
        q('For a particle in equilibrium under exactly two forces, those two forces must be:',
          ['Perpendicular to each other', 'Equal in magnitude and exactly opposite in direction', 'Equal in magnitude only', 'At some fixed angle depending on the masses involved'],
          1, 'With only two forces summing to zero, they must be a simple equal-and-opposite pair along one line — three or more forces are needed before a genuinely two-dimensional equilibrium problem (like the lamp) arises.', 1),
        q('A block is pulled by two horizontal ropes from opposite sides with forces of 30 N and 30 N, and remains stationary. The net force on it is:',
          ['60 N in the direction of the stronger pull', 'Zero', '30 N', 'Cannot be found without the block\'s mass'],
          1, 'Equal forces in exactly opposite directions sum to zero regardless of the block\'s mass — mass would only matter for finding acceleration if the net force were nonzero.', 1),
        q('A particle is acted on by a constant force for a time interval that is doubled, with the force unchanged. Its impulse:',
          ['Stays the same', 'Doubles', 'Halves', 'Becomes zero'],
          1, '$ J = F\\Delta t $ — with $ F $ fixed and $ \\Delta t $ doubled, the impulse (and so the change in momentum) doubles exactly.', 1),
      ],
    }),
    b('callout', 11, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ \\mathbf{F} = m\\mathbf{a} $ — but remember it is really $ \\mathbf{F} = d\\mathbf{p}/dt $, which is what makes impulse and variable-mass problems work.\n- $ \\mathbf{J} = \\mathbf{F}\\Delta t = \\Delta\\mathbf{p} $ — use this whenever a TIME (not a distance) is what connects force to motion.\n- A perfect bounce-back at unchanged speed delivers impulse $ 2mv $, not $ mv $ — a very common trap.\n- **Equilibrium of a particle:** $ \\sum F_x = 0 $ and $ \\sum F_y = 0 $, separately. Two equations for two unknown tensions/forces.\n- A steeper string in a two-string equilibrium problem carries more tension — sanity-check your answer against this before trusting the algebra.',
    }),
    b('practice_bank', 12, {
      title: 'You solve it',
      intro: 'Seven questions mixing F = ma, impulse, and equilibrium. Decide which of the three tools a question needs before reaching for any formula.',
      sections: [
        {
          id: 'p2-ysi',
          title: "Newton's Second Law, Impulse & Equilibrium",
          items: [
            num('p2-y1', 'A net force of 15 N acts on a 3 kg block. Find its acceleration.',
              '$ 5 $ m/s²',
              '$ a = F/m = 15/3 = 5 $ m/s².'),
            num('p2-y2', 'A ball of mass 0.2 kg moving at 10 m/s is brought to rest in 0.02 s by a wall. Find the average force on the ball.',
              '$ 100 $ N',
              '$ F = \\Delta p/\\Delta t = (0.2 \\times 10 - 0)/0.02 = 2/0.02 = 100 $ N.'),
            mcq('p2-y3', 'A 1000 kg car moving at 20 m/s is brought to rest by brakes over 50 m. The average braking force is:',
              ['2000 N', '4000 N', '8000 N', '400 N'],
              1, 'From $ v^2 = u^2+2as $: $ 0 = 400 - 2a(50) \\Rightarrow a = 4 $ m/s². $ F = ma = 1000 \\times 4 = 4000 $ N.'),
            num('p2-y4', 'A ball moving at 5 m/s hits a wall and rebounds straight back at the same speed. Its mass is 0.3 kg. Find the magnitude of the impulse delivered to it by the wall.',
              '$ 3 $ kg·m/s',
              'A perfect reversal: $ J = 2mv = 2(0.3)(5) = 3 $ kg·m/s.'),
            mcq('p2-y5', 'A picture frame hangs from a single nail via a string looped symmetrically over it, the string making 40° with the vertical on each side. Compared to hanging from a string straight down (0°), the tension in each side of this string is:',
              ['The same amount on each side, since the total weight being supported has not changed at all', 'Larger, because each side supports less of the vertical load per unit tension, at a less favourable angle', 'Smaller, because there are now two separate strands sharing the very same load between them', 'Zero on each and every side, since the whole picture frame remains in complete equilibrium'],
              1, 'A string angled away from vertical is less efficient at converting its tension into vertical support — it needs MORE tension to supply the same vertical component, exactly the "steeper is more efficient" idea from the worked example, run in reverse.'),
            num('p2-y6', 'Two forces, 6 N east and 8 N north, act on a particle together with a third force that keeps it in equilibrium. Find the magnitude of the third force.',
              '$ 10 $ N',
              'The resultant of 6 N and 8 N (perpendicular) has magnitude $ \\sqrt{6^2+8^2} = \\sqrt{100} = 10 $ N. The equilibrating third force must be exactly 10 N, directed opposite to that resultant.'),
            mcq('p2-y7', 'A stream of water hits a wall and, instead of bouncing back, simply spreads out sideways along the wall (its momentum perpendicular to the wall becomes zero, but it does not reverse). Compared to a perfectly bouncing stream of the same mass flow and speed, the force on the wall is:',
              ['The same force on the wall, either way, since the mass flow and speed match', 'Larger for the perfectly bouncing stream', 'Larger for the stream that merely spreads out sideways along the wall', 'Zero on the wall in both of these two cases'],
              1, 'A perfect bounce changes the perpendicular momentum from $ +mv $ to $ -mv $ (a change of $ 2mv $); water that merely spreads sideways only loses its perpendicular momentum (a change of just $ mv $) — half the momentum change, so half the force, for the bouncing case being the larger one.'),
          ],
        },
      ],
    }),
    b('text', 13, {
      markdown: 'One body, one set of forces, one equation — that is as far as $ F = ma $ goes on its own. The next four pages are about the harder, far more common picture: several bodies, tied together, where the free body diagram of each one has to be drawn separately before anything can be solved at all.',
    }),
  ],
};

// ── run ──────────────────────────────────────────────────────────────────────
withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p0, p1, p2]);
  console.log('\n✅ Ch.4 Wave 1a done: p0–p2 (opener, First & Third Law, Second Law + equilibrium)');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
