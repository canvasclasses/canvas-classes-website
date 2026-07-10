// IEQ page 7 — "What Makes One Acid Stronger Than Another" (NCERT §7.11.7 + levelling).
// Sub-topic: HA strength depends on the H-A bond strength and polarity.
//   - Down a group: A gets bigger, H-A bond weakens, acid gets stronger -> bond
//     strength is the deciding factor (HF < HCl < HBr < HI; H2S stronger than H2O).
//   - Across a period: A's electronegativity rises, H-A bond gets more polar, acid
//     gets stronger (CH4 < NH3 < H2O < HF).
//   - Oxide acidity/basicity trend (IIT-2004): increasing basicity
//     Cl2O7 < SO3 < CO2 < B2O3 < BaO.
//   - Levelling effect: every acid stronger than H3O+ is flattened to H3O+ in water,
//     so H3O+ is the strongest acid that can exist in water; compare strong acids in
//     a weaker solvent (glacial acetic acid).
// HIS analogies (IEQ-exemplars A): levelling = "pani sabko ek level pe le aata hai";
// strength is relative = the 5-kg weight ("heavy next to 4 kg, light next to 7.5 kg").
// Source: founder notes p9 (IIT-2004 oxide-basicity Q4), NCERT physical p217-218
// (§7.11.7 factors), p209-210 (strong acids dissociate fully -> levelling narrative).
// §5.X audited: no "Not X. It is Y." pairs, no banned/stacked metaphors, <=1 em-dash/
// para, second person, say-it-once, no reveal framing, no universal-you.
module.exports = {
  page_number: 7,
  slug: 'factors-affecting-acid-strength',
  title: 'What Makes One Acid Stronger Than Another',
  subtitle: 'Bond strength, polarity, and the levelling effect.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Left third: a vertical column of four H-A "dumb-bell" molecules getting longer and looser from top to bottom, hand-lettered "HF, HCl, HBr, HI" with a downward arrow "bond weakens -> stronger acid". Middle third: a horizontal row of four molecules CH4, NH3, H2O, HF with the H-A bond drawn more and more polarised (a tilting charge cloud), hand-lettered arrow "electronegativity rises -> stronger acid". Right third: several different acid bottles all pouring into one wide tray of water that sits at a single flat level, hand-lettered "water brings them to one level (H3O+)". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Why HF Is The Weakest Of Its Family',
        "Fluorine is the most electron-hungry atom in the halogen group, so you might expect $\\ce{HF}$ to be the strongest acid among $\\ce{HF}$, $\\ce{HCl}$, $\\ce{HBr}$ and $\\ce{HI}$. It is the weakest of the four. The $\\ce{H-F}$ bond is short and tight, and a tight bond does not let go of its proton easily. Going down the group the bond gets longer and looser, and that loosening matters more than how electron-hungry the atom is."),
      h.text(
        "Asking whether an acid is strong only means something against another acid. Picture a 5 kg weight. Heavy or light? Next to a 4 kg weight it is heavy; next to a 7.5 kg weight it is light. You cannot answer until you name the comparison. Acid strength works the same way, so this page is about ranking acids against each other.\n\n" +
        "How readily an acid $\\ce{HA}$ gives up its proton comes down to the $\\ce{H-A}$ bond: how **strong** that bond is and how **polar** it is. A weaker bond breaks more easily, releasing $\\ce{H+}$ and giving a stronger acid. A more polar bond pulls negative charge onto $\\ce{A}$, which also eases the proton off. Two trends in the periodic table follow from these two factors."
      ),
      h.heading('Down a group versus across a period', 'Predict the order of acid strength from position in the periodic table, using bond strength down a group and polarity across a period.'),
      h.text(
        "**Down a group, bond strength decides.** As you move down, $\\ce{A}$ gets bigger and the $\\ce{H-A}$ bond gets longer and weaker. A weaker bond gives up its proton more readily, so the acid gets stronger:\n\n" +
        "$$\\ce{HF} < \\ce{HCl} < \\ce{HBr} < \\ce{HI}$$\n\n" +
        "The same logic puts $\\ce{H2S}$ above $\\ce{H2O}$ in acidity, because the $\\ce{H-S}$ bond is weaker than the $\\ce{H-O}$ bond. Down a group the bond-strength effect outweighs how electronegative $\\ce{A}$ is.\n\n" +
        "**Across a period, polarity decides.** Moving left to right, $\\ce{A}$ becomes more electronegative, so it pulls harder on the bonding electrons and the $\\ce{H-A}$ bond turns more polar. A more polar bond cleaves more easily, so the acid gets stronger:\n\n" +
        "$$\\ce{CH4} < \\ce{NH3} < \\ce{H2O} < \\ce{HF}$$\n\n" +
        "So the question to ask first is which way you are moving. Down a group, judge by bond strength; across a period, judge by bond polarity."
      ),
      h.text(
        "The same period trend shows up when you rank **oxides** by how acidic or basic they are. A non-metal oxide on the right dissolves to a strong acid, a metal oxide on the left to a strong base, and the elements in between grade across. A 2004 IIT question asked exactly this. Taking $\\ce{Cl2O7}$, $\\ce{SO3}$, $\\ce{CO2}$, $\\ce{B2O3}$ and $\\ce{BaO}$, each one's reaction with water tells you its character: $\\ce{Cl2O7}$ gives $\\ce{HClO4}$ (a strong acid), $\\ce{SO3}$ gives $\\ce{H2SO4}$ (strong acid), $\\ce{CO2}$ gives $\\ce{H2CO3}$ (weak acid), $\\ce{B2O3}$ gives $\\ce{H3BO3}$ (weak acid), and $\\ce{BaO}$ gives $\\ce{Ba(OH)2}$ (a strong base). Ranking them by **increasing basicity**:\n\n" +
        "$$\\ce{Cl2O7} < \\ce{SO3} < \\ce{CO2} < \\ce{B2O3} < \\ce{BaO}$$"
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two-part science-notebook diagram, neat hand-lettering. TOP panel split in two: LEFT a vertical down-arrow beside the stack "HF, HCl, HBr, HI" with the H-A bond drawn longer and looser going down, hand-lettered "down a group: bond weakens -> acid strength up"; RIGHT a horizontal right-arrow beside the row "CH4, NH3, H2O, HF" with the bond drawn more polarised (charge separation +/-) going right, hand-lettered "across a period: bond more polar -> acid strength up". BOTTOM panel, set apart by a faint divider: the levelling effect. Three different-sized acid bottles labelled "HCl", "HNO3", "HClO4" all pour into one wide beaker of water; inside the beaker every acid has been converted to identical H3O+ units sitting at one flat level line, hand-lettered "all flattened to H3O+ — the strongest acid that can exist in water". A small side note: "to compare strong acids, use a weaker solvent (glacial acetic acid)". Uncluttered, warm ink colours.',
        '16:9',
        'Top: the two trends — down a group acid strength rises as the bond weakens; across a period it rises as the bond turns more polar. Bottom: the levelling effect — every acid stronger than H₃O⁺ is flattened to H₃O⁺ in water.'
      ),
      h.heading('The levelling effect', 'Explain why water cannot tell strong acids apart, and what solvent to use instead.'),
      h.text(
        "Here water plays a quiet trick. Any acid stronger than $\\ce{H3O+}$ hands its proton to water completely, turning into $\\ce{H3O+}$ in the process. So $\\ce{HCl}$, $\\ce{HNO3}$ and $\\ce{HClO4}$ all end up as the same species, $\\ce{H3O+}$, the moment they dissolve. Water brings them to one level. This is the **levelling effect**, and it means $\\ce{H3O+}$ is the strongest acid that can exist in water.\n\n" +
        "Because of this, water cannot tell these strong acids apart by strength. To rank them you move to a weaker base than water as the solvent, such as glacial acetic acid. A weaker solvent holds the proton back instead of taking it fully, so each strong acid dissociates to a different extent, and their true strength order shows."
      ),
      h.reasoning('logical',
        "A student measures equal-concentration solutions of $\\ce{HCl}$, $\\ce{HBr}$ and $\\ce{HClO4}$ in water and finds they all give the same $\\ce{[H3O+]}$. They conclude that all three acids have identical intrinsic strength. Where does this reasoning go wrong?",
        [
          "The student is right — these three acids genuinely have identical strength under all conditions",
          "Each of these acids is stronger than $\\ce{H3O+}$, so water levels them all to $\\ce{H3O+}$; water cannot rank them, and you would need a weaker solvent such as glacial acetic acid to see their true order",
          "The three solutions were at different temperatures, which is the only reason the readings matched",
          "$\\ce{HClO4}$ is actually a weak acid, so it should have given a lower reading",
        ], 1,
        "All three acids are stronger than $\\ce{H3O+}$, so in water each one donates its proton completely and becomes $\\ce{H3O+}$. The reading reflects water's own conjugate acid, not the acids' intrinsic strengths, so equal readings do not mean equal strength. To separate them you switch to a solvent that is a weaker base than water, like glacial acetic acid, where each acid dissociates to a different degree and the order appears.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Acid Strength & The Levelling Effect',
        "- **Down a group, bond strength wins.** The $\\ce{H-A}$ bond weakens going down, so acidity rises: $\\ce{HF} < \\ce{HCl} < \\ce{HBr} < \\ce{HI}$, and $\\ce{H2S}$ is more acidic than $\\ce{H2O}$.\n" +
        "- **Across a period, polarity wins.** $\\ce{A}$ grows more electronegative, the bond turns more polar, so acidity rises: $\\ce{CH4} < \\ce{NH3} < \\ce{H2O} < \\ce{HF}$.\n" +
        "- **Oxide trend (IIT-2004):** increasing basicity is $\\ce{Cl2O7} < \\ce{SO3} < \\ce{CO2} < \\ce{B2O3} < \\ce{BaO}$ — react each with water and read off the acid or base it gives.\n" +
        "- **Levelling effect:** $\\ce{H3O+}$ is the strongest acid that can exist in water. Every acid stronger than it is flattened to $\\ce{H3O+}$, so use a weaker solvent (glacial acetic acid) to compare strong acids.\n" +
        "- **Classic trap:** equal $\\ce{[H3O+]}$ from strong acids in water does not mean equal intrinsic strength — water has levelled them."),
      h.quiz([
        {
          question: "Among $\\ce{HF}$, $\\ce{HCl}$, $\\ce{HBr}$ and $\\ce{HI}$, which is the strongest acid, and why?",
          options: [
            "$\\ce{HF}$, because fluorine is the most electronegative and pulls hardest on the bond",
            "$\\ce{HI}$, because the $\\ce{H-I}$ bond is the weakest and gives up its proton most easily",
            "$\\ce{HCl}$, because chlorine sits in the middle of the group",
            "All four are equally strong, since they are all halogen acids",
          ], correct_index: 1,
          explanation: "Down a group, bond strength is the deciding factor. The $\\ce{H-I}$ bond is the longest and weakest of the four, so it releases its proton most readily, making $\\ce{HI}$ the strongest. Fluorine's high electronegativity would matter across a period, but down a group the weakening bond outweighs it, which is why $\\ce{HF}$ is in fact the weakest.",
        },
        {
          question: "Why does water fail to distinguish the strengths of $\\ce{HCl}$, $\\ce{HBr}$ and $\\ce{HClO4}$?",
          options: [
            "Because all three are weak acids that barely dissociate in water",
            "Because each is stronger than $\\ce{H3O+}$ and is fully converted to $\\ce{H3O+}$, so water levels them to the same species",
            "Because water reacts with none of them",
            "Because water raises every acid's strength to the same high value by adding $\\ce{OH-}$",
          ], correct_index: 1,
          explanation: "Each of these acids is stronger than $\\ce{H3O+}$, so in water each donates its proton completely and ends up as $\\ce{H3O+}$ — the levelling effect. The acids are strong, not weak, and water does not add $\\ce{OH-}$ to them, so the other options are wrong. A weaker solvent is needed to separate their strengths.",
        },
        {
          question: "Arranged in order of increasing basicity, the oxides $\\ce{Cl2O7}$, $\\ce{SO3}$, $\\ce{CO2}$, $\\ce{B2O3}$ and $\\ce{BaO}$ come out as:",
          options: [
            "$\\ce{BaO} < \\ce{B2O3} < \\ce{CO2} < \\ce{SO3} < \\ce{Cl2O7}$",
            "$\\ce{Cl2O7} < \\ce{SO3} < \\ce{CO2} < \\ce{B2O3} < \\ce{BaO}$",
            "$\\ce{CO2} < \\ce{SO3} < \\ce{Cl2O7} < \\ce{BaO} < \\ce{B2O3}$",
            "$\\ce{SO3} < \\ce{Cl2O7} < \\ce{BaO} < \\ce{CO2} < \\ce{B2O3}$",
          ], correct_index: 1,
          explanation: "React each with water: $\\ce{Cl2O7}$ and $\\ce{SO3}$ give strong acids, $\\ce{CO2}$ and $\\ce{B2O3}$ give weak acids, and $\\ce{BaO}$ gives a strong base. Basicity rises from the strongest acid to the strongest base, giving $\\ce{Cl2O7} < \\ce{SO3} < \\ce{CO2} < \\ce{B2O3} < \\ce{BaO}$. The first option is the reverse (decreasing basicity), and the others jumble the acid–base character.",
        },
      ]),
    ];
  },
};
