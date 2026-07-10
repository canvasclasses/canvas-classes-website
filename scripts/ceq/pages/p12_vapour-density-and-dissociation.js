// CEQ page 12 — Vapour density & degree of dissociation; D/d = 1 + (n-1)alpha.
// Voice: teacher-voice-profile + CEQ-exemplars (A: 50-gram block into five 10-gram
// pieces, mass conserved not moles, "not a nuclear reaction"; B: khichdi mixture molar
// mass = total mass / total moles; D15 vapour-density worked example). Derive by
// conserving MASS not moles. §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para.
module.exports = {
  page_number: 12,
  slug: 'vapour-density-and-dissociation',
  title: 'Vapour Density and Degree of Dissociation',
  subtitle: 'Reading dissociation off a molar mass.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. On the left, a single heavy block drawn like a chemist sketched it, labelled faintly "50 g". A curved arrow leads to the right, where the same block is shown broken into five smaller equal pieces scattered apart, faintly labelled "10 g each". A small hand-lettered balance scale beneath both sides reads equal, with a tiny note "more pieces, same mass". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Break the Block, Keep the Weight',
        "Take a 50-gram block and snap it into five 10-gram pieces. You now hold five things instead of one, but the scale still reads 50 grams. Breaking something into more pieces changes how many pieces you have, never the total mass. When a gas dissociates it does the same: the particle count climbs while the mass on the books stays put. That single fact is the whole derivation on this page."),
      h.text(
        "When a gas like $\\ce{N2O4}$ dissociates into $\\ce{2NO2}$, one particle becomes two, so the number of moles in the flask goes up. The mass in the flask has not changed, because no atoms were created. So you now have the same mass spread over more moles, and the average mass per mole comes down.\n\n" +
        "The molar mass of a mixture is just its total mass divided by its total moles, the way you would find the average price of a mixed bag of goods. Since dissociation raises the moles while holding the mass fixed, the **observed molar mass of the mixture falls below** the molar mass the gas had before it dissociated. Measure how far it has fallen and you can read off how much dissociated."
      ),
      h.heading('Deriving D/d = 1 + (n−1)α', 'Conserve mass through a dissociation and connect the drop in vapour density to the degree of dissociation.'),
      h.text(
        "Take a general dissociation $\\ce{A_n(g) <=> nA(g)}$, where one reactant particle gives $n$ product particles. Start with 1 mole and let the degree of dissociation be $\\alpha$:\n\n" +
        "- Moles of $\\ce{A_n}$ left $= 1 - \\alpha$\n" +
        "- Moles of $\\ce{A}$ formed $= n\\alpha$\n" +
        "- Total moles at equilibrium $= 1 - \\alpha + n\\alpha = 1 + (n-1)\\alpha$\n\n" +
        "Now conserve mass. The mass at the start is one mole of $\\ce{A_n}$, that is $M_{\\text{theoretical}}$. The same mass is shared among the $1 + (n-1)\\alpha$ moles present at equilibrium, so the observed molar mass of the mixture is\n\n" +
        "$$M_{\\text{observed}} = \\frac{M_{\\text{theoretical}}}{1 + (n-1)\\alpha}$$\n\n" +
        "Rearranging gives the working form. Since vapour density is just molar mass divided by 2, the same ratio holds for vapour densities, with $D$ the value before dissociation and $d$ the observed value of the mixture:\n\n" +
        "$$\\frac{D}{d} = \\frac{M_{\\text{theoretical}}}{M_{\\text{observed}}} = 1 + (n-1)\\alpha$$\n\n" +
        "The $n$ here is the same $n$ you meet as the van't Hoff factor in colligative properties: the number of particles one formula unit splits into. The whole derivation rested on conserving mass and not moles, because the dissociation rearranges particles, it does not make matter."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A two-panel notebook sketch. LEFT panel: a single labelled block "1 mole A_n, mass = M_theoretical" sitting on a small balance pan. RIGHT panel: an arrow from the left leads to the same block now partly broken up — some whole A_n pieces and several smaller A pieces scattered — sitting on an identical balance pan that reads the SAME tilt as the left (mass unchanged), hand-lettered "more particles, same mass". Below, a clean hand-lettered line "D/d = 1 + (n-1)alpha" with a small note "mass conserved, moles increased". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'Dissociation breaks one heavy particle into n lighter ones: the mole count rises but the mass on the balance holds, so the observed vapour density drops — that drop is D/d = 1 + (n−1)α.'
      ),
      h.worked('Solved Example', 'solved_example',
        "For $\\ce{N2O4(g) <=> 2NO2(g)}$, the observed molar mass of the equilibrium mixture is $77.7$ g/mol. Find the percentage dissociation of $\\ce{N2O4}$.",
        "**Identify $n$ and the molar masses.** One $\\ce{N2O4}$ gives two $\\ce{NO2}$, so $n = 2$. The molar mass before dissociation is $M_{\\text{theoretical}} = 92$ g/mol (the molar mass of $\\ce{N2O4}$), and the observed value of the mixture is $M_{\\text{observed}} = 77.7$ g/mol.\n\n" +
        "**Put them into the formula.**\n\n" +
        "$$\\frac{M_{\\text{theoretical}}}{M_{\\text{observed}}} = 1 + (n-1)\\alpha$$\n\n" +
        "$$\\frac{92}{77.7} = 1 + (2 - 1)\\alpha$$\n\n" +
        "**Solve for $\\alpha$.**\n\n" +
        "$$1.184 = 1 + \\alpha$$\n\n" +
        "$$\\alpha = 0.184$$\n\n" +
        "**Answer:** $\\alpha = 0.184$, so $\\ce{N2O4}$ is about **18.4%** dissociated.\n\n" +
        "If you preferred to work in vapour densities, the same numbers appear halved: $D = 92/2 = 46$ and $d = 77.7/2 = 38.85$, and $D/d = 46/38.85 = 1.184$ gives the same $\\alpha$.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "A gas $\\ce{A2}$ dissociates as $\\ce{A2(g) <=> 2A(g)}$. Its theoretical molar mass is $80$ g/mol, and at equilibrium the observed molar mass of the mixture is measured as $64$ g/mol. What is the degree of dissociation?",
        [
          "$\\alpha = 0.25$, from $\\frac{80}{64} = 1 + (2-1)\\alpha$",
          "$\\alpha = 0.20$, because the molar mass fell by $\\tfrac{16}{80}$",
          "$\\alpha = 0.80$, from $\\frac{64}{80}$ taken directly",
          "It cannot be found without knowing the pressure",
        ], 0,
        "Use $\\frac{M_{\\text{theoretical}}}{M_{\\text{observed}}} = 1 + (n-1)\\alpha$ with $n = 2$. So $\\frac{80}{64} = 1.25 = 1 + \\alpha$, giving $\\alpha = 0.25$. The tempting wrong move is to divide the drop in molar mass by the wrong base, or to flip the ratio to $\\frac{64}{80}$; the larger molar mass always sits on top. The pressure is not needed because the molar-mass ratio already carries the dissociation.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Vapour Density Shortcuts',
        "- The working relation is $\\dfrac{D}{d} = \\dfrac{M_{\\text{theoretical}}}{M_{\\text{observed}}} = 1 + (n-1)\\alpha$. Rearranged: $\\alpha = \\dfrac{D - d}{(n-1)d}$.\n" +
        "- $D$ (or $M_{\\text{theoretical}}$) is the value **before** dissociation; $d$ (or $M_{\\text{observed}}$) is the value **of the mixture** at equilibrium. The bigger one always sits on top.\n" +
        "- $n$ is the number of product particles per reactant molecule: $\\ce{N2O4 -> 2NO2}$ has $n = 2$; $\\ce{PCl5 -> PCl3 + Cl2}$ has $n = 2$; $\\ce{2NH3 -> N2 + 3H2}$ has $n = 2$.\n" +
        "- **Watch out:** the derivation conserves mass, not moles. A common slip is to set the equilibrium moles equal to the starting moles. The moles rise; the mass is what stays fixed."),
      h.quiz([
        {
          question: "When a gas dissociates into more particles at constant mass, its observed molar mass:",
          options: [
            "increases, because there are now more particles",
            "decreases, because the same mass is shared over more moles",
            "stays the same, because mass is conserved",
            "drops to zero once dissociation is complete",
          ], correct_index: 1,
          explanation: "Dissociation raises the mole count while the mass is unchanged, and molar mass is mass divided by moles, so the average comes down. Mass being conserved is exactly why the molar mass falls rather than staying put — more moles below the same mass means a smaller quotient.",
        },
        {
          question: "In the relation $\\frac{D}{d} = 1 + (n-1)\\alpha$, the symbol $D$ stands for the vapour density:",
          options: [
            "of the equilibrium mixture after dissociation",
            "of the gas before any dissociation has occurred",
            "of the lightest product particle only",
            "averaged over the whole reaction time",
          ], correct_index: 1,
          explanation: "$D$ is the theoretical vapour density of the undissociated gas, and $d$ is the observed value of the mixture once dissociation has happened. Since dissociation lowers the vapour density, $D$ is the larger value and always sits on top of the ratio.",
        },
        {
          question: "For $\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$, what value of $n$ goes into $\\frac{D}{d} = 1 + (n-1)\\alpha$?",
          options: [
            "$n = 1$, because $\\ce{PCl5}$ is one molecule",
            "$n = 2$, because one $\\ce{PCl5}$ gives two product particles",
            "$n = 3$, counting all species in the equation",
            "$n = 0.5$, because the products are lighter",
          ], correct_index: 1,
          explanation: "$n$ counts the product particles formed from one reactant molecule. One $\\ce{PCl5}$ gives one $\\ce{PCl3}$ plus one $\\ce{Cl2}$, which is two particles, so $n = 2$. Counting the reactant as well (giving 3) double-counts, and the reactant molecule itself is not part of $n$.",
        },
      ]),
    ];
  },
};
