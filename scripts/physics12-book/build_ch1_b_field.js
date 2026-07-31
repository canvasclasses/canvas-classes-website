'use strict';
/**
 * Class 12 Physics · Ch.1 "Electrostatics" — pages 6–9.
 * The electric field, field lines, fields from continuous charge, and the
 * motion of a charge in a uniform field.
 *
 * Run: node scripts/physics12-book/build_ch1_b_field.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 1;

// ── p6 · The Electric Field ──────────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'the-electric-field',
  title: 'The Electric Field',
  subtitle: 'Stop asking what the force is. Ask what the space is doing.',
  glossary: [
    { term: 'electric field', definition: 'The condition a charge creates in the space around it — measured as the force per unit positive charge that a tiny test charge would feel there.' },
    { term: 'test charge', definition: 'An imaginary charge so small that placing it somewhere does not disturb the charges producing the field.' },
    { term: 'source charge', definition: 'The charge (or set of charges) that produces the field being described.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'The Sun is about 8 light-minutes away. Suppose it suddenly vanished. How long before the Earth stopped feeling its pull — instantly, or 8 minutes later?',
      hint: 'Nothing in physics travels faster than light. Including news.',
      reveal: '**8 minutes later.**\n\nAnd that answer is fatal to the idea that one body simply "reaches across" empty space and grabs another. If the force were direct and instantaneous, the Earth would swerve the moment the Sun disappeared — before any light of the event could reach us.\n\nSo the pull cannot be direct. Something must **already be in the space** around the Sun, holding the information about where the Sun is and how heavy it is. Remove the Sun and that something has to re-arrange itself, and the re-arrangement spreads outward at the speed of light.\n\nElectricity works the same way. A charge does not reach out and grab another charge. It fills the space around it with an **electric field**, and the field is what does the pushing.',
    }),
    b('text', 1, {
      markdown: 'This splits every electrostatics problem into two clean halves:\n\n1. Some charges **produce** a field in the space around them.\n2. That field **exerts a force** on any charge placed in it.\n\nThe second half is easy. The first half is what the rest of this chapter is about.\n\nTo measure the field at a point, put a small positive **test charge** $ q_0 $ there and measure the force on it. The field is the force per unit charge:',
    }),
    b('latex_block', 2, {
      latex: '\\vec{E} = \\lim_{q_0 \\to 0}\\ \\frac{\\vec{F}_e}{q_0}',
      label: 'Definition of electric field strength',
      note: 'Unit: N/C. Later, when potential arrives, you will also see it written V/m — the same thing.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Why the limit $ q_0 \\to 0 $? Because a real test charge would push the source charges around and change the very field you were trying to measure — especially if the source is a conductor, whose charges are free to move. The limit says: **use a charge small enough to be a spy, not an intruder.**\n\nThe field is a vector, and it points along the force that a **positive** test charge would feel. So once you know $ \\vec{E} $ at a point, the force on any charge $ q $ placed there is',
    }),
    b('latex_block', 4, {
      latex: '\\vec{F} = q\\vec{E}',
      label: 'Force on a charge in a field',
      note: 'For a positive charge the force is along E. For a negative charge it is exactly opposite to E — this is the single most-missed sign in the chapter.',
      highlight: true,
    }),
    b('heading', 5, {
      text: 'The field of a point charge',
      level: 2,
      objective: 'Write down the field of a point charge and get its direction right for either sign.',
    }),
    b('text', 6, {
      markdown: 'Take Coulomb\'s law, divide by the test charge, and the test charge disappears from the answer — which is exactly what "the field belongs to the space, not to the probe" means:',
    }),
    b('latex_block', 7, {
      latex: 'E = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{r^{2}}',
      label: 'Field of a point charge',
      note: 'Directed AWAY from a positive charge and TOWARDS a negative charge.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'And because forces superpose, so do fields. The field of several charges is the **vector sum** of what each would produce alone:\n\n$ \\vec{E} = \\vec{E}_1 + \\vec{E}_2 + \\cdots $\n\nWhen the charges are given as coordinates, use the vector form. If a charge $ q $ sits at $ \\vec{r}_q $ and you want the field at $ \\vec{r}_P $:\n\n$ \\vec{E} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{|\\vec{r}_P-\\vec{r}_q|^{3}}\\,(\\vec{r}_P-\\vec{r}_q) $\n\nSubstitute $ q $ **with its sign** and the direction takes care of itself.',
    }),
    b('worked_example', 9, {
      label: 'field from a charge given by coordinates',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: "A charge $ q = 1\\ \\mu\\text{C} $ sits at the point $ (1\\ \\text{m},\\ 2\\ \\text{m},\\ 4\\ \\text{m}) $. Find the electric field at the point $ P(0,\\ -4\\ \\text{m},\\ 3\\ \\text{m}) $.",
      solution: "Write both positions as vectors:\n\n$ \\vec{r}_q = \\hat{i} + 2\\hat{j} + 4\\hat{k}, \\qquad \\vec{r}_P = -4\\hat{j} + 3\\hat{k} $\n\nThe vector **from the charge to the field point** is\n\n$ \\vec{r}_P - \\vec{r}_q = -\\hat{i} - 6\\hat{j} - \\hat{k} $\n\nIts magnitude:\n\n$ |\\vec{r}_P-\\vec{r}_q| = \\sqrt{(-1)^{2}+(-6)^{2}+(-1)^{2}} = \\sqrt{38}\\ \\text{m} $\n\nNow substitute into the vector form:\n\n$ \\vec{E} = \\frac{(9.0\\times10^{9})(1.0\\times10^{-6})}{(38)^{3/2}}\\left(-\\hat{i}-6\\hat{j}-\\hat{k}\\right) $\n\n$ \\vec{E} = \\left(-38.4\\,\\hat{i} - 230.5\\,\\hat{j} - 38.4\\,\\hat{k}\\right)\\ \\text{N/C} $\n\n**Two habits to take from this.** First, the direction fell out of the algebra — a positive charge gives a field pointing away from it, and every component here does exactly that. Second, once the answer is in $ \\hat{i},\\hat{j},\\hat{k} $ form you are **done**. There is no need to convert to a magnitude and two angles unless the question asks.",
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'At a certain point the electric field is $ 10^{5} $ N/C pointing due west. What force acts on a charge of $ -5\\ \\mu\\text{C} $ placed there?',
      options: ['0.5 N due east', '0.5 N due west', '$ 5 \\times 10^{-11} $ N due west', 'Zero — negative charges are not affected'],
      reveal: '**0.5 N due east.**\n\nMagnitude: $ F = |q|E = (5\\times10^{-6})(10^{5}) = 0.5 $ N.\n\nDirection: the charge is **negative**, so the force is exactly opposite to $ \\vec{E} $. The field points west, so the force points east.\n\nThe field itself is unchanged by what you put in it — it was already there, made by other charges. All the negative sign does is flip which way the force points.',
      difficulty_level: 2,
    }),
    b('heading', 11, {
      text: 'Adding fields — the four-corner problem',
      level: 2,
      objective: 'Add three field vectors using symmetry instead of brute-force components.',
    }),
    b('worked_example', 12, {
      label: 'field at the fourth corner of a square',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Three equal charges $ +q $ sit at three corners of a square of side $ a $. Find the magnitude of the electric field at the fourth corner.',
      solution: "Label the empty corner $ P $. Two of the charges are **adjacent** to it, each a distance $ a $ away. The third is **diagonal**, a distance $ a\\sqrt{2} $ away.\n\n**The two adjacent charges.** Each produces a field of magnitude\n\n$ E_1 = \\frac{kq}{a^{2}} $\n\ndirected away from that charge, i.e. along one edge of the square. The two edges meet at $ 90^\\circ $, so these two fields add to\n\n$ E_{\\text{adj}} = \\sqrt{E_1^{2}+E_1^{2}} = \\sqrt{2}\\,\\frac{kq}{a^{2}} $\n\nand — this is the useful bit — the resultant of two equal perpendicular vectors bisects the angle, so it points **along the diagonal**, outward from the square.\n\n**The diagonal charge.** Distance $ a\\sqrt{2} $, so\n\n$ E_2 = \\frac{kq}{(a\\sqrt{2})^{2}} = \\frac{kq}{2a^{2}} $\n\nand it too points along the diagonal, outward. **Same line, same direction** — so now it is simple addition, no vectors needed.\n\n$ E_P = \\sqrt{2}\\,\\frac{kq}{a^{2}} + \\frac{1}{2}\\cdot\\frac{kq}{a^{2}} = \\left(\\sqrt{2}+\\tfrac{1}{2}\\right)\\frac{kq}{a^{2}} \\approx 1.91\\,\\frac{kq}{a^{2}} $\n\ndirected along the diagonal, away from the square.\n\n**Shortcut worth keeping.** Combining the two symmetric charges *first* turned a three-vector problem into a one-line sum. Look for the symmetric pair before you start resolving components — it is almost always there in these arrangements.",
    }),
    b('image', 13, {
      src: '',
      alt: 'Square with three positive charges and the three field vectors at the empty fourth corner adding along the diagonal',
      width: 'two_third',
      aspect_ratio: '1:1',
      caption: 'Combine the symmetric pair first. Their resultant lands on the same diagonal as the third field.',
      generation_prompt: 'Clean scientific vector diagram on a near-black background (#0B0C0F). A square outlined in thin dim-grey lines. Three corners carry small warm amber circles marked with plus signs; the top-right corner is empty and marked with a small hollow ring labelled P. From P, two medium orange arrows point outward along the two edge directions, one faint dashed orange arrow along the diagonal representing their resultant, and one more orange arrow along the same diagonal from the far corner. A single bold amber arrow along the diagonal shows the total. Muted white minimal labels, generous dark space, orange accent, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{E} = \\vec{F}/q_0 $ with $ q_0 \\to 0 $. Unit N/C.\n- Point charge: $ E = kq/r^{2} $, away from $ + $, towards $ - $.\n- $ \\vec{F} = q\\vec{E} $ — along $ \\vec{E} $ for a positive charge, **opposite** for a negative one.\n- Fields superpose as vectors. Combine symmetric pairs first; it usually collapses the problem.\n- A null point of the **force** is a null point of the **field** — same place, because the test charge cancels out of the condition.',
    }),
    b('text', 15, {
      markdown: 'Next: a field is a vector at every point in space, which is impossible to draw honestly. Faraday found a way around that.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The electric field at a point due to a point charge is $ E $. If the test charge used to measure it is doubled, the measured field becomes',
          ['$ E $', '$ 2E $', '$ E/2 $', '$ 4E $'],
          0,
          'The field is force **per unit charge**. Doubling the test charge doubles the force too, and the ratio is unchanged. The field belongs to the source charge and the point in space, not to whatever you probe it with.',
          1),
        q('Two point charges $ +Q $ and $ -Q $ are placed a distance $ d $ apart. At the midpoint of the line joining them, the electric field is',
          ['$ 8kQ/d^{2} $, pointing from the positive towards the negative charge', 'zero', '$ 4kQ/d^{2} $, pointing from the negative towards the positive charge', '$ 2kQ/d^{2} $, pointing from the positive towards the negative charge'],
          0,
          'Each charge is $ d/2 $ from the midpoint, so each contributes $ kQ/(d/2)^{2} = 4kQ/d^{2} $. The positive charge pushes away from itself and the negative charge pulls towards itself — **both point the same way**, so they add to $ 8kQ/d^{2} $. Answering zero means you treated the fields as if they opposed, which is what happens for two *like* charges.',
          3),
        q('Which statement about $ \\vec{F} = q\\vec{E} $ is correct?',
          ['A negative charge experiences a force opposite to the field', 'A negative charge experiences no force', 'The force is always along the field, whatever the sign', 'The field reverses direction when a negative charge is placed in it'],
          0,
          'The sign of $ q $ flips the direction of the force but does nothing at all to $ \\vec{E} $, which was created by other charges and does not know what you put into it.',
          2),
      ],
    }),
  ],
};

// ── p7 · Electric Field Lines ────────────────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'electric-field-lines',
  title: 'Electric Field Lines',
  subtitle: "Faraday's map — and the four things it can and cannot tell you",
  glossary: [
    { term: 'electric field line', definition: 'An imaginary curve drawn so that its tangent at every point gives the direction of the electric field there.' },
    { term: 'uniform field', definition: 'A region where the electric field has the same magnitude and direction everywhere — drawn as straight, parallel, equally spaced lines.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Michael Faraday had almost no formal mathematics. He could not write the integral for a field, so he did something else: he **drew** it.\n\nHe imagined lines threading through space, following the direction of the force everywhere. Physicists at the time thought it was a crutch for someone who could not do the algebra.\n\nMaxwell then took those pictures and turned them into the equations that describe all of electromagnetism — and said outright that he was translating Faraday\'s ideas into symbols. The picture came first.',
    }),
    b('text', 1, {
      markdown: 'A field is a vector at **every** point in space. You cannot draw an arrow at every point — the page would be solid ink. Faraday\'s answer: join the arrows into continuous curves.\n\n> An **electric field line** is a line drawn so that the tangent at any point gives the direction of $ \\vec{E} $ at that point.\n\nAnd the spacing carries the magnitude: **where the lines crowd together, the field is strong; where they spread out, it is weak.**\n\nThat one picture now has to obey some rules, and each rule is a physical fact in disguise.',
    }),
    b('heading', 2, {
      text: 'The rules — and the reason behind each',
      level: 2,
      objective: 'Justify each rule from physics rather than memorising the list.',
    }),
    b('table', 3, {
      caption: 'Every rule about field lines is a physical statement wearing a picture.',
      headers: ['Rule', 'Because'],
      rows: [
        ['Lines start on positive charge and end on negative charge', 'The field points away from $ + $ and towards $ - $. Lines never simply begin or stop in empty space.'],
        ['The number of lines is proportional to the charge', 'A $ +4\\ \\mu\\text{C} $ charge drawn with 100 lines means a $ -3\\ \\mu\\text{C} $ charge must take 75 of them.'],
        ['Two lines can never cross', 'At the crossing point you could draw two tangents, so the field would have two directions at once. Impossible.'],
        ['Lines never form closed loops', 'A closed loop would mean a line starting and ending on the same charge — and it would let you gain energy going round, which the force being conservative forbids.'],
        ['In a uniform field the lines are straight, parallel and equally spaced', 'Same direction everywhere, same crowding everywhere.'],
        ['No lines exist inside a conductor', 'The field inside a conductor in electrostatic equilibrium is zero, and zero field means no line.'],
        ['Lines meet a conductor surface at right angles', 'Any sideways component would push the surface charges along the surface — and then it would not be equilibrium.'],
      ],
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'spatial',
      prompt: 'A student draws two electric field lines that cross at a point, and argues it is fine because the field there is just the vector sum of two directions. What is wrong?',
      options: ['At a crossing the field would have two different directions at once, which is impossible', 'Crossing is fine for unlike charges, because there the two sets of lines merge', 'Field lines may cross only inside a conductor, where the field is zero anyway', 'Nothing is wrong — the crossing point simply has a stronger field than elsewhere'],
      reveal: '**A field has exactly one direction at each point.**\n\nThe tangent to a field line *is* the direction of $ \\vec{E} $ there. If two lines crossed, you could draw two different tangents at the crossing point, and the field would be pointing two ways at once.\n\nThe student\'s instinct is not silly — fields **do** add as vectors. But the addition happens *before* you draw the map: you add the contributions to get one field vector at each point, and *then* you draw one line through it. The lines are the answer, not the ingredients.',
      difficulty_level: 2,
    }),
    b('image', 5, {
      src: '',
      alt: 'Six standard electric field line patterns: single positive, single negative, two unlike, two like positive, two like negative, and unequal charges',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The six patterns worth being able to draw from memory. Count the lines to read off the relative charges.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), a two-by-three grid of six small field-line patterns drawn in thin dim-orange curves, each panel separated by generous dark space. Panel 1: single warm amber sphere with a plus, straight lines radiating outward. Panel 2: single cool blue sphere with a minus, straight lines converging inward. Panel 3: a plus and a minus side by side, curved lines running from the plus to the minus. Panel 4: two amber plus spheres, lines curving away from each other with a clear empty null region between them. Panel 5: two blue minus spheres, mirror of panel 4 with lines converging. Panel 6: a large amber sphere labelled 2q and a smaller blue sphere labelled q, with twice as many lines leaving the large one as enter the small one, and some lines escaping to infinity. Muted white minimal labels, orange and blue accents only, no clutter.',
    }),
    b('heading', 6, {
      text: 'What a field-line picture will NOT tell you',
      level: 2,
      objective: 'Name the two things students routinely read off a field-line diagram that are not there.',
    }),
    b('text', 7, {
      markdown: '**A field line is not a trajectory.** This is the big one.\n\nA charged particle released from rest does start off along the field line — the force is along the field. But the moment it is moving, it has momentum, and the next bit of force does not have to be along its velocity. On a **curved** field line the particle carries straight on and drifts off the line, exactly as a car carries on when the road bends.\n\nA field line is a trajectory only in the special case where the lines are **straight** and the particle starts at rest.\n\n**A field line does not show the force on a neutral body.** A neutral object still gets polarised and still gets pulled towards the strong-field region — nothing in the line picture makes that obvious.',
    }),
    b('callout', 8, {
      variant: 'warning',
      title: 'Two half-truths worth un-learning',
      markdown: '"A charged particle always moves along the field." — **False.** Only if it starts from rest *and* the line is straight.\n\n"The field of a point charge is uniform, because the lines are straight." — **False.** Straight lines are not enough; the *spacing* must also be constant. Around a point charge the lines fan out, so the field weakens with distance. A uniform field needs straight, parallel **and equally spaced**.',
    }),
    b('heading', 9, {
      text: 'Reading a picture backwards',
      level: 2,
      objective: 'Deduce the signs and relative sizes of unknown charges from a field-line diagram.',
    }),
    b('text', 10, {
      markdown: 'Exams love this direction. Given the lines, find the charges. Three questions get you there every time:\n\n1. **Do the lines leave or arrive?** Leaving means positive, arriving means negative.\n2. **How many lines at each charge?** The ratio of line counts is the ratio of the charge magnitudes.\n3. **Where are the lines densest?** That is where the field is strongest — and it is usually right next to the largest charge, or between two unlike charges.\n\nA fourth clue, for like charges: look for the **null point**, the place where no line passes and the field is zero. Two equal like charges have it exactly at the midpoint; unequal ones have it nearer the smaller charge.',
    }),
    b('text', 11, {
      markdown: 'Next: so far every charge has been a point. Real charge is spread over wires, rings, sheets and spheres — which needs a new technique.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('Electric field lines can never form closed loops. The reason is that',
          ['the electrostatic force is conservative', 'a closed loop would make the field far too strong', 'loops occur only in magnetic fields, because magnets are stronger', 'charge is quantised in whole multiples of $ e $'],
          0,
          'Going once round a closed line you would return to your starting point having been pushed the whole way — you would gain energy from nothing. That is exactly what a conservative force forbids. (Magnetic field lines *do* close on themselves, and that is a genuine difference between the two fields.)',
          3),
        q('In a diagram, 60 field lines leave charge A and 20 lines end on charge B. The charges are',
          ['A positive, B negative, with $ |q_A| = 3|q_B| $', 'A positive, B negative, with $ |q_A| = |q_B| $', 'both positive, with $ |q_A| = 3|q_B| $', 'A negative, B positive, with $ |q_A| = 3|q_B| $'],
          0,
          'Lines leaving means positive; lines ending means negative. The line count is proportional to the magnitude, so 60 versus 20 gives a ratio of 3 to 1. The 40 unaccounted lines simply run off to infinity, which is what must happen when the positive charge is the larger one.',
          2),
        q('A charged particle is released from rest on a **curved** electric field line. It will',
          ['start along the line but then leave it', 'follow the line exactly all the way', 'move perpendicular to the line', 'stay at rest'],
          0,
          'The initial force is along the line, so it sets off correctly. But once it has velocity, its momentum carries it forward while the field direction keeps turning — so it drifts off the curve. Trajectory and field line coincide only when the line is straight.',
          3),
      ],
    }),
  ],
};

// ── p8 · When Charge Is Spread Out ───────────────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'when-charge-is-spread-out',
  title: 'When Charge Is Spread Out',
  subtitle: 'Ring, rod and sheet — the slice-and-add method',
  glossary: [
    { term: 'linear charge density', definition: 'Charge per unit length, $ \\lambda $, measured in C/m. Used for wires, rods and rings.' },
    { term: 'surface charge density', definition: 'Charge per unit area, $ \\sigma $, measured in C/m². Used for sheets and conductor surfaces.' },
    { term: 'volume charge density', definition: 'Charge per unit volume, $ \\rho $, measured in C/m³. Used for solid charged bodies.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A ring of radius $ R $ carries a charge $ q $ spread evenly around it. What is the electric field at the exact centre of the ring?',
      hint: 'Pick any small piece of the ring. What is directly opposite it?',
      reveal: '**Exactly zero.**\n\nTake any tiny piece of the ring. Directly across the circle sits an identical piece, the same distance away, pushing in exactly the opposite direction. They cancel. Pair up the whole ring this way and nothing is left.\n\nNotice that we got that without a single integral. **Symmetry did the work.** That is the theme of this page: set up the integral, then look hard for the symmetry that kills half of it before you compute anything.',
    }),
    b('text', 1, {
      markdown: 'Real charge is not a set of points. It sits along wires, over plates, through solids. We describe it with a **density**:\n\n- **$ \\lambda $** — charge per unit **length** (C/m), for a rod, wire or ring\n- **$ \\sigma $** — charge per unit **area** (C/m²), for a sheet or a conductor surface\n- **$ \\rho $** — charge per unit **volume** (C/m³), for a solid charged body\n\nAnd then the recipe is always the same four moves.',
    }),
    b('table', 2, {
      caption: 'The slice-and-add method. Every continuous-charge problem in this chapter is these four steps.',
      headers: ['Step', 'What you do'],
      rows: [
        ['1 · Slice', 'Cut the body into pieces so small that each is a point charge $ dq $.'],
        ['2 · Field of one slice', 'Write $ dE = \\frac{k\\,dq}{r^{2}} $ and note its direction.'],
        ['3 · Use symmetry', 'Find the component that cancels against a partner slice, and drop it. Keep only the surviving component.'],
        ['4 · Integrate', 'Add the surviving components over the whole body.'],
      ],
    }),
    b('heading', 3, {
      text: 'A charged ring, on its axis',
      level: 2,
      objective: 'Derive the axial field of a ring and read three physical results straight off the formula.',
    }),
    b('step_solver', 4, {
      title: 'The field on the axis of a charged ring',
      problem: 'A ring of radius $ R $ carries a total charge $ q $ spread uniformly. Find the electric field at a point $ P $ on its axis, a distance $ x $ from the centre.',
      intro: 'Four steps, and step 3 is where the real physics happens. Watch which component dies.',
      steps: [
        st('$ dq = \\frac{q}{2\\pi R}\\,dl \\qquad r = \\sqrt{x^{2}+R^{2}} $',
          'Slice the ring into arcs of length $ dl $. Every slice is the same distance $ r $ from $ P $ — that is the gift the ring gives you.'),
        st('$ dE = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{dq}{x^{2}+R^{2}} $',
          'The field of one slice, pointing from the slice towards $ P $ along the slant.'),
        st('$ dE_x = dE\\cos\\theta, \\qquad \\cos\\theta = \\frac{x}{\\sqrt{x^{2}+R^{2}}} $',
          'Split it into a component along the axis and one perpendicular to it.', {
            check: {
              kind: 'mcq',
              prompt: 'What happens to the perpendicular components when you add up the whole ring?',
              options: ['They add up to a large sideways field', 'They cancel in pairs, because every slice has an opposite partner', 'They are always zero for each slice individually', 'They cancel only when $ x = 0 $'],
              answer_index: 1,
              feedback_right: 'Exactly — and that is why only the axial component survives, for every $ x $.',
              feedback_wrong: 'Look across the ring. For every slice there is a diametrically opposite one whose perpendicular component is equal and opposite. Each individual slice does have a perpendicular component; it is the **sum** that vanishes.',
            },
          }),
        st('$ E_x = \\displaystyle\\int dE_x = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{x}{(x^{2}+R^{2})^{3/2}}\\int dq $',
          'Everything except $ dq $ is the same for every slice, so it comes outside the integral. That is the whole benefit of the ring\'s symmetry.', {
            check: {
              kind: 'fill_blank',
              prompt: 'What is $ \\int dq $ over the whole ring, in terms of the total charge?',
              blank_answer: 'q',
              feedback_right: 'Yes — adding every slice of charge just gives the total charge $ q $.',
              feedback_wrong: 'You are adding up all the little bits of charge on the ring, which by definition is the total charge $ q $.',
            },
          }),
        st('$ E_x = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{qx}{(x^{2}+R^{2})^{3/2}} $',
          'The result. Directed along the axis, away from the ring for positive $ q $.'),
      ],
      now_you_try: {
        problem: 'Use the formula to find the field at the centre of the ring, and then far away on the axis where $ x \\gg R $.',
        answer: 'At the centre: $ E = 0 $. Far away: $ E \\approx \\frac{kq}{x^{2}} $ — a point charge.',
        solution: 'Put $ x = 0 $ and the numerator vanishes, so $ E = 0 $ — which matches the symmetry argument we made before doing any algebra.\n\nFor $ x \\gg R $ the $ R^{2} $ is negligible next to $ x^{2} $, so $ (x^{2}+R^{2})^{3/2} \\to x^{3} $ and $ E \\to kqx/x^{3} = kq/x^{2} $. From far enough away the ring looks like a point, and the formula agrees.',
      },
    }),
    b('text', 5, {
      markdown: 'That formula has one more result hidden in it. The field is zero at the centre and zero far away, so somewhere in between it must be **maximum**. Setting $ dE_x/dx = 0 $ gives',
    }),
    b('latex_block', 6, {
      latex: 'x = \\frac{R}{\\sqrt{2}} \\qquad\\Rightarrow\\qquad E_{\\max} = \\frac{2}{3\\sqrt{3}}\\cdot\\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{R^{2}}',
      label: 'Where the axial field of a ring peaks',
      note: 'A favourite exam result — and a nice check that you can differentiate the field expression.',
    }),
    b('heading', 7, {
      text: 'A charged rod, and then an infinite line',
      level: 2,
      objective: 'State the field of a long charged wire and recognise where the inverse-square law stops applying.',
    }),
    b('text', 8, {
      markdown: 'Now put charge $ q $ along a straight rod of length $ 2a $ lying on the $ y $-axis, and ask for the field at a point $ P $ on the $ x $-axis, a distance $ x $ away.\n\nThe same four steps apply, and the same symmetry gift arrives: for every slice above the axis there is a mirror slice below it, so the $ y $-components cancel and only $ E_x $ survives. The integral gives\n\n$ E_x = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{x\\sqrt{x^{2}+a^{2}}} $\n\nTwo limits make this worth remembering:\n\n**Far away** ($ x \\gg a $): the $ a^{2} $ drops out and $ E \\to kq/x^{2} $. A point charge again — every finite charged body looks like a point from far enough away.\n\n**Very long wire** ($ a \\gg x $): keep $ \\lambda = q/2a $ fixed and let the rod grow. Then',
    }),
    b('latex_block', 9, {
      latex: 'E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}',
      label: 'Field of an infinitely long charged wire',
      note: 'Directed radially outward from the wire (for positive λ). Note the power: 1/r, NOT 1/r².',
      highlight: true,
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'quantitative',
      prompt: 'You move from 1 cm to 2 cm away from a very long charged wire. By what factor does the field drop?',
      options: ['It halves', 'It drops to a quarter', 'It stays the same', 'It drops to one eighth'],
      reveal: '**It halves.**\n\nFor a long wire $ E \\propto 1/r $, not $ 1/r^{2} $. Doubling the distance halves the field.\n\nThis catches people out constantly, because "electrostatics" and "inverse square" are welded together in memory. But the inverse-square law is about **point** charges. Spread the same charge along an infinite line and you get $ 1/r $; spread it over an infinite sheet and — as you are about to see — you get **no** distance dependence at all.\n\nThe geometry of the source decides the power of $ r $. That is a genuinely important idea, and Gauss\'s law will explain exactly why in a few pages.',
      difficulty_level: 3,
    }),
    b('text', 11, {
      markdown: 'The third standard case, an **infinite charged sheet** of surface density $ \\sigma $, gives\n\n$ E = \\frac{\\sigma}{2\\varepsilon_0} $\n\n— completely independent of how far you stand from it. You could do that one by slicing the sheet into rings and integrating, and it is genuinely unpleasant. We will get it in two lines with Gauss\'s law instead, so it is quoted here and derived properly on the last page of this chapter.',
    }),
    b('table', 12, {
      caption: 'How the field falls off, by the shape of the source. Learn the pattern, not the three formulas.',
      headers: ['Source', 'Field', 'Falls off as'],
      rows: [
        ['Point charge', '$ \\frac{kq}{r^{2}} $', '$ 1/r^{2} $'],
        ['Infinite line', '$ \\frac{\\lambda}{2\\pi\\varepsilon_0 r} $', '$ 1/r $'],
        ['Infinite sheet', '$ \\frac{\\sigma}{2\\varepsilon_0} $', 'constant — no falloff at all'],
      ],
    }),
    b('image', 13, {
      src: '',
      alt: 'Three graphs of electric field against distance for a point charge, an infinite line and an infinite sheet',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Point, line, sheet — and the field falls off less steeply each time the source gets bigger.',
      generation_prompt: 'Clean scientific graph panel on a near-black background (#0B0C0F), three small graphs side by side sharing a style. Each has thin dim-grey axes labelled r horizontally and E vertically in muted white. Graph 1: a steep amber curve falling like one over r squared. Graph 2: a gentler amber curve falling like one over r. Graph 3: a flat horizontal amber line. Small icons above each graph in dim orange line art: a single dot, a vertical line, a flat plane seen edge-on. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('text', 14, {
      markdown: 'Next: we have been asking what a field does to a charge that sits still. What does it do to one that is free to move?',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The electric field on the axis of a uniformly charged ring is maximum at a distance from the centre of',
          ['$ R/\\sqrt{2} $', '$ R $', '$ R\\sqrt{2} $', 'zero — it is maximum at the centre'],
          0,
          'The field is zero at the centre and zero at infinity, so it peaks in between; differentiating $ E \\propto x/(x^{2}+R^{2})^{3/2} $ and setting the derivative to zero gives $ x = R/\\sqrt{2} $.',
          2),
        q('A charge $ Q $ is spread uniformly on a ring of radius $ R $. At a point on the axis a distance $ x = 100R $ from the centre, the field is closest to',
          ['$ kQ/x^{2} $', '$ kQ/R^{2} $', 'zero', '$ kQx/R^{3} $'],
          0,
          'When $ x \\gg R $ the ring is indistinguishable from a point charge, and the exact formula reduces to $ kQ/x^{2} $. Any finite charged body behaves this way from far enough away — a useful sanity check on every derivation in this section.',
          2),
        q('Which cancellation makes the ring derivation work?',
          ['The perpendicular components of opposite slices cancel', 'The axial components of opposite slices cancel', 'The charges on opposite slices cancel', 'Nothing cancels — you must integrate both components'],
          0,
          'Opposite slices are equidistant from the axial point, so their perpendicular contributions are equal and opposite while their axial contributions point the same way and add. Getting this the wrong way round would give zero field everywhere, which is plainly false.',
          2),
      ],
    }),
  ],
};

// ── p9 · A Charge Set Free in a Uniform Field ────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'charge-set-free-in-a-uniform-field',
  title: 'A Charge Set Free in a Uniform Field',
  subtitle: 'It is a projectile problem wearing different symbols',
  glossary: [
    { term: 'uniform electric field', definition: 'A field with the same magnitude and direction everywhere — for example, the region between two large parallel charged plates.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'An inkjet printer fires around 30,000 droplets a second. Each droplet gets a controlled charge, then flies between two charged plates that steer it to the exact spot on the page where it is needed.\n\nThe whole steering calculation — how far the droplet bends before it lands — is the projectile problem from Class 11, with $ g $ replaced by $ qE/m $. Same equations, different letters.',
    }),
    b('text', 1, {
      markdown: 'Put a charge $ q $ of mass $ m $ into a **uniform** field $ E $. The force is $ qE $, constant in magnitude and direction, so the acceleration is constant:',
    }),
    b('latex_block', 2, {
      latex: 'a = \\frac{qE}{m}',
      label: 'Acceleration of a charge in a uniform field',
      note: 'Constant, so every equation of motion from Class 11 applies unchanged.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That is the whole idea. A constant force means constant acceleration, and constant acceleration means the SUVAT equations you already know.\n\nThere is one difference from gravity worth naming immediately: **$ a $ depends on the particle.** In free fall every object has the same $ g $ regardless of mass. Here the acceleration is $ qE/m $ — so a proton and an electron in the same field accelerate in **opposite directions** and by wildly different amounts (an electron is about 1836 times lighter, so it accelerates about 1836 times harder).',
    }),
    b('comparison_card', 4, {
      title: 'Two problems, one set of equations',
      columns: [
        {
          heading: 'Projectile under gravity',
          points: [
            'Force $ mg $, downward',
            'Acceleration $ g $ — same for every body',
            'Horizontal velocity unchanged',
            '$ y = \\tfrac{1}{2}gt^{2} $, $ x = ut $',
          ],
        },
        {
          heading: 'Charge in a uniform field',
          points: [
            'Force $ qE $, along $ \\vec{E} $ for $ +q $ and opposite for $ -q $',
            'Acceleration $ qE/m $ — depends on the particle',
            'Velocity perpendicular to the field unchanged',
            '$ y = \\tfrac{1}{2}\\frac{qE}{m}t^{2} $, $ x = ut $',
          ],
        },
      ],
    }),
    b('heading', 5, {
      text: 'Entering sideways — the deflection problem',
      level: 2,
      objective: 'Compute the sideways deflection of a charge that enters a parallel-plate region perpendicular to the field.',
    }),
    b('text', 6, {
      markdown: 'The standard setup: a charge enters the region between two parallel plates of length $ L $ with speed $ u $, moving **perpendicular** to the field. Inside, it is pushed sideways while carrying on forward at the same speed $ u $.\n\nTime inside the plates: $ t = L/u $ — because nothing changes the forward motion.\n\nSideways deflection at exit:',
    }),
    b('latex_block', 7, {
      latex: 'y = \\frac{1}{2}\\cdot\\frac{qE}{m}\\cdot\\left(\\frac{L}{u}\\right)^{2} = \\frac{qEL^{2}}{2mu^{2}}',
      label: 'Deflection on leaving the plates',
    }),
    b('text', 8, {
      markdown: 'And the angle at which it leaves, from the ratio of the two velocity components:\n\n$ \\tan\\theta = \\frac{v_y}{v_x} = \\frac{(qE/m)(L/u)}{u} = \\frac{qEL}{mu^{2}} $\n\nBoth results say the same physical thing: **a faster particle bends less**, because it spends less time in the field. Deflection goes as $ 1/u^{2} $, so doubling the entry speed cuts the deflection to a quarter.',
    }),
    b('worked_example', 9, {
      label: 'an electron deflected between plates',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An electron enters a region of uniform field $ E = 2.0 \\times 10^{4} $ N/C perpendicular to the field, with speed $ u = 3.0 \\times 10^{7} $ m/s. The field region is $ L = 4.0 $ cm long. Find the sideways deflection on exit. Take $ e = 1.6\\times10^{-19} $ C and $ m_e = 9.1\\times10^{-31} $ kg.',
      solution: '**Acceleration inside the field:**\n\n$ a = \\frac{eE}{m} = \\frac{(1.6\\times10^{-19})(2.0\\times10^{4})}{9.1\\times10^{-31}} = 3.52\\times10^{15}\\ \\text{m/s}^{2} $\n\nAn enormous number — and the reason we can ignore gravity completely here. The gravitational acceleration on the same electron is $ 9.8 $ m/s², about $ 10^{14} $ times smaller.\n\n**Time inside:**\n\n$ t = \\frac{L}{u} = \\frac{4.0\\times10^{-2}}{3.0\\times10^{7}} = 1.33\\times10^{-9}\\ \\text{s} $\n\n**Deflection:**\n\n$ y = \\tfrac{1}{2}at^{2} = \\tfrac{1}{2}(3.52\\times10^{15})(1.33\\times10^{-9})^{2} = 3.1\\times10^{-3}\\ \\text{m} $\n\nAbout 3 mm — in a region only 4 cm long, in a little over a nanosecond.\n\n**Direction check.** The electron is negative, so it is pushed **opposite** to $ \\vec{E} $ — towards the positive plate. Always state that separately; the magnitude formula will not tell you.',
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'analogical',
      prompt: 'A proton and an electron are released from rest at the same point in the same uniform electric field. After the same time $ t $, compare their kinetic energies and their displacements.',
      options: [
        'The electron travels much further and gains much more kinetic energy',
        'They gain equal kinetic energy and travel equal distances, in opposite directions',
        'They travel equal distances, but the proton gains more kinetic energy',
        'The electron travels further, but they gain equal kinetic energy',
      ],
      reveal: '**The electron travels much further and gains much more kinetic energy.**\n\nBoth feel the same force magnitude $ eE $, but acceleration is $ a = eE/m $, and the electron is about 1836 times lighter — so its acceleration is about 1836 times bigger.\n\nIn the same time $ t $: displacement $ s = \\tfrac{1}{2}at^{2} \\propto a $, so the electron goes about 1836 times further. Kinetic energy is the work done, $ W = F\\!s $, and with the same force but a much bigger $ s $, the electron gains about 1836 times more energy.\n\n(They do move in opposite directions — the charges have opposite signs — but that is the only thing that is symmetric here.)\n\n**Careful:** had the question said "after the same *distance*" instead of "after the same *time*", the kinetic energies **would** be equal, since $ W = qEd $ is the same for both. Time or distance — read which one the question fixed.',
      difficulty_level: 3,
    }),
    b('image', 11, {
      src: '',
      alt: 'A charged particle entering a parallel-plate region sideways and following a parabolic path',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Straight in, parabola inside, straight out at an angle. Exactly a projectile, with qE/m in place of g.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). Two horizontal parallel plates drawn as thin bars, the upper one warm amber with plus signs, the lower cool blue with minus signs, with evenly spaced vertical orange field-line arrows between them. A bright particle enters from the left travelling horizontally, curves in a smooth parabola towards the upper plate inside the region, and exits at the right along a straight tilted line. Thin dashed grey lines mark the plate length L and the vertical deflection y, and a small arc marks the exit angle. Muted white minimal labels, generous dark space, orange and blue accents only.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Uniform field → constant acceleration $ a = qE/m $ → every Class 11 equation of motion applies.\n- Motion **perpendicular** to the field is untouched. Use it to find the time.\n- $ y = \\frac{qEL^{2}}{2mu^{2}} $ and $ \\tan\\theta = \\frac{qEL}{mu^{2}} $. Faster in, less bend.\n- Work done by the field over a displacement $ d $ along $ \\vec{E} $ is $ W = qEd $, so gain in KE $ = qEd $ — independent of mass.\n- Gravity is almost always negligible for electrons and ions. Say so once, then drop it.',
    }),
    b('text', 13, {
      markdown: 'Next: the most important arrangement in the whole chapter — two equal and opposite charges, a tiny distance apart. Water is one. So is your radio antenna.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A charged particle enters a uniform field perpendicular to it. Inside the field its path is',
          ['a parabola', 'a circle', 'a straight line', 'a helix'],
          0,
          'Constant velocity along one axis and constant acceleration along the perpendicular axis is the definition of parabolic motion — identical to a projectile under gravity. A circular path needs a force that keeps turning to stay perpendicular to the velocity, which a uniform electric field cannot do.',
          2),
        q('An electron and a proton are accelerated from rest through the same distance in the same uniform field. They arrive with',
          ['the same kinetic energy but different speeds', 'the same speed and the same kinetic energy', 'the same speed but different kinetic energies', 'different kinetic energies and different speeds'],
          0,
          'Work done is $ W = qEd $, the same in magnitude for both since $ |q| $ and $ d $ match — so both gain the same kinetic energy. But $ \\tfrac{1}{2}mv^{2} $ equal with very different masses means very different speeds; the lighter electron ends up far faster.',
          3),
        q('A charged droplet passes between deflecting plates and lands 2 mm off centre. If its entry speed is doubled and everything else is unchanged, the deflection becomes',
          ['0.5 mm', '1 mm', '4 mm', '2 mm — unchanged'],
          0,
          'Deflection goes as $ 1/u^{2} $ because the particle spends less time in the field *and* the time enters squared. Doubling $ u $ divides the deflection by 4. Answering 1 mm means you used $ 1/u $ instead.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p6, p7, p8, p9]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
