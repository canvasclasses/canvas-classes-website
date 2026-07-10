// Ch.5 (d- & f-Block) · Page 18 · The Actinoids — Configuration & Sizes
// NCERT §8.6 The Actinoids intro + §8.6.1 Electronic Configurations
// + §8.6.2 Ionic Sizes (PDF pp.230-231).
// NCERT content transcribed faithfully (same language/numbers/Table 8.10);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Device: "🔍 Decode This" (A-R trainer). No clean PYQ → Exam Vault skipped here.
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 18,
  chapter: 5,
  slug: 'actinoids-configuration-sizes',
  title: 'The Actinoids — Configuration & Sizes',
  subtitle: 'Why the fourteen elements after actinium are all radioactive, why their 5f and 6d levels keep swapping electrons, and why the actinoid contraction bites even harder than the lanthanoid one.',
  tags: ['f-block', 'actinoids', 'inner-transition', 'actinoid-contraction', 'radioactive'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a horizontal row of fourteen element tiles labelled Th, Pa, U ... Lr, each tile a little smaller than the last to show a strong steady shrinkage, with a small hand-drawn radioactive trefoil symbol faintly stamped on several tiles to signal radioactivity. Beneath the row, a 5f sub-shell drawn as a loosely held, more spread-out cloud of dots (less buried than 4f) labelled "5f — poorer shielding". A small banner reads "the actinoid contraction (greater than lanthanoid)". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'The actinoids: all radioactive, with 5f electrons that shield poorly — so their contraction is even greater than the lanthanoids\'.'
    ),

    h.heading('8.6 The Actinoids', 'State that the actinoids are the fourteen elements from Th to Lr and that they are all radioactive.'),
    h.text(
      'The actinoids include the fourteen elements from **Th to Lr.** The names, symbols and some properties of these elements are given in **Table 8.10**.\n\n' +
      'The actinoids are **radioactive elements** and the earlier members have relatively long half-lives, the latter ones have half-life values ranging from a day to 3 minutes for lawrencium ($Z = 103$). The latter members could be prepared only in nanogram quantities. These facts render their study more difficult.'
    ),

    h.heading('8.6.1 Electronic Configurations', 'Write the actinoid electronic configuration in the 7s² + variable 5f/6d form and note the f⁰, f⁷, f¹⁴ irregularities.'),
    h.text(
      'All the actinoids are believed to have the electronic configuration of **$7s^2$** and **variable occupancy of the $5f$ and $6d$ subshells.** The fourteen electrons are formally added to $5f$, though not in thorium ($Z = 90$) but from Pa onwards the $5f$ orbitals are complete at element 103.\n\n' +
      'The irregularities in the electronic configurations of the actinoids, like those in the lanthanoids are related to the stabilities of the **$f^0$, $f^7$ and $f^{14}$** occupancies of the $5f$ orbitals. Thus, the configurations of Am and Cm are $[\\ce{Rn}]\\,5f^7 7s^2$ and $[\\ce{Rn}]\\,5f^7 6d^1 7s^2$. Although the $5f$ orbitals resemble the $4f$ orbitals in their angular part of the wave-function, **they are not as buried as $4f$ orbitals and hence $5f$ electrons can participate in bonding to a far greater extent.**'
    ),

    h.table(
      ['Z', 'Name', 'Symbol', 'M', 'M³⁺', 'Radius M³⁺/pm', 'Radius M⁴⁺/pm'],
      [
        ['89', 'Actinium', 'Ac', '$6d^1 7s^2$', '$5f^0$', '111', '—'],
        ['90', 'Thorium', 'Th', '$6d^2 7s^2$', '$5f^1$', '—', '99'],
        ['91', 'Protactinium', 'Pa', '$5f^2 6d^1 7s^2$', '$5f^2$', '—', '96'],
        ['92', 'Uranium', 'U', '$5f^3 6d^1 7s^2$', '$5f^3$', '103', '93'],
        ['93', 'Neptunium', 'Np', '$5f^4 6d^1 7s^2$', '$5f^4$', '101', '92'],
        ['94', 'Plutonium', 'Pu', '$5f^6 7s^2$', '$5f^5$', '100', '90'],
        ['95', 'Americium', 'Am', '$5f^7 7s^2$', '$5f^6$', '99', '89'],
        ['96', 'Curium', 'Cm', '$5f^7 6d^1 7s^2$', '$5f^7$', '99', '88'],
        ['97', 'Berkelium', 'Bk', '$5f^9 7s^2$', '$5f^8$', '98', '87'],
        ['98', 'Californium', 'Cf', '$5f^{10} 7s^2$', '$5f^9$', '98', '86'],
        ['99', 'Einsteinium', 'Es', '$5f^{11} 7s^2$', '$5f^{10}$', '—', '—'],
        ['100', 'Fermium', 'Fm', '$5f^{12} 7s^2$', '$5f^{11}$', '—', '—'],
        ['101', 'Mendelevium', 'Md', '$5f^{13} 7s^2$', '$5f^{12}$', '—', '—'],
        ['102', 'Nobelium', 'No', '$5f^{14} 7s^2$', '$5f^{13}$', '—', '—'],
        ['103', 'Lawrencium', 'Lr', '$5f^{14} 6d^1 7s^2$', '$5f^{14}$', '—', '—'],
      ],
      'Table 8.10 — Some Properties of Actinium and Actinoids (only electrons outside the [Rn] core are indicated). The M⁴⁺ configurations begin at Th: Th = $5f^0$, Pa = $5f^1$, U = $5f^2$, Np = $5f^3$, Pu = $5f^4$, Am = $5f^5$, Cm = $5f^7$, Bk = $5f^7$, Cf = $5f^8$.'
    ),

    h.callout('exam_tip', 'Exam Point — 7s² is the constant; 5f/6d is the variable',
      'For the actinoids, anchor on the **$7s^2$** that every atom shares, then let the **$5f$ and $6d$** levels juggle the rest:\n\n' +
      '- Most actinoids are $[\\ce{Rn}]\\,5f^{\\,n} 7s^2$.\n' +
      '- A few keep a $6d^1$ where it gives an $f^0$/$f^7$ stability — e.g. **Cm = $[\\ce{Rn}]\\,5f^7 6d^1 7s^2$** (half-filled $5f^7$ held, one electron parked in $6d$).\n' +
      '- Compare with Gd in the lanthanoids ($4f^7 5d^1 6s^2$) — the same "protect the half-filled $f^7$" trick, one row up.\n\n' +
      'Key contrast to remember: $5f$ orbitals are **not as buried** as $4f$, so $5f$ electrons take part in bonding — this is why the actinoids show so many oxidation states (next page).'),

    h.heading('8.6.2 Ionic Sizes — the Actinoid Contraction', 'Define the actinoid contraction and explain why it is greater, element to element, than the lanthanoid contraction.'),
    h.text(
      'The general trend in lanthanoids is observable in the actinoids as well. There is a **gradual decrease in the size of atoms or $\\ce{M^{3+}}$ ions across the series.** This may be referred to as the **actinoid contraction** (like lanthanoid contraction). The contraction is, however, **greater from element to element in this series resulting from poorer shielding by $5f$ electrons.**'
    ),

    // ── 🔍 Decode This — the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"The contraction is greater from element to element in the actinoids than in the lanthanoids."*\n' +
      '> **NCERT (reason):** *"…resulting from poorer shielding by $5f$ electrons."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** The actinoid contraction is greater (element to element) than the lanthanoid contraction.\n' +
      '- **Reason (R):** $5f$ electrons shield the nuclear charge even more poorly than $4f$ electrons do.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** the build-up across this chapter — *imperfect $4f$ shielding* → lanthanoid contraction, and *even poorer $5f$ shielding* → a bigger actinoid contraction. Read "greater contraction **because** poorer shielding" straight off as A (the bigger contraction), R (the poorer $5f$ shielding).'),

    h.recap([
      { label: 'Who they are', text: 'The actinoids are the **fourteen elements from Th to Lr** — all **radioactive**; early ones have long half-lives, the later ones (down to Lr, ~3 min) are made only in nanogram amounts.' },
      { label: 'Configurations', text: 'All share **$7s^2$** with **variable $5f$ and $6d$** occupancy; irregularities (e.g. Cm = $[\\ce{Rn}]\\,5f^7 6d^1 7s^2$) trace to the stability of $f^0$, $f^7$, $f^{14}$.' },
      { label: '5f vs 4f', text: '$5f$ orbitals are **not as buried** as $4f$, so $5f$ electrons **participate in bonding** far more — the root of the actinoids\' rich chemistry.' },
      { label: 'Actinoid contraction', text: 'A **gradual decrease** in atom / $\\ce{M^{3+}}$ size across the series — the actinoid analogue of the lanthanoid contraction.' },
      { label: 'Bigger than lanthanoid', text: 'The actinoid contraction is **greater, element to element**, because **$5f$ electrons shield even more poorly** than $4f$ electrons.' },
    ]),

    h.quiz([
      {
        question: 'The actinoids are the fourteen elements spanning from:',
        options: ['Th to Lr', 'La to Lu', 'Ac to No', 'Sc to Zn'],
        correct_index: 0,
        explanation: 'NCERT defines the actinoid series as the fourteen elements from thorium (Th) to lawrencium (Lr); actinium (Ac) heads the series and is included in the discussion. La–Lu is the lanthanoid span, and Sc–Zn is the first transition (d-block) series.',
      },
      {
        question: 'All the actinoid atoms share which common outer configuration, with variable occupancy of the inner levels?',
        options: ['$6s^2$', '$7s^2$', '$5d^1 6s^2$', '$4f^{14}$'],
        correct_index: 1,
        explanation: 'NCERT states the actinoids all have $7s^2$ with variable occupancy of the $5f$ and $6d$ subshells. $6s^2$ is the common pair for the lanthanoids, one principal level lower.',
      },
      {
        question: 'Compared with the $4f$ orbitals of the lanthanoids, the $5f$ orbitals of the actinoids are:',
        options: [
          'much more deeply buried, so they never take part in bonding',
          'identical in burial, giving identical chemistry',
          'not as buried, so $5f$ electrons can participate in bonding to a far greater extent',
          'completely empty in every actinoid',
        ],
        correct_index: 2,
        explanation: 'NCERT notes that although $5f$ resembles $4f$ in angular shape, the $5f$ orbitals are not as buried, so $5f$ electrons participate in bonding far more — which is why the actinoids show a wider range of oxidation states. They are certainly not empty (the $5f$ fills across the series).',
      },
      {
        question: 'The actinoid contraction is described as greater, element to element, than the lanthanoid contraction. The reason given is:',
        options: [
          'better shielding by $5f$ electrons',
          'the absence of any $f$ electrons in the actinoids',
          'poorer shielding by $5f$ electrons',
          'the inert pair effect of the $7s$ electrons',
        ],
        correct_index: 2,
        explanation: 'NCERT attributes the larger actinoid contraction to the poorer shielding by $5f$ electrons — they screen the nuclear charge even less effectively than $4f$ electrons, so the size falls off faster. Better shielding would weaken, not strengthen, the contraction.',
      },
      {
        question: 'Which statement about the actinoids is correct?',
        options: [
          'They are all non-radioactive and easy to study',
          'They show only the +3 oxidation state, like the lanthanoids',
          'Their $5f$ orbitals are more buried than the lanthanoid $4f$ orbitals',
          'They are radioactive, and the later members are obtained only in nanogram quantities',
        ],
        correct_index: 3,
        explanation: 'NCERT states the actinoids are radioactive, with the later members (down to Lr, half-life ~3 min) prepared only in nanogram quantities — which makes their study difficult. Their $5f$ orbitals are less (not more) buried, and they show a wide range of oxidation states.',
      },
      {
        question: 'Assertion (A): The size of the actinoid $\\ce{M^{3+}}$ ions decreases gradually across the series.\nReason (R): This actinoid contraction is even greater element-to-element than the lanthanoid contraction because $5f$ electrons shield the nucleus poorly.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: poor $5f$ shielding lets the rising nuclear charge pull the $\\ce{M^{3+}}$ shells in steadily — that is exactly the actinoid contraction, made larger than the lanthanoid one by the weaker $5f$ screening.',
      },
    ], 0.6),
  ],
};
