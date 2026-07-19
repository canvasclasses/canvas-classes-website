// Practice — NCERT Exercises page for Live Book Ch.4 "Chemical Bonding"
// (ncert-simplified, Class 11 Chemistry) — maps to NCERT textbook Unit 4
// "Chemical Bonding and Molecular Structure", exercises 4.1–4.40.
// Standalone module. Not inserted into any database by this script.

module.exports = {
  slug: 'ch4-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 40 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'af8fc9db-422b-41a1-bc63-1c162c94f14b',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Hand-drawn illustration of ionic and covalent bonding — atoms sharing and transferring electrons, molecular shapes like tetrahedral and trigonal bipyramidal, and overlapping orbital lobes, on a dark charcoal background',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        "A hand-drawn coloured illustration on a deep charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream). Wide horizontal banner composition. On the left, a pair of atoms with electron dots transferring from one to the other (ionic bonding, an arrow of small dots moving between two circles labelled with simple '+' and '−' symbols). In the centre, two atoms sharing a pair of electron dots between them (covalent bonding), rendered as soft glowing-free ink-style dots. On the right, three small molecular-shape sketches in outline: a bent (angular) molecule, a trigonal-pyramidal molecule, and a trigonal-bipyramidal molecule, each drawn as simple ball-and-stick line figures with earthy muted colours. Faint overlapping lobe shapes (like overlapping teardrop/dumbbell orbitals) drawn subtly in the background to suggest orbital overlap, in low-contrast indigo and sage tones. No text or labels except perhaps tiny hand-lettered '+' and '−' signs. No glow, no neon, no orange haze, no 3D render look — flat hand-illustrated style throughout, clean and textbook-warm.",
    },
    {
      id: '35ff61e4-05c4-4971-8d31-d936a7d3987b',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 40 NCERT exercises for Chemical Bonding and Molecular Structure, regrouped from the textbook's running order into five revision themes: Lewis structures and the octet rule, VSEPR and molecular shapes, bond parameters/resonance/polarity, hybridisation and valence bond theory, and molecular orbital theory. Each question has a full worked solution — read it even if you got the answer right, because the reasoning is what actually shows up in exams.",
    },
    {
      id: 'b3410308-863b-474d-9e51-6a1f998c056c',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 4.1–4.40',
      intro:
        'Forty questions, five themes. Work through a section in one sitting, then check your reasoning — not just your final answer — against the solution.',
      sections: [
        // ============================================================
        // SECTION 1 — Lewis structures & the octet rule
        // ============================================================
        {
          id: '8de46c61-6f8b-4cea-ac3d-2be432b40da9',
          title: 'Lewis structures & the octet rule',
          blurb: 'Dot symbols, electron transfer, and drawing Lewis structures for molecules and ions.',
          items: [
            {
              kind: 'numerical',
              id: '73102098-e0d7-4621-8242-32ea3d6f84ec',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.1',
              prompt: 'Explain the formation of a chemical bond.',
              answer: 'Atoms bond to reach a lower-energy, more stable electronic state.',
              solution:
                "An isolated atom by itself is usually not the most stable arrangement its electrons could be in. When two atoms come close enough, their electrons and nuclei interact — and if the resulting arrangement has lower total energy than the two separate atoms, a bond forms.\n\nKössel and Lewis gave the first useful picture of this in 1916, built around one idea: atoms are most stable when their outermost (valence) shell has the electron count of the nearest noble gas — usually 8 electrons (the octet rule; 2 for H and He). Atoms achieve this in two ways.\n\n- **Transfer of electrons** — one atom gives up electrons, another accepts them, and the resulting oppositely-charged ions are held together by electrostatic attraction. This is an **ionic (electrovalent) bond**, e.g. $\\ce{Na}$ losing an electron to $\\ce{Cl}$ to form $\\ce{Na+}$ and $\\ce{Cl-}$.\n- **Sharing of electrons** — both atoms contribute electrons to a shared pair that sits between their nuclei, and both nuclei are attracted to that shared pair. This is a **covalent bond**, e.g. two $\\ce{H}$ atoms sharing a pair to form $\\ce{H2}$.\n\nIn short: a chemical bond is the net attractive force that holds two atoms together, and it forms because the bonded arrangement is lower in energy — and hence more stable — than the separate atoms.",
            },
            {
              kind: 'numerical',
              id: '78b907f8-c65b-4264-a2cc-38a2f90893f9',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.2',
              prompt: 'Write Lewis dot symbols for atoms of the following elements: Mg, Na, B, O, N, Br.',
              answer: 'Mg: 2 dots, Na: 1 dot, B: 3 dots, O: 6 dots, N: 5 dots, Br: 7 dots.',
              solution:
                "A Lewis dot symbol shows only the **valence-shell electrons** of an atom as dots placed around its symbol. So the first job is always to find the group (valence electron count):\n\n- $\\ce{Mg}$ — Group 2, 2 valence electrons → **Mg** with 2 dots (typically written as a pair, or as two single dots on different sides).\n- $\\ce{Na}$ — Group 1, 1 valence electron → **Na•** with 1 dot.\n- $\\ce{B}$ — Group 13, 3 valence electrons → **B** with 3 dots (usually shown as 3 single dots on three sides).\n- $\\ce{O}$ — Group 16, 6 valence electrons → **O** with 6 dots — drawn as two lone pairs (2 dots each) plus 2 single dots.\n- $\\ce{N}$ — Group 15, 5 valence electrons → **N** with 5 dots — one lone pair plus 3 single dots.\n- $\\ce{Br}$ — Group 17, 7 valence electrons → **Br** with 7 dots — three lone pairs plus 1 single dot.\n\nThe number of *unpaired* dots (single dots) in the symbol tells you how many bonds that atom can form by sharing — that's exactly why B forms 3 bonds, N forms 3, and Br forms 1.",
            },
            {
              kind: 'numerical',
              id: '0956a4aa-ca21-4fb1-90a0-2dbfd9d2a0e4',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.3',
              prompt: 'Write Lewis symbols for the following atoms and ions: S and S²⁻; Al and Al³⁺; H and H⁻',
              answer: 'S: 6 dots, S²⁻: 8 dots in brackets with 2−; Al: 3 dots, Al³⁺: no dots with 3+; H: 1 dot, H⁻: 2 dots in brackets with 1−.',
              solution:
                "For an ion, first work out how many electrons it actually has, then draw dots for that count — not for the neutral atom.\n\n**S and S²⁻:** Sulfur (Group 16) has 6 valence electrons, so **S** is drawn with 6 dots (2 lone pairs + 2 single dots). To become $\\ce{S^2-}$, it *gains* 2 electrons, taking the valence count to 8 — a full octet, four lone pairs. So $\\ce{S^2-}$ is written as **[S]²⁻** with 8 dots (4 pairs) inside square brackets, charge outside.\n\n**Al and Al³⁺:** Aluminium (Group 13) has 3 valence electrons, so **Al** is drawn with 3 single dots. To become $\\ce{Al^3+}$, it *loses* all 3 valence electrons, leaving zero. So $\\ce{Al^3+}$ is written as **Al³⁺** with **no dots at all**.\n\n**H and H⁻:** Hydrogen has 1 valence electron, so **H** is drawn with 1 dot. To become $\\ce{H-}$ (hydride ion), it *gains* 1 electron, giving it 2 — a filled shell (duplet, like He). So $\\ce{H-}$ is written as **[H]⁻** with a single pair of dots inside brackets.\n\nThe pattern to remember: cations lose dots (fewer than the neutral atom), anions gain dots (more than the neutral atom), and the bracket + charge notation is used whenever the species is an ion.",
            },
            {
              kind: 'numerical',
              id: 'f49e466a-f223-41c5-9501-bd4b2df1ff91',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.4',
              prompt: 'Draw the Lewis structures for the following molecules and ions: H₂S, SiCl₄, BeF₂, CO₃²⁻, HCOOH',
              answer: 'H₂S bent with 2 lone pairs on S; SiCl₄ tetrahedral, no lone pairs on Si; BeF₂ linear, incomplete octet on Be; CO₃²⁻ resonance hybrid, one C=O and two C–O⁻; HCOOH has one C=O and one C–O–H.',
              solution:
                "Work out the total valence electrons first, place the least electronegative atom (or the one that can form the most bonds) in the centre, connect with single bonds, then distribute the rest as lone pairs, checking octets (and known exceptions) at the end.\n\n**$\\ce{H2S}$:** S (6 valence e⁻) is central, bonded to 2 H atoms by single bonds. That uses 2 of S's electrons; the remaining 4 sit as 2 lone pairs on S. Structure: $\\ce{H-S-H}$ with 2 lone pairs on S. S has a full octet (2 bond pairs + 2 lone pairs = 8 electrons around it).\n\n**$\\ce{SiCl4}$:** Si (4 valence e⁻) is central, bonded to 4 Cl atoms by single bonds (uses all 4 of Si's electrons — no lone pair on Si). Each Cl (7 valence e⁻, 1 used in the bond) carries 3 lone pairs. Si has a complete octet from its 4 bond pairs.\n\n**$\\ce{BeF2}$:** Be (2 valence e⁻) is central, bonded to 2 F atoms by single bonds. This uses both of Be's electrons, leaving **no lone pair and only 4 electrons around Be** — an incomplete octet (Be is a well-known octet-rule exception). Each F carries 3 lone pairs. Structure: $\\ce{F-Be-F}$, linear.\n\n**$\\ce{CO3^2-}$:** C (4 valence e⁻) is central, bonded to 3 O atoms. Total valence electrons = $4 + 3(6) + 2 \\text{(charge)} = 24$. One C–O bond is drawn as a double bond ($\\ce{C=O}$) and the other two as single bonds, each of those two O atoms carrying a negative charge and 3 lone pairs, the double-bonded O carrying 2 lone pairs. This single structure is only one of three equivalent resonance forms (see 4.11/4.13) — the real ion is the resonance hybrid, with all three C–O bonds identical and the $2-$ charge spread over the three oxygens.\n\n**$\\ce{HCOOH}$ (formic acid):** C is central, bonded to: one H (single bond), one O by a double bond ($\\ce{C=O}$, this O has 2 lone pairs, no H), and one O by a single bond that in turn bonds to the second H ($\\ce{C-O-H}$, this O has 2 lone pairs). Structure: $\\ce{H-C(=O)-O-H}$. Every atom has a full octet (H has its duplet).",
            },
            {
              kind: 'numerical',
              id: '685e0284-b786-4198-b241-9c2d92161d0f',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.5',
              prompt: 'Define octet rule. Write its significance and limitations.',
              answer: 'Atoms tend to have 8 electrons in the valence shell; explains bond formation but fails for incomplete/expanded octets and odd-electron species.',
              solution:
                "**Definition:** Atoms combine by transferring or sharing electrons so that each atom (except H and a few others) ends up with 8 electrons in its outermost (valence) shell — the same stable electronic configuration as the nearest noble gas. This is the **octet rule**, first stated systematically by Kössel and Lewis.\n\n**Significance:**\n- It gives a simple, workable picture of *why* atoms bond at all — to reach a noble-gas-like stable configuration.\n- It correctly predicts the formulas of a huge number of ionic and covalent compounds (e.g. why $\\ce{Na}$ and $\\ce{Cl}$ combine 1:1, why $\\ce{C}$ forms 4 bonds).\n- It's the starting point for drawing Lewis structures, which in turn let you predict shape (VSEPR) and reactivity.\n\n**Limitations:**\n1. **Incomplete octet** — some central atoms are stable with fewer than 8 electrons, e.g. $\\ce{Be}$ in $\\ce{BeH2}$ (4 electrons), $\\ce{B}$ in $\\ce{BF3}$ (6 electrons), $\\ce{Al}$ in $\\ce{AlCl3}$.\n2. **Expanded octet** — elements from period 3 onward can use empty d orbitals to accommodate more than 8 electrons, e.g. $\\ce{P}$ in $\\ce{PF5}$ (10 electrons), $\\ce{S}$ in $\\ce{SF6}$ (12 electrons), $\\ce{H2SO4}$.\n3. **Odd-electron molecules** — species with an odd total number of valence electrons can never achieve a full octet on every atom, e.g. $\\ce{NO}$, $\\ce{NO2}$.\n4. **Doesn't explain relative stability** — the rule is based purely on counting electrons; it says nothing about the actual bond energies involved, so it can't rank the stability of different bonded arrangements.\n5. **Says nothing about shape** — the octet rule tells you *how many* bonds/lone pairs an atom has, but not the 3-D geometry (that needs VSEPR).\n6. **Noble gases themselves can violate it** — compounds like $\\ce{XeF2}$ and $\\ce{XeF4}$ exist and are stable even though xenon already had a full octet before bonding.",
            },
            {
              kind: 'numerical',
              id: '8d59098f-59b2-4e00-b77e-33bbe34d5139',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.6',
              prompt: 'Write the favourable factors for the formation of ionic bond.',
              answer: 'Low ionisation enthalpy of the metal, high (negative) electron gain enthalpy of the non-metal, and high lattice enthalpy.',
              solution:
                "An ionic bond forms when one atom loses electrons (becomes a cation) and another gains them (becomes an anion), and the resulting ions are held together by electrostatic attraction. Three factors decide whether this is energetically favourable:\n\n1. **Low ionisation enthalpy of the electropositive atom (metal).** Removing an electron always costs energy. If that cost is low — as it is for alkali and alkaline earth metals — the electron transfer becomes affordable.\n2. **High (i.e. strongly negative) electron gain enthalpy of the electronegative atom (non-metal).** Adding an electron to a non-metal, especially halogens and oxygen, releases a large amount of energy, which offsets the ionisation cost.\n3. **High lattice enthalpy of the resulting ionic compound.** Once the ions are formed, they arrange themselves into a crystal lattice held together by electrostatic attraction. The more energy released when this lattice forms (i.e. the higher the lattice enthalpy), the more the overall process is pulled toward completion — this is usually the single largest energy term and is what actually makes ionic compounds stable overall, even when ionisation enthalpy is unfavourable on its own.\n\nSo overall: a metal that gives up electrons easily + a non-metal that eagerly accepts them + a resulting lattice that releases a lot of energy on formation = favourable conditions for an ionic bond. This is why ionic bonding is typical between elements far apart on the electronegativity scale (a metal from the far left of the periodic table with a non-metal from the far right).",
            },
            {
              kind: 'numerical',
              id: '2b54e4fe-591a-4609-bf62-6fdf0380555d',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.14',
              prompt:
                'Use Lewis symbols to show electron transfer between the following atoms to form cations and anions: (a) K and S (b) Ca and O (c) Al and N.',
              answer: '(a) 2K + S → 2K⁺ + S²⁻ (K₂S) (b) Ca + O → Ca²⁺ + O²⁻ (CaO) (c) Al + N → Al³⁺ + N³⁻ (AlN)',
              solution:
                "For each pair, work out how many electrons the metal must lose to empty its valence shell, and how many the non-metal must gain to fill it to an octet — then balance the atom counts so total electrons lost equals total electrons gained.\n\n**(a) K and S:** K (Group 1) has 1 valence electron and loses it to form $\\ce{K+}$. S (Group 16) has 6 valence electrons and needs to gain 2 to reach 8, forming $\\ce{S^2-}$. Since one S needs 2 electrons but one K supplies only 1, you need **two** K atoms per S atom:\n$$2\\,\\ce{K}\\!\\bullet \\;+\\; \\ce{:\\!S\\!:} \\;\\longrightarrow\\; 2\\,\\ce{K+} \\;+\\; [\\ce{:\\!S\\!:}]^{2-}$$\ngiving the ionic compound $\\ce{K2S}$ (potassium sulfide).\n\n**(b) Ca and O:** Ca (Group 2) has 2 valence electrons and loses both to form $\\ce{Ca^2+}$. O (Group 16) has 6 valence electrons and gains 2 to form $\\ce{O^2-}$. The electron count matches exactly 1:1:\n$$\\ce{Ca}\\!:\\!: \\;+\\; \\ce{:\\!O\\!:} \\;\\longrightarrow\\; \\ce{Ca^2+} \\;+\\; [\\ce{:\\!O\\!:}]^{2-}$$\ngiving $\\ce{CaO}$ (calcium oxide).\n\n**(c) Al and N:** Al (Group 13) has 3 valence electrons and loses all 3 to form $\\ce{Al^3+}$. N (Group 15) has 5 valence electrons and gains 3 to reach 8, forming $\\ce{N^3-}$. Again a clean 1:1 match:\n$$\\ce{Al}\\!\\vdots \\;+\\; \\ce{:\\!N\\!:} \\;\\longrightarrow\\; \\ce{Al^3+} \\;+\\; [\\ce{:\\!N\\!:}]^{3-}$$\ngiving $\\ce{AlN}$ (aluminium nitride).",
            },
          ],
        },

        // ============================================================
        // SECTION 2 — VSEPR & molecular shapes
        // ============================================================
        {
          id: 'f47f6089-357b-47db-bb9d-6459c9e046a6',
          title: 'VSEPR & molecular shapes',
          blurb: 'Predicting geometry from electron-pair repulsion, and why lone pairs distort bond angles.',
          items: [
            {
              kind: 'numerical',
              id: '2867055f-fc75-4e21-bd9e-bac6891fe1a2',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.7',
              prompt:
                'Discuss the shape of the following molecules using the VSEPR model: BeCl₂, BCl₃, SiCl₄, AsF₅, H₂S, PH₃',
              answer: 'BeCl₂ linear, BCl₃ trigonal planar, SiCl₄ tetrahedral, AsF₅ trigonal bipyramidal, H₂S bent, PH₃ trigonal pyramidal.',
              solution:
                "VSEPR (Valence Shell Electron Pair Repulsion) says: count the electron pairs (bonding + lone) around the central atom, arrange them as far apart as possible to minimise repulsion, then read off the shape from where the *bond pairs* end up (lone pairs occupy space but aren't 'seen' in the molecular shape).\n\n**$\\ce{BeCl2}$:** Be has 2 bond pairs, 0 lone pairs → 2 electron domains arrange at 180° → **linear**, bond angle $180°$.\n\n**$\\ce{BCl3}$:** B has 3 bond pairs, 0 lone pairs → 3 domains arrange in a plane at 120° → **trigonal planar**, bond angle $120°$.\n\n**$\\ce{SiCl4}$:** Si has 4 bond pairs, 0 lone pairs → 4 domains arrange in 3-D as far apart as possible → **tetrahedral**, bond angle $109.5°$.\n\n**$\\ce{AsF5}$:** As has 5 bond pairs, 0 lone pairs (expanded octet, sp³d) → 5 domains → **trigonal bipyramidal**: 3 equatorial F atoms at $120°$ to each other, 2 axial F atoms at $90°$ to the equatorial plane, $180°$ to each other.\n\n**$\\ce{H2S}$:** S has 2 bond pairs *and* 2 lone pairs → 4 domains total arrange tetrahedrally, but the shape is described only by where the atoms are → **bent (angular)**. Because lone pairs repel more strongly than bond pairs, and because S is a larger, less electronegative atom than O (giving weaker orbital overlap and less s-character in the bonding orbitals), the H–S–H angle is compressed well below the ideal tetrahedral angle, down to about $92°$.\n\n**$\\ce{PH3}$:** P has 3 bond pairs and 1 lone pair → 4 domains arrange tetrahedrally, but with one position occupied by a lone pair → **trigonal pyramidal**. The lone pair pushes the three P–H bonds together, giving a bond angle of about $93.5°$ — again compressed from $109.5°$, though less than in $\\ce{H2S}$ because there's only one lone pair doing the pushing.",
            },
            {
              kind: 'numerical',
              id: 'c769e541-953b-408e-942a-3b2e03f637d5',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.8',
              prompt:
                'Although geometries of NH₃ and H₂O molecules are distorted tetrahedral, bond angle in water is less than that of ammonia. Discuss.',
              answer: 'H₂O has 2 lone pairs vs NH₃\'s 1, so lone-pair repulsion compresses the H–O–H angle (104.5°) more than the H–N–H angle (107°).',
              solution:
                "Both molecules start from the same base: 4 electron domains around the central atom, arranged (approximately) tetrahedrally. The difference is how many of those 4 domains are lone pairs versus bond pairs.\n\nIn $\\ce{NH3}$, nitrogen has 3 bond pairs (to the 3 H atoms) and **1 lone pair**. In $\\ce{H2O}$, oxygen has 2 bond pairs (to the 2 H atoms) and **2 lone pairs**.\n\nThe key rule from VSEPR theory is the *order of repulsion strength*:\n$$\\text{lone pair–lone pair} \\;>\\; \\text{lone pair–bond pair} \\;>\\; \\text{bond pair–bond pair}$$\nLone pairs are held closer to the central nucleus (not stretched out toward another atom the way a bond pair is), so their electron cloud is 'fatter' and pushes harder on neighbouring pairs.\n\nIn $\\ce{H2O}$, there are **two** lone pairs, both pushing hard on the two O–H bond pairs — squeezing the H–O–H angle down from the ideal $109.5°$ to about $104.5°$.\n\nIn $\\ce{NH3}$, there is only **one** lone pair pushing on the three N–H bond pairs — a smaller distorting effect, so the H–N–H angle only compresses to about $107°$.\n\nSo both molecules are 'distorted tetrahedral' for the same underlying reason (lone-pair repulsion), but water is distorted *more* because it has twice as many lone pairs doing the squeezing — which is exactly why $104.5° < 107°$.",
            },
            {
              kind: 'numerical',
              id: '9e7ec199-40a9-4350-921b-baf887f65103',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.21',
              prompt:
                'Apart from tetrahedral geometry, another possible geometry for CH₄ is square planar with the four H atoms at the corners of the square and the C atom at its centre. Explain why CH₄ is not square planar.',
              answer: 'Tetrahedral geometry keeps all H–C–H angles equal (109.5°) and all bond pairs equally spaced, minimising repulsion; square planar would force some 90° angles and unequal bonds.',
              solution:
                "VSEPR says the four bond pairs around carbon in $\\ce{CH4}$ arrange themselves to be **as far apart as possible**, because that minimises electron-pair repulsion and gives the lowest-energy, most stable geometry.\n\nIn a **tetrahedral** arrangement, all 4 C–H bonds are equivalent and every H–C–H angle is the same, $109.5°$ — the maximum possible angle you can achieve with 4 points around a central point in 3-D space. Every bond pair is equally, and maximally, separated from every other bond pair.\n\nIn a hypothetical **square planar** arrangement, the 4 H atoms sit at the corners of a square with C at the centre. Here, *adjacent* H atoms (next to each other on the square) would be only $90°$ apart, while *opposite* H atoms would be $180°$ apart. That means:\n\n- The $90°$ neighbour-pairs would repel each other far more strongly than the $109.5°$ pairs in the tetrahedral case do — raising the energy of the molecule.\n- Square planar $\\ce{CH4}$ would also have two *different kinds* of H–C–H angles ($90°$ and $180°$), meaning the four C–H bonds would not all be equivalent.\n\nExperimentally, however, all four C–H bonds in methane are found to have identical bond length and identical bond energy — they are completely equivalent. This is only consistent with a geometry where all four bond pairs experience the same repulsion from every other bond pair, which is exactly the tetrahedral arrangement. So $\\ce{CH4}$ adopts the tetrahedral (not square planar) shape because it is both lower in energy (less repulsion) and the only geometry that matches the observed equivalence of all four C–H bonds.",
            },
          ],
        },

        // ============================================================
        // SECTION 3 — Bond parameters, resonance & polarity
        // ============================================================
        {
          id: 'ba0d5371-80fd-4e9d-a1f6-d446fe6b3fb7',
          title: 'Bond parameters, resonance & polarity',
          blurb: 'Bond order and length, resonance structures, electronegativity, and dipole moment.',
          items: [
            {
              kind: 'numerical',
              id: '3a2075eb-2bdf-4d87-b565-8679e5e1c9ec',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.9',
              prompt: 'How do you express the bond strength in terms of bond order?',
              answer: 'Bond order and bond strength (bond enthalpy) are directly proportional — higher bond order means a stronger, shorter bond.',
              solution:
                "**Bond order** is the number of bonds (single/double/triple, or the ½(Nb − Na) value from molecular orbital theory) between two bonded atoms in a molecule — for example, bond order 1 for a single bond, 2 for a double bond, 3 for a triple bond.\n\nBond order is **directly proportional to bond strength (bond dissociation enthalpy)**: the higher the bond order, the more electron density is concentrated between the two nuclei, the more tightly the atoms are held together, and the more energy is required to break the bond.\n\nThis is why, going from a single to a double to a triple bond between the same pair of atoms (e.g. $\\ce{C-C}$, $\\ce{C=C}$, $\\ce{C#C}$), bond enthalpy increases in that same order — a triple bond is the strongest and hardest to break, a single bond the weakest. Bond order also correlates inversely with bond length (see 4.10) — stronger bonds are shorter bonds.",
            },
            {
              kind: 'numerical',
              id: '72f2c2e2-7972-4ec8-b9ab-3dbc63f9f289',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.10',
              prompt: 'Define the bond length.',
              answer: 'The equilibrium distance between the nuclei of two covalently bonded atoms.',
              solution:
                "**Bond length** is the equilibrium (average) distance between the centres (nuclei) of two atoms that are bonded together in a molecule.\n\nIt's not an arbitrary number — it's the distance at which the attractive forces (nucleus–electron attraction from the shared bonding pair) and the repulsive forces (nucleus–nucleus, electron–electron) between the two atoms are perfectly balanced, giving the lowest possible potential energy for that pair of atoms. Move the nuclei closer and repulsion dominates (energy rises sharply); move them apart and the bond weakens.\n\nBond lengths are measured experimentally using spectroscopic methods, X-ray diffraction (for solids), or electron diffraction techniques (for gases), and are usually expressed in picometres (pm) or angstroms (Å). As noted in 4.9, bond length is inversely related to bond order/bond strength — a $\\ce{C#C}$ triple bond ($120$ pm) is shorter than $\\ce{C=C}$ ($134$ pm), which is shorter than $\\ce{C-C}$ ($154$ pm).",
            },
            {
              kind: 'numerical',
              id: '7c010833-d166-4424-b6e0-b65c7370b7f3',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.11',
              prompt: 'Explain the important aspects of resonance with reference to the CO₃²⁻ ion.',
              answer: 'CO₃²⁻ is a hybrid of 3 canonical structures with equal, intermediate C–O bond lengths and delocalised negative charge — more stable than any single structure.',
              solution:
                "If you draw a single Lewis structure for $\\ce{CO3^2-}$, you have to put one $\\ce{C=O}$ double bond and two $\\ce{C-O}$ single bonds (with the negative charges sitting on those two singly-bonded oxygens). But that single picture has a problem: it predicts two different C–O bond lengths (a shorter double bond, two longer single bonds), whereas experiments show **all three C–O bonds in the carbonate ion are identical** — each about $128$ pm, in between a typical C–O single bond ($143$ pm) and a C=O double bond ($120$ pm).\n\nThis is resolved by **resonance**: no single Lewis structure correctly represents the real ion. Instead, you can draw **three equivalent canonical (contributing) structures**, each differing only in *which* of the three oxygens carries the double bond — the atomic positions (connectivity) are identical in all three; only the position of the double bond (i.e. the electrons) changes. The actual ion is the **resonance hybrid** — a single, real structure that is a blend of all three canonical forms, not a molecule that flips between them.\n\nThe important consequences:\n- **Equal bond lengths** — because each C–O bond has partial double-bond character (roughly ⅓ double-bond character on average across all three), all three come out identical and intermediate in length.\n- **Delocalised charge** — the overall $2-$ charge is spread (delocalised) over all three oxygens rather than sitting fully on any two specific atoms.\n- **Extra stability** — the resonance hybrid is *lower in energy* (more stable) than any single canonical structure would be on its own; this extra stabilisation is called resonance energy.",
            },
            {
              kind: 'numerical',
              id: '1e38dfa1-2b50-4ef8-8aed-d876edcffc4c',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.12',
              prompt:
                'H₃PO₃ can be represented by structures 1 and 2 shown below. Can these two structures be taken as the canonical forms of the resonance hybrid representing H₃PO₃? If not, give reasons for the same.',
              answer: 'No — the two structures differ in atomic connectivity (P–H bond present or absent), not just electron placement, so they are not resonance forms.',
              solution:
                "Since the diagram can't be reproduced here, the two structures being compared are:\n\n- **Structure 1:** phosphorus bonded to two $\\ce{-OH}$ groups, one $\\ce{P=O}$ double bond, and **one P–H bond directly to phosphorus**.\n- **Structure 2:** phosphorus bonded to **three $\\ce{-OH}$ groups** (three P–O–H linkages), with **no direct P–H bond** and no $\\ce{P=O}$.\n\n**These are NOT resonance structures of the same molecule.** The whole point of resonance is that the canonical structures differ *only* in how the electrons (double bonds / lone pairs) are arranged — the **positions of the atoms (the connectivity/skeleton) must be identical** in every canonical form. You're only allowed to move electron pairs on paper, never move an atom from one position to another.\n\nHere, structure 1 has a phosphorus atom directly bonded to a hydrogen ($\\ce{P-H}$) and a phosphorus–oxygen double bond ($\\ce{P=O}$); structure 2 has phosphorus bonded to three separate oxygens by single bonds, with no P–H bond and no P=O at all. Going from structure 1 to structure 2 requires actually **breaking a P–H bond and forming a new P–O bond** — that's a change in which atoms are connected to which, not a shift of electrons within a fixed skeleton. So structures 1 and 2 are two different molecules (constitutional isomers, differing in connectivity), not two resonance contributors to one hybrid.\n\nIn reality, the true structure of phosphorous acid ($\\ce{H3PO3}$) is structure 1 — it has one P–H bond (which does not ionise in water, which is why $\\ce{H3PO3}$ behaves as a *diprotic*, not triprotic, acid) and one P=O bond, alongside two P–O–H groups.",
            },
            {
              kind: 'numerical',
              id: '98f4571d-bfaf-4791-9647-6a9c5cea4448',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.13',
              prompt: 'Write the resonance structures for SO₃, NO₂ and NO₃⁻.',
              answer: 'SO₃: 3 equivalent structures, S=O rotating among 3 oxygens. NO₂: 2 structures with the odd electron/double bond alternating. NO₃⁻: 3 equivalent structures, like CO₃²⁻.',
              solution:
                "In each case, no single Lewis structure captures the true (experimentally equal) bond lengths, so the real species is a resonance hybrid of several equivalent canonical structures that differ only in where the double bond(s) sit.\n\n**$\\ce{SO3}$:** Sulfur is central, bonded to 3 oxygens, sp² hybridised, trigonal planar. One canonical structure has one $\\ce{S=O}$ double bond and two $\\ce{S-O}$ single bonds (each of those O atoms carrying a negative formal charge, sulfur carrying a positive formal charge to balance); there are **three equivalent such structures**, one for each choice of which oxygen gets the double bond. The real molecule is the hybrid of all three, giving three identical, shorter-than-single S–O bonds.\n\n**$\\ce{NO2}$:** Nitrogen is central, bonded to 2 oxygens, with one unpaired electron on the molecule overall (it's an odd-electron species). One canonical structure has $\\ce{N=O}$ on one side and $\\ce{N-O}$ (carrying the unpaired electron / negative charge character) on the other; the **second canonical structure** is the mirror image, with the double bond switched to the other oxygen. The real $\\ce{NO2}$ is the hybrid of these two, giving two equal N–O bonds of intermediate length, and the odd electron delocalised mainly over nitrogen and the two oxygens.\n\n**$\\ce{NO3-}$:** Nitrogen is central, bonded to 3 oxygens — structurally analogous to $\\ce{CO3^2-}$ (4.11). One canonical structure has one $\\ce{N=O}$ double bond and two $\\ce{N-O}$ single bonds (each carrying a negative charge); there are **three equivalent such structures**, one for each oxygen taking the double bond. The real nitrate ion is the hybrid of all three, giving three identical N–O bonds and the overall $1-$ charge delocalised equally over all three oxygens.",
            },
            {
              kind: 'numerical',
              id: '90fa8f67-3db0-4580-9990-240c7372603f',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.15',
              prompt:
                'Although both CO₂ and H₂O are triatomic molecules, the shape of H₂O molecule is bent while that of CO₂ is linear. Explain this on the basis of dipole moment.',
              answer: 'CO₂ is linear with two equal, opposite bond dipoles that cancel (μ = 0); H₂O is bent so its bond dipoles do not cancel (μ ≠ 0).',
              solution:
                "Both molecules have one central atom bonded to two other atoms, but the geometry — and hence what happens to the individual bond dipoles — is completely different, because it depends on whether there are lone pairs on the central atom.\n\nIn $\\ce{CO2}$, carbon is **sp hybridised with no lone pairs**, so the two $\\ce{C=O}$ bonds arrange themselves at $180°$ to minimise repulsion — the molecule is **linear** ($\\ce{O=C=O}$). Each $\\ce{C=O}$ bond is individually polar (O is more electronegative, so each bond dipole points from C toward O). But because the two bonds point in exactly opposite directions and are of equal magnitude, their **vector sum is zero** — the dipoles cancel completely. So $\\ce{CO2}$ has a **net dipole moment of zero**, even though its individual bonds are polar.\n\nIn $\\ce{H2O}$, oxygen is **sp³ hybridised with 2 lone pairs**, which push the two O–H bonds together into a **bent (angular)** shape with a bond angle of about $104.5°$ (see 4.8) — not $180°$. Each O–H bond dipole points from H toward O (O is more electronegative). Because the bond angle is far from $180°$, the two bond dipoles do **not** cancel; their vector sum gives a net resultant dipole moment pointing from between the two H atoms toward the oxygen. So $\\ce{H2O}$ has a **non-zero dipole moment** (measured as $1.84$ D).\n\nSo the underlying cause is the same VSEPR logic as 4.7/4.8 — lone pairs (or their absence) determine the shape, and the shape determines whether individual bond dipoles reinforce or cancel each other.",
            },
            {
              kind: 'numerical',
              id: 'c8d313c2-148c-48aa-b280-5a1a40f1d711',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.16',
              prompt: 'Write the significance/applications of dipole moment.',
              answer: 'Predicts molecular polarity, helps determine shape/geometry, estimates percentage ionic character, and distinguishes structural isomers.',
              solution:
                "Dipole moment (μ) is a measurable quantity, and its value tells you several useful things about a molecule:\n\n1. **Predicting polarity.** A non-zero dipole moment means the molecule is polar overall; a zero dipole moment means it is non-polar (even if individual bonds within it are polar, as in $\\ce{CO2}$ or $\\ce{BF3}$).\n2. **Determining molecular shape/geometry.** Since the net dipole moment depends on how individual bond dipoles add up vectorially, measuring it experimentally helps confirm or rule out a proposed geometry — e.g. a zero dipole moment for a triatomic AB₂ molecule strongly supports a linear (not bent) shape.\n3. **Estimating percentage ionic character of a bond.** By comparing the experimentally measured dipole moment of a molecule to the theoretical dipole moment expected for a *purely* ionic bond of the same bond length, chemists calculate what fraction of the bond's character is ionic versus covalent.\n4. **Distinguishing between isomers.** Molecules with the same formula but different structures (e.g. cis- and trans- isomers, or ortho-, meta-, and para- disubstituted benzenes) often have noticeably different dipole moments, which helps identify which isomer is which experimentally.",
            },
            {
              kind: 'numerical',
              id: '016620fb-a92e-4002-b8b5-117f07dc96f0',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.17',
              prompt: 'Define electronegativity. How does it differ from electron gain enthalpy?',
              answer: 'Electronegativity is a relative tendency of a bonded atom to attract shared electrons (no fixed units); electron gain enthalpy is a measurable energy change for an isolated gaseous atom (kJ/mol).',
              solution:
                "**Electronegativity** is the tendency (or relative ability) of an atom, **while it is part of a molecule (bonded to another atom)**, to attract the shared pair of electrons of a covalent bond toward itself.\n\nElectron gain enthalpy (§ from earlier chapters) is the energy change when an electron is added to an **isolated gaseous atom** to form a gaseous anion — it applies to a *free* atom, not one that's already bonded.\n\nThe key differences:\n\n| | Electronegativity | Electron gain enthalpy |\n|---|---|---|\n| Applies to | An atom *within* a bond/molecule | An isolated, free gaseous atom |\n| Nature | A relative, comparative property (no absolute physical measurement) | A measurable thermodynamic quantity |\n| Units | No fixed units — expressed on relative scales (e.g. Pauling scale) | Has definite units, $\\text{kJ mol}^{-1}$ |\n| What it tells you | How strongly the atom pulls a *shared* electron pair toward itself in a bond | How much energy is released/absorbed when a *free* atom gains one extra electron |\n\nIn short: electron gain enthalpy is a property of an atom on its own, that you could in principle measure directly; electronegativity is a property that only makes sense for an atom already engaged in a bond, and is inferred/scaled rather than measured directly.",
            },
            {
              kind: 'numerical',
              id: '9a38abbe-0796-464f-8c58-8cc4b3dd3d9a',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.18',
              prompt: 'Explain with the help of suitable example polar covalent bond.',
              answer: 'HCl: Cl is more electronegative than H, so the shared electron pair sits closer to Cl, giving Cl a partial negative and H a partial positive charge.',
              solution:
                "A **polar covalent bond** forms when two atoms share an electron pair (so it's still a covalent bond, not ionic), but the two atoms have *different* electronegativities, so the shared pair is not shared equally — it sits closer to the more electronegative atom.\n\n**Example: $\\ce{HCl}$.** Hydrogen and chlorine share one electron pair to form the covalent H–Cl bond. But chlorine (electronegativity $\\approx 3.16$) is considerably more electronegative than hydrogen ($\\approx 2.20$). So the bonding electron pair is pulled more toward the chlorine atom.\n\nThis unequal sharing means:\n- Chlorine ends up with a slightly greater share of electron density, giving it a **partial negative charge**, written $\\delta^-$.\n- Hydrogen, having 'lost' some of its share of the electron pair, ends up with a **partial positive charge**, written $\\delta^+$.\n\nSo the bond is written $\\overset{\\delta^+}{\\ce{H}} - \\overset{\\delta^-}{\\ce{Cl}}$. This charge separation is exactly what gives the molecule a measurable dipole moment (HCl's is about $1.03$ D) — polar covalent bonds are, physically, bonds with partial ionic character sitting somewhere between a perfectly equal non-polar covalent bond (like $\\ce{H2}$, $\\ce{Cl2}$, where both atoms are identical) and a fully ionic bond (complete electron transfer).",
            },
            {
              kind: 'numerical',
              id: 'b9857f64-4371-44cd-b0b1-ba9ec4b3f9e9',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.19',
              prompt: 'Arrange the bonds in order of increasing ionic character in the molecules: LiF, K₂O, N₂, SO₂ and ClF₃.',
              answer: 'N₂ < ClF₃ < SO₂ < K₂O < LiF',
              solution:
                "The percentage ionic character of a bond increases with the **difference in electronegativity** between the two bonded atoms — a bigger gap means more unequal sharing, tending toward full electron transfer (ionic character). $\\ce{N2}$ is the special case of a bond between identical atoms, which is purely covalent with zero ionic character.\n\nUsing approximate Pauling electronegativities — $\\ce{N} = 3.04$, $\\ce{F} = 3.98$, $\\ce{Cl} = 3.16$, $\\ce{S} = 2.58$, $\\ce{O} = 3.44$, $\\ce{K} = 0.82$, $\\ce{Li} = 0.98$ — compute the difference (ΔEN) for the bond in each:\n\n| Bond | ΔEN |\n|---|---|\n| $\\ce{N#N}$ (in $\\ce{N2}$) | $0$ (identical atoms) |\n| $\\ce{Cl-F}$ (in $\\ce{ClF3}$) | $\\approx 0.82$ |\n| $\\ce{S-O}$ (in $\\ce{SO2}$) | $\\approx 0.86$ |\n| $\\ce{K-O}$ (in $\\ce{K2O}$) | $\\approx 2.62$ |\n| $\\ce{Li-F}$ (in $\\ce{LiF}$) | $\\approx 3.00$ |\n\nOrdering these from smallest to largest ΔEN gives the order of **increasing ionic character**:\n$$\\ce{N2} \\;<\\; \\ce{ClF3} \\;<\\; \\ce{SO2} \\;<\\; \\ce{K2O} \\;<\\; \\ce{LiF}$$\n$\\ce{N2}$ sits at zero because it's a bond between two identical atoms (purely covalent, no polarity at all). $\\ce{LiF}$ sits at the top because lithium (a small, electropositive alkali metal) and fluorine (the most electronegative element) have the largest electronegativity gap on this list, making $\\ce{LiF}$ the most ionic bond of the five.",
            },
            {
              kind: 'numerical',
              id: '62299452-ec39-454d-8154-72d266aac641',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.20',
              prompt: 'The skeletal structure of CH₃COOH as shown below is correct, but some of the bonds are shown incorrectly. Write the correct Lewis structure for acetic acid.',
              answer: 'CH₃–C(=O)–O–H — carbonyl C=O double bond on one oxygen, and a separate single-bonded O–H on the other.',
              solution:
                "Since the flawed diagram can't be reproduced here: the given skeletal sketch showed a hydrogen bonded *directly* to the carbonyl oxygen by what should have been the C=O double bond, rather than the carbonyl oxygen being purely double-bonded to carbon and the second oxygen carrying the O–H hydrogen. That's the bonding error to fix.\n\n**The correct Lewis structure for acetic acid ($\\ce{CH3COOH}$):**\n\n$$\\ce{H3C - C(=O) - O - H}$$\n\nWorked out atom by atom:\n- The **methyl carbon** is bonded to 3 hydrogens (single bonds) and to the carbonyl carbon (single bond) — 4 single bonds total, full octet, sp³.\n- The **carbonyl carbon** is bonded to: the methyl carbon (single bond), one oxygen by a **double bond** ($\\ce{C=O}$ — this oxygen carries 2 lone pairs and **no hydrogen** attached to it), and the second oxygen by a **single bond**. That's 4 bonds total (counting the double bond as 2), full octet, sp².\n- The **second oxygen** ($\\ce{-O-}$) is singly bonded to the carbonyl carbon on one side and to a hydrogen atom on the other side ($\\ce{O-H}$), carrying 2 lone pairs.\n\nSo the fix is: the carbonyl oxygen must have a double bond to carbon and **no hydrogen attached to it at all**; the hydroxyl hydrogen belongs only on the *other* oxygen, attached by a single O–H bond. Every atom then has a complete octet (H has its duplet), consistent with the real, experimentally confirmed structure of acetic acid.",
            },
            {
              kind: 'numerical',
              id: 'b1b03b25-f11b-4ca8-935c-8b27b1bce829',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.22',
              prompt: 'Explain why BeH₂ molecule has a zero dipole moment although the Be–H bonds are polar.',
              answer: 'BeH₂ is linear with no lone pairs on Be, so the two equal, oppositely-directed Be–H bond dipoles cancel exactly.',
              solution:
                "Each individual $\\ce{Be-H}$ bond in $\\ce{BeH2}$ **is** polar — hydrogen ($\\text{EN} \\approx 2.20$) is more electronegative than beryllium ($\\text{EN} \\approx 1.57$), so each bond dipole points from Be toward H, giving each bond a small but real dipole moment.\n\nBut the **molecular** (net) dipole moment depends on how these individual bond dipoles add up as vectors, and that depends entirely on the molecule's shape.\n\nBeryllium in $\\ce{BeH2}$ is **sp hybridised with no lone pairs** — 2 bond pairs, 0 lone pairs, so VSEPR gives a perfectly **linear** geometry, $\\ce{H-Be-H}$ with a bond angle of exactly $180°$.\n\nBecause the molecule is perfectly linear and both Be–H bonds are identical in magnitude, the two bond dipole vectors point in **exactly opposite directions** with **exactly equal magnitude**. Two equal vectors pointing in opposite directions add up to zero. So even though every individual bond is polar, the molecule as a whole has **zero net dipole moment** — the bond dipoles cancel each other out perfectly due to the symmetric, linear shape. (This is the same reasoning as $\\ce{CO2}$ in question 4.15.)",
            },
            {
              kind: 'numerical',
              id: '58fafc8b-32c2-4c73-9649-4f8ddb557687',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.23',
              prompt: 'Which out of NH₃ and NF₃ has higher dipole moment and why?',
              answer: 'NH₃ has a higher dipole moment than NF₃ because the lone pair dipole adds to the bond-dipole resultant in NH₃, but opposes it in NF₃.',
              solution:
                "$\\ce{NH3}$ has the higher dipole moment ($1.47$ D) compared to $\\ce{NF3}$ (only $0.24$ D) — and the reason is not just about bond polarity, it's about the **direction** the lone pair's contribution points relative to the bond dipoles.\n\nBoth molecules are pyramidal with a lone pair on nitrogen (3 bond pairs + 1 lone pair, sp³ N), so structurally they look similar. The difference is in electronegativity:\n\n**In $\\ce{NH3}$:** nitrogen ($\\text{EN} \\approx 3.04$) is *more* electronegative than hydrogen ($\\approx 2.20$), so each N–H bond dipole points **from H toward N**. The lone pair on nitrogen also contributes its own dipole, pointing away from the three N–H bonds — i.e., in roughly the *same general direction* as the resultant of the three bond dipoles. The bond-dipole resultant and the lone-pair dipole **reinforce (add to)** each other, giving a relatively large net dipole moment.\n\n**In $\\ce{NF3}$:** fluorine ($\\approx 3.98$) is *more* electronegative than nitrogen, so each N–F bond dipole points **from N toward F** — the opposite direction relative to nitrogen compared to the N–H case. The lone pair's dipole still points away from the three bonds (in the same direction as before, away from the F atoms). Now the lone-pair dipole and the bond-dipole resultant point in **roughly opposite directions**, so they **partly cancel** each other, giving a much smaller net dipole moment.\n\nSo the difference comes down to whether the bond dipoles point toward or away from nitrogen — that flips whether the lone pair's contribution adds to or subtracts from the overall molecular dipole moment.",
            },
          ],
        },

        // ============================================================
        // SECTION 4 — Hybridisation & valence bond theory
        // ============================================================
        {
          id: '789839ea-d819-41dd-84e4-5f38364729b7',
          title: 'Hybridisation & valence bond theory',
          blurb: 'sp/sp²/sp³ orbitals, sigma vs pi bonds, and how VBT explains bond formation.',
          items: [
            {
              kind: 'numerical',
              id: 'ce5369db-01db-4765-8272-46ace7240b01',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.24',
              prompt: 'What is meant by hybridisation of atomic orbitals? Describe the shapes of sp, sp², sp³ hybrid orbitals.',
              answer: 'Hybridisation is the intermixing of atomic orbitals of similar energy to form new equivalent hybrid orbitals: sp is linear (180°), sp² trigonal planar (120°), sp³ tetrahedral (109.5°).',
              solution:
                "**Hybridisation** is the process of intermixing (mathematically combining) atomic orbitals of slightly different energies, belonging to the same atom, to produce a new set of orbitals of **equivalent energy and identical shape**, called hybrid orbitals. These hybrid orbitals are better suited for forming stronger, more directional bonds than the original unmixed s and p orbitals.\n\n**sp hybridisation:** one $s$ orbital mixes with one $p$ orbital $\\to$ **2** sp hybrid orbitals. These point in exactly opposite directions, giving a **linear** arrangement, bond angle $180°$. Each sp orbital has $50\\%$ s-character and $50\\%$ p-character. Example: Be in $\\ce{BeCl2}$.\n\n**sp² hybridisation:** one $s$ orbital mixes with two $p$ orbitals $\\to$ **3** sp² hybrid orbitals, all lying in one plane, pointing to the corners of an equilateral triangle — **trigonal planar**, bond angle $120°$. Each sp² orbital has $33.3\\%$ s-character. Example: B in $\\ce{BCl3}$.\n\n**sp³ hybridisation:** one $s$ orbital mixes with three $p$ orbitals $\\to$ **4** sp³ hybrid orbitals, pointing toward the four corners of a regular tetrahedron — **tetrahedral**, bond angle $109.5°$. Each sp³ orbital has $25\\%$ s-character. Example: C in $\\ce{CH4}$.\n\nThe general pattern: more p-character mixed in $\\to$ more hybrid orbitals $\\to$ a wider spatial spread $\\to$ smaller ideal bond angle (from $180°$ for sp, down to $120°$ for sp², down to $109.5°$ for sp³).",
            },
            {
              kind: 'numerical',
              id: 'bc4c5bde-d4c1-4ef1-b3a4-fc248a430546',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.25',
              prompt: 'Describe the change in hybridisation (if any) of the Al atom in the following reaction. AlCl₃ + Cl⁻ → AlCl₄⁻',
              answer: 'Al changes from sp² (in AlCl₃) to sp³ (in AlCl₄⁻).',
              solution:
                "In $\\ce{AlCl3}$, aluminium has 3 bond pairs (to the 3 Cl atoms) and no lone pair — Al is **sp² hybridised**, giving a trigonal planar shape. Because Al only has 6 electrons around it here (an incomplete octet, an octet-rule exception), it still has one **empty p orbital** available.\n\nWhen a chloride ion ($\\ce{Cl-}$) approaches, it donates a lone pair of electrons into that empty orbital on aluminium, forming a new coordinate (dative) covalent bond: $\\ce{AlCl3 + Cl- -> AlCl4-}$.\n\nAluminium now has **4 bond pairs** around it (one of which is a coordinate bond) and no lone pair. To accommodate 4 equivalent bonding orbitals arranged as far apart as possible, aluminium's hybridisation **changes from sp² to sp³**, and the shape changes from trigonal planar ($\\ce{AlCl3}$) to **tetrahedral** ($\\ce{AlCl4-}$).",
            },
            {
              kind: 'numerical',
              id: 'e59013b6-a22d-48e4-b879-2922da0eab19',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.26',
              prompt: 'Is there any change in the hybridisation of B and N atoms as a result of the following reaction? BF₃ + NH₃ → F₃B.NH₃',
              answer: 'Boron changes from sp² to sp³; nitrogen stays sp³ (unchanged).',
              solution:
                "**Before the reaction:**\n- In $\\ce{BF3}$, boron has 3 bond pairs and no lone pair — **sp² hybridised**, trigonal planar, with one empty p orbital (electron deficient, incomplete octet).\n- In $\\ce{NH3}$, nitrogen has 3 bond pairs and 1 lone pair — **sp³ hybridised**, pyramidal.\n\n**The reaction:** the lone pair on nitrogen (in $\\ce{NH3}$) is donated into the empty p orbital on boron (in $\\ce{BF3}$), forming a coordinate (dative) covalent bond and producing the adduct $\\ce{F3B <- NH3}$.\n\n**After the reaction:**\n- **Boron** now has 4 bond pairs around it (3 original B–F bonds plus the new coordinate bond from N) and no lone pair. To hold 4 equivalent-energy bonding orbitals, boron's hybridisation **changes from sp² to sp³** — its geometry changes from trigonal planar to (roughly) tetrahedral.\n- **Nitrogen** still has 4 electron pairs around it in total — it's just that one of them, which used to be a *lone* pair, is now a *shared (bond)* pair used in the new N→B bond. The total number and arrangement of electron domains on nitrogen hasn't changed, so nitrogen's hybridisation **remains sp³ — unchanged**.\n\nSo only boron's hybridisation changes (sp² → sp³); nitrogen's does not.",
            },
            {
              kind: 'numerical',
              id: '492d45a3-9ec8-4ffd-94a3-a3c0bfcc11ce',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.27',
              prompt: 'Draw diagrams showing the formation of a double bond and a triple bond between carbon atoms in C₂H₄ and C₂H₂ molecules.',
              answer: 'C₂H₄: each C is sp² with 1 sigma + 1 pi C–C bond. C₂H₂: each C is sp with 1 sigma + 2 pi C–C bonds.',
              solution:
                "These bonds are best understood as a diagram, so here's the formation described precisely in words, orbital by orbital.\n\n**$\\ce{C2H4}$ (ethylene, double bond):** each carbon atom is **sp² hybridised** — it has 3 sp² hybrid orbitals lying in one plane at $120°$ to each other, plus one leftover, unhybridised $p$ orbital standing perpendicular to that plane. Each carbon uses two of its sp² orbitals to form C–H sigma bonds (by head-on overlap with hydrogen's 1s orbital) and the third sp² orbital to form a C–C **sigma bond** (head-on overlap with the other carbon's sp² orbital) — that accounts for the 4 sigma bonds in the molecule (2 C–H per carbon, 1 shared C–C). The two leftover unhybridised $p$ orbitals — one on each carbon, both perpendicular to the molecular plane and parallel to each other — overlap **sideways** (laterally, above and below the plane) to form one **pi bond**. So the C=C double bond in ethylene is **1 sigma + 1 pi bond**, and the whole molecule (including the H atoms) is planar because sp² hybridisation is planar.\n\n**$\\ce{C2H2}$ (acetylene, triple bond):** each carbon atom is **sp hybridised** — it has 2 sp hybrid orbitals pointing in opposite directions ($180°$ apart, linear), plus **two** leftover unhybridised $p$ orbitals (the $p_y$ and $p_z$ orbitals), mutually perpendicular to each other and both perpendicular to the C–C axis. Each carbon uses one sp orbital to form a C–H sigma bond and the other sp orbital to form the C–C **sigma bond**. The two pairs of unhybridised p orbitals — $p_y$ on each carbon overlapping sideways with each other, and separately $p_z$ on each carbon overlapping sideways with each other — form **two mutually perpendicular pi bonds**. So the C≡C triple bond in acetylene is **1 sigma + 2 pi bonds**, and the whole molecule is linear.",
            },
            {
              kind: 'numerical',
              id: 'c5f9fe89-aef1-4f95-bc74-38410e25f52d',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.28',
              prompt: 'What is the total number of sigma and pi bonds in the following molecules? (a) C₂H₂ (b) C₂H₄',
              answer: '(a) C₂H₂: 3 sigma, 2 pi (b) C₂H₄: 5 sigma, 1 pi',
              solution:
                "Count each C–H bond as one sigma bond, and split every C–C multiple bond into 1 sigma + (n−1) pi bonds, where n is the bond order.\n\n**(a) $\\ce{C2H2}$ (acetylene, $\\ce{H-C#C-H}$):**\n- 2 C–H bonds $\\to$ 2 sigma bonds\n- 1 C≡C triple bond $\\to$ 1 sigma + 2 pi bonds\n\n**Total: 3 sigma bonds ($2 + 1$), 2 pi bonds.**\n\n**(b) $\\ce{C2H4}$ (ethylene, $\\ce{H2C=CH2}$):**\n- 4 C–H bonds $\\to$ 4 sigma bonds\n- 1 C=C double bond $\\to$ 1 sigma + 1 pi bond\n\n**Total: 5 sigma bonds ($4 + 1$), 1 pi bond.**\n\nGeneral rule to remember: every single bond is 1 sigma; every double bond is 1 sigma + 1 pi; every triple bond is 1 sigma + 2 pi. A multiple bond never has more than one sigma bond between the same two atoms — the sigma bond forms first (head-on overlap), and any additional bonds beyond that are always pi bonds (sideways overlap).",
            },
            {
              kind: 'numerical',
              id: 'b849b89d-6a71-4eeb-b864-96845e4dd1e0',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.29',
              prompt:
                'Considering x-axis as the internuclear axis which out of the following will not form a sigma bond and why? (a) 1s and 1s (b) 1s and 2px (c) 2py and 2py (d) 1s and 2s.',
              answer: '(c) 2py and 2py will not form a sigma bond — they overlap sideways (perpendicular to the x-axis), forming a pi bond instead.',
              solution:
                "A sigma bond requires **head-on (end-to-end) overlap** of orbitals along the internuclear axis — the orbital lobes must point directly at each other along that axis (here, the x-axis).\n\n**(a) 1s and 1s:** both are spherically symmetric, so they overlap head-on along the x-axis regardless of orientation $\\to$ **forms a sigma bond.**\n\n**(b) 1s and 2$p_x$:** the $2p_x$ orbital's lobes point exactly along the x-axis (the internuclear axis), so it overlaps head-on with the spherical 1s orbital $\\to$ **forms a sigma bond.**\n\n**(c) 2$p_y$ and 2$p_y$:** the $2p_y$ orbital's lobes point along the **y-axis**, which is perpendicular to the internuclear (x) axis. Two $p_y$ orbitals on atoms separated along x can only approach and overlap **sideways** (their lobes lying parallel to each other, above/below the axis) — this is a lateral overlap, which produces a **pi bond, not a sigma bond**. So **this is the one that will NOT form a sigma bond.**\n\n**(d) 1s and 2s:** both orbitals are spherically symmetric (no directional preference), so they overlap head-on along the x-axis just like case (a) $\\to$ **forms a sigma bond.**\n\n**Answer: (c) 2$p_y$ and 2$p_y$** — because $p_y$ orbitals are oriented perpendicular to the internuclear axis, their only possible overlap is a sideways (lateral) one, which by definition gives a pi bond rather than a sigma bond.",
            },
            {
              kind: 'numerical',
              id: '043253ac-bf77-4af8-b5d8-554bbc68ee42',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.30',
              prompt: 'Which hybrid orbitals are used by carbon atoms in the following molecules? CH₃–CH₃; (b) CH₃-CH=CH₂; (c) CH₃-CH₂-OH; (d) CH₃-CHO (e) CH₃COOH',
              answer: '(a) both sp³ (b) sp³ + sp²/sp² (c) both sp³ (d) sp³ + sp² (e) sp³ + sp²',
              solution:
                "The rule: a carbon with **only single bonds** to everything around it is **sp³**; a carbon involved in **one double bond** (to C or to O) is **sp²**; a carbon involved in a **triple bond** would be sp (not needed here).\n\n**(a) $\\ce{CH3-CH3}$ (ethane):** every bond, on both carbons, is a single bond. **Both carbons are sp³.**\n\n**(b) $\\ce{CH3-CH=CH2}$ (propene):** the $\\ce{CH3}$ carbon has only single bonds $\\to$ **sp³**. The middle $\\ce{-CH=}$ carbon and the terminal $\\ce{=CH2}$ carbon are joined by a C=C double bond $\\to$ **both sp²**.\n\n**(c) $\\ce{CH3-CH2-OH}$ (ethanol):** both carbons have only single bonds (to H, to each other, and the second carbon to O). **Both carbons are sp³.**\n\n**(d) $\\ce{CH3-CHO}$ (acetaldehyde):** the $\\ce{CH3}$ carbon has only single bonds $\\to$ **sp³**. The $\\ce{-CHO}$ carbon has a $\\ce{C=O}$ double bond (the carbonyl) $\\to$ **sp²**.\n\n**(e) $\\ce{CH3COOH}$ (acetic acid):** the $\\ce{CH3}$ carbon has only single bonds $\\to$ **sp³**. The $\\ce{-COOH}$ carbon has a $\\ce{C=O}$ double bond (the carbonyl of the carboxylic acid group) $\\to$ **sp²**.\n\nPattern to take away: any carbon carrying a $\\ce{C=O}$ or $\\ce{C=C}$ is sp², regardless of what else is attached to it — you only need to check that one carbon's immediate bonding, not the whole molecule.",
            },
            {
              kind: 'numerical',
              id: 'eb559a66-8e9c-4352-826a-b35551cb9569',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.31',
              prompt: 'What do you understand by bond pairs and lone pairs of electrons? Illustrate by giving one example of each type.',
              answer: 'Bond pairs are shared electron pairs between two bonded atoms; lone pairs are unshared valence pairs localised on one atom.',
              solution:
                "**Bond pair:** a pair of electrons that is **shared between two bonded atoms**, occupying the region of space between their two nuclei, and holding the atoms together in a covalent bond.\n\n*Example:* in $\\ce{H2O}$, each of the two O–H bonds contains one bond pair — the molecule has **2 bond pairs** in total, one for each O–H bond.\n\n**Lone pair:** a pair of valence electrons that belongs to (and stays localised on) just **one** atom, and is **not involved in bonding** with any other atom.\n\n*Example:* in $\\ce{H2O}$, oxygen has 6 valence electrons; 2 of them are used in the 2 O–H bond pairs, leaving 4 electrons — that's **2 lone pairs** sitting on the oxygen atom, not shared with either hydrogen.\n\nSo a single molecule like $\\ce{H2O}$ conveniently illustrates both at once: 2 bond pairs (in the O–H bonds) and 2 lone pairs (on oxygen) — and, as covered in question 4.8, it's precisely the presence of those lone pairs (and how many of them there are) that determines the molecular shape and bond angle.",
            },
            {
              kind: 'numerical',
              id: '4073f369-6b0a-459c-9260-926268bfa7e8',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.32',
              prompt: 'Distinguish between a sigma and a pi bond.',
              answer: 'Sigma: head-on overlap along the internuclear axis, stronger, allows free rotation. Pi: sideways overlap, weaker, restricts rotation, only occurs alongside a sigma bond.',
              solution:
                "| | Sigma (σ) bond | Pi (π) bond |\n|---|---|---|\n| **Overlap type** | Head-on / end-to-end overlap, directly along the internuclear axis | Sideways / lateral overlap, of orbitals lying parallel to each other |\n| **Electron density** | Concentrated symmetrically *on* the line joining the two nuclei | Concentrated in two lobes, above and below (or in front of and behind) the internuclear axis, with a nodal plane containing the axis |\n| **Strength** | Stronger, because the extent of orbital overlap is greater | Weaker, because sideways overlap is less extensive than head-on overlap |\n| **Rotation** | Allows free rotation of the two bonded atoms about the bond axis, since the overlap is symmetric about that axis | Restricts (prevents) free rotation, because rotating would break the sideways overlap between the p orbitals |\n| **When formed** | Always forms first between any two directly bonded atoms — every single, double, and triple bond contains exactly one sigma bond | Only forms *in addition to* an existing sigma bond, i.e. only in double bonds (1 pi) and triple bonds (2 pi); never occurs alone |\n\nIn short: every bond between two atoms starts with one sigma bond; any 'extra' bonds on top of that (in double or triple bonds) are pi bonds, which are weaker and lock the molecule's geometry around that bond in place.",
            },
            {
              kind: 'numerical',
              id: '747861ba-a3e8-450a-bbde-a4d01c898ce2',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.33',
              prompt: 'Explain the formation of H₂ molecule on the basis of valence bond theory.',
              answer: 'Two H atoms with opposite-spin unpaired electrons approach; attractive forces dominate until an equilibrium distance (74 pm) is reached, where their 1s orbitals overlap and the electrons pair up, forming a sigma bond; bond enthalpy released = 435.8 kJ/mol.',
              solution:
                "Each isolated hydrogen atom has one electron in its $1s$ orbital. Valence bond theory (Heitler and London) explains what happens when two such atoms — call them $\\ce{H_A}$ and $\\ce{H_B}$ — approach each other.\n\nAs the two atoms get closer, two kinds of forces come into play simultaneously:\n- **Attractive forces:** the nucleus of $\\ce{H_A}$ attracts the electron of $\\ce{H_B}$, and the nucleus of $\\ce{H_B}$ attracts the electron of $\\ce{H_A}$.\n- **Repulsive forces:** the two nuclei repel each other, and the two electrons repel each other.\n\nAt large separations, these forces are negligible. As the atoms approach, the *attractive* forces initially dominate, and the potential energy of the system steadily **decreases** (becomes more negative/stable) as the atoms get closer.\n\nThis continues until the system reaches a particular internuclear distance where the potential energy hits a **minimum** — this is the **equilibrium bond length** of $\\ce{H2}$, experimentally $74$ pm. At this distance, the two $1s$ orbitals overlap, and the two electrons — provided they have **opposite spins** (required by the Pauli exclusion principle for them to occupy the same region of space) — become paired and are now shared between both nuclei, forming a covalent **sigma bond**. This is exactly the overlap described as 'head-on' in question 4.32.\n\nIf the atoms are pushed even closer than $74$ pm, repulsive forces (nucleus–nucleus and electron–electron) start to dominate, and the potential energy rises sharply — which is why $74$ pm is a stable equilibrium, not just any close distance.\n\nThe amount of energy released when the bond forms (equal to the depth of that potential energy minimum) is the bond dissociation enthalpy of $\\ce{H2}$, $435.8\\ \\text{kJ mol}^{-1}$ — which is also exactly the energy that must be supplied to pull the two atoms back apart and break the bond.",
            },
            {
              kind: 'numerical',
              id: 'f1667bd8-bc83-4e44-ba20-be062ac42a59',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.38',
              prompt: 'Describe the hybridisation in case of PCl₅. Why are the axial bonds longer as compared to equatorial bonds?',
              answer: 'P is sp³d hybridised, trigonal bipyramidal; axial bonds are longer because axial bond pairs face more 90° repulsions than equatorial bond pairs.',
              solution:
                "**Hybridisation:** phosphorus in its ground state has the configuration $3s^2\\,3p^3$ — 3 unpaired electrons. To form 5 bonds in $\\ce{PCl5}$, one of the paired $3s$ electrons is promoted into an empty $3d$ orbital, giving an excited-state configuration $3s^1\\,3p^3\\,3d^1$ — now **5 unpaired electrons**. These five orbitals (one $s$, three $p$, one $d$) intermix to form **5 sp³d hybrid orbitals**, each overlapping with a $3p$ orbital of a chlorine atom to form 5 $\\ce{P-Cl}$ sigma bonds. This gives the **trigonal bipyramidal** geometry: 3 chlorine atoms in an **equatorial** plane, $120°$ apart from each other, and 2 chlorine atoms in **axial** positions, one above and one below the equatorial plane, each at $90°$ to the equatorial bonds and $180°$ to each other.\n\n**Why axial bonds are longer:** the two geometrically distinct positions experience different amounts of repulsion.\n- An **axial** bond pair sits at $90°$ to *all three* equatorial bond pairs — that's **three** close-range ($90°$) repulsive interactions pressing on it.\n- An **equatorial** bond pair sits at $90°$ to only the *two* axial bond pairs, and at a wider, weaker $120°$ to the other two equatorial bond pairs — that's only **two** strong ($90°$) repulsive interactions.\n\nSince $90°$ interactions are much stronger repulsions than $120°$ ones, axial bond pairs experience **more total repulsion** than equatorial bond pairs. This extra repulsion pushes the axial chlorine atoms slightly farther away from phosphorus to relieve the strain, making the **axial P–Cl bonds longer** (about $219$ pm) than the **equatorial P–Cl bonds** (about $204$ pm).",
            },
          ],
        },

        // ============================================================
        // SECTION 5 — Molecular orbital theory & hydrogen bonding
        // ============================================================
        {
          id: '4b22a6c1-5683-4b19-81c5-5acb64cbc800',
          title: 'Molecular orbital theory & hydrogen bonding',
          blurb: 'LCAO conditions, MO filling, bond order calculations, and the nature of the hydrogen bond.',
          items: [
            {
              kind: 'numerical',
              id: '52b129a9-41fa-4dbf-a188-29655573c696',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.34',
              prompt: 'Write the important conditions required for the linear combination of atomic orbitals to form molecular orbitals.',
              answer: 'Combining orbitals must have similar energy, the same symmetry about the molecular axis, and maximum possible overlap.',
              solution:
                "In molecular orbital theory, atomic orbitals from different atoms combine mathematically (linear combination, LCAO) to form new molecular orbitals. For this combination to actually produce a useful, stable bonding interaction, three conditions must be met:\n\n1. **Comparable energy.** The combining atomic orbitals must have the same, or very nearly the same, energy. Orbitals of very different energies mix poorly and don't effectively combine to form molecular orbitals (e.g. a $1s$ orbital of one atom won't meaningfully combine with a $2s$ orbital of a very different-energy atom).\n2. **Same symmetry about the molecular (internuclear) axis.** The atomic orbitals must have matching symmetry with respect to the axis joining the two nuclei — for instance, both must be symmetric (like two $s$ orbitals, or an $s$ and a $p_x$ orbital along the bond axis) or both antisymmetric in a matching way, so the overlap doesn't cancel out to zero by symmetry mismatch.\n3. **Maximum possible overlap.** The two atomic orbitals should overlap to the greatest extent possible. Greater overlap means greater electron density concentrated between the two nuclei, which produces a stronger, more stable bonding molecular orbital.\n\nIf any of these conditions fails badly — mismatched energy, mismatched symmetry, or negligible overlap — the atomic orbitals essentially do not combine into an effective molecular orbital.",
            },
            {
              kind: 'numerical',
              id: '770174df-18bf-4d24-afa8-1f30136102b2',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.35',
              prompt: 'Use molecular orbital theory to explain why the Be₂ molecule does not exist.',
              answer: 'Be₂ has bond order = 0 (4 bonding and 4 antibonding electrons cancel out), so there is no net bonding — Be₂ is not expected to exist.',
              solution:
                "Beryllium's electron configuration is $1s^2\\,2s^2$ — 4 electrons per atom, so a hypothetical $\\ce{Be2}$ molecule would have **8 electrons total** to place into molecular orbitals.\n\nFilling the molecular orbitals in increasing order of energy for $\\ce{Be2}$:\n$$\\sigma 1s^2\\ \\sigma^*1s^2\\ \\sigma 2s^2\\ \\sigma^*2s^2$$\n\nCount the electrons in bonding versus antibonding orbitals:\n- **Bonding electrons ($N_b$):** $\\sigma 1s^2$ + $\\sigma 2s^2$ = $2 + 2 = 4$\n- **Antibonding electrons ($N_a$):** $\\sigma^*1s^2$ + $\\sigma^*2s^2$ = $2 + 2 = 4$\n\nBond order is calculated as:\n$$\\text{Bond order} = \\frac{1}{2}(N_b - N_a) = \\frac{1}{2}(4 - 4) = 0$$\n\nA bond order of **zero** means there is no net bonding interaction between the two beryllium atoms at all — every bonding electron's stabilising effect is exactly cancelled out by an antibonding electron's destabilising effect. Since molecular orbital theory predicts zero net bond order, $\\ce{Be2}$ is **not expected to exist as a stable molecule** — and indeed, it is not observed under ordinary conditions.",
            },
            {
              kind: 'numerical',
              id: '18befb17-7ca2-4463-a08c-4d094a65b0be',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.36',
              prompt: 'Compare the relative stability of the following species and indicate their magnetic properties: O₂, O₂⁺, O₂⁻ (superoxide), O₂²⁻ (peroxide)',
              answer: 'Stability order: O₂⁺ (2.5) > O₂ (2) > O₂⁻ (1.5) > O₂²⁻ (1). O₂⁺, O₂, O₂⁻ are paramagnetic; O₂²⁻ is diamagnetic.',
              solution:
                "$\\ce{O2}$ has 16 electrons; each species below is obtained by removing or adding electrons from that base, and those extra/removed electrons go into (or come out of) the antibonding $\\pi^*2p$ orbitals — the highest occupied level in $\\ce{O2}$'s MO configuration:\n$$\\text{KK}\\ \\sigma 2s^2\\ \\sigma^*2s^2\\ \\sigma 2p_z^2\\ \\pi 2p_x^2 = \\pi 2p_y^2\\ \\pi^*2p_x^1 = \\pi^*2p_y^1$$\n(the two $\\pi^*$ orbitals each hold 1 electron, unpaired — this is why $\\ce{O2}$ itself is paramagnetic).\n\nFor each species, count bonding electrons $N_b$ and antibonding electrons $N_a$ (ignoring the cancelling $1s$ core, KK) and compute $\\text{bond order} = \\tfrac12(N_b - N_a)$:\n\n| Species | Electrons | Change from O₂ | $N_b$ | $N_a$ | Bond order | Unpaired e⁻ | Magnetic behaviour |\n|---|---|---|---|---|---|---|---|\n| $\\ce{O2+}$ | 15 | remove 1 e⁻ from $\\pi^*2p$ | 10 | 5 | $\\tfrac12(10-5)=2.5$ | 1 | paramagnetic |\n| $\\ce{O2}$ | 16 | — | 10 | 6 | $\\tfrac12(10-6)=2$ | 2 | paramagnetic |\n| $\\ce{O2-}$ | 17 | add 1 e⁻ to $\\pi^*2p$ | 10 | 7 | $\\tfrac12(10-7)=1.5$ | 1 | paramagnetic |\n| $\\ce{O2^2-}$ | 18 | add 2 e⁻ to $\\pi^*2p$ | 10 | 8 | $\\tfrac12(10-8)=1$ | 0 | diamagnetic |\n\n**Relative stability** (higher bond order = shorter, stronger bond = more stable):\n$$\\ce{O2+} (2.5) \\;>\\; \\ce{O2} (2) \\;>\\; \\ce{O2-} (1.5) \\;>\\; \\ce{O2^2-} (1)$$\n\n**Magnetic properties:** $\\ce{O2+}$, $\\ce{O2}$, and $\\ce{O2-}$ each retain at least one unpaired electron in their $\\pi^*$ orbitals, so all three are **paramagnetic**. In $\\ce{O2^2-}$, both $\\pi^*$ orbitals are completely filled (2 electrons each), leaving no unpaired electrons at all, so it is **diamagnetic**.",
            },
            {
              kind: 'numerical',
              id: 'e6e3588a-8389-4948-bb33-6f782fd4c9e1',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.37',
              prompt: 'Write the significance of a plus and a minus sign shown in representing the orbitals.',
              answer: 'The +/− signs represent the phase (sign) of the wave function, not electric charge; same-sign overlap is constructive (bonding MO), opposite-sign overlap is destructive (antibonding MO).',
              solution:
                "The $+$ and $-$ signs drawn on the lobes of an atomic or molecular orbital do **not** represent electrical charge (positive or negative charge). They represent the **sign (phase) of the wave function**, $\\psi$, at that point in space — a purely mathematical property that comes out of solving the Schrödinger wave equation for that orbital. A $p$ orbital, for example, naturally has one lobe where $\\psi$ is positive and the other lobe where $\\psi$ is negative.\n\nThis matters enormously when two orbitals from different atoms come together and overlap, because the signs determine whether the overlap is constructive or destructive:\n\n- **Same-sign (in-phase) overlap** — a $+$ lobe overlapping with another $+$ lobe (or $-$ with $-$) — produces **constructive interference**. The wave functions reinforce each other, increasing the electron probability density in the region between the two nuclei. This is a **bonding molecular orbital**, lower in energy than the original atomic orbitals, and it stabilises the molecule.\n- **Opposite-sign (out-of-phase) overlap** — a $+$ lobe overlapping with a $-$ lobe — produces **destructive interference**. The wave functions partially cancel, creating a **node** (a region of zero electron density) between the nuclei. This is an **antibonding molecular orbital**, higher in energy, and it destabilises the molecule.\n\nSo the $+$/$-$ signs are the bookkeeping device that tells you, purely from the mathematics of the wave functions, whether a particular combination of atomic orbitals will build up or tear down electron density between the nuclei — which is exactly what separates a bonding MO from an antibonding one.",
            },
            {
              kind: 'numerical',
              id: 'dc44c897-e460-4c96-a1d4-f00a2b7d81f7',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.39',
              prompt: 'Define hydrogen bond. Is it weaker or stronger than the van der Waals forces?',
              answer: 'A hydrogen bond is the attractive force between a H atom bonded to a highly electronegative atom (F, O, N) and a lone pair on a nearby electronegative atom; it is stronger than van der Waals forces (but weaker than a covalent bond).',
              solution:
                "**Definition:** a **hydrogen bond** forms when a hydrogen atom, already covalently bonded to a small, highly electronegative atom — specifically **F, O, or N** — experiences an additional weak electrostatic attraction toward a lone pair of electrons on another highly electronegative atom (again F, O, or N), which may belong to a different part of the same molecule or to a neighbouring molecule.\n\nThe reason this happens: because F, O, and N are so electronegative and hydrogen is so small, the H atom in a bond like $\\ce{O-H}$ or $\\ce{N-H}$ carries a significant partial positive charge ($\\delta^+$), and having almost no inner electron shielding, that partial charge is very exposed. This exposed $\\delta^+$ hydrogen is strongly attracted to the partial negative charge / lone pair on a nearby F, O, or N atom, and that attraction is the hydrogen bond — usually shown with a dotted line, e.g. $\\ce{O-H\\bond{...}O}$.\n\n**Strength comparison:** a hydrogen bond is **stronger than ordinary van der Waals forces**, but still much **weaker than a genuine covalent (or ionic) bond**. Typical hydrogen bond strength is roughly $10$–$40\\ \\text{kJ mol}^{-1}$, compared to ordinary van der Waals attractions which are usually less than about $5\\ \\text{kJ mol}^{-1}$, and compared to covalent bonds which are typically in the hundreds of $\\text{kJ mol}^{-1}$. So on the scale of interatomic/intermolecular forces, the hydrogen bond sits in between: **weaker than a covalent bond, but stronger than van der Waals forces** — which is exactly why hydrogen bonding has such an outsized effect on properties like the unusually high boiling point of water.",
            },
            {
              kind: 'numerical',
              id: '02f1cb2b-2c1c-4a67-91c2-710f75cc4f7e',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.40',
              prompt: 'What is meant by the term bond order? Calculate the bond order of: N₂, O₂, O₂⁺ and O₂⁻.',
              answer: 'Bond order = ½(Nb − Na). N₂: 3, O₂: 2, O₂⁺: 2.5, O₂⁻: 1.5',
              solution:
                "**Definition:** bond order is half the difference between the number of electrons in bonding molecular orbitals ($N_b$) and the number in antibonding molecular orbitals ($N_a$):\n$$\\text{Bond order} = \\frac{1}{2}(N_b - N_a)$$\nIt tells you effectively how many bonds exist between the two atoms (bond order 1 ≈ single bond, 2 ≈ double, 3 ≈ triple), and higher bond order corresponds to a shorter, stronger, more stable bond.\n\n**$\\ce{N2}$** — 14 electrons. Since nitrogen has $Z \\le 7$, the correct MO filling order places the $\\pi 2p$ orbitals below $\\sigma 2p_z$:\n$$\\text{KK}\\ \\sigma 2s^2\\ \\sigma^*2s^2\\ \\pi 2p_x^2 = \\pi 2p_y^2\\ \\sigma 2p_z^2$$\n$N_b = 2\\,(\\sigma 2s) + 2 + 2\\,(\\pi 2p) + 2\\,(\\sigma 2p_z) = 8$; $N_a = 2\\,(\\sigma^*2s)$.\n$$\\text{Bond order} = \\frac{1}{2}(8-2) = 3$$\n(matches the known $\\ce{N#N}$ triple bond — consistent with $\\ce{N2}$'s very high bond enthalpy.)\n\n**$\\ce{O2}$** — 16 electrons (as filled in question 4.36): $N_b = 10$, $N_a = 6$.\n$$\\text{Bond order} = \\frac{1}{2}(10-6) = 2$$\n\n**$\\ce{O2+}$** — 15 electrons (one less than $\\ce{O2}$, removed from $\\pi^*2p$): $N_b = 10$, $N_a = 5$.\n$$\\text{Bond order} = \\frac{1}{2}(10-5) = 2.5$$\n\n**$\\ce{O2-}$** — 17 electrons (one more than $\\ce{O2}$, added to $\\pi^*2p$): $N_b = 10$, $N_a = 7$.\n$$\\text{Bond order} = \\frac{1}{2}(10-7) = 1.5$$\n\n**Summary: $\\ce{N2} = 3$, $\\ce{O2} = 2$, $\\ce{O2+} = 2.5$, $\\ce{O2-} = 1.5$** — exactly matching the stability ranking worked out in question 4.36 (higher bond order, more stable, shorter bond).",
            },
          ],
        },
      ],
    },
  ],
};
