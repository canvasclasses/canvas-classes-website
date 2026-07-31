'use strict';
/**
 * Class 12 Physics · Ch.7 "Alternating Current" — pages 5–8.
 * One circuit element at a time: R, then L, then C — and then the first
 * combination, L-R and C-R, which is the step NCERT skips on its way to the
 * three-element circuit.
 *
 * CONVENTIONS FIXED HERE AND USED UNCHANGED BY p9–p13:
 *   • The SOURCE VOLTAGE is always the reference:  $ v = v_0\sin\omega t $.
 *   • Phasors rotate ANTICLOCKWISE. A phasor drawn ahead (anticlockwise) of
 *     another LEADS it.
 *   • Resistor:  $ i = \frac{v_0}{R}\sin\omega t $              — in phase.
 *   • Inductor:  $ i = \frac{v_0}{X_L}\sin(\omega t - \pi/2) $  — current LAGS
 *     the voltage by 90°. (Equivalently: the voltage leads the current.)
 *   • Capacitor: $ i = \frac{v_0}{X_C}\sin(\omega t + \pi/2) $  — current LEADS
 *     the voltage by 90°.
 *   • The phase angle $ \phi $ is ALWAYS "the angle by which the source voltage
 *     leads the current". So $ \phi > 0 $ for L-R (inductive) and $ \phi < 0 $
 *     for C-R (capacitive), and the general series form is
 *     $ \tan\phi = \frac{X_L - X_C}{R} $ — which is exactly what p9 needs.
 *     On p8 the two cases are worked separately with magnitudes, and the signed
 *     form is stated at the close so p9 inherits it.
 *
 * Run: node scripts/physics12-book/build_ch7_b_elements.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 7;

// ── p5 · AC Through a Resistor ───────────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'ac-through-a-resistor',
  title: 'AC Through a Resistor',
  subtitle: 'The simple case, and the baseline for everything after it',
  glossary: [
    { term: 'in phase', definition: 'Two alternating quantities are in phase when they reach zero together and reach their peaks together — their phasors point the same way, with no angle between them.' },
    { term: 'average power', definition: 'The mean rate at which a circuit element converts electrical energy, taken over one complete cycle. For a resistor, $ P = V_{\\text{rms}}I_{\\text{rms}} $.' },
    { term: 'peak power', definition: 'The largest instantaneous value of $ vi $ during a cycle. In a purely resistive AC circuit it is exactly twice the average power.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'The current in the wire feeding a room heater reverses direction **one hundred times every second**. Twice in each cycle it stops dead and passes through zero.\n\nSo for a hundred instants a second the heater is carrying no current at all, and therefore producing no heat at all.\n\nAnd yet the element glows perfectly steadily, and the room warms at a perfectly steady rate. Nothing about the heat output looks like it is being switched on and off a hundred times a second.\n\nWhy not?',
      hint: 'Two separate questions are hiding here. Does the *heating* really reverse when the current does? And how quickly can a hot piece of metal actually cool down?',
      reveal: 'Two answers, and both matter.\n\n**First: the heating never reverses.** The power delivered to a resistor is $ i^{2}R $, and squaring a negative number gives a positive one. Current running backwards heats the element exactly as well as current running forwards. So the output is not alternating between heating and cooling — it is pulsing between full heating and none, twice per cycle.\n\n**Second: the element cannot follow a pulse that fast.** A hot metal wire takes a good fraction of a second to lose its heat. Asked to cool down in five milliseconds, it simply does not manage it, and settles at the *average*.\n\nThat word — average — is what this page is really about. A resistor on AC is the simplest circuit there is, and it is where the idea of an average power gets its meaning. Every page after this one is measured against it.',
    }),
    b('text', 1, {
      markdown: 'Put a single resistor $ R $ across an AC source. Nothing is stored anywhere in this circuit — no field builds up in a coil, no charge collects on a plate. So a resistor has no memory, and it responds to the voltage across it **at that instant**, with no delay whatsoever.\n\nThat sentence is the whole of the physics on this page. Everything below is its consequences.',
    }),
    b('heading', 2, {
      text: 'The current follows the voltage exactly',
      level: 2,
      objective: 'Write down the current in a purely resistive AC circuit and state its phase relation to the applied voltage.',
    }),
    b('text', 3, {
      markdown: 'Take the source voltage as our reference, and keep it as the reference for the whole chapter:\n\n$ v = v_0\\sin\\omega t $\n\nOhm\'s law holds at every instant — it is a statement about what a resistor does *now*, not on average — so at every instant\n\n$ i = \\frac{v}{R} = \\frac{v_0}{R}\\sin\\omega t $\n\nRead the shape of that result before the algebra. The current is a sine wave of the **same frequency** as the voltage, and there is **no extra angle inside the bracket**. The two go through zero together and peak together.\n\nSo they are **in phase**, and the peak values obey Ohm\'s law just as the instantaneous ones do:\n\n$ i_0 = \\frac{v_0}{R} $\n\nDividing both sides by $ \\sqrt{2} $ turns that into the rms statement, which is the one you will actually use: $ I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{R} $.',
    }),
    b('latex_block', 4, {
      latex: 'i = \\frac{v_0}{R}\\sin\\omega t = i_0\\sin\\omega t',
      label: 'Current through a pure resistor',
      note: 'Same frequency, no phase difference. In a phasor picture the two arrows lie on top of each other.',
      highlight: true,
    }),
    b('image', 5, {
      src: '',
      alt: 'Voltage and current waveforms for a resistor drawn on the same axes, peaking together, beside a phasor diagram with both arrows along the same direction',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Both curves cross zero together and peak together. The two phasors point the same way, so the angle between them is zero.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide composition split into two panels by a thin vertical rule. Left panel: a pair of sine waves drawn on a common horizontal time axis with a faint grey zero line, one wave in warm amber and one in a slightly brighter orange, exactly in step so that they cross zero at the same points and reach their crests at the same points; the amber wave has a slightly larger amplitude than the orange one. Small tick marks on the axis, no grid. Right panel: a phasor diagram — a faint dim-grey circle with a horizontal reference line, and two straight arrows starting at the centre and pointing in the same direction at a shallow angle above the horizontal, one warm amber and slightly longer, one brighter orange and slightly shorter, drawn just far enough apart to be distinguishable but clearly parallel; a small curved arrow at the rim shows anticlockwise rotation. Labels v and i on the corresponding wave and arrow. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'A pure resistor is connected across an AC supply. At the instant the supply voltage passes through zero, what is the current?',
      options: [
        'At its peak value, since the current leads here',
        'Half of its peak value at that same instant',
        'Zero as well, at that very same instant',
        'At its peak value, since the current lags here',
      ],
      correct_index: 2,
      reveal: '**Zero as well, at the very same instant.**\n\nThe reason is worth saying out loud rather than quoting: $ i = v/R $ holds **at every instant**, and $ R $ is a fixed number. If $ v $ is zero right now, then $ v/R $ is zero right now. There is nothing in a resistor that can hold a current going after the voltage has gone.\n\nCompare that with what is coming. In a coil the current is set by the *rate* at which the voltage acts, not by its value, so the current can be at full strength at the very moment the voltage is zero. In a capacitor the same is true the other way round. Those elements have somewhere to store energy, so they can lag or lead.\n\nA resistor stores nothing, so it can do neither. **Zero voltage, zero current, always, with no delay.** That is what "in phase" means, and it is why this page is the baseline the rest of the chapter is measured against.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Power: why the average is not zero',
      level: 2,
      objective: 'Derive the average power in a resistive AC circuit and explain why the rms values are the right ones to multiply.',
    }),
    b('text', 8, {
      markdown: 'The mean value of the current over a full cycle is **zero** — page 3 made that point, and it is why a plain average is useless for AC.\n\nBut the heating is not. The instantaneous power delivered to the resistor is\n\n$ p = vi = i^{2}R = i_0^{2}R\\sin^{2}\\omega t $\n\nand $ \\sin^{2}\\omega t $ is **never negative**. It swings between $ 0 $ and $ 1 $, and over a whole cycle its average value is exactly $ \\frac{1}{2} $ — the sine spends as much time above the half-way line as below it. So\n\n$ P = \\frac{1}{2}i_0^{2}R = \\left(\\frac{i_0}{\\sqrt{2}}\\right)^{2}R = I_{\\text{rms}}^{2}R $\n\nAnd there is the payoff for all the work of page 3. **The rms value was defined precisely so that this line would come out looking like the DC formula.** An rms current of 2 A heats a resistor at exactly the rate a steady DC current of 2 A would. That is not a coincidence; it is the definition doing its job.',
    }),
    b('latex_block', 9, {
      latex: 'P = V_{\\text{rms}}I_{\\text{rms}} = I_{\\text{rms}}^{2}R = \\frac{V_{\\text{rms}}^{2}}{R}',
      label: 'Average power in a purely resistive AC circuit',
      note: 'Identical in form to the DC formulas, provided you use rms values — and only for a resistor. From p6 onward a factor cos φ appears.',
      highlight: true,
    }),
    b('worked_example', 10, {
      label: 'a heater on the mains',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 100\\ \\Omega $ heating element is connected to the domestic supply, quoted as $ 220 $ V, $ 50 $ Hz. Find the rms current, the peak current, the peak voltage, the average power and the peak power.',
      solution: '**First, read the "220 V" correctly.** Page 3 settled this: a quoted mains voltage is always the **rms** value, so $ V_{\\text{rms}} = 220 $ V. This one habit prevents a whole family of factor-of-$ \\sqrt{2} $ errors.\n\n**rms current.**\n\n$ I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{R} = \\frac{220}{100} = 2.2\\ \\text{A} $\n\n**Peak values.** Multiply each rms value by $ \\sqrt{2} = 1.414 $:\n\n$ v_0 = 220\\sqrt{2} = 311\\ \\text{V} $\n\n$ i_0 = 2.2\\sqrt{2} = 3.11\\ \\text{A} $\n\nSo the insulation in that wall socket is actually facing $ 311 $ V, not $ 220 $ V — which is why appliances are rated well above the quoted figure.\n\n**Average power.**\n\n$ P = V_{\\text{rms}}I_{\\text{rms}} = 220\\times 2.2 = 484\\ \\text{W} $\n\nCheck it a second way: $ I_{\\text{rms}}^{2}R = (2.2)^{2}(100) = 484 $ W ✓\n\n**Peak power.** This one is worth doing because students rarely meet it.\n\n$ p_{\\text{max}} = v_0 i_0 = 311\\times 3.11 = 967\\ \\text{W} $\n\nwhich is **twice** the average, to rounding. That is not a fluke: $ v_0 i_0 = (\\sqrt{2}V_{\\text{rms}})(\\sqrt{2}I_{\\text{rms}}) = 2V_{\\text{rms}}I_{\\text{rms}} $, always.\n\n**What the numbers are telling you.** The element is not delivering a steady $ 484 $ W. It is delivering a power that swings from $ 0 $ to $ 967 $ W, a hundred times a second, and averages $ 484 $ W. The element is far too slow to follow that, so it sits at the average and glows steadily — which is exactly the puzzle this page opened with.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'quantitative',
      prompt: 'The average value of an alternating current over one complete cycle is zero. Why, then, does the resistor it flows through still get hot?',
      options: [
        'Heating depends on $ i^{2} $, which is never negative',
        'The average current is not truly zero, only small',
        'The resistor is heated on positive half-cycles alone',
        'Heating depends on the mean current, which is not zero',
      ],
      correct_index: 0,
      reveal: '**Because the heating depends on $ i^{2} $, and a square is never negative.**\n\nRun the two averages side by side, because they are different quantities and confusing them is the whole trap:\n\n- Average of $ i $ over a cycle: the positive half exactly cancels the negative half, so it is $ 0 $.\n- Average of $ i^{2} $ over a cycle: **both** halves contribute positively, so it is $ \\frac{i_0^{2}}{2} $, comfortably not zero.\n\nHeat is produced by $ i^{2}R $, so it is the **second** average that the heating cares about — and the direction of the current never enters it at all. Electrons drifting left heat the wire exactly as well as electrons drifting right.\n\nThe claim that only half the cycle heats is a common one and it is wrong by a factor of two: during the reverse half the element is just as hot, which is precisely why the average of $ i^{2} $ is $ \\frac{1}{2} $ and not $ \\frac{1}{4} $.\n\n**And this is the entire reason rms exists.** The mean of the current is useless for AC, so we take the mean of its square and then square-root it — which produces the one number that predicts the heating correctly.',
      difficulty_level: 2,
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'A filament bulb is too slow to follow the hundred-per-second pulse of power, so it glows steadily. **A fluorescent tube and a cheap LED are not.**\n\nThey have almost no thermal inertia, so their brightness really does dip to nearly nothing a hundred times a second. Your eye cannot see it — the flicker is far too fast — but a rotating object lit by such a lamp can be caught at the same point in its rotation on every flash, and it then appears to stand still, or to creep slowly backwards.\n\nThis is a genuine hazard in workshops. A lathe chuck or a drill spinning at the wrong speed under a single fluorescent tube can look completely stationary, and people have reached out towards machinery that was in fact running at full speed. Workshops fix it by lighting the machine from tubes on **different phases** of the supply, so the dips never coincide, or by using lamps that keep glowing between pulses.\n\nA phone camera makes the effect visible: point one at a cheap LED bulb and you will often see dark bands rolling through the frame. Those bands are $ 100 $ Hz pulses of $ i^{2}R $, photographed.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art, two vignettes side by side separated by a thin vertical rule. Left vignette: a hot filament bulb drawn in outline with a steady even amber glow around it, and beneath it a flat horizontal amber line labelled as steady brightness. Right vignette: a slim tube lamp in outline with a banded glow, and beneath it a series of sharp amber pulses along the same horizontal axis touching down to the baseline between each pulse. Above the right vignette, a small three-bladed rotor drawn in dim grey with faint ghosted duplicate blades suggesting an apparently frozen rotation. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- A resistor stores nothing, so it responds **instantly**: $ i = v/R $ at every instant.\n- Voltage and current are therefore **in phase**. Phase difference $ = 0 $.\n- Peak and rms values obey Ohm\'s law too: $ i_0 = v_0/R $ and $ I_{\\text{rms}} = V_{\\text{rms}}/R $.\n- $ P = V_{\\text{rms}}I_{\\text{rms}} = I_{\\text{rms}}^{2}R = V_{\\text{rms}}^{2}/R $ — the DC formulas, with rms values.\n- The mean of $ i $ is zero; the mean of $ i^{2} $ is $ i_0^{2}/2 $. Heating cares about the second one.\n- Peak power is exactly **twice** the average power in a purely resistive circuit.\n- A quoted mains voltage is always **rms**. $ 220 $ V rms means peaks of $ 311 $ V.',
    }),
    b('text', 14, {
      markdown: 'Next: swap the resistor for a coil. Nothing about the coil resists current in the ordinary sense — its wire is nearly a short circuit — and yet it will turn out to limit the current severely, and to throw the current a quarter of a cycle out of step with the voltage.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('In a purely resistive AC circuit, the phase difference between the applied voltage and the current is',
          ['zero — they are in phase', '$ 90^\\circ $, with the current lagging', '$ 90^\\circ $, with the current leading', '$ 180^\\circ $, exactly out of step'],
          0,
          'Ohm\'s law holds instant by instant and $ R $ is a fixed number, so the current copies the voltage waveform with no delay at all. The two phasors lie along the same direction.',
          1),
        q('A resistor carries an alternating current of rms value $ I $. The average power it dissipates is',
          ['$ I^{2}R $', '$ 2I^{2}R $', '$ I^{2}R/2 $', 'zero over a full cycle'],
          0,
          'The rms value is defined so that it heats exactly like the same steady DC current would, which is why no factor of two survives. A zero answer confuses the mean of the current with the mean of its square.',
          2),
        q('For a resistor on an AC supply, the peak power compared with the average power is',
          ['twice as large', 'the same size', 'half as large', 'four times as large'],
          0,
          'Peak power is $ v_0 i_0 $, and each peak value is $ \\sqrt{2} $ times its rms value, so the two factors of $ \\sqrt{2} $ multiply to give exactly $ 2V_{\\text{rms}}I_{\\text{rms}} $.',
          3),
      ],
    }),
  ],
};

// ── p6 · AC Through an Inductor ──────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'ac-through-an-inductor',
  title: 'AC Through an Inductor',
  subtitle: 'A quarter cycle behind, and no power consumed at all',
  glossary: [
    { term: 'inductive reactance', definition: 'The opposition a pure inductor offers to alternating current: $ X_L = \\omega L = 2\\pi f L $. Measured in ohms, but it dissipates no energy.' },
    { term: 'phase lag', definition: 'A quantity lags another when it reaches the same point in its cycle later. In a pure inductor the current lags the voltage by a quarter cycle, or $ 90^\\circ $.' },
    { term: 'choke', definition: 'An inductor used deliberately to limit an alternating current. Because its opposition is reactive, it wastes almost no energy as heat.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Take a coil of thick copper wire — a few hundred turns wound on an iron core. Put a multimeter across it and it reads perhaps $ 3\\ \\Omega $. As far as a resistance meter is concerned, this thing is very nearly a piece of wire.\n\nConnect it straight across a car battery and it behaves like one: an enormous current, and something starts smoking.\n\nNow connect that **same coil** to the $ 220 $ V mains, which is seventeen times the voltage. It draws under an amp and sits there quite happily, barely warm.\n\nSeventeen times the voltage, a fraction of the current, and not a single thing about the coil has changed. So what is limiting the current?',
      hint: 'Whatever is doing the limiting is not there for the battery. What is different about the mains supply — not about the coil?',
      reveal: 'What is different is that the mains **keeps changing**, and a coil objects to change.\n\nChapter 6 said it: a changing current through a coil sets up a back emf, $ \\varepsilon = -L\\frac{di}{dt} $, that fights the change. With the battery, the current is steady after the first instant, so $ \\frac{di}{dt} = 0 $ and there is no back emf at all — the coil is just $ 3\\ \\Omega $ of wire, and it duly melts.\n\nOn the mains, the current is asked to reverse a hundred times a second. It is never steady, not even for a moment, so the back emf is never absent. It is present all the time, fighting all the time, and the current that gets through is small.\n\n**So the opposition here is not resistance.** It costs nothing in heat, and it depends entirely on how fast the supply is changing. It has its own name — **inductive reactance** — and this page works out exactly how big it is.',
    }),
    b('text', 1, {
      markdown: 'Take an ideal inductor: pure inductance $ L $, zero resistance. Across it the source drives\n\n$ v = v_0\\sin\\omega t $\n\nand the defining relation of an inductor, from Chapter 6, is that the voltage across it is set by the **rate of change** of the current through it, not by the current itself:\n\n$ v = L\\frac{di}{dt} $\n\nThat one difference — rate instead of value — produces everything on this page.',
    }),
    b('heading', 2, {
      text: 'The coil sets the rate, so the current runs late',
      level: 2,
      objective: 'Derive the current in a pure inductor on an AC supply and state its phase relative to the applied voltage.',
    }),
    b('text', 3, {
      markdown: 'Rearrange and integrate. From $ v = L\\frac{di}{dt} $,\n\n$ \\frac{di}{dt} = \\frac{v_0}{L}\\sin\\omega t $\n\nIntegrating with respect to time — and taking the constant of integration as zero, since a steady DC offset has nowhere to come from in a pure AC circuit —\n\n$ i = -\\frac{v_0}{\\omega L}\\cos\\omega t $\n\nThat minus-cosine is correct but hard to read, so rewrite it as a sine. Since $ -\\cos\\theta = \\sin(\\theta - 90^\\circ) $,\n\n$ i = \\frac{v_0}{\\omega L}\\sin\\left(\\omega t - \\frac{\\pi}{2}\\right) $\n\nNow the answer speaks. Same frequency as before — but there is a $ -\\frac{\\pi}{2} $ sitting inside the bracket, which was not there for the resistor.\n\nA **negative** angle inside means the current reaches any given stage of its cycle a quarter of a period **after** the voltage does. The current **lags** the voltage by $ 90^\\circ $. Equivalently, and it is the same sentence: the voltage **leads** the current by $ 90^\\circ $.\n\nAnd notice what the peak current came out as. It is $ \\frac{v_0}{\\omega L} $ — which has the shape of Ohm\'s law, with $ \\omega L $ standing where $ R $ used to stand.',
    }),
    b('latex_block', 4, {
      latex: 'i = \\frac{v_0}{\\omega L}\\sin\\left(\\omega t - \\frac{\\pi}{2}\\right)',
      label: 'Current through a pure inductor',
      note: 'The minus inside the bracket is the lag. Everything on this page follows from it and from the size of the ωL underneath.',
      highlight: true,
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'The relation $ v = L\\frac{di}{dt} $ says the voltage across a coil is fixed by the **rate** at which the current is changing. At the instant the current is exactly at its peak, what is the voltage across a pure inductor?',
      options: [
        'Also at its peak, since the two rise together',
        'Zero, because at a peak $ \\frac{di}{dt} = 0 $',
        'Half its peak, the two being $ 45^\\circ $ apart',
        'At its peak but negative, being fully out of step',
      ],
      correct_index: 1,
      reveal: '**Zero — because at a peak the current has momentarily stopped changing.**\n\nThink of a ball thrown straight up. At the very top it is not moving, even though it was moving fast a moment before and will be moving fast a moment after. The top of any smooth curve is a place where the rate of change is zero.\n\nThe current curve is no different. At its crest, $ \\frac{di}{dt} = 0 $, so $ v = L\\frac{di}{dt} = 0 $. Maximum current, zero voltage — at the same instant.\n\nAnd the mirror statement is just as important: where the current curve crosses **zero** it is at its steepest, so $ \\frac{di}{dt} $ is largest there, and the voltage is at its **peak**. Zero current, maximum voltage.\n\nThose two facts together *are* the $ 90^\\circ $ phase difference. It is not an extra rule to remember alongside the formula — it is the formula, read in words. A sine and its own derivative are always a quarter cycle apart, and an inductor is a device whose voltage is proportional to the derivative of its current.\n\n**This is also why a resistor cannot do this.** For a resistor, $ v = iR $ involves the current\'s *value*, so peaks line up with peaks. Only an element that responds to a *rate* can throw things out of step.',
      difficulty_level: 3,
    }),
    b('image', 6, {
      src: '',
      alt: 'Voltage and current waveforms for an inductor, the current crest arriving a quarter cycle after the voltage crest, beside a phasor diagram with the current arrow ninety degrees behind the voltage arrow',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The current crest arrives a quarter cycle late. On the phasor diagram, with rotation anticlockwise, the current arrow trails the voltage arrow by a right angle.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide composition split into two panels by a thin vertical rule. Left panel: two sine waves on a shared horizontal time axis with a faint grey zero line — one in brighter orange labelled v, and one in warm amber labelled i whose crests are shifted a quarter of a wavelength to the right of the orange crests; thin dashed grey vertical guide lines drop from one orange crest and the following amber crest to the axis, with a small bracket between them marking a quarter period. Right panel: a phasor diagram — a faint dim-grey circle with a horizontal reference line, a brighter orange arrow from the centre pointing along the horizontal reference labelled v, and a warm amber arrow from the centre pointing vertically downward at a right angle to it labelled i, with a small right-angle square drawn between them and a curved arrow at the rim showing anticlockwise rotation. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('heading', 7, {
      text: 'Inductive reactance, and why frequency decides everything',
      level: 2,
      objective: 'Define inductive reactance, compute it, and predict how an inductor behaves at low and high frequency.',
    }),
    b('text', 8, {
      markdown: 'The quantity standing where $ R $ stood is called the **inductive reactance**:\n\n$ X_L = \\omega L = 2\\pi f L $\n\nIts unit is the **ohm**, because $ v_0/i_0 $ must have the units of an ohm whatever the element. But an ohm of reactance is not an ohm of resistance, and the difference is worth being clear about now rather than later: **reactance limits current without dissipating energy**. No heat comes out of an ideal inductor.\n\nNow read the frequency dependence, because it is the whole personality of the component:\n\n- **At $ f = 0 $ — that is, DC — $ X_L = 0 $.** The coil is just its wire. This is the car-battery case from the top of the page, and why the coil smoked.\n- **As $ f $ rises, $ X_L $ rises in proportion.** Ten times the frequency, ten times the opposition, one tenth of the current.\n\nSo an inductor **passes DC and low frequencies freely, and increasingly blocks high frequencies.** That single sentence is what an inductor is *for* in a circuit, and page 7 will show a capacitor doing precisely the opposite.\n\nThe physical reason is not mysterious. Higher frequency means the current has to reverse in less time, which means a steeper $ \\frac{di}{dt} $, which means a bigger back emf fighting it. Faster change, harder fight.',
    }),
    b('latex_block', 9, {
      latex: 'X_L = \\omega L = 2\\pi f L \\qquad\\text{and}\\qquad I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{X_L}',
      label: 'Inductive reactance',
      note: 'Measured in ohms, rises with frequency, and dissipates nothing. At DC it vanishes.',
      highlight: true,
    }),
    b('worked_example', 10, {
      label: 'the same coil at three frequencies',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A pure inductor of $ 0.50 $ H is connected across a $ 220 $ V supply. Find the rms current when the frequency is $ 50 $ Hz. Then find it again at $ 5 $ Hz and at $ 500 $ Hz, and state the average power drawn in each case.',
      solution: '**At $ 50 $ Hz.**\n\n$ X_L = 2\\pi f L = 2\\pi(50)(0.50) = 157\\ \\Omega $\n\n$ I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{X_L} = \\frac{220}{157} = 1.4\\ \\text{A} $\n\n**At $ 5 $ Hz.** The frequency is ten times smaller, and $ X_L $ is directly proportional to $ f $, so there is no need to redo the whole sum:\n\n$ X_L = 15.7\\ \\Omega $, so $ I_{\\text{rms}} = \\frac{220}{15.7} = 14\\ \\text{A} $\n\n**At $ 500 $ Hz.** Ten times larger, so ten times the reactance:\n\n$ X_L = 1570\\ \\Omega $, so $ I_{\\text{rms}} = \\frac{220}{1570} = 0.14\\ \\text{A} $\n\n**A hundredfold range of current from the same coil and the same voltage**, produced entirely by changing how fast the supply alternates. Nothing about the component was touched.\n\n**Average power, in all three cases: zero.** The next section proves it, but the reason is already visible — an ideal inductor has no resistance, so there is nothing anywhere in it to turn electrical energy into heat.\n\n**A caution about the real component.** A real coil has a small winding resistance $ r $, so it does warm slightly and the true opposition is $ \\sqrt{r^{2} + X_L^{2}} $ — which is page 8\'s formula. When $ X_L $ is $ 157\\ \\Omega $ and $ r $ is a few ohms, treating the coil as ideal costs you almost nothing. At $ 5 $ Hz, where $ X_L $ is only $ 15.7\\ \\Omega $, that approximation is already getting shaky.',
    }),
    b('heading', 11, {
      text: 'The average power is exactly zero',
      level: 2,
      objective: 'Show that a pure inductor consumes no average power, and explain where the energy goes during a cycle.',
    }),
    b('text', 12, {
      markdown: 'Multiply the instantaneous voltage and current together:\n\n$ p = vi = \\left(v_0\\sin\\omega t\\right)\\left(\\frac{v_0}{X_L}\\sin\\left(\\omega t - \\frac{\\pi}{2}\\right)\\right) $\n\nSince $ \\sin(\\theta - 90^\\circ) = -\\cos\\theta $, this is\n\n$ p = -\\frac{v_0^{2}}{X_L}\\sin\\omega t\\cos\\omega t = -\\frac{v_0^{2}}{2X_L}\\sin 2\\omega t $\n\nLook at what that says. The power is itself a **sine wave**, of twice the supply frequency, sitting symmetrically about zero. Its average over a cycle is therefore **exactly zero** — not small, not approximately zero, but zero.\n\n**And now the part that sounds like a paradox but is not.** A real current really is flowing. A real voltage really is across the coil. Where has the energy gone?\n\nNowhere. It went out and came back.\n\nFor one quarter of every cycle $ p $ is positive: the current is building, the magnetic field is growing, and the source is pushing energy into that field — up to $ \\frac{1}{2}Li^{2} $ of it, the formula from Chapter 6. For the next quarter $ p $ is negative: the current is falling, the field is collapsing, and the coil hands **every joule back** to the source. Then it happens again, in the other direction.\n\nSo the inductor is not a consumer of energy. It is a **borrower**, four times per cycle, and it always repays in full. The current in the wires is entirely real, and the meter that charges you for energy reads nothing.\n\nThat unpaid-for current has a name — **wattless current** — and page 12 will show that industry is fined for having too much of it.',
    }),
    b('reasoning_prompt', 13, {
      reasoning_type: 'logical',
      prompt: 'A pure inductor connected across an AC supply carries a substantial current, and yet the average power it consumes is exactly zero. Which statement describes what is actually going on?',
      options: [
        'No real current flows; the ammeter is misreading it',
        'Power is consumed, but far too little to be measured',
        'The energy is destroyed inside the magnetic field',
        'Energy is stored and returned in every quarter cycle',
      ],
      correct_index: 3,
      reveal: '**Energy is stored and given back, four times in every cycle.**\n\nThe current is entirely real — put a clamp meter on the wire and it will read it, and the wire will warm up because of its own resistance. What is *not* real is any net transfer of energy into the coil.\n\nFollow one full cycle:\n\n- Quarter one: current rising, magnetic field building, energy flowing **from** the source **into** the field.\n- Quarter two: current falling, field collapsing, that same energy flowing **back out** to the source.\n- Quarters three and four: the identical thing with the current reversed. The field does not care about the direction of the current, since its energy is $ \\frac{1}{2}Li^{2} $.\n\nThe books balance every quarter cycle, so nothing accumulates and nothing is lost. Note that energy could not be "destroyed in the field" in any case — that would break conservation of energy, and the collapsing-field emf of Chapter 6 is exactly the mechanism that returns it.\n\n**The condition for zero average power, stated generally:** whenever the phase difference between voltage and current is $ 90^\\circ $, the power curve is symmetric about zero and the average vanishes. Page 12 writes this as $ P = V_{\\text{rms}}I_{\\text{rms}}\\cos\\phi $, with $ \\cos 90^\\circ = 0 $. A resistor sits at the other extreme, $ \\phi = 0 $ and $ \\cos\\phi = 1 $, which is why page 5 could just multiply the two rms values together.',
      difficulty_level: 2,
    }),
    b('callout', 14, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'An old tube light needs a big kick of voltage to strike, and then needs its current firmly limited, or it would draw more and more current until it destroyed itself.\n\nYou could limit that current with a resistor. It would work — and it would waste energy continuously as heat, for as long as the lamp was on. In a $ 40 $ W tube you might burn another $ 30 $ W in the resistor, and the fitting would run hot enough to be a nuisance.\n\nInstead every such fitting contains a **choke**: an iron-cored inductor in series with the tube. Its reactance $ X_L $ limits the current just as effectively, and because the opposition is reactive it **converts almost none of that energy into heat** — the energy it takes in each quarter cycle it returns in the next. What warmth the choke does produce comes only from its winding resistance and its iron core, not from the current limiting itself.\n\nThat is the practical point of this page. **Resistance and reactance both cut the current down; only one of them charges you for it.**\n\nThe same trick is everywhere once you look. A smoothing choke in a power supply blocks the high-frequency ripple while letting the DC through untouched, precisely because $ X_L $ is large at high $ f $ and zero at $ f = 0 $.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art, two circuit vignettes side by side separated by a thin vertical rule. Left vignette: a simple series circuit drawn with an AC source symbol, a rectangular resistor symbol, and a slim tube lamp outline glowing warm amber; wavy heat-radiation arcs in a hot orange rise from the resistor, and a small thermometer icon beside it sits high. Right vignette: the identical circuit but with the resistor replaced by a coil symbol drawn as four amber loops over a pair of parallel grey core bars; no heat arcs, and the thermometer icon beside it sits low; the tube glows identically. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('callout', 15, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- An inductor obeys $ v = L\\frac{di}{dt} $ — voltage set by the **rate**, not the value.\n- So $ i = \\frac{v_0}{\\omega L}\\sin\\left(\\omega t - \\frac{\\pi}{2}\\right) $: the current **lags** the voltage by $ 90^\\circ $.\n- Read it physically: current at a peak → $ \\frac{di}{dt} = 0 $ → voltage zero, at that same instant.\n- $ X_L = \\omega L = 2\\pi f L $, in ohms. Rises with frequency; **zero at DC**.\n- So an inductor **passes DC, blocks high frequency**.\n- $ I_{\\text{rms}} = V_{\\text{rms}}/X_L $ — Ohm\'s law with $ X_L $ in the place of $ R $.\n- Average power is **exactly zero**: energy is borrowed and returned each quarter cycle.\n- A reactance limits current **without wasting energy**. A resistance does not.',
    }),
    b('text', 16, {
      markdown: 'Next: the capacitor, which does every one of these things the other way round — and the symmetry is so exact that you can almost write the page yourself before reading it.',
    }),
    b('inline_quiz', 17, {
      pass_threshold: 0.6,
      questions: [
        q('In a purely inductive AC circuit the current',
          ['lags the voltage by $ 90^\\circ $', 'leads the voltage by $ 90^\\circ $', 'is exactly in phase with the voltage', 'lags the voltage by $ 45^\\circ $'],
          0,
          'Integrating $ v = L\\frac{di}{dt} $ turns the source sine into a minus-cosine, which is a sine shifted a quarter cycle **later**. The coil resists change, so the current is always playing catch-up.',
          1),
        q('The inductive reactance of a coil of inductance $ L $ on a supply of frequency $ f $ is',
          ['$ 2\\pi f L $', '$ \\frac{1}{2\\pi f L} $', '$ \\frac{L}{2\\pi f} $', '$ 2\\pi f L^{2} $'],
          0,
          'Faster alternation means a steeper $ \\frac{di}{dt} $ and so a larger back emf, which is why the opposition must grow with frequency rather than shrink with it.',
          1),
        q('The average power consumed by an ideal inductor over one complete cycle is',
          ['zero', 'half of $ V_{\\text{rms}}I_{\\text{rms}} $', 'equal to $ V_{\\text{rms}}I_{\\text{rms}} $', 'equal to $ I_{\\text{rms}}^{2}X_L $'],
          0,
          'The instantaneous power comes out as a pure sine of twice the supply frequency, sitting symmetrically about zero, so it averages to nothing. Energy taken in while the field builds is handed straight back while it collapses.',
          2),
      ],
    }),
  ],
};

// ── p7 · AC Through a Capacitor ──────────────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'ac-through-a-capacitor',
  title: 'AC Through a Capacitor',
  subtitle: 'The exact mirror image of the coil',
  glossary: [
    { term: 'capacitive reactance', definition: 'The opposition a pure capacitor offers to alternating current: $ X_C = \\frac{1}{\\omega C} $. Measured in ohms, large at low frequency, and it dissipates no energy.' },
    { term: 'phase lead', definition: 'A quantity leads another when it reaches the same point in its cycle earlier. In a pure capacitor the current leads the voltage by a quarter cycle, or $ 90^\\circ $.' },
    { term: 'reactance', definition: 'Opposition to alternating current that arises from storing energy rather than dissipating it. Written $ X $, measured in ohms, and always accompanied by a $ 90^\\circ $ phase shift.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A capacitor is a **gap**. Two metal plates with an insulator between them, deliberately not touching. Charge cannot cross it — that is the entire design.\n\nWire a lamp in series with a capacitor and connect the pair to a battery. The lamp flashes once, faintly, and goes out. Exactly as expected: the gap has stopped the current.\n\nNow connect the identical pair to the AC mains. **The lamp lights up and stays lit**, indefinitely, and an ammeter in that circuit reads a steady current.\n\nSo is charge somehow crossing the gap after all?',
      hint: 'Put an ammeter in the wire on each side of the capacitor. Both read the same current. Now ask what the charge sitting on each plate is doing over one cycle.',
      reveal: 'No. **Nothing crosses the gap — and there is still a real current in every wire.**\n\nHere is what actually happens. In the first half cycle the source drives charge onto the top plate and pulls the same amount off the bottom plate. Current flows in both wires. In the second half cycle the source reverses, so it pulls that charge back off and pushes it the other way. Current flows again, in the opposite direction.\n\nThe charge only ever sloshes on and off the plates. Not one electron makes the jump. But the wires either side carry a genuine back-and-forth current the whole time — and a lamp does not care which way the current is going, only that it is going.\n\n**And notice why DC failed.** With a battery, the plates charge up once and then stop, because there is no reversal to move the charge back. The current dies the moment the capacitor is full.\n\nSo a capacitor blocks DC and passes AC — and, as this page will show, the faster the AC alternates, the more freely it passes. That is the exact opposite of the inductor, in every particular.',
    }),
    b('text', 1, {
      markdown: 'Take an ideal capacitor: pure capacitance $ C $, with no leakage and no resistance in its leads. Across it the source drives\n\n$ v = v_0\\sin\\omega t $\n\nand the defining relation of a capacitor, from Chapter 2, is\n\n$ q = Cv $\n\nThe charge on the plates follows the voltage exactly. But **charge is not current** — current is the *rate* at which charge arrives, $ i = \\frac{dq}{dt} $. So once again a derivative stands between the two quantities, and once again that produces a quarter-cycle shift. This time it goes the other way.',
    }),
    b('heading', 2, {
      text: 'The current runs ahead of the voltage',
      level: 2,
      objective: 'Derive the current in a pure capacitor on an AC supply and state its phase relative to the applied voltage.',
    }),
    b('text', 3, {
      markdown: 'Start from the charge and differentiate:\n\n$ q = Cv = Cv_0\\sin\\omega t $\n\n$ i = \\frac{dq}{dt} = \\omega C v_0\\cos\\omega t $\n\nWrite that as a sine, using $ \\cos\\theta = \\sin(\\theta + 90^\\circ) $:\n\n$ i = \\omega C v_0 \\sin\\left(\\omega t + \\frac{\\pi}{2}\\right) = \\frac{v_0}{\\left(\\frac{1}{\\omega C}\\right)}\\sin\\left(\\omega t + \\frac{\\pi}{2}\\right) $\n\nThe angle inside the bracket is **positive** this time. The current reaches every stage of its cycle a quarter of a period **before** the voltage does: the current **leads** the voltage by $ 90^\\circ $.\n\nSet that beside the inductor and the symmetry is complete. Both elements shift the current a quarter cycle; the coil sends it late, the capacitor sends it early.\n\nAnd the peak current is again Ohm\'s law in disguise, this time with $ \\frac{1}{\\omega C} $ standing where $ R $ used to stand.\n\n**A mnemonic that is worth the ten seconds it takes to learn — CIVIL.** In a **C**, **I** comes before **V**; in an **L**, **V** comes before **I**. Say it once and the two pages never get swapped in an exam again.',
    }),
    b('latex_block', 4, {
      latex: 'i = \\omega C v_0\\sin\\left(\\omega t + \\frac{\\pi}{2}\\right)',
      label: 'Current through a pure capacitor',
      note: 'A PLUS inside the bracket — the current runs a quarter cycle ahead. For the inductor on p6 it was a minus.',
      highlight: true,
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'For a capacitor $ q = Cv $, and the current $ i = \\frac{dq}{dt} $ therefore follows the **rate** at which the voltage is changing. At the instant the capacitor voltage is momentarily zero, what is the current?',
      options: [
        'Zero too, since no charge is stored at that moment',
        'Half its peak, the two being $ 45^\\circ $ out of step',
        'At its peak, since $ v $ is changing fastest there',
        'Undefined, because an uncharged plate carries none',
      ],
      correct_index: 2,
      reveal: '**At its peak — because a sine wave is at its steepest exactly where it crosses zero.**\n\nThis is the inductor argument, run backwards, and it is worth doing carefully because the two pages are so easy to blur together.\n\nThe charge on the plates is $ q = Cv $, so the charge curve has the same shape as the voltage curve. The current is the *slope* of that charge curve. And where is a sine steepest? At its zero crossings. Where is it flattest? At its crests.\n\nSo:\n\n- Voltage zero → charge curve steepest → **current at its maximum**.\n- Voltage at its peak → charge curve momentarily flat → **current zero**.\n\nAn empty capacitor is not a capacitor that refuses to conduct — quite the reverse. It is the *easiest* moment to push charge onto the plates, because there is nothing on them yet pushing back. As the plates fill, the voltage they develop opposes further charging, and the current falls away, reaching zero just as the voltage reaches its peak.\n\n**The general rule behind all three pages.** Whenever a derivative stands between the voltage and the current, they end up a quarter cycle apart. In a coil the *voltage* is the derivative, so the voltage runs ahead. In a capacitor the *current* is the derivative, so the current runs ahead. In a resistor there is no derivative at all, so nothing shifts.',
      difficulty_level: 3,
    }),
    b('image', 6, {
      src: '',
      alt: 'Voltage and current waveforms for a capacitor, the current crest arriving a quarter cycle before the voltage crest, beside a phasor diagram with the current arrow ninety degrees ahead of the voltage arrow',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The current crest arrives a quarter cycle early. On the phasor diagram, with rotation anticlockwise, the current arrow sits a right angle ahead of the voltage arrow.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide composition split into two panels by a thin vertical rule. Left panel: two sine waves on a shared horizontal time axis with a faint grey zero line — one in brighter orange labelled v, and one in warm amber labelled i whose crests are shifted a quarter of a wavelength to the LEFT of the orange crests; thin dashed grey vertical guide lines drop from one amber crest and the following orange crest to the axis, with a small bracket between them marking a quarter period. Right panel: a phasor diagram — a faint dim-grey circle with a horizontal reference line, a brighter orange arrow from the centre pointing along the horizontal reference labelled v, and a warm amber arrow from the centre pointing vertically upward at a right angle to it labelled i, with a small right-angle square drawn between them and a curved arrow at the rim showing anticlockwise rotation. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('heading', 7, {
      text: 'Capacitive reactance, and the mirror of the coil',
      level: 2,
      objective: 'Define capacitive reactance, predict its behaviour at low and high frequency, and show that a capacitor also consumes no average power.',
    }),
    b('text', 8, {
      markdown: 'The quantity standing where $ R $ stood is the **capacitive reactance**:\n\n$ X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C} $\n\nOhms again, and again no energy is dissipated. But look at where the frequency sits — **underneath**:\n\n- **At $ f = 0 $ — DC — $ X_C $ is infinite.** No current at all, once the plates are charged. This is the battery-and-lamp experiment at the top of the page.\n- **As $ f $ rises, $ X_C $ falls.** Ten times the frequency, one tenth of the opposition, ten times the current.\n\nSo a capacitor **blocks DC and passes high frequencies**, which is precisely the reverse of an inductor.\n\nThe reason is physical, not algebraic. At a high frequency the source reverses before the plates have had time to build up much voltage, so very little opposing voltage ever develops and charge sloshes back and forth easily. At a low frequency there is plenty of time to fill the plates, they push back hard, and the current chokes off.\n\n**And the average power is zero, again.** The working is the mirror of page 6: with the current $ 90^\\circ $ ahead instead of behind, the product $ vi $ is once more a sine of twice the frequency, symmetric about zero. Energy goes into the electric field between the plates for a quarter cycle and comes straight back out in the next. Chapter 2 gave that stored energy as $ \\frac{1}{2}CV^{2} $; here it is simply being filled and emptied a hundred times a second.',
    }),
    b('latex_block', 9, {
      latex: 'X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C} \\qquad\\text{and}\\qquad I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{X_C}',
      label: 'Capacitive reactance',
      note: 'Frequency sits in the DENOMINATOR — infinite at DC, small at high frequency. The exact opposite of X_L.',
      highlight: true,
    }),
    b('worked_example', 10, {
      label: 'the same capacitor at three frequencies',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 15\\ \\mu\\text{F} $ capacitor is connected across a $ 220 $ V supply. Find the rms current at $ 50 $ Hz, then at $ 500 $ Hz, and then say what happens if the supply is replaced by a $ 220 $ V battery.',
      solution: '**Convert the capacitance first**, since micro-farads are where the arithmetic usually goes wrong:\n\n$ C = 15\\ \\mu\\text{F} = 15\\times10^{-6}\\ \\text{F} $\n\n**At $ 50 $ Hz.**\n\n$ X_C = \\frac{1}{2\\pi f C} = \\frac{1}{2\\pi(50)(15\\times10^{-6})} $\n\n$ X_C = \\frac{1}{4.71\\times10^{-3}} = 212\\ \\Omega $\n\n$ I_{\\text{rms}} = \\frac{220}{212} = 1.04\\ \\text{A} $\n\n**At $ 500 $ Hz.** Frequency ten times larger, and $ X_C $ is inversely proportional to it, so:\n\n$ X_C = 21.2\\ \\Omega $, so $ I_{\\text{rms}} = \\frac{220}{21.2} = 10.4\\ \\text{A} $\n\nTen times the current. Compare the inductor on page 6, where raising the frequency tenfold **cut** the current to a tenth. Same change, opposite outcome.\n\n**On a $ 220 $ V battery.** Now $ f = 0 $, so\n\n$ X_C = \\frac{1}{2\\pi(0)(15\\times10^{-6})}\\rightarrow\\infty $\n\nand the steady current is **zero**. There is a brief charging current lasting a few time constants — the C-R behaviour of Chapter 2 — and after that, nothing at all.\n\n**Average power, in every case: zero.** An ideal capacitor has no resistance, so there is nothing in it to convert energy into heat. The energy $ \\frac{1}{2}CV^{2} $ moves into the field and back out, a hundred times a second.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'analogical',
      prompt: 'A capacitor is connected in series with a small lamp across a $ 50 $ Hz supply, and the lamp glows dimly. The supply frequency is now raised to $ 500 $ Hz, with everything else left exactly as it was. What happens to the lamp?',
      options: [
        'It brightens, because $ X_C $ falls to a tenth',
        'It dims, because $ X_C $ rises to ten times',
        'It is unchanged, as $ X_C $ has no $ f $ in it',
        'It goes out, since a capacitor stops fast signals',
      ],
      correct_index: 0,
      reveal: '**It brightens — quite dramatically — because $ X_C $ falls to a tenth of what it was.**\n\n$ X_C = \\frac{1}{2\\pi f C} $ has the frequency in the **denominator**. Multiply $ f $ by ten and $ X_C $ is divided by ten, so the current is multiplied by ten and the power in the lamp goes up by a factor of a hundred.\n\n**Where the wrong answers come from.** "It dims" is the inductor\'s behaviour borrowed by mistake — that is $ X_L = 2\\pi f L $, with $ f $ on top. And the idea that a capacitor stops fast signals is the correct fact about **DC** pointed in exactly the wrong direction: a capacitor blocks what is slow and passes what is fast.\n\n**The check that stops you ever getting these two backwards.** Ask what happens at $ f = 0 $, where you already know the answer from ordinary circuits.\n\n- A coil at DC is just a piece of wire → so $ X_L $ must be **zero** at $ f = 0 $ → so $ f $ belongs on top.\n- A capacitor at DC is a gap that passes nothing → so $ X_C $ must be **infinite** at $ f = 0 $ → so $ f $ belongs underneath.\n\nTwo facts you knew before this chapter began, and they reconstruct both formulas in about five seconds.',
      difficulty_level: 2,
    }),
    b('comparison_card', 12, {
      title: 'Inductor and capacitor, side by side — every line is a mirror',
      columns: [
        {
          heading: 'Inductor L',
          points: [
            'Defining law: $ v = L\\frac{di}{dt} $',
            'Current **lags** the voltage by $ 90^\\circ $',
            'Reactance $ X_L = \\omega L $ — $ f $ on top',
            'At DC: $ X_L = 0 $, behaves as plain wire',
            'At high $ f $: large $ X_L $, blocks the signal',
            'Stores energy in a **magnetic** field, $ \\frac{1}{2}Li^{2} $',
            'Average power over a cycle: **zero**',
          ],
        },
        {
          heading: 'Capacitor C',
          points: [
            'Defining law: $ i = C\\frac{dv}{dt} $',
            'Current **leads** the voltage by $ 90^\\circ $',
            'Reactance $ X_C = \\frac{1}{\\omega C} $ — $ f $ underneath',
            'At DC: $ X_C\\rightarrow\\infty $, behaves as a gap',
            'At high $ f $: small $ X_C $, passes the signal',
            'Stores energy in an **electric** field, $ \\frac{1}{2}Cv^{2} $',
            'Average power over a cycle: **zero**',
          ],
        },
      ],
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Open a decent loudspeaker box and you will find two drivers: a big one for bass and a small one — the tweeter — for treble. The tweeter is a delicate thing, and a strong bass note would destroy it in seconds by driving its light cone far beyond its travel.\n\nSo the tweeter is never wired straight to the amplifier. **There is a capacitor in series with it**, and that capacitor is doing exactly the physics on this page.\n\nAt $ 50 $ Hz — a bass note — $ X_C $ is large, so almost none of the bass signal gets through and the tweeter is protected. At $ 5000 $ Hz, $ X_C $ is a hundred times smaller, so the treble passes almost untouched. One passive component, no power supply, no electronics, sorting the music by frequency.\n\nThe bass driver gets the opposite treatment: an **inductor** in series with it, whose $ X_L $ rises with frequency and so keeps the treble out. The two together make what audio engineers call a crossover network, and it is nothing more than page 6 and page 7 wired in parallel.\n\nThe same idea keeps DC out of places it should not go. A **coupling capacitor** between two amplifier stages passes the audio signal freely while completely blocking the steady voltage that each stage sits at — a job no resistor could do, because a resistor cannot tell the difference between a slow signal and a fast one.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. A loudspeaker cabinet drawn in outline as a tall rectangle, containing a large circular driver low down and a small circular driver near the top. From an input terminal on the left, two wire paths diverge: the upper path passes through a capacitor symbol drawn as two short parallel amber bars and continues to the small driver; the lower path passes through a coil symbol drawn as four amber loops and continues to the large driver. Along the upper path, a fast tightly spaced amber wave travels towards the small driver; along the lower path, a slow long-wavelength amber wave travels towards the large driver. Faint dim-grey ghosts of the wrong wave are shown stopped at each component with a small cross. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ q = Cv $, and $ i = \\frac{dq}{dt} $, so $ i = \\omega Cv_0\\sin\\left(\\omega t + \\frac{\\pi}{2}\\right) $.\n- The current **leads** the voltage by $ 90^\\circ $. Remember **CIVIL**.\n- Read it physically: voltage zero → charge curve steepest → current at its maximum.\n- $ X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C} $, in ohms. Frequency is **underneath**.\n- So a capacitor **blocks DC and passes high frequency** — the mirror of an inductor.\n- Rebuild both formulas from the DC case: a coil at DC is wire ($ X_L = 0 $); a capacitor at DC is a gap ($ X_C\\rightarrow\\infty $).\n- Average power is **zero** again — energy fills the electric field and empties out of it.\n- Nothing ever crosses the gap. The current in the wires is still perfectly real.',
    }),
    b('text', 15, {
      markdown: 'Next: real circuits never contain just one element. Putting a resistor and a reactance together raises a question neither page has had to face — what happens to two voltages that peak at different moments — and the answer is not addition.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('In a purely capacitive AC circuit, the current',
          ['leads the voltage by $ 90^\\circ $', 'lags the voltage by $ 90^\\circ $', 'is exactly in phase with the voltage', 'leads the voltage by $ 45^\\circ $'],
          0,
          'The current is the rate of change of the charge, and differentiating a sine advances it by a quarter cycle. CIVIL: in a C, the I comes before the V.',
          1),
        q('The capacitive reactance of a capacitor $ C $ on a supply of frequency $ f $ is',
          ['$ \\frac{1}{2\\pi f C} $', '$ 2\\pi f C $', '$ \\frac{2\\pi f}{C} $', '$ \\frac{C}{2\\pi f} $'],
          0,
          'At $ f = 0 $ a capacitor must pass nothing, so its reactance has to become infinite there — which only happens with the frequency in the denominator.',
          1),
        q('A capacitor is connected across a steady DC supply. After a short charging period the current is',
          ['zero, since $ X_C $ is infinite at $ f = 0 $', 'steady and equal to $ V/X_C $', 'oscillating at the natural frequency', 'the same as it would be on AC'],
          0,
          'With no alternation there is nothing to move the charge back off the plates, so once they are full the current stops. This is the C-R charging behaviour of Chapter 2, seen from the frequency side.',
          2),
      ],
    }),
  ],
};

// ── p8 · Two Elements at a Time — L-R and C-R ────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'ac-series-lr-and-cr',
  title: 'Two Elements at a Time — L-R and C-R',
  subtitle: 'Impedance, the phase angle, and the triangle that gives you both',
  glossary: [
    { term: 'impedance', definition: 'The total opposition of an AC circuit to current, written $ Z $ and measured in ohms. For a series combination of a resistance and one reactance, $ Z = \\sqrt{R^{2} + X^{2}} $.' },
    { term: 'impedance triangle', definition: 'A right-angled triangle with $ R $ along the base and the reactance $ X $ perpendicular to it; the hypotenuse is $ Z $ and the base angle is the phase angle $ \\phi $.' },
    { term: 'phase angle', definition: 'The angle $ \\phi $ by which the source voltage leads the current. Positive for an inductive circuit, negative for a capacitive one, and zero for a purely resistive one.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A resistor on its own limits the current in a circuit to $ 2 $ A. A coil on its own, in the same circuit at the same frequency, also limits it to $ 2 $ A. Each is worth $ 50\\ \\Omega $.\n\nNow put the two in **series**, one after the other, and connect them to the same supply.\n\nEvery instinct from Chapter 3 says the opposition is now $ 100\\ \\Omega $ and the current has halved. Measure it, and you find about $ 71\\ \\Omega $ and a current of $ 2.8 $ A — noticeably more than half.\n\nTwo components in series, each of $ 50\\ \\Omega $, adding up to $ 71\\ \\Omega $. What is wrong with the addition?',
      hint: 'Put a voltmeter across each component. Then ask when each of those two voltages is at its peak.',
      reveal: 'Nothing is wrong with the addition. What is wrong is **adding numbers that happen at different times**.\n\nThe voltage across the resistor is in phase with the current. The voltage across the coil is a quarter cycle ahead of the current. So the two voltages **never peak together**: when one is at its maximum, the other is passing through zero.\n\nAdding $ 50 $ and $ 50 $ assumes both are at full strength at the same instant. They are not — not ever — so the sum of the peaks badly overstates the peak of the sum.\n\nThe right way to combine them is the phasor picture from page 4. Two arrows at right angles do not add head-to-tail along a line; they add like the two sides of a right-angled triangle. And $ \\sqrt{50^{2} + 50^{2}} = 70.7 $, which is exactly what the meter said.\n\n**This is the step that separates one-element circuits from real ones**, and NCERT jumps straight over it to the three-element circuit. It is much easier to learn here, with two components, where the triangle has only two sides to draw.',
    }),
    b('text', 1, {
      markdown: 'From here on, one habit does all the work: **the current is the same everywhere in a series circuit**, so make the current the reference and hang everything else off it.\n\nThat is not an arbitrary choice. In a series circuit the same charge passes through every component, so there is one current with one phase — while the voltages across the different components each have a phase of their own. Referring three different voltages to one common current is far easier than the reverse.',
    }),
    b('heading', 2, {
      text: 'Why the two voltages cannot simply add',
      level: 2,
      objective: 'Combine the resistor and reactance voltages as perpendicular phasors, and obtain the impedance and the phase angle.',
    }),
    b('text', 3, {
      markdown: 'Let the common current be $ i = i_0\\sin\\omega t $ and take it as the reference direction on the phasor diagram. Then, from pages 5 to 7:\n\n- **Across the resistor:** $ v_R = i_0 R\\sin\\omega t $. In phase with the current, so its phasor lies **along** the current, with length $ i_0R $.\n- **Across the reactance:** the voltage is a quarter cycle out of step with the current, so its phasor is **perpendicular** to the current, with length $ i_0X $. For an inductor the voltage leads, so it points a quarter turn ahead; for a capacitor the voltage lags, so it points a quarter turn behind.\n\nThe source voltage must equal the sum of the two — Kirchhoff\'s loop rule still holds, at every instant. But summing them means summing the **phasors**, and two perpendicular arrows combine by Pythagoras:\n\n$ v_0 = \\sqrt{(i_0R)^{2} + (i_0X)^{2}} = i_0\\sqrt{R^{2} + X^{2}} $\n\nDivide through by $ i_0 $ and the bracket is the total opposition of the circuit — its **impedance** $ Z $. The angle of the resultant away from the current is the **phase angle** $ \\phi $, and it comes straight out of the same triangle.',
    }),
    b('latex_block', 4, {
      latex: 'Z = \\sqrt{R^{2} + X^{2}} \\qquad\\text{and}\\qquad \\tan\\phi = \\frac{X}{R}',
      label: 'Impedance and phase angle for a series R with one reactance',
      note: 'Z in ohms, and φ is the angle by which the SOURCE VOLTAGE leads the CURRENT. Ohm\'s law becomes I_rms = V_rms / Z.',
      highlight: true,
    }),
    b('image', 5, {
      src: '',
      alt: 'The impedance triangle for a series L-R circuit, with R along the base, X_L vertical, Z as the hypotenuse and the phase angle at the base, drawn beside the matching voltage triangle',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The same triangle twice. Multiply every side of the impedance triangle by the current and you get the voltage triangle.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide composition split into two panels by a thin vertical rule. Left panel: a right-angled triangle with a horizontal base drawn as a bold warm amber arrow from the origin pointing right labelled R, a vertical side drawn as a bold brighter orange arrow rising from the end of the base labelled X, and a hypotenuse from the origin to the top of the vertical arrow drawn as a bold pale-gold arrow labelled Z; a small arc at the origin between the base and the hypotenuse is marked with the Greek letter phi, and a small right-angle square sits at the corner between base and vertical side. Right panel: an identical triangle at the same orientation but with the sides labelled with voltage symbols instead, and a thin dim-grey horizontal reference arrow beneath the base labelled as the current direction. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'In a series L-R circuit an AC voltmeter reads $ 60 $ V across the resistor and $ 80 $ V across the inductor. What will a voltmeter across the supply terminals read?',
      options: [
        '$ 140 $ V, since series voltages simply add up',
        '$ 100 $ V, the two being a quarter cycle apart',
        '$ 20 $ V, since the two voltages act against each other',
        '$ 70 $ V, the average of the two separate readings',
      ],
      correct_index: 1,
      reveal: '**$ 100 $ V**, from $ \\sqrt{60^{2} + 80^{2}} = \\sqrt{3600 + 6400} = \\sqrt{10000} $.\n\nThis is the single most reliable trap in the chapter, and it is worth understanding rather than memorising, because a memorised rule will not survive the three-element version on page 9.\n\nEvery one of those meters is reading an **rms** value, which throws away all timing information. The meter across the resistor says "this voltage has an rms size of $ 60 $ V" and nothing about *when* it peaks. The two peaks are in fact a quarter cycle apart, so at the moment the resistor voltage is at $ 60\\sqrt{2} $ the inductor voltage is passing through zero, and vice versa.\n\nSince they never add up at full strength, their rms values combine at right angles, not along a line.\n\n**And no conservation law is broken.** Kirchhoff\'s loop rule holds at every instant, and it does hold here: $ v_R + v_L = v $ is true at every single moment of the cycle. It is the *rms values* that do not add — because rms is a size, not a signed instantaneous quantity, and sizes of things pointing in different directions never simply add.\n\n**A check worth having:** in any series AC circuit the supply reading is always **smaller** than the arithmetic sum of the component readings, and never smaller than the largest single one. Here, $ 80 < 100 < 140 $ ✓.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'The L-R circuit, step by step',
      level: 2,
      objective: 'Work a complete series L-R problem in a fixed order: reactance, impedance, current, phase angle, and the individual voltages.',
    }),
    b('step_solver', 8, {
      title: 'A series L-R circuit, worked in the order that always works',
      problem: 'A resistor of $ 30\\ \\Omega $ is joined in series with a pure inductor of $ 40 $ mH, and the pair is connected across an AC source of rms voltage $ 100 $ V and angular frequency $ \\omega = 1000 $ rad/s. Find the impedance, the rms current, the phase angle, and the rms voltage across each component.',
      intro: 'The order below is not a suggestion. Reactance must come before impedance, impedance before current, and current before the individual voltages — each step needs the one above it. Follow the same five steps on every two-element problem and the arithmetic never tangles.',
      steps: [
        st('**Step 1 — the reactance.** $ X_L = \\omega L = (1000)(40\\times10^{-3}) = 40\\ \\Omega $',
          'Convert the millihenries to henries first. Note that the reactance is a property of the coil AND the frequency together — the same coil on a different supply is a different number of ohms.', {
            check: {
              kind: 'mcq',
              prompt: 'Why must $ X_L $ be worked out before anything else?',
              options: [
                'Because the resistance depends on the reactance',
                'Because nothing else can be found until $ X $ is a number',
                'Because reactance is always larger than resistance',
                'Because the current has to be known first',
              ],
              answer_index: 1,
              feedback_right: 'Yes — $ Z $, $ \\phi $ and the current all contain $ X $, so it has to be a number before any of them can be.',
              feedback_wrong: 'The resistance of a resistor never depends on frequency, and the current is what we are trying to find. $ X_L $ has to come first simply because $ Z = \\sqrt{R^{2} + X^{2}} $ and $ \\tan\\phi = X/R $ both need it.',
            },
          }),
        st('**Step 2 — the impedance.** $ Z = \\sqrt{R^{2} + X_L^{2}} = \\sqrt{30^{2} + 40^{2}} = \\sqrt{2500} = 50\\ \\Omega $',
          'Note that $ 50 $ is much less than $ 30 + 40 = 70 $. The two oppositions act a quarter cycle apart, so they combine as the sides of a right-angled triangle rather than end to end.', {
            check: {
              kind: 'mcq',
              prompt: 'With $ R = 30\\ \\Omega $ and $ X_L = 40\\ \\Omega $, the impedance is',
              options: ['$ 70\\ \\Omega $', '$ 10\\ \\Omega $', '$ 50\\ \\Omega $', '$ 35\\ \\Omega $'],
              answer_index: 2,
              feedback_right: 'Correct — the familiar 3-4-5 triangle, scaled by ten.',
              feedback_wrong: 'Adding them gives $ 70 $, which would only be right if both voltages peaked together — and they never do. Pythagoras gives $ \\sqrt{900 + 1600} = 50\\ \\Omega $.',
            },
          }),
        st('**Step 3 — the current.** $ I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{Z} = \\frac{100}{50} = 2.0\\ \\text{A} $',
          'Ohm\'s law, with $ Z $ in the place of $ R $. This is the one current shared by both components, which is why it is worth finding before anything else about them.'),
        st('**Step 4 — the phase angle.** $ \\tan\\phi = \\frac{X_L}{R} = \\frac{40}{30} = 1.33 $, so $ \\phi = 53^\\circ $',
          'The circuit is **inductive**, so the source voltage leads the current by $ 53^\\circ $. Equivalently the current lags by $ 53^\\circ $ — somewhere between the $ 0^\\circ $ of a pure resistor and the $ 90^\\circ $ of a pure inductor, which is exactly where a mixture should land.', {
            check: {
              kind: 'mcq',
              prompt: 'If $ R $ were made much larger while $ X_L $ stayed at $ 40\\ \\Omega $, the phase angle would',
              options: [
                'grow towards $ 90^\\circ $, the circuit acting more inductive',
                'stay at $ 53^\\circ $, since $ \\phi $ depends only on $ X_L $',
                'shrink towards $ 0^\\circ $, the circuit acting more resistive',
                'become negative, the current then leading the voltage',
              ],
              answer_index: 2,
              feedback_right: 'Exactly — a big $ R $ with a small $ X $ makes $ \\tan\\phi $ tiny, and the circuit behaves almost like a plain resistor.',
              feedback_wrong: 'Since $ \\tan\\phi = X_L/R $, growing the denominator shrinks the angle. The circuit becomes more and more resistive, and $ \\phi $ heads for zero. A negative $ \\phi $ would need a capacitor.',
            },
          }),
        st('**Step 5 — the component voltages.** $ V_R = I R = 2\\times30 = 60\\ \\text{V} $ and $ V_L = I X_L = 2\\times40 = 80\\ \\text{V} $',
          'These add to $ 140 $ V, which is not the supply voltage — but $ \\sqrt{60^{2} + 80^{2}} = 100 $ V, which is. The two readings are a quarter cycle apart, so they combine at right angles.'),
      ],
      now_you_try: {
        problem: 'Keep the same circuit — $ R = 30\\ \\Omega $, $ L = 40 $ mH, $ V_{\\text{rms}} = 100 $ V — but **double** the angular frequency to $ \\omega = 2000 $ rad/s. Find the new impedance, current and phase angle, and say which way each has moved.',
        answer: '$ X_L = 80\\ \\Omega $, $ Z = 85.4\\ \\Omega $, $ I_{\\text{rms}} = 1.17 $ A, $ \\phi = 69.4^\\circ $. The current falls and the circuit becomes markedly more inductive.',
        solution: '**Step 1.** $ X_L = \\omega L = (2000)(40\\times10^{-3}) = 80\\ \\Omega $. Doubling the frequency doubles the reactance, because $ X_L $ is directly proportional to $ \\omega $.\n\n**Step 2.** $ Z = \\sqrt{30^{2} + 80^{2}} = \\sqrt{900 + 6400} = \\sqrt{7300} = 85.4\\ \\Omega $.\n\nNotice that $ Z $ did **not** double, even though $ X_L $ did. The resistance is unchanged and still contributes its $ 900 $, so the total grows more slowly than the reactance does.\n\n**Step 3.** $ I_{\\text{rms}} = \\frac{100}{85.4} = 1.17\\ \\text{A} $, down from $ 2.0 $ A.\n\n**Step 4.** $ \\tan\\phi = \\frac{80}{30} = 2.67 $, so $ \\phi = 69.4^\\circ $, up from $ 53^\\circ $.\n\n**Read the trend, because it is the useful part.** As the frequency rises the reactance grows while the resistance sits still, so the reactance comes to dominate and the circuit behaves more and more like a pure inductor: the current shrinks and $ \\phi $ climbs towards $ 90^\\circ $. Push the frequency the other way, towards DC, and the opposite happens — $ X_L\\rightarrow 0 $, $ Z\\rightarrow R $, $ \\phi\\rightarrow 0 $, and the coil becomes invisible.\n\nA series L-R circuit is therefore a **filter**: it passes low frequencies well and high frequencies poorly.',
      },
    }),
    b('heading', 9, {
      text: 'The C-R circuit — the same method, the other way round',
      level: 2,
      objective: 'Apply the identical five steps to a series C-R circuit and state how its phase angle differs in sign from the L-R case.',
    }),
    b('worked_example', 10, {
      label: 'a series C-R circuit',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A resistor of $ 30\\ \\Omega $ is joined in series with a capacitor of $ 25\\ \\mu\\text{F} $, across an AC source of rms voltage $ 100 $ V and angular frequency $ \\omega = 1000 $ rad/s. Find the impedance, the rms current, the phase angle and the two component voltages — and compare the whole result with the L-R circuit above.',
      solution: '**Step 1 — the reactance.**\n\n$ X_C = \\frac{1}{\\omega C} = \\frac{1}{(1000)(25\\times10^{-6})} = \\frac{1}{0.025} = 40\\ \\Omega $\n\n**Step 2 — the impedance.** The formula does not care which kind of reactance it is; only one $ X $ is present, so\n\n$ Z = \\sqrt{R^{2} + X_C^{2}} = \\sqrt{30^{2} + 40^{2}} = 50\\ \\Omega $\n\n**Step 3 — the current.**\n\n$ I_{\\text{rms}} = \\frac{100}{50} = 2.0\\ \\text{A} $\n\n**Step 4 — the phase angle.**\n\n$ \\tan\\phi = \\frac{X_C}{R} = \\frac{40}{30} $, so $ \\phi = 53^\\circ $\n\n— but this time the **current leads the voltage** by $ 53^\\circ $, because the capacitor voltage lags the current instead of leading it. In the signed convention used from page 9 onward, where $ \\phi $ means the angle by which the *source voltage* leads the *current*, this circuit has $ \\phi = -53^\\circ $.\n\n**Step 5 — the component voltages.**\n\n$ V_R = 2\\times30 = 60\\ \\text{V} $ and $ V_C = 2\\times40 = 80\\ \\text{V} $, with $ \\sqrt{60^{2} + 80^{2}} = 100 $ V ✓\n\n**Now compare the two circuits.** Every magnitude is identical — same $ Z $, same current, same component voltages, same size of angle. The **only** difference is the direction of the phase shift: in the L-R circuit the current runs late, in the C-R circuit it runs early.\n\n**And that single difference is the seed of the next page.** If both an inductor and a capacitor are present, their voltage phasors point in *opposite* directions and partly cancel. Make them cancel exactly and the reactance disappears altogether — which is resonance, and it is worth the wait.\n\n**Frequency behaviour, for contrast.** Raise $ \\omega $ here and $ X_C $ *falls*, so $ Z $ falls and the current rises. A series C-R circuit passes high frequencies well and low ones poorly — the exact opposite of the L-R filter above.',
    }),
    b('table', 11, {
      caption: 'The two circuits side by side. Only the last two rows differ.',
      headers: ['', 'Series L-R', 'Series C-R'],
      rows: [
        ['Reactance', '$ X_L = \\omega L $', '$ X_C = \\frac{1}{\\omega C} $'],
        ['Impedance', '$ Z = \\sqrt{R^{2} + X_L^{2}} $', '$ Z = \\sqrt{R^{2} + X_C^{2}} $'],
        ['Size of the phase angle', '$ \\tan\\phi = \\frac{X_L}{R} $', '$ \\tan\\phi = \\frac{X_C}{R} $'],
        ['Which runs ahead', 'voltage leads the current', 'current leads the voltage'],
        ['As frequency rises', '$ Z $ rises, current falls', '$ Z $ falls, current rises'],
      ],
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'A series L-R circuit has fixed $ R $ and fixed $ L $, and the supply frequency is steadily raised. What happens to the phase angle $ \\phi $?',
      options: [
        'Falls towards zero, since $ X_L $ shrinks with $ f $',
        'Stays fixed, since $ \\tan\\phi $ has no $ f $ in it',
        'Falls to $ 45^\\circ $ and then stops changing there',
        'Grows towards $ 90^\\circ $, since $ X_L $ rises with $ f $',
      ],
      correct_index: 3,
      reveal: '**It grows, heading towards $ 90^\\circ $ but never quite reaching it.**\n\nThe reasoning is one line: $ \\tan\\phi = \\frac{X_L}{R} = \\frac{2\\pi f L}{R} $. The resistance is a fixed number and does not care about frequency at all; the reactance is directly proportional to it. So raising $ f $ raises the top of that fraction while the bottom stands still, and $ \\phi $ climbs.\n\n**What that means physically.** At high frequency the coil dominates the circuit and the resistor becomes almost irrelevant, so the combination behaves nearly like a pure inductor — where the phase difference is exactly $ 90^\\circ $. It approaches that limit without arriving, because $ R $ never actually vanishes.\n\nRun it the other way for the other limit. As $ f\\rightarrow 0 $, $ X_L\\rightarrow 0 $, so $ Z\\rightarrow R $ and $ \\phi\\rightarrow 0 $ — the coil turns into a plain piece of wire and the circuit behaves like the resistor alone, which is exactly the DC result it must reproduce.\n\n**The habit worth taking from this.** Whenever a formula has a frequency in it, test it at $ f\\rightarrow 0 $ and at $ f\\rightarrow\\infty $ and check that both limits are things you already know. It catches an inverted fraction instantly, and it costs about ten seconds.',
      difficulty_level: 2,
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Take a multimeter to the winding of a ceiling-fan motor and it will read something like $ 20\\ \\Omega $. Feed that into the DC formula and you would predict $ 220/20 = 11 $ A — over two kilowatts, and enough to cook the winding in under a minute.\n\nRun the fan and clamp an ammeter on the lead: it draws well under half an amp.\n\nThe winding is a coil, so on a $ 50 $ Hz supply the thing that limits the current is not its $ 20\\ \\Omega $ of resistance but its **impedance**, and the reactance term is far the larger of the two. The motor is a series L-R circuit, and it is $ Z $, not $ R $, that sets the current.\n\nThis is also why a motor is dangerous to stall. **A stalled motor still turns, electrically, into something much closer to a plain resistor**, its effective impedance collapses, and the current leaps towards that catastrophic DC figure. A jammed fan, a mixer with its blades stuck, a pump seized with grit — all of them start to smell of burning within a minute or two, and the reason is on this page.\n\nIt is also why the first question an electrician asks about an AC motor is never "what is its resistance?" On AC, resistance is not what limits current. Impedance is.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art, two vignettes side by side separated by a thin vertical rule. Left vignette: a hand-held multimeter drawn in outline with two probes touching the ends of a coil symbol of four warm amber loops, its small display showing a low ohms reading; beneath it a short horizontal amber bar labelled R, drawn small. Right vignette: the same coil now wired to an AC source symbol with a clamp meter around the lead, and beside it a right-angled triangle with a short warm amber horizontal side labelled R and a much taller brighter orange vertical side labelled X, with a pale-gold hypotenuse labelled Z, showing Z dominated by X. Muted white minimal labels, generous dark space on the near-black background, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- In a series circuit the **current is common**, so make it the phasor reference.\n- $ v_R $ lies along the current; a reactance voltage sits at $ 90^\\circ $ to it.\n- $ Z = \\sqrt{R^{2} + X^{2}} $ and $ \\tan\\phi = \\frac{X}{R} $ — both read off one right-angled triangle.\n- $ I_{\\text{rms}} = \\frac{V_{\\text{rms}}}{Z} $ — Ohm\'s law with $ Z $ in the place of $ R $.\n- Component **rms voltages do not add arithmetically**; they add at right angles.\n- Five steps, always in this order: $ X $ → $ Z $ → $ I $ → $ \\phi $ → component voltages.\n- L-R: voltage leads current, and $ Z $ **rises** with frequency.\n- C-R: current leads voltage, and $ Z $ **falls** with frequency.\n- Convention for the rest of the chapter: $ \\phi $ is the angle by which the **source voltage leads the current** — positive when inductive, negative when capacitive.',
    }),
    b('text', 15, {
      markdown: 'Next: put all three elements in one loop. The resistor voltage still lies along the current, but now two reactance voltages point in **opposite** directions — and what happens when they cancel is the best result in the chapter.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A resistance $ R $ and a reactance $ X $ are in series across an AC supply. The impedance is',
          ['$ \\sqrt{R^{2} + X^{2}} $', '$ R + X $', '$ \\sqrt{R^{2} - X^{2}} $', '$ \\frac{RX}{R + X} $'],
          0,
          'The two voltages are a quarter cycle apart, so their phasors are perpendicular and combine by Pythagoras rather than end to end. Simple addition would only be right if both peaked at the same instant.',
          1),
        q('In a series C-R circuit the current',
          ['leads the applied voltage', 'lags the applied voltage', 'is in phase with the applied voltage', 'is exactly $ 90^\\circ $ ahead of it'],
          0,
          'The capacitor pulls the current ahead and the resistor pulls it back into phase, so the result lands somewhere strictly between $ 0^\\circ $ and $ 90^\\circ $ of lead, never at either end.',
          2),
        q('A series L-R circuit reads $ 60 $ V across $ R $ and $ 80 $ V across $ L $. The supply voltage is',
          ['$ 100 $ V', '$ 140 $ V', '$ 20 $ V', '$ 70 $ V'],
          0,
          'The two rms readings are a quarter cycle apart, so they combine as $ \\sqrt{60^{2} + 80^{2}} $. The supply reading is always less than the arithmetic sum and never less than the larger single reading.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p5, p6, p7, p8]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
