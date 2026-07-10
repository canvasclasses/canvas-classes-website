// Ch.5 (d- & f-Block) · Page 2 · Electronic Configurations of the d-Block (NCERT §8.2).
// NCERT content transcribed faithfully (Table 8.1, same configs/numbers). Enrichment in "Exam Point" callouts.
// Devices: "🔍 Decode This" (Cr/Cu anomaly as A–R) + "🏛️ Exam Vault" (verified config PYQ).
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 2,
  chapter: 5,
  slug: 'electronic-configurations',
  title: 'Electronic Configurations of the d-Block',
  subtitle: 'The general $(n-1)d^{1-10}\\,ns^{1-2}$ rule, why Chromium and Copper break it, and why the d orbitals sticking out at the edge of the atom gives every dⁿ ion its family resemblance.',
  tags: ['d-block', 'electronic-configuration', 'chromium', 'copper', 'anomaly', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: two side-by-side orbital-filling diagrams drawn as chalk boxes — one labelled "expected" showing Cr as 3d⁴ 4s² and Cu as 3d⁹ 4s², the other labelled "actual" showing Cr as 3d⁵ 4s¹ (half-filled, all boxes singly occupied) and Cu as 3d¹⁰ 4s¹ (fully filled) — with a small arrow showing one electron hopping from 4s down into 3d. A faint banner reads "half-filled and fully-filled are extra stable". To the side, a soft sketch of an atom with its outer d orbitals drawn as petals reaching out to the periphery. Landscape, desktop-friendly textbook plate.',
      '16:9',
      'Chromium and Copper steal one electron from 4s to reach the extra-stable half-filled and fully-filled d sub-shell.'
    ),

    h.heading('8.2 Electronic Configurations of the d-Block Elements', 'Write the general outer configuration of the transition elements and explain the Cr and Cu anomalies.'),
    h.text(
      'In general the electronic configuration of these elements is $(n-1)d^{1-10}\\,ns^{1-2}$. The $(n-1)$ stands for the inner $d$ orbitals which may have one to ten electrons and the outermost $ns$ orbital may have one or two electrons.'
    ),
    h.text(
      'However, this generalisation has several exceptions because of very little energy difference between $(n-1)d$ and $ns$ orbitals. Furthermore, half and completely filled sets of orbitals are relatively more stable. A consequence of this factor is reflected in the electronic configurations of Cr and Cu in the $3d$ series. Consider the case of Cr, for example, which has $3d^5 4s^1$ instead of $3d^4 4s^2$; the energy gap between the two sets ($3d$ and $4s$) of orbitals is small enough to prevent electron entering the $3d$ orbitals. Similarly in case of Cu, the configuration is $3d^{10} 4s^1$ and not $3d^9 4s^2$. The outer electronic configurations of the transition elements are given in Table 8.1.'
    ),

    h.table(
      ['', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'],
      [
        ['Z', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['4s', '2', '2', '2', '1', '2', '2', '2', '2', '1', '2'],
        ['3d', '1', '2', '3', '5', '5', '6', '7', '8', '10', '10'],
      ],
      'Table 8.1 (1st Series) — Outer electronic configurations of the 3d transition elements (ground state). Note Cr (3d⁵4s¹) and Cu (3d¹⁰4s¹).'
    ),
    h.table(
      ['', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd'],
      [
        ['Z', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
        ['5s', '2', '2', '1', '1', '1', '1', '1', '0', '1', '2'],
        ['4d', '1', '2', '4', '5', '6', '7', '8', '10', '10', '10'],
      ],
      'Table 8.1 (2nd Series) — Outer electronic configurations of the 4d transition elements (ground state).'
    ),
    h.table(
      ['', 'La', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg'],
      [
        ['Z', '57', '72', '73', '74', '75', '76', '77', '78', '79', '80'],
        ['6s', '2', '2', '2', '2', '2', '2', '2', '1', '1', '2'],
        ['5d', '1', '2', '3', '4', '5', '6', '7', '9', '10', '10'],
      ],
      'Table 8.1 (3rd Series) — Outer electronic configurations of the 5d transition elements (ground state).'
    ),
    h.table(
      ['', 'Ac', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Uub'],
      [
        ['Z', '89', '104', '105', '106', '107', '108', '109', '110', '111', '112'],
        ['7s', '2', '2', '2', '2', '2', '2', '2', '2', '1', '2'],
        ['6d', '1', '2', '3', '4', '5', '6', '7', '8', '10', '10'],
      ],
      'Table 8.1 (4th Series) — Outer electronic configurations of the 6d transition elements (ground state).'
    ),

    h.text(
      'The electronic configurations of Zn, Cd and Hg are represented by the general formula $(n-1)d^{10}\\,ns^2$. The orbitals in these elements are completely filled in the ground state as well as in their common oxidation states. Therefore, they are not regarded as transition elements.'
    ),

    h.callout('note', 'The d orbitals reach the edge of the atom (keep this NCERT line word for word)',
      '> *"The $d$ orbitals of the transition elements project to the periphery of an atom more than the other orbitals (i.e., $s$ and $p$), hence, they are more influenced by the surroundings as well as affecting the atoms or molecules surrounding them. In some respects, ions of a given $d^n$ configuration ($n = 1 – 9$) have similar magnetic and electronic properties."*\n\n' +
      'With partly filled $d$ orbitals these elements exhibit certain characteristic properties such as display of a variety of oxidation states, formation of coloured ions and entering into complex formation with a variety of ligands. The transition metals and their compounds also exhibit catalytic property and paramagnetic behaviour.'),

    h.text(
      'There are greater horizontal similarities in the properties of the transition elements in contrast to the main group elements. However, some group similarities also exist. We shall first study the general characteristics and their trends in the horizontal rows (particularly $3d$ row) and then consider some group similarities.'
    ),

    h.callout('exam_tip', 'Exam Point — the two "stolen electron" cases to memorise',
      'Only **Cr** and **Cu** in the $3d$ series break the simple rule, and both do it to reach a more stable shell:\n\n' +
      '- **Cr:** $3d^5 4s^1$ — a **half-filled** $3d$ plus half-filled $4s$ (not $3d^4 4s^2$). Cr ends up with **6** unpaired electrons.\n' +
      '- **Cu:** $3d^{10} 4s^1$ — a **fully-filled** $3d$ (not $3d^9 4s^2$).\n\n' +
      'The pull is the extra stability of half-filled ($d^5$) and fully-filled ($d^{10}$) sub-shells, made possible because the $3d$–$4s$ energy gap is tiny. A favourite trap asks for unpaired electrons: Cr has **6** (more than Mn\'s 5), precisely because of $3d^5 4s^1$.'),

    h.worked('NCERT Example 8.1', 'solved_example',
      'On what ground can you say that scandium ($Z = 21$) is a transition element but zinc ($Z = 30$) is not?',
      'On the basis of incompletely filled $3d$ orbitals in case of scandium atom in its ground state ($3d^1$), it is regarded as a transition element. On the other hand, zinc atom has completely filled $d$ orbitals ($3d^{10}$) in its ground state as well as in its oxidised state, hence it is not regarded as a transition element.'),

    h.worked('NCERT In-text Question 8.1', 'ncert_intext',
      'Silver atom has completely filled $d$ orbitals ($4d^{10}$) in its ground state. How can you say that it is a transition element?',
      'Silver ($Z = 47$, $[\\ce{Kr}]\\,4d^{10} 5s^1$) shows the $+2$ oxidation state in some of its compounds (e.g. $\\ce{AgO}$, $\\ce{AgF2}$), in which the configuration becomes $4d^9$ — an **incompletely filled $d$ sub-shell**. Since a transition element is defined as one having a partly filled $d$ sub-shell in the atom **or in any one of its oxidation states**, $\\ce{Ag}$ qualifies as a transition element through its $\\ce{Ag^{2+}}$ ($4d^9$) state.'),

    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT pairs a **fact** with its **reason**, and examiners lift that pair into an **Assertion–Reason** question:\n\n' +
      '> **NCERT (fact):** *"Cr … has $3d^5 4s^1$ instead of $3d^4 4s^2$ … Similarly in case of Cu, the configuration is $3d^{10} 4s^1$ and not $3d^9 4s^2$."*\n' +
      '> **NCERT (reason):** *"Half and completely filled sets of orbitals are relatively more stable."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** The ground-state configurations of Cr and Cu are $3d^5 4s^1$ and $3d^{10} 4s^1$.\n' +
      '- **Reason (R):** A half-filled ($d^5$) or completely-filled ($d^{10}$) $d$ sub-shell is extra stable, and the small $3d$–$4s$ energy gap allows one $4s$ electron to shift into $3d$.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** when NCERT states a fact and then a stability reason, you are looking at a ready-made A–R question — A = the configuration, R = the half/full-filled stability.'),

    h.worked('🏛️ Exam Vault · JEE Main 2024 (PYQ)', 'solved_example',
      'Arrange the following elements in the increasing order of the number of unpaired electrons in them.\n\n(A) Sc  (B) Cr  (C) V  (D) Ti  (E) Mn\n\n(1) (A) < (D) < (C) < (B) < (E)\n(2) (C) < (E) < (B) < (A) < (D)\n(3) (A) < (D) < (C) < (E) < (B)\n(4) (B) < (C) < (D) < (E) < (A)',
      '**Answer: (3) (A) < (D) < (C) < (E) < (B).** Read the unpaired-electron count straight off the ground-state configurations:\n\n- Sc $3d^1 4s^2$ → **1**\n- Ti $3d^2 4s^2$ → **2**\n- V $3d^3 4s^2$ → **3**\n- Mn $3d^5 4s^2$ → **5**\n- Cr $3d^5 4s^1$ → **6** (the anomaly!)\n\nSo the order is Sc(1) < Ti(2) < V(3) < Mn(5) < Cr(6).\n\n**Notice:** the whole question hinges on the NCERT line that Cr is $3d^5 4s^1$, not $3d^4 4s^2$ — that stolen $4s$ electron is what pushes Cr above Mn with **6** unpaired electrons.'),

    h.recap([
      { label: 'General rule', text: 'Outer configuration is $(n-1)d^{1-10}\\,ns^{1-2}$ — the inner $d$ holds 1–10 electrons, the outer $ns$ holds 1 or 2.' },
      { label: 'Why exceptions', text: 'The $(n-1)d$ and $ns$ orbitals are very **close in energy**, and half/completely-filled $d$ sub-shells are extra stable.' },
      { label: 'Cr & Cu', text: '$\\ce{Cr} = 3d^5 4s^1$ (half-filled) and $\\ce{Cu} = 3d^{10} 4s^1$ (fully-filled) — each steals one $4s$ electron. Cr ends with **6** unpaired electrons.' },
      { label: 'Zn, Cd, Hg', text: '$(n-1)d^{10}\\,ns^2$ — completely filled in the atom and in $\\ce{M^{2+}}$, so **not** transition elements.' },
      { label: 'Why they behave alike', text: 'The $d$ orbitals **project to the periphery**, so ions of a given $d^n$ ($n = 1–9$) share similar magnetic and electronic properties.' },
    ]),

    h.quiz([
      {
        question: 'The ground-state outer electronic configuration of chromium ($Z = 24$) is:',
        options: ['$3d^4 4s^2$', '$3d^5 4s^1$', '$3d^6 4s^0$', '$3d^3 4s^2 4p^1$'],
        correct_index: 1,
        explanation: 'Cr adopts $3d^5 4s^1$ — one electron shifts from $4s$ into $3d$ to give a half-filled $3d^5$ sub-shell. The "expected" $3d^4 4s^2$ is the standard trap; it ignores the extra stability of the half-filled set.',
      },
      {
        question: 'Which of the following best explains why both Cr and Cu deviate from the simple $(n-1)d^{1-10}\\,ns^{1-2}$ filling order?',
        options: [
          'The $4s$ orbital is always higher in energy than $4p$',
          'The small $3d$–$4s$ energy gap together with the extra stability of half-filled and fully-filled $d$ sub-shells',
          'The inert pair effect operating in the d-block',
          'Their $d$ orbitals lie buried deep inside the atom',
        ],
        correct_index: 1,
        explanation: 'NCERT attributes the deviation to two things: the tiny $3d$–$4s$ energy difference and the relative stability of half-filled ($d^5$, Cr) and completely-filled ($d^{10}$, Cu) sets. The inert pair effect is a p-block idea, and the d orbitals actually project outward, not inward.',
      },
      {
        question: 'How many unpaired electrons are present in a ground-state chromium atom?',
        options: ['4', '5', '6', '3'],
        correct_index: 2,
        explanation: 'With $3d^5 4s^1$, all five $3d$ electrons are unpaired and the single $4s$ electron is unpaired too, giving **6** unpaired electrons — one more than Mn ($3d^5 4s^2$, 5 unpaired). Answering "5" forgets the lone $4s$ electron.',
      },
      {
        question: 'Why do ions of a given $d^n$ configuration ($n = 1$ to $9$) show similar magnetic and electronic properties, according to NCERT?',
        options: [
          'Because the $d$ orbitals are completely shielded by the $s$ and $p$ orbitals',
          'Because the $d$ orbitals project to the periphery of the atom and are strongly influenced by their surroundings',
          'Because all such ions are diamagnetic',
          'Because they all have the same number of $4s$ electrons',
        ],
        correct_index: 1,
        explanation: 'NCERT states the $d$ orbitals project to the periphery, so they interact strongly with the surroundings; ions sharing the same $d^n$ count therefore behave alike magnetically and electronically. They are largely paramagnetic (partly filled $d$), not diamagnetic, and the $4s$ count is not the cause.',
      },
      {
        question: 'Assertion (A): Zn, Cd and Hg are placed in the d-block but are not counted as transition metals.\nReason (R): They have the configuration $(n-1)d^{10}\\,ns^2$, with completely filled $d$ orbitals in the ground state and in their common oxidation states.\nChoose the correct option:',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true but R is false',
          'A is false but R is true',
        ],
        correct_index: 0,
        explanation: 'A full $d^{10}$ shell in both the atom and the $\\ce{M^{2+}}$ ion means no partly filled $d$ sub-shell ever appears, which is exactly why these group-12 metals are excluded — so R is the correct explanation of A.',
      },
      {
        question: 'The ground-state configuration of copper ($Z = 29$) is $3d^{10} 4s^1$ rather than $3d^9 4s^2$ because:',
        options: [
          'a completely filled $3d^{10}$ sub-shell is extra stable and the $3d$–$4s$ gap is small',
          'copper always loses one electron to form $\\ce{Cu^+}$',
          'the $4s$ orbital cannot hold two electrons in period 4',
          'copper is not a transition element',
        ],
        correct_index: 0,
        explanation: 'The driving force is the stability of the fully-filled $3d^{10}$ set, reachable because the $3d$ and $4s$ levels are very close in energy. The $4s$ orbital certainly can hold two electrons (it does in most of the series), and Cu is a transition element.',
      },
    ], 0.6),
  ],
};
