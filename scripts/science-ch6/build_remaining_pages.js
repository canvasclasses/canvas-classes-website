'use strict';
/**
 * Class 9 Science · Chapter 6 "How Forces Affect Motion" — REMAINING CONTENT PAGES.
 *
 * Builds the 8 content pages other than the two pilots (what-is-force,
 * newtons-third-law), and fixes the chapter's page order. Follows
 * BOOK_PAGE_WORKFLOW.md §4B (Class 9 Exploration), §13 (Vedic Fusion verse as
 * block 2), §3.6.1 (every quiz option a real trap). Images are src:"" +
 * generation_prompt placeholders. English-only.
 *
 * Final reading order (page_number):
 *   135 what-is-force                 (pilot, unchanged)
 *   136 balanced-and-unbalanced-forces (update stub)
 *   137 friction                       (update stub)
 *   138 newtons-first-law              (update stub)
 *   139 newtons-second-law             (update stub)
 *   140 weight-and-gravity             (NEW)
 *   141 second-law-in-everyday-life    (NEW)
 *   142 newtons-third-law              (pilot, moved 141 -> 142)
 *   143 third-law-in-action            (NEW)
 *   144 forces-on-a-system             (NEW)
 *   145 ch6-practice-mastery           (built separately by science-practice toolchain)
 *
 * Deletes redundant stubs: si-unit-of-force, applying-newtons-laws, newtons-laws-as-a-model.
 *
 *   node scripts/science-ch6/build_remaining_pages.js [--dry]
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 6;
const DRY = process.argv.includes('--dry');
const uid = () => crypto.randomUUID();

// ── block factories ──────────────────────────────────────────────────────────
const img = (alt, generation_prompt) => ({ type: 'image', src: '', alt, caption: '', width: 'full', generation_prompt });
const txt = (markdown) => ({ type: 'text', markdown });
const h2 = (text) => ({ type: 'heading', level: 2, text });
const cur = (prompt, hint, reveal) => ({ type: 'curiosity_prompt', prompt, hint, reveal });
const verse = (title, markdown) => ({ type: 'callout', variant: 'fun_fact', title, markdown });
const callout = (variant, title, markdown, tier) => ({ type: 'callout', variant, title, markdown, ...(tier ? { tier } : {}) });
const reason = (reasoning_type, difficulty_level, prompt, options, correct_index, reveal) =>
  ({ type: 'reasoning_prompt', reasoning_type, difficulty_level, prompt, options, correct_index, reveal });
const we = (label, problem, solution) => ({ type: 'worked_example', label, variant: 'solved_example', problem, solution, reveal_mode: 'tap_to_reveal' });
const latex = (latexStr, label, note) => ({ type: 'latex_block', latex: latexStr, label, note });
const q = (question, options, correct_index, explanation, difficulty_level) => ({ id: uid(), question, options, correct_index, explanation, difficulty_level });
const quiz = (...questions) => ({ type: 'inline_quiz', pass_threshold: 0.67, questions });
const seq = (blocks) => blocks.map((b, i) => ({ id: uid(), order: i, ...b }));

// ─────────────────────────── PAGE 2 — BALANCED & UNBALANCED FORCES ───────────
const balanced = seq([
  img('Two tug-of-war teams straining on a taut rope that barely moves',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. Two teams of Indian schoolchildren in a tug of war, heels dug in, the rope pulled bar-tight between them and a flag at its centre hanging almost still. Soft glowing arrows pull in opposite directions along the rope, equal in length to suggest a deadlock. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('In a tug of war, both teams pull as hard as they possibly can — yet for long stretches the rope hardly moves at all. If both sides are giving everything they have, why does the rope just sit there?',
    'Think about the two pulls together, not one at a time. What is their combined effect on the rope?',
    "When two equal pulls act in opposite directions, they cancel — the rope feels a huge tug each way but no overall push in either direction. That 'cancelling' is the whole idea of balanced forces, and it is where this page begins."),
  verse('भगवद्गीता — अध्याय २, श्लोक ४८',
    '_Balance itself is the skill_\n\n' +
    '### योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\n' +
    '### सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥\n\n' +
    '---\n\n' +
    'मन को स्थिर रखकर अपना काम करो, हार और जीत दोनों में एक जैसा रहो। यही समता, यही संतुलन ही असली योग है।\n\n' +
    '*Act with a steady mind, treating success and failure alike — this evenness, this balance (samatva), is yoga. In nature too, when opposing pulls are perfectly even, the result is a calm, unmoving balance.*'),
  txt('In real life a single force almost never acts alone. Push a box across the floor and friction pushes back on it at the same time. A ball floating on water feels gravity pulling it down **and** the water pushing it up. So the real question is never "what does one force do?" — it is "what do all the forces *together* do?"'),
  h2('Balanced forces: a standstill that is not empty'),
  txt('Go back to the tug of war. While both teams pull equally, the rope stays put. Two forces that are **equal in size but opposite in direction** are called **balanced forces**. The forces have not disappeared — they cancel each other, so their combined effect is zero. With no overall force, the rope cannot start moving or change how it moves.'),
  img('A box with two equal opposite arrows, and a ball on water with equal up and down arrows',
    'Clean educational diagram on a dark charcoal background, two panels. Left: a box with two arrows of equal length pointing in opposite directions (left and right), perfectly balanced. Right: a ball floating on water with one arrow pointing down (gravity) and an equal arrow pointing up (buoyant force). Warm amber and cool blue arrows, minimal textbook style, high contrast on the dark ground. No text, no numbers, no labels.'),
  h2('Unbalanced forces and the net force'),
  txt('Now suppose one team pulls harder. The pulls are no longer equal, so they are **unbalanced**, and the rope moves toward the stronger side. The single force that has the same effect as all the forces together is called the **net force**.\n\nWhen two forces act in *opposite* directions, the net force is their **difference**, pointing the way the larger one points. When they act in the *same* direction, the net force is their **sum**. An object only changes its motion when the net force on it is not zero.'),
  reason('logical', 2,
    'A heavy crate is pushed to the right with 12 N while friction drags it left with 12 N, and it sits perfectly still. Your friend looks at it and says, "See — there are no forces acting on that crate at all." Are they right?',
    [
      'Yes — a still object has no forces acting on it, by definition',
      'No — two forces of 12 N act on it, but being equal and opposite they cancel to a net force of zero',
      'Yes — the forces destroyed each other and no longer exist',
      'No — only the friction force is real; the push stopped existing once the crate stalled',
    ], 1,
    'The crate is still because the forces are **balanced**, not because they are absent. A 12 N push and a 12 N friction act in opposite directions, so the net force is 12 − 12 = 0 N. Zero *net* force is very different from zero forces.'),
  we('Example 6.1 — Finding the net force',
    'Two forces of 10 N and 6 N act on a block on a table. Find the net force when they act: (a) in the same direction, (b) opposite directions with 10 N to the right, (c) opposite directions with 10 N to the left.',
    '**(a) Same direction:** the forces add up.\n\n$ \\text{Net} = 10 + 6 = 16\\ \\text{N} $, in the direction of the two forces.\n\n**(b) Opposite, 10 N to the right:** the forces subtract; the result points the way the larger force points.\n\n$ \\text{Net} = 10 - 6 = 4\\ \\text{N} $, towards the **right**.\n\n**(c) Opposite, 10 N to the left:** same size of net force, opposite direction.\n\n$ \\text{Net} = 10 - 6 = 4\\ \\text{N} $, towards the **left**.'),
  callout('threads_of_curiosity', 'Tug of war used to be an Olympic sport',
    'From **1900 to 1920**, tug of war was a real Olympic event. The winning team was simply the one that applied the larger force — an unbalanced force that dragged the rope (and the losing team) across the line. It was dropped after the 1920 Games, but it is a perfect picture of balanced versus unbalanced forces.'),
  quiz(
    q('Two forces are called "balanced" when they are…',
      [
        'equal in size and act in opposite directions on the object',
        'equal in size and act in the same direction on the object',
        'unequal in size and act in opposite directions on the object',
        'applied one after the other rather than at the same time',
      ], 0,
      'Balanced forces are equal in magnitude and opposite in direction, so they cancel to a net force of zero. If they pointed the same way they would add up, and if they were unequal the object would move.', 1),
    q('Two people push a stalled car in the *same* direction, one with 300 N and one with 250 N. What is the net force on the car?',
      [
        '50 N, in the direction of the larger push',
        '300 N, since the net force is just the larger of the two pushes',
        '550 N, in the direction of the two pushes',
        '25 N, the average of the two pushes',
      ], 2,
      'Forces in the same direction add: 300 + 250 = 550 N, pointing the way both people push. You only subtract when forces oppose each other.', 2),
    q('A toy stays exactly still even though three children are pushing it from different sides. What must be true of the net force on it?',
      [
        'The net force points toward the strongest child',
        'The net force equals the sum of all three pushes',
        'There must be no forces touching the toy at all',
        'The net force on the toy is zero, so the pushes balance out',
      ], 3,
      'An object that does not change its motion has zero net force. Here the three pushes happen to cancel out. That is not the same as having no forces — the pushes are real, they simply add up to zero.', 3),
  ),
]);

// ─────────────────────────── PAGE 3 — THE FORCE OF FRICTION ──────────────────
const friction = seq([
  img('A wooden box being pushed across a floor, slowing to a stop',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. A person pushing a heavy wooden box across a textured floor, the box slowing as it travels, faint streaks behind it suggesting drag. A soft glowing arrow shows the push forward and a second arrow shows friction resisting backward along the contact surface. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('Roll a ball across the floor and let go. It travels a little way, slows down, and stops — all by itself. Nobody ran up and pushed it backward. So what brought it to a halt?',
    'Think about what the ball is touching the whole time it rolls.',
    'A hidden force was acting the entire time: friction, between the ball and the floor. It is easy to overlook because you cannot see it, but it is almost always present — and this page is about it.'),
  verse('भगवद्गीता — अध्याय ६, श्लोक ५',
    '_The same force can be friend or foe_\n\n' +
    '### उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\n' +
    '### आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥\n\n' +
    '---\n\n' +
    'अपने आप को खुद ऊपर उठाओ, खुद को गिरने मत दो। इंसान खुद ही अपना दोस्त है और खुद ही अपना दुश्मन।\n\n' +
    '*Lift yourself by your own effort; do not drag yourself down. You can be your own friend or your own enemy. Friction is just like that — it fights you when you try to move, yet it is the very thing that lets you walk and grip.*'),
  txt('**Friction** is a force that appears between two surfaces that are touching, and it always acts *opposite* to the motion — or opposite to the way you are *trying* to move. That is why a heavy box often refuses to budge: friction pushes back on it. The box starts moving only when your push is **larger** than the friction, so that a net force acts in the direction you want.'),
  h2('Why moving things slow down on their own'),
  txt('Once the box is moving, friction does not switch off — it keeps pushing backward. So the moment you stop pushing, friction is the only force left along the floor, and it slows the box until it stops. This is why you must keep pedalling a bicycle to hold a steady speed: your effort is spent cancelling friction, not because motion itself needs a force.'),
  img('A box with a forward push arrow, a backward friction arrow, plus normal force up and weight down',
    'Clean educational diagram on a dark charcoal background. A box resting on a floor with four labelled-length arrows: a forward amber arrow (applied push), a backward blue arrow (friction) along the contact surface, an upward arrow (the floor pushing up, the normal force) and an equal downward arrow (weight). The push and friction arrows differ in length. Minimal textbook style, high contrast on the dark ground. No text, no numbers, no labels.'),
  callout('note', 'Two more forces are always there',
    'Besides your push and friction, two vertical forces act on the box: its **weight** pulling straight down, and the **normal force** — the surface pushing straight up. These two are balanced, which is why the box does not sink into the floor or fly off it.'),
  h2('Friction depends on the surfaces'),
  txt('Does every surface grip the same? Slide the same object across a rough wooden table, then a smooth marble floor. On the smoother surface it glides much farther before stopping. A spring balance makes this exact: pull an object until it just begins to move, and the reading tells you the size of the friction. A **smaller** reading means **less** friction — and the object travels farther. So friction depends on the nature of the surfaces in contact.'),
  reason('logical', 3,
    'Imagine a floor and a ball with surfaces so perfectly smooth that the friction between them is exactly zero. You give the ball a single push and then take your hand away. What happens next?',
    [
      'The ball slows down gradually and stops, just more slowly than usual',
      'The ball stops almost at once, because there is nothing to keep it going',
      'The ball keeps moving forever at the same speed, since nothing acts to slow it',
      'The ball speeds up on its own once your hand lets go',
    ], 2,
    'Friction is the only thing that was ever slowing the ball. Remove it completely and there is nothing left to reduce its speed, so it would glide on forever at a constant speed. This thought experiment is exactly what leads to Newton’s first law.'),
  callout('quest_continues', 'The hunt to tame friction',
    'Friction wastes energy and wears machines out, so scientists keep finding ways to reduce it: oily **lubricants**, slippery **coatings**, **streamlined** shapes that cut through air, and even **magnetic levitation** trains that float above the track with no contact at all. Cutting friction is still an active engineering frontier.'),
  quiz(
    q('In which direction does the force of friction act on a box that you are sliding to the right?',
      [
        'To the right, in the same direction you are sliding it',
        'To the left, opposite to the direction of sliding',
        'Straight downward, adding to the box’s weight',
        'It acts in no particular direction, since friction has no direction',
      ], 1,
      'Friction always opposes the motion (or attempted motion), so for a box sliding right it points left. It is a force with a definite direction, and that direction is always against the sliding.', 1),
    q('You drag the same wooden block across four floors. On which one will it travel the *farthest* after one pull?',
      [
        'The floor where the spring balance showed the largest pull to start it moving',
        'The roughest floor, because rough surfaces push objects along',
        'The floor where the spring balance showed the smallest pull to start it moving',
        'They will all give the same distance, since the block is the same',
      ], 2,
      'A smaller spring-balance reading means less friction on that surface. Less friction removes speed more slowly, so the block travels farther. The roughest floor (largest reading) would stop it soonest.', 2),
    q('A cyclist stops pedalling on a flat road and slowly coasts to a halt. Why must she keep pedalling to hold a steady speed?',
      [
        'Because motion itself needs a constant force to continue',
        'Because her pedalling must keep cancelling the friction that is always slowing her',
        'Because the road pushes the cycle backward only when she pedals',
        'Because a bicycle speeds up unless a force is constantly removed',
      ], 1,
      'On a moving cycle, friction acts backward the whole time. Pedalling supplies a forward force that just cancels friction, leaving zero net force and a steady speed. The motion does not need a force — overcoming friction does.', 3),
  ),
]);

// ─────────────────────────── PAGE 4 — NEWTON'S FIRST LAW & INERTIA ───────────
const firstLaw = seq([
  img('A spacecraft drifting silently through deep space with its engines off',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. A lone spacecraft coasting through deep space with its engine nozzles dark and cold, stars stretching to the horizon. No exhaust, no thrust — just silent, steady drift. Deep indigo and charcoal tones with pinpoint stars, warm amber rim-light on the craft, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('A spacecraft far out in empty space switches off its engines completely. With nothing pushing it any more, what do you think happens to its speed — does it slow down, keep going, or stop?',
    'Out there, there is no air and no ground to rub against. What could possibly change its motion?',
    'With no force acting, nothing changes its motion — so it keeps gliding at the same speed, in the same direction, indefinitely. That single idea is Newton’s first law of motion.'),
  verse('भगवद्गीता — अध्याय ६, श्लोक १९',
    '_Steady as a flame in still air_\n\n' +
    '### यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता ।\n' +
    '### योगिनो यतचित्तस्य युञ्जतो योगमात्मनः ॥\n\n' +
    '---\n\n' +
    'जैसे हवा रहित जगह में रखा दीपक हिलता नहीं, बिलकुल स्थिर जलता रहता है — वैसे ही स्थिर मन वाले योगी का मन डगमगाता नहीं।\n\n' +
    '*Like a lamp in a windless place that does not flicker, the steady mind stays still. An object behaves the same way: left undisturbed by any force, it simply keeps doing what it was already doing.*'),
  txt('For a very long time, people believed that a force is needed to *keep* something moving — stop pushing, and it stops, so motion must need a constant push. **Galileo Galilei** showed this was wrong. He reasoned that things stop only because friction is secretly slowing them; remove every obstacle, and a moving object would simply carry on. **Isaac Newton** named this tendency of objects to resist any change in their motion **inertia**, and built it into his first law.'),
  {
    type: 'meet_a_scientist',
    name: 'Galileo Galilei',
    years: '1564–1642',
    nationality: 'Italian',
    portrait_src: '',
    portrait_prompt: 'Portrait illustration of Galileo Galilei, Italian scientist of the 1600s, with a greying beard, wearing a dark scholarly robe, holding a small telescope, a thoughtful and determined expression. Subtle background of a smooth inclined plane with a rolling ball, hinting at his motion experiments. Painterly illustration, warm sepia and deep indigo tones, dignified and editorial.',
    contribution: 'Through careful experiments rolling balls down smooth ramps, Galileo argued that a moving object does not need a force to keep moving — it slows only because of friction. Remove the friction, he reasoned, and it would **continue forever**. This overturned almost two thousand years of belief and laid the groundwork for Newton.',
    connection: 'His idea that motion continues on its own, unless something interferes, is exactly what Newton’s first law states. Galileo supplied the insight; Newton gave it its precise form.',
    fun_detail: 'Galileo never had a stopwatch — to time falling and rolling objects he sometimes used his own pulse, and even a kind of water clock that weighed the water that drained out.',
    learn_more: 'Galileo Galilei, "Dialogues Concerning Two New Sciences" (1638).',
  },
  h2("Newton's First Law of Motion"),
  txt('Newton stated it like this: **an object at rest stays at rest, and an object in motion keeps moving with a constant velocity, unless a net force acts on it.** In other words, if the net force on an object is zero, it cannot start moving or change its velocity — its acceleration is zero. Remember that "constant velocity" means an unchanging *speed* **and** an unchanging *direction*: motion in a straight line at the same pace.'),
  callout('remember', "Newton's First Law of Motion",
    'An object at rest remains at rest, and an object in motion continues to move with a **constant velocity**, unless a **net force** acts upon it. Zero net force means zero acceleration — no change in speed or direction.'),
  img('Two pairs of graphs: at rest (flat lines) and constant velocity (a level v-t line, a sloped p-t line)',
    'Clean educational diagram on a dark charcoal background, showing two pairs of simple graphs side by side. Pair one (object at rest): a position-time graph that is a flat horizontal line, and a velocity-time graph that lies along the zero line. Pair two (object at constant velocity): a position-time graph that is a straight sloping line rising steadily, and a velocity-time graph that is a flat horizontal line above zero. Clean axes, warm amber curves, minimal textbook style, high contrast on the dark ground. No text, no numbers, no labels.'),
  we('Example 6.2 — A push that exactly matches friction',
    'A person pushes a moving box forward with a force equal to the friction acting backward on it. Will the box keep moving, or stop after a while?',
    'List the forces along the floor: the **applied push forward** and the **friction backward**, and they are equal in size.\n\nEqual and opposite forces on the same object **balance**, so the net force is zero.\n\nBy Newton’s first law, zero net force means no change in velocity. The box does **not** stop — it keeps moving at a **constant velocity**. (It would only slow down if friction were larger than the push.)'),
  reason('logical', 3,
    'A truck rolls along a straight, level highway at a steady 60 km/h. The cruise is perfectly smooth — the speed and direction never change. Is there a net force acting on the truck?',
    [
      'Yes — a forward net force must keep pushing it or it would slow and stop',
      'No — constant velocity means the net force is zero; the engine only cancels drag',
      'Yes — a net force equal to the truck’s own weight acts on it constantly',
      'It is impossible to tell without first knowing the truck’s mass',
    ], 1,
    'Constant velocity (steady speed *and* direction) means zero acceleration, which by the first law means zero **net** force. The engine does push, but only enough to cancel friction and air resistance, so the forces balance out.'),
  callout('bridging_science', 'Why you lurch when the bus brakes',
    'Stand in a moving bus and it brakes suddenly — your body jerks **forward**. Your feet stop with the bus, but the rest of you was moving and its inertia keeps it moving until something (your grip, a handrail) supplies a force. The same inertia is why seat belts exist: in a crash, your body would keep moving forward at the car’s old speed unless the belt holds it back.'),
  quiz(
    q('Newton’s first law says that an object with **zero net force** on it will…',
      [
        'always slow down and eventually come to a complete rest',
        'speed up steadily in whatever direction it is facing',
        'gradually drift in a curve until something finally stops it',
        'keep a constant velocity, or stay at rest if it was at rest',
      ], 3,
      'Zero net force means zero acceleration: no change in motion. A resting object stays at rest; a moving one keeps the same speed and direction. It neither slows, speeds up, nor curves on its own.', 1),
    q('A coin sits on a card on top of a glass. You flick the card away sharply and the coin drops straight into the glass. Why does the coin not fly off with the card?',
      [
        'The coin’s inertia keeps it still while the flick whips the card away',
        'The coin is heavier than the card, so no force can act on it at all',
        'The card pushes the coin downward into the glass as it leaves',
        'The flick gives the coin a backward force that holds it still',
      ], 0,
      'The coin tends to stay where it is — that is inertia. The flick acts on the card for too short a time to drag the coin along, so the card shoots out and the coin, left unsupported, simply drops.', 2),
    q('A hockey puck slides across smooth, near-frictionless ice in a straight line at a steady speed. What can you conclude about the net force on it?',
      [
        'A small forward force keeps it gliding along',
        'The net force on it is zero while it moves at constant velocity',
        'The net force points in the direction it is sliding',
        'The net force grows larger the farther it travels',
      ], 1,
      'Steady speed in a straight line is constant velocity, so the acceleration is zero and the net force must be zero. Nothing needs to push it along — with almost no friction, there is nothing to slow it either.', 3),
  ),
]);

// ─────────────────────────── PAGE 5 — NEWTON'S SECOND LAW (F = ma) ───────────
const secondLaw = seq([
  img('An empty trolley leaping forward and a loaded trolley barely moving under the same push',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. A split scene: on the left, a person gives an empty shopping trolley a push and it rolls fast, motion streaks trailing it; on the right, the same person pushes an identical trolley piled with heavy sacks and it barely creeps. Equal-sized push arrows on both to show the force is the same. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('Give an empty shopping trolley a push and it leaps forward. Pile it with sacks of rice, push exactly as hard, and it barely creeps. The push was identical both times — so what decided how much it sped up?',
    'Two things can change between the two tries. The push stayed the same. What did not?',
    'The difference is the trolley’s mass. The same push produces a big change in motion for a light object and a small change for a heavy one. The exact rule linking force, mass, and acceleration is Newton’s second law.'),
  verse('भगवद्गीता — अध्याय २, श्लोक ४७',
    '_Your hand is on the cause, not the result_\n\n' +
    '### कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\n' +
    '### मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥\n\n' +
    '---\n\n' +
    'तुम्हारा हक़ सिर्फ़ अपने काम पर है, उसके नतीजे पर नहीं। इसलिए नतीजे की चिंता में काम करना मत छोड़ो।\n\n' +
    '*You have control over your action, never directly over its result. In motion it is the same — you choose the force you apply; the acceleration that follows is fixed by the law F = ma.*'),
  txt('A force changes an object’s velocity, and a change in velocity is **acceleration**. So a force produces acceleration. But how much? Two everyday experiences point the way. Push the same object harder and it accelerates more. Use the same push on a heavier object and it accelerates less. Newton turned these two observations into a single, exact law.'),
  h2('Putting it together: F = ma'),
  txt('Newton’s second law says: when a net force acts on an object, the object accelerates **in the direction of that force**. The acceleration is **larger** when the force is larger, and **smaller** when the mass is larger. In symbols, acceleration is the net force divided by the mass.'),
  latex('a = \\frac{F}{m} \\qquad\\text{or}\\qquad F = ma', "Newton's Second Law",
    'F = net force (newton, N) · m = mass (kilogram, kg) · a = acceleration (m/s²). The acceleration points the same way as the net force.'),
  txt('This law also gives the newton its exact meaning. **One newton is the force that gives a 1 kg mass an acceleration of 1 m/s²** — that is, $1\\ \\text{N} = 1\\ \\text{kg} \\cdot \\text{m/s}^2$. That is the precise size of the unit you first met as "the unit of force".'),
  img('A cart on wheels pulled by a string over a pulley, with a small cup of weights hanging down',
    'Clean educational diagram on a dark charcoal background. A small cart made from a box on four wheels sits on a table; a thread runs from the cart, over a pulley at the table edge, down to a hanging cup holding small weights. An arrow shows the cart accelerating toward the pulley as the cup falls. Minimal textbook style, warm amber highlights, high contrast on the dark ground. No text, no numbers, no labels.'),
  reason('quantitative', 2,
    'You apply the same net force to a 2 kg trolley and to a 6 kg trolley. How do the accelerations compare?',
    [
      'Both trolleys get the same acceleration, because the force is the same',
      'The 2 kg trolley accelerates three times as much as the 6 kg trolley',
      'The 6 kg trolley accelerates three times as much, because it has more mass to move',
      'There is no way to compare them without knowing the size of the force',
    ], 1,
    'Acceleration is force ÷ mass. For the same force, three times the mass gives one-third the acceleration. So the 2 kg trolley (one-third the mass of the 6 kg one) accelerates three times as fast.'),
  we('Example — Acceleration from a net force',
    'A net force of 12 N acts on a 4 kg box resting on a smooth surface. Find its acceleration.',
    'Use Newton’s second law, $ a = F/m $.\n\n$ a = \\dfrac{12\\ \\text{N}}{4\\ \\text{kg}} = 3\\ \\text{m/s}^2 $\n\nThe box accelerates at **3 m/s²**, in the same direction as the net force.'),
  callout('ready_to_go_beyond', 'A deeper form: momentum',
    'In higher classes you will meet a more powerful version of this law, written in terms of **momentum** — the product of an object’s mass and its velocity. Newton’s second law really says that the *net force equals the rate of change of momentum*. That form even works when the mass itself is changing, such as a rocket burning fuel.',
    'competitive'),
  quiz(
    q('Newton’s second law is best written as…',
      [
        'F = m + a, adding the mass and the acceleration',
        'F = m ÷ a, the mass divided by the acceleration',
        'F = m × a, the mass times the acceleration',
        'F = a ÷ m, the acceleration divided by the mass',
      ], 2,
      'Force equals mass times acceleration, F = ma. Equivalently a = F/m. The other combinations do not match how acceleration actually depends on force and mass.', 1),
    q('A net force of 20 N acts on a 5 kg object. What is its acceleration?',
      [
        '4 m/s², found from acceleration = force ÷ mass',
        '100 m/s², found by multiplying the force and the mass',
        '25 m/s², found by adding the force and the mass',
        '0.25 m/s², found from mass ÷ force',
      ], 0,
      'Acceleration = force ÷ mass = 20 ÷ 5 = 4 m/s². Multiplying or adding would give the wrong quantity, and dividing mass by force inverts the relationship.', 2),
    q('The same engine force pushes two boats. Boat X has twice the mass of boat Y. How do their accelerations compare?',
      [
        'Boat X accelerates twice as fast as boat Y',
        'Both boats accelerate equally, since the force is equal',
        'Acceleration cannot depend on mass, only on the force',
        'Boat Y accelerates twice as fast as boat X',
      ], 3,
      'For the same force, acceleration is inversely proportional to mass. Boat X has twice the mass, so it gets half the acceleration — meaning the lighter boat Y accelerates twice as fast.', 3),
  ),
]);

// ─────────────────────────── PAGE 6 — WEIGHT: GRAVITY AS A FORCE (F = mg) ────
const weight = seq([
  img('A heavy iron ball and a light wooden ball falling side by side from the same height',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. A heavy dark iron ball and a smaller light wooden ball captured mid-fall, side by side at exactly the same height, against a tall dim wall. Soft downward motion streaks behind both. Equal downward glowing arrows on each. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('Hold a coin in one hand and a crumpled ball of paper in the other — clearly different weights. Drop them from the same height at the very same moment. Which one do you think reaches the floor first?',
    'Picture them falling. Does the heavier one really pull ahead, or do they stay level?',
    'Apart from the small effect of air on the paper, they land together. Gravity gives every object the same acceleration, whatever its mass — and this page explains why.'),
  verse('भगवद्गीता — अध्याय ७, श्लोक ७',
    '_All things strung on a single thread_\n\n' +
    '### मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय ।\n' +
    '### मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव ॥\n\n' +
    '---\n\n' +
    'मुझसे बढ़कर और कुछ नहीं है। यह सारा संसार मुझमें ऐसे पिरोया हुआ है जैसे धागे में मोती।\n\n' +
    '*All this is strung upon Me like beads upon a single thread. Gravity is a little like that thread — one and the same pull reaches out and holds every object, from a falling pebble to the Moon.*'),
  txt('When you hold a bag and let go, it falls. The Earth is pulling it down with a gravitational force, and that force is what we call the object’s **weight**. Because weight is a force, Newton’s second law applies to it. The acceleration that gravity gives a falling object is written **g**, so the weight of an object of mass *m* is **W = mg**. Note this carefully: weight is a *force*, measured in **newtons** — not in kilograms.'),
  latex('W = mg', 'Weight of an object',
    'g = acceleration due to gravity ≈ 9.8 m/s² near the Earth’s surface (often rounded to 10 m/s² for quick estimates).'),
  h2('Why a heavy and a light object fall together'),
  txt('Here is the surprising part: **g is the same for every object** — about 9.8 m/s² near the Earth’s surface — no matter how heavy it is. A heavy object does feel a bigger gravitational pull, but it also has more mass resisting that pull (more inertia). The two effects exactly cancel, so every object falls with the same acceleration. The only reason a sheet of paper drifts down slowly is **air resistance**; remove the air, and a feather and a hammer fall side by side.'),
  img('A heavy ball and a light ball at the same height with equal-length downward acceleration arrows',
    'Clean educational diagram on a dark charcoal background. Two balls of clearly different sizes (one large and heavy-looking, one small and light) drawn at the same height, each with a downward arrow of equal length showing they accelerate at the same rate. A dotted floor line below both. Minimal textbook style, warm amber arrows, high contrast on the dark ground. No text, no numbers, no labels.'),
  reason('analogical', 3,
    'On the Moon there is no air at all. An astronaut holds a heavy hammer and a light feather at the same height and lets go of both together. What happens?',
    [
      'The hammer lands clearly first, because it is much heavier',
      'The feather lands first, because light things fall more easily',
      'Both land at the same moment, with equal acceleration from gravity',
      'Neither falls at all, because there is no air to pull them down',
    ], 2,
    'On Earth the feather only lags because of air resistance. With no air on the Moon, that effect is gone, so both fall with the same lunar g and land together. This experiment was actually done on the Moon during Apollo 15.'),
  we('Example 6.4 — The force to hold a barbell steady',
    'A barbell has a 10 kg weight fixed on each side of a bar, and the bar itself is 10 kg. How much force must a weightlifter apply to hold it steady? (Take g = 9.8 m/s².)',
    'Total mass: $ 10 + 10 + 10 = 30\\ \\text{kg} $.\n\nThe Earth pulls the barbell down with its weight, $ W = mg $:\n\n$ W = 30\\ \\text{kg} \\times 9.8\\ \\text{m/s}^2 = 294\\ \\text{N} $, downward.\n\nTo hold it steady the forces must balance, so the lifter pushes **up** with an equal force: **294 N upward**.'),
  callout('threads_of_curiosity', 'Your weight is not quite fixed',
    'Because g is not perfectly constant, your weight changes a little depending on where you are. It is very slightly larger at the **poles** than at the **equator**, and a touch smaller on a high mountain. Travel to the **Moon**, where g is about one-sixth of Earth’s, and your weight drops to roughly a sixth — even though your mass has not changed at all.'),
  quiz(
    q('The weight of an object is…',
      [
        'the gravitational force the Earth pulls on it with, measured in newtons',
        'the amount of matter in the object, measured in kilograms',
        'the speed at which the object falls toward the ground',
        'the same as its mass, just written in different units',
      ], 0,
      'Weight is a force — the Earth’s gravitational pull on the object — so it is measured in newtons. The amount of matter is the mass (in kilograms); mass and weight are different quantities.', 1),
    q('A school bag has a mass of 5 kg. Roughly what is its weight? (Take g = 10 m/s².)',
      [
        '5 N, the same number as the mass',
        '0.5 N, found by dividing the mass by g',
        '2 N, found by dividing g by the mass',
        '50 N, found from weight = mass × g',
      ], 3,
      'Weight = mg = 5 × 10 = 50 N. The mass (5 kg) and the weight (50 N) are different quantities with different units, so they are not the same number.', 2),
    q('Two balls, one heavy and one light, are dropped together in a vacuum tube with no air. What do you observe?',
      [
        'The heavier ball reaches the bottom first',
        'They fall together and reach the bottom at the same time',
        'The lighter ball reaches the bottom first',
        'Both stay floating, since there is no air to pull them',
      ], 1,
      'With no air resistance, the only force is gravity, which gives every object the same acceleration g regardless of mass. So both balls fall together — the heavier one’s bigger pull is exactly offset by its bigger inertia.', 3),
  ),
]);

// ─────────────────────────── PAGE 7 — THE SECOND LAW IN EVERYDAY LIFE ────────
const secondLawLife = seq([
  img('A cricketer catching a fast ball while drawing both hands back toward the body',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. An Indian cricketer in the field completing a catch, both gloved hands cradling the ball and pulled back toward the chest, the ball’s motion streak showing it slowing over the give of the hands. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('A fielder catches a fast cricket ball and, in the same motion, pulls both hands back toward the body. Why that little backward give — wouldn’t it be simpler just to hold the hands still and stop the ball dead?',
    'Think about how quickly the ball’s speed drops to zero in each case.',
    'Pulling the hands back lets the ball slow down over a longer time. A gentler slowdown means a smaller force on the hands — less sting, less chance of injury. That is Newton’s second law, used as a skill.'),
  verse('भगवद्गीता — अध्याय २, श्लोक ५०',
    '_Skill in action is the real art_\n\n' +
    '### बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते ।\n' +
    '### तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ॥\n\n' +
    '---\n\n' +
    'समझदारी से काम करने वाला अच्छे-बुरे दोनों के बंधन से ऊपर उठ जाता है। इसलिए कुशलता से काम करना सीखो — यही योग है, काम में कुशलता।\n\n' +
    '*Work with wisdom and skill. Yoga is skill in action (karmasu kaushalam). A fielder, an engineer designing an airbag — each is using the same law of motion with skill, to turn a hard blow into a gentle one.*'),
  txt('Newton’s second law is not only for exam sums — it quietly shapes how we keep ourselves safe. Rearrange the idea: to make a collision **gentler**, stretch out the **time** over which an object’s velocity changes. A slower change in velocity is a smaller acceleration, and a smaller acceleration needs a smaller force. The fielder’s backward pull is exactly this: more time to stop the ball, so a smaller force on the hands.'),
  h2('Stretching out time to soften a blow'),
  txt('The same trick is everywhere. A car **airbag** inflates so your head slows over a longer time instead of hitting the hard dashboard in an instant — smaller force, fewer injuries. **Bubble wrap** around glassware, a thick **landing mat** for a high jumper, and a heap of **hay** all do the same job. The opposite is true too: when a coconut is smashed onto the ground it stops in a tiny fraction of a second, so the force is enormous — and the shell cracks.'),
  callout('bridging_science', 'How airbags and seat belts save lives',
    'In a crash a car stops almost instantly, and without help your body would keep moving and hit the dashboard hard. An **airbag** inflates into a soft cushion so your head and chest slow down over a slightly longer time — and a longer stopping time means a smaller force on your body. Worn together with a **seat belt**, which spreads and lengthens that stop even more, airbags sharply lower the risk of serious injury.'),
  we('Example 6.6 — Force from a velocity–time graph',
    'A 1500 kg sports car speeds up steadily from 0 to 10 m/s during 0–5 s, holds 10 m/s from 5–10 s, then slows steadily from 10 m/s to 0 during 10–15 s. Find the force on the car in each interval.',
    '**0–5 s (speeding up):** acceleration $ a = \\dfrac{10 - 0}{5} = 2\\ \\text{m/s}^2 $.\n\n$ F = ma = 1500 \\times 2 = 3000\\ \\text{N} $, in the direction of motion.\n\n**5–10 s (constant velocity):** the velocity does not change, so $ a = 0 $ and $ F = 0\\ \\text{N} $. No net force is needed to keep a steady speed.\n\n**10–15 s (slowing down):** $ a = \\dfrac{0 - 10}{5} = -2\\ \\text{m/s}^2 $.\n\n$ F = 1500 \\times (-2) = -3000\\ \\text{N} $ — that is, 3000 N acting **opposite** to the motion (a braking force).'),
  reason('quantitative', 2,
    'Two children of different masses sit on identical swings. You want to give each the same starting acceleration with a single push. For which child do you need the bigger push?',
    [
      'The heavier child needs the bigger push',
      'The lighter child needs the bigger push',
      'Both children need exactly the same push',
      'No push can give two different children the same acceleration',
    ], 0,
    'From F = ma, for the same acceleration a bigger mass needs a bigger force. The heavier child has more mass, so a larger push is required to give them the same starting acceleration as the lighter child.'),
  callout('threads_of_curiosity', 'Why a karate chop can break a board',
    'A trained karate practitioner brings their hand down so that it is stopped by the board in a tiny sliver of time. Changing the hand’s speed that quickly demands a very large force — and that large force, concentrated on a thin edge of wood, is what snaps the board. Same law as the coconut, used on purpose.'),
  quiz(
    q('Why does a cricketer pull their hands back while catching a fast ball?',
      [
        'To grip the ball more tightly so that it cannot bounce out',
        'To make the ball spin in the air, which slows it down faster',
        'To stop the ball over a longer time, lowering the force on the hands',
        'To push the ball forward a little just before catching it',
      ], 2,
      'Drawing the hands back lengthens the time over which the ball stops. A longer stopping time means a smaller acceleration and therefore a smaller force on the hands — less sting and less risk of injury.', 1),
    q('Which of these works by *reducing* the force during an impact?',
      [
        'A coconut being smashed hard onto a stone floor',
        'A thick foam mat placed where a high jumper lands',
        'A hammer striking a nail to drive it in quickly',
        'A karate expert snapping a wooden board',
      ], 1,
      'The foam mat lets the jumper slow over a longer time, reducing the force on their body. The coconut, hammer, and karate chop all do the opposite — they stop something in a very short time to create a large force.', 2),
    q('During 5–10 s a 1500 kg car moves at a steady 10 m/s. What net force acts on it during that interval?',
      [
        '0 N, because its velocity is not changing',
        '15000 N, found by multiplying the mass and the speed',
        '3000 N, the same as while it was speeding up',
        '150 N, found by dividing the speed by the mass',
      ], 0,
      'Steady velocity means zero acceleration, so the net force is F = ma = 1500 × 0 = 0 N. Mass times speed is not a force, and there is no acceleration to give a non-zero force here.', 3),
  ),
]);

// ─────────────────────────── PAGE 9 — THE THIRD LAW IN ACTION ────────────────
const thirdLawAction = seq([
  img('A rocket lifting off on a column of downward exhaust, a walker stepping off the ground beside it',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. A rocket lifting off, a bright column of exhaust gas blasting downward while the rocket rises, set against a deep night sky; to one side, a runner pushing off the ground mid-stride. Soft glowing arrows: gas pushed down, rocket pushed up; foot pushing back, ground pushing the runner forward. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('A rocket coasting in deep space has nothing around it to push against — no ground, no air, no water. Yet it can still speed up, slow down, and change direction. How is that possible with nothing to push on?',
    'A force needs two objects. If there is nothing outside to push against, what could the rocket push against instead?',
    'The rocket carries its own "something to push on": its fuel. It throws gas out one way, and by Newton’s third law the gas pushes the rocket the other way. This page is about that law in action.'),
  verse('भगवद्गीता — अध्याय ४, श्लोक ११',
    '_As you act, so the world responds_\n\n' +
    '### ये यथा मां प्रपद्यन्ते तांस्तथैव भजाम्यहम् ।\n' +
    '### मम वर्त्मानुवर्तन्ते मनुष्याः पार्थ सर्वशः ॥\n\n' +
    '---\n\n' +
    'लोग जिस तरह से मेरे पास आते हैं, मैं भी उन्हें उसी तरह से जवाब देता हूँ। सब मेरे ही रास्ते पर चलते हैं।\n\n' +
    '*In whatever way people approach Me, in that same way I respond to them. Nature answers force with force: push the ground back, and it pushes you forward; push the water back, and it carries you on.*'),
  txt('Newton’s third law explains the most ordinary thing you do — walking. With each step you push the ground **backward** with your foot. By the third law, the ground pushes your foot **forward** by an equal amount, and that forward push (a friction force) moves you ahead. Here friction is your friend: on slippery ice or a wet floor, the ground cannot grip back, your foot slides, and you fall. The same idea drives a cyclist and lets a climber grip a tree trunk.'),
  h2('How rockets and boats move'),
  txt('Rowing works the same way: the paddle pushes water **backward**, the water pushes the paddle and canoe **forward**. Let go of an inflated balloon and the air rushes out one way while the balloon shoots off the other. A **rocket** is exactly this — its engine throws hot gas downward, and the gas pushes the rocket upward; once that upward push beats the rocket’s weight, the net force is up and it lifts off. In space, firing the engine in the direction of motion pushes the craft backward to slow it down — precisely how ISRO’s Vikram lander braked for its soft Moon landing.'),
  img('A balloon zipping along a thread as air rushes out behind it, beside a rocket with downward exhaust',
    'Clean educational diagram on a dark charcoal background, two panels. Left: an inflated balloon threaded on a string, air rushing out of its open neck to the right while the balloon moves left, with two opposing arrows. Right: a rocket with exhaust gas arrow pointing down and a thrust arrow on the rocket pointing up. Minimal textbook style, warm amber arrows, high contrast on the dark ground. No text, no numbers, no labels.'),
  callout('india_science', "Chandrayaan-3: Newton's third law lands on the Moon",
    'In **August 2023**, India’s **Chandrayaan-3** mission soft-landed the **Vikram lander** near the Moon’s **south pole** — the first country ever to do so. With no air to slow it, the lander fired its engines *downward against its direction of fall*: the exhaust pushed down, and by the third law the gas pushed the lander up, braking it gently for a safe touchdown. ISRO’s achievement is Newton’s third law, written across 384,000 km of space.'),
  reason('logical', 3,
    'An astronaut is floating freely in space, far from the ship and from any planet, holding a heavy spanner. They need to move to the left. What should they do?',
    [
      'Throw the spanner hard to the right, so the reaction pushes them left',
      'Make swimming motions with their arms to paddle through space',
      'Wait for gravity to slowly pull them toward the ship',
      'Nothing will work — without a floor there is no way to move',
    ], 0,
    'There is nothing outside to push against, so the astronaut must push against something they carry. Throwing the spanner to the right means, by the third law, the spanner pushes them to the left. That is exactly how a rocket moves.'),
  txt('And this is not only about pushes you can see and touch. Newton’s third law holds for **every** kind of force. Two bar magnets push or pull on each other with equal and opposite forces. Two balloons rubbed and given the same charge repel each other equally. Whether the force is contact (a kick) or non-contact (magnetism, electricity, gravity), it always comes in an equal-and-opposite pair.'),
  callout('bridging_science', 'Why shoes have grooves and tyres have treads',
    'Since walking depends on the ground gripping your foot back, anything that improves that grip helps. **Grooves** on the soles of shoes and **treads** on tyres increase the friction between you (or the vehicle) and the road, so the ground can push back firmly. It is also why driving on a road covered in water or snow is dangerous — the grip, and so the forward push, drops sharply.'),
  quiz(
    q('When you walk forward, what is the force that actually pushes you ahead?',
      [
        'The forward push of your own leg muscles on your moving body',
        'The backward push that your foot makes against the ground',
        'Gravity, which somehow tilts forward as you lean ahead',
        'The ground pushing your foot forward, in reaction to your push',
      ], 3,
      'Your foot pushes the ground backward; by the third law the ground pushes your foot forward (as friction), and that forward push moves you. Your muscles power the action, but the forward force comes from the ground.', 1),
    q('A rocket engine throws hot gas downward. In which direction does the gas push the rocket, and why does it lift off?',
      [
        'Downward, the same way as the gas, which presses the rocket onto the pad',
        'Upward; it lifts off once that upward push is larger than the rocket’s weight',
        'Sideways, which is why rockets must be guided by rails',
        'It does not push the rocket at all; the rocket rises because gas is lighter than air',
      ], 1,
      'By the third law, the rocket pushes gas down and the gas pushes the rocket up. When that upward thrust exceeds the rocket’s weight, the net force is upward and the rocket lifts off.', 2),
    q('Why is it so hard to walk across a sheet of smooth, wet ice?',
      [
        'Gravity is much weaker on smooth ice, so your feet cannot grip',
        'Ice actively pushes your feet backward instead of forward',
        'Too little friction, so your foot slides and gets no forward push',
        'Your weight increases on ice, which pins your feet in place',
      ], 2,
      'Walking needs friction: you push the ground back and friction pushes you forward. Smooth wet ice offers almost no friction, so your foot just slides backward and there is no forward push to move you along.', 3),
  ),
]);

// ─────────────────────────── PAGE 10 — FORCES ON A SYSTEM OF OBJECTS ─────────
const system = seq([
  img('A toy engine pulling a line of three linked wagons across a smooth floor',
    'Ultra-wide cinematic banner (16:5 ratio), dark background. A small toy locomotive pulling three wagons joined by couplings in a straight line across a smooth surface, a single pull arrow at the front of the engine. The couplings between wagons are visible. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.'),
  cur('A toy engine pulls three wagons linked together by couplings. To work out how quickly the whole train speeds up, do you have to track the pull inside every single coupling — or is there a shortcut?',
    'The couplings pull the wagons along, but those pulls are inside the train. Do forces inside a group change how the whole group moves?',
    'There is a neat shortcut: treat the whole train as one object. The pulls inside it cancel in pairs, so only the outside pull matters. This page shows why — and how much simpler it makes things.'),
  verse('भगवद्गीता — अध्याय ६, श्लोक २९',
    '_Seeing the whole, not just the parts_\n\n' +
    '### सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि ।\n' +
    '### ईक्षते योगयुक्तात्मा सर्वत्र समदर्शनः ॥\n\n' +
    '---\n\n' +
    'जिसका मन जुड़ा हुआ है, वह हर जगह एक ही तत्व को देखता है — सबमें खुद को और खुद में सबको।\n\n' +
    '*The steady seer sees the whole in every part and every part in the whole. Science often works the same way: stop tracking each piece, look at the system as one, and a hard problem becomes simple.*'),
  txt('Until now you have used Newton’s laws on one object at a time. But objects are often joined together. Picture two boxes of masses $m_1$ and $m_2$ on a smooth, frictionless surface, tied by a light string. You pull the front box with a force **F**. The string drags the second box along — and by the third law, the second box pulls back on the first through the string. This pull through the string is called the **tension**, **T**.'),
  h2('The trick: treat them as one system'),
  txt('You *could* work out the forces on each box separately. But there is a simpler way: treat both boxes and the string as **one single system**. Forces *inside* the system — the tension, which is an action–reaction pair — cancel out, so you can ignore them. Only forces from **outside** the system matter, and here that is just your pull F. So the whole system, of total mass $m_1 + m_2$, accelerates exactly like one object.'),
  latex('a = \\frac{F}{m_1 + m_2}', 'Acceleration of a connected system',
    'Only the external force F matters; the internal tension cancels out. The system behaves like a single object of mass m₁ + m₂.'),
  img('Two boxes joined by a string on a smooth floor, an external pull F at the front and equal tension arrows inside',
    'Clean educational diagram on a dark charcoal background. Two boxes labelled by size sit on a smooth floor joined by a taut string; a bold amber arrow at the front shows the external pull F to the right; a pair of smaller opposite arrows on the string between the boxes shows the internal tension. Minimal textbook style, high contrast on the dark ground. No text, no numbers, no labels.'),
  we('Example — Acceleration of two connected boxes',
    'Two boxes of mass 2 kg and 3 kg are joined by a light string on a smooth floor. A force of 10 N pulls them along. Find the acceleration of the system.',
    'Treat the two boxes and the string as one system. The only external force along the floor is the 10 N pull; the tension is internal and cancels out.\n\nTotal mass: $ m_1 + m_2 = 2 + 3 = 5\\ \\text{kg} $.\n\n$ a = \\dfrac{F}{m_1 + m_2} = \\dfrac{10\\ \\text{N}}{5\\ \\text{kg}} = 2\\ \\text{m/s}^2 $\n\nThe whole system accelerates at **2 m/s²**, just like a single 5 kg object.'),
  reason('logical', 3,
    'Two boxes joined by a string are pulled across a smooth floor by an outside force. Your friend claims the string’s tension is what speeds the system up. Is the tension an internal or an external force, and does it change the system’s acceleration?',
    [
      'It is an internal force, so it cancels out and does not change the system’s acceleration',
      'It is an external force, and it is what sets the system’s acceleration',
      'It is an internal force that cancels gravity on the boxes',
      'There is no way to classify the tension without knowing the masses',
    ], 0,
    'The tension acts *between* parts of the system, so it is an internal force — an action–reaction pair that cancels within the system. Only the external pull sets the acceleration: a = F ÷ (m₁ + m₂). The tension matters only if you later look at one box on its own.'),
  callout('threads_of_curiosity', 'Even your own body is a "system"',
    'When you walk, your arms swing, your legs stride, your head bobs — a tangle of parts moving in complicated ways. Yet to describe how *you* move across a room, scientists can treat your whole body as a single object. Science often gets simpler the moment you stop staring at the parts and look at the whole.'),
  callout('ready_to_go_beyond', 'Checking it the long way',
    'If you instead analysed each box separately — writing F and the tension on the front box, and the tension alone on the back box — you would get exactly the same acceleration. You would also be able to find the tension itself. In real problems there are also vertical forces: the combined weight (m₁ + m₂)g pulls down and is balanced by the normal force from the ground.',
    'competitive'),
  quiz(
    q('In a system of connected objects, which forces can be ignored when finding the system’s acceleration?',
      [
        'The external forces acting on it from outside the system',
        'The internal forces between its parts, such as the tension',
        'All the forces, since a system can never really accelerate',
        'Only the force of gravity pulling down on the objects',
      ], 1,
      'Internal forces, like the tension between two joined boxes, are action–reaction pairs that cancel within the system. Only external forces change the system’s motion, so the internal ones can be ignored for the overall acceleration.', 1),
    q('A 4 kg box and a 6 kg box are tied together on a smooth floor and pulled with 20 N. What is the acceleration of the system?',
      [
        '5 m/s², found by dividing the force by the larger mass',
        '2 m/s², found by dividing the force by the total mass',
        '20 m/s², since the full force acts on the front box alone',
        '200 m/s², found by multiplying the force and the total mass',
      ], 1,
      'Treat the boxes as one system of mass 4 + 6 = 10 kg. Then a = F ÷ (m₁ + m₂) = 20 ÷ 10 = 2 m/s². You must use the total mass, not just one box, and you divide rather than multiply.', 2),
    q('Why does treating two connected boxes as a single system make the problem simpler?',
      [
        'Because the external pull disappears once the boxes are joined',
        'Because connected objects do not obey Newton’s laws individually',
        'Because the masses no longer need to be added together',
        'Because the tension is internal and cancels, leaving the external force',
      ], 3,
      'Inside the system the tension is an action–reaction pair that cancels, so you can forget it and use only the external force on the combined mass. The external force is still there, and you do add the masses.', 3),
  ),
]);

// ── page definitions in final reading order ──────────────────────────────────
const CONTENT_PAGES = [
  { slug: 'balanced-and-unbalanced-forces', page_number: 136, mode: 'update', title: 'Balanced and Unbalanced Forces', subtitle: 'When forces team up, fight, or cancel out', blocks: balanced, reading_time_min: 6 },
  { slug: 'friction', page_number: 137, mode: 'update', title: 'The Force of Friction', subtitle: 'The hidden force that is always pushing back', blocks: friction, reading_time_min: 6 },
  { slug: 'newtons-first-law', page_number: 138, mode: 'update', title: "Newton's First Law & Inertia", subtitle: 'Why things keep doing what they are doing', blocks: firstLaw, reading_time_min: 7 },
  { slug: 'newtons-second-law', page_number: 139, mode: 'update', title: "Newton's Second Law (F = ma)", subtitle: 'How force, mass, and acceleration are linked', blocks: secondLaw, reading_time_min: 7 },
  { slug: 'weight-and-gravity', page_number: 140, mode: 'create', title: 'Weight: Gravity as a Force', subtitle: 'Why everything falls at the same rate', blocks: weight, reading_time_min: 6 },
  { slug: 'second-law-in-everyday-life', page_number: 141, mode: 'create', title: "The Second Law in Everyday Life", subtitle: 'Catches, airbags, and the trick of time', blocks: secondLawLife, reading_time_min: 7 },
  // 142 = newtons-third-law (pilot, page_number fixed below)
  { slug: 'third-law-in-action', page_number: 143, mode: 'create', title: 'The Third Law in Action', subtitle: 'Walking, rockets, and a Moon landing', blocks: thirdLawAction, reading_time_min: 7 },
  { slug: 'forces-on-a-system', page_number: 144, mode: 'create', title: 'Forces on a System of Objects', subtitle: 'When it pays to look at the whole', blocks: system, reading_time_min: 6 },
];

const DELETE_SLUGS = ['si-unit-of-force', 'applying-newtons-laws', 'newtons-laws-as-a-model'];
const INTERACTIVE = new Set(['inline_quiz', 'reasoning_prompt', 'curiosity_prompt', 'worked_example', 'meet_a_scientist']);

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
    const bookId = String(book._id);

    // 1. Delete redundant stubs + unwire from chapter.
    for (const slug of DELETE_SLUGS) {
      const doc = await pages.findOne({ book_id: bookId, slug });
      if (!doc) { console.log(`(skip delete; not found) ${slug}`); continue; }
      console.log(`${DRY ? '[DRY] ' : ''}DELETE ${slug} (p${doc.page_number})`);
      if (!DRY) {
        await pages.deleteOne({ _id: doc._id });
        await books.updateOne({ _id: book._id }, { $pull: { 'chapters.$[c].page_ids': doc._id }, $set: { updated_at: new Date() } }, { arrayFilters: [{ 'c.number': CH }] });
      }
    }

    // 2. Move the third-law pilot page 141 -> 142 (frees 141; 142 just freed by delete).
    const third = await pages.findOne({ book_id: bookId, slug: 'newtons-third-law' });
    if (third && third.page_number !== 142) {
      console.log(`${DRY ? '[DRY] ' : ''}MOVE newtons-third-law p${third.page_number} -> 142`);
      if (!DRY) await pages.updateOne({ _id: third._id }, { $set: { page_number: 142, updated_at: new Date() } });
    }

    // 3. Build/update the 8 content pages.
    for (const p of CONTENT_PAGES) {
      const content_types = [...new Set(p.blocks.map((b) => b.type).filter((t) => INTERACTIVE.has(t)))];
      const existing = await pages.findOne({ book_id: bookId, slug: p.slug });
      const base = {
        title: p.title, subtitle: p.subtitle, blocks: p.blocks, published: true,
        content_types, reading_time_min: p.reading_time_min, page_number: p.page_number, updated_at: new Date(),
      };
      if (p.mode === 'update') {
        if (!existing) throw new Error(`Expected stub "${p.slug}" not found`);
        console.log(`${DRY ? '[DRY] ' : ''}UPDATE ${p.slug} (p${p.page_number}) ${p.blocks.length} blocks  ${JSON.stringify(content_types)}`);
        if (!DRY) await pages.updateOne({ _id: existing._id }, { $set: base });
      } else {
        if (existing) { // idempotent re-run: update in place
          console.log(`${DRY ? '[DRY] ' : ''}RE-CREATE(update) ${p.slug} (p${p.page_number}) ${p.blocks.length} blocks`);
          if (!DRY) await pages.updateOne({ _id: existing._id }, { $set: base });
          continue;
        }
        const doc = {
          _id: uid(), book_id: bookId, chapter_number: CH, slug: p.slug,
          hinglish_blocks: [], tags: [], created_at: new Date(), ...base,
        };
        console.log(`${DRY ? '[DRY] ' : ''}CREATE ${p.slug} (p${p.page_number}) ${p.blocks.length} blocks  ${JSON.stringify(content_types)}`);
        if (!DRY) {
          await pages.insertOne(doc);
          await books.updateOne({ _id: book._id }, { $addToSet: { 'chapters.$[c].page_ids': doc._id }, $set: { updated_at: new Date() } }, { arrayFilters: [{ 'c.number': CH }] });
        }
      }
    }
    console.log(DRY ? '\n[DRY] nothing written.' : '\n✅ Remaining content pages built.');
  } finally {
    await client.close();
  }
})().catch((e) => { console.error('❌', e); process.exit(1); });
