// IEQ page 0 — Chapter opener "Ionic Equilibrium".
// Lighter opener per §15.1 / §4A: chapter_opener, hero (16:5) + framing text +
// 2 curiosity_prompts, NO quiz. Frames ionic equilibrium = balance between
// ionised and non-ionised species in water; why it matters (blood pH 7.35-7.45,
// acidosis/alkalosis fatal; O2-haemoglobin equilibrium carries oxygen). Sources:
// founder notes pp 1-2 (blood-pH band, O2-Hb, ionic-equilibrium definition).
// §5.X audited: no "Not X. It is Y." pairs, no banned stacked metaphors,
// ≤1 em-dash/para, second person, say-it-once.
module.exports = {
  page_number: 0,
  slug: 'ionic-equilibrium-opener',
  page_type: 'chapter_opener',
  title: 'Ionic Equilibrium',
  subtitle: 'The balance between ions in water decides whether a solution is acidic, basic or neutral, and your blood guards that balance to two decimal places.',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A calm three-part split, left to right. On the left, a single dark-red drop of blood with a faint hand-lettered "pH 7.4" beside it. In the centre, a vertical strip of pH-paper rendered as a soft rainbow band from warm red through green to deep indigo. On the right, a small stack of smooth balanced zen stones resting one on another. A faint equilibrium double-arrow drawn lightly across the whole scene linking the three. Calm, contemplative, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.text(
        "Ionic equilibrium is the balance between the **ionised** and the **non-ionised** form of a substance dissolved in water. An acid like $HA$ does not simply split apart and stay split. It settles into a balance, $HA \\rightleftharpoons H^+ + A^-$, with both forms present at once. Where that balance sits is what this chapter is about, because it decides how acidic, basic or neutral the solution turns out to be.\n\n" +
        "Your own body runs on this balance. Blood is held at a pH between **7.35 and 7.45**, a window only a tenth of a unit wide. Slip below it and you are in **acidosis**; rise above it and you are in **alkalosis**. Both are medical emergencies, and a large enough swing in either direction is fatal. The same kind of ionic balance carries the oxygen you are breathing right now: oxygen binds to **haemoglobin** in your lungs and lets go again in your muscles, an equilibrium that shifts back and forth with every breath.\n\n" +
        "By the end of this chapter you will be able to:\n" +
        "- Classify acids and bases by the **Arrhenius**, **Brønsted–Lowry** and **Lewis** definitions\n" +
        "- Calculate the **pH** of acidic, basic and neutral solutions\n" +
        "- Handle **salt hydrolysis** and design **buffer** solutions that resist pH change\n" +
        "- Use the **solubility product** $K_{sp}$ to predict when a salt precipitates"
      ),
      h.curiosity(
        "Run up a flight of stairs and your muscles flood your blood with acid within seconds. Yet a blood test taken right after would still read close to pH 7.4. What is holding the number so steady when fresh acid keeps arriving?",
        "What could be quietly soaking up the extra acid the moment it appears?",
        "Your blood carries a built-in buffer: a pair of species that grabs incoming acid and releases it later, keeping the free $H^+$ almost unchanged. The arriving acid does not vanish, it gets absorbed by one partner of the pair and held until the body clears it. That same buffering trick, done deliberately in a beaker, is one of the most useful tools in this chapter."
      ),
      h.curiosity(
        "Take a strong acid and keep diluting it with water, again and again. Its pH climbs toward 7. Could enough water ever push it past 7, so the acid reads as basic?",
        "Where do all the $H^+$ ions in very pure water come from, and is that source ever switched off?",
        "No matter how much you dilute an acid, it stays acidic. As you add water the acid's own $H^+$ thins out, but water is itself splitting slightly into $H^+$ and $OH^-$ all the time, and that supply never stops. Once the acid is dilute enough, water's own contribution takes over and props the pH just below 7. An acid cannot dilute its way into basic territory."
      ),
    ];
  },
};
