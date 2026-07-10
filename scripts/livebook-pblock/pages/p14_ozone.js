// Ch.4 (p-Block) · Page 14 · Ozone (NCERT §7.13).
// Compound-page format: hero img → allotrope intro → preparation (silent
// electric discharge, endothermic) → properties (bullets + oxidising-agent
// reactions) → structure img (117° resonance hybrid) → ozone-layer note →
// uses. NCERT transcribed faithfully; notes-enrichment in `exam_tip`.
// Hosts In-text Questions 7.18 & 7.19.
module.exports = {
  page_number: 14,
  chapter: 4,
  slug: 'ozone',
  title: 'Ozone',
  subtitle: 'An allotrope of oxygen made by silent electric discharge — endothermic to form, a powerful oxidiser, the shield of the upper atmosphere, and an angular 117° resonance hybrid.',
  tags: ['p-block', 'group-16', 'ozone', 'oxygen', 'allotrope'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Central motif: a bent three-atom ozone (O₃) molecule drawn as a chalk-and-coloured-pencil textbook sketch with the angle marked, set against a faint curved band high above a sketched Earth horizon to suggest the protective ozone layer in the stratosphere. Clean inorganic plate, landscape, desktop-friendly.',
      '16:9',
      'Ozone — an allotrope of oxygen that shields the earth from ultraviolet radiation.'
    ),

    h.text(
      'Ozone is an allotropic form of oxygen. It is too reactive to remain for long in the atmosphere at sea level. At a height of about **20 kilometres**, it is formed from atmospheric oxygen in the presence of sunlight. This ozone layer protects the earth’s surface from an excessive concentration of **ultraviolet (UV) radiations**.'
    ),

    h.heading('Preparation', 'Explain how ozone is prepared and why the process needs a silent electric discharge.'),
    h.text(
      'When a slow dry stream of oxygen is passed through a **silent electrical discharge**, conversion of oxygen to ozone (10%) occurs. The product is known as **ozonised oxygen**.\n\n' +
      '$$\\ce{3O2 -> 2O3} \\qquad \\Delta H^\\ominus\\ (298\\ \\text{K}) = +142\\ \\text{kJ mol}^{-1}$$\n\n' +
      'Since the formation of ozone from oxygen is an **endothermic process**, it is necessary to use a silent electrical discharge in its preparation to prevent its decomposition.\n\n' +
      'If concentrations of ozone greater than 10 per cent are required, a battery of ozonisers can be used, and pure ozone (b.p. 385 K) can be condensed in a vessel surrounded by liquid oxygen.'
    ),
    h.callout('exam_tip', 'Exam Point — why "silent" discharge, and why endothermic matters',
      'The reaction $\\ce{3O2 -> 2O3}$ is **endothermic ($\\Delta H = +142$ kJ mol⁻¹)**, so $\\ce{O3}$ is thermodynamically *unstable* with respect to $\\ce{O2}$. A noisy (sparking) discharge releases heat that would decompose the ozone back to oxygen — hence a **silent** electric discharge is used to build it up.'),

    h.heading('Properties', 'Describe the physical properties of ozone and explain why it is a powerful oxidising agent.'),
    h.text(
      '**Physical properties**\n\n' +
      '- Pure ozone is a **pale blue gas**, **dark blue liquid** and **violet-black solid**.\n' +
      '- It has a characteristic smell and in small concentrations it is harmless. However, if the concentration rises above about **100 parts per million**, breathing becomes uncomfortable resulting in headache and nausea.\n' +
      '- Ozone is **thermodynamically unstable with respect to oxygen**, since its decomposition into oxygen results in the liberation of heat ($\\Delta H$ is negative) and an increase in entropy ($\\Delta S$ is positive). These two effects reinforce each other, resulting in large negative Gibbs energy change ($\\Delta G$) for its conversion into oxygen. It is not really surprising, therefore, that **high concentrations of ozone can be dangerously explosive.**'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Powerful oxidising agent.** Due to the ease with which it liberates atoms of nascent oxygen ($\\ce{O3 -> O2 + O}$), it acts as a powerful oxidising agent. For example, it oxidises lead sulphide to lead sulphate and iodide ions to iodine.\n\n' +
      '$$\\ce{PbS(s) + 4O3(g) -> PbSO4(s) + 4O2(g)}$$\n' +
      '$$\\ce{2I^{-}(aq) + H2O(l) + O3(g) -> 2OH^{-}(aq) + I2(s) + O2(g)}$$\n\n' +
      'When ozone reacts with an excess of potassium iodide solution buffered with a borate buffer (pH 9.2), iodine is liberated which can be titrated against a standard solution of sodium thiosulphate. This is a **quantitative method for estimating $\\ce{O3}$ gas.**'
    ),
    h.text(
      '**Depletion of the ozone layer.** Experiments have shown that **nitrogen oxides (particularly nitric oxide) combine very rapidly with ozone** and there is, thus, the possibility that nitrogen oxides emitted from the exhaust systems of supersonic jet aeroplanes might be slowly depleting the concentration of the ozone layer in the upper atmosphere.\n\n' +
      '$$\\ce{NO(g) + O3(g) -> NO2(g) + O2(g)}$$\n\n' +
      'Another threat to this ozone layer is probably posed by the use of **freons** which are used in aerosol sprays and as refrigerants.'
    ),

    h.heading('Structure', 'Describe the structure of the ozone molecule.'),
    h.text(
      'The two oxygen–oxygen bond lengths in the ozone molecule are **identical (128 pm)** and the molecule is **angular** as expected with a bond angle of about **117°**. It is a **resonance hybrid** of two main forms.'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. The ozone (O₃) molecule shown as a resonance hybrid: two bent O–O–O structures side by side joined by a double-headed resonance arrow, each oxygen drawn with its lone pairs as small lobes, the central O–O–O bond angle marked about 117° and both O–O bond lengths marked 128 pm. Clean inorganic textbook diagram, large and centred.',
      '4:3',
      'Ozone is angular (≈117°) with two equal O–O bonds (128 pm) — a resonance hybrid.'
    ),

    h.worked('In-text Question 7.18', 'ncert_intext',
      'Why does $\\ce{O3}$ act as a powerful oxidising agent?',
      'Ozone is thermodynamically unstable with respect to oxygen and readily liberates **nascent (atomic) oxygen**:\n\n$$\\ce{O3 -> O2 + O}$$\n\nThis atom of nascent oxygen is highly reactive, so ozone behaves as a powerful oxidising agent (e.g. it oxidises $\\ce{PbS}$ to $\\ce{PbSO4}$ and $\\ce{I-}$ to $\\ce{I2}$).'),
    h.worked('In-text Question 7.19', 'ncert_intext',
      'How is $\\ce{O3}$ estimated quantitatively?',
      'When ozone reacts with an excess of potassium iodide solution buffered with a borate buffer (pH 9.2), **iodine is liberated**. This iodine is then titrated against a standard solution of **sodium thiosulphate**, and from the amount of iodine the quantity of ozone is calculated — a quantitative method for estimating $\\ce{O3}$ gas.'),

    h.heading('Uses'),
    h.text(
      'It is used as a germicide, disinfectant and for sterilising water. It is also used for bleaching oils, ivory, flour, starch, etc. It acts as an oxidising agent in the manufacture of potassium permanganate.'
    ),

    h.recap([
      { label: 'Made by', text: 'silent electric discharge through dry $\\ce{O2}$ → 10% ozonised oxygen; $\\ce{3O2 -> 2O3}$, $\\Delta H = +142$ kJ mol⁻¹ (**endothermic**).' },
      { label: 'Why silent discharge', text: 'ozone is thermodynamically unstable; a noisy/heat-releasing discharge would decompose it back to $\\ce{O2}$.' },
      { label: 'Properties', text: 'pale-blue gas → dark-blue liquid → violet-black solid; **powerful oxidiser** (liberates nascent O, $\\ce{O3 -> O2 + O}$); high concentrations explosive.' },
      { label: 'Ozone layer', text: 'shields earth from UV; depleted by **NO** ($\\ce{NO + O3 -> NO2 + O2}$) and freons.' },
      { label: 'Structure', text: 'angular, **≈117°**, two equal O–O bonds (128 pm), **resonance hybrid**.' },
    ]),

    h.quiz([
      {
        question: 'Ozone is prepared by passing dry oxygen through:',
        options: [
          'a silent electrical discharge',
          'a noisy sparking discharge',
          'concentrated sulphuric acid',
          'a hot platinum gauze',
        ],
        correct_index: 0,
        explanation: 'A silent electrical discharge converts about 10% of $\\ce{O2}$ to $\\ce{O3}$ without releasing the heat that would decompose ozone.',
      },
      {
        question: 'The formation of ozone from oxygen, $\\ce{3O2 -> 2O3}$, is:',
        options: [
          'exothermic (ΔH = −142 kJ mol⁻¹)',
          'endothermic (ΔH = +142 kJ mol⁻¹)',
          'thermoneutral',
          'spontaneous at all temperatures',
        ],
        correct_index: 1,
        explanation: 'It is endothermic, $\\Delta H^\\ominus = +142$ kJ mol⁻¹, which is why ozone is thermodynamically unstable with respect to oxygen.',
      },
      {
        question: 'Ozone acts as a powerful oxidising agent because it:',
        options: [
          'is a stable molecule',
          'forms hydrogen bonds',
          'readily liberates nascent oxygen (O₃ → O₂ + O)',
          'is paramagnetic',
        ],
        correct_index: 2,
        explanation: 'Ozone easily decomposes to give a highly reactive atom of nascent oxygen, $\\ce{O3 -> O2 + O}$, which makes it a powerful oxidiser.',
      },
      {
        question: 'The ozone molecule is:',
        options: [
          'linear with a bond angle of 180°',
          'tetrahedral',
          'angular with two unequal O–O bonds',
          'angular with a bond angle of about 117° and two equal O–O bonds',
        ],
        correct_index: 3,
        explanation: 'Ozone is angular (≈117°) with two identical O–O bond lengths (128 pm); it is a resonance hybrid of two structures.',
      },
      {
        question: 'Ozone in the upper atmosphere is depleted particularly rapidly by:',
        options: ['nitric oxide (NO) and freons', 'carbon dioxide', 'water vapour', 'argon'],
        correct_index: 0,
        explanation: 'Nitric oxide reacts rapidly with ozone ($\\ce{NO + O3 -> NO2 + O2}$); freons used in sprays and refrigerants are another threat to the ozone layer.',
      },
      {
        question: 'Ozone is estimated quantitatively by reacting it with excess buffered KI solution and then:',
        options: [
          'weighing the precipitate formed',
          'measuring the gas volume',
          'titrating the liberated iodine against standard sodium thiosulphate',
          'measuring the pH change',
        ],
        correct_index: 2,
        explanation: 'Ozone liberates iodine from buffered KI; the iodine is titrated against standard sodium thiosulphate to estimate the amount of $\\ce{O3}$.',
      },
    ], 0.6),
  ],
};
