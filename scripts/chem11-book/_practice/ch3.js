// Practice — NCERT Exercises page for Class 11 Chemistry Live Book
// Live Book chapter 3: "Classification of Elements and Periodicity in Properties"
// Source: NCERT Class 11 Chemistry, Unit 3 (exercises 3.1–3.40)
// NOTE: no official NCERT answer key exists for this unit (descriptive/conceptual) —
// every solution below is derived and verified against periodic-trend chemistry,
// not copied from any external "selected answers" source.

module.exports = {
  slug: 'ch3-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 40 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'a30b00b1-79c3-4b22-bfd8-abf0701ecb6a',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A hand-drawn illustration of the periodic table with element trends — atomic size, ionization enthalpy, and electronegativity arrows sweeping across periods and down groups.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A hand-drawn coloured illustration on a deep-charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream). A stylised periodic table grid sketched across the frame, with a few element boxes picked out in warm ochre and teal, and soft hand-lettered arrows showing atomic radius shrinking across a period and growing down a group, alongside a small ionization-enthalpy curve motif. No glow, no neon, no orange haze, no 3D render look — flat, textured, textbook-illustration style, landscape 16:5 composition, clean hand-lettered labels only where necessary.',
    },
    {
      id: '0047789e-9aca-4b8d-9f7b-29203ed70065',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 40 NCERT exercises for this unit, regrouped from the textbook's running order into five revision themes so you practise one idea at a time: how the table itself is built, how atomic and ionic size behave, how ionization enthalpy trends (and breaks its own trend), electron gain enthalpy versus electronegativity, and finally how all of this adds up to metallic and non-metallic character. There is no official NCERT answer key for this unit — every solution here is worked out from the periodic trends you've just studied, step by step, so you can check your own reasoning against it.",
    },
    {
      id: '268ae9b0-665b-455f-badf-8e7c388eb221',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 3.1–3.40',
      intro:
        'Forty exercises from NCERT Unit 3, regrouped into five themes. Work through each section in order — the reasoning in one question often carries into the next.',
      sections: [
        {
          id: 's1-periodic-table-and-classification',
          title: 'Periodic table development & classification',
          blurb:
            'From Mendeleev to the modern law, and how electron configuration decides where an element sits.',
          items: [
            {
              kind: 'numerical',
              id: '7949b13e-123f-4357-828a-61e9f905f265',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.1',
              prompt: 'What is the basic theme of organisation in the periodic table?',
              answer: 'Elements are organised so that valence-shell configuration — and therefore properties — repeats periodically with atomic number.',
              solution:
                "The periodic table arranges elements in order of increasing atomic number so that elements with similar outer (valence) shell electronic configurations fall in the same column — a group. Since an element's chemical and most physical behaviour is decided mainly by its valence electrons, this arrangement makes properties recur at regular intervals as you move down the table. That recurrence is the whole point of the word 'periodic': the basic theme is classification by electronic configuration, so that similar properties line up together and change in a predictable, gradual way across a period and down a group.",
            },
            {
              kind: 'numerical',
              id: 'e7366e14-1cb3-44a1-b65d-1374bed098ef',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.2',
              prompt:
                'Which important property did Mendeleev use to classify the elements in his periodic table and did he stick to that?',
              answer: 'Atomic mass — but he broke strict mass order wherever it clashed with grouping elements of similar properties.',
              solution:
                "Mendeleev's Periodic Law states that the physical and chemical properties of elements are a periodic function of their atomic masses, and he arranged elements in order of increasing atomic mass. But he did not follow that order rigidly wherever it conflicted with keeping elements of similar properties in the same group. For example, tellurium (heavier, atomic mass ≈127.6) was placed before iodine (lighter, ≈126.9) because Te's properties matched group VI and I's matched group VII — property-similarity won over strict mass order whenever the two disagreed.",
            },
            {
              kind: 'numerical',
              id: 'ac17b8c2-cad2-49b7-95b4-68ad136fdfe5',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.3',
              prompt:
                "What is the basic difference in approach between the Mendeleev's Periodic Law and the Modern Periodic Law?",
              answer: "Mendeleev used atomic mass as the ordering property; the modern law uses atomic number instead.",
              solution:
                "Mendeleev's law says properties are a periodic function of atomic mass, and he ordered elements by increasing mass. The modern periodic law (based on Moseley's work) says properties are a periodic function of atomic number instead — the number of protons, i.e. the nuclear charge. This is the fundamental difference. It matters because atomic mass doesn't always increase in step with atomic number — isotopic abundances can make a heavier element come 'before' a lighter one in atomic-number order (the Ar/K, Co/Ni, Te/I pairs are the classic examples). Atomic number is an integer, unambiguous property, so switching to it removed these anomalies and gave the table a firmer physical foundation.",
            },
            {
              kind: 'numerical',
              id: 'fc4394d9-f684-46c9-892a-1ff7339f2ca0',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.4',
              prompt:
                'On the basis of quantum numbers, justify that the sixth period of the periodic table should have 32 elements.',
              answer: '6s + 4f + 5d + 6p subshells hold 2 + 14 + 10 + 6 = 32 electrons, so the sixth period has 32 elements.',
              solution:
                "A period ends when the outermost subshells being filled (in Aufbau order) are exhausted before the next principal shell begins. For the sixth period, the subshells filled — in the order the (n+l) rule fills them — are $6s$, $4f$, $5d$, and $6p$. Using the quantum-number rule that an s-subshell holds 2 electrons, a p-subshell holds 6, a d-subshell holds 10, and an f-subshell holds 14, the total number of electrons (and hence elements) accommodated in this period is $2 + 14 + 10 + 6 = 32$. That's why the sixth period runs to 32 elements, the longest period in the table.",
            },
            {
              kind: 'numerical',
              id: '50f9b81a-3545-4122-a0d7-8dcd588b5908',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.5',
              prompt: 'In terms of period and group where would you locate the element with Z=114?',
              answer: 'Period 7, group 14 (electronic configuration ends in $7p^2$).',
              solution:
                "Build up the configuration to Z = 114 using the Aufbau order: [Rn] $5f^{14}\\,6d^{10}\\,7s^2\\,7p^2$. The outermost principal quantum number is $n=7$, so the element sits in period 7. Its valence configuration ends in $np^2$ (like carbon and silicon), which is the group-14 pattern. So Z = 114 belongs to period 7, group 14 — this is the element flerovium.",
            },
            {
              kind: 'numerical',
              id: 'a0eaefcf-1659-4354-ba2f-b25451141fd5',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.6',
              prompt:
                'Write the atomic number of the element present in the third period and seventeenth group of the periodic table.',
              answer: 'Z = 17 (chlorine).',
              solution:
                "Period 3 runs from sodium (Z=11) to argon (Z=18). Group 17 is the halogen family. Counting across period 3 — Na(11), Mg(12), Al(13), Si(14), P(15), S(16), Cl(17), Ar(18) — the group-17 element in this row is chlorine, atomic number 17.",
            },
            {
              kind: 'numerical',
              id: '97040ad9-2e87-4aaa-86a1-99b45772e0f9',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.7',
              prompt:
                'Which element do you think would have been named by\n(i) Lawrence Berkeley Laboratory\n(ii) Seaborg\'s group?',
              answer: '(i) Berkelium (Bk) (ii) Seaborgium (Sg).',
              solution:
                "New elements are conventionally named after the place or person associated with their discovery.\n(i) An element named by the Lawrence Berkeley Laboratory would naturally be named after the laboratory's home city — this is berkelium (Bk, Z=97), first synthesised there.\n(ii) An element named in honour of a scientist working in that same group would carry that scientist's name — this is seaborgium (Sg, Z=106), named after Glenn T. Seaborg, whose research group at Berkeley pioneered the synthesis of many transuranium elements.",
            },
            {
              kind: 'numerical',
              id: 'de4abe9b-65cb-48be-bca6-a63b2860b995',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.8',
              prompt: 'Why do elements in the same group have similar physical and chemical properties?',
              answer: 'They share the same valence-shell electron configuration, differing only in the principal quantum number n.',
              solution:
                "Elements in the same group have the same number of electrons in their outermost (valence) shell, and the same pattern of subshells being filled — they differ only in the principal quantum number $n$, i.e. which shell that configuration sits in. Since chemical behaviour (bonding, valency, reactivity) is decided mainly by the valence electron configuration, elements in a group behave chemically alike. Physical properties still change gradually down the group, because $n$ increasing means larger atomic size, more shielding, and lower ionization enthalpy — but the family resemblance in chemistry comes directly from the shared valence-shell pattern.",
            },
            {
              kind: 'numerical',
              id: '1e0b9560-fb33-4c8e-8472-15e6106bbe5f',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.29',
              prompt: 'Write the general outer electronic configuration of s-, p-, d- and f- block elements.',
              answer: 's: $ns^{1-2}$, p: $ns^2np^{1-6}$, d: $(n-1)d^{1-10}ns^{0-2}$, f: $(n-2)f^{1-14}(n-1)d^{0-1}ns^2$.',
              solution:
                "Each block is named after the subshell that receives the last electron in the Aufbau build-up:\n- s-block: $ns^{1-2}$ — one or two electrons in the outermost s-subshell.\n- p-block: $ns^2\\,np^{1-6}$ — a filled s-subshell plus one to six p-electrons in the same shell.\n- d-block: $(n-1)d^{1-10}\\,ns^{0-2}$ — electrons filling the d-subshell of the shell just below the outermost one, with the outer s-subshell holding 0, 1, or 2 electrons.\n- f-block: $(n-2)f^{1-14}\\,(n-1)d^{0-1}\\,ns^2$ — electrons filling the f-subshell two shells below the outermost one, with the outer s-subshell filled and the d-subshell just below it holding 0 or 1 electron.",
            },
            {
              kind: 'numerical',
              id: '8eef2a83-d5c3-4a8e-b75f-b3a67bb037cf',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.30',
              prompt:
                'Assign the position of the element having outer electronic configuration\n(i) ns²np⁴ for n=3 (ii) (n-1)d²ns² for n=4, and (iii) (n-2)f⁷(n-1)d¹ns² for n=6, in the periodic table.',
              answer: '(i) Period 3, group 16 (ii) Period 4, group 4 (iii) Period 6, f-block (lanthanoid series).',
              solution:
                "Match each pattern to its block and read off the period from $n$ and the group from the electron count.\n(i) $3s^2 3p^4$: this is the $ns^2np^4$ p-block pattern, group 16 (oxygen family), and $n=3$ gives period 3 — the position of sulfur.\n(ii) $3d^2 4s^2$: this is $(n-1)d^2ns^2$, a d-block pattern with 2 d-electrons — group 4 — and $n=4$ gives period 4 — the position of titanium.\n(iii) $4f^7 5d^1 6s^2$: this is $(n-2)f^7(n-1)d^1ns^2$, an f-block pattern with $n=6$, so it sits in period 6 within the lanthanoid series (placed below group 3 in the extended table) — this matches gadolinium's configuration, one of the f-block exceptions where a d-electron appears alongside a half-filled 4f subshell for extra stability.",
            },
            {
              kind: 'mcq',
              id: '712d23b0-9470-4ed6-84e6-9a281bd07303',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.33',
              prompt: 'In the modern periodic table, the period indicates the value of:\n(a) atomic number\n(b) atomic mass\n(c) principal quantum number\n(d) azimuthal quantum number.',
              options: [
                'atomic number',
                'atomic mass',
                'principal quantum number',
                'azimuthal quantum number',
              ],
              correct_index: 2,
              explanation:
                "The period number equals the principal quantum number ($n$) of the outermost (valence) shell being filled. Period 1 fills $n=1$, period 2 fills $n=2$, and so on — atomic number and atomic mass increase within a period but don't define it, and azimuthal quantum number ($l$) decides the block (s, p, d, f), not the period. So the correct answer is (c).",
            },
            {
              kind: 'mcq',
              id: '5f743f16-d856-4561-82ca-de4319cefd23',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.34',
              prompt:
                'Which of the following statements related to the modern periodic table is incorrect?\n(a) The p-block has 6 columns, because a maximum of 6 electrons can occupy all the orbitals in a p-shell.\n(b) The d-block has 8 columns, because a maximum of 8 electrons can occupy all the orbitals in a d-subshell.\n(c) Each block contains a number of columns equal to the number of electrons that can occupy that subshell.\n(d) The block indicates value of azimuthal quantum number (l) for the last subshell that received electrons in building up the electronic configuration.',
              options: [
                'The p-block has 6 columns, because a maximum of 6 electrons can occupy all the orbitals in a p-shell.',
                'The d-block has 8 columns, because a maximum of 8 electrons can occupy all the orbitals in a d-subshell.',
                'Each block contains a number of columns equal to the number of electrons that can occupy that subshell.',
                'The block indicates value of azimuthal quantum number (l) for the last subshell that received electrons in building up the electronic configuration.',
              ],
              correct_index: 1,
              explanation:
                "A d-subshell has 5 orbitals, each holding 2 electrons, for a maximum of 10 electrons — not 8. That's why the d-block spans 10 columns (groups 3–12), not 8. Statements (a), (c), and (d) are all correct: the p-subshell holds 6 electrons across 6 columns, each block's column count matches its subshell's electron capacity, and the block (s/p/d/f) does correspond to the azimuthal quantum number of the last-filled subshell. So the incorrect statement is (b).",
            },
            {
              kind: 'mcq',
              id: '04ab0663-9648-465b-8d4e-96bd7800ed72',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.35',
              prompt:
                'Anything that influences the valence electrons will affect the chemistry of the element. Which one of the following factors does not affect the valence shell?\n(a) Valence principal quantum number (n)\n(b) Nuclear charge (Z)\n(c) Nuclear mass\n(d) Number of core electrons.',
              options: [
                'Valence principal quantum number (n)',
                'Nuclear charge (Z)',
                'Nuclear mass',
                'Number of core electrons',
              ],
              correct_index: 2,
              explanation:
                "The valence shell's behaviour depends on how strongly the nucleus attracts it and how much the inner electrons shield that attraction — that's decided by nuclear charge (number of protons), the principal quantum number of the valence shell (how far it sits from the nucleus), and the number of core electrons (how much shielding they provide). Nuclear mass (essentially the neutron count) has no electrical effect on the electron cloud — neutrons don't attract or repel electrons. So the factor that does not affect the valence shell is (c) nuclear mass.",
            },
          ],
        },
        {
          id: 's2-atomic-and-ionic-radii',
          title: 'Atomic & ionic radii, isoelectronic species',
          blurb: 'How size changes across a period, down a group, and on losing or gaining electrons.',
          items: [
            {
              kind: 'numerical',
              id: '1a3e1bd2-1801-4c16-98a7-ea60ff7e2ca2',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.9',
              prompt: 'What does atomic radius and ionic radius really mean to you?',
              answer: 'Both are operational measures of how far an atom\'s or ion\'s electron cloud extends from its nucleus.',
              solution:
                "An electron cloud has no sharp, well-defined edge, so 'atomic radius' is an operational definition: the distance from the centre of the nucleus to the point up to which it can be said to have influence on its electron cloud, usually measured as half the distance between the nuclei of two identical atoms held together in a bond (covalent radius), or in a metallic lattice (metallic radius), or as the closest approach in a non-bonded collision (van der Waals radius).\n\nIonic radius is the same idea applied to an ion: the effective distance from the ion's nucleus up to which it exerts influence on its own electron cloud. It's determined from the inter-nuclear distance measured in an ionic crystal (e.g. by X-ray diffraction on \\ce{NaCl}), split between the cation and anion in proportion to their sizes.",
            },
            {
              kind: 'numerical',
              id: 'e4b48d89-5c43-4a84-bf08-0b1886d9685e',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.10',
              prompt: 'How do atomic radius vary in a period and in a group? How do you explain the variation?',
              answer: 'Atomic radius decreases across a period and increases down a group.',
              solution:
                "Across a period (left to right): atomic radius decreases. Electrons are being added to the same principal shell (same $n$) while the nuclear charge $Z$ also increases with each element. Since these new electrons are added to the same shell, they don't shield each other very effectively — so the effective nuclear charge felt by the outer electrons rises, and the electron cloud is pulled in more tightly.\n\nDown a group: atomic radius increases. Each step down adds a whole new principal shell (higher $n$), so despite $Z$ also increasing, the outer electrons are now much farther from the nucleus and are shielded by an extra layer of inner electrons. The effect of the new shell and the added shielding outweighs the higher nuclear charge, so the atom gets bigger.",
            },
            {
              kind: 'numerical',
              id: 'daf38cb0-2856-4b08-8b45-f8e26e687280',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.11',
              prompt:
                'What do you understand by isoelectronic species? Name a species that will be isoelectronic with each of the following atoms or ions.\n(i) F⁻ (ii) Ar (iii) Mg²⁺ (iv) Rb⁺',
              answer: '(i) Ne (ii) Ca²⁺ (or K⁺) (iii) Na⁺ (or Ne) (iv) Sr²⁺ (or Kr).',
              solution:
                "Isoelectronic species are atoms or ions that have the same total number of electrons, even though they may have different nuclear charges.\n(i) \\ce{F-} has $9+1=10$ electrons — isoelectronic with neon (Ne, 10 electrons), and also with \\ce{Na+}, \\ce{O^2-}, \\ce{Mg^2+}.\n(ii) Ar has 18 electrons — isoelectronic with \\ce{Ca^2+} ($20-2=18$), and also with \\ce{K+}, \\ce{Cl-}, \\ce{S^2-}.\n(iii) \\ce{Mg^2+} has $12-2=10$ electrons — isoelectronic with \\ce{Na+} (10 electrons), and also with Ne, \\ce{F-}.\n(iv) \\ce{Rb+} has $37-1=36$ electrons — isoelectronic with \\ce{Sr^2+} ($38-2=36$), and also with krypton (Kr, 36 electrons), \\ce{Br-}.",
            },
            {
              kind: 'numerical',
              id: '2e64f003-a4d0-49e9-8472-5fed8340c0cf',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.12',
              prompt:
                'Consider the following species:\nN³⁻, O²⁻, F⁻, Na⁺, Mg²⁺ and Al³⁺\n(a) What is common in them?\n(b) Arrange them in the order of increasing ionic radii.',
              answer: '(a) All are isoelectronic (10 electrons each) (b) Al³⁺ < Mg²⁺ < Na⁺ < F⁻ < O²⁻ < N³⁻.',
              solution:
                "(a) All six species have exactly 10 electrons — the same electronic configuration as neon ($1s^2\\,2s^2\\,2p^6$). They are isoelectronic.\n\n(b) Since all six have the same number of electrons, the only thing that changes their size is nuclear charge: more protons pull the same electron cloud in tighter, so radius shrinks as $Z$ rises. Ranking by $Z$ — N(7), O(8), F(9), Na(11), Mg(12), Al(13) — from lowest to highest charge gives the largest to smallest ion. So increasing ionic radii (smallest to largest) is:\n\\ce{Al^3+} < \\ce{Mg^2+} < \\ce{Na+} < \\ce{F-} < \\ce{O^2-} < \\ce{N^3-}.",
            },
            {
              kind: 'numerical',
              id: '1c6758e2-c63d-48e8-847e-56da7e097e4b',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.13',
              prompt: 'Explain why cation are smaller and anions larger in radii than their parent atoms?',
              answer: 'Losing electrons shrinks the cloud (less repulsion, same nuclear pull); gaining electrons expands it (more repulsion).',
              solution:
                "A cation forms when an atom loses one or more electrons — often its entire outermost shell disappears. The remaining electrons are held by the same nuclear charge but there are now fewer of them and less electron-electron repulsion, so the effective pull per electron is stronger and the cloud contracts. That's why a cation is always smaller than its parent atom.\n\nAn anion forms when an atom gains one or more electrons. The same nuclear charge is now shared among more electrons, so electron-electron repulsion increases and the effective nuclear charge felt by each electron drops — the electron cloud spreads out. That's why an anion is always larger than its parent atom.",
            },
            {
              kind: 'numerical',
              id: 'c553b53d-54fd-4eac-82ed-fd9406cd67da',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.24',
              prompt:
                'Describe the theory associated with the radius of an atom as it\n(a) gains an electron\n(b) loses an electron',
              answer: '(a) Radius increases (more electron-electron repulsion) (b) Radius decreases (less repulsion, tighter pull).',
              solution:
                "(a) When an atom gains an electron (forming an anion), the nuclear charge stays exactly the same but there is now one more electron in the cloud. The extra electron-electron repulsion pushes the whole cloud outward, and the same nuclear charge now has to hold a larger number of electrons, so the effective attraction per electron weakens — the radius increases.\n(b) When an atom loses an electron (forming a cation), the nuclear charge again stays the same, but there are now fewer electrons — often the entire outer shell is removed. With less repulsion between the remaining electrons and the same nuclear pull now acting on fewer of them, the cloud is pulled in more tightly — the radius decreases. This is the same reasoning behind Exercise 3.13, just phrased as a general process rather than a comparison of specific ions.",
            },
            {
              kind: 'numerical',
              id: '26c44102-18ea-4853-b9d6-2884e6a9159e',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.25',
              prompt: 'Would you expect the first ionization enthalpies for two isotopes of the same element to be the same or different? Justify your answer.',
              answer: 'The same.',
              solution:
                "Isotopes of the same element have identical atomic number and identical electronic configuration — they differ only in the number of neutrons, which changes atomic mass but has essentially no electrical effect on the electron cloud (neutrons carry no charge, so they neither attract nor repel electrons in any significant way). Since ionization enthalpy depends on the nuclear charge and the arrangement of electrons around it, and both of those are unchanged between isotopes, the first ionization enthalpy of two isotopes of the same element is expected to be essentially the same.",
            },
            {
              kind: 'mcq',
              id: 'b2dfebdb-e838-47fb-9269-6fbe9100beb0',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.36',
              prompt:
                'The size of isoelectronic species — F⁻, Ne and Na⁺ is affected by\n(a) nuclear charge (Z)\n(b) valence principal quantum number (n)\n(c) electron-electron interaction in the outer orbitals\n(d) none of the factors because their size is the same.',
              options: [
                'nuclear charge (Z)',
                'valence principal quantum number (n)',
                'electron-electron interaction in the outer orbitals',
                'none of the factors because their size is the same',
              ],
              correct_index: 0,
              explanation:
                "\\ce{F-}, Ne, and \\ce{Na+} are all isoelectronic — each has exactly 10 electrons in the same $n=2$ outer shell configuration, so the principal quantum number and the electron count (and hence electron-electron interaction pattern) are identical across all three; those cannot be what makes their sizes different. What does differ is the nuclear charge: F has 9 protons, Ne has 10, Na has 11. A higher nuclear charge pulls the same electron cloud in more tightly, so size falls as $Z$ rises: \\ce{F-} > Ne > \\ce{Na+}. The correct answer is (a) nuclear charge (Z).",
            },
          ],
        },
        {
          id: 's3-ionization-enthalpy-trends',
          title: 'Ionization enthalpy trends',
          blurb: 'The smooth trend across periods and groups, and the real exceptions that break it.',
          items: [
            {
              kind: 'numerical',
              id: 'b0890541-d8e6-4545-b542-a8d6d3d7f578',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.14',
              prompt:
                "What is the significance of the terms — 'isolated gaseous atom' and 'ground state' while defining the ionization enthalpy and electron gain enthalpy?\nHint: Requirements for comparison purposes.",
              answer: 'They standardise the measurement so different elements can be fairly compared.',
              solution:
                "Both terms exist to make ionization enthalpy and electron gain enthalpy comparable, standard properties of an element, free of outside interference.\n\n'Isolated gaseous atom' means the atom has no neighbouring atoms exerting any force on it — no bonding, no lattice environment, no solvent effects. This way, the energy change measured is purely the atom's own intrinsic tendency to lose or gain an electron, not something distorted by its surroundings.\n\n'Ground state' means the atom must start from its lowest-energy, most stable electronic configuration before the electron is removed or added. If the atom were in some excited state instead, the energy required would be different (usually less, since excited electrons are already loosely held) and the values would no longer represent that element's true, comparable baseline. Together, these two conditions let ionization enthalpy and electron gain enthalpy be tabulated and compared meaningfully across the whole periodic table.",
            },
            {
              kind: 'numerical',
              id: '24e3bff4-0e1c-479e-a609-8b6ffd12238f',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.15',
              prompt:
                'Energy of an electron in the ground state of the hydrogen atom is −2.18×10⁻¹⁸ J. Calculate the ionization enthalpy of atomic hydrogen in terms of J mol⁻¹.\nHint: Apply the idea of mole concept to derive the answer.',
              answer: 'IE ≈ 1.312 × 10⁶ J mol⁻¹ (≈ 1312 kJ mol⁻¹).',
              solution:
                "Ionization enthalpy is the energy needed to remove the electron completely — i.e. to take it from its ground-state energy up to zero energy (an electron at rest, infinitely far from the nucleus).\n\nEnergy needed per atom $= E_\\infty - E_{ground} = 0 - (-2.18\\times10^{-18}\\,\\text{J}) = 2.18\\times10^{-18}\\,\\text{J}$.\n\nTo convert this per-atom energy to a per-mole quantity, multiply by Avogadro's number, $N_A = 6.022\\times10^{23}\\,\\text{mol}^{-1}$:\n\n$IE = 2.18\\times10^{-18} \\times 6.022\\times10^{23} = 13.13\\times10^{5}\\,\\text{J mol}^{-1} \\approx 1.312\\times10^{6}\\,\\text{J mol}^{-1}$.\n\nSo the ionization enthalpy of atomic hydrogen is about $1.312\\times10^{6}\\,\\text{J mol}^{-1}$, i.e. roughly 1312 kJ mol⁻¹ — this matches the well-known ionization enthalpy of hydrogen, which is a good internal check on the arithmetic.",
            },
            {
              kind: 'numerical',
              id: '59c57e65-bff2-4013-ad8d-9ae292c10266',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.16',
              prompt:
                'Among the second period elements the actual ionization enthalpies are in the order Li < B < Be < C < O < N < F < Ne.\nExplain why\n(i) Be has higher ΔiH than B\n(ii) O has lower ΔiH than N and F?',
              answer: 'Both are stability-of-subshell exceptions: a filled 2s² in Be, and a half-filled 2p³ in N.',
              solution:
                "Both of these are the two classic exceptions to the otherwise smooth left-to-right increase in ionization enthalpy across a period, and both come down to extra stability of a particular subshell arrangement.\n\n(i) Be ($1s^2\\,2s^2$) has a completely filled 2s subshell — a symmetrical, extra-stable arrangement — so pulling an electron out of it takes more energy than the simple period-trend would suggest. B ($1s^2\\,2s^2\\,2p^1$) has to lose its lone 2p electron instead. That 2p electron is at a slightly higher energy than the 2s electrons and is reasonably well shielded by the filled 2s² pair, so it's actually easier to remove than Be's 2s electron — giving B a lower ionization enthalpy than Be, even though B's nuclear charge is higher.\n\n(ii) N ($1s^2\\,2s^2\\,2p^3$) has a half-filled 2p subshell — one electron in each of the three 2p orbitals, unpaired. This symmetric, half-filled arrangement is also extra stable (maximised exchange energy), so removing an electron from it needs more energy than expected. O ($1s^2\\,2s^2\\,2p^4$) has to pair up its fourth 2p electron with one already in an orbital. That pairing creates extra electron-electron repulsion within the same orbital, which makes it easier to knock that paired electron out — so O's ionization enthalpy dips below both N (which loses the extra-stable half-filled advantage) and F (which has a higher nuclear charge and is closer to a complete octet).",
            },
            {
              kind: 'numerical',
              id: '646246ee-b184-4521-b181-a486189f07e7',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.17',
              prompt:
                'How would you explain the fact that the first ionization enthalpy of sodium is lower than that of magnesium but its second ionization enthalpy is higher than that of magnesium?',
              answer: 'Na easily loses its lone 3s electron (IE1 low) but its second removal breaks a stable noble-gas core (IE2 very high); Mg is the reverse.',
              solution:
                "Na is $[\\text{Ne}]3s^1$ and Mg is $[\\text{Ne}]3s^2$.\n\nFirst ionization enthalpy: removing Na's single 3s electron leaves behind the very stable, fully-filled $[\\text{Ne}]$ noble-gas configuration — this is an easy, low-energy step, so Na's first IE is low. Removing an electron from Mg means breaking into a filled 3s² subshell, which has extra stability, so Mg's first IE is higher than Na's.\n\nSecond ionization enthalpy: removing a second electron from \\ce{Na+} means tearing into the already-stable, complete-octet $[\\text{Ne}]$ core — this needs a huge amount of energy, making Na's second IE very high. Removing a second electron from \\ce{Mg+} just removes its remaining lone 3s electron, bringing it to the same stable $[\\text{Ne}]$ configuration — a comparatively easy step. So Mg's second IE is much lower than Na's second IE, flipping the order seen for the first ionization enthalpy.",
            },
            {
              kind: 'numerical',
              id: '52c48a65-2e02-470a-889d-1e3ce8c2f0b4',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.18',
              prompt: 'What are the various factors due to which the ionization enthalpy of the main group elements tends to decrease down a group?',
              answer: 'Increasing atomic size and increasing shielding, both of which outweigh the rising nuclear charge.',
              solution:
                "Two effects work together as you move down a main group, and both make the outer electron easier to remove:\n1. Increasing atomic radius — each row down adds a new principal shell, so the valence electron sits farther from the nucleus, and the electrostatic attraction holding it (which falls off with distance) grows weaker.\n2. Increasing shielding (screening effect) — with each additional inner shell of electrons, the valence electron feels less of the full nuclear charge, because the inner electrons partially block ('screen') that attraction.\nAlthough the nuclear charge itself is also increasing down the group (more protons), the combined effect of greater distance and greater shielding outweighs it, so the effective pull on the valence electron actually weakens. That's why ionization enthalpy falls steadily down a group for main-group elements.",
            },
            {
              kind: 'numerical',
              id: '88b3173a-66c0-473b-b2a4-932912e90060',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.19',
              prompt:
                'The first ionization enthalpy values (in kJ mol⁻¹) of group 13 elements are:\nB 801, Al 577, Ga 579, In 558, Tl 589\nHow would you explain this deviation from the general trend?',
              answer: 'Poor shielding by the intervening d (in Ga) and f (in Tl) electrons raises their effective nuclear charge above the smooth-trend expectation.',
              solution:
                "By the reasoning in Exercise 3.18, ionization enthalpy should fall steadily down a group. That mostly holds here — B (801) is clearly the highest — but Ga (579) is very slightly above Al (577), and Tl (589) is noticeably above In (558), breaking the smooth decrease.\n\nThe reason is poor shielding by inner d- and f-electrons. Gallium comes right after the first transition series, so its core includes a filled $3d^{10}$ subshell; thallium comes right after the lanthanoids, so its core includes a filled $4f^{14}$ subshell. Both d- and f-electrons are diffuse and shield the nucleus much less effectively than s- and p-electrons do. So the valence electron in Ga and Tl feels a higher effective nuclear charge than the simple atomic-size trend would predict, nudging their ionization enthalpies up above their expected place in the smooth decreasing sequence.",
            },
            {
              kind: 'mcq',
              id: 'b52d83fe-6e05-432a-b357-0385d4c2c7e7',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.37',
              prompt:
                'Which one of the following statements is incorrect in relation to ionization enthalpy?\n(a) Ionization enthalpy increases for each successive electron.\n(b) The greatest increase in ionization enthalpy is experienced on removal of electron from core noble gas configuration.\n(c) End of valence electrons is marked by a big jump in ionization enthalpy.\n(d) Removal of electron from orbitals bearing lower n value is easier than from orbital having higher n value.',
              options: [
                'Ionization enthalpy increases for each successive electron.',
                'The greatest increase in ionization enthalpy is experienced on removal of electron from core noble gas configuration.',
                'End of valence electrons is marked by a big jump in ionization enthalpy.',
                'Removal of electron from orbitals bearing lower n value is easier than from orbital having higher n value.',
              ],
              correct_index: 3,
              explanation:
                "Electrons in orbitals with a lower principal quantum number ($n$) are the inner, core electrons — they sit closer to the nucleus, feel a much higher effective nuclear charge, and are barely shielded. That makes them harder to remove, not easier, than electrons in higher-$n$ (outer, valence) orbitals — exactly the opposite of what statement (d) claims. Statements (a)–(c) are all true: successive ionization enthalpies do keep rising (fewer electrons left, same or growing nuclear pull), the biggest jump happens right after the valence electrons run out and you start pulling from a stable noble-gas core, and that jump is exactly what marks the end of the valence shell. So the incorrect statement is (d).",
            },
          ],
        },
        {
          id: 's4-electron-gain-enthalpy-and-electronegativity',
          title: 'Electron gain enthalpy & electronegativity',
          blurb: 'Why these two are different properties, and where the fluorine anomaly comes from.',
          items: [
            {
              kind: 'numerical',
              id: '25568b3f-3c55-426c-b556-56f1a994a417',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.20',
              prompt:
                'Which of the following pairs of elements would have a more negative electron gain enthalpy?\n(i) O or F\n(ii) F or Cl',
              answer: '(i) F (ii) Cl.',
              solution:
                "(i) O or F: F has the more negative electron gain enthalpy. F needs only one more electron to complete a stable octet, and its smaller size and higher effective nuclear charge attract the incoming electron more strongly than O does (O still needs two electrons to reach a full octet, and adding the first electron to it is comparatively less favourable).\n\n(ii) F or Cl: Cl has the more negative electron gain enthalpy — this is the well-known anomaly. Fluorine is so small that its 2p subshell is already very compact and crowded; the incoming electron experiences strong electron-electron repulsion there, which works against the energy released. Chlorine's 3p subshell is roomier, so the extra electron faces much less repulsion, and Cl ends up releasing more energy on gaining an electron than F does.",
            },
            {
              kind: 'numerical',
              id: '3a43f549-f066-4b6a-80ce-8c7938d15df5',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.21',
              prompt: 'Would you expect the second electron gain enthalpy of O as positive, more negative or less negative than the first? Justify your answer.',
              answer: 'Positive (endothermic).',
              solution:
                "The first electron gain enthalpy of O is negative (energy is released) because a neutral O atom attracts an incoming electron. But the second electron gain enthalpy — adding a further electron to \\ce{O-} to form \\ce{O^2-} — is positive, i.e. energy has to be put in. This is because \\ce{O-} is already negatively charged, and bringing another electron toward it means overcoming electrostatic repulsion between two like (negative) charges. That repulsion outweighs any attraction from the nucleus at this stage, so the process is endothermic rather than exothermic.",
            },
            {
              kind: 'numerical',
              id: '3448a1fb-68f3-4867-aba3-75715561b8c5',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.22',
              prompt: 'What is the basic difference between the terms electron gain enthalpy and electronegativity?',
              answer: 'Electron gain enthalpy is a measurable energy of a free atom; electronegativity is a relative, bond-context property.',
              solution:
                "Electron gain enthalpy is an experimentally measurable quantity (in kJ mol⁻¹) — the energy change when an isolated gaseous atom gains an electron to become a gaseous anion. It's a property of a free, isolated atom, defined independently of any bond.\n\nElectronegativity is a relative, comparative number (on a scale such as Pauling's) that describes how strongly an atom, while actually bonded to another atom, pulls the shared pair of electrons in a covalent bond toward itself. It isn't measured directly in the same absolute sense — it's a property of an atom in a bonding environment, and so it can shift depending on the atom's hybridization, oxidation state, and what it's bonded to, unlike electron gain enthalpy which refers to a free atom.",
            },
            {
              kind: 'numerical',
              id: 'e2f0716c-2d6b-43de-9f0d-907b1ea2e5e2',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.23',
              prompt: 'How would you react to the statement that the electronegativity of N on Pauling scale is 3.0 in all the nitrogen compounds?',
              answer: 'The statement is not correct — electronegativity varies with hybridization and bonding environment.',
              solution:
                "This statement isn't correct. Electronegativity is not a fixed, universal constant for an element — it depends on the hybridization state of the atom, its oxidation state, and the nature of the atom it's bonded to. The value 3.0 for nitrogen is a general, average figure quoted for typical compounds, but nitrogen's actual pull on shared electrons can differ from one compound to the next depending on whether it's sp, sp², or sp³ hybridised and what else it's bonded to. So it would be more accurate to say nitrogen's electronegativity is approximately 3.0 in most common compounds, not that it is exactly 3.0 in every nitrogen compound without exception.",
            },
          ],
        },
        {
          id: 's5-metallic-character-and-reactivity',
          title: 'Metallic character & periodic reactivity',
          blurb: 'Turning atomic size, ionization enthalpy, and electron gain enthalpy into real chemical behaviour.',
          items: [
            {
              kind: 'numerical',
              id: 'b4e8771a-3480-4f7b-afe2-265db953b8a9',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.26',
              prompt: 'What are the major differences between metals and non-metals?',
              answer: 'Metals lose electrons easily and form basic oxides/cations; non-metals gain electrons and form acidic oxides/anions.',
              solution:
                "Metals have low ionization enthalpy, so they readily lose electrons to form cations — they are electropositive. Their oxides are generally basic, they conduct heat and electricity well, and they are malleable, ductile, and lustrous; nearly all are solids at room temperature (mercury is the exception). They sit on the left and lower-left of the periodic table.\n\nNon-metals have high ionization enthalpy and, for most of them, a strongly negative electron gain enthalpy — so they tend to gain electrons and form anions, making them electronegative. Their oxides are generally acidic (or neutral), they are poor conductors (graphite is the notable exception), they tend to be brittle if solid rather than malleable, and they lack metallic lustre. They sit on the upper-right of the periodic table.",
            },
            {
              kind: 'numerical',
              id: 'f30b0328-95e9-4983-92d9-9bb87e5de653',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.27',
              prompt:
                'Use the periodic table to answer the following questions.\n(a) Identify an element with five electrons in the outer subshell.\n(b) Identify an element that would tend to lose two electrons.\n(c) Identify an element that would tend to gain two electrons.\n(d) Identify the group having metal, non-metal, liquid as well as gas at the room temperature.',
              answer: '(a) A halogen, e.g. Cl (b) An alkaline-earth metal, e.g. Mg (c) An oxygen-family element, e.g. O (d) Group 17.',
              solution:
                "(a) 'Five electrons in the outer subshell' means an $np^5$ configuration — this is the halogen family, group 17 (e.g. fluorine or chlorine).\n(b) An element that tends to lose two electrons has $ns^2$ as its full valence configuration and no easy path to lose just one — this is the alkaline earth metal family, group 2 (e.g. magnesium, calcium).\n(c) An element that tends to gain two electrons needs two more to complete an octet, i.e. $ns^2np^4$ — this is the oxygen family, group 16 (e.g. oxygen, sulfur).\n(d) Group 17 (the halogens) uniquely spans all three states of matter plus both metal and non-metal character at room temperature: fluorine and chlorine are gases, bromine is a liquid, iodine is a solid non-metal, and astatine (extremely rare, radioactive) shows some metallic character.",
            },
            {
              kind: 'numerical',
              id: '2d85254f-20a9-421d-85d4-d5fd08f78d93',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.28',
              prompt:
                'The increasing order of reactivity among group 1 elements is Li < Na < K < Rb < Cs whereas that among group 17 elements is F > Cl > Br > I. Explain.',
              answer: 'Group 1 reactivity tracks falling ionization enthalpy down the group; group 17 reactivity tracks weakening electron gain enthalpy down the group.',
              solution:
                "Group 1 (alkali metals) react by losing their single valence electron, so their reactivity depends on how low their ionization enthalpy is — the lower the IE, the more reactive the metal. Down the group, atomic size and shielding both increase, so IE falls steadily (Exercise 3.18's reasoning), and it becomes progressively easier to lose that electron. That's why reactivity rises down the group: Li < Na < K < Rb < Cs.\n\nGroup 17 (halogens) react by gaining one electron to complete their octet, so their reactivity depends on how readily they attract that extra electron — a more negative electron gain enthalpy (and generally, smaller size / higher electronegativity) means more reactive. Down the group, atomic size increases and the pull on an incoming electron weakens, so electron gain enthalpy becomes progressively less favourable. That's why reactivity falls down the group: F > Cl > Br > I. (Fluorine's actual electron gain enthalpy magnitude is slightly less than chlorine's, for the reason worked out in Exercise 3.20, but its very small size and very high electronegativity still make it the most reactive halogen overall.)",
            },
            {
              kind: 'numerical',
              id: '1755fb7a-a5df-43b9-8502-9a60d70916e5',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.31',
              prompt:
                'The first (ΔiH1) and the second (ΔiH2) ionization enthalpies (in kJ mol⁻¹) and the (ΔegH) electron gain enthalpy (in kJ mol⁻¹) of a few elements are given below:\n\nElement I: ΔiH1=520, ΔiH2=7300, ΔegH=−60\nElement II: ΔiH1=419, ΔiH2=3051, ΔegH=−48\nElement III: ΔiH1=1681, ΔiH2=3374, ΔegH=−328\nElement IV: ΔiH1=1008, ΔiH2=1846, ΔegH=−295\nElement V: ΔiH1=2372, ΔiH2=5251, ΔegH=+48\nElement VI: ΔiH1=738, ΔiH2=1451, ΔegH=−40\n\nWhich of the above elements is likely to be:\n(a) the least reactive element.\n(b) the most reactive metal.\n(c) the most reactive non-metal.\n(d) the least reactive non-metal.\n(e) the metal which can form a stable binary halide of the formula MX2 (X=halogen).\n(f) the metal which can form a predominantly stable covalent halide of the formula MX (X=halogen)?',
              answer: '(a) V (b) II (c) III (d) IV (e) VI (f) I.',
              solution:
                "Read each element's row as a behavioural fingerprint, not just numbers.\n\n(a) Least reactive element: this should have the highest ionization enthalpy of all (very hard to remove an electron) and a small, unfavourable (positive) electron gain enthalpy (no interest in gaining one either) — that's a noble gas signature. Element V fits exactly: the highest ΔiH1 (2372) of the set, and the only positive ΔegH (+48). V is the least reactive element.\n\n(b) Most reactive metal: among the elements showing the huge ΔiH1→ΔiH2 jump typical of a single loosely-held valence electron (I and II), compare ΔiH1 — the lower it is, the more reactive the metal. II (419) is lower than I (520), so II is the more reactive metal.\n\n(c) Most reactive non-metal: this needs the most negative electron gain enthalpy alongside a high ΔiH1 (i.e. it doesn't want to lose an electron, but strongly wants to gain one) — classic halogen behaviour. III has the most negative ΔegH (−328) of the whole set along with a high ΔiH1 (1681), so III is the most reactive non-metal.\n\n(d) Least reactive non-metal: comparing the remaining non-metal-like elements, IV has a less negative ΔegH (−295) than III (−328) and a lower ΔiH1 (1008) — still non-metallic in character but clearly less eager to gain an electron than III. So IV is the least reactive non-metal of this set.\n\n(e) Metal forming a stable MX2 halide: this needs an element with two valence electrons that it loses fairly readily — i.e. a modest ΔiH1→ΔiH2 jump (nothing like the 14× jump seen in I), consistent with an alkaline-earth-type metal. VI shows exactly that pattern (738 → 1451, roughly a 2× jump, not a huge one), so VI is the metal likely to form a stable \\ce{MX2} halide.\n\n(f) Metal forming a predominantly covalent MX halide: this points to a small, high-charge-density metal ion whose bonds to halogens gain significant covalent character (by Fajans' rules) despite formally being a 1:1 ionic-looking compound. Element I shows the sharpest ΔiH1→ΔiH2 jump in the table (520 → 7300, roughly 14×) — the signature of a very small alkali-metal-like atom that holds tightly to its remaining core after losing one electron — consistent with a small, highly polarising metal like lithium, known for unusually covalent halides. So I is the metal most likely to form a predominantly covalent \\ce{MX} halide.",
            },
            {
              kind: 'numerical',
              id: '2681b8c1-1103-4212-b365-ce08e54d05a9',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.32',
              prompt:
                'Predict the formulas of the stable binary compounds that would be formed by the combination of the following pairs of elements.\n(a) Lithium and oxygen\n(b) Magnesium and nitrogen\n(c) Aluminium and iodine\n(d) Silicon and oxygen\n(e) Phosphorus and fluorine\n(f) Element 71 and fluorine',
              answer: '(a) Li₂O (b) Mg₃N₂ (c) AlI₃ (d) SiO₂ (e) PF₃ (f) LuF₃.',
              solution:
                "Predict each formula by balancing the common valency (oxidation state) of each element so total positive and negative charge cancel out.\n(a) Lithium (group 1, valency +1) and oxygen (group 16, valency −2): balancing charges gives \\ce{Li2O}.\n(b) Magnesium (group 2, valency +2) and nitrogen (group 15, valency −3): balancing charges gives \\ce{Mg3N2}.\n(c) Aluminium (group 13, valency +3) and iodine (group 17, valency −1): balancing charges gives \\ce{AlI3}.\n(d) Silicon (group 14, valency +4) and oxygen (valency −2): balancing charges gives \\ce{SiO2}.\n(e) Phosphorus (group 15, common valency +3, like nitrogen) and fluorine (valency −1): balancing charges gives \\ce{PF3}.\n(f) Element 71 is lutetium (Lu), the last member of the lanthanoid series, with a common valency of +3 (like other group-3-like f-block metals); fluorine has valency −1: balancing charges gives \\ce{LuF3}.",
            },
            {
              kind: 'mcq',
              id: '66b808e0-e339-48a9-85d9-9eae1f3f4889',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.38',
              prompt:
                'Considering the elements B, Al, Mg, and K, the correct order of their metallic character is:\n(a) B > Al > Mg > K\n(b) Al > Mg > B > K\n(c) Mg > Al > K > B\n(d) K > Mg > Al > B',
              options: [
                'B > Al > Mg > K',
                'Al > Mg > B > K',
                'Mg > Al > K > B',
                'K > Mg > Al > B',
              ],
              correct_index: 3,
              explanation:
                "Metallic character increases down a group and decreases across a period, left to right. K (group 1, period 4) is the most metallic of these four — far left, far down. Mg (group 2, period 3) comes next. Al (group 13, period 3) is less metallic than Mg since it's further right in the same period. B (group 13, period 2) is the least metallic — it's a metalloid, sitting at the top of its group where metallic character is weakest. So the correct decreasing order is K > Mg > Al > B, option (d).",
            },
            {
              kind: 'mcq',
              id: '3fdbb1a1-a7bf-48af-942c-97cc1c1a65d7',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.39',
              prompt:
                'Considering the elements B, C, N, F, and Si, the correct order of their non-metallic character is:\n(a) B > C > Si > N > F\n(b) Si > C > B > N > F\n(c) F > N > C > B > Si\n(d) F > N > C > Si > B',
              options: [
                'B > C > Si > N > F',
                'Si > C > B > N > F',
                'F > N > C > B > Si',
                'F > N > C > Si > B',
              ],
              correct_index: 3,
              explanation:
                "Non-metallic character increases across a period (left to right) and decreases down a group. Within period 2, moving left to right (B → C → N → F), non-metallic character rises steadily, so F is the strongest non-metal here and B the weakest among the period-2 elements. Si sits directly below C in group 14, and since non-metallic character falls down a group, Si is less non-metallic than C — but Si is still more non-metallic than B, which is a metalloid at the very edge of the table with the weakest non-metallic character of this set. Putting it together: F > N > C > Si > B, option (d).",
            },
            {
              kind: 'mcq',
              id: '50aa6c39-202e-42a9-ac75-4983316c6881',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.40',
              prompt:
                'Considering the elements F, Cl, O and N, the correct order of their chemical reactivity in terms of oxidizing property is:\n(a) F > Cl > O > N\n(b) F > O > Cl > N\n(c) Cl > F > O > N\n(d) O > F > N > Cl',
              options: [
                'F > Cl > O > N',
                'F > O > Cl > N',
                'Cl > F > O > N',
                'O > F > N > Cl',
              ],
              correct_index: 1,
              explanation:
                "Oxidizing strength tracks electronegativity — the more strongly an element pulls electrons toward itself, the more readily it oxidizes (removes electrons from) something else. On the Pauling scale, F (≈4.0) is the strongest, followed by O (≈3.5), while Cl and N are close together (≈3.0). Between Cl and N, nitrogen's reactivity is held back by the very strong \\ce{N#N} triple bond in \\ce{N2}, which makes it kinetically very unreactive despite its respectable electronegativity — so in practice Cl is the more effective oxidizer of the two. Putting these together gives F > O > Cl > N, option (b).",
            },
          ],
        },
      ],
    },
  ],
};
