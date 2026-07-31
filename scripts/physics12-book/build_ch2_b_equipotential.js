'use strict';
/**
 * Class 12 Physics · Ch.2 "Capacitance" — pages 5–7.
 * Equipotential surfaces, the energy of a system of charges, and what a
 * conductor looks like in the potential language.
 *
 * Run: node scripts/physics12-book/build_ch2_b_equipotential.js
 */
const { b, q, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 2;

// ── p5 · Equipotential Surfaces ──────────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'equipotential-surfaces',
  title: 'Equipotential Surfaces',
  subtitle: 'The contour map of the electric landscape',
  glossary: [
    { term: 'equipotential surface', definition: 'A surface on which the electric potential has the same value at every point.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Walk around a hill along a contour line and you neither climb nor descend — so you do no work against gravity, however far you walk.\n\nAn **equipotential surface** is the electrical version of a contour line, and the same conclusion holds: you can carry a charge anywhere on one, by any route, and the work done is exactly zero.\n\nThat single fact makes these surfaces the most useful picture in the chapter.',
    }),
    b('text', 1, {
      markdown: 'An **equipotential surface** is one on which $ V $ has the same value everywhere. Two properties follow immediately, and both come straight from $ W = q(V_A - V_B) $ and $ E = -dV/dr $.\n\n**No work is done moving along one.** Every point has the same $ V $, so $ V_A - V_B = 0 $ and $ W = 0 $. The path taken makes no difference at all.\n\n**The field is always perpendicular to one.** If $ \\vec{E} $ had any component *along* the surface, then moving a charge that way would do work — and we have just shown it cannot. So the field must meet every equipotential at exactly $ 90^\\circ $.',
    }),
    b('latex_block', 2, {
      latex: '\\vec{E} \\perp \\text{equipotential surface, always}',
      label: 'The rule that solves most equipotential questions',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Two more consequences, both regularly examined:\n\n**Two equipotential surfaces can never intersect.** At a crossing point the potential would have to have two different values at once — which is meaningless. (Compare the field-line version of this argument from Chapter 1: field lines cannot cross because the *direction* would be doubled. Same logic, different quantity.)\n\n**Where the surfaces crowd together, the field is strong.** Closely spaced contours mean $ V $ changes rapidly over a short distance, and $ E = -dV/dr $ is therefore large. On a hill, crowded contours mean a cliff.',
    }),
    b('table', 4, {
      caption: 'The standard shapes. Each is simply "the surface everywhere perpendicular to the field lines".',
      headers: ['Charge arrangement', 'Equipotential surfaces', 'Spacing (for equal steps in $ V $)'],
      rows: [
        ['Single point charge', 'Concentric **spheres** centred on the charge', 'Get further apart as $ r $ grows (field weakens)'],
        ['Uniform field (parallel plates)', 'Parallel **planes** perpendicular to the field', 'Evenly spaced — the field is constant'],
        ['Infinite line charge', 'Coaxial **cylinders**', 'Get further apart with distance'],
        ['Electric dipole', 'Non-spherical closed surfaces, plus the flat **bisector plane** at $ V = 0 $', 'Crowded near each charge'],
        ['Any conductor in equilibrium', 'Its **own surface** — and its whole volume', '—'],
      ],
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'spatial',
      prompt: 'A student sketches equipotential surfaces around a point charge as spheres that are **equally spaced** for equal steps in $ V $. What is wrong?',
      options: [
        'They should get further apart with distance, because the field weakens',
        'They should get closer together with distance, because $ V $ falls off',
        'They should not be spheres at all, but flattened along the field direction',
        'Nothing is wrong — equal steps in $ V $ always mean equally spaced surfaces',
      ],
      reveal: '**They must spread out as you go further away.**\n\nThe spacing of equipotentials is set by the field strength: $ \\Delta V \\approx E\\,\\Delta r $, so for a fixed step $ \\Delta V $, a **weaker** field needs a **larger** $ \\Delta r $.\n\nAround a point charge the field falls as $ 1/r^{2} $, so the surfaces are packed tight close in and spread out further away.\n\nEqually spaced equipotentials mean a **uniform** field — which is exactly what you get between parallel plates, and only there.',
      difficulty_level: 2,
    }),
    b('image', 6, {
      src: '',
      alt: 'Equipotential surfaces for a point charge, a uniform field and a dipole, each with field lines crossing them at right angles',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Field lines in orange, equipotentials dashed. They meet at right angles in every case.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), three panels side by side separated by thin grey rules. Panel 1: a small warm amber sphere at centre with straight orange field lines radiating outward and dashed dim-grey concentric circles crossing them at right angles, the circles noticeably further apart as they get bigger. Panel 2: two horizontal plates, upper amber and lower blue, with evenly spaced straight vertical orange field arrows between them and evenly spaced dashed horizontal grey lines crossing them. Panel 3: a dipole — an amber plus sphere and a blue minus sphere — with curved orange field lines looping between them and dashed grey closed curves crossing them perpendicularly, plus one straight vertical dashed line through the centre marked V equals zero. Muted white minimal labels, generous dark space.',
    }),
    b('heading', 7, {
      text: 'Why every conductor is one big equipotential',
      level: 2,
      objective: 'Explain why the whole volume and surface of a conductor share a single potential.',
    }),
    b('text', 8, {
      markdown: 'Inside a conductor in equilibrium $ \\vec{E} = 0 $. Zero field means zero potential gradient, so $ V $ cannot change anywhere inside — the entire volume is at one value. And since the potential is continuous, the surface is at that same value too.\n\n> **A conductor in electrostatic equilibrium is a single equipotential — surface and interior together.**\n\nThat immediately explains a fact from Chapter 1 that we could only assert there: field lines meet a conductor surface at right angles. The surface is an equipotential, and field lines always cross equipotentials at right angles. Same rule, no new physics.',
    }),
    b('worked_example', 9, {
      label: 'work done round a closed path',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A charge of $ 5\\ \\mu\\text{C} $ is carried from point A to point B along a curved path, then from B back to A along a completely different path. Both A and B lie on the same equipotential surface at $ 200 $ V. Find the total work done.',
      solution: '**Zero** — and there are two independent reasons, which is worth seeing.\n\n**Reason 1: the potentials are equal.** $ W = q(V_A - V_B) $, and A and B are on the same equipotential, so $ V_A = V_B $ and each leg contributes nothing.\n\n**Reason 2: it is a closed path.** Whatever route is taken, the charge ends where it began, so $ V_{\\text{final}} = V_{\\text{initial}} $ and $ W = 0 $. This holds for **any** closed path in **any** electrostatic field, not just this one — it is the conservative property from page 1.\n\n**What the numbers were for.** The $ 5\\ \\mu\\text{C} $ and the $ 200 $ V are both decoration. Neither enters the answer, and spotting that is the skill the question is testing.\n\n**Careful with the variation.** If the question had asked for the work from A to B where the two points were on **different** equipotentials, the value $ q(V_A - V_B) $ would matter — but the *path* still would not.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- No work is done moving a charge along an equipotential surface.\n- $ \\vec{E} $ is perpendicular to every equipotential, always.\n- Two equipotentials can never intersect.\n- Crowded equipotentials → strong field. Evenly spaced → uniform field.\n- A conductor is a single equipotential, inside and on the surface.\n- Work round any closed path in an electrostatic field is zero.',
    }),
    b('text', 11, {
      markdown: 'Next: back to energy, but now for more than two charges — and a counting rule that stops you double-charging for the same pair.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('The work done in moving a charge along an equipotential surface is',
          ['zero, whatever path is taken', 'zero only along a straight path', 'equal to $ qV $', 'maximum for the longest path'],
          0,
          'Every point on the surface has the same $ V $, so $ V_A - V_B = 0 $ and $ W = q(V_A - V_B) = 0 $ — no matter how long or twisted the route.',
          1),
        q('Equipotential surfaces around an isolated point charge are',
          ['concentric spheres that spread out with distance', 'concentric spheres that are equally spaced', 'parallel planes', 'coaxial cylinders'],
          0,
          'Spheres, because $ V = kq/r $ depends only on $ r $. They spread out because the field weakens with distance, so a bigger step in $ r $ is needed for the same step in $ V $. Planes belong to a uniform field and cylinders to a line charge.',
          2),
        q('The angle between an electric field line and an equipotential surface is',
          ['$ 90^\\circ $', '$ 0^\\circ $', '$ 45^\\circ $', 'it varies from point to point'],
          0,
          'Any component of $ \\vec{E} $ along the surface would do work on a charge moving along it — but moving along an equipotential does no work. So the field can have no component along the surface at all.',
          1),
      ],
    }),
  ],
};

