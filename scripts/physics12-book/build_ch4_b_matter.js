'use strict';
/**
 * Class 12 Physics · Ch.4 "Magnetic Properties of Matter" — pages 5–9.
 * Earth's magnetism, neutral points and the tangent law, the three fields
 * B/H/M, dia- and paramagnetism, and ferromagnetism with hysteresis.
 *
 * Run: node scripts/physics12-book/build_ch4_b_matter.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 4;

// ── p5 · The Earth as a Magnet ───────────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'the-earth-as-a-magnet',
  title: 'The Earth as a Magnet',
  subtitle: 'Declination, dip, and why a compass does not quite point north',
  glossary: [
    { term: 'magnetic declination', definition: 'The angle at a place between geographic north and magnetic north — the horizontal error in a compass.' },
    { term: 'angle of dip', definition: 'The angle the Earth\'s field makes with the horizontal at a place. Also called inclination.' },
    { term: 'horizontal component', definition: 'The horizontal part of the Earth\'s field, $ B_H $ — the only part a freely pivoted compass responds to.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A compass needle points north. Two things about that statement are wrong, and one of them is genuinely surprising.\n\nCan you find them?',
      hint: 'Which north? And is the needle really horizontal?',
      reveal: '**First: it does not point to geographic north.** The magnetic pole is offset from the axis of rotation, so a compass is out by an angle — the **declination** — which depends on where you are standing. Sailors have corrected for it for centuries.\n\n**Second, and stranger: the field is not horizontal.** In Delhi it points about $ 42^\\circ $ *into the ground*. A needle free to swing in every direction would dip its north end downward, not lie flat. Compasses only look horizontal because they are deliberately pivoted to swing in a horizontal plane, which throws away that information.\n\n**And a bonus third:** the thing at the geographic north is a magnetic **south** pole. It has to be — that is what attracts the north end of your needle.',
    }),
    b('text', 1, {
      markdown: 'To a good approximation the Earth behaves like a huge bar magnet at its centre, tilted about $ 11^\\circ $ from the rotation axis, with a dipole moment of roughly $ 8\\times10^{22}\\ \\text{A·m}^{2} $.\n\n(Where that magnet comes from is a separate and unsettled question — the current best answer is the **dynamo effect**: circulating currents in the molten iron of the outer core. It is emphatically not a lump of permanently magnetised rock, which could not survive the temperatures down there.)\n\nDescribing the field at any place on the surface takes **three** numbers, called the magnetic elements:',
    }),
    b('table', 2, {
      caption: 'The three magnetic elements. Together they fix the field vector completely.',
      headers: ['Element', 'Symbol', 'What it is'],
      rows: [
        ['**Declination**', '$ \\alpha $ or $ \\theta $', 'The angle in the horizontal plane between geographic north and magnetic north'],
        ['**Dip** (inclination)', '$ \\delta $', 'The angle the total field makes with the horizontal'],
        ['**Horizontal component**', '$ B_H $', 'The horizontal part of the field — the only part a normal compass feels'],
      ],
    }),
    b('text', 3, {
      markdown: 'Declination fixes the direction of the vertical plane containing the field (the **magnetic meridian**). Dip fixes the angle within that plane. And $ B_H $ fixes the magnitude. Three numbers, one vector.\n\nResolving the total field $ B $ into horizontal and vertical parts:',
    }),
    b('latex_block', 4, {
      latex: 'B_H = B\\cos\\delta, \\qquad B_V = B\\sin\\delta, \\qquad \\tan\\delta = \\frac{B_V}{B_H}',
      label: "Resolving the Earth's field",
      note: 'And B = √(B_H² + B_V²). Note which one takes the cosine: the HORIZONTAL component, since δ is measured from the horizontal.',
      highlight: true,
    }),
    b('heading', 5, {
      text: 'What dip does as you travel',
      level: 2,
      objective: 'State the dip at the magnetic equator and at the magnetic poles, and explain why.',
    }),
    b('text', 6, {
      markdown: 'The dip angle varies systematically with latitude, and the two extremes are worth knowing:\n\n**At the magnetic equator, $ \\delta = 0 $.** The field is entirely horizontal, so $ B_V = 0 $ and $ B_H = B $. A dip needle lies flat.\n\n**At the magnetic poles, $ \\delta = 90^\\circ $.** The field is entirely vertical, so $ B_H = 0 $. A dip needle stands on end — and an ordinary compass, which can only respond to $ B_H $, becomes **completely useless**. There is no horizontal field to align it.\n\nIn between, dip grows steadily from the equator to the poles. Delhi is at about $ 42^\\circ $; London about $ 66^\\circ $; near Chennai it is around $ 8^\\circ $.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'At a certain place the horizontal component of the Earth\'s field is $ 0.32 $ G and the dip is $ 60^\\circ $. What is the total field?',
      options: ['$ 0.64 $ G', '$ 0.16 $ G', '$ 0.37 $ G', '$ 0.55 $ G'],
      reveal: '**0.64 G.**\n\n$ B_H = B\\cos\\delta $, so\n\n$ B = \\frac{B_H}{\\cos\\delta} = \\frac{0.32}{\\cos 60^\\circ} = \\frac{0.32}{0.5} = 0.64\\ \\text{G} $\n\n**The check that catches the usual error:** the total field must always be **larger** than either component. If your answer comes out smaller than $ B_H $, you have multiplied where you should have divided — which is what gives $ 0.16 $ G.\n\nAnd note the unit. The **gauss** is the CGS unit, with $ 1\\ \\text{G} = 10^{-4} $ T, and it survives in geomagnetism because the Earth\'s field is a convenient fraction of a gauss. In SI this answer is $ 6.4\\times10^{-5} $ T.',
      difficulty_level: 2,
    }),
    b('worked_example', 8, {
      label: 'the three elements at a place',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'At a certain location the total magnetic field of the Earth is $ 5.0\\times10^{-5} $ T and the angle of dip is $ 30^\\circ $. Find the horizontal and vertical components, and state what a freely pivoted horizontal compass would experience.',
      solution: '**Horizontal component:**\n\n$ B_H = B\\cos\\delta = (5.0\\times10^{-5})\\cos 30^\\circ = (5.0\\times10^{-5})(0.866) $\n\n$ B_H = 4.3\\times10^{-5}\\ \\text{T} $\n\n**Vertical component:**\n\n$ B_V = B\\sin\\delta = (5.0\\times10^{-5})(0.5) = 2.5\\times10^{-5}\\ \\text{T} $\n\n**Check:** $ \\sqrt{(4.3)^{2}+(2.5)^{2}} = \\sqrt{18.5+6.25} = \\sqrt{24.75} = 4.97 \\approx 5.0 $ ✓\n\n**What the compass feels.** A compass pivoted to swing horizontally can only respond to $ B_H = 4.3\\times10^{-5} $ T. The vertical component $ B_V $ presses on the pivot and does nothing useful — it cannot turn a needle that is constrained to a horizontal plane.\n\nSo a compass at this location is working with 86% of the available field. Nearer the poles that fraction collapses, and the compass becomes sluggish and then useless.\n\n**Habit worth keeping:** always verify $ B^{2} = B_H^{2} + B_V^{2} $. It costs ten seconds and catches a swapped sine and cosine every time.',
    }),
    b('image', 9, {
      src: '',
      alt: 'The Earth with its tilted dipole field, and an inset showing the field at a place resolved into horizontal and vertical components with the dip angle',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'A tilted dipole inside the Earth. At any place the field resolves into a horizontal part and a vertical part.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a globe outlined in dim grey with a faint tilted bar magnet drawn inside it, its blue end towards the geographic north and amber end towards the south, with smooth dim-orange dipole field lines looping around the outside; a thin dashed grey line marks the rotation axis and another the tilted magnetic axis, with a small angle marked between them. Right panel: a close-up at a point on the surface — a short horizontal grey ground line, a bold orange arrow angled into the ground labelled B, with dashed grey components drawn as a horizontal arrow labelled B sub H and a vertical arrow labelled B sub V, and a small arc between B and the horizontal labelled delta. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Three elements: **declination**, **dip** $ \\delta $, and **horizontal component** $ B_H $.\n- $ B_H = B\\cos\\delta $, $ B_V = B\\sin\\delta $, $ \\tan\\delta = B_V/B_H $, $ B^{2} = B_H^{2}+B_V^{2} $.\n- Magnetic equator: $ \\delta = 0 $, field entirely horizontal. Magnetic poles: $ \\delta = 90^\\circ $, $ B_H = 0 $, compass useless.\n- A horizontal compass responds **only** to $ B_H $.\n- $ 1\\ \\text{G} = 10^{-4} $ T. The Earth\'s field is a few tenths of a gauss.\n- The geographic north is a magnetic **south** pole.',
    }),
    b('text', 11, {
      markdown: 'Next: bring your own magnet into the Earth\'s field and the two compete — with a point where they cancel exactly.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('At the magnetic equator, the angle of dip is',
          ['$ 0^\\circ $', '$ 45^\\circ $', '$ 90^\\circ $', 'it varies with longitude'],
          0,
          'The field there is entirely horizontal, so it makes no angle with the horizontal and $ B_V = 0 $. Dip reaches $ 90^\\circ $ at the magnetic poles, where the field is entirely vertical.',
          1),
        q('An ordinary compass becomes useless near the magnetic poles because',
          ['the horizontal component vanishes', 'the total field there falls to zero', 'the declination becomes exactly zero', 'the field reverses its direction'],
          0,
          'A compass constrained to a horizontal plane can only respond to $ B_H $, and at the poles the field is entirely vertical. The **total** field is actually strongest there, which makes the failure feel counter-intuitive.',
          3),
        q('At a place the dip is $ 45^\\circ $. The ratio of the vertical to the horizontal component of the Earth\'s field is',
          ['$ 1 : 1 $', '$ 1 : \\sqrt{2} $', '$ \\sqrt{2} : 1 $', '$ 2 : 1 $'],
          0,
          '$ \\tan\\delta = B_V/B_H $, and $ \\tan 45^\\circ = 1 $, so the two components are equal. The total field is then $ \\sqrt{2} $ times either one.',
          2),
      ],
    }),
  ],
};

// ── p6 · Neutral Points and the Tangent Law ──────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'neutral-points-and-the-tangent-law',
  title: 'Neutral Points and the Tangent Law',
  subtitle: 'Two fields at right angles, and the needle between them',
  glossary: [
    { term: 'neutral point', definition: 'A point where a magnet\'s field exactly cancels the Earth\'s horizontal field, so the net field is zero.' },
    { term: 'tangent law', definition: 'When two perpendicular fields act on a compass needle, it settles at an angle $ \\theta $ with $ B = B_H\\tan\\theta $.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Put a bar magnet on a table near a compass and there will be a place — sometimes two — where the compass needle has **no idea which way to point**. It swings freely and settles nowhere.\n\nAt that spot the magnet\'s field exactly cancels the Earth\'s. The total horizontal field is zero, so there is nothing to align the needle at all.\n\nFinding those points is a classic experiment, and it turns out to be a way of measuring the Earth\'s field.',
    }),
    b('text', 1, {
      markdown: 'The whole of this page is one idea: at any point near a magnet on a table, **two** horizontal fields act — the Earth\'s $ B_H $, pointing magnetic north, and the magnet\'s own field. What happens depends entirely on the angle between them, and there are two cases worth knowing.',
    }),
    b('heading', 2, {
      text: 'Case 1 — the fields oppose: neutral points',
      level: 2,
      objective: 'Locate the neutral points for a magnet placed with its axis along the magnetic meridian.',
    }),
    b('text', 3, {
      markdown: 'A **neutral point** needs the two fields to be exactly opposite and exactly equal. Where that is possible depends on how the magnet is laid out.\n\n**Magnet with its north pole pointing north.** Then along the axis, beyond the north pole, the magnet\'s field points *north* — same way as $ B_H $, so no cancellation there. But on the **equatorial line** the magnet\'s field points *south*, against $ B_H $. So the neutral points lie on the **perpendicular bisector**, one on each side, and the condition is\n\n$ \\frac{\\mu_0}{4\\pi}\\cdot\\frac{m}{d^{3}} = B_H $\n\n**Magnet with its north pole pointing south.** Now everything reverses: the equatorial field runs *with* $ B_H $, and the neutral points appear on the **axis**, one beyond each pole, with\n\n$ \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2m}{d^{3}} = B_H $\n\nSo the rule to hold on to is short: **magnet pointing north → neutral points on the equatorial line. Magnet pointing south → neutral points on the axis.** Work it out from which way the magnet\'s field runs, and you will never need to memorise it.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'spatial',
      prompt: 'A bar magnet is placed on a horizontal table with its **north pole pointing towards magnetic north**. Where are the neutral points?',
      options: [
        'On the perpendicular bisector, one on each side',
        'On the axis, just beyond each pole of the magnet',
        'At the two poles, where the field is strongest',
        'Nowhere — no neutral point exists in this layout',
      ],
      reveal: '**On the perpendicular bisector, one on each side of the magnet.**\n\nWork it out rather than recalling it. On the **axis** beyond the north pole, the magnet\'s field points away from that pole — i.e. **northwards**, the same direction as $ B_H $. Two fields in the same direction can never cancel, so there is no neutral point there.\n\nOn the **equatorial line**, the magnet\'s field is antiparallel to $ \\vec{m} $ — so it points **southwards**, directly against $ B_H $. Cancellation is possible, and it happens at whatever distance makes the magnitudes equal.\n\nBy symmetry there are two such points, one on each side.\n\n**The habit:** always ask "which way does the magnet\'s field point *here*?" before looking for a null. It is the same discipline as finding a null point between two charges in Chapter 1.',
      difficulty_level: 3,
    }),
    b('worked_example', 5, {
      label: "measuring the Earth's field with a neutral point",
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A bar magnet of moment $ 0.40\\ \\text{A·m}^{2} $ is placed on a table with its north pole pointing north. Neutral points are found $ 20 $ cm from the centre of the magnet on either side. Find the horizontal component of the Earth\'s field.',
      solution: '**Which formula?** The magnet points north, so the neutral points lie on the **equatorial** line — and the equatorial field is $ \\frac{\\mu_0}{4\\pi}\\frac{m}{d^{3}} $, with no factor of 2.\n\nAt a neutral point that field equals $ B_H $:\n\n$ B_H = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{m}{d^{3}} = (10^{-7})\\cdot\\frac{0.40}{(0.20)^{3}} $\n\n$ (0.20)^{3} = 8.0\\times10^{-3} $, so\n\n$ B_H = (10^{-7})\\cdot\\frac{0.40}{8.0\\times10^{-3}} = (10^{-7})(50) = 5.0\\times10^{-6}\\ \\text{T} $\n\n**Sense-check the answer.** The Earth\'s $ B_H $ is typically around $ 3\\times10^{-5} $ T, so $ 5\\times10^{-6} $ T is low by a factor of six — which tells you this is a fairly weak magnet placed a long way out, and the neutral points would in practice be found much closer in. The physics is right; the numbers are a textbook\'s rather than a laboratory\'s.\n\n**The one place this goes wrong** is using the axial formula (with its factor of 2) by mistake, which would double the answer. Establish the geometry — north-pointing or south-pointing — **before** choosing the formula.',
    }),
    b('heading', 6, {
      text: 'Case 2 — the fields are perpendicular: the tangent law',
      level: 2,
      objective: 'Use the tangent law to find one field from a deflection angle and a known field.',
    }),
    b('text', 7, {
      markdown: 'Now place the magnet so that its field at the compass is at **right angles** to $ B_H $. The needle no longer points north, and it does not point along the magnet\'s field either — it settles along the **resultant** of the two.\n\nIf the needle deflects by an angle $ \\theta $ from magnetic north, then simple trigonometry on the two perpendicular components gives',
    }),
    b('latex_block', 8, {
      latex: 'B = B_H\\tan\\theta',
      label: 'The tangent law',
      note: 'Valid ONLY when the two fields are mutually perpendicular. θ is measured from the direction of B_H.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'This is the working principle of a **tangent galvanometer** and of the deflection magnetometer. It is genuinely useful because it converts a field measurement into an **angle** measurement, which is easy to do accurately.\n\nAnd it pairs beautifully with the vibration magnetometer from p4. That instrument gives you the product $ mB_H $ (from the period); this one gives you the ratio $ m/B_H $ (from the deflection). Multiply and divide the two results and you can find **$ m $ and $ B_H $ separately** — neither instrument could do that alone.\n\nOne practical note: the law is most sensitive around $ \\theta = 45^\\circ $, where $ \\tan\\theta $ changes fastest with angle. Near $ 0^\\circ $ or $ 90^\\circ $ a small angular error becomes a large field error.',
    }),
    b('image', 10, {
      src: '',
      alt: 'A compass needle deflected by the resultant of the Earth field and a perpendicular magnet field, with the neutral point positions marked',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Two perpendicular fields; the needle takes the resultant. Tan of the deflection gives their ratio.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a horizontal bar magnet with cool blue S and warm amber N ends lying with its axis vertical on the page, labelled N pointing north, with two small hollow circles marked on the horizontal line either side of its centre labelled neutral point, and small opposing orange arrows at each. Right panel: a compass rose in dim grey with a needle drawn deflected at about 40 degrees from vertical; a dashed grey vertical arrow labelled B sub H, a dashed grey horizontal arrow labelled B, and a bold amber resultant arrow along the needle, with an arc marking theta. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Neutral point:** magnet\'s field $ = B_H $ and opposite to it, so the net horizontal field is zero.\n- Magnet\'s N pointing **north** → neutral points on the **equatorial** line, $ \\frac{\\mu_0}{4\\pi}\\frac{m}{d^{3}} = B_H $.\n- Magnet\'s N pointing **south** → neutral points on the **axis**, $ \\frac{\\mu_0}{4\\pi}\\frac{2m}{d^{3}} = B_H $.\n- **Tangent law:** $ B = B_H\\tan\\theta $, and only for perpendicular fields.\n- Combine the tangent law ($ m/B_H $) with the vibration period ($ mB_H $) to get $ m $ and $ B_H $ separately.',
    }),
    b('text', 12, {
      markdown: 'Next: so far a magnet has been a thing that makes a field. Time to ask what happens when a field is applied to **matter** — and why iron responds a thousand times more than aluminium.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('At a neutral point near a bar magnet, the net magnetic field is',
          ['zero', 'equal to $ B_H $', 'twice $ B_H $', 'vertical'],
          0,
          'The magnet\'s field there is equal in magnitude and opposite in direction to the Earth\'s horizontal field, so they cancel completely and a compass needle has no preferred direction at all.',
          1),
        q('A bar magnet is placed with its north pole pointing **south**. The neutral points lie',
          ['on its axis, beyond each pole', 'on its perpendicular bisector', 'at the poles themselves', 'nowhere — this arrangement has none'],
          0,
          'With the magnet reversed, its axial field points against $ B_H $ while its equatorial field runs with it. Cancellation is therefore possible only along the axis. The condition uses the axial formula, with its factor of 2.',
          3),
        q('The tangent law $ B = B_H\\tan\\theta $ applies only when',
          ['the two fields are perpendicular', 'the two fields are equal in magnitude', 'the deflection angle is small', 'the magnet is very short indeed'],
          0,
          'The law comes from resolving two perpendicular components of a resultant. If the fields are at some other angle, the needle still takes the resultant but the relation is no longer a simple tangent.',
          2),
      ],
    }),
  ],
};

// ── p7 · Three Fields: B, H and M ────────────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'three-fields-b-h-and-m',
  title: 'Three Fields: B, H and M',
  subtitle: 'What you apply, what the material does, and what results',
  glossary: [
    { term: 'magnetising field', definition: 'The field $ \\vec{H} $ you apply, set by the currents you control — measured in A/m.' },
    { term: 'magnetisation', definition: 'The magnetic moment per unit volume acquired by the material, $ \\vec{M} $ — also in A/m.' },
    { term: 'susceptibility', definition: 'How readily a material magnetises: $ \\chi = M/H $. A pure number.' },
    { term: 'relative permeability', definition: 'The factor by which a material multiplies the field inside it, $ \\mu_r = 1 + \\chi $.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Wind a coil and pass a current through it, and you get a certain field inside. Now slide an iron rod into the coil, changing **nothing** about the current.\n\nThe field inside can jump by a factor of a thousand.\n\nWhere did that extra field come from? The current did not change.',
      hint: 'What is the iron itself doing?',
      reveal: '**From the iron.** The applied field lines up the iron\'s own atomic magnets, and each of those tiny magnets adds its own field. The total is the sum of what you applied and what the iron contributed.\n\nWhich means there are genuinely **two** contributions to the field inside a material, and they need separate names. Confusing them is the single biggest source of trouble in this topic, so this page keeps them apart carefully.',
    }),
    b('text', 1, {
      markdown: 'Three quantities, three jobs:\n\n**$ \\vec{H} $ — the magnetising field.** What *you* apply, determined entirely by the currents you control. For a solenoid, $ H = nI $ — just turns per metre times current. It does not care what is inside. Unit: A/m.\n\n**$ \\vec{M} $ — the magnetisation.** What the *material* contributes: the net magnetic moment per unit volume it acquires. Zero in vacuum. Unit: A/m — the same as $ H $, which is a hint that they are meant to be added.\n\n**$ \\vec{B} $ — the magnetic field** (or flux density). The **total**, and the thing that actually exerts forces. Unit: tesla.\n\nAnd the relation between them is simply "applied plus contributed":',
    }),
    b('latex_block', 2, {
      latex: '\\vec{B} = \\mu_0\\left(\\vec{H} + \\vec{M}\\right)',
      label: 'The fundamental relation of magnetic materials',
      note: 'H is what you apply, M is what the material adds, B is the total. In vacuum M = 0 and B = μ₀H.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Everything else on this page is bookkeeping on top of that one equation.\n\nFor most materials $ M $ is proportional to $ H $ — the harder you push, the more it magnetises — and the constant of proportionality is the **magnetic susceptibility**:\n\n$ \\chi = \\frac{M}{H} $\n\nIt is a pure number, since $ M $ and $ H $ share a unit. Substituting into the fundamental relation:\n\n$ \\vec{B} = \\mu_0(H + \\chi H) = \\mu_0(1+\\chi)\\vec{H} $\n\nwhich we write as',
    }),
    b('latex_block', 4, {
      latex: '\\vec{B} = \\mu\\vec{H}, \\qquad \\mu = \\mu_0\\mu_r, \\qquad \\mu_r = 1 + \\chi',
      label: 'Permeability and susceptibility',
      note: 'μ_r is the factor by which the material multiplies the field. In vacuum χ = 0 and μ_r = 1.',
      highlight: true,
    }),
    b('text', 5, {
      markdown: 'So $ \\mu_r = 1+\\chi $ is the whole story in one line, and it immediately sorts materials into three families by the **sign and size of $ \\chi $**:\n\n- $ \\chi $ small and **negative** → $ \\mu_r $ slightly less than 1 → the material slightly *weakens* the field. **Diamagnetic.**\n- $ \\chi $ small and **positive** → $ \\mu_r $ slightly more than 1 → slightly strengthens it. **Paramagnetic.**\n- $ \\chi $ **large** and positive → $ \\mu_r $ in the hundreds or thousands. **Ferromagnetic.**\n\nThat is the classification the next two pages explain.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'A material has susceptibility $ \\chi = 499 $. A solenoid producing $ H = 1000 $ A/m is filled with it. What is $ B $ inside?',
      options: ['About $ 0.63 $ T', 'About $ 1.26\\times10^{-3} $ T', 'About $ 0.63\\times10^{-3} $ T', 'About $ 6.3 $ T'],
      reveal: '**About $ 0.63 $ T.**\n\n$ \\mu_r = 1 + \\chi = 500 $, so\n\n$ B = \\mu_0\\mu_rH = (4\\pi\\times10^{-7})(500)(1000) $\n\n$ = (1.257\\times10^{-6})(5\\times10^{5}) = 0.63\\ \\text{T} $\n\n**Compare with no material at all:** $ B = \\mu_0H = 1.26\\times10^{-3} $ T. So the material has multiplied the field by 500 — which is exactly what $ \\mu_r $ means.\n\n**Two things to take from this.** First, $ \\mu_r = 1+\\chi $, not $ \\chi $: for a ferromagnet with $ \\chi $ in the hundreds the difference hardly matters, but for a diamagnet with $ \\chi = -10^{-5} $ it is the *entire* content of the answer.\n\nSecond, this is why electromagnets have iron cores. The current does the same work; the iron multiplies the result.',
      difficulty_level: 3,
    }),
    b('table', 7, {
      caption: 'The three families, by susceptibility. Everything on the next two pages is here in summary.',
      headers: ['Family', '$ \\chi $', '$ \\mu_r $', 'Behaviour in a field'],
      rows: [
        ['**Diamagnetic**', 'small, **negative** ($ \\sim -10^{-5} $)', 'slightly $ < 1 $', 'weakly **repelled**; moves to weaker field'],
        ['**Paramagnetic**', 'small, **positive** ($ \\sim +10^{-5} $)', 'slightly $ > 1 $', 'weakly **attracted**; moves to stronger field'],
        ['**Ferromagnetic**', '**large**, positive ($ 10^{3}\\text{–}10^{5} $)', '$ \\gg 1 $', 'strongly attracted; retains magnetisation'],
      ],
    }),
    b('image', 8, {
      src: '',
      alt: 'A solenoid with a material inside, showing the applied field H, the material magnetisation M and the resulting total field B',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'H is what the current applies. M is what the material adds. B is the sum, and the thing that exerts forces.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). A solenoid drawn in cross-section as two rows of small circles with current-direction dots and crosses, in thin dim-grey line art. Inside it, a rectangular rod shown in a lighter dark tone containing many small aligned orange dipole arrows. Three horizontal labelled arrows are stacked beneath the diagram: a medium dim-orange arrow labelled H, a medium amber arrow labelled M, and a much longer bright amber arrow labelled B, with a small plus sign between the first two and an equals sign before the third. Muted white minimal labels, generous dark space.',
    }),
    b('heading', 9, {
      text: 'Working backwards from a measurement',
      level: 2,
      objective: 'Given a measured $ B $ and a known $ H $, find $ M $, $ \\chi $ and $ \\mu_r $.',
    }),
    b('step_solver', 10, {
      title: 'From a measured field back to the material',
      problem: 'A rod of soft iron is placed inside a long solenoid wound with $ 500 $ turns per metre and carrying $ 0.40 $ A. The magnetic field inside the rod is measured to be $ 0.40 $ T. Find the magnetising field $ H $, the magnetisation $ M $, the susceptibility $ \\chi $ and the relative permeability $ \\mu_r $. Take $ \\mu_0 = 4\\pi\\times10^{-7} $ SI units.',
      intro: 'The reasoning check above ran forwards — you were handed $ \\chi $ and asked for $ B $. In a laboratory it always runs the other way. You can set the current, and you can measure the field; everything about the material has to be **deduced** from those two. That is this problem, in four short steps, and the order of the steps is the lesson.',
      steps: [
        st('The current sets $ H $, and nothing else does: $ H = nI = (500)(0.40) = 200 $ A/m',
          'Always start here. $ H $ is the one quantity you control directly, and notice that the iron does not appear in this line at all.', {
            check: {
              kind: 'mcq',
              prompt: 'The iron rod is pulled out of the solenoid, with the current left exactly as it was. What happens to $ H $ inside?',
              options: [
                'Nothing — it is still $ 200 $ A/m',
                'It falls by a factor of roughly $ 1600 $',
                'It rises, because the iron was absorbing part of it',
                'It drops to zero, since there is no material left',
              ],
              answer_index: 0,
              feedback_right: 'Correct. $ H = nI $ contains only the winding and the current. The material changes $ B $ enormously and $ H $ not at all.',
              feedback_wrong: '$ H = nI $ — turns per metre times current. There is no material term anywhere in it. What collapses when the iron leaves is $ B $, because $ M $ falls to zero.',
            },
          }),
        st('Turn the fundamental relation round: from $ B = \\mu_0(H+M) $, $ \\quad M = \\frac{B}{\\mu_0} - H $',
          'No new physics — this is the one equation of this page with $ M $ made the subject. Do the algebra before you touch the numbers, so you know what you are looking for.'),
        st('$ \\frac{B}{\\mu_0} = \\frac{0.40}{4\\pi\\times10^{-7}} = 3.18\\times10^{5} $ A/m, so $ M = 3.18\\times10^{5} - 200 = 3.18\\times10^{5} $ A/m',
          'Subtracting $ 200 $ from $ 318\\,000 $ changes the answer by six hundredths of one per cent, so to three figures $ M $ is unchanged. In iron, almost the whole of $ B $ is the material talking — you supplied hardly any of it.', {
            check: {
              kind: 'mcq',
              prompt: 'Here subtracting $ H $ barely changed the answer. Would the same be true for a diamagnetic sample with $ \\chi \\approx -10^{-5} $?',
              options: [
                'No — there $ M $ is the tiny difference of two nearly equal numbers',
                'Yes — the $ H $ term can always be dropped safely',
                'No — for a diamagnet the quantity $ B/\\mu_0 $ is exactly zero',
                'Yes, as long as the applied field is made strong enough',
              ],
              answer_index: 0,
              feedback_right: 'Exactly. For a diamagnet $ B/\\mu_0 $ and $ H $ agree to five figures, and $ M $ is only what is left over. Round early there and you get zero.',
              feedback_wrong: 'For a diamagnet $ M = \\chi H $ is about $ 10^{-5} $ of $ H $, so $ B/\\mu_0 $ and $ H $ are almost equal and $ M $ is their small difference. That is precisely the case where careless rounding destroys the whole answer.',
            },
          }),
        st('$ \\chi = \\frac{M}{H} = \\frac{3.18\\times10^{5}}{200} = 1.59\\times10^{3} $, and $ \\mu_r = 1+\\chi = 1.59\\times10^{3} $',
          'For a ferromagnet the $ +1 $ is invisible at three figures — $ 1591 $ against $ 1590 $. Write it anyway, out of habit, because for a diamagnet that $ 1 $ is the entire answer.'),
      ],
      now_you_try: {
        problem: 'Same solenoid, same current, but the rod is swapped for one in which the field measures $ 0.80 $ T instead. Find the new susceptibility.',
        answer: 'About $ 3.18\\times10^{3} $',
        solution: '$ H $ is unchanged at $ 200 $ A/m — the winding and the current did not change, and those are the only things $ H $ depends on.\n\n$ \\frac{B}{\\mu_0} = \\frac{0.80}{4\\pi\\times10^{-7}} = 6.37\\times10^{5}\\ \\text{A/m} $\n\n$ M = 6.37\\times10^{5} - 200 \\approx 6.37\\times10^{5}\\ \\text{A/m} $\n\n$ \\chi = \\frac{M}{H} = \\frac{6.37\\times10^{5}}{200} = 3.18\\times10^{3} $\n\nTwice the field for the same applied $ H $ gives twice the susceptibility, which is exactly the straight proportion that $ M = \\chi H $ assumes. Real iron only obeys it over a limited range — p9 shows what it does instead.',
      },
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{B} = \\mu_0(\\vec{H}+\\vec{M}) $ — applied plus contributed equals total.\n- $ H $ and $ M $ are both in **A/m**; $ B $ is in **tesla**.\n- $ H $ depends only on the currents you control. For a solenoid, $ H = nI $.\n- $ \\chi = M/H $ (a pure number), $ \\mu_r = 1+\\chi $, $ B = \\mu_0\\mu_rH $.\n- Sign and size of $ \\chi $ classify the material: small negative → dia, small positive → para, large positive → ferro.',
    }),
    b('text', 12, {
      markdown: 'Next: the two weak magnetisms, which arise from completely different atomic causes — and behave oppositely as a result.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The relation between relative permeability and susceptibility is',
          ['$ \\mu_r = 1+\\chi $', '$ \\mu_r = \\chi $', '$ \\mu_r = 1-\\chi $', '$ \\mu_r = 1/\\chi $'],
          0,
          'It follows directly from $ B = \\mu_0(H+M) $ with $ M = \\chi H $. The "1" is the vacuum contribution, and it is the whole answer for a diamagnet where $ \\chi $ is only about $ 10^{-5} $.',
          2),
        q('Magnetisation $ M $ and magnetising field $ H $ are both measured in',
          ['A/m', 'tesla', 'A·m$ ^{2} $', 'weber'],
          0,
          'They share a unit precisely because $ B = \\mu_0(H+M) $ requires them to be addable. That shared unit is also why the ratio $ \\chi = M/H $ is a pure number. Note A·m² is the unit of magnetic **moment**, a different quantity.',
          2),
        q('For a diamagnetic material, the relative permeability is',
          ['slightly less than 1', 'slightly more than 1', 'much greater than 1', 'exactly 1'],
          0,
          'A diamagnet has a small **negative** susceptibility, so $ \\mu_r = 1+\\chi $ comes out just below 1 — it slightly weakens the field inside it. A value much greater than 1 belongs to a ferromagnet.',
          2),
      ],
    }),
  ],
};

// ── p8 · The Two Weak Magnetisms ─────────────────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'the-two-weak-magnetisms',
  title: 'The Two Weak Magnetisms',
  subtitle: 'Diamagnetism and paramagnetism — opposite causes, opposite signs',
  glossary: [
    { term: 'diamagnetism', definition: 'A weak magnetism, present in every material, in which an induced moment opposes the applied field.' },
    { term: 'paramagnetism', definition: 'A weak magnetism in materials whose atoms have permanent magnetic moments, which partially align with an applied field.' },
    { term: "Curie's law", definition: 'For a paramagnetic material, $ \\chi \\propto 1/T $ — susceptibility falls as temperature rises.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'In 1997, physicists in Nijmegen levitated a live frog in a magnetic field. The frog was unharmed, and hopped away afterwards.\n\nWater is **diamagnetic** — it is weakly *repelled* by a magnetic field. The effect is tiny, with $ \\chi \\approx -10^{-5} $, so it took a field of 16 tesla, roughly a third of a million times the Earth\'s. But it worked, because a frog is mostly water.\n\nEverything on this page is contained in that experiment: one of the two weak magnetisms pushes away, and the other pulls in.',
    }),
    b('heading', 1, {
      text: 'Diamagnetism — every material has it',
      level: 2,
      objective: 'Explain the origin of diamagnetism and why its susceptibility is negative.',
    }),
    b('text', 2, {
      markdown: 'Take an atom whose electron orbits pair up so neatly that its **net** magnetic moment is zero — helium, or a molecule with all electrons paired. With no field applied, it is magnetically dead.\n\nNow switch a field on. The changing field, as it grows, induces a change in the electron orbits — and here is the key: the induced moment **opposes** the change that created it.\n\nThat should sound familiar even before you have met it formally. It is Lenz\'s law, operating at the scale of a single atom. Chapter 6 will state it properly; the essential idea is that induced effects always fight the change producing them.\n\nSo the induced moment points **against** the applied field, giving:\n\n- $ M $ opposite to $ H $, so $ \\chi $ is **negative**\n- $ \\mu_r $ slightly less than 1 — the material weakens the field inside it\n- a weak **repulsion**, pushing the sample towards the **weaker** part of a non-uniform field',
    }),
    b('text', 3, {
      markdown: 'Two further properties follow from the mechanism:\n\n**Diamagnetism is universal.** Every material has it, because every material has electron orbits that respond this way. In most materials it is simply swamped by a stronger effect.\n\n**It is independent of temperature.** Nothing here relies on thermal disorder — the induced moment is created by the field and vanishes with it. Heating the sample changes nothing.\n\nExamples with nothing to swamp it: bismuth (the strongest ordinary diamagnet), copper, gold, water, and most organic matter — including frogs.',
    }),
    b('callout', 4, {
      variant: 'note',
      title: 'The perfect diamagnet',
      markdown: 'A **superconductor** below its critical temperature is a *perfect* diamagnet: $ \\chi = -1 $ exactly, so $ \\mu_r = 0 $ and the field inside is **zero**. It expels the field completely rather than merely weakening it.\n\nThis is the **Meissner effect**, and it is the reason a magnet floats stably above a cooled superconductor — a demonstration you have almost certainly seen a video of. The levitation is not a curiosity but a genuinely different state of matter, and it is what makes maglev trains and MRI magnets possible.',
    }),
    b('heading', 5, {
      text: 'Paramagnetism — permanent moments, fighting heat',
      level: 2,
      objective: 'Explain paramagnetism and derive the form of Curie\'s law from the mechanism.',
    }),
    b('text', 6, {
      markdown: 'Now take an atom that has a **permanent** magnetic moment — one with unpaired electrons, so the orbital and spin contributions do not cancel.\n\nWith no field applied, thermal agitation points those atomic moments in random directions, and they average to zero. The material shows no magnetisation at all.\n\nApply a field and each moment feels a torque $ \\vec{m}\\times\\vec{B} $ trying to align it — exactly the torque from p4. But thermal motion keeps knocking them out of line. The result is a **partial** alignment: a compromise between the field ordering them and heat disordering them.\n\nSo:\n\n- $ M $ is along $ H $, so $ \\chi $ is **positive**\n- $ \\mu_r $ slightly more than 1\n- weak **attraction**, drawing the sample towards the **stronger** part of a non-uniform field\n\nAnd the alignment is weak — at room temperature and ordinary field strengths, only a tiny fraction of the moments line up at any instant, which is why $ \\chi $ is only about $ 10^{-5} $.',
    }),
    b('text', 7, {
      markdown: 'The competition with heat has an immediate consequence. Raise the temperature and the disordering wins more easily, so the alignment — and therefore $ \\chi $ — falls. Quantitatively:',
    }),
    b('latex_block', 8, {
      latex: '\\chi = \\frac{C}{T} \\qquad \\text{(Curie\'s law)}',
      label: "Curie's law for a paramagnet",
      note: 'T is the ABSOLUTE temperature, in kelvin. C is the Curie constant for the material.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'That inverse dependence is the signature of paramagnetism. Cool a paramagnet and it magnetises much more readily; heat it and the effect fades away.\n\nAnd notice the contrast with diamagnetism, which is completely temperature-independent. The two mechanisms are so different that even their temperature behaviour distinguishes them.\n\nExamples: aluminium, platinum, chromium, manganese, oxygen, and copper sulphate solution.',
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'quantitative',
      prompt: 'A paramagnetic sample has susceptibility $ \\chi = 2.4\\times10^{-5} $ at $ 300 $ K. What is its susceptibility at $ 200 $ K?',
      options: ['$ 3.6\\times10^{-5} $', '$ 1.6\\times10^{-5} $', '$ 2.4\\times10^{-5} $', '$ 4.8\\times10^{-5} $'],
      reveal: '**$ 3.6\\times10^{-5} $.**\n\nCurie\'s law gives $ \\chi \\propto 1/T $, so\n\n$ \\frac{\\chi_2}{\\chi_1} = \\frac{T_1}{T_2} = \\frac{300}{200} = 1.5 $\n\n$ \\chi_2 = 1.5 \\times 2.4\\times10^{-5} = 3.6\\times10^{-5} $\n\n**Cooling increases the susceptibility**, because there is less thermal agitation to fight the field\'s alignment. That direction is worth checking every time — if your answer comes out smaller on cooling, the ratio is inverted.\n\n**And note:** $ T $ must be **absolute**. Using $ 27\\ ^\\circ\\text{C} $ and $ -73\\ ^\\circ\\text{C} $ as 27 and $ -73 $ would be nonsense — a negative susceptibility from a paramagnet.',
      difficulty_level: 2,
    }),
    b('worked_example', 11, {
      label: 'how much magnetisation does Curie\'s law actually give?',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A paramagnetic salt has a Curie constant $ C = 4.2\\times10^{-3} $ K. It is placed in a magnetising field $ H = 2.0\\times10^{4} $ A/m. Find its magnetisation (a) at room temperature, $ 300 $ K, and (b) after cooling to $ 4.2 $ K, the boiling point of liquid helium.',
      solution: '**(a) At 300 K.**\n\nCurie\'s law gives the susceptibility:\n\n$ \\chi = \\frac{C}{T} = \\frac{4.2\\times10^{-3}}{300} = 1.4\\times10^{-5} $\n\nThen use the definition $ \\chi = M/H $ forwards:\n\n$ M = \\chi H = (1.4\\times10^{-5})(2.0\\times10^{4}) = 0.28\\ \\text{A/m} $\n\n**(b) At 4.2 K.**\n\n$ \\chi = \\frac{4.2\\times10^{-3}}{4.2} = 1.0\\times10^{-3} $\n\n$ M = (1.0\\times10^{-3})(2.0\\times10^{4}) = 20\\ \\text{A/m} $\n\n**Now look at what those two numbers actually say.**\n\nAt room temperature the sample contributes $ 0.28 $ A/m while you are applying $ 20\\,000 $ A/m — about one part in seventy thousand. *That* is what "weak magnetism" means as a number, and it is why detecting paramagnetism at all needs a sensitive balance rather than a compass.\n\nCooling by a factor of about $ 71 $ multiplies the magnetisation by the same $ 71 $, up to $ 20 $ A/m. Still small, but now comfortably measurable — which is exactly why susceptibility measurements are made cold.\n\n**Two traps.** $ T $ must be in **kelvin**; Curie\'s law fed a celsius temperature is meaningless. And $ \\chi $ is a pure number, so $ M $ comes out in the same unit as $ H $, namely A/m — never in tesla. If you want the material\'s share of $ B $, multiply by $ \\mu_0 $: at $ 300 $ K that is $ (4\\pi\\times10^{-7})(0.28) = 3.5\\times10^{-7} $ T, sitting on top of the $ 2.5\\times10^{-2} $ T you applied.\n\n**One honest caveat.** Curie\'s law is itself an approximation, good while the thermal energy still beats the magnetic energy. Push a paramagnet to very low temperature *and* a very strong field and the moments run out of room to align — the magnetisation saturates and $ \\chi \\propto 1/T $ stops holding.',
    }),
    b('comparison_card', 12, {
      title: 'The two weak magnetisms, side by side',
      columns: [
        {
          heading: 'Diamagnetic',
          points: [
            'Atoms have **no** permanent moment',
            'Field **induces** an opposing moment (Lenz, atomically)',
            '$ \\chi $ small and **negative**; $ \\mu_r < 1 $',
            'Weakly **repelled** → moves to weaker field',
            '**Independent** of temperature',
            'In a uniform field, aligns **perpendicular** to it',
            'Bismuth, copper, gold, water — and superconductors, perfectly',
          ],
        },
        {
          heading: 'Paramagnetic',
          points: [
            'Atoms **have** permanent moments',
            'Field **partially aligns** them against thermal disorder',
            '$ \\chi $ small and **positive**; $ \\mu_r > 1 $',
            'Weakly **attracted** → moves to stronger field',
            '$ \\chi \\propto 1/T $ (**Curie\'s law**)',
            'In a uniform field, aligns **parallel** to it',
            'Aluminium, platinum, chromium, oxygen',
          ],
        },
      ],
    }),
    b('image', 13, {
      src: '',
      alt: 'A diamagnetic and a paramagnetic rod suspended in a non-uniform field, one repelled towards the weak region and one drawn to the strong region',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Same field, opposite responses — because one moment is induced against it and the other aligns with it.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Each shows an electromagnet with one sharply pointed pole piece at left and one flat pole piece at right, drawn in dim grey, with dim-orange field lines densely crowded near the point and sparse near the flat pole. Left panel labelled diamagnetic: a small rod suspended on a thread between them, oriented across the field, with a bold orange arrow showing it pushed towards the flat pole. Right panel labelled paramagnetic: an identical rod oriented along the field, with a bold orange arrow showing it pulled towards the pointed pole. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Diamagnetic:** no permanent moments; field induces an **opposing** one. $ \\chi $ small negative, $ \\mu_r<1 $, weakly repelled, **temperature-independent**. Present in all materials.\n- **Paramagnetic:** permanent moments **partially aligned** against thermal disorder. $ \\chi $ small positive, $ \\mu_r>1 $, weakly attracted, $ \\chi \\propto 1/T $.\n- Diamagnets go to the **weak** part of a non-uniform field; paramagnets to the **strong** part.\n- A superconductor is a **perfect** diamagnet: $ \\chi = -1 $, field expelled entirely (Meissner effect).\n- Curie\'s law needs **absolute** temperature.',
    }),
    b('text', 15, {
      markdown: 'Next: the third family, where the atomic moments stop behaving independently and start cooperating — with consequences a thousand times larger.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A diamagnetic material placed in a non-uniform magnetic field moves towards',
          ['the weaker part of the field', 'the stronger part of the field', 'neither — it stays put', 'the nearest pole'],
          0,
          'Its induced moment opposes the applied field, so the interaction is repulsive and the sample is pushed away from where the field is strong. A paramagnet, whose moments align with the field, does the opposite.',
          2),
        q("According to Curie's law, the susceptibility of a paramagnetic material",
          ['is inversely proportional to the absolute temperature', 'is proportional to the absolute temperature', 'does not depend on temperature', 'is proportional to $ T^{2} $'],
          0,
          'Alignment is a contest between the field ordering the moments and heat disordering them, so raising $ T $ reduces the magnetisation. Diamagnetism, by contrast, has no temperature dependence at all.',
          2),
        q('Diamagnetism arises because',
          ['the applied field induces moments that oppose it', 'the atoms have permanent moments that align with the field', 'the material contains unpaired electrons', 'thermal motion aligns the atomic moments'],
          0,
          'The atoms have no permanent moment; the field creates one, and — exactly as Lenz\'s law would suggest — it opposes the change that made it. Permanent moments and unpaired electrons are the paramagnetic story instead.',
          2),
      ],
    }),
  ],
};

// ── p9 · Ferromagnetism, Domains and Hysteresis ──────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'ferromagnetism-domains-and-hysteresis',
  title: 'Ferromagnetism, Domains and Hysteresis',
  subtitle: 'When atomic magnets start cooperating',
  glossary: [
    { term: 'domain', definition: 'A region inside a ferromagnet, typically a fraction of a millimetre across, in which all the atomic moments are already aligned.' },
    { term: 'Curie temperature', definition: 'The temperature above which a ferromagnet loses its cooperative alignment and becomes merely paramagnetic.' },
    { term: 'retentivity', definition: 'The magnetisation left in a material after the applied field is removed.' },
    { term: 'coercivity', definition: 'The reverse field needed to reduce the magnetisation to zero.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A paramagnet has $ \\chi \\approx 10^{-5} $. Iron has $ \\chi $ in the **thousands** — a hundred million times larger.\n\nBoth have atoms with permanent magnetic moments. So what is iron doing that aluminium is not?',
      hint: 'In a paramagnet each atom fights the field on its own.',
      reveal: 'In iron the atomic moments **cooperate**. A quantum-mechanical interaction between neighbours locks them parallel to each other over huge groups of atoms, whether or not any field is applied.\n\nSo a paramagnetic atom faces thermal agitation alone and mostly loses. A ferromagnetic region faces it with $ 10^{17} $ neighbours already lined up — and wins easily.\n\nThose pre-aligned regions are called **domains**, and they are the whole explanation for everything on this page.',
    }),
    b('text', 1, {
      markdown: 'A piece of unmagnetised iron is **not** magnetically disordered at the atomic level. It is divided into **domains** — regions perhaps $ 0.1 $ mm across, each containing about $ 10^{17} $ atoms, and within each one every atomic moment already points the same way.\n\nWhat makes the iron *appear* unmagnetised is that the **domains** point in different directions, and their moments cancel.\n\nThat picture explains the whole of ferromagnetic behaviour:\n\n**Applying a field does not have to align individual atoms.** It only has to persuade whole domains, which is far easier — and this happens two ways: domains already close to the field direction **grow** at the expense of their neighbours (the domain walls move), and then whole domains **rotate** into line.\n\n**Saturation.** Once every domain is aligned, there is nothing left to align, and $ M $ stops rising however hard you push. No paramagnet ever reaches saturation at ordinary fields.\n\n**Permanence.** Remove the field and the domain walls do not move all the way back — they get stuck on impurities and crystal defects. Some alignment survives, and the iron is now a magnet.',
    }),
    b('text', 2, {
      markdown: 'And there is a temperature at which the cooperation fails. Above the **Curie temperature** $ T_c $, thermal agitation is strong enough to break the neighbour-to-neighbour alignment, the domains dissolve, and the material becomes an ordinary paramagnet obeying Curie\'s law.\n\nFor iron $ T_c \\approx 1043 $ K (about $ 770\\ ^\\circ\\text{C} $); for nickel about $ 630 $ K; for cobalt about $ 1400 $ K.\n\nSo heating a magnet red hot destroys it — permanently, unless it is re-magnetised. Hammering it also works, by shaking the domain walls loose.',
    }),
    b('reasoning_prompt', 3, {
      reasoning_type: 'logical',
      prompt: 'An unmagnetised iron bar is heated above its Curie temperature and then cooled back down, with no field applied. Is it now magnetised?',
      options: [
        'No — the domains reform pointing in random directions',
        'Yes — cooling always produces magnetisation',
        'Yes, but only weakly',
        'It becomes permanently diamagnetic',
      ],
      reveal: '**No.**\n\nAbove $ T_c $ the domains dissolve entirely and the material is paramagnetic. On cooling below $ T_c $ the cooperative interaction returns and domains reform — but with **no field to tell them which way to point**, they form in random orientations and their moments cancel.\n\nSo you get unmagnetised iron back, with domains, exactly as you started.\n\n**But cool it *in a field* and the story changes completely.** The domains then form preferentially along that field and the bar comes out strongly magnetised. This is precisely how permanent magnets are manufactured — heat, apply a field, and cool.\n\nIt is also how the ocean floor recorded the Earth\'s magnetic history: molten rock cooling through its Curie point froze in the direction of the Earth\'s field at that moment, and reading those stripes is how the reversals of the Earth\'s field were discovered.',
      difficulty_level: 3,
    }),
    b('heading', 4, {
      text: 'Hysteresis — the loop that remembers',
      level: 2,
      objective: 'Read a hysteresis loop and identify retentivity, coercivity and the energy loss.',
    }),
    b('text', 5, {
      markdown: 'Take an unmagnetised ferromagnet, raise the applied field $ H $ from zero, and plot $ B $ against it. Then reduce $ H $, reverse it, and bring it back. The curve does **not** retrace itself — and the gap between the two paths is the whole point.\n\nThis lagging-behind is called **hysteresis**, from the Greek for "to lag". Follow one complete circuit:',
    }),
    b('table', 6, {
      caption: 'One trip round a hysteresis loop. The two named points are what a material is chosen for.',
      headers: ['Stage', 'What is happening', 'Name'],
      rows: [
        ['$ H $ rises from 0', 'Domains grow and rotate into line; $ B $ rises steeply then flattens', '**Saturation** at the top'],
        ['$ H $ reduced back to 0', 'Domain walls stick on defects; $ B $ does **not** return to zero', '**Retentivity** — the $ B $ left at $ H=0 $'],
        ['$ H $ reversed', 'The reverse field undoes the alignment; $ B $ falls to zero at some finite reverse $ H $', '**Coercivity** — the reverse $ H $ needed'],
        ['$ H $ reversed further', 'Saturation in the opposite direction', '—'],
        ['$ H $ brought back', 'The mirror image of the first half, closing the loop', '—'],
      ],
    }),
    b('text', 7, {
      markdown: 'And the loop has an area, which is not a curiosity — it is an **energy**. Going once round, the work done per unit volume against the sticking of the domain walls equals the area enclosed, and it comes out as **heat**.\n\n$ \\text{energy lost per cycle per unit volume} = \\text{area of the } B\\text{–}H \\text{ loop} $\n\nSo a **fat** loop means a lossy material and a **thin** loop means an efficient one. That single fact decides which material goes where in every piece of electrical engineering.',
    }),
    b('comparison_card', 8, {
      title: 'Choosing a ferromagnet by the shape of its loop',
      columns: [
        {
          heading: 'Soft — thin loop',
          points: [
            'Low retentivity, **low coercivity**',
            'Small loop area → **little energy lost** per cycle',
            'Magnetises and demagnetises easily',
            'Soft iron, silicon steel, ferrites',
            'Used for **transformer cores**, electromagnets, motor cores — anywhere the field reverses many times a second',
          ],
        },
        {
          heading: 'Hard — fat loop',
          points: [
            'High retentivity, **high coercivity**',
            'Large loop area → lossy, but that does not matter',
            'Hard to magnetise and hard to demagnetise',
            'Steel, alnico, neodymium alloys',
            'Used for **permanent magnets**, and for magnetic recording, where holding the state is the entire job',
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'A transformer core is magnetised and demagnetised 100 times a second, so a fat loop would waste that energy 100 times a second and cook the transformer. Hence soft iron.\n\nA fridge magnet has to hold its magnetisation for years against stray fields. Hence a hard material with high coercivity.\n\n**The same physics, opposite requirements** — and the loop shape is how you tell which material you are holding.',
    }),
    b('worked_example', 10, {
      label: 'the heat a hysteresis loop makes',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'The $ B $-$ H $ loop of a transformer core material is drawn on a graph in which $ 1 $ cm along the horizontal axis stands for $ 100 $ A/m and $ 1 $ cm along the vertical axis stands for $ 0.050 $ T. The loop encloses an area of $ 50\\ \\text{cm}^{2} $. The core has a volume of $ 0.020\\ \\text{m}^{3} $ and the transformer runs from a $ 50 $ Hz mains supply. Find the power dissipated in the core as hysteresis heat.',
      solution: '**Step 1 — what one square centimetre of the graph is worth.**\n\nThe area is an energy per unit volume, and its value comes from the two axis scales multiplied together:\n\n$ 1\\ \\text{cm}^{2} \\to (100\\ \\text{A/m})\\times(0.050\\ \\text{T}) = 5.0\\ \\text{J/m}^{3} $\n\nIf that looks like a leap, check the units: $ \\text{A/m}\\times\\text{T} = \\text{J/m}^{3} $. That identity is the whole reason the area of a $ B $-$ H $ loop is an energy density in the first place.\n\n**Step 2 — energy lost per cycle, per cubic metre.**\n\n$ (50\\ \\text{cm}^{2})\\times(5.0\\ \\text{J/m}^{3}\\ \\text{per cm}^{2}) = 250\\ \\text{J/m}^{3} $ per cycle\n\n**Step 3 — energy lost per cycle by the whole core.**\n\n$ E = (250)(0.020) = 5.0\\ \\text{J} $ per cycle\n\n**Step 4 — energy per cycle becomes power.**\n\n$ P = Ef = (5.0)(50) = 250\\ \\text{W} $\n\n**The trap in this problem is the frequency.** A $ 50 $ Hz supply reverses the field $ 100 $ times a second, and it is very tempting to put $ 100 $ into that last line. But one *loop* is one complete there-and-back journey — it already contains both reversals — so the loop is traversed $ 50 $ times a second, not $ 100 $. Use the supply frequency exactly as given.\n\n**And $ 250 $ W is a great deal.** Left running, that is $ 6 $ kWh of heat every day, produced by nothing but domain walls scraping past defects — before you count a single watt of resistive loss in the windings. Halve the loop area by choosing a softer core material and you halve that figure. This calculation is the entire commercial argument for silicon steel.',
    }),
    b('image', 11, {
      src: '',
      alt: 'A hysteresis loop with retentivity and coercivity marked, beside a thin soft-iron loop and a fat steel loop',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Retentivity is what remains at zero field; coercivity is the reverse field needed to erase it. The area is energy lost as heat.',
      generation_prompt: 'Clean scientific graph panel on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a single large hysteresis loop drawn as a smooth amber closed curve on thin dim-grey axes labelled H horizontally and B vertically in muted white, with the interior lightly tinted translucent amber; small labelled markers where the curve crosses the vertical axis reading retentivity and where it crosses the horizontal axis reading coercivity, plus a note at the top reading saturation. Right panel: two loops overlaid on one set of axes — a very narrow tall amber loop labelled soft iron and a wide fat dimmer loop labelled steel. Generous dark space, no gridlines, no clutter.',
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Hysteresis is not a defect to be engineered away — for half of electrical technology it **is** the product.\n\n**Every hard disk and magnetic stripe** relies on it. A tiny region of a hard magnetic film is set one way or the other by a write head, and then it **stays** there — for years, without power. That is retentivity doing its job, and high coercivity is what stops a stray field erasing your data.\n\n**Every transformer** relies on avoiding it. The core is laminated soft iron or silicon steel chosen for the thinnest loop obtainable, because at 50 cycles a second even a modest loop area becomes kilowatts of waste heat in a large transformer.\n\nSo the next time a hard disk survives being left in a drawer for a decade, and a transformer hums along at 98% efficiency, both are the same graph read in opposite directions.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), two vignettes side by side separated by generous dark space, in thin dim-grey line art. Left: a hard-disk platter seen at an angle with a read-write head arm above it, and a magnified inset strip showing a row of small regions with alternating amber up-arrows and blue down-arrows representing stored bits. Right: a laminated transformer core drawn as a stack of thin plates in dim grey with two amber coils wound on it, and a small thermometer symbol beside it showing a low reading. Muted white minimal labels.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Ferromagnetism = atomic moments **cooperating** in **domains**, so $ \\chi $ is $ 10^{3}\\text{–}10^{5} $, not $ 10^{-5} $.\n- Unmagnetised iron has domains; they just point in different directions.\n- A field grows and rotates domains → **saturation** when all are aligned.\n- Above the **Curie temperature** domains dissolve and the material becomes paramagnetic.\n- **Retentivity** = $ B $ remaining at $ H = 0 $. **Coercivity** = reverse $ H $ needed to bring $ B $ to zero.\n- Loop **area** = energy lost per cycle per unit volume, as heat.\n- **Soft** (thin loop) → transformer cores. **Hard** (fat loop) → permanent magnets and data storage.',
    }),
    b('text', 14, {
      markdown: 'That closes Chapter 4. You can now handle a magnet as a dipole, work with the Earth\'s field, and say what any material does when a field is applied to it.\n\nOne promise is still outstanding. On p2 we claimed that a current loop is a magnetic dipole with $ m = NIA $, and used it without proof. The next chapter earns it — starting from the force a magnetic field exerts on a single moving charge, and building all the way back to the galvanometer that Chapter 3 relied on.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('An unmagnetised piece of iron still contains domains. It appears unmagnetised because',
          ['the domains point in different directions and cancel', 'the atomic moments inside each domain are random', 'it has no atomic magnetic moments', 'its susceptibility is zero'],
          0,
          'Within a domain the alignment is essentially perfect — that is what a domain is. What cancels is the *domains* against one another. Applying a field simply persuades them to agree, which is why so little field is needed.',
          2),
        q('Above the Curie temperature, a ferromagnetic material becomes',
          ['paramagnetic', 'diamagnetic', 'more strongly ferromagnetic', 'non-magnetic entirely'],
          0,
          'Thermal agitation destroys the cooperative alignment, so the domains dissolve — but the atoms keep their individual permanent moments. That is exactly a paramagnet, and it then obeys Curie\'s law.',
          2),
        q('For a transformer core you would choose a material with',
          ['low coercivity and a thin loop', 'high coercivity and a fat loop', 'high retentivity and a fat loop', 'zero susceptibility at all fields'],
          0,
          'The core is magnetised and demagnetised 100 times a second, and the loop area is energy lost as heat on every cycle. A thin loop keeps that waste small — which is why cores are soft iron and permanent magnets are not.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p5, p6, p7, p8, p9]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
