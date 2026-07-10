// CEQ page 10 — The equilibrium constant and Gibbs energy.
// Connects ΔG° to the K students just learned: ΔG = ΔG° + RT ln Q; at equilibrium
// ΔG = 0 and Q = K, so ΔG° = −RT ln K, i.e. K = e^(−ΔG°/RT). Sign of ΔG° controls
// the size of K. Cross-links Ch.5 Thermodynamics' "free-energy-and-equilibrium"
// page (acknowledged, not duplicated). Folds NCERT Problems 7.10 + 7.11 (arithmetic
// verified against NCERT page 201).
// Voice: teacher-voice-profile + CEQ-exemplars (A: ball on the G-vs-progress curve;
// the K-size reading from §B/§40; the "temperature nahi badla ⇒ K nahi badlega" refrain
// is NOT used here — this page is about the ΔG°↔K bridge, not before/after-K numerics).
// §5.X audited: no "Not X. It is Y." pairs, no stacked metaphors, ≤1 em-dash/para,
// say-it-once, second person, analogy-first, no reveal framing / no universal claims.
module.exports = {
  page_number: 10,
  slug: 'equilibrium-constant-and-gibbs-energy',
  title: 'The Equilibrium Constant and Gibbs Energy',
  subtitle: 'The thermodynamic reason K has the value it does.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A smooth valley-shaped Gibbs-energy curve drawn across the scene; a small round ball resting in the dip at the bottom. To one side, a hand-lettered bridge note linking two ideas: an arrow from "ΔG° (how deep the dip)" pointing to "K (how far the reaction goes)". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'One Number, Two Names',
        "The same fact about a reaction can be told two ways. A thermodynamics teacher says $\\ce{\\Delta G^\\circ}$ is large and negative. An equilibrium teacher says $K$ is huge. They are describing the very thing, from two desks. This page is the short bridge that turns one statement into the other."),
      h.text(
        "You met the Gibbs energy $\\Delta G$ back in Thermodynamics, on the *Free Energy and Equilibrium* page, where you saw that a reaction runs forward as long as $\\Delta G$ is negative and stops when $\\Delta G$ reaches zero. Here you connect that to the **equilibrium constant** $K$ you have just spent this chapter building. The two ideas are one idea wearing two hats.\n\n" +
        "Start with the master relation from thermodynamics, which holds at every moment of the reaction:\n\n" +
        "$$\\Delta G = \\Delta G^\\circ + RT \\ln Q$$\n\n" +
        "Here $\\Delta G^\\circ$ is the **standard** Gibbs energy change (a fixed number for the reaction at a given temperature), $Q$ is the reaction quotient you already use to track how far the reaction has gone, $R$ is the gas constant, and $T$ is the temperature in kelvin."
      ),
      h.heading('From $\\Delta G^\\circ$ to $K$', 'Derive $\\Delta G^\\circ = -RT \\ln K$ from $\\Delta G = \\Delta G^\\circ + RT \\ln Q$ by setting the equilibrium conditions.'),
      h.text(
        "Now walk the reaction to its resting point. At equilibrium two things are true at once, and you have already met both. The first is from thermodynamics: $\\Delta G = 0$, because the reaction has reached the bottom of its energy valley and has no downhill direction left. The second is from this chapter: the reaction quotient has climbed to its final value, so $Q = K$.\n\n" +
        "Put both into the master relation:\n\n" +
        "$$0 = \\Delta G^\\circ + RT \\ln K$$\n\n" +
        "Rearrange, and the bridge appears:\n\n" +
        "$$\\Delta G^\\circ = -RT \\ln K$$\n\n" +
        "Take the antilog of both sides and you can read it the other way round:\n\n" +
        "$$K = e^{-\\Delta G^\\circ / RT}$$\n\n" +
        "This single line ties the energetics of a reaction to the size of its equilibrium constant. Hand it $\\Delta G^\\circ$ and it hands you $K$; hand it $K$ and it hands you $\\Delta G^\\circ$."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A three-panel notebook sketch mapping the sign of ΔG° to the size of K. Across the top, the hand-lettered bridge equation "ΔG° = −RT ln K". LEFT panel: a deep downhill Gibbs valley bottoming out far on the product side, labelled "ΔG° < 0" and "K > 1: products favoured", with a flask drawn mostly full of product. MIDDLE panel: a shallow symmetric valley bottoming out in the centre, labelled "ΔG° = 0" and "K = 1". RIGHT panel: a valley bottoming out far on the reactant side, labelled "ΔG° > 0" and "K < 1: reactants favoured", with a flask drawn mostly full of reactant. Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'The sign of ΔG° fixes which side of the bridge K lands on: a downhill ΔG° (negative) gives a large K and a flask full of product; an uphill ΔG° (positive) gives a small K and mostly leftover reactant.'
      ),
      h.text(
        "Look at $K = e^{-\\Delta G^\\circ / RT}$ and let the sign of $\\Delta G^\\circ$ do the talking. The exponent carries a minus sign, so a negative $\\Delta G^\\circ$ becomes a positive exponent, and a positive $\\Delta G^\\circ$ becomes a negative one. That single sign flip decides everything:\n\n" +
        "- $\\Delta G^\\circ < 0$ gives a positive exponent, so $K > 1$. The reaction is spontaneous and runs far forward, leaving the flask rich in product.\n" +
        "- $\\Delta G^\\circ > 0$ gives a negative exponent, so $K < 1$. The reaction barely creeps forward, and only a small amount of product forms.\n" +
        "- $\\Delta G^\\circ = 0$ gives an exponent of zero, so $K = 1$. Reactants and products sit in comparable amounts.\n\n" +
        "So the sign of $\\Delta G^\\circ$ tells you which side of $1$ the constant lands on, and the size of $\\Delta G^\\circ$ tells you how far past $1$ it goes. A reaction with $\\Delta G^\\circ$ large and negative has a $K$ in the millions; one with $\\Delta G^\\circ$ large and positive has a $K$ near zero."
      ),
      h.worked(
        'Problem 7.10', 'ncert_intext',
        "The value of $\\Delta G^\\circ$ for the phosphorylation of glucose in glycolysis is $13.8$ kJ/mol. Find the value of $K_c$ at $298$ K.",
        "**Set up.** The bridge equation is $\\Delta G^\\circ = -RT \\ln K_c$, so $\\ln K_c = -\\dfrac{\\Delta G^\\circ}{RT}$.\n\n" +
        "**Get the units consistent.** $R$ is in joules, so write $\\Delta G^\\circ$ in joules too.\n\n" +
        "$\\Delta G^\\circ = 13.8 \\text{ kJ/mol} = 13.8 \\times 10^{3} \\text{ J/mol}$\n\n" +
        "**Substitute.**\n\n" +
        "$\\ln K_c = -\\dfrac{13.8 \\times 10^{3}}{8.314 \\times 298}$\n\n" +
        "$\\ln K_c = -5.569$\n\n" +
        "**Take the antilog.**\n\n" +
        "$K_c = e^{-5.569}$\n\n" +
        "$\\boxed{K_c = 3.81 \\times 10^{-3}}$\n\n" +
        "$\\Delta G^\\circ$ came out positive, so $K_c$ landed below $1$, as the sign rule promised. The reaction needs an energy push to go forward, which is why the cell couples it to ATP.",
        'tap_to_reveal'
      ),
      h.worked(
        'Problem 7.11', 'ncert_intext',
        "Hydrolysis of sucrose gives $\\ce{Sucrose + H2O <=> Glucose + Fructose}$. The equilibrium constant $K_c$ for this reaction is $2 \\times 10^{13}$ at $300$ K. Calculate $\\Delta G^\\circ$ at $300$ K.",
        "**Set up.** This is the same bridge equation, used in the forward direction: $\\Delta G^\\circ = -RT \\ln K_c$.\n\n" +
        "**Substitute.**\n\n" +
        "$\\Delta G^\\circ = -(8.314 \\text{ J mol}^{-1}\\text{K}^{-1})(300 \\text{ K}) \\ln(2 \\times 10^{13})$\n\n" +
        "**Evaluate.**\n\n" +
        "$\\ln(2 \\times 10^{13}) = 30.63$\n\n" +
        "$\\Delta G^\\circ = -(8.314)(300)(30.63)$\n\n" +
        "$\\boxed{\\Delta G^\\circ = -7.64 \\times 10^{4} \\text{ J mol}^{-1}}$\n\n" +
        "Here $K_c$ is enormous, so $\\Delta G^\\circ$ came out large and negative. A big $K$ and a deep, downhill $\\Delta G^\\circ$ are the same news told twice.",
        'tap_to_reveal'
      ),
      h.reasoning('logical',
        "Two reactions are run at the same temperature. Reaction P has $\\Delta G^\\circ = -40$ kJ/mol; reaction Q has $\\Delta G^\\circ = +40$ kJ/mol. Without working out any numbers, what can you say about their equilibrium constants?",
        [
          "Both have $K > 1$, because every reaction with a defined $\\Delta G^\\circ$ favours products",
          "P has $K > 1$ and Q has $K < 1$, because a negative $\\Delta G^\\circ$ puts the exponent above zero and a positive one puts it below",
          "P has $K < 1$ and Q has $K > 1$, because the minus sign in the formula flips a negative $\\Delta G^\\circ$ into a small $K$",
          "Both have $K = 1$, since the two values are equal in size and cancel",
        ], 1,
        "Read $K = e^{-\\Delta G^\\circ / RT}$ and track the sign through the minus. Reaction P has $\\Delta G^\\circ$ negative, so $-\\Delta G^\\circ / RT$ is positive and $K > 1$: products are favoured. Reaction Q has $\\Delta G^\\circ$ positive, so the exponent is negative and $K < 1$: reactants stay favoured. Equal sizes do not cancel, because the two reactions are separate; the sign is what decides each one.",
        2),
      h.callout('exam_tip', 'JEE / NEET — The $\\Delta G^\\circ$–$K$ Bridge',
        "- The relation to memorise: **$\\Delta G^\\circ = -RT \\ln K$**, equivalently **$K = e^{-\\Delta G^\\circ / RT}$**. Everything else on this page comes from it.\n" +
        "- **Sign reading:** $\\Delta G^\\circ < 0 \\Rightarrow K > 1$ (products favoured); $\\Delta G^\\circ > 0 \\Rightarrow K < 1$ (reactants favoured); $\\Delta G^\\circ = 0 \\Rightarrow K = 1$.\n" +
        "- **Watch the units.** $R = 8.314$ J mol⁻¹K⁻¹, so put $\\Delta G^\\circ$ in **joules**, not kilojoules, before you divide. Forgetting the $\\times 10^{3}$ is the single most common slip here.\n" +
        "- **Classic trap:** $\\Delta G^\\circ$ (standard, fixed) is not the running $\\Delta G$. The bridge uses $\\Delta G^\\circ$ with $K$; the running $\\Delta G$ goes with $Q$ in $\\Delta G = \\Delta G^\\circ + RT \\ln Q$. Examiners swap one symbol for the other to catch you."),
      h.quiz([
        {
          question: "Which equation correctly links the standard Gibbs energy change to the equilibrium constant?",
          options: [
            "$\\Delta G^\\circ = -RT \\ln K$",
            "$\\Delta G^\\circ = +RT \\ln K$",
            "$\\Delta G^\\circ = -RT \\ln Q$",
            "$\\Delta G^\\circ = RT / \\ln K$",
          ], correct_index: 0,
          explanation: "Setting $\\Delta G = 0$ and $Q = K$ at equilibrium in $\\Delta G = \\Delta G^\\circ + RT \\ln Q$ gives $0 = \\Delta G^\\circ + RT \\ln K$, so $\\Delta G^\\circ = -RT \\ln K$. The version with $Q$ is wrong because $Q = K$ only at equilibrium; the plus-sign version flips the spontaneity rule.",
        },
        {
          question: "A reaction has a standard Gibbs energy change $\\Delta G^\\circ$ that is large and negative. Its equilibrium constant $K$ is therefore:",
          options: [
            "much smaller than 1, so reactants dominate",
            "much larger than 1, so products dominate",
            "exactly 1, so reactants and products are equal",
            "negative, matching the sign of $\\Delta G^\\circ$",
          ], correct_index: 1,
          explanation: "In $K = e^{-\\Delta G^\\circ / RT}$, a negative $\\Delta G^\\circ$ makes the exponent positive, so $K$ comes out well above 1 and the products are favoured. $K$ is an exponential, so it is always positive and can never carry the sign of $\\Delta G^\\circ$.",
        },
        {
          question: "When you compute $K$ from $\\Delta G^\\circ = -RT \\ln K$, the most common numerical mistake is:",
          options: [
            "using temperature in degrees Celsius instead of kelvin only",
            "leaving $\\Delta G^\\circ$ in kJ while $R$ is in J, so the value is off by a factor of 1000",
            "forgetting that $R$ changes with the reaction",
            "taking the antilog before substituting the numbers",
          ], correct_index: 1,
          explanation: "$R = 8.314$ J mol⁻¹K⁻¹ is in joules, so $\\Delta G^\\circ$ must also be in joules; using kilojoules without the $\\times 10^{3}$ shifts the exponent by a factor of 1000. Temperature must indeed be in kelvin, but $R$ is a fixed constant and does not depend on the reaction.",
        },
      ]),
    ];
  },
};
