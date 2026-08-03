'use strict';
/**
 * Class 12 Physics · Ch.3 "Current Electricity" — pages 11–15.
 * Heating effect and power, the Wheatstone bridge, the meter bridge, the
 * potentiometer, and converting a galvanometer into an ammeter or voltmeter.
 *
 * Run: node scripts/physics12-book/build_ch3_c_instruments.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 3;

// ── p11 · Power and the Heating Effect ───────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'power-and-the-heating-effect',
  title: 'Power and the Heating Effect',
  subtitle: 'Three formulas for one quantity — and knowing which to reach for',
  glossary: [
    { term: 'Joule heating', definition: 'The conversion of electrical energy into heat as charge is driven through a resistance. Also called the heating effect of current.' },
    { term: 'power rating', definition: 'The power a device consumes at its stated working voltage — not a fixed property of the device.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A $ 100 $ W bulb and a $ 60 $ W bulb, both rated for the same mains voltage, are connected **in series** across that mains supply.\n\nWhich one glows brighter?',
      hint: 'Which bulb has the greater resistance? And what is the same for both in a series circuit?',
      reveal: 'The **60 W** bulb — the one that is supposed to be dimmer.\n\nAt the rated voltage, $ P = V^{2}/R $, so the *lower*-power bulb has the *higher* resistance. Wire them in series and the current is the same through both, so $ P = I^{2}R $ makes the bigger resistance dissipate more power.\n\nSo in series the 60 W bulb outshines the 100 W bulb, and both are dimmer than either would be alone.\n\nThis is the whole difficulty of this page in one example: **the same device has different power in different circuits.** A power rating is not a property of the bulb; it is a property of the bulb *at its rated voltage*.',
    }),
    b('text', 1, {
      markdown: 'A charge $ q $ falling through a potential difference $ V $ loses energy $ qV $. Divide by time and you have the power:\n\n$ P = VI $\n\nAnd for a resistor, where $ V = IR $, that single expression can be rewritten two ways:',
    }),
    b('latex_block', 2, {
      latex: 'P = VI = I^{2}R = \\frac{V^{2}}{R}',
      label: 'Electrical power dissipated in a resistor',
      note: 'All three are the same result. Which one is useful depends on what is held constant in your circuit.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'They are algebraically identical, so no form is ever *wrong*. But choosing the right one turns most questions into a single line, and the wrong one leads you into confusion. The rule is to pick the form containing the quantity that **stays the same**:',
    }),
    b('table', 4, {
      caption: 'Choosing the form. Ask what is common to the components you are comparing.',
      headers: ['Situation', 'What is fixed', 'Use', 'Consequence'],
      rows: [
        ['Components in **series**', 'the current $ I $', '$ P = I^{2}R $', 'the **largest** resistance dissipates most'],
        ['Components in **parallel**', 'the voltage $ V $', '$ P = V^{2}/R $', 'the **smallest** resistance dissipates most'],
        ['One device on a known supply', 'both $ V $ and $ I $', '$ P = VI $', 'the direct calculation'],
      ],
    }),
    b('text', 5, {
      markdown: 'Read those two consequences carefully, because they point opposite ways and both are constantly needed:\n\n**In series, the biggest resistor gets hottest.** Same current through all of them, so $ P \\propto R $.\n\n**In parallel, the smallest resistor gets hottest.** Same voltage across all of them, so $ P \\propto 1/R $.\n\nA student who remembers only "big resistance means more heat" gets the parallel case exactly backwards — and household wiring is all parallel.',
    }),
    b('heading', 6, {
      text: 'What a power rating actually means',
      level: 2,
      objective: 'Find a device\'s resistance from its rating, and its actual power at a different voltage.',
    }),
    b('text', 7, {
      markdown: 'A bulb marked "$ 100 $ W, $ 220 $ V" is telling you one thing: *if you put 220 V across me, I will consume 100 W.* It does **not** mean the bulb always consumes 100 W.\n\nWhat is genuinely fixed is its **resistance**, and you get it from the rating:\n\n$ R = \\frac{V_{\\text{rated}}^{2}}{P_{\\text{rated}}} = \\frac{220^{2}}{100} = 484\\ \\Omega $\n\nNow you can find its power anywhere. At $ 110 $ V, for instance:\n\n$ P = \\frac{V^{2}}{R} = \\frac{110^{2}}{484} = 25\\ \\text{W} $\n\nHalf the voltage gives a **quarter** of the power, because $ P \\propto V^{2} $. That is why a bulb on a low supply is not just dim but very dim.\n\n(Strictly, a filament\'s resistance rises as it heats, so this is an approximation — but it is the one every exam expects.)',
    }),
    b('worked_example', 8, {
      label: 'two bulbs in series, done with numbers',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 100 $ W and a $ 60 $ W bulb, both rated at $ 220 $ V, are connected in series across a $ 220 $ V supply. Find the power dissipated by each.',
      solution: '**Step 1 — get the resistances from the ratings.**\n\n$ R_{100} = \\frac{220^{2}}{100} = 484\\ \\Omega, \\qquad R_{60} = \\frac{220^{2}}{60} = 807\\ \\Omega $\n\nNote already that the *lower*-power bulb has the *higher* resistance.\n\n**Step 2 — the series current.**\n\n$ I = \\frac{220}{484+807} = \\frac{220}{1291} = 0.170\\ \\text{A} $\n\n**Step 3 — the power in each, using $ P = I^{2}R $** (the current is what they share):\n\n$ P_{100} = (0.170)^{2}(484) = 14.0\\ \\text{W} $\n\n$ P_{60} = (0.170)^{2}(807) = 23.3\\ \\text{W} $\n\n**Read the result.** The 60 W bulb dissipates *more* than the 100 W bulb — it glows brighter. And both are far below their ratings, because each is only getting part of the 220 V.\n\n**Check:** total is $ 14.0 + 23.3 = 37.3 $ W, which should equal $ VI = 220 \\times 0.170 = 37.4 $ W ✓ (rounding).\n\n**The trap in one sentence.** Using $ P = V^{2}/R $ here with $ V = 220 $ for each bulb would be wrong — neither bulb has 220 V across it. In series, reach for $ I^{2}R $.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'quantitative',
      prompt: 'Two identical bulbs are connected first in series and then in parallel across the same supply. In which arrangement is the **total** power consumed greater, and by what factor?',
      options: ['Parallel, by a factor of 4', 'Series, by a factor of 4', 'Parallel, by a factor of 2', 'They are equal'],
      reveal: '**Parallel, by a factor of 4.**\n\nLet each bulb be $ R $ and the supply be $ V $.\n\n*Series:* total resistance $ 2R $, so $ P_s = \\frac{V^{2}}{2R} $.\n\n*Parallel:* total resistance $ R/2 $, so $ P_p = \\frac{V^{2}}{R/2} = \\frac{2V^{2}}{R} $.\n\n$ \\frac{P_p}{P_s} = \\frac{2V^{2}/R}{V^{2}/2R} = 4 $\n\nThe general rule for $ n $ identical devices on a fixed supply: parallel draws $ n^{2} $ times the power of series. With $ n = 2 $ that is 4.\n\n**Which is why household appliances are wired in parallel** — each gets the full mains voltage and therefore its full rated power, and switching one off does not affect the others.',
      difficulty_level: 2,
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Joule heating is either the whole purpose of a device or its worst problem, with nothing in between.\n\n**Wanted:** an electric heater, an iron, a toaster, an immersion rod, an incandescent filament. All use a high-resistivity alloy — usually **nichrome** — so a manageable length of wire dissipates a lot of power. Nichrome also survives red heat without oxidising away, which pure metals do not.\n\n**Unwanted:** every metre of cable in the country. Transmission losses are $ I^{2}R $, and that single expression is why the grid transmits at hundreds of kilovolts. For a given power $ P = VI $, raising $ V $ cuts $ I $ in proportion — and cuts the loss by the **square**. Transmit at ten times the voltage and you waste a hundredth of the power.\n\n**Deliberately sacrificial:** a **fuse** is a short piece of wire chosen to be the hottest thing in the circuit, so that it melts before anything expensive does.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), three vignettes in a row separated by generous dark space, all in thin dim-grey line art. Left: a coiled heating element glowing warm orange inside a grey appliance outline, labelled wanted. Centre: two transmission pylons in dim grey with a long amber line between them, a small inset showing a thick low-voltage cable with many orange heat squiggles beside a thin high-voltage cable with almost none, labelled unwanted. Right: a glass fuse cartridge in grey with a thin amber wire inside, shown intact and then broken with a small orange flash, labelled sacrificial. Muted white minimal labels.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Two bulbs in series and the same two in parallel, with the power in each marked',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Series: the bigger resistance is hotter. Parallel: the smaller one is. Both, from the same three formulas.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, in thin dim-grey line art. Left panel labelled Series: a supply symbol and two lamp circles in a single loop, the left lamp glowing dimly with a faint amber halo and the right one glowing more brightly with a larger amber halo, a single orange current arrow marked identically at two points. Right panel labelled Parallel: the same supply with two lamp circles side by side between the same two nodes, both glowing brightly and equally, with a thick orange arrow splitting into two thinner ones. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ P = VI = I^{2}R = V^{2}/R $ — all identical. Pick the form containing the quantity that is **shared**.\n- **Series** → same $ I $ → use $ I^{2}R $ → biggest $ R $ is hottest.\n- **Parallel** → same $ V $ → use $ V^{2}/R $ → smallest $ R $ is hottest.\n- A rating "$ P $ at $ V $" really means $ R = V^{2}/P $. That $ R $ is what stays fixed.\n- $ P \\propto V^{2} $, so half the voltage gives a quarter of the power.\n- $ n $ identical devices: parallel draws $ n^{2} $ times the power of series.',
    }),
    b('text', 13, {
      markdown: 'Next: three instruments that all measure by finding a **null** — a reading of exactly zero — rather than by reading a scale. That idea is the key to precision.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('Two resistors of $ 2\\ \\Omega $ and $ 8\\ \\Omega $ are connected in series. The one dissipating more power is',
          ['the $ 8\\ \\Omega $ resistor', 'the $ 2\\ \\Omega $ resistor', 'both dissipate equally', 'it depends on the supply voltage'],
          0,
          'In series the current is common, so $ P = I^{2}R $ makes power proportional to resistance. Had they been in parallel, the voltage would be common and the $ 2\\ \\Omega $ resistor would win instead.',
          2),
        q('A bulb rated "$ 60 $ W, $ 220 $ V" is operated at $ 110 $ V. Its power consumption becomes',
          ['$ 15 $ W', '$ 30 $ W', '$ 60 $ W', '$ 120 $ W'],
          0,
          'The resistance is fixed, and $ P = V^{2}/R $, so halving the voltage quarters the power: $ 60/4 = 15 $ W. Answering $ 30 $ W treats power as proportional to $ V $ rather than $ V^{2} $.',
          2),
        q('Electric power is transmitted at very high voltage because',
          ['a smaller current means much smaller $ I^{2}R $ losses', 'high voltage travels faster along the cable', 'the resistance of the cable falls at high voltage', 'high voltage is safer'],
          0,
          'For a fixed power $ P = VI $, raising $ V $ lowers $ I $ in proportion, and the loss $ I^{2}R $ falls by the square of that factor. The cable resistance is unchanged, and high voltage is emphatically not safer.',
          3),
      ],
    }),
  ],
};

// ── p12 · The Wheatstone Bridge ──────────────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'the-wheatstone-bridge',
  title: 'The Wheatstone Bridge',
  subtitle: 'Measuring by finding nothing at all',
  glossary: [
    { term: 'null method', definition: 'A measurement made by adjusting a circuit until a detector reads exactly zero, so the result does not depend on the detector\'s calibration.' },
    { term: 'balanced bridge', definition: 'A bridge in which the two midpoints are at the same potential, so no current flows through the detector.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You want to measure a resistance to one part in a thousand. You could pass a current through it, measure the voltage and the current, and divide.\n\nBut your ammeter is accurate to 2% and your voltmeter to 2%. So your answer is good to about 4% — nowhere near good enough.\n\nHow can you possibly do better than your instruments?',
      hint: 'What if the instrument only ever had to answer one question: is this exactly zero?',
      reveal: 'By never asking the instrument to **measure** anything — only to tell you when a current is **zero**.\n\nA detector\'s calibration hardly matters for that job. A galvanometer that is 20% out on its scale is still perfectly capable of showing you an undeflected needle. And zero is zero on any scale.\n\nSo you arrange a circuit whose balance condition depends only on **ratios of resistances**, adjust it until the detector reads nothing, and read the answer off the resistances. The precision then comes from the resistors, which can be made extremely accurate, instead of from the meter.\n\nThat is the **null method**, and it is the idea behind all three instruments in the rest of this chapter.',
    }),
    b('text', 1, {
      markdown: 'The bridge is four resistors in a diamond, with a galvanometer across the middle and a cell across the other diagonal.\n\nCall the resistors $ P $ and $ Q $ in one arm (joined at node B), and $ R $ and $ S $ in the other (joined at node D). The cell drives current in at A and out at C, and the galvanometer sits between B and D.\n\nAt **balance** the galvanometer reads zero — no current flows through it. And that happens when',
    }),
    b('latex_block', 2, {
      latex: '\\frac{P}{Q} = \\frac{R}{S}',
      label: 'Wheatstone bridge balance condition',
      note: 'Ratios only. Note what is absent: the cell\'s emf, its internal resistance, and the galvanometer\'s resistance.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'Where the condition comes from',
      level: 2,
      objective: 'Derive the balance condition from the requirement that two nodes be at equal potential.',
    }),
    b('text', 4, {
      markdown: 'The derivation is three lines, and it is worth doing because it shows why the condition involves only ratios.\n\nIf no current flows through the galvanometer, then B and D must be at the **same potential**. Two consequences follow immediately:\n\n**The same current passes through $ P $ and $ Q $** — call it $ I_1 $ — because nothing leaves at B.\n\n**The same current passes through $ R $ and $ S $** — call it $ I_2 $ — because nothing leaves at D.\n\nNow, $ V_B = V_D $ means the drop from A to B equals the drop from A to D:\n\n$ I_1P = I_2R $\n\nAnd the drop from B to C equals the drop from D to C:\n\n$ I_1Q = I_2S $\n\nDivide the first by the second and both currents cancel:\n\n$ \\frac{P}{Q} = \\frac{R}{S} $',
    }),
    b('text', 5, {
      markdown: 'Look at what dropped out of that derivation. The **currents** cancelled, so the cell\'s emf and internal resistance are irrelevant. The galvanometer carried no current, so **its** resistance is irrelevant too.\n\nThat is the whole power of the method. Three of the four things that would normally limit your accuracy have been eliminated, and the answer depends only on resistances you can make precisely.\n\nSo to measure an unknown $ S $: put it in one arm, use known $ P $ and $ Q $ for the ratio, adjust a calibrated resistance box $ R $ until the galvanometer reads zero, and\n\n$ S = R\\cdot\\frac{Q}{P} $',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'In a balanced Wheatstone bridge, the cell and the galvanometer are swapped over — the cell now sits where the galvanometer was, and vice versa. Is the bridge still balanced?',
      options: ['Yes, it stays balanced', 'No, the balance is lost', 'Only if all four resistances are equal', 'Only if the galvanometer has zero resistance'],
      reveal: '**Yes — it remains balanced.**\n\nThe balance condition $ P/Q = R/S $ can be rearranged to $ P/R = Q/S $, which is exactly the condition you would write for the swapped arrangement. The two are the same statement.\n\nThis is a real and useful property, not a curiosity: it means you cannot get the bridge wrong by putting the cell and detector in the wrong diagonals. The circuit is symmetric in that exchange.\n\n**What you *cannot* do** is swap a resistor with the galvanometer. That breaks the diamond and the condition no longer applies.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'Sensitivity — why the arms should be comparable',
      level: 2,
      objective: 'Say when a bridge gives its most precise result.',
    }),
    b('text', 8, {
      markdown: 'Finding the balance point is only useful if the galvanometer swings noticeably when you are slightly off it. That is the bridge\'s **sensitivity**.\n\nThe bridge is most sensitive when the four resistances are of **comparable magnitude**. If one arm is a thousand times another, a large change in the unknown produces almost no deflection, and you cannot tell where the balance point is.\n\nSo in practice you choose the ratio arms $ P $ and $ Q $ to bring $ R $ into the same range as $ S $. This is exactly why a resistance box offers a range of ratios rather than a single one.',
    }),
    b('worked_example', 9, {
      label: 'finding an unknown resistance',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'In a Wheatstone bridge, $ P = 10\\ \\Omega $, $ Q = 100\\ \\Omega $, and balance is obtained when the variable resistance $ R = 43.5\\ \\Omega $. Find the unknown resistance $ S $.',
      solution: 'From the balance condition:\n\n$ \\frac{P}{Q} = \\frac{R}{S} \\quad\\Rightarrow\\quad S = R\\cdot\\frac{Q}{P} $\n\n$ S = 43.5 \\times \\frac{100}{10} = 435\\ \\Omega $\n\n**Where the precision comes from.** The answer is the product of one measured resistance and one exact ratio. If the box is accurate to $ 0.1\\ \\Omega $ in $ 43.5\\ \\Omega $ — about 0.2% — then $ S $ is known to 0.2% too.\n\nCompare the direct route: an ammeter and a voltmeter each good to 2% would have given about 4%. The bridge is twenty times better with cheaper equipment, purely because the galvanometer was asked an easier question.\n\n**And notice what never appeared in the calculation:** the cell\'s emf, its internal resistance, and the galvanometer\'s resistance. None of them can affect the answer.',
    }),
    b('image', 10, {
      src: '',
      alt: 'A Wheatstone bridge circuit with the four resistors, the galvanometer across the middle and the cell across the other diagonal',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'At balance, B and D sit at the same potential and the galvanometer reads nothing.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), thin dim-grey line art. Four resistors drawn as warm amber zigzags arranged in a diamond, with nodes as small amber dots labelled A at the left, B at the top, C at the right and D at the bottom in muted white. Resistor labels P between A and B, Q between B and C, R between A and D, S between D and C. A galvanometer drawn as a circle with a needle connects B to D, labelled G, with a small muted-white note beside it reading zero at balance. A battery symbol with a key connects A to C along the outside. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Balance condition: $ \\frac{P}{Q} = \\frac{R}{S} $. Ratios only.\n- At balance, B and D are at equal potential and **no current** flows in the galvanometer.\n- The result is independent of the cell\'s emf, the cell\'s internal resistance, **and** the galvanometer\'s resistance.\n- Swapping the cell and the galvanometer does **not** disturb the balance.\n- Most sensitive when all four resistances are of comparable size.',
    }),
    b('text', 12, {
      markdown: 'Next: the bridge turned into a practical instrument, by replacing two of its resistors with a single length of wire.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('At balance in a Wheatstone bridge, the current through the galvanometer is',
          ['zero', 'maximum', 'equal to the cell current', 'half the cell current'],
          0,
          'Balance is defined by the two midpoints being at equal potential, so there is no potential difference across the galvanometer and no current through it. That is precisely why its resistance cannot affect the result.',
          1),
        q('The balance condition of a Wheatstone bridge is independent of',
          ['the emf of the driving cell', 'the ratio of $ P $ to $ Q $', 'the value of the resistance $ R $', 'the value of the resistance $ S $'],
          0,
          'The branch currents cancel when the two potential-drop equations are divided, so the emf and the internal resistance drop out entirely. All four resistances, by contrast, are exactly what the condition is about.',
          2),
        q('A Wheatstone bridge is most sensitive when the four resistances are',
          ['comparable in magnitude', 'as different as possible', 'all equal to the galvanometer resistance', 'as small as possible'],
          0,
          'Sensitivity is about how much the galvanometer swings for a small departure from balance. With one arm vastly larger than another, that swing becomes too small to locate the null point reliably.',
          3),
      ],
    }),
  ],
};

// ── p13 · The Meter Bridge ───────────────────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'the-meter-bridge',
  title: 'The Meter Bridge',
  subtitle: 'Two resistors replaced by one wire and a sliding contact',
  glossary: [
    { term: 'meter bridge', definition: 'A practical Wheatstone bridge in which the two ratio arms are two parts of a single uniform metre-long wire.' },
    { term: 'end correction', definition: 'A small extra length added to each side of a meter-bridge wire to account for the resistance of the copper strips and contacts at its ends.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'The Wheatstone bridge needs two accurately known resistors to set the ratio $ P/Q $. Accurate resistors are expensive.\n\nThe meter bridge replaces both of them with **one metre of uniform wire** and a sliding contact. Because the wire is uniform, the resistance of any piece is proportional to its length — so the ratio arm becomes a **ratio of two lengths**, which you can read off a millimetre scale.\n\nA measurement of resistance has been turned into a measurement of distance. That is a very good trade.',
    }),
    b('text', 1, {
      markdown: 'A uniform wire, exactly one metre long, is stretched along a scale. The unknown resistance $ S $ and a known resistance $ R $ from a box are connected in the two gaps above it. A galvanometer runs from the junction between them to a **jockey** — a sliding contact that can touch the wire anywhere along its length.\n\nSlide the jockey until the galvanometer reads zero. If that happens at a distance $ l $ cm from the left-hand end, then the two parts of the wire have resistances proportional to $ l $ and $ (100 - l) $, and the bridge condition becomes',
    }),
    b('latex_block', 2, {
      latex: '\\frac{R}{S} = \\frac{l}{100 - l} \\qquad\\Rightarrow\\qquad S = R\\cdot\\frac{100-l}{l}',
      label: 'Meter bridge balance',
      note: 'l in cm. Only the RATIO of lengths matters, so the wire\'s resistance per unit length never needs to be known.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Notice what is not required: the resistivity of the wire, its thickness, or its resistance per centimetre. All of that cancels in the ratio. The wire only has to be **uniform** — and uniformity is far easier to achieve than a known absolute value.',
    }),
    b('heading', 4, {
      text: 'Getting a good measurement',
      level: 2,
      objective: 'Choose $ R $ so that the balance point falls where the bridge is most sensitive.',
    }),
    b('text', 5, {
      markdown: 'The bridge is most sensitive when the two arms are comparable — which here means when the balance point is **near the middle of the wire**. So choose $ R $ to be roughly the same size as $ S $.\n\nThe reason is worth seeing. Suppose the null falls at $ l = 2 $ cm. Then $ S = R \\times 98/2 = 49R $, and a jockey position uncertain by $ 1 $ mm changes the answer by several per cent. At $ l = 50 $ cm the same $ 1 $ mm uncertainty changes the answer by about 0.4%.\n\n**So the working rule is: if the null lands near either end, change $ R $ and try again.** A reading taken near the end of the wire is not a precise reading, however carefully you locate it.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'In a meter bridge with $ R = 10\\ \\Omega $, the balance point is found at $ l = 40 $ cm from the left. What is the unknown resistance?',
      options: ['$ 15\\ \\Omega $', '$ 6.7\\ \\Omega $', '$ 25\\ \\Omega $', '$ 4\\ \\Omega $'],
      reveal: '**$ 15\\ \\Omega $.**\n\n$ S = R\\cdot\\frac{100-l}{l} = 10 \\times \\frac{60}{40} = 15\\ \\Omega $\n\nA useful check on the direction: the balance point sat on the **left** of centre, meaning the left-hand piece of wire had the smaller resistance. So the arm containing $ R $ needed the smaller partner — which makes $ S $ the larger of the two. And 15 is larger than 10. ✓\n\nAnswering $ 6.7\\ \\Omega $ means the ratio was inverted, which the sanity check above catches immediately. **Always ask which side of centre the null fell on before writing the answer.**',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Where the errors come from',
      level: 2,
      objective: 'List the main sources of error in a meter-bridge measurement and how each is handled.',
    }),
    b('table', 8, {
      caption: 'The four things that spoil a meter-bridge reading, and what to do about each.',
      headers: ['Source of error', 'Effect', 'Remedy'],
      rows: [
        ['**End resistance** — the copper strips and soldered joints at each end of the wire', 'Adds a small unknown length to each side', 'End corrections: use $ \\frac{R}{S} = \\frac{l+\\alpha}{100-l+\\beta} $, with $ \\alpha $ and $ \\beta $ found by a calibration run'],
        ['**Non-uniform wire**', 'The length ratio no longer equals the resistance ratio', 'Repeat with $ R $ and $ S $ interchanged and average the two results'],
        ['**Heating of the wire**', 'Resistance drifts during the measurement', 'Use a low current, and open the key between readings'],
        ['**Balance point near an end**', 'A small position error becomes a large resistance error', 'Change $ R $ so the null lands near the middle'],
      ],
    }),
    b('text', 9, {
      markdown: 'The second remedy deserves a comment, because it is a genuinely elegant trick. Swapping $ R $ and $ S $ between the two gaps and averaging cancels the end corrections to first order — any length wrongly attributed to the left side in one run is wrongly attributed to the right side in the other. You get a better answer without ever measuring $ \\alpha $ or $ \\beta $ at all.',
    }),
    b('image', 10, {
      src: '',
      alt: 'A meter bridge with the unknown and known resistances in the gaps, a metre wire with a scale, and a jockey with a galvanometer',
      width: 'full',
      aspect_ratio: '16:5',
      caption: 'Slide the jockey to the null point, read the length, and the ratio does the rest.',
      generation_prompt: 'Clean scientific apparatus diagram on a near-black background (#0B0C0F), wide horizontal composition in thin dim-grey line art. A long straight amber wire runs left to right above a fine ruled scale marked 0 and 100 with tick marks in muted white. Above the wire, two rectangular gaps hold resistor zigzags labelled R on the left and S on the right, joined at a central terminal. A small triangular jockey contact sits on the wire left of centre, connected upward to a galvanometer drawn as a circle with a needle, labelled G. A battery symbol with a key connects the two outer ends of the wire beneath. Dashed grey dimension lines beneath the wire mark l and 100 minus l. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ S = R\\cdot\\frac{100-l}{l} $, with $ l $ in cm from the end nearer $ R $.\n- Works because the wire is **uniform**, so resistance $ \\propto $ length. Its actual resistivity never enters.\n- Most sensitive with the null **near the middle** — choose $ R \\approx S $.\n- End corrections come from the strips and joints; interchanging $ R $ and $ S $ and averaging cancels them.\n- Keep the current low so the wire does not heat and drift.',
    }),
    b('text', 12, {
      markdown: 'Next: the same null idea again, but now measuring **voltage** — and doing something no voltmeter can do.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('In a meter bridge, the resistance of a portion of the wire is proportional to its length because the wire is',
          ['uniform in cross-section', 'made of copper throughout', 'exactly one metre in length', 'connected across a battery'],
          0,
          '$ R = \\rho l/A $, so proportionality to length needs $ \\rho $ and $ A $ to be the same all along. Uniformity is the only requirement — the absolute resistance per centimetre cancels out of the ratio.',
          2),
        q('A meter bridge gives its most accurate result when the balance point is',
          ['near the middle of the wire', 'near the left-hand end', 'near the right-hand end', 'anywhere — the position does not matter'],
          0,
          'Near an end, one of the two lengths is small, so a fixed uncertainty in the jockey position causes a large fractional error in the ratio. Near the middle that same uncertainty barely matters.',
          2),
        q('End corrections in a meter bridge arise from',
          ['the resistance of the strips and joints at the ends', 'the wire being cut slightly longer than a metre', 'the galvanometer having its own resistance', 'the driving cell having internal resistance'],
          0,
          'The copper strips and soldered contacts add a little resistance that behaves like extra wire length. The galvanometer and the cell cannot contribute, since the balance condition is independent of both.',
          3),
      ],
    }),
  ],
};

// ── p14 · The Potentiometer ──────────────────────────────────────────────────
const p14 = {
  page_number: 14,
  slug: 'the-potentiometer',
  title: 'The Potentiometer',
  subtitle: 'The only way to measure an emf without disturbing it',
  glossary: [
    { term: 'potentiometer', definition: 'A long uniform wire carrying a steady current, used as a source of accurately known, continuously variable potential difference.' },
    { term: 'potential gradient', definition: 'The potential drop per unit length along the potentiometer wire, $ k = V/L $, in volts per metre.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Put a voltmeter across a cell and it reads the terminal voltage $ V = \\varepsilon - Ir $, not the emf.\n\nUse a better voltmeter — higher resistance, less current drawn — and you get closer. But you never get there.\n\nSo can an emf ever be measured **exactly**?',
      hint: 'You would need to measure the voltage while drawing exactly zero current. Which instrument is happy to read zero?',
      reveal: '**Yes — but only by a null method.**\n\nAny voltmeter must draw *some* current to deflect, and that current causes the $ Ir $ drop that spoils the reading. Improving the voltmeter shrinks the error but cannot remove it.\n\nA potentiometer removes it completely. It balances the cell\'s emf against a known potential difference and adjusts until **no current at all** flows from the cell. At that instant $ I = 0 $, so $ Ir = 0 $, and the terminal voltage genuinely equals the emf.\n\nThis is not a marginally better voltmeter. It is the one instrument that answers a question a voltmeter cannot.',
    }),
    b('text', 1, {
      markdown: 'The apparatus is a long uniform wire — usually 10 metres, wound in a metre-long frame — with a steady current from a **driver cell** flowing along it. That current sets up a uniform potential drop along the wire.\n\nBecause the wire is uniform, the potential falls at a constant rate:',
    }),
    b('latex_block', 2, {
      latex: 'k = \\frac{V}{L} \\qquad\\text{(volts per metre)}, \\qquad V_{AJ} = k\\,l',
      label: 'Potential gradient',
      note: 'The wire becomes a ruler for voltage: the potential between the start and any point is simply k times the length.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'So the wire is a source of continuously adjustable, accurately known potential difference. Tap it at $ l = 3.42 $ m and you have $ 3.42k $ volts, as precisely as you can read the scale.\n\nNow connect the cell you want to measure — through a galvanometer — between the start of the wire and a sliding contact, with **like terminals joined together** so the two emfs oppose. Slide the contact until the galvanometer reads zero. At that point the cell\'s emf exactly matches the potential across that length of wire, and no current flows from the cell:\n\n$ \\varepsilon = k\\,l $',
    }),
    b('callout', 4, {
      variant: 'warning',
      title: 'Two conditions that must hold, or you will never find a null',
      markdown: '**The driver cell must have a larger emf than the cell being measured.** If the potential across the whole wire is less than $ \\varepsilon $, there is no point on the wire that can balance it — and the galvanometer deflects the same way everywhere.\n\n**The positive terminals must be joined to the same end.** Connect them the wrong way round and the two emfs *add* instead of opposing, so again no balance exists anywhere on the wire.\n\nIf the galvanometer deflects in the **same direction at both ends** of the wire, one of these two conditions has been broken. That is the standard diagnostic, and it is worth knowing before you spend twenty minutes sliding a jockey.',
    }),
    b('heading', 5, {
      text: 'Comparing two emfs',
      level: 2,
      objective: 'Compare two cells without knowing the potential gradient at all.',
    }),
    b('text', 6, {
      markdown: 'Balance the first cell at length $ l_1 $ and the second at $ l_2 $. Then $ \\varepsilon_1 = kl_1 $ and $ \\varepsilon_2 = kl_2 $, so\n\n$ \\frac{\\varepsilon_1}{\\varepsilon_2} = \\frac{l_1}{l_2} $\n\nThe gradient $ k $ cancels — so you can compare two cells to high precision **without ever knowing $ k $**, and without needing the driver cell to be calibrated at all. Two length measurements are the entire experiment.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A potentiometer wire is $ 10 $ m long with $ 4 $ V across it. A cell balances at $ 5.5 $ m. What is its emf — and would a $ 2.5 $ V cell balance anywhere on this wire?',
      options: [
        '$ 2.2 $ V; and yes, a $ 2.5 $ V cell would balance at $ 6.25 $ m',
        '$ 2.2 $ V; and no, a $ 2.5 $ V cell is too large to balance',
        '$ 5.5 $ V; and yes, at $ 6.25 $ m',
        '$ 0.44 $ V; and yes, near the far end',
      ],
      reveal: '**$ 2.2 $ V, and yes — a $ 2.5 $ V cell would balance at $ 6.25 $ m.**\n\nThe gradient is $ k = 4/10 = 0.4 $ V/m, so\n\n$ \\varepsilon = kl = 0.4 \\times 5.5 = 2.2\\ \\text{V} $\n\nFor the second cell: $ l = \\varepsilon/k = 2.5/0.4 = 6.25 $ m, comfortably within the $ 10 $ m wire.\n\n**The condition to check is always the same:** can the wire supply that voltage at all? The whole wire offers $ 4 $ V, so any cell up to $ 4 $ V will balance somewhere. A $ 4.5 $ V cell would not, and the galvanometer would deflect the same way at both ends.\n\nSo the driver circuit must always deliver **more** across the wire than the largest emf you intend to measure.',
      difficulty_level: 2,
    }),
    b('heading', 8, {
      text: 'Measuring internal resistance',
      level: 2,
      objective: 'Use two balance lengths to find a cell\'s internal resistance.',
    }),
    b('text', 8, {
      markdown: 'Here the null method really earns its keep, because it measures the one thing a meter cannot reach.\n\n**First**, balance the cell on open circuit — nothing connected across it. The galvanometer nulls at length $ l_1 $, and since no current flows, this length measures the **emf**:\n\n$ \\varepsilon = kl_1 $\n\n**Then** connect a known resistance $ R $ across the cell, so it is now delivering current, and balance again at $ l_2 $. This length measures the **terminal voltage**:\n\n$ V = kl_2 $\n\nAnd since $ V = \\frac{\\varepsilon R}{R+r} $, a little rearrangement gives',
    }),
    b('latex_block', 9, {
      latex: 'r = R\\left(\\frac{l_1 - l_2}{l_2}\\right)',
      label: 'Internal resistance from two balance lengths',
      note: 'Again k has cancelled. Two lengths and one known resistance are all you need.',
      highlight: true,
    }),
    b('worked_example', 10, {
      label: 'emf and internal resistance from a potentiometer',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A potentiometer wire is $ 10 $ m long and has a potential difference of $ 5 $ V across it. A cell balances at $ 4.6 $ m on open circuit. When a $ 5\\ \\Omega $ resistor is connected across the cell, the balance point moves to $ 4.0 $ m. Find the emf and internal resistance of the cell.',
      solution: '**The potential gradient.**\n\n$ k = \\frac{V}{L} = \\frac{5}{10} = 0.5\\ \\text{V/m} $\n\n**The emf** — from the open-circuit balance, where no current flows from the cell:\n\n$ \\varepsilon = kl_1 = 0.5 \\times 4.6 = 2.3\\ \\text{V} $\n\n**The terminal voltage** with the $ 5\\ \\Omega $ load connected:\n\n$ V = kl_2 = 0.5 \\times 4.0 = 2.0\\ \\text{V} $\n\n**The internal resistance:**\n\n$ r = R\\left(\\frac{l_1-l_2}{l_2}\\right) = 5\\left(\\frac{4.6-4.0}{4.0}\\right) = 5 \\times 0.15 = 0.75\\ \\Omega $\n\n**Check it independently.** With $ \\varepsilon = 2.3 $ V, $ r = 0.75\\ \\Omega $ and $ R = 5\\ \\Omega $: the current is $ 2.3/5.75 = 0.4 $ A, so $ V = IR = 0.4 \\times 5 = 2.0 $ V ✓ — exactly the measured terminal voltage.\n\n**The point to hold on to.** The balance length **always falls** when the cell is loaded, because the terminal voltage is always less than the emf. If a measurement ever shows $ l_2 > l_1 $, something is wired wrongly.',
    }),
    b('text', 12, {
      markdown: '**Sensitivity — a longer wire is a better wire.** The precision of a potentiometer comes from having a **small potential gradient**. A small $ k $ means a given voltage corresponds to a long length of wire, so a millimetre of scale represents a very small voltage and you can resolve finer differences.\n\nTwo ways to reduce $ k $:\n\n- **A longer wire** for the same driving voltage — which is why the standard instrument folds ten metres into a metre-long frame.\n- **A series resistance in the driver circuit**, reducing the current and hence the total drop across the wire.\n\nThe trade-off: reducing $ k $ too far means the whole wire can no longer balance the emf you are measuring. So $ k $ is chosen small enough for precision but large enough that the null falls comfortably on the wire — usually towards its far end.',
    }),
    b('image', 13, {
      src: '',
      alt: 'A potentiometer circuit with a driver cell along the wire and the test cell balanced through a galvanometer at the jockey',
      width: 'full',
      aspect_ratio: '16:5',
      caption: 'The driver cell makes a voltage ruler. The test cell is balanced against a length of it.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), wide horizontal composition in thin dim-grey line art. A long straight amber wire runs left to right between terminals A and B, above a ruled scale in muted white. Beneath, a primary circuit connects A to B through a battery symbol, a key and a rheostat, all in amber, with a small orange current arrow. Above the wire, a secondary circuit runs from terminal A through a second battery symbol labelled epsilon and a galvanometer circle labelled G to a small triangular jockey contact resting on the wire, with the positive terminals of both cells clearly drawn at the A end. A dashed grey dimension line marks the length l from A to the jockey. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Potential gradient $ k = V/L $. Balance gives $ \\varepsilon = kl $ with **zero** current drawn — which is why it measures emf and a voltmeter cannot.\n- Comparing two cells: $ \\varepsilon_1/\\varepsilon_2 = l_1/l_2 $, and $ k $ cancels.\n- Internal resistance: $ r = R\\left(\\frac{l_1-l_2}{l_2}\\right) $, with $ l_1 $ open-circuit and $ l_2 $ loaded.\n- The driver cell must exceed the test emf, and like terminals must join the same end. Deflection the same way at **both** ends means one of these is wrong.\n- Smaller $ k $ → more sensitive. Longer wire, or more series resistance in the driver circuit.',
    }),
    b('text', 15, {
      markdown: 'Next: the galvanometer has been the detector in all three of these instruments. Time to look inside it — and to turn it into the meters you actually use.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A potentiometer measures the emf of a cell accurately because at balance',
          ['no current is drawn from the cell', 'the cell is short-circuited', 'the galvanometer resistance is very large', 'the driver cell is identical to the test cell'],
          0,
          'With zero current from the cell, the $ Ir $ drop vanishes and the terminal voltage equals the emf exactly. A voltmeter must draw current to deflect, so it always reads slightly low.',
          2),
        q('The sensitivity of a potentiometer is increased by',
          ['reducing the potential gradient along the wire', 'increasing the potential gradient', 'using a shorter wire', 'using a lower-resistance galvanometer'],
          0,
          'A smaller gradient spreads a given voltage over a longer length, so each millimetre of scale represents a smaller voltage and finer differences can be resolved. A longer wire or extra series resistance in the driver circuit both achieve it.',
          2),
        q('While using a potentiometer, the galvanometer deflects in the **same** direction at both ends of the wire. The likely cause is',
          ['the driver cell emf is smaller than the test cell emf', 'the wire is too long', 'the galvanometer is faulty', 'the balance point is exactly at the middle'],
          0,
          'If the drop across the whole wire is less than the emf being measured, no point on the wire can balance it — or the cells have been connected so their emfs add. Either way there is no null anywhere, and the deflection never reverses.',
          3),
      ],
    }),
  ],
};

// ── p15 · Inside a Meter ─────────────────────────────────────────────────────
const p15 = {
  page_number: 15,
  slug: 'inside-a-meter',
  title: 'Inside a Meter',
  subtitle: 'One galvanometer, two instruments, two resistors',
  glossary: [
    { term: 'galvanometer', definition: 'A sensitive instrument that deflects in proportion to the small current passing through it.' },
    { term: 'shunt', definition: 'A small resistance connected in parallel with a galvanometer to divert most of the current, converting it into an ammeter.' },
    { term: 'multiplier', definition: 'A large resistance connected in series with a galvanometer to convert it into a voltmeter.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'An ammeter and a voltmeter look like completely different instruments. Inside, they are the **same** instrument — the same coil, the same magnet, the same needle.\n\nThe only difference is one resistor. A small one in parallel makes an ammeter; a large one in series makes a voltmeter.\n\nThat is the whole of this page, and it is a genuinely satisfying piece of engineering.',
    }),
    b('text', 1, {
      markdown: 'A **galvanometer** deflects in proportion to the current through its coil. Two numbers describe it:\n\n- $ G $ — the resistance of its coil, typically tens of ohms\n- $ I_g $ — the current needed for full-scale deflection, typically a few milliamps or less\n\nOn its own it is useless as a practical meter. It is far too sensitive to measure an ampere, and it has the wrong resistance for measuring voltage. Both problems are fixed with one resistor each.',
    }),
    b('heading', 2, {
      text: 'Making an ammeter — a small resistance in parallel',
      level: 2,
      objective: 'Derive the shunt resistance needed for a given full-scale current.',
    }),
    b('text', 3, {
      markdown: 'An ammeter goes **in series** with the circuit, so all the current passes it. To measure a current $ I $ much larger than $ I_g $, put a small resistance $ S $ — the **shunt** — in parallel with the coil, so that most of the current bypasses it.\n\nThe two are in parallel, so they share the same voltage:\n\n$ I_gG = (I - I_g)S $',
    }),
    b('latex_block', 4, {
      latex: 'S = \\frac{I_g\\,G}{I - I_g}',
      label: 'Shunt resistance for an ammeter',
      note: 'A SMALL resistance, in PARALLEL. It also lowers the meter\'s overall resistance, which is what you want.',
      highlight: true,
    }),
    b('text', 5, {
      markdown: 'And the combined resistance of the finished ammeter is $ \\frac{GS}{G+S} $, which is **smaller than $ S $** — smaller than either part.\n\nThat is exactly right. An ammeter is inserted into the circuit it measures, so it must have as little resistance as possible or it will change the current it was meant to read. An **ideal ammeter has zero resistance**.',
    }),
    b('heading', 6, {
      text: 'Making a voltmeter — a large resistance in series',
      level: 2,
      objective: 'Derive the multiplier resistance needed for a given full-scale voltage.',
    }),
    b('text', 7, {
      markdown: 'A voltmeter goes **across** the component it measures. To measure a voltage $ V $ while allowing only $ I_g $ through the coil, put a large resistance $ R $ — the **multiplier** — in series with it.\n\nThe whole $ V $ is dropped across the pair:\n\n$ V = I_g(G + R) $',
    }),
    b('latex_block', 8, {
      latex: 'R = \\frac{V}{I_g} - G',
      label: 'Multiplier resistance for a voltmeter',
      note: 'A LARGE resistance, in SERIES. It raises the meter\'s total resistance, which is what you want.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'The finished voltmeter has resistance $ G + R $, which is **larger** than either part — and deliberately so. A voltmeter is placed in parallel with a component, and it must draw as little current as possible or it will lower the voltage it was meant to read. An **ideal voltmeter has infinite resistance**.\n\nSo the two conversions pull in opposite directions, and the reason is entirely about how each meter is connected:',
    }),
    b('comparison_card', 10, {
      title: 'The two conversions',
      columns: [
        {
          heading: 'Ammeter',
          points: [
            'Connected **in series** with the circuit',
            'Needs **low** resistance, ideally zero',
            'Shunt $ S = \\frac{I_gG}{I-I_g} $, small, in **parallel**',
            'Final resistance $ \\frac{GS}{G+S} $ — less than either part',
            'Connecting it in parallel by mistake = a short circuit',
          ],
        },
        {
          heading: 'Voltmeter',
          points: [
            'Connected **in parallel** with the component',
            'Needs **high** resistance, ideally infinite',
            'Multiplier $ R = \\frac{V}{I_g} - G $, large, in **series**',
            'Final resistance $ G+R $ — more than either part',
            'Connecting it in series by mistake = almost no current flows',
          ],
        },
      ],
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'A student accidentally connects an ammeter **in parallel** with a resistor instead of in series. What happens?',
      options: [
        'A very large current flows through the ammeter and may destroy it',
        'The ammeter reads zero, since it has no resistance to drop a voltage',
        'The ammeter still reads the resistor\'s current, just as it would in series',
        'Nothing happens — the reading is simply too small to be of any use',
      ],
      reveal: '**A very large current flows, and the ammeter is likely to be destroyed.**\n\nAn ammeter is built to have almost no resistance. Connect it across a component and you have placed a near-perfect short circuit in parallel with that component — so nearly all the current abandons the resistor and pours through the meter.\n\nThe current is then limited only by the rest of the circuit, and it can easily be hundreds of times the meter\'s rating.\n\n**The mirror mistake is harmless but useless.** A voltmeter accidentally placed in series has enormous resistance, so it throttles the current almost to nothing. Nothing is damaged; the circuit simply stops working, and the voltmeter reads close to the full supply voltage.\n\nSo: **wrongly connected ammeter — expensive. Wrongly connected voltmeter — merely wrong.**',
      difficulty_level: 2,
    }),
    b('worked_example', 12, {
      label: 'one galvanometer, converted twice',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A galvanometer has resistance $ G = 50\\ \\Omega $ and gives full-scale deflection at $ I_g = 2 $ mA. Convert it into (a) an ammeter reading up to $ 1 $ A, and (b) a voltmeter reading up to $ 10 $ V.',
      solution: '**(a) The ammeter.** Use a shunt in parallel:\n\n$ S = \\frac{I_gG}{I-I_g} = \\frac{(2\\times10^{-3})(50)}{1 - 2\\times10^{-3}} = \\frac{0.1}{0.998} = 0.100\\ \\Omega $\n\nA tenth of an ohm — a very short, thick piece of wire. And the finished ammeter has resistance\n\n$ \\frac{GS}{G+S} = \\frac{50 \\times 0.1}{50.1} \\approx 0.0998\\ \\Omega $\n\nessentially the shunt alone, which is exactly what an ammeter should be.\n\n**(b) The voltmeter.** Use a multiplier in series:\n\n$ R = \\frac{V}{I_g} - G = \\frac{10}{2\\times10^{-3}} - 50 = 5000 - 50 = 4950\\ \\Omega $\n\nThe finished voltmeter has resistance $ 50 + 4950 = 5000\\ \\Omega $.\n\n**Look at the two numbers.** From the same galvanometer we built one instrument of $ 0.1\\ \\Omega $ and another of $ 5000\\ \\Omega $ — a ratio of fifty thousand. Two resistors, opposite directions, completely different instruments.\n\n**A shortcut worth noticing.** Since $ I_g \\ll I $, the shunt is very nearly $ S \\approx I_gG/I $. And since $ G \\ll V/I_g $, the multiplier is very nearly $ R \\approx V/I_g $. Both approximations are good to a fraction of a per cent here, and they make mental estimates easy.',
    }),
    b('image', 13, {
      src: '',
      alt: 'A galvanometer with a shunt in parallel forming an ammeter, and with a multiplier in series forming a voltmeter',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Same movement, two resistors, two instruments.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, in thin dim-grey line art. Left panel labelled Ammeter: a galvanometer drawn as a circle with a needle labelled G, with a short thick amber resistor bar labelled S connected directly in parallel across it; a thick orange arrow enters, mostly diverting through the shunt with only a thin arrow through the coil. Right panel labelled Voltmeter: the same galvanometer circle with a long amber resistor zigzag labelled R connected in series after it, and a single very thin orange arrow through the whole chain. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Galvanometer: coil resistance $ G $, full-scale current $ I_g $.\n- **Ammeter** = galvanometer + **small shunt in parallel**, $ S = \\frac{I_gG}{I-I_g} $. Goes **in series**; ideal resistance **zero**.\n- **Voltmeter** = galvanometer + **large multiplier in series**, $ R = \\frac{V}{I_g} - G $. Goes **in parallel**; ideal resistance **infinite**.\n- A wrongly connected ammeter is a short circuit and may be destroyed; a wrongly connected voltmeter merely stops the circuit.\n- Useful approximations: $ S \\approx I_gG/I $ and $ R \\approx V/I_g $.',
    }),
    b('text', 15, {
      markdown: 'That closes Chapter 3. Charge is no longer sitting still: you can now find the current in any network, work out where the heat goes, and measure a resistance or an emf to a precision your meters could not manage on their own.\n\nOne thing has been left unexplained throughout, though. The galvanometer works because a current-carrying coil in a magnetic field **twists**. Why it does that is the subject of Chapter 5 — and before that, Chapter 4 asks what a magnet is in the first place.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A galvanometer is converted into an ammeter by connecting',
          ['a small resistance in parallel with it', 'a large resistance in series with it', 'a large resistance in parallel with it', 'a small resistance in series with it'],
          0,
          'The shunt diverts most of the current past the delicate coil and keeps the meter\'s overall resistance very low — essential, because an ammeter is inserted in series and must not alter the current it reads.',
          1),
        q('An ideal voltmeter should have',
          ['infinite resistance', 'zero resistance', 'a resistance equal to the circuit resistance', 'a very small resistance'],
          0,
          'A voltmeter sits in parallel with the component, so any current it draws reduces the voltage being measured. Infinite resistance means it draws nothing and reads the true value.',
          1),
        q('A galvanometer of resistance $ 100\\ \\Omega $ gives full-scale deflection at $ 1 $ mA. To convert it into a voltmeter reading up to $ 5 $ V, connect in series a resistance of',
          ['$ 4900\\ \\Omega $', '$ 5000\\ \\Omega $', '$ 5100\\ \\Omega $', '$ 100\\ \\Omega $'],
          0,
          '$ R = V/I_g - G = 5/10^{-3} - 100 = 5000 - 100 = 4900\\ \\Omega $. Answering $ 5000\\ \\Omega $ forgets to subtract the coil\'s own resistance — which is the total meter resistance, not the multiplier.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p11, p12, p13, p14, p15]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
