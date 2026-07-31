'use strict';
/**
 * Class 12 Physics · Ch.6 "Electromagnetic Induction" — page 16, Practice & Mastery.
 *
 * Every item carries source 'mcq' (no badge). Nothing here is attributed to a
 * third-party reference book (standing no-third-party-attribution rule), and
 * nothing is badged 'ncert_exemplar' because none of it was transcribed from
 * the Exemplar — inventing that badge would be a false provenance claim.
 * The genuine NCERT end-of-chapter exercises are page 17, built separately.
 *
 * Run: node scripts/physics12-book/build_ch6_d_practice.js
 */
const { b, mcq, num, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 6;

const p16 = {
  page_number: 16,
  slug: 'emi-practice-and-mastery',
  title: 'Practice & Mastery',
  subtitle: 'Seven sections, thirty-nine problems — work them before you look',
  page_type: 'lesson',
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'How to use this page.\n\nInduction is a topic where reading a solution feels like understanding and almost never is. Nearly every mark lost in this chapter is a **sign** or a **direction**, and you only find out that your sign sense is wrong by committing to an answer first.\n\nSo for each item: decide the direction out loud, write the number down, and only then open the solution. If you were right for the wrong reason, the explanation will catch you.',
    }),
    b('practice_bank', 1, {
      title: 'Electromagnetic Induction — the full set',
      intro: 'The sections follow the chapter in order, from flux through to the generator. Numerical items ask you to produce the answer yourself; in the multiple-choice items every wrong option is a mistake somebody actually makes, so read them all before choosing.',
      sections: [
        // ── 1 · Flux and Faraday's law ───────────────────────────────────────
        {
          id: 'ch6-s1-flux-faraday',
          title: "1 · Flux and Faraday's law",
          blurb: 'Get the angle right, then differentiate. Almost every slip here is one of those two.',
          items: [
            mcq('ch6-p01', 'A flat coil of area $ 0.05 $ m² sits in a uniform field of $ 0.40 $ T. The field makes an angle of $ 60^\\circ $ with the **plane** of the coil. The flux through it is',
              ['$ 1.73 \\times 10^{-2} $ Wb', '$ 1.00 \\times 10^{-2} $ Wb', '$ 2.00 \\times 10^{-2} $ Wb', 'zero'],
              0,
              'The formula is $ \\Phi = BA\\cos\\theta $, and $ \\theta $ is the angle between the field and the **normal** to the coil — not the angle with the coil surface. Here the field is at $ 60^\\circ $ to the plane, so it is at $ 30^\\circ $ to the normal.\n\n$ \\Phi = (0.40)(0.05)\\cos 30^\\circ = 0.020 \\times 0.866 = 1.73\\times10^{-2} $ Wb.\n\nUsing $ \\cos 60^\\circ $ instead gives $ 1.00\\times10^{-2} $ Wb — that is the single commonest error in this chapter. Read every flux question twice and ask: plane, or normal?'),
            num('ch6-p02', 'A coil of $ 50 $ turns and radius $ 10 $ cm lies with its plane perpendicular to a uniform magnetic field. The field grows steadily from $ 0.20 $ T to $ 0.60 $ T in $ 0.10 $ s. Find the magnitude of the induced emf.',
              '$ \\varepsilon = 6.3 $ V',
              'The field is perpendicular to the plane of the coil, so it is **along** the normal and $ \\cos\\theta = 1 $.\n\nArea: $ A = \\pi r^{2} = \\pi (0.10)^{2} = 3.14\\times10^{-2} $ m².\n\nRate of change of flux through one turn:\n\n$ \\frac{d\\Phi}{dt} = A\\,\\frac{dB}{dt} = (3.14\\times10^{-2})\\times\\frac{0.40}{0.10} = 0.126 $ Wb/s\n\nNow put the turns in:\n\n$ \\varepsilon = N\\,\\frac{d\\Phi}{dt} = 50 \\times 0.126 = 6.3 $ V\n\nThe $ N $ is not decoration. Each turn is a separate loop the same flux threads, and their emfs add in series.'),
            mcq('ch6-p03', 'A circular loop lies in a **steady** uniform magnetic field and is spun at constant speed about one of its diameters. The flux through it changes because',
              ['the angle between the field and the normal changes', 'the strength of the magnetic field is changing', 'the area enclosed by the loop is changing', 'nothing changes — $ B $ and $ A $ are both constant'],
              0,
              'Three quantities sit inside $ \\Phi = BA\\cos\\theta $, and any one of them changing induces an emf. Here $ B $ is steady and the loop is rigid, so $ A $ is fixed too — but the normal sweeps round as the loop turns, so $ \\cos\\theta $ runs through a full cycle.\n\nThis is exactly the mechanism the AC generator at the end of the chapter runs on. Getting into the habit of asking "which of the three is changing?" before writing anything down will save you in the harder items later.'),
            num('ch6-p04', 'The magnetic flux through a single-turn loop varies with time as $ \\Phi = (3t^{2} + 2t + 1) $ mWb. Find the magnitude of the induced emf at $ t = 2 $ s.',
              '$ \\varepsilon = 14 $ mV',
              'Faraday\u2019s law wants the **rate of change**, so differentiate:\n\n$ \\frac{d\\Phi}{dt} = (6t + 2) $ mWb/s\n\nAt $ t = 2 $ s: $ \\frac{d\\Phi}{dt} = 12 + 2 = 14 $ mWb/s, so $ \\varepsilon = 14 $ mV.\n\nTwo things worth noticing. The constant $ 1 $ mWb vanishes on differentiation — a big steady flux induces nothing. And the emf here is growing with time, because $ \\Phi $ curves upward; a flux graph that is a straight line would give a constant emf instead.'),
            mcq('ch6-p05', 'An emf of exactly $ 1 $ volt is induced in a single-turn loop. This tells you that the flux through the loop is changing at',
              ['1 weber per second', '1 weber', '1 tesla per second', '1 volt-metre per second'],
              0,
              'Faraday\u2019s law with $ N = 1 $ reads $ \\varepsilon = \\frac{d\\Phi}{dt} $, so a volt **is** a weber per second. That equivalence is worth memorising: it lets you check any induction answer by units alone.\n\nA rate in tesla per second is not enough on its own — you would still need the area to turn it into a flux rate.'),
            num('ch6-p06', 'A square loop of side $ 10 $ cm has $ 100 $ turns and total resistance $ 5.0\\ \\Omega $. A perpendicular field falls uniformly from $ 0.50 $ T to zero in $ 0.20 $ s. Find (a) the induced emf, (b) the induced current, and (c) the total charge that flows through the loop.',
              '(a) $ 2.5 $ V  (b) $ 0.50 $ A  (c) $ 0.10 $ C',
              'Area: $ A = (0.10)^{2} = 1.0\\times10^{-2} $ m², so the flux change per turn is $ \\Delta\\Phi = (0.50)(1.0\\times10^{-2}) = 5.0\\times10^{-3} $ Wb.\n\n**(a)** $ \\varepsilon = N\\,\\frac{\\Delta\\Phi}{\\Delta t} = 100 \\times \\frac{5.0\\times10^{-3}}{0.20} = 2.5 $ V\n\n**(b)** $ i = \\frac{\\varepsilon}{R} = \\frac{2.5}{5.0} = 0.50 $ A\n\n**(c)** $ q = i\\,\\Delta t = 0.50 \\times 0.20 = 0.10 $ C\n\n**The part worth keeping.** Write the charge out symbolically:\n\n$ q = \\frac{\\varepsilon}{R}\\Delta t = \\frac{N\\Delta\\Phi}{R\\Delta t}\\Delta t = \\frac{N\\Delta\\Phi}{R} $\n\nThe time cancels. The **charge** that flows depends only on how much the flux changed and on the resistance — not on how fast you did it. Collapse the field in one millisecond or in one hour and the same $ 0.10 $ C goes round. That is why a ballistic instrument can measure a field by yanking a coil out of it and simply counting charge.'),
          ],
        },
        // ── 2 · Lenz's law and direction ─────────────────────────────────────
        {
          id: 'ch6-s2-lenz',
          title: "2 · Lenz\u2019s law and direction",
          blurb: 'The rule is "oppose the CHANGE", not "oppose the flux". Half these items exist to make that difference bite.',
          items: [
            mcq('ch6-p07', 'The north pole of a bar magnet is pulled **away** from the face of a coil. Looking at the coil from the magnet\u2019s side, the induced current flows',
              ['clockwise, making that face a south pole', 'anticlockwise, making that face a north pole', 'clockwise, making that face a north pole', 'there is no current until the magnet stops moving'],
              0,
              'Work through it in the fixed order.\n\n**Flux direction:** the north pole sends field lines away from itself, so inside the coil the flux points away from the magnet.\n\n**Growing or shrinking?** The magnet is retreating, so that flux is **shrinking**.\n\n**Oppose the change:** the induced current must try to keep the flux going, so its own field inside the coil points the same way as before — away from the magnet. That makes the coil\u2019s far face a north pole and the near face a **south** pole.\n\n**Sanity check:** a south pole attracts the receding north pole, pulling it back. It opposes the motion, as it must.\n\nSeen from the magnet, a face that is a south pole has the current running clockwise. The trap here is to assume "magnet and coil always repel" — they repel on approach and attract on retreat.'),
            mcq('ch6-p08', 'A square conducting loop is moving at constant velocity and is at this instant **entirely inside** a large region of uniform magnetic field. The induced current in the loop is',
              ['zero, because the flux through it is not changing', 'clockwise, because the loop is moving', 'anticlockwise, because the loop is moving', 'non-zero only if the loop is accelerating'],
              0,
              'Faraday\u2019s law responds to $ \\frac{d\\Phi}{dt} $, and nothing else. While the loop is fully immersed in a uniform field, the same amount of flux threads it at every instant no matter how fast it travels — so no emf, no current.\n\nSomething does happen at the boundaries: current flows while the loop is entering, stops while it is fully inside, and flows the other way while it is leaving. Motion alone is not the trigger; **changing flux** is.'),
            mcq('ch6-p09', 'A closed copper ring is dropped so that it falls along the axis of a fixed vertical bar magnet, approaching the magnet\u2019s north pole from above. While it is falling towards the magnet its downward acceleration is',
              ['less than $ g $', 'exactly $ g $', 'greater than $ g $', 'zero'],
              0,
              'The flux through the ring is growing as it nears the pole. By Lenz\u2019s law the induced current opposes that growth, and the only way it can is by pushing the ring back **upward**, away from the magnet. So the ring has gravity down and a magnetic force up: the net acceleration is smaller than $ g $.\n\nEnergy tells you the same thing without any geometry. The ring is dissipating heat in its own resistance, and that energy has to come from somewhere — the only bank is its gravitational potential energy, so it must arrive at the bottom slower than a freely falling object.'),
            mcq('ch6-p10', 'The same copper ring is now given a narrow **cut**, so that it is no longer a closed loop, and dropped again along the same path. It falls with acceleration',
              ['exactly $ g $, though an emf is still induced', 'less than $ g $, as before', 'greater than $ g $, because the cut concentrates the field', 'exactly $ g $, and no emf is induced at all'],
              0,
              'Separate the two ideas that this item deliberately runs together.\n\nAn **emf** is induced whenever the flux through the ring changes, and cutting the ring does nothing to the flux — so the emf is exactly what it was, and a voltmeter across the gap would read it.\n\nA **current** needs a complete path. With the gap there is none, so no current flows, no magnetic force appears, and the ring falls freely at $ g $.\n\nEmf is what induction produces. Current is what the circuit is willing to let happen with it. Keep them apart and this chapter gets much easier.'),
            mcq('ch6-p11', 'A loop lies in the plane of the page in a magnetic field that points **out of the page** and is steadily **decreasing**. The induced current in the loop is',
              ['anticlockwise, to keep the outward flux going', 'clockwise, to oppose the outward flux', 'clockwise, because the field points out of the page', 'zero, because the field direction is not changing'],
              0,
              'The instinctive answer is "the flux is out of the page, so oppose it — go clockwise". That would be right if the flux were **growing**. It is shrinking.\n\nLenz\u2019s law opposes the **change**. The change here is a loss of outward flux, so the induced current fights the loss by producing more outward flux of its own — which, by the right-hand rule, means an **anticlockwise** current.\n\nA reliable habit: write the two words "growing" or "shrinking" on your rough sheet before you decide any direction. Most direction errors in this chapter are made by students who never wrote that word down.'),
            num('ch6-p12', 'Suppose Lenz\u2019s law had the opposite sign, so that the induced current **aided** the change in flux instead of opposing it. Describe what would happen if you nudged a magnet slightly towards a coil, and say which physical principle this rules out.',
              'You would get a runaway: the coil would pull the magnet in ever harder, producing heat and kinetic energy from nothing. It is forbidden by conservation of energy.',
              'Push the magnet a little way towards the coil. With the sign reversed, the induced current would help the flux grow — so the coil would **attract** the magnet, pulling it in faster. Faster motion means a larger $ \\frac{d\\Phi}{dt} $, a larger current, a stronger pull, and so on without limit.\n\nThe result is a machine that, after one gentle nudge, delivers unlimited kinetic energy **and** unlimited heat in the coil\u2019s resistance, with nothing supplied from outside. That is a perpetual-motion machine, and it is exactly what conservation of energy forbids.\n\n**So the minus sign is not an extra rule bolted onto Faraday\u2019s law.** It is conservation of energy expressed in the language of circuits. Whenever you are unsure of a direction, ask which choice makes you do work — that one is right.'),
          ],
        },
        // ── 3 · Motional EMF ────────────────────────────────────────────────
        {
          id: 'ch6-s3-motional',
          title: '3 · Motional EMF',
          blurb: 'Two questions decide every one of these: which length is the length, and who is paying for the power.',
          items: [
            num('ch6-p13', 'An aeroplane with a wingspan of $ 20 $ m flies horizontally at $ 300 $ m/s at a place where the vertical component of the Earth\u2019s magnetic field is $ 5.0\\times10^{-5} $ T. Find the potential difference between its wingtips.',
              '$ \\varepsilon = 0.30 $ V',
              'The wing is a conducting rod of length $ l = 20 $ m sweeping through a field. Only the field component **perpendicular** to the plane swept by the rod matters, and for horizontal flight with a horizontal wing that is the **vertical** component:\n\n$ \\varepsilon = B_v v l = (5.0\\times10^{-5})(300)(20) = 0.30 $ V\n\nA third of a volt across the wings of every aircraft in the sky, permanently. It drives no current, because the wingtips are not joined by any circuit — which is exactly the emf-without-current point from the cut ring in the last section.'),
            mcq('ch6-p14', 'A straight conducting rod of length $ l $ rotates in a plane about one of its ends with angular velocity $ \\omega $, in a uniform field $ B $ perpendicular to that plane. The emf between its ends is',
              ['$ \\frac{1}{2}B\\omega l^{2} $', '$ B\\omega l^{2} $', '$ \\frac{1}{2}B\\omega l $', '$ 2B\\omega l^{2} $'],
              0,
              'You cannot use $ \\varepsilon = Bvl $ straight off, because $ v $ is different at every point of the rod: zero at the pivot and $ \\omega l $ at the tip.\n\nTake a small piece at distance $ x $ from the pivot. It moves at $ v = \\omega x $ and contributes $ d\\varepsilon = B(\\omega x)\\,dx $. Add them up:\n\n$ \\varepsilon = \\int_0^{l} B\\omega x\\,dx = \\frac{1}{2}B\\omega l^{2} $\n\n**The quick version:** the rod\u2019s **average** speed is $ \\omega l/2 $, so $ \\varepsilon = B\\left(\\frac{\\omega l}{2}\\right)l $, which is the same thing. Answering $ B\\omega l^{2} $ means you used the **tip** speed for the whole rod.\n\nThere is a flux route too: in time $ t $ the rod sweeps an area $ \\frac{1}{2}l^{2}\\omega t $, and $ \\varepsilon = B\\times$ (area per second) gives the same result.'),
            num('ch6-p15', 'A metal rod of length $ 1.0 $ m rotates about one end at $ 50 $ rad/s in a uniform field of $ 0.10 $ T directed perpendicular to the plane of rotation. Find the emf between its ends.',
              '$ \\varepsilon = 2.5 $ V',
              'Straight substitution into the result you just derived:\n\n$ \\varepsilon = \\frac{1}{2}B\\omega l^{2} = \\frac{1}{2}(0.10)(50)(1.0)^{2} = 2.5 $ V\n\nIf the question had given the rate in **revolutions** per second instead, remember to convert first: $ \\omega = 2\\pi f $. Feeding $ f $ straight in where $ \\omega $ belongs is worth a factor of about six, and it is a common way to lose a whole question.'),
            mcq('ch6-p16', 'The same rod of length $ l $ now rotates at $ \\omega $ about an axis through its **centre**, still perpendicular to a field $ B $. The emf between its two ends is',
              ['zero, though each half has $ \\frac{1}{8}B\\omega l^{2} $ across it', '$ \\frac{1}{2}B\\omega l^{2} $, as for rotation about an end', '$ \\frac{1}{4}B\\omega l^{2} $, since each half is $ l/2 $ long', '$ \\frac{1}{8}B\\omega l^{2} $, the value across one half'],
              0,
              'Treat the rod as two rods of length $ l/2 $, each pivoted at the centre. Each one develops\n\n$ \\varepsilon = \\frac{1}{2}B\\omega\\left(\\frac{l}{2}\\right)^{2} = \\frac{1}{8}B\\omega l^{2} $\n\nbetween the centre and its own tip. But both halves sweep the **same** way through the **same** field, so both tips end up at the same potential relative to the centre.\n\nBetween the two ends, then, the two emfs face each other and cancel: the reading is **zero**. Between the centre and either end you would measure $ \\frac{1}{8}B\\omega l^{2} $.\n\nThe rod is not "doing nothing" — charge really has piled up at both tips. It has simply piled up equally, so there is nothing to drive a current between them.'),
            mcq('ch6-p17', 'A semicircular wire of radius $ R $ moves with speed $ v $ in its own plane, perpendicular to a uniform field $ B $ that is perpendicular to that plane. The straight line joining its two ends is perpendicular to $ v $. The emf between the ends is',
              ['$ 2BvR $', '$ \\pi BvR $', '$ BvR $', 'zero, because the wire is curved'],
              0,
              'The emf of a moving conductor depends only on the **straight-line separation of its two ends**, measured perpendicular to the velocity — not on the length of wire you used to get from one end to the other.\n\nHere the ends are the two points of the diameter, a distance $ 2R $ apart, so\n\n$ \\varepsilon = Bv(2R) $\n\nAnswering $ \\pi BvR $ means you used the **arc length** $ \\pi R $, which is the trap the item is built around.\n\n**Why the shape is irrelevant.** Imagine closing the gap with a straight wire along the diameter. The closed loop encloses a fixed area moving through a uniform field, so its total emf is zero — which means the curved path and the straight path must produce identical emfs between the same two points. Bend the wire into any shape you like; only the endpoints count.'),
            num('ch6-p18', 'A rod of length $ 1.0 $ m slides without friction on two horizontal rails joined by a resistance of $ 4.0\\ \\Omega $. A uniform vertical field of $ 0.50 $ T fills the region, and the rod is pulled at a steady $ 2.0 $ m/s. Find (a) the induced emf, (b) the current, (c) the external force needed, (d) the mechanical power supplied, and (e) the heat produced per second. Take the rod and rails to have no resistance.',
              '(a) $ 1.0 $ V  (b) $ 0.25 $ A  (c) $ 0.125 $ N  (d) $ 0.25 $ W  (e) $ 0.25 $ W',
              '**(a)** $ \\varepsilon = Bvl = (0.50)(2.0)(1.0) = 1.0 $ V\n\n**(b)** $ i = \\frac{\\varepsilon}{R} = \\frac{1.0}{4.0} = 0.25 $ A\n\n**(c)** A current-carrying rod in a field feels a force $ F = Bil $, and by Lenz\u2019s law it points **against** the motion. The rod moves at constant speed, so your pull must exactly balance it:\n\n$ F = Bil = (0.50)(0.25)(1.0) = 0.125 $ N\n\n**(d)** $ P_{\\text{mech}} = Fv = (0.125)(2.0) = 0.25 $ W\n\n**(e)** $ P_{\\text{heat}} = i^{2}R = (0.25)^{2}(4.0) = 0.25 $ W\n\n**The whole point is that (d) and (e) are equal.** Every joule you put in with your hand comes out as heat in the resistor. Induction is not a source of free energy; it is a mechanism for converting mechanical work into electrical energy, and the minus sign in Faraday\u2019s law is what guarantees the books balance.\n\nAlso worth storing: combining the steps gives the retarding force directly as $ F = \\frac{B^{2}l^{2}v}{R} $ — check it here, $ \\frac{(0.25)(1.0)(2.0)}{4.0} = 0.125 $ N.'),
            mcq('ch6-p19', 'For a rod being dragged at constant speed along rails, the retarding force is $ F = \\frac{B^{2}l^{2}v}{R} $. If the magnetic field alone is doubled, that force is',
              ['multiplied by four', 'multiplied by two', 'divided by two', 'unchanged'],
              0,
              '$ B $ appears **squared**, so doubling it multiplies the force by four.\n\nIt is squared for a reason worth understanding rather than memorising: a bigger $ B $ raises the emf, which raises the current, and then that larger current feels a force in the larger field as well. $ B $ enters the story twice, so it enters the answer twice.\n\nThe same reasoning explains magnetic braking. Braking force grows with speed, so a fast object is retarded hard and a slow one gently — the vehicle eases to a stop instead of jolting.'),
          ],
        },
        // ── 4 · Eddy currents ───────────────────────────────────────────────
        {
          id: 'ch6-s4-eddy',
          title: '4 · Eddy currents',
          blurb: 'Same physics, no wire. Ask where the loop is and what is trying to change.',
          items: [
            mcq('ch6-p20', 'The iron core of a transformer is built up from thin sheets, each varnished so that it is insulated from its neighbours, rather than being cast as one solid block. The reason is',
              ['to break the eddy-current loops and cut the heat they waste', 'to stop magnetic flux leaking out of the sides of the core', 'to make the core lighter and cheaper to manufacture', 'to prevent the core from becoming permanently magnetised'],
              0,
              'The core sits in a magnetic field that reverses fifty times a second, so any closed conducting path inside it has a changing flux through it and carries an induced current. In a solid block those loops can be large, the resistance they see is tiny, and the currents are huge — the core would run hot and waste much of the power.\n\nLaminating slices the block into thin sheets separated by insulation. A loop is now confined to one thin sheet, so it is small and it meets a high resistance. The heating drops sharply.\n\nNote what laminating does **not** do: the sheets are stacked along the field, so the flux path is untouched. The sheets are there to obstruct the current, not the flux.'),
            mcq('ch6-p21', 'A solid copper plate swinging between the poles of a strong magnet comes to rest within a few swings. An identical plate with deep slots cut into it swings for far longer. This is because',
              ['the slots break up the large eddy-current loops', 'the slots let the magnetic field pass straight through', 'the slots make the plate lighter, so it swings more freely', 'the slots increase the air resistance on the plate'],
              0,
              'As the solid plate enters and leaves the field the flux through it changes, so broad circulating eddy currents appear. By Lenz\u2019s law they oppose the motion, and the plate\u2019s kinetic energy is drained away as heat: it stops quickly.\n\nCutting slots leaves the plate\u2019s mass and shape essentially the same but destroys the big loops. The remaining currents are confined to narrow strips, are much weaker, and take far longer to drain the energy.\n\nThat the mass hardly changes is the tell that the slots act on the **current**, not on the mechanics.'),
            mcq('ch6-p22', 'An induction hob heats a steel pan placed on it but leaves a glass bowl on the same ring cold. The reason is that',
              ['eddy currents can only be driven in a conductor', 'glass reflects the magnetic field away from itself', 'glass is thicker than steel and so heats more slowly', 'the hob\u2019s field is too weak to penetrate glass'],
              0,
              'The hob\u2019s coil produces a rapidly alternating magnetic field, and that field passes through glass and steel alike — no material is "reflecting" it.\n\nWhat differs is what the field can **drive**. Steel has free electrons, so the changing flux sets up strong eddy currents in the pan base and its resistance turns them into heat. Glass has no mobile charges, so an emf is induced around any loop you care to imagine but no current follows, and no heating occurs.\n\nThis is why the hob surface itself stays cool enough to touch while the pan on it is red hot: the heat is generated **inside** the pan, not conducted up from below.'),
            num('ch6-p23', 'A strong bar magnet dropped down a long vertical copper pipe takes several seconds to emerge, while an unmagnetised steel slug of the same size and mass falls straight through in a fraction of a second. Explain, and say what determines the magnet\u2019s final speed.',
              'Eddy currents in the pipe wall oppose the magnet\u2019s motion; it reaches a terminal speed at which the magnetic drag balances its weight.',
              '**Why it is slowed.** As the magnet falls, the flux through each ring-shaped element of the pipe wall first grows (magnet approaching) and then shrinks (magnet receding). Each ring therefore carries an induced current, and by Lenz\u2019s law the ring below the magnet repels it while the ring above attracts it. Both effects point the same way: **upward**, against the fall.\n\n**Why the steel slug is unaffected.** It carries no field of its own, so it changes no flux as it falls and induces nothing. Copper is not magnetic — the pipe does not attract either object. It only reacts to a *changing* field.\n\n**What sets the final speed.** The drag grows with speed, so the magnet accelerates only until\n\n$ F_{\\text{drag}}(v) = mg $\n\nAfter that it descends at a constant terminal speed. All the gravitational energy it loses from then on goes into heating the pipe — no wire, no circuit, no contact.'),
          ],
        },
        // ── 5 · Self and mutual inductance ──────────────────────────────────
        {
          id: 'ch6-s5-inductance',
          title: '5 · Self and mutual inductance',
          blurb: 'Inductance is a number the geometry owns. The current only decides what it does with it.',
          items: [
            num('ch6-p24', 'A long solenoid has $ 500 $ turns wound over a length of $ 0.50 $ m, with a cross-sectional area of $ 4.0 $ cm² and an air core. Find its self-inductance.',
              '$ L = 2.5\\times10^{-4} $ H, i.e. about $ 0.25 $ mH',
              'For a long solenoid $ L = \\frac{\\mu_0 N^{2} A}{l} $. Convert the area first: $ 4.0 $ cm² $ = 4.0\\times10^{-4} $ m².\n\n$ L = \\frac{(4\\pi\\times10^{-7})(500)^{2}(4.0\\times10^{-4})}{0.50} $\n\n$ = \\frac{(1.257\\times10^{-6})(2.5\\times10^{5})(4.0\\times10^{-4})}{0.50} = \\frac{1.257\\times10^{-4}}{0.50} = 2.5\\times10^{-4} $ H\n\nA quarter of a millihenry from five hundred turns tells you something about the unit: one henry is an enormous inductance, which is why practical coils are quoted in mH and $ \\mu $H.'),
            mcq('ch6-p25', 'A solenoid is rewound with twice as many turns, packed into the same length and with the same cross-section. Its self-inductance is',
              ['multiplied by four', 'multiplied by two', 'divided by two', 'unchanged'],
              0,
              '$ L = \\frac{\\mu_0 N^{2}A}{l} $, and $ N $ is squared, so doubling the turns multiplies $ L $ by four.\n\nThe square is not an accident. Doubling $ N $ doubles the field the solenoid makes for a given current, **and** doubles the number of turns that field has to thread. Both factors give a factor of two, so the flux linkage rises by four.\n\nAnswering "twice" means you spotted only one of those two effects.'),
            num('ch6-p26', 'The current in a $ 50 $ mH inductor is switched off, falling steadily from $ 3.0 $ A to zero in $ 5.0 $ ms. Find the magnitude of the emf induced across it.',
              '$ \\varepsilon = 30 $ V',
              'Convert both prefixes before touching the formula: $ L = 5.0\\times10^{-2} $ H and $ \\Delta t = 5.0\\times10^{-3} $ s.\n\n$ \\left|\\varepsilon\\right| = L\\left|\\frac{di}{dt}\\right| = (5.0\\times10^{-2})\\times\\frac{3.0}{5.0\\times10^{-3}} = (5.0\\times10^{-2})(600) = 30 $ V\n\nThirty volts out of a coil that may have been running on a two-volt supply. This is why breaking an inductive circuit sparks at the switch contacts, and why a real circuit puts a diode across a relay coil to give that current somewhere harmless to die.\n\nCut the switching time to $ 0.5 $ ms and you would get $ 300 $ V from the same coil. The emf is set by the **rate**, not by the size of the current.'),
            num('ch6-p27', 'Two coils lie near each other. When the current in coil 1 changes at $ 4.0 $ A/s, an emf of $ 0.80 $ V appears across coil 2. Find their mutual inductance, and then find the emf induced in coil 1 when the current in coil 2 changes at $ 10 $ A/s.',
              '$ M = 0.20 $ H; the emf in coil 1 is $ 2.0 $ V',
              'From the first measurement:\n\n$ M = \\frac{\\left|\\varepsilon_2\\right|}{\\left|di_1/dt\\right|} = \\frac{0.80}{4.0} = 0.20 $ H\n\nNow the useful fact: $ M_{12} = M_{21} $. The same single number describes the coupling in **either** direction, however lopsided the two coils look — one may be a huge solenoid and the other a tiny loop inside it.\n\nSo driving the pair the other way round:\n\n$ \\left|\\varepsilon_1\\right| = M\\left|\\frac{di_2}{dt}\\right| = (0.20)(10) = 2.0 $ V\n\nWithout the reciprocity result you would have to recalculate the geometry from scratch. With it, one measurement settles both directions — and it is what makes transformer theory workable.'),
            mcq('ch6-p28', 'Two coils have self-inductances $ 4 $ mH and $ 9 $ mH. The largest mutual inductance they could possibly have is',
              ['$ 6 $ mH', '$ 13 $ mH', '$ 36 $ mH', '$ 2.25 $ mH'],
              0,
              'The coupling coefficient is defined by $ M = k\\sqrt{L_1L_2} $, and $ k $ cannot exceed 1 — that would mean coil 2 catching more flux than coil 1 produced.\n\nSo the ceiling is $ M_{\\max} = \\sqrt{L_1L_2} = \\sqrt{4\\times9} = 6 $ mH, reached only if every field line from one coil passes through the other. A transformer with a closed iron core comes close to it; two coils sitting loosely side by side do not.\n\nThe value $ 13 $ mH comes from adding the inductances and $ 36 $ mH from multiplying them without the square root — both are dimensionally wrong for the geometric mean.'),
            mcq('ch6-p29', 'Which of the following does **not** affect the self-inductance of a given coil?',
              ['the current flowing through it', 'the number of turns on it', 'whether an iron core is inserted', 'its cross-sectional area'],
              0,
              'Inductance is defined by $ L = \\frac{N\\Phi}{i} $, and although the current appears in that expression it cancels out: doubling $ i $ doubles $ \\Phi $, leaving the ratio fixed. $ L $ is a property of the coil\u2019s geometry and its core material, in exactly the way that capacitance is a property of a capacitor\u2019s plates and not of the charge on them.\n\nThe other three all matter. Turns enter as $ N^{2} $, the area enters directly, and an iron core multiplies $ L $ by the relative permeability — often by hundreds.\n\n(Iron does saturate at high currents, so a real iron-cored coil\u2019s $ L $ does sag at extreme currents. That is the core misbehaving, not the definition changing.)'),
            num('ch6-p30', 'A small coil of $ 50 $ turns and area $ 2.0 $ cm² is placed at the centre of a long solenoid wound with $ 1000 $ turns per metre, with its plane perpendicular to the solenoid\u2019s axis. Find the mutual inductance of the pair.',
              '$ M = 1.3\\times10^{-5} $ H, i.e. about $ 13\\ \\mu $H',
              'Choose the easy direction. Working out the flux the small coil sends through the whole solenoid would be horrible; working out the flux the solenoid sends through the small coil is a one-liner — and reciprocity says the answer is the same either way.\n\nInside a long solenoid the field is uniform: $ B = \\mu_0 n i_1 $.\n\nFlux linkage of the small coil:\n\n$ N_2\\Phi_2 = N_2 (\\mu_0 n i_1) A $\n\nSo\n\n$ M = \\frac{N_2\\Phi_2}{i_1} = \\mu_0 n N_2 A = (4\\pi\\times10^{-7})(1000)(50)(2.0\\times10^{-4}) $\n\n$ = 1.26\\times10^{-5} $ H $ \\approx 13\\ \\mu $H\n\n**Store the technique, not the number.** Whenever two coils are coupled and one of them has an easy field, drive **that** one and use $ M_{12} = M_{21} $ to get the hard direction for free.'),
          ],
        },
        // ── 6 · Energy and the L-R circuit ──────────────────────────────────
        {
          id: 'ch6-s6-energy-lr',
          title: '6 · Energy and the L-R circuit',
          blurb: 'The mirror of the C-R circuit from Chapter 2. Same shapes on the graph, different physics underneath.',
          items: [
            num('ch6-p31', 'An inductor of $ 2.0 $ H carries a current of $ 3.0 $ A. (a) How much energy is stored in it? (b) By what factor does that energy change if the current is doubled?',
              '(a) $ 9.0 $ J  (b) it becomes four times as large',
              '**(a)** $ U = \\frac{1}{2}Li^{2} = \\frac{1}{2}(2.0)(3.0)^{2} = 9.0 $ J\n\n**(b)** The current is squared, so doubling it gives $ 2^{2} = 4 $ times the energy — $ 36 $ J.\n\nNotice the shape of the formula. It is the exact partner of $ U = \\frac{1}{2}CV^{2} $ for a capacitor, with $ L $ in place of $ C $ and current in place of voltage. The capacitor stores energy because charge has been separated; the inductor stores it because a current is flowing. Stop the current and the store is gone.'),
            mcq('ch6-p32', 'In a region where the magnetic field is $ 0.10 $ T, the energy stored per unit volume of the field is about',
              ['$ 4.0 \\times 10^{3} $ J/m³', '$ 8.0 \\times 10^{3} $ J/m³', '$ 2.0 \\times 10^{3} $ J/m³', '$ 4.0 \\times 10^{4} $ J/m³'],
              0,
              'Use $ u = \\frac{B^{2}}{2\\mu_0} $:\n\n$ u = \\frac{(0.10)^{2}}{2(4\\pi\\times10^{-7})} = \\frac{1.0\\times10^{-2}}{2.51\\times10^{-6}} \\approx 4.0\\times10^{3} $ J/m³\n\nDropping the factor of 2 in the denominator gives $ 8.0\\times10^{3} $ J/m³, which is the usual slip here.\n\nSet the result beside its electric partner from Chapter 2, $ u = \\frac{1}{2}\\varepsilon_0E^{2} $. Both say the same startling thing: the energy is not stored "in the coil" or "on the plates" but spread through the **field itself**, in the empty space where the field exists.'),
            mcq('ch6-p33', 'A battery of emf $ \\varepsilon $, a resistor $ R $ and an inductor $ L $ are connected in series and the switch is closed at $ t = 0 $. The current is',
              ['zero at first, then rises towards $ \\varepsilon/R $', '$ \\varepsilon/R $ at first, then falls towards zero', '$ \\varepsilon/R $ immediately, and stays there for ever', 'zero at first, and stays at zero for ever'],
              0,
              'An inductor opposes any **change** in the current through it, so it cannot jump from nothing to a finite value instantly — at $ t = 0 $ the current is exactly zero, and the whole battery emf appears across the inductor.\n\nAs the current builds, $ \\frac{di}{dt} $ falls and so does the back emf, letting the current grow further. It approaches, but never quite reaches,\n\n$ i_0 = \\frac{\\varepsilon}{R} $\n\nwhich is the value the resistor alone would allow. After a long time the inductor behaves as an ordinary piece of wire.\n\nCompare a capacitor charging through a resistor: there the **current** starts at its maximum and decays. The inductor is the mirror image, because it resists a change in current where a capacitor resists a change in voltage.'),
            num('ch6-p34', 'A $ 3.0 $ H inductor is connected in series with a $ 6.0\\ \\Omega $ resistor across a $ 12 $ V battery of negligible internal resistance. Find (a) the time constant, (b) the final steady current, and (c) the current one time constant after the switch is closed.',
              '(a) $ \\tau = 0.50 $ s  (b) $ i_0 = 2.0 $ A  (c) $ i = 1.3 $ A',
              '**(a)** $ \\tau = \\frac{L}{R} = \\frac{3.0}{6.0} = 0.50 $ s\n\n**(b)** After a long time the inductor drops no voltage, so $ i_0 = \\frac{\\varepsilon}{R} = \\frac{12}{6.0} = 2.0 $ A\n\n**(c)** $ i(t) = i_0\\left(1 - e^{-t/\\tau}\\right) $, and at $ t = \\tau $ the exponent is $ -1 $:\n\n$ i(\\tau) = 2.0\\left(1 - e^{-1}\\right) = 2.0(1 - 0.368) = 1.26 \\approx 1.3 $ A\n\n**Worth memorising:** one time constant always takes you to $ 63\\% $ of the final value, whatever the numbers are. Check the units of $ \\tau $ too — henry per ohm really is a second, which is a fast way to catch an upside-down time constant.'),
            mcq('ch6-p35', 'A steady current in an L-R circuit is left to decay. The time it takes to fall to half its initial value is',
              ['$ 0.69\\,\\tau $', '$ 0.50\\,\\tau $', '$ 1.00\\,\\tau $', '$ 1.44\\,\\tau $'],
              0,
              'The decay is $ i = i_0e^{-t/\\tau} $. Set $ i = i_0/2 $:\n\n$ e^{-t/\\tau} = \\frac{1}{2} \\quad\\Rightarrow\\quad \\frac{t}{\\tau} = \\ln 2 = 0.693 $\n\nAnswering $ 0.50\\,\\tau $ assumes the decay is a straight line, which it is not — exponentials fall fast at first and then dawdle. And the half-life is always **shorter** than $ \\tau $, because one time constant takes the current down to $ 37\\% $, which is already past half.\n\nThe identical algebra gives the half-life of a discharging capacitor, and of a radioactive sample. Once you have solved it in one place you have solved it everywhere.'),
            num('ch6-p36', 'A $ 0.10 $ H inductor carries a steady current of $ 2.0 $ A. The battery is removed and the current is allowed to decay through a $ 5.0\\ \\Omega $ resistor. Find the total heat produced in the resistor over the whole decay.',
              '$ 0.20 $ J — exactly the energy that had been stored in the inductor.',
              '**The fast way.** Once the battery is out, the only energy left anywhere in the circuit is what the inductor was storing, and the only place it can go is the resistor. So\n\n$ Q = U = \\frac{1}{2}Li_0^{2} = \\frac{1}{2}(0.10)(2.0)^{2} = 0.20 $ J\n\n**The long way, to prove it.** With $ i = i_0e^{-t/\\tau} $ and $ \\tau = L/R $:\n\n$ Q = \\int_0^{\\infty} i^{2}R\\,dt = i_0^{2}R\\int_0^{\\infty} e^{-2t/\\tau}dt = i_0^{2}R\\cdot\\frac{\\tau}{2} = i_0^{2}R\\cdot\\frac{L}{2R} = \\frac{1}{2}Li_0^{2} $\n\nThe $ R $ cancels, which is the striking part: the total heat does not depend on the resistance at all. A large $ R $ makes the current die quickly and dissipate hard; a small $ R $ lets it linger and dissipate gently. Either way the same $ 0.20 $ J comes out, because that is all there was.\n\nThis mirrors the C-R result from Chapter 2 exactly, and it is why the energy-first argument is nearly always the shorter route.'),
          ],
        },
        // ── 7 · The AC generator ────────────────────────────────────────────
        {
          id: 'ch6-s7-generator',
          title: '7 · The AC generator',
          blurb: 'The whole chapter, turned into a machine — and the doorway into Chapter 7.',
          items: [
            num('ch6-p37', 'A coil of $ 100 $ turns and area $ 0.020 $ m² is rotated at $ 50 $ revolutions per second in a uniform magnetic field of $ 0.50 $ T, about an axis perpendicular to the field. Find the peak emf produced.',
              '$ \\varepsilon_0 \\approx 314 $ V',
              'Convert the rotation rate to angular frequency first — this is where most of the marks are lost:\n\n$ \\omega = 2\\pi f = 2\\pi(50) = 314 $ rad/s\n\nThen\n\n$ \\varepsilon_0 = NBA\\omega = (100)(0.50)(0.020)(314) = 314 $ V\n\nThe emf itself is $ \\varepsilon = \\varepsilon_0\\sin\\omega t $, so $ 314 $ V is the **peak**, reached twice per revolution and not at all typical of the rest of the cycle. Chapter 7 opens by sorting out what number you should quote instead — and where the familiar $ 220 $ V comes from.'),
            mcq('ch6-p38', 'In an AC generator the induced emf is largest at the instant when',
              ['the coil\u2019s plane is parallel to $ \\vec{B} $, so the flux is zero', 'the coil\u2019s plane is perpendicular to $ \\vec{B} $, so the flux is largest', 'the flux through the coil is largest, since $ \\varepsilon $ follows $ \\Phi $', 'the coil has just completed one whole revolution'],
              0,
              'The emf tracks the **rate of change** of flux, not the flux. With $ \\Phi = NBA\\cos\\omega t $ we get $ \\varepsilon = NBA\\omega\\sin\\omega t $ — a sine against a cosine, so the two peak a quarter of a cycle apart.\n\nWhen the coil\u2019s plane contains the field, no flux threads it at all, yet that is precisely the moment the flux is sweeping through zero fastest and the emf is at its maximum. When the plane is perpendicular to the field the flux is greatest, and the emf is momentarily **zero** — the flux is at a turning point.\n\nThe idea that a big flux means a big emf is the misconception this whole chapter was built to remove.'),
            mcq('ch6-p39', 'A generator\u2019s coil is made to spin twice as fast as before. Compared with the original output, the new output has',
              ['twice the peak emf and twice the frequency', 'twice the peak emf and the same frequency', 'the same peak emf and twice the frequency', 'four times the peak emf and twice the frequency'],
              0,
              '$ \\omega $ appears in two places, and both respond.\n\nThe peak value is $ \\varepsilon_0 = NBA\\omega $, directly proportional to $ \\omega $ — so it doubles.\n\nThe output is $ \\varepsilon_0\\sin\\omega t $, and $ \\omega $ sets how quickly that sine repeats — so the frequency doubles too.\n\nThe practical consequence is that a generator is not free to be spun at any convenient speed: the frequency is fixed by the grid at 50 Hz, so the turbine speed is fixed, and the output voltage must then be set by $ N $, $ B $ and $ A $ instead.'),
          ],
        },
      ],
    }),
    b('text', 2, {
      markdown: 'That is Chapter 6 finished. The generator you have just been calculating produces a current that reverses direction fifty times every second — and every rule you learned for steady current in Chapter 3 now has to be re-derived for it. That is Chapter 7.',
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
