'use strict';
/**
 * Class 12 Physics · Ch.2 "Capacitance" — pages 1–4.
 * Electrostatic potential energy, potential, potential difference, and the
 * two-way relation between field and potential.
 *
 * Run: node scripts/physics12-book/build_ch2_a_potential.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 2;

// ── p1 · Force, Work and Stored Energy ───────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'force-work-and-stored-energy',
  title: 'Force, Work and Stored Energy',
  subtitle: 'Why electrostatics has a potential energy at all',
  glossary: [
    { term: 'conservative force', definition: 'A force for which the work done between two points does not depend on the path taken. Only conservative forces have a potential energy.' },
    { term: 'electrostatic potential energy', definition: 'The work an external agent must do to assemble a set of charges, bringing each in slowly from infinity.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Chapter 1 solved everything with forces — which meant drawing arrows, resolving components and chasing angles on every single line.\n\nThere is a second way to describe exactly the same physics, and it makes most of that geometry vanish. What do you think it is?',
      hint: 'What did you switch to in mechanics when the forces got complicated?',
      reveal: '**Energy.**\n\nIn mechanics you stopped drawing free-body diagrams the moment you could write $ \\tfrac{1}{2}mv^{2} + mgh = \\text{constant} $. One scalar equation replaced a page of vectors.\n\nElectrostatics has the same escape route, and this chapter is built on it. Force and field are vectors; **energy and potential are scalars**. Adding scalars needs no angles at all.\n\nBut first we have to earn the right to use energy — which means checking that the electrostatic force is conservative.',
    }),
    b('text', 1, {
      markdown: 'A potential energy only exists for a **conservative** force — one where the work done moving between two points is the same whichever path you take.\n\nThe electrostatic force qualifies, and for a simple reason: it is a **central inverse-square force**, exactly like gravity. The work done depends only on the starting and finishing distances, never on the route between them. Go the long way round and the extra work along the way cancels out.\n\nSo we can define a potential energy. As always, we need a zero, and the natural choice is **infinity** — infinitely far apart, the charges do not interact, so we call that $ U = 0 $.',
    }),
    b('latex_block', 2, {
      latex: 'U = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q_1q_2}{r}',
      label: 'Potential energy of two point charges',
      note: 'Substitute the charges WITH their signs, and note the single power of r — not r squared. This is energy, not force.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Two features of that formula do a lot of work later, so fix them now.\n\n**The $ r $, not $ r^{2} $.** Force falls as $ 1/r^{2} $; energy falls as $ 1/r $. Writing $ U $ with an $ r^{2} $ is the single most common slip on this page. (If you ever forget which is which: energy is force times distance, so it has one fewer power of $ r $.)\n\n**The sign is not decoration.** $ U $ carries the sign of the product $ q_1q_2 $, and that sign tells you the physics:\n\n- **Like charges** ($ U > 0 $): you had to *do* work to push them together against their repulsion, and that work is stored. Release them and they fly apart.\n- **Unlike charges** ($ U < 0 $): they pulled themselves together, so the work is *negative*. To separate them again you must supply energy.\n\nA negative $ U $ means a **bound** system. That is why an electron stays with its nucleus, and why you must supply ionisation energy to remove it.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'logical',
      prompt: 'Two protons are pushed from a large separation to a distance $ r $ apart and released. Two protons in a nucleus, however, stay put. What is the electrostatic potential energy doing in each case?',
      options: [
        'It is positive in both cases — the nucleus is held together by something other than electrostatics',
        'It is positive in the laboratory pair but negative in the nucleus, which is why that one stays put',
        'It is negative in both cases, since a system that stays together must have negative energy',
        'It is zero in the nucleus, because at such tiny separations the protons are effectively touching',
      ],
      reveal: '**Positive in both cases** — and that is exactly the point.\n\nTwo protons always give $ U = +kq^{2}/r $, whether they are in your laboratory or in a nucleus. Electrostatically they are always trying to fly apart, and the closer they are the harder they try.\n\nSo what holds a nucleus together cannot be electrostatics. It is the **strong nuclear force**, which is far stronger at these distances but has almost no reach beyond them.\n\nThe habit worth taking away: a positive $ U $ always means "wants to separate", a negative $ U $ means "bound". If a system stays together despite a positive electrostatic $ U $, something else is holding it.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'Work done by the field, and work done by you',
      level: 2,
      objective: 'Keep the two works straight, and get their signs right every time.',
    }),
    b('text', 6, {
      markdown: 'Every problem here involves two agents doing work, and they are always equal and opposite.\n\nWhen a charge moves from A to B, the **field** does work $ W_{\\text{field}} $ and the potential energy changes by\n\n$ W_{\\text{field}} = U_A - U_B = -\\Delta U $\n\nIf you move the charge yourself, slowly, so it never picks up any kinetic energy, then your work exactly opposes the field\'s:\n\n$ W_{\\text{ext}} = \\Delta U = U_B - U_A = -W_{\\text{field}} $\n\nThe word **slowly** is not padding — it is what guarantees $ \\Delta KE = 0 $, so that all your work goes into potential energy and none into speed. Nearly every "find the work done" question in this chapter quietly assumes it.',
    }),
    b('table', 7, {
      caption: 'The sign table. Read it once, then reconstruct it from the physics rather than memorising it.',
      headers: ['Situation', '$ \\Delta U $', '$ W_{\\text{field}} $', '$ W_{\\text{ext}} $'],
      rows: [
        ['Two like charges pushed closer', 'increases', 'negative', 'positive'],
        ['Two like charges released, flying apart', 'decreases', 'positive', '—'],
        ['Two unlike charges pulled apart', 'increases', 'negative', 'positive'],
        ['Two unlike charges released, coming together', 'decreases', 'positive', '—'],
      ],
    }),
    b('worked_example', 8, {
      label: 'assembling two charges',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'How much work must an external agent do to bring a charge of $ +3\\ \\mu\\text{C} $ from infinity to a point 20 cm from a fixed charge of $ +5\\ \\mu\\text{C} $, moving it slowly?',
      solution: 'Because the charge moves slowly, all the external work goes into potential energy:\n\n$ W_{\\text{ext}} = \\Delta U = U_{\\text{final}} - U_{\\text{initial}} $\n\nAt infinity $ U_{\\text{initial}} = 0 $ by our choice of zero, so the answer is just the final potential energy:\n\n$ W_{\\text{ext}} = \\frac{kq_1q_2}{r} = \\frac{(9\\times10^{9})(3\\times10^{-6})(5\\times10^{-6})}{0.20} $\n\n$ W_{\\text{ext}} = \\frac{1.35\\times10^{-1}}{0.20} = 0.675\\ \\text{J} $\n\n**Check the sign against the physics.** Both charges are positive, so they repel; pushing them together means working against that repulsion, so the external work **must** be positive. It is.\n\nIf the fixed charge had been $ -5\\ \\mu\\text{C} $, the answer would have been $ -0.675 $ J — negative, because the charge would be pulled in and you would have to hold it *back* rather than push it.',
    }),
    b('image', 9, {
      src: '',
      alt: 'Potential energy against separation for two like charges and two unlike charges',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Like charges sit on a positive curve falling to zero; unlike charges climb a negative curve up to zero.',
      generation_prompt: 'Clean scientific graph on a near-black background (#0B0C0F). Thin dim-grey axes, horizontal labelled r and vertical labelled U in muted white, with the horizontal axis drawn through the middle so both positive and negative U are visible. An amber curve in the upper half falls steeply from a high value near the origin and flattens towards zero at large r, labelled like charges. A cool-blue curve in the lower half rises steeply from a deep negative value near the origin and flattens towards zero at large r, labelled unlike charges. A faint dashed horizontal grey line marks U equals zero, annotated infinitely far apart. Generous dark space, no gridlines, no clutter.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ U = \\frac{kq_1q_2}{r} $ — one power of $ r $, and put the signs in.\n- $ U > 0 $ → repelling, wants to separate. $ U < 0 $ → bound.\n- $ W_{\\text{field}} = -\\Delta U $ and $ W_{\\text{ext}} = +\\Delta U $ when the charge is moved slowly.\n- Zero of energy is at infinity. Every "from infinity" question therefore reduces to computing the final $ U $.',
    }),
    b('text', 11, {
      markdown: 'Next: the same trick that turned force into field — divide out the test charge, and see what belongs to the space itself.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('The electrostatic potential energy of two point charges varies with their separation as',
          ['$ 1/r $', '$ 1/r^{2} $', '$ 1/r^{3} $', '$ r $'],
          0,
          'Force goes as $ 1/r^{2} $; energy is force times distance, so it has one power of $ r $ fewer. Using $ 1/r^{2} $ for energy is the single commonest slip in this topic.',
          1),
        q('A system of two charges has negative potential energy. This tells you that',
          ['the charges are of opposite sign', 'the two charges carry the same sign', 'the charges are stationary at that moment', 'the system has no kinetic energy at all'],
          0,
          '$ U $ carries the sign of $ q_1q_2 $, so a negative value means unlike charges. Physically, negative $ U $ means energy must be supplied to pull the pair apart — the definition of a bound system.',
          2),
        q('A positive charge is moved slowly away from another positive charge. The work done by the electric field is',
          ['positive, and the potential energy decreases', 'negative, and the potential energy decreases', 'positive, and the potential energy increases', 'zero, since the motion is slow'],
          0,
          'The two charges repel, so the field pushes the moving charge exactly the way it is going — positive work. And $ W_{\\text{field}} = -\\Delta U $, so $ U $ falls. The external agent is doing negative work here, holding it back.',
          3),
      ],
    }),
  ],
};

// ── p2 · Electric Potential ──────────────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'electric-potential',
  title: 'Electric Potential',
  subtitle: 'Energy per unit charge — and the end of vector addition',
  glossary: [
    { term: 'electric potential', definition: 'The potential energy per unit charge at a point: $ V = U/q_0 $. A scalar, measured in volts.' },
    { term: 'volt', definition: 'One joule per coulomb. A point is at 1 V if bringing 1 C there from infinity takes 1 J of work.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Every battery, socket and appliance you own is labelled in **volts** — never in newtons per coulomb, and never in field strength.\n\nThere is a reason engineers chose potential over field as the everyday quantity. Potential is a **scalar**. You can add it, subtract it, put it on a meter and print it on a label. Field is a vector, and nobody wants a plug socket rated at "230 units, pointing north-east".',
    }),
    b('text', 1, {
      markdown: 'On the last page, the potential energy $ U $ depended on *which* charge we brought in. Divide that dependence out — exactly as we did to get field from force — and what remains belongs to the point in space:',
    }),
    b('latex_block', 2, {
      latex: 'V = \\frac{U}{q_0}',
      label: 'Definition of electric potential',
      note: 'Unit: the volt (V) = joule per coulomb. A scalar — it has a sign, but no direction.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'In words: **the potential at a point is the work needed to bring one coulomb of positive charge there, slowly, from infinity.**\n\nSo the whole chapter now has two parallel languages, and it is worth seeing them side by side before going further.',
    }),
    b('comparison_card', 4, {
      title: 'Two descriptions of the same electrostatics',
      columns: [
        {
          heading: 'The force language (Chapter 1)',
          points: [
            'Force $ \\vec{F} $ — a vector',
            'Field $ \\vec{E} = \\vec{F}/q_0 $ — a vector',
            'Adding contributions needs components and angles',
            '$ E = kq/r^{2} $ for a point charge',
            'Direction must be stated separately every time',
          ],
        },
        {
          heading: 'The energy language (this chapter)',
          points: [
            'Potential energy $ U $ — a scalar',
            'Potential $ V = U/q_0 $ — a scalar',
            'Adding contributions is ordinary arithmetic',
            '$ V = kq/r $ for a point charge',
            'Only a sign to keep track of',
          ],
        },
      ],
    }),
    b('heading', 5, {
      text: 'The potential of a point charge',
      level: 2,
      objective: 'Write the potential of a point charge and combine several of them without any vectors.',
    }),
    b('text', 6, {
      markdown: 'Take $ U = kqq_0/r $ and divide by $ q_0 $:',
    }),
    b('latex_block', 7, {
      latex: 'V = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{r}',
      label: 'Potential due to a point charge',
      note: 'Positive near a positive charge, negative near a negative one. Zero at infinity.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'And for several charges, the potential at a point is the **algebraic sum**:\n\n$ V = V_1 + V_2 + \\cdots = k\\left(\\frac{q_1}{r_1} + \\frac{q_2}{r_2} + \\cdots\\right) $\n\nRead that carefully, because it is the payoff of the whole chapter. **No components. No angles. No resolving.** You take each charge, divide it by its distance to the point, keep its sign, and add.\n\nOne consequence catches people out: **$ V $ can be zero where $ \\vec{E} $ is not, and $ \\vec{E} $ can be zero where $ V $ is not.** They are different quantities and they vanish for different reasons — $ V $ vanishes when positive and negative contributions cancel *numerically*, $ \\vec{E} $ vanishes when contributions cancel as *vectors*.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'quantitative',
      prompt: 'Two charges $ +q $ and $ -q $ sit a distance $ 2a $ apart. At the midpoint between them, what are $ V $ and $ \\vec{E} $?',
      options: [
        '$ V = 0 $, but $ \\vec{E} \\neq 0 $',
        'Both $ V $ and $ \\vec{E} $ are zero',
        '$ V \\neq 0 $, but $ \\vec{E} = 0 $',
        'Both are non-zero'],
      reveal: '**$ V = 0 $, but $ \\vec{E} $ is definitely not zero.**\n\n*Potential:* $ V = \\frac{kq}{a} + \\frac{k(-q)}{a} = 0 $. The two numbers are equal and opposite, so they cancel.\n\n*Field:* the positive charge pushes away from itself and the negative charge pulls towards itself — **both point the same way**, from $ +q $ towards $ -q $. So they add to $ 2kq/a^{2} $ rather than cancelling.\n\nThis pair of facts is worth carrying around. **Zero potential does not mean zero field, and zero field does not mean zero potential.** Inside a charged spherical shell you get exactly the reverse case: $ \\vec{E} = 0 $ everywhere, while $ V $ is a constant non-zero value throughout.',
      difficulty_level: 3,
    }),
    b('worked_example', 10, {
      label: 'potential at the centre of a square',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Four charges $ +q $, $ -q $, $ +2q $ and $ -2q $ are placed at the four corners of a square of side $ a $. Find the electric potential at the centre.',
      solution: 'Every corner is the same distance from the centre — half a diagonal:\n\n$ r = \\frac{a\\sqrt{2}}{2} = \\frac{a}{\\sqrt{2}} $\n\nNow simply add the four contributions **algebraically**:\n\n$ V = \\frac{k}{r}\\Big(q + (-q) + 2q + (-2q)\\Big) = \\frac{k}{r}\\times 0 = 0 $\n\n**Zero**, and it took one line.\n\nCompare what the field would have cost you: four vectors of two different magnitudes, at four different angles, resolved into components and added. That contrast — one line versus half a page — is the entire reason this chapter exists.\n\n**And note what is *not* zero.** The field at the centre is certainly non-zero here. Only the potential cancels.',
    }),
    b('table', 11, {
      caption: 'Potential of the standard distributions. Each is the field result integrated once — notice every power of $ r $ drops by one.',
      headers: ['Distribution', 'Potential'],
      rows: [
        ['Point charge $ q $', '$ \\frac{kq}{r} $'],
        ['Spherical shell, charge $ Q $, radius $ R $', '$ \\frac{kQ}{R} $ inside and at the surface; $ \\frac{kQ}{r} $ outside'],
        ['Solid charged sphere, charge $ Q $', '$ \\frac{kQ}{2R^{3}}(3R^{2}-r^{2}) $ inside; $ \\frac{kQ}{r} $ outside'],
        ['Ring of charge $ Q $, on its axis', '$ \\frac{kQ}{\\sqrt{x^{2}+R^{2}}} $'],
        ['Dipole, at distance $ r $, angle $ \\theta $ from $ \\vec{p} $', '$ \\frac{kp\\cos\\theta}{r^{2}} $'],
      ],
    }),
    b('text', 12, {
      markdown: 'That last row is worth a second look. On the **axis** of a dipole ($ \\theta = 0 $) the potential is $ kp/r^{2} $; on the **perpendicular bisector** ($ \\theta = 90^\\circ $) $ \\cos\\theta = 0 $, so $ V = 0 $ — everywhere along that line.\n\nWhich makes sense: every point on the bisector is equidistant from $ +q $ and $ -q $, so their potentials cancel exactly. And yet you saw in Chapter 1 that the field there is $ kp/r^{3} $, not zero. The same pair of facts, one more time.',
    }),
    b('image', 13, {
      src: '',
      alt: 'Potential against distance for a positive and a negative point charge',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Potential is signed and falls as 1/r — one power gentler than the field.',
      generation_prompt: 'Clean scientific graph on a near-black background (#0B0C0F). Thin dim-grey axes with the horizontal axis labelled r and drawn through the middle so both signs of V are visible, vertical axis labelled V in muted white. An amber curve in the upper half falls from a high value near the origin, flattening towards zero at large r, labelled positive charge. A cool-blue mirror-image curve in the lower half rises from a deep negative value towards zero, labelled negative charge. A faint dashed grey line marks V equals zero. Generous dark space, no gridlines, no clutter.',
    }),
    b('text', 14, {
      markdown: 'Next: potential at a single point is rarely what you measure. What a voltmeter actually reads is the **difference** between two points.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The electric potential due to a point charge varies with distance as',
          ['$ 1/r $', '$ 1/r^{2} $', '$ 1/r^{3} $', 'it is independent of $ r $'],
          0,
          'The field goes as $ 1/r^{2} $ and potential is the field integrated over distance, so it comes out one power gentler. This is why potential reaches further than field does.',
          1),
        q('At a certain point the electric field is zero. The potential there',
          ['may have any value', 'must also be exactly zero', 'must be positive there', 'must be infinitely large'],
          0,
          'The two are independent. Inside a charged spherical shell the field is zero everywhere while the potential is a constant non-zero value; at the midpoint of a dipole the reverse happens. Zero field means the *slope* of $ V $ is zero, not $ V $ itself.',
          3),
        q('Four equal charges $ +q $ are placed at the corners of a square of side $ a $. The potential at the centre is',
          ['$ \\frac{4\\sqrt{2}\\,kq}{a} $', 'zero', '$ \\frac{4kq}{a} $', '$ \\frac{\\sqrt{2}\\,kq}{a} $'],
          0,
          'Each corner is $ a/\\sqrt{2} $ from the centre, so each contributes $ kq\\sqrt{2}/a $, and four of them add arithmetically to $ 4\\sqrt{2}kq/a $. Answering zero confuses this with the **field**, which does cancel here by symmetry.',
          3),
      ],
    }),
  ],
};

// ── p3 · Potential Difference and Work ───────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'potential-difference-and-work',
  title: 'Potential Difference and Work',
  subtitle: 'What a voltmeter actually measures',
  glossary: [
    { term: 'potential difference', definition: 'The work needed per unit charge to move a charge between two points: $ V_A - V_B = W_{A\\to B}/q $.' },
    { term: 'electron volt', definition: 'The energy gained by one electron accelerated through a potential difference of one volt: $ 1\\ \\text{eV} = 1.6\\times10^{-19} $ J.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A bird sits on a 400,000-volt transmission line, completely unharmed. Touch that same line with a ladder from the ground and you are killed instantly.\n\nThe bird is at 400,000 volts. Why is it fine?',
      hint: 'What is the potential of the bird\'s other foot?',
      reveal: 'Because both of the bird\'s feet are on the **same wire**, at the **same potential**. The potential *difference* across the bird is essentially zero, so no work is done pushing charge through it and no current flows.\n\nThe ladder is a bridge between the wire and the ground — a difference of 400,000 V. That difference is what drives the current.\n\n**Potential on its own does almost nothing. Potential difference is what acts.** That is why every practical measurement is a difference, and why a voltmeter has two leads.',
    }),
    b('text', 1, {
      markdown: 'The work needed to carry a charge $ q $ slowly from point B to point A is',
    }),
    b('latex_block', 2, {
      latex: 'W_{B\\to A} = q\\,(V_A - V_B)',
      label: 'Work and potential difference',
      note: 'Positive work means you had to push. Negative work means the field did the job for you.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Everything about signs follows from this one line, so it is worth spelling out rather than memorising a table.\n\n**A positive charge left free** moves from high potential to low, because that is the direction in which the field does positive work on it — the same way a stone rolls downhill.\n\n**A negative charge left free** does exactly the opposite: it moves from low potential to high. The potential landscape is the same; the charge\'s sign reverses which way is "downhill".\n\nSo you cannot say "charges move to lower potential". You must say **charges move to lower potential energy**, and $ U = qV $ tells you those are the same direction only when $ q $ is positive.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'logical',
      prompt: 'An electron is released from rest at a point where the potential is $ -5 $ V. It is free to move. Does it head towards a region of higher or lower potential?',
      options: ['Higher potential', 'Lower potential', 'It stays at rest', 'It depends on the field strength'],
      reveal: '**Higher potential.**\n\nEnergy is what decides, and for an electron $ U = qV = (-e)V $. To lower its energy, the electron must move to a place where $ V $ is **larger**.\n\nSo a free electron accelerates from low potential to high potential — the opposite of a free proton, in exactly the same landscape.\n\nAnd here is the reason a starting value of $ -5 $ V is a red herring: only the **difference** matters. Whether the point is at $ -5 $ V, $ 0 $ V or $ +1000 $ V changes nothing about which way the electron moves.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'A unit built for the job — the electron volt',
      level: 2,
      objective: 'Convert between electron volts and joules, and say why the unit exists.',
    }),
    b('text', 6, {
      markdown: 'Atomic energies in joules are miserable to work with — an electron in a hydrogen atom is bound by about $ 2.2\\times10^{-18} $ J. So physics uses a unit sized for the job.\n\nOne **electron volt** is the energy an electron gains crossing a potential difference of one volt:\n\n$ 1\\ \\text{eV} = e \\times 1\\ \\text{V} = 1.6\\times10^{-19}\\ \\text{J} $\n\nNow that hydrogen binding energy reads **13.6 eV**, which is a number you can hold in your head. Chemical bonds run at a few eV, X-rays at tens of thousands (keV), and particle accelerators at billions (GeV).\n\nOne warning that catches everyone once: **the eV is a unit of energy, not of potential.** Saying "the electron has 5 electron volts" means 5 units of energy; it says nothing about the potential where it sits.',
    }),
    b('worked_example', 7, {
      label: 'accelerating an electron through 100 V',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An electron starts from rest and is accelerated through a potential difference of $ 100 $ V. Find its final kinetic energy in eV and in joules, and its final speed. Take $ m_e = 9.1\\times10^{-31} $ kg.',
      solution: '**Kinetic energy.** All the work done by the field goes into kinetic energy, since it starts from rest:\n\n$ KE = qV = e \\times 100\\ \\text{V} = 100\\ \\text{eV} $\n\nThat is the whole point of the unit — the answer in eV is just the number of volts, with no arithmetic at all.\n\nIn joules:\n\n$ KE = 100 \\times 1.6\\times10^{-19} = 1.6\\times10^{-17}\\ \\text{J} $\n\n**Speed.** From $ KE = \\tfrac{1}{2}mv^{2} $:\n\n$ v = \\sqrt{\\frac{2\\,KE}{m}} = \\sqrt{\\frac{2(1.6\\times10^{-17})}{9.1\\times10^{-31}}} = \\sqrt{3.52\\times10^{13}} $\n\n$ v = 5.9\\times10^{6}\\ \\text{m/s} $\n\n**Sanity check.** That is about 2% of the speed of light — fast, but comfortably non-relativistic, so $ \\tfrac{1}{2}mv^{2} $ was safe to use. Push the accelerating voltage past a few hundred kilovolts and it would not be.\n\n**Shortcut worth keeping.** For an electron accelerated from rest through $ V $ volts, $ v = \\sqrt{2eV/m} $. Every "accelerated through $ V $" problem in modern physics is this same line.',
    }),
    b('text', 8, {
      markdown: 'One more result to have ready, for the commonest arrangement of all. Between two parallel plates the field is **uniform**, so the work done moving a charge a distance $ d $ along the field is simply $ W = qEd $. Dividing by $ q $:\n\n$ V = Ed \\qquad\\text{or}\\qquad E = \\frac{V}{d} $\n\nThis is why an electric field can equally be quoted in **volts per metre**. A field of $ 1 $ N/C and a field of $ 1 $ V/m are the same thing — check the units and you will find they cancel identically.',
    }),
    b('image', 9, {
      src: '',
      alt: 'A charge moving between two parallel plates, showing the potential difference and the uniform field',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Between parallel plates the field is uniform, so V = Ed — and volts per metre is a field unit.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). Two vertical parallel plates drawn as thin bars, the left one warm amber with plus signs and the right one cool blue with minus signs, separated by evenly spaced horizontal orange field arrows pointing from the amber plate to the blue plate. A small bright particle sits between them with a short motion arrow. A thin dashed grey dimension line between the plates is labelled d, and a curly brace outside is labelled V in muted white. Generous dark space, orange and blue accents only, no clutter.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ W_{B\\to A} = q(V_A - V_B) $. Only **differences** ever matter.\n- Free positive charges fall to lower $ V $; free negative charges climb to higher $ V $. Both are moving to lower $ U $.\n- $ 1\\ \\text{eV} = 1.6\\times10^{-19} $ J — a unit of **energy**, not of potential.\n- Accelerated from rest through $ V $: $ KE = qV $, and for an electron $ v = \\sqrt{2eV/m} $.\n- Uniform field: $ V = Ed $, so N/C and V/m are the same unit.',
    }),
    b('text', 11, {
      markdown: 'Next: if $ V $ tells you the energy landscape, then the field must be its slope. That relation works in both directions, and it is the most useful tool on the next few pages.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('A proton and an electron are each accelerated from rest through the same potential difference. They acquire',
          ['the same kinetic energy but different speeds', 'the same speed but different kinetic energies', 'the same kinetic energy and the same speed', 'different kinetic energies and different speeds'],
          0,
          'The energy gained is $ |q|V $, and both carry the same magnitude of charge — so both gain the same kinetic energy. But the masses differ by a factor of about 1836, so from $ \\tfrac{1}{2}mv^{2} $ the electron ends up far faster.',
          2),
        q('$ 1 $ electron volt is equal to',
          ['$ 1.6\\times10^{-19} $ J', '$ 1.6\\times10^{-19} $ V', '$ 9.1\\times10^{-31} $ J', '$ 1 $ J'],
          0,
          'It is an amount of **energy** — the charge $ e $ multiplied by one volt. The option in volts is the standard trap: the electron volt measures energy, never potential.',
          1),
        q('Two parallel plates 2 cm apart have a potential difference of $ 200 $ V. The field between them is',
          ['$ 10^{4} $ V/m', '$ 100 $ V/m', '$ 400 $ V/m', '$ 4 $ V/m'],
          0,
          '$ E = V/d = 200/0.02 = 10^{4} $ V/m. Answering $ 100 $ V/m means the 2 cm was used as 2 m — converting to metres first prevents that every time.',
          1),
      ],
    }),
  ],
};

// ── p4 · Field and Potential, Both Ways ──────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'field-and-potential-both-ways',
  title: 'Field and Potential, Both Ways',
  subtitle: 'The field is the slope of the potential',
  glossary: [
    { term: 'potential gradient', definition: 'The rate at which the potential changes with distance, $ dV/dr $. The electric field is its negative.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Look at a contour map of a hill. The lines mark equal heights, and where they crowd together the slope is steep — that is where a ball would roll fastest.\n\nAn electric potential map works identically. The potential is the height, and the electric field is the steepness. Crowded contours mean a strong field.\n\nThat is not an analogy for teaching purposes. It is the same mathematics: gravitational potential energy per unit mass and electric potential energy per unit charge behave the same way, and the "slope gives the force" relation is identical in both.',
    }),
    b('text', 1, {
      markdown: 'Move a charge $ q $ a small distance $ dr $ against the field. The work you do is $ -qE\\,dr $, and it equals $ q\\,dV $. Cancelling $ q $:',
    }),
    b('latex_block', 2, {
      latex: 'E = -\\frac{dV}{dr}',
      label: 'Field from potential',
      note: 'The minus sign is the physics: E points DOWNHILL, from high potential to low.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'In three dimensions each component comes from the corresponding partial derivative:\n\n$ E_x = -\\frac{\\partial V}{\\partial x}, \\qquad E_y = -\\frac{\\partial V}{\\partial y}, \\qquad E_z = -\\frac{\\partial V}{\\partial z} $\n\nA partial derivative just means: differentiate with respect to that one variable, treating the others as constants. If $ V = 3x^{2}y $, then $ \\partial V/\\partial x = 6xy $ (with $ y $ held fixed) and $ \\partial V/\\partial y = 3x^{2} $.\n\nAnd it works in reverse too. Integrating the field along any path gives back the potential difference:\n\n$ V_B - V_A = -\\displaystyle\\int_A^B \\vec{E}\\cdot d\\vec{l} $\n\nThe path does not matter — that is the conservative property from page 1 paying off again.',
    }),
    b('heading', 4, {
      text: 'What the minus sign is telling you',
      level: 2,
      objective: 'Use the sign of the potential gradient to predict the direction of the field.',
    }),
    b('text', 5, {
      markdown: 'Three statements, all the same statement:\n\n- $ \\vec{E} $ points in the direction in which $ V $ **decreases** fastest.\n- $ \\vec{E} $ is **perpendicular** to surfaces of constant $ V $ (there is no slope *along* a level surface).\n- Where $ V $ changes steeply, $ E $ is large; where $ V $ is flat, $ E $ is zero.\n\nThat last one settles a question raised earlier. Inside a conductor $ E = 0 $, so $ dV/dr = 0 $, so $ V $ is **constant** throughout. Not zero — constant. A conductor is one flat plateau in the potential landscape, however much charge it carries.',
    }),
    b('step_solver', 6, {
      title: 'Getting the field from a potential function',
      problem: 'The potential in a region is $ V = 5x^{2}y - 3z $ volts, with distances in metres. Find the electric field at the point $ (1,\\ 2,\\ 3) $.',
      intro: 'Three partial derivatives, three components, one minus sign. The method never changes.',
      steps: [
        st('$ E_x = -\\frac{\\partial V}{\\partial x} = -10xy $',
          'Differentiate with respect to $ x $, treating $ y $ and $ z $ as constants. The $ -3z $ term has no $ x $ in it, so it differentiates to zero.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does the $ -3z $ term vanish when differentiating with respect to $ x $?',
              options: ['Because $ z $ is negative', 'Because it contains no $ x $, so it is a constant as far as $ x $ is concerned', 'Because $ z = 3 $ at this point', 'Because the field has no $ z $-component'],
              answer_index: 1,
              feedback_right: 'Exactly — a partial derivative treats every other variable as a fixed constant, and a constant differentiates to zero.',
              feedback_wrong: 'In a partial derivative with respect to $ x $, both $ y $ and $ z $ are held fixed. A term with no $ x $ in it is therefore a constant, and its derivative is zero.',
            },
          }),
        st('$ E_y = -\\frac{\\partial V}{\\partial y} = -5x^{2} $',
          'Now hold $ x $ and $ z $ fixed. The $ 5x^{2}y $ term differentiates to $ 5x^{2} $.'),
        st('$ E_z = -\\frac{\\partial V}{\\partial z} = +3 $',
          'Only the $ -3z $ term survives, and the two minus signs make the result positive.'),
        st('$ \\vec{E} = -10xy\\,\\hat{i} - 5x^{2}\\,\\hat{j} + 3\\,\\hat{k} $',
          'The general field, valid everywhere in the region.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Substitute $ x = 1 $, $ y = 2 $. What is the numerical value of $ E_x $?',
              blank_answer: '-20',
              feedback_right: 'Yes — $ -10(1)(2) = -20 $ V/m.',
              feedback_wrong: '$ E_x = -10xy $, so with $ x = 1 $ and $ y = 2 $ you get $ -10 \\times 1 \\times 2 = -20 $ V/m.',
            },
          }),
        st('$ \\vec{E}(1,2,3) = \\left(-20\\,\\hat{i} - 5\\,\\hat{j} + 3\\,\\hat{k}\\right)\\ \\text{V/m}$',
          'Substitute the point. Note that $ z $ never appears in the answer, because $ V $ depended on $ z $ only linearly.'),
      ],
      now_you_try: {
        problem: 'The potential in a region is $ V = 4x^{2} $ volts. Find the field at $ x = 2 $ m.',
        answer: '$ \\vec{E} = -16\\,\\hat{i} $ V/m',
        solution: '$ E_x = -\\frac{dV}{dx} = -8x $, so at $ x = 2 $, $ E_x = -16 $ V/m.\n\nThe field points in the $ -x $ direction — that is, towards smaller $ x $, where $ V $ is smaller. The minus sign is doing exactly the job it is there for.',
      },
    }),
    b('heading', 7, {
      text: 'Reading the two graphs together',
      level: 2,
      objective: 'Sketch the potential graph for a charged shell from its field graph, and vice versa.',
    }),
    b('text', 8, {
      markdown: 'The relation $ E = -dV/dr $ means the two graphs of any distribution are locked together, and each acts as a check on the other. Take the **charged spherical shell** from Chapter 1:\n\n**Inside** ($ r < R $): $ E = 0 $. Zero slope means $ V $ is a **horizontal line** — constant at $ kQ/R $, not zero.\n\n**At the surface**: $ E $ jumps discontinuously. A jump in the slope means $ V $ has a **kink** — it is continuous, but it changes direction abruptly.\n\n**Outside** ($ r > R $): $ E = kQ/r^{2} $, so $ V = kQ/r $ — a gentler curve, exactly one power of $ r $ shallower.\n\nAnd this is the general rule: **$ V $ is always continuous, even where $ E $ is not.** A jump in the potential would mean an infinite field.',
    }),
    b('image', 9, {
      src: '',
      alt: 'Field and potential graphs for a charged spherical shell drawn one above the other',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Flat V means zero E. A jump in E means a kink in V. V never jumps.',
      generation_prompt: 'Clean scientific graph panel on a near-black background (#0B0C0F), two graphs stacked vertically and sharing a common horizontal axis position, with a faint vertical dashed grey line at R running through both. Upper graph: thin dim-grey axes, vertical labelled E in muted white, an amber trace that runs flat along zero from the origin to R, jumps vertically at R, then falls smoothly as one over r squared. Lower graph: vertical axis labelled V, an amber trace that runs flat and horizontal at a positive value from the origin to R, then bends at R into a smooth one-over-r decay with a clearly visible kink and no vertical jump. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'analogical',
      prompt: 'In a certain region the electric potential is constant. What can you say about the electric field there?',
      options: ['It is zero throughout the region', 'It is constant but non-zero', 'It is perpendicular to the region', 'Nothing can be said without more information'],
      reveal: '**It is zero throughout the region.**\n\n$ E = -dV/dr $, and a constant $ V $ has zero slope in every direction. No slope, no field.\n\nThe contour-map picture makes it obvious: a region of constant height is flat ground, and a ball placed anywhere on it stays put.\n\n**Do not read it backwards, though.** Zero field over a region does mean constant potential. But zero field at a *single point* says nothing about the neighbourhood — at the null point between two like charges the field vanishes at that one point, yet the potential is certainly not constant around it — $ V $ dips to a minimum there and climbs again on either side.',
      difficulty_level: 2,
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ E = -\\frac{dV}{dr} $; in components, $ E_x = -\\frac{\\partial V}{\\partial x} $ and so on.\n- $ \\vec{E} $ points from **high** $ V $ to **low** $ V $, always.\n- Constant $ V $ over a region → $ E = 0 $ there. Inside a conductor, both are true.\n- $ V $ is continuous everywhere; $ E $ may jump (across a charged surface).\n- Unit check: V/m and N/C are the same unit.',
    }),
    b('text', 12, {
      markdown: 'Next: if the field is always perpendicular to surfaces of constant potential, those surfaces are worth drawing — and they turn out to be the most useful picture in the chapter.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The electric field points',
          ['from higher potential to lower potential', 'from lower potential to higher potential', 'along surfaces of constant potential', 'always radially outward'],
          0,
          'That is what the minus sign in $ E = -dV/dr $ encodes. A positive charge released in the field therefore moves towards lower potential — downhill on the potential landscape.',
          1),
        q('The potential in a region is given by $ V = 6x $ volts. The electric field is',
          ['$ -6\\,\\hat{i} $ V/m, uniform', '$ +6\\,\\hat{i} $ V/m, uniform', '$ -6x\\,\\hat{i} $ V/m', 'zero'],
          0,
          '$ E_x = -dV/dx = -6 $ V/m, independent of position — so the field is uniform and points along $ -x $, towards smaller $ V $. Dropping the minus sign would reverse the field, which is the usual error here.',
          2),
        q('Inside a charged hollow conductor, the potential is',
          ['constant, at its surface value', 'zero at every interior point', 'increasing towards the centre', 'decreasing towards the centre'],
          0,
          'The field inside is zero, so the potential has zero slope and cannot change — it stays at whatever it is on the surface. Note that constant is not the same as zero: a charged conductor sits at a non-zero potential throughout.',
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
