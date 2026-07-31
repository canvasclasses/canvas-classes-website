'use strict';
/**
 * Class 12 Physics · Ch.5 "Magnetic Effects of Current" — pages 12–15.
 * Ampere's circuital law, the solenoid and toroid, the current loop as a
 * magnetic dipole (paying the Chapter 4 promise), and the moving-coil
 * galvanometer with its conversions.
 *
 * Run: node scripts/physics12-book/build_ch5_c_ampere.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 5;

// ── p12 · Ampère's Circuital Law ─────────────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'amperes-circuital-law',
  title: "Ampère's Circuital Law",
  subtitle: "The magnetic twin of Gauss's law",
  glossary: [
    { term: "Ampère's circuital law", definition: 'The line integral of $ \\vec{B} $ round any closed loop equals $ \\mu_0 $ times the current threading that loop.' },
    { term: 'Amperean loop', definition: 'An imaginary closed path, chosen for its symmetry, round which Ampère\'s law is applied.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Deriving the field of a long straight wire with Biot-Savart took an integral and a page of trigonometry.\n\nChapter 1 had exactly this problem with an infinite charged sheet — and Gauss\'s law reduced it to two lines. Is there a magnetic equivalent?',
      hint: 'Gauss used a closed *surface* and flux. What is the natural closed thing for a field that circles rather than radiates?',
      reveal: '**Yes — and the difference in what you close is the whole point.**\n\nAn electric field **radiates** from its source, so you surround the source with a closed **surface** and count the flux through it. That is Gauss.\n\nA magnetic field **circles** its source, so you encircle the source with a closed **loop** and add up $ \\vec{B} $ along it. That is **Ampère**.\n\nSurface and flux for a radiating field; loop and circulation for a circulating one. Same strategic idea — exploit symmetry to avoid an integral — matched to a different geometry.',
    }),
    b('text', 1, {
      markdown: 'Take **any** closed loop in space. Walk round it, adding up the component of $ \\vec{B} $ along your direction of travel at each step. The answer depends only on how much current threads through the loop:',
    }),
    b('latex_block', 2, {
      latex: '\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{\\text{enclosed}}',
      label: "Ampère's circuital law",
      note: 'I_enclosed is the net current threading the loop. Currents outside it contribute nothing to the integral.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Everything Chapter 1 said about Gauss\'s law applies here almost word for word, and the parallels are worth setting out because they make both laws easier to remember.',
    }),
    b('table', 4, {
      caption: "Gauss and Ampère, side by side. Two answers to the same strategic problem.",
      headers: ['', "Gauss's law (electric)", "Ampère's law (magnetic)"],
      rows: [
        ['Statement', '$ \\oint\\vec{E}\\cdot d\\vec{S} = \\frac{q_{\\text{in}}}{\\varepsilon_0} $', '$ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}} $'],
        ['What you close', 'a **surface**', 'a **loop**'],
        ['What you add up', 'flux **through** it', 'circulation **along** it'],
        ['Source counted', 'charge **inside** the surface', 'current **threading** the loop'],
        ['Sources outside', 'contribute **zero net flux**', 'contribute **zero net circulation**'],
        ['But $ \\vec{E} $ or $ \\vec{B} $ itself', 'due to **all** charges', 'due to **all** currents'],
        ['Always true?', 'Yes', 'Yes (for steady currents)'],
        ['Always **useful**?', 'Only with high symmetry', 'Only with high symmetry'],
      ],
    }),
    b('text', 5, {
      markdown: 'That sixth row is the same subtlety that caught people out in Chapter 1, and it catches them again here. The **field** at any point on your loop is produced by every current there is, inside or outside. What Ampère guarantees is only that the *sum* of $ \\vec{B}\\cdot d\\vec{l} $ round the closed loop is blind to the outside ones.\n\nAnd as with Gauss, being always **true** is not the same as being always **useful**. To pull $ B $ out of the integral you need a loop on which $ B $ is constant in magnitude and either parallel or perpendicular to the path everywhere — and that requires the current distribution itself to be symmetric.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'A closed Amperean loop is drawn near a current-carrying wire, but the wire does **not** pass through the loop. What is $ \\oint\\vec{B}\\cdot d\\vec{l} $ round it, and is $ \\vec{B} $ zero on the loop?',
      options: [
        'The integral is zero, but $ \\vec{B} $ is not zero anywhere on the loop',
        'Both the integral and $ \\vec{B} $ are zero',
        'The integral is non-zero because $ \\vec{B} $ is non-zero',
        'The integral cannot be evaluated',
      ],
      reveal: '**The integral is zero, but the field certainly is not.**\n\nNo current threads the loop, so $ I_{\\text{enc}} = 0 $ and the circulation vanishes. But the wire is right there — its field is non-zero at every point of your loop.\n\nWhat happens is that the positive and negative contributions to $ \\vec{B}\\cdot d\\vec{l} $ cancel exactly as you go round: on the part of the loop nearer the wire the field is stronger but you travel a shorter arc; further away it is weaker but the arc is longer. The two balance perfectly.\n\n**This is precisely the Chapter 1 trap in magnetic form.** There, a charge outside a Gaussian surface contributed zero *net flux* while still contributing to $ \\vec{E} $ everywhere on it. Here a current outside the loop contributes zero *net circulation* while still contributing to $ \\vec{B} $ everywhere on it.\n\nSo never say "the field on the Amperean loop is due to the enclosed current." It is only true when symmetry makes it true.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'Using it: the straight wire, in two lines',
      level: 2,
      objective: 'Derive the field of a long straight wire from Ampère\'s law and see why the loop must be a circle.',
    }),
    b('text', 8, {
      markdown: 'Take a long straight wire carrying $ I $. Symmetry tells us the field must have the same magnitude everywhere at the same distance, and must circle the wire — so the right Amperean loop is a **circle** of radius $ d $, centred on the wire, in a plane perpendicular to it.\n\nOn that loop, $ \\vec{B} $ is parallel to $ d\\vec{l} $ at every point and constant in magnitude. So the integral collapses:\n\n$ \\oint\\vec{B}\\cdot d\\vec{l} = B\\oint dl = B(2\\pi d) $\n\nSetting that equal to $ \\mu_0 I $:\n\n$ B(2\\pi d) = \\mu_0 I \\quad\\Rightarrow\\quad B = \\frac{\\mu_0 I}{2\\pi d} $\n\nTwo lines, and it agrees exactly with the Biot-Savart result from p10. The whole page of trigonometry has been replaced by the choice of a circular loop.',
    }),
    b('heading', 9, {
      text: 'Inside a thick wire',
      level: 2,
      objective: 'Find the field inside a current-carrying conductor and sketch B against r.',
    }),
    b('text', 10, {
      markdown: 'Now a genuinely new result, and one Biot-Savart handles clumsily. Take a thick cylindrical wire of radius $ R $ carrying current $ I $ spread **uniformly** over its cross-section, and ask for the field at a distance $ r < R $ — inside the metal.\n\nDraw a circular Amperean loop of radius $ r $. It only encloses the fraction of the current inside it:\n\n$ I_{\\text{enc}} = I\\cdot\\frac{\\pi r^{2}}{\\pi R^{2}} = I\\frac{r^{2}}{R^{2}} $\n\nSo $ B(2\\pi r) = \\mu_0 I\\frac{r^{2}}{R^{2}} $, giving',
    }),
    b('latex_block', 11, {
      latex: 'B_{\\text{inside}} = \\frac{\\mu_0 I r}{2\\pi R^{2}} \\quad (r<R), \\qquad B_{\\text{outside}} = \\frac{\\mu_0 I}{2\\pi r} \\quad (r>R)',
      label: 'Field inside and outside a thick current-carrying wire',
      note: 'Rises LINEARLY with r inside, then falls as 1/r outside. Maximum at the surface.',
      highlight: true,
    }),
    b('text', 12, {
      markdown: 'So the field is **zero at the axis**, rises linearly to a maximum at the surface, and then falls off as $ 1/r $ outside. Both expressions give $ \\frac{\\mu_0I}{2\\pi R} $ at $ r = R $, so the field is continuous there.\n\nIf that shape looks familiar, it should. It is exactly the pattern of the **uniformly charged solid sphere** from Chapter 1 — linear inside, inverse-power outside, continuous at the boundary — and for the same reason: as you move outward inside the material, you enclose progressively more source.',
    }),
    b('image', 13, {
      src: '',
      alt: 'A circular Amperean loop round a straight wire, and a graph of B against r for a thick wire rising linearly then falling',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Circle the wire and the integral collapses. Inside a thick wire, only the enclosed fraction of the current counts.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a vertical amber wire seen with a horizontal dashed grey circle drawn round it in perspective, with small orange field arrows tangential to the circle at several points and a dashed radius labelled d; a small orange current arrow on the wire. Right panel: a graph with thin dim-grey axes labelled r horizontally and B vertically in muted white, showing an amber trace that rises as a straight line from the origin to a peak at a dashed vertical line marked R, then falls smoothly as one over r, with no break at R. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}} $ — circulation round a **loop**, not flux through a surface.\n- Currents **outside** the loop contribute zero circulation, but they still contribute to $ \\vec{B} $ on it.\n- Always true; **useful** only when symmetry lets you pull $ B $ out of the integral.\n- Straight wire: circular loop → $ B = \\frac{\\mu_0I}{2\\pi d} $ in two lines.\n- Thick wire: $ B \\propto r $ inside, $ B \\propto 1/r $ outside, maximum at the surface, continuous there.',
    }),
    b('text', 15, {
      markdown: 'Next: the two geometries Ampère\'s law was made for — and the second one is how you build a strong, uniform field to order.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q("In Ampère's circuital law, the current on the right-hand side is",
          ['only the current threading the loop', 'the total current in the whole circuit', 'the current in the wire nearest the loop', 'the current outside the loop'],
          0,
          'Only currents passing through the loop enter $ I_{\\text{enc}} $. Currents outside contribute zero to the circulation — although they do still contribute to the field at every point on the loop, which is a different statement.',
          2),
        q('Inside a thick straight wire carrying a uniformly distributed current, the magnetic field varies with distance from the axis as',
          ['$ B \\propto r $', '$ B \\propto 1/r $', '$ B \\propto 1/r^{2} $', '$ B $ is constant'],
          0,
          'An Amperean circle of radius $ r $ encloses only the fraction $ r^{2}/R^{2} $ of the current, and dividing by the circumference $ 2\\pi r $ leaves a linear dependence. Outside the wire it reverts to $ 1/r $.',
          2),
        q("Ampère's law is useful for finding $ \\vec{B} $ only when",
          ['the current distribution is symmetric', 'the current involved is very large', 'the Amperean loop chosen is circular', 'no other currents are present nearby'],
          0,
          'The law is always true, but to extract $ B $ you need a loop on which it is constant and either parallel or perpendicular to the path — and only a symmetric current distribution allows one to be found.',
          3),
      ],
    }),
  ],
};

// ── p13 · The Solenoid and the Toroid ────────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'the-solenoid-and-the-toroid',
  title: 'The Solenoid and the Toroid',
  subtitle: 'How to build a uniform magnetic field to order',
  glossary: [
    { term: 'solenoid', definition: 'A long cylindrical coil of closely wound turns, producing a nearly uniform field along its interior.' },
    { term: 'toroid', definition: 'A solenoid bent round into a closed ring, so that its field is entirely confined inside.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Chapter 2 needed a uniform **electric** field, and got one easily: two parallel plates, and the field between them is uniform almost by accident.\n\nA uniform **magnetic** field is harder. A single loop gives a field that varies from point to point, and no arrangement of magnets gives you a big uniform region cheaply.\n\nThe answer is to stack many loops into a **solenoid** — and the interior field then comes out remarkably uniform, and depends on nothing but the turns per metre and the current.',
    }),
    b('text', 1, {
      markdown: 'A **solenoid** is a long cylinder wound with $ n $ turns per unit length, carrying current $ I $.\n\nInside a long solenoid, the fields of the individual turns add along the axis and largely cancel radially, giving a nearly uniform axial field. Outside, the field is very weak — the return flux is spread over the whole of the surrounding space, so for an ideal infinite solenoid it is **zero**.\n\nThat is exactly the symmetry Ampère\'s law needs. Take a rectangular Amperean loop with one long side of length $ L $ inside the solenoid, parallel to the axis, and the other outside.\n\n- The inside side contributes $ BL $.\n- The outside side contributes **nothing** ($ B = 0 $ there).\n- The two short sides contribute nothing ($ \\vec{B} \\perp d\\vec{l} $).\n\nAnd the current threading the loop is $ (nL)I $, since $ nL $ turns pass through it. So $ BL = \\mu_0 nLI $, and the $ L $ cancels:',
    }),
    b('latex_block', 2, {
      latex: 'B = \\mu_0 n I \\qquad \\text{(inside a long solenoid)}',
      label: 'Field inside a long solenoid',
      note: 'n is turns per unit LENGTH, not the total number of turns. Note what is absent: the radius, and your position inside.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Three things about that result are worth noticing, and each has a practical consequence.\n\n**The radius does not appear.** A fat solenoid and a thin one with the same turns per metre give the same interior field. So you can make the working volume as large as you can afford to wind.\n\n**Your position inside does not appear.** The field is the same on the axis and near the windings — genuinely uniform, which is what you wanted.\n\n**Only $ n $ and $ I $ matter.** So to double the field, either double the current or wind the turns twice as densely. Adding turns at the *ends* does nothing; it is the density that counts.\n\nOne honest caveat: at the **ends** of a real solenoid the field falls off, reaching about **half** the interior value right at the mouth, $ B_{\\text{end}} = \\tfrac{1}{2}\\mu_0 nI $. The uniform result holds well away from the ends, which is why a solenoid is made much longer than it is wide.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'quantitative',
      prompt: 'A solenoid $ 50 $ cm long has $ 1000 $ turns and carries $ 2.0 $ A. What is the field inside it?',
      options: ['$ 5.0\\times10^{-3} $ T', '$ 2.5\\times10^{-3} $ T', '$ 2.5 $ T', '$ 1.3\\times10^{-3} $ T'],
      reveal: '**$ 5.0\\times10^{-3} $ T.**\n\nThe step people miss is that $ n $ is turns **per metre**, not the total:\n\n$ n = \\frac{1000}{0.50} = 2000\\ \\text{turns/m} $\n\n$ B = \\mu_0 nI = (4\\pi\\times10^{-7})(2000)(2.0) = (1.257\\times10^{-6})(4000) $\n\n$ B = 5.0\\times10^{-3}\\ \\text{T} $\n\nAbout $ 5 $ mT, or a hundred times the Earth\'s field, from a very ordinary coil and current.\n\n**Using $ N = 1000 $ directly instead of $ n = 2000 $** would have halved the answer — and that is the single commonest error on this formula. **Always divide by the length first**, and check that your $ n $ has units of per-metre.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'The toroid — a solenoid with no ends',
      level: 2,
      objective: 'Derive the toroid field and explain why it has no leakage.',
    }),
    b('text', 6, {
      markdown: 'The solenoid\'s one flaw is its ends: the field falls off there, and some flux leaks out. Bend the solenoid round until its two ends meet and the problem disappears. That is a **toroid** — a doughnut-shaped coil.\n\nTake a circular Amperean loop of radius $ r $ running round inside the core. By symmetry $ B $ is constant along it and tangential everywhere, so\n\n$ B(2\\pi r) = \\mu_0 NI $\n\nwhere $ N $ is the **total** number of turns (every one of them threads the loop once). Hence',
    }),
    b('latex_block', 7, {
      latex: 'B = \\frac{\\mu_0 N I}{2\\pi r} \\qquad \\text{(inside a toroid)}',
      label: 'Field inside a toroid',
      note: 'N is the TOTAL turns here, not turns per metre. Note that B depends on r — the field is NOT uniform across the core.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'And now the two results that make a toroid useful:\n\n**The field outside is exactly zero** — both in the hole in the middle and everywhere beyond the coil. An Amperean loop drawn through the central hole encloses **no** current at all (the windings pass outside it), so the circulation is zero; and a loop drawn outside the whole toroid encloses each turn twice, once in each direction, so the net enclosed current is again zero.\n\nSo a toroid has **no external field and no leakage**. That is why transformer cores are ring-shaped: the flux is trapped in the core where it is wanted, rather than radiating out to interfere with everything nearby.\n\n**The field is not uniform across the core**, since $ B \\propto 1/r $ — it is stronger on the inner edge than the outer. But if the ring\'s radius is large compared with the core\'s thickness, $ r $ barely varies and $ B = \\mu_0 nI $ with $ n = N/2\\pi r $ recovers the solenoid formula. **A toroid is a solenoid bent into a circle**, and its formula reduces to the solenoid\'s in exactly that limit.',
    }),
    b('comparison_card', 9, {
      title: 'Solenoid and toroid',
      columns: [
        {
          heading: 'Solenoid',
          points: [
            '$ B = \\mu_0 nI $, with $ n $ = turns **per metre**',
            '**Uniform** inside, independent of radius and position',
            'About half the interior value at each end',
            'Field outside is weak but not zero — it leaks',
            'Used for electromagnets, relays, and anywhere a uniform field is needed',
          ],
        },
        {
          heading: 'Toroid',
          points: [
            '$ B = \\frac{\\mu_0 NI}{2\\pi r} $, with $ N $ = **total** turns',
            'Varies as $ 1/r $ across the core — not uniform',
            'No ends, so no end effects at all',
            'Field outside is **exactly zero** — no leakage',
            'Used for transformer cores and inductors, where confining the flux matters',
          ],
        },
      ],
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'An **MRI scanner** is a solenoid you can lie inside — and every design choice in it comes off this page.\n\nIt needs about $ 1.5 $ T, thirty thousand times the Earth\'s field, uniform to a few parts per million across a region big enough to hold a person. From $ B = \\mu_0 nI $, that needs an enormous $ nI $: thousands of turns per metre carrying hundreds of amps.\n\nNo ordinary wire could survive that — the $ I^{2}R $ heating from Chapter 3 would melt it in seconds. So the windings are **superconducting**, cooled with liquid helium, with literally zero resistance and therefore zero heating. Once the current is established, the power supply can be disconnected and the field persists for years.\n\nAnd the length-to-width ratio is exactly why the bore is an uncomfortably long tunnel rather than a short ring: the field is only uniform well away from the ends.\n\nThe **tokamak** fusion reactors take the other option — a toroid, chosen precisely because it has no ends for the plasma to leak out of.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), two vignettes side by side separated by generous dark space, in thin dim-grey line art. Left: a cutaway MRI scanner drawn as a long cylindrical bore with a tightly wound amber coil around it, straight dim-orange field arrows running uniformly along the axis inside, and a simplified patient outline on a bed within the bore; a small label reads superconducting windings. Right: a doughnut-shaped toroid wound with amber turns, with dim-orange field arrows circling entirely within the ring and clearly nothing outside it, and a small crossed-out arrow beyond the coil labelled no leakage. Muted white minimal labels.',
    }),
    b('worked_example', 11, {
      label: 'a toroid, and its solenoid limit',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A toroid has $ 3000 $ turns wound on a core whose mean radius is $ 25 $ cm, and carries $ 4.0 $ A. Find the field along the mean circumference. Then check the result against the solenoid formula.',
      solution: '**Using the toroid formula directly:**\n\n$ B = \\frac{\\mu_0 NI}{2\\pi r} = \\frac{(4\\pi\\times10^{-7})(3000)(4.0)}{2\\pi(0.25)} $\n\nThe $ \\pi $ cancels neatly. Using $ \\frac{\\mu_0}{2\\pi} = 2\\times10^{-7} $:\n\n$ B = \\frac{(2\\times10^{-7})(3000)(4.0)}{0.25} = \\frac{2.4\\times10^{-3}}{0.25} $\n\n$ B = 9.6\\times10^{-3}\\ \\text{T} $\n\n**Now the cross-check via the solenoid formula.** The mean circumference is\n\n$ 2\\pi r = 2\\pi(0.25) = 1.571\\ \\text{m} $\n\nso the turns per unit length along it are\n\n$ n = \\frac{3000}{1.571} = 1910\\ \\text{turns/m} $\n\n$ B = \\mu_0 nI = (4\\pi\\times10^{-7})(1910)(4.0) = 9.6\\times10^{-3}\\ \\text{T} $ ✓\n\n**The two agree exactly**, which is not a coincidence — a toroid *is* a solenoid closed into a ring, and $ n = N/2\\pi r $ is the same statement written two ways.\n\n**One caution.** This is the field on the **mean** circumference. Nearer the inner edge $ r $ is smaller and $ B $ larger; nearer the outer edge the reverse. The solenoid comparison only works because we used the mean radius.',
    }),
    b('image', 12, {
      src: '',
      alt: 'A solenoid with a rectangular Amperean loop, and a toroid with a circular Amperean loop inside the core',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'A rectangle for the solenoid, a circle for the toroid. Choosing the loop is the whole skill.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, in thin dim-grey line art. Left panel: a solenoid drawn in cross-section as two rows of small circles with current dots and crosses, straight evenly spaced dim-orange field arrows running along the interior and essentially nothing outside; a dashed grey rectangle straddles the winding with one long side inside and one outside, its inside side labelled L. Right panel: a toroid drawn as a doughnut in cross-hatched perspective wound with amber turns, with a dashed grey circle drawn round inside the core and dim-orange field arrows tangential to it, and a clearly empty central hole with a small muted-white label reading B equals zero. Generous dark space.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Solenoid:** $ B = \\mu_0 nI $ inside, with $ n $ = turns **per metre**. Divide by the length first.\n- Independent of radius and of where you are inside — genuinely uniform.\n- About $ \\tfrac{1}{2}\\mu_0 nI $ at each end; the uniform result needs a long solenoid.\n- **Toroid:** $ B = \\frac{\\mu_0 NI}{2\\pi r} $ with $ N $ = **total** turns. Varies as $ 1/r $.\n- Field **outside** a toroid is exactly zero, in the hole and beyond — hence no leakage, hence ring-shaped transformer cores.\n- $ n = N/2\\pi r $ turns the toroid formula into the solenoid one.',
    }),
    b('text', 14, {
      markdown: 'Next: the promise from Chapter 4, finally paid in full.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic field inside a long solenoid depends on',
          ['the turns per unit length and the current', 'the total number of turns and the current', 'the radius of the solenoid', 'the distance from the axis'],
          0,
          '$ B = \\mu_0 nI $ contains only $ n $ and $ I $. Neither the radius nor your position inside appears, which is precisely what makes the interior field uniform.',
          2),
        q('The magnetic field outside an ideal toroid is',
          ['exactly zero', 'equal to the field inside', 'half the field inside', 'inversely proportional to the distance'],
          0,
          'An Amperean loop through the central hole encloses no current, and one drawn outside the whole toroid encloses every turn twice in opposite senses. Both give zero circulation — which is why a toroid confines its flux completely.',
          2),
        q('A solenoid $ 25 $ cm long has $ 500 $ turns and carries $ 1.0 $ A. The field inside is',
          ['$ 2.5\\times10^{-3} $ T', '$ 6.3\\times10^{-4} $ T', '$ 2.5\\times10^{-4} $ T', '$ 6.3\\times10^{-1} $ T'],
          0,
          '$ n = 500/0.25 = 2000 $ per metre, so $ B = (4\\pi\\times10^{-7})(2000)(1.0) = 2.5\\times10^{-3} $ T. Using the total 500 turns instead of the density would give a quarter of this — the standard error on this formula.',
          2),
      ],
    }),
  ],
};

// ── p14 · A Current Loop Is a Magnetic Dipole ────────────────────────────────
const p14 = {
  page_number: 14,
  slug: 'a-current-loop-is-a-magnetic-dipole',
  title: 'A Current Loop Is a Magnetic Dipole',
  subtitle: 'Paying the debt from Chapter 4',
  glossary: [],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Chapter 4 asserted, without proof, that a coil of $ N $ turns and area $ A $ carrying current $ I $ is a magnetic dipole of moment $ m = NIA $ — and then used it.\n\nTwo things have to be shown for that claim to be honest. What are they?',
      hint: 'What does a dipole moment actually determine?',
      reveal: 'A dipole moment does exactly two jobs, so both have to check out:\n\n1. It sets the **field** the dipole produces far away: $ B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi}\\frac{2m}{r^{3}} $.\n2. It sets the **torque** the dipole feels in an external field: $ \\vec{\\tau} = \\vec{m}\\times\\vec{B} $.\n\nPage 11 already did the first: the axial field of a loop, far away, came out as the dipole formula with $ m = IA $.\n\nThis page does the second. And once both agree, "a current loop is a magnetic dipole" is not an analogy — it is a statement that nothing measurable distinguishes them.',
    }),
    b('heading', 1, {
      text: 'The torque on a rectangular loop',
      level: 2,
      objective: 'Derive $ \\tau = NIAB\\sin\\theta $ from the force on each side of a loop.',
    }),
    b('text', 2, {
      markdown: 'Take a rectangular loop of sides $ a $ and $ b $, carrying current $ I $, in a uniform field $ \\vec{B} $, with the field in the plane of the page and the loop free to turn about a vertical axis.\n\nApply $ \\vec{F} = I(\\vec{l}\\times\\vec{B}) $ to each of the four sides:\n\n**The two sides of length $ a $** (parallel to the rotation axis) carry current in opposite directions, so they feel forces $ F = BIa $ in opposite directions — but along **different lines**. That is a couple.\n\n**The two sides of length $ b $** feel forces that are equal, opposite, **and along the same line**. They cancel completely and produce no torque.\n\nSo the torque comes from the first pair alone. Their lines of action are separated by $ b\\sin\\theta $, where $ \\theta $ is the angle between the loop\'s normal and the field:\n\n$ \\tau = F \\times (b\\sin\\theta) = (BIa)(b\\sin\\theta) = BI(ab)\\sin\\theta $\n\nAnd $ ab $ is the **area** $ A $. For $ N $ turns, multiply by $ N $:',
    }),
    b('latex_block', 3, {
      latex: '\\tau = NIAB\\sin\\theta = mB\\sin\\theta, \\qquad \\vec{\\tau} = \\vec{m}\\times\\vec{B} \\quad\\text{with}\\quad \\vec{m} = NI\\vec{A}',
      label: 'Torque on a current loop — and the identification of m',
      note: 'Compare with Chapter 4: τ = mB sinθ for a bar magnet. Identical, with m = NIA. The promise is paid.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'And the shape never entered. We used a rectangle for convenience, but the result holds for a loop of **any** shape — because any loop can be built from small rectangles, and the contributions add as areas.\n\nSo both tests are passed. A current loop produces a dipole field with $ m = NIA $, and it feels a dipole torque with the same $ m $. **There is no measurement that distinguishes a current loop from a bar magnet of the same moment.**\n\nWhich also settles the deeper question from Chapter 4: a bar magnet is nothing more than an enormous number of atomic current loops, mostly aligned. Poles were only ever bookkeeping.',
    }),
    b('table', 5, {
      caption: 'Everything from Chapter 4, now available for a current loop with $ m = NIA $.',
      headers: ['Quantity', 'Bar magnet', 'Current loop'],
      rows: [
        ['Dipole moment', '$ m = q_m(2l) $, S to N', '$ m = NIA $, by the right-hand rule'],
        ['Torque in a field', '$ \\tau = mB\\sin\\theta $', '$ \\tau = NIAB\\sin\\theta $'],
        ['Potential energy', '$ U = -mB\\cos\\theta $', '$ U = -NIAB\\cos\\theta $'],
        ['Stable orientation', '$ \\vec{m} $ along $ \\vec{B} $', 'loop\'s normal along $ \\vec{B} $'],
        ['Net force (uniform field)', 'zero', 'zero'],
        ['Axial field, far away', '$ \\frac{\\mu_0}{4\\pi}\\frac{2m}{r^{3}} $', 'the same, with $ m = NIA $'],
        ['Period of small oscillations', '$ 2\\pi\\sqrt{\\mathcal{I}/mB} $', 'the same, with $ m = NIA $'],
      ],
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'A circular coil of $ 50 $ turns and radius $ 4.0 $ cm carries $ 0.50 $ A in a uniform field of $ 0.30 $ T. What is the maximum torque on it?',
      options: [
        '$ 3.8\\times10^{-2} $ N·m',
        '$ 7.5\\times10^{-4} $ N·m',
        '$ 3.8\\times10^{-4} $ N·m',
        '$ 1.9\\times10^{-2} $ N·m',
      ],
      reveal: '**$ 3.8\\times10^{-2} $ N·m.**\n\nFirst the moment:\n\n$ m = NIA = (50)(0.50)\\pi(0.040)^{2} = (25)\\pi(1.6\\times10^{-3}) = 0.126\\ \\text{A·m}^{2} $\n\nMaximum torque is at $ \\theta = 90^\\circ $, where $ \\sin\\theta = 1 $:\n\n$ \\tau_{\\max} = mB = (0.126)(0.30) = 3.8\\times10^{-2}\\ \\text{N·m} $\n\n**Two things to be careful about.** The radius must be converted to metres **before** squaring — leaving it in centimetres costs a factor of $ 10^{4} $. And the maximum torque is at $ 90^\\circ $, not at $ 0^\\circ $: a loop already aligned with the field feels no torque at all.\n\n**And notice what this number is.** It is exactly the torque a bar magnet of moment $ 0.126\\ \\text{A·m}^{2} $ would feel in the same field. The coil and the magnet are interchangeable.',
      difficulty_level: 2,
    }),
    b('text', 7, {
      markdown: 'One further consequence worth stating, because it connects back to Chapter 4\'s magnetic materials.\n\nAn electron orbiting a nucleus **is** a tiny current loop, so it has a magnetic moment. An electron\'s spin contributes another. In most atoms these pair up and cancel — those are the **diamagnetic** materials. Where they do not cancel, the atom has a permanent moment — **paramagnetic**. And where neighbouring atoms lock their moments parallel, you get **ferromagnetism**.\n\nSo the whole classification on Chapter 4 p8 and p9 rests on this page. Atomic current loops are where magnetism in matter comes from.',
    }),
    b('image', 8, {
      src: '',
      alt: 'A rectangular current loop at an angle in a uniform field, showing the couple from two opposite sides and the moment vector along the normal',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Two sides make a couple; the other two cancel. The moment points along the loop normal.',
      generation_prompt: 'Clean scientific 3D-perspective diagram on a near-black background (#0B0C0F). A rectangular loop drawn in amber, tilted so its plane is at an angle to a set of evenly spaced horizontal dim-orange field arrows running left to right. Small orange current arrows circulate round the loop. Bold orange force arrows point out of the page on one vertical side and into the page on the opposite one, with a curved amber arrow indicating the resulting rotation. A dashed grey normal arrow through the loop centre is labelled m, with a small arc between it and the field direction labelled theta. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{m} = NI\\vec{A} $, direction by the right-hand rule (curl fingers with the current, thumb gives $ \\vec{m} $).\n- $ \\tau = NIAB\\sin\\theta = mB\\sin\\theta $; maximum at $ \\theta = 90^\\circ $, zero at $ 0^\\circ $ and $ 180^\\circ $.\n- $ U = -mB\\cos\\theta $. Stable with the loop normal **along** $ \\vec{B} $.\n- Net force in a uniform field is **zero** — only a torque.\n- The result is independent of the loop\'s **shape**; only its area matters.\n- **Every Chapter 4 dipole formula now applies to a coil**, with $ m = NIA $.',
    }),
    b('text', 10, {
      markdown: 'Next: build an instrument out of that torque — the galvanometer that every measurement in Chapter 3 quietly depended on.',
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic dipole moment of a coil of $ N $ turns, area $ A $, carrying current $ I $ is',
          ['$ NIA $', '$ IA/N $', '$ NI/A $', '$ N^{2}IA $'],
          0,
          'Each turn contributes $ IA $, and $ N $ turns give $ NIA $. Its direction is along the loop normal, given by the right-hand rule. The unit A·m² confirms it — an ampere times an area.',
          1),
        q('The torque on a current loop in a uniform magnetic field is maximum when the plane of the loop is',
          ['parallel to the field', 'perpendicular to the field', 'at $ 45^\\circ $ to the field', 'it does not depend on the orientation'],
          0,
          '$ \\tau = mB\\sin\\theta $ with $ \\theta $ measured between the **normal** and the field. The torque peaks at $ \\theta = 90^\\circ $, which means the normal is across the field and therefore the loop\'s **plane** contains it. Reading $ \\theta $ from the plane instead of the normal is the classic slip.',
          3),
        q('The torque on a current loop in a uniform field depends on its shape',
          ['not at all — only its area matters', 'only if the loop is circular', 'strongly, through its perimeter', 'only for more than one turn'],
          0,
          'The derivation for a rectangle generalises because any loop can be built from small rectangles whose areas add. This is why a circular coil and a square coil of the same area and current behave identically.',
          2),
      ],
    }),
  ],
};

// ── p15 · Inside a Galvanometer ──────────────────────────────────────────────
const p15 = {
  page_number: 15,
  slug: 'inside-a-galvanometer',
  title: 'Inside a Galvanometer',
  subtitle: 'A dipole in a field, with a spring — and the meters built from it',
  glossary: [
    { term: 'moving-coil galvanometer', definition: 'A current-measuring instrument in which a coil suspended in a radial magnetic field turns against a spring by an angle proportional to the current.' },
    { term: 'current sensitivity', definition: 'The deflection produced per unit current, $ \\theta/I = NAB/k $.' },
    { term: 'radial field', definition: 'A magnetic field shaped by curved pole pieces and a soft-iron core so that it is always in the plane of the coil, whatever its orientation.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Chapter 3 used a galvanometer on four separate pages — as the detector in a Wheatstone bridge, in a meter bridge, in a potentiometer, and as the movement inside every ammeter and voltmeter.\n\nEach time, we said "it deflects in proportion to the current" and moved on.\n\nThat proportionality is not obvious, and getting it required a genuinely clever piece of engineering. This page is the debt being settled.',
    }),
    b('text', 1, {
      markdown: 'A **moving-coil galvanometer** is a coil of $ N $ turns and area $ A $, suspended between the poles of a permanent magnet, with a light spring (or a torsion fibre) resisting its rotation and a pointer attached.\n\nPass a current $ I $ and the coil — being a magnetic dipole, as the last page established — feels a torque $ NIAB\\sin\\theta $. It turns until the spring\'s restoring torque $ k\\theta $ balances it, where $ k $ is the spring constant.\n\nAnd here is the problem. At equilibrium,\n\n$ NIAB\\sin\\theta = k\\theta $\n\nThat $ \\sin\\theta $ is a disaster for an instrument. It means the deflection is **not** proportional to the current, so the scale would be badly non-linear — crowded at one end and stretched at the other — and it would depend on where the coil happened to be sitting.',
    }),
    b('heading', 2, {
      text: 'The trick: make the field radial',
      level: 2,
      objective: 'Explain how a radial field removes the $ \\sin\\theta $ and linearises the scale.',
    }),
    b('text', 3, {
      markdown: 'The solution is to shape the magnet so that $ \\theta $ is **always $ 90^\\circ $**.\n\nThe pole pieces are made **concave**, and a cylindrical **soft-iron core** is placed inside the coil. Between them they force the field lines to run radially — so wherever the coil turns to, the field is still in its plane and still perpendicular to its normal.\n\nWith $ \\sin\\theta = 1 $ permanently, the balance condition becomes\n\n$ NIAB = k\\theta $\n\nand therefore',
    }),
    b('latex_block', 4, {
      latex: '\\theta = \\left(\\frac{NAB}{k}\\right) I \\qquad\\Rightarrow\\qquad \\theta \\propto I',
      label: 'Why a galvanometer has a linear scale',
      note: 'The radial field is what removes the sinθ. Without it the scale would be non-linear and useless.',
      highlight: true,
    }),
    b('text', 5, {
      markdown: 'A linear scale, with equal divisions all the way along — and it exists only because of the shape of the pole pieces. That is the piece of engineering worth admiring here: a geometric trick that turns an awkward $ \\sin\\theta $ into a clean proportionality.\n\nThe soft-iron core does a second job too. Its high permeability (Chapter 4, p7) concentrates the flux through the coil, so $ B $ is larger and the instrument more sensitive.',
    }),
    b('heading', 6, {
      text: 'Sensitivity, and why you cannot have everything',
      level: 2,
      objective: 'Define current and voltage sensitivity and explain why increasing one may not increase the other.',
    }),
    b('text', 7, {
      markdown: '**Current sensitivity** is the deflection per unit current:\n\n$ \\frac{\\theta}{I} = \\frac{NAB}{k} $\n\nSo to make a galvanometer more sensitive: more turns, larger area, stronger field, or a weaker spring.\n\n**Voltage sensitivity** is the deflection per unit voltage across it, and since $ V = IG $:\n\n$ \\frac{\\theta}{V} = \\frac{NAB}{kG} $\n\nNow there is a tension between the two, and it is a favourite exam point. Suppose you double the number of turns $ N $. The current sensitivity doubles — but twice as much wire means roughly twice the coil resistance $ G $, so the voltage sensitivity is\n\n$ \\frac{2NAB}{k(2G)} = \\frac{NAB}{kG} $\n\n**unchanged.**\n\nSo **increasing the current sensitivity does not necessarily increase the voltage sensitivity.** The two are independent specifications, and which one matters depends on what you are building the meter to do.',
    }),
    b('heading', 8, {
      text: 'Making the meters — the Chapter 3 conversions, now justified',
      level: 2,
      objective: 'Recall the shunt and multiplier conversions and connect them to the galvanometer\'s construction.',
    }),
    b('text', 9, {
      markdown: 'A galvanometer on its own is unusable as a practical meter: far too sensitive for an ampere, and the wrong resistance for a voltage. Chapter 3 p15 fixed both with one resistor each, and now you know what is inside the box:\n\n**Ammeter** — a small **shunt** $ S $ in **parallel**, to divert most of the current past the delicate coil:\n\n$ S = \\frac{I_gG}{I - I_g} $\n\n**Voltmeter** — a large **multiplier** $ R $ in **series**, to drop most of the voltage before the coil:\n\n$ R = \\frac{V}{I_g} - G $\n\nAnd the reason the two go opposite ways is entirely about how each meter is connected: an ammeter goes **in series** so it must have near-zero resistance, while a voltmeter goes **in parallel** so it must have near-infinite resistance.',
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'A galvanometer\'s coil is rewound with twice as many turns of the same wire, keeping the area the same. What happens to its current sensitivity and its voltage sensitivity?',
      options: [
        'Current sensitivity doubles; voltage sensitivity is roughly unchanged',
        'Both double',
        'Both are roughly unchanged',
        'Current sensitivity is unchanged; voltage sensitivity doubles',
      ],
      reveal: '**Current sensitivity doubles; voltage sensitivity is roughly unchanged.**\n\n*Current sensitivity* $ = \\frac{NAB}{k} \\propto N $, so doubling $ N $ doubles it.\n\n*Voltage sensitivity* $ = \\frac{NAB}{kG} $. But twice the turns of the same wire means twice the length of wire, so the coil resistance $ G $ also roughly doubles. The $ N $ on top and the $ G $ underneath cancel, leaving it essentially unchanged.\n\n**This is the standard trap on this topic**, and the phrasing matters: "**increasing the current sensitivity does not necessarily increase the voltage sensitivity**." They are separate specifications.\n\nTo genuinely improve **both**, you have to change something that does not drag $ G $ along with it — a stronger magnet (larger $ B $), a larger coil area, or a weaker suspension (smaller $ k $). All three raise both sensitivities.',
      difficulty_level: 3,
    }),
    b('worked_example', 11, {
      label: 'sensitivity, and then both conversions',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A galvanometer has $ 100 $ turns of area $ 4.0\\ \\text{cm}^{2} $ in a radial field of $ 0.50 $ T, with a torsion constant $ k = 2.0\\times10^{-8} $ N·m per degree. Its coil resistance is $ 40\\ \\Omega $. Find (a) its current sensitivity in degrees per microamp, and (b) the shunt needed to make it read up to $ 500 $ mA, given that full-scale deflection is $ 30^\\circ $.',
      solution: '**(a) Current sensitivity.**\n\n$ A = 4.0\\ \\text{cm}^{2} = 4.0\\times10^{-4}\\ \\text{m}^{2} $\n\n$ \\frac{\\theta}{I} = \\frac{NAB}{k} = \\frac{(100)(4.0\\times10^{-4})(0.50)}{2.0\\times10^{-8}} = \\frac{2.0\\times10^{-2}}{2.0\\times10^{-8}} $\n\n$ = 1.0\\times10^{6}\\ \\text{degrees per ampere} $\n\nThat is an awkward number until you scale it: $ 10^{6} $ degrees per amp is **1 degree per microamp**. Which is a much more useful way to state it, and shows what "sensitive" means here — a millionth of an amp gives a visible deflection.\n\n**(b) The shunt.**\n\nFirst find the full-scale current from the sensitivity:\n\n$ I_g = \\frac{30^\\circ}{1.0\\times10^{6}\\ \\text{deg/A}} = 3.0\\times10^{-5}\\ \\text{A} = 30\\ \\mu\\text{A} $\n\nNow the shunt, for a full-scale reading of $ I = 0.500 $ A:\n\n$ S = \\frac{I_gG}{I-I_g} = \\frac{(3.0\\times10^{-5})(40)}{0.500 - 3.0\\times10^{-5}} = \\frac{1.2\\times10^{-3}}{0.49997} $\n\n$ S = 2.4\\times10^{-3}\\ \\Omega $\n\nAbout $ 2.4 $ milliohms — a stub of thick wire.\n\n**Note the scale of what just happened.** A $ 30 $ μA movement has been turned into a half-amp ammeter, a range increase of about 17,000 times, by one small piece of metal. And since $ I_g \\ll I $, the approximation $ S \\approx I_gG/I $ would have given the same answer to three figures.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Cross-section of a moving-coil galvanometer showing concave pole pieces, soft-iron core and the radial field through the coil',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Concave poles plus a soft-iron core make the field radial — which is what gives the instrument a linear scale.',
      generation_prompt: 'Clean scientific cross-section diagram on a near-black background (#0B0C0F). Two concave pole pieces facing each other in dim grey, one marked N and one marked S in muted white, with a cylindrical soft-iron core drawn as a grey circle at the centre. A rectangular coil shown edge-on as two small amber rectangles either side of the core, with current dot and cross symbols. Short dim-orange field arrows run radially from one pole face, through the coil positions, into the core and out to the other pole, clearly radial rather than straight. A fine spring spiral in thin grey at the top and a pointer over a small arc scale. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Balance: $ NIAB\\sin\\theta = k\\theta $. The **radial field** forces $ \\sin\\theta = 1 $, giving $ \\theta \\propto I $ and a **linear scale**.\n- Concave pole pieces + soft-iron core make the field radial; the core also concentrates the flux.\n- Current sensitivity $ = \\frac{NAB}{k} $. Voltage sensitivity $ = \\frac{NAB}{kG} $.\n- **More turns raises current sensitivity but not voltage sensitivity**, because $ G $ rises too.\n- **Ammeter:** shunt $ S = \\frac{I_gG}{I-I_g} $ in parallel; goes in series; ideally zero resistance.\n- **Voltmeter:** multiplier $ R = \\frac{V}{I_g}-G $ in series; goes in parallel; ideally infinite resistance.',
    }),
    b('text', 14, {
      markdown: 'That closes Chapter 5, and the electromagnetism block.\n\nLook at what has been joined up. Chapter 1 started with charges that do not move. Chapter 3 set them moving. Chapter 4 described magnets without knowing what they were. And this chapter showed that a magnet **is** moving charge — and that moving charge in a field feels a force, which is the whole of electric motors, meters and accelerators.\n\nOne symmetry remains conspicuously unexplored. A **current** produces a **magnetic field** — that was Oersted, and this chapter. So does a **changing magnetic field** produce a **current**?\n\nFaraday asked exactly that, spent ten years on it, and the answer turned out to be the foundation of every generator, transformer and power station on Earth. That is Chapter 6.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The pole pieces of a moving-coil galvanometer are made concave in order to',
          ['make the field radial at the coil', 'increase the strength of the permanent magnet', 'reduce the overall weight of the instrument', 'protect the coil from stray external fields'],
          0,
          'A radial field keeps the coil\'s plane always containing the field, so $ \\sin\\theta = 1 $ at every orientation. Without it the balance condition would carry a $ \\sin\\theta $ and the scale would be badly non-linear.',
          3),
        q('Increasing the number of turns of a galvanometer coil, using the same wire,',
          ['raises the current sensitivity but not the voltage sensitivity', 'raises both sensitivities', 'raises the voltage sensitivity but not the current sensitivity', 'changes neither'],
          0,
          'Current sensitivity $ \\propto N $, so it rises. But more turns of the same wire also raises the coil resistance $ G $ in proportion, and voltage sensitivity $ = NAB/kG $, so the two effects cancel.',
          3),
        q('To convert a galvanometer into an ammeter of a given range, you connect',
          ['a small resistance in parallel with it', 'a large resistance in series with it', 'a large resistance in parallel with it', 'a small resistance in series with it'],
          0,
          'The shunt diverts most of the current past the delicate coil and keeps the instrument\'s overall resistance very low — essential, since an ammeter is inserted in series and must not alter the current it is reading.',
          1),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p12, p13, p14, p15]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
