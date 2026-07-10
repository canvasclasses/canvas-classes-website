// CEQ page 11 — Degree of dissociation (alpha) + the ICE method (NCERT §7.6.3).
// Voice: teacher-voice-profile + CEQ-exemplars (B: "whenever you use alpha, start
// with 1 mole"; D11/D12 ICE exemplars; C: x is not the percentage trap). Folds NCERT
// Problems 7.4 (CO+H2O), 7.8 (N2O4 / Kc & Kp), 7.9 (PCl5) verbatim-arithmetic as worked().
// §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO, say-it-once.
module.exports = {
  page_number: 11,
  slug: 'degree-of-dissociation-and-ice-method',
  title: 'Degree of Dissociation and the ICE Method',
  subtitle: 'From a starting mixture to the final amounts.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A single reaction flask in the centre drawn like a chemist sketched it; inside it, on the left a neat row of identical reactant particles, and on the right a few of them shown splitting apart into smaller pieces, with a faint hand-lettered fraction-bar note suggesting "part of every mole breaks up". A small hand-drawn three-row grid in the corner labelled faintly I / C / E like a bookkeeping ledger. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Bookkeeping for a Reaction',
        "A shopkeeper who starts the day with 100 packets, sells some, and counts what is left is doing exactly what you do to find an equilibrium mixture. You write down what you began with, what got used up or made, and what survives at the end. Chemists keep these books in a small three-row table, and once you can fill it in, almost every numerical in this chapter is just arithmetic."),
      h.text(
        "When a reactant dissociates, usually only part of it breaks apart before the reaction settles. The fraction that does is called the **degree of dissociation**, written $\\alpha$. If one mole of $\\ce{PCl5}$ is taken and $\\alpha = 0.3$, then $0.3$ mole has split into $\\ce{PCl3}$ and $\\ce{Cl2}$, while $0.7$ mole of $\\ce{PCl5}$ is still left. So $\\alpha$ runs from $0$ (nothing dissociated) to $1$ (everything dissociated), and it is read straight off as a fraction of one mole.\n\n" +
        "$$\\alpha = \\frac{\\text{moles dissociated}}{\\text{initial moles}}$$\n\n" +
        "There is a small habit that keeps the algebra clean: **whenever you work with $\\alpha$, start with exactly one mole of the reactant.** Then the amount that dissociates is $\\alpha$ itself, the amount left is $1-\\alpha$, and you never have to drag an extra letter through the working."
      ),
      h.heading('The ICE table — Initial, Change, Equilibrium', 'Build a three-row table in terms of $x$ and turn an equilibrium problem into routine arithmetic.'),
      h.text(
        "The three-row table is called an **ICE table**, for **I**nitial, **C**hange, **E**quilibrium. NCERT lays it out as a five-step method, and it is worth following in the same order every time:\n\n" +
        "1. **Write the balanced equation.** The coefficients decide the changes in the next step.\n" +
        "2. **Fill the Initial row** with the starting amounts (concentrations or pressures), products usually zero.\n" +
        "3. **Fill the Change row** using one unknown $x$. Reactant goes down by its coefficient times $x$; product goes up the same way. So for $\\ce{A <=> B + C}$ you write $-x$, $+x$, $+x$.\n" +
        "4. **Fill the Equilibrium row** by adding the first two: $a-x$ for the reactant, $x$ for each product.\n" +
        "5. **Substitute into $K$ and solve for $x$.** If you land on a quadratic, keep the root that makes chemical sense and reject the one that gives a negative or impossible amount.\n\n" +
        "Then back-substitute $x$ to read off every equilibrium amount. The table below shows the layout for a generic $\\ce{A <=> B + C}$."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A clean three-row, four-column bookkeeping table drawn like a chemist sketched it in a notebook. Top header row hand-lettered with the reaction "A <=> B + C" spanning the three substance columns. Left column labels the three rows: "Initial (I)", "Change (C)", "Equilibrium (E)". The Initial row shows "a", "0", "0". The Change row shows "-x", "+x", "+x" with small down-arrow on A and up-arrows on B and C. The Equilibrium row shows "a - x", "x", "x". A short hand-lettered note to the side: "add the first two rows to get the last". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'The ICE table for A ⇌ B + C: write the start, write the change as ±x using the coefficients, and add the two rows to get the equilibrium amounts.'
      ),
      h.worked('Problem 7.4 (NCERT)', 'ncert_intext',
        "$K_c = 4.24$ at 800 K for the reaction $\\ce{CO(g) + H2O(g) <=> CO2(g) + H2(g)}$. Calculate the equilibrium concentrations of $\\ce{CO2}$, $\\ce{H2}$, $\\ce{CO}$ and $\\ce{H2O}$ at 800 K if only $\\ce{CO}$ and $\\ce{H2O}$ are present initially, each at $0.10$ M.",
        "**Step 1 — equation.** $\\ce{CO(g) + H2O(g) <=> CO2(g) + H2(g)}$\n\n" +
        "**Step 2 — ICE table** (let $x$ = mol/L of $\\ce{CO2}$ formed):\n\n" +
        "Initial: $0.10,\\ 0.10,\\ 0,\\ 0$\n\n" +
        "Equilibrium: $(0.10-x),\\ (0.10-x),\\ x,\\ x$\n\n" +
        "**Step 3 — substitute into $K_c$.**\n\n" +
        "$$K_c = \\frac{x^2}{(0.10-x)^2} = 4.24$$\n\n" +
        "**Step 4 — solve.** Expanding gives the quadratic\n\n" +
        "$$3.24\\,x^2 - 0.848\\,x + 0.0424 = 0$$\n\n" +
        "with roots $x = 0.067$ and $x = 0.194$.\n\n" +
        "The root $0.194$ is rejected: it is larger than the $0.10$ you started with, which would mean more product than reactant ever existed. So $x = 0.067$ M.\n\n" +
        "**Step 5 — read off the mixture.**\n\n" +
        "$[\\ce{CO2}] = [\\ce{H2}] = x = 0.067$ M\n\n" +
        "$[\\ce{CO}] = [\\ce{H2O}] = 0.10 - 0.067 = 0.033$ M\n\n" +
        "**Answer:** $[\\ce{CO2}] = [\\ce{H2}] = 0.067$ M and $[\\ce{CO}] = [\\ce{H2O}] = 0.033$ M.",
        'tap_to_reveal'),
      h.worked('Problem 7.8 (NCERT)', 'ncert_intext',
        "$13.8$ g of $\\ce{N2O4}$ was placed in a 1 L reaction vessel at 400 K and allowed to reach equilibrium: $\\ce{N2O4(g) <=> 2NO2(g)}$. The total pressure at equilibrium was $9.15$ bar. Calculate $K_c$, $K_p$ and the partial pressures at equilibrium.",
        "**Set up the initial pressure.** Moles of $\\ce{N2O4} = 13.8/92 = 0.15$. From $pV = nRT$ with $V = 1$ L, $R = 0.083$ bar L mol⁻¹K⁻¹, $T = 400$ K:\n\n" +
        "$$p = \\frac{nRT}{V} = 0.15 \\times 0.083 \\times 400 = 4.98 \\text{ bar}$$\n\n" +
        "**ICE table in pressures** (let $x$ = drop in $\\ce{N2O4}$ pressure):\n\n" +
        "Initial: $4.98,\\ 0$\n\n" +
        "Equilibrium: $(4.98 - x),\\ 2x$\n\n" +
        "**Use the total pressure.**\n\n" +
        "$$p_\\text{total} = (4.98 - x) + 2x = 9.15$$\n\n" +
        "$$x = 9.15 - 4.98 = 4.17 \\text{ bar}$$\n\n" +
        "**Partial pressures.**\n\n" +
        "$p_{\\ce{N2O4}} = 4.98 - 4.17 = 0.81$ bar\n\n" +
        "$p_{\\ce{NO2}} = 2x = 8.34$ bar\n\n" +
        "**$K_p$ and $K_c$.**\n\n" +
        "$$K_p = \\frac{(p_{\\ce{NO2}})^2}{p_{\\ce{N2O4}}} = \\frac{(8.34)^2}{0.81} = 85.87$$\n\n" +
        "With $\\Delta n_g = 2 - 1 = 1$ and $K_p = K_c(RT)^{\\Delta n_g}$:\n\n" +
        "$$K_c = \\frac{85.87}{0.083 \\times 400} = 2.6 \\text{ mol L}^{-1}$$\n\n" +
        "**Answer:** $p_{\\ce{N2O4}} = 0.81$ bar, $p_{\\ce{NO2}} = 8.34$ bar, $K_p = 85.87$, $K_c = 2.6$ mol L⁻¹.",
        'tap_to_reveal'),
      h.worked('Problem 7.9 (NCERT)', 'ncert_intext',
        "$3.00$ mol of $\\ce{PCl5}$ kept in a 1 L closed vessel was allowed to reach equilibrium at 380 K. Calculate the composition of the mixture at equilibrium. $K_c = 1.80$.",
        "**ICE table** for $\\ce{PCl5 <=> PCl3 + Cl2}$ (let $x$ mol/L of $\\ce{PCl5}$ dissociate):\n\n" +
        "Initial: $3.0,\\ 0,\\ 0$\n\n" +
        "Equilibrium: $(3 - x),\\ x,\\ x$\n\n" +
        "**Substitute into $K_c$.**\n\n" +
        "$$K_c = \\frac{[\\ce{PCl3}][\\ce{Cl2}]}{[\\ce{PCl5}]} = \\frac{x^2}{3 - x} = 1.80$$\n\n" +
        "**Solve the quadratic.**\n\n" +
        "$$x^2 + 1.8x - 5.4 = 0$$\n\n" +
        "$$x = \\frac{-1.8 \\pm \\sqrt{(1.8)^2 + 4(5.4)}}{2} = \\frac{-1.8 \\pm 4.98}{2}$$\n\n" +
        "Keep the positive root: $x = 1.59$ (the negative root gives a meaningless negative concentration).\n\n" +
        "**Read off the mixture.**\n\n" +
        "$[\\ce{PCl5}] = 3.0 - 1.59 = 1.41$ M\n\n" +
        "$[\\ce{PCl3}] = [\\ce{Cl2}] = 1.59$ M\n\n" +
        "**Answer:** $[\\ce{PCl5}] = 1.41$ M, $[\\ce{PCl3}] = [\\ce{Cl2}] = 1.59$ M.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "Equimolar $\\ce{CO}$ and $\\ce{H2O}$ are heated and reach equilibrium for $\\ce{CO(g) + H2O(g) <=> CO2(g) + H2(g)}$ with $K_c = 4.0$. Starting from 1 mole of each, the ICE table gives $\\frac{x}{1-x} = 2$, so $x = \\tfrac{2}{3}$. A student reads $x = \\tfrac{2}{3}$ and writes the answer as 67% $\\ce{CO2}$. Where did they go wrong?",
        [
          "Nowhere — $x = \\tfrac{2}{3}$ is the mole fraction of $\\ce{CO2}$, so 67% is correct",
          "They should add up all the moles at equilibrium; total is 2, so $\\ce{CO2}$ is $\\tfrac{2/3}{2} = \\tfrac{1}{3}$, which is 33%",
          "They forgot that $\\Delta n_g$ is not zero here, so the volume does not cancel",
          "They used $K_c$ instead of $K_p$, so the whole value of $x$ is wrong",
        ], 1,
        "The slip is rushing $x$ straight into a percentage. $x = \\tfrac{2}{3}$ is the moles of $\\ce{CO2}$ formed, not its share of the mixture. At equilibrium the total moles are $(1-x) + (1-x) + x + x = 2$, unchanged because $\\Delta n_g = 0$. So the fraction that is $\\ce{CO2}$ is $\\tfrac{2/3}{2} = \\tfrac{1}{3}$, that is 33%. Find $x$, then divide by the total before calling it a percentage.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Working the ICE Table',
        "- **Start with 1 mole when using $\\alpha$.** Then dissociated $= \\alpha$, left $= 1-\\alpha$, and the algebra stays short.\n" +
        "- **Quadratic root choice:** keep the root that gives positive amounts no larger than what you started with. Reject any root that makes a concentration negative or bigger than the initial value.\n" +
        "- **$\\Delta n_g = 0$ shortcut:** when moles of gas are equal on both sides (as in $\\ce{CO + H2O <=> CO2 + H2}$), the volume cancels in $K_c$, so you can work straight in moles.\n" +
        "- **Classic trap:** $x$ is the amount reacted, not the percentage. Divide $x$ by the total moles at equilibrium before quoting a percent, or you will land on the distractor the examiner planted."),
      h.quiz([
        {
          question: "For $\\ce{PCl5 <=> PCl3 + Cl2}$, one mole of $\\ce{PCl5}$ is taken and its degree of dissociation is $\\alpha$. The moles of $\\ce{PCl5}$ left at equilibrium are:",
          options: [
            "$\\alpha$",
            "$1 - \\alpha$",
            "$1 + \\alpha$",
            "$2\\alpha$",
          ], correct_index: 1,
          explanation: "Degree of dissociation is the fraction that breaks up, so $\\alpha$ mole dissociates and $1 - \\alpha$ mole survives. The $\\alpha$ that left becomes one mole each of $\\ce{PCl3}$ and $\\ce{Cl2}$, which is why starting from 1 mole keeps the bookkeeping simple.",
        },
        {
          question: "In an ICE table for $\\ce{A(g) <=> B(g) + C(g)}$ starting with $a$ mol of $\\ce{A}$ and letting $x$ react, the equilibrium row reads:",
          options: [
            "$a,\\ x,\\ x$",
            "$a - x,\\ x,\\ x$",
            "$a - x,\\ a - x,\\ x$",
            "$a - 2x,\\ x,\\ x$",
          ], correct_index: 1,
          explanation: "The reactant falls by $x$ to $a - x$, and each product rises from zero to $x$ because the coefficients are all one. Writing $a$ unchanged ignores the consumption; writing $a - 2x$ would suit a coefficient of 2 on $\\ce{A}$, which is not the case here.",
        },
        {
          question: "While solving an ICE-table quadratic you get two roots, $x = 0.067$ and $x = 0.194$, for a reactant that started at $0.10$ M. Which root do you keep and why?",
          options: [
            "$0.194$, because the larger root always gives more product",
            "$0.067$, because $0.194$ would use up more reactant than was ever present",
            "Both are valid; the question has two equilibrium states",
            "Neither; a quadratic with two positive roots means the data is wrong",
          ], correct_index: 1,
          explanation: "You can only consume what you started with. Since $0.194 > 0.10$, that root would leave a negative concentration of reactant, which is impossible, so it is rejected. The chemically sensible root $0.067$ keeps every amount positive and within the starting value.",
        },
      ]),
    ];
  },
};
