// Ch.4 (p-Block) · Page 10 · Phosphorus Halides (NCERT §7.8).
// PCl3 (prep, hydrolysis, reaction with -OH compounds, sp3-pyramidal structure)
// and PCl5 (prep, hydrolysis, thermal decomposition, trigonal-bipyramidal gas
// structure, ionic solid [PCl4]+[PCl6]-). Structures as dark hand-drawn `h.img`.
// Hosts NCERT Examples 7.7, 7.8 + In-text Questions 7.9, 7.10. The axial-240 /
// equatorial-202 pm trap and the ionic-solid trap go in "Exam Point" callouts.
module.exports = {
  page_number: 10,
  chapter: 4,
  slug: 'phosphorus-halides',
  title: 'Phosphorus Halides (PCl₃, PCl₅)',
  subtitle: 'The fuming oily PCl₃ and the yellowish-white PCl₅ — their preparation, their violent hydrolysis, and the trigonal-bipyramidal structure that hides an ionic solid.',
  tags: ['p-block', 'group-15', 'phosphorus', 'halides', 'structure'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Two molecules side by side like a textbook plate: on the left a pyramidal PCl3 molecule (phosphorus with a lone pair, three chlorines) labelled "PCl3", on the right a trigonal-bipyramidal PCl5 molecule (central phosphorus with three equatorial and two axial chlorines) labelled "PCl5", with a small wisp of fumes rising from a drop of water near them. Clean inorganic-chemistry plate. Landscape, desktop-friendly.',
      '16:9',
      'Phosphorus forms two chlorides — pyramidal PCl₃ and trigonal-bipyramidal PCl₅.'
    ),

    h.text(
      'Phosphorus forms two types of halides, $\\ce{PX3}$ (X = F, Cl, Br, I) and $\\ce{PX5}$ (X = F, Cl, Br).'
    ),

    h.heading('Phosphorus Trichloride, PCl₃', 'Describe the preparation, hydrolysis, organic reactions and pyramidal structure of PCl₃.'),
    h.text(
      '**Preparation.** It is obtained by **passing dry chlorine over heated white phosphorus**.\n\n' +
      '$$\\ce{P4 + 6Cl2 -> 4PCl3}$$\n\n' +
      'It is also obtained by the **action of thionyl chloride with white phosphorus**.\n\n' +
      '$$\\ce{P4 + 8SOCl2 -> 4PCl3 + 4SO2 + 2S2Cl2}$$'
    ),
    h.text(
      '**Properties**\n\n' +
      '- It is a **colourless oily liquid** and **hydrolyses in the presence of moisture**.'
    ),
    h.text(
      '**Hydrolyses in moisture** (fumes in moist air, releasing HCl):\n\n' +
      '$$\\ce{PCl3 + 3H2O -> H3PO3 + 3HCl}$$'
    ),
    h.text(
      '**Reacts with –OH-containing organic compounds** such as $\\ce{CH3COOH}$ and $\\ce{C2H5OH}$:\n\n' +
      '$$\\ce{3CH3COOH + PCl3 -> 3CH3COCl + H3PO3}$$\n' +
      '$$\\ce{3C2H5OH + PCl3 -> 3C2H5Cl + H3PO3}$$'
    ),
    h.text(
      '**Structure.** It has a **pyramidal shape** in which phosphorus is **$sp^3$ hybridised** (three bond pairs and one lone pair).'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. A single pyramidal PCl3 molecule: phosphorus at the apex showing one lone pair as a small lobe on top, three P–Cl bonds going down to three chlorine atoms drawn with one bold wedge and one hashed bond to show 3D shape. Labelled "sp3 hybridised, pyramidal". Clean inorganic textbook diagram, centred.',
      '4:3',
      'PCl₃ — a trigonal-pyramidal molecule (sp³ phosphorus, one lone pair).'
    ),

    h.worked('NCERT Example 7.7', 'solved_example',
      'Why does $\\ce{PCl3}$ fume in moisture?',
      '$\\ce{PCl3}$ hydrolyses in the presence of moisture giving fumes of HCl.\n\n$$\\ce{PCl3 + 3H2O -> H3PO3 + 3HCl}$$'),

    h.heading('Phosphorus Pentachloride, PCl₅', 'Describe the preparation, hydrolysis, thermal decomposition and the trigonal-bipyramidal / ionic-solid structure of PCl₅.'),
    h.text(
      '**Preparation.** Phosphorus pentachloride is prepared by the reaction of white phosphorus with an **excess of dry chlorine**.\n\n' +
      '$$\\ce{P4 + 10Cl2 -> 4PCl5}$$\n\n' +
      'It can also be prepared by the **action of $\\ce{SO2Cl2}$ on phosphorus**.\n\n' +
      '$$\\ce{P4 + 10SO2Cl2 -> 4PCl5 + 10SO2}$$'
    ),
    h.text(
      '**Properties**\n\n' +
      '- $\\ce{PCl5}$ is a **yellowish white powder** and **in moist air it hydrolyses to $\\ce{POCl3}$ and finally gets converted to phosphoric acid**.'
    ),
    h.text(
      '**Hydrolyses** (via phosphorus oxychloride to phosphoric acid):\n\n' +
      '$$\\ce{PCl5 + H2O -> POCl3 + 2HCl}$$\n' +
      '$$\\ce{POCl3 + 3H2O -> H3PO4 + 3HCl}$$'
    ),
    h.text(
      '**Decomposes on heating.** When heated, it sublimes but decomposes on stronger heating.\n\n' +
      '$$\\ce{PCl5 ->[\\Delta] PCl3 + Cl2}$$'
    ),
    h.text(
      '**Reacts with –OH organic compounds**, converting them to chloro derivatives:\n\n' +
      '$$\\ce{C2H5OH + PCl5 -> C2H5Cl + POCl3 + HCl}$$\n' +
      '$$\\ce{CH3COOH + PCl5 -> CH3COCl + POCl3 + HCl}$$'
    ),
    h.text(
      '**Reacts with finely divided metals** on heating to give the corresponding chlorides:\n\n' +
      '$$\\ce{2Ag + PCl5 -> 2AgCl + PCl3}$$\n' +
      '$$\\ce{Sn + 2PCl5 -> SnCl4 + 2PCl3}$$'
    ),
    h.text(
      '**Structure.** In gaseous and liquid phases, it has a **trigonal bipyramidal structure**. The three **equatorial** P–Cl bonds are equivalent, while the two **axial** bonds are longer than equatorial bonds. This is due to the fact that the axial bond pairs suffer more repulsion as compared to equatorial bond pairs. **In the solid state it exists as an ionic solid, $\\ce{[PCl4]^{+}[PCl6]^{-}}$, in which the cation $\\ce{[PCl4]^{+}}$ is tetrahedral and the anion $\\ce{[PCl6]^{-}}$ octahedral.**'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. A trigonal-bipyramidal PCl5 molecule: central phosphorus with three equatorial P–Cl bonds in a flat triangle (each marked "202 pm") and two axial P–Cl bonds pointing straight up and down (each marked "240 pm"), clearly showing the axial bonds are longer. Beside it, a small inset of the solid-state ionic pair: a tetrahedral [PCl4]+ cation and an octahedral [PCl6]- anion. Clean inorganic textbook diagram, landscape.',
      '16:9',
      'PCl₅ — trigonal bipyramidal in gas/liquid (axial 240 pm > equatorial 202 pm); ionic [PCl₄]⁺[PCl₆]⁻ in the solid.'
    ),
    h.callout('exam_tip', 'Exam Point — the two PCl₅ traps',
      '- **Not all five P–Cl bonds are equal.** In the trigonal bipyramid the **two axial bonds (240 pm) are longer** than the **three equatorial bonds (202 pm)** because axial bond pairs face more repulsion.\n' +
      '- **Solid PCl₅ is ionic:** $\\ce{[PCl4]^{+}[PCl6]^{-}}$ — a **tetrahedral** ($sp^3$) cation and an **octahedral** ($sp^3d^2$) anion. A favourite "structure in the solid state" question.'),

    h.worked('NCERT Example 7.8', 'solved_example',
      'Are all the five bonds in $\\ce{PCl5}$ molecule equivalent? Justify your answer.',
      '$\\ce{PCl5}$ has a trigonal bipyramidal structure and the three equatorial P–Cl bonds are equivalent, while the two axial bonds are different and longer than equatorial bonds.'),
    h.worked('In-text Question 7.9', 'ncert_intext',
      'What happens when $\\ce{PCl5}$ is heated?',
      'On heating, $\\ce{PCl5}$ first sublimes, but on stronger heating it decomposes (dissociates) into phosphorus trichloride and chlorine:\n\n$$\\ce{PCl5 ->[\\Delta] PCl3 + Cl2}$$'),
    h.worked('In-text Question 7.10', 'ncert_intext',
      'Write a balanced equation for the hydrolytic reaction of $\\ce{PCl5}$ in heavy water.',
      'With heavy water ($\\ce{D2O}$), $\\ce{PCl5}$ hydrolyses just as it does with ordinary water, giving phosphorus oxychloride and DCl, which on further hydrolysis gives deuterated phosphoric acid:\n\n$$\\ce{PCl5 + D2O -> POCl3 + 2DCl}$$\n$$\\ce{POCl3 + 3D2O -> D3PO4 + 3DCl}$$'),

    h.heading('Uses'),
    h.text(
      '$\\ce{PCl5}$ is used in the **synthesis of some organic compounds**, e.g., $\\ce{C2H5Cl}$, $\\ce{CH3COCl}$.'
    ),

    h.recap([
      { label: 'PCl₃', text: 'Made by dry $\\ce{Cl2}$ over white P ($\\ce{P4 + 6Cl2 -> 4PCl3}$) or $\\ce{SOCl2}$; colourless oily liquid; **fumes/hydrolyses** → $\\ce{H3PO3 + HCl}$; **pyramidal, $sp^3$**.' },
      { label: 'PCl₅', text: 'Made by excess dry $\\ce{Cl2}$ on white P ($\\ce{P4 + 10Cl2 -> 4PCl5}$); yellowish-white powder; hydrolyses via $\\ce{POCl3}$ → $\\ce{H3PO4}$; on heating $\\ce{PCl5 -> PCl3 + Cl2}$.' },
      { label: 'PCl₅ structure', text: 'Gas/liquid = **trigonal bipyramidal**, axial bonds **240 pm > equatorial 202 pm**; solid = **ionic $\\ce{[PCl4]^{+}[PCl6]^{-}}$** (tetrahedral cation, octahedral anion).' },
      { label: 'With –OH', text: 'Both convert alcohols/acids to chloro derivatives; $\\ce{PCl5}$ also gives $\\ce{POCl3}$.' },
    ]),

    h.quiz([
      {
        question: 'Phosphorus trichloride fumes in moist air because it:',
        options: [
          'sublimes readily',
          'hydrolyses to give H₃PO₃ and HCl',
          'decomposes into P₄ and Cl₂',
          'forms an ionic solid',
        ],
        correct_index: 1,
        explanation: '$\\ce{PCl3}$ hydrolyses in moisture: $\\ce{PCl3 + 3H2O -> H3PO3 + 3HCl}$. The HCl gives the white fumes.',
      },
      {
        question: 'The geometry and hybridisation of the PCl₃ molecule are:',
        options: [
          'pyramidal, sp³',
          'trigonal planar, sp²',
          'trigonal bipyramidal, sp³d',
          'octahedral, sp³d²',
        ],
        correct_index: 0,
        explanation: '$\\ce{PCl3}$ has three bond pairs and one lone pair on phosphorus, giving an $sp^3$-hybridised pyramidal shape.',
      },
      {
        question: 'In the gaseous trigonal-bipyramidal PCl₅ molecule:',
        options: [
          'all five P–Cl bonds are identical',
          'the three axial bonds are shorter than the two equatorial bonds',
          'the two axial bonds (240 pm) are longer than the three equatorial bonds (202 pm)',
          'phosphorus is sp³ hybridised',
        ],
        correct_index: 2,
        explanation: 'The two axial P–Cl bonds suffer greater repulsion, so they are longer (240 pm) than the three equivalent equatorial bonds (202 pm). The bonds are NOT all equivalent.',
      },
      {
        question: 'In the solid state, PCl₅ exists as:',
        options: [
          'discrete trigonal-bipyramidal molecules',
          'the ionic solid [PCl₄]⁺[PCl₆]⁻',
          'a polymeric chain of PCl₅ units',
          'PCl₃ and Cl₂',
        ],
        correct_index: 1,
        explanation: 'Solid $\\ce{PCl5}$ is ionic: $\\ce{[PCl4]^{+}[PCl6]^{-}}$, with a tetrahedral cation and an octahedral anion.',
      },
      {
        question: 'When PCl₅ is heated strongly it:',
        options: [
          'melts to a clear liquid only',
          'decomposes into PCl₃ and Cl₂',
          'hydrolyses to phosphoric acid',
          'forms POCl₃ and HCl',
        ],
        correct_index: 1,
        explanation: 'On stronger heating $\\ce{PCl5}$ dissociates: $\\ce{PCl5 ->[\\Delta] PCl3 + Cl2}$. (It first sublimes on gentler heating.)',
      },
      {
        question: 'PCl₅ on hydrolysis in moist air finally gives:',
        options: [
          'phosphorous acid, H₃PO₃',
          'hypophosphorous acid, H₃PO₂',
          'phosphoric acid, H₃PO₄ (via POCl₃)',
          'phosphine, PH₃',
        ],
        correct_index: 2,
        explanation: '$\\ce{PCl5}$ first hydrolyses to $\\ce{POCl3}$ ($\\ce{PCl5 + H2O -> POCl3 + 2HCl}$), which then hydrolyses to phosphoric acid ($\\ce{POCl3 + 3H2O -> H3PO4 + 3HCl}$).',
      },
    ], 0.6),
  ],
};
