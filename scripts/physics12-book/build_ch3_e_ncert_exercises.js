'use strict';
/**
 * Class 12 Physics · Ch.3 "Current Electricity" — page 17, NCERT Exercises.
 *
 * Every exercise from the end of the NCERT chapter, transcribed verbatim
 * (Rule 0) and worked in full from first principles. Two items are skipped
 * or trimmed because they depend on a circuit-network figure not available
 * to this script — see the callout on the page itself.
 *
 * Run: node scripts/physics12-book/build_ch3_e_ncert_exercises.js
 */
const { b, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 3;
const SRC = 'ncert_exercise';

const p17 = {
  page_number: 17,
  slug: 'ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'Every exercise from the chapter, transcribed and worked in full',
  page_type: 'lesson',
  blocks: [
    b('text', 0, {
      markdown: 'These are the exercises printed at the end of the NCERT chapter on Current Electricity, word for word. Work each one on paper before you check the solution — reading a worked answer feels like learning and is not.\n\nThey are grouped by theme rather than by number, so related ideas sit together.',
    }),
    b('callout', 1, {
      variant: 'note',
      title: 'Two items are skipped for lack of a figure',
      markdown: 'NCERT Exercise **3.9** needs the actual circuit-network diagram (Fig 3.30) — the branch topology cannot be safely guessed from text alone, so it is left out entirely.\n\nExercise **3.20(c)** needs the network diagrams of Fig 3.31. Parts (a) and (b) of 3.20 do not need a figure and are included below.\n\nEverything else from the chapter is here.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises 3.1 – 3.24',
      intro: 'Twenty-three exercises across five themes. Commit to an answer before you reveal the solution.',
      sections: [
        // ── A · Resistivity, temperature and Ohm's law ──────────────────────
        {
          id: 'ncert-a-resistivity',
          title: "A · Resistivity, temperature and Ohm's law",
          blurb: 'Exercises 3.5, 3.6, 3.7, 3.8, 3.16, 3.17.',
          items: [
            num('ncert-3-5', 'At room temperature (27.0 °C) the resistance of a heating element is 100 Ω. What is the temperature of the element if the resistance is found to be 117 Ω, given that the temperature coefficient of the material of the resistor is $ 1.70 \\times 10^{-4}\\ ^\\circ\\text{C}^{-1} $.',
              '1027 °C',
              '$ R = R_0[1 + \\alpha(T - T_0)] $\n\n$ 117 = 100[1 + (1.70\\times10^{-4})(T-27)] $\n\n$ 1.17 = 1 + (1.70\\times10^{-4})(T-27) $\n\n$ 0.17 = (1.70\\times10^{-4})(T-27) $\n\n$ T - 27 = \\frac{0.17}{1.70\\times10^{-4}} = 1000 $\n\n$ T = 1027\\ ^\\circ\\text{C} $\n\nA heating element genuinely does run this hot — a clean, round $ 1000^\\circ $ rise, which is a useful check that the algebra went through correctly.',
              SRC, 'NCERT Ex 3.5'),
            num('ncert-3-6', 'A negligibly small current is passed through a wire of length 15 m and uniform cross-section $ 6.0 \\times 10^{-7}\\ \\text{m}^{2} $, and its resistance is measured to be 5.0 Ω. What is the resistivity of the material at the temperature of the experiment?',
              '$ 2.0 \\times 10^{-7}\\ \\Omega\\,\\text{m} $',
              '$ R = \\rho\\frac{l}{A} \\quad\\Rightarrow\\quad \\rho = \\frac{RA}{l} $\n\n$ \\rho = \\frac{(5.0)(6.0\\times10^{-7})}{15} = \\frac{3.0\\times10^{-6}}{15} = 2.0\\times10^{-7}\\ \\Omega\\,\\text{m} $\n\nThat value sits in the range of manganin — a low, near-temperature-independent resistivity, exactly the alloy this chapter keeps returning to for standard resistors.',
              SRC, 'NCERT Ex 3.6'),
            num('ncert-3-7', 'A silver wire has a resistance of 2.1 Ω at 27.5 °C, and a resistance of 2.7 Ω at 100 °C. Determine the temperature coefficient of resistivity of silver.',
              'about $ 3.9 \\times 10^{-3}\\ ^\\circ\\text{C}^{-1} $',
              '$ R_2 = R_1[1 + \\alpha(T_2 - T_1)] $\n\n$ 2.7 = 2.1[1 + \\alpha(100 - 27.5)] $\n\n$ \\frac{2.7}{2.1} = 1 + \\alpha(72.5) $\n\n$ 1.2857 - 1 = 72.5\\,\\alpha $\n\n$ \\alpha = \\frac{0.2857}{72.5} = 3.9\\times10^{-3}\\ ^\\circ\\text{C}^{-1} $\n\nThat is a typical metallic value, of the same order as copper — the sanity check for a "determine $ \\alpha $" question like this one.',
              SRC, 'NCERT Ex 3.7'),
            num('ncert-3-8', 'A heating element using nichrome connected to a 230 V supply draws an initial current of 3.2 A which settles after a few seconds to a steady value of 2.8 A. What is the steady temperature of the heating element if the room temperature is 27.0 °C? Temperature coefficient of resistance of nichrome averaged over the temperature range involved is $ 1.70 \\times 10^{-4}\\ ^\\circ\\text{C}^{-1} $.',
              'about 867 °C',
              'The initial current is drawn the instant the supply switches on, before the element has heated up — so it fixes the resistance at room temperature. The steady current fixes the resistance at the hot working temperature. Both readings share the same voltage, so their ratio is simply the inverse ratio of the currents:\n\n$ \\frac{R_T}{R_{27}} = \\frac{V/I_2}{V/I_1} = \\frac{I_1}{I_2} = \\frac{3.2}{2.8} = \\frac{8}{7} $\n\nNow apply the temperature relation:\n\n$ \\frac{R_T}{R_{27}} = 1 + \\alpha(T-27) $\n\n$ \\frac{8}{7} - 1 = \\frac{1}{7} = (1.70\\times10^{-4})(T-27) $\n\n$ T - 27 = \\frac{1/7}{1.70\\times10^{-4}} \\approx 840 $\n\n$ T \\approx 867\\ ^\\circ\\text{C} $\n\nNichrome genuinely glows red at this working temperature — which is also why it is chosen: a high melting point and strong resistance to oxidation, at exactly the temperatures this calculation predicts.',
              SRC, 'NCERT Ex 3.8'),
            num('ncert-3-16', 'Two wires of equal length, one of aluminium and the other of copper have the same resistance. Which of the two wires is lighter? Hence explain why aluminium wires are preferred for overhead power cables. ($ \\rho_{Al} = 2.63\\times10^{-8}\\ \\Omega\\,\\text{m} $, $ \\rho_{Cu} = 1.72\\times10^{-8}\\ \\Omega\\,\\text{m} $, relative density of Al $ = 2.7 $, of Cu $ = 8.9 $.)',
              'The aluminium wire is lighter — about 0.46 times the mass of the copper wire',
              'Equal length and equal resistance means, since $ R=\\rho l/A $, that the two wires must have their cross-sections in the same ratio as their resistivities:\n\n$ \\frac{A_{Al}}{A_{Cu}} = \\frac{\\rho_{Al}}{\\rho_{Cu}} = \\frac{2.63\\times10^{-8}}{1.72\\times10^{-8}} = 1.53 $\n\nThe aluminium wire needs a fatter cross-section to match copper\'s resistance — expected. Now compare mass, which is (relative density) $ \\times A \\times l $, with $ l $ common to both:\n\n$ \\frac{m_{Al}}{m_{Cu}} = \\frac{2.7\\times A_{Al}}{8.9\\times A_{Cu}} = \\frac{2.7}{8.9}\\times1.53 = 0.30\\times1.53 \\approx 0.46 $\n\nEven with its fatter cross-section, the aluminium wire comes out under half the mass of the copper wire for the *same* resistance and length. That is exactly why long-distance overhead cables use aluminium: less weight means less sag and less load on every supporting tower, and the material saving more than pays for the extra thickness of wire needed.',
              SRC, 'NCERT Ex 3.16'),
            num('ncert-3-17', 'What conclusion can you draw from the following observations on a resistor made of alloy manganin?\n\n| Current (A) | 0.2 | 0.4 | 0.6 | 0.8 | 1.0 | 2.0 | 3.0 | 4.0 | 5.0 | 6.0 | 7.0 | 8.0 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| Voltage (V) | 3.94 | 7.87 | 11.8 | 15.7 | 19.7 | 39.4 | 59.2 | 78.8 | 98.6 | 118.5 | 138.2 | 158.0 |',
              '$ V/I $ stays close to 19.7 Ω across the whole range — manganin obeys Ohm\'s law well, and its resistance is essentially unaffected by the current (and the heating) through it',
              'Work out $ V/I $ for every pair:\n\n| I (A) | 0.2 | 0.4 | 0.6 | 0.8 | 1.0 | 2.0 | 3.0 | 4.0 | 5.0 | 6.0 | 7.0 | 8.0 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| V/I (Ω) | 19.70 | 19.68 | 19.67 | 19.63 | 19.70 | 19.70 | 19.73 | 19.70 | 19.72 | 19.75 | 19.74 | 19.75 |\n\nEvery ratio sits within about half a percent of $ 19.7\\ \\Omega $, all the way from 0.2 A up to 8.0 A — a fortyfold increase in current. That spread is well within ordinary meter-reading scatter, not a genuine trend.\n\n**The conclusion: manganin obeys Ohm\'s law faithfully — $ V $ is proportional to $ I $, with a constant resistance of about $ 19.7\\ \\Omega $.** Nothing in this data shows the resistance drifting with current.\n\nThat constancy is itself the point of the exercise: even though a current as large as 8 A puts real heating into this resistor, the resistance barely moves. That is precisely why manganin (like constantan) is chosen for standard resistance coils and resistance boxes — its temperature coefficient of resistance is so small that its stated value can be trusted even while current flows through it, unlike an ordinary metal such as copper or tungsten, whose resistance climbs noticeably as it warms.',
              SRC, 'NCERT Ex 3.17'),
          ],
        },
        // ── B · Cells, emf and internal resistance ──────────────────────────
        {
          id: 'ncert-b-cells',
          title: 'B · Cells, emf and internal resistance',
          blurb: 'Exercises 3.1, 3.2, 3.11, 3.14, 3.15.',
          items: [
            num('ncert-3-1', 'The storage battery of a car has an emf of 12 V. If the internal resistance of the battery is 0.4 Ω, what is the maximum current that can be drawn from the battery?',
              '30 A',
              'The current is largest when the external resistance is zero — a short circuit — so the whole emf appears across the internal resistance alone.\n\n$ I_{max} = \\frac{\\varepsilon}{r} = \\frac{12}{0.4} = 30\\ \\text{A} $\n\nThat is also the current a genuine short circuit would draw, which is exactly why car batteries are treated with respect.',
              SRC, 'NCERT Ex 3.1'),
            num('ncert-3-2', 'A battery of emf 10 V and internal resistance 3 Ω is connected to a resistor. If the current in the circuit is 0.5 A, what is the resistance of the resistor? What is the terminal voltage of the battery when the circuit is closed?',
              'R = 17 Ω; terminal voltage = 8.5 V',
              '$ \\varepsilon = I(R+r) $\n\n$ 10 = 0.5(R+3) $\n\n$ 20 = R + 3 \\quad\\Rightarrow\\quad R = 17\\ \\Omega $\n\nTerminal voltage is the emf minus the drop lost inside the cell:\n\n$ V = \\varepsilon - Ir = 10 - (0.5)(3) = 8.5\\ \\text{V} $\n\nCheck: $ V $ should also equal $ IR = 0.5 \\times 17 = 8.5\\ \\text{V} $ ✓',
              SRC, 'NCERT Ex 3.2'),
            num('ncert-3-11', 'A storage battery of emf 8.0 V and internal resistance 0.5 Ω is being charged by a 120 V dc supply using a series resistor of 15.5 Ω. What is the terminal voltage of the battery during charging? What is the purpose of having a series resistor in the charging circuit?',
              '11.5 V',
              'During charging, the external 120 V supply drives current backwards through the battery, against its own emf. The current is the net voltage divided by the total resistance in the loop:\n\n$ I = \\frac{120-8.0}{15.5+0.5} = \\frac{112}{16} = 7.0\\ \\text{A} $\n\nBecause current is now being forced *into* the battery\'s positive terminal — the opposite of normal discharge — the terminal voltage now *exceeds* the emf by the internal drop, rather than falling short of it:\n\n$ V = \\varepsilon + Ir = 8.0 + (7.0)(0.5) = 11.5\\ \\text{V} $\n\nThe series resistor limits this charging current to a safe value. Without it, the only resistance in the loop would be the battery\'s own tiny internal resistance, and the current would be dangerously large — $ \\frac{112}{0.5} = 224\\ \\text{A} $ — enough to damage the battery.',
              SRC, 'NCERT Ex 3.11'),
            num('ncert-3-14', "The earth's surface has a negative surface charge density of $ 10^{-9}\\ \\text{C m}^{-2} $. The potential difference of 400 kV between the top of the atmosphere and the surface results (due to the low conductivity of the lower atmosphere) in a current of only 1800 A over the entire globe. If there were no mechanism of sustaining atmospheric electric field, how much time (roughly) would be required to neutralise the earth's surface? (Radius of earth $ = 6.37\\times10^{6} $ m.)",
              'about 283 s, roughly 4.7 minutes',
              "First find the total charge spread over the earth's surface:\n\n$ Q = \\sigma\\times(4\\pi R^{2}) $\n\n$ 4\\pi R^{2} = 4\\pi(6.37\\times10^{6})^{2} = 5.10\\times10^{14}\\ \\text{m}^{2} $\n\n$ Q = (10^{-9})(5.10\\times10^{14}) = 5.10\\times10^{5}\\ \\text{C} $\n\nA steady current of 1800 A carries away charge at that rate, so the time to remove all of it is:\n\n$ t = \\frac{Q}{I} = \\frac{5.10\\times10^{5}}{1800} \\approx 283\\ \\text{s} $\n\nUnder five minutes — which is the whole point of the question. The 400 kV field and the small but steady leakage current would empty the earth's charge almost immediately if nothing replenished it. Since the earth plainly stays charged, something must be constantly recharging it — worldwide thunderstorm activity, which pumps negative charge back onto the surface faster than this leakage removes it.",
              SRC, 'NCERT Ex 3.14'),
            num('ncert-3-15', '(a) Six lead-acid type of secondary cells each of emf 2.0 V and internal resistance 0.015 Ω are joined in series to provide a supply to a resistance of 8.5 Ω. What are the current drawn from the supply and its terminal voltage?\n\n(b) A secondary cell after long use has an emf of 1.9 V and a large internal resistance of 380 Ω. What maximum current can be drawn from the cell? Could the cell drive the starting motor of a car?',
              '(a) I ≈ 1.40 A, terminal voltage ≈ 11.87 V  (b) $ 5\\times10^{-3} $ A — far too small to drive a starter motor',
              '(a) In series, emfs add and internal resistances add:\n\n$ \\varepsilon_{total} = 6\\times2.0 = 12.0\\ \\text{V}, \\qquad r_{total} = 6\\times0.015 = 0.09\\ \\Omega $\n\n$ I = \\frac{\\varepsilon_{total}}{R+r_{total}} = \\frac{12.0}{8.5+0.09} = \\frac{12.0}{8.59} \\approx 1.40\\ \\text{A} $\n\n$ V = IR = 1.40\\times8.5 \\approx 11.87\\ \\text{V} $\n\n(b) The largest current a cell can ever deliver is its short-circuit current — external resistance zero, so the whole emf falls across its own internal resistance:\n\n$ I_{max} = \\frac{\\varepsilon}{r} = \\frac{1.9}{380} = 5\\times10^{-3}\\ \\text{A} $\n\nA car\'s starting motor typically needs on the order of a hundred amperes for the brief cranking pulse. This aged cell cannot reach even a hundredth of an amp at its absolute best, so no — it could not drive a starting motor. A high internal resistance is a cell\'s way of announcing that it is worn out.',
              SRC, 'NCERT Ex 3.15'),
          ],
        },
        // ── C · Combining resistors and Kirchhoff's laws ────────────────────
        {
          id: 'ncert-c-networks',
          title: "C · Combining resistors and Kirchhoff's laws",
          blurb: 'Exercises 3.3, 3.4, 3.20.',
          items: [
            num('ncert-3-3', '(a) Three resistors 1 Ω, 2 Ω, and 3 Ω are combined in series. What is the total resistance of the combination?\n\n(b) If the combination is connected to a battery of emf 12 V and negligible internal resistance, obtain the potential drop across each resistor.',
              '(a) 6 Ω  (b) 2 V, 4 V and 6 V across the 1 Ω, 2 Ω and 3 Ω resistors respectively',
              '(a) In series, resistances simply add:\n\n$ R = 1 + 2 + 3 = 6\\ \\Omega $\n\n(b) The current is the same through every resistor in series:\n\n$ I = \\frac{12}{6} = 2\\ \\text{A} $\n\nSo the drops are $ V=IR $ for each:\n\n$ V_1 = 2\\times1 = 2\\ \\text{V}, \\quad V_2 = 2\\times2 = 4\\ \\text{V}, \\quad V_3 = 2\\times3 = 6\\ \\text{V} $\n\nCheck: $ 2+4+6 = 12\\ \\text{V} $, the full emf ✓ — every drop in a series loop must add back up to the supply.',
              SRC, 'NCERT Ex 3.3'),
            num('ncert-3-4', '(a) Three resistors 2 Ω, 4 Ω and 5 Ω are combined in parallel. What is the total resistance of the combination?\n\n(b) If the combination is connected to a battery of emf 20 V and negligible internal resistance, determine the current through each resistor, and the total current drawn from the battery.',
              '(a) about 1.05 Ω  (b) 10 A, 5 A and 4 A through the 2 Ω, 4 Ω and 5 Ω resistors; 19 A total',
              '(a) In parallel, conductances add:\n\n$ \\frac{1}{R} = \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{5} = \\frac{10+5+4}{20} = \\frac{19}{20} $\n\n$ R = \\frac{20}{19} \\approx 1.05\\ \\Omega $\n\nNote it comes out smaller than the smallest branch, as a parallel combination always must.\n\n(b) In parallel every branch sees the full 20 V:\n\n$ I_2 = \\frac{20}{2} = 10\\ \\text{A}, \\quad I_4 = \\frac{20}{4} = 5\\ \\text{A}, \\quad I_5 = \\frac{20}{5} = 4\\ \\text{A} $\n\nTotal current $ = 10+5+4 = 19\\ \\text{A} $.\n\nCheck against the equivalent resistance: $ I = \\frac{20}{20/19} = 19\\ \\text{A} $ ✓',
              SRC, 'NCERT Ex 3.4'),
            num('ncert-3-20', '(a) Given n resistors each of resistance R, how will you combine them to get the (i) maximum (ii) minimum effective resistance? What is the ratio of the maximum to minimum resistance?\n\n(b) Given the resistances of 1 Ω, 2 Ω, 3 Ω, how will you combine them to get an equivalent resistance of (i) (11/3) Ω (ii) (11/5) Ω, (iii) 6 Ω, (iv) (6/11) Ω?',
              '(a) all n in series gives max = nR; all n in parallel gives min = R/n; the ratio is n²  (b) (i) 3 Ω in series with (1 Ω ∥ 2 Ω) (ii) 1 Ω in series with (2 Ω ∥ 3 Ω) (iii) all three in series (iv) all three in parallel',
              '(a) Series resistances add, so putting all $ n $ resistors in series gives the biggest possible total: $ R_{max}=nR $. Parallel resistances combine below every branch, so putting all $ n $ in parallel gives the smallest possible total: $ R_{min}=R/n $.\n\n$ \\frac{R_{max}}{R_{min}} = \\frac{nR}{R/n} = n^{2} $\n\n(b) With only three values to try, test the two natural building blocks first — all three in series ($ 1+2+3=6\\ \\Omega $) and all three in parallel ($ \\frac{1}{R}=1+\\frac{1}{2}+\\frac{1}{3}=\\frac{11}{6} \\Rightarrow R=\\frac{6}{11}\\ \\Omega $) — which immediately answers (iii) and (iv). For the other two targets, try one resistor in series with the parallel pair of the other two:\n\n$ 3+(1\\parallel2) = 3+\\frac{1\\times2}{1+2} = 3+\\frac{2}{3} = \\frac{11}{3}\\ \\Omega $ — this is (i).\n\n$ 1+(2\\parallel3) = 1+\\frac{2\\times3}{2+3} = 1+\\frac{6}{5} = \\frac{11}{5}\\ \\Omega $ — this is (ii).',
              SRC, 'NCERT Ex 3.20'),
          ],
        },
        // ── D · The potentiometer and meter bridge ──────────────────────────
        {
          id: 'ncert-d-potentiometer',
          title: 'D · The potentiometer and meter bridge',
          blurb: 'Exercises 3.10, 3.12, 3.21, 3.22, 3.23, 3.24.',
          items: [
            num('ncert-3-10', '(a) In a metre bridge, the balance point is found to be at 39.5 cm from the end A, when the resistor Y is of 12.5 Ω. Determine the resistance of X. Why are the connections between resistors in a Wheatstone or meter bridge made of thick copper strips?\n\n(b) Determine the balance point of the bridge above if X and Y are interchanged.\n\n(c) What happens if the galvanometer and cell are interchanged at the balance point of the bridge? Would the galvanometer show any current?',
              '(a) X ≈ 8.2 Ω; thick strips keep the connecting-wire resistance negligible  (b) balance point moves to 60.5 cm from A  (c) the bridge stays balanced — the galvanometer shows no current',
              '(a) With $ X $ in the left gap (near end A) and $ Y $ in the right gap, the meter-bridge balance condition is\n\n$ \\frac{X}{Y} = \\frac{l}{100-l} $\n\n$ X = Y\\cdot\\frac{l}{100-l} = 12.5\\times\\frac{39.5}{60.5} = 8.16\\ \\Omega \\approx 8.2\\ \\Omega $\n\nThick copper strips are used for the connecting wires so their own resistance is negligible next to $ X $, $ Y $ and the bridge wire. If the connecting wires carried appreciable resistance of their own, it would sneak into the balance condition and bias every measurement.\n\n(b) Interchanging $ X $ and $ Y $ simply swaps which side is "small" and which is "large", so the balance point reflects to the other side of the wire:\n\n$ l\' = 100 - l = 100 - 39.5 = 60.5\\ \\text{cm from A} $\n\n(c) The bridge stays exactly as balanced as before, and the galvanometer still shows no current. A balanced Wheatstone bridge is symmetric in exactly this way: swapping the galvanometer arm and the cell arm does not disturb the null, because at balance neither branch carries any current to begin with — there is nothing for the swap to change.',
              SRC, 'NCERT Ex 3.10'),
            num('ncert-3-12', 'In a potentiometer arrangement, a cell of emf 1.25 V gives a balance point at 35.0 cm length of the wire. If the cell is replaced by another cell and the balance point shifts to 63.0 cm, what is the emf of the second cell?',
              '2.25 V',
              'A potentiometer balances an emf against a potential gradient that is the same all along the wire, so emf is directly proportional to balance length:\n\n$ \\frac{\\varepsilon_2}{\\varepsilon_1} = \\frac{l_2}{l_1} $\n\n$ \\varepsilon_2 = 1.25\\times\\frac{63.0}{35.0} = 1.25\\times1.8 = 2.25\\ \\text{V} $',
              SRC, 'NCERT Ex 3.12'),
            num('ncert-3-21', 'Determine the current drawn from a 12 V supply with internal resistance 0.5 Ω by the infinite network shown in the figure, where each resistor has 1 Ω resistance and the network extends infinitely.',
              'about 5.7 A (equivalent network resistance ≈ 1.62 Ω)',
              'This is the classic "infinite ladder" trick: because the network repeats forever, removing the very first rung leaves a network that looks exactly like the original — so if $ R $ is the resistance of the *whole* infinite network, the network after that first rung must also equal $ R $.\n\nFor this ladder, the first rung is one $ 1\\ \\Omega $ resistor in series, feeding a node where a second $ 1\\ \\Omega $ resistor sits in parallel with the self-similar remainder $ R $:\n\n$ R = 1 + \\frac{1\\times R}{1+R} $\n\nMultiply out:\n\n$ R(1+R) = 1(1+R) + R $\n\n$ R+R^{2} = 1+R+R $\n\n$ R^{2} = 1+R \\quad\\Rightarrow\\quad R^{2}-R-1=0 $\n\n$ R = \\frac{1+\\sqrt{5}}{2} \\approx 1.62\\ \\Omega $\n\nAdding the source\'s own internal resistance:\n\n$ I = \\frac{12}{0.5+1.62} = \\frac{12}{2.12} \\approx 5.7\\ \\text{A} $',
              SRC, 'NCERT Ex 3.21'),
            num('ncert-3-22', 'A potentiometer has a cell of 2.0 V and internal resistance 0.40 Ω maintaining a potential drop across the resistor wire AB. A standard cell which maintains a constant emf of 1.02 V (for very moderate currents up to a few mA) gives a balance point at 67.3 cm length of the wire. To ensure very low currents drawn from the standard cell, a very high resistance of 600 kΩ is put in series with it, which is shorted close to the balance point. The standard cell is then replaced by a cell of unknown emf ε and the balance point found similarly, turns out to be at 82.3 cm length of the wire.\n\n(a) What is the value ε?\n\n(b) What purpose does the high resistance of 600 kΩ have?\n\n(c) Is the balance point affected by this high resistance?\n\n(d) Is the balance point affected by the internal resistance of the driver cell?\n\n(e) Would the method work in the above situation if the driver cell of the potentiometer had an emf of 1.0 V instead of 2.0 V?\n\n(f) Would the circuit work well for determining an extremely small emf, say of the order of a few mV (such as the typical emf of a thermo-couple)? If not, how will you modify the circuit?',
              '(a) ε ≈ 1.247 V  (b) protects the standard cell/galvanometer while roughly locating the balance point  (c) no  (d) no  (e) no  (f) no — a potential-divider arrangement is needed to get a much smaller gradient',
              '(a) The balance length is directly proportional to emf, since both cells are balanced against the same potential gradient:\n\n$ \\varepsilon = \\varepsilon_{std}\\times\\frac{l}{l_{std}} = 1.02\\times\\frac{82.3}{67.3} \\approx 1.247\\ \\text{V} $\n\n(b) The $ 600\\ \\text{k}\\Omega $ resistor keeps the current through the standard cell down to a few microamps while you are still hunting for the approximate balance point — the standard cell\'s emf is only trustworthy if you never draw more than a "few mA" from it, and a coarse search would otherwise risk overloading it. Once you are close, it is shorted out so the final precise null can be found without that resistance skewing the reading.\n\n(c) No. At the exact balance point, no current at all flows through the galvanometer branch — that is the definition of balance — so it makes no difference whether the $ 600\\ \\text{k}\\Omega $ is in circuit or shorted out at that instant. It changes how safely and quickly you *approach* balance, never where the null actually sits.\n\n(d) No. The internal resistance of the driver cell affects the current in the *primary* circuit — the loop through the potentiometer wire — and hence the potential gradient $ k $ along the wire. But that same gradient applies to both the standard-cell measurement and the unknown-cell measurement — one unchanging setup for the whole experiment. Since the answer in (a) is a *ratio* of two lengths measured under the identical gradient, whatever the gradient actually is cancels straight out of the calculation.\n\n(e) No. For a balance point to exist at all, the potential drop across the wire must exceed the emf being balanced against it. A 1.0 V driver cell, once its own internal drop is subtracted, cannot even produce 1.02 V across the wire — so it could never balance the standard cell, let alone the unknown one.\n\n(f) No. A millivolt-scale emf would need an extremely small potential gradient to balance at a sensible length along the wire — with this driver cell\'s gradient, a few mV would balance within the first few millimetres, which cannot be read precisely. The fix is a **potential divider**: tap off a small, known fraction of the driver cell\'s current through an additional series resistance in the primary circuit, so the drop over the working length of wire is reduced to the millivolt range, giving balance points that fall usefully far along the wire.',
              SRC, 'NCERT Ex 3.22'),
            num('ncert-3-23', 'A potentiometer circuit is used for comparison of two resistances. The balance point with a standard resistor R = 10.0 Ω is found to be 58.3 cm, while that with the unknown resistance X is 68.5 cm. Determine the value of X. What might you do if you failed to find a balance point with the given cell of emf ε?',
              'X ≈ 11.75 Ω; reduce the current through R and X (e.g. with a rheostat) so their voltage drops fit within the wire\'s range',
              'When comparing two resistances, the same current flows through $ R $ and $ X $ in series, so the voltage drop each balances against the wire is directly proportional to its resistance:\n\n$ \\frac{X}{R} = \\frac{l_X}{l_R} $\n\n$ X = R\\times\\frac{l_X}{l_R} = 10.0\\times\\frac{68.5}{58.3} \\approx 11.75\\ \\Omega $\n\nIf no balance point can be found, the drop $ IR $ or $ IX $ is too large to be matched anywhere along the wire — it would need a balance length longer than the wire itself. The fix is to reduce the current flowing through $ R $ and $ X $, for instance with a rheostat in that part of the circuit, which shrinks both drops until a balance point falls within the wire\'s length.',
              SRC, 'NCERT Ex 3.23'),
            num('ncert-3-24', 'A 2.0 V potentiometer is used for the determination of internal resistance of a 1.5 V cell. The balance point of the cell in open circuit is 76.3 cm. When a resistor of 9.5 Ω is used in the external circuit of the cell, the balance point shifts to 64.8 cm length of the potentiometer wire. Determine the internal resistance of the cell.',
              'r ≈ 1.7 Ω',
              'Open circuit balances the full emf; closed circuit (with the $ 9.5\\ \\Omega $ load connected) balances only the terminal voltage, since some of the emf is now lost across $ r $ itself:\n\n$ r = R\\left(\\frac{l_1-l_2}{l_2}\\right) $\n\n$ r = 9.5\\times\\frac{76.3-64.8}{64.8} = 9.5\\times\\frac{11.5}{64.8} \\approx 1.7\\ \\Omega $',
              SRC, 'NCERT Ex 3.24'),
          ],
        },
        // ── E · Conceptual and drift velocity ───────────────────────────────
        {
          id: 'ncert-e-conceptual',
          title: 'E · Conceptual — answer carefully',
          blurb: 'Exercises 3.13, 3.18, 3.19.',
          items: [
            num('ncert-3-13', 'The number density of free electrons in a copper conductor estimated in Example 3.1 is $ 8.5\\times10^{28}\\ \\text{m}^{-3} $. How long does an electron take to drift from one end of a wire 3.0 m long to its other end? The area of cross-section of the wire is $ 2.0\\times10^{-6}\\ \\text{m}^{2} $ and it is carrying a current of 3.0 A.',
              'about $ 2.7\\times10^{4} $ s, roughly 7.6 hours',
              '$ I = neAv_d \\quad\\Rightarrow\\quad v_d = \\frac{I}{neA} $\n\n$ v_d = \\frac{3.0}{(8.5\\times10^{28})(1.6\\times10^{-19})(2.0\\times10^{-6})} $\n\nThe denominator: $ (8.5\\times10^{28})(1.6\\times10^{-19}) = 1.36\\times10^{10} $, and $ \\times(2.0\\times10^{-6}) = 2.72\\times10^{4} $.\n\n$ v_d = \\frac{3.0}{2.72\\times10^{4}} = 1.10\\times10^{-4}\\ \\text{m/s} $\n\nTime to cross the wire:\n\n$ t = \\frac{l}{v_d} = \\frac{3.0}{1.10\\times10^{-4}} \\approx 2.7\\times10^{4}\\ \\text{s} $\n\nThat is about 7.6 hours for one electron to physically cross a 3 m wire — a striking number, and exactly why a bulb switching on instantly has nothing to do with how fast any individual electron travels. The signal that turns the whole circuit on is the electric field, and that establishes itself at close to the speed of light; the electrons themselves are barely crawling.',
              SRC, 'NCERT Ex 3.13'),
            num('ncert-3-18', 'Answer the following questions:\n\n(a) A steady current flows in a metallic conductor of non-uniform cross-section. Which of these quantities is constant along the conductor: current, current density, electric field, drift speed?\n\n(b) Is Ohm\'s law universally applicable for all conducting elements? If not, give examples of elements which do not obey Ohm\'s law.\n\n(c) A low voltage supply from which one needs high currents must have very low internal resistance. Why?\n\n(d) A high tension (HT) supply of, say, 6 kV must have a very large internal resistance. Why?',
              '(a) only the current  (b) no — e.g. a semiconductor diode, a thyristor, or an electrolyte with metal electrodes  (c) so its terminal voltage does not collapse under a large current draw  (d) so a short circuit cannot draw a dangerously large current',
              '(a) Charge cannot pile up anywhere along a steady current, so the same current $ I $ must pass every cross-section — the one quantity guaranteed constant. Current density $ J=I/A $, drift speed $ v_d $, and the electric field all rise wherever the conductor narrows, since $ A $ shrinks while $ I $ does not.\n\n(b) No. Ohm\'s law ($ V\\propto I $ at constant temperature) is a property of certain materials, not a law of nature. It fails for a semiconductor diode (current barely flows one way and surges the other), for gas-discharge tubes, thermistors, and electrolytes with metal electrodes — all of which give a distinctly non-straight-line $ V $–$ I $ graph.\n\n(c) A source\'s terminal voltage is $ V = \\varepsilon - Ir $. If the required current $ I $ is large, an internal resistance $ r $ that is not tiny would eat up a large chunk of the emf internally, and the terminal voltage would collapse well below what the load needs. A low $ r $ keeps $ Ir $ small even at high current.\n\n(d) The opposite concern: with a high voltage supply, an accidental short circuit ($ R\\to0 $) would drive a current $ I=\\varepsilon/r $. If $ r $ were small, that current would be enormous and destructive. A large internal resistance caps the worst-case short-circuit current to something the supply and the wiring can survive.',
              SRC, 'NCERT Ex 3.18'),
            num('ncert-3-19', 'Choose the correct alternative:\n\n(a) Alloys of metals usually have (greater/less) resistivity than that of their constituent metals.\n\n(b) Alloys usually have much (lower/higher) temperature coefficients of resistance than pure metals.\n\n(c) The resistivity of the alloy manganin is nearly independent of/increases rapidly with increase of temperature.\n\n(d) The resistivity of a typical insulator (e.g., amber) is greater than that of a metal by a factor of the order of ($ 10^{22}/10^{3} $).',
              '(a) greater  (b) lower  (c) nearly independent of  (d) $ 10^{22} $',
              '(a) **Greater.** Mixing atoms of different sizes into the same lattice scatters conduction electrons more than either pure metal does on its own — that disorder is exactly what raises the resistivity.\n\n(b) **Lower.** This is what makes alloys like manganin and constantan useful as standard resistors — their resistance barely drifts as they warm.\n\n(c) **Nearly independent of** temperature — the same fact restated, and the one exercise 3.17 on this page verified directly from real data.\n\n(d) **$ 10^{22} $.** A typical metal has a resistivity around $ 10^{-8}\\ \\Omega\\,\\text{m} $, while a good insulator sits around $ 10^{14}\\ \\Omega\\,\\text{m} $ or higher — a gap of about twenty-two orders of magnitude, among the largest ratios of any physical property between two classes of everyday material.',
              SRC, 'NCERT Ex 3.19'),
          ],
        },
      ],
    }),
    b('text', 3, {
      markdown: 'That is every solvable exercise from the NCERT chapter on Current Electricity. From here, the same moving charge that filled this chapter becomes the source of a magnetic field — the subject the book turns to next.',
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p17]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
