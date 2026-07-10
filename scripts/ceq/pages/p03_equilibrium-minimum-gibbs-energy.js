// CEQ page 3 — Equilibrium = minimum Gibbs energy.
// Voice: teacher-voice-profile + CEQ-exemplars (A: the ball rolling down the
// G-vs-progress curve, settling in the depression = minimum, maximum stability).
// §5.X audited: no "Not X. It is Y." pairs, ≤1 em-dash/para, plain SVO, say-it-once.
module.exports = {
  page_number: 3,
  slug: 'equilibrium-minimum-gibbs-energy',
  title: 'Why a Reaction Stops Where It Stops',
  subtitle: 'Equilibrium is the point of lowest energy.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A smooth valley-shaped curve drawn across the scene like a skateboard ramp; a small round ball part-way down the slope, mid-roll, with a faint motion trail, heading toward the lowest dip where it will finally rest. A tiny hand-lettered note "lowest point = most stable" near the dip. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'A Ball Always Finds the Bottom',
        "Tip a marble onto a curved bowl and let go. It rolls down, overshoots, rolls back, and after a little wobbling it settles at the lowest point. It does not stop halfway up the side, and it does not climb out the other end. The bottom is where it has the least energy, so that is where it stays. A chemical reaction settles for the same reason."),
      h.text(
        "In the last two pages you saw *what* equilibrium looks like from the outside: the amounts of reactant and product stop changing, even though both reactions keep running. The natural next question is *why*. Why does a reaction stall at one particular mixture and refuse to budge from it?\n\n" +
        "The answer comes from one quantity you already met in Thermodynamics: the **Gibbs energy** $G$. Every system in nature drifts toward lower energy, the way the ball rolls toward the bottom of the bowl. A reaction keeps going as long as moving forward lowers the system's Gibbs energy. The moment it cannot lower $G$ any further, it has nowhere left to go. That resting point is equilibrium."
      ),
      h.heading('The Gibbs energy curve', 'Read the G-vs-extent curve and see that equilibrium sits at its minimum, where $\\Delta G = 0$.'),
      h.text(
        "Picture the reaction's progress on a horizontal line: far left is pure reactant, far right is pure product, and the reaction moves left to right as it proceeds. Now plot the system's Gibbs energy $G$ against that progress. The plot is a valley. It starts high on the reactant side, falls as the reaction proceeds, reaches a lowest point, then rises again toward the product side.\n\n" +
        "On the downhill stretch the slope of the curve is what we call $\\Delta G$, and it is negative: every step forward lowers $G$, so the reaction goes that way on its own. At the very bottom of the valley the curve is flat. The slope there is zero, which means $\\Delta G = 0$. The reaction has no downhill direction left, forward or backward, so it stops. That bottom of the valley is equilibrium, and it is the point of maximum stability."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A single line graph drawn like a chemist sketched it in a notebook. Vertical axis hand-lettered "G (Gibbs energy)", horizontal axis hand-lettered "extent of reaction" with "pure reactants" at the far left and "pure products" at the far right. The curve starts high on the left, sweeps down into a smooth valley, then rises again on the right. A small filled dot marks the lowest point of the valley, with a short flat tangent line drawn through it and the label "slope = 0, ΔG = 0, equilibrium". The left downhill portion is annotated "ΔG negative: reaction moves forward" and the right uphill portion "ΔG positive". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'The system rolls down the Gibbs-energy valley and settles at the bottom, where the slope is flat and ΔG = 0 — that lowest point is equilibrium.'
      ),
      h.text(
        "The shape of the valley also tells you *where* the reaction will stop. If the lowest point sits far over to the right, near pure product, the reaction runs almost to completion before it rests. If the lowest point sits only a little way in from the left, the reaction stalls early, with most of the reactant still unused. Same valley shape, different position of the bottom, and that position is fixed for a given reaction at a given temperature.\n\n" +
        "So the reaction stops at the bottom of its energy valley, and that settles *why* equilibrium happens. From here we turn to the systems where this balancing act is easiest to watch with your own eyes: the **physical equilibria**, where matter simply changes its state."
      ),
      h.reasoning('analogical',
        "Two reactions are each drawn as a Gibbs-energy curve. Reaction X has its lowest point sitting far to the right, almost at pure product. Reaction Y has its lowest point only a short way in from the left, close to pure reactant. At equilibrium, which flask holds mostly product, and which holds mostly leftover reactant?",
        [
          "Both hold mostly product, because every reaction ends at the bottom of its valley",
          "X holds mostly product; Y holds mostly leftover reactant, because each rests where its own valley bottoms out",
          "X holds mostly reactant; Y holds mostly product, because a deeper dip means less product",
          "Neither can be decided from the curve — only the rate graph shows the final mixture",
        ], 1,
        "Both reactions stop at the bottom of their own valley, so the question is only where each bottom sits. Reaction X bottoms out near pure product, so its flask is mostly product. Reaction Y bottoms out near pure reactant, so its flask still holds a lot of unused reactant. The depth of the dip is about stability, not about how far right the bottom lies — read the horizontal position, not the depth.",
        2),
      h.callout('exam_tip', 'JEE / NEET — The Gibbs Energy Reading',
        "- At equilibrium, **$\\Delta G = 0$**. This is the thermodynamic definition of equilibrium, and it is a favourite one-mark statement.\n" +
        "- Before equilibrium the reaction runs in whichever direction has **$\\Delta G < 0$** (downhill). A direction with $\\Delta G > 0$ does not happen on its own.\n" +
        "- $\\Delta G = 0$ does **not** mean equal amounts of reactant and product. It means the Gibbs energy is at its lowest. The actual mixture there depends on where the valley bottoms out.\n" +
        "- Do not confuse the slope with the height. **$\\Delta G$ is the slope** of the $G$ curve at that point; the curve being low is what makes equilibrium stable."),
      h.quiz([
        {
          question: "At equilibrium, the Gibbs energy of the reacting system is:",
          options: [
            "at its minimum value for that reaction",
            "at its maximum value for that reaction",
            "exactly zero at every temperature",
            "equal to the Gibbs energy of the pure reactants",
          ], correct_index: 0,
          explanation: "The system rolls toward lower Gibbs energy and rests at the lowest point of the curve, so $G$ is at its minimum at equilibrium. It is the slope $\\Delta G$ that becomes zero there, not $G$ itself, which is why 'exactly zero' is wrong.",
        },
        {
          question: "What does $\\Delta G = 0$ at equilibrium actually tell you?",
          options: [
            "The reaction has now used up all of its reactant",
            "The forward and the backward reactions have both stopped",
            "There is no direction the reaction can move to lower its energy",
            "The flask now holds equal amounts of reactant and product",
          ], correct_index: 2,
          explanation: "$\\Delta G$ is the slope of the Gibbs-energy curve. At the bottom of the valley the slope is flat, so neither direction is downhill and the net reaction stops. The molecules keep converting both ways, and the mixture is usually not equal amounts.",
        },
        {
          question: "Reaction P bottoms out in its Gibbs-energy curve very close to the pure-product side. At equilibrium its flask will mostly contain:",
          options: [
            "leftover reactant, with very little product",
            "equal amounts of reactant and product",
            "no reactant and no product, only by-products",
            "product, with very little reactant left",
          ], correct_index: 3,
          explanation: "The reaction rests where its valley bottoms out. Since that lowest point lies near pure product, the equilibrium mixture is mostly product. A valley that bottomed out near the reactant side would instead leave most of the reactant unused.",
        },
      ]),
    ];
  },
};
