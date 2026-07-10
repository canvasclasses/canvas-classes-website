// IEQ page 9 — The ionic product of water, Kw. NCERT §7.11.1 + founder notes p13.
// Autoprotolysis/self-ionization 2H2O <=> H3O+ + OH-; Kw = [H+][OH-] = 1e-14 at
// 298 K; pure water [H+] = [OH-] = 1e-7 M (neutral); Kw is an equilibrium constant so
// it rises with temperature (ionization is endothermic); water is 55.55 M; degree of
// dissociation of water ~ 1.8e-9. Voice: teacher-voice-profile + IEQ-exemplars
// (A: auto-proto-lysis etymology hook; free H+ doesn't exist on its own, grabs water
// to become H3O+, written for convenience). §5.X audited: no "Not X. It is Y." pairs,
// <=1 em-dash/para, plain SVO, say-it-once, second person, no reveal framing, no
// triple-repetition, no banned metaphors, no intensifier-stacking.
module.exports = {
  page_number: 9,
  slug: 'ionic-product-of-water-kw',
  title: 'The Ionic Product of Water, Kw',
  subtitle: 'Even pure water is a little bit ionised.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Two water molecules drawn like a chemist sketched them in the centre, one passing a single small proton across to the other, the receiver becoming a three-hydrogen hydronium ion and the giver becoming a hydroxide ion, with a faint curved arrow showing the proton handoff. A small hand-lettered note to the side "happens in pure water too". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Pure Water Is Not Quite All Water',
        "Distilled water looks like nothing is happening in it. Yet at any instant a tiny fraction of its molecules have swapped a proton between themselves, leaving a trace of charged ions floating about. Out of more than fifty molecules-worth of water in every litre, only about two in a billion are split at any moment. That faint splitting is small enough to ignore when you drink the water, and important enough that the whole pH scale is built on it."),
      h.text(
        "Water can act as an acid and as a base, so it can react with itself. One water molecule hands a proton to another:\n\n" +
        "$$\\ce{2H2O <=> H3O+ + OH-}$$\n\n" +
        "This self-reaction has a name worth unpacking, because the name tells you what is going on: **autoprotolysis**. Break it into three pieces. *Auto* means by itself, *proto* means proton, and *lysis* means to break. So autoprotolysis is water breaking a proton off itself, by itself, with no acid or base added.\n\n" +
        "A small note on notation while you are here. A bare $\\ce{H+}$ is just a proton, and a lone proton is far too reactive to drift around free in water. It grabs the nearest water molecule at once and becomes $\\ce{H3O+}$, the hydronium ion. You will often see $\\ce{H+}$ written instead of $\\ce{H3O+}$ throughout this chapter, and that is only for convenience. The two stand for the same thing."
      ),
      h.heading('The value of Kw and how temperature moves it', 'State $K_w = [\\ce{H+}][\\ce{OH-}] = 10^{-14}$ at 298 K, identify neutral water, and explain why $K_w$ rises with temperature.'),
      h.text(
        "Treat the self-reaction as the equilibrium it is and write its constant, dropping the water concentration because it is the solvent and barely changes. What is left is the product of the two ion concentrations, and chemists call it the **ionic product of water**, $K_w$:\n\n" +
        "$$K_w = [\\ce{H+}][\\ce{OH-}] = 10^{-14} \\quad (\\text{at } 298\\,\\text{K})$$\n\n" +
        "In pure water the splitting makes one $\\ce{H+}$ for every $\\ce{OH-}$, so the two concentrations are equal. Setting them equal in $K_w$ gives\n\n" +
        "$$[\\ce{H+}] = [\\ce{OH-}] = 10^{-7}\\ \\text{M},$$\n\n" +
        "and a solution with equal amounts of the two ions is what we call **neutral**. You can also see how little water actually dissociates. A litre of water holds about $55.55$ moles of it, yet only $10^{-7}$ M of it has split, so the degree of dissociation is roughly $\\frac{10^{-7}}{55.55} \\approx 1.8 \\times 10^{-9}$. About two molecules in every billion.\n\n" +
        "Because $K_w$ is an equilibrium constant, it only stays at $10^{-14}$ as long as the temperature stays at 298 K. The self-ionization of water absorbs heat, so it is endothermic, and heating an endothermic equilibrium pushes it forward. Heat the water and more of it splits, so **$K_w$ rises with temperature.** Both $[\\ce{H+}]$ and $[\\ce{OH-}]$ climb together, which is why warm pure water stays neutral even though its $\\ce{H+}$ has gone up."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Drawn like a chemist sketched it in a notebook. Centre: two bent water molecules with the reaction "2 H2O <=> H3O+ + OH-" hand-lettered above, a small curved arrow showing one proton moving from the left molecule to the right; the right product drawn as a hydronium ion with three hydrogens and a + tag, the left product drawn as a hydroxide ion with a - tag. To the right a boxed hand-lettered note "Kw = [H+][OH-] = 1e-14 at 298 K" and below it a small up-arrow with "rises with T (endothermic)". A faint side note "pure water: [H+] = [OH-] = 1e-7 M, neutral". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'Water hands a proton to water: 2H₂O ⇌ H₃O⁺ + OH⁻. The product [H⁺][OH⁻] is Kw = 10⁻¹⁴ at 298 K, and it rises as the water is heated.'
      ),
      h.worked('Worked example — finding the missing ion', 'solved_example',
        "An aqueous solution has $[\\ce{OH-}] = 7.8 \\times 10^{-6}$ M at 298 K. Find $[\\ce{H+}]$ and state whether the solution is acidic, basic or neutral.",
        "**Step 1 — use $K_w$.** At 298 K the two ion concentrations always multiply to $10^{-14}$:\n\n" +
        "$$[\\ce{H+}][\\ce{OH-}] = 10^{-14}$$\n\n" +
        "**Step 2 — solve for $[\\ce{H+}]$.**\n\n" +
        "$$[\\ce{H+}] = \\frac{10^{-14}}{7.8 \\times 10^{-6}} = 1.3 \\times 10^{-9}\\ \\text{M}$$\n\n" +
        "**Step 3 — compare the two ions.** Here $[\\ce{OH-}] = 7.8 \\times 10^{-6}$ M is far larger than $[\\ce{H+}] = 1.3 \\times 10^{-9}$ M.\n\n" +
        "Since $[\\ce{OH-}] > [\\ce{H+}]$, the solution is **basic**.\n\n" +
        "**Answer:** $[\\ce{H+}] = 1.3 \\times 10^{-9}$ M; the solution is basic.",
        'tap_to_reveal'),
      h.worked('Worked example — Kw at a higher temperature', 'solved_example',
        "The pH of pure water at 298 K is $7$, while at 333 K (60 °C) it is about $6.5$. Show that pure water is still neutral at the higher temperature, and find $K_w$ there.",
        "**Step 1 — read $[\\ce{H+}]$ at 333 K.**\n\n" +
        "$$[\\ce{H+}] = 10^{-6.5}\\ \\text{M}$$\n\n" +
        "**Step 2 — use the neutrality of pure water.** Pure water makes one $\\ce{H+}$ for every $\\ce{OH-}$, so the two are still equal:\n\n" +
        "$$[\\ce{OH-}] = [\\ce{H+}] = 10^{-6.5}\\ \\text{M}$$\n\n" +
        "Equal ion concentrations mean the water is still neutral, even though its pH is now $6.5$.\n\n" +
        "**Step 3 — find $K_w$ at 333 K.**\n\n" +
        "$$K_w = [\\ce{H+}][\\ce{OH-}] = (10^{-6.5})(10^{-6.5}) = 10^{-13}$$\n\n" +
        "This is ten times the room-temperature value of $10^{-14}$, which matches the rule that heating the endothermic self-ionization raises $K_w$.\n\n" +
        "**Answer:** $[\\ce{H+}] = [\\ce{OH-}] = 10^{-6.5}$ M, so the water is neutral; $K_w = 10^{-13}$ at 333 K.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "A student heats a beaker of pure water and measures its pH falling from $7$ to $6.5$. They conclude the warm water has turned slightly acidic. Where is the slip?",
        [
          "Nowhere — pH below 7 always means an acidic solution",
          "Heating raised $K_w$, so both $[\\ce{H+}]$ and $[\\ce{OH-}]$ rose equally; the two are still equal, so the water stays neutral",
          "The pH meter is faulty, because the pH of pure water can never change",
          "Heating added $\\ce{H+}$ but removed $\\ce{OH-}$, which is what makes it acidic",
        ], 1,
        "\"pH below 7 means acidic\" is only true at 298 K, where neutral sits at 7. Heating the endothermic self-ionization raises $K_w$, so the water makes more of both ions in equal numbers. With $[\\ce{H+}] = [\\ce{OH-}]$ the water is still neutral, even though both have climbed and the pH has dropped. The neutral point simply shifted below 7 at the higher temperature.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Working with Kw',
        "- **$K_w = [\\ce{H+}][\\ce{OH-}] = 10^{-14}$ holds only at 298 K.** Given either ion, divide $K_w$ by it to get the other.\n" +
        "- **$K_w$ is an equilibrium constant, so it changes with temperature.** The self-ionization is endothermic, so heating raises $K_w$ and lowers the pH of pure water below 7.\n" +
        "- **Neutral means equal ions, not pH 7.** Pure water is neutral at every temperature because $[\\ce{H+}] = [\\ce{OH-}]$; only the numerical value of that neutral pH moves.\n" +
        "- **Classic trap:** seeing a pH below 7 at a raised temperature and calling the solution acidic. Check whether the two ion concentrations are equal before judging."),
      h.quiz([
        {
          question: "In pure water at 298 K, which of these is true?",
          options: [
            "$[\\ce{H+}] = [\\ce{OH-}] = 10^{-7}$ M, and the water is neutral",
            "$[\\ce{H+}] = 10^{-14}$ M",
            "$[\\ce{H+}]$ is greater than $[\\ce{OH-}]$, making it weakly acidic",
            "Water does not ionize at all unless an acid is added",
          ], correct_index: 0,
          explanation: "Self-ionization makes one $\\ce{H+}$ for every $\\ce{OH-}$, so they are equal, and $K_w = [\\ce{H+}][\\ce{OH-}] = 10^{-14}$ gives each as $10^{-7}$ M. That equality is what neutral means. $10^{-14}$ is the product of the two, not one of them, and water ionizes a little on its own.",
        },
        {
          question: "A sample of pure water is heated from 298 K to 323 K. What happens to $K_w$ and to the neutral pH?",
          options: [
            "$K_w$ falls and the neutral pH rises above 7",
            "$K_w$ rises and the neutral pH falls below 7",
            "$K_w$ stays at $10^{-14}$ because it is a constant",
            "$K_w$ rises but the water becomes acidic",
          ], correct_index: 1,
          explanation: "The self-ionization is endothermic, so heating drives it forward, making more of both ions and raising $K_w$. With more $\\ce{H+}$, the neutral pH drops below 7. The water stays neutral because the two ions rise together, and $K_w$ is temperature-dependent, so it does not stay fixed.",
        },
        {
          question: "A solution at 298 K has $[\\ce{H+}] = 2 \\times 10^{-5}$ M. What is $[\\ce{OH-}]$?",
          options: [
            "$2 \\times 10^{-5}$ M",
            "$2 \\times 10^{-9}$ M",
            "$5 \\times 10^{-10}$ M",
            "$5 \\times 10^{-9}$ M",
          ], correct_index: 2,
          explanation: "Use $[\\ce{OH-}] = K_w / [\\ce{H+}] = 10^{-14} / (2 \\times 10^{-5}) = 5 \\times 10^{-10}$ M. The first option would only hold for neutral water, where the two ions are equal, which is not the case when $[\\ce{H+}] = 2 \\times 10^{-5}$ M.",
        },
      ]),
    ];
  },
};
