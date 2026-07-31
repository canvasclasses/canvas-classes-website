'use strict';
/**
 * Class 12 Physics · Ch.1 "Electrostatics" — pages 13–16.
 * Electric flux, Gauss's law, the four standard Gauss results, and conductors.
 *
 * Run: node scripts/physics12-book/build_ch1_d_gauss.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 1;

// ── p13 · Electric Flux ──────────────────────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'electric-flux',
  title: 'Electric Flux',
  subtitle: 'Counting the field lines that get through',
  glossary: [
    { term: 'electric flux', definition: 'A measure of how much electric field passes through a surface: $ \\phi = \\int \\vec{E}\\cdot d\\vec{S} $. A scalar, measured in N·m²/C.' },
    { term: 'area vector', definition: 'A vector whose magnitude is the area of a surface and whose direction is perpendicular to it. For a closed surface it points outwards, by convention.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Hold a hoop out of a car window in the rain, with the rain falling straight down. Turn the hoop until it is exactly edge-on to the falling rain.\n\nHow much rain now passes through the hoop?',
      hint: 'The hoop has not got any smaller. Only its orientation changed.',
      reveal: '**None.** The rain slides past the plane of the hoop instead of through it.\n\nSo "how much gets through" depends on **two** things — the size of the hoop, and how it is tilted. That is exactly the idea of **flux**, and it is why a surface in physics is described by a vector and not just a number.\n\nSwap the rain for an electric field and you have this page.',
    }),
    b('text', 1, {
      markdown: 'To capture the tilt, we describe a surface by an **area vector** $ d\\vec{S} $: magnitude equal to the area, direction **perpendicular** to the surface.\n\nThe electric flux through that small patch is then',
    }),
    b('latex_block', 2, {
      latex: 'd\\phi = \\vec{E}\\cdot d\\vec{S} = E\\,dS\\cos\\theta',
      label: 'Electric flux through a small area',
      note: 'θ is the angle between E and the NORMAL to the surface — not between E and the surface itself.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That $ \\cos\\theta $ is the hoop-in-the-rain factor, and its two extremes are worth stating flat out:\n\n- $ \\theta = 0^\\circ $ — field along the normal, i.e. **perpendicular to the surface**. Flux is maximum, $ E\\,dS $.\n- $ \\theta = 90^\\circ $ — field along the surface, i.e. **tangential**. Flux is **zero**.\n\nMisreading which of those is "perpendicular" is the standard slip here. Always take $ \\theta $ from the **normal**.\n\nFlux is a **scalar** — despite being built from two vectors — so fluxes just add arithmetically. And it can be negative: field going *into* a closed surface gives negative flux, field coming *out* gives positive flux, because the area vector on a closed surface points outward by convention.',
    }),
    b('text', 4, {
      markdown: 'For a whole surface you add up all the patches:\n\n$ \\phi = \\displaystyle\\int \\vec{E}\\cdot d\\vec{S} $\n\nwhich looks alarming and almost never has to be evaluated as a real integral. In every case you will meet, one of two shortcuts applies.',
    }),
    b('table', 5, {
      caption: 'The two shortcuts. Between them they cover essentially every flux problem in this chapter.',
      headers: ['When', 'Flux'],
      rows: [
        ['$ E $ is **constant** in magnitude and **perpendicular** to the surface everywhere', '$ \\phi = ES $'],
        ['$ E $ is **tangential** to the surface everywhere', '$ \\phi = 0 $'],
      ],
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'spatial',
      prompt: 'A closed cube is placed in a **uniform** electric field, with no charge inside it. What is the net flux through the cube?',
      options: ['Zero', '$ EL^{2} $ where $ L $ is the side', '$ 6EL^{2} $', 'It depends on the orientation of the cube'],
      reveal: '**Zero — and for any closed surface, any orientation.**\n\nIn a uniform field the lines are straight and parallel. Every line that enters the cube must come out the other side; nothing is created or destroyed inside. Entering flux is negative and leaving flux is positive, and they cancel exactly.\n\nOrientation makes no difference either. Tilt the cube and each face contributes differently, but the sum stays zero — because the *lines* have not changed, only how they are shared between faces.\n\nRemember this as a statement in its own right: **the net flux through any closed surface in a uniform field is zero.** You will use it constantly to throw away faces you do not want to compute.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Flux through part of a shape',
      level: 2,
      objective: 'Find the flux through a curved surface by replacing it with a flat one that has the same outline.',
    }),
    b('text', 8, {
      markdown: 'A very common exam shape: a **hemisphere** of radius $ R $ placed in a uniform field $ E $, with the field perpendicular to its flat base. What is the flux through the curved part?\n\nDoing it by direct integration over the dome is unpleasant. Do this instead:\n\n1. Close the surface by adding the flat circular base. Now it is a closed surface with no charge inside, so the **total** flux is zero.\n2. The flat base has area $ \\pi R^{2} $ with the field perpendicular to it, so its flux is $ -E\\pi R^{2} $ (negative, since the field enters there).\n3. Therefore the curved part must carry $ +E\\pi R^{2} $ to make the total zero.\n\nSo the flux through the dome equals the flux through the flat circle it sits on. That is a general and very useful move: **for a uniform field, any surface can be replaced by its flat "shadow" outline.** And if the field were instead *parallel* to the base, no lines would cross it at all and the flux would be zero.',
    }),
    b('worked_example', 9, {
      label: 'flux through a cube in a slanted field',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A cube of side $ L = 0.2 $ m sits with one corner at the origin and its edges along the axes. A uniform field $ \\vec{E} = (2.5\\ \\hat{i} - 4.2\\ \\hat{j}) $ N/C fills the region. Find the net electric flux through the whole cube.',
      solution: '**Zero.**\n\nAnd you should be able to say so without writing anything down. The field is **uniform** and there is **no charge inside** the cube, so every field line that enters leaves again.\n\nIf you want to see it face by face: take the two faces perpendicular to the $ x $-axis. On the one at $ x = 0 $ the outward normal is $ -\\hat{i} $, giving flux $ -2.5L^{2} $. On the one at $ x = L $ the outward normal is $ +\\hat{i} $, giving $ +2.5L^{2} $. They cancel. The same happens for the pair perpendicular to $ y $ with the $ -4.2 $ component, and the pair perpendicular to $ z $ contributes nothing at all since $ \\vec{E} $ has no $ z $-component.\n\n**The lesson is about reading the question.** The specific numbers $ 2.5 $ and $ -4.2 $ are decoration. The two words that decide the answer are "uniform" and the absence of any charge inside. Spot those and you are finished in one line.',
    }),
    b('image', 10, {
      src: '',
      alt: 'Three flux cases: field perpendicular to a surface, field tangential to it, and a closed surface in a uniform field',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Maximum flux, zero flux, and the case that gives zero *net* flux for a completely different reason.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), three panels side by side separated by thin grey rules. Panel 1: a flat rectangular surface seen at an angle, with straight orange field arrows striking it head-on through its face, and a dashed grey normal arrow parallel to the field; label reads maximum. Panel 2: the same surface with orange field arrows running parallel to its plane, sliding past it, normal arrow perpendicular to the field; label reads zero. Panel 3: a wireframe cube in dim grey with straight orange field arrows passing right through it, entering one side and leaving the other unchanged. Muted white minimal labels, generous dark space, orange accent, no clutter.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\phi = \\vec{E}\\cdot\\vec{S} = ES\\cos\\theta $, with $ \\theta $ measured from the **normal**.\n- Flux is a **scalar**; it can be positive (outward) or negative (inward).\n- Uniform field + closed surface → net flux **zero**, always.\n- Curved surface in a uniform field → replace it by its flat outline (its "shadow").\n- Tangential field → zero flux, no matter how large the surface.',
    }),
    b('text', 12, {
      markdown: 'Next: flux looks like bookkeeping so far. One line from Gauss turns it into the most powerful shortcut in electrostatics.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('A surface of area $ S $ is held so that a uniform field $ E $ lies **in the plane** of the surface. The flux through it is',
          ['zero', '$ ES $', '$ ES/2 $', '$ ES\\sqrt{2} $'],
          0,
          'The angle from the normal is $ 90^\\circ $, so $ \\cos\\theta = 0 $. No field line crosses the surface at all — the field slides along it, like rain past an edge-on hoop.',
          1),
        q('Electric flux is a',
          ['scalar, and can be positive or negative', 'vector along the field direction', 'vector along the area vector', 'scalar that is always positive'],
          0,
          'It is a dot product of two vectors, which is always a scalar. The sign tells you the direction of crossing: outward through a closed surface is positive, inward is negative.',
          1),
        q('A hemisphere of radius $ R $ is placed in a uniform field $ E $ directed perpendicular to its flat base. The flux through the **curved** surface is',
          ['$ E\\pi R^{2} $', '$ 2E\\pi R^{2} $', 'zero', '$ 4E\\pi R^{2} $'],
          0,
          'Close the surface with the flat base. There is no charge inside, so the total flux is zero, which means the curved part must carry exactly the opposite of the base — and the base carries $ E\\pi R^{2} $. The answer $ 2\\pi R^{2}E $ comes from using the curved *area* $ 2\\pi R^{2} $, which ignores the fact that the field meets that dome at a different angle everywhere.',
          3),
      ],
    }),
  ],
};

// ── p14 · Gauss's Law ────────────────────────────────────────────────────────
const p14 = {
  page_number: 14,
  slug: 'gausss-law',
  title: "Gauss's Law",
  subtitle: 'Only the charge inside counts — but the field is made by everything',
  glossary: [
    { term: "Gauss's law", definition: 'The net electric flux through any closed surface equals the charge enclosed divided by $ \\varepsilon_0 $.' },
    { term: 'Gaussian surface', definition: 'An imaginary closed surface, chosen for its symmetry, on which Gauss\'s law is applied.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Finding the field of an infinite charged sheet by slicing it into rings and integrating takes most of a page, and the integral is genuinely nasty.\n\nWith Gauss\'s law it takes two lines.\n\nThat is the trade this page offers. Gauss\'s law tells you nothing new about nature — it is Coulomb\'s law rewritten — but when the charge arrangement is symmetric, it is an enormous shortcut.',
    }),
    b('text', 1, {
      markdown: 'Take **any** closed surface. Add up the flux through every part of it. Gauss\'s law says the answer depends on one thing only: the total charge sealed inside.',
    }),
    b('latex_block', 2, {
      latex: '\\oint_S \\vec{E}\\cdot d\\vec{S} = \\frac{q_{\\text{in}}}{\\varepsilon_0}',
      label: "Gauss's law",
      note: 'q_in is the NET charge enclosed by the surface. The circle on the integral sign means the surface is closed.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Three consequences fall straight out, and each is worth saying separately:\n\n**Charges outside contribute nothing to the flux.** Their field lines go in one side and out the other, so the net is zero — exactly the uniform-field cube argument from the last page, generalised.\n\n**The shape of the surface does not matter.** A sphere, a cube, a lumpy potato — if they enclose the same charge, they have the same flux. The lines have to get out somehow.\n\n**Where inside the charge sits does not matter either.** Move a charge around within the surface and the total flux is unchanged, even though the flux through individual patches shifts around.',
    }),
    b('heading', 4, {
      text: 'The one sentence students get wrong',
      level: 2,
      objective: 'Distinguish which quantity in Gauss\'s law depends on the enclosed charge only, and which depends on all charges.',
    }),
    b('text', 5, {
      markdown: 'Look at the two sides of the equation carefully, because they are **not** symmetric:\n\n- On the right, $ q_{\\text{in}} $ counts **only the enclosed charge**. External charges are irrelevant to it.\n- On the left, $ \\vec{E} $ at any point of the surface is the **total** field there — produced by **every** charge in the universe, inside and outside alike.\n\nSo a charge sitting just outside your Gaussian surface absolutely does change $ \\vec{E} $ at points on it. What it does **not** change is the *sum* of $ \\vec{E}\\cdot d\\vec{S} $ over the whole closed surface: its contributions cancel out patch by patch.\n\nThis is the single most-tested subtlety of the whole topic.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'Five charges $ q_1 $ to $ q_5 $ are scattered about. A Gaussian surface $ S $ encloses only $ q_2 $ and $ q_4 $. Which statement is right?',
      options: [
        '$ \\vec{E} $ on the surface is due to all five charges, while $ q_{\\text{in}} $ counts only $ q_2 $ and $ q_4 $',
        'Both $ \\vec{E} $ and $ q_{\\text{in}} $ involve only $ q_2 $ and $ q_4 $, since the others sit outside $ S $',
        '$ \\vec{E} $ is due only to $ q_2 $ and $ q_4 $, while $ q_{\\text{in}} $ counts all five charges present',
        '$ \\vec{E} $ is due to $ q_1, q_3, q_5 $ alone, while $ q_{\\text{in}} $ counts $ q_2 $ and $ q_4 $ only',
      ],
      reveal: '**The field on the surface comes from all five; the enclosed charge counts only two.**\n\nElectric fields do not know about imaginary surfaces. $ \\vec{E} $ at any point is the superposition of the fields of every charge there is — an outside charge changes it just as much as an inside one.\n\nWhat Gauss guarantees is narrower and cleverer: when you **add up** $ \\vec{E}\\cdot d\\vec{S} $ over the entire closed surface, the outside charges contribute exactly zero, because whatever flux they push in on one side they take out on the other.\n\nSo you must never say "the field on the Gaussian surface is due to the enclosed charge." That is only true when symmetry makes it true — which is precisely the case we exploit on the next page, and precisely why it is so easy to over-generalise.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'True always, useful sometimes',
      level: 2,
      objective: 'Say what extra condition is needed before Gauss\'s law can actually give you a field.',
    }),
    b('text', 8, {
      markdown: 'Gauss\'s law is always **true**. It is only **useful** for finding $ \\vec{E} $ when you can pull $ E $ out of the integral — and that needs symmetry.\n\nTo make $ \\oint \\vec{E}\\cdot d\\vec{S} $ collapse to $ ES $, you need a surface where, at every point:\n\n1. $ \\vec{E} $ is either **perpendicular** to the surface or **tangential** to it — nothing in between; and\n2. wherever it is perpendicular, $ E $ has the **same magnitude**.\n\nThen $ ES = q_{\\text{in}}/\\varepsilon_0 $, and $ E $ pops out in one step.\n\nFinding such a surface is only possible when the charge distribution itself is symmetric. In practice there are exactly three families, and each has one right surface:',
    }),
    b('table', 9, {
      caption: 'The three symmetries, and the Gaussian surface each one demands.',
      headers: ['Charge symmetry', 'Gaussian surface', 'Examples'],
      rows: [
        ['Spherical', 'a concentric **sphere**', 'point charge, shell, solid charged sphere'],
        ['Cylindrical', 'a coaxial **cylinder**', 'infinite line charge, long charged rod'],
        ['Planar', 'a **pillbox** through the plane', 'infinite sheet, charged conducting plate'],
      ],
    }),
    b('text', 10, {
      markdown: 'And for anything else — two point charges, a finite rod, a charged disc — Gauss\'s law is still perfectly true, but it will not hand you the field. You are back to slicing and integrating.',
    }),
    b('heading', 11, {
      text: 'Flux problems that need no field at all',
      level: 2,
      objective: 'Use symmetry to find the flux through part of a closed surface without ever computing E.',
    }),
    b('text', 12, {
      markdown: 'A whole family of exam questions asks only for **flux**, never for the field — and those are pure Gauss, no integration:\n\n**Charge $ q $ at the centre of a cube.** Total flux $ = q/\\varepsilon_0 $. The six faces are identical by symmetry, so each carries $ q/6\\varepsilon_0 $.\n\n**Charge $ q $ at a corner of a cube.** Now the charge is shared between eight cubes stacked around that corner, so this cube gets $ q/8\\varepsilon_0 $. Of its six faces, the three touching the corner get nothing at all (the field is tangential to them), so the other three share it: $ q/24\\varepsilon_0 $ each.\n\n**A dipole inside a closed surface.** $ q_{\\text{in}} = +q + (-q) = 0 $, so the net flux is **zero** — even though the field on the surface is certainly not zero anywhere.\n\n**Charge $ q $ at the centre of the flat face of a hemisphere.** Half the field lines go into the dome, so the flux through it is $ q/2\\varepsilon_0 $.\n\nThe move is always the same: **find what fraction of the full solid angle the surface covers**, and take that fraction of $ q/\\varepsilon_0 $.',
    }),
    b('worked_example', 13, {
      label: 'a charge at the corner of a cube',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A point charge $ q $ is placed at one corner of a cube. Find (a) the flux through the whole cube, and (b) the flux through each of the three faces that do not touch the charge.',
      solution: '**(a) The whole cube.**\n\nA single cube does not surround the charge, so we cannot use $ q/\\varepsilon_0 $ directly. Instead, build a closed surface that does: stack **eight** identical cubes around that corner, and together they completely enclose the charge.\n\nThe total flux through all eight is $ q/\\varepsilon_0 $, and by symmetry each identical cube takes an equal share:\n\n$ \\phi_{\\text{cube}} = \\frac{q}{8\\varepsilon_0} $\n\n**(b) The individual faces.**\n\nOf the cube\'s six faces, **three meet at the corner where the charge sits**. The field lines from the charge run *along* those faces, never across them — the field is tangential, so the flux through each of them is **zero**.\n\nThat leaves the three far faces to carry the entire $ q/8\\varepsilon_0 $, and they are equivalent by symmetry:\n\n$ \\phi_{\\text{each far face}} = \\frac{1}{3}\\cdot\\frac{q}{8\\varepsilon_0} = \\frac{q}{24\\varepsilon_0} $\n\n**The technique to keep.** Whenever a charge sits on a corner, edge or face rather than at a nice centre, **complete the symmetry**: surround it with as many copies of the shape as it takes to enclose it, then divide. Corner of a cube → 8 cubes. Centre of a face → 2 cubes. Middle of an edge → 4 cubes.',
    }),
    b('image', 14, {
      src: '',
      alt: 'Eight cubes stacked around a corner charge, and the three faces of one cube that receive zero flux',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Complete the symmetry first, then divide. Eight cubes surround a corner.',
      generation_prompt: 'Clean scientific isometric diagram on a near-black background (#0B0C0F). Eight identical wireframe cubes in thin dim-grey lines stacked two by two by two, meeting at a common central corner where a small bright amber sphere sits. One of the eight cubes is drawn with slightly brighter edges to single it out, and its three faces touching the central corner are lightly tinted a very dark warm grey while its three far faces carry small orange outward arrows. Muted white minimal labels, generous dark space, orange accent, no clutter.',
    }),
    b('callout', 15, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\oint\\vec{E}\\cdot d\\vec{S} = q_{\\text{in}}/\\varepsilon_0 $. Enclosed charge only, on the right.\n- $ \\vec{E} $ on the left is the field of **all** charges — outside ones just contribute zero net flux.\n- Always true; **useful** only with spherical, cylindrical or planar symmetry.\n- Flux-only questions: work out the fraction of the solid angle covered, then take that fraction of $ q/\\varepsilon_0 $.\n- Charge at a corner of a cube → $ q/8\\varepsilon_0 $; each of the three far faces → $ q/24\\varepsilon_0 $.',
    }),
    b('text', 16, {
      markdown: 'Next: three symmetries, four famous results, and a set of graphs worth knowing by their shape.',
    }),
    b('inline_quiz', 17, {
      pass_threshold: 0.6,
      questions: [
        q('A charge $ q $ is enclosed by a spherical surface. If the sphere is replaced by a cube of the same volume enclosing the same charge, the net flux',
          ['stays exactly the same', 'becomes larger', 'becomes smaller', 'depends on where in the cube the charge sits'],
          0,
          'Gauss\'s law depends only on the enclosed charge — never on the shape of the surface or where inside it the charge is placed. The flux through *individual faces* changes, but the total does not.',
          1),
        q('An electric dipole is placed entirely inside a closed surface. The net flux through the surface is',
          ['zero, because the enclosed charge is zero', 'zero, because the field is zero everywhere on the surface', '$ 2q/\\varepsilon_0 $', '$ q/\\varepsilon_0 $'],
          0,
          'The enclosed charge is $ +q-q = 0 $, so the flux is zero. But note the reasoning in the other zero option is wrong — the field on the surface is certainly not zero. Zero *net flux* and zero *field* are very different statements.',
          2),
        q("Gauss's law is useful for calculating the field of",
          ['an infinite charged sheet', 'two unequal point charges', 'a finite charged rod', 'a charged square plate of side 5 cm, at a point near its edge'],
          0,
          'Only a distribution with spherical, cylindrical or planar symmetry lets you pull $ E $ out of the integral. The law is equally *true* in the other three cases, but it will not give you the field — you would have to integrate.',
          3),
      ],
    }),
  ],
};

// ── p15 · Gauss in Action ────────────────────────────────────────────────────
const p15 = {
  page_number: 15,
  slug: 'gauss-in-action',
  title: 'Gauss in Action',
  subtitle: 'Wire, sheet, shell and solid sphere — four results and their graphs',
  glossary: [
    { term: 'pillbox', definition: 'A short cylindrical Gaussian surface poked through a plane sheet, with its flat faces parallel to the sheet.' },
  ],
  blocks: [
    b('text', 0, {
      markdown: 'Four charge distributions, four Gaussian surfaces, four results. Each derivation is the same three moves — **choose the surface, kill the tangential parts, solve for $ E $** — so watch the pattern rather than memorising four separate things.',
    }),
    b('heading', 1, {
      text: 'The infinite line charge',
      level: 2,
      objective: 'Derive the field of a long charged wire using a coaxial cylinder.',
    }),
    b('step_solver', 2, {
      title: 'Field of an infinitely long charged wire',
      problem: 'A very long straight wire carries a uniform linear charge density $ \\lambda $. Find the field at a perpendicular distance $ r $ from it.',
      intro: 'Cylindrical symmetry, so the Gaussian surface is a cylinder. Watch how the two flat ends disappear.',
      steps: [
        st('Gaussian surface: a cylinder of radius $ r $ and length $ l $, coaxial with the wire',
          'By symmetry the field must point straight out from the wire, and must have the same magnitude everywhere at the same distance.'),
        st('$ \\phi_{\\text{flat ends}} = 0 $',
          'On both flat ends, the field runs along the surface, not through it.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the flux through the flat ends zero?',
              options: ['The field there is zero', 'The field there is tangential to those faces', 'The ends have zero area', 'The charges are too far away'],
              answer_index: 1,
              feedback_right: 'Right — the field points radially outward, which lies **in** the plane of each flat end.',
              feedback_wrong: 'The field is not zero there. It points radially away from the wire, and that direction lies flat in the plane of the end faces — so no lines cross them.',
            },
          }),
        st('$ \\phi_{\\text{curved}} = E\\,(2\\pi r l) $',
          'On the curved surface the field is perpendicular everywhere and has the same magnitude everywhere. That is exactly the condition for $ \\phi = ES $.'),
        st('$ q_{\\text{in}} = \\lambda l $',
          'The length of wire sealed inside the cylinder is $ l $, carrying $ \\lambda $ per unit length.', {
            check: {
              kind: 'fill_blank',
              prompt: 'If the cylinder length is doubled, by what factor does $ q_{\\text{in}} $ change?',
              blank_answer: '2',
              feedback_right: 'Yes — and the curved area doubles too, so $ E $ comes out unchanged. As it must: the answer cannot depend on a surface we invented.',
              feedback_wrong: 'Twice the length of wire means twice the charge inside. Notice the curved area also doubles, so $ l $ cancels — which is the check that our imaginary surface has not leaked into the answer.',
            },
          }),
        st('$ E(2\\pi r l) = \\frac{\\lambda l}{\\varepsilon_0} \\quad\\Rightarrow\\quad E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $',
          'The $ l $ cancels, as it had to. The field falls as $ 1/r $, not $ 1/r^{2} $.'),
      ],
      now_you_try: {
        problem: 'A long wire carries $ \\lambda = 2 \\times 10^{-6} $ C/m. Find the field 4 cm from it.',
        answer: '$ 9 \\times 10^{5} $ N/C, directed radially outward.',
        solution: '$ E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} = \\frac{2\\lambda k}{r} = \\frac{2(9\\times10^{9})(2\\times10^{-6})}{0.04} = 9\\times10^{5} $ N/C.\n\nUsing $ \\frac{1}{2\\pi\\varepsilon_0} = 2k = 1.8\\times10^{10} $ is the fastest route in an exam — it saves you juggling $ \\varepsilon_0 $.',
      },
    }),
    b('heading', 3, {
      text: 'The infinite sheet — and the conducting plate',
      level: 2,
      objective: 'Derive both planar results and explain why one is exactly twice the other.',
    }),
    b('text', 4, {
      markdown: 'For a plane sheet of surface charge density $ \\sigma $, symmetry says the field must point straight out of the sheet on both sides, with the same magnitude. Use a **pillbox** — a short cylinder poked through the sheet, with flat faces of area $ S_0 $ parallel to it.\n\nThe curved side contributes nothing (field tangential). The **two** flat faces each contribute $ ES_0 $. The charge inside is $ \\sigma S_0 $. So\n\n$ E(2S_0) = \\frac{\\sigma S_0}{\\varepsilon_0} \\quad\\Rightarrow\\quad E = \\frac{\\sigma}{2\\varepsilon_0} $\n\nStriking result: **the field does not depend on distance at all.** Walk away from an infinite sheet and the field is the same. (Real sheets are finite, of course, so this holds only close to the sheet and away from its edges.)',
    }),
    b('callout', 5, {
      variant: 'warning',
      title: 'The most-confused pair in the chapter',
      markdown: 'A **charged non-conducting sheet** gives $ E = \\frac{\\sigma}{2\\varepsilon_0} $.\n\nA **charged conducting plate** gives $ E = \\frac{\\sigma}{\\varepsilon_0} $ — twice as much.\n\nThe difference is **not** a different law. It is that a conductor puts its charge on **both** its faces. If $ \\sigma $ is the density on each face, the pillbox now encloses $ \\sigma(2S_0) $ instead of $ \\sigma S_0 $, and the answer doubles.\n\nBefore using either formula, ask one question: **is $ \\sigma $ the charge on one face of a conductor, or the whole charge per unit area of a thin sheet?** That decides which formula you want.',
    }),
    b('heading', 6, {
      text: 'The spherical shell',
      level: 2,
      objective: 'State the field inside and outside a charged shell, and describe the jump at its surface.',
    }),
    b('text', 7, {
      markdown: 'A hollow sphere of radius $ R $ carries charge $ Q $ spread evenly over its surface. Use a concentric spherical Gaussian surface.\n\n**Inside** ($ r < R $): the surface encloses **no** charge, so $ q_{\\text{in}} = 0 $ and therefore $ E = 0 $. Everywhere inside, not just at the centre. That is worth pausing on — the charges are all around you, and they cancel perfectly at every interior point.\n\n**Outside** ($ r > R $): the surface encloses the whole $ Q $, so $ E(4\\pi r^{2}) = Q/\\varepsilon_0 $ and\n\n$ E = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{Q}{r^{2}} $\n\nIdentical to a point charge $ Q $ sitting at the centre. **From outside, a uniformly charged sphere is indistinguishable from a point.**\n\n**At the surface** the field jumps abruptly from $ 0 $ to $ kQ/R^{2} $. That discontinuity is real, and it equals $ \\sigma/\\varepsilon_0 $ — the conducting-plate result again, since a shell surface is locally flat.',
    }),
    b('heading', 8, {
      text: 'The solid charged sphere',
      level: 2,
      objective: 'Derive the field inside a uniformly charged solid sphere and contrast it with the shell.',
    }),
    b('text', 9, {
      markdown: 'Now spread $ Q $ uniformly through the **volume** of a sphere of radius $ R $ — a non-conductor, since a conductor would push all the charge to the surface.\n\n**Inside** ($ r < R $): a Gaussian sphere of radius $ r $ encloses only the fraction of charge within it,\n\n$ q_{\\text{in}} = Q\\cdot\\frac{(4/3)\\pi r^{3}}{(4/3)\\pi R^{3}} = Q\\frac{r^{3}}{R^{3}} $\n\nso $ E(4\\pi r^{2}) = \\frac{Qr^{3}}{\\varepsilon_0 R^{3}} $, giving',
    }),
    b('latex_block', 10, {
      latex: 'E_{\\text{inside}} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{Qr}{R^{3}} \\qquad (r<R)',
      label: 'Inside a uniformly charged solid sphere',
      note: 'E grows LINEARLY with r — zero at the centre, maximum at the surface.',
      highlight: true,
    }),
    b('text', 11, {
      markdown: '**Outside** ($ r > R $): the whole charge is enclosed, so it is $ kQ/r^{2} $ again — a point charge, exactly as for the shell.\n\nAnd here is the difference worth noticing. At $ r = R $ both expressions give $ kQ/R^{2} $, so for the **solid sphere the field is continuous** — no jump. For the **shell** it jumps from zero. The reason is simple: a shell has all its charge concentrated in a surface you cross abruptly, while a solid sphere has you passing through the charge gradually.',
    }),
    b('table', 12, {
      caption: 'The four results together. Notice that all four "outside" fields are just point charges.',
      headers: ['Distribution', 'Inside', 'Outside'],
      rows: [
        ['Infinite line, density $ \\lambda $', '—', '$ \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $  ($ \\propto 1/r $)'],
        ['Infinite sheet, density $ \\sigma $', '—', '$ \\frac{\\sigma}{2\\varepsilon_0} $  (constant)'],
        ['Conducting plate, $ \\sigma $ per face', '$ 0 $', '$ \\frac{\\sigma}{\\varepsilon_0} $'],
        ['Spherical shell, charge $ Q $', '$ 0 $', '$ \\frac{kQ}{r^{2}} $'],
        ['Solid sphere, charge $ Q $', '$ \\frac{kQr}{R^{3}} $ (linear)', '$ \\frac{kQ}{r^{2}} $'],
      ],
    }),
    b('image', 13, {
      src: '',
      alt: 'Graphs of E against r for a spherical shell and for a uniformly charged solid sphere',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Shell: zero inside, then a jump. Solid sphere: rises linearly, then falls — no jump.',
      generation_prompt: 'Clean scientific graph panel on a near-black background (#0B0C0F), two graphs side by side sharing a style, thin dim-grey axes labelled r horizontally and E vertically in muted white, with a faint vertical dashed line marked R on each. Left graph: an amber curve that is flat on zero from the origin to R, jumps vertically at R to a peak, then falls smoothly as one over r squared. Right graph: an amber line rising straight from the origin to a peak at R, then falling smoothly as one over r squared with no break. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('reasoning_prompt', 14, {
      reasoning_type: 'quantitative',
      prompt: 'A solid non-conducting sphere of radius $ R $ carries charge $ Q $ spread uniformly through its volume. Where is the field larger — at $ r = R/2 $ or at $ r = 2R $?',
      options: ['At $ r = R/2 $, by a factor of 2', 'At $ r = 2R $, by a factor of 2', 'They are equal', 'At $ r = R/2 $, by a factor of 4'],
      reveal: '**At $ r = R/2 $, and by exactly a factor of 2.**\n\nInside, $ E = \\frac{kQr}{R^{3}} $. At $ r = R/2 $ this gives $ \\frac{kQ}{2R^{2}} $.\n\nOutside, $ E = \\frac{kQ}{r^{2}} $. At $ r = 2R $ this gives $ \\frac{kQ}{4R^{2}} $.\n\nRatio: $ 2 : 1 $.\n\nThe trap is using one formula for both points. **Always check which side of $ R $ you are on before you pick the expression** — that single check prevents most errors on this topic.',
      difficulty_level: 3,
    }),
    b('text', 15, {
      markdown: 'Next: one of those results — that the field inside a conductor is zero — turns out to have consequences big enough to deserve its own page.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The electric field at a point inside a uniformly charged spherical **shell** is',
          ['zero everywhere inside', 'zero only at the centre', '$ kQ/r^{2} $', '$ kQ/R^{2} $'],
          0,
          'A Gaussian sphere drawn anywhere inside encloses no charge at all, so the flux and hence the field is zero — at every interior point, not merely at the centre. The contributions of all the surface charge cancel perfectly wherever you stand inside.',
          2),
        q('The field of an infinite charged sheet is independent of distance. This is because',
          ['retreating weakens each element but reveals more sheet', 'the sheet has infinite charge, so the field cannot change', 'the field is in fact zero everywhere outside it', 'the sheet behaves as a conductor'],
          0,
          'The two effects cancel exactly for an infinite plane: each piece of the sheet contributes less as you retreat, but you "see" a proportionally larger patch of sheet at a shallow angle. That balance is what makes the field constant.',
          3),
        q('A charged **conducting** plate has surface charge density $ \\sigma $ on each face. The field just outside it is',
          ['$ \\sigma/\\varepsilon_0 $', '$ \\sigma/2\\varepsilon_0 $', '$ 2\\sigma/\\varepsilon_0 $', 'zero'],
          0,
          'A conductor carries charge on **both** faces, so a pillbox through it encloses twice the charge that a thin sheet of the same $ \\sigma $ would — and the field comes out twice as large. Answering $ \\sigma/2\\varepsilon_0 $ means you applied the thin-sheet result to a conductor.',
          3),
      ],
    }),
  ],
};

// ── p16 · What a Conductor Does to a Field ───────────────────────────────────
const p16 = {
  page_number: 16,
  slug: 'what-a-conductor-does-to-a-field',
  title: 'What a Conductor Does to a Field',
  subtitle: 'Three consequences of one fact: E is zero inside',
  glossary: [
    { term: 'electrostatic equilibrium', definition: 'The steady state a conductor reaches when its charges have stopped moving — which requires the field inside it to be zero.' },
    { term: 'corona discharge', definition: 'The leakage of charge into the air from a sharply curved conductor, where the surface field becomes strong enough to ionise the air.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Hand a metal sphere a large charge. Where does the charge end up — spread through the metal, or somewhere more specific?\n\nAnd would a **hollow** sphere of the same size hold any less?',
      hint: 'Free charges repel each other. Where do they end up if they can go anywhere in the metal?',
      reveal: 'It all ends up on the **outer surface** — and a hollow sphere holds exactly as much as a solid one.\n\nThat is genuinely surprising the first time. All that metal in the middle contributes nothing at all to storing charge, because there is never any charge in it.\n\nThe reason is one short line of Gauss\'s law, and it is the first of three results on this page.',
    }),
    b('text', 1, {
      markdown: 'Start from the definition. A **conductor** has charges free to move. If there were any field inside it, those free charges would be pushed and a current would flow — which is not a static situation at all.\n\nSo in **electrostatic equilibrium** there is exactly one possibility:',
    }),
    b('latex_block', 2, {
      latex: '\\vec{E} = 0 \\quad \\text{everywhere inside the material of a conductor}',
      label: 'The starting point',
      note: 'Not an extra law — just the statement that the charges have stopped moving.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That single line, combined with Gauss\'s law, gives three results on this page and two more on the next. Each is a short argument, and all of them are worth being able to reproduce.',
    }),
    b('heading', 4, {
      text: '1 · All the excess charge sits on the outer surface',
      level: 2,
      objective: 'Use Gauss\'s law to prove no excess charge can survive inside a conductor.',
    }),
    b('text', 5, {
      markdown: 'Draw a Gaussian surface just inside the conductor\'s outer skin. Everywhere on it $ \\vec{E} = 0 $, so the flux is zero, so by Gauss the enclosed charge is zero.\n\nShrink that surface, redraw it anywhere you like inside the metal — you always get the same answer. There is nowhere inside a conductor for excess charge to hide.\n\n> **Under electrostatic conditions, all excess charge on a conductor lies on its outer surface.**\n\nWhich also explains something that would otherwise seem wasteful: for storing charge, a **hollow** metal sphere is exactly as good as a solid one of the same size. The inside was never being used.',
    }),
    b('heading', 6, {
      text: '2 · Just outside, the field is $ \\sigma/\\varepsilon_0 $ and points straight out',
      level: 2,
      objective: 'Give the magnitude and direction of the field immediately outside a charged conductor.',
    }),
    b('text', 7, {
      markdown: 'Take a tiny pillbox with one face just inside the metal and one just outside. The inside face contributes nothing ($ E = 0 $ there) and the curved side contributes nothing (field tangential). Only the outer face is left:\n\n$ E\\,\\Delta S = \\frac{\\sigma\\,\\Delta S}{\\varepsilon_0} \\quad\\Rightarrow\\quad E = \\frac{\\sigma}{\\varepsilon_0} $\n\nAnd the direction must be **perpendicular** to the surface. If it had any sideways component, that component would drag the surface charges along the surface — and then it would not be equilibrium.\n\nSo the field changes **discontinuously** across the surface: zero just inside, $ \\sigma/\\varepsilon_0 $ just outside. (In reality the change happens over four or five atomic layers, which is a discontinuity for every practical purpose.)',
    }),
    b('heading', 8, {
      text: '3 · Charge crowds where the surface is sharpest',
      level: 2,
      objective: 'Predict where on an irregular conductor the surface charge density and field are largest.',
    }),
    b('text', 9, {
      markdown: 'On a sphere the charge spreads evenly. On an irregular conductor it does not — it piles up where the surface curves most sharply:\n\n$ \\sigma \\propto \\frac{1}{\\text{radius of curvature}} $\n\nSo a pointed tip has a large $ \\sigma $, and since $ E = \\sigma/\\varepsilon_0 $ just outside, it also has a very large **field**. Push that far enough and the field rips electrons off nearby air molecules, the air starts conducting, and charge leaks away in a glow — **corona discharge**.\n\nThis is the whole design principle of a **lightning conductor**: a sharp spike on the roof, earthed, that bleeds charge away quietly and offers the strike an easy path if it comes anyway.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The sharp-point effect has been photographed for centuries at sea. On stormy nights sailors sometimes saw a blue-violet glow dancing on the tips of their masts — **St. Elmo\'s fire**, corona discharge from the sharpest, highest points of the ship in a strongly charged sky.\n\nThe same physics is the reason high-voltage transmission lines use thick, smooth conductors and rounded fittings. Any sharp edge would waste power continuously as corona leakage — and hiss audibly while doing it.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F). Left: a sailing ship mast silhouette in dim grey against a dark stormy sky, with a soft violet-blue glow at the very tip and a few fine orange discharge filaments. Right: a cutaway of a pointed metal spike and a smooth rounded dome side by side in dim grey line art, with densely packed small amber plus signs crowding the spike tip and evenly spread ones on the dome, and orange field arrows much denser at the point. Muted white minimal labels, generous dark space.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'spatial',
      prompt: 'A solid metal sphere and a hollow metal sphere of the **same radius** are each given the same charge $ Q $. Compare the field just outside each of them.',
      options: ['Identical for both spheres', 'Larger for the solid sphere, which holds more charge', 'Larger for the hollow sphere', 'Zero outside the hollow one'],
      reveal: '**Identical.**\n\nOn either sphere, all of $ Q $ ends up on the outer surface — there is never any charge inside the metal. Since both spheres have the same radius, both have the same $ \\sigma = Q/4\\pi R^{2} $, and therefore the same field $ \\sigma/\\varepsilon_0 $ just outside.\n\nThe metal in the middle of the solid sphere plays no part whatsoever. It is not storing charge, and it is not contributing to any field.\n\nThis is why the huge Van de Graaff generators used for demonstrations are hollow shells: the inside of a solid one would be dead weight.',
      difficulty_level: 2,
    }),
    b('image', 12, {
      src: '',
      alt: 'Charged conductor cross-section showing zero field inside, charge on the outer surface, and denser charge at a sharp point',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'No field in the metal, all the charge on the skin — and it crowds onto the sharpest part.',
      generation_prompt: 'Clean scientific cross-section diagram on a near-black background (#0B0C0F). An irregular blob-shaped conductor — rounded at the left, tapering to a sharp point at the right — drawn in dim grey with a lightly tinted dark-grey interior labelled E equals zero in muted white. Small warm amber plus signs sit on the outline only: widely spaced around the rounded left end, densely packed at the sharp right tip. Short orange field-line arrows leave the surface exactly perpendicular to it everywhere, sparse at the left and long and dense at the point. A thin dashed grey Gaussian curve drawn just inside the metal. Muted white minimal labels, generous dark space, orange accent, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{E} = 0 $ inside the material of any conductor in equilibrium. Everything else follows.\n- All excess charge sits on the **outer** surface; a hollow conductor stores as much as a solid one.\n- Just outside: $ E = \\sigma/\\varepsilon_0 $, **perpendicular** to the surface. The field is discontinuous there.\n- $ \\sigma \\propto 1/(\\text{radius of curvature}) $ → sharp points leak charge (corona, lightning rods).',
    }),
    b('text', 12, {
      markdown: 'Next: hollow out that conductor and put a charge inside the hole. What the metal does then is the reason a car is a safe place to be in a thunderstorm.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The electric field just outside the surface of a charged conductor is',
          ['$ \\sigma/\\varepsilon_0 $, perpendicular to the surface', '$ \\sigma/2\\varepsilon_0 $, perpendicular to the surface', '$ \\sigma/\\varepsilon_0 $, parallel to the surface', 'zero'],
          0,
          'The pillbox argument gives the magnitude, and equilibrium forces the direction: any tangential component would push the surface charges sideways, and then nothing would be static. The $ \\sigma/2\\varepsilon_0 $ result belongs to a thin non-conducting sheet, not to a conductor.',
          2),
        q('Excess charge given to a solid metal sphere distributes itself',
          ['entirely on the outer surface', 'uniformly through the volume', 'mostly at the centre', 'half on the surface and half inside'],
          0,
          'A Gaussian surface drawn anywhere inside the metal has $ E = 0 $ on it, so it encloses no charge — leaving the outer surface as the only place charge can be.',
          1),
        q('A charged conductor is shaped like a pear. The surface charge density is greatest',
          ['at the narrow, sharply curved end', 'at the broad, rounded end', 'the same everywhere on the surface', 'inside the conductor'],
          0,
          'Charge density varies inversely with the radius of curvature, so it crowds onto the sharpest region — which is also where the field just outside is strongest, and where a corona discharge would start.',
          2),
      ],
    }),
  ],
};

// ── p17 · Cavities and Shielding ─────────────────────────────────────────────
const p17 = {
  page_number: 17,
  slug: 'cavities-and-shielding',
  title: 'Cavities and Shielding',
  subtitle: 'Hollow out the conductor — and find the safest place in a thunderstorm',
  glossary: [
    { term: 'electrostatic shielding', definition: 'The protection of a region from outside electric fields by surrounding it with a conductor.' },
    { term: 'Faraday cage', definition: 'A conducting enclosure — solid or mesh — inside which the electric field is zero however strong the field outside.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A car is struck by lightning — hundreds of millions of volts, straight through the metal roof. The people inside are unharmed and often barely notice.\n\nIt is a popular idea that the rubber tyres save them. Do they?',
      hint: 'The bolt has already jumped a kilometre of air. How much would ten centimetres of rubber slow it down?',
      reveal: '**No. The tyres have almost nothing to do with it.**\n\nA spark that has just crossed a kilometre of air is not going to be stopped by a few centimetres of rubber.\n\nWhat saves the occupants is the **metal shell**. Charge arriving on a conductor arranges itself so that the field inside the metal is zero — and, it turns out, so is the field in any hollow the metal encloses. The current runs around the outside of the body shell and away.\n\nThis page turns that into two precise results.',
    }),
    b('heading', 1, {
      text: 'A charge suspended inside a cavity',
      level: 2,
      objective: 'Work out the induced charges when a charge hangs in a cavity inside a neutral conductor.',
    }),
    b('text', 2, {
      markdown: 'Hollow out a cavity in a neutral conductor and suspend a charge $ +q $ inside it, touching nothing.\n\nDraw a Gaussian surface **in the metal**, wrapping right around the cavity. Since $ \\vec{E} = 0 $ everywhere in the metal, the flux is zero, so the enclosed charge must be zero. But $ +q $ is certainly in there — so the cavity wall must carry exactly $ -q $ to cancel it.\n\nAnd the conductor as a whole is still neutral, so that $ -q $ had to come from somewhere. It came from the outer surface, which is left with $ +q $.',
    }),
    b('latex_block', 3, {
      latex: '\\text{cavity wall}: -q \\qquad\\qquad \\text{outer surface}: +q',
      label: 'Induced charges for a charge in a cavity (neutral conductor)',
      note: 'If the conductor already carried a charge Q, the cavity wall is still −q and the outer surface becomes Q + q.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'Two consequences are worth pausing on:\n\n**The outside world learns *that* the charge is there, but nothing else.** The $ +q $ on the outer surface is detectable from outside. But it spreads itself according to the **outer** shape only — so an observer cannot tell where in the cavity the charge sits, how big the cavity is, or even that there is a cavity at all.\n\n**An empty cavity has no field in it.** Run the same argument with nothing inside: the cavity wall carries zero charge, and the field inside the hollow is zero. That holds no matter what is happening outside — which is the whole of the next section.',
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'logical',
      prompt: 'A charge $ +2q $ is placed inside a cavity in an **isolated neutral** conducting sphere. What appears on the cavity wall and on the outer surface?',
      options: ['$ -2q $ on the cavity wall, $ +2q $ on the outer surface', '$ +2q $ on the cavity wall, $ -2q $ on the outer surface', '$ -2q $ on the cavity wall, and nothing on the outer surface', 'Nothing on either, since the conductor is neutral overall'],
      reveal: '**$ -2q $ on the cavity wall and $ +2q $ on the outer surface.**\n\n*Cavity wall:* a Gaussian surface drawn in the metal must enclose zero net charge, because $ \\vec{E} = 0 $ there. With $ +2q $ in the cavity, the wall must supply $ -2q $.\n\n*Outer surface:* the conductor began neutral and nothing was added to it, so the $ -2q $ drawn to the cavity wall leaves $ +2q $ behind — and the outer surface is the only place excess charge can sit.\n\n**The extension that exams like.** Had the conductor started with its own charge $ Q $, the cavity wall would still be $ -2q $ — that argument never changes — and the outer surface would carry $ Q + 2q $.',
      difficulty_level: 3,
    }),
    b('image', 6, {
      src: '',
      alt: 'Cross-section of a conductor with a cavity containing a positive charge, showing induced negative charge on the cavity wall and positive charge on the outer surface',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Induced charge on the cavity wall, an equal opposite charge on the outer skin, and no field in the metal between them.',
      generation_prompt: 'Clean scientific cross-section diagram on a near-black background (#0B0C0F). A thick annular ring representing a conductor shell, drawn in dim grey with a lightly tinted dark-grey fill labelled E equals zero in muted white. At the centre of the hollow cavity, a bright amber sphere marked plus q. Small cool-blue minus signs evenly around the inner cavity wall, small warm amber plus signs evenly around the outer surface. Short orange field-line arrows run from the central charge out to the cavity wall and, separately, radially outward from the outer surface — with clearly no field lines inside the grey metal region. A thin dashed grey Gaussian circle drawn within the metal. Generous dark space, orange and blue accents only.',
    }),
    b('heading', 7, {
      text: 'Electrostatic shielding',
      level: 2,
      objective: 'Explain why a conducting enclosure protects its interior from any external field.',
    }),
    b('text', 8, {
      markdown: 'Surround a region with a conductor and put the whole thing into whatever external field you like.\n\nThe conductor\'s free charges rearrange themselves — negative on one side, positive on the other — until the field **they** produce inside exactly cancels the external field. And they keep rearranging until it does, because any leftover field would still be pushing them. So it is not a partial reduction: the interior field is **zero**.\n\nThis is **electrostatic shielding**, and the enclosure is called a **Faraday cage**. It works even when the cage is a mesh rather than a solid box, provided the holes are small compared with the scale over which the field varies.\n\nNotice what shielding does **not** do. It stops outside fields getting in; it does not stop inside fields getting out. A charge inside a cavity still announces itself through the outer surface, exactly as the last section showed.',
    }),
    b('callout', 9, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'You are surrounded by Faraday cages.\n\nThe **metal mesh in a microwave oven door** keeps the microwaves inside while letting light through — the holes are large compared with a wavelength of light and tiny compared with a microwave.\n\nSensitive components ship in **conductive bags**; **coaxial cable** wraps a braided screen around its core so outside interference never reaches the signal; and an **aeroplane** struck by lightning protects everyone inside for the same reason the car does. Even an **MRI room** is a shielded box, so that hospital radio traffic never reaches the scanner.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), three small vignettes in a row separated by generous dark space, all in thin dim-grey line art with orange accents. Left: a microwave oven door seen face-on with a fine perforated metal mesh, orange wavy arrows bouncing back off it from inside. Centre: a cutaway of coaxial cable showing a central amber core, an insulating layer, and a braided grey screen, with orange interference arrows stopping at the braid. Right: an aeroplane silhouette with an orange lightning bolt striking the nose and orange current lines flowing over the outer skin and off the tail, with the cabin interior left clear. Muted white minimal labels.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Charge $ q $ in a cavity → $ -q $ induced on the cavity wall, $ +q $ on the outer surface (plus whatever the conductor already carried).\n- The outer charge distributes by the **outer** shape — it hides the position of the inner charge, and even the existence of the cavity.\n- An **empty** cavity has zero field inside, whatever the field outside. That is shielding.\n- A Faraday cage keeps external fields **out**; it does not keep internal fields in.',
    }),
    b('text', 11, {
      markdown: 'That closes Chapter 1. You can now find the force between charges, the field they create, and — where symmetry allows — get that field almost for free.\n\nBut every problem so far has been about **force and direction**, which means vectors, angles and components on every line. The next chapter tells the same story using **energy**, and energy is a scalar. Most of the geometry disappears — and a device that stores charge on purpose comes into view.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('A charge $ +Q $ is placed inside a cavity in an isolated **neutral** conductor. The charge appearing on the outer surface is',
          ['$ +Q $', '$ -Q $', 'zero', '$ +2Q $'],
          0,
          'The cavity wall must take $ -Q $ so that a Gaussian surface drawn inside the metal encloses nothing. The conductor was neutral, so that $ -Q $ leaves $ +Q $ behind — and the outer surface is the only place it can go.',
          2),
        q('A sensitive instrument is sealed in a closed metal box and the box is put into a strong external electric field. The field inside the box is',
          ['zero', 'the same as the external field', 'half the external field', 'stronger than the external field'],
          0,
          'The free charges in the box redistribute until the field they produce inside exactly cancels the external one, and they keep moving until it does. This is why a car protects its occupants from a lightning strike.',
          1),
        q('A charge sits off-centre inside a cavity in a neutral conducting shell. The charge density on the **outer** surface is',
          ['uniform, and gives no clue where the inner charge is', 'largest at the point nearest the inner charge', 'zero, since the conductor is neutral', 'negative everywhere on the outer surface'],
          0,
          'The induced charge on the **cavity wall** is uneven — it crowds towards the off-centre charge. But the metal in between screens all of that, so the outer surface distributes itself purely according to the outer shape. For a sphere that means uniformly, and an outside observer learns only the total.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p13, p14, p15, p16, p17]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
