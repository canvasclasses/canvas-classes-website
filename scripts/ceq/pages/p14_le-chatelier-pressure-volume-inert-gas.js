// CEQ page 14 — Le Chatelier's Principle: Pressure, Volume and Inert Gas.
// NCERT §7.8.2 (pressure change: a gaseous equilibrium shifts toward the side with
// fewer gas moles when pressure rises / volume falls, and vice versa; no shift when both
// sides have equal gas moles; solids/liquids ignored) and §7.8.3 (inert gas at constant
// volume: partial pressures of the reacting gases unchanged, so no shift; at constant
// pressure it acts like a volume increase, shifting toward more gas moles).
// Voice: teacher-voice-profile + CEQ-exemplars A + C. HIS framing: the soda can bursting
// in the freezer — ice needs more volume, so high pressure drives the system toward the
// lower-volume (higher-density) side. HIS trap (C): inert gas at constant volume — the
// reflex is "pressure rose, so shift!", but n, R, T, V of the reacting gases are all
// unchanged, so their partial pressures are untouched and nothing shifts. The mid-page
// reasoning_prompt IS exactly this trap.
// §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no triple-repetition, hedged "you".
module.exports = {
  page_number: 14,
  slug: 'le-chatelier-pressure-volume-inert-gas',
  title: "Le Chatelier's Principle: Pressure, Volume and Inert Gas",
  subtitle: 'Squeeze a gas equilibrium and it moves to fewer molecules.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A glass cylinder fitted with a piston, drawn like a chemist sketched it, with a hand pressing the piston down so the gas inside is compressed; tiny molecule dots inside crowd together and small arrows show pairs joining into single particles. To one side, a fizzy drink can sits in a frosty freezer with a few cracks on its surface. A faint hand-lettered equilibrium arrow runs beneath. Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Why a Can Bursts in the Freezer',
        "Leave a sealed fizzy drink in the freezer and it can split the can open. Water expands as it turns to ice, so freezing forces the contents to take up more room than the can allows. That same instinct, systems moving to take up less room when squeezed and more room when freed, is exactly how a gas equilibrium answers a change in pressure."),
      h.text(
        "Pressure only matters when **gases** are involved, and only when the two sides have a different number of gas molecules. Solids and liquids barely change volume when you press on them, so you ignore them when counting.\n\n" +
        "Here is the rule. Raise the pressure on a gaseous equilibrium, by pushing a piston in to shrink the volume, and the system shifts toward the side with **fewer gas molecules**. Fewer molecules take up less room, which is how the system eases the squeeze. Drop the pressure, by pulling the piston out, and it shifts toward the side with **more gas molecules** to fill the extra space. If both sides have the **same** number of gas molecules, pressure changes nothing, because neither side offers relief."
      ),
      h.heading('Counting moles on each side', 'Use the gas-mole count to predict which way pressure pushes an equilibrium.'),
      h.text(
        "Look at the ammonia synthesis:\n\n" +
        "$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$$\n\n" +
        "The left has $1 + 3 = 4$ gas molecules; the right has $2$. Press down on this mixture and the system moves to the side with fewer molecules, which is the right, so it makes more $\\ce{NH3}$. This is one reason ammonia plants run at high pressure.\n\n" +
        "Now compare $\\ce{H2(g) + I2(g) <=> 2HI(g)}$: two molecules on the left, two on the right. The counts match, so squeezing this one does nothing. And the soda-can idea carries over to solids. For\n\n" +
        "$$\\ce{C(s) + CO2(g) <=> 2CO(g)}$$\n\n" +
        "you count only the gases: one $\\ce{CO2}$ on the left, two $\\ce{CO}$ on the right. Raise the pressure and the system runs backward, toward the single gas molecule. The carbon, being a solid, never enters the count."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two panels drawn in a notebook. MAIN panel: a gas cylinder with a piston pushed DOWN, compressing the gas; inside, hand-lettered "N2 + 3H2 <=> 2NH3" with "4 gas moles" on the left and "2 gas moles" on the right, and a bold arrow pointing RIGHT labelled "high pressure -> fewer moles". Tiny molecule dots show three small particles pairing into two larger ones. SMALL side panel boxed off to the right: a sealed box of gas with an extra inert-gas atom labelled "X" dropped in, split into two cases hand-lettered "const V: no shift" and "const P: volume grows -> shifts to MORE moles". Neat hand-lettered labels, clean science-notebook feel, no glow.',
        '16:9',
        'Compress N₂ + 3H₂ ⇌ 2NH₃ and it shifts to the side with fewer gas moles (right). Inset: an inert gas does nothing at constant volume, but at constant pressure it acts like a volume increase.'
      ),
      h.reasoning('logical',
        "The equilibrium $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ sits in a sealed, rigid steel vessel. You pump in argon, an inert gas that takes no part in the reaction, keeping the **volume constant**. The total pressure inside the vessel rises. A student says: 'Pressure went up, and this reaction shifts to fewer moles under pressure, so it must move forward to make more $\\ce{NH3}$.' Are they right?",
        [
          "Yes — total pressure rose, so the equilibrium shifts toward the fewer-moles side and makes more $\\ce{NH3}$",
          "No — at constant volume the $n$, $R$, $T$ and $V$ of each reacting gas are unchanged, so their partial pressures are untouched and the equilibrium does not shift at all",
          "Yes, but it shifts backward instead, because argon dilutes the ammonia",
          "No — the argon reacts with the $\\ce{N2}$, so $K_c$ changes and the system moves forward",
        ], 1,
        "This is the classic trap. The total pressure does rise, but a shift depends on the **partial pressures of the reacting gases**, and those depend on $n$, $R$, $T$ and $V$, none of which changed for $\\ce{N2}$, $\\ce{H2}$ or $\\ce{NH3}$. The argon just sits there adding to the total. Since the reacting gases feel no change, the equilibrium is not disturbed and nothing moves. The reflex 'pressure rose, so shift' is what the examiner is fishing for.",
        3),
      h.text(
        "That trap is worth stating as its own rule. Adding an inert gas at **constant volume** changes nothing, because the partial pressures of the reacting gases stay put. At **constant pressure**, though, the story flips. To keep the total pressure fixed after you add the inert gas, the volume has to grow. A bigger volume thins out the reacting gases, exactly like pulling the piston out, so the system now behaves as if the pressure dropped and shifts toward the side with **more gas molecules**."
      ),
      h.callout('exam_tip', 'JEE / NEET — Pressure, Volume and Inert Gas',
        "- **Pressure $\\uparrow$ (volume $\\downarrow$)** $\\rightarrow$ shift to **fewer gas moles**. **Pressure $\\downarrow$ (volume $\\uparrow$)** $\\rightarrow$ shift to **more gas moles**. Equal moles on both sides $\\rightarrow$ no shift.\n" +
        "- **Count gases only.** Solids and liquids never enter the mole count for a pressure effect.\n" +
        "- **Inert gas at constant volume $\\rightarrow$ no shift.** The partial pressures of the reacting gases are unchanged. This is the most-tested trap in the topic.\n" +
        "- **Inert gas at constant pressure $\\rightarrow$ acts like a volume increase**, so the system shifts toward the side with more gas moles.\n" +
        "- A pressure change moves where the equilibrium sits, but it does not change $K_c$ or $K_p$. Only temperature changes those."),
      h.quiz([
        {
          question: "For $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ at equilibrium, the volume of the container is halved. Which way does the reaction shift?",
          options: [
            "Forward, toward $\\ce{NH3}$, because the right side has fewer gas molecules",
            "Backward, toward $\\ce{N2}$ and $\\ce{H2}$, because they were added",
            "It does not shift, because pressure has no effect on this reaction",
            "Forward, but only because $K_c$ increases when the volume drops",
          ], correct_index: 0,
          explanation: "Halving the volume doubles the pressure, and the system eases that by moving to the side with fewer gas molecules. The left has 4 gas molecules and the right has 2, so it shifts forward toward $\\ce{NH3}$. $K_c$ stays fixed because the temperature did not change.",
        },
        {
          question: "An inert gas is added to the equilibrium $\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$ at constant volume. The effect on the position of equilibrium is:",
          options: [
            "It shifts forward, because the total pressure has risen",
            "It shifts backward, toward the single $\\ce{PCl5}$ molecule",
            "There is no shift, because the partial pressures of the reacting gases are unchanged",
            "It shifts forward, because the inert gas lowers $K_c$",
          ], correct_index: 2,
          explanation: "At constant volume the inert gas adds to the total pressure but leaves the partial pressures of $\\ce{PCl5}$, $\\ce{PCl3}$ and $\\ce{Cl2}$ untouched, since their $n$, $R$, $T$ and $V$ are all the same. With the reacting gases unaffected, the equilibrium does not move. The 'total pressure rose, so shift' reasoning is the trap.",
        },
        {
          question: "For which reaction does a change in pressure have no effect on the position of equilibrium?",
          options: [
            "$\\ce{2SO2(g) + O2(g) <=> 2SO3(g)}$",
            "$\\ce{H2(g) + I2(g) <=> 2HI(g)}$",
            "$\\ce{N2O4(g) <=> 2NO2(g)}$",
            "$\\ce{C(s) + CO2(g) <=> 2CO(g)}$",
          ], correct_index: 1,
          explanation: "Pressure only shifts an equilibrium when the two sides differ in their number of gas molecules. $\\ce{H2 + I2 <=> 2HI}$ has 2 gas molecules on each side, so neither side offers relief and nothing moves. The other three each have unequal gas-mole counts (counting only gases, so the solid carbon is ignored).",
        },
      ]),
    ];
  },
};