// ── p6 · The Energy of a Whole System ────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'the-energy-of-a-whole-system',
  title: 'The Energy of a Whole System',
  subtitle: 'Count every pair — exactly once',
  glossary: [
    { term: 'interaction energy', definition: 'The potential energy of a system of charges, equal to the sum over every distinct pair of charges.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You assemble three charges by bringing them in one at a time from infinity. The first costs nothing (there is nothing there yet). The second costs work against the first. The third costs work against both.\n\nNow assemble the same three in a **different order**. Does the total work change?',
      hint: 'The final arrangement is identical in both cases.',
      reveal: '**No — the total is identical.**\n\nAnd it has to be. The potential energy of a system is a property of the **final arrangement**, not of the history that produced it. If two assembly orders gave different totals, you could assemble one way, disassemble the other, and pocket the difference for ever.\n\nSo there must be a formula that depends only on the final positions. There is, and it is the one rule on this page.',
    }),
    b('text', 1, {
      markdown: 'The energy of a system of charges is the sum of the potential energies of every **distinct pair**:',
    }),
    b('latex_block', 2, {
      latex: 'U = \\sum_{\\text{pairs}} \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q_iq_j}{r_{ij}}',
      label: 'Energy of a system of point charges',
      note: 'Every pair once — never twice. For n charges there are n(n−1)/2 pairs.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Count the pairs before you start writing terms; it is the only place this goes wrong:\n\n- **2 charges** → 1 pair\n- **3 charges** → 3 pairs\n- **4 charges** → 6 pairs\n- **5 charges** → 10 pairs\n\nThe formula is $ n(n-1)/2 $. Getting five terms for four charges means you have missed one; getting twelve means you counted every pair twice.\n\nAnd remember to substitute **signs**. A mixture of positive and negative charges produces terms that partly cancel, and the sign of the total tells you whether the arrangement would fly apart if released.',
    }),
    b('worked_example', 4, {
      label: 'four charges on a square',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Four equal charges $ +q $ are placed at the corners of a square of side $ a $. Find the total electrostatic potential energy of the system.',
      solution: '**Count the pairs first.** Four charges give $ \\frac{4\\times3}{2} = 6 $ pairs — and here they split neatly by distance.\n\n- **4 pairs along the sides**, each a distance $ a $ apart.\n- **2 pairs along the diagonals**, each a distance $ a\\sqrt{2} $ apart.\n\n(Check: $ 4 + 2 = 6 $. Good.)\n\n**Add them up.**\n\n$ U = 4\\times\\frac{kq^{2}}{a} + 2\\times\\frac{kq^{2}}{a\\sqrt{2}} $\n\n$ U = \\frac{kq^{2}}{a}\\left(4 + \\frac{2}{\\sqrt{2}}\\right) = \\frac{kq^{2}}{a}\\left(4 + \\sqrt{2}\\right) $\n\n$ U \\approx 5.41\\,\\frac{kq^{2}}{a} $\n\n**Read the sign.** Positive, as it must be — all four charges repel each other, so work had to be done to assemble them. Release them and they fly apart, converting all $ 5.41\\,kq^{2}/a $ into kinetic energy.\n\n**Watch-out.** Writing $ 6 \\times kq^{2}/a $ — treating all six pairs as being a distance $ a $ apart — is the standard error. The diagonals are longer, so those two terms are smaller.',
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'Three charges $ +q $, $ +q $ and $ -q $ sit at the corners of an equilateral triangle of side $ a $. Is the total potential energy positive, negative, or zero?',
      options: ['Negative', 'Positive', 'Zero', 'It depends on which corner holds the negative charge'],
      reveal: '**Negative.**\n\nThree pairs, all at the same separation $ a $:\n\n- $ (+q, +q) $: $ +\\frac{kq^{2}}{a} $\n- $ (+q, -q) $: $ -\\frac{kq^{2}}{a} $\n- $ (+q, -q) $: $ -\\frac{kq^{2}}{a} $\n\n$ U = \\frac{kq^{2}}{a}(1 - 1 - 1) = -\\frac{kq^{2}}{a} $\n\nTwo attracting pairs beat one repelling pair, so the system is **bound** — you would have to supply energy to pull it apart.\n\nAnd because every side is the same length, it genuinely does not matter which corner holds the negative charge. Change the triangle to a non-equilateral one and it would.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'The shortcut when one charge is being moved',
      level: 2,
      objective: 'Compute the work to move one charge without recomputing the whole system energy.',
    }),
    b('text', 7, {
      markdown: 'A very common question: everything is fixed except one charge, which moves from A to B. What work is needed?\n\nYou could compute $ U $ before and after and subtract — a lot of terms, most of which cancel. Far quicker: all the pairs **not** involving the moving charge are unchanged, so they drop out. What is left is\n\n$ W_{\\text{ext}} = q\\left(V_B - V_A\\right) $\n\nwhere $ V_A $ and $ V_B $ are the potentials at the two points **due to all the other charges**.\n\nSo you only need the potential at two points, and potential is a scalar. This is the single most useful labour-saving move in the chapter.',
    }),
    b('worked_example', 8, {
      label: 'moving one charge to the centre',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two charges $ +Q $ are fixed at two ends of a diagonal of a square of side $ a $. A charge $ +q $ is brought from infinity to the **centre** of the square. How much work must be done?',
      solution: 'Use the shortcut: the two $ +Q $ charges never move, so only the potential at the start and end points of the moving charge matter.\n\n**Potential at infinity:** $ V_A = 0 $, by our choice of zero.\n\n**Potential at the centre**, due to the two fixed charges. Each is half a diagonal away:\n\n$ r = \\frac{a\\sqrt{2}}{2} = \\frac{a}{\\sqrt{2}} $\n\nPotential is a scalar, so add the two contributions arithmetically:\n\n$ V_B = 2 \\times \\frac{kQ}{a/\\sqrt{2}} = \\frac{2\\sqrt{2}\\,kQ}{a} $\n\n**Work required:**\n\n$ W_{\\text{ext}} = q(V_B - V_A) = \\frac{2\\sqrt{2}\\,kQq}{a} $\n\n**Notice what we never did.** We never computed the energy of the two fixed charges with each other. That pair does not change, so it cancels in the difference — and leaving it out of the calculation entirely is exactly what the shortcut buys you.',
    }),
    b('image', 9, {
      src: '',
      alt: 'Four charges on a square with all six pairwise separations marked, four sides and two diagonals',
      width: 'two_third',
      aspect_ratio: '1:1',
      caption: 'Six pairs, two different distances. Count them before you write any terms.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). A square outlined in thin dim-grey lines with a small warm amber sphere marked with a plus at each corner. The four sides are drawn as solid orange connecting lines each labelled a in muted white, and the two diagonals are drawn as dashed orange lines each labelled a root 2. A small muted-white note in a corner of the frame reads 6 pairs. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ U = \\sum_{\\text{pairs}} \\frac{kq_iq_j}{r_{ij}} $ — every pair once. $ n(n-1)/2 $ pairs for $ n $ charges.\n- Put the signs in; a negative total means a bound arrangement.\n- On a square: 4 pairs at $ a $, 2 pairs at $ a\\sqrt{2} $. Not 6 at $ a $.\n- Moving **one** charge from A to B: $ W_{\\text{ext}} = q(V_B - V_A) $, using the potential due to all the others. Never recompute the whole system.\n- $ U $ depends only on the final arrangement, never on the assembly order.',
    }),
    b('text', 11, {
      markdown: 'Next: conductors again — but told entirely in potential, where two results appear that the field language could not reach.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('How many distinct pairs contribute to the potential energy of five point charges?',
          ['10', '5', '20', '25'],
          0,
          '$ n(n-1)/2 = 5\\times4/2 = 10 $. Answering 20 counts every pair twice; answering 25 counts each charge with itself as well.',
          1),
        q('Three charges $ +q $, $ -q $ and $ +q $ are placed at the corners of an equilateral triangle of side $ a $. The total potential energy is',
          ['$ -\\frac{kq^{2}}{a} $', '$ +\\frac{kq^{2}}{a} $', 'zero', '$ -\\frac{3kq^{2}}{a} $'],
          0,
          'All three separations are $ a $. The pair of like charges gives $ +kq^{2}/a $ and the two unlike pairs give $ -kq^{2}/a $ each, so the total is $ -kq^{2}/a $ — a bound system.',
          3),
        q('The electrostatic potential energy of a system of charges depends on',
          ['only the final positions of the charges', 'the order in which they were assembled', 'the path each charge took', 'the speed at which they were brought in'],
          0,
          'The electrostatic force is conservative, so $ U $ is a state function — a property of the arrangement alone. If assembly order changed the answer you could build energy from nothing by assembling one way and dismantling another.',
          2),
      ],
    }),
  ],
};

