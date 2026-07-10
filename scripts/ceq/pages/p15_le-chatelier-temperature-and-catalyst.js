// CEQ page 15 — Le Chatelier: temperature and catalyst (NCERT §7.8.4, §7.8.5).
// Sub-topic: temperature is the one change that changes K itself. Treat heat as a
// participant — endothermic: T up shifts forward, K up; exothermic: T up shifts
// backward, K down. Van't Hoff log(K2/K1) = dH/2.303R (1/T1 - 1/T2); log K vs 1/T
// straight line (exo positive slope, endo negative). Catalyst speeds forward and
// backward equally, so equilibrium arrives sooner but its position and K are unchanged.
// Worked illustration: the NCERT NO2(brown)/N2O4(colourless), dH<0 tube experiment
// (cold => colourless, hot => brown).
// Voice: teacher-voice-profile + CEQ-exemplars A. HIS analogies: heat with moods
// (endothermic "asking for heat — give it heat and it happily goes forward"; exothermic
// "raise the temperature and it gets annoyed and goes backward"); catalyst = the bus vs
// your own car to the same shop (the car gets you there sooner, the shop has not moved).
// §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no triple-repetition, hedged "you".
module.exports = {
  page_number: 15,
  slug: 'le-chatelier-temperature-and-catalyst',
  title: "Le Chatelier's Principle: Temperature and Catalyst",
  subtitle: 'Heat is a reactant too — and why a catalyst changes nothing.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. On the left, a sealed glass tube standing in a beaker of crushed ice, the gas inside pale and almost colourless. On the right, an identical sealed tube standing in a beaker of steaming hot water, the gas inside a deep reddish brown. Between the two tubes a faint hand-lettered reaction "2NO2 (brown) <=> N2O4 (colourless)" and a small note "warm it and the colour comes back". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'The Tube That Reads the Temperature',
        "Seal some brown $\\ce{NO2}$ gas in a tube and drop it into ice water. The brown fades almost to nothing as the gas pairs up into colourless $\\ce{N2O4}$. Lift the same tube into hot water and the brown floods back. The colour is reporting the temperature, because temperature is the one change that actually moves where this equilibrium sits."),
      h.text(
        "Pressure and concentration shift *where* an equilibrium sits, but they leave the value of $K$ untouched. Temperature is the change that is different. Change the temperature and you change the value of $K$ itself.\n\n" +
        "The clean way to think about this is to put heat into the equation as if it were an ordinary participant. For an **endothermic** reaction, heat is absorbed, so write it on the reactant side:\n\n" +
        "$$\\text{heat} + \\ce{A + B <=> 2C} \\quad (\\Delta H > 0)$$\n\n" +
        "The reaction is asking for heat to go forward. Give it heat, by raising the temperature, and it happily goes forward. Products build up, so **$K$ increases**.\n\n" +
        "For an **exothermic** reaction, heat is released, so write it on the product side:\n\n" +
        "$$\\ce{A + B <=> 2C} + \\text{heat} \\quad (\\Delta H < 0)$$\n\n" +
        "Now extra heat is a product already piled up. Raise the temperature and the reaction gets annoyed and goes backward to use that heat up. Reactants come back, so **$K$ decreases**."
      ),
      h.heading('Watching it happen: the brown tube', 'Use the NO₂/N₂O₄ colour change to read which way temperature pushes an exothermic equilibrium.'),
      h.text(
        "The pairing of brown nitrogen dioxide into colourless dinitrogen tetroxide is exothermic:\n\n" +
        "$$\\ce{2NO2(g) <=> N2O4(g)} \\quad \\Delta H = -57.2 \\text{ kJ mol}^{-1}$$\n\n" +
        "Put the tube in **ice water** and you are cooling an exothermic reaction. The system answers by making more of the heat-releasing product, so it runs forward toward $\\ce{N2O4}$. More colourless $\\ce{N2O4}$ means the brown fades. Put the tube in **hot water** and you are heating it, so it runs backward toward $\\ce{NO2}$ and the brown deepens. The same reasoning explains the cobalt experiment NCERT pairs with it: $\\ce{[Co(H2O)6]^{2+}}$ is pink and $\\ce{[CoCl4]^{2-}}$ is blue, and warming the endothermic mixture drives it toward the blue side."
      ),
      h.text(
        "There is also a number behind the colours. Because $K$ varies with temperature in a fixed way, two values of $K$ at two temperatures are linked by the **van't Hoff relation**:\n\n" +
        "$$\\log\\frac{K_2}{K_1} = \\frac{\\Delta H}{2.303\\,R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$\n\n" +
        "Rearranged, $\\log K$ plotted against $1/T$ is a straight line. The slope is $-\\Delta H / 2.303R$, so an **exothermic** reaction ($\\Delta H < 0$) gives a line with a **positive slope**, and an **endothermic** reaction ($\\Delta H > 0$) gives a **negative slope**. If a problem hands you two temperatures and asks how $K$ changes, this relation is the tool."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D, drawn like a chemist sketched it in a notebook. Two panels side by side. LEFT panel: two sealed glass test tubes. The first stands in a beaker of crushed ice and holds pale almost-colourless gas, hand-lettered "cold = colourless N2O4". The second stands in a beaker of steaming hot water and holds deep reddish-brown gas, hand-lettered "hot = brown NO2". The reaction "2NO2 (brown) <=> N2O4 (colourless), dH < 0" hand-lettered above them. RIGHT panel: a small line graph, vertical axis hand-lettered "log K", horizontal axis hand-lettered "1/T". One straight line sloping upward to the right labelled "exothermic: positive slope". Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'Cooling the exothermic NO₂ pairing drives it to colourless N₂O₄; heating it brings the brown back. On a log K vs 1/T plot an exothermic reaction gives a positive slope.'
      ),
      h.reasoning('logical',
        "The synthesis $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ is exothermic ($\\Delta H < 0$). A student wants more ammonia, so they raise the temperature, reasoning that hotter always means more product. What actually happens to the amount of $\\ce{NH3}$ and to $K$?",
        [
          "Both the amount of $\\ce{NH3}$ and $K$ increase, because heating always pushes a reaction forward",
          "The reaction shifts backward and $K$ decreases, so raising the temperature lowers the ammonia yield",
          "The amount of $\\ce{NH3}$ rises but $K$ stays the same, because temperature never changes $K$",
          "Nothing changes, because $\\ce{NH3}$ is the only gas that matters",
        ], 1,
        "Treat the released heat as a product: $\\ce{N2 + 3H2 <=> 2NH3} + \\text{heat}$. Adding heat by raising the temperature pushes an exothermic reaction backward, so the ammonia breaks up and the yield drops. Temperature is also the one change that moves $K$, and for an exothermic reaction $K$ decreases as $T$ rises. This is exactly why ammonia is not made at the highest possible temperature.",
        2),
      h.heading('Why a catalyst changes nothing here', 'Explain that a catalyst speeds both directions equally, so it changes the time to equilibrium but not its position or K.'),
      h.text(
        "A **catalyst** lowers the energy barrier for the reaction, and it lowers it by the same amount for the forward and the backward directions. Both reactions speed up together, so the rates still become equal at the same set of concentrations as before.\n\n" +
        "Picture two ways to reach the same shop. You can take the bus and get there in two hours, or drive your own car and get there in one. The car gets you there sooner, but the shop's location has not moved. A catalyst is the car: equilibrium arrives sooner, yet it sits in exactly the same place, with the same value of $K$ and the same amounts of everything. A catalyst never appears in the balanced equation or in the $K$ expression."
      ),
      h.callout('exam_tip', 'JEE / NEET — Temperature and Catalyst',
        "- **Temperature is the only change that changes $K$.** Concentration and pressure shift the position; they leave $K$ alone.\n" +
        "- **Endothermic** ($\\Delta H > 0$): $T$ up shifts forward, $K$ **increases**. **Exothermic** ($\\Delta H < 0$): $T$ up shifts backward, $K$ **decreases**. Put heat in the equation and apply Le Chatelier as if it were a reactant or product.\n" +
        "- **Van't Hoff:** $\\log\\frac{K_2}{K_1} = \\frac{\\Delta H}{2.303R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$. Trigger: two temperatures given with one of $K_1$, $K_2$, $\\Delta H$ missing. On a $\\log K$ vs $1/T$ graph, exothermic gives a **positive** slope, endothermic a **negative** one.\n" +
        "- **A catalyst changes only the time** to reach equilibrium. It does not change the position, the value of $K$, or the amount of product. **Classic trap:** an option claiming a catalyst raises the yield is wrong."),
      h.quiz([
        {
          question: "For an exothermic reaction at equilibrium, raising the temperature will:",
          options: [
            "shift the reaction forward and increase $K$",
            "shift the reaction backward and decrease $K$",
            "shift the reaction backward but leave $K$ unchanged",
            "have no effect on either the position or $K$",
          ], correct_index: 1,
          explanation: "Write the released heat as a product. Adding heat by heating the system pushes an exothermic reaction backward, and for an exothermic reaction $K$ falls as the temperature rises. Temperature is the one change that moves $K$, so the option leaving $K$ unchanged is wrong.",
        },
        {
          question: "Adding a catalyst to a reaction that has reached equilibrium will:",
          options: [
            "increase the amount of product formed at equilibrium",
            "make equilibrium arrive sooner without changing its position or $K$",
            "shift the equilibrium toward the side with fewer moles",
            "change the value of $K$ in the same way a temperature rise would",
          ], correct_index: 1,
          explanation: "A catalyst speeds the forward and backward reactions by the same amount, so equilibrium is reached faster but lands in the same place. It does not appear in the $K$ expression, so the position, the amount of product, and $K$ are all unchanged.",
        },
        {
          question: "On a graph of $\\log K$ against $1/T$, an endothermic reaction gives a line with:",
          options: [
            "a positive slope",
            "a negative slope",
            "zero slope (a horizontal line)",
            "a slope that depends on the starting amounts",
          ], correct_index: 1,
          explanation: "The slope of the $\\log K$ vs $1/T$ line is $-\\Delta H / 2.303R$. For an endothermic reaction $\\Delta H$ is positive, so the slope is negative. An exothermic reaction, with negative $\\Delta H$, gives the positive slope instead.",
        },
      ]),
    ];
  },
};
