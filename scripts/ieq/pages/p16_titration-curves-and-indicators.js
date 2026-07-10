// IEQ page 16 — Titration Curves and Indicators (NCERT §7.11/§7.12, founder DPP3 material).
// An acid-base titration tracks pH as titrant is added. Curve shapes:
//   strong acid-strong base : long vertical jump through pH 7 at equivalence.
//   weak acid-strong base   : shorter jump, equivalence above 7, a buffer region on the way
//                             up where pH = pKa at half-titration.
//   strong acid-weak base   : equivalence below 7.
// Equivalence point (stoichiometric) vs end point (where the indicator flips, a touch after).
// Choosing an indicator: its colour-change pH window must fall on the steep part of the curve
//   (phenolphthalein 8-10 for WA-SB; methyl orange 3-4.5 for SA-WB).
// How an indicator works: it is itself a weak acid HIn <=> H+ + In-, acid form and base form
//   differently coloured.
// Voice: teacher-voice-profile + IEQ-exemplars. HIS points (used, not invented):
//   - A: equivalence vs end point = car brakes ("you brake, the car stops a little after").
//   - A/C: sharpness = "one drop and the game flips" (one drop before acidic, one after basic).
//   - A: the flat stretch of the curve is the buffer resisting.
//   - E (ratta licensing): indicator colour ranges are pure memorisation, "isme koi madad
//     nahi ki ja sakti -- yaad hi karna hai".
// §5.X audited: no "Not X. It is Y." pairs; no banned metaphors; <=1 em-dash/para; plain SVO;
// say-it-once; second person; analogy-first with HIS analogy; no reveal framing; no
// intensifier-stacking; no triple-repetition; no universal claims.
module.exports = {
  page_number: 16,
  slug: 'titration-curves-and-indicators',
  title: 'Titration Curves and Indicators',
  subtitle: 'Watching pH change drop by drop.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, science-notebook feel. Ultra-wide cinematic banner. A tall burette drawn like a chemist sketched it drips a single drop into a flask below; rising out of the flask, a faint S-shaped curve climbs from low to high with a hand-lettered "pH" up the side and "volume of base added" along the bottom, and a short steep stretch in the middle marked faintly "one drop flips it". Calm, uncluttered, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'One Drop Flips the Whole Flask',
        "Near the end of a titration the solution can swing from clearly acidic to clearly basic on a **single drop** from the burette. One drop before, the flask is still on the acid side; one drop after, it has crossed to the base side. That sudden swing is what makes the colour of an indicator snap over so cleanly, and it is the whole reason a titration can be read by eye."),
      h.text(
        "A titration adds one solution to another a little at a time, and the natural thing to track is the **pH**. As base is run into an acid, the pH starts low, climbs slowly, then races up through a short steep stretch, and finally levels off high. Plot pH against the volume of base added and you get the **titration curve**, an S-shaped climb whose shape tells you what kind of acid and base you mixed.\n\n" +
        "The point where exactly enough base has been added to react with all the acid is the **equivalence point**. The shape of the curve around that point is set by how strong the two partners are:\n\n" +
        "- **Strong acid with strong base.** A long vertical jump, racing through $pH = 7$. The equivalence point sits right at 7 because the salt formed is neutral.\n" +
        "- **Weak acid with strong base.** A shorter vertical jump, and the equivalence point lands **above 7** because the salt of a weak acid is basic. On the way up there is a flat stretch where the pH barely moves.\n" +
        "- **Strong acid with weak base.** The equivalence point lands **below 7**, because the salt of a weak base is acidic."
      ),
      h.heading('Equivalence point, end point, and choosing the indicator',
        'Tell the equivalence point from the end point, and choose an indicator whose colour change falls on the steep part of the curve.'),
      h.text(
        "There are two named points in a titration, and they are close but not the same. The **equivalence point** is where the acid and base have reacted in exact stoichiometric amounts. The **end point** is where the indicator actually changes colour, which comes a touch later. Think of braking a car: you press the brake at one moment, and the car comes to rest a little further on. You aim for the equivalence point, and the indicator stops you just past it.\n\n" +
        "The flat stretch on the weak-acid curve is worth a closer look. Along that stretch the flask holds both the leftover weak acid and the salt being formed, which is a **buffer**, and a buffer resists a change in pH. At the half-way point of that stretch the salt equals the acid, so by Henderson the pH reads $pK_a$ straight off. That flatness is the buffer doing its job.\n\n" +
        "To read the end point you add an **indicator**, and the rule for picking one is simple: its colour-change pH window must fall on the **steep, vertical part** of the curve, where one drop carries the pH across a wide range. Two standard choices:\n\n" +
        "- **Phenolphthalein** changes over about $pH$ $8$ to $10$, so it suits a **weak acid with strong base**, whose jump sits above 7.\n" +
        "- **Methyl orange** changes over about $pH$ $3$ to $4.5$, so it suits a **strong acid with weak base**, whose jump sits below 7.\n\n" +
        "An indicator works because it is itself a **weak acid**, written $\\ce{HIn}$, whose un-ionised form and ionised form are different colours:\n\n" +
        "$$\\ce{HIn <=> H+ + In-}$$\n\n" +
        "In acid the equilibrium sits left and you see the colour of $\\ce{HIn}$; in base it shifts right and you see the colour of $\\ce{In-}$. The colour you see reports the $\\ce{H+}$ in the flask."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, clean science-notebook feel. A single set of axes drawn like a chemist sketched it in a notebook: vertical axis hand-lettered "pH" from 0 to 14, horizontal axis "volume of titrant added". Three S-shaped curves overlaid in different warm ink colours, each labelled: "strong acid + strong base" with its steep jump crossing a dashed line at pH 7; "weak acid + strong base" with a shorter jump and a small flat shelf on the way up labelled "buffer region, pH = pKa", its equivalence dot marked above 7; "strong acid + weak base" with its equivalence dot marked below 7. Two faint horizontal bands across the steep regions: one labelled "phenolphthalein 8-10", one labelled "methyl orange 3-4.5". A small dot on each curve hand-lettered "equivalence point". Warm ink colours, no large text blocks.',
        '16:9',
        'Three titration curves overlaid: strong acid–strong base jumps through pH 7; weak acid–strong base has a buffer shelf (pH = pKₐ) and equivalence above 7; strong acid–weak base sits below 7. The indicator window must land on the steep part — phenolphthalein for the upper jumps, methyl orange for the lower one.'
      ),
      h.worked('Picking the right indicator', 'solved_example',
        "You titrate $\\ce{CH3COOH}$ (a weak acid) with $\\ce{NaOH}$ (a strong base). Would you use phenolphthalein (changes over $pH$ $8$–$10$) or methyl orange (changes over $pH$ $3$–$4.5$) to find the end point, and why?",
        "**Step 1 — locate the equivalence point.** A weak acid titrated with a strong base gives the salt of a weak acid, $\\ce{CH3COONa}$, which is basic in water. So the equivalence point sits **above** $pH$ $7$, somewhere around $8$–$9$.\n\n" +
        "**Step 2 — find the steep part of the curve.** The vertical jump for this titration is short and centred above 7. The colour change you read must happen inside that steep stretch, so that one drop carries the solution across it.\n\n" +
        "**Step 3 — match the indicator window to that stretch.** Phenolphthalein turns over $pH$ $8$–$10$, which sits right on the steep part above 7. Methyl orange turns over $pH$ $3$–$4.5$, far below the jump, so it would change colour long before the equivalence point and give a wrong reading.\n\n" +
        "**Answer:** use **phenolphthalein**. Its colour-change window lands on the steep part of a weak-acid–strong-base curve; methyl orange flips too early to be of any use here.",
        'tap_to_reveal'),
      h.worked('Reading pH = pKa off the curve', 'solved_example',
        "A weak acid is titrated with $\\ce{NaOH}$. When exactly **half** the acid has been neutralised, what is the pH in terms of the acid's $pK_a$, and why does the curve go flat there?",
        "**Step 1 — count what is in the flask at half-titration.** Picture 100 particles of the weak acid. After half are neutralised, 50 have become the salt and 50 acid remain. So the salt equals the acid.\n\n" +
        "**Step 2 — apply Henderson.** The flask now holds a weak acid with its salt, which is a buffer:\n\n" +
        "$$pH = pK_a + \\log\\frac{[\\text{salt}]}{[\\text{acid}]}$$\n\n" +
        "**Step 3 — kill the log term.** With salt equal to acid the ratio is 1, and $\\log 1 = 0$:\n\n" +
        "$$pH = pK_a$$\n\n" +
        "**Step 4 — explain the flat stretch.** Around this half-way point the buffer resists added base, so the pH barely moves as more base goes in. That resistance is what flattens the curve there.\n\n" +
        "**Answer:** at half-neutralisation $pH = pK_a$, and the curve is flat because the half-titrated mixture is a buffer holding its pH steady. This gives a clean way to read $pK_a$ straight off a titration curve.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "A student titrates dilute $\\ce{HCl}$ (a strong acid) with aqueous $\\ce{NH3}$ (a weak base). Out of habit they reach for phenolphthalein, which changes colour over $pH$ $8$–$10$. Their end point comes out badly wrong. What went wrong, and which indicator should they have used?",
        [
          "Nothing is wrong; phenolphthalein works for every titration as long as it is fresh",
          "A strong acid with a weak base has its equivalence point below 7, so methyl orange ($pH$ 3–4.5) is needed; phenolphthalein flips far above the steep part",
          "Phenolphthalein is fine here, but they added too little of it",
          "They should have used no indicator at all and watched for the solution turning warm",
        ], 1,
        "The salt formed from a strong acid and a weak base ($\\ce{NH4Cl}$) is acidic, so the equivalence point sits below $pH$ $7$ and the steep part of the curve is in the acidic region. An indicator only reads the end point correctly when its colour-change window falls on that steep stretch. Phenolphthalein turns over $pH$ $8$–$10$, well above the jump, so it changes colour long after the true equivalence point. Methyl orange, turning over $pH$ $3$–$4.5$, sits right on the steep part and gives a sharp end point.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Curves and Indicators',
        "- **Equivalence point depends on the salt.** Strong–strong $\\rightarrow$ neutral salt $\\rightarrow$ equivalence at $pH$ $7$. Weak acid–strong base $\\rightarrow$ basic salt $\\rightarrow$ equivalence **above** 7. Strong acid–weak base $\\rightarrow$ acidic salt $\\rightarrow$ equivalence **below** 7.\n" +
        "- **Match the indicator to the steep part.** Phenolphthalein ($8$–$10$) for jumps above 7; methyl orange ($3$–$4.5$) for jumps below 7. The colour-change window must land on the vertical stretch.\n" +
        "- **Half-neutralisation gives $pH = pK_a$ for free.** At the middle of the buffer stretch, salt equals acid, the log term is zero, so the pH reads $pK_a$ with no calculation.\n" +
        "- **Indicator ranges are pure memory.** There is no derivation for phenolphthalein $8$–$10$ or methyl orange $3$–$4.5$. Learn the two windows.\n" +
        "- **Classic trap:** the equivalence point and the end point are not identical. The indicator flips a touch after the exact stoichiometric point, like a car stopping just past where you brake."),
      h.quiz([
        {
          question: "In a titration, what is the difference between the equivalence point and the end point?",
          options: [
            "They are two names for exactly the same moment",
            "The equivalence point is where the acid and base have reacted in exact amounts; the end point is where the indicator changes colour, a touch later",
            "The end point comes first, then the equivalence point follows",
            "The equivalence point only exists for strong acids, the end point only for weak acids",
          ], correct_index: 1,
          explanation: "The equivalence point is the exact stoichiometric meeting of acid and base. The end point is what you actually see, the indicator flipping colour, and it comes a little after the equivalence point. It is like braking a car: you press the brake at one moment and the car stops slightly beyond it.",
        },
        {
          question: "A weak acid is titrated with a strong base. Where does the equivalence point lie, and which indicator suits it?",
          options: [
            "At $pH$ $7$, with either indicator working equally well",
            "Above $pH$ $7$, so phenolphthalein ($8$–$10$) is the right indicator",
            "Below $pH$ $7$, so methyl orange ($3$–$4.5$) is the right indicator",
            "It has no fixed equivalence point because the acid is weak",
          ], correct_index: 1,
          explanation: "The salt of a weak acid with a strong base is basic in water, so the equivalence point sits above $pH$ $7$ and the steep part of the curve is in the basic region. Phenolphthalein changes over $pH$ $8$–$10$, landing on that steep stretch, so it reads the end point cleanly. Methyl orange would flip far too early.",
        },
        {
          question: "Why does an indicator change colour as the pH of a solution changes?",
          options: [
            "Because it is a strong acid that dissociates only above $pH$ $7$",
            "Because it is itself a weak acid $\\ce{HIn <=> H+ + In-}$ whose un-ionised and ionised forms are different colours",
            "Because heat released at the equivalence point changes its structure",
            "Because the salt formed in the titration coats the indicator molecules",
          ], correct_index: 1,
          explanation: "An indicator is a weak acid, $\\ce{HIn}$. In acidic solution the equilibrium $\\ce{HIn <=> H+ + In-}$ sits to the left and you see the colour of $\\ce{HIn}$; in basic solution it shifts right and you see the colour of $\\ce{In-}$. The two forms have different colours, so the colour you see reports the $\\ce{H+}$ in the flask.",
        },
      ]),
    ];
  },
};
