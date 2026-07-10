// Ch.5 (d- & f-Block) · Page 20 · Applications of d- and f-Block Elements
// NCERT §8.7 Some Applications of d- and f-Block Elements (PDF pp.232-233).
// NCERT content transcribed faithfully (same language/catalysts/uses);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// No NCERT Examples in this section. Devices: "🔍 Decode This" (A-R trainer)
// + "🏛️ Exam Vault" (a catalyst-matching item built only from NCERT §8.7 lines).
// Quiz uses "which statement is correct" / match-style items.
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 14,
  chapter: 5,
  slug: 'applications',
  title: 'Applications of d- and f-Block Elements',
  subtitle: 'Where the transition and inner-transition metals actually earn their keep — from steel and pigments to the named industrial catalysts (contact, Ziegler, Haber, Wacker) and the photographic plate.',
  tags: ['d-block', 'f-block', 'applications', 'catalysts', 'industrial-chemistry'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a small "industry workbench" laid out as labelled stations, each a hand-drawn icon with a caption — a girder labelled "iron & steel", a white paint tin labelled "TiO2 pigment", a dry cell labelled "MnO2 cell", a battery labelled "Zn, Ni/Cd", a coin stack labelled "coinage metals", and four reaction flasks tagged with catalysts "V2O5 (contact)", "Fe (Haber)", "Ni (hydrogenation)", "PdCl2 (Wacker)", plus a small photographic plate labelled "AgBr". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'The d- and f-block metals at work: structural steel, pigments and batteries, the named industrial catalysts, and silver bromide for photography.'
    ),

    h.heading('8.7 Some Applications of d- and f-Block Elements', 'Recall the structural, pigment, battery, coinage, catalytic and photographic applications of the d- and f-block elements.'),
    h.text(
      '**Iron and steels** are the most important construction materials. Their production is based on the reduction of iron oxides, the removal of impurities and the addition of carbon and alloying metals such as Cr, Mn and Ni. Some compounds are manufactured for special purposes such as **$\\ce{TiO}$ for the pigment industry** and **$\\ce{MnO2}$ for use in dry battery cells.** The battery industry also requires **Zn and Ni/Cd.**\n\n' +
      'The elements of **Group 11 are still worthy of being called the coinage metals**, although Ag and Au are restricted to collection items and the contemporary UK \'copper\' coins are copper-coated steel. The \'silver\' UK coins are a Cu/Ni alloy.'
    ),
    h.text(
      'Many of the metals and/or their compounds are **essential catalysts in the chemical industry.**\n\n' +
      '- **$\\ce{V2O5}$** catalyses the oxidation of $\\ce{SO2}$ in the manufacture of sulphuric acid *(the contact process)*.\n' +
      '- **$\\ce{TiCl4}$ with $\\ce{Al(CH3)3}$** forms the basis of the **Ziegler catalysts** used to manufacture polyethylene (polythene).\n' +
      '- **Iron catalysts** are used in the **Haber process** for the production of ammonia from $\\ce{N2}$/$\\ce{H2}$ mixtures.\n' +
      '- **Nickel catalysts** enable the **hydrogenation of fats** to proceed.\n' +
      '- In the **Wacker process** the oxidation of ethyne to ethanal is catalysed by **$\\ce{PdCl2}$.**\n' +
      '- **Nickel complexes** are useful in the polymerisation of alkynes and other organic compounds such as benzene.\n\n' +
      'The **photographic industry relies on the special light-sensitive properties of $\\ce{AgBr}$.**'
    ),
    h.text(
      'Among the f-block metals, the best single use of the lanthanoids is for the production of **alloy steels** for plates and pipes; the well known alloy **mischmetall** (~95% lanthanoid metal + ~5% iron, with traces of S, C, Ca and Al) is used in Mg-based alloy to produce bullets, shell and lighter flint. Mixed oxides of lanthanoids are employed as **catalysts in petroleum cracking**, and some individual Ln oxides serve as **phosphors** in television screens and similar fluorescing surfaces.'
    ),

    h.callout('exam_tip', 'Exam Point — lock the catalyst ↔ process pairs',
      'These four named pairs are repeat offenders in the exam — memorise the catalyst with its process *and* its product:\n\n' +
      '- **$\\ce{V2O5}$ → Contact process** → $\\ce{SO2}$ to $\\ce{SO3}$ (sulphuric acid)\n' +
      '- **$\\ce{TiCl4}$ + $\\ce{Al(CH3)3}$ → Ziegler catalyst** → polythene (polyethylene)\n' +
      '- **Fe → Haber process** → ammonia from $\\ce{N2}$ + $\\ce{H2}$\n' +
      '- **$\\ce{PdCl2}$ → Wacker process** → ethyne (ethene) to ethanal\n\n' +
      'Plus two single-metal staples: **Ni → hydrogenation of fats**, and **$\\ce{AgBr}$ → photography.** If a match-the-column question appears, it is almost always built from this exact list.'),

    // ── 🔍 Decode This — the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT often hands you a **catalyst** and the **process it drives** in the same breath. Examiners turn that pair into a **match-the-column** or **statement-correctness** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"Iron catalysts are used in the Haber process for the production of ammonia."*\n' +
      '> **NCERT (fact):** *"$\\ce{V2O5}$ catalyses the oxidation of $\\ce{SO2}$ in the manufacture of sulphuric acid."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Statement I:** Iron is the catalyst in the Haber process. **(True)**\n' +
      '- **Statement II:** $\\ce{V2O5}$ is the catalyst in the contact process. **(True)**\n\n' +
      '**Your move:** read every "catalyst → process → product" line in §8.7 as a ready-made match pair. Build the four-row table in your head ($\\ce{V2O5}$/contact, Ziegler/polythene, Fe/Haber, $\\ce{PdCl2}$/Wacker) and any matching question becomes a lookup.'),

    // ── 🏛️ Exam Vault — built only from NCERT §8.7 catalyst lines, answer self-verified ──
    h.worked('🏛️ Exam Vault · catalyst-matching (NCERT §8.7)', 'solved_example',
      'Match each industrial process in List-I with its correct catalyst in List-II:\n\n' +
      'List-I (Process)  —  List-II (Catalyst)\n' +
      '(a) Contact process  (i) Iron (Fe)\n' +
      '(b) Haber process  (ii) $\\ce{PdCl2}$\n' +
      '(c) Ziegler polymerisation of ethene  (iii) $\\ce{V2O5}$\n' +
      '(d) Wacker oxidation of ethene to ethanal  (iv) $\\ce{TiCl4}$ + $\\ce{Al(CH3)3}$\n\n' +
      '(1) a-iii, b-i, c-iv, d-ii   (2) a-i, b-iii, c-ii, d-iv   (3) a-iv, b-ii, c-i, d-iii   (4) a-ii, b-iv, c-iii, d-i',
      '**Answer: (1) a-iii, b-i, c-iv, d-ii.** Straight from NCERT §8.7: the **contact process** uses **$\\ce{V2O5}$** to oxidise $\\ce{SO2}$ (a-iii); the **Haber process** uses an **iron** catalyst for ammonia (b-i); the **Ziegler catalyst** for polythene is **$\\ce{TiCl4}$ with $\\ce{Al(CH3)3}$** (c-iv); and the **Wacker process** (ethene → ethanal) is catalysed by **$\\ce{PdCl2}$** (d-ii).\n\n' +
      '**Notice:** every pair here is a verbatim NCERT §8.7 sentence — learn the four catalyst lines and the match is automatic.'),

    h.recap([
      { label: 'Structural & pigments', text: '**Iron/steel** (with Cr, Mn, Ni alloying) is the chief construction metal; **$\\ce{TiO}$** is a pigment and **$\\ce{MnO2}$** runs dry cells.' },
      { label: 'Batteries & coins', text: 'The battery industry needs **Zn and Ni/Cd**; Group 11 are the **coinage metals** (UK \'silver\' coins are a **Cu/Ni** alloy).' },
      { label: 'Named catalysts', text: '**$\\ce{V2O5}$** (contact), **$\\ce{TiCl4}$+$\\ce{Al(CH3)3}$** (Ziegler → polythene), **Fe** (Haber → $\\ce{NH3}$), **$\\ce{PdCl2}$** (Wacker → ethanal), **Ni** (hydrogenation of fats).' },
      { label: 'Photography', text: 'The photographic industry relies on the light-sensitive **$\\ce{AgBr}$.**' },
      { label: 'f-block uses', text: 'Lanthanoids → **alloy steels** and **mischmetall** (flints, bullets); **mixed Ln oxides** catalyse petroleum cracking and act as **phosphors** in TV screens.' },
    ]),

    h.quiz([
      {
        question: 'Which catalyst is used in the contact process for the manufacture of sulphuric acid?',
        options: ['$\\ce{V2O5}$', '$\\ce{PdCl2}$', 'Iron', '$\\ce{TiCl4}$'],
        correct_index: 0,
        explanation: '$\\ce{V2O5}$ catalyses the oxidation of $\\ce{SO2}$ to $\\ce{SO3}$ in the contact process. $\\ce{PdCl2}$ drives the Wacker process, iron the Haber process, and $\\ce{TiCl4}$ (with $\\ce{Al(CH3)3}$) the Ziegler polymerisation.',
      },
      {
        question: 'The Ziegler catalysts used to manufacture polythene are based on:',
        options: [
          '$\\ce{V2O5}$ alone',
          '$\\ce{TiCl4}$ with $\\ce{Al(CH3)3}$',
          'an iron catalyst',
          '$\\ce{AgBr}$',
        ],
        correct_index: 1,
        explanation: 'NCERT states $\\ce{TiCl4}$ with $\\ce{Al(CH3)3}$ forms the basis of the Ziegler catalysts for polyethylene (polythene). $\\ce{V2O5}$, iron and $\\ce{AgBr}$ belong to the contact process, Haber process and photography respectively.',
      },
      {
        question: 'In the Wacker process, $\\ce{PdCl2}$ catalyses the oxidation of:',
        options: [
          '$\\ce{SO2}$ to $\\ce{SO3}$',
          '$\\ce{N2}$ and $\\ce{H2}$ to ammonia',
          'fats during hydrogenation',
          'ethyne (ethene) to ethanal',
        ],
        correct_index: 3,
        explanation: 'NCERT credits the Wacker process — the oxidation of ethene to ethanal — to $\\ce{PdCl2}$. $\\ce{SO2}$ oxidation is the contact process ($\\ce{V2O5}$), ammonia is the Haber process (Fe), and hydrogenation of fats uses nickel.',
      },
      {
        question: 'Which of the following statements about applications of these elements is correct?',
        options: [
          '$\\ce{MnO2}$ is used as a pigment and $\\ce{TiO}$ in dry cells',
          'Iron is the catalyst in the Wacker process',
          'Nickel catalysts enable the hydrogenation of fats, and $\\ce{AgBr}$ is used in photography',
          'The battery industry has no use for Zn or Cd',
        ],
        correct_index: 2,
        explanation: 'NCERT states nickel catalyses the hydrogenation of fats and that the photographic industry relies on the light-sensitive $\\ce{AgBr}$. The other options swap the roles: $\\ce{TiO}$ is the pigment and $\\ce{MnO2}$ the dry-cell material; iron drives the Haber (not Wacker) process; and Zn and Ni/Cd are needed by the battery industry.',
      },
      {
        question: 'The well known alloy mischmetall is used for lighter flints. Mixed oxides of the lanthanoids, by contrast, are used as:',
        options: [
          'the anode in dry cells',
          'the basis of the Ziegler catalyst',
          'a substitute for $\\ce{AgBr}$ in photography',
          'catalysts in petroleum cracking and as phosphors in television screens',
        ],
        correct_index: 3,
        explanation: 'NCERT says mixed oxides of lanthanoids are employed as catalysts in petroleum cracking, and individual Ln oxides serve as phosphors in television screens. The Ziegler catalyst is $\\ce{TiCl4}$+$\\ce{Al(CH3)3}$, and photography depends specifically on $\\ce{AgBr}$.',
      },
      {
        question: 'Which match between catalyst and process is INCORRECT?',
        options: [
          'Iron — Haber process (ammonia)',
          '$\\ce{V2O5}$ — contact process (sulphuric acid)',
          '$\\ce{PdCl2}$ — Haber process (ammonia)',
          'Nickel — hydrogenation of fats',
        ],
        correct_index: 2,
        explanation: '$\\ce{PdCl2}$ belongs to the Wacker process (ethene → ethanal), not the Haber process — the Haber catalyst is iron. The other three pairings are exactly as NCERT gives them.',
      },
    ], 0.6),
  ],
};
