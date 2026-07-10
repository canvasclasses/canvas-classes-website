// CEQ page 9 — Characteristics of K and manipulating equilibria.
// Voice: teacher-voice-profile + CEQ-exemplars (A: "a spoonful of water from a big
// bucket — the change is negligible" + the marble: big piece or small, particles per
// unit volume is the same, like density => pure solid/liquid concentration is constant
// and drops out of K). NCERT §7.6 features + Table 7.4 manipulations (reverse => 1/K,
// xn => K^n, add => K1*K2) + heterogeneous equilibria + Problem 7.6 folded as the
// worked example.
// §5.X audited: no "Not X. It is Y." pairs, ≤1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no intensifier-stacking.
module.exports = {
  page_number: 9,
  slug: 'characteristics-and-manipulating-equilibria',
  title: 'Characteristics of K and Manipulating Equilibria',
  subtitle: 'Reverse it, scale it, add it — and why pure solids vanish from K.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. On the left a large bucket of water with one small spoon dipping in and lifting out a tiny scoop, a faint hand-note "one spoon, no real change". On the right a chunk of marble beside a much smaller marble pebble, with a tiny magnified inset showing the same tight packing of dots in both, hand-lettered "same packing either size". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Why a Whole Slab and a Chip Count the Same',
        "Scoop one spoonful of water out of a full bucket. How much did the bucket change? Next to nothing. Now picture a block of marble. Snap off a big piece or a tiny chip — inside either one, the number of particles packed into each unit of volume is the same, just like density. The amount of a pure solid or pure liquid does not change its **concentration**, and that single fact is why such substances quietly drop out of the equilibrium expression."),
      h.text(
        "Before we learn to bend equilibria to our will, it helps to pin down what the equilibrium constant $K$ is fussy about and what it ignores. Four features matter most:\n\n" +
        "1. **$K$ is fixed only at a fixed temperature.** Change the temperature and $K$ changes to a new value. Hold the temperature fixed and $K$ holds steady no matter what else you do.\n" +
        "2. **$K$ does not care about starting amounts.** Begin with pure reactant, pure product, or any mixture; at the same temperature you land on the same $K$.\n" +
        "3. **$K$ belongs to a specific balanced equation.** Write the reaction a different way and the number changes in a predictable manner (the rest of this page).\n" +
        "4. **$K$ describes the resting mixture, not the speed.** Its size tells you how far the reaction goes, never how quickly."
      ),
      h.heading('Homogeneous and heterogeneous equilibria', 'Tell the two kinds apart, and leave pure solids and pure liquids out of K.'),
      h.text(
        "An equilibrium is **homogeneous** when every species sits in the same phase. The gas-phase reactions $\\ce{H2(g) + I2(g) <=> 2HI(g)}$ and $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ are homogeneous; everything is a gas.\n\n" +
        "An equilibrium is **heterogeneous** when more than one phase is present, like a solid sitting in equilibrium with a gas. The thermal breakdown of limestone is the standard example:\n\n" +
        "$$\\ce{CaCO3(s) <=>[\\Delta] CaO(s) + CO2(g)}$$\n\n" +
        "Here is the move that defines heterogeneous equilibria. **Leave pure solids and pure liquids out of the $K$ expression.** Their concentration is a fixed property of the substance and does not change as the reaction runs, so it folds into the constant and disappears. For the limestone reaction only the gas survives:\n\n" +
        "$$K_c = [\\ce{CO2}] \\qquad K_p = p_{\\ce{CO2}}$$\n\n" +
        "The same applies to a pure liquid such as water in $\\ce{Ag2O(s) + 2HNO3(aq) <=> 2AgNO3(aq) + H2O(l)}$, where the $\\ce{H2O(l)}$ is left out. A pure solid or liquid must still be **present** for the equilibrium to exist; it simply does not appear in the expression."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two panels drawn like a chemist sketched them in a notebook. LEFT panel: a sealed flask sitting on a heat source, white limestone chunks (CaCO3 solid) and grey lime (CaO solid) at the bottom, and a space of gas above filled with small dots labelled "CO2 gas". A hand-lettered reaction above it "CaCO3(s) <=> CaO(s) + CO2(g)", and beneath it the expression "Kp = p(CO2) — only the gas appears". The two solids are circled with a small note "solids: present but left out of K". RIGHT panel: a compact reference card titled "Manipulating K" with three hand-lettered rows: "reverse the reaction -> 1/K", "multiply all coefficients by n -> K^n", "add two reactions -> K1 x K2". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'Left: in a heterogeneous equilibrium only the gas enters Kp — the solids are present but left out. Right: the three ways a rewritten equation changes its K.'
      ),
      h.heading('Reverse it, scale it, add it', 'Apply the three manipulation rules to find K for a rewritten or combined reaction.'),
      h.text(
        "Often an exam gives you $K$ for one reaction and asks for $K$ of a related one. You do not start over. Three rules cover almost every case (these are the relations gathered in NCERT's Table 7.4):\n\n" +
        "- **Reverse the reaction:** the new constant is $1/K$. If $\\ce{A + B <=> C}$ has constant $K$, then $\\ce{C <=> A + B}$ has constant $1/K$. The forward and backward views are reciprocals.\n" +
        "- **Multiply every coefficient by $n$:** the new constant is $K^{n}$. So $\\ce{2A + 2B <=> 2C}$ (the previous reaction doubled) has constant $K^{2}$. Halving the coefficients gives $K^{1/2}$.\n" +
        "- **Add two reactions:** **multiply their constants.** If reaction 1 has $K_1$ and reaction 2 has $K_2$, the reaction you get by adding them has $K_3 = K_1 \\cdot K_2$. Extend it to three reactions and $K = K_1 \\cdot K_2 \\cdot K_3$.\n\n" +
        "A quick worked instance of the addition rule. Suppose $\\ce{A <=> B}$ has $K = 1$, $\\ce{B <=> C}$ has $K = 3$, and $\\ce{C <=> D}$ has $K = 5$. Adding all three cancels $\\ce{B}$ and $\\ce{C}$ and leaves $\\ce{A <=> D}$, whose constant is $1 \\times 3 \\times 5 = 15$. You combined three known constants into one without solving any equilibrium from scratch."
      ),
      h.worked('Problem 7.6', 'solved_example',
        "The value of $K_p$ for the reaction $\\ce{CO2(g) + C(s) <=> 2CO(g)}$ is $3.0$ at $1000$ K. If initially $p_{\\ce{CO2}} = 0.48$ bar and $p_{\\ce{CO}} = 0$ bar and pure graphite is present, calculate the equilibrium partial pressures of $\\ce{CO}$ and $\\ce{CO2}$.",
        "**Note the heterogeneous part first.** Carbon is a pure solid, so $\\ce{C(s)}$ does not appear in the $K_p$ expression. Only the two gases do:\n\n" +
        "$$K_p = \\frac{(p_{\\ce{CO}})^2}{p_{\\ce{CO2}}}$$\n\n" +
        "**Set up a pressure table.** Let $x$ be the fall in the pressure of $\\ce{CO2}$. For every unit of $\\ce{CO2}$ used, $2$ units of $\\ce{CO}$ form.\n\n" +
        "$$\\ce{CO2(g) + C(s) <=> 2CO(g)}$$\n\n" +
        "Initial pressure: $0.48$ bar and $0$.\n\n" +
        "At equilibrium: $(0.48 - x)$ bar and $2x$ bar.\n\n" +
        "**Put the equilibrium pressures into $K_p$.**\n\n" +
        "$$\\frac{(2x)^2}{0.48 - x} = 3$$\n\n" +
        "$$4x^2 = 3(0.48 - x)$$\n\n" +
        "$$4x^2 + 3x - 1.44 = 0$$\n\n" +
        "**Solve the quadratic** with $a = 4$, $b = 3$, $c = -1.44$.\n\n" +
        "$$x = \\frac{-3 \\pm \\sqrt{3^2 - 4(4)(-1.44)}}{2(4)} = \\frac{-3 \\pm \\sqrt{32.04}}{8} = \\frac{-3 \\pm 5.66}{8}$$\n\n" +
        "A pressure cannot be negative, so reject the minus root and keep\n\n" +
        "$$x = \\frac{2.66}{8} = 0.33$$\n\n" +
        "**Read off the equilibrium pressures.**\n\n" +
        "$$p_{\\ce{CO}} = 2x = 0.66 \\text{ bar}$$\n\n" +
        "$$p_{\\ce{CO2}} = 0.48 - x = 0.48 - 0.33 = 0.15 \\text{ bar}$$\n\n" +
        "**Answer:** $p_{\\ce{CO}} = 0.66$ bar and $p_{\\ce{CO2}} = 0.15$ bar.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "For the heterogeneous equilibrium $\\ce{NH4HS(s) <=> NH3(g) + H2S(g)}$ in a sealed flask, a student doubles the amount of solid $\\ce{NH4HS}$ while keeping the temperature fixed. What happens to the equilibrium partial pressures of $\\ce{NH3}$ and $\\ce{H2S}$?",
        [
          "They both double, because there is now twice as much solid to break down",
          "They stay the same, because the pure solid does not appear in $K_p$, so adding more of it changes nothing",
          "They both halve, because the solid spreads the same gas over more material",
          "Only $\\ce{NH3}$ rises, since it is listed first in the equation",
        ], 1,
        "A pure solid is left out of $K_p$ because its concentration is fixed. Since the solid does not appear in the expression, adding more of it cannot shift the equilibrium, so the gas pressures are unchanged as long as the temperature is the same. The amount of solid only sets whether equilibrium can be reached at all, not where it sits.",
        2),
      h.callout('exam_tip', 'JEE / NEET — K Features, Phases & Manipulations',
        "- **Pure solids and pure liquids are left out of $K_c$, $K_p$ and $Q$.** Their concentration is constant, so it folds into the constant. They must be present, but they never appear in the expression.\n" +
        "- A heterogeneous equilibrium keeps only the gases (and dissolved species): for $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$, $K_p = p_{\\ce{CO2}}$.\n" +
        "- **Reverse $\\Rightarrow 1/K$. Multiply coefficients by $n \\Rightarrow K^{n}$. Add reactions $\\Rightarrow$ multiply the $K$'s.** These are the only three you need.\n" +
        "- $K$ is **temperature-dependent** but **independent of starting amounts**. Doubling a solid, or starting from products, leaves $K$ untouched."),
      h.quiz([
        {
          question: "Why are pure solids and pure liquids left out of the equilibrium constant expression?",
          options: [
            "Because they do not take part in the reaction at all",
            "Because their concentration is fixed and does not change as the reaction runs",
            "Because solids and liquids react too slowly to count",
            "Because only gases can ever reach equilibrium",
          ], correct_index: 1,
          explanation: "A pure solid or liquid has a concentration set by its density, which stays the same whatever amount is present, so it folds into the constant and drops out. They do take part in the reaction and must be present — they are simply not written in the expression.",
        },
        {
          question: "If the reaction $\\ce{A + B <=> 2C}$ has equilibrium constant $K$, then the reaction $\\ce{2C <=> A + B}$ has equilibrium constant:",
          options: [
            "$K^2$",
            "$2K$",
            "$1/K$",
            "$\\sqrt{K}$",
          ], correct_index: 2,
          explanation: "Reversing a reaction inverts its equilibrium constant, so the backward reaction has constant $1/K$. Squaring would apply if the coefficients were doubled, and $\\sqrt{K}$ if they were halved — neither is what reversing does.",
        },
        {
          question: "Given $\\ce{X <=> Y}$ with $K_1 = 2$ and $\\ce{Y <=> Z}$ with $K_2 = 5$, what is the equilibrium constant for $\\ce{X <=> Z}$?",
          options: [
            "$7$, by adding the two constants",
            "$10$, by multiplying the two constants",
            "$2.5$, by dividing the two constants",
            "$0.1$, the reciprocal of the product",
          ], correct_index: 1,
          explanation: "Adding two reactions multiplies their equilibrium constants, so $\\ce{X <=> Z}$ has $K = K_1 \\cdot K_2 = 2 \\times 5 = 10$. Adding the constants ($7$) is the common slip — the rule for added reactions is to multiply, not add.",
        },
      ]),
    ];
  },
};
