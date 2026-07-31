'use strict';
/**
 * Class 12 Physics · Ch.1 "Electrostatics" — pages 10–12.
 * The electric dipole: what it is, its field, and its behaviour in a uniform field.
 *
 * Run: node scripts/physics12-book/build_ch1_c_dipole.js
 */
const { b, q, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 1;

// ── p10 · The Electric Dipole ────────────────────────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'the-electric-dipole',
  title: 'The Electric Dipole',
  subtitle: 'Two charges, one arrow — and most of chemistry',
  glossary: [
    { term: 'electric dipole', definition: 'A pair of equal and opposite point charges separated by a small fixed distance.' },
    { term: 'dipole moment', definition: 'The vector $ \\vec{p} $ describing a dipole: magnitude $ q \\times 2a $, direction from the negative charge to the positive charge.' },
    { term: 'ideal dipole', definition: 'The limit in which the separation shrinks to zero and the charge grows so that $ p $ stays fixed — the case where the simple $ 1/r^3 $ formulas are exact.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A water molecule is electrically neutral. It has exactly as many protons as electrons — net charge zero.\n\nAnd yet water dissolves salt, sticks to itself, climbs up plant stems, and heats your food in a microwave oven. All of that happens because the molecule is neutral **but lopsided**: the oxygen end pulls the shared electrons closer, so one end is slightly negative and the other slightly positive.\n\nThat lopsidedness has a name and a symbol, and it is what this page is about.',
    }),
    b('text', 1, {
      markdown: 'An **electric dipole** is a pair of equal and opposite point charges, $ +q $ and $ -q $, held a fixed small distance $ 2a $ apart.\n\nThe total charge is zero. So from very far away it should look like nothing at all — and it nearly does. But "nearly" is where all the physics is: the two charges are at *different places*, so their fields do not quite cancel, and what is left over is the dipole field.\n\nWe describe the whole arrangement with a single vector, the **electric dipole moment**:',
    }),
    b('latex_block', 2, {
      latex: '\\vec{p} = q\\,(2a)\\,\\hat{n}',
      label: 'Electric dipole moment',
      note: 'Magnitude = charge × separation. Direction: from the NEGATIVE charge towards the POSITIVE charge. Unit: C·m.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The direction convention is worth fixing right now, because it is the source of endless sign errors:\n\n> $ \\vec{p} $ points from $ -q $ **to** $ +q $.\n\nBe warned: chemistry textbooks often draw the arrow the other way, from positive to negative, to show which way the electrons shifted. Physics uses $ -q \\to +q $. In this book, and in your exam, use the physics convention.\n\nWhy bother compressing two charges into one vector? Because $ \\vec{p} $ turns out to be the *only* thing about the dipole that the outside world can measure. Two very different pairs of charges with the same $ p $ produce identical fields far away, and feel identical torques. **The dipole moment is the dipole**, as far as the physics is concerned.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'quantitative',
      prompt: 'Dipole A is $ \\pm 2q $ separated by $ d $. Dipole B is $ \\pm q $ separated by $ 2d $. How do their dipole moments compare?',
      options: ['They are equal', 'A is twice B', 'B is twice A', 'A is four times B'],
      reveal: '**They are equal** — both have $ p = 2qd $.\n\nAnd because far-field behaviour depends only on $ p $, a distant observer could not tell these two apart by any measurement. The individual charge and the individual separation are invisible from outside; only their product survives.\n\nThis is exactly why the **ideal dipole** (or "point dipole") is a useful idea: let $ 2a \\to 0 $ and $ q \\to \\infty $ keeping $ p $ fixed. All the approximate formulas on the next page become exact, and nothing observable is lost.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'Where dipoles come from',
      level: 2,
      objective: 'Distinguish a permanent dipole from an induced one, and give an example of each.',
    }),
    b('text', 6, {
      markdown: '**Permanent dipoles** exist because of how a molecule is built. In HCl, water or HF, one atom pulls the shared electrons harder than the other, so the centres of positive and negative charge never coincide. These molecules are called **polar**, and they have a dipole moment even with no field around.\n\n**Induced dipoles** are created by a field. Put a neutral atom in a field and the electron cloud shifts slightly one way while the nucleus shifts the other. The atom becomes a small dipole *while the field is on*, and stops being one when the field is removed.\n\nYou have already met the induced kind — on page 2, when the comb picked up neutral paper. Every paper molecule became a tiny induced dipole, and every one of them was pulled towards the comb.',
    }),
    b('callout', 7, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'A **microwave oven** works by shouting at water\'s dipole moment.\n\nThe oven fills its cavity with an electric field that reverses direction about 2.45 billion times a second. Every water molecule in the food is a permanent dipole, so it tries to turn and line up with the field — and then the field flips, and it has to turn back.\n\nThe molecules cannot keep up. They jostle their neighbours as they twist, and that jostling *is* heat. Which is why a microwave heats a bowl of soup beautifully and a dry ceramic plate barely at all: no water, no dipoles, no twisting.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F). Left: several V-shaped water molecules drawn as three connected circles — a larger cool-blue oxygen and two smaller warm-amber hydrogens — each carrying a small orange dipole arrow, all pointing in random directions. Right: the same molecules with their arrows aligned along a set of horizontal orange field arrows, with small curved motion lines showing them twisting. A dim grey oven cavity outline frames both. Muted white minimal labels, generous dark space, orange and blue accents only.',
    }),
    b('image', 8, {
      src: '',
      alt: 'A dipole shown as two opposite charges separated by 2a with the dipole moment vector pointing from negative to positive',
      width: 'half',
      aspect_ratio: '4:3',
      caption: 'The dipole moment points from the negative charge to the positive charge. Chemistry draws it the other way — physics does not.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). Two spheres on a horizontal line: a cool blue one marked minus q at left, a warm amber one marked plus q at right, with a thin dim-grey dimension line between them labelled 2a. A bold orange arrow runs from the blue sphere to the amber sphere, labelled p in muted white. Generous dark space, thin lines, no clutter.',
    }),
    b('text', 9, {
      markdown: 'Next: two charges, two fields, and a subtraction that almost — but not quite — cancels.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('The electric dipole moment vector points',
          ['from the negative charge to the positive charge', 'from the positive charge to the negative charge', 'always along the external field', 'perpendicular to the line joining the charges'],
          0,
          'That is the physics convention, and it is what every formula in this chapter assumes. Chemistry books often draw the arrow the opposite way to show the direction the electrons shifted — worth knowing, but not what you use here.',
          1),
        q('An electric dipole has zero net charge. Therefore its electric field at a distant point is',
          ['small but not zero, falling off as $ 1/r^{3} $', 'exactly zero, since the charges cancel', 'the same as that of a single point charge $ q $', 'zero only along the perpendicular bisector'],
          0,
          'The two fields nearly cancel, but not exactly, because the charges sit at different places. What is left falls off as $ 1/r^{3} $ rather than $ 1/r^{2} $ — faster, but never zero.',
          2),
        q('A neutral atom placed in a uniform electric field',
          ['becomes an induced dipole', 'gains a net positive charge from the field', 'is unaffected, since it is electrically neutral', 'becomes a permanent dipole from then on'],
          0,
          'The field pulls the electron cloud one way and the nucleus the other, separating their centres slightly. That is an induced dipole, and it disappears the moment the field does. No charge is gained or lost — the atom stays neutral throughout.',
          2),
      ],
    }),
  ],
};

