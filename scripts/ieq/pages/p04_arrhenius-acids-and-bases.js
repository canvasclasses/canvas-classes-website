// IEQ page 4 — "The Arrhenius Concept" (NCERT §7.10.1).
// Sub-topic: Arrhenius acids give H+ in water (HCl, HNO3, H2SO4), classified
// mono/di/tribasic by replaceable H+; bases give OH- (NaOH, Ca(OH)2, KOH),
// mono/di/triacidic; the hydronium ion (bare H+ too reactive -> binds a water
// lone pair -> H3O+); limitations (only aqueous; cannot explain NH3 as a base).
// H3BO3 is NOT an Arrhenius acid (accepts OH- from water, does not donate H+).
// Voice: teacher-voice-profile + IEQ-exemplars. HIS framing reused: free H+ does
// not exist, too reactive, grabs water to make H3O+ ("H+ hum sirf apni convenience
// ke liye likhte hain"). Source: founder notes p6-9 (Arrhenius framing, H3BO3 note),
// NCERT physical p206-207 (§7.10.1, hydronium box).
// §5.X audited: no "Not X. It is Y." pairs, no stacked metaphors, <=1 em-dash/para,
// second person, say-it-once, no reveal framing, no universal-you, no intensifier-stacking.
module.exports = {
  page_number: 4,
  slug: 'arrhenius-acids-and-bases',
  title: 'The Arrhenius Concept',
  subtitle: 'Acids give H⁺, bases give OH⁻ — in water.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Two beakers of water drawn side by side like a chemist sketched them. In the left beaker an HCl molecule-blob is shown splitting into a small bright H+ dot and a Cl- dot, with a faint hand-lettered note "gives H+". In the right beaker a NaOH blob splits into a Na+ dot and an OH- dot, faintly noted "gives OH-". Between the two beakers, set slightly above, a single small lone H+ dot is shown latching onto a water molecule to form an H3O+ cluster, faintly labelled "bare H+ grabs water". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'The Acid in Your Stomach',
        "The hydrochloric acid your stomach makes is a textbook Arrhenius acid. Your gut lining pours out more than a litre of it a day, and the moment it meets water it does exactly what Arrhenius said an acid does: it floods the solution with $\\ce{H+}$. That same release of $\\ce{H+}$ is what turns blue litmus red and what lets the acid start breaking down your food."),
      h.text(
        "Svante Arrhenius gave the first clear test for what makes something an acid or a base, and his test is about one thing: what the substance releases when you dissolve it in water.\n\n" +
        "An **Arrhenius acid** is a substance that gives $\\ce{H+}$ ions in water. Hydrochloric acid, nitric acid and sulphuric acid all qualify:\n\n" +
        "$$\\ce{HCl -> H+ + Cl-}$$\n\n" +
        "An **Arrhenius base** is a substance that gives $\\ce{OH-}$ ions in water. Sodium hydroxide, calcium hydroxide and potassium hydroxide all qualify:\n\n" +
        "$$\\ce{NaOH -> Na+ + OH-}$$\n\n" +
        "So the whole concept rests on a single question you ask of any dissolved substance: does it hand the water $\\ce{H+}$, or does it hand the water $\\ce{OH-}$?"
      ),
      h.heading('Counting the replaceable H⁺ and OH⁻', 'Classify an Arrhenius acid or base by how many $\\ce{H+}$ or $\\ce{OH-}$ each formula unit can release.'),
      h.text(
        "Acids are sorted by how many $\\ce{H+}$ one molecule can give up. $\\ce{HCl}$ and $\\ce{HNO3}$ release one each, so they are **monobasic**. $\\ce{H2SO4}$ releases two, so it is **dibasic**. $\\ce{H3PO4}$ releases three, so it is **tribasic**.\n\n" +
        "Bases are sorted the same way, by how many $\\ce{OH-}$ one formula unit can give. $\\ce{NaOH}$ and $\\ce{KOH}$ release one each, so they are **monoacidic**. $\\ce{Ca(OH)2}$ releases two, so it is **diacidic**. A base releasing three $\\ce{OH-}$ is **triacidic**.\n\n" +
        "One name worth pausing on is the **hydronium ion**. A bare $\\ce{H+}$ is just a proton with no electron around it, so it is far too reactive to drift around on its own. The instant it appears, it latches onto a lone pair on a nearby water molecule and becomes $\\ce{H3O+}$. So when you write $\\ce{H+}$ in water, what is really present is $\\ce{H3O+}$:\n\n" +
        "$$\\ce{H+ + H2O -> H3O+}$$\n\n" +
        "You will see $\\ce{H+}$ and $\\ce{H3O+}$ used to mean the same thing throughout this chapter. The $\\ce{H+}$ is shorthand; the $\\ce{H3O+}$ is what actually sits in the beaker."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A clean two-part science-notebook diagram with neat hand-lettering. Top half: the reaction "HCl -> H+ + Cl-" drawn over a beaker of water, the H+ shown as a small dot and Cl- as a larger dot, hand-lettered "acid: gives H+". Below it the reaction "NaOH -> Na+ + OH-" over a second beaker, hand-lettered "base: gives OH-". Bottom half, set apart by a faint divider line: a single tiny bare proton labelled "H+ (bare proton, too reactive)" with a curved arrow into a water molecule (drawn as one O with two H), the lone pair on the O highlighted, producing a labelled "H3O+ (hydronium)". A short hand-lettered caption "free H+ cannot exist alone — it grabs water". Uncluttered, warm ink colours.',
        '16:9',
        'An Arrhenius acid releases H⁺ and a base releases OH⁻ in water. The bare H⁺ is too reactive to exist alone, so it binds a lone pair on water to become the hydronium ion, H₃O⁺.'
      ),
      h.callout('remember', 'H₃BO₃ Looks Like an Acid but Isn\'t an Arrhenius One',
        "Boric acid, $\\ce{H3BO3}$, has three hydrogens in its formula, so it is tempting to file it as a tribasic Arrhenius acid. It does not work that way. $\\ce{H3BO3}$ does not donate its $\\ce{H+}$ to the water directly. Instead its boron pulls an $\\ce{OH-}$ out of a water molecule, and the $\\ce{H+}$ left behind is what makes the solution acidic. Since the acidity comes from accepting $\\ce{OH-}$ rather than donating $\\ce{H+}$, $\\ce{H3BO3}$ falls outside the Arrhenius definition of an acid."),
      h.reasoning('logical',
        "A student is told that ammonia, $\\ce{NH3}$, dissolves in water and turns the solution basic. They check its formula, find no $\\ce{OH}$ group anywhere in $\\ce{NH3}$, and conclude that $\\ce{NH3}$ cannot be a base. What is the real lesson here?",
        [
          "The student is right — with no $\\ce{OH}$ in its formula, $\\ce{NH3}$ cannot be a base under any definition",
          "The Arrhenius rule (a base must supply $\\ce{OH-}$) is too narrow: $\\ce{NH3}$ pulls an $\\ce{H+}$ off water and leaves $\\ce{OH-}$ behind, so it is basic even without an $\\ce{OH}$ group of its own",
          "$\\ce{NH3}$ must secretly contain a hidden $\\ce{OH}$ group that the formula does not show",
          "The solution only seems basic; ammonia in water is actually neutral",
        ], 1,
        "This is exactly the gap the Arrhenius picture leaves open. Arrhenius demands a base carry its own $\\ce{OH-}$, and $\\ce{NH3}$ has none. Yet ammonia water really is basic, because $\\ce{NH3}$ takes an $\\ce{H+}$ from a water molecule and leaves an $\\ce{OH-}$ behind: $\\ce{NH3 + H2O -> NH4+ + OH-}$. The substance is basic without containing an $\\ce{OH}$ group, which is precisely what the Arrhenius definition cannot account for. The fix is the broader Brønsted picture on the next page.",
        2),
      h.callout('exam_tip', 'JEE / NEET — The Arrhenius Concept and Its Limits',
        "- **Acid gives $\\ce{H+}$, base gives $\\ce{OH-}$, in water.** That single line is the whole Arrhenius definition.\n" +
        "- **Basicity / acidity count:** monobasic / dibasic / tribasic by replaceable $\\ce{H+}$ ($\\ce{HCl}$ = 1, $\\ce{H2SO4}$ = 2, $\\ce{H3PO4}$ = 3); monoacidic / diacidic / triacidic by $\\ce{OH-}$ ($\\ce{NaOH}$ = 1, $\\ce{Ca(OH)2}$ = 2).\n" +
        "- **$\\ce{H+}$ in water means $\\ce{H3O+}$.** The bare proton is too reactive to exist free, so it binds a water lone pair. Treat the two symbols as the same species.\n" +
        "- **Two limitations examiners love:** Arrhenius works only for water solutions, and it cannot explain why $\\ce{NH3}$ (no $\\ce{OH}$ group) is a base.\n" +
        "- **Classic trap:** $\\ce{H3BO3}$ is not an Arrhenius acid. It accepts $\\ce{OH-}$ from water rather than donating $\\ce{H+}$."),
      h.quiz([
        {
          question: "According to the Arrhenius concept, a substance is classified as a base if, on dissolving in water, it:",
          options: [
            "releases $\\ce{OH-}$ ions into the solution",
            "releases $\\ce{H+}$ ions into the solution",
            "accepts a proton from a water molecule",
            "raises the temperature of the water",
          ], correct_index: 0,
          explanation: "Arrhenius defines a base purely by what it supplies to water: $\\ce{OH-}$ ions. Releasing $\\ce{H+}$ would make it an acid, and 'accepting a proton' is the broader Brønsted definition, not the Arrhenius one.",
        },
        {
          question: "Sulphuric acid, $\\ce{H2SO4}$, can give up two $\\ce{H+}$ ions per molecule in water. On the Arrhenius scheme it is therefore classified as:",
          options: [
            "monobasic",
            "dibasic",
            "diacidic",
            "triacidic",
          ], correct_index: 1,
          explanation: "An acid is classified by the number of replaceable $\\ce{H+}$ it can release. Two $\\ce{H+}$ per molecule makes $\\ce{H2SO4}$ dibasic. 'Diacidic' and 'triacidic' describe bases by their $\\ce{OH-}$ count, not acids.",
        },
        {
          question: "Which statement correctly explains why $\\ce{H3BO3}$ is not counted as an Arrhenius acid?",
          options: [
            "It contains no hydrogen atoms at all, so it cannot be acidic",
            "It dissolves in oil rather than in water",
            "It does not donate $\\ce{H+}$ directly; instead it accepts $\\ce{OH-}$ from water, leaving the solution acidic",
            "It releases $\\ce{OH-}$ ions, which makes it a base instead",
          ], correct_index: 2,
          explanation: "$\\ce{H3BO3}$ becomes acidic by pulling an $\\ce{OH-}$ out of water rather than by donating its own $\\ce{H+}$. Since the Arrhenius definition of an acid requires direct $\\ce{H+}$ donation, $\\ce{H3BO3}$ falls outside it. It does contain hydrogen, dissolves in water, and does not release $\\ce{OH-}$, so the other options are wrong.",
        },
      ]),
    ];
  },
};