// ── p7 · Conductors, in the Language of Potential ────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'conductors-in-the-language-of-potential',
  title: 'Conductors, in the Language of Potential',
  subtitle: 'Sharing charge, earthing, and why sparks start at points',
  glossary: [
    { term: 'earthing', definition: 'Connecting a conductor to the earth, which is so large that it holds it at a fixed potential — conventionally taken as zero.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Join a large charged metal sphere to a small uncharged one with a wire, and charge flows until they reach the same potential.\n\nAt that moment the **small** sphere carries less charge — but its surface charge density, and therefore the field just outside it, is **higher**.\n\nThat one result explains lightning conductors, spark plugs, why high-voltage equipment has no sharp corners, and why a Van de Graaff generator is a big smooth sphere. This page derives it in three lines.',
    }),
    b('text', 1, {
      markdown: 'Everything here follows from the result of page 5: **a conductor in equilibrium is a single equipotential.** Its whole volume and its surface sit at one value of $ V $.\n\nFor an isolated charged sphere of radius $ R $ carrying charge $ Q $, that value is easy to write down. Outside, the sphere behaves exactly like a point charge, so at the surface',
    }),
    b('latex_block', 2, {
      latex: 'V = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{Q}{R} \\qquad\\text{everywhere inside and on the sphere}',
      label: 'Potential of a charged conducting sphere',
      note: 'Note the R, not r — inside, the potential stops falling and stays flat at the surface value.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'Connect two conductors — what is shared, and what is not',
      level: 2,
      objective: 'Predict how charge redistributes between two connected spheres, and where the field ends up largest.',
    }),
    b('text', 4, {
      markdown: 'Join two isolated spheres, of radii $ R_1 $ and $ R_2 $, by a thin wire. They now form one conductor, so they must end at the **same potential**:\n\n$ \\frac{kQ_1}{R_1} = \\frac{kQ_2}{R_2} \\qquad\\Rightarrow\\qquad \\frac{Q_1}{Q_2} = \\frac{R_1}{R_2} $\n\n**Charge shares in proportion to radius.** The bigger sphere takes more charge — no surprise.\n\nNow look at the **surface charge density**, $ \\sigma = Q/4\\pi R^{2} $:\n\n$ \\frac{\\sigma_1}{\\sigma_2} = \\frac{Q_1}{Q_2}\\cdot\\frac{R_2^{2}}{R_1^{2}} = \\frac{R_1}{R_2}\\cdot\\frac{R_2^{2}}{R_1^{2}} = \\frac{R_2}{R_1} $\n\n**Density goes as $ 1/R $** — the *opposite* way. And since the field just outside is $ \\sigma/\\varepsilon_0 $, the field is strongest at the **smaller** sphere.',
    }),
    b('latex_block', 5, {
      latex: 'Q \\propto R \\qquad\\text{but}\\qquad \\sigma \\propto \\frac{1}{R} \\qquad\\text{and}\\qquad E \\propto \\frac{1}{R}',
      label: 'Two connected spheres at the same potential',
      note: 'The big sphere holds more charge; the small one has the stronger field at its surface.',
      highlight: true,
    }),
    b('text', 6, {
      markdown: 'This is the precise version of the "sharp points" rule from Chapter 1. A pointed tip is a region of very small radius of curvature — effectively a tiny sphere at the same potential as the rest of the body — so $ \\sigma $ and $ E $ are both large there. Push the field past about $ 3\\times10^{6} $ V/m and the air itself starts to conduct, and charge leaks away.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A sphere of radius $ 10 $ cm and one of radius $ 2 $ cm are joined by a long wire and given a total charge. Which has the greater surface charge density, and by what factor?',
      options: [
        'The small sphere, by a factor of 5',
        'The large sphere, by a factor of 5',
        'The small sphere, by a factor of 25',
        'They are equal, since the spheres are connected',
      ],
      reveal: '**The small sphere, by a factor of 5.**\n\nConnected means equal potential, which gives $ Q \\propto R $ — so the large sphere carries 5 times the charge.\n\nBut density is charge per unit **area**, and the large sphere\'s area is $ 5^{2} = 25 $ times bigger. So:\n\n$ \\frac{\\sigma_{\\text{small}}}{\\sigma_{\\text{large}}} = \\frac{R_{\\text{large}}}{R_{\\text{small}}} = \\frac{10}{2} = 5 $\n\n"By a factor of 25" is the trap — that is the *area* ratio, which you must divide by the *charge* ratio of 5, leaving 5.\n\nThe practical upshot: a spark will start at the small sphere first, even though it holds only a fifth of the charge.',
      difficulty_level: 3,
    }),
    b('image', 8, {
      src: '',
      alt: 'Two spheres of different radii joined by a wire, showing more charge on the large one but denser charge on the small one',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Same potential, different densities. The small sphere sparks first.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). A large circle at left and a small circle at right, both outlined in dim grey and joined by a thin grey wire. Warm amber plus signs sit on both outlines: many but widely spaced around the large circle, fewer but tightly packed around the small circle. Short orange field arrows point outward from both surfaces — short and sparse at the large sphere, long and dense at the small one. A muted white label beneath reads same potential. Generous dark space, orange accent, no clutter.',
    }),
    b('heading', 9, {
      text: 'Earthing — what it really does',
      level: 2,
      objective: 'Say what changes and what does not when a conductor is earthed.',
    }),
    b('text', 10, {
      markdown: '**Earthing** connects a conductor to the ground. The earth is so vast that charge flowing into or out of it changes its potential immeasurably, so we treat it as a fixed reference and call it $ V = 0 $.\n\nSo earthing a conductor forces its potential to zero — and charge flows in or out until that happens.\n\nTwo things students get wrong here:\n\n**Earthing does not always remove all the charge.** It removes exactly as much as is needed to make $ V = 0 $. If other charges are nearby, that may mean charge actually flows *onto* the conductor. (You saw this in Chapter 1: earthing a sphere near a negative rod pulls electrons *off* it, leaving it positive.)\n\n**Zero potential does not mean zero field.** An earthed plate near a charge is at $ V = 0 $, yet the field just outside it can be very large.',
    }),
    b('callout', 11, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'A **Van de Graaff generator** is the "big smooth sphere" rule made into a machine. A moving belt carries charge up to a large metal dome; because the dome is a conductor, the charge immediately spreads to its outer surface, and the belt can keep delivering more.\n\nWhy the dome must be large and smooth: the potential it can reach before the surrounding air breaks down is set by the surface field $ \\sigma/\\varepsilon_0 $, and a large radius keeps $ \\sigma $ low. Any sharp edge, screw head or scratch becomes a tiny-radius region where the field spikes and the charge leaks away — which is why these machines are polished and why their supports are rounded.\n\nThe same reasoning shapes every piece of high-voltage hardware: corona rings on transmission-line insulators, rounded terminals on lab supplies, and no sharp corners anywhere near a high potential.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F). A Van de Graaff generator drawn in thin dim-grey line art: a large smooth metal dome on a slim column, with a belt running up inside the column shown as a dashed loop carrying small warm amber plus signs upward. Amber plus signs spread evenly over the outer surface of the dome, with short sparse orange field arrows pointing outward. To one side, a small inset shows a sharp spike with densely packed plus signs and long bright orange arrows plus a faint violet glow, marked with a small crossed-out symbol in muted white. Generous dark space.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- A conductor is one equipotential; a charged sphere sits at $ V = kQ/R $ throughout.\n- Two connected conductors reach the **same potential**, so $ Q \\propto R $ but $ \\sigma \\propto 1/R $ and $ E \\propto 1/R $.\n- Small radius → high density → strong field → sparks start there.\n- Earthing forces $ V = 0 $ and moves whatever charge that requires — sometimes onto the conductor.\n- $ V = 0 $ never implies $ E = 0 $.',
    }),
    b('text', 13, {
      markdown: 'Next: we have been storing charge on conductors by accident. Time to build a device that does it on purpose.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('Two conducting spheres of radii $ R $ and $ 2R $ are joined by a wire and charged. The ratio of their surface charge densities $ \\sigma_{R} : \\sigma_{2R} $ is',
          ['2 : 1', '1 : 2', '1 : 1', '4 : 1'],
          0,
          'Equal potential gives $ Q \\propto R $, so the big sphere holds twice the charge — but it has four times the area. Density therefore goes as $ 1/R $, making the smaller sphere twice as dense.',
          3),
        q('A charged conductor is earthed. Its potential becomes',
          ['zero', 'equal to its previous value', 'infinite', 'equal to the potential of the nearest charge'],
          0,
          'Earthing ties the conductor to a body so large that its potential is unaffected by any charge exchange, and that reference is taken as zero. Charge flows — in either direction — until the conductor reaches it.',
          1),
        q('The potential inside a charged hollow conducting sphere of radius $ R $ carrying charge $ Q $ is',
          ['$ kQ/R $ everywhere inside', 'zero everywhere inside', '$ kQ/r $, where $ r $ is the distance from the centre', 'largest at the centre'],
          0,
          'The field inside is zero, so the potential cannot change — it stays flat at whatever the surface value is, namely $ kQ/R $. Using $ kQ/r $ would wrongly send the potential to infinity at the centre.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p5, p6, p7]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
