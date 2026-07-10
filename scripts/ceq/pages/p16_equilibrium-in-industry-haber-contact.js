// CEQ page 16 — Equilibrium in industry: Haber and Contact (NCERT §7.8.4-7.8.5).
// CHAPTER FINALE. Sub-topic: applying Le Chatelier to maximise yield.
//   Haber: N2(g) + 3H2(g) <=> 2NH3(g), dH < 0. Forward has fewer gas moles and releases
//   heat, so high pressure (~200 atm) and moderate temperature favour ammonia; but low T is
//   too slow, so a compromise ~500 C with an iron catalyst is used, and NH3 is removed by
//   liquefaction to pull the reaction forward.
//   Contact: 2SO2(g) + O2(g) <=> 2SO3(g), dH < 0, V2O5 catalyst; same optimum-conditions
//   reasoning (for making sulphuric acid).
// Theme: optimum conditions are a COMPROMISE between yield and rate.
// Voice: teacher-voice-profile + CEQ-exemplars C. HIS framing: the "low temperature"
// literalism trap — 500 C is not "low", it is RELATIVELY low, low for an industrial scale;
// and a catalyst is no help when K is exceedingly small (NCERT note).
// Finale: short wrap tying the chapter together + one-line bridge to Ionic Equilibrium.
// §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no triple-repetition, hedged "you".
module.exports = {
  page_number: 16,
  slug: 'equilibrium-in-industry-haber-contact',
  title: 'Equilibrium in Industry: Haber and Contact',
  subtitle: 'Bending equilibrium to make ammonia and sulphuric acid.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A large industrial reactor vessel drawn like a chemist sketched it, thick-walled to suggest high pressure, with pipes feeding nitrogen and hydrogen gas in from the left and a pipe of liquid ammonia draining out at the bottom right into a small tank. Faint hand-lettered notes "~500 C", "~200 atm", "Fe" near the vessel. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'The Reaction That Feeds Half the Planet',
        "The bread on your table traces back to one stubborn equilibrium. $\\ce{N2}$ and $\\ce{H2}$ would rather stay as they are than join into ammonia, yet the fertiliser that grows much of the world's food is ammonia. Engineers do not wait for the reaction to feel like cooperating. They use Le Chatelier's principle to push it where they want it, and that is what this whole chapter has been building toward."),
      h.text(
        "Everything so far has been about predicting which way an equilibrium moves. Industry asks the practical version of that question: how do you set up the conditions so the most product comes out for the lowest cost? The **Haber process** for ammonia is the classic answer.\n\n" +
        "$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)} \\quad \\Delta H = -92.4 \\text{ kJ mol}^{-1}$$\n\n" +
        "Two features of this reaction tell you how to push it. First, the forward direction goes from 4 moles of gas (1 of $\\ce{N2}$ plus 3 of $\\ce{H2}$) to 2 moles of gas, so **high pressure** favours ammonia. Industry runs it near **200 atm**. Second, the reaction is exothermic, so by the temperature rule from the last page a **low temperature** favours ammonia."
      ),
      h.heading('The compromise temperature', 'Explain why the operating temperature is a trade-off between yield and rate, not the temperature of best yield.'),
      h.text(
        "Here is where students get caught. A low temperature gives the best *yield*, but it also makes the reaction painfully slow. You could get a beautiful equilibrium mixture and have to wait days for it. Speed and yield pull in opposite directions, so engineers settle on a **compromise**: a temperature high enough for a usable rate, kept as low as that lets them, around **500 °C**, with an **iron catalyst** to speed things up.\n\n" +
        "Be careful with the word 'low' here. Do not read 500 °C as a low temperature in everyday terms. It is *relatively* low, low for an industrial furnace that could run far hotter. The catalyst earns its place because it brings equilibrium sooner without needing extra heat, and one more trick finishes the job: the ammonia is cooled and drained off as a liquid. Removing a product keeps pulling the reaction forward, so the leftover $\\ce{N2}$ and $\\ce{H2}$ are recycled back in."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D, drawn like a chemist sketched a process flow in a notebook. A thick-walled reactor vessel in the centre labelled "catalyst bed (Fe)". An arrow on the left feeds in a mixed stream hand-lettered "N2 + 3H2". Inside the vessel the reaction "N2 + 3H2 <=> 2NH3" is hand-lettered, with small notes "~500 C" and "~200 atm". An arrow leaves the bottom right into a small cooled tank labelled "liquid NH3 drained off". A dashed recycle arrow loops from the tank back to the inlet, hand-lettered "unreacted N2, H2 recycled". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'The Haber process: N₂ and H₂ pass over an iron catalyst at ~500 °C and ~200 atm; ammonia is cooled to a liquid and drained, and the unreacted gases are recycled.'
      ),
      h.text(
        "The **Contact process**, which makes the $\\ce{SO3}$ needed for sulphuric acid, runs on the same logic:\n\n" +
        "$$\\ce{2SO2(g) + O2(g) <=> 2SO3(g)} \\quad \\Delta H < 0$$\n\n" +
        "Again the forward direction cuts the number of gas moles (3 down to 2), so **high pressure** helps, and again it is exothermic, so a **moderate temperature** of about 500 °C is used rather than the very low one that pure yield would want. A **vanadium pentoxide ($\\ce{V2O5}$) catalyst** supplies the speed. The equilibrium for this one actually lies far toward $\\ce{SO3}$, with a very large $K$, but the uncatalysed reaction is so slow that the catalyst is what makes it practical."
      ),
      h.callout('exam_tip', 'JEE / NEET — Industrial Equilibria',
        "- **Haber:** $\\ce{N2 + 3H2 <=> 2NH3}$, $\\Delta H < 0$. High pressure (~200 atm) favours the side with fewer gas moles; low temperature favours the exothermic forward reaction; the real plant uses ~500 °C with an **iron** catalyst and liquefies out the $\\ce{NH3}$.\n" +
        "- **Contact:** $\\ce{2SO2 + O2 <=> 2SO3}$, $\\Delta H < 0$, **$\\ce{V2O5}$** catalyst, same high-pressure / moderate-temperature reasoning.\n" +
        "- **The big idea:** operating conditions are a **compromise between yield and rate**. Best yield wants low temperature; usable rate needs heat. The plant meets in the middle.\n" +
        "- **Classic trap:** do not call 500 °C a 'low temperature' in plain terms. It is low only *relative* to industrial scale. And a catalyst speeds a reaction up; it cannot help when $K$ is exceedingly small, because there is barely any product to reach."),
      h.reasoning('logical',
        "Looking at the Haber reaction, a student argues: since the reaction is exothermic, the plant should run at the lowest temperature possible to get the maximum yield of ammonia. Why does no industrial plant actually do this?",
        [
          "Because a low temperature would change the value of $K$ in the wrong direction",
          "Because at a low temperature the reaction is far too slow, so the plant compromises at ~500 °C with a catalyst",
          "Because high pressure already gives full yield, so temperature does not matter at all",
          "Because the iron catalyst only works above 1000 °C",
        ], 1,
        "A low temperature really does give the best equilibrium yield for this exothermic reaction. The problem is rate: at low temperature the reaction crawls, so the plant would wait days for that yield. The fix is a compromise temperature near 500 °C plus an iron catalyst for speed. Lowering the temperature does move $K$, but in the favourable direction for yield, so the first option misreads the trade-off.",
        2),
      h.text(
        "**Pulling the chapter together.** You started with the idea that most reactions stall partway in a dynamic balance, then learned to measure how far they go with $K$, to predict their direction by comparing $Q$ with $K$, and finally to push them around with Le Chatelier's principle. The Haber and Contact processes are where all of that pays off: a reluctant reaction bent into a useful one by choosing pressure, temperature, and a catalyst with care.\n\n" +
        "**Next: Ionic Equilibrium.** Every equilibrium in this chapter involved whole molecules. The next chapter takes the same tools into water, where acids, bases, and salts split into ions, and the balance between those ions decides whether a solution is sour, soapy, or neutral."
      ),
      h.quiz([
        {
          question: "In the Haber process $\\ce{N2 + 3H2 <=> 2NH3}$ ($\\Delta H < 0$), why is a moderately high temperature of about 500 °C used instead of a much lower one?",
          options: [
            "A lower temperature would give a smaller yield of ammonia",
            "A lower temperature gives a better yield but makes the reaction too slow, so 500 °C is a compromise",
            "Ammonia decomposes completely below 500 °C",
            "The high pressure only works at high temperature",
          ], correct_index: 1,
          explanation: "Because the reaction is exothermic, a lower temperature actually gives a higher equilibrium yield. The catch is that it also makes the rate impractically slow. The plant compromises at around 500 °C with a catalyst to get a workable rate, so the claim that a lower temperature lowers the yield is backwards.",
        },
        {
          question: "High pressure improves the yield in both the Haber and Contact processes because in each case the forward reaction:",
          options: [
            "produces a gas that escapes the vessel",
            "goes from more moles of gas to fewer moles of gas",
            "is endothermic and absorbs the extra pressure",
            "removes the catalyst from the mixture",
          ], correct_index: 1,
          explanation: "Haber goes from 4 moles of gas to 2, and Contact from 3 moles to 2. Raising the pressure pushes each equilibrium toward the side with fewer gas moles, which is the product side, so the yield improves. The shift has nothing to do with escaping gas or the catalyst.",
        },
        {
          question: "The Contact process uses a $\\ce{V2O5}$ catalyst even though the equilibrium for $\\ce{2SO2 + O2 <=> 2SO3}$ already lies far toward $\\ce{SO3}$. What does the catalyst provide?",
          options: [
            "A larger value of $K$, pushing the equilibrium even further toward $\\ce{SO3}$",
            "A faster rate, since the uncatalysed reaction is very slow despite the favourable equilibrium",
            "A higher yield by shifting the position of equilibrium",
            "Protection of the $\\ce{SO3}$ from decomposing back to $\\ce{SO2}$",
          ], correct_index: 1,
          explanation: "A large $K$ tells you the equilibrium favours $\\ce{SO3}$, but it says nothing about speed. The plain reaction is far too slow to be useful, so the $\\ce{V2O5}$ catalyst is there to raise the rate. A catalyst never changes $K$ or the position of equilibrium, which rules out the other options.",
        },
      ]),
    ];
  },
};
