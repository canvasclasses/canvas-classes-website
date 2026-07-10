// IEQ page 11 — Calculating pH for strong / weak acids, and the dilute-acid water trap.
// (NCERT §7.11.2-7.11.3; Problems 7.17, 7.19, 7.20.)
// Sub-topic: strong acid/base pH (direct, [H+] = conc x basicity); weak acid pH via Ostwald
// ([H+] = sqrt(Ka*C), then pH); the water-contribution trap for very dilute strong acid
// (10^-8 M HCl) — set up Kw = (10^-8 + x)x, solve, pH ~6.98, never 8; di-/polyprotic acid
// pH (first dissociation dominates).
// Voice: teacher-voice-profile + IEQ-exemplars (C flagship trap: "acid diluted to pH 8"
// reflex — solve the wrong way to pH 8 first, then break it; safeguard: pH close to 7 for
// an acid => include water; 1-alpha~=1 not automatic). HIS framing only.
// §5.X audited: no "Not X. It is Y." pairs, no banned metaphors, <=1 em-dash/para, plain
// SVO, say-it-once, no "the secret is", no intensifier-stacking, no universal claims,
// second person, analogy-first, error-pedagogy (state the tempting wrong answer, then break).
module.exports = {
  page_number: 11,
  slug: 'ph-calculations',
  title: 'Calculating pH: Strong, Weak, and the Water Trap',
  subtitle: 'From a concentration to a pH — and the trap near 7.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A row of three beakers drawn like a chemist sketched them in a notebook, going left to right from a deeply tinted concentrated acid, to a paler one, to an almost colourless very dilute one, each with fewer and fewer tiny H+ particles sketched inside. Beneath the beakers a faint horizontal number-line hand-lettered showing pH creeping up toward a dashed line marked "7", but a small hand-drawn wall stopping it just before 7 with a note "never crosses". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'You Cannot Dilute an Acid Into a Base',
        "Take a strong acid and keep adding water. The pH climbs: 3, 4, 5, 6... and a tempting shortcut says it will sail past 7 and become basic. It never does. However much you water down an acid, it stays acidic and its pH stops just short of 7. The reason is the water itself, and it is one of the most-tested traps in this chapter."),
      h.text(
        "Finding the pH of a solution comes down to finding its $[\\ce{H+}]$ first. How you get there depends on whether the acid or base is strong or weak.\n\n" +
        "For a **strong acid or base**, the whole amount ionizes, so the ion concentration is read off directly. For a strong monoacidic acid like $\\ce{HCl}$, $[\\ce{H+}]$ equals the concentration. If the acid is diprotic, like $\\ce{H2SO4}$, multiply by its basicity: $[\\ce{H+}] = 2 \\times$ concentration. So $0.01$ M $\\ce{HCl}$ gives $pH = 2$, and $0.01$ M $\\ce{H2SO4}$ gives $[\\ce{H+}] = 0.02$ M, hence $pH = 1.7$.\n\n" +
        "For a **weak acid**, only a fraction ionizes, so you cannot read $[\\ce{H+}]$ straight off. You use the Ostwald result from the dissociation page: when the acid is weak enough that the $1 - \\alpha$ term stays close to 1,\n\n" +
        "$$[\\ce{H+}] = \\sqrt{K_a \\, C}$$\n\n" +
        "Then take $pH = -\\log[\\ce{H+}]$ as usual. One caution attached to that step: the $1 - \\alpha \\approx 1$ shortcut only holds while $\\alpha$ is genuinely small. If $\\alpha$ comes back large, throw the approximation out and solve the full quadratic."
      ),
      h.heading('The trap: very dilute strong acid', 'Explain why a strongly diluted acid approaches pH 7 from below but never reaches it, and set up the water-corrected calculation.'),
      h.text(
        "Here is the move that breaks students, and it is worth walking into the wrong answer first so the correction sticks.\n\n" +
        "Take $10^{-8}$ M $\\ce{HCl}$. The reflex is to write $pH = -\\log(10^{-8}) = 8$ and move on. But that says an *acid* has a *basic* pH, which cannot be right. Something is missing.\n\n" +
        "What is missing is the water. At this dilution, the acid supplies only $10^{-8}$ mol L⁻¹ of $\\ce{H+}$, which is *less* than the $10^{-7}$ that pure water already provides on its own. Once the acid's contribution is small compared to water's, you can no longer ignore the water. You have to let both sources add up.\n\n" +
        "Write the total $[\\ce{H+}]$ as the $10^{-8}$ from the acid plus an unknown $x$ from water, with $[\\ce{OH-}] = x$, and feed them into $K_w$:\n\n" +
        "$$K_w = (10^{-8} + x)\\,x = 10^{-14}$$\n\n" +
        "Solving this gives a $[\\ce{H+}]$ a little above $10^{-7}$, so the pH lands just below 7, near 6.98. That is the safeguard worth carrying: **whenever a calculated pH for an acid comes out close to 7, stop and bring in water's own ionization.**"
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A single long horizontal number line drawn like a chemist sketched it in a notebook, labelled "[H+]" decreasing from left to right, with hand-lettered tick marks at 10^-1, 10^-3, 10^-5, 10^-7. Above the line, a curve of pH rising gently from left to right as the acid is diluted, approaching a dashed horizontal guide line hand-lettered "pH = 7" but flattening just below it and never touching, with a small hand-drawn arrow and note "stops at ~6.98". A faint hand-lettered caption to the side: "water keeps it acidic". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'Keep diluting a strong acid and its pH rises toward 7 — but water\'s own H⁺ holds it just below, so it flattens near 6.98 and never crosses into basic.'
      ),
      h.worked('Problem 7.17 (NCERT)', 'ncert_intext',
        "Calculate the pH of a $1.0 \\times 10^{-8}$ M solution of $\\ce{HCl}$.",
        "**The tempting (wrong) route first.** Treat it like any strong acid:\n\n" +
        "$$pH = -\\log(10^{-8}) = 8$$\n\n" +
        "This says an acid is basic, so it is wrong. The acid is so dilute that water's own $\\ce{H+}$ matters.\n\n" +
        "**Step 1 — count both sources of $\\ce{H+}$.** Let $x = [\\ce{OH-}]$ come from water. The total $\\ce{H+}$ is the $10^{-8}$ from $\\ce{HCl}$ plus the $x$ from water:\n\n" +
        "$$[\\ce{H3O+}] = 10^{-8} + x$$\n\n" +
        "**Step 2 — apply $K_w$.**\n\n" +
        "$$K_w = (10^{-8} + x)\\,x = 10^{-14}$$\n\n" +
        "**Step 3 — solve the quadratic.**\n\n" +
        "$$x^2 + 10^{-8}\\,x - 10^{-14} = 0$$\n\n" +
        "$$x = [\\ce{OH-}] = 9.5 \\times 10^{-8} \\text{ M}$$\n\n" +
        "**Step 4 — get $[\\ce{H+}]$ and the pH.**\n\n" +
        "$$[\\ce{H3O+}] = 10^{-8} + 9.5 \\times 10^{-8} = 1.05 \\times 10^{-7} \\text{ M}$$\n\n" +
        "$$pOH = 7.02, \\qquad pH = 6.98$$\n\n" +
        "**Answer:** $pH = 6.98$, just below 7. The solution is still acidic, exactly as an acid should be.",
        'tap_to_reveal'),
      h.worked('Problem 7.19 (NCERT)', 'ncert_intext',
        "The pH of a $0.1$ M monobasic acid is $4.50$. Calculate the concentrations of $\\ce{H+}$, $\\ce{A-}$ and $\\ce{HA}$ at equilibrium, and find $K_a$, $pK_a$, and the percent dissociation.",
        "**Step 1 — turn pH back into $[\\ce{H+}]$.**\n\n" +
        "$$[\\ce{H+}] = 10^{-pH} = 10^{-4.50} = 3.16 \\times 10^{-5} \\text{ M}$$\n\n" +
        "**Step 2 — read off the other amounts.** For $\\ce{HA <=> H+ + A-}$, each $\\ce{H+}$ comes with one $\\ce{A-}$:\n\n" +
        "$$[\\ce{A-}] = [\\ce{H+}] = 3.16 \\times 10^{-5} \\text{ M}$$\n\n" +
        "The acid used up is tiny next to $0.1$, so the undissociated $\\ce{HA}$ is essentially unchanged:\n\n" +
        "$$[\\ce{HA}] = 0.1 - 3.16 \\times 10^{-5} \\approx 0.1 \\text{ M}$$\n\n" +
        "**Step 3 — compute $K_a$ and $pK_a$.**\n\n" +
        "$$K_a = \\frac{[\\ce{H+}][\\ce{A-}]}{[\\ce{HA}]} = \\frac{(3.16 \\times 10^{-5})^2}{0.1} = 1.0 \\times 10^{-8}$$\n\n" +
        "$$pK_a = -\\log(10^{-8}) = 8$$\n\n" +
        "**Step 4 — percent dissociation.**\n\n" +
        "$$\\% = \\frac{[\\ce{HA}]_\\text{dissociated}}{[\\ce{HA}]_\\text{initial}} \\times 100 = \\frac{3.16 \\times 10^{-5}}{0.1} \\times 100 = 0.0316\\%$$\n\n" +
        "**Answer:** $[\\ce{H+}] = [\\ce{A-}] = 3.16 \\times 10^{-5}$ M, $[\\ce{HA}] \\approx 0.1$ M, $K_a = 1.0 \\times 10^{-8}$, $pK_a = 8$, percent dissociation $= 0.0316\\%$.",
        'tap_to_reveal'),
      h.worked('Problem 7.20 (NCERT)', 'ncert_intext',
        "Calculate the pH of a $0.08$ M solution of hypochlorous acid, $\\ce{HOCl}$. Its ionization constant is $K_a = 2.5 \\times 10^{-5}$. Also find the percent dissociation.",
        "**Step 1 — set the ICE relation.** For $\\ce{HOCl + H2O <=> H3O+ + ClO-}$, let $x = [\\ce{H+}]$ formed:\n\n" +
        "$$K_a = \\frac{x^2}{0.08 - x}$$\n\n" +
        "**Step 2 — check the approximation.** $K_a$ is small, so expect $x \\ll 0.08$ and write $0.08 - x \\approx 0.08$:\n\n" +
        "$$x^2 = K_a \\times 0.08 = (2.5 \\times 10^{-5})(0.08) = 2.0 \\times 10^{-6}$$\n\n" +
        "**Step 3 — solve for $x$.**\n\n" +
        "$$x = [\\ce{H+}] = \\sqrt{2.0 \\times 10^{-6}} = 1.41 \\times 10^{-3} \\text{ M}$$\n\n" +
        "(Check: $1.41 \\times 10^{-3}$ is small next to $0.08$, so dropping $x$ was fair.)\n\n" +
        "**Step 4 — pH.**\n\n" +
        "$$pH = -\\log(1.41 \\times 10^{-3}) = 2.85$$\n\n" +
        "**Step 5 — percent dissociation.**\n\n" +
        "$$\\% = \\frac{1.41 \\times 10^{-3}}{0.08} \\times 100 = 1.76\\%$$\n\n" +
        "**Answer:** $pH = 2.85$ and the acid is $1.76\\%$ dissociated.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "A polyprotic acid $\\ce{H2A}$ has $K_{a1} = 1 \\times 10^{-4}$ and $K_{a2} = 1 \\times 10^{-8}$. To find the pH of a $0.1$ M solution, a student tries to add the $\\ce{H+}$ from both dissociation steps. Why is this extra work, and what should they do instead?",
        [
          "Both steps matter equally, so adding them is correct and necessary",
          "The second step is suppressed and gives negligible extra $\\ce{H+}$; the pH is fixed almost entirely by the first dissociation, so use $K_{a1}$ alone",
          "They should use $K_{a2}$ alone, because the last step always controls the pH",
          "They must multiply $K_{a1}$ and $K_{a2}$ to get an overall constant before finding $\\ce{H+}$",
        ], 1,
        "The first step already floods the solution with $\\ce{H+}$, and that common ion pushes the much weaker second step ($K_{a2}$ is ten thousand times smaller) almost completely shut. Its added $\\ce{H+}$ is negligible. So you compute pH from $K_{a1}$ and the starting concentration alone, which is why examiners often hand you only $K_{a1}$.",
        2),
      h.callout('exam_tip', 'JEE / NEET — pH Calculation Checklist',
        "- **Classify first.** Strong acid or base: $[\\ce{H+}]$ direct (times basicity for diprotic). Weak acid: $[\\ce{H+}] = \\sqrt{K_a C}$, then pH.\n" +
        "- **The water trap.** If a strong acid is very dilute (around $10^{-6}$ M or below), do not just take $-\\log$. Set $K_w = (C + x)x$ and solve. The pH for an acid stays just below 7 and never reaches 8.\n" +
        "- **Safeguard rule:** any acid pH that comes out close to 7 is a flag to include water's autoprotolysis. The wrong answer (like pH 8) is often the very first option, placed there to catch you.\n" +
        "- **Check the approximation.** $1 - \\alpha \\approx 1$ is allowed only while $\\alpha$ is small. If $\\alpha$ (or $x$) comes back large compared to $C$, redo with the full quadratic.\n" +
        "- **Polyprotic acids:** the first dissociation sets the pH; the later steps are common-ion suppressed and ignored."),
      h.quiz([
        {
          question: "What is the pH of a $5 \\times 10^{-3}$ M solution of $\\ce{H2SO4}$ (treat both protons as fully ionized)? Use $\\log 2 = 0.3$.",
          options: [
            "$2.3$",
            "$2.0$",
            "$3.0$",
            "$1.7$",
          ], correct_index: 1,
          explanation: "$\\ce{H2SO4}$ is diprotic, so $[\\ce{H+}] = 2 \\times 5 \\times 10^{-3} = 10^{-2}$ M, giving $pH = 2.0$. Forgetting to double for the second proton gives 2.3. The basicity factor of 2 is the whole point of the question.",
        },
        {
          question: "A student computes the pH of $10^{-8}$ M $\\ce{HCl}$ as exactly 8.0. What is wrong?",
          options: [
            "Nothing — a dilute acid can have a basic pH",
            "The acid is so dilute that water's $\\ce{H+}$ must be included; the true pH is about 6.98, still acidic",
            "They should have used $pH = +\\log[\\ce{H+}]$ without the minus sign",
            "$\\ce{HCl}$ is a weak acid, so they should have used $\\sqrt{K_a C}$",
          ], correct_index: 1,
          explanation: "An acid cannot have a basic pH. At $10^{-8}$ M the acid supplies less $\\ce{H+}$ than water already does, so you solve $K_w = (10^{-8}+x)x$ and get pH 6.98. $\\ce{HCl}$ is a strong acid, so the weak-acid formula does not apply, and the minus sign in pH is correct.",
        },
        {
          question: "A $0.1$ M weak acid has $K_a = 10^{-6}$. Using $[\\ce{H+}] = \\sqrt{K_a C}$, its pH is:",
          options: [
            "$3.5$",
            "$1.0$",
            "$6.0$",
            "$7.0$",
          ], correct_index: 0,
          explanation: "$[\\ce{H+}] = \\sqrt{10^{-6} \\times 0.1} = \\sqrt{10^{-7}} = 10^{-3.5}$, so $pH = 3.5$. Reading pH 1.0 treats it as a strong acid; pH 6.0 mistakenly uses $K_a$ as $[\\ce{H+}]$. The square-root form is what accounts for only a fraction of the weak acid ionizing.",
        },
      ]),
    ];
  },
};
