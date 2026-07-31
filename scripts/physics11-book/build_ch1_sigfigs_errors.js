'use strict';
/**
 * Class 11 Physics · Chapter 1 "Units and Dimensions" — pages 5–9.
 * Significant figures and error analysis.
 *
 * Scope note: the rationalised NCERT keeps significant figures in full but has
 * dropped the standalone error-analysis section, leaving only the compressed
 * §1.3.3. Pages 7–9 restore systematic/random error, absolute/relative/
 * percentage error and the combination rules for +, −, ×, ÷ and powers, which
 * are examined every year in JEE and NEET. Marked as enrichment on the page.
 *
 * Run: node scripts/physics11-book/build_ch1_sigfigs_errors.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch1');

// ── p5 · The Doubtful Digit ──────────────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'the-doubtful-digit',
  title: 'The Doubtful Digit',
  subtitle: 'Where significant figures come from, and how to count them',
  glossary: [
    { term: 'least count', definition: 'The smallest value an instrument can read directly. For an ordinary metre scale it is 1 mm.' },
    { term: 'significant figures', definition: 'All the digits of a measurement that are known reliably, plus the first digit that is uncertain.' },
    { term: 'precision', definition: 'How finely an instrument can measure — set by its least count.' },
    { term: 'accuracy', definition: 'How close a measurement is to the true value.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You lay an ordinary metre scale against a rod. The end of the rod falls between the 10.4 cm and 10.5 cm marks — closer to 10.5, but not on it. What do you write in your notebook?',
      hint: 'You are allowed to estimate. The question is how much you are allowed to estimate.',
      reveal: 'You split that last millimetre by eye and write something like **10.46 cm**.\n\nNow look hard at what you just did. The 1, the 0 and the 4 came straight off the scale — anyone measuring the same rod would read those same three digits. The **6 was your judgement**. Someone else might have written 10.45 or 10.47.\n\nSo your reading has three digits you can defend and one you are guessing at. That last one is the **doubtful digit**, and everything on this page grows out of it.',
    }),
    b('text', 1, {
      markdown: 'Every measurement ends in a doubtful digit. It has to — the scale has to stop somewhere, and your eye finishes the job.\n\nThe smallest division an instrument can read directly is its **least count**. For a metre scale that is 1 mm, so you can be certain to the millimetre and must estimate the tenth of a millimetre.\n\nThe digits you are entitled to write are called **significant figures**:\n\n> all the digits known reliably, **plus the first doubtful one**.\n\nWriting 10.4632 cm from a metre scale is not being careful. It is being dishonest — you are claiming three digits of judgement when you only made one.',
    }),
    b('inline_quiz', 2, {
      pass_threshold: 0.5,
      questions: [
        q('A metre scale has a least count of 1 mm. Which reading is honest?',
          ['8.4 cm', '8.43 cm', '8.4327 cm', '8 cm'], 1,
          'You can be certain to the millimetre (8.4 cm) and estimate one more digit by eye — so 8.43 cm. Writing 8.4327 cm claims three estimated digits from an instrument that supports one.', 2),
        q('In the reading 10.46 cm taken with a metre scale, the doubtful digit is:',
          ['1', '0', '4', '6'], 3,
          'The 1, 0 and 4 come straight off the millimetre marks. The final 6 is the fraction of a millimetre you judged by eye.', 1),
      ],
    }),
    b('callout', 3, {
      variant: 'warning',
      title: 'Precision and accuracy are not the same word',
      markdown: '**Precision** is how finely you can measure — it is fixed by the least count.\n\n**Accuracy** is how close you land to the true value.\n\nA screw gauge with a zero error is highly precise and badly inaccurate: it will give you 2.63 mm every time, reliably, and be wrong every time. More decimal places do not fix a bias. That distinction is worth a mark on its own in exams.',
    }),
    b('heading', 3, {
      text: 'Counting them',
      level: 2,
      objective: 'Count the significant figures in any measured value, including the awkward zeros.',
    }),
    b('text', 4, {
      markdown: 'Non-zero digits are always significant. The only difficulty is with **zeros**, because a zero does two completely different jobs: sometimes it is a measured digit, and sometimes it is just holding a decimal place.\n\nSort these yourself before reading the rules.',
    }),
    b('classify_exercise', 5, {
      question: 'In each case, is the zero (or group of zeros) described **significant** — that is, was it actually measured?',
      column_label: 'The zeros in question',
      verdict_label: 'Measured?',
      yes_label: '✓ Significant',
      no_label: '✗ Just a placeholder',
      rows: [
        { substance: 'The zero in 2.05 m', is_solution: true, explanation: 'Significant. A zero trapped between two non-zero digits was measured — you cannot skip it.' },
        { substance: 'The zeros in 0.0025 kg', is_solution: false, explanation: 'Not significant. They only push the digits into place after the decimal point. This value has just 2 significant figures — the 2 and the 5.' },
        { substance: 'The final zero in 3.50 cm', is_solution: true, explanation: 'Significant. There is a decimal point, so writing that zero is a deliberate claim: "I measured to the hundredth, and it was zero."' },
        { substance: 'The zeros in 4700 mm', is_solution: false, explanation: 'Ambiguous, so by convention not counted. Without a decimal point you cannot tell whether they were measured or are just placeholders — which is exactly why scientific notation exists.' },
        { substance: 'The zeros in 6.032 s', is_solution: true, explanation: 'Significant — sandwiched between non-zero digits again.' },
        { substance: 'The zero in 0.400 A', is_solution: true, explanation: 'The leading zero is a placeholder, but the two trailing zeros after the decimal are significant. This value has 3 significant figures.' },
      ],
    }),
    b('table', 6, {
      caption: 'The rules, once you have felt them.',
      headers: ['Rule', 'Example', 'Significant figures'],
      rows: [
        ['All non-zero digits count', '2567', '4'],
        ['Zeros between non-zero digits count', '6.028', '4'],
        ['In a number below 1, zeros before the first non-zero digit do not count', '0.0042', '2'],
        ['Trailing zeros with no decimal point are ambiguous — not counted', '4700 mm', '2 (by convention)'],
        ['Trailing zeros after a decimal point do count', '4.600', '4'],
        ['Changing the unit cannot change the count', '4.700 m = 470.0 cm', '4 either way'],
        ['The power of ten is irrelevant', '$ 2.30 \\times 10^{-3} $ km', '3'],
      ],
    }),
    b('text', 7, {
      markdown: 'Look at the last three rows together, because they are the trap.\n\n$ 4.700\\ \\text{m} = 470.0\\ \\text{cm} = 4700\\ \\text{mm} $\n\nAll three are the same measurement. The first two clearly show 4 significant figures. The third looks like 2 — but nothing was measured differently, so it cannot have fewer.\n\nThe cure is **scientific notation**. Write it as $ 4.700 \\times 10^{3} $ mm and the count is unmistakable. This is why physicists write everything as $ a \\times 10^{b} $.',
    }),
    b('callout', 8, {
      variant: 'remember',
      title: 'Exact numbers have infinite significant figures',
      markdown: 'In $ r = \\frac{d}{2} $, the 2 was not measured — it is exactly 2, by definition. The same goes for the $ 2\\pi $ in $ T = 2\\pi\\sqrt{L/g} $, and for a count of 20 oscillations.\n\nExact numbers never limit your significant figures. Only **measured** quantities do.',
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('The number of significant figures in 0.06032 is:',
          ['3', '4', '5', '6'], 1,
          'The leading zeros are placeholders and do not count. The significant digits are 6, 0, 3 and 2 — four of them.', 1),
        q('A measurement is written as $ 0.0310 \\times 10^{3} $. How many significant figures does it have?',
          ['2', '3', '4', '6'], 1,
          'The power of ten never affects the count. Within 0.0310, the leading zeros are placeholders while the 3, the 1 and the trailing 0 are significant — three in total.', 2),
        q('A student writes the length of a table as 1.2450 m using a metre scale of least count 1 mm. The main problem with this is:',
          ['It has too few significant figures for a careful measurement', 'The unit should have been millimetres, not metres', 'It claims more precision than the instrument can give', 'A trailing zero is never allowed after a decimal point'], 2,
          'A metre scale lets you be certain to the millimetre and estimate one more digit — so 1.245 m is the honest limit. The extra 0 claims a fifth digit the instrument cannot support.', 3),
      ],
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'Two students measure the same rod. One writes 5.7 cm and the other writes 5.70 cm. Are these the same measurement written two ways, or do they say different things?',
      reveal: 'They say **different** things.\n\n5.7 cm claims the 5 is certain and the 7 is doubtful — the rod is somewhere near 5.7, give or take about a millimetre.\n\n5.70 cm claims the 5 and the 7 are both certain and the final 0 is the doubtful one — the rod is near 5.70, give or take about a tenth of a millimetre.\n\nThe second student is claiming a ten times finer measurement. If they both used the same metre scale, one of them is lying. This is why you can never add or drop a trailing zero "to make it look neat".',
      difficulty_level: 3,
    }),
    b('practice_bank', 11, {
      title: 'You solve it',
      intro: 'Count first, then check. Speed here is worth real marks.',
      sections: [
        {
          id: 'p5-ysi',
          title: 'Counting significant figures',
          items: [
            num('p5-y1', 'State the number of significant figures in: (a) $ 0.007\\ \\text{m}^{2} $ (b) $ 2.64 \\times 10^{24}\\ \\text{kg} $ (c) $ 0.2370\\ \\text{g cm}^{-3} $ (d) 6.320 J (e) $ 6.032\\ \\text{N m}^{-2} $ (f) $ 0.0006032\\ \\text{m}^{2} $',
              '(a) 1  (b) 3  (c) 4  (d) 4  (e) 4  (f) 4',
              '(a) Only the 7 is significant.\n(b) The power of ten is ignored; 2, 6 and 4 remain.\n(c) The leading zero is a placeholder; 2, 3, 7 and the trailing 0 count.\n(d) All four digits, including the trailing zero after the decimal point.\n(e) The zero is sandwiched, so it counts.\n(f) The leading zeros are placeholders; 6, 0, 3 and 2 count.\n\n(This is NCERT Exercise 1.10.)',
              'ncert_exercise', 'NCERT Ex 1.10'),
            mcq('p5-y2', 'The significant figures in the number 6.0023 are:',
              ['2', '3', '4', '5'], 3,
              'Every digit is significant here — the two zeros sit between non-zero digits, so all five count.'),
            mcq('p5-y3', 'In which of these numbers are **all** the zeros significant?',
              ['0.2020', '20.2', '2020', 'None of these'], 1,
              'In 20.2 the single zero is sandwiched between non-zero digits, so it is significant — and it is the only zero present. In 0.2020 the leading zero is a placeholder, and in 2020 the trailing zero is ambiguous.'),
            num('p5-y4', 'A student measures a wire as 5.32 cm with an instrument of least count 0.01 cm. Which digits are certain and which is doubtful?',
              '5 and 3 are certain; 2 is doubtful',
              'The least count is 0.01 cm, so the instrument reads reliably down to the hundredth of a centimetre — but the last digit recorded is always the estimated one. Here 5.3 is read directly and the final 2 is the doubtful digit.'),
            mcq('p5-y5', 'A length is recorded as 2.30 m. Written in millimetres without scientific notation it becomes 2300 mm, which appears to have 2 significant figures. The correct conclusion is:',
              ['The measurement genuinely lost precision when it was converted', 'The count really is 2 in millimetres and 3 in metres', 'The count is still 3; the notation has become ambiguous', 'Trailing zeros should be removed whenever they are ambiguous'], 2,
              'A change of unit cannot change how carefully something was measured. The count stays at 3 — it is the plain decimal notation that has become ambiguous, which is fixed by writing $ 2.30 \\times 10^{3} $ mm.'),
          ],
        },
      ],
    }),
  ],
};

// ── p6 · Arithmetic Without Lying ────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'arithmetic-without-lying',
  title: 'Arithmetic Without Lying',
  subtitle: 'What to do with all the digits your calculator gives you',
  glossary: [
    { term: 'rounding off', definition: 'Dropping the digits a measurement does not justify, adjusting the last kept digit according to what was dropped.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You weigh a block as 4.237 g and measure its volume as 2.51 cm³. Density is mass divided by volume, and the calculator says 1.68804780876. How many of those digits are you allowed to write down?',
      hint: 'The answer cannot be more trustworthy than the worst measurement that went into it.',
      reveal: 'Three. The answer is **1.69 g cm⁻³**.\n\nThe volume was measured to only 3 significant figures, so it is the weak link. A chain is only as strong as its weakest link, and an answer is only as precise as its sloppiest input.\n\nWriting 1.68804780876 would be claiming eleven digits of precision from a measurement that supports three. That is not extra care — it is a false claim, and it loses marks.',
    }),
    b('text', 1, {
      markdown: 'Two rules cover everything, and they are **different** from each other. Mixing them up is one of the most common errors in the whole subject.',
    }),
    b('table', 2, {
      caption: 'The two rules. Note that they count different things.',
      headers: ['Operation', 'The answer keeps...', 'Because'],
      rows: [
        ['Multiplication and division', 'the fewest **significant figures** of any input', 'relative uncertainty is what multiplies'],
        ['Addition and subtraction', 'the fewest **decimal places** of any input', 'absolute uncertainty is what adds'],
      ],
    }),
    b('step_solver', 3, {
      title: 'Multiplying and dividing',
      problem: 'A block has mass 4.237 g and volume 2.51 cm³. Find its density to the correct number of significant figures.',
      intro: 'This is NCERT Example 1.1, worked the way you should work every numerical in physics: get the number, then decide how much of it to keep.',
      steps: [
        st('$ \\rho = \\frac{m}{V} = \\frac{4.237\\ \\text{g}}{2.51\\ \\text{cm}^{3}} = 1.68804780876\\ \\text{g cm}^{-3} $',
          'Do the arithmetic first, in full. Never round on the way in.', {
            check: {
              kind: 'mcq',
              prompt: 'How many significant figures does each measurement carry?',
              options: ['Mass 4, volume 3', 'Mass 3, volume 4', 'Mass 4, volume 4', 'Mass 3, volume 3'],
              answer_index: 0,
              feedback_right: 'Yes — 4.237 has four, and 2.51 has three.',
              feedback_wrong: 'Count the digits: 4, 2, 3, 7 is four significant figures; 2, 5, 1 is three.',
            },
          }),
        st('Fewest significant figures among the inputs $ = 3 $',
          'This is a division, so we count significant figures — not decimal places.', {
            why: 'The volume is the weak link. Improving your balance would not help this answer at all; only a better measurement of volume would.',
          }),
        st('$ \\rho = 1.69\\ \\text{g cm}^{-3} $',
          'Round the full answer to three significant figures.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Rounding 1.68804... to 3 significant figures: the digit after the 8 is another 8, so the 8 rounds up. What is the answer?',
              blank_answer: '1.69',
              feedback_right: 'Correct.',
              feedback_wrong: 'Keep 1, 6, 8 — then the next digit is 8, which is above 5, so the 8 becomes 9: 1.69.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A thin wire has length 21.7 cm and radius 0.46 mm. Find its volume to the correct number of significant figures. Take $ \\pi = \\frac{22}{7} $.',
        answer: '$ 0.14\\ \\text{cm}^{3} $',
        solution: 'Put the radius in centimetres first: $ 0.46\\ \\text{mm} = 0.046\\ \\text{cm} $.\n\n$ V = \\pi r^{2} l = \\frac{22}{7} \\times (0.046)^{2} \\times 21.7 = 0.1443\\ \\text{cm}^{3} $\n\nThe radius carries only 2 significant figures — the weakest input — so the volume is $ 0.14\\ \\text{cm}^{3} $.',
      },
    }),
    b('step_solver', 4, {
      title: 'Adding and subtracting — a different rule',
      problem: 'Add 436.32 g, 227.2 g and 0.301 g, keeping the correct number of digits.',
      intro: 'Here we count decimal places instead. The reason is worth understanding, not just memorising.',
      steps: [
        st('$ 436.32 + 227.2 + 0.301 = 663.821\\ \\text{g} $',
          'Add them all in full first.'),
        st('Decimal places: 2, then 1, then 3. The fewest is **1**.',
          'Look at where each measurement stops, not how many digits it has.', {
            check: {
              kind: 'mcq',
              prompt: 'Which of the three measurements is the least precise here?',
              options: ['436.32 g — it has the largest value', '227.2 g — it stops at the first decimal place', '0.301 g — it has the smallest value', 'They are equally precise'],
              answer_index: 1,
              feedback_right: 'Yes — 227.2 g is uncertain in the tenths, so the total cannot be better than that.',
              feedback_wrong: 'Precision is about where a measurement stops, not how big it is. 227.2 g stops at the tenths place, so its doubtful digit is the tenths.',
            },
          }),
        st('$ \\text{total} = 663.8\\ \\text{g} $',
          'Round to one decimal place.', {
            why: 'Think about why the rule changed. When you add, the actual uncertainties add — one measurement being doubtful in the tenths poisons the tenths of the total, no matter how carefully the others were made. When you multiply, it is the **percentage** uncertainties that add, and a percentage is what significant figures track.',
          }),
      ],
      now_you_try: {
        problem: 'The mass of a box is 2.3 kg. Two gold pieces of mass 20.15 g and 20.17 g are added. Give (a) the total mass and (b) the difference in the masses of the pieces, to the correct number of significant figures.',
        answer: '(a) 2.3 kg  (b) 0.02 g',
        solution: '(a) In kilograms the pieces are 0.02015 kg and 0.02017 kg, so the total is 2.34032 kg. The box mass 2.3 kg has only one decimal place in kg, so the total must be rounded to 2.3 kg.\n\n(b) $ 20.17 - 20.15 = 0.02 $ g. Both were measured to two decimal places, so the difference keeps two decimal places. (This is NCERT Exercise 1.12.)',
      },
    }),
    b('heading', 5, {
      text: 'Rounding, including the case everyone gets wrong',
      level: 2,
      objective: 'Round a number correctly, including when the dropped digit is exactly 5.',
    }),
    b('text', 6, {
      markdown: '- If the digit being dropped is **more than 5**, raise the digit before it. $ 2.746 \\to 2.75 $\n- If it is **less than 5**, leave the digit before it alone. $ 2.743 \\to 2.74 $\n- If it is **exactly 5**, round so that the digit before it ends up **even**. $ 2.745 \\to 2.74 $, but $ 2.735 \\to 2.74 $\n\nThat last rule looks arbitrary. It is not: always rounding 5 upward would push every long calculation slightly high. Rounding half the time up and half the time down keeps the errors cancelling.',
    }),
    b('callout', 7, {
      variant: 'exam_tip',
      title: 'Carry one extra digit through the middle',
      markdown: 'Round only at the **end**, never at each step.\n\nNCERT gives a lovely demonstration. Take $ 1/9.58 $. Rounded to three significant figures that is 0.104. Now take the reciprocal back: $ 1/0.104 = 9.62 $, not 9.58. The rounding lost something permanently.\n\nBut keep one extra digit — $ 1/9.58 = 0.1044 $ — and the reciprocal returns 9.58 exactly. So carry one spare digit through your working, and round once, at the end.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('$ 5.0 \\times 10^{-6} $ multiplied by $ 5.0 \\times 10^{-8} $, to the correct number of significant figures, is:',
          ['$ 25 \\times 10^{-14} $', '$ 2.5 \\times 10^{-13} $', '$ 2.50 \\times 10^{-13} $', '$ 250 \\times 10^{-15} $'], 1,
          'Both inputs have 2 significant figures, so the answer must too — which rules out $ 2.50 \\times 10^{-13} $. And scientific notation needs the front number between 1 and 10, which rules out both $ 25 \\times 10^{-14} $ and $ 250 \\times 10^{-15} $.', 2),
        q('Subtracting 0.2 J from 7.26 J gives, to the correct number of digits:',
          ['7.06 J', '7.1 J', '7 J', '7.060 J'], 1,
          'This is a subtraction, so decimal places decide. The value 0.2 J has only one decimal place, so the answer keeps one: 7.06 rounds to 7.1 J.', 2),
        q('Rounding 2.745 and 2.735 to three significant figures gives:',
          ['2.75 and 2.74', '2.74 and 2.74', '2.74 and 2.73', '2.75 and 2.73'], 1,
          'When the dropped digit is exactly 5, round so that the preceding digit becomes even. In 2.745 the 4 is already even, so it stays: 2.74. In 2.735 the 3 is odd, so it is raised to 4: 2.74.', 3),
      ],
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Decide which rule applies before you touch the arithmetic.',
      sections: [
        {
          id: 'p6-ysi',
          title: 'Arithmetic with significant figures',
          items: [
            num('p6-y1', 'The length, breadth and thickness of a rectangular sheet are 4.234 m, 1.005 m and 2.01 cm. Give the area and volume to the correct significant figures.',
              'Area $ = 8.72\\ \\text{m}^{2} $; volume $ = 0.0855\\ \\text{m}^{3} $',
              'First put the thickness in metres: 2.01 cm = 0.0201 m.\n\nTotal surface area $ = 2(lb + bt + tl) = 2(4.234 \\times 1.005 + 1.005 \\times 0.0201 + 0.0201 \\times 4.234) = 8.7209...\\ \\text{m}^{2} $. The thickness has only 3 significant figures, so the area is $ 8.72\\ \\text{m}^{2} $.\n\nVolume $ = 4.234 \\times 1.005 \\times 0.0201 = 0.0855\\ \\text{m}^{3} $, again to 3 significant figures. (NCERT Exercise 1.11.)',
              'ncert_exercise', 'NCERT Ex 1.11'),
            mcq('p6-y2', 'Three measurements are 18.425 cm, 7.21 cm and 5.0 cm. Their sum should be written as:',
              ['30.635 cm', '30.64 cm', '30.63 cm', '30.6 cm'], 3,
              'Addition, so decimal places decide. The value 5.0 cm has just one decimal place, so the sum 30.635 must be rounded to one: 30.6 cm.'),
            mcq('p6-y3', 'The radius of a thin wire is 0.16 mm. Its cross-sectional area in mm², to the correct significant figures, is:',
              ['0.08', '0.080', '0.0804', '0.080384'], 1,
              '$ A = \\pi r^{2} = 3.14 \\times (0.16)^{2} = 0.080384\\ \\text{mm}^{2} $. The radius has 2 significant figures, so the answer keeps 2: 0.080. Writing 0.08 would be careless — the trailing zero is needed to show two figures.'),
            num('p6-y4', 'A cube has a side of length $ 1.2 \\times 10^{-2} $ m. Calculate its volume with regard to significant figures.',
              '$ 1.7 \\times 10^{-6}\\ \\text{m}^{3} $',
              '$ V = l^{3} = (1.2 \\times 10^{-2})^{3} = 1.728 \\times 10^{-6}\\ \\text{m}^{3} $. The side has 2 significant figures, so the volume does too: $ 1.7 \\times 10^{-6}\\ \\text{m}^{3} $.'),
            mcq('p6-y5', 'Multiplying 107.88 by 0.610 and keeping the correct significant figures gives:',
              ['65.8068', '64.807', '65.81', '65.8'], 3,
              'The value 0.610 has 3 significant figures and 107.88 has 5, so the answer keeps 3. $ 107.88 \\times 0.610 = 65.8068 $, which rounds to 65.8.'),
          ],
        },
      ],
    }),
    b('text', 10, {
      markdown: 'Significant figures are a rough way of admitting uncertainty — they tell you roughly where a measurement stops being trustworthy.\n\nThe next three pages do it properly, with numbers.',
    }),
  ],
};

// ── p7 · Where Errors Come From ──────────────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'where-errors-come-from',
  title: 'Where Errors Come From',
  subtitle: 'Systematic and random error, and how to state an uncertainty',
  glossary: [
    { term: 'systematic error', definition: 'An error with a known cause that pushes every reading the same way. It can be found and corrected.' },
    { term: 'random error', definition: 'An unpredictable error that scatters readings both above and below the true value. Averaging reduces it.' },
    { term: 'absolute error', definition: 'The size of the difference between a reading and the accepted (mean) value, in the same units as the quantity.' },
    { term: 'relative error', definition: 'The mean absolute error divided by the mean value — a pure ratio, with no units.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'note',
      title: 'Note on scope',
      markdown: 'The current NCERT chapter no longer teaches error analysis as a separate section — only a short note inside significant figures.\n\nBut every JEE and NEET paper contains error questions, and the reasoning is genuinely useful in the laboratory. So the full treatment lives on this page and the next two. Nothing here contradicts NCERT; it extends it.',
    }),
    b('text', 1, {
      markdown: 'You measure the diameter of a wire five times and get:\n\n$ 2.620,\\quad 2.625,\\quad 2.630,\\quad 2.628,\\quad 2.626\\ \\text{cm} $\n\nFive readings, five different answers, one wire. Nobody was careless.\n\nBefore you read on: **which of these is the diameter?**',
    }),
    b('reasoning_prompt', 2, {
      reasoning_type: 'quantitative',
      prompt: 'Given those five readings, what single number would you report as the diameter — and can you defend the choice?',
      options: ['The first one, because it was taken most carefully', 'The middle one, 2.626 cm', 'The average of all five', 'The most common one'],
      reveal: 'The **average**.\n\nThe readings scatter both above and below some central value. If the scatter is genuinely random, then averaging lets the high readings cancel the low ones, and what survives is closer to the truth than any single reading.\n\n$ a_{\\text{mean}} = \\frac{2.620 + 2.625 + 2.630 + 2.628 + 2.626}{5} = 2.6258 \\approx 2.626\\ \\text{cm} $\n\nThis is why lab instructions always say "take several readings". It is not busywork — it is the only tool you have against random error.',
      difficulty_level: 2,
    }),
    b('heading', 3, {
      text: 'Two kinds of error, and only one of them averages away',
      level: 2,
      objective: 'Tell a systematic error from a random one, and say which can be removed.',
    }),
    b('comparison_card', 4, {
      title: 'Systematic vs random',
      columns: [
        {
          heading: 'Systematic error',
          points: [
            'Has a known cause, so it can be tracked down',
            'Pushes every reading the **same** way — always high, or always low',
            'Causes: a zero error in the instrument, a wrongly calibrated scale, ignoring air resistance, reading a scale from an angle',
            'Averaging does **not** help — all the readings are wrong in the same direction',
            'Fix it: correct the instrument, or correct the formula',
          ],
        },
        {
          heading: 'Random error',
          points: [
            'Cause is not known and cannot be traced',
            'Scatters readings **both** above and below the true value',
            'Causes: vibration, small changes in temperature, the limits of your own judgement of the doubtful digit',
            'Averaging **does** help — the scatter partly cancels',
            'Fix it: take more readings and take the mean',
          ],
        },
      ],
    }),
    b('step_solver', 5, {
      title: 'Which kind of error is this?',
      problem: 'A student times 10 swings of a pendulum five times and gets 18.2, 18.4, 18.1, 18.5 and 18.3 s. Their friend uses a stopwatch that always starts half a second late and gets 18.7, 18.9, 18.6, 19.0 and 18.8 s. Both sets scatter by the same amount. What is different about them?',
      intro: 'Telling the two kinds of error apart from data alone is a real exam skill, and it is easier than it looks — you compare the spread with the centre.',
      steps: [
        st('Student A: mean $ = 18.3 $ s, spread $ \\pm 0.2 $ s',
          'Work out the centre and the scatter for the first set.', {
            check: {
              kind: 'mcq',
              prompt: 'The five readings sit above and below 18.3 s in no particular pattern. What does that tell you?',
              options: ['There is a systematic error', 'The scatter is random', 'The stopwatch is broken', 'The mean is wrong'],
              answer_index: 1,
              feedback_right: 'Yes — scatter in both directions is the signature of random error.',
              feedback_wrong: 'Readings falling both above and below the centre, with no pattern, is exactly what random error looks like.',
            },
          }),
        st('Student B: mean $ = 18.8 $ s, spread $ \\pm 0.2 $ s',
          'Now the second set. The scatter is identical — but the centre has moved.', {
            why: 'This is the whole point. Look at the spread and you learn about **random** error. Look at where the centre sits compared with the true value and you learn about **systematic** error. They are two different questions about the same data.',
          }),
        st('$ 18.8 - 18.3 = 0.5\\ \\text{s} $ — exactly the late start',
          'The gap between the two means is the systematic error, and it matches the known fault.', {
            check: {
              kind: 'mcq',
              prompt: 'Student B takes 500 readings instead of 5 and averages them. What happens to the 0.5 s offset?',
              options: ['It shrinks by $ \\sqrt{100} $', 'It disappears completely', 'It stays exactly where it is', 'It doubles'],
              answer_index: 2,
              feedback_right: 'Correct — averaging cannot touch a systematic error.',
              feedback_wrong: 'Every one of those 500 readings is late by the same half second, so their average is late by half a second too. Only the random scatter shrinks.',
            },
          }),
        st('Random error: $ \\pm 0.2 $ s for both. Systematic error: 0 for A, $ +0.5 $ s for B.',
          'Two numbers, two different stories.', {
            why: 'And two different fixes. Student A can only improve by taking more readings. Student B should stop taking readings and fix the stopwatch — no amount of extra data will save that measurement.',
          }),
      ],
      now_you_try: {
        problem: 'A balance reads 0.3 g with nothing on the pan. A student weighs five identical coins and gets 4.8, 4.9, 4.7, 4.9 and 4.8 g. What is the true mean mass of a coin, and what kind of error did they remove?',
        answer: '4.5 g; they removed a systematic (zero) error',
        solution: 'Mean of the readings $ = \\frac{4.8 + 4.9 + 4.7 + 4.9 + 4.8}{5} = \\frac{24.1}{5} = 4.82 \\approx 4.8 $ g.\n\nEvery reading is 0.3 g too high because of the zero error, so the true mean is $ 4.8 - 0.3 = 4.5 $ g.\n\nThat correction removed a **systematic** error. The remaining scatter of about ±0.1 g is random, and only more readings would reduce it.',
      },
    }),
    b('callout', 6, {
      variant: 'warning',
      title: 'More readings help — but slowly',
      markdown: 'It is tempting to think that four times as many readings makes the error four times smaller. It does not.\n\nRandom error in the mean falls as $ \\frac{1}{\\sqrt{N}} $. So going from 100 readings to 400 — four times the work — only **halves** the error, because $ \\sqrt{4} = 2 $.\n\nThat is why laboratories chase systematic errors so hard. Removing a zero error is free; beating down random error costs you $ N $.',
    }),
    b('heading', 6, {
      text: 'Putting a number on the uncertainty',
      level: 2,
      objective: 'Compute absolute, mean absolute, relative and percentage error from a set of readings.',
    }),
    b('step_solver', 7, {
      title: 'The full calculation, once',
      problem: 'For the five readings 2.620, 2.625, 2.630, 2.628 and 2.626 cm, find the mean, the mean absolute error, the relative error and the percentage error, and state the final result.',
      intro: 'Every error question in the syllabus is some part of this one calculation. Do it slowly here and the rest become quick.',
      steps: [
        st('$ a_{\\text{mean}} = \\frac{2.620 + 2.625 + 2.630 + 2.628 + 2.626}{5} = 2.6258 \\approx 2.626\\ \\text{cm} $',
          'The mean is our best estimate of the true value.', {
            check: {
              kind: 'mcq',
              prompt: 'Why do we round the mean to 2.626 rather than keeping 2.6258?',
              options: ['To make the arithmetic easier', 'Because each reading was made to three decimal places, so the mean cannot be finer', 'Because 8 rounds down', 'We should have kept all the digits'],
              answer_index: 1,
              feedback_right: 'Exactly — an average cannot be more precise than the readings it came from.',
              feedback_wrong: 'Every reading stopped at the third decimal place, so the mean has no business claiming a fourth.',
            },
          }),
        st('$ |\\Delta a_1| = 0.006,\\ |\\Delta a_2| = 0.001,\\ |\\Delta a_3| = 0.004,\\ |\\Delta a_4| = 0.002,\\ |\\Delta a_5| = 0.000 $',
          'The absolute error of each reading is how far it sits from the mean. Take the size only — signs are dropped.', {
            why: 'If you kept the signs they would very nearly cancel, and you would conclude that a set of scattered readings has almost no error. That is obviously false, which is why we take magnitudes.',
          }),
        st('$ \\Delta a_{\\text{mean}} = \\frac{0.006 + 0.001 + 0.004 + 0.002 + 0.000}{5} = 0.0026 \\approx 0.003\\ \\text{cm} $',
          'The mean absolute error — the typical distance of a reading from the mean.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Add the five absolute errors: 0.006 + 0.001 + 0.004 + 0.002 + 0.000. What is the total?',
              blank_answer: '0.013',
              feedback_right: 'Yes — and dividing by 5 gives 0.0026.',
              feedback_wrong: 'Add carefully: 0.006 + 0.001 = 0.007, + 0.004 = 0.011, + 0.002 = 0.013, + 0.000 = 0.013.',
            },
          }),
        st('$ \\text{relative error} = \\frac{\\Delta a_{\\text{mean}}}{a_{\\text{mean}}} = \\frac{0.003}{2.626} \\approx 0.001 $',
          'Divide the error by the value. This is a pure number with no units.', {
            why: 'The relative error is the one that actually tells you whether a measurement is good. An error of 1 mm is excellent on a wall and hopeless on a wire — only the ratio says which.',
          }),
        st('$ \\text{percentage error} = 0.001 \\times 100 = 0.1\\% $',
          'The same thing as a percentage.'),
        st('$ d = (2.626 \\pm 0.003)\\ \\text{cm}, \\quad \\text{or} \\quad d = 2.626\\ \\text{cm} \\pm 0.1\\% $',
          'Both forms are accepted. The first gives the absolute error, the second the relative one.', {
            why: 'Writing the result without the ± is an incomplete answer. It says "the diameter is 2.626" and hides the fact that the last digit is a guess.',
          }),
      ],
      now_you_try: {
        problem: 'Five measurements of the refractive index of a glass slab give 1.49, 1.50, 1.52, 1.54 and 1.48. Find the mean value, the mean absolute error and the percentage error.',
        answer: 'Mean 1.51; mean absolute error 0.02; percentage error 1.32%',
        solution: 'Mean $ = \\frac{1.49 + 1.50 + 1.52 + 1.54 + 1.48}{5} = \\frac{7.53}{5} = 1.506 \\approx 1.51 $.\n\nAbsolute errors: 0.02, 0.01, 0.01, 0.03, 0.03. Their mean is $ \\frac{0.10}{5} = 0.02 $.\n\nRelative error $ = \\frac{0.02}{1.51} = 0.0132 $, so the percentage error is 1.32%.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A balance reads 0.5 g when nothing is placed on it. Every mass measured with it is therefore 0.5 g too high. This is:',
          ['A random error', 'A systematic error', 'A least count error', 'Not an error at all'], 1,
          'The cause is known and it pushes every single reading the same way, so it is systematic. Averaging more readings would not remove it — only correcting the zero would.', 1),
        q('Repeating a measurement many times and averaging is useful mainly against:',
          ['Systematic errors', 'Zero errors', 'Random errors', 'All errors equally'], 2,
          'Random errors scatter both ways, so they partly cancel in the mean. Systematic errors push one way and survive averaging untouched.', 2),
        q('Two measurements of length are $ (5.00 \\pm 0.05) $ m and $ (0.50 \\pm 0.05) $ m. Which is the better measurement, and why?',
          ['The first, because its value is larger', 'The second, because its value is smaller', 'The first, because its relative error is smaller', 'They are equally good, because the absolute errors are equal'], 2,
          'The absolute errors are the same, but relative error is what counts: 0.05/5.00 = 1%, while 0.05/0.50 = 10%. The first measurement is ten times better.', 3),
      ],
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Set out the mean first every time, then the absolute errors under it.',
      sections: [
        {
          id: 'p7-ysi',
          title: 'Stating an error properly',
          items: [
            num('p7-y1', 'The period of oscillation of a pendulum is measured five times: 2.63, 2.56, 2.42, 2.71 and 2.80 s. Find the mean period, the mean absolute error and the percentage error.',
              'Mean 2.62 s; mean absolute error 0.11 s; percentage error about 4%',
              'Mean $ = \\frac{2.63 + 2.56 + 2.42 + 2.71 + 2.80}{5} = \\frac{13.12}{5} = 2.624 \\approx 2.62 $ s.\n\nAbsolute errors: 0.01, 0.06, 0.20, 0.09, 0.18. Mean $ = \\frac{0.54}{5} = 0.108 \\approx 0.11 $ s.\n\nPercentage error $ = \\frac{0.11}{2.62} \\times 100 \\approx 4\\% $. The result is $ T = (2.62 \\pm 0.11) $ s.'),
            mcq('p7-y2', 'Which of these is a **random** error?',
              ['A stopwatch that consistently runs slow by 2 s in every minute', 'A metre scale whose zero end has been worn away by use', 'Small changes in your reaction time when starting a stopwatch', 'Ignoring air resistance in a pendulum experiment every time'], 2,
              'Reaction time varies unpredictably from trial to trial, sometimes early and sometimes late, so it scatters both ways. The other three all push every reading in the same direction and are systematic.'),
            num('p7-y3', 'A student takes 100 readings and finds a random error $ x $ in the mean. Roughly what random error would 400 readings give?',
              '$ x/2 $',
              'Random error in the mean falls as $ 1/\\sqrt{N} $. Multiplying the number of readings by 4 divides the error by $ \\sqrt{4} = 2 $, so the error becomes $ x/2 $ — not $ x/4 $.'),
            mcq('p7-y4', 'A measurement is quoted as $ (4.50 \\pm 0.05) $ cm. The percentage error is:',
              ['0.05%', '0.5%', '1.1%', '5%'], 2,
              '$ \\frac{0.05}{4.50} \\times 100 = 1.11\\% $. Dividing before multiplying by 100 is the whole calculation — the commonest slip is reading the 0.05 as a percentage already.'),
            num('p7-y5', 'The mean length of an object is 5 cm. Which of the measurements 4.9 cm, 4.805 cm, 5.25 cm and 5.4 cm is the most accurate, and why?',
              '4.9 cm',
              'Accuracy is about closeness to the accepted value, so compare the absolute errors: 0.1, 0.195, 0.25 and 0.4 cm. The smallest is 0.1 cm, so 4.9 cm is the most accurate — even though 4.805 cm is written with more digits. More decimal places means more *precise*, not more *accurate*.'),
            num('p7-y6', 'Four readings of a current are 1.52, 1.48, 1.51 and 1.49 A. Find the mean, the mean absolute error and the result in the form $ I \\pm \\Delta I $.',
              '$ I = (1.50 \\pm 0.02) $ A',
              'Mean $ = \\frac{1.52 + 1.48 + 1.51 + 1.49}{4} = \\frac{6.00}{4} = 1.50 $ A.\n\nAbsolute errors: 0.02, 0.02, 0.01, 0.01. Mean absolute error $ = \\frac{0.06}{4} = 0.015 \\approx 0.02 $ A.\n\nSo $ I = (1.50 \\pm 0.02) $ A, or $ 1.50 $ A ± 1.3%.'),
            mcq('p7-y7', 'A thermometer is graduated in whole degrees but the student always reads it from slightly above eye level, making every reading about 0.5 °C too low. Taking a hundred readings and averaging will:',
              ['Remove the error completely', 'Reduce the error to about a tenth', 'Leave the 0.5 °C offset untouched', 'Double the error'], 2,
              'The parallax error pushes every single reading the same way, so it is systematic. The average of a hundred readings that are each 0.5 °C low is itself 0.5 °C low. Only the random scatter shrinks with averaging.'),
            mcq('p7-y8', 'Which pair of terms is correctly matched?',
              ['Precision — closeness to the true value', 'Accuracy — set by the least count', 'Least count — the smallest value an instrument can read', 'Systematic error — scatters readings both ways'], 2,
              'Least count is the instrument\'s finest direct reading. The others are swapped: precision is what the least count sets, accuracy is closeness to the true value, and it is *random* error that scatters both ways.'),
            num('p7-y9', 'A measurement is quoted as $ (2.50 \\pm 0.05) $ m. Between what two values does the true length probably lie, and what is the percentage error?',
              'Between 2.45 m and 2.55 m; 2%',
              'The ± notation means the true value probably lies between $ 2.50 - 0.05 = 2.45 $ m and $ 2.50 + 0.05 = 2.55 $ m.\n\nPercentage error $ = \\frac{0.05}{2.50} \\times 100 = 2\\% $.'),
          ],
        },
      ],
    }),
  ],
};

// ── p8 · When Errors Combine — Sums and Products ─────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'when-errors-combine-sums-and-products',
  title: 'When Errors Combine — Sums and Products',
  subtitle: 'What happens to the uncertainty when measurements are put together',
  glossary: [
    { term: 'propagation of error', definition: 'Working out the uncertainty in a calculated result from the uncertainties in the measurements that went into it.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two volumes are measured as $ V_1 = (10.2 \\pm 0.02)\\ \\text{cm}^{3} $ and $ V_2 = (6.4 \\pm 0.01)\\ \\text{cm}^{3} $. You want their **difference**. What is the uncertainty in the answer — bigger or smaller than 0.02?',
      hint: 'The worst case is what matters. Think about which way each error could go.',
      reveal: 'It is **bigger**: $ \\pm 0.03 $.\n\nThis surprises almost everyone. Subtracting feels like it should cancel something, but errors never cancel — you have to allow for the worst case, where $ V_1 $ is at its highest and $ V_2 $ at its lowest. Then the difference is too big by $ 0.02 + 0.01 $.\n\nSo for both sums **and** differences, the absolute errors **add**.',
    }),
    b('heading', 1, {
      text: 'Rule 1 — adding or subtracting: absolute errors add',
      level: 2,
      objective: 'Find the uncertainty in a sum or difference of two measured quantities.',
    }),
    b('step_solver', 2, {
      title: 'Where the rule comes from',
      problem: 'If $ x = a + b $, where $ a $ has uncertainty $ \\Delta a $ and $ b $ has uncertainty $ \\Delta b $, find the largest possible uncertainty in $ x $.',
      intro: 'Two lines of algebra. Once you have seen them you will never wonder whether the errors add or subtract.',
      steps: [
        st('$ x \\pm \\Delta x = (a \\pm \\Delta a) + (b \\pm \\Delta b) $',
          'Write down what the measured values actually are — a range, not a point.'),
        st('$ x \\pm \\Delta x = (a + b) \\pm (\\Delta a + \\Delta b) $',
          'Group the certain parts and the uncertain parts separately.', {
            check: {
              kind: 'mcq',
              prompt: 'The four possible combinations of signs give $ +\\Delta a + \\Delta b $, $ +\\Delta a - \\Delta b $, $ -\\Delta a + \\Delta b $ and $ -\\Delta a - \\Delta b $. Which one is the worst case?',
              options: ['$ +\\Delta a - \\Delta b $', '$ -\\Delta a + \\Delta b $', '$ \\pm(\\Delta a + \\Delta b) $', 'They are all equally bad'],
              answer_index: 2,
              feedback_right: 'Right — the largest possible error is when both go the same way.',
              feedback_wrong: 'We must quote the worst case. That happens when both errors push in the same direction, giving $ \\Delta a + \\Delta b $.',
            },
          }),
        st('$ \\Delta x = \\Delta a + \\Delta b $',
          'And the same result comes out for $ x = a - b $.', {
            why: 'Work it through for the difference: $ (a \\pm \\Delta a) - (b \\pm \\Delta b) $. The $ \\pm $ on $ b $ flips, but $ \\pm $ flipped is still $ \\pm $ — so the worst case is again $ \\Delta a + \\Delta b $. **Subtraction never reduces the error.**',
          }),
      ],
      now_you_try: {
        problem: 'Two volumes are $ V_1 = (10.2 \\pm 0.02)\\ \\text{cm}^{3} $ and $ V_2 = (6.4 \\pm 0.01)\\ \\text{cm}^{3} $. Find their sum and their difference with error limits.',
        answer: 'Sum $ = (16.6 \\pm 0.03)\\ \\text{cm}^{3} $; difference $ = (3.8 \\pm 0.03)\\ \\text{cm}^{3} $',
        solution: 'The errors add in both cases: $ \\Delta V = 0.02 + 0.01 = 0.03\\ \\text{cm}^{3} $.\n\nSum: $ 10.2 + 6.4 = 16.6 $, so $ (16.6 \\pm 0.03)\\ \\text{cm}^{3} $.\n\nDifference: $ 10.2 - 6.4 = 3.8 $, so $ (3.8 \\pm 0.03)\\ \\text{cm}^{3} $.',
      },
    }),
    b('text', 3, {
      markdown: 'So the rule, now that you have derived it:\n\n$ \\text{if } x = a + b \\text{ or } x = a - b, \\text{ then } \\Delta x = \\Delta a + \\Delta b $\n\n**Absolute errors add, in both cases.** Subtracting two quantities does not subtract their uncertainties — it piles them up just the same.',
    }),
    b('callout', 4, {
      variant: 'warning',
      title: 'Why subtraction is dangerous',
      markdown: 'Look at that difference again: $ 3.8 \\pm 0.03 $. The absolute error stayed at 0.03, but the **value** dropped from 16.6 to 3.8.\n\nSo the relative error jumped from $ 0.03/16.6 = 0.2\\% $ to $ 0.03/3.8 = 0.8\\% $ — four times worse, from the same two measurements.\n\nThis is a real experimental lesson: **avoid finding a small quantity as the difference of two big ones.** The errors stay the same size while the answer shrinks under them.',
    }),
    b('heading', 5, {
      text: 'Rule 2 — multiplying or dividing: relative errors add',
      level: 2,
      objective: 'Find the percentage uncertainty in a product or a quotient.',
    }),
    b('step_solver', 6, {
      title: 'Where this rule comes from',
      problem: 'If $ x = ab $, find the largest possible relative error in $ x $.',
      intro: 'The same worst-case idea, but now one small quantity gets thrown away — and knowing which one, and why, is the point of this derivation.',
      steps: [
        st('$ x \\pm \\Delta x = (a \\pm \\Delta a)(b \\pm \\Delta b) $',
          'Start from the measured ranges again.'),
        st('$ x\\left(1 \\pm \\frac{\\Delta x}{x}\\right) = ab\\left(1 \\pm \\frac{\\Delta a}{a}\\right)\\left(1 \\pm \\frac{\\Delta b}{b}\\right) $',
          'Take $ a $ and $ b $ outside so every bracket is "1 plus a small fraction".', {
            why: 'This step is the whole trick. Once everything is written as a fraction of itself, the rule that falls out is about **relative** error — which is exactly the quantity that matters.',
          }),
        st('$ 1 \\pm \\frac{\\Delta x}{x} = 1 \\pm \\frac{\\Delta a}{a} \\pm \\frac{\\Delta b}{b} \\pm \\frac{\\Delta a}{a}\\cdot\\frac{\\Delta b}{b} $',
          'Multiply the two brackets out, using $ x = ab $ to cancel the front.', {
            check: {
              kind: 'mcq',
              prompt: 'If $ \\frac{\\Delta a}{a} $ and $ \\frac{\\Delta b}{b} $ are each about 1% (that is, 0.01), roughly how big is their product?',
              options: ['About 0.02, so it matters', 'About 0.0001, so it can be dropped', 'About 0.1', 'Exactly zero'],
              answer_index: 1,
              feedback_right: 'Yes — a small number times a small number is very small indeed.',
              feedback_wrong: '$ 0.01 \\times 0.01 = 0.0001 $, a hundred times smaller than either term. Next to 0.02 it is negligible.',
            },
          }),
        st('$ \\frac{\\Delta x}{x} = \\frac{\\Delta a}{a} + \\frac{\\Delta b}{b} $',
          'Drop the product of two small terms and take the worst case.', {
            why: 'And for a quotient $ x = a/b $ the derivation runs the same way and gives the same answer. Whether you multiply or divide, the **relative** errors add — never subtract.',
          }),
      ],
      now_you_try: {
        problem: 'The mass of a sphere is $ (12.4 \\pm 0.1) $ kg and its density is $ (4.6 \\pm 0.2)\\ \\text{kg m}^{-3} $. Find its volume with error limits.',
        answer: '$ V = (2.7 \\pm 0.14)\\ \\text{m}^{3} $',
        solution: '$ V = \\frac{m}{\\rho} = \\frac{12.4}{4.6} = 2.69 \\approx 2.7\\ \\text{m}^{3} $.\n\nThis is a division, so relative errors add:\n\n$ \\frac{\\Delta V}{V} = \\frac{0.1}{12.4} + \\frac{0.2}{4.6} = 0.0081 + 0.0435 = 0.0516 $\n\n$ \\Delta V = 0.0516 \\times 2.7 = 0.14\\ \\text{m}^{3} $. So $ V = (2.7 \\pm 0.14)\\ \\text{m}^{3} $.\n\nNotice the density contributed five times more error than the mass did. That is where you would spend your effort if you wanted a better answer.',
      },
    }),
    b('text', 7, {
      markdown: 'The second rule, then:\n\n$ \\text{if } x = ab \\text{ or } x = \\frac{a}{b}, \\text{ then } \\frac{\\Delta x}{x} = \\frac{\\Delta a}{a} + \\frac{\\Delta b}{b} $\n\n**Relative errors add**, whether you multiply or divide. Note carefully what changed: for sums it was the *absolute* errors that added, here it is the *relative* ones. Using the wrong one of these two is the most common error-analysis mistake there is.',
    }),
    b('step_solver', 8, {
      title: "NCERT's own example, in percentages",
      problem: 'A rectangular sheet has $ l = (16.2 \\pm 0.1) $ cm and $ b = (10.1 \\pm 0.1) $ cm. Find its area with the uncertainty.',
      intro: 'Working in percentages is usually faster than working in absolute errors. Learn both — questions ask for both.',
      steps: [
        st('$ \\text{area} = l \\times b = 16.2 \\times 10.1 = 163.62\\ \\text{cm}^{2} $',
          'The value first.'),
        st('$ \\frac{\\Delta l}{l} = \\frac{0.1}{16.2} = 0.6\\%, \\qquad \\frac{\\Delta b}{b} = \\frac{0.1}{10.1} = 1\\% $',
          'Turn each absolute error into a percentage of its own measurement.', {
            check: {
              kind: 'mcq',
              prompt: 'Both absolute errors are 0.1 cm. Why is the percentage error in $ b $ larger?',
              options: ['Because b was measured second', 'Because b is the smaller measurement, so 0.1 cm is a bigger slice of it', 'Because b has fewer significant figures', 'It is not larger — they are equal'],
              answer_index: 1,
              feedback_right: 'Exactly — the same absolute error hurts a small measurement more.',
              feedback_wrong: 'A 0.1 cm error in 10.1 cm is a bigger fraction than 0.1 cm in 16.2 cm. Relative error always depends on the size of the thing measured.',
            },
          }),
        st('$ \\frac{\\Delta A}{A} = 0.6\\% + 1\\% = 1.6\\% $',
          'It is a product, so the percentages add.'),
        st('$ \\Delta A = 1.6\\% \\text{ of } 163.62 = 2.6 \\approx 3\\ \\text{cm}^{2} $, so area $ = (164 \\pm 3)\\ \\text{cm}^{2} $',
          'Convert back to an absolute error, then round sensibly.', {
            why: 'The error is about 3 cm², so writing the area as 163.62 cm² would be absurd — the uncertainty is in the units digit. Round the value to match: 164 cm². **The error tells you how many digits to keep.** That is the real link between this page and significant figures.',
          }),
      ],
      now_you_try: {
        problem: 'The values of two resistors are $ (5.0 \\pm 0.2)\\ \\text{k}\\Omega $ and $ (10.0 \\pm 0.1)\\ \\text{k}\\Omega $. What is the percentage error in their **sum** (series combination)?',
        answer: '2%',
        solution: 'For a sum the absolute errors add: $ \\Delta R = 0.2 + 0.1 = 0.3\\ \\text{k}\\Omega $, and $ R = 15.0\\ \\text{k}\\Omega $.\n\nPercentage error $ = \\frac{0.3}{15.0} \\times 100 = 2\\% $.\n\nWatch the trap: you cannot add the individual percentage errors (4% and 1%) here, because this is a sum, not a product.',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('The length of a rod is $ (11.05 \\pm 0.2) $ cm. Two such rods are placed end to end. The total length is:',
          ['$ (22.1 \\pm 0.2) $ cm', '$ (22.1 \\pm 0.4) $ cm', '$ (22.10 \\pm 0.4) $ cm', '$ (22.1 \\pm 0.1) $ cm'], 1,
          'Adding two lengths means adding the absolute errors: $ 0.2 + 0.2 = 0.4 $ cm. The value 11.05 + 11.05 = 22.10 is written as 22.1 because the error is in the first decimal place.', 2),
        q('A body travels $ (13.8 \\pm 0.2) $ m in $ (4.0 \\pm 0.3) $ s. The percentage error in its speed is closest to:',
          ['1.4%', '7.5%', '8.9%', '0.5%'], 2,
          'Speed is a quotient, so relative errors add: $ \\frac{0.2}{13.8} + \\frac{0.3}{4.0} = 1.4\\% + 7.5\\% = 8.9\\% $. The time is by far the weaker measurement.', 3),
        q('Which experiment design is the most dangerous for accuracy?',
          ['Measuring one large length directly with a single instrument', 'Finding a small mass as the difference of two large masses', 'Timing 20 oscillations of a pendulum instead of just one', 'Repeating a reading many times and taking the average'], 1,
          'When a small quantity is found as the difference of two large ones, the absolute errors add while the result shrinks — so the relative error can become enormous. The other three all improve accuracy.', 3),
      ],
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Ask first: is this a sum or a product? The whole answer depends on that one decision.',
      sections: [
        {
          id: 'p8-ysi',
          title: 'Combining errors',
          items: [
            num('p8-y1', 'Two masses are $ (2.5 \\pm 0.1) $ kg and $ (1.2 \\pm 0.2) $ kg. Find (a) their sum and (b) their difference, with error limits.',
              '(a) $ (3.7 \\pm 0.3) $ kg  (b) $ (1.3 \\pm 0.3) $ kg',
              'Absolute errors add in both cases: $ 0.1 + 0.2 = 0.3 $ kg.\n\n(a) $ 2.5 + 1.2 = 3.7 $, giving $ (3.7 \\pm 0.3) $ kg.\n(b) $ 2.5 - 1.2 = 1.3 $, giving $ (1.3 \\pm 0.3) $ kg — note the relative error is much worse here, at 23% against 8%.'),
            mcq('p8-y2', 'The percentage errors in measuring the mass and the volume of a body are 2% and 3%. The percentage error in its density is:',
              ['1%', '1.5%', '5%', '6%'], 2,
              'Density is mass divided by volume, so the relative errors add: 2% + 3% = 5%. They do not subtract just because it is a division.'),
            num('p8-y3', 'The mass and volume of a body are found to be $ (5.00 \\pm 0.05) $ kg and $ (1.00 \\pm 0.05)\\ \\text{m}^{3} $. Find the maximum percentage error in its density.',
              '6%',
              '$ \\frac{\\Delta \\rho}{\\rho} = \\frac{\\Delta m}{m} + \\frac{\\Delta V}{V} = \\frac{0.05}{5.00} + \\frac{0.05}{1.00} = 0.01 + 0.05 = 0.06 $, which is 6%. Almost all of it comes from the volume.'),
            mcq('p8-y4', 'The resistance of a wire is found from $ R = V/I $. If the percentage errors in $ V $ and $ I $ are 3% each, the percentage error in $ R $ is:',
              ['zero', '1%', '3%', '6%'], 3,
              'Relative errors add for a quotient: 3% + 3% = 6%. Answering "zero" assumes the errors cancel because it is a division — they never do.',
              'jee_neet', 'AIEEE 2012'),
            num('p8-y5', 'A rectangle has sides $ (5.0 \\pm 0.1) $ cm and $ (2.0 \\pm 0.1) $ cm. Find its area with the absolute error, and state how many digits the area should be quoted to.',
              '$ (10.0 \\pm 0.7)\\ \\text{cm}^{2} $, so 2 significant figures',
              'Area $ = 5.0 \\times 2.0 = 10.0\\ \\text{cm}^{2} $.\n\nRelative errors add: $ \\frac{0.1}{5.0} + \\frac{0.1}{2.0} = 0.02 + 0.05 = 0.07 $, that is 7%.\n\n$ \\Delta A = 0.07 \\times 10.0 = 0.7\\ \\text{cm}^{2} $. Since the uncertainty is in the first decimal place, quoting more than 2 significant figures would be meaningless.'),
          ],
        },
      ],
    }),
  ],
};

// ── p9 · When Errors Combine — Powers ────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'when-errors-combine-powers',
  title: 'When Errors Combine — Powers',
  subtitle: 'Why the exponent is a multiplier on your carelessness',
  glossary: [
    { term: 'maximum permissible error', definition: 'The largest error a result could have, found by assuming every individual error pushes the same way.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You find $ g $ from a pendulum using $ T = 2\\pi\\sqrt{L/g} $. You measure the length to within 1% and the time period to within 2%. What is the percentage error in $ g $?',
      hint: 'Rearrange for g first and look at the powers.',
      reveal: '**5%** — not 3%.\n\nRearranging gives $ g = \\frac{4\\pi^{2}L}{T^{2}} $. The time appears **squared**, so its 2% error counts twice: $ 1\\% + 2 \\times 2\\% = 5\\% $.\n\nThat squared T is doing more damage than the length, even though the length was measured less carefully. **An exponent multiplies your error.** That single idea is the whole page.',
    }),
    b('callout', 1, {
      variant: 'note',
      title: 'Note on scope',
      markdown: 'This page is JEE and NEET enrichment — the rationalised NCERT does not give the power rule explicitly. It is one of the most reliably examined results in the chapter.',
    }),
    b('text', 2, {
      markdown: 'On the previous page, a product made the relative errors add. A power is just repeated multiplication, so it makes the relative error add to itself over and over.\n\nFor a quantity built as\n\n$ x = \\frac{a^{n}}{b^{m}} $\n\nthe maximum relative error is\n\n$ \\frac{\\Delta x}{x} = n\\frac{\\Delta a}{a} + m\\frac{\\Delta b}{b} $\n\nEvery power becomes a **multiplier**, and — as always — the terms **add**, whether the quantity sits upstairs or downstairs.',
    }),
    b('step_solver', 3, {
      title: 'Why the exponent multiplies',
      problem: 'Show that if $ x = a^{n} $, then $ \\frac{\\Delta x}{x} = n\\frac{\\Delta a}{a} $.',
      intro: 'You can see it without any calculus at all, just by writing the power out.',
      steps: [
        st('$ x = a^{n} = \\underbrace{a \\times a \\times \\cdots \\times a}_{n \\text{ times}} $',
          'A power is nothing more than the same measurement multiplied by itself.', {
            check: {
              kind: 'mcq',
              prompt: 'From the previous page, what happens to relative errors when quantities are multiplied?',
              options: ['They multiply', 'They add', 'They cancel', 'The largest one wins'],
              answer_index: 1,
              feedback_right: 'Yes — and that is all we need.',
              feedback_wrong: 'For a product, the relative errors add. That was Rule 2 on the previous page.',
            },
          }),
        st('$ \\frac{\\Delta x}{x} = \\underbrace{\\frac{\\Delta a}{a} + \\frac{\\Delta a}{a} + \\cdots + \\frac{\\Delta a}{a}}_{n \\text{ times}} $',
          'So its relative error gets added to itself n times.'),
        st('$ \\frac{\\Delta x}{x} = n\\frac{\\Delta a}{a} $',
          'Which is the rule.', {
            why: 'And it works for fractional powers too. A square root is a power of $ \\frac{1}{2} $, so it **halves** the relative error — which is why timing 20 oscillations and dividing is such a good idea, and why square-root relationships are forgiving.',
          }),
      ],
      now_you_try: {
        problem: 'The radius of a ball is measured as $ (5.2 \\pm 0.2) $ cm. Find the percentage error in its volume.',
        answer: 'About 11.5%',
        solution: '$ V = \\frac{4}{3}\\pi r^{3} $, so the radius appears cubed:\n\n$ \\frac{\\Delta V}{V} = 3\\frac{\\Delta r}{r} = 3 \\times \\frac{0.2}{5.2} = 3 \\times 0.0385 = 0.115 $, that is about 11.5%.\n\nA 3.8% error in the radius became an 11.5% error in the volume — tripled by the cube.',
      },
    }),
    b('step_solver', 4, {
      title: 'The pendulum, done properly',
      problem: 'In a pendulum experiment, the length is $ L = 20.0 $ cm measured to within 1 mm, and the time for 100 oscillations is 90 s measured with a watch of 1 s resolution. Find the percentage error in $ g $.',
      intro: 'This is the standard experiment and the standard question. Watch what happens to the error when you time many oscillations instead of one.',
      steps: [
        st('$ T = 2\\pi\\sqrt{\\frac{L}{g}} \\quad \\Rightarrow \\quad g = \\frac{4\\pi^{2}L}{T^{2}} $',
          'Rearrange for the quantity you actually want. Always do this before touching the errors.', {
            why: 'If you find the error in $ T $ and then guess at the error in $ g $, you will get it wrong. The exponents you need are the ones in the formula **for g**, not the formula for T.',
          }),
        st('$ \\frac{\\Delta g}{g} = \\frac{\\Delta L}{L} + 2\\frac{\\Delta T}{T} $',
          'L appears to the first power, T to the second — so T\'s error is doubled.'),
        st('$ \\frac{\\Delta T}{T} = \\frac{\\Delta t}{t} = \\frac{1}{90} $',
          'Here is the clever bit: the watch is uncertain by 1 s on the **total** time of 90 s, and dividing both by 100 to get one period leaves the ratio unchanged.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is timing 100 oscillations better than timing one?',
              options: ['The pendulum swings more accurately over time', 'The 1 s watch error is spread over a much larger total time, so the relative error is 100 times smaller', 'It removes systematic error', 'It makes T larger'],
              answer_index: 1,
              feedback_right: 'Exactly — the trick is entirely about shrinking the relative error.',
              feedback_wrong: 'The watch is out by about 1 s whether you time one swing or a hundred. Spread over 90 s that is 1.1%; over a single 0.9 s swing it would be 110%.',
            },
          }),
        st('$ \\frac{\\Delta g}{g} = \\frac{0.1}{20.0} + 2 \\times \\frac{1}{90} = 0.005 + 0.0222 = 0.0272 $',
          'Substitute. The length error is 1 mm on 20.0 cm, so use consistent units.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Convert 0.0272 to a percentage, to two decimal places.',
              blank_answer: '2.72',
              feedback_right: 'Yes — 2.72%.',
              feedback_wrong: 'Multiply by 100: 0.0272 × 100 = 2.72%.',
            },
          }),
        st('Percentage error in $ g $ is $ 2.72\\% $',
          'And notice where it came from.', {
            why: 'The time contributed 2.22% and the length only 0.5%. If you were given one more afternoon to improve this experiment, you would spend it on a better clock — not a better ruler. **The error calculation tells you what to fix.** That is what makes it worth doing.',
          }),
      ],
      now_you_try: {
        problem: 'In a simple pendulum experiment the maximum percentage error in the length is 2% and in the time period is 3%. Find the maximum percentage error in $ g $.',
        answer: '8%',
        solution: '$ g = \\frac{4\\pi^{2}L}{T^{2}} $, so $ \\frac{\\Delta g}{g} = \\frac{\\Delta L}{L} + 2\\frac{\\Delta T}{T} = 2\\% + 2(3\\%) = 8\\% $.',
      },
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'Read the exponents before you read anything else',
      markdown: 'Given $ P = \\frac{a^{3}b^{2}}{c\\sqrt{d}} $, do not panic and do not simplify. Just read the powers off and write:\n\n$ \\frac{\\Delta P}{P} = 3\\frac{\\Delta a}{a} + 2\\frac{\\Delta b}{b} + 1\\frac{\\Delta c}{c} + \\frac{1}{2}\\frac{\\Delta d}{d} $\n\nThree things to hold on to:\n\n- **Every term is a plus.** Nothing subtracts, no matter where it sits in the fraction.\n- **A square root is a power of one-half**, so it halves that error.\n- The quantity with the **largest** (power × error) is the one wrecking your experiment.',
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('If the error in measuring the diameter of a circle is 4%, the error in its radius is:',
          ['1%', '2%', '4%', '8%'], 2,
          'Radius = diameter / 2, and 2 is an exact number with no error. Dividing by an exact constant does not change the relative error at all — it stays 4%.', 2),
        q('A physical quantity is $ Q = \\frac{A^{3}B^{3}}{C\\sqrt{D}} $. If the percentage errors in A, B, C and D are 2%, 1%, 3% and 4%, the percentage error in Q is:',
          ['± 8%', '± 10%', '± 14%', '± 12%'], 2,
          '$ 3(2) + 3(1) + 1(3) + \\frac{1}{2}(4) = 6 + 3 + 3 + 2 = 14\\% $. Every term adds, and the square root contributes only half of D\'s error.', 3),
        q('The error in the measurement of the momentum of a particle is +100%. The error in its kinetic energy is:',
          ['100%', '200%', '300%', '400%'], 2,
          'This is a large change, so the small-error rule does not apply — work it out directly. $ K = \\frac{p^{2}}{2m} $, so doubling p makes K four times bigger. The change is from K to 4K, an increase of 3K, which is 300%.', 3),
      ],
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: "Young's modulus is found from $ Y = \\frac{4MLg}{\\pi l d^{2}} $, where $ l $ is the extension and $ d $ the wire's diameter. Both are measured with the same instrument, so both have the same absolute error. Which of the two contributes more to the error in $ Y $, and what would you do about it?",
      reveal: 'It depends on **both** the exponent and the size of the measurement — and this is exactly what makes the question interesting.\n\nThe diameter appears squared, so its relative error is doubled: $ 2\\frac{\\Delta d}{d} $ against $ \\frac{\\Delta l}{l} $ for the extension. On exponent alone, the diameter looks twice as damaging.\n\nBut the diameter of a thin wire is a very small number, so the same absolute error is already a much bigger fraction of it. Both effects push the same way, and the diameter usually dominates badly.\n\n**What to do:** measure the diameter with the finest instrument you have, and at several places along the wire. A JEE Advanced question from 2012 was built on exactly this comparison — with the numbers chosen so the two contributions came out equal, which only someone who had actually done the calculation could tell.',
      difficulty_level: 4,
    }),
    b('practice_bank', 8, {
      title: 'You solve it',
      intro: 'Read the exponents first, then substitute. Six items, rising in difficulty.',
      sections: [
        {
          id: 'p9-ysi',
          title: 'Powers and error propagation',
          items: [
            num('p9-y1', 'The side of a cube is measured with a 1% error. What is the percentage error in its volume?',
              '3%',
              '$ V = l^{3} $, so $ \\frac{\\Delta V}{V} = 3\\frac{\\Delta l}{l} = 3 \\times 1\\% = 3\\% $.'),
            mcq('p9-y2', 'A cuboid has volume $ V = l \\times 2l \\times 3l $. If the relative percentage error in measuring $ l $ is 1%, the relative percentage error in $ V $ is:',
              ['1%', '3%', '6%', '18%'], 1,
              'The numbers 2 and 3 are exact and carry no error. $ V = 6l^{3} $, so only the cube matters: $ 3 \\times 1\\% = 3\\% $.'),
            num('p9-y3', 'A force $ F $ is applied to a square plate of side $ L $. The percentage error in $ L $ is 2% and in $ F $ is 4%. Find the maximum percentage error in the pressure.',
              '8%',
              'Pressure $ = \\frac{F}{L^{2}} $, so $ \\frac{\\Delta P}{P} = \\frac{\\Delta F}{F} + 2\\frac{\\Delta L}{L} = 4\\% + 2(2\\%) = 8\\% $.'),
            mcq('p9-y4', 'The heat produced in a wire is $ H = i^{2}Rt $. If the errors in measuring $ i $, $ R $ and $ t $ are 1%, 2% and 1%, the maximum error in $ H $ is:',
              ['4%', '5%', '6%', '8%'], 1,
              '$ \\frac{\\Delta H}{H} = 2\\frac{\\Delta i}{i} + \\frac{\\Delta R}{R} + \\frac{\\Delta t}{t} = 2(1\\%) + 2\\% + 1\\% = 5\\% $. The current is squared, so its error counts twice.'),
            num('p9-y5', 'Two quantities are measured as $ A = (1.0 \\pm 0.2) $ m and $ B = (2.0 \\pm 0.2) $ m. What value should be reported for $ \\sqrt{AB} $?',
              '$ (1.4 \\pm 0.2) $ m',
              '$ Y = \\sqrt{AB} = \\sqrt{2.0} = 1.414 \\approx 1.4 $ m.\n\nBoth A and B carry a power of $ \\frac{1}{2} $, so\n\n$ \\frac{\\Delta Y}{Y} = \\frac{1}{2}\\left(\\frac{0.2}{1.0} + \\frac{0.2}{2.0}\\right) = \\frac{1}{2}(0.2 + 0.1) = 0.15 $\n\n$ \\Delta Y = 0.15 \\times 1.414 = 0.21 \\approx 0.2 $ m. So $ \\sqrt{AB} = (1.4 \\pm 0.2) $ m.'),
            mcq('p9-y6', 'A quantity is given by $ x = \\frac{ab^{2}}{c^{3}} $. The percentage errors in $ a $, $ b $ and $ c $ are 1%, 3% and 2%. The maximum percentage error in $ x $ is:',
              ['± 6%', '± 9%', '± 13%', '± 18%'], 2,
              'Read the exponents off: $ a $ to the power 1, $ b $ to the power 2, $ c $ to the power 3.\n\n$ \\frac{\\Delta x}{x} = 1(1\\%) + 2(3\\%) + 3(2\\%) = 1 + 6 + 6 = 13\\% $\n\nEvery term adds, including the one downstairs. Notice that $ c $ was measured better than $ b $ but still contributes just as much, because its exponent is larger.'),
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'That is measurement dealt with: units to describe a quantity, significant figures to write it honestly, and errors to say how far you trust it.\n\nNow for something different, and much more powerful. Strip a quantity of its numbers and its units altogether, and ask what it is **made of**.',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p5, p6, p7, p8, p9]);
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
