// CEQ page 8 — The Reaction Quotient Q and predicting direction.
// Voice: teacher-voice-profile + CEQ-exemplars (A: Q = IQ, "just as IQ measures
// intelligence, the reaction quotient measures how far the reaction has gone";
// C: large K is NOT fast — K says nothing about kinetics; compare Q with K itself,
// never with twice/thrice K). NCERT §7.6.1 (extent, Fig 7.6) + §7.6.2 (direction,
// Fig 7.7) + Problem 7.7 folded as the worked example.
// §5.X audited: no "Not X. It is Y." pairs, ≤1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no intensifier-stacking.
module.exports = {
  page_number: 8,
  slug: 'reaction-quotient-q-direction',
  title: 'The Reaction Quotient Q and Predicting Direction',
  subtitle: 'Which way will the reaction go right now?',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A long horizontal road drawn across the scene with a milestone marker partway along it labelled in faint hand lettering "you are here", and a flag at the far end labelled "equilibrium". A small traveller figure stands on the road checking a hand-held gauge whose needle reads against a scale, as if measuring how far the journey has come. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'A Speedometer for "How Far Along?"',
        "Think of IQ. It is a single number that tells you, at a glance, how much intelligence someone has. The **reaction quotient** $Q$ does the same job for a reaction: one number that tells you, at any instant, how far the reaction has travelled from pure reactant toward pure product. Take a snapshot of the flask at any moment, plug the amounts in, and $Q$ reports the position you are standing at."),
      h.text(
        "Up to now you have only written the equilibrium constant $K$ for the *resting* mixture. But a reaction spends most of its life on the way to equilibrium, not at it. To describe the flask at any moment along that journey, you use the same expression with the amounts measured *right now* instead of at equilibrium. That ratio is the **reaction quotient**:\n\n" +
        "$$Q_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$\n\n" +
        "for a general reaction $\\ce{aA + bB <=> cC + dD}$. The recipe is identical to $K_c$. The only difference is *when* you measure: $K_c$ uses equilibrium amounts, $Q_c$ uses whatever amounts the flask happens to hold at the instant you look. (Measure with partial pressures instead and you get $Q_p$.)"
      ),
      h.text(
        "Watch $Q$ as a reaction runs. Start with only reactants in the flask. There is no product yet, so the top of the fraction is zero, which makes $Q = 0$. As the reaction proceeds, product builds up and reactant is used up, so the top grows and the bottom shrinks. $Q$ climbs steadily. It keeps climbing until it reaches one particular value and stops there: the value of $K$. At that instant the reaction is at equilibrium, and $Q = K$ for as long as the temperature stays fixed."
      ),
      h.heading('Comparing Q with K tells you the direction', 'Use the three cases $Q<K$, $Q>K$, $Q=K$ to predict whether a reaction moves forward, backward, or rests.'),
      h.text(
        "Here is why $Q$ earns its keep. You almost never need the exact future mixture. You just need to know **which way the reaction will move from where it is right now** — and comparing $Q$ against $K$ answers that in one step.\n\n" +
        "- **$Q < K$:** the flask holds too little product to be at rest. The reaction moves **forward** (left to right) to make more product and push $Q$ up toward $K$.\n" +
        "- **$Q > K$:** the flask holds too much product. The reaction moves **backward** (right to left), turning product back into reactant to bring $Q$ down toward $K$.\n" +
        "- **$Q = K$:** the flask is already at equilibrium. No net change happens.\n\n" +
        "So the reaction always shifts in whichever direction drags $Q$ back to $K$. You compare $Q$ with $K$ itself, not with twice $K$ or half of $K$. The target is always the single value $K$."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two stacked panels drawn like a chemist sketched them in a notebook. TOP panel: a horizontal number line with a single marked point in the centre hand-lettered "Q = K (equilibrium)". To the LEFT of it a region labelled "Q < K" with a forward-pointing arrow and the note "moves forward, makes product". To the RIGHT a region labelled "Q > K" with a backward-pointing arrow and the note "moves backward, makes reactant". BOTTOM panel: a separate horizontal scale of the magnitude of K, labelled at the far left "K < 10^-3: mostly reactants", in the middle "K between 10^-3 and 10^3: both present", at the far right "K > 10^3: mostly products". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'Top: comparing Q with K points the direction — below K moves forward, above K moves backward, equal to K rests. Bottom: the size of K alone tells you how far the reaction goes.'
      ),
      h.heading('What the size of K tells you', 'Read the magnitude of K to judge how far a reaction goes, while remembering K says nothing about speed.'),
      h.text(
        "The *direction* comes from comparing $Q$ with $K$. The *extent* (how far the reaction goes before resting) comes from the size of $K$ by itself. Since products sit on top of the $K$ fraction and reactants on the bottom, a big $K$ means a lot of product at equilibrium and a small $K$ means very little.\n\n" +
        "- **$K > 10^{3}$:** products dominate; the reaction runs nearly to completion. For example $\\ce{H2 + Cl2 <=> 2HCl}$ at 300 K has $K_c \\approx 4 \\times 10^{31}$.\n" +
        "- **$K < 10^{-3}$:** reactants dominate; the reaction barely proceeds. The breakdown of water into $\\ce{H2}$ and $\\ce{O2}$ at 500 K has $K_c \\approx 4 \\times 10^{-48}$.\n" +
        "- **$10^{-3} < K < 10^{3}$:** appreciable amounts of both are present at equilibrium, like $\\ce{H2 + I2 <=> 2HI}$ with $K_c = 57$ at 700 K.\n\n" +
        "One warning that trips up a lot of students. A large $K$ tells you the reaction goes far, and nothing more. It says nothing about how *fast* the reaction gets there. Speed is the business of chemical kinetics; $K$ is silent on it. A reaction with a huge $K$ can still take years to reach that product-rich resting point."
      ),
      h.worked('Problem 7.7', 'solved_example',
        "The value of $K_c$ for the reaction $\\ce{2A <=> B + C}$ is $2 \\times 10^{-3}$. At a given time, the composition of the reaction mixture is $[A] = [B] = [C] = 3 \\times 10^{-4}$ M. In which direction will the reaction proceed?",
        "**Set up the quotient.** For this reaction the reaction quotient uses the same shape as $K_c$:\n\n" +
        "$$Q_c = \\frac{[B][C]}{[A]^2}$$\n\n" +
        "**Put in the amounts measured at this instant.**\n\n" +
        "$$Q_c = \\frac{(3 \\times 10^{-4})(3 \\times 10^{-4})}{(3 \\times 10^{-4})^2}$$\n\n" +
        "The top and the bottom are the same, so\n\n" +
        "$$Q_c = 1$$\n\n" +
        "**Compare $Q_c$ with $K_c$.** Here $Q_c = 1$ while $K_c = 2 \\times 10^{-3}$, so $Q_c > K_c$.\n\n" +
        "**Read the direction.** With $Q_c$ larger than $K_c$, the flask holds too much product. The reaction proceeds in the **reverse direction** (toward the reactants) until $Q_c$ falls to $K_c$.\n\n" +
        "**Answer:** the reaction proceeds backward, in the direction of the reactants.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "For $\\ce{H2(g) + I2(g) <=> 2HI(g)}$ the equilibrium constant is $K_c = 57$ at 700 K. At one instant a flask holds $[\\ce{H2}] = 0.10$ M, $[\\ce{I2}] = 0.20$ M and $[\\ce{HI}] = 0.40$ M, giving $Q_c = (0.40)^2 / (0.10 \\times 0.20) = 8.0$. Which way does the reaction move, and why?",
        [
          "Backward, because $Q_c = 8.0$ is a large number on its own",
          "Forward, because $Q_c = 8.0$ is less than $K_c = 57$, so more $\\ce{HI}$ must form to raise $Q_c$ up to $K_c$",
          "It is already at equilibrium, because $Q_c$ is positive and finite",
          "Backward, because $Q_c$ must be compared with twice $K_c$, and $8.0 < 114$",
        ], 1,
        "The direction comes from comparing $Q_c$ with $K_c$, not from how big $Q_c$ looks by itself. Here $Q_c = 8.0$ is less than $K_c = 57$, so the flask is short on product. The reaction runs forward, making more $\\ce{HI}$, until $Q_c$ climbs to $57$. You always compare $Q$ against $K$ itself, never against twice or half of it, so the last option uses the wrong target.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Q vs K, and What K Does Not Say',
        "- $Q$ has the **same expression** as $K$. The only difference is that $Q$ uses the amounts present *at that instant*, while $K$ uses equilibrium amounts.\n" +
        "- Direction rule: **$Q < K$ forward, $Q > K$ backward, $Q = K$ at equilibrium.** Compare $Q$ with $K$ itself — a distractor that says 'compare with $2K$' is a classic trap.\n" +
        "- Extent from magnitude: **$K > 10^3$** products dominate, **$K < 10^{-3}$** reactants dominate, in between both are present in appreciable amounts.\n" +
        "- **The trap examiners love:** a large $K$ does **not** mean a fast reaction. $K$ fixes the position of equilibrium, never the speed of reaching it. Kinetics and the equilibrium constant are separate stories."),
      h.quiz([
        {
          question: "At a given instant a reaction has $Q_c > K_c$. Which way does it proceed?",
          options: [
            "Forward, making more product",
            "Backward, converting product back into reactant",
            "It is already at equilibrium and does not move",
            "The direction cannot be decided without knowing the rate",
          ], correct_index: 1,
          explanation: "$Q_c > K_c$ means the flask holds more product than the equilibrium mixture would. The reaction runs backward to convert product into reactant until $Q_c$ drops to $K_c$. It is not at equilibrium, since that requires $Q_c = K_c$.",
        },
        {
          question: "A reaction has $K = 5 \\times 10^{20}$ at room temperature, yet a sealed flask of the reactants shows no visible change after a week. The best explanation is:",
          options: [
            "The large $K$ must be wrong, because such a reaction would finish instantly",
            "$K$ describes how far the reaction goes, not how fast; the reaction is simply slow",
            "The flask has already reached equilibrium with mostly reactant left",
            "A large $K$ always means the reaction proceeds backward",
          ], correct_index: 1,
          explanation: "A large $K$ guarantees that products dominate at equilibrium, but it says nothing about speed — that belongs to kinetics. A reaction can have a huge $K$ and still crawl. A large $K$ points toward products, not backward, so the last option is wrong.",
        },
        {
          question: "Three reactions have $K_c$ values of $4 \\times 10^{-40}$, $58$, and $2 \\times 10^{25}$. At equilibrium, which one contains appreciable amounts of both reactants and products?",
          options: [
            "The one with $K_c = 4 \\times 10^{-40}$, where reactants dominate",
            "The one with $K_c = 2 \\times 10^{25}$, where products dominate",
            "The one with $K_c = 58$, which lies between $10^{-3}$ and $10^{3}$",
            "None of them — a mixture of both is never possible",
          ], correct_index: 2,
          explanation: "When $K_c$ falls between $10^{-3}$ and $10^{3}$, neither side runs away, so both reactants and products are present in appreciable amounts; $K_c = 58$ sits squarely in that band. $4 \\times 10^{-40}$ leaves mostly reactant and $2 \\times 10^{25}$ leaves mostly product.",
        },
      ]),
    ];
  },
};
