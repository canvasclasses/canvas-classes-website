'use strict';
/**
 * Class 12 Physics · Ch.1 "Electrostatics" — page 17, Practice & Mastery.
 *
 * Sources: items marked source 'ncert_exemplar' are adapted from NCERT Exemplar
 * Physics Class 12 ch.1 (badged, permitted). Everything else is source 'mcq'
 * (no badge) per the standing no-third-party-attribution rule.
 *
 * Run: node scripts/physics12-book/build_ch1_e_practice.js
 */
const { b, mcq, mcqFixed, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 1;
const EX = 'ncert_exemplar';

const p18 = {
  page_number: 18,
  slug: 'electrostatics-practice-and-mastery',
  title: 'Practice & Mastery',
  subtitle: 'Six sections, thirty-seven problems — work them before you look',
  page_type: 'lesson',
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A warning about how to use this page.\n\nReading a solution feels like learning and mostly is not. The value is entirely in the minute you spend stuck **before** you reveal the answer — that is when your brain files the method away instead of the conclusion.\n\nSo: attempt, commit to an answer, and only then open the solution. If you got it right for the wrong reason, the explanation will tell you.',
    }),
    b('practice_bank', 1, {
      title: 'Electrostatics — the full set',
      intro: 'Sections follow the chapter in order. Numerical items ask you to produce the answer yourself; the multiple-choice ones are built so that every wrong option is a real mistake somebody makes.',
      sections: [
        // ── 1 · Charge ──────────────────────────────────────────────────────
        {
          id: 'ch1-s1-charge',
          title: '1 · Charge, quantisation and conservation',
          blurb: 'The three rules, and the arithmetic that follows from them.',
          items: [
            mcq('ch1-p01', 'Which of the following is **not** a possible value for the charge on a body?',
              ['$ 3.2 \\times 10^{-19} $ C', '$ 4.0 \\times 10^{-19} $ C', '$ 8.0 \\times 10^{-19} $ C', '$ 1.6 \\times 10^{-19} $ C'],
              1,
              'Divide each value by $ e = 1.6\\times10^{-19} $ C and ask whether the result is a whole number. $ 3.2\\times10^{-19} $ is $ 2e $, $ 8.0\\times10^{-19} $ is $ 5e $ and $ 1.6\\times10^{-19} $ is $ 1e $ — all allowed. But $ 4.0\\times10^{-19} $ works out at $ 2.5e $, which quantisation forbids.'),
            num('ch1-p02', 'A body has a charge of $ -4.8 \\times 10^{-17} $ C. How many electrons has it gained, and what is the resulting change in its mass? Take $ m_e = 9.1\\times10^{-31} $ kg.',
              '$ n = 300 $ electrons; mass increases by $ 2.73\\times10^{-28} $ kg.',
              'The charge is negative, so the body has **gained** electrons.\n\n$ n = \\frac{q}{e} = \\frac{4.8\\times10^{-17}}{1.6\\times10^{-19}} = 300 $\n\nEach electron brings its own mass with it:\n\n$ \\Delta m = n\\,m_e = 300 \\times 9.1\\times10^{-31} = 2.73\\times10^{-28}\\ \\text{kg} $\n\nSo charging a body **does** change its mass — by an amount far too small to weigh. Charging positively would make it lighter, for the same reason.'),
            mcq('ch1-p03', 'Two identical metal spheres carry charges $ +6\\ \\mu\\text{C} $ and $ -10\\ \\mu\\text{C} $. They are brought into contact and then separated. The charge on each is now',
              ['$ -2\\ \\mu\\text{C} $', '$ -4\\ \\mu\\text{C} $', '$ +8\\ \\mu\\text{C} $', '$ -16\\ \\mu\\text{C} $'],
              0,
              'The total is conserved: $ +6 + (-10) = -4\\ \\mu\\text{C} $. Identical spheres share it equally, so each ends with $ -2\\ \\mu\\text{C} $. Answering $ -4\\ \\mu\\text{C} $ means you found the total but forgot to halve it.'),
            mcq('ch1-p04', 'During pair production a photon disappears and an electron and a positron appear. This is a demonstration of',
              ['conservation of charge', 'quantisation of charge', 'conservation of mass', "Coulomb's law"],
              0,
              'Two charged particles appeared where there had been none, yet the **net** charge before and after is zero. Mass was certainly not conserved — it was created from the photon\'s energy.'),
            num('ch1-p05', "A paisa coin of mass $ 0.75 $ g is made of aluminium (atomic mass $ 26.98 $ g/mol, atomic number 13) and is electrically neutral. Find the magnitude of the positive charge it contains. Take $ N_A = 6.02\\times10^{23} $/mol.",
              '$ \\approx 3.48 \\times 10^{4} $ C, i.e. about 34.8 kC.',
              'Number of moles: $ \\frac{0.75}{26.98} = 0.0278 $ mol.\n\nNumber of atoms: $ 0.0278 \\times 6.02\\times10^{23} = 1.67\\times10^{22} $.\n\nEach aluminium atom has 13 protons, so the positive charge is\n\n$ q = 1.67\\times10^{22} \\times 13 \\times 1.6\\times10^{-19} \\approx 3.48\\times10^{4}\\ \\text{C} $\n\n**What to take from this.** A one-gram coin contains about 35,000 coulombs of positive charge and exactly as much negative charge. The largest charge you will ever separate in a lab is a few microcoulombs — ten orders of magnitude smaller. Ordinary matter is not weakly charged; it is enormously charged and almost perfectly balanced.',
              EX),
          ],
        },
        // ── 2 · Coulomb ─────────────────────────────────────────────────────
        {
          id: 'ch1-s2-coulomb',
          title: "2 · Coulomb's law and superposition",
          blurb: 'Draw the force arrows first. Every one of these rewards a picture.',
          items: [
            num('ch1-p06', 'Find the ratio of the electric force to the gravitational force between a proton and an electron. Take $ m_p = 1.67\\times10^{-27} $ kg, $ m_e = 9.11\\times10^{-31} $ kg and $ G = 6.67\\times10^{-11} $ SI units.',
              '$ F_e/F_g \\approx 2.3 \\times 10^{39} $',
              'Both forces go as $ 1/r^{2} $, so the separation cancels completely — the ratio is the same at every distance.\n\n$ \\frac{F_e}{F_g} = \\frac{ke^{2}}{Gm_pm_e} = \\frac{(9\\times10^{9})(1.6\\times10^{-19})^{2}}{(6.67\\times10^{-11})(1.67\\times10^{-27})(9.11\\times10^{-31})} $\n\n$ = \\frac{2.30\\times10^{-28}}{1.01\\times10^{-67}} \\approx 2.3\\times10^{39} $\n\nThis is why gravity never appears in an atomic calculation, and why we ignored it without comment when deflecting electrons between plates.'),
            mcq('ch1-p07', 'Two point charges repel each other with force $ F $. If the distance between them is halved and each charge is halved, the new force is',
              ['$ F $', '$ F/4 $', '$ 4F $', '$ F/2 $'],
              0,
              '$ F \\propto q_1q_2/r^{2} $. Halving both charges divides the top by 4; halving $ r $ divides the bottom by 4. The two effects cancel exactly and the force is unchanged.'),
            num('ch1-p08', 'Three equal point charges $ q $ are placed at the vertices of an equilateral triangle of side $ a $. Find the magnitude of the net electric force on any one of them.',
              '$ \\sqrt{3}\\,\\frac{kq^{2}}{a^{2}} $',
              'Each of the other two charges repels the chosen one with $ F = kq^{2}/a^{2} $, and the angle between those two force arrows is $ 60^\\circ $.\n\n$ F_{\\text{net}} = \\sqrt{F^{2}+F^{2}+2F^{2}\\cos 60^\\circ} = F\\sqrt{2+1} = \\sqrt{3}\\,\\frac{kq^{2}}{a^{2}} $\n\nIts direction is radially outward, along the line from the centre of the triangle through that vertex.'),
            num('ch1-p09', 'Charges $ q $ and $ -3q $ are fixed on the $ x $-axis, a distance $ d $ apart. Where should a third charge $ 2q $ be placed so that it experiences no force?',
              'On the far side of $ q $, at a distance $ \\frac{d}{\\sqrt{3}-1} \\approx 1.37d $ from $ q $.',
              '**Region first.** The two charges are unlike, so the two forces on the third charge can only oppose each other **outside** the pair — and it must be beyond the **smaller** magnitude charge, which is $ q $.\n\nLet the third charge sit a distance $ r $ from $ q $, on the side away from $ -3q $. Its distance from $ -3q $ is then $ r+d $. Equating magnitudes:\n\n$ \\frac{k(q)(2q)}{r^{2}} = \\frac{k(3q)(2q)}{(r+d)^{2}} $\n\n$ (r+d)^{2} = 3r^{2} \\quad\\Rightarrow\\quad r+d = \\sqrt{3}\\,r \\quad\\Rightarrow\\quad r = \\frac{d}{\\sqrt{3}-1} \\approx 1.37d $\n\nNotice that the value of the third charge, $ 2q $, cancels out — a null point belongs to the arrangement, not to the charge you place there.',
              EX),
            mcq('ch1-p10', 'Two identical charged spheres suspended from a common point by strings of equal length hang apart at an angle $ \\theta $. When immersed in a liquid of density half that of the spheres, the angle is unchanged. The dielectric constant of the liquid is',
              ['2', '4', '0.5', '80'],
              0,
              'The condition for the angle to be unchanged is $ K = \\frac{\\rho}{\\rho-\\sigma} $. With $ \\sigma = \\rho/2 $ this gives $ K = 2 $. The value 80 is water — a tempting number, but it would need a liquid of density $ \\tfrac{79}{80}\\rho $.'),
            mcq('ch1-p11', 'Charges $ +4q $ and $ +q $ are separated by $ 3a $. A third charge placed on the line joining them feels no force at a distance from the $ +4q $ charge of',
              ['$ 2a $', '$ a $', '$ 1.5a $', '$ 2.5a $'],
              0,
              '$ \\frac{r_1}{r_2} = \\sqrt{\\frac{4q}{q}} = 2 $, with $ r_1+r_2 = 3a $. Solving gives $ r_1 = 2a $ and $ r_2 = a $ — closer to the smaller charge, as it always must be.'),
            num('ch1-p12', "A CsCl crystal unit is a cube of side $ 0.40 $ nm with a Cs$ ^+ $ ion at each corner and one Cl$ ^- $ ion at the centre. (i) What is the net force on the Cl$ ^- $ ion from the eight Cs$ ^+ $ ions? (ii) What is it if the Cs$ ^+ $ at one corner is missing?",
              '(i) Zero. (ii) $ 1.92\\times10^{-9} $ N, directed away from the vacancy.',
              '**(i)** The eight corners are arranged symmetrically about the centre, and they pair up diagonally — each pair pulls the Cl$ ^- $ in exactly opposite directions with equal strength. Everything cancels: the net force is **zero**.\n\n**(ii)** With all eight present the total was zero, so\n\n$ \\vec{F}_{\\text{seven}} = -\\vec{F}_{\\text{missing one}} $\n\nSo the answer is just the magnitude of the force the missing ion used to exert, pointing the opposite way.\n\nDistance from a corner to the centre is half the body diagonal:\n\n$ r = \\frac{\\sqrt{3}}{2}(0.40\\ \\text{nm}) = 3.46\\times10^{-10}\\ \\text{m} $\n\n$ F = \\frac{ke^{2}}{r^{2}} = \\frac{(9\\times10^{9})(1.6\\times10^{-19})^{2}}{(3.46\\times10^{-10})^{2}} = 1.92\\times10^{-9}\\ \\text{N} $\n\nThe missing Cs$ ^+ $ had been **attracting** the Cl$ ^- $ towards that corner, so the surviving seven now push it **away** from the vacancy.\n\n**The technique.** "Complete set minus one" is far easier than adding seven vectors. Use it whenever a symmetric arrangement has one element removed.',
              EX),
          ],
        },
        // ── 3 · Field ───────────────────────────────────────────────────────
        {
          id: 'ch1-s3-field',
          title: '3 · Electric field and field lines',
          blurb: 'Direction matters as much as magnitude here. State it every time.',
          items: [
            num('ch1-p13', 'A charge $ q = -2.0\\ \\mu\\text{C} $ is placed at the origin. Find the electric field at the point $ (3\\ \\text{m},\\ 4\\ \\text{m},\\ 0) $.',
              '$ \\vec{E} = (-432\\,\\hat{i} - 576\\,\\hat{j}) $ N/C, of magnitude $ 720 $ N/C directed towards the origin.',
              'The distance is $ r = \\sqrt{3^{2}+4^{2}} = 5 $ m.\n\nMagnitude: $ E = \\frac{kq}{r^{2}} = \\frac{(9\\times10^{9})(2\\times10^{-6})}{25} = 720 $ N/C.\n\nThe charge is **negative**, so the field points **towards** it — that is, along $ -(3\\hat{i}+4\\hat{j})/5 $:\n\n$ \\vec{E} = 720 \\times \\left(-\\frac{3}{5}\\hat{i} - \\frac{4}{5}\\hat{j}\\right) = (-432\\,\\hat{i} - 576\\,\\hat{j})\\ \\text{N/C} $\n\nAlways settle the direction from the sign of the charge before writing components.'),
            mcq('ch1-p14', 'A positive charge is released from rest in a region where the field lines are curved. Its subsequent path',
              ['starts along the field line but does not follow it', 'follows the field line exactly', 'is perpendicular to the field lines', 'is a straight line along the initial field direction'],
              0,
              'The initial force is along the field, so it sets off correctly. But once moving, its momentum carries it forward while the field direction keeps turning — so it leaves the curve. It follows a field line only when the line is straight.'),
            num('ch1-p15', 'Five equal charges $ q $ are placed at the corners of a regular pentagon, each a distance $ r $ from the centre $ O $. Find the field at $ O $ (i) as described, and (ii) if the charge at one corner is removed.',
              '(i) Zero. (ii) $ \\frac{kq}{r^{2}} $, directed towards the empty corner.',
              '**(i)** The five charges are arranged with perfect five-fold symmetry about $ O $, so their field contributions sum to zero. (There is no need to resolve anything — if the answer were non-zero it would have to point *somewhere*, and no direction is special.)\n\n**(ii)** Use "complete set minus one":\n\n$ \\vec{E}_{\\text{four}} = \\vec{E}_{\\text{five}} - \\vec{E}_{\\text{removed}} = \\vec{0} - \\vec{E}_{\\text{removed}} = -\\vec{E}_{\\text{removed}} $\n\nThe removed charge would have produced a field of magnitude $ kq/r^{2} $ pointing **away** from its corner, so what is left is $ kq/r^{2} $ pointing **towards** the vacancy.\n\nThe same argument works for any regular polygon with any number of sides.',
              EX),
            mcq('ch1-p16', 'The electric field at a point is discontinuous',
              ['if there is a charge at that point', 'always', 'only if the charge there is negative', 'never — the field is always continuous'],
              0,
              'A point charge makes $ E \\to \\infty $ as you approach it, so the field cannot be assigned a single value there. Elsewhere the field varies smoothly — with one important exception you met on the last two pages: it jumps across a charged **surface** too, which is a sheet of charge rather than a point.',
              EX),
            num('ch1-p17', 'A ring of radius $ R $ carries a uniform charge $ Q $. At what distance along its axis is the field maximum, and what is that maximum value?',
              '$ x = \\frac{R}{\\sqrt{2}} $, and $ E_{\\max} = \\frac{2}{3\\sqrt{3}}\\cdot\\frac{kQ}{R^{2}} \\approx \\frac{0.385\\,kQ}{R^{2}} $',
              'The axial field is\n\n$ E = \\frac{kQx}{(x^{2}+R^{2})^{3/2}} $\n\nSet $ \\frac{dE}{dx} = 0 $. Differentiating the quotient and clearing the common factor gives\n\n$ (x^{2}+R^{2}) - 3x^{2} = 0 \\quad\\Rightarrow\\quad R^{2} = 2x^{2} \\quad\\Rightarrow\\quad x = \\frac{R}{\\sqrt{2}} $\n\nSubstituting back, $ (x^{2}+R^{2})^{3/2} = (3R^{2}/2)^{3/2} $, and after simplifying\n\n$ E_{\\max} = \\frac{2}{3\\sqrt{3}}\\cdot\\frac{kQ}{R^{2}} $\n\nIt had to have a maximum somewhere: the field is zero at the centre and zero far away.'),
            mcq('ch1-p18', 'A negative test charge is placed at the centre of a uniformly positively charged ring and displaced slightly **along the axis**. It will',
              ['oscillate in simple harmonic motion', 'be pushed further away from the centre', 'stay exactly where it is placed', 'move off perpendicular to the axis'],
              0,
              'Near the centre the axial field is proportional to the displacement $ x $, so the force on a negative charge is $ -kx $ in form — a restoring force linear in displacement, which is exactly the condition for SHM. Displaced *in the plane* of the ring instead, the same charge would be pulled outwards and would not return.',
              EX),
            mcq('ch1-p19', 'The electric field due to a very long charged wire varies with perpendicular distance $ r $ as',
              ['$ 1/r $', '$ 1/r^{2} $', '$ 1/r^{3} $', 'it is independent of $ r $'],
              0,
              'A Gaussian cylinder gives $ E = \\lambda/2\\pi\\varepsilon_0 r $. The inverse-**square** law belongs to point charges; spreading the charge along a line changes the geometry and therefore the power of $ r $. Spread it over a plane instead and the dependence disappears altogether.'),
          ],
        },
        // ── 4 · Dipole ──────────────────────────────────────────────────────
        {
          id: 'ch1-s4-dipole',
          title: '4 · The electric dipole',
          blurb: 'Watch the direction of $ \\vec{p} $ and the factor of two.',
          items: [
            mcq('ch1-p20', 'At the same distance $ r $ from a short dipole, the ratio of the axial field to the equatorial field is',
              ['2 : 1', '1 : 2', '1 : 1', '4 : 1'],
              0,
              'On the axis the near charge dominates and the two fields partly reinforce; on the bisector the two fields are equal and only a smaller reversed component survives. The ratio is exactly two, at every distance.'),
            num('ch1-p21', 'An electric dipole of moment $ p = 2\\times10^{-8} $ C·m is placed in a uniform field of $ 3\\times10^{4} $ N/C. Find (a) the maximum torque, and (b) the work done in rotating it from the stable position to the unstable position.',
              '(a) $ 6\\times10^{-4} $ N·m  (b) $ 1.2\\times10^{-3} $ J',
              '**(a)** $ \\tau = pE\\sin\\theta $ is largest at $ \\theta = 90^\\circ $:\n\n$ \\tau_{\\max} = pE = (2\\times10^{-8})(3\\times10^{4}) = 6\\times10^{-4}\\ \\text{N·m} $\n\n**(b)** Stable means $ \\theta = 0^\\circ $ with $ U = -pE $; unstable means $ \\theta = 180^\\circ $ with $ U = +pE $. The work needed is the change:\n\n$ W = U_f - U_i = pE - (-pE) = 2pE = 1.2\\times10^{-3}\\ \\text{J} $\n\nThis is the largest work any rotation of this dipole can require.'),
            mcq('ch1-p22', 'A dipole is placed in a **non-uniform** electric field. In general it experiences',
              ['both a net force and a torque', 'a torque but no net force', 'a net force but no torque', 'neither force nor torque'],
              0,
              'The two charges sit in different field strengths, so the two forces no longer cancel. The "torque but no force" result is specific to a uniform field, and it is precisely because a comb\'s field is non-uniform that it can lift paper rather than merely twist it.'),
            num('ch1-p23', 'At a point on the axis of a short dipole, a distance $ r $ from its centre, the field has magnitude $ E $. Find the field at a distance $ 3r $ on the perpendicular bisector, in magnitude and direction.',
              '$ \\frac{E}{54} $, directed antiparallel to $ \\vec{p} $.',
              'Handle the two changes separately.\n\n**Position:** moving from the axial to the equatorial line at the same distance divides the field by 2.\n\n**Distance:** the dipole field goes as $ 1/r^{3} $, so going from $ r $ to $ 3r $ divides by $ 3^{3} = 27 $.\n\nTogether: $ E \\div 2 \\div 27 = E/54 $.\n\n**Direction:** equatorial fields point against $ \\vec{p} $, whereas the original axial field pointed along it — so the direction reverses.\n\nDoing position and distance as two independent factors is what keeps this reliable.'),
            mcq('ch1-p24', 'The dipole moment vector of an electric dipole points',
              ['from the negative charge to the positive charge', 'from the positive charge to the negative charge', 'along the applied field, always', 'perpendicular to the line joining the charges'],
              0,
              'This is the physics convention and every formula in the chapter assumes it. Chemistry often draws the arrow the other way to indicate electron shift — a real difference in convention, not a mistake in either subject.'),
            mcq('ch1-p25', 'Two charges $ +q $ and $ -q $ are separated by $ 2a $. The electric potential energy of a dipole is minimum when $ \\vec{p} $ is',
              ['parallel to $ \\vec{E} $', 'antiparallel to $ \\vec{E} $', 'perpendicular to $ \\vec{E} $', 'at $ 45^\\circ $ to $ \\vec{E} $'],
              0,
              '$ U = -pE\\cos\\theta $ is most negative when $ \\cos\\theta = 1 $, i.e. $ \\theta = 0 $. That is the stable orientation; antiparallel is the energy maximum and is unstable; perpendicular is where $ U = 0 $ and the torque is largest.'),
          ],
        },
        // ── 5 · Flux and Gauss ──────────────────────────────────────────────
        {
          id: 'ch1-s5-gauss',
          title: "5 · Flux and Gauss's law",
          blurb: 'Most of these need no integration at all — only the enclosed charge and a fraction.',
          items: [
            num('ch1-p26', 'An arbitrary closed surface encloses an electric dipole. What is the net electric flux through it?',
              'Zero.',
              'Gauss\'s law depends only on the **net** charge enclosed, and a dipole is $ +q $ together with $ -q $, so $ q_{\\text{in}} = 0 $ and the flux is zero.\n\nBe careful what this does **not** say. The field on the surface is emphatically not zero anywhere — it is a full dipole field. It is only the *sum* of $ \\vec{E}\\cdot d\\vec{S} $ over the whole closed surface that vanishes, because every line leaving the positive charge comes back into the negative one.',
              EX),
            num('ch1-p27', 'A charge $ q $ is placed at (a) a corner of a cube, (b) the mid-point of an edge, (c) the centre of a face, (d) a point just inside the cube. Find the flux through the whole cube in each case.',
              '(a) $ \\frac{q}{8\\varepsilon_0} $  (b) $ \\frac{q}{4\\varepsilon_0} $  (c) $ \\frac{q}{2\\varepsilon_0} $  (d) $ \\frac{q}{\\varepsilon_0} $',
              'One idea does all four: **how many identical cubes would it take to surround the charge completely?** Then the flux through one of them is $ \\frac{q}{\\varepsilon_0} $ divided by that number.\n\n**(a) Corner** — eight cubes meet at a corner, so $ \\frac{q}{8\\varepsilon_0} $.\n\n**(b) Mid-point of an edge** — four cubes meet along an edge, so $ \\frac{q}{4\\varepsilon_0} $.\n\n**(c) Centre of a face** — two cubes share a face, so $ \\frac{q}{2\\varepsilon_0} $.\n\n**(d) Anywhere strictly inside** — one cube already encloses it, so the full $ \\frac{q}{\\varepsilon_0} $. Where inside makes no difference at all.',
              EX),
            mcq('ch1-p28', "A Gaussian surface encloses charges $ q_2 $ and $ q_4 $, while $ q_1 $, $ q_3 $ and $ q_5 $ lie outside it. Which statement about $ \\oint\\vec{E}\\cdot d\\vec{S} = q_{\\text{in}}/\\varepsilon_0 $ is correct?",
              [
                '$ \\vec{E} $ is due to all five charges; $ q_{\\text{in}} $ counts only $ q_2 $ and $ q_4 $',
                '$ \\vec{E} $ is due only to $ q_2 $ and $ q_4 $; $ q_{\\text{in}} $ counts all five charges',
                'Both $ \\vec{E} $ and $ q_{\\text{in}} $ involve only $ q_2 $ and $ q_4 $ here',
                '$ \\vec{E} $ is due to $ q_1 $, $ q_3 $, $ q_5 $; $ q_{\\text{in}} $ counts $ q_2 $ and $ q_4 $',
              ],
              0,
              'The field at any point is the superposition of the fields of **every** charge — an imaginary surface changes nothing physical. What Gauss guarantees is that when you integrate over a **closed** surface, the outside charges contribute exactly zero net flux. This is the single most-tested subtlety of the topic.',
              EX),
            mcq('ch1-p29', 'A cube is placed in a uniform electric field with no charge inside. The net flux through the cube is',
              ['zero, whatever its orientation', 'zero only if a face is perpendicular to the field', 'proportional to the surface area of the cube', 'proportional to the field strength'],
              0,
              'Every line that enters must leave, so the inward and outward fluxes cancel exactly. Tilting the cube changes how the flux is shared among the faces but never the total.'),
            num('ch1-p30', "A metallic spherical shell has inner radius $ R_1 $ and outer radius $ R_2 $. A charge $ Q $ is placed at the centre of the cavity. Find the surface charge density on (i) the inner surface, and (ii) the outer surface.",
              '(i) $ -\\frac{Q}{4\\pi R_1^{2}} $  (ii) $ +\\frac{Q}{4\\pi R_2^{2}} $',
              '**Inner surface.** Draw a Gaussian sphere inside the metal (between $ R_1 $ and $ R_2 $). The field is zero throughout the metal, so the enclosed charge must be zero. With $ +Q $ at the centre, the inner wall must carry $ -Q $:\n\n$ \\sigma_{\\text{inner}} = \\frac{-Q}{4\\pi R_1^{2}} $\n\n**Outer surface.** The shell is neutral overall, so the $ -Q $ drawn to the inner wall leaves $ +Q $ behind, and it can only sit on the outer surface:\n\n$ \\sigma_{\\text{outer}} = \\frac{+Q}{4\\pi R_2^{2}} $\n\nNote that both are uniform here only because the arrangement is spherically symmetric and the charge sits exactly at the centre. Move the charge off-centre and the **inner** density becomes uneven — but the **outer** density stays uniform, because the outer surface has no way of knowing what is going on inside.',
              EX),
            num('ch1-p31', 'A hemisphere of radius $ R $ is placed in a uniform field $ E $. Find the flux through its curved surface when the field is (a) perpendicular to its flat base, and (b) parallel to its flat base.',
              '(a) $ E\\pi R^{2} $  (b) zero',
              '**(a)** Close the surface with the flat circular base. No charge is enclosed, so the total flux is zero, which means the curved part carries exactly the opposite of the base. The base is a circle of area $ \\pi R^{2} $ with the field perpendicular to it, so its flux magnitude is $ E\\pi R^{2} $ — and therefore so is the dome\'s.\n\nNote that the answer is **not** $ E \\times 2\\pi R^{2} $. The curved area is $ 2\\pi R^{2} $, but the field meets it at a different angle at every point; only the flat "shadow" outline counts.\n\n**(b)** Now the field lies in the plane of the base, so no line crosses the base — and by the same closed-surface argument, none nets through the dome either. The flux is zero.'),
            mcq('ch1-p32', "Gauss's law can be used to find the electric field only when the charge distribution has",
              ['spherical, cylindrical or planar symmetry', 'any shape whatsoever, with no restriction', 'a net enclosed charge of exactly zero', 'all of its charges at rest and none moving'],
              0,
              'The law is always *true*, but to get $ E $ out of the integral you must find a surface on which $ E $ is either constant-and-perpendicular or tangential everywhere. Only those three symmetries allow it. For a finite rod or two unequal charges you are back to integrating.'),
          ],
        },
        // ── 6 · Conductors ──────────────────────────────────────────────────
        {
          id: 'ch1-s6-conductors',
          title: '6 · Conductors in an electrostatic field',
          blurb: 'Every one of these traces back to a single fact: the field inside the metal is zero.',
          items: [
            num('ch1-p33', "The electric field between the proton and the electron inside an atom is enormous — of the order of $ 10^{11} $ N/C. Why, then, is the electric field inside a metal conductor zero?",
              'Because the zero refers to the AVERAGE macroscopic field, and only in electrostatic equilibrium.',
              'Two things are being confused, and separating them settles it.\n\n**Scale.** The huge fields inside an atom exist over distances of an angstrom, and they point in every direction as you move from atom to atom. Averaged over any region big enough to contain many atoms — which is what "the field in the conductor" means — they cancel.\n\n**Equilibrium.** On top of that, a conductor has free electrons. If any *net* average field survived, those electrons would be pushed and a current would flow. The charges rearrange themselves on the surface precisely until the interior field is cancelled, and only then do they stop.\n\nSo "$ E = 0 $ inside a conductor" is a statement about the macroscopic average field in the **static** case — not a claim that nothing electrical happens between the atoms.',
              EX),
            mcq('ch1-p34', 'A charge $ +Q $ is placed inside a cavity in an isolated **neutral** conductor. The charge appearing on the outer surface of the conductor is',
              ['$ +Q $', '$ -Q $', 'zero', '$ +2Q $'],
              0,
              'The cavity wall must take $ -Q $ so that a Gaussian surface inside the metal encloses zero. The conductor was neutral to start with, so that $ -Q $ leaves $ +Q $ behind — and the outer surface is the only place excess charge can sit.'),
            mcq('ch1-p35', 'The surface charge density on an irregularly shaped charged conductor is largest',
              ['where the surface curves most sharply', 'where the surface is flattest and broadest', 'uniform over the whole outer surface', 'at the centre of the conductor'],
              0,
              'Density varies inversely with the radius of curvature, so it piles up at points and edges. Since $ E = \\sigma/\\varepsilon_0 $ just outside, the field there is also largest — which is why sharp points leak charge into the air and why lightning conductors are pointed.'),
            num('ch1-p36', 'A solid conducting sphere of radius $ R $ carries a charge $ Q $. Sketch how the field varies from the centre out to $ r = 3R $, and state the value at $ r = R $.',
              '$ E = 0 $ for $ r < R $; $ E = kQ/R^{2} $ at the surface; $ E = kQ/r^{2} $ for $ r > R $ — with a jump at $ r = R $.',
              'Inside the metal the field is zero, since a Gaussian sphere there encloses no charge — all of $ Q $ sits on the outer surface.\n\nOutside, a Gaussian sphere encloses the whole $ Q $, so $ E = kQ/r^{2} $: exactly the field of a point charge at the centre.\n\nAt $ r = R $ the field jumps abruptly from $ 0 $ to $ kQ/R^{2} $. That discontinuity is real, and it equals $ \\sigma/\\varepsilon_0 $ — check it: $ \\sigma = Q/4\\pi R^{2} $, so $ \\sigma/\\varepsilon_0 = Q/4\\pi\\varepsilon_0R^{2} = kQ/R^{2} $. They agree.\n\n**Contrast this with a uniformly charged non-conducting solid sphere**, where the field rises linearly from the centre and is continuous at the surface. The conductor jumps; the insulator does not.'),
            mcq('ch1-p37', 'A charge is held off-centre inside a cavity in a neutral conducting shell. An observer outside the shell can determine',
              ['only the total charge inside, not its position', 'both the size of the charge and where it sits', 'neither the size nor the position of the charge', 'the position of the charge, but not its size'],
              0,
              'The cavity wall takes an uneven induced charge that crowds towards the off-centre charge — but the metal screens all of that. The **outer** surface distributes itself purely by the outer shape, so it reports the total and nothing else. Shielding hides the geometry, not the total.'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That is Chapter 1 finished. Next chapter tells the same physics with **energy** instead of force — and energy is a scalar, so most of the vector geometry you have been doing simply disappears.',
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p18]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
