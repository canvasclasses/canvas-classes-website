// IEQ page 13 — Salt Hydrolysis (part 1): why some salt solutions aren't neutral.
// NCERT §7.11.9: a salt's ions can react with water (hydrolysis), changing pH. Three cases:
// (i) strong acid + strong base (NaCl) -> both ions spectators, no hydrolysis, neutral pH 7;
// (ii) strong acid + weak base (NH4Cl) -> cation NH4+ hydrolyses, acidic; (iii) weak acid +
// strong base (CH3COONa) -> anion CH3COO- hydrolyses, basic. Hydrolysis constant
// Kh = Kw/Ka (anion of weak acid) or Kw/Kb (cation of weak base); degree h = sqrt(Kh/C);
// pH formulas SA/WB: pH = 7 - 1/2(pKb + log C); WA/SB: pH = 7 + 1/2(pKa + log C).
// Voice: teacher-voice-profile + IEQ-exemplars A. HIS analogies (used, not invented):
// etymology hook "hydro-lysis = hydro(water) + lysis(to break)"; spectator ions of a strong
// acid/base "just get hydrated and watch, they do not hydrolyse" (the match-watcher);
// toy-particle bookkeeping for who is strong/weak. Defining chapter move = the DECISION
// TREE (classify first: strong+strong / strong+weak / weak+strong).
// §5.X audited: no "Not X. It is Y." pairs, no banned metaphors, <=1 em-dash/para, plain
// SVO, say-it-once, second person, no reveal framing, no intensifier-stacking, no triple-
// repetition, no universal claims.
module.exports = {
  page_number: 13,
  slug: 'salt-hydrolysis-1',
  title: "Salt Hydrolysis: When Salts Aren't Neutral",
  subtitle: 'Why some salt solutions turn acidic or basic.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Three beakers in a row drawn like a chemist sketched them in a notebook, each with a strip of pH paper dipped in. The LEFT beaker is hand-lettered "NaCl" with green neutral paper and a small "7". The MIDDLE beaker is "NH4Cl" with reddish paper and a small "< 7 acidic". The RIGHT beaker is "CH3COONa" with bluish paper and a small "> 7 basic". A faint hand-lettered word underneath splits as "hydro | lysis = water | to break". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'A Salt of an Acid and a Base — Yet Not Neutral',
        "Dissolve common salt, $\\ce{NaCl}$, in water and the solution reads a flat pH 7. Dissolve ammonium chloride, $\\ce{NH4Cl}$, and the same neutral-looking white powder gives an *acidic* solution. Both are salts, both made from an acid and a base, yet one stays neutral and the other turns sour. The reason is that some of a salt's ions quietly react with water, and that reaction has a name worth breaking apart: **hydrolysis**."),
      h.text(
        "The word **hydrolysis** comes apart into two pieces: *hydro* means water, and *lysis* means to break. So hydrolysis is a substance being broken by water. When a salt dissolves, its ions can react with water and produce a little extra $\\ce{H+}$ or $\\ce{OH-}$, which shifts the pH away from 7.\n\n" +
        "Whether that happens depends on where the salt came from. Every salt is the product of an acid and a base, and the key question is whether each of those parents was strong or weak. The ion left behind by a **strong** parent just gets hydrated and sits there watching; it does not hydrolyse. The ion left behind by a **weak** parent is the one that reacts with water. So before any calculation, classify the salt first."
      ),
      h.heading('The three cases: strong, weak, and which ion reacts', 'Classify a salt by the strength of its parent acid and base, and predict whether the solution is neutral, acidic, or basic.'),
      h.text(
        "Picture a salt as two ions that each remember their parent. Use a small toy count to keep track: a strong parent leaves a calm spectator ion, a weak parent leaves a reactive one. Three cases cover the salts on this page.\n\n" +
        "**Case 1 — strong acid + strong base** (for example $\\ce{NaCl}$, from $\\ce{HCl}$ and $\\ce{NaOH}$). Both parents are strong, so both ions, $\\ce{Na+}$ and $\\ce{Cl-}$, are spectators. They get hydrated and stay put. Neither reacts with water, so no extra $\\ce{H+}$ or $\\ce{OH-}$ appears. The solution is **neutral, pH 7**.\n\n" +
        "**Case 2 — strong acid + weak base** (for example $\\ce{NH4Cl}$, from $\\ce{HCl}$ and weak $\\ce{NH4OH}$). The $\\ce{Cl-}$ is a strong-acid spectator and does nothing. The cation $\\ce{NH4+}$ came from a weak base, so it hydrolyses, releasing $\\ce{H+}$:\n\n" +
        "$$\\ce{NH4+ + H2O <=> NH4OH + H+}$$\n\n" +
        "The extra $\\ce{H+}$ makes the solution **acidic, pH below 7**.\n\n" +
        "**Case 3 — weak acid + strong base** (for example $\\ce{CH3COONa}$, from weak $\\ce{CH3COOH}$ and $\\ce{NaOH}$). The $\\ce{Na+}$ is a strong-base spectator and does nothing. The anion $\\ce{CH3COO-}$ came from a weak acid, so it hydrolyses, releasing $\\ce{OH-}$:\n\n" +
        "$$\\ce{CH3COO- + H2O <=> CH3COOH + OH-}$$\n\n" +
        "The extra $\\ce{OH-}$ makes the solution **basic, pH above 7**."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. A notebook-style three-column chart. COLUMN 1 headed "NaCl (strong acid + strong base)": both ions Na+ and Cl- drawn as small calm figures just sitting in water with a note "spectators, no reaction", and a green pH strip marked "7 neutral". COLUMN 2 headed "NH4Cl (strong acid + weak base)": the NH4+ ion drawn reacting with a water molecule via a curved arrow making H+, hand-lettered "NH4+ + H2O <=> NH4OH + H+", with a red pH strip marked "< 7 acidic". COLUMN 3 headed "CH3COONa (weak acid + strong base)": the CH3COO- ion drawn reacting with a water molecule making OH-, hand-lettered "CH3COO- + H2O <=> CH3COOH + OH-", with a blue pH strip marked "> 7 basic". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'The three salt types: NaCl (both ions spectators) stays neutral; NH₄Cl (the cation hydrolyses, releasing H⁺) turns acidic; CH₃COONa (the anion hydrolyses, releasing OH⁻) turns basic.'
      ),
      h.callout('remember', 'Hydrolysis Constant, Degree, and the pH Formulas',
        "The strength of a salt's hydrolysis is measured by a **hydrolysis constant** $K_h$, which links straight to the parent's $K_a$ or $K_b$ through $K_w$:\n\n" +
        "$$K_h = \\frac{K_w}{K_a} \\;\\text{(anion of a weak acid)}, \\qquad K_h = \\frac{K_w}{K_b} \\;\\text{(cation of a weak base)}$$\n\n" +
        "The **degree of hydrolysis** $h$ (the fraction of salt that reacts with water) follows the same square-root shape as the degree of ionisation:\n\n" +
        "$$h = \\sqrt{\\frac{K_h}{C}}$$\n\n" +
        "And the two pH formulas worth committing to memory:\n" +
        "- **Strong acid + weak base** (acidic): $\\;pH = 7 - \\tfrac{1}{2}\\,(pK_b + \\log C)$\n" +
        "- **Weak acid + strong base** (basic): $\\;pH = 7 + \\tfrac{1}{2}\\,(pK_a + \\log C)$"),
      h.reasoning('logical',
        "Three white powders are dissolved in separate beakers of pure water: $\\ce{KNO3}$ (from $\\ce{HNO3}$ and $\\ce{KOH}$), $\\ce{NH4Cl}$ (from $\\ce{HCl}$ and $\\ce{NH4OH}$), and $\\ce{CH3COONa}$ (from $\\ce{CH3COOH}$ and $\\ce{NaOH}$). Without measuring, predict whether each is neutral, acidic, or basic.",
        [
          "All three are neutral, because every salt comes from an acid and a base, which cancel out",
          "$\\ce{KNO3}$ neutral; $\\ce{NH4Cl}$ acidic; $\\ce{CH3COONa}$ basic — classify by the strong/weak parents and see which ion hydrolyses",
          "$\\ce{KNO3}$ acidic; $\\ce{NH4Cl}$ basic; $\\ce{CH3COONa}$ neutral",
          "All three are acidic, because dissolving any salt releases $\\ce{H+}$",
        ], 1,
        "$\\ce{KNO3}$ comes from a strong acid and a strong base, so both ions are spectators and the solution is neutral. $\\ce{NH4Cl}$ has the weak-base cation $\\ce{NH4+}$, which hydrolyses to give $\\ce{H+}$, so it is acidic. $\\ce{CH3COONa}$ has the weak-acid anion $\\ce{CH3COO-}$, which hydrolyses to give $\\ce{OH-}$, so it is basic. The trick every time is to spot which parent was weak and let that ion react.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Reading a Salt\'s pH',
        "- **Classify first, calculate second.** Name the parent acid and base, mark each strong or weak, and the answer often falls out before any formula.\n" +
        "- **The rule of the weak parent wins:** strong acid + strong base $\\rightarrow$ neutral; strong acid + weak base $\\rightarrow$ acidic (cation hydrolyses); weak acid + strong base $\\rightarrow$ basic (anion hydrolyses).\n" +
        "- **Spectators do nothing.** Ions from a strong parent ($\\ce{Na+}$, $\\ce{K+}$, $\\ce{Cl-}$, $\\ce{NO3-}$) just get hydrated. Do not write a hydrolysis step for them.\n" +
        "- **Formulas to bank:** $K_h = K_w/K_a$ or $K_w/K_b$, $\\;h = \\sqrt{K_h/C}$, and the two pH lines above. A wall of given $pK$ and $\\log$ values is often there to slow you down, so classify before you let it.\n" +
        "- **Classic trap:** $\\ce{NaCl}$ and other strong-acid–strong-base salts are exactly neutral. Do not invent a hydrolysis that gives them a pH off 7."),
      h.quiz([
        {
          question: "A solution of $\\ce{NH4Cl}$ in water is tested with pH paper. What reading do you expect, and why?",
          options: [
            "Exactly 7, because $\\ce{NH4Cl}$ is a salt and all salts are neutral",
            "Below 7 (acidic), because $\\ce{NH4+}$ comes from a weak base and hydrolyses to release $\\ce{H+}$",
            "Above 7 (basic), because $\\ce{Cl-}$ hydrolyses to release $\\ce{OH-}$",
            "Below 7, because $\\ce{Cl-}$ is the ion that reacts with water",
          ], correct_index: 1,
          explanation: "$\\ce{NH4Cl}$ is the salt of a strong acid ($\\ce{HCl}$) and a weak base ($\\ce{NH4OH}$). The $\\ce{Cl-}$ is a strong-acid spectator and stays put. The $\\ce{NH4+}$ came from the weak base, so it hydrolyses: $\\ce{NH4+ + H2O <=> NH4OH + H+}$, releasing $\\ce{H+}$ and making the solution acidic.",
        },
        {
          question: "Which salt gives a basic solution in water?",
          options: [
            "$\\ce{NaCl}$ (from $\\ce{HCl}$ + $\\ce{NaOH}$)",
            "$\\ce{NH4Cl}$ (from $\\ce{HCl}$ + $\\ce{NH4OH}$)",
            "$\\ce{CH3COONa}$ (from $\\ce{CH3COOH}$ + $\\ce{NaOH}$)",
            "$\\ce{KNO3}$ (from $\\ce{HNO3}$ + $\\ce{KOH}$)",
          ], correct_index: 2,
          explanation: "$\\ce{CH3COONa}$ is the salt of a weak acid ($\\ce{CH3COOH}$) and a strong base ($\\ce{NaOH}$). Its anion $\\ce{CH3COO-}$ hydrolyses: $\\ce{CH3COO- + H2O <=> CH3COOH + OH-}$, releasing $\\ce{OH-}$ and turning the solution basic. $\\ce{NaCl}$ and $\\ce{KNO3}$ are strong+strong, so neutral, and $\\ce{NH4Cl}$ is acidic.",
        },
        {
          question: "For the anion of a weak acid (e.g. $\\ce{CH3COO-}$), the hydrolysis constant is given by:",
          options: [
            "$K_h = K_w \\times K_a$",
            "$K_h = K_w / K_a$",
            "$K_h = K_a / K_w$",
            "$K_h = K_a \\times C$",
          ], correct_index: 1,
          explanation: "For the anion of a weak acid, the hydrolysis constant is $K_h = K_w / K_a$. A smaller $K_a$ (a weaker parent acid) means a larger $K_h$, so a weaker acid's salt hydrolyses more strongly and the solution is more basic. The degree of hydrolysis then follows as $h = \\sqrt{K_h / C}$.",
        },
      ]),
    ];
  },
};
