'use strict';
/**
 * Class 12 Physics · Ch.5 "Magnetic Effects of Current" — page 16,
 * Practice & Mastery.
 *
 * Items marked source 'ncert_exemplar' are adapted from NCERT Exemplar Physics
 * Class 12 ch.4 ("Moving Charges and Magnetism"). Everything else is 'mcq'.
 *
 * Run: node scripts/physics12-book/build_ch5_d_practice.js
 */
const { b, mcq, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 5;
const EX = 'ncert_exemplar';

const p16 = {
  page_number: 16,
  slug: 'magnetic-effects-practice-and-mastery',
  title: 'Practice & Mastery',
  subtitle: 'Six sections, thirty-six problems — and a direction to state on every one',
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Two habits are worth more than any formula on this page.\n\n**State the direction, every time**, even when the question only asks for a magnitude. Direction errors cost more marks in this chapter than anything else, and the discipline of always writing it down is what stops them.\n\n**Work in the fixed order:** geometry of $ \\vec{v}\\times\\vec{B} $ first, sign of the charge second, perpendicularity check third. Never all at once.',
    }),
    b('practice_bank', 1, {
      title: 'Magnetic Effects of Current — the full set',
      intro: 'Sections follow the chapter in order. Commit to an answer, with a direction, before revealing.',
      sections: [
        // ── 1 · Force on a moving charge ─────────────────────────────────────
        {
          id: 'ch5-s1-force',
          title: '1 · Force on a moving charge',
          blurb: 'Perpendicular to everything, and it never does work.',
          items: [
            mcq('ch5-p01', 'A magnetic force can never change a charged particle\'s',
              ['kinetic energy', 'direction of motion', 'momentum', 'path'],
              0,
              'The force is always perpendicular to the velocity, so $ \\vec{F}\\cdot d\\vec{s} = 0 $ and no work is done. Momentum and direction certainly change — momentum is a vector, and turning it changes it.'),
            num('ch5-p02', 'A proton moves with velocity $ \\vec{v} = (3\\times10^{6}\\,\\hat{i})\\ \\text{m/s} $ in a field $ \\vec{B} = (0.4\\,\\hat{k})\\ \\text{T} $. Find the force on it, and verify it is perpendicular to $ \\vec{v} $.',
              '$ \\vec{F} = (-1.92\\times10^{-13}\\,\\hat{j})\\ \\text{N} $',
              '$ \\vec{v}\\times\\vec{B} = (3\\times10^{6}\\,\\hat{i})\\times(0.4\\,\\hat{k}) = (1.2\\times10^{6})(\\hat{i}\\times\\hat{k}) $\n\nAnd $ \\hat{i}\\times\\hat{k} = -\\hat{j} $ (worth memorising — it is the one that catches people, since the cyclic order is $ \\hat{i}\\times\\hat{j}=\\hat{k} $, $ \\hat{j}\\times\\hat{k}=\\hat{i} $, $ \\hat{k}\\times\\hat{i}=\\hat{j} $).\n\n$ \\vec{v}\\times\\vec{B} = -1.2\\times10^{6}\\,\\hat{j} $\n\n$ \\vec{F} = q(\\vec{v}\\times\\vec{B}) = (1.6\\times10^{-19})(-1.2\\times10^{6}\\,\\hat{j}) = -1.92\\times10^{-13}\\,\\hat{j}\\ \\text{N} $\n\n**Check:** $ \\vec{F}\\cdot\\vec{v} = 0 $, since $ \\vec{F} $ is purely $ \\hat{j} $ and $ \\vec{v} $ purely $ \\hat{i} $. ✓ Do that check on every component-form answer.'),
            mcq('ch5-p03', 'A charged particle travels through a region of uniform magnetic field without being deflected. Assuming no electric field is present,',
              ['its velocity is along the field', 'the field must be zero', 'the particle must be neutral', 'its speed must be very high'],
              0,
              'With $ F = qvB\\sin\\theta $, the only remaining possibility is $ \\sin\\theta = 0 $. Note that speed is irrelevant — a faster particle is deflected *more*, not less.'),
            num('ch5-p04', 'An electron moves due **east** through a magnetic field directed vertically **downward**. In which direction is the force on it?',
              'Due south.',
              'Work in components — with compass directions it is far safer than trying to twist your hand into the right orientation.\n\nTake a right-handed set: east $ = \\hat{i} $, north $ = \\hat{j} $, up $ = \\hat{k} $. Then $ \\vec{v} = v\\hat{i} $ and $ \\vec{B} = -B\\hat{k} $ (downward).\n\n**Step 1 — $ \\vec{v}\\times\\vec{B} $, charge ignored.**\n\n$ \\vec{v}\\times\\vec{B} = (v\\hat{i})\\times(-B\\hat{k}) = -vB\\,(\\hat{i}\\times\\hat{k}) = -vB(-\\hat{j}) = +vB\\,\\hat{j} $\n\nusing $ \\hat{i}\\times\\hat{k} = -\\hat{j} $. So $ \\vec{v}\\times\\vec{B} $ points **north**.\n\n**Step 2 — the charge.** An electron is negative, so the force is **opposite** to that: due **south**.\n\n**Step 3 — check.** South is perpendicular to both east and down. ✓\n\nThe sign flip in step 2 is the step people drop, and it inverts the answer completely.'),
            mcq('ch5-p05', 'The magnetic force on a moving charge is maximum when the angle between $ \\vec{v} $ and $ \\vec{B} $ is',
              ['$ 90^\\circ $', '$ 0^\\circ $', '$ 180^\\circ $', '$ 45^\\circ $'],
              0,
              '$ F \\propto \\sin\\theta $, which peaks at $ 90^\\circ $. At $ 0^\\circ $ and $ 180^\\circ $ the force vanishes and the particle travels straight.'),
          ],
        },
        // ── 2 · Circular and helical paths ───────────────────────────────────
        {
          id: 'ch5-s2-paths',
          title: '2 · Circular paths, helices and the cyclotron',
          blurb: 'Radius from the perpendicular component; period from neither.',
          items: [
            num('ch5-p06', 'A proton of kinetic energy $ 1.0 $ MeV moves perpendicular to a field of $ 0.50 $ T. Find the radius of its path. Take $ m_p = 1.67\\times10^{-27} $ kg.',
              '$ r \\approx 0.29 $ m',
              'Convert the energy: $ K = 1.0\\ \\text{MeV} = (10^{6})(1.6\\times10^{-19}) = 1.6\\times10^{-13} $ J.\n\nUse the energy form of the radius:\n\n$ r = \\frac{\\sqrt{2mK}}{qB} = \\frac{\\sqrt{2(1.67\\times10^{-27})(1.6\\times10^{-13})}}{(1.6\\times10^{-19})(0.50)} $\n\nNumerator: $ \\sqrt{5.34\\times10^{-40}} = 2.31\\times10^{-20} $\n\nDenominator: $ 8.0\\times10^{-20} $\n\n$ r = 0.29\\ \\text{m} $\n\n**Why the energy form is worth knowing.** You could find $ v $ first and then use $ mv/qB $, but that is two steps and two chances to slip. When the question gives an energy, use $ \\sqrt{2mK}/qB $ directly.'),
            mcq('ch5-p07', 'The period of a charged particle circling in a uniform magnetic field',
              ['is independent of its speed', 'increases with its speed', 'decreases with its speed', 'depends on the path radius'],
              0,
              'A faster particle travels a proportionally larger circle, so the extra distance cancels the extra speed: $ T = 2\\pi m/qB $ contains neither $ v $ nor $ r $. This is precisely what makes a fixed-frequency cyclotron possible.'),
            num('ch5-p08', 'A charged particle enters a uniform field of $ 0.20 $ T at $ 30^\\circ $ to it with speed $ 5.0\\times10^{5} $ m/s. Its charge-to-mass ratio is $ 1.0\\times10^{7} $ C/kg. Find the radius and pitch of its helical path.',
              '$ r = 0.125 $ m; pitch $ = 1.36 $ m',
              '**Resolve first, always.**\n\n$ v_{\\perp} = v\\sin 30^\\circ = 2.5\\times10^{5}\\ \\text{m/s} $\n\n$ v_{\\parallel} = v\\cos 30^\\circ = 4.33\\times10^{5}\\ \\text{m/s} $\n\n**Radius — perpendicular component:**\n\n$ r = \\frac{mv_{\\perp}}{qB} = \\frac{v_{\\perp}}{(q/m)B} = \\frac{2.5\\times10^{5}}{(1.0\\times10^{7})(0.20)} = 0.125\\ \\text{m} $\n\n**Period — neither component:**\n\n$ T = \\frac{2\\pi m}{qB} = \\frac{2\\pi}{(1.0\\times10^{7})(0.20)} = 3.14\\times10^{-6}\\ \\text{s} $\n\n**Pitch — parallel component:**\n\n$ p = v_{\\parallel}T = (4.33\\times10^{5})(3.14\\times10^{-6}) = 1.36\\ \\text{m} $\n\nA helix of radius $ 12.5 $ cm advancing $ 1.36 $ m per turn — long and stretched. **Note the trick of dividing by $ q/m $** rather than needing $ q $ and $ m $ separately.'),
            mcq('ch5-p09', 'In a cyclotron, the particle gains energy from',
              ['the electric field in the gap', 'the magnetic field inside the dees', 'both fields, in equal measure', 'the magnetic field across the gap'],
              0,
              'A magnetic force never does work, so it cannot change the energy — it only bends the path. All the acceleration happens at the gap, where the alternating electric field acts.'),
            num('ch5-p10', 'A cyclotron has dees of radius $ 0.40 $ m in a field of $ 1.2 $ T, accelerating deuterons (charge $ e $, mass $ 2m_p $). Find the resonance frequency and the maximum energy in MeV.',
              '$ f = 9.2 $ MHz; $ K_{\\max} \\approx 5.5 $ MeV',
              '**Frequency:**\n\n$ f = \\frac{qB}{2\\pi m} = \\frac{(1.6\\times10^{-19})(1.2)}{2\\pi(2\\times1.67\\times10^{-27})} = \\frac{1.92\\times10^{-19}}{2.10\\times10^{-26}} $\n\n$ f = 9.15\\times10^{6}\\ \\text{Hz} \\approx 9.2\\ \\text{MHz} $\n\n**Maximum energy:**\n\n$ K_{\\max} = \\frac{q^{2}B^{2}R^{2}}{2m} = \\frac{(1.6\\times10^{-19})^{2}(1.2)^{2}(0.40)^{2}}{2(3.34\\times10^{-27})} $\n\nNumerator: $ (2.56\\times10^{-38})(1.44)(0.16) = 5.90\\times10^{-39} $\n\n$ K_{\\max} = \\frac{5.90\\times10^{-39}}{6.68\\times10^{-27}} = 8.83\\times10^{-13}\\ \\text{J} $\n\nIn MeV: $ \\frac{8.83\\times10^{-13}}{1.6\\times10^{-19}} = 5.5\\times10^{6}\\ \\text{eV} = 5.5\\ \\text{MeV} $\n\n**Note that the accelerating voltage never appeared** — the maximum energy is set by $ B $ and $ R $ alone. A bigger voltage would only reach the same energy in fewer turns.'),
            mcq('ch5-p11', 'A velocity selector uses crossed fields $ E $ and $ B $. The particles that pass undeflected have speed',
              ['$ E/B $', '$ B/E $', '$ EB $', '$ \\sqrt{EB} $'],
              0,
              'Setting $ qE = qvB $ gives $ v = E/B $, with the charge cancelling. Check the units: V/m divided by T gives m/s, which none of the others do.'),
          ],
        },
        // ── 3 · Forces on wires ──────────────────────────────────────────────
        {
          id: 'ch5-s3-wires',
          title: '3 · Forces on wires',
          blurb: 'Only the end-to-end vector matters in a uniform field.',
          items: [
            num('ch5-p12', 'A straight wire of length $ 25 $ cm carrying $ 3.0 $ A lies at $ 30^\\circ $ to a uniform field of $ 0.40 $ T. Find the force on it.',
              '$ 0.15 $ N, perpendicular to both the wire and the field.',
              '$ F = BIl\\sin\\theta = (0.40)(3.0)(0.25)\\sin 30^\\circ $\n\n$ = (0.40)(3.0)(0.25)(0.5) = 0.15\\ \\text{N} $\n\nDirection: perpendicular to the plane containing the wire and the field, by Fleming\'s left-hand rule.\n\n**Always state the direction** even when only a magnitude is asked — the habit is what prevents errors when a later part of the question depends on it.'),
            mcq('ch5-p13', 'A wire bent into a semicircle of radius $ R $ carries current $ I $ in a uniform field $ B $ perpendicular to its plane. The force on it is',
              ['$ 2BIR $', '$ \\pi BIR $', 'zero', '$ 2\\pi BIR $'],
              0,
              'The effective length is the straight vector joining its ends — the diameter $ 2R $ — not the arc length $ \\pi R $. In a uniform field the shape between the endpoints makes no difference to the force.'),
            mcq('ch5-p14', 'The net force on a closed current loop in a **uniform** magnetic field is',
              ['zero, whatever its shape', 'zero only if it is circular', 'proportional to its perimeter', 'directed along the field'],
              0,
              'A closed loop ends where it begins, so its effective length vector is zero. It does experience a **torque**, and in a **non-uniform** field it experiences a net force as well — which is why a magnet attracts a coil.'),
            num('ch5-p15', 'Two long parallel wires $ 8.0 $ cm apart carry $ 10 $ A and $ 15 $ A in opposite directions. Find the force per unit length between them and say whether it is attractive or repulsive.',
              '$ 3.75\\times10^{-4} $ N/m, repulsive.',
              '$ \\frac{F}{l} = \\frac{\\mu_0I_1I_2}{2\\pi d} = \\frac{(2\\times10^{-7})(10)(15)}{0.080} = \\frac{3.0\\times10^{-5}}{0.080} $\n\n$ = 3.75\\times10^{-4}\\ \\text{N/m} $\n\nThe currents are in **opposite** directions, so the force is **repulsive**.\n\nRemember the rule and remember that it is the reverse of electrostatics: parallel currents attract, antiparallel repel — whereas like charges repel.'),
            mcq('ch5-p16', 'Two long parallel wires carry currents in the same direction. They',
              ['attract each other', 'repel each other', 'exert no force on each other', 'exert forces along their lengths'],
              0,
              'Each wire sits in the other\'s magnetic field, and $ I\\vec{l}\\times\\vec{B} $ comes out attractive for parallel flow. It is deliberately the opposite of what two like charges do.'),
            num('ch5-p17', 'A horizontal wire of mass per unit length $ 2.0\\times10^{-4} $ kg/m floats in equilibrium above a second long wire carrying $ 25 $ A, at a separation of $ 5.0 $ cm. What current does the floating wire carry, and in what sense?',
              '$ I \\approx 19.6 $ A, flowing **opposite** to the current in the fixed wire.',
              'For the wire to float, the magnetic force must be **repulsive** and must support its weight — so the currents are antiparallel.\n\nPer unit length:\n\n$ \\frac{\\mu_0I_1I_2}{2\\pi d} = \\lambda g $\n\n$ I_2 = \\frac{\\lambda g\\,d}{(2\\times10^{-7})I_1} = \\frac{(2.0\\times10^{-4})(9.8)(0.050)}{(2\\times10^{-7})(25)} $\n\nNumerator: $ 9.8\\times10^{-5} $. Denominator: $ 5.0\\times10^{-6} $.\n\n$ I_2 = 19.6\\ \\text{A} $\n\n**And note that the equilibrium is only half stable.** Displaced downward, the repulsion (going as $ 1/d $) strengthens and pushes it back. Displaced upward, the repulsion weakens and gravity wins. It will not survive a nudge upward.'),
          ],
        },
        // ── 4 · Biot–Savart, wires, loops ────────────────────────────────────
        {
          id: 'ch5-s4-biotsavart',
          title: '4 · Fields from currents',
          blurb: 'Fraction of a circle for arcs; radial segments contribute nothing.',
          items: [
            num('ch5-p18', 'A long straight wire carries $ 8.0 $ A. Find the field at a perpendicular distance of $ 4.0 $ cm, and state its direction.',
              '$ 4.0\\times10^{-5} $ T, circling the wire (anticlockwise seen from the current coming towards you).',
              '$ B = \\frac{\\mu_0I}{2\\pi d} = \\frac{(2\\times10^{-7})(8.0)}{0.040} = \\frac{1.6\\times10^{-6}}{0.040} $\n\n$ B = 4.0\\times10^{-5}\\ \\text{T} $\n\nAbout the same as the Earth\'s field — which is why a compass placed there would deflect by roughly $ 45^\\circ $. This is Oersted\'s experiment in numbers.\n\nDirection by the right-hand grip rule: thumb along the current, fingers give the field, which circles the wire.'),
            mcq('ch5-p19', 'The magnetic field at the centre of a circular loop of radius $ R $ carrying current $ I $ is',
              ['$ \\frac{\\mu_0I}{2R} $', '$ \\frac{\\mu_0I}{2\\pi R} $', '$ \\frac{\\mu_0I}{4\\pi R} $', '$ \\frac{\\mu_0I}{R} $'],
              0,
              'Every element is the same distance $ R $ away and perpendicular to the line to the centre, so the integral reduces to the circumference. The version with $ 2\\pi R $ is the long-straight-wire result — a different geometry.'),
            num('ch5-p20', 'A wire carries current $ I $ along a three-quarter circle of radius $ R $, the two ends joined to the centre by radial straight segments. Find the field at the centre.',
              '$ B = \\frac{3\\mu_0I}{8R} $',
              '**The radial segments contribute nothing.** Each lies along a line through the centre, so every element has $ \\sin\\theta = 0 $ and the Biot–Savart contribution vanishes.\n\n**The arc contributes its fraction of a full loop.** Three-quarters of a circle gives three-quarters of $ \\frac{\\mu_0I}{2R} $:\n\n$ B = \\frac{3}{4}\\cdot\\frac{\\mu_0I}{2R} = \\frac{3\\mu_0I}{8R} $\n\n**The general method:** identify the fraction of a circle, take that fraction of $ \\mu_0I/2R $, and ignore any radial straight pieces.'),
            mcq('ch5-p21', 'A current element produces zero magnetic field at points',
              ['lying along its own line', 'perpendicular to it', 'very far from it', 'in the plane containing it'],
              0,
              'There $ \\theta = 0 $ or $ 180^\\circ $, so $ \\sin\\theta = 0 $. It follows that the field at a point on the extension of a finite straight wire is exactly zero.'),
            num('ch5-p22', 'Two long parallel wires $ 30 $ cm apart carry $ 9.0 $ A and $ 3.0 $ A in the same direction. Where between them is the net field zero?',
              '$ 22.5 $ cm from the $ 9 $ A wire (that is, $ 7.5 $ cm from the $ 3 $ A wire).',
              '**Region first.** With parallel currents, the two fields oppose **between** the wires, so cancellation is possible there.\n\nLet the point be $ x $ from the $ 9 $ A wire. Equating magnitudes — everything cancels except currents and distances:\n\n$ \\frac{9}{x} = \\frac{3}{0.30-x} $\n\n$ 9(0.30-x) = 3x \\quad\\Rightarrow\\quad 2.7 = 12x \\quad\\Rightarrow\\quad x = 0.225\\ \\text{m} $\n\nSo it is $ 22.5 $ cm from the $ 9 $ A wire and $ 7.5 $ cm from the $ 3 $ A wire — **nearer the smaller current**, as it must be.\n\n**Contrast with antiparallel currents:** the fields would then add between the wires and cancel only *outside*, beyond the smaller current.'),
            num('ch5-p23', 'A circular coil of $ 100 $ turns and radius $ 5.0 $ cm carries $ 2.0 $ A. Find the field at its centre, and at a point $ 12 $ cm from the centre along its axis.',
              'Centre: $ 2.5\\times10^{-3} $ T. On the axis: $ 1.4\\times10^{-4} $ T.',
              '**At the centre:**\n\n$ B = \\frac{\\mu_0NI}{2R} = \\frac{(4\\pi\\times10^{-7})(100)(2.0)}{2(0.050)} = \\frac{2.51\\times10^{-4}}{0.10} $\n\n$ B = 2.5\\times10^{-3}\\ \\text{T} $\n\n**On the axis at $ x = 0.12 $ m:**\n\n$ B = \\frac{\\mu_0NIR^{2}}{2(R^{2}+x^{2})^{3/2}} $\n\n$ R^{2}+x^{2} = 0.0025 + 0.0144 = 0.0169 $, so $ (R^{2}+x^{2})^{3/2} = (0.0169)^{1.5} = 2.20\\times10^{-3} $\n\n$ B = \\frac{(4\\pi\\times10^{-7})(100)(2.0)(0.0025)}{2(2.20\\times10^{-3})} = \\frac{6.28\\times10^{-7}}{4.40\\times10^{-3}} $\n\n$ B = 1.4\\times10^{-4}\\ \\text{T} $\n\nRoughly **eighteen times weaker** than at the centre — because $ x $ is well over twice $ R $, so the field is already heading towards its far-field $ 1/x^{3} $ dipole behaviour.'),
          ],
        },
        // ── 5 · Ampère, solenoid, toroid ─────────────────────────────────────
        {
          id: 'ch5-s5-ampere',
          title: "5 · Ampère's law, solenoids and toroids",
          blurb: 'Turns per metre for a solenoid; total turns for a toroid.',
          items: [
            mcq('ch5-p24', "In Ampère's circuital law, the current on the right-hand side is",
              ['only the current threading the loop', 'the total current in the circuit', 'the current in the nearest wire', 'the current outside the loop'],
              0,
              'Only currents passing through the loop enter $ I_{\\text{enc}} $. Currents outside contribute zero net circulation — although they do still contribute to the field at every point on the loop.'),
            num('ch5-p25', 'A solenoid $ 40 $ cm long has $ 800 $ turns and carries $ 3.0 $ A. Find the field at its centre and at one end.',
              'Centre: $ 7.5\\times10^{-3} $ T. End: $ 3.8\\times10^{-3} $ T.',
              '**Turns per metre first** — this is the step that is most often missed:\n\n$ n = \\frac{800}{0.40} = 2000\\ \\text{turns/m} $\n\n**At the centre:**\n\n$ B = \\mu_0 nI = (4\\pi\\times10^{-7})(2000)(3.0) = 7.5\\times10^{-3}\\ \\text{T} $\n\n**At one end**, the field is half the interior value:\n\n$ B_{\\text{end}} = \\tfrac{1}{2}\\mu_0 nI = 3.8\\times10^{-3}\\ \\text{T} $\n\n**Using the total 800 turns instead of $ n = 2000 $** would give a fifth of the right answer. Always divide by the length and check that $ n $ has units of per-metre.'),
            mcq('ch5-p26', 'The magnetic field inside a long solenoid depends on',
              ['the turns per metre and the current', 'the total turns and the current', 'the radius of the solenoid', 'your distance from the axis'],
              0,
              '$ B = \\mu_0 nI $ contains only $ n $ and $ I $. Neither the radius nor your position inside appears — which is exactly what makes the interior field uniform and useful.'),
            num('ch5-p27', 'A toroid of mean radius $ 20 $ cm has $ 4000 $ turns and carries $ 2.5 $ A. Find the field along the mean circumference.',
              '$ 1.0\\times10^{-2} $ T',
              '$ B = \\frac{\\mu_0NI}{2\\pi r} = \\frac{(2\\times10^{-7})(4000)(2.5)}{0.20} = \\frac{2.0\\times10^{-3}}{0.20} $\n\n$ B = 1.0\\times10^{-2}\\ \\text{T} $\n\n**Note the $ N $ here is the TOTAL turns**, unlike the solenoid formula which needs turns per metre. Cross-check via the solenoid route: $ n = 4000/(2\\pi\\times0.20) = 3183 $ per metre, and $ \\mu_0nI = (4\\pi\\times10^{-7})(3183)(2.5) = 1.0\\times10^{-2} $ T ✓'),
            mcq('ch5-p28', 'The magnetic field outside an ideal toroid is',
              ['exactly zero', 'equal to the field inside', 'half the field inside', 'inversely proportional to the distance'],
              0,
              'A loop through the central hole encloses no current, and one outside the whole toroid encloses every turn twice in opposite senses. Both give zero circulation — which is why a toroid confines its flux and transformer cores are ring-shaped.'),
            num('ch5-p29', 'Inside a thick straight wire of radius $ R $ carrying a uniformly distributed current $ I $, find the field at $ r = R/2 $ and compare it with the field at $ r = 2R $.',
              'At $ R/2 $: $ \\frac{\\mu_0I}{4\\pi R} $. At $ 2R $: $ \\frac{\\mu_0I}{4\\pi R} $ — they are equal.',
              '**Inside** ($ r<R $): an Amperean circle of radius $ r $ encloses $ I r^{2}/R^{2} $, giving\n\n$ B = \\frac{\\mu_0 I r}{2\\pi R^{2}} $\n\nAt $ r = R/2 $: $ B = \\frac{\\mu_0I}{4\\pi R} $.\n\n**Outside** ($ r>R $): $ B = \\frac{\\mu_0I}{2\\pi r} $.\n\nAt $ r = 2R $: $ B = \\frac{\\mu_0I}{4\\pi R} $.\n\n**They are exactly equal** — a neat coincidence of this geometry, and a satisfying check on both formulas. The field rises linearly to a maximum of $ \\mu_0I/2\\pi R $ at the surface, then falls as $ 1/r $, and these two points sit symmetrically either side of that peak.'),
          ],
        },
        // ── 6 · Dipoles, torque and the galvanometer ─────────────────────────
        {
          id: 'ch5-s6-galvanometer',
          title: '6 · Current loops, torque and meters',
          blurb: 'Every Chapter 4 dipole formula, now with $ m = NIA $.',
          items: [
            mcq('ch5-p30', 'The magnetic dipole moment of a coil of $ N $ turns, area $ A $, carrying current $ I $ is',
              ['$ NIA $', '$ IA/N $', '$ NI/A $', '$ N^{2}IA $'],
              0,
              'Each turn contributes $ IA $ and $ N $ turns give $ NIA $, directed along the loop normal by the right-hand rule. The unit A·m² confirms it.'),
            num('ch5-p31', 'A rectangular coil of $ 200 $ turns and dimensions $ 10\\ \\text{cm} \\times 8.0\\ \\text{cm} $ carries $ 1.5 $ A in a uniform field of $ 0.25 $ T. Find the maximum torque on it.',
              '$ 0.60 $ N·m',
              '$ A = (0.10)(0.080) = 8.0\\times10^{-3}\\ \\text{m}^{2} $\n\n$ m = NIA = (200)(1.5)(8.0\\times10^{-3}) = 2.4\\ \\text{A·m}^{2} $\n\n$ \\tau_{\\max} = mB = (2.4)(0.25) = 0.60\\ \\text{N·m} $\n\n**The maximum is at $ \\theta = 90^\\circ $**, where the loop\'s normal is perpendicular to the field — which means the loop\'s **plane contains** the field. A coil already aligned with the field feels no torque at all.'),
            mcq('ch5-p32', 'The torque on a current loop in a uniform field is maximum when the **plane** of the loop is',
              ['parallel to the field', 'perpendicular to the field', 'at $ 45^\\circ $ to the field', 'independent of orientation'],
              0,
              '$ \\tau = mB\\sin\\theta $ with $ \\theta $ between the **normal** and the field. Maximum torque needs $ \\theta = 90^\\circ $, which puts the normal across the field and therefore the plane along it. Measuring $ \\theta $ from the plane instead of the normal is the classic slip.'),
            mcq('ch5-p33', 'The pole pieces of a moving-coil galvanometer are made concave in order to',
              ['make the field radial at the coil', 'strengthen the permanent magnet', 'reduce the weight of the instrument', 'shield the coil from external fields'],
              0,
              'A radial field keeps the coil\'s plane always containing the field, so $ \\sin\\theta = 1 $ at every orientation and the deflection is proportional to the current. Without it the scale would be badly non-linear.'),
            num('ch5-p34', 'A galvanometer of resistance $ 50\\ \\Omega $ gives full-scale deflection at $ 2.0 $ mA. Convert it into (a) an ammeter reading to $ 5.0 $ A and (b) a voltmeter reading to $ 10 $ V.',
              '(a) shunt $ S = 0.020\\ \\Omega $ in parallel; (b) multiplier $ R = 4950\\ \\Omega $ in series.',
              '**(a) Ammeter — small shunt in parallel:**\n\n$ S = \\frac{I_gG}{I-I_g} = \\frac{(2.0\\times10^{-3})(50)}{5.0-2.0\\times10^{-3}} = \\frac{0.10}{4.998} = 0.020\\ \\Omega $\n\n**(b) Voltmeter — large multiplier in series:**\n\n$ R = \\frac{V}{I_g}-G = \\frac{10}{2.0\\times10^{-3}}-50 = 5000-50 = 4950\\ \\Omega $\n\n**The contrast is the point.** One instrument at $ 0.02\\ \\Omega $ and another at $ 5000\\ \\Omega $, from the same movement — because an ammeter goes in series and must be near-zero, while a voltmeter goes in parallel and must be near-infinite.'),
            mcq('ch5-p35', 'Increasing the number of turns of a galvanometer coil, using the same wire,',
              ['raises the current sensitivity only', 'raises both of the sensitivities', 'raises the voltage sensitivity only', 'changes neither of the sensitivities'],
              0,
              'Current sensitivity $ = NAB/k \\propto N $, so it rises. But more turns of the same wire also raises $ G $ in proportion, and voltage sensitivity $ = NAB/kG $ — so the two effects cancel. This is why the two are separate specifications.'),
            mcq('ch5-p36', 'An ideal ammeter and an ideal voltmeter have, respectively,',
              ['zero and infinite resistance', 'infinite and zero resistance', 'zero resistance in both cases', 'infinite resistance in both cases'],
              0,
              'An ammeter is inserted in series, so any resistance of its own would reduce the current it is reading. A voltmeter sits in parallel, so any current it draws would reduce the voltage it is reading.'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That is the electromagnetism block complete — five chapters, from charges that do not move to the meter that measures the ones that do.\n\nThe question left open is Faraday\'s: a current makes a magnetic field, so does a **changing** magnetic field make a current? The answer is Chapter 6, and it is the foundation of every generator on Earth.',
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
