// IEQ page 1 — "Ions in Water: Electrolytes".
// Sub-topic: ionic equilibrium = balance HA <=> H+ + A-; electrolytes vs
// non-electrolytes; strong (alpha ~ 1) vs weak (alpha < 1); why the solvent
// matters. HIS analogy (IEQ-exemplars A): salt in water vs salt in oil — no
// solvation/hydration energy in oil, lattice never breaks; water's high
// dielectric constant (~80) cuts ion-ion attraction so ions separate.
// Sources: founder notes pp 2-3 (Substances tree, strong/weak, alpha) +
// NCERT §7.9-7.10 (Faraday classification, dielectric constant 80, NaCl
// cluster stabilised by hydration). §5.X audited: no "Not X. It is Y." pairs,
// no banned stacked metaphors, <=1 em-dash/para, second person, say-it-once.
module.exports = {
  page_number: 1,
  slug: 'ionic-equilibrium-and-electrolytes',
  page_type: 'lesson',
  title: 'Ions in Water: Electrolytes',
  subtitle: "Why some solutions conduct and some don't.",
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Two beakers connected to a simple battery and a light bulb circuit, drawn like a chemist sketched it. The left beaker labelled faintly "salt water" has its bulb glowing warm amber and tiny scattered + and - ion dots drifting between two electrodes. The right beaker labelled faintly "sugar water" has a dark, unlit bulb and only neutral whole-molecule blobs floating, no separated charges. Calm science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Pure Water Is a Poor Conductor',
        "Dip two wires from a battery into truly pure water and almost no current flows. Stir in a pinch of table salt and the same water lights a bulb. The water did not change. What changed is that the salt broke up into charged ions that are free to drift toward the wires and carry the current. No free ions, no conduction."),
      h.text(
        "When a substance dissolves in water, one of two things happens. Either it breaks up into charged **ions**, or it stays as whole, uncharged molecules. The split between these two outcomes is the whole story of this page, and it starts an equilibrium you will use for the rest of the chapter:\n\n" +
        "$$HA \\rightleftharpoons H^+ + A^-$$\n\n" +
        "Substances that break into ions in water are called **electrolytes**, because their solutions conduct electricity. Salt ($\\ce{NaCl}$), hydrochloric acid ($\\ce{HCl}$) and acetic acid ($\\ce{CH3COOH}$) are all electrolytes. Substances that dissolve as whole molecules and leave no free ions are **non-electrolytes**. Sugar and urea dissolve happily in water, yet their solutions carry no current, because nothing in them is charged."
      ),
      h.heading('Strong and weak electrolytes', 'Distinguish strong electrolytes (α ≈ 1) from weak ones (α < 1) by how completely they ionise.'),
      h.text(
        "Not every electrolyte breaks up to the same extent. The fraction of it that splits into ions is its **degree of dissociation**, written $\\alpha$.\n\n" +
        "A **strong electrolyte** ionises almost completely in water, so $\\alpha \\approx 1$. Dissolve $\\ce{NaCl}$ and you get sodium ions and chloride ions with essentially no whole $\\ce{NaCl}$ left. Strong acids like $\\ce{HCl}$, strong bases, and most salts behave this way:\n\n" +
        "$$\\ce{NaCl -> Na+ + Cl-} \\qquad \\ce{HCl -> H+ + Cl-}$$\n\n" +
        "A **weak electrolyte** ionises only partly, so $\\alpha < 1$. Most of it stays as whole molecules and only a small fraction breaks into ions. Acetic acid ($\\ce{CH3COOH}$), ammonium hydroxide ($\\ce{NH4OH}$) and hydrocyanic acid ($\\ce{HCN}$) are weak. Notice the arrows change: a strong electrolyte gets a one-way $\\rightarrow$, while a weak one keeps the equilibrium $\\rightleftharpoons$, because the unbroken molecules and the ions sit in balance together:\n\n" +
        "$$\\ce{CH3COOH <=> CH3COO- + H+} \\qquad \\ce{NH4OH <=> NH4+ + OH-}$$"
      ),
      h.text(
        "Whether a substance ionises at all depends not just on the substance but on the **solvent** you put it in. Think about common salt. It dissolves into ions in water, but stir the same salt into cooking oil and it just sits there, undissolved. Water pulls $\\ce{NaCl}$ apart while oil leaves it untouched.\n\n" +
        "The reason is what the solvent does for the ions. In water, each $\\ce{Na+}$ and each $\\ce{Cl-}$ gets wrapped in a shell of water molecules, and that **hydration** releases enough energy to pay for tearing the crystal apart. Oil offers no such wrapping, so there is no energy to break the lattice, and the salt stays whole. Water also has a high **dielectric constant** of about **80**, which means it weakens the pull between a positive and a negative ion by a factor of 80. With the attraction cut that far, the freed ions drift apart instead of snapping back together. A good electrolyte in water is not automatically a good electrolyte everywhere."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two labelled panels side by side, science-notebook style with neat hand-lettering. PANEL 1 "NaCl in water": a beaker of water where a corner of a cubic NaCl lattice is dissolving; separated Na+ ions (small, warm) and Cl- ions (larger, cool) each surrounded by a rosette of bent polar water molecules with their negative oxygen ends turned toward Na+ and positive hydrogen ends toward Cl-; note "hydration pulls the ions apart". PANEL 2 "NaCl in oil": an intact cubic NaCl lattice sitting whole at the bottom of a beaker of oil, oil molecules drawn as plain non-polar chains that do not surround the ions; note "no hydration, lattice stays whole". Clean, uncluttered, hand-lettered.',
        '16:9',
        'In water, polar molecules wrap each Na⁺ and Cl⁻ and pull the lattice apart; in non-polar oil there is no hydration, so the crystal stays whole and undissolved.'
      ),
      h.reasoning('logical',
        "Two students dissolve equal amounts of solute in equal volumes of water and test each with a conductivity bulb. Student A used table salt and the bulb glows brightly. Student B used sugar and the bulb stays dark. Student B concludes that her sugar 'failed to dissolve'. Is she right?",
        [
          "Yes — a dark bulb proves the sugar never dissolved in the water",
          "No — the sugar did dissolve, but it dissolves as whole uncharged molecules, so there are no free ions to carry a current",
          "No — sugar is a strong electrolyte, so the bulb should have glowed even brighter than the salt",
          "Yes — only solids that stay undissolved leave the bulb dark",
        ], 1,
        "Dissolving and conducting are two different things. The sugar dissolved completely, but it dissolved as neutral molecules with no charge, so nothing in the solution can carry current and the bulb stays dark. The salt dissolved into $\\ce{Na+}$ and $\\ce{Cl-}$, which drift to the electrodes and light the bulb. A non-electrolyte can dissolve perfectly well and still conduct nothing.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Electrolytes at a Glance',
        "- **Electrolyte:** conducts in solution because it gives **free ions**. **Non-electrolyte** (sugar, urea): dissolves as whole molecules, conducts nothing.\n" +
        "- **Strong electrolyte:** $\\alpha \\approx 1$, ionises almost completely, written with $\\rightarrow$. Strong acids/bases and most salts ($\\ce{NaCl}$, $\\ce{HCl}$, $\\ce{NaOH}$).\n" +
        "- **Weak electrolyte:** $\\alpha < 1$, ionises partly, written with $\\rightleftharpoons$ ($\\ce{CH3COOH}$, $\\ce{NH4OH}$, $\\ce{HCN}$). The unbroken molecules and the ions sit in equilibrium.\n" +
        "- **Solvent matters:** water dissolves ionic solids because **hydration energy** pays the lattice cost and its high **dielectric constant ($\\approx 80$)** cuts the ion–ion attraction. A non-polar solvent does neither.\n" +
        "- **Classic trap:** \"dissolves\" is not \"conducts.\" Sugar dissolves fully and conducts nothing."),
      h.quiz([
        {
          question: "Which set contains only weak electrolytes?",
          options: [
            "$\\ce{NaCl}$, $\\ce{HCl}$, $\\ce{NaOH}$",
            "$\\ce{CH3COOH}$, $\\ce{NH4OH}$, $\\ce{HCN}$",
            "sugar, urea, $\\ce{NaCl}$",
            "$\\ce{HCl}$, $\\ce{CH3COOH}$, sugar",
          ], correct_index: 1,
          explanation: "Acetic acid, ammonium hydroxide and hydrocyanic acid all ionise only partly ($\\alpha < 1$), so they are weak electrolytes. The first set is all strong electrolytes; the sets with sugar and urea mix in non-electrolytes, which are not electrolytes at all.",
        },
        {
          question: "A sugar solution does not conduct electricity because:",
          options: [
            "sugar dissolves as whole, uncharged molecules, leaving no free ions",
            "sugar does not dissolve in water",
            "sugar reacts with water and is destroyed",
            "sugar is a strong electrolyte that conducts only when heated",
          ], correct_index: 0,
          explanation: "Sugar dissolves completely, but it stays as neutral molecules. With no charged ions present, nothing can carry a current. Conduction needs free ions, not just a dissolved solute.",
        },
        {
          question: "Common salt dissolves into ions in water but stays whole in oil. The best reason is that:",
          options: [
            "water is hotter than oil, so it melts the salt crystal",
            "oil molecules are too large to touch the salt",
            "salt chemically reacts with water but not with oil",
            "water hydrates the ions and has a high dielectric constant, while oil does neither",
          ], correct_index: 3,
          explanation: "Water wraps each ion in polar molecules (hydration), releasing the energy needed to break the lattice, and its high dielectric constant ($\\approx 80$) weakens the ion–ion pull so the ions stay apart. Oil, being non-polar, offers no hydration and no such screening, so the lattice never breaks.",
        },
      ]),
    ];
  },
};
