'use strict';
/**
 * Class 12 Physics · Ch.1 "Electrostatics" — pages 19–20, NCERT Exercises.
 *
 * Every exercise from the end of the NCERT chapter "Electric Charges and
 * Fields", transcribed verbatim (Rule 0) from the source PDF text and worked
 * from first principles. Two exercises are figure-dependent and are skipped
 * (see the callout on page 19): 1.14 (particle-track image, Fig 1.33) and
 * 1.26 (field-line curve images, Fig 1.35).
 *
 * Source badge: every item here is source 'ncert_exercise' — these are the
 * genuine end-of-chapter NCERT exercises, not adapted third-party content.
 *
 * Run: node scripts/physics12-book/build_ch1_f_ncert_exercises.js
 */
const { b, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 1;
const SRC = 'ncert_exercise';

// ── p19 · NCERT Exercises (I) ────────────────────────────────────────────────
const p19 = {
  page_number: 19,
  slug: 'ncert-exercises-i',
  title: 'Practice — NCERT Exercises (I)',
  subtitle: 'Charge, Coulomb\'s law, the field, and the dipole — worked in full',
  page_type: 'lesson',
  blocks: [
    b('text', 0, {
      markdown: 'These are the exercises printed at the end of the NCERT chapter, word for word. Work each one on paper before you open the solution — the minute you spend stuck is where the method actually gets learned, not the minute you spend reading someone else\'s answer.\n\nThey are grouped by theme rather than by number, so related ideas sit together. This page covers charge, Coulomb\'s law, the field, and the dipole. The next page finishes the chapter with flux, Gauss\'s law, conductors, and the additional exercises.',
    }),
    b('callout', 1, {
      variant: 'note',
      title: 'Two exercises are skipped',
      markdown: 'NCERT Exercises **1.14** and **1.26** each depend on a printed figure — 1.14 on a particle-track image, 1.26 on a set of field-line curves you are asked to judge as valid or invalid. Without the actual image there is nothing reliable to transcribe, so both are left out rather than guessed at.\n\nEverything else in the chapter — all 32 remaining exercises — is worked in full across this page and the next.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises 1.1 – 1.13',
      intro: 'Thirteen exercises across four themes. Answers are worked in full, in the same voice as the chapter.',
      sections: [
        // ── A · Charge, Coulomb's law and superposition ──────────────────────
        {
          id: 'ncert-a-charge-coulomb',
          title: "A · Charge, Coulomb's law and superposition",
          blurb: 'Exercises 1.1 – 1.6.',
          items: [
            num('ncert-1-1', 'What is the force between two small charged spheres having charges of $ 2 \\times 10^{-7} $ C and $ 3 \\times 10^{-7} $ C placed 30 cm apart in air?',
              '$ 6 \\times 10^{-3} $ N, repulsive.',
              'Both charges are positive, so the force is repulsive. Coulomb\'s law:\n\n$ F = \\frac{kq_1q_2}{r^{2}} = \\frac{(9\\times10^{9})(2\\times10^{-7})(3\\times10^{-7})}{(0.30)^{2}} $\n\n$ = \\frac{(9\\times10^{9})(6\\times10^{-14})}{0.09} = \\frac{5.4\\times10^{-4}}{0.09} = 6\\times10^{-3}\\ \\text{N} $\n\nTwo charges each a few tenths of a microcoulomb, thirty centimetres apart, push on each other with a force of six thousandths of a newton — about the weight of a small paperclip. Coulomb\'s law and Newton\'s law of gravitation have the identical $ 1/r^{2} $ shape; only the constant out front and the "masses" being multiplied are different.',
              SRC, 'NCERT Ex 1.1'),
            num('ncert-1-2', 'The electrostatic force on a small sphere of charge 0.4 μC due to another small sphere of charge $ -0.8 $ μC in air is 0.2 N. (a) What is the distance between the two spheres? (b) What is the force on the second sphere due to the first?',
              '(a) 0.12 m  (b) 0.2 N, equal and opposite to the force on the first sphere.',
              '**(a)** Rearrange Coulomb\'s law for $ r $:\n\n$ r = \\sqrt{\\frac{kq_1q_2}{F}} = \\sqrt{\\frac{(9\\times10^{9})(0.4\\times10^{-6})(0.8\\times10^{-6})}{0.2}} $\n\n$ = \\sqrt{\\frac{2.88\\times10^{-3}}{0.2}} = \\sqrt{0.0144} = 0.12\\ \\text{m} $\n\n**(b)** Newton\'s third law applies to electrostatic forces exactly as it does to contact forces — the force one charge exerts on the other has a partner of identical magnitude, directed the other way. It is still 0.2 N, and since the charges are unlike it is attractive: the second sphere is pulled toward the first.',
              SRC, 'NCERT Ex 1.2'),
            num('ncert-1-3', 'Check that the ratio $ \\frac{ke^{2}}{Gm_em_p} $ is dimensionless. Look up a table of physical constants and determine the value of this ratio. What does the ratio signify? (Here $ k = 1/4\\pi\\varepsilon_0 $, $ e $ = electronic charge, $ G $ = gravitational constant, $ m_e $ = mass of electron, $ m_p $ = mass of proton.)',
              '$ \\approx 2.3 \\times 10^{39} $ — the ratio of the electric to the gravitational force between a proton and an electron, at any separation.',
              '**Dimensions.** $ ke^{2} $ has the dimensions of (force)(distance)² — it is the numerator of Coulomb\'s law with the $ 1/r^{2} $ stripped out. $ Gm_em_p $ has the same dimensions — the numerator of Newton\'s law of gravitation. Dividing one by the other, the dimensions cancel completely, so the ratio is a pure number.\n\n**Value**, using $ k = 9\\times10^{9} $, $ e = 1.6\\times10^{-19} $ C, $ G = 6.67\\times10^{-11} $, $ m_e = 9.11\\times10^{-31} $ kg, $ m_p = 1.67\\times10^{-27} $ kg:\n\n$ \\frac{ke^{2}}{Gm_em_p} = \\frac{(9\\times10^{9})(1.6\\times10^{-19})^{2}}{(6.67\\times10^{-11})(9.11\\times10^{-31})(1.67\\times10^{-27})} = \\frac{2.30\\times10^{-28}}{1.01\\times10^{-67}} \\approx 2.3\\times10^{39} $\n\n**What it signifies.** Since both forces go as $ 1/r^{2} $, the separation cancels out of the ratio entirely — this number is the ratio $ F_{\\text{electric}}/F_{\\text{gravity}} $ between an electron and a proton at *any* distance apart. The electric force wins by 39 orders of magnitude, which is exactly why gravity plays no role in atomic physics.',
              SRC, 'NCERT Ex 1.3'),
            num('ncert-1-4', '(a) Explain the meaning of the statement \'electric charge of a body is quantised\'.\n\n(b) Why can one ignore quantisation of electric charge when dealing with macroscopic i.e., large scale charges?',
              '(a) Charge only ever comes in whole-number multiples of $ e $. (b) Because macroscopic charges involve billions of electrons, so the "step size" $ e $ is too fine to notice.',
              '**(a)** Charge is not a continuously adjustable quantity. Any charge $ q $ that exists in nature is an integer multiple of the elementary charge: $ q = ne $, where $ n $ is a whole number (positive, negative, or zero) and $ e = 1.6\\times10^{-19} $ C. You can never isolate half an electron\'s worth of charge.\n\n**(b)** A typical charge you produce in a lab — a microcoulomb, say — corresponds to $ n = q/e \\approx 6\\times10^{12} $ electrons. Going from $ n $ to $ n\\pm1 $ changes the charge by one part in six trillion, which is far below anything you could ever measure. At that scale charge behaves, for all practical purposes, as if it were continuous — the same way a beach looks like smooth sand even though it is made of discrete grains.',
              SRC, 'NCERT Ex 1.4'),
            num('ncert-1-5', 'When a glass rod is rubbed with a silk cloth, charges appear on both. A similar phenomenon is observed with many other pairs of bodies. Explain how this observation is consistent with the law of conservation of charge.',
              'Rubbing transfers electrons from one body to the other — it creates no charge, so the two bodies end up with equal and opposite charges.',
              'Before rubbing, both the glass rod and the silk cloth are electrically neutral: each contains equal amounts of positive and negative charge. Rubbing does not manufacture any new charge — it simply provides the friction needed to strip some electrons off the glass and deposit them onto the silk (glass loses electrons and becomes positive; silk gains them and becomes negative).\n\nSince nothing was created, the amount of negative charge that appeared on the silk is exactly equal to the amount of positive charge left behind on the glass. The **total** charge of the glass-plus-silk system is still zero, before and after — which is precisely what conservation of charge requires. Every instance of "charging by rubbing" is a transfer, never a creation.',
              SRC, 'NCERT Ex 1.5'),
            num('ncert-1-6', 'Four point charges $ q_A = 2 $ μC, $ q_B = -5 $ μC, $ q_C = 2 $ μC, and $ q_D = -5 $ μC are located at the corners of a square ABCD of side 10 cm. What is the force on a charge of 1 μC placed at the centre of the square?',
              'Zero.',
              'Look at the diagonals rather than the four corners individually. $ A $ and $ C $ are opposite corners carrying the *same* charge ($ +2 $ μC each), and both are the same distance from the centre — so the force each exerts on the centre charge is equal in magnitude and exactly opposite in direction, and they cancel.\n\nThe same argument applies to $ B $ and $ D $, which are opposite corners both carrying $ -5 $ μC.\n\nWith both diagonal pairs cancelling independently, the net force on the 1 μC charge at the centre is zero — and this is true regardless of what charge you place there, since it never enters the argument.',
              SRC, 'NCERT Ex 1.6'),
          ],
        },
        // ── B · The field of a point and a system of charges ────────────────
        {
          id: 'ncert-b-field',
          title: 'B · The field of a point charge and a system of charges',
          blurb: 'Exercises 1.7 – 1.8.',
          items: [
            num('ncert-1-7', '(a) An electrostatic field line is a continuous curve. That is, a field line cannot have sudden breaks. Why not?\n\n(b) Explain why two field lines never cross each other at any point?',
              '(a) A break would mean the field vanishes there without a charge to cause it. (b) A crossing point would give the field two different directions at once.',
              '**(a)** A field line traces the direction a positive test charge would be pushed, moment to moment, if released at rest at successive points. The only way a field can genuinely stop existing at a point is if there is no charge anywhere to produce it there — and away from a charge, the field varies smoothly, never switching off abruptly. A sudden break would mean the field disappears with nothing to explain why, which is unphysical (the one place a field line does end or begin is *at* a charge itself).\n\n**(b)** At any given point in space, the electric field has one magnitude and one direction — it is the vector sum of the contributions from every charge in the universe, and that sum is a single, definite vector. If two field lines crossed, the tangent to the field at that crossing point would have to point in two different directions simultaneously, which is a contradiction. So field lines can converge only at a charge (where the field direction is genuinely undefined), never at an ordinary point in space.',
              SRC, 'NCERT Ex 1.7'),
            num('ncert-1-8', 'Two point charges $ q_A = 3 $ μC and $ q_B = -3 $ μC are located 20 cm apart in vacuum.\n\n(a) What is the electric field at the midpoint $ O $ of the line AB joining the two charges?\n\n(b) If a negative test charge of magnitude $ 1.5 \\times 10^{-9} $ C is placed at this point, what is the force experienced by the test charge?',
              '(a) $ 5.4 \\times 10^{6} $ N/C, directed from $ A $ to $ B $. (b) $ 8.1 \\times 10^{-3} $ N, directed from $ B $ to $ A $.',
              '**(a)** $ O $ is 10 cm ($ 0.1 $ m) from each charge. The field due to $ q_A $ (positive) points *away* from $ A $, i.e. from $ A $ toward $ B $. The field due to $ q_B $ (negative) points *toward* $ B $ — which, from $ O $, is also the direction from $ A $ to $ B $. So the two fields point the same way and add:\n\n$ E = 2\\left(\\frac{kq}{r^{2}}\\right) = 2 \\times \\frac{(9\\times10^{9})(3\\times10^{-6})}{(0.1)^{2}} = 2 \\times 2.7\\times10^{6} = 5.4\\times10^{6}\\ \\text{N/C} $\n\ndirected from $ A $ toward $ B $.\n\n**(b)** $ F = qE = (1.5\\times10^{-9})(5.4\\times10^{6}) = 8.1\\times10^{-3}\\ \\text{N} $. The test charge is negative, so the force is opposite to $ \\vec{E} $ — directed from $ B $ back toward $ A $.',
              SRC, 'NCERT Ex 1.8'),
          ],
        },
        // ── C · The electric dipole ──────────────────────────────────────────
        {
          id: 'ncert-c-dipole',
          title: 'C · The electric dipole',
          blurb: 'Exercises 1.9 – 1.10.',
          items: [
            num('ncert-1-9', 'A system has two charges $ q_A = 2.5 \\times 10^{-7} $ C and $ q_B = -2.5 \\times 10^{-7} $ C located at points $ A: (0, 0, -15\\ \\text{cm}) $ and $ B: (0, 0, +15\\ \\text{cm}) $, respectively. What are the total charge and electric dipole moment of the system?',
              'Total charge zero; dipole moment $ 7.5 \\times 10^{-8} $ C·m, directed along the negative $ z $-axis.',
              '**Total charge.** $ q_A + q_B = 2.5\\times10^{-7} + (-2.5\\times10^{-7}) = 0 $ — the system is a dipole, not a net-charged object.\n\n**Dipole moment.** The separation is $ d = 15 + 15 = 30 $ cm $ = 0.30 $ m, so\n\n$ p = qd = (2.5\\times10^{-7})(0.30) = 7.5\\times10^{-8}\\ \\text{C·m} $\n\n**Direction.** By convention $ \\vec{p} $ points from the negative charge to the positive charge. The negative charge $ q_B $ sits at $ z = +15 $ cm and the positive charge $ q_A $ sits at $ z = -15 $ cm, so the arrow from $ B $ to $ A $ points along the **negative** $ z $-axis.',
              SRC, 'NCERT Ex 1.9'),
            num('ncert-1-10', 'An electric dipole with dipole moment $ 4 \\times 10^{-9} $ C·m is aligned at $ 30^\\circ $ with the direction of a uniform electric field of magnitude $ 5 \\times 10^{4} $ NC$ ^{-1} $. Calculate the magnitude of the torque acting on the dipole.',
              '$ 1 \\times 10^{-4} $ N·m.',
              '$ \\tau = pE\\sin\\theta = (4\\times10^{-9})(5\\times10^{4})\\sin30^\\circ $\n\n$ = (2\\times10^{-4})(0.5) = 1\\times10^{-4}\\ \\text{N·m} $\n\nThis torque tries to rotate the dipole so that $ \\vec{p} $ swings into line with $ \\vec{E} $ — the orientation of lowest potential energy.',
              SRC, 'NCERT Ex 1.10'),
          ],
        },
        // ── D · Sharing and transferring charge ──────────────────────────────
        {
          id: 'ncert-d-sharing',
          title: 'D · Sharing and transferring charge',
          blurb: 'Exercises 1.11 – 1.13.',
          items: [
            num('ncert-1-11', 'A polythene piece rubbed with wool is found to have a negative charge of $ 3 \\times 10^{-7} $ C.\n\n(a) Estimate the number of electrons transferred (from which to which?)\n\n(b) Is there a transfer of mass from wool to polythene?',
              '(a) About $ 1.875 \\times 10^{12} $ electrons, transferred from wool to polythene. (b) Yes, an utterly negligible amount ($ \\approx 1.7 \\times 10^{-18} $ kg).',
              '**(a)** The polythene ends up negative, so it **gained** electrons — they came from the wool.\n\n$ n = \\frac{q}{e} = \\frac{3\\times10^{-7}}{1.6\\times10^{-19}} = 1.875\\times10^{12} $\n\n**(b)** Every electron carries its own mass along with it, so yes — mass genuinely moves from wool to polythene:\n\n$ \\Delta m = nm_e = (1.875\\times10^{12})(9.11\\times10^{-31}) \\approx 1.7\\times10^{-18}\\ \\text{kg} $\n\nThat is about $ 10^{15} $ times smaller than the mass of a bacterium — real, but utterly unmeasurable on any scale.',
              SRC, 'NCERT Ex 1.11'),
            num('ncert-1-12', '(a) Two insulated charged copper spheres A and B have their centres separated by a distance of 50 cm. What is the mutual force of electrostatic repulsion if the charge on each is $ 6.5 \\times 10^{-7} $ C? The radii of A and B are negligible compared to the distance of separation.\n\n(b) What is the force of repulsion if each sphere is charged double the above amount, and the distance between them is halved?',
              '(a) $ \\approx 1.5 \\times 10^{-2} $ N.  (b) $ \\approx 0.24 $ N — sixteen times the original force.',
              '**(a)** With the radii negligible, treat each sphere as a point charge:\n\n$ F = \\frac{kq^{2}}{r^{2}} = \\frac{(9\\times10^{9})(6.5\\times10^{-7})^{2}}{(0.5)^{2}} = \\frac{(9\\times10^{9})(4.225\\times10^{-13})}{0.25} \\approx 1.52\\times10^{-2}\\ \\text{N} $\n\n**(b)** Doubling each charge multiplies the force by $ 2\\times2 = 4 $. Halving the distance multiplies it by another $ 2^{2} = 4 $ (since $ F\\propto 1/r^{2} $). Together that is $ 4\\times4 = 16 $ times the original force:\n\n$ F\' = 16 \\times 1.52\\times10^{-2} \\approx 0.243\\ \\text{N} $\n\nNotice you never had to recompute from scratch — tracking how each change scales the force is faster and less error-prone.',
              SRC, 'NCERT Ex 1.12'),
            num('ncert-1-13', 'Suppose the spheres A and B in Exercise 1.12 have identical sizes. A third sphere of the same size but uncharged is brought in contact with the first, then brought in contact with the second, and finally removed from both. What is the new force of repulsion between A and B?',
              'About $ 5.7 \\times 10^{-3} $ N.',
              'Track the charge step by step. Both A and B start at $ 6.5\\times10^{-7} $ C; C starts neutral.\n\n**C touches A.** Two identical spheres in contact share their total charge equally. A had $ 6.5\\times10^{-7} $ C, C had 0, so each ends up with\n\n$ \\frac{6.5\\times10^{-7}}{2} = 3.25\\times10^{-7}\\ \\text{C} $\n\nA is now at $ 3.25\\times10^{-7} $ C; C carries $ 3.25\\times10^{-7} $ C.\n\n**C then touches B.** B still has its original $ 6.5\\times10^{-7} $ C. C brings $ 3.25\\times10^{-7} $ C. Shared equally:\n\n$ \\frac{3.25\\times10^{-7} + 6.5\\times10^{-7}}{2} = \\frac{9.75\\times10^{-7}}{2} = 4.875\\times10^{-7}\\ \\text{C} $\n\nB ends at $ 4.875\\times10^{-7} $ C (and so does C, but C is now removed and no longer matters).\n\n**New force between A and B**, still 50 cm apart:\n\n$ F = \\frac{k\\,q_A q_B}{r^{2}} = \\frac{(9\\times10^{9})(3.25\\times10^{-7})(4.875\\times10^{-7})}{(0.5)^{2}} \\approx 5.7\\times10^{-3}\\ \\text{N} $\n\nA useful sanity check: this had to come out **less** than the original $ 1.5\\times10^{-2} $ N, since A ended up with less charge than it started with — and it does.',
              SRC, 'NCERT Ex 1.13'),
          ],
        },
      ],
    }),
    b('text', 3, {
      markdown: 'That covers charge, Coulomb\'s law, the field and the dipole. The next page finishes the chapter — flux, Gauss\'s law, conductors, and the harder additional exercises.',
    }),
  ],
};

// ── p20 · NCERT Exercises (II) ───────────────────────────────────────────────
const p20 = {
  page_number: 20,
  slug: 'ncert-exercises-ii',
  title: 'Practice — NCERT Exercises (II)',
  subtitle: 'Flux, Gauss\'s law, conductors, and the additional exercises',
  page_type: 'lesson',
  blocks: [
    b('text', 0, {
      markdown: 'The rest of the chapter\'s exercises — flux and Gauss\'s law, what a conductor does to a field, and the harder additional exercises NCERT sets at the end. Same rule as before: attempt on paper first, then check.',
    }),
    b('practice_bank', 1, {
      title: 'NCERT Exercises 1.15 – 1.34',
      intro: 'Nineteen exercises across four themes, closing out the chapter.',
      sections: [
        // ── D · Flux and Gauss's law ──────────────────────────────────────────
        {
          id: 'ncert-d-flux-gauss',
          title: "D · Flux and Gauss's law",
          blurb: 'Exercises 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.23. Most of these need no integration at all — only the enclosed charge and a fraction.',
          items: [
            num('ncert-1-15', 'Consider a uniform electric field $ \\vec{E} = 3\\times10^{3}\\,\\hat{i} $ N/C. (a) What is the flux of this field through a square of 10 cm on a side whose plane is parallel to the $ yz $ plane? (b) What is the flux through the same square if the normal to its plane makes a $ 60^\\circ $ angle with the $ x $-axis?',
              '(a) 30 N·m²/C.  (b) 15 N·m²/C.',
              '**(a)** A square parallel to the $ yz $ plane has its normal along $ \\hat{i} $ — exactly parallel to $ \\vec{E} $. Area $ A = (0.10)^{2} = 0.01\\ \\text{m}^{2} $.\n\n$ \\Phi = EA\\cos0^\\circ = (3\\times10^{3})(0.01) = 30\\ \\text{N·m}^{2}/\\text{C} $\n\n**(b)** Tilting the square so its normal makes $ 60^\\circ $ with $ \\vec{E} $ scales the flux by $ \\cos60^\\circ = 0.5 $:\n\n$ \\Phi = EA\\cos60^\\circ = 30 \\times 0.5 = 15\\ \\text{N·m}^{2}/\\text{C} $\n\nOnly the component of area "facing" the field counts — this is the same idea as shadow area.',
              SRC, 'NCERT Ex 1.15'),
            num('ncert-1-16', 'What is the net flux of the uniform electric field of Exercise 1.15 through a cube of side 20 cm oriented so that its faces are parallel to the coordinate planes?',
              'Zero.',
              'A closed surface sitting in a **uniform** field with no charge inside always has zero net flux — every field line that enters one face exits through another, so the ins and outs cancel exactly, whatever the field\'s strength or the cube\'s size.\n\nConcretely here: the field only has an $ x $-component, so it produces flux only through the two faces perpendicular to $ x $. It enters the face at smaller $ x $ and leaves through the face at larger $ x $ with the identical magnitude (the field does not change from one face to the other, since it is uniform) — so those two contributions cancel, and the other four faces (parallel to $ \\vec{E} $) carry no flux at all.',
              SRC, 'NCERT Ex 1.16'),
            num('ncert-1-17', 'Careful measurement of the electric field at the surface of a black box indicates that the net outward flux through the surface of the box is $ 8.0 \\times 10^{3} $ Nm²/C. (a) What is the net charge inside the box? (b) If the net outward flux through the surface of the box were zero, could you conclude that there were no charges inside the box? Why or why not?',
              '(a) $ \\approx 7.1 \\times 10^{-8} $ C, positive.  (b) No — zero net flux only means the *total* enclosed charge is zero; there could be equal amounts of positive and negative charge inside, or none at all.',
              '**(a)** Gauss\'s law: $ \\Phi = q_{\\text{in}}/\\varepsilon_0 $, so\n\n$ q_{\\text{in}} = \\Phi\\varepsilon_0 = (8.0\\times10^{3})(8.854\\times10^{-12}) \\approx 7.1\\times10^{-8}\\ \\text{C} $\n\nThe flux is outward (positive), so the enclosed charge is positive.\n\n**(b)** Gauss\'s law relates flux only to the **net** charge inside — it cannot distinguish "nothing in there" from "equal amounts of $ +q $ and $ -q $ in there." Both give zero net enclosed charge and hence zero net flux. The field on the surface itself might still be non-zero at individual points (just as the dipole case on this page will show); it is only the *total* flux that vanishes.',
              SRC, 'NCERT Ex 1.17'),
            num('ncert-1-18', 'A point charge $ +10 $ μC is a distance 5 cm directly above the centre of a square of side 10 cm. What is the magnitude of the electric flux through the square? (Hint: Think of the square as one face of a cube with edge 10 cm.)',
              '$ \\approx 1.9 \\times 10^{5} $ N·m²/C.',
              'The charge sits 5 cm above the centre of the square — exactly half of 10 cm — so the square is one face of a cube of edge 10 cm with the charge sitting at the cube\'s **centre**.\n\nTotal flux out of the whole (imaginary) cube: $ \\Phi_{\\text{cube}} = \\frac{q}{\\varepsilon_0} = \\frac{10\\times10^{-6}}{8.854\\times10^{-12}} \\approx 1.13\\times10^{6}\\ \\text{N·m}^{2}/\\text{C} $.\n\nBy the cube\'s symmetry, this splits equally across its 6 identical faces, so the flux through *one* face — our square —\n\n$ \\Phi_{\\text{square}} = \\frac{1.13\\times10^{6}}{6} \\approx 1.9\\times10^{5}\\ \\text{N·m}^{2}/\\text{C} $',
              SRC, 'NCERT Ex 1.18'),
            num('ncert-1-19', 'A point charge of 2.0 μC is at the centre of a cubic Gaussian surface 9.0 cm on edge. What is the net electric flux through the surface?',
              '$ \\approx 2.26 \\times 10^{5} $ N·m²/C.',
              'Gauss\'s law cares only about the enclosed charge — not the shape or size of the surface — so the 9.0 cm edge length is a distraction, not an input to the calculation:\n\n$ \\Phi = \\frac{q}{\\varepsilon_0} = \\frac{2.0\\times10^{-6}}{8.854\\times10^{-12}} \\approx 2.26\\times10^{5}\\ \\text{N·m}^{2}/\\text{C} $\n\nThe same charge inside a Gaussian sphere of any radius, or any other closed shape, would give exactly this same total flux.',
              SRC, 'NCERT Ex 1.19'),
            num('ncert-1-20', 'A point charge causes an electric flux of $ -1.0\\times10^{3} $ Nm²/C to pass through a spherical Gaussian surface of 10.0 cm radius centred on the charge. (a) If the radius of the Gaussian surface were doubled, how much flux would pass through the surface? (b) What is the value of the point charge?',
              '(a) Still $ -1.0 \\times 10^{3} $ N·m²/C, unchanged.  (b) $ \\approx -8.85 \\times 10^{-9} $ C.',
              '**(a)** Flux depends only on the enclosed charge, not the radius of the Gaussian sphere. Since the same single charge sits at the centre either way, doubling the radius changes nothing about the flux: still $ -1.0\\times10^{3} $ N·m²/C.\n\n**(b)** $ q = \\Phi\\varepsilon_0 = (-1.0\\times10^{3})(8.854\\times10^{-12}) \\approx -8.85\\times10^{-9}\\ \\text{C} $. The flux is negative (inward), which is consistent with a negative charge.',
              SRC, 'NCERT Ex 1.20'),
            num('ncert-1-23', 'An infinite line charge produces a field of $ 9 \\times 10^{4} $ N/C at a distance of 2 cm. Calculate the linear charge density.',
              '$ \\lambda \\approx 1.0 \\times 10^{-7} $ C/m.',
              'A Gaussian cylinder around the line gives $ E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $, equivalently $ E = \\frac{2k\\lambda}{r} $. Solve for $ \\lambda $:\n\n$ \\lambda = \\frac{Er}{2k} = \\frac{(9\\times10^{4})(0.02)}{2(9\\times10^{9})} = \\frac{1800}{1.8\\times10^{10}} = 1.0\\times10^{-7}\\ \\text{C/m} $\n\nUnlike a point charge (where $ E\\propto1/r^{2} $), a line of charge gives a field that falls off only as $ 1/r $ — spreading the source along a line changes the geometry, and with it the power of $ r $.',
              SRC, 'NCERT Ex 1.23'),
          ],
        },
        // ── E · Conductors ─────────────────────────────────────────────────
        {
          id: 'ncert-e-conductors',
          title: 'E · Conductors',
          blurb: 'Exercises 1.21, 1.22, 1.24, 1.28, 1.29. Every one of these traces back to a single fact: the field inside the metal is zero.',
          items: [
            num('ncert-1-21', 'A conducting sphere of radius 10 cm has an unknown charge. If the electric field 20 cm from the centre of the sphere is $ 1.5 \\times 10^{3} $ N/C and points radially inward, what is the net charge on the sphere?',
              '$ \\approx -6.67 \\times 10^{-9} $ C.',
              'Outside a charged conducting sphere the field is identical to that of a point charge $ q $ sitting at the centre: $ E = kq/r^{2} $. Solve for the magnitude of $ q $ at $ r = 0.20 $ m:\n\n$ |q| = \\frac{Er^{2}}{k} = \\frac{(1.5\\times10^{3})(0.20)^{2}}{9\\times10^{9}} = \\frac{60}{9\\times10^{9}} \\approx 6.67\\times10^{-9}\\ \\text{C} $\n\nThe field points **inward**, toward the sphere — which only happens if the charge producing it is negative. So $ q \\approx -6.67\\times10^{-9} $ C.',
              SRC, 'NCERT Ex 1.21'),
            num('ncert-1-22', 'A uniformly charged conducting sphere of 2.4 m diameter has a surface charge density of 80.0 μC/m². (a) Find the charge on the sphere. (b) What is the total electric flux leaving the surface of the sphere?',
              '(a) $ \\approx 1.45 \\times 10^{-3} $ C.  (b) $ \\approx 1.6 \\times 10^{8} $ N·m²/C.',
              '**(a)** Radius $ = 1.2 $ m. Charge is surface density times the sphere\'s surface area:\n\n$ Q = \\sigma \\times 4\\pi r^{2} = (80\\times10^{-6})(4\\pi)(1.2)^{2} \\approx (80\\times10^{-6})(18.10) \\approx 1.45\\times10^{-3}\\ \\text{C} $\n\n**(b)** By Gauss\'s law, the total flux out of any surface enclosing this charge — including the sphere\'s own surface — is\n\n$ \\Phi = \\frac{Q}{\\varepsilon_0} = \\frac{1.45\\times10^{-3}}{8.854\\times10^{-12}} \\approx 1.6\\times10^{8}\\ \\text{N·m}^{2}/\\text{C} $',
              SRC, 'NCERT Ex 1.22'),
            num('ncert-1-24', 'Two large, thin metal plates are parallel and close to each other. On their inner faces, the plates have surface charge densities of opposite signs and of magnitude $ 17.0 \\times 10^{-22} $ C/m². What is $ E $: (a) in the outer region of the first plate, (b) in the outer region of the second plate, and (c) between the plates?',
              '(a) Zero.  (b) Zero.  (c) $ \\approx 1.92 \\times 10^{-10} $ N/C, directed from the positive plate to the negative plate.',
              'Each plate acts like an infinite sheet, producing a field of magnitude $ \\sigma/2\\varepsilon_0 $ on either side of it, pointing away from a positive sheet and toward a negative one.\n\n**Outside both plates** (regions (a) and (b)): the field from the positive plate points outward (away from the pair) and the field from the negative plate points inward (toward the pair, i.e. back toward the positive plate) — equal magnitudes, opposite directions. They cancel exactly, so $ E = 0 $ in both outer regions.\n\n**Between the plates** (region (c)): now both fields point the *same* way — from the positive plate toward the negative one — so they add:\n\n$ E = \\frac{\\sigma}{2\\varepsilon_0} + \\frac{\\sigma}{2\\varepsilon_0} = \\frac{\\sigma}{\\varepsilon_0} = \\frac{17.0\\times10^{-22}}{8.854\\times10^{-12}} \\approx 1.92\\times10^{-10}\\ \\text{N/C} $\n\nThis is the working principle of a parallel-plate capacitor: field cancels outside, adds inside. The number is absurdly small here only because the problem\'s $ \\sigma $ is chosen at an atomic scale, not a realistic capacitor value.',
              SRC, 'NCERT Ex 1.24'),
            num('ncert-1-28', '(a) A conductor A with a cavity is given a charge $ Q $. Show that the entire charge must appear on the outer surface of the conductor.\n\n(b) Another conductor B with charge $ q $ is inserted into the cavity keeping B insulated from A. Show that the total charge on the outside surface of A is $ Q + q $.\n\n(c) A sensitive instrument is to be shielded from the strong electrostatic fields in its environment. Suggest a possible way.',
              '(a) Zero charge on the inner (cavity) wall forces all of $ Q $ onto the outer surface. (b) The inner wall carries $ -q $, so the outer surface carries $ Q+q $. (c) Enclose the instrument inside a hollow conducting shell (a Faraday cage).',
              '**(a)** Draw a Gaussian surface entirely inside the bulk of conductor A, wrapping around the cavity. Since A is in electrostatic equilibrium, $ \\vec{E} = 0 $ everywhere inside the conducting material, so the flux through this Gaussian surface is zero — meaning the charge it encloses (the cavity plus the cavity\'s inner wall) is zero. With nothing in the empty cavity, the inner wall itself must carry zero charge. Since charge in a conductor can only live on a surface, and the inner surface carries none, the entire charge $ Q $ has to sit on the **outer** surface.\n\n**(b)** Repeat the same Gaussian surface, now with conductor B (carrying $ +q $) sitting inside the cavity. Still $ \\vec{E}=0 $ inside A\'s material, so the enclosed charge must still be zero: (charge on inner wall) $ + q = 0 $, giving the inner wall a charge of $ -q $. Since A\'s total charge is fixed at $ Q $, and $ -q $ of it sits on the inner wall, the outer surface must carry the remainder: $ Q - (-q) = Q + q $.\n\n**(c)** Enclose the instrument inside a hollow conducting shell — a Faraday cage. Whatever charge distribution exists outside, the field inside the cavity of a conductor in equilibrium is always zero, so the instrument sits in a field-free region regardless of how strong or how it is varying the field is outside.',
              SRC, 'NCERT Ex 1.28'),
            num('ncert-1-29', 'A hollow charged conductor has a tiny hole cut into its surface. Show that the electric field in the hole is $ (\\sigma/2\\varepsilon_0)\\hat{n} $, where $ \\hat{n} $ is the unit vector in the outward normal direction, and $ \\sigma $ is the surface charge density near the hole.',
              'The field just outside a conductor, $ \\sigma/\\varepsilon_0 $, splits into two equal $ \\sigma/2\\varepsilon_0 $ contributions — one from the small patch of charge that would fill the hole, one from the rest of the conductor. Removing the patch leaves only the second contribution.',
              'Think of the conductor\'s surface as (a tiny patch that would fill the hole) plus (everything else). Call the patch\'s own contribution $ \\vec{E}_{\\text{patch}} $ and the rest of the conductor\'s contribution $ \\vec{E}_{\\text{rest}} $, both evaluated right at the location of the hole.\n\nTreated as a small flat sheet, the patch alone would produce a field of magnitude $ \\sigma/2\\varepsilon_0 $ pointing away from itself on **both** sides — outward $ \\hat{n} $ just outside the surface, and inward $ -\\hat{n} $ just inside.\n\nNow use the two facts you already know about the real, intact conductor:\n\n**Just outside the surface**, the total field is the standard result $ \\vec{E} = (\\sigma/\\varepsilon_0)\\hat{n} $. This total is $ \\vec{E}_{\\text{patch}} + \\vec{E}_{\\text{rest}} = (\\sigma/2\\varepsilon_0)\\hat{n} + \\vec{E}_{\\text{rest}} $, so\n\n$ \\vec{E}_{\\text{rest}} = \\frac{\\sigma}{\\varepsilon_0}\\hat{n} - \\frac{\\sigma}{2\\varepsilon_0}\\hat{n} = \\frac{\\sigma}{2\\varepsilon_0}\\hat{n} $\n\n**Just inside the surface**, the total field is zero (inside a conductor). This total is $ -\\frac{\\sigma}{2\\varepsilon_0}\\hat{n} + \\vec{E}_{\\text{rest}} = 0 $, which again gives $ \\vec{E}_{\\text{rest}} = \\frac{\\sigma}{2\\varepsilon_0}\\hat{n} $ — the same answer, a useful consistency check.\n\nNow cut the hole: this removes the patch, so only $ \\vec{E}_{\\text{rest}} $ survives at that location — exactly $ (\\sigma/2\\varepsilon_0)\\hat{n} $, half of the field that existed there before the hole was cut.',
              SRC, 'NCERT Ex 1.29'),
          ],
        },
        // ── F · Additional exercises ──────────────────────────────────────────
        {
          id: 'ncert-f-additional',
          title: 'F · Additional exercises — dipoles, symmetry and building blocks',
          blurb: 'Exercises 1.25, 1.27, 1.30, 1.31, 1.32.',
          items: [
            num('ncert-1-25', 'An oil drop of 12 excess electrons is held stationary under a constant electric field of $ 2.55 \\times 10^{4} $ NC$ ^{-1} $ in Millikan\'s oil drop experiment. The density of the oil is 1.26 g cm$ ^{-3} $. Estimate the radius of the drop. ($ g = 9.81 $ m s$ ^{-2} $; $ e = 1.60 \\times 10^{-19} $ C.)',
              '$ r \\approx 9.81 \\times 10^{-7} $ m.',
              'Equilibrium means the electric force upward balances gravity downward: $ qE = mg $.\n\nCharge on the drop: $ q = 12e = 12(1.6\\times10^{-19}) = 1.92\\times10^{-18}\\ \\text{C} $\n\nMass in terms of radius: $ m = \\rho\\left(\\frac{4}{3}\\pi r^{3}\\right) $, with $ \\rho = 1.26\\ \\text{g/cm}^{3} = 1260\\ \\text{kg/m}^{3} $\n\nSetting $ qE = \\rho\\left(\\frac{4}{3}\\pi r^{3}\\right)g $ and solving for $ r^{3} $:\n\n$ r^{3} = \\frac{3qE}{4\\pi\\rho g} = \\frac{3(1.92\\times10^{-18})(2.55\\times10^{4})}{4\\pi(1260)(9.81)} = \\frac{1.469\\times10^{-13}}{1.553\\times10^{5}} \\approx 9.46\\times10^{-19}\\ \\text{m}^{3} $\n\n$ r = (9.46\\times10^{-19})^{1/3} \\approx 9.81\\times10^{-7}\\ \\text{m} $\n\nAbout a micron across — a genuinely tiny oil drop, exactly the scale Millikan needed to balance against a field he could produce in the lab.',
              SRC, 'NCERT Ex 1.25'),
            num('ncert-1-27', 'In a certain region of space, electric field is along the $ z $-direction throughout. The magnitude of electric field is, however, not constant but increases uniformly along the positive $ z $-direction, at the rate of $ 10^{5} $ NC$ ^{-1} $ per metre. What are the force and torque experienced by a system having a total dipole moment equal to $ 10^{-7} $ Cm in the negative $ z $-direction?',
              'Force $ = 10^{-2} $ N, directed along the negative $ z $-axis. Torque $ = 0 $.',
              '**Torque.** The dipole moment $ \\vec{p} $ points along $ -z $, and $ \\vec{E} $ points along $ +z $ — so $ \\vec{p} $ is exactly **antiparallel** to $ \\vec{E} $, meaning $ \\theta = 180^\\circ $. Since $ \\tau = pE\\sin\\theta $ and $ \\sin180^\\circ = 0 $, the torque is zero — the dipole is aligned along the field axis (just pointing the "wrong" way), and a dipole exactly parallel or antiparallel to the field always has zero instantaneous torque.\n\n**Force.** A dipole feels a net force only in a *non-uniform* field, and for a dipole aligned along the axis of variation the force is $ F = p\\,(dE/dz) $, taking direction into account. With $ \\vec{p} $ pointing opposite to the direction in which $ E $ grows, the force works out to\n\n$ F = -p\\left(\\frac{dE}{dz}\\right) = -(10^{-7})(10^{5}) = -10^{-2}\\ \\text{N} $\n\ni.e. magnitude $ 10^{-2} $ N along $ -z $ — the dipole is pushed toward the region where the field is **weaker**. That direction makes sense physically: a dipole antiparallel to the field has higher potential energy where the field is stronger, so the force pushes it toward lower field strength, just as any system is pushed toward lower potential energy.',
              SRC, 'NCERT Ex 1.27'),
            num('ncert-1-30', 'Obtain the formula for the electric field due to a long thin wire of uniform linear charge density $ \\lambda $ without using Gauss\'s law. [Hint: Use Coulomb\'s law directly and evaluate the necessary integral.]',
              '$ E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $ — the same result Gauss\'s law gives, reached by direct integration instead.',
              'Set the wire along the $ x $-axis and find the field at a point $ P $ a perpendicular distance $ r $ from the wire. A small element of the wire of length $ dx $, at position $ x $, carries charge $ dq = \\lambda\\,dx $ and sits a distance $ s = \\sqrt{x^{2}+r^{2}} $ from $ P $.\n\nThat element produces a field of magnitude $ dE = \\frac{k\\,dq}{s^{2}} = \\frac{k\\lambda\\,dx}{x^{2}+r^{2}} $, directed along the line from the element to $ P $.\n\n**Symmetry first.** Pair up the element at $ +x $ with the one at $ -x $. Their components *along* the wire are equal and opposite, so they cancel; their components *perpendicular* to the wire (toward $ P $, radially) are equal and add. Only the radial component survives the integral.\n\nThe radial component of each element\'s field is $ dE\\cos\\phi $, where $ \\cos\\phi = r/s $:\n\n$ dE_r = \\frac{k\\lambda\\,dx}{x^{2}+r^{2}} \\cdot \\frac{r}{\\sqrt{x^{2}+r^{2}}} = \\frac{k\\lambda r\\,dx}{(x^{2}+r^{2})^{3/2}} $\n\nIntegrate over the whole (infinite) wire:\n\n$ E = k\\lambda r\\int_{-\\infty}^{\\infty}\\frac{dx}{(x^{2}+r^{2})^{3/2}} $\n\nThis is a standard integral, equal to $ 2/r^{2} $, so\n\n$ E = k\\lambda r \\cdot \\frac{2}{r^{2}} = \\frac{2k\\lambda}{r} = \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $\n\n— exactly the Gauss\'s-law result, arrived at with nothing but Coulomb\'s law and an integral. This is also why Gauss\'s law is worth learning: it delivers the same answer in one line, once the symmetry is right.',
              SRC, 'NCERT Ex 1.30'),
            num('ncert-1-31', 'It is now believed that protons and neutrons (which constitute nuclei of ordinary matter) are themselves built out of more elementary units called quarks. A proton and a neutron consist of three quarks each. Two types of quarks, the so called \'up\' quark (denoted by u) of charge $ +\\frac{2}{3}e $, and the \'down\' quark (denoted by d) of charge $ -\\frac{1}{3}e $, together with electrons build up ordinary matter. Suggest a possible quark composition of a proton and neutron.',
              'Proton: $ uud $ (two up, one down). Neutron: $ udd $ (one up, two down).',
              'Try combinations of $ u $ ($ +\\frac{2}{3}e $) and $ d $ ($ -\\frac{1}{3}e $), three quarks total, and check which totals give $ +e $ (proton) and $ 0 $ (neutron).\n\n**Proton, charge $ +e $.** Try $ uud $: $ \\frac{2}{3}e + \\frac{2}{3}e - \\frac{1}{3}e = \\frac{4}{3}e - \\frac{1}{3}e = e $. That works.\n\n**Neutron, charge $ 0 $.** Try $ udd $: $ \\frac{2}{3}e - \\frac{1}{3}e - \\frac{1}{3}e = \\frac{2}{3}e - \\frac{2}{3}e = 0 $. That works too.\n\nSo a proton is two up quarks and one down quark ($ uud $), and a neutron is one up quark and two down quarks ($ udd $) — and both are built entirely from a charge of $ e/3 $ as the true fundamental unit, with the electron\'s $ e $ turning out to be three times that.',
              SRC, 'NCERT Ex 1.31'),
            num('ncert-1-32', '(a) Consider an arbitrary electrostatic field configuration. A small test charge is placed at a null point (i.e., where $ \\vec{E} = 0 $) of the configuration. Show that the equilibrium of the test charge is necessarily unstable.\n\n(b) Verify this result for the simple configuration of two charges of the same magnitude and sign placed a certain distance apart.',
              '(a) True stability everywhere around the point would require net inward flux with no enclosed charge — which Gauss\'s law forbids. (b) At the midpoint between two equal like charges, the equilibrium is unstable along the line joining them but stable sideways — not stable in every direction, so not truly stable.',
              '**(a)** Suppose, for contradiction, that the null point were a point of *stable* equilibrium in every direction. That would require the field to point **inward**, back toward the null point, at every point on a small imaginary sphere surrounding it — a restoring field on all sides.\n\nBut consider a Gaussian surface being that small sphere. There is no charge sitting exactly at the null point itself (it is a null point of the combined field from charges elsewhere, not a charge in its own right), so the sphere encloses zero charge, and Gauss\'s law demands the *net* flux through it be exactly zero.\n\nA field pointing inward everywhere on the sphere would give a strictly negative net flux — which contradicts the zero required by Gauss\'s law. So the field **cannot** point inward at every point on the sphere: it must point outward on at least part of the surface. That means displacing the test charge in *some* direction pushes it further away rather than back — which is the definition of instability. A null point can be stable in some directions and unstable in others, but never stable in all of them at once.\n\n**(b)** Place two equal charges $ +q $ a distance $ 2a $ apart on the $ x $-axis, with the null point at their midpoint (the only point where the two fields exactly cancel, by symmetry).\n\nDisplace the test charge slightly **along** the line joining the charges — toward one of them. That charge\'s field grows stronger (closer) while the other\'s grows weaker (farther), so the net field now pushes the test charge further in the same direction it moved: this is **unstable**.\n\nDisplace the test charge slightly **perpendicular** to that line instead. By symmetry, the two charges now each pull it back toward the axis with matching components — a net restoring force: this direction is **stable**.\n\nStable in one direction, unstable in the other — exactly the mixed behaviour part (a) predicted, and exactly why it can never count as genuine stable equilibrium.',
              SRC, 'NCERT Ex 1.32'),
          ],
        },
        // ── G · The projectile-style additional exercises ────────────────────
        {
          id: 'ncert-g-projectile',
          title: 'G · The projectile-style additional exercises',
          blurb: 'Exercises 1.33, 1.34 — a charged particle between plates behaves exactly like a projectile in gravity.',
          items: [
            num('ncert-1-33', 'A particle of mass $ m $ and charge $ (-q) $ enters the region between two charged plates initially moving along the $ x $-axis with speed $ v_x $. The length of plate is $ L $ and a uniform electric field $ E $ is maintained between the plates, perpendicular to $ v_x $. Show that the vertical deflection of the particle at the far edge of the plate is $ qEL^{2}/(2mv_x^{2}) $. Compare this motion with motion of a projectile in a gravitational field.',
              '$ y = \\frac{qEL^{2}}{2mv_x^{2}} $ — derived exactly like the range of a horizontal projectile, with $ qE/m $ standing in for $ g $.',
              'Split the motion into two independent directions, exactly as you would for a projectile.\n\n**Along $ x $ (the direction of entry).** No force acts in this direction (the field is perpendicular to $ v_x $), so the particle moves at constant velocity: it covers the plate length $ L $ in time\n\n$ t = \\frac{L}{v_x} $\n\n**Along $ y $ (perpendicular, the direction of $ E $).** The field exerts a constant force of magnitude $ qE $ on the particle (using $ q $ as the magnitude of the charge), giving a constant transverse acceleration\n\n$ a = \\frac{qE}{m} $\n\nStarting from rest in this direction, the deflection after time $ t $ is the usual constant-acceleration result:\n\n$ y = \\frac{1}{2}at^{2} = \\frac{1}{2}\\left(\\frac{qE}{m}\\right)\\left(\\frac{L}{v_x}\\right)^{2} = \\frac{qEL^{2}}{2mv_x^{2}} $\n\nwhich is exactly the deflection to be shown.\n\n**Comparison with a projectile.** This is the identical mathematics as a ball thrown horizontally in gravity: constant velocity along one axis, constant acceleration along the perpendicular axis, and a parabolic path traced out by combining the two. Here $ qE/m $ plays the role $ g $ plays for the projectile, and $ L/v_x $ (time spent in the field) plays the role of time of flight. Both trajectories are parabolas for the same underlying reason — one direction is force-free, the other has constant force.',
              SRC, 'NCERT Ex 1.33'),
            num('ncert-1-34', 'Suppose that the particle in Exercise in 1.33 is an electron projected with velocity $ v_x = 2.0 \\times 10^{6} $ m s$ ^{-1} $. If $ E $ between the plates separated by 0.5 cm is $ 9.1 \\times 10^{2} $ N/C, where will the electron strike the upper plate? ($ |e| = 1.6 \\times 10^{-19} $ C, $ m_e = 9.1 \\times 10^{-31} $ kg.)',
              'About 1.12 cm from the point of entry.',
              'The electron enters along the central axis, so it can deflect by at most half the plate separation before striking a plate:\n\n$ y_{\\max} = \\frac{0.5\\ \\text{cm}}{2} = 0.25\\ \\text{cm} = 2.5\\times10^{-3}\\ \\text{m} $\n\n**Acceleration.** Using the result from the previous exercise, $ a = eE/m_e $:\n\n$ a = \\frac{(1.6\\times10^{-19})(9.1\\times10^{2})}{9.1\\times10^{-31}} $\n\nThe two factors of $ 9.1 $ cancel exactly, leaving $ a = (1.6\\times10^{-19})\\times10^{33} = 1.6\\times10^{14}\\ \\text{m/s}^{2} $ — a deliberately clean number.\n\n**Time to reach the plate.** From $ y_{\\max} = \\frac{1}{2}at^{2} $:\n\n$ t = \\sqrt{\\frac{2y_{\\max}}{a}} = \\sqrt{\\frac{2(2.5\\times10^{-3})}{1.6\\times10^{14}}} = \\sqrt{3.125\\times10^{-17}} \\approx 5.59\\times10^{-9}\\ \\text{s} $\n\n**Horizontal distance covered in that time** — this is where it strikes the plate, measured from the point of entry:\n\n$ x = v_xt = (2.0\\times10^{6})(5.59\\times10^{-9}) \\approx 1.12\\times10^{-2}\\ \\text{m} = 1.12\\ \\text{cm} $\n\nAs a check, this distance is comfortably less than any reasonable plate length, so the electron does strike the plate rather than exiting the far end first — the scenario the question describes is self-consistent.',
              SRC, 'NCERT Ex 1.34'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That\'s the whole first NCERT chapter, worked end to end.',
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p19, p20]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
