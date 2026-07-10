// IEQ page 5 — "Brønsted–Lowry and Conjugate Pairs" (NCERT §7.10.2).
// Sub-topic: Brønsted acid = H+ donor, base = H+ acceptor (explains NH3);
// conjugate acid-base pairs differ by one proton (HCl/Cl-, H2O/H3O+, NH4+/NH3);
// strength seesaw (stronger acid -> weaker conjugate base; HI>HBr>HCl>HF in
// acidity => I-<Br-<Cl-<F- in basicity); amphoteric/amphiprotic species
// (H2O, HCO3-, HSO4-). Folds NCERT Problems 7.12, 7.13, 7.14 as worked().
// HIS analogies (IEQ-exemplars A): spectator ion "came to watch the match,
// not to play"; "when a species has done its job it turns into its conjugate";
// water "reads the other party and picks its role". Source: founder notes p6-9
// (Bronsted table, seesaw, amphoteric), NCERT physical p207-208 (§7.10.2, Problems).
// §5.X audited: no "Not X. It is Y." pairs, no stacked metaphors, <=1 em-dash/para,
// second person, say-it-once, no reveal framing, no universal-you, no triple-repetition.
module.exports = {
  page_number: 5,
  slug: 'bronsted-lowry-conjugate-pairs',
  title: 'Brønsted–Lowry and Conjugate Pairs',
  subtitle: 'Acids donate protons, bases accept them.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Centre stage: a single proton (a small bright H+ dot) being handed from one molecule to another, drawn like a baton pass, with a faint curved arrow. The molecule on the left is hand-lettered "donor (acid)" and the one on the right "acceptor (base)". To the side, faintly, a small balance-beam seesaw with a heavy "strong acid" weight on one side and a light "weak conjugate base" pan rising on the other, hand-lettered "stronger acid, weaker partner". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'One Definition That Finally Fits Ammonia',
        "The Arrhenius rule could not explain why ammonia makes water basic, because $\\ce{NH3}$ carries no $\\ce{OH}$ group. Two chemists, Brønsted and Lowry, fixed that in 1923 with a definition built around the proton instead of around $\\ce{OH-}$. On their view ammonia is a base because it accepts an $\\ce{H+}$ from water, and the leftover $\\ce{OH-}$ is what makes the solution basic. The gap from the last page closes in a single sentence."),
      h.text(
        "Brønsted and Lowry shifted the focus from what a substance releases to what it does with a proton.\n\n" +
        "A **Brønsted acid** is a proton ($\\ce{H+}$) **donor**. A **Brønsted base** is a proton **acceptor**. That is the whole idea, and it is wider than the Arrhenius one because it never mentions water or $\\ce{OH-}$.\n\n" +
        "Watch it handle ammonia, the case Arrhenius could not:\n\n" +
        "$$\\ce{NH3 + H2O <=> NH4+ + OH-}$$\n\n" +
        "Here $\\ce{H2O}$ donates a proton, so water is the acid. $\\ce{NH3}$ accepts that proton, so ammonia is the base. No $\\ce{OH}$ group on the ammonia is needed; accepting the proton is enough to make it a base."
      ),
      h.heading('Conjugate acid–base pairs', 'Identify the conjugate partner of any acid or base, and use the strength seesaw to rank conjugate bases.'),
      h.text(
        "Look at what each species becomes after the proton moves. When an acid gives up its $\\ce{H+}$, it has done its job, and what is left is a base waiting to take a proton back. That leftover is the acid's **conjugate base**. In the same way, once a base accepts a proton it becomes a **conjugate acid**.\n\n" +
        "A conjugate acid–base pair differs by exactly one proton. In the ammonia reaction, $\\ce{NH4+}$ and $\\ce{NH3}$ are one pair, and $\\ce{H2O}$ and $\\ce{OH-}$ are the other. For hydrochloric acid in water, $\\ce{HCl}$ and $\\ce{Cl-}$ form a pair, and $\\ce{H2O}$ and $\\ce{H3O+}$ form the other:\n\n" +
        "$$\\ce{HCl + H2O <=> H3O+ + Cl-}$$\n\n" +
        "There is a tidy rule about strength inside a pair: the stronger the acid, the weaker its conjugate base. A strong acid lets go of its proton easily, so the leftover holds a proton back only weakly. Run down the halogen acids and you see it directly. In acidity $\\ce{HI} > \\ce{HBr} > \\ce{HCl} > \\ce{HF}$, so in basicity the order of their conjugate bases flips to $\\ce{I-} < \\ce{Br-} < \\ce{Cl-} < \\ce{F-}$. The strongest acid leaves behind the feeblest base."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A clean two-part science-notebook diagram, neat hand-lettering. Top: the proton-transfer equation "HCl + H2O <=> H3O+ + Cl-" drawn large. Under HCl and Cl- a hand-drawn bracket joins them labelled "conjugate pair (differ by 1 H+)"; under H2O and H3O+ a second bracket labelled "conjugate pair". A small curved arrow shows the H+ leaving HCl and arriving on H2O. Bottom, set apart by a faint divider: a hand-drawn seesaw / balance beam. On the heavy left end a block labelled "strong acid (HI)"; the right end tilts up with a light pan labelled "weak conjugate base (I-)". A short hand-lettered note runs along the beam: "stronger the acid, weaker its conjugate base". Uncluttered, warm ink colours.',
        '16:9',
        'Proton transfer for HCl in water, with the two conjugate pairs bracketed (each differs by one H⁺). Below, the strength seesaw: a stronger acid leaves behind a weaker conjugate base.'
      ),
      h.worked('Problem 7.12 (NCERT)', 'ncert_intext',
        "What will be the conjugate bases for the following Brønsted acids: $\\ce{HF}$, $\\ce{H2SO4}$ and $\\ce{HCO3-}$?",
        "**Rule.** A conjugate base is what remains after the acid donates one $\\ce{H+}$, so remove a single proton from each (which also lowers the charge by one).\n\n" +
        "$\\ce{HF}$ loses $\\ce{H+}$ to give $\\ce{F-}$.\n\n" +
        "$\\ce{H2SO4}$ loses $\\ce{H+}$ to give $\\ce{HSO4-}$.\n\n" +
        "$\\ce{HCO3-}$ loses $\\ce{H+}$ to give $\\ce{CO3^{2-}}$.\n\n" +
        "**Answer:** the conjugate bases are $\\ce{F-}$, $\\ce{HSO4-}$ and $\\ce{CO3^{2-}}$ respectively.",
        'tap_to_reveal'),
      h.worked('Problem 7.13 (NCERT)', 'ncert_intext',
        "Write the conjugate acids for the following Brønsted bases: $\\ce{NH2-}$, $\\ce{NH3}$ and $\\ce{HCOO-}$.",
        "**Rule.** A conjugate acid is what forms after the base accepts one $\\ce{H+}$, so add a single proton to each (which also raises the charge by one).\n\n" +
        "$\\ce{NH2-}$ gains $\\ce{H+}$ to give $\\ce{NH3}$.\n\n" +
        "$\\ce{NH3}$ gains $\\ce{H+}$ to give $\\ce{NH4+}$.\n\n" +
        "$\\ce{HCOO-}$ gains $\\ce{H+}$ to give $\\ce{HCOOH}$.\n\n" +
        "**Answer:** the conjugate acids are $\\ce{NH3}$, $\\ce{NH4+}$ and $\\ce{HCOOH}$ respectively.",
        'tap_to_reveal'),
      h.worked('Problem 7.14 (NCERT)', 'ncert_intext',
        "The species $\\ce{H2O}$, $\\ce{HCO3-}$, $\\ce{HSO4-}$ and $\\ce{NH3}$ can each act as both a Brønsted acid and a Brønsted base. For each, give the conjugate acid (add one $\\ce{H+}$) and the conjugate base (remove one $\\ce{H+}$).",
        "**Method.** Each of these can give a proton or take one, so write both partners. Add $\\ce{H+}$ for the conjugate acid; remove $\\ce{H+}$ for the conjugate base.\n\n" +
        "$\\ce{H2O}$: conjugate acid $\\ce{H3O+}$, conjugate base $\\ce{OH-}$.\n\n" +
        "$\\ce{HCO3-}$: conjugate acid $\\ce{H2CO3}$, conjugate base $\\ce{CO3^{2-}}$.\n\n" +
        "$\\ce{HSO4-}$: conjugate acid $\\ce{H2SO4}$, conjugate base $\\ce{SO4^{2-}}$.\n\n" +
        "$\\ce{NH3}$: conjugate acid $\\ce{NH4+}$, conjugate base $\\ce{NH2-}$.\n\n" +
        "A species that can do both jobs like this is called **amphoteric** (or amphiprotic). Water reads the other party in the reaction and picks its role: face a better base and it acts as the acid; face a better acid and it acts as the base.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "Solid $\\ce{NaCl}$ is dissolved in water and a little $\\ce{HCl}$ is added. A student writes that $\\ce{Na+}$ is acting as a Brønsted base because it is a positive ion floating near the $\\ce{Cl-}$. How should you judge the role of $\\ce{Na+}$ here?",
        [
          "The student is right — any cation in solution behaves as a Brønsted base",
          "$\\ce{Na+}$ neither donates nor accepts a proton, so it has no Brønsted acid or base role at all; it came to watch the reaction, not to take part",
          "$\\ce{Na+}$ is a Brønsted acid because it carries a positive charge",
          "$\\ce{Na+}$ must be amphoteric, since it can pair with both $\\ce{Cl-}$ and $\\ce{OH-}$",
        ], 1,
        "The Brønsted labels are only ever about protons: an acid donates $\\ce{H+}$, a base accepts $\\ce{H+}$. $\\ce{Na+}$ does neither. It carries no proton to give and has no lone pair to grab one, so it sits in solution as a spectator ion. It came to watch the match, not to play. Charge alone does not make a species an acid or a base; the proton transfer does.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Brønsted–Lowry and Conjugate Pairs',
        "- **Acid donates $\\ce{H+}$, base accepts $\\ce{H+}$.** This is wider than Arrhenius and explains why $\\ce{NH3}$ is basic without an $\\ce{OH}$ group.\n" +
        "- **Conjugate pair = one proton apart.** For the conjugate base, remove an $\\ce{H+}$; for the conjugate acid, add an $\\ce{H+}$. The charge shifts by one each time.\n" +
        "- **Strength seesaw:** stronger acid leaves a weaker conjugate base. Acidity $\\ce{HI} > \\ce{HBr} > \\ce{HCl} > \\ce{HF}$ flips to basicity $\\ce{I-} < \\ce{Br-} < \\ce{Cl-} < \\ce{F-}$.\n" +
        "- **Amphoteric species** ($\\ce{H2O}$, $\\ce{HCO3-}$, $\\ce{HSO4-}$) act as acid or base depending on the partner. Be ready to write both conjugates.\n" +
        "- **Classic trap:** a spectator ion such as $\\ce{Na+}$ is neither acid nor base. A positive charge alone does not make a Brønsted acid."),
      h.quiz([
        {
          question: "In the reaction $\\ce{NH3 + H2O <=> NH4+ + OH-}$, which species is the Brønsted base?",
          options: [
            "$\\ce{NH3}$, because it accepts a proton from water",
            "$\\ce{H2O}$, because it accepts a proton from ammonia",
            "$\\ce{NH4+}$, because it carries a positive charge",
            "$\\ce{OH-}$, because it is produced in the reaction",
          ], correct_index: 0,
          explanation: "A Brønsted base accepts a proton. Ammonia takes an $\\ce{H+}$ from water to become $\\ce{NH4+}$, so $\\ce{NH3}$ is the base and water is the acid. Carrying a charge or simply being a product does not decide the role; accepting the proton does.",
        },
        {
          question: "The conjugate base of $\\ce{HSO4-}$ is:",
          options: [
            "$\\ce{H2SO4}$",
            "$\\ce{SO4^{2-}}$",
            "$\\ce{SO3^{2-}}$",
            "$\\ce{OH-}$",
          ], correct_index: 1,
          explanation: "A conjugate base is formed by removing one $\\ce{H+}$, which also lowers the charge by one. Taking an $\\ce{H+}$ off $\\ce{HSO4-}$ gives $\\ce{SO4^{2-}}$. Adding a proton instead would give the conjugate acid $\\ce{H2SO4}$, which is why that option is wrong.",
        },
        {
          question: "Among the halogen acids, acidity falls in the order $\\ce{HI} > \\ce{HBr} > \\ce{HCl} > \\ce{HF}$. What does this tell you about their conjugate bases?",
          options: [
            "$\\ce{I-}$ is the strongest base because $\\ce{HI}$ is the strongest acid",
            "All four conjugate bases have equal strength, since they are all halide ions",
            "$\\ce{F-}$ is the strongest base, because the weakest acid $\\ce{HF}$ leaves the strongest conjugate base",
            "The conjugate bases follow the same order as the acids: $\\ce{I-} > \\ce{Br-} > \\ce{Cl-} > \\ce{F-}$ in basicity",
          ], correct_index: 2,
          explanation: "The stronger an acid, the weaker its conjugate base, so the order of base strength is the reverse of the acid order. The weakest acid here is $\\ce{HF}$, so its conjugate base $\\ce{F-}$ is the strongest. That makes $\\ce{I-}$ the weakest base, not the strongest, and the strengths are not equal.",
        },
      ]),
    ];
  },
};
