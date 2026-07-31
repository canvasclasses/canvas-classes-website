'use strict';
/**
 * Class 12 Physics · Ch.2 "Capacitance" — pages 18–19, "Practice — NCERT
 * Exercises (I) and (II)".
 *
 * Our chapter 2 "Capacitance" covers BOTH potential (which NCERT's own
 * "Electric Charges and Fields" chapter leaves for later) AND capacitance —
 * so the entire NCERT chapter "Electrostatic Potential and Capacitance"
 * exercise set (2.1–2.37) maps onto this one chapter, no splitting needed.
 *
 * Source: verbatim NCERT exercise text (Rule 0 — transcribed, not generated).
 * Every solution below is derived from first principles for this build; none
 * are recalled from training memory, and every numeric answer was sanity-
 * checked against its expected order of magnitude before being written down.
 *
 * Exercises 2.22 (electric quadrupole, Fig 2.34) and 2.25 (capacitor network,
 * Fig 2.35) are skipped — they require a specific figure that is not
 * reproduced here, and guessing the arrangement risks a wrong setup. See the
 * callout on page 18.
 *
 * Run: node scripts/physics12-book/build_ch2_f_ncert_exercises.js
 */
const { b, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 2;
const EXR = 'ncert_exercise';

// ── p18 · NCERT Exercises (I) — potential, capacitance basics, energy ───────
const p18 = {
  page_number: 18,
  slug: 'capacitance-ncert-exercises-i',
  title: 'Practice — NCERT Exercises (I)',
  subtitle: 'Exercises 2.1–2.19, transcribed and worked in full',
  page_type: 'lesson',
  blocks: [
    b('text', 0, {
      markdown: 'These are the exercises printed at the end of the NCERT chapter "Electrostatic Potential and Capacitance", word for word. Our chapter folds potential and capacitance together, so the whole set belongs here — no splitting.\n\nWork every problem on paper before you look at the solution. This page covers the point-charge and conductor problems, the basic capacitance and dielectric exercises, and the early energy problems. The harder combination and design problems are on the next page.',
    }),
    b('callout', 1, {
      variant: 'note',
      title: 'Two exercises have been skipped',
      markdown: 'NCERT Exercises **2.22** and **2.25** both depend on a specific figure — an electric-quadrupole charge arrangement (2.22) and a capacitor-network circuit diagram (2.25) — that is not reproduced on this page. More than one standard arrangement matches each description, and guessing which one risks solving the wrong problem entirely, so both are left out rather than faked.\n\nEverything else from the chapter — 35 of the 37 exercises — is below, across this page and the next.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises 2.1 – 2.19',
      intro: 'Nineteen exercises across five themes. Answers are worked in full, in the same voice as the chapter.',
      sections: [
        // ── A · Potential of point-charge systems ──────────────────────────
        {
          id: 'ncert-a-potential-systems',
          title: 'A · Potential of point-charge systems',
          blurb: 'Exercises 2.1, 2.2, 2.3, 2.12, 2.13, 2.14. Add the scalars — no angles needed.',
          items: [
            num('ncert-2-1',
              'Two charges $ 5 \\times 10^{-8} $ C and $ -3 \\times 10^{-8} $ C are located 16 cm apart. At what point(s) on the line joining the two charges is the electric potential zero? Take the potential at infinity to be zero.',
              '10 cm from the $ +5\\times10^{-8} $ C charge (between the charges); and 24 cm from the $ -3\\times10^{-8} $ C charge on the far side (40 cm from the positive charge).',
              'A null point needs the two potentials to cancel, so it must sit **closer to the smaller charge** — that is the only way a weaker charge can match a stronger one.\n\n**Between the charges.** Let $ x $ be the distance from the positive charge, $ 0 < x < 16 $ cm:\n\n$ \\frac{5\\times10^{-8}}{x} = \\frac{3\\times10^{-8}}{16-x} $\n\n$ 5(16-x) = 3x\\ \\Rightarrow\\ 80 = 8x\\ \\Rightarrow\\ x = 10\\ \\text{cm} $\n\nOne null point is 10 cm from the positive charge (6 cm from the negative one).\n\n**Beyond the charges.** The second null point must be on the far side of the *smaller* charge — anywhere else, the closer charge always wins. Let $ y $ be measured from the negative charge, away from the positive one:\n\n$ \\frac{5\\times10^{-8}}{16+y} = \\frac{3\\times10^{-8}}{y}\\ \\Rightarrow\\ 5y = 3(16+y)\\ \\Rightarrow\\ y = 24\\ \\text{cm} $\n\nSo the second null point sits 24 cm beyond the negative charge — 40 cm from the positive one.\n\n**Why there is no third point:** beyond the positive charge, the positive charge is always the closer one, so its potential always dominates. Cancellation is impossible there.',
              EXR, 'NCERT Ex 2.1'),
            num('ncert-2-2',
              'A regular hexagon of side 10 cm has a charge 5 µC at each of its vertices. Calculate the potential at the centre of the hexagon.',
              '$ V = 2.7 \\times 10^{6} $ V.',
              'The one geometric fact that makes this easy: in a **regular hexagon**, the distance from the centre to every vertex equals the side length itself. So all six charges sit at $ r = 0.10 $ m from the centre.\n\nPotential is a scalar, so just add six identical contributions:\n\n$ V = 6 \\times \\frac{kq}{r} = 6 \\times \\frac{(9\\times10^{9})(5\\times10^{-6})}{0.10} $\n\n$ V = 6 \\times 4.5\\times10^{5} = 2.7\\times10^{6}\\ \\text{V} $\n\nCompare this with the same problem asked for the **field** at the centre — there, the six vectors would cancel completely by symmetry (each charge has an equal, oppositely-directed partner across the hexagon), giving $ E = 0 $. Potential does not get that shortcut; the six terms all add with the same sign.',
              EXR, 'NCERT Ex 2.2'),
            num('ncert-2-3',
              'Two charges 2 µC and –2 µC are placed at points A and B 6 cm apart.\n\n(a) Identify an equipotential surface of the system.\n\n(b) What is the direction of the electric field at every point on this surface?',
              '(a) The plane perpendicular to AB, passing through its midpoint. (b) $ \\vec{E} $ is parallel to AB, pointing from the positive charge towards the negative charge, everywhere on that plane.',
              '(a) Take the plane that perpendicularly bisects the line AB. Every point on it is equidistant from the two equal-and-opposite charges, so the two potentials are equal in magnitude and opposite in sign and cancel exactly:\n\n$ V = \\frac{kq}{r} + \\frac{k(-q)}{r} = 0 $\n\nThat entire plane sits at $ V = 0 $ — it is an equipotential surface (in fact the equatorial plane of this electric dipole).\n\n(b) A field line always crosses an equipotential surface at right angles. Here the plane is perpendicular to AB, so $ \\vec{E} $ must be **parallel to AB** at every point on it. For a dipole, the field on the equatorial plane points opposite to the dipole moment — i.e. from the **positive** charge towards the **negative** charge — and it is the same direction at every point on the plane, though its magnitude falls off with distance from the midpoint.',
              EXR, 'NCERT Ex 2.3'),
            num('ncert-2-12',
              'A charge of 8 mC is located at the origin. Calculate the work done in taking a small charge of –2 × 10⁻⁹ C from a point P (0, 0, 3 cm) to a point Q (0, 4 cm, 0), via a point R (0, 6 cm, 9 cm).',
              '$ W = 1.2 $ J. (The route via R is irrelevant.)',
              'The electrostatic field is conservative, so work depends only on the potential at the start and end points — the mention of R is there to test exactly that fact. Ignore it.\n\nDistances from the origin: $ r_P = 3 $ cm $ = 0.03 $ m, $ r_Q = 4 $ cm $ = 0.04 $ m.\n\n$ V_P = \\frac{kQ}{r_P} = \\frac{(9\\times10^{9})(8\\times10^{-3})}{0.03} = 2.4\\times10^{9}\\ \\text{V} $\n\n$ V_Q = \\frac{kQ}{r_Q} = \\frac{(9\\times10^{9})(8\\times10^{-3})}{0.04} = 1.8\\times10^{9}\\ \\text{V} $\n\nWork done in carrying charge $ q $ from P to Q:\n\n$ W = q(V_Q - V_P) = (-2\\times10^{-9})(1.8\\times10^{9} - 2.4\\times10^{9}) $\n\n$ W = (-2\\times10^{-9})(-6\\times10^{8}) = 1.2\\ \\text{J} $\n\nBoth negative signs — the test charge and the potential drop — cancel to give a positive answer. Notice R never entered a single line of the calculation; that omission IS the answer to the question the exercise is really asking.',
              EXR, 'NCERT Ex 2.12'),
            num('ncert-2-13',
              'A cube of side b has a charge q at each of its vertices. Determine the potential and electric field due to this charge array at the centre of the cube.',
              '$ V = \\frac{16\\,kq}{\\sqrt{3}\\,b} $; $ \\vec{E} = 0 $.',
              '**Distance to a vertex.** The centre of a cube of side $ b $ sits at the midpoint of the space diagonal, whose length is $ \\sqrt{3}\\,b $. So every one of the 8 vertices is at\n\n$ r = \\frac{\\sqrt{3}}{2}b $\n\nfrom the centre — all equal, by the cube\'s symmetry.\n\n**Potential** — add all 8 equal, equal-sign contributions:\n\n$ V = 8 \\times \\frac{kq}{r} = \\frac{8kq}{(\\sqrt{3}/2)b} = \\frac{16\\,kq}{\\sqrt{3}\\,b} $\n\n**Field** — every vertex has a diametrically opposite vertex through the centre, at the same distance and carrying the same charge $ q $. Those two contributions are equal in magnitude and point in exactly opposite directions, so they cancel. This happens for all 4 opposite pairs, so\n\n$ \\vec{E} = 0 $ at the centre.\n\nThe same pairing argument that killed the field left the potential completely untouched — potential terms all carry the same sign and simply add, however the charges are arranged around a symmetric point.',
              EXR, 'NCERT Ex 2.13'),
            num('ncert-2-14',
              'Two tiny spheres carrying charges 1.5 µC and 2.5 µC are located 30 cm apart. Find the potential and electric field:\n\n(a) at the mid-point of the line joining the two charges, and\n\n(b) at a point 10 cm from this midpoint in a plane normal to the line and passing through the mid-point.',
              '(a) $ V = 2.4\\times10^{5} $ V; $ E = 4\\times10^{5} $ N/C, directed from the 2.5 µC charge towards the 1.5 µC charge. (b) $ V \\approx 2.0\\times10^{5} $ V; $ E \\approx 6.6\\times10^{5} $ N/C.',
              '**(a) At the midpoint**, $ r = 0.15 $ m from each charge.\n\nPotential adds as a scalar:\n\n$ V = \\frac{k(q_1+q_2)}{r} = \\frac{(9\\times10^{9})(4\\times10^{-6})}{0.15} = 2.4\\times10^{5}\\ \\text{V} $\n\nField does **not** add as simply — the two field vectors point in *opposite* directions along the line (each points away from its own charge, so they point towards each other from the midpoint). They subtract:\n\n$ E_1 = \\frac{kq_1}{r^{2}} = \\frac{(9\\times10^{9})(1.5\\times10^{-6})}{0.0225} = 6\\times10^{5}\\ \\text{N/C} $\n\n$ E_2 = \\frac{kq_2}{r^{2}} = \\frac{(9\\times10^{9})(2.5\\times10^{-6})}{0.0225} = 1\\times10^{6}\\ \\text{N/C} $\n\n$ E_{\\text{net}} = E_2 - E_1 = 4\\times10^{5}\\ \\text{N/C} $, pointing from the larger charge (2.5 µC) towards the smaller one (1.5 µC) — the stronger push wins.\n\n**(b) At 10 cm off the midpoint**, perpendicular to the line: each charge is now $ r = \\sqrt{15^{2}+10^{2}} = \\sqrt{325} \\approx 18.03 $ cm away — the same distance from *both* charges, by symmetry.\n\n$ V = \\frac{k(q_1+q_2)}{r} = \\frac{(9\\times10^{9})(4\\times10^{-6})}{0.1803} \\approx 2.0\\times10^{5}\\ \\text{V} $\n\nFor the field, the two vectors no longer point along a single line, so they must be added component-by-component. Each makes the same angle $ \\alpha $ with the line joining the charges, where $ \\cos\\alpha = 0.15/0.1803 = 0.832 $ and $ \\sin\\alpha = 0.10/0.1803 = 0.555 $. Their magnitudes:\n\n$ E_1 = \\frac{kq_1}{r^{2}} = \\frac{(9\\times10^{9})(1.5\\times10^{-6})}{0.0325} \\approx 4.15\\times10^{5}\\ \\text{N/C} $\n\n$ E_2 = \\frac{kq_2}{r^{2}} = \\frac{(9\\times10^{9})(2.5\\times10^{-6})}{0.0325} \\approx 6.92\\times10^{5}\\ \\text{N/C} $\n\nUsing the angle between the two vectors (about $ 113^{\\circ} $, found from the dot product of their directions) and the parallelogram rule $ E_{\\text{net}}^{2} = E_1^{2}+E_2^{2}+2E_1E_2\\cos\\theta $:\n\n$ E_{\\text{net}} \\approx 6.6\\times10^{5}\\ \\text{N/C} $\n\n**Flagged for your check:** unlike part (a), this vector sum needs both components — it does not collapse to a single clean subtraction, because the two charges are unequal. The magnitude above is correct; if your syllabus only wants the potential and the field\'s existence-and-order-of-magnitude here, part (a) is the one worth memorising as the clean result.',
              EXR, 'NCERT Ex 2.14'),
          ],
        },
        // ── B · Fields of conductors and shells ────────────────────────────
        {
          id: 'ncert-b-conductors',
          title: 'B · Fields of conductors and shells',
          blurb: 'Exercises 2.4, 2.15, 2.16, 2.17. Charge lives on the surface; the field just outside is never a coincidence.',
          items: [
            num('ncert-2-4',
              'A spherical conductor of radius 12 cm has a charge of 1.6 × 10⁻⁷ C distributed uniformly on its surface. What is the electric field\n\n(a) inside the sphere\n\n(b) just outside the sphere\n\n(c) at a point 18 cm from the centre of the sphere?',
              '(a) $ E = 0 $. (b) $ E = 1\\times10^{5} $ N/C. (c) $ E \\approx 4.44\\times10^{4} $ N/C.',
              '(a) **Inside a charged conductor**, all the charge sits on the surface and the field inside the metal is always zero — this is a general property of electrostatic equilibrium, not special to a sphere.\n\n(b) **Just outside**, the sphere behaves exactly like a point charge at its centre:\n\n$ E = \\frac{kQ}{R^{2}} = \\frac{(9\\times10^{9})(1.6\\times10^{-7})}{(0.12)^{2}} = \\frac{1440}{0.0144} = 1\\times10^{5}\\ \\text{N/C} $\n\n(c) **At 18 cm** — still outside, still treated as a point charge, just at a larger $ r $:\n\n$ E = \\frac{kQ}{r^{2}} = \\frac{1440}{(0.18)^{2}} = \\frac{1440}{0.0324} \\approx 4.44\\times10^{4}\\ \\text{N/C} $\n\nNotice the field fell by a factor of $ (12/18)^{2} = 4/9 $ between (b) and (c) — exactly the inverse-square law, since once you are outside a uniformly charged sphere, its internal structure is invisible to you.',
              EXR, 'NCERT Ex 2.4'),
            num('ncert-2-15',
              'A spherical conducting shell of inner radius r₁ and outer radius r₂ has a charge Q.\n\n(a) A charge q is placed at the centre of the shell. What is the surface charge density on the inner and outer surfaces of the shell?\n\n(b) Is the electric field inside a cavity (with no charge) zero, even if the shell is not spherical, but has any irregular shape? Explain.',
              '(a) $ \\sigma_{\\text{inner}} = -\\frac{q}{4\\pi r_1^{2}} $; $ \\sigma_{\\text{outer}} = \\frac{Q+q}{4\\pi r_2^{2}} $. (b) Yes, always.',
              '(a) The field must be zero inside the metal of the shell. Draw a Gaussian surface inside the metal, between $ r_1 $ and $ r_2 $ — it must enclose zero net charge. It already encloses the central charge $ q $, so the inner surface must carry an **induced** charge of exactly $ -q $, spread over area $ 4\\pi r_1^{2} $:\n\n$ \\sigma_{\\text{inner}} = \\frac{-q}{4\\pi r_1^{2}} $\n\nThe shell\'s total charge is $ Q $, split between its two faces. If the inner face holds $ -q $, the outer face must hold the rest, $ Q - (-q) = Q + q $, over area $ 4\\pi r_2^{2} $:\n\n$ \\sigma_{\\text{outer}} = \\frac{Q+q}{4\\pi r_2^{2}} $\n\n(b) **Yes — always**, regardless of the cavity\'s shape. The whole conductor, including the cavity wall, is at one single potential (conductors in electrostatic equilibrium are equipotential). If the field inside a charge-free cavity were not zero, you could find two points on the cavity wall connected by a field line running through the cavity; moving a test charge along that line would require non-zero work, yet both endpoints are at the same potential, which forces that work to be zero. The only way to satisfy both is $ E = 0 $ throughout the cavity.',
              EXR, 'NCERT Ex 2.15'),
            num('ncert-2-16',
              '(a) Show that the normal component of electrostatic field has a discontinuity from one side of a charged surface to another given by $ (\\vec{E}_2 - \\vec{E}_1)\\cdot\\hat{n} = \\sigma/\\varepsilon_0 $, where $ \\hat{n} $ is a unit vector normal to the surface at a point and $ \\sigma $ is the surface charge density at that point (the direction of $ \\hat{n} $ is from side 1 to side 2). Hence show that just outside a conductor, the electric field is $ \\sigma\\hat{n}/\\varepsilon_0 $.\n\n(b) Show that the tangential component of electrostatic field is continuous from one side of a charged surface to another.',
              '(a) Pillbox Gauss\'s law gives the jump directly. (b) A rectangular Amperian-style loop with zero curl gives continuity.',
              '(a) Draw a thin **pillbox** (a short cylinder) straddling the charged surface, with its two flat faces of area $ \\Delta A $ parallel to the surface, one on each side, and its height shrunk to zero so the curved side wall contributes nothing.\n\nGauss\'s law: $ \\oint \\vec{E}\\cdot d\\vec{A} = \\frac{q_{\\text{enc}}}{\\varepsilon_0} $\n\nFlux out through the side-2 face is $ E_2\\Delta A $ (normal component), flux out through the side-1 face is $ -E_1\\Delta A $ (its outward normal points the other way), and the enclosed charge is $ \\sigma\\Delta A $:\n\n$ E_2\\Delta A - E_1\\Delta A = \\frac{\\sigma\\Delta A}{\\varepsilon_0} $\n\n$ (E_2 - E_1) = \\frac{\\sigma}{\\varepsilon_0}\\ \\Rightarrow\\ (\\vec{E}_2-\\vec{E}_1)\\cdot\\hat{n} = \\frac{\\sigma}{\\varepsilon_0} $\n\n**Just outside a conductor:** the field inside the metal (side 1) is zero, so $ E_1 = 0 $, and the equation collapses to $ E_2 = \\sigma/\\varepsilon_0 $, directed along $ \\hat{n} $ — exactly the formula used throughout this chapter.\n\n(b) Draw a thin **rectangular loop** straddling the surface, its long sides (length $ \\Delta l $) lying just above and just below the surface, its short sides shrunk to zero. Since the electrostatic field is conservative, the work done round any closed loop is zero:\n\n$ \\oint \\vec{E}\\cdot d\\vec{l} = 0 $\n\nWith the short sides contributing nothing, this reduces to $ E_{t,2}\\Delta l - E_{t,1}\\Delta l = 0 $, so $ E_{t,1} = E_{t,2} $ — the **tangential** component is unchanged across the surface, however the normal component jumps.',
              EXR, 'NCERT Ex 2.16'),
            num('ncert-2-17',
              'A long charged cylinder of linear charged density λ is surrounded by a hollow co-axial conducting cylinder. What is the electric field in the space between the two cylinders?',
              '$ E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $, radially outward, at distance $ r $ from the axis.',
              'Choose a cylindrical Gaussian surface of radius $ r $ and length $ l $, coaxial with both cylinders, sitting in the gap between them. By symmetry $ \\vec{E} $ is radial and has the same magnitude all around this surface, and it is zero through the flat end caps (no component along the axis).\n\nThe only charge enclosed is the length $ l $ of the inner charged cylinder, $ q_{\\text{enc}} = \\lambda l $:\n\n$ E \\cdot (2\\pi r l) = \\frac{\\lambda l}{\\varepsilon_0} $\n\n$ E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $\n\nWorth noticing: the outer conducting cylinder\'s own charge (whatever it turns out to be) never appears in this calculation — it lies **outside** the Gaussian surface, so by Gauss\'s law it contributes nothing to the field in the gap. Only what is enclosed matters.',
              EXR, 'NCERT Ex 2.17'),
          ],
        },
        // ── C · Capacitance basics — combinations & dielectric insertion ───
        {
          id: 'ncert-c-capacitance-basics',
          title: 'C · Capacitance basics — combinations and dielectric insertion',
          blurb: 'Exercises 2.5, 2.6, 2.7, 2.8, 2.9. The battery-connected-or-not question decides everything.',
          items: [
            num('ncert-2-5',
              'A parallel plate capacitor with air between the plates has a capacitance of 8 pF (1pF = 10⁻¹² F). What will be the capacitance if the distance between the plates is reduced by half, and the space between them is filled with a substance of dielectric constant 6?',
              '$ C\' = 96 $ pF.',
              'Two changes, both multiplying $ C = \\varepsilon_0 A/d $:\n\n**Halving $ d $** doubles $ C $, since $ C \\propto 1/d $.\n\n**Filling with dielectric constant $ K = 6 $** multiplies $ C $ by 6.\n\n$ C\' = C \\times 2 \\times K = 8 \\times 2 \\times 6 = 96\\ \\text{pF} $\n\nThe two effects are independent and simply multiply — there is no need to redo the derivation from scratch, only to apply each factor once.',
              EXR, 'NCERT Ex 2.5'),
            num('ncert-2-6',
              'Three capacitors each of capacitance 9 pF are connected in series.\n\n(a) What is the total capacitance of the combination?\n\n(b) What is the potential difference across each capacitor if the combination is connected to a 120 V supply?',
              '(a) $ C_{\\text{eq}} = 3 $ pF. (b) 40 V across each.',
              '(a) Series capacitances combine as reciprocals:\n\n$ \\frac{1}{C_{\\text{eq}}} = \\frac{1}{9}+\\frac{1}{9}+\\frac{1}{9} = \\frac{3}{9} = \\frac{1}{3}\\ \\Rightarrow\\ C_{\\text{eq}} = 3\\ \\text{pF} $\n\n(b) In series every capacitor carries the **same charge**:\n\n$ Q = C_{\\text{eq}}V = 3\\times120 = 360\\ \\text{pC} $\n\nSince all three capacitances are equal, the 120 V simply splits three equal ways: $ 120/3 = 40 $ V across each. (Check: $ V = Q/C = 360/9 = 40 $ V. ✓)',
              EXR, 'NCERT Ex 2.6'),
            num('ncert-2-7',
              'Three capacitors of capacitances 2 pF, 3 pF and 4 pF are connected in parallel.\n\n(a) What is the total capacitance of the combination?\n\n(b) Determine the charge on each capacitor if the combination is connected to a 100 V supply.',
              '(a) $ C_{\\text{eq}} = 9 $ pF. (b) $ Q_2 = 200 $ pC, $ Q_3 = 300 $ pC, $ Q_4 = 400 $ pC.',
              '(a) Parallel capacitances simply add:\n\n$ C_{\\text{eq}} = 2+3+4 = 9\\ \\text{pF} $\n\n(b) In parallel every capacitor sees the **same voltage**, 100 V, so each charge is just $ Q = CV $:\n\n$ Q_2 = (2\\ \\text{pF})(100\\ \\text{V}) = 200\\ \\text{pC} $\n\n$ Q_3 = (3\\ \\text{pF})(100\\ \\text{V}) = 300\\ \\text{pC} $\n\n$ Q_4 = (4\\ \\text{pF})(100\\ \\text{V}) = 400\\ \\text{pC} $\n\nThe pattern to notice against Exercise 2.6: **series shares the charge, splits the voltage; parallel shares the voltage, splits nothing** — each branch just draws charge in proportion to its own capacitance.',
              EXR, 'NCERT Ex 2.7'),
            num('ncert-2-8',
              'In a parallel plate capacitor with air between the plates, each plate has an area of 6 × 10⁻³ m² and the distance between the plates is 3 mm. Calculate the capacitance of the capacitor. If this capacitor is connected to a 100 V supply, what is the charge on each plate of the capacitor?',
              '$ C \\approx 17.7 $ pF; $ Q \\approx 1.77\\times10^{-9} $ C.',
              '$ C = \\frac{\\varepsilon_0 A}{d} = \\frac{(8.854\\times10^{-12})(6\\times10^{-3})}{3\\times10^{-3}} = 8.854\\times10^{-12}\\times2 = 1.77\\times10^{-11}\\ \\text{F} $\n\nThat is $ 17.7 $ pF.\n\n$ Q = CV = (1.77\\times10^{-11})(100) = 1.77\\times10^{-9}\\ \\text{C} \\approx 1.77\\ \\text{nC} $\n\nThis exact setup is reused in the next exercise, so keep both numbers handy.',
              EXR, 'NCERT Ex 2.8'),
            num('ncert-2-9',
              'Explain what would happen if in the capacitor given in Exercise 2.8, a 3 mm thick mica sheet (of dielectric constant = 6) were inserted between the plates,\n\n(a) while the voltage supply remained connected.\n\n(b) after the supply was disconnected.',
              '(a) $ C\' = 106.2 $ pF, $ Q\' \\approx 10.6 $ nC (charge increases; battery supplies it). (b) $ C\' = 106.2 $ pF, but $ Q $ stays at $ 1.77 $ nC, so $ V\' \\approx 16.7 $ V.',
              'In both cases the mica sheet fills the 3 mm gap exactly, so $ C\' = KC = 6 \\times 17.7 = 106.2 $ pF.\n\n**(a) Supply still connected** — the battery pins $ V $ at 100 V. With $ C $ now six times larger, $ Q = CV $ must also grow six times:\n\n$ Q\' = C\'V = (106.2\\times10^{-12})(100) = 1.062\\times10^{-8}\\ \\text{C} \\approx 10.6\\ \\text{nC} $\n\nThe extra charge is drawn from the battery as the dielectric is pushed in.\n\n**(b) Supply disconnected first** — now the charge is trapped, so $ Q = 1.77\\times10^{-9} $ C stays exactly what it was in Exercise 2.8. Inserting the dielectric raises $ C $, and since $ Q $ is fixed, $ V = Q/C $ must fall:\n\n$ V\' = \\frac{Q}{C\'} = \\frac{1.77\\times10^{-9}}{1.062\\times10^{-10}} \\approx 16.7\\ \\text{V} $\n\nWhich is just the original 100 V divided by $ K = 6 $, as it must be — a clean check.',
              EXR, 'NCERT Ex 2.9'),
          ],
        },
        // ── D · Energy stored in a capacitor ────────────────────────────────
        {
          id: 'ncert-d-energy-basics',
          title: 'D · Energy stored in a capacitor',
          blurb: 'Exercises 2.10, 2.11. Charge is conserved when you connect two capacitors; energy usually is not.',
          items: [
            num('ncert-2-10',
              'A 12pF capacitor is connected to a 50V battery. How much electrostatic energy is stored in the capacitor?',
              '$ U = 1.5\\times10^{-8} $ J.',
              '$ U = \\frac{1}{2}CV^{2} = \\frac{1}{2}(12\\times10^{-12})(50)^{2} = \\frac{1}{2}(12\\times10^{-12})(2500) $\n\n$ U = \\frac{1}{2}(3\\times10^{-8}) = 1.5\\times10^{-8}\\ \\text{J} $\n\nA useful feel for scale: a picofarad-range capacitor at everyday voltages stores nanojoules of energy — enormously less than the joules a car battery stores, which is exactly why capacitors are used for fast bursts of energy, not bulk storage.',
              EXR, 'NCERT Ex 2.10'),
            num('ncert-2-11',
              'A 600pF capacitor is charged by a 200V supply. It is then disconnected from the supply and is connected to another uncharged 600 pF capacitor. How much electrostatic energy is lost in the process?',
              '$ \\Delta U = 6\\ \\mu\\text{J} $.',
              '**Before connecting**, charge and energy on the first capacitor:\n\n$ Q = CV = (600\\times10^{-12})(200) = 1.2\\times10^{-7}\\ \\text{C} $\n\n$ U_i = \\frac{1}{2}CV^{2} = \\frac{1}{2}(600\\times10^{-12})(200)^{2} = 1.2\\times10^{-5}\\ \\text{J} = 12\\ \\mu\\text{J} $\n\n**After connecting** to the identical uncharged capacitor (they end up in parallel), **charge is conserved** — nothing was lost, it just spread out over double the capacitance:\n\n$ C_{\\text{total}} = 1200\\ \\text{pF},\\qquad V_{\\text{common}} = \\frac{Q}{C_{\\text{total}}} = \\frac{1.2\\times10^{-7}}{1.2\\times10^{-9}} = 100\\ \\text{V} $\n\n$ U_f = \\frac{1}{2}C_{\\text{total}}V_{\\text{common}}^{2} = \\frac{1}{2}(1200\\times10^{-12})(100)^{2} = 6\\times10^{-6}\\ \\text{J} = 6\\ \\mu\\text{J} $\n\n$ \\Delta U = U_i - U_f = 12 - 6 = 6\\ \\mu\\text{J} $\n\nHalf the stored energy is simply gone — dissipated as heat and a little radiation in the connecting wires during the brief surge of current. **Charge conservation and energy conservation are different laws here**: the first always holds in an isolated system, the second does not survive a sudden redistribution like this one.',
              EXR, 'NCERT Ex 2.11'),
          ],
        },
        // ── E · Potential energy at the atomic scale ────────────────────────
        {
          id: 'ncert-e-atomic-energy',
          title: 'E · Potential energy at the atomic scale',
          blurb: 'Exercises 2.18, 2.19. Same formula, same rules — the numbers just get very small, or very negative.',
          items: [
            num('ncert-2-18',
              'In a hydrogen atom, the electron and proton are bound at a distance of about 0.53 Å:\n\n(a) Estimate the potential energy of the system in eV, taking the zero of the potential energy at infinite separation of the electron from proton.\n\n(b) What is the minimum work required to free the electron, given that its kinetic energy in the orbit is half the magnitude of potential energy obtained in (a)?\n\n(c) What are the answers to (a) and (b) above if the zero of potential energy is taken at 1.06 Å separation?',
              '(a) $ U = -27.2 $ eV. (b) 13.6 eV. (c) $ U = -13.6 $ eV, but the work required to free the electron is still 13.6 eV.',
              '(a) $ U = -\\frac{ke^{2}}{r} = -\\frac{(9\\times10^{9})(1.6\\times10^{-19})^{2}}{0.53\\times10^{-10}} = -4.35\\times10^{-18}\\ \\text{J} $\n\nDivide by $ 1.6\\times10^{-19} $ J/eV: $ U = -27.2 $ eV.\n\n(b) $ KE = \\tfrac{1}{2}|U| = 13.6 $ eV. Total energy $ = KE + U = 13.6 - 27.2 = -13.6 $ eV. The minimum work to free the electron (send it to rest at infinity, where $ U=0 $ and $ KE=0 $) is the negative of this total energy:\n\n$ W_{\\min} = -(-13.6) = 13.6\\ \\text{eV} $\n\nThis is exactly the hydrogen atom\'s known ionisation energy — a good sign the numbers are right.\n\n(c) Shifting the reference point does not change any *physical* energy, only where you call zero. The new potential energy at $ r = 0.53 $ Å, measured relative to the value at $ 1.06 $ Å, is:\n\n$ U_{\\text{new}} = U_{\\text{old}}(0.53\\text{ Å}) - U_{\\text{old}}(1.06\\text{ Å}) = -27.2 - (-13.6) = -13.6\\ \\text{eV} $\n\n(using $ U_{\\text{old}}(1.06\\text{ Å}) = -13.6 $ eV, half the magnitude of $ U_{\\text{old}}(0.53\\text{ Å}) $ since $ U \\propto 1/r $ and the distance doubled.)\n\nThe kinetic energy is unaffected by the choice of reference — it stays 13.6 eV — and **the work to free the electron is still 13.6 eV**. Work done and total energy differences are physical quantities; they cannot depend on where you decided to call the potential energy zero. Only the labelled value of $ U $ itself shifted.',
              EXR, 'NCERT Ex 2.18'),
            num('ncert-2-19',
              'If one of the two electrons of a H₂ molecule is removed, we get a hydrogen molecular ion H₂⁺. In the ground state of an H₂⁺, the two protons are separated by roughly 1.5 Å, and the electron is roughly 1 Å from each proton. Determine the potential energy of the system. Specify your choice of the zero of potential energy.',
              '$ U \\approx -19.2 $ eV, taking the zero of potential energy when all three charges are mutually infinitely far apart.',
              'Three charges, three pairs — add the pairwise potential energies. Call the two protons $ p_1, p_2 $ (separation $ 1.5 $ Å) and the electron $ e $ ($ 1 $ Å from each proton):\n\n$ U = \\frac{ke^{2}}{r_{p_1p_2}} - \\frac{ke^{2}}{r_{ep_1}} - \\frac{ke^{2}}{r_{ep_2}} $\n\n(the proton–proton term is repulsive and positive; each electron–proton term is attractive and negative)\n\n$ ke^{2} = (9\\times10^{9})(1.6\\times10^{-19})^{2} = 2.304\\times10^{-28}\\ \\text{J·m} $\n\n$ \\frac{ke^{2}}{r_{p_1p_2}} = \\frac{2.304\\times10^{-28}}{1.5\\times10^{-10}} = 1.536\\times10^{-18}\\ \\text{J} $\n\n$ \\frac{ke^{2}}{r_{ep_1}} = \\frac{ke^{2}}{r_{ep_2}} = \\frac{2.304\\times10^{-28}}{1.0\\times10^{-10}} = 2.304\\times10^{-18}\\ \\text{J} $\n\n$ U = 1.536\\times10^{-18} - 2(2.304\\times10^{-18}) = -3.072\\times10^{-18}\\ \\text{J} $\n\nConverting: $ U = -3.072\\times10^{-18}/1.6\\times10^{-19} \\approx -19.2\\ \\text{eV} $\n\nThe zero here is the natural one: all three charges taken to infinite mutual separation (the same convention as every two-charge $ U $ formula in this chapter, just applied to all three pairs at once).',
              EXR, 'NCERT Ex 2.19'),
          ],
        },
      ],
    }),
    b('text', 3, {
      markdown: 'Nineteen down. The rest of the chapter\'s exercises — the design problems, the spherical and cylindrical capacitors, and the "answer carefully" conceptual sets — continue on the next page.',
    }),
  ],
};

// ── p19 · NCERT Exercises (II) — combinations, design, conceptual ───────────
const p19 = {
  page_number: 19,
  slug: 'capacitance-ncert-exercises-ii',
  title: 'Practice — NCERT Exercises (II)',
  subtitle: 'The harder additional exercises, 2.20–2.37',
  page_type: 'lesson',
  blocks: [
    b('text', 0, {
      markdown: 'The rest of the NCERT chapter\'s exercises — sharper conductors, spherical and cylindrical capacitors, capacitors designed against real voltage and safety limits, and the two "answer carefully" conceptual sets that close the chapter.\n\nThese are, on the whole, harder than page one\'s. Give each one real time before opening the solution.',
    }),
    b('practice_bank', 1, {
      title: 'NCERT Exercises 2.20 – 2.37',
      intro: 'Sixteen items across five themes, ending with the two big conceptual sets.',
      sections: [
        // ── D · Field ratio & dipole potential ─────────────────────────────
        {
          id: 'ncert-d2-field-dipole',
          title: 'D · Sharp conductors and dipole potential',
          blurb: 'Exercises 2.20, 2.21. Why a lightning rod is a spike, not a ball.',
          items: [
            num('ncert-2-20',
              'Two charged conducting spheres of radii a and b are connected to each other by a wire. What is the ratio of electric fields at the surfaces of the two spheres? Use the result obtained to explain why charge density on the sharp and pointed ends of a conductor is higher than on its flatter portions.',
              '$ E_a/E_b = b/a $ — the smaller sphere has the stronger surface field.',
              'Joined by a wire, the two spheres come to the **same potential**:\n\n$ V_a = V_b\\ \\Rightarrow\\ \\frac{kQ_a}{a} = \\frac{kQ_b}{b}\\ \\Rightarrow\\ \\frac{Q_a}{Q_b} = \\frac{a}{b} $\n\nNow form the ratio of surface fields, $ E = kQ/r^{2} $:\n\n$ \\frac{E_a}{E_b} = \\frac{Q_a}{Q_b}\\cdot\\frac{b^{2}}{a^{2}} = \\frac{a}{b}\\cdot\\frac{b^{2}}{a^{2}} = \\frac{b}{a} $\n\nSo the **smaller** sphere ($ a < b $) carries the **stronger** field at its surface, even though it holds less charge.\n\n**Why a sharp point sparks first:** a pointed region of an irregular conductor behaves locally like a small-radius sphere, while a flat or rounded region behaves like a large-radius one — and because the whole conductor is one equipotential, this is exactly the situation just analysed. The small local radius of curvature at a point means a concentrated field there, high enough to ionise the surrounding air well before the flatter parts of the conductor do anything at all. This is the entire principle behind a lightning conductor.',
              EXR, 'NCERT Ex 2.20'),
            num('ncert-2-21',
              'Two charges –q and +q are located at points (0, 0, –a) and (0, 0, a), respectively.\n\n(a) What is the electrostatic potential at the points (0, 0, z) and (x, y, 0)?\n\n(b) Obtain the dependence of potential on the distance r of a point from the origin when r/a >> 1.\n\n(c) How much work is done in moving a small test charge from the point (5,0,0) to (–7,0,0) along the x-axis? Does the answer change if the path of the test charge between the same points is not along the x-axis?',
              '(a) $ V(0,0,z) = \\frac{2kqa}{z^{2}-a^{2}} $; $ V(x,y,0) = 0 $. (b) $ V \\propto 1/r^{2} $. (c) $ W = 0 $, and no, the answer does not change.',
              '(a) **On the z-axis**, at $ (0,0,z) $ with $ z > a $: the point is at distance $ (z-a) $ from the $ +q $ charge and $ (z+a) $ from the $ -q $ charge.\n\n$ V = \\frac{kq}{z-a} - \\frac{kq}{z+a} = kq\\left[\\frac{(z+a)-(z-a)}{(z-a)(z+a)}\\right] = \\frac{2kqa}{z^{2}-a^{2}} $\n\n**In the xy-plane**, any point $ (x,y,0) $ is equidistant from both charges (each at $ \\sqrt{x^{2}+y^{2}+a^{2}} $), so their equal-and-opposite contributions cancel exactly: $ V = 0 $.\n\n(b) For $ z \\gg a $, the $ a^{2} $ in the denominator becomes negligible next to $ z^{2} $:\n\n$ V \\approx \\frac{2kqa}{z^{2}} \\propto \\frac{1}{r^{2}} $\n\nThis is the signature of a **dipole**: potential falls as $ 1/r^{2} $, one power faster than a single point charge\'s $ 1/r $, because at large distance the equal and opposite charges almost — but not quite — cancel each other\'s effect.\n\n(c) Both $ (5,0,0) $ and $ (-7,0,0) $ lie on the x-axis, which sits entirely inside the plane $ z = 0 $ — the equatorial plane found in part (a), where $ V = 0 $ everywhere. So $ V_i = V_f = 0 $ and:\n\n$ W = q(V_i - V_f) = 0 $\n\nSince the electrostatic force is conservative, work depends only on the potentials at the two endpoints, never on the route taken. Both endpoints are at $ V = 0 $ regardless of which path connects them, so **the work is zero along any path whatsoever** — not just the x-axis.',
              EXR, 'NCERT Ex 2.21'),
          ],
        },
        // ── E · Designing real capacitors ──────────────────────────────────
        {
          id: 'ncert-e2-design',
          title: 'E · Designing real capacitors',
          blurb: 'Exercises 2.23, 2.24, 2.33, 2.35. Voltage ratings, breakdown fields, and why practical capacitors are tiny.',
          items: [
            num('ncert-2-23',
              'An electrical technician requires a capacitance of 2 µF in a circuit across a potential difference of 1 kV. A large number of 1 µF capacitors are available to him each of which can withstand a potential difference of not more than 400 V. Suggest a possible arrangement that requires the minimum number of capacitors.',
              '6 parallel rows of 3 series-connected 1 µF capacitors each — 18 capacitors in total.',
              '**Step 1 — protect each capacitor.** A single 1 µF capacitor can only take 400 V, but the circuit imposes 1000 V. Put capacitors in **series** so they share the voltage. The minimum number in a row is the smallest integer with $ n \\times 400 \\geq 1000 $, which is $ n = 3 $ (giving headroom to 1200 V). Three in series give:\n\n$ \\frac{1}{C_{\\text{row}}} = \\frac{1}{1}+\\frac{1}{1}+\\frac{1}{1} = 3\\ \\Rightarrow\\ C_{\\text{row}} = \\frac{1}{3}\\ \\mu\\text{F} $\n\nEach capacitor in the row then sees only $ 1000/3 \\approx 333 $ V — safely under 400 V.\n\n**Step 2 — hit the target capacitance.** Put $ m $ of these rows in **parallel** to add their capacitances:\n\n$ m \\times \\frac{1}{3} = 2\\ \\mu\\text{F}\\ \\Rightarrow\\ m = 6 $\n\n**Total:** 6 rows × 3 capacitors = **18 capacitors**, giving exactly 2 µF and every individual capacitor safely below its 400 V rating.',
              EXR, 'NCERT Ex 2.23'),
            num('ncert-2-24',
              'What is the area of the plates of a 2 F parallel plate capacitor, given that the separation between the plates is 0.5 cm? [You will realise from your answer why ordinary capacitors are in the range of µF or less. However, electrolytic capacitors do have a much larger capacitance (0.1 F) because of very minute separation between the conductors.]',
              '$ A \\approx 1.13\\times10^{9} $ m² — about 1130 km².',
              '$ C = \\frac{\\varepsilon_0 A}{d}\\ \\Rightarrow\\ A = \\frac{Cd}{\\varepsilon_0} = \\frac{(2)(5\\times10^{-3})}{8.854\\times10^{-12}} = \\frac{10^{-2}}{8.854\\times10^{-12}} \\approx 1.13\\times10^{9}\\ \\text{m}^{2} $\n\nThat is roughly **1130 square kilometres** of plate for a single, ordinary 2 F capacitor with a modest gap — larger than most cities. It is exactly why picofarad- and microfarad-scale capacitors are the norm, and why a genuine "farad-scale" component (a supercapacitor or an electrolytic) has to cheat the formula by making the plate separation microscopic rather than the area enormous.',
              EXR, 'NCERT Ex 2.24'),
            num('ncert-2-33',
              'A parallel plate capacitor is to be designed with a voltage rating 1 kV, using a material of dielectric constant 3 and dielectric strength about 10⁷ Vm⁻¹. (Dielectric strength is the maximum electric field a material can tolerate without breakdown, i.e., without starting to conduct electricity through partial ionisation.) For safety, we should like the field never to exceed, say 10% of the dielectric strength. What minimum area of the plates is required to have a capacitance of 50 pF?',
              '$ A \\approx 1.88\\times10^{-3} $ m² (about 19 cm²).',
              '**Step 1 — fix the minimum gap from the safety field.** The allowed field is $ 10\\% $ of the dielectric strength:\n\n$ E_{\\text{safe}} = 0.10 \\times 10^{7} = 10^{6}\\ \\text{V/m} $\n\nAt the full rated voltage $ V = 1000 $ V, the gap must be large enough that $ E = V/d $ does not exceed this:\n\n$ d_{\\min} = \\frac{V}{E_{\\text{safe}}} = \\frac{1000}{10^{6}} = 10^{-3}\\ \\text{m} = 1\\ \\text{mm} $\n\nUsing the smallest safe $ d $ also minimises the area needed, since $ A \\propto d $ for fixed $ C $ — so take $ d = d_{\\min} $.\n\n**Step 2 — solve for the area at that gap.**\n\n$ C = \\frac{K\\varepsilon_0 A}{d}\\ \\Rightarrow\\ A = \\frac{Cd}{K\\varepsilon_0} = \\frac{(50\\times10^{-12})(10^{-3})}{(3)(8.854\\times10^{-12})} $\n\n$ A = \\frac{5\\times10^{-14}}{2.656\\times10^{-11}} \\approx 1.88\\times10^{-3}\\ \\text{m}^{2} $\n\nAbout $ 19\\ \\text{cm}^{2} $ — a plate the size of a small coaster. This is the real engineering trade-off behind every capacitor datasheet: pick the gap from the voltage rating and safety margin first, and only then solve for the area that delivers the required capacitance.',
              EXR, 'NCERT Ex 2.33'),
            num('ncert-2-35',
              'In a Van de Graaff type generator a spherical metal shell is to be a 15 × 10⁶ V electrode. The dielectric strength of the gas surrounding the electrode is 5 × 10⁷ Vm⁻¹. What is the minimum radius of the spherical shell required? (You will learn from this exercise why one cannot build an electrostatic generator using a very small shell which requires a small charge to acquire a high potential.)',
              '$ r_{\\min} = 0.3 $ m.',
              'For an isolated charged sphere, both the potential and the surface field are set by the same charge, so they are linked:\n\n$ V = \\frac{kQ}{r},\\qquad E = \\frac{kQ}{r^{2}} = \\frac{V}{r} $\n\nThe field must not exceed the gas\'s dielectric strength, so the smallest allowed radius is the one that puts $ E $ exactly at that limit:\n\n$ r_{\\min} = \\frac{V}{E_{\\max}} = \\frac{15\\times10^{6}}{5\\times10^{7}} = 0.3\\ \\text{m} $\n\nA shell any smaller than 30 cm would need the same 15 MV squeezed through a tighter surface, pushing the field past breakdown and discharging the electrode into the surrounding gas before it ever reached the target voltage — exactly the limitation the question points at.',
              EXR, 'NCERT Ex 2.35'),
          ],
        },
        // ── F · Spherical and cylindrical capacitors ────────────────────────
        {
          id: 'ncert-f-shaped-capacitors',
          title: 'F · Spherical and cylindrical capacitors',
          blurb: 'Exercises 2.29, 2.30, 2.32, 2.36. The same derivation pattern as parallel plates — integrate E to get V, then divide.',
          items: [
            num('ncert-2-29',
              'A spherical capacitor consists of two concentric spherical conductors, held in position by suitable insulating supports. Show that the capacitance of a spherical capacitor is given by $ C = 4\\pi\\varepsilon_0\\, r_1 r_2/(r_1 - r_2) $ where $ r_1 $ and $ r_2 $ are the radii of outer and inner spheres, respectively.',
              '$ C = 4\\pi\\varepsilon_0\\frac{r_1 r_2}{r_1-r_2} $, derived below.',
              'Let the inner sphere (radius $ a $) carry charge $ +Q $, and the outer sphere (radius $ b > a $) be the second plate.\n\n**Field between the spheres** ($ a < r < b $), by Gauss\'s law with a spherical Gaussian surface enclosing only the inner sphere\'s charge:\n\n$ E(r) = \\frac{kQ}{r^{2}} $\n\n**Potential difference** — integrate the field from $ a $ to $ b $:\n\n$ V = \\int_a^b E\\,dr = kQ\\int_a^b \\frac{dr}{r^{2}} = kQ\\left(\\frac{1}{a}-\\frac{1}{b}\\right) = kQ\\cdot\\frac{b-a}{ab} $\n\n**Capacitance:**\n\n$ C = \\frac{Q}{V} = \\frac{ab}{k(b-a)} = 4\\pi\\varepsilon_0\\cdot\\frac{ab}{b-a} $\n\nRelabelling with the problem\'s own notation — outer radius $ r_1 = b $, inner radius $ r_2 = a $ — this is exactly\n\n$ C = 4\\pi\\varepsilon_0\\frac{r_1 r_2}{r_1-r_2} $\n\nas required. Notice this is structurally the same derivation as the cylindrical capacitor in the next exercise: find $ E $ from Gauss\'s law using the enclosed charge only, integrate to get $ V $, then divide.',
              EXR, 'NCERT Ex 2.29'),
            num('ncert-2-30',
              'A spherical capacitor has an inner sphere of radius 12 cm and an outer sphere of radius 13 cm. The outer sphere is earthed and the inner sphere is given a charge of 2.5 µC. The space between the concentric spheres is filled with a liquid of dielectric constant 32.\n\n(a) Determine the capacitance of the capacitor.\n\n(b) What is the potential of the inner sphere?\n\n(c) Compare the capacitance of this capacitor with that of an isolated sphere of radius 12 cm. Explain why the latter is much smaller.',
              '(a) $ C \\approx 5.5\\times10^{-9} $ F. (b) $ V \\approx 450 $ V. (c) About 416 times larger than the isolated sphere.',
              '(a) Using the spherical capacitor formula from Exercise 2.29 with a dielectric of constant $ K $ filling the gap, $ a = 0.12 $ m, $ b = 0.13 $ m:\n\n$ C = 4\\pi\\varepsilon_0 K\\cdot\\frac{ab}{b-a} = \\frac{K\\,ab}{k(b-a)} = \\frac{(32)(0.12)(0.13)}{(9\\times10^{9})(0.01)} $\n\n$ C = \\frac{32\\times0.0156}{9\\times10^{7}} = \\frac{0.4992}{9\\times10^{7}} \\approx 5.55\\times10^{-9}\\ \\text{F} $\n\n(b) $ V = \\frac{Q}{C} = \\frac{2.5\\times10^{-6}}{5.55\\times10^{-9}} \\approx 450\\ \\text{V} $\n\n(c) The isolated sphere of the same 12 cm radius, alone in air, has:\n\n$ C_{\\text{iso}} = 4\\pi\\varepsilon_0 a = \\frac{0.12}{9\\times10^{9}} \\approx 1.33\\times10^{-11}\\ \\text{F} $\n\n$ \\frac{C}{C_{\\text{iso}}} = \\frac{5.55\\times10^{-9}}{1.33\\times10^{-11}} \\approx 416 $\n\nThe enhancement splits cleanly into two independent factors, which multiply: $ b/(b-a) = 0.13/0.01 = 13 $ from the earthed outer sphere sitting very close to the inner one (a narrow 1 cm gap concentrates the same charge into a far smaller potential), and $ K = 32 $ from the dielectric liquid. Indeed $ 13\\times32 = 416 $, matching exactly. An isolated sphere has neither of these — no nearby earthed conductor to draw its field lines to, and no dielectric — so its capacitance is left tiny by comparison.',
              EXR, 'NCERT Ex 2.30'),
            num('ncert-2-32',
              'A cylindrical capacitor has two co-axial cylinders of length 15 cm and radii 1.5 cm and 1.4 cm. The outer cylinder is earthed and the inner cylinder is given a charge of 3.5 µC. Determine the capacitance of the system and the potential of the inner cylinder. Neglect end effects (i.e., bending of field lines at the ends).',
              '$ C \\approx 1.21\\times10^{-10} $ F (about 121 pF); $ V \\approx 2.89\\times10^{4} $ V.',
              'For a cylindrical capacitor of length $ L $, inner radius $ a $, outer radius $ b $, the same Gauss\'s-law-then-integrate method (using $ E = \\lambda/2\\pi\\varepsilon_0 r $ from Exercise 2.17) gives:\n\n$ C = \\frac{2\\pi\\varepsilon_0 L}{\\ln(b/a)} $\n\nHere $ a = 1.4 $ cm (inner), $ b = 1.5 $ cm (outer), $ L = 0.15 $ m:\n\n$ \\ln\\!\\left(\\frac{1.5}{1.4}\\right) = \\ln(1.0714) \\approx 0.0690 $\n\n$ C = \\frac{2\\pi(8.854\\times10^{-12})(0.15)}{0.0690} \\approx \\frac{8.345\\times10^{-12}}{0.0690} \\approx 1.21\\times10^{-10}\\ \\text{F} \\approx 121\\ \\text{pF} $\n\nThen:\n\n$ V = \\frac{Q}{C} = \\frac{3.5\\times10^{-6}}{1.21\\times10^{-10}} \\approx 2.89\\times10^{4}\\ \\text{V} $\n\nThe gap here (1 mm on a radius of about 15 mm) is even tighter, relatively, than the spherical capacitor above — which is exactly why cylindrical and spherical capacitors with very narrow gaps are the standard way to get a compact, high capacitance out of a small physical object.',
              EXR, 'NCERT Ex 2.32'),
            num('ncert-2-36',
              'A small sphere of radius r₁ and charge q₁ is enclosed by a spherical shell of radius r₂ and charge q₂. Show that if q₁ is positive, charge will necessarily flow from the sphere to the shell (when the two are connected by a wire) no matter what the charge q₂ on the shell is.',
              'The potential difference $ V_1 - V_2 = kq_1\\!\\left(\\frac{1}{r_1}-\\frac{1}{r_2}\\right) $ is always positive when $ q_1>0 $ — $ q_2 $ cancels out completely.',
              'Because the shell fully encloses the sphere, the potential at each surface has a contribution from *both* charges — treat each, in turn, as a point charge for anywhere on or inside the shell:\n\n$ V_1 = \\frac{kq_1}{r_1} + \\frac{kq_2}{r_2} $ (sphere\'s own charge at its own surface, plus the shell\'s charge, which behaves like a point charge at the centre for any point inside it)\n\n$ V_2 = \\frac{kq_1}{r_2} + \\frac{kq_2}{r_2} $ (the enclosed sphere\'s charge, seen from the shell\'s surface at distance $ r_2 $, plus the shell\'s own charge on itself)\n\nSubtract:\n\n$ V_1 - V_2 = kq_1\\left(\\frac{1}{r_1}-\\frac{1}{r_2}\\right) $\n\nThe $ q_2 $ terms have **cancelled completely** — the shell\'s own charge never appears in this difference. Since $ r_2 > r_1 $, the bracket $ (1/r_1 - 1/r_2) $ is always positive, and if $ q_1 > 0 $ then $ V_1 - V_2 > 0 $ always, whatever value $ q_2 $ happens to take — even a large negative one.\n\nConnected by a wire, charge always flows from higher to lower potential, so positive charge necessarily flows from the inner sphere to the shell, exactly as claimed.',
              EXR, 'NCERT Ex 2.36'),
          ],
        },
        // ── G · Energy and forces revisited ─────────────────────────────────
        {
          id: 'ncert-g-energy-forces',
          title: 'G · Energy and forces, revisited',
          blurb: 'Exercises 2.26, 2.27, 2.28. The energy-density picture of the field, and where the ½ in the force formula comes from.',
          items: [
            num('ncert-2-26',
              'The plates of a parallel plate capacitor have an area of 90 cm² each and are separated by 2.5 mm. The capacitor is charged by connecting it to a 400 V supply.\n\n(a) How much electrostatic energy is stored by the capacitor?\n\n(b) View this energy as stored in the electrostatic field between the plates, and obtain the energy per unit volume u. Hence arrive at a relation between u and the magnitude of electric field E between the plates.',
              '(a) $ U \\approx 2.55\\times10^{-6} $ J. (b) $ u \\approx 0.113 $ J/m³, and $ u = \\tfrac{1}{2}\\varepsilon_0 E^{2} $.',
              '(a) $ C = \\frac{\\varepsilon_0 A}{d} = \\frac{(8.854\\times10^{-12})(9\\times10^{-3})}{2.5\\times10^{-3}} \\approx 3.19\\times10^{-11}\\ \\text{F} $\n\n$ U = \\frac{1}{2}CV^{2} = \\frac{1}{2}(3.19\\times10^{-11})(400)^{2} \\approx 2.55\\times10^{-6}\\ \\text{J} $\n\n(b) The energy lives in the volume between the plates, $ \\text{vol} = Ad = (9\\times10^{-3})(2.5\\times10^{-3}) = 2.25\\times10^{-5}\\ \\text{m}^{3} $:\n\n$ u = \\frac{U}{Ad} = \\frac{2.55\\times10^{-6}}{2.25\\times10^{-5}} \\approx 0.113\\ \\text{J/m}^{3} $\n\nTo connect this with $ E $, write $ U = \\tfrac{1}{2}CV^{2} $ with $ C=\\varepsilon_0A/d $ and $ V = Ed $:\n\n$ U = \\frac{1}{2}\\cdot\\frac{\\varepsilon_0 A}{d}\\cdot(Ed)^{2} = \\frac{1}{2}\\varepsilon_0 E^{2}\\cdot(Ad) $\n\nDividing by the volume $ Ad $:\n\n$ u = \\frac{1}{2}\\varepsilon_0 E^{2} $\n\nCheck: $ E = V/d = 400/2.5\\times10^{-3} = 1.6\\times10^{5} $ V/m, so $ u = \\tfrac{1}{2}(8.854\\times10^{-12})(1.6\\times10^{5})^{2} \\approx 0.113 $ J/m³. ✓ This relation is not special to capacitors — it holds for the energy density of **any** electric field, anywhere.',
              EXR, 'NCERT Ex 2.26'),
            num('ncert-2-27',
              'A 4 µF capacitor is charged by a 200 V supply. It is then disconnected from the supply, and is connected to another uncharged 2 µF capacitor. How much electrostatic energy of the first capacitor is lost in the form of heat and electromagnetic radiation?',
              '$ \\Delta U \\approx 2.67\\times10^{-2} $ J.',
              '**Charge before connecting** (conserved once disconnected from the supply):\n\n$ Q = CV = (4\\times10^{-6})(200) = 8\\times10^{-4}\\ \\text{C} $\n\n$ U_i = \\frac{1}{2}CV^{2} = \\frac{1}{2}(4\\times10^{-6})(200)^{2} = 0.08\\ \\text{J} $\n\n**After connecting** to the uncharged 2 µF capacitor, total capacitance is $ 6\\ \\mu\\text{F} $, and $ Q $ redistributes at a common voltage:\n\n$ V_{\\text{common}} = \\frac{Q}{C_{\\text{total}}} = \\frac{8\\times10^{-4}}{6\\times10^{-6}} \\approx 133.3\\ \\text{V} $\n\n$ U_f = \\frac{1}{2}(6\\times10^{-6})(133.3)^{2} \\approx 0.0533\\ \\text{J} $\n\n$ \\Delta U = U_i - U_f = 0.08 - 0.0533 \\approx 2.67\\times10^{-2}\\ \\text{J} $\n\nThe same charge-conserved, energy-not-conserved pattern as Exercise 2.11 — here with unequal capacitances, so the loss is a smaller fraction of the total than in the equal-capacitor case, but it is never zero whenever charge redistributes suddenly between two different potentials.',
              EXR, 'NCERT Ex 2.27'),
            num('ncert-2-28',
              'Show that the force on each plate of a parallel plate capacitor has a magnitude equal to (½) QE, where Q is the charge on the capacitor, and E is the magnitude of electric field between the plates. Explain the origin of the factor ½.',
              '$ F = \\tfrac{1}{2}QE $ — the ½ appears because a plate cannot exert a net force on itself.',
              'The total field between the plates, $ E $, is produced by **both** plates together — each contributes half of it:\n\n$ E_{\\text{one plate}} = \\frac{E}{2} = \\frac{\\sigma}{2\\varepsilon_0} $\n\nThe force on one plate comes only from the field of the **other** plate — a plate cannot pull or push on its own charge, only on the charge it does not carry itself. So the force on, say, the positive plate is its own charge $ Q $ times the field due to the negative plate alone:\n\n$ F = Q \\times \\frac{E}{2} = \\frac{1}{2}QE $\n\n**Where the ½ comes from, restated plainly:** if you (incorrectly) used the *full* field $ E $ — the field a small test charge would actually feel in the gap — you would be including the plate\'s own field acting back on itself, which is not physical. Removing that self-interaction is exactly what halves the answer.\n\nAs a check via energy: with charge $ Q $ fixed, $ U = Q^{2}d/(2\\varepsilon_0A) $, and $ F = -dU/dd = Q^{2}/(2\\varepsilon_0A) $. Since $ E = Q/(\\varepsilon_0A) $ here, this is exactly $ F = \\tfrac{1}{2}QE $ again — the same ½, arrived at from an entirely different argument.',
              EXR, 'NCERT Ex 2.28'),
          ],
        },
        // ── H · Conceptual — answer carefully ───────────────────────────────
        {
          id: 'ncert-h-conceptual',
          title: 'H · Conceptual — answer carefully',
          blurb: 'Exercises 2.31, 2.34, 2.37. No calculation saves you here — only a clear picture of what each law actually says.',
          items: [
            num('ncert-2-31',
              'Answer carefully:\n\n(a) Two large conducting spheres carrying charges Q1 and Q2 are brought close to each other. Is the magnitude of electrostatic force between them exactly given by Q1Q2/4πε0r², where r is the distance between their centres?\n\n(b) If Coulomb\'s law involved 1/r³ dependence (instead of 1/r²), would Gauss\'s law be still true?\n\n(c) A small test charge is released at rest at a point in an electrostatic field configuration. Will it travel along the field line passing through that point?\n\n(d) What is the work done by the field of a nucleus in a complete circular orbit of the electron? What if the orbit is elliptical?\n\n(e) We know that electric field is discontinuous across the surface of a charged conductor. Is electric potential also discontinuous there?\n\n(f) What meaning would you give to the capacitance of a single conductor?\n\n(g) Guess a possible reason why water has a much greater dielectric constant (= 80) than say, mica (= 6).',
              '(a) No. (b) No. (c) Not in general. (d) Zero in both cases. (e) No, potential is continuous. (f) Capacitance relative to a reference at infinity. (g) Water molecules are permanently polar; mica is not.',
              '**(a) No.** The $ Q_1Q_2/4\\pi\\varepsilon_0r^{2} $ formula is exact only for **point** charges. Bringing two real conducting spheres close together **induces** a non-uniform redistribution of charge on each (each sphere\'s field polarises the other), so the charge is no longer spread as if concentrated at the centre. The point-charge formula is only a good approximation when the spheres are far apart compared with their radii.\n\n**(b) No.** Gauss\'s law — that the flux through *any* closed surface equals $ q_{\\text{enc}}/\\varepsilon_0 $, independent of the surface\'s size or shape — is a direct consequence of the force being inverse-**square**. That specific power is what makes a field line\'s density fall exactly in step with the growth of a sphere\'s surface area, keeping total flux constant with distance. A $ 1/r^{3} $ force would make the flux through a Gaussian surface depend on the surface\'s radius, and the simple law $ \\Phi = q_{\\text{enc}}/\\varepsilon_0 $ would fail.\n\n**(c) Not in general.** From rest, the charge\'s initial acceleration — and so its initial motion — is along the field direction at that point. But as it gains velocity and moves to where the field points a different way, nothing forces the *path* to keep bending exactly along the field line\'s curve; the two coincide only in special symmetric cases (a straight field line, or pure radial symmetry). In general the trajectory and the field line at that instant agree in direction only at the very first moment.\n\n**(d) Zero, in both cases.** The nuclear Coulomb force is central and conservative. After one complete orbit — circular or elliptical — the electron returns to its exact starting point, so $ \\Delta V = 0 $ and $ W = q\\Delta V = 0 $, regardless of the orbit\'s shape.\n\n**(e) No — potential is continuous.** Only the **normal component of the field** jumps across a charged surface (Exercise 2.16); the potential itself never has a discontinuity anywhere in electrostatics. A jump in potential would mean an infinite field at that point, which is unphysical for any finite surface charge density.\n\n**(f) The capacitance of a single, isolated conductor** is defined relative to a hypothetical "second plate" placed at infinity (or, equivalently, an earthed sphere of infinite radius). It is $ C = Q/V $, where $ V $ is the conductor\'s potential relative to a zero taken at infinity. For an isolated sphere of radius $ R $, this gives the familiar $ C = 4\\pi\\varepsilon_0 R $.\n\n**(g) Water molecules are permanently polar** — the bent H-O-H structure leaves an unequal charge distribution, giving each molecule a built-in dipole moment even with no external field. An applied field can strongly reorient these dipoles (orientation polarisation), producing a large net polarisation. Mica\'s molecules have no comparable permanent dipole; its (much smaller) dielectric response comes only from the field slightly distorting each molecule\'s own electron cloud (a weaker, induced effect). The much stronger orientation mechanism in water is why its dielectric constant is more than ten times mica\'s.',
              EXR, 'NCERT Ex 2.31'),
            num('ncert-2-34',
              'Describe schematically the equipotential surfaces corresponding to\n\n(a) a constant electric field in the z-direction,\n\n(b) a field that uniformly increases in magnitude but remains in a constant (say, z) direction,\n\n(c) a single positive charge at the origin, and\n\n(d) a uniform grid consisting of long equally spaced parallel charged wires in a plane.',
              '(a) Equally spaced planes ⊥ z. (b) Planes ⊥ z, spacing shrinking where the field is stronger. (c) Concentric spheres, spacing growing with r. (d) Circles around each wire close in; distant planes parallel to the grid.',
              '(a) **Uniform field along z.** Equipotentials must be perpendicular to $ \\vec{E} $ everywhere, so they are flat planes perpendicular to the z-axis — parallel to the xy-plane, stacked along z. Since the field magnitude is the same everywhere, equal steps in potential correspond to equal spacings: the planes are **evenly spaced**.\n\n(b) **Field along z, growing in magnitude.** Still planes perpendicular to the z-axis (the direction has not changed), but now the spacing for a fixed $ \\Delta V $ shrinks as the field strengthens, since $ \\Delta z \\approx \\Delta V/E $. The planes **crowd closer together** in the region of stronger field.\n\n(c) **Single positive point charge.** By spherical symmetry, equipotentials are **concentric spheres** centred on the charge. Since $ V \\propto 1/r $, a fixed step $ \\Delta V $ corresponds to a growing $ \\Delta r $ at large $ r $ — the spheres are **closely packed near the charge and spread apart with distance**.\n\n(d) **A grid of parallel charged wires in one plane.** Very close to any single wire, the local field looks just like that of an isolated long charged wire, so the equipotentials are small **circles encircling that wire**. Far from the whole grid — at distances much larger than the wire spacing — the individual wires blur together and the arrangement looks like one uniformly charged plane, so the equipotentials become **planes parallel to the grid**, spaced according to the plane\'s (roughly uniform) field.',
              EXR, 'NCERT Ex 2.34'),
            num('ncert-2-37',
              'Answer the following:\n\n(a) The top of the atmosphere is at about 400 kV with respect to the surface of the earth, corresponding to an electric field that decreases with altitude. Near the surface of the earth, the field is about 100 Vm⁻¹. Why then do we not get an electric shock as we step out of our house into the open? (Assume the house to be a steel cage so there is no field inside!)\n\n(b) A man fixes outside his house one evening a two metre high insulating slab carrying on its top a large aluminium sheet of area 1m². Will he get an electric shock if he touches the metal sheet next morning?\n\n(c) The discharging current in the atmosphere due to the small conductivity of air is known to be 1800 A on an average over the globe. Why then does the atmosphere not discharge itself completely in due course and become electrically neutral? In other words, what keeps the atmosphere charged?\n\n(d) What are the forms of energy into which the electrical energy of the atmosphere is dissipated during a lightning?',
              '(a) The body is a conductor, so it stays equipotential with the ground — there is no potential difference across it to discharge. (b) Yes, a mild shock — the insulated sheet charges up to the local atmospheric potential. (c) Continual thunderstorms worldwide recharge the earth, balancing the leakage current. (d) Light, heat and sound (plus a shock wave).',
              '**(a)** The human body is a **conductor**, and while standing on the ground it is electrically connected to the earth. A conductor in an external field redistributes its own charge until its entire surface (and the ground it touches) sits at one common potential — it does **not** develop a potential difference across itself the way an insulated rod would. With no potential difference between your head and your feet in practice, there is nothing to discharge through you, so no shock. (The steel-cage house is mentioned only to guarantee zero field *inside*, so that stepping "into the open" is the only relevant transition — but even in the open, being a conductor protects you.)\n\n**(b)** **Yes**, he would likely feel a mild shock. Unlike a person, the aluminium sheet sits on an **insulating** slab, so it is *not* electrically connected to the ground. Left overnight in the atmosphere\'s field, it gradually charges up until it reaches the local atmospheric potential at that height — roughly $ V \\approx E \\times h \\approx (100\\ \\text{V/m})(2\\ \\text{m}) = 200\\ \\text{V} $ relative to the ground. Touching it the next morning — with his body providing a path to ground — lets that stored charge discharge through him. The amount of charge and energy involved is tiny, so the shock would be mild, but it is real, and it is essentially a small-scale demonstration of the same principle behind a Van de Graaff generator.\n\n**(c)** The 1800 A leakage current is **continuously replenished**. At any given moment, on average around 1800 thunderstorms are active somewhere on the globe, and each one acts like a natural generator: lightning strikes pump negative charge down onto the earth and drive positive charge up into the atmosphere. This ongoing global process supplies charge at almost exactly the rate the fair-weather leakage current removes it, keeping the earth-atmosphere system in a steady, charged state rather than discharging away.\n\n**(d)** A lightning strike converts electrical energy into **light** (the visible flash), **heat** (the discharge channel briefly reaches temperatures far above the surface of the sun, heating the surrounding air violently), and **sound** (the explosive expansion of that superheated air is heard as thunder, carried outward partly as a shock wave). All three are the same discharge event; the abrupt, enormous current simply has to go somewhere, and it goes into light, heat and mechanical disturbance of the air.',
              EXR, 'NCERT Ex 2.37'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That closes the NCERT exercise set for this chapter — 35 of its 37 problems, worked from Gauss\'s law and the definition of potential every time, with nothing more exotic than what the chapter itself built.\n\nCharge has been sitting still for two whole chapters. Next: what happens when we stop letting it settle.',
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p18, p19]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
