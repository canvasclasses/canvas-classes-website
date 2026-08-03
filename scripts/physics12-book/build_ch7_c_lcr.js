'use strict';
/**
 * Class 12 Physics · Ch.7 "Alternating Current" — pages 9–13.
 * The series LCR circuit, resonance, sharpness of resonance, power and the
 * power factor, and the transformer that closes the chapter.
 *
 * ASSUMED FROM PAGES 1–8 (never re-taught here):
 *   • LC oscillations, free, at $ \omega = 1/\sqrt{LC} $  (p1)
 *   • rms vs peak; "220 V" is rms                          (p3)
 *   • phasors — rotating arrows, phase difference as the angle between them (p4)
 *   • $ X_L = \omega L $, current LAGS by 90°               (p6)
 *   • $ X_C = 1/(\omega C) $, current LEADS by 90°          (p7)
 *   • both dissipate zero average power                     (p6, p7)
 *   • the impedance triangle for L-R and C-R separately     (p8)
 *
 * The chapter's payoff is on p10: the $ \omega $ that makes $ X_L = X_C $ is the
 * SAME $ \omega $ the reader met on p1 for a free LC loop. That tie-back is
 * stated explicitly, in its own heading, because it is the reason the chapter
 * was ordered this way.
 *
 * WORKED-NUMBER SPINE (deliberately reused so the reader sees one circuit
 * developed, not five unrelated ones):
 *   • p9  : R = 60 Ω, X_L = 150 Ω, X_C = 70 Ω, 200 V → Z = 100 Ω, I = 2 A,
 *           V_L = 300 V (> the 200 V source — the classic surprise)
 *   • p10 : L = 0.4 H, C = 10 µF, R = 10 Ω, 40 V → ω_r = 500 rad/s, I = 4 A,
 *           V_L = V_C = 800 V
 *   • p11 : the same circuit → Q = 20, Δω = 25 rad/s, half-power at 487.7/512.7
 *   • p12 : a 6.0 kW motor at 250 V, cos φ = 0.6 → 40 A, corrected to 24 A
 *   • p13 : 120:2400 turns, 240 V → 4800 V; grid at 4 kV vs 40 kV
 *
 * Numbers deliberately DISJOINT from p5–8 (which used 100 Ω / 220 V / 50 Hz;
 * 0.50 H; 15 µF; and a mirrored 3-4-5 pair at ω = 1000 rad/s with R = 30 Ω),
 * so the reader never mistakes a new circuit for an old one.
 *
 * Run: node scripts/physics12-book/build_ch7_c_lcr.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 7;

// ── p9 · The Series LCR Circuit ──────────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'ac-series-lcr-circuit',
  title: 'The Series LCR Circuit',
  subtitle: 'All three elements at once, and the arrows that sort them out',
  glossary: [
    { term: 'impedance', definition: 'The total opposition a circuit offers to an alternating current, $ Z = V_{rms}/I_{rms} $. Measured in ohms, but unlike resistance it depends on frequency.' },
    { term: 'phase angle', definition: 'The angle $ \\phi $ by which the source voltage leads the current. Positive when the circuit is inductive, negative when it is capacitive, zero when it is purely resistive.' },
    { term: 'inductive circuit', definition: 'A circuit in which $ X_L > X_C $, so the net reactance behaves like an inductor and the current lags the source voltage.' },
    { term: 'capacitive circuit', definition: 'A circuit in which $ X_C > X_L $, so the net reactance behaves like a capacitor and the current leads the source voltage.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A resistor, an inductor and a capacitor are joined end to end and connected across a $ 200 $ V alternating supply.\n\nA voltmeter is placed across the resistor. It reads $ 120 $ V.\nAcross the capacitor: $ 140 $ V.\nAcross the inductor: $ 300 $ V.\n\nThat last reading is larger than the supply itself. Three voltmeters, one supply, and the parts add up to $ 560 $ V.\n\nIs one of the meters faulty, or is something else going on?',
      hint: 'Try adding them the way page 4 taught you to add alternating quantities, rather than the way you would add three torch cells.',
      reveal: 'Every meter is telling the truth.\n\nOrdinary addition is the wrong tool. These three voltages **do not peak at the same instant**, so their numbers cannot simply be piled on top of one another. Page 4 gave you the right tool: draw each as an arrow, and add the arrows.\n\nThe inductor voltage and the capacitor voltage point in exactly opposite directions — one is $ 90^\\circ $ ahead of the current, the other $ 90^\\circ $ behind it, so they are $ 180^\\circ $ apart. They fight each other. Their combined effect is $ 300 - 140 = 160 $ V, not $ 440 $ V.\n\nThat leftover $ 160 $ V sits at right angles to the resistor\'s $ 120 $ V, and the two combine by Pythagoras:\n\n$ \\sqrt{120^{2} + 160^{2}} = 200 $ V — exactly the supply.\n\nSo nothing is broken, and nothing is being created. A large voltage across the inductor is being cancelled, almost entirely, by a large voltage across the capacitor. This page builds the machinery that makes that statement routine.',
    }),
    b('text', 1, {
      markdown: 'Put $ R $, $ L $ and $ C $ in a **series** loop across an alternating source. Series means one path, so there is only one current, and at every instant it is the same in all three elements.\n\nThat single fact decides the whole method. Since the current is common to all three, **draw the current as the reference arrow** and hang everything else off it. Page 8 did exactly this for two elements at a time; nothing new is needed, only one more arrow.',
    }),
    b('heading', 2, {
      text: 'One current, three voltages',
      level: 2,
      objective: 'Draw the phasor diagram of a series LCR circuit and use it to obtain the impedance.',
    }),
    b('text', 3, {
      markdown: 'Take the current phasor $ I $ along the reference direction. Then, straight from pages 5 to 7:\n\n- **Across the resistor:** $ V_R = IR $, drawn **along** $ I $. A resistor never shifts the phase.\n- **Across the inductor:** $ V_L = IX_L $, drawn $ 90^\\circ $ **ahead** of $ I $. The voltage leads, so the current lags.\n- **Across the capacitor:** $ V_C = IX_C $, drawn $ 90^\\circ $ **behind** $ I $. The voltage lags, so the current leads.\n\nNow look at what that picture is telling you. $ V_L $ points one way; $ V_C $ points the exact opposite way. **They are antiparallel, so they subtract before anything else happens.** Combine them first and you are left with a single arrow of size $ |V_L - V_C| $, perpendicular to $ V_R $.\n\nOne perpendicular pair remains, so Pythagoras finishes the job:\n\n$ V = \\sqrt{V_R^{2} + (V_L - V_C)^{2}} = I\\sqrt{R^{2} + (X_L - X_C)^{2}} $\n\nDivide through by the current and what is left is the circuit\'s total opposition — its **impedance**.',
    }),
    // TWO-PANEL, deliberately. The page previously showed only the phasor
    // diagram, so a reader met the abstract vector picture of a series LCR
    // circuit without ever having seen the physical loop it stands for — on the
    // one page in the chapter where the classic schematic matters most. The
    // circuit schematic is therefore the LEFT panel of this same image rather
    // than a second image block, because the page is already at the 18-block cap.
    b('image', 4, {
      src: '',
      alt: 'Two panels side by side: on the left the physical series LCR circuit — an AC source, a resistor, an inductor and a capacitor in one loop; on the right the phasor diagram of that same circuit, with the current as reference and the resistor, inductor and capacitor voltages drawn from it',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Left, the loop you would actually build. Right, the same circuit as arrows — add the two vertical ones first, because they oppose each other, and what is left is a single right-angled triangle.',
      generation_prompt: 'Clean scientific two-panel figure on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition, the two panels separated by a single thin faint vertical dividing line. LEFT PANEL, the physical circuit: one closed rectangular loop of thin warm-amber wire. On the left-hand side of the loop sits an alternating-source symbol drawn as a circle containing a small sine-wave squiggle, labelled v. Along the top run of the loop, in order from left to right, three components in series: a resistor drawn as a sharp zigzag labelled R, an inductor drawn as four tight semicircular coils labelled L, and a capacitor drawn as two short parallel vertical plates with a clear gap between them labelled C. A small bright-orange arrow sits on the wire between the source and the resistor, labelled I, showing that one single current passes through all three components. RIGHT PANEL, the phasor diagram of that same circuit: from a single origin, one bold warm-amber horizontal arrow pointing right labelled I, a second warm-amber horizontal arrow of similar length just above it labelled V_R, one long bright-orange arrow pointing straight up labelled V_L, and one shorter cool-blue arrow pointing straight down labelled V_C. Beside these, the resultant construction: a dashed grey vertical arrow of length equal to the difference V_L minus V_C rising from the tip of V_R, and a bold bright-amber resultant arrow from the origin to its tip labelled V, with a small arc marking the angle phi between V and the horizontal, and a faint dotted right-angle square at the corner. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('latex_block', 5, {
      latex: 'Z = \\sqrt{R^{2} + (X_L - X_C)^{2}}',
      label: 'Impedance of a series LCR circuit',
      note: 'The two reactances enter as a DIFFERENCE, never a sum — because they act in opposite directions. This one minus sign is what the rest of the chapter is built on.',
      highlight: true,
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'In a series LCR circuit a voltmeter reads $ 300 $ V across the inductor and $ 140 $ V across the capacitor. Taken together, what do those two contribute to the source voltage?',
      options: [
        '$ 440 $ V, because voltages in series add up',
        '$ 220 $ V, the average of the two readings',
        '$ 160 $ V, since they act in opposite senses',
        '$ 0 $ V, because reactances waste no power',
      ],
      correct_index: 2,
      reveal: '**$ 160 $ V — the difference, not the sum.**\n\nThe inductor voltage peaks a quarter of a cycle **before** the current; the capacitor voltage peaks a quarter of a cycle **after** it. That puts them half a cycle apart, which is to say exactly out of step. When one is at its positive maximum the other is at its negative maximum.\n\nSo at every single instant they are pulling against each other, and only the surplus survives: $ 300 - 140 = 160 $ V.\n\n**Why the "adds up to $ 440 $ V" answer feels right and is wrong.** For steady DC, voltages round a series loop really do add arithmetically, and that habit is hard to break. It works only because DC voltages have no timing to disagree about. The instant quantities start oscillating with different phases, arithmetic addition stops being legal and arrow addition takes over.\n\n**And the zero-power idea is a separate true fact used in the wrong place.** An ideal inductor and an ideal capacitor really do dissipate no average power — page 12 is about that — but dissipating nothing is not the same as having no voltage across you. The meter reading is real.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Inductive, capacitive, or neither',
      level: 2,
      objective: 'Decide from $ X_L $ and $ X_C $ whether the current leads or lags, and compute the phase angle.',
    }),
    b('text', 8, {
      markdown: 'Page 8 already handed you the signed form of the phase angle, with $ \\phi $ defined as the angle by which the **source voltage leads the current**. Nothing about that changes here; the net reactance simply has two contributions instead of one.\n\nRead the angle straight off the triangle: the side opposite is $ V_L - V_C = I(X_L - X_C) $, the side adjacent is $ V_R = IR $, and the current cancels.\n\nThe **sign** of $ X_L - X_C $ is the whole story, and there are only three cases.\n\n**If $ X_L > X_C $** the net arrow points upwards, $ \\phi $ is positive, the voltage leads and the **current lags**. The circuit as a whole behaves like an inductor with some resistance — whatever the capacitor is doing, the inductor is winning.\n\n**If $ X_C > X_L $** the net arrow points downwards, $ \\phi $ is negative, and the **current leads**. The circuit behaves capacitively.\n\n**If $ X_L = X_C $** the two cancel completely, $ \\phi = 0 $, and the circuit behaves as though the inductor and capacitor were not there at all. That third case is so important it gets the whole of the next page.\n\nNotice that none of this is fixed by the components alone. $ X_L = \\omega L $ grows with frequency and $ X_C = \\frac{1}{\\omega C} $ shrinks with it, so **the same circuit is capacitive at low frequency and inductive at high frequency.** Change the dial on the source and you change which one wins.',
    }),
    b('latex_block', 9, {
      latex: '\\tan\\phi = \\frac{X_L - X_C}{R}',
      label: 'Phase angle of a series LCR circuit',
      note: 'φ positive → current lags → inductive. φ negative → current leads → capacitive. φ zero → resonance.',
      highlight: true,
    }),
    b('table', 10, {
      caption: 'Three cases, and only three. The sign of the net reactance settles all of them.',
      headers: ['Condition', 'Net reactance', 'Phase angle $ \\phi $', 'The current'],
      rows: [
        ['$ X_L > X_C $', 'inductive', 'positive', 'lags the source voltage'],
        ['$ X_L = X_C $', 'zero', '$ 0 $', 'in step with the source voltage'],
        ['$ X_L < X_C $', 'capacitive', 'negative', 'leads the source voltage'],
      ],
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'A series LCR circuit is driven at a frequency where $ X_C $ is larger than $ X_L $. What is the current doing relative to the source voltage?',
      options: [
        'Leading it, so the circuit behaves capacitively',
        'Lagging it, so the circuit behaves inductively',
        'Staying in step, because $ R $ fixes the phase',
        'Leading it by a full $ 90^\\circ $ at all times',
      ],
      correct_index: 0,
      reveal: '**Leading it — the circuit behaves capacitively.**\n\nWith $ X_C > X_L $ the quantity $ X_L - X_C $ is negative, so $ \\tan\\phi $ is negative and $ \\phi $ is negative. A negative $ \\phi $ means the voltage arrow sits *behind* the current arrow, which is the same as saying the current runs ahead.\n\nThe physical picture is simpler than the algebra. The capacitor is offering more opposition than the inductor, so the capacitor is setting the character of the circuit — and a capacitor is the element whose current leads.\n\n**Two traps worth naming.**\n\nThe resistor does not decide the phase; it only decides how *big* the phase angle is by sitting in the denominator. Raising $ R $ with the reactances unchanged pulls $ \\phi $ towards zero, but it can never flip the sign.\n\nAnd the lead is a **full** $ 90^\\circ $ only if there is no resistance at all. With $ R $ present, $ \\phi $ is somewhere strictly between $ 0 $ and $ 90^\\circ $ — the resistor drags the total back towards being in step.',
      difficulty_level: 2,
    }),
    b('step_solver', 12, {
      title: 'A series LCR circuit, worked end to end',
      problem: 'A series circuit has $ R = 60\\ \\Omega $, and at the working frequency $ X_L = 150\\ \\Omega $ and $ X_C = 70\\ \\Omega $. It is connected to a $ 200 $ V (rms) source. Find the impedance, the current, the voltage across each element and the phase angle — and then check the phasor sum.',
      intro: 'Do it in this order every time: net reactance, then impedance, then current, then the separate voltages. Working out of order is where most of the arithmetic errors come from.',
      steps: [
        st('$ X_L - X_C = 150 - 70 = 80\\ \\Omega $',
          'Subtract, do not add. The inductor is winning by $ 80\\ \\Omega $, so the circuit is inductive and the current will lag.', {
            check: {
              kind: 'mcq',
              prompt: 'What is the net reactance of this circuit?',
              options: ['$ 220\\ \\Omega $, the sum', '$ 80\\ \\Omega $, the difference', '$ 10500\\ \\Omega $, the product', '$ 2.1\\ \\Omega $, the ratio'],
              answer_index: 1,
              feedback_right: 'Right — the two reactances point in opposite directions on the phasor diagram, so only the surplus survives.',
              feedback_wrong: 'The inductor voltage and the capacitor voltage are half a cycle apart, so they cancel as far as they can. Take the difference: $ 150 - 70 = 80\\ \\Omega $.',
            },
          }),
        st('$ Z = \\sqrt{60^{2} + 80^{2}} = \\sqrt{3600 + 6400} = 100\\ \\Omega $',
          'Resistance and net reactance are perpendicular, so they combine by Pythagoras — never by adding.'),
        st('$ I_{rms} = \\frac{200}{100} = 2.0\\ \\text{A} $',
          'Impedance plays exactly the role resistance plays in Ohm\'s law, provided you use rms values on both sides.', {
            check: {
              kind: 'mcq',
              prompt: 'Which current flows through the capacitor?',
              options: ['A smaller one, since $ X_C $ is smallest', 'The same $ 2.0 $ A as everywhere else', 'A larger one, since it leads', 'None, because a capacitor blocks current'],
              answer_index: 1,
              feedback_right: 'Yes — it is a series loop, so there is exactly one current and every element carries it.',
              feedback_wrong: 'In a series loop there is only one path, so one current. The elements differ in the VOLTAGE they develop, not in the current they carry.',
            },
          }),
        st('$ V_R = 120\\ \\text{V},\\quad V_L = 300\\ \\text{V},\\quad V_C = 140\\ \\text{V} $',
          'Each is just current times that element\'s own opposition: $ 2\\times60 $, $ 2\\times150 $ and $ 2\\times70 $.'),
        st('$ \\tan\\phi = \\frac{80}{60} = 1.33 $, so $ \\phi \\approx 53^\\circ $',
          'Positive, so the source voltage leads the current by about $ 53^\\circ $ — the current lags by a little under a sixth of a cycle.'),
        st('$ \\sqrt{120^{2} + (300 - 140)^{2}} = \\sqrt{14400 + 25600} = 200\\ \\text{V} $',
          'The phasor sum returns the source voltage exactly. Always finish with this check — it catches a wrong reactance or a slipped decimal in one line.', {
            check: {
              kind: 'mcq',
              prompt: 'The three voltmeter readings total $ 560 $ V, yet the source is $ 200 $ V. What does that tell you?',
              options: ['A meter must be reading wrongly', 'The readings must be added as phasors', 'Energy is being created in the coil', 'The source must be overloaded'],
              answer_index: 1,
              feedback_right: 'Exactly — arithmetic addition assumes the peaks coincide, and here they do not.',
              feedback_wrong: 'Nothing is faulty. The three voltages peak at different instants, so they must be added as arrows. Done that way they give back $ 200 $ V precisely.',
            },
          }),
      ],
      now_you_try: {
        problem: 'The same source is now $ 150 $ V, and the circuit has $ R = 45\\ \\Omega $, $ X_L = 30\\ \\Omega $, $ X_C = 90\\ \\Omega $. Find $ Z $, the current, the three voltages and the phase angle — and say whether the current leads or lags.',
        answer: '$ Z = 75\\ \\Omega $, $ I = 2.0 $ A, $ V_R = 90 $ V, $ V_L = 60 $ V, $ V_C = 180 $ V, and $ \\phi \\approx -53^\\circ $ — the current **leads**.',
        solution: 'Net reactance: $ X_L - X_C = 30 - 90 = -60\\ \\Omega $. Negative, so this one is capacitive.\n\n$ Z = \\sqrt{45^{2} + 60^{2}} = \\sqrt{2025 + 3600} = \\sqrt{5625} = 75\\ \\Omega $\n\n$ I = \\frac{150}{75} = 2.0\\ \\text{A} $\n\n$ V_R = 2\\times45 = 90 $ V, $ V_L = 2\\times30 = 60 $ V, $ V_C = 2\\times90 = 180 $ V.\n\n$ \\tan\\phi = \\frac{-60}{45} = -1.33 $, so $ \\phi \\approx -53^\\circ $ and the current runs ahead of the voltage.\n\nCheck: $ \\sqrt{90^{2} + (60 - 180)^{2}} = \\sqrt{8100 + 14400} = \\sqrt{22500} = 150 $ V ✓\n\n**Compare the two problems.** Same shape of answer, opposite character. In the first, the inductor reading exceeded the source; in this one, the capacitor reading does. Whichever element has the larger reactance is the one that ends up with the alarming voltmeter reading — and it is always the one that is being cancelled by its partner.',
      },
    }),
    b('callout', 13, {
      variant: 'warning',
      title: 'A part can be bigger than the whole here',
      markdown: 'In both worked circuits, one element carried a voltage **larger than the source**: $ 300 $ V against a $ 200 $ V supply, and $ 180 $ V against a $ 150 $ V supply.\n\nThis is not a trick of the arithmetic and it is not a rounding artefact. It is real, it is measurable, and on page 10 it becomes enormous.\n\nThe reason it is allowed is that $ V_L $ and $ V_C $ are **never large at the same moment**. When the inductor is at its peak the capacitor is at its trough, so the pair of them together never demands more than the source can give. It is only when you point a meter at one of them alone, ignoring its partner, that the number looks impossible.\n\n**Two practical consequences.**\n\nIn an exam, never "check" your answer by adding the three voltmeter readings and comparing with the source. They will not match, and they are not supposed to. Add them as phasors.\n\nIn a laboratory, treat an LCR circuit with respect. A $ 12 $ V supply can put several hundred volts across a coil near resonance, and the coil does not care that the label on the source says $ 12 $ V.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Series means **one current**, so draw the current first and hang the voltages off it.\n- $ V_R $ along $ I $; $ V_L $ a quarter cycle ahead; $ V_C $ a quarter cycle behind.\n- $ V_L $ and $ V_C $ are opposite, so **subtract them before anything else**.\n- $ Z = \\sqrt{R^{2} + (X_L - X_C)^{2}} $ and $ \\tan\\phi = \\frac{X_L - X_C}{R} $.\n- $ X_L > X_C $ → inductive, current **lags**. $ X_C > X_L $ → capacitive, current **leads**.\n- The same circuit switches character with frequency, because $ X_L $ rises and $ X_C $ falls.\n- $ V_L $ or $ V_C $ may exceed the source. Check with $ \\sqrt{V_R^{2} + (V_L - V_C)^{2}} $, never by adding.',
    }),
    b('text', 15, {
      markdown: 'Next: the third case, where $ X_L $ and $ X_C $ cancel exactly. It turns out to happen at a frequency you have already met — on page 1, in a circuit with no source in it at all.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The impedance of a series LCR circuit is',
          ['$ \\sqrt{R^{2} + (X_L - X_C)^{2}} $', '$ R + X_L + X_C $', '$ \\sqrt{R^{2} + (X_L + X_C)^{2}} $', '$ R + |X_L - X_C| $'],
          0,
          'Resistance and net reactance are perpendicular on the phasor diagram, so they combine by Pythagoras; and the two reactances point opposite ways, so they enter as a difference. Adding them straight would assume all three voltages peak together, which they do not.',
          1),
        q('At a frequency where $ X_L $ exceeds $ X_C $, the current in a series LCR circuit',
          ['lags the source voltage', 'leads the source voltage', 'is exactly in step with it', 'falls to zero'],
          0,
          'A positive net reactance makes $ \\tan\\phi $ positive, so the voltage arrow sits ahead of the current arrow. The inductor is winning, and an inductor is the element whose current runs behind.',
          2),
        q('A voltmeter across the inductor alone can read more than the source voltage because',
          ['the L and C voltages partly cancel', 'the inductor stores extra energy', 'the voltmeter loads the circuit', 'the source reading is only an average'],
          0,
          'The inductor and capacitor voltages peak half a cycle apart, so a large reading on one is being offset by a large reading on the other. Only the phasor sum has to match the source, and it does exactly.',
          3),
      ],
    }),
  ],
};

// ── p10 · Resonance ──────────────────────────────────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'ac-resonance',
  title: 'Resonance',
  subtitle: 'The frequency the circuit was already carrying inside it',
  glossary: [
    { term: 'resonance', definition: 'The condition $ X_L = X_C $, at which a series LCR circuit offers its smallest impedance, carries its largest current, and behaves as though only the resistor were present.' },
    { term: 'resonant frequency', definition: 'The driving frequency at which resonance occurs: $ \\omega_r = \\frac{1}{\\sqrt{LC}} $. It is set by $ L $ and $ C $ alone — the resistance has no say in where it lies.' },
    { term: 'tuning', definition: 'Adjusting $ L $ or $ C $ so that a circuit\'s resonant frequency matches the frequency of a wanted signal, and no other.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Page 1 of this chapter had a circuit with **no source in it at all** — just a charged capacitor and a coil, left alone. You found it rings by itself, sloshing energy back and forth, at\n\n$ \\omega = \\frac{1}{\\sqrt{LC}} $\n\nPage 9 had a completely different circuit: the same $ L $ and $ C $, but now with a resistor and an outside source that you can set to **any** frequency you like.\n\nHere is the question. Out of all the frequencies you could dial up on that source, is there anything special about dialling up exactly the number that the free circuit was ringing at?',
      hint: 'Think about pushing a child on a swing. The swing has its own rhythm whether you push or not. What happens when your pushes match it?',
      reveal: 'Everything is special about it, and this is the moment the chapter has been building towards.\n\nA swing has a natural rhythm of its own. Push it at random and you fight it; push it in step with that rhythm and small pushes build into a large swing. The LC pair is the same: it has one frequency it naturally oscillates at, and a source driving it at that frequency is pushing in step.\n\nAt that frequency the inductor\'s opposition and the capacitor\'s opposition become **exactly equal** and cancel each other out. What is left in the way of the current is the resistor and nothing else. The impedance falls to its lowest possible value, the current rises to its highest, and the circuit stops behaving like an inductor or a capacitor and behaves like a plain resistor.\n\nThat condition is called **resonance**. And the fact that its frequency turns out to be the same $ \\frac{1}{\\sqrt{LC}} $ you met on page 1 is not a numerical coincidence — it is the same physics arriving twice, which is exactly why this chapter opened where it did.',
    }),
    b('text', 1, {
      markdown: 'Start from the two facts you already have. $ X_L = \\omega L $ **grows** with frequency; $ X_C = \\frac{1}{\\omega C} $ **shrinks** with it.\n\nOne rising curve, one falling curve. They must cross, and they cross exactly once. At that crossing $ X_L = X_C $ — and page 9 told you that is the case where the net reactance vanishes.\n\nFinding the frequency is a single line of algebra:\n\n$ \\omega_r L = \\frac{1}{\\omega_r C} \\quad\\Rightarrow\\quad \\omega_r^{2} = \\frac{1}{LC} $',
    }),
    b('heading', 2, {
      text: 'The condition, and the frequency it picks out',
      level: 2,
      objective: 'Derive the resonant frequency from $ X_L = X_C $ and state what happens to $ Z $, $ I $ and $ \\phi $ there.',
    }),
    b('text', 3, {
      markdown: 'Take the square root and the resonant frequency drops out:\n\n$ \\omega_r = \\frac{1}{\\sqrt{LC}} \\qquad\\text{or}\\qquad f_r = \\frac{1}{2\\pi\\sqrt{LC}} $\n\nNow feed $ X_L = X_C $ back into page 9\'s two results and read off the consequences. There are four, and they all say the same thing in different words.\n\n**Impedance is at its minimum.** $ Z = \\sqrt{R^{2} + 0} = R $. It cannot go below $ R $ at any frequency, because the squared term you are throwing away is never negative.\n\n**Current is at its maximum.** $ I = \\frac{V}{R} $ — the largest current the source can drive through this circuit at any frequency whatsoever.\n\n**Phase angle is zero.** $ \\tan\\phi = \\frac{0}{R} = 0 $, so the current is exactly in step with the source voltage. Neither leading nor lagging.\n\n**The circuit is purely resistive.** As far as the source can tell, the inductor and capacitor have vanished. They have not, of course — each still carries a large voltage — but their two voltages are equal and opposite at every instant, so the pair contributes nothing to what the source sees.\n\nOne warning before the algebra runs away with you: **a circuit needs both $ L $ and $ C $ to resonate.** An L-R circuit has no $ X_C $ to cancel against and a C-R circuit has no $ X_L $. Only when the two are present together can they annihilate each other.',
    }),
    b('latex_block', 4, {
      latex: 'X_L = X_C \\quad \\Rightarrow \\quad \\omega_r = \\frac{1}{\\sqrt{LC}}',
      label: 'The resonance condition, and the frequency it selects',
      note: 'Set by L and C only. The resistance does not appear — it changes how sharp the resonance is, never where it sits.',
      highlight: true,
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'A series LCR circuit is driven at a frequency far **below** its resonant frequency. How does it behave there?',
      options: [
        'Inductively, with the current lagging the voltage',
        'As a pure resistance, with no phase difference',
        'With its impedance at the smallest possible value',
        'Capacitively, with the current leading the voltage',
      ],
      correct_index: 3,
      reveal: '**Capacitively — the current leads.**\n\nLow frequency does two things at once, and both point the same way. $ X_L = \\omega L $ becomes **small**, because a slowly changing current barely troubles an inductor. $ X_C = \\frac{1}{\\omega C} $ becomes **large**, because a capacitor has plenty of time to charge up and push back.\n\nSo well below resonance $ X_C $ dominates completely, the net reactance is negative, $ \\phi $ is negative, and the current runs ahead. Push the frequency far enough down and the capacitor eventually blocks the circuit almost entirely — which is the direct-current limit, where a capacitor is an open gap.\n\n**The picture worth carrying.** Sweep the frequency upwards from near zero and the circuit walks through all three of page 9\'s cases in order: **capacitive below resonance, purely resistive at it, inductive above it.** One circuit, three personalities, chosen by the dial on the source.\n\nThe two answers about minimum impedance and zero phase difference are both true statements — but they are true **at** resonance, not far below it. Reading them as general properties of the circuit is the commonest error here.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'Why this is the same number as page 1',
      level: 2,
      objective: 'Explain why the driven circuit resonates at exactly the frequency the free LC loop oscillates at.',
    }),
    b('text', 7, {
      markdown: 'It is worth stopping on this, because it is the payoff the whole chapter was arranged around.\n\nOn **page 1** there was no source and no resistor. A charged capacitor was allowed to discharge through a coil, and the energy went back and forth — capacitor to inductor to capacitor — at the natural frequency\n\n$ \\omega = \\frac{1}{\\sqrt{LC}} $\n\nOn **this page** there is a source, and it can be set to anything. Yet the frequency at which the circuit responds most strongly is\n\n$ \\omega_r = \\frac{1}{\\sqrt{LC}} $\n\nThe same expression. Not a similar one, not one that happens to look alike — **the same one**.\n\n**And it could not have been otherwise.** Both numbers come from the identical piece of physics: the rate at which an inductor and a capacitor hand energy to one another. Page 1 measured that rate with nothing else in the circuit. This page measures it by asking which driving frequency the circuit is most willing to accept. A system driven at its own natural frequency responds most strongly — that is true of a swing, a tuning fork, a bridge in a crosswind, and this circuit.\n\nSo when the source drives at $ \\omega_r $, it is not fighting the $ L $ and $ C $ at all. Those two are busy passing energy back and forth between themselves in a rhythm they would have kept anyway, and every joule the source supplies goes straight into the resistor. The source only ever sees $ R $.\n\n**This is why LC oscillations opened the chapter rather than closing it.** Met at the end, $ \\frac{1}{\\sqrt{LC}} $ would have been one more formula to remember. Met first, it is a number the reader already owns, arriving here as a payoff.',
    }),
    b('image', 8, {
      src: '',
      alt: 'Graph of current against driving frequency for a series LCR circuit, peaking sharply at the resonant frequency',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'One peak, at the frequency the L and C would have chosen for themselves.',
      generation_prompt: 'Clean scientific line graph on a near-black background (#0B0C0F), thin dim-grey axes with small tick marks. Horizontal axis labelled with the driving angular frequency, vertical axis labelled with the rms current. A single smooth bright-amber curve rises from near zero on the left, peaks sharply at a marked point roughly in the middle, and falls away to the right. A thin dashed vertical grey line drops from the peak to the horizontal axis where a small label reads omega_r, and a thin dashed horizontal grey line runs from the peak to the vertical axis where a small label reads V over R. Below the curve, three small phasor thumbnails sit along the axis: at the left a short arrow tilted below the horizontal, at the centre an arrow lying flat on the horizontal, at the right an arrow tilted above the horizontal. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('table', 9, {
      caption: 'The same circuit swept from low frequency to high. Only the dial on the source is being changed.',
      headers: ['Driving frequency', 'Which reactance wins', 'Impedance', 'Current', 'Phase'],
      rows: [
        ['well below $ \\omega_r $', '$ X_C $ — capacitive', 'large', 'small', 'current leads'],
        ['at $ \\omega_r $', 'neither — they cancel', '$ Z = R $, smallest', 'largest', 'in step'],
        ['well above $ \\omega_r $', '$ X_L $ — inductive', 'large', 'small', 'current lags'],
      ],
    }),
    b('worked_example', 10, {
      label: 'finding resonance, and what happens there',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A series circuit has $ L = 0.40 $ H, $ C = 10\\ \\mu\\text{F} $ and $ R = 10\\ \\Omega $, driven by a $ 40 $ V (rms) source of adjustable frequency. Find the resonant angular frequency and the corresponding frequency in hertz. At resonance, find the impedance, the current, and the voltage across the inductor. Then compare the current with what flows at $ \\omega = 250 $ rad/s.',
      solution: '**Resonant frequency.**\n\n$ LC = (0.40)(10\\times10^{-6}) = 4.0\\times10^{-6} $\n\n$ \\omega_r = \\frac{1}{\\sqrt{4.0\\times10^{-6}}} = \\frac{1}{2.0\\times10^{-3}} = 500\\ \\text{rad/s} $\n\n$ f_r = \\frac{500}{2\\pi} \\approx 79.6\\ \\text{Hz} $\n\n**Check that the reactances really do match there.**\n\n$ X_L = \\omega_r L = (500)(0.40) = 200\\ \\Omega $\n\n$ X_C = \\frac{1}{\\omega_r C} = \\frac{1}{(500)(10\\times10^{-6})} = 200\\ \\Omega $ ✓\n\nThey are equal, as they must be — this is a check on the arithmetic, not new physics.\n\n**At resonance.**\n\n$ Z = R = 10\\ \\Omega $, so $ I = \\frac{40}{10} = 4.0\\ \\text{A} $\n\n$ V_L = IX_L = (4.0)(200) = 800\\ \\text{V} $\n\n**Read that last line again.** A $ 40 $ V source, and $ 800 $ V across the coil — twenty times the supply. And $ V_C $ is also $ 800 $ V, pointing the opposite way, so the two cancel perfectly and the source still only has to provide $ 40 $ V. Page 9 warned that a part can exceed the whole in these circuits; at resonance it does so spectacularly. Page 11 puts a number on exactly how spectacularly.\n\n**Now off resonance, at $ \\omega = 250 $ rad/s** — half the resonant value.\n\n$ X_L = (250)(0.40) = 100\\ \\Omega $\n\n$ X_C = \\frac{1}{(250)(10\\times10^{-6})} = 400\\ \\Omega $\n\nNet reactance $ = 100 - 400 = -300\\ \\Omega $, so capacitive, and\n\n$ Z = \\sqrt{10^{2} + 300^{2}} = \\sqrt{90100} \\approx 300\\ \\Omega $\n\n$ I = \\frac{40}{300} \\approx 0.13\\ \\text{A} $\n\n**The comparison is the point.** Halving the frequency dropped the current from $ 4.0 $ A to about $ 0.13 $ A — a factor of thirty, from one turn of a dial. That extreme fussiness about frequency is not a nuisance; it is the entire basis of tuning, and page 11 is about how to control it.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'Two series circuits are built from identical inductors and identical capacitors, but one uses a $ 5\\ \\Omega $ resistor and the other a $ 500\\ \\Omega $ resistor. Compare their resonant frequencies.',
      options: [
        'The larger resistor gives the higher resonant frequency',
        'Both circuits resonate at exactly the same frequency',
        'The smaller resistor gives the higher resonant frequency',
        'Neither resonates unless the resistance is exactly zero',
      ],
      correct_index: 1,
      reveal: '**Exactly the same frequency in both.**\n\nResonance is defined by $ X_L = X_C $, and there is no $ R $ anywhere in that condition. Solving it gives $ \\omega_r = \\frac{1}{\\sqrt{LC}} $, which again contains no $ R $. The resistor simply is not part of the question of *where* resonance happens.\n\n**What the resistor does control is how the two circuits behave at that frequency.** The $ 5\\ \\Omega $ circuit reaches a current of $ V/5 $; the $ 500\\ \\Omega $ circuit only manages $ V/500 $, a hundred times smaller. And the small-resistance circuit\'s response is far more sharply concentrated around $ \\omega_r $, while the large-resistance one responds sluggishly over a wide spread of frequencies.\n\nSo the resistor sets the **height and the width** of the peak, and $ L $ and $ C $ set its **position**. Keeping those two roles separate is the single most useful idea to carry into the next page, which is about nothing else.\n\n**And resistance is certainly not fatal to resonance.** Every real circuit has some — the coil\'s own wire has resistance whether you want it or not. Zero resistance would give an infinite current at resonance, which is a signal that the idealisation has been pushed too far, not a design target.',
      difficulty_level: 2,
    }),
    // BEYOND-NCERT ASIDE. The chapter never mentions the PARALLEL LCR circuit,
    // where the resonance result is exactly inverted — impedance maximum, line
    // current minimum. That is fine for NCERT bookwork and for taxonomy
    // compliance, but students routinely carry the series sentence ("at
    // resonance the current is maximum") across to a parallel circuit and get
    // it backwards, and the parallel case is JEE-Advanced examinable. It lives
    // on THIS page rather than p11 because p11 is already at the 18-block cap
    // once the circuit_bench simulation is placed, and because the statement it
    // reverses — Z minimum, I maximum at resonance — is derived right here.
    // `note` is deliberate: it renders collapsed, so an aside stays an aside.
    b('callout', 12, {
      variant: 'note',
      title: 'Beyond NCERT — the circuit that does the exact opposite',
      markdown: 'Everything on this page describes the **series** circuit, where $ L $, $ C $ and $ R $ sit one after another in a single loop. Put those same three elements in **parallel** — all three straight across the source — and the resonance turns inside out.\n\nIn the parallel circuit every element gets the full source voltage and draws its own branch current. The inductor branch lags that voltage by a quarter cycle; the capacitor branch leads it by a quarter cycle. So the two branch currents are half a cycle apart and **subtract** — exactly the way $ V_L $ and $ V_C $ subtracted on page 9.\n\nThey become equal in size at $ \\omega_r = \\frac{1}{\\sqrt{LC}} $, the very frequency this page has just derived. There they cancel completely, and the source is left supplying nothing but the resistor branch.\n\nSo at that one frequency a parallel circuit has its impedance at a **maximum** and the current drawn from the line at a **minimum** — the exact reverse of the series result above. A series circuit is used to *accept* one frequency; a parallel circuit is used to *reject* one. That is why the two are called the acceptor and the rejector circuit.\n\nThe trap is obvious once it is named. Anyone who memorises "at resonance the current is largest" and carries that sentence into a parallel circuit gets it backwards every time. Attach the sentence to the **circuit**, never to the word resonance.\n\nNone of this is NCERT bookwork — but NCERT Exercise 7.17 asks you to prove it, and that exercise is waiting on the exercises page at the end of this chapter. Read the paragraphs above once now and it will already be half done.',
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Every radio aerial in a city is soaked in dozens of stations at once. The aerial cannot separate them — it picks up all of them together, as one meaningless jumble of voltage.\n\nThe separating is done by a series LCR circuit sitting behind the aerial. Turning the tuning knob turns a **variable capacitor**: two sets of metal plates that slide in and out of each other, changing the overlap area and so changing $ C $. Changing $ C $ moves $ \\omega_r = \\frac{1}{\\sqrt{LC}} $.\n\nWhen $ \\omega_r $ lands on a station\'s carrier frequency, that one signal drives the circuit at resonance and produces a large current. Every other station is off-resonance, meets a much larger impedance, and produces almost nothing. **One station is amplified; the rest are ignored.**\n\nThis is why an old radio dial goes quiet between stations rather than playing everything at once. It is also why the same physics turns up wherever one frequency must be picked out of many — in a mobile handset\'s front end, in a metal detector, in the coil of a contactless card reader, and in the receiver of an MRI scanner listening for one precise nuclear frequency.\n\nThe part of the story this page cannot yet tell is *how narrow* the selection is — whether the neighbouring station is properly rejected or merely quietened. That is the next page.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. On the left a simple vertical aerial rod with several concentric dim-orange arcs radiating towards it from three small distant transmitter icons, each arc set drawn at a visibly different spacing to suggest three different frequencies. The aerial connects to a simple series circuit drawn in warm amber wire containing a coil symbol and a variable capacitor symbol with a diagonal arrow through it, then to a small speaker icon. Above the circuit a small inset graph shows a narrow bright-amber resonance peak with one of the three frequency markers falling exactly under the peak and the other two lying far out on the flat tails. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Resonance is the condition $ X_L = X_C $, which gives $ \\omega_r = \\frac{1}{\\sqrt{LC}} $ and $ f_r = \\frac{1}{2\\pi\\sqrt{LC}} $.\n- **This is the same $ \\omega $ as the free LC oscillation of page 1** — same physics, met twice.\n- At resonance: $ Z = R $ (minimum), $ I = \\frac{V}{R} $ (maximum), $ \\phi = 0 $, circuit purely resistive.\n- $ V_L $ and $ V_C $ are equal and opposite there. Each may be huge; together they cancel.\n- $ R $ does **not** affect where resonance lies — only how tall and how narrow the peak is.\n- Below $ \\omega_r $ the circuit is capacitive; above it, inductive. Sweep the dial and it changes character.\n- Both $ L $ and $ C $ must be present. An L-R or C-R circuit cannot resonate at all.',
    }),
    b('text', 15, {
      markdown: 'Next: two circuits can share a resonant frequency and still be completely different tuners. What separates them is the sharpness of the peak — and there is a single number that measures it.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('At resonance the impedance of a series LCR circuit is',
          ['equal to $ R $, its smallest value', 'equal to $ X_L + X_C $', 'zero, so the current is unlimited', 'largest, so the current is least'],
          0,
          'The reactive term $ (X_L - X_C)^{2} $ vanishes and only $ R^{2} $ is left under the square root. Since a squared term can never be negative, no other frequency can give a smaller impedance.',
          1),
        q('The resonant angular frequency of a series LCR circuit is',
          ['$ \\frac{1}{\\sqrt{LC}} $', '$ \\sqrt{LC} $', '$ \\frac{1}{LC} $', '$ \\frac{R}{L} $'],
          0,
          'Setting $ \\omega L = \\frac{1}{\\omega C} $ gives $ \\omega^{2} = \\frac{1}{LC} $, and the square root of that is the answer. The resistance never enters the condition, so it cannot appear in the result.',
          1),
        q('A series LCR circuit driven well above its resonant frequency behaves',
          ['inductively, with the current lagging', 'capacitively, with the current leading', 'resistively, with no phase shift', 'as an open gap, with no current'],
          0,
          'High frequency makes $ \\omega L $ large and $ \\frac{1}{\\omega C} $ small, so the inductor wins and the net reactance is positive. A positive net reactance is exactly the case in which the current runs behind the source voltage.',
          2),
      ],
    }),
  ],
};

// ── p11 · Sharpness of Resonance ─────────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'ac-sharpness-of-resonance',
  title: 'Sharpness of Resonance',
  subtitle: 'How narrow the peak is, and the one number that says so',
  glossary: [
    { term: 'quality factor', definition: 'The sharpness of a resonance, $ Q = \\frac{\\omega_r L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = \\frac{\\omega_r}{\\Delta\\omega} $. A pure number, with no units.' },
    { term: 'half-power points', definition: 'The two frequencies either side of resonance at which the power delivered has fallen to half its peak value — equivalently, at which the current has fallen to $ I_{max}/\\sqrt{2} $.' },
    { term: 'bandwidth', definition: 'The width of the resonance peak measured between the half-power points: $ \\Delta\\omega = \\omega_2 - \\omega_1 = \\frac{R}{L} $.' },
    { term: 'selectivity', definition: 'A circuit\'s ability to respond to one frequency while rejecting neighbouring ones. High $ Q $ means high selectivity.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two radios are tuned to exactly the same station. Their tuning circuits have identical inductors and identical capacitors, so by the last page they resonate at exactly the same frequency.\n\nThe first radio plays that station cleanly. The second plays it too — but with two neighbouring stations murmuring underneath it the whole time.\n\nSame resonant frequency, same components deciding it. So what is different about the second radio, and which single quantity would you have to change to fix it?',
      hint: 'Page 10 said the resistance has no effect on WHERE the peak is. It said nothing about the shape of the peak.',
      reveal: 'The **resistance** is different — and that is the only thing that needs to be.\n\nPage 10 was careful about this: $ L $ and $ C $ fix where the peak sits; $ R $ fixes how tall and how narrow it is. Two circuits can agree perfectly on the frequency and still disagree completely on how fussy they are about it.\n\nThe first radio has a **narrow** peak. At the wanted station the current is large; a little way off, it has already collapsed, so the neighbours are rejected.\n\nThe second radio has a **broad** peak. It still responds most strongly to the wanted station, but it responds nearly as strongly to anything nearby — so the neighbours come through as well.\n\nThat property has a name, **sharpness of resonance**, and a number that measures it, the **quality factor $ Q $**. This page defines it three equivalent ways, shows where each comes from, and works out exactly how wide a peak of a given $ Q $ is.',
    }),
    b('text', 1, {
      markdown: 'Start by looking at the resonance curve itself. Page 10 drew the current against the driving frequency:\n\n$ I = \\frac{V}{\\sqrt{R^{2} + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^{2}}} $\n\nAt $ \\omega = \\omega_r $ the bracket is zero and $ I = \\frac{V}{R} $ — the top of the peak. Move away from $ \\omega_r $ in either direction and the bracket grows, so the current falls.\n\n**Everything about the shape now depends on the size of $ R $ compared with how fast that bracket grows.**\n\nIf $ R $ is small, the peak is tall ($ V/R $ is large), and a slight move off resonance is enough for the bracket to swamp $ R $ and pull the current down hard. Tall and narrow.\n\nIf $ R $ is large, the peak is low, and you have to move a long way off resonance before the bracket becomes comparable to $ R $. Short and broad.',
    }),
    b('heading', 2, {
      text: 'What the resistance actually controls',
      level: 2,
      objective: 'Explain how $ R $ sets the height and width of the resonance curve without moving its position.',
    }),
    b('text', 3, {
      markdown: 'So a small resistance gives a **sharp** resonance and a large resistance gives a **flat** one. That is the qualitative statement, and it is worth having before any formula.\n\nBut "sharp" and "flat" are not measurements. To compare two circuits you need a number, and there is an obvious difficulty: how narrow a peak *looks* depends on how far up you measure it. Near the very top every peak is narrow; near the bottom every peak is wide.\n\nSo physics fixes a **convention**, and it is chosen for a physical reason rather than convenience: measure the width at the two frequencies where the **power delivered has dropped to half** its peak value. Those two frequencies are the **half-power points**, and the gap between them is the **bandwidth** $ \\Delta\\omega $.\n\nHalf the power is a natural place to cut because power is what a circuit is actually for. It is also the level at which an ear can just about tell that a signal has weakened — which is why the same convention runs through audio, radio and optics as well as this chapter.',
    }),
    b('image', 4, {
      src: '',
      alt: 'Three resonance curves of different quality factor plotted on the same axes, all peaking at the same frequency',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Same components, same peak position — three different resistances. The bandwidth is the width at the half-power line.',
      generation_prompt: 'Clean scientific line graph on a near-black background (#0B0C0F), thin dim-grey axes. Horizontal axis labelled with driving angular frequency, vertical axis labelled with rms current. Three smooth curves all peaking at the same central marked frequency: one very tall and narrow in bright amber, one of medium height and width in warm orange, one low and broad in dim dull orange. A thin dashed grey horizontal line crosses all three at a level well below the tallest peak, with short vertical tick marks where it cuts the medium curve and a small double-headed arrow between those two ticks labelled with a delta-omega symbol. A small label near the tallest curve reads high Q and one near the flattest reads low Q. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'spatial',
      prompt: 'Two series circuits use the same $ L $ and the same $ C $. Circuit X has $ R = 5\\ \\Omega $; circuit Y has $ R = 50\\ \\Omega $. Which statement is right?',
      options: [
        'X has the taller and narrower resonance peak',
        'Y has the taller and narrower resonance peak',
        'X resonates at a much higher frequency than Y',
        'Y carries the larger current at its own resonance',
      ],
      correct_index: 0,
      reveal: '**X — the smaller resistance gives the taller and narrower peak.**\n\nBoth halves of that follow from the same expression.\n\n*Taller:* at resonance $ I = \\frac{V}{R} $, so the $ 5\\ \\Omega $ circuit carries ten times the current the $ 50\\ \\Omega $ one does.\n\n*Narrower:* the current falls once the reactive bracket becomes comparable in size to $ R $. With $ R $ only $ 5\\ \\Omega $, a tiny move off resonance is already enough. With $ R = 50\\ \\Omega $ the bracket has to grow ten times as large before it matters, which takes a much bigger change of frequency.\n\nTall and narrow always travel together here, and both are the work of one small resistance.\n\n**The answer about a higher resonant frequency is the trap this page exists to kill.** Resonance is $ X_L = X_C $, a condition with no $ R $ in it, so $ \\omega_r = \\frac{1}{\\sqrt{LC}} $ is identical for both. The two peaks sit at exactly the same place on the frequency axis; they differ only in shape. Keeping *position* and *shape* in separate compartments is the whole skill on this page.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'Half-power points and bandwidth',
      level: 2,
      objective: 'Locate the half-power frequencies and show that the bandwidth is exactly $ \\frac{R}{L} $.',
    }),
    b('text', 7, {
      markdown: 'Now turn the convention into algebra. The average power delivered goes as $ I^{2}R $, so **half the power means the current has fallen by a factor of $ \\sqrt{2} $, not by half.** That single line is where most attempts go wrong, so it is worth saying twice.\n\nAt the peak, $ Z = R $. For the current to fall by $ \\sqrt{2} $, the impedance must rise by $ \\sqrt{2} $, so we need $ Z = \\sqrt{2}\\,R $. Squaring the impedance formula:\n\n$ R^{2} + (X_L - X_C)^{2} = 2R^{2} \\quad\\Rightarrow\\quad (X_L - X_C)^{2} = R^{2} $\n\nSo the half-power points are simply the two frequencies at which **the net reactance is equal in size to the resistance**. That is a pleasingly concrete condition, and the step solver below turns it into the bandwidth.',
    }),
    b('step_solver', 8, {
      title: 'From "half the power" to the width of the peak',
      problem: 'Find the two frequencies at which the power delivered to a series LCR circuit falls to half its resonant value, and show that the gap between them is exactly $ \\frac{R}{L} $.',
      intro: 'The point of doing this properly rather than quoting the result is that the answer turns out to be **exact** — no approximation is made anywhere, and no assumption about the circuit being sharp is needed.',
      steps: [
        st('Half the **power** means the current has fallen to $ \\frac{I_{max}}{\\sqrt{2}} $',
          'Power goes as the square of the current. Halving a square means dividing the quantity itself by $ \\sqrt{2} $, which is about $ 0.71 $ — a fall of roughly $ 29 $ per cent, not $ 50 $.', {
            check: {
              kind: 'mcq',
              prompt: 'Half the peak POWER corresponds to what fraction of the peak CURRENT?',
              options: ['One half of it', 'One quarter of it', 'One over root two of it', 'Root two times it'],
              answer_index: 2,
              feedback_right: 'Yes — power depends on current squared, so the current only has to drop by a factor of root two.',
              feedback_wrong: 'Since $ P \\propto I^{2} $, halving $ P $ means halving $ I^{2} $, so $ I $ falls by a factor of $ \\sqrt{2} $ — to about $ 71 $ per cent of its peak, not $ 50 $.',
            },
          }),
        st('so $ Z = \\sqrt{2}\\,R $, which forces $ |X_L - X_C| = R $',
          'At the peak $ Z = R $. A current smaller by $ \\sqrt{2} $ needs an impedance larger by $ \\sqrt{2} $. Put that into $ Z = \\sqrt{R^{2} + (X_L - X_C)^{2}} $ and the net reactance must match the resistance in size.'),
        st('$ \\omega L - \\frac{1}{\\omega C} = \\pm R $',
          'Two signs, because there is a half-power point on each side of the peak: above resonance the inductor wins, below it the capacitor does.', {
            check: {
              kind: 'mcq',
              prompt: 'Why are there two half-power frequencies rather than one?',
              options: ['Because the source reverses each half cycle', 'Because the curve falls away on both sides of the peak', 'Because L and C are separate components', 'Because rms values are always defined in pairs'],
              answer_index: 1,
              feedback_right: 'Exactly — one on the low-frequency side and one on the high-frequency side.',
              feedback_wrong: 'The resonance curve descends in both directions from its peak, so it crosses the half-power level twice: once below $ \\omega_r $ and once above it.',
            },
          }),
        st('$ \\omega^{2} \\mp \\frac{R}{L}\\omega - \\frac{1}{LC} = 0 $, giving $ \\omega_{2,1} = \\pm\\frac{R}{2L} + \\sqrt{\\left(\\frac{R}{2L}\\right)^{2} + \\frac{1}{LC}} $',
          'Multiply through by $ \\frac{\\omega}{L} $ and each sign gives a quadratic. Each quadratic has one positive root and one negative one; keep the positive root, since a negative frequency has no meaning here.'),
        st('$ \\Delta\\omega = \\omega_2 - \\omega_1 = \\frac{R}{2L} + \\frac{R}{2L} = \\frac{R}{L} $',
          'The square roots in the two answers are **identical**, so they cancel completely on subtraction and only the two half-terms survive. Nothing has been approximated: the bandwidth is exactly $ \\frac{R}{L} $, for any circuit, sharp or flat.', {
            check: {
              kind: 'mcq',
              prompt: 'Doubling the resistance while keeping L and C fixed does what to the bandwidth?',
              options: ['Doubles it, so the peak broadens', 'Halves it, so the peak sharpens', 'Leaves it completely unchanged', 'Quadruples it, since power goes as the square'],
              answer_index: 0,
              feedback_right: 'Right — the bandwidth is directly proportional to $ R $, so a broader peak is the price of a larger resistance.',
              feedback_wrong: 'The width is $ \\frac{R}{L} $, which is directly proportional to $ R $. Double the resistance and the peak becomes twice as wide, which is exactly why a lossy circuit is a poor tuner.',
            },
          }),
      ],
      now_you_try: {
        problem: 'Show that the **product** $ \\omega_1\\omega_2 $ is exactly $ \\omega_r^{2} $ — so the resonant frequency is the geometric mean of the two half-power frequencies, not simply their midpoint.',
        answer: '$ \\omega_1\\omega_2 = \\frac{1}{LC} = \\omega_r^{2} $, so $ \\omega_r = \\sqrt{\\omega_1\\omega_2} $.',
        solution: 'Write $ a = \\frac{R}{2L} $ and $ S = \\sqrt{a^{2} + \\frac{1}{LC}} $. Then $ \\omega_2 = S + a $ and $ \\omega_1 = S - a $, so the product is a difference of two squares:\n\n$ \\omega_1\\omega_2 = (S - a)(S + a) = S^{2} - a^{2} = \\left(a^{2} + \\frac{1}{LC}\\right) - a^{2} = \\frac{1}{LC} $\n\nand $ \\frac{1}{LC} $ is exactly $ \\omega_r^{2} $.\n\n**What this tells you.** The peak is not quite symmetric on a linear frequency axis — $ \\omega_r $ sits at the geometric mean of the two half-power points, which is slightly below their arithmetic midpoint.\n\nFor a sharp circuit, though, $ a $ is tiny compared with $ \\omega_r $, so $ S \\approx \\omega_r $ and the two half-power points sit at very nearly $ \\omega_r \\pm \\frac{R}{2L} $ — symmetric to any accuracy you care about. That is why textbook sketches draw them symmetrically and why the approximation is safe for every practical tuned circuit.',
      },
    }),
    b('latex_block', 9, {
      latex: 'Q = \\frac{\\omega_r}{\\Delta\\omega} = \\frac{\\omega_r L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}',
      label: 'Quality factor — three faces of one number',
      note: 'Since the bandwidth is R/L, these three expressions are the same quantity written differently. Q is a pure number and has no units.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'Those three forms are worth reading as one idea rather than three formulas to memorise.\n\n$ Q = \\frac{\\omega_r}{\\Delta\\omega} $ is the **definition**: how many times narrower the peak is than the frequency it sits at. A $ Q $ of $ 100 $ means the peak is a hundredth as wide as its own centre frequency.\n\n$ Q = \\frac{\\omega_r L}{R} $ comes from substituting $ \\Delta\\omega = \\frac{R}{L} $, and is the form to use when you are given components.\n\n$ Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}} $ comes from substituting $ \\omega_r = \\frac{1}{\\sqrt{LC}} $ into the previous one, and shows the design rule directly: **for a sharp circuit, want a small resistance, a large inductance and a small capacitance.**\n\nThere is a fourth face too, and it explains the enormous voltages of page 10. At resonance the voltage across the inductor is\n\n$ V_L = IX_L = \\frac{V}{R}\\cdot\\omega_r L = V\\cdot\\frac{\\omega_r L}{R} = QV $\n\nSo **$ Q $ is also the voltage magnification factor.** A circuit with $ Q = 20 $ puts twenty times the source voltage across its coil, and the same across its capacitor, pointing the other way. That is not a side effect of resonance — it is the same number seen from a different direction.',
    }),
    b('worked_example', 11, {
      label: 'sharpness of the page-10 circuit',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'For the circuit of the previous page — $ L = 0.40 $ H, $ C = 10\\ \\mu\\text{F} $, $ R = 10\\ \\Omega $, driven at $ 40 $ V (rms) — find the quality factor, the bandwidth, and the two half-power frequencies. Confirm that $ Q $ also predicts the voltage found across the inductor at resonance.',
      solution: '**Resonant frequency**, from the last page: $ \\omega_r = 500 $ rad/s.\n\n**Quality factor**, two ways, which must agree.\n\n$ Q = \\frac{\\omega_r L}{R} = \\frac{(500)(0.40)}{10} = 20 $\n\n$ Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = \\frac{1}{10}\\sqrt{\\frac{0.40}{10\\times10^{-6}}} = \\frac{1}{10}\\sqrt{40000} = \\frac{200}{10} = 20 $ ✓\n\n**Bandwidth.**\n\n$ \\Delta\\omega = \\frac{R}{L} = \\frac{10}{0.40} = 25\\ \\text{rad/s} $\n\nCheck against the definition: $ \\frac{\\omega_r}{\\Delta\\omega} = \\frac{500}{25} = 20 $ ✓\n\n**Half-power frequencies.** Here $ \\frac{R}{2L} = 12.5 $ rad/s, so\n\n$ \\omega_{2,1} = \\pm 12.5 + \\sqrt{(12.5)^{2} + (500)^{2}} = \\pm 12.5 + 500.16 $\n\n$ \\omega_1 \\approx 487.7\\ \\text{rad/s},\\qquad \\omega_2 \\approx 512.7\\ \\text{rad/s} $\n\nTheir difference is $ 25.0 $ rad/s, exactly as predicted. And their product is $ 487.7\\times512.7 \\approx 250000 = (500)^{2} $ ✓ — the geometric-mean result.\n\n**Voltage magnification.** Page 10 found $ V_L = 800 $ V by the long route, current times reactance. Now:\n\n$ V_L = QV = 20\\times40 = 800\\ \\text{V} $ ✓\n\nSame answer in one step. This is usually the quickest way to get the voltage across $ L $ or $ C $ at resonance.\n\n**What the numbers mean.** A bandwidth of $ 25 $ rad/s around a centre of $ 500 $ rad/s means the circuit responds strongly only within about $ \\pm 2.5 $ per cent of its resonant frequency. Anything further out is already down to less than half power. As a tuner that is respectable; as a way of producing $ 800 $ V from a $ 40 $ V supply, it is a genuine laboratory hazard.',
    }),
    b('table', 12, {
      caption: 'The same $ L $ and $ C $ throughout, so $ \\omega_r = 500 $ rad/s in every row. Only the resistance changes.',
      headers: ['Resistance $ R $', 'Quality factor $ Q $', 'Bandwidth $ \\Delta\\omega $', 'Response is'],
      rows: [
        ['$ 40\\ \\Omega $', '$ 5 $', '$ 100 $ rad/s', 'broad — a poor tuner'],
        ['$ 10\\ \\Omega $', '$ 20 $', '$ 25 $ rad/s', 'usefully sharp'],
        ['$ 4\\ \\Omega $', '$ 50 $', '$ 10 $ rad/s', 'very sharp — and very fussy'],
      ],
    }),
    b('reasoning_prompt', 13, {
      reasoning_type: 'analogical',
      prompt: 'An engineer redesigns a radio\'s tuning circuit with a much higher $ Q $, hoping to reject neighbouring stations better. What is the cost of doing this?',
      options: [
        'The circuit will now resonate at the wrong frequency',
        'The current at resonance will become much smaller',
        'The resonant frequency will drift about during use',
        'Parts of the wanted station are rejected as well',
      ],
      correct_index: 3,
      reveal: '**Parts of the wanted station get rejected too.**\n\nThis is the trade-off that makes $ Q $ an engineering choice rather than something to maximise blindly.\n\nA broadcast is not a single frequency. Music and speech occupy a **band** of frequencies spread around the station\'s carrier — that spread is what carries the information. A tuning circuit whose bandwidth is narrower than the station\'s band will pass the middle of the signal strongly and quietly throw away the edges, and the edges are where the higher notes and the crispness of speech live. Push $ Q $ high enough and the station arrives muffled.\n\nSo the design rule is: **make the bandwidth match the signal, and no narrower.** Wide enough to carry everything the station is sending, narrow enough to leave the neighbours out. Neither extreme is good.\n\n**Why the other answers are wrong is worth checking too.** Raising $ Q $ by lowering $ R $ moves nothing: $ \\omega_r = \\frac{1}{\\sqrt{LC}} $ is untouched, and it does not drift about. And the current at resonance is $ \\frac{V}{R} $, so a smaller $ R $ makes it **larger**, not smaller — a high-$ Q $ circuit responds more strongly at its centre, not less. Its weakness is entirely about what happens just off centre.',
      difficulty_level: 3,
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Half power means the current has fallen by $ \\sqrt{2} $, **not** by half. This is the step most answers get wrong.\n- At the half-power points the net reactance equals the resistance: $ |X_L - X_C| = R $.\n- Bandwidth $ \\Delta\\omega = \\omega_2 - \\omega_1 = \\frac{R}{L} $ — an **exact** result, not an approximation.\n- $ Q = \\frac{\\omega_r}{\\Delta\\omega} = \\frac{\\omega_r L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}} $. A pure number, no units.\n- $ Q $ is also the **voltage magnification**: $ V_L = V_C = QV $ at resonance.\n- Small $ R $, large $ L $, small $ C $ → high $ Q $ → tall narrow peak → high selectivity.\n- $ \\omega_r $ is the **geometric** mean of the half-power frequencies; for high $ Q $ it sits essentially midway.\n- High $ Q $ is not automatically better: too narrow a band mangles the signal it is meant to receive.',
    }),
    b('text', 15, {
      markdown: 'Next: all this current is flowing, and some of it is doing work while some of it is not. Sorting out which is which gives the single most commercially expensive quantity in the chapter.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The quality factor of a series LCR circuit is',
          ['$ \\frac{\\omega_r L}{R} $', '$ \\frac{R}{\\omega_r L} $', '$ \\omega_r L R $', '$ \\frac{L}{RC} $'],
          0,
          'Substituting the bandwidth $ \\frac{R}{L} $ into $ Q = \\frac{\\omega_r}{\\Delta\\omega} $ gives this directly. A smaller resistance must raise $ Q $, which rules out any form with $ R $ on top.',
          1),
        q('The bandwidth of a series resonance curve is equal to',
          ['the ratio $ \\frac{R}{L} $', 'the ratio $ \\frac{L}{R} $', 'the ratio $ \\frac{1}{RC} $', 'the ratio $ \\frac{R}{C} $'],
          0,
          'Solving the half-power condition gives two roots whose square-root terms are identical, so subtracting them leaves only twice $ \\frac{R}{2L} $. Nothing is approximated in that step.',
          2),
        q('Raising $ R $ while keeping $ L $ and $ C $ fixed',
          ['broadens the peak and lowers it', 'sharpens the peak and raises it', 'moves the peak to a higher frequency', 'leaves the resonance curve unchanged'],
          0,
          'The peak height is $ \\frac{V}{R} $ and the width is $ \\frac{R}{L} $, so a larger resistance lowers one and increases the other at the same time. Its position, fixed by $ L $ and $ C $, does not move at all.',
          2),
      ],
    }),
  ],
};

// ── p12 · Power in an AC Circuit ─────────────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'ac-power-and-power-factor',
  title: 'Power in an AC Circuit',
  subtitle: 'Which part of the current does work, and which part only costs money',
  glossary: [
    { term: 'average power', definition: 'The mean rate at which a circuit converts electrical energy to other forms over a complete cycle: $ P = V_{rms}I_{rms}\\cos\\phi $. Also called the true or real power, measured in watts.' },
    { term: 'power factor', definition: 'The factor $ \\cos\\phi = \\frac{R}{Z} $ by which the product of rms voltage and rms current must be multiplied to give the real power. It lies between $ 0 $ and $ 1 $.' },
    { term: 'wattless current', definition: 'The component $ I_{rms}\\sin\\phi $ of the current, at right angles to the voltage phasor. It transports no net energy over a cycle, yet flows in the cables and heats them.' },
    { term: 'power factor correction', definition: 'Adding capacitance in parallel with an inductive load so that the leading and lagging reactive currents cancel, bringing $ \\cos\\phi $ towards $ 1 $ and cutting the line current.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Connect a large coil — an ideal one, of negligible resistance — straight across the mains, and put an ammeter in series with it.\n\nThe ammeter shows a steady, substantial current. Several amperes, flowing continuously, hour after hour.\n\nNow look at the energy meter on the wall. **It is not turning.**\n\nA real current is flowing through a real coil and the meter says you are being charged for nothing at all. Is the meter broken, is the ammeter lying, or is something genuinely strange going on?',
      hint: 'Pages 6 and 7 both said an ideal inductor and an ideal capacitor take zero average power, and both promised that this page would explain why. Follow the energy over one full cycle rather than at one instant.',
      reveal: 'Both meters are honest, and nothing is strange once you follow the energy over a **whole cycle** instead of one instant.\n\nFor a quarter of a cycle the source drives current into the coil and the coil stores that energy in its magnetic field. For the next quarter, the field collapses and hands **every joule of it straight back** to the source. Then the same thing happens with the current reversed. Over one complete cycle the books balance to exactly zero.\n\nSo energy is flowing — vigorously, twice each cycle, in each direction — but it is never **consumed**. It is borrowed and returned. An energy meter charges for consumption, so it correctly records nothing.\n\n**But the current is completely real.** It flows through the cables, through the fuse, through the transformer at the end of the street, and every one of those has resistance and gets warm. The customer pays for nothing; the electricity company pays for the wire.\n\nThat mismatch — real current, no real power — is what this page is about, and it is the most commercially expensive idea in the chapter.',
    }),
    b('text', 1, {
      markdown: 'Take the general series circuit of page 9. The source voltage is the reference,\n\n$ v = v_0\\sin\\omega t $\n\nand the current lags it by the phase angle $ \\phi $ (which is negative if the circuit is capacitive — the algebra does not care):\n\n$ i = i_0\\sin(\\omega t - \\phi) $\n\nThe **instantaneous** power is the product, exactly as it is for DC:\n\n$ p = vi = v_0 i_0 \\sin\\omega t\\,\\sin(\\omega t - \\phi) $\n\nThat quantity swings up and down, and for some circuits it goes **negative** for part of the cycle — those are the moments when energy is travelling back from the circuit to the source. What a bill is based on is not this, but its average over a full cycle.',
    }),
    b('heading', 2, {
      text: 'Averaging the instantaneous power',
      level: 2,
      objective: 'Obtain $ P = V_{rms}I_{rms}\\cos\\phi $ by averaging the instantaneous power over one cycle.',
    }),
    b('text', 3, {
      markdown: 'The averaging is done with one trigonometric identity, and the identity does all the work:\n\n$ \\sin A\\,\\sin B = \\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right] $\n\nWith $ A = \\omega t $ and $ B = \\omega t - \\phi $, the difference is $ \\phi $ and the sum is $ 2\\omega t - \\phi $:\n\n$ p = \\frac{v_0 i_0}{2}\\left[\\cos\\phi - \\cos(2\\omega t - \\phi)\\right] $\n\nNow look at the two terms inside the bracket. **They behave completely differently over a cycle, and that difference is the whole result.**\n\nThe first, $ \\cos\\phi $, contains no time at all. It is a constant, so its average over a cycle is itself.\n\nThe second oscillates at $ 2\\omega $ — twice the source frequency — and a cosine averages to **zero** over any whole number of cycles. It is up as often as it is down. So it contributes nothing to the average, however large it is instant by instant.\n\nWhat survives is the constant:\n\n$ P = \\frac{v_0 i_0}{2}\\cos\\phi = \\frac{v_0}{\\sqrt{2}}\\cdot\\frac{i_0}{\\sqrt{2}}\\cdot\\cos\\phi $\n\nand the two factors of $ \\sqrt{2} $ are precisely what turn peak values into the rms values of page 3.',
    }),
    b('latex_block', 4, {
      latex: 'P = V_{rms}\\,I_{rms}\\cos\\phi',
      label: 'Average power in any AC circuit',
      note: 'The cos φ is the whole difference from DC. Multiplying rms volts by rms amps and stopping there overstates the power by a factor of 1/cos φ.',
      highlight: true,
    }),
    // REPLACED (not added). The prompt that stood here asked why an ideal
    // inductor takes zero average power over a cycle — which is the same fact,
    // in the same framing, as the reasoning_prompt on p6 ("energy is stored and
    // returned in every quarter cycle"). The page already pays that debt off in
    // prose, in its own opening curiosity_prompt and in the table below, so
    // asking it a third time bought nothing. This one instead makes the reader
    // USE P = V I cos φ, which is the only thing taught above it, on the single
    // most commercially important consequence in the chapter — and it is
    // answerable from block 4 alone, so it does not run ahead of the page.
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'A plant draws $ 80 $ A from a fixed supply voltage with $ \\cos\\phi = 0.50 $. Equipment is then added that brings $ \\cos\\phi $ up to $ 1.00 $, while the machines go on taking exactly the same real power as before. What happens to the power wasted as heat in the feeder cable?',
      options: [
        'It falls to a quarter of what it was',
        'It falls to a half of what it was',
        'It is unchanged, as the real power is',
        'It doubles, as extra equipment now draws current',
      ],
      correct_index: 0,
      reveal: '**It falls to a quarter — the line current halves, and heating goes as the square of the current.**\n\nTwo different powers are in play here, and keeping them apart is the whole skill.\n\n*The current, to begin with.* The machines need a fixed real power, and $ P = V_{rms}I_{rms}\\cos\\phi $ with both $ P $ and $ V_{rms} $ held fixed. So the current is whatever is left over:\n\n$ I_{rms} = \\frac{P}{V_{rms}\\cos\\phi} $\n\nDouble $ \\cos\\phi $ from $ 0.50 $ to $ 1.00 $ and the current halves, from $ 80 $ A to $ 40 $ A. The plant does exactly the same work while dragging half as much current down the cable.\n\n*Now the cable.* A cable is plain resistance, so what it wastes is $ I^{2}R $ — and it wastes it using the **total** current flowing in it, not some special part of that current. Half the current, squared, is a quarter of the heat:\n\n$ \\left(\\frac{40}{80}\\right)^{2} = \\frac{1}{4} $\n\nSo three quarters of the cable loss disappears, for no change whatsoever in what the machines deliver.\n\n**Answering "a half" means tracking the current correctly and then forgetting the square.** That square is where every saving in this part of the chapter comes from, so look for it before you commit to a number.\n\n**And "unchanged" is a true statement about the wrong quantity.** The real power delivered to the plant genuinely does not change — that is the entire point of the exercise, and any answer claiming the machines now get more is wrong for the same reason. The cable loss is a separate power altogether, set by the current the cable is forced to carry, and that current has just halved.\n\nThe worked example further down this page does all of this again for a real motor on a real cable, and then works out what has to be connected across the load to raise $ \\cos\\phi $ in the first place.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'The power factor, and the current that does nothing',
      level: 2,
      objective: 'Interpret $ \\cos\\phi $ as $ \\frac{R}{Z} $, split the current into working and wattless components, and evaluate the special cases.',
    }),
    b('text', 7, {
      markdown: 'The factor $ \\cos\\phi $ is called the **power factor**, and page 9\'s triangle gives it a very concrete meaning. In that triangle the side adjacent to $ \\phi $ is $ R $ and the hypotenuse is $ Z $, so\n\n$ \\cos\\phi = \\frac{R}{Z} $\n\nSubstitute it back and something clean falls out:\n\n$ P = V_{rms}I_{rms}\\cdot\\frac{R}{Z} = \\left(\\frac{V_{rms}}{Z}\\right)I_{rms}R = I_{rms}^{2}R $\n\n**Every watt of average power ends up in the resistance.** Not most of it — all of it. The inductor and the capacitor pass energy back and forth without keeping any, exactly as the last section showed, so the resistor is the only place energy can actually go. This is a useful check: if a calculation says an ideal reactance dissipated power, the calculation is wrong.\n\nThat lets you split the current into two parts that behave quite differently. Resolve the current phasor along the voltage phasor and at right angles to it:\n\n- $ I_{rms}\\cos\\phi $ — **in phase** with the voltage. This is the part that carries energy. Call it the working current.\n- $ I_{rms}\\sin\\phi $ — at **right angles** to the voltage. Over a cycle this part transports no net energy at all, and it is called the **wattless current**.\n\nThe wattless current is not imaginary and it is not a bookkeeping device. It is measured by the ammeter, it flows through every cable between the power station and the load, and it heats those cables just as effectively as the working current does. It simply delivers nothing at the far end.',
    }),
    b('table', 8, {
      caption: 'The power factor in each standard case. Only the last two columns differ.',
      headers: ['Circuit', 'Phase angle $ \\phi $', 'Power factor $ \\cos\\phi $', 'Average power'],
      rows: [
        ['pure resistor', '$ 0 $', '$ 1 $', '$ V_{rms}I_{rms} $ — the maximum'],
        ['pure inductor', '$ +90^\\circ $', '$ 0 $', 'zero — wholly wattless'],
        ['pure capacitor', '$ -90^\\circ $', '$ 0 $', 'zero — wholly wattless'],
        ['series LCR', 'between $ \\pm 90^\\circ $', '$ \\frac{R}{Z} $', '$ I_{rms}^{2}R $'],
        ['series LCR at resonance', '$ 0 $', '$ 1 $', '$ V_{rms}I_{rms} $ — the maximum'],
      ],
    }),
    b('image', 9, {
      src: '',
      alt: 'The current phasor resolved into a component along the voltage and a component at right angles to it',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Only the part of the current lying along the voltage delivers energy. The perpendicular part is charged to nobody and heats the cables anyway.',
      generation_prompt: 'Clean scientific phasor diagram on a near-black background (#0B0C0F), thin dim-grey line art. From a single origin, a bold bright-amber horizontal arrow points right labelled V. A second bold warm-orange arrow of similar length points down and to the right at about forty degrees below the horizontal, labelled I, with a small arc between the two marking the angle phi. Thin dashed grey construction lines drop from the tip of the current arrow to the horizontal axis, marking a solid short horizontal segment along V labelled I cos phi and a solid short vertical segment labelled I sin phi. The horizontal segment is drawn in bright amber and the vertical one in cool blue. Small unobtrusive tags read works and wattless beside the respective segments. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('worked_example', 10, {
      label: 'a workshop motor, and what a capacitor bank does for it',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A workshop motor takes $ 6.0 $ kW of real power from a $ 250 $ V, $ 50 $ Hz supply at a power factor of $ 0.60 $ lagging. The cable feeding it has a total resistance of $ 0.50\\ \\Omega $. Find the current drawn and the power wasted in the cable. Then find what both become when a capacitor bank raises the power factor to $ 1.00 $, and estimate the capacitance needed.',
      solution: '**Current drawn as it stands.** Rearranging $ P = V_{rms}I_{rms}\\cos\\phi $:\n\n$ I = \\frac{P}{V\\cos\\phi} = \\frac{6000}{(250)(0.60)} = \\frac{6000}{150} = 40\\ \\text{A} $\n\n**Cable loss.** The cable is plain resistance, so it takes $ I^{2}R $:\n\n$ P_{cable} = (40)^{2}(0.50) = 800\\ \\text{W} $\n\nSo $ 800 $ W is being burned in the wiring to deliver $ 6000 $ W to the motor.\n\n**Now correct the power factor to $ 1.00 $.** The motor still needs its $ 6.0 $ kW — nothing about the machine has changed:\n\n$ I = \\frac{6000}{(250)(1.00)} = 24\\ \\text{A} $\n\n$ P_{cable} = (24)^{2}(0.50) = 288\\ \\text{W} $\n\n**The saving.** The cable loss falls from $ 800 $ W to $ 288 $ W — a drop of $ 512 $ W, or $ 64 $ per cent, for no change at all in the useful output. The ratio is $ \\left(\\frac{24}{40}\\right)^{2} = (0.60)^{2} = 0.36 $, which is the general result: **cable loss goes as $ \\frac{1}{\\cos^{2}\\phi} $.**\n\n**Sizing the capacitor.** Split the original $ 40 $ A into its two components:\n\nworking current $ = 40\\times0.60 = 24 $ A, and since $ \\sin\\phi = 0.80 $, wattless current $ = 40\\times0.80 = 32 $ A, lagging.\n\nA capacitor draws a **leading** current, so a bank drawing $ 32 $ A leading cancels the motor\'s $ 32 $ A lagging exactly, leaving only the $ 24 $ A that does the work. That bank needs\n\n$ X_C = \\frac{250}{32} \\approx 7.8\\ \\Omega $\n\n$ C = \\frac{1}{\\omega X_C} = \\frac{1}{2\\pi(50)(7.8)} \\approx 4.1\\times10^{-4}\\ \\text{F} \\approx 410\\ \\mu\\text{F} $\n\n**And notice what the capacitor is not doing.** It is not supplying the motor with energy and it is not making the motor more efficient. It is parked beside the load, borrowing and returning energy in step with the coil so that the **cable** never has to carry that traffic. The wattless current still sloshes back and forth — but now only over the short link between the capacitor and the motor, instead of all the way back to the power station.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'A factory runs mostly large motors, so it draws a badly lagging current. A bank of capacitors is connected in **parallel** with the whole load. What is the main effect?',
      options: [
        'It raises the useful power the machines take',
        'It lowers the voltage supplied to the machines',
        'It cuts the current drawn from the supply line',
        'It makes the phase angle larger than before',
      ],
      correct_index: 2,
      reveal: '**It cuts the current drawn from the line.**\n\nThe motors\' lagging wattless current and the capacitors\' leading wattless current are in opposite directions on the phasor diagram, so they cancel. What is left travelling down the supply line is mostly the working component — and a smaller total current for the same delivered power is precisely what a higher power factor means.\n\n**What does *not* change is the useful power.** The machines were getting their kilowatts before and they get exactly the same kilowatts afterwards. Correction changes how much current has to be dragged through the cables to deliver them, not how much is delivered.\n\n**Nor does the voltage drop.** In fact it improves slightly: less current in the line means a smaller $ IR $ drop along it, so the voltage at the factory end rises a little rather than falling.\n\n**And the phase angle shrinks, not grows.** That is the entire object of the exercise — $ \\phi $ towards zero, $ \\cos\\phi $ towards one. If adding capacitance made $ \\phi $ larger, you would have over-corrected past unity and turned a lagging load into a leading one, which is a real fault but a different one.',
      difficulty_level: 2,
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'An Indian household is billed in kilowatt-hours — real energy, so the power factor never appears on the bill. Large industrial consumers are billed quite differently, and most state electricity boards apply a **power-factor penalty** below a threshold typically set around $ 0.90 $, with a rebate above it.\n\nThat looks unfair until you follow the wire. A factory drawing $ 40 $ A at $ 0.60 $ power factor and one drawing $ 24 $ A at unity are consuming **identical** real power. But the first forces the supply company to build cables, switchgear and transformers rated for $ 40 $ A rather than $ 24 $ A, and to accept the extra $ I^{2}R $ heating in every one of them, all the way back to the generating station. The customer\'s bill does not reflect any of that cost, so the tariff adds it back.\n\nThe fix is the same one from the worked example, at industrial scale: **capacitor banks**, often switched automatically as machines start and stop through the day. The payback period is usually months, not years, which is why any factory of size has a cabinet of them.\n\nThe same reasoning explains why an induction motor left running unloaded is worse than useless. It does almost no work, so its power factor collapses, and it sits there pulling a large wattless current through the plant wiring for nothing.',
      image_prompt: 'Clean technical illustration on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. On the left a small pylon and transformer symbol; a long pair of warm-amber cable lines runs right across the frame to a simple factory outline with a motor symbol inside it. Along the cable, small bright-orange arrows indicate current flow, drawn thick and densely packed in the upper cable run labelled with a poor power factor, and thin and sparse in a parallel lower cable run labelled with a corrected power factor. Beside the factory in the lower run, a small cabinet icon containing three capacitor symbols is connected across the line, with a short looping arrow between it and the motor suggesting energy shuttling locally rather than down the long line. Faint heat-shimmer hatching sits along the upper cable only. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 13, {
      variant: 'warning',
      title: 'Wattless does not mean harmless',
      markdown: 'The word "wattless" invites a wrong conclusion, so be careful with it.\n\nThe wattless current is **not zero**, it is **not imaginary**, and it does **not** somehow avoid the wires. It is a real, measurable current. Put a clamp meter round the cable and you will read it. Hold the cable and you will feel the heat it makes.\n\nWhat "wattless" means, precisely and only, is that **over a complete cycle it transports no net energy to the load.** Two quarter-cycles in, two quarter-cycles back out.\n\nSo three things follow that are worth separating:\n\n- The **load** receives nothing from it. True.\n- The **energy meter** records nothing for it. Also true, which is why it is free to the consumer.\n- The **cable** dissipates $ I^{2}R $ using the *total* current, wattless part included. Very much not free to somebody.\n\nAnd the exam version of the trap: fuses, cable ratings and switch ratings are all set by the **total** rms current, never by the working component alone. A circuit with a poor power factor needs thicker wire than its wattage suggests.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ P = V_{rms}I_{rms}\\cos\\phi $. The $ \\cos\\phi $ is the only difference from the DC formula.\n- It comes from averaging $ p = vi $: the constant term survives, the $ 2\\omega $ term averages to zero.\n- $ \\cos\\phi = \\frac{R}{Z} $, so $ P = I_{rms}^{2}R $ — **all** the average power goes into the resistance.\n- Pure $ R $: $ \\cos\\phi = 1 $. Pure $ L $ or pure $ C $: $ \\cos\\phi = 0 $, zero average power.\n- At **resonance** $ \\phi = 0 $, so the power factor is $ 1 $ and the power is at its greatest.\n- $ I\\cos\\phi $ works; $ I\\sin\\phi $ is **wattless** — no energy delivered, but real heat in the cables.\n- Cable loss goes as $ \\frac{1}{\\cos^{2}\\phi} $, which is why industry is penalised for a poor power factor.\n- Capacitor banks in parallel cancel a lagging wattless current and cut the line current.',
    }),
    b('text', 15, {
      markdown: 'Next: the last piece, and the one that made a national grid possible at all. If loss in a cable goes as the square of the current, the way to win is to send the same power at a far higher voltage — and one device does that in both directions.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The average power delivered in an AC circuit is',
          ['$ V_{rms}I_{rms}\\cos\\phi $', '$ V_{rms}I_{rms} $', '$ V_{rms}I_{rms}\\sin\\phi $', '$ V_{rms}I_{rms}\\tan\\phi $'],
          0,
          'Averaging the instantaneous power leaves the constant term, which carries the cosine of the phase angle. Dropping that factor would claim a pure inductor consumes energy, which it does not.',
          1),
        q('The power factor of an ideal inductor connected to an AC source is',
          ['zero', 'one', 'unlimited', 'equal to $ \\omega L $'],
          0,
          'The current lags the voltage by a quarter cycle, so the phase angle is $ 90^\\circ $ and its cosine vanishes. Energy stored in the field during one quarter cycle is handed back during the next.',
          1),
        q('A factory is penalised for a low power factor because',
          ['it draws a larger current for the same power', 'it consumes more energy than it is billed for', 'its machines run at a lower supply voltage', 'its supply frequency drifts away from 50 Hz'],
          0,
          'The real power is fixed by the machines, so a smaller $ \\cos\\phi $ forces a larger current down the cables — and the extra heating and heavier equipment that current needs are paid for by the supply company, not by the meter.',
          3),
      ],
    }),
  ],
};

// ── p13 · Transformers ───────────────────────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'ac-transformers',
  title: 'Transformers',
  subtitle: 'Trading voltage for current — and the reason the world runs on AC',
  glossary: [
    { term: 'transformer', definition: 'A pair of coils wound on a common soft-iron core, which changes an alternating voltage to a higher or lower one by mutual induction. It works only on AC.' },
    { term: 'turns ratio', definition: 'The ratio $ \\frac{N_s}{N_p} $ of secondary to primary turns. In an ideal transformer it equals the voltage ratio and the inverse of the current ratio.' },
    { term: 'eddy-current loss', definition: 'Energy wasted as heat by induced current loops circulating inside the core itself. Reduced by building the core from thin insulated laminations.' },
    { term: 'hysteresis loss', definition: 'Energy wasted each time the core is taken round its magnetisation loop, equal to the area of that loop per cycle. Reduced by using a soft magnetic material with a narrow loop.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'The generator at a power station produces electricity at something like $ 20{,}000 $ V. The socket in your wall delivers $ 230 $ V.\n\nIn between, the grid does something that looks perverse. It first pushes the voltage **up**, to $ 400{,}000 $ V or more, sends it across the country at that voltage, and then brings it back **down** again in several stages.\n\nTwo extra conversions, expensive equipment at each end, and a substation every few dozen kilometres — all to arrive at a voltage it could have delivered directly in the first place.\n\nWhy would anyone build a system like that on purpose?',
      hint: 'The cable between the two ends has resistance. Ask how much power that cable wastes, and what it is that the cable waste actually depends on.',
      reveal: 'Because of one exponent.\n\nThe cable wastes $ I^{2}R $ — page 12\'s result, and the $ R $ of a few hundred kilometres of aluminium is not small. But you are not free to choose $ I $ independently: to deliver a fixed power $ P $ at voltage $ V $, the current must be $ I = \\frac{P}{V} $. Put that in:\n\n$ P_{lost} = \\left(\\frac{P}{V}\\right)^{2}R = \\frac{P^{2}R}{V^{2}} $\n\n**The loss goes as one over the voltage squared.** Send the same power at twenty times the voltage and you waste **four hundred times less**. That is not a marginal saving to be traded against equipment costs — it is the difference between a national grid working and not working at all.\n\nSo the grid transmits at the highest voltage it can safely insulate, and converts at both ends. And the device that makes those conversions cheap, simple and about $ 99 $ per cent efficient is the **transformer** — which works on alternating current and not on steady current.\n\nThat single fact settled a nineteenth-century argument about how to electrify the world, and it is why every socket you will ever use is AC.',
    }),
    b('text', 1, {
      markdown: 'A transformer is two coils wound on a common core of soft iron. The **primary** is connected to the source; the **secondary** feeds the load. The two circuits are electrically separate — no wire runs from one to the other. Everything passes through the core.\n\nThe physics is mutual induction from Chapter 6, with no new principle whatsoever. An alternating current in the primary makes an alternating flux in the core; the core guides that flux round to the secondary; and a changing flux through the secondary induces an emf in it.\n\nThe core matters more than it looks. Iron carries flux enormously better than air does, so almost all of the flux made by the primary is delivered to the secondary rather than escaping into the room. **That is what lets us say the two coils share the same flux per turn**, which is the assumption the whole result rests on.',
    }),
    b('heading', 2, {
      text: 'Two coils, one flux',
      level: 2,
      objective: 'Derive the voltage and current ratios of an ideal transformer from Faraday\'s law and conservation of energy.',
    }),
    b('text', 3, {
      markdown: 'Let $ \\Phi $ be the flux threading **one turn** of the core. Since both windings sit on the same core, both see the same $ \\Phi $. Faraday\'s law then gives each coil its own emf, differing only in the number of turns:\n\n$ \\varepsilon_p = -N_p\\frac{d\\Phi}{dt} \\qquad \\varepsilon_s = -N_s\\frac{d\\Phi}{dt} $\n\nDivide one by the other and the awkward $ \\frac{d\\Phi}{dt} $ — which nobody can measure directly — cancels completely:\n\n$ \\frac{V_s}{V_p} = \\frac{N_s}{N_p} $\n\n**That is the whole voltage result, and it is decided entirely by counting turns.** Nothing about the load, the frequency or the material appears in it.\n\nNow bring in energy. An ideal transformer wastes nothing, so whatever power goes in must come out:\n\n$ V_p I_p = V_s I_s \\quad\\Rightarrow\\quad \\frac{I_s}{I_p} = \\frac{V_p}{V_s} = \\frac{N_p}{N_s} $\n\nSo the current ratio is the **inverse** of the voltage ratio. Raise the voltage and the available current falls in exactly the same proportion.',
    }),
    b('latex_block', 4, {
      latex: '\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}',
      label: 'The ideal transformer',
      note: 'Voltage goes up with turns, current goes down with turns, and the product stays fixed. A transformer trades one for the other; it never creates power.',
      highlight: true,
    }),
    b('image', 5, {
      src: '',
      alt: 'A transformer built on a closed rectangular laminated iron core, with primary and secondary windings and the flux path shown',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'One closed core, two windings, and a flux that is guided rather than allowed to escape. The fine vertical lines are the laminations.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art. A closed rectangular iron core drawn as a thick outlined ring, its body filled with many closely spaced thin vertical grey lines to show laminations. On the left limb, a coil of a few widely spaced turns in warm amber wire labelled primary, with leads running left to an AC source symbol. On the right limb, a coil of many closely spaced turns in warm amber wire labelled secondary, with leads running right to a small resistor symbol marked load. Inside the core, a continuous dim-orange arrowed loop follows the rectangular path all the way round, indicating the confined magnetic flux. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'An ideal transformer doubles the voltage between primary and secondary. What happens to the current available at the output?',
      options: [
        'It doubles as well, since the power has doubled',
        'It stays equal to the current in the primary',
        'It rises, but by less than a factor of two',
        'It falls to about half the primary current',
      ],
      correct_index: 3,
      reveal: '**It falls to about half.**\n\nAn ideal transformer conserves power exactly: $ V_pI_p = V_sI_s $. If the voltage on one side is twice the voltage on the other, the current there must be half, or the product would not balance.\n\n**The doubling answer is the one worth examining, because it is a real belief and not a slip.** It amounts to saying a transformer manufactures power — put in $ 100 $ W and take out $ 400 $ W. Nothing in physics permits that, and if it were possible you could feed the output back into the input and run the world on one transformer.\n\n**Nor can the current stay the same.** That would still mean twice the power coming out as went in, just by a smaller factor.\n\nSo the honest way to think about a transformer is as an **exchange**, never a gain. It hands you volts and takes amperes away, or the other way round, and the product is preserved to within a percent or two of losses. That is exactly what makes it useful: what the grid needs is not more power but the same power carried at a voltage that does not waste it.',
      difficulty_level: 2,
    }),
    b('text', 7, {
      markdown: 'Two names follow immediately, and each has a characteristic build.\n\nA **step-up** transformer has $ N_s > N_p $: more turns on the secondary, so higher voltage and lower current out. Its secondary is many turns of thin wire; its primary is fewer turns of thick wire, because the primary is the side carrying the big current.\n\nA **step-down** transformer has $ N_s < N_p $, and everything reverses. The thick winding is always the low-voltage, high-current one — which is a quick way to identify an unmarked transformer by eye.\n\n**And now the fact that decided how the world is wired.** Look again at what the derivation depended on: $ \\frac{d\\Phi}{dt} $. If the primary carries a **steady** current, the flux is steady, its rate of change is zero, and the secondary emf is zero.\n\nSo a transformer connected to a battery produces **nothing at all**. (Worse than nothing, in fact — with no back-emf to limit it, the primary behaves like a short piece of wire and burns out.)\n\nThis is the deciding argument. Direct current cannot be transformed cheaply, so it cannot be sent at high voltage, so it cannot be sent far. Alternating current can. Every other convenience of AC is secondary to that one, and it is the reason this chapter exists.',
    }),
    b('worked_example', 8, {
      label: 'a step-up transformer, ideal and then real',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A transformer has $ 120 $ turns on its primary and $ 2400 $ on its secondary. The primary is connected to a $ 240 $ V, $ 50 $ Hz supply, and the secondary delivers $ 2.5 $ A to its load. Treating it as ideal, find the secondary voltage, the primary current and the frequency of the output. Then find the primary current if the transformer is in fact only $ 90 $ per cent efficient.',
      solution: '**Turns ratio.**\n\n$ \\frac{N_s}{N_p} = \\frac{2400}{120} = 20 $\n\nMore turns on the secondary, so this is a step-up transformer.\n\n**Secondary voltage.**\n\n$ V_s = V_p\\times\\frac{N_s}{N_p} = 240\\times20 = 4800\\ \\text{V} $\n\n**Primary current.** The current ratio is the inverse of the turns ratio, so the primary carries twenty times the secondary current:\n\n$ I_p = I_s\\times\\frac{N_s}{N_p} = 2.5\\times20 = 50\\ \\text{A} $\n\n**Check the power balance**, which should always be done:\n\ninput $ = 240\\times50 = 12000\\ \\text{W} $\n\noutput $ = 4800\\times2.5 = 12000\\ \\text{W} $ ✓\n\nVoltage up twenty times, current down twenty times, power unchanged. Exactly the trade the last section described.\n\n**Frequency of the output: $ 50 $ Hz.** Unchanged, and this is not a trick question — it catches people out every year. The secondary emf is driven by the same flux oscillation as the primary, so it must alternate at the same rate. **A transformer changes voltage and current. It never changes frequency.**\n\n**Now the real device, at $ 90 $ per cent efficiency.** The load still needs its $ 12000 $ W, so the input must be larger to cover the losses:\n\n$ P_{in} = \\frac{12000}{0.90} \\approx 13330\\ \\text{W} $\n\n$ I_p = \\frac{13330}{240} \\approx 55.6\\ \\text{A} $\n\nSo about $ 5.6 $ A more is drawn, and the missing $ 1330 $ W leaves as heat in the windings and the core. The next section is a list of exactly where it goes — and a real power transformer of this size would do far better than $ 90 $ per cent, typically above $ 98 $.',
    }),
    b('heading', 9, {
      text: 'The four losses, and the fix for each',
      level: 2,
      objective: 'Name the four sources of loss in a real transformer and state the design measure that reduces each.',
    }),
    b('text', 10, {
      markdown: 'A real transformer falls short of the ideal in exactly four ways. They are worth learning as a **loss and its remedy in the same breath**, because exam questions almost always ask for the pair.\n\n**Copper loss.** The windings are wire, wire has resistance, and resistance takes $ I^{2}R $ — page 12 again. *Remedy:* thick, low-resistance wire, thickest on the high-current winding. This is why a transformer is heavy.\n\n**Eddy-current loss.** The core is iron, and iron conducts. Sitting in a changing flux, it has currents induced in its own body — closed loops circulating in the metal, obeying Lenz\'s law and heating the core for nothing. *Remedy:* **laminate** the core. Build it from thin sheets, each varnished so it is insulated from its neighbours, stacked in the plane the flux runs along. The flux passes happily; the loops are chopped into small ones and nearly vanish. **This is the same fix, and the same physics, as the eddy-current page of Chapter 6** — the promise made there is kept here.\n\n**Hysteresis loss.** The core is magnetised one way, then the other, a hundred times a second. Chapter 4 showed that taking a material once round its magnetisation loop costs an energy equal to the **area** of that loop. Multiply by the number of cycles and it is a continuous drain. *Remedy:* a **soft** magnetic material with a thin loop — soft iron, or silicon steel. Hard magnetic materials, with their fat loops, are exactly what you must not use.\n\n**Flux leakage.** Not every field line made by the primary reaches the secondary; some escape into the air and link nothing. *Remedy:* a **closed** core with no gaps, and windings placed one over the other on the same limb rather than facing each other across the core.\n\nWith all four attended to, a large power transformer reaches $ 98 $ to $ 99 $ per cent efficiency — which is remarkable for a machine with no moving parts and, in the end, is why the grid is affordable.',
    }),
    b('table', 11, {
      caption: 'The four losses. Learn each row across, not each column down.',
      headers: ['Loss', 'Where the energy goes', 'What causes it', 'The remedy'],
      rows: [
        ['Copper', 'heat in the windings', '$ I^{2}R $ in the wire', 'thick, low-resistance wire'],
        ['Eddy current', 'heat in the core', 'induced loops inside the iron', 'laminate the core (Ch.6)'],
        ['Hysteresis', 'heat in the core', 'area of the magnetisation loop, per cycle', 'a soft magnetic core (Ch.4)'],
        ['Flux leakage', 'nowhere useful', 'field lines that miss the secondary', 'closed core, windings interleaved'],
      ],
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'Why is a transformer core built from a stack of thin varnished sheets rather than from one solid block of iron?',
      options: [
        'To make the core lighter and cheaper to build',
        'To break up the current loops induced in the iron',
        'To raise the resistance of the copper windings',
        'To stop magnetic flux leaking out of the core',
      ],
      correct_index: 1,
      reveal: '**To break up the current loops induced in the iron.**\n\nThe core sits in a flux that reverses a hundred times a second, and the core is itself a conductor. By Faraday and Lenz, that changing flux drives closed loops of current round inside the metal — eddy currents — which do no useful work and simply heat the core.\n\nSlicing the core into thin sheets, each varnished so it cannot pass current to its neighbour, leaves the flux path untouched but confines any loop to one thin sheet. A much smaller loop encloses much less flux and meets much more resistance, so the induced current collapses and the heating with it.\n\n**Chapter 6 promised this exact application when it introduced eddy currents.** Same phenomenon, same remedy, now in the device it was invented for.\n\n**The flux-leakage answer is the near-miss worth naming.** Laminating does nothing about leakage — leakage is fixed by using a closed core and by winding the two coils over one another. And laminating certainly does not make the core cheaper: cutting, insulating and stacking hundreds of sheets is more expensive than casting one block. It is paid for by the electricity it saves.',
      difficulty_level: 2,
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Put numbers on the opening question and the design of the grid stops looking odd.\n\nSuppose $ 600 $ kW has to be carried down a line whose total resistance is $ 10\\ \\Omega $.\n\n**Sent at $ 4000 $ V:** the current is $ I = \\frac{600000}{4000} = 150 $ A, and the line wastes $ I^{2}R = (150)^{2}(10) = 225 $ kW. That is **more than a third of the power** turned into warm cable.\n\n**Sent at $ 40{,}000 $ V:** the current is only $ 15 $ A, and the loss is $ (15)^{2}(10) = 2.25 $ kW — about **$ 0.4 $ per cent**.\n\nTen times the voltage, a hundredth of the waste. Every stage of the Indian grid — $ 765 $ kV and $ 400 $ kV for long-distance transmission, stepping down through $ 220 $ kV and $ 132 $ kV, then $ 33 $ kV and $ 11 $ kV for a town, and finally the pole-mounted transformer that hands your street $ 230 $ V — exists to keep that current small for as long as possible.\n\nThis is also the settled answer to the "war of the currents" fought in the 1880s and 1890s. Direct current could not be transformed, so a DC station could only serve customers within a kilometre or two. Alternating current could, and so it won everything — not because it is better in any deep sense, but because $ \\frac{V_s}{V_p} = \\frac{N_s}{N_p} $ needs a changing flux, and only AC provides one.',
      image_prompt: 'Clean technical illustration on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition read left to right. At the far left a small power-station outline with a generator symbol. Next, a step-up transformer drawn as two coils on a laminated core, its output feeding tall transmission pylons carrying long warm-amber lines across the centre of the frame, with a small label showing a very high voltage and only a few sparse thin current arrows on the line. Then a step-down substation transformer, then a smaller pole-mounted transformer, then a simple house outline. Above the long line an inset box shows the same run at low voltage instead: densely packed thick orange current arrows and faint heat-shimmer hatching along the cable. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s} $ for an ideal transformer. Voltage up means current down.\n- It follows from Faraday\'s law applied to a shared flux, plus conservation of energy. No new physics.\n- **Frequency never changes.** A transformer alters voltage and current only.\n- A transformer does **not** work on DC: no changing flux, no induced emf, and a burnt-out primary.\n- Step-up: $ N_s > N_p $. The thick winding is always the low-voltage, high-current side.\n- Four losses: **copper** ($ I^{2}R $ → thick wire), **eddy** (→ laminated core), **hysteresis** (→ soft core), **leakage** (→ closed core, interleaved windings).\n- Transmission loss $ = \\frac{P^{2}R}{V^{2}} $, so the grid sends power at the highest voltage it can insulate.',
    }),
    b('text', 15, {
      markdown: 'That closes the chapter — but not the story. Everything here has assumed the energy sloshing between $ L $ and $ C $ stays politely inside the wires. Drive an LCR loop at a few million cycles a second and it stops cooperating: the charges in it are being accelerated hard, and **accelerating charges radiate.** The circuit begins leaking energy into the space around it, as a wave that needs no wires and no medium at all. Chapter 8 begins exactly there.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('In an ideal transformer the ratio $ \\frac{V_s}{V_p} $ equals',
          ['$ \\frac{N_s}{N_p} $', '$ \\frac{N_p}{N_s} $', '$ \\left(\\frac{N_s}{N_p}\\right)^{2} $', '$ \\sqrt{\\frac{N_s}{N_p}} $'],
          0,
          'Each coil obeys Faraday\'s law with the same flux per turn, so dividing one emf by the other leaves only the turns. Squares and roots would break the power balance between the two sides.',
          1),
        q('A transformer produces no output on a steady DC supply because',
          ['the flux in the core never changes', 'the core saturates within one second', 'copper losses become far too large', 'the windings have no resistance to DC'],
          0,
          'An induced emf needs a changing flux, and a steady current makes a steady one. With nothing changing there is nothing to induce, and the primary is left behaving like a plain low-resistance wire.',
          2),
        q('Hysteresis loss in a transformer is reduced by',
          ['using a soft magnetic core material', 'laminating the core into thin sheets', 'winding the coils one over the other', 'using thicker wire in the windings'],
          0,
          'The energy lost per cycle equals the area of the magnetisation loop, and a soft material has a narrow loop. The other three measures are genuine remedies, but each cures a different one of the four losses.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p9, p10, p11, p12, p13]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
