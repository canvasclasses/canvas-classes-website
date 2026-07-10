'use strict';
/**
 * Creates the "Life Skills — Class 9" Live Book + Chapter 1 "Focus & Attention"
 * (the pilot Focus module, 10 pages).
 *
 * Canonical spec: _agents/workflows/LIFE_SKILLS_WORKFLOW.md (§10 blueprint).
 * Parent plan:    _agents/plans/LIVEBOOK_21C_VEDIC_VISION.md
 *
 * Safety notes (CLAUDE.md §0 / §0.6):
 *   - INSERT-ONLY and idempotent: creates 1 book doc + 10 page docs if absent,
 *     skips anything that already exists. Never updates or deletes existing
 *     content, so the content-loss guard is not applicable (future edits to
 *     these pages must go through scripts/lib/book-writer.js).
 *   - All pages land published:false — nothing is student-visible until the
 *     founder reviews and publishes.
 *   - Rollback: delete the book doc + the 10 page docs by the IDs this script
 *     prints on creation.
 *
 * Verse sources (all cited in-page): Katha Upanishad 1.3.3–4; Gita 6.26, 2.62,
 * 2.41, 6.11, 2.47, 6.17, 6.35; Yoga-sūtra 3.1–3.2, 1.34.
 *
 * Run: node scripts/setup_life_skills_class9_focus.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'life-skills-class-9';
const BOOK_TITLE = 'Life Skills — Class 9';
const CHAPTER = { number: 1, title: 'Focus & Attention', slug: 'focus-and-attention' };

// Standard Live Books image style (memory: project_livebook_image_style):
const STYLE =
  'Hand-drawn coloured illustration on a deep charcoal dark background, muted earthy palette ' +
  '(sage green, clay red, ochre, dusty blue), soft textured linework, no glow, no neon, ' +
  'no orange accents, no 3D render, landscape composition, generous negative space.';

let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: `${prompt} ${STYLE}` });
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const curiosity = (prompt, hint, reveal) => ({ id: uuidv4(), type: 'curiosity_prompt', order: _o++, prompt, ...(hint ? { hint } : {}), ...(reveal ? { reveal } : {}) });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why, difficulty_level: q.lvl || 1 })) });
const gp = (props) => ({ id: uuidv4(), type: 'guided_practice', order: _o++, ...props, steps: props.steps.map(s => ({ id: uuidv4(), ...s })) });
const journal = (prompt, min_words) => ({ id: uuidv4(), type: 'reflection_journal', order: _o++, prompt, ...(min_words ? { min_words } : {}) });
const tracker = (props) => ({ id: uuidv4(), type: 'habit_tracker', order: _o++, ...props });
const verse = (source, sanskrit, hindi, english) => callout('fun_fact', source, `*${sanskrit}*\n\n${hindi}\n\n${english}`);

const PAGES = [];

// ─── Page 1 — Your Attention Is a Superpower (baseline check) ────────────────
reset();
PAGES.push({
  slug: 'your-attention-is-a-superpower',
  title: 'Your Attention Is a Superpower',
  subtitle: 'The one skill under every other skill — and how to measure yours today',
  page_number: 1,
  blocks: [
    hero('A young charioteer holding the reins of five horses pulling a chariot',
      'A calm young charioteer stands in a simple wooden chariot holding the reins of five spirited horses, each horse pulling in a slightly different direction; the charioteer looks steady and unhurried.'),
    verse('From the Katha Upanishad (1.3.3–4)',
      'आत्मानं रथिनं विद्धि शरीरं रथमेव तु। बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च॥ इन्द्रियाणि हयानाहुः…',
      'समझो — शरीर एक रथ है, इन्द्रियाँ उसके घोड़े हैं, मन लगाम है और बुद्धि सारथी। घोड़े जिधर चाहें उधर भागेंगे — जब तक सारथी लगाम न सँभाले।',
      'Your body is a chariot, your senses are its horses, your mind is the reins, and your intellect is the charioteer. The ride goes wherever the horses want — until the charioteer takes the reins.'),
    curiosity('You opened your book 20 minutes ago. Honestly — how many of those minutes were actually *on* the book?',
      'Nobody is checking. Count the phone glances, the daydreams, the "just one second" detours.',
      'Most people are shocked by their honest answer. That gap — between time spent and time truly focused — is exactly what this chapter trains.'),
    heading('The skill under every other skill'),
    text(`Marks, sports, music, coding, even friendships — everything you want to get good at passes through one gate first: **attention**. Whatever you can hold your attention on, you can learn. Whatever keeps slipping away from your attention stays hard forever.\n\nHere is what has changed since your parents were in Class 9: back then, the world was merely *distracting*. Today, some of the smartest engineers on Earth are paid very well to design apps that pull your attention and hold it. It is not a fair fight — unless you train.\n\nThat is what this chapter is: **a gym for your attention**. Ten short pages. Each one gives you one idea about how your mind actually works, and one exercise that takes a few minutes. By the last page, you'll start a 7-day challenge — and you'll be able to *measure* how much stronger you've become.`),
    heading('First, measure it'),
    text(`Every real training programme starts with a baseline. A coach times your sprint *before* the season starts, so improvement is a fact, not a feeling.\n\nSo before we learn anything — take the test below. It's 60 seconds. Your score is simply **the number of times your mind wanders**. There is no good or bad score. A wandering mind is a normal mind. This number is just your starting line.`),
    gp({
      practice_kind: 'observation',
      title: 'The 60-Second Stillness Test',
      intro: 'Your baseline. Remember your number — you will beat it on page 10.',
      steps: [
        { instruction: 'Pick one small object you can see — a pen cap, a button, a door handle.' },
        { instruction: 'Sit comfortably. When you press start, rest your attention on that object — just look at it.' },
        { instruction: 'Every time you notice your mind has drifted somewhere else, silently count it — one, two, three — and bring your attention back to the object.', duration_sec: 60 },
      ],
      completion_note: 'That count is your baseline score. Not a judgement — a starting line. Write it down below before you forget it.',
    }),
    journal('Write your wander count from the test. Then describe how those 60 seconds felt — long, short, itchy, boring, surprisingly hard? Where did your mind try to go?', 20),
    text(`**Tonight:** no exercise, just one act of noticing. At some point this evening, catch your attention *in the act* of being pulled — by a notification, a sound, a thought. Don't fight it. Just silently note: *"caught it."* Noticing is the first rep.`),
  ],
});

// ─── Page 2 — The Spotlight in Your Head ─────────────────────────────────────
reset();
PAGES.push({
  slug: 'the-spotlight-in-your-head',
  title: 'The Spotlight in Your Head',
  subtitle: 'Attention is a beam, not a bucket — and you can learn to aim it',
  page_number: 2,
  blocks: [
    hero('A torch beam in a dark room lighting up one open book while other objects sit dim',
      'A dark room where a single warm torch beam falls on one open notebook on a desk; around it in the shadows sit a dim phone, a cricket bat, a TV and chattering figures, all outside the beam.'),
    verse('From the Bhagavad Gita (6.26)',
      'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्। ततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥',
      'मन चंचल है — बार-बार भागेगा। जहाँ-जहाँ भागे, वहाँ-वहाँ से पकड़ कर वापस ले आओ। बस यही अभ्यास है।',
      'The mind is restless — it will wander again and again. From wherever it wanders, bring it back. That bringing-back is the whole training.'),
    curiosity('In a loud mela, with a hundred people talking, you can still hear your one friend clearly. How does your brain do that?'),
    heading('One beam, not a bucket'),
    text(`Your attention is not a bucket that holds everything around you. It is a **spotlight**: whatever the beam lands on becomes bright, sharp and remembered — everything else fades into background noise.\n\nThat mela trick has a name: **selective attention**. Your ears receive *all* the voices, but your spotlight lights up only your friend's. The rest is still entering your ears — your brain simply doesn't process it deeply.\n\nThis explains something important about studying: reading a page while your spotlight is on *the cricket score* means the words entered your eyes but never got lit up. That's why you can "read" a full page and remember nothing. The page was never actually in the beam.`),
    heading('Toppers don\'t have a bigger beam'),
    text(`Here is the encouraging part: research on attention finds that mind-wandering fills a huge share of everyone's day — for students and toppers alike. The topper's advantage is usually not a magically steady beam. It is that they **notice the drift sooner and bring the beam back faster**.\n\nRead the verse above again. Krishna does not say "a good student's mind never wanders." He says: *from wherever it wanders, bring it back.* The return **is** the skill. Every time you notice and return, you've done one repetition — one attention push-up. The drift isn't failure; not noticing the drift is the only failure.`),
    quiz([
      { q: 'Your attention works most like a…', opts: ['Bucket that collects everything nearby', 'Spotlight that brightens one thing at a time', 'Mirror that reflects everything equally', 'Sponge that soaks all sounds'], a: 1, why: 'Whatever the beam lands on gets processed deeply; the rest fades. That is why aiming the beam matters.', lvl: 1 },
      { q: 'You "read" a full page but remember nothing. The most likely reason?', opts: ['Your memory is weak', 'The page was too hard', 'Your spotlight was on something else while your eyes moved', 'You read too slowly'], a: 2, why: 'The words entered your eyes but were never in the attention beam — so they were never deeply processed.', lvl: 2 },
      { q: 'Per Gita 6.26, what is the actual training?', opts: ['Preventing the mind from ever wandering', 'Punishing yourself for drifting', 'Noticing the drift and bringing attention back, every time', 'Studying longer hours'], a: 2, why: 'The verse assumes the mind WILL wander. The rep is the return — noticing and coming back.', lvl: 2 },
    ]),
    gp({
      practice_kind: 'observation',
      title: 'The Spotlight Drill',
      intro: 'You will aim your beam at one boring sound and hold it there. Boring is the point — anyone can attend to fireworks.',
      steps: [
        { instruction: 'Pick one continuous background sound near you — a fan, distant traffic, the fridge hum.' },
        { instruction: 'Aim your full spotlight at that sound. When the beam drifts to another sound or a thought, notice — and swing it back.', duration_sec: 90 },
      ],
      completion_note: 'Every swing-back you just did was one rep. The drill is boring by design — training happens at the moment of return, not during the easy holding.',
    }),
    journal('What kept stealing your spotlight during the drill — sounds, thoughts, plans, memories? Do you see a pattern in what pulls your beam?', 15),
    text(`**Tomorrow morning:** keep your spotlight on just one thing for the first ten minutes after waking — brushing, breakfast, anything. No phone in that window. Notice how often the beam tries to jump.`),
  ],
});

// ─── Page 3 — Why Reels Feel Impossible to Stop ──────────────────────────────
reset();
PAGES.push({
  slug: 'why-reels-feel-impossible-to-stop',
  title: 'Why Reels Feel Impossible to Stop',
  subtitle: 'It is not weak willpower. It is a machine, and you are about to see its blueprint',
  page_number: 3,
  blocks: [
    hero('A slot machine whose lever and screen morph into a smartphone with an endless feed',
      'An old-fashioned slot machine drawn mid-transformation into a smartphone: the pull-lever becomes a scrolling thumb, the three spinning reels become video thumbnails cascading downward endlessly.'),
    verse('From the Bhagavad Gita (2.62)',
      'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते। सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥',
      'जिस चीज़ के बारे में बार-बार सोचते हो, उसी से लगाव बन जाता है। लगाव से चाहत बढ़ती है — और चाहत पूरी न हो तो बेचैनी।',
      'Dwell on a thing again and again, and attachment forms. Attachment grows into craving; craving, when blocked, becomes restlessness.'),
    curiosity('You opened Instagram "for two minutes." You looked up 40 minutes later. What actually happened in between?',
      'Hint: the answer is not "I am weak."'),
    heading('The slot-machine secret'),
    text(`Nearly a century ago, scientists studying animal behaviour found something strange. A pigeon that gets a food pellet **every** time it pecks a button pecks calmly. But a pigeon that gets the pellet **unpredictably** — sometimes on the 2nd peck, sometimes the 9th — pecks *frantically*, almost without stopping. Unpredictable reward creates the strongest checking habit known to psychology. Casinos have run on this for a century: the *maybe* is the hook.\n\nNow look at your feed. Every swipe is a lever pull: maybe the next reel is boring… maybe it's the funniest thing you'll see all week. **You never know — and that's precisely why your thumb keeps moving.** The brain chemical involved, dopamine, is often called the pleasure chemical, but it is really the **anticipation** chemical. It spikes hardest not when you get the reward, but on the *maybe* just before.`),
    heading('It\'s not a fair fight — and it\'s not your fault'),
    text(`Your feed is not a random collection of videos. Behind it, ranking systems test thousands of variations to find exactly what keeps *you specifically* watching — and feed you more of it. On one side: a teenager with homework. On the other: some of the most sophisticated attention-capture technology ever built.\n\nSo drop the shame. Feeling "addicted to reels" is not a character flaw; it is a normal brain responding exactly as the machine intends. Now re-read the verse above. **Dwelling → attachment → craving → restlessness.** The Gita mapped this exact loop about two thousand years before the infinite scroll existed. The seers weren't describing phones — they were describing the machinery of the mind that phones now exploit.\n\nAnd knowing the blueprint changes the game: you can't out-willpower a slot machine, but you *can* refuse to sit at it — and you can practise watching the pull instead of obeying it. That is today's exercise.`),
    quiz([
      { q: 'Which reward pattern creates the strongest checking habit?', opts: ['A reward every single time', 'A reward at fixed times', 'An unpredictable, sometimes-yes-sometimes-no reward', 'No reward at all'], a: 2, why: 'Variable (unpredictable) reward is the slot-machine pattern — and the feed pattern. The "maybe" is the hook.', lvl: 1 },
      { q: 'Dopamine spikes hardest…', opts: ['After a big meal only', 'On the anticipation — the "maybe" just before a possible reward', 'Only while sleeping', 'When something is 100% guaranteed'], a: 1, why: 'It is the anticipation chemical more than the pleasure chemical — which is why the next-swipe "maybe" is so gripping.', lvl: 2 },
      { q: 'The Gita\'s chain in 2.62 runs: dwelling → attachment → … → restlessness. Fill the gap.', opts: ['Craving', 'Sleep', 'Anger at others', 'Forgetting'], a: 0, why: 'Repeated dwelling breeds attachment, attachment breeds craving — and blocked craving becomes agitation. The scroll loop, mapped 2,000 years early.', lvl: 2 },
    ]),
    gp({
      practice_kind: 'observation',
      title: 'Urge Surfing',
      intro: 'You will sit near your phone and NOT check it — while watching what the pull feels like. Urges rise, peak, and fall like waves. You are learning to surf one.',
      steps: [
        { instruction: 'Place your phone face-down within arm\'s reach. Yes, really.' },
        { instruction: 'Sit and watch the urge to check it. Where do you feel the pull — hands, chest, a voice in the head? Count each wave that rises. Let every wave pass without acting.', duration_sec: 120 },
      ],
      completion_note: 'You just proved the most useful fact about urges: they pass on their own if you don\'t feed them. The wave rises, peaks — and falls. Every surfed wave weakens the next one.',
    }),
    journal('Which app pulls you hardest, and at what time of day? During urge surfing, where did you physically feel the pull, and how many waves did you count?', 20),
    text(`**Tonight:** you're allowed a scroll session — but set a timer *before* you open the app, for however long you honestly want. When it rings, stand up and notice what the machine says to you at that moment. Just notice it.`),
  ],
});

// ─── Page 4 — The Multitasking Myth ──────────────────────────────────────────
reset();
PAGES.push({
  slug: 'the-multitasking-myth',
  title: 'The Multitasking Myth',
  subtitle: '"I study with WhatsApp open and reply fast" — let\'s test that claim',
  page_number: 4,
  blocks: [
    hero('A railway junction where a single train rapidly switches between two tracks, signals flashing',
      'A hand-drawn railway junction seen from above: one train zig-zagging between two parallel tracks labelled with a book icon and a chat-bubble icon, with visible skid marks and lost time at every switch point.'),
    verse('From the Bhagavad Gita (2.41)',
      'व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन। बहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम्॥',
      'जो ठान लेता है, उसकी बुद्धि एक होती है — एक निशाना। जो तय नहीं कर पाता, उसका मन हज़ार टहनियों में बँटा रहता है।',
      'The resolute mind is one-pointed. The irresolute mind splits into endless branches.'),
    curiosity('Your friend says: "I study better with WhatsApp open — I reply in five seconds and get right back." Is the cost of that reply really five seconds?'),
    heading('Your brain doesn\'t multitask — it switches'),
    text(`For two *thinking* tasks — solving a maths problem and reading a chat — the brain cannot run both at once. What feels like multitasking is actually **rapid switching**: maths-chat-maths-chat, like that train jumping tracks. And every single switch has a **restart cost** — a few moments of "wait, where was I?" while the brain reloads the problem.\n\nWorse, psychologists find that after you switch back, a piece of your mind *stays behind* with the chat for several minutes. This is called **attention residue**: you are looking at the maths, but part of the spotlight is still lighting up "what will they reply?" You are now studying with, say, 70% of a beam — and 70% attention on a hard problem often means 0% solved.`),
    heading('Do the maths on "just five seconds"'),
    text(`One quick reply = 5 seconds of typing + a couple of minutes of residue before your focus fully returns. Have that exchange 20 times in an evening and the *typing* cost was under 2 minutes — but the *focus* cost quietly ate a huge slice of your study time. Same hours at the desk, half the learning. That is why "I studied all evening" and "nothing went in" can both be true.\n\nThe verse names the two states precisely: **one-pointed** versus **thousand-branched**. Note what it does *not* say — it doesn't say the branched person is lazy or less intelligent. They're often working *harder*, running up and down all those branches. One-pointed is simply the only mode where deep work happens. And it's a choice you make *before* sitting down, not a talent.`),
    quiz([
      { q: 'When you "multitask" two thinking tasks, your brain actually…', opts: ['Runs both in parallel smoothly', 'Switches rapidly between them, paying a restart cost each time', 'Does the harder one automatically', 'Gets faster with practice at true parallel work'], a: 1, why: 'Two attention-demanding tasks can\'t run in parallel — the brain toggles, and every toggle costs a reload.', lvl: 1 },
      { q: '"Attention residue" means…', opts: ['Tiredness after studying', 'Part of your mind staying with the previous task for minutes after switching', 'Forgetting the syllabus', 'Dust on your desk'], a: 1, why: 'After a switch, a slice of the spotlight lingers on the old task — so you work at partial beam.', lvl: 2 },
      { q: 'A 5-second WhatsApp reply during maths really costs about…', opts: ['5 seconds', 'Nothing if you type fast', 'A few minutes of reduced-quality focus from residue and restart', 'One full hour, always'], a: 2, why: 'The typing is 5 seconds; the residue and reload around it eat minutes of quality focus. Twenty replies quietly eat the evening.', lvl: 3 },
    ]),
    gp({
      practice_kind: 'focus_timer',
      title: 'The 10-Minute One-Track Sprint',
      intro: 'A taste of one-pointed mode. Small task, total commitment, ten minutes.',
      steps: [
        { instruction: 'Pick ONE small, real task — ten maths problems, one page of reading, one diagram to label.' },
        { instruction: 'Phone on silent, out of arm\'s reach. Only the task on the desk.' },
        { instruction: 'Work on only this. When the urge to switch arrives — and it will — notice it like a wave from yesterday\'s practice, let it pass, continue.', duration_sec: 600 },
      ],
      completion_note: 'Ten minutes of one-track work. Notice the quality — how far you got, how it felt once you settled. That settling feeling is what the branched mode never lets you reach.',
    }),
    journal('During the sprint, when the switch-urge hit: what exactly did it promise you? ("Just check one thing…") Did the promise feel urgent afterwards, or fake?', 15),
    text(`**Tomorrow:** run one homework subject entirely in one-track mode — chats closed, replies batched for after. Compare how much you finish against a normal branched evening.`),
  ],
});

// ─── Page 5 — Dhāraṇā: The Original Attention Training ───────────────────────
reset();
PAGES.push({
  slug: 'dharana-the-original-attention-training',
  title: 'Dhāraṇā: The Original Attention Training',
  subtitle: 'Two thousand years before "focus apps," India wrote the training manual',
  page_number: 5,
  blocks: [
    hero('A student sitting cross-legged before a single earthen diya flame in a dark calm room',
      'A teenager in simple clothes sits cross-legged on a mat before a single small earthen diya, its steady flame the brightest point; the room around is calm, dark and uncluttered.'),
    verse('From the Yoga-sūtra of Patañjali (3.1–3.2)',
      'देशबन्धश्चित्तस्य धारणा। तत्र प्रत्ययैकतानता ध्यानम्॥',
      'मन को एक जगह बाँधना — यह धारणा है। वहीं टिके रहना, बिना टूटे — यह ध्यान है।',
      'Binding the attention to one place is dhāraṇā. When it stays there in an unbroken stream, that is dhyāna.'),
    curiosity('There\'s a gym for your body in every neighbourhood. Where\'s the gym for your attention?',
      'It existed. It had a written training manual — and you just read its two most famous lines above.'),
    heading('A two-line training manual'),
    text(`Around two thousand years ago, Patañjali compressed attention training into a ladder. The rung that matters for us is the first one: **dhāraṇā** — *deśa-bandha*, literally "binding to one place." Choose one object — the breath, a flame, a sound — and place your attention there. Hold. When it slips, place it back.\n\nSound familiar? It is exactly the return-rep you've been doing since page 2. The tradition simply discovered it first, practised it systematically, and — this is the part most people miss — **expected the slipping**. Dhāraṇā isn't the state of never wandering. It is the *practice* of re-binding, over and over. When the re-binding matures into an unbroken stream, that deeper state gets its own name: **dhyāna**. You don't chase dhyāna. You do the reps; the stream comes on its own.`),
    heading('Why "failing" is the exercise'),
    text(`Think of a bicep curl. The effort of lifting *is* the exercise — nobody calls the heaviness "failing at holding the dumbbell up." Attention works the same way: **the wander-notice-return cycle is the curl.** A session where your mind wandered thirty times and you returned thirty times is not a failed session. It is thirty repetitions.\n\nModern psychology, studying meditation with brain imaging, keeps arriving at the same structure: repeated attention-returning strengthens the brain networks that notice distraction and re-aim the beam. Different vocabulary, same manual. Krishna's promise in the Gita — the mind is restless, *and* it yields to abhyāsa, steady practice — is page 10's whole plan. Today you just do your first proper set.`),
    quiz([
      { q: 'Dhāraṇā means…', opts: ['Emptying the mind of all thoughts forever', 'Binding attention to one chosen place, and re-binding when it slips', 'Sleeping while sitting', 'Thinking many thoughts at once'], a: 1, why: 'Deśa-bandha — binding to one place. The re-binding after every slip is part of the practice, not a failure of it.', lvl: 1 },
      { q: 'In a 3-minute sit, your mind wandered 30 times and you returned 30 times. That session was…', opts: ['A failure — too much wandering', 'A waste of time', 'Thirty repetitions of exactly the right exercise', 'Proof you can\'t meditate'], a: 2, why: 'The return IS the rep. Thirty returns = thirty attention push-ups.', lvl: 2 },
      { q: 'What is the relationship between dhāraṇā and dhyāna?', opts: ['They are unrelated practices', 'Dhyāna is what dhāraṇā matures into when attention holds as an unbroken stream', 'Dhāraṇā is only for monks', 'Dhyāna comes first, then dhāraṇā'], a: 1, why: 'Yoga-sūtra 3.2: when the bound attention flows without breaks, that continuity is dhyāna. You do the reps; the stream arrives by itself.', lvl: 3 },
    ]),
    gp({
      practice_kind: 'meditation',
      title: 'Breath-Counting Dhāraṇā',
      intro: 'The classic first exercise. Your one place: the breath. Your counter keeps you honest.',
      steps: [
        { instruction: 'Sit upright but relaxed — on a chair is fine. Hands rest anywhere comfortable. Eyes closed or half-closed.' },
        { instruction: 'Breathe normally. Count each exhale silently: one… two… up to ten, then start again at one.' },
        { instruction: 'When you notice you\'ve lost count or drifted off — that\'s a rep! — smile inwardly, return to the breath, restart from one.', duration_sec: 180 },
      ],
      completion_note: 'However many times you restarted from one — that was your rep count, and every single one strengthened the noticing muscle. This exact practice, done daily, is the core of the 7-day challenge coming on page 10.',
    }),
    journal('Where did your mind go during the sit — plans, replays, songs? And by the final minute, did the returning feel even slightly quicker than at the start?', 20),
    text(`**Tonight:** one bonus set — two minutes of breath-counting before sleep, lying down is fine. Notice whether the day\'s noise settles a little faster.`),
  ],
});

// ─── Page 6 — Breath: The Remote Control ─────────────────────────────────────
reset();
PAGES.push({
  slug: 'breath-the-remote-control',
  title: 'Breath: The Remote Control',
  subtitle: 'The one dial on your body\'s alarm system that your hands can reach',
  page_number: 6,
  blocks: [
    hero('A calm pair of lungs drawn as slow rolling waves inside a torso outline',
      'A gentle anatomical outline of a torso where the lungs are drawn as slow, calm ocean waves rolling in and out; a small dial or slider labelled with a wave icon sits beside the heart.'),
    verse('From the Yoga-sūtra of Patañjali (1.34)',
      'प्रच्छर्दनविधारणाभ्यां वा प्राणस्य॥',
      'मन शांत करना हो तो साँस से शुरू करो — धीरे से पूरी साँस बाहर छोड़ो और एक पल रुको।',
      'Calm also comes from the slow release, and gentle holding, of the breath.'),
    curiosity('Watch any cricketer before a crucial ball, any shooter before pulling the trigger. What is the last thing they all do?',
      'Watch the shoulders. Watch the lips.',
      'A long, slow exhale. Across every sport, every country — the same move. Today you learn why it works.'),
    heading('The only dial you can turn by hand'),
    text(`Your body has an automatic alarm system. Heartbeat, sweating, the knot in your stomach before a test — all run on autopilot; you cannot decide your heart into slowing down. But there is exactly **one** function on that panel that is *both* automatic *and* manual: **breathing**. It runs itself all day, yet the moment you choose, you can take the controls.\n\nAnd here is the trick the athletes use: the exhale is wired to the body's **calm-down system** (the brake, not the accelerator). A slow, long exhale — longer than the inhale — presses that brake: the heart slows a touch, the shoulders drop, the alarm quiets. Your grandmother's *"लंबी साँस लो, बेटा"* was not just comfort — it was engineering. The breath is a remote control for the alarm, and the long exhale is the volume-down button.`),
    heading('The 4-4-6 pattern'),
    text(`The practice below uses a simple rhythm: **in for 4, hold for 4, out for 6**. The only rule that truly matters: **the exhale stays longer than the inhale.** That asymmetry is what presses the brake.\n\nWhere this belongs in your life:\n\n- **Before** — a test paper is placed on your desk; you\'re about to speak in class\n- **After** — an argument, a bad mark, a scary near-miss on the road\n- **During** — a study session where the mind is spinning too fast to settle\n\nSix rounds take under two minutes. It is the fastest tool in this whole chapter — and the one you\'ll use for life.`),
    quiz([
      { q: 'Why does the pattern make the exhale LONGER than the inhale?', opts: ['It\'s easier to time', 'The long exhale activates the body\'s calm-down system — the brake', 'To use less oxygen', 'No reason; any pattern is identical'], a: 1, why: 'The exhale is wired to the parasympathetic "brake." Making it longer than the inhale is what slows the alarm.', lvl: 2 },
      { q: 'Breathing is special among body functions because…', opts: ['It only works when you think about it', 'It is fully manual', 'It is automatic AND can be taken over by choice — the one dial you can turn by hand', 'It stops during sleep'], a: 2, why: 'Heartbeat and sweating are autopilot-only. Breath runs automatically but accepts manual control — your doorway into the alarm system.', lvl: 1 },
    ]),
    gp({
      practice_kind: 'breathing',
      title: 'The 4-4-6 Reset',
      intro: 'Six rounds, under two minutes. Follow the circle — grow with the inhale, pause, shrink with the exhale.',
      steps: [
        { instruction: 'Sit or stand comfortably. Drop the shoulders once, on purpose.' },
        { instruction: 'Breathe through the nose if you can. Follow the circle — no forcing, just riding the rhythm.' },
      ],
      breath_pattern: { inhale_sec: 4, hold_sec: 4, exhale_sec: 6, cycles: 6 },
      completion_note: 'Check your shoulders. Check the speed of your thoughts. That small shift you feel — you did that, with the only dial on the alarm panel your hands can reach.',
    }),
    journal('Where in your body did you feel the exhale land — shoulders, chest, jaw, stomach? Now pick YOUR trigger moment: before which class, test or situation will you fire the 4-4-6 this week?', 15),
    text(`**Today:** use the 4-4-6 once in the wild, at the trigger moment you just wrote. A tool only becomes yours the first time you use it outside the gym.`),
  ],
});

// ─── Page 7 — Design Your Environment ────────────────────────────────────────
reset();
PAGES.push({
  slug: 'design-your-environment',
  title: 'Design Your Environment',
  subtitle: 'Willpower is overrated. The topper\'s real secret is often just a boring desk',
  page_number: 7,
  blocks: [
    hero('Two desks side by side: one cluttered with a glowing phone, one bare with a single book and lamp',
      'A split scene of two study desks: the left one crowded — phone face-up, snacks, tangled earphones, comic books; the right one almost empty — one open textbook, one notebook, a small lamp, a glass of water. The empty desk feels calm and inviting.'),
    verse('From the Bhagavad Gita (6.11)',
      'शुचौ देशे प्रतिष्ठाप्य स्थिरमासनमात्मनः। नात्युच्छ्रितं नातिनीचं चैलाजिनकुशोत्तरम्॥',
      'अभ्यास से पहले जगह तैयार करो — साफ़ जगह, ठीक ऊँचाई का स्थिर आसन। पहले माहौल, फिर मन।',
      'First establish the place: clean, steady, a seat neither too high nor too low. The tradition prepared the environment before attempting the mind.'),
    curiosity('Two students, equal marks, equal hours. One fights the urge to check the phone forty times an evening; the other never feels the urge at all. What\'s the second one\'s trick?',
      'It is not stronger willpower.',
      'The phone is in another room. You cannot lose a battle that never starts.'),
    heading('Your brain bills you for everything in sight'),
    text(`Psychologists ran a now-famous experiment: students solved attention-heavy problems with their phone (a) on the desk, (b) in their bag, or (c) in another room. The phones were **silent and face-down** in every case. Result: **another-room students clearly outperformed desk students** — even the ones who swore the phone wasn\'t bothering them.\n\nThe explanation is your spotlight again: keeping the beam *away* from a visible temptation is itself work. A phone in view is a running background cost — a little bit of your attention spent all evening on *not* looking at it. The brain bills you for everything in sight. Which flips the whole problem: instead of buying more willpower, **remove the things that charge rent on your beam.**`),
    heading('Friction design: 1 step vs 5 steps'),
    text(`The tradition understood this — re-read the verse: Krishna specifies the *place* before the practice. Clean spot, steady seat, right height. Environment first, mind second.\n\nThe modern version is called **friction design**:\n\n- Make the good thing **one step away**: tonight\'s textbook already open on the desk; water bottle filled; notebook and pen out.\n- Make the tempting thing **five steps away**: phone in another room; games logged out; the app you binge moved off the home screen.\n\nNo rule says you can never scroll. The rule is only: **the scroll must cost five steps while the book costs one.** Willpower decides maybe a handful of battles a day. Design decides the other hundred before they begin.`),
    quiz([
      { q: 'In the phone experiment, students did best when the phone was…', opts: ['Face-down on the desk', 'In their bag', 'In another room entirely', 'In their hand, on silent'], a: 2, why: 'Even silent and face-down, a visible/nearby phone taxed attention. Out of the room = the battle never starts.', lvl: 1 },
      { q: 'Friction design means…', opts: ['Studying with music', 'Making good actions 1 step away and temptations 5 steps away', 'Deleting all apps forever', 'Studying only when motivated'], a: 1, why: 'You pre-decide the hundred daily battles by rearranging steps, instead of fighting each one with willpower.', lvl: 2 },
    ]),
    gp({
      practice_kind: 'custom',
      title: 'The 5-Step Desk Reset',
      intro: 'Not a thought experiment — actually do each step now. Five minutes, once, keeps paying every evening.',
      steps: [
        { instruction: 'Take your phone out of this room right now. Another room, a drawer far away — anywhere your eyes can\'t land on it. Come back without it.' },
        { instruction: 'Clear the desk of everything except ONE subject — tonight\'s book, one notebook, one pen.' },
        { instruction: 'Fill a bottle or glass of water and put it on the desk, so thirst can\'t become a phone trip.' },
        { instruction: 'Open the book to the exact page you\'ll start from — make starting a one-step action.' },
        { instruction: 'Look at the result for ten seconds. This boring, calm desk is what a topper\'s "discipline" actually looks like.' },
      ],
      completion_note: 'Environment set. Krishna would approve — the place is ready before the practice. Notice tonight how much less you have to "resist."',
    }),
    journal('What did you move off your desk just now? And be honest — what is the ONE thing still within reach that shouldn\'t be? (That one is your real enemy this week.)', 15),
    text(`**Tonight:** study one full session at the reset desk, phone in the other room. Count how many times you *would have* checked it — each one is a battle you won without fighting.`),
  ],
});

// ─── Page 8 — The 25-Minute Sprint ───────────────────────────────────────────
reset();
PAGES.push({
  slug: 'the-25-minute-sprint',
  title: 'The 25-Minute Sprint',
  subtitle: 'Nobody can focus for four hours. Good news: you don\'t have to',
  page_number: 8,
  blocks: [
    hero('A sand timer beside an open notebook, a small parking list of stray thoughts pinned nearby',
      'A large hourglass with sand mid-flow next to an open notebook with neat work; pinned beside them a small scrap of paper titled with a parking icon holding three scribbled stray thoughts.'),
    verse('From the Bhagavad Gita (2.47)',
      'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      'तुम्हारा हक़ सिर्फ़ काम पर है, नतीजे पर नहीं। काम में डूबो — नतीजा गिनना छोड़ो।',
      'Your claim is on the work itself, never on its results. Sink into the action; stop counting the outcome.'),
    curiosity('"Beta, focus for four hours straight" — have you ever actually met anyone who can?',
      'Neither has science.',
      'Sustained attention runs in waves, not marathons. The trick isn\'t a longer beam — it\'s working in sprints sized to the beam you have.'),
    heading('The sprint protocol'),
    text(`Attention is a sprinter, not a marathon runner. So we stop pretending otherwise and structure the work around it:\n\n1. **One task.** Chosen before you sit. Written at the top of the page.\n2. **Phone in the other room** (page 7 already taught you why).\n3. **25 minutes on the clock.** Only this task exists. Not "study" — *this exercise set, this chapter section*.\n4. **5-minute real break.** Stand, walk, water, window. **Not reels** — a feed break floods the beam and imports fresh attention residue, so you\'d start the next sprint pre-scattered. A boring break keeps the gains.\n5. Repeat. Two sprints is a solid evening for a beginner; four is a strong one.\n\nWhy 25? It\'s short enough that starting doesn\'t feel scary — anyone can suffer for 25 minutes — and long enough to reach the settled, deep zone you touched on page 4.`),
    heading('The parking list (and Krishna\'s clock rule)'),
    text(`Two enemies will attack mid-sprint.\n\n**Stray thoughts** — *"reply to Aman", "what\'s for dinner"*. Keep a scrap of paper beside you: the **parking list**. Thought arrives → park it in three words → back to work. It\'ll wait; it always does. The urge dies the moment it\'s written down, because the brain trusts paper.\n\n**Clock-checking** — *"how much longer? am I doing enough?"* That is attention leaking to the *result*. Re-read the verse: your claim is on the work, not the fruit. During the 25 minutes, progress is not your business — the problem in front of you is. The timer worries about time so you don\'t have to. That\'s the deal that makes the sprint work — and it\'s a 2,000-year-old deal.`),
    quiz([
      { q: 'The 5-minute break between sprints should be…', opts: ['A quick reels session as a reward', 'Standing, walking, water — something screen-free and boring', 'Starting a second task', 'Skipped, to save time'], a: 1, why: 'A feed break imports fresh attention residue, so the next sprint starts pre-scattered. Boring breaks protect the gains.', lvl: 2 },
      { q: 'A stray thought ("reply to Aman!") hits mid-sprint. Best move?', opts: ['Reply quickly — it takes 5 seconds', 'Suppress it with pure willpower', 'Park it in 3 words on the parking list and return to work', 'End the sprint'], a: 2, why: 'Writing it down kills the urge — the brain trusts paper. Replying costs minutes of residue (page 4 maths).', lvl: 2 },
      { q: 'How does Gita 2.47 apply inside a sprint?', opts: ['Never take breaks', 'Don\'t monitor "how much have I done" mid-sprint — sink into the problem; the timer owns the clock', 'Work only when inspired', 'Results don\'t matter in life'], a: 1, why: 'Clock-checking and progress-counting is attention leaking to the fruit. During the sprint, the work is your only claim.', lvl: 3 },
    ]),
    gp({
      practice_kind: 'focus_timer',
      title: 'Your First Real Sprint',
      intro: 'Not a demo — an actual 25 minutes of your actual homework. Set up, then commit.',
      steps: [
        { instruction: 'Write ONE task at the top of a page — specific, like "Exercise 7.2, questions 1–8".' },
        { instruction: 'Phone out of the room. Parking-list scrap of paper beside you, pen ready.' },
        { instruction: 'Sprint. One task. Park strays. Let the timer own the clock.', duration_sec: 1500 },
      ],
      completion_note: 'Sprint one, done. Now take a REAL break — stand up, walk, drink water. No feed. Check your parking list: how many "urgent" things turned out to be nothing?',
    }),
    journal('Sprint report: how many thoughts did you park? Which minute was hardest? And how did minutes 15–25 compare to minutes 0–5?', 20),
    text(`**Tomorrow:** two sprints, back to back with one real break. This exact protocol becomes your daily rep in the 7-day challenge — two pages from now.`),
  ],
});

// ─── Page 9 — Sleep: The Night Shift of Memory ───────────────────────────────
reset();
PAGES.push({
  slug: 'sleep-the-night-shift-of-memory',
  title: 'Sleep: The Night Shift of Memory',
  subtitle: 'The filing clerk who saves today\'s study — and how late-night scrolling robs him twice',
  page_number: 9,
  blocks: [
    hero('A student asleep while a small librarian figure files the day\'s pages into a permanent shelf under moonlight',
      'A student asleep at peace; from their head a gentle dotted line leads to a tiny librarian figure on a ladder, moving loose handwritten pages from a messy "today" tray into a grand permanent bookshelf, under a crescent moon through the window.'),
    verse('From the Bhagavad Gita (6.17)',
      'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु। युक्तस्वप्नावबोधस्य योगो भवति दुःखहा॥',
      'जिसका खाना, चलना-फिरना, काम और नींद — सब नपा-तुला है, उसी की साधना टिकती है। नींद भी अभ्यास का हिस्सा है।',
      'For one measured in food, in activity, in effort — and in sleep and waking — the practice destroys suffering. Sleep is part of the discipline, not a break from it.'),
    curiosity('You studied till 1 AM before the test — and in the exam hall, it was all… gone. If you truly studied it, where did it go?',
      'It\'s not your memory that failed.',
      'It was never filed. The filing happens during sleep — and you cancelled the night shift to study.'),
    heading('The save button is pressed at night'),
    text(`During the day, everything you learn is held in a fast but **temporary** store — think of a rough notebook that gets erased and reused. The move into **permanent** storage happens later, mostly while you sleep: the sleeping brain literally replays the day\'s learning and files it away shelf by shelf. Memory researchers can watch this replay happen.\n\nSo: **study till 1 AM and sleep five hours, and you took great notes and then fired the filing clerk.** The material was in the temporary store when you closed the book — and much of it never made the transfer. "I knew it last night, I swear" is usually a true statement… about the rough notebook that got erased.\n\nTeenagers\' filing shift needs roughly **8–9 hours**. That is not laziness; that is the job taking as long as the job takes. One hour less sleep to study one extra chapter is very often a *losing* trade — you weaken the filing of everything else you studied that day.`),
    heading('The double theft of late-night scrolling'),
    text(`Now stack yesterday\'s lessons onto tonight. The last-hour scroll robs you **twice**:\n\n- **It delays the shift.** Bright screen light tells the brain "it\'s still daytime," pushing sleep later — and the feed\'s slot-machine *maybe* (page 3) makes "one more reel" beat "sleep now" every single round.\n- **It pollutes the shift.** You fall asleep with a beam full of fresh residue — sixty half-watched clips fighting your chemistry chapter for filing priority.\n\nThe verse calls sleep *part of the practice* — yukta-svapna, measured sleep, sits in the same list as effort itself. The tradition counted rest as training. Tonight\'s exercise is simply to act like it.`),
    quiz([
      { q: 'When does today\'s learning move into permanent memory?', opts: ['The instant you read it', 'Mostly during sleep, when the brain replays and files the day', 'Only during revision', 'During breakfast'], a: 1, why: 'The sleeping brain replays the day\'s learning and transfers it from temporary to permanent storage. Cut sleep = cancel filing.', lvl: 1 },
      { q: 'Studying till 1 AM before an exam usually backfires because…', opts: ['Late hours are unlucky', 'The extra chapter is held in temporary storage but the shortened sleep means poor filing of EVERYTHING studied', 'Teachers can tell', 'Coffee stops working'], a: 1, why: 'You traded the filing shift for one more chapter — weakening the save of the whole day\'s work.', lvl: 2 },
      { q: 'Late-night scrolling is a "double theft" because it…', opts: ['Costs data and battery', 'Delays sleep (screen light + slot-machine loop) AND fills the mind with residue that competes for filing', 'Makes the phone hot', 'Is only single theft'], a: 1, why: 'Theft one: sleep starts later. Theft two: what sleep you get files reels residue alongside your chapters.', lvl: 3 },
    ]),
    gp({
      practice_kind: 'custom',
      title: 'Tonight\'s Wind-Down',
      intro: 'Three commitments for tonight — make them now, while you mean it. Tonight you protect the night shift.',
      steps: [
        { instruction: 'Decide your lights-out time right now, counting back 8–9 hours from when you must wake. Say it out loud.' },
        { instruction: 'Move your charger out of the bedroom (or across the room) — the phone sleeps where you can\'t reach it from bed.' },
        { instruction: 'Choose your screen-free last 30 minutes: paper book, tomorrow\'s bag, family, or the 2-minute breath-count from page 5.' },
      ],
      completion_note: 'The clerk works tonight. Tomorrow, notice one thing: how much of today\'s study still feels "in there" in the morning.',
    }),
    journal('Describe your usual last hour before sleep — honestly, minute by minute. Which single swap from tonight\'s wind-down will be hardest for you, and why?', 25),
    text(`**Tonight:** run the wind-down exactly as committed. Tomorrow morning, before checking anything else, notice how waking up feels after a protected night shift.`),
  ],
});

// ─── Page 10 — Your 7-Day Focus Challenge (post-check + tracker) ─────────────
reset();
PAGES.push({
  slug: 'your-7-day-focus-challenge',
  title: 'Your 7-Day Focus Challenge',
  subtitle: 'You have the tools. Now the only thing left is reps',
  page_number: 10,
  blocks: [
    hero('Seven stepping stones crossing a calm river toward a sunrise, the first stones already footprinted',
      'Seven flat stepping stones cross a calm dark river toward a soft dawn on the far bank; the first two stones carry gentle footprints, the rest wait; a small figure with a backpack stands mid-crossing, steady.'),
    verse('From the Bhagavad Gita (6.35)',
      'असंशयं महाबाहो मनो दुर्निग्रहं चलम्। अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥',
      'कृष्ण खुद मानते हैं — मन को पकड़ना मुश्किल है, बेशक। पर अभ्यास से पकड़ में आ जाता है। रोज़ का अभ्यास — बस यही रास्ता है।',
      '"Yes — the mind is restless and hard to hold, no argument," says Krishna. "But by abhyāsa — steady practice — it comes to hand."'),
    text(`Nine pages ago, attention was something that just *happened* to you. Now look at your toolkit: you know the **spotlight** and the return-rep, the **slot machine** inside the feed and how to surf its urges, the true cost of **switching**, the ancient **dhāraṇā** rep, the **4-4-6** remote control, **friction design**, the **25-minute sprint**, and the **night shift** that files it all away.\n\nArjuna — a warrior who could hit a fish\'s eye in a reflection — complains in the Gita that controlling the mind feels harder than controlling the wind. Krishna\'s answer is the verse above, and notice what it is *not*: not a trick, not a secret, not a talent. **Abhyāsa.** Steady daily practice. That is the entire remaining syllabus of this chapter — and nobody can do it for you.`),
    heading('First: re-measure yourself'),
    text(`Before the challenge begins, take the exact test you took on page 1. Same object, same 60 seconds, same honest counting. Then compare numbers below.`),
    gp({
      practice_kind: 'observation',
      title: 'The 60-Second Stillness Test — Round 2',
      intro: 'Identical to page 1. Your wander-count is the score. Let\'s see what nine pages of reps did.',
      steps: [
        { instruction: 'Pick a small object you can see — the same kind of thing as last time.' },
        { instruction: 'Rest your attention on it. Count each wander silently, return each time.', duration_sec: 60 },
      ],
      completion_note: 'Hold both numbers in your head — page 1\'s and today\'s — and write the comparison below while it\'s fresh.',
    }),
    journal('Round 1 count vs Round 2 count — write both. Even if the numbers are close, what feels different about HOW you return now? Finally: write one sentence to the you of ten pages ago.', 30),
    heading('The challenge rules'),
    text(`One rep a day, seven days. The rep is the full stack you\'ve already practised:\n\n1. **Desk reset** (page 7) — phone in another room, one subject out.\n2. **One 25-minute sprint** (page 8) — one written task, parking list beside you.\n3. **Check in below** — same day, every day.\n\nThree rules of mercy, because this is training, not punishment:\n\n- A sprint that felt scattered **still counts**. You sat, you returned, you finished — that\'s the rep.\n- **Missed a day? No guilt, no restart-from-zero.** The streak that matters is the one you restart. Continue today.\n- After day 7, don\'t stop — but day 7 is when you\'ve earned the right to call this *your* habit instead of this book\'s idea.`),
    tracker({
      title: 'The 7-Day Focus Challenge',
      habit: 'One 25-minute focus sprint — phone in another room, one written task, parking list ready.',
      duration_days: 7,
      why: 'Attention is a muscle. Seven consecutive days of reps is where students first FEEL the difference — abhyāsa, made measurable.',
    }),
    text(`**After day 7:** two things. First, take the 60-second test one more time — that\'s your proof, in your own numbers. Second, the next chapter takes the same toolkit into rougher weather: **stress, pressure and exam-hall nerves**. The reps continue; the arena changes. See you there.`),
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

    // 1. Book (insert-if-absent)
    let book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) {
      book = {
        _id: uuidv4(), slug: BOOK_SLUG, title: BOOK_TITLE,
        subject: 'life_skills', grade: 9, board: 'custom',
        chapters: [], is_published: false,
        deleted_at: null, created_at: now, updated_at: now,
      };
      await books.insertOne(book);
      console.log(`✓ Created book: ${BOOK_TITLE} (${book._id})`);
    } else {
      console.log(`✓ Book exists: ${book.title} (${book._id})`);
    }

    // 2. Chapter shell (insert-if-absent)
    if (!(book.chapters || []).some(c => c.number === CHAPTER.number)) {
      await books.updateOne({ _id: book._id }, {
        $push: { chapters: { number: CHAPTER.number, title: CHAPTER.title, slug: CHAPTER.slug,
          page_ids: [], description: 'Train your attention like a muscle — from the spotlight model and the reels loop to dhāraṇā, sprints and the 7-day challenge.',
          is_published: false } },
        $set: { updated_at: now },
      });
      console.log(`✓ Added Chapter ${CHAPTER.number}: ${CHAPTER.title}`);
    } else {
      console.log(`✓ Chapter ${CHAPTER.number} already present.`);
    }

    // 3. Pages (insert-if-absent, by book_id + slug)
    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) { console.log(`  ⤷ "${p.slug}" exists — skipping.`); pageIds.push(String(existing._id)); continue; }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId, book_id: String(book._id), chapter_number: CHAPTER.number,
        page_number: p.page_number, slug: p.slug, title: p.title, subtitle: p.subtitle,
        blocks: p.blocks, hinglish_blocks: [], tags: ['life-skills', 'focus'],
        published: false, reading_time_min: 6,
        created_at: now, updated_at: now,
      });
      pageIds.push(pageId);
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks, id ${pageId})`);
    }

    // 4. Wire pages into the chapter
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

    console.log('\n✅ Life Skills — Class 9 · Chapter 1 "Focus & Attention" — setup complete (10 pages, published:false).');
  } finally { await client.close(); }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
