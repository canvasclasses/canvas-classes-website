'use strict';
/**
 * Class 12 Physics · Ch.4 "Magnetic Properties of Matter" — pages 1–4.
 * Poles and field lines, the magnetic dipole moment, the field of a bar magnet,
 * and a magnet in a uniform field.
 *
 * NOTATION (NCERT Class 12 convention, used throughout this chapter):
 *   m = magnetic dipole MOMENT (A·m²)
 *   M = MAGNETISATION, i.e. moment per unit volume (A/m)
 * Many coaching books write M for the moment. p2 flags this explicitly so a
 * student meeting the other convention is not derailed by it.
 *
 * Run: node scripts/physics12-book/build_ch4_a_magnets.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 4;

// ── p1 · Poles, and Why They Never Come Alone ────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'poles-and-why-they-never-come-alone',
  title: 'Poles, and Why They Never Come Alone',
  subtitle: 'The one experiment nobody has ever managed',
  glossary: [
    { term: 'magnetic pole', definition: 'A region of a magnet where its field appears to emerge from or enter. Poles always occur in north-south pairs.' },
    { term: 'magnetic monopole', definition: 'A hypothetical isolated north or south pole. None has ever been observed.' },
    { term: 'magnetic field line', definition: 'A curve drawn so that its tangent gives the direction of $ \\vec{B} $ at each point. Magnetic field lines always form closed loops.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Chapter 1 opened with a charge you could hold on its own: a positive charge, all by itself, with no negative charge attached.\n\nNow take a bar magnet and cut it in half, hoping to separate the north pole from the south. What do you get?',
      hint: 'Try cutting each half again. And again.',
      reveal: '**Two complete magnets**, each with its own north and south pole. Cut those and you get four. Cut down to a single atom and it is still a tiny magnet with two poles.\n\nNobody has ever isolated a north pole. Not once, in two centuries of trying, and not for want of looking — there are still experiments running today searching for one.\n\nThat single fact is the deepest difference between electricity and magnetism, and almost everything on this page is a consequence of it.',
    }),
    b('text', 1, {
      markdown: 'Magnetic poles come in pairs, always. And the reason is that a magnet is not really made of poles at all — it is made of **circulating currents**, at the atomic scale. A current loop has two faces, and you cannot have a loop with only one face.\n\nThat is the honest picture. But "poles" is a convenient bookkeeping device, so we keep it — as long as we remember that the north pole of a bar magnet is a *region*, not a particle.\n\nThe basic behaviour is the same as for charges:\n\n> **Like poles repel, unlike poles attract.**\n\nAnd the field is defined by what it does to a moving charge, which Chapter 5 will make precise. For now, $ \\vec{B} $ is the **magnetic field** (also called magnetic induction or flux density), measured in **tesla** (T).',
    }),
    b('heading', 2, {
      text: 'Field lines that close on themselves',
      level: 2,
      objective: 'State the rules for magnetic field lines and say which one differs from the electric case.',
    }),
    b('text', 3, {
      markdown: 'Magnetic field lines follow most of the same rules as electric ones — tangent gives the direction, density gives the strength, they never cross. But one rule is completely different, and it is the important one:\n\n> **Magnetic field lines always form closed loops.** They have no beginning and no end.\n\nOutside a bar magnet they run from N to S. Inside the magnet they run from S back to N, completing the loop. So a magnetic field line is a continuous circuit, threading through the magnet and out again.\n\nCompare that with Chapter 1: **electric** field lines start on positive charges and end on negative ones, and can never close. They can do that because isolated charges exist. Magnetic lines close because isolated poles do not.',
    }),
    b('comparison_card', 4, {
      title: 'Electric field lines against magnetic field lines',
      columns: [
        {
          heading: 'Electric ($ \\vec{E} $)',
          points: [
            'Start on $ + $ charge, end on $ - $ charge',
            'Never form closed loops',
            'Because isolated charges **do** exist',
            'Zero inside a conductor in equilibrium',
            'Net flux through a closed surface $ = q_{\\text{in}}/\\varepsilon_0 $',
          ],
        },
        {
          heading: 'Magnetic ($ \\vec{B} $)',
          points: [
            'No start and no end — always closed loops',
            'N to S outside the magnet, S to N inside it',
            'Because isolated poles do **not** exist',
            'Passes right through the material',
            'Net flux through **any** closed surface $ = 0 $, always',
          ],
        },
      ],
    }),
    b('text', 5, {
      markdown: 'That last row is worth stating on its own, because it is one of the four Maxwell equations:',
    }),
    b('latex_block', 6, {
      latex: '\\oint_S \\vec{B}\\cdot d\\vec{S} = 0 \\qquad \\text{for every closed surface}',
      label: "Gauss's law for magnetism",
      note: 'Not "q_in/ε₀ with q_in = 0 by accident" — it is exactly zero always, because there is no magnetic charge to enclose.',
      highlight: true,
    }),
    b('text', 7, {
      markdown: 'Read that against the electric version. There, the flux told you how much charge was inside. Here it tells you nothing, because there is nothing to tell — every line that enters a closed surface must leave again, since it has nowhere to terminate.\n\nSo enclose a whole bar magnet, or just its north end, or half of it: the net magnetic flux is zero every time.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'spatial',
      prompt: 'A closed surface is drawn so that it encloses **only the north pole** of a bar magnet, cutting through the middle of the magnet. What is the net magnetic flux through it?',
      options: ['Zero', 'Positive, since only the north pole is inside', 'Negative', 'It depends on the pole strength'],
      reveal: '**Zero.**\n\nIt is tempting to think that enclosing "only a north pole" should give an outward flux, exactly as enclosing a positive charge gives an outward electric flux. But the analogy breaks here, and the reason is the whole theme of this page.\n\nThe field lines emerging from the north end outside the magnet are the **same lines** that pass back through the magnet\'s middle. Your surface cuts through the magnet, so those lines enter through the cut and leave through the north end. Everything that goes out came in.\n\n**There is no such thing as "enclosing only a pole" in the way you can enclose only a charge.** That is what $ \\oint\\vec{B}\\cdot d\\vec{S} = 0 $ is telling you.',
      difficulty_level: 3,
    }),
    b('image', 9, {
      src: '',
      alt: 'Field lines of a bar magnet forming closed loops through the magnet, beside the same magnet cut in two',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The lines run N to S outside and S to N inside, closing the loop. Cut the magnet and each piece is complete.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a horizontal bar magnet with its left half cool blue marked S and its right half warm amber marked N, surrounded by smooth dim-orange field lines that leave the amber end, curve round outside and re-enter the blue end, with a few lines shown continuing straight through the inside of the bar from blue to amber so the loops are visibly closed. Right panel: the same magnet drawn cut into two pieces with a small gap between them, each piece now showing its own blue S end and amber N end, with its own set of closed field lines. Muted white minimal labels, generous dark space, orange and blue accents only.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The closed-loop rule is why a **magnetic shield** works differently from an electric one.\n\nChapter 1 shielded a region from an electric field by surrounding it with a conductor, which cancelled the field to exactly zero. You cannot do that magnetically, because there is no magnetic charge to rearrange.\n\nInstead, a magnetic shield **redirects**. Wrap the region in a material of very high permeability — **mu-metal**, a nickel-iron alloy — and the field lines strongly prefer to travel through the metal rather than the air inside. They are channelled round the cavity like water round a rock.\n\nSo an electric shield blocks; a magnetic shield diverts. It is why the shielding cans inside sensitive instruments are made of mu-metal and not copper, and why the field inside is greatly reduced but never quite zero.',
      image_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). A vertical cross-section showing a thick ring of grey metal labelled mu-metal enclosing an empty circular cavity. Horizontal dim-orange field lines approach from the left, and as they meet the ring they bend sharply to run around inside the metal wall, crowding densely within it, then rejoin and continue horizontally on the right. The cavity interior is almost free of lines, with just one or two very faint ones. A small muted-white label reads diverted, not blocked. Generous dark space, orange accent, no clutter.',
    }),
    b('text', 11, {
      markdown: 'Next: if a magnet is really two poles a fixed distance apart, then it is a **dipole** — and we already know how to describe those.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('A bar magnet is cut into two equal pieces perpendicular to its length. Each piece',
          ['is a complete magnet with both poles', 'has only a north pole', 'has only a south pole', 'loses its magnetism entirely'],
          0,
          'New poles appear at the cut faces, so each piece is a full magnet. This is a direct consequence of magnetism arising from atomic current loops rather than from isolated magnetic charges.',
          1),
        q('The net magnetic flux through any closed surface is',
          ['always exactly zero', 'proportional to the pole strength enclosed', 'zero only if no magnet is inside', 'proportional to the magnetic field strength'],
          0,
          'Magnetic field lines form closed loops with nowhere to terminate, so whatever enters a closed surface must leave it. This is Gauss\'s law for magnetism, and it holds whether or not a magnet is inside.',
          2),
        q('Inside a bar magnet, the magnetic field lines run',
          ['from the south pole to the north pole', 'from the north pole to the south pole', 'in no particular direction', 'in closed loops that do not enter the magnet'],
          0,
          'Outside they run N to S; to close the loop they must run S to N inside the material. This is exactly what makes them continuous curves with no beginning or end.',
          2),
      ],
    }),
  ],
};

// ── p2 · The Magnetic Dipole Moment ──────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'the-magnetic-dipole-moment',
  title: 'The Magnetic Dipole Moment',
  subtitle: 'One vector that describes a whole magnet',
  glossary: [
    { term: 'magnetic dipole moment', definition: 'The vector $ \\vec{m} $ describing a magnet or current loop: for a bar magnet, pole strength times separation, directed from S to N.' },
    { term: 'pole strength', definition: 'A measure of how strongly a pole of a magnet attracts, $ q_m $, measured in ampere-metres.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Chapter 1 spent three pages on the electric dipole — two equal and opposite charges a fixed distance apart, described by a single vector $ \\vec{p} $.\n\nA bar magnet is the magnetic version of exactly that. And the payoff is enormous: **every formula you derived for the electric dipole has a magnetic twin**, with $ \\vec{p} \\to \\vec{m} $ and $ \\vec{E} \\to \\vec{B} $.\n\nSo this page and the next two are, in a real sense, revision. The physics is new; the mathematics is not.',
    }),
    b('text', 1, {
      markdown: 'Treat a bar magnet as two poles of strength $ q_m $, separated by a distance $ 2l $. Its **magnetic dipole moment** is',
    }),
    b('latex_block', 2, {
      latex: '\\vec{m} = q_m\\,(2l)\\,\\hat{n}',
      label: 'Magnetic dipole moment of a bar magnet',
      note: 'Unit: A·m². Direction: from the SOUTH pole to the NORTH pole — inside the magnet, along its axis.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Compare it line for line with the electric case:\n\n- $ \\vec{p} = q(2a) $, directed from $ -q $ to $ +q $\n- $ \\vec{m} = q_m(2l) $, directed from S to N\n\nSame structure. The direction convention is the analogue too: $ \\vec{p} $ points to the positive charge, $ \\vec{m} $ points to the north pole.\n\nThe pole strength $ q_m $ is measured in **ampere-metres**, which looks odd until you see the next section — the unit is a clue that magnetism is really about currents.',
    }),
    b('callout', 4, {
      variant: 'warning',
      title: 'A notation clash worth knowing about',
      markdown: 'This book follows the NCERT convention:\n\n- **$ m $** is the magnetic **moment** (A·m²)\n- **$ M $** is the **magnetisation** — moment per unit volume (A/m), which arrives on p7\n\nMany coaching books and reference texts use **$ M $ for the moment** and $ I $ for the magnetisation. Both conventions are in wide use, and neither is wrong.\n\nSo when you read a formula elsewhere, **check the units**: A·m² means it is a moment, A/m means it is a magnetisation. That check never fails, whatever letters the author chose.',
    }),
    b('heading', 5, {
      text: 'A current loop is a magnetic dipole too',
      level: 2,
      objective: 'State the moment of a current loop, and why a magnet and a loop are the same kind of object.',
    }),
    b('text', 6, {
      markdown: 'A flat coil of $ N $ turns, each of area $ A $, carrying current $ I $, is also a magnetic dipole. Its moment is\n\n$ m = N I A $\n\nand its direction is given by the right-hand rule: curl your fingers the way the current flows, and your thumb points along $ \\vec{m} $ — out of the face that behaves as a north pole.\n\n**This is the connection that unifies the whole subject.** A bar magnet and a current loop are not two different things that happen to behave alike. A bar magnet *is* a vast collection of atomic current loops, mostly lined up.\n\nWe will **derive** $ m = NIA $ in Chapter 5, once the force on a current-carrying wire is available. For now take it as a promise, and notice that the units work: an ampere times a square metre is A·m², exactly the unit of $ \\vec{m} $.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A bar magnet of moment $ m $ is cut into two equal halves **perpendicular** to its length. What is the moment of each half? And what if it had been cut **along** its length instead?',
      options: [
        '$ m/2 $ in both cases',
        '$ m/2 $ for the perpendicular cut, $ m $ for the lengthwise cut',
        '$ m $ for the perpendicular cut, $ m/2 $ for the lengthwise cut',
        '$ m/4 $ in both cases',
      ],
      reveal: '**$ m/2 $ in both cases** — which is a genuinely satisfying result.\n\n*Cut perpendicular to the length:* the pole strength $ q_m $ is unchanged (the cut faces have the same area), but the length is halved. So $ m\' = q_m \\times l = m/2 $.\n\n*Cut along the length:* now the length $ 2l $ is unchanged, but each piece has half the cross-section, so its pole strength is halved. So $ m\' = (q_m/2)(2l) = m/2 $.\n\nDifferent mechanisms, same answer — because in both cases you ended up with half the material.\n\nThat is the general rule: **cut a magnet into $ n $ equal pieces, any way you like, and each piece has moment $ m/n $.** It makes sense from the atomic picture: the moment is the sum of the atomic moments, so half the atoms means half the moment.',
      difficulty_level: 3,
    }),
    b('heading', 8, {
      text: 'A caution about real bar magnets',
      level: 2,
      objective: 'Explain why the effective length of a bar magnet is less than its physical length.',
    }),
    b('text', 9, {
      markdown: 'The two-pole picture treats the magnetism as concentrated at two points. A real magnet is magnetised throughout its volume, so its poles are spread out near the ends rather than sitting at them.\n\nThe consequence is that the **effective magnetic length** — the $ 2l $ in the formula — is a little shorter than the physical length of the bar. For a typical uniform bar magnet it is about **0.84** times the geometric length.\n\nYou will rarely need that number, but you should know why it exists: the pole model is an approximation, useful because it makes the mathematics identical to the electric dipole. When high precision is needed, physicists abandon poles entirely and work with the current-loop picture instead.',
    }),
    b('image', 10, {
      src: '',
      alt: 'A bar magnet with its dipole moment vector, beside a current loop with its moment given by the right-hand rule',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Two pictures of the same object. The loop version is the honest one; the pole version is the convenient one.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a horizontal bar magnet, left half cool blue marked S and right half warm amber marked N, with a bold orange arrow drawn along its axis pointing from the blue end to the amber end, labelled m in muted white, and a dashed grey dimension line beneath labelled 2l. Right panel: a circular current loop drawn in perspective in thin amber line art with small orange arrows showing the current direction around it, and a bold orange arrow perpendicular to the loop through its centre labelled m, with a faint sketched hand curling in the current direction and thumb along the arrow. Generous dark space.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{m} = q_m(2l) $ for a bar magnet, directed **S to N**. Unit A·m².\n- $ m = NIA $ for a coil, direction by the right-hand rule (derived in Chapter 5).\n- Every electric-dipole formula has a magnetic twin: $ \\vec{p} \\to \\vec{m} $, $ \\vec{E} \\to \\vec{B} $.\n- Cut a magnet into $ n $ equal pieces, any orientation → each has moment $ m/n $.\n- Check units to resolve notation clashes: A·m² is a moment, A/m is a magnetisation.',
    }),
    b('text', 12, {
      markdown: 'Next: cash in the analogy. Two formulas, both of which you have already seen in electric clothing.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic dipole moment of a bar magnet points',
          ['from its south pole to its north pole', 'from its north pole to its south pole', 'perpendicular to its axis', 'along the external field'],
          0,
          'It is the exact analogue of the electric dipole moment, which points from $ -q $ to $ +q $. So $ \\vec{m} $ points towards the north pole, along the axis inside the magnet.',
          1),
        q('The SI unit of magnetic dipole moment is',
          ['A·m$ ^{2} $', 'A·m', 'A/m', 'tesla'],
          0,
          'From $ m = NIA $, an ampere times an area. Note that A·m is the unit of pole strength and A/m is the unit of magnetisation — checking units is the fastest way to tell the three quantities apart.',
          2),
        q('A bar magnet of moment $ m $ is cut into four equal pieces perpendicular to its length. Each piece has a moment of',
          ['$ m/4 $', '$ m $', '$ m/2 $', '$ 4m $'],
          0,
          'The pole strength is unchanged by a perpendicular cut but the length is quartered. More generally, $ n $ equal pieces each carry $ m/n $ whichever way you cut, because each holds a fraction $ 1/n $ of the atomic moments.',
          2),
      ],
    }),
  ],
};

// ── p3 · The Field of a Bar Magnet ───────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'the-field-of-a-bar-magnet',
  title: 'The Field of a Bar Magnet',
  subtitle: 'The electric dipole results, translated',
  glossary: [
    { term: 'axial position', definition: 'A point on the line through both poles of the magnet, extended outwards. Also called end-on.' },
    { term: 'equatorial position', definition: 'A point on the perpendicular bisector of the magnet. Also called broadside-on.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'In Chapter 1 you found that at equal distances from an electric dipole, the axial field is exactly **twice** the equatorial field, and the two point in opposite senses relative to $ \\vec{p} $.\n\nWithout doing any new work, what would you predict for a bar magnet?',
      hint: 'What did the derivation actually depend on?',
      reveal: '**Exactly the same: a factor of two, and opposite directions.**\n\nAnd the reason you can predict it is that the electric derivation used only two things — an inverse-square field from each pole, and the geometry of two poles a fixed distance apart. Both are true here.\n\nSo the whole result carries over with $ \\frac{1}{4\\pi\\varepsilon_0} $ replaced by $ \\frac{\\mu_0}{4\\pi} $ and $ p $ replaced by $ m $. That substitution is the entire content of this page.',
    }),
    b('text', 1, {
      markdown: 'The constant that plays the role of $ 1/4\\pi\\varepsilon_0 $ is $ \\mu_0/4\\pi $, where $ \\mu_0 $ is the **permeability of free space**:\n\n$ \\frac{\\mu_0}{4\\pi} = 10^{-7}\\ \\text{T·m/A} $\n\nThat is an exact and very convenient number — no awkward $ 9\\times10^{9} $ to remember.\n\nWith that, the two standard results are:',
    }),
    b('latex_block', 2, {
      latex: 'B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2m}{d^{3}}, \\qquad B_{\\text{equatorial}} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{m}{d^{3}}',
      label: 'Field of a short bar magnet',
      note: 'Axial field is PARALLEL to m. Equatorial field is ANTIPARALLEL to m. Ratio exactly 2 : 1 at equal d.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The exact expressions, before assuming the magnet is short compared with the distance, are also direct translations:\n\n$ B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2md}{(d^{2}-l^{2})^{2}}, \\qquad B_{\\text{equatorial}} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{m}{(d^{2}+l^{2})^{3/2}} $\n\nNotice the signs inside the brackets: **minus** for axial, **plus** for equatorial. That is not arbitrary — on the axis the two poles are at different distances $ d-l $ and $ d+l $, while on the bisector both are at $ \\sqrt{d^{2}+l^{2}} $. The algebra remembers the geometry.',
    }),
    b('table', 4, {
      caption: 'The complete translation table. Learn the left column once and the right column is free.',
      headers: ['Electric dipole', 'Magnetic dipole'],
      rows: [
        ['$ \\vec{p} $, from $ -q $ to $ +q $', '$ \\vec{m} $, from S to N'],
        ['$ \\frac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9} $', '$ \\frac{\\mu_0}{4\\pi} = 10^{-7} $'],
        ['$ E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^{3}} $', '$ B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi}\\frac{2m}{d^{3}} $'],
        ['$ E_{\\perp} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^{3}} $', '$ B_{\\perp} = \\frac{\\mu_0}{4\\pi}\\frac{m}{d^{3}} $'],
        ['$ \\vec{\\tau} = \\vec{p}\\times\\vec{E} $', '$ \\vec{\\tau} = \\vec{m}\\times\\vec{B} $'],
        ['$ U = -\\vec{p}\\cdot\\vec{E} $', '$ U = -\\vec{m}\\cdot\\vec{B} $'],
      ],
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'At a point $ d $ from the centre of a short bar magnet, on its axis, the field is $ B $. What is the field at a distance $ d $ on the equatorial line, and at $ 2d $ on the axis?',
      options: [
        '$ B/2 $ on the equator; $ B/8 $ on the axis',
        '$ 2B $ on the equator; $ B/8 $ on the axis',
        '$ B/2 $ on the equator; $ B/4 $ on the axis',
        '$ B/2 $ on the equator; $ B/2 $ on the axis',
      ],
      reveal: '**$ B/2 $ on the equator, and $ B/8 $ on the axis at $ 2d $.**\n\n*Position change:* axial to equatorial at the same distance divides by 2. So $ B/2 $.\n\n*Distance change:* the dipole field goes as $ 1/d^{3} $, so doubling the distance divides by $ 2^{3} = 8 $. So $ B/8 $.\n\nBoth are pure translations of what you did with electric dipoles in Chapter 1, and the same discipline applies: **handle the position change and the distance change as two separate factors.** Trying to combine them in one step is where errors come from.\n\nAnd remember the directions differ too — the equatorial field is antiparallel to $ \\vec{m} $ while the axial one is parallel.',
      difficulty_level: 2,
    }),
    b('worked_example', 6, {
      label: 'the field of a small bar magnet',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A short bar magnet has a magnetic moment of $ 0.48\\ \\text{A·m}^{2} $. Find the magnitude and direction of the magnetic field at a point $ 10 $ cm from its centre, (a) on its axis and (b) on its equatorial line.',
      solution: '**(a) On the axis.**\n\n$ B = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2m}{d^{3}} = (10^{-7})\\cdot\\frac{2(0.48)}{(0.10)^{3}} $\n\n$ = (10^{-7})\\cdot\\frac{0.96}{10^{-3}} = (10^{-7})(960) = 9.6\\times10^{-5}\\ \\text{T} $\n\nDirection: **parallel to $ \\vec{m} $**, i.e. from the south pole towards the north pole.\n\n**(b) On the equatorial line.**\n\nHalf as much, by the factor-of-two result:\n\n$ B = 4.8\\times10^{-5}\\ \\text{T} $\n\nDirection: **antiparallel to $ \\vec{m} $**.\n\n**A sense of scale.** The Earth\'s own field is about $ 4\\times10^{-5} $ T, so this small magnet produces a comparable field at $ 10 $ cm — which is exactly why a compass needle is so easily disturbed by any magnet nearby, and why the next few pages will need to combine the two fields.\n\n**Watch the conversion.** $ d = 10\\ \\text{cm} = 0.10\\ \\text{m} $, and it is **cubed**. Leaving it in centimetres would be wrong by a factor of $ 10^{6} $.',
    }),
    b('image', 7, {
      src: '',
      alt: 'A bar magnet with the axial field arrow parallel to m and the equatorial field arrow antiparallel to m',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Axial field along m and twice as strong; equatorial field against m. Identical to the electric dipole.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). At centre, a small horizontal bar magnet with a cool blue S end at left and a warm amber N end at right, and a short bold orange arrow along its axis labelled m in muted white. To the right along the axis, at a marked distance, a long bold orange arrow pointing right labelled B axial. Directly above the magnet at a similar distance, a shorter orange arrow pointing LEFT labelled B equatorial. Thin dashed grey radius lines from the magnet centre to each arrow, both marked d. Faint dim-orange field-line loops in the background. Generous dark space.',
    }),
    b('callout', 8, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\frac{\\mu_0}{4\\pi} = 10^{-7} $ exactly. Far friendlier than the electric constant.\n- $ B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi}\\frac{2m}{d^{3}} $, **along** $ \\vec{m} $.\n- $ B_{\\text{equatorial}} = \\frac{\\mu_0}{4\\pi}\\frac{m}{d^{3}} $, **against** $ \\vec{m} $.\n- Both go as $ 1/d^{3} $. Ratio $ 2:1 $ at equal distance.\n- Exact forms: $ (d^{2}-l^{2})^{2} $ on the axis, $ (d^{2}+l^{2})^{3/2} $ on the equator. Minus for axial, plus for equatorial.\n- Convert cm to m **before** cubing.',
    }),
    b('text', 9, {
      markdown: 'Next: put the magnet in somebody else\'s field and watch it turn — and then oscillate, which turns out to be a way of measuring the field.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic field of a short bar magnet varies with distance as',
          ['$ 1/d^{3} $', '$ 1/d^{2} $', '$ 1/d $', '$ 1/d^{4} $'],
          0,
          'It is a dipole field, so it falls one power faster than an inverse-square field — the two poles nearly cancel at large distances. This matches the electric dipole exactly.',
          1),
        q('At equal distances from a short bar magnet, the ratio of the axial field to the equatorial field is',
          ['2 : 1', '1 : 2', '1 : 1', '4 : 1'],
          0,
          'The same factor of two as for an electric dipole, and for the same geometric reason: on the axis the two poles are at unequal distances so their fields partly reinforce, while on the equator they are equidistant and only a smaller reversed component survives.',
          1),
        q('On the equatorial line of a bar magnet, the direction of $ \\vec{B} $ is',
          ['antiparallel to $ \\vec{m} $', 'parallel to $ \\vec{m} $', 'perpendicular to $ \\vec{m} $', 'zero'],
          0,
          'Both poles are equidistant, so the components perpendicular to $ \\vec{m} $ cancel and what remains points from N back towards S — the reverse of $ \\vec{m} $. Exactly the electric-dipole result translated.',
          2),
      ],
    }),
  ],
};

// ── p4 · A Magnet in a Uniform Field ─────────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'a-magnet-in-a-uniform-field',
  title: 'A Magnet in a Uniform Field',
  subtitle: 'Torque, energy — and an oscillation that measures the field',
  glossary: [
    { term: 'vibration magnetometer', definition: 'An instrument that finds a magnetic field by timing the oscillations of a suspended magnet in it.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Hang a compass needle so it can swing freely and give it a small push. It does not just settle back to north — it **oscillates**, swinging past and returning, for several seconds.\n\nTime those swings and you can calculate the strength of the Earth\'s magnetic field. No field-measuring instrument required; just a stopwatch and a known magnet.\n\nThat is the last result on this page, and it is a lovely piece of physics: a period turned into a field strength.',
    }),
    b('text', 1, {
      markdown: 'Everything here is the electric-dipole page from Chapter 1, translated. So it can be stated briskly.\n\n**Net force is zero.** The north pole feels $ q_mB $ one way and the south pole feels $ q_mB $ the other. Equal and opposite, so the magnet does not translate — in a *uniform* field.\n\n**Torque is not zero.** The two forces act along different lines and form a couple:',
    }),
    b('latex_block', 2, {
      latex: '\\vec{\\tau} = \\vec{m}\\times\\vec{B}, \\qquad |\\vec{\\tau}| = mB\\sin\\theta',
      label: 'Torque on a magnetic dipole',
      note: 'θ is the angle between m and B. Maximum at 90°, zero at 0° and 180°.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: '**Potential energy** follows from integrating that torque:',
    }),
    b('latex_block', 4, {
      latex: 'U = -\\vec{m}\\cdot\\vec{B} = -mB\\cos\\theta',
      label: 'Potential energy of a magnetic dipole in a field',
      note: 'Zero taken at θ = 90°, exactly as for the electric dipole.',
      highlight: true,
    }),
    b('text', 5, {
      markdown: 'And the two equilibrium positions separate the same way as before:\n\n**$ \\theta = 0^\\circ $** — $ \\vec{m} $ along $ \\vec{B} $, $ U = -mB $, the **minimum**. Displace it and a restoring torque brings it back. **Stable.**\n\n**$ \\theta = 180^\\circ $** — $ \\vec{m} $ against $ \\vec{B} $, $ U = +mB $, the **maximum**. Displace it and it flips right round. **Unstable.**\n\nThe work to turn the magnet from $ \\theta_1 $ to $ \\theta_2 $ is the change in $ U $:\n\n$ W = mB\\left(\\cos\\theta_1 - \\cos\\theta_2\\right) $\n\nand a complete flip from stable to unstable costs $ 2mB $ — the largest work any rotation can require.\n\nThis is why a compass needle points north: it is a dipole finding its minimum-energy orientation in the Earth\'s field.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'analogical',
      prompt: 'A bar magnet is placed in a **non-uniform** magnetic field. Does it experience a net force?',
      options: [
        'Yes — the two poles sit in different field strengths',
        'No — the forces on the two poles always cancel',
        'Only if it is aligned with the field',
        'Only if the field is very strong',
      ],
      reveal: '**Yes.**\n\nThe cancellation on this page relied entirely on the word **uniform**: both poles had to sit in the same $ B $ for $ q_mB $ and $ -q_mB $ to cancel. In a non-uniform field they do not, and a net force survives.\n\nWhich is exactly why a magnet **attracts** an iron nail rather than merely twisting it. A magnet\'s own field is strongly non-uniform, so the nail — once magnetised by induction — is pulled towards the region where the field is stronger.\n\nSame structure as the electric case: the comb twisted nothing but *lifted* the paper, because a comb\'s field is non-uniform. Uniform fields twist; non-uniform fields also pull.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Small oscillations — and a way to measure B',
      level: 2,
      objective: 'Derive the period of a suspended magnet and use it to find a field strength.',
    }),
    b('text', 8, {
      markdown: 'Displace the magnet by a small angle $ \\theta $ from the stable position. The restoring torque is $ -mB\\sin\\theta $, and for small $ \\theta $ we can write $ \\sin\\theta \\approx \\theta $:\n\n$ \\tau = -mB\\,\\theta $\n\nA restoring torque proportional to the angular displacement is exactly the condition for **angular simple harmonic motion**. Comparing with $ \\tau = -k\\theta $ gives $ k = mB $, and the standard period formula $ T = 2\\pi\\sqrt{\\mathcal{I}/k} $ gives',
    }),
    b('latex_block', 9, {
      latex: 'T = 2\\pi\\sqrt{\\frac{\\mathcal{I}}{mB}}',
      label: 'Period of a suspended magnet in a field',
      note: 'Here 𝓘 is the MOMENT OF INERTIA of the magnet about the suspension axis — not a current. For a uniform bar of mass M and length L: 𝓘 = ML²/12.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'Now read that formula as an instrument. Everything in it except $ B $ can be measured on a bench: $ \\mathcal{I} $ from the magnet\'s mass and dimensions, $ m $ from a separate experiment, and $ T $ with a stopwatch. So\n\n$ B = \\frac{4\\pi^{2}\\mathcal{I}}{mT^{2}} $\n\nThat is the **vibration magnetometer**, and it is how the horizontal component of the Earth\'s field was measured long before electronic instruments existed.\n\nTwo things worth noticing in the formula. A **stronger** field gives a **shorter** period — the restoring torque is bigger, so the magnet snaps back faster. And $ B \\propto 1/T^{2} $, so timing many oscillations and dividing (rather than timing one) pays off twice over in precision.',
    }),
    b('worked_example', 11, {
      label: 'finding a field from a period',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A bar magnet of moment $ 1.6\\ \\text{A·m}^{2} $ and moment of inertia $ 2.0\\times10^{-4}\\ \\text{kg·m}^{2} $ is suspended in a uniform horizontal field and makes $ 20 $ complete oscillations in $ 44 $ s. Find the field strength.',
      solution: '**The period first.** Always divide the total time by the number of oscillations, never time a single swing:\n\n$ T = \\frac{44}{20} = 2.2\\ \\text{s} $\n\n**Rearrange for $ B $:**\n\n$ T = 2\\pi\\sqrt{\\frac{\\mathcal{I}}{mB}} \\quad\\Rightarrow\\quad T^{2} = \\frac{4\\pi^{2}\\mathcal{I}}{mB} \\quad\\Rightarrow\\quad B = \\frac{4\\pi^{2}\\mathcal{I}}{mT^{2}} $\n\n**Substitute:**\n\n$ B = \\frac{4\\pi^{2}(2.0\\times10^{-4})}{(1.6)(2.2)^{2}} = \\frac{7.90\\times10^{-3}}{7.74} $\n\n$ B = 1.02\\times10^{-3}\\ \\text{T} $\n\nAbout a millitesla — some twenty-five times the Earth\'s field, so this is a laboratory magnet rather than the Earth.\n\n**Why 20 oscillations and not one.** A stopwatch reading is uncertain by perhaps $ 0.2 $ s however careful you are. Over one swing of $ 2.2 $ s that is a 9% error in $ T $, and since $ B \\propto 1/T^{2} $, an 18% error in $ B $. Over 20 swings the same $ 0.2 $ s is a 0.5% error in $ T $ and 1% in $ B $. **Timing many periods is not fussiness; it is the difference between a measurement and a guess.**',
    }),
    b('image', 12, {
      src: '',
      alt: 'A magnet at an angle in a uniform field showing the couple, and a suspended magnet oscillating about the field direction',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Equal and opposite forces on different lines make a couple. Displace the magnet and it oscillates.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, with evenly spaced horizontal dim-orange field arrows running left to right across both. Left panel: a bar magnet tilted about 40 degrees to the field, cool blue S end and warm amber N end joined by a thin grey body, with a bold orange force arrow pointing right at the amber end and left at the blue end, and a curved amber arrow showing the resulting rotation; a small arc marks the angle theta to the field. Right panel: the same magnet hanging from a fine thread at the top, drawn in three faint overlapping positions to suggest swinging either side of the field direction, with a small curved double-headed arrow beneath and a muted white label reading T equals two pi root I over mB. Generous dark space.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Uniform field: net force **zero**, torque $ \\vec{\\tau} = \\vec{m}\\times\\vec{B} $, magnitude $ mB\\sin\\theta $.\n- $ U = -mB\\cos\\theta $. Stable at $ 0^\\circ $ ($ U = -mB $), unstable at $ 180^\\circ $ ($ U = +mB $).\n- Work to rotate: $ W = mB(\\cos\\theta_1 - \\cos\\theta_2) $; a full flip costs $ 2mB $.\n- **Non-uniform** field → there **is** a net force. That is why magnets attract iron.\n- Small oscillations: $ T = 2\\pi\\sqrt{\\mathcal{I}/mB} $, so $ B = 4\\pi^{2}\\mathcal{I}/mT^{2} $. Stronger field, shorter period.\n- Always time many oscillations and divide.',
    }),
    b('text', 14, {
      markdown: 'Next: the biggest magnet you will ever stand on. And it is tilted.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('A bar magnet in a uniform magnetic field experiences',
          ['a torque but no net force', 'a net force but no torque', 'both a net force and a torque', 'neither'],
          0,
          'The forces on the two poles are equal and opposite, so they cancel — but they act along different lines, forming a couple. In a **non-uniform** field the two poles feel different field strengths and a net force appears.',
          1),
        q('The period of small oscillations of a suspended magnet is $ T $. If it is moved to a region where the field is four times stronger, the new period is',
          ['$ T/2 $', '$ 2T $', '$ T/4 $', '$ 4T $'],
          0,
          '$ T \\propto 1/\\sqrt{B} $, so quadrupling $ B $ halves $ T $. A stronger field means a bigger restoring torque, so the magnet snaps back faster.',
          2),
        q('The work required to turn a magnet from its stable to its unstable orientation in a field $ B $ is',
          ['$ 2mB $', '$ mB $', 'zero', '$ mB/2 $'],
          0,
          'Stable means $ U = -mB $ and unstable means $ U = +mB $, so the change is $ 2mB $. This is the largest work any rotation of the magnet can require.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p1, p2, p3, p4]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
