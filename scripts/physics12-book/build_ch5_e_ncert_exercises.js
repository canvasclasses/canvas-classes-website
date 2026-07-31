'use strict';
/**
 * Class 12 Physics · Chapter 5 "Magnetic Effects of Current" — page 17.
 *   p17 — every NCERT exercise from the source chapter ("Moving Charges and
 *         Magnetism", NCERT's own chapter 4), transcribed verbatim (Rule 0)
 *         and worked in full. NCERT's own "4.x" numbering is kept in every
 *         citation, since our book reorders the chapter (taxonomy decision)
 *         but the source exercise numbers do not change.
 *
 * Exercise 4.24 is skipped — it needs the actual figure (Fig 4.28) showing
 * several named loop orientations relative to the field, and cannot be
 * solved from the text description alone.
 *
 * All 27 solutions below are derived from first principles (never quoted
 * from memory) and the order of magnitude of every numeric answer was
 * sanity-checked before being finalised.
 *
 * Run: node scripts/physics12-book/build_ch5_e_ncert_exercises.js
 */
const { b, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 5;

const p17 = {
  page_number: 17,
  slug: 'magnetic-effects-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'Every NCERT exercise from this chapter, worked in full',
  page_type: 'lesson',
  blocks: [
    b('text', 0, {
      markdown: 'These are the exercises printed at the end of the NCERT chapter, word for word — cited by NCERT\'s own numbering (Ex 4.1–4.28), since the source chapter is numbered 4 even though it sits at position 5 in this book. Work each one on paper before opening the solution.\n\nThey are grouped by skill rather than by number, so related ones sit together.',
    }),
    b('callout', 1, {
      variant: 'note',
      title: 'One exercise has moved out of this list',
      markdown: 'NCERT Exercise **4.24** needs the original figure (Fig 4.28), which shows several differently-oriented current loops relative to the field and asks you to identify each case. It can\'t be answered from the text alone, so it is left out here rather than guessed at.\n\nEverything else in 4.1–4.28 is below.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises 4.1 – 4.28',
      intro: 'Twenty-seven exercises across four themes. Every solution is worked from first principles, in the same voice as the chapter.',
      sections: [
        // ── A · Field of a wire, loop, solenoid and toroid ──────────────
        {
          id: 'ncert-fields',
          title: 'A · Field of a wire, loop, solenoid and toroid',
          blurb: 'Exercises 4.1, 4.2, 4.3, 4.4, 4.8, 4.14, 4.15, 4.16, 4.17.',
          items: [
            num('ncert-5-1',
              'A circular coil of wire consisting of 100 turns, each of radius 8.0 cm carries a current of 0.40 A. What is the magnitude of the magnetic field B at the centre of the coil?',
              '$ B \\approx 3.14 \\times 10^{-4}\\ \\text{T} $',
              'The field at the centre of a circular coil of $ N $ turns, radius $ r $, carrying current $ I $:\n\n$ B = \\frac{\\mu_0 N I}{2r} $\n\nWith $ \\mu_0 = 4\\pi \\times 10^{-7}\\ \\text{T m/A} $, $ N = 100 $, $ I = 0.40 $ A, $ r = 0.08 $ m:\n\n$ B = \\frac{(4\\pi \\times 10^{-7})(100)(0.40)}{2(0.08)} = \\frac{5.03 \\times 10^{-5}}{0.16} = 3.14 \\times 10^{-4}\\ \\text{T} $',
              'ncert_exercise', 'NCERT Ex 4.1'),
            num('ncert-5-2',
              'A long straight wire carries a current of 35 A. What is the magnitude of the field B at a point 20 cm from the wire?',
              '$ B = 3.5 \\times 10^{-5}\\ \\text{T} $',
              'For an infinite straight wire:\n\n$ B = \\frac{\\mu_0 I}{2\\pi d} $\n\nWith $ I = 35 $ A, $ d = 0.20 $ m:\n\n$ B = \\frac{(2 \\times 10^{-7})(35)}{0.20} = \\frac{7 \\times 10^{-6}}{0.20} = 3.5 \\times 10^{-5}\\ \\text{T} $',
              'ncert_exercise', 'NCERT Ex 4.2'),
            num('ncert-5-3',
              'A long straight wire in the horizontal plane carries a current of 50 A in north to south direction. Give the magnitude and direction of B at a point 2.5 m east of the wire.',
              '$ B = 4 \\times 10^{-6}\\ \\text{T} $, directed vertically upward',
              'Magnitude:\n\n$ B = \\frac{\\mu_0 I}{2\\pi d} = \\frac{(2 \\times 10^{-7})(50)}{2.5} = 4 \\times 10^{-6}\\ \\text{T} $\n\nDirection: the field circles the wire following the right-hand rule — grip the wire with the thumb pointing along the current (south). Both the current (north–south) and the position of the point (east of the wire) are horizontal, so B, being perpendicular to both, must be vertical. Working through the right-hand rule for current flowing south with the field point to the east gives a field pointing **vertically upward**.',
              'ncert_exercise', 'NCERT Ex 4.3'),
            num('ncert-5-4',
              'A horizontal overhead power line carries a current of 90 A in east to west direction. What is the magnitude and direction of the magnetic field due to the current 1.5 m below the line?',
              '$ B = 1.2 \\times 10^{-5}\\ \\text{T} $, directed towards the south',
              'Magnitude:\n\n$ B = \\frac{\\mu_0 I}{2\\pi d} = \\frac{(2 \\times 10^{-7})(90)}{1.5} = \\frac{1.8 \\times 10^{-5}}{1.5} = 1.2 \\times 10^{-5}\\ \\text{T} $\n\nDirection: current flows west, field point is directly below the wire. Applying the right-hand rule (grip the wire, thumb pointing west) — at a point below the wire the field points **south**.',
              'ncert_exercise', 'NCERT Ex 4.4'),
            num('ncert-5-8',
              'A closely wound solenoid 80 cm long has 5 layers of windings of 400 turns each. The diameter of the solenoid is 1.8 cm. If the current carried is 8.0 A, estimate the magnitude of B inside the solenoid near its centre.',
              '$ B \\approx 2.5 \\times 10^{-2}\\ \\text{T} $',
              'Total turns $ N = 5 \\times 400 = 2000 $. Turns per unit length:\n\n$ n = \\frac{N}{L} = \\frac{2000}{0.80} = 2500\\ \\text{turns/m} $\n\nField deep inside a long solenoid: $ B = \\mu_0 n I $\n\n$ B = (4\\pi \\times 10^{-7})(2500)(8.0) = 2.5 \\times 10^{-2}\\ \\text{T} $\n\nThe 1.8 cm diameter is not needed here — the field inside a long, tightly wound solenoid does not depend on its cross-sectional width, only on the turn density and current.',
              'ncert_exercise', 'NCERT Ex 4.8'),
            num('ncert-5-14',
              'Two concentric circular coils X and Y of radii 16 cm and 10 cm, respectively, lie in the same vertical plane containing the north to south direction. Coil X has 20 turns and carries a current of 16 A; coil Y has 25 turns and carries a current of 18 A. The sense of the current in X is anticlockwise, and clockwise in Y, for an observer looking at the coils facing west. Give the magnitude and direction of the net magnetic field due to the coils at their centre.',
              '$ B_{net} \\approx 1.57 \\times 10^{-3}\\ \\text{T} $, directed to the west',
              'Field at the centre of each coil, $ B = \\frac{\\mu_0 N I}{2r} $ — written here with `\\frac` for the actual computation:\n\n$ B_X = \\frac{\\mu_0 (20)(16)}{2(0.16)} = 1.26 \\times 10^{-3}\\ \\text{T} $\n\n$ B_Y = \\frac{\\mu_0 (25)(18)}{2(0.10)} = 2.83 \\times 10^{-3}\\ \\text{T} $\n\nFor an observer facing west, an anticlockwise current (coil X) produces a field pointing **toward** that observer (east); a clockwise current (coil Y) produces a field pointing **away** from the observer (west). The two fields are therefore in opposite directions, and since $ B_Y > B_X $, the net field takes Y\'s direction:\n\n$ B_{net} = B_Y - B_X = 2.83 \\times 10^{-3} - 1.26 \\times 10^{-3} = 1.57 \\times 10^{-3}\\ \\text{T} $, directed **west**.',
              'ncert_exercise', 'NCERT Ex 4.14'),
            num('ncert-5-15',
              'A magnetic field of 100 G (1 G = 10⁻⁴ T) is required which is uniform in a region of linear dimension about 10 cm and area of cross-section about 10⁻³ m². The maximum current-carrying capacity of a given coil of wire is 15 A and the number of turns per unit length that can be wound round a core is at most 1000 turns m⁻¹. Suggest some appropriate design particulars of a solenoid for the required purpose. Assume the core is not ferromagnetic.',
              '$ n = 1000\\ \\text{turns/m} $ with $ I \\approx 8\\ \\text{A} $ gives $ B = 100 $ G, well inside both limits',
              'Required field: $ B = 100\\ \\text{G} = 1.0 \\times 10^{-2}\\ \\text{T} $.\n\nInside a solenoid, $ B = \\mu_0 n I $, so $ nI = \\frac{B}{\\mu_0} $ — using `\\frac` for the actual value:\n\n$ nI = \\frac{1.0 \\times 10^{-2}}{4\\pi \\times 10^{-7}} \\approx 7958\\ \\text{A-turns/m} $\n\nUsing the maximum allowed turn density, $ n = 1000\\ \\text{turns/m} $:\n\n$ I = \\frac{7958}{1000} \\approx 8.0\\ \\text{A} $\n\nThis is comfortably inside the 15 A limit, leaving headroom for heating. The cross-section $ 10^{-3}\\ \\text{m}^2 $ gives a solenoid diameter of about 3.6 cm ($ d = \\sqrt{4A/\\pi} $). For the field to be nearly uniform over the central 10 cm region, the solenoid should be much longer than it is wide — a length of roughly 50–60 cm (about 15 times the diameter) with $ N = nL \\approx 500$–$600 $ turns wound at 1000 turns/m is a reasonable design.',
              'ncert_exercise', 'NCERT Ex 4.15'),
            num('ncert-5-16',
              'For a circular coil of radius R and N turns carrying current I, the magnitude of the magnetic field at a point on its axis at a distance x from its centre is given by:\n\n$ B = \\frac{\\mu_0 I R^{2} N}{2(x^{2} + R^{2})^{3/2}} $\n\n(a) Show that this reduces to the familiar result for field at the centre of the coil.\n\n(b) Consider two parallel co-axial circular coils of equal radius R, and number of turns N, carrying equal currents in the same direction, and separated by a distance R. Show that the field on the axis around the mid-point between the coils is uniform over a distance that is small as compared to R, and is given by $ B \\approx 0.72\\ \\mu_0 N I / R $ — an arrangement known as **Helmholtz coils**.',
              '(a) $ B = \\frac{\\mu_0 N I}{2R} $ · (b) $ B(0) \\approx 0.72\\,\\frac{\\mu_0 N I}{R} $, with the first two derivatives of $ B(x) $ vanishing at the mid-point',
              '**(a)** Setting $ x = 0 $ in the given formula:\n\n$ B = \\frac{\\mu_0 I R^{2} N}{2(0 + R^{2})^{3/2}} = \\frac{\\mu_0 I R^{2} N}{2 R^{3}} = \\frac{\\mu_0 N I}{2R} $\n\nwhich is exactly the centre-of-coil result used throughout this chapter.\n\n**(b)** Place the midpoint between the coils at the origin, with the coils at $ x = -R/2 $ and $ x = +R/2 $ (separation $ R $). The total field at position $ x $ is the sum of both coils\' contributions:\n\n$ B(x) = \\frac{\\mu_0 N I R^{2}}{2}\\left[\\left(R^{2} + (x - R/2)^{2}\\right)^{-3/2} + \\left(R^{2} + (x + R/2)^{2}\\right)^{-3/2}\\right] $\n\nThis sum is an even function of $ x $ (swapping $ x \\to -x $ just swaps the two bracketed terms), so $ \\frac{dB}{dx} = 0 $ at $ x = 0 $ automatically, for *any* coil separation — the midpoint is always a turning point.\n\nWhat makes separation $ R $ special is the **second** derivative. Differentiating one term, $ h(x) = (R^{2} + (x - d)^{2})^{-3/2} $ with $ d = R/2 $, twice and evaluating at $ x = 0 $ gives (after simplifying):\n\n$ h\'\'(0) \\propto (4d^{2} - R^{2}) $\n\nThis vanishes exactly when $ d = R/2 $, i.e. when the coils are separated by $ 2d = R $ — precisely the Helmholtz condition given in the problem. So at separation $ R $, both the first and second derivatives of $ B(x) $ vanish at the midpoint: the field is not just extremal there, it is flat to a higher order, which is why it stays nearly constant over a region small compared to $ R $.\n\nEvaluating $ B(0) $ itself at $ d = R/2 $:\n\n$ B(0) = \\mu_0 N I R^{2}\\left(R^{2} + \\frac{R^{2}}{4}\\right)^{-3/2} = \\mu_0 N I \\left(\\frac{5}{4}\\right)^{-3/2}\\frac{1}{R} $\n\n$ \\left(\\frac{5}{4}\\right)^{-3/2} = \\left(\\frac{4}{5}\\right)^{3/2} \\approx 0.716 $\n\n$ B(0) \\approx 0.72\\,\\frac{\\mu_0 N I}{R} $\n\nwhich is exactly the result to be shown.',
              'ncert_exercise', 'NCERT Ex 4.16'),
            num('ncert-5-17',
              'A toroid has a core (non-ferromagnetic) of inner radius 25 cm and outer radius 26 cm, around which 3500 turns of a wire are wound. If the current in the wire is 11 A, what is the magnetic field (a) outside the toroid, (b) inside the core of the toroid, and (c) in the empty space surrounded by the toroid.',
              '(a) $ B = 0 $ · (b) $ B \\approx 3.0 \\times 10^{-2}\\ \\text{T} $ · (c) $ B = 0 $',
              'Mean radius of the core: $ r = \\frac{0.25 + 0.26}{2} = 0.255\\ \\text{m} $\n\n**(a) Outside the toroid:** an Amperian loop drawn outside encloses zero net current (each turn crosses the loop plane once in and once out), so $ B = 0 $.\n\n**(b) Inside the core:** an Amperian circle of radius $ r $ threading the windings encloses $ N I $:\n\n$ B = \\frac{\\mu_0 N I}{2\\pi r} = \\frac{(4\\pi \\times 10^{-7})(3500)(11)}{2\\pi(0.255)} \\approx 3.0 \\times 10^{-2}\\ \\text{T} $\n\n**(c) In the empty space enclosed by the toroid** (the "hole" in the doughnut): an Amperian loop drawn there also encloses zero net current, so $ B = 0 $ — same reasoning as outside.',
              'ncert_exercise', 'NCERT Ex 4.17'),
          ],
        },
        // ── B · Force on current-carrying wires ─────────────────────────
        {
          id: 'ncert-forces',
          title: 'B · Force on current-carrying wires',
          blurb: 'Exercises 4.5, 4.6, 4.7, 4.21, 4.22, 4.23, 4.26.',
          items: [
            num('ncert-5-5',
              'What is the magnitude of magnetic force per unit length on a wire carrying a current of 8 A and making an angle of 30º with the direction of a uniform magnetic field of 0.15 T?',
              '$ F/L = 0.6\\ \\text{N/m} $',
              '$ \\frac{F}{L} = BI\\sin\\theta = (0.15)(8)\\sin 30^{\\circ} = (0.15)(8)(0.5) = 0.6\\ \\text{N/m} $',
              'ncert_exercise', 'NCERT Ex 4.5'),
            num('ncert-5-6',
              'A 3.0 cm wire carrying a current of 10 A is placed inside a solenoid perpendicular to its axis. The magnetic field inside the solenoid is given to be 0.27 T. What is the magnetic force on the wire?',
              '$ F = 0.081\\ \\text{N} $',
              'The wire is perpendicular to the axis, hence perpendicular to $ B $ (which runs along the axis), so $ \\sin\\theta = 1 $:\n\n$ F = BIL = (0.27)(10)(0.03) = 0.081\\ \\text{N} $',
              'ncert_exercise', 'NCERT Ex 4.6'),
            num('ncert-5-7',
              'Two long and parallel straight wires A and B carrying currents of 8.0 A and 5.0 A in the same direction are separated by a distance of 4.0 cm. Estimate the force on a 10 cm section of wire A.',
              '$ F = 2 \\times 10^{-5}\\ \\text{N}$, attractive',
              'Force per unit length between two parallel wires:\n\n$ \\frac{F}{L} = \\frac{\\mu_0 I_A I_B}{2\\pi d} = \\frac{(2 \\times 10^{-7})(8.0)(5.0)}{0.04} = 2 \\times 10^{-4}\\ \\text{N/m} $\n\nOn a 10 cm ($ 0.10 $ m) section:\n\n$ F = (2 \\times 10^{-4})(0.10) = 2 \\times 10^{-5}\\ \\text{N} $\n\nBoth currents flow the same way, so the wires attract each other.',
              'ncert_exercise', 'NCERT Ex 4.7'),
            num('ncert-5-21',
              'A straight horizontal conducting rod of length 0.45 m and mass 60 g is suspended by two vertical wires at its ends. A current of 5.0 A is set up in the rod through the wires.\n\n(a) What magnetic field should be set up normal to the conductor in order that the tension in the wires is zero?\n\n(b) What will be the total tension in the wires if the direction of current is reversed keeping the magnetic field same as before? (Ignore the mass of the wires.) $ g = 9.8\\ \\text{m s}^{-2} $.',
              '(a) $ B \\approx 0.26\\ \\text{T} $ · (b) $ T \\approx 1.18\\ \\text{N} $',
              '**(a)** For zero tension, the magnetic force on the rod must exactly balance its weight:\n\n$ BIL = mg $\n\n$ B = \\frac{mg}{IL} = \\frac{(0.060)(9.8)}{(5.0)(0.45)} = \\frac{0.588}{2.25} \\approx 0.26\\ \\text{T} $\n\n**(b)** Reversing the current flips the magnetic force from upward (supporting the rod) to downward (adding to its weight). With the same field, the magnetic force still has magnitude $ mg $ (from part a), so now both the weight and the magnetic force pull down on the wires:\n\n$ T = mg + BIL = mg + mg = 2mg = 2(0.060)(9.8) \\approx 1.18\\ \\text{N} $',
              'ncert_exercise', 'NCERT Ex 4.21'),
            num('ncert-5-22',
              'The wires which connect the battery of an automobile to its starting motor carry a current of 300 A (for a short time). What is the force per unit length between the wires if they are 70 cm long and 1.5 cm apart? Is the force attractive or repulsive?',
              '$ F/L = 1.2\\ \\text{N/m}$, so $ F \\approx 0.84\\ \\text{N}$ over the 70 cm length; repulsive',
              '$ \\frac{F}{L} = \\frac{\\mu_0 I^{2}}{2\\pi d} = \\frac{(2 \\times 10^{-7})(300)^{2}}{0.015} = \\frac{1.8 \\times 10^{-2}}{0.015} = 1.2\\ \\text{N/m} $\n\nOver the 0.70 m length: $ F = (1.2)(0.70) \\approx 0.84\\ \\text{N} $\n\nOne wire carries current to the motor and the other carries it back, so the two currents run in **opposite** directions — the force between them is **repulsive**.',
              'ncert_exercise', 'NCERT Ex 4.22'),
            num('ncert-5-23',
              'A uniform magnetic field of 1.5 T exists in a cylindrical region of radius 10.0 cm, its direction parallel to the axis along east to west. A wire carrying current of 7.0 A in the north to south direction passes through this region. What is the magnitude and direction of the force on the wire if,\n\n(a) the wire intersects the axis,\n\n(b) the wire is turned from N-S to northeast-northwest direction,\n\n(c) the wire in the N-S direction is lowered from the axis by a distance of 6.0 cm?',
              '(a) $ F = 2.1\\ \\text{N} $ · (b) $ F \\approx 1.5\\ \\text{N} $ · (c) $ F = 1.68\\ \\text{N} $ — all vertically downward, at the same current/field orientation',
              'In every case, current (N–S) and field (E–W) are perpendicular directions, so the effective length inside the field region is what changes.\n\n**(a)** The wire passes through the axis, so it crosses the full diameter of the field region: $ L = 2r = 0.20\\ \\text{m} $. Current and field are perpendicular ($ \\sin\\theta = 1 $):\n\n$ F = BIL = (1.5)(7.0)(0.20) = 2.1\\ \\text{N} $\n\nWorking out $ \\vec{F} = I\\vec{L} \\times \\vec{B} $ with the current running south and the field running east-to-west gives a force directed **vertically downward**.\n\n**(b)** The wire still passes through the centre (it is pivoted there), so any line through the centre of a circle is still a diameter — the length inside the field is unchanged at $ L = 0.20\\ \\text{m} $. But it is now at 45° to the N–S line, and hence also at 45° to the E–W field:\n\n$ F = BIL\\sin 45^{\\circ} = (1.5)(7.0)(0.20)(0.707) \\approx 1.5\\ \\text{N} $\n\n**(c)** Now the wire is a chord 6.0 cm from the centre, not a diameter. Chord length in a circle of radius $ r $ at perpendicular distance $ d $ from the centre:\n\n$ L = 2\\sqrt{r^{2} - d^{2}} = 2\\sqrt{(0.10)^{2} - (0.06)^{2}} = 2\\sqrt{0.0064} = 0.16\\ \\text{m} $\n\nCurrent and field are still perpendicular:\n\n$ F = BIL = (1.5)(7.0)(0.16) = 1.68\\ \\text{N} $',
              'ncert_exercise', 'NCERT Ex 4.23'),
            num('ncert-5-26',
              'A solenoid 60 cm long and of radius 4.0 cm has 3 layers of windings of 300 turns each. A 2.0 cm long wire of mass 2.5 g lies inside the solenoid (near its centre) normal to its axis; both the wire and the axis of the solenoid are in the horizontal plane. The wire is connected through two leads parallel to the axis of the solenoid to an external battery which supplies a current of 6.0 A in the wire. What value of current (with appropriate sense of circulation) in the windings of the solenoid can support the weight of the wire? $ g = 9.8\\ \\text{m s}^{-2} $.',
              '$ I_{solenoid} \\approx 108\\ \\text{A} $',
              'The wire is 2.0 cm long, mass 2.5 g, carrying 6.0 A. For the solenoid\'s field to support the wire\'s weight, the upward magnetic force must equal gravity:\n\n$ BI_{wire}L_{wire} = mg $\n\n$ B = \\frac{mg}{I_{wire}L_{wire}} = \\frac{(0.0025)(9.8)}{(6.0)(0.02)} = \\frac{0.0245}{0.12} \\approx 0.204\\ \\text{T} $\n\nTurns per unit length: $ N = 3 \\times 300 = 900 $ turns over $ L = 0.60 $ m, so $ n = \\frac{900}{0.60} = 1500\\ \\text{turns/m} $.\n\nField inside a solenoid: $ B = \\mu_0 n I_{solenoid} $, so:\n\n$ I_{solenoid} = \\frac{B}{\\mu_0 n} = \\frac{0.204}{(4\\pi \\times 10^{-7})(1500)} \\approx 108\\ \\text{A} $\n\nThat is a large current, but a short burst through a solenoid winding is exactly the kind of situation this order of magnitude belongs to. The direction of circulation in the solenoid windings must be whichever sense makes the force on the 6.0 A wire point **upward** — this depends on which way the wire\'s current runs, and is fixed by the right-hand rule once that is known.',
              'ncert_exercise', 'NCERT Ex 4.26'),
          ],
        },
        // ── C · Charged particles in magnetic fields ────────────────────
        {
          id: 'ncert-particles',
          title: 'C · Charged particles in magnetic fields',
          blurb: 'Exercises 4.11, 4.12, 4.18, 4.19, 4.20.',
          items: [
            num('ncert-5-11',
              'In a chamber, a uniform magnetic field of 6.5 G (1 G = 10⁻⁴ T) is maintained. An electron is shot into the field with a speed of 4.8 × 10⁶ m s⁻¹ normal to the field. Explain why the path of the electron is a circle. Determine the radius of the circular orbit. ($ e = 1.6 \\times 10^{-19}\\ \\text{C} $, $ m_e = 9.1 \\times 10^{-31}\\ \\text{kg} $)',
              '$ r \\approx 4.2 \\times 10^{-3}\\ \\text{m} $',
              'The magnetic force $ q\\vec{v} \\times \\vec{B} $ is always perpendicular to $ \\vec{v} $, so it can never do work or change the electron\'s speed — it only ever bends the velocity. A force of constant magnitude, always perpendicular to a constant-speed velocity, is exactly the condition for uniform circular motion, so the force acts as the centripetal force:\n\n$ \\frac{mv^{2}}{r} = evB \\quad\\Rightarrow\\quad r = \\frac{mv}{eB} $\n\nWith $ B = 6.5\\ \\text{G} = 6.5 \\times 10^{-4}\\ \\text{T} $:\n\n$ r = \\frac{(9.1 \\times 10^{-31})(4.8 \\times 10^{6})}{(1.6 \\times 10^{-19})(6.5 \\times 10^{-4})} = \\frac{4.37 \\times 10^{-24}}{1.04 \\times 10^{-22}} \\approx 4.2 \\times 10^{-3}\\ \\text{m} $',
              'ncert_exercise', 'NCERT Ex 4.11'),
            num('ncert-5-12',
              'In Exercise 4.11 obtain the frequency of revolution of the electron in its circular orbit. Does the answer depend on the speed of the electron? Explain.',
              '$ \\nu \\approx 1.8 \\times 10^{7}\\ \\text{Hz} $; no, it is independent of speed',
              'Frequency $ \\nu = \\frac{v}{2\\pi r} $, and since $ r = \\frac{mv}{eB} $, the speed cancels:\n\n$ \\nu = \\frac{v}{2\\pi \\left(\\frac{mv}{eB}\\right)} = \\frac{eB}{2\\pi m} $\n\n$ \\nu = \\frac{(1.6 \\times 10^{-19})(6.5 \\times 10^{-4})}{2\\pi (9.1 \\times 10^{-31})} \\approx 1.8 \\times 10^{7}\\ \\text{Hz} $\n\nThis (cyclotron) frequency does **not** depend on the electron\'s speed — a faster electron sweeps a proportionally larger circle in the same time, so the two effects cancel. This is exactly the fact that makes a cyclotron work: the accelerating frequency stays fixed even as the particle speeds up.',
              'ncert_exercise', 'NCERT Ex 4.12'),
            num('ncert-5-18',
              'Answer the following questions:\n\n(a) A magnetic field that varies in magnitude from point to point but has a constant direction (east to west) is set up in a chamber. A charged particle enters the chamber and travels undeflected along a straight path with constant speed. What can you say about the initial velocity of the particle?\n\n(b) A charged particle enters an environment of a strong and non-uniform magnetic field varying from point to point both in magnitude and direction, and comes out of it following a complicated trajectory. Would its final speed equal the initial speed if it suffered no collisions with the environment?\n\n(c) An electron travelling west to east enters a chamber having a uniform electrostatic field in north to south direction. Specify the direction in which a uniform magnetic field should be set up to prevent the electron from deflecting from its straight line path.',
              '(a) Velocity is parallel (or antiparallel) to the field, i.e. along east-west · (b) Yes, final speed = initial speed · (c) Vertically downward',
              '**(a)** For the path to stay straight, the net force must be zero everywhere along it. The magnetic force $ q\\vec{v} \\times \\vec{B} $ vanishes only when $ \\vec{v} $ is parallel (or antiparallel) to $ \\vec{B} $. Since $ B $\'s direction never changes (only its magnitude does), the particle\'s initial velocity must be directed along that same east–west line — then it stays parallel to $ B $ at every point along the path, however $ B $\'s magnitude varies.\n\n**(b)** Yes. The magnetic force is always perpendicular to velocity, so it never does any work on the particle, no matter how complicated the field or the resulting path. With no collisions, kinetic energy — and hence speed — is conserved, even though the direction of motion changes constantly.\n\n**(c)** Take the electron\'s velocity as west-to-east, and the electric field as pointing south (north to south). Since the electron is negatively charged, the electric force on it points **north** (opposite to $ \\vec{E} $). To cancel this, the magnetic force $ q\\vec{v} \\times \\vec{B} $ must point **south**. Working through $ \\vec{F} = q\\vec{v}\\times\\vec{B} $ with $ q $ negative and $ \\vec{v} $ pointing east shows this requires $ \\vec{B} $ to point **vertically downward**.',
              'ncert_exercise', 'NCERT Ex 4.18'),
            num('ncert-5-19',
              'An electron emitted by a heated cathode and accelerated through a potential difference of 2.0 kV, enters a region with uniform magnetic field of 0.15 T. Determine the trajectory of the electron if the field (a) is transverse to its initial velocity, (b) makes an angle of 30º with the initial velocity.',
              '(a) Circle of radius $ \\approx 1.0 \\times 10^{-3}\\ \\text{m} $ · (b) Helix of radius $ \\approx 0.5 \\times 10^{-3}\\ \\text{m} $, pitch $ \\approx 5.5 \\times 10^{-3}\\ \\text{m} $',
              'First find the speed from the accelerating potential:\n\n$ eV = \\frac{1}{2}mv^{2} \\quad\\Rightarrow\\quad v = \\sqrt{\\frac{2eV}{m}} = \\sqrt{\\frac{2(1.6 \\times 10^{-19})(2000)}{9.1 \\times 10^{-31}}} \\approx 2.65 \\times 10^{7}\\ \\text{m/s} $\n\n**(a) Field transverse (perpendicular) to velocity:** the electron moves in a circle, exactly as in Exercise 4.11:\n\n$ r = \\frac{mv}{eB} = \\frac{(9.1 \\times 10^{-31})(2.65 \\times 10^{7})}{(1.6 \\times 10^{-19})(0.15)} \\approx 1.0 \\times 10^{-3}\\ \\text{m} $\n\n**(b) Field at 30° to the velocity:** split the velocity into a component along $ B $ ($ v_{\\parallel} = v\\cos 30^{\\circ} $, unaffected by the field) and a component perpendicular to it ($ v_{\\perp} = v\\sin 30^{\\circ} $, which circles). The result is a **helix**: a circular motion of radius\n\n$ r = \\frac{mv_{\\perp}}{eB} = \\frac{mv\\sin 30^{\\circ}}{eB} = (1.0 \\times 10^{-3})(0.5) = 0.5 \\times 10^{-3}\\ \\text{m} $\n\nsuperposed on uniform drift along $ B $. The pitch (distance advanced per full turn) is $ v_{\\parallel} $ times the period $ T = \\frac{2\\pi m}{eB} $:\n\n$ T = \\frac{2\\pi (9.1 \\times 10^{-31})}{(1.6 \\times 10^{-19})(0.15)} \\approx 2.38 \\times 10^{-10}\\ \\text{s} $\n\n$ \\text{pitch} = v\\cos 30^{\\circ} \\times T = (2.65 \\times 10^{7})(0.866)(2.38 \\times 10^{-10}) \\approx 5.5 \\times 10^{-3}\\ \\text{m} $',
              'ncert_exercise', 'NCERT Ex 4.19'),
            num('ncert-5-20',
              'A magnetic field set up using Helmholtz coils (described in Exercise 4.16) is uniform in a small region and has a magnitude of 0.75 T. In the same region, a uniform electrostatic field is maintained in a direction normal to the common axis of the coils. A narrow beam of (single species) charged particles all accelerated through 15 kV enters this region in a direction perpendicular to both the axis of the coils and the electrostatic field. If the beam remains undeflected when the electrostatic field is $ 9.0 \\times 10^{5}\\ \\text{V m}^{-1} $, make a simple guess as to what the beam contains. Why is the answer not unique?',
              'Consistent with deuterons ($ q/m \\approx 4.8 \\times 10^{7}\\ \\text{C/kg} $); not unique because the method only fixes $ q/m $, and ions like alpha particles share the same ratio',
              'A note on the source numbers first: the printed field value works out physically sensible only as $ E = 9.0 \\times 10^{5}\\ \\text{V m}^{-1} $ (not $ 10^{-5} $, which would give a beam speed far too slow to have come from a 15 kV accelerator) — that sign is treated here as a transcription slip and corrected, per Rule 0.\n\nThe beam is undeflected, so the electric and magnetic forces balance — this is a velocity selector:\n\n$ qE = qvB \\quad\\Rightarrow\\quad v = \\frac{E}{B} = \\frac{9.0 \\times 10^{5}}{0.75} = 1.2 \\times 10^{6}\\ \\text{m/s} $\n\nThe particles were accelerated through $ V = 15\\ \\text{kV} $, so $ qV = \\frac{1}{2}mv^{2} $, giving the charge-to-mass ratio:\n\n$ \\frac{q}{m} = \\frac{v^{2}}{2V} = \\frac{(1.2 \\times 10^{6})^{2}}{2(15000)} = 4.8 \\times 10^{7}\\ \\text{C/kg} $\n\nA proton has $ e/m_p \\approx 9.6 \\times 10^{7}\\ \\text{C/kg} $ — twice too large. A **deuteron** (charge $ e $, mass $ \\approx 2m_p $) has $ e/(2m_p) \\approx 4.8 \\times 10^{7}\\ \\text{C/kg} $ — a very close match.\n\nThe answer is not unique because this method only measures the ratio $ q/m $, not $ q $ and $ m $ separately. An alpha particle (charge $ 2e $, mass $ \\approx 4m_p $) gives $ 2e/(4m_p) = e/(2m_p) $ — exactly the same ratio as a deuteron — so the two are indistinguishable by this test alone.',
              'ncert_exercise', 'NCERT Ex 4.20'),
          ],
        },
        // ── D · Torque on a current loop and moving-coil instruments ────
        {
          id: 'ncert-torque-instruments',
          title: 'D · Torque on a current loop and moving-coil instruments',
          blurb: 'Exercises 4.9, 4.10, 4.13, 4.25, 4.27, 4.28.',
          items: [
            num('ncert-5-9',
              'A square coil of side 10 cm consists of 20 turns and carries a current of 12 A. The coil is suspended vertically and the normal to the plane of the coil makes an angle of 30º with the direction of a uniform horizontal magnetic field of magnitude 0.80 T. What is the magnitude of torque experienced by the coil?',
              '$ \\tau \\approx 0.96\\ \\text{N m} $',
              'Area $ A = (0.10)^{2} = 0.01\\ \\text{m}^{2} $. Torque on a current loop, with $ \\theta $ the angle between the normal and $ B $:\n\n$ \\tau = NIAB\\sin\\theta = (20)(12)(0.01)(0.80)\\sin 30^{\\circ} $\n\n$ \\tau = (20)(12)(0.01)(0.80)(0.5) \\approx 0.96\\ \\text{N m} $',
              'ncert_exercise', 'NCERT Ex 4.9'),
            num('ncert-5-10',
              'Two moving coil meters, $ M_1 $ and $ M_2 $ have the following particulars:\n\n$ R_1 = 10\\ \\Omega $, $ N_1 = 30 $, $ A_1 = 3.6 \\times 10^{-3}\\ \\text{m}^{2} $, $ B_1 = 0.25\\ \\text{T} $\n\n$ R_2 = 14\\ \\Omega $, $ N_2 = 42 $, $ A_2 = 1.8 \\times 10^{-3}\\ \\text{m}^{2} $, $ B_2 = 0.50\\ \\text{T} $\n\n(The spring constants are identical for the two meters). Determine the ratio of (a) current sensitivity and (b) voltage sensitivity of $ M_2 $ and $ M_1 $.',
              '(a) $ I_{s2}/I_{s1} = 1.4 $ · (b) $ V_{s2}/V_{s1} = 1 $',
              'Current sensitivity of a galvanometer is $ I_s = \\frac{NAB}{k} $ (with $ k $ the spring constant, identical for both here), so the ratio only needs $ NAB $ for each — using `\\frac` for the arithmetic:\n\n$ N_1 A_1 B_1 = (30)(3.6 \\times 10^{-3})(0.25) = 0.027 $\n\n$ N_2 A_2 B_2 = (42)(1.8 \\times 10^{-3})(0.50) = 0.0378 $\n\n**(a)** $ \\frac{I_{s2}}{I_{s1}} = \\frac{N_2 A_2 B_2}{N_1 A_1 B_1} = \\frac{0.0378}{0.027} = 1.4 $\n\n**(b)** Voltage sensitivity is $ V_s = \\frac{I_s}{R} $ — using `\\frac`:\n\n$ \\frac{V_{s2}}{V_{s1}} = \\frac{I_{s2}}{I_{s1}} \\times \\frac{R_1}{R_2} = 1.4 \\times \\frac{10}{14} = 1.4 \\times 0.714 \\approx 1 $\n\nDespite $ M_2 $ having the larger current sensitivity, its larger resistance brings the voltage sensitivity back down to match $ M_1 $\'s exactly.',
              'ncert_exercise', 'NCERT Ex 4.10'),
            num('ncert-5-13',
              '(a) A circular coil of 30 turns and radius 8.0 cm carrying a current of 6.0 A is suspended vertically in a uniform horizontal magnetic field of magnitude 1.0 T. The field lines make an angle of 60º with the normal of the coil. Calculate the magnitude of the counter torque that must be applied to prevent the coil from turning.\n\n(b) Would your answer change, if the circular coil in (a) were replaced by a planar coil of some irregular shape that encloses the same area? (All other particulars are also unaltered.)',
              '(a) $ \\tau \\approx 3.13\\ \\text{N m} $ · (b) No, the answer is unchanged',
              '**(a)** Area $ A = \\pi r^{2} = \\pi (0.08)^{2} \\approx 0.0201\\ \\text{m}^{2} $. The counter-torque needed equals the magnetic torque on the coil, with $ \\theta = 60^{\\circ} $ measured from the normal:\n\n$ \\tau = NIAB\\sin\\theta = (30)(6.0)(0.0201)(1.0)\\sin 60^{\\circ} $\n\n$ \\tau = (30)(6.0)(0.0201)(1.0)(0.866) \\approx 3.13\\ \\text{N m} $\n\n**(b)** No change. Torque on a planar current loop in a uniform field depends only on the loop\'s magnetic moment $ m = NIA $ and the field — total turns, current, enclosed area, and orientation — never on the specific shape of the boundary. An irregular loop enclosing the identical area, carrying the same current and turns, experiences exactly the same torque.',
              'ncert_exercise', 'NCERT Ex 4.13'),
            num('ncert-5-25',
              'A circular coil of 20 turns and radius 10 cm is placed in a uniform magnetic field of 0.10 T normal to the plane of the coil. If the current in the coil is 5.0 A, what is the\n\n(a) total torque on the coil,\n\n(b) total force on the coil,\n\n(c) average force on each electron in the coil due to the magnetic field?\n\n(The coil is made of copper wire of cross-sectional area 10⁻⁵ m², and the free electron density in copper is given to be about 10²⁹ m⁻³.)',
              '(a) $ \\tau = 0 $ · (b) $ F = 0 $ · (c) $ F_{electron} \\approx 5.0 \\times 10^{-25}\\ \\text{N} $',
              '**(a)** $ B $ is normal to the coil\'s plane, i.e. parallel to its magnetic moment ($ \\theta = 0 $), so $ \\tau = NIAB\\sin\\theta = 0 $.\n\n**(b)** The net force on any closed current loop in a uniform field is always zero — for a closed loop, $ \\oint I\\, d\\vec{l} \\times \\vec{B} = I\\left(\\oint d\\vec{l}\\right)\\times \\vec{B} = 0 $, since the vector sum of $ d\\vec{l} $ around any closed path is zero, regardless of the field\'s orientation.\n\n**(c)** Relate current to drift velocity: $ I = neAv_d $, so:\n\n$ v_d = \\frac{I}{neA} = \\frac{5.0}{(10^{29})(1.6 \\times 10^{-19})(10^{-5})} \\approx 3.1 \\times 10^{-5}\\ \\text{m/s} $\n\nForce on a single drifting electron: $ F = ev_dB $\n\n$ F = (1.6 \\times 10^{-19})(3.1 \\times 10^{-5})(0.10) \\approx 5.0 \\times 10^{-25}\\ \\text{N} $',
              'ncert_exercise', 'NCERT Ex 4.25'),
            num('ncert-5-27',
              'A galvanometer coil has a resistance of 12 Ω and the metre shows full scale deflection for a current of 3 mA. How will you convert the metre into a voltmeter of range 0 to 18 V?',
              'Add $ R_s \\approx 5988\\ \\Omega $ in series with the galvanometer',
              'At full-scale deflection, the same current $ I_g $ must flow through the galvanometer and a series resistor $ R_s $ for the total voltage to reach 18 V:\n\n$ V = I_g(R + R_s) $\n\n$ R_s = \\frac{V}{I_g} - R = \\frac{18}{0.003} - 12 = 6000 - 12 = 5988\\ \\Omega $\n\nConnect this $ \\approx 5.99\\ \\text{k}\\Omega $ resistor in **series** with the galvanometer.',
              'ncert_exercise', 'NCERT Ex 4.27'),
            num('ncert-5-28',
              'A galvanometer coil has a resistance of 15 Ω and the metre shows full scale deflection for a current of 4 mA. How will you convert the metre into an ammeter of range 0 to 6 A?',
              'Add a shunt $ S \\approx 0.01\\ \\Omega $ in parallel with the galvanometer',
              'At full-scale deflection, the galvanometer carries $ I_g = 4\\ \\text{mA} $ and the shunt carries the rest, $ (I - I_g) $. Since they are in parallel, the voltage across each is equal:\n\n$ I_g R = (I - I_g)S $\n\n$ S = \\frac{I_g R}{I - I_g} = \\frac{(0.004)(15)}{6 - 0.004} = \\frac{0.06}{5.996} \\approx 0.01\\ \\Omega $\n\nConnect this small $ \\approx 0.01\\ \\Omega $ shunt resistor in **parallel** with the galvanometer, so almost all of the 6 A bypasses the delicate coil.',
              'ncert_exercise', 'NCERT Ex 4.28'),
          ],
        },
      ],
    }),
    b('text', 3, {
      markdown: 'That closes out the chapter\'s own exercise set — from the field of a single wire all the way to the meter you\'d actually build with one.',
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
