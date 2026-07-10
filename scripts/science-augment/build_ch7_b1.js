'use strict';
/**
 * Ch7 "Work, Energy, and Simple Machines" — AUGMENT batch 1: pages 144–149.
 * work, work-energy-theorem, forms-of-energy, kinetic-energy, potential-energy,
 * conservation-of-energy. No existing quizzes → fresh 3-Q quiz appended. Grounded in
 * iesc107.pdf. published stays false.
 *   node scripts/science-augment/build_ch7_b1.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p144 work-scientific-definition ─────────────────────────────────────────
  {
    slug: 'work-scientific-definition',
    subtitle: 'Why pushing a wall until you sweat counts, scientifically, as doing zero work',
    hook: cur(
      'Push against a wall with all your might until you are sweating and exhausted. In science, you have done exactly *zero* work. Carry a heavy bag straight across a room and — for the force holding it up — also zero. How can you be drenched in sweat and yet, to a physicist, have done no work at all?',
      'Work needs a force AND movement in the direction of that force.',
      'In science, work is done only when a force makes an object move in the direction of the force: work = force × displacement (in the force\'s direction). Push a wall and it does not move — zero displacement, so zero work. Hold a bag while walking and the holding force points up while the motion is sideways — so that force does zero work. The SI unit of work is the joule (J).'
    ),
    hero: img(
      'A person straining hard against an immovable wall on one side, and easily pushing a moving cart on the other',
      'Ultra-wide cinematic banner (16:5 ratio). Left: a person pushing hard against a solid wall that does not budge, strain lines but no motion. Right: the same person easily pushing a loaded cart that rolls forward. Conveys that work needs movement, not just effort. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Three cases of work: force with displacement (work done), no displacement (no work), and force perpendicular to motion (no work)',
      'Educational diagram of when work is done. Clean technical illustration on a dark background (#0a0a0a or near-black). Three panels: (1) a force arrow and a displacement arrow in the same direction with a box moving — "Work done (W = F × s)"; (2) a force on a wall with no movement — "No displacement → no work"; (3) an upward force on a box that moves sideways — "Force ⟂ motion → no work". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'A man pushes hard against a heavy wall, but the wall does not move at all. How much work does he do on the wall, and why?',
      [
        'Zero work, because there is no displacement of the wall',
        'A large amount, because he applied a large force',
        'A small amount, because the wall pushed back',
        'It depends only on how long he pushed for',
      ],
      0,
      'Work needs movement in the direction of the force; with no displacement, the work is zero no matter how hard he pushes. "Large force, large work" is the trap — force alone is not work without displacement.',
      2),
    quiz: [
      q('Scientifically, work is done on an object only when —',
        [
          'a force makes the object move in the direction of the force',
          'a force is applied, even if nothing moves',
          'a person feels tired after the effort',
          'the object stays completely still',
        ], 0,
        'Work requires a force and a displacement in the force\'s direction. "Even if nothing moves" is the trap — pushing without movement does zero work, however tiring.',
        1),
      q('A force of 10 N moves a box 3 m in the direction of the force. How much work is done?',
        ['30 J', '13 J', '3.3 J', '7 J'], 0,
        'Work = force × displacement = 10 × 3 = 30 J. "13 J" is the trap — it adds force and distance instead of multiplying them.',
        2),
      q('A girl carries a school bag at a steady height while walking forward. How much work does the upward force holding the bag do on it?',
        [
          'Zero, because that force points up while the motion is forward',
          'A large amount, because the bag is heavy',
          'Work equal to the bag\'s weight times the distance walked',
          'Negative work, because walking tires her out',
        ], 0,
        'The holding force is vertical but the motion is horizontal, so that force does no work. "Weight times distance walked" is the trap — only displacement in the force\'s own direction counts, and there is none here.',
        3),
    ],
  },

  // ── p145 work-energy-theorem ────────────────────────────────────────────────
  {
    slug: 'work-energy-theorem',
    subtitle: 'Where a thrown ball gets its power to knock down a wicket — and the rule that tracks it',
    hook: cur(
      'When a fielder hurls a cricket ball, where does the ball\'s power to smash the wicket come from? It came from the fielder\'s arm. The work done in throwing the ball did not simply disappear — it turned into the ball\'s energy. There is a neat rule that connects the two exactly. What is it?',
      'The work done on an object equals the change in its energy.',
      'The work-energy theorem says: the work done on an object equals the change in its energy. Do positive work on the ball (by throwing it) and it gains energy; that stored energy then lets it do work on the wicket. The SI unit of energy is the joule (J) — the same as the unit of work.'
    ),
    hero: img(
      'A fielder hurling a cricket ball that streaks across to shatter the wicket, energy flowing from arm to ball to stumps',
      'Ultra-wide cinematic banner (16:5 ratio). Left: a fielder in mid-throw releasing a glowing cricket ball; the ball streaks across to the right and strikes the wicket, stumps flying. A faint glow traces energy from arm to ball to stumps. Conveys work becoming energy becoming work. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Work done on a ball becomes its energy, which then does work on the wicket',
      'Educational flow diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). Three stages with arrows: "Work done by the arm" → "Ball gains energy" → "Ball does work on the wicket". Add the relation "Work done = change in energy". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'You do positive work on a ball by throwing it. According to the work-energy theorem, what happens to the ball\'s energy?',
      [
        'It increases by the amount of work done on it',
        'It stays exactly the same',
        'It decreases as the ball speeds up',
        'It turns entirely into heat',
      ],
      0,
      'Positive work raises an object\'s energy by that same amount — that is the theorem. "Decreases as it speeds up" is the trap — gaining speed means gaining kinetic energy, not losing it.',
      2),
    quiz: [
      q('The work-energy theorem states that the work done on an object equals —',
        ['the change in its energy', 'the force applied to it', 'its weight', 'the distance it moves'], 0,
        'Work done on an object equals the change in its energy. "The force applied" is the trap — force is only part of work (force × displacement), not the change in energy itself.',
        1),
      q('The SI unit of energy is the —',
        ['joule', 'newton', 'watt', 'metre'], 0,
        'Energy is measured in joules, the same unit as work. "Newton" is the trap — that is the unit of force, not energy.',
        2),
      q('A goalkeeper stops a moving ball by pushing against its motion. What does the work-energy theorem say happens to the ball\'s energy?',
        [
          'It decreases, because the keeper does negative work on it',
          'It increases, because a force was applied',
          'It stays the same, since the ball still has mass',
          'It turns into potential energy',
        ], 0,
        'The keeper\'s force opposes the motion, so the work is negative and the ball loses energy. "Increases because a force was applied" is the trap — a force opposing motion removes energy.',
        3),
    ],
  },

  // ── p146 forms-of-energy ────────────────────────────────────────────────────
  {
    slug: 'forms-of-energy',
    subtitle: 'The energy that lets you run today was, not long ago, sunlight crossing space',
    hook: cur(
      'The energy that lets you run, think, and breathe came from your food. The food\'s energy came from plants. And the plants got theirs from sunlight. So the energy powering you right now was, not long ago, sunlight streaming across space. Energy keeps changing form — how many forms can it take?',
      'Energy can change from one form to another, but is never lost.',
      'Energy comes in many forms — mechanical, thermal (heat), light, sound, electrical, chemical, and nuclear — and it constantly changes from one to another. The chemical energy in food becomes the mechanical energy of your muscles; electrical energy becomes light in a bulb. This chapter focuses on mechanical energy.'
    ),
    hero: img(
      'A glowing chain from the Sun to a plant to a plate of food to a running child, energy passing along it',
      'Ultra-wide cinematic banner (16:5 ratio). A left-to-right glowing chain: the Sun, then a green plant, then a plate of food, then a running child, with a luminous thread of energy linking them. Conveys energy passing and changing form. Warm golden rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'The main forms of energy shown as labelled icons',
      'Educational diagram of forms of energy. Clean technical illustration on a dark background (#0a0a0a or near-black). Labelled icons for: Mechanical, Thermal (heat), Light, Sound, Electrical, Chemical, and Nuclear energy. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'An electric bulb glows and also becomes warm to the touch. Which energy changes are happening?',
      [
        'Electrical energy is converted into light energy and thermal (heat) energy',
        'Light energy is converted into electrical energy',
        'Chemical energy is converted into sound energy',
        'Thermal energy is converted into chemical energy',
      ],
      0,
      'The bulb turns electrical energy into both light and heat. "Light into electrical" is the reverse of what a bulb does — that would be a solar cell, not a bulb.',
      2),
    quiz: [
      q('The energy stored in food and fuels is —',
        ['chemical energy', 'kinetic energy', 'sound energy', 'light energy'], 0,
        'Food and fuels store chemical energy in the bonds between atoms. "Kinetic energy" is the trap — that is the energy of motion, not stored energy.',
        1),
      q('When a ringing bell vibrates, it converts mechanical energy into —',
        ['sound energy', 'chemical energy', 'nuclear energy', 'light energy'], 0,
        'A vibrating bell turns mechanical energy into sound. "Light energy" is the trap — a bell makes sound, not light.',
        2),
      q('You pedal a bicycle on a flat road. Where did the energy start, and what form does it take as you ride?',
        [
          'It starts as chemical energy in your food and becomes the mechanical energy of motion',
          'It starts as light energy and becomes sound energy',
          'It starts as electrical energy and becomes heat only',
          'It starts as nuclear energy stored in your muscles',
        ], 0,
        'Food\'s chemical energy powers your muscles, becoming the mechanical energy of riding. "Nuclear energy in your muscles" is the trap — muscles run on chemical energy, not nuclear.',
        3),
    ],
  },

  // ── p147 kinetic-energy ─────────────────────────────────────────────────────
  {
    slug: 'kinetic-energy',
    subtitle: 'Why doubling your speed does far more than double the danger',
    hook: cur(
      'Here is why a small increase in speed is so dangerous on the road. Double a car\'s speed and you might expect its energy to double. It does not — it becomes *four* times as much. That is why a crash at 60 is far worse than twice a crash at 30. Why does speed count for so much more than you would expect?',
      'Kinetic energy depends on the square of the speed.',
      'Kinetic energy — the energy of motion — is K = ½mv². Because the speed v is squared, doubling the speed multiplies the energy by 4 (that is 2²), not 2. This is exactly why even a small rise in speed sharply increases a moving object\'s energy.'
    ),
    hero: img(
      'A speeding vehicle trailing a glowing energy wake that grows dramatically as the speed rises',
      'Ultra-wide cinematic banner (16:5 ratio). A fast-moving vehicle from left to right with a glowing energy trail behind it that swells dramatically as the speed increases, suggesting energy rising much faster than speed. Conveys kinetic energy growing with the square of speed. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Kinetic energy formula and how doubling speed makes energy four times larger',
      'Educational diagram of kinetic energy. Clean technical illustration on a dark background (#0a0a0a or near-black). Show "K = ½mv²" prominently, then two cars: one at speed v with energy K, and one at speed 2v with energy 4K, illustrating that doubling speed quadruples energy. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'If a vehicle\'s speed doubles while its mass stays the same, its kinetic energy becomes —',
      [
        '4 times its original value',
        '2 times its original value',
        '8 times its original value',
        'the same as before',
      ],
      0,
      'Since K = ½mv² and the speed is squared, doubling v gives (2)² = 4 times the energy. "2 times" is the trap — it forgets that the speed is squared in the formula.',
      3),
    quiz: [
      q('Kinetic energy is the energy an object has due to its —',
        ['motion', 'position', 'height above the ground', 'temperature'], 0,
        'Kinetic energy is the energy of motion. "Position" is the trap — energy due to position is potential energy, not kinetic.',
        1),
      q('The formula for the kinetic energy of an object of mass m moving at speed v is —',
        ['½mv²', 'mgh', 'mv', 'F × s'], 0,
        'Kinetic energy is ½mv². "mgh" is the trap — that is gravitational potential energy, not kinetic energy.',
        2),
      q('A loaded truck and a light car happen to have the same kinetic energy. Which one is moving faster, and why?',
        [
          'The car, because for equal energy a smaller mass means a higher speed',
          'The truck, because it is heavier',
          'Both move at exactly the same speed',
          'Neither is moving, since their energies are equal',
        ], 0,
        'With K = ½mv² fixed, a smaller mass must go with a larger speed — so the lighter car is faster. "The truck because it is heavier" is the trap — more mass at equal energy means *less* speed, not more.',
        3),
    ],
  },

  // ── p148 potential-energy ───────────────────────────────────────────────────
  {
    slug: 'potential-energy',
    subtitle: 'The hidden energy stored in a stretched slingshot and a raised hammer',
    hook: cur(
      'Pull back a slingshot and let go — the stone flies off, even though nothing was moving a moment before. Raise a hammer and hold it perfectly still — it has the power to drive a nail the instant you release it. Where is this hidden energy stored while everything is still?',
      'Energy can be stored in a stretched or bent object, or in a raised object\'s position.',
      'Potential energy is stored energy — due to an object\'s position or its shape. A stretched slingshot or bent bow stores energy in its shape; a raised object stores gravitational potential energy. For an object of mass m raised to a height h, the gravitational potential energy is U = mgh.'
    ),
    hero: img(
      'A drawn-back bow and a raised hammer, each glowing faintly to show stored, ready-to-release energy',
      'Ultra-wide cinematic banner (16:5 ratio). Left: a fully drawn bow with the string pulled back, glowing faintly with stored energy. Right: a hammer held high, also faintly glowing, poised to strike. Conveys energy stored and waiting in shape and position. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Potential energy stored by a raised object (mgh) and by a stretched spring',
      'Educational diagram of potential energy. Clean technical illustration on a dark background (#0a0a0a or near-black). Two panels: (1) a block raised to height h above the ground with the label "U = mgh"; (2) a stretched spring storing energy in its shape. Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'A ball of mass 0.2 kg is raised to a height of 10 m above the ground (take g = 10 m s⁻²). What is its gravitational potential energy there?',
      [
        '20 J',
        '2 J',
        '200 J',
        '12 J',
      ],
      0,
      'U = mgh = 0.2 × 10 × 10 = 20 J. "2 J" is the trap — it leaves out one of the factors (using only 0.2 × 10).',
      2),
    quiz: [
      q('The energy stored in an object because of its position or shape is called —',
        ['potential energy', 'kinetic energy', 'sound energy', 'thermal energy'], 0,
        'Stored energy due to position or shape is potential energy. "Kinetic energy" is the trap — that is the energy of motion, not stored energy.',
        1),
      q('The gravitational potential energy of an object of mass m raised to a height h is —',
        ['mgh', '½mv²', 'mg', 'F × s'], 0,
        'Gravitational potential energy is U = mgh. "½mv²" is the trap — that is kinetic energy, which depends on speed, not height.',
        2),
      q('Two identical balls are raised — one to 2 m and the other to 4 m. Which has more potential energy, and by how much?',
        [
          'The ball at 4 m, with twice the potential energy, since U is proportional to height',
          'The ball at 2 m, because lower objects store more energy',
          'Both have exactly the same potential energy',
          'The ball at 4 m, with four times the potential energy',
        ], 0,
        'U = mgh, so doubling the height doubles the potential energy. "Four times" is the trap — potential energy is proportional to height itself, not to its square (that squaring belongs to kinetic energy and speed).',
        3),
    ],
  },

  // ── p149 conservation-of-energy ─────────────────────────────────────────────
  {
    slug: 'conservation-of-energy',
    subtitle: 'How a pendulum trades height for speed again and again — without ever losing the total',
    hook: cur(
      'Watch a swinging pendulum. At the top it pauses, then races through the bottom, then climbs and pauses again — almost exactly as high as it started. It is constantly trading two kinds of energy back and forth, yet the total never changes. What is the bargain it keeps making?',
      'As it falls, potential energy turns into kinetic energy — and the reverse as it rises.',
      'This is the Law of Conservation of Mechanical Energy: the sum of kinetic and potential energy stays constant when no other forces (like friction) act. A falling object trades potential energy for kinetic; a rising one does the reverse. Total mechanical energy = kinetic + potential = constant.'
    ),
    hero: img(
      'A swinging pendulum shown at the top of its arc (still) and rushing through the bottom (fastest), trading energy',
      'Ultra-wide cinematic banner (16:5 ratio). A pendulum bob shown in motion-trail across its swing: high and still at the two ends (glowing to suggest stored energy), and a bright fast blur at the lowest point (suggesting motion energy). Conveys energy trading between forms while the total stays constant. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A pendulum showing all potential energy at the top of the swing and all kinetic energy at the bottom',
      'Educational diagram of a pendulum and energy. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a pendulum at three positions: far left and far right at the top labelled "All potential energy, no kinetic", and the lowest middle point labelled "All kinetic energy, no potential", with a note "Total mechanical energy stays constant". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'At the top of its swing a pendulum bob is momentarily still; at the bottom it moves fastest. Explain this using energy.',
      [
        'At the top the energy is all potential (no motion); at the bottom it is all kinetic — but the total stays the same',
        'The bob gains brand-new energy each time it reaches the bottom',
        'The bob loses all its energy at the top and makes more at the bottom',
        'Energy is created at the bottom and destroyed at the top',
      ],
      0,
      'Potential energy at the top converts fully to kinetic energy at the bottom, with the total unchanged. "Gains brand-new energy" is the trap — no energy is created; it only changes form.',
      3),
    quiz: [
      q('The sum of an object\'s kinetic energy and potential energy is called its —',
        ['mechanical energy', 'thermal energy', 'chemical energy', 'total mass'], 0,
        'Kinetic plus potential energy is the mechanical energy. "Thermal energy" is the trap — that is heat energy, separate from mechanical energy.',
        1),
      q('As a ball falls freely, its potential energy decreases. What happens to its kinetic energy?',
        ['It increases by the same amount', 'It also decreases', 'It stays at zero', 'It turns entirely into heat'], 0,
        'Lost potential energy becomes kinetic energy, so kinetic energy rises equally. "It also decreases" is the trap — both falling would mean energy vanishes, which conservation forbids.',
        2),
      q('A real pendulum gradually slows and finally stops swinging. Does this break the law of conservation of energy?',
        [
          'No — energy is lost to friction and air resistance as heat and sound, so it is changed in form, not destroyed',
          'Yes — the pendulum simply destroys its energy',
          'No — the pendulum secretly makes new energy to keep going',
          'Yes — energy cannot be conserved in the real world at all',
        ], 0,
        'The mechanical energy turns into heat and sound through friction, so the total energy is still conserved. "The pendulum destroys its energy" is the trap — energy is never destroyed, only converted to other forms.',
        3),
    ],
  },
], 7).catch((e) => { console.error(e); process.exit(1); });
