'use strict';
/**
 * Class 12 Physics · Ch.3 "Current Electricity" — page 16, Practice & Mastery.
 *
 * Items marked source 'ncert_exemplar' are adapted from NCERT Exemplar Physics
 * Class 12 ch.3. Everything else is source 'mcq' (no badge).
 *
 * Run: node scripts/physics12-book/build_ch3_d_practice.js
 */
const { b, mcq, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 3;
const EX = 'ncert_exemplar';

const p16 = {
  page_number: 16,
  slug: 'current-electricity-practice-and-mastery',
  title: 'Practice & Mastery',
  subtitle: 'Six sections, thirty-eight problems — draw the circuit before you calculate',
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'One habit is worth more than any formula on this page: **redraw the circuit and label the nodes before you write a single equation.**\n\nAlmost every wrong answer in this chapter comes from misreading the topology — deciding two resistors are in parallel when they are not — and not from misremembering a rule. Thirty seconds of relabelling saves five minutes of algebra that was doomed from the first line.',
    }),
    b('practice_bank', 1, {
      title: 'Current Electricity — the full set',
      intro: 'Sections follow the chapter in order. Commit to an answer before you reveal the solution.',
      sections: [
        // ── 1 · Current and drift ───────────────────────────────────────────
        {
          id: 'ch3-s1-current',
          title: '1 · Current, drift velocity and current density',
          blurb: 'Small numbers, enormous carrier counts.',
          items: [
            num('ch3-p01', 'A current of $ 2.0 $ A flows in a copper wire of cross-section $ 1.0\\ \\text{mm}^{2} $. Taking $ n = 8.5\\times10^{28}\\ \\text{m}^{-3} $, find the drift velocity and the current density.',
              '$ v_d = 1.5\\times10^{-4} $ m/s; $ J = 2.0\\times10^{6}\\ \\text{A/m}^{2} $',
              'Convert the area first: $ 1.0\\ \\text{mm}^{2} = 1.0\\times10^{-6}\\ \\text{m}^{2} $.\n\n$ v_d = \\frac{I}{neA} = \\frac{2.0}{(8.5\\times10^{28})(1.6\\times10^{-19})(1.0\\times10^{-6})} $\n\nDenominator: $ (8.5\\times10^{28})(1.6\\times10^{-19}) = 1.36\\times10^{10} $, then $ \\times 10^{-6} = 1.36\\times10^{4} $.\n\n$ v_d = 1.5\\times10^{-4}\\ \\text{m/s} $\n\n$ J = \\frac{I}{A} = \\frac{2.0}{1.0\\times10^{-6}} = 2.0\\times10^{6}\\ \\text{A/m}^{2} $\n\nA fifth of a millimetre per second, and two million amps per square metre. Both numbers are typical, and both are worth having a feel for.'),
            mcq('ch3-p02', 'Which property of the electrons determines the current in a conductor?',
              ['drift velocity alone', 'thermal velocity alone', 'both drift and thermal velocity', 'neither drift nor thermal velocity'],
              0,
              'The random thermal motion averages to zero over all the electrons and transports no net charge. Only the small superimposed drift contributes, through $ I = neAv_d $.',
              EX),
            mcq('ch3-p03', 'A wire carries a steady current and narrows along its length. Which quantity is the **same** at every cross-section?',
              ['the current', 'the current density', 'the drift velocity', 'the electric field'],
              0,
              'Charge cannot pile up, so the same current passes every section. But $ J = I/A $ rises where the wire is thin, and so do the drift velocity and the field.'),
            num('ch3-p04', 'An electron beam of cross-section $ 2.0\\ \\text{mm}^{2} $ carries $ 5.0\\times10^{16} $ electrons per second. Find the current and the current density.',
              '$ I = 8.0 $ mA; $ J = 4.0\\times10^{3}\\ \\text{A/m}^{2} $',
              '$ I = \\frac{ne}{t} = (5.0\\times10^{16})(1.6\\times10^{-19}) = 8.0\\times10^{-3}\\ \\text{A} $\n\n$ J = \\frac{I}{A} = \\frac{8.0\\times10^{-3}}{2.0\\times10^{-6}} = 4.0\\times10^{3}\\ \\text{A/m}^{2} $\n\nFifty thousand million million electrons a second is only eight milliamps — the coulomb being enormous, again.'),
            mcq('ch3-p05', 'In a current-carrying wire bent into a circle, the direction of the current density $ \\vec{J} $ changes continuously while the current $ I $ does not. The agent responsible is',
              ['the field of charge accumulated on the wire surface', 'the source of emf, acting on its own', 'the charges just behind each segment, pushing it round', 'the charges ahead of each segment, pulling it round'],
              0,
              'A small amount of charge accumulates on the wire surface wherever it curves, and the field of that surface charge is what steers the drift round the bend. The emf sets up the drive but cannot itself follow the geometry of the wire.',
              EX),
          ],
        },
        // ── 2 · Resistance and resistivity ──────────────────────────────────
        {
          id: 'ch3-s2-resistance',
          title: '2 · Resistance, resistivity and temperature',
          blurb: 'Separate the material from the shape — and watch for the word "stretched".',
          items: [
            mcq('ch3-p06', 'A wire is stretched until its length is doubled. Its resistance becomes',
              ['four times the original', 'twice the original', 'half the original', 'unchanged'],
              0,
              'Stretching conserves volume, so doubling the length also halves the cross-section. Both effects raise the resistance and $ R \\propto l^{2} $ gives a factor of four. Answering "twice" uses $ R \\propto l $ and forgets the thinning.'),
            num('ch3-p07', 'A metal rod is $ 10 $ cm long with a rectangular cross-section of $ 1\\ \\text{cm} \\times 0.5\\ \\text{cm} $. Across which pair of opposite faces is the resistance greatest?',
              'Across the two $ 1\\ \\text{cm} \\times 0.5\\ \\text{cm} $ faces — the small end faces.',
              '$ R = \\rho l/A $ is largest when $ l $ is largest and $ A $ smallest — and here those happen together.\n\nConnecting across the two **end** faces means the current travels the full $ 10 $ cm through the smallest area, $ 1 \\times 0.5 = 0.5\\ \\text{cm}^{2} $:\n\n$ \\frac{l}{A} = \\frac{10}{0.5} = 20\\ \\text{cm}^{-1} $\n\nAcross the $ 10 \\times 1 $ faces: $ l = 0.5 $ cm, $ A = 10\\ \\text{cm}^{2} $, so $ l/A = 0.05\\ \\text{cm}^{-1} $.\n\nAcross the $ 10 \\times 0.5 $ faces: $ l = 1 $ cm, $ A = 5\\ \\text{cm}^{2} $, so $ l/A = 0.2\\ \\text{cm}^{-1} $.\n\nThe end faces win by a factor of a hundred. **The lesson: always identify which dimension the current has to travel along** — that is $ l $, and the other two give $ A $.',
              EX),
            num('ch3-p08', 'A wire has resistance $ 20\\ \\Omega $ at $ 20\\ ^\\circ\\text{C} $ and $ 26\\ \\Omega $ at $ 120\\ ^\\circ\\text{C} $. Find its temperature coefficient of resistance.',
              '$ \\alpha = 3\\times10^{-3}\\ \\text{K}^{-1} $',
              '$ R = R_0(1+\\alpha\\Delta T) $ with $ \\Delta T = 100 $ K:\n\n$ 26 = 20(1 + 100\\alpha) $\n\n$ 1.3 = 1 + 100\\alpha \\quad\\Rightarrow\\quad \\alpha = 3\\times10^{-3}\\ \\text{K}^{-1} $\n\nA typical metallic value, which is the sanity check. Note that $ \\Delta T $ is the same number in kelvin or celsius, so no absolute-temperature conversion is needed.'),
            mcq('ch3-p09', 'When a semiconductor is heated, its resistance falls because',
              ['many more charge carriers are freed', 'the relaxation time increases', 'the lattice vibrations decrease', 'its dimensions contract'],
              0,
              'Heating lifts bound electrons into conduction, so $ n $ rises steeply in $ \\rho = m/ne^{2}\\tau $ and swamps the fall in $ \\tau $. In a metal $ n $ cannot rise at all, which is why metals behave the opposite way.'),
            num('ch3-p10', 'A wire of resistance $ 12\\ \\Omega $ is cut into three equal parts, and the three parts are connected in parallel. Find the resistance of the combination.',
              '$ \\frac{4}{3}\\ \\Omega \\approx 1.33\\ \\Omega $',
              'Each third has resistance $ 12/3 = 4\\ \\Omega $, since $ R \\propto l $ when the thickness is unchanged.\n\nThree equal resistances in parallel give $ R/n $:\n\n$ R_{\\text{eq}} = \\frac{4}{3} \\approx 1.33\\ \\Omega $\n\n**A shortcut for this standard question:** cutting into $ n $ parts and paralleling them always divides the original resistance by $ n^{2} $. Here $ 12/9 = 1.33\\ \\Omega $. ✓'),
            mcq('ch3-p11', 'Standard resistance coils are wound from manganin or constantan because these alloys have',
              ['a very small temperature coefficient of resistance', 'the lowest available resistivity', 'a large negative temperature coefficient', 'zero resistance at room temperature'],
              0,
              'Their resistance barely drifts as they warm, so a resistance box holds its stated value even while carrying current. Their resistivity is in fact high, which is convenient — a short wire then gives a useful resistance.'),
          ],
        },
        // ── 3 · Cells and EMF ───────────────────────────────────────────────
        {
          id: 'ch3-s3-cells',
          title: '3 · Cells, emf and internal resistance',
          blurb: 'Terminal voltage is never the emf while current flows.',
          items: [
            num('ch3-p12', 'A cell of emf $ 2.0 $ V and internal resistance $ 0.5\\ \\Omega $ is connected to a $ 4.5\\ \\Omega $ resistor. Find the current, the terminal voltage, and the power wasted inside the cell.',
              '$ I = 0.4 $ A; $ V = 1.8 $ V; $ P_r = 0.08 $ W',
              '$ I = \\frac{\\varepsilon}{R+r} = \\frac{2.0}{4.5+0.5} = 0.4\\ \\text{A} $\n\n$ V = \\varepsilon - Ir = 2.0 - (0.4)(0.5) = 1.8\\ \\text{V} $\n\nCheck: $ V $ should equal $ IR = 0.4 \\times 4.5 = 1.8 $ V ✓\n\nPower wasted internally:\n\n$ P_r = I^{2}r = (0.4)^{2}(0.5) = 0.08\\ \\text{W} $\n\nFor comparison, the load receives $ I^{2}R = 0.72 $ W, so the efficiency here is 90% — because $ R \\gg r $.'),
            mcq('ch3-p13', 'Two batteries of emf $ \\varepsilon_1 $ and $ \\varepsilon_2 $ (with $ \\varepsilon_2 > \\varepsilon_1 $) and internal resistances $ r_1 $ and $ r_2 $ are connected in parallel. The equivalent emf of the combination',
              ['lies between $ \\varepsilon_1 $ and $ \\varepsilon_2 $', 'is smaller than $ \\varepsilon_1 $', 'equals $ \\varepsilon_1 + \\varepsilon_2 $', 'is independent of $ r_1 $ and $ r_2 $'],
              0,
              'The equivalent emf is the weighted average $ \\frac{\\varepsilon_1r_2 + \\varepsilon_2r_1}{r_1+r_2} $, which necessarily sits between the two. Emfs add only in **series**, and the internal resistances are exactly the weights here — so it cannot be independent of them.',
              EX),
            num('ch3-p14', 'A cell drives $ 0.4 $ A through $ 5\\ \\Omega $ and $ 0.25 $ A through $ 9\\ \\Omega $. Find its emf and internal resistance.',
              '$ \\varepsilon = 2.67 $ V; $ r = 1.67\\ \\Omega $',
              'Use $ \\varepsilon = I(R+r) $ twice — the emf is a property of the cell, so it is the same both times.\n\n$ \\varepsilon = 0.4(5+r) = 2 + 0.4r $\n\n$ \\varepsilon = 0.25(9+r) = 2.25 + 0.25r $\n\nSetting them equal:\n\n$ 2 + 0.4r = 2.25 + 0.25r $\n\n$ 0.15r = 0.25 \\quad\\Rightarrow\\quad r = 1.67\\ \\Omega $\n\nSubstituting back into the first equation:\n\n$ \\varepsilon = 2 + 0.4(1.67) = 2.67\\ \\text{V} $\n\n**Now check it against the *other* equation:** $ 0.25(9+1.67) = 0.25 \\times 10.67 = 2.67 $ V ✓\n\nThat cross-check is the only reliable way to catch an arithmetic slip in a simultaneous-equation problem — always substitute back into the equation you did **not** use.'),
            mcq('ch3-p15', 'A cell delivers maximum power to an external resistance $ R $ when',
              ['$ R $ equals the internal resistance', '$ R $ is zero', '$ R $ is very much larger than the internal resistance', '$ R $ is twice the internal resistance'],
              0,
              'Maximising $ P = \\varepsilon^{2}R/(R+r)^{2} $ gives $ R = r $. Note the efficiency there is only 50%, so this is the condition for maximum *power*, never for maximum efficiency.'),
            mcq('ch3-p16', 'Five identical cells are connected in series, but one of them is reversed. The net emf of the combination is',
              ['$ 3\\varepsilon $', '$ 4\\varepsilon $', '$ 5\\varepsilon $', '$ \\varepsilon $'],
              0,
              'The reversed cell fails to contribute its $ \\varepsilon $ **and** actively opposes with another $ \\varepsilon $, so $ 2\\varepsilon $ is lost from the total. Its internal resistance still adds, though.'),
          ],
        },
        // ── 4 · Networks and Kirchhoff ──────────────────────────────────────
        {
          id: 'ch3-s4-networks',
          title: '4 · Networks and Kirchhoff',
          blurb: 'Label the nodes. Redraw. Then calculate.',
          items: [
            num('ch3-p17', 'A $ 4\\ \\Omega $ and a $ 12\\ \\Omega $ resistor are in parallel, and the combination is in series with a $ 2\\ \\Omega $ resistor across a $ 10 $ V supply of negligible internal resistance. Find the total current and the current in the $ 4\\ \\Omega $ resistor.',
              '$ I = 2 $ A total; $ I_4 = 1.5 $ A',
              '**Collapse the parallel pair:**\n\n$ R_p = \\frac{4\\times12}{4+12} = \\frac{48}{16} = 3\\ \\Omega $\n\nCheck: 3 is less than 4, the smaller of the pair ✓\n\n**Total:** $ R = 3+2 = 5\\ \\Omega $, so $ I = 10/5 = 2\\ \\text{A} $.\n\n**Expand back outwards.** The voltage across the parallel section is $ IR_p = 2\\times3 = 6 $ V, and both branches share it:\n\n$ I_4 = \\frac{6}{4} = 1.5\\ \\text{A}, \\qquad I_{12} = \\frac{6}{12} = 0.5\\ \\text{A} $\n\nCheck: $ 1.5+0.5 = 2 $ A ✓, and the smaller resistor took the larger current ✓'),
            mcq('ch3-p18', "Kirchhoff's junction rule expresses",
              ['conservation of charge', 'conservation of energy', 'conservation of momentum', "Ohm's law"],
              0,
              'Charge cannot accumulate at a point in a wire, so what flows in must flow out. The **loop** rule is the energy statement — the two laws express different conservation principles.',
              EX),
            num('ch3-p19', 'Five resistors are connected between A and B: $ 4\\ \\Omega $ from A to P, $ 8\\ \\Omega $ from P to B, $ 6\\ \\Omega $ from A to Q, $ 12\\ \\Omega $ from Q to B, and $ 5\\ \\Omega $ between P and Q. Find the resistance between A and B.',
              '$ 7.2\\ \\Omega $',
              '**Recognise the shape first** — two arms with a bridging resistor is a Wheatstone bridge, so test for balance before anything else.\n\n$ \\frac{4}{8} = \\frac{1}{2}, \\qquad \\frac{6}{12} = \\frac{1}{2} $\n\nEqual, so the bridge is **balanced**. P and Q are at the same potential, the $ 5\\ \\Omega $ resistor carries no current, and it can be deleted — its value is irrelevant.\n\nWhat remains is two series arms in parallel:\n\nUpper: $ 4+8 = 12\\ \\Omega $. Lower: $ 6+12 = 18\\ \\Omega $.\n\n$ R_{AB} = \\frac{12\\times18}{12+18} = \\frac{216}{30} = 7.2\\ \\Omega $\n\n**The habit worth building: with five resistors between two terminals, always test the ratios first.** If the bridge balances, a hard problem becomes a two-line one. If it does not, you will need Kirchhoff.'),
            mcq('ch3-p20', 'A resistor has a plain wire soldered across both of its ends. The current through that resistor is',
              ['zero', 'the full circuit current', 'half the circuit current', 'determined by its resistance value'],
              0,
              'The resistanceless wire forces both ends to the same potential, so there is no voltage across the resistor and no current through it. All the current takes the wire — the resistor is short-circuited and should be deleted in a redraw.'),
            num('ch3-p21', 'Twelve identical resistors, each of $ R $, form the edges of a cube. Find the resistance between two diagonally opposite corners of the cube.',
              '$ \\frac{5R}{6} $',
              'This is a pure symmetry problem — no redraw will make it series-parallel.\n\nSend a current $ I $ in at one corner. By symmetry it splits **equally** three ways into the three edges leaving that corner, so each carries $ I/3 $.\n\nAt the next set of corners each of those currents splits **equally** two ways, so those six middle edges each carry $ I/6 $.\n\nBy symmetry with the entry, the three edges arriving at the far corner each carry $ I/3 $ again.\n\nNow walk any path from corner to corner — three edges — and add the drops:\n\n$ V = \\frac{I}{3}R + \\frac{I}{6}R + \\frac{I}{3}R = IR\\left(\\frac{1}{3}+\\frac{1}{6}+\\frac{1}{3}\\right) = \\frac{5IR}{6} $\n\n$ R_{\\text{eq}} = \\frac{V}{I} = \\frac{5R}{6} $\n\n**The technique:** when symmetry makes several currents equal, assign them by fractions of $ I $ and walk one path. It works for the cube along a face diagonal ($ 3R/4 $) and along an edge ($ 7R/12 $) too.'),
            mcq('ch3-p22', 'A Kirchhoff calculation returns one of the currents as $ -1.2 $ A. This means',
              ['it flows opposite to the direction you assumed', 'an arithmetic mistake has been made', 'the current is physically impossible', 'a resistance has come out negative'],
              0,
              'The sign is the algebra correcting the initial guess, and the magnitude is still right. That freedom to guess directions is exactly what makes the method work on circuits you cannot read by inspection.'),
          ],
        },
        // ── 5 · Power ───────────────────────────────────────────────────────
        {
          id: 'ch3-s5-power',
          title: '5 · Power and heating',
          blurb: 'Pick the form containing the quantity that is shared.',
          items: [
            mcq('ch3-p23', 'Two resistors of $ 3\\ \\Omega $ and $ 6\\ \\Omega $ are connected in **parallel** across a supply. The one dissipating more power is',
              ['the $ 3\\ \\Omega $ resistor', 'the $ 6\\ \\Omega $ resistor', 'both dissipate equally', 'it depends on the supply voltage'],
              0,
              'In parallel the voltage is shared, so $ P = V^{2}/R $ makes power inversely proportional to resistance — the smaller resistor is hotter. Had they been in series, the current would be shared and the answer would reverse.'),
            num('ch3-p24', 'A heater is rated "$ 1000 $ W, $ 220 $ V". Find its resistance, and the power it consumes on a $ 200 $ V supply.',
              '$ R = 48.4\\ \\Omega $; $ P = 826 $ W',
              'The rating fixes the resistance:\n\n$ R = \\frac{V^{2}}{P} = \\frac{220^{2}}{1000} = 48.4\\ \\Omega $\n\nAt $ 200 $ V:\n\n$ P = \\frac{V^{2}}{R} = \\frac{200^{2}}{48.4} = 826\\ \\text{W} $\n\nA 9% drop in voltage costs 17% of the power, because $ P \\propto V^{2} $. This is exactly why appliances underperform on a low mains supply.'),
            num('ch3-p25', 'Two identical lamps are connected first in series and then in parallel across the same supply. Find the ratio of the total power consumed in the two cases.',
              '$ P_{\\text{parallel}} : P_{\\text{series}} = 4 : 1 $',
              'Let each lamp be $ R $ and the supply $ V $.\n\n*Series:* total resistance $ 2R $, so $ P_s = \\frac{V^{2}}{2R} $.\n\n*Parallel:* total resistance $ R/2 $, so $ P_p = \\frac{2V^{2}}{R} $.\n\n$ \\frac{P_p}{P_s} = 4 $\n\nFor $ n $ identical devices the ratio is $ n^{2} $. This is why household circuits are wired in parallel — each appliance then gets the full mains voltage and its full rated power.'),
            mcq('ch3-p26', 'A $ 100 $ W and a $ 60 $ W bulb, both rated $ 220 $ V, are connected in series across a $ 220 $ V supply. The brighter bulb is',
              ['the $ 60 $ W bulb', 'the $ 100 $ W bulb', 'both are equally bright', 'neither lights at all'],
              0,
              'At its rated voltage $ P = V^{2}/R $, so the lower-power bulb has the higher resistance. In series the current is common, and $ P = I^{2}R $ then makes the higher resistance dissipate more — so the 60 W bulb outshines the 100 W one.'),
            mcq('ch3-p27', 'Electrical power is transmitted at very high voltage mainly because',
              ['a smaller current means far smaller $ I^{2}R $ losses', 'high voltage travels faster through the cable', 'cable resistance falls at high voltage', 'high voltage is safer to handle'],
              0,
              'For a fixed power $ P = VI $, raising $ V $ lowers $ I $ proportionally, and the loss $ I^{2}R $ falls by the **square** of that factor. The cable resistance is unchanged, and high voltage is emphatically less safe.'),
          ],
        },
        // ── 6 · Instruments ─────────────────────────────────────────────────
        {
          id: 'ch3-s6-instruments',
          title: '6 · Bridges, potentiometer and meters',
          blurb: 'All three measure by finding a null. That is where the precision comes from.',
          items: [
            mcq('ch3-p28', 'At balance in a Wheatstone bridge, the reading is independent of',
              ['the emf of the driving cell', 'the four resistances in the arms', 'the ratio of the two ratio arms', 'the value of the unknown resistance'],
              0,
              'The branch currents cancel when the two potential-drop equations are divided, so the cell drops out entirely — and the galvanometer carries no current, so its resistance drops out too. The four arm resistances are exactly what the condition is about.'),
            num('ch3-p29', 'In a meter bridge with a known resistance of $ 6\\ \\Omega $ in the left gap, the balance point is at $ 60 $ cm from the left. Find the unknown resistance in the right gap.',
              '$ 4\\ \\Omega $',
              '$ \\frac{R}{S} = \\frac{l}{100-l} \\quad\\Rightarrow\\quad S = R\\cdot\\frac{100-l}{l} $\n\n$ S = 6 \\times \\frac{40}{60} = 4\\ \\Omega $\n\n**Direction check:** the null sat to the **right** of centre, so the left-hand portion had the larger resistance — meaning the left arm needed the larger partner, so $ R > S $. And $ 6 > 4 $ ✓\n\nThat check catches an inverted ratio instantly, which is the commonest error here.'),
            mcq('ch3-p30', 'A student measuring $ R $ on a meter bridge chooses $ S = 100\\ \\Omega $ and finds the null at $ 2.9 $ cm. To improve the accuracy, the best step is to',
              ['change $ S $ to about $ 3\\ \\Omega $ and repeat', 'measure the $ 2.9 $ cm more carefully', 'change $ S $ to $ 1000\\ \\Omega $ and repeat', 'accept that a meter bridge cannot do better'],
              0,
              'A null at $ 2.9 $ cm is far too close to the end, where a millimetre of jockey error is a huge fractional error. Reducing $ S $ moves the balance point towards the middle, where the bridge is most sensitive. Raising $ S $ would push it even nearer the end.',
              EX),
            mcq('ch3-p31', 'Two cells of about $ 5 $ V and $ 10 $ V are to be compared on a $ 400 $ cm potentiometer. The correct arrangement is that',
              ['a $ 15 $ V driver, trimmed so the wire drop just exceeds $ 10 $ V', 'a driver battery of $ 8 $ V across the whole wire', 'a drop of $ 10 $ V across the first $ 50 $ cm of wire', 'nothing — a potentiometer compares resistances, not voltages'],
              0,
              'The drop across the whole wire must exceed the larger emf, or no null exists for it — which rules out an $ 8 $ V driver. But it should exceed it only slightly, so that the balance points fall far along the wire where the reading is most precise. Concentrating $ 10 $ V into the first $ 50 $ cm would make the gradient far too steep.',
              EX),
            num('ch3-p32', 'A potentiometer wire is $ 8 $ m long with a potential drop of $ 4 $ V across it. A cell balances at $ 5.0 $ m on open circuit, and at $ 4.0 $ m when a $ 4\\ \\Omega $ resistor is connected across it. Find the emf and the internal resistance.',
              '$ \\varepsilon = 2.5 $ V; $ r = 1.0\\ \\Omega $',
              '$ k = \\frac{4}{8} = 0.5\\ \\text{V/m} $\n\n**Emf** (open circuit, so no current from the cell):\n\n$ \\varepsilon = kl_1 = 0.5 \\times 5.0 = 2.5\\ \\text{V} $\n\n**Terminal voltage** with the load:\n\n$ V = kl_2 = 0.5 \\times 4.0 = 2.0\\ \\text{V} $\n\n**Internal resistance:**\n\n$ r = R\\left(\\frac{l_1-l_2}{l_2}\\right) = 4\\left(\\frac{5.0-4.0}{4.0}\\right) = 1.0\\ \\Omega $\n\n**Independent check:** with $ \\varepsilon = 2.5 $ V, $ r = 1\\ \\Omega $, $ R = 4\\ \\Omega $, the current is $ 2.5/5 = 0.5 $ A and $ V = IR = 2.0 $ V ✓'),
            mcq('ch3-p33', 'A potentiometer can measure the emf of a cell accurately, whereas a voltmeter cannot, because at balance',
              ['no current is drawn from the cell', 'the cell is short-circuited', 'the galvanometer has a very high resistance', 'the driver cell matches the test cell'],
              0,
              'With zero current from the cell, the $ Ir $ drop vanishes and the terminal voltage genuinely equals the emf. A voltmeter must draw some current to deflect, so it always reads slightly low no matter how good it is.'),
            num('ch3-p34', 'A galvanometer of resistance $ 60\\ \\Omega $ shows full-scale deflection at $ 1.5 $ mA. Convert it into (a) an ammeter reading to $ 3 $ A and (b) a voltmeter reading to $ 15 $ V.',
              '(a) shunt $ S = 0.030\\ \\Omega $ in parallel; (b) multiplier $ R = 9940\\ \\Omega $ in series',
              '**(a) Ammeter — shunt in parallel:**\n\n$ S = \\frac{I_gG}{I-I_g} = \\frac{(1.5\\times10^{-3})(60)}{3 - 1.5\\times10^{-3}} = \\frac{0.09}{2.9985} = 0.030\\ \\Omega $\n\n**(b) Voltmeter — multiplier in series:**\n\n$ R = \\frac{V}{I_g} - G = \\frac{15}{1.5\\times10^{-3}} - 60 = 10000 - 60 = 9940\\ \\Omega $\n\n**The contrast is the point.** From one galvanometer we get an instrument of $ 0.03\\ \\Omega $ and another of $ 10\\,000\\ \\Omega $ — a ratio of a third of a million. An ammeter goes in series so it must be near-zero; a voltmeter goes in parallel so it must be near-infinite.'),
            mcq('ch3-p35', 'An ammeter is accidentally connected in parallel with a resistor. The likely result is',
              ['a very large current, damaging it', 'the ammeter simply reads zero', 'the ammeter still reads correctly', 'no effect at all on the circuit'],
              0,
              'An ammeter has almost no resistance, so placing it across a component creates a near-perfect short circuit. Nearly all the current abandons the resistor and pours through the meter, easily exceeding its rating. The mirror mistake — a voltmeter in series — is harmless but stops the circuit working.'),
            mcq('ch3-p36', 'An ideal ammeter and an ideal voltmeter have, respectively,',
              ['zero and infinite resistance', 'infinite and zero resistance', 'zero resistance in both cases', 'infinite resistance in both cases'],
              0,
              'An ammeter is inserted in series, so any resistance of its own would reduce the current it is trying to read. A voltmeter is placed in parallel, so any current it draws would reduce the voltage it is trying to read.'),
            num('ch3-p37', 'A meter bridge gives a balance at $ 40 $ cm. When the two gap resistances are interchanged, the balance shifts to $ 60 $ cm. Explain what this confirms, and find the ratio of the two resistances.',
              'Ratio $ 2 : 3 $ — and the symmetry of the two readings confirms the wire is uniform with negligible end corrections.',
              'First reading: $ \\frac{R}{S} = \\frac{40}{60} = \\frac{2}{3} $.\n\nAfter interchanging: $ \\frac{S}{R} = \\frac{60}{40} = \\frac{3}{2} $ — the same statement, consistently.\n\nThe two balance points are at $ 40 $ cm and $ 60 $ cm, symmetric about the centre. **That symmetry is the check.** If the wire were non-uniform, or the end corrections significant, the second reading would not land at exactly $ 100 - 40 $ cm.\n\nSo interchanging and comparing is a diagnostic as well as an averaging technique — it tells you whether your apparatus deserves to be trusted.'),
            mcq('ch3-p38', 'The potential gradient of a potentiometer is reduced. The effect is that',
              ['its sensitivity improves', 'its sensitivity worsens', 'balance points move towards the near end', 'it can measure larger emfs'],
              0,
              'A smaller gradient spreads a given voltage over a longer length, so each millimetre of scale represents less voltage and finer differences can be resolved. The cost is that the largest emf the wire can balance goes **down**, not up.'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That is Chapter 3 finished. Every instrument in it relied on a galvanometer — a coil that twists when a current passes through it in a magnetic field. The next two chapters explain why it twists, starting with the question of what a magnet is at all.',
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p16]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
