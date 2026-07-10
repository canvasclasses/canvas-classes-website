// Ch.5 (d- & f-Block) · Page 7 · Standard Electrode Potentials (NCERT §8.3.5 + §8.3.6).
// NCERT content transcribed faithfully (same language/equations/numbers — Table 8.4,
// Fig 8.4, Examples/In-text 8.3.x); enrichment is confined to "Exam Point" callouts.
// Devices: 🔍 Decode This (Example 8.4 as an Assertion–Reason) + 🏛️ Exam Vault
// (answer-verified JEE Main 2021 PYQ on Cu's positive E°). Ends Recap + quiz (incl. A–R).
module.exports = {
  page_number: 6,
  chapter: 5,
  slug: 'electrode-potentials',
  title: 'Standard Electrode Potentials (M²⁺/M, M³⁺/M²⁺)',
  subtitle: 'Why the M²⁺/M potential rises across the 3d series, why Mn, Ni and Zn stick out, why copper alone has a positive E° (and so cannot push out hydrogen from acids), and why Cu⁺ falls apart in water.',
  tags: ['d-block', 'transition-metals', 'electrode-potential', 'copper', 'high-yield'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a horizontal voltage axis (a zigzag line) running left to right over the labels Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, mostly sitting below a marked "0 V" dashed line but rising to climb ABOVE the zero line only at Cu, where a small copper-coloured coin and a test tube of acid with NO bubbles is drawn (labelled "no H2"). A faint thermochemical cycle (solid metal atom -> M2+ ion in water) sketched to one side with three small arrows labelled atomisation, ionisation, hydration. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Across Ti→Zn the M²⁺/M potential stays negative — only copper climbs above zero, so only copper cannot liberate H₂ from acids.'
    ),

    h.text(
      'A standard electrode potential ($E^\\ominus$) is a single number that tells us how readily a metal goes into solution as its ion. For the first transition series we look at two couples: the $\\ce{M^2+}/\\ce{M}$ couple (the metal turning into its $\\ce{M^2+}$ ion) and the $\\ce{M^3+}/\\ce{M^2+}$ couple (one ion turning into the next). Each reveals a different trend.'
    ),

    h.heading('Trends in the M²⁺/M Standard Electrode Potentials', 'Read the M²⁺/M electrode-potential trend from a thermochemical cycle, and explain the exceptions (Mn, Ni, Zn) and copper\'s unique positive value.'),
    h.text(
      'Table 8.4 contains the thermochemical parameters related to the transformation of the solid metal atoms to $\\ce{M^2+}$ ions in solution and their standard electrode potentials. The observed values of $E^\\ominus$ and those calculated using the data of Table 8.4 are compared in Fig. 8.4.'
    ),

    h.table(
      ['Element (M)', '$\\Delta_a H^\\ominus$ (M)', '$\\Delta_i H_1^\\ominus$', '$\\Delta_i H_2^\\ominus$', '$\\Delta_{hyd} H^\\ominus(\\ce{M^2+})$', '$E^\\ominus$/V'],
      [
        ['Ti', '469', '661', '1310', '−1866', '−1.63'],
        ['V', '515', '648', '1370', '−1895', '−1.18'],
        ['Cr', '398', '653', '1590', '−1925', '−0.90'],
        ['Mn', '279', '716', '1510', '−1862', '−1.18'],
        ['Fe', '418', '762', '1560', '−1998', '−0.44'],
        ['Co', '427', '757', '1640', '−2079', '−0.28'],
        ['Ni', '431', '736', '1750', '−2121', '−0.25'],
        ['Cu', '339', '745', '1960', '−2121', '+0.34'],
        ['Zn', '130', '908', '1730', '−2059', '−0.76'],
      ],
      'Table 8.4 — Thermochemical data (kJ mol⁻¹) for the first row Transition Elements and the Standard Electrode Potentials for the Reduction of $\\ce{M^2+}$ to M.'
    ),

    h.img(
      'A hand-drawn coloured line graph on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Y-axis labelled "Standard electrode potential / V" running from about -2 up to +0.5 with a horizontal "0" line; X-axis labelled with the elements Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn. Two jagged plotted curves overlaid and almost coinciding: one drawn as small brick-red squares ("Observed values") and one as dusty-teal diamonds ("Calculated values"). Both curves start near -1.6 at Ti, dip and rise irregularly, reach their single point ABOVE the zero line at Cu (about +0.34), then drop sharply at Zn. A small key shows the red-square and teal-diamond legend. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Fig. 8.4 — Observed and calculated values for the standard electrode potentials (M²⁺ → M) of the elements Ti to Zn.'
    ),

    h.text(
      'The general trend towards less negative $E^\\ominus$ values across the series is related to the general increase in the sum of the first and second ionisation enthalpies. It is interesting to note that the values of $E^\\ominus$ for **Mn, Ni and Zn are more negative than expected from the trend.**'
    ),

    h.callout('exam_tip', 'Exam Point — why Mn, Ni and Zn break the line',
      'Three exceptions, three reasons (NCERT gives them on the next page, §8.3.8) — keep them as a set:\n\n' +
      '- **Mn** ($\\ce{Mn^2+}$ is $3d^5$) and **Zn** ($\\ce{Zn^2+}$ is $3d^{10}$): the **stability of the half-filled / completely-filled $d$ sub-shell** makes the +2 ion extra stable, pulling $E^\\ominus$ more negative.\n' +
      '- **Ni**: its highly **negative enthalpy of hydration** ($\\Delta_{hyd}H^\\ominus$) is responsible (note $\\ce{Ni^2+}$ has the most negative value, −2121, tying with Cu in Table 8.4).\n\n' +
      'Mnemonic: **"half-filled, full-filled, hydration"** for Mn, Zn and Ni respectively.'),

    h.text(
      'Copper is the standout. **The unique behaviour of Cu, having a positive $E^\\ominus$, accounts for its inability to liberate $\\ce{H2}$ from acids.** Only oxidising acids (nitric and hot concentrated sulphuric) react with Cu, the acids being reduced. The high energy to transform $\\ce{Cu}(s)$ to $\\ce{Cu^2+}(aq)$ is not balanced by its hydration enthalpy.'
    ),

    h.heading('Trends in the M³⁺/M²⁺ Standard Electrode Potentials', 'Explain the M³⁺/M²⁺ potential trend in terms of the special stability of certain dⁿ configurations.'),
    h.text(
      'An examination of the $E^\\ominus(\\ce{M^3+}/\\ce{M^2+})$ values (Table 8.2) shows the varying trends. The low value for Sc reflects the stability of $\\ce{Sc^3+}$ which has a noble gas configuration. The highest value for Zn is due to the removal of an electron from the stable $d^{10}$ configuration of $\\ce{Zn^2+}$. The comparatively high value for Mn shows that $\\ce{Mn^2+}$ ($d^5$) is particularly stable, whereas comparatively low value for Fe shows the extra stability of $\\ce{Fe^3+}$ ($d^5$). The comparatively low value for V is related to the stability of $\\ce{V^2+}$ (half-filled $t_{2g}$ level).'
    ),

    h.worked('NCERT Example 8.4', 'solved_example',
      'Why is $\\ce{Cr^2+}$ reducing and $\\ce{Mn^3+}$ oxidising when both have $d^4$ configuration.',
      '$\\ce{Cr^2+}$ is reducing as its configuration changes from $d^4$ to $d^3$, the latter having a half-filled $t_{2g}$ level. On the other hand, the change from $\\ce{Mn^2+}$ to $\\ce{Mn^3+}$ results in the half-filled ($d^5$) configuration which has extra stability.'),
    h.worked('NCERT In-text Question 8.4', 'ncert_intext',
      'The $E^\\ominus(\\ce{M^2+}/\\ce{M})$ value for copper is positive (+0.34 V). What is possibly the reason for this? (Hint: consider its high $\\Delta_a H^\\ominus$ and low $\\Delta_{hyd}H^\\ominus$.)',
      'For copper the energy needed to atomise the metal and then ionise it (its high $\\Delta_a H^\\ominus$ plus the two ionisation enthalpies) is **not** compensated by the energy released on hydrating $\\ce{Cu^2+}$ (its $\\Delta_{hyd}H^\\ominus$ is relatively low). Because the overall process of taking solid Cu to $\\ce{Cu^2+}(aq)$ is energetically unfavourable, the couple sits on the positive side — $E^\\ominus = +0.34$ V — and copper does not displace $\\ce{H2}$ from acids.'),
    h.worked('NCERT In-text Question 8.9', 'ncert_intext',
      'Explain why $\\ce{Cu^+}$ ion is not stable in aqueous solutions.',
      'Many copper(I) compounds are unstable in aqueous solution and undergo **disproportionation**:\n\n$$\\ce{2Cu^+ -> Cu^2+ + Cu}$$\n\nThe stability of $\\ce{Cu^2+}(aq)$ rather than $\\ce{Cu^+}(aq)$ is due to the much more negative $\\Delta_{hyd}H^\\ominus$ of $\\ce{Cu^2+}(aq)$ than $\\ce{Cu^+}$, which more than compensates for the second ionisation enthalpy of Cu. So in water $\\ce{Cu^+}$ is not stable — it splits into $\\ce{Cu^2+}$ and copper metal.'),

    // ── DEVICE: the "read between the lines" trainer (built directly on Example 8.4) ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how Example 8.4 does it:\n\n' +
      '> **NCERT (fact):** *"$\\ce{Cr^2+}$ is reducing while $\\ce{Mn^3+}$ is oxidising"* (both are $d^4$).\n' +
      '> **NCERT (reason):** *"$\\ce{Cr^2+}$ ($d^4$) changes to the half-filled $t_{2g}$ $\\ce{Cr^3+}$ ($d^3$); $\\ce{Mn^2+}$ is the extra-stable half-filled $d^5$."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** In aqueous solution $\\ce{Cr^2+}$ is reducing while $\\ce{Mn^3+}$ is oxidising.\n' +
      '- **Reason (R):** A half-filled electronic configuration has extra stability compared with an incompletely filled one.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A** — $\\ce{Cr^2+}$ gives up an electron to reach the stable $d^3$ ($t_{2g}$ half-filled), and $\\ce{Mn^3+}$ grabs an electron to fall back to the stable $d^5$ ($\\ce{Mn^2+}$).\n\n' +
      '**Your move:** whenever NCERT says *"X happens **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y.'),

    // ── DEVICE: a real, answer-verified PYQ next to the NCERT line it came from ──
    h.worked('🏛️ Exam Vault · JEE Main 2021 (PYQ)', 'solved_example',
      'The electrode potential of $\\ce{M^2+}/\\ce{M}$ of 3d-series elements shows positive value for:\n\n(1) Co  (2) Fe  (3) Zn  (4) Cu',
      '**Answer: (4) Cu.** Read it straight off Table 8.4: $E^\\ominus(\\ce{M^2+}/\\ce{M})$ is $-0.28$ V for Co, $-0.44$ V for Fe, $-0.76$ V for Zn, and **$+0.34$ V for Cu** — the only positive entry in the whole series.\n\n' +
      '**Notice:** this is NCERT\'s highlighted line — *"The unique behaviour of Cu, having a positive $E^\\ominus$, accounts for its inability to liberate $\\ce{H2}$ from acids."* Because Cu sits above hydrogen on the positive side, it cannot push $\\ce{H2}$ out of ordinary acids; only oxidising acids attack it. Learn the NCERT sentence and the PYQ is already answered.'),

    h.recap([
      { label: 'Across the series', text: 'The $\\ce{M^2+}/\\ce{M}$ potential becomes **less negative** from Ti to Cu because the **sum of the first + second ionisation enthalpies** rises across the series.' },
      { label: 'Three exceptions', text: '$E^\\ominus$ for **Mn, Ni and Zn** is more negative than expected — Mn ($d^5$) and Zn ($d^{10}$) from the stable half/full $d$ sub-shell, Ni from its highly negative hydration enthalpy.' },
      { label: 'Copper alone', text: 'Only **Cu** has a **positive** $E^\\ominus$ (+0.34 V) — so it **cannot liberate $\\ce{H2}$ from acids**; only oxidising acids react. Its high atomisation + ionisation cost is not repaid by hydration.' },
      { label: 'M³⁺/M²⁺ couple', text: 'Trend driven by stable configurations: low for Sc (noble-gas $\\ce{Sc^3+}$), high for Mn ($\\ce{Mn^2+}$ is $d^5$, hard to oxidise), low for Fe ($\\ce{Fe^3+}$ is the stable $d^5$), high for Zn.' },
      { label: 'd⁴ pair', text: '$\\ce{Cr^2+}$ is **reducing** ($d^4 \\to d^3$, half-filled $t_{2g}$); $\\ce{Mn^3+}$ is **oxidising** (grabs an $e^-$ to give the half-filled $d^5$ of $\\ce{Mn^2+}$).' },
      { label: 'Cu⁺ in water', text: '$\\ce{Cu^+}$ **disproportionates**: $\\ce{2Cu^+ -> Cu^2+ + Cu}$. The much more negative $\\Delta_{hyd}H^\\ominus$ of $\\ce{Cu^2+}$ makes the +2 ion the stable one in solution.' },
    ]),

    h.quiz([
      {
        question: 'Across the first transition series the $E^\\ominus(\\ce{M^2+}/\\ce{M})$ values become less negative. This general trend is mainly related to:',
        options: [
          'the increase in the sum of the first and second ionisation enthalpies across the series',
          'a steady decrease in the enthalpy of hydration of the $\\ce{M^2+}$ ions',
          'the increasing number of unpaired $d$ electrons',
          'the inert pair effect operating across the period',
        ],
        correct_index: 0,
        explanation: 'NCERT attributes the less-negative drift directly to the rising sum of the first + second ionisation enthalpies. Hydration enthalpy actually becomes more negative (favouring the ion), unpaired-electron count does not set the potential, and the inert pair effect is a p-block idea.',
      },
      {
        question: 'Copper is the only 3d metal whose $E^\\ominus(\\ce{M^2+}/\\ce{M})$ is positive (+0.34 V). A direct consequence is that copper:',
        options: [
          'reacts violently with dilute hydrochloric acid releasing $\\ce{H2}$',
          'cannot liberate $\\ce{H2}$ from acids and dissolves only in oxidising acids',
          'is the strongest reducing metal in the series',
          'has the most negative hydration enthalpy in the series',
        ],
        correct_index: 1,
        explanation: 'A positive $E^\\ominus$ means Cu sits above hydrogen, so it cannot displace $\\ce{H2}$; only oxidising acids (HNO₃, hot conc. H₂SO₄) attack it. It is not a strong reducer, and the option about hydration misreads the cause.',
      },
      {
        question: 'The $E^\\ominus$ values for which set of metals are MORE negative than the smooth trend would predict?',
        options: ['Ti, V and Cr', 'Fe, Co and Cu', 'Mn, Ni and Zn', 'Cr, Fe and Co'],
        correct_index: 2,
        explanation: 'NCERT singles out Mn, Ni and Zn: Mn ($d^5$) and Zn ($d^{10}$) from the stability of the half-filled / completely filled $d$ sub-shell, and Ni from its highly negative enthalpy of hydration.',
      },
      {
        question: 'Assertion (A): In aqueous solution $\\ce{Cr^2+}$ is reducing while $\\ce{Mn^3+}$ is oxidising, although both are $d^4$.\nReason (R): A half-filled electronic configuration has extra stability compared with an incompletely filled one.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: $\\ce{Cr^2+}$ ($d^4$) loses an electron to reach the half-filled $t_{2g}$ $d^3$ (hence reducing); $\\ce{Mn^3+}$ ($d^4$) gains one to fall to the half-filled $d^5$ of $\\ce{Mn^2+}$ (hence oxidising).',
      },
      {
        question: 'Why is the $\\ce{Cu^+}$ ion not stable in aqueous solution?',
        options: [
          'It is oxidised by water to $\\ce{CuO}$',
          'It is colourless and therefore thermodynamically forbidden',
          'It disproportionates: $\\ce{2Cu^+ -> Cu^2+ + Cu}$, because the much more negative hydration enthalpy of $\\ce{Cu^2+}$ favours the +2 ion',
          'It immediately forms a stable hydride in water',
        ],
        correct_index: 2,
        explanation: 'In water $\\ce{Cu^+}$ disproportionates to $\\ce{Cu^2+}$ and Cu metal; the strongly negative $\\Delta_{hyd}H^\\ominus$ of $\\ce{Cu^2+}$ more than compensates for the second ionisation enthalpy, so $\\ce{Cu^2+}$ is the stable species. Colour and hydride formation are irrelevant.',
      },
      {
        question: 'In the $E^\\ominus(\\ce{M^3+}/\\ce{M^2+})$ trend, the comparatively LOW value for iron is explained by:',
        options: [
          'the noble-gas configuration of $\\ce{Fe^2+}$',
          'the extra stability of $\\ce{Fe^3+}$, which has the half-filled $d^5$ configuration',
          'the very high hydration enthalpy of $\\ce{Fe^2+}$',
          'the inert pair effect in iron',
        ],
        correct_index: 1,
        explanation: 'A low $\\ce{M^3+}/\\ce{M^2+}$ value means $\\ce{Fe^2+}$ gives up an electron readily because the product $\\ce{Fe^3+}$ is the extra-stable half-filled $d^5$. $\\ce{Fe^2+}$ has no noble-gas core, and the inert pair effect is a p-block concept.',
      },
    ], 0.6),
  ],
};
