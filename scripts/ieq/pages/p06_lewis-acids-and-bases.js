// IEQ page 6 — "The Lewis Concept" (NCERT §7.10.3 + Problem 7.15).
// Sub-topic: Lewis acid = electron-pair acceptor, base = electron-pair donor (the
// most general theory; covers protonless acids like BF3 + NH3 -> BF3:NH3). The four
// Lewis-acid families (incomplete octet BF3/AlCl3/BCl3; cations H+/Ag+/Mg2+; pi-bond
// shifters CO2/SO2/SO3; vacant-d species SiX4/PX3) and the two base families (anions
// OH-/Cl-/CN-; neutral lone-pair species NH3/H2O). Closes with the 3-theory summary
// table (Arrhenius / Bronsted-Lowry / Lewis). Folds NCERT Problem 7.15 as worked().
// Source: founder notes p9-11 (Lewis theory, 4 acid families, 3-theory table),
// NCERT physical p209 (§7.10.3 + Problem 7.15).
// HIS analogy is reserved for the strength page (p07) per IEQ-exemplars; this page
// stays definitional, so no forced analogy is inserted (profile §1.3 placement rule).
// §5.X audited: no "Not X. It is Y." pairs, no stacked metaphors, <=1 em-dash/para,
// second person, say-it-once, no reveal framing, no universal-you, no triple-repetition.
module.exports = {
  page_number: 6,
  slug: 'lewis-acids-and-bases',
  title: 'The Lewis Concept',
  subtitle: 'Acids accept electron pairs, bases donate them.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Centre: an ammonia molecule NH3 with a clear lone pair of two dots reaching across a small gap toward a boron trifluoride molecule BF3, drawn like a hand offering a small pair of beads into an empty slot. A faint curved arrow runs from the NH3 lone pair to the boron. The NH3 is hand-lettered "donor" and the BF3 "acceptor", with a tiny note "no H+ needed". To one side, faintly, three small empty boxes hand-lettered "incomplete octet", "cation", "vacant orbital" suggesting the acid families. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'An Acid With No Hydrogen At All',
        "Boron trifluoride, $\\ce{BF3}$, has no proton to give away, so the proton-based theories cannot call it an acid. Yet it grabs the lone pair on ammonia and locks into a solid adduct, $\\ce{BF3:NH3}$, behaving exactly the way an acid should. G. N. Lewis solved this in 1923 by changing the question. Instead of asking who hands over a proton, he asked who hands over an electron pair, and a whole family of protonless acids walked in."),
      h.text(
        "The Brønsted view runs on the proton. That works for most acids you meet, but it shuts out species like $\\ce{BF3}$ that act acidic with no proton to offer. Lewis widened the net by looking at the electron pair instead.\n\n" +
        "A **Lewis acid** is an electron-pair **acceptor**. A **Lewis base** is an electron-pair **donor**. This is the most general of the three theories, because every Brønsted acid–base reaction is also an electron-pair transfer, while many electron-pair transfers (such as $\\ce{BF3}$ with $\\ce{NH3}$) involve no proton at all.\n\n" +
        "$$\\ce{BF3 + :NH3 -> BF3:NH3}$$\n\n" +
        "Here ammonia donates its lone pair, so $\\ce{NH3}$ is the Lewis base. Boron has an empty orbital and accepts that pair, so $\\ce{BF3}$ is the Lewis acid. The new bond holding the adduct together is the donated pair shared between them."
      ),
      h.heading('The four families of Lewis acids', 'Recognise a Lewis acid from its structure — an empty slot for an electron pair — across the four common families.'),
      h.text(
        "A Lewis acid needs somewhere to put an incoming electron pair. Spotting that empty slot is the whole skill, and it shows up in four recurring families:\n\n" +
        "1. **Incomplete-octet species.** The central atom sits short of eight electrons, so it has room to take a pair. Examples are $\\ce{BF3}$, $\\ce{AlCl3}$ and $\\ce{BCl3}$, where boron and aluminium carry only six electrons.\n" +
        "2. **Cations.** A positive ion is electron-poor by definition and pulls in a pair. Examples are $\\ce{H+}$, $\\ce{Ag+}$ and $\\ce{Mg^{2+}}$.\n" +
        "3. **Molecules that can shift a $\\pi$-bond.** The central atom already has a full shell, but it can push a $\\pi$-bond aside to free up room for the pair. Examples are $\\ce{CO2}$, $\\ce{SO2}$ and $\\ce{SO3}$.\n" +
        "4. **Species with vacant $d$-orbitals.** A third-period (or lower) central atom keeps empty $d$-orbitals that can host an extra pair. Examples are $\\ce{SiX4}$ and $\\ce{PX3}$ (with $\\ce{X}$ a halogen).\n\n" +
        "The Lewis bases are easier to place. They are the species with a pair to spare: **anions** such as $\\ce{OH-}$, $\\ce{Cl-}$ and $\\ce{CN-}$, and **neutral molecules carrying a lone pair** such as $\\ce{NH3}$ and $\\ce{H2O}$. If a species has at least one lone pair to offer, it can act as a Lewis base."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two-part science-notebook diagram, neat hand-lettering. TOP panel: the adduct formation "H3N: -> BF3" drawn large and clear — an ammonia with a visible lone pair (two dots) and a curved arrow carrying that pair into the empty orbital on boron, ending in the product bracket [H3N-BF3] with the new bond highlighted, hand-lettered "lone pair donated -> new bond". NH3 labelled "Lewis base (donor)", BF3 labelled "Lewis acid (acceptor)". BOTTOM panel, set apart by a faint divider: a clean three-row comparison card titled "Three theories of acids & bases" with three hand-lettered rows — "Arrhenius: acid = gives H+ / base = gives OH-", "Bronsted-Lowry: acid = donates H+ / base = accepts H+", "Lewis: acid = accepts e- pair / base = donates e- pair". Uncluttered, warm ink colours.',
        '16:9',
        'Top: ammonia donates its lone pair into the empty orbital of BF₃, forming the acid–base adduct H₃N→BF₃. Bottom: the three theories side by side — Lewis is the widest, defined by the electron pair rather than the proton.'
      ),
      h.text(
        "Stacking the three theories side by side shows how each widens the one before it. Arrhenius ties acids and bases to $\\ce{H+}$ and $\\ce{OH-}$ in water. Brønsted–Lowry drops the $\\ce{OH-}$ requirement and works off the proton alone. Lewis drops the proton too and works off the electron pair, so it is the broadest definition of the three."
      ),
      h.callout('remember', 'The Three Definitions At A Glance',
        "- **Arrhenius** — acid gives $\\ce{H+}$ in water; base gives $\\ce{OH-}$ in water.\n" +
        "- **Brønsted–Lowry** — acid donates $\\ce{H+}$; base accepts $\\ce{H+}$.\n" +
        "- **Lewis** — acid accepts an electron pair; base donates an electron pair.\n\n" +
        "Each row is wider than the one above it. A species can carry different labels under different theories, so always check which definition the question is using."),
      h.worked('Problem 7.15 (NCERT)', 'ncert_intext',
        "Classify the following species into Lewis acids and Lewis bases and show how they act as such: (a) $\\ce{OH-}$ (b) $\\ce{F-}$ (c) $\\ce{H+}$ (d) $\\ce{BCl3}$.",
        "**Rule.** A Lewis acid accepts an electron pair (it has an empty slot); a Lewis base donates an electron pair (it has a lone pair to give).\n\n" +
        "**(a) $\\ce{OH-}$** is a Lewis **base**. It can donate an electron lone pair, written $\\ce{:OH-}$.\n\n" +
        "**(b) $\\ce{F-}$** is a Lewis **base**. It can donate any one of its four electron lone pairs.\n\n" +
        "**(c) $\\ce{H+}$** is a Lewis **acid**. As a bare cation it has an empty orbital and accepts a lone pair from a base such as $\\ce{OH-}$ or $\\ce{F-}$.\n\n" +
        "**(d) $\\ce{BCl3}$** is a Lewis **acid**. Boron has an incomplete octet, so it accepts a lone pair from a base such as ammonia or an amine molecule.\n\n" +
        "**Answer:** Lewis bases are $\\ce{OH-}$ and $\\ce{F-}$ (lone-pair donors); Lewis acids are $\\ce{H+}$ and $\\ce{BCl3}$ (electron-pair acceptors).",
        'tap_to_reveal'),
      h.reasoning('logical',
        "A student is asked whether $\\ce{PCl5}$ in its gas-phase monomer form can act as a Lewis base. They answer yes, reasoning that phosphorus is a large third-period atom with $d$-orbitals available. How should you judge this?",
        [
          "The student is right — any atom with $d$-orbitals can act as a Lewis base",
          "A Lewis base must donate a lone pair, and in $\\ce{PCl5}$ phosphorus has used all five of its valence electrons in bonds, leaving no lone pair to give; it can act as a Lewis acid instead",
          "$\\ce{PCl5}$ is neither acid nor base, because phosphorus is exactly half-filled",
          "$\\ce{PCl5}$ is a Lewis base because it has more electrons than $\\ce{PCl3}$",
        ], 1,
        "A Lewis base is defined by having a lone pair to donate. In $\\ce{PCl5}$ all five of phosphorus's valence electrons are tied up in the five $\\ce{P-Cl}$ bonds, so nothing is left over to offer a base. The vacant $d$-orbitals point the other way: they let phosphorus accept an extra pair, which makes $\\ce{PCl5}$ a Lewis acid. The presence of $d$-orbitals supports accepting a pair, not donating one.",
        2),
      h.callout('exam_tip', 'JEE / NEET — The Lewis Concept',
        "- **Lewis acid = electron-pair acceptor; Lewis base = electron-pair donor.** This is the widest of the three theories and the only one that covers protonless acids like $\\ce{BF3}$.\n" +
        "- **Four acid families to recognise:** incomplete octet ($\\ce{BF3}$, $\\ce{AlCl3}$, $\\ce{BCl3}$); cations ($\\ce{H+}$, $\\ce{Ag+}$, $\\ce{Mg^{2+}}$); $\\pi$-bond shifters ($\\ce{CO2}$, $\\ce{SO2}$, $\\ce{SO3}$); vacant $d$-orbital species ($\\ce{SiX4}$, $\\ce{PX3}$).\n" +
        "- **Bases** are lone-pair holders: anions ($\\ce{OH-}$, $\\ce{Cl-}$, $\\ce{CN-}$) and neutral lone-pair molecules ($\\ce{NH3}$, $\\ce{H2O}$).\n" +
        "- **Classic trap:** a species with every valence electron locked in bonds (like $\\ce{PCl5}$) cannot be a Lewis base — there is no free pair to donate. Check for a lone pair before calling anything a base."),
      h.quiz([
        {
          question: "Why is $\\ce{BF3}$ classified as an acid under the Lewis theory but not under the Brønsted–Lowry theory?",
          options: [
            "Because $\\ce{BF3}$ accepts an electron pair, and the Brønsted theory only recognises proton donors — which $\\ce{BF3}$ has none of",
            "Because $\\ce{BF3}$ donates a proton, which the Brønsted theory ignores",
            "Because $\\ce{BF3}$ releases $\\ce{OH-}$ ions in water",
            "Because $\\ce{BF3}$ has a complete octet and so cannot react",
          ], correct_index: 0,
          explanation: "$\\ce{BF3}$ has an incomplete octet on boron, so it accepts an electron pair — a Lewis acid. The Brønsted theory defines an acid as a proton donor, and $\\ce{BF3}$ carries no proton to donate, so it falls outside that definition. It neither donates a proton nor releases $\\ce{OH-}$, which rules out the other options.",
        },
        {
          question: "Which of the following can act as a Lewis base?",
          options: [
            "$\\ce{Mg^{2+}}$, because it carries a positive charge",
            "$\\ce{NH3}$, because nitrogen has a lone pair to donate",
            "$\\ce{BCl3}$, because boron has an incomplete octet",
            "$\\ce{CO2}$, because it can shift a $\\pi$-bond aside",
          ], correct_index: 1,
          explanation: "A Lewis base donates an electron pair, so it needs a lone pair to give. Nitrogen in $\\ce{NH3}$ carries exactly such a lone pair. $\\ce{Mg^{2+}}$, $\\ce{BCl3}$ and $\\ce{CO2}$ each have an empty slot for a pair, which makes them Lewis acids, not bases.",
        },
        {
          question: "Which statement about the three acid–base theories is correct?",
          options: [
            "The Arrhenius theory is the most general because it works in any solvent",
            "The Lewis theory is the broadest, since every Brønsted reaction is also an electron-pair transfer but not every electron-pair transfer involves a proton",
            "Brønsted–Lowry and Lewis give identical classifications for every species",
            "Only the Lewis theory can describe $\\ce{HCl}$ dissolving in water",
          ], correct_index: 1,
          explanation: "Lewis works off the electron pair, which underlies proton transfer as well, so it captures the Brønsted cases and also protonless ones like $\\ce{BF3}$ — making it the broadest. Arrhenius is the narrowest (it needs water and $\\ce{OH-}$), the theories do not always agree, and $\\ce{HCl}$ in water is handled by all three, so the other options fail.",
        },
      ]),
    ];
  },
};