// ── p11 · The Field of a Dipole ──────────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'the-field-of-a-dipole',
  title: 'The Field of a Dipole',
  subtitle: 'Axis and bisector — and where the factor of 2 comes from',
  glossary: [
    { term: 'axial line', definition: 'The line through both charges of the dipole, extended outwards. Also called the end-on position.' },
    { term: 'equatorial line', definition: 'The perpendicular bisector of the dipole — the line through its centre at right angles to $ \\vec{p} $. Also called the broadside-on position.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Stand at a distance $ r $ from a dipole, once on its axis and once on its perpendicular bisector — the same $ r $ both times.\n\nIs the field the same at both places? If not, which is stronger, and by how much?',
      hint: 'On the axis, one charge is clearly nearer than the other. On the bisector, both are the same distance away.',
      reveal: 'The axial field is **twice** the equatorial field. Every time, at any distance, for any dipole.\n\nThe reason is in the geometry. On the **axis** the near charge is closer than the far charge, so its field wins and the two partly reinforce along the axis. On the **bisector** both charges are equidistant, so their fields are equal in size — and when you add them, everything cancels except a component antiparallel to $ \\vec{p} $, which is smaller.\n\nThat factor of 2 is one of the most heavily used numbers in this chapter.',
    }),
    b('text', 1, {
      markdown: 'Both results come from the same move: write the field of each charge, and subtract. The algebra is a page of it; the results are two lines. Here is what comes out.',
    }),
    b('heading', 2, {
      text: 'On the axis (end-on)',
      level: 2,
      objective: 'State the axial field of a dipole exactly and in the far-field limit, with its direction.',
    }),
    b('text', 3, {
      markdown: 'Stand a distance $ r $ from the centre of the dipole, on the line through both charges. The near charge is at $ r-a $ and the far one at $ r+a $, so their fields differ. Subtracting:\n\n$ E_{\\text{axis}} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{2pr}{(r^{2}-a^{2})^{2}} $\n\nand for a point far compared with the dipole size ($ r \\gg a $), which is nearly always the case:',
    }),
    b('latex_block', 4, {
      latex: 'E_{\\text{axis}} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{2p}{r^{3}}',
      label: 'Axial field of a short dipole',
      note: 'Direction: PARALLEL to p — that is, along the dipole moment.',
      highlight: true,
    }),
    b('heading', 5, {
      text: 'On the perpendicular bisector (broadside-on)',
      level: 2,
      objective: 'State the equatorial field and explain why it points opposite to the dipole moment.',
    }),
    b('text', 6, {
      markdown: 'Now stand a distance $ r $ from the centre, at right angles to the dipole. Both charges are the same distance $ \\sqrt{r^{2}+a^{2}} $ away, so their fields are **equal in magnitude**.\n\nResolve each into a component along $ \\vec{p} $ and one perpendicular to it. The perpendicular components cancel exactly. The components along $ \\vec{p} $ survive — and both point from $ +q $ towards $ -q $, which is **backwards** along $ \\vec{p} $. So:\n\n$ E_{\\perp} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{p}{(r^{2}+a^{2})^{3/2}} $\n\nand for $ r \\gg a $:',
    }),
    b('latex_block', 7, {
      latex: 'E_{\\perp} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{p}{r^{3}}',
      label: 'Equatorial field of a short dipole',
      note: 'Direction: ANTIPARALLEL to p — opposite to the dipole moment.',
      highlight: true,
    }),
    b('table', 8, {
      caption: 'The whole dipole field, side by side. Same distance, factor of two, opposite directions.',
      headers: ['', 'Axial (end-on)', 'Equatorial (broadside-on)'],
      rows: [
        ['Exact', '$ \\frac{1}{4\\pi\\varepsilon_0}\\frac{2pr}{(r^{2}-a^{2})^{2}} $', '$ \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{(r^{2}+a^{2})^{3/2}} $'],
        ['Short dipole ($ r \\gg a $)', '$ \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^{3}} $', '$ \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^{3}} $'],
        ['Direction', 'parallel to $ \\vec{p} $', 'antiparallel to $ \\vec{p} $'],
        ['Ratio at equal $ r $', '$ E_{\\text{axis}} = 2E_{\\perp} $', '—'],
      ],
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'quantitative',
      prompt: 'At a far point a distance $ r $ along the axis of a dipole, the field is $ E $. What is the field at a distance $ 2r $ along the perpendicular bisector?',
      options: ['$ E/16 $, in the opposite direction to $ \\vec{p} $', '$ E/16 $, in the same direction as $ \\vec{p} $', '$ E/8 $, in the opposite direction to $ \\vec{p} $', '$ E/2 $, in the opposite direction to $ \\vec{p} $'],
      reveal: '**$ E/16 $, opposite to $ \\vec{p} $.**\n\nDo it in two independent steps and it becomes easy.\n\n*Step 1 — the position.* Going from axial to equatorial at the **same** distance costs a factor of 2, so the equatorial field at distance $ r $ would be $ E/2 $.\n\n*Step 2 — the distance.* The dipole field goes as $ 1/r^{3} $, so moving from $ r $ to $ 2r $ divides by $ 2^{3} = 8 $.\n\nTogether: $ E/2 \\div 8 = E/16 $.\n\n*Direction:* equatorial fields point **against** $ \\vec{p} $, so the sign flips too. Written as a vector, $ \\vec{E}\' = -\\vec{E}/16 $.\n\nThe habit worth stealing here is doing the two factors separately. Trying to do position and distance in one step is where mistakes live.',
      difficulty_level: 3,
    }),
    b('text', 10, {
      markdown: 'For a point at a general angle $ \\theta $ from the dipole axis, the two results combine into\n\n$ E = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{p}{r^{3}}\\sqrt{1+3\\cos^{2}\\theta} $\n\nCheck it against what you already know: at $ \\theta = 0^\\circ $ (on the axis) the square root becomes $ \\sqrt{4} = 2 $, giving $ 2kp/r^{3} $; at $ \\theta = 90^\\circ $ (on the bisector) it becomes $ \\sqrt{1} = 1 $, giving $ kp/r^{3} $. Both special cases fall straight out — which is how you should check any general formula you are handed.',
    }),
    b('heading', 11, {
      text: 'Why $ 1/r^{3} $, and why it matters',
      level: 2,
      objective: 'Explain the faster falloff of a dipole field in terms of cancellation.',
    }),
    b('text', 12, {
      markdown: 'A point charge gives $ 1/r^{2} $. A dipole gives $ 1/r^{3} $ — it dies away **faster**.\n\nThat is not a coincidence; it is the near-cancellation showing up in the mathematics. The two charges are trying to cancel, and the further you go the better they succeed, because the difference between $ r-a $ and $ r+a $ matters less and less. What survives is one extra power of $ r $ down.\n\nThis is a general pattern. A neutral object with a dipole moment falls as $ 1/r^{3} $; one that is neutral **and** has no dipole moment falls as $ 1/r^{4} $, and so on. The more complete the cancellation, the faster the field dies — which is exactly why the enormous number of charges in ordinary matter produce almost no field at a distance.',
    }),
    b('image', 13, {
      src: '',
      alt: 'Field of a dipole showing the axial direction parallel to p and the equatorial direction antiparallel to p',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Axial field along p, equatorial field against it, and twice as strong on the axis at equal distance.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). At centre, a small dipole: a cool blue minus sphere and a warm amber plus sphere side by side horizontally, with a short bold orange arrow between them labelled p. Curved dim-orange field lines loop from the amber sphere around to the blue one. On the horizontal axis at some distance to the right, a bold orange arrow pointing right, labelled E axial. Directly above the dipole at a similar distance, a shorter orange arrow pointing LEFT, labelled E equatorial. Thin dashed grey radius lines from the dipole centre to each arrow, both marked r. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ E_{\\text{axis}} = \\frac{2kp}{r^{3}} $, along $ \\vec{p} $. $ E_{\\perp} = \\frac{kp}{r^{3}} $, against $ \\vec{p} $. Ratio 2 : 1 at equal $ r $.\n- Both are $ 1/r^{3} $ — **faster** than a point charge, because the charges nearly cancel.\n- General angle: $ E = \\frac{kp}{r^{3}}\\sqrt{1+3\\cos^{2}\\theta} $. Check it at $ 0^\\circ $ and $ 90^\\circ $.\n- Combined problems: handle the **position change** and the **distance change** as two separate factors.',
    }),
    b('text', 15, {
      markdown: 'Next: we have put a dipole in space. Now put it in somebody else\'s field and watch it turn.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The ratio of the axial field to the equatorial field of a short dipole, at the same distance, is',
          ['2 : 1', '1 : 2', '4 : 1', '1 : 1'],
          0,
          'On the axis one charge is nearer than the other so the fields partly reinforce; on the bisector both are equidistant and only a smaller reversed component survives. The result is exactly a factor of two, at every distance.',
          1),
        q('The electric field of a short dipole varies with distance as',
          ['$ 1/r^{3} $', '$ 1/r^{2} $', '$ 1/r $', '$ 1/r^{4} $'],
          0,
          'The near-total cancellation between the two opposite charges costs one extra power of $ r $ compared with a single point charge. A quadrupole — neutral and with zero dipole moment — would go one further still, as $ 1/r^{4} $.',
          1),
        q('At a point on the perpendicular bisector of a dipole, the direction of the field is',
          ['antiparallel to $ \\vec{p} $', 'parallel to $ \\vec{p} $', 'perpendicular to $ \\vec{p} $', 'zero'],
          0,
          'Both charges are equidistant, so the components perpendicular to $ \\vec{p} $ cancel, and what remains points from the positive charge towards the negative one — the reverse of $ \\vec{p} $. The potential there is zero, but the field is not; those are different quantities.',
          3),
      ],
    }),
  ],
};

