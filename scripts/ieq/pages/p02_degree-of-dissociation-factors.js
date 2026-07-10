// IEQ page 2 — "Degree of Dissociation and What Changes It".
// Sub-topic: alpha = fraction of one mole that ionises; alpha = (ionised
// molecules)/(total molecules). Four factors (founder notes pp 3-4):
// nature of electrolyte (strong->1, weak->small), nature of solvent (higher
// dielectric constant -> higher alpha), dilution (more dilute -> higher alpha),
// temperature (higher T -> higher alpha). Source: founder notes p3-4 ("Value of
// alpha depends on" list). §5.X audited: no "Not X. It is Y." pairs, no banned
// stacked metaphors, <=1 em-dash/para, second person, say-it-once.
module.exports = {
  page_number: 2,
  slug: 'degree-of-dissociation-factors',
  page_type: 'lesson',
  title: 'Degree of Dissociation and What Changes It',
  subtitle: 'How much of a weak electrolyte actually splits.',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A single beaker of weak-acid solution drawn in cross-section: most of the contents are whole undivided HA molecules drawn as small paired blobs, and only a handful have come apart into separated + and - ion dots scattered among them. A faint hand-lettered fraction "ionised / total = alpha" floats to one side with a small bracket pointing at the few separated ions. Calm science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'In Vinegar, Most of the Acid Stays Whole',
        "Vinegar is a solution of acetic acid, and it tastes and acts sour. Yet at everyday concentrations fewer than one acetic-acid molecule in twenty has actually broken into ions. The other nineteen are floating around whole and uncharged. The sourness you taste comes from that small ionised slice doing all the work, while the bulk of the acid sits in reserve."),
      h.text(
        "For a strong electrolyte the question of how much splits is dull, because nearly all of it does. For a weak electrolyte it is the central question, and we measure it with the **degree of dissociation**, $\\alpha$.\n\n" +
        "$\\alpha$ is the **fraction of one mole** of the electrolyte that has broken into ions under the given conditions:\n\n" +
        "$$\\alpha = \\frac{\\text{number of ionised molecules}}{\\text{total number of molecules}}$$\n\n" +
        "If you start with one mole and 0.2 mole of it ionises, then $\\alpha = 0.2$. A strong electrolyte has $\\alpha$ close to 1; a weak one has a small $\\alpha$. The same electrolyte can show different values of $\\alpha$ in different conditions, so the next question is what nudges it up or down."
      ),
      h.heading('The four things that change α', 'Predict how the degree of dissociation responds to the electrolyte, the solvent, dilution and temperature.'),
      h.text(
        "Four factors decide where $\\alpha$ lands for a given electrolyte:\n\n" +
        "1. **Nature of the electrolyte.** This sets the baseline. A strong electrolyte ionises almost fully, so $\\alpha \\approx 1$. A weak one ionises only partly, so $\\alpha$ stays small. The electrolyte itself is the first thing that decides how far it can go.\n" +
        "2. **Nature of the solvent.** A solvent with a higher **dielectric constant** screens the pull between the freed ions more strongly, so they separate more easily. Higher dielectric constant raises $\\alpha$. Water, with its dielectric constant near 80, is far better at this than a low-dielectric solvent.\n" +
        "3. **Dilution.** Add more water and you give the ions more room to stay apart instead of recombining. As concentration falls, $\\alpha$ rises. Dilute the solution and a larger fraction ionises.\n" +
        "4. **Temperature.** Heating supplies energy that helps more molecules break apart, so $\\alpha$ rises with temperature.\n\n" +
        "Three of these four push $\\alpha$ up: a better solvent, more dilution, and more heat. Only a higher concentration pushes it back down."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Centre of the page: a hand-drawn semicircular dial gauge labelled "alpha" with its scale running from 0 on the left to 1 on the right and a needle sitting partway up, science-notebook style. Four labelled arrows feed into the dial from around it, each hand-lettered: "weaker -> stronger electrolyte (raises alpha)", "higher dielectric solvent (raises alpha)", "more dilution (raises alpha)", "higher temperature (raises alpha)", and one short down-arrow on the opposite side labelled "higher concentration (lowers alpha)". Neat hand-lettering, clean and uncluttered.',
        '16:9',
        'The degree of dissociation α reads from 0 to 1. A stronger electrolyte, a higher-dielectric solvent, more dilution and more heat all push α up; raising the concentration pushes it back down.'
      ),
      h.reasoning('logical',
        "You have a weak acid at 1 M and you want a larger fraction of it to ionise, without changing the acid or the temperature. What should you do, and why does it work?",
        [
          "Add more of the same acid to make it more concentrated — more acid means more ions",
          "Add water to dilute it — at lower concentration the freed ions are less likely to recombine, so α rises",
          "Cool the solution down — lower temperature always increases ionisation",
          "Nothing can change α once the acid and temperature are fixed",
        ], 1,
        "Diluting lowers the concentration, which gives the ions more room and makes them less likely to find each other and recombine, so the fraction that stays ionised goes up. Adding more acid does the opposite by raising concentration, and cooling lowers $\\alpha$ rather than raising it. With the acid and temperature held fixed, dilution is the lever that increases $\\alpha$.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Degree of Dissociation',
        "- $\\alpha = \\dfrac{\\text{ionised molecules}}{\\text{total molecules}}$ — a fraction between 0 and 1. Strong electrolyte: $\\alpha \\approx 1$. Weak electrolyte: $\\alpha$ small.\n" +
        "- **Four factors and their direction:**\n" +
        "  - nature of electrolyte: strong $\\Rightarrow \\alpha \\to 1$, weak $\\Rightarrow \\alpha$ small\n" +
        "  - higher dielectric-constant solvent $\\Rightarrow \\alpha \\uparrow$\n" +
        "  - dilution (lower concentration) $\\Rightarrow \\alpha \\uparrow$\n" +
        "  - higher temperature $\\Rightarrow \\alpha \\uparrow$\n" +
        "- **Memory hook:** only **concentration** pushes $\\alpha$ down. The other three levers all push it up.\n" +
        "- The dilution effect is the one to remember, because the next page turns it into an exact law ($\\alpha = \\sqrt{K_a / C}$)."),
      h.quiz([
        {
          question: "The degree of dissociation α of an electrolyte is defined as:",
          options: [
            "the total number of molecules dissolved in the solution",
            "the fraction of the dissolved electrolyte that has broken into ions",
            "the number of ions produced by one molecule on full ionisation",
            "the mass of electrolyte that dissolves per litre of water",
          ], correct_index: 1,
          explanation: "α is a fraction: ionised molecules divided by total molecules. It is not a count of molecules or of ions-per-formula, and it is not a solubility. A value of 0.2 means one-fifth of the electrolyte has ionised.",
        },
        {
          question: "Which change will DECREASE the degree of dissociation of a weak acid?",
          options: [
            "diluting the solution with more water",
            "raising the temperature",
            "increasing the concentration of the acid",
            "switching to a solvent with a higher dielectric constant",
          ], correct_index: 2,
          explanation: "Raising the concentration crowds the ions and makes them recombine more readily, so α falls. Dilution, more heat, and a higher-dielectric solvent all push α up — only increasing concentration pushes it down.",
        },
        {
          question: "Two solvents are tested with the same weak electrolyte. Solvent X has a high dielectric constant; solvent Y has a low one. The electrolyte will ionise more in:",
          options: [
            "solvent Y, because a low dielectric constant frees the ions",
            "both equally, since the solvent has no effect on α",
            "neither, because only temperature changes α",
            "solvent X, because a high dielectric constant screens the ion–ion attraction so the ions stay apart",
          ], correct_index: 3,
          explanation: "A high dielectric constant weakens the attraction between the separated ions, so they are less likely to snap back together and a larger fraction stays ionised. The solvent clearly does affect α — water's high dielectric constant near 80 is exactly why it ionises electrolytes so well.",
        },
      ]),
    ];
  },
};
