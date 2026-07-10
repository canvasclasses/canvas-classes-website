// Ch.5 (d- & f-Block) · Page 5 · Ionisation Enthalpies (NCERT §8.3.3).
// NCERT content transcribed faithfully (irregular-1st-IE passage + 3rd-IE passage verbatim, Table 8.2 data).
// Devices: "🔍 Decode This" (high 2nd IE of Cr & Cu as A–R); "🏛️ Exam Vault" (verified NEET 2nd-IE PYQ).
// In-text 8.5 placed at section. Ends with Quick Recap + textbook quiz.
module.exports = {
  page_number: 5,
  chapter: 5,
  slug: 'ionisation-enthalpies',
  title: 'Ionisation Enthalpies',
  subtitle: 'Why the first ionisation enthalpy zig-zags instead of rising smoothly, why the second one spikes for Chromium and Copper, and why a break appears between Mn²⁺ and Fe²⁺ in the third.',
  tags: ['d-block', 'ionisation-enthalpy', 'chromium', 'copper', 'exchange-energy'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: three stacked bar-charts (ΔᵢH I, ΔᵢH II, ΔᵢH III) across the elements Sc to Zn, drawn as chalk bars rising overall but with deliberate jagged irregularity — the second-ionisation chart shows two tall spikes labelled at Cr and Cu, and the third-ionisation chart shows a clear step-up gap drawn between Mn and Fe. A faint label reads "removing an electron rearranges 4s and 3d — exchange energy matters". Chalk-and-coloured-pencil textbook plate. Landscape.',
      '16:9',
      'Ionisation enthalpies do not climb smoothly — the 2nd spikes at Cr and Cu, and the 3rd shows a break between Mn²⁺ and Fe²⁺.'
    ),

    h.heading('8.3.3 Ionisation Enthalpies', 'Explain the irregular trends in the first, second and third ionisation enthalpies of the 3d transition metals.'),
    h.text(
      'Due to an increase in nuclear charge which accompanies the filling of the inner $d$ orbitals, there is an increase in ionisation enthalpy along each series of the transition elements from left to right. However, many small variations occur. Table 8.2 gives the values for the first three ionisation enthalpies of the first row elements. These values show that the successive enthalpies of these elements do not increase as steeply as in the main group elements. Although the first ionisation enthalpy, in general, increases, the magnitude of the increase in the second and third ionisation enthalpies for the successive elements, in general, is much higher.'
    ),

    h.callout('note', 'Why the first ionisation enthalpy is irregular (keep this NCERT passage word for word)',
      '> *"The irregular trend in the first ionisation enthalpy of the $3d$ metals, though of little chemical significance, can be accounted for by considering that the removal of one electron alters the relative energies of $4s$ and $3d$ orbitals. So the unipositive ions have $d^n$ configurations with no $4s$ electrons. There is thus, a reorganisation energy accompanying ionisation with some gains in exchange energy as the number of electrons increases and from the transference of $s$ electrons into $d$ orbitals."*'),

    h.text(
      'There is the generally expected increasing trend in the values as the effective nuclear charge increases. However, the value of Cr is lower because of the absence of any change in the $d$ configuration and the value for Zn higher because it represents an ionisation from the $4s$ level. The lowest common oxidation state of these metals is +2. To form the $\\ce{M^{2+}}$ ions from the gaseous atoms, the sum of the first and second ionisation energies is required in addition to the enthalpy of atomisation for each element.'
    ),

    h.text(
      'The dominant term is the second ionisation enthalpy which shows unusually high values for Cr and Cu where the $d^5$ and $d^{10}$ configurations of the $\\ce{M+}$ ions are disrupted, with considerable loss of exchange energy. The value for Zn is correspondingly low as the ionisation consists of the removal of an electron which allows the production of the stable $d^{10}$ configuration.'
    ),

    h.callout('note', 'Why the third ionisation enthalpy behaves as it does (keep this NCERT passage word for word)',
      '> *"The trend in the third ionisation enthalpies is not complicated by the $4s$ orbital factor and shows the greater difficulty of removing an electron from the $d^5$ ($\\ce{Mn^{2+}}$) and $d^{10}$ ($\\ce{Zn^{2+}}$) ions superimposed upon the general increasing trend. In general, the third ionisation enthalpies are quite high and there is a marked break between the values for $\\ce{Mn^{2+}}$ and $\\ce{Fe^{2+}}$. Also the high values for copper, nickel and zinc indicate why it is difficult to obtain oxidation state greater than two for these elements."*'),

    h.text(
      'Although ionisation enthalpies give some guidance concerning the relative stabilities of oxidation states, this problem is very complex and not amendable to ready generalisation.'
    ),

    h.callout('exam_tip', 'Exam Point — three ionisation spikes worth memorising',
      '- **2nd IE high for Cr and Cu** — the $\\ce{M+}$ ions are $3d^5$ (Cr⁺) and $3d^{10}$ (Cu⁺), both extra-stable; the second electron has to break that stable set (loss of exchange energy), so it costs a lot.\n' +
      '- **3rd IE high for Mn and Zn** — here you are pulling an electron out of the stable $d^5$ ($\\ce{Mn^{2+}}$) or $d^{10}$ ($\\ce{Zn^{2+}}$) ion, so a **break appears between $\\ce{Mn^{2+}}$ and $\\ce{Fe^{2+}}$**.\n' +
      '- **Cu, Ni, Zn rarely exceed +2** — their high third ionisation enthalpies make the +3 state hard to reach.\n\n' +
      'Whenever a stable $d^5$ or $d^{10}$ configuration has to be **disrupted**, expect the ionisation enthalpy to jump.'),

    h.worked('NCERT In-text Question 8.5', 'ncert_intext',
      'How would you account for the irregular variation of ionisation enthalpies (first and second) in the first series of the transition elements?',
      'The irregularity arises because removing an electron **alters the relative energies of the $4s$ and $3d$ orbitals**, and the energetics depend on **reorganisation energy and exchange energy**, which change unevenly across the series.\n\n' +
      '**First IE:** the unipositive ions have $d^n$ configurations with no $4s$ electrons; the reorganisation energy plus the gain in exchange energy (and transfer of $s$ electrons into $d$ orbitals) make the trend irregular. Cr is lower (no change in its $d$ configuration on ionising) and Zn is higher (ionisation from the $4s$ level).\n\n' +
      '**Second IE:** Cr and Cu show unusually high values because the stable $d^5$ ($\\ce{Cr+}$) and $d^{10}$ ($\\ce{Cu+}$) configurations are disrupted with considerable loss of exchange energy, while Zn is low because removing its electron leaves the stable $d^{10}$ configuration.'),

    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT pairs a **fact** with its **reason**, and examiners lift that pair into an **Assertion–Reason** question:\n\n' +
      '> **NCERT (fact):** *"The second ionisation enthalpy … shows unusually high values for Cr and Cu."*\n' +
      '> **NCERT (reason):** *"… where the $d^5$ and $d^{10}$ configurations of the $\\ce{M+}$ ions are disrupted, with considerable loss of exchange energy."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Chromium and copper have unusually high second ionisation enthalpies.\n' +
      '- **Reason (R):** Their $\\ce{M+}$ ions are the extra-stable $3d^5$ ($\\ce{Cr+}$) and $3d^{10}$ ($\\ce{Cu+}$); removing the second electron breaks that stable arrangement, losing exchange energy.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** when NCERT pairs a *high ionisation value* with the *disruption of a stable $d^5$/$d^{10}$ set*, that is a ready-made A–R question — A = the high value, R = the loss of exchange energy.'),

    h.worked('🏛️ Exam Vault · NEET (PYQ)', 'solved_example',
      'The atomic numbers of V, Cr, Mn and Fe are respectively 23, 24, 25 and 26. Which one of these may be expected to have the highest second ionisation enthalpy?\n\n(1) Mn  (2) Fe  (3) Cr  (4) V',
      '**Answer: (3) Cr.** The second ionisation enthalpy is the energy to pull an electron from the $\\ce{M+}$ ion:\n\n- $\\ce{Cr+}$ is $3d^5$ — a **half-filled, extra-stable** set. Removing the second electron disrupts it (loss of exchange energy) → **highest** 2nd IE.\n- $\\ce{Mn+}$ is $3d^5 4s^1$; removing the second electron actually *produces* the stable $3d^5$, so its 2nd IE is comparatively low.\n- $\\ce{V+}$ and $\\ce{Fe+}$ have no such stable half-filled $\\ce{M+}$ ion to break.\n\n' +
      '**Notice:** this is NCERT\'s exact statement — *"the second ionisation enthalpy shows unusually high values for Cr and Cu where the $d^5$ and $d^{10}$ configurations of the $\\ce{M+}$ ions are disrupted."* Learn that line and the answer is automatic.'),

    h.recap([
      { label: 'General trend', text: 'Ionisation enthalpy **rises** left-to-right (increasing nuclear charge), but the successive values do **not** climb as steeply as in main-group elements, and many small wobbles occur.' },
      { label: 'First IE', text: 'Irregular because ionising **reshuffles $4s$ and $3d$ energies**; reorganisation + exchange energy matter. Cr is low (no $d$-config change); Zn is high (ionised from $4s$).' },
      { label: 'Second IE', text: '**Unusually high for Cr and Cu** — the stable $3d^5$ ($\\ce{Cr+}$) and $3d^{10}$ ($\\ce{Cu+}$) sets are broken, losing exchange energy. Zn\'s 2nd IE is low (leaves stable $d^{10}$).' },
      { label: 'Third IE', text: 'High overall; a **marked break between $\\ce{Mn^{2+}}$ and $\\ce{Fe^{2+}}$** (pulling from stable $d^5$/$d^{10}$ ions is hard).' },
      { label: 'Why +2 only for Cu/Ni/Zn', text: 'Their **high third ionisation enthalpies** make oxidation states greater than +2 difficult to reach.' },
    ]),

    h.quiz([
      {
        question: 'The second ionisation enthalpies of chromium and copper are unusually high mainly because:',
        options: [
          'their $\\ce{M+}$ ions have no electrons left to remove',
          'the stable $3d^5$ ($\\ce{Cr+}$) and $3d^{10}$ ($\\ce{Cu+}$) configurations are disrupted, with loss of exchange energy',
          'their atomic radii are the largest in the series',
          'they have the highest nuclear charge in the series',
        ],
        correct_index: 1,
        explanation: 'NCERT pins the spike on breaking the extra-stable half-filled ($\\ce{Cr+}$, $3d^5$) and fully-filled ($\\ce{Cu+}$, $3d^{10}$) sets of the unipositive ions, which loses exchange energy. The $\\ce{M+}$ ions still have plenty of electrons, and radius/nuclear charge are not the stated reasons.',
      },
      {
        question: 'In the third ionisation enthalpies of the first transition series, a marked break appears between:',
        options: [
          'Sc²⁺ and Ti²⁺',
          'Cu²⁺ and Zn²⁺',
          'Mn²⁺ and Fe²⁺',
          'V²⁺ and Cr²⁺',
        ],
        correct_index: 2,
        explanation: 'NCERT states the third ionisation enthalpies show a marked break between $\\ce{Mn^{2+}}$ and $\\ce{Fe^{2+}}$, reflecting the extra difficulty of removing an electron from the stable $d^5$ $\\ce{Mn^{2+}}$ ion. The other pairs are not where NCERT marks the break.',
      },
      {
        question: 'Why is it difficult to obtain oxidation states greater than +2 for copper, nickel and zinc?',
        options: [
          'they have very low first ionisation enthalpies',
          'their third ionisation enthalpies are high',
          'they have completely empty $d$ orbitals',
          'they form only covalent compounds',
        ],
        correct_index: 1,
        explanation: 'NCERT links the reluctance of Cu, Ni and Zn to exceed +2 directly to their high third ionisation enthalpies — the energy cost of removing a third electron is too great. Their first ionisation enthalpies are not especially low.',
      },
      {
        question: 'The first ionisation enthalpy of chromium is lower than expected because:',
        options: [
          'on ionising, there is no change in its $d$ configuration',
          'chromium has the smallest atom in the series',
          'it is ionised from the $4s$ level only, like zinc',
          'it has a completely filled $3d^{10}$ shell',
        ],
        correct_index: 0,
        explanation: 'NCERT attributes Cr\'s lower first ionisation enthalpy to the absence of any change in its $d$ configuration upon ionisation. Zn is the one whose high value comes from ionising the $4s$ level, and Cr is $3d^5 4s^1$, not $3d^{10}$.',
      },
      {
        question: 'Assertion (A): The successive ionisation enthalpies of the transition metals do not increase as steeply as those of the main-group elements.\nReason (R): Removal of an electron alters the relative energies of the $4s$ and $3d$ orbitals, and reorganisation and exchange energies vary across the series.\nChoose the correct option:',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true but R is false',
          'A is false but R is true',
        ],
        correct_index: 0,
        explanation: 'NCERT states the successive values rise less steeply than in main-group elements, and traces the irregularities to the $4s$/$3d$ reshuffle plus reorganisation and exchange energies — so R genuinely explains A.',
      },
      {
        question: 'The second ionisation enthalpy of zinc is comparatively LOW because removing the electron:',
        options: [
          'breaks a stable half-filled $d^5$ configuration',
          'leaves behind the stable $d^{10}$ configuration of $\\ce{Zn^{2+}}$',
          'comes from a $3d$ orbital of $\\ce{Zn+}$',
          'requires no energy at all',
        ],
        correct_index: 1,
        explanation: 'For Zn the second ionisation removes a $4s$ electron from $\\ce{Zn+}$, leaving the stable $d^{10}$ $\\ce{Zn^{2+}}$ ion — an energetically favourable outcome, so the value is low. It does not disrupt a $d^5$ set (that is Cr/Mn territory), and ionisation always costs some energy.',
      },
    ], 0.6),
  ],
};