// ── p12 · A Dipole in a Uniform Field ────────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'a-dipole-in-a-uniform-field',
  title: 'A Dipole in a Uniform Field',
  subtitle: 'No push, but a twist — torque, energy and equilibrium',
  glossary: [
    { term: 'torque', definition: 'The turning effect of a force, $ \\vec{\\tau} = \\vec{r}\\times\\vec{F} $. For a dipole in a field, $ \\vec{\\tau} = \\vec{p}\\times\\vec{E} $.' },
    { term: 'stable equilibrium', definition: 'A position of minimum potential energy — displace the body slightly and a restoring torque brings it back.' },
    { term: 'unstable equilibrium', definition: 'A position of maximum potential energy — the smallest displacement produces a torque that pushes it further away.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A compass needle is a magnetic dipole, and it does something very specific in the Earth\'s field: it **turns**, but it does not get dragged north.\n\nAn electric dipole in a uniform electric field behaves exactly the same way. It feels a twist and no push. Understanding why is the whole of this page — and it will come back word for word in Chapter 4, where the dipole is magnetic instead of electric.',
    }),
    b('heading', 1, {
      text: 'Force: zero',
      level: 2,
      objective: 'Show that the net force on a dipole in a uniform field is zero, and say when it is not.',
    }),
    b('text', 2, {
      markdown: 'Put a dipole in a uniform field $ \\vec{E} $ at some angle $ \\theta $ to it. The positive charge feels $ +q\\vec{E} $ and the negative charge feels $ -q\\vec{E} $.\n\nEqual magnitudes. Opposite directions. So\n\n$ \\vec{F}_{\\text{net}} = q\\vec{E} + (-q\\vec{E}) = 0 $\n\nA dipole in a **uniform** field does not translate. Its centre of mass stays where it is, whatever angle it sits at.\n\nThe word **uniform** is doing all the work. In a **non-uniform** field the two charges sit in different field strengths, the two forces no longer match, and there **is** a net force — which is why the comb pulls the paper *towards* it. A comb\'s field is strongly non-uniform.',
    }),
    b('heading', 3, {
      text: 'Torque: not zero',
      level: 2,
      objective: 'Write the torque on a dipole and identify the orientations where it vanishes.',
    }),
    b('text', 4, {
      markdown: 'The two forces are equal and opposite but they do **not** act along the same line. Two such forces form a couple, and a couple produces a pure twist.\n\nTaking moments about the centre of the dipole and adding:',
    }),
    b('latex_block', 5, {
      latex: '\\vec{\\tau} = \\vec{p}\\times\\vec{E}, \\qquad |\\vec{\\tau}| = pE\\sin\\theta',
      label: 'Torque on a dipole in a uniform field',
      note: 'θ is the angle between p and E. Maximum at θ = 90°, zero at θ = 0° and θ = 180°.',
      highlight: true,
    }),
    b('text', 6, {
      markdown: 'Read the $ \\sin\\theta $ carefully, because it says three things at once:\n\n- At $ \\theta = 90^\\circ $ (dipole across the field) the torque is **maximum**, $ pE $.\n- At $ \\theta = 0^\\circ $ (aligned with the field) it is **zero**.\n- At $ \\theta = 180^\\circ $ (pointing backwards) it is **also zero**.\n\nSo there are two orientations with no torque at all. They are not equivalent, and separating them is the point of the rest of this page.',
    }),
    b('heading', 7, {
      text: 'Potential energy, and the two equilibria',
      level: 2,
      objective: 'Use the sign of $ U $ to decide which of the two zero-torque positions is stable.',
    }),
    b('text', 8, {
      markdown: 'Turning the dipole against the torque takes work, so the dipole stores potential energy that depends on its angle. Integrating the work done from the $ 90^\\circ $ position (taken as the zero of energy) round to angle $ \\theta $:',
    }),
    b('latex_block', 9, {
      latex: 'U(\\theta) = -\\vec{p}\\cdot\\vec{E} = -pE\\cos\\theta',
      label: 'Potential energy of a dipole in a uniform field',
      note: 'The zero is chosen at θ = 90°. That is a convention, and every standard result below uses it.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'Now the two zero-torque positions separate cleanly:\n\n**At $ \\theta = 0^\\circ $** — aligned with the field — $ U = -pE $, the **minimum** possible. Nudge it and the torque pushes it back. This is **stable equilibrium**.\n\n**At $ \\theta = 180^\\circ $** — pointing backwards — $ U = +pE $, the **maximum**. Nudge it and the torque carries it further away, all the way round to $ 0^\\circ $. This is **unstable equilibrium**.\n\nThis is exactly the pencil analogy: a pencil lying flat is stable, a pencil balanced on its tip is not, and both are technically "equilibrium".',
    }),
    b('table', 11, {
      caption: 'The two zero-torque orientations, compared.',
      headers: ['', '$ \\theta = 0^\\circ $ (aligned)', '$ \\theta = 180^\\circ $ (anti-aligned)'],
      rows: [
        ['Net force', 'zero', 'zero'],
        ['Torque', 'zero', 'zero'],
        ['Potential energy', '$ -pE $ (minimum)', '$ +pE $ (maximum)'],
        ['If displaced slightly', 'restoring torque brings it back', 'torque pushes it further away'],
        ['Verdict', '**stable**', '**unstable**'],
      ],
      highlight_row: [4],
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'A dipole sits at $ \\theta = 180^\\circ $ in a uniform field. Both the net force and the net torque on it are zero. Is it therefore in equilibrium?',
      options: [
        'Yes — but unstable equilibrium, since the energy is at a maximum',
        'No — zero torque means it cannot be in equilibrium',
        'Yes, and it is stable, since nothing is acting on it',
        'No — a dipole is never in equilibrium in a field',
      ],
      reveal: '**Yes — it is in equilibrium, but the unstable kind.**\n\nEquilibrium means zero net force and zero net torque, and both are satisfied here. The dipole genuinely will sit there for ever, provided nothing disturbs it.\n\nBut the potential energy is at its **maximum**, $ +pE $. The smallest nudge produces a torque that turns it further, and it flips right round to $ 0^\\circ $.\n\nThe test is always the energy, never the torque. Torque tells you *whether* it is an equilibrium; the energy — minimum or maximum — tells you *what kind*.',
      difficulty_level: 2,
    }),
    b('text', 13, {
      markdown: '**Work done in turning it.** Because $ U $ depends only on the angle, the work done by an external agent rotating the dipole from $ \\theta_1 $ to $ \\theta_2 $ is just the change in $ U $:\n\n$ W_{\\text{ext}} = U(\\theta_2) - U(\\theta_1) = pE\\left(\\cos\\theta_1 - \\cos\\theta_2\\right) $\n\nThe work done by the **field** is the negative of that. Two standard cases worth having ready:\n\n- $ 0^\\circ \\to 180^\\circ $ (a complete flip): $ W_{\\text{ext}} = pE(1-(-1)) = 2pE $ — the largest possible.\n- $ 0^\\circ \\to 90^\\circ $: $ W_{\\text{ext}} = pE(1-0) = pE $.',
    }),
    b('worked_example', 15, {
      label: 'turning a dipole, twice',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An electric dipole of moment $ p = 4 \\times 10^{-9} $ C·m sits in a uniform field $ E = 5 \\times 10^{4} $ N/C. Find (a) the maximum torque it can experience, and (b) the work needed to rotate it from the aligned position through $ 180^\\circ $.',
      solution: '**(a) Maximum torque.** $ \\tau = pE\\sin\\theta $ is largest at $ \\theta = 90^\\circ $, where $ \\sin\\theta = 1 $:\n\n$ \\tau_{\\max} = pE = (4\\times10^{-9})(5\\times10^{4}) = 2\\times10^{-4}\\ \\text{N·m} $\n\n**(b) Work for a complete flip.** From $ \\theta_1 = 0^\\circ $ to $ \\theta_2 = 180^\\circ $:\n\n$ W_{\\text{ext}} = pE(\\cos 0^\\circ - \\cos 180^\\circ) = pE(1-(-1)) = 2pE $\n\n$ W_{\\text{ext}} = 2(2\\times10^{-4}) = 4\\times10^{-4}\\ \\text{J} $\n\n**Reading the answer.** Both numbers come out of the same product $ pE $, which is worth noticing: $ pE $ is the natural energy scale of a dipole in a field, and every result on this page is some small multiple of it.\n\nAlso note the sign logic. Going from $ 0^\\circ $ to $ 180^\\circ $ moves the dipole from minimum energy to maximum energy, so the external work must be **positive** — you have to push it uphill the whole way. If a calculation ever hands you a negative answer for this particular rotation, you have swapped $ \\theta_1 $ and $ \\theta_2 $.',
    }),
    b('image', 16, {
      src: '',
      alt: 'Dipole in a uniform field at an angle, showing the two opposite forces forming a couple, plus the stable and unstable orientations',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Equal and opposite forces on different lines make a couple: no push, pure twist.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), three panels side by side separated by thin grey rules, with evenly spaced horizontal orange field-line arrows running left to right across all three. Panel 1: a dipole tilted at about 45 degrees to the field — a cool blue minus sphere and a warm amber plus sphere joined by a thin grey rod with an orange p arrow along it; a bold orange force arrow points right at the plus sphere and left at the minus sphere, with a curved amber arrow showing the resulting rotation. Panel 2: the dipole lying horizontally with p pointing right along the field, labelled stable in muted white. Panel 3: the dipole horizontal with p pointing left against the field, labelled unstable. Generous dark space, orange and blue accents only, no clutter.',
    }),
    b('text', 17, {
      markdown: 'Next: a completely different way to think about fields — one that turns some very hard integrals into a single line of symmetry.',
    }),
    b('inline_quiz', 18, {
      pass_threshold: 0.6,
      questions: [
        q('A dipole is placed in a **non-uniform** electric field. It experiences',
          ['both a net force and, in general, a torque', 'a torque but no net force', 'a net force but no torque', 'neither, since it is electrically neutral'],
          0,
          'In a non-uniform field the two charges sit in different field strengths, so the two forces no longer cancel and there is a net force. The torque is generally non-zero too. The "torque but no force" result belongs specifically to the uniform case.',
          2),
        q('The work done in rotating a dipole from the stable position to the unstable position in a uniform field $ E $ is',
          ['$ 2pE $', '$ pE $', 'zero', '$ pE/2 $'],
          0,
          'Stable means $ U = -pE $ and unstable means $ U = +pE $, so the change is $ +2pE $. This is the largest work any rotation of the dipole can require.',
          2),
        q('At which angle between $ \\vec{p} $ and $ \\vec{E} $ is the torque on a dipole maximum?',
          ['$ 90^\\circ $', '$ 0^\\circ $', '$ 180^\\circ $', '$ 45^\\circ $'],
          0,
          '$ \\tau = pE\\sin\\theta $ peaks where $ \\sin\\theta = 1 $. At $ 0^\\circ $ and $ 180^\\circ $ the torque vanishes entirely — those are the two equilibrium orientations.',
          1),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p10, p11, p12]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
