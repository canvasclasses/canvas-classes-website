// CEQ page 5 — Physical equilibria: dissolution of solids and gases in liquids.
// NCERT §7.1.4-7.1.5 + Table 7.1. Solids: unsaturated->saturated->supersaturated;
// dissolution = crystallisation; radioactive-sugar proof of dynamic equilibrium.
// Gases: Henry's law (mass dissolved proportional to partial pressure); soda fizz;
// less gas dissolves as T rises. HIS analogy (CEQ-exemplars A): saturated solution
// = musical chairs (ten chairs, ten seated, identities swap, count stays ten).
// §5.X audited: no "Not X. It is Y." pairs, ≤1 em-dash/para, plain SVO.
module.exports = {
  page_number: 5,
  slug: 'physical-equilibria-dissolution',
  title: 'Dissolving Solids and Gases',
  page_type: 'lesson',
  subtitle: 'Saturated solutions and the fizz in a bottle.',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. On the left, a glass of water with a small heap of undissolved sugar crystals at the bottom and tiny dissolved dots rising into the liquid. On the right, a soda bottle just opened, with a stream of small CO2 bubbles fizzing up out of the neck. A faint balanced double-arrow drawn between the dissolved and undissolved states in each. Calm, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'The Sugar That Never Sits Still',
        "Stir sugar into water until no more will dissolve, and a little stays as crystals at the bottom. That bottom layer looks like leftover, sitting there doing nothing. It is doing plenty. Sugar is leaving those crystals and dissolving, while dissolved sugar is settling back onto them, at the same rate. The undissolved heap stays the same size, but the molecules in it keep changing."),
      h.text(
        "The second family of physical equilibria appears when something **dissolves** in a liquid. A solid like sugar dissolving in water, or a gas like carbon dioxide dissolving in a soft drink, settles into the same kind of two-way balance you saw with phase changes. The substance keeps crossing between the dissolved form and the undissolved form, and at equilibrium the crossings cancel out."
      ),
      h.heading('Solids in liquids', 'Distinguish unsaturated, saturated and supersaturated solutions, and see saturation as a dynamic balance.'),
      h.text(
        "Add sugar to water a little at a time. At first every spoonful vanishes, and the solution is **unsaturated**. Keep adding and you reach a point where no more will dissolve, with extra sugar resting undissolved at the bottom. The solution is now **saturated**, and the amount of solute it holds at that temperature is the **solubility** of sugar. Coax even more in by heating and then cooling carefully, and you get a **supersaturated** solution, which is unstable and dumps the excess at the slightest disturbance.\n\n" +
        "In a saturated solution the dissolved sugar and the undissolved sugar are in equilibrium. Sugar dissolves off the solid and dissolved sugar crystallises back onto it at the same rate:\n\n" +
        "$$\\text{Sugar (solid)} \\rightleftharpoons \\text{Sugar (in solution)}$$"
      ),
      h.callout('remember', 'A Saturated Solution Is a Game of Musical Chairs',
        "Think of musical chairs with ten chairs and ten people seated. One person gets up, and at once another sits down in a free chair. At every instant you count ten people seated, but they are never the same ten. A saturated solution works just like this. The amount of undissolved solid stays fixed, while the actual molecules sitting in the solid keep swapping with molecules from the solution. The number holds; the identities change."),
      h.text(
        "How do we know the molecules really keep swapping, instead of just sitting frozen once the count stops changing? Drop a little **radioactive sugar** into a saturated solution of ordinary sugar that already has undissolved crystals at the bottom. After a while, radioactivity shows up in the solid crystals too, even though the amount of undissolved solid never changed. The only way the radioactive label could reach the solid is if dissolving and crystallising never stopped. The balance is dynamic, just like the musical chairs."
      ),
      h.heading('Gases in liquids — Henry\'s law', 'State Henry\'s law and use it to explain the fizz of a soft drink and why warm drinks go flat faster.'),
      h.text(
        "A gas can dissolve in a liquid too, and it sets up the same balance: dissolved gas molecules escape back into the gas above, while gas molecules from above dissolve in:\n\n" +
        "$$CO_2(g) \\rightleftharpoons CO_2(\\text{in solution})$$\n\n" +
        "How much gas dissolves is governed by **Henry's law**: the mass of a gas that dissolves in a given amount of liquid is proportional to the partial pressure of that gas above the liquid. Press more gas onto the surface and more of it dissolves. A soft drink is bottled under a high pressure of $\\ce{CO2}$, so a lot of gas is forced into the liquid. Open the cap and the pressure above drops to the small amount of $\\ce{CO2}$ in ordinary air, so the liquid now holds far more gas than the new pressure allows. The excess escapes as fizz, and the drink slowly goes flat. Warming the drink lowers how much gas the liquid can hold, so a warm bottle loses its gas faster than a cold one.\n\n" +
        "Physical equilibria let you see the balance directly, in melting ice, a steady vapour pressure, or a fizzing bottle. Next we move to chemical equilibria, where reactants and products are different substances, and we will learn to put a number on how far the reaction has gone: the **equilibrium constant**."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two labelled panels side by side, science-notebook style with neat hand-lettering. PANEL 1 "saturated solution": a glass of water with a heap of undissolved solid crystals at the bottom, balanced arrows between the solid and the dissolved dots, one labelled "dissolution" and one "crystallisation", note "rates equal = saturated". PANEL 2 "gas in liquid (Henry\'s law)": a soda bottle with the cap off, CO2 bubbles streaming up out of the neck, small arrows showing dissolved CO2 leaving the liquid into the gas above, hand-lettered relation "mass of gas dissolved is proportional to partial pressure", note "open cap -> pressure drops -> gas escapes (fizz)". Clean, uncluttered, hand-lettered.',
        '16:9',
        'Left: in a saturated solution, dissolution and crystallisation run at equal rates. Right: Henry\'s law — the dissolved CO₂ matches the gas pressure above, so opening the bottle drops the pressure and the gas fizzes out.'
      ),
      h.reasoning('logical',
        "You open two identical soda bottles. One has been chilling in the fridge; the other has sat out in a warm room. Both were sealed the same way. The warm one erupts much more violently. Using Henry's law and the effect of temperature, why?",
        [
          "The warm bottle was sealed at a higher pressure than the cold one",
          "Warming lowers how much gas the liquid can hold, so the warm drink is already over-loaded with gas and dumps it the moment the pressure drops",
          "Cold liquids react chemically with $\\ce{CO2}$ and destroy it, leaving less to escape",
          "The warm bottle simply contains more liquid, so there is more to fizz",
        ], 1,
        "Both bottles were sealed under the same high pressure, so they started with the same dissolved gas. Warming the drink lowers the gas it can hold at any pressure, so the warm one is carrying more gas than it comfortably can. When the cap comes off and the pressure drops, that extra gas rushes out all at once. Temperature, not a different seal or a chemical reaction, is doing the work.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Dissolution Equilibria & Table 7.1',
        "- A **saturated solution** is a dynamic equilibrium: rate of dissolution equals rate of crystallisation, proven by the radioactive-sugar experiment.\n" +
        "- **Solubility** is the amount of solute in a saturated solution at a given temperature, and it is constant at that temperature.\n" +
        "- **Henry's law:** mass of gas dissolved $\\propto$ partial pressure of the gas above the liquid. Higher pressure dissolves more gas; higher temperature dissolves less.\n" +
        "- The four standard physical equilibria and what stays constant (NCERT **Table 7.1**):\n" +
        "  - liquid $\\rightleftharpoons$ vapour: **vapour pressure** constant at a given temperature\n" +
        "  - solid $\\rightleftharpoons$ liquid: **melting point** fixed at constant pressure\n" +
        "  - solid $\\rightleftharpoons$ solution: **solubility** constant at a given temperature\n" +
        "  - gas $\\rightleftharpoons$ dissolved gas: **$[\\text{gas in solution}] / [\\text{gas}]$** constant at a given temperature\n" +
        "- Every one of these is a **closed-system** dynamic equilibrium with constant measurable properties."),
      h.quiz([
        {
          question: "In a saturated sugar solution with undissolved crystals at the bottom, what is happening at equilibrium?",
          options: [
            "Dissolving has stopped, since the solution cannot hold any more sugar",
            "Only crystallisation continues, slowly pulling all the sugar out of solution",
            "The crystals at the bottom are completely inert and their molecules never move",
            "Sugar dissolves and crystallises at the same rate, so the undissolved amount stays fixed",
          ], correct_index: 3,
          explanation: "Saturation is a dynamic balance: dissolution and crystallisation run at equal rates, so the undissolved amount holds steady while molecules keep swapping. The radioactive-sugar experiment proves the swapping never stops, which rules out the crystals being inert.",
        },
        {
          question: "Henry's law states that the mass of a gas dissolved in a liquid is proportional to:",
          options: [
            "the partial pressure of the gas above the liquid",
            "the total volume of the liquid in the container",
            "the temperature of the liquid in degrees Celsius",
            "the surface area of contact in the container",
          ], correct_index: 0,
          explanation: "Henry's law ties the dissolved mass to the partial pressure of the gas above the liquid: more pressure forces in more gas. Temperature also affects solubility, but the law itself is the proportionality to partial pressure, not to temperature.",
        },
        {
          question: "A bottle of soda is left open and slowly goes 'flat'. The best explanation is that:",
          options: [
            "the dissolved $\\ce{CO2}$ chemically reacts with the water and disappears",
            "the $\\ce{CO2}$ pressure above the drink drops, so the liquid releases its excess gas",
            "the water steadily evaporates and carries all of the fizz away with it",
            "ordinary daylight breaks the dissolved $\\ce{CO2}$ down into other gases",
          ], correct_index: 1,
          explanation: "Opening the cap drops the $\\ce{CO2}$ pressure above the drink to the tiny amount in air, so by Henry's law the liquid now holds more gas than it can keep, and the excess leaves. The $\\ce{CO2}$ is not destroyed by a reaction or by daylight; it simply comes out of solution.",
        },
      ]),
    ];
  },
};
