'use strict';
/**
 * Creates Chapter 2 "Stress & Emotions" (9 pages) inside the existing
 * "Life Skills — Class 9" Live Book, alongside Chapter 1 "Focus & Attention".
 *
 * Canonical spec: _agents/workflows/LIFE_SKILLS_WORKFLOW.md (§4 page anatomy,
 * §7 evidence bar, §9 helpline requirement). Structure recommended to the
 * founder 2026-07-08 (chat), locked by "yes start authoring this chapter".
 *
 * Safety notes (CLAUDE.md §0 / §0.6):
 *   - INSERT-ONLY and idempotent: creates 1 chapter shell + 9 page docs if
 *     absent, skips anything that already exists. Never updates or deletes
 *     existing content (Chapter 1 is untouched).
 *   - All pages land published:false — nothing is student-visible until the
 *     founder reviews and publishes.
 *   - Rollback: delete the 9 page docs by the IDs this script prints, and
 *     $pull the chapter-2 entry from the book's `chapters` array.
 *
 * Verse sources (all verified against multiple independent translations
 * before writing, per the anti-hallucination / Reference-First rule):
 *   Gita 2.14, 2.60, 2.48, 6.16, 2.56, 4.34; Mundaka Upanishad 3.1.1.
 *   Gita 6.35 and Yoga-sutra 1.34 are DELIBERATE callbacks to Focus module
 *   pages 10 and 6 respectively (same verses, continuing the same practice).
 *
 * Run: node scripts/setup_life_skills_class9_stress.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'life-skills-class-9';
const CHAPTER = { number: 2, title: 'Stress & Emotions', slug: 'stress-and-emotions' };

// Standard Live Books image style (memory: project_livebook_image_style):
const STYLE =
  'Hand-drawn coloured illustration on a deep charcoal dark background, muted earthy palette ' +
  '(sage green, clay red, ochre, dusty blue), soft textured linework, no glow, no neon, ' +
  'no orange accents, no 3D render, landscape composition, generous negative space.';

let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: `${prompt} ${STYLE}` });
const sideImg = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: 0, src: '', alt, caption: '', width: 'full', aspect_ratio: '4:3', generation_prompt: `${prompt} ${STYLE}` });
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const section5050 = (textBlock, imageBlock) => ({ id: uuidv4(), type: 'section', order: _o++, layout: '50-50', columns: [[{ ...textBlock, order: 0 }], [imageBlock]] });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const curiosity = (prompt, hint, reveal) => ({ id: uuidv4(), type: 'curiosity_prompt', order: _o++, prompt, ...(hint ? { hint } : {}), ...(reveal ? { reveal } : {}) });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why, difficulty_level: q.lvl || 1 })) });
const gp = (props) => ({ id: uuidv4(), type: 'guided_practice', order: _o++, ...props, steps: props.steps.map(s => ({ id: uuidv4(), ...s })) });
const journal = (prompt, min_words) => ({ id: uuidv4(), type: 'reflection_journal', order: _o++, prompt, ...(min_words ? { min_words } : {}) });
const tracker = (props) => ({ id: uuidv4(), type: 'habit_tracker', order: _o++, ...props });
const xray = (props) => ({ id: uuidv4(), type: 'attention_xray', order: _o++, ...props, cards: props.cards.map(c => ({ id: uuidv4(), ...c })) });
const experiment = (props) => ({ id: uuidv4(), type: 'self_experiment', order: _o++, ...props, options: props.options.map(o => ({ id: uuidv4(), ...o })) });
const verse = (source, sanskrit, hindi, english) => callout('fun_fact', source, `*${sanskrit}*\n\n${hindi}\n\n${english}`);

const PAGES = [];

// ─── Page 1 — What Is Stress, Really? (opener + baseline + helpline) ─────────
reset();
PAGES.push({
  slug: 'what-is-stress-really',
  title: 'What Is Stress, Really?',
  subtitle: 'Your body\'s alarm system, explained — and where to go if it never turns off',
  page_number: 1,
  blocks: [
    hero('A calm lighthouse keeper watching a passing storm from a steady tower',
      'A calm lighthouse keeper stands at the top of a sturdy stone tower, watching a dark storm cloud pass over the sea below; the tower is steady and dry while the waves below churn.'),
    verse('From the Bhagavad Gita (2.14)',
      'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
      'सर्दी-गर्मी, सुख-दुःख — ये सब आते हैं और चले जाते हैं, कभी टिकते नहीं। इन्हें सहना सीखो, अर्जुन।',
      'Heat and cold, pleasure and pain — they come and go, they never last. Learn to endure them, Arjuna.'),
    curiosity('Your heart races before a test. Your stomach knots before speaking in class. Is your body broken — or doing exactly its job?',
      'Think about what your body does the instant real danger appears.',
      'Neither broken. Your body cannot tell "hard test" from "actual tiger" — it runs the same 200,000-year-old alarm for both.'),
    heading('Stress is not the enemy'),
    text(`Nine pages of the last chapter trained your attention. This chapter trains something that sits right underneath it: **how you handle pressure.** And the very first thing to get right is this — stress is not a malfunction. It is your body's oldest safety system, doing exactly what it evolved to do: notice a threat and prepare you to deal with it.\n\nThe problem was never that you *have* this system. The problem is that the system cannot tell the difference between a tiger and a chemistry test. Both get the same heart-racing, stomach-knotting, mind-racing response. This chapter is about learning to work *with* that system instead of being ambushed by it.`),
    heading('One honest note before we start'),
    text(`Everything in this chapter is a tool for everyday pressure — exams, arguments, a bad day. If you ever feel low, anxious or overwhelmed **for weeks, not just a bad afternoon**, that is not something an app should handle alone — that is something to tell a parent, teacher or counsellor. If you don't have someone nearby right now, **iCall (9152987821)** and **Tele-MANAS (14416)** are free, confidential helplines, any time. Save one of those two numbers now, even if you never need them — that's what a smoke detector is for.`),
    text(`Now — before any tool, a baseline. A doctor checks your pulse before *and* after treatment. Let's check yours.`),
    gp({
      practice_kind: 'observation',
      title: 'Your Stress Baseline',
      intro: 'No right or wrong answer — just an honest snapshot of right now, before you learn anything.',
      steps: [
        { instruction: 'Sit still for a moment. Notice your breathing — is it fast or slow, high in the chest or low in the belly?' },
        { instruction: 'Notice your body — shoulders, jaw, hands. Any tightness you hadn\'t clocked until just now?' },
        { instruction: 'On a scale of 1 (totally calm) to 10 (wound up), rate how you feel right now. Say the number out loud.', duration_sec: 60 },
      ],
      completion_note: 'That number is your baseline — not good or bad, just today\'s starting line. You\'ll take this exact check again on the last page.',
    }),
    journal('Write your baseline number (1–10). What is one thing that has felt stressful this week — school, friends, home, or something you can\'t quite name?', 20),
    text(`**Tonight:** no exercise, just noticing. At some point, catch your body reacting to something small — a notification, a comment, a deadline — and silently name it: *"there's the alarm going off."* That noticing is the whole first rep.`),
  ],
});

// ─── Page 2 — Your Body's Alarm System (Stress Signal Autopsy) ──────────────
reset();
PAGES.push({
  slug: 'your-bodys-alarm-system',
  title: 'Your Body\'s Alarm System',
  subtitle: 'Racing heart, sweaty palms, a knot in your stomach — none of it is random',
  page_number: 2,
  blocks: [
    hero('A control room inside a chest with small figures pulling levers labeled heart and breath',
      'A whimsical cutaway of a chest as a small control room: two calm little figures in overalls pull big levers labelled with a heart icon and a lungs icon, warning lights softly glowing above them, steam gently venting from a stomach-shaped pipe.'),
    verse('From the Bhagavad Gita (2.60)',
      'यततो ह्यपि कौन्तेय पुरुषस्य विपश्चितः। इन्द्रियाणि प्रमाथीनि हरन्ति प्रसभं मनः॥',
      'चाहे कितनी भी कोशिश करो, अर्जुन — इन्द्रियाँ इतनी प्रबल हैं कि समझदार व्यक्ति के मन को भी ज़बरदस्ती खींच लेती हैं।',
      'Even a person who tries hard and knows better, Arjuna — the senses are so forceful that they can drag the mind away by sheer force.'),
    curiosity('Sweaty palms before you go on stage. A racing heart before a test result. Where do these actually come from?'),
    section5050(
      text(`Two thousand years before neuroscience, this verse names something real: your senses and body can hijack your mind **by force**, even when you know better. Today we can say exactly *how*. The moment your brain reads a situation as a threat — a test, a stage, an argument — it fires a chemical alarm: **adrenaline** floods in first (fast, seconds), then **cortisol** follows (slower, minutes to hours). Together they prepare your body for one thing: deal with danger, right now.`),
      sideImg('A brain sending a lightning-bolt signal down to the heart and stomach',
        'A simple hand-drawn brain silhouette sends a small lightning-bolt signal down a thin line to a heart and a stomach, both glowing faintly, illustrating an alarm signal travelling through the body.')
    ),
    section5050(
      text(`That single chemical alarm explains every symptom on the autopsy below. Heart racing? Pumping more blood to your muscles. Fast, shallow breathing? Loading extra oxygen. Knotted stomach? Digestion is paused — not needed for a fight. Racing thoughts? Your brain narrowing focus onto the "threat." **None of it is random, and none of it means something is wrong with you.** It's the exact same system that once helped a person outrun a real predator — now firing for an exam it can't tell apart from one.`),
      sideImg('Old cave hunters running from a tiger beside a student sweating before an exam paper',
        'A split illustration: on the left, ancient hunters in simple clothing sprinting from a shadowy tiger through tall grass; on the right, a modern student sitting at a desk sweating before an exam paper — both drawn with the identical alarm lines radiating from their chests.')
    ),
    xray({
      title: 'The Stress Signal Autopsy',
      intro: 'You\'ve felt every one of these. Tap each to see what it actually is — and why your body bothers.',
      cards: [
        { front: '💓', label: 'Racing heart', reveal: 'Adrenaline tells your heart to pump faster, sending more blood to your muscles — in case you need to run or fight. You don\'t need to run from a test, but the wiring doesn\'t know that yet.' },
        { front: '🫁', label: 'Fast, shallow breathing', reveal: 'Quick breaths load your blood with extra oxygen for a burst of effort. It also means less air reaches the calmer, lower belly — which is exactly what page 5\'s tool undoes.' },
        { front: '🌀', label: 'Knotted stomach', reveal: 'Digestion takes energy your body wants to save for "danger mode," so it slows down or pauses. That queasy knot is blood being redirected — not something you ate.' },
        { front: '🧠', label: 'Racing, jumping thoughts', reveal: 'Your brain narrows its spotlight onto the possible threat, scanning for what could go wrong. Useful for spotting a real predator; less useful when the "predator" is a maths paper.' },
        { front: '🖐️', label: 'Sweaty palms', reveal: 'A grippier hand was once useful for holding a weapon or climbing to escape. Today it just makes your pen slide — same old wiring, new situation.' },
        { front: '😤', label: 'Snapping at someone small', reveal: 'The alarm doesn\'t just prep your body — it shortens your fuse, because a "threat" state primes you for confrontation. The sibling didn\'t cause it; the exam tomorrow did.' },
      ],
      closing:
        'Here is the one sentence worth remembering from this whole page: **your body is not malfunctioning — it is running a very old, very literal program for a very new kind of danger.** Once you can name what\'s happening, it stops feeling like chaos. It becomes a system you can learn to work with, starting on page 3.',
    }),
    quiz([
      { q: 'A racing heart before a test happens because…', opts: ['Your heart is weak', 'Adrenaline is pumping more blood to your muscles, in case you need to act fast', 'You drank too much water', 'It means you will fail'], a: 1, why: 'The alarm prepares your body for action — more blood to the muscles — whether or not any physical action is actually needed.', lvl: 1 },
      { q: 'Per Gita 2.60, what can happen to the mind even of someone who "knows better"?', opts: ['Nothing — knowledge always wins', 'The senses can still drag it away by force', 'It becomes permanently damaged', 'It stops working entirely'], a: 1, why: 'The verse is honest: even the wise are not immune to the senses\' pull. That is not weakness — it is the same alarm this whole page describes.', lvl: 2 },
      { q: 'Your stomach knots before a big moment mainly because…', opts: ['You are getting sick', 'Digestion is paused to save energy for "danger mode"', 'You ate something wrong', 'It is unrelated to stress'], a: 1, why: 'Blood and energy are redirected away from digestion during the stress response — the knot is that redirection, not illness.', lvl: 2 },
    ]),
    text(`**Today:** the next time your body fires one of these six signals, don't fight it or judge it. Just silently name it — *"ah, adrenaline"* or *"there's the knot"* — and notice how naming it, even a little, makes it feel less like an emergency.`),
  ],
});

// ─── Page 3 — Stress Can Help You (Sometimes) ────────────────────────────────
reset();
PAGES.push({
  slug: 'stress-can-help-you-sometimes',
  title: 'Stress Can Help You (Sometimes)',
  subtitle: 'The goal was never zero stress. It was the right amount, at the right time',
  page_number: 3,
  blocks: [
    hero('A tightrope walker perfectly balanced, calm on one side and chaos on the other',
      'A confident tightrope walker balances calmly on a rope strung between two towers; one tower is grey and sleepy, the other crackles with jagged chaotic energy — the walker rests exactly at the steady midpoint between them.'),
    verse('From the Bhagavad Gita (2.48)',
      'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
      'फल की चिंता छोड़कर, संतुलन में रहकर काम करो, अर्जुन। सफलता-असफलता दोनों में समान भाव — इसी को योग कहते हैं।',
      'Perform your task established in balance, Arjuna, releasing your grip on the outcome. Remaining equal in success and failure — that itself is called yoga.'),
    curiosity('A performer with zero nerves before going on stage, and a performer paralysed by nerves — which one gives the better show?',
      'Neither, usually.',
      'The best performances tend to come from the middle: alert, a little charged, not frozen and not flat. That middle zone has a name.'),
    section5050(
      text(`Picture performance on a curve, not a line. **Too little stress** (totally relaxed, half-asleep) — you under-prepare, react slowly, and don't bring your best. **Too much stress** (frozen, mind blank, hands shaking) — the alarm is so loud it drowns out clear thinking. But there is a **middle zone**: alert, a bit of edge, focused — and that is where people actually perform best. This is not a guess; it is one of the oldest, most repeated findings in psychology, and it applies to a sprint, a stage performance, and an exam equally.`),
      sideImg('A performance curve rising then falling, with a sweet spot marked at the peak',
        'A single hand-drawn curve on graph paper rising from low-left to a clear rounded peak and then falling to the right; the peak is circled and marked with a small star, with a sleepy face icon at the low end and an overwhelmed face icon at the high end.')
    ),
    section5050(
      text(`So the goal was never "feel nothing before the exam." That flat state usually means under-preparation, not calm. The actual goal — and the harder skill — is staying in the **middle zone**: using the alarm's energy (sharper focus, quicker reactions) without letting it flood into panic. Re-read the verse: Krishna doesn't tell Arjuna to feel *nothing* about the battle ahead — impossible, and not the ask. He says stay **samatvam**, balanced, whether it goes well or badly. That balance — not the absence of feeling — is the actual skill this whole chapter trains.`),
      sideImg('A single archer calm and centred, bow drawn steady, unaffected by cheering or booing crowds around',
        'An archer stands centred and calm mid-draw, bow steady, gaze fixed on a distant unseen target; on either side, small crowds of figures cheer wildly and jeer loudly, but neither one tilts the archer\'s stance.')
    ),
    quiz([
      { q: 'According to the performance curve, the BEST performance usually happens…', opts: ['At zero stress, totally relaxed', 'At maximum stress, as much pressure as possible', 'In a middle zone — alert and a little charged, not frozen and not flat', 'It is completely random'], a: 2, why: 'Too little stress under-prepares you; too much overwhelms clear thinking. Peak performance sits in the alert middle zone.', lvl: 1 },
      { q: 'Feeling zero nerves before a big test usually means…', opts: ['You will definitely do well', 'You are perfectly calm and prepared', 'You are likely under-prepared or under-invested, not "cured" of stress', 'Nerves are always bad, so this is ideal'], a: 2, why: 'A flat, feel-nothing state is not the goal — some charge sharpens focus. Zero stress often signals low stakes or low readiness, not mastery.', lvl: 2 },
      { q: 'Per Gita 2.48, samatvam (equanimity) means…', opts: ['Feeling nothing about the outcome at all', 'Staying balanced whether the result is success or failure, while still doing the work fully', 'Not caring about the task', 'Avoiding all risk'], a: 1, why: 'The verse asks for balance across outcomes, not numbness — you still act fully; you just don\'t let the swing of results knock you off-centre.', lvl: 2 },
    ]),
    gp({
      practice_kind: 'custom',
      title: 'The Relabel Drill',
      intro: 'A live experiment using a real stressor from your week — not a hypothetical one.',
      steps: [
        { instruction: 'Name one specific thing coming up that makes you nervous — a test, a match, a conversation. Rate your nervousness 1–10.' },
        { instruction: 'Notice one physical sensation of it right now — racing heart, tight chest, fidgety hands.' },
        { instruction: 'Say to yourself: "This is my body getting ready to perform, not a sign that something is wrong." Sit with that reframe for a moment.' },
        { instruction: 'Rate your nervousness again, 1–10. Notice: the sensation likely didn\'t vanish — but did the story around it shift?' },
      ],
      completion_note: 'The physical alarm rarely disappears from a single relabel — that\'s normal. What can shift immediately is whether you read it as an enemy or as fuel. That shift, repeated, is the actual training.',
    }),
    journal('What did you rate your nervousness before and after the relabel? Was there a moment in the past where nerves actually sharpened your performance, once you got going?', 20),
    text(`**This week:** before your next test or tricky conversation, run the Relabel Drill for real, in the moments right before. Notice whether "getting ready" feels different in your body than "something is wrong."`),
  ],
});

// ─── Page 4 — When the Alarm Won't Turn Off ──────────────────────────────────
reset();
PAGES.push({
  slug: 'when-the-alarm-wont-turn-off',
  title: 'When the Alarm Won\'t Turn Off',
  subtitle: 'Short bursts of stress prepare you. Weeks of it wear you down',
  page_number: 4,
  blocks: [
    hero('A single smoke detector blaring nonstop in a calm undamaged house, everyone covering their ears',
      'A cosy, undamaged house interior where a single smoke detector on the ceiling blares nonstop with visible sound waves, even though there is no fire anywhere; a family below covers their ears, exhausted, going about small daily tasks regardless.'),
    verse('From the Bhagavad Gita (6.16)',
      'नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः। न चातिस्वप्नशीलस्य जाग्रतो नैव चार्जुन॥',
      'न बहुत खाने वाले का योग सधता है, न बिलकुल न खाने वाले का। न बहुत सोने वाले का, न बिलकुल न सोने वाले का, अर्जुन।',
      'Yoga is not for one who eats too much, nor for one who eats too little; not for one who sleeps too much, nor for one who stays awake too much, Arjuna.'),
    curiosity('One bad night before an exam barely dents you. A whole term of bad nights does. What is actually different?',
      undefined,
      'Duration. A short alarm is a tool. An alarm that never shuts off is a cost — to sleep, mood, and the immune system that fights off your next cold.'),
    heading('Acute vs. chronic — the difference that matters'),
    text(`**Acute stress** is a short burst with a clear end: a test, a match, an awkward conversation. It switches on, does its job, and switches off once the moment passes. This is the useful kind — the one page 3 was about.\n\n**Chronic stress** is the alarm that doesn't get to switch off: ongoing pressure at home, an unresolved conflict, weeks of exam-season worry stacked without a break. The body wasn't built to run its "danger" chemicals for weeks on end. Mainstream research consistently links prolonged, unmanaged stress to worse sleep, lower mood, and a weaker immune system — you may notice you catch colds more easily during a hard term. This isn't a scare tactic; it's exactly why the verse above pairs stress management with **moderation** in food and sleep, not with pushing harder.`),
    heading('The habit link — and the honest limit of this page'),
    text(`Notice the verse doesn't offer a technique — it names a *lifestyle condition*: neither excess nor deprivation, in food or sleep. Chronic stress and bad sleep feed each other in both directions — poor sleep makes you more reactive to stress, and stress makes it harder to sleep. Page 3's "middle zone" idea applies here too, but on a longer timescale: not too little rest, not too much escape, a sustainable middle.\n\nAnd here is the honest limit of everything in this chapter: these are tools for everyday pressure. If stress has stopped feeling like a wave that passes and instead feels like a weight that never lifts — for weeks, not a bad day — that is worth telling a trusted adult, or calling **iCall (9152987821)** or **Tele-MANAS (14416)**. That is not a failure of these tools. It's simply outside what any tool can do alone.`),
    experiment({
      title: 'The 2-Day Stress Diary',
      intro: 'Not a one-time task — a short noticing habit over today and tomorrow, to see your own pattern in writing instead of guessing at it.',
      steps: [
        'Each time you notice a stress signal (from page 2\'s autopsy) today and tomorrow, pause for 10 seconds.',
        'Silently note three things: what triggered it, which body signal showed up, and what — if anything — helped it pass.',
        'At the end of day 2, look back at your notes for any repeat trigger or repeat helper.',
      ],
      prompt: 'By the end of 2 days, which of these did you notice in your own pattern?',
      options: [
        { label: 'The same trigger showed up more than once (a person, place, or type of task)', explanation: 'That repeat trigger is useful information — it tells you exactly where to aim page 3\'s relabel drill or page 5\'s breathing tool this week.' },
        { label: 'The stress signal faded faster on its own than I expected', explanation: 'That is the same "wave" idea from Focus\'s urge-surfing — most stress spikes are shorter-lived than they feel in the moment, if you don\'t feed them with more worry.' },
        { label: 'One thing reliably helped — talking to someone, moving my body, a short break', explanation: 'That is the beginning of your own calm-down kit — you\'ll build it properly on page 8.' },
        { label: 'It felt more constant than spiky — hard to point to a single trigger', explanation: 'That pattern is worth mentioning to a trusted adult even if it feels minor — a low background hum of stress is exactly the "alarm that won\'t turn off" this page describes.' },
        { label: 'Honestly, I forgot to check in most of the time', explanation: 'That\'s fine — noticing is itself a trained skill, from page 2 of the last chapter. Try again for one day this week, without pressure.' },
      ],
      min_select: 1,
      completion_note: 'Whatever you noticed, you now have real data about your own stress pattern instead of a guess. That data is what the rest of this chapter\'s tools will point at.',
    }),
    journal('What was your most common trigger these two days? If nothing reliably helped yet, that\'s exactly what the next few pages are for.', 20),
    text(`**Ongoing:** keep half an eye on the diary habit this week, even informally. A pattern usually needs more than two days to show itself clearly.`),
  ],
});

// ─── Page 5 — Breath: The Remote Control, Part 2 ─────────────────────────────
reset();
PAGES.push({
  slug: 'breath-the-remote-control-part-2',
  title: 'Breath: The Remote Control, Part 2',
  subtitle: 'The same dial from the Focus module — now aimed at a real spike, not a study session',
  page_number: 5,
  blocks: [
    hero('The same calm lungs-as-waves image from before, now with a second smaller dial added labeled sudden',
      'A gentle anatomical torso outline where the lungs are drawn as slow calm ocean waves; beside the heart sit two small dials — one labelled with a wave icon for slow breathing, a second smaller one labelled with a burst icon for a sudden spike.'),
    verse('From the Yoga-sūtra of Patañjali (1.34) — the same verse as Focus, page 6',
      'प्रच्छर्दनविधारणाभ्यां वा प्राणस्य॥',
      'मन शांत करना हो तो साँस से शुरू करो — धीरे से पूरी साँस बाहर छोड़ो और एक पल रुको।',
      'Calm also comes from the slow release, and gentle holding, of the breath.'),
    curiosity('Remember the 4-4-6 Reset from the Focus module? Same tool. New job: the moment right after a shock, not a study session.'),
    heading('One dial, two different moments'),
    text(`The 4-4-6 Reset you built in the last chapter — in for 4, hold for 4, out for 6 — still works exactly the same way here: the long exhale presses your body's calm-down brake. But stress spikes are often faster and sharper than a study slump, so here's a second version for the sudden moments: your result comes back badly, an argument just ended, a near-miss happens. In that instant, you may not have two minutes for six full rounds.\n\nFor a **sudden** spike: one long, slow exhale — even a single one, twice as long as your normal breath — starts the same brake. Then, once your hands have stopped shaking slightly, move into the full 4-4-6 for the remaining rounds. Same dial. Different pace for different weather.`),
    heading('Where this one belongs'),
    text(`Use the full 4-4-6 (below) right now — as practice, on a calm afternoon, so it's already familiar in your hands before you need it. Then carry the *one-slow-exhale* version for real spikes: right after a bad mark is read out, right before you have to speak after being caught off guard, right after nearly missing the bus. The tool is identical. Only the moment changes.`),
    gp({
      practice_kind: 'breathing',
      title: 'The 4-4-6 Reset — For a Stress Spike',
      intro: 'Before you begin, notice your breath right now — fast or slow, high in the chest or low in the belly? That\'s your "before."',
      steps: [
        { instruction: 'Sit or stand. Drop your shoulders once, on purpose.' },
        { instruction: 'Follow the circle — in for 4, hold for 4, out for 6. Let the exhale feel like release, not effort.' },
      ],
      breath_pattern: { inhale_sec: 4, hold_sec: 4, exhale_sec: 6, cycles: 6 },
      completion_note: 'Check in with the four questions below: how it felt during, what it was like before, what it\'s like now, and why you think the shift happened.',
    }),
    journal('Four quick answers: (1) How did it feel during the practice? (2) What was your breath like before you started? (3) What is it like right now? (4) Why do you think that shift happened? Also — pick your real trigger moment this week for the one-slow-exhale version.', 25),
    text(`**This week:** use the one-slow-exhale version at your real trigger moment. A tool only becomes yours the first time it works outside the gym.`),
  ],
});

// ─── Page 6 — Naming Calms the Storm ─────────────────────────────────────────
reset();
PAGES.push({
  slug: 'naming-calms-the-storm',
  title: 'Naming Calms the Storm',
  subtitle: 'The exact word for how you feel is more powerful than it sounds',
  page_number: 6,
  blocks: [
    hero('Two birds on the same branch, one eating fruit and one calmly watching',
      'A single old tree branch holds two birds close together as companions; one bird pecks eagerly at a bright piece of fruit, while the other sits calmly beside it, simply watching without eating, both drawn in warm hand-illustrated detail.'),
    verse('From the Mundaka Upanishad (3.1.1)',
      'द्वा सुपर्णा सयुजा सखाया समानं वृक्षं परिषस्वजाते। तयोरन्यः पिप्पलं स्वाद्वत्त्यनश्नन्नन्यो अभिचाकशीति॥',
      'एक ही पेड़ पर दो साथी पक्षी बैठे हैं। एक फल खाता है — मीठा भी, कड़वा भी। दूसरा बिना खाए बस देखता रहता है।',
      'Two birds, close companions, cling to the same tree. One eats the fruit — sweet and bitter both. The other, without eating, simply watches.'),
    curiosity('"I\'m so stressed" versus "my chest feels tight and I keep re-reading the same line" — same feeling. Which one actually helps you deal with it?'),
    section5050(
      text(`Here's a strange but well-replicated finding: simply putting a precise name on a feeling — not fixing it, just *naming* it accurately — measurably calms the parts of the brain driving the distress. Psychologists call this **affect labeling**, and it's blunt in practice: "I'm stressed" barely moves the needle. "My chest is tight and I'm scared I'll blank on the formula" does. Vague words keep you tangled inside the feeling. Precise words put a small gap between you and it.`),
      sideImg('A tangled ball of yarn on one side and neatly labelled spools of thread on the other',
        'A split illustration: on the left, a single chaotic tangled ball of dark yarn; on the right, the same yarn separated into three neat labelled spools sitting calmly in a row, each with a small tag.')
    ),
    section5050(
      text(`That gap is exactly what the verse above describes. One bird is fully inside the experience — tasting every sweet and bitter fruit, swept up in each bite. The other simply **watches**, from the same branch, without needing to stop the first bird or judge it. You are not being asked to become emotionless (that's the eating bird's job — feeling things is part of being alive). You're being shown that a **watching part of you** exists too, and you can call on it: name the feeling precisely, and for a moment you're the second bird, not just the first.`),
      sideImg('A single figure sitting at a slight distance from their own thought-cloud, observing it calmly',
        'A calm figure sits cross-legged a short distance away from a soft thought-cloud drifting beside them, containing faint scribbled worries; the figure observes the cloud with mild curiosity rather than being inside it.')
    ),
    quiz([
      { q: '"Affect labeling" means…', opts: ['Ignoring your feelings completely', 'Putting a precise, accurate name on a feeling, which measurably calms the distress', 'Labelling other people\'s feelings for them', 'Writing a diary entry every day no matter what'], a: 1, why: 'Accurately naming what you feel — not just "stressed" but the specific sensation and worry — is shown to reduce the intensity of the distress.', lvl: 1 },
      { q: 'Why does "my chest is tight and I\'m scared I\'ll blank" work better than "I\'m stressed"?', opts: ['It uses bigger words', 'It is more precise, which creates distance from the feeling instead of staying tangled in it', 'It takes longer to say', 'There is no real difference'], a: 1, why: 'Vague labels keep you fused with the feeling. Specific labels create the small gap the "watching bird" verse describes.', lvl: 2 },
      { q: 'In the two-birds verse, the second bird represents…', opts: ['A part of you that feels nothing, ever', 'A part of you that can watch your experience without being swept fully into it', 'A punishment for feeling emotions', 'A bird that is better than the other bird'], a: 1, why: 'The watching bird isn\'t emotionless — it\'s the observing awareness you can access by naming, without needing to erase the feeling itself.', lvl: 2 },
    ]),
    gp({
      practice_kind: 'custom',
      title: 'Name It to Tame It',
      intro: 'A 3-step body-scan-and-name practice — no props needed.',
      steps: [
        { instruction: 'Sit still. Starting from your head, slowly scan down to your feet, noticing any tension without trying to change it.' },
        { instruction: 'Pick today\'s strongest feeling. Instead of "bad" or "stressed," find three precise words for it — where it sits in the body, and its real name (worried, embarrassed, disappointed, jealous, relieved…).' },
        { instruction: 'Say the precise version out loud or write it down: "I feel [X] in my [body part], because [Y]."' },
      ],
      completion_note: 'You just did what the second bird does — watched, and named, without needing to fix anything yet. Notice if the feeling shrank even slightly the moment it had an exact name.',
    }),
    journal('What precise words did you find, that were more accurate than just "stressed" or "bad"? Did naming it change its size at all?', 20),
    text(`**Tonight:** the next time a feeling shows up — good or bad — try to catch it and name it precisely, in the moment, before it passes. That's a rep for the watching bird.`),
  ],
});

// ─── Page 7 — Sthitaprajña: The Steady Mind ──────────────────────────────────
reset();
PAGES.push({
  slug: 'sthitaprajna-the-steady-mind',
  title: 'Sthitaprajña: The Steady Mind',
  subtitle: 'India\'s ancient word for the skill this whole chapter is building toward',
  page_number: 7,
  blocks: [
    hero('A large steady boulder standing unmoved in the middle of a rushing river',
      'A large smooth grey boulder stands firm and unmoved in the middle of a fast, foaming river; the water splits around it and rushes on both sides, while the boulder itself sits perfectly still, warmly lit.'),
    verse('From the Bhagavad Gita (2.56)',
      'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः। वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते॥',
      'दुःख में जिसका मन विचलित नहीं होता, सुख में जिसे कोई लालसा नहीं — जो लगाव, डर और गुस्से से मुक्त है, उसे ही स्थितधी कहा जाता है।',
      'One whose mind is not shaken in sorrow, who no longer craves in pleasure, free from attachment, fear and anger — that person is called sthita-dhī, the one of steady wisdom.'),
    curiosity('Have you ever met someone who stays roughly the same person whether things are going great or terribly? What is that, exactly?',
      undefined,
      'The Gita has a precise word for it — sthitaprajña — and, unlike most compliments, it comes with an actual description of how to build it.'),
    heading('A state, not a personality'),
    text(`**Sthitaprajña** means "one of steady wisdom" — someone whose inner steadiness doesn't swing wildly with every high and low. It's tempting to read this as a rare personality trait some people are simply born with. But look again at what you've already done in this chapter: page 3's relabeling, page 5's breath reset, page 6's precise naming — each one is a small rep of exactly this same skill, staying steady rather than being swept away by the moment. Sthitaprajña isn't a personality. **It's a trained state, built one rep at a time — same as dhāraṇā was for attention.**`),
    heading('Not numb — steady'),
    text(`Re-read the verse carefully: it does not say "feel nothing." It says undisturbed *in sorrow*, without craving *in pleasure*, free from attachment, fear and anger. That's someone who still feels the full range of a life — grief, joy, excitement — but isn't **thrown** by any of it into a worse decision or a lost sense of self. Like the boulder in the river: the water is completely real, rushing hard on both sides. The boulder isn't pretending the river doesn't exist. It just doesn't move with every current.\n\nThat's the whole chapter in one image. You cannot stop the river — stress, results, arguments, disappointments will keep coming, same as they do for everyone. What you're training, one small tool at a time, is to be the boulder a little more often.`),
    quiz([
      { q: 'Sthitaprajña is best understood as…', opts: ['A rare personality some people are born with and others aren\'t', 'A trained state, built through repeated practice, same as attention training', 'Feeling nothing at all, ever', 'Only for monks and sages'], a: 1, why: 'Like dhāraṇā, it\'s built through reps — the relabeling, breathing and naming practices already in this chapter are exactly those reps.', lvl: 2 },
      { q: 'According to the verse, being "steady" means…', opts: ['Feeling no emotions at all', 'Not being disturbed in sorrow or gripped by craving in pleasure — while still fully experiencing both', 'Avoiding all difficult situations', 'Suppressing anger by pretending it isn\'t there'], a: 1, why: 'The verse describes someone who feels sorrow and pleasure fully but isn\'t swept into worse decisions by either — steadiness, not numbness.', lvl: 2 },
      { q: 'The boulder-in-the-river image illustrates that…', opts: ['You should ignore your problems', 'The river (stress, events) is real and keeps moving — the training is to move less with every current, not to stop the river', 'Boulders never change', 'Rivers are dangerous and should be avoided'], a: 1, why: 'You can\'t stop external events. What you train is how much you get swept by them — the boulder still feels the water; it just doesn\'t move with it.', lvl: 2 },
    ]),
    gp({
      practice_kind: 'meditation',
      title: 'Witness the Wave',
      intro: 'A short sit using a real stressed feeling from today — not a hypothetical one.',
      steps: [
        { instruction: 'Sit comfortably. Bring to mind something that stressed you today, even mildly.' },
        { instruction: 'Let the feeling arise in your body. Don\'t push it away and don\'t dive into the story — just notice it, like the boulder noticing the water.' },
        { instruction: 'Breathe slowly. With each exhale, silently repeat: "This is real, and I don\'t have to move with it."', duration_sec: 180 },
      ],
      completion_note: 'You just practised being the boulder for three minutes. It won\'t remove the river — that\'s not the goal. Notice whether the feeling, watched this way, felt slightly less in-charge of you by the end.',
    }),
    journal('What feeling did you bring to mind? Did watching it feel different from your usual way of reacting to it — and if so, how?', 20),
    text(`**This week:** the next time a real wave hits — a bad mark, a fight, disappointing news — try, even for ten seconds, to be the boulder before you react. You don't have to succeed every time for it to count as a rep.`),
  ],
});

// ─── Page 8 — Design Your Calm-Down Kit ──────────────────────────────────────
reset();
PAGES.push({
  slug: 'design-your-calm-down-kit',
  title: 'Design Your Calm-Down Kit',
  subtitle: 'You don\'t have to invent a plan in the middle of a bad moment — build it now, while you\'re calm',
  page_number: 8,
  blocks: [
    hero('A small labeled toolbox open on a desk holding a candle, a folded note, and a phone with one contact starred',
      'A small open wooden toolbox on a calm desk holding a short unlit candle, a neatly folded handwritten note, and a simple phone screen showing one starred contact; warm desk lamp light, everything within easy reach.'),
    verse('From the Bhagavad Gita (4.34)',
      'तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया। उपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः॥',
      'सीखने के लिए झुककर पूछो, सेवा भाव रखो — जिन्होंने सच जाना है, वे तुम्हें सिखाएँगे।',
      'Learn this by approaching with humility, by asking honest questions, by being open to guidance — those who have truly seen will teach you.'),
    curiosity('You wouldn\'t wait for a fire to buy a fire extinguisher. So why wait for a bad day to figure out what actually calms you down?'),
    heading('Build it now, while you\'re calm'),
    text(`Every tool in this chapter works better when it's already chosen *before* you need it — deciding "what do I do right now?" mid-panic is the hardest possible moment to decide anything. So today's job isn't a new tool. It's picking your **top two** from everything you've already tried: the 4-4-6 breath reset, the relabel drill, precise naming, witnessing the wave. Whichever two actually worked for you — not the ones that sound impressive — those two go in your kit.`),
    heading('The one tool that isn\'t just for you'),
    text(`Notice the verse above isn't about a breathing technique or a mindset trick — it's about **seeking out someone who knows more than you do.** That's a genuinely different kind of tool: not something you do alone, but someone you go to. Every calm-down kit needs one name in it — a parent, teacher, elder sibling, counsellor, or coach — someone you'd actually message or call when a tool alone isn't enough. Picking that name now, while calm, means you're not searching for it during the hard moment. And if that name is genuinely nobody right now, **iCall (9152987821)** and **Tele-MANAS (14416)** are always in the kit too.`),
    gp({
      practice_kind: 'custom',
      title: 'Build Your Kit',
      intro: 'Four minutes, on paper or in your notes app — build it once, use it for months.',
      steps: [
        { instruction: 'From this chapter, write down your top TWO tools — the ones that genuinely worked for you, not the ones that sound best.' },
        { instruction: 'Write down ONE trusted person\'s name and how you\'d reach them — a message, a call, walking into their room.' },
        { instruction: 'Rehearse, just in your head, the opening line you\'d actually say to that person: "Can we talk for a minute, I\'m stressed about…"' },
        { instruction: 'Save iCall (9152987821) and Tele-MANAS (14416) in your phone right now, even if you\'re sure you won\'t need them.' },
      ],
      completion_note: 'That\'s your kit — two tools plus one person plus two numbers. Small, specific, and already built before you need it. That\'s the entire point.',
    }),
    journal('Write your finished kit: your two tools, your one trusted person, and one honest sentence about why reaching out to that person felt easy or hard to imagine.', 20),
    text(`**This week:** use your kit for real, once — even for something small. A tool that has only ever been theoretical isn't really yours yet.`),
  ],
});

// ─── Page 9 — Your 7-Day Calm Challenge (post-check + tracker) ───────────────
reset();
PAGES.push({
  slug: 'your-7-day-calm-challenge',
  title: 'Your 7-Day Calm Challenge',
  subtitle: 'The tools exist. Steadiness comes from using them — again and again',
  page_number: 9,
  blocks: [
    hero('The same steady boulder from before, now with seven small stones stacked calmly beside it in a river',
      'The same large steady boulder stands in a calm river; beside it, seven smaller flat stones are stacked into a neat, steady cairn on the riverbank, the water flowing gently past both, dawn light on the water.'),
    verse('From the Bhagavad Gita (6.35) — the same verse that closed the Focus module',
      'असंशयं महाबाहो मनो दुर्निग्रहं चलम्। अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥',
      'कृष्ण खुद मानते हैं — मन को पकड़ना मुश्किल है, बेशक। पर अभ्यास से पकड़ में आ जाता है। रोज़ का अभ्यास — बस यही रास्ता है।',
      '"Yes — the mind is restless and hard to hold, no argument," says Krishna. "But by abhyāsa — steady practice — it comes to hand."'),
    text(`Eight pages ago, stress was just something that *happened* to you — a racing heart with no explanation. Now look at what you've built: you know exactly **why** your body reacts (page 2), that the goal was never zero stress but the **middle zone** (page 3), the difference between a short alarm and one that won't switch off (page 4), the breath's remote control aimed at real spikes (page 5), the power of **naming precisely** (page 6), the steady-boulder skill of **sthitaprajña** (page 7), and your own **calm-down kit** (page 8).\n\nThis is the exact same verse that closed the Focus module — on purpose. Krishna's answer to "the mind is hard to hold" was never a trick or a shortcut, for attention *or* for stress. It's the same word both times: **abhyāsa**. Steady, repeated practice. That is the entire remaining syllabus — and, same as before, nobody else can do the reps for you.`),
    heading('First: re-measure yourself'),
    text(`Before the challenge begins, take the exact same check you took on page 1 — same honest scale, same few questions.`),
    gp({
      practice_kind: 'observation',
      title: 'Your Stress Baseline — Round 2',
      intro: 'Identical to page 1. Let\'s see what eight pages of tools did to your starting number.',
      steps: [
        { instruction: 'Sit still. Notice your breathing and your body — shoulders, jaw, hands.' },
        { instruction: 'On the same 1 (totally calm) to 10 (wound up) scale, rate how you feel right now.', duration_sec: 60 },
      ],
      completion_note: 'Hold both numbers in your head — page 1\'s and today\'s — and write the comparison below while it\'s fresh.',
    }),
    journal('Round 1 number vs. Round 2 number — write both. Even if today\'s number is high for an unrelated reason, has HOW you relate to that number changed at all since page 1?', 25),
    heading('The challenge rules'),
    text(`One rep a day, seven days. The rep is simple:\n\n1. **Use one tool from your kit** (page 8) — even briefly, even if nothing dramatic is happening. Small stress counts too.\n2. **Name it precisely** (page 6) — one sentence, in your head or written.\n3. **Check in below** — same day, every day.\n\nThree rules of mercy, same as last time:\n\n- A day where the tool "didn't really work" **still counts**. You reached for it — that's the rep.\n- **Missed a day? No guilt, no restart-from-zero.** Continue today.\n- After day 7, this is meant to keep going quietly for the rest of the year — the tracker just gets you started.`),
    tracker({
      title: 'The 7-Day Calm Challenge',
      habit: 'Use one tool from your calm-down kit, and name one feeling precisely — every day.',
      duration_days: 7,
      why: 'Steadiness is built the same way attention was — through reps, not insight alone. Seven days is where the tools first start to feel like yours.',
    }),
    text(`**After day 7:** take the stress check one more time — your own numbers, your own proof. And keep your kit somewhere you'll actually find it in six months. The next module in this book turns the same steadiness toward sleep, food, and how you treat your body day to day.`),
  ],
});

// ─── Insert ──────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing — run from repo root.');
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found — run setup_life_skills_class9_focus.js first.`);
    console.log(`✓ Book found: ${book.title} (${book._id})`);

    // 1. Chapter shell (insert-if-absent)
    if (!(book.chapters || []).some(c => c.number === CHAPTER.number)) {
      await books.updateOne({ _id: book._id }, {
        $push: { chapters: { number: CHAPTER.number, title: CHAPTER.title, slug: CHAPTER.slug,
          page_ids: [], description: 'Understand your body\'s alarm system, learn to work with stress instead of being ambushed by it, and train the steady mind the Gita calls sthitaprajna.',
          is_published: false } },
        $set: { updated_at: now },
      });
      console.log(`✓ Added Chapter ${CHAPTER.number}: ${CHAPTER.title}`);
    } else {
      console.log(`✓ Chapter ${CHAPTER.number} already present.`);
    }

    // 2. Pages (insert-if-absent, by book_id + slug)
    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) { console.log(`  ⤷ "${p.slug}" exists — skipping.`); pageIds.push(String(existing._id)); continue; }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId, book_id: String(book._id), chapter_number: CHAPTER.number,
        page_number: p.page_number, slug: p.slug, title: p.title, subtitle: p.subtitle,
        blocks: p.blocks, hinglish_blocks: [], tags: ['life-skills', 'stress'],
        published: false, reading_time_min: 6,
        created_at: now, updated_at: now,
      });
      pageIds.push(pageId);
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks, id ${pageId})`);
    }

    // 3. Wire pages into the chapter
    const fresh = await books.findOne({ _id: book._id });
    const ch = fresh.chapters.find(c => c.number === CHAPTER.number);
    const toAdd = pageIds.filter(id => !(ch.page_ids || []).includes(id));
    if (toAdd.length) {
      await books.updateOne({ _id: book._id, 'chapters.number': CHAPTER.number },
        { $push: { 'chapters.$.page_ids': { $each: toAdd } }, $set: { updated_at: now } });
      console.log(`✓ Wired ${toAdd.length} page(s) into Chapter ${CHAPTER.number}.`);
    } else {
      console.log('✓ All pages already wired.');
    }

    console.log('\n✅ Life Skills — Class 9 · Chapter 2 "Stress & Emotions" — setup complete (9 pages, published:false).');
  } finally { await client.close(); }
}

if (require.main === module) {
  main().catch(err => { console.error('❌', err.message); process.exit(1); });
} else {
  module.exports = { PAGES, CHAPTER, BOOK_SLUG };
}
