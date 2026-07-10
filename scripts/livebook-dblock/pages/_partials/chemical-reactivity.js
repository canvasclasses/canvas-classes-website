// Ch.5 (d- & f-Block) · Page 9 · Chemical Reactivity & E° Values (NCERT §8.3.8).
// NCERT content transcribed faithfully (the reactivity paragraph, the M2+/M decreasing-
// tendency trend, the Mn/Ni/Zn anomaly, the M3+/M2+ strongest-oxidiser/reducer lines,
// Examples 8.6 and 8.7, In-text 8.7); enrichment only in "Exam Point" callouts.
// Device: 🔍 Decode This (Mn/Ni/Zn E° anomaly) + 🏛️ Exam Vault (verified JEE Main 2023).
module.exports = {
  page_number: 9,
  chapter: 5,
  slug: 'chemical-reactivity',
  title: 'Chemical Reactivity & E° Values',
  subtitle: 'Why the first-series metals get less reactive across the period, why Mn, Ni and Zn read more negative than the trend predicts, which ions are the strongest oxidisers and reducers, and why Mn³⁺/Mn²⁺ sits so high.',
  tags: ['d-block', 'transition-metals', 'electrode-potential', 'reactivity', 'high-yield'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a left-to-right reactivity arrow over the elements Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, fading from a bright "reactive" tint on the left to a dull "noble" tint near copper. Three of the labels — Mn, Ni and Zn — are circled and dropped slightly lower than their neighbours with tiny down-arrows, marked with small notes "half-filled d5", "hydration", "full d10". On the far right, a small dipping test tube where a piece of metal fizzes (releasing H2) versus a copper coin sitting inert. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Reactivity falls across the series, but Mn, Ni and Zn dip below the smooth trend — and copper sits inert at the end.'
    ),

    h.text(
      'Transition metals vary widely in their chemical reactivity. Many of them are sufficiently electropositive to dissolve in mineral acids, although a few are ‘noble’ — that is, they are unaffected by simple acids.'
    ),
    h.text(
      'The metals of the first series with the exception of copper are relatively more reactive and are oxidised by 1M $\\ce{H+}$, though the actual rate at which these metals react with oxidising agents like hydrogen ion ($\\ce{H+}$) is sometimes slow. For example, titanium and vanadium, in practice, are passive to dilute non oxidising acids at room temperature.'
    ),

    h.heading('The M²⁺/M trend and its three exceptions', 'Explain the decreasing tendency to form divalent cations across the series and the anomalous E° values of Mn, Ni and Zn.'),
    h.text(
      'The $E^\\ominus$ values for $\\ce{M^2+}/\\ce{M}$ (Table 8.2) indicate a **decreasing tendency to form divalent cations** across the series. This general trend towards less negative $E^\\ominus$ values is related to the increase in the sum of the first and second ionisation enthalpies. It is interesting to note that **the $E^\\ominus$ values for Mn, Ni and Zn are more negative than expected from the general trend.** Whereas the stabilities of half-filled $d$ subshell ($d^5$) in $\\ce{Mn^2+}$ and completely filled $d$ subshell ($d^{10}$) in zinc are related to their $E^\\ominus$ values; for nickel, $E^\\ominus$ value is related to the highest negative enthalpy of hydration.'
    ),

    h.callout('exam_tip', 'Exam Point — lock the Mn / Ni / Zn anomaly as a set of three',
      'Same fact ("$E^\\ominus$ more negative than expected"), three different reasons — examiners love testing which reason goes with which metal:\n\n' +
      '- **Mn** → $\\ce{Mn^2+}$ is **half-filled $d^5$** (extra-stable ion → harder to form → more negative $E^\\ominus$).\n' +
      '- **Zn** → $\\ce{Zn^2+}$ is **completely filled $d^{10}$** (same idea: extra-stable ion).\n' +
      '- **Ni** → not configuration but the **highest negative enthalpy of hydration** ($\\Delta_{hyd}H^\\ominus$).\n\n' +
      'Memory hook: **Mn & Zn = configuration; Ni = hydration.**'),

    h.heading('The M³⁺/M²⁺ couple — strongest oxidisers and reducers', 'Identify the strongest oxidising and reducing ions in aqueous solution from the M³⁺/M²⁺ values.'),
    h.text(
      'An examination of the $E^\\ominus$ values for the redox couple $\\ce{M^3+}/\\ce{M^2+}$ (Table 8.2) shows that **$\\ce{Mn^3+}$ and $\\ce{Co^3+}$ ions are the strongest oxidising agents in aqueous solutions.** The ions $\\ce{Ti^2+}$, $\\ce{V^2+}$ and $\\ce{Cr^2+}$ are **strong reducing agents** and will liberate hydrogen from a dilute acid, e.g.,\n\n$$\\ce{2Cr^2+(aq) + 2H+(aq) -> 2Cr^3+(aq) + H2(g)}$$'
    ),

    h.worked('NCERT Example 8.6', 'solved_example',
      'For the first row transition metals the $E^\\ominus$ values are:\n\n| | V | Cr | Mn | Fe | Co | Ni | Cu |\n|---|---|---|---|---|---|---|---|\n| $E^\\ominus(\\ce{M^2+}/\\ce{M})$ | −1.18 | −0.91 | −1.18 | −0.44 | −0.28 | −0.25 | +0.34 |\n\nExplain the irregularity in the above values.',
      'The $E^\\ominus(\\ce{M^2+}/\\ce{M})$ values are not regular which can be explained from the irregular variation of ionisation enthalpies ($\\Delta_i H_1 + \\Delta_i H_2$) and also the sublimation enthalpies which are relatively much less for manganese and vanadium.'),
    h.worked('NCERT Example 8.7', 'solved_example',
      'Why is the $E^\\ominus$ value for the $\\ce{Mn^3+}/\\ce{Mn^2+}$ couple much more positive than that for $\\ce{Cr^3+}/\\ce{Cr^2+}$ or $\\ce{Fe^3+}/\\ce{Fe^2+}$? Explain.',
      'Much larger third ionisation energy of Mn (where the required change is $d^5$ to $d^4$) is mainly responsible for this. This also explains why the +3 state of Mn is of little importance.'),
    h.worked('NCERT In-text Question 8.7', 'ncert_intext',
      'Which is a stronger reducing agent $\\ce{Cr^2+}$ or $\\ce{Fe^2+}$ and why?',
      '$\\ce{Cr^2+}$ is the stronger reducing agent. On giving up an electron, $\\ce{Cr^2+}$ ($d^4$) becomes $\\ce{Cr^3+}$ ($d^3$), the stable half-filled $t_{2g}$ level — so it loses the electron readily. In contrast, $\\ce{Fe^2+}$ ($d^6$) loses an electron to become $\\ce{Fe^3+}$ ($d^5$); the change away from $d^6$ does not give a comparable driving force, so $\\ce{Cr^2+}$ is the stronger reducer (this matches its more negative $\\ce{M^3+}/\\ce{M^2+}$ value).'),

    // ── DEVICE: the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT names a fact (three metals are "more negative than expected") and then quietly attaches a different reason to each. Examiners split that into a matching/Assertion–Reason trap.\n\n' +
      '> **NCERT (fact):** *"The $E^\\ominus$ values for Mn, Ni and Zn are more negative than expected from the general trend."*\n' +
      '> **NCERT (reason):** *"Mn ($d^5$) and Zn ($d^{10}$) — stable sub-shells; Ni — highest negative enthalpy of hydration."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** The $E^\\ominus(\\ce{M^2+}/\\ce{M})$ value of nickel is more negative than the smooth trend predicts.\n' +
      '- **Reason (R):** The unexpectedly negative value of nickel is due to the stability of its half-filled $d^5$ configuration.\n\n' +
      '**Answer:** A is **true** but R is **false** — for **nickel** the cause is its **highest negative hydration enthalpy**, not a half-filled sub-shell (that reasoning belongs to Mn). \n\n' +
      '**Your move:** when NCERT gives *one fact with several reasons*, check that each reason is matched to the right metal. Mn & Zn → configuration; Ni → hydration.'),

    // ── DEVICE: a real, answer-verified PYQ next to the NCERT line it came from ──
    h.worked('🏛️ Exam Vault · JEE Main 2023 (PYQ)', 'solved_example',
      'Which of the following statements are correct?\n\n(A) The $\\ce{M^3+}/\\ce{M^2+}$ reduction potential for iron is greater than manganese.\n(B) The higher oxidation states of first row d-block elements get stabilized by oxide ion.\n(C) Aqueous solution of $\\ce{Cr^2+}$ can liberate hydrogen from dilute acid.\n(D) Magnetic moment of $\\ce{V^2+}$ is observed between 4.4–5.2 BM.\n\n(1) (B), (C) only  (2) (A), (B), (D) only  (3) (C), (D) only  (4) (A), (B) only',
      '**Answer: (1) — (B) and (C) only.**\n\n' +
      '- **(A) is FALSE.** Example 8.7 on this very page says the $\\ce{Mn^3+}/\\ce{Mn^2+}$ value is *much more positive* than Fe\'s — so iron\'s is **not** greater than manganese\'s.\n' +
      '- **(B) is TRUE.** The oxide ion stabilises the highest oxidation states (§8.3.7 — "the ability of oxygen to stabilise the highest oxidation state is demonstrated in the oxides").\n' +
      '- **(C) is TRUE.** NCERT\'s line on this page: $\\ce{Cr^2+}$ is a strong reducing agent and liberates $\\ce{H2}$ — $\\ce{2Cr^2+(aq) + 2H+(aq) -> 2Cr^3+(aq) + H2(g)}$.\n' +
      '- **(D) is FALSE.** $\\ce{V^2+}$ is $3d^3$ → 3 unpaired electrons → $\\mu = \\sqrt{3(3+2)} = \\sqrt{15} \\approx 3.87$ BM, not 4.4–5.2 BM.\n\n' +
      '**Notice:** statements (A) and (C) are lifted straight from this NCERT section — learn the lines and you have already answered the PYQ.'),

    h.recap([
      { label: 'Reactivity', text: 'Most first-series metals (except **Cu**) are reactive enough to be **oxidised by 1M $\\ce{H+}$**, though slowly — Ti and V are even passive to dilute non-oxidising acids at room temperature.' },
      { label: 'M²⁺/M trend', text: '$E^\\ominus$ becomes **less negative** across the series — a **decreasing tendency to form $\\ce{M^2+}$** — driven by the rising sum of the first + second ionisation enthalpies.' },
      { label: 'Mn / Ni / Zn dip', text: 'Their $E^\\ominus$ is **more negative than expected**: Mn ($d^5$) and Zn ($d^{10}$) from stable sub-shells, **Ni** from its **highest negative hydration enthalpy**.' },
      { label: 'Strongest oxidisers', text: '$\\ce{Mn^3+}$ and $\\ce{Co^3+}$ are the **strongest oxidising agents** in aqueous solution (high $\\ce{M^3+}/\\ce{M^2+}$ values).' },
      { label: 'Strong reducers', text: '$\\ce{Ti^2+}$, $\\ce{V^2+}$, $\\ce{Cr^2+}$ are **strong reducing agents** and liberate $\\ce{H2}$ from dilute acid: $\\ce{2Cr^2+ + 2H+ -> 2Cr^3+ + H2}$.' },
      { label: 'Mn³⁺/Mn²⁺ high', text: 'The $\\ce{Mn^3+}/\\ce{Mn^2+}$ value is **much more positive** than Cr\'s or Fe\'s because of Mn\'s **large third ionisation energy** ($d^5 \\to d^4$) — and that is why Mn(+3) is of little importance.' },
    ]),

    h.quiz([
      {
        question: 'Across the first transition series, the $E^\\ominus(\\ce{M^2+}/\\ce{M})$ values indicate that the tendency to form divalent cations:',
        options: [
          'increases steadily from Ti to Cu',
          'decreases across the series (values become less negative)',
          'stays exactly constant',
          'is highest at copper',
        ],
        correct_index: 1,
        explanation: 'The values become less negative from left to right, signalling a decreasing tendency to form $\\ce{M^2+}$, because the sum of the first + second ionisation enthalpies rises across the series. Copper, with a positive $E^\\ominus$, is actually the least willing to form its $\\ce{2+}$ ion this way.',
      },
      {
        question: 'The $E^\\ominus(\\ce{M^2+}/\\ce{M})$ value of nickel is more negative than the smooth trend predicts. The reason given by NCERT is:',
        options: [
          'the stability of the half-filled $d^5$ configuration of $\\ce{Ni^2+}$',
          'its highest negative enthalpy of hydration',
          'the completely filled $d^{10}$ configuration of $\\ce{Ni^2+}$',
          'its unusually low sublimation enthalpy',
        ],
        correct_index: 1,
        explanation: 'For nickel the cause is its highest negative hydration enthalpy. The half-filled $d^5$ reason belongs to Mn and the full $d^{10}$ reason to Zn — not to Ni, whose $\\ce{Ni^2+}$ is $3d^8$.',
      },
      {
        question: 'Which pair represents the strongest OXIDISING agents among the $\\ce{M^3+}/\\ce{M^2+}$ couples of the 3d series?',
        options: ['$\\ce{Ti^2+}$ and $\\ce{V^2+}$', '$\\ce{Cr^2+}$ and $\\ce{Fe^2+}$', '$\\ce{Mn^3+}$ and $\\ce{Co^3+}$', '$\\ce{Sc^3+}$ and $\\ce{Zn^2+}$'],
        correct_index: 2,
        explanation: 'NCERT states $\\ce{Mn^3+}$ and $\\ce{Co^3+}$ are the strongest oxidising agents in aqueous solution. $\\ce{Ti^2+}$, $\\ce{V^2+}$ and $\\ce{Cr^2+}$ are the strong reducers, the opposite role.',
      },
      {
        question: 'Why is the $E^\\ominus$ value for the $\\ce{Mn^3+}/\\ce{Mn^2+}$ couple much more positive than for $\\ce{Cr^3+}/\\ce{Cr^2+}$ or $\\ce{Fe^3+}/\\ce{Fe^2+}$?',
        options: [
          'the very low sublimation enthalpy of manganese',
          'the high negative hydration enthalpy of $\\ce{Mn^3+}$',
          'the much larger third ionisation energy of Mn (the change is $d^5 \\to d^4$)',
          'the noble-gas configuration of $\\ce{Mn^3+}$',
        ],
        correct_index: 2,
        explanation: 'Mn\'s large third ionisation energy — removing an electron from the stable half-filled $d^5$ ($\\ce{Mn^2+}$) to give $d^4$ ($\\ce{Mn^3+}$) — makes $\\ce{Mn^3+}$ hard to form and eager to revert, pushing the couple strongly positive. This is also why Mn(+3) is of little importance.',
      },
      {
        question: 'Which is the stronger reducing agent, $\\ce{Cr^2+}$ or $\\ce{Fe^2+}$, and why?',
        options: [
          '$\\ce{Fe^2+}$, because it becomes the stable $d^5$ $\\ce{Fe^3+}$ on oxidation',
          '$\\ce{Fe^2+}$, because iron is more electropositive than chromium',
          'both are equally strong reducers',
          '$\\ce{Cr^2+}$, because it becomes the stable half-filled $t_{2g}$ $d^3$ $\\ce{Cr^3+}$ on oxidation',
        ],
        correct_index: 3,
        explanation: '$\\ce{Cr^2+}$ ($d^4$) readily loses an electron to reach the extra-stable half-filled $t_{2g}$ $d^3$ of $\\ce{Cr^3+}$, so it is the stronger reducer. $\\ce{Fe^2+} \\to \\ce{Fe^3+}$ moves from $d^6$ to $d^5$, which offers less driving force.',
      },
      {
        question: 'Statement I: The metals of the first series, except copper, are relatively reactive and are oxidised by 1M $\\ce{H+}$.\nStatement II: Titanium and vanadium are, in practice, passive to dilute non-oxidising acids at room temperature.\nChoose the correct option:',
        options: [
          'Both Statement I and Statement II are true',
          'Statement I is true but Statement II is false',
          'Statement I is false but Statement II is true',
          'Both Statement I and Statement II are false',
        ],
        correct_index: 0,
        explanation: 'Both are NCERT statements and both are true: the first-series metals (bar Cu) are oxidised by 1M $\\ce{H+}$ though sometimes slowly, and Ti and V are nonetheless passive to dilute non-oxidising acids at room temperature — the slow rate and the passivity are not contradictory.',
      },
    ], 0.6),
  ],
};
