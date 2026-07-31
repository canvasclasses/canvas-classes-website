'use strict';
/**
 * Class 12 Physics · Ch.1 "Electrostatics" — pages 1–5.
 * Charge, charging a body, Coulomb's law, superposition, and charges in a medium.
 *
 * Run: node scripts/physics12-book/build_ch1_a_charge_and_coulomb.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 1;

// ── p1 · Charge — the Property Behind It All ─────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'charge-the-property-behind-it-all',
  title: 'Charge — the Property Behind It All',
  subtitle: 'What charge is, and the three rules it never breaks',
  glossary: [
    { term: 'electric charge', definition: 'An intrinsic property of matter, like mass, that decides how strongly a particle pushes or pulls other particles electrically.' },
    { term: 'quantised', definition: 'Allowed to take only whole-number multiples of a basic amount — never a value in between.' },
    { term: 'coulomb', definition: 'The SI unit of charge. One coulomb is the charge of about 6.25 billion billion electrons — an enormous amount.' },
    { term: 'conservation of charge', definition: 'The total charge of an isolated system never changes. Charge can move around, but it is never created or destroyed.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You have known about mass since Class 6. A kilogram of anything pulls on a kilogram of anything else — always attraction, never a push.\n\nNow think about the other property matter carries: **charge**. What is the one thing charge does that mass simply cannot?',
      hint: 'Gravity only ever pulls. Think about what happens when you bring two combed hairs close together.',
      reveal: 'Charge can **repel**.\n\nThat one word is why electricity is a separate subject from gravity. Because there are two kinds of charge, the forces can cancel — and that cancellation is exactly why a lump of matter, made of billions of charged particles, feels electrically dead until you disturb the balance.\n\nEverything in this chapter comes from disturbing that balance.',
    }),
    b('text', 1, {
      markdown: 'An atom has a small heavy **nucleus** — protons and neutrons — with electrons around it. Two of those three particles carry charge:\n\n- a proton carries $ +e $\n- an electron carries $ -e $\n- a neutron carries none\n\nThe magnitudes match **exactly**. Not approximately — exactly. That precise match is why ordinary matter, with equal numbers of protons and electrons, is electrically neutral.\n\nThe SI unit of charge is the **coulomb** (C), and',
    }),
    b('latex_block', 2, {
      latex: 'e = 1.6 \\times 10^{-19}\\ \\text{C}',
      label: 'The elementary charge',
      note: 'The smallest free charge ever observed. Everything else is built from it.',
      highlight: true,
    }),
    b('callout', 3, {
      variant: 'fun_fact',
      markdown: 'A coulomb is a **ridiculous** amount of charge. One coulomb is the charge of about $ 6.25 \\times 10^{18} $ electrons.\n\nIf you could put $ +1 $ C on one hand and $ -1 $ C on the other and hold them a metre apart, the pull between them would be around $ 9 \\times 10^{9} $ newtons — roughly the weight of a million tonnes. That is why real electrostatics problems live in microcoulombs ($ \\mu $C) and nanocoulombs (nC).',
    }),
    b('heading', 4, {
      text: 'Rule 1 — charge comes in two kinds, and it is a scalar',
      level: 2,
      objective: 'State how the two kinds behave, and explain why charge is a scalar even though electric force is a vector.',
    }),
    b('text', 5, {
      markdown: '**Like charges repel, unlike charges attract.** That is the whole of it.\n\nOne point trips students up every year: **charge is a scalar.** It has a sign, but a sign is not a direction. You add charges the way you add temperatures — $ +3\\ \\mu\\text{C} $ and $ -5\\ \\mu\\text{C} $ together make $ -2\\ \\mu\\text{C} $, with no angles involved.\n\nThe **force** between charges is a vector. The charge itself is not. Keep the two separate and half of this chapter gets easier.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'Two **identical** small metal spheres carry $ +8\\ \\mu\\text{C} $ and $ -2\\ \\mu\\text{C} $. They are touched together and separated again. What charge does each carry now?',
      options: ['$ +3\\ \\mu\\text{C} $ each', '$ +6\\ \\mu\\text{C} $ and $ 0 $', '$ +8\\ \\mu\\text{C} $ and $ -2\\ \\mu\\text{C} $, unchanged', '$ +4\\ \\mu\\text{C} $ and $ -1\\ \\mu\\text{C} $'],
      reveal: '**$ +3\\ \\mu\\text{C} $ each.**\n\nWhen two identical conductors touch, they become one conductor. The total charge is $ +8 + (-2) = +6\\ \\mu\\text{C} $ — a scalar sum — and by symmetry it splits equally, giving $ +3\\ \\mu\\text{C} $ on each.\n\nNotice what did the work: charge is conserved (total stays $ +6 $) and charge is a scalar (you added the signs, not vectors). Both rules, in one line of arithmetic.\n\nThis "touch and share" step appears in exam problems constantly, and it is only equal sharing when the spheres are **identical**.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Rule 2 — charge is quantised',
      level: 2,
      objective: 'Explain why a body can carry 1.6 nC but never 1.6 nC plus a third of an electron.',
    }),
    b('text', 8, {
      markdown: 'You cannot chop $ e $ into pieces. Any charge you will ever measure on a body is a whole number of elementary charges:',
    }),
    b('latex_block', 9, {
      latex: 'q = \\pm ne \\qquad n = 1,\\ 2,\\ 3,\\ \\ldots',
      label: 'Quantisation of charge',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'So a body can carry $ 1.6 \\times 10^{-19} $ C, or twice that, or a million times that — but never $ \\tfrac{1}{3}e $ or $ 1.5e $.\n\nIn practice, does this ever matter? A charge of $ 1\\ \\mu\\text{C} $ is about $ 10^{13} $ electrons. Adding or removing one electron changes it by one part in ten trillion — far below anything you could measure. So at everyday scale charge behaves as if it were continuous, and we happily write $ 2.5\\ \\mu\\text{C} $ without worrying. **Quantisation matters when the numbers are small enough to count.**',
    }),
    b('worked_example', 11, {
      label: 'counting the electrons in one coulomb',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'How many electrons make up one coulomb of negative charge?',
      solution: 'The negative charge comes from excess electrons, each carrying a magnitude $ e = 1.6 \\times 10^{-19} $ C.\n\nSo the number of electrons is the total charge divided by the charge on one:\n\n$ n = \\frac{q}{e} = \\frac{1.0}{1.6 \\times 10^{-19}} = 6.25 \\times 10^{18} $\n\nSix and a quarter billion billion electrons — for a single coulomb. Hold on to this number; it is the fastest sanity check you have on whether an answer in coulombs is realistic.',
    }),
    b('heading', 12, {
      text: 'Rule 3 — charge is conserved',
      level: 2,
      objective: 'Apply conservation of charge to a process where new charged particles appear.',
    }),
    b('text', 13, {
      markdown: 'In any process whatsoever, the **net** charge of an isolated system stays the same. Rubbing, chemical reactions, nuclear decay, particle collisions — the total before equals the total after.\n\nThe striking case is **pair production**: a photon with no charge at all vanishes and an electron ($ -e $) plus a positron ($ +e $) appear. Two charged particles were created out of nothing charged — and the books still balance, because the total is still zero. The reverse, **pair annihilation**, does the same in reverse.\n\nNotice what conservation does *not* say. It does not say charge cannot move, and it does not say a body cannot become charged. It says only that whatever a body gains, something else lost.',
    }),
    b('image', 14, {
      src: '',
      alt: 'The three rules of charge shown as one figure: two kinds, quantisation as a staircase, and conservation as a balance',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The three rules that every later formula in this chapter quietly assumes.',
      generation_prompt: 'Clean scientific infographic on a near-black background (#0B0C0F), three panels side by side separated by thin grey rules. Panel 1: two small spheres, one warm amber marked with a plus, one cool blue marked with a minus, with a curved arrow between them showing attraction, and above them two amber spheres pushing apart. Panel 2: a rising staircase of small identical amber blocks, each step labelled e, 2e, 3e, with a faint crossed-out half-step between two stairs. Panel 3: a simple balance beam, dim grey, level, with a small amber plus and a small blue minus on either pan. Minimal labels in muted white, thin lines, generous dark space, orange accent colour throughout. No clutter, no cartoon styling.',
    }),
    b('callout', 15, {
      variant: 'remember',
      title: 'The three rules, in one breath',
      markdown: '**Two kinds** — like repels, unlike attracts; charge is a **scalar**, so signs add arithmetically.\n\n**Quantised** — $ q = \\pm ne $, always a whole multiple of $ e = 1.6 \\times 10^{-19} $ C.\n\n**Conserved** — the net charge of an isolated system never changes.\n\nEvery formula in the rest of this chapter sits on top of these three.',
    }),
    b('text', 16, {
      markdown: 'Next: charge is conserved, so the only way to charge something is to **move** charge onto it. There are exactly three ways to do that — and one of them explains why a comb picks up paper that has no charge at all.',
    }),
    b('inline_quiz', 17, {
      pass_threshold: 0.6,
      questions: [
        q('Which of these is a possible charge on a body?',
          ['$ 4.8 \\times 10^{-19} $ C', '$ 2.4 \\times 10^{-19} $ C', '$ 5.6 \\times 10^{-19} $ C', '$ 0.8 \\times 10^{-19} $ C'],
          0,
          'Divide each by $ e = 1.6 \\times 10^{-19} $ C and ask whether you get a whole number. Only $ 4.8 \\times 10^{-19} $ does — it is exactly $ 3e $. The others come out at 1.5, 3.5 and 0.5 electrons, which quantisation forbids.',
          2),
        q('A glass rod is rubbed with silk and becomes positively charged. What happened to the silk?',
          ['It became equally negatively charged', 'It stayed neutral throughout the rubbing', 'It also became positively charged', 'It gained protons transferred from the rod'],
          0,
          'Only electrons move — protons are locked in nuclei. Electrons left the glass and landed on the silk, so the silk carries exactly the negative of the rod\'s charge. The pair together is still neutral, which is conservation of charge doing its job.',
          1),
        q('Charge is a scalar, yet the electric force between two charges is a vector. The best explanation is that',
          ['the sign of a charge is not a direction in space', 'charge secretly has a direction we ignore', 'force is a scalar too, in electrostatics', 'the vector nature comes from the distance between charges'],
          0,
          'A sign tells you which of the two kinds a charge is; it does not point anywhere. The direction of the force comes from the geometry — the line joining the two charges — not from the charge itself.',
          3),
      ],
    }),
  ],
};

// ── p2 · How a Body Gets Charged ─────────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'how-a-body-gets-charged',
  title: 'How a Body Gets Charged',
  subtitle: 'Friction, contact, induction — and why a comb attracts neutral paper',
  glossary: [
    { term: 'conductor', definition: 'A material with charges free to move through it — metals, the human body, the earth.' },
    { term: 'insulator', definition: 'A material whose charges are bound in place, so a charge put on it stays where it was put.' },
    { term: 'induction', definition: 'Charging a body without touching it, by using a nearby charge to push its own charges around first.' },
    { term: 'earthing', definition: 'Connecting a body to the ground so that unwanted charge can flow away into the earth, which is effectively infinite.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Comb your hair on a dry day and hold the comb over torn bits of paper. The paper jumps up to it.\n\nHere is the puzzle: the paper is **neutral**. It has no net charge at all. A charged comb should have nothing to grab. And yet it lifts the paper against gravity — so the electric force is beating the entire pull of the Earth on that scrap.\n\nBy the end of this page you will be able to explain both halves of that: why it happens, and why it stops happening after a while.',
    }),
    b('text', 1, {
      markdown: 'Before the three methods, one split that decides everything:\n\n- In a **conductor**, some charges are free to wander through the whole body. Metals are the standard example — their outer electrons are shared, not owned. The human body and the earth are conductors too.\n- In an **insulator**, every charge is bound to its own atom. Glass, rubber, plastic, dry paper. Charge placed on an insulator sits there and does not spread.\n\n**Semiconductors** — silicon, germanium — sit in between, and get a whole chapter of their own later.\n\nThat single difference is why you can charge a metal sphere by induction but not a plastic one.',
    }),
    b('heading', 2, {
      text: 'Charging by friction',
      level: 2,
      objective: 'Say which particle actually moves during rubbing, and predict the sign each body ends up with.',
    }),
    b('text', 3, {
      markdown: 'Rub two different materials together and some electrons transfer from one to the other. The body that **loses** electrons becomes positive; the body that **gains** them becomes negative.\n\nGlass rubbed with silk: glass goes positive, silk goes negative. Ebonite rubbed with wool: ebonite goes negative, wool goes positive.\n\nTwo things worth fixing in your head now:\n\n1. **Protons never move.** They are locked inside nuclei. Every charging process you will meet is electrons moving.\n2. The two bodies always end up with **equal and opposite** charges. Rubbing does not create charge; it separates it.',
    }),
    b('heading', 4, {
      text: 'Charging by contact',
      level: 2,
      objective: 'Explain why a body charged by contact ends up with the same sign as the charging body.',
    }),
    b('text', 5, {
      markdown: 'Touch a charged rod to a metal sphere on an insulating stand. Some of the rod\'s excess charge moves onto the sphere and — because like charges repel — immediately spreads out over the sphere\'s surface. Remove the rod and the sphere keeps that charge.\n\nSo **charging by contact gives the same sign** as the charging body. A negative rod leaves the sphere negative.\n\nThe insulating stand matters: without it, the charge would run straight down to the earth and the sphere would end up neutral.',
    }),
    b('heading', 6, {
      text: 'Charging by induction — the clever one',
      level: 2,
      objective: 'Produce a charge of the opposite sign on a conductor without ever touching it.',
    }),
    b('text', 7, {
      markdown: 'This is the method that gets you a charge **without contact**, and with the **opposite** sign. Four steps, and the order matters:\n\n**Step 1.** Bring a negatively charged rod near an insulated metal sphere — close, but not touching. The sphere\'s free electrons are repelled to the far side. The near side is now positive, the far side negative. The sphere as a whole is still neutral.\n\n**Step 2.** Earth the sphere with a wire while the rod stays in place. The repelled electrons now have somewhere to go, so they leave for the earth.\n\n**Step 3.** Remove the earthing wire — **while the rod is still there.**\n\n**Step 4.** Now remove the rod. The remaining positive charge, no longer held on one side, spreads over the whole sphere.\n\nResult: a permanently **positive** sphere, charged by a **negative** rod, with no contact at all. Reverse every sign and a positive rod gives you a negative sphere.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'logical',
      prompt: 'In the induction sequence above, a student removes the rod first and *then* removes the earthing wire. What does the sphere end up with?',
      options: ['No net charge', 'The same positive charge as before', 'A negative charge instead', 'Half the charge it would otherwise have'],
      reveal: '**No net charge.**\n\nThe rod is the thing holding the imbalance in place. Take the rod away first and there is nothing repelling electrons any more, so the electrons that went to earth simply come straight back up the wire. The sphere returns to neutral, and only then do you disconnect it.\n\nThis is why the order in Step 3 and Step 4 is not a detail. **Break the earth connection while the field is still applied** — that is the whole trick of induction, and the one step exam questions are built around.',
      difficulty_level: 3,
    }),
    b('image', 9, {
      src: '',
      alt: 'Four-stage diagram of charging a metal sphere by induction using a negatively charged rod',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Charging by induction. The earth wire goes on while the rod is near, and comes off before the rod does.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), four stages left to right, each a metal sphere on a thin insulating stand drawn in dim grey line art. Stage 1: a dark rod at left marked with small blue minus signs held near the sphere; the sphere shows warm amber plus signs clustered on its near side and blue minus signs on its far side. Stage 2: same, plus a thin grey wire running from the sphere down to a ground symbol, with a few blue minus signs shown flowing down the wire. Stage 3: the wire is gone, rod still present, sphere shows only amber plus signs on the near side. Stage 4: rod gone, amber plus signs now spread evenly all around the sphere. Small numerals 1-4 in muted white below each stage. Orange and blue accents only, thin lines, generous dark space, no text labels beyond the numerals.',
    }),
    b('heading', 10, {
      text: 'Back to the comb and the paper',
      level: 2,
      objective: 'Explain an attraction between a charged body and a neutral one, and why it does not last.',
    }),
    b('text', 11, {
      markdown: 'Paper is an insulator, so its charges cannot travel across it. But each molecule can **stretch** a little. The positively charged comb pulls the electrons in each paper molecule slightly towards it and pushes the positive parts slightly away.\n\nSo the paper\'s near face becomes slightly negative and its far face slightly positive. Equal amounts — but **not equal distances**. The negative charge is nearer the comb than the positive charge, and electric force weakens sharply with distance. The attraction on the near side wins.\n\nNet result: a neutral object is pulled towards a charged one. This works for either sign of comb, which is why it never seems to fail.\n\nAnd why does it stop? The comb\'s charge slowly leaks away — through moist air, through your hand, to the earth. On a humid day it barely works at all, because the air is conducting the charge away almost as fast as you generate it.',
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The same effect, scaled up, cleans the air in power stations. An **electrostatic precipitator** charges the smoke particles going up a chimney, then pulls them onto oppositely charged collecting plates — removing a large fraction of the ash before it ever reaches the sky.\n\nAnd the same effect is why a fuel tanker drags a metal chain along the road. Fuel sloshing in a moving tank charges the tank by friction. A spark from that charge next to petrol vapour is a disaster, so the chain earths the charge away continuously.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F). Left half: a tall industrial chimney interior in dim grey line art, with grey smoke particles being drawn sideways onto two vertical amber-glowing collecting plates; a few particles rendered as small warm dots with plus signs. Right half: a simple fuel tanker silhouette in dim grey with a thin amber chain trailing to the road surface, and a faint orange glow where it touches. Muted white minimal labels, thin lines, orange accent, generous dark space.',
    }),
    b('text', 13, {
      markdown: 'Next: we can now put charge where we want it. Time to calculate the force it produces.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A metal sphere hanging on a thread is first attracted to a positively charged rod. It touches the rod and immediately flies away. Why?',
          ['It takes positive charge on contact, and like charges repel', 'The thread swung it away after the impact', 'Touching neutralised the rod completely', 'The sphere became negatively charged on contact'],
          0,
          'Before contact the neutral sphere is attracted by induction. On contact it is charged by conduction, so it now carries the same sign as the rod — and like charges repel. Attraction then repulsion is the classic signature of "neutral, then charged by contact".',
          2),
        q('Charging by induction gives a body a charge that is',
          ['opposite in sign to the inducing charge', 'the same sign as the inducing charge', 'always positive', 'zero, since no contact occurs'],
          0,
          'The inducing charge drives the like charges away to earth and leaves the unlike ones behind. Contact gives you the same sign; induction gives you the opposite sign. That difference is the fastest way to tell the two methods apart in a question.',
          1),
        q('The comb-and-paper attraction works whether the comb is positive or negative. This is because',
          ['the near face of the paper always ends up oppositely charged', 'paper carries a small permanent negative charge of its own', 'the paper gains charge by contact with the surrounding air', 'gravity assists the electric force here'],
          0,
          'The comb re-arranges charge inside each paper molecule, and it always pulls the opposite charge nearer to itself. Whichever sign the comb has, the near face ends up opposite — so the attraction is guaranteed.',
          3),
      ],
    }),
  ],
};

// ── p3 · Coulomb's Law ───────────────────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'coulombs-law',
  title: "Coulomb's Law",
  subtitle: 'The inverse-square law that runs everything that follows',
  glossary: [
    { term: 'point charge', definition: 'A charged body whose size is negligible compared with the distances involved, so all its charge can be treated as sitting at one point.' },
    { term: 'permittivity of free space', definition: 'The constant $ \\varepsilon_0 = 8.854 \\times 10^{-12} $ C²/N·m² that sets the strength of the electric force in vacuum.' },
    { term: 'inverse-square law', definition: 'A law in which the quantity falls as one over the square of the distance — double the separation and the force drops to a quarter.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Coulomb measured the force between two charged spheres in 1785 using a torsion balance — a fibre that twists by a measurable angle when pushed. He deliberately used spheres that were **tiny compared with the distance between them**.\n\nWhy did that detail matter so much that he built the whole experiment around it?',
      hint: 'If the spheres were large, which distance would you even put in the formula?',
      reveal: 'Because "the distance between two charges" is only a well-defined number if the charges sit at **points**.\n\nOn a big sphere, some of the charge is nearer and some is farther, and there is no single $ r $ to use. Shrink the spheres and every part of one is essentially the same distance from every part of the other — so a single $ r $ becomes honest.\n\nThat is why the law is stated for **point charges**, and why "small compared with the separation" is part of the law, not a footnote.',
    }),
    b('text', 1, {
      markdown: 'Coulomb found that the force between two point charges:\n\n- acts along the **line joining** them,\n- is proportional to the **product** of the charges,\n- falls as the **inverse square** of the distance,\n- is **repulsive** for like signs and **attractive** for unlike signs.\n\nPut together:',
    }),
    b('latex_block', 2, {
      latex: 'F_e = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{|q_1 q_2|}{r^{2}} = k\\,\\frac{|q_1 q_2|}{r^{2}}',
      label: "Coulomb's law (in vacuum)",
      note: 'Use the magnitudes here and read the direction off the signs separately — it is far safer than trying to make one formula do both jobs.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Two constants show up in that one line, and they are the same number wearing different clothes.',
    }),
    b('table', 4, {
      caption: 'The two constants, and the two forms of the same number.',
      headers: ['Symbol', 'Name', 'Value'],
      rows: [
        ['$ k = \\frac{1}{4\\pi\\varepsilon_0} $', 'Coulomb constant', '$ 9.0 \\times 10^{9} $ N·m²/C² (use this in problems)'],
        ['$ \\varepsilon_0 $', 'Permittivity of free space', '$ 8.854 \\times 10^{-12} $ C²/N·m²'],
      ],
    }),
    b('text', 5, {
      markdown: 'Why carry two constants for one idea? Because $ k $ is convenient *here*, and $ \\varepsilon_0 $ is convenient almost everywhere later — Gauss\'s law, capacitance and the energy density in a field all come out cleaner with $ \\varepsilon_0 $ in them. The $ 4\\pi $ you are "wasting" now is the $ 4\\pi $ of a sphere\'s surface, and it will cancel beautifully when you meet Gauss.\n\nThe value of $ k $ is known to absurd precision — it is defined in terms of the speed of light, which itself is a defined number. That is a level of accuracy no ordinary measurement could reach.',
    }),
    b('heading', 6, {
      text: 'Four things the formula quietly tells you',
      level: 2,
      objective: 'Read four physical consequences directly out of the formula, without doing a calculation.',
    }),
    b('text', 7, {
      markdown: '**It is a Newton\'s-third-law pair.** The two charges push or pull each other with equal and opposite forces — even when one charge is a thousand times the other. The bigger charge does not push harder.\n\n**It is a strictly two-body law.** The force between $ q_1 $ and $ q_2 $ does not care what other charges are around. A third charge adds its own force; it does not modify this one. That independence is what makes the next page possible.\n\n**The force is conservative.** Work done moving a charge between two points is path-independent — which is why potential energy will exist at all when we get to it in Chapter 2.\n\n**Inverse-square is brutal.** Double the distance and the force drops to a quarter. Treble it and you are at a ninth. Most wrong answers in this chapter come from students who scaled the force linearly with distance.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'quantitative',
      prompt: 'Two charges attract with a force $ F $. Both charges are then doubled, and the separation is also doubled. What is the new force?',
      options: ['$ F $', '$ 2F $', '$ 4F $', '$ F/2 $'],
      reveal: '**$ F $ — completely unchanged.**\n\n$ F \\propto \\frac{q_1 q_2}{r^{2}} $. Doubling both charges multiplies the top by 4. Doubling the separation multiplies the bottom by 4. They cancel exactly.\n\nGet into the habit of doing these as **ratios**, not by recomputing. In an exam, "what happens to $ F $ if…" questions are pure scaling — never plug in $ 9 \\times 10^{9} $ for those.',
      difficulty_level: 2,
    }),
    b('heading', 9, {
      text: 'The vector form — for when you need the direction too',
      level: 2,
      objective: 'Write the force on one charge due to another using position vectors, and get the direction automatically.',
    }),
    b('text', 10, {
      markdown: 'When charges sit at given coordinates, you want the answer as a vector rather than "magnitude and angle". If $ \\vec{r}_1 $ and $ \\vec{r}_2 $ are the position vectors of $ q_1 $ and $ q_2 $, the force **on** $ q_1 $ **due to** $ q_2 $ is',
    }),
    b('latex_block', 11, {
      latex: '\\vec{F}_1 = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q_1 q_2}{|\\vec{r}_1-\\vec{r}_2|^{3}}\\,(\\vec{r}_1-\\vec{r}_2)',
      label: 'Coulomb force in vector form',
      note: 'Substitute the charges WITH their signs. The cube in the denominator is not a typo — one power of r turns the difference vector into a unit vector, and the other two are the inverse square.',
    }),
    b('text', 12, {
      markdown: 'Two habits make this reliable:\n\n1. **Put the signs in.** If the product $ q_1q_2 $ comes out negative, the formula automatically flips the direction to attraction. You do not decide the direction — the algebra does.\n2. **Stop once you have $ \\hat{i},\\hat{j},\\hat{k} $ components.** There is no need to convert back to a magnitude and an angle unless the question asks for it.',
    }),
    b('worked_example', 13, {
      label: 'the smallest possible electric force',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'What is the smallest possible electric force between two charges placed 1.0 m apart?',
      solution: 'For $ F_e = k\\frac{q_1q_2}{r^{2}} $ to be as small as possible with $ r $ fixed, the product $ q_1q_2 $ must be as small as possible.\n\nThis is where quantisation earns its keep. Charge cannot be made arbitrarily small — the least either charge can be is one elementary charge:\n\n$ (q_1)_{\\min} = (q_2)_{\\min} = e = 1.6 \\times 10^{-19}\\ \\text{C} $\n\nSo\n\n$ (F_e)_{\\min} = \\frac{(9.0 \\times 10^{9})(1.6 \\times 10^{-19})(1.6 \\times 10^{-19})}{(1.0)^{2}} = 2.304 \\times 10^{-28}\\ \\text{N} $\n\nNotice the shape of this problem: a question about *force* was really a question about *quantisation*. Without it there would be no smallest force at all.',
    }),
    b('image', 14, {
      src: '',
      alt: "Coulomb's torsion balance and a graph of force against separation showing the inverse-square falloff",
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'A twisted fibre measures a force too small to weigh — and the result falls as one over r squared.',
      generation_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a torsion balance drawn in thin dim-grey line art — a tall glass cylinder, a fine vertical fibre hanging from the top, a horizontal insulating rod suspended from it with a small warm amber sphere at one end, and a second fixed amber sphere close by; a small curved orange arrow shows the rod twisting. Right panel: a graph with thin dim-grey axes labelled r horizontally and F vertically in muted white, carrying a steep amber curve falling like one over r squared, with two faint dashed guide lines marking that doubling r drops F to a quarter. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('callout', 15, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ F = k\\frac{|q_1q_2|}{r^{2}} $ with $ k = 9 \\times 10^{9} $ SI units. Magnitudes in the formula, direction from the signs.\n- Equal and opposite on the two charges, whatever their sizes.\n- Unaffected by other charges nearby — that is what lets you superpose.\n- Scaling questions ("what if $ r $ doubles?") are ratio problems. Never plug in numbers for those.',
    }),
    b('text', 15, {
      markdown: 'Next: real problems never have just two charges. Time to add forces up.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A charge $ +Q $ and a charge $ +4Q $ are a distance $ d $ apart. Compare the magnitudes of the forces they exert on each other.',
          ['They are equal', 'The force on $ +Q $ is four times larger', 'The force on $ +4Q $ is four times larger', 'The force on $ +Q $ is sixteen times larger'],
          0,
          'Coulomb\'s law is symmetric in $ q_1 $ and $ q_2 $, and the pair obeys Newton\'s third law. Both charges feel $ k(4Q^2)/d^2 $. The larger charge does not feel a larger force — a very common wrong instinct.',
          2),
        q('The force on $ q_1 $ due to $ q_2 $ is $ (4\\hat{i} - 3\\hat{j}) $ N. The force on $ q_2 $ due to $ q_1 $ is',
          ['$ (-4\\hat{i} + 3\\hat{j}) $ N', '$ (4\\hat{i} - 3\\hat{j}) $ N', '$ (3\\hat{i} - 4\\hat{j}) $ N', '$ (-3\\hat{i} + 4\\hat{j}) $ N'],
          0,
          'Newton\'s third law: same magnitude, exactly opposite direction. Reverse the sign of every component and nothing else changes.',
          1),
        q('Two point charges are moved from a separation $ r $ to a separation $ 3r $. The force becomes',
          ['one ninth of its original value', 'one third of its original value', 'three times its original value', 'nine times its original value'],
          0,
          'Inverse square: $ F \\propto 1/r^2 $, so tripling $ r $ divides the force by $ 3^2 = 9 $. Answering "one third" means you used $ 1/r $ instead of $ 1/r^2 $ — the single most common slip on this law.',
          1),
      ],
    }),
  ],
};

// ── p4 · Superposition — More Than Two Charges ───────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'superposition-more-than-two-charges',
  title: 'Superposition — More Than Two Charges',
  subtitle: 'Add the forces as vectors, one pair at a time',
  glossary: [
    { term: 'principle of superposition', definition: 'The total force on a charge is the vector sum of the separate forces each other charge would exert on it alone.' },
    { term: "Lami's theorem", definition: 'For three concurrent forces in equilibrium, each force divided by the sine of the angle between the other two is the same for all three.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'There is something genuinely surprising hiding in this page, and it is easy to walk past.\n\nWhen you bring a third charge near a pair, the force between the original two **does not change at all**. Not slightly. Not at all. The third charge adds its own force and leaves the others exactly as they were.\n\nNature did not have to work this way. Many forces do not — put a third body into a fluid flow and everything changes. Electrostatics is linear, and that single fact is why the whole of this subject can be done by adding.',
    }),
    b('text', 1, {
      markdown: 'The **principle of superposition**: to find the net force on one charge, work out the force each other charge would exert on it *as if the others were not there*, then add those forces **as vectors**.',
    }),
    b('latex_block', 2, {
      latex: '\\vec{F}_{\\text{net}} = \\vec{F}_1 + \\vec{F}_2 + \\cdots + \\vec{F}_n',
      label: 'Superposition of electric forces',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The word doing the work is **vectors**. Students lose marks here not because they cannot use Coulomb\'s law, but because they add three magnitudes arithmetically and forget the angles.\n\nSo, before any numbers, always do this: **draw the forces on the charge you care about**, each along the line to the other charge, arrow pointing the right way for attraction or repulsion. Half the problem is solved once that picture is correct.',
    }),
    b('heading', 4, {
      text: 'Two ways to add them — and when to pick which',
      level: 2,
      objective: 'Choose between the parallelogram method and the components method for a given arrangement.',
    }),
    b('comparison_card', 5, {
      title: 'Adding two Coulomb forces',
      columns: [
        {
          heading: 'Parallelogram / triangle method',
          points: [
            'Use when there are exactly **two** forces and you know the angle between them',
            '$ F_{\\text{net}} = \\sqrt{F_1^{2}+F_2^{2}+2F_1F_2\\cos\\theta} $',
            '$ \\tan\\alpha = \\frac{F_2\\sin\\theta}{F_1+F_2\\cos\\theta} $ gives the direction',
            'Fastest for symmetric shapes — triangles, two-charge problems',
          ],
        },
        {
          heading: 'Component method',
          points: [
            'Use when there are **three or more** forces, or the geometry is given as coordinates',
            'Write each force in $ \\hat{i},\\hat{j} $ form, add all $ x $-components, add all $ y $-components',
            'Never needs a cosine rule and never needs an angle between forces',
            'Scales to any number of charges without getting harder',
          ],
        },
      ],
    }),
    b('worked_example', 6, {
      label: 'three charges on an equilateral triangle',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Charges $ q_1 = 1\\ \\mu\\text{C} $, $ q_2 = -2\\ \\mu\\text{C} $ and $ q_3 = 3\\ \\mu\\text{C} $ sit at the vertices of an equilateral triangle of side 1.0 m. Find the net electric force on $ q_1 $.',
      solution: '**First, the picture.** $ q_2 $ is negative, so it **attracts** $ q_1 $ — that force points from $ q_1 $ towards $ q_2 $. $ q_3 $ is positive, so it **repels** $ q_1 $ — that force points from $ q_3 $ away, i.e. along $ q_3q_1 $ extended.\n\n**Magnitudes.**\n\n$ F_1 = \\frac{(9.0 \\times 10^{9})(1.0 \\times 10^{-6})(2.0 \\times 10^{-6})}{(1.0)^{2}} = 1.8 \\times 10^{-2}\\ \\text{N} $\n\n$ F_2 = \\frac{(9.0 \\times 10^{9})(1.0 \\times 10^{-6})(3.0 \\times 10^{-6})}{(1.0)^{2}} = 2.7 \\times 10^{-2}\\ \\text{N} $\n\n**The angle between them.** Each interior angle of an equilateral triangle is $ 60^\\circ $. The attraction runs along $ q_1 \\to q_2 $ and the repulsion runs *away* from $ q_3 $, so the two force arrows are separated by $ 180^\\circ - 60^\\circ = 120^\\circ $, not $ 60^\\circ $. **This is the step that decides the answer.**\n\n**Add them.**\n\n$ F_{\\text{net}} = \\sqrt{F_1^{2}+F_2^{2}+2F_1F_2\\cos 120^\\circ} $\n\n$ = \\sqrt{(1.8)^{2}+(2.7)^{2}+2(1.8)(2.7)\\left(-\\tfrac{1}{2}\\right)} \\times 10^{-2} $\n\n$ = \\sqrt{3.24+7.29-4.86}\\times 10^{-2} = 2.38 \\times 10^{-2}\\ \\text{N} $\n\n**Direction.**\n\n$ \\tan\\alpha = \\frac{F_2\\sin 120^\\circ}{F_1+F_2\\cos 120^\\circ} = \\frac{(2.7)(0.87)}{1.8+(2.7)(-0.5)} \\Rightarrow \\alpha = 79.2^\\circ $\n\nSo the net force is $ 2.38 \\times 10^{-2} $ N at $ 79.2^\\circ $ to the line $ q_1q_2 $.\n\n**Watch-out.** If you had used $ 60^\\circ $ instead of $ 120^\\circ $ you would have got $ 3.9 \\times 10^{-2} $ N — a completely different answer from one geometric slip. Always draw the arrows before you reach for the cosine rule.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'spatial',
      prompt: 'Three **equal** positive charges $ q $ sit at the vertices of an equilateral triangle of side $ a $. What is the magnitude of the force on any one of them?',
      options: ['$ \\sqrt{3}\\,\\frac{kq^{2}}{a^{2}} $', '$ 2\\frac{kq^{2}}{a^{2}} $', '$ \\frac{kq^{2}}{a^{2}} $', 'Zero, by symmetry'],
      reveal: '**$ \\sqrt{3}\\,kq^{2}/a^{2} $.**\n\nEach of the other two charges repels with $ F = kq^{2}/a^{2} $, and the two repulsions are separated by $ 60^\\circ $ (both point away from the other vertices, and here that keeps the interior angle).\n\n$ F_{\\text{net}} = \\sqrt{F^{2}+F^{2}+2F^{2}\\cos 60^\\circ} = F\\sqrt{2+1} = \\sqrt{3}\\,F $\n\n"Zero by symmetry" is the trap. The arrangement is symmetric about the centre, so the force at the **centre** would be zero — but a corner is not the centre. There is no symmetry at a vertex to cancel anything, and the net force points outward along the line from the centre through that vertex.',
      difficulty_level: 3,
    }),
    b('image', 8, {
      src: '',
      alt: 'Force diagram for three charges on an equilateral triangle, showing the 120 degree angle between the two force arrows',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'The two force arrows on the corner charge are 120° apart, not 60°. Draw before you calculate.',
      generation_prompt: 'Clean scientific vector diagram on a near-black background (#0B0C0F). An equilateral triangle drawn in thin dim-grey lines, vertices marked with small circles: bottom-left warm amber labelled q1, bottom-right cool blue labelled q2, top warm amber labelled q3. From the bottom-left vertex, two bold orange force arrows: one pointing along the edge towards the blue vertex, one pointing away from the top vertex direction (down-left). A muted white arc between the two arrows labelled 120 degrees. A faint dashed resultant arrow between them. Minimal labels in muted white, generous dark space, orange accent, no clutter.',
    }),
    b('heading', 9, {
      text: "When the charge is in equilibrium — Lami's theorem",
      level: 2,
      objective: 'Solve a three-force equilibrium problem without resolving into components.',
    }),
    b('text', 10, {
      markdown: 'A very common setup: a charged ball hangs on a string near another charge, so exactly **three** forces act — tension, weight and the electric force — and the ball is in equilibrium.\n\nYou *can* resolve into horizontal and vertical components. But with exactly three concurrent forces there is a faster route. **Lami\'s theorem** says that if $ \\vec{F}_1+\\vec{F}_2+\\vec{F}_3 = 0 $, then',
    }),
    b('latex_block', 11, {
      latex: '\\frac{F_1}{\\sin\\alpha} = \\frac{F_2}{\\sin\\beta} = \\frac{F_3}{\\sin\\gamma}',
      label: "Lami's theorem",
      note: 'α is the angle between the OTHER two forces (the two that are not F₁), and so on. Getting that pairing right is the whole of the theorem.',
    }),
    b('text', 12, {
      markdown: 'It is worth having because in these problems you usually want a **ratio** — "by what factor does the force change?" — and Lami gives you the ratio in one line, with the tension cancelling out on its own. You will see exactly that on the next page.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Draw the force arrows on the target charge **first**. Attraction points towards; repulsion points away.\n- Two forces with a known angle → parallelogram formula. Three or more, or coordinates given → components.\n- The angle in $ \\cos\\theta $ is the angle between the **force arrows**, not between the sides of the triangle.\n- A charge at a **vertex** of a symmetric shape is not in a symmetric position. Only the centre is.',
    }),
    b('text', 14, {
      markdown: 'Next: what happens to all of this when the charges are not in vacuum — and how to find the spot where the force vanishes.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('Three charges $ +q $ sit at three corners of a square of side $ a $. A charge $ -q $ is placed at the centre. The magnitude of the force on the central charge is',
          ['$ \\frac{2kq^{2}}{a^{2}} $', 'zero', '$ \\frac{4kq^{2}}{a^{2}} $', '$ \\frac{kq^{2}}{a^{2}} $'],
          0,
          'Two of the three corners are diagonally opposite each other, and their pulls on the centre are equal and exactly opposite — they cancel. Only the third corner is left. Its distance to the centre is $ a/\\sqrt{2} $, so the force is $ kq^{2}/(a/\\sqrt{2})^{2} = 2kq^{2}/a^{2} $.',
          3),
        q('Superposition works for electric forces because',
          ['each pair of charges interacts independently of the others', 'electric forces between charges are always attractive', 'charge is quantised in whole multiples of $ e $', 'all the forces involved have the same magnitude'],
          0,
          'Superposition is a statement that the interactions are independent and add linearly — bringing up a third charge leaves the original pair\'s force untouched. Quantisation and the sign of the force have nothing to do with it.',
          2),
        q('While adding two Coulomb forces of $ 3 $ N and $ 4 $ N acting on the same charge, the largest possible resultant is',
          ['$ 7 $ N', '$ 5 $ N', '$ 12 $ N', '$ 1 $ N'],
          0,
          'A vector sum is largest when the two forces are parallel, giving $ 3+4 = 7 $ N; smallest when antiparallel, giving $ 1 $ N. The value $ 5 $ N is what you get at right angles — a real possibility, but not the maximum.',
          2),
      ],
    }),
  ],
};

// ── p5 · In a Medium, and Where the Force Vanishes ───────────────────────────
const p5 = {
  page_number: 5,
  slug: 'medium-and-equilibrium',
  title: 'In a Medium, and Where the Force Vanishes',
  subtitle: 'Dielectric constant, null points, and equilibrium problems',
  glossary: [
    { term: 'dielectric constant', definition: 'The factor $ K $ by which a medium weakens the electric force compared with vacuum. Also called relative permittivity.' },
    { term: 'null point', definition: 'A point where the net electric force (or field) from a group of charges is exactly zero.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two charged balls hang from a common point on strings, repelling each other so that each string makes an angle $ \\theta $ with the vertical.\n\nNow lower the whole arrangement into a tank of oil. The electric force between the balls definitely gets weaker. So what happens to $ \\theta $?',
      hint: 'The electric force is not the only thing the oil changes.',
      reveal: 'It depends on the oil — and in the classic problem, **$ \\theta $ does not change at all**.\n\nThe oil weakens the electric force by a factor $ K $. But the oil also pushes up on the balls with an **upthrust**, which weakens their effective weight. If both are reduced in the same proportion, the angle is untouched.\n\nThat is the whole trick of these problems: in a liquid, **two** forces change, not one. Miss the upthrust and you get a wrong answer every time.',
    }),
    b('heading', 1, {
      text: 'Charges in a medium',
      level: 2,
      objective: 'Adjust Coulomb\'s law for a medium and say what physically causes the weakening.',
    }),
    b('text', 2, {
      markdown: 'Coulomb\'s law as we stated it is for **vacuum**. Put a dielectric — oil, water, mica — in the space between the charges and the force gets weaker.\n\nWhy? The medium\'s molecules are themselves polarised by the field of the charges, exactly as the paper molecules were on page 2. The charge that appears on the surface of each molecule sets up its own field pointing **against** the original one, partly cancelling it.\n\nIf the medium fills all the space around the charges, the force falls by a fixed factor:',
    }),
    b('latex_block', 3, {
      latex: "F' = \\frac{F}{K} = \\frac{1}{4\\pi\\varepsilon_0 K}\\cdot\\frac{q_1q_2}{r^{2}} = \\frac{1}{4\\pi\\varepsilon}\\cdot\\frac{q_1q_2}{r^{2}}",
      label: 'Coulomb force in a medium',
      note: 'K is the dielectric constant (relative permittivity); ε = ε₀K is the permittivity of the medium. K has no units, and K = 1 for vacuum.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'Some values worth carrying: air is about $ 1.0006 $, so we treat it as vacuum without apology. Mica is around 6, and water is about **80** — which is exactly why salt dissolves in water. The water reduces the attraction between $ \\text{Na}^{+} $ and $ \\text{Cl}^{-} $ by a factor of eighty, and that is enough for thermal motion to pull the crystal apart.',
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'Two charges are $ r $ apart in vacuum. They are now placed in a medium of dielectric constant $ K = 4 $. By how much must the separation change so that the force returns to its original value?',
      options: ['Reduce it to $ r/2 $', 'Reduce it to $ r/4 $', 'Increase it to $ 2r $', 'Increase it to $ 4r $'],
      reveal: '**Reduce it to $ r/2 $.**\n\nThe medium divides the force by $ K = 4 $. To win that factor of 4 back you need $ 1/r^{2} $ to grow by 4, which means $ r $ must **halve** — because the force goes as the inverse *square*.\n\nThis is the standard "equivalent vacuum distance" idea: a separation $ r $ in a medium of constant $ K $ behaves like a separation $ r\\sqrt{K} $ in vacuum. Halving here is the same statement read backwards.',
      difficulty_level: 3,
    }),
    b('worked_example', 6, {
      label: 'two hanging balls, dipped in a liquid',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two identical balls of density $ \\rho $ hang from a common point on two insulating strings of equal length. They carry equal charges, and in equilibrium each string makes an angle $ \\theta $ with the vertical. Both balls are now immersed in a liquid of density $ \\sigma $, and the angle $ \\theta $ is found to be unchanged. Find the dielectric constant of the liquid.',
      solution: 'Each ball is in equilibrium under exactly **three** forces — tension $ T $, the electric force $ F_e $, and the weight $ W $. Three concurrent forces means Lami\'s theorem.\n\n**In air.** The angle between $ W $ and $ T $ is $ 90^\\circ + \\theta $, and between $ F_e $ and $ T $ is $ 180^\\circ - \\theta $, so\n\n$ \\frac{W}{\\sin(90^\\circ+\\theta)} = \\frac{F_e}{\\sin(180^\\circ-\\theta)} \\quad\\Rightarrow\\quad \\frac{W}{\\cos\\theta} = \\frac{F_e}{\\sin\\theta} $\n\n**In the liquid.** Two things change. The electric force becomes $ F_e\' = F_e/K $, and the weight becomes an *effective* weight $ W\' = W - \\text{upthrust} $. The angle is the same, so the same relation holds:\n\n$ \\frac{W\'}{\\cos\\theta} = \\frac{F_e\'}{\\sin\\theta} $\n\n**Divide one by the other.** The $ \\sin\\theta $ and $ \\cos\\theta $ vanish, and so does the tension — which never even had to be written down:\n\n$ \\frac{W}{W\'} = \\frac{F_e}{F_e\'} = K $\n\n**Now put the fluid physics in.** With $ V $ the volume of a ball, $ W = V\\rho g $ and the upthrust is $ V\\sigma g $, so $ W\' = V\\rho g - V\\sigma g $:\n\n$ K = \\frac{V\\rho g}{V\\rho g - V\\sigma g} = \\frac{\\rho}{\\rho-\\sigma} $\n\n**Sanity check.** A denser liquid (larger $ \\sigma $) gives a larger $ K $ — which is right, because a liquid that supports the balls more must also be screening the charges more if the angle is to stay put. And if $ \\sigma \\to 0 $, $ K \\to 1 $: no liquid, no screening.',
    }),
    b('heading', 7, {
      text: 'Null points — where the force is exactly zero',
      level: 2,
      objective: 'Locate the point on the line joining two charges at which a third charge feels no force.',
    }),
    b('text', 8, {
      markdown: 'Put a test charge somewhere on the line joining two charges. Where can the two forces on it cancel?\n\nThe two forces must be **opposite in direction** and **equal in magnitude**. That gives you two separate questions, and you must answer them in order:\n\n**Where can they be opposite?**\n\n- **Like charges** (both positive, or both negative): only **between** them. Outside, both forces push the same way.\n- **Unlike charges**: only **outside**, on the line beyond the **smaller** charge. Between them both forces point the same way.\n\n**Where are they equal?** Set the magnitudes equal:\n\n$ \\frac{kq_1}{r_1^{2}} = \\frac{kq_2}{r_2^{2}} \\quad\\Rightarrow\\quad \\frac{r_1}{r_2} = \\sqrt{\\frac{q_1}{q_2}} $\n\nThe null point is always **nearer the smaller charge** — it has to be, to make up for being smaller.',
    }),
    b('worked_example', 9, {
      label: 'finding the null point',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two positive point charges $ q_1 = 16\\ \\mu\\text{C} $ and $ q_2 = 4\\ \\mu\\text{C} $ are 3.0 m apart in vacuum. Find the point on the line between them where a test charge would feel no net force.',
      solution: '**Which region?** Both charges are positive, so the two forces can only oppose each other **between** them. Good — the question already told us to look there.\n\n**Which side of the middle?** Nearer the $ 4\\ \\mu\\text{C} $ charge, because the smaller charge needs help from a shorter distance to match the bigger one.\n\nLet the point be $ r_1 $ from $ q_1 $ and $ r_2 $ from $ q_2 $. Equating magnitudes:\n\n$ \\frac{kq_1}{r_1^{2}} = \\frac{kq_2}{r_2^{2}} \\quad\\Rightarrow\\quad \\frac{r_1}{r_2} = \\sqrt{\\frac{q_1}{q_2}} = \\sqrt{\\frac{16}{4}} = 2 $\n\nAlso $ r_1 + r_2 = 3.0 $ m. Solving the two together:\n\n$ r_1 = 2.0\\ \\text{m}, \\qquad r_2 = 1.0\\ \\text{m} $\n\nSo the null point is 2.0 m from the $ 16\\ \\mu\\text{C} $ charge and 1.0 m from the $ 4\\ \\mu\\text{C} $ charge — closer to the smaller one, as predicted.\n\n**Note what never appeared:** the sign or size of the test charge. A null point is a property of the *arrangement*, not of whatever you put there.',
    }),
    b('callout', 10, {
      variant: 'warning',
      title: 'The trap in unlike-charge null points',
      markdown: 'For **unlike** charges the null point lies **outside**, beyond the smaller charge — and students routinely place it between them.\n\nQuick test before you calculate: stand at the proposed point and ask which way each force pushes. If both arrows point the same way, no amount of algebra will make them cancel, and a "solution" you get there is an artefact of squaring.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Two number lines showing where the null point lies for like charges and for unlike charges',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Like charges: null point in between. Unlike charges: outside, beyond the smaller one.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two horizontal number lines stacked with generous spacing. Top line: two warm amber circles marked with plus signs, a larger one at left and smaller at right, with a small hollow marker between them nearer the smaller one, and two short opposing orange arrows at that marker. Bottom line: one warm amber circle with a plus at left and a smaller cool blue circle with a minus at right, with the hollow marker placed outside to the right of the blue circle, again with two short opposing orange arrows. Thin dim-grey lines, muted white minimal labels, orange accent, generous dark space, no clutter.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: "- In a medium, $ F' = F/K $, and $ \\varepsilon = \\varepsilon_0K $. Water's $ K \\approx 80 $ is why ionic solids dissolve in it.\n- In a **liquid**, the weight changes too — always subtract the upthrust.\n- Three concurrent forces in equilibrium → Lami's theorem, and the tension usually cancels itself out.\n- Null point: decide the **region** from the signs first, then use $ r_1/r_2 = \\sqrt{q_1/q_2} $. Always nearer the smaller charge.",
    }),
    b('text', 13, {
      markdown: 'Next: we stop asking "what force does this charge feel?" and start asking "what has this charge done to the space around it?" That question gives us the electric field.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('Charges $ +9\\ \\mu\\text{C} $ and $ +1\\ \\mu\\text{C} $ are 4 cm apart. The null point on the line joining them is',
          ['3 cm from the $ 9\\ \\mu\\text{C} $ charge', '2 cm from each', '1 cm from the $ 9\\ \\mu\\text{C} $ charge', '3 cm from the $ 1\\ \\mu\\text{C} $ charge'],
          0,
          '$ r_1/r_2 = \\sqrt{9/1} = 3 $, and $ r_1+r_2 = 4 $ cm, so $ r_1 = 3 $ cm and $ r_2 = 1 $ cm. The point sits 3 cm from the larger charge — that is, only 1 cm from the smaller one, which is where it must be.',
          2),
        q('The force between two charges in vacuum is $ F $. When a slab of dielectric constant $ K $ completely surrounds them, the force becomes',
          ['$ F/K $', '$ KF $', '$ F/K^{2} $', 'unchanged'],
          0,
          'The polarised medium sets up a field opposing the original one, weakening the force by exactly the factor $ K $. Note that $ K > 1 $ always, so the force can only get smaller, never larger.',
          1),
        q('Two identical charged balls hang in air at an angle $ \\theta $ to the vertical. They are lowered into a liquid whose density is *half* that of the balls, and $ \\theta $ stays the same. The dielectric constant of the liquid is',
          ['2', '4', '$ 1/2 $', '80'],
          0,
          'Using $ K = \\rho/(\\rho-\\sigma) $ with $ \\sigma = \\rho/2 $: $ K = \\rho/(\\rho - \\rho/2) = \\rho/(\\rho/2) = 2 $. The result depends only on the density ratio — the charges and the string length never enter.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p1, p2, p3, p4, p5]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
