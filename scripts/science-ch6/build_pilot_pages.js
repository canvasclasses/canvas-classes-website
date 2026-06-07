'use strict';
/**
 * Class 9 Science · Chapter 6 "How Forces Affect Motion" — PILOT PAGES.
 *
 * Builds two fully-finished pages to set the quality bar before the rest of the
 * chapter is authored:
 *   1. "The Concept of Force"   (slug what-is-force)      — NCERT §6.1 + 6.1.1
 *   2. "Newton's Third Law"     (slug newtons-third-law)  — NCERT §6.6 (law + pairs)
 *
 * Follows BOOK_PAGE_WORKFLOW.md §4B (Class 9 Exploration template), §13 (Vedic
 * Fusion — verse as block 2), and §3.6.1 (every quiz option a real trap).
 * Images are authored as src:"" + generation_prompt placeholders (generated in a
 * later pass). English-only; Hinglish deferred.
 *
 * Updates the two existing stub pages in place (same _id, same page_number; they
 * are already wired into book.chapters[6].page_ids). Idempotent by slug.
 *
 *   node scripts/science-ch6/build_pilot_pages.js [--dry]
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 6;
const DRY = process.argv.includes('--dry');
const uid = () => crypto.randomUUID();

// Helper: assign sequential order + a uuid to each block.
function seq(blocks) {
  return blocks.map((b, i) => ({ id: uid(), order: i, ...b }));
}

// ───────────────────────── PAGE 1 — THE CONCEPT OF FORCE ─────────────────────
const page1Blocks = seq([
  {
    type: 'image',
    src: '',
    alt: 'A football leaving a foot, a hand squeezing a lemon, and a hand stretching a spring balance — three everyday forces at work',
    caption: '',
    width: 'full',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5 ratio), dark background. One blended composition showing the same invisible thing — force — at work in three everyday Indian moments: a bare foot striking a football as the ball leaves the ground, a hand squeezing a lemon so its shape deforms with juice droplets, and a hand pulling the hook of a spring balance whose internal spring is visibly stretched. Soft glowing motion arrows trace each push and pull. Deep indigo and charcoal background, warm amber rim-light on the objects, painterly illustration with crisp edges. No text, no words, no labels.',
  },
  {
    type: 'curiosity_prompt',
    prompt:
      "Think of three things you did this morning that needed a push or a pull — opening a door, lifting a bag, pressing a switch. For each one, ask yourself: what actually *changed* because of what you did? Not the word for it. The change itself.",
    hint: "Don't reach for a definition. Picture the object before and after. What was different?",
    reveal:
      "Something changed every single time — an object started moving, sped up, stopped, turned, or changed shape. That change is the fingerprint of a force. By the end of this page you'll be able to say exactly what a force is and how we measure one.",
  },
  {
    type: 'callout',
    variant: 'fun_fact',
    title: 'भगवद्गीता — अध्याय ३, श्लोक ५',
    markdown:
      '_Nothing stays still — everything is driven to act_\n\n' +
      '### न हि कश्चित्क्षणमपि जातु तिष्ठत्यकर्मकृत् ।\n' +
      '### कार्यते ह्यवशः कर्म सर्वः प्रकृतिजैर्गुणैः ॥\n\n' +
      '---\n\n' +
      'कोई भी इंसान एक पल के लिए भी बिना कुछ किए नहीं रह सकता। हर कोई प्रकृति की शक्तियों से अपने-आप किसी न किसी काम में लग ही जाता है।\n\n' +
      '*No one can stay completely still even for a moment; everyone is driven to act by the forces of nature. The physical world is the same — nothing changes its motion on its own. A force is always the cause behind the change.*',
  },
  {
    type: 'text',
    markdown:
      'A **force** is simply a push or a pull. You use them all day without naming them — you *pull* a door open, *press* a switch, *kick* a ball, *squeeze* a lemon.\n\n' +
      "Notice what a force actually *does*. It can start a still object moving, like a kicked ball leaving the ground. It can speed up or slow down something already moving. It can change the *direction* of motion, the way a bat sends a ball flying back where it came from. It can even change an object's *shape*, like your fingers flattening a lemon. Every one of those is a force at work.",
  },
  { type: 'heading', level: 2, text: 'A force has a direction, not just a strength' },
  {
    type: 'text',
    markdown:
      "Here is something easy to miss: a force is never just *how hard*. It always has a **direction** too. Friction drags backward, opposite to the way something slides. Gravity pulls straight down. A magnet's pull points toward the magnet.\n\n" +
      'So to describe a force you need two things together: its **magnitude** (how strong) and its **direction** (which way) — exactly like the velocity and acceleration you met in Chapter 4. Change either one and the effect of the force changes.',
  },
  {
    type: 'image',
    src: '',
    alt: 'A crate with a long amber arrow pushing right and a shorter blue friction arrow pointing left',
    caption: '',
    width: 'full',
    generation_prompt:
      'Clean educational diagram on a dark charcoal background. A wooden crate resting on a floor, seen from the side. A bold amber arrow points to the right showing an applied push; a shorter blue arrow points to the left showing friction in the opposite direction. The two arrows clearly differ in length (different magnitudes) and point in opposite directions. Minimal, textbook-quality vector illustration, soft glow, high contrast against the dark background. No text, no numbers, no labels.',
  },
  {
    type: 'reasoning_prompt',
    reasoning_type: 'logical',
    difficulty_level: 2,
    prompt:
      "Two friends try to move a stalled car. Pushing together from behind, they get it creeping forward. Then one friend runs to the *front* and pushes back toward the other — and now the car barely moves at all, even though both are pushing just as hard as before. What does this tell you about a force?",
    options: [
      'A force has only a strength; the direction it points changes nothing about the result',
      'Only the amount of effort matters, so pushing harder is the single thing that moves the car',
      'The car stalls because two people pushing the same object always cancel each other out',
      'A force has both a strength and a direction; opposite directions cancel, the same direction adds up',
    ],
    correct_index: 3,
    reveal:
      "Both friends push just as hard, so the *strength* did not change — only the *direction* did. Pointing the same way, their pushes add; pointing opposite ways, they almost cancel and the car stalls. A force is always magnitude **and** direction together.",
  },
  { type: 'heading', level: 2, text: 'Measuring a force: the spring balance and the newton' },
  {
    type: 'text',
    markdown:
      "So how do you measure how strong a force is? With a **spring balance**. Pull on its hook and the spring inside stretches — the harder you pull, the more it stretches, and the scale shows the size of your pull. Hang an object from it instead and it shows that object's **weight**: the gravitational force with which the Earth pulls the object down.\n\n" +
      'Force is measured in a unit called the **newton**, with the symbol **N**. The name is written in small letters because it honours a person, Isaac Newton, while the symbol is the capital N. To get a feel for it: holding a 100 g packet of biscuits in your palm means your hand is pushing up with about 1 N.',
  },
  {
    type: 'image',
    src: '',
    alt: 'A hand holding a vertical spring balance with a small bag of vegetables on its hook, the internal spring stretched',
    caption: '',
    width: 'full',
    generation_prompt:
      'Clean educational illustration on a dark charcoal background. A vertical spring balance held by a hand at the top, with a small cloth bag of vegetables hanging from the hook at the bottom. The internal coil spring is visible and stretched, and the dial pointer rests partway down. Warm amber highlights, painterly but precise, high contrast on the dark ground. No text, no numbers on the dial.',
  },
  {
    type: 'callout',
    variant: 'threads_of_curiosity',
    title: 'How small can a force get?',
    markdown:
      'The gentlest force you can actually *feel* — a light touch on your skin — is around a **millinewton** ($10^{-3}$ N), a thousandth of a newton. Yet in carefully designed experiments, scientists today (as of 2026) can measure forces as small as a **yoctonewton**: $10^{-24}$ N. That is far, far smaller than anything your body could ever sense.',
  },
  {
    type: 'inline_quiz',
    pass_threshold: 0.67,
    questions: [
      {
        id: uid(),
        question: 'What is the SI unit of force, and how is it written?',
        options: [
          'The kilogram, because a force is really just how heavy a push feels',
          'The newton — full name in small letters, symbol the capital letter N',
          'The Newton, capitalised throughout, since it is named after a person',
          'The joule, the standard unit used for any mechanical quantity',
        ],
        correct_index: 1,
        explanation:
          'Force is measured in the newton (N). The full name takes a small "n" because it honours a person; only the symbol N is capitalised. The kilogram measures mass, not force, and the joule measures energy.',
        difficulty_level: 1,
      },
      {
        id: uid(),
        question: 'Standing still, you hang a bag of vegetables from a spring balance and it reads 5 N. What is that reading telling you?',
        options: [
          'The Earth’s gravitational pull on the bag — that is, its weight',
          'The mass of the bag of vegetables, expressed here in newtons',
          'The force the spring is storing up to fling the bag upward',
          'The speed at which the bag would fall if you let it go',
        ],
        correct_index: 0,
        explanation:
          "A spring balance reads the force pulling on its hook. Here that force is the bag's weight — the Earth's gravitational pull on it. Mass is measured in kilograms, not newtons, and the reading has nothing to do with speed.",
        difficulty_level: 2,
      },
      {
        id: uid(),
        question: 'You give a trolley a push of the same strength on two occasions. The first push speeds it up; the second, equally hard push slows it down. What must have been different the second time?',
        options: [
          'The strength of your push secretly changed between the two tries',
          'The trolley quietly became heavier in between the two pushes',
          'The direction of your push was opposite to the trolley’s motion the second time',
          'A push can only ever speed things up, so the second push did nothing at all',
        ],
        correct_index: 2,
        explanation:
          'The strength was the same both times, so the only thing that could differ is direction. A push along the motion speeds an object up; a push against the motion slows it down. This is exactly why a force needs both a magnitude and a direction.',
        difficulty_level: 3,
      },
    ],
  },
]);

// ───────────────────────── PAGE 8 — NEWTON'S THIRD LAW ───────────────────────
const page8Blocks = seq([
  {
    type: 'image',
    src: '',
    alt: 'A swimmer pushing water back while gliding forward, mirrored by a person pushing both palms against a wall as it pushes back',
    caption: '',
    width: 'full',
    generation_prompt:
      "Ultra-wide cinematic banner (16:5 ratio), dark background. A dramatic mirror-symmetric split composition about equal-and-opposite forces. On one side, a swimmer's hands push a churn of water backward while she glides forward. On the other, a person presses both palms flat against a stone wall and leans in, with soft glowing arrows showing the wall pushing back on the hands. Deep indigo and charcoal tones, warm amber rim-light, painterly illustration with crisp edges. No text, no words, no labels.",
  },
  {
    type: 'curiosity_prompt',
    prompt:
      "Press both your palms hard against a wall and lean in. The wall doesn't move — but pay attention to your hands. Do you feel anything pushing *back* on them? If the wall is just sitting there, where could a push on you possibly come from?",
    hint: 'You are clearly pushing the wall. The question is whether the wall is doing anything in return.',
    reveal:
      'You can feel the wall pressing back into your palms. That return push is real, and it is exactly as strong as your push. This page is about that hidden second half of every force — Newton’s third law.',
  },
  {
    type: 'callout',
    variant: 'fun_fact',
    title: 'भगवद्गीता — अध्याय ३, श्लोक ११',
    markdown:
      '_Nourishing one another, you rise together_\n\n' +
      '### देवान्भावयतानेन ते देवा भावयन्तु वः ।\n' +
      '### परस्परं भावयन्तः श्रेयः परमवाप्स्यथ ॥\n\n' +
      '---\n\n' +
      'तुम अपने कर्मों से दूसरों का भला करो, और वे तुम्हारा भला करेंगे। एक-दूसरे का साथ देते हुए, मिलकर तुम सब आगे बढ़ोगे।\n\n' +
      '*Support others through your actions, and they support you; by nourishing **one another** — parasparam — you rise together. Nature works the same way: every action is met by an answering action. Give a push, and you receive one back.*',
  },
  {
    type: 'text',
    markdown:
      "A force never acts alone. For a push or a pull to happen at all, **two objects must meet**. When you kick a football, your foot pushes the ball — but haven't you also felt the ball thud back against your foot in the same instant? Stub your toe on a doorframe and the answer is painfully clear.\n\n" +
      'Newton noticed that this is always true. A force is one half of a conversation between two objects, and the other half is never silent.',
  },
  { type: 'heading', level: 2, text: 'Forces always come in pairs' },
  {
    type: 'text',
    markdown:
      'Try it for yourself. Sit on a chair with wheels, lift your feet off the floor, and push a heavy table away from you. The table barely budges — but you and the chair roll backward. You pushed the table forward; the table pushed *you* backward.\n\n' +
      'You can even measure both halves at once. Hook two spring balances together and pull: both dials always read the **same** number, however hard you pull. All of this is summed up in **Newton’s third law of motion**: whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.',
  },
  {
    type: 'image',
    src: '',
    alt: 'Two identical spring balances connected hook-to-hook, pulled in opposite directions, both dials reading the same',
    caption: '',
    width: 'full',
    generation_prompt:
      'Clean educational diagram on a dark charcoal background. Two identical spring balances connected hook-to-hook in a horizontal line on a table, pulled gently in opposite directions by a hand at each far end. Both dials show the pointer at the same position to suggest equal readings. Minimal textbook-quality illustration, warm amber highlights, high contrast on the dark ground. No text, no numbers.',
  },
  {
    type: 'callout',
    variant: 'remember',
    title: "Newton's Third Law of Motion",
    markdown:
      'Whenever one object exerts a force on a second object, the second object **simultaneously** exerts an **equal and opposite** force on the first. The two forces are always equal in size and opposite in direction — and they always act on **two different objects**.',
  },
  { type: 'heading', level: 2, text: "Why don't the two forces cancel?" },
  {
    type: 'text',
    markdown:
      'Here is the trap almost everyone falls into. If the two forces are equal and opposite, surely they should cancel and leave nothing moving?\n\n' +
      'They do not — and the reason is everything. Forces cancel only when they act on the **same** object. An action–reaction pair acts on **two different objects**: your foot pushes the ball, the ball pushes your foot. One force acts on the ball, the other on your foot. They can never cancel, because they are not even pushing on the same thing.',
  },
  {
    type: 'reasoning_prompt',
    reasoning_type: 'logical',
    difficulty_level: 3,
    prompt:
      "When a mango falls, the Earth pulls it down. By Newton's third law, the mango pulls the Earth *upward* with an equal force at the very same moment. Yet the mango clearly rushes toward the Earth, while the Earth shows no sign of moving toward the mango. How can two equal forces produce such wildly unequal results?",
    options: [
      'The forces are equal, but acceleration is force ÷ mass, so the Earth’s huge mass barely accelerates it',
      'The Earth’s pull on the mango is in truth far stronger than the mango’s pull on the Earth',
      'Newton’s third law works only for direct pushes and pulls, and never applies to gravity at all',
      'The mango moves only because it is light, since gravity acts far more strongly on lighter objects',
    ],
    correct_index: 0,
    reveal:
      'The forces really are equal (third law). But by the second law, $a = F/m$. The same force divided by the mango’s small mass gives a big acceleration; divided by the Earth’s gigantic mass it gives an acceleration far too small to ever notice. Equal forces, unequal masses, unequal accelerations.',
  },
  {
    type: 'worked_example',
    label: 'Example 6.8 — Why a gun recoils',
    variant: 'solved_example',
    problem:
      'A 0.1 kg bullet is fired from a 5 kg gun with a force of 2 N. Find the size of the initial acceleration of (i) the bullet and (ii) the gun.',
    solution:
      'By **Newton’s third law**, the gun pushes the bullet forward with 2 N, and the bullet pushes the gun backward — the **recoil** — with an equal 2 N.\n\n' +
      'Now use **Newton’s second law**, $ a = \\frac{F}{m} $, for each object:\n\n' +
      '**Bullet:** $ a = \\frac{2\\ \\text{N}}{0.1\\ \\text{kg}} = 20\\ \\text{m s}^{-2} $\n\n' +
      '**Gun:** $ a = \\frac{2\\ \\text{N}}{5\\ \\text{kg}} = 0.4\\ \\text{m s}^{-2} $\n\n' +
      '**The forces are equal, but the accelerations are not.** The light bullet shoots off fast; the heavy gun kicks back slowly. Same force, different masses — so different accelerations.',
    reveal_mode: 'tap_to_reveal',
  },
  {
    type: 'callout',
    variant: 'threads_of_curiosity',
    title: 'Why a fire hose fights back',
    markdown:
      'Ever noticed firefighters bracing hard — sometimes two of them — to hold a single hose? The hose throws a powerful jet of water *forward*, so by the third law the water shoves the hose *backward* with an equal force, straight into their arms. The same kick is why a gun jerks back into the shoulder when it fires.',
  },
  {
    type: 'inline_quiz',
    pass_threshold: 0.67,
    questions: [
      {
        id: uid(),
        question: "Newton's third law says that when one object exerts a force on a second object, the second object exerts a force back that is…",
        options: [
          'equal in size and in the same direction as the first force',
          'smaller than the first force, because it is only a reaction',
          'equal in size but opposite in direction to the first force',
          'present only if the second object is also moving at the time',
        ],
        correct_index: 2,
        explanation:
          'The reaction force is always equal in magnitude and opposite in direction — never weaker, and it appears at the same instant whether or not either object is moving. Calling it a "reaction" does not make it smaller.',
        difficulty_level: 1,
      },
      {
        id: uid(),
        question: 'A swimmer pushes the water backwards with her hands and moves forward. Which force is the one that actually pushes the swimmer forward?',
        options: [
          'The force her hands apply on the water as she pushes it back',
          'The swimmer’s own muscles pushing her body directly forward',
          'Gravity, which the water redirects from downward to forward',
          'The water’s reaction force on her hands, which points forward',
        ],
        correct_index: 3,
        explanation:
          'The swimmer pushes the water backward (the action); by the third law the water pushes her hands forward (the reaction). That reaction force acts on the swimmer, so it is what drives her forward. Her muscles power the push, but the forward force comes from the water.',
        difficulty_level: 2,
      },
      {
        id: uid(),
        question: 'A heavily loaded truck and a small car collide head-on. During the collision, how do the forces they exert on each other compare?',
        options: [
          'The truck exerts the larger force, because it is heavier and faster',
          'The car and the truck exert equal-magnitude forces on each other',
          'The car exerts the larger force, because it ends up more badly damaged',
          'Neither exerts any force until they have been in contact for a full second',
        ],
        correct_index: 1,
        explanation:
          'By the third law the two forces are exactly equal in size and opposite in direction. The car is wrecked more not because it feels a bigger force, but because its small mass gives it a much larger acceleration ($a = F/m$) from that same force.',
        difficulty_level: 3,
      },
    ],
  },
]);

const PAGES = [
  { slug: 'what-is-force', title: 'The Concept of Force', subtitle: 'What a push or a pull really does — and how we measure it', blocks: page1Blocks, reading_time_min: 5 },
  { slug: 'newtons-third-law', title: "Newton's Third Law", subtitle: 'Every force comes with an equal and opposite partner', blocks: page8Blocks, reading_time_min: 6 },
];

const INTERACTIVE = new Set(['inline_quiz', 'reasoning_prompt', 'curiosity_prompt', 'worked_example']);

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

    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: bookId, slug: p.slug });
      if (!existing) throw new Error(`Expected existing stub page "${p.slug}" not found`);
      if (existing.chapter_number !== CH) throw new Error(`"${p.slug}" is in ch${existing.chapter_number}, expected ${CH}`);

      const content_types = [...new Set(p.blocks.map((b) => b.type).filter((t) => INTERACTIVE.has(t)))];
      const set = {
        title: p.title,
        subtitle: p.subtitle,
        blocks: p.blocks,
        published: true,
        content_types,
        reading_time_min: p.reading_time_min,
        updated_at: new Date(),
      };
      console.log(`${DRY ? '[DRY] ' : ''}${p.slug}  (p${existing.page_number})  ${p.blocks.length} blocks  content_types=${JSON.stringify(content_types)}`);
      if (!DRY) await pages.updateOne({ _id: existing._id }, { $set: set });
    }
    console.log(DRY ? '\n[DRY] nothing written.' : '\n✅ Pilot pages built and published.');
  } finally {
    await client.close();
  }
})().catch((e) => { console.error('❌', e); process.exit(1); });
