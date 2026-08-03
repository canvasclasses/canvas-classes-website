'use strict';
/**
 * Class 12 Physics · Ch.8 "Electromagnetic Waves" — pages 1–4.
 *
 * This is the capstone of the whole book, and these four pages are one story
 * with a crisis and a resolution — not four more topics:
 *
 *   p1  Ampere's law, used since Ch.5, CONTRADICTS ITSELF. One loop, two
 *       surfaces, two answers. Set up as a genuine crisis and left unresolved.
 *   p2  Maxwell's repair: a changing electric field is worth exactly as much
 *       as a current for making B. i_d = eps0 dPhi_E/dt, and for a parallel-
 *       plate capacitor it comes out EXACTLY equal to the conduction current.
 *   p3  With the repair in, the four laws are complete — and the reader
 *       already owns all four (Ch.1, Ch.4, Ch.6, Ch.5+p2). Stated, read aloud,
 *       each labelled with its source chapter. Nothing is derived here.
 *   p4  Solve them in empty space and a wave falls out, at 1/sqrt(mu0 eps0),
 *       which equals the measured speed of light. NOBODY PUT LIGHT IN.
 *
 * Plan: _agents/plans/PHYSICS12_EMI_AC_EMWAVES_PLAN.md §1, §4 (Ch.8 map), §6.
 *
 * Every reasoning_prompt on these pages carries an explicit `correct_index`,
 * spread across positions 0–3 — see the book-wide defect fixed 2026-07-31,
 * where reasoning prompts had no key at all and the answer had drifted to the
 * first position in 94% of cases.
 *
 * Run: node scripts/physics12-book/build_ch8_a_maxwell.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 8;

// ── p1 · The Crack in Ampère's Law ───────────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'emw-the-crack-in-amperes-law',
  title: 'The Crack in Ampère\'s Law',
  subtitle: 'One loop, two surfaces, two different answers',
  glossary: [
    { term: 'Ampère\'s circuital law', definition: 'The law of Chapter 5: $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 i_{enc} $ — the circulation of the magnetic field round a closed loop equals $ \\mu_0 $ times the current passing through the loop.' },
    { term: 'Ampèrean loop', definition: 'The imaginary closed curve chosen for the line integral in Ampère\'s law. It is drawn wherever it makes the algebra easiest; nothing physical sits on it.' },
    { term: 'enclosed current', definition: 'The net current crossing a surface whose boundary is the Ampèrean loop. The definition names the loop but not the surface — which is exactly where this page finds trouble.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Here is a circuit you have known since Chapter 2: a battery, a switch, a resistor and a **parallel-plate capacitor**. Close the switch and the ammeter needle swings. Charge piles onto one plate and drains off the other, and while that is happening there is a real, measured current $ i $ in the wires.\n\nNow do exactly what Chapter 5 taught you. Draw a circular Ampèrean loop round one of those wires, close to the capacitor, and write down $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 i_{enc} $.\n\nThe trouble starts with $ i_{enc} $. It means "the current crossing a surface whose edge is that loop" — and a loop is the edge of **infinitely many** surfaces.\n\nStretch a flat disc across the loop: the wire pierces it, so $ i_{enc} = i $.\n\nNow stretch a surface that bulges out sideways like a paper bag and passes **between the capacitor plates**, where nothing crosses at all: $ i_{enc} = 0 $.\n\nSame loop. Same instant. Two answers.',
      hint: 'The left-hand side of the law is an integral round the loop. Does it know or care which surface you stretched across that loop?',
      reveal: 'Both answers cannot be right, and it is the **left-hand side** that proves it.\n\n$ \\oint\\vec{B}\\cdot d\\vec{l} $ is worked out entirely on the loop. The loop is one fixed circle sitting in space; whatever the magnetic field is at each point of that circle, the integral has **one** value. No surface appears in it anywhere.\n\nSo the right-hand side must have one value too. As written, it does not. It hands you $ \\mu_0 i $ or $ 0 $ depending on a choice you were never given a rule for.\n\nThat is not a hard problem. It is a **broken law** — and it is a law you have used, correctly, for three chapters.\n\nThis page does not fix it. This page makes the crack as wide and as honest as it can, because the repair on page 2 only makes sense to somebody who has felt how badly the repair is needed. Resist the urge to guess the answer now.',
    }),
    b('text', 1, {
      markdown: 'Start by writing down the law exactly as Chapter 5 left it, because every word of it is about to be tested.',
    }),
    b('latex_block', 2, {
      latex: '\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0\\, i_{enc}',
      label: 'Ampère\'s circuital law, as Chapter 5 stated it',
      note: 'Read it aloud: the circulation of $ \\vec{B} $ round a closed loop equals $ \\mu_0 $ times the current through the loop. Notice what the statement never says — **which** surface that current is counted through.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'Any surface you like — and why that was never a problem before',
      level: 2,
      objective: 'Explain what "the current through a loop" means, and why the choice of surface never mattered in Chapter 5.',
    }),
    b('text', 4, {
      markdown: 'A closed loop is a **boundary**. Any surface whose edge is that loop is a fair choice — a flat disc, a shallow dome, a long bag hanging down. Ampère\'s law is written for the loop, so it must not care which of them you pick.\n\nIn Chapter 5 it never did. Round a long straight wire you took a flat disc and the wire pierced it once. Inside a solenoid you took a rectangle and counted the turns crossing it. Bend those surfaces however you like and the same current still crosses them, so the answer never moved.\n\n**And there is a reason it never moved.** A steady current has nowhere to stop. Charge does not pile up anywhere in a steady circuit — whatever flows into any region flows out of it again, so the current threads through the circuit in closed loops, like water round a closed pipe. Any surface hung on the same rim is pierced by the same net current, because a current that goes in must come out.\n\nA charging capacitor is the one arrangement in this whole book where that is false. **The current stops at the plate.** Charge accumulates there and goes no further. And the moment a current is allowed to stop, "the current through the loop" stops being a property of the loop at all — it becomes a property of the surface you happened to draw.',
    }),
    b('image', 5, {
      src: '',
      alt: 'One Ampèrean loop round a wire with two different surfaces stretched across it — a flat disc cut by the wire, and a bag passing between the capacitor plates',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'One loop, two surfaces. The wire pierces one of them and nothing pierces the other.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. A horizontal wire drawn in warm amber runs from the left and ends at the left plate of a parallel-plate capacitor drawn as two short vertical amber bars with a gap between them; a second amber wire leaves the right plate and runs off to the right. Small orange arrowheads on both wires show current flowing left to right. Around the left wire, well before the capacitor, a bright amber ellipse drawn in perspective marks a circular Ampèrean loop. Two translucent surfaces are shown sharing that same ellipse as their rim: one a flat cool-blue disc filling the ellipse and clearly pierced by the wire, the other a long translucent violet bag that bulges to the right, passes through the empty gap between the two capacitor plates, and is pierced by nothing. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('table', 6, {
      caption: 'The same loop at the same instant, with two legitimate surfaces stretched across it.',
      headers: ['Surface hung on the loop', 'What crosses it', '$ i_{enc} $', 'So the law says $ \\oint\\vec{B}\\cdot d\\vec{l} $ is'],
      rows: [
        ['a flat disc, pierced by the wire', 'the conduction current in the wire', '$ i $', '$ \\mu_0 i $'],
        ['a bag bulging out past the plates', 'nothing — the gap is empty', '$ 0 $', '$ 0 $'],
        ['a dome bulging the other way', 'the conduction current in the wire', '$ i $', '$ \\mu_0 i $'],
        ['a bag threaded round the far wire', 'the conduction current in that wire', '$ i $', '$ \\mu_0 i $'],
      ],
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'logical',
      prompt: 'While the capacitor charges, an ammeter in the wire reads a steady $ 2 $ A. Which statement about that circuit is correct?',
      options: [
        'No current flows anywhere, because the gap breaks the circuit',
        'Current flows in the wires and also crosses the gap as charge',
        'Current flows in the wires, but no charge crosses the gap',
        'Current flows only in the wire on the battery side of the gap',
      ],
      correct_index: 2,
      reveal: '**Current flows in the wires, but no charge crosses the gap.**\n\nThis matters far more than it looks, because it is what makes the contradiction *real* rather than sloppy bookkeeping.\n\nPut an ammeter in each of the two wires. Both read $ 2 $ A, and they read it at the same time. Charge is arriving on one plate at $ 2 $ coulombs a second and leaving the other at $ 2 $ coulombs a second — so from outside, the capacitor looks like it is passing a current straight through.\n\nBut inside the gap there is vacuum, or air, or a slab of insulator. **Nothing crosses.** Not one electron. If it did, the capacitor would be a resistor and would never hold charge at all.\n\nSo the bag-shaped surface genuinely has zero conduction current through it. There is no hidden current to find, and no measurement error to blame. The two surfaces really do give $ \\mu_0 i $ and $ 0 $, and the law really is broken.',
      difficulty_level: 2,
    }),
    b('heading', 8, {
      text: 'Three ways out, and why none of them works',
      level: 2,
      objective: 'Test the obvious escapes from the contradiction and show why each one fails.',
    }),
    b('text', 9, {
      markdown: 'Every student meeting this for the first time tries one of three escapes. They are all worth trying, and they all fail — which is itself the argument that something in the law has to change.\n\n**"Just always use the flat surface."** No rule says so, and no rule could. Ampère\'s law is stated for a loop and never mentions a surface. Bolting on an extra instruction — *and by the way, use this particular surface, otherwise the law gives the wrong answer* — is not physics. It is an admission that the law is incomplete, dressed up as a procedure.\n\n**"The current isn\'t steady here, so the law doesn\'t apply."** This is the honest one, and it is closest to correct: Ampère\'s law was only ever established for steady currents. But it buys you nothing. It tells you *when* the law fails without telling you what the law should have said instead — and meanwhile there is definitely a magnetic field round that wire, sitting there waiting to be calculated, and you now have no equation that will calculate it.\n\n**"No current flows in a capacitor circuit anyway."** Flatly false, and the meter settles it. Worse, Chapter 7 spent thirteen pages on capacitors in AC circuits, where current flows back and forth through the same arrangement continuously, hour after hour. If no current flowed, $ X_C = \\frac{1}{\\omega C} $ would be meaningless and every radio tuner would stop working.\n\nSo the escapes close off one by one, and what is left is uncomfortable and clean: **the law, as we have it, is wrong.**',
    }),
    b('callout', 10, {
      variant: 'warning',
      title: 'Do not talk yourself out of the contradiction',
      markdown: 'It is very tempting, at this point, to decide the problem is somehow artificial — a made-up surface, an exam trick, something that would never come up.\n\nIt is not.\n\nThe magnetic field round a wire charging a capacitor is a **real field**. It can be measured, and it has been. Ampère\'s law is our only tool for computing it, and that tool now returns two different answers depending on an arbitrary choice.\n\nA physical theory is allowed to be difficult, incomplete or hard to use. It is not allowed to be **inconsistent** — to give two answers to one question. That is the one failure that cannot be lived with, and it is why the next page exists.',
    }),
    b('worked_example', 11, {
      label: 'the two answers, in numbers',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A capacitor is being charged through a long straight wire carrying $ 2.0 $ A. Take a circular Ampèrean loop of radius $ 5.0 $ cm centred on that wire, in a plane perpendicular to it, drawn close to the capacitor. Work out $ \\oint\\vec{B}\\cdot d\\vec{l} $ and the field $ B $ on the loop using (i) a flat disc pierced by the wire, and (ii) a bag that passes between the plates. Then state how far apart the two answers are.',
      solution: '**Surface (i) — the flat disc.** The wire pierces it once, so $ i_{enc} = 2.0 $ A.\n\n$ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 i_{enc} = (4\\pi\\times10^{-7})(2.0) = 2.5\\times10^{-6}\\ \\text{T m} $\n\nBy symmetry $ B $ has the same size all round the loop and points along it, so $ \\oint\\vec{B}\\cdot d\\vec{l} = B(2\\pi r) $, giving\n\n$ B = \\frac{\\mu_0 i}{2\\pi r} = \\frac{(2\\times10^{-7})(2.0)}{0.050} = 8.0\\times10^{-6}\\ \\text{T} $\n\n**Surface (ii) — the bag through the gap.** Nothing crosses it, so $ i_{enc} = 0 $, and the same law gives\n\n$ \\oint\\vec{B}\\cdot d\\vec{l} = 0 \\quad\\Rightarrow\\quad B = 0 $\n\n**How far apart are they?** As far apart as two answers can be. One says $ 8.0 $ microtesla — small, but perfectly measurable with a school-laboratory Hall probe. The other says **exactly zero**.\n\nThis is not a disagreement in the third decimal place that better apparatus might settle. It is a field that either exists or does not, and the law is telling us both.\n\n**Which one is right?** The measurement says $ 8.0 $ microtesla. So it is the *bag* calculation that is missing something — and whatever is missing must be sitting in that gap, doing the job the absent current would have done.',
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'analogical',
      prompt: 'Which single feature of the charging capacitor is what breaks Ampère\'s law as Chapter 5 stated it?',
      options: [
        'The plates are metal rather than being made of an insulator',
        'The magnetic field near this wire is unusually weak and hard to find',
        'The current in this wire is far larger than Chapter 5 allowed for',
        'Charge collects on a plate, so the conduction current has an end',
      ],
      correct_index: 3,
      reveal: '**Charge collects on a plate, so the conduction current has an end.**\n\nEverywhere in Chapter 5 the current went round and round for ever. Nothing accumulated anywhere, so a current entering any region left it again, and every surface hung on the same loop caught the same net current. The choice of surface was invisible because it made no difference.\n\nHere charge stops and stays. The current has a terminus, and the instant that is true, "the current through the loop" is no longer a property of the loop — it depends on whether your surface was drawn before the terminus or after it.\n\n**And stating the fault this precisely almost hands you the repair.** If the trouble is that the current *stops*, then something must be happening at the place where it stops that is worth exactly as much as the current would have been. Something in the gap, appearing at precisely the rate the current disappears.\n\nThat something is on the next page. It is not a current, and it is not made of charge — and it works perfectly.',
      difficulty_level: 3,
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Ampère\'s law $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 i_{enc} $ names a **loop** but never names a **surface**.\n- A loop bounds infinitely many surfaces. For the law to make sense, all of them must give the same $ i_{enc} $.\n- For **steady** currents they do, because a steady current never stops — whatever enters a region leaves it.\n- A **charging capacitor** is the exception: charge piles up on a plate and the conduction current ends there.\n- So a flat disc gives $ i_{enc} = i $ and a bag through the gap gives $ i_{enc} = 0 $ — the same loop, two answers.\n- Current **does** flow in the wires; **no charge** crosses the gap. Both statements are true, and both are needed for the contradiction to be real.\n- The law is not merely awkward here. It is **inconsistent**, which is the one thing a law may not be.',
    }),
    b('text', 14, {
      markdown: 'Next: look hard at the gap itself. There is no charge crossing it — but there is something in there that is changing, and Maxwell noticed that it changes at exactly the right rate.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('Ampère\'s law runs into trouble with a charging capacitor because',
          ['the enclosed current depends on which surface you choose', 'the magnetic field vanishes everywhere near the plates', 'the loop integral changes as the loop is moved along', 'the current in the two wires is not the same at any time'],
          0,
          'The circulation is worked out on the loop alone and so has one value, but the current "through the loop" turns out to depend on a surface you were never told how to pick. A law that returns two answers to one question is broken.',
          2),
        q('While a capacitor charges, the conduction current in the two wires joined to it is',
          ['the same in both, though no charge crosses the gap', 'zero in both, since the gap breaks the circuit', 'larger on the battery side than on the other side', 'reversing direction many times every second'],
          0,
          'Charge arrives on one plate at exactly the rate it leaves the other, so both wires carry the same current — while the gap itself is crossed by nothing at all. Reversal belongs to an AC source, not to steady charging.',
          2),
        q('In Chapter 5 the choice of surface never mattered because',
          ['steady currents never stop, so nothing accumulates', 'the surfaces chosen were always perfectly flat discs', 'the fields involved were always far too weak to matter', 'the loops were always drawn round one single wire'],
          0,
          'A steady current entering any region leaves it again, so every surface hung on the same rim is pierced by the same net current. Flat surfaces were used for convenience, not out of necessity.',
          3),
      ],
    }),
  ],
};

// ── p2 · Displacement Current ────────────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'emw-displacement-current',
  title: 'Displacement Current',
  subtitle: 'A changing electric field does a current\'s job',
  glossary: [
    { term: 'displacement current', definition: 'The quantity $ i_d = \\varepsilon_0\\frac{d\\Phi_E}{dt} $. It is not a flow of charge; it is a changing electric flux, and it produces a magnetic field exactly as a real current would.' },
    { term: 'Ampère–Maxwell law', definition: 'Ampère\'s law with Maxwell\'s term added: $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0(i_c + i_d) $. Unlike the original, it gives the same answer for every surface bounded by the loop.' },
    { term: 'conduction current', definition: 'The ordinary current of Chapters 3 and 5 — actual charge moving through a conductor. Written $ i_c $ once displacement current is in play, to keep the two apart.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Page 1 left a law contradicting itself, and the contradiction lives in exactly one place: the gap between the plates, where the conduction current stops.\n\nSo look hard at that gap while the capacitor charges.\n\nNo charge crosses it. No wire runs through it. In the simplest case there is nothing in it at all — vacuum.\n\nAnd yet something in that gap is unmistakably **changing**, second by second, for as long as the charging lasts. What is it?',
      hint: 'Charge is piling up on the plates at $ i $ coulombs every second. What do charged plates produce in the space between them — and is that staying the same while the charge grows?',
      reveal: '**The electric field in the gap is growing.**\n\nFrom Chapter 2, a parallel-plate capacitor with charge $ q $ on its plates has a uniform field $ E = \\frac{q}{\\varepsilon_0 A} $ between them. While the capacitor charges, $ q $ grows, so $ E $ grows with it — at a rate fixed by the very same current that is arriving in the wire.\n\nMaxwell\'s leap, in 1861, was to take that seriously. Where the current stops, a **changing electric field** takes over — and it makes a magnetic field just as a current does.\n\nWhat is striking is *why* he said it. Nobody had measured a magnetic field between capacitor plates; there was no experiment demanding the extra term. He added it because the law was inconsistent without it, and because with it the inconsistency vanishes exactly, with nothing left over.\n\nThat is a rare thing in physics: a discovery forced not by a measurement, but by arithmetic that refused to add up.',
    }),
    b('text', 1, {
      markdown: 'The plan of this page is short. First find how fast the electric flux in the gap is growing. Then show that $ \\varepsilon_0 $ times that rate comes out **exactly equal** to the current in the wires — not roughly, not in some limit, but identically. Then put it into Ampère\'s law and watch the contradiction close.',
    }),
    b('heading', 2, {
      text: 'What is growing in the gap',
      level: 2,
      objective: 'Show that the electric flux between the plates grows at a rate fixed entirely by the charging current.',
    }),
    b('text', 3, {
      markdown: 'Everything needed here is from Chapter 2, so nothing new is being assumed.\n\nA parallel-plate capacitor with charge $ q $ spread over plates of area $ A $ has surface charge density $ \\sigma = \\frac{q}{A} $, and the field between the plates is uniform:\n\n$ E = \\frac{\\sigma}{\\varepsilon_0} = \\frac{q}{\\varepsilon_0 A} $\n\nNow take that bag-shaped surface from page 1 — the one that passes between the plates — and ask for the **electric flux** through it. The field is confined to the gap and is perpendicular to the plates, so the flux is simply field times area:\n\n$ \\Phi_E = EA = \\frac{q}{\\varepsilon_0 A}\\times A = \\frac{q}{\\varepsilon_0} $\n\nRead that result carefully, because it is the whole trick. **The plate area has cancelled.** The electric flux through the gap does not depend on how big the plates are, or how far apart they are, or on anything geometrical at all. It depends only on the charge sitting on the plates.\n\nAnd that charge is growing at the rate the wire delivers it — which is the conduction current $ i_c $.',
    }),
    b('latex_block', 4, {
      latex: 'i_d = \\varepsilon_0\\,\\frac{d\\Phi_E}{dt}',
      label: 'Displacement current',
      note: 'Maxwell\'s name for it, and a slightly unfortunate one — nothing is displaced and nothing flows. It is a **changing electric flux**, measured in amperes because that is the company it keeps.',
      highlight: true,
    }),
    b('step_solver', 5, {
      title: 'Showing that $ i_d $ equals the conduction current — exactly',
      problem: 'A parallel-plate capacitor of plate area $ A $ is charged by a conduction current $ i_c $ in the wires. Show that the displacement current between the plates, $ i_d = \\varepsilon_0\\frac{d\\Phi_E}{dt} $, is exactly equal to $ i_c $.',
      intro: 'Four short steps, and the only physics used is the parallel-plate field from Chapter 2. Watch the plate area appear and then disappear — that cancellation is what makes the result exact rather than approximate.',
      steps: [
        st('The field between the plates: $ E = \\frac{\\sigma}{\\varepsilon_0} = \\frac{q}{\\varepsilon_0 A} $',
          'Chapter 2, unchanged. The field of a charged parallel-plate capacitor is uniform in the gap and set by the charge per unit area on the plates.', {
            check: {
              kind: 'mcq',
              prompt: 'If the charge on the plates doubles while the plate area stays the same, the field in the gap',
              options: ['halves', 'doubles', 'stays the same', 'falls to zero'],
              answer_index: 1,
              feedback_right: 'Yes — $ E $ is proportional to $ q $ for fixed plate area, so doubling the charge doubles the field.',
              feedback_wrong: 'Look at $ E = \\frac{q}{\\varepsilon_0 A} $ . With $ A $ fixed, $ E $ rises in direct proportion to $ q $, so twice the charge gives twice the field.',
            },
          }),
        st('The electric flux through a surface crossing the gap: $ \\Phi_E = EA = \\frac{q}{\\varepsilon_0} $',
          'The field is perpendicular to the plates and covers the whole plate area, so the flux is $ E $ times $ A $. The $ A $ in the numerator cancels the $ A $ in the denominator of $ E $ — and the geometry drops out of the problem entirely.', {
            check: {
              kind: 'mcq',
              prompt: 'The plates are replaced by ones of twice the area, carrying the same charge $ q $. The electric flux through the gap is now',
              options: ['twice as large as before', 'half as large as before', 'exactly the same as before', 'four times as large as before'],
              answer_index: 2,
              feedback_right: 'Exactly — the field halves and the area doubles, so the flux $ \\Phi_E = \\frac{q}{\\varepsilon_0} $ is untouched.',
              feedback_wrong: 'Bigger plates spread the same charge more thinly, so $ E $ halves — but the flux is collected over twice the area. The two effects cancel and $ \\Phi_E = \\frac{q}{\\varepsilon_0} $ depends on the charge alone.',
            },
          }),
        st('Differentiate: $ \\frac{d\\Phi_E}{dt} = \\frac{1}{\\varepsilon_0}\\frac{dq}{dt} $',
          'Only $ q $ is changing with time; $ \\varepsilon_0 $ is a constant of nature. And $ \\frac{dq}{dt} $ — the rate at which charge arrives on the plate — **is** the conduction current in the wire, since every coulomb that lands there came down the wire.', {
            check: {
              kind: 'mcq',
              prompt: 'What is $ \\frac{dq}{dt} $ , the rate at which charge accumulates on a plate?',
              options: ['the conduction current $ i_c $ in the wire', 'the voltage across the capacitor', 'the capacitance of the arrangement', 'the energy stored in the field'],
              answer_index: 0,
              feedback_right: 'Right — charge only reaches the plate through the wire, so the rate of accumulation is precisely the current in that wire.',
              feedback_wrong: 'Charge cannot appear on a plate from anywhere except the wire attached to it, so the rate at which it builds up is the current in that wire, $ i_c $.',
            },
          }),
        st('Therefore $ i_d = \\varepsilon_0\\frac{d\\Phi_E}{dt} = \\varepsilon_0\\cdot\\frac{i_c}{\\varepsilon_0} = i_c $',
          'The $ \\varepsilon_0 $ cancels and the two are identical. Not approximately equal, not equal in some limit — **equal**. The displacement current in the gap is the conduction current in the wire, carried on by other means.'),
      ],
      now_you_try: {
        problem: 'The same capacitor is charged by the same steady current $ i_c $, but the plates are moved twice as far apart before charging begins. What happens to $ E $, to $ \\Phi_E $ and to $ i_d $?',
        answer: '$ E $ is unchanged, $ \\Phi_E $ is unchanged, and $ i_d $ is unchanged and still equal to $ i_c $.',
        solution: 'This one catches almost everybody, because separation feels as though it must matter.\n\n$ E = \\frac{q}{\\varepsilon_0 A} $ has **no $ d $ in it**. The field of a parallel-plate capacitor is set by the charge per unit area, not by the gap width — pulling the plates apart raises the *voltage* ($ V = Ed $ ) but leaves the field alone.\n\nSo $ \\Phi_E = \\frac{q}{\\varepsilon_0} $ is unchanged, and $ i_d = \\frac{dq}{dt} = i_c $ is unchanged.\n\n**And there is a much stronger reason it had to come out this way.** If $ i_d $ depended on the geometry, then the bag-shaped surface would give one answer and the flat disc another, and page 1\'s contradiction would come straight back. The equality $ i_d = i_c $ is forced by consistency; the parallel-plate arithmetic is just how we check it.',
      },
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'The plates of a charging capacitor are slowly pulled further apart while the charging current is held at the same value. What happens to the displacement current between them?',
      options: [
        'It falls, because the same field is now spread across a longer gap',
        'It rises, because the capacitance of the arrangement has dropped',
        'It becomes zero, since the gap can no longer support a field',
        'It is unchanged, and still equal to the current in the wires',
      ],
      correct_index: 3,
      reveal: '**Unchanged, and still equal to the current in the wires.**\n\nRun it through the algebra. The field between the plates is $ E = \\frac{q}{\\varepsilon_0 A} $, which contains no separation. The flux is $ \\Phi_E = \\frac{q}{\\varepsilon_0} $, which contains no geometry at all. So $ i_d = \\frac{dq}{dt} = i_c $, whatever the plates are doing.\n\nIt is true that the capacitance falls as the gap widens — $ C = \\frac{\\varepsilon_0 A}{d} $ from Chapter 2 — and the voltage rises to match. Neither of those changes the flux, because $ \\Phi_E $ tracks the **charge**, and the charge is being delivered at the same rate as before.\n\n**The deeper reason, which is worth more than the algebra.** Suppose $ i_d $ *did* depend on the plate separation. Then the bag-shaped surface would report a different current from the flat disc, and Ampère\'s law would go straight back to giving two answers. The equality $ i_d = i_c $ is not a lucky feature of parallel plates; it is what the repair is *for*. Any geometry that broke it would break the law again.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'The Ampère–Maxwell law',
      level: 2,
      objective: 'State the repaired law and check that it now gives one answer for both surfaces.',
    }),
    b('latex_block', 8, {
      latex: '\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0\\left(i_c + i_d\\right) = \\mu_0 i_c + \\mu_0\\varepsilon_0\\frac{d\\Phi_E}{dt}',
      label: 'The Ampère–Maxwell law',
      note: 'The only change from Chapter 5 is the second term. Everywhere a steady current flows and no field is changing, it is zero and the old law is recovered untouched.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'Now take the repaired law back to page 1\'s two surfaces and see what it does.\n\n**The flat disc, pierced by the wire.** The conduction current through it is $ i_c = i $. What about the electric flux? The field of a charged capacitor is bottled up between its plates; out here in the open, next to a wire, there is essentially none. So $ \\frac{d\\Phi_E}{dt} \\approx 0 $ and $ i_d \\approx 0 $. Total: $ \\mu_0 i $.\n\n**The bag through the gap.** No charge crosses it, so $ i_c = 0 $. But it passes right through the region where the field is growing, so it collects the whole displacement current: $ i_d = i $. Total: $ \\mu_0 i $.\n\n**The same answer.** Not reconciled by an extra rule, not averaged, not approximated — the two surfaces now agree because the sum $ i_c + i_d $ is the same through every surface you can hang on that loop. Where the conduction current stops, the displacement current picks it up at exactly the same value, and the total never has a gap in it.\n\n**And notice what has been rescued along the way.** Kirchhoff\'s junction rule from Chapter 3 says current in equals current out. In a capacitor circuit, the conduction current appears to vanish at the plate, which always looked like a small embarrassment. It is not: the current that never vanishes is $ i_c + i_d $, continuous from one end of the circuit to the other and straight across the empty gap. The junction rule survives, applied to the right quantity.',
    }),
    b('table', 10, {
      caption: 'Page 1\'s contradiction, run again with the Ampère–Maxwell law. Read the last column first.',
      headers: ['Surface hung on the loop', 'Conduction current $ i_c $', 'Displacement current $ i_d $', 'Total $ \\mu_0(i_c + i_d) $'],
      rows: [
        ['flat disc, pierced by the wire', '$ i $', '$ 0 $', '$ \\mu_0 i $'],
        ['bag passing between the plates', '$ 0 $', '$ i $', '$ \\mu_0 i $'],
        ['bag that clips the plate edge', 'part of $ i $', 'the rest of $ i $', '$ \\mu_0 i $'],
      ],
    }),
    b('worked_example', 11, {
      label: 'the magnetic field inside a charging capacitor',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A parallel-plate capacitor has circular plates of radius $ R = 6.0 $ cm and is being charged by a steady current of $ 2.0 $ A. Find (a) the displacement current between the plates, (b) the rate at which the electric field between them is changing, and (c) the magnetic field at a point between the plates, $ 3.0 $ cm from the axis. Take $ \\varepsilon_0 = 8.85\\times10^{-12} $ in SI units.',
      solution: '**(a) The displacement current.** No work needed — it equals the conduction current:\n\n$ i_d = i_c = 2.0\\ \\text{A} $\n\n**(b) The rate of change of the field.** Write the displacement current in terms of $ E $ directly. Since $ \\Phi_E = EA $ with $ A $ fixed,\n\n$ i_d = \\varepsilon_0 A\\frac{dE}{dt} \\quad\\Rightarrow\\quad \\frac{dE}{dt} = \\frac{i_d}{\\varepsilon_0 A} $\n\nThe plate area is $ A = \\pi R^{2} = \\pi(0.060)^{2} = 1.13\\times10^{-2}\\ \\text{m}^{2} $, so\n\n$ \\frac{dE}{dt} = \\frac{2.0}{(8.85\\times10^{-12})(1.13\\times10^{-2})} = \\frac{2.0}{1.00\\times10^{-13}} = 2.0\\times10^{13}\\ \\text{V m}^{-1}\\text{s}^{-1} $\n\nAn enormous number, and it should be — a field of a few thousand volts per metre is built in well under a microsecond.\n\n**(c) The magnetic field between the plates.** Here is the point of the whole page: **there is one**, and the repaired law computes it.\n\nDraw a circular loop of radius $ r = 3.0 $ cm between the plates, centred on the axis. The displacement current is spread evenly over the plate area, so the fraction of it inside our loop goes as the area ratio:\n\n$ i_{d,enc} = i_d\\frac{r^{2}}{R^{2}} = 2.0\\times\\frac{(3.0)^{2}}{(6.0)^{2}} = 2.0\\times\\frac{1}{4} = 0.50\\ \\text{A} $\n\nNo conduction current crosses this loop at all, so the Ampère–Maxwell law gives\n\n$ B(2\\pi r) = \\mu_0 i_{d,enc} $\n\n$ B = \\frac{\\mu_0 i_{d,enc}}{2\\pi r} = \\frac{(2\\times10^{-7})(0.50)}{0.030} = 3.3\\times10^{-6}\\ \\text{T} $\n\n**Why this answer matters more than the arithmetic.** Ampère\'s original law says the field here is zero — no current, no field. The repaired law says $ 3.3 $ microtesla, in circles round the axis, in a region containing nothing but vacuum and a growing electric field.\n\nThat is a **prediction**, and it can be checked. It has been, many times over, and the measured field is the one on this page. Maxwell\'s extra term is not bookkeeping to tidy up a proof. It describes something that is actually there.',
    }),
    b('image', 12, {
      src: '',
      alt: 'The gap between capacitor plates showing a growing electric field and the circular magnetic field loops it produces',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'No charge crosses the gap. The growing electric field makes the magnetic field instead.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, drawn in three-quarter perspective. Two circular capacitor plates drawn as amber ellipses face each other with a wide empty gap between them; a warm amber wire enters the left plate and leaves the right plate with small orange arrowheads showing current. Between the plates, a set of straight bright-orange arrows runs from the left plate to the right plate to represent the electric field, drawn with a soft glow and a small upward-pointing growth indicator to suggest the field is increasing. Wrapped around the axis, midway between the plates, two concentric cool-violet circles drawn in perspective with small arrowheads represent the circular magnetic field, one circle of small radius and one larger. A faint dashed grey circle marks an Ampèrean loop of radius r between the plates. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Chapter 7 taught you that a capacitor **passes AC** and blocks DC, with a reactance $ X_C = \\frac{1}{\\omega C} $ that falls as the frequency rises. It is one of the most-used facts in all of electronics, and at the time it was stated without ever explaining what physically crosses the gap.\n\nNow you know: **nothing does**. Not one electron makes the jump. What crosses is a displacement current — an electric field that grows, collapses, reverses and grows the other way, over and over, driven by the source. The circuit behaves as though a current flows straight through, because as far as magnetism and the junction rule are concerned, one does.\n\nThat is also how the screen you are reading this on knows where your finger is. A capacitive touchscreen is a grid of tiny capacitors with an AC signal running through them. Your fingertip is conducting and earthed, so bringing it near changes the field pattern of the capacitor beneath it — and the controller detects the changed displacement current. It is not detecting pressure. It is detecting a change in $ \\frac{d\\Phi_E}{dt} $ at one point of a grid, thousands of times a second.\n\nA term Maxwell added in 1861 to stop an equation contradicting itself is what makes a phone respond to a fingertip.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art, two vignettes side by side. Left vignette: a simple AC circuit drawn in warm amber with a sine-wave source symbol and a capacitor, with small orange arrows in the wires reversing direction, and between the capacitor plates a set of orange field arrows shown twice in ghosted form pointing opposite ways to suggest reversal. Right vignette: a cutaway of a touchscreen drawn as a flat grid of fine amber lines seen in perspective, with a simple grey outline of a fingertip approaching one intersection, and at that intersection a small cluster of orange field lines bending towards the finger, with one grid node highlighted in bright amber. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ i_d = \\varepsilon_0\\frac{d\\Phi_E}{dt} $ — the **displacement current**. Nothing flows and nothing is displaced; it is a changing electric flux.\n- Between the plates, $ \\Phi_E = \\frac{q}{\\varepsilon_0} $ — the plate area cancels, so **no geometry survives**.\n- Differentiating gives $ i_d = \\frac{dq}{dt} = i_c $ **exactly**, for any plate size and any separation.\n- $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0(i_c + i_d) $ — the **Ampère–Maxwell law**. Chapter 5\'s law is the special case $ i_d = 0 $.\n- Every surface bounded by the loop now gives $ \\mu_0 i $, so the contradiction of page 1 is gone.\n- The junction rule survives: it is $ i_c + i_d $ that is continuous, and it never stops anywhere.\n- Between the plates there really is a magnetic field, of size $ B = \\frac{\\mu_0 i_d r}{2\\pi R^{2}} $ inside the plate radius — a prediction, and a confirmed one.',
    }),
    b('text', 15, {
      markdown: 'Next: with Ampère\'s law repaired, the set of laws describing electricity and magnetism is finally complete — and it turns out to be short enough to fit on one page.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The displacement current between the plates of a charging capacitor is',
          ['$ \\varepsilon_0\\frac{d\\Phi_E}{dt} $', '$ \\mu_0\\frac{d\\Phi_B}{dt} $', '$ \\varepsilon_0\\frac{dB}{dt} $', '$ \\mu_0\\varepsilon_0\\frac{dq}{dt} $'],
          0,
          'The extra term Maxwell added is $ \\varepsilon_0 $ times the rate of change of the **electric** flux. A changing magnetic flux belongs to Faraday\'s law, which is a different equation entirely.',
          1),
        q('For a parallel-plate capacitor being charged by a current $ i_c $, the displacement current $ i_d $ between the plates is',
          ['exactly equal to $ i_c $', 'much smaller than $ i_c $', 'equal to $ i_c $ only for large plates', 'zero, since the gap is empty'],
          0,
          'Because $ \\Phi_E = \\frac{q}{\\varepsilon_0} $ contains no geometry, differentiating gives $ i_d = \\frac{dq}{dt} $, which is the current arriving in the wire. Plate size and separation drop out completely, so the equality is exact.',
          2),
        q('The Ampère–Maxwell law repairs Ampère\'s law by making sure that',
          ['every surface bounded by the loop gives the same answer', 'the magnetic field is always larger than before', 'currents are only ever counted through flat surfaces', 'the field between capacitor plates comes out as zero'],
          0,
          'Where the conduction current stops, the displacement current takes over at exactly the same value, so the total is continuous and one loop now has one circulation. The field between the plates is not zero — it is what the new term predicts.',
          3),
      ],
    }),
  ],
};

// ── p3 · Maxwell's Four Equations ────────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'emw-maxwells-four-equations',
  title: 'Maxwell\'s Four Equations',
  subtitle: 'Everything in this book, on one page',
  glossary: [
    { term: 'Maxwell\'s equations', definition: 'The four laws that between them describe all of electricity and magnetism: Gauss\'s law, Gauss\'s law for magnetism, Faraday\'s law, and the Ampère–Maxwell law.' },
    { term: 'magnetic monopole', definition: 'A hypothetical isolated magnetic north or south pole. None has ever been found, which is why $ \\oint\\vec{B}\\cdot d\\vec{A} = 0 $.' },
    { term: 'circulation', definition: 'The line integral of a field round a closed loop, $ \\oint\\vec{F}\\cdot d\\vec{l} $ — how much the field "goes round" rather than how much of it passes through.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Maxwell never wrote "Maxwell\'s equations".\n\nIn his 1865 paper he set out **twenty** equations in twenty unknowns, written out component by component, and almost nobody could read them. They were correct and they were nearly unusable.\n\nTwenty years later **Oliver Heaviside** — a self-taught telegraph operator from Camden Town who left school at sixteen, never attended a university, and did most of his work in a back room of his parents\' house — rewrote the whole thing in the language of vectors and squeezed twenty equations into four.\n\nEvery physicist since has learned Heaviside\'s four. He was paid nothing for it and elected to no chair.\n\nThose four are on this page, and here is the part worth sitting with before you scroll: **you have already met every single one of them.** Not a simplified version. The actual equations. This page adds no new physics at all — it only puts them side by side, which turns out to be the most important thing anyone has ever done with them.',
    }),
    b('heading', 1, {
      text: 'The four laws, and where you met each one',
      level: 2,
      objective: 'State each of Maxwell\'s four equations, read it aloud in plain words, and name the chapter of this book it came from.',
    }),
    b('text', 2, {
      markdown: 'One reading note before the equations, because the same symbol is doing two different jobs.\n\nTwo of the four are about a closed **surface** — imagine a sealed bag, and ask how much field pokes out through its skin. That is a **flux** law, and it answers the question *what does this field come out of?*\n\nThe other two are about a closed **loop** — imagine a ring, and travel all the way round it adding up the field along your path. That is a **circulation** law, and it answers the question *what makes this field go round in circles?*\n\nBoth are written with $ \\oint $, the integral sign with a ring on it, which just means "all the way round a closed thing". Whether that closed thing is a bag or a ring is told you by what follows: $ d\\vec{A} $ is a patch of surface, $ d\\vec{l} $ is a step along a curve.\n\nHere are the two flux laws first.',
    }),
    b('latex_block', 3, {
      latex: '\\oint \\vec{E}\\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0}',
      label: '1 · Gauss\'s law for electricity — from Chapter 1',
      note: 'A flux law, over a closed surface. Electric field lines start and stop on charge, so counting the charge sealed inside a bag tells you the field flux out through its skin.',
      highlight: true,
    }),
    b('latex_block', 4, {
      latex: '\\oint \\vec{B}\\cdot d\\vec{A} = 0',
      label: '2 · Gauss\'s law for magnetism — from Chapter 4',
      note: 'The same flux law for magnetism, with zero on the right. There is no magnetic charge for field lines to start or stop on — which is why cutting a bar magnet in half never gives you a lone pole.',
      highlight: true,
    }),
    b('text', 5, {
      markdown: 'Read those two aloud and they say something you have known since Chapter 4, now stated as sharply as it can be.\n\n**The first says electric charge exists.** Seal a region off with an imaginary bag. If there is net charge inside, field lines must poke out through the skin, and the total that pokes out is fixed exactly by how much charge is in there — never by where it sits or what shape the bag is. Electric field lines **begin and end** on charge.\n\n**The second says magnetic charge does not exist.** Do the same with a magnetic field and the answer is always zero — not small, not usually zero, but exactly zero, for every bag, everywhere, always. Every magnetic field line that enters a closed surface comes out again somewhere else, because magnetic field lines have no beginning and no end. They close on themselves.\n\nThat single zero is why a magnet always has two poles, why breaking one in half gives you two complete magnets, and why the "magnetic charge" that would make electricity and magnetism perfectly symmetric has never been found.\n\nNow the two circulation laws — and these are the pair that will make a wave.',
    }),
    b('latex_block', 6, {
      latex: '\\oint \\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt}',
      label: '3 · Faraday\'s law of induction — from Chapter 6',
      note: 'The familiar $ \\varepsilon = -\\frac{d\\Phi_B}{dt} $, written for a field rather than for a circuit. The emf round a loop **is** the circulation of $ \\vec{E} $ round it, whether or not any wire is there.',
      highlight: true,
    }),
    b('latex_block', 7, {
      latex: '\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0 i_c + \\mu_0\\varepsilon_0\\frac{d\\Phi_E}{dt}',
      label: '4 · The Ampère–Maxwell law — from Chapter 5, repaired on page 2',
      note: 'Chapter 5 gave you the first term. Page 2 was forced to add the second. That second term is the only piece of new physics in this entire chapter.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'Read this pair aloud too, because their wording is almost identical and that is the whole point.\n\n**Faraday\'s law says a changing magnetic field makes an electric field go round in circles.** Note what it does *not* say: it does not mention a coil, a wire or a circuit. Chapter 6 wrote it as an emf because there was always a loop of wire to measure it with, but the law is about space itself. Change $ \\vec{B} $ in an empty region and an electric field appears there, circling the change, wire or no wire.\n\n**The Ampère–Maxwell law says a current makes a magnetic field go round in circles — and so does a changing electric field.** The first half is Chapter 5, Oersted\'s compass and the straight wire. The second half is page 2, and it makes the two laws mirror images of each other.\n\nSo the four together say: charge makes $ \\vec{E} $; nothing makes $ \\vec{B} $ the same way; a changing $ \\vec{B} $ makes a circulating $ \\vec{E} $; a changing $ \\vec{E} $ makes a circulating $ \\vec{B} $.\n\nThat is all of electricity and magnetism. Everything in Chapters 1 to 7 — every field, every circuit, every motor, every transformer — is a consequence of those four lines.',
    }),
    b('table', 9, {
      caption: 'The four, with what each one actually says and where in this book you met it.',
      headers: ['The equation', 'What it says, in plain words', 'Where you met it'],
      rows: [
        ['$ \\oint\\vec{E}\\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0} $', 'Electric field lines begin and end on charge. Count the charge sealed inside a closed surface and you know the electric flux out of it.', '**Chapter 1** — Gauss\'s law and flux'],
        ['$ \\oint\\vec{B}\\cdot d\\vec{A} = 0 $', 'Magnetic field lines never begin or end. Every line that enters a closed surface leaves it again. There is no magnetic charge.', '**Chapter 4** — no isolated poles'],
        ['$ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt} $', 'A changing magnetic flux drives an electric field round a loop, wire or no wire. The minus sign is Lenz\'s law.', '**Chapter 6** — Faraday\'s law'],
        ['$ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 i_c + \\mu_0\\varepsilon_0\\frac{d\\Phi_E}{dt} $', 'A magnetic field circles round a current — and equally round a changing electric field.', '**Chapter 5**, repaired on **page 2** of this chapter'],
      ],
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'Tomorrow morning an experiment finds an isolated magnetic north pole — a magnetic monopole, with no south pole attached. Which of Maxwell\'s four equations would have to be rewritten?',
      options: [
        'Faraday\'s law, since a moving monopole would induce a field',
        'Gauss\'s law for magnetism, whose right-hand side is a zero',
        'The Ampère–Maxwell law, since a monopole acts like a current',
        'All four, because they are only meaningful taken together',
      ],
      correct_index: 1,
      reveal: '**Gauss\'s law for magnetism.** Its right-hand side is a zero, and that zero is a *measurement*, not a theorem.\n\n$ \\oint\\vec{B}\\cdot d\\vec{A} = 0 $ is the equation whose entire content is "there is no magnetic charge". Find one, and the zero would be replaced by the enclosed magnetic charge divided by a constant — exactly mirroring the electric law two lines above it. Nothing else in the set mentions magnetic charge at all, so nothing else would need touching.\n\n**Why this is worth thinking about rather than dismissing.** In 1931 Paul Dirac showed that if a *single* magnetic monopole existed anywhere in the universe, it would explain something otherwise unexplained: why electric charge comes in exact multiples of one basic amount, and never in between. One monopole, somewhere, would account for the quantisation of every charge everywhere.\n\nSo people look. Searches have run through deep mines, cosmic-ray detectors and particle accelerators for the best part of a century, and none has found anything. The zero has held for a hundred and sixty years.\n\nWhich is exactly why it is written as a zero and not as an approximation. **In this set of four, the numbers on the right-hand sides are experimental facts.**',
      difficulty_level: 2,
    }),
    b('step_solver', 11, {
      title: 'All four laws, on one apparatus',
      problem: 'A parallel-plate capacitor has circular plates of radius $ R = 5.0 $ cm and is being charged by a **steady** current of $ 0.60 $ A. At one instant the inner face of the positive plate carries a surface charge density $ \\sigma = 8.85\\times10^{-6} $ C m⁻². Working from the four equations alone, find (1) the electric field in the gap, (2) the magnetic flux out of a closed surface drawn in the gap, (3) the magnetic field at a point $ 2.0 $ cm from the axis, midway between the plates, and (4) the circulation of $ \\vec{E} $ round a loop in the gap. Take $ \\varepsilon_0 = 8.85\\times10^{-12} $ in SI units.',
      intro: 'One apparatus, four questions — and each question is answered by a different one of the four equations above. Nothing new is used anywhere in this; every line comes from a chapter you have already finished. If the claim that you already own all four is true, then you can do this right now, and the point of the exercise is to find out.',
      steps: [
        st('**Gauss\'s law, Chapter 1** · $ E = \\frac{\\sigma}{\\varepsilon_0} = 1.0\\times10^{6} $ V m⁻¹',
          'Take a short cylinder — a pillbox — with one flat face of area $ a $ buried inside the metal of the plate and the other face out in the gap. Inside the metal the field is zero, so that face contributes no flux. The curved side runs along the field lines rather than across them, so it contributes none either. Only the face in the gap counts, and it gives $ Ea $ . The charge sealed inside the pillbox is $ \\sigma a $ . So Gauss\'s law reads $ Ea = \\frac{\\sigma a}{\\varepsilon_0} $ , the area cancels, and $ E = \\frac{8.85\\times10^{-6}}{8.85\\times10^{-12}} = 1.0\\times10^{6} $ V m⁻¹.', {
            check: {
              kind: 'mcq',
              prompt: 'One face of the pillbox lies inside the metal of the plate. Why does that face contribute nothing?',
              options: ['the electric field inside the metal is zero', 'that face lies parallel to the field lines', 'its flux is cancelled by the curved side', 'the charge sits only on the outer face'],
              answer_index: 0,
              feedback_right: 'Yes — a conductor in equilibrium carries no field inside it, so no field lines cross that face at all.',
              feedback_wrong: 'A conductor in equilibrium has no electric field inside it. With $ E = 0 $ there, nothing crosses that face. The curved side contributes nothing for a different reason — it runs along the lines rather than across them.',
            },
          }),
        st('**Gauss\'s law for magnetism, Chapter 4** · $ \\oint\\vec{B}\\cdot d\\vec{A} = 0 $',
          'That holds for the pillbox of step 1, and for every other closed surface you could draw in the gap. This is the shortest piece of work in the chapter, and it is worth doing precisely because there is no arithmetic in it. There **is** a magnetic field in that gap — step 3 is about to find it — and yet the net magnetic flux out of any sealed surface drawn around any part of it is exactly zero. The lines are closed circles; every one that enters your pillbox leaves it again somewhere else. The equation has no number on its right-hand side because there is nothing for it to count.', {
            check: {
              kind: 'mcq',
              prompt: 'A closed surface is drawn in the gap, in a region where the magnetic field is certainly not zero. The magnetic flux out of it is',
              options: ['zero, because the field lines have no ends', 'not zero, since the field there is not zero', 'zero only when the surface is a sphere', 'equal to the current sealed inside it'],
              answer_index: 0,
              feedback_right: 'Exactly — a field can be strong at every point of a surface and still have zero net flux out of it, so long as its lines close on themselves.',
              feedback_wrong: 'Flux out of a closed surface counts what **ends** inside it, not how strong the field is on it. Magnetic lines are closed loops with no ends, so whatever goes in comes out again — whatever the shape of the surface.',
            },
          }),
        st('**Ampère–Maxwell, Chapter 5 + page 2** · $ B = \\frac{\\mu_0 i_d r}{2\\pi R^{2}} = 9.6\\times10^{-7} $ T',
          'No charge crosses the gap, so the conduction term is zero and only Maxwell\'s term survives. The displacement current in there equals the charging current, $ 0.60 $ A, and it is spread evenly across the plate face — so a circle of radius $ 2.0 $ cm catches the area fraction $ \\frac{r^{2}}{R^{2}} = 0.16 $ of it, which is $ i_{d,enc} = 0.096 $ A. After that the law is used exactly as Chapter 5 used it round a wire: by symmetry $ \\oint\\vec{B}\\cdot d\\vec{l} = B(2\\pi r) $ , so $ B = \\frac{(2\\times10^{-7})(0.096)}{0.020} = 9.6\\times10^{-7} $ T.', {
            check: {
              kind: 'mcq',
              prompt: 'What fraction of the displacement current threads a circle of radius $ 2.0 $ cm, when the plates have radius $ 5.0 $ cm?',
              options: ['$ 0.16 $', '$ 0.40 $', '$ 0.60 $', '$ 0.04 $'],
              answer_index: 0,
              feedback_right: 'Right — the current is spread over an area, so the fraction caught is $ \\frac{r^{2}}{R^{2}} = \\frac{4}{25} = 0.16 $ .',
              feedback_wrong: 'The displacement current is spread over the plate **area**, not along a line, so the fraction a loop catches is the ratio of areas: $ \\frac{r^{2}}{R^{2}} = \\frac{(2.0)^{2}}{(5.0)^{2}} = 0.16 $ . Taking $ \\frac{r}{R} = 0.40 $ instead is the usual slip.',
            },
          }),
        st('**Faraday\'s law, Chapter 6** · $ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt} = 0 $',
          'The charging current is steady, so the $ B $ of step 3 does not change with time, and the right-hand side is zero. This is the one law that stays silent here, and noticing *why* is the whole point of the step.\n\nThe electric field in the gap is certainly growing — that growth is what produced the magnetic field in the first place. But the magnetic field itself is **steady**, because the current feeding it is steady. Faraday\'s law responds to nothing except a changing $ \\vec{B} $ , so it gives zero: the electric field in the gap grows, but it does not circulate.\n\nNow change one single thing. Feed the capacitor from an AC source instead, so the current rises and falls. The magnetic field rises and falls with it, Faraday wakes up, and the circulating electric field it makes is itself changing — which hands the problem straight back to Ampère–Maxwell. That handoff is the next section of this page, and it is where a wave comes from.', {
            check: {
              kind: 'mcq',
              prompt: 'Faraday\'s law gives zero round a loop in this gap because',
              options: ['the magnetic field there does not change in time', 'there is no magnetic field anywhere in the gap', 'no wire loop has been placed there to carry it', 'the electric field in the gap is not changing'],
              answer_index: 0,
              feedback_right: 'Yes — the charging current is steady, so $ \\vec{B} $ is steady, so $ \\frac{d\\Phi_B}{dt} = 0 $ .',
              feedback_wrong: 'There **is** a magnetic field in the gap — step 3 worked it out — and the electric field in there is certainly growing. What is not happening is a change in the **magnetic** field, because the current making it is steady. Faraday\'s law reacts to nothing else, and it needs no wire: it is a statement about space itself.',
            },
          }),
      ],
      now_you_try: {
        problem: 'Same capacitor, same instant, same $ 0.60 $ A. Find the magnetic field at a point $ 8.0 $ cm from the axis — that is, out beyond the rim of the plates.',
        answer: '$ B = 1.5\\times10^{-6} $ T.',
        solution: 'Beyond the rim, a loop encloses the **whole** displacement current rather than a fraction of it, so the $ \\frac{r^{2}}{R^{2}} $ factor disappears:\n\n$ B = \\frac{\\mu_0 i_d}{2\\pi r} = \\frac{(2\\times10^{-7})(0.60)}{0.080} = 1.5\\times10^{-6}\\ \\text{T} $\n\n**Now look at the shape of that formula.** It is $ \\frac{\\mu_0 i}{2\\pi r} $ — Chapter 5\'s field round a long straight wire, unchanged. Stand outside the capacitor and the empty gap is magnetically indistinguishable from a wire carrying $ 0.60 $ A. Inside the plate radius the field climbs in proportion to $ r $ ; outside it falls as $ \\frac{1}{r} $ ; and the two agree at the rim, where both give $ 2.4\\times10^{-6} $ T.',
      },
    }),
    b('heading', 12, {
      text: 'What the four say together',
      level: 2,
      objective: 'Explain how Faraday\'s law and the Ampère–Maxwell law feed each other, and why that already hints at a wave.',
    }),
    b('text', 13, {
      markdown: 'Now do something the four equations invite and nobody had done before Maxwell. **Take all the charge and all the current away.**\n\nGo out into empty space, far from any wire and any charge. Set $ q_{enc} = 0 $ and $ i_c = 0 $. Two of the four equations become statements that nothing starts or ends anywhere, and the interesting pair is what remains:\n\n$ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt} $ — a changing $ \\vec{B} $ makes a circulating $ \\vec{E} $.\n\n$ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0\\varepsilon_0\\frac{d\\Phi_E}{dt} $ — a changing $ \\vec{E} $ makes a circulating $ \\vec{B} $.\n\nRead those two as a pair and something ought to make you sit up. **Each one produces exactly the ingredient the other one needs.**\n\nSuppose a magnetic field somewhere in empty space starts changing. Faraday says an electric field appears, circling it. That new electric field is itself changing — it grew from nothing, after all. So Ampère–Maxwell says a magnetic field appears, circling *that*. Which is changing too. Which makes another electric field. And so on, with no charge, no wire and no battery anywhere in the story.\n\n**Before page 2 this could not have happened.** Chapter 5\'s Ampère law had no $ \\frac{d\\Phi_E}{dt} $ term in it, so the chain died at the first step: a changing $ \\vec{B} $ made an $ \\vec{E} $, and then nothing. The term Maxwell added purely to stop an equation contradicting itself is precisely the term that closes the loop.\n\nSo these four equations describe something that can keep itself going in empty space, needing nothing to sustain it, each field handing off to the other. A disturbance that travels and sustains itself is what we call a **wave** — and if it is a wave, it has a speed. The next page works out what that speed is.',
    }),
    b('image', 14, {
      src: '',
      alt: 'A diagram of the four Maxwell equations with the two circulation laws shown feeding into each other in a loop',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Two of the four feed each other. That closed handoff is what becomes a wave.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. Four slim rounded rectangles arranged in a two-by-two grid, each drawn with a thin amber border and holding a blank space where an equation would sit, each with a small muted white chapter tag beneath it. The two boxes on the right, representing the circulation laws, are joined by a pair of thick curved bright-orange arrows forming a continuous cycle between them, one arrow running from the upper box to the lower and one returning, with small amber labels beside each arrow. The two boxes on the left, representing the flux laws, are drawn slightly dimmer with no arrows, and a thin grey bracket groups them. To the far right of the cycle, a faint amber sinusoidal wave trails off the edge of the frame, suggesting what the cycle produces. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 15, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Four equations, and **you already had all four**. This page collected them; it derived nothing.\n- $ \\oint\\vec{E}\\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0} $ — **Gauss\'s law**, from **Chapter 1**. Electric field lines begin and end on charge.\n- $ \\oint\\vec{B}\\cdot d\\vec{A} = 0 $ — **Gauss\'s law for magnetism**, from **Chapter 4**. No magnetic charge; no isolated poles.\n- $ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt} $ — **Faraday\'s law**, from **Chapter 6**. A changing $ \\vec{B} $ makes a circulating $ \\vec{E} $.\n- $ \\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 i_c + \\mu_0\\varepsilon_0\\frac{d\\Phi_E}{dt} $ — the **Ampère–Maxwell law**, from **Chapter 5** plus page 2.\n- Two are **flux** laws over a closed surface ($ d\\vec{A} $ ); two are **circulation** laws round a closed loop ($ d\\vec{l} $ ).\n- In empty space the last two feed each other, and that handoff is only possible because of the term added on page 2.',
    }),
    b('text', 16, {
      markdown: 'Next: solve those two circulation laws together in empty space, put in the two numbers, and see what speed comes out. This is the page the whole book has been walking towards.',
    }),
    b('inline_quiz', 17, {
      pass_threshold: 0.6,
      questions: [
        q('The equation $ \\oint\\vec{B}\\cdot d\\vec{A} = 0 $ is the statement that',
          ['isolated magnetic poles do not exist', 'magnetic fields are always very weak', 'a magnetic field cannot do any work', 'magnetic flux is never able to change'],
          0,
          'A zero flux out of every closed surface means field lines never begin or end anywhere, so there is nothing for them to start on — no magnetic charge. Flux through an **open** surface changes all the time; that is what Faraday\'s law is about.',
          1),
        q('Which pair of Maxwell\'s equations feed each other in empty space to make a wave possible?',
          ['Faraday\'s law and the Ampère–Maxwell law', 'the two Gauss laws, for electricity and magnetism', 'Gauss\'s law and the Ampère–Maxwell law', 'Faraday\'s law and Gauss\'s law for magnetism'],
          0,
          'One says a changing magnetic field makes a circulating electric field; the other says a changing electric field makes a circulating magnetic field. Each supplies what the other needs, so the pair can sustain itself with no charge present.',
          2),
        q('The term $ \\mu_0\\varepsilon_0\\frac{d\\Phi_E}{dt} $ in the Ampère–Maxwell law was added because',
          ['the old law gave two answers for one loop', 'the magnetic field had been measured too small', 'Faraday\'s law needed a matching partner term', 'currents in wires were found to be discontinuous'],
          0,
          'Its origin is the contradiction on page 1 — one loop, two surfaces, two values. The symmetry it produces with Faraday\'s law is a magnificent bonus, but it was consistency, not beauty, that forced the term in.',
          3),
      ],
    }),
  ],
};

// ── p4 · Light ───────────────────────────────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'emw-light',
  title: 'Light',
  subtitle: 'A speed nobody put in',
  glossary: [
    { term: 'electromagnetic wave', definition: 'A self-sustaining disturbance of electric and magnetic fields travelling through space, needing no medium and no charges to keep it going.' },
    { term: 'speed of light in vacuum', definition: 'The constant $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} = 3.00\\times10^{8} $ m s⁻¹ — the speed of every electromagnetic wave in empty space, whatever its frequency.' },
    { term: 'permeability of free space', definition: 'The constant $ \\mu_0 = 4\\pi\\times10^{-7} $ in SI units, fixed by measuring the force between two current-carrying wires (Chapter 5).' },
    { term: 'permittivity of free space', definition: 'The constant $ \\varepsilon_0 = 8.854\\times10^{-12} $ in SI units, fixed by measuring forces between charges or the capacitance of a capacitor (Chapters 1 and 2).' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two numbers. Neither of them has anything to do with light.\n\n$ \\mu_0 = 4\\pi\\times10^{-7} $ — this one comes from hanging two long parallel wires side by side, running currents through them, and measuring the force between them with a balance. Chapter 5.\n\n$ \\varepsilon_0 = 8.854\\times10^{-12} $ — this one comes from putting charge on a pair of metal plates and measuring the voltage across them. Chapters 1 and 2.\n\nA bench, some wire, a battery, a balance, a voltmeter. No lamp, no mirror, no lens, nothing that glows, nothing optical anywhere in either experiment.\n\nNow work out $ \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $ and look at what falls out.',
      hint: 'Check the units first if you like: $ \\mu_0\\varepsilon_0 $ turns out to have the units of one over a speed squared. So the combination is a speed. The question is whose speed, and how electricity could possibly know it.',
      reveal: '$ \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} = 3.00\\times10^{8}\\ \\text{m s}^{-1} $\n\nThat is the speed of light.\n\nNot close to it. Not the same order of magnitude. **It** — to every decimal place either number was known to.\n\nStop and see how strange this is. Nobody put light into either measurement. One is a mechanical force between two wires. The other is charge on a plate. They were made by people studying electricity, decades apart, with no thought of optics at all, and the speed of light was sitting inside them the whole time.\n\nMaxwell saw it in 1862 and drew the only conclusion available: **light is an electromagnetic wave.** Not "behaves like one". Is one.\n\nThis is the best moment in this book, and the rest of the page is about earning it properly.',
    }),
    b('text', 1, {
      markdown: 'Here is what Maxwell actually did, and page 3 already put you one line away from it.\n\nGo out into empty space and set $ q_{enc} = 0 $ and $ i_c = 0 $. What is left is the pair of circulation laws that feed each other: a changing $ \\vec{B} $ makes a circulating $ \\vec{E} $, and a changing $ \\vec{E} $ makes a circulating $ \\vec{B} $.\n\nNow solve those two **together** — feed each into the other and see what a single field has to satisfy. What comes out is not a number. It is an equation, and it is an equation of a shape you already know.',
    }),
    b('latex_block', 2, {
      latex: '\\frac{\\partial^{2} E}{\\partial x^{2}} = \\mu_0\\varepsilon_0\\,\\frac{\\partial^{2} E}{\\partial t^{2}}',
      label: 'What Maxwell\'s equations give in empty space',
      note: 'The curly $ \\partial $ is new, and it means nothing alarming: it is the ordinary $ d $ with one extra instruction attached. Here $ E $ depends on **two** things — where you are, $ x $, and when you look, $ t $ — so $ \\frac{\\partial E}{\\partial x} $ means "differentiate with respect to $ x $, holding $ t $ fixed", and $ \\frac{\\partial E}{\\partial t} $ means the other way round. Now compare the wave equation from Class 11: $ \\frac{\\partial^{2} y}{\\partial x^{2}} = \\frac{1}{v^{2}}\\frac{\\partial^{2} y}{\\partial t^{2}} $, whose solutions are waves travelling at speed $ v $. Matching the two shapes gives $ \\frac{1}{v^{2}} = \\mu_0\\varepsilon_0 $. You are not asked to solve this equation — only to recognise it.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'Putting the numbers in',
      level: 2,
      objective: 'Evaluate $ \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $ from the two measured constants, and compare it with the measured speed of light.',
    }),
    b('step_solver', 4, {
      title: 'The speed of a Maxwell wave',
      problem: 'Using $ \\mu_0 = 4\\pi\\times10^{-7} $ and $ \\varepsilon_0 = 8.854\\times10^{-12} $ in SI units, evaluate $ v = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $ and say what the answer is.',
      intro: 'Four lines of arithmetic. Do them slowly, and do not look ahead — the whole force of this page is in watching a familiar number appear where it has no business being.',
      steps: [
        st('Multiply the two constants first: $ \\mu_0\\varepsilon_0 = (4\\pi\\times10^{-7})(8.854\\times10^{-12}) $',
          'Take no square roots yet. Get the product, with its power of ten, before doing anything else.', {
            check: {
              kind: 'mcq',
              prompt: 'What is $ 4\\pi $ , to four significant figures?',
              options: ['3.142', '6.283', '12.57', '1.571'],
              answer_index: 2,
              feedback_right: 'Yes — $ 4\\times 3.1416 = 12.566 $ , so $ \\mu_0 = 12.57\\times10^{-7} $ in SI units.',
              feedback_wrong: 'Multiply $ \\pi = 3.1416 $ by four. That gives $ 12.566 $ , so $ \\mu_0 = 12.57\\times10^{-7} $ in SI units.',
            },
          }),
        st('$ \\mu_0\\varepsilon_0 = (12.57\\times10^{-7})(8.854\\times10^{-12}) = 1.113\\times10^{-17} $',
          'The mantissas give $ 12.57\\times 8.854 = 111.3 $, and the powers give $ 10^{-7}\\times10^{-12} = 10^{-19} $. So the product is $ 111.3\\times10^{-19} $, which is $ 1.113\\times10^{-17} $. In SI units this works out to seconds squared per metre squared — already a hint of what is coming.', {
            check: {
              kind: 'mcq',
              prompt: 'If $ \\mu_0\\varepsilon_0 $ has units of $ \\text{s}^{2}\\text{m}^{-2} $ , what are the units of $ \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $ ?',
              options: ['seconds per metre', 'metres per second', 'metres per second squared', 'metres squared per second'],
              answer_index: 1,
              feedback_right: 'Correct — the square root gives $ \\text{s m}^{-1} $ , and the reciprocal turns it into $ \\text{m s}^{-1} $ . A speed.',
              feedback_wrong: 'Take the square root of $ \\text{s}^{2}\\text{m}^{-2} $ to get $ \\text{s m}^{-1} $ , then take the reciprocal: $ \\text{m s}^{-1} $ . Whatever this combination is, it is a speed.',
            },
          }),
        st('$ \\sqrt{\\mu_0\\varepsilon_0} = \\sqrt{1.113\\times10^{-17}} = 3.336\\times10^{-9} $',
          'A trick worth keeping: to square-root a power of ten, first make the exponent **even**. Write $ 1.113\\times10^{-17} $ as $ 11.13\\times10^{-18} $. Then $ \\sqrt{11.13} = 3.336 $ and $ \\sqrt{10^{-18}} = 10^{-9} $, so the answer is $ 3.336\\times10^{-9} $.', {
            check: {
              kind: 'mcq',
              prompt: 'Why rewrite $ 1.113\\times10^{-17} $ as $ 11.13\\times10^{-18} $ before taking the root?',
              options: ['because the mantissa must be larger than ten', 'because a negative power cannot be square-rooted', 'because $ 11.13 $ is a perfect square', 'because an even exponent halves to a whole number'],
              answer_index: 3,
              feedback_right: 'Exactly — $ \\sqrt{10^{-18}} = 10^{-9} $ cleanly, whereas $ \\sqrt{10^{-17}} $ would leave you with an awkward half-power.',
              feedback_wrong: 'Square-rooting a power of ten halves its exponent. An odd exponent halves to something like $ -8.5 $ , which is hard to handle; shifting to an even exponent keeps the arithmetic clean.',
            },
          }),
        st('$ v = \\frac{1}{3.336\\times10^{-9}} = 3.00\\times10^{8}\\ \\text{m s}^{-1} $',
          'And there it is. The speed of light, out of a force between two wires and a charge on two plates. Nothing optical went in at any point of that calculation.'),
      ],
      now_you_try: {
        problem: 'Inside a material the same argument gives $ v = \\frac{1}{\\sqrt{\\mu\\varepsilon}} $ . Glass is essentially non-magnetic, so $ \\mu \\approx \\mu_0 $ , and its dielectric constant is about $ K = 2.25 $ , meaning $ \\varepsilon = K\\varepsilon_0 $ . Find the speed of light in glass — and then look hard at the number you divided by.',
        answer: '$ v = 2.0\\times10^{8}\\ \\text{m s}^{-1} $ , which is two-thirds of $ c $. The number divided by is $ \\sqrt{K} = 1.5 $ — the refractive index of glass.',
        solution: 'Substitute $ \\varepsilon = K\\varepsilon_0 $ and $ \\mu = \\mu_0 $ :\n\n$ v = \\frac{1}{\\sqrt{\\mu_0 K\\varepsilon_0}} = \\frac{1}{\\sqrt{K}}\\cdot\\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} = \\frac{c}{\\sqrt{K}} $\n\nWith $ K = 2.25 $ , $ \\sqrt{K} = 1.5 $ , so\n\n$ v = \\frac{3.00\\times10^{8}}{1.5} = 2.0\\times10^{8}\\ \\text{m s}^{-1} $\n\n**Now the part worth stopping for.** You met $ 1.5 $ before, as the **refractive index** of glass — a number defined by how much a ray bends, or as the ratio $ \\frac{c}{v} $ of two speeds.\n\nHere it has arrived from a completely different direction: it is the square root of a **dielectric constant**, which is measured by charging a capacitor with a slab of glass between its plates. No light is involved in that measurement at all.\n\nSo an optical property of a material turns out to be an electrical property of the same material. That is not a coincidence, and after this page it should not even be a surprise — if light is an electromagnetic wave, then how a material treats light and how it treats an electric field must be the same question.',
      },
    }),
    b('latex_block', 5, {
      latex: 'c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} = 3.00\\times10^{8}\\ \\text{m s}^{-1}',
      label: 'The speed of an electromagnetic wave in vacuum',
      note: 'Two constants from benchtop electricity experiments, and no light anywhere in either of them. This is the single most important line in this book.',
      highlight: true,
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'Maxwell\'s calculation is often called the moment light was explained. What exactly is it that makes the argument so convincing?',
      options: [
        'Neither constant was measured with light, yet light\'s speed came out',
        'The two constants had been measured very precisely by many workers',
        'The result was confirmed by an experiment done a few years later',
        'No earlier theory had ever assigned any speed at all to light',
      ],
      correct_index: 0,
      reveal: '**Neither constant was measured with light, yet light\'s speed came out.**\n\nTake the other three in turn, because each of them is true-sounding and each misses the point.\n\n*Precision* is not what carries the argument. Even a rough measurement of the two constants would have landed within a few per cent of $ 3\\times10^{8} $, and a few per cent is more than enough when the alternative hypothesis is "these two things are unrelated". A number can be imprecise and still be unmistakable.\n\n*Later confirmation* came, and it was magnificent — Hertz made and detected the waves in 1887 — but Maxwell\'s result was already compelling in 1862, twenty-five years earlier, and physicists knew it.\n\n*Earlier theories had given light a speed.* Of course they had; it had been measured. What no earlier theory could do was say **why** that number and not some other. Maxwell\'s does: the speed is not an input, it is forced by two constants belonging to a different subject entirely.\n\n**And that is the shape of the strongest evidence there is in science.** A theory built to fix an inconsistency in magnetism spits out, unasked, a number that another community had measured with toothed wheels and mirrors on a hillside. Nobody arranged the agreement. Nobody could have.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'Where those two constants actually come from',
      level: 2,
      objective: 'Trace $ \\mu_0 $ and $ \\varepsilon_0 $ back to the experiments that fix them, and confirm that no optical measurement is involved in either.',
    }),
    b('text', 8, {
      markdown: 'It is easy to nod along at "no light went in" without checking. So check.\n\n**Where $ \\mu_0 $ comes from.** Chapter 5 gave the force per unit length between two long parallel wires carrying currents $ I_1 $ and $ I_2 $ a distance $ d $ apart:\n\n$ \\frac{F}{l} = \\frac{\\mu_0 I_1 I_2}{2\\pi d} $\n\nEverything in that equation except $ \\mu_0 $ is measured with a ruler, an ammeter and a balance. Hang two wires up, pass currents, weigh the force between them, and $ \\mu_0 $ drops out. The experiment is entirely mechanical and entirely dark.\n\n**Where $ \\varepsilon_0 $ comes from.** Chapter 1 gave Coulomb\'s law, $ F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^{2}} $, and Chapter 2 gave the parallel-plate capacitor, $ C = \\frac{\\varepsilon_0 A}{d} $. Either will do: measure a force between charges with a torsion balance, or measure how much charge a pair of plates holds per volt. Both are bench experiments with a ruler, and no lamp is lit in either.\n\nSo the audit passes. Two numbers, four measurements, not a photon of intent between them — and yet $ \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $ is the speed of light.',
    }),
    b('table', 9, {
      caption: 'The audit. Look down the last column and check that nothing optical appears in it.',
      headers: ['Constant', 'What fixes it', 'The apparatus', 'Chapter'],
      rows: [
        ['$ \\mu_0 $', 'the force between two parallel current-carrying wires, $ \\frac{F}{l} = \\frac{\\mu_0 I_1 I_2}{2\\pi d} $', 'two wires, an ammeter, a ruler, a balance', '**Chapter 5**'],
        ['$ \\varepsilon_0 $', 'the force between two charges, $ F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^{2}} $', 'a torsion balance and two charged spheres', '**Chapter 1**'],
        ['$ \\varepsilon_0 $ (again)', 'the capacitance of a parallel-plate capacitor, $ C = \\frac{\\varepsilon_0 A}{d} $', 'two plates, a ruler, a charge meter, a voltmeter', '**Chapter 2**'],
      ],
    }),
    b('text', 10, {
      markdown: 'The history is worth having, because it makes clear that nobody was fishing for this answer.\n\nIn **1849** Hippolyte Fizeau measured the speed of light directly, by sending a beam through the gaps of a fast-spinning toothed wheel to a mirror eight kilometres away and back. He got about $ 3.1\\times10^{8} $ m s⁻¹. That was an optics experiment, done by an optics man, and it had nothing to do with electricity.\n\nIn **1856** Wilhelm Weber and Rudolf Kohlrausch, working on something else entirely, measured the ratio between the electromagnetic and electrostatic units of charge — a purely electrical measurement, made with a charged capacitor and a galvanometer. The number they got was about $ 3.1\\times10^{8} $ m s⁻¹, and they published it without remarking on the coincidence.\n\nIn **1862** Maxwell noticed that the two numbers were the same, and that his equations said they *had* to be. He wrote that light seems to be an undulation of the same medium that carries electric and magnetic effects — and no one has found a reason to disagree since.\n\n**Two conclusions follow, and they are the whole payoff of this chapter.**\n\n**One: light is an electromagnetic wave.** Visible light is nothing but electric and magnetic fields taking turns, exactly as page 3 described, travelling at the speed those two electrical constants demand.\n\n**Two: every electromagnetic wave travels at $ c $ in vacuum, whatever its frequency.** Look at the formula — there is no frequency in it anywhere. Radio waves, microwaves, X-rays and gamma rays all move at precisely the same speed as visible light in empty space. The visible band is not physically special at all; it is special only to human eyes, which evolved to use the part of the spectrum the Sun sends most of and the atmosphere lets through.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Two benchtop electricity experiments feeding two constants into the formula for the speed of light',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'A force between wires and a charge on two plates. Out of them comes the speed of light.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition arranged left to right. On the far left, two vignettes stacked vertically: the upper one shows two long parallel vertical wires drawn in warm amber with small orange current arrows and a short bold arrow between them indicating a force, plus a simple grey balance beam above; the lower one shows a parallel-plate capacitor drawn as two amber bars with orange field arrows between them and a small grey meter symbol attached. From each vignette a thin amber arrow runs right into a central rounded rectangle with a thin bright-amber border, left blank for a formula. From the right side of that rectangle a single bold bright-orange arrow runs to the far right, where a smooth amber sinusoidal wave travels off towards a small stylised sun disc drawn in dim outline. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Maxwell died in 1879, at forty-eight, without ever seeing an electromagnetic wave made on purpose. His prediction sat on paper for a quarter of a century.\n\nIn **1887** Heinrich Hertz built a spark gap in a Karlsruhe lecture room, and a small loop of wire with a tiny gap in it a few metres away. Every time a spark jumped the first gap, a much smaller spark jumped the second — across empty air, with nothing connecting them. He went on to measure the waves\' wavelength and speed, and the speed was $ c $. Asked what use it was, he is said to have answered that it was of no use whatsoever.\n\nIn **1895**, in Calcutta, **Jagadish Chandra Bose** took it further than anyone. Using waves of only a few millimetres\' wavelength, he rang a bell and set off a small charge of gunpowder in another room, the signal passing through two walls and the body of the presiding official — the first demonstration anywhere of a device controlled remotely by radio. He was famously reluctant to patent his work, believing it belonged to everybody.\n\nWithin a decade the same physics was carrying messages across the Atlantic. Today it carries every phone call, every Wi-Fi packet, every GPS fix, every image sent back from a spacecraft.\n\nThe chain from a spark in a lecture room to the device in your hand is unbroken — and it starts with a term added to an equation to stop it contradicting itself.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art, three small vignettes in a row separated by thin vertical grey rules. Left vignette: a spark-gap transmitter drawn as two amber spheres with a bright orange spark between them, and a short distance away a small circular wire loop with a tiny bright spark in its gap, with faint concentric amber arcs spreading from the transmitter to the loop. Middle vignette: a compact bench apparatus with a small horn-shaped emitter in amber aimed through two schematic grey wall sections at a simple bell drawn in outline, with faint amber arcs passing through the walls. Right vignette: a modern slim phone drawn in grey outline with three faint amber signal arcs rising from its top corner towards a small satellite drawn in dim outline. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- In empty space Maxwell\'s equations give a **wave equation**, whose speed is $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $.\n- Putting the numbers in: $ \\mu_0\\varepsilon_0 = 1.113\\times10^{-17} $, its square root is $ 3.336\\times10^{-9} $, and the reciprocal is $ 3.00\\times10^{8} $ m s⁻¹.\n- $ \\mu_0 $ is fixed by the **force between two wires** (Chapter 5); $ \\varepsilon_0 $ by **charges or a capacitor** (Chapters 1 and 2). Neither uses light.\n- The measured speed of light matched, so **light is an electromagnetic wave**. Nobody put light into the calculation.\n- The formula has **no frequency in it**: radio, microwaves, infrared, visible, ultraviolet, X-rays and gamma rays all travel at $ c $ in vacuum.\n- In a material, $ v = \\frac{1}{\\sqrt{\\mu\\varepsilon}} $, and for a non-magnetic medium this gives refractive index $ = \\sqrt{K} $.\n- Hertz made and detected these waves in 1887; J. C. Bose used them to control a device remotely in 1895.',
    }),
    b('text', 14, {
      markdown: 'Next: we know a wave exists and how fast it goes, but not yet what it looks like. Which way do $ \\vec{E} $ and $ \\vec{B} $ point, how are they related in size, and how do they sit relative to the direction of travel? That is the structure of an electromagnetic wave.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The speed of an electromagnetic wave in vacuum is given by',
          ['$ \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $', '$ \\sqrt{\\mu_0\\varepsilon_0} $', '$ \\frac{\\mu_0}{\\varepsilon_0} $', '$ \\frac{1}{\\mu_0\\varepsilon_0} $'],
          0,
          'Matching Maxwell\'s empty-space equation against the standard wave equation gives $ \\frac{1}{v^{2}} = \\mu_0\\varepsilon_0 $, so $ v $ is the reciprocal of the square root of the product. A quick units check settles it: only that combination comes out in metres per second.',
          1),
        q('The constants $ \\mu_0 $ and $ \\varepsilon_0 $ are fixed by experiments involving',
          ['forces between wires and charges on plates', 'the bending of light passing through glass', 'the time light takes to cross a known distance', 'the colours emitted by a heated filament'],
          0,
          'One comes from the force per unit length between two current-carrying wires, the other from Coulomb\'s law or a capacitance measurement. That neither is an optical experiment is precisely what makes the result on this page astonishing.',
          2),
        q('In vacuum, a gamma ray travels compared with a radio wave',
          ['at exactly the same speed', 'very much faster', 'a little more slowly', 'at a speed depending on its source'],
          0,
          'No frequency appears anywhere in $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $, so every electromagnetic wave moves at the same speed in empty space. They differ in wavelength and in the energy they carry, not in speed.',
          2),
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
