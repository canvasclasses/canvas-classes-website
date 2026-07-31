'use strict';
/**
 * Class 12 Physics · Ch.6 "Electromagnetic Induction" — pages 1–5.
 * The experiment that started it, magnetic flux and its sign convention,
 * Faraday's law and the three ways to change flux, Lenz's law, and Lenz's law
 * turned into a four-step routine.
 *
 * SIGN CONVENTION FIXED ON p2 AND USED UNCHANGED THEREAFTER:
 *   • Choose a normal $ \hat{n} $ to the loop. Flux is POSITIVE when B has a
 *     component along $ \hat{n} $.
 *   • The positive sense of going round the loop is the right-hand curl about
 *     $ \hat{n} $ — anticlockwise seen from the tip of $ \hat{n} $.
 *   • Faraday's law is $ \varepsilon = -N\,d\Phi/dt $. A positive emf drives
 *     current in the positive sense. THE MINUS SIGN IS LENZ'S LAW.
 * Most student error in this chapter is sign error, not physics error, so these
 * pages never switch convention halfway.
 *
 * Run: node scripts/physics12-book/build_ch6_a_faraday.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 6;

// ── p1 · The Experiment That Started It ──────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'emi-the-experiment-that-started-it',
  title: 'The Experiment That Started It',
  subtitle: 'A current in a circuit with no battery in it',
  glossary: [
    { term: 'electromagnetic induction', definition: 'The production of an emf, and hence a current, in a circuit by a changing magnetic field — with no source of emf in that circuit.' },
    { term: 'induced current', definition: 'The current driven round a closed circuit by an induced emf.' },
    { term: 'galvanometer', definition: 'A sensitive instrument that shows both the size and the direction of a small current by the deflection of a needle.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'On 29 August 1831 Michael Faraday wound two separate coils of wire on opposite sides of an iron ring. The first coil he connected to a battery through a switch. The second he connected only to a galvanometer — **no battery anywhere in that second circuit**.\n\nHe closed the switch. The needle jumped, and then fell back to zero while the battery went on supplying a perfectly steady current to the first coil.\n\nHe opened the switch. The needle jumped again — the other way — and fell back to zero.\n\nA current in a circuit that contains no source of emf at all. Where did it come from, and why did it refuse to last?',
      hint: 'The needle moved at the instant of switching on, and again at the instant of switching off. What is special about those two moments, and not about the long steady time in between?',
      reveal: 'Nothing about the **steady** state produced anything. Only the **moments of change** did.\n\nClosing the switch made the current in the first coil grow from zero to its final value, so the magnetic field it produced grew too. Opening the switch made both collapse. In between, with a large and perfectly healthy current flowing in the first coil, the second circuit showed nothing whatsoever.\n\nSo the thing that drives this new current is not a magnetic field. It is a **changing** magnetic field. A big steady field does nothing; a small changing one does.\n\nThat single word — *changing* — is what the rest of this chapter is about. Chapters 1 to 5 asked what a current **does**. This one asks what **makes** a current in the first place.',
    }),
    b('text', 1, {
      markdown: 'Faraday found the same effect in three different arrangements, and it is worth seeing all three, because what they have in common is the whole discovery.',
    }),
    b('heading', 2, {
      text: 'The three experiments, and the one thing they share',
      level: 2,
      objective: 'Describe Faraday\'s three arrangements and identify the single feature present in every one of them.',
    }),
    b('text', 3, {
      markdown: '**One — a magnet and a coil.** Connect a coil to a galvanometer. There is no battery in the circuit. Now push a bar magnet towards the coil: the needle deflects. Pull it away: the needle deflects the other way. Hold the magnet still, anywhere you like, however close: **nothing**.\n\n**Two — two coils, one carrying a steady current.** Replace the bar magnet with a second coil carrying a steady current from its own battery. A current-carrying coil is a magnet (Chapter 5), so it behaves exactly like one. Move it towards the first coil and the needle deflects; hold it still and the needle sits at zero.\n\n**Three — two coils, neither of them moving.** This is the version on the iron ring, and it is the sharpest of the three, because now **nothing moves at all**. The only thing that changes is the current in the first coil, switched on and off — and the second circuit still responds, at exactly the moments of switching.',
    }),
    b('table', 4, {
      caption: 'What the galvanometer does in each case. Read the "no deflection" rows as carefully as the others.',
      headers: ['What is done', 'Galvanometer', 'What was changing'],
      rows: [
        ['Magnet pushed towards the coil', 'deflects one way', 'field through the coil, growing'],
        ['Magnet pulled away from the coil', 'deflects the other way', 'field through the coil, falling'],
        ['Magnet held still near the coil', '**nothing**', 'nothing'],
        ['Coil moved towards a still magnet', 'deflects, same as row 1', 'field through the coil, growing'],
        ['Magnet and coil moved together', '**nothing**', 'nothing'],
        ['Switch closed in a nearby circuit', 'a brief kick', 'current, and so field, growing'],
        ['Switch left closed, current steady', '**nothing**', 'nothing'],
        ['Switch opened', 'a brief kick, the other way', 'current, and so field, collapsing'],
      ],
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'logical',
      prompt: 'A bar magnet and a coil are moved along a bench **together**, side by side, at the same speed, in the same direction. What does the galvanometer show?',
      options: [
        'A large deflection, because both are moving fast',
        'Half the deflection of a moving magnet alone',
        'Nothing at all',
        'A deflection that reverses back and forth',
      ],
      reveal: '**Nothing at all.**\n\nBoth objects are moving through the room, but neither is moving *with respect to the other*. Sitting on the coil, you would see the magnet parked motionless beside you. The field threading the coil is not changing, so there is no induced current.\n\n**This is why the word "relative" matters so much here.** It is not the magnet\'s motion that induces anything, and it is not the coil\'s. It is the **relative** motion between them — and in Faraday\'s third experiment there is no motion of any kind, only a changing current.\n\nSo "motion" is not really the requirement either. Motion was just the easiest way Faraday had of making the field through the coil change. **The requirement is the change itself.**\n\nThat is worth holding on to, because the next page has to find a single quantity whose change is what actually counts — and it turns out not to be the field.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'How big is the effect?',
      level: 2,
      objective: 'State what controls the size of the induced current, and what does not.',
    }),
    b('text', 7, {
      markdown: 'Faraday went on to find what made the deflection larger. Three things did:\n\n- **Moving faster.** A magnet pushed in quickly gives a bigger kick than the same magnet pushed in slowly. So the *rate* of change matters, not just the amount.\n- **A stronger magnet.** More field means more of whatever it is that is changing.\n- **More turns on the coil.** Doubling the turns doubles the deflection, all else equal.\n\nAnd one thing did **not**: how long you waited before starting. A field that has been sitting there for a century is worth exactly as much as one that arrived a second ago — that is, nothing at all, until it changes.\n\nPut those together and the shape of the law is already visible. The induced effect depends on **how fast something is changing**, on **how much field** there is, and on **how many turns** the coil has.',
    }),
    b('latex_block', 8, {
      latex: '\\text{A CHANGING magnetic field drives a current. A steady one, however strong, does not.}',
      label: 'The whole of this chapter, in one sentence',
      note: 'The next two pages turn this sentence into an equation — first by naming the right quantity, then by putting a rate of change on it.',
      highlight: true,
    }),
    b('image', 9, {
      src: '',
      alt: 'A bar magnet being moved towards a coil connected only to a galvanometer, whose needle deflects',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'No battery in the circuit. The needle moves only while the magnet moves.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art. On the left a bar magnet drawn as a rectangle with one half tinted warm amber and the other cool blue, with a bright orange motion arrow pointing right towards a helical coil of five or six turns drawn in warm amber wire. Dim-orange curved field lines run from the magnet through the coil. The coil\'s two ends run right to a small circular meter with a needle tilted clearly off centre and a scale marked zero at the middle; the circuit contains no cell or battery symbol anywhere. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 10, {
      variant: 'fun_fact',
      markdown: 'Faraday was not alone. **Joseph Henry**, working in Albany, New York, found the same effect at about the same time — some of his experiments were done in **1830**, a year before Faraday\'s ring.\n\nHenry lost the credit only because he was teaching a heavy school timetable and published late. Faraday published first, and the law carries his name.\n\nHenry did get something, though: the SI unit of inductance is the **henry**, which you will meet on page 10. It is a fair trade, and a reminder that in physics the person who writes it up is the person who gets remembered.',
    }),
    b('text', 11, {
      markdown: 'Before going on, notice how large a claim this experiment is making.\n\nUntil 1831, every current anyone had ever produced came from a chemical cell. Faraday had just produced one from **motion** — from a piece of metal and a magnet and nothing else. Every power station on Earth still works this way: coal, gas, water and wind are all just different ways of turning something near a magnet.\n\nSo this is not a small laboratory curiosity that happens to be on the syllabus. It is the reason the socket in your wall has anything in it.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- A **changing** magnetic field through a circuit drives a current in it, with no battery present. That is **electromagnetic induction**.\n- A **steady** field, however strong, induces nothing.\n- Motion is not required — Faraday\'s ring had none. What is required is **change**.\n- Where there is motion, only the **relative** motion of magnet and coil counts.\n- The effect is larger for faster change, a stronger magnet, and more turns.\n- The current lasts only as long as the change does, which is why the needle kicks and returns.',
    }),
    b('text', 13, {
      markdown: 'Next: to write this as an equation we need one quantity whose change is what actually matters. It is not the field — and finding the right one is the business of the next page.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('In Faraday\'s ring experiment the galvanometer deflected only while',
          ['the current in the first coil was changing', 'a steady current flowed in the first coil', 'the two coils were touching each other', 'the battery voltage was being measured'],
          0,
          'Switching on and switching off are the moments when the current — and so the magnetic field it makes — is changing. During the long steady stretch in between, the needle sat at zero even though a large current was flowing.',
          1),
        q('A magnet and a coil are moved to the right together at the same speed. The induced emf is',
          ['zero, since there is no relative motion', 'maximum, since both objects are moving', 'half of what a moving magnet alone gives', 'doubled compared with a moving magnet'],
          0,
          'Sitting on the coil you would see the magnet standing still, so the field through the coil never changes. Only relative motion produces a change, and here there is none.',
          2),
        q('Doubling the speed with which a magnet is pushed into a coil',
          ['doubles the deflection of the needle', 'leaves the deflection quite unchanged', 'halves the deflection of the needle', 'reverses the deflection of the needle'],
          0,
          'The same change of field is made to happen in half the time, so its rate of change doubles. Reversal comes from reversing the direction of travel, not from changing the speed.',
          2),
      ],
    }),
  ],
};

// ── p2 · Magnetic Flux ───────────────────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'emi-magnetic-flux',
  title: 'Magnetic Flux',
  subtitle: 'The right quantity, and the sign convention that goes with it',
  glossary: [
    { term: 'magnetic flux', definition: 'The quantity $ \\Phi = \\vec{B}\\cdot\\vec{A} = BA\\cos\\theta $ — a measure of how much magnetic field passes through a given area. A scalar, but a signed one.' },
    { term: 'weber', definition: 'The SI unit of magnetic flux. One weber is one tesla times one square metre.' },
    { term: 'area vector', definition: 'A vector of magnitude equal to the area of a surface, pointing along the chosen normal to that surface.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Take a coil sitting in a uniform magnetic field, and turn it slowly about a horizontal axis.\n\nThe field never changes. Its strength is the same all through the turn, and so is its direction. The coil does not change either — same wire, same area, same number of turns.\n\nAnd yet a current flows while you turn it.\n\nIf neither $ B $ nor the coil changed, what did?',
      hint: 'Something about the *arrangement* changed, even though neither object did.',
      reveal: 'What changed is **how much of the field passes through the coil**.\n\nHold the coil face-on to the field and the field lines pour straight through it. Turn it edge-on and they slide past without threading it at all. Nothing about the field or the coil has altered — only their relative orientation.\n\nSo the quantity that matters is not $ B $ by itself, and not the area $ A $ by itself, but a combination of the two that also knows about the angle between them.\n\nThat quantity is called the **magnetic flux**, and defining it properly — including its sign — is the whole job of this page. Get the sign convention straight here and the rest of the chapter is arithmetic. Get it loose here and every later page will produce answers that are right in size and wrong in direction.',
    }),
    b('text', 1, {
      markdown: 'For a flat surface of area $ A $ in a uniform field $ \\vec{B} $, the magnetic flux is the dot product of the field with the **area vector** — a vector of magnitude $ A $ pointing along the normal to the surface:',
    }),
    b('latex_block', 2, {
      latex: '\\Phi = \\vec{B}\\cdot\\vec{A} = BA\\cos\\theta',
      label: 'Magnetic flux through a flat surface',
      note: 'θ is the angle between B and the NORMAL to the surface — not between B and the surface itself.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Two immediate consequences of that $ \\cos\\theta $, both worth having at your fingertips:\n\n- **Face-on** ($ \\theta = 0 $, field along the normal, field perpendicular to the surface): $ \\Phi = BA $, the largest it can be.\n- **Edge-on** ($ \\theta = 90^\\circ $, field lying in the plane of the surface): $ \\Phi = 0 $, nothing threads through at all.\n\nThe unit is the **weber** (Wb), and it follows straight from the definition: $ 1\\ \\text{Wb} = 1\\ \\text{T}\\cdot\\text{m}^{2} $. Turned around, this says a tesla is a weber per square metre — which is why $ \\vec{B} $ is sometimes called the *magnetic flux density*. Flux per unit area is exactly what a field strength is.\n\nAnd for a coil of $ N $ turns, each turn is threaded separately, so the field passes through the circuit $ N $ times over. The **total flux linkage** is $ N\\Phi $, and it is this — not $ \\Phi $ — that appears in Faraday\'s law on the next page.',
    }),
    b('heading', 4, {
      text: 'Flux is a scalar — but it carries a sign',
      level: 2,
      objective: 'Fix the sign convention for flux and for the positive sense round a loop, and explain why it must be fixed once and left alone.',
    }),
    b('text', 5, {
      markdown: 'A dot product of two vectors is a scalar, so flux has no direction. But it does have a **sign**, and that sign is where almost every mark in this chapter is won or lost.\n\nThe trouble is that a flat loop has **two** normals — one out of each face — and nothing in nature prefers either. So you must choose, and the choice is yours, but once made it is binding.\n\n**Step one of every induction problem: choose a normal $ \\hat{n} $, and then hold three things fixed.**\n\n**One — the sign of the flux.** $ \\Phi $ is positive when $ \\vec{B} $ has a component along $ \\hat{n} $, and negative when it points against it. So the same loop in the same field has flux $ +BA $ or $ -BA $ depending purely on which face you decided to call the front. Neither is more correct.\n\n**Two — the positive sense round the loop.** Put your right thumb along $ \\hat{n} $ and let your fingers curl. That curl is the **positive sense** of going round the loop. Equivalently: looked at from the tip of $ \\hat{n} $, back down towards the loop, the positive sense is **anticlockwise**.\n\n**Three — what a sign on the emf then means.** With those two settled, Faraday\'s law $ \\varepsilon = -N\\frac{d\\Phi}{dt} $ gives a *signed* emf. A positive $ \\varepsilon $ drives current in the positive sense; a negative $ \\varepsilon $ drives it the other way round. Nothing is left to guesswork.',
    }),
    b('callout', 6, {
      variant: 'warning',
      title: 'The one rule that prevents most sign errors',
      markdown: '**Choose the normal once, write it down, and never change it in the middle of a problem.**\n\nSwitching normals halfway is the single commonest cause of a right-magnitude, wrong-direction answer — and because the arithmetic looks perfect, it is very hard to spot afterwards.\n\nA useful habit: pick $ \\hat{n} $ **along the field that is already there**, so the starting flux comes out positive. Then a growing flux gives $ \\frac{d\\Phi}{dt} > 0 $ and a negative emf, and you only ever have one sign to keep track of instead of two.\n\nAnd if the answer you get is negative, that is not an error. It is the equation telling you the current goes the other way round — which is information, not a mistake.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A flat coil sits in a uniform field. The question says: "the **plane** of the coil makes an angle of $ 30^\\circ $ with the field." What is the flux through it?',
      options: [
        '$ BA\\cos 30^\\circ $',
        '$ BA\\sin 30^\\circ $',
        '$ BA\\tan 30^\\circ $',
        '$ BA $, since the angle does not matter',
      ],
      reveal: '**$ BA\\sin 30^\\circ $, which is $ BA/2 $.**\n\nThis is a wording trap, and it is set deliberately in exams.\n\nThe formula $ \\Phi = BA\\cos\\theta $ uses $ \\theta $ measured from the **normal**, not from the plane. Here the *plane* makes $ 30^\\circ $ with the field, so the **normal** makes $ 90^\\circ - 30^\\circ = 60^\\circ $ with it. Then\n\n$ \\Phi = BA\\cos 60^\\circ = BA\\sin 30^\\circ = \\frac{BA}{2} $\n\n**The habit that kills this trap for good:** before writing anything down, draw the normal on your sketch and mark the angle *between the field and that arrow*. Do not reach for cos or sin until the arrow is on the paper.\n\nA quick sanity check also catches it. A coil lying edge-on to the field ($ 0^\\circ $ between the plane and the field) must have **zero** flux — and $ BA\\sin 0^\\circ = 0 $ ✓, whereas $ BA\\cos 0^\\circ = BA $ would be badly wrong.',
      difficulty_level: 3,
    }),
    b('table', 8, {
      caption: 'The same coil in the same field, at four orientations. Only the angle changes.',
      headers: ['Angle of $ \\vec{B} $ to the normal', 'Angle of $ \\vec{B} $ to the plane', 'Flux $ \\Phi $'],
      rows: [
        ['$ 0^\\circ $', '$ 90^\\circ $', '$ +BA $ — maximum'],
        ['$ 60^\\circ $', '$ 30^\\circ $', '$ +BA/2 $'],
        ['$ 90^\\circ $', '$ 0^\\circ $', '$ 0 $ — nothing threads through'],
        ['$ 180^\\circ $', '$ 90^\\circ $', '$ -BA $ — same size, opposite sign'],
      ],
    }),
    b('worked_example', 9, {
      label: 'flux through a tilted coil',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A coil of $ 50 $ turns encloses an area of $ 200\\ \\text{cm}^{2} $ and sits in a uniform field of $ 0.35 $ T. The normal to the coil makes an angle of $ 60^\\circ $ with the field. Find the flux through one turn, and the total flux linkage. What happens to both if the coil is then turned edge-on to the field?',
      solution: '**Convert the area first.** This is where marks leak away silently.\n\n$ A = 200\\ \\text{cm}^{2} = 200\\times 10^{-4}\\ \\text{m}^{2} = 2.0\\times10^{-2}\\ \\text{m}^{2} $\n\n**Flux through one turn.**\n\n$ \\Phi = BA\\cos\\theta = (0.35)(2.0\\times10^{-2})\\cos 60^\\circ $\n\n$ \\Phi = (0.35)(2.0\\times10^{-2})(0.5) = 3.5\\times10^{-3}\\ \\text{Wb} $\n\n**Total flux linkage.** Each of the $ 50 $ turns is threaded by that same flux:\n\n$ N\\Phi = 50 \\times 3.5\\times10^{-3} = 0.175\\ \\text{Wb} $\n\n**Turned edge-on.** Now the field lies in the plane of the coil, so it makes $ 90^\\circ $ with the normal:\n\n$ \\Phi = BA\\cos 90^\\circ = 0 $\n\nand the linkage is zero too.\n\n**Read what just happened.** Nothing was done to the field and nothing to the coil — only the orientation changed — and the flux went from $ 0.175 $ Wb to zero. If that turn is made in a tenth of a second, the next page will tell you it produced an average emf of $ 1.75 $ V. This is exactly how a generator works, and it is why turning things is the whole industry.',
    }),
    b('image', 10, {
      src: '',
      alt: 'A tilted flat loop in a uniform field, with its normal drawn and the angle between the normal and the field marked',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The angle in the formula is measured from the normal, not from the surface.',
      generation_prompt: 'Clean scientific 3D-perspective diagram on a near-black background (#0B0C0F), thin dim-grey line art. A flat circular loop drawn in warm amber wire, tilted in perspective so it appears as an ellipse, sitting in a set of straight parallel dim-orange field arrows running left to right across the whole frame. A single bold bright-amber arrow rises from the centre of the loop perpendicular to its face, labelled n. A small arc between that arrow and the field direction marks the angle theta. A faint translucent shading fills the ellipse to suggest the enclosed area, and a few field arrows are shown passing through the shaded ellipse while others miss it. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('heading', 11, {
      text: 'Why flux, and not the field',
      level: 2,
      objective: 'Explain why induction is governed by flux rather than by field strength.',
    }),
    b('text', 12, {
      markdown: 'It is fair to ask why nature should care about $ BA\\cos\\theta $ rather than about $ B $, which is the more fundamental object.\n\nThe answer is in Faraday\'s own results from the last page. **All three of $ B $, $ A $ and $ \\theta $ can produce an induced current, and all three do.** Move a magnet and $ B $ changes. Slide a rod along rails and $ A $ changes. Rotate a coil and $ \\theta $ changes. Any correct law must treat the three on the same footing — and $ \\Phi = BA\\cos\\theta $ is precisely the combination that does.\n\nThere is a second reason, and it is the deeper one. Flux is about **the circuit as a whole**, not about a point in space. Induction is a property of a closed loop: it is meaningless to ask what emf is induced "at a point". Flux, being an integral over the area the loop encloses, is exactly the kind of quantity a whole loop can have.\n\nSo the quantity was not chosen for convenience. It is the only one with the right shape for the job.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\Phi = \\vec{B}\\cdot\\vec{A} = BA\\cos\\theta $, with $ \\theta $ measured from the **normal**.\n- Unit: the **weber**, $ 1\\ \\text{Wb} = 1\\ \\text{T}\\cdot\\text{m}^{2} $. A tesla is a weber per square metre.\n- $ N $ turns → flux **linkage** $ N\\Phi $. This is what Faraday\'s law uses.\n- Flux is a **scalar with a sign**. Choose $ \\hat{n} $, then $ \\Phi > 0 $ when $ \\vec{B} $ is along it.\n- Right thumb along $ \\hat{n} $ → fingers give the **positive sense** round the loop.\n- **Never change the normal mid-problem.** A negative answer is information, not an error.\n- "Plane makes $ 30^\\circ $ with $ \\vec{B} $" means the **normal** makes $ 60^\\circ $. Draw the normal first.',
    }),
    b('text', 14, {
      markdown: 'Next: flux is the right quantity, and Faraday\'s experiments said the **rate** of its change is what counts. Putting those two together gives the law itself.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic flux through a flat loop of area $ A $ in a uniform field $ B $, with $ \\theta $ the angle between the field and the normal, is',
          ['$ BA\\cos\\theta $', '$ BA\\sin\\theta $', '$ BA\\tan\\theta $', '$ BA $ at every angle'],
          0,
          'Flux is the dot product $ \\vec{B}\\cdot\\vec{A} $, and a dot product carries a cosine of the angle between the two vectors. Since $ \\vec{A} $ points along the normal, that angle is the one measured from the normal.',
          1),
        q('A loop is turned until its plane contains the field lines. The flux through it is then',
          ['zero', 'a maximum', '$ BA $', 'negative'],
          0,
          'With the field lying in the plane of the loop, the normal is at $ 90^\\circ $ to the field, and $ \\cos 90^\\circ = 0 $. No field line threads the loop; they all slide past it.',
          2),
        q('One weber is the same as',
          ['one tesla square metre', 'one tesla per square metre', 'one tesla per second', 'one volt per second'],
          0,
          'From $ \\Phi = BA $, the unit of flux is the unit of field times the unit of area. The reciprocal combination, tesla per square metre, is not a unit of anything here — although a tesla is a weber per square metre, which is the same statement read backwards.',
          1),
      ],
    }),
  ],
};

// ── p3 · Faraday's Law of Induction ──────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'emi-faradays-law',
  title: 'Faraday\'s Law of Induction',
  subtitle: 'One equation, and the three doors into it',
  glossary: [
    { term: 'Faraday\'s law', definition: 'The induced emf in a circuit equals minus the rate of change of the magnetic flux linkage: $ \\varepsilon = -N\\frac{d\\Phi}{dt} $.' },
    { term: 'induced emf', definition: 'The emf produced in a circuit by a changing magnetic flux. Measured in volts, and present whether or not the circuit is closed.' },
    { term: 'induced charge', definition: 'The total charge pushed round a closed circuit during a flux change: $ q = \\frac{N\\Delta\\Phi}{R} $, independent of how fast the change happened.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Almost all of the electricity in the world is made by one equation, and it is the one on this page.\n\nA coal plant boils water to spin a turbine. A hydro plant lets falling water spin it. A wind farm lets wind spin it. A nuclear plant boils water with a different heat source and spins the same turbine.\n\nAll four are doing the identical physics at the end: **turning a coil near a magnet so that the flux through it changes**. The fuel is the only thing that differs, and the fuel is the part that gets argued about.\n\nOne equation, and almost all of the electrical energy humanity uses.',
    }),
    b('text', 1, {
      markdown: 'Page 1 established that a **change** produces the current, and that faster change produces more of it. Page 2 established that the quantity whose change matters is the **flux linkage** $ N\\Phi $.\n\nPut the two statements together and there is only one equation they can make:',
    }),
    b('latex_block', 2, {
      latex: '\\varepsilon = -N\\frac{d\\Phi}{dt}',
      label: 'Faraday\'s law of electromagnetic induction',
      note: 'The magnitude comes from the RATE of change of flux linkage. The minus sign is Lenz\'s law, and page 4 is about nothing else.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Read the equation slowly, because every symbol in it is load-bearing.\n\n**$ \\frac{d\\Phi}{dt} $, not $ \\Phi $.** A huge flux sitting there unchanged gives zero emf. A tiny flux changing quickly gives a large one. Only the rate counts.\n\n**$ N $ multiplies it.** Each turn is threaded separately, and the turns are in series, so their emfs add. A thousand-turn coil gives a thousand times the emf of a single loop in the same changing field — which is why real coils have a great many turns.\n\n**The minus sign.** It is not decoration and it is not an accident of convention. With the normal fixed as on page 2, the minus sign says the induced emf drives current in the sense that *fights* the change. That is Lenz\'s law, and it gets a page of its own next.\n\n**And the emf exists whether or not a current flows.** Open the circuit and the induced emf is still there — flux does not know or care whether your loop is complete. It is only the *current* that needs a closed path. This is a distinction worth guarding: exam questions ask for the emf in open circuits fairly often.',
    }),
    b('heading', 4, {
      text: 'The three ways to change the flux',
      level: 2,
      objective: 'Identify which of B, A or θ is changing in a given situation, and name the kind of induction it produces.',
    }),
    b('text', 5, {
      markdown: 'Here is the idea that organises this entire chapter.\n\nSince $ \\Phi = BA\\cos\\theta $, there are exactly **three** things that can change — and therefore exactly three ways to induce an emf. There is no fourth.\n\n**Change $ B $.** Keep the coil still and alter the field through it: move a magnet, or change the current in a nearby coil. This is what Faraday\'s ring did, and it is the mechanism behind eddy currents, self-inductance, mutual inductance and the transformer.\n\n**Change $ A $.** Keep the field steady and alter the area of circuit that is exposed to it: slide a conducting rod along rails, or pull a loop out of a field region. This is **motional emf**, and it is the next three pages.\n\n**Change $ \\theta $.** Keep both the field and the area fixed and simply rotate the coil. This is the **AC generator**, and it closes the chapter and opens the next one.\n\nEvery problem in this chapter is one of those three. Before touching any algebra, ask which one you are looking at — the answer decides the entire method.',
    }),
    b('table', 6, {
      caption: 'The three doors. Identify yours before you start calculating.',
      headers: ['What changes', 'Typical situation', 'Where it is treated'],
      rows: [
        ['$ B $', 'a magnet moved near a coil; a switch closed in a nearby circuit', 'eddy currents, inductance, transformers'],
        ['$ A $', 'a rod sliding on rails; a loop entering or leaving a field', 'motional emf, pages 6 to 8'],
        ['$ \\theta $', 'a coil rotated in a steady field', 'the AC generator, page 15'],
      ],
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'analogical',
      prompt: 'A circular loop of stretchy wire lies flat in a steady, uniform magnetic field, and someone pulls it outwards so its radius grows. Which of the three doors is this, and is there an induced emf?',
      options: [
        'A changing field — yes, there is an emf',
        'A changing angle — yes, there is an emf',
        'A changing area — yes, there is an emf',
        'Nothing is changing — no emf at all',
      ],
      reveal: '**A changing area, and yes — there is an emf.**\n\nThe field is steady, so $ B $ is fixed. The loop stays flat, so $ \\theta $ is fixed. But $ A = \\pi r^{2} $ is growing, so the flux $ \\Phi = BA $ grows with it, and $ \\frac{d\\Phi}{dt}\\neq 0 $.\n\nWorking it through: $ \\frac{d\\Phi}{dt} = B\\frac{dA}{dt} = B\\cdot 2\\pi r\\frac{dr}{dt} $, so the emf grows as the loop gets bigger, even at a constant rate of stretching.\n\n**Why this one is worth doing.** No magnet moves and no coil rotates, so the situation looks nothing like the pictures in the chapter — and students who have memorised *situations* rather than the *rule* get stuck. Students who ask "which of $ B $, $ A $, $ \\theta $ is changing?" get it in five seconds.\n\nThat question is the one to ask every single time, and it is why this page splits induction into three doors rather than listing a dozen examples.',
      difficulty_level: 2,
    }),
    b('text', 8, {
      markdown: 'One more result falls straight out of the law, and it is a favourite in exams because it looks surprising.\n\nIf the circuit has total resistance $ R $, the induced current is $ i = \\frac{\\varepsilon}{R} = -\\frac{N}{R}\\frac{d\\Phi}{dt} $. Now ask for the total **charge** that flows during the change, which means integrating the current over time:\n\n$ q = \\int i\\,dt = \\frac{N}{R}\\int d\\Phi $',
    }),
    b('latex_block', 9, {
      latex: 'q = \\frac{N\\,\\Delta\\Phi}{R}',
      label: 'Charge driven round the circuit by a flux change',
      note: 'No t anywhere. The same flux change pushes the same charge whether it takes a millisecond or an hour.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'The time has cancelled out completely, and the reason is worth seeing rather than memorising: a slower change gives a **smaller current** but for a **longer time**, and the product is untouched.\n\nSo a fast flux change gives a big brief current, a slow one gives a small lasting current, and both deliver exactly the same charge. This is what a *ballistic galvanometer* measures, and it is why such an instrument reads flux change directly rather than current.',
    }),
    b('worked_example', 11, {
      label: 'emf and charge from a collapsing field',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A coil of $ 200 $ turns encloses an area of $ 5.0\\times10^{-3}\\ \\text{m}^{2} $, with its plane perpendicular to a magnetic field. The field falls steadily from $ 0.60 $ T to $ 0.20 $ T in $ 0.050 $ s. Find the average induced emf. If the coil has a total resistance of $ 20\\ \\Omega $, find the induced current and the total charge that flows.',
      solution: '**Which door is this?** $ B $ is changing; $ A $ and $ \\theta $ are not. So this is a change-of-field problem, and the flux change comes entirely from $ \\Delta B $.\n\n**Set the normal along the field**, so the flux starts positive.\n\n**Flux change per turn.**\n\n$ \\Delta\\Phi = A\\,\\Delta B = (5.0\\times10^{-3})(0.20 - 0.60) = -2.0\\times10^{-3}\\ \\text{Wb} $\n\nThe minus sign says the flux fell, which we already knew — but carrying it keeps the bookkeeping honest.\n\n**Average emf.**\n\n$ \\varepsilon = -N\\frac{\\Delta\\Phi}{\\Delta t} = -\\,(200)\\frac{-2.0\\times10^{-3}}{0.050} $\n\n$ \\varepsilon = +8.0\\ \\text{V} $\n\nPositive, meaning the current runs in the **positive** sense about our chosen normal — which, since the flux was falling, is the sense that tries to hold the flux up. Exactly what page 4 will insist on.\n\n**Current.**\n\n$ i = \\frac{\\varepsilon}{R} = \\frac{8.0}{20} = 0.40\\ \\text{A} $\n\n**Charge — two ways, and they must agree.**\n\nDirectly: $ q = i\\,\\Delta t = (0.40)(0.050) = 0.020\\ \\text{C} $\n\nBy the formula: $ q = \\frac{N|\\Delta\\Phi|}{R} = \\frac{(200)(2.0\\times10^{-3})}{20} = \\frac{0.40}{20} = 0.020\\ \\text{C} $ ✓\n\n**Now change the question.** Suppose the same field collapse took $ 5.0 $ s instead of $ 0.050 $ s. The emf drops by a factor of $ 100 $ to $ 0.080 $ V and the current to $ 4.0 $ mA — but the charge is still $ 0.020 $ C. Nothing about the total charge cares how long you took.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Three panels showing the three ways of changing flux: changing the field, changing the area, and rotating the coil',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Change B, change A, or change the angle. There is no fourth way.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), three square panels in a row separated by thin vertical grey rules, all in thin dim-grey line art with wire drawn in warm amber. Panel one: a fixed circular coil with a bar magnet approaching it along its axis, a bright orange motion arrow on the magnet, and dim-orange field lines threading the coil; a small caption area reading B. Panel two: a straight conducting rod sliding to the right along two horizontal rails that close on the left, the enclosed rectangle lightly shaded, an array of dim-orange cross symbols filling the region, and a bright orange arrow on the rod; caption area reading A. Panel three: a rectangular coil shown mid-rotation about a vertical axis in a set of horizontal dim-orange field arrows, with a curved bright orange arrow indicating the turn and a dashed grey normal arrow tilted from the field; caption area reading theta. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\varepsilon = -N\\frac{d\\Phi}{dt} $ — the **rate** of change of flux linkage, never the flux itself.\n- $ N $ multiplies because the turns are in series and their emfs add.\n- The minus sign is **Lenz\'s law**, not bookkeeping. It fixes the direction.\n- The emf exists in an **open** circuit too. Only the current needs a closed path.\n- Three doors, and only three: change $ B $, change $ A $, change $ \\theta $. Name yours first.\n- $ q = \\frac{N\\Delta\\Phi}{R} $ — the charge does **not** depend on how long the change took.',
    }),
    b('text', 14, {
      markdown: 'Next: that minus sign, which so far has just been sitting in the equation. It turns out to be a statement about energy — and there is a good reason it could not have been a plus.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('Faraday\'s law says the induced emf is proportional to',
          ['the rate of change of the flux', 'the magnetic flux itself', 'the strength of the field', 'the area of the coil'],
          0,
          'A steady flux, however large, induces nothing at all. It is $ \\frac{d\\Phi}{dt} $ that appears in the law, which is why a small flux changing quickly beats a large flux sitting still.',
          1),
        q('A coil is rotated steadily in a uniform magnetic field. The flux through it changes because',
          ['the angle to the normal changes', 'the field strength keeps changing', 'the area enclosed keeps changing', 'the number of turns keeps changing'],
          0,
          'Neither the field nor the coil is altered by turning it — only their relative orientation. In $ \\Phi = BA\\cos\\theta $ this is the third door, and it is the one a generator uses.',
          2),
        q('The total charge driven round a closed coil of resistance $ R $ when the flux linkage changes by $ N\\Delta\\Phi $ is',
          ['$ N\\Delta\\Phi / R $', '$ N\\Delta\\Phi \\cdot R $', '$ N\\Delta\\Phi / (R\\,\\Delta t) $', '$ \\Delta\\Phi / (NR) $'],
          0,
          'Integrating $ i = \\frac{N}{R}\\frac{d\\Phi}{dt} $ over the change cancels the time entirely. A slower change gives a smaller current for proportionally longer, so the charge delivered is the same.',
          3),
      ],
    }),
  ],
};

// ── p4 · Lenz's Law ──────────────────────────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'emi-lenzs-law',
  title: 'Lenz\'s Law',
  subtitle: 'The minus sign, made physical',
  glossary: [
    { term: 'Lenz\'s law', definition: 'The induced emf and current always act so as to oppose the CHANGE in flux that produced them. It is the minus sign in Faraday\'s law, and it is a statement of energy conservation.' },
    { term: 'opposing the change', definition: 'If the flux is growing, the induced current works to reduce it; if the flux is falling, the induced current works to hold it up. In neither case does it oppose the flux itself.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Suppose the minus sign in Faraday\'s law were a plus.\n\nNudge a magnet a millimetre towards a coil. The flux grows a little, so a current is induced — and with a plus sign, that current would make the flux grow **more**, which would pull the magnet in harder, which would make the flux grow faster still.\n\nThe magnet would fly into the coil on its own, gathering speed, while the coil delivered a rising current to whatever was connected to it.\n\nWhat exactly is wrong with that picture?',
      hint: 'Follow the energy. Count what goes in and what comes out.',
      reveal: 'Nothing goes in, and a great deal comes out.\n\nYou supplied one millimetre\'s worth of a nudge. Out came kinetic energy in the accelerating magnet **and** electrical energy in the coil, both growing without limit. That is energy from nowhere — a perpetual motion machine, built out of a plus sign.\n\nSo the sign is not a matter of taste, and it is not fixed by convention. **Energy conservation forces it to be a minus.** The induced effect must fight the change that made it, because if it helped, the universe would be free.\n\nThat is Lenz\'s law, stated by Heinrich Lenz in 1834, three years after Faraday\'s experiments. And it is why pushing a magnet into a coil is *hard work* — the resistance you feel with your hand is exactly where the electrical energy comes from.',
    }),
    b('text', 1, {
      markdown: 'The law itself is one sentence, and every word in it has been chosen carefully:',
    }),
    b('latex_block', 2, {
      latex: '\\text{The induced current flows so as to OPPOSE THE CHANGE that produced it.}',
      label: 'Lenz\'s law',
      note: 'Opposes the CHANGE — not the flux, not the field, not the magnet. This distinction is the whole page.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'It opposes the change, not the flux',
      level: 2,
      objective: 'State precisely what the induced current opposes, and explain why "opposes the flux" gives wrong answers half the time.',
    }),
    b('text', 4, {
      markdown: 'This is the single most misquoted sentence in the chapter, so it is worth being blunt about it.\n\n**Wrong version:** "the induced current opposes the flux."\n**Right version:** "the induced current opposes the **change** in the flux."\n\nThe difference is not fussiness. The two versions give **opposite answers** whenever the flux is falling.\n\nTake a loop with flux pointing into the page and **growing**. The induced current sets up a field out of the page inside the loop, cutting the growth down. Here the wrong version happens to agree — the induced field does oppose the existing flux — and that agreement is exactly why the mistake survives.\n\nNow take the same loop with flux into the page and **falling**. The change is a decrease, so the induced current fights the decrease: it sets up a field **into** the page, *supporting* the flux that is already there. The wrong version now gives precisely the opposite answer.\n\nSo the induced current can either fight the existing flux or reinforce it, depending entirely on whether the flux is growing or shrinking. **What it always fights is the change.**',
    }),
    b('table', 5, {
      caption: 'The same loop, the same field direction — and opposite induced currents. Only the trend differs.',
      headers: ['Flux through the loop', 'The change', 'Induced current sets up a field', 'Effect'],
      rows: [
        ['into the page, **growing**', 'an increase', 'out of the page, inside the loop', 'slows the increase'],
        ['into the page, **falling**', 'a decrease', 'into the page, inside the loop', 'props up the falling flux'],
        ['out of the page, **growing**', 'an increase', 'into the page, inside the loop', 'slows the increase'],
        ['out of the page, **falling**', 'a decrease', 'out of the page, inside the loop', 'props up the falling flux'],
      ],
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'A loop lies in a field directed **into** the page, and the field is being **switched off**. Which way does the induced current flow, as seen by you looking at the page?',
      options: [
        'Anticlockwise, producing a field out of the page inside the loop',
        'Clockwise, producing a field into the page inside the loop',
        'There is no current, because the field is disappearing',
        'It flows first one way and then the other',
      ],
      reveal: '**Clockwise, producing a field into the page inside the loop.**\n\nWork it in the order that always works.\n\n*What is the flux doing?* It is into the page and **falling** towards zero.\n\n*What change must be opposed?* The **fall**. So the induced current must try to keep the into-page flux going.\n\n*Which way must the current run to do that?* Curl your right hand so the thumb points into the page; the fingers run **clockwise** as you look at the page. That is the sense that produces an into-the-page field inside the loop.\n\n**Notice what has happened here.** The induced current is producing a field in the *same* direction as the field that already exists — it is helping it, not fighting it. Anyone reciting "the induced current opposes the flux" gets this backwards.\n\nAnd the energy argument still holds perfectly. The circuit is not being given anything for free: whatever is switching that field off now has to work harder, because the loop is fighting to keep it.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'Why it must be opposition — the energy argument',
      level: 2,
      objective: 'Give the conservation-of-energy argument that forces the induced effect to oppose rather than assist.',
    }),
    b('text', 8, {
      markdown: 'Take the argument slowly, because it is one of the cleanest pieces of reasoning in the whole book, and examiners like it.\n\n**Suppose the opposite.** Suppose an induced current assisted the change that produced it.\n\nPush a magnet a little way towards a coil. The flux rises, a current is induced, and by assumption that current makes the near face of the coil act as a **south** pole — which *attracts* the approaching north pole and pulls the magnet in.\n\nThe magnet now accelerates on its own. Faster motion means faster flux change, which means a larger current, which means a stronger pull, which means faster motion still. The process runs away.\n\n**Now count the energy.** Into the system went one small push from you. Coming out of it: kinetic energy in a magnet that keeps gaining speed, and electrical energy dissipated in the coil at a rising rate, for as long as you care to wait. Energy has been created from nothing.\n\nThat is impossible, so the assumption is false. **The induced effect must oppose.**\n\nAnd with opposition, the accounting works perfectly. The near face acts as a **north** pole, repelling the approaching magnet, so *you* must keep pushing. The work your hand does against that repulsion is exactly the electrical energy that appears in the coil. Nothing is free; the energy was yours all along.\n\n**Lenz\'s law is conservation of energy, written for induction.** It is not an extra rule bolted on to Faraday\'s law — it is the only sign that law could have had.',
    }),
    b('image', 9, {
      src: '',
      alt: 'A magnet approaching a coil, with the induced current shown and the near face of the coil acting as a like pole that repels it',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The coil pushes back. The work done against that push is the electrical energy produced.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art. On the left a bar magnet drawn as a rectangle, its leading half tinted warm amber and its trailing half cool blue, with a bright orange motion arrow pointing right towards a coil of several turns drawn in warm amber wire. Small orange arrowheads on the coil windings indicate the direction of the induced current. Directly at the coil face nearest the magnet, a soft amber glow and a short bold arrow point back to the left towards the magnet, indicating repulsion. Dim-orange curved field lines emerge from the coil face towards the magnet, mirroring the magnet\'s own. A dashed grey outline of a hand pushing from the far left suggests effort. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Take a hand-cranked torch — the kind sold for power cuts — and turn the handle with the bulb switched **off**. The handle spins easily.\n\nNow switch the bulb **on** and turn it again. The handle is noticeably harder to move.\n\nNothing mechanical changed. No extra gear engaged, no brake was applied. All that happened is that current is now allowed to flow in the coil, and Lenz\'s law says that current must oppose the change producing it — so it drags on the rotation.\n\nThat drag is not a defect in the torch. **It is the energy transfer, felt directly by your hand.** The extra effort you put in is precisely what comes out as light.\n\nThe same thing happens on an enormous scale in a power station. When a city switches on its lights, the generators become physically harder to turn, and the turbines have to be fed more steam to keep them at fifty revolutions a second. Demand on the grid is, quite literally, mechanical resistance in a spinning shaft — and page 8 does that accounting with numbers.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), two vignettes side by side in thin dim-grey line art. Left vignette: a small hand-crank generator drawn as a coil between two magnet blocks with a handle, the circuit open at a switch, a dark unlit bulb, and a light thin curved arrow on the handle suggesting easy turning. Right vignette: the identical device with the switch closed, small orange current arrows running round the circuit, a brightly glowing amber bulb, and a much thicker curved arrow on the handle with short opposing tick marks suggesting resistance to turning. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Lenz\'s law is the **minus sign** in $ \\varepsilon = -N\\frac{d\\Phi}{dt} $, made physical.\n- The induced current opposes the **change** in flux — never "the flux".\n- Flux growing → induced field **against** it. Flux falling → induced field **with** it.\n- The reason is **energy conservation**: assistance would give a runaway machine producing free energy.\n- So a magnet pushed towards a coil is **repelled**, and pulled away from one is **attracted**.\n- The work you do against that force is exactly the electrical energy that appears.',
    }),
    b('text', 12, {
      markdown: 'Next: knowing the law is not the same as being able to apply it under pressure. The next page turns it into a routine you can run in four steps, every time.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('Lenz\'s law says that the induced current opposes',
          ['the change in flux producing it', 'the flux through the circuit', 'the current in the circuit', 'the motion of the electrons'],
          0,
          'The distinction matters most when the flux is falling: there the induced current supports the existing flux while still fighting its decrease. Only the change is ever opposed.',
          2),
        q('The magnetic flux into a loop is decreasing. The induced current',
          ['acts to maintain the into-page flux', 'acts to cancel the into-page flux', 'is zero because the flux is falling', 'reverses direction twice each second'],
          0,
          'The change here is a decrease, so the induced current fights the decrease by propping the flux up. Its own field therefore points the same way as the field already present.',
          3),
        q('If the induced effect assisted the change instead of opposing it, then',
          ['energy would be created from nothing', 'the emf would simply be larger', 'the current would flow more slowly', 'nothing physical would change'],
          0,
          'A magnet nudged towards a coil would accelerate itself while the coil delivered a rising current — kinetic and electrical energy from a single small push. Conservation of energy is what forces the sign to be a minus.',
          2),
      ],
    }),
  ],
};

// ── p5 · Reading a Lenz's Law Situation ──────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'emi-reading-a-lenz-situation',
  title: 'Reading a Lenz\'s Law Situation',
  subtitle: 'Four steps, in the same order, every time',
  glossary: [
    { term: 'positive sense', definition: 'The direction of circulation round a loop given by the right hand with the thumb along the chosen normal — anticlockwise seen from the tip of the normal.' },
    { term: 'induced pole', definition: 'The effective magnetic pole a current-carrying coil presents on a given face. The face acts as a north pole if the current runs anticlockwise when viewed from that side.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Ask a class to state Lenz\'s law and almost everyone can. Ask the same class which way the current goes in a particular picture, and the room divides roughly in half.\n\nThat gap is not a knowledge problem. It is a **procedure** problem.\n\nKnowing the law is one thing; running it under exam pressure, on an unfamiliar diagram, without talking yourself out of the right answer, is another. So this page does not add any new physics. It turns page 4 into four fixed steps, taken in the same order every time — and then runs them on the three situations that come up most.',
    }),
    b('text', 1, {
      markdown: 'The routine is short, and the order is what makes it reliable. Do not merge steps and do not skip ahead to the answer.',
    }),
    b('latex_block', 2, {
      latex: '\\text{Which way is } \\Phi \\;\\rightarrow\\; \\text{growing or shrinking} \\;\\rightarrow\\; \\text{oppose THAT} \\;\\rightarrow\\; \\text{read off current, pole, force}',
      label: 'The four-step routine',
      note: 'Step 2 is the one people skip, and it is the one that decides the direction. Never jump from step 1 to step 3.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: '**Step 1 — which way does the flux point through the loop?** Not the current, not the force. Just the field, at the loop, and which way it threads it. If it helps, choose your normal along it so the flux starts positive.\n\n**Step 2 — is that flux growing or shrinking?** This is the step the whole answer turns on, and it is the one that gets skipped. "Into the page" is not an answer to this question; "into the page and increasing" is.\n\n**Step 3 — the induced current opposes *that change*.** If the flux is growing, the induced current makes a field the *other* way inside the loop. If it is shrinking, the induced current makes a field the *same* way, to hold it up. Then curl your right hand to convert that required field into a direction of current.\n\n**Step 4 — read off whatever the question asked for.** The pole facing the magnet, the force on the loop, the direction through a named resistor. All of these follow from the current, once you have it.\n\nOne shortcut worth having for step 4: **a coil face acts as a north pole if, looking at that face, the current runs anticlockwise**; as a south pole if it runs clockwise. That single sentence converts a current into a pole and back again.',
    }),
    b('heading', 4, {
      text: 'Situation one — a magnet approaching a coil',
      level: 2,
      objective: 'Run the four-step routine on a magnet moving towards a coil and predict the current, the pole and the force.',
    }),
    b('step_solver', 5, {
      title: 'North pole moving towards a coil',
      problem: 'A bar magnet is moved towards a circular coil with its **north pole leading**. Find the direction of the induced current, the pole the coil presents to the magnet, and the force between them.',
      intro: 'Take the normal $ \\hat{n} $ along the magnet\'s field at the coil — that is, pointing away from the approaching north pole. With that choice the flux starts positive, and there is only one sign to track.',
      steps: [
        st('Step 1 — flux is along $ \\hat{n} $, so $ \\Phi > 0 $',
          'Field lines leave a north pole, so at the coil the magnet\'s field points away from the magnet — straight through the coil, along the normal we chose.', {
            check: {
              kind: 'mcq',
              prompt: 'Which way does the magnet\'s field point where the coil is?',
              options: ['Back towards the magnet', 'Away from the magnet, through the coil', 'Round the coil, in its plane', 'There is no field until they touch'],
              answer_index: 1,
              feedback_right: 'Yes — field lines emerge from a north pole, so beyond it they run away from the magnet and thread the coil.',
              feedback_wrong: 'Field lines emerge from a north pole and return to a south pole. Since it is the north pole that faces the coil, the field at the coil points away from the magnet and passes through it.',
            },
          }),
        st('Step 2 — the magnet is getting closer, so $ \\Phi $ is **growing**',
          'The field of a magnet is stronger nearer to it. As the gap shrinks, more field threads the coil every instant, so $ \\frac{d\\Phi}{dt} > 0 $.', {
            check: {
              kind: 'mcq',
              prompt: 'The magnet is halfway in and still moving. What is the flux doing?',
              options: ['Constant, since the magnet is unchanged', 'Growing, since the field at the coil is rising', 'Shrinking, since the magnet is passing by', 'Zero, since the magnet is not inside yet'],
              answer_index: 1,
              feedback_right: 'Correct — closer magnet, stronger field at the coil, larger flux. It is the trend that matters, not the instantaneous value.',
              feedback_wrong: 'The magnet itself never changes, but its field at the coil does: it grows as the distance shrinks. Faraday\'s law only ever asks about the trend, not the value.',
            },
          }),
        st('Step 3 — oppose the growth: the induced field inside the coil must point **back towards the magnet**',
          'By Faraday, $ \\varepsilon = -N\\frac{d\\Phi}{dt} $ is negative, so the current runs in the negative sense about $ \\hat{n} $. Physically: the coil sets up a field against $ \\hat{n} $, cutting the growth down.'),
        st('Step 4 — the near face is a **north** pole, so the magnet is **repelled**',
          'The coil\'s own field points towards the magnet inside the coil, so the face towards the magnet is a north pole. Seen from the magnet, the current runs anticlockwise. Two north poles face each other, and they push apart — so you must keep pushing to get the magnet in.', {
            check: {
              kind: 'mcq',
              prompt: 'What does the repulsion mean for the person pushing the magnet?',
              options: ['They must do work, which becomes electrical energy', 'The magnet is pulled in and does the work for them', 'No work is needed either way', 'The coil heats up without any energy input'],
              answer_index: 0,
              feedback_right: 'Exactly — the work done against the repulsion is precisely the electrical energy that appears in the coil.',
              feedback_wrong: 'Repulsion means the magnet resists being brought closer, so the person must push against it. That work is the source of the electrical energy — nothing is produced free.',
            },
          }),
      ],
      now_you_try: {
        problem: 'The same magnet is now **pulled away** from the coil, north pole still facing it. Redo the four steps: which way does the current run, what pole does the near face become, and is the magnet pushed or pulled?',
        answer: 'The current reverses. The near face becomes a **south** pole, and the magnet is **attracted** — so you must pull against that attraction.',
        solution: 'Step 1 is unchanged: the flux still points away from the magnet, through the coil, so $ \\Phi > 0 $.\n\nStep 2 flips: the magnet is receding, the field at the coil is weakening, so $ \\Phi $ is now **shrinking**.\n\nStep 3 therefore flips too. The change to be opposed is a *decrease*, so the induced current now works to **hold the flux up** — its field points the same way as the magnet\'s, along $ \\hat{n} $. That is the opposite circulation from before.\n\nStep 4: with the coil\'s field now pointing away from the magnet inside the coil, the face towards the magnet is a **south** pole. A south pole facing a north pole attracts, so the coil clings to the departing magnet and you must pull against it.\n\n**The pattern worth carrying away:** approach is always resisted, and departure is always resisted. Whichever way you move the magnet, the coil makes it harder — which is Lenz\'s law and energy conservation saying the same thing twice.',
      },
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'spatial',
      prompt: 'Now hold the magnet perfectly still, north pole facing the coil, and move the **coil** towards the magnet at the same speed as before. What changes?',
      options: [
        'The current reverses, because it is now the coil that moves',
        'Nothing changes — the current, the pole and the force are the same',
        'There is no current, because the magnet is stationary',
        'The current is halved, since only one object is moving',
      ],
      reveal: '**Nothing changes.** Same current, same pole, same force.\n\nRun the routine and see why it cannot be otherwise. Step 1 asks which way the flux points — unchanged. Step 2 asks whether it is growing — and it is, at exactly the same rate, since the gap is closing at the same speed. Steps 3 and 4 follow from step 2 alone.\n\n**Nowhere does the routine ask who is doing the moving.** It asks only what the flux is doing, and the flux through a coil depends on the separation, not on which object a bystander thinks is at rest.\n\nThis is the relative-motion result from page 1, arriving now as a consequence rather than an observation. And it is more than a convenience — the fact that the physics cannot tell the two cases apart is a hint of something much larger, which Einstein took up in 1905. His paper on relativity opens with exactly this example.\n\n**Practical version, for an exam:** never spend time deciding who is moving. Ask only whether the gap is opening or closing.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Situation two — a loop leaving a field',
      level: 2,
      objective: 'Apply the routine where the area, not the field, is what changes, and find the direction of the retarding force.',
    }),
    b('worked_example', 8, {
      label: 'a loop pulled out of a field region',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A rectangular loop lies in a region of uniform magnetic field directed **into the page**. It is pulled steadily to the **right**, out of the field region. Find the direction of the induced current as seen by the reader, and the direction of the force on the loop.',
      solution: '**Which door is this?** The field is fixed and the orientation is fixed. What changes is the **area** of the loop still inside the field — this is the second of the three doors from page 3.\n\n**Step 1 — the flux.** Take $ \\hat{n} $ into the page, along the field. Then $ \\Phi = BA > 0 $, where $ A $ is the area still inside the field region.\n\n**Step 2 — growing or shrinking?** As the loop slides right, less and less of it remains in the field, so $ A $ falls and $ \\Phi $ **shrinks**.\n\n**Step 3 — oppose the shrinking.** The change is a decrease, so the induced current must work to **keep the into-page flux going**. Its own field inside the loop must therefore point **into the page**, the same way as the field already there.\n\nCurl the right hand with the thumb into the page: the fingers run **clockwise** as you look at the page. So the induced current is **clockwise**.\n\n**Step 4 — the force.** The only arm still carrying current in the field is the **left** arm of the loop, and a clockwise circulation carries current **upward** in that arm. With $ \\vec{F} = I\\vec{l}\\times\\vec{B} $, current up and field into the page give a force to the **left** — opposing the pull.\n\n**Check it against Lenz directly.** Had the force been to the right, the loop would have accelerated out of the field on its own, producing current for free. It must retard the motion, and it does.\n\n**And the shortcut this earns you.** For any loop entering or leaving a field, you can write down the direction of the force without any of the above: **it always opposes the motion.** Use the full routine for the *current*, and Lenz\'s law directly for the *force*.',
    }),
    b('table', 9, {
      caption: 'The four standard situations, run through the routine. Cover the last two columns and try each yourself.',
      headers: ['Situation', 'Flux', 'Induced current opposes by', 'Force felt'],
      rows: [
        ['North pole moving **towards** a coil', 'growing', 'making the near face a north pole', 'repulsion — push harder'],
        ['North pole moving **away** from a coil', 'shrinking', 'making the near face a south pole', 'attraction — pull harder'],
        ['Loop **entering** a field region', 'growing', 'opposing the entering flux', 'retards the entry'],
        ['Loop **leaving** a field region', 'shrinking', 'supporting the leaving flux', 'retards the exit'],
      ],
    }),
    b('image', 10, {
      src: '',
      alt: 'A rectangular loop being pulled out of a field region, with the induced clockwise current and the retarding force marked',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The current runs clockwise to hold the vanishing flux up, and the resulting force pulls back.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. A square region on the left filled with a regular array of small dim-orange cross symbols indicating a field into the page, with a clear boundary line at its right edge. A rectangular loop drawn in warm amber wire straddles that boundary, its left arm still inside the field region and its right arm outside. Small bright orange arrowheads on the loop show a clockwise circulation. A bold bright amber arrow points right, away from the field, labelled v, and a second bold arrow of similar weight points left, drawn at the left arm of the loop, labelled F. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Step 1:** which way does the flux thread the loop? **Step 2:** growing or shrinking? **Step 3:** oppose *that*. **Step 4:** read off current, pole, force.\n- Step 2 is the one that gets skipped, and it is the one that decides the direction.\n- Growing flux → induced field the **other** way. Shrinking flux → induced field the **same** way.\n- A face carrying **anticlockwise** current, seen from your side, is a **north** pole.\n- Never ask who is moving. Ask only whether the gap or the enclosed area is growing or shrinking.\n- The force on a loop entering or leaving a field **always** opposes its motion — no working needed.',
    }),
    b('text', 12, {
      markdown: 'Next: the routine tells you which way the current flows in a loop leaving a field, but not how big it is. For that we need to work out the emf of a moving conductor from scratch — and it can be done in two completely different ways that had better agree.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('A bar magnet approaches a coil with its north pole leading. The face of the coil towards the magnet behaves as',
          ['a north pole, repelling the magnet', 'a south pole, attracting the magnet', 'a north pole, attracting the magnet', 'neither pole until they touch'],
          0,
          'The flux is growing, so the induced current opposes the growth by setting up a field back towards the magnet — which makes the near face a north pole. Two like poles repel, which is why the magnet must be pushed in.',
          2),
        q('A rectangular loop is pulled out of a region of uniform field. The force on it from the induced current',
          ['opposes the pull, so work must be done', 'assists the pull, so no work is needed', 'is zero while any part is still inside', 'acts at right angles to the pull'],
          0,
          'If the force helped the loop leave, it would accelerate out on its own while delivering current — energy from nothing. The force must retard the motion, and the work done against it becomes the electrical energy.',
          3),
        q('In the four-step routine, deciding that the induced current opposes the change fixes',
          ['which way round the loop it flows', 'how large the induced emf is', 'how long the current lasts', 'the resistance of the loop'],
          0,
          'Faraday\'s law gives the size of the emf from the rate of change of flux; Lenz\'s law is what settles the direction of circulation. The two answer different halves of the question.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p1, p2, p3, p4, p5]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
