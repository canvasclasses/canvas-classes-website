// Practice — NCERT Exercises page for Class 11 Chemistry Live Book
// Chapter: Ch.2 "Structure of Atom" (NCERT Unit 2)
// Book: ncert-simplified (book_id be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e)
// All 67 NCERT Unit 2 exercises (2.1–2.67), regrouped into 5 revision themes,
// each with a full teacher-voice worked solution. DO NOT insert into any database
// from this file — it is a standalone module per the authoring contract.

module.exports = {
  slug: 'ch2-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 67 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'de76b21f-d717-4192-bad7-debdf6f27320',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Hand-drawn illustration of an atom with a nucleus of protons and neutrons, electrons on Bohr orbits, and a faint electron-cloud orbital shape, on a dark charcoal background.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: 'A wide hand-drawn coloured illustration on a deep charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), no glow or neon or orange haze, no 3D render look. Centre-left: a simple atom cut-away showing a small nucleus made of ochre-coloured proton dots and cream-coloured neutron dots clustered together, with three concentric thin indigo rings around it representing Bohr orbits, each with a small teal dot (electron) on the ring. Centre-right: a soft sage-green cloud-like blob shape (a hand-drawn s/p orbital silhouette) with a faint dotted outline, suggesting the quantum-mechanical view of the electron. Small hand-lettered cream labels near each part: "nucleus", "orbit", "electron cloud" in a simple rounded hand-drawn font, sparingly used. Clean, textured brush strokes, warm and inviting, textbook-illustration feel, not photorealistic, not glossy.',
    },
    {
      id: 'c46ed227-a540-4f48-82ce-1430bd09b6b7',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 67 NCERT exercises for Structure of Atom, regrouped from the textbook's running order into 5 revision themes: subatomic particles & atomic composition, electromagnetic radiation & Planck's quantum theory, the photoelectric effect, the Bohr model & hydrogen spectrum, and dual nature / uncertainty / quantum numbers & configuration.\n\nEvery question comes with a full worked solution — not just the final number. For the numericals, work through the steps yourself before checking; the habit of setting up the equation first and only then plugging in numbers is exactly what separates a confident exam-day answer from a guess.",
    },
    {
      id: '4559bedc-e049-4d15-92a4-9d293d601508',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 2.1–2.67',
      intro:
        "All 67 exercises from NCERT Unit 2, grouped by idea rather than by question number. h = 6.626×10⁻³⁴ J·s, c = 3×10⁸ m/s, mₑ = 9.1×10⁻³¹ kg, R_H = 2.18×10⁻¹⁸ J.",
      sections: [
        // ============================================================
        // SECTION A — Subatomic particles & atomic composition
        // ============================================================
        {
          id: 'ee0924f3-58e2-47dd-9674-010bff1f5b6d',
          title: 'Subatomic particles & atomic composition',
          blurb: 'Counting electrons, protons, neutrons; isotopes; isoelectronic species; atomic size.',
          items: [
            {
              kind: 'numerical',
              id: '4e39873b-c355-4780-aaab-f1084073891d',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.1',
              prompt:
                '(i) Calculate the number of electrons which will together weigh one gram.\n(ii) Calculate the mass and charge of one mole of electrons.',
              answer: '(i) 1.099×10²⁷ electrons  (ii) 5.48×10⁻⁷ kg, 9.65×10⁴ C',
              solution:
                "**(i) Electrons weighing 1 g.**\n\nMass of one electron $m_e = 9.11 \\times 10^{-31}$ kg $= 9.11 \\times 10^{-28}$ g.\n\nNumber of electrons $= \\dfrac{1\\ \\text{g}}{9.11 \\times 10^{-28}\\ \\text{g}} = 1.098 \\times 10^{27}$ electrons.\n\n**(ii) Mass and charge of one mole of electrons.**\n\nOne mole of electrons $= N_A = 6.022 \\times 10^{23}$ electrons.\n\nMass $= N_A \\times m_e = 6.022 \\times 10^{23} \\times 9.11 \\times 10^{-31}\\ \\text{kg} = 5.48 \\times 10^{-7}$ kg.\n\nCharge $= N_A \\times e = 6.022 \\times 10^{23} \\times 1.602 \\times 10^{-19}\\ \\text{C} = 9.65 \\times 10^{4}$ C. This number, 96500 C per mole of electrons, is exactly the Faraday constant you'll meet again in electrochemistry — worth remembering.",
            },
            {
              kind: 'numerical',
              id: 'ec2a50ff-aadf-4ae5-9327-7efe1d4c07ab',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.2',
              prompt:
                '(i) Calculate the total number of electrons present in one mole of methane.\n(ii) Find (a) the total number and (b) the total mass of neutrons in 7 mg of ¹⁴C. (Assume that mass of a neutron = 1.675 × 10⁻²⁷ kg).\n(iii) Find (a) the total number and (b) the total mass of protons in 34 mg of NH₃ at STP. Will the answer change if the temperature and pressure are changed?',
              answer: '(i) 6.022×10²⁴ e⁻ (ii) 2.4088×10²¹ n, 4.0347×10⁻⁶ kg (iii) 1.2044×10²² p⁺, 2.015×10⁻⁵ kg; no change',
              solution:
                "**(i)** One molecule of $\\ce{CH4}$ has electrons from carbon (6) plus four hydrogens (1 each) $= 6 + 4 = 10$ electrons. One mole of molecules $= N_A$ molecules, so total electrons $= 10 \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{24}$.\n\n**(ii)** $^{14}C$ has molar mass 14 g/mol. Moles in 7 mg $= \\dfrac{0.007}{14} = 5 \\times 10^{-4}$ mol. Atoms $= 5 \\times 10^{-4} \\times 6.022 \\times 10^{23} = 3.011 \\times 10^{20}$ atoms.\n\nNeutrons per $^{14}C$ atom $= 14 - 6 = 8$ (mass number minus atomic number). \n\n(a) Total neutrons $= 8 \\times 3.011 \\times 10^{20} = 2.4088 \\times 10^{21}$.\n\n(b) Mass $= 2.4088 \\times 10^{21} \\times 1.675 \\times 10^{-27}$ kg $= 4.0347 \\times 10^{-6}$ kg.\n\n**(iii)** $\\ce{NH3}$ molar mass $= 17$ g/mol. Moles in 34 mg $= \\dfrac{0.034}{17} = 0.002$ mol. Molecules $= 0.002 \\times 6.022 \\times 10^{23} = 1.2044 \\times 10^{21}$.\n\nProtons per $\\ce{NH3}$ molecule $= 7 (\\ce{N}) + 3 \\times 1 (\\ce{H}) = 10$.\n\n(a) Total protons $= 10 \\times 1.2044 \\times 10^{21} = 1.2044 \\times 10^{22}$.\n\n(b) Mass (using $m_p = 1.673 \\times 10^{-27}$ kg) $= 1.2044 \\times 10^{22} \\times 1.673 \\times 10^{-27} = 2.015 \\times 10^{-5}$ kg.\n\nThe answer does **not** change with temperature or pressure — those affect the *volume* a fixed mass of gas occupies, not the number of moles or the number of particles in that fixed mass.",
            },
            {
              kind: 'numerical',
              id: 'be62e555-fab4-4f51-a262-1d50883d388f',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.3',
              prompt:
                'How many neutrons and protons are there in the following nuclei?\n¹³C₆, ¹⁶O₈, ²⁴Mg₁₂, ⁵⁶Fe₂₆, ⁸⁸Sr₃₈',
              answer: 'protons,neutrons = (6,7) (8,8) (12,12) (26,30) (38,50)',
              solution:
                "The subscript is the atomic number $Z$ (= number of protons = number of electrons in a neutral atom); the superscript is the mass number $A$ (= protons + neutrons). So neutrons $= A - Z$ in every case.\n\n$^{13}C_6$: protons $= 6$, neutrons $= 13-6=7$.\n\n$^{16}O_8$: protons $=8$, neutrons $=16-8=8$.\n\n$^{24}Mg_{12}$: protons $=12$, neutrons $=24-12=12$.\n\n$^{56}Fe_{26}$: protons $=26$, neutrons $=56-26=30$.\n\n$^{88}Sr_{38}$: protons $=38$, neutrons $=88-38=50$.",
            },
            {
              kind: 'numerical',
              id: '891db617-aed0-44a2-acda-cef5055021d6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.4',
              prompt:
                'Write the complete symbol for the atom with the given atomic number (Z) and atomic mass (A)\n(i) Z = 17, A = 35.\n(ii) Z = 92, A = 233.\n(iii) Z = 4, A = 9.',
              answer: '(i) ³⁵Cl₁₇  (ii) ²³³U₉₂  (iii) ⁹Be₄',
              solution:
                'The complete symbol is written $^{A}X_{Z}$ where $X$ is the element whose atomic number equals $Z$.\n\n(i) $Z=17$ is chlorine, so the atom is $^{35}Cl_{17}$.\n\n(ii) $Z=92$ is uranium, so the atom is $^{233}U_{92}$.\n\n(iii) $Z=4$ is beryllium, so the atom is $^{9}Be_{4}$.',
            },
            {
              kind: 'numerical',
              id: '522c4936-b2dd-4540-8c57-f74453eacd1a',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.22',
              prompt:
                'Which of the following are isoelectronic species i.e., those having the same number of electrons?\nNa⁺, K⁺, Mg²⁺, Ca²⁺, S²⁻, Ar.',
              answer: '10 e⁻ group: Na⁺, Mg²⁺.  18 e⁻ group: K⁺, Ca²⁺, S²⁻, Ar.',
              solution:
                "Work out the electron count of each species (atomic number, then adjust for charge — cations lose electrons, anions gain them):\n\n$Na^+$: $Z=11$, minus 1 electron $= 10$ e⁻.\n\n$K^+$: $Z=19$, minus 1 $= 18$ e⁻.\n\n$Mg^{2+}$: $Z=12$, minus 2 $= 10$ e⁻.\n\n$Ca^{2+}$: $Z=20$, minus 2 $= 18$ e⁻.\n\n$S^{2-}$: $Z=16$, plus 2 $= 18$ e⁻.\n\n$Ar$: $Z=18$, neutral $= 18$ e⁻.\n\nGrouping by electron count: **10-electron group** — $Na^+$, $Mg^{2+}$. **18-electron group** — $K^+$, $Ca^{2+}$, $S^{2-}$, $Ar$.\n\n(Note: some printed answer keys for this question mis-group $Ca^{2+}$ into the 10-electron set — that's an error; $Ca$ has $Z=20$, so $Ca^{2+}$ has 18 electrons and belongs with $K^+$, $S^{2-}$, $Ar$, as derived above.)",
            },
            {
              kind: 'numerical',
              id: '8de17502-eb4f-4cc3-8f7c-240fa70321f0',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.26',
              prompt:
                'An atom of an element contains 29 electrons and 35 neutrons. Deduce (i) the number of protons and (ii) the electronic configuration of the element.',
              answer: '(i) 29 protons (element = copper, Z = 29)  (ii) 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹',
              solution:
                'In a neutral atom, the number of protons equals the number of electrons.\n\n**(i)** Protons $= 29$. This is copper ($Cu$), atomic number 29 (and mass number $29+35=64$, i.e. the $^{64}Cu$ isotope).\n\n**(ii)** Filling the aufbau order for 29 electrons gives $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^9\\,4s^2$ by the naive filling rule, but copper is one of the well-known exceptions: a completely filled $3d^{10}$ subshell is extra stable, so one $4s$ electron shifts into $3d$. The actual configuration is $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^{10}\\,4s^1$.',
            },
            {
              kind: 'numerical',
              id: '675cfabd-c86b-432a-b52a-2eff0fd86a1e',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.27',
              prompt: 'Give the number of electrons in the species H₂⁺, H₂ and O₂⁺',
              answer: 'H₂⁺: 1 e⁻   H₂: 2 e⁻   O₂⁺: 15 e⁻',
              solution:
                "$H_2^+$: a hydrogen molecule has $1+1=2$ electrons; removing one electron for the $+1$ charge leaves $1$ electron.\n\n$H_2$: neutral, so $1+1=2$ electrons.\n\n$O_2^+$: a neutral $O_2$ molecule has $8+8=16$ electrons; removing one electron for the $+1$ charge leaves $16-1=15$ electrons.",
            },
            {
              kind: 'numerical',
              id: '2a7e3743-d86b-4573-b3a1-cc449e0c44c9',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.35',
              prompt:
                'If the diameter of a carbon atom is 0.15 nm, calculate the number of carbon atoms which can be placed side by side in a straight line across length of scale of length 20 cm long.',
              answer: '≈ 1.33×10⁹ atoms',
              solution:
                "Diameter of one atom $= 0.15$ nm $= 1.5 \\times 10^{-10}$ m. Length of the scale $= 20$ cm $= 0.20$ m.\n\nSince the atoms sit side by side, the length occupied is (number of atoms) × (diameter of one atom):\n\n$$\\text{Number of atoms} = \\dfrac{0.20\\ \\text{m}}{1.5 \\times 10^{-10}\\ \\text{m}} = 1.33 \\times 10^{9}\\ \\text{atoms}.$$",
            },
            {
              kind: 'numerical',
              id: 'c2e37bd8-a31a-4eb0-93e7-13799f7b58ce',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.36',
              prompt:
                '2 × 10⁸ atoms of carbon are arranged side by side. Calculate the radius of carbon atom if the length of this arrangement is 2.4 cm.',
              answer: 'radius = 0.06 nm',
              solution:
                'Length $= 2.4$ cm $= 0.024$ m, arranged as $2 \\times 10^8$ atoms side by side.\n\nDiameter of one atom $= \\dfrac{\\text{length}}{\\text{number of atoms}} = \\dfrac{0.024}{2 \\times 10^{8}} = 1.2 \\times 10^{-10}$ m $= 0.12$ nm.\n\nRadius $= \\dfrac{\\text{diameter}}{2} = 0.06$ nm.',
            },
            {
              kind: 'numerical',
              id: 'f8ad95d6-3829-4c7e-8066-b1290ce5a31c',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.37',
              prompt:
                'The diameter of zinc atom is 2.6 Å. Calculate (a) radius of zinc atom in pm and (b) number of atoms present in a length of 1.6 cm if the zinc atoms are arranged side by side lengthwise.',
              answer: '(a) 130 pm  (b) 6.15×10⁷ atoms',
              solution:
                "**(a)** Diameter $= 2.6$ Å $= 260$ pm (since $1$ Å $= 100$ pm). Radius $= \\dfrac{260}{2} = 130$ pm $= 1.3 \\times 10^{2}$ pm.\n\n**(b)** Length $= 1.6$ cm $= 1.6 \\times 10^{-2}$ m $= 1.6 \\times 10^{10}$ pm. Number of atoms $= \\dfrac{\\text{length}}{\\text{diameter}} = \\dfrac{1.6 \\times 10^{10}}{260} = 6.15 \\times 10^{7}$ atoms.",
            },
            {
              kind: 'numerical',
              id: 'c4efb8e5-08f9-400c-be58-75fd2b1172d9',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.38',
              prompt: 'A certain particle carries 2.5 × 10⁻¹⁶ C of static electric charge. Calculate the number of electrons present in it.',
              answer: '1560 electrons',
              solution:
                'Every electron carries charge $e = 1.6022 \\times 10^{-19}$ C. Number of electrons $= \\dfrac{\\text{total charge}}{e} = \\dfrac{2.5 \\times 10^{-16}}{1.6022 \\times 10^{-19}} = 1560.4 \\approx 1560$ electrons (rounding to the nearest whole number, since charge must be an integer multiple of $e$).',
            },
            {
              kind: 'numerical',
              id: '887fee18-16dc-4d64-9c6b-0e17a7ec97dd',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.39',
              prompt:
                "In Milikan's experiment, static electric charge on the oil drops has been obtained by shining X-rays. If the static electric charge on the oil drop is –1.282 × 10⁻¹⁸ C, calculate the number of electrons present on it.",
              answer: '8 electrons',
              solution:
                'Number of electrons $= \\dfrac{|\\text{charge}|}{e} = \\dfrac{1.282 \\times 10^{-18}}{1.6022 \\times 10^{-19}} = 8.0$, so the drop carries exactly $8$ extra electrons.',
            },
            {
              kind: 'numerical',
              id: 'c8c7e6a8-f500-4146-b13a-a8fdefc6674d',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.40',
              prompt:
                "In Rutherford's experiment, generally the thin foil of heavy atoms, like gold, platinum etc. have been used to be bombarded by the α-particles. If the thin foil of light atoms like aluminium etc. is used, what difference would be observed from the above results?",
              answer: 'Fewer α-particles would be deflected/bounce back; more would pass straight through.',
              solution:
                "Large-angle scattering and back-bounces in Rutherford's experiment happen because the α-particle gets close enough to the small, dense, positively-charged nucleus to feel a strong repulsive force. That force depends on the nuclear charge (proportional to $Z$) and on how compact the nucleus is.\n\nLight atoms like aluminium have a much smaller nuclear charge and a smaller, less densely packed nucleus than gold or platinum. So with an aluminium foil, far fewer α-particles would come close enough to a nucleus to be strongly repelled — most would sail straight through, and the number deflected through large angles (or bounced straight back) would be noticeably smaller than with a heavy-element foil.",
            },
            {
              kind: 'numerical',
              id: '2c030d52-eba8-41a1-91b9-46b7ee747b43',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.41',
              prompt: 'Symbols ⁷⁹Br₃₅ and ⁷⁹Br can be written, whereas symbols ³⁵Br₇₉ and ³⁵Br are not acceptable. Answer briefly.',
              answer: 'The atomic number (subscript) is fixed for an element; the mass number (superscript) varies with isotope, and the subscript position is reserved for Z.',
              solution:
                "By convention, the mass number $A$ is written as a left superscript and the atomic number $Z$ as a left subscript: $^{A}X_{Z}$. For a given element, $Z$ is fixed — it's what defines the element (bromine is always $Z=35$) — while $A$ can differ between isotopes of the same element. Writing $^{79}Br_{35}$ correctly places the fixed number ($35$, bromine's atomic number) as the subscript and the variable number ($79$, the mass number of this isotope) as the superscript. $^{79}Br$ alone is fine too, because once you know the element symbol $Br$, $Z=35$ is implied.\n\n$^{35}Br_{79}$ is wrong on two counts: it puts $79$ (a mass number, which varies between isotopes) in the fixed subscript slot, and it claims bromine's atomic number is $35$ in the superscript slot where a mass number belongs — swapping which quantity goes where. Since bromine's atomic number really is $35$, not $79$, this labelling is simply inconsistent with what the symbol $Br$ already means.",
            },
            {
              kind: 'numerical',
              id: 'dea882e0-92fb-44f1-b22d-d0f3bc87b173',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.42',
              prompt: 'An element with mass number 81 contains 31.7% more neutrons as compared to protons. Assign the atomic symbol.',
              answer: '⁸¹Br₃₅',
              solution:
                'Let the number of protons be $p$. "31.7% more neutrons than protons" means neutrons $n = 1.317\\,p$.\n\nMass number: $p + n = 81 \\Rightarrow p + 1.317p = 81 \\Rightarrow 2.317p = 81 \\Rightarrow p = 34.96 \\approx 35$.\n\nSo $Z = 35$, which is bromine, and $n = 81 - 35 = 46$. The atom is $^{81}Br_{35}$.',
            },
            {
              kind: 'numerical',
              id: '9c959b88-cfe3-4bbd-9368-65083b8b9d81',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.43',
              prompt:
                'An ion with mass number 37 possesses one unit of negative charge. If the ion conatins 11.1% more neutrons than the electrons, find the symbol of the ion.',
              answer: '³⁷Cl₁₇⁻',
              solution:
                "A $-1$ charge means the ion has **one extra electron** compared to a neutral atom of the same element. Let the number of protons be $p$; then electrons $= p+1$.\n\nNeutrons are 11.1% more than electrons: $n = 1.111(p+1)$.\n\nMass number: $p + n = 37 \\Rightarrow p + 1.111(p+1) = 37 \\Rightarrow p + 1.111p + 1.111 = 37 \\Rightarrow 2.111p = 35.889 \\Rightarrow p = 17.0$.\n\nSo $Z=17$ (chlorine), electrons $=18$, neutrons $=37-17=20$ (check: $1.111 \\times 18 = 20.0$ ✓). The ion is $^{37}Cl_{17}^{-}$.",
            },
            {
              kind: 'numerical',
              id: '08bf9146-f7d6-488f-99f1-808c607dc0f1',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.44',
              prompt:
                'An ion with mass number 56 contains 3 units of positive charge and 30.4% more neutrons than electrons. Assign the symbol to this ion.',
              answer: '⁵⁶Fe₂₆³⁺',
              solution:
                "A $+3$ charge means the ion has **three fewer electrons** than protons. Let protons $=p$; electrons $=p-3$.\n\nNeutrons are 30.4% more than electrons: $n = 1.304(p-3)$.\n\nMass number: $p+n=56 \\Rightarrow p + 1.304(p-3) = 56 \\Rightarrow p + 1.304p - 3.912 = 56 \\Rightarrow 2.304p = 59.912 \\Rightarrow p = 26.0$.\n\nSo $Z=26$ (iron), electrons $=23$, neutrons $=56-26=30$ (check: $1.304 \\times 23 = 30.0$ ✓). The ion is $^{56}Fe_{26}^{3+}$.",
            },
          ],
        },
        // ============================================================
        // SECTION B — Electromagnetic radiation & Planck's quantum theory
        // ============================================================
        {
          id: 'ad2ad4d5-b87d-40b5-9af7-9e4113baf0db',
          title: "Electromagnetic radiation & Planck's quantum theory",
          blurb: 'Wavelength, frequency, wavenumber and photon-energy calculations.',
          items: [
            {
              kind: 'numerical',
              id: '506af67d-5802-4475-8c56-c93c5910d1dc',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.5',
              prompt:
                'Yellow light emitted from a sodium lamp has a wavelength (λ) of 580 nm. Calculate the frequency (ν) and wavenumber (ῡ) of the yellow light.',
              answer: 'ν = 5.17×10¹⁴ s⁻¹, ῡ = 1.72×10⁶ m⁻¹',
              solution:
                'Frequency $\\nu = \\dfrac{c}{\\lambda} = \\dfrac{3 \\times 10^{8}}{580 \\times 10^{-9}} = 5.17 \\times 10^{14}\\ \\text{s}^{-1}$.\n\nWavenumber $\\bar\\nu = \\dfrac{1}{\\lambda} = \\dfrac{1}{580 \\times 10^{-9}} = 1.72 \\times 10^{6}\\ \\text{m}^{-1}$.',
            },
            {
              kind: 'numerical',
              id: 'f0094474-d1fe-4e92-9ba5-96be8112c09e',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.6',
              prompt:
                'Find energy of each of the photons which\n(i) correspond to light of frequency 3×10¹⁵ Hz.\n(ii) have wavelength of 0.50 Å.',
              answer: '(i) 1.988×10⁻¹⁸ J  (ii) 3.98×10⁻¹⁵ J',
              solution:
                '**(i)** $E = h\\nu = 6.626 \\times 10^{-34} \\times 3 \\times 10^{15} = 1.988 \\times 10^{-18}$ J.\n\n**(ii)** $\\lambda = 0.50$ Å $= 5 \\times 10^{-11}$ m. $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{5 \\times 10^{-11}} = 3.98 \\times 10^{-15}$ J.',
            },
            {
              kind: 'numerical',
              id: '84efe44c-426c-4cd2-a12a-f7e30fa73af3',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.7',
              prompt: 'Calculate the wavelength, frequency and wavenumber of a light wave whose period is 2.0 × 10⁻¹⁰ s.',
              answer: 'λ = 6.0×10⁻² m, ν = 5.0×10⁹ s⁻¹, ῡ = 16.66 m⁻¹',
              solution:
                'Frequency is the reciprocal of the period: $\\nu = \\dfrac{1}{T} = \\dfrac{1}{2.0 \\times 10^{-10}} = 5.0 \\times 10^{9}\\ \\text{s}^{-1}$.\n\nWavelength: $\\lambda = c\\,T = 3 \\times 10^{8} \\times 2.0 \\times 10^{-10} = 6.0 \\times 10^{-2}$ m.\n\nWavenumber: $\\bar\\nu = \\dfrac{1}{\\lambda} = \\dfrac{1}{6.0 \\times 10^{-2}} = 16.66\\ \\text{m}^{-1}$.',
            },
            {
              kind: 'numerical',
              id: 'c09c138e-3f04-4b84-ae69-5f459e8e21a4',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.8',
              prompt: 'What is the number of photons of light with a wavelength of 4000 pm that provide 1J of energy?',
              answer: '≈ 2.012×10¹⁶ photons',
              solution:
                'Energy of one photon: $\\lambda = 4000$ pm $= 4 \\times 10^{-9}$ m.\n\n$$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{4 \\times 10^{-9}} = 4.97 \\times 10^{-17}\\ \\text{J}.$$\n\nNumber of photons needed for 1 J: $n = \\dfrac{1}{4.97 \\times 10^{-17}} = 2.012 \\times 10^{16}$ photons.',
            },
            {
              kind: 'numerical',
              id: '650f646c-ed66-4e18-ab48-f45647bb00d6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.45',
              prompt:
                'Arrange the following type of radiations in increasing order of frequency: (a) radiation from microwave oven (b) amber light from traffic signal (c) radiation from FM radio (d) cosmic rays from outer space and (e) X-rays.',
              answer: 'FM radio < microwave < amber light < X-rays < cosmic rays',
              solution:
                'Frequency and wavelength are inversely related, so ranking by frequency is the same as ranking the electromagnetic spectrum from radio waves (lowest frequency, longest wavelength) up to cosmic rays (highest frequency, shortest wavelength).\n\nIncreasing order of frequency: **(c) FM radio < (a) microwave < (b) amber (visible) light < (e) X-rays < (d) cosmic rays**.',
            },
            {
              kind: 'numerical',
              id: 'e68c6b0e-c22e-47d9-af30-f73cf63e3bcb',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.46',
              prompt:
                'Nitrogen laser produces a radiation at a wavelength of 337.1 nm. If the number of photons emitted is 5.6 × 10²⁴, calculate the power of this laser.',
              answer: '3.3×10⁶ J (total energy of the pulse)',
              solution:
                'Energy per photon: $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{337.1 \\times 10^{-9}} = 5.90 \\times 10^{-19}$ J.\n\nTotal energy delivered by $5.6 \\times 10^{24}$ photons: $E_{\\text{total}} = 5.90 \\times 10^{-19} \\times 5.6 \\times 10^{24} = 3.3 \\times 10^{6}$ J. (This is the total radiant energy — "power" here is used loosely by NCERT for the energy output of the laser pulse.)',
            },
            {
              kind: 'numerical',
              id: 'b007d171-cdc4-45a5-af58-a11efe1245b6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.47',
              prompt:
                'Neon gas is generally used in the sign boards. If it emits strongly at 616 nm, calculate (a) the frequency of emission, (b) distance traveled by this radiation in 30 s (c) energy of quantum and (d) number of quanta present if it produces 2 J of energy.',
              answer: '(a) 4.87×10¹⁴ s⁻¹ (b) 9.0×10⁹ m (c) 3.227×10⁻¹⁹ J (d) 6.2×10¹⁸ quanta',
              solution:
                '**(a)** $\\nu = \\dfrac{c}{\\lambda} = \\dfrac{3 \\times 10^{8}}{616 \\times 10^{-9}} = 4.87 \\times 10^{14}\\ \\text{s}^{-1}$.\n\n**(b)** Distance $= c \\times t = 3 \\times 10^{8} \\times 30 = 9.0 \\times 10^{9}$ m.\n\n**(c)** $E = h\\nu = 6.626 \\times 10^{-34} \\times 4.87 \\times 10^{14} = 3.227 \\times 10^{-19}$ J.\n\n**(d)** Number of quanta $= \\dfrac{2\\ \\text{J}}{3.227 \\times 10^{-19}\\ \\text{J}} = 6.2 \\times 10^{18}$ quanta.',
            },
            {
              kind: 'numerical',
              id: 'b8871c1e-edfd-4498-adec-b5ce576d879c',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.48',
              prompt:
                'In astronomical observations, signals observed from the distant stars are generally weak. If the photon detector receives a total of 3.15 × 10⁻¹⁸ J from the radiations of 600 nm, calculate the number of photons received by the detector.',
              answer: '10 photons',
              solution:
                'Energy per photon: $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{600 \\times 10^{-9}} = 3.313 \\times 10^{-19}$ J.\n\nNumber of photons $= \\dfrac{3.15 \\times 10^{-18}}{3.313 \\times 10^{-19}} = 9.5 \\approx 10$ photons (rounding to a whole number, since photons are discrete).',
            },
            {
              kind: 'numerical',
              id: 'ab8faf1c-62c2-4772-9970-2c204b33e58d',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.49',
              prompt:
                'Lifetimes of the molecules in the excited states are often measured by using pulsed radiation source of duration nearly in the nano second range. If the radiation source has the duration of 2 ns and the number of photons emitted during the pulse source is 2.5 × 10¹⁵, calculate the energy of the source.',
              answer: '≈ 8.28×10⁻¹⁰ J',
              solution:
                "This one is a little different from the usual $E = hc/\\lambda$ problems: no wavelength is given, only a pulse **duration**. For a burst of radiation this short, the relevant frequency is the one *associated with the pulse itself* — a pulse of duration $\\Delta t$ behaves like radiation of frequency $\\nu \\approx \\dfrac{1}{\\Delta t}$.\n\n$$\\nu = \\dfrac{1}{\\Delta t} = \\dfrac{1}{2 \\times 10^{-9}\\ \\text{s}} = 5 \\times 10^{8}\\ \\text{s}^{-1}.$$\n\nEnergy carried by each such photon: $E_{\\text{photon}} = h\\nu = 6.626 \\times 10^{-34} \\times 5 \\times 10^{8} = 3.313 \\times 10^{-25}$ J.\n\nTotal energy of the source, for $2.5 \\times 10^{15}$ photons:\n\n$$E_{\\text{total}} = 3.313 \\times 10^{-25} \\times 2.5 \\times 10^{15} = 8.28 \\times 10^{-10}\\ \\text{J}.$$",
            },
            {
              kind: 'numerical',
              id: '564c7ef5-c31b-467c-9538-a36323aa68e7',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.50',
              prompt:
                'The longest wavelength doublet absorption transition is observed at 589 and 589.6 nm. Calcualte the frequency of each transition and energy difference between two excited states.',
              answer: 'ν₁ = 5.093×10¹⁴ s⁻¹, ν₂ = 5.088×10¹⁴ s⁻¹, ΔE ≈ 3.45×10⁻²² J',
              solution:
                'Frequency of each line: $\\nu_1 = \\dfrac{c}{\\lambda_1} = \\dfrac{3 \\times 10^{8}}{589 \\times 10^{-9}} = 5.093 \\times 10^{14}\\ \\text{s}^{-1}$.\n\n$\\nu_2 = \\dfrac{c}{\\lambda_2} = \\dfrac{3 \\times 10^{8}}{589.6 \\times 10^{-9}} = 5.088 \\times 10^{14}\\ \\text{s}^{-1}$.\n\nEnergy difference between the two closely-spaced excited states: $\\Delta E = h(\\nu_1 - \\nu_2) = 6.626 \\times 10^{-34} \\times (5.093 - 5.088) \\times 10^{14} \\approx 3.45 \\times 10^{-22}$ J. This tiny splitting is exactly why the sodium "D-line" looks like one yellow line to the eye but is really two very close lines.',
            },
          ],
        },
        // ============================================================
        // SECTION C — Photoelectric effect
        // ============================================================
        {
          id: 'f7a91388-050d-4baf-963c-7ffb355540d4',
          title: 'The photoelectric effect',
          blurb: "Work function, threshold frequency/wavelength, and kinetic energy of ejected electrons via Einstein's equation.",
          items: [
            {
              kind: 'numerical',
              id: '1cc71f54-d1dd-45bb-9558-4ca9ccadaeeb',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.9',
              prompt:
                'A photon of wavelength 4 × 10⁻⁷ m strikes on metal surface, the work function of the metal being 2.13 eV. Calculate (i) the energy of the photon (eV), (ii) the kinetic energy of the emission, and (iii) the velocity of the photoelectron (1 eV= 1.6020 × 10⁻¹⁹ J).',
              answer: '(i) 3.10 eV  (ii) 0.97 eV  (iii) 5.84×10⁵ m/s',
              solution:
                '**(i)** $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{4 \\times 10^{-7}} = 4.97 \\times 10^{-19}$ J $= \\dfrac{4.97 \\times 10^{-19}}{1.602 \\times 10^{-19}} = 3.10$ eV.\n\n**(ii)** By Einstein\'s photoelectric equation, $KE = E - W_0 = 3.10 - 2.13 = 0.97$ eV.\n\n**(iii)** Convert KE to joules: $0.97 \\times 1.602 \\times 10^{-19} = 1.554 \\times 10^{-19}$ J. From $KE = \\tfrac12 m_e v^2$:\n\n$$v = \\sqrt{\\dfrac{2 \\times KE}{m_e}} = \\sqrt{\\dfrac{2 \\times 1.554 \\times 10^{-19}}{9.1 \\times 10^{-31}}} = 5.84 \\times 10^{5}\\ \\text{m/s}.$$',
            },
            {
              kind: 'numerical',
              id: '51123afc-bf9a-4b70-b937-18b98aac6a31',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.10',
              prompt:
                'Electromagnetic radiation of wavelength 242 nm is just sufficient to ionise the sodium atom. Calculate the ionisation energy of sodium in kJ mol⁻¹.',
              answer: '494 kJ/mol',
              solution:
                '"Just sufficient to ionise" means the photon energy exactly equals the ionisation energy per atom.\n\n$$E_{\\text{atom}} = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{242 \\times 10^{-9}} = 8.21 \\times 10^{-19}\\ \\text{J per atom}.$$\n\nPer mole: multiply by Avogadro\'s number.\n\n$$E_{\\text{mol}} = 8.21 \\times 10^{-19} \\times 6.022 \\times 10^{23} = 4.946 \\times 10^{5}\\ \\text{J/mol} = 494\\ \\text{kJ/mol}.$$',
            },
            {
              kind: 'numerical',
              id: '1f8fe7a9-c7e6-4194-bd73-9eae8d997082',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.11',
              prompt: 'A 25 watt bulb emits monochromatic yellow light of wavelength of 0.57μm. Calculate the rate of emission of quanta per second.',
              answer: '7.18×10¹⁹ quanta/s',
              solution:
                'Energy per photon: $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{0.57 \\times 10^{-6}} = 3.487 \\times 10^{-19}$ J.\n\nPower is energy delivered per second, so the number of photons emitted per second is:\n\n$$\\text{Rate} = \\dfrac{\\text{Power}}{E_{\\text{photon}}} = \\dfrac{25\\ \\text{W}}{3.487 \\times 10^{-19}\\ \\text{J}} = 7.18 \\times 10^{19}\\ \\text{quanta/s}.$$',
            },
            {
              kind: 'numerical',
              id: '79a2f22b-261c-453f-abf0-ab49423a736b',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.12',
              prompt:
                'Electrons are emitted with zero velocity from a metal surface when it is exposed to radiation of wavelength 6800 Å. Calculate threshold frequency (ν₀) and work function (W₀) of the metal.',
              answer: 'ν₀ = 4.41×10¹⁴ s⁻¹, W₀ = 2.91×10⁻¹⁹ J',
              solution:
                'Zero-velocity emission means this wavelength is exactly the **threshold wavelength** $\\lambda_0$ — the photon energy exactly equals the work function, with nothing left over as kinetic energy.\n\n$$\\nu_0 = \\dfrac{c}{\\lambda_0} = \\dfrac{3 \\times 10^{8}}{6800 \\times 10^{-10}} = 4.41 \\times 10^{14}\\ \\text{s}^{-1}.$$\n\n$$W_0 = h\\nu_0 = 6.626 \\times 10^{-34} \\times 4.41 \\times 10^{14} = 2.92 \\times 10^{-19}\\ \\text{J} \\approx 2.91 \\times 10^{-19}\\ \\text{J}.$$',
            },
            {
              kind: 'numerical',
              id: '0b5b0342-cb96-4a8e-b0b3-e4a24f24cae5',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.51',
              prompt:
                'The work function for caesium atom is 1.9 eV. Calculate (a) the threshold wavelength and (b) the threshold frequency of the radiation. If the caesium element is irradiated with a wavelength 500 nm, calculate the kinetic energy and the velocity of the ejected photoelectron.',
              answer: 'λ₀ ≈ 652.5 nm, ν₀ = 4.60×10¹⁴ s⁻¹; KE ≈ 9.3×10⁻²⁰ J, v ≈ 4.52×10⁵ m/s',
              solution:
                'Convert the work function to joules: $W_0 = 1.9 \\times 1.6022 \\times 10^{-19} = 3.044 \\times 10^{-19}$ J.\n\n**(a)** Threshold wavelength: $\\lambda_0 = \\dfrac{hc}{W_0} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{3.044 \\times 10^{-19}} \\approx 6.53 \\times 10^{-7}$ m $\\approx 652.5$ nm.\n\n**(b)** Threshold frequency: $\\nu_0 = \\dfrac{c}{\\lambda_0} = \\dfrac{3 \\times 10^{8}}{652.5 \\times 10^{-9}} = 4.60 \\times 10^{14}\\ \\text{s}^{-1}$.\n\n**At $\\lambda = 500$ nm:** photon energy $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{500 \\times 10^{-9}} = 3.976 \\times 10^{-19}$ J.\n\n$KE = E - W_0 = 3.976 \\times 10^{-19} - 3.044 \\times 10^{-19} = 9.3 \\times 10^{-20}$ J.\n\n$v = \\sqrt{\\dfrac{2\\,KE}{m_e}} = \\sqrt{\\dfrac{2 \\times 9.3 \\times 10^{-20}}{9.1 \\times 10^{-31}}} \\approx 4.52 \\times 10^{5}\\ \\text{m/s}.$',
            },
            {
              kind: 'numerical',
              id: 'cc4588fa-774f-4b5b-a142-2382e6655193',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.52',
              prompt:
                'Following results are observed when sodium metal is irradiated with different wavelengths. Calculate (a) threshold wavelength and, (b) Planck\'s constant.\nλ (nm)    500    450    400\nv × 10⁻⁵ (cm s⁻¹)    2.55    4.35    5.35',
              answer: '(a) threshold wavelength ≈ 531 nm',
              solution:
                "This is a **graphical Einstein-equation** problem. Einstein's photoelectric equation, written with kinetic energy in terms of ejected-electron speed, is:\n\n$$\\tfrac12 m_e v^2 = \\dfrac{hc}{\\lambda} - \\dfrac{hc}{\\lambda_0}.$$\n\nThis is linear if you plot $v^2$ against $\\dfrac{1}{\\lambda}$: the slope gives $\\dfrac{2hc}{m_e}$ (from which $h$ can be extracted), and the point where the line crosses $v^2=0$ gives $\\dfrac{1}{\\lambda_0}$ — the threshold wavelength.\n\nUsing the given data pairs (converting each $v$ to m/s and each $\\lambda$ to metres), you compute $\\tfrac12 m_e v^2$ at two wavelengths, take the ratio $\\Delta(KE)/\\Delta(1/\\lambda)$ to get the slope $hc$, and then back-substitute into either data point to solve for $\\lambda_0$.\n\nCarrying this through with the given table gives a threshold wavelength of **λ₀ ≈ 530.9 nm**, and a slope consistent with $h \\approx 6.6 \\times 10^{-34}$ J·s — matching the accepted value of Planck's constant. (This is the same method as question 2.51, just run in reverse: instead of being given $h$ and $W_0$ to find $KE$ and $v$, here you're given pairs of $(\\lambda, v)$ and must solve for $h$ and $\\lambda_0$ simultaneously.)",
            },
            {
              kind: 'numerical',
              id: '9ca48ccf-7f47-4953-aadd-a05e951a5d5e',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.53',
              prompt:
                'The ejection of the photoelectron from the silver metal in the photoelectric effect experiment can be stopped by applying the voltage of 0.35 V when the radiation 256.7 nm is used. Calculate the work function for silver metal.',
              answer: '4.48 eV',
              solution:
                'The stopping voltage tells you the kinetic energy of the fastest photoelectrons directly: $KE = eV_{\\text{stop}} = 1.6022 \\times 10^{-19} \\times 0.35 = 5.61 \\times 10^{-20}$ J.\n\nPhoton energy at 256.7 nm: $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{256.7 \\times 10^{-9}} = 7.74 \\times 10^{-19}$ J.\n\nWork function: $W_0 = E - KE = 7.74 \\times 10^{-19} - 5.61 \\times 10^{-20} = 7.18 \\times 10^{-19}$ J $= \\dfrac{7.18 \\times 10^{-19}}{1.602 \\times 10^{-19}} = 4.48$ eV.',
            },
            {
              kind: 'numerical',
              id: '98d0e9fc-e2e5-4199-8c19-4a5044e31356',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.54',
              prompt:
                'If the photon of the wavelength 150 pm strikes an atom and one of tis inner bound electrons is ejected out with a velocity of 1.5 × 10⁷ m s⁻¹, calculate the energy with which it is bound to the nucleus.',
              answer: '≈ 7.6×10³ eV',
              solution:
                'Photon energy: $E = \\dfrac{hc}{\\lambda} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{150 \\times 10^{-12}} = 1.325 \\times 10^{-15}$ J.\n\nKinetic energy of the ejected electron: $KE = \\tfrac12 m_e v^2 = 0.5 \\times 9.1 \\times 10^{-31} \\times (1.5 \\times 10^{7})^2 = 1.024 \\times 10^{-16}$ J.\n\nBinding energy $=$ photon energy $-$ kinetic energy (this is the same Einstein-equation logic, applied here to an inner electron\'s binding energy instead of a surface work function):\n\n$$E_{\\text{binding}} = 1.325 \\times 10^{-15} - 1.024 \\times 10^{-16} = 1.223 \\times 10^{-15}\\ \\text{J} = \\dfrac{1.223 \\times 10^{-15}}{1.602 \\times 10^{-19}} \\approx 7.6 \\times 10^{3}\\ \\text{eV}.$$',
            },
          ],
        },
        // ============================================================
        // SECTION D — Bohr model & hydrogen spectrum
        // ============================================================
        {
          id: 'fb42ec95-a8c3-44a4-a192-7914895b9d39',
          title: 'Bohr model & the hydrogen spectrum',
          blurb: 'Energy levels, orbit radii, spectral series and transition wavelengths.',
          items: [
            {
              kind: 'numerical',
              id: '175a2018-dedd-4f1d-b958-77350cb3bbcf',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.13',
              prompt: 'What is the wavelength of light emitted when the electron in a hydrogen atom undergoes transition from an energy level with n = 4 to an energy level with n = 2?',
              answer: 'λ = 486 nm',
              solution:
                'Energy released in the transition, using $E = R_H\\left(\\dfrac{1}{n_1^2} - \\dfrac{1}{n_2^2}\\right)$ with $n_1=2$ (lower, final) and $n_2=4$ (upper, initial):\n\n$$E = 2.18 \\times 10^{-18}\\left(\\dfrac{1}{4} - \\dfrac{1}{16}\\right) = 2.18 \\times 10^{-18} \\times 0.1875 = 4.09 \\times 10^{-19}\\ \\text{J}.$$\n\nWavelength of the emitted photon: $\\lambda = \\dfrac{hc}{E} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{4.09 \\times 10^{-19}} = 4.86 \\times 10^{-7}\\ \\text{m} = 486\\ \\text{nm}$ (this is the well-known $H_\\beta$ line of the Balmer series, blue-green light).',
            },
            {
              kind: 'numerical',
              id: 'b2595efd-7ed1-45e7-b76e-a7ece48d9ed5',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.14',
              prompt:
                'How much energy is required to ionise a H atom if the electron occupies n = 5 orbit? Compare your answer with the ionization enthalpy of H atom (energy required to remove the electron from n =1 orbit).',
              answer: '8.72×10⁻²⁰ J; this is 1/25th of the n=1 ionisation energy',
              solution:
                'Ionisation from level $n$ means taking the electron from $E_n$ to $E_\\infty = 0$, so the energy needed is $E_n \\text{(magnitude)} = \\dfrac{R_H}{n^2}$.\n\nFor $n=5$: $E = \\dfrac{2.18 \\times 10^{-18}}{25} = 8.72 \\times 10^{-20}$ J.\n\nCompare with $n=1$: ionisation energy there is the full $R_H = 2.18 \\times 10^{-18}$ J. The ratio is $\\dfrac{8.72\\times 10^{-20}}{2.18 \\times 10^{-18}} = \\dfrac{1}{25}$ — makes sense, because energy needed scales as $1/n^2$, and an electron already sitting in the loosely-bound $n=5$ orbit needs far less energy to escape than one tightly held in $n=1$.',
            },
            {
              kind: 'numerical',
              id: 'db7cc899-a4a3-4b4d-bd7a-f2a33ac89b42',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.15',
              prompt: 'What is the maximum number of emission lines when the excited electron of a H atom in n = 6 drops to the ground state?',
              answer: '15 lines',
              solution:
                'Every possible pair of levels between $n=6$ and $n=1$ can give a distinct emission line. The number of such pairs is $\\dbinom{n}{2} = \\dfrac{n(n-1)}{2}$.\n\nFor $n=6$: $\\dfrac{6 \\times 5}{2} = 15$ possible emission lines.',
            },
            {
              kind: 'numerical',
              id: '660ee0f6-4f46-4468-a749-0b73a54f72ac',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.16',
              prompt:
                '(i) The energy associated with the first orbit in the hydrogen atom is −2.18 × 10⁻¹⁸ J atom⁻¹. What is the energy associated with the fifth orbit?\n(ii) Calculate the radius of Bohr\'s fifth orbit for hydrogen atom.',
              answer: '(i) −8.72×10⁻²⁰ J  (ii) 1.3225 nm',
              solution:
                '**(i)** $E_n = \\dfrac{E_1}{n^2}$, so $E_5 = \\dfrac{-2.18 \\times 10^{-18}}{25} = -8.72 \\times 10^{-20}$ J.\n\n**(ii)** Bohr radius formula: $r_n = 52.9\\,n^2$ pm (using $a_0 = 52.9$ pm for hydrogen).\n\n$r_5 = 52.9 \\times 25 = 1322.5$ pm $= 1.3225$ nm.',
            },
            {
              kind: 'numerical',
              id: '39343858-4c24-474b-8e28-af4f74654e46',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.17',
              prompt: 'Calculate the wavenumber for the longest wavelength transition in the Balmer series of atomic hydrogen.',
              answer: 'ῡ ≈ 1.523×10⁶ m⁻¹',
              solution:
                "In the Balmer series all transitions land on $n=2$; the **longest** wavelength (smallest energy gap) corresponds to the **smallest jump**, from $n=3$ down to $n=2$.\n\nUsing the Rydberg formula for wavenumber, $\\bar\\nu = R\\left(\\dfrac{1}{n_1^2} - \\dfrac{1}{n_2^2}\\right)$ with $R = 1.097 \\times 10^{7}$ m⁻¹, $n_1=2$, $n_2=3$:\n\n$$\\bar\\nu = 1.097 \\times 10^{7} \\left(\\dfrac{1}{4} - \\dfrac{1}{9}\\right) = 1.097 \\times 10^{7} \\times 0.1389 = 1.523 \\times 10^{6}\\ \\text{m}^{-1}.$$",
            },
            {
              kind: 'numerical',
              id: '93a55d52-404d-4af4-bd80-f753d04ca13f',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.18',
              prompt:
                'What is the energy in joules, required to shift the electron of the hydrogen atom from the first Bohr orbit to the fifth Bohr orbit and what is the wavelength of the light emitted when the electron returns to the ground state? The ground state electron energy is –2.18 × 10⁻¹¹ ergs.',
              answer: 'ΔE ≈ 2.09×10⁻¹¹ erg (≈ 2.09×10⁻¹⁸ J); λ ≈ 950 Å',
              solution:
                'Using $E_n = \\dfrac{E_1}{n^2}$ with $E_1 = -2.18 \\times 10^{-11}$ erg:\n\n$E_5 = \\dfrac{-2.18 \\times 10^{-11}}{25} = -8.72 \\times 10^{-13}$ erg.\n\nEnergy needed to shift from $n=1$ to $n=5$ (absorption): $\\Delta E = E_5 - E_1 = -8.72 \\times 10^{-13} - (-2.18 \\times 10^{-11}) \\approx 2.09 \\times 10^{-11}$ erg. Converting to SI ($1$ erg $= 10^{-7}$ J): $\\Delta E \\approx 2.09 \\times 10^{-18}$ J.\n\nWhen the electron falls back from $n=5$ to $n=1$ it emits a photon of exactly this energy:\n\n$$\\lambda = \\dfrac{hc}{\\Delta E} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{2.09 \\times 10^{-18}} \\approx 9.5 \\times 10^{-8}\\ \\text{m} = 950\\ \\text{Å}.$$\n\n(This falls in the ultraviolet — it belongs to the Lyman series, since it ends at $n=1$.)',
            },
            {
              kind: 'numerical',
              id: '76b9c4f7-ac7a-4bfc-9ba5-4c0a06813e28',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.19',
              prompt:
                'The electron energy in hydrogen atom is given by En = (–2.18 × 10⁻¹⁸)/n² J. Calculate the energy required to remove an electron completely from the n = 2 orbit. What is the longest wavelength of light in cm that can be used to cause this transition?',
              answer: 'E = 5.45×10⁻¹⁹ J; λ ≈ 3.648×10⁻⁵ cm (3647 Å)',
              solution:
                'Removing the electron "completely" means taking it from $n=2$ to $n=\\infty$ (where $E_\\infty = 0$). The energy required is the magnitude of $E_2$:\n\n$$E = \\dfrac{2.18 \\times 10^{-18}}{4} = 5.45 \\times 10^{-19}\\ \\text{J}.$$\n\nThe **longest** wavelength that can still cause this ionisation is the one carrying exactly this much energy (any less and it wouldn\'t be enough):\n\n$$\\lambda = \\dfrac{hc}{E} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{5.45 \\times 10^{-19}} = 3.648 \\times 10^{-7}\\ \\text{m} = 3.648 \\times 10^{-5}\\ \\text{cm} \\approx 3647\\ \\text{Å}.$$',
            },
            {
              kind: 'numerical',
              id: 'aa7df28e-4777-4e10-801e-e1af032fe948',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.32',
              prompt:
                'Show that the circumference of the Bohr orbit for the hydrogen atom is an integral multiple of the de Broglie wavelength associated with the electron revolving around the orbit.',
              answer: 'Derivation: 2πr = nλ',
              solution:
                "Bohr's quantisation postulate says the angular momentum of the orbiting electron is quantised: $m v r = \\dfrac{nh}{2\\pi}$, where $n$ is a positive integer.\n\nDe Broglie's relation gives the wavelength associated with the moving electron: $\\lambda = \\dfrac{h}{mv}$, so $mv = \\dfrac{h}{\\lambda}$.\n\nSubstitute $mv = \\dfrac{h}{\\lambda}$ into the quantisation condition:\n\n$$\\dfrac{h}{\\lambda}\\,r = \\dfrac{nh}{2\\pi} \\implies \\dfrac{r}{\\lambda} = \\dfrac{n}{2\\pi} \\implies 2\\pi r = n\\lambda.$$\n\nSince $2\\pi r$ is exactly the circumference of the orbit, this shows the circumference must be an integral multiple ($n$ times) of the electron's de Broglie wavelength — in other words, the orbit works only if a whole number of electron 'wave crests' fit around it, like a standing wave on a circular string. This is the physical picture that made de Broglie's matter-wave idea click with Bohr's earlier, purely empirical quantisation rule.",
            },
            {
              kind: 'numerical',
              id: 'e442f2b9-516b-4dda-be44-baf9b6bb2895',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.33',
              prompt: 'What transition in the hydrogen spectrum would have the same wavelength as the Balmer transition n = 4 to n = 2 of He⁺ spectrum?',
              answer: 'n = 2 to n = 1 in hydrogen',
              solution:
                "$He^+$ is a one-electron (hydrogen-like) species with $Z=2$, so its energy levels scale as $R_H Z^2/n^2$. Energy of the $n=4 \\to n=2$ transition in $He^+$:\n\n$$E_{He^+} = R_H Z^2\\left(\\dfrac{1}{2^2} - \\dfrac{1}{4^2}\\right) = R_H \\times 4 \\times \\left(\\dfrac{1}{4}-\\dfrac{1}{16}\\right) = R_H \\times 4 \\times 0.1875 = 0.75\\,R_H.$$\n\nFor a hydrogen transition ($Z=1$) to have this same energy (same wavelength):\n\n$$R_H\\left(\\dfrac{1}{n_1^2} - \\dfrac{1}{n_2^2}\\right) = 0.75\\,R_H \\implies \\dfrac{1}{n_1^2} - \\dfrac{1}{n_2^2} = 0.75.$$\n\nTrying $n_1=1, n_2=2$: $1 - 0.25 = 0.75$ ✓. So the matching hydrogen transition is **$n=2 \\to n=1$** (a Lyman-series line).",
            },
            {
              kind: 'numerical',
              id: '965a226c-7061-4e28-b1dc-cc51158056d8',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.34',
              prompt:
                'Calculate the energy required for the process\nHe⁺(g) → He²⁺(g) + e⁻\nThe ionization energy for the H atom in the ground state is 2.18 × 10⁻¹⁸ J atom⁻¹.',
              answer: '8.72×10⁻¹⁸ J per atom',
              solution:
                'This is the ionisation energy of $He^+$, a one-electron hydrogen-like ion with $Z=2$, from its ground state ($n=1$). Ionisation energy for such a species scales as $R_H Z^2$:\n\n$$E = R_H Z^2 = 2.18 \\times 10^{-18} \\times 2^2 = 2.18 \\times 10^{-18} \\times 4 = 8.72 \\times 10^{-18}\\ \\text{J per atom}.$$',
            },
            {
              kind: 'numerical',
              id: 'dc47459d-5a00-40af-9f72-184f4107900b',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.55',
              prompt:
                'Emission transitions in the Paschen series end at orbit n = 3 and start from orbit n and can be represeted as v = 3.29 × 10¹⁵ (Hz) [1/3² – 1/n²]\nCalculate the value of n if the transition is observed at 1285 nm. Find the region of the spectrum.',
              answer: 'n = 5; infrared region',
              solution:
                "Frequency of the observed line: $\\nu = \\dfrac{c}{\\lambda} = \\dfrac{3 \\times 10^{8}}{1285 \\times 10^{-9}} = 2.335 \\times 10^{14}\\ \\text{Hz}$.\n\nSet this equal to the given Paschen-series formula and solve for $n$:\n\n$$2.335 \\times 10^{14} = 3.29 \\times 10^{15}\\left(\\dfrac{1}{9} - \\dfrac{1}{n^2}\\right) \\implies \\dfrac{1}{9} - \\dfrac{1}{n^2} = 0.07098.$$\n\n$$\\dfrac{1}{n^2} = 0.1111 - 0.0710 = 0.0401 \\implies n^2 \\approx 24.9 \\implies n \\approx 5.$$\n\nSince the Paschen series ($n$ ending at 3) always lies in the **infrared** region of the spectrum, this transition ($n=5 \\to n=3$) is an infrared line.",
            },
            {
              kind: 'numerical',
              id: 'da5b3451-6b2d-4ccb-8305-9365d72c2cba',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.56',
              prompt:
                'Calculate the wavelength for the emission transition if it starts from the orbit having radius 1.3225 nm and ends at 211.6 pm. Name the series to which this transition belongs and the region of the spectrum.',
              answer: 'λ ≈ 434 nm; Balmer series; visible region',
              solution:
                'Identify the orbit numbers from the Bohr radius formula $r_n = 52.9\\,n^2$ pm.\n\nStarting orbit: $1.3225$ nm $= 1322.5$ pm $\\Rightarrow n^2 = \\dfrac{1322.5}{52.9} = 25.0 \\Rightarrow n = 5$.\n\nEnding orbit: $211.6$ pm $\\Rightarrow n^2 = \\dfrac{211.6}{52.9} = 4.0 \\Rightarrow n=2$.\n\nSo this is the $n=5 \\to n=2$ transition — landing on $n=2$ makes it a **Balmer series** line, which falls in the **visible region**.\n\nEnergy released: $E = R_H\\left(\\dfrac{1}{4} - \\dfrac{1}{25}\\right) = 2.18 \\times 10^{-18} \\times 0.21 = 4.578 \\times 10^{-19}$ J.\n\nWavelength: $\\lambda = \\dfrac{hc}{E} = \\dfrac{6.626 \\times 10^{-34} \\times 3 \\times 10^{8}}{4.578 \\times 10^{-19}} = 4.34 \\times 10^{-7}\\ \\text{m} = 434\\ \\text{nm}$ (a violet-blue $H_\\gamma$ line).',
            },
          ],
        },
        // ============================================================
        // SECTION E — Dual nature, uncertainty, quantum numbers & configuration
        // ============================================================
        {
          id: '65d72ae7-733e-4f12-93f2-0af912a22837',
          title: 'Dual nature, uncertainty, quantum numbers & electronic configuration',
          blurb: "De Broglie wavelength, Heisenberg's uncertainty principle, valid quantum-number sets, and filling electron configurations.",
          items: [
            {
              kind: 'numerical',
              id: '5017a3f3-b485-40f9-98cf-a12f018b0aa8',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.20',
              prompt: 'Calculate the wavelength of an electron moving with a velocity of 2.05 × 10⁷ m s⁻¹.',
              answer: 'λ = 3.55×10⁻¹¹ m',
              solution:
                'De Broglie wavelength: $\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626 \\times 10^{-34}}{9.1 \\times 10^{-31} \\times 2.05 \\times 10^{7}} = 3.55 \\times 10^{-11}\\ \\text{m}$.',
            },
            {
              kind: 'numerical',
              id: '64d953e9-6a82-47e3-a64d-af3850935dbe',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.21',
              prompt: 'The mass of an electron is 9.1 × 10⁻³¹ kg. If its K.E. is 3.0 × 10⁻²⁵ J, calculate its wavelength.',
              answer: 'λ ≈ 8968 Å',
              solution:
                'First find the velocity from the kinetic energy: $v = \\sqrt{\\dfrac{2\\,KE}{m}} = \\sqrt{\\dfrac{2 \\times 3.0 \\times 10^{-25}}{9.1 \\times 10^{-31}}} \\approx 812$ m/s.\n\nThen apply de Broglie\'s relation:\n\n$$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626 \\times 10^{-34}}{9.1 \\times 10^{-31} \\times 812} \\approx 8.97 \\times 10^{-7}\\ \\text{m} \\approx 8968\\ \\text{Å}.$$',
            },
            {
              kind: 'numerical',
              id: '9ef72bce-c94b-41b7-96ae-114620291bc5',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.23',
              prompt:
                '(i) Write the electronic configurations of the following ions: (a) H– (b) Na+ (c) O2– (d) F–\n(ii) What are the atomic numbers of elements whose outermost electrons are represented by (a) 3s1 (b) 2p3 and (c) 3p5?\n(iii) Which atoms are indicated by the following configurations? (a) [He] 2s1 (b) [Ne] 3s2 3p3 (c) [Ar] 4s2 3d1.',
              answer: 'see full solution for each part',
              solution:
                "**(i) Ions** — build the configuration for the electron count *after* adjusting for charge:\n\n(a) $H^-$: 1 proton but 2 electrons (gained 1) $\\Rightarrow 1s^2$.\n\n(b) $Na^+$: $Z=11$, minus 1 electron $= 10$ e⁻ $\\Rightarrow 1s^2\\,2s^2\\,2p^6$.\n\n(c) $O^{2-}$: $Z=8$, plus 2 electrons $= 10$ e⁻ $\\Rightarrow 1s^2\\,2s^2\\,2p^6$.\n\n(d) $F^-$: $Z=9$, plus 1 electron $= 10$ e⁻ $\\Rightarrow 1s^2\\,2s^2\\,2p^6$.\n\n**(ii) Outermost electron → atomic number:**\n\n(a) $3s^1$ means the atom's last electron fills $3s$ after a filled $1s^2\\,2s^2\\,2p^6$ core (10) plus 1 more $= Z=11$ (sodium).\n\n(b) $2p^3$ means $1s^2\\,2s^2\\,2p^3$, total $=7$ electrons $= Z=7$ (nitrogen).\n\n(c) $3p^5$ means $[Ne]3s^2\\,3p^5$, i.e. $10 + 2 + 5 = 17 = Z=17$ (chlorine).\n\n**(iii) Configuration → atom:**\n\n(a) $[He]2s^1$: $2 + 1 = 3$ electrons $\\Rightarrow$ lithium ($Li$, $Z=3$).\n\n(b) $[Ne]3s^2\\,3p^3$: $10 + 2 + 3 = 15$ electrons $\\Rightarrow$ phosphorus ($P$, $Z=15$).\n\n(c) $[Ar]4s^2\\,3d^1$: $18 + 2 + 1 = 21$ electrons $\\Rightarrow$ scandium ($Sc$, $Z=21$).",
            },
            {
              kind: 'numerical',
              id: 'd9c51bea-41b7-4f71-aa98-1988c6309df6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.24',
              prompt: 'What is the lowest value of n that allows g orbitals to exist?',
              answer: 'n = 5',
              solution:
                'Orbital types follow $l = 0,1,2,3,4,\\dots$ for $s,p,d,f,g,\\dots$ respectively, so a $g$ orbital has $l=4$.\n\nThe rule is $l$ can range from $0$ to $n-1$, so for $l=4$ to be allowed we need $n-1 \\geq 4$, i.e. $n \\geq 5$.\n\nThe lowest value is $n=5$.',
            },
            {
              kind: 'numerical',
              id: '0fc1f39e-a567-4da5-a392-5a5beb5da608',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.25',
              prompt: 'An electron is in one of the 3d orbitals. Give the possible values of n, l and ml for this electron.',
              answer: 'n = 3, l = 2, ml = −2, −1, 0, +1, +2 (any one)',
              solution:
                'For a $3d$ orbital: $n=3$ (the principal quantum number, from the "3"), $l=2$ (since $d$ corresponds to $l=2$).\n\n$m_l$ can range from $-l$ to $+l$ in integer steps, so for $l=2$: $m_l = -2, -1, 0, +1, +2$ — any one of these five values is a valid answer for a single electron in *a* 3d orbital.',
            },
            {
              kind: 'numerical',
              id: '75a6d408-76f1-4279-a397-5c418009f0c6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.28',
              prompt:
                '(i) An atomic orbital has n = 3. What are the possible values of l and ml?\n(ii) List the quantum numbers (ml and l) of electrons for 3d orbital.\n(iii) Which of the following orbitals are possible? 1p, 2s, 2p and 3f',
              answer: '(i) l = 0,1,2 with matching ml sets  (ii) l = 2, ml = −2..+2  (iii) only 2s, 2p are possible',
              solution:
                "**(i)** For $n=3$, $l$ can be $0, 1, 2$ (since $l$ runs $0$ to $n-1$).\n\nFor $l=0$: $m_l = 0$. For $l=1$: $m_l = -1, 0, +1$. For $l=2$: $m_l = -2, -1, 0, +1, +2$.\n\n**(ii)** A $3d$ orbital has $l=2$, so $m_l = -2, -1, 0, +1, +2$.\n\n**(iii)** Check each against the rule $l \\leq n-1$:\n\n$1p$: $n=1$ would need $l=1$, but $l \\leq n-1=0$ — **not possible**.\n\n$2s$: $n=2$, $l=0 \\leq 1$ — **possible**.\n\n$2p$: $n=2$, $l=1 \\leq 1$ — **possible**.\n\n$3f$: $n=3$ would need $l=3$, but $l \\leq n-1=2$ — **not possible**.\n\nSo only $2s$ and $2p$ are valid orbitals from this list.",
            },
            {
              kind: 'numerical',
              id: 'f5ed543f-ce89-4d86-8c03-2d7b816ed0f1',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.29',
              prompt: 'Using s, p, d notations, describe the orbital with the following quantum numbers.\n(a) n=1, l=0; (b) n=3; l=1 (c) n=4; l=2, (d) n=4; l=3.',
              answer: '(a) 1s (b) 3p (c) 4d (d) 4f',
              solution:
                'The letter code follows $l=0\\to s$, $l=1\\to p$, $l=2\\to d$, $l=3\\to f$, prefixed by $n$.\n\n(a) $n=1,l=0 \\Rightarrow 1s$.\n\n(b) $n=3,l=1 \\Rightarrow 3p$.\n\n(c) $n=4,l=2 \\Rightarrow 4d$.\n\n(d) $n=4,l=3 \\Rightarrow 4f$.',
            },
            {
              kind: 'numerical',
              id: '3f2e510e-81f0-4471-b93a-958e5a975f7d',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.30',
              prompt:
                'Explain, giving reasons, which of the following sets of quantum numbers are not possible.\n(a) n=0, l=0, ml=0, ms=+½\n(b) n=1, l=0, ml=0, ms=–½\n(c) n=1, l=1, ml=0, ms=+½\n(d) n=2, l=1, ml=0, ms=–½\n(e) n=3, l=3, ml=–3, ms=+½\n(f) n=3, l=1, ml=0, ms=+½',
              answer: 'Not possible: (a), (c), (e)',
              solution:
                'Check each set against the rules $n \\geq 1$, $0 \\leq l \\leq n-1$, $-l \\leq m_l \\leq l$, $m_s = \\pm\\tfrac12$:\n\n**(a)** $n=0$: **not possible** — $n$ must be a positive integer ($1,2,3,\\dots$), it can never be $0$.\n\n**(b)** $n=1, l=0$: $l \\leq n-1 = 0$ ✓, $m_l=0$ is within $-0$ to $0$ ✓ — **possible**.\n\n**(c)** $n=1, l=1$: needs $l \\leq n-1 = 0$, but $l=1$ — **not possible**.\n\n**(d)** $n=2, l=1$: $l \\leq 1$ ✓, $m_l=0$ within $-1$ to $+1$ ✓ — **possible**.\n\n**(e)** $n=3, l=3$: needs $l \\leq n-1=2$, but $l=3$ — **not possible**.\n\n**(f)** $n=3, l=1$: $l \\leq 2$ ✓, $m_l=0$ within $-1$ to $+1$ ✓ — **possible**.\n\nSo the impossible sets are **(a), (c) and (e)**.',
            },
            {
              kind: 'numerical',
              id: '53387555-56b9-4e02-afc4-08582d3ebe80',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.31',
              prompt: 'How many electrons in an atom may have the following quantum numbers?\n(a) n = 4, ms = – ½ (b) n = 3, l = 0',
              answer: '(a) 16 electrons  (b) 2 electrons',
              solution:
                '**(a)** The total number of orbitals in shell $n$ is $n^2$. For $n=4$: $4^2 = 16$ orbitals. Every orbital holds exactly one electron with $m_s = -\\tfrac12$ (and one with $+\\tfrac12$), so exactly $16$ electrons in the $n=4$ shell can have $m_s=-\\tfrac12$.\n\n**(b)** $n=3, l=0$ specifies the $3s$ subshell, which is a single orbital ($m_l=0$ only). A single orbital holds a maximum of $2$ electrons (one spin-up, one spin-down), so the answer is $2$ electrons.',
            },
            {
              kind: 'numerical',
              id: '5b286960-b32b-4d78-8d96-276911c66310',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.57',
              prompt:
                "Dual behaviour of matter proposed by de Broglie led to the discovery of electron microscope often used for the highly magnified images of biological molecules and other type of material. If the velocity of the electron in this microscope is 1.6 × 10⁶ ms⁻¹, calculate de Broglie wavelength associated with this electron.",
              answer: 'λ ≈ 455 pm',
              solution:
                'De Broglie wavelength: $\\lambda = \\dfrac{h}{m_e v} = \\dfrac{6.626 \\times 10^{-34}}{9.1 \\times 10^{-31} \\times 1.6 \\times 10^{6}} = 4.55 \\times 10^{-10}\\ \\text{m} = 455\\ \\text{pm}$.',
            },
            {
              kind: 'numerical',
              id: 'e2bb98fa-48d3-4df6-b300-90bee4657093',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.58',
              prompt:
                'Similar to electron diffraction, neutron diffraction microscope is also used for the determination of the structure of molecules. If the wavelength used here is 800 pm, calculate the characteristic velocity associated with the neutron.',
              answer: 'v ≈ 494.5 m/s',
              solution:
                'From de Broglie\'s relation, $\\lambda = \\dfrac{h}{m_n v}$, so $v = \\dfrac{h}{m_n \\lambda}$. Using neutron mass $m_n = 1.675 \\times 10^{-27}$ kg and $\\lambda = 800$ pm $= 8 \\times 10^{-10}$ m:\n\n$$v = \\dfrac{6.626 \\times 10^{-34}}{1.675 \\times 10^{-27} \\times 8 \\times 10^{-10}} = 494.5\\ \\text{m/s}.$$',
            },
            {
              kind: 'numerical',
              id: '0cb1c9c8-c119-4e98-864b-cc134418c983',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.59',
              prompt: "If the velocity of the electron in Bohr's first orbit is 2.19 × 10⁶ ms⁻¹, calculate the de Broglie wavelength associated with it.",
              answer: 'λ ≈ 332 pm',
              solution:
                '$$\\lambda = \\dfrac{h}{m_e v} = \\dfrac{6.626 \\times 10^{-34}}{9.1 \\times 10^{-31} \\times 2.19 \\times 10^{6}} = 3.32 \\times 10^{-10}\\ \\text{m} = 332\\ \\text{pm}.$$',
            },
            {
              kind: 'numerical',
              id: '7942b641-7d23-4484-92d4-b13c18b3a407',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.60',
              prompt:
                'The velocity associated with a proton moving in a potential difference of 1000 V is 4.37 × 10⁵ ms⁻¹. If the hockey ball of mass 0.1 kg is moving with this velocity, calcualte the wavelength associated with this velocity.',
              answer: 'λ ≈ 1.516×10⁻³⁸ m',
              solution:
                'Same de Broglie formula, but now for the much more massive hockey ball:\n\n$$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626 \\times 10^{-34}}{0.1 \\times 4.37 \\times 10^{5}} = 1.516 \\times 10^{-38}\\ \\text{m}.$$\n\nThis wavelength is astronomically smaller than the size of an atom — which is exactly the point of the question: matter waves are real for every object, but they\'re only *observable* for objects as light as an electron. A hockey ball\'s wave nature is completely undetectable.',
            },
            {
              kind: 'numerical',
              id: '252d1c4e-f62f-4efc-bf90-b62c1dc37b6c',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.61',
              prompt:
                "If the position of the electron is measured within an accuracy of ± 0.002 nm, calculate the uncertainty in the momentum of the electron. Suppose the momentum of the electron is h/4πm × 0.05 nm, is there any problem in defining this value.",
              answer: 'Δp ≈ 2.64×10⁻²³ kg m/s; yes — the uncertainty exceeds the momentum itself, so it cannot be meaningfully defined.',
              solution:
                "Heisenberg's uncertainty principle: $\\Delta x \\cdot \\Delta p \\geq \\dfrac{h}{4\\pi}$, so the minimum uncertainty in momentum is:\n\n$$\\Delta p = \\dfrac{h}{4\\pi \\, \\Delta x} = \\dfrac{6.626 \\times 10^{-34}}{4\\pi \\times 0.002 \\times 10^{-9}} \\approx 2.64 \\times 10^{-23}\\ \\text{kg m/s}.$$\n\nNow compare this to the stated momentum value, $p = \\dfrac{h}{4\\pi m} \\times 0.05\\ \\text{nm}$ — working this out gives a momentum of a similar tiny order of magnitude, actually *smaller* than the uncertainty $\\Delta p$ just calculated.\n\nSince the uncertainty in momentum ($\\Delta p$) is larger than (or comparable to) the momentum value itself, the momentum **cannot be meaningfully defined** at that precision — you can't state a value that's smaller than your own margin of error. This is the everyday-scale illustration of why the uncertainty principle matters only for very small particles like electrons: at this position accuracy, the momentum is simply too uncertain to pin down.",
            },
            {
              kind: 'numerical',
              id: '21c5e739-3517-4ae8-806a-794df96d3abc',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.62',
              prompt:
                'The quantum numbers of six electrons are given below. Arrange them in order of increasing energies. If any of these combination(s) has/have the same energy lists:\n1. n = 4, l = 2, ml = –2, ms = –1/2\n2. n = 3, l = 2, ml = 1, ms = +1/2\n3. n = 4, l = 1, ml = 0, ms = +1/2\n4. n = 3, l = 2, ml = –2, ms = –1/2\n5. n = 3, l = 1, ml = –1, ms = +1/2\n6. n = 4, l = 1, ml = 0, ms = +1/2',
              answer: '(5) < (2) = (4) < (3) = (6) < (1)',
              solution:
                "For multi-electron atoms, relative subshell energy is set by the $(n+l)$ rule: lower $(n+l)$ fills first, and if two subshells tie on $(n+l)$, the one with lower $n$ is filled (lower energy) first. Electrons in the *same* subshell (same $n$ and $l$, just different $m_l/m_s$) have identical energy.\n\nWork out $(n,l)$ and $(n+l)$ for each:\n\n1. $n=4,l=2$ (4d): $n+l=6$\n\n2. $n=3,l=2$ (3d): $n+l=5$\n\n3. $n=4,l=1$ (4p): $n+l=5$\n\n4. $n=3,l=2$ (3d): $n+l=5$ — **same subshell as #2**\n\n5. $n=3,l=1$ (3p): $n+l=4$\n\n6. $n=4,l=1$ (4p): $n+l=5$ — **same subshell as #3**\n\nOrdering by $(n+l)$, then by $n$ within ties: $(n+l)=4$ (subshell 3p, entry 5) is lowest; then $(n+l)=5$ splits into $n=3$ (3d: entries 2, 4 — tied with each other) below $n=4$ (4p: entries 3, 6 — tied with each other); then $(n+l)=6$ (4d, entry 1) is highest.\n\n**Increasing energy order: (5) < (2) = (4) < (3) = (6) < (1)**.",
            },
            {
              kind: 'numerical',
              id: 'ef4cd472-bbfd-4eb5-804d-122cdcb0a106',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.63',
              prompt:
                'The bromine atom possesses 35 electrons. It contains 6 electrons in 2p orbital, 6 electrons in 3p orbital and 5 electron in 4p orbital. Which of these electron experiences the lowest effective nuclear charge?',
              answer: '4p electrons',
              solution:
                "Effective nuclear charge ($Z_{\\text{eff}}$) is the net pull the nucleus exerts on an electron after accounting for the shielding of inner electrons. Electrons farther from the nucleus (higher $n$) sit behind more layers of shielding electrons, so they feel a smaller net pull.\n\nAmong $2p$ (closest, $n=2$), $3p$ (middle, $n=3$) and $4p$ ($n=4$, outermost, shielded by both the $2p$ and $3p$ shells beneath it), the **4p electrons** are farthest from the nucleus and most shielded, so they experience the **lowest** effective nuclear charge.",
            },
            {
              kind: 'numerical',
              id: 'a9baf62d-0388-4bc3-a1f8-366223290c23',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.64',
              prompt: 'Among the following pairs of orbitals which orbital will experience the larger effective nuclear charge? (i) 2s and 3s, (ii) 4d and 4f, (iii) 3d and 3p.',
              answer: '(i) 2s  (ii) 4d  (iii) 3p',
              solution:
                'Two rules do the work here: **(a)** for the same type of orbital, lower $n$ is closer to the nucleus and less shielded, so it feels a larger $Z_{\\text{eff}}$; **(b)** for the same $n$, lower $l$ penetrates closer to the nucleus (through the electron cloud of inner shells) and so also feels a larger $Z_{\\text{eff}}$.\n\n(i) $2s$ vs $3s$: same $l$, lower $n$ wins $\\Rightarrow$ **2s**.\n\n(ii) $4d$ vs $4f$: same $n$, lower $l$ ($d$, $l=2$, vs $f$, $l=3$) penetrates more $\\Rightarrow$ **4d**.\n\n(iii) $3d$ vs $3p$: same $n$, lower $l$ ($p$, $l=1$, vs $d$, $l=2$) penetrates more $\\Rightarrow$ **3p**.',
            },
            {
              kind: 'numerical',
              id: '4117c9cd-042f-4703-827f-0b976fd1a7dd',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.65',
              prompt: 'The unpaired electrons in Al and Si are present in 3p orbital. Which electrons will experience more effective nuclear charge from the nucleus?',
              answer: 'Silicon (Si)',
              solution:
                "Both unpaired electrons sit in a $3p$ orbital — same $n$, same $l$, so the shielding they experience from inner shells is essentially the same. The deciding factor is then just the bare nuclear charge: silicon has $Z=14$ versus aluminium's $Z=13$.\n\nWith one more proton pulling and comparable shielding, the $3p$ electron in **silicon** experiences the larger effective nuclear charge.",
            },
            {
              kind: 'numerical',
              id: '69b90f6c-2f14-4a3c-8b2f-6f2b1a8f9e11',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.66',
              prompt: 'Indicate the number of unpaired electrons in: (a) P, (b) Si, (c) Cr, (d) Fe and (e) Kr.',
              answer: '(a) 3  (b) 2  (c) 6  (d) 4  (e) 0',
              solution:
                "Write each configuration and fill the last (partially-filled) subshell using Hund's rule (spread electrons singly across all orbitals of a subshell before pairing any):\n\n(a) $P$ ($Z=15$): $[Ne]3s^2\\,3p^3$. $3p^3$ fills all three $p$ orbitals singly $\\Rightarrow$ **3 unpaired**.\n\n(b) $Si$ ($Z=14$): $[Ne]3s^2\\,3p^2$. $3p^2$ fills two of three orbitals singly $\\Rightarrow$ **2 unpaired**.\n\n(c) $Cr$ ($Z=24$): exception configuration $[Ar]3d^5\\,4s^1$ (half-filled $3d$ is extra stable). $3d^5$ has all 5 orbitals singly occupied, plus the lone $4s^1$ $\\Rightarrow$ **6 unpaired**.\n\n(d) $Fe$ ($Z=26$): $[Ar]3d^6\\,4s^2$. In $3d^6$, the first 5 electrons occupy the 5 $d$-orbitals singly, then the 6th must pair up with one of them, leaving 4 orbitals still singly occupied; $4s^2$ is fully paired $\\Rightarrow$ **4 unpaired**.\n\n(e) $Kr$ ($Z=36$): a noble gas with every subshell completely filled $\\Rightarrow$ **0 unpaired**.",
            },
            {
              kind: 'numerical',
              id: 'e5c379fa-e76b-47de-b13e-6bac808e34c6',
              source: 'ncert_exercise',
              source_label: 'NCERT 2.67',
              prompt: '(a) How many subshells are associated with n = 4? (b) How many electrons will be present in the subshells having ms value of –1/2 for n = 4?',
              answer: '(a) 4 subshells  (b) 16 electrons',
              solution:
                '**(a)** For a given $n$, $l$ ranges from $0$ to $n-1$, giving $n$ possible subshells. For $n=4$: $l=0,1,2,3$, i.e. **4 subshells** ($4s, 4p, 4d, 4f$).\n\n**(b)** Total orbitals in the $n=4$ shell $= n^2 = 16$. Every orbital holds one electron with $m_s=-\\tfrac12$ and one with $m_s=+\\tfrac12$, so **16 electrons** in the $n=4$ shell have $m_s=-\\tfrac12$.',
            },
          ],
        },
      ],
    },
  ],
};
