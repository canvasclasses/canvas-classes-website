'use strict';
/**
 * Class 11 Physics · Chapter 1 "Units and Dimensions" — pages 0–4.
 * The units spine: why units exist, the SI seven, scale and order of magnitude,
 * and converting a measurement between two systems of units.
 *
 * Rhythm (house rules, PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md §4A/§6):
 *   situation → student works it → the rule falls out → gated step_solver →
 *   step_solver → "You solve it" strip → bridge.
 * Exposition never runs past ~120 words without something to do.
 *
 * Run: node scripts/physics11-book/build_ch1_units.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch1');

// ── p0 · Chapter opener ──────────────────────────────────────────────────────
const p0 = {
  page_number: 0,
  slug: 'units-and-dimensions-opener',
  title: 'Units and Dimensions',
  subtitle: 'A number on its own means nothing',
  page_type: 'chapter_opener',
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A row of measuring instruments and standards glowing on a dark bench, from a metre rule to an atomic clock.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: 'Wide cinematic illustration on a very dark near-black background. A row of measuring standards fading from left to right: a wooden hand-span, a metre rule, a balance, a stopwatch, and finally a stylised atomic clock emitting faint concentric waves. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
    }),
    b('text', 1, {
      markdown: 'Physics is the subject that insists on numbers. But a number by itself is useless.\n\nIf someone tells you a rope is **7**, you have learnt nothing. Seven what? Metres? Feet? Hand-spans? The number only becomes information once it is attached to a **unit** — and even then, only if you also know how much to trust it.\n\nThis chapter is about all three of those things: choosing units everyone agrees on, writing down only the digits you can honestly defend, and then a beautiful idea called **dimensions**, which lets you check a formula you have never seen before.',
    }),
    b('text', 2, {
      markdown: '**What is in this chapter**\n\n- Why a unit has to be agreed on, and how the number changes when the unit does\n- The seven SI base units — and why seven is enough for all of physics\n- Writing sizes from a proton to the universe without counting zeros\n- Converting a quantity from one system of units into another\n- **Significant figures** — the digits you are allowed to write down\n- **Errors** — how uncertainty spreads when you add, multiply and take powers\n- **Dimensions** — what a quantity is made of, and the three things that lets you do',
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'How to use this chapter',
      markdown: 'This is the chapter students skip because it looks easy. Then they lose marks in every other chapter — a wrong unit, one digit too many, a formula misremembered.\n\nSo do the work here. Every step-by-step solution in this chapter asks you a question before it shows you the next line. Answer it before you tap. That is the whole difference between reading physics and learning it.',
    }),
    b('callout', 4, {
      variant: 'note',
      title: 'A note on scope',
      markdown: 'The current NCERT chapter no longer covers **vernier callipers and the screw gauge**. Those belong to laboratory work, and they get a proper chapter of their own — **Experimental Physics** — later in the course, where they can be taught alongside the experiments that use them.\n\nWhat you do need from measurement — least count, the doubtful digit, and error analysis — is all here.',
    }),
  ],
};

// ── p1 · A Number Is Half an Answer ──────────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'a-number-is-half-an-answer',
  title: 'A Number Is Half an Answer',
  subtitle: 'Why the unit is not an afterthought',
  glossary: [
    { term: 'physical quantity', definition: 'Anything in physics that can be measured — length, time, mass, current, and so on.' },
    { term: 'unit', definition: 'The agreed amount of a quantity that we compare against when we measure. The metre is the unit of length.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two students measure the same desk. One writes down 7, the other writes down 9. Both measured carefully, and neither made a mistake. How is that possible?',
      hint: 'Ask what each of them was counting.',
      reveal: 'They used their own hand-spans. The first student has a bigger hand, so fewer of them fit along the desk. The desk never changed — the yardstick did.\n\nThis is the whole reason units have to be agreed on before any number is worth writing down.',
    }),
    b('text', 1, {
      markdown: 'To **measure** something is to compare it against a standard amount that everyone has agreed on. That standard amount is the **unit**.\n\nSo every measurement has two parts:\n\n$ \\text{measurement} = \\text{number} \\times \\text{unit} $\n\nWhen we say a wire is 5 m long, the 5 says "five times", and the metre says "five times *this* much".',
    }),
    b('heading', 2, {
      text: 'Change the unit, and the number must change',
      level: 2,
      objective: 'Predict how the number changes when the unit is made bigger or smaller.',
    }),
    b('text', 3, {
      markdown: 'The desk did not change length. Only the yardstick did — and the number moved in the **opposite** direction.\n\nA bigger unit means fewer of them fit, so the number gets smaller. A smaller unit means more of them fit, so the number gets bigger.\n\nThe length of the desk itself is fixed. So the product of the number and the unit must stay fixed:\n\n$ n \\times u = \\text{constant} $\n\nWrite the same length in two different systems and you get the relation this whole chapter keeps coming back to:\n\n$ n_1 u_1 = n_2 u_2 $',
    }),
    b('step_solver', 4, {
      title: 'Using the seesaw',
      problem: 'A steel rod is 2.5 m long. What is its length in centimetres?',
      intro: 'You already know the answer. Do it the long way anyway — the reasoning is what carries you through the hard conversions later in the chapter.',
      steps: [
        st('$ n_1 u_1 = n_2 u_2 $, with $ n_1 = 2.5 $ and $ u_1 = 1\\ \\text{m} $',
          'Write down what you have. The length is fixed; we are only changing how we describe it.', {
            check: {
              kind: 'mcq',
              prompt: 'We are moving from metres to centimetres. Is the new unit bigger or smaller than the old one?',
              options: ['Bigger', 'Smaller', 'The same size', 'It depends on the rod'],
              answer_index: 1,
              feedback_right: 'Right — a centimetre is smaller than a metre.',
              feedback_wrong: 'A hundred centimetres make one metre, so one centimetre is the smaller of the two.',
            },
          }),
        st('$ u_2 = 1\\ \\text{cm} = \\frac{1}{100}\\ \\text{m} $',
          'Express the new unit in terms of the old one. This single line is where conversions are won or lost.', {
            why: 'Notice we did not touch the rod. We only rewrote the yardstick in terms of the other yardstick.',
          }),
        st('$ n_2 = n_1 \\times \\frac{u_1}{u_2} = 2.5 \\times 100 $',
          'Rearranging the seesaw relation. The unit shrank by a factor of 100, so the number must grow by 100.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The unit became 100 times smaller. By what factor does the number grow?',
              blank_answer: '100',
              feedback_right: 'Yes — smaller unit, proportionally bigger number.',
              feedback_wrong: 'The product $ n \\times u $ cannot change. If $ u $ is divided by 100, $ n $ must be multiplied by 100.',
            },
          }),
        st('$ \\text{length} = 250\\ \\text{cm} $',
          'And that is the answer.', {
            why: 'The check that saves you in an exam: did the number move the way you expected? We went to a smaller unit, so the number had to get bigger. It did.',
          }),
      ],
      now_you_try: {
        problem: 'A tape measure reads 0.75 km. Write the same length in metres.',
        answer: '750 m',
        solution: 'The metre is 1000 times smaller than the kilometre, so the number must be 1000 times bigger: $ 0.75 \\times 1000 = 750 $ m.',
      },
    }),
    b('inline_quiz', 5, {
      pass_threshold: 0.6,
      questions: [
        q('A quantity is measured in two different units. The number recorded is larger when the unit used is:',
          ['Smaller', 'Larger', 'Unchanged', 'A base unit'], 0,
          'The product number × unit is fixed by the quantity itself, so the number and the unit always move in opposite directions.', 1),
        q('A distance is written as 4 in unit P and as 20 in unit Q. Which statement is correct?',
          ['P is five times Q', 'Q is five times P', 'P and Q are the same size', 'Q is four times P'], 0,
          'More of Q fit into the same distance, so Q must be the smaller unit. Since 20 is five times 4, P is five times as big as Q.', 2),
      ],
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'The one relation to carry forward',
      markdown: '$ n_1 u_1 = n_2 u_2 $\n\nThe quantity does not care which units you use. Only the number does.\n\nThis is not just a trick for centimetres and metres — on page 4 the very same line converts the gravitational constant from one whole system of units into another.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A shopkeeper says "this rope is 12". You are allowed to ask exactly one question before you decide whether to buy it. What do you ask, and why is that the only question worth asking?',
      reveal: 'Ask: **twelve of what?**\n\nWithout the unit, 12 could be 12 metres, 12 feet or 12 hand-spans — three quite different ropes. The number alone carries no information about size at all; it only tells you how many times the unit was laid down.\n\nThis is why in physics a bare number is always treated as an incomplete answer, and why an exam answer written without units does not get full marks.',
      difficulty_level: 2,
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('Which of these is **not** a physical quantity?',
          ['The temperature of a room', 'The beauty of a sunset', 'The current in a wire', 'The time taken by a pendulum'], 1,
          'A physical quantity must be measurable — you must be able to compare it with an agreed standard. Beauty cannot be compared against a standard, so it is not a physical quantity.', 1),
        q('The same rod is measured in inches and in centimetres. Which of these is the same in both cases?',
          ['The number written down', 'The unit used', 'The length of the rod', 'Nothing at all'], 2,
          'The rod itself never changes. That is exactly why the number must change when the unit does — their product has to stay fixed.', 2),
      ],
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Four quick ones before you move on. Work each out before you reveal it.',
      sections: [
        {
          id: 'p1-ysi',
          title: 'Numbers, units and the seesaw',
          items: [
            num('p1-y1', 'A room is 6.5 m wide. Write this in (a) cm and (b) mm.',
              '(a) 650 cm  (b) 6500 mm',
              'A centimetre is 100 times smaller than a metre, so the number is 100 times bigger: $ 6.5 \\times 100 = 650 $ cm. A millimetre is 1000 times smaller, so $ 6.5 \\times 1000 = 6500 $ mm.'),
            mcq('p1-y2', 'A time interval is 0.5 in some unit X, and 30 in another unit Y. Then:',
              ['X is 60 times bigger than Y', 'Y is 60 times bigger than X', 'X and Y are equal', 'X is 30 times bigger than Y'], 0,
              'The number went up by a factor of 60 (from 0.5 to 30), so the unit must have gone down by 60. Y is 60 times smaller, which is the same as saying X is 60 times bigger. (If X were the minute and Y the second, this is exactly what you would see.)'),
            num('p1-y3', 'The unit of length is changed so that the new unit is one-fifth of the old one. A wall measured 20 units before. What does it measure now?',
              '100 units',
              'Smaller unit, bigger number. The unit shrank by 5, so the number grows by 5: $ 20 \\times 5 = 100 $.'),
            mcq('p1-y4', 'Which statement about a measurement is always true?',
              ['The number alone fixes the size of the quantity', 'The unit alone fixes the size of the quantity', 'The product of the number and the unit fixes the size of the quantity', 'Neither the number nor the unit matters if the instrument is good'], 2,
              'The quantity itself is fixed. We can describe it with a big number and a small unit, or a small number and a big unit — but the product number × unit is the quantity, and that never changes.'),
          ],
        },
      ],
    }),
    b('text', 10, {
      markdown: 'So a unit has to be agreed on. But agreed on by whom, and how many different units do we actually need?\n\nThat is the next page — and the answer is surprisingly small.',
    }),
  ],
};

// ── p2 · Seven Is Enough ─────────────────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'seven-base-units',
  title: 'Seven Is Enough',
  subtitle: 'Base quantities, derived quantities, and the SI system',
  glossary: [
    { term: 'base quantity', definition: 'One of the seven quantities that are not defined in terms of any other. Length, mass and time are three of them.' },
    { term: 'derived quantity', definition: 'A quantity built out of base quantities by multiplying or dividing — speed, force and pressure are all derived.' },
    { term: 'SI', definition: 'The International System of Units — the worldwide standard, built on seven base units.' },
  ],
  blocks: [
    b('text', 0, {
      markdown: 'Physics measures hundreds of different quantities. It would be miserable if each one needed its own independent standard.\n\nIt does not. Most quantities are **built** out of others. Speed is a length divided by a time. Area is a length times a length. Once you have fixed the unit of length and the unit of time, the unit of speed comes free.\n\nSo before reading on, sort these yourself: which of them stand on their own, and which are built out of others?',
    }),
    b('classify_exercise', 1, {
      question: 'A **base quantity** is one that is not defined using any other quantity. Which of these are base quantities?',
      column_label: 'Quantity',
      verdict_label: 'Base?',
      yes_label: '✓ Base',
      no_label: '✗ Derived',
      rows: [
        { substance: 'Length', is_solution: true, explanation: 'Base. There is no more primitive quantity you could define a length with.' },
        { substance: 'Speed', is_solution: false, explanation: 'Derived — it is a length divided by a time.' },
        { substance: 'Mass', is_solution: true, explanation: 'Base. One of the original three, along with length and time.' },
        { substance: 'Area', is_solution: false, explanation: 'Derived — length × length.' },
        { substance: 'Time', is_solution: true, explanation: 'Base.' },
        { substance: 'Force', is_solution: false, explanation: 'Derived — mass × acceleration, so it is built from mass, length and time.' },
        { substance: 'Electric current', is_solution: true, explanation: 'Base. The ampere is a base unit; the coulomb of charge is the derived one, not the other way round.' },
        { substance: 'Density', is_solution: false, explanation: 'Derived — mass divided by volume.' },
        { substance: 'Thermodynamic temperature', is_solution: true, explanation: 'Base. Measured in kelvin.' },
        { substance: 'Volume', is_solution: false, explanation: 'Derived — length × length × length.' },
        { substance: 'Amount of substance', is_solution: true, explanation: 'Base. Measured in moles — the same mole you use in chemistry.' },
        { substance: 'Pressure', is_solution: false, explanation: 'Derived — force divided by area.' },
        { substance: 'Luminous intensity', is_solution: true, explanation: 'Base. Measured in candela. It is the odd one out of the seven, and the one students forget.' },
      ],
    }),
    b('text', 2, {
      markdown: 'You just found them all. There are exactly **seven** base quantities, and everything else in physics is built from them.\n\nThe worldwide agreement on which units to use for those seven is called the **SI** system — from the French *Le Système International d\'Unités*, adopted in 1971.',
    }),
    b('table', 3, {
      caption: 'The seven SI base units.',
      headers: ['Base quantity', 'SI unit', 'Symbol'],
      rows: [
        ['Length', 'metre', 'm'],
        ['Mass', 'kilogram', 'kg'],
        ['Time', 'second', 's'],
        ['Electric current', 'ampere', 'A'],
        ['Thermodynamic temperature', 'kelvin', 'K'],
        ['Amount of substance', 'mole', 'mol'],
        ['Luminous intensity', 'candela', 'cd'],
      ],
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.5,
      questions: [
        q('Cover the table. Which of these is **not** one of the seven base quantities?',
          ['Amount of substance', 'Luminous intensity', 'Force', 'Electric current'], 2,
          'Force is derived — mass × acceleration. The other three are on the list of seven.', 1),
        q('The SI unit of amount of substance is the:',
          ['gram', 'mole', 'candela', 'kelvin'], 1,
          'The mole — the same one you use in chemistry. The candela measures luminous intensity and the kelvin measures temperature.', 1),
      ],
    }),
    b('callout', 5, {
      variant: 'note',
      title: 'How the seven are actually defined — and why you need not memorise it',
      markdown: 'Since 2019 all seven are defined by **fixing the numerical value of a constant of nature** and letting the unit follow. The second is fixed by a caesium atom\'s radiation frequency, the metre by the speed of light, the kilogram by Planck\'s constant, the ampere by the charge on the electron, the kelvin by Boltzmann\'s constant, and the mole by the Avogadro number.\n\nNCERT prints these definitions and then says plainly that their values **need not be remembered or asked in a test**. We agree. Understand the idea — nature\'s constants are the same everywhere, so a unit built on them is the same everywhere — and move on.\n\nOlder books define the kilogram as a metal cylinder kept near Paris and the kelvin from the triple point of water. Those definitions were retired in 2019. If you meet them in an old book, they are history, not the current standard.',
    }),
    b('heading', 5, {
      text: 'Derived units are just base units multiplied together',
      level: 2,
      objective: 'Write a derived unit such as the newton or the joule in terms of base units.',
    }),
    b('step_solver', 6, {
      title: 'Taking a newton apart',
      problem: 'Express the newton, the SI unit of force, purely in terms of base units.',
      intro: 'A derived unit is never a new idea. It is always a shorthand for some base units multiplied and divided. Unpacking it is a two-line job.',
      steps: [
        st('$ \\text{force} = \\text{mass} \\times \\text{acceleration} $',
          'Start from the defining equation — always. Never from a remembered answer.', {
            check: {
              kind: 'mcq',
              prompt: 'What is the SI unit of acceleration?',
              options: ['m s', '$ \\text{m s}^{-1} $', '$ \\text{m s}^{-2} $', '$ \\text{kg m s}^{-2} $'],
              answer_index: 2,
              feedback_right: 'Yes — velocity is m per second, and acceleration is that per second again.',
              feedback_wrong: 'Acceleration is a velocity (m per second) divided by a time (per second again), giving metre per second squared.',
            },
          }),
        st('$ 1\\ \\text{N} = 1\\ \\text{kg} \\times 1\\ \\text{m s}^{-2} $',
          'Substitute the unit of each factor.'),
        st('$ 1\\ \\text{N} = 1\\ \\text{kg m s}^{-2} $',
          'And that is the newton, written with nothing but base units.', {
            why: 'A newton is not a fundamental thing. It is a convenient name for one kilogram-metre-per-second-squared, exactly as "dozen" is a convenient name for twelve.',
          }),
      ],
      now_you_try: {
        problem: 'The joule is defined by work = force × displacement. Write the joule in base units.',
        answer: '$ 1\\ \\text{J} = 1\\ \\text{kg m}^{2}\\ \\text{s}^{-2} $',
        solution: 'Work = force × distance, so $ 1\\ \\text{J} = 1\\ \\text{N} \\times 1\\ \\text{m} = (\\text{kg m s}^{-2})(\\text{m}) = \\text{kg m}^{2}\\ \\text{s}^{-2} $.',
      },
    }),
    b('step_solver', 7, {
      title: 'And a watt',
      problem: 'Express the watt, the SI unit of power, in base units.',
      steps: [
        st('$ \\text{power} = \\frac{\\text{work}}{\\text{time}} $',
          'The defining equation again.'),
        st('$ 1\\ \\text{W} = \\frac{1\\ \\text{J}}{1\\ \\text{s}} = \\frac{\\text{kg m}^{2}\\ \\text{s}^{-2}}{\\text{s}} $',
          'Substitute the joule you just unpacked.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Dividing $ \\text{s}^{-2} $ by one more second gives $ \\text{s}^{?} $. What is the power of s?',
              blank_answer: '-3',
              feedback_right: 'Correct — dividing by a second subtracts one more from the exponent.',
              feedback_wrong: 'Dividing by $ \\text{s} $ subtracts 1 from the exponent: $ -2 - 1 = -3 $.',
            },
          }),
        st('$ 1\\ \\text{W} = 1\\ \\text{kg m}^{2}\\ \\text{s}^{-3} $',
          'One extra "per second" on top of the joule. That is the only difference between energy and power.'),
      ],
      now_you_try: {
        problem: 'Pressure is force per unit area. Write the pascal in base units.',
        answer: '$ 1\\ \\text{Pa} = 1\\ \\text{kg m}^{-1}\\ \\text{s}^{-2} $',
        solution: '$ 1\\ \\text{Pa} = \\frac{1\\ \\text{N}}{1\\ \\text{m}^{2}} = \\frac{\\text{kg m s}^{-2}}{\\text{m}^{2}} = \\text{kg m}^{-1}\\ \\text{s}^{-2} $.',
      },
    }),
    b('callout', 8, {
      variant: 'warning',
      title: 'Four writing mistakes that cost marks',
      markdown: '- **No plural on a symbol.** Write 10 kg, never 10 kgs. The symbol is not an abbreviation of an English word.\n- **No full stop after a symbol.** Write 5 m, not 5 m. — unless the sentence itself ends there.\n- **A unit named after a person has a small letter but a capital symbol.** newton and N; joule and J; pascal and Pa. Writing "Newton" for the unit is wrong; the man gets the capital, the unit does not.\n- **Kelvin takes no degree sign.** Write 300 K, never 300 °K. Degrees Celsius does keep it: 27 °C.',
    }),
    b('text', 9, {
      markdown: 'Two more units get a special mention because they are neither base nor quite derived: the **radian** (rad) for a plane angle, and the **steradian** (sr) for a solid angle.\n\nAn angle in radians is an arc length divided by a radius — a length divided by a length. The units cancel completely. So an angle has a unit you can name but **no dimensions at all**, a fact that becomes important on page 11.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('Which of these is a base unit in SI?',
          ['newton', 'candela', 'joule', 'pascal'], 1,
          'The candela measures luminous intensity, one of the seven base quantities. Newton, joule and pascal are all derived.', 1),
        q('The SI unit of force expressed in base units is:',
          ['$ \\text{kg m s}^{-1} $', '$ \\text{kg m}^{2}\\ \\text{s}^{-2} $', '$ \\text{kg m s}^{-2} $', '$ \\text{kg m}^{-1}\\ \\text{s}^{-2} $'], 2,
          'Force = mass × acceleration = kg × m s⁻² = kg m s⁻². Watch the near-misses: $ \\text{kg m}^{2}\\text{s}^{-2} $ is the joule and $ \\text{kg m}^{-1}\\text{s}^{-2} $ is the pascal.', 2),
        q('Which statement about the radian is correct?',
          ['It is a base unit of SI', 'It has a unit but no dimensions', 'It has dimensions but no unit', 'It is the same as a steradian'], 1,
          'A radian is arc length divided by radius — a length over a length. The name survives as a unit, but the dimensions cancel to nothing.', 3),
      ],
    }),
    b('practice_bank', 11, {
      title: 'You solve it',
      intro: 'Take each one on paper first.',
      sections: [
        {
          id: 'p2-ysi',
          title: 'Base, derived, and writing units properly',
          items: [
            num('p2-y1', 'Write the SI unit of (a) momentum and (b) density in terms of base units.',
              '(a) $ \\text{kg m s}^{-1} $  (b) $ \\text{kg m}^{-3} $',
              '(a) Momentum = mass × velocity = kg × m s⁻¹ = kg m s⁻¹.\n\n(b) Density = mass / volume = kg / m³ = kg m⁻³.'),
            mcq('p2-y2', 'Which of the following is **not** an SI base quantity?',
              ['Amount of substance', 'Luminous intensity', 'Electric charge', 'Thermodynamic temperature'], 2,
              'Electric **current** is the base quantity, measured in amperes. Charge is derived from it: charge = current × time.'),
            mcq('p2-y3', 'Which of these is written correctly?',
              ['25 kgs', '25 Kg', '25 kg', '25 kg.'], 2,
              'No plural on a symbol, a small k for kilo, and no full stop. Only the third is correct.'),
            num('p2-y4', 'The unit of work is the joule. Show that the joule can also be written as $ \\text{N m} $, and that both forms give the same base units.',
              'Both give $ \\text{kg m}^{2}\\ \\text{s}^{-2} $',
              'Work = force × displacement, so J = N m directly from the definition. Unpacking: $ \\text{N m} = (\\text{kg m s}^{-2})(\\text{m}) = \\text{kg m}^{2}\\ \\text{s}^{-2} $, which is the joule in base units.'),
            mcq('p2-y5', 'A student claims that once the units of length and time are fixed, the unit of acceleration is fixed automatically. This claim is:',
              ['Correct, because acceleration is a derived quantity', 'Wrong, because acceleration is a base quantity', 'Correct only in the SI system', 'Wrong, because acceleration also needs the unit of mass'], 0,
              'Acceleration = length / (time)², so it is derived from length and time alone. Fix those two units and the unit of acceleration follows with no further choice. Mass does not enter acceleration at all.'),
          ],
        },
      ],
    }),
  ],
};

// ── p3 · From a Proton to the Universe ───────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'from-a-proton-to-the-universe',
  title: 'From a Proton to the Universe',
  subtitle: 'Prefixes, practical units, and order of magnitude',
  glossary: [
    { term: 'order of magnitude', definition: 'The nearest power of ten to a quantity — a rough answer to "how big, roughly?"' },
    { term: 'light year', definition: 'The distance light travels in one year, about 9.46 × 10¹⁵ m. It is a distance, not a time.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A horizontal scale line running from a proton at one end to a galaxy at the other, marked in powers of ten.',
      aspect_ratio: '16:5',
      caption: 'Physics has to describe every one of these with the same set of tools.',
      generation_prompt: 'Wide cinematic illustration on a very dark near-black background. A single glowing horizontal scale line running left to right, with small clean icons spaced along it: a proton, an atom, a virus, a human figure, the Earth, the Sun, a spiral galaxy. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
    }),
    b('text', 1, {
      markdown: 'The smallest thing physics talks about is about $ 10^{-15} $ m across. The largest is about $ 10^{26} $ m. That is a span of forty-one powers of ten.\n\nNo single unit can serve that range comfortably. So we do two things: we attach **prefixes** to the base units, and for some jobs we keep a few **practical units** of convenient size.',
    }),
    b('table', 2, {
      caption: 'The SI prefixes you will actually use.',
      headers: ['Power of ten', 'Prefix', 'Symbol'],
      rows: [
        ['$ 10^{9} $', 'giga', 'G'],
        ['$ 10^{6} $', 'mega', 'M'],
        ['$ 10^{3} $', 'kilo', 'k'],
        ['$ 10^{-1} $', 'deci', 'd'],
        ['$ 10^{-2} $', 'centi', 'c'],
        ['$ 10^{-3} $', 'milli', 'm'],
        ['$ 10^{-6} $', 'micro', 'μ'],
        ['$ 10^{-9} $', 'nano', 'n'],
        ['$ 10^{-12} $', 'pico', 'p'],
      ],
    }),
    b('simulation', 3, {
      simulation_id: 'unit-conversion-arena',
      title: 'Prefix ladder — and the trap that catches everyone',
      prediction: {
        prompt: 'One centimetre is $ 10^{-2} $ m. So how many cubic metres is one cubic centimetre?',
        options: ['$ 10^{-2}\\ \\text{m}^{3} $', '$ 10^{-4}\\ \\text{m}^{3} $', '$ 10^{-6}\\ \\text{m}^{3} $', '$ 10^{-8}\\ \\text{m}^{3} $'],
        reveal_after: 'Cubing a length cubes its conversion factor too: $ (10^{-2})^{3} = 10^{-6} $. This one slip costs more marks than any other conversion mistake — use the ladder below until it feels automatic.',
      },
    }),
    b('heading', 4, {
      text: 'A few units that are not SI but are too useful to drop',
      level: 2,
      objective: 'Recall the practical units of length used for atoms, planets and stars.',
    }),
    b('table', 5, {
      caption: 'Practical units of length. All of these appear in JEE and NEET questions.',
      headers: ['Unit', 'Symbol', 'Value in metres', 'Used for'],
      rows: [
        ['fermi', 'f', '$ 10^{-15} $ m', 'nuclear sizes'],
        ['angstrom', 'Å', '$ 10^{-10} $ m', 'atoms, bond lengths, light wavelengths'],
        ['astronomical unit', 'AU', '$ 1.496 \\times 10^{11} $ m', 'distances inside the solar system'],
        ['light year', 'ly', '$ 9.46 \\times 10^{15} $ m', 'distances to nearby stars'],
        ['parsec', 'pc', '$ 3.08 \\times 10^{16} $ m', 'distances between stars and galaxies'],
      ],
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.5,
      questions: [
        q('An angstrom is $ 10^{-10} $ m. The radius of a hydrogen atom is about 0.5 Å, which in metres is:',
          ['$ 0.5 \\times 10^{-10} $ m', '$ 5 \\times 10^{-10} $ m', '$ 0.5 \\times 10^{10} $ m', '$ 5 \\times 10^{-9} $ m'], 0,
          'Just multiply: $ 0.5 \\times 10^{-10} $ m. Written properly in scientific notation that is $ 5 \\times 10^{-11} $ m.', 1),
        q('Which of these is the largest distance?',
          ['1 astronomical unit', '1 light year', '1 parsec', '1 angstrom'], 2,
          'A parsec ($ 3.08 \\times 10^{16} $ m) beats a light year ($ 9.46 \\times 10^{15} $ m), which beats an AU ($ 1.496 \\times 10^{11} $ m). The angstrom is atomic-scale.', 2),
      ],
    }),
    b('callout', 7, {
      variant: 'warning',
      title: 'A light year is a distance',
      markdown: 'The name has "year" in it, so students write it in an answer about time. It is a **length** — the distance light covers in one year.\n\nYou can check it in one line. Light travels at $ 3 \\times 10^{8} $ m s⁻¹, and a year is about $ 3.156 \\times 10^{7} $ s:\n\n$ (3 \\times 10^{8})(3.156 \\times 10^{7}) \\approx 9.5 \\times 10^{15}\\ \\text{m} $\n\nwhich is the tabulated value. Two numbers you already knew just reproduced a third — that is worth more than memorising it.',
    }),
    b('heading', 7, {
      text: 'Order of magnitude — the answer you can give without calculating',
      level: 2,
      objective: 'State the order of magnitude of any quantity written in scientific notation.',
    }),
    b('text', 8, {
      markdown: 'Often you do not need the exact value. You need to know **roughly how big** — is this a millimetre problem or a kilometre problem?\n\nWrite the quantity as $ a \\times 10^{b} $ with $ a $ between 1 and 10. Then:\n\n- if $ a \\le 5 $, the order of magnitude is $ 10^{b} $\n- if $ a > 5 $, round up: the order of magnitude is $ 10^{b+1} $',
    }),
    b('step_solver', 9, {
      title: 'Two that go different ways',
      problem: 'State the order of magnitude of (a) the diameter of the Earth, $ 1.28 \\times 10^{7} $ m, and (b) the mass of the Earth, $ 5.97 \\times 10^{24} $ kg.',
      intro: 'Same rule, two different outcomes. The whole question is where the front number sits relative to 5.',
      steps: [
        st('$ 1.28 \\times 10^{7} $ m — here $ a = 1.28 $',
          'Read off the front number first.', {
            check: {
              kind: 'mcq',
              prompt: 'Is $ a = 1.28 $ above or below 5?',
              options: ['Below 5, so keep the power as it is', 'Above 5, so round the power up', 'Exactly 5', 'It does not matter'],
              answer_index: 0,
              feedback_right: 'Right — below 5 means the power stays.',
              feedback_wrong: '1.28 is comfortably below 5, so we keep the power unchanged.',
            },
          }),
        st('Order of magnitude $ = 10^{7}\\ \\text{m} $',
          'The Earth is a "ten million metres" sort of object.'),
        st('$ 5.97 \\times 10^{24} $ kg — here $ a = 5.97 $',
          'Now the front number is above 5.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Since $ a > 5 $, we round up. What power of ten is the order of magnitude of the Earth\'s mass?',
              blank_answer: '25',
              feedback_right: 'Yes — $ 10^{25} $ kg, not $ 10^{24} $.',
              feedback_wrong: 'When $ a > 5 $ the quantity is closer to the next power of ten, so $ b $ goes from 24 to 25.',
            },
          }),
        st('Order of magnitude $ = 10^{25}\\ \\text{kg} $',
          'Closer to $ 10^{25} $ than to $ 10^{24} $, so that is the honest rough answer.', {
            why: 'This is why standard tables list the Earth\'s mass as being of order $ 10^{25} $ kg even though the value starts with a 5 and a 24. The rule is doing exactly what it should.',
          }),
      ],
      now_you_try: {
        problem: 'The mass of the Moon is $ 7.35 \\times 10^{22} $ kg. What is its order of magnitude?',
        answer: '$ 10^{23} $ kg',
        solution: 'Here $ a = 7.35 $, which is greater than 5, so round the power up from 22 to 23.',
      },
    }),
    b('step_solver', 10, {
      title: 'How much bigger is the Earth than an atom?',
      problem: 'A hydrogen atom is about $ 10^{-10} $ m across and the Earth about $ 10^{7} $ m. By how many orders of magnitude do they differ?',
      intro: 'Once both are orders of magnitude, comparing them is subtraction — no calculator anywhere.',
      steps: [
        st('$ \\frac{10^{7}}{10^{-10}} $',
          'A comparison is always a ratio, so divide.', {
            check: {
              kind: 'mcq',
              prompt: 'Dividing powers of ten means:',
              options: ['Multiplying the powers', 'Adding the powers', 'Subtracting the lower power from the upper', 'Nothing — you must expand both'],
              answer_index: 2,
              feedback_right: 'Yes — division subtracts exponents.',
              feedback_wrong: '$ 10^{m} / 10^{n} = 10^{m-n} $ — division subtracts the exponents.',
            },
          }),
        st('$ = 10^{7 - (-10)} = 10^{17} $',
          'Careful with the double negative — subtracting a negative adds.', {
            why: 'This is the single most common sign slip in the whole topic. Whenever the lower exponent is negative, the gap gets bigger, not smaller.',
          }),
        st('17 orders of magnitude',
          'The Earth is about a hundred thousand million million times wider than a hydrogen atom.'),
      ],
      now_you_try: {
        problem: 'A proton is about $ 10^{-15} $ m across and a virus about $ 10^{-7} $ m. By how many orders of magnitude do they differ?',
        answer: '8 orders of magnitude',
        solution: '$ 10^{-7} / 10^{-15} = 10^{-7-(-15)} = 10^{8} $.',
      },
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('The order of magnitude of $ 2.7 \\times 10^{4} $ is:',
          ['$ 10^{3} $', '$ 10^{4} $', '$ 10^{5} $', '$ 10^{7} $'], 1,
          'The front number 2.7 is below 5, so the power stays as it is.', 1),
        q('The order of magnitude of $ 8.1 \\times 10^{-6} $ is:',
          ['$ 10^{-7} $', '$ 10^{-6} $', '$ 10^{-5} $', '$ 10^{-4} $'], 2,
          'Here the front number 8.1 is above 5, so the power rounds up from −6 to −5.', 2),
        q('One parsec is about $ 3.08 \\times 10^{16} $ m and one light year about $ 9.46 \\times 10^{15} $ m. So one parsec is roughly:',
          ['One-third of a light year', '3.26 light years', '9.46 light years', 'The same as a light year'], 1,
          'Divide: $ 3.08 \\times 10^{16} / 9.46 \\times 10^{15} \\approx 3.26 $. A parsec is the bigger unit, so the number of light years in it is greater than one.', 3),
      ],
    }),
    b('practice_bank', 12, {
      title: 'You solve it',
      intro: 'No calculator needed for any of these.',
      sections: [
        {
          id: 'p3-ysi',
          title: 'Prefixes, practical units, orders of magnitude',
          items: [
            num('p3-y1', 'Express 1 light year in kilometres.',
              '$ 9.46 \\times 10^{12} $ km',
              'One light year is $ 9.46 \\times 10^{15} $ m. A kilometre is $ 10^{3} $ m, so divide by $ 10^{3} $: $ 9.46 \\times 10^{12} $ km.'),
            mcq('p3-y2', 'One cubic millimetre expressed in cubic metres is:',
              ['$ 10^{-3}\\ \\text{m}^{3} $', '$ 10^{-6}\\ \\text{m}^{3} $', '$ 10^{-9}\\ \\text{m}^{3} $', '$ 10^{-12}\\ \\text{m}^{3} $'], 2,
              'A millimetre is $ 10^{-3} $ m, and cubing cubes the factor: $ (10^{-3})^{3} = 10^{-9} $. Answering $ 10^{-3} $ is the classic mistake of forgetting to cube.'),
            num('p3-y3', 'The wavelength of visible light is about 5000 Å. Write this in metres, and give its order of magnitude.',
              '$ 5 \\times 10^{-7} $ m; order of magnitude $ 10^{-7} $ m',
              'One angstrom is $ 10^{-10} $ m, so $ 5000\\ \\text{Å} = 5000 \\times 10^{-10} = 5 \\times 10^{-7} $ m. The front number is exactly 5, which is not greater than 5, so the power stays: order $ 10^{-7} $ m.'),
            mcq('p3-y4', 'Which of these is **not** a unit of length?',
              ['parsec', 'angstrom', 'light year', 'shake'], 3,
              'A shake is a unit of time (10⁻⁸ s), used in nuclear physics. The other three are all lengths — the light year being the one students most often misfile as a time.'),
            num('p3-y5', 'The age of the universe is about $ 10^{17} $ s and a human heartbeat takes about 1 s. How many orders of magnitude separate them?',
              '17',
              'A heartbeat is of order $ 10^{0} $ s, so the gap is $ 10^{17}/10^{0} = 10^{17} $ — seventeen orders of magnitude.'),
            num('p3-y6', 'Express 1 astronomical unit in kilometres, and give its order of magnitude.',
              '$ 1.496 \\times 10^{8} $ km; order of magnitude $ 10^{8} $ km',
              '$ 1\\ \\text{AU} = 1.496 \\times 10^{11} $ m. Dividing by $ 10^{3} $ gives $ 1.496 \\times 10^{8} $ km. The front number 1.496 is below 5, so the order of magnitude stays at $ 10^{8} $ km.'),
            mcq('p3-y7', 'One square metre expressed in square centimetres is:',
              ['$ 10^{2}\\ \\text{cm}^{2} $', '$ 10^{3}\\ \\text{cm}^{2} $', '$ 10^{4}\\ \\text{cm}^{2} $', '$ 10^{6}\\ \\text{cm}^{2} $'], 2,
              'A metre is $ 10^{2} $ cm, and squaring squares the factor: $ (10^{2})^{2} = 10^{4} $. Answering $ 10^{2} $ forgets to square; answering $ 10^{6} $ cubes it instead.'),
            num('p3-y8', 'A nanometre is $ 10^{-9} $ m and an angstrom is $ 10^{-10} $ m. How many angstroms make one nanometre?',
              '10',
              '$ \\frac{10^{-9}}{10^{-10}} = 10^{-9-(-10)} = 10^{1} = 10 $. Watch the double negative — subtracting $ -10 $ adds 10.'),
            mcq('p3-y9', 'The diameter of a proton is about $ 10^{-15} $ m and the size of our galaxy about $ 10^{21} $ m. The number of orders of magnitude between them is:',
              ['6', '21', '36', '15'], 2,
              '$ \\frac{10^{21}}{10^{-15}} = 10^{21-(-15)} = 10^{36} $ — thirty-six orders of magnitude. Answering 6 comes from subtracting the digits without minding the signs.'),
            num('p3-y10', 'A tank holds 2.5 m³ of water. Express this in litres, given that $ 1\\ \\text{L} = 10^{-3}\\ \\text{m}^{3} $.',
              '2500 L',
              '$ \\frac{2.5\\ \\text{m}^{3}}{10^{-3}\\ \\text{m}^{3}\\ \\text{per L}} = 2.5 \\times 10^{3} = 2500 $ L. A cubic metre is a thousand litres — worth knowing by heart.'),
          ],
        },
      ],
    }),
  ],
};

// ── p4 · Changing the Ruler ──────────────────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'changing-the-ruler',
  title: 'Changing the Ruler',
  subtitle: 'Converting a quantity from one system of units to another',
  glossary: [
    { term: 'system of units', definition: 'A complete set of chosen units — one for mass, one for length, one for time, and so on. SI and CGS are two such systems.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'The gravitational constant is $ G = 6.67 \\times 10^{-11} $ in SI units. In the CGS system — grams, centimetres, seconds — its value is $ 6.67 \\times 10^{-8} $. The number moved by a factor of a thousand. Where did that thousand come from?',
      hint: 'G is not a length or a mass. It is a mixture of all three base units at once.',
      reveal: 'G carries one power of mass in the denominator, three powers of length on top and two powers of time below. Each of those base units changed size, and each change dragged the number with it.\n\nThis page is the method for tracking all of them at once, without guessing.',
    }),
    b('text', 1, {
      markdown: 'On page 1 you converted metres to centimetres with $ n_1 u_1 = n_2 u_2 $. That works when only **one** base unit is involved.\n\nMost quantities involve several at once. A joule is $ \\text{kg m}^{2}\\ \\text{s}^{-2} $ — change the system and mass, length and time all change together.\n\nSo we use the same relation, but with each base unit raised to its own power:\n\n$ n_1 [M_1^{a} L_1^{b} T_1^{c}] = n_2 [M_2^{a} L_2^{b} T_2^{c}] $\n\nwhich rearranges to the one line you will actually use:\n\n$ n_2 = n_1 \\left[\\frac{M_1}{M_2}\\right]^{a} \\left[\\frac{L_1}{L_2}\\right]^{b} \\left[\\frac{T_1}{T_2}\\right]^{c} $',
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'Note on scope',
      markdown: 'Converting between whole systems of units this way is **not** in the current NCERT chapter — NCERT gives the idea but not the machinery. It is standard JEE and NEET material and appears almost every year, so it is here.\n\nThe powers $ a $, $ b $, $ c $ are the quantity\'s **dimensions**, which get their own proper treatment on page 10. You can use them here without that theory — just read them off the unit.',
    }),
    b('step_solver', 3, {
      title: 'G from SI into CGS',
      problem: 'The gravitational constant is $ G = 6.67 \\times 10^{-11}\\ \\text{N m}^{2}\\ \\text{kg}^{-2} $ in SI. Find its value in the CGS system (gram, centimetre, second).',
      intro: 'Four lines. The only thinking is in the first one.',
      steps: [
        st('$ [G] = M^{-1} L^{3} T^{-2} $, so $ a = -1,\\ b = 3,\\ c = -2 $',
          'Read the powers of mass, length and time off the unit of G.', {
            why: 'Unpack $ \\text{N m}^{2}\\ \\text{kg}^{-2} $: the newton is $ \\text{kg m s}^{-2} $, so the whole thing is $ (\\text{kg m s}^{-2})(\\text{m}^{2})(\\text{kg}^{-2}) = \\text{kg}^{-1}\\ \\text{m}^{3}\\ \\text{s}^{-2} $. One negative power of mass, three of length, minus two of time.',
          }),
        st('$ \\frac{M_1}{M_2} = \\frac{1\\ \\text{kg}}{1\\ \\text{g}} = 10^{3}, \\quad \\frac{L_1}{L_2} = \\frac{1\\ \\text{m}}{1\\ \\text{cm}} = 10^{2}, \\quad \\frac{T_1}{T_2} = 1 $',
          'Write each old unit as a multiple of the new one. The second is the second in both systems, so that ratio is 1.', {
            check: {
              kind: 'mcq',
              prompt: 'How many grams make a kilogram, and so what is $ M_1/M_2 $?',
              options: ['100, so the ratio is $ 10^{2} $', '1000, so the ratio is $ 10^{3} $', '1000, so the ratio is $ 10^{-3} $', '10, so the ratio is 10'],
              answer_index: 1,
              feedback_right: 'Yes — the old unit is a thousand times the new one.',
              feedback_wrong: 'A kilogram is 1000 grams, and we want old-over-new, so the ratio is $ 10^{3} $.',
            },
          }),
        st('$ n_2 = 6.67 \\times 10^{-11} \\times (10^{3})^{-1} \\times (10^{2})^{3} \\times 1 $',
          'Substitute, each ratio raised to its own power.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Work out $ (10^{3})^{-1} \\times (10^{2})^{3} $ as a single power of ten. What is the exponent?',
              blank_answer: '3',
              feedback_right: 'Correct — $ 10^{-3} \\times 10^{6} = 10^{3} $.',
              feedback_wrong: 'A power of a power multiplies: $ (10^{3})^{-1} = 10^{-3} $ and $ (10^{2})^{3} = 10^{6} $. Together, $ 10^{-3+6} = 10^{3} $.',
            },
          }),
        st('$ n_2 = 6.67 \\times 10^{-11} \\times 10^{3} = 6.67 \\times 10^{-8} $',
          'So $ G = 6.67 \\times 10^{-8} $ dyne cm² g⁻² in CGS.', {
            why: 'The front number never moved. Only the power of ten did — because a change of units can only ever rescale a quantity, never reshape it.',
          }),
      ],
      now_you_try: {
        problem: 'The density of water is $ 1000\\ \\text{kg m}^{-3} $ in SI. Find its value in CGS units (g cm⁻³).',
        answer: '$ 1\\ \\text{g cm}^{-3} $',
        solution: 'Density has $ a = 1, b = -3, c = 0 $. So $ n_2 = 1000 \\times (10^{3})^{1} \\times (10^{2})^{-3} = 1000 \\times 10^{3} \\times 10^{-6} = 1 $. Which is exactly the number you already knew — one gram per cubic centimetre.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('When a quantity is converted from SI to CGS, which of these can change?',
          ['The physical size of the quantity', 'Only the number', 'Only the unit', 'Both the number and the unit'], 3,
          'The quantity itself never changes — that is the point. What changes is how we describe it: a new unit, and a new number to go with it.', 2),
        q('A quantity has $ a = 0, b = 1, c = -1 $. Converting from metres to centimetres while keeping seconds, the number will be:',
          ['100 times larger', '100 times smaller', 'Unchanged', '10 000 times larger'], 0,
          'This is a velocity. Only length changes, and it appears to the first power: $ n_2 = n_1 \\times (10^{2})^{1} = 100 n_1 $. A speed of 5 m s⁻¹ is 500 cm s⁻¹.', 2),
      ],
    }),
    b('step_solver', 5, {
      title: 'A brand-new system of units',
      problem: 'A calorie is about 4.2 J. Suppose we invent a system in which the unit of mass is $ \\alpha $ kg, the unit of length is $ \\beta $ m and the unit of time is $ \\gamma $ s. Show that a calorie has the value $ 4.2\\,\\alpha^{-1}\\beta^{-2}\\gamma^{2} $ in the new system.',
      intro: 'This is NCERT Exercise 1.3, and it looks frightening only because the new units are letters instead of numbers. The method does not change at all.',
      steps: [
        st('$ 1\\ \\text{cal} = 4.2\\ \\text{J} = 4.2\\ \\text{kg m}^{2}\\ \\text{s}^{-2} $, so $ a = 1,\\ b = 2,\\ c = -2 $',
          'A calorie is an energy, so read the powers off the joule.', {
            check: {
              kind: 'mcq',
              prompt: 'Energy in base units is $ \\text{kg m}^{2}\\ \\text{s}^{-2} $. What are $ a, b, c $?',
              options: ['$ 1, 2, 2 $', '$ 1, 2, -2 $', '$ 2, 1, -2 $', '$ 1, -2, 2 $'],
              answer_index: 1,
              feedback_right: 'Yes — one power of mass, two of length, minus two of time.',
              feedback_wrong: 'Read them straight off: kg to the 1, m to the 2, s to the −2.',
            },
          }),
        st('$ \\frac{M_1}{M_2} = \\frac{1\\ \\text{kg}}{\\alpha\\ \\text{kg}} = \\frac{1}{\\alpha}, \\quad \\frac{L_1}{L_2} = \\frac{1}{\\beta}, \\quad \\frac{T_1}{T_2} = \\frac{1}{\\gamma} $',
          'The new unit of mass is α kilograms, so one kilogram is 1/α of it. Same for the other two.', {
            why: 'Students trip here by writing α instead of 1/α. Say it out loud: "the old unit, measured in new units." One kilogram is a fraction 1/α of the new mass unit.',
          }),
        st('$ n_2 = 4.2 \\times \\left(\\frac{1}{\\alpha}\\right)^{1} \\left(\\frac{1}{\\beta}\\right)^{2} \\left(\\frac{1}{\\gamma}\\right)^{-2} $',
          'Substitute, each with its own power.'),
        st('$ n_2 = 4.2\\ \\alpha^{-1}\\beta^{-2}\\gamma^{2} $',
          'The negative power flips the gamma up. That is the required result.', {
            why: 'Notice that γ finished with a **positive** power even though time had a negative one. Two negatives met and cancelled. Whenever the exponent c is negative, expect the new time unit to end up upstairs.',
          }),
      ],
      now_you_try: {
        problem: 'In a system where the unit of mass is 10 kg, the unit of length is 1 km and the unit of time is 1 minute, what is the value of 1 joule?',
        answer: '$ 3.6 \\times 10^{-4} $ new units',
        solution: 'Energy has $ a = 1, b = 2, c = -2 $.\n\n$ n_2 = 1 \\times \\left(\\frac{1}{10}\\right)^{1}\\left(\\frac{1}{1000}\\right)^{2}\\left(\\frac{1}{60}\\right)^{-2} $\n\n$ = 10^{-1} \\times 10^{-6} \\times 3600 = 3.6 \\times 10^{-4} $.',
      },
    }),
    b('callout', 6, {
      variant: 'exam_tip',
      title: 'The three-second sanity check',
      markdown: 'After every conversion, ask: **did the number move the way it should?**\n\nIf you moved to smaller units, the number must get bigger. If you moved to bigger units, it must get smaller.\n\nDensity of water: 1000 in SI, 1 in CGS. The CGS units of mass and length are both smaller — but density is mass **over** volume, and the volume shrank far more, so the number came down. If your sign instinct and your algebra disagree, redo the algebra; but if they agree, you can move on with confidence.',
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('In a new system the unit of mass is 1 quintal (100 kg), the unit of length is 1 km and the unit of time is 1 hour. The value of 1 newton in this system is:',
          ['1 new unit', '129.6 new units', '427.6 new units', '60 new units'], 1,
          'Force has $ a = 1, b = 1, c = -2 $. So $ n_2 = 1 \\times \\frac{1}{100} \\times \\frac{1}{1000} \\times \\left(\\frac{1}{3600}\\right)^{-2} = 10^{-5} \\times 1.296 \\times 10^{7} = 129.6 $.', 3),
        q('Which of these quantities keeps the **same number** in SI and in CGS?',
          ['Force', 'Density of water', 'Any dimensionless quantity', 'Energy'], 2,
          'If all the exponents a, b, c are zero, every ratio is raised to the power zero and the number cannot change. That is exactly what dimensionless means — strain, refractive index and any pure ratio keep their value in every system.', 3),
      ],
    }),
    b('practice_bank', 8, {
      title: 'You solve it',
      intro: 'Write the exponents down first every time. That habit is what makes these quick.',
      sections: [
        {
          id: 'p4-ysi',
          title: 'Converting between systems',
          items: [
            num('p4-y1', 'Convert $ 1\\ \\text{kg m}^{2}\\ \\text{s}^{-2} $ into $ \\text{g cm}^{2}\\ \\text{s}^{-2} $.',
              '$ 10^{7}\\ \\text{g cm}^{2}\\ \\text{s}^{-2} $',
              'Here $ a = 1, b = 2, c = -2 $, and only mass and length change.\n\n$ n_2 = 1 \\times (10^{3})^{1} \\times (10^{2})^{2} = 10^{3} \\times 10^{4} = 10^{7} $.'),
            num('p4-y2', 'A vehicle moves at $ 18\\ \\text{km h}^{-1} $. Express this in $ \\text{m s}^{-1} $, and hence say how far it travels in 1 s.',
              '$ 5\\ \\text{m s}^{-1} $, so 5 m in one second',
              '$ 18\\ \\text{km h}^{-1} = \\frac{18 \\times 1000\\ \\text{m}}{3600\\ \\text{s}} = 5\\ \\text{m s}^{-1} $. In one second it covers 5 m. (This is NCERT Exercise 1.1(c).)'),
            mcq('p4-y3', 'Converting an acceleration of $ 3.0\\ \\text{m s}^{-2} $ into $ \\text{km h}^{-2} $ gives:',
              ['$ 3.9 \\times 10^{4}\\ \\text{km h}^{-2} $', '$ 3.9 \\times 10^{3}\\ \\text{km h}^{-2} $', '$ 1.08 \\times 10^{4}\\ \\text{km h}^{-2} $', '$ 8.3 \\times 10^{-4}\\ \\text{km h}^{-2} $'], 0,
              'Acceleration has $ b = 1, c = -2 $. $ n_2 = 3.0 \\times 10^{-3} \\times (3600)^{2} = 3.0 \\times 10^{-3} \\times 1.296 \\times 10^{7} = 3.888 \\times 10^{4} \\approx 3.9 \\times 10^{4} $. (NCERT Exercise 1.2(c).)'),
            num('p4-y4', 'The relative density of lead is 11.3. Given that the density of water is $ 1\\ \\text{g cm}^{-3} $, find the density of lead in (a) $ \\text{g cm}^{-3} $ and (b) $ \\text{kg m}^{-3} $.',
              '(a) $ 11.3\\ \\text{g cm}^{-3} $  (b) $ 1.13 \\times 10^{4}\\ \\text{kg m}^{-3} $',
              'Relative density is a pure ratio, so density of lead = 11.3 × density of water = 11.3 g cm⁻³.\n\nTo convert: $ a = 1, b = -3 $, going from CGS to SI, so $ n_2 = 11.3 \\times (10^{-3})^{1} \\times (10^{-2})^{-3} = 11.3 \\times 10^{-3} \\times 10^{6} = 1.13 \\times 10^{4} $. (NCERT Exercise 1.1(d).)'),
            mcq('p4-y5', 'The ratio of the SI unit to the CGS unit of the modulus of rigidity is:',
              ['$ 10^{-1} $', '$ 10^{-2} $', '$ 10 $', '$ 10^{2} $'], 2,
              'Modulus of rigidity has the same units as pressure, so the SI unit is $ \\text{kg m}^{-1}\\text{s}^{-2} $ and the CGS unit is $ \\text{g cm}^{-1}\\text{s}^{-2} $.\n\nCompare them factor by factor: the kilogram is $ 10^{3} $ grams, and $ \\text{m}^{-1} $ is $ (10^{2}\\ \\text{cm})^{-1} = 10^{-2}\\ \\text{cm}^{-1} $. The seconds match.\n\n$ \\frac{\\text{SI unit}}{\\text{CGS unit}} = 10^{3} \\times 10^{-2} = 10 $.'),
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'You can now write a quantity in any units you like.\n\nThe next question is harder and more honest: **how many digits of it are you actually entitled to write down?**',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p0, p1, p2, p3, p4]);
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
