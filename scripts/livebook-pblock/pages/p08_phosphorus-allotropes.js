// Ch.4 (p-Block) · Page 8 · Phosphorus — Allotropic Forms (NCERT §7.6).
// White / red / black phosphorus transcribed faithfully from NCERT. P4 tetrahedron
// with 60° angular strain (Fig. 7.2) and the polymeric red-phosphorus chains
// (Fig. 7.3) get dark hand-drawn `h.img` placeholders. Hosts In-text Questions
// 7.7 and 7.8. Enrichment confined to "Exam Point" callouts.
module.exports = {
  page_number: 8,
  chapter: 4,
  slug: 'phosphorus-allotropes',
  title: 'Phosphorus — Allotropic Forms',
  subtitle: 'White, red and black phosphorus — why the waxy white form glows and bursts into flame, while red phosphorus sits quietly in a matchbox.',
  tags: ['p-block', 'group-15', 'phosphorus', 'allotropes'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Three labelled samples of phosphorus side by side like a museum specimen plate: "White phosphorus" (a translucent waxy pale lump faintly luminous), "Red phosphorus" (a dull iron-grey powdery solid), and "Black phosphorus" (dark layered flaky crystals). A small inset of a P4 tetrahedron in the corner. Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Phosphorus comes in three important allotropes — white, red and black.'
    ),

    h.text(
      'Phosphorus is found in many allotropic forms, the important ones being **white, red and black**.'
    ),

    h.heading('White Phosphorus', 'Describe the appearance, reactivity and P₄ structure of white phosphorus.'),
    h.text(
      '**White phosphorus** is a translucent white waxy solid. It is poisonous, insoluble in water but soluble in carbon disulphide and **glows in dark (chemiluminescence)**. It dissolves in boiling NaOH solution in an inert atmosphere giving $\\ce{PH3}$.\n\n' +
      '$$\\ce{P4 + 3NaOH + 3H2O -> PH3 + 3NaH2PO2}\\ \\text{(sodium hypophosphite)}$$\n\n' +
      'White phosphorus is **less stable** and therefore **more reactive** than the other solid phases under normal conditions because of **angular strain in the $\\ce{P4}$ molecule where the angles are only 60°**. It readily catches fire in air to give dense white fumes of $\\ce{P4O10}$.\n\n' +
      '$$\\ce{P4 + 5O2 -> P4O10}$$\n\n' +
      'It consists of discrete tetrahedral $\\ce{P4}$ molecules as shown in Fig. 7.2.'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. A single discrete tetrahedral P4 molecule: four phosphorus atoms at the corners of a tetrahedron joined by six P–P bonds, with one of the internal P–P–P angles marked "60°" to highlight the angular strain. Clean inorganic textbook diagram, large and centred.',
      '4:3',
      'Fig. 7.2 — White phosphorus: a discrete tetrahedral P₄ molecule (P–P–P angle only 60°).'
    ),
    h.callout('exam_tip', 'Exam Point — why white P is so reactive',
      '- The $\\ce{P4}$ tetrahedron forces a **bond angle of just 60°** — a heavily strained, high-energy arrangement.\n' +
      '- That strain makes white phosphorus the **least stable, most reactive** allotrope: it ignites in air (stored *under water*) and glows in the dark.\n' +
      '- "**Glows in dark**" = **chemiluminescence** — a favourite one-word exam term.'),

    h.heading('Red Phosphorus', 'Explain how red phosphorus is made and why it is so much less reactive than white.'),
    h.text(
      '**Red phosphorus** is obtained by heating white phosphorus at **573 K in an inert atmosphere for several days**. When red phosphorus is heated under high pressure, a series of phases of black phosphorus are formed. Red phosphorus possesses **iron grey lustre**. It is **odourless, non-poisonous and insoluble in water as well as in carbon disulphide**. Chemically, **red phosphorus is much less reactive than white phosphorus. It does not glow in the dark.**\n\n' +
      'It is **polymeric**, consisting of chains of $\\ce{P4}$ tetrahedra linked together in the manner shown in Fig. 7.3.'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. The polymeric chain structure of red phosphorus: several P4 tetrahedra linked together corner-to-corner into a long zig-zag chain, each tetrahedron showing its phosphorus atoms, with the chain continuing off both ends. Clean inorganic textbook diagram, landscape.',
      '16:9',
      'Fig. 7.3 — Red phosphorus: chains of P₄ tetrahedra linked into a polymer.'
    ),

    h.heading('Black Phosphorus', 'State the two forms of black phosphorus and how each is prepared.'),
    h.text(
      '**Black phosphorus** has two forms — **α-black phosphorus** and **β-black phosphorus**.\n\n' +
      '- **α-Black phosphorus** is formed when red phosphorus is heated in a sealed tube at **803 K**. It can be sublimed in air and has **opaque monoclinic or rhombohedral crystals**. It **does not oxidise in air**.\n' +
      '- **β-Black phosphorus** is prepared by heating white phosphorus at **473 K under high pressure**. It **does not burn in air up to 673 K**.'
    ),
    h.callout('exam_tip', 'Exam Point — the allotrope comparison',
      'Reactivity falls **white > red > black**. Quick discriminators:\n\n' +
      '- **White:** P₄, 60° strain, glows (chemiluminescence), poisonous, soluble in $\\ce{CS2}$, ignites in air.\n' +
      '- **Red:** polymeric chains of P₄, iron-grey, non-poisonous, insoluble in water *and* $\\ce{CS2}$, no glow.\n' +
      '- **Black:** most stable; α from red at 803 K, β from white at 473 K under high pressure.'),

    h.worked('In-text Question 7.7', 'ncert_intext',
      'Bond angle in $\\ce{PH4+}$ is higher than that in $\\ce{PH3}$. Why?',
      'In $\\ce{PH3}$, phosphorus has **three bond pairs and one lone pair**; the lone pair–bond pair repulsion pushes the P–H bonds closer, giving a bond angle of about **93.6°**. In $\\ce{PH4+}$, the lone pair is used to form a fourth P–H bond by donating to $\\ce{H+}$, so there are **four bond pairs and no lone pair**. With only bond pair–bond pair repulsions left, the ion becomes a regular **tetrahedron with a bond angle of 109°28′**, which is higher than in $\\ce{PH3}$.'),
    h.worked('In-text Question 7.8', 'ncert_intext',
      'What happens when white phosphorus is heated with concentrated NaOH solution in an inert atmosphere of $\\ce{CO2}$?',
      'White phosphorus dissolves in boiling concentrated NaOH solution (in an inert atmosphere of $\\ce{CO2}$) to give **phosphine ($\\ce{PH3}$)** along with sodium hypophosphite:\n\n$$\\ce{P4 + 3NaOH + 3H2O -> PH3 + 3NaH2PO2}$$\n\nThe inert $\\ce{CO2}$ atmosphere is used because the phosphine evolved is otherwise inflammable in air.'),

    h.recap([
      { label: 'White P', text: 'Translucent waxy solid; **P₄ tetrahedron, 60° strain → most reactive**; poisonous, soluble in $\\ce{CS2}$, glows (chemiluminescence), ignites in air to $\\ce{P4O10}$; with hot NaOH → $\\ce{PH3}$.' },
      { label: 'Red P', text: 'Made by heating white P at **573 K** (inert atmosphere); **polymeric chains of P₄**; iron-grey, non-poisonous, insoluble in water and $\\ce{CS2}$; much less reactive, no glow.' },
      { label: 'Black P', text: 'α-form from red P at **803 K** (sealed tube), does not oxidise in air; β-form from white P at **473 K** under high pressure, does not burn up to 673 K.' },
      { label: 'Reactivity', text: 'White **>** red **>** black.' },
    ]),

    h.quiz([
      {
        question: 'White phosphorus is the most reactive allotrope chiefly because:',
        options: [
          'it is polymeric',
          'of the angular strain in the P₄ molecule, where the bond angle is only 60°',
          'it has an iron-grey lustre',
          'it is insoluble in carbon disulphide',
        ],
        correct_index: 1,
        explanation: 'White phosphorus exists as discrete $\\ce{P4}$ tetrahedra whose P–P–P angle is only 60°. This severe angular strain makes it high-energy, unstable and therefore the most reactive allotrope.',
      },
      {
        question: 'Which property is shown by white phosphorus but NOT by red phosphorus?',
        options: [
          'iron-grey lustre',
          'insolubility in carbon disulphide',
          'glowing in the dark (chemiluminescence)',
          'a polymeric chain structure',
        ],
        correct_index: 2,
        explanation: 'White phosphorus glows in the dark (chemiluminescence) and is soluble in $\\ce{CS2}$; red phosphorus does not glow, is insoluble in $\\ce{CS2}$, and is polymeric.',
      },
      {
        question: 'Red phosphorus is obtained by heating white phosphorus at:',
        options: [
          '573 K in an inert atmosphere for several days',
          '803 K in a sealed tube',
          '473 K under high pressure',
          '673 K in the presence of air',
        ],
        correct_index: 0,
        explanation: 'Red phosphorus is made by heating white phosphorus at 573 K in an inert atmosphere for several days; 803 K (sealed tube) gives α-black, and 473 K under high pressure gives β-black phosphorus.',
      },
      {
        question: 'The structure of red phosphorus is best described as:',
        options: [
          'discrete tetrahedral P₄ molecules',
          'a polymeric chain of P₄ tetrahedra linked together',
          'a diatomic P₂ molecule',
          'a square-planar arrangement of P atoms',
        ],
        correct_index: 1,
        explanation: 'Red phosphorus is polymeric, consisting of chains of $\\ce{P4}$ tetrahedra linked together (Fig. 7.3). Discrete tetrahedral $\\ce{P4}$ is the structure of white phosphorus.',
      },
      {
        question: 'When white phosphorus is dissolved in boiling NaOH solution in an inert atmosphere, the gas evolved is:',
        options: ['$\\ce{P4O10}$', '$\\ce{H2}$', '$\\ce{PH3}$', '$\\ce{N2}$'],
        correct_index: 2,
        explanation: 'White phosphorus reacts with hot NaOH to give phosphine: $\\ce{P4 + 3NaOH + 3H2O -> PH3 + 3NaH2PO2}$. The $\\ce{CO2}$ atmosphere keeps the inflammable $\\ce{PH3}$ from igniting.',
      },
      {
        question: 'α-Black phosphorus differs from white phosphorus in that it:',
        options: [
          'catches fire readily in air',
          'is poisonous and glows in the dark',
          'does not oxidise in air and is the more stable form',
          'is soluble in carbon disulphide',
        ],
        correct_index: 2,
        explanation: 'α-Black phosphorus (from red P heated at 803 K in a sealed tube) does not oxidise in air and is far more stable than white phosphorus, which ignites in air, is poisonous and glows in the dark.',
      },
    ], 0.6),
  ],
};
