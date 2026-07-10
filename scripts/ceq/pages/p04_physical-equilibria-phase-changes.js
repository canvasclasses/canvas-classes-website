// CEQ page 4 — Physical equilibria: phase changes (solid-liquid, liquid-vapour,
// solid-vapour). NCERT §7.1.1-7.1.3. Accurate values: ice/water 273 K at 1 atm;
// water boils 373 K (100 C) at 1.013 bar; iodine/camphor/NH4Cl sublime.
// Voice: CEQ-exemplars trap "boiling/freezing points ARE equilibrium phenomena".
// §5.X audited: no "Not X. It is Y." pairs, ≤1 em-dash/para, plain SVO.
module.exports = {
  page_number: 4,
  slug: 'physical-equilibria-phase-changes',
  title: 'Physical Equilibria: Phase Changes',
  page_type: 'lesson',
  subtitle: 'Melting, boiling and subliming are all balancing acts.',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Three small sealed glass vessels in a row: the first holds ice floating in water with tiny up-and-down arrows at the ice surface; the second a half-full beaker of water with little arrows of vapour rising and droplets falling back inside a closed box; the third a flask with dark solid iodine at the bottom and a soft violet haze of vapour above it. Each vessel calm and balanced. Science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Ice Water Holds a Perfect Tie',
        "Drop ice cubes into a glass of water and the level looks still. It is not. At the surface of every cube, water molecules are freezing onto the ice while ice molecules are melting off into the water, all the time. As long as the glass sits at $0\\,°C$, these two run at the same speed, so the cubes neither grow nor shrink. The calm is a tie, not a stop."),
      h.text(
        "A **physical equilibrium** is a balance between two physical states of the same substance, with no chemical change at all. The substance is just shuttling between solid, liquid and vapour. Three of these balances cover almost everything you meet: solid with liquid, liquid with vapour, and solid with vapour. Each one needs a **closed system**, so that whatever leaves one state can come back. Open the system and let a state escape, and the balance breaks."
      ),
      h.heading('Solid–liquid equilibrium', 'Recognise the melting point as the temperature where solid and liquid coexist in balance.'),
      h.text(
        "Keep ice and water together in an insulated flask at $273\\,\\text{K}$ ($0\\,°C$) and $1$ atm. Molecules leave the ice and join the water (melting), and molecules leave the water and lock onto the ice (freezing). At this one temperature the two rates match, so the mass of ice and the mass of water both stay fixed:\n\n" +
        "$$H_2O(s) \\rightleftharpoons H_2O(l)$$\n\n" +
        "This balance holds at just one temperature for a given pressure. The temperature at which solid and liquid coexist in equilibrium is the **melting point** of the solid, the same as the **freezing point** of the liquid. Warm the flask above $273\\,\\text{K}$ and melting wins, so the ice disappears. Cool it below, and freezing wins. The tie survives only at the melting point itself."
      ),
      h.heading('Liquid–vapour equilibrium', 'Explain vapour pressure as the balance of evaporation and condensation, and define boiling point from it.'),
      h.text(
        "Half-fill a closed box with water. Fast molecules break free from the surface into the space above (evaporation), and molecules from that space strike the surface and rejoin the liquid (condensation). Early on, evaporation is ahead, so the amount of vapour climbs. As the vapour gets denser, condensation speeds up, until the two rates become equal:\n\n" +
        "$$H_2O(l) \\rightleftharpoons H_2O(g)$$\n\n" +
        "From that moment the amount of vapour stops changing, and the pressure it exerts holds steady. That steady pressure is the liquid's **vapour pressure** at that temperature. Heat the liquid and its molecules escape more easily, so the vapour pressure rises. The temperature at which the vapour pressure equals the surrounding pressure is the **boiling point**. At $1.013$ bar, water boils at $373\\,\\text{K}$ ($100\\,°C$). A different surrounding pressure gives a different boiling point, which is why water boils below $100\\,°C$ high up in the hills."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Three labelled panels side by side, drawn like science-notebook sketches with neat hand-lettering. PANEL 1 "solid - liquid": a beaker of water with a layer of ice, small balanced arrows at the ice surface (one up labelled "melting", one down labelled "freezing"), note "273 K, 1 atm = melting point". PANEL 2 "liquid - vapour": a closed box half-full of water, little arrows of molecules leaving the surface upward "evaporation" and others falling back "condensation", note "rates equal = constant vapour pressure". PANEL 3 "solid - vapour": a sealed flask with dark solid iodine crystals at the bottom and a soft violet vapour cloud above, balanced arrows "sublime" up and "deposit" down, note "I2(s) reversible-arrow I2(g)". Clean, uncluttered, hand-lettered.',
        '16:9',
        'The three physical equilibria: ice ⇌ water at the melting point, liquid ⇌ vapour at a constant vapour pressure, and solid iodine ⇌ violet vapour. Each runs both ways at matched rates inside a closed system.'
      ),
      h.heading('Solid–vapour equilibrium', 'Identify sublimation as a solid–vapour balance, using iodine, camphor and ammonium chloride.'),
      h.text(
        "Some solids skip the liquid stage and go straight to vapour. Seal solid iodine in a vessel and a violet vapour slowly fills the space above it, deepening in colour until the colour stops changing. At that point iodine is subliming into vapour and the vapour is depositing back as solid, at matching rates:\n\n" +
        "$$I_2(s) \\rightleftharpoons I_2(g)$$\n\n" +
        "Camphor and ammonium chloride ($\\ce{NH4Cl}$) behave the same way. The change of solid directly to vapour is called **sublimation**, and like the other two balances it settles into equilibrium only when the vessel is closed so the vapour cannot drift away.\n\n" +
        "Phase changes are one family of physical equilibria. The other is what happens when a solid or a gas **dissolves** in a liquid, which is where the fizz in a soda bottle comes from. That is the next page."
      ),
      h.reasoning('logical',
        "A student says: \"Boiling and freezing are just one-way changes — once water freezes, it has stopped, so there is no equilibrium there.\" Where does this go wrong?",
        [
          "It is correct — a phase change runs in only one direction once it starts",
          "It misses that at the melting point and the boiling point the two phases coexist, with the forward and backward changes running at equal rates",
          "It is wrong because freezing and boiling never actually happen at a fixed temperature",
          "It is wrong because boiling is an equilibrium but freezing is not",
        ], 1,
        "This is the classic slip. The melting point and the boiling point are not the moment one phase vanishes; they are the temperatures at which both phases sit together in balance. At the melting point, ice melts and water freezes at the same rate. At the boiling point, the liquid and its vapour are in equilibrium. Both are equilibrium phenomena, not one-way stops.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Physical Equilibria',
        "- **Melting point and boiling point are equilibrium states**, not one-way events. At the melting point solid and liquid coexist; at the boiling point liquid and vapour coexist. Examiners test this directly.\n" +
        "- **Vapour pressure is set by the temperature** for a given liquid. Raise the temperature, raise the vapour pressure.\n" +
        "- **Boiling point follows the surrounding pressure.** Lower pressure means a lower boiling point, so water boils below $100\\,°C$ at high altitude.\n" +
        "- **Sublimation** is the solid $\\rightleftharpoons$ vapour balance: iodine, camphor and $\\ce{NH4Cl}$ are the standard examples.\n" +
        "- Every one of these needs a **closed system**. In an open vessel the escaping vapour never returns, so no equilibrium forms."),
      h.quiz([
        {
          question: "The melting point of a solid is best described as the temperature at which:",
          options: [
            "the solid completely turns into the liquid phase",
            "the solid and liquid phases coexist in equilibrium",
            "the liquid begins to evaporate into the vapour phase",
            "the vapour pressure equals the surrounding pressure",
          ], correct_index: 1,
          explanation: "At the melting point, melting and freezing run at equal rates, so solid and liquid sit together in balance. The option about vapour pressure equalling the surrounding pressure describes the boiling point, not the melting point.",
        },
        {
          question: "At equilibrium in a closed box of water and its vapour, the vapour pressure stays constant because:",
          options: [
            "the rate of evaporation equals the rate of condensation",
            "all the liquid water has finished evaporating away",
            "evaporation from the surface has completely stopped",
            "the box has been brought to exactly $100\\,°C$",
          ], correct_index: 0,
          explanation: "The vapour amount holds steady because molecules leave and return at the same rate, keeping a constant vapour pressure. Evaporation has not stopped; it is simply matched by condensation. The pressure is constant at any fixed temperature, not only at $100\\,°C$.",
        },
        {
          question: "Which process is an example of a solid–vapour equilibrium in a closed vessel?",
          options: [
            "ice melting into water at $0\\,°C$",
            "water boiling into steam at $100\\,°C$",
            "solid iodine forming violet vapour",
            "common salt dissolving in water",
          ], correct_index: 2,
          explanation: "Solid iodine subliming to violet vapour, with vapour depositing back as solid, is a solid–vapour balance. Ice-to-water is solid–liquid and boiling is liquid–vapour; dissolving salt is not a phase change of a single substance at all.",
        },
      ]),
    ];
  },
};
