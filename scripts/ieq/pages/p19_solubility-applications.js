// IEQ page 19 — Putting solubility to work (NCERT §7.13.2 text, PDF p.222). CHAPTER FINALE.
// Sub-topic: real uses of solubility equilibria.
//   (1) Qualitative salt analysis: cations separated into groups by controlled precipitation;
//       the common-ion effect sets the sulphide/hydroxide concentration so that only the right
//       group's salt crosses its Ksp and precipitates.
//   (2) Increasing solubility by complex formation: NH3 dissolves AgCl by pulling Ag+ into
//       [Ag(NH3)2]+, so the dissolution equilibrium keeps moving forward.
//   (3) Solubility of weak-acid salts rises in acidic medium: at low pH the anion gets
//       protonated, lowering its concentration, so more salt dissolves (Le Chatelier).
// No NCERT solved Problem maps here (concept + application page).
// HIS analogy (IEQ-exemplars A): complex formation = the equilibrium notices its product has
//   been stolen, "are yaar, mera product chala gaya, aur banao", so it keeps dissolving forward.
// Finale: a short "pulling the chapter together" paragraph (electrolytes -> alpha -> theories ->
//   Kw/pH -> hydrolysis -> buffers -> Ksp) + one-line bridge: these equilibrium tools now power
//   the rest of physical chemistry (electrochemistry, etc.). Plain, no "living balance"/"two-way
//   traffic".
// Voice: teacher-voice-profile + IEQ-exemplars. §5.X audited: no "Not X. It is Y." pairs; no
//   banned metaphors; <=1 em-dash/para; plain SVO; say-it-once; second person; analogy-first
//   with HIS framing; no reveal framing; no intensifier-stacking; no triple-repetition; no
//   universal claims.
module.exports = {
  page_number: 19,
  slug: 'solubility-applications',
  title: 'Putting Solubility to Work',
  subtitle: "Salt analysis, and dissolving the 'insoluble'.",
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, science-notebook feel. Ultra-wide cinematic banner. A chemist\'s lab bench drawn in notebook style: on the left a row of test tubes each holding a differently coloured precipitate settling at the bottom, faintly hand-lettered "Group I", "Group II", "Group III"; in the centre a beaker where a cloudy white solid is visibly clearing as a labelled stream of "NH3" is added, with a small note "the solid dissolves again". Calm, uncluttered, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Reading a Salt by Making It Fall Out',
        "Hand a chemist an unknown white powder and ask which metal is in it. Long before any instrument, the answer came from solubility alone. Dissolve the salt, then add reagents one at a time so that each metal drops out as a coloured solid at its own turn. The order in which things precipitate, and the colour they show, names the metal. Everything on this page is that idea turned into a tool."),
      h.heading('Separating cations: qualitative salt analysis',
        'Explain how controlled precipitation, tuned by the common-ion effect, sorts metal ions into analytical groups.'),
      h.text(
        "In the lab you sort the metal cations of an unknown salt into **groups**, and you do it by precipitation under controlled conditions. Each group has a reagent that throws its metals out as sparingly soluble sulphides or hydroxides, while leaving the rest in solution. The trick is to bring out one group at a time, and the common-ion effect is what gives you that control.\n\n" +
        "Take the sulphide groups. The concentration of $\\ce{S^{2-}}$ in solution depends on the acidity, because $\\ce{H2S}$ is a weak acid whose dissociation you can push back with $\\ce{H+}$. In acidic solution the added $\\ce{H+}$ common-ions the $\\ce{H2S}$ shut, keeping $\\ce{S^{2-}}$ very low. Only the metals whose sulphides have the smallest $K_{sp}$ can reach their $Q = K_{sp}$ at that low $\\ce{S^{2-}}$, so just those precipitate. Lower the acidity later and $\\ce{S^{2-}}$ rises, bringing the next group down. By dialling one ion concentration up or down you decide which salts cross their $K_{sp}$ and which stay dissolved."
      ),
      h.heading('Dissolving the insoluble: complex formation',
        'Show how tying up a free ion in a complex pulls a dissolution equilibrium forward, raising solubility.'),
      h.text(
        "You can also run the effect in reverse and make a stubborn salt dissolve. White $\\ce{AgCl}$ barely dissolves in water, yet add aqueous ammonia and it clears:\n\n" +
        "$$\\ce{AgCl(s) <=> Ag+ + Cl-}$$\n\n" +
        "$$\\ce{Ag+ + 2NH3 <=> [Ag(NH3)2]+}$$\n\n" +
        "The ammonia grabs the free $\\ce{Ag+}$ and locks it into the complex ion $\\ce{[Ag(NH3)2]+}$. With its silver ions being pulled out of solution, the dissolution equilibrium reacts the way Le Chatelier says it must. Picture the equilibrium noticing its product has gone missing and muttering \"my $\\ce{Ag+}$ is gone, make more\", so it keeps dissolving fresh $\\ce{AgCl}$ to replace what the ammonia took. As long as ammonia is there to mop up the silver, the solid keeps going into solution."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, clean science-notebook feel. Two linked sketches side by side. LEFT: a beaker with a heap of white solid hand-lettered "AgCl(s)"; a rightward arrow shows the equilibrium "AgCl <=> Ag+ + Cl-" being driven forward; an "NH3" molecule reaches in and captures an "Ag+" ion into a small bracketed cluster hand-lettered "[Ag(NH3)2]+", with a tiny note "Ag+ pulled away, so more AgCl dissolves". RIGHT: a qualitative-analysis sketch of three test tubes in a row, each with a differently shaded precipitate at the bottom hand-lettered "Group I", "Group II", "Group III", and a small dropper above adding reagent, with a note "each group drops out at its own turn". Warm ink colours, no large text blocks.',
        '16:9',
        'Left: ammonia ties up free Ag⁺ as [Ag(NH₃)₂]⁺, so the AgCl dissolution equilibrium keeps moving forward and the solid goes into solution. Right: in qualitative analysis, cations are precipitated group by group under controlled conditions.'
      ),
      h.heading('Weak-acid salts dissolve more in acid',
        'Explain why lowering the pH raises the solubility of a salt whose anion is the conjugate base of a weak acid.'),
      h.text(
        "The last application uses pH as the lever. Salts of weak acids, like carbonates, phosphates, and sulphides, dissolve more in acidic solution. The reason is the anion. Its parent is a weak acid, so in acid the anion picks up $\\ce{H+}$ and turns back into the undissociated acid:\n\n" +
        "$$\\ce{CaCO3(s) <=> Ca^{2+} + CO3^{2-}}$$\n\n" +
        "$$\\ce{CO3^{2-} + 2H+ -> H2CO3}$$\n\n" +
        "Each $\\ce{CO3^{2-}}$ that gets protonated is one fewer in solution, so the carbonate concentration falls. The dissolution equilibrium answers that drop by shifting forward, dissolving more $\\ce{CaCO3}$ to replace the carbonate the acid consumed. The lower the pH, the more anion is mopped up, and the more salt dissolves. This is why limestone fizzes away in acid and why an acidic medium frees ions that plain water would leave locked in the solid."
      ),
      h.reasoning('logical',
        "$\\ce{AgCl}$ is almost insoluble in water, yet it dissolves readily when aqueous $\\ce{NH3}$ is added. A student asks how adding something can make an 'insoluble' salt dissolve. What is the reason?",
        [
          "The $\\ce{NH3}$ raises the $K_{sp}$ of $\\ce{AgCl}$, so more can dissolve",
          "The $\\ce{NH3}$ ties up $\\ce{Ag+}$ as the complex $\\ce{[Ag(NH3)2]+}$, lowering free $\\ce{Ag+}$ so the dissolution equilibrium shifts forward",
          "The $\\ce{NH3}$ reacts with the chloride to make $\\ce{NH4Cl}$, which is why the solid goes",
          "The $\\ce{NH3}$ simply heats the solution, and heat dissolves everything",
        ], 1,
        "Ammonia captures the free $\\ce{Ag+}$ into the complex ion $\\ce{[Ag(NH3)2]+}$. With silver ions removed from solution, the equilibrium $\\ce{AgCl(s) <=> Ag+ + Cl-}$ shifts forward by Le Chatelier to replace them, so more $\\ce{AgCl}$ keeps dissolving. The $K_{sp}$ of $\\ce{AgCl}$ has not changed at all, since it is fixed at a given temperature. What changed is the free $\\ce{Ag+}$, which the complex keeps draining away.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Applications of Solubility Equilibria',
        "- **Qualitative analysis works by controlled precipitation.** The common-ion effect tunes the $\\ce{S^{2-}}$ or $\\ce{OH-}$ concentration (via $\\ce{H+}$ on the weak acid $\\ce{H2S}$) so that only the chosen group's salt reaches $Q = K_{sp}$ and drops out.\n" +
        "- **Complex formation raises solubility.** $\\ce{NH3}$ pulls $\\ce{Ag+}$ into $\\ce{[Ag(NH3)2]+}$, lowering free $\\ce{Ag+}$, so $\\ce{AgCl(s) <=> Ag+ + Cl-}$ shifts forward and the solid dissolves. The $K_{sp}$ stays the same.\n" +
        "- **Salts of weak acids dissolve more in acid.** Low pH protonates the anion (e.g. $\\ce{CO3^{2-} + 2H+ -> H2CO3}$), lowering its concentration, so the salt dissolves further to compensate.\n" +
        "- **The single thread:** remove a product ion and the dissolution shifts forward, add a product ion and it shifts back. Every case on this page is Le Chatelier applied to $\\ce{salt(s) <=> ions}$.\n" +
        "- **Common trap:** none of these change $K_{sp}$. They change the free-ion concentrations, and the equilibrium responds. $K_{sp}$ moves only with temperature."),
      h.text(
        "**Pulling the chapter together.** You started by sorting substances into electrolytes and measuring how far they break up with the degree of dissociation $\\alpha$, then named acids and bases through the Arrhenius, Bronsted-Lowry, and Lewis theories. From there you put a number on water itself with $K_w$ and the pH scale, watched salts react with water in hydrolysis, built buffers that hold a steady pH, and finally measured how much of a sparingly soluble salt dissolves with $K_{sp}$. One idea ran underneath all of it: ions in water settle into an equilibrium, and Le Chatelier's principle tells you which way that equilibrium moves when you disturb it.\n\n" +
        "**Where this goes next.** The equilibrium tools you sharpened across Chemical Equilibrium and Ionic Equilibrium now carry into the rest of physical chemistry. The next stop is electrochemistry, where the same balance of ions in solution becomes a source of electrical energy, and where $K$, $Q$, and Le Chatelier show up again wearing new clothes."
      ),
      h.quiz([
        {
          question: "Why does adding aqueous $\\ce{NH3}$ dissolve a precipitate of $\\ce{AgCl}$?",
          options: [
            "It increases the $K_{sp}$ of $\\ce{AgCl}$",
            "It removes $\\ce{Ag+}$ as the complex $\\ce{[Ag(NH3)2]+}$, so the dissolution equilibrium shifts forward",
            "It converts $\\ce{AgCl}$ directly into soluble $\\ce{NH4Cl}$",
            "It lowers the temperature, increasing solubility",
          ], correct_index: 1,
          explanation: "Ammonia ties up the free $\\ce{Ag+}$ in the complex $\\ce{[Ag(NH3)2]+}$. With $\\ce{Ag+}$ being drained from solution, the equilibrium $\\ce{AgCl(s) <=> Ag+ + Cl-}$ shifts forward to replace it, dissolving more solid. $K_{sp}$ is unchanged, because it depends only on temperature.",
        },
        {
          question: "In qualitative analysis, why is the precipitating solution often kept acidic when separating the sulphide groups?",
          options: [
            "Acid increases the $K_{sp}$ of every sulphide equally",
            "Acid common-ions the $\\ce{H2S}$ shut, keeping $\\ce{S^{2-}}$ low so only the smallest-$K_{sp}$ sulphides precipitate",
            "Acid reacts with the metal ions to colour them",
            "Acid is needed only to dissolve the original salt, and has no role in the separation",
          ], correct_index: 1,
          explanation: "$\\ce{H2S}$ is a weak acid, so adding $\\ce{H+}$ pushes its dissociation back and keeps the $\\ce{S^{2-}}$ concentration very low. At that low $\\ce{S^{2-}}$, only the metals whose sulphides have the smallest $K_{sp}$ reach $Q = K_{sp}$ and precipitate. Lowering the acidity later raises $\\ce{S^{2-}}$ and brings down the next group, which is how the groups are separated.",
        },
        {
          question: "The solubility of $\\ce{CaCO3}$ in water increases when the solution is made acidic because:",
          options: [
            "$\\ce{H+}$ protonates $\\ce{CO3^{2-}}$, lowering its concentration, so more $\\ce{CaCO3}$ dissolves to compensate",
            "$\\ce{H+}$ raises the $K_{sp}$ of $\\ce{CaCO3}$",
            "$\\ce{Ca^{2+}}$ reacts with the acid to form a soluble complex",
            "acid always dissolves all salts regardless of the anion",
          ], correct_index: 0,
          explanation: "Carbonate is the conjugate base of the weak acid $\\ce{H2CO3}$, so in acid it picks up $\\ce{H+}$ to form $\\ce{H2CO3}$. That removes $\\ce{CO3^{2-}}$ from solution, and the equilibrium $\\ce{CaCO3(s) <=> Ca^{2+} + CO3^{2-}}$ shifts forward to replace it, dissolving more salt. $K_{sp}$ stays fixed; only the free-ion concentrations change.",
        },
      ]),
    ];
  },
};
