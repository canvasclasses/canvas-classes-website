// IEQ page 10 — The pH Scale (NCERT §7.11.2, Table 7.5; founder notes pp.12-13).
// Sub-topic: pH = -log[H+]; pOH = -log[OH-]; pH + pOH = pKw = 14 at 298 K; acidic/basic/
// neutral; a one-unit pH change = 10x change in [H+]. pH is NOT locked to 0-14 — it can go
// below 0 or above 14, and the scale really runs 0 to pKw with neutral at pKw/2, so hot
// water at pH 6 is still neutral (pKw shrank). The log-decomposition trick: split any log
// into log 2 = 0.3 and log 5 = 0.7. Folds NCERT Problem 7.16 (soft drink, pH 2.42).
// Voice: teacher-voice-profile + IEQ-exemplars (A: pH-relative-to-pKw / hot-water; B: the
// log-manipulation move). HIS analogies only, no invented ones.
// §5.X audited: no "Not X. It is Y." pairs, no banned metaphors, <=1 em-dash/para, plain
// SVO, say-it-once, no "the secret is", no intensifier-stacking, no universal claims,
// second person, analogy-first.
module.exports = {
  page_number: 10,
  slug: 'the-ph-scale',
  title: 'The pH Scale',
  subtitle: 'Measuring how acidic a solution is.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A long horizontal ruler-like scale drawn like a chemist sketched it in a notebook, running left to right with hand-lettered numbers 0 ... 7 ... 14; the left half tinted warm (acidic), the right half cool (basic), a small upward arrow at the centre hand-lettered "neutral". A few everyday items sketched and placed along it: a lemon near the low end, a glass of water at the middle, a bar of soap near the high end. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'One Number for a Billionfold Range',
        "The hydrogen-ion concentration in lemon juice is roughly ten million times larger than in soapy water. Writing those amounts out means dragging around numbers like $10^{-2}$ and $10^{-12}$. The pH scale folds that enormous range into tidy values between about 1 and 13, so a chemist can compare two solutions at a glance instead of counting zeros."),
      h.text(
        "The amount of hydrogen ion in a solution is usually a tiny number with a long string of zeros, like $[\\ce{H+}] = 10^{-7}$ mol L⁻¹ for pure water. To make that easier to handle, you take its logarithm and flip the sign. The result is the **pH**:\n\n" +
        "$$pH = -\\log[\\ce{H+}]$$\n\n" +
        "The same move applied to the hydroxide ion gives the **pOH**:\n\n" +
        "$$pOH = -\\log[\\ce{OH-}]$$\n\n" +
        "Because $[\\ce{H+}][\\ce{OH-}] = K_w$, taking the negative log of both sides ties the two together. At 298 K, where $K_w = 10^{-14}$:\n\n" +
        "$$pH + pOH = pK_w = 14$$\n\n" +
        "So a pH of 7 means $[\\ce{H+}] = 10^{-7}$ mol L⁻¹, which is exactly the value for pure water. That gives you the dividing line: at 298 K, $pH = 7$ is neutral, $pH < 7$ is acidic, and $pH > 7$ is basic."
      ),
      h.heading('Reading the scale and moving along it', 'Place a solution on the pH scale and read what a one-unit step means for the hydrogen-ion concentration.'),
      h.text(
        "One thing about the scale catches students out. Because pH is a logarithm, the steps are not even spacings of concentration. **Each step of one pH unit is a tenfold change in $[\\ce{H+}]$.** A solution at pH 3 has ten times the hydrogen ion of one at pH 4, and a hundred times that of one at pH 5. A small-looking change on paper is a large change in the chemistry.\n\n" +
        "There is also a habit worth dropping early: treating pH as if it is locked between 0 and 14. It is not. A very concentrated strong acid can read a pH below 0, and a very concentrated strong base can read above 14. The scale really runs from 0 up to $pK_w$, with neutral sitting halfway, at $pK_w/2$.\n\n" +
        "This matters the moment temperature changes. $K_w$ rises when you heat water, so $pK_w$ shrinks below 14, and the neutral midpoint slides below 7. Warm water can read pH 6 and still be perfectly neutral: heating it did not turn it acidic, the scale itself shifted. To judge whether something is acidic, compare its pH to the neutral point at *that* temperature, not to a fixed 7."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A clean horizontal pH scale drawn like a chemist sketched it in a notebook, numbered 0 to 14, the left portion warm-tinted "acidic" and the right portion cool-tinted "basic", with a centre tick at 7 hand-lettered "neutral". Small labelled markers placed along it for common fluids: gastric juice near 1.2, lemon near 2.2, soft drink near 3, black coffee near 5, milk near 6.8, blood near 7.4, sea water near 7.8, milk of magnesia near 10. Below the main scale, a faint second shorter scale drawn for hot water, its right end pulled in and labelled "pKw smaller", with its neutral midpoint marked at 6 and hand-lettered "still neutral, scale shifted". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'Common fluids placed on the pH scale at 298 K (gastric juice ~1.2, blood 7.4). Below it: heat the water and the whole scale shrinks, so the neutral midpoint slides to 6 — pH 6 hot water is still neutral.'
      ),
      h.text(
        "When you actually have to compute a pH, the logarithm looks intimidating, but there is a clean way to do it in your head. Instead of crunching the log of an awkward number, manipulate the two values you already know by heart: $\\log 2 = 0.3$ and $\\log 5 = 0.7$. Almost any everyday log can be built from those two anchors. For example $\\log 4 = 2\\log 2 = 0.6$, and $\\log 8 = 3\\log 2 = 0.9$. So if $[\\ce{H+}] = 2 \\times 10^{-5}$, then $pH = 5 - \\log 2 = 5 - 0.3 = 4.7$, no calculator needed."
      ),
      h.worked('Problem 7.16 (NCERT)', 'ncert_intext',
        "The concentration of hydrogen ion in a sample of soft drink is $3.8 \\times 10^{-3}$ M. What is its pH?",
        "**Step 1 — write the definition.**\n\n" +
        "$$pH = -\\log[\\ce{H+}] = -\\log(3.8 \\times 10^{-3})$$\n\n" +
        "**Step 2 — split the log into its two pieces.** The log of a product is the sum of the logs:\n\n" +
        "$$pH = -\\big[\\log 3.8 + \\log 10^{-3}\\big] = -\\big[\\log 3.8 + (-3)\\big]$$\n\n" +
        "**Step 3 — put in $\\log 3.8 \\approx 0.58$.**\n\n" +
        "$$pH = -[0.58 - 3] = -(-2.42) = 2.42$$\n\n" +
        "**Answer:** the soft drink has $pH = 2.42$. Since this is well below 7, the drink is acidic — which fits, as fizzy drinks carry dissolved carbonic acid.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "A student heats a beaker of pure water and measures its pH with a good meter. The reading drops from 7.00 to 6.50. The student concludes that heating made the water acidic. Where is the mistake?",
        [
          "There is no mistake — pH below 7 always means an acidic solution",
          "Heating adds $\\ce{H+}$ from the air, so the water genuinely became acidic",
          "Heating raised $K_w$, so $pK_w$ and the neutral midpoint both dropped below 7; the water still has $[\\ce{H+}] = [\\ce{OH-}]$, so it stays neutral",
          "The meter is broken, because the pH of pure water can never change",
        ], 2,
        "Neutral means $[\\ce{H+}] = [\\ce{OH-}]$, and heating water keeps those two equal while raising both. Self-ionization absorbs heat, so warming pushes it forward: $K_w$ goes up, $pK_w$ falls below 14, and the neutral midpoint $pK_w/2$ falls below 7. The water reads 6.5 and is still neutral. You compare a pH to the neutral point at that temperature, not to a fixed 7.",
        3),
      h.callout('exam_tip', 'JEE / NEET — Working with pH',
        "- **$pH + pOH = 14$ holds only at 298 K.** It comes from $pK_w = 14$ at that temperature. If a problem changes the temperature, recompute $pK_w$ first.\n" +
        "- **One pH unit is a factor of 10 in $[\\ce{H+}]$.** Going from pH 5 to pH 2 is not '3 more', it is $10^3 = 1000$ times more hydrogen ion.\n" +
        "- **Do logs with the anchors.** Keep $\\log 2 = 0.3$ and $\\log 5 = 0.7$ ready; build $\\log 4, \\log 8, \\log 2.5$ from them instead of reaching for a calculator. When options are given, you can also test each one backwards.\n" +
        "- **A pH below 0 or above 14 is allowed.** Very concentrated strong acids and bases live outside 0–14. Do not 'round' a calculated pH back into that window because it looks wrong."),
      h.quiz([
        {
          question: "A solution has $[\\ce{H+}] = 5 \\times 10^{-4}$ M. Using $\\log 5 = 0.7$, its pH is:",
          options: [
            "$3.3$",
            "$4.7$",
            "$3.7$",
            "$0.7$",
          ], correct_index: 0,
          explanation: "$pH = -\\log(5 \\times 10^{-4}) = -[\\log 5 + (-4)] = -[0.7 - 4] = 3.3$. The answer 4.7 comes from forgetting the sign on the 0.7; 3.7 comes from using $\\log 2$ by mistake. Splitting the log into $\\log 5$ plus the power of ten gives 3.3 cleanly.",
        },
        {
          question: "Pure water is heated so that its $K_w$ rises and its measured pH becomes 6.4. The water is:",
          options: [
            "Acidic, because its pH is below 7",
            "Basic, because heating water releases $\\ce{OH-}$",
            "Neutral, because $[\\ce{H+}]$ still equals $[\\ce{OH-}]$ and the neutral point has moved below 7",
            "Impossible — the pH of water cannot fall below 7",
          ], correct_index: 2,
          explanation: "Heating keeps $[\\ce{H+}]$ and $[\\ce{OH-}]$ equal while raising both, which is the definition of neutral. The neutral midpoint $pK_w/2$ slid below 7 because $pK_w$ shrank, so 6.4 is the new neutral reading. Reading it as acidic uses the fixed-7 rule that only holds at 298 K.",
        },
        {
          question: "Two solutions differ in pH by exactly 2 units. How do their hydrogen-ion concentrations compare?",
          options: [
            "They differ by a factor of 2",
            "They differ by a factor of 20",
            "They differ by a factor of 100",
            "They are the same, since pH and $[\\ce{H+}]$ are unrelated",
          ], correct_index: 2,
          explanation: "pH is a logarithm to base 10, so each unit is a tenfold change in $[\\ce{H+}]$. Two units is $10 \\times 10 = 100$ times. A factor of 2 or 20 ignores that the scale is logarithmic, not linear.",
        },
      ]),
    ];
  },
};
