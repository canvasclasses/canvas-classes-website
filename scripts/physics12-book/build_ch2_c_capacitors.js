'use strict';
/**
 * Class 12 Physics · Ch.2 "Capacitance" — pages 8–12.
 * Capacitance, the parallel-plate capacitor, spherical and cylindrical
 * capacitors, series and parallel combinations, and reading a network.
 *
 * Run: node scripts/physics12-book/build_ch2_c_capacitors.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 2;

// ── p8 · Capacitance ─────────────────────────────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'capacitance',
  title: 'Capacitance',
  subtitle: 'How much charge a conductor holds per volt',
  glossary: [
    { term: 'capacitance', definition: 'The charge a conductor or capacitor holds per unit potential difference: $ C = Q/V $. Measured in farads.' },
    { term: 'farad', definition: 'One coulomb per volt. An enormous unit — practical capacitors are measured in microfarads and picofarads.' },
    { term: 'capacitor', definition: 'A pair of conductors carrying equal and opposite charges, built to store charge and energy.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Put charge on an isolated metal sphere and its potential rises. Put twice the charge on and the potential exactly doubles.\n\nSo the ratio $ Q/V $ is a fixed number for that sphere. What could it possibly depend on, if not the charge?',
      hint: 'The formula for the potential of a sphere has only two things in it.',
      reveal: 'Only the **geometry** — for a sphere, just its radius.\n\n$ V = \\frac{kQ}{R} $, so $ \\frac{Q}{V} = \\frac{R}{k} = 4\\pi\\varepsilon_0R $. The charge cancels completely.\n\nThat ratio is called **capacitance**, and the fact that it depends only on shape and size — never on how much charge you put on — is what makes it a useful property of an *object* rather than of a situation.',
    }),
    b('text', 1, {
      markdown: 'For any conductor, the charge you put on and the potential it reaches are strictly proportional: $ Q \\propto V $. The constant of proportionality is the **capacitance**:',
    }),
    b('latex_block', 2, {
      latex: 'C = \\frac{Q}{V}',
      label: 'Definition of capacitance',
      note: 'Unit: the farad (F) = coulomb per volt. Depends only on geometry (and on the medium), never on Q or V.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Think of it as **electrical capacity**, in the everyday sense. A large capacitance means the conductor swallows a lot of charge for a small rise in potential — a wide bucket. A small capacitance fills up fast.\n\nFor an **isolated sphere**, putting $ V = kQ/R $ into the definition gives',
    }),
    b('latex_block', 4, {
      latex: 'C = 4\\pi\\varepsilon_0 R',
      label: 'Capacitance of an isolated sphere',
      note: 'Proportional to the radius alone. Bigger sphere, more capacitance.',
    }),
    b('text', 5, {
      markdown: 'Now put a number to that, because it settles what the farad really is. For the **Earth** ($ R \\approx 6400 $ km):\n\n$ C = 4\\pi\\varepsilon_0R = \\frac{6.4\\times10^{6}}{9\\times10^{9}} \\approx 7\\times10^{-4}\\ \\text{F} $\n\nThe entire planet is only about **700 microfarads** — less than a capacitor you can buy for a few rupees.\n\nSo the farad is a preposterously large unit, and real components are quoted in:\n\n- **microfarad** $ \\mu\\text{F} = 10^{-6} $ F\n- **nanofarad** nF $ = 10^{-9} $ F\n- **picofarad** pF $ = 10^{-12} $ F',
    }),
    b('heading', 6, {
      text: 'Why a second conductor changes everything',
      level: 2,
      objective: 'Explain why bringing an earthed conductor close increases capacitance.',
    }),
    b('text', 7, {
      markdown: 'A single sphere is a poor store. To make a good one, bring a **second** conductor close and earth it.\n\nHere is what happens. The charge $ +Q $ on the first conductor induces $ -Q $ on the near face of the second. That negative charge sits close by, and its potential contribution is **negative** — so the potential of the first conductor **drops**, even though its charge has not changed.\n\nAnd if $ V $ drops while $ Q $ stays the same, then $ C = Q/V $ has gone **up**.\n\nThat is the whole design principle of a **capacitor**: two conductors, close together, carrying equal and opposite charges. Bringing them closer lowers $ V $ further and raises $ C $ further — which is why every practical capacitor is two large surfaces separated by the thinnest gap the insulation can survive.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'logical',
      prompt: 'A capacitor is charged so that its plates carry $ +Q $ and $ -Q $. What is "the charge on the capacitor"?',
      options: [
        '$ Q $ — the magnitude on either plate',
        '$ 2Q $ — the total on both plates',
        'zero — the plates carry equal and opposite charges',
        '$ Q/2 $ — the average of the two plates',
      ],
      reveal: '**$ Q $ — the magnitude on one plate.**\n\nThe *net* charge on the whole device is genuinely zero, and that is not a trick: charge was not created, only moved from one plate to the other. But "the charge on a capacitor" always means the magnitude on either plate, and $ C = Q/V $ uses that $ Q $.\n\nOne consequence worth having ready: **the two plates of any capacitor always carry equal and opposite charges**, whatever the circuit around them. Charge pushed onto one plate repels an equal amount off the other.',
      difficulty_level: 2,
    }),
    b('image', 9, {
      src: '',
      alt: 'An isolated charged sphere beside a two-conductor capacitor, showing the potential drop caused by the second conductor',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The same charge, at a much lower potential — which is exactly what a bigger capacitance means.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a single circle outlined in dim grey with warm amber plus signs around it and long orange field arrows radiating far outward; beneath, a tall thin vertical bar in amber representing a high potential. Right panel: the same amber-plus circle with a second dim-grey conductor curved close alongside it carrying cool-blue minus signs, with short orange field arrows confined to the narrow gap between them; beneath, a much shorter amber bar representing a low potential. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ C = Q/V $, in farads. Depends on **geometry and medium only** — never on $ Q $ or $ V $.\n- Isolated sphere: $ C = 4\\pi\\varepsilon_0R $. The Earth is only $ \\approx 700\\ \\mu\\text{F} $.\n- A nearby earthed conductor lowers $ V $ for the same $ Q $, so it raises $ C $.\n- The two plates always carry $ +Q $ and $ -Q $; "the charge on the capacitor" means $ Q $.',
    }),
    b('text', 11, {
      markdown: 'Next: the standard geometry — two flat plates — and the formula that every circuit in this chapter is built on.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('The capacitance of a conductor depends on',
          ['its geometry and the surrounding medium', 'the charge given to it', 'the potential it is raised to', 'the charge divided by the potential, both of which vary'],
          0,
          '$ C = Q/V $ is a fixed ratio: doubling $ Q $ doubles $ V $ and leaves $ C $ untouched. What sets the value is the shape, the size, and what fills the space around it.',
          2),
        q('The capacitance of an isolated sphere of radius $ R $ is',
          ['$ 4\\pi\\varepsilon_0R $', '$ 4\\pi\\varepsilon_0R^{2} $', '$ \\frac{R}{4\\pi\\varepsilon_0} $', '$ \\frac{4\\pi\\varepsilon_0}{R} $'],
          0,
          'From $ V = kQ/R $, the ratio $ Q/V = R/k = 4\\pi\\varepsilon_0R $. Note it is proportional to $ R $, not $ R^{2} $ — capacitance scales with a length, not with an area.',
          2),
        q('Bringing an earthed conductor close to a charged conductor',
          ['increases its capacitance', 'decreases its capacitance', 'leaves its capacitance unchanged', 'removes all its charge'],
          0,
          'The induced opposite charge sits nearby and pulls the potential down. With $ Q $ fixed and $ V $ reduced, $ C = Q/V $ must rise — which is precisely why capacitors are built from two close conductors rather than one.',
          3),
      ],
    }),
  ],
};

// ── p9 · The Parallel-Plate Capacitor ────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'the-parallel-plate-capacitor',
  title: 'The Parallel-Plate Capacitor',
  subtitle: 'Two plates, one formula, and the whole of circuit electronics',
  glossary: [
    { term: 'fringing', definition: 'The bulging of the field near the edges of a real capacitor, where the plates stop and the ideal uniform-field picture breaks down.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A camera flash delivers around 10 joules in about a thousandth of a second — a power of roughly ten kilowatts, from a battery that could not light a bulb.\n\nThe battery does not supply that power. It spends several seconds trickling charge into a capacitor, and the capacitor dumps it all at once.\n\nThat is what capacitors are for: not storing much energy, but releasing what they have **fast**.',
    }),
    b('text', 1, {
      markdown: 'Two parallel conducting plates, each of area $ A $, separated by a small distance $ d $, carrying $ +Q $ and $ -Q $.\n\nWe already have every piece needed. From Chapter 1, the field between two oppositely charged plates is uniform, of magnitude\n\n$ E = \\frac{\\sigma}{\\varepsilon_0} = \\frac{Q}{A\\varepsilon_0} $\n\nAnd from page 3, in a uniform field $ V = Ed $. So\n\n$ V = \\frac{Qd}{A\\varepsilon_0} \\qquad\\Rightarrow\\qquad C = \\frac{Q}{V} = \\frac{A\\varepsilon_0}{d} $',
    }),
    b('latex_block', 2, {
      latex: 'C = \\frac{\\varepsilon_0 A}{d}',
      label: 'Parallel-plate capacitor (vacuum or air between the plates)',
      note: 'Bigger plates → more capacitance. Smaller gap → more capacitance. Nothing else enters.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Read the formula as a design rule and it explains every real capacitor you will ever open:\n\n**To increase $ C $, increase $ A $.** Hence the rolled-up strips of metal foil inside a cylindrical capacitor — metres of area packed into a component the size of your thumb.\n\n**To increase $ C $, decrease $ d $.** Hence gaps of a few micrometres, and hence the limit: push the plates too close and the field $ E = V/d $ grows until the insulation between them breaks down and the capacitor is destroyed.\n\n**Notice what is absent.** The material of the plates never appears. Copper, aluminium, gold — the capacitance is identical. All that matters is the geometry, and what sits in the gap.',
    }),
    b('worked_example', 4, {
      label: 'the size of a one-farad capacitor',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two parallel plates are separated by an air gap of $ 1 $ mm. What plate area would be needed to make a capacitance of $ 1 $ F?',
      solution: 'Rearranging $ C = \\varepsilon_0A/d $:\n\n$ A = \\frac{Cd}{\\varepsilon_0} = \\frac{(1)(1\\times10^{-3})}{8.854\\times10^{-12}} $\n\n$ A \\approx 1.13\\times10^{8}\\ \\text{m}^{2} $\n\nThat is $ 113 $ square kilometres — a square roughly **10.6 km on each side**.\n\n**Which is the point of the exercise.** The farad is not a unit anyone reaches by building a plausible capacitor; it is why the practical range runs from picofarads to microfarads.\n\n(You can buy a "1 farad" capacitor today, but it is not made this way — a supercapacitor uses a porous electrode with an enormous internal surface area and a molecular-scale separation, which is the same formula pushed to its limits from both ends.)',
    }),
    b('heading', 5, {
      text: 'Where the ideal formula stops being true',
      level: 2,
      objective: 'Say what assumption the derivation made, and when it fails.',
    }),
    b('text', 6, {
      markdown: 'The derivation used $ E = \\sigma/\\varepsilon_0 $ — the result for an **infinite** sheet. Real plates end.\n\nNear the edges the field bulges outward instead of running straight across. This is called **fringing**, and it means the field there is neither uniform nor confined to the gap.\n\nThe standard assumption throughout this chapter is $ d \\ll \\sqrt{A} $ — the gap is tiny compared with the plate size — so the fringing region is a negligible fraction of the whole. Every formula that follows quietly relies on it.\n\nOne more thing the picture tells you: **outside** an ideal parallel-plate capacitor, the fields of the two plates cancel, so $ E = 0 $. All the field, and all the energy, is in the gap.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A parallel-plate capacitor is connected to a battery. Its plate separation is then doubled, with the battery still connected. What happens to the charge on it?',
      options: ['It halves', 'It doubles', 'It stays the same', 'It falls to a quarter'],
      reveal: '**It halves.**\n\nWork through it in the right order — and the order is always the same.\n\n1. **What is held fixed?** The battery is connected, so $ V $ is fixed.\n2. **What does the geometry do to $ C $?** $ C = \\varepsilon_0A/d $, so doubling $ d $ halves $ C $.\n3. **Then use $ Q = CV $.** With $ V $ fixed and $ C $ halved, $ Q $ halves. Charge flows back into the battery.\n\nThe answer would be completely different if the battery had been **disconnected** first: then $ Q $ would be fixed instead, and $ V $ would double.\n\n**Always ask "battery on or off?" before anything else.** That single question decides which quantity is the constant, and everything else follows from it. There is a full table of these cases waiting on the dielectrics page.',
      difficulty_level: 3,
    }),
    b('image', 8, {
      src: '',
      alt: 'A parallel-plate capacitor showing the uniform field in the gap and the fringing field at the edges',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Uniform in the middle, bulging at the edges — and zero outside.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). Two horizontal parallel plates drawn as thin bars, the upper warm amber with plus signs and the lower cool blue with minus signs. Between them, straight evenly spaced vertical orange field arrows pointing from the amber plate down to the blue plate. At both left and right ends, the outermost field lines curve outward and bulge beyond the plate edges, drawn in a dimmer orange. A thin dashed grey dimension line marks the gap labelled d, and a horizontal brace above marks the plate width labelled area A. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ C = \\frac{\\varepsilon_0A}{d} $. Geometry only — the plate material is irrelevant.\n- $ E = \\sigma/\\varepsilon_0 = V/d $ in the gap; $ E = 0 $ outside.\n- Assumes $ d \\ll \\sqrt{A} $ so that fringing can be ignored.\n- **Before any "what happens if…" question, ask: is the battery still connected?** Battery on → $ V $ fixed. Battery off → $ Q $ fixed.',
    }),
    b('text', 10, {
      markdown: 'Next: the same derivation, run twice more — for spheres and for cylinders.',
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('The capacitance of a parallel-plate capacitor is doubled if you',
          ['double the plate area', 'double the plate separation', 'double the charge on the plates', 'double the applied voltage'],
          0,
          '$ C = \\varepsilon_0A/d $ rises with $ A $ and falls with $ d $. Charge and voltage do not appear in the formula at all — changing them changes each other, not the capacitance.',
          1),
        q('The field just outside an ideal parallel-plate capacitor is',
          ['zero, since the two plates cancel', '$ \\sigma/\\varepsilon_0 $', '$ \\sigma/2\\varepsilon_0 $', 'the same as the field inside'],
          0,
          'Each plate alone would give $ \\sigma/2\\varepsilon_0 $. Between the plates the two contributions point the same way and add; outside they point opposite ways and cancel. All the field is in the gap.',
          3),
        q('A parallel-plate capacitor is charged and then **disconnected** from the battery. The plates are then pulled further apart. The potential difference',
          ['increases', 'decreases', 'stays the same', 'falls to zero'],
          0,
          'Disconnected means $ Q $ is fixed. Increasing $ d $ reduces $ C $, and $ V = Q/C $ therefore rises. (Note that $ E = \\sigma/\\varepsilon_0 $ does **not** change, since $ \\sigma $ is fixed — the field stays put while the voltage climbs, because $ V = Ed $ and $ d $ grew.)',
          3),
      ],
    }),
  ],
};

// ── p10 · Spherical and Cylindrical Capacitors ───────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'spherical-and-cylindrical-capacitors',
  title: 'Spherical and Cylindrical Capacitors',
  subtitle: 'The same three steps, in two more geometries',
  glossary: [],
  blocks: [
    b('text', 0, {
      markdown: 'Every capacitance calculation in physics is the same three steps. Once you see that, the two geometries on this page take about four lines each.\n\n1. Put $ +Q $ on one conductor and $ -Q $ on the other.\n2. Find the field between them — almost always with **Gauss\'s law**, using the symmetry.\n3. Integrate the field to get $ V $, then take $ C = Q/V $.\n\nThat is exactly what we did for parallel plates. Here it is twice more.',
    }),
    b('heading', 1, {
      text: 'The spherical capacitor',
      level: 2,
      objective: 'Derive the capacitance of two concentric spheres and recover the isolated sphere as a limit.',
    }),
    b('step_solver', 2, {
      title: 'Two concentric spherical shells',
      problem: 'An inner sphere of radius $ a $ carries $ +Q $; an outer concentric shell of radius $ b $ carries $ -Q $. Find the capacitance.',
      intro: 'Spherical symmetry, so Gauss gives the field in one line.',
      steps: [
        st('$ E = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{Q}{r^{2}} \\qquad (a < r < b) $',
          'A spherical Gaussian surface between the two shells encloses only $ +Q $ — the outer shell\'s charge is outside it and contributes nothing.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does the outer shell\'s $ -Q $ not appear in this field?',
              options: ['Because it is negative', 'Because it lies outside the Gaussian surface, so it is not enclosed', 'Because it is spread over a larger area', 'Because the shells are concentric'],
              answer_index: 1,
              feedback_right: 'Right — Gauss counts only enclosed charge, and a spherically symmetric shell outside your surface contributes zero field inside it.',
              feedback_wrong: 'Gauss\'s law counts only the charge **enclosed** by the surface. The outer shell lies outside, and a uniform shell produces no field anywhere inside itself.',
            },
          }),
        st('$ V = -\\displaystyle\\int_b^a E\\,dr = \\frac{Q}{4\\pi\\varepsilon_0}\\left(\\frac{1}{a}-\\frac{1}{b}\\right) $',
          'Integrate the field from the outer shell to the inner one to get the potential difference between them.'),
        st('$ V = \\frac{Q}{4\\pi\\varepsilon_0}\\cdot\\frac{b-a}{ab} $',
          'Combine the two fractions over a common denominator.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Write $ \\frac{1}{a} - \\frac{1}{b} $ as a single fraction. What goes in the numerator?',
              blank_answer: 'b-a',
              feedback_right: 'Yes — $ \\frac{1}{a}-\\frac{1}{b} = \\frac{b-a}{ab} $.',
              feedback_wrong: 'Common denominator $ ab $: $ \\frac{1}{a} = \\frac{b}{ab} $ and $ \\frac{1}{b} = \\frac{a}{ab} $, so the difference is $ \\frac{b-a}{ab} $.',
            },
          }),
        st('$ C = \\frac{Q}{V} = 4\\pi\\varepsilon_0\\,\\frac{ab}{b-a} $',
          'And $ Q $ cancels, as it always must — capacitance never depends on how much charge you put on.'),
      ],
      now_you_try: {
        problem: 'Let the outer shell go to infinity ($ b \\to \\infty $). What does the formula become?',
        answer: '$ C = 4\\pi\\varepsilon_0 a $ — the isolated sphere.',
        solution: 'Write it as $ C = 4\\pi\\varepsilon_0\\frac{ab}{b-a} = 4\\pi\\varepsilon_0\\frac{a}{1-a/b} $.\n\nAs $ b \\to \\infty $, the term $ a/b \\to 0 $ and the denominator becomes 1, leaving $ C = 4\\pi\\varepsilon_0a $.\n\nThat is exactly the isolated-sphere result from page 8 — which is a good check that the derivation is sound. It also shows in one line why moving the outer conductor **closer** (smaller $ b $) makes $ C $ larger.',
      },
    }),
    b('worked_example', 3, {
      label: 'putting numbers into the spherical formula',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A spherical capacitor has an inner sphere of radius $ 10 $ cm and a concentric outer shell of radius $ 12 $ cm, with vacuum in between.\n\n(a) Find its capacitance.\n(b) Now remove the outer shell to infinity. What is the capacitance of the inner sphere on its own, and by what factor did the shell increase it?',
      solution: '**(a) Straight substitution — but in metres.**\n\n$ C = 4\\pi\\varepsilon_0\\,\\frac{ab}{b-a} = \\frac{1}{9\\times10^{9}}\\cdot\\frac{ab}{b-a} $\n\nwith $ a = 0.10 $ m and $ b = 0.12 $ m:\n\n$ \\frac{ab}{b-a} = \\frac{(0.10)(0.12)}{0.12 - 0.10} = \\frac{0.012}{0.020} = 0.60\\ \\text{m} $\n\n$ C = \\frac{0.60}{9\\times10^{9}} = 6.7\\times10^{-11}\\ \\text{F} = 67\\ \\text{pF} $\n\n**(b) The isolated sphere — the $ b \\to \\infty $ limit from the derivation above.**\n\n$ C = 4\\pi\\varepsilon_0 a = \\frac{0.10}{9\\times10^{9}} = 1.1\\times10^{-11}\\ \\text{F} = 11\\ \\text{pF} $\n\nSo the shell multiplied the capacitance by about **6**. And that factor is not a coincidence — divide the two formulas and everything cancels except\n\n$ \\frac{C_{\\text{with shell}}}{C_{\\text{alone}}} = \\frac{b}{b-a} = \\frac{0.12}{0.02} = 6 $\n\nBring the shell in to $ 11 $ cm and the factor becomes $ 11 $; bring it to $ 10.1 $ cm and it becomes $ 101 $. **A nearby earthed conductor is what makes a capacitor a capacitor** — that was the whole argument of page 9, now in numbers.\n\n**Watch-outs.** Work in metres; leaving the radii in centimetres inflates the answer a hundredfold. And notice how fragile $ b - a $ is: it is the difference of two similar numbers, so a $ 1 $ mm error in either radius shifts $ C $ by about $ 5\\% $.\n\n**Worth a moment.** A $ 24 $ cm ball of metal gives you $ 67 $ pF. A $ 1\\ \\mu\\text{F} $ capacitor that fits on your fingertip is roughly $ 15{,}000 $ times bigger than that. Geometry alone will never get you there — which is why real capacitors use a tiny gap and a dielectric.',
    }),
    b('heading', 4, {
      text: 'The cylindrical capacitor',
      level: 2,
      objective: 'Derive the capacitance per unit length of a coaxial cable.',
    }),
    b('text', 5, {
      markdown: 'Now an inner cylinder of radius $ a $ inside a coaxial outer cylinder of radius $ b $, both of length $ l $, with $ l \\gg b $ so the ends can be ignored.\n\nSame three steps. Gauss with a **coaxial cylinder** gives the field between them, using the linear charge density $ \\lambda = Q/l $:\n\n$ E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $\n\nIntegrating from $ b $ in to $ a $:\n\n$ V = \\frac{\\lambda}{2\\pi\\varepsilon_0}\\ln\\!\\left(\\frac{b}{a}\\right) $\n\nand therefore',
    }),
    b('latex_block', 6, {
      latex: 'C = \\frac{2\\pi\\varepsilon_0 l}{\\ln(b/a)}',
      label: 'Cylindrical (coaxial) capacitor',
      note: 'Proportional to length. Only the RATIO b/a matters, not the individual radii.',
      highlight: true,
    }),
    b('text', 7, {
      markdown: 'That $ \\ln(b/a) $ has a practical consequence worth noting: because a logarithm grows so slowly, the capacitance of a coaxial cable is remarkably insensitive to the exact radii. Double both radii together and $ C $ does not change at all — only their ratio counts.',
    }),
    b('worked_example', 8, {
      label: 'a length of coaxial cable',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 2.0 $ m length of coaxial cable has an inner conductor of radius $ 1.0 $ mm inside an outer braid of radius $ 5.0 $ mm, with air between them.\n\n(a) Find its capacitance.\n(b) A manufacturer scales the whole cable up, doubling both radii. What happens to the answer?',
      solution: '**(a) One substitution, once you have $ 2\\pi\\varepsilon_0 $ to hand.**\n\n$ 2\\pi\\varepsilon_0 = \\frac{1}{2\\times(9\\times10^{9})} = 5.6\\times10^{-11}\\ \\text{F/m} $\n\nOnly the **ratio** of the radii enters, so the millimetres do not even need converting here:\n\n$ \\ln\\!\\left(\\frac{b}{a}\\right) = \\ln\\!\\left(\\frac{5.0}{1.0}\\right) = \\ln 5 = 1.61 $\n\n$ C = \\frac{2\\pi\\varepsilon_0 l}{\\ln(b/a)} = \\frac{(5.6\\times10^{-11})(2.0)}{1.61} = 6.9\\times10^{-11}\\ \\text{F} = 69\\ \\text{pF} $\n\nThat is about $ 35 $ pF for every metre of cable — a number worth carrying, because cable capacitance is always quoted per metre.\n\n**(b) Nothing at all. It is still $ 69 $ pF.**\n\nDoubling both radii leaves $ b/a = 5 $ unchanged, and the formula sees nothing else. A cable as thick as your wrist and a cable as thin as a hair have the same capacitance per metre if their radius ratio matches.\n\n**Watch-out.** That is the **natural** logarithm, not $ \\log_{10} $. Using $ \\log_{10}5 = 0.70 $ instead of $ \\ln 5 = 1.61 $ would hand you $ 159 $ pF — more than twice the right answer, with nothing in the working to warn you.\n\n**One honest caveat.** A real cable is not air-filled; it is packed with a plastic insulator, which multiplies the answer by roughly $ 2 $ to $ 2.5 $. That is why the datasheet for a real coaxial cable says something nearer $ 70 $ pF per metre. The factor is the dielectric constant, and it gets a page of its own later in this chapter.',
    }),
    b('callout', 9, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The cylindrical capacitor is not a textbook curiosity — it is the **coaxial cable** carrying your television or internet signal, and it is every high-voltage power cable buried under a city.\n\nThe engineering matters. In a cable, $ \\ln(b/a) $ sets the capacitance per metre, and that capacitance is what limits how fast a signal can change — too much of it and high frequencies are smoothed away. Cable designers pick the ratio $ b/a $ to hit a target impedance (50 Ω or 75 Ω) which depends on precisely this geometry.\n\nAnd the field is strongest at the **inner** conductor, since $ E \\propto 1/r $. So it is the inner conductor\'s insulation that fails first — which is why the inner core is never made too thin.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F). A cutaway view of a coaxial cable drawn in thin dim-grey line art at a slight angle: a solid warm amber inner core, a dark insulating layer, a woven cool-grey outer braid, and an outer jacket, each layer stepped back so all are visible. Short radial orange field arrows fill the insulating gap, drawn densely and brightly near the inner core and sparsely near the braid. Thin dashed grey radius lines labelled a and b in muted white. Generous dark space, orange accent, no clutter.',
    }),
    b('table', 10, {
      caption: 'The three standard capacitors. Same three steps, three geometries.',
      headers: ['Type', 'Capacitance', 'Note'],
      rows: [
        ['Parallel plate', '$ \\frac{\\varepsilon_0A}{d} $', 'the workhorse; assumes $ d \\ll \\sqrt{A} $'],
        ['Spherical', '$ 4\\pi\\varepsilon_0\\frac{ab}{b-a} $', '$ \\to 4\\pi\\varepsilon_0a $ as $ b \\to \\infty $'],
        ['Cylindrical', '$ \\frac{2\\pi\\varepsilon_0 l}{\\ln(b/a)} $', 'depends on the ratio $ b/a $ only'],
      ],
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'analogical',
      prompt: 'In a spherical capacitor the two radii $ a $ and $ b $ are made very close, so that $ b - a = d $ is tiny. What does the capacitance formula become?',
      options: [
        'It reduces to $ \\varepsilon_0A/d $ — the parallel-plate result',
        'It becomes $ 4\\pi\\varepsilon_0 a $',
        'It goes to zero',
        'It stays as $ 4\\pi\\varepsilon_0 ab/(b-a) $ and does not simplify',
      ],
      reveal: '**It becomes the parallel-plate formula — as it must.**\n\nWith $ b - a = d $ very small, $ a $ and $ b $ are nearly equal, so $ ab \\approx a^{2} $:\n\n$ C = 4\\pi\\varepsilon_0\\frac{ab}{b-a} \\approx \\frac{4\\pi\\varepsilon_0 a^{2}}{d} = \\frac{\\varepsilon_0(4\\pi a^{2})}{d} = \\frac{\\varepsilon_0 A}{d} $\n\nsince $ 4\\pi a^{2} $ is exactly the surface area of the sphere.\n\nThis is worth more than the algebra. **Any two conductors separated by a gap small compared with their size behave as a parallel-plate capacitor**, whatever their shape — because on that scale every surface looks flat. It is why the parallel-plate formula is so widely useful, and it is a good habit to check a new formula against a limit you already trust.',
      difficulty_level: 3,
    }),
    b('image', 12, {
      src: '',
      alt: 'Cross-sections of a spherical capacitor and a cylindrical capacitor with radii a and b marked',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Two concentric spheres, two coaxial cylinders — and radial fields in both.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: two concentric circles in dim grey, the inner one carrying warm amber plus signs and the outer one cool blue minus signs, with short radial orange arrows in the gap between them and thin dashed grey radius lines labelled a and b. Right panel: two concentric circles of the same style representing a coaxial cable seen end-on, with the same radial orange arrows and dashed radius labels, plus a faint perspective outline suggesting length. Muted white minimal labels, generous dark space.',
    }),
    b('text', 13, {
      markdown: 'Next: real circuits contain several capacitors at once. Two rules cover every combination — and both come from asking what is shared.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('The capacitance of a spherical capacitor with inner radius $ a $ and outer radius $ b $ is',
          ['$ 4\\pi\\varepsilon_0\\frac{ab}{b-a} $', '$ 4\\pi\\varepsilon_0\\frac{b-a}{ab} $', '$ 4\\pi\\varepsilon_0(b-a) $', '$ 4\\pi\\varepsilon_0\\frac{a}{b} $'],
          0,
          'Check it against a limit you trust: as $ b \\to \\infty $ this gives $ 4\\pi\\varepsilon_0a $, the isolated sphere. The inverted version would go to zero instead, which is plainly wrong.',
          2),
        q('The capacitance of a coaxial cable depends on the radii through',
          ['the ratio $ b/a $ only', 'the difference $ b-a $ only', 'the product $ ab $ only', 'neither — only the length matters'],
          0,
          'The formula contains $ \\ln(b/a) $, so scaling both radii by the same factor leaves the capacitance unchanged. That is a genuinely useful design fact for cable manufacture.',
          2),
        q('A spherical capacitor has a very narrow gap between its shells. Its capacitance is closest to',
          ['$ \\varepsilon_0A/d $, the parallel-plate value', '$ 4\\pi\\varepsilon_0a $, the isolated sphere', 'zero, since the gap vanishes', 'infinite, since the gap vanishes'],
          0,
          'With $ a \\approx b $ the exact formula reduces to $ \\varepsilon_0(4\\pi a^{2})/d $, which is the parallel-plate result with $ A = 4\\pi a^{2} $. On a scale much smaller than the radius, a sphere looks flat.',
          3),
      ],
    }),
  ],
};

// ── p11 · Series and Parallel ────────────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'capacitors-in-series-and-parallel',
  title: 'Capacitors in Series and Parallel',
  subtitle: 'Derive them from what is shared, and you will never mix them up',
  glossary: [],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'For resistors, series adds and parallel gives the reciprocal rule. For capacitors it is the **other way round**.\n\nRather than memorising which is which, here is a better question: what is the same across two capacitors connected side by side, and what is the same for two connected end to end?',
      hint: 'Side by side, both are wired between the same two points.',
      reveal: '**Side by side (parallel): the voltage is shared.** Both capacitors are connected between the same two nodes, so both have the same $ V $ across them.\n\n**End to end (series): the charge is shared.** The plates in the middle are an isolated island — charge cannot enter or leave it, only shift within it. So every capacitor in the chain carries the same $ Q $.\n\nEvery formula on this page follows from those two sentences. Get them right and you never need to remember which rule is which.',
    }),
    b('heading', 1, {
      text: 'Parallel — same voltage, charges add',
      level: 2,
      objective: 'Derive the parallel rule from the fact that the voltage is common.',
    }),
    b('text', 2, {
      markdown: 'Connect capacitors $ C_1 $ and $ C_2 $ between the same two points. Both see the same potential difference $ V $.\n\nThe charges they hold are $ Q_1 = C_1V $ and $ Q_2 = C_2V $, and the total charge drawn from the source is their sum:\n\n$ Q = Q_1 + Q_2 = (C_1 + C_2)V $\n\nComparing with $ Q = C_{\\text{eq}}V $:',
    }),
    b('latex_block', 3, {
      latex: 'C_{\\text{parallel}} = C_1 + C_2 + C_3 + \\cdots',
      label: 'Capacitors in parallel',
      note: 'The equivalent is LARGER than any individual capacitor. Parallel plates side by side = more area.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'There is a physical picture that makes this obvious. Two capacitors in parallel are really just **more plate area** — and $ C = \\varepsilon_0A/d $ says more area means more capacitance. Wiring them side by side is the same as building one bigger capacitor.',
    }),
    b('heading', 5, {
      text: 'Series — same charge, voltages add',
      level: 2,
      objective: 'Derive the series rule from the fact that the charge is common, and say why the middle plates must match.',
    }),
    b('text', 6, {
      markdown: 'Now connect them end to end. Here is the crucial step, and it is worth going slowly.\n\nThe source pushes $ +Q $ onto the left plate of $ C_1 $. That charge repels $ Q $ from the right plate of $ C_1 $, which travels down the connecting wire onto the left plate of $ C_2 $. The plates in between are **isolated** — no wire connects them to any source — so whatever charge appears on one is exactly what left the other.\n\n**Every capacitor in a series chain therefore carries the same $ Q $**, however different their capacitances.\n\nThe voltages, on the other hand, add:\n\n$ V = V_1 + V_2 = \\frac{Q}{C_1} + \\frac{Q}{C_2} = Q\\left(\\frac{1}{C_1}+\\frac{1}{C_2}\\right) $\n\nand since $ V = Q/C_{\\text{eq}} $:',
    }),
    b('latex_block', 7, {
      latex: '\\frac{1}{C_{\\text{series}}} = \\frac{1}{C_1} + \\frac{1}{C_2} + \\frac{1}{C_3} + \\cdots',
      label: 'Capacitors in series',
      note: 'The equivalent is SMALLER than the smallest capacitor in the chain. Stacking in series = a bigger gap.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'And the same physical check: capacitors in series are effectively **a bigger gap** between the outer plates, and $ C = \\varepsilon_0A/d $ says a bigger $ d $ means less capacitance.\n\nFor exactly two in series, the shortcut is worth memorising:\n\n$ C_{\\text{eq}} = \\frac{C_1C_2}{C_1+C_2} $ — "product over sum". It works for two, and only for two.',
    }),
    b('comparison_card', 9, {
      title: 'Series and parallel, side by side',
      columns: [
        {
          heading: 'Parallel',
          points: [
            'Same **voltage** across each',
            'Charges **add**: $ Q = Q_1 + Q_2 $',
            '$ C_{\\text{eq}} = C_1 + C_2 $',
            'Equivalent is **larger** than any one',
            'The bigger capacitor takes the bigger charge',
          ],
        },
        {
          heading: 'Series',
          points: [
            'Same **charge** on each',
            'Voltages **add**: $ V = V_1 + V_2 $',
            '$ \\frac{1}{C_{\\text{eq}}} = \\frac{1}{C_1} + \\frac{1}{C_2} $',
            'Equivalent is **smaller** than the smallest',
            'The **smaller** capacitor takes the bigger voltage',
          ],
        },
      ],
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'quantitative',
      prompt: 'A $ 2\\ \\mu\\text{F} $ and a $ 6\\ \\mu\\text{F} $ capacitor are connected **in series** across a $ 12 $ V supply. Which carries the larger voltage, and what is it?',
      options: [
        'The $ 2\\ \\mu\\text{F} $, with $ 9 $ V across it',
        'The $ 6\\ \\mu\\text{F} $, with $ 9 $ V across it',
        'They share equally, $ 6 $ V each',
        'The $ 2\\ \\mu\\text{F} $, with $ 3 $ V across it',
      ],
      reveal: '**The $ 2\\ \\mu\\text{F} $ capacitor, with $ 9 $ V across it.**\n\nIn series the charge is common. From $ V = Q/C $ with $ Q $ fixed, $ V \\propto 1/C $ — so the **smaller** capacitor takes the **larger** share of the voltage.\n\nThe numbers: $ C_{\\text{eq}} = \\frac{2\\times6}{2+6} = 1.5\\ \\mu\\text{F} $, so $ Q = C_{\\text{eq}}V = 1.5\\times12 = 18\\ \\mu\\text{C} $ on each.\n\nThen $ V_1 = 18/2 = 9 $ V and $ V_2 = 18/6 = 3 $ V. They add to 12 V, which is the check.\n\n**Why an engineer cares.** Every capacitor has a voltage it cannot survive. In a series chain the smallest capacitor is the one under most stress — so it is the one that fails first, and it is the one that sets the rating of the whole chain.',
      difficulty_level: 3,
    }),
    b('worked_example', 11, {
      label: 'a mixed network',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 3\\ \\mu\\text{F} $ and a $ 6\\ \\mu\\text{F} $ capacitor are connected in series, and this combination is connected in parallel with a $ 4\\ \\mu\\text{F} $ capacitor. Find the equivalent capacitance, and the charge on each capacitor when $ 20 $ V is applied.',
      solution: '**Step 1 — collapse the series pair.**\n\n$ C_s = \\frac{3\\times6}{3+6} = \\frac{18}{9} = 2\\ \\mu\\text{F} $\n\nSanity check: 2 is smaller than both 3 and 6, as a series combination must be.\n\n**Step 2 — add the parallel branch.**\n\n$ C_{\\text{eq}} = C_s + 4 = 2 + 4 = 6\\ \\mu\\text{F} $\n\n**Step 3 — work back outwards for the charges.**\n\nThe $ 4\\ \\mu\\text{F} $ sits directly across the supply, so it sees the full 20 V:\n\n$ Q_4 = 4 \\times 20 = 80\\ \\mu\\text{C} $\n\nThe series branch also sees 20 V across the pair, and behaves as a single $ 2\\ \\mu\\text{F} $:\n\n$ Q_s = 2 \\times 20 = 40\\ \\mu\\text{C} $\n\nand in series **both** capacitors carry that same 40 μC:\n\n$ Q_3 = Q_6 = 40\\ \\mu\\text{C} $\n\n**Check the voltages.** $ V_3 = 40/3 = 13.3 $ V and $ V_6 = 40/6 = 6.7 $ V. They sum to 20 V. Good.\n\n**The method, in one line:** collapse inwards to find $ C_{\\text{eq}} $, then expand back outwards to find each charge and voltage. Every network problem in this chapter is that loop.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Two capacitors in parallel shown as extra plate area, and two in series shown as a wider gap',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Parallel is more area. Series is a bigger gap. The rules follow from C = ε₀A/d.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, drawn in thin dim-grey line art. Left panel labelled Parallel: two capacitors side by side, each a pair of short horizontal bars — upper bars warm amber with plus signs, lower bars cool blue with minus signs — joined by wires at top and bottom so both span the same two points; a faint dashed amber outline encircles both upper bars to suggest one larger plate. Right panel labelled Series: two capacitors stacked vertically end to end with a short wire between them, the outer bars amber above and blue below, and a tall thin dashed grey bracket beside them marking the combined separation. Muted white minimal labels, generous dark space, orange and blue accents only.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Parallel:** same $ V $, charges add, $ C_{\\text{eq}} = \\sum C $ — bigger than any one.\n- **Series:** same $ Q $, voltages add, $ 1/C_{\\text{eq}} = \\sum 1/C $ — smaller than the smallest.\n- Two in series: $ C_1C_2/(C_1+C_2) $.\n- In series the **smaller** capacitor takes the **bigger** voltage — and fails first.\n- Method: collapse inwards for $ C_{\\text{eq}} $, then expand outwards for individual $ Q $ and $ V $.',
    }),
    b('text', 13, {
      markdown: 'Next: networks that are not obviously series or parallel at all — and the redraw that makes them so.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('Three identical capacitors of capacitance $ C $ are connected in series. The equivalent capacitance is',
          ['$ C/3 $', '$ 3C $', '$ C $', '$ C/9 $'],
          0,
          '$ 1/C_{\\text{eq}} = 3/C $, so $ C_{\\text{eq}} = C/3 $ — smaller than any individual capacitor, which is the signature of a series combination.',
          1),
        q('In a series combination of unequal capacitors, the quantity that is the same for all of them is',
          ['the charge', 'the potential difference', 'the capacitance', 'the energy stored'],
          0,
          'The plates between adjacent capacitors form an isolated island that no wire reaches, so whatever charge appears on one is exactly what left the other. The voltages then divide in inverse proportion to the capacitances.',
          1),
        q('A $ 4\\ \\mu\\text{F} $ and a $ 12\\ \\mu\\text{F} $ capacitor are connected in **parallel** across $ 10 $ V. The charge on the $ 4\\ \\mu\\text{F} $ capacitor is',
          ['$ 40\\ \\mu\\text{C} $', '$ 120\\ \\mu\\text{C} $', '$ 30\\ \\mu\\text{C} $', '$ 160\\ \\mu\\text{C} $'],
          0,
          'In parallel both see the full 10 V, so $ Q = CV = 4\\times10 = 40\\ \\mu\\text{C} $. The $ 12\\ \\mu\\text{F} $ takes $ 120\\ \\mu\\text{C} $, and the total drawn is $ 160\\ \\mu\\text{C} $ — which is the value you get from $ C_{\\text{eq}} = 16\\ \\mu\\text{F} $.',
          1),
      ],
    }),
  ],
};

// ── p12 · Reading a Capacitor Network ────────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'reading-a-capacitor-network',
  title: 'Reading a Capacitor Network',
  subtitle: 'The redraw that turns a mess into series and parallel',
  glossary: [
    { term: 'node', definition: 'A point in a circuit, together with every point connected to it by plain wire. All points of one node are at the same potential.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Most students who get network problems wrong do not get the *formulas* wrong. They get the **topology** wrong — they decide two capacitors are in series when they are not.\n\nSo this page is about one skill, and it is not a formula. It is learning to see which components genuinely share a node, and redrawing the circuit until that is obvious.',
    }),
    b('heading', 1, {
      text: 'Label the nodes first',
      level: 2,
      objective: 'Identify nodes correctly and use them to decide what is really in parallel.',
    }),
    b('text', 2, {
      markdown: 'A **node** is a point in the circuit *together with everything joined to it by plain wire*. A wire has no resistance and no capacitance, so **every point along a wire is at the same potential** — however long or twisted it is drawn.\n\nThat gives the two tests, and they are the whole of this topic:\n\n> **Two components are in parallel if both their ends land on the same pair of nodes.**\n>\n> **Two components are in series if they share a node that nothing else connects to.**\n\nThat second condition is the one people skip. If a third wire joins the middle point, the two components are **not** in series — charge now has somewhere else to go, and the "same charge" argument collapses.',
    }),
    b('text', 3, {
      markdown: 'So the working method is:\n\n1. **Put a letter on every node.** Follow each wire to its end and give every point on it the same letter.\n2. **Redraw**, placing the nodes as far apart as the page allows and hanging each component between its two letters.\n3. Now the series and parallel groups are visible, and you collapse them as on the last page.\n\nThe redraw is not optional decoration. It is the step that turns a problem you cannot see into one you can.',
    }),
    b('image', 4, {
      src: '',
      alt: 'The same capacitor network drawn twice — once as a confusing tangle and once redrawn by nodes',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Same circuit, both times. Labelling the nodes and redrawing is what makes the structure visible.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, both drawn in thin dim-grey line art with capacitors shown as pairs of short parallel bars in warm amber. Left panel, labelled Before: a deliberately awkward layout with wires crossing and bending at odd angles, four capacitors scattered, hard to read. Right panel, labelled After: the identical circuit redrawn cleanly with three clearly separated nodes marked as small amber dots labelled A, B and C in muted white, the same four capacitors hanging neatly between them so that two are obviously in parallel and the rest in series. Generous dark space, orange accent, no clutter.',
    }),
    b('heading', 5, {
      text: 'Symmetry — the shortcut when the redraw is hard',
      level: 2,
      objective: 'Use a symmetry argument to remove a branch from a network before calculating.',
    }),
    b('text', 6, {
      markdown: 'Some networks are symmetric about a line through the input and output terminals. When they are, one observation saves the whole calculation:\n\n> **If two nodes are at the same potential, the component joining them carries no charge — and can be removed (or shorted) without changing anything.**\n\nWhy? A capacitor between two points at the same potential has $ V = 0 $ across it, so $ Q = CV = 0 $. It is doing nothing. Delete it and the rest of the circuit does not notice.\n\nThis is the capacitor version of the **balanced Wheatstone bridge**, which you will meet again with resistors in Chapter 3. The condition for balance is\n\n$ \\frac{C_1}{C_2} = \\frac{C_3}{C_4} $\n\nand when it holds, the bridging capacitor in the middle can simply be ignored.',
    }),
    b('worked_example', 7, {
      label: 'a balanced bridge of capacitors',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Five capacitors form a bridge between terminals A and B: $ C_1 = 2\\ \\mu\\text{F} $ and $ C_2 = 4\\ \\mu\\text{F} $ in one arm (joined at node P), $ C_3 = 3\\ \\mu\\text{F} $ and $ C_4 = 6\\ \\mu\\text{F} $ in the other (joined at node Q), and a bridging capacitor $ C_5 = 10\\ \\mu\\text{F} $ between P and Q. Find the equivalent capacitance between A and B.',
      solution: '**Step 1 — test for balance.** Compare the ratios in the two arms:\n\n$ \\frac{C_1}{C_2} = \\frac{2}{4} = \\frac{1}{2}, \\qquad \\frac{C_3}{C_4} = \\frac{3}{6} = \\frac{1}{2} $\n\nEqual — so the bridge is **balanced**.\n\n**Step 2 — what balance means.** Nodes P and Q sit at the same potential. The bridging capacitor $ C_5 $ therefore has zero volts across it, holds zero charge, and can be **removed entirely**.\n\nAnd note: its value, $ 10\\ \\mu\\text{F} $, is completely irrelevant. It could be a picofarad or a farad; the answer is the same.\n\n**Step 3 — what is left is simple.** Two series pairs, in parallel with each other.\n\nUpper arm: $ \\frac{2\\times4}{2+4} = \\frac{8}{6} = \\frac{4}{3}\\ \\mu\\text{F} $\n\nLower arm: $ \\frac{3\\times6}{3+6} = \\frac{18}{9} = 2\\ \\mu\\text{F} $\n\nIn parallel:\n\n$ C_{\\text{eq}} = \\frac{4}{3} + 2 = \\frac{10}{3} \\approx 3.33\\ \\mu\\text{F} $\n\n**The habit worth building.** Whenever you see a five-component bridge, **check the ratios before doing anything else**. If it balances, the problem collapses from a hard one to an easy one in a single line.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'spatial',
      prompt: 'Two capacitors are joined at a middle point, and a third wire also connects to that same middle point and runs off to another part of the circuit. Are the two capacitors in series?',
      options: [
        'No — the middle node has a third connection, so charge can leave it',
        'Yes — the two capacitors are still joined end to end in one chain',
        'Yes — the third wire changes the voltages but not the series formula',
        'It depends on the capacitance values: series only when $ C_1 = C_2 $',
      ],
      reveal: '**No.**\n\nThe series rule rests entirely on the middle plates being an **isolated island**: whatever charge arrives on one plate is exactly what left the other, because there is nowhere else for it to go.\n\nAttach a third wire and that argument dies. Charge can now flow in or out of the junction, so the two capacitors no longer carry equal charges and $ 1/C_{\\text{eq}} = 1/C_1 + 1/C_2 $ does not apply.\n\n**This is the single most common error in network problems** — assuming series purely from the drawing looking like a chain. Always check: does anything else touch the junction?',
      difficulty_level: 3,
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Label nodes first; every point on a wire is one node.\n- **Parallel** = both ends on the same two nodes. **Series** = share a node nothing else touches.\n- A capacitor between two points at equal potential carries no charge — delete it.\n- Bridge balance: $ C_1/C_2 = C_3/C_4 $ → the bridging capacitor is irrelevant, whatever its value.\n- Redraw before you calculate. It is faster than being clever.',
    }),
    b('text', 10, {
      markdown: 'Next: we have been moving charge onto capacitors without asking what it cost. It cost energy — and the answer contains a factor of one half that is worth understanding rather than memorising.',
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('Two capacitors are in parallel if',
          ['both ends land on the same two nodes', 'they are drawn side by side on the page', 'they happen to carry the same charge', 'they have equal capacitance values'],
          0,
          'Parallel is a statement about topology, not about the drawing. Both must span the same two nodes — and then both necessarily have the same voltage across them.',
          2),
        q('In a balanced bridge of capacitors, the bridging capacitor',
          ['carries no charge and can be removed', 'carries the largest charge in the circuit', 'must be equal to the others', 'short-circuits the supply'],
          0,
          'Balance means its two ends sit at the same potential, so $ V = 0 $ across it and $ Q = CV = 0 $. Its value never enters the answer, which is why checking the ratios first can collapse the whole problem.',
          2),
        q('A wire of zero resistance connects two points in a circuit. Those two points',
          ['are at the same potential and form a single node', 'have a small potential difference between them', 'are in series with each other', 'must carry equal and opposite charges'],
          0,
          'Any potential difference along a resistanceless wire would drive an infinite current, so there can be none. Treating all such points as one labelled node is the first step of every redraw.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p8, p9, p10, p11, p12]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
