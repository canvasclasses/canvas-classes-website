// CEQ page 7 — Kp and the Kc-Kp relationship (+ units of K).
// NCERT §7.4.1 + green "Units of K" box: for gas reactions Kp uses partial pressures;
// derive Kp = Kc(RT)^Δng with Δng = (moles gaseous product) - (moles gaseous reactant);
// Kx = Kp / P^Δng; units of Kc and Kp depend on Δng (H2+I2: Δng=0, unitless;
// N2O4<=>2NO2: Kc has mol/L, Kp has bar). Folds NCERT Problem 7.5 (Kp from Kc) with the
// arithmetic-correction note: NCERT prints 0.033 but Kc(RT)^Δn = 3.75e-6 x (0.0831x1069)
// ~ 3.3e-4.
// Voice: teacher-voice-profile + CEQ-exemplars. HIS must-memorise (B): "Kp = Kc(RT)^Δng
// AND Kp = Kx(P)^Δng -- keep both"; "Δng = 0 => the volume cancels, solve in moles" with
// the reason (both sides scale equally), not as ratta. §5.X audited: no "Not X. It is Y."
// pairs, <=1 em-dash/para, plain SVO, say-it-once, no reveal framing.
module.exports = {
  page_number: 7,
  slug: 'kp-and-kc-relationship',
  title: 'Kp and the Kc–Kp Relationship',
  subtitle: 'Equilibrium in terms of pressure — and the units of K.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A sealed reaction vessel of mixed gas molecules on the left, with little pressure-gauge dials reading the partial pressure of each gas. A faint hand-lettered bridge "Kp = Kc (RT)^Δng" arcing across to a small Δng signpost on the right pointing three ways: up, level, and down. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Two Ways to Count the Same Crowd',
        "When the species are gases, you can describe each one by its concentration or by its partial pressure, and both work. Counting the gas by pressure is often easier in the lab, since a gauge reads pressure straight off. So a second equilibrium constant exists, $K_p$, built from partial pressures. It is the same equilibrium seen through a different instrument."),
      h.text(
        "On the last page you built $K_c$ from concentrations in $\\text{mol L}^{-1}$. For a reaction where the species are gases, there is an easier handle to grab. Each gas has a **partial pressure**, and a pressure gauge reads it directly. So for a gas-phase reaction\n\n" +
        "$$aA + bB \\rightleftharpoons cC + dD$$\n\n" +
        "you can write the equilibrium constant from partial pressures instead of concentrations, and call it $K_p$:\n\n" +
        "$$K_p = \\frac{(p_C)^c (p_D)^d}{(p_A)^a (p_B)^b}$$\n\n" +
        "The shape is identical to $K_c$, with products over reactants and coefficients as powers. Only the quantity changes, from concentration to partial pressure."
      ),
      h.heading('Linking Kp and Kc', 'Derive $K_p = K_c (RT)^{\\Delta n_g}$ and read off the three cases of $\\Delta n_g$.'),
      h.text(
        "The two constants are tied together by the ideal gas law. For a gas, $pV = nRT$, so its pressure is $p = \\frac{n}{V}RT$. The quantity $\\frac{n}{V}$ is just the concentration, so $p = [\\text{gas}]\\,RT$ at a fixed temperature. Every partial pressure in $K_p$ is therefore its concentration multiplied by $RT$.\n\n" +
        "Substitute $p = [\\,]RT$ into the $K_p$ expression. The concentration parts rebuild $K_c$, and the leftover $RT$ factors collect into a single power:\n\n" +
        "$$K_p = K_c (RT)^{\\Delta n_g}$$\n\n" +
        "Here $\\Delta n_g$ is the change in the number of **gas** molecules across the equation:\n\n" +
        "$$\\Delta n_g = (\\text{moles of gaseous product}) - (\\text{moles of gaseous reactant})$$\n\n" +
        "Read off $\\Delta n_g$ straight from the balanced equation, counting gases only. For $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ it is $2 - 4 = -2$. For $\\ce{H2(g) + I2(g) <=> 2HI(g)}$ it is $2 - 2 = 0$."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A clean three-panel notebook chart, hand-lettered. Top banner: boxed relation "Kp = Kc (RT)^Δng". PANEL 1 "Δng > 0 (more gas made)": example "N2O4 <=> 2NO2", note "RT raised to positive power, Kp larger than Kc, Kp has units of bar". PANEL 2 "Δng = 0 (gas count unchanged)": example "H2 + I2 <=> 2HI", note "(RT)^0 = 1, so Kp = Kc, both unitless". PANEL 3 "Δng < 0 (less gas made)": example "N2 + 3H2 <=> 2NH3, Δng = -2", note "RT raised to negative power, Kp smaller than Kc". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'Δng decides everything: positive means more gas formed (Kp larger, carries pressure units), zero means Kp equals Kc and both are unitless, negative means less gas formed (Kp smaller).'
      ),
      h.text(
        "There is a third constant for gases, $K_x$, built from **mole fractions** $x$. Using Dalton's law (each partial pressure is its mole fraction times the total pressure, $p_A = x_A P$), the same substitution gives\n\n" +
        "$$K_p = K_x\\,(P)^{\\Delta n_g}$$\n\n" +
        "where $P$ is the total pressure. Keep both relations on hand, because questions reach for one or the other: $K_p = K_c (RT)^{\\Delta n_g}$ to swap between pressure and concentration, and $K_p = K_x (P)^{\\Delta n_g}$ to bring in total pressure.\n\n" +
        "One case is worth singling out. When $\\Delta n_g = 0$, the factor $(RT)^0 = 1$, so $K_p = K_c$, and a volume or pressure term raised to the zero power drops out everywhere. This is why a $\\Delta n_g = 0$ reaction like $\\ce{H2 + I2 <=> 2HI}$ can be solved in moles directly, without tracking the volume. Both sides have the same number of gas molecules, so the volume cancels on its own. It is not a rule to memorise blindly; the gas count makes it happen."
      ),
      h.heading('The units of K', 'Decide whether $K_c$ and $K_p$ carry units, from $\\Delta n_g$.'),
      h.text(
        "Whether $K_c$ and $K_p$ carry units depends on the same $\\Delta n_g$. Since each concentration is in $\\text{mol L}^{-1}$, the whole expression works out to $(\\text{mol L}^{-1})^{\\Delta n_g}$, and each pressure term makes $K_p$ come out in $(\\text{bar})^{\\Delta n_g}$.\n\n" +
        "- For $\\ce{H2 + I2 <=> 2HI}$, $\\Delta n_g = 0$, so the powers on top and bottom cancel and **both $K_c$ and $K_p$ are unitless**.\n" +
        "- For $\\ce{N2O4 <=> 2NO2}$, $\\Delta n_g = +1$, so $K_c$ comes in $\\text{mol L}^{-1}$ and $K_p$ in bar.\n\n" +
        "Standard practice quotes $K_p$ with pressures in bar, since the standard state of pressure is 1 bar. The mole-fraction constant $K_x$ is always unitless, because a mole fraction itself has no units. With $K_p$ in hand you can move between concentration, pressure, and mole fraction for any gas equilibrium. The next page turns to *predicting which way* a disturbed equilibrium will move."
      ),
      h.worked('Problem 7.5', 'solved_example',
        "For the equilibrium $\\ce{2NOCl(g) <=> 2NO(g) + Cl2(g)}$, the value of $K_c$ is $3.75 \\times 10^{-6}$ at 1069 K. Calculate $K_p$ for the reaction at this temperature.",
        "**Step 1 — Find $\\Delta n_g$.** Gaseous products are $2 + 1 = 3$ moles; gaseous reactants are $2$ moles.\n\n" +
        "$$\\Delta n_g = 3 - 2 = 1$$\n\n" +
        "**Step 2 — Write the relation.**\n\n" +
        "$$K_p = K_c (RT)^{\\Delta n_g} = K_c (RT)^{1}$$\n\n" +
        "**Step 3 — Put the values in** (with $R = 0.0831\\ \\text{bar L mol}^{-1}\\text{K}^{-1}$ and $T = 1069$ K).\n\n" +
        "$$RT = 0.0831 \\times 1069 = 88.8$$\n\n" +
        "$$K_p = (3.75 \\times 10^{-6}) \\times 88.8$$\n\n" +
        "**Step 4 — Evaluate.**\n\n" +
        "$$K_p \\approx 3.3 \\times 10^{-4}\\ \\text{bar}$$\n\n" +
        "**Answer:** $K_p \\approx 3.3 \\times 10^{-4}$ bar. *(NCERT prints $K_p = 0.033$ for this problem, but $K_c (RT)^{\\Delta n_g} = 3.75 \\times 10^{-6} \\times 88.8$ works out to about $3.3 \\times 10^{-4}$. Trust the arithmetic.)*",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "For $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, a student is told $K_c$ and is asked for $K_p$ at temperature $T$. They write $K_p = K_c (RT)^{\\Delta n_g}$. What is $\\Delta n_g$ here, and is $K_p$ larger or smaller than $K_c$?",
        [
          "$\\Delta n_g = +2$, so $K_p$ is larger than $K_c$",
          "$\\Delta n_g = -2$, so $K_p$ is smaller than $K_c$ (since $RT$ is raised to a negative power)",
          "$\\Delta n_g = 0$, so $K_p$ equals $K_c$",
          "$\\Delta n_g = 4$, so $K_p$ is much larger than $K_c$",
        ], 1,
        "Count gas moles: products give $2$ (the $\\ce{NH3}$), reactants give $1 + 3 = 4$. So $\\Delta n_g = 2 - 4 = -2$. Raising $RT$ (a number well above 1) to a negative power gives a value below 1, so multiplying $K_c$ by it makes $K_p$ smaller than $K_c$. Fewer gas molecules on the product side pulls $K_p$ down.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Kp, Kc and Units',
        "- **Memorise the pair:** $K_p = K_c (RT)^{\\Delta n_g}$ and $K_p = K_x (P)^{\\Delta n_g}$. The first swaps pressure for concentration; the second brings in total pressure. Keep both.\n" +
        "- $\\Delta n_g = (\\text{moles of gaseous product}) - (\\text{moles of gaseous reactant})$, counting **gases only** — pure solids and liquids do not count.\n" +
        "- **$\\Delta n_g = 0 \\Rightarrow$ the volume cancels, solve in moles.** Then $K_p = K_c$ and both are unitless ($\\ce{H2 + I2 <=> 2HI}$ is the standard case).\n" +
        "- **Units follow $\\Delta n_g$:** $K_c$ comes in $(\\text{mol L}^{-1})^{\\Delta n_g}$, $K_p$ in $(\\text{bar})^{\\Delta n_g}$, and $K_x$ is always unitless.\n" +
        "- Use **$R = 0.0831\\ \\text{bar L mol}^{-1}\\text{K}^{-1}$** when $K_p$ is wanted in bar, and $T$ in kelvin."),
      h.quiz([
        {
          question: "For a gas reaction, the correct link between $K_p$ and $K_c$ is:",
          options: [
            "$K_p = K_c (RT)^{\\Delta n_g}$",
            "$K_p = K_c (RT)^{-\\Delta n_g}$",
            "$K_p = K_c + RT \\Delta n_g$",
            "$K_p = K_c / (RT)$ for every reaction",
          ], correct_index: 0,
          explanation: "Substituting $p = [\\text{gas}]RT$ into the $K_p$ expression rebuilds $K_c$ and leaves $(RT)$ raised to the change in gas moles, giving $K_p = K_c (RT)^{\\Delta n_g}$. The power is $+\\Delta n_g$, and the link is multiplicative, not additive.",
        },
        {
          question: "For which reaction is $K_p = K_c$, with both constants unitless?",
          options: [
            "$\\ce{N2O4(g) <=> 2NO2(g)}$",
            "$\\ce{H2(g) + I2(g) <=> 2HI(g)}$",
            "$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$",
            "$\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$",
          ], correct_index: 1,
          explanation: "$K_p = K_c$ only when $\\Delta n_g = 0$, so the $(RT)^0 = 1$ factor disappears and the powers in the units cancel. $\\ce{H2 + I2 <=> 2HI}$ has 2 gas moles on each side, giving $\\Delta n_g = 0$. The other three change the gas count, so $K_p \\neq K_c$ and they carry units.",
        },
        {
          question: "For $\\ce{N2O4(g) <=> 2NO2(g)}$, what is $\\Delta n_g$, and what units does $K_p$ carry?",
          options: [
            "$\\Delta n_g = -1$; $K_p$ in $\\text{bar}^{-1}$",
            "$\\Delta n_g = 0$; $K_p$ is unitless",
            "$\\Delta n_g = +1$; $K_p$ in bar",
            "$\\Delta n_g = +2$; $K_p$ in $\\text{bar}^{2}$",
          ], correct_index: 2,
          explanation: "Two gas moles of product minus one of reactant gives $\\Delta n_g = 2 - 1 = +1$. With one extra pressure term left on top, $K_p$ comes out in $(\\text{bar})^{1}$, that is, in bar. A negative or zero value would need fewer or equal product gas moles.",
        },
      ]),
    ];
  },
};
