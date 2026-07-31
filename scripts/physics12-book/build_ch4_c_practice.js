'use strict';
/**
 * Class 12 Physics · Ch.4 "Magnetic Properties of Matter" — page 10,
 * Practice & Mastery.
 *
 * Items marked source 'ncert_exemplar' are adapted from NCERT Exemplar Physics
 * Class 12 ch.5 ("Magnetism and Matter"). Everything else is source 'mcq'.
 *
 * Run: node scripts/physics12-book/build_ch4_c_practice.js
 */
const { b, mcq, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 4;
const EX = 'ncert_exemplar';

const p10 = {
  page_number: 10,
  slug: 'magnetic-properties-practice-and-mastery',
  title: 'Practice & Mastery',
  subtitle: 'Five sections, thirty-two problems — and one running analogy to exploit',
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Most of this chapter was Chapter 1 in different clothing, so use that.\n\nWhen a question asks about a bar magnet\'s field, torque or energy, write down the **electric** result you already know and substitute $ \\vec{p}\\to\\vec{m} $, $ \\vec{E}\\to\\vec{B} $, $ \\frac{1}{4\\pi\\varepsilon_0}\\to\\frac{\\mu_0}{4\\pi} $. You will have the answer before you have finished reading the question.\n\nThe genuinely new material is the last two sections — the Earth, and what matter does in a field.',
    }),
    b('practice_bank', 1, {
      title: 'Magnetic Properties of Matter — the full set',
      intro: 'Sections follow the chapter in order. Attempt each one to a committed answer before revealing.',
      sections: [
        // ── 1 · Poles and moments ───────────────────────────────────────────
        {
          id: 'ch4-s1-poles',
          title: '1 · Poles, monopoles and dipole moments',
          blurb: 'Everything here follows from poles never coming alone.',
          items: [
            mcq('ch4-p01', 'A bar magnet is cut into three equal pieces perpendicular to its length. The magnetic moment of each piece is',
              ['$ m/3 $', '$ m $', '$ 3m $', '$ m/9 $'],
              0,
              'The pole strength is unchanged by a perpendicular cut, but the length is divided by three. More generally, $ n $ equal pieces each carry $ m/n $ however you cut — because each holds a fraction $ 1/n $ of the atomic moments.'),
            num('ch4-p02', 'Explain why the net magnetic flux through any closed surface is always exactly zero, whereas the electric flux is not.',
              'Because magnetic field lines form closed loops — there is no magnetic charge for them to start or end on.',
              'Electric field lines begin on positive charges and end on negative ones, so a closed surface can contain a source or a sink, and the flux measures it: $ \\oint\\vec{E}\\cdot d\\vec{S} = q_{\\text{in}}/\\varepsilon_0 $.\n\nMagnetic field lines have nowhere to begin or end, because isolated poles do not exist. Every line that enters a closed surface must therefore leave it, and the net flux is zero:\n\n$ \\oint\\vec{B}\\cdot d\\vec{S} = 0 $\n\n**Note what this does not depend on.** It holds whether or not a magnet is inside, and even if the surface encloses "only a north pole" — because the lines emerging from that pole are the same ones passing back through the magnet\'s body.'),
            mcq('ch4-p03', 'The SI unit of magnetic dipole moment is',
              ['A·m$ ^{2} $', 'A·m', 'A/m', 'weber'],
              0,
              'From $ m = NIA $ — an ampere times an area. Note that A·m is pole strength and A/m is magnetisation; checking units is the quickest way to keep the three apart when notation varies between books.'),
            num('ch4-p04', 'A circular coil of $ 200 $ turns and radius $ 5.0 $ cm carries a current of $ 0.40 $ A. Find its magnetic dipole moment.',
              '$ 0.63\\ \\text{A·m}^{2} $',
              '$ m = NIA = NI(\\pi r^{2}) $\n\n$ = (200)(0.40)\\pi(0.050)^{2} = (80)\\pi(2.5\\times10^{-3}) $\n\n$ = (80)(7.85\\times10^{-3}) = 0.63\\ \\text{A·m}^{2} $\n\n**Convert before squaring.** $ 5.0\\ \\text{cm} = 0.050 $ m, and it is squared, so leaving it in centimetres would be wrong by $ 10^{4} $.'),
            mcq('ch4-p05', 'Inside a bar magnet, the magnetic field lines run',
              ['from the south pole to the north pole', 'from the north pole to the south pole', 'radially outward', 'nowhere — the field inside is zero'],
              0,
              'Outside they run N to S, so to close the loop they must run S to N through the material. That continuity is what distinguishes magnetic field lines from electric ones.'),
            num('ch4-p06', 'A magnetic needle is free to rotate in a vertical plane which contains the magnetic meridian. Where on Earth would it point vertically downward, and where would it lie horizontal?',
              'Vertically downward at the magnetic north pole; horizontal at the magnetic equator.',
              'A needle free to swing in the vertical plane of the magnetic meridian aligns itself with the **total** field, so it reads the dip directly.\n\n**At the magnetic north pole** the field is entirely vertical ($ \\delta = 90^\\circ $), and it points into the ground there — so the needle\'s north end dips vertically downward.\n\n**At the magnetic equator** the field is entirely horizontal ($ \\delta = 0 $), so the needle lies flat.\n\n**In between** it takes the intermediate dip angle — about $ 42^\\circ $ in Delhi.\n\nThis is exactly what a dip circle measures, and it is why an ordinary horizontally pivoted compass is useless near the poles: there is no horizontal component left for it to respond to.',
              EX),
          ],
        },
        // ── 2 · Field of a bar magnet ───────────────────────────────────────
        {
          id: 'ch4-s2-field',
          title: '2 · The field of a bar magnet',
          blurb: 'Axial, equatorial, factor of two — all translated from Chapter 1.',
          items: [
            num('ch4-p07', 'A short bar magnet of moment $ 0.32\\ \\text{A·m}^{2} $ is placed with its axis along the magnetic meridian. Find the field at a point $ 20 $ cm from its centre on its axis.',
              '$ 8.0\\times10^{-6} $ T, directed along $ \\vec{m} $.',
              '$ B = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2m}{d^{3}} = (10^{-7})\\cdot\\frac{2(0.32)}{(0.20)^{3}} $\n\n$ (0.20)^{3} = 8.0\\times10^{-3} $, so\n\n$ B = (10^{-7})\\cdot\\frac{0.64}{8.0\\times10^{-3}} = (10^{-7})(80) = 8.0\\times10^{-6}\\ \\text{T} $\n\nDirected **parallel to $ \\vec{m} $**, i.e. from S towards N.\n\nFor scale, that is about a fifth of the Earth\'s field — so a compass at that distance would still point roughly north, but noticeably deflected.'),
            mcq('ch4-p08', 'At the same distance from a short bar magnet, the axial field compared with the equatorial field is',
              ['twice as large, and oppositely directed', 'half as large, and in the same direction', 'equal in both magnitude and direction', 'four times as large, oppositely directed'],
              0,
              'The axial field is $ \\frac{\\mu_0}{4\\pi}\\frac{2m}{d^{3}} $ and parallel to $ \\vec{m} $; the equatorial field is half that and antiparallel to $ \\vec{m} $. Both facts carry over unchanged from the electric dipole, because the derivation used only the geometry of two poles.'),
            num('ch4-p09', 'At a point on the axis of a short bar magnet, a distance $ d $ away, the field is $ B $. Find the field at a distance $ 2d $ on the equatorial line.',
              '$ B/16 $, antiparallel to $ \\vec{m} $.',
              'Take the two changes separately.\n\n**Position:** axial to equatorial at the same distance divides by 2, giving $ B/2 $.\n\n**Distance:** the dipole field goes as $ 1/d^{3} $, so doubling $ d $ divides by $ 8 $.\n\nTogether: $ B/(2\\times8) = B/16 $.\n\n**Direction:** equatorial fields are antiparallel to $ \\vec{m} $, so the sense reverses.\n\nThis is the same problem you did in Chapter 1 for an electric dipole, with identical arithmetic — which is exactly the point of the analogy.'),
            mcq('ch4-p10', 'The exact axial field of a bar magnet contains the factor $ (d^{2}-l^{2})^{2} $, while the equatorial field contains $ (d^{2}+l^{2})^{3/2} $. The difference in sign arises because',
              ['the poles are equidistant on the equator but not on the axis', 'the axial field is simply the stronger of the two', 'the two poles have different pole strengths', 'the equatorial field is measured a different way'],
              0,
              'On the axis the poles sit at $ d-l $ and $ d+l $, and the difference of their fields produces the $ (d^{2}-l^{2}) $ factor. On the perpendicular bisector both are at $ \\sqrt{d^{2}+l^{2}} $, giving the plus sign. The algebra is simply remembering the geometry.'),
          ],
        },
        // ── 3 · Torque, energy and oscillation ──────────────────────────────
        {
          id: 'ch4-s3-torque',
          title: '3 · Torque, energy and oscillation',
          blurb: 'A compass needle is a dipole finding its minimum energy.',
          items: [
            num('ch4-p11', 'A bar magnet of moment $ 0.50\\ \\text{A·m}^{2} $ is held at $ 30^\\circ $ to a uniform field of $ 0.20 $ T. Find the torque on it, and the work needed to rotate it to $ 90^\\circ $.',
              '$ \\tau = 0.050 $ N·m; $ W = 0.087 $ J',
              '**Torque:**\n\n$ \\tau = mB\\sin\\theta = (0.50)(0.20)\\sin 30^\\circ = (0.10)(0.5) = 0.050\\ \\text{N·m} $\n\n**Work from $ 30^\\circ $ to $ 90^\\circ $:**\n\n$ W = mB(\\cos\\theta_1 - \\cos\\theta_2) = (0.10)(\\cos 30^\\circ - \\cos 90^\\circ) $\n\n$ = (0.10)(0.866 - 0) = 0.087\\ \\text{J} $\n\n**Check the sign.** Going from $ 30^\\circ $ towards $ 90^\\circ $ moves *away* from the stable position, so the work must be positive — it is. Rotating back the other way would give a negative answer.'),
            mcq('ch4-p12', 'A bar magnet in a **non-uniform** magnetic field experiences',
              ['both a net force and a torque', 'a torque but no net force', 'a net force but no torque', 'neither force nor torque'],
              0,
              'The two poles sit in different field strengths, so the forces no longer cancel. The "torque but no force" result belongs specifically to a uniform field — and it is why a magnet attracts an iron nail rather than merely twisting it.'),
            num('ch4-p13', 'A magnet of moment $ 1.2\\ \\text{A·m}^{2} $ and moment of inertia $ 7.5\\times10^{-5}\\ \\text{kg·m}^{2} $ makes $ 10 $ oscillations in $ 16 $ s in a uniform field. Find the field strength.',
              '$ B \\approx 1.2\\times10^{-3} $ T',
              '**Period first:** $ T = 16/10 = 1.6 $ s.\n\n$ T = 2\\pi\\sqrt{\\frac{\\mathcal{I}}{mB}} \\quad\\Rightarrow\\quad B = \\frac{4\\pi^{2}\\mathcal{I}}{mT^{2}} $\n\n$ B = \\frac{4\\pi^{2}(7.5\\times10^{-5})}{(1.2)(1.6)^{2}} = \\frac{2.96\\times10^{-3}}{3.07} $\n\n$ B = 9.6\\times10^{-4} \\approx 1.0\\times10^{-3}\\ \\text{T} $\n\n**Always divide the total time by the number of oscillations.** Since $ B \\propto 1/T^{2} $, a timing error in $ T $ is doubled in $ B $ — which is exactly why you time ten swings rather than one.'),
            mcq('ch4-p14', 'The period of small oscillations of a suspended magnet is $ T $. Moved to a field nine times stronger, its period becomes',
              ['$ T/3 $', '$ 3T $', '$ T/9 $', '$ 9T $'],
              0,
              '$ T \\propto 1/\\sqrt{B} $, so a ninefold field gives a period smaller by $ \\sqrt{9} = 3 $. A stronger field means a larger restoring torque, so the magnet snaps back faster.'),
            mcq('ch4-p15', 'The work required to rotate a magnet from its stable orientation to its unstable orientation in a uniform field $ B $ is',
              ['$ 2mB $', '$ mB $', 'zero', '$ mB/2 $'],
              0,
              'Stable means $ U = -mB $ and unstable $ U = +mB $, so the change is $ 2mB $. That is the largest work any rotation of the magnet can require.'),
          ],
        },
        // ── 4 · Earth's magnetism ───────────────────────────────────────────
        {
          id: 'ch4-s4-earth',
          title: "4 · Earth's magnetism",
          blurb: 'Three elements, one vector. Always check $ B^2 = B_H^2 + B_V^2 $.',
          items: [
            num('ch4-p16', 'At a place the horizontal component of the Earth\'s field is $ 0.36 $ G and the dip is $ 60^\\circ $. Find the total field and the vertical component.',
              '$ B = 0.72 $ G; $ B_V = 0.62 $ G',
              '$ B = \\frac{B_H}{\\cos\\delta} = \\frac{0.36}{\\cos 60^\\circ} = \\frac{0.36}{0.5} = 0.72\\ \\text{G} $\n\n$ B_V = B\\sin\\delta = (0.72)(0.866) = 0.62\\ \\text{G} $\n\n**Check:** $ \\sqrt{(0.36)^{2}+(0.62)^{2}} = \\sqrt{0.130+0.384} = \\sqrt{0.514} = 0.717 \\approx 0.72 $ ✓\n\nAnd the total must exceed either component — which rules out the commonest error of multiplying where you should divide.'),
            mcq('ch4-p17', 'At the magnetic poles of the Earth, the angle of dip is',
              ['$ 90^\\circ $', '$ 0^\\circ $', '$ 45^\\circ $', 'undefined'],
              0,
              'The field there is entirely vertical, so it makes a right angle with the horizontal and $ B_H = 0 $. This is why an ordinary compass fails at the poles even though the total field is strongest there.'),
            num('ch4-p18', 'At a certain place the dip is $ 45^\\circ $ and the total field is $ 4.8\\times10^{-5} $ T. Find the horizontal and vertical components.',
              'Both are $ 3.4\\times10^{-5} $ T.',
              'At $ \\delta = 45^\\circ $, $ \\cos\\delta = \\sin\\delta = 1/\\sqrt{2} $, so the two components are equal:\n\n$ B_H = B_V = \\frac{4.8\\times10^{-5}}{\\sqrt{2}} = 3.4\\times10^{-5}\\ \\text{T} $\n\n**Check:** $ \\sqrt{2}\\times(3.4\\times10^{-5}) = 4.8\\times10^{-5} $ ✓\n\nA useful shortcut: $ \\tan\\delta = B_V/B_H $, so $ \\delta = 45^\\circ $ is exactly the latitude where the two components are equal.'),
            mcq('ch4-p19', 'The geographic north pole of the Earth is, magnetically speaking,',
              ['a south pole', 'a north pole', 'neither, since the field is vertical there', 'a neutral point'],
              0,
              'It has to be a magnetic south pole, because it attracts the **north** end of a compass needle — and unlike poles attract. The Earth\'s internal dipole therefore points south-to-north in the opposite sense to what the naming suggests.'),
            num('ch4-p20', 'A bar magnet of moment $ 0.36\\ \\text{A·m}^{2} $ lies on a table with its north pole pointing north. Neutral points are found $ 15 $ cm from its centre. Find the horizontal component of the Earth\'s field.',
              '$ B_H = 1.07\\times10^{-5} $ T',
              '**Which formula?** The magnet points **north**, so its equatorial field opposes $ B_H $ and the neutral points lie on the **perpendicular bisector**. Use the equatorial expression — no factor of 2.\n\n$ B_H = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{m}{d^{3}} = (10^{-7})\\cdot\\frac{0.36}{(0.15)^{3}} $\n\n$ (0.15)^{3} = 3.375\\times10^{-3} $, so\n\n$ B_H = (10^{-7})(106.7) = 1.07\\times10^{-5}\\ \\text{T} $\n\n**Establish the geometry before choosing the formula.** Had the magnet pointed south, the neutral points would be on the **axis** and the factor of 2 would apply — doubling the answer.'),
            mcq('ch4-p21', 'A compass needle deflects by $ 45^\\circ $ when a magnet\'s field acts perpendicular to the Earth\'s horizontal field. The magnet\'s field at the needle is',
              ['equal to $ B_H $', 'twice as large as $ B_H $', 'half as large as $ B_H $', 'zero at that point'],
              0,
              'The tangent law gives $ B = B_H\\tan\\theta $, and $ \\tan 45^\\circ = 1 $. This is also the most sensitive working point of a tangent galvanometer, since $ \\tan\\theta $ changes fastest with angle there.'),
          ],
        },
        // ── 5 · Magnetic materials ──────────────────────────────────────────
        {
          id: 'ch4-s5-materials',
          title: '5 · Magnetic materials',
          blurb: 'The sign and size of $ \\chi $ decides everything.',
          items: [
            mcq('ch4-p22', 'The relation between relative permeability and magnetic susceptibility is',
              ['$ \\mu_r = 1 + \\chi $', '$ \\mu_r = \\chi $', '$ \\mu_r = 1 - \\chi $', '$ \\mu_r = 1/\\chi $'],
              0,
              'It follows directly from $ B = \\mu_0(H+M) $ with $ M = \\chi H $. The "1" is the vacuum contribution, and for a diamagnet with $ \\chi \\approx -10^{-5} $ it is essentially the whole answer.'),
            num('ch4-p23', 'A solenoid produces a magnetising field of $ 800 $ A/m. It is filled with a material of susceptibility $ 599 $. Find the magnetisation and the magnetic field inside.',
              '$ M = 4.79\\times10^{5} $ A/m; $ B = 0.60 $ T',
              '$ M = \\chi H = (599)(800) = 4.79\\times10^{5}\\ \\text{A/m} $\n\n$ \\mu_r = 1 + \\chi = 600 $, so\n\n$ B = \\mu_0\\mu_rH = (4\\pi\\times10^{-7})(600)(800) = (1.257\\times10^{-6})(4.8\\times10^{5}) $\n\n$ B = 0.60\\ \\text{T} $\n\n**Check it the other way:** $ B = \\mu_0(H+M) = (1.257\\times10^{-6})(800 + 479\\,000) = (1.257\\times10^{-6})(4.798\\times10^{5}) = 0.60 $ T ✓\n\nWithout the material, $ B $ would have been only $ 1.0\\times10^{-3} $ T — the core has multiplied it 600 times.'),
            mcq('ch4-p24', 'A diamagnetic material placed in a non-uniform magnetic field moves towards',
              ['the weaker part of the field', 'the stronger part of the field', 'neither — it stays where it is', 'the nearest pole'],
              0,
              'Its induced moment opposes the applied field, so the interaction is repulsive and it is pushed away from the strong-field region. A paramagnet, whose permanent moments align *with* the field, does the opposite.'),
            num('ch4-p25', 'A paramagnetic salt has susceptibility $ 3.6\\times10^{-4} $ at $ 300 $ K. Find its susceptibility at $ 150 $ K.',
              '$ 7.2\\times10^{-4} $',
              'Curie\'s law: $ \\chi \\propto 1/T $, so\n\n$ \\frac{\\chi_2}{\\chi_1} = \\frac{T_1}{T_2} = \\frac{300}{150} = 2 $\n\n$ \\chi_2 = 2(3.6\\times10^{-4}) = 7.2\\times10^{-4} $\n\n**Cooling increases susceptibility**, because there is less thermal agitation opposing the field\'s alignment. If your answer comes out smaller on cooling, the ratio is the wrong way up. And $ T $ must be **absolute**.'),
            mcq('ch4-p26', 'Which property is independent of temperature?',
              ['diamagnetic susceptibility', 'paramagnetic susceptibility', 'ferromagnetic susceptibility', 'the Curie constant of a paramagnet'],
              0,
              'Diamagnetism arises from an induced moment created by the field itself, with no competition against thermal disorder — so heating changes nothing. Both paramagnetic and ferromagnetic behaviour fall off as the temperature rises.'),
            num('ch4-p27', 'An unmagnetised iron bar is heated above its Curie temperature and cooled again in zero field. Is it magnetised? What if it is cooled in a strong field?',
              'In zero field: no. Cooled in a field: yes, strongly.',
              'Above $ T_c $ the cooperative interaction fails, the domains dissolve, and the iron is merely paramagnetic.\n\n**Cooled in zero field:** the domains reform below $ T_c $, but with nothing to tell them which way to point they form in random orientations and cancel. You get unmagnetised iron back.\n\n**Cooled in a strong field:** the domains form preferentially along that field, and the bar emerges strongly magnetised. **This is how permanent magnets are made.**\n\nIt is also how the Earth\'s magnetic history was read: molten rock cooling through its Curie point froze in the field direction of that moment, and those stripes on the ocean floor revealed that the Earth\'s field has reversed many times.'),
            mcq('ch4-p28', 'Above the Curie temperature, a ferromagnetic material becomes',
              ['paramagnetic', 'diamagnetic', 'more strongly ferromagnetic', 'completely non-magnetic'],
              0,
              'Thermal agitation destroys the domain alignment, but the individual atoms keep their permanent moments — which is precisely a paramagnet, and it then obeys Curie\'s law.'),
            mcq('ch4-p29', 'A superconductor below its critical temperature behaves as',
              ['a perfect diamagnet', 'a perfect paramagnet', 'a very strong ferromagnet', 'an ordinary non-magnetic material'],
              0,
              'It expels the field entirely rather than merely weakening it, so $ \\mu_r = 1+\\chi = 0 $ and $ B = 0 $ inside. This is the Meissner effect, and it is why a magnet levitates stably above a cooled superconductor.'),
            num('ch4-p30', 'The area of the hysteresis loop of a material is $ 250 $ J/m³ per cycle. A transformer core of volume $ 2.0\\times10^{-3}\\ \\text{m}^{3} $ made of it runs at $ 50 $ Hz. Find the power lost to hysteresis.',
              '$ 25 $ W',
              'Energy lost per cycle $ = $ (loop area) $ \\times $ (volume):\n\n$ E = (250)(2.0\\times10^{-3}) = 0.50\\ \\text{J per cycle} $\n\nAt $ 50 $ cycles per second:\n\n$ P = (0.50)(50) = 25\\ \\text{W} $\n\n**Why this drives material choice.** 25 W of pure waste heat, continuously, in a small core — and it scales with the loop area. A hard magnetic material with ten times the loop area would give 250 W and cook the transformer. This is the whole reason cores are soft iron or silicon steel.'),
            mcq('ch4-p31', 'For a permanent magnet, the material should have',
              ['high retentivity and high coercivity', 'low retentivity and low coercivity', 'high retentivity and low coercivity', 'low retentivity and high coercivity'],
              0,
              'High retentivity means it keeps a strong magnetisation when the field is removed, and high coercivity means a stray field cannot easily erase it. The reverse combination — a thin loop — is what a transformer core needs.'),
            mcq('ch4-p32', 'An unmagnetised piece of iron nevertheless contains fully aligned domains. It shows no external magnetism because',
              ['the domains point in different directions and cancel', 'the atomic moments within each domain are random', 'its susceptibility is zero', 'it has no atomic magnetic moments'],
              0,
              'Alignment within a domain is essentially perfect — that is what defines a domain. What cancels is the domains against one another, which is why so little applied field is needed to magnetise iron: the alignment work is already done.'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That is Chapter 4 finished. One promise is still outstanding — that a current loop is a magnetic dipole with $ m = NIA $. The next chapter pays it, starting from the force on a single moving charge.',
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p10]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
