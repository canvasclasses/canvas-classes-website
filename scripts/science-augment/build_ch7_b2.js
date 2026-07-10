'use strict';
/**
 * Ch7 — AUGMENT batch 2: pages 150–155.
 * power, simple-machines, levers, pulleys, inclined-planes, machines-in-indian-traditional-life.
 * No existing quizzes → fresh 3-Q quiz appended. Grounded in iesc107.pdf (and, for p155,
 * the page's existing content: charkha wheel-and-axle, chakki, kuan pulley, Persian wheel).
 *   node scripts/science-augment/build_ch7_b2.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p150 power ──────────────────────────────────────────────────────────────
  {
    slug: 'power',
    subtitle: 'Why running up the stairs leaves you panting when strolling up the same stairs does not',
    hook: cur(
      'Run up a flight of stairs and you are panting; stroll up the very same stairs slowly and you are fine. You did exactly the same work either way — same height, same body. So what is different? It is not the work — it is *how fast* you did it. What do we call that?',
      'It is the rate of doing work — work divided by the time taken.',
      'Power is the rate of doing work: P = W / t. Running up the stairs does the same work as walking up them, but in less time, so it needs more power. The SI unit of power is the watt (W): 1 watt = 1 joule per second.'
    ),
    hero: img(
      'The same person racing up a staircase on one side and ambling up identical stairs on the other',
      'Ultra-wide cinematic banner (16:5 ratio). Split scene of identical staircases: on the left a person sprinting up with motion blur and effort; on the right the same person strolling up slowly and relaxed. Conveys same work, different rate (power). Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Power as work divided by time, with the watt defined as one joule per second',
      'Educational diagram of power. Clean technical illustration on a dark background (#0a0a0a or near-black). Show "Power P = Work W ÷ time t" prominently, and "1 watt = 1 joule per second (1 W = 1 J/s)". Include a small comparison: same work done quickly = high power, slowly = low power. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'A weightlifter lifts a 75 kg mass to a height of 2 m in 5 seconds (take g = 10 m s⁻²). What power does she use?',
      [
        '300 W',
        '1500 W',
        '150 W',
        '750 W',
      ],
      0,
      'Work = mgh = 75 × 10 × 2 = 1500 J; power = 1500 ÷ 5 = 300 W. "1500 W" is the trap — that is the work in joules, not the power; you must still divide by the time.',
      2),
    quiz: [
      q('Power is defined as the rate of —',
        ['doing work', 'applying a force', 'gaining height', 'using up fuel'], 0,
        'Power is how fast work is done — work per unit time. "Applying a force" is the trap — force alone is not work, and power is about the rate of *work*, not force.',
        1),
      q('The SI unit of power is the —',
        ['watt', 'joule', 'newton', 'second'], 0,
        'Power is measured in watts (1 W = 1 J/s). "Joule" is the trap — that is the unit of work and energy, not the rate of doing work.',
        2),
      q('Two people lift the same load to the same height, but one finishes in half the time. Who uses more power, and why?',
        [
          'The faster person, because the same work done in less time means more power',
          'The slower person, because taking longer needs more power',
          'Both use exactly the same power',
          'Neither uses any power, since the work is equal',
        ], 0,
        'Equal work in less time means a higher rate of work — more power. "The slower person" is the trap — taking longer spreads the same work out, giving less power, not more.',
        3),
    ],
  },

  // ── p151 simple-machines ────────────────────────────────────────────────────
  {
    slug: 'simple-machines',
    subtitle: 'The catch nature never lets you escape — a machine makes work easier, never less',
    hook: cur(
      'A simple machine like a ramp or a lever lets you lift something far too heavy to lift by hand. It feels like getting more out than you put in. But there is a catch nature never lets you escape: the machine does not reduce the total work at all. So what does it actually do for you?',
      'It changes the size or the direction of the force you must apply.',
      'A simple machine makes a task easier by changing the size or direction of the force — but it never reduces the total work. The force you apply is the effort; the force to be overcome is the load. Mechanical advantage = load ÷ effort. Pay a smaller force, and you pay it over a longer distance — the work stays the same.'
    ),
    hero: img(
      'A heavy load being raised three ways — by a lever, a ramp, and a pulley — each needing a smaller, easier effort',
      'Ultra-wide cinematic banner (16:5 ratio). A single heavy block being moved upward three ways across the frame: levered up with a bar, pushed up a ramp, and hoisted with a pulley, each with a small effort arrow. Conveys machines making a heavy task feel easier. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A machine with labelled effort and load, and the definition mechanical advantage = load ÷ effort',
      'Educational diagram of a simple machine. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a generic machine (a lever) with arrows labelled "Effort" (small) and "Load" (large), and the equation "Mechanical advantage = load ÷ effort". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'A ramp lets you push a heavy box up to a platform with a small force. Does the ramp reduce the total work needed?',
      [
        'No — it reduces the force, but you push over a longer distance, so the work is the same',
        'Yes — the ramp cuts the total work in half',
        'Yes — the ramp removes the work entirely',
        'No — the ramp actually doubles the total work',
      ],
      0,
      'A machine trades a smaller force for a longer distance; the product (the work) is unchanged. "Cuts the work in half" is the trap — machines change force and distance, never the total work.',
      2),
    quiz: [
      q('The force we apply to a simple machine is called the —',
        ['effort', 'load', 'power', 'work'], 0,
        'The applied force is the effort; the force to be overcome is the load. "Load" is the trap — that is the force the machine works against, not the one you apply.',
        1),
      q('The mechanical advantage of a machine is defined as —',
        ['load ÷ effort', 'effort ÷ load', 'work ÷ time', 'force × distance'], 0,
        'Mechanical advantage = load ÷ effort. "effort ÷ load" is the trap — it is the ratio the other way up, which would be less than 1 for a helpful machine.',
        2),
      q('A machine has a mechanical advantage of 4. What does this mean?',
        [
          'It lets you move a load 4 times larger than the effort you apply',
          'It does the task 4 times faster',
          'It reduces the total work to one-quarter',
          'It makes the load 4 times heavier',
        ], 0,
        'A mechanical advantage of 4 means the load handled is 4× the effort applied. "Does the task 4 times faster" is the trap — mechanical advantage is about force, not speed.',
        3),
    ],
  },

  // ── p152 levers ─────────────────────────────────────────────────────────────
  {
    slug: 'levers',
    subtitle: 'How a small child on a seesaw can lift a heavy adult — using only clever position',
    hook: cur(
      'On a seesaw, a small child can lift a much heavier adult into the air — if the child just sits far enough from the centre. No extra muscle is needed, only a clever choice of position. How can distance from the centre beat sheer weight?',
      'A lever balances effort × effort-arm against load × load-arm.',
      'A lever is a rigid bar that turns about a fixed point, the fulcrum. It balances when effort × effort-arm = load × load-arm. Sit farther from the fulcrum (a longer effort arm) and a small effort can move a large load. Mechanical advantage = effort arm ÷ load arm.'
    ),
    hero: img(
      'A small child far out on one side of a seesaw lifting a much heavier adult sitting close to the pivot',
      'Ultra-wide cinematic banner (16:5 ratio). A seesaw with a small child seated far out on the left end, lifting a heavier adult who sits close to the central pivot on the right. Conveys distance from the fulcrum beating weight. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A lever showing the fulcrum, load arm and effort arm, with the balance rule',
      'Educational diagram of a lever. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a bar on a triangular fulcrum: a large Load close to the fulcrum on the short "load arm", and a small Effort far out on the long "effort arm". Label fulcrum, load arm, effort arm, and the rule "Effort × effort arm = Load × load arm". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'On a seesaw, a 15 kg child sits 2 m from the central pivot. How far from the pivot must a 30 kg child sit to balance it?',
      [
        '1 m from the pivot',
        '2 m from the pivot',
        '4 m from the pivot',
        '0.5 m from the pivot',
      ],
      0,
      'Balance needs 15 × 2 = 30 × L, so L = 1 m. "2 m" is the trap — the heavier child must sit *closer* to the pivot, not at the same distance.',
      3),
    quiz: [
      q('The fixed point about which a lever turns is called the —',
        ['fulcrum', 'load', 'effort', 'effort arm'], 0,
        'A lever rotates about its fulcrum. "Load" is the trap — that is the force being overcome, not the turning point.',
        1),
      q('A lever balances when —',
        [
          'effort × effort arm = load × load arm',
          'effort = load',
          'effort arm = load arm',
          'effort × load = arm length',
        ], 0,
        'Balance comes from effort × effort arm = load × load arm. "effort = load" is the trap — a lever\'s whole point is that a small effort can balance a large load, by using a longer arm.',
        2),
      q('Why can a small child lift a heavier adult on a seesaw by sitting farther from the centre?',
        [
          'Sitting farther gives a longer effort arm, so a smaller effort can balance a larger load',
          'Sitting farther makes the child temporarily heavier',
          'The seesaw adds extra force to the lighter side',
          'The adult\'s weight disappears when the seesaw tilts',
        ], 0,
        'A longer effort arm lets a small force balance a big load — that is the lever rule. "Makes the child heavier" is the trap — the child\'s weight is unchanged; it is the longer arm that does the work.',
        3),
    ],
  },

  // ── p153 pulleys ────────────────────────────────────────────────────────────
  {
    slug: 'pulleys',
    subtitle: 'Why pulling a rope downward sends a flag upward — and what a single pulley really gives you',
    hook: cur(
      'To raise a flag to the top of a pole, you pull the rope *downward* — and the flag goes *up*. The pulley flipped the direction of your effort. But here is the surprising part: a single fixed pulley does not make the flag any lighter to lift. So why bother using it at all?',
      'A fixed pulley changes the direction of the force, not its size.',
      'A pulley is a grooved wheel that guides a rope. A single fixed pulley changes the direction of the effort — you pull down to lift up, which is far more convenient — but its mechanical advantage is 1 (the effort equals the load). A movable pulley, or a system of pulleys, can give a mechanical advantage greater than 1, lifting heavy loads with less effort — as in cranes and lifts.'
    ),
    hero: img(
      'A flag rising up a pole as a person pulls the rope downward over a pulley at the top',
      'Ultra-wide cinematic banner (16:5 ratio). A tall pole with a pulley at the top; a person on the ground pulls the rope downward (arrow down) while the flag rises upward (arrow up) on the other side. Conveys a pulley reversing the direction of effort. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A fixed pulley (changes direction, MA = 1) compared with a movable-pulley system (MA greater than 1)',
      'Educational diagram of pulleys. Clean technical illustration on a dark background (#0a0a0a or near-black). Left: a single fixed pulley at the top, effort down, load up, labelled "Fixed pulley: changes direction, MA = 1". Right: a movable-pulley system with the load on a movable pulley, labelled "Movable pulley system: MA greater than 1, less effort". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Why is it easier to raise a flag using a single fixed pulley at the top of the pole, even though the pulley does not reduce the force needed?',
      [
        'It lets you pull downward — a comfortable direction — to lift the flag up; it changes direction, not force',
        'It makes the flag weigh much less',
        'It reduces the total work needed to almost zero',
        'It removes the need for any effort at all',
      ],
      0,
      'A fixed pulley\'s benefit is convenience — pulling down instead of up — with the same force. "Makes the flag weigh less" is the trap — a fixed pulley\'s mechanical advantage is 1, so the force is unchanged.',
      2),
    quiz: [
      q('A single fixed pulley changes the —',
        ['direction of the force you apply', 'size of the force you apply', 'total work needed', 'weight of the load'], 0,
        'A fixed pulley reverses the direction of the effort. "Size of the force" is the trap — its mechanical advantage is 1, so the force needed is unchanged.',
        1),
      q('What is the mechanical advantage of a single fixed pulley?',
        ['1', '2', 'greater than 1', 'less than 1'], 0,
        'A fixed pulley has a mechanical advantage of 1 — effort equals load. "Greater than 1" is the trap — that applies to movable pulleys, not a single fixed one.',
        2),
      q('To lift a very heavy load with less effort, would you choose a single fixed pulley or a system of movable pulleys, and why?',
        [
          'A system of movable pulleys, because it gives a mechanical advantage greater than 1 and reduces the effort',
          'A single fixed pulley, because it makes the load lighter',
          'A single fixed pulley, because it removes the work',
          'Either one, since both reduce the effort equally',
        ], 0,
        'Movable-pulley systems multiply force (MA > 1), so they cut the effort needed. "A single fixed pulley makes the load lighter" is the trap — a fixed pulley only changes direction (MA = 1).',
        3),
    ],
  },

  // ── p154 inclined-planes ────────────────────────────────────────────────────
  {
    slug: 'inclined-planes',
    subtitle: 'Why mountain roads zig-zag instead of climbing straight up',
    hook: cur(
      'A road going straight up a steep hill would be the shortest route — so why do mountain roads endlessly zig-zag, making the journey far longer? The answer is the same reason it is easier to push a heavy box up a ramp than to lift it straight up. What is the trade the slope is making?',
      'A gentler, longer slope needs a smaller force.',
      'An inclined plane (a ramp) lets you raise a load with less force than lifting it straight up — but over a longer distance. Its mechanical advantage = length of the slope ÷ height (L ÷ h). A longer, gentler slope (bigger L) means less force — which is exactly why mountain roads wind in long, gentle bends instead of going straight up.'
    ),
    hero: img(
      'A road winding up a steep mountain in long gentle switchbacks instead of a straight steep climb',
      'Ultra-wide cinematic banner (16:5 ratio). A tall mountain with a road snaking up its face in long, gentle zig-zag switchbacks, a vehicle climbing easily. A faint dotted straight line shows the steep route not taken. Conveys trading a longer path for an easier climb. Warm rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
    ),
    diagram: DIAG(
      'An inclined plane showing slope length L, height h, and mechanical advantage = L ÷ h',
      'Educational diagram of an inclined plane. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a right-triangle ramp with the slope labelled "length L = 50 cm", the vertical side "height h = 30 cm", a box being pushed up with a small effort arrow, and the equation "Mechanical advantage = L ÷ h = 50/30 ≈ 1.67". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'A ramp 50 cm long is used to raise an object to a height of 30 cm. What is the mechanical advantage of the ramp?',
      [
        'About 1.67',
        '1.5',
        '0.6',
        '80',
      ],
      0,
      'Mechanical advantage = length ÷ height = 50 ÷ 30 ≈ 1.67. "0.6" is the trap — that is height ÷ length, the ratio upside down.',
      3),
    quiz: [
      q('An inclined plane makes lifting easier by letting you apply a smaller force over a —',
        ['longer distance', 'shorter distance', 'distance that stays the same', 'distance of zero'], 0,
        'A ramp trades a smaller force for a longer path. "Shorter distance" is the trap — the easier force always comes at the cost of a *longer* distance, never a shorter one.',
        1),
      q('The mechanical advantage of an inclined plane is —',
        ['length of the slope ÷ height', 'height ÷ length of the slope', 'length × height', 'height × weight'], 0,
        'Mechanical advantage = slope length ÷ height (L/h). "height ÷ length" is the trap — that is the ratio inverted, which would be less than 1.',
        2),
      q('Why are roads up steep hills built to wind around in gentle slopes instead of going straight up?',
        [
          'A longer, gentler slope has a higher mechanical advantage, so vehicles need less force to climb',
          'A winding road is shorter than a straight one',
          'Straight roads up hills are impossible to build',
          'Winding roads remove the need for any engine power',
        ], 0,
        'Gentler slopes (bigger L for the same height) raise the mechanical advantage, easing the climb. "A winding road is shorter" is the trap — it is actually longer; the gain is in reduced force, not distance.',
        3),
    ],
  },

  // ── p155 machines-in-indian-traditional-life ────────────────────────────────
  {
    slug: 'machines-in-indian-traditional-life',
    subtitle: 'Gandhi\'s charkha, the village grinding stone, the well pulley — textbook machines hiding in plain sight',
    hook: cur(
      'The spinning wheel Gandhi made famous, the grinding stone in a village kitchen, the pulley over a well — these everyday Indian tools were not just traditions. Each one is a textbook simple machine, designed and perfected over thousands of years. Which machines were hiding in plain sight all along?',
      'Look for wheels, levers and pulleys inside the traditional tools.',
      'India\'s traditional tools are simple machines: the *charkha* (spinning wheel) is a wheel-and-axle that multiplies rotational speed (MA = R/r); the *chakki* (grinding stone) uses a wheel-and-axle handle; the *kuan* (well) uses a pulley to change the direction of the pull; and the *araghatta* (Persian wheel) lifts water using wheels. Generations refined these by trial — real engineering.'
    ),
    hero: img(
      'A charkha spinning wheel, a stone chakki, and a well with a rope-and-pulley, shown together as traditional Indian machines',
      'Ultra-wide cinematic banner (16:5 ratio). Three traditional Indian tools across the frame: a wooden charkha (spinning wheel), a round stone chakki (hand grinding mill), and a village well with a rope over a pulley. Conveys everyday tradition as engineering. Warm golden rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
    ),
    diagram: DIAG(
      'Three traditional Indian tools matched to the simple machine each one is',
      'Educational diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). Three labelled pairs: a charkha → "Wheel-and-axle (MA = R/r)"; a kuan well rope over a wheel → "Pulley (changes direction)"; a chakki grinding stone → "Wheel-and-axle handle". Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('analogical',
      'The charkha\'s large wheel turns a tiny spindle very fast. Which simple machine is this, and what does it multiply?',
      [
        'A wheel-and-axle; it multiplies rotational speed (the spindle turns many times for one turn of the wheel)',
        'A lever; it multiplies force at the spindle',
        'An inclined plane; it multiplies distance',
        'A fixed pulley; it only changes direction',
      ],
      0,
      'A big wheel driving a small spindle is a wheel-and-axle that trades force for speed, spinning the spindle fast. "A lever multiplying force" is the trap — the charkha multiplies *speed* at the spindle, not force.',
      2),
    quiz: [
      q('The charkha (spinning wheel) is an example of which simple machine?',
        ['a wheel-and-axle', 'a lever', 'an inclined plane', 'a fixed pulley'], 0,
        'A large wheel driving a small axle (spindle) is a wheel-and-axle. "A lever" is the trap — a lever turns about a fulcrum to trade force, while the charkha spins an axle to trade speed.',
        1),
      q('A pulley over a village well (kuan) helps mainly by —',
        [
          'changing the direction of the pull, so you pull down to raise the bucket up',
          'making the water in the bucket weigh much less',
          'reducing the total work of lifting to zero',
          'removing the need for a rope',
        ], 0,
        'A simple well pulley changes the direction of the effort (pull down to lift up). "Makes the water weigh less" is the trap — a single fixed pulley has a mechanical advantage of 1, so it does not lighten the load.',
        2),
      q('Traditional machine-builders never wrote formulas like MA = R/r, yet their designs worked beautifully. What does this best show?',
        [
          'Their tools were refined by generations of trial and improvement — real engineering, even without written formulas',
          'They must have secretly known all the modern formulas',
          'Their machines actually did not work very well',
          'Simple machines do not really need any design at all',
        ], 0,
        'Generations of practical trial and refinement is engineering, formulas or not. "Secretly knew the formulas" is the trap — the point is that good design can come from experience and iteration, not only from written equations.',
        3),
    ],
  },
], 7).catch((e) => { console.error(e); process.exit(1); });
