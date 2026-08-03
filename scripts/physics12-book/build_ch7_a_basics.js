'use strict';
/**
 * Class 12 Physics · Ch.7 "Alternating Current" — pages 1–4.
 * LC oscillations (the bridge from Ch.6's inductors), what an alternating
 * supply actually is, rms versus peak, and the phasor picture that every later
 * page of the chapter runs on.
 *
 * WHY LC OSCILLATIONS OPENS THE CHAPTER (plan §4, Ch.7 note):
 *   The reader has just met inductors, `U = ½Li²` and `U = Q²/2C` in Ch.6.
 *   Putting the two energy stores in one loop is therefore the cheapest possible
 *   motivation for "why should a current oscillate at all", and the ω it
 *   produces — 1/√(LC) — is the same number that returns later in the chapter as
 *   the resonant frequency, where it should land as a payoff, not a coincidence.
 *
 * CONVENTIONS FIXED HERE AND USED BY THE REST OF THE CHAPTER:
 *   • A sinusoidal supply is written `v = v₀ sin ωt` (sine, not cosine), so a
 *     phasor's VERTICAL projection is the instantaneous value.
 *   • Phasors rotate ANTICLOCKWISE. Leading ⇒ drawn anticlockwise (ahead);
 *     lagging ⇒ drawn clockwise (behind).
 *   • Every label value (220 V, 5 A, 100 W) is an rms value. Peak values are
 *     always written with a subscript zero.
 *
 * ANSWER POSITIONS: every `reasoning_prompt` here carries an explicit
 * `correct_index` (the book-wide defect fixed 2026-07-31 — four options, no key,
 * so the reader could show no verdict and `_hygiene.js` could not see them).
 * The seven on these pages sit at 2, 0, 3, 1, 2, 3, 0 — the last being the
 * leads-versus-lags prompt added to p4, placed at 0 because the chapter-wide
 * tally had A running lowest. Inline-quiz items go through `q()`, which spreads
 * deterministically.
 *
 * Run: node scripts/physics12-book/build_ch7_a_basics.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 7;

// ── p1 · LC Oscillations ─────────────────────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'ac-lc-oscillations',
  title: 'LC Oscillations',
  subtitle: 'Energy sloshing between a capacitor and an inductor, forever',
  glossary: [
    { term: 'LC oscillation', definition: 'The periodic exchange of energy between the electric field of a capacitor and the magnetic field of an inductor connected in a single loop, with no source driving it.' },
    { term: 'natural frequency', definition: 'The frequency at which a circuit oscillates when left to itself. For an LC loop, $ \\omega = \\frac{1}{\\sqrt{LC}} $ — fixed by L and C alone.' },
    { term: 'damped oscillation', definition: 'An oscillation whose amplitude falls cycle by cycle because energy is being lost — here, as heat in the unavoidable resistance of real wire.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Chapter 6 left you holding two energy stores that look suspiciously alike. A charged capacitor holds $ U = \\frac{Q^{2}}{2C} $ in its electric field. A current-carrying inductor holds $ U = \\frac{1}{2}Li^{2} $ in its magnetic field.\n\nNow do something reckless with them. Charge a capacitor, disconnect the battery, and connect the charged capacitor straight across a pure inductor — nothing else in the loop. No resistor, no cell.\n\nThe capacitor begins to discharge. Where does its energy go, and where does the whole thing come to rest?',
      hint: 'An inductor will not let a current appear instantly, and it will not let one vanish instantly either. Ask what that stubbornness does at each end of the discharge.',
      reveal: 'It never comes to rest. It goes round and round.\n\nThe capacitor pushes charge through the inductor, and energy drains out of the electric field and piles up in the magnetic field. When the capacitor is empty, every joule is in the inductor — and the current is at its largest, precisely at the moment there is no voltage left to drive it.\n\nAnd that current cannot simply stop. An inductor opposes any **change** in current (Chapter 6, page 10), so it keeps pushing charge in the same direction, piling it onto the capacitor **the other way round**. The capacitor charges up with the opposite sign, the current falls to zero, and now the whole story runs backwards.\n\nWith no resistance anywhere, this never ends. The same energy sloshes from capacitor to inductor and back, at a rate set by nothing but $ L $ and $ C $.\n\nYou have seen this before, in a different costume. A mass on a spring does exactly this with potential and kinetic energy. That is not an analogy that is *roughly* true — it is the same equation with different letters, and this page will hand you the translation line by line.',
    }),
    b('text', 1, {
      markdown: 'So this chapter opens with a current that alternates all by itself, with nobody forcing it. Understand that first, and the forced, mains-driven alternating current of the next page will look far less strange.',
    }),
    b('heading', 2, {
      text: 'One full cycle, in four quarters',
      level: 2,
      objective: 'Track where the charge, the current and the energy sit at each quarter of an LC cycle.',
    }),
    b('text', 3, {
      markdown: 'Start the clock at the moment the capacitor is fully charged and nothing is moving: charge $ Q_0 $ on the plates, current zero.\n\n**First quarter.** The capacitor drives charge round the loop. Its charge falls, the current climbs, and energy moves out of the electric field into the magnetic field. At the end of this quarter the capacitor is **empty** and the current has reached its peak $ i_0 $. All the energy is now in the inductor.\n\n**Second quarter.** The current refuses to stop, so it keeps delivering charge to the capacitor — but onto the *other* plate. The capacitor charges up with reversed polarity while the current dies away. At the end of this quarter the capacitor is fully charged the wrong way round and the current is zero again.\n\n**Third quarter.** The capacitor discharges again, this time driving current the opposite way round the loop, and once more hands all its energy to the inductor.\n\n**Fourth quarter.** That reversed current recharges the capacitor to its original polarity, and everything is back exactly where it began.\n\nOne full cycle. Nothing has been added and nothing has been lost — the same joules have simply changed address four times.',
    }),
    b('table', 4, {
      caption: 'One complete LC cycle. Read the two "zero current" rows and the two "zero charge" rows against each other — the energy is never in both places at once.',
      headers: ['Instant', 'Charge on the capacitor', 'Current in the inductor', 'Where the energy is'],
      rows: [
        ['$ t = 0 $', '$ +Q_0 $ — maximum', 'zero', 'all in the capacitor'],
        ['$ t = \\frac{T}{4} $', 'zero', '$ i_0 $ — maximum', 'all in the inductor'],
        ['$ t = \\frac{T}{2} $', '$ -Q_0 $ — maximum, reversed', 'zero', 'all in the capacitor'],
        ['$ t = \\frac{3T}{4} $', 'zero', '$ i_0 $ — maximum, reversed', 'all in the inductor'],
        ['$ t = T $', '$ +Q_0 $ again', 'zero', 'all in the capacitor — back to the start'],
      ],
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'logical',
      prompt: 'At the instant the capacitor in an ideal LC circuit is completely discharged, what is true of that circuit?',
      options: [
        'The current is zero, so the circuit has come to rest',
        'The current is at its peak and the energy is all in the capacitor',
        'The current is at its peak and the energy is all in the inductor',
        'Both the current and the stored energy are momentarily zero',
      ],
      correct_index: 2,
      reveal: '**The current is at its peak, and every joule is sitting in the inductor.**\n\nThis is the instant students find hardest, because it feels backwards: there is no voltage anywhere in the loop, and yet the current is the largest it will ever be.\n\nThe way out is to stop thinking of voltage as *what pushes a current* and start thinking of it as *what changes a current*. The capacitor\'s voltage is $ \\frac{q}{C} $, and it is what makes $ i $ grow. When $ q $ falls to zero, the **growth** stops — which puts the current at a maximum, not at zero. A maximum is exactly the place where the rate of change vanishes.\n\nThe energy books say the same thing. The capacitor holds $ \\frac{q^{2}}{2C} $, which is zero when $ q $ is zero. Nothing has been lost, so all of it must be in the inductor: $ \\frac{1}{2}Li_0^{2} $ equals the $ \\frac{Q_0^{2}}{2C} $ you started with.\n\nAnd the mass on a spring behaves identically. As it passes through the middle, the spring force is zero and the speed is greatest. Same sentence, different nouns.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'Why this is exactly simple harmonic motion',
      level: 2,
      objective: 'Derive the natural frequency of an LC loop and map every LC quantity onto its partner in simple harmonic motion.',
    }),
    b('text', 7, {
      markdown: 'Nothing is lost, so the total energy is a constant:\n\n$ \\frac{q^{2}}{2C} + \\frac{1}{2}Li^{2} = \\text{constant} $\n\nDifferentiate with respect to time, remembering that $ i = \\frac{dq}{dt} $:\n\n$ \\frac{q}{C}\\frac{dq}{dt} + Li\\frac{di}{dt} = 0 $\n\nCancel the common factor $ i = \\frac{dq}{dt} $ and what is left is\n\n$ L\\frac{d^{2}q}{dt^{2}} + \\frac{q}{C} = 0 $\n\nNow set that beside the equation of a mass on a spring, $ m\\frac{d^{2}x}{dt^{2}} + kx = 0 $. They are the **same equation**, letter for letter. So the solution must have the same shape — a sine — and the frequency must be built the same way. Since $ \\omega = \\sqrt{\\frac{k}{m}} $ for the spring, here it reads $ \\omega = \\sqrt{\\frac{1/C}{L}} = \\frac{1}{\\sqrt{LC}} $.\n\nWith $ q = Q_0\\cos\\omega t $, the current $ i $ has magnitude $ Q_0\\omega\\sin\\omega t $ — a quarter-cycle out of step with the charge, which is exactly the four-quarter story above, now written down.',
    }),
    b('comparison_card', 8, {
      title: 'The translation table — this is not a loose analogy, it is the same differential equation',
      columns: [
        {
          heading: 'Mass on a spring · Class 11',
          points: [
            'Displacement $ x $ — how far from equilibrium',
            'Velocity $ v = \\frac{dx}{dt} $',
            'Mass $ m $ — resists a change in velocity',
            'Spring constant $ k $ — the restoring stiffness',
            'Equation $ m\\frac{d^{2}x}{dt^{2}} + kx = 0 $',
            'Stored: $ \\frac{1}{2}kx^{2} $ and $ \\frac{1}{2}mv^{2} $',
            'Frequency $ \\omega = \\sqrt{\\frac{k}{m}} $',
          ],
        },
        {
          heading: 'LC circuit · this page',
          points: [
            'Charge $ q $ — how far from an empty capacitor',
            'Current $ i = \\frac{dq}{dt} $',
            'Inductance $ L $ — resists a change in current',
            'Reciprocal capacitance $ \\frac{1}{C} $ — the restoring stiffness',
            'Equation $ L\\frac{d^{2}q}{dt^{2}} + \\frac{q}{C} = 0 $',
            'Stored: $ \\frac{q^{2}}{2C} $ and $ \\frac{1}{2}Li^{2} $',
            'Frequency $ \\omega = \\frac{1}{\\sqrt{LC}} $',
          ],
        },
      ],
    }),
    b('latex_block', 9, {
      latex: '\\omega = \\frac{1}{\\sqrt{LC}} \\qquad f = \\frac{1}{2\\pi\\sqrt{LC}} \\qquad T = 2\\pi\\sqrt{LC}',
      label: 'The natural frequency of an LC circuit',
      note: 'Set by L and C alone. The starting charge does not appear — it fixes how BIG the oscillation is, never how fast, exactly as pulling a spring further does not change its period.',
      highlight: true,
    }),
    b('worked_example', 10, {
      label: 'the frequency and the peak current of an LC loop',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 50\\ \\mu\\text{F} $ capacitor is charged to $ 10 $ mC and then connected across a $ 20 $ mH inductor of negligible resistance. Find the angular frequency, the frequency in hertz, the period, the peak current and the total energy. Check the energy two different ways.',
      solution: '**Everything into SI first.** This is where marks leak away silently in this chapter.\n\n$ LC = (20\\times10^{-3})(50\\times10^{-6}) = 1.0\\times10^{-6}\\ \\text{s}^{2} $\n\n**Angular frequency.**\n\n$ \\omega = \\frac{1}{\\sqrt{LC}} = \\frac{1}{1.0\\times10^{-3}} = 1000\\ \\text{rad/s} $\n\n**Frequency and period.**\n\n$ f = \\frac{\\omega}{2\\pi} = \\frac{1000}{2\\pi} \\approx 159\\ \\text{Hz} $\n\n$ T = \\frac{1}{f} \\approx 6.3\\times10^{-3}\\ \\text{s} $\n\n**Peak current.** The charge runs as $ q = Q_0\\cos\\omega t $, so the current has peak magnitude $ Q_0\\omega $:\n\n$ i_0 = Q_0\\omega = (10\\times10^{-3})(1000) = 10\\ \\text{A} $\n\n**Total energy, taken from the capacitor at $ t = 0 $.**\n\n$ U = \\frac{Q_0^{2}}{2C} = \\frac{(10\\times10^{-3})^{2}}{2(50\\times10^{-6})} = \\frac{1.0\\times10^{-4}}{1.0\\times10^{-4}} = 1.0\\ \\text{J} $\n\n**The same energy, taken from the inductor a quarter-cycle later.**\n\n$ U = \\frac{1}{2}Li_0^{2} = \\frac{1}{2}(20\\times10^{-3})(10)^{2} = 1.0\\ \\text{J} $ ✓\n\nThe two agree, as they must — that agreement *is* the physics of the page, so it is worth writing out rather than assuming.\n\n**Now read the numbers.** The capacitor is emptied and refilled the other way round about $ 159 $ times every second, and a peak current of $ 10 $ A runs round a loop that contains no battery at all. Nothing is supplying that current; it is one joule being handed back and forth.\n\nAnd notice what $ \\omega $ did **not** depend on — the starting charge. Double $ Q_0 $ and every current doubles, but the frequency does not budge.',
    }),
    b('image', 11, {
      src: '',
      alt: 'A capacitor and an inductor in a single loop, with the energy shown moving from the electric field to the magnetic field and back over one cycle',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The same energy, four times a cycle, changing address. No source anywhere in the loop.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. Four small identical circuit panels in a row, separated by thin vertical grey rules, each showing a simple loop containing a parallel-plate capacitor symbol on the left and a coil inductor symbol on the right, drawn in warm amber. Panel one: the capacitor plates tinted bright amber with plus and minus signs, the coil plain, no current arrows. Panel two: the capacitor plates plain and grey, the coil surrounded by a soft amber glow, with bold orange current arrows running clockwise round the loop. Panel three: the capacitor plates tinted bright amber with the plus and minus signs swapped, the coil plain, no current arrows. Panel four: capacitor plain, coil glowing, orange current arrows running anticlockwise. Beneath the row, a single smooth dim-orange sine curve spans the full width with four small tick marks aligned under the four panels. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'That circuit was ideal. A real one is wound from real copper, which always has some resistance however small. What happens to the oscillation as time passes?',
      options: [
        'It keeps its frequency but its amplitude dies away',
        'It stops dead at the end of the very first cycle',
        'Its amplitude holds while its frequency climbs steadily',
        'It never starts at all, because resistance blocks it',
      ],
      correct_index: 0,
      reveal: '**It keeps oscillating, but every swing is smaller than the last, until it fades to nothing.**\n\nEach time charge is driven round the loop it passes through resistance, and $ i^{2}R $ converts some of the stored energy into heat. That energy does not come back, so the peak charge on the capacitor is a little lower each cycle. This is a **damped** oscillation — a pendulum swinging in air, not in vacuum.\n\nResistance also nudges the frequency down slightly, but for the small resistances of ordinary circuits that shift is tiny and $ \\frac{1}{\\sqrt{LC}} $ stays an excellent answer.\n\nSo an ideal LC loop is a bell that rings forever, and a real one is a bell that fades. Which is why every practical oscillator has an amplifier in it, quietly topping the energy back up once per cycle.\n\n**There is a second leak, and it is worth knowing about now.** A rapidly oscillating current radiates electromagnetic waves into the space around it. Here that is a nuisance; in Chapter 8 it becomes the entire point, because it is how a transmitting aerial works.',
      difficulty_level: 2,
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Turn the tuning dial of an old radio and what you are actually turning is a capacitor.\n\nThe aerial picks up every station at once — dozens of signals piled on top of one another on the same piece of wire. Inside the set, an inductor and a capacitor form exactly the loop on this page, and that loop has one frequency it likes: $ \\frac{1}{2\\pi\\sqrt{LC}} $. A signal arriving at that frequency builds up strongly, cycle after cycle. Every other signal is left as a whisper.\n\nThe dial slides the plates of the capacitor past one another, changing $ C $, and so sliding the circuit\'s natural frequency up and down the band until it sits on the station you want.\n\nThat is a large part of why this page opens the chapter rather than closing it. The number $ \\frac{1}{\\sqrt{LC}} $ you have just derived from energy sloshing round an empty loop is the very same number that returns later in this chapter as the **resonant frequency** of a series LCR circuit. When it turns up there it should feel like meeting an old friend, not like a coincidence.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. On the left, the front panel of an old valve radio drawn in simple outline with a circular tuning dial and a horizontal band scale marked with a bright amber pointer. A thin dim-grey leader line runs from the dial to the right-hand side, where a simple circuit loop is drawn in warm amber containing a coil inductor and a variable capacitor with an arrow struck through it. Above the circuit, a shallow dim-orange resonance curve peaks sharply at one point, with a single bright amber vertical line marking the peak. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- A charged capacitor across an inductor exchanges energy back and forth: $ \\frac{q^{2}}{2C} \\leftrightarrow \\frac{1}{2}Li^{2} $.\n- Charge and current are a quarter-cycle apart. Capacitor empty ⇒ current at its **peak**.\n- The circuit equation is $ L\\frac{d^{2}q}{dt^{2}} + \\frac{q}{C} = 0 $ — simple harmonic motion, exactly.\n- The dictionary: $ q \\leftrightarrow x $, $ i \\leftrightarrow v $, $ L \\leftrightarrow m $, $ \\frac{1}{C} \\leftrightarrow k $.\n- $ \\omega = \\frac{1}{\\sqrt{LC}} $, and it does **not** depend on how much charge you started with.\n- Peak current $ i_0 = Q_0\\omega $, and total energy $ \\frac{Q_0^{2}}{2C} = \\frac{1}{2}Li_0^{2} $.\n- A real loop **damps**, because $ i^{2}R $ steadily removes energy as heat.',
    }),
    b('text', 15, {
      markdown: 'Next: an LC loop rings at one frequency of its own choosing. The supply in your wall does something similar — except that there a generator forces the frequency on it, and never lets it fade. That forced, endlessly repeating current is what the rest of this chapter is about.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('In an ideal LC circuit the total energy of the oscillation',
          ['stays constant, moving between C and L', 'falls steadily as heat is produced', 'grows because the inductor keeps adding', 'is zero whenever the current is zero'],
          0,
          'With no resistance there is nowhere for energy to go, so the sum $ \\frac{q^{2}}{2C} + \\frac{1}{2}Li^{2} $ never changes. When the current is zero the energy is not gone — it is all sitting on the capacitor.',
          1),
        q('The frequency of an LC oscillation is fixed by',
          ['both L and C, and by nothing else', 'the initial charge on the capacitor', 'the resistance of the connecting wire', 'the peak current in the inductor'],
          0,
          'The natural frequency is $ \\frac{1}{2\\pi\\sqrt{LC}} $. The starting charge sets the amplitude of the oscillation, not its rate — just as pulling a spring out further does not change its period.',
          2),
        q('In the SHM dictionary for an LC circuit, the inductance $ L $ plays the part of',
          ['the mass', 'the spring constant', 'the displacement', 'the velocity'],
          0,
          'The circuit equation is $ L\\frac{d^{2}q}{dt^{2}} + \\frac{q}{C} = 0 $ against the spring\'s $ m\\frac{d^{2}x}{dt^{2}} + kx = 0 $, so $ L $ sits where $ m $ sits. It is the stubbornness of the circuit — resisting a change in current, as mass resists a change in velocity. The stiffness role goes to $ \\frac{1}{C} $.',
          2),
      ],
    }),
  ],
};

// ── p2 · What Alternating Current Is ─────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'ac-what-alternating-current-is',
  title: 'What Alternating Current Is',
  subtitle: 'A current that keeps changing its mind, and why the whole world runs on it',
  glossary: [
    { term: 'alternating current', definition: 'A current that reverses its direction periodically. In a mains supply it varies sinusoidally: $ i = i_0\\sin\\omega t $.' },
    { term: 'peak value', definition: 'The largest magnitude a sinusoidal quantity reaches, written with a subscript zero — $ v_0 $ or $ i_0 $. Also called the amplitude.' },
    { term: 'angular frequency', definition: 'The rate at which the phase angle advances: $ \\omega = 2\\pi f $, measured in radians per second. At 50 Hz it is about 314 rad/s.' },
    { term: 'hertz', definition: 'The SI unit of frequency — one cycle per second. India\'s mains supply runs at 50 Hz.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'The current in the wire feeding your ceiling fan is not flowing towards the fan. It is not flowing away from it either.\n\nIt is doing both, turning around a hundred times in every second the fan runs. Over a full second the net charge delivered to that fan is, to an extremely good approximation, **zero**.\n\nAnd yet the fan turns, the bulb lights, and the meter on the wall charges you for it.\n\nHow can a current that keeps changing its mind do any work at all?',
      hint: 'Ask what a bulb filament actually cares about — the direction the charge is going, or the simple fact that it is moving.',
      reveal: 'A filament does not care which way the electrons go. It heats up because they collide with the lattice as they pass, and a collision on the way left warms it exactly as much as a collision on the way right.\n\nThe same is true of the fan. Its motor is built so that the magnetic field it works against reverses in step with the current, so the torque comes out the same way on both halves of every cycle.\n\nSo "the net charge is zero" is a perfectly true statement about the **charge**, and a completely useless one about the **energy**. Energy delivery goes as $ i^{2}R $, and $ i^{2} $ is positive whichever way $ i $ points. That single fact is why alternating current works at all, and page 3 turns it into a number.\n\nChapter 6 has already told you where this waveform comes from. Rotate a coil steadily in a magnetic field, and Faraday\'s law hands you $ \\varepsilon = \\varepsilon_0\\sin\\omega t $ — not because an engineer chose it, but because a cosine differentiates into a sine. **Alternating current is not a design decision. It is simply what a spinning generator naturally produces.**',
    }),
    b('text', 1, {
      markdown: 'That last point is worth sitting with. Direct current — the steady, one-way current of Chapter 3 — is what a chemical cell gives you. Alternating current is what a **rotating machine** gives you. And almost every joule of electrical energy on Earth is made by a rotating machine.',
    }),
    b('heading', 2, {
      text: 'The shape of the signal, and the numbers that describe it',
      level: 2,
      objective: 'Read the peak value, period, frequency and angular frequency off a sinusoidal supply, and convert freely between them.',
    }),
    b('text', 3, {
      markdown: 'A sinusoidal supply is written\n\n$ v = v_0\\sin\\omega t $\n\nand the current it drives through a plain resistor has the same shape, $ i = i_0\\sin\\omega t $. Four numbers describe it completely, and exam questions move between them constantly.\n\n**The peak value $ v_0 $.** The largest the voltage ever reaches. It is hit twice per cycle — once positive, once negative. Also called the **amplitude**.\n\n**The period $ T $.** The time for one complete cycle, out and back. After a time $ T $ the waveform repeats exactly.\n\n**The frequency $ f = \\frac{1}{T} $.** Cycles per second, measured in **hertz**. India\'s mains runs at 50 Hz, so $ T = 0.02 $ s — twenty milliseconds per cycle.\n\n**The angular frequency $ \\omega $.** The sine function wants an angle, not a time, so we bundle the frequency into\n\n$ \\omega = 2\\pi f = \\frac{2\\pi}{T} $\n\nmeasured in radians per second. At 50 Hz that is $ \\omega = 100\\pi \\approx 314 $ rad/s. One complete cycle is $ 2\\pi $ radians of the sine — so keep your calculator in radian mode, and never put $ 50 $ where $ 314 $ belongs.\n\nOne warning before you go on. **The "220 V" written on Indian appliances is not $ v_0 $.** It is a different kind of average of the same waveform, and page 3 is about nothing else.',
    }),
    b('latex_block', 4, {
      latex: 'v = v_0\\sin\\omega t \\qquad i = i_0\\sin\\omega t \\qquad \\omega = 2\\pi f = \\frac{2\\pi}{T}',
      label: 'The alternating supply',
      note: 'ω is in radians per second, f is in hertz. Confusing the two is the commonest slip in this chapter — at 50 Hz, ω is 314 rad/s, not 50.',
      highlight: true,
    }),
    b('image', 5, {
      src: '',
      alt: 'A sine wave of voltage against time with the peak value and the period marked, and the zero crossings picked out',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'One period is one complete cycle. The waveform crosses zero twice in every cycle — which is twice per cycle that the current reverses.',
      generation_prompt: 'Clean scientific graph on a near-black background (#0B0C0F), thin dim-grey line art. A horizontal time axis and a vertical voltage axis with a thin grey zero line. Two full cycles of a smooth sine wave drawn in a bright warm amber stroke. A thin dashed grey horizontal line touches the first positive crest, with a small vertical double-headed arrow from the zero line up to it. A horizontal double-headed arrow spans exactly one full cycle along the top, between two thin dashed vertical grey lines dropped from successive matching points. Three small dim-orange dots mark the zero crossings of the first cycle. Muted white minimal labels reading v0, T, and time, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'The Indian mains runs at 50 Hz. How many times in one second does the current in your ceiling fan reverse its direction?',
      options: [
        '50 times — once in every complete cycle',
        '25 times — the two halves share one reversal',
        'It never reverses; only its size goes up and down',
        '100 times — twice in every complete cycle',
      ],
      correct_index: 3,
      reveal: '**A hundred times a second.**\n\nOne cycle of a sine goes up, comes back down through zero, goes negative, and returns to zero. The current therefore changes sign **twice** in every cycle — once on the way down and once on the way back up. Fifty cycles a second, two reversals in each, gives a hundred.\n\n**This is not a word game, and here is the proof you can see.** A bulb on the mains is at its hottest at every current peak and at its coolest at every zero crossing, so its brightness rises and falls **100 times a second**, not 50. A filament is far too slow to cool in between, and your eye is far too slow to follow, so you notice nothing. But an LED with a poorly smoothed supply switches off completely at every zero crossing, and a phone camera picks that up immediately as banding across the picture.\n\nSo when a question says "frequency 50 Hz" it is telling you about **cycles**. If it then asks about reversals, zero crossings, or how often a bulb reaches peak brightness, double it.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Why the world standardised on alternating current',
      level: 2,
      objective: 'Explain why AC beat DC for distributing power, and name the one device that decided it.',
    }),
    b('text', 8, {
      markdown: 'Direct current is easier to think about, and the first public electricity supplies were indeed DC. Within twenty years almost every grid on Earth was AC. The reason is one device.\n\nA **transformer** takes an alternating voltage and hands back a different alternating voltage — larger or smaller, with very little loss — using nothing but two coils and a changing flux. That is Chapter 6\'s physics doing something commercially enormous. And it works **only** on AC, because a transformer needs a *changing* flux, and a steady direct current gives it none at all.\n\nWhy that matters comes down to one formula from Chapter 3. The power wasted heating a transmission line is $ P_{loss} = i^{2}R $, which depends on the **current**. But the power actually delivered is $ P = vi $. So raise $ v $ by a factor of a hundred and you can carry the same power with a hundredth of the current — and the heating loss falls by a factor of **ten thousand**.\n\nThat is why the line marching across the countryside sits at hundreds of thousands of volts while the socket in your wall sits at 220. Transformers step it up at the power station and back down at your street, and a transformer needs alternating current to exist.\n\nThe transformer gets a page of its own later in this chapter, where the four kinds of loss inside it are worth a look. For now it is enough to know that it is the reason your fan is fed a current that keeps changing its mind.',
    }),
    b('comparison_card', 9, {
      title: 'Direct current and alternating current, side by side',
      columns: [
        {
          heading: 'Direct current · Chapter 3',
          points: [
            'Constant in size, always in one direction',
            'Produced by a cell or a battery',
            'A graph of $ i $ against $ t $ is a flat line',
            'Cannot be stepped up or down by a transformer',
            'Long-distance transmission wastes a great deal as heat',
            'Needed wherever polarity matters — electrolysis, charging, electronics',
          ],
        },
        {
          heading: 'Alternating current · this chapter',
          points: [
            'Reverses direction periodically; here, sinusoidally',
            'Produced by a rotating generator (Chapter 6, page 15)',
            'A graph of $ i $ against $ t $ is a sine wave',
            'Stepped up or down almost losslessly by a transformer',
            'Transmitted at high voltage, so very little is wasted',
            'Needed wherever power must travel — every grid on Earth',
          ],
        },
      ],
    }),
    b('worked_example', 10, {
      label: 'reading a supply straight off its equation',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An alternating supply is $ v = 311\\sin(100\\pi t) $ volts, with $ t $ in seconds. Find its peak value, angular frequency, frequency and period. Then find the instantaneous voltage at $ t = \\frac{1}{600} $ s, and the earliest time after $ t = 0 $ at which the voltage reaches its peak.',
      solution: '**Compare with the standard form** $ v = v_0\\sin\\omega t $, term by term. That comparison is the entire method; there is nothing else to it.\n\n**Peak value.** $ v_0 = 311 $ V.\n\n**Angular frequency.** $ \\omega = 100\\pi \\approx 314 $ rad/s.\n\n**Frequency.**\n\n$ f = \\frac{\\omega}{2\\pi} = \\frac{100\\pi}{2\\pi} = 50\\ \\text{Hz} $\n\n**Period.**\n\n$ T = \\frac{1}{f} = \\frac{1}{50} = 0.02\\ \\text{s} = 20\\ \\text{ms} $\n\n**Instantaneous voltage at $ t = \\frac{1}{600} $ s.** Put the time in and work in radians:\n\n$ \\omega t = 100\\pi \\times \\frac{1}{600} = \\frac{\\pi}{6} $\n\n$ v = 311\\sin\\frac{\\pi}{6} = 311 \\times 0.5 = 155.5\\ \\text{V} $\n\n**When does it first peak?** A sine reaches $ 1 $ when its angle is $ \\frac{\\pi}{2} $:\n\n$ 100\\pi t = \\frac{\\pi}{2} \\quad\\Rightarrow\\quad t = \\frac{1}{200} = 5\\ \\text{ms} $\n\nwhich is a quarter of the $ 20 $ ms period — exactly where it should be, and a free check on the arithmetic.\n\n**One thing to notice.** That peak of $ 311 $ V was not picked at random. It is the peak of the ordinary Indian $ 220 $ V mains, and the next page explains why two such different-looking numbers describe the same supply.',
    }),
    b('callout', 11, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Cross a border and the mains changes. India, Europe, most of Africa and most of Asia run at **50 Hz**. North America and much of South America run at **60 Hz**.\n\nThere is no physics in that split at all. Both work perfectly well. Fifty was the number a German manufacturer settled on in the 1890s because it fell out neatly from their machinery, and sixty was the number an American company settled on for reasons of its own. Once a country\'s generators, motors and clocks had been built around one of them, changing became unthinkable — and an accident froze into a standard.\n\nIt still bites. A mains clock that counts cycles gains twelve minutes an hour if you carry it from a 50 Hz country to a 60 Hz one. Motors designed for one run hot and at the wrong speed on the other.\n\nJapan is the strangest case of all. The east of the country, around Tokyo, runs at 50 Hz because it bought German generators in the 1890s; the west, around Osaka, runs at 60 Hz because it bought American ones. More than a century later the two halves still cannot share power freely, and the country has to run frequency-converter stations between them.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. Two horizontal graph panels stacked vertically, sharing the same width and the same time axis length. Upper panel: five full cycles of a smooth sine wave in warm amber over one second, with a thin grey zero line. Lower panel: six full cycles of the same amplitude in a slightly cooler amber over the identical span. A thin dashed grey vertical line marks the one-second point through both panels. Muted white minimal labels reading 50 Hz and 60 Hz at the left of each panel, generous dark space, no clutter.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ v = v_0\\sin\\omega t $ — a supply set by a peak value and a frequency.\n- $ \\omega = 2\\pi f = \\frac{2\\pi}{T} $. At 50 Hz, $ \\omega \\approx 314 $ rad/s and $ T = 0.02 $ s.\n- Alternating current is what a **rotating generator** naturally makes, not a design choice.\n- A 50 Hz current **reverses 100 times a second** — two reversals per cycle.\n- Heating goes as $ i^{2}R $, which is positive both ways, so a reversing current still delivers energy.\n- AC won because **transformers** work only on AC, and high-voltage transmission cuts $ i^{2}R $ losses enormously.\n- The 220 V on an Indian label is **not** the peak value. That is page 3.',
    }),
    b('text', 13, {
      markdown: 'Next: that 220 V. It is not the peak, it is not the plain average, and it is the only number on the whole waveform that tells you how much heat the supply will actually deliver.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('The angular frequency of the 50 Hz Indian mains is about',
          ['$ 314 $ rad/s', '$ 50 $ rad/s', '$ 0.02 $ rad/s', '$ 100 $ rad/s'],
          0,
          '$ \\omega = 2\\pi f = 2\\pi \\times 50 = 100\\pi $, which is about $ 314 $ rad/s. Putting the frequency itself into a sine argument, instead of $ 2\\pi f $, is the standard slip here.',
          1),
        q('A current alternating at 60 Hz reverses its direction',
          ['120 times each second', '60 times each second', '30 times each second', 'only when it is switched'],
          0,
          'A sine changes sign twice in every cycle — once going down through zero and once coming back up. Sixty cycles a second therefore give a hundred and twenty reversals.',
          2),
        q('Alternating current is preferred for transmitting power because',
          ['transformers can change its voltage', 'it travels faster along a copper wire', 'it produces no heat in the wires at all', 'it needs thinner insulation than DC'],
          0,
          'A transformer needs a changing flux, so it works only on AC. Stepping the voltage up lets the same power travel as a much smaller current, and the $ i^{2}R $ loss falls with the square of that reduction.',
          2),
      ],
    }),
  ],
};

// ── p3 · RMS and Peak Values ─────────────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'ac-rms-and-peak-values',
  title: 'RMS and Peak Values',
  subtitle: 'Why the average is useless, and what 220 V really means',
  glossary: [
    { term: 'root mean square value', definition: 'The square root of the mean of the square of an alternating quantity over a full cycle. For a sine, $ i_{rms} = \\frac{i_0}{\\sqrt{2}} $. It is the steady DC value that would heat the same resistor at the same rate.' },
    { term: 'mean value over a half cycle', definition: 'The average of a sinusoid taken over half a cycle only, so the cancellation never happens: $ \\frac{2i_0}{\\pi} \\approx 0.637\\,i_0 $. Not the same thing as the rms value.' },
    { term: 'true RMS meter', definition: 'An instrument that genuinely squares, averages and roots the signal, so it reads correctly on waveforms that are not sinusoidal.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Take a perfect voltmeter, connect it across the mains, and ask it for the **average** voltage over one complete cycle.\n\nThe answer is exactly zero. The waveform spends as long above the axis as below it, and goes exactly as far each way, so by the symmetry of a sine the two halves cancel to nothing.\n\nSo the average voltage of a supply that can kill you, boil a kettle and run a steel plant is zero.\n\nClearly "average" is the wrong question. What is the right one?',
      hint: 'Ask what actually gets delivered. Heat in a resistor goes as the square of the current — and a square is never negative.',
      reveal: 'The right question is: **what steady direct current would heat this resistor at the same rate?**\n\nThat question has a real answer, and the answer is not zero, because heating goes as $ i^{2}R $. The current spends half the cycle negative, but $ i^{2} $ is positive throughout. Squaring destroys the very cancellation that made the plain average useless.\n\nSo the recipe is: square the current, take **its** average over a cycle, then take the square root to land back in amperes. That is the **root mean square** value — and reading the name backwards gives you the order of operations: mean of the square, then root.\n\nThis is not a mathematical convenience. It is the number that answers a physical question — *how much heat does this thing actually deliver?* — which is exactly what your electricity bill is counting.',
    }),
    b('text', 1, {
      markdown: 'Let us do the averaging carefully once, so the $ \\sqrt{2} $ is never a mystery again.\n\nFor a sinusoidal current $ i = i_0\\sin\\omega t $, the square is\n\n$ i^{2} = i_0^{2}\\sin^{2}\\omega t $\n\nso what we need is the average of $ \\sin^{2}\\omega t $ over a full cycle. There is a neat way to see it without integrating anything.',
    }),
    b('heading', 2, {
      text: 'Squaring is what rescues the average',
      level: 2,
      objective: 'Explain why the mean square, not the mean, is the meaningful average of an alternating quantity, and obtain the factor of root two.',
    }),
    b('text', 3, {
      markdown: 'Over a full cycle, $ \\sin^{2}\\omega t $ and $ \\cos^{2}\\omega t $ must have the **same** average — a cosine is only a sine shifted sideways, and sliding a curve along cannot change its average. Call that common average $ A $.\n\nBut $ \\sin^{2}\\omega t + \\cos^{2}\\omega t = 1 $ at every single instant, so their averages must add to $ 1 $ as well:\n\n$ A + A = 1 \\quad\\Rightarrow\\quad A = \\frac{1}{2} $\n\nSo the mean of $ \\sin^{2} $ over a cycle is exactly one half, with no integration required. Therefore\n\n$ \\overline{i^{2}} = \\frac{i_0^{2}}{2} \\quad\\Rightarrow\\quad i_{rms} = \\sqrt{\\overline{i^{2}}} = \\frac{i_0}{\\sqrt{2}} $\n\nThe same argument runs unchanged for the voltage, so $ v_{rms} = \\frac{v_0}{\\sqrt{2}} $. Numerically $ \\frac{1}{\\sqrt{2}} \\approx 0.707 $, so the rms value is a little over seven-tenths of the peak.\n\n**And now the payoff.** The average power delivered to a resistance $ R $ is\n\n$ \\overline{P} = \\overline{i^{2}}R = i_{rms}^{2}R $\n\nwhich is the ordinary DC formula with $ i_{rms} $ standing in for $ i $. That is the whole reason rms values exist: **every DC power formula you already know keeps working, untouched, provided you feed it rms values.**',
    }),
    b('latex_block', 4, {
      latex: 'i_{rms} = \\frac{i_0}{\\sqrt{2}} \\approx 0.707\\,i_0 \\qquad v_{rms} = \\frac{v_0}{\\sqrt{2}} \\approx 0.707\\,v_0',
      label: 'Root-mean-square values',
      note: 'The rms value is the steady DC value that would heat the same resistor at the same rate. It is what every meter reads and what every label quotes.',
      highlight: true,
    }),
    b('image', 5, {
      src: '',
      alt: 'A sine wave, the square of that sine wave, and a horizontal line at half the peak of the square marking its mean value',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The sine averages to zero. Its square never goes negative, and averages to exactly half its own peak.',
      generation_prompt: 'Clean scientific graph on a near-black background (#0B0C0F), thin dim-grey line art. A single set of axes with a thin grey zero line. Two full cycles of a smooth sine wave drawn as a thin dim-orange stroke, dipping below the zero line on alternate halves. Over the same span, the squared waveform drawn as a bolder bright amber stroke that never goes below the zero line and completes four humps. A horizontal dashed bright amber line runs across at exactly half the height of the squared humps, with the areas above and below that line inside one hump lightly tinted in two contrasting soft fills to show they are equal. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'A perfect meter measures the **average** of the mains voltage over one complete cycle. What does it read?',
      options: [
        '220 V, which is exactly what the label promises',
        'Zero — the two half-cycles cancel each other exactly',
        '311 V, the peak the waveform actually reaches',
        '156 V, which is 220 divided by root two',
      ],
      correct_index: 1,
      reveal: '**Zero.** And that is precisely why nobody quotes the average.\n\nA sine spends exactly as long below the axis as above it, and goes exactly as far. Add the two halves and they cancel to nothing. The average tells you something true about the **charge** — over a full cycle, none is delivered — and nothing whatsoever about the **energy**.\n\nSo every meter, every label and every exam question uses the **rms** value instead, because it survives the cancellation and because it answers the question you actually care about.\n\n**One related result is worth having ready.** If you average over just **half** a cycle, the cancellation never happens and you get something non-zero: $ \\frac{2i_0}{\\pi} \\approx 0.637\\,i_0 $. That is the "average value" quoted in some books and asked for in some questions, and it is **not** the rms value $ 0.707\\,i_0 $. If a question asks for the average value of an alternating current, check whether it means over a full cycle (zero) or over a half cycle ($ 0.637\\,i_0 $) — the wording always says.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'What "220 V" actually means',
      level: 2,
      objective: 'Convert between the quoted mains value and the peak that insulation has to survive, and say what an AC meter physically responds to.',
    }),
    b('text', 8, {
      markdown: 'Everything written on an Indian appliance — 220 V, 5 A, 100 W — is an rms value. So when the label says 220 V:\n\n$ v_0 = \\sqrt{2}\\,v_{rms} = 1.414 \\times 220 \\approx 311\\ \\text{V} $\n\nThe voltage in your wall reaches **311 V** twice in every cycle, once each way, a hundred times a second. The full swing, from the most positive point to the most negative, is $ 2v_0 \\approx 622 $ V.\n\nThat number is not trivia. **Insulation has to survive the peak, not the rms.** A cable rated for exactly 220 V would be sitting at 311 V a hundred times a second and would eventually break down, so mains cable is always rated well above the quoted supply voltage. The same goes for any capacitor placed across the mains — its voltage rating must clear 311 V, not 220 V.\n\n**And what does an ammeter read?** An ordinary AC ammeter — a moving-iron or a hot-wire instrument — responds to $ i^{2} $ rather than to $ i $, so its deflection follows the mean square and its scale can be printed directly in rms amperes. That is not a coincidence of design. It is precisely why those instruments, and not the moving-coil meter of Chapter 3, are the ones used on AC.',
    }),
    b('worked_example', 9, {
      label: 'a 100 W bulb on the Indian mains',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A 100 W filament bulb is marked for use on a 220 V, 50 Hz supply. Find the rms current, the peak current, the peak voltage, the resistance of the filament, and the peak instantaneous power. Then comment on that last answer.',
      solution: '**Everything on the label is rms.** Start there, and never mix rms and peak values inside one equation.\n\n**rms current.**\n\n$ i_{rms} = \\frac{P}{v_{rms}} = \\frac{100}{220} \\approx 0.45\\ \\text{A} $\n\n**Peak current.**\n\n$ i_0 = \\sqrt{2}\\,i_{rms} = 1.414 \\times 0.45 \\approx 0.64\\ \\text{A} $\n\n**Peak voltage.**\n\n$ v_0 = \\sqrt{2}\\,v_{rms} = 1.414 \\times 220 \\approx 311\\ \\text{V} $\n\n**Resistance.** Use rms values throughout and the Chapter 3 formula is untouched:\n\n$ R = \\frac{v_{rms}^{2}}{P} = \\frac{(220)^{2}}{100} = 484\\ \\Omega $\n\n**Peak instantaneous power.** Power is largest when $ v $ and $ i $ are both at their peaks, which for a pure resistor happens at the same instant:\n\n$ P_{peak} = v_0 i_0 = 311 \\times 0.64 \\approx 200\\ \\text{W} $\n\n**Comment.** The peak power is exactly **twice** the average power, and that is no accident:\n\n$ v_0 i_0 = (\\sqrt{2}\\,v_{rms})(\\sqrt{2}\\,i_{rms}) = 2\\,v_{rms}i_{rms} $\n\nSo a "100 W" bulb is really a lamp whose power swings between $ 0 $ and $ 200 $ W, a hundred times a second, averaging 100 W. The filament is far too slow to cool in between, so it glows steadily — but a device that *can* respond that fast, such as an LED, will visibly flicker unless its supply has been smoothed.',
    }),
    b('table', 10, {
      caption: 'The four numbers people call "the value" of an alternating current. Only one of them is what your meter reads.',
      headers: ['Quantity', 'For $ i = i_0\\sin\\omega t $', 'As a multiple of the peak', 'Where it is used'],
      rows: [
        ['Peak (amplitude)', '$ i_0 $', '$ 1.000\\,i_0 $', 'insulation ratings, peak stress on a component'],
        ['rms value', '$ \\frac{i_0}{\\sqrt{2}} $', '$ 0.707\\,i_0 $', 'every meter, every label, every power formula'],
        ['Mean over a full cycle', '$ 0 $', '$ 0 $', 'nothing at all — it is why rms had to be invented'],
        ['Mean over a half cycle', '$ \\frac{2i_0}{\\pi} $', '$ 0.637\\,i_0 $', 'rectifier problems, and cheap meters (see below)'],
      ],
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'The moving-coil galvanometer of Chapter 3 deflects in proportion to the current through it. It is placed in a circuit carrying a 50 Hz alternating current. What does its needle do?',
      options: [
        'It settles at the peak value of the current',
        'It settles at the rms value, like an AC ammeter',
        'It stays at zero, because it follows the mean',
        'It swings to full scale and stays pinned there',
      ],
      correct_index: 2,
      reveal: '**It sits at zero** — or, at very low frequencies, trembles about zero.\n\nA moving-coil meter deflects in proportion to the current and reverses when the current reverses. On a 50 Hz supply it is being told to go one way and then the other a hundred times a second, and a needle with real mass cannot possibly follow that. What it responds to is the **average** torque over a cycle — and since the average current is zero, so is the average torque.\n\nThis is exactly why AC circuits are measured with **moving-iron** or **hot-wire** instruments instead. Both respond to $ i^{2} $. A moving-iron meter magnetises two pieces of soft iron that repel each other whichever way the current flows; a hot-wire meter measures the expansion of a wire heated by $ i^{2}R $. Neither cares about direction, so neither averages away to nothing, and both can be marked directly in rms.\n\n**The general rule underneath all of it:** an instrument that responds to $ i $ reads zero on AC. An instrument that responds to $ i^{2} $ reads the rms.',
      difficulty_level: 3,
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Look closely at a good multimeter and you may find the words **"True RMS"** printed on it. There is a real story behind that label, and it costs money.\n\nA cheap AC meter does not compute a mean square at all. It measures the average of the rectified waveform — the $ 0.637\\,i_0 $ from the table above — and then multiplies by a fixed factor of about $ 1.11 $ to convert that into an rms reading. The trick works perfectly, **provided the waveform is a clean sine**, because for a sine the ratio between those two averages is always the same $ 1.11 $.\n\nFeed it anything else and the trick collapses. A cheap inverter puts out a stepped, square-ish wave. A light dimmer chops a slice out of each half-cycle. A switching power supply draws current in short spikes. For none of these is the ratio $ 1.11 $, and a cheap meter can be wrong by twenty or thirty per cent while looking perfectly confident about it.\n\nA true-RMS meter does the honest thing in hardware: squares the signal, averages it, takes the root. It costs more because it is actually answering the question the definition asks — which is a useful reminder that rms is not a formula to be memorised. It is a physical measurement of how much heat a waveform can deliver.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. Three small waveform panels in a row, each with a thin grey zero line, drawn in warm amber: the first a clean smooth sine, the second a stepped square-ish wave with flat tops, the third a waveform with a slice cut out of each half-cycle leaving abrupt vertical edges. Below the row, two simple rectangular meter outlines side by side, each with a small display area; the left one shows a reading with a small dim-red cross beside it, the right one shows a reading with a small bright amber tick beside it and the words True RMS on its face. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- The mean of a sine over a **full cycle** is zero, so it is useless as a measure of size.\n- Heating goes as $ i^{2} $, which never goes negative — so average the **square**.\n- $ \\overline{\\sin^{2}\\omega t} = \\frac{1}{2} $ over a cycle, hence $ i_{rms} = \\frac{i_0}{\\sqrt{2}} \\approx 0.707\\,i_0 $.\n- Every DC power formula works on AC if you feed it **rms** values: $ \\overline{P} = i_{rms}^{2}R $.\n- **220 V is the rms value.** The peak is $ 220\\sqrt{2} \\approx 311 $ V, and insulation must survive that.\n- Mean over a **half** cycle is $ \\frac{2i_0}{\\pi} \\approx 0.637\\,i_0 $ — a different number, often confused with rms.\n- An instrument responding to $ i $ reads zero on AC; one responding to $ i^{2} $ reads rms.',
    }),
    b('text', 14, {
      markdown: 'Next: rms tells you how big an alternating quantity is. It says nothing at all about **when** it peaks — and the moment a circuit contains an inductor or a capacitor, the current and the voltage stop peaking together. The next page builds the picture that keeps track of that.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The rms value of a sinusoidal current of peak value $ i_0 $ is',
          ['$ \\frac{i_0}{\\sqrt{2}} $', '$ \\sqrt{2}\\,i_0 $', '$ \\frac{2i_0}{\\pi} $', '$ \\frac{i_0}{2} $'],
          0,
          'The mean of $ \\sin^{2} $ over a cycle is a half, so the mean square is $ \\frac{i_0^{2}}{2} $ and its root is $ \\frac{i_0}{\\sqrt{2}} $. The value $ \\frac{2i_0}{\\pi} $ is the mean over a half cycle, which is a different quantity.',
          1),
        q('The peak voltage of a 220 V mains supply is about',
          ['311 V', '220 V', '156 V', '440 V'],
          0,
          'The quoted value is rms, so the peak is $ \\sqrt{2} $ times bigger: $ 1.414 \\times 220 \\approx 311 $ V. Dividing by $ \\sqrt{2} $ instead of multiplying gives 156 V, which is the standard error here.',
          2),
        q('The rms value is the useful one because it fixes',
          ['the heating power delivered', 'the direction of the current', 'the frequency of the supply', 'the phase of the waveform'],
          0,
          'It is defined as the steady DC current that would heat the same resistor at the same rate, which is why $ \\overline{P} = i_{rms}^{2}R $ works. Direction, frequency and phase are all carried by other parts of the description.',
          2),
      ],
    }),
  ],
};

// ── p4 · Phasors ─────────────────────────────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'ac-phasors',
  title: 'Phasors',
  subtitle: 'Turning the calculus of this chapter into geometry',
  glossary: [
    { term: 'phasor', definition: 'A rotating arrow standing in for a sinusoidal quantity: its length is the peak value, it turns anticlockwise at $ \\omega $, and its projection on the vertical axis is the instantaneous value.' },
    { term: 'phase difference', definition: 'The constant angle between two phasors of the same frequency — equivalently, the fixed time gap between the instants at which the two quantities peak.' },
    { term: 'leads', definition: 'A quantity leads another if it reaches its peak earlier. Its phasor is drawn anticlockwise of (ahead of) the other, and its bracket carries a plus sign.' },
    { term: 'lags', definition: 'A quantity lags another if it reaches its peak later. Its phasor is drawn clockwise of (behind) the other, and its bracket carries a minus sign.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Here is a problem you will meet on almost every page from here on. Add these two voltages:\n\n$ v_1 = 30\\sin\\omega t $ and $ v_2 = 40\\sin\\left(\\omega t + \\frac{\\pi}{2}\\right) $\n\nDone with trigonometry this needs a compound-angle expansion, a regrouping, and an inverse tangent at the end. Done for three quantities at once — which is exactly what a series LCR circuit demands — it becomes a page of algebra, and most of the marks lost in this chapter are lost somewhere inside it.\n\nCharles Steinmetz, working for General Electric in the 1890s, got tired of that. He pointed out that every one of these sines has the **same frequency**, so all the time-dependence is shared — and anything shared by every term can be factored out and then ignored.\n\nWhat is left on the page is a set of arrows. And adding arrows is something you have been able to do since Class 11. This page is that trick.',
    }),
    b('text', 1, {
      markdown: 'A **phasor** is a rotating arrow that stands in for a sinusoidal quantity. Its length is the peak value; it rotates anticlockwise at the angular frequency $ \\omega $; and at every instant its projection on the vertical axis is the instantaneous value of the quantity it represents.',
    }),
    b('heading', 2, {
      text: 'A rotating arrow whose shadow is the sine',
      level: 2,
      objective: 'Say what the length, the angle and the vertical projection of a phasor each represent, and read an instantaneous value off the diagram.',
    }),
    b('text', 3, {
      markdown: 'Draw an arrow of length $ v_0 $ from the origin and set it spinning anticlockwise at $ \\omega $ radians per second. At time $ t $ it has turned through an angle $ \\omega t $ from the horizontal, so its vertical component is\n\n$ v_0\\sin\\omega t $\n\nwhich is exactly the instantaneous voltage. The arrow does not *resemble* the sine wave by analogy — its shadow **is** the sine wave, traced out as the arrow goes round.\n\nThree things follow immediately, and together they are the whole reason this picture is worth learning.\n\n**One — the length carries the size.** A longer arrow means a bigger peak value. And since the rms value is just the peak divided by $ \\sqrt{2} $, you may equally draw every arrow to rms length instead. Just be consistent: never mix peak-length and rms-length arrows in one diagram.\n\n**Two — the angle carries the timing.** An arrow drawn ahead of another by an angle $ \\phi $ represents a quantity that reaches its peak **earlier**, by $ \\frac{\\phi}{\\omega} $ seconds. We say it **leads**; the other one **lags**.\n\n**Three — and this is the trick — the picture can be frozen.** Every voltage and current in one AC circuit alternates at the same frequency, because the source sets it. So every phasor in the diagram spins at the same $ \\omega $, and the angles *between* them never change. Stop the clock at $ t = 0 $, draw the arrows once, and every relationship you read off that frozen picture stays true forever.\n\nOnce the picture is frozen, adding two sinusoids is nothing more than adding two vectors — parallelogram or tip-to-tail, whichever you prefer. **Calculus has become geometry.**',
    }),
    b('latex_block', 4, {
      latex: '\\text{arrow length} = \\text{peak value} \\qquad \\text{angle turned} = \\text{phase} \\qquad \\text{vertical projection} = \\text{instantaneous value}',
      label: 'What a phasor is',
      note: 'All the phasors in one circuit spin at the same ω, so the angles between them are permanent. That is what lets you freeze the picture and add arrows instead of sines.',
      highlight: true,
    }),
    b('image', 5, {
      src: '',
      alt: 'A rotating arrow on the left and the sine wave traced by its vertical projection on the right, joined by a horizontal construction line',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The arrow turns at a steady rate; its shadow on the vertical axis writes the sine wave out.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. On the left a circle drawn as a thin dim-grey outline with a bold bright amber arrow from the centre to the circumference, tilted about forty degrees above the horizontal, and a small curved orange arrow near the centre indicating anticlockwise rotation. A thin dashed grey line drops from the arrow tip to the horizontal axis, and a second thin dashed grey line runs from the arrow tip horizontally to the right. On the right, sharing the same vertical scale, one and a half cycles of a smooth warm amber sine wave, with a small bright dot where the horizontal dashed line meets the curve. A short vertical double-headed arrow on the circle marks the height of the arrow tip above the horizontal axis. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'spatial',
      prompt: 'Two phasors in the same 50 Hz circuit are drawn at $ t = 0 $ with an angle of $ 60^\\circ $ between them. What does that diagram look like $ 0.01 $ s later?',
      options: [
        'The gap has grown, because one arrow turns faster',
        'Both arrows have stopped, since a cycle has ended',
        'The gap has closed to zero as one catches the other',
        'Both have turned, but the gap is still $ 60^\\circ $',
      ],
      correct_index: 3,
      reveal: '**Both arrows have swung through half a turn, and the $ 60^\\circ $ between them is untouched.**\n\nAt 50 Hz the period is $ 0.02 $ s, so $ 0.01 $ s is exactly half a cycle and every phasor has turned through $ 180^\\circ $. But they all turn together, because they all spin at the same $ \\omega $ — the frequency of an AC circuit is imposed by the source, and every current and voltage anywhere in that circuit alternates at that one frequency.\n\n**This is the whole reason the phasor picture works.** If different arrows spun at different rates, the diagram would be a mess that changed every instant and told you nothing. Because they do not, the *relative* geometry is permanent, and a single frozen snapshot carries all the information there is.\n\nSo in practice you never draw the rotation at all. You draw the arrows once, in their correct relative positions, and read lengths and angles off the figure. Every page in the rest of this chapter does exactly that.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Phase difference becomes the angle between two arrows',
      level: 2,
      objective: 'Turn a phase difference written in a formula into an angle on a diagram, and read one back the other way.',
    }),
    b('text', 8, {
      markdown: 'Suppose a voltage and a current somewhere in a circuit are\n\n$ v = v_0\\sin\\omega t \\quad\\text{and}\\quad i = i_0\\sin(\\omega t - \\phi) $\n\nThe current reaches every stage of its cycle a time $ \\frac{\\phi}{\\omega} $ **after** the voltage does, so the current **lags** the voltage by $ \\phi $. On a diagram that is one line of work: draw the voltage arrow, then draw the current arrow $ \\phi $ **clockwise** from it — behind it, in the sense of the rotation.\n\nThe vocabulary is worth fixing now, because it is used without further explanation from the next page onwards.\n\n- **Leads** — reaches its peak earlier. Drawn **anticlockwise** of (ahead of) the reference arrow. A plus sign inside the bracket.\n- **Lags** — reaches its peak later. Drawn **clockwise** of (behind) the reference arrow. A minus sign inside the bracket.\n- **In phase** — $ \\phi = 0 $. The two arrows lie on top of one another and peak at the same instant.\n\nA memory that survives exam pressure: **arrows turn anticlockwise, so whatever sits further anticlockwise gets there first, and therefore leads.**',
    }),
    // ADDED. The heading above promises the reader will "read one back the
    // other way" — turn a diagram or a pair of waveforms back into a phase
    // angle — and nothing on the page delivered that half. The step_solver
    // below only goes the other direction (formula → arrows → sum). This is
    // also the page's only standalone worked example: p4 is the tool every page
    // from p5 onwards runs on, yet it carried the least reinforcement of any
    // teaching page in the chapter.
    b('worked_example', 9, {
      label: 'reading a phase difference straight off two waveforms',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An oscilloscope shows the voltage and the current in one branch of a $ 50 $ Hz circuit, both clean sine waves on the same time axis. The current crosses zero going upwards $ 2.5 $ ms **after** the voltage does. Take the voltage to be $ v = 311\\sin\\omega t $ volts and the current to have a peak of $ 4.0 $ A. Find the phase difference in degrees and in radians, say which quantity leads, and write the current as a sinusoid.',
      solution: '**Start with the period, because a phase difference is a fraction of one.**\n\n$ T = \\frac{1}{f} = \\frac{1}{50} = 0.02\\ \\text{s} = 20\\ \\text{ms} $\n\n**Turn the time gap into a fraction of a cycle.**\n\n$ \\frac{2.5}{20} = \\frac{1}{8} $\n\nSo the two waves are one eighth of a cycle apart.\n\n**A whole cycle is $ 360^\\circ $, so scale it.**\n\n$ \\phi = \\frac{1}{8}\\times 360^\\circ = 45^\\circ = \\frac{\\pi}{4}\\ \\text{rad} $\n\n**Which one leads?** The current reaches the same stage of its cycle $ 2.5 $ ms **later** than the voltage does, so the current **lags** the voltage by $ 45^\\circ $. On the diagram, draw the voltage arrow along the reference direction and the current arrow $ 45^\\circ $ **clockwise** of it — behind it, in the sense of the rotation.\n\n**Write it down.** Here $ \\omega = 2\\pi f = 2\\pi(50) = 100\\pi \\approx 314 $ rad/s, and a lag is a minus sign inside the bracket:\n\n$ i = 4.0\\sin\\left(\\omega t - \\frac{\\pi}{4}\\right)\\ \\text{A} $\n\n**Check it by going backwards**, which is the habit worth building. A phase angle converts back to a time gap through $ \\Delta t = \\frac{\\phi}{\\omega} $:\n\n$ \\Delta t = \\frac{\\pi/4}{100\\pi} = \\frac{1}{400}\\ \\text{s} = 2.5\\ \\text{ms} $\n\nwhich is exactly what the oscilloscope was showing. ✓\n\n**Two things worth carrying away.**\n\nFirst, $ 311 $ V is not a strange number — it is the **peak** of an ordinary $ 220 $ V mains supply, since $ 220\\sqrt{2} \\approx 311 $. Page 3 fixed the rule that every label value is an rms value, so the moment a problem hands you $ 220 $ V and you need a peak, that $ \\sqrt{2} $ has to go in. Then draw every arrow to peak length, or every arrow to rms length — but never a mixture of the two in one diagram.\n\nSecond, the same $ 2.5 $ ms gap would be a completely different angle at a different frequency. At $ 100 $ Hz the period is only $ 10 $ ms, so $ 2.5 $ ms would be a **quarter** of a cycle — a phase difference of $ 90^\\circ $, not $ 45^\\circ $. **A phase difference is a fraction of a cycle, never a time on its own.**',
    }),
    // ADDED. The one reasoning_prompt this page already had tests that the
    // angles between phasors are permanent. Nothing tested the leads/lags
    // vocabulary itself — and misreading the sign inside the bracket is the
    // single most common student slip on this page, one that then corrupts
    // every circuit from p6 onwards. Every distractor here is a real slip:
    // reading "+" as a delay, and converting degrees straight into milliseconds.
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'In one circuit the voltage is $ v = v_0\\sin\\omega t $ and the current is $ i = i_0\\sin\\left(\\omega t + \\frac{\\pi}{3}\\right) $, with the supply running at $ 50 $ Hz. Which statement is completely correct?',
      options: [
        'The current leads, peaking $ 3.3 $ ms earlier',
        'The current lags, peaking $ 3.3 $ ms later',
        'The current lags, as the bracket adds a delay',
        'The current leads, peaking a full $ 60 $ ms earlier',
      ],
      correct_index: 0,
      reveal: '**The current leads, and it arrives at every stage of its cycle about $ 3.3 $ ms early.**\n\nThe sign inside the bracket settles the whole question. A **plus** means the current has already been carried forward along its own cycle: at $ t = 0 $ it is not starting from zero, it is already $ 60^\\circ $ into the cycle. Being further round means arriving sooner, so it **leads**.\n\nNow put a time on it. At $ 50 $ Hz the period is\n\n$ T = \\frac{1}{50} = 20\\ \\text{ms} $\n\nand $ \\frac{\\pi}{3} $ is $ 60^\\circ $, which is one sixth of a full turn:\n\n$ \\Delta t = \\frac{1}{6}\\times 20 = 3.3\\ \\text{ms} $\n\nOr straight from $ \\Delta t = \\frac{\\phi}{\\omega} = \\frac{\\pi/3}{100\\pi} = \\frac{1}{300}\\ \\text{s} $ — the same $ 3.3 $ ms.\n\n**Reading the plus sign as a delay is the commonest slip on this page.** It feels natural: you added something, so surely it happens later. But the shift is applied to the **angle**, not to the clock. A quantity that is already further round the circle got there earlier, not later.\n\n**And an angle is never a time on its own.** Sixty degrees is not sixty milliseconds — it is one sixth of whatever the period happens to be. At $ 50 $ Hz that is $ 3.3 $ ms; at $ 500 $ Hz the very same $ 60^\\circ $ would be a tenth of that. Convert through the period every single time.',
      difficulty_level: 2,
    }),
    b('step_solver', 11, {
      title: 'Adding two out-of-phase voltages with arrows',
      problem: 'Two voltages in series are $ v_1 = 30\\sin\\omega t $ volts and $ v_2 = 40\\sin\\left(\\omega t + \\frac{\\pi}{2}\\right) $ volts. Find the single sinusoid that is their sum.',
      intro: 'The trigonometric route works, but it takes half a page. The phasor route takes four lines. Learn it here, on a case where you can check the answer against the trigonometry afterwards.',
      steps: [
        st('Draw $ v_1 $ — an arrow of length $ 30 $ along the reference direction',
          'The reference arrow is drawn along the positive horizontal axis by convention, and it stands for the term with no phase shift. Here that is $ v_1 $, since it is a plain $ \\sin\\omega t $ with nothing inside the bracket.', {
            check: {
              kind: 'mcq',
              prompt: 'What does the LENGTH of that arrow represent?',
              options: ['The peak value of $ v_1 $', 'The frequency of $ v_1 $', 'The phase angle of $ v_1 $', 'The period of one cycle'],
              answer_index: 0,
              feedback_right: 'Yes — length is size. The frequency is not drawn at all; it is the rate at which the whole diagram would spin, and it is the same for every arrow.',
              feedback_wrong: 'Length carries the size of the quantity, which for a sinusoid means its peak value. The frequency never appears in the diagram, because every arrow shares it.',
            },
          }),
        st('Draw $ v_2 $ — length $ 40 $, turned $ 90^\\circ $ anticlockwise',
          'The $ +\\frac{\\pi}{2} $ inside the bracket says $ v_2 $ peaks a quarter of a cycle **before** $ v_1 $, so it leads — and leading means drawn anticlockwise. The two arrows are now at right angles.', {
            check: {
              kind: 'mcq',
              prompt: 'Which way from the reference arrow does a LEADING phasor go?',
              options: ['Clockwise, behind it', 'Anticlockwise, ahead of it', 'Directly opposite it', 'The direction does not matter'],
              answer_index: 1,
              feedback_right: 'Correct — the arrows turn anticlockwise, so whatever sits further round that way arrives at any given angle first.',
              feedback_wrong: 'Since the rotation is anticlockwise, an arrow placed further anticlockwise reaches every stage of the cycle sooner. That is what leading means.',
            },
          }),
        st('Add them tip-to-tail: $ v_0 = \\sqrt{30^{2} + 40^{2}} = 50 $ V',
          'Because the two arrows are perpendicular, the parallelogram is a rectangle and the resultant is simply its diagonal. This is the point of the whole method — an addition of two sines has turned into Pythagoras.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is Pythagoras allowed here?',
              options: ['Because the two arrows are at right angles', 'Because both voltages have the same peak', 'Because the supply frequency is 50 Hz', 'Because AC voltages always add this way'],
              answer_index: 0,
              feedback_right: 'Exactly — the right angle came from the quarter-cycle phase difference. At any other angle you would need the full parallelogram rule.',
              feedback_wrong: 'It is the right angle between the arrows that makes the parallelogram a rectangle. A different phase difference would need the general parallelogram rule instead.',
            },
          }),
        st('Find the angle: $ \\tan\\phi = \\frac{40}{30} \\Rightarrow \\phi \\approx 53^\\circ $',
          'The resultant sits $ 53^\\circ $ anticlockwise of the reference arrow, so the sum **leads** $ v_1 $ by $ 53^\\circ $, which is about $ 0.93 $ radians.'),
        st('Write the answer: $ v = 50\\sin(\\omega t + 53^\\circ) $ volts',
          'Read it straight off the figure — the length gives the peak, the angle gives the phase. And check it against the trigonometry: $ 30\\sin\\omega t + 40\\cos\\omega t $ has amplitude $ \\sqrt{30^{2}+40^{2}} = 50 $ and phase $ \\tan^{-1}\\frac{40}{30} $. The two routes agree exactly, as they must.'),
      ],
      now_you_try: {
        problem: 'Your turn. Add $ v_1 = 8\\sin\\omega t $ and $ v_2 = 6\\sin\\left(\\omega t - \\frac{\\pi}{2}\\right) $ volts.',
        answer: '$ v = 10\\sin(\\omega t - 37^\\circ) $ volts — peak $ 10 $ V, **lagging** $ v_1 $ by about $ 37^\\circ $.',
        solution: 'Draw $ v_1 $ as an arrow of length $ 8 $ along the reference direction.\n\nThe minus sign in $ v_2 $ means it **lags**, so its length-$ 6 $ arrow is drawn $ 90^\\circ $ **clockwise** — pointing straight down.\n\nThe two are perpendicular, so\n\n$ v_0 = \\sqrt{8^{2} + 6^{2}} = 10\\ \\text{V} $\n\nand the resultant leans below the reference by\n\n$ \\phi = \\tan^{-1}\\frac{6}{8} \\approx 37^\\circ $\n\nBelow the reference means lagging, so $ v = 10\\sin(\\omega t - 37^\\circ) $ volts.\n\n**The check that catches sign errors every time:** the resultant must lie *between* the two arrows you added. Here it sits between the reference direction and straight down, which is exactly where $ -37^\\circ $ puts it. If your answer lands outside that wedge, you have drawn a lead where there was a lag.',
      },
    }),
    b('comparison_card', 12, {
      title: 'The same sum, done twice — and why nobody does it the first way',
      columns: [
        {
          heading: 'By trigonometry',
          points: [
            'Expand $ \\sin\\left(\\omega t + \\frac{\\pi}{2}\\right) $ with a compound-angle formula',
            'Collect the $ \\sin\\omega t $ and $ \\cos\\omega t $ terms',
            'Recognise $ a\\sin\\theta + b\\cos\\theta $ as a single sine',
            'Compute $ \\sqrt{a^{2}+b^{2}} $ and $ \\tan^{-1}\\frac{b}{a} $',
            'A third term means doing all of it again',
            'Reliable, slow, and easy to slip up in',
          ],
        },
        {
          heading: 'By phasors',
          points: [
            'Draw one arrow per term, its length the peak value',
            'Set each angle from the phase inside its bracket',
            'Add the arrows tip-to-tail',
            'Read the resultant length and angle off the figure',
            'A third term is simply a third arrow',
            'Fast, visual, and self-checking — the resultant lies between them',
          ],
        },
      ],
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Phasors did not stay in the textbook. They are how an electricity grid is actually run.\n\nEvery large generator feeding the Indian grid has to be brought **into phase** with it before its breaker can be closed. Connect a generator whose phasor is even a few degrees out, and an enormous surge of current flows as the grid drags the machine violently into step — enough to damage the shaft. So an instrument called a synchroscope watches the angle between two phasors, and the operator closes the breaker only when that angle has come to rest near zero.\n\nAcross the grid as a whole, devices called **phasor measurement units** sit in substations, sampling the local voltage and reporting its phasor angle — time-stamped by satellite clock, thirty or more times a second. Comparing those angles at the two ends of a long line tells operators how much power is flowing and how close the system is sitting to instability. A steadily growing angle difference is the early warning of a cascading blackout.\n\nSo a trick invented in the 1890s to avoid doing trigonometry has become the instrument that keeps a subcontinent\'s lights on.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. On the left, a circular dial drawn as a thin grey outline with two bold arrows from its centre: one bright amber pointing to the right, one cooler amber a small angle away from it, with a thin curved orange arc marking the angle between them and a small bright tick mark at the top of the dial. On the right, a simplified transmission scene: two lattice pylon outlines in dim grey joined by three gently sagging catenary lines, with a small square box at the base of each pylon carrying a tiny satellite-dish glyph and a thin dashed grey line rising from each towards the top of the frame. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- A **phasor** is an arrow rotating anticlockwise at $ \\omega $; its vertical projection is the instantaneous value.\n- **Length = peak value** (or rms, if you draw every arrow that way — never mix the two).\n- **Angle = phase.** Ahead anticlockwise means **leading**; behind clockwise means **lagging**.\n- Every phasor in one circuit spins at the same $ \\omega $, so the angles between them are **fixed**.\n- That is what lets you freeze the diagram at $ t = 0 $ and just do vector addition.\n- Perpendicular phasors add by **Pythagoras**; the phase of the sum is $ \\tan^{-1} $ of the ratio.\n- The resultant of two phasors always lies **between** them — a free check on any answer.',
    }),
    b('text', 15, {
      markdown: 'Next: the tool goes to work. Start with the simplest AC circuit there is — a single resistor — where the two arrows lie exactly on top of one another, and see what that costs and what it buys.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The length of a phasor represents',
          ['the peak value of the quantity', 'the frequency of the supply', 'the phase angle at time zero', 'the mean value over a cycle'],
          0,
          'Length is size and angle is timing. The frequency never appears in the picture at all, because every arrow in one circuit shares it — which is exactly why the diagram can be frozen.',
          1),
        q('Two phasors drawn at $ 90^\\circ $ to each other represent quantities that',
          ['peak a quarter of a cycle apart', 'peak at exactly the same instant', 'have twice the frequency of each other', 'always have equal peak values'],
          0,
          'A full cycle is $ 360^\\circ $ of rotation, so $ 90^\\circ $ is a quarter of a cycle in time. Phasors of the same circuit can never differ in frequency, so that option describes something the picture cannot show.',
          2),
        q('Adding two sinusoids of the same frequency using phasors works because',
          ['their relative angles never change', 'their peak values are always equal', 'their frequencies slowly drift apart', 'their averages over a cycle are zero'],
          0,
          'Both arrows spin at the same $ \\omega $, so the angle between them is fixed for all time and one frozen snapshot carries the whole story. If they turned at different rates the diagram would be different at every instant and useless.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p1, p2, p3, p4]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
