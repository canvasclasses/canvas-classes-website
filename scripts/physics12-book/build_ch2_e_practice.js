'use strict';
/**
 * Class 12 Physics · Ch.2 "Capacitance" — page 17, Practice & Mastery.
 *
 * Items marked source 'ncert_exemplar' are adapted from NCERT Exemplar Physics
 * Class 12 ch.2. Everything else is source 'mcq' (no badge).
 *
 * Run: node scripts/physics12-book/build_ch2_e_practice.js
 */
const { b, mcq, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 2;
const EX = 'ncert_exemplar';

const p17 = {
  page_number: 17,
  slug: 'capacitance-practice-and-mastery',
  title: 'Practice & Mastery',
  subtitle: 'Six sections, thirty-eight problems — attempt before you reveal',
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'One question decides more marks in this chapter than any other piece of physics in it:\n\n> **Is the battery still connected?**\n\nConnected means the voltage is pinned and the charge adjusts. Disconnected means the charge is trapped and the voltage adjusts. Almost every "what happens if…" item below turns on that single fact — so make it the first thing you write down, before any formula.',
    }),
    b('practice_bank', 1, {
      title: 'Capacitance — the full set',
      intro: 'Sections follow the chapter in order. Work each one to an answer you would defend, then open the solution.',
      sections: [
        // ── 1 · Energy and potential ────────────────────────────────────────
        {
          id: 'ch2-s1-potential',
          title: '1 · Potential energy and potential',
          blurb: 'Scalars. No components, no angles — but the signs matter more than ever.',
          items: [
            num('ch2-p01', 'Two point charges $ +4\\ \\mu\\text{C} $ and $ -2\\ \\mu\\text{C} $ are $ 30 $ cm apart. Find the electrostatic potential energy of the pair, and state what its sign tells you.',
              '$ U = -0.24 $ J — the pair is bound.',
              '$ U = \\frac{kq_1q_2}{r} = \\frac{(9\\times10^{9})(4\\times10^{-6})(-2\\times10^{-6})}{0.30} $\n\n$ U = \\frac{-7.2\\times10^{-2}}{0.30} = -0.24\\ \\text{J} $\n\nThe **negative** sign says the charges attract and the system is **bound**: you would have to supply $ 0.24 $ J to pull them infinitely far apart.\n\nNote the single power of $ r $ — energy, not force.'),
            mcq('ch2-p02', 'A positively charged particle is released from rest in a uniform electric field. Its electrostatic potential energy',
              ['decreases, because it moves along the field', 'increases, because it moves along the field', 'stays constant, since the field is uniform', 'decreases, because it moves opposite to the field'],
              0,
              'A free positive charge is pushed along $ \\vec{E} $, towards lower potential. With $ U = qV $ and $ q > 0 $, moving to lower $ V $ means lower $ U $ — the energy converts into kinetic energy. Uniformity of the field has nothing to do with it.',
              EX),
            num('ch2-p03', 'Four charges $ +q $, $ -q $, $ +q $, $ -q $ are placed in order around the corners of a square of side $ a $. Find the electric potential at the centre.',
              'Zero.',
              'Every corner is the same distance from the centre — half a diagonal, $ r = a/\\sqrt{2} $.\n\nPotential is a **scalar**, so simply add the four values with their signs:\n\n$ V = \\frac{k}{r}\\big(q - q + q - q\\big) = 0 $\n\nOne line, no vectors.\n\n**But be careful what this does not say.** The **field** at the centre is not zero here — the two positive charges are diagonally opposite each other, as are the two negatives, so the four field vectors do not cancel. Zero potential and zero field are different statements.'),
            mcq('ch2-p04', 'The electrostatic potential on the surface of a charged conducting sphere is $ 100 $ V. Consider two statements. **S1:** the field at every interior point is zero. **S2:** the potential at every interior point is $ 100 $ V. Which is right?',
              ['Both are true, and S1 is the reason for S2', 'S1 is true but S2 is false', 'Both statements are false', 'Both are true, but they are independent of each other'],
              0,
              'The field inside is zero, so the potential gradient is zero, so the potential cannot change anywhere inside — it stays at its surface value of $ 100 $ V. The second statement is a direct consequence of the first, not a separate coincidence.',
              EX),
            num('ch2-p05', 'An alpha particle ($ q = +2e $) is accelerated from rest through a potential difference of $ 1000 $ V. Find its kinetic energy in eV and in joules.',
              '$ 2000 $ eV $ = 3.2\\times10^{-16} $ J',
              'The energy gained is $ qV $, and the charge is $ 2e $:\n\n$ KE = (2e)(1000\\ \\text{V}) = 2000\\ \\text{eV} $\n\nIn joules:\n\n$ KE = 2000 \\times 1.6\\times10^{-19} = 3.2\\times10^{-16}\\ \\text{J} $\n\n**The point of the question** is the factor of 2. An electron through $ 1000 $ V gains $ 1000 $ eV; a doubly charged ion through the same volts gains twice as much, because the eV is defined for one elementary charge.'),
            mcq('ch2-p06', 'Free electrons in a conductor drift towards',
              ['regions of higher potential', 'regions of lower potential', 'the region of strongest field', 'whichever region has more charge'],
              0,
              'For an electron $ U = (-e)V $, so lowering its energy means moving to **larger** $ V $. It travels opposite to the conventional current and opposite to a free proton in the same field.',
              EX),
          ],
        },
        // ── 2 · Equipotentials and field-potential relation ─────────────────
        {
          id: 'ch2-s2-equipotential',
          title: '2 · Equipotentials and the field–potential link',
          blurb: 'Read the contour map. The field is the slope.',
          items: [
            mcq('ch2-p07', 'The work done in moving a charge from A to B along an equipotential surface',
              ['is zero', 'depends on the path taken', 'equals $ qV $', 'is largest for the longest path'],
              0,
              'All points on the surface share one value of $ V $, so $ V_A - V_B = 0 $ and $ W = q(V_A - V_B) = 0 $ — for every route, however long.',
              EX),
            mcq('ch2-p08', 'Equipotential surfaces are more crowded together',
              ['where the electric field is stronger', 'where the electric field is weaker', 'far from all charges', 'inside a conductor'],
              0,
              'For a fixed step in $ V $, the spacing is $ \\Delta r \\approx \\Delta V/E $ — so a strong field means the surfaces are packed close. This is why they crowd near sharp edges and near large charge densities.',
              EX),
            num('ch2-p09', 'The electric potential in a region is $ V = -3x^{2} + 5y $ volts, with distances in metres. Find the electric field at the point $ (2\\ \\text{m},\\ 1\\ \\text{m}) $.',
              '$ \\vec{E} = (12\\,\\hat{i} - 5\\,\\hat{j}) $ V/m',
              'Take the negative of each partial derivative.\n\n$ E_x = -\\frac{\\partial V}{\\partial x} = -(-6x) = 6x $\n\n$ E_y = -\\frac{\\partial V}{\\partial y} = -5 $\n\nAt $ (2, 1) $:\n\n$ \\vec{E} = 6(2)\\,\\hat{i} - 5\\,\\hat{j} = (12\\,\\hat{i} - 5\\,\\hat{j})\\ \\text{V/m} $\n\nNotice that $ E_y $ has no position dependence, because $ V $ was only linear in $ y $. And the point\'s $ y $-value never mattered for $ E_x $ either.'),
            mcq('ch2-p10', 'In a region where the potential is constant everywhere,',
              ['the electric field is zero throughout', 'the electric field is uniform but non-zero', 'there must be a charge in the region', 'the field is perpendicular to the region'],
              0,
              '$ E = -dV/dr $, and a constant potential has zero gradient in every direction. On the contour-map picture, constant height is flat ground and nothing rolls.',
              EX),
            mcq('ch2-p11', 'At a great distance from a group of charges whose total is not zero, the equipotential surfaces are approximately',
              ['spheres', 'planes', 'ellipsoids', 'paraboloids'],
              0,
              'From far enough away any charge distribution with a non-zero total looks like a single point charge, whose equipotentials are concentric spheres. If the total were zero the leading behaviour would be dipole-like instead.',
              EX),
            num('ch2-p12', 'Two large parallel plates $ 5 $ mm apart have a potential difference of $ 250 $ V. Find the field between them, and the work done in moving a charge of $ 3\\ \\mu\\text{C} $ from one plate to the other.',
              '$ E = 5\\times10^{4} $ V/m; $ W = 7.5\\times10^{-4} $ J',
              'For a uniform field, $ E = \\frac{V}{d} = \\frac{250}{5\\times10^{-3}} = 5\\times10^{4} $ V/m.\n\nThe work is\n\n$ W = qV = (3\\times10^{-6})(250) = 7.5\\times10^{-4}\\ \\text{J} $\n\nYou could also get this as $ W = qEd $ — same answer, since $ V = Ed $. Use whichever two quantities you were given.'),
          ],
        },
        // ── 3 · Conductors ──────────────────────────────────────────────────
        {
          id: 'ch2-s3-conductors',
          title: '3 · Conductors and charge sharing',
          blurb: 'One equipotential — and everything follows.',
          items: [
            num('ch2-p13', 'Two conducting spheres of radii $ R_1 $ and $ R_2 $, with $ R_1 > R_2 $, are held at the same potential. Which carries more charge, and which has the greater surface charge density?',
              'The larger sphere holds more charge; the **smaller** sphere has the greater charge density.',
              'Equal potential means $ \\frac{kQ_1}{R_1} = \\frac{kQ_2}{R_2} $, so\n\n$ \\frac{Q_1}{Q_2} = \\frac{R_1}{R_2} > 1 $\n\nThe larger sphere holds more charge, as expected.\n\nNow the density, $ \\sigma = Q/4\\pi R^{2} $:\n\n$ \\frac{\\sigma_1}{\\sigma_2} = \\frac{Q_1}{Q_2}\\cdot\\frac{R_2^{2}}{R_1^{2}} = \\frac{R_1}{R_2}\\cdot\\frac{R_2^{2}}{R_1^{2}} = \\frac{R_2}{R_1} < 1 $\n\nSo $ \\sigma_2 > \\sigma_1 $: the **smaller** sphere is denser, and since $ E = \\sigma/\\varepsilon_0 $ just outside, it also has the stronger surface field. A spark starts there first.',
              EX),
            mcq('ch2-p14', 'A conductor is at a non-zero potential and there are no other charges anywhere. It follows that',
              ['there is charge on its surface but none inside', 'there must be charge inside the body of the metal', 'there is charge both on the surface and inside', 'it can hold that potential with no charge at all'],
              0,
              'A potential requires charge somewhere. But the field inside a conductor is zero, so a Gaussian surface drawn anywhere in the body encloses nothing — the charge can only be on the surface.',
              EX),
            num('ch2-p15', 'A metal sphere of radius $ 10 $ cm carries a charge of $ 5\\ \\mu\\text{C} $. Find its potential, and the potential at a point $ 5 $ cm from its centre.',
              'Both are $ 4.5\\times10^{5} $ V.',
              'At and outside the surface the sphere behaves as a point charge at its centre:\n\n$ V_{\\text{surface}} = \\frac{kQ}{R} = \\frac{(9\\times10^{9})(5\\times10^{-6})}{0.10} = 4.5\\times10^{5}\\ \\text{V} $\n\nThe point at $ 5 $ cm is **inside** the metal. The field there is zero, so the potential has zero gradient and cannot change — it stays at the surface value, $ 4.5\\times10^{5} $ V.\n\n**The trap** is using $ kQ/r $ with $ r = 0.05 $ m, which would double the answer. Inside a conductor, use $ R $, not $ r $.'),
            mcq('ch2-p16', 'A charged conductor is earthed. Its potential',
              ['becomes zero', 'is unchanged', 'becomes infinite', 'doubles'],
              0,
              'Earth is treated as a fixed reference at zero potential, and charge flows until the conductor matches it. Note this does not always mean losing all its charge — if other charges are nearby, charge may even flow onto it.'),
          ],
        },
        // ── 4 · Capacitance and combinations ────────────────────────────────
        {
          id: 'ch2-s4-combinations',
          title: '4 · Capacitance and combinations',
          blurb: 'Ask what is shared: voltage in parallel, charge in series.',
          items: [
            mcq('ch2-p17', 'The capacitance of a parallel-plate capacitor depends on',
              ['the plate area and separation', 'the charge stored on it', 'the voltage applied to it', 'the metal the plates are made from'],
              0,
              '$ C = \\varepsilon_0A/d $ — geometry and the medium only. Charge and voltage change each other, not $ C $, and the plate material never appears in the formula at all.'),
            num('ch2-p18', 'A $ 3\\ \\mu\\text{F} $ and a $ 6\\ \\mu\\text{F} $ capacitor are connected in series across a $ 90 $ V supply. Find the charge on each and the voltage across each.',
              '$ Q = 180\\ \\mu\\text{C} $ on both; $ V_3 = 60 $ V and $ V_6 = 30 $ V.',
              '$ C_{\\text{eq}} = \\frac{3\\times6}{3+6} = 2\\ \\mu\\text{F} $\n\nIn series both capacitors carry the same charge:\n\n$ Q = C_{\\text{eq}}V = 2 \\times 90 = 180\\ \\mu\\text{C} $\n\nThen $ V_3 = \\frac{180}{3} = 60 $ V and $ V_6 = \\frac{180}{6} = 30 $ V.\n\n**Check:** $ 60 + 30 = 90 $ V. ✓\n\nAnd notice the pattern: the **smaller** capacitor took the **larger** share of the voltage, since $ V \\propto 1/C $ at fixed $ Q $.'),
            mcq('ch2-p19', 'Three identical capacitors of capacitance $ C $ each are connected in parallel. The equivalent capacitance is',
              ['$ 3C $', '$ C/3 $', '$ C $', '$ C^{3} $'],
              0,
              'Parallel capacitances add, giving $ 3C $. Physically, three capacitors side by side are just three times the plate area — and $ C \\propto A $.'),
            num('ch2-p20', 'A parallel-plate capacitor has plates of area $ 200\\ \\text{cm}^{2} $ separated by $ 1.0 $ mm of air. Find its capacitance, and the charge it holds at $ 50 $ V.',
              '$ C = 177 $ pF; $ Q = 8.9 $ nC',
              'Convert first: $ A = 200\\ \\text{cm}^{2} = 200\\times10^{-4}\\ \\text{m}^{2} = 2.0\\times10^{-2}\\ \\text{m}^{2} $.\n\n$ C = \\frac{\\varepsilon_0A}{d} = \\frac{(8.854\\times10^{-12})(2.0\\times10^{-2})}{1.0\\times10^{-3}} = 1.77\\times10^{-10}\\ \\text{F} $\n\nThat is $ 177 $ pF — a picofarad-scale device from plates the size of a postcard, which is a useful feel for how small practical capacitances are.\n\n$ Q = CV = (1.77\\times10^{-10})(50) = 8.9\\times10^{-9}\\ \\text{C} = 8.9\\ \\text{nC} $'),
            mcq('ch2-p21', 'In a **balanced** bridge of five capacitors, the capacitor bridging the two arms',
              ['carries no charge at all', 'carries the largest charge in the network', 'must be equal to the other four', 'short-circuits the source completely'],
              0,
              'Balance means its two ends are at equal potential, so $ V = 0 $ across it and $ Q = CV = 0 $. Its value never enters the answer — which is why testing $ C_1/C_2 = C_3/C_4 $ first can collapse a hard problem into an easy one.'),
            num('ch2-p22', 'A capacitor of $ 4\\ \\mu\\text{F} $ sits in series with a $ 10\\ \\Omega $ resistor across a $ 2.5 $ V battery of internal resistance $ 0.5\\ \\Omega $, with a $ 2\\ \\Omega $ resistor in the other branch. Find the steady-state charge on the capacitor.',
              '$ 8\\ \\mu\\text{C} $',
              '**Step 1 — the steady state.** After a long time no current flows into the capacitor, so **no current flows through the $ 10\\ \\Omega $ resistor in its branch**, and there is no potential drop across it.\n\nSo the voltage across the capacitor is simply the voltage across the $ 2\\ \\Omega $ resistor.\n\n**Step 2 — the current in the rest of the circuit.**\n\n$ I = \\frac{\\varepsilon}{r + R} = \\frac{2.5}{0.5 + 2} = 1\\ \\text{A} $\n\n**Step 3 — the capacitor voltage.**\n\n$ V_C = IR = 1 \\times 2 = 2\\ \\text{V} $\n\n$ Q = CV = 4 \\times 2 = 8\\ \\mu\\text{C} $\n\n**The insight the question is testing:** the $ 10\\ \\Omega $ resistor is a red herring in the steady state. No current, no drop. This is exactly the "capacitor = open circuit" rule doing its work.',
              EX),
          ],
        },
        // ── 5 · Energy ──────────────────────────────────────────────────────
        {
          id: 'ch2-s5-energy',
          title: '5 · Energy stored',
          blurb: 'Pick the form whose fixed quantity you actually have.',
          items: [
            num('ch2-p23', 'A $ 20\\ \\mu\\text{F} $ capacitor is charged to $ 200 $ V. Find the energy stored, and the charge on it.',
              '$ U = 0.4 $ J; $ Q = 4\\times10^{-3} $ C',
              '$ U = \\tfrac{1}{2}CV^{2} = \\tfrac{1}{2}(20\\times10^{-6})(200)^{2} = \\tfrac{1}{2}(20\\times10^{-6})(4\\times10^{4}) = 0.4\\ \\text{J} $\n\n$ Q = CV = (20\\times10^{-6})(200) = 4\\times10^{-3}\\ \\text{C} $\n\nCross-check with a different form: $ \\tfrac{1}{2}QV = \\tfrac{1}{2}(4\\times10^{-3})(200) = 0.4 $ J. ✓'),
            mcq('ch2-p24', 'A capacitor is charged by a battery of emf $ V $, receiving charge $ Q $. The energy stored in the capacitor is',
              ['$ \\tfrac{1}{2}QV $', '$ QV $', '$ 2QV $', '$ \\tfrac{1}{4}QV $'],
              0,
              'The battery does $ QV $, since it holds its voltage constant. But the capacitor voltage rises from zero, so the charge is pushed against an average of $ V/2 $ — and the other half of the battery\'s work is dissipated in the circuit resistance.'),
            num('ch2-p25', 'A $ 6\\ \\mu\\text{F} $ capacitor charged to $ 100 $ V is disconnected and then connected across an uncharged $ 3\\ \\mu\\text{F} $ capacitor. Find the common voltage and the energy lost.',
              '$ V = 66.7 $ V; energy lost $ = 1.0\\times10^{-2} $ J',
              '**Charge is conserved** (the pair is isolated once the battery is gone):\n\n$ Q = (6\\times10^{-6})(100) = 6\\times10^{-4}\\ \\text{C} $\n\n$ V_{\\text{common}} = \\frac{Q}{C_1+C_2} = \\frac{6\\times10^{-4}}{9\\times10^{-6}} = 66.7\\ \\text{V} $\n\n**Energies:**\n\n$ U_i = \\tfrac{1}{2}(6\\times10^{-6})(100)^{2} = 3.0\\times10^{-2}\\ \\text{J} $\n\n$ U_f = \\tfrac{1}{2}(9\\times10^{-6})(66.7)^{2} = 2.0\\times10^{-2}\\ \\text{J} $\n\n$ \\Delta U = 1.0\\times10^{-2}\\ \\text{J} $ lost as heat and radiation in the connecting wires.\n\n**Watch-out:** charge is conserved here, energy is **not**. Equating the two energies is the standard wrong move.'),
            mcq('ch2-p26', 'The energy density of an electric field $ E $ in vacuum is',
              ['$ \\tfrac{1}{2}\\varepsilon_0E^{2} $', '$ \\varepsilon_0E^{2} $', '$ \\tfrac{1}{2}\\varepsilon_0E $', '$ \\tfrac{1}{2}E^{2}/\\varepsilon_0 $'],
              0,
              'Rewriting $ \\tfrac{1}{2}CV^{2} $ for a parallel-plate capacitor in terms of $ E $ and the gap volume gives this, and it applies to any electric field anywhere — not just to capacitors.'),
            num('ch2-p27', 'A parallel-plate capacitor carries charge $ Q $ on plates of area $ A $. Find the force of attraction between the plates, and explain the factor of one half.',
              '$ F = \\frac{Q^{2}}{2\\varepsilon_0A} $',
              'The field in the gap is $ E = \\sigma/\\varepsilon_0 = Q/\\varepsilon_0A $, but that field is produced by **both** plates.\n\nA plate cannot exert a force on itself, so the field acting on one plate is only the half produced by the other, namely $ \\sigma/2\\varepsilon_0 $. Hence\n\n$ F = Q \\times \\frac{\\sigma}{2\\varepsilon_0} = \\frac{Q^{2}}{2\\varepsilon_0A} $\n\n**A second route.** With $ Q $ fixed, $ U = \\frac{Q^{2}d}{2\\varepsilon_0A} $, and $ F = -dU/dd $ gives the same magnitude with a sign showing the plates pull together.'),
            mcq('ch2-p28', 'A charged capacitor is disconnected from its battery and its plates are then moved further apart. The energy stored',
              ['increases', 'decreases', 'is unchanged', 'becomes zero'],
              0,
              'Disconnected means $ Q $ is fixed, so use $ U = Q^{2}/2C $: increasing $ d $ lowers $ C $ and raises $ U $. The extra energy is the work you did pulling the mutually attracting plates apart.'),
          ],
        },
        // ── 6 · Dielectrics and C-R ─────────────────────────────────────────
        {
          id: 'ch2-s6-dielectric-cr',
          title: '6 · Dielectrics and C-R circuits',
          blurb: 'Establish the battery state first. Then the table writes itself.',
          items: [
            mcq('ch2-p29', 'A dielectric slab is inserted into a capacitor that stays connected to its battery. Which quantity is unchanged?',
              ['the potential difference', 'the charge on the plates', 'the capacitance', 'the stored energy'],
              0,
              'The battery pins $ V $. The capacitance rises by $ K $, and therefore so do the charge ($ Q = CV $) and the energy ($ \\tfrac{1}{2}CV^{2} $), with the battery supplying the extra.'),
            mcq('ch2-p30', 'A charged capacitor is **disconnected** from its battery, and a slab of dielectric constant $ K $ is inserted. The potential difference',
              ['falls by a factor $ K $', 'rises by a factor $ K $', 'is unchanged', 'falls to zero'],
              0,
              'Disconnected means $ Q $ is fixed. The slab raises $ C $ by $ K $, so $ V = Q/C $ drops by $ K $. The energy drops by $ K $ too — the missing energy went into pulling the slab in.'),
            num('ch2-p31', 'A parallel-plate capacitor is filled with two dielectric slabs in series: thickness $ d_1 $ with constant $ K_1 $, and thickness $ d_2 $ with constant $ K_2 $. Find the single effective dielectric constant $ K $ for the combination of total thickness $ d = d_1 + d_2 $.',
              '$ K = \\frac{K_1K_2(d_1+d_2)}{K_1d_2 + K_2d_1} $',
              'The two layers are stacked in the gap, so they carry the same charge and their voltages add — a **series** combination.\n\n$ \\frac{1}{C} = \\frac{d_1}{K_1\\varepsilon_0A} + \\frac{d_2}{K_2\\varepsilon_0A} = \\frac{1}{\\varepsilon_0A}\\left(\\frac{d_1}{K_1}+\\frac{d_2}{K_2}\\right) $\n\nWe want the single $ K $ such that $ C = \\frac{K\\varepsilon_0A}{d_1+d_2} $. Equating:\n\n$ \\frac{d_1+d_2}{K} = \\frac{d_1}{K_1}+\\frac{d_2}{K_2} = \\frac{K_2d_1 + K_1d_2}{K_1K_2} $\n\n$ K = \\frac{K_1K_2(d_1+d_2)}{K_1d_2 + K_2d_1} $\n\n**Check it:** put $ K_1 = K_2 = K_0 $ and it collapses to $ K_0 $, as it must.',
              EX),
            mcq('ch2-p32', 'A dielectric slab is inserted into a charged, **isolated** capacitor. The slab is',
              ['pulled into the gap', 'pushed out of the gap', 'unaffected', 'pulled in only if $ K > 2 $'],
              0,
              'The system moves towards lower energy, and $ U = Q^{2}/2C $ falls as the slab goes in and raises $ C $. The fringing field at the plate edges provides the actual inward pull. The slab is drawn in whether or not the battery is connected — only the energy bookkeeping differs.'),
            num('ch2-p33', 'A $ 25\\ \\mu\\text{F} $ capacitor discharges through a $ 40\\ \\text{k}\\Omega $ resistor. Find the time constant, and the fraction of charge remaining after $ 2 $ s.',
              '$ \\tau = 1 $ s; about $ 13.5\\% $ remains.',
              '$ \\tau = CR = (25\\times10^{-6})(40\\times10^{3}) = 1\\ \\text{s} $\n\nAfter $ t = 2\\ \\text{s} = 2\\tau $:\n\n$ \\frac{q}{q_0} = e^{-2} = 0.135 $\n\nSo about **13.5%** of the original charge is left — which is a lot. It takes about $ 5\\tau $, here five seconds, before the remaining charge drops below 1%.'),
            mcq('ch2-p34', 'A long time after a switch is closed, a capacitor in a DC circuit behaves as',
              ['an open circuit', 'a short circuit', 'a resistor', 'a source of emf'],
              0,
              'Fully charged means no further charge flows onto it, so no current passes through that branch — exactly like a break in the wire. It is a short circuit only at $ t = 0 $, and only if it started uncharged.'),
            mcq('ch2-p35', 'In a C-R circuit, the time constant $ \\tau = CR $ has the units of',
              ['seconds', 'farads', 'ohms', 'coulombs'],
              0,
              'Farad × ohm = (C/V)(V/A) = C/A = seconds. It has to be a time, because the exponent $ t/\\tau $ must be dimensionless.'),
            num('ch2-p36', 'A capacitor with a dielectric of constant $ K = 5 $ and dielectric strength $ 2\\times10^{7} $ V/m has plates $ 0.5 $ mm apart and area $ 100\\ \\text{cm}^{2} $. Find its capacitance and the maximum voltage it can withstand.',
              '$ C = 885 $ pF; $ V_{\\max} = 10^{4} $ V',
              '$ A = 100\\ \\text{cm}^{2} = 1.0\\times10^{-2}\\ \\text{m}^{2} $\n\n$ C = \\frac{K\\varepsilon_0A}{d} = \\frac{5(8.854\\times10^{-12})(1.0\\times10^{-2})}{0.5\\times10^{-3}} = 8.85\\times10^{-10}\\ \\text{F} $\n\nThat is $ 885 $ pF.\n\nFor the voltage limit, the field must stay below the dielectric strength, and $ E = V/d $:\n\n$ V_{\\max} = E_{\\max}d = (2\\times10^{7})(0.5\\times10^{-3}) = 10^{4}\\ \\text{V} $\n\n**Note the design tension.** Making $ d $ smaller raises $ C $ but lowers $ V_{\\max} $ in exactly the same proportion. Every real capacitor is a chosen point on that trade-off, which is why they are sold with both a capacitance and a voltage rating.'),
            mcq('ch2-p37', 'A capacitor is charged by closing key $ K_1 $, then $ K_1 $ is opened and $ K_2 $ is closed, connecting it to a second uncharged capacitor. After the transfer,',
              ['both reach the same potential difference', 'both end up carrying equal charges', 'the total energy is unchanged by the transfer', 'the first capacitor keeps the whole of its charge'],
              0,
              'Connected in parallel, they must share one potential difference. Their charges are then in the ratio of their capacitances, not equal. Total charge is conserved; total **energy** is not — some is always lost in the connecting wires.',
              EX),
            mcq('ch2-p38', 'A capacitor stays connected to its battery while its plates are pulled apart. Which statement is right?',
              ['$ V $ stays the same and $ Q $ decreases', '$ Q $ stays the same and $ V $ increases', 'both $ Q $ and $ V $ stay the same', '$ V $ stays the same and $ Q $ increases'],
              0,
              'The battery pins $ V $. Increasing $ d $ reduces $ C = \\varepsilon_0A/d $, so $ Q = CV $ falls and charge flows back into the battery. The "$ Q $ fixed, $ V $ rises" answer is what happens when the battery is disconnected first — a different experiment.',
              EX),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That is Chapter 2 finished. Charge has been sitting still for two whole chapters. Next: what happens when we stop letting it settle.',
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
