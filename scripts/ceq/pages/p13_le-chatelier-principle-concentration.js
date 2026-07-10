// CEQ page 13 — Le Chatelier's Principle: Concentration.
// NCERT §7.8 (Le Chatelier statement + the Q-vs-K framing) and §7.8.1 (effect of
// concentration: added reactant/product is consumed by a net shift; removed one is
// replenished) including the "Effect of Concentration — an experiment" box:
// Fe3+ + SCN- <=> [Fe(SCN)]2+ (yellow / colourless / deep red). Adding KSCN or Fe3+
// deepens the red (forward); removing Fe3+ (oxalic acid) or SCN- (HgCl2) lightens it
// (backward). Ties to Q vs K: adding a reactant makes Q < K, so the reaction runs forward.
// NOTE: the flagship "Le Chatelier Lab" simulator is added to this page LATER — no
// simulation block here (it is not built yet); the page is complete without it.
// Voice: teacher-voice-profile + CEQ-exemplars A. HIS framing: the system as a
// complaint-handler that personifies the response ("the system says: too much has built
// up, cut it down"; "whatever increases, it reduces; whatever decreases, it boosts");
// adding a reactant = "you have a surplus, so spend it — push it into the reaction".
// §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no triple-repetition, hedged "you".
module.exports = {
  page_number: 13,
  slug: 'le-chatelier-principle-concentration',
  title: "Le Chatelier's Principle: Concentration",
  subtitle: 'Disturb an equilibrium and it pushes back.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A set of balanced kitchen scales drawn like a chemist sketched it, with a hand reaching in to drop an extra weight onto the left pan; the beam tilts, then small arrows show the system spending that weight to bring the beam level again. Beside the scales, three test tubes of a blood-red solution shade from pale to deep red. A faint hand-lettered equilibrium arrow runs underneath. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'The System That Pushes Back',
        "Drop a pinch of one reactant into a flask sitting quietly at equilibrium and the flask does not just absorb it. The reaction starts running again on its own, eating up most of what you added, until the amounts settle at a new steady level. You nudged it, and it pushed back. That single habit, worked out by Henri Le Chatelier in 1888, is the most useful idea in this whole chapter."),
      h.text(
        "Picture the equilibrium as a balance that wants to stay level. Change one condition on it and the system does not sit there. It shifts in whichever direction reduces the change you made. Said as a rule:\n\n" +
        "> When you change a condition on a system at equilibrium, the system moves so as to reduce that change.\n\n" +
        "It helps to hear the system talking. Whatever you increase, it works to bring down. Whatever you take away, it works to build back. The system is trying to keep itself balanced, and every prediction in this chapter comes from that one tendency. The condition you change can be the **concentration** of a substance, the **pressure**, or the **temperature**. This page handles concentration; the next handles pressure."
      ),
      h.heading('Adding or removing a substance', 'Predict the shift when a reactant or product is added or removed, and back it up with $Q$ versus $K$.'),
      h.text(
        "Take any reaction at equilibrium and add more of a reactant. You have just handed the system a surplus, so it spends it. The forward reaction speeds up and consumes the extra reactant, turning it into product, until a new equilibrium settles. Take a reactant away instead and the system is short, so it runs backward to replenish what you removed.\n\n" +
        "Products work the same way, mirror-image. Add product and the system pushes backward to use the surplus up. Remove product and it runs forward to make more. Four cases, one habit:\n" +
        "- Add a **reactant** $\\rightarrow$ shift **forward** (consume it)\n" +
        "- Remove a **reactant** $\\rightarrow$ shift **backward** (replenish it)\n" +
        "- Add a **product** $\\rightarrow$ shift **backward** (consume it)\n" +
        "- Remove a **product** $\\rightarrow$ shift **forward** (replenish it)\n\n" +
        "There is a cleaner way to see why, using the reaction quotient $Q$. At equilibrium $Q = K$. For $\\ce{H2 + I2 <=> 2HI}$, the quotient is\n\n" +
        "$$Q = \\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]}$$\n\n" +
        "Add more $\\ce{H2}$ and the bottom of that fraction grows, so $Q$ drops below $K$. Whenever $Q < K$ the reaction runs **forward** until $Q$ climbs back to $K$. That is the same forward shift Le Chatelier promised, now with a number behind it."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. The Fe3+ + SCN- experiment drawn as a row of test tubes in a notebook. A central test tube holds a steady blood-red solution, hand-lettered "Fe^3+ (yellow) + SCN^- (colourless) <=> [Fe(SCN)]^2+ (deep red)" above it. To its LEFT, an arrow labelled "add SCN- or Fe3+ (a reactant)" points to a test tube of much DEEPER red, with a small note "forward -> red deepens". To its RIGHT, an arrow labelled "remove Fe3+ (oxalic acid)" points to a test tube of much PALER, washed-out red, with a small note "backward -> red lightens". Neat hand-lettered labels, clean science-notebook feel, no glow.',
        '16:9',
        'Adding a reactant (SCN⁻ or Fe³⁺) drives the reaction forward and the red deepens; removing Fe³⁺ with oxalic acid drives it backward and the red fades.'
      ),
      h.callout('remember', 'The Blood-Red Experiment',
        "Mix iron(III) ions with thiocyanate ions and you get a deep blood-red complex:\n\n" +
        "$$\\ce{Fe^{3+}(aq) + SCN^{-}(aq) <=> [Fe(SCN)]^{2+}(aq)}$$\n\n" +
        "(yellow + colourless $\\rightarrow$ deep red). The colour is a live readout of how far the reaction has gone.\n" +
        "- **Add $\\ce{SCN^-}$** (or $\\ce{Fe^{3+}}$): you added a reactant, so the system runs forward and the red **deepens**.\n" +
        "- **Add oxalic acid**: it locks up $\\ce{Fe^{3+}}$ as $\\ce{[Fe(C2O4)3]^{3-}}$, removing a reactant, so the system runs backward and the red **fades**.\n" +
        "- **Add $\\ce{HgCl2}$**: it removes $\\ce{SCN^-}$, again backward, again **fades**."),
      h.reasoning('logical',
        "A flask of the blood-red $\\ce{Fe^{3+} + SCN^- <=> [Fe(SCN)]^{2+}}$ equilibrium is split into three identical tubes. To tube 1 you add a few drops of $\\ce{KSCN}$ solution. From tube 2 you remove $\\ce{Fe^{3+}}$ by adding oxalic acid. Tube 3 is left alone. Rank the three by how deep their red colour becomes.",
        [
          "All three end up the same shade, because Le Chatelier's principle only changes the rate, not the final colour",
          "Tube 1 deepest, tube 3 in the middle, tube 2 palest — adding a reactant drives it forward, removing one drives it backward",
          "Tube 2 deepest, because removing $\\ce{Fe^{3+}}$ leaves more $\\ce{SCN^-}$ free to make the red complex",
          "Tube 1 palest, because adding $\\ce{KSCN}$ dilutes the red complex already present",
        ], 1,
        "Adding $\\ce{KSCN}$ feeds in more of the reactant $\\ce{SCN^-}$, so tube 1 shifts forward and makes the most red complex. Oxalic acid pulls $\\ce{Fe^{3+}}$ out of play, so tube 2 shifts backward and loses red. Tube 3, untouched, sits between them. The colour tracks the shift, not the dilution, which is why the 'dilutes the red' guess fails.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Concentration Shifts',
        "- **The reflex:** added substance gets consumed, removed substance gets replenished. Add a reactant or remove a product $\\rightarrow$ **forward**. Add a product or remove a reactant $\\rightarrow$ **backward**.\n" +
        "- **Back it with $Q$ vs $K$.** Adding a reactant lowers $Q$ below $K$, and $Q < K$ always means a forward shift. This is the safe move when the wording is twisted.\n" +
        "- **Industrial use:** in ammonia manufacture the $\\ce{NH3}$ is liquefied and pulled out as it forms; in lime production the $\\ce{CO2}$ is swept out of the kiln. Removing a product keeps the reaction driving forward.\n" +
        "- **Classic trap:** a shift only moves where the equilibrium sits. It does not change $K_c$. $K_c$ moves only when the temperature changes."),
      h.quiz([
        {
          question: "For $\\ce{H2(g) + I2(g) <=> 2HI(g)}$ at equilibrium, more $\\ce{H2}$ is added at constant temperature. What happens?",
          options: [
            "The reaction shifts forward, consuming some of the added $\\ce{H2}$ and making more $\\ce{HI}$",
            "The reaction shifts backward, breaking down $\\ce{HI}$ into $\\ce{H2}$ and $\\ce{I2}$",
            "Nothing shifts, because adding a reactant cannot disturb an equilibrium",
            "The value of $K_c$ increases to absorb the extra $\\ce{H2}$",
          ], correct_index: 0,
          explanation: "Adding $\\ce{H2}$ is adding a reactant, so the system spends the surplus by running forward and making more $\\ce{HI}$. In $Q$ terms, the larger $[\\ce{H2}]$ pushes $Q$ below $K$, which forces a forward shift. $K_c$ itself stays fixed because the temperature is unchanged.",
        },
        {
          question: "In the equilibrium $\\ce{Fe^{3+}(aq) + SCN^-(aq) <=> [Fe(SCN)]^{2+}(aq)}$, oxalic acid is added and it removes $\\ce{Fe^{3+}}$. The red colour:",
          options: [
            "deepens, because removing $\\ce{Fe^{3+}}$ makes more complex",
            "fades, because the system shifts backward to replenish the lost $\\ce{Fe^{3+}}$",
            "stays exactly the same, since only a reactant was removed",
            "first deepens, then disappears completely",
          ], correct_index: 1,
          explanation: "Oxalic acid pulls a reactant ($\\ce{Fe^{3+}}$) out of the mixture. The system responds by running backward to replenish it, which breaks down the red $\\ce{[Fe(SCN)]^{2+}}$ complex, so the colour fades. Removing a reactant drives the reaction backward, the opposite of adding one.",
        },
        {
          question: "Which change drives a reaction at equilibrium in the forward direction?",
          options: [
            "Adding a product",
            "Removing a reactant",
            "Removing a product",
            "Adding a catalyst",
          ], correct_index: 2,
          explanation: "Removing a product leaves the system short on the product side, so it runs forward to replenish it. Adding a product or removing a reactant both push it backward, and a catalyst speeds both directions equally without shifting where the equilibrium sits.",
        },
      ]),
    ];
  },
};
